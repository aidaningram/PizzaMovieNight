import { firebaseConfig } from "./firebase-config.js";

const FAMILY_PASSWORD = "dogcatpig3";
const FAMILY_ID = "pizza-movie-night";
const FIREBASE_READY = !Object.values(firebaseConfig).some((value) => value.startsWith("PASTE_"));
const appRoot = document.querySelector("#app");
const templates = {
  login: document.querySelector("#login-template"),
  home: document.querySelector("#home-template"),
  wheel: document.querySelector("#wheel-template"),
  add: document.querySelector("#add-template"),
  movieList: document.querySelector("#movie-list-template")
};
const colors = ["#e85d75", "#f4a261", "#2a9d8f", "#457b9d", "#b8c0ff", "#f2cc8f", "#81b29a", "#c77dff"];
const sessionKey = "pizzaMovieSession";

let services = null;
let currentUser = null;
let familyData = null;
let unsubscribeFamily = null;
let pendingWinner = null;
let appStarted = false;
let authMode = "signin";
let authReady = false;

const demoStore = {
  key: "pizzaMovieDemoStateV2",
  read() {
    return JSON.parse(localStorage.getItem(this.key) || JSON.stringify(defaultFamilyData()));
  },
  write(nextData) {
    localStorage.setItem(this.key, JSON.stringify(nextData));
    familyData = nextData;
    renderRoute();
  }
};

start().catch((error) => {
  renderLogin(friendlyAuthError(error));
});

async function start() {
  if (!appStarted) {
    window.addEventListener("hashchange", renderRoute);
    appStarted = true;
  }
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }

  if (FIREBASE_READY) {
    await initFirebase();
    return;
  }

  const session = readSession();
  if (!session) {
    renderLogin();
    return;
  }
  currentUser = { uid: session.uid, displayName: session.name, email: "" };
  familyData = demoStore.read();
  upsertMember();
  renderRoute();
}

async function initFirebase() {
  if (authReady) return;
  const firebaseApp = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
  const firebaseAuth = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js");
  const firestore = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js");
  const app = firebaseApp.initializeApp(firebaseConfig);
  services = {
    auth: firebaseAuth.getAuth(app),
    db: firestore.getFirestore(app),
    authFns: firebaseAuth,
    dbFns: firestore
  };
  authReady = true;

  services.authFns.onAuthStateChanged(services.auth, async (user) => {
    cleanupFamilyListener();
    familyData = null;
    currentUser = user;
    const session = readSession();
    if (!user || session?.uid !== user.uid || !session?.familyAccess) {
      renderLogin();
      return;
    }
    try {
      await enterFamilySpace(session);
    } catch (error) {
      renderLogin(friendlyAuthError(error));
    }
  });
}

async function enterFamilySpace(session) {
  const familyRef = services.dbFns.doc(services.db, "families", FAMILY_ID);
  const snap = await services.dbFns.getDoc(familyRef);
  if (snap.exists()) {
    await services.dbFns.updateDoc(familyRef, {
      [`members.${currentUser.uid}`]: memberRecord(),
      updatedAt: services.dbFns.serverTimestamp()
    });
  } else {
    await services.dbFns.setDoc(familyRef, firebaseFamilyData());
  }

  unsubscribeFamily = services.dbFns.onSnapshot(familyRef, (nextSnap) => {
    familyData = { ...nextSnap.data(), id: nextSnap.id };
    renderRoute();
  }, (error) => {
    renderLogin(error.message || "Firebase could not load the family wheel.");
  });
}

