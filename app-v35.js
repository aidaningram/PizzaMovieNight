import { firebaseConfig } from "./firebase-config.js";
import { omdbApiKey } from "./omdb-config.js";
import { pizzaScaleGuideFallbacks } from "./pizza-scale-guides.js";

const LEGACY_FAMILY_PASSWORD = "dogcatpig3";
const LEGACY_FAMILY_ID = "pizza-movie-night";
const APP_STATE_COLLECTION = "pizzaMovieNightFamilies";
const PIZZA_SCALE_BASE_URL = "https://thepizzascale.pizza/";
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
  designSystem: document.querySelector("#design-system-template"),
  game: document.querySelector("#game-template")
};
const colors = ["#ef463e", "#ffc94d", "#ff8b4d", "#fff0a6", "#f7b267", "#d83c35", "#f7e8c9", "#341735"];
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
const knownPizzaScaleMovieIds = {
  "kiki's delivery service": "tt0097814",
  "paddington 2": "tt4468740",
  "spider-man: into the spider-verse": "tt4633694",
  "the princess bride": "tt0093779"
};
const pizzaScaleGuideFallbackMap = new Map(
  pizzaScaleGuideFallbacks.map((guide) => [guide.id || guide.imdbId, guide])
);
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
const GAME_ZOMBIE_SEPARATION = GAME_ZOMBIE_RADIUS * 2 + 6;
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
const GAME_SURVIVAL_ENTRY_DEPTH = GAME_ZOMBIE_RADIUS + 46;
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
const GAME_SOUND_EVENT_TTL_MS = 2600;
const GAME_MAX_ACTIVE_ONE_SHOT_SOUNDS = 7;
const GAME_SOUND_COOLDOWNS = {
  collect: 90,
  meatball: 450,
  mushroomExplosion: 140,
  mushroomFire: 140,
  pepperoniFire: 160,
  pizzaDeath: 180,
  spawning: 300,
  zombieDeath: 140,
  zombieSpawn: 1800
};
const GAME_SOUND_VOLUMES = {
  collect: 0.48,
  meatball: 0.65,
  mushroomExplosion: 0.62,
  mushroomFire: 0.5,
  pepperoniFire: 0.32,
  pizzaDeath: 0.58,
  spawning: 0.45,
  zombieDeath: 0.5,
  zombieSpawn: 0.38
};
const GAME_MEATBALL_SIZE = 84;
const GAME_HEARTBEAT_MS = 120;
const GAME_SHARED_WRITE_MIN_MS = 120;
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
const GAME_SOUND_ASSETS = {
  basil: "./assets/sounds/BasilSound.mp3",
  collect: "./assets/sounds/CollectSound.mp3",
  meatball: "./assets/sounds/MeatballSound.mp3",
  meatballSecondary: "./assets/sounds/MeatballSoundSecondary.mp3",
  mushroomExplosion: "./assets/sounds/MushroomExplosion.mp3",
  mushroomFire: "./assets/sounds/MushroomFire.mp3",
  pepperoniFire: "./assets/sounds/PepperoniFire.mp3",
  pizzaDeath: [
    "./assets/sounds/PizzaDeath1.mp3",
    "./assets/sounds/PizzaDeath2.mp3",
    "./assets/sounds/PizzaDeath3.mp3",
    "./assets/sounds/PizzaDeath4.mp3"
  ],
  spawning: "./assets/sounds/SpawingSound.mp3",
  zombieDeath: "./assets/sounds/ZombieDeath.mp3",
  zombieSpawn: "./assets/sounds/ZombieSpawn.mp3"
};

