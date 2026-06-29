import { firebaseConfig } from "./firebase-config.js";
import { omdbApiKey } from "./omdb-config.js";

const FAMILY_PASSWORD = "dogcatpig3";
const FAMILY_ID = "pizza-movie-night";
const FIREBASE_READY = !Object.values(firebaseConfig).some((value) => value.startsWith("PASTE_"));
const appRoot = document.querySelector("#app");
const templates = {
  login: document.querySelector("#login-template"),
  home: document.querySelector("#home-template"),
  wheel: document.querySelector("#wheel-template"),
  add: document.querySelector("#add-template"),
  movieList: document.querySelector("#movie-list-template"),
  search: document.querySelector("#search-template"),
  movieDetail: document.querySelector("#movie-detail-template"),
  rankings: document.querySelector("#rankings-template"),
  members: document.querySelector("#members-template"),
  game: document.querySelector("#game-template")
};
const colors = ["#e85d75", "#f4a261", "#2a9d8f", "#457b9d", "#b8c0ff", "#f2cc8f", "#81b29a", "#c77dff"];
const sessionKey = "pizzaMovieSession";
const dismissedRankingsKey = "pizzaMovieDismissedRankings";
const selectedMovieKey = "pizzaMovieSelectedMovie";
const OMDB_READY = Boolean(omdbApiKey && !omdbApiKey.startsWith("PASTE_"));
const genreSearchSeeds = {
  Action: ["mission", "war", "hero", "escape"],
  Adventure: ["journey", "quest", "island", "treasure"],
  Animation: ["toy", "dragon", "princess", "robot"],
  Comedy: ["family", "wedding", "school", "holiday"],
  Drama: ["life", "love", "home", "story"],
  Family: ["dog", "home", "magic", "christmas"],
  Fantasy: ["magic", "king", "dragon", "wizard"],
  Mystery: ["murder", "secret", "detective", "missing"],
  "Sci-Fi": ["space", "future", "alien", "robot"]
};
const SPIN_DURATION_MS = 9000;
const SPIN_LEAD_MS = 1400;
const POINTER_ANGLE = Math.PI * 1.5;
const GAME_VERSION = 14;
const GAME_ARENA = { width: 960, height: 1120 };
const GAME_PLAYER_SIZE = 72;
const GAME_PLAYER_SPEED = 235;
const GAME_MEATBALL_SPEED_MULTIPLIER = 0.7;
const GAME_PIZZA_SPEED = 520;
const GAME_PIZZA_LIFE_MS = 1300;
const GAME_PIZZA_PROJECTILE_SIZE = 20;
const GAME_PIZZA_BOUNDS_PADDING = 80;
const GAME_RESPAWN_MS = 2600;
const GAME_ZOMBIE_IMAGE_SRC = "./assets/zombie.png";
const GAME_ZOMBIE_MAX = 6;
const GAME_ZOMBIE_MAX_AGGRO = 3;
const GAME_ZOMBIE_SIZE = 44;
const GAME_ZOMBIE_RADIUS = 22;
const GAME_ZOMBIE_SPEED = 82;
const GAME_ZOMBIE_AGGRO_RADIUS = 300;
const GAME_ZOMBIE_RESPAWN_MS = 7000;
const GAME_ZOMBIE_TURN_MIN_MS = 700;
const GAME_ZOMBIE_TURN_MAX_MS = 1900;
const GAME_PEPPERONI_PICKUP_SIZE = 22;
const GAME_MAX_MAP_PEPPERONI = 15;
const GAME_MAX_PLAYER_PEPPERONI = 10;
const GAME_PEPPERONI_SPAWN_MS = 2000;
const GAME_PICKUP_CLAIM_TTL_MS = 9000;
const GAME_SPECIAL_TOPPING_CHANCE = 0.1;
const GAME_SPECIAL_TOPPING_DURATION_MS = 10000;
const GAME_POWERUP_FLASH_MS = 2600;
const GAME_RESPAWN_SHIELD_MS = 4000;
const GAME_SHIELD_FLASH_MS = 1500;
const GAME_MATCH_DURATION_MS = 120000;
const GAME_MATCH_COUNTDOWN_MS = 3500;
const GAME_LOBBY_STALE_MS = 8000;
const GAME_SURVIVAL_LIVES = 3;
const GAME_SURVIVAL_WAVE_BANNER_MS = 1300;
const GAME_SURVIVAL_GATE_SIZE = 150;
const GAME_SURVIVAL_GATE_PADDING = 34;
const GAME_SURVIVAL_X_GATE_START = (GAME_ARENA.width - GAME_SURVIVAL_GATE_SIZE) / 2;
const GAME_SURVIVAL_X_GATE_END = GAME_SURVIVAL_X_GATE_START + GAME_SURVIVAL_GATE_SIZE;
const GAME_SURVIVAL_Y_GATE_START = (GAME_ARENA.height - GAME_SURVIVAL_GATE_SIZE) / 2;
const GAME_SURVIVAL_Y_GATE_END = GAME_SURVIVAL_Y_GATE_START + GAME_SURVIVAL_GATE_SIZE;
const GAME_XP = {
  pepperoni: 100,
  special: 300,
  zombie: 300,
  player: 1000
};
const GAME_MUSHROOM_FUSE_MS = 700;
const GAME_MUSHROOM_SPLASH_RADIUS = 184;
const GAME_MUSHROOM_EXPLOSION_MS = 360;
const GAME_MUSHROOM_EXPLOSION_SYNC_TTL_MS = 2500;
const GAME_REMOVED_PROJECTILE_TTL_MS = 3500;
const GAME_BASIL_FIRE_MS = 90;
const GAME_BASIL_LIFE_MS = 496;
const GAME_MEATBALL_SIZE = 84;
const GAME_HEARTBEAT_MS = 75;
const GAME_STALE_PLAYER_MS = 6000;
const GAME_REMOTE_PLAYER_SMOOTHING = 18;
const GAME_REMOTE_PLAYER_SNAP_DISTANCE = 180;
const GAME_WALLS = [
  { x: 0, y: 0, w: 960, h: 24 },
  { x: 0, y: 1096, w: 960, h: 24 },
  { x: 0, y: 0, w: 24, h: 1120 },
  { x: 936, y: 0, w: 24, h: 1120 },
  { x: 120, y: 130, w: 210, h: 28 },
  { x: 515, y: 165, w: 290, h: 28 },
  { x: 440, y: 290, w: 28, h: 145 },
  { x: 760, y: 330, w: 28, h: 140 },
  { x: 100, y: 520, w: 265, h: 28 },
  { x: 555, y: 600, w: 255, h: 28 },
  { x: 230, y: 690, w: 28, h: 140 },
  { x: 655, y: 735, w: 28, h: 130 },
  { x: 330, y: 925, w: 230, h: 28 },
  { x: 720, y: 990, w: 120, h: 28 }
];
const GAME_SURVIVAL_WALLS = [
  { x: 0, y: 0, w: GAME_SURVIVAL_X_GATE_START, h: 24 },
  { x: GAME_SURVIVAL_X_GATE_END, y: 0, w: GAME_ARENA.width - GAME_SURVIVAL_X_GATE_END, h: 24 },
  { x: 0, y: GAME_ARENA.height - 24, w: GAME_SURVIVAL_X_GATE_START, h: 24 },
  { x: GAME_SURVIVAL_X_GATE_END, y: GAME_ARENA.height - 24, w: GAME_ARENA.width - GAME_SURVIVAL_X_GATE_END, h: 24 },
  { x: 0, y: 0, w: 24, h: GAME_SURVIVAL_Y_GATE_START },
  { x: 0, y: GAME_SURVIVAL_Y_GATE_END, w: 24, h: GAME_ARENA.height - GAME_SURVIVAL_Y_GATE_END },
  { x: GAME_ARENA.width - 24, y: 0, w: 24, h: GAME_SURVIVAL_Y_GATE_START },
  { x: GAME_ARENA.width - 24, y: GAME_SURVIVAL_Y_GATE_END, w: 24, h: GAME_ARENA.height - GAME_SURVIVAL_Y_GATE_END },
  ...GAME_WALLS.slice(4)
];
const GAME_SURVIVAL_GATES = [
  { side: "top", x: GAME_ARENA.width / 2, y: -GAME_ZOMBIE_RADIUS - 8, min: GAME_SURVIVAL_X_GATE_START + GAME_SURVIVAL_GATE_PADDING, max: GAME_SURVIVAL_X_GATE_END - GAME_SURVIVAL_GATE_PADDING },
  { side: "bottom", x: GAME_ARENA.width / 2, y: GAME_ARENA.height + GAME_ZOMBIE_RADIUS + 8, min: GAME_SURVIVAL_X_GATE_START + GAME_SURVIVAL_GATE_PADDING, max: GAME_SURVIVAL_X_GATE_END - GAME_SURVIVAL_GATE_PADDING },
  { side: "left", x: -GAME_ZOMBIE_RADIUS - 8, y: GAME_ARENA.height / 2, min: GAME_SURVIVAL_Y_GATE_START + GAME_SURVIVAL_GATE_PADDING, max: GAME_SURVIVAL_Y_GATE_END - GAME_SURVIVAL_GATE_PADDING },
  { side: "right", x: GAME_ARENA.width + GAME_ZOMBIE_RADIUS + 8, y: GAME_ARENA.height / 2, min: GAME_SURVIVAL_Y_GATE_START + GAME_SURVIVAL_GATE_PADDING, max: GAME_SURVIVAL_Y_GATE_END - GAME_SURVIVAL_GATE_PADDING }
];
const GAME_ZOMBIE_STARTS = [
  { id: "zombie-1", x: 92, y: 82, vx: 1, vy: 0.35, facing: 1, alive: true, deadUntil: 0 },
  { id: "zombie-2", x: 855, y: 122, vx: -0.85, vy: 0.55, facing: -1, alive: true, deadUntil: 0 },
  { id: "zombie-3", x: 120, y: 680, vx: 0.75, vy: -0.8, facing: 1, alive: true, deadUntil: 0 },
  { id: "zombie-4", x: 840, y: 680, vx: -0.7, vy: -0.65, facing: -1, alive: true, deadUntil: 0 },
  { id: "zombie-5", x: 470, y: 245, vx: 0.35, vy: 1, facing: 1, alive: true, deadUntil: 0 },
  { id: "zombie-6", x: 470, y: 855, vx: -0.45, vy: -1, facing: -1, alive: true, deadUntil: 0 }
];

let services = null;
let currentUser = null;
let familyData = null;
let unsubscribeFamily = null;
let unsubscribeGameArena = null;
let pendingWinner = null;
let appStarted = false;
let authMode = "signin";
let authReady = false;
let activeSpinAnimationId = null;
let lastFamilyRenderSignature = "";
let gameState = null;
let gameLocalPlayer = null;
let gameInput = { x: 0, y: 0 };
let gameKeyboardInput = { up: false, down: false, left: false, right: false };
let gameAim = { x: 1, y: 0 };
let gameLastFrame = performance.now();
let gameLastHeartbeat = 0;
let gameLastShotAt = 0;
let gameFireHeld = false;
let gameAnimationId = null;
let gameRemoteProjectiles = {};
let gameVisualPlayers = {};
let gameExplosionEffects = [];
let gameSharedExplosionSeenAt = {};
let gameTouchMoveLocked = false;
let gameConsumedHitIds = new Set();
let gameRemovedProjectileIds = new Set();
let gameConsumedPickupIds = new Set();
let gameJoinedArena = false;
let gameViewMode = "menu";
let gameMatchQueued = false;
let gameSpectating = false;
let gameLobbyPresenceTimer = null;
let gameZombieImage = null;
let gameDisconnectCleanupReady = false;
let gameMatchExitPending = false;
let gameBackHandledAt = 0;

const demoStore = {
  key: "pizzaMovieDemoStateV2",
  read() {
    return JSON.parse(localStorage.getItem(this.key) || JSON.stringify(defaultFamilyData()));
  },
  write(nextData) {
    localStorage.setItem(this.key, JSON.stringify(nextData));
    familyData = nextData;
    if (routeName() === "game" && document.querySelector("#game-canvas")) {
      receiveGameSnapshot();
      return;
    }
    renderRoute();
  }
};

start().catch((error) => {
  renderLogin(friendlyAuthError(error));
});

async function start() {
  if (!appStarted) {
    window.addEventListener("hashchange", renderRoute);
    window.addEventListener("pageshow", resetViewportPosition);
    window.addEventListener("load", resetViewportPosition);
    window.addEventListener("orientationchange", () => window.setTimeout(resetViewportPosition, 120));
    window.addEventListener("pagehide", handleGamePageExit);
    window.addEventListener("beforeunload", handleGamePageExit);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") handleGamePageExit();
    });
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
  lastFamilyRenderSignature = familyRenderSignature(familyData);
  upsertMember();
  renderRoute();
}

async function initFirebase() {
  if (authReady) return;
  const firebaseApp = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
  const firebaseAuth = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js");
  const firestore = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js");
  const realtimeDatabase = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js");
  const app = firebaseApp.initializeApp(firebaseConfig);
  services = {
    auth: firebaseAuth.getAuth(app),
    db: firestore.getFirestore(app),
    rtdb: realtimeDatabase.getDatabase(app),
    authFns: firebaseAuth,
    dbFns: firestore,
    rtdbFns: realtimeDatabase
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
    const nextFamilyData = { ...nextSnap.data(), id: nextSnap.id };
    const nextSignature = familyRenderSignature(nextFamilyData);
    const shouldRender = nextSignature !== lastFamilyRenderSignature;
    familyData = nextFamilyData;
    lastFamilyRenderSignature = nextSignature;
    if (!shouldRender) return;
    if (routeName() === "game" && document.querySelector("#game-canvas")) return;
    renderRoute();
  }, (error) => {
    renderLogin(error.message || "Firebase could not load the family wheel.");
  });
}

function renderLogin(message = "") {
  cleanupGame();
  cleanupFamilyListener();
  lastFamilyRenderSignature = "";
  authMode = "signin";
  appRoot.replaceChildren(templates.login.content.cloneNode(true));
  resetViewportPosition();
  const form = document.querySelector("#family-login-form");
  const note = document.querySelector("#login-note");
  const nameField = document.querySelector("#family-name-input");
  const nameWrap = document.querySelector("#name-field-wrap");
  const passwordField = document.querySelector("#account-password-input");
  const confirmPasswordField = document.querySelector("#confirm-password-input");
  const confirmPasswordWrap = document.querySelector("#confirm-password-field-wrap");
  const emailField = document.querySelector("#account-email-input");
  const familyPasswordField = document.querySelector("#family-password-input");
  const familyPasswordWrap = document.querySelector("#family-password-field-wrap");
  const resetButton = document.querySelector("#reset-password-button");
  note.textContent = message;

  function syncAuthModeFields() {
    const creating = authMode === "signup";
    nameWrap.hidden = !creating;
    confirmPasswordWrap.hidden = !creating;
    familyPasswordWrap.hidden = !creating;
    nameField.required = creating;
    confirmPasswordField.required = creating;
    familyPasswordField.required = creating;
    passwordField.autocomplete = creating ? "new-password" : "current-password";
    resetButton.hidden = creating;
  }

  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.authMode === authMode);
    button.addEventListener("click", () => {
      authMode = button.dataset.authMode;
      document.querySelectorAll("[data-auth-mode]").forEach((item) => item.classList.toggle("active", item === button));
      syncAuthModeFields();
      note.textContent = "";
    });
  });
  syncAuthModeFields();

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
    const confirmPassword = confirmPasswordField.value;
    const familyPassword = familyPasswordField.value;
    if (authMode === "signup" && accountPassword !== confirmPassword) {
      note.textContent = "The account passwords do not match.";
      return;
    }
    if (authMode === "signup" && familyPassword !== FAMILY_PASSWORD) {
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
  if (route !== "game") cleanupGame();
  if (route === "wheel") renderWheelPage();
  else if (route === "add") renderAddPage();
  else if (route === "movie-list") renderMovieListPage();
  else if (route === "search") renderSearchPage();
  else if (route === "movie-detail") renderMovieDetailPage();
  else if (route === "rankings") renderRankingsPage();
  else if (route === "members") renderMembersPage();
  else if (route === "game") renderGamePage();
  else renderHomePage();
  resetViewportPosition();
  if (route !== "game") window.setTimeout(showPendingRankingPrompt, 0);
}

function renderHomePage() {
  appRoot.replaceChildren(templates.home.content.cloneNode(true));
  renderAppMenu();
  const name = currentUser?.displayName || readSession()?.name || "friend";
  document.querySelector("#welcome-title").textContent = `Welcome ${name} to the home of pizza movie night`;
  document.querySelector("#go-wheel-button").addEventListener("click", () => navigate("wheel"));
  document.querySelector("#go-list-button").addEventListener("click", () => navigate("movie-list"));
  document.querySelector("#go-search-button").addEventListener("click", () => navigate("search"));
  document.querySelector("#go-rankings-button").addEventListener("click", () => navigate("rankings"));
  document.querySelector("#go-game-button").addEventListener("click", () => navigate("game"));
}

function renderWheelPage() {
  appRoot.replaceChildren(templates.wheel.content.cloneNode(true));
  renderAppMenu();
  document.querySelector("#spin-button").addEventListener("click", requestSpin);
  document.querySelector("#confirm-picked").addEventListener("click", confirmPicked);
  document.querySelector("#go-add-button").addEventListener("click", () => navigate("add"));

  const empty = activeMovies().length === 0;
  const canAdd = canCurrentUserAddMovie();
  const spinActive = isSpinActive();
  const addPanel = document.querySelector("#empty-wheel-panel");
  document.querySelector("#spin-button").hidden = empty;
  addPanel.hidden = !canAdd || spinActive;
  if (canAdd) {
    addPanel.querySelector("h2").textContent = empty ? "The wheel is empty." : "Add your movie.";
    addPanel.querySelector("p").textContent = empty
      ? "Add picks for the next pizza movie night."
      : "You can add one movie to this wheel.";
  }
  updateSpinUi();
  drawWheel();
  syncSharedSpin();
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
        <p>${movieMetaText(movie)}Suggested by ${escapeHtml(movie.suggestedBy || "someone")}</p>
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
        <p>${movieMetaText(movie)}Suggested by ${escapeHtml(movie.suggestedBy || "someone")}</p>
      </div>
      <button class="remove-button" type="button" aria-label="Remove ${escapeHtml(movie.title)}">×</button>
    `;
    item.querySelector("button").addEventListener("click", () => removeFromMovieList(movie.id));
    return item;
  }));
}

function renderSearchPage() {
  appRoot.replaceChildren(templates.search.content.cloneNode(true));
  renderAppMenu();

  const form = document.querySelector("#movie-search-form");
  const note = document.querySelector("#movie-search-note");
  const results = document.querySelector("#movie-search-results");

  if (!OMDB_READY) {
    note.textContent = "Add your OMDb API key in omdb-config.js to turn on search.";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = document.querySelector("#movie-search-input").value.trim();
    const genre = document.querySelector("#movie-genre-filter").value;
    if (!query && !genre) {
      note.textContent = "Enter a title or choose a genre.";
      return;
    }
    if (!OMDB_READY) {
      note.textContent = "Add your OMDb API key in omdb-config.js to turn on search.";
      return;
    }

    note.textContent = "Searching...";
    results.innerHTML = "";
    try {
      const movies = query ? await searchOmdb(query) : await searchOmdbByGenre(genre);
      const filtered = filterOmdbResults(movies, { useGenreFilter: !query });
      renderSearchResults(filtered);
      note.textContent = filtered.length ? `${filtered.length} result${filtered.length === 1 ? "" : "s"}` : "No movies matched those filters.";
    } catch (error) {
      note.textContent = error.message || "Movie search failed.";
    }
  });
}

async function searchOmdb(query) {
  const searchUrl = new URL("https://www.omdbapi.com/");
  searchUrl.searchParams.set("apikey", omdbApiKey);
  searchUrl.searchParams.set("s", query);
  searchUrl.searchParams.set("type", "movie");

  const data = await fetchOmdbJson(searchUrl);
  if (data.Response === "False") {
    if (data.Error && data.Error !== "Movie not found!") throw new Error(data.Error);
    return [];
  }

  const results = (data.Search || []).slice(0, 10);
  return Promise.all(results.map((movie) => fetchOmdbDetails(movie.imdbID)));
}

async function searchOmdbByGenre(genre) {
  const seeds = genreSearchSeeds[genre] || [genre];
  const resultGroups = await Promise.all(seeds.map((seed) => searchOmdb(seed)));
  const seen = new Set();
  return resultGroups
    .flat()
    .filter((movie) => {
      if (!movie?.imdbID || seen.has(movie.imdbID)) return false;
      seen.add(movie.imdbID);
      return true;
    })
    .slice(0, 20);
}

async function fetchOmdbDetails(imdbID) {
  const detailUrl = new URL("https://www.omdbapi.com/");
  detailUrl.searchParams.set("apikey", omdbApiKey);
  detailUrl.searchParams.set("i", imdbID);
  detailUrl.searchParams.set("plot", "short");

  const data = await fetchOmdbJson(detailUrl);
  if (data.Response === "False") throw new Error(data.Error || "Movie details failed.");
  return data;
}

async function fetchOmdbJson(url) {
  let response;
  try {
    response = await fetch(url, { cache: "no-store" });
  } catch {
    throw new Error("OMDb could not be reached. Check your connection and try again.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (data?.Error) throw new Error(data.Error);
  if (!response.ok) throw new Error(`OMDb could not be reached. Status ${response.status}.`);
  if (!data) throw new Error("OMDb sent an unreadable response.");
  return data;
}

function filterOmdbResults(movies, options = {}) {
  const rating = document.querySelector("#movie-rating-filter").value;
  const genre = document.querySelector("#movie-genre-filter").value;
  const useGenreFilter = options.useGenreFilter !== false;
  return movies.filter((movie) => {
    const ratingMatches = !rating || movie.Rated === rating;
    const genreMatches = !useGenreFilter || !genre || (movie.Genre || "").split(", ").includes(genre);
    return ratingMatches && genreMatches;
  });
}

function renderSearchResults(movies) {
  const results = document.querySelector("#movie-search-results");
  if (!movies.length) {
    results.innerHTML = `<div class="empty-state">No movies to show.</div>`;
    return;
  }

  results.replaceChildren(...movies.map((movie) => {
    const item = document.createElement("article");
    item.className = "search-card";
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `Open details for ${movie.Title}`);
    const poster = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "";
    const reviewLinks = movieReviewLinks(movie);
    const recommendation = recommendationForMovie(movie);
    item.innerHTML = `
      ${poster ? `<img src="${escapeHtml(poster)}" alt="" loading="lazy" />` : `<div class="poster-placeholder"><img src="icon.svg" alt="" loading="lazy" /></div>`}
      <div class="search-card-body">
        <div>
          <h3>${escapeHtml(movie.Title)}</h3>
          <p>${escapeHtml([movie.Year, movie.Rated, movie.Runtime].filter((value) => value && value !== "N/A").join(" • "))}</p>
          <p>${escapeHtml(movie.Genre && movie.Genre !== "N/A" ? movie.Genre : "")}</p>
        </div>
        <p>${escapeHtml(movie.Plot && movie.Plot !== "N/A" ? movie.Plot : "")}</p>
        ${recommendation ? recommendationMarkup(recommendation) : ""}
        <div class="review-links">
          <a class="review-link review-link-rt" href="${reviewLinks.rottenTomatoes}" target="_blank" rel="noopener noreferrer">
            <img src="https://www.google.com/s2/favicons?domain=rottentomatoes.com&sz=64" alt="" loading="lazy" />
            Rotten Tomatoes
          </a>
          <a class="review-link review-link-csm" href="${reviewLinks.commonSense}" target="_blank" rel="noopener noreferrer">
            <img src="https://www.google.com/s2/favicons?domain=commonsensemedia.org&sz=64" alt="" loading="lazy" />
            Common Sense
          </a>
        </div>
        <div class="search-actions">
          <button class="secondary-action compact-action" type="button" data-add-list>Add to Movie List</button>
          <button class="primary-action compact-action" type="button" data-add-wheel ${canCurrentUserAddMovie() ? "" : "disabled"}>Add to wheel</button>
        </div>
      </div>
    `;
    const movieData = omdbMovieData(movie);
    item.addEventListener("click", () => openMovieDetail(movieData));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openMovieDetail(movieData);
      }
    });
    item.querySelectorAll("a, button").forEach((control) => {
      control.addEventListener("click", (event) => event.stopPropagation());
    });
    item.querySelector("[data-add-list]").addEventListener("click", () => addSearchMovieToList(movieData));
    item.querySelector("[data-add-wheel]").addEventListener("click", async () => {
      await addToWheel(movieData);
      navigate("wheel");
    });
    return item;
  }));
}

function openMovieDetail(movie) {
  sessionStorage.setItem(selectedMovieKey, JSON.stringify(movie));
  navigate("movie-detail");
}

function renderMovieDetailPage() {
  appRoot.replaceChildren(templates.movieDetail.content.cloneNode(true));
  renderAppMenu();

  const movie = readSelectedMovie();
  const container = document.querySelector("#movie-detail-content");

  if (!movie) {
    container.innerHTML = `
      <button class="back-button inline-back-button" type="button" aria-label="Go back">‹</button>
      <div class="empty-state">Pick a movie from search to see details.</div>
    `;
    container.querySelector(".inline-back-button").addEventListener("click", () => history.back());
    return;
  }

  const reviewLinks = movieReviewLinks({ Title: movie.title, Year: movie.year });
  const recommendation = recommendationForMovie(movie);
  const poster = movie.poster && movie.poster !== "N/A" ? movie.poster : "";
  container.innerHTML = `
    <button class="back-button inline-back-button" type="button" aria-label="Go back">‹</button>
    <article class="movie-detail-card">
      ${poster ? `<img class="movie-detail-poster" src="${escapeHtml(poster)}" alt="" loading="lazy" />` : `<div class="movie-detail-poster poster-placeholder"><img src="icon.svg" alt="" loading="lazy" /></div>`}
      <div class="movie-detail-body">
        <p class="eyebrow">${escapeHtml([movie.year, movie.rated, movie.runtime].filter(isRealValue).join(" • "))}</p>
        <h1 class="page-title">${escapeHtml(movie.title)}</h1>
        <p>${escapeHtml(movie.plot && movie.plot !== "N/A" ? movie.plot : "No plot available.")}</p>
        ${recommendation ? recommendationMarkup(recommendation) : ""}
        <dl class="movie-facts">
          ${movieFact("Genre", movie.genre)}
          ${movieFact("Actors", movie.actors)}
          ${movieFact("Director", movie.director)}
          ${movieFact("Writer", movie.writer)}
          ${movieFact("IMDb", movie.imdbRating && movie.imdbRating !== "N/A" ? `${movie.imdbRating}/10` : "")}
          ${movieFact("Awards", movie.awards)}
        </dl>
        <div class="review-links">
          <a class="review-link review-link-rt" href="${reviewLinks.rottenTomatoes}" target="_blank" rel="noopener noreferrer">
            <img src="https://www.google.com/s2/favicons?domain=rottentomatoes.com&sz=64" alt="" loading="lazy" />
            Rotten Tomatoes
          </a>
          <a class="review-link review-link-csm" href="${reviewLinks.commonSense}" target="_blank" rel="noopener noreferrer">
            <img src="https://www.google.com/s2/favicons?domain=commonsensemedia.org&sz=64" alt="" loading="lazy" />
            Common Sense
          </a>
        </div>
        <div class="search-actions">
          <button id="detail-add-list" class="secondary-action compact-action" type="button">Add to Movie List</button>
          <button id="detail-add-wheel" class="primary-action compact-action" type="button" ${canCurrentUserAddMovie() ? "" : "disabled"}>Add to wheel</button>
        </div>
      </div>
    </article>
  `;
  container.querySelector(".inline-back-button").addEventListener("click", () => history.back());
  document.querySelector("#detail-add-list").addEventListener("click", () => addSearchMovieToList(movie));
  document.querySelector("#detail-add-wheel").addEventListener("click", async () => {
    await addToWheel(movie);
    navigate("wheel");
  });
}

function movieFact(label, value) {
  if (!isRealValue(value)) return "";
  return `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`;
}

function isRealValue(value) {
  return Boolean(value && value !== "N/A");
}

function readSelectedMovie() {
  try {
    return JSON.parse(sessionStorage.getItem(selectedMovieKey) || "null");
  } catch {
    return null;
  }
}

function movieReviewLinks(movie) {
  const query = [movie.Title, movie.Year].filter((value) => value && value !== "N/A").join(" ");
  return {
    rottenTomatoes: `https://www.rottentomatoes.com/search?search=${encodeURIComponent(query)}`,
    commonSense: `https://www.commonsensemedia.org/search/${encodeURIComponent(query)}`
  };
}