function renderLogin(message = "") {
  cleanupFamilyListener();
  appRoot.replaceChildren(templates.login.content.cloneNode(true));
  const form = document.querySelector("#family-login-form");
  const note = document.querySelector("#login-note");
  const nameField = document.querySelector("#family-name-input");
  const passwordField = document.querySelector("#account-password-input");
  const emailField = document.querySelector("#account-email-input");
  const resetButton = document.querySelector("#reset-password-button");
  note.textContent = message;

  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.authMode === authMode);
    button.addEventListener("click", () => {
      authMode = button.dataset.authMode;
      document.querySelectorAll("[data-auth-mode]").forEach((item) => item.classList.toggle("active", item === button));
      nameField.required = authMode === "signup";
      passwordField.autocomplete = authMode === "signup" ? "new-password" : "current-password";
      resetButton.hidden = authMode !== "signin";
      note.textContent = "";
    });
  });
  nameField.required = authMode === "signup";
  passwordField.autocomplete = authMode === "signup" ? "new-password" : "current-password";
  resetButton.hidden = authMode !== "signin";

  resetButton.addEventListener("click", async () => {
    const email = emailField.value.trim();
    if (!email) {
      note.textContent = "Enter your email first, then tap Forgot password.";
      emailField.focus();
      return;
    }
    try {
      await services.authFns.sendPasswordResetEmail(services.auth, email);
      note.textContent = "Password reset email sent. Check your inbox.";
    } catch (error) {
      note.textContent = friendlyAuthError(error);
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const accountPassword = passwordField.value;
    const familyPassword = document.querySelector("#family-password-input").value;
    if (familyPassword !== FAMILY_PASSWORD) {
      note.textContent = "That is not the family password.";
      return;
    }

    note.textContent = authMode === "signup" ? "Creating account..." : "Signing in...";
    try {
      if (FIREBASE_READY) {
        const credential = authMode === "signup"
          ? await services.authFns.createUserWithEmailAndPassword(services.auth, email, accountPassword)
          : await services.authFns.signInWithEmailAndPassword(services.auth, email, accountPassword);
        const displayName = name || credential.user.displayName || email.split("@")[0];
        if (displayName !== credential.user.displayName) {
          await services.authFns.updateProfile(credential.user, { displayName });
        }
        currentUser = { uid: credential.user.uid, displayName, email: credential.user.email || email };
        localStorage.setItem(sessionKey, JSON.stringify({
          uid: credential.user.uid,
          name: displayName,
          email,
          familyAccess: true
        }));
        location.hash = "#/home";
        await enterFamilySpace(readSession());
        return;
      }

      const session = { name, uid: `local-${slug(name)}-${crypto.randomUUID()}`, familyAccess: true };
      localStorage.setItem(sessionKey, JSON.stringify(session));
      currentUser = { uid: session.uid, displayName: name, email: "" };
      location.hash = "#/home";
      start();
    } catch (error) {
      note.textContent = friendlyAuthError(error);
    }
  });
}

function renderRoute() {
  if (!readSession()) {
    renderLogin();
    return;
  }
  if (!familyData) return;

  const route = routeName();
  if (route === "wheel") renderWheelPage();
  else if (route === "add") renderAddPage();
  else if (route === "movie-list") renderMovieListPage();
  else renderHomePage();
}

function renderHomePage() {
  appRoot.replaceChildren(templates.home.content.cloneNode(true));
  renderAppMenu();
  const name = currentUser?.displayName || readSession()?.name || "friend";
  document.querySelector("#welcome-title").textContent = `Welcome ${name} to the home of pizza movie night`;
  document.querySelector("#go-wheel-button").addEventListener("click", () => navigate("wheel"));
  document.querySelector("#go-list-button").addEventListener("click", () => navigate("movie-list"));
}

function renderWheelPage() {
  appRoot.replaceChildren(templates.wheel.content.cloneNode(true));
  renderAppMenu();
  document.querySelector("#spin-button").addEventListener("click", spinWheel);
  document.querySelector("#confirm-picked").addEventListener("click", confirmPicked);
  document.querySelector("#go-add-button").addEventListener("click", () => navigate("add"));

  const empty = activeMovies().length === 0;
  const canAdd = canCurrentUserAddMovie();
  const addPanel = document.querySelector("#empty-wheel-panel");
  document.querySelector("#spin-button").hidden = empty;
  addPanel.hidden = !canAdd;
  if (canAdd) {
    addPanel.querySelector("h2").textContent = empty ? "The wheel is empty." : "Add your movie.";
    addPanel.querySelector("p").textContent = empty
      ? "Add picks for the next pizza movie night."
      : "You can add one movie to this wheel.";
  }
  drawWheel();
}