let services = null;
let currentUser = null;
let familyData = null;
let activeFamilyId = LEGACY_FAMILY_ID;
let activeFamilyProfile = null;
let activeFamilyMembers = {};
let unsubscribeFamily = null;
let unsubscribeGameArena = null;
let pendingWinner = null;
let appStarted = false;
let authMode = "signin";
let authReady = false;
let activeSpinAnimationId = null;
let wheelCutterAnimationId = null;
let lastWheelMovieSignature = "";
let lastWheelMovieCount = 0;
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
let gamePlayedSoundEventIds = new Set();
let gameBasilAudioByOwner = {};
let gameAudioContext = null;
let gameSoundBuffers = {};
let gameSoundLoading = {};
let gameActiveOneShotSounds = [];
let gameLastSoundPlayedAt = {};
let gameAudioUnlocked = false;
let gameAudioReadyPromise = null;
let gameJoinedArena = false;
let gameViewMode = "menu";
let gameMatchQueued = false;
let gameSpectating = false;
let gameLobbyPresenceTimer = null;
let gameZombieImage = null;
let gameDisconnectCleanupReady = false;
let gameMatchExitPending = false;
let gameBackHandledAt = 0;
let gameSyncInFlight = false;
let gameSharedWriteInFlight = false;
let gameLastSharedWriteAt = 0;
let gameCachedCanvas = null;
let gameCachedCanvasContext = null;
let gameLastModePanelSignature = "";

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

  if (routeName() === "design-system") {
    renderDesignSystemPage();
    return;
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
  const firebaseFunctions = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-functions.js");
  const app = firebaseApp.initializeApp(firebaseConfig);
  services = {
    auth: firebaseAuth.getAuth(app),
    db: firestore.getFirestore(app),
    rtdb: realtimeDatabase.getDatabase(app),
    functions: firebaseFunctions.getFunctions(app),
    authFns: firebaseAuth,
    dbFns: firestore,
    rtdbFns: realtimeDatabase,
    functionsFns: firebaseFunctions
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

async function ensureFirebaseAuthAvailable() {
  if (!FIREBASE_READY) return false;
  if (services?.auth && services?.authFns) return true;
  await initFirebase();
  return Boolean(services?.auth && services?.authFns);
}

async function enterFamilySpace(session) {
  const resolved = await resolveActiveFamily(session);
  activeFamilyId = resolved.familyId;
  activeFamilyProfile = resolved.familyProfile;
  activeFamilyMembers = await loadPizzaScaleFamilyMembers(activeFamilyId);
  const familyRef = familyStateRef();

  unsubscribeFamily = services.dbFns.onSnapshot(familyRef, (nextSnap) => {
    const nextFamilyData = hydratePizzaMovieNightFamilyData({ ...nextSnap.data(), id: nextSnap.id });
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

async function loadPizzaScaleFamilyMembers(familyId) {
  if (!familyId) return {};

  try {
    const membersQuery = services.dbFns.query(
      services.dbFns.collection(services.db, "familyMembers"),
      services.dbFns.where("familyId", "==", familyId)
    );
    const snapshot = await services.dbFns.getDocs(membersQuery);
    const members = {};

    snapshot.docs.forEach((memberDoc) => {
      const member = memberDoc.data() || {};
      const memberKey = member.userId || member.linkedAccountUserId || memberDoc.id;
      const linkedAccountUserId = member.linkedAccountUserId || member.userId || "";
      if (!linkedAccountUserId && !member.email) return;
      members[memberKey] = {
        name: member.firstNameOrNickname || member.displayName || "Family member",
        email: member.email || "",
        role: member.role || "",
        permission: member.permission || "",
        birthDate: member.birthDate || "",
        gender: member.gender || "",
        profileOnly: !linkedAccountUserId,
        linkedAccountUserId,
        familyMemberId: memberDoc.id,
        joinedAt: member.createdAt || Date.now()
      };
    });

    return members;
  } catch (error) {
    if (error?.code === "permission-denied") return {};
    throw error;
  }
}

function hydratePizzaMovieNightFamilyData(rawData = {}) {
  return {
    ...rawData,
    familyDisplayName: rawData.familyDisplayName || familyDisplayName(activeFamilyProfile),
    name: rawData.name || rawData.familyDisplayName || familyDisplayName(activeFamilyProfile),
    members: mergeVisibleFamilyMembers(rawData.members || {}, activeFamilyMembers)
  };
}

function mergeVisibleFamilyMembers(appMembers = {}, sharedMembers = {}) {
  const merged = {};
  const claimedNames = new Set();

  Object.entries(sharedMembers).forEach(([uid, member]) => {
    merged[uid] = member;
    const nameKey = memberNameKey(member);
    if (nameKey) claimedNames.add(nameKey);
  });

  Object.entries(appMembers).forEach(([uid, member]) => {
    if (!memberHasAccount(member)) return;
    const nameKey = memberNameKey(member);
    if (nameKey && claimedNames.has(nameKey) && !sharedMembers[uid]) return;
    merged[uid] = member;
  });

  return merged;
}

function memberHasAccount(member = {}) {
  return Boolean(member.email || member.userId || member.uid || member.linkedAccountUserId);
}

function memberNameKey(member = {}) {
  return String(member.name || member.firstNameOrNickname || member.email || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

async function resolveActiveFamily(session = {}) {
  const existingFamilyId = session.familyId || "";
  if (existingFamilyId) {
    const existingFamily = await loadSharedFamily(existingFamilyId);
    if (existingFamily) {
      await ensurePizzaMovieNightState(existingFamily.id, existingFamily);
      await rememberSessionFamily(existingFamily.id);
      return { familyId: existingFamily.id, familyProfile: existingFamily };
    }
  }

  const memberFamily = await findSharedFamilyForCurrentUser();
  if (memberFamily) {
    await ensurePizzaMovieNightState(memberFamily.id, memberFamily);
    await rememberSessionFamily(memberFamily.id);
    return { familyId: memberFamily.id, familyProfile: memberFamily };
  }

  const legacyFamily = await loadLegacyFamily();
  if (legacyFamily) {
    await ensureLegacyFamilyMembership(legacyFamily.id);
    await ensurePizzaMovieNightState(legacyFamily.id, legacyFamily);
    await rememberSessionFamily(legacyFamily.id);
    return { familyId: legacyFamily.id, familyProfile: legacyFamily };
  }

  const createdFamily = await createFallbackSharedFamily(session);
  await ensurePizzaMovieNightState(createdFamily.id, createdFamily);
  await rememberSessionFamily(createdFamily.id);
  return { familyId: createdFamily.id, familyProfile: createdFamily };
}

async function loadSharedFamily(familyId) {
  if (!familyId) return null;

  const familyRef = services.dbFns.doc(services.db, "families", familyId);
  let snap;
  try {
    snap = await services.dbFns.getDoc(familyRef);
  } catch (error) {
    if (error?.code === "permission-denied") return null;
    throw error;
  }

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
    isLegacyPizzaMovieNightFamily: snap.id === LEGACY_FAMILY_ID
  };
}

async function findSharedFamilyForCurrentUser() {
  if (!currentUser?.uid) return null;

  let snapshot;
  try {
    const familyQuery = services.dbFns.query(
      services.dbFns.collection(services.db, "families"),
      services.dbFns.where("memberUserIds", "array-contains", currentUser.uid),
      services.dbFns.limit(1)
    );
    snapshot = await services.dbFns.getDocs(familyQuery);
  } catch (error) {
    if (error?.code === "permission-denied") return null;
    throw error;
  }

  if (!snapshot.empty) {
    const familyDoc = snapshot.docs[0];
    return { id: familyDoc.id, ...familyDoc.data() };
  }

  return null;
}

async function loadLegacyFamily() {
  const legacyRef = services.dbFns.doc(services.db, "families", LEGACY_FAMILY_ID);
  let legacySnap;
  try {
    legacySnap = await services.dbFns.getDoc(legacyRef);
  } catch (error) {
    if (error?.code === "permission-denied") return null;
    throw error;
  }

  if (!legacySnap.exists()) return null;

  return { id: legacySnap.id, ...legacySnap.data(), isLegacyPizzaMovieNightFamily: true };
}

async function ensureLegacyFamilyMembership(familyId) {
  if (!currentUser?.uid) return;

  const familyRef = services.dbFns.doc(services.db, "families", familyId);
  await services.dbFns.setDoc(
    familyRef,
    {
      displayName: familyDisplayName({ id: familyId }),
      appSource: "pizza-movie-night",
      memberUserIds: services.dbFns.arrayUnion(currentUser.uid),
      members: {
        [currentUser.uid]: memberRecord()
      },
      updatedAt: services.dbFns.serverTimestamp()
    },
    { merge: true }
  );
}

async function joinPizzaScaleFamily(inviteCode, displayName) {
  if (!services?.functions || !services?.functionsFns) return null;

  const joinFamilyByInvite = services.functionsFns.httpsCallable(
    services.functions,
    "joinFamilyByInvite"
  );
  const firstAttempt = await joinFamilyByInvite({
    inviteCode,
    displayName,
    createNewProfile: false
  });
  const firstResult = firstAttempt?.data || {};

  if (!firstResult.requiresMemberConfirmation) return firstResult;

  const matchedMembers = Array.isArray(firstResult.matchedMembers) ? firstResult.matchedMembers : [];
  if (matchedMembers.length !== 1) {
    throw new Error("That name matches more than one family profile. Join from The Pizza Scale settings first.");
  }

  const secondAttempt = await joinFamilyByInvite({
    inviteCode,
    displayName,
    claimMemberId: matchedMembers[0].id,
    createNewProfile: false
  });
  return secondAttempt?.data || {};
}

async function createFallbackSharedFamily(session = {}) {
  const familyRef = services.dbFns.doc(services.db, "families", LEGACY_FAMILY_ID);
  const payload = {
    displayName: "The Ingram Family",
    appSource: "pizza-movie-night",
    createdByUserId: currentUser.uid,
    leadAdultUserId: currentUser.uid,
    memberUserIds: [currentUser.uid],
    ratingAdultUserIds: [currentUser.uid],
    inviteCode: LEGACY_FAMILY_PASSWORD,
    familyCode: LEGACY_FAMILY_PASSWORD,
    members: {
      [currentUser.uid]: memberRecord()
    },
    createdAt: services.dbFns.serverTimestamp(),
    updatedAt: services.dbFns.serverTimestamp()
  };

  await services.dbFns.setDoc(familyRef, payload, { merge: true });
  return { id: familyRef.id, ...payload, displayName: payload.displayName || session.name };
}

async function ensurePizzaMovieNightState(familyId, familyProfile = {}) {
  const stateRef = services.dbFns.doc(services.db, APP_STATE_COLLECTION, familyId);
  const stateSnap = await services.dbFns.getDoc(stateRef);

  if (stateSnap.exists()) {
    await services.dbFns.setDoc(
      stateRef,
      {
        members: {
          ...(stateSnap.data().members || {}),
          [currentUser.uid]: memberRecord()
        },
        familyDisplayName: familyDisplayName(familyProfile),
        updatedAt: services.dbFns.serverTimestamp()
      },
      { merge: true }
    );
    return;
  }

  const legacyState = familyProfile?.isLegacyPizzaMovieNightFamily
    ? normalizeLegacyPizzaMovieNightState(familyProfile)
    : defaultFamilyData(familyId, familyProfile);

  await services.dbFns.setDoc(stateRef, {
    ...legacyState,
    id: familyId,
    familyId,
    familyDisplayName: familyDisplayName(familyProfile),
    members: {
      ...(legacyState.members || {}),
      [currentUser.uid]: memberRecord()
    },
    migratedFromFamilyId: familyProfile?.isLegacyPizzaMovieNightFamily ? LEGACY_FAMILY_ID : "",
    createdAt: services.dbFns.serverTimestamp(),
    updatedAt: services.dbFns.serverTimestamp()
  });
}

function normalizeLegacyPizzaMovieNightState(legacyFamily = {}) {
  const {
    displayName,
    leadAdultUserId,
    memberUserIds,
    ratingAdultUserIds,
    inviteCode,
    familyCode,
    appSource,
    ...appState
  } = legacyFamily;

  return {
    ...defaultFamilyData(legacyFamily.id || LEGACY_FAMILY_ID, legacyFamily),
    ...appState,
    id: legacyFamily.id || LEGACY_FAMILY_ID,
    familyId: legacyFamily.id || LEGACY_FAMILY_ID,
    joinCode: legacyFamily.joinCode || LEGACY_FAMILY_PASSWORD
  };
}

async function rememberSessionFamily(familyId) {
  const session = readSession();
  if (!session) return;

  localStorage.setItem(sessionKey, JSON.stringify({ ...session, familyId }));
}

function renderLogin(message = "") {
  setHomeScreenActive(false);
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
    familyPasswordWrap.hidden = false;
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
      if (!(await ensureFirebaseAuthAvailable())) {
        note.textContent = "Firebase is still loading. Try again in a moment.";
        return;
      }
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
    if (authMode === "signup" && !isLegacyFamilyPassword(familyPassword)) {
      note.textContent = "That is not the family password.";
      return;
    }

    note.textContent = authMode === "signup" ? "Creating account..." : "Signing in...";
    try {
      if (FIREBASE_READY) {
        if (!(await ensureFirebaseAuthAvailable())) {
          note.textContent = "Firebase is still loading. Try again in a moment.";
          return;
        }
        const credential = authMode === "signup"
          ? await services.authFns.createUserWithEmailAndPassword(services.auth, email, accountPassword)
          : await services.authFns.signInWithEmailAndPassword(services.auth, email, accountPassword);
        const displayName = name || credential.user.displayName || email.split("@")[0];
        if (displayName !== credential.user.displayName) {
          await services.authFns.updateProfile(credential.user, { displayName });
        }
        currentUser = { uid: credential.user.uid, displayName, email: credential.user.email || email };
        if (authMode === "signup" || familyPassword.trim()) {
          if (!isLegacyFamilyPassword(familyPassword)) {
            note.textContent = "That is not the family password.";
            return;
          }
          const joinedFamily = await joinPizzaScaleFamily(familyPassword, displayName);
          if (joinedFamily?.id) {
            localStorage.setItem(sessionKey, JSON.stringify({
              uid: credential.user.uid,
              name: displayName,
              email,
              familyAccess: true,
              familyId: joinedFamily.id
            }));
            location.hash = "#/home";
            await enterFamilySpace(readSession());
            return;
          }
        }
        localStorage.setItem(sessionKey, JSON.stringify({
          uid: credential.user.uid,
          name: displayName,
          email,
          familyAccess: true
        }));
        location.hash = "#/home";
        try {
          await enterFamilySpace(readSession());
        } catch (error) {
          if (isRulesBlockedError(error) && authMode === "signin" && !familyPassword.trim()) {
            note.textContent = "This account exists, but it has not joined the family yet. Enter the family password and sign in again.";
            return;
          }
          throw error;
        }
        return;
      }

      const session = { name, uid: `local-${slug(name)}-${crypto.randomUUID()}`, familyAccess: true };
      localStorage.setItem(sessionKey, JSON.stringify(session));
      currentUser = { uid: session.uid, displayName: name, email: "" };
      location.hash = "#/home";
      start();
    } catch (error) {
      console.error("PizzaMovieNight sign-in failed", {
        code: error?.code || "",
        message: error?.message || String(error || "")
      });
      note.textContent = friendlyAuthError(error);
    }
  });
}

function renderRoute() {
  if (routeName() === "design-system") {
    cleanupGame();
    setHomeScreenActive(false);
    renderDesignSystemPage();
    return;
  }
  if (!readSession()) {
    setHomeScreenActive(false);
    renderLogin();
    return;
  }
  if (!familyData) return;

  const route = routeName();
  setHomeScreenActive(route === "home");
  if (route !== "game") cleanupGame();
  if (route === "wheel") renderWheelPage();
  else if (route === "add") renderAddPage();
  else if (route === "movie-list") renderMovieListPage();
  else if (route === "search") renderSearchPage();
  else if (route === "movie-detail") renderMovieDetailPage();
  else if (route === "pizza-scale-guide") renderPizzaScaleGuidePage();
  else if (route === "rankings") renderRankingsPage();
  else if (route === "members") renderMembersPage();
  else if (route === "design-system") renderDesignSystemPage();
  else if (route === "game") renderGamePage();
  else renderHomePage();
  resetViewportPosition();
  if (route !== "game") window.setTimeout(showPendingRankingPrompt, 0);
}

function renderHomePage() {
  appRoot.replaceChildren(templates.home.content.cloneNode(true));
  renderAppMenu();
  const name = currentUser?.displayName || readSession()?.name || "friend";
  document.querySelector("#welcome-title").innerHTML = `Welcome <span>${escapeHtml(name)}</span> to the home of pizza movie night`;
  document.querySelector("#go-wheel-button").addEventListener("click", () => navigate("wheel"));
  document.querySelector("#go-list-button").addEventListener("click", () => navigate("movie-list"));
  document.querySelector("#go-search-button").addEventListener("click", () => navigate("search"));
  document.querySelector("#go-rankings-button").addEventListener("click", () => navigate("rankings"));
  document.querySelector("#go-game-button").addEventListener("click", () => navigate("game"));
}

function renderDesignSystemPage() {
  appRoot.replaceChildren(templates.designSystem.content.cloneNode(true));
  resetViewportPosition();
}

function renderWheelPage() {
  appRoot.replaceChildren(templates.wheel.content.cloneNode(true));
  renderAppMenu();
  document.querySelector("#spin-button").addEventListener("click", requestSpin);
  document.querySelector("#confirm-picked").addEventListener("click", confirmPicked);
  document.querySelector("#go-add-button").addEventListener("click", () => navigate("add"));
  document.querySelector("#open-clear-wheel").addEventListener("click", showClearWheelOverlay);

  const empty = activeMovies().length === 0;
  const canAdd = canCurrentUserAddMovie();
  const spinActive = isSpinActive();
  const addPanel = document.querySelector("#empty-wheel-panel");
  const clearButton = document.querySelector("#open-clear-wheel");
  document.querySelector("#spin-button").hidden = empty;
  clearButton.hidden = empty;
  clearButton.disabled = spinActive;
  addPanel.hidden = !canAdd || spinActive;
  if (canAdd) {
    addPanel.querySelector("h2").textContent = empty ? "The wheel is empty." : "Add your movie.";
    addPanel.querySelector("p").textContent = empty
      ? "Add picks for the next pizza movie night."
      : "You can add one movie to this wheel.";
  }
  updateSpinUi();
  const currentWheelSignature = wheelMovieSignature();
  const shouldAnimateWheelChange = Boolean(
    currentWheelSignature
      && lastWheelMovieSignature
      && currentWheelSignature !== lastWheelMovieSignature
      && activeMovies().length >= lastWheelMovieCount
      && !spinActive
  );
  lastWheelMovieSignature = currentWheelSignature;
  lastWheelMovieCount = activeMovies().length;
  if (shouldAnimateWheelChange) animateWheelCutter();
  else drawWheel();
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
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `Open details for ${movie.title}`);
    item.innerHTML = `
      <div>
        <h3>${escapeHtml(movie.title)}</h3>
        <p>${movieMetaText(movie)}Suggested by ${escapeHtml(movie.suggestedBy || "someone")}</p>
      </div>
      <button class="remove-button" type="button" aria-label="Remove ${escapeHtml(movie.title)}">×</button>
    `;
    item.addEventListener("click", () => openMovieListDetail(movie));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openMovieListDetail(movie);
      }
    });
    item.querySelector("button").addEventListener("click", (event) => {
      event.stopPropagation();
      removeFromMovieList(movie.id);
    });
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

async function fetchOmdbDetailsByTitle(title) {
  const detailUrl = new URL("https://www.omdbapi.com/");
  detailUrl.searchParams.set("apikey", omdbApiKey);
  detailUrl.searchParams.set("t", title);
  detailUrl.searchParams.set("type", "movie");
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
    item.innerHTML = `
      ${poster ? `<img src="${escapeHtml(poster)}" alt="" loading="lazy" />` : `<div class="poster-placeholder"><img src="assets/pizza-logo.png" alt="" loading="lazy" /></div>`}
      <div class="search-card-body">
        <div>
          <h3>${escapeHtml(movie.Title)}</h3>
          <p>${escapeHtml([movie.Year, movie.Rated, movie.Runtime].filter((value) => value && value !== "N/A").join(" • "))}</p>
          <p>${escapeHtml(movie.Genre && movie.Genre !== "N/A" ? movie.Genre : "")}</p>
        </div>
        <p>${escapeHtml(movie.Plot && movie.Plot !== "N/A" ? movie.Plot : "")}</p>
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

function openPizzaScaleGuide(movie) {
  sessionStorage.setItem(selectedMovieKey, JSON.stringify(movie));
  navigate("pizza-scale-guide");
}

async function openMovieListDetail(movie) {
  if (!movie?.title) return;
  if (movie.source === "omdb" || movie.imdbID || movie.plot || movie.poster) {
    openMovieDetail(movie);
    return;
  }
  if (!OMDB_READY) {
    openMovieDetail(movieListDetailFallback(movie));
    return;
  }
  try {
    const details = await fetchOmdbDetailsByTitle(movie.title);
    openMovieDetail({
      ...movie,
      ...omdbMovieData(details),
      id: movie.id,
      suggestedBy: movie.suggestedBy,
      suggestedByUid: movie.suggestedByUid,
      createdAt: movie.createdAt
    });
  } catch {
    openMovieDetail(movieListDetailFallback(movie));
  }
}

function movieListDetailFallback(movie) {
  return {
    title: movie.title,
    imdbID: movie.imdbID || movie.imdbId || knownPizzaScaleMovieIds[normalizeMovieTitle(movie.title)] || "",
    year: movie.year || "",
    rated: movie.rated || "",
    genre: movie.genre || "",
    runtime: movie.runtime || "",
    poster: movie.poster || "",
    plot: movie.plot || "",
    actors: movie.actors || "",
    director: movie.director || "",
    writer: movie.writer || "",
    imdbRating: movie.imdbRating || "",
    awards: movie.awards || "",
    source: movie.source || "movie-list"
  };
}

function renderMovieDetailPage() {
  appRoot.replaceChildren(templates.movieDetail.content.cloneNode(true));
  renderAppMenu();

  const movie = readSelectedMovie();
  const container = document.querySelector("#movie-detail-content");

  if (!movie) {
    container.innerHTML = `
      <button class="back-button inline-back-button" type="button" aria-label="Go back"><span aria-hidden="true">&larr;</span><span>Back</span></button>
      <div class="empty-state">Pick a movie from search to see details.</div>
    `;
    container.querySelector(".inline-back-button").addEventListener("click", () => history.back());
    return;
  }

  const reviewLinks = movieReviewLinks({ Title: movie.title, Year: movie.year });
  const poster = movie.poster && movie.poster !== "N/A" ? movie.poster : "";
  container.innerHTML = `
    <button class="back-button inline-back-button" type="button" aria-label="Go back"><span aria-hidden="true">&larr;</span><span>Back</span></button>
    <article class="movie-detail-card">
      ${poster ? `<img class="movie-detail-poster" src="${escapeHtml(poster)}" alt="" loading="lazy" />` : `<div class="movie-detail-poster poster-placeholder"><img src="assets/pizza-logo.png" alt="" loading="lazy" /></div>`}
      <div class="movie-detail-body">
        <p class="eyebrow">${escapeHtml([movie.year, movie.rated, movie.runtime].filter(isRealValue).join(" • "))}</p>
        <h1 class="page-title">${escapeHtml(movie.title)}</h1>
        <p>${escapeHtml(movie.plot && movie.plot !== "N/A" ? movie.plot : "No plot available.")}</p>
        <section id="pizza-scale-summary" class="pizza-scale-summary" hidden></section>
        <dl class="movie-facts">
          ${movieFact("Genre", movie.genre)}
          ${movieFact("Actors", movie.actors)}
          ${movieFact("Director", movie.director)}
          ${movieFact("Writer", movie.writer)}
          ${movieFact("IMDb", movie.imdbRating && movie.imdbRating !== "N/A" ? `${movie.imdbRating}/10` : "")}
          ${movieFact("Awards", movie.awards)}
        </dl>
        <section id="where-to-watch" class="where-to-watch" aria-label="Where to watch ${escapeHtml(movie.title)}">
          <button id="watch-summary" class="watch-summary" type="button" disabled aria-expanded="false">
            <span class="watch-title">Where to watch</span>
            <span id="watch-provider-strip" class="watch-provider-strip" aria-label="Checking watch availability">
              <span class="watch-loading">Checking...</span>
            </span>
            <span id="watch-chevron" class="watch-chevron" aria-hidden="true">⌄</span>
          </button>
          <div id="watch-details" class="watch-details" hidden></div>
          <p id="watch-note" class="watch-note" hidden></p>
        </section>
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
          <button id="detail-open-guide" class="secondary-action compact-action" type="button">Open Pizza Scale Guide</button>
          <button id="detail-add-list" class="secondary-action compact-action" type="button">Add to Movie List</button>
          <button id="detail-add-wheel" class="primary-action compact-action" type="button" ${canCurrentUserAddMovie() ? "" : "disabled"}>Add to wheel</button>
        </div>
      </div>
    </article>
  `;
  container.querySelector(".inline-back-button").addEventListener("click", () => history.back());
  document.querySelector("#detail-open-guide").addEventListener("click", () => openPizzaScaleGuide(movie));
  document.querySelector("#detail-add-list").addEventListener("click", () => addSearchMovieToList(movie));
  document.querySelector("#detail-add-wheel").addEventListener("click", async () => {
    await addToWheel(movie);
    navigate("wheel");
  });
  loadPizzaScaleSummary(movie);
  loadWatchProviders(movie);
}

function renderPizzaScaleGuidePage() {
  appRoot.replaceChildren(templates.movieDetail.content.cloneNode(true));
  renderAppMenu();

  const movie = readSelectedMovie();
  const container = document.querySelector("#movie-detail-content");

  if (!movie) {
    container.innerHTML = `
      <button class="back-button inline-back-button" type="button" aria-label="Go back"><span aria-hidden="true">&larr;</span><span>Back</span></button>
      <div class="empty-state">Pick a movie first, then open its Pizza Scale guide.</div>
    `;
    container.querySelector(".inline-back-button").addEventListener("click", () => history.back());
    return;
  }

  const poster = movie.poster && movie.poster !== "N/A" ? movie.poster : "";
  container.innerHTML = `
    <button class="back-button inline-back-button" type="button" aria-label="Go back"><span aria-hidden="true">&larr;</span><span>Back</span></button>
    <article class="pizza-guide-page">
      <section class="movie-detail-card pizza-guide-hero">
        ${poster ? `<img class="movie-detail-poster" src="${escapeHtml(poster)}" alt="" loading="lazy" />` : `<div class="movie-detail-poster poster-placeholder"><img src="assets/pizza-logo.png" alt="" loading="lazy" /></div>`}
        <div class="movie-detail-body">
          <p class="eyebrow">Pizza Scale Guide</p>
          <h1 class="page-title">${escapeHtml(movie.title)}</h1>
          <p>${escapeHtml([movie.year, movie.rated, movie.runtime].filter(isRealValue).join(" • ") || "Movie details")}</p>
          <div id="pizza-guide-score-row" class="pizza-guide-score-row"></div>
          <div class="search-actions pizza-guide-actions">
            <a id="pizza-scale-review-link" class="primary-action compact-action" href="${escapeHtml(pizzaScaleMovieUrl(movie, true))}" target="_blank" rel="noopener noreferrer">Review on Pizza Scale</a>
            <a class="secondary-action compact-action" href="${escapeHtml(pizzaScaleMovieUrl(movie))}" target="_blank" rel="noopener noreferrer">Open on Pizza Scale</a>
          </div>
        </div>
      </section>
      <section id="pizza-guide-content" class="pizza-guide-panel">
        <div class="empty-state">Loading Pizza Scale guide...</div>
      </section>
    </article>
  `;

  container.querySelector(".inline-back-button").addEventListener("click", () => history.back());
  loadPizzaScaleGuidePage(movie);
}

async function loadPizzaScaleSummary(movie) {
  const panel = document.querySelector("#pizza-scale-summary");
  const imdbId = movie?.imdbId || movie?.imdbID || movie?.id || "";

  if (!panel || !FIREBASE_READY || !services?.functions || !/^tt\d{5,12}$/.test(imdbId)) return;

  try {
    const getMovieScaleSummary = services.functionsFns.httpsCallable(
      services.functions,
      "getMovieScaleSummary"
    );
    const result = await getMovieScaleSummary({ imdbId, familyId: activeFamilyId });
    const summary = result.data || {};
    const guide = summary.guide;
    const movieSummary = summary.movie;

    if (!guide && !movieSummary && !summary.familyReview) return;

    panel.hidden = false;
    panel.innerHTML = pizzaScaleSummaryMarkup(summary);
  } catch {
    panel.hidden = true;
  }
}

async function loadWatchProviders(movie) {
  const section = document.querySelector("#where-to-watch");
  const summaryButton = document.querySelector("#watch-summary");
  const strip = document.querySelector("#watch-provider-strip");
  const details = document.querySelector("#watch-details");
  const note = document.querySelector("#watch-note");
  const chevron = document.querySelector("#watch-chevron");
  const imdbId = movie?.imdbId || movie?.imdbID || movie?.id || "";

  if (!section || !summaryButton || !strip || !details || !note) return;

  const setUnavailable = (message) => {
    strip.innerHTML = `<span class="watch-unavailable">Unavailable</span>`;
    details.hidden = true;
    details.innerHTML = "";
    note.hidden = !message;
    note.textContent = message || "";
    summaryButton.disabled = true;
    summaryButton.setAttribute("aria-expanded", "false");
    if (chevron) chevron.hidden = true;
  };

  if (!/^tt\d{5,12}$/.test(imdbId) || !FIREBASE_READY || !services?.functions) {
    setUnavailable("Watch availability is unavailable for this movie.");
    return;
  }

  try {
    const getWatchProviders = services.functionsFns.httpsCallable(
      services.functions,
      "getWatchProviders"
    );
    const result = await getWatchProviders({
      imdbId,
      title: movie.title,
      year: movie.year,
      region: "US"
    });
    const providers = normalizeWatchProviderGroups(result.data?.providers);
    const providerCount = getProviderCount(providers);

    if (!providerCount) {
      setUnavailable(getWatchProviderMessage(result.data) || "Watch availability is unavailable for this movie right now.");
      return;
    }

    const iconProviders = getUniqueWatchProviders({ stream: providers.stream }).slice(0, 8);
    strip.setAttribute("aria-label", `${providerCount} watch option${providerCount === 1 ? "" : "s"} available`);
    strip.innerHTML = iconProviders.length
      ? iconProviders.map(watchProviderIconMarkup).join("")
      : `<span class="watch-unavailable">Rent/buy available</span>`;
    details.innerHTML = `
      ${watchProviderGroupMarkup("Stream", providers.stream)}
      ${watchProviderGroupMarkup("Rent", providers.rent)}
      ${watchProviderGroupMarkup("Buy", providers.buy)}
    `;
    note.hidden = true;
    note.textContent = "";
    summaryButton.disabled = false;
    if (chevron) chevron.hidden = false;

    summaryButton.addEventListener("click", () => {
      const expanded = details.hidden;
      details.hidden = !expanded;
      summaryButton.setAttribute("aria-expanded", String(expanded));
      if (chevron) chevron.classList.toggle("expanded", expanded);
    });
  } catch (error) {
    setUnavailable(getWatchProviderErrorMessage(error));
  }
}

function emptyWatchProviderGroups() {
  return {
    stream: [],
    rent: [],
    buy: []
  };
}

function normalizeWatchProviderGroups(value) {
  const groups = emptyWatchProviderGroups();

  return Object.fromEntries(
    Object.keys(groups).map((key) => [
      key,
      Array.isArray(value?.[key])
        ? value[key]
          .map((provider) => ({
            id: String(provider?.id || provider?.name || "").trim(),
            name: String(provider?.name || "").trim(),
            logoUrl: String(provider?.logoUrl || "").trim(),
            webUrl: String(provider?.webUrl || "").trim()
          }))
          .filter((provider) => provider.name && !isHiddenWatchProvider(provider))
          .slice(0, 12)
        : []
    ])
  );
}

function isHiddenWatchProvider(provider) {
  const name = String(provider?.name || "");
  return /\(\s*via\b/i.test(name) || /^kanopy$/i.test(name.trim());
}

function getProviderCount(groups) {
  return Object.values(groups || {}).reduce(
    (total, providers) => total + (Array.isArray(providers) ? providers.length : 0),
    0
  );
}

function getUniqueWatchProviders(groups) {
  const providers = [];
  const seen = new Set();

  Object.values(groups || {}).forEach((groupProviders) => {
    if (!Array.isArray(groupProviders)) return;

    groupProviders.forEach((provider) => {
      const key = provider.id || provider.name;
      if (!key || seen.has(key)) return;

      seen.add(key);
      providers.push(provider);
    });
  });

  return providers;
}

function watchProviderIconMarkup(provider) {
  return `
    <span class="watch-provider-icon" title="${escapeHtml(provider.name)}">
      ${provider.logoUrl
        ? `<img src="${escapeHtml(provider.logoUrl)}" alt="" loading="lazy" />`
        : `<span>${escapeHtml(getProviderInitials(provider.name))}</span>`}
    </span>
  `;
}

function watchProviderGroupMarkup(title, providers) {
  if (!providers.length) return "";

  return `
    <div class="watch-provider-group">
      <strong>${escapeHtml(title)}</strong>
      <div>
        ${providers.map((provider) => {
          const content = `${watchProviderIconMarkup(provider)}${escapeHtml(provider.name)}`;
          return provider.webUrl
            ? `<a href="${escapeHtml(provider.webUrl)}" target="_blank" rel="noopener noreferrer">${content}</a>`
            : `<span>${content}</span>`;
        }).join("")}
      </div>
    </div>
  `;
}

function getProviderInitials(name) {
  return String(name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getWatchProviderMessage(data) {
  if (data?.reason === "quota-or-key") return "Watch availability is temporarily unavailable.";
  if (data?.reason === "not-found") return "Watch availability is unavailable for this movie.";
  if (data?.status === "unavailable") return "Watch availability is unavailable right now.";
  return "";
}

function getWatchProviderErrorMessage(error) {
  const message = String(error?.message || "");
  if (/quota|key|permission|unauthenticated|resource-exhausted/i.test(message)) {
    return "Watch availability is temporarily unavailable.";
  }
  return "Watch availability is unavailable right now.";
}

async function loadPizzaScaleGuidePage(movie) {
  const content = document.querySelector("#pizza-guide-content");
  const scoreRow = document.querySelector("#pizza-guide-score-row");
  const imdbId = movie?.imdbId || movie?.imdbID || movie?.id || "";

  if (!content || !/^tt\d{5,12}$/.test(imdbId)) {
    if (content) {
      content.innerHTML = `<div class="empty-state">This movie does not have a valid IMDb id yet, so Pizza Scale data is unavailable.</div>`;
    }
    return;
  }

  try {
    const summary = await getPizzaScaleMovieData(imdbId);
    const score = summary.familyReview?.pizzaScore || summary.movie?.pizzaScore;
    if (scoreRow) scoreRow.innerHTML = pizzaGuideScoreRowMarkup(summary);
    content.innerHTML = pizzaGuidePanelMarkup(summary.guide, movie.title, Boolean(activeFamilyId), score);
  } catch (error) {
    content.innerHTML = `<div class="empty-state">Pizza Scale guide data is unavailable right now.</div>`;
  }
}

async function getPizzaScaleMovieData(imdbId) {
  const summary = await getPizzaScaleCallableSummary(imdbId).catch(() => ({}));
  const [movieDoc, guideDoc] = await Promise.all([
    services.dbFns.getDoc(services.dbFns.doc(services.db, "movies", imdbId)).catch(() => null),
    services.dbFns.getDoc(services.dbFns.doc(services.db, "movieGuides", imdbId)).catch(() => null)
  ]);

  return {
    ...summary,
    movie: {
      ...(summary.movie || {}),
      ...(movieDoc?.exists?.() ? normalizePizzaScaleMovie(movieDoc.data()) : {})
    },
    guide: guideDoc?.exists?.()
      ? normalizePizzaScaleGuide(guideDoc.data())
      : normalizePizzaScaleGuide(summary.guide || pizzaScaleGuideFallbackMap.get(imdbId))
  };
}

async function getPizzaScaleCallableSummary(imdbId) {
  if (!FIREBASE_READY || !services?.functions) return {};

  const getMovieScaleSummary = services.functionsFns.httpsCallable(
    services.functions,
    "getMovieScaleSummary"
  );
  const result = await getMovieScaleSummary({ imdbId, familyId: activeFamilyId });
  return result.data || {};
}

function pizzaScaleSummaryMarkup(summary = {}) {
  const guide = summary.guide || {};
  const movie = summary.movie || {};
  const familyReview = summary.familyReview;
  const score = familyReview?.pizzaScore || movie.pizzaScore;
  const scoreText = Number.isFinite(Number(score)) ? `${Number(score).toFixed(1)} / 8 slices` : "No family score yet";
  const guideSummary = guide.summary ? `<p>${escapeHtml(guide.summary)}</p>` : "";
  const watchOut = Array.isArray(guide.watchOutFor) && guide.watchOutFor.length
    ? `<small>Watch out for: ${escapeHtml(guide.watchOutFor.slice(0, 3).join(", "))}</small>`
    : "";

  return `
    <div>
      <p class="eyebrow">The Pizza Scale</p>
      <strong>${escapeHtml(scoreText)}</strong>
      ${familyReview ? `<span>Your family has rated this movie.</span>` : ""}
    </div>
    ${guideSummary}
    ${watchOut}
  `;
}

function pizzaGuideScoreRowMarkup(summary = {}) {
  const movie = summary.movie || {};
  const familyReview = summary.familyReview;
  const score = familyReview?.pizzaScore || movie.pizzaScore;
  const reviewCount = Number(movie.reviewCount || 0);
  return `
    <div class="pizza-guide-main-score">
      ${pizzaFillMarkup(score || 0)}
      <div>
        <span>Pizza Scale score</span>
        <strong>${Number.isFinite(Number(score)) ? `${Number(score).toFixed(1)} / 8` : "No score yet"}</strong>
        <small>${familyReview ? "Your family has rated this movie." : reviewCount ? `${reviewCount} family rating${reviewCount === 1 ? "" : "s"}` : "No family ratings yet"}</small>
      </div>
    </div>
  `;
}

function pizzaGuidePanelMarkup(guide, movieTitle, canShowFamilyFit, score) {
  if (!guide) {
    return `
      <div class="section-heading-text">
        <strong>Pizza Scale Guide</strong>
      </div>
      <div class="empty-state">
        <strong>Family guide not created yet</strong>
        <p>This space will hold Pizza Scale's family-centered movie guide for ${escapeHtml(movieTitle)}.</p>
      </div>
    `;
  }

  const concerns = Object.entries(guide.concernLevels || {})
    .filter(([, value]) => Number.isFinite(Number(value)));

  return `
    <div class="section-heading-text">
      <strong>Pizza Scale Guide</strong>
    </div>
    <div class="guide-status-row">
      <span>${escapeHtml(formatGuideStatus(guide.status))}</span>
      ${guide.bestAgeRange ? `<span>Best for ${escapeHtml(guide.bestAgeRange)}</span>` : ""}
    </div>
    ${guide.summary ? `<p class="guide-summary">${escapeHtml(guide.summary)}</p>` : ""}
    <div class="guide-score-grid">
      ${guideScoreMarkup("Family night fit", guide.familyNightFit, !canShowFamilyFit, "Join a family to calculate this.")}
      ${guideScoreMarkup("Parent appeal", guide.parentAppeal)}
      ${guideScoreMarkup("Kid appeal", guide.kidAppeal)}
      ${guideScoreMarkup("Teen appeal", guide.teenAppeal)}
    </div>
    ${concerns.length ? `
      <div class="guide-concerns">
        ${concerns.map(([key, value]) => `
          <span class="guide-concern-chip">${escapeHtml(guideConcernLabel(key))}: ${escapeHtml(formatConcernLevel(Number(value)))}</span>
        `).join("")}
      </div>
    ` : ""}
    ${guideListMarkup("Good for", guide.goodFor, "good")}
    ${guideListMarkup("May not fit", guide.mayNotFit, "caution")}
    ${guideListMarkup("Watch out for", guide.watchOutFor, "watch")}
    ${guideListMarkup("Conversation starters", guide.conversationTopics, "conversation")}
  `;
}

function guideScoreMarkup(label, value, isLocked = false, lockedText = "") {
  const number = Number(value);
  const hasValue = Number.isFinite(number) && !isLocked;
  return `
    <div class="guide-score-card ${isLocked ? "locked" : ""}">
      <span>${escapeHtml(label)}</span>
      ${hasValue ? pizzaFillMarkup(number) : `<div class="guide-score-placeholder"></div>`}
      <strong>${hasValue ? `${number.toFixed(1)} / 8` : "Not ready yet"}</strong>
      ${isLocked ? `<small>${escapeHtml(lockedText)}</small>` : ""}
    </div>
  `;
}

function guideListMarkup(title, items, variant = "") {
  if (!Array.isArray(items) || !items.length) return "";
  return `
    <div class="guide-list ${escapeHtml(variant)}">
      <strong>${escapeHtml(title)}</strong>
      <div>
        ${items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
      </div>
    </div>
  `;
}

function pizzaFillMarkup(value) {
  const number = Math.max(0, Math.min(8, Number(value) || 0));
  const fillAngle = (number / 8) * 360;
  return `
    <div class="pizza-fill" aria-label="${number.toFixed(1)} out of 8 pizza slices" style="--pizza-fill-angle: ${fillAngle}deg">
      <span class="single-pizza-base" aria-hidden="true"></span>
      <span class="single-pizza-fill" aria-hidden="true"></span>
      <span class="single-pizza-lines" aria-hidden="true"></span>
    </div>
  `;
}

function normalizePizzaScaleMovie(movie = {}) {
  return {
    title: movie.title || "",
    year: movie.year || "",
    rated: movie.rated || "",
    runtime: movie.runtime || "",
    genre: movie.genre || "",
    posterUrl: movie.posterUrl || "",
    pizzaScore: numberOrNull(movie.avgPizzaScore ?? movie.pizzaScore),
    reviewCount: Number(movie.reviewCount || 0)
  };
}

function normalizeMovieTitle(title = "") {
  return String(title).trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizePizzaScaleGuide(guide = null) {
  if (!guide || guide.status === "empty") return null;
  return {
    status: guide.status || "",
    summary: guide.summary || "",
    bestAgeRange: guide.bestAgeRange || "",
    parentAppeal: numberOrNull(guide.parentAppeal),
    kidAppeal: numberOrNull(guide.kidAppeal),
    teenAppeal: numberOrNull(guide.teenAppeal),
    familyNightFit: numberOrNull(guide.familyNightFit),
    concernLevels: guide.concernLevels || {},
    goodFor: cleanGuideList(guide.goodFor),
    mayNotFit: cleanGuideList(guide.mayNotFit),
    watchOutFor: cleanGuideList(guide.watchOutFor),
    conversationTopics: cleanGuideList(guide.conversationTopics)
  };
}

function cleanGuideList(items) {
  return Array.isArray(items)
    ? items.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
}

function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function formatGuideStatus(status) {
  switch (status) {
    case "verified":
      return "Verified family guide";
    case "ai-assisted":
      return "AI-assisted guide";
    case "draft":
      return "Draft guide";
    default:
      return "Pizza Scale guide";
  }
}

function formatConcernLevel(value) {
  if (!Number.isFinite(value)) return "Not noted";
  if (value <= 0) return "None noted";
  if (value === 1) return "Very mild";
  if (value === 2) return "Mild";
  if (value === 3) return "Moderate";
  return "High";
}

function guideConcernLabel(key) {
  return ({
    scare: "Scary moments",
    violence: "Violence",
    language: "Language",
    romanceNudity: "Romance/nudity",
    substances: "Substances"
  })[key] || key;
}

function pizzaScaleMovieUrl(movie = {}, review = false) {
  const url = new URL(PIZZA_SCALE_BASE_URL);
  const imdbId = movie.imdbId || movie.imdbID || movie.id || "";
  const params = new URLSearchParams();
  if (imdbId) params.set("imdbId", imdbId);
  if (movie.title) params.set("title", movie.title);
  url.hash = `#/${review ? "rate-movie" : "movie-stats"}${params.toString() ? `?${params.toString()}` : ""}`;
  return url.toString();
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
  document.querySelector("#free-play-button")?.addEventListener("click", () => {
    unlockGameAudio();
    enterGameFreePlay();
  });
  document.querySelector("#survival-button")?.addEventListener("click", () => {
    unlockGameAudio();
    enterGameSurvival();
  });
  document.querySelector("#start-match-button")?.addEventListener("click", () => {
    unlockGameAudio();
    queueGameMatch();
  });
  document.querySelector("#spectate-button")?.addEventListener("click", () => {
    unlockGameAudio();
    enterGameSpectate();
  });
  document.querySelector("#test-sound-button")?.addEventListener("click", () => testGameSound());
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
  document.querySelector("#end-free-play-button")?.addEventListener("click", () => {
    unlockGameAudio();
    enterGameFreePlay();
  });
  document.querySelector("#survival-return-menu-button")?.addEventListener("click", () => returnGameMenu());
  document.querySelector("#survival-play-again-button")?.addEventListener("click", () => {
    unlockGameAudio();
    enterGameSurvival();
  });
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
    soundEvents: {},
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
  queueGameSoundEvent("zombieSpawn");
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
  const modePanelSignature = [
    gameViewMode,
    showPlay ? "play" : "menu",
    match.status || "",
    isParticipant ? "participant" : "visitor",
    gameSpectating ? "spectating" : "playing",
    active.map((entry) => entry.uid).join(","),
    queuedCount,
    isQueued ? "queued" : "unqueued",
    gameSurvivalEnded() ? "survival-ended" : "",
    Number(gameState?.solo?.lives || 0),
    Number(gameState?.solo?.wave || 0)
  ].join("|");
  if (gameLastModePanelSignature === modePanelSignature) {
    renderMatchLeaderboard();
    renderGameRecords();
    renderAmmoDisplay();
    renderSurvivalHud();
    return;
  }
  gameLastModePanelSignature = modePanelSignature;
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
  const soundEvents = pruneGameTimedMap(mergeGameTimedMaps(remoteGame.soundEvents, gameState?.soundEvents), now, GAME_SOUND_EVENT_TTL_MS);
  processGameSoundEvents(soundEvents);
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
    soundEvents,
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
    soundEvents: {},
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
    soundEvents: useCurrentMap ? pruneGameTimedMap(value?.soundEvents || {}, Date.now(), GAME_SOUND_EVENT_TTL_MS) : {},
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

function queueGameSoundEvent(type, options = {}) {
  const now = Date.now();
  const event = {
    id: `${type}-${options.ownerUid || currentUser?.uid || "world"}-${now}-${Math.random().toString(36).slice(2)}`,
    type,
    ownerUid: options.ownerUid || currentUser?.uid || "",
    source: type === "pizzaDeath" ? randomGamePizzaDeathSound() : "",
    createdAt: now
  };
  if (gameState) {
    gameState.soundEvents = {
      ...(gameState.soundEvents || {}),
      [event.id]: event
    };
  }
  playGameSoundEvent(event);
  if (gameViewMode !== "solo") writeGameSoundEvent(event);
  return event;
}

function writeGameSoundEvent(event) {
  if (!FIREBASE_READY || !event?.id) return;
  services.rtdbFns.update(gameArenaRef(), {
    [`soundEvents/${event.id}`]: event,
    updatedAt: Date.now()
  }).catch(() => {});
}

function processGameSoundEvents(events = {}) {
  if (!gameAudioUnlocked) return;
  Object.values(events || {})
    .filter((event) => Date.now() - Number(event?.createdAt || 0) < GAME_SOUND_EVENT_TTL_MS)
    .sort((a, b) => Number(a.createdAt || 0) - Number(b.createdAt || 0))
    .forEach((event) => playGameSoundEvent(event));
}

function playGameSoundEvent(event = {}) {
  if (!event.id || gamePlayedSoundEventIds.has(event.id)) return;
  if (event.type === "basilStart") {
    if (startGameBasilSound(event.ownerUid, event.createdAt)) markGameSoundEventPlayed(event.id);
    return;
  }
  if (event.type === "basilStop") {
    stopGameBasilSound(event.ownerUid);
    markGameSoundEventPlayed(event.id);
    return;
  }
  const source = gameSoundSourceForEvent(event);
  if (source) {
    playGameSoundSource(source, {
      eventType: event.type,
      volume: gameSoundVolumeForEvent(event)
    });
    markGameSoundEventPlayed(event.id);
  }
}

function markGameSoundEventPlayed(id) {
  gamePlayedSoundEventIds.add(id);
  if (gamePlayedSoundEventIds.size > 160) {
    gamePlayedSoundEventIds = new Set([...gamePlayedSoundEventIds].slice(-80));
  }
}

function gameSoundSourceForEvent(event = {}) {
  if (event.type === "collect") return GAME_SOUND_ASSETS.collect;
  if (event.type === "meatball") return event.ownerUid === currentUser?.uid ? GAME_SOUND_ASSETS.meatball : GAME_SOUND_ASSETS.meatballSecondary;
  if (event.type === "mushroomExplosion") return GAME_SOUND_ASSETS.mushroomExplosion;
  if (event.type === "mushroomFire") return GAME_SOUND_ASSETS.mushroomFire;
  if (event.type === "pepperoniFire") return GAME_SOUND_ASSETS.pepperoniFire;
  if (event.type === "pizzaDeath") return event.source || randomGamePizzaDeathSound();
  if (event.type === "spawning") return GAME_SOUND_ASSETS.spawning;
  if (event.type === "zombieDeath") return GAME_SOUND_ASSETS.zombieDeath;
  if (event.type === "zombieSpawn") return GAME_SOUND_ASSETS.zombieSpawn;
  return "";
}

function gameSoundVolumeForEvent(event = {}) {
  return GAME_SOUND_VOLUMES[event.type] ?? 0.6;
}

function randomGamePizzaDeathSound() {
  const sounds = GAME_SOUND_ASSETS.pizzaDeath;
  return sounds[Math.floor(Math.random() * sounds.length)];
}

function gameSoundSources() {
  return Object.values(GAME_SOUND_ASSETS).flat();
}

function getGameAudioContext() {
  if (gameAudioContext) return gameAudioContext;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  gameAudioContext = new AudioContextClass();
  return gameAudioContext;
}

function unlockGameAudio() {
  const context = getGameAudioContext();
  if (!context) return Promise.resolve(null);
  gameAudioUnlocked = true;
  gameAudioReadyPromise = (context.state === "suspended" ? context.resume() : Promise.resolve())
    .catch(() => null)
    .then(() => playSilentGameAudioPulse(context));
  return gameAudioReadyPromise;
}

function playSilentGameAudioPulse(context) {
  try {
    const buffer = context.createBuffer(1, 1, 22050);
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    gain.gain.value = 0;
    source.connect(gain);
    gain.connect(context.destination);
    source.start(0);
  } catch (error) {}
}

function runWhenGameAudioReady(callback) {
  const context = getGameAudioContext();
  if (!context || !gameAudioUnlocked) return false;
  const ready = context.state === "running"
    ? Promise.resolve()
    : (gameAudioReadyPromise || context.resume().catch(() => null));
  ready.then(() => {
    if (context.state === "running") callback(context);
  });
  return true;
}

function loadGameSoundBuffer(source) {
  if (!source) return Promise.resolve(null);
  const context = getGameAudioContext();
  if (!context) return Promise.resolve(null);
  if (gameSoundBuffers[source]) return Promise.resolve(gameSoundBuffers[source]);
  if (gameSoundLoading[source]) return gameSoundLoading[source];
  gameSoundLoading[source] = fetch(source)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => context.decodeAudioData(arrayBuffer.slice(0)))
    .then((buffer) => {
      gameSoundBuffers[source] = buffer;
      return buffer;
    })
    .catch(() => null)
    .finally(() => {
      delete gameSoundLoading[source];
    });
  return gameSoundLoading[source];
}

async function testGameSound() {
  const note = document.querySelector("#game-audio-test-note");
  const setNote = (message) => {
    if (note) note.textContent = message;
  };
  setNote("Unlocking audio...");
  const context = getGameAudioContext();
  if (!context) {
    setNote("Audio is not supported in this browser.");
    return;
  }
  try {
    await unlockGameAudio();
    await (context.state === "suspended" ? context.resume().catch(() => null) : Promise.resolve());
    setNote(`Audio context: ${context.state}. Playing beep...`);
    const beepPlayed = playGameTestTone(context);
    if (!beepPlayed) {
      setNote(`Audio context: ${context.state}. Beep could not start.`);
      return;
    }
    await new Promise((resolve) => window.setTimeout(resolve, 520));
    setNote(`Audio context: ${context.state}. Loading MP3 test...`);
    const buffer = await loadGameSoundBuffer(GAME_SOUND_ASSETS.collect);
    if (!buffer) {
      setNote(`Audio context: ${context.state}. Test sound could not load or decode.`);
      return;
    }
    let played = false;
    const scheduled = runWhenGameAudioReady(() => {
      const playing = playGameSoundBuffer(GAME_SOUND_ASSETS.collect, buffer, { volume: 1 });
      played = Boolean(playing);
    });
    if (!scheduled) {
      setNote(`Audio context: ${context.state}. Playback was blocked.`);
      return;
    }
    window.setTimeout(() => {
      setNote(played
        ? `Audio context: ${context.state}. Beep and MP3 test played.`
        : `Audio context: ${context.state}. Playback did not start.`);
    }, 120);
  } catch (error) {
    setNote(`Audio test failed: ${error?.message || "unknown error"}`);
  }
}

function playGameTestTone(context) {
  try {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(660, context.currentTime);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.9, context.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.42);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.45);
    return true;
  } catch (error) {
    return false;
  }
}