function recommendationMarkup(recommendation) {
  return `
    <div class="recommendation-pill">
      <strong>${recommendation.label}</strong>
      <span>${escapeHtml(recommendation.reasons.join(" • "))}</span>
    </div>
  `;
}

function omdbMovieData(movie) {
  return {
    title: movie.Title,
    imdbID: movie.imdbID,
    year: movie.Year,
    rated: movie.Rated,
    genre: movie.Genre,
    runtime: movie.Runtime,
    poster: movie.Poster,
    plot: movie.Plot,
    actors: movie.Actors,
    director: movie.Director,
    writer: movie.Writer,
    imdbRating: movie.imdbRating,
    awards: movie.Awards,
    source: "omdb"
  };
}

async function addSearchMovieToList(movie) {
  await saveFamily({
    movieList: [
      ...movieList(),
      {
        ...movie,
        id: crypto.randomUUID(),
        suggestedBy: displayName(),
        suggestedByUid: currentUser.uid,
        createdAt: Date.now()
      }
    ]
  });
  document.querySelector("#movie-search-note").textContent = `${movie.title} added to Movie List.`;
}

function renderRankingsPage() {
  appRoot.replaceChildren(templates.rankings.content.cloneNode(true));
  renderAppMenu();
  renderRankingsList();
}

function renderRankingsList() {
  const container = document.querySelector("#rankings-list");
  const movies = historyMovies();
  if (!movies.length) {
    container.innerHTML = `<div class="empty-state">Past movie rankings will show up here after a movie is removed from the wheel.</div>`;
    return;
  }

  container.replaceChildren(...movies.map((movie) => {
    const ratings = Object.values(movieRankings(movie));
    const average = averageRating(movie);
    const userRanking = currentUserRanking(movie);
    const details = document.createElement("details");
    details.className = "ranking-card";
    details.innerHTML = `
      <summary>
        <span>
          <strong>${escapeHtml(movie.title)}</strong>
          <small>${ratings.length ? `${ratings.length} ranking${ratings.length === 1 ? "" : "s"}` : "No rankings yet"}</small>
        </span>
        <span class="average-score">${average ? `${average.toFixed(1)} ${starText(Math.round(average))}` : "Not ranked"}</span>
      </summary>
      <div class="ranking-details">
        ${userRanking ? "" : `<button class="secondary-action compact-action rank-movie-action" type="button">Rank this movie</button>`}
        <button class="remove-ranking-action" type="button">Remove from rankings</button>
        ${ratings.length ? ratings.map((rating) => `
          <article class="ranking-entry">
            <div>
              <strong>${escapeHtml(rating.name || "Someone")}</strong>
              <span>${starText(rating.score)}</span>
            </div>
            ${rating.note ? `<p>${escapeHtml(rating.note)}</p>` : ""}
          </article>
        `).join("") : `<p class="helper-text">No one has ranked this movie yet.</p>`}
      </div>
    `;
    details.querySelector(".rank-movie-action")?.addEventListener("click", () => showRankingModal(movie));
    details.querySelector(".remove-ranking-action").addEventListener("click", () => removeRankingMovie(movie.id));
    return details;
  }));
}

function renderMembersPage() {
  appRoot.replaceChildren(templates.members.content.cloneNode(true));
  renderAppMenu();
  renderMembersList();
}

function renderMembersList() {
  const container = document.querySelector("#members-list");
  const members = Object.entries(familyData?.members || {});
  if (!members.length) {
    container.innerHTML = `<div class="empty-state">No members are saved yet.</div>`;
    return;
  }

  container.replaceChildren(...members.map(([uid, member]) => {
    const isCurrentUser = uid === currentUser?.uid;
    const item = document.createElement("article");
    item.className = "movie-list-card";
    item.innerHTML = `
      <div>
        <h3>${escapeHtml(member.name || member.email || "Family member")}</h3>
        <p>${isCurrentUser ? "This is you" : escapeHtml(member.email || "Saved family member")}</p>
      </div>
      <button class="remove-button" type="button" aria-label="Remove ${escapeHtml(member.name || "member")}" ${isCurrentUser ? "disabled" : ""}>×</button>
    `;
    item.querySelector("button").addEventListener("click", () => removeFamilyMember(uid));
    return item;
  }));
}

function renderGamePage() {
  document.documentElement.classList.add("game-active-root");
  document.body.classList.add("game-active");
  if (!gameTouchMoveLocked) {
    document.addEventListener("touchmove", preventGamePageDrag, { passive: false });
    gameTouchMoveLocked = true;
  }
  appRoot.replaceChildren(templates.game.content.cloneNode(true));
  renderAppMenu();
  renderGameRuleIcons();
  gameState = normalizeGame(familyData?.gameArena);
  gameRemoteProjectiles = gameState.projectiles;
  attachGameMenuControls();
  attachGameControls();
  setGameStatus("Menu", false);
  gameJoinedArena = false;
  gameViewMode = "menu";
  gameMatchQueued = false;
  gameSpectating = false;
  gameMatchExitPending = false;
  updateGameModePanels();
  if (FIREBASE_READY && services?.rtdb) {
    setupGameDisconnectCleanup();
    subscribeGameArena();
    writeGameLobbyPresence("menu");
  } else {
    writeGameLobbyPresence("menu");
  }
  startGameLobbyPresenceTimer();
}

function subscribeGameArena() {
  if (!FIREBASE_READY || !services?.rtdb) return;
  cleanupGameArenaListener();
  const gameRef = gameArenaRef();
  unsubscribeGameArena = services.rtdbFns.onValue(gameRef, (snap) => {
    const nextArena = snap.val();
    familyData = { ...familyData, gameArena: nextArena };
    if (nextArena && gameViewMode !== "solo") receiveGameSnapshot();
    updateGameModePanels();
    maybeStartQueuedMatch();
  }, () => {
    setGameStatus("Error", false);
    showGameArenaStatus("Realtime Database blocked the game. Check Realtime Database rules.");
  });
}

function attachGameMenuControls() {
  document.querySelector("#free-play-button")?.addEventListener("click", () => enterGameFreePlay());
  document.querySelector("#survival-button")?.addEventListener("click", () => enterGameSurvival());
  document.querySelector("#start-match-button")?.addEventListener("click", () => queueGameMatch());
  document.querySelector("#spectate-button")?.addEventListener("click", () => enterGameSpectate());
  const gameBackButton = document.querySelector("#game-back-menu-button");
  gameBackButton?.addEventListener("pointerup", (event) => {
    event.preventDefault();
    returnGameMenu();
  });
  gameBackButton?.addEventListener("click", (event) => {
    event.preventDefault();
    returnGameMenu();
  });
  document.querySelector("#return-game-menu-button")?.addEventListener("click", () => returnGameMenu());
  document.querySelector("#end-free-play-button")?.addEventListener("click", () => enterGameFreePlay());
  document.querySelector("#survival-return-menu-button")?.addEventListener("click", () => returnGameMenu());
  document.querySelector("#survival-play-again-button")?.addEventListener("click", () => enterGameSurvival());
}

function enterGameFreePlay() {
  const match = normalizeGame(familyData?.gameArena).match;
  if (gameMatchInProgress(match) && !gameMatchParticipant(match, currentUser?.uid)) return;
  if (gameMatchEnded(match)) {
    const currentArena = normalizeGame(familyData?.gameArena);
    const fresh = { ...defaultGameState(), lobby: currentArena.lobby, records: currentArena.records };
    gameState = fresh;
    writeFullGameArena(fresh);
  }
  gameViewMode = "free";
  gameSpectating = false;
  clearGameQueue();
  updateGameModePanels();
  joinGameArena("free");
  startGameLoop();
}

function enterGameSurvival() {
  if (!currentUser?.uid) return;
  const now = Date.now();
  gameViewMode = "solo";
  gameSpectating = false;
  gameJoinedArena = false;
  gameMatchExitPending = false;
  clearGameQueue();
  leaveGamePlayer();
  resetLocalGameRuntime();
  const countdownUntil = now + GAME_MATCH_COUNTDOWN_MS;
  const player = createGamePlayer();
  player.mode = "solo";
  player.shieldUntil = countdownUntil + GAME_SURVIVAL_WAVE_BANNER_MS + GAME_RESPAWN_SHIELD_MS;
  gameLocalPlayer = player;
  gameState = {
    ...defaultGameState(),
    players: { [currentUser.uid]: player },
    walls: GAME_SURVIVAL_WALLS,
    zombies: createSurvivalWaveZombies(1, now),
    pepperoniPickups: {},
    collectedPickups: {},
    projectiles: {},
    removedProjectiles: {},
    explosionEffects: {},
    lastPepperoniSpawnAt: now - GAME_PEPPERONI_SPAWN_MS,
    solo: {
      active: true,
      wave: 1,
      lives: GAME_SURVIVAL_LIVES,
      countdownUntil,
      waveBannerUntil: countdownUntil + GAME_SURVIVAL_WAVE_BANNER_MS,
      gameOver: false
    },
    updatedAt: now
  };
  setGameStatus("Survival", true);
  updateGameModePanels();
  startGameLoop();
}

function enterGameSpectate() {
  gameViewMode = "spectate";
  gameSpectating = true;
  clearGameQueue();
  leaveGamePlayer();
  updateGameModePanels();
  writeGameLobbyPresence("spectate");
  startGameLoop();
}

function returnGameMenu() {
  const now = Date.now();
  if (now - gameBackHandledAt < 350) return;
  gameBackHandledAt = now;
  const wasInActiveMatch = gameMatchParticipant(normalizeGame(familyData?.gameArena || gameState).match, currentUser?.uid);
  if (wasInActiveMatch) gameMatchExitPending = true;
  markCurrentGameMatchExitLocally();
  gameViewMode = "menu";
  gameSpectating = false;
  clearGameQueue();
  leaveGamePlayerWithOptions({ forceMatchExit: wasInActiveMatch });
  gameLocalPlayer = null;
  gameJoinedArena = false;
  if (gameAnimationId) {
    cancelAnimationFrame(gameAnimationId);
    gameAnimationId = null;
  }
  updateGameModePanels();
  writeGameLobbyPresence("menu");
}

function markCurrentGameMatchExitLocally() {
  if (!currentUser?.uid) return;
  const nextArena = normalizeGame(familyData?.gameArena || gameState);
  const match = nextArena.match;
  if (!gameMatchInProgress(match) || !gameMatchParticipant(match, currentUser.uid)) return;
  const nextMatch = {
    ...match,
    participants: { ...(match.participants || {}) },
    removed: { ...(match.removed || {}), [currentUser.uid]: true }
  };
  delete nextMatch.participants[currentUser.uid];
  nextArena.players = { ...(nextArena.players || {}) };
  delete nextArena.players[currentUser.uid];
  nextArena.match = nextMatch;
  gameState = nextArena;
  familyData = {
    ...familyData,
    gameArena: nextArena
  };
}

async function leaveGamePlayer() {
  return leaveGamePlayerWithOptions();
}

async function leaveGamePlayerWithOptions({ offline = false, forceMatchExit = false } = {}) {
  if (!currentUser?.uid || !FIREBASE_READY || !services?.rtdb) return;
  const arena = normalizeGame(familyData?.gameArena || gameState);
  const match = arena.match;
  const leavingActiveMatch = gameMatchInProgress(match) && (forceMatchExit || gameMatchParticipant(match, currentUser.uid));
  const leavingFreePlay = arena.players?.[currentUser.uid]?.mode === "free" || gameViewMode === "free";
  let records = leavingFreePlay ? applyFreeplayRecordForCurrentUser(arena) : normalizeGameRecords(arena.records);
  const patch = {
    [`players/${currentUser.uid}`]: null,
    [`match/queued/${currentUser.uid}`]: null,
    [`freeScores/${currentUser.uid}`]: leavingFreePlay ? null : arena.freeScores?.[currentUser.uid] || null,
    records,
    [`lobby/${currentUser.uid}`]: offline ? null : gameLobbyEntry(gameViewMode),
    updatedAt: Date.now()
  };
  if (leavingActiveMatch) {
    patch[`match/participants/${currentUser.uid}`] = null;
    patch[`match/removed/${currentUser.uid}`] = true;
    const nextMatch = {
      ...(match || {}),
      participants: { ...(match.participants || {}) },
      scores: { ...(match.scores || {}) },
      finalScores: { ...(match.finalScores || {}) },
      removed: { ...(match.removed || {}), [currentUser.uid]: true }
    };
    delete nextMatch.participants[currentUser.uid];
    const activeLeft = Object.keys(nextMatch.participants || {}).filter((uid) => !nextMatch.removed?.[uid]);
    if (activeLeft.length <= 1) {
      nextMatch.status = "ended";
      nextMatch.finalScores = { ...(nextMatch.scores || {}) };
      nextMatch.queued = {};
      records = applyMatchRecords({ ...arena, match: nextMatch, records });
      patch["match/status"] = "ended";
      patch["match/finalScores"] = nextMatch.finalScores;
      patch["match/queued"] = null;
      patch.records = records;
    }
    familyData = {
      ...familyData,
      gameArena: {
        ...(familyData?.gameArena || {}),
        records,
        match: nextMatch
      }
    };
  }
  if (leavingFreePlay) {
    const freeScores = { ...(arena.freeScores || {}) };
    delete freeScores[currentUser.uid];
    familyData = {
      ...familyData,
      gameArena: {
        ...(familyData?.gameArena || {}),
        records,
        freeScores
      }
    };
  }
  await services.rtdbFns.update(gameArenaRef(), patch).catch(() => {});
}

function handleGamePageExit() {
  if (!currentUser?.uid || !FIREBASE_READY || !services?.rtdb) return;
  const arena = normalizeGame(familyData?.gameArena || gameState);
  const isActiveGameRoute = routeName() === "game";
  const isInGame = gameJoinedArena || gameMatchQueued || gameMatchParticipant(arena.match, currentUser.uid);
  if (!isActiveGameRoute && !isInGame) return;
  gameViewMode = "menu";
  gameSpectating = false;
  gameMatchQueued = false;
  gameJoinedArena = false;
  gameLocalPlayer = null;
  leaveGamePlayerWithOptions({ offline: true });
}

function clearGameQueue() {
  if (!currentUser?.uid) return;
  gameMatchQueued = false;
  if (gameState?.match?.queued) {
    const queued = { ...(gameState.match.queued || {}) };
    delete queued[currentUser.uid];
    gameState = { ...gameState, match: { ...gameState.match, queued } };
  }
  if (familyData?.gameArena?.match?.queued) {
    const queued = { ...(familyData.gameArena.match.queued || {}) };
    delete queued[currentUser.uid];
    familyData = {
      ...familyData,
      gameArena: {
        ...familyData.gameArena,
        match: {
          ...familyData.gameArena.match,
          queued
        }
      }
    };
  }
  if (FIREBASE_READY && services?.rtdb) {
    services.rtdbFns.update(gameArenaRef(), {
      [`match/queued/${currentUser.uid}`]: null,
      [`lobby/${currentUser.uid}/queued`]: false,
      updatedAt: Date.now()
    }).catch(() => {});
  }
}

function startGameLoop() {
  if (!gameAnimationId) {
    gameLastFrame = performance.now();
    gameAnimationId = requestAnimationFrame(gameTick);
  }
}

function startGameLobbyPresenceTimer() {
  if (gameLobbyPresenceTimer) window.clearInterval(gameLobbyPresenceTimer);
  gameLobbyPresenceTimer = window.setInterval(() => {
    if (routeName() === "game") writeGameLobbyPresence(gameViewMode);
  }, 3000);
}

function updateGameModePanels() {
  const arena = gameViewMode === "solo" && gameState ? normalizeGame(gameState) : normalizeGame(familyData?.gameArena || gameState);
  const match = arena.match;
  const inProgress = gameMatchInProgress(match);
  const isParticipant = gameMatchParticipant(match, currentUser?.uid);
  const menuPanel = document.querySelector("#game-menu-panel");
  const playPanel = document.querySelector("#game-play-panel");
  const freeButton = document.querySelector("#free-play-button");
  const startButton = document.querySelector("#start-match-button");
  const spectateButton = document.querySelector("#spectate-button");
  const shootButton = document.querySelector("#shoot-button");
  const mobileShootButton = document.querySelector("#mobile-shoot-button");
  const backButton = document.querySelector("#game-back-menu-button");
  const hud = document.querySelector(".pizza-game-hud");
  const mobileControls = document.querySelector(".mobile-controls");
  const spectatorPanel = document.querySelector("#spectator-panel");
  const note = document.querySelector("#match-queue-note");
  const liveLeaderboard = document.querySelector("#match-leaderboard");
  const waveStrip = document.querySelector("#survival-wave-strip");
  const lives = document.querySelector("#survival-lives");
  const endPanel = document.querySelector("#match-end-panel");
  const survivalEndPanel = document.querySelector("#survival-end-panel");
  const survivalEndSummary = document.querySelector("#survival-end-summary");
  const recordsPanel = document.querySelector("#game-records-panel");
  const active = gameActiveContestants(arena);
  const effectiveQueued = { ...(match.queued || {}) };
  if (gameMatchQueued && currentUser?.uid) effectiveQueued[currentUser.uid] = true;
  const queuedCount = active.filter((entry) => effectiveQueued[entry.uid]).length;
  const isQueued = Boolean(currentUser?.uid && effectiveQueued[currentUser.uid]);
  const everyoneQueued = active.length > 1 && queuedCount === active.length;
  const canQueue = active.length > 1 && !inProgress && match.status !== "ended";

  const showPlay = gameViewMode !== "menu";
  document.body.classList.toggle("game-playing", showPlay);
  document.body.classList.toggle("game-freeplay", showPlay && gameViewMode === "free");
  document.body.classList.toggle("game-solo", showPlay && gameViewMode === "solo");
  if (menuPanel) menuPanel.hidden = showPlay;
  if (playPanel) playPanel.hidden = !showPlay;
  if (liveLeaderboard) liveLeaderboard.hidden = !showPlay || gameViewMode === "solo";
  if (waveStrip) waveStrip.hidden = gameViewMode !== "solo";
  if (lives) lives.hidden = gameViewMode !== "solo";
  if (backButton) backButton.hidden = !showPlay;
  if (shootButton) shootButton.disabled = gameViewMode === "spectate" || match.status === "ended" || gameSurvivalEnded();
  if (mobileShootButton) mobileShootButton.disabled = gameViewMode === "spectate" || match.status === "ended" || gameSurvivalEnded();
  if (hud) hud.hidden = gameViewMode === "spectate";
  if (mobileControls) mobileControls.hidden = gameViewMode === "spectate";
  if (spectatorPanel) spectatorPanel.hidden = gameViewMode !== "spectate";
  if (endPanel) endPanel.hidden = !gameMatchEnded(match);
  if (survivalEndPanel) survivalEndPanel.hidden = !(gameViewMode === "solo" && gameSurvivalEnded());
  if (survivalEndSummary) {
    const wave = Number(gameState?.solo?.wave || 1);
    survivalEndSummary.textContent = `You made it to Wave ${wave}.`;
  }
  if (recordsPanel) recordsPanel.hidden = showPlay;

  if (freeButton) freeButton.disabled = inProgress && !isParticipant;
  if (startButton) {
    startButton.hidden = inProgress && !isParticipant;
    startButton.disabled = !canQueue && !isQueued;
    startButton.textContent = isQueued && !everyoneQueued ? "Unqueue" : isQueued ? "Queued" : "Start Match";
  }
  if (spectateButton) spectateButton.hidden = !(inProgress && !isParticipant);

  if (note) {
    if (inProgress && !isParticipant) note.textContent = "A match is already running. You can spectate until it ends.";
    else if (active.length <= 1) note.textContent = "A match needs at least two active players in Pizza Arena.";
    else if (isQueued && !everyoneQueued) note.textContent = `${queuedCount} of ${active.length} queued. Tap Unqueue to back out.`;
    else note.textContent = `${queuedCount} of ${active.length} active player${active.length === 1 ? "" : "s"} queued.`;
  }

  renderMatchLeaderboard();
  renderGameRecords();
  renderAmmoDisplay();
  renderSurvivalHud();
}