function renderAddPage() {
  if (!canCurrentUserAddMovie()) {
    navigate("wheel");
    return;
  }

  appRoot.replaceChildren(templates.add.content.cloneNode(true));
  renderAppMenu();
  renderCandidateList();
  document.querySelector("#custom-wheel-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = document.querySelector("#custom-movie-title").value.trim();
    if (!title) return;
    await addToWheel({ title });
    navigate("wheel");
  });
}

function renderMovieListPage() {
  appRoot.replaceChildren(templates.movieList.content.cloneNode(true));
  renderAppMenu();
  renderMovieListItems();
  document.querySelector("#movie-list-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.querySelector("#movie-list-title");
    const title = input.value.trim();
    if (!title) return;
    await saveFamily({
      movieList: [
        ...movieList(),
        {
          id: crypto.randomUUID(),
          title,
          suggestedBy: displayName(),
          suggestedByUid: currentUser.uid,
          createdAt: Date.now()
        }
      ]
    });
    input.value = "";
  });
}

function renderCandidateList() {
  const list = document.querySelector("#candidate-list");
  const candidates = movieList();
  if (!candidates.length) {
    list.innerHTML = `<div class="empty-state">The Movie List is empty. Add your own movie below.</div>`;
    return;
  }

  list.replaceChildren(...candidates.map((movie) => {
    const item = document.createElement("article");
    item.className = "movie-item candidate-item";
    item.innerHTML = `
      <div>
        <h3>${escapeHtml(movie.title)}</h3>
        <p>Suggested by ${escapeHtml(movie.suggestedBy || "someone")}</p>
      </div>
      <button class="secondary-action compact-action" type="button">Add</button>
    `;
    const button = item.querySelector("button");
    button.addEventListener("click", async () => {
      await addToWheel({ title: movie.title, sourceListId: movie.id });
      navigate("wheel");
    });
    return item;
  }));
}

function renderMovieListItems() {
  const container = document.querySelector("#movie-list-items");
  const items = movieList();
  if (!items.length) {
    container.innerHTML = `<div class="empty-state">No future movies yet.</div>`;
    return;
  }

  container.replaceChildren(...items.map((movie) => {
    const item = document.createElement("article");
    item.className = "movie-list-card";
    item.innerHTML = `
      <div>
        <h3>${escapeHtml(movie.title)}</h3>
        <p>Suggested by ${escapeHtml(movie.suggestedBy || "someone")}</p>
      </div>
      <button class="remove-button" type="button" aria-label="Remove ${escapeHtml(movie.title)}">×</button>
    `;
    item.querySelector("button").addEventListener("click", () => removeFromMovieList(movie.id));
    return item;
  }));
}

async function addToWheel({ title, sourceListId = null }) {
  if (!canCurrentUserAddMovie()) return;

  const movie = {
    id: crypto.randomUUID(),
    title,
    suggestedBy: displayName(),
    suggestedByUid: currentUser.uid,
    createdAt: Date.now()
  };
  const patch = {
    movies: [...activeMovies(), movie],
    roundPicks: {
      ...roundPicks(),
      [currentUser.uid]: true
    }
  };
  if (sourceListId) {
    patch.movieList = movieList().filter((item) => item.id !== sourceListId);
  }
  await saveFamily(patch);
}

async function removeFromMovieList(movieId) {
  await saveFamily({ movieList: movieList().filter((movie) => movie.id !== movieId) });
}