function playGameSoundSource(source, options = {}) {
  const context = getGameAudioContext();
  if (!context || !source || !gameAudioUnlocked) return false;
  if (!canPlayGameOneShotSound(options.eventType || source)) return true;
  const buffer = gameSoundBuffers[source];
  if (buffer) {
    runWhenGameAudioReady(() => playGameSoundBuffer(source, buffer, options));
    return true;
  }
  loadGameSoundBuffer(source).then((loadedBuffer) => {
    if (loadedBuffer) runWhenGameAudioReady(() => playGameSoundBuffer(source, loadedBuffer, options));
  });
  return true;
}

function playGameSoundBuffer(source, buffer, options = {}) {
  const context = getGameAudioContext();
  if (!context || !buffer) return null;
  cleanupFinishedGameOneShotSounds();
  if (!options.loop && gameActiveOneShotSounds.length >= GAME_MAX_ACTIVE_ONE_SHOT_SOUNDS) return null;
  const bufferSource = context.createBufferSource();
  const gain = context.createGain();
  bufferSource.buffer = buffer;
  gain.gain.value = options.volume ?? 0.85;
  bufferSource.connect(gain);
  gain.connect(context.destination);
  const offset = Math.max(0, Math.min(options.offset || 0, Math.max(0, buffer.duration - 0.02)));
  bufferSource.start(0, offset);
  const playing = { source: bufferSource, gain, ended: false };
  bufferSource.onended = () => {
    playing.ended = true;
    gameActiveOneShotSounds = gameActiveOneShotSounds.filter((item) => item !== playing);
    if (typeof options.onended === "function") options.onended();
  };
  if (!options.loop) gameActiveOneShotSounds.push(playing);
  return playing;
}

