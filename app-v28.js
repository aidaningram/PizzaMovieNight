import { firebaseConfig } from "./firebase-config.js";
import { omdbApiKey } from "./omdb-config.js";
import { curatedGenreMovies } from "./curated-movies.js";

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
  members: document.querySelector("#members-template")
};
const colors = ["#e85d75", "#f4a261", "#2a9d8f", "#457b9d", "#b8c0ff", "#f2cc8f", "#81b29a", "#c77dff"];
const sessionKey = "pizzaMovieSession";
const dismissedRankingsKey = "pizzaMovieDismissedRankings";
const selectedMovieKey = "pizzaMovieSelectedMovie";
const omdbDetailsCacheKey = "pizzaMovieOmdbDetailsV1";
const OMDB_READY = Boolean(omdbApiKey && !omdbApiKey.startsWith("PASTE_"));
const OMDB_GENRE_SEARCH_PAGES = 3;
const OMDB_GENRE_DETAIL_LIMIT = 36;
const OMDB_CURATED_DETAIL_LIMIT = 24;
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

let services = null;
let currentUser = null;
let familyData = null;
let unsubscribeFamily = null;
let pendingWinner = null;
let appStarted = false;
let authMode = "signin";
let authReady = false;
let activeSpinAnimationId = null;
let omdbDetailsCache = readOmdbDetailsCache();

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
  authMode = "signin";
  appRoot.replaceChildren(templates.login.content.cloneNode(true));
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
  if (route === "wheel") renderWheelPage();
  else if (route === "add") renderAddPage();
  else if (route === "movie-list") renderMovieListPage();
  else if (route === "search") renderSearchPage();
  else if (route === "movie-detail") renderMovieDetailPage();
  else if (route === "rankings") renderRankingsPage();
  else if (route === "members") renderMembersPage();
  else renderHomePage();
  window.setTimeout(showPendingRankingPrompt, 0);
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
      const filtered = filterOmdbResults(movies);
      renderSearchResults(filtered);
      note.textContent = filtered.length ? `${filtered.length} result${filtered.length === 1 ? "" : "s"}` : "No movies matched those filters.";
    } catch (error) {
      note.textContent = error.message || "Movie search failed.";
    }
  });
}

async function searchOmdb(query) {
  const results = await searchOmdbSummaries(query, 1);
  return Promise.all(results.slice(0, 10).map((movie) => fetchOmdbDetails(movie.imdbID)));
}

async function searchOmdbSummaries(query, pages = 1) {
  const pageNumbers = Array.from({ length: pages }, (_, index) => index + 1);
  const resultGroups = await Promise.all(pageNumbers.map(async (page) => {
    const searchUrl = new URL("https://www.omdbapi.com/");
    searchUrl.searchParams.set("apikey", omdbApiKey);
    searchUrl.searchParams.set("s", query);
    searchUrl.searchParams.set("type", "movie");
    searchUrl.searchParams.set("page", String(page));

    const response = await fetch(searchUrl);
    const data = await response.json();
    if (data.Response === "False") return [];
    return data.Search || [];
  }));

  return uniqueOmdbMovies(resultGroups.flat());
}

function uniqueOmdbMovies(movies) {
  const seen = new Set();
  return movies.filter((movie) => {
    if (!movie?.imdbID || seen.has(movie.imdbID)) return false;
    seen.add(movie.imdbID);
    return true;
  });
}

async function searchOmdbByGenre(genre) {
  const seeds = genreSearchSeeds[genre] || [genre];
  const [curatedDetails, keywordSummaries] = await Promise.all([
    fetchCuratedGenreDetails(genre),
    Promise.all(seeds.map((seed) => searchOmdbSummaries(seed, OMDB_GENRE_SEARCH_PAGES)))
  ]);
  const keywordCandidates = uniqueOmdbMovies(keywordSummaries.flat()).slice(0, OMDB_GENRE_DETAIL_LIMIT);
  const settledDetails = await Promise.allSettled(keywordCandidates.map((movie) => fetchOmdbDetails(movie.imdbID)));
  const keywordDetails = settledDetails.map((result, index) => (
    result.status === "fulfilled" ? result.value : summaryToOmdbMovie(keywordCandidates[index])
  ));

  return sortGenreResults(uniqueDetailedMovies([...curatedDetails, ...keywordDetails])).slice(0, 40);
}

async function fetchCuratedGenreDetails(genre) {
  const titles = (curatedGenreMovies[genre] || []).slice(0, OMDB_CURATED_DETAIL_LIMIT);
  const settledDetails = await Promise.allSettled(titles.map((title) => fetchOmdbDetailsByTitle(title)));
  return settledDetails.map((result, index) => {
    const fallback = curatedMovieFallback(titles[index], genre);
    if (result.status !== "fulfilled" || !result.value) return fallback;
    return {
      ...fallback,
      ...result.value,
      curatedMatch: true,
      curatedGenres: [genre]
    };
  });
}