function drawWheel(rotation = 0) {
  const canvas = document.querySelector("#wheel-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const movies = activeMovies();
  canvas.setAttribute(
    "aria-label",
    movies.length
      ? `Current movie wheel: ${movies.map((movie) => movie.title).join("; ")}`
      : "Current movie wheel is empty"
  );
  const center = canvas.width / 2;
  const radius = center - 18;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(rotation);

  if (!movies.length) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#1d1a29";
    ctx.fill();
    ctx.strokeStyle = "#3b354e";
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.fillStyle = "#f8efe0";
    ctx.font = "bold 44px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Wheel empty", 0, -6);
    ctx.font = "28px system-ui";
    ctx.fillText("Add the next picks", 0, 42);
    ctx.restore();
    return;
  }

  const slice = (Math.PI * 2) / movies.length;
  movies.forEach((movie, index) => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, index * slice, (index + 1) * slice);
    ctx.closePath();
    ctx.fillStyle = colors[index % colors.length];
    ctx.fill();
    ctx.strokeStyle = "#111019";
    ctx.lineWidth = 7;
    ctx.stroke();

    ctx.save();
    ctx.rotate(index * slice + slice / 2);
    ctx.translate(radius * 0.63, 0);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#111019";
    ctx.strokeStyle = "rgba(248, 239, 224, 0.35)";
    ctx.lineWidth = 5;
    ctx.font = `900 ${movies.length > 6 ? 27 : 32}px system-ui`;
    wrapCanvasText(ctx, movie.title, 0, -18, Math.min(270, radius * 0.6), movies.length > 6 ? 30 : 36);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.fillStyle = "#111019";
  ctx.fill();
  ctx.strokeStyle = "#f8efe0";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = "#f8efe0";
  ctx.font = "bold 22px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("PM", 0, 8);
  ctx.restore();
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });
  lines.push(line);
  lines.slice(0, 3).forEach((item, index) => {
    ctx.strokeText(item, x, y + index * lineHeight);
    ctx.fillText(item, x, y + index * lineHeight);
  });
}

function spinWheel() {
  const movies = activeMovies();
  if (!movies.length) return;
  const spinButton = document.querySelector("#spin-button");
  spinButton.disabled = true;
  const winnerIndex = Math.floor(Math.random() * movies.length);
  const slice = (Math.PI * 2) / movies.length;
  const target = Math.PI * 6 + (Math.PI * 1.5 - (winnerIndex * slice + slice / 2));
  const start = performance.now();
  const duration = 3200;

  function animate(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 4);
    drawWheel(target * eased);
    if (progress < 1) {
      requestAnimationFrame(animate);
      return;
    }
    pendingWinner = movies[winnerIndex];
    showWinner(pendingWinner);
    spinButton.disabled = false;
  }

  requestAnimationFrame(animate);
}

function showWinner(movie) {
  document.querySelector("#winner-title").textContent = movie.title;
  document.querySelector("#winner-meta").textContent = `Suggested by ${movie.suggestedBy || "someone"}`;
  document.querySelector("#winner-panel").hidden = false;
}

async function confirmPicked() {
  if (!pendingWinner) return;
  const picked = { ...pendingWinner, pickedAt: Date.now(), round: familyData.round || 1 };
  const movies = activeMovies().filter((movie) => movie.id !== pendingWinner.id);
  const history = [...(familyData.history || []), picked];
  const patch = { movies, history };
  if (movies.length === 0) {
    patch.roundPicks = {};
    patch.round = (familyData.round || 1) + 1;
  }
  pendingWinner = null;
  await saveFamily(patch);
}

async function saveFamily(patch) {
  const nextData = { ...familyData, ...patch, updatedAt: Date.now() };
  if (!FIREBASE_READY) {
    demoStore.write(nextData);
    return;
  }
  await services.dbFns.updateDoc(services.dbFns.doc(services.db, "families", FAMILY_ID), {
    ...patch,
    updatedAt: services.dbFns.serverTimestamp()
  });
}