function canPlayGameOneShotSound(key) {
  const now = Date.now();
  const cooldown = GAME_SOUND_COOLDOWNS[key] ?? 80;
  const previous = gameLastSoundPlayedAt[key] || 0;
  if (now - previous < cooldown) return false;
  cleanupFinishedGameOneShotSounds();
  if (gameActiveOneShotSounds.length >= GAME_MAX_ACTIVE_ONE_SHOT_SOUNDS) return false;
  gameLastSoundPlayedAt[key] = now;
  return true;
}

function cleanupFinishedGameOneShotSounds() {
  if (!gameActiveOneShotSounds.length) return;
  gameActiveOneShotSounds = gameActiveOneShotSounds.filter((item) => item && !item.ended);
}

function startGameBasilSound(ownerUid = "unknown", createdAt = Date.now()) {
  if (!gameAudioUnlocked) return false;
  const key = ownerUid || "unknown";
  stopGameBasilSound(key);
  const elapsed = Math.max(0, Date.now() - Number(createdAt || Date.now())) / 1000;
  loadGameSoundBuffer(GAME_SOUND_ASSETS.basil).then((buffer) => {
    if (!buffer || elapsed >= buffer.duration) return;
    runWhenGameAudioReady(() => {
      const playing = playGameSoundBuffer(GAME_SOUND_ASSETS.basil, buffer, {
        loop: true,
        volume: 0.42,
        offset: elapsed
      });
      if (!playing) return;
      gameBasilAudioByOwner[key] = playing;
      playing.source.onended = () => {
        playing.ended = true;
        if (gameBasilAudioByOwner[key]?.source === playing.source) delete gameBasilAudioByOwner[key];
      };
    });
  });
  return true;
}