function uniqueDetailedMovies(movies) {
  const seen = new Set();
  return movies.filter((movie) => {
    const key = movie?.imdbID && movie.imdbID !== "N/A" ? movie.imdbID : (movie?.Title || "").toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sortGenreResults(movies) {
  const hasPoster = (movie) => isRealValue(movie?.Poster);
  const scoreMovie = (movie) => {
    let score = 0;
    if (hasPoster(movie)) score += 8;
    if (movie.curatedMatch) score += 4;
    if (isRealValue(movie?.Plot)) score += 2;
    if (isRealValue(movie?.Rated)) score += 1;
    return score;
  };
  return [...movies].sort((a, b) => scoreMovie(b) - scoreMovie(a));
}

async function fetchOmdbDetailsByTitle(title) {
  const cacheKey = `title:${title.toLowerCase()}`;
  const cached = getCachedOmdbDetails(cacheKey);
  if (cached) return cached;

  const detailUrl = new URL("https://www.omdbapi.com/");
  detailUrl.searchParams.set("apikey", omdbApiKey);
  detailUrl.searchParams.set("t", title);
  detailUrl.searchParams.set("type", "movie");
  detailUrl.searchParams.set("plot", "short");

  const response = await fetch(detailUrl);
  const data = await response.json();
  if (data.Response !== "False") {
    setCachedOmdbDetails(cacheKey, data);
    if (data.imdbID) setCachedOmdbDetails(`id:${data.imdbID}`, data);
    return data;
  }

  const fallbackSummary = (await searchOmdbSummaries(title, 1))[0];
  if (!fallbackSummary?.imdbID) return null;
  try {
    const fallbackDetails = await fetchOmdbDetails(fallbackSummary.imdbID);
    setCachedOmdbDetails(cacheKey, fallbackDetails);
    if (fallbackDetails.imdbID) setCachedOmdbDetails(`id:${fallbackDetails.imdbID}`, fallbackDetails);
    return fallbackDetails;
  } catch {
    return summaryToOmdbMovie(fallbackSummary);
  }
}

async function fetchOmdbDetails(imdbID) {
  const cacheKey = `id:${imdbID}`;
  const cached = getCachedOmdbDetails(cacheKey);
  if (cached) return cached;

  const detailUrl = new URL("https://www.omdbapi.com/");
  detailUrl.searchParams.set("apikey", omdbApiKey);
  detailUrl.searchParams.set("i", imdbID);
  detailUrl.searchParams.set("plot", "short");

  const response = await fetch(detailUrl);
  const data = await response.json();
  if (data.Response === "False") throw new Error(data.Error || "Movie details failed.");
  setCachedOmdbDetails(cacheKey, data);
  return data;
}

function curatedMovieFallback(title, genre) {
  return {
    Title: title,
    Year: "",
    Rated: "",
    Runtime: "",
    Genre: genre,
    Plot: "Curated family genre pick. OMDb details will appear when available.",
    Poster: "",
    curatedMatch: true,
    curatedGenres: [genre]
  };
}

function summaryToOmdbMovie(summary) {
  return {
    Title: summary?.Title || "",
    Year: summary?.Year || "",
    Rated: "",
    Runtime: "",
    Genre: "",
    Plot: "",
    Poster: summary?.Poster || "",
    imdbID: summary?.imdbID || ""
  };
}

function readOmdbDetailsCache() {
  try {
    return JSON.parse(localStorage.getItem(omdbDetailsCacheKey) || "{}");
  } catch {
    return {};
  }
}

function getCachedOmdbDetails(key) {
  const cached = omdbDetailsCache[key];
  if (!cached) return null;
  return cached;
}

function setCachedOmdbDetails(key, value) {
  omdbDetailsCache = {
    ...omdbDetailsCache,
    [key]: value
  };
  const entries = Object.entries(omdbDetailsCache).slice(-250);
  omdbDetailsCache = Object.fromEntries(entries);
  localStorage.setItem(omdbDetailsCacheKey, JSON.stringify(omdbDetailsCache));
}

function filterOmdbResults(movies) {
  const rating = document.querySelector("#movie-rating-filter").value;
  const genre = document.querySelector("#movie-genre-filter").value;
  return movies.filter((movie) => {
    const ratingMatches = !rating || movie.Rated === rating;
    const genreMatches = !genre || (movie.Genre || "").split(", ").includes(genre) || (movie.curatedGenres || []).includes(genre);
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
  document.querySelector("#movie-detail-back").addEventListener("click", () => history.back());

  if (!movie) {
    container.innerHTML = `<div class="empty-state">Pick a movie from search to see details.</div>`;
    return;
  }

  const reviewLinks = movieReviewLinks({ Title: movie.title, Year: movie.year });
  const recommendation = recommendationForMovie(movie);
  const poster = movie.poster && movie.poster !== "N/A" ? movie.poster : "";
  container.innerHTML = `
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
        <button type="button" data-menu-route="search">Find Movies</button>
        <button type="button" data-menu-route="rankings">Rankings</button>
        <button type="button" data-menu-route="members">Members</button>
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