function defaultFamilyData() {
  return {
    id: FAMILY_ID,
    name: "Pizza Movie Night",
    joinCode: FAMILY_PASSWORD,
    round: 1,
    members: {},
    movies: [],
    roundPicks: {},
    movieList: [
      { id: crypto.randomUUID(), title: "Spider-Man: Into the Spider-Verse", suggestedBy: "Family", suggestedByUid: "seed", createdAt: Date.now() - 5000 },
      { id: crypto.randomUUID(), title: "The Princess Bride", suggestedBy: "Family", suggestedByUid: "seed", createdAt: Date.now() - 4000 },
      { id: crypto.randomUUID(), title: "Kiki's Delivery Service", suggestedBy: "Family", suggestedByUid: "seed", createdAt: Date.now() - 3000 }
    ],
    history: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

function firebaseFamilyData() {
  return {
    ...defaultFamilyData(),
    members: { [currentUser.uid]: memberRecord() },
    createdAt: services.dbFns.serverTimestamp(),
    updatedAt: services.dbFns.serverTimestamp()
  };
}

function upsertMember() {
  familyData = {
    ...familyData,
    members: {
      ...(familyData.members || {}),
      [currentUser.uid]: memberRecord()
    }
  };
  demoStore.write(familyData);
}

function memberRecord() {
  return {
    name: displayName(),
    email: currentUser?.email || readSession()?.email || "",
    joinedAt: Date.now()
  };
}

function activeMovies() {
  return familyData?.movies || [];
}

function roundPicks() {
  return familyData?.roundPicks || {};
}

function userHasSubmittedThisRound() {
  if (!currentUser?.uid) return true;
  return Boolean(roundPicks()[currentUser.uid])
    || activeMovies().some((movie) => movie.suggestedByUid === currentUser.uid);
}

function canCurrentUserAddMovie() {
  return !userHasSubmittedThisRound();
}

function movieList() {
  return familyData?.movieList || [];
}

function displayName() {
  return currentUser?.displayName || readSession()?.name || currentUser?.email?.split("@")[0] || "Someone";
}

function routeName() {
  return (location.hash.replace(/^#\/?/, "") || "home").toLowerCase();
}

function navigate(route) {
  location.hash = `#/${route}`;
}

function renderAppMenu() {
  const slot = document.querySelector(".menu-slot");
  if (!slot) return;

  const addIsAvailable = canCurrentUserAddMovie();
  const currentRoute = routeName();
  slot.innerHTML = `
    <div class="app-menu">
      <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav class="menu-panel" aria-label="App menu" hidden>
        <button type="button" data-menu-route="home">Home</button>
        <button type="button" data-menu-route="wheel">Wheel</button>
        <button type="button" data-menu-route="add" ${addIsAvailable ? "" : "disabled"}>Add Movies</button>
        <button type="button" data-menu-route="movie-list">Movie List</button>
        <button type="button" data-menu-action="logout">Log out</button>
        ${addIsAvailable ? "" : `<p>You can add one movie per wheel. Add Movies opens again after this wheel is cleared.</p>`}
      </nav>
    </div>
  `;

  const menu = slot.querySelector(".app-menu");
  const toggle = slot.querySelector(".menu-toggle");
  const panel = slot.querySelector(".menu-panel");
  toggle.addEventListener("click", () => {
    const isOpen = !menu.classList.contains("open");
    if (isOpen) panel.hidden = false;
    menu.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    if (!isOpen) {
      window.setTimeout(() => {
        if (!menu.classList.contains("open")) panel.hidden = true;
      }, 190);
    }
  });

  panel.querySelectorAll("[data-menu-route]").forEach((button) => {
    button.classList.toggle("active", button.dataset.menuRoute === currentRoute);
    button.addEventListener("click", () => {
      if (button.disabled) return;
      navigate(button.dataset.menuRoute);
    });
  });
  panel.querySelector("[data-menu-action='logout']").addEventListener("click", logout);
}

function logout() {
  if (!window.confirm("Are you sure you want to log out?")) return;
  cleanupFamilyListener();
  localStorage.removeItem(sessionKey);
  currentUser = null;
  familyData = null;
  if (FIREBASE_READY && services?.auth) {
    services.authFns.signOut(services.auth).catch(() => {});
  }
  location.hash = "";
  renderLogin();
}

function cleanupFamilyListener() {
  if (unsubscribeFamily) unsubscribeFamily();
  unsubscribeFamily = null;
}

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(sessionKey) || "null");
  } catch {
    return null;
  }
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "family";
}

function friendlyAuthError(error) {
  const code = error?.code || "";
  if (code.includes("email-already-in-use")) return "That email already has an account. Try signing in.";
  if (code.includes("invalid-credential") || code.includes("wrong-password")) return "The email or password did not match.";
  if (code.includes("user-not-found")) return "No account was found for that email.";
  if (code.includes("weak-password")) return "Use an account password with at least 6 characters.";
  if (code.includes("invalid-email")) return "Enter a valid email address.";
  if (code.includes("operation-not-allowed")) return "Email/password sign-in needs to be enabled in Firebase Authentication.";
  if (code.includes("permission-denied")) return "Firebase rules blocked that action. Check firebase.rules.";
  return error?.message || "Something went wrong.";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}