function stopGameBasilSound(ownerUid = "unknown") {
  const key = ownerUid || "unknown";
  const playing = gameBasilAudioByOwner[key];
  if (!playing) return;
  try {
    playing.source.stop();
  } catch (error) {}
  delete gameBasilAudioByOwner[key];
}

function stopAllGameSounds() {
  Object.keys(gameBasilAudioByOwner).forEach((key) => stopGameBasilSound(key));
  gameActiveOneShotSounds.forEach((playing) => {
    try {
      playing.source.stop();
    } catch (error) {}
  });
  gameActiveOneShotSounds = [];
}

function startGameBasilFireSound() {
  if (gameLocalPlayer?.powerup !== "basil" || !gameFireHeld) return;
  queueGameSoundEvent("basilStart", { ownerUid: currentUser?.uid });
}

function stopGameBasilFireSound() {
  queueGameSoundEvent("basilStop", { ownerUid: currentUser?.uid });
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
  const canvas = gameCachedCanvas || document.querySelector("#game-canvas");
  if (!canvas) {
    cleanupGame();
    return;
  }
  gameCachedCanvas = canvas;
  const dt = Math.min(0.04, (now - gameLastFrame) / 1000);
  const wallNow = Date.now();
  gameLastFrame = now;
  if (gameViewMode === "solo") updateSurvivalGame(dt, wallNow);
  else if (gameLocalPlayer && !gameSpectating) updateLocalGame(dt, wallNow);
  updateGameVisualPlayers(dt);
  drawGame(wallNow);
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
    queueGameSoundEvent("spawning", { ownerUid: player.uid });
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
  const soundSignatureBefore = gameTimedMapSignature(gameState.soundEvents || {});
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
  const nextSoundEvents = pruneGameTimedMap(mergeGameTimedMaps(serverGame.soundEvents, gameState.soundEvents), now, GAME_SOUND_EVENT_TTL_MS);
  gameState = {
    ...gameState,
    players,
    projectiles,
    removedProjectiles,
    zombies,
    zombieDeaths,
    explosionEffects: nextExplosionEffects,
    soundEvents: nextSoundEvents,
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
  const soundSharedChanged = gameTimedMapSignature(gameState.soundEvents || {}) !== soundSignatureBefore;
  const sharedArenaChanged = Object.keys(hits).length !== hitCountBefore
    || Object.keys(projectiles).length !== projectileCountBefore
    || Object.keys(gameState.pepperoniPickups || {}).length !== pepperoniCountBefore
    || gameScoreSignature(gameState) !== scoreSignatureBefore
    || zombieSharedChanged
    || removedProjectilesSharedChanged
    || explosionSharedChanged
    || soundSharedChanged
    || collectedSharedChanged
    || zombieDeathsSharedChanged;
  if (sharedArenaChanged) {
    requestGameSharedStateWrite(gameState, { includeZombies: zombieSharedChanged || zombieDeathsSharedChanged }, now);
  }
  if (now - gameLastHeartbeat > GAME_HEARTBEAT_MS) {
    gameLastHeartbeat = now;
    requestGameSync(now);
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
    queueGameSoundEvent("spawning", { ownerUid: player.uid });
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
    soundEvents: gameState.soundEvents || {},
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

function requestGameSync(now = Date.now()) {
  if (gameSyncInFlight || gameViewMode === "solo" || !gameState) return;
  gameSyncInFlight = true;
  syncLocalGame(now).finally(() => {
    gameSyncInFlight = false;
  });
}

function requestGameSharedStateWrite(nextArena, options = {}, now = Date.now()) {
  if (gameViewMode === "solo" || !nextArena) return;
  if (gameSharedWriteInFlight || now - gameLastSharedWriteAt < GAME_SHARED_WRITE_MIN_MS) return;
  gameSharedWriteInFlight = true;
  gameLastSharedWriteAt = now;
  writeGameArenaSharedState(nextArena, options).finally(() => {
    gameSharedWriteInFlight = false;
  });
}

function startNextSurvivalWave(wave, now = Date.now()) {
  queueGameSoundEvent("zombieSpawn");
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
    const angle = Math.atan2(spawn.entryY - spawn.y, spawn.entryX - spawn.x);
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
      gateSide: spawn.side,
      entryX: spawn.entryX,
      entryY: spawn.entryY,
      spawnedAt: now,
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
  if (gate.side === "top") return { side: gate.side, x: offset, y: gate.y, entryX: offset, entryY: GAME_SURVIVAL_ENTRY_DEPTH };
  if (gate.side === "bottom") return { side: gate.side, x: offset, y: gate.y, entryX: offset, entryY: GAME_ARENA.height - GAME_SURVIVAL_ENTRY_DEPTH };
  if (gate.side === "left") return { side: gate.side, x: gate.x, y: offset, entryX: GAME_SURVIVAL_ENTRY_DEPTH, entryY: offset };
  return { side: gate.side, x: gate.x, y: offset, entryX: GAME_ARENA.width - GAME_SURVIVAL_ENTRY_DEPTH, entryY: offset };
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
  const movedZombies = zombies.map((zombie) => {
    if (!zombie.alive) return zombie;
    const enteredArena = Boolean(zombie.enteredArena || gameSurvivalZombieInsideArena(zombie));
    if (!enteredArena) {
      const entry = gameSurvivalZombieEntryTarget(zombie);
      const entryOverdue = now - Number(zombie.spawnedAt ?? (now - 7000)) > 6500;
      const vector = gameNormalizedVector(entry.x - zombie.x, entry.y - zombie.y);
      const moved = {
        ...zombie,
        enteredArena: false,
        entryX: entry.x,
        entryY: entry.y,
        vx: vector.x,
        vy: vector.y,
        x: zombie.x + vector.x * Number(zombie.speed || GAME_ZOMBIE_SPEED) * dt,
        y: zombie.y + vector.y * Number(zombie.speed || GAME_ZOMBIE_SPEED) * dt,
        facing: vector.x < -0.04 ? -1 : vector.x > 0.04 ? 1 : zombie.facing || 1
      };
      if (entryOverdue) {
        moved.x = entry.x;
        moved.y = entry.y;
      }
      if (gameDistance(moved.x, moved.y, entry.x, entry.y) < GAME_ZOMBIE_RADIUS || gameSurvivalZombieInsideArena(moved)) {
        const bounds = gameSurvivalZombieInnerBounds();
        moved.enteredArena = true;
        moved.x = gameClamp(moved.x, bounds.minX, bounds.maxX);
        moved.y = gameClamp(moved.y, bounds.minY, bounds.maxY);
      } else {
        moved.x = gameClamp(moved.x, -GAME_ZOMBIE_RADIUS - 18, GAME_ARENA.width + GAME_ZOMBIE_RADIUS + 18);
        moved.y = gameClamp(moved.y, -GAME_ZOMBIE_RADIUS - 18, GAME_ARENA.height + GAME_ZOMBIE_RADIUS + 18);
      }
      return moved;
    }
    const walls = enteredArena ? GAME_WALLS : GAME_SURVIVAL_WALLS;
    const threat = player?.alive && player.powerup === "meatball" ? player : null;
    const target = !threat && player?.alive && !(player.deadUntil && now < player.deadUntil) ? player : null;
    const direct = threat
      ? gameNormalizedVector(zombie.x - threat.x, zombie.y - threat.y)
      : target ? gameNormalizedVector(target.x - zombie.x, target.y - zombie.y) : gameNormalizedVector(zombie.vx || 1, zombie.vy || 0);
    const focus = threat || target || { x: zombie.x + direct.x, y: zombie.y + direct.y };
    const mode = threat ? "flee" : "chase";
    const vector = gameLineBlockedByWalls(zombie.x, zombie.y, focus.x, focus.y, GAME_ZOMBIE_RADIUS + 3, walls)
      ? gameBestSurvivalZombieDirection(zombie, direct, focus, mode, walls)
      : direct;
    let moved = {
      ...zombie,
      enteredArena: true,
      vx: vector.x,
      vy: vector.y,
      x: zombie.x + vector.x * Number(zombie.speed || GAME_ZOMBIE_SPEED) * dt,
      y: zombie.y + vector.y * Number(zombie.speed || GAME_ZOMBIE_SPEED) * dt,
      facing: vector.x < -0.04 ? -1 : vector.x > 0.04 ? 1 : zombie.facing || 1
    };
    const hitX = walls.some((wall) => gameCircleRectHit(moved.x, zombie.y, GAME_ZOMBIE_RADIUS, wall));
    const hitY = walls.some((wall) => gameCircleRectHit(moved.x, moved.y, GAME_ZOMBIE_RADIUS, wall));
    if (hitX || hitY) {
      const avoid = gameBestSurvivalZombieDirection(zombie, direct, focus, mode, walls);
      const retry = {
        ...zombie,
        enteredArena: true,
        vx: avoid.x,
        vy: avoid.y,
        x: zombie.x + avoid.x * Number(zombie.speed || GAME_ZOMBIE_SPEED) * dt,
        y: zombie.y + avoid.y * Number(zombie.speed || GAME_ZOMBIE_SPEED) * dt,
        facing: avoid.x < -0.04 ? -1 : avoid.x > 0.04 ? 1 : zombie.facing || 1
      };
      moved = gameZombiePositionBlocked(retry.x, retry.y, GAME_WALLS, gameSurvivalZombieInnerBounds())
        ? turnGameZombie({ ...zombie, enteredArena: true, x: zombie.x, y: zombie.y }, now)
        : retry;
    }
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
  return separateGameZombies(movedZombies, GAME_WALLS, gameSurvivalZombieInnerBounds(), (zombie) => zombie.alive && zombie.enteredArena);
}

function gameSurvivalZombieInsideArena(zombie) {
  const bounds = gameSurvivalZombieInnerBounds();
  return zombie.x >= bounds.minX
    && zombie.x <= bounds.maxX
    && zombie.y >= bounds.minY
    && zombie.y <= bounds.maxY;
}

function gameSurvivalZombieEntryTarget(zombie) {
  if (Number.isFinite(zombie.entryX) && Number.isFinite(zombie.entryY)) return { x: zombie.entryX, y: zombie.entryY };
  if (zombie.y < 0) return { x: gameClamp(zombie.x, GAME_SURVIVAL_X_GATE_START + GAME_SURVIVAL_GATE_PADDING, GAME_SURVIVAL_X_GATE_END - GAME_SURVIVAL_GATE_PADDING), y: GAME_SURVIVAL_ENTRY_DEPTH };
  if (zombie.y > GAME_ARENA.height) return { x: gameClamp(zombie.x, GAME_SURVIVAL_X_GATE_START + GAME_SURVIVAL_GATE_PADDING, GAME_SURVIVAL_X_GATE_END - GAME_SURVIVAL_GATE_PADDING), y: GAME_ARENA.height - GAME_SURVIVAL_ENTRY_DEPTH };
  if (zombie.x < 0) return { x: GAME_SURVIVAL_ENTRY_DEPTH, y: gameClamp(zombie.y, GAME_SURVIVAL_Y_GATE_START + GAME_SURVIVAL_GATE_PADDING, GAME_SURVIVAL_Y_GATE_END - GAME_SURVIVAL_GATE_PADDING) };
  return { x: GAME_ARENA.width - GAME_SURVIVAL_ENTRY_DEPTH, y: gameClamp(zombie.y, GAME_SURVIVAL_Y_GATE_START + GAME_SURVIVAL_GATE_PADDING, GAME_SURVIVAL_Y_GATE_END - GAME_SURVIVAL_GATE_PADDING) };
}

function gameBestSurvivalZombieDirection(zombie, preferred, focus, mode, walls = GAME_WALLS) {
  return gameBestZombieDirectionWithWalls(zombie, preferred, focus, mode, walls, gameSurvivalZombieInnerBounds());
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
  queueGameSoundEvent("mushroomExplosion", { ownerUid: shot.ownerUid });
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
  queueGameSoundEvent("zombieDeath", { ownerUid: currentUser?.uid });
}

function markSurvivalPlayerHit(player, pepperoniPickups, solo, now = Date.now()) {
  if (solo.gameOver) return;
  solo.lives = Math.max(0, Number(solo.lives || 0) - 1);
  dropGamePepperoniPile(player, pepperoniPickups, now);
  clearGamePlayerLoadout(player);
  player.shieldUntil = 0;
  queueGameSoundEvent("pizzaDeath", { ownerUid: player.uid });
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
  const syncedSoundEvents = pruneGameTimedMap(mergeGameTimedMaps(serverGame.soundEvents, nextGame.soundEvents), now, GAME_SOUND_EVENT_TTL_MS);
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
    soundEvents: syncedSoundEvents || {},
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
    const mergedZombieDeaths = pruneGameTimedMap(mergeGameTimedMaps(existingArena.zombieDeaths, nextArena.zombieDeaths), Date.now());
    const mergedRemovedProjectiles = pruneGameTimedMap(mergeGameTimedMaps(existingArena.removedProjectiles, nextArena.removedProjectiles), Date.now(), GAME_REMOVED_PROJECTILE_TTL_MS);
    const mergedExplosionEffects = pruneGameExplosionEffects(mergeGameTimedMaps(existingArena.explosionEffects, nextArena.explosionEffects));
    const mergedCollectedPickups = mergeGameTimedMaps(existingArena.collectedPickups, nextArena.collectedPickups);
    const mergedSoundEvents = pruneGameTimedMap(mergeGameTimedMaps(existingArena.soundEvents, nextArena.soundEvents), Date.now(), GAME_SOUND_EVENT_TTL_MS);
    patch.zombies = nextArena.zombies || GAME_ZOMBIE_STARTS;
    patch.pepperoniPickups = gamePickupPatchValue(nextArena.pepperoniPickups || {}, mergedCollectedPickups || {});
    patch.zombieDeaths = Object.keys(mergedZombieDeaths || {}).length ? mergedZombieDeaths : null;
    addGameTimedMapPatch(patch, "removedProjectiles", mergedRemovedProjectiles);
    patch.explosionEffects = Object.keys(mergedExplosionEffects || {}).length ? mergedExplosionEffects : null;
    patch.soundEvents = Object.keys(mergedSoundEvents || {}).length ? mergedSoundEvents : null;
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
  const mergedZombieDeaths = pruneGameTimedMap(mergeGameTimedMaps(familyData?.gameArena?.zombieDeaths, nextArena.zombieDeaths), Date.now());
  const mergedRemovedProjectiles = pruneGameTimedMap(mergeGameTimedMaps(familyData?.gameArena?.removedProjectiles, nextArena.removedProjectiles), Date.now(), GAME_REMOVED_PROJECTILE_TTL_MS);
  const mergedExplosionEffects = pruneGameExplosionEffects(mergeGameTimedMaps(familyData?.gameArena?.explosionEffects, nextArena.explosionEffects));
  const mergedSoundEvents = pruneGameTimedMap(mergeGameTimedMaps(familyData?.gameArena?.soundEvents, nextArena.soundEvents), Date.now(), GAME_SOUND_EVENT_TTL_MS);
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
  patch.zombieDeaths = Object.keys(mergedZombieDeaths || {}).length ? mergedZombieDeaths : null;
  addGameTimedMapPatch(patch, "removedProjectiles", mergedRemovedProjectiles);
  patch.explosionEffects = Object.keys(mergedExplosionEffects || {}).length ? mergedExplosionEffects : null;
  patch.soundEvents = Object.keys(mergedSoundEvents || {}).length ? mergedSoundEvents : null;
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
  queueGameSoundEvent("mushroomExplosion", { ownerUid: shot.ownerUid });
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
  queueGameSoundEvent("pizzaDeath", { ownerUid: player.uid });
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
  queueGameSoundEvent("zombieDeath", { ownerUid: killerUid });
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
      queueGameSoundEvent("collect", { ownerUid: player.uid });
      if (type === "meatball") queueGameSoundEvent("meatball", { ownerUid: player.uid });
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
  const movedZombies = normalizedZombies.map((zombie) => {
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
      queueGameSoundEvent("zombieSpawn");
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
    if (hitX || hitY) {
      const focus = threat || target || { x: nextZombie.x + nextZombie.vx * 120, y: nextZombie.y + nextZombie.vy * 120 };
      const mode = threat ? "flee" : target ? "chase" : "wander";
      const avoid = gameBestZombieDirection(nextZombie, gameNormalizedVector(nextZombie.vx || 1, nextZombie.vy || 0), focus, mode);
      const retry = {
        ...nextZombie,
        vx: avoid.x,
        vy: avoid.y,
        x: nextZombie.x + avoid.x * GAME_ZOMBIE_SPEED * dt,
        y: nextZombie.y + avoid.y * GAME_ZOMBIE_SPEED * dt,
        facing: avoid.x < -0.04 ? -1 : avoid.x > 0.04 ? 1 : nextZombie.facing || 1
      };
      const retryBlocked = gameZombiePositionBlocked(retry.x, retry.y, GAME_WALLS, gameStandardZombieBounds());
      moved = retryBlocked ? turnGameZombie({ ...nextZombie, x: nextZombie.x, y: nextZombie.y }, now) : retry;
    }
    return unstickGameZombie(moved);
  });
  return separateGameZombies(movedZombies, GAME_WALLS, gameStandardZombieBounds());
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
  return gameBestZombieDirectionWithWalls(zombie, preferred, focus, mode, GAME_WALLS, gameStandardZombieBounds());
}

function gameBestZombieDirectionWithWalls(zombie, preferred, focus, mode, walls = GAME_WALLS, bounds = gameStandardZombieBounds()) {
  const step = GAME_ZOMBIE_RADIUS * 2.3;
  const ranked = gameZombieDirectionCandidates(preferred)
    .filter((candidate) => candidate.x || candidate.y)
    .map((candidate) => {
      const x = zombie.x + candidate.x * step;
      const y = zombie.y + candidate.y * step;
      const blocked = gameZombiePositionBlocked(x, y, walls, bounds);
      const distance = gameDistance(x, y, focus.x, focus.y);
      const sightBlocked = !blocked && mode === "chase" && gameLineBlockedByWalls(x, y, focus.x, focus.y, GAME_ZOMBIE_RADIUS + 2, walls);
      const driftPenalty = gameDistance(candidate.x, candidate.y, preferred.x, preferred.y) * 4;
      const baseScore = mode === "flee" ? -distance : mode === "wander" ? driftPenalty : distance;
      return {
        candidate,
        score: baseScore + driftPenalty + (sightBlocked ? 42 : 0) + (blocked ? 100000 : 0)
      };
    })
    .sort((a, b) => a.score - b.score);
  return ranked[0]?.candidate || preferred;
}

function gameZombieDirectionCandidates(preferred) {
  const direction = gameNormalizedVector(preferred.x || 1, preferred.y || 0);
  const angle = Math.atan2(direction.y, direction.x);
  const offsets = [0, 0.35, -0.35, 0.7, -0.7, 1.1, -1.1, 1.55, -1.55, 2.1, -2.1, Math.PI];
  return offsets.map((offset) => ({
    x: Math.cos(angle + offset),
    y: Math.sin(angle + offset)
  }));
}

function gameStandardZombieBounds() {
  return {
    minX: GAME_ZOMBIE_RADIUS,
    maxX: GAME_ARENA.width - GAME_ZOMBIE_RADIUS,
    minY: GAME_ZOMBIE_RADIUS,
    maxY: GAME_ARENA.height - GAME_ZOMBIE_RADIUS
  };
}

function gameZombiePositionBlocked(x, y, walls = GAME_WALLS, bounds = gameStandardZombieBounds()) {
  return x < bounds.minX
    || x > bounds.maxX
    || y < bounds.minY
    || y > bounds.maxY
    || walls.some((wall) => gameCircleRectHit(x, y, GAME_ZOMBIE_RADIUS, wall));
}

function separateGameZombies(zombies = [], walls = GAME_WALLS, bounds = gameStandardZombieBounds(), shouldSeparate = () => true) {
  const next = zombies.map((zombie) => ({ ...zombie }));
  for (let pass = 0; pass < 3; pass += 1) {
    for (let i = 0; i < next.length; i += 1) {
      const a = next[i];
      if (!a.alive || !shouldSeparate(a)) continue;
      for (let j = i + 1; j < next.length; j += 1) {
        const b = next[j];
        if (!b.alive || !shouldSeparate(b)) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.hypot(dx, dy);
        if (distance >= GAME_ZOMBIE_SEPARATION) continue;
        const angle = distance > 0 ? Math.atan2(dy, dx) : (i + j + 1) * 2.399963;
        const nx = Math.cos(angle);
        const ny = Math.sin(angle);
        const push = (GAME_ZOMBIE_SEPARATION - distance) / 2;
        const ax = a.x - nx * push;
        const ay = a.y - ny * push;
        const bx = b.x + nx * push;
        const by = b.y + ny * push;
        if (!gameZombiePositionBlocked(ax, ay, walls, bounds)) {
          a.x = ax;
          a.y = ay;
        }
        if (!gameZombiePositionBlocked(bx, by, walls, bounds)) {
          b.x = bx;
          b.y = by;
        }
      }
    }
  }
  return next;
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
  if (shotType === "mushroom") queueGameSoundEvent("mushroomFire", { ownerUid: currentUser.uid });
  if (shotType === "pepperoni") queueGameSoundEvent("pepperoniFire", { ownerUid: currentUser.uid });
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
  if (gameViewMode !== "solo") requestGameSharedStateWrite(gameState, {}, now);
}

function gameCurrentShotType(player) {
  if (!player?.alive || player.powerup === "meatball") return "";
  if (player.powerup === "basil") return "basil";
  if (Number(player.pepperoniCount || 0) <= 0) return "";
  if (player.powerup === "mushroom") return "mushroom";
  return "pepperoni";
}

function drawGame(now = Date.now()) {
  const canvas = gameCachedCanvas || document.querySelector("#game-canvas");
  if (!canvas || !gameState) return;
  gameCachedCanvas = canvas;
  if (canvas.width !== GAME_ARENA.width) canvas.width = GAME_ARENA.width;
  if (canvas.height !== GAME_ARENA.height) canvas.height = GAME_ARENA.height;
  const ctx = gameCachedCanvasContext || canvas.getContext("2d");
  gameCachedCanvasContext = ctx;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, GAME_ARENA.width, GAME_ARENA.height);
  ctx.fillStyle = "#fff0d2";
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
    const text = gameSurvivalOverlayText(gameState.solo, now);
    if (text) drawGameCountdownOverlay(ctx, text);
    hideGameArenaStatus();
    if (gameState.solo?.gameOver) updateGameModePanels();
    renderSurvivalHud();
    renderAmmoDisplay(now);
    return;
  }

  const match = gameState.match || defaultGameMatchState();
  if (gameMatchFrozen(match, now)) {
    showGameArenaStatus(gameMatchTimerText(match, now));
    drawGameCountdownOverlay(ctx, gameCountdownText(match, now));
  } else if (match.status === "active") {
    showGameArenaStatus(gameMatchTimerText(match, now));
  } else if (match.status === "ended") {
    showGameArenaStatus("Match complete");
    updateGameModePanels();
  } else if (gameLocalPlayer && !gameLocalPlayer.alive) {
    showGameArenaStatus("Respawning...");
  } else if (document.querySelector("#game-connection-status")?.textContent === "Online") {
    hideGameArenaStatus();
  }
  renderMatchLeaderboard();
  renderAmmoDisplay(now);
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
  ctx.fillStyle = "rgba(52, 23, 53, 0.18)";
  ctx.fillRect(0, 0, GAME_ARENA.width, GAME_ARENA.height);
  ctx.font = "950 150px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 12;
  ctx.strokeStyle = "rgba(52, 23, 53, 0.68)";
  ctx.fillStyle = "#fff7ea";
  ctx.shadowColor = "rgba(52, 23, 53, 0.38)";
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
    const rows = padGameScoreRows(isFreeplay ? gameFreeplayRows(arena) : matchRows, isFreeplay ? 2 : 5);
    const signature = `${gameViewMode}|${rows.map((row) => `${row.uid || ""}:${row.name || ""}:${Number(row.xp || 0)}`).join("|")}`;
    if (liveList.dataset.scoreSignature !== signature) {
      liveList.dataset.scoreSignature = signature;
      updateMatchListRows(liveList, rows);
    }
    liveList.classList.toggle("freeplay-summary", isFreeplay);
  }
  if (finalList) {
    const rows = padGameScoreRows(matchRows, 5);
    const signature = rows.map((row) => `${row.uid || ""}:${row.name || ""}:${Number(row.xp || 0)}`).join("|");
    finalList.classList.remove("freeplay-summary");
    if (finalList.dataset.scoreSignature !== signature) {
      finalList.dataset.scoreSignature = signature;
      updateMatchListRows(finalList, rows);
    }
  }
}

function renderGameRecords() {
  const arena = normalizeGame(familyData?.gameArena || gameState);
  updateRecordList(document.querySelector("#freeplay-records-list"), arena.records.freeplay || [], "freeplay");
  updateRecordList(document.querySelector("#match-records-list"), arena.records.matches || [], "matches");
}

function updateRecordList(list, rows, key = "") {
  if (!list) return;
  const paddedRows = padGameScoreRows(rows, 3);
  const signature = `${key}|${paddedRows.map((row) => `${row.uid || ""}:${row.name || ""}:${Number(row.xp || 0)}`).join("|")}`;
  if (list.dataset.scoreSignature === signature) return;
  list.dataset.scoreSignature = signature;
  list.replaceChildren(...paddedRows.map((row, index) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <span class="match-place">${index + 1}</span>
      <strong>${row.uid ? escapeHtml(row.name || "Player") : ""}</strong>
      <span>${row.uid ? `${Number(row.xp || 0)} XP` : ""}</span>
    `;
    return item;
  }));
}

function renderAmmoDisplay(now = Date.now()) {
  const display = document.querySelector("#ammo-display");
  const icon = document.querySelector("#ammo-icon");
  const count = document.querySelector("#ammo-count");
  if (!display || !icon || !count) return;
  const player = gameLocalPlayer;
  const visible = Boolean(player && gameViewMode !== "menu" && !gameSpectating);
  display.hidden = !visible;
  if (!visible) return;
  normalizeGamePlayerPowerup(player, now);
  const ammo = gameAmmoInfo(player);
  const flashAlpha = ammo.flashes ? gameExpiringFlashAlpha(player.powerupUntil, GAME_POWERUP_FLASH_MS, now) : 1;
  const iconOpacity = String(ammo.iconFlashes ? flashAlpha : 1);
  const labelOpacity = String(ammo.labelFlashes ? flashAlpha : 1);
  const signature = `${ammo.iconType}|${ammo.label}|${iconOpacity}|${labelOpacity}`;
  if (display.dataset.ammoSignature === signature) return;
  display.dataset.ammoSignature = signature;
  count.textContent = ammo.label;
  icon.style.opacity = String(ammo.iconFlashes ? flashAlpha : 1);
  count.style.opacity = String(ammo.labelFlashes ? flashAlpha : 1);
  if (icon.dataset.iconType !== ammo.iconType) {
    icon.dataset.iconType = ammo.iconType;
    drawGameAmmoIcon(icon, ammo.iconType);
  }
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
  const signature = `${visible}|${lives}|${Number(solo.wave || 1)}`;
  if (livesEl.dataset.survivalSignature === signature) return;
  livesEl.dataset.survivalSignature = signature;
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
  ctx.strokeStyle = "rgba(52, 23, 53, 0.08)";
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
  ctx.fillStyle = "#f5d79f";
  ctx.strokeStyle = "#c8874a";
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
    drawGamePlayerLabel(ctx, player.name || "Player", player.x, player.y - GAME_MEATBALL_SIZE / 2 - 10);
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

  drawGamePlayerLabel(ctx, player.name || "Player", player.x, player.y - radius - 10);
  ctx.restore();
}

function drawGamePlayerLabel(ctx, text, x, y) {
  ctx.save();
  ctx.font = "950 16px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(255, 250, 240, 0.96)";
  ctx.fillStyle = "#341735";
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
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
  unlockGameAudio();
  event.currentTarget?.setPointerCapture?.(event.pointerId);
  gameFireHeld = true;
  startGameBasilFireSound();
  shootGamePizza();
}

function stopGameFire(event) {
  event?.currentTarget?.releasePointerCapture?.(event.pointerId);
  if (gameFireHeld && gameLocalPlayer?.powerup === "basil") stopGameBasilFireSound();
  gameFireHeld = false;
}

function handleGameJoystick(event) {
  unlockGameAudio();
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
  unlockGameAudio();
  if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") gameKeyboardInput.up = true;
  if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") gameKeyboardInput.down = true;
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") gameKeyboardInput.left = true;
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") gameKeyboardInput.right = true;
  if (event.key === " ") {
    event.preventDefault();
    if (!gameFireHeld) {
      gameFireHeld = true;
      startGameBasilFireSound();
    }
    shootGamePizza();
  }
}

function handleGameKeyUp(event) {
  if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") gameKeyboardInput.up = false;
  if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") gameKeyboardInput.down = false;
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") gameKeyboardInput.left = false;
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") gameKeyboardInput.right = false;
  if (event.key === " ") stopGameFire();
}

function setGameStatus(text, online) {
  const statusPill = document.querySelector("#game-connection-status");
  if (!statusPill) return;
  if (statusPill.textContent !== text) statusPill.textContent = text;
  if (statusPill.classList.contains("online") !== Boolean(online)) {
    statusPill.classList.toggle("online", online);
  }
  if (online) hideGameArenaStatus();
  else showGameArenaStatus(text);
}

function showGameArenaStatus(text) {
  const arenaStatus = document.querySelector("#arena-status");
  if (!arenaStatus) return;
  if (arenaStatus.textContent !== text) arenaStatus.textContent = text;
  if (arenaStatus.hidden) arenaStatus.hidden = false;
}

function hideGameArenaStatus() {
  const arenaStatus = document.querySelector("#arena-status");
  if (arenaStatus && !arenaStatus.hidden) arenaStatus.hidden = true;
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
  stopAllGameSounds();
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
  gamePlayedSoundEventIds = new Set();
  gameSyncInFlight = false;
  gameSharedWriteInFlight = false;
  gameLastSharedWriteAt = 0;
  gameCachedCanvas = null;
  gameCachedCanvasContext = null;
  gameLastModePanelSignature = "";
  stopAllGameSounds();
}

function preventGamePageDrag(event) {
  if (document.body.classList.contains("game-active")) event.preventDefault();
}

function setHomeScreenActive(active) {
  document.documentElement.classList.toggle("home-active-root", active);
  document.body.classList.toggle("home-active", active);
}

function cleanupGameArenaListener() {
  if (unsubscribeGameArena) unsubscribeGameArena();
  unsubscribeGameArena = null;
}

function gameArenaRef() {
  return services.rtdbFns.ref(services.rtdb, `families/${activeFamilyId || LEGACY_FAMILY_ID}/gameArena`);
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

function wheelMovieSignature() {
  return activeMovies().map((movie) => `${movie.id}:${movie.title}`).join("|");
}

function animateWheelCutter() {
  if (wheelCutterAnimationId) cancelAnimationFrame(wheelCutterAnimationId);
  const start = performance.now();
  const duration = 1050;

  function animate(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    drawWheel(0, eased);
    if (progress < 1) {
      wheelCutterAnimationId = requestAnimationFrame(animate);
      return;
    }
    wheelCutterAnimationId = null;
    drawWheel();
  }

  wheelCutterAnimationId = requestAnimationFrame(animate);
}

function drawWheel(rotation = 0, cutterProgress = 0) {
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
    drawPizzaBase(ctx, radius, 0);
    ctx.fillStyle = "#341735";
    ctx.font = "900 44px 'Baloo 2', system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Pizza empty", 0, -10);
    ctx.font = "800 27px 'Nunito', system-ui";
    ctx.fillText("Add the next picks", 0, 42);
    ctx.restore();
    return;
  }

  const slice = (Math.PI * 2) / movies.length;
  drawPizzaBase(ctx, radius);
  if (movies.length > 1) {
    movies.forEach((movie, index) => {
      const start = index * slice;
      const end = (index + 1) * slice;
      drawPizzaSlice(ctx, radius, start, end, index);
    });

    movies.forEach((movie, index) => {
      const dividerProgress = cutterProgress ? Math.min(1, Math.max(0.25, cutterProgress + index * 0.08)) : 1;
      const angle = index * slice;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 52, Math.sin(angle) * 52);
      ctx.lineTo(Math.cos(angle) * radius * 0.88 * dividerProgress, Math.sin(angle) * radius * 0.88 * dividerProgress);
      ctx.strokeStyle = "rgba(126, 70, 30, 0.56)";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.stroke();
    });
  }

  drawWheelToppings(ctx, radius, movies.length);

  movies.forEach((movie, index) => {
    ctx.save();
    if (movies.length > 1) {
      ctx.rotate(index * slice + slice / 2);
      ctx.translate(radius * 0.64, 0);
    } else {
      ctx.translate(0, -radius * 0.48);
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#341735";
    ctx.strokeStyle = "rgba(255, 247, 231, 0.82)";
    ctx.lineWidth = 6;
    ctx.font = `900 ${movies.length > 6 ? 27 : movies.length === 1 ? 42 : 34}px 'Baloo 2', system-ui`;
    wrapCanvasText(ctx, movie.title, 0, movies.length === 1 ? 0 : -20, Math.min(movies.length === 1 ? 420 : 255, radius * 0.78), movies.length > 6 ? 30 : 39);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(0, 0, 55, 0, Math.PI * 2);
  ctx.fillStyle = "#341735";
  ctx.fill();
  ctx.strokeStyle = "#fff7e7";
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.fillStyle = "#fff7e7";
  ctx.font = "900 22px 'Baloo 2', system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SPIN", 0, 2);
  ctx.restore();
  if (cutterProgress) drawPizzaCutter(ctx, canvas, cutterProgress);
}

function drawPizzaBase(ctx, radius) {
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#c77732";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.94, 0, Math.PI * 2);
  ctx.fillStyle = "#f6a43a";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.88, 0, Math.PI * 2);
  ctx.fillStyle = "#f0443e";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.82, 0, Math.PI * 2);
  ctx.fillStyle = "#ffd45a";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "#8c4d1d";
  ctx.lineWidth = 14;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.835, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 248, 213, 0.82)";
  ctx.lineWidth = 6;
  ctx.stroke();

}

function drawPizzaSlice(ctx, radius, start, end, index) {
  const cheeseColors = ["#ffd35b", "#ffe07a", "#ffc94d", "#ffda70"];
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, radius * 0.82, start, end);
  ctx.closePath();
  ctx.fillStyle = cheeseColors[index % cheeseColors.length];
  ctx.fill();
}

function drawWheelToppings(ctx, radius, movieCount) {
  const toppings = [
    [-0.52, -0.55, 0.06, "pepperoni"],
    [-0.15, -0.7, 0.04, "basil"],
    [0.26, -0.59, 0.066, "pepperoni"],
    [0.61, -0.28, 0.052, "pepperoni"],
    [-0.64, -0.12, 0.044, "basil"],
    [-0.35, 0.08, 0.064, "pepperoni"],
    [0.15, -0.08, 0.056, "pepperoni"],
    [0.42, 0.14, 0.043, "basil"],
    [-0.52, 0.43, 0.055, "pepperoni"],
    [-0.08, 0.58, 0.048, "pepperoni"],
    [0.35, 0.48, 0.062, "pepperoni"],
    [0.64, 0.34, 0.04, "basil"],
    [0.05, 0.31, 0.038, "olive"],
    [-0.2, -0.35, 0.035, "olive"],
    [0.49, -0.52, 0.034, "olive"]
  ];
  const visibleCount = Math.min(toppings.length, movieCount === 1 ? 12 : Math.max(10, movieCount * 4));
  toppings.slice(0, visibleCount).forEach(([x, y, sizeRatio, type]) => {
    const px = x * radius;
    const py = y * radius;
    const size = sizeRatio * radius;
    if (type === "basil") drawWheelBasil(ctx, px, py, size);
    else if (type === "olive") drawWheelOlive(ctx, px, py, size);
    else drawWheelPepperoni(ctx, px, py, size);
  });
}

function drawWheelPepperoni(ctx, x, y, radius) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#d9342d";
  ctx.fill();
  ctx.strokeStyle = "#8b221d";
  ctx.lineWidth = 3;
  ctx.stroke();
  [
    [-radius * 0.32, -radius * 0.12],
    [radius * 0.2, -radius * 0.25],
    [radius * 0.24, radius * 0.26],
    [-radius * 0.16, radius * 0.32]
  ].forEach(([dotX, dotY]) => {
    ctx.beginPath();
    ctx.arc(dotX, dotY, Math.max(2, radius * 0.12), 0, Math.PI * 2);
    ctx.fillStyle = "rgba(118, 25, 21, 0.34)";
    ctx.fill();
  });
  ctx.restore();
}

function drawWheelBasil(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.62);
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.48, size * 0.9, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#3f9a56";
  ctx.fill();
  ctx.strokeStyle = "#257342";
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();
}

function drawWheelOlive(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fillStyle = "#34203d";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.48, 0, Math.PI * 2);
  ctx.fillStyle = "#ffd45a";
  ctx.fill();
  ctx.restore();
}

function drawPizzaCutter(ctx, canvas, progress) {
  const eased = 1 - Math.pow(1 - progress, 3);
  const x = -90 + (canvas.width + 180) * eased;
  const y = canvas.height * 0.2 + Math.sin(progress * Math.PI) * 28;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.48);
  ctx.globalAlpha = progress < 0.9 ? 1 : Math.max(0, 1 - (progress - 0.9) / 0.1);
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(30, 0);
  ctx.lineTo(122, -2);
  ctx.strokeStyle = "#341735";
  ctx.lineWidth = 16;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(116, -2);
  ctx.lineTo(158, -2);
  ctx.strokeStyle = "#ff8b4d";
  ctx.lineWidth = 18;
  ctx.stroke();

  ctx.save();
  ctx.rotate(progress * Math.PI * 8);
  ctx.beginPath();
  ctx.arc(0, 0, 34, 0, Math.PI * 2);
  ctx.fillStyle = "#f8efe0";
  ctx.fill();
  ctx.strokeStyle = "#341735";
  ctx.lineWidth = 6;
  ctx.stroke();
  for (let index = 0; index < 6; index += 1) {
    const angle = index * Math.PI / 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * 28, Math.sin(angle) * 28);
    ctx.strokeStyle = "rgba(52, 23, 53, 0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.restore();

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
  const familyRef = familyStateRef();
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
  if (wheelCutterAnimationId) {
    cancelAnimationFrame(wheelCutterAnimationId);
    wheelCutterAnimationId = null;
  }

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

function showClearWheelOverlay() {
  if (!activeMovies().length || document.querySelector(".clear-wheel-modal")) return;
  const overlay = document.createElement("section");
  overlay.className = "ranking-modal clear-wheel-modal";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "clear-wheel-title");
  overlay.innerHTML = `
    <form class="ranking-modal-card clear-wheel-card">
      <p class="eyebrow">Wheel reset</p>
      <h2 id="clear-wheel-title">Enter the family password</h2>
      <p class="helper-text">This keeps the current wheel from being cleared by accident.</p>
      <label>
        Family password
        <input id="clear-wheel-password" type="password" autocomplete="current-password" placeholder="Family password" />
      </label>
      <p id="clear-wheel-note" class="helper-text" aria-live="polite"></p>
      <div class="modal-actions">
        <button class="secondary-action" type="button" data-clear-cancel>Cancel</button>
        <button class="primary-action" type="submit" data-clear-submit disabled>Clear Wheel</button>
      </div>
    </form>
  `;
  const input = overlay.querySelector("#clear-wheel-password");
  const submit = overlay.querySelector("[data-clear-submit]");
  const note = overlay.querySelector("#clear-wheel-note");
  const close = () => overlay.remove();
  overlay.querySelector("[data-clear-cancel]").addEventListener("click", close);
  input.addEventListener("input", () => {
    const matches = input.value === familyClearPassword();
    submit.disabled = !matches;
    note.textContent = input.value && !matches ? "That password does not match." : "";
  });
  overlay.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (input.value !== familyClearPassword()) return;
    const confirmed = await showAppConfirm({
      title: "Are you sure you want to clear the wheel?",
      message: "This removes every movie from the current wheel and starts a fresh round.",
      confirmText: "Clear Wheel",
      cancelText: "Keep Wheel"
    });
    if (!confirmed) return;
    close();
    await clearWheel();
  });
  document.body.append(overlay);
  input.focus();
}

async function clearWheel() {
  pendingWinner = null;
  const patch = {
    movies: [],
    roundPicks: {},
    spinReady: {},
    spinState: null,
    round: (familyData.round || 1) + 1
  };
  await saveFamily(patch);
  familyData = { ...familyData, ...patch };
  renderWheelPage();
}

function showAppConfirm({ title, message, confirmText = "Confirm", cancelText = "Cancel" }) {
  return new Promise((resolve) => {
    const overlay = document.createElement("section");
    overlay.className = "ranking-modal app-confirm-modal";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "app-confirm-title");
    overlay.innerHTML = `
      <div class="ranking-modal-card app-confirm-card">
        <p class="eyebrow">Please confirm</p>
        <h2 id="app-confirm-title">${escapeHtml(title)}</h2>
        <p class="helper-text">${escapeHtml(message)}</p>
        <div class="modal-actions">
          <button class="secondary-action" type="button" data-confirm-cancel>${escapeHtml(cancelText)}</button>
          <button class="primary-action" type="button" data-confirm-submit>${escapeHtml(confirmText)}</button>
        </div>
      </div>
    `;
    const finish = (value) => {
      overlay.remove();
      resolve(value);
    };
    overlay.querySelector("[data-confirm-cancel]").addEventListener("click", () => finish(false));
    overlay.querySelector("[data-confirm-submit]").addEventListener("click", () => finish(true));
    document.body.append(overlay);
    overlay.querySelector("[data-confirm-cancel]").focus();
  });
}

async function saveFamily(patch) {
  const nextData = { ...familyData, ...patch, updatedAt: Date.now() };
  if (!FIREBASE_READY) {
    demoStore.write(nextData);
    return;
  }
  await services.dbFns.setDoc(familyStateRef(), {
    ...patch,
    updatedAt: services.dbFns.serverTimestamp()
  }, { merge: true });
}

function defaultFamilyData(familyId = activeFamilyId || LEGACY_FAMILY_ID, familyProfile = activeFamilyProfile) {
  return {
    id: familyId,
    familyId,
    name: familyDisplayName(familyProfile),
    familyDisplayName: familyDisplayName(familyProfile),
    joinCode: LEGACY_FAMILY_PASSWORD,
    round: 1,
    members: {},
    movies: [],
    roundPicks: {},
    spinReady: {},
    spinState: null,
    gameArena: defaultGameState(),
    movieList: [
      { id: crypto.randomUUID(), imdbID: "tt4633694", title: "Spider-Man: Into the Spider-Verse", suggestedBy: "Family", suggestedByUid: "seed", createdAt: Date.now() - 5000 },
      { id: crypto.randomUUID(), imdbID: "tt0093779", title: "The Princess Bride", suggestedBy: "Family", suggestedByUid: "seed", createdAt: Date.now() - 4000 },
      { id: crypto.randomUUID(), imdbID: "tt0097814", title: "Kiki's Delivery Service", suggestedBy: "Family", suggestedByUid: "seed", createdAt: Date.now() - 3000 }
    ],
    history: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

function firebaseFamilyData() {
  return {
    ...defaultFamilyData(activeFamilyId, activeFamilyProfile),
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

function familyStateRef() {
  return services.dbFns.doc(services.db, APP_STATE_COLLECTION, activeFamilyId || LEGACY_FAMILY_ID);
}

function familyDisplayName(familyProfile = activeFamilyProfile || familyData || {}) {
  return (
    familyProfile?.familyDisplayName ||
    familyProfile?.displayName ||
    familyProfile?.name ||
    "The Ingram Family"
  );
}

function familyClearPassword() {
  return familyData?.joinCode || activeFamilyProfile?.familyCode || activeFamilyProfile?.inviteCode || LEGACY_FAMILY_PASSWORD;
}

function isLegacyFamilyPassword(value) {
  return String(value || "").trim().replace(/\s+/g, "").toLowerCase() === LEGACY_FAMILY_PASSWORD.toLowerCase();
}

function isRulesBlockedError(error) {
  const code = error?.code || "";
  const message = error?.message || String(error || "");
  return code.includes("permission-denied") || message.toLowerCase().includes("permission");
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
          <img src="assets/pizza-logo.png" alt="" />
        </button>
      `);
      header.querySelector(".home-logo-button").addEventListener("click", () => navigate("home"));
    }
    if (!header.querySelector(".family-title")) {
      slot.insertAdjacentHTML("beforebegin", `<div class="family-title">${escapeHtml(familyDisplayName())}</div>`);
    } else {
      header.querySelector(".family-title").textContent = familyDisplayName();
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
  if (FIREBASE_READY && services?.auth && services?.authFns) {
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
  const message = error?.message || String(error || "");
  if (code.includes("email-already-in-use")) return "That email already has an account. Try signing in.";
  if (code.includes("invalid-credential") || code.includes("wrong-password")) return "The email or password did not match.";
  if (code.includes("user-not-found")) return "No account was found for that email.";
  if (code.includes("weak-password")) return "Use an account password with at least 6 characters.";
  if (code.includes("invalid-email")) return "Enter a valid email address.";
  if (code.includes("operation-not-allowed")) return "Email/password sign-in needs to be enabled in Firebase Authentication.";
  if (code.includes("permission-denied")) return "Firebase rules blocked that action. Check firebase.rules.";
  if (message.includes("services.authFns") || message.includes("Failed to fetch dynamically imported module")) {
    return "Firebase did not finish loading. Check your connection, then close and reopen the app.";
  }
  return message || "Something went wrong.";
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