function joinGameArena(mode = "free") {
  if (!currentUser?.uid) return;
  setupGameDisconnectCleanup();
  gameJoinedArena = true;
  const player = createGamePlayer();
  player.mode = mode;
  const next = normalizeGame(familyData?.gameArena);
  const leaderboard = next.leaderboard || {};
  const freeScores = mode === "free"
    ? {
      ...(next.freeScores || {}),
      [currentUser.uid]: { uid: currentUser.uid, name: displayName(), xp: 0, startedAt: Date.now() }
    }
    : next.freeScores || {};
  gameLocalPlayer = player;
  gameState = {
    ...next,
    players: {
      ...next.players,
      [currentUser.uid]: player
    },
    lobby: {
      ...(next.lobby || {}),
      [currentUser.uid]: gameLobbyEntry(mode)
    },
    leaderboard,
    freeScores,
    updatedAt: Date.now()
  };
  writeGameArena(gameState);
  setGameStatus("Online", true);
}

function gameLobbyEntry(mode = gameViewMode) {
  return {
    uid: currentUser.uid,
    name: displayName(),
    mode,
    queued: Boolean(gameMatchQueued),
    lastSeen: Date.now()
  };
}

async function writeGameLobbyPresence(mode = gameViewMode) {
  if (!currentUser?.uid || !FIREBASE_READY || !services?.rtdb) return;
  setupGameDisconnectCleanup();
  await services.rtdbFns.update(gameArenaRef(), {
    version: GAME_VERSION,
    [`lobby/${currentUser.uid}`]: gameLobbyEntry(mode),
    updatedAt: Date.now()
  }).catch(() => {});
}

function setupGameDisconnectCleanup() {
  if (gameDisconnectCleanupReady || !currentUser?.uid || !FIREBASE_READY || !services?.rtdb) return;
  const disconnectPatch = {
    [`players/${currentUser.uid}`]: null,
    [`match/queued/${currentUser.uid}`]: null,
    [`match/participants/${currentUser.uid}`]: null,
    [`match/removed/${currentUser.uid}`]: true,
    [`lobby/${currentUser.uid}`]: null,
    updatedAt: services.rtdbFns.serverTimestamp()
  };
  services.rtdbFns.onDisconnect(gameArenaRef()).update(disconnectPatch).then(() => {
    gameDisconnectCleanupReady = true;
  }).catch(() => {});
}

function cancelGameDisconnectCleanup() {
  if (!gameDisconnectCleanupReady || !FIREBASE_READY || !services?.rtdb) return;
  services.rtdbFns.onDisconnect(gameArenaRef()).cancel().catch(() => {});
  gameDisconnectCleanupReady = false;
}

async function queueGameMatch() {
  if (!currentUser?.uid) return;
  setupGameDisconnectCleanup();
  const arena = normalizeGame(familyData?.gameArena);
  const match = arena.match;
  if (gameMatchInProgress(match) && !gameMatchParticipant(match, currentUser.uid)) return;
  const contestants = gameActiveContestants(arena);
  const queuedBefore = match.queued || {};
  const queuedCount = contestants.filter((entry) => queuedBefore[entry.uid]).length;
  const everyoneQueued = contestants.length > 1 && queuedCount === contestants.length;
  const isQueued = Boolean(gameMatchQueued || queuedBefore[currentUser.uid]);
  if (contestants.length <= 1) {
    gameMatchQueued = false;
    updateGameModePanels();
    return;
  }
  if (isQueued && !everyoneQueued) {
    clearGameQueue();
    updateGameModePanels();
    return;
  }
  if (isQueued && everyoneQueued) return;
  gameMatchQueued = true;
  const queued = { ...queuedBefore, [currentUser.uid]: true };
  const nextMatch = { ...match, queued };
  gameState = { ...(gameState || arena), match: nextMatch };
  updateGameModePanels();
  if (FIREBASE_READY && services?.rtdb) {
    await services.rtdbFns.update(gameArenaRef(), {
      [`match/queued/${currentUser.uid}`]: true,
      [`lobby/${currentUser.uid}`]: gameLobbyEntry(gameViewMode),
      updatedAt: Date.now()
    }).catch(() => {});
  }
  maybeStartQueuedMatch();
}

function gameActiveContestants(arena = normalizeGame(familyData?.gameArena)) {
  const now = Date.now();
  const lobby = pruneGameLobby(arena.lobby || {}, now);
  const playerEntries = Object.values(pruneGamePlayers(arena.players || {})).map((player) => ({
    uid: player.uid,
    name: player.name || "Player",
    mode: player.mode || "free",
    lastSeen: player.lastSeen || now
  }));
  const merged = {};
  Object.values(lobby).forEach((entry) => {
    if (entry.mode !== "spectate" && entry.mode !== "solo") merged[entry.uid] = entry;
  });
  playerEntries.forEach((entry) => {
    if (entry.mode !== "spectate" && entry.mode !== "solo") merged[entry.uid] = entry;
  });
  return Object.values(merged);
}

function maybeStartQueuedMatch() {
  const arena = normalizeGame(familyData?.gameArena);
  const match = arena.match;
  if (gameMatchInProgress(match)) return;
  const contestants = gameActiveContestants(arena);
  const queued = match.queued || {};
  const everyoneQueued = contestants.length > 1 && contestants.every((entry) => queued[entry.uid]);
  if (!everyoneQueued) return;
  if (currentUser?.uid !== gameQueuedHostUid(queued)) return;
  startGameMatch(contestants);
}

function gameQueuedHostUid(queued = {}) {
  return Object.keys(queued || {}).filter((uid) => queued[uid]).sort()[0] || currentUser?.uid || "";
}

async function startGameMatch(contestants) {
  setupGameDisconnectCleanup();
  const now = Date.now();
  const startsAt = now + GAME_MATCH_COUNTDOWN_MS;
  const matchId = `match-${now}`;
  const participants = Object.fromEntries(contestants.map((entry) => [entry.uid, { uid: entry.uid, name: entry.name || "Player" }]));
  const scores = Object.fromEntries(contestants.map((entry) => [entry.uid, { uid: entry.uid, name: entry.name || "Player", xp: 0 }]));
  const players = Object.fromEntries(contestants.map((entry) => {
    const savedUser = currentUser;
    currentUser = { ...(currentUser || {}), uid: entry.uid, displayName: entry.name || "Player" };
    const player = createGamePlayer();
    currentUser = savedUser;
    player.uid = entry.uid;
    player.name = entry.name || "Player";
    player.color = gameColorFromUid(entry.uid);
    player.mode = "match";
    return [entry.uid, player];
  }));
  const nextArena = {
    ...defaultGameState(),
    records: normalizeGame(familyData?.gameArena).records,
    players,
    lobby: Object.fromEntries(contestants.map((entry) => [entry.uid, { ...entry, mode: "match", queued: false, lastSeen: now }])),
    match: {
      status: "active",
      queued: {},
      participants,
      scores,
      startedAt: startsAt,
      endsAt: startsAt + GAME_MATCH_DURATION_MS,
      matchId,
      finalScores: {}
    },
    updatedAt: now
  };
  gameState = normalizeGame(nextArena);
  if (currentUser?.uid && players[currentUser.uid]) {
    gameLocalPlayer = players[currentUser.uid];
    gameViewMode = "match";
    gameJoinedArena = true;
  }
  updateGameModePanels();
  await writeFullGameArena(nextArena);
  startGameLoop();
}

function receiveGameSnapshot() {
  if (!document.querySelector("#game-canvas")) return;
  const now = Date.now();
  const remoteGame = normalizeGame(familyData?.gameArena);
  if (currentUser?.uid) gameMatchQueued = Boolean(remoteGame.match?.queued?.[currentUser.uid]);
  syncGameViewWithMatch(remoteGame);
  if (gameMatchExitPending && gameViewMode === "menu") return;
  const zombieDeaths = pruneGameTimedMap(mergeGameTimedMaps(remoteGame.zombieDeaths, gameState?.zombieDeaths), now);
  const removedProjectiles = pruneGameTimedMap(mergeGameTimedMaps(remoteGame.removedProjectiles, gameState?.removedProjectiles), now, GAME_REMOVED_PROJECTILE_TTL_MS);
  syncGameRemovedProjectiles(removedProjectiles);
  const ownPlayer = gameLocalPlayer || remoteGame.players[currentUser?.uid];
  const players = pruneGamePlayers({
    ...remoteGame.players,
    ...(ownPlayer ? { [currentUser.uid]: ownPlayer } : {})
  });
  gameRemoteProjectiles = remoteGame.projectiles;
  const localZombies = gameState?.version === GAME_VERSION && gameState?.zombies?.length ? gameState.zombies : null;
  const remoteZombies = applyGameZombieDeaths(remoteGame.zombies, zombieDeaths);
  const shouldKeepLocalZombies = currentUser?.uid === gameHostUid(players) && localZombies;
  const explosionEffects = pruneGameExplosionEffects(mergeGameTimedMaps(remoteGame.explosionEffects, gameState?.explosionEffects), now);
  gameState = {
    ...remoteGame,
    players,
    zombieDeaths,
    removedProjectiles,
    explosionEffects,
    zombies: shouldKeepLocalZombies ? mergeGameZombies(remoteZombies, localZombies, zombieDeaths) : remoteZombies,
    projectiles: mergeGameProjectiles(remoteGame.projectiles, gameState?.projectiles || {})
  };
  gameLocalPlayer = ownPlayer;
}

function syncGameViewWithMatch(remoteGame) {
  const match = remoteGame.match;
  if (gameMatchExitPending) {
    if (!gameMatchInProgress(match) || match.removed?.[currentUser?.uid] || !gameMatchParticipant(match, currentUser?.uid)) {
      gameMatchExitPending = false;
    } else if (gameViewMode === "menu") {
      return;
    }
  }
  if (gameViewMode === "menu") return;
  if (gameMatchInProgress(match) && match.removed?.[currentUser?.uid]) {
    if (gameViewMode === "menu") return;
    gameViewMode = "spectate";
    gameSpectating = true;
    gameLocalPlayer = null;
    gameJoinedArena = false;
    startGameLoop();
    return;
  }
  if (gameMatchInProgress(match) && gameMatchParticipant(match, currentUser?.uid)) {
    gameViewMode = "match";
    gameJoinedArena = true;
    gameSpectating = false;
    startGameLoop();
  } else if (gameViewMode === "spectate") {
    startGameLoop();
  }
}

function gameMatchInProgress(match = {}) {
  return match?.status === "active" && Date.now() < Number(match.endsAt || 0);
}

function gameMatchParticipant(match = {}, uid = currentUser?.uid) {
  return Boolean(uid && !match?.removed?.[uid] && match?.participants?.[uid]);
}

function gameMatchEnded(match = {}) {
  return match?.status === "ended";
}

function gameMatchFrozen(match = {}, now = Date.now()) {
  return match?.status === "active" && now < Number(match.startedAt || 0);
}

function defaultGameState() {
  return {
    version: GAME_VERSION,
    players: {},
    projectiles: {},
    removedProjectiles: {},
    walls: GAME_WALLS,
    zombies: GAME_ZOMBIE_STARTS.map((zombie) => ({ ...zombie })),
    zombieDeaths: {},
    explosionEffects: {},
    pepperoniPickups: {},
    collectedPickups: {},
    lastPepperoniSpawnAt: Date.now() - GAME_PEPPERONI_SPAWN_MS,
    leaderboard: {},
    freeScores: {},
    records: defaultGameRecords(),
    match: defaultGameMatchState(),
    lobby: {},
    hits: {},
    killLog: [],
    updatedAt: Date.now()
  };
}

function defaultGameRecords() {
  return {
    freeplay: [],
    matches: []
  };
}

function defaultGameMatchState() {
  return {
    status: "idle",
    queued: {},
    participants: {},
    removed: {},
    scores: {},
    startedAt: 0,
    endsAt: 0,
    matchId: "",
    finalScores: {}
  };
}

function normalizeGame(value) {
  const fallback = defaultGameState();
  const useCurrentMap = value?.version === GAME_VERSION;
  const match = normalizeGameMatch(value?.match);
  return {
    ...fallback,
    ...(value || {}),
    version: GAME_VERSION,
    players: value?.players || {},
    projectiles: value?.projectiles || {},
    removedProjectiles: useCurrentMap ? pruneGameTimedMap(value?.removedProjectiles || {}, Date.now(), GAME_REMOVED_PROJECTILE_TTL_MS) : {},
    walls: GAME_WALLS,
    zombies: useCurrentMap && value?.zombies ? normalizeGameZombies(value.zombies) : fallback.zombies,
    zombieDeaths: useCurrentMap ? pruneGameTimedMap(value?.zombieDeaths || {}, Date.now()) : {},
    explosionEffects: useCurrentMap ? pruneGameExplosionEffects(value?.explosionEffects || {}, Date.now()) : {},
    pepperoniPickups: useCurrentMap && value?.pepperoniPickups ? value.pepperoniPickups : fallback.pepperoniPickups,
    collectedPickups: useCurrentMap ? pruneGameTimedMap(value?.collectedPickups || {}, Date.now(), GAME_PICKUP_CLAIM_TTL_MS) : {},
    lastPepperoniSpawnAt: useCurrentMap ? Number(value?.lastPepperoniSpawnAt || fallback.lastPepperoniSpawnAt) : fallback.lastPepperoniSpawnAt,
    leaderboard: value?.leaderboard || {},
    freeScores: value?.freeScores || {},
    records: normalizeGameRecords(value?.records),
    match,
    lobby: pruneGameLobby(value?.lobby || {}, Date.now()),
    hits: value?.hits || {},
    killLog: value?.killLog || []
  };
}

function normalizeGameRecords(records = {}) {
  return {
    freeplay: normalizeGameRecordRows(records?.freeplay),
    matches: normalizeGameRecordRows(records?.matches)
  };
}

function normalizeGameRecordRows(rows = []) {
  return [...(Array.isArray(rows) ? rows : Object.values(rows || {}))]
    .filter((row) => row?.uid && Number(row.xp || 0) > 0)
    .map((row) => ({
      uid: row.uid,
      name: row.name || "Player",
      xp: Number(row.xp || 0),
      createdAt: Number(row.createdAt || Date.now())
    }))
    .sort((a, b) => b.xp - a.xp || a.createdAt - b.createdAt)
    .slice(0, 3);
}

function normalizeGameMatch(match = {}) {
  return {
    ...defaultGameMatchState(),
    ...(match || {}),
    queued: match?.queued || {},
    participants: match?.participants || {},
    removed: match?.removed || {},
    scores: match?.scores || {},
    finalScores: match?.finalScores || {}
  };
}

function mergeGameMatch(remoteMatch = {}, localMatch = {}) {
  const remote = normalizeGameMatch(remoteMatch);
  const local = normalizeGameMatch(localMatch);
  const status = remote.status === "ended" || local.status === "ended"
    ? "ended"
    : remote.status === "active" || local.status === "active"
      ? "active"
      : "idle";
  const participants = { ...remote.participants, ...local.participants };
  const removed = { ...remote.removed, ...local.removed };
  Object.keys(removed).forEach((uid) => {
    delete participants[uid];
  });
  const queued = status === "active" ? {} : { ...remote.queued, ...local.queued };
  const scores = mergeGameScoreMaps(remote.scores, local.scores, participants);
  const finalScores = mergeGameScoreMaps(remote.finalScores, local.finalScores, participants);
  return {
    ...remote,
    ...local,
    status,
    queued,
    participants,
    removed,
    scores,
    finalScores,
    startedAt: Number(remote.startedAt || local.startedAt || 0),
    endsAt: Number(remote.endsAt || local.endsAt || 0),
    matchId: remote.matchId || local.matchId || ""
  };
}

function mergeGameScoreMaps(first = {}, second = {}, participants = {}) {
  const merged = {};
  [...Object.values(participants || {}), ...Object.values(first || {}), ...Object.values(second || {})].forEach((row) => {
    if (!row?.uid) return;
    const current = merged[row.uid] || { uid: row.uid, name: row.name || "Player", xp: 0 };
    merged[row.uid] = {
      ...current,
      ...row,
      name: row.name || current.name || "Player",
      xp: Math.max(Number(current.xp || 0), Number(row.xp || 0))
    };
  });
  return merged;
}

function pruneGameLobby(lobby = {}, now = Date.now()) {
  return Object.fromEntries(Object.entries(lobby || {}).filter(([, entry]) => now - Number(entry?.lastSeen || 0) < GAME_LOBBY_STALE_MS));
}

function gameHitId(hit, uid) {
  return hit?.id || `${uid}-${hit?.byUid || "unknown"}-${hit?.createdAt || hit?.deadUntil || "hit"}`;
}

function pruneGameHits(hits = {}, now = Date.now()) {
  return Object.fromEntries(Object.entries(hits).filter(([uid, hit]) => {
    const deadUntil = Number(hit?.deadUntil || 0);
    if (!deadUntil || deadUntil <= now) return false;
    if (uid === currentUser?.uid && gameConsumedHitIds.has(gameHitId(hit, uid))) return false;
    return true;
  }));
}

function pruneGameTimedMap(items = {}, now = Date.now(), ttl = GAME_ZOMBIE_RESPAWN_MS + 1200) {
  return Object.fromEntries(Object.entries(items || {}).filter(([, value]) => {
    if (value && typeof value === "object" && Number(value.deadUntil || 0)) return Number(value.deadUntil || 0) > now;
    const createdAt = Number(value?.createdAt || value || 0);
    return createdAt && now - createdAt < ttl;
  }));
}

function pruneGameExplosionEffects(items = {}, now = Date.now()) {
  return pruneGameTimedMap(items, now, GAME_MUSHROOM_EXPLOSION_SYNC_TTL_MS);
}

function mergeGameTimedMaps(first = {}, second = {}) {
  return {
    ...(first || {}),
    ...(second || {})
  };
}

function addGameTimedMapPatch(patch, path, items = {}) {
  Object.entries(items || {}).forEach(([id, value]) => {
    patch[`${path}/${id}`] = value;
  });
}

function gameTimedMapSignature(items = {}) {
  return Object.entries(items || {})
    .map(([key, value]) => `${key}:${Number(value?.deadUntil || value?.createdAt || value || 0)}`)
    .sort()
    .join("|");
}

function syncGameRemovedProjectiles(items = {}) {
  Object.keys(items || {}).forEach((id) => gameRemovedProjectileIds.add(id));
}

function gameScoreSignature(state = {}) {
  const matchScores = Object.values(state?.match?.scores || {})
    .map((row) => `${row.uid}:${Number(row.xp || 0)}`)
    .sort()
    .join("|");
  const freeScores = Object.values(state?.freeScores || {})
    .map((row) => `${row.uid}:${Number(row.xp || 0)}`)
    .sort()
    .join("|");
  return `${matchScores}::${freeScores}`;
}

function filterGameAvailablePickups(pickups = {}, collectedPickups = {}) {
  return Object.fromEntries(Object.entries(pickups || {}).filter(([id]) => !collectedPickups?.[id] && !gameConsumedPickupIds.has(id)));
}

function gamePickupPatchValue(pickups = {}, collectedPickups = {}) {
  const available = filterGameAvailablePickups(pickups, collectedPickups);
  return Object.keys(available).length ? available : null;
}

function createGamePlayer() {
  const spawn = randomGameSpawn();
  return {
    uid: currentUser.uid,
    name: displayName(),
    color: gameColorFromUid(currentUser.uid),
    x: spawn.x,
    y: spawn.y,
    aimX: 1,
    aimY: 0,
    pepperoniCount: 0,
    powerup: "",
    powerupUntil: 0,
    savedPepperoniCount: 0,
    alive: true,
    deadUntil: 0,
    shieldUntil: Date.now() + GAME_RESPAWN_SHIELD_MS,
    lastSeen: Date.now()
  };
}

function gameTick(now) {
  const canvas = document.querySelector("#game-canvas");
  if (!canvas) {
    cleanupGame();
    return;
  }
  const dt = Math.min(0.04, (now - gameLastFrame) / 1000);
  gameLastFrame = now;
  if (gameViewMode === "solo") updateSurvivalGame(dt, Date.now());
  else if (gameLocalPlayer && !gameSpectating) updateLocalGame(dt, Date.now());
  updateGameVisualPlayers(dt);
  drawGame();
  gameAnimationId = requestAnimationFrame(gameTick);
}

function updateLocalGame(dt, now) {
  if (!currentUser?.uid || !gameLocalPlayer) return;
  const activeMatch = gameState?.match || defaultGameMatchState();
  if (activeMatch.status === "active") {
    maybeFinishGameMatch(now);
    if (gameState?.match?.status === "ended") return;
  }
  if (activeMatch.status === "active" && now >= Number(activeMatch.endsAt || 0)) {
    return;
  }
  const player = { ...gameLocalPlayer };
  normalizeGamePlayerPowerup(player, now);
  const hitCountBefore = Object.keys(gameState.hits || {}).length;
  const scoreSignatureBefore = gameScoreSignature(gameState);
  const hits = pruneGameHits(gameState.hits || {}, now);
  const incomingHit = hits[currentUser.uid];
  const isRespawning = player.deadUntil && now < player.deadUntil;
  const isShielded = gamePlayerShielded(player, now);
  if (incomingHit && player.powerup === "meatball") {
    gameConsumedHitIds.add(gameHitId(incomingHit, currentUser.uid));
    delete hits[currentUser.uid];
  } else if (incomingHit && isShielded) {
    gameConsumedHitIds.add(gameHitId(incomingHit, currentUser.uid));
    delete hits[currentUser.uid];
  } else if (incomingHit && player.alive && !isRespawning) {
    gameConsumedHitIds.add(gameHitId(incomingHit, currentUser.uid));
    player.alive = false;
    player.deadUntil = Number(incomingHit.deadUntil) || now + GAME_RESPAWN_MS;
    clearGamePlayerLoadout(player);
    delete hits[currentUser.uid];
  }
  if (player.deadUntil && now >= player.deadUntil) {
    const spawn = randomGameSpawn();
    player.x = spawn.x;
    player.y = spawn.y;
    player.alive = true;
    player.deadUntil = 0;
    player.shieldUntil = now + GAME_RESPAWN_SHIELD_MS;
    clearGamePlayerLoadout(player);
    delete hits[currentUser.uid];
  }

  if (gameMatchFrozen(activeMatch, now)) {
    showGameArenaStatus(gameMatchTimerText(activeMatch, now));
  } else if (player.alive) {
    applyGameMatchStartShield(player, activeMatch, now);
    const vector = gameInputVector();
    if (vector.x || vector.y) {
      gameAim = vector;
      player.aimX = vector.x;
      player.aimY = vector.y;
      const speed = gamePlayerMoveSpeed(player);
      const next = moveGamePlayerWithWalls(player.x, player.y, vector.x * speed * dt, vector.y * speed * dt, gamePlayerHitRadius(player));
      player.x = next.x;
      player.y = next.y;
    }
  }
  if (!gameMatchFrozen(activeMatch, now) && gameFireHeld && player.powerup === "basil") {
    shootGamePizza();
  }

  player.lastSeen = now;
  const projectileCountBefore = Object.keys(gameState.projectiles || {}).length;
  const pepperoniCountBefore = Object.keys(gameState.pepperoniPickups || {}).length;
  const zombieSignatureBefore = gameZombieSignature(gameState.zombies || []);
  const collectedSignatureBefore = gameTimedMapSignature(gameState.collectedPickups || {});
  const zombieDeathsSignatureBefore = gameTimedMapSignature(gameState.zombieDeaths || {});
  const removedProjectilesSignatureBefore = gameTimedMapSignature(gameState.removedProjectiles || {});
  const explosionSignatureBefore = gameTimedMapSignature(gameState.explosionEffects || {});
  const players = pruneGamePlayers({ ...gameState.players, [currentUser.uid]: player });
  const isHost = currentUser.uid === gameHostUid(players);
  const serverGame = normalizeGame(familyData?.gameArena);
  let zombieDeaths = pruneGameTimedMap(mergeGameTimedMaps(serverGame.zombieDeaths, gameState.zombieDeaths), now);
  let removedProjectiles = pruneGameTimedMap(mergeGameTimedMaps(serverGame.removedProjectiles, gameState.removedProjectiles), now, GAME_REMOVED_PROJECTILE_TTL_MS);
  syncGameRemovedProjectiles(removedProjectiles);
  const projectiles = pruneGameProjectiles(moveGameProjectiles(gameState.projectiles, dt, now), now);
  const explosionEffects = pruneGameExplosionEffects(mergeGameTimedMaps(serverGame.explosionEffects, gameState.explosionEffects), now);
  const frozen = gameMatchFrozen(activeMatch, now);
  const zombies = frozen
    ? applyGameZombieDeaths(gameState.zombies, zombieDeaths)
    : isHost ? moveGameZombies(gameState.zombies, players, dt, now, zombieDeaths) : applyGameZombieDeaths(serverGame.zombies, zombieDeaths);
  let collectedPickups = pruneGameTimedMap(isHost ? gameState.collectedPickups || {} : serverGame.collectedPickups || {}, now, GAME_PICKUP_CLAIM_TTL_MS);
  let pepperoniPickups = filterGameAvailablePickups(isHost ? { ...(gameState.pepperoniPickups || {}) } : { ...(serverGame.pepperoniPickups || {}) }, collectedPickups);
  let lastPepperoniSpawnAt = isHost ? Number(gameState.lastPepperoniSpawnAt || 0) : Number(serverGame.lastPepperoniSpawnAt || 0);
  if (isHost && !frozen) {
    const spawned = spawnGamePepperoniPickups(pepperoniPickups, lastPepperoniSpawnAt, now);
    pepperoniPickups = spawned.pickups;
    lastPepperoniSpawnAt = spawned.lastSpawnAt;
  }
  if (!frozen) collectGameToppings(player, pepperoniPickups, collectedPickups, now);
  players[currentUser.uid] = player;
  const leaderboard = gameState.leaderboard || {};
  const nextKillLog = [...(gameState.killLog || [])];
  if (!frozen) resolveGameHits(players, projectiles, zombies, zombieDeaths, leaderboard, nextKillLog, hits, pepperoniPickups, now);
  removedProjectiles = pruneGameTimedMap(mergeGameTimedMaps(removedProjectiles, gameState.removedProjectiles), now, GAME_REMOVED_PROJECTILE_TTL_MS);
  const nextExplosionEffects = pruneGameExplosionEffects(mergeGameTimedMaps(explosionEffects, gameState.explosionEffects), now);
  gameState = {
    ...gameState,
    players,
    projectiles,
    removedProjectiles,
    zombies,
    zombieDeaths,
    explosionEffects: nextExplosionEffects,
    pepperoniPickups,
    collectedPickups,
    lastPepperoniSpawnAt,
    leaderboard,
    freeScores: gameState.freeScores || {},
    records: normalizeGameRecords(gameState.records),
    match: gameState.match || activeMatch,
    hits,
    killLog: nextKillLog.slice(-20),
    walls: GAME_WALLS,
    version: GAME_VERSION,
    updatedAt: now
  };
  gameLocalPlayer = gameState.players[currentUser.uid];
  const zombieSharedChanged = !isHost && gameZombieSignature(gameState.zombies || []) !== zombieSignatureBefore;
  const collectedSharedChanged = gameTimedMapSignature(gameState.collectedPickups || {}) !== collectedSignatureBefore;
  const zombieDeathsSharedChanged = gameTimedMapSignature(gameState.zombieDeaths || {}) !== zombieDeathsSignatureBefore;
  const removedProjectilesSharedChanged = gameTimedMapSignature(gameState.removedProjectiles || {}) !== removedProjectilesSignatureBefore;
  const explosionSharedChanged = gameTimedMapSignature(gameState.explosionEffects || {}) !== explosionSignatureBefore;
  const sharedArenaChanged = Object.keys(hits).length !== hitCountBefore
    || Object.keys(projectiles).length !== projectileCountBefore
    || Object.keys(gameState.pepperoniPickups || {}).length !== pepperoniCountBefore
    || gameScoreSignature(gameState) !== scoreSignatureBefore
    || zombieSharedChanged
    || removedProjectilesSharedChanged
    || explosionSharedChanged
    || collectedSharedChanged
    || zombieDeathsSharedChanged;
  if (sharedArenaChanged) {
    writeGameArenaSharedState(gameState, { includeZombies: zombieSharedChanged || zombieDeathsSharedChanged });
  }
  if (now - gameLastHeartbeat > GAME_HEARTBEAT_MS) {
    gameLastHeartbeat = now;
    syncLocalGame(now);
  }
}

function updateSurvivalGame(dt, now) {
  if (!currentUser?.uid || !gameState?.solo || !gameLocalPlayer) return;
  const solo = { ...gameState.solo };
  const player = { ...gameLocalPlayer };
  normalizeGamePlayerPowerup(player, now);
  const frozen = gameSurvivalFrozen(solo, now);

  if (!solo.gameOver && player.deadUntil && now >= player.deadUntil) {
    const spawn = randomGameSpawn();
    player.x = spawn.x;
    player.y = spawn.y;
    player.alive = true;
    player.deadUntil = 0;
    player.shieldUntil = now + GAME_RESPAWN_SHIELD_MS;
    clearGamePlayerLoadout(player);
  }

  if (!solo.gameOver && !frozen && player.alive) {
    const vector = gameInputVector();
    if (vector.x || vector.y) {
      gameAim = vector;
      player.aimX = vector.x;
      player.aimY = vector.y;
      const speed = gamePlayerMoveSpeed(player);
      const next = moveGamePlayerWithWalls(player.x, player.y, vector.x * speed * dt, vector.y * speed * dt, gamePlayerHitRadius(player));
      player.x = next.x;
      player.y = next.y;
    }
  }

  gameLocalPlayer = player;
  if (!solo.gameOver && !frozen && gameFireHeld && player.powerup === "basil") {
    shootGamePizza();
  }

  player.lastSeen = now;
  const projectiles = pruneGameProjectiles(moveGameProjectiles(gameState.projectiles || {}, dt, now), now);
  let zombies = frozen || solo.gameOver
    ? gameState.zombies || []
    : moveSurvivalZombies(gameState.zombies || [], player, dt, now);
  let collectedPickups = pruneGameTimedMap(gameState.collectedPickups || {}, now, GAME_PICKUP_CLAIM_TTL_MS);
  let pepperoniPickups = filterGameAvailablePickups({ ...(gameState.pepperoniPickups || {}) }, collectedPickups);
  let lastPepperoniSpawnAt = Number(gameState.lastPepperoniSpawnAt || 0);
  if (!solo.gameOver && !frozen) {
    const spawned = spawnGamePepperoniPickups(pepperoniPickups, lastPepperoniSpawnAt, now);
    pepperoniPickups = spawned.pickups;
    lastPepperoniSpawnAt = spawned.lastSpawnAt;
    collectGameToppings(player, pepperoniPickups, collectedPickups, now);
    resolveSurvivalHits(player, projectiles, zombies, pepperoniPickups, solo, now);
    if (!solo.gameOver && survivalWaveCleared(zombies)) {
      const nextWave = startNextSurvivalWave(Number(solo.wave || 1) + 1, now);
      solo.wave = nextWave.solo.wave;
      solo.waveBannerUntil = nextWave.solo.waveBannerUntil;
      zombies = nextWave.zombies;
    }
  }

  gameState = {
    ...gameState,
    players: { [currentUser.uid]: player },
    projectiles,
    zombies,
    pepperoniPickups,
    collectedPickups,
    lastPepperoniSpawnAt,
    walls: GAME_SURVIVAL_WALLS,
    solo,
    updatedAt: now
  };
  gameLocalPlayer = player;
}

function gameSurvivalFrozen(solo = {}, now = Date.now()) {
  return Boolean(now < Number(solo.countdownUntil || 0) || now < Number(solo.waveBannerUntil || 0));
}

function gameSurvivalEnded() {
  return gameViewMode === "solo" && Boolean(gameState?.solo?.gameOver);
}

function startNextSurvivalWave(wave, now = Date.now()) {
  return {
    zombies: createSurvivalWaveZombies(wave, now),
    solo: {
      wave,
      waveBannerUntil: now + GAME_SURVIVAL_WAVE_BANNER_MS
    }
  };
}

function survivalWaveCleared(zombies = []) {
  return zombies.length > 0 && zombies.every((zombie) => !zombie.alive);
}

function createSurvivalWaveZombies(wave = 1, now = Date.now()) {
  const count = gameSurvivalZombieCount(wave);
  return Array.from({ length: count }, (_, index) => {
    const spawn = randomSurvivalGateSpawn(index);
    const angle = Math.atan2(GAME_ARENA.height / 2 - spawn.y, GAME_ARENA.width / 2 - spawn.x);
    return {
      id: `survival-${wave}-${index + 1}-${now}`,
      x: spawn.x,
      y: spawn.y,
      vx: Math.cos(angle),
      vy: Math.sin(angle),
      facing: Math.cos(angle) < 0 ? -1 : 1,
      alive: true,
      deadUntil: 0,
      enteredArena: false,
      speed: gameSurvivalZombieSpeed(wave),
      nextTurnAt: now + randomGameZombieTurnDelay()
    };
  });
}

function gameSurvivalZombieCount(wave = 1) {
  return Math.min(32, 4 + wave * 2);
}

function gameSurvivalZombieSpeed(wave = 1) {
  return Math.min(155, GAME_ZOMBIE_SPEED + Math.max(0, wave - 1) * 6);
}

function randomSurvivalGateSpawn(index = 0) {
  const gate = GAME_SURVIVAL_GATES[index % GAME_SURVIVAL_GATES.length];
  const offset = gameRandomBetween(gate.min, gate.max);
  if (gate.side === "top" || gate.side === "bottom") return { x: offset, y: gate.y };
  return { x: gate.x, y: offset };
}

function gameSurvivalZombieInnerBounds() {
  const inset = GAME_ZOMBIE_RADIUS + 24;
  return {
    minX: inset,
    maxX: GAME_ARENA.width - inset,
    minY: inset,
    maxY: GAME_ARENA.height - inset
  };
}

function moveSurvivalZombies(zombies = [], player, dt, now = Date.now()) {
  return zombies.map((zombie) => {
    if (!zombie.alive) return zombie;
    const enteredArena = Boolean(zombie.enteredArena || gameSurvivalZombieInsideArena(zombie));
    const walls = enteredArena ? GAME_WALLS : GAME_SURVIVAL_WALLS;
    const threat = player?.alive && player.powerup === "meatball" ? player : null;
    const target = !threat && player?.alive && !(player.deadUntil && now < player.deadUntil) ? player : null;
    const direct = threat
      ? gameNormalizedVector(zombie.x - threat.x, zombie.y - threat.y)
      : target ? gameNormalizedVector(target.x - zombie.x, target.y - zombie.y) : gameNormalizedVector(zombie.vx || 1, zombie.vy || 0);
    const focus = threat || target || { x: zombie.x + direct.x, y: zombie.y + direct.y };
    const mode = threat ? "flee" : "chase";
    const vector = gameLineBlockedByWalls(zombie.x, zombie.y, focus.x, focus.y, GAME_ZOMBIE_RADIUS + 3, walls)
      ? gameBestSurvivalZombieDirection(zombie, direct, focus, mode, walls, enteredArena)
      : direct;
    let moved = {
      ...zombie,
      enteredArena,
      vx: vector.x,
      vy: vector.y,
      x: zombie.x + vector.x * Number(zombie.speed || GAME_ZOMBIE_SPEED) * dt,
      y: zombie.y + vector.y * Number(zombie.speed || GAME_ZOMBIE_SPEED) * dt,
      facing: vector.x < -0.04 ? -1 : vector.x > 0.04 ? 1 : zombie.facing || 1
    };
    const hitX = walls.some((wall) => gameCircleRectHit(moved.x, zombie.y, GAME_ZOMBIE_RADIUS, wall));
    const hitY = walls.some((wall) => gameCircleRectHit(moved.x, moved.y, GAME_ZOMBIE_RADIUS, wall));
    if (hitX) moved.x = zombie.x;
    if (hitY) moved.y = zombie.y;
    if (enteredArena || gameSurvivalZombieInsideArena(moved)) {
      const bounds = gameSurvivalZombieInnerBounds();
      moved.enteredArena = true;
      moved.x = gameClamp(moved.x, bounds.minX, bounds.maxX);
      moved.y = gameClamp(moved.y, bounds.minY, bounds.maxY);
    } else {
      moved.x = gameClamp(moved.x, -GAME_ZOMBIE_RADIUS - 18, GAME_ARENA.width + GAME_ZOMBIE_RADIUS + 18);
      moved.y = gameClamp(moved.y, -GAME_ZOMBIE_RADIUS - 18, GAME_ARENA.height + GAME_ZOMBIE_RADIUS + 18);
    }
    return moved;
  });
}

function gameSurvivalZombieInsideArena(zombie) {
  const bounds = gameSurvivalZombieInnerBounds();
  return zombie.x >= bounds.minX
    && zombie.x <= bounds.maxX
    && zombie.y >= bounds.minY
    && zombie.y <= bounds.maxY;
}

function gameBestSurvivalZombieDirection(zombie, preferred, focus, mode, walls = GAME_SURVIVAL_WALLS, enteredArena = false) {
  const perpendicular = { x: -preferred.y, y: preferred.x };
  const candidates = [
    preferred,
    gameNormalizedVector(preferred.x + perpendicular.x * 0.9, preferred.y + perpendicular.y * 0.9),
    gameNormalizedVector(preferred.x - perpendicular.x * 0.9, preferred.y - perpendicular.y * 0.9),
    perpendicular,
    { x: -perpendicular.x, y: -perpendicular.y },
    gameNormalizedVector(preferred.x * 0.35 + perpendicular.x, preferred.y * 0.35 + perpendicular.y),
    gameNormalizedVector(preferred.x * 0.35 - perpendicular.x, preferred.y * 0.35 - perpendicular.y)
  ];
  const step = GAME_ZOMBIE_RADIUS * 2.3;
  return candidates
    .filter((candidate) => candidate.x || candidate.y)
    .map((candidate) => {
      const x = zombie.x + candidate.x * step;
      const y = zombie.y + candidate.y * step;
      const bounds = gameSurvivalZombieInnerBounds();
      const blocked = enteredArena
        ? x < bounds.minX
          || x > bounds.maxX
          || y < bounds.minY
          || y > bounds.maxY
          || walls.some((wall) => gameCircleRectHit(x, y, GAME_ZOMBIE_RADIUS, wall))
        : x < -GAME_ZOMBIE_RADIUS - 20
          || x > GAME_ARENA.width + GAME_ZOMBIE_RADIUS + 20
          || y < -GAME_ZOMBIE_RADIUS - 20
          || y > GAME_ARENA.height + GAME_ZOMBIE_RADIUS + 20
          || walls.some((wall) => gameCircleRectHit(x, y, GAME_ZOMBIE_RADIUS, wall));
      const distance = gameDistance(x, y, focus.x, focus.y);
      return {
        candidate,
        score: (mode === "flee" ? -distance : distance) + (blocked ? 10000 : 0)
      };
    })
    .sort((a, b) => a.score - b.score)[0]?.candidate || preferred;
}

function resolveSurvivalHits(player, projectiles, zombies, pepperoniPickups, solo, now = Date.now()) {
  Object.values(projectiles).forEach((shot) => {
    if (shot.ownerUid !== currentUser.uid) return;
    const shotType = shot.type || "pepperoni";
    if (shotType === "mushroom" && now - Number(shot.createdAt || now) >= GAME_MUSHROOM_FUSE_MS) {
      explodeSurvivalProjectile(shot, player, zombies, pepperoniPickups, projectiles, solo, now);
      return;
    }
    zombies.forEach((zombie) => {
      if (!projectiles[shot.id] || !zombie.alive) return;
      if (gameProjectileHitsCircle(shot, zombie.x, zombie.y, GAME_ZOMBIE_RADIUS)) {
        if (shotType === "mushroom") explodeSurvivalProjectile(shot, player, zombies, pepperoniPickups, projectiles, solo, now);
        else {
          killSurvivalZombie(zombie);
          markGameProjectileRemoved(shot, now);
          delete projectiles[shot.id];
        }
      }
    });
    if (!projectiles[shot.id]) return;
    if (gameProjectileHitsWall(shot)) {
      if (shotType === "mushroom") explodeSurvivalProjectile(shot, player, zombies, pepperoniPickups, projectiles, solo, now);
      else {
        markGameProjectileRemoved(shot, now);
        delete projectiles[shot.id];
      }
    }
  });

  if (player.alive && player.powerup === "meatball") {
    zombies.forEach((zombie) => {
      if (zombie.alive && gameDistance(player.x, player.y, zombie.x, zombie.y) < GAME_MEATBALL_SIZE / 2 + GAME_ZOMBIE_RADIUS) {
        killSurvivalZombie(zombie);
      }
    });
  }

  const playerIsRespawning = player.deadUntil && now < player.deadUntil;
  if (player.alive && !playerIsRespawning && !gamePlayerShielded(player, now) && player.powerup !== "meatball") {
    const touched = zombies.some((zombie) => zombie.alive && gameDistance(player.x, player.y, zombie.x, zombie.y) < gamePlayerHitRadius(player) + GAME_ZOMBIE_RADIUS);
    if (touched) markSurvivalPlayerHit(player, pepperoniPickups, solo, now);
  }
}

function explodeSurvivalProjectile(shot, player, zombies, pepperoniPickups, projectiles, solo, now = Date.now()) {
  addGameExplosionEffect(shot.x, shot.y, GAME_MUSHROOM_SPLASH_RADIUS, now);
  if (player.alive && player.powerup !== "meatball" && !gamePlayerShielded(player, now)) {
    const playerIsRespawning = player.deadUntil && now < player.deadUntil;
    if (!playerIsRespawning && gameDistance(player.x, player.y, shot.x, shot.y) <= GAME_MUSHROOM_SPLASH_RADIUS + gamePlayerHitRadius(player)) {
      markSurvivalPlayerHit(player, pepperoniPickups, solo, now);
    }
  }
  zombies.forEach((zombie) => {
    if (zombie.alive && gameDistance(zombie.x, zombie.y, shot.x, shot.y) <= GAME_MUSHROOM_SPLASH_RADIUS + GAME_ZOMBIE_RADIUS) {
      killSurvivalZombie(zombie);
    }
  });
  markGameProjectileRemoved(shot, now);
  delete projectiles[shot.id];
}

function killSurvivalZombie(zombie) {
  zombie.alive = false;
  zombie.deadUntil = 0;
}

function markSurvivalPlayerHit(player, pepperoniPickups, solo, now = Date.now()) {
  if (solo.gameOver) return;
  solo.lives = Math.max(0, Number(solo.lives || 0) - 1);
  dropGamePepperoniPile(player, pepperoniPickups, now);
  clearGamePlayerLoadout(player);
  player.shieldUntil = 0;
  if (solo.lives <= 0) {
    player.alive = false;
    player.deadUntil = 0;
    solo.gameOver = true;
    return;
  }
  player.alive = false;
  player.deadUntil = now + GAME_RESPAWN_MS;
}

async function syncLocalGame(now) {
  const nextGame = normalizeGame(gameState);
  const players = pruneGamePlayers({ ...nextGame.players, [currentUser.uid]: gameLocalPlayer });
  const leaderboard = nextGame.leaderboard || {};
  const hits = pruneGameHits(nextGame.hits || {}, now);
  const isHost = currentUser.uid === gameHostUid(players);
  const serverGame = normalizeGame(familyData?.gameArena);
  const syncedRemovedProjectiles = pruneGameTimedMap(mergeGameTimedMaps(serverGame.removedProjectiles, nextGame.removedProjectiles), now, GAME_REMOVED_PROJECTILE_TTL_MS);
  syncGameRemovedProjectiles(syncedRemovedProjectiles);
  const projectiles = pruneGameProjectiles(mergeGameProjectiles(gameRemoteProjectiles, nextGame.projectiles), now);
  const nextRemovedProjectiles = pruneGameTimedMap(mergeGameTimedMaps(syncedRemovedProjectiles, gameState?.removedProjectiles), now, GAME_REMOVED_PROJECTILE_TTL_MS);
  const syncedZombies = isHost
    ? nextGame.zombies
    : gameZombieSignature(nextGame.zombies) === gameZombieSignature(serverGame.zombies)
      ? serverGame.zombies
      : nextGame.zombies;
  const syncedCollectedPickups = isHost ? nextGame.collectedPickups : mergeGameTimedMaps(serverGame.collectedPickups, nextGame.collectedPickups);
  const syncedZombieDeaths = pruneGameTimedMap(mergeGameTimedMaps(serverGame.zombieDeaths, nextGame.zombieDeaths), now);
  const syncedExplosionEffects = pruneGameExplosionEffects(mergeGameTimedMaps(serverGame.explosionEffects, nextGame.explosionEffects), now);
  const syncedPepperoniPickups = filterGameAvailablePickups(isHost ? nextGame.pepperoniPickups : serverGame.pepperoniPickups, syncedCollectedPickups);
  const syncedLastPepperoniSpawnAt = isHost ? nextGame.lastPepperoniSpawnAt : serverGame.lastPepperoniSpawnAt;
  const syncedMatch = nextGame.match?.status === "active" || nextGame.match?.status === "ended"
    ? mergeGameMatch(serverGame.match, nextGame.match)
    : serverGame.match || defaultGameMatchState();
  const nextArena = {
    ...nextGame,
    players,
    projectiles,
    removedProjectiles: nextRemovedProjectiles || {},
    walls: GAME_WALLS,
    zombies: syncedZombies,
    zombieDeaths: syncedZombieDeaths || {},
    explosionEffects: syncedExplosionEffects || {},
    pepperoniPickups: syncedPepperoniPickups || {},
    collectedPickups: syncedCollectedPickups || {},
    lastPepperoniSpawnAt: Number(syncedLastPepperoniSpawnAt || 0),
    leaderboard,
    freeScores: nextGame.freeScores || {},
    records: normalizeGameRecords(nextGame.records),
    match: syncedMatch,
    hits,
    killLog: (nextGame.killLog || []).slice(-20),
    version: GAME_VERSION,
    updatedAt: Date.now()
  };
  gameState = { ...nextArena, zombies: nextGame.zombies };
  gameLocalPlayer = gameState.players[currentUser.uid];
  await writeGameArena(nextArena);
}

function gameCountdownText(match = {}, now = Date.now()) {
  const remaining = Math.max(0, Number(match.startedAt || 0) - now);
  if (remaining <= 500) return "GO";
  const seconds = Math.min(3, Math.ceil((remaining - 500) / 1000));
  return seconds > 0 ? String(seconds) : "GO";
}

function gameMatchTimerText(match = {}, now = Date.now()) {
  if (gameMatchFrozen(match, now)) return "2:00";
  const seconds = Math.max(0, Math.ceil((Number(match.endsAt || 0) - now) / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function applyGameMatchStartShield(player, match = {}, now = Date.now()) {
  if (!player || match.status !== "active") return;
  const startedAt = Number(match.startedAt || 0);
  if (!startedAt || now < startedAt || now > startedAt + GAME_RESPAWN_SHIELD_MS) return;
  player.shieldUntil = Math.max(Number(player.shieldUntil || 0), startedAt + GAME_RESPAWN_SHIELD_MS);
}

function maybeFinishGameMatch(now = Date.now()) {
  const arena = normalizeGame(gameState || familyData?.gameArena);
  const match = arena.match;
  if (match.status !== "active") return;
  const activePlayers = pruneGamePlayers(arena.players || {});
  const activeParticipants = activeGameMatchParticipants(match, activePlayers);
  const shouldEndEarly = activeParticipants.length <= 1;
  if (!shouldEndEarly && now < Number(match.endsAt || 0)) return;
  const participantMap = match.participants || {};
  const host = activeParticipants.length
    ? gameHostUid(Object.fromEntries(activeParticipants.map((uid) => [uid, participantMap[uid]])))
    : currentUser?.uid;
  if (host !== currentUser?.uid) return;
  const finalScores = { ...(match.scores || {}) };
  const records = applyMatchRecords({
    ...arena,
    match: {
      ...match,
      finalScores
    }
  });
  const nextArena = {
    ...arena,
    projectiles: {},
    records,
    match: {
      ...match,
      status: "ended",
      finalScores,
      queued: {}
    },
    updatedAt: now
  };
  gameState = nextArena;
  writeGameArenaSharedState(nextArena);
  updateGameModePanels();
}

function activeGameMatchParticipants(match = {}, players = null) {
  return Object.keys(match.participants || {}).filter((uid) => !match.removed?.[uid] && (!players || players[uid]));
}

function normalizeMatchScores(scores = {}, participants = {}) {
  const rows = { ...(scores || {}) };
  Object.values(participants || {}).forEach((participant) => {
    if (!rows[participant.uid]) rows[participant.uid] = { uid: participant.uid, name: participant.name || "Player", xp: 0 };
  });
  return rows;
}

function awardGameXp(uid, amount) {
  if (!uid || !gameState) return;
  if (gameState.match?.status !== "active") {
    awardGameFreeXp(uid, amount);
    return;
  }
  if (!gameMatchParticipant(gameState.match, uid)) return;
  if (Date.now() < Number(gameState.match.startedAt || 0) || Date.now() >= Number(gameState.match.endsAt || 0)) return;
  const participant = gameState.match.participants?.[uid] || gameState.players?.[uid] || { uid, name: "Player" };
  const current = gameState.match.scores?.[uid] || { uid, name: participant.name || "Player", xp: 0 };
  gameState.match = {
    ...gameState.match,
    scores: {
      ...(gameState.match.scores || {}),
      [uid]: {
        ...current,
        uid,
        name: participant.name || current.name || "Player",
        xp: Number(current.xp || 0) + amount
      }
    }
  };
}

function awardGameFreeXp(uid, amount) {
  if (!uid || gameViewMode !== "free") return;
  const player = gameState?.players?.[uid] || gameLocalPlayer || { uid, name: displayName() };
  const current = gameState.freeScores?.[uid] || { uid, name: player.name || "Player", xp: 0, startedAt: Date.now() };
  gameState.freeScores = {
    ...(gameState.freeScores || {}),
    [uid]: {
      ...current,
      uid,
      name: player.name || current.name || "Player",
      xp: Number(current.xp || 0) + amount
    }
  };
}

function updateGameRecord(records = defaultGameRecords(), boardName, row) {
  if (!row?.uid || Number(row.xp || 0) <= 0) return normalizeGameRecords(records);
  const current = normalizeGameRecords(records);
  current[boardName] = normalizeGameRecordRows([...(current[boardName] || []), {
    uid: row.uid,
    name: row.name || "Player",
    xp: Number(row.xp || 0),
    createdAt: Date.now()
  }]);
  return current;
}

function applyFreeplayRecordForCurrentUser(arena = normalizeGame(gameState || familyData?.gameArena)) {
  if (!currentUser?.uid) return normalizeGameRecords(arena.records);
  const row = arena.freeScores?.[currentUser.uid];
  return updateGameRecord(arena.records, "freeplay", row);
}

function applyMatchRecords(arena = normalizeGame(gameState || familyData?.gameArena)) {
  let records = normalizeGameRecords(arena.records);
  Object.values(arena.match?.finalScores || arena.match?.scores || {}).forEach((row) => {
    records = updateGameRecord(records, "matches", row);
  });
  return records;
}

async function writeGameArena(nextArena) {
  const existingArena = familyData?.gameArena || {};
  const existingZombies = existingArena.zombies;
  familyData = { ...familyData, gameArena: nextArena };
  if (!FIREBASE_READY) {
    localStorage.setItem(demoStore.key, JSON.stringify(familyData));
    return;
  }
  const player = nextArena.players?.[currentUser.uid] || null;
  const isHost = currentUser.uid === gameHostUid(nextArena.players || {});
  const patch = {
    version: GAME_VERSION,
    updatedAt: Date.now(),
    records: normalizeGameRecords(nextArena.records),
    [`players/${currentUser.uid}`]: player,
    [`lobby/${currentUser.uid}`]: gameLobbyEntry(gameViewMode)
  };
  if (nextArena.freeScores?.[currentUser.uid]) {
    patch[`freeScores/${currentUser.uid}`] = nextArena.freeScores[currentUser.uid];
  }
  if (isHost || !existingZombies) {
    const mergedZombieDeaths = mergeGameTimedMaps(existingArena.zombieDeaths, nextArena.zombieDeaths);
    const mergedRemovedProjectiles = pruneGameTimedMap(mergeGameTimedMaps(existingArena.removedProjectiles, nextArena.removedProjectiles), Date.now(), GAME_REMOVED_PROJECTILE_TTL_MS);
    const mergedExplosionEffects = pruneGameExplosionEffects(mergeGameTimedMaps(existingArena.explosionEffects, nextArena.explosionEffects));
    const mergedCollectedPickups = mergeGameTimedMaps(existingArena.collectedPickups, nextArena.collectedPickups);
    patch.zombies = nextArena.zombies || GAME_ZOMBIE_STARTS;
    patch.pepperoniPickups = gamePickupPatchValue(nextArena.pepperoniPickups || {}, mergedCollectedPickups || {});
    addGameTimedMapPatch(patch, "zombieDeaths", mergedZombieDeaths);
    addGameTimedMapPatch(patch, "removedProjectiles", mergedRemovedProjectiles);
    patch.explosionEffects = Object.keys(mergedExplosionEffects || {}).length ? mergedExplosionEffects : null;
    addGameTimedMapPatch(patch, "collectedPickups", mergedCollectedPickups);
    patch.lastPepperoniSpawnAt = Number(nextArena.lastPepperoniSpawnAt || 0);
  }

  await services.rtdbFns.update(gameArenaRef(), patch).catch(() => {
    setGameStatus("Error", false);
    showGameArenaStatus("Realtime Database could not save the game.");
  });
}

async function writeFullGameArena(nextArena) {
  familyData = { ...familyData, gameArena: nextArena };
  if (!FIREBASE_READY) {
    localStorage.setItem(demoStore.key, JSON.stringify(familyData));
    return;
  }
  await services.rtdbFns.set(gameArenaRef(), nextArena).catch(() => {
    setGameStatus("Error", false);
    showGameArenaStatus("Realtime Database could not start the match.");
  });
}

async function writeGameArenaSharedState(nextArena, options = {}) {
  if (!FIREBASE_READY) {
    await writeGameArena(nextArena);
    return;
  }
  const mergedCollectedPickups = mergeGameTimedMaps(familyData?.gameArena?.collectedPickups, nextArena.collectedPickups);
  const mergedZombieDeaths = mergeGameTimedMaps(familyData?.gameArena?.zombieDeaths, nextArena.zombieDeaths);
  const mergedRemovedProjectiles = pruneGameTimedMap(mergeGameTimedMaps(familyData?.gameArena?.removedProjectiles, nextArena.removedProjectiles), Date.now(), GAME_REMOVED_PROJECTILE_TTL_MS);
  const mergedExplosionEffects = pruneGameExplosionEffects(mergeGameTimedMaps(familyData?.gameArena?.explosionEffects, nextArena.explosionEffects));
  const patch = {
    version: GAME_VERSION,
    walls: GAME_WALLS,
    projectiles: Object.keys(nextArena.projectiles || {}).length ? nextArena.projectiles : null,
    pepperoniPickups: gamePickupPatchValue(nextArena.pepperoniPickups || {}, mergedCollectedPickups || {}),
    lastPepperoniSpawnAt: Number(nextArena.lastPepperoniSpawnAt || 0),
    leaderboard: Object.keys(nextArena.leaderboard || {}).length ? nextArena.leaderboard : null,
    records: normalizeGameRecords(nextArena.records),
    hits: Object.keys(nextArena.hits || {}).length ? nextArena.hits : null,
    killLog: nextArena.killLog || [],
    [`lobby/${currentUser.uid}`]: gameLobbyEntry(gameViewMode),
    updatedAt: Date.now()
  };
  if (nextArena.freeScores?.[currentUser.uid]) {
    patch[`freeScores/${currentUser.uid}`] = nextArena.freeScores[currentUser.uid];
  }
  if (nextArena.match?.status === "active" || nextArena.match?.status === "ended") {
    patch.match = mergeGameMatch(familyData?.gameArena?.match, nextArena.match);
  }
  addGameTimedMapPatch(patch, "collectedPickups", mergedCollectedPickups);
  addGameTimedMapPatch(patch, "zombieDeaths", mergedZombieDeaths);
  addGameTimedMapPatch(patch, "removedProjectiles", mergedRemovedProjectiles);
  patch.explosionEffects = Object.keys(mergedExplosionEffects || {}).length ? mergedExplosionEffects : null;
  if (options.includeZombies) {
    patch.zombies = nextArena.zombies || GAME_ZOMBIE_STARTS;
  }
  await services.rtdbFns.update(gameArenaRef(), patch).catch(() => {
    setGameStatus("Error", false);
    showGameArenaStatus("Realtime Database could not save the game.");
  });
}

function resolveGameHits(players, projectiles, zombies, zombieDeaths, leaderboard, nextKillLog, hits, pepperoniPickups, now) {
  Object.values(projectiles).forEach((shot) => {
    if (shot.ownerUid !== currentUser.uid) return;
    const shotType = shot.type || "pepperoni";
    if (shotType === "mushroom" && now - Number(shot.createdAt || now) >= GAME_MUSHROOM_FUSE_MS) {
      explodeGameProjectile(shot, players, zombies, zombieDeaths, leaderboard, nextKillLog, hits, pepperoniPickups, projectiles, now);
      return;
    }
    if (gameProjectileHitsWall(shot)) {
      if (shotType === "mushroom") {
        explodeGameProjectile(shot, players, zombies, zombieDeaths, leaderboard, nextKillLog, hits, pepperoniPickups, projectiles, now);
      } else {
        markGameProjectileRemoved(shot, now);
        delete projectiles[shot.id];
      }
      return;
    }
    Object.values(players).forEach((player) => {
      if (!projectiles[shot.id]) return;
      const playerIsRespawning = player.deadUntil && now < player.deadUntil;
      if (!player.alive || player.powerup === "meatball" || playerIsRespawning || gamePlayerShielded(player, now) || hits[player.uid] || player.uid === shot.ownerUid) return;
      if (gameProjectileHitsCircle(shot, player.x, player.y, gamePlayerHitRadius(player))) {
        if (shotType === "mushroom") {
          explodeGameProjectile(shot, players, zombies, zombieDeaths, leaderboard, nextKillLog, hits, pepperoniPickups, projectiles, now);
        } else {
          killGamePlayerByUid(player.uid, shot.ownerUid, players, leaderboard, nextKillLog, hits, pepperoniPickups, now, shot.id);
          markGameProjectileRemoved(shot, now);
          delete projectiles[shot.id];
        }
      }
    });
    if (!projectiles[shot.id]) return;
    zombies.forEach((zombie) => {
      if (!projectiles[shot.id] || !zombie.alive) return;
      if (gameProjectileHitsCircle(shot, zombie.x, zombie.y, GAME_ZOMBIE_RADIUS)) {
        if (shotType === "mushroom") {
          explodeGameProjectile(shot, players, zombies, zombieDeaths, leaderboard, nextKillLog, hits, pepperoniPickups, projectiles, now);
        } else {
          killGameZombie(zombie, zombieDeaths, now, shot.ownerUid);
          markGameProjectileRemoved(shot, now);
          delete projectiles[shot.id];
        }
      }
    });
  });

  Object.values(players).forEach((player) => {
    if (player.uid !== currentUser.uid || !player.alive || player.powerup !== "meatball") return;
    Object.values(players).forEach((target) => {
      const targetIsRespawning = target.deadUntil && now < target.deadUntil;
      if (target.uid === player.uid || !target.alive || target.powerup === "meatball" || targetIsRespawning || gamePlayerShielded(target, now) || hits[target.uid]) return;
      if (gameDistance(player.x, player.y, target.x, target.y) < GAME_MEATBALL_SIZE / 2 + gamePlayerHitRadius(target)) {
        killGamePlayerByUid(target.uid, player.uid, players, leaderboard, nextKillLog, hits, pepperoniPickups, now, `meatball-${now}`);
      }
    });
    zombies.forEach((zombie) => {
      if (zombie.alive && gameDistance(player.x, player.y, zombie.x, zombie.y) < GAME_MEATBALL_SIZE / 2 + GAME_ZOMBIE_RADIUS) {
        killGameZombie(zombie, zombieDeaths, now, player.uid);
      }
    });
  });

  Object.values(players).forEach((player) => {
    const playerIsRespawning = player.deadUntil && now < player.deadUntil;
    if (player.uid !== currentUser.uid || !player.alive || playerIsRespawning) return;
    if (gamePlayerShielded(player, now)) return;
    if (player.powerup === "meatball") return;
    if (zombies.some((zombie) => zombie.alive && gameDistance(player.x, player.y, zombie.x, zombie.y) < gamePlayerHitRadius(player) + GAME_ZOMBIE_RADIUS)) {
      markGamePlayerDead(player, pepperoniPickups, now);
    }
  });
}

function explodeGameProjectile(shot, players, zombies, zombieDeaths, leaderboard, nextKillLog, hits, pepperoniPickups, projectiles, now) {
  const effect = addGameExplosionEffect(shot.x, shot.y, GAME_MUSHROOM_SPLASH_RADIUS, now);
  Object.values(players).forEach((player) => {
    const playerIsRespawning = player.deadUntil && now < player.deadUntil;
    if (!player.alive || player.powerup === "meatball" || playerIsRespawning || gamePlayerShielded(player, now) || hits[player.uid]) return;
    if (gameDistance(player.x, player.y, shot.x, shot.y) <= GAME_MUSHROOM_SPLASH_RADIUS + gamePlayerHitRadius(player)) {
      killGamePlayerByUid(player.uid, shot.ownerUid, players, leaderboard, nextKillLog, hits, pepperoniPickups, now, shot.id);
    }
  });
  zombies.forEach((zombie) => {
    if (zombie.alive && gameDistance(zombie.x, zombie.y, shot.x, shot.y) <= GAME_MUSHROOM_SPLASH_RADIUS + GAME_ZOMBIE_RADIUS) {
      killGameZombie(zombie, zombieDeaths, now, shot.ownerUid);
    }
  });
  markGameProjectileRemoved(shot, now, effect);
  writeGameProjectileBurst(shot, effect);
  delete projectiles[shot.id];
}

function addGameExplosionEffect(x, y, radius, now = Date.now()) {
  const effect = {
    id: `explosion-${now}-${Math.random().toString(36).slice(2)}`,
    x,
    y,
    radius,
    createdAt: now
  };
  gameExplosionEffects.push(effect);
  gameExplosionEffects = gameExplosionEffects.slice(-8);
  if (gameState) {
    gameState.explosionEffects = {
      ...(gameState.explosionEffects || {}),
      [effect.id]: effect
    };
  }
  return effect;
}

function markGameProjectileRemoved(shot, now = Date.now(), effect = null) {
  if (!shot?.id) return null;
  const removal = {
    id: shot.id,
    type: shot.type || "pepperoni",
    createdAt: now
  };
  if (effect) {
    removal.explosionId = effect.id;
    removal.x = effect.x;
    removal.y = effect.y;
    removal.radius = effect.radius;
  }
  gameRemovedProjectileIds.add(shot.id);
  if (gameState) {
    gameState.removedProjectiles = {
      ...(gameState.removedProjectiles || {}),
      [shot.id]: removal
    };
  }
  return removal;
}

function writeGameProjectileBurst(shot, effect) {
  if (!FIREBASE_READY || !shot?.id || !effect?.id) return;
  const removal = gameState?.removedProjectiles?.[shot.id] || markGameProjectileRemoved(shot, effect.createdAt, effect);
  services.rtdbFns.update(gameArenaRef(), {
    [`projectiles/${shot.id}`]: null,
    [`removedProjectiles/${shot.id}`]: removal,
    [`explosionEffects/${effect.id}`]: effect,
    updatedAt: Date.now()
  }).catch(() => {});
}

function killGamePlayerByUid(victimUid, killerUid, players, leaderboard, nextKillLog, hits, pepperoniPickups, now, hitPrefix) {
  const victim = players[victimUid];
  if (!victim || !victim.alive || victim.powerup === "meatball" || gamePlayerShielded(victim, now) || hits[victimUid]) return;
  markGamePlayerDead(victim, pepperoniPickups, now);
  hits[victimUid] = {
    id: `${hitPrefix}-${victimUid}`,
    byUid: killerUid,
    deadUntil: victim.deadUntil,
    createdAt: now
  };
  recordGameKill(leaderboard, nextKillLog, killerUid, victimUid, players);
}

function markGamePlayerDead(player, pepperoniPickups, now = Date.now()) {
  dropGamePepperoniPile(player, pepperoniPickups, now);
  player.alive = false;
  player.deadUntil = now + GAME_RESPAWN_MS;
  player.shieldUntil = 0;
  clearGamePlayerLoadout(player);
}

function clearGamePlayerLoadout(player) {
  player.pepperoniCount = 0;
  player.powerup = "";
  player.powerupUntil = 0;
  player.savedPepperoniCount = 0;
}

function gameCarriedPepperoniCount(player) {
  if (player?.powerup === "meatball" || player?.powerup === "basil") {
    return Math.min(GAME_MAX_PLAYER_PEPPERONI, Number(player.savedPepperoniCount || player.pepperoniCount || 0));
  }
  return Math.min(GAME_MAX_PLAYER_PEPPERONI, Number(player?.pepperoniCount || 0));
}

function dropGamePepperoniPile(player, pepperoniPickups, now = Date.now()) {
  if (!pepperoniPickups) return;
  const dropCount = Math.floor(gameCarriedPepperoniCount(player) / 2);
  for (let index = 0; index < dropCount; index += 1) {
    const position = gamePepperoniDropPosition(player.x, player.y, index);
    const id = `drop-${player.uid || "player"}-${now}-${index}`;
    pepperoniPickups[id] = {
      id,
      type: "pepperoni",
      x: position.x,
      y: position.y,
      createdAt: now
    };
  }
}

function gamePepperoniDropPosition(x, y, index) {
  const radius = GAME_PEPPERONI_PICKUP_SIZE / 2 + 4;
  const baseAngle = index * 2.399963229728653;
  const distance = 20 + (index % 4) * 12;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const angle = baseAngle + attempt * 0.75;
    const candidate = {
      x: gameClamp(x + Math.cos(angle) * distance, radius, GAME_ARENA.width - radius),
      y: gameClamp(y + Math.sin(angle) * distance, radius, GAME_ARENA.height - radius)
    };
    if (!GAME_WALLS.some((wall) => gameCircleRectHit(candidate.x, candidate.y, radius, wall))) return candidate;
  }
  return resolveGameCircleOverlap(x, y, radius);
}

function killGameZombie(zombie, zombieDeaths = {}, now = Date.now(), killerUid = "") {
  zombie.alive = false;
  zombie.deadUntil = now + GAME_ZOMBIE_RESPAWN_MS;
  awardGameXp(killerUid, GAME_XP.zombie);
  zombieDeaths[zombie.id] = {
    id: zombie.id,
    deadUntil: zombie.deadUntil,
    createdAt: now
  };
}

function recordGameKill(leaderboard, nextKillLog, killerUid, victimUid, players) {
  if (!killerUid || killerUid === victimUid) return;
  awardGameXp(killerUid, GAME_XP.player);
  const killer = players[killerUid] || { uid: killerUid, name: "Player" };
  const victim = players[victimUid] || { uid: victimUid, name: "Player" };
  nextKillLog.push({
    id: `${killerUid}-${victimUid}-${Date.now()}`,
    killerUid,
    killerName: killer.name || "Player",
    victimUid,
    victimName: victim.name || "Player",
    createdAt: Date.now()
  });
}

function gameHostUid(players = {}) {
  return Object.keys(players).sort()[0] || currentUser?.uid || "";
}

function spawnGamePepperoniPickups(pickups = {}, lastSpawnAt = 0, now = Date.now()) {
  const nextPickups = { ...(pickups || {}) };
  let nextLastSpawnAt = Number(lastSpawnAt || 0);
  if (Object.keys(nextPickups).length >= GAME_MAX_MAP_PEPPERONI || now - nextLastSpawnAt < GAME_PEPPERONI_SPAWN_MS) {
    return { pickups: nextPickups, lastSpawnAt: nextLastSpawnAt || now };
  }
  const spawn = randomGamePepperoniSpawn(nextPickups);
  if (!spawn) return { pickups: nextPickups, lastSpawnAt: now };
  const type = randomGameToppingType();
  const id = `${type}-${now}-${Math.floor(Math.random() * 100000)}`;
  nextPickups[id] = { id, type, x: spawn.x, y: spawn.y, createdAt: now };
  return { pickups: nextPickups, lastSpawnAt: now };
}

function randomGameToppingType() {
  if (Math.random() >= GAME_SPECIAL_TOPPING_CHANCE) return "pepperoni";
  const specials = ["mushroom", "meatball", "basil"];
  return specials[Math.floor(Math.random() * specials.length)];
}

function randomGamePepperoniSpawn(existingPickups = {}) {
  const radius = GAME_PEPPERONI_PICKUP_SIZE / 2;
  const state = gameState || normalizeGame(familyData?.gameArena);
  for (let attempt = 0; attempt < 70; attempt += 1) {
    const x = radius + 28 + Math.random() * (GAME_ARENA.width - (radius + 28) * 2);
    const y = radius + 28 + Math.random() * (GAME_ARENA.height - (radius + 28) * 2);
    const blocked = state.walls.some((wall) => gameCircleRectHit(x, y, radius + 6, wall))
      || (state.zombies || []).some((zombie) => zombie.alive && gameDistance(x, y, zombie.x, zombie.y) < 70)
      || Object.values(state.players || {}).some((player) => gameDistance(x, y, player.x, player.y) < GAME_PLAYER_SIZE)
      || Object.values(existingPickups || {}).some((pickup) => gameDistance(x, y, pickup.x, pickup.y) < 44);
    if (!blocked) return { x, y };
  }
  return null;
}

function collectGameToppings(player, pickups, collectedPickups, now = Date.now()) {
  if (!player?.alive) return;
  normalizeGamePlayerPowerup(player, now);
  Object.values(pickups || {}).forEach((pickup) => {
    if (collectedPickups?.[pickup.id] || gameConsumedPickupIds.has(pickup.id)) {
      delete pickups[pickup.id];
      return;
    }
    if (gameDistance(player.x, player.y, pickup.x, pickup.y) <= GAME_PLAYER_SIZE / 2 + GAME_PEPPERONI_PICKUP_SIZE / 2) {
      const type = pickup.type || "pepperoni";
      if (type === "pepperoni") {
        if (!canCollectAmmoTopping(player)) return;
        player.pepperoniCount = Math.min(GAME_MAX_PLAYER_PEPPERONI, Number(player.pepperoniCount || 0) + 1);
        awardGameXp(player.uid, GAME_XP.pepperoni);
      } else {
        if (!applyGamePowerup(player, type, now)) return;
        awardGameXp(player.uid, GAME_XP.special);
      }
      collectedPickups[pickup.id] = now;
      gameConsumedPickupIds.add(pickup.id);
      delete pickups[pickup.id];
    }
  });
}

function canCollectAmmoTopping(player) {
  if (player.powerup === "meatball" || player.powerup === "basil") return false;
  return Number(player.pepperoniCount || 0) < GAME_MAX_PLAYER_PEPPERONI;
}

function applyGamePowerup(player, type, now = Date.now()) {
  normalizeGamePlayerPowerup(player, now);
  if (player.powerup) return false;
  const currentAmmo = Math.min(GAME_MAX_PLAYER_PEPPERONI, Number(player.pepperoniCount || 0));
  player.powerup = type;
  player.powerupUntil = now + GAME_SPECIAL_TOPPING_DURATION_MS;
  if (type === "mushroom") {
    player.pepperoniCount = Math.min(GAME_MAX_PLAYER_PEPPERONI, currentAmmo + 1);
    player.savedPepperoniCount = 0;
    return true;
  }
  player.savedPepperoniCount = currentAmmo;
  if (type === "meatball" || type === "basil") {
    player.pepperoniCount = currentAmmo;
  }
  if (type === "meatball") {
    const resolved = resolveGameCircleOverlap(player.x, player.y, GAME_MEATBALL_SIZE / 2);
    player.x = resolved.x;
    player.y = resolved.y;
  }
  return true;
}

function normalizeGamePlayerPowerup(player, now = Date.now()) {
  if (!player?.powerup || !player.powerupUntil || now < Number(player.powerupUntil || 0)) return;
  if (player.powerup === "meatball" || player.powerup === "basil") {
    player.pepperoniCount = Math.min(GAME_MAX_PLAYER_PEPPERONI, Number(player.savedPepperoniCount || player.pepperoniCount || 0));
  }
  player.powerup = "";
  player.powerupUntil = 0;
  player.savedPepperoniCount = 0;
}

function gamePlayerHitRadius(player) {
  return player?.powerup === "meatball" ? GAME_MEATBALL_SIZE / 2 : GAME_PLAYER_SIZE / 2;
}

function gamePlayerShielded(player, now = Date.now()) {
  return Boolean(player?.alive && Number(player.shieldUntil || 0) > now);
}

function gameExpiringFlashAlpha(until = 0, windowMs = GAME_POWERUP_FLASH_MS, now = Date.now()) {
  const remaining = Number(until || 0) - now;
  if (remaining <= 0 || remaining > windowMs) return 1;
  return Math.floor(now / 150) % 2 === 0 ? 1 : 0.28;
}

function drawGameShield(ctx, player, radius, now = Date.now()) {
  if (!gamePlayerShielded(player, now)) return;
  const alpha = gameExpiringFlashAlpha(player.shieldUntil, GAME_SHIELD_FLASH_MS, now);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "#7ee7ff";
  ctx.fillStyle = "rgba(126, 231, 255, 0.13)";
  ctx.lineWidth = 4;
  ctx.shadowColor = "rgba(126, 231, 255, 0.9)";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(0, 0, radius + 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawGameShieldIcon(ctx, player, now = Date.now()) {
  if (!gamePlayerShielded(player, now)) return;
  const alpha = gameExpiringFlashAlpha(player.shieldUntil, GAME_SHIELD_FLASH_MS, now);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.shadowColor = "rgba(126, 231, 255, 0.72)";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#dffaff";
  ctx.strokeStyle = "#225e70";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -15);
  ctx.lineTo(15, -8);
  ctx.quadraticCurveTo(12, 10, 0, 17);
  ctx.quadraticCurveTo(-12, 10, -15, -8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function gamePlayerMoveSpeed(player) {
  return player?.powerup === "meatball" ? GAME_PLAYER_SPEED * GAME_MEATBALL_SPEED_MULTIPLIER : GAME_PLAYER_SPEED;
}

function moveGameZombies(zombies, players, dt, now = Date.now(), zombieDeaths = {}) {
  const normalizedZombies = applyGameZombieDeaths(normalizeGameZombies(zombies).slice(0, GAME_ZOMBIE_MAX), zombieDeaths);
  const aggroZombieIds = gameAggroZombieIds(normalizedZombies, players, now);
  return normalizedZombies.map((zombie) => {
    let nextZombie = zombie;
    if (!nextZombie.alive) {
      if (now < Number(nextZombie.deadUntil || 0)) return nextZombie;
      const spawn = randomGameZombieSpawn(players, zombies);
      nextZombie = {
        ...nextZombie,
        ...(spawn || { x: nextZombie.x, y: nextZombie.y }),
        alive: true,
        deadUntil: 0,
        vx: spawn?.vx || nextZombie.vx || 1,
        vy: spawn?.vy || nextZombie.vy || 0,
        nextTurnAt: now + randomGameZombieTurnDelay()
      };
      delete zombieDeaths[nextZombie.id];
    }

    nextZombie = normalizeGameZombie(nextZombie, now);
    const threat = closestGameZombieMeatballThreat(nextZombie, players, now);
    const target = !threat && aggroZombieIds.has(nextZombie.id) ? closestGameZombieTarget(nextZombie, players, now) : null;
    if (threat || target) {
      const vector = threat
        ? gameZombieFleeDirection(nextZombie, threat)
        : gameZombieChaseDirection(nextZombie, target);
      nextZombie = {
        ...nextZombie,
        vx: vector.x,
        vy: vector.y
      };
    } else if (now >= Number(nextZombie.nextTurnAt || 0)) {
      nextZombie = turnGameZombie(nextZombie, now);
    }

    let moved = {
      ...nextZombie,
      x: nextZombie.x + nextZombie.vx * GAME_ZOMBIE_SPEED * dt,
      y: nextZombie.y + nextZombie.vy * GAME_ZOMBIE_SPEED * dt,
      facing: nextZombie.vx < -0.04 ? -1 : nextZombie.vx > 0.04 ? 1 : nextZombie.facing || 1
    };
    const hitX = moved.x < GAME_ZOMBIE_RADIUS || moved.x > GAME_ARENA.width - GAME_ZOMBIE_RADIUS
      || GAME_WALLS.some((wall) => gameCircleRectHit(moved.x, nextZombie.y, GAME_ZOMBIE_RADIUS, wall));
    const hitY = moved.y < GAME_ZOMBIE_RADIUS || moved.y > GAME_ARENA.height - GAME_ZOMBIE_RADIUS
      || GAME_WALLS.some((wall) => gameCircleRectHit(moved.x, moved.y, GAME_ZOMBIE_RADIUS, wall));
    if (hitX) {
      moved.x = nextZombie.x;
      moved = target ? turnGameZombie({ ...moved, vx: -moved.vx }, now) : turnGameZombie(moved, now);
    }
    if (hitY) {
      moved.y = nextZombie.y;
      moved = target ? turnGameZombie({ ...moved, vy: -moved.vy }, now) : turnGameZombie(moved, now);
    }
    return unstickGameZombie(moved);
  });
}

function normalizeGameZombies(zombies = []) {
  const now = Date.now();
  const savedZombies = Array.isArray(zombies) ? zombies : Object.values(zombies || {});
  const source = savedZombies.length ? savedZombies : GAME_ZOMBIE_STARTS;
  return source.slice(0, GAME_ZOMBIE_MAX).map((zombie, index) => normalizeGameZombie({
    id: zombie.id || `zombie-${index + 1}`,
    x: Number(zombie.x || GAME_ZOMBIE_STARTS[index]?.x || 80),
    y: Number(zombie.y || GAME_ZOMBIE_STARTS[index]?.y || 80),
    vx: Number(zombie.vx || GAME_ZOMBIE_STARTS[index]?.vx || 1),
    vy: Number(zombie.vy || GAME_ZOMBIE_STARTS[index]?.vy || 0),
    facing: Number(zombie.facing || GAME_ZOMBIE_STARTS[index]?.facing || 1),
    alive: zombie.alive !== false,
    deadUntil: Number(zombie.deadUntil || 0),
    nextTurnAt: Number(zombie.nextTurnAt || 0)
  }, now));
}

function applyGameZombieDeaths(zombies = [], zombieDeaths = {}) {
  const now = Date.now();
  return normalizeGameZombies(zombies).map((zombie) => {
    const death = zombieDeaths?.[zombie.id];
    if (!death || Number(death.deadUntil || 0) <= now) return zombie;
    return {
      ...zombie,
      alive: false,
      deadUntil: Number(death.deadUntil || 0)
    };
  });
}

function mergeGameZombies(remote = [], local = [], zombieDeaths = {}) {
  const remoteZombies = applyGameZombieDeaths(remote, zombieDeaths);
  const localById = Object.fromEntries(applyGameZombieDeaths(local, zombieDeaths).map((zombie) => [zombie.id, zombie]));
  return remoteZombies.map((remoteZombie) => {
    const localZombie = localById[remoteZombie.id];
    if (!localZombie) return remoteZombie;
    if (remoteZombie.alive === false && Number(remoteZombie.deadUntil || 0) >= Number(localZombie.deadUntil || 0)) {
      return remoteZombie;
    }
    return localZombie;
  });
}

function normalizeGameZombie(zombie, now) {
  const magnitude = Math.hypot(zombie.vx, zombie.vy) || 1;
  return unstickGameZombie({
    ...zombie,
    vx: zombie.vx / magnitude,
    vy: zombie.vy / magnitude,
    facing: zombie.vx < -0.04 ? -1 : zombie.vx > 0.04 ? 1 : zombie.facing || 1,
    nextTurnAt: zombie.nextTurnAt || now + randomGameZombieTurnDelay()
  });
}

function unstickGameZombie(zombie) {
  let next = { ...zombie };
  for (let pass = 0; pass < 3; pass += 1) {
    const wall = GAME_WALLS.find((rect) => gameCircleRectHit(next.x, next.y, GAME_ZOMBIE_RADIUS, rect));
    if (!wall) break;
    const moves = [
      { axis: "x", value: wall.x - GAME_ZOMBIE_RADIUS - 1, distance: Math.abs(next.x - (wall.x - GAME_ZOMBIE_RADIUS - 1)) },
      { axis: "x", value: wall.x + wall.w + GAME_ZOMBIE_RADIUS + 1, distance: Math.abs(next.x - (wall.x + wall.w + GAME_ZOMBIE_RADIUS + 1)) },
      { axis: "y", value: wall.y - GAME_ZOMBIE_RADIUS - 1, distance: Math.abs(next.y - (wall.y - GAME_ZOMBIE_RADIUS - 1)) },
      { axis: "y", value: wall.y + wall.h + GAME_ZOMBIE_RADIUS + 1, distance: Math.abs(next.y - (wall.y + wall.h + GAME_ZOMBIE_RADIUS + 1)) }
    ].sort((a, b) => a.distance - b.distance);
    const move = moves.find((candidate) => {
      const x = candidate.axis === "x" ? candidate.value : next.x;
      const y = candidate.axis === "y" ? candidate.value : next.y;
      return x >= GAME_ZOMBIE_RADIUS && x <= GAME_ARENA.width - GAME_ZOMBIE_RADIUS && y >= GAME_ZOMBIE_RADIUS && y <= GAME_ARENA.height - GAME_ZOMBIE_RADIUS;
    }) || moves[0];
    next = {
      ...next,
      [move.axis]: move.axis === "x"
        ? gameClamp(move.value, GAME_ZOMBIE_RADIUS, GAME_ARENA.width - GAME_ZOMBIE_RADIUS)
        : gameClamp(move.value, GAME_ZOMBIE_RADIUS, GAME_ARENA.height - GAME_ZOMBIE_RADIUS)
    };
  }
  return next;
}

function turnGameZombie(zombie, now) {
  const angle = Math.atan2(zombie.vy, zombie.vx) + gameRandomBetween(-1.25, 1.25);
  return {
    ...zombie,
    vx: Math.cos(angle),
    vy: Math.sin(angle),
    facing: Math.cos(angle) < 0 ? -1 : 1,
    nextTurnAt: now + randomGameZombieTurnDelay()
  };
}

function randomGameZombieTurnDelay() {
  return gameRandomBetween(GAME_ZOMBIE_TURN_MIN_MS, GAME_ZOMBIE_TURN_MAX_MS);
}

function gameAggroZombieIds(zombies = [], players = {}, now = Date.now()) {
  return new Set(zombies
    .filter((zombie) => zombie.alive && !(zombie.deadUntil && now < zombie.deadUntil))
    .map((zombie) => ({
      zombie,
      target: closestGameZombieTarget(zombie, players, now)
    }))
    .filter(({ target }) => target)
    .map(({ zombie, target }) => ({
      id: zombie.id,
      distance: gameDistance(zombie.x, zombie.y, target.x, target.y)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, GAME_ZOMBIE_MAX_AGGRO)
    .map(({ id }) => id));
}

function closestGameZombieTarget(zombie, players = {}, now = Date.now()) {
  return Object.values(players)
    .filter((player) => player.alive && player.powerup !== "meatball" && !(player.deadUntil && now < player.deadUntil))
    .map((player) => ({ player, distance: gameDistance(zombie.x, zombie.y, player.x, player.y) }))
    .filter(({ distance }) => distance <= GAME_ZOMBIE_AGGRO_RADIUS)
    .sort((a, b) => a.distance - b.distance)[0]?.player || null;
}

function closestGameZombieMeatballThreat(zombie, players = {}, now = Date.now()) {
  return Object.values(players)
    .filter((player) => player.alive && player.powerup === "meatball" && !(player.deadUntil && now < player.deadUntil))
    .map((player) => ({ player, distance: gameDistance(zombie.x, zombie.y, player.x, player.y) }))
    .filter(({ distance }) => distance <= GAME_ZOMBIE_AGGRO_RADIUS)
    .sort((a, b) => a.distance - b.distance)[0]?.player || null;
}

function gameZombieChaseDirection(zombie, target) {
  const direct = gameNormalizedVector(target.x - zombie.x, target.y - zombie.y);
  if (!gameLineBlockedByWall(zombie.x, zombie.y, target.x, target.y, GAME_ZOMBIE_RADIUS + 3)) return direct;
  return gameBestZombieDirection(zombie, direct, target, "chase");
}

function gameZombieFleeDirection(zombie, threat) {
  const direct = gameNormalizedVector(zombie.x - threat.x, zombie.y - threat.y);
  return gameBestZombieDirection(zombie, direct, threat, "flee");
}

function gameBestZombieDirection(zombie, preferred, focus, mode) {
  const perpendicular = { x: -preferred.y, y: preferred.x };
  const candidates = [
    preferred,
    gameNormalizedVector(preferred.x + perpendicular.x * 0.9, preferred.y + perpendicular.y * 0.9),
    gameNormalizedVector(preferred.x - perpendicular.x * 0.9, preferred.y - perpendicular.y * 0.9),
    perpendicular,
    { x: -perpendicular.x, y: -perpendicular.y },
    gameNormalizedVector(preferred.x * 0.35 + perpendicular.x, preferred.y * 0.35 + perpendicular.y),
    gameNormalizedVector(preferred.x * 0.35 - perpendicular.x, preferred.y * 0.35 - perpendicular.y)
  ];
  const step = GAME_ZOMBIE_RADIUS * 2.3;
  const ranked = candidates
    .filter((candidate) => candidate.x || candidate.y)
    .map((candidate) => {
      const x = zombie.x + candidate.x * step;
      const y = zombie.y + candidate.y * step;
      const blocked = x < GAME_ZOMBIE_RADIUS
        || x > GAME_ARENA.width - GAME_ZOMBIE_RADIUS
        || y < GAME_ZOMBIE_RADIUS
        || y > GAME_ARENA.height - GAME_ZOMBIE_RADIUS
        || GAME_WALLS.some((wall) => gameCircleRectHit(x, y, GAME_ZOMBIE_RADIUS, wall));
      const distance = gameDistance(x, y, focus.x, focus.y);
      return {
        candidate,
        score: (mode === "flee" ? -distance : distance) + (blocked ? 10000 : 0)
      };
    })
    .sort((a, b) => a.score - b.score);
  return ranked[0]?.candidate || preferred;
}

function gameNormalizedVector(x, y) {
  const magnitude = Math.hypot(x, y) || 1;
  return { x: x / magnitude, y: y / magnitude };
}

function gameLineBlockedByWall(x1, y1, x2, y2, radius = 0) {
  return gameLineBlockedByWalls(x1, y1, x2, y2, radius, GAME_WALLS);
}

function gameLineBlockedByWalls(x1, y1, x2, y2, radius = 0, walls = GAME_WALLS) {
  const steps = Math.max(6, Math.ceil(gameDistance(x1, y1, x2, y2) / 32));
  for (let index = 1; index < steps; index += 1) {
    const t = index / steps;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    if (walls.some((wall) => gameCircleRectHit(x, y, radius, wall))) return true;
  }
  return false;
}

function randomGameZombieSpawn(players = {}, zombies = []) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const x = GAME_ZOMBIE_RADIUS + 28 + Math.random() * (GAME_ARENA.width - (GAME_ZOMBIE_RADIUS + 28) * 2);
    const y = GAME_ZOMBIE_RADIUS + 28 + Math.random() * (GAME_ARENA.height - (GAME_ZOMBIE_RADIUS + 28) * 2);
    const blocked = GAME_WALLS.some((wall) => gameCircleRectHit(x, y, GAME_ZOMBIE_RADIUS + 4, wall))
      || Object.values(players || {}).some((player) => gameDistance(x, y, player.x, player.y) < GAME_PLAYER_SIZE * 1.35)
      || (zombies || []).some((zombie) => zombie.alive && gameDistance(x, y, zombie.x, zombie.y) < GAME_ZOMBIE_SIZE * 1.35);
    if (!blocked) {
      const angle = Math.random() * Math.PI * 2;
      return { x, y, vx: Math.cos(angle), vy: Math.sin(angle), facing: Math.cos(angle) < 0 ? -1 : 1 };
    }
  }
  return null;
}

function gameZombieSignature(zombies = []) {
  return (zombies || []).map((zombie) => [
    zombie.id,
    Math.round(Number(zombie.x || 0)),
    Math.round(Number(zombie.y || 0)),
    zombie.alive === false ? 0 : 1,
    Math.round(Number(zombie.deadUntil || 0) / 100)
  ].join(":")).join("|");
}

function pruneGamePlayers(players) {
  const now = Date.now();
  return Object.fromEntries(Object.entries(players).filter(([, player]) => now - (player.lastSeen || 0) < GAME_STALE_PLAYER_MS));
}

function pruneGameProjectiles(projectiles, now) {
  const next = {};
  Object.values(projectiles || {}).forEach((shot) => {
    if (gameRemovedProjectileIds.has(shot.id)) return;
    const shotType = shot.type || "pepperoni";
    const wallHit = gameProjectileHitsWall(shot);
    const mushroomWaitingToBurst = shotType === "mushroom" && (wallHit || now - Number(shot.createdAt || now) >= GAME_MUSHROOM_FUSE_MS);
    const shotLife = Number(shot.lifeMs || GAME_PIZZA_LIFE_MS);
    if (now - shot.createdAt > shotLife || !gameProjectileInBounds(shot)) {
      markGameProjectileRemoved(shot, now);
      return;
    }
    next[shot.id] = { ...shot, wallHit, burstReady: mushroomWaitingToBurst || Boolean(shot.burstReady) };
  });
  return next;
}

function gameProjectileHitsWall(shot) {
  return GAME_WALLS.some((wall) => gameCircleRectHit(shot.x, shot.y, GAME_PIZZA_PROJECTILE_SIZE / 2, wall));
}

function gameProjectileInBounds(shot) {
  return shot.x >= -GAME_PIZZA_BOUNDS_PADDING
    && shot.x <= GAME_ARENA.width + GAME_PIZZA_BOUNDS_PADDING
    && shot.y >= -GAME_PIZZA_BOUNDS_PADDING
    && shot.y <= GAME_ARENA.height + GAME_PIZZA_BOUNDS_PADDING;
}

function gameProjectileHitsCircle(shot, x, y, radius) {
  const startX = Number.isFinite(shot.prevX) ? shot.prevX : shot.x;
  const startY = Number.isFinite(shot.prevY) ? shot.prevY : shot.y;
  const hitRadius = radius + GAME_PIZZA_PROJECTILE_SIZE / 2;
  return gamePointSegmentDistance(x, y, startX, startY, shot.x, shot.y) <= hitRadius;
}

function gamePointSegmentDistance(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  if (!dx && !dy) return gameDistance(px, py, ax, ay);
  const t = gameClamp(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy), 0, 1);
  return gameDistance(px, py, ax + dx * t, ay + dy * t);
}

function moveGameProjectiles(projectiles, dt, now = Date.now()) {
  return Object.fromEntries(Object.values(projectiles || {}).map((shot) => [
    shot.id,
    {
      ...shot,
      prevX: shot.x,
      prevY: shot.y,
      x: shot.x + shot.vx * dt,
      y: shot.y + shot.vy * dt,
      updatedAt: now
    }
  ]));
}

function mergeGameProjectiles(remote = {}, local = {}) {
  const merged = {};
  Object.entries(remote || {}).forEach(([id, shot]) => {
    if (!gameRemovedProjectileIds.has(id)) merged[id] = shot;
  });
  Object.entries(local || {}).forEach(([id, shot]) => {
    if (gameRemovedProjectileIds.has(id)) return;
    const existing = merged[id];
    if (!existing || (shot.updatedAt || shot.createdAt || 0) >= (existing.updatedAt || existing.createdAt || 0)) {
      merged[id] = shot;
    }
  });
  return merged;
}

function shootGamePizza() {
  const now = Date.now();
  if (!currentUser?.uid || !gameLocalPlayer?.alive) return;
  if (gameSpectating || gameMatchFrozen(gameState?.match || {}, now) || gameState?.match?.status === "ended") return;
  normalizeGamePlayerPowerup(gameLocalPlayer, now);
  const shotType = gameCurrentShotType(gameLocalPlayer);
  const cooldown = shotType === "basil" ? GAME_BASIL_FIRE_MS : 430;
  if (!shotType || now - gameLastShotAt < cooldown) return;
  gameLastShotAt = now;
  if (shotType !== "basil") {
    gameLocalPlayer = {
      ...gameLocalPlayer,
      pepperoniCount: Math.max(0, Number(gameLocalPlayer.pepperoniCount || 0) - 1)
    };
  }
  const shotId = `${currentUser.uid}-${now}`;
  const mag = Math.hypot(gameAim.x, gameAim.y) || 1;
  const shotOffset = GAME_PLAYER_SIZE / 2 + 12;
  const shotX = gameLocalPlayer.x + (gameAim.x / mag) * shotOffset;
  const shotY = gameLocalPlayer.y + (gameAim.y / mag) * shotOffset;
  const shot = {
    id: shotId,
    ownerUid: currentUser.uid,
    prevX: shotX,
    prevY: shotY,
    x: shotX,
    y: shotY,
    vx: (gameAim.x / mag) * GAME_PIZZA_SPEED,
    vy: (gameAim.y / mag) * GAME_PIZZA_SPEED,
    type: shotType,
    lifeMs: shotType === "basil" ? GAME_BASIL_LIFE_MS : GAME_PIZZA_LIFE_MS,
    createdAt: now,
    updatedAt: now
  };
  gameState.projectiles = {
    ...gameState.projectiles,
    [shotId]: shot
  };
  gameState.players = {
    ...gameState.players,
    [currentUser.uid]: gameLocalPlayer
  };
  gameRemoteProjectiles = {
    ...gameRemoteProjectiles,
    [shotId]: shot
  };
  if (gameViewMode !== "solo") writeGameArenaSharedState(gameState);
}

function gameCurrentShotType(player) {
  if (!player?.alive || player.powerup === "meatball") return "";
  if (player.powerup === "basil") return "basil";
  if (Number(player.pepperoniCount || 0) <= 0) return "";
  if (player.powerup === "mushroom") return "mushroom";
  return "pepperoni";
}

function drawGame() {
  const canvas = document.querySelector("#game-canvas");
  if (!canvas || !gameState) return;
  if (canvas.width !== GAME_ARENA.width) canvas.width = GAME_ARENA.width;
  if (canvas.height !== GAME_ARENA.height) canvas.height = GAME_ARENA.height;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, GAME_ARENA.width, GAME_ARENA.height);
  ctx.fillStyle = "#15131f";
  ctx.fillRect(0, 0, GAME_ARENA.width, GAME_ARENA.height);
  drawGameGrid(ctx);
  gameState.walls.forEach((wall) => drawGameWall(ctx, wall));
  gameState.zombies.forEach((zombie) => {
    if (zombie.alive) drawGameZombie(ctx, zombie);
  });
  Object.values(gameState.pepperoniPickups || {}).forEach((pickup) => drawGameToppingPickup(ctx, pickup));
  Object.values(gameState.projectiles).forEach((shot) => drawGamePizzaShot(ctx, shot));
  drawGameExplosionEffects(ctx);
  Object.values(gameVisualPlayers).forEach((player) => drawGamePlayer(ctx, player));

  if (gameViewMode === "solo") {
    const text = gameSurvivalOverlayText(gameState.solo);
    if (text) drawGameCountdownOverlay(ctx, text);
    hideGameArenaStatus();
    if (gameState.solo?.gameOver) updateGameModePanels();
    renderSurvivalHud();
    renderAmmoDisplay();
    return;
  }

  const match = gameState.match || defaultGameMatchState();
  if (gameMatchFrozen(match)) {
    showGameArenaStatus(gameMatchTimerText(match));
    drawGameCountdownOverlay(ctx, gameCountdownText(match));
  } else if (match.status === "active") {
    showGameArenaStatus(gameMatchTimerText(match));
  } else if (match.status === "ended") {
    showGameArenaStatus("Match complete");
    updateGameModePanels();
  } else if (gameLocalPlayer && !gameLocalPlayer.alive) {
    showGameArenaStatus("Respawning...");
  } else if (document.querySelector("#game-connection-status")?.textContent === "Online") {
    hideGameArenaStatus();
  }
  renderMatchLeaderboard();
  renderAmmoDisplay();
}

function gameSurvivalOverlayText(solo = {}, now = Date.now()) {
  if (!solo || solo.gameOver) return solo?.gameOver ? "GAME OVER" : "";
  if (now < Number(solo.countdownUntil || 0)) return gameCountdownText({ startedAt: Number(solo.countdownUntil || 0) }, now);
  if (now < Number(solo.waveBannerUntil || 0)) return `WAVE ${Number(solo.wave || 1)}`;
  return "";
}

function drawGameCountdownOverlay(ctx, text) {
  if (!text) return;
  ctx.save();
  ctx.fillStyle = "rgba(17, 16, 25, 0.24)";
  ctx.fillRect(0, 0, GAME_ARENA.width, GAME_ARENA.height);
  ctx.font = "950 150px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 12;
  ctx.strokeStyle = "rgba(17, 16, 25, 0.72)";
  ctx.fillStyle = "#fff7ea";
  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 18;
  ctx.strokeText(text, GAME_ARENA.width / 2, GAME_ARENA.height / 2);
  ctx.fillText(text, GAME_ARENA.width / 2, GAME_ARENA.height / 2);
  ctx.restore();
}

function updateGameVisualPlayers(dt) {
  if (!gameState?.players) {
    gameVisualPlayers = {};
    return;
  }
  const smoothing = 1 - Math.exp(-GAME_REMOTE_PLAYER_SMOOTHING * dt);
  const nextVisualPlayers = {};
  Object.entries(gameState.players).forEach(([uid, target]) => {
    if (uid === currentUser?.uid) {
      nextVisualPlayers[uid] = { ...target };
      return;
    }
    const previous = gameVisualPlayers[uid];
    const shouldSnap = !previous
      || previous.alive !== target.alive
      || Math.abs(Number(previous.deadUntil || 0) - Number(target.deadUntil || 0)) > 250
      || gameDistance(previous.x, previous.y, target.x, target.y) > GAME_REMOTE_PLAYER_SNAP_DISTANCE;
    if (shouldSnap) {
      nextVisualPlayers[uid] = { ...target };
      return;
    }
    const previousAimX = Number(previous.aimX || 1);
    const previousAimY = Number(previous.aimY || 0);
    const targetAimX = Number(target.aimX || previousAimX);
    const targetAimY = Number(target.aimY || previousAimY);
    nextVisualPlayers[uid] = {
      ...target,
      x: previous.x + (target.x - previous.x) * smoothing,
      y: previous.y + (target.y - previous.y) * smoothing,
      aimX: previousAimX + (targetAimX - previousAimX) * smoothing,
      aimY: previousAimY + (targetAimY - previousAimY) * smoothing
    };
  });
  gameVisualPlayers = nextVisualPlayers;
}

function renderMatchLeaderboard() {
  const arena = normalizeGame(gameState || familyData?.gameArena);
  const match = arena.match;
  const liveList = document.querySelector("#match-leaderboard");
  const finalList = document.querySelector("#final-match-leaderboard");
  const matchRows = match.status === "active" || match.status === "ended" ? gameMatchRows(match) : [];
  if (liveList) {
    const isFreeplay = gameViewMode === "free";
    liveList.classList.toggle("freeplay-summary", isFreeplay);
    updateMatchListRows(liveList, padGameScoreRows(isFreeplay ? gameFreeplayRows(arena) : matchRows, isFreeplay ? 2 : 5));
  }
  if (finalList) {
    finalList.classList.remove("freeplay-summary");
    updateMatchListRows(finalList, padGameScoreRows(matchRows, 5));
  }
}

function renderGameRecords() {
  const arena = normalizeGame(familyData?.gameArena || gameState);
  updateRecordList(document.querySelector("#freeplay-records-list"), arena.records.freeplay || []);
  updateRecordList(document.querySelector("#match-records-list"), arena.records.matches || []);
}

function updateRecordList(list, rows) {
  if (!list) return;
  list.replaceChildren(...padGameScoreRows(rows, 3).map((row, index) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <span class="match-place">${index + 1}</span>
      <strong>${row.uid ? escapeHtml(row.name || "Player") : ""}</strong>
      <span>${row.uid ? `${Number(row.xp || 0)} XP` : ""}</span>
    `;
    return item;
  }));
}

function renderAmmoDisplay() {
  const display = document.querySelector("#ammo-display");
  const icon = document.querySelector("#ammo-icon");
  const count = document.querySelector("#ammo-count");
  if (!display || !icon || !count) return;
  const player = gameLocalPlayer;
  const visible = Boolean(player && gameViewMode !== "menu" && !gameSpectating);
  display.hidden = !visible;
  if (!visible) return;
  normalizeGamePlayerPowerup(player, Date.now());
  const ammo = gameAmmoInfo(player);
  count.textContent = ammo.label;
  const flashAlpha = ammo.flashes ? gameExpiringFlashAlpha(player.powerupUntil, GAME_POWERUP_FLASH_MS, Date.now()) : 1;
  icon.style.opacity = String(ammo.iconFlashes ? flashAlpha : 1);
  count.style.opacity = String(ammo.labelFlashes ? flashAlpha : 1);
  drawGameAmmoIcon(icon, ammo.iconType);
}

function renderSurvivalHud() {
  const livesEl = document.querySelector("#survival-lives");
  const waveEl = document.querySelector("#survival-wave-strip");
  if (!livesEl || !waveEl) return;
  const solo = gameState?.solo || {};
  const visible = gameViewMode === "solo";
  livesEl.hidden = !visible;
  waveEl.hidden = !visible;
  if (!visible) return;
  const lives = Math.max(0, Math.min(GAME_SURVIVAL_LIVES, Number(solo.lives || 0)));
  livesEl.innerHTML = Array.from({ length: GAME_SURVIVAL_LIVES }, (_, index) => (
    `<span class="survival-heart${index >= lives ? " empty" : ""}" aria-hidden="true">♥</span>`
  )).join("");
  livesEl.setAttribute("aria-label", `${lives} ${lives === 1 ? "life" : "lives"} left`);
  waveEl.textContent = `Wave ${Number(solo.wave || 1)}`;
}

function gameAmmoInfo(player) {
  if (player?.powerup === "meatball") {
    return { iconType: "meatball", label: "MEATBALL", iconFlashes: true, labelFlashes: true, flashes: true };
  }
  if (player?.powerup === "basil") {
    return { iconType: "basil", label: "∞", iconFlashes: true, labelFlashes: true, flashes: true };
  }
  if (player?.powerup === "mushroom") {
    return { iconType: "mushroom", label: String(Math.min(GAME_MAX_PLAYER_PEPPERONI, Number(player.pepperoniCount || 0))), iconFlashes: true, labelFlashes: false, flashes: true };
  }
  return { iconType: "pepperoni", label: String(Math.min(GAME_MAX_PLAYER_PEPPERONI, Number(player?.pepperoniCount || 0))), iconFlashes: false, labelFlashes: false, flashes: false };
}

function drawGameAmmoIcon(canvas, type) {
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(size / 2, size / 2);
  drawGameTopping(ctx, type, 0, 0, size * 0.28, 4);
  ctx.restore();
}

function updateMatchListRows(list, rows) {
  const previousTops = new Map([...list.children].map((item) => [item.dataset.uid, item.getBoundingClientRect().top]));
  const existing = new Map([...list.children].map((item) => [item.dataset.uid, item]));
  const nextItems = rows.map((row, index) => {
    const item = existing.get(row.uid) || document.createElement("li");
    item.dataset.uid = row.uid || `empty-${index}`;
    item.innerHTML = `
      <span class="match-place">${index + 1}</span>
      <strong>${row.uid ? escapeHtml(row.name || "Player") : ""}</strong>
      <span>${row.uid ? `${Number(row.xp || 0)} XP` : ""}</span>
    `;
    return item;
  });
  list.replaceChildren(...nextItems);
  nextItems.forEach((item) => {
    const previousTop = previousTops.get(item.dataset.uid);
    if (previousTop === undefined) return;
    const delta = previousTop - item.getBoundingClientRect().top;
    if (Math.abs(delta) < 1) return;
    item.animate([
      { transform: `translateY(${delta}px)` },
      { transform: "translateY(0)" }
    ], { duration: 240, easing: "ease" });
  });
}

function gameMatchRows(match = {}) {
  const source = match.status === "ended" ? match.finalScores : match.scores;
  return Object.values(normalizeMatchScores(source || {}, match.participants || {}))
    .sort((a, b) => Number(b.xp || 0) - Number(a.xp || 0) || (a.name || "").localeCompare(b.name || ""));
}

function gameFreeplayRows(arena = normalizeGame(gameState || familyData?.gameArena)) {
  const rows = Object.values(arena.freeScores || {})
    .filter((row) => row?.uid)
    .sort((a, b) => Number(b.xp || 0) - Number(a.xp || 0) || (a.name || "").localeCompare(b.name || ""));
  const leader = rows[0];
  const own = currentUser?.uid ? rows.find((row) => row.uid === currentUser.uid) : null;
  return [leader, own].filter((row, index, list) => row?.uid && list.findIndex((item) => item?.uid === row.uid) === index);
}

function padGameScoreRows(rows = [], count = 5) {
  const next = rows.slice(0, count);
  while (next.length < count) next.push({ uid: "", name: "", xp: 0 });
  return next;
}

function drawGameGrid(ctx) {
  ctx.strokeStyle = "rgba(255, 244, 223, 0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= GAME_ARENA.width; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, GAME_ARENA.height);
    ctx.stroke();
  }
  for (let y = 0; y <= GAME_ARENA.height; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(GAME_ARENA.width, y);
    ctx.stroke();
  }
}

function drawGameWall(ctx, wall) {
  ctx.fillStyle = "#4e4762";
  ctx.strokeStyle = "#9387b4";
  ctx.lineWidth = 3;
  gameRoundRect(ctx, wall.x, wall.y, wall.w, wall.h, 8);
  ctx.fill();
  ctx.stroke();
}

function drawGameZombie(ctx, zombie) {
  ctx.save();
  ctx.translate(zombie.x, zombie.y);
  ctx.shadowColor = "rgba(0, 0, 0, 0.42)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  const image = getGameZombieImage();
  const width = GAME_ZOMBIE_SIZE;
  const height = GAME_ZOMBIE_SIZE * 1.22;
  const facing = Number(zombie.facing || zombie.vx || 1) < 0 ? -1 : 1;
  if (image?.complete && image.naturalWidth) {
    ctx.scale(facing, 1);
    ctx.drawImage(image, -width / 2, -height / 2, width, height);
  } else {
    ctx.fillStyle = "#65d06f";
    ctx.strokeStyle = "#13391c";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, GAME_ZOMBIE_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function getGameZombieImage() {
  if (gameZombieImage) return gameZombieImage;
  gameZombieImage = new Image();
  gameZombieImage.src = GAME_ZOMBIE_IMAGE_SRC;
  return gameZombieImage;
}

function drawGameToppingPickup(ctx, pickup) {
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;
  drawGameTopping(ctx, pickup.type || "pepperoni", pickup.x, pickup.y, GAME_PEPPERONI_PICKUP_SIZE / 2, 2);
  ctx.restore();
}

function drawGameTopping(ctx, type, x, y, radius, lineWidth = 2) {
  if (type === "mushroom") {
    drawGameMushroom(ctx, x, y, radius, lineWidth);
    return;
  }
  if (type === "basil") {
    drawGameBasilLeaf(ctx, x, y, radius * 1.25, lineWidth);
    return;
  }
  if (type === "meatball") {
    drawGameMeatball(ctx, x, y, radius * 1.05, lineWidth);
    return;
  }
  drawGamePepperoniDisk(ctx, x, y, radius, lineWidth);
}

function renderGameRuleIcons() {
  document.querySelectorAll("[data-rule-icon]").forEach((canvas) => {
    const ctx = canvas.getContext("2d");
    const type = canvas.dataset.ruleIcon;
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(size / 2, size / 2);
    if (type === "zombie") {
      drawGameZombie(ctx, { x: 0, y: 0, vx: 1, facing: 1, alive: true });
      const image = getGameZombieImage();
      image.onload = () => renderGameRuleIcons();
    } else if (type === "match") {
      drawGameMatchIcon(ctx, size);
    } else {
      ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;
      drawGameTopping(ctx, type, 0, 0, size * 0.26, 4);
    }
    ctx.restore();
  });
}

function drawGameMatchIcon(ctx, size) {
  const radius = size * 0.26;
  const gradient = ctx.createLinearGradient(-radius, -radius, radius, radius);
  gradient.addColorStop(0, "#e85d75");
  gradient.addColorStop(1, "#f4a261");
  ctx.fillStyle = gradient;
  ctx.strokeStyle = "#111019";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#111019";
  ctx.font = "900 15px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("XP", 0, 1);
}

function drawGamePepperoniDisk(ctx, x, y, radius, lineWidth = 2) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#d93d3d";
  ctx.strokeStyle = "#7a1721";
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(91, 20, 16, 0.45)";
  [
    { x: -radius * 0.32, y: -radius * 0.28, r: radius * 0.18 },
    { x: radius * 0.35, y: radius * 0.1, r: radius * 0.15 },
    { x: -radius * 0.04, y: radius * 0.48, r: radius * 0.13 }
  ].forEach((spot) => {
    ctx.beginPath();
    ctx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "rgba(255, 244, 223, 0.55)";
  ctx.beginPath();
  ctx.arc(-radius * 0.28, -radius * 0.36, radius * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGameMushroom(ctx, x, y, radius, lineWidth = 2) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#f7f0df";
  ctx.strokeStyle = "#6b4b34";
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.62, radius * 0.18);
  ctx.quadraticCurveTo(0, radius * 0.48, radius * 0.62, radius * 0.18);
  ctx.lineTo(radius * 0.34, radius * 0.95);
  ctx.quadraticCurveTo(0, radius * 1.18, -radius * 0.34, radius * 0.95);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#d9b08c";
  ctx.beginPath();
  ctx.arc(0, -radius * 0.08, radius * 0.9, Math.PI, 0);
  ctx.quadraticCurveTo(0, radius * 0.4, -radius * 0.9, -radius * 0.08);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(91, 55, 34, 0.35)";
  [-0.38, 0, 0.38].forEach((offset) => {
    ctx.beginPath();
    ctx.arc(offset * radius, -radius * 0.08, radius * 0.11, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawGameBasilLeaf(ctx, x, y, radius, lineWidth = 2) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.45);
  ctx.fillStyle = "#45b36b";
  ctx.strokeStyle = "#174e2a";
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(0, -radius);
  ctx.bezierCurveTo(radius * 0.8, -radius * 0.52, radius * 0.65, radius * 0.62, 0, radius);
  ctx.bezierCurveTo(-radius * 0.65, radius * 0.62, -radius * 0.8, -radius * 0.52, 0, -radius);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 244, 223, 0.45)";
  ctx.lineWidth = Math.max(1, lineWidth - 0.5);
  ctx.beginPath();
  ctx.moveTo(0, -radius * 0.65);
  ctx.quadraticCurveTo(radius * 0.12, 0, 0, radius * 0.68);
  ctx.stroke();
  ctx.restore();
}

function drawGameMeatball(ctx, x, y, radius, lineWidth = 2) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#8f4b30";
  ctx.strokeStyle = "#442012";
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 244, 223, 0.35)";
  ctx.beginPath();
  ctx.arc(-radius * 0.32, -radius * 0.36, radius * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(65, 24, 14, 0.35)";
  [
    { x: radius * 0.28, y: -radius * 0.12, r: radius * 0.16 },
    { x: -radius * 0.06, y: radius * 0.35, r: radius * 0.13 }
  ].forEach((spot) => {
    ctx.beginPath();
    ctx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawGamePlayer(ctx, player) {
  const radius = GAME_PLAYER_SIZE / 2;
  const aimX = Number(player.aimX || 1);
  const aimY = Number(player.aimY || 0);
  const aimMag = Math.hypot(aimX, aimY) || 1;
  const facingAngle = Math.atan2(aimY / aimMag, aimX / aimMag);
  const now = Date.now();
  const meatballFlashAlpha = player.powerup === "meatball" ? gameExpiringFlashAlpha(player.powerupUntil, GAME_POWERUP_FLASH_MS, now) : 1;
  const toppingFlashAlpha = player.powerup === "mushroom" || player.powerup === "basil" ? gameExpiringFlashAlpha(player.powerupUntil, GAME_POWERUP_FLASH_MS, now) : 1;
  ctx.save();
  ctx.globalAlpha = player.alive ? 1 : 0.35;
  ctx.translate(player.x, player.y);
  drawGameShield(ctx, player, player.powerup === "meatball" ? GAME_MEATBALL_SIZE / 2 : radius, now);
  if (player.powerup === "meatball") {
    ctx.globalAlpha *= meatballFlashAlpha;
    drawGameMeatball(ctx, 0, 0, GAME_MEATBALL_SIZE / 2, 5);
    ctx.fillStyle = "#fff4df";
    ctx.font = "900 20px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText((player.name || "?").slice(0, 1).toUpperCase(), 0, 1);
    drawGameShieldIcon(ctx, player, now);
    ctx.restore();
    ctx.fillStyle = "#fff4df";
    ctx.font = "900 16px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(player.name || "Player", player.x, player.y - GAME_MEATBALL_SIZE / 2 - 10);
    return;
  }
  ctx.rotate(facingAngle);

  const tipX = radius;
  const crustX = -radius + 8;
  const crustTop = -radius * 0.62;
  const crustBottom = radius * 0.62;

  ctx.fillStyle = "#ffcc3d";
  ctx.strokeStyle = "#5b2b17";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(tipX, 0);
  ctx.lineTo(crustX, crustTop);
  ctx.quadraticCurveTo(crustX - 9, 0, crustX, crustBottom);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#b96a22";
  ctx.strokeStyle = "#5b2b17";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(crustX + 2, crustTop + 3);
  ctx.quadraticCurveTo(crustX - 10, 0, crustX + 2, crustBottom - 3);
  ctx.quadraticCurveTo(crustX + 14, crustBottom - 9, crustX + 12, crustBottom - 18);
  ctx.quadraticCurveTo(crustX + 5, 0, crustX + 12, crustTop + 18);
  ctx.quadraticCurveTo(crustX + 14, crustTop + 9, crustX + 2, crustTop + 3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 244, 223, 0.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-8, -15);
  ctx.quadraticCurveTo(12, -9, 24, -2);
  ctx.stroke();

  const toppingSpots = [
    { x: -10, y: -8, r: 6.5 },
    { x: 4, y: 9, r: 6 },
    { x: 17, y: -4, r: 5.5 },
    { x: -20, y: 10, r: 5 },
    { x: -2, y: -18, r: 5 },
    { x: 20, y: 9, r: 4.5 }
  ];
  const toppingType = player.powerup === "mushroom" ? "mushroom" : player.powerup === "basil" ? "basil" : "pepperoni";
  const visualCount = player.powerup === "basil" ? 5 : Math.min(GAME_MAX_PLAYER_PEPPERONI, Number(player.pepperoniCount || 0));
  ctx.save();
  ctx.globalAlpha *= toppingFlashAlpha;
  for (let index = 0; index < visualCount; index += 1) {
    const spot = toppingSpots[index % toppingSpots.length];
    const stack = Math.floor(index / toppingSpots.length);
    drawGameTopping(ctx, toppingType, spot.x + stack * 2, spot.y - stack * 2, Math.max(4, spot.r - stack * 0.9), 1.7);
  }
  ctx.restore();

  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(crustX + 7, 0, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#111019";
  ctx.font = "900 12px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText((player.name || "?").slice(0, 1).toUpperCase(), crustX + 7, 0.5);
  ctx.restore();

  ctx.save();
  ctx.translate(player.x, player.y);
  drawGameShieldIcon(ctx, player, now);
  ctx.restore();

  ctx.fillStyle = "#fff4df";
  ctx.font = "900 16px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(player.name || "Player", player.x, player.y - radius - 10);
  ctx.restore();
}

function drawGamePizzaShot(ctx, shot) {
  drawGameTopping(ctx, shot.type || "pepperoni", shot.x, shot.y, GAME_PIZZA_PROJECTILE_SIZE / 2, 3);
}

function drawGameExplosionEffects(ctx) {
  const now = Date.now();
  gameExplosionEffects = gameExplosionEffects.filter((effect) => now - effect.createdAt <= GAME_MUSHROOM_EXPLOSION_MS);
  const rawSharedEffects = Object.values(pruneGameExplosionEffects(gameState?.explosionEffects || {}, now));
  const sharedEffectIds = new Set(rawSharedEffects.map((effect) => effect.id).filter(Boolean));
  Object.keys(gameSharedExplosionSeenAt).forEach((id) => {
    if (!sharedEffectIds.has(id)) delete gameSharedExplosionSeenAt[id];
  });
  const sharedEffects = rawSharedEffects.map((effect) => {
    if (!effect?.id) return effect;
    if (!gameSharedExplosionSeenAt[effect.id]) gameSharedExplosionSeenAt[effect.id] = now;
    return { ...effect, createdAt: gameSharedExplosionSeenAt[effect.id] };
  });
  const effects = new Map();
  [...sharedEffects, ...gameExplosionEffects].forEach((effect) => {
    if (effect?.id) effects.set(effect.id, effect);
  });
  [...effects.values()].forEach((effect) => {
    const age = now - effect.createdAt;
    const progress = Math.min(1, age / GAME_MUSHROOM_EXPLOSION_MS);
    ctx.save();
    ctx.globalAlpha = 0.34 * (1 - progress);
    ctx.fillStyle = "#d9b08c";
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.85 * (1 - progress);
    ctx.strokeStyle = "#fff4df";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.65 * (1 - progress);
    ctx.strokeStyle = "#8f4b30";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, effect.radius * 0.58, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });
}

function randomGameSpawn() {
  const state = gameState || normalizeGame(familyData?.gameArena);
  const radius = GAME_PLAYER_SIZE / 2;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const x = radius + 4 + Math.random() * (GAME_ARENA.width - (radius + 4) * 2);
    const y = radius + 4 + Math.random() * (GAME_ARENA.height - (radius + 4) * 2);
    const blocked = gamePlayerCollisionWalls().some((rect) => gameCircleRectHit(x, y, radius, rect))
      || (state.zombies || []).some((zombie) => zombie.alive && gameDistance(x, y, zombie.x, zombie.y) < radius + 72);
    if (!blocked) return { x, y };
  }
  return { x: radius + 24, y: radius + 24 };
}

function gameInputVector() {
  const keyX = Number(gameKeyboardInput.right) - Number(gameKeyboardInput.left);
  const keyY = Number(gameKeyboardInput.down) - Number(gameKeyboardInput.up);
  const x = gameInput.x || keyX;
  const y = gameInput.y || keyY;
  const mag = Math.hypot(x, y) || 1;
  return { x: x / mag, y: y / mag };
}

function moveGamePlayerWithWalls(x, y, dx, dy, radius = GAME_PLAYER_SIZE / 2) {
  let nextX = gameClamp(x + dx, radius, GAME_ARENA.width - radius);
  let nextY = gameClamp(y + dy, radius, GAME_ARENA.height - radius);
  const walls = gamePlayerCollisionWalls();
  if (walls.some((wall) => gameCircleRectHit(nextX, y, radius, wall))) nextX = x;
  if (walls.some((wall) => gameCircleRectHit(nextX, nextY, radius, wall))) nextY = y;
  return { x: nextX, y: nextY };
}

function gamePlayerCollisionWalls() {
  return gameViewMode === "solo" ? GAME_WALLS : gameState?.walls || GAME_WALLS;
}

function resolveGameCircleOverlap(x, y, radius) {
  let next = {
    x: gameClamp(x, radius, GAME_ARENA.width - radius),
    y: gameClamp(y, radius, GAME_ARENA.height - radius)
  };
  for (let pass = 0; pass < 6; pass += 1) {
    const wall = GAME_WALLS.find((rect) => gameCircleRectHit(next.x, next.y, radius, rect));
    if (!wall) break;
    const moves = [
      { axis: "x", value: wall.x - radius - 1, distance: Math.abs(next.x - (wall.x - radius - 1)) },
      { axis: "x", value: wall.x + wall.w + radius + 1, distance: Math.abs(next.x - (wall.x + wall.w + radius + 1)) },
      { axis: "y", value: wall.y - radius - 1, distance: Math.abs(next.y - (wall.y - radius - 1)) },
      { axis: "y", value: wall.y + wall.h + radius + 1, distance: Math.abs(next.y - (wall.y + wall.h + radius + 1)) }
    ].sort((a, b) => a.distance - b.distance);
    const move = moves.find((candidate) => {
      const candidateX = candidate.axis === "x" ? candidate.value : next.x;
      const candidateY = candidate.axis === "y" ? candidate.value : next.y;
      return candidateX >= radius
        && candidateX <= GAME_ARENA.width - radius
        && candidateY >= radius
        && candidateY <= GAME_ARENA.height - radius
        && !GAME_WALLS.some((rect) => gameCircleRectHit(candidateX, candidateY, radius, rect));
    }) || moves[0];
    next = {
      x: move.axis === "x" ? move.value : next.x,
      y: move.axis === "y" ? move.value : next.y
    };
    next.x = gameClamp(next.x, radius, GAME_ARENA.width - radius);
    next.y = gameClamp(next.y, radius, GAME_ARENA.height - radius);
  }
  return next;
}

function gameCircleRectHit(cx, cy, radius, rect) {
  const nearestX = gameClamp(cx, rect.x, rect.x + rect.w);
  const nearestY = gameClamp(cy, rect.y, rect.y + rect.h);
  return gameDistance(cx, cy, nearestX, nearestY) <= radius;
}

function gameRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function attachGameControls() {
  const shootButton = document.querySelector("#shoot-button");
  const mobileShootButton = document.querySelector("#mobile-shoot-button");
  const joystick = document.querySelector("#joystick");

  shootButton?.addEventListener("pointerdown", shootGameFromButton);
  shootButton?.addEventListener("pointerup", stopGameFire);
  shootButton?.addEventListener("pointercancel", stopGameFire);
  shootButton?.addEventListener("pointerleave", stopGameFire);
  mobileShootButton?.addEventListener("pointerdown", shootGameFromButton);
  mobileShootButton?.addEventListener("pointerup", stopGameFire);
  mobileShootButton?.addEventListener("pointercancel", stopGameFire);
  mobileShootButton?.addEventListener("pointerleave", stopGameFire);
  joystick?.addEventListener("pointerdown", handleGameJoystick);
  joystick?.addEventListener("pointermove", handleGameJoystick);
  joystick?.addEventListener("pointerup", resetGameJoystick);
  joystick?.addEventListener("pointercancel", resetGameJoystick);
  window.addEventListener("keydown", handleGameKeyDown);
  window.addEventListener("keyup", handleGameKeyUp);
}

function shootGameFromButton(event) {
  event.preventDefault();
  event.currentTarget?.setPointerCapture?.(event.pointerId);
  gameFireHeld = true;
  shootGamePizza();
}

function stopGameFire(event) {
  event?.currentTarget?.releasePointerCapture?.(event.pointerId);
  gameFireHeld = false;
}

function handleGameJoystick(event) {
  const joystick = document.querySelector("#joystick");
  const joystickThumb = document.querySelector("#joystick-thumb");
  if (!joystick || !joystickThumb) return;
  joystick.setPointerCapture(event.pointerId);
  const rect = joystick.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const max = rect.width * 0.34;
  const dx = event.clientX - centerX;
  const dy = event.clientY - centerY;
  const mag = Math.hypot(dx, dy);
  const clamped = Math.min(max, mag);
  const nx = mag ? dx / mag : 0;
  const ny = mag ? dy / mag : 0;
  gameInput = { x: nx * (clamped / max), y: ny * (clamped / max) };
  joystickThumb.style.transform = `translate(calc(-50% + ${nx * clamped}px), calc(-50% + ${ny * clamped}px))`;
}

function resetGameJoystick() {
  const joystickThumb = document.querySelector("#joystick-thumb");
  gameInput = { x: 0, y: 0 };
  if (joystickThumb) joystickThumb.style.transform = "translate(-50%, -50%)";
}

function handleGameKeyDown(event) {
  if (routeName() !== "game") return;
  if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") gameKeyboardInput.up = true;
  if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") gameKeyboardInput.down = true;
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") gameKeyboardInput.left = true;
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") gameKeyboardInput.right = true;
  if (event.key === " ") {
    event.preventDefault();
    shootGamePizza();
  }
}

function handleGameKeyUp(event) {
  if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") gameKeyboardInput.up = false;
  if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") gameKeyboardInput.down = false;
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") gameKeyboardInput.left = false;
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") gameKeyboardInput.right = false;
}

function setGameStatus(text, online) {
  const statusPill = document.querySelector("#game-connection-status");
  if (!statusPill) return;
  statusPill.textContent = text;
  statusPill.classList.toggle("online", online);
  if (online) hideGameArenaStatus();
  else showGameArenaStatus(text);
}

function showGameArenaStatus(text) {
  const arenaStatus = document.querySelector("#arena-status");
  if (!arenaStatus) return;
  arenaStatus.textContent = text;
  arenaStatus.hidden = false;
}

function hideGameArenaStatus() {
  const arenaStatus = document.querySelector("#arena-status");
  if (arenaStatus) arenaStatus.hidden = true;
}

function cleanupGame() {
  if (gameState || gameJoinedArena || gameMatchQueued) {
    clearGameQueue();
    leaveGamePlayer();
  }
  cancelGameDisconnectCleanup();
  document.documentElement.classList.remove("game-active-root");
  document.body.classList.remove("game-active");
  document.body.classList.remove("game-playing");
  document.body.classList.remove("game-freeplay");
  document.body.classList.remove("game-solo");
  if (gameTouchMoveLocked) {
    document.removeEventListener("touchmove", preventGamePageDrag);
    gameTouchMoveLocked = false;
  }
  if (gameAnimationId) cancelAnimationFrame(gameAnimationId);
  if (gameLobbyPresenceTimer) window.clearInterval(gameLobbyPresenceTimer);
  cleanupGameArenaListener();
  gameAnimationId = null;
  gameLobbyPresenceTimer = null;
  resetLocalGameRuntime();
  gameJoinedArena = false;
  gameMatchExitPending = false;
  window.removeEventListener("keydown", handleGameKeyDown);
  window.removeEventListener("keyup", handleGameKeyUp);
}

function resetLocalGameRuntime() {
  gameState = null;
  gameLocalPlayer = null;
  gameRemoteProjectiles = {};
  gameVisualPlayers = {};
  gameExplosionEffects = [];
  gameSharedExplosionSeenAt = {};
  gameFireHeld = false;
  gameInput = { x: 0, y: 0 };
  gameKeyboardInput = { up: false, down: false, left: false, right: false };
  gameConsumedHitIds = new Set();
  gameRemovedProjectileIds = new Set();
  gameConsumedPickupIds = new Set();
}

function preventGamePageDrag(event) {
  if (document.body.classList.contains("game-active")) event.preventDefault();
}

function cleanupGameArenaListener() {
  if (unsubscribeGameArena) unsubscribeGameArena();
  unsubscribeGameArena = null;
}

function gameArenaRef() {
  return services.rtdbFns.ref(services.rtdb, `families/${FAMILY_ID}/gameArena`);
}

function gameClamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function gameDistance(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

function gameRandomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function gameColorFromUid(uid) {
  const palette = ["#ff7a59", "#f4c95d", "#3ddc97", "#66d9ef", "#c77dff", "#ef476f"];
  let sum = 0;
  [...uid].forEach((char) => {
    sum += char.charCodeAt(0);
  });
  return palette[sum % palette.length];
}

async function addToWheel({ title, sourceListId = null, ...details }) {
  if (!canCurrentUserAddMovie()) return;

  const movie = {
    ...details,
    id: crypto.randomUUID(),
    title,
    suggestedBy: displayName(),
    suggestedByUid: currentUser.uid,
    createdAt: Date.now()
  };
  const patch = {
    movies: [...activeMovies(), movie],
    spinReady: {},
    spinState: null,
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

async function saveRanking(movieId, score, note = "") {
  const history = historyMovies().map((movie) => {
    if (movie.id !== movieId) return movie;
    return {
      ...movie,
      rankings: {
        ...movieRankings(movie),
        [currentUser.uid]: {
          score,
          note: note.trim(),
          name: displayName(),
          uid: currentUser.uid,
          createdAt: Date.now()
        }
      }
    };
  });
  await saveFamily({ history });
}

async function removeRankingMovie(movieId) {
  if (!window.confirm("Are you sure you want to remove this from Rankings? It will no longer affect recommendations.")) return;
  await saveFamily({ history: historyMovies().filter((movie) => movie.id !== movieId) });
}

async function removeFamilyMember(uid) {
  if (uid === currentUser?.uid) return;
  if (!window.confirm("Are you sure you want to remove this member?")) return;
  const members = { ...(familyData.members || {}) };
  const ready = { ...spinReady() };
  const picks = { ...roundPicks() };
  delete members[uid];
  delete ready[uid];
  delete picks[uid];
  await saveFamily({ members, spinReady: ready, roundPicks: picks });
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
  ctx.clip();
  drawPizzaLogoCenter(ctx, 0, 0, 49);
  ctx.restore();
}

function drawPizzaLogoCenter(ctx, x, y, radius) {
  const slices = 8;
  const cheeseColors = ["#ffe08a", "#ffc857", "#ffb24d", "#ffd166"];

  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ff9f5f";
  ctx.fill();

  for (let index = 0; index < slices; index += 1) {
    const start = -Math.PI / 2 + index * ((Math.PI * 2) / slices);
    const end = start + (Math.PI * 2) / slices;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius * 0.84, start, end);
    ctx.closePath();
    ctx.fillStyle = cheeseColors[index % cheeseColors.length];
    ctx.fill();
    ctx.strokeStyle = "rgba(125, 66, 26, 0.48)";
    ctx.lineWidth = 2.2;
    ctx.stroke();
  }

  [
    [-17, -20, 5],
    [15, -16, 4],
    [23, 10, 5],
    [-2, 24, 4],
    [-25, 8, 5],
    [-7, -2, 4]
  ].forEach(([cx, cy, size]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, size, 0, Math.PI * 2);
    ctx.fillStyle = "#d93d3d";
    ctx.fill();
  });

  ctx.beginPath();
  ctx.arc(0, 0, 13, 0, Math.PI * 2);
  ctx.fillStyle = "#111019";
  ctx.fill();
  ctx.strokeStyle = "#fff4db";
  ctx.lineWidth = 3;
  ctx.stroke();

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
  requestSpin();
}

async function requestSpin() {
  const movies = activeMovies();
  if (!movies.length || !currentUser?.uid || isSpinActive()) return;

  if (FIREBASE_READY) {
    await requestSpinTransaction();
    return;
  }

  const ready = {
    ...spinReady(),
  };

  if (ready[currentUser.uid]) {
    if (everyoneReady(ready)) return;
    delete ready[currentUser.uid];
    await saveFamily({ spinReady: ready });
    return;
  }

  ready[currentUser.uid] = true;
  const patch = { spinReady: ready };

  if (everyoneReady(ready)) {
    const finalRotation = randomFinalRotation();
    patch.spinState = {
      id: crypto.randomUUID(),
      startedAt: Date.now() + SPIN_LEAD_MS,
      duration: SPIN_DURATION_MS,
      finalRotation,
      movieIds: movies.map((movie) => movie.id)
    };
  }

  await saveFamily(patch);
}

async function requestSpinTransaction() {
  const familyRef = services.dbFns.doc(services.db, "families", FAMILY_ID);
  await services.dbFns.runTransaction(services.db, async (transaction) => {
    const snap = await transaction.get(familyRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const movies = data.movies || [];
    const members = Object.keys(data.members || {});
    const participants = members.length ? members : [currentUser.uid];
    const ready = { ...(data.spinReady || {}) };
    const spin = data.spinState;

    if (!movies.length || !currentUser?.uid || remoteSpinIsActive(spin)) return;

    const allReady = participants.length > 0 && participants.every((uid) => ready[uid]);
    if (ready[currentUser.uid]) {
      if (allReady) return;
      delete ready[currentUser.uid];
      transaction.update(familyRef, {
        spinReady: ready,
        updatedAt: services.dbFns.serverTimestamp()
      });
      return;
    }

    ready[currentUser.uid] = true;
    const patch = {
      spinReady: ready,
      updatedAt: services.dbFns.serverTimestamp()
    };

    if (participants.every((uid) => ready[uid])) {
      const finalRotation = randomFinalRotation();
      patch.spinState = {
        id: crypto.randomUUID(),
        startedAt: Date.now() + SPIN_LEAD_MS,
        duration: SPIN_DURATION_MS,
        finalRotation,
        movieIds: movies.map((movie) => movie.id)
      };
    }

    transaction.update(familyRef, patch);
  });
}

function updateSpinUi() {
  const button = document.querySelector("#spin-button");
  const status = document.querySelector("#spin-status");
  if (!button || !status) return;

  const movies = activeMovies();
  const memberCount = spinParticipantIds().length;
  const readyCount = readyMemberCount();
  const spinActive = isSpinActive();
  const userReady = Boolean(spinReady()[currentUser?.uid]);
  const allReady = everyoneReady();

  button.disabled = spinActive || allReady || !movies.length;
  button.textContent = spinActive || allReady ? "Spinning" : userReady ? "Unready" : "Spin";

  if (!movies.length) {
    status.hidden = true;
    return;
  }

  status.hidden = false;
  if (spinActive || allReady) {
    status.textContent = "Spinning together...";
  } else if (userReady) {
    status.textContent = `You're ready. ${readyCount} of ${memberCount} ready to spin`;
  } else {
    status.textContent = `${readyCount} of ${memberCount} ready to spin`;
  }
}

function syncSharedSpin() {
  const spin = familyData?.spinState;
  if (!spin?.id || !activeMovies().length) {
    activeSpinAnimationId = null;
    return;
  }

  if (activeSpinAnimationId === spin.id) return;
  activeSpinAnimationId = spin.id;

  const startedAt = Number(spin.startedAt) || Date.now();
  const duration = Number(spin.duration) || SPIN_DURATION_MS;
  const finalRotation = Number(spin.finalRotation) || 0;
  const winner = movieFromRotation(finalRotation, activeMovies());

  function animate() {
    if (activeSpinAnimationId !== spin.id || familyData?.spinState?.id !== spin.id) return;

    const elapsed = Date.now() - startedAt;
    const progress = Math.min(1, Math.max(0, elapsed / duration));
    const eased = 1 - Math.pow(1 - progress, 5);
    drawWheel(finalRotation * eased);

    if (progress < 1) {
      requestAnimationFrame(animate);
      return;
    }

    pendingWinner = winner;
    if (winner) showWinner(winner);
    updateSpinUi();
  }

  animate();
}

function randomFinalRotation() {
  const fullSpins = 9 + Math.floor(Math.random() * 5);
  const randomLandingAngle = Math.random() * Math.PI * 2;
  return (fullSpins * Math.PI * 2) + randomLandingAngle;
}

function movieFromRotation(rotation, movies) {
  if (!movies.length) return null;
  const slice = (Math.PI * 2) / movies.length;
  const landedAngle = normalizeAngle(POINTER_ANGLE - normalizeAngle(rotation));
  return movies[Math.floor(landedAngle / slice)] || movies[0];
}

function normalizeAngle(angle) {
  const full = Math.PI * 2;
  return ((angle % full) + full) % full;
}

function showWinner(movie) {
  document.querySelector("#winner-title").textContent = movie.title;
  document.querySelector("#winner-meta").textContent = `Suggested by ${movie.suggestedBy || "someone"}`;
  document.querySelector("#winner-panel").hidden = false;
}

async function confirmPicked() {
  if (!pendingWinner) return;
  const picked = { ...pendingWinner, pickedAt: Date.now(), round: familyData.round || 1, rankings: {} };
  const movies = activeMovies().filter((movie) => movie.id !== pendingWinner.id);
  const history = [...(familyData.history || []), picked];
  const patch = { movies, history, spinReady: {}, spinState: null };
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
    name: "Pizza",
    joinCode: FAMILY_PASSWORD,
    round: 1,
    members: {},
    movies: [],
    roundPicks: {},
    spinReady: {},
    spinState: null,
    gameArena: defaultGameState(),
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

function historyMovies() {
  return familyData?.history || [];
}

function movieRankings(movie) {
  return movie?.rankings || {};
}

function currentUserRanking(movie) {
  if (!currentUser?.uid) return null;
  return movieRankings(movie)[currentUser.uid] || null;
}

function averageRating(movie) {
  const scores = Object.values(movieRankings(movie))
    .map((rating) => Number(rating.score))
    .filter((score) => Number.isFinite(score) && score > 0);
  if (!scores.length) return 0;
  return scores.reduce((total, score) => total + score, 0) / scores.length;
}

function recommendationForMovie(movie) {
  const profile = recommendationProfile();
  if (!profile.count) return null;

  const reasons = [];
  let score = 50;
  score += scoreListMatches(splitList(movie.genre || movie.Genre), profile.genres, reasons, "genre");
  score += scoreListMatches(splitList(movie.actors || movie.Actors), profile.actors, reasons, "actor");
  score += scoreListMatches(splitList(movie.director || movie.Director), profile.directors, reasons, "director");
  score += scoreListMatches(splitList(movie.writer || movie.Writer), profile.writers, reasons, "writer");

  const rated = movie.rated || movie.Rated;
  if (rated && profile.ratings[rated]) {
    const ratingScore = preferenceScore(profile.ratings[rated]);
    score += ratingScore * 5;
    if (ratingScore > 0.5) reasons.push(`${rated} has worked well`);
    if (ratingScore < -0.5) reasons.push(`${rated} has been mixed`);
  }

  const runtime = parseRuntime(movie.runtime || movie.Runtime);
  if (runtime && profile.runtime.average) {
    const distance = Math.abs(runtime - profile.runtime.average);
    if (distance <= 20) {
      score += 5;
      reasons.push("runtime fits past favorites");
    } else if (distance > 55) {
      score -= 4;
    }
  }

  const imdb = Number(movie.imdbRating);
  if (Number.isFinite(imdb)) {
    if (imdb >= 7.5) {
      score += 4;
      reasons.push("strong IMDb score");
    } else if (imdb < 5.5) {
      score -= 5;
    }
  }

  if (profile.favorites.some((favorite) => sameMovie(favorite, movie))) {
    score += 8;
    reasons.push("similar to a family favorite");
  }

  const bounded = Math.max(0, Math.min(100, Math.round(score)));
  if (bounded < 58 && !reasons.length) return null;
  return {
    score: bounded,
    label: `${bounded}% family fit`,
    reasons: reasons.slice(0, 3)
  };
}

function recommendationProfile() {
  const profile = {
    count: 0,
    genres: {},
    actors: {},
    directors: {},
    writers: {},
    ratings: {},
    runtime: { total: 0, count: 0, average: 0 },
    favorites: []
  };

  historyMovies().forEach((movie) => {
    const average = averageRating(movie);
    if (!average) return;
    profile.count += 1;
    const weight = average - 3;
    addPreference(profile.genres, splitList(movie.genre), weight);
    addPreference(profile.actors, splitList(movie.actors), weight * 0.8);
    addPreference(profile.directors, splitList(movie.director), weight);
    addPreference(profile.writers, splitList(movie.writer), weight * 0.7);
    addPreference(profile.ratings, [movie.rated], weight * 0.6);
    const runtime = parseRuntime(movie.runtime);
    if (runtime && average >= 4) {
      profile.runtime.total += runtime;
      profile.runtime.count += 1;
    }
    if (average >= 4.25) profile.favorites.push(movie);
  });

  profile.runtime.average = profile.runtime.count ? profile.runtime.total / profile.runtime.count : 0;
  return profile;
}

function addPreference(bucket, values, weight) {
  values.filter(isRealValue).forEach((value) => {
    bucket[value] = bucket[value] || { total: 0, count: 0 };
    bucket[value].total += weight;
    bucket[value].count += 1;
  });
}

function scoreListMatches(values, bucket, reasons, label) {
  return values.reduce((total, value) => {
    const preference = bucket[value];
    if (!preference) return total;
    const itemScore = preferenceScore(preference);
    if (itemScore > 0.65 && reasons.length < 3) reasons.push(`liked ${label}: ${value}`);
    return total + itemScore * 7;
  }, 0);
}

function preferenceScore(preference) {
  return preference.total / Math.max(1, preference.count);
}

function splitList(value = "") {
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseRuntime(value = "") {
  const match = String(value).match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function sameMovie(a, b) {
  if (a.imdbID && b.imdbID) return a.imdbID === b.imdbID;
  const aTitle = String(a.title || a.Title || "").toLowerCase();
  const bTitle = String(b.title || b.Title || "").toLowerCase();
  return aTitle && aTitle === bTitle;
}

function starText(score) {
  const rounded = Math.max(0, Math.min(5, Number(score) || 0));
  return `${"★".repeat(rounded)}${"☆".repeat(5 - rounded)}`;
}

function pendingRankingMovie() {
  const dismissed = readDismissedRankings();
  return historyMovies().find((movie) => !currentUserRanking(movie) && !dismissed.includes(movie.id));
}

function showPendingRankingPrompt() {
  if (!currentUser?.uid || !familyData || document.querySelector(".ranking-modal")) return;
  const movie = pendingRankingMovie();
  if (!movie) return;
  showRankingModal(movie);
}

function showRankingModal(movie) {
  if (document.querySelector(".ranking-modal")) return;
  const overlay = document.createElement("section");
  overlay.className = "ranking-modal";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "ranking-modal-title");
  overlay.innerHTML = `
    <form class="ranking-modal-card">
      <p class="eyebrow">Quick ranking</p>
      <h2 id="ranking-modal-title">How was ${escapeHtml(movie.title)}?</h2>
      <fieldset class="star-picker">
        <legend>Rating out of five stars</legend>
        ${[5, 4, 3, 2, 1].map((score) => `
          <input id="rank-${movie.id}-${score}" name="score" type="radio" value="${score}" required />
          <label for="rank-${movie.id}-${score}" aria-label="${score} stars">★</label>
        `).join("")}
      </fieldset>
      <label>
        Note optional
        <textarea id="ranking-note" maxlength="220" placeholder="What made it work, or not?"></textarea>
      </label>
      <div class="modal-actions">
        <button class="secondary-action" type="button" data-rank-later>Later</button>
        <button class="primary-action" type="submit">Save ranking</button>
      </div>
    </form>
  `;

  overlay.querySelector("[data-rank-later]").addEventListener("click", () => {
    dismissRanking(movie.id);
    overlay.remove();
  });
  overlay.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const score = Number(new FormData(event.currentTarget).get("score"));
    const note = overlay.querySelector("#ranking-note").value;
    if (!score) return;
    await saveRanking(movie.id, score, note);
    overlay.remove();
  });
  document.body.append(overlay);
}

function readDismissedRankings() {
  try {
    return JSON.parse(sessionStorage.getItem(dismissedRankingsKey) || "[]");
  } catch {
    return [];
  }
}

function dismissRanking(movieId) {
  const dismissed = new Set(readDismissedRankings());
  dismissed.add(movieId);
  sessionStorage.setItem(dismissedRankingsKey, JSON.stringify([...dismissed]));
}

function roundPicks() {
  return familyData?.roundPicks || {};
}

function spinReady() {
  return familyData?.spinReady || {};
}

function familyMemberIds() {
  return Object.keys(familyData?.members || {});
}

function spinParticipantIds() {
  const members = familyMemberIds();
  return members.length ? members : currentUser?.uid ? [currentUser.uid] : [];
}

function readyMemberCount(ready = spinReady()) {
  const members = spinParticipantIds();
  return members.filter((uid) => ready[uid]).length;
}

function everyoneReady(ready = spinReady()) {
  const members = spinParticipantIds();
  return members.length > 0 && members.every((uid) => ready[uid]);
}

function isSpinActive() {
  const spin = familyData?.spinState;
  return remoteSpinIsActive(spin);
}

function remoteSpinIsActive(spin) {
  if (!spin?.id) return false;
  const startedAt = Number(spin.startedAt) || Date.now();
  const duration = Number(spin.duration) || SPIN_DURATION_MS;
  return Date.now() < startedAt + duration + 1000;
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

function movieMetaText(movie) {
  const parts = [movie.year, movie.rated, movie.genre]
    .filter((value) => value && value !== "N/A");
  return parts.length ? `${escapeHtml(parts.join(" • "))}<br />` : "";
}

function displayName() {
  return currentUser?.displayName || readSession()?.name || currentUser?.email?.split("@")[0] || "Someone";
}

function familyRenderSignature(data = {}) {
  const { gameArena, updatedAt, ...renderedData } = data;
  return JSON.stringify(renderedData);
}

function routeName() {
  return (location.hash.replace(/^#\/?/, "") || "home").toLowerCase();
}

function navigate(route) {
  location.hash = `#/${route}`;
}

function resetViewportPosition() {
  window.requestAnimationFrame(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  });
  window.setTimeout(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, 80);
}

function renderAppMenu() {
  const slot = document.querySelector(".menu-slot");
  if (!slot) return;
  const header = slot.closest(".page-header");
  if (header) {
    if (!header.querySelector(".home-logo-button")) {
      header.insertAdjacentHTML("afterbegin", `
        <button class="home-logo-button" type="button" aria-label="Go home">
          <img src="icon.svg" alt="" />
        </button>
      `);
      header.querySelector(".home-logo-button").addEventListener("click", () => navigate("home"));
    }
    if (!header.querySelector(".family-title")) {
      slot.insertAdjacentHTML("beforebegin", `<div class="family-title">The Ingram Family</div>`);
    }
  }

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
        <button type="button" data-menu-route="movie-list">Movie List</button>
        <button type="button" data-menu-route="search">Find Movies</button>
        <button type="button" data-menu-route="rankings">Rankings</button>
        <button type="button" data-menu-route="game">Pizza Arena</button>
        <button type="button" data-menu-route="members">Members</button>
        <button type="button" data-menu-action="logout">Log out</button>
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
  cleanupGame();
  cleanupFamilyListener();
  lastFamilyRenderSignature = "";
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
