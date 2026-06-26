import { firebaseConfig } from "./firebase-config.js";

const FAMILY_ID = "pizza-movie-night";
const ARENA = { width: 960, height: 620 };
const PLAYER_SIZE = 22;
const PLAYER_SPEED = 235;
const PIZZA_SPEED = 520;
const PIZZA_LIFE_MS = 1300;
const RESPAWN_MS = 2600;
const OBSTACLE_INTERVAL_MS = 18000;
const HEARTBEAT_MS = 120;
const STALE_PLAYER_MS = 6000;

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");
const overlay = document.querySelector("#game-overlay");
const statusPill = document.querySelector("#connection-status");
const playerCount = document.querySelector("#player-count");
const playerStatus = document.querySelector("#player-status");
const shootButton = document.querySelector("#shoot-button");
const moveButtons = [...document.querySelectorAll("[data-move]")];

let auth = null;
let db = null;
let dbFns = null;
let user = null;
let familyRef = null;
let unsubscribe = null;
let game = defaultGameState();
let localPlayer = null;
let input = { up: false, down: false, left: false, right: false };
let aim = { x: 1, y: 0 };
let lastFrame = performance.now();
let lastHeartbeat = 0;
let lastShotAt = 0;
let demoMode = false;

start();

async function start() {
  try {
    const firebaseApp = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
    const firebaseAuth = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js");
    const firestore = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js");
    const app = firebaseApp.initializeApp(firebaseConfig);
    auth = firebaseAuth.getAuth(app);
    db = firestore.getFirestore(app);
    dbFns = firestore;
    familyRef = firestore.doc(db, "families", FAMILY_ID);

    firebaseAuth.onAuthStateChanged(auth, async (nextUser) => {
      user = nextUser;
      if (!user) {
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
          startDemoMode();
          return;
        }
        setStatus("Sign in first", false);
        overlay.hidden = false;
        shootButton.disabled = true;
        return;
      }
      await joinGame();
    });
  } catch (error) {
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      startDemoMode();
      return;
    }
    overlay.hidden = false;
    overlay.querySelector("p").textContent = error.message || "The test game could not load.";
  }
}

function startDemoMode() {
  demoMode = true;
  user = { uid: "local-demo-player", displayName: "Demo" };
  game = defaultGameState();
  localPlayer = createPlayer();
  game.players[user.uid] = localPlayer;
  overlay.hidden = true;
  shootButton.disabled = false;
  setStatus("Demo", true);
  requestAnimationFrame(tick);
}

async function joinGame() {
  setStatus("Joining", false);
  overlay.hidden = true;
  shootButton.disabled = false;
  const snap = await dbFns.getDoc(familyRef);
  const existing = snap.exists() ? snap.data().gameArena : null;
  const next = normalizeGame(existing);
  const player = createPlayer();
  await dbFns.updateDoc(familyRef, {
    gameArena: {
      ...next,
      players: {
        ...next.players,
        [user.uid]: player
      },
      updatedAt: Date.now()
    }
  });
  localPlayer = player;
  unsubscribe?.();
  unsubscribe = dbFns.onSnapshot(familyRef, (nextSnap) => {
    game = normalizeGame(nextSnap.data()?.gameArena);
    localPlayer = game.players[user.uid] || localPlayer;
    setStatus("Online", true);
  });
  requestAnimationFrame(tick);
}

function defaultGameState() {
  return {
    players: {},
    projectiles: {},
    walls: buildObstacles(Date.now(), "wall"),
    hazards: buildObstacles(Date.now() + 4, "hazard"),
    obstacleSeed: Date.now(),
    lastObstacleShift: Date.now(),
    updatedAt: Date.now()
  };
}

function normalizeGame(value) {
  const fallback = defaultGameState();
  return {
    ...fallback,
    ...(value || {}),
    players: value?.players || {},
    projectiles: value?.projectiles || {},
    walls: value?.walls || fallback.walls,
    hazards: value?.hazards || fallback.hazards
  };
}

function createPlayer() {
  const spawn = randomSpawn();
  return {
    uid: user.uid,
    name: user.displayName || user.email?.split("@")[0] || "Player",
    color: colorFromUid(user.uid),
    x: spawn.x,
    y: spawn.y,
    aimX: 1,
    aimY: 0,
    alive: true,
    deadUntil: 0,
    lastSeen: Date.now()
  };
}

function tick(now) {
  const dt = Math.min(0.04, (now - lastFrame) / 1000);
  lastFrame = now;
  updateLocal(dt, now);
  draw();
  requestAnimationFrame(tick);
}

function updateLocal(dt, now) {
  if (!user || !localPlayer) return;
  const player = { ...localPlayer };
  if (player.deadUntil && now >= player.deadUntil) {
    const spawn = randomSpawn();
    player.x = spawn.x;
    player.y = spawn.y;
    player.alive = true;
    player.deadUntil = 0;
  }

  if (player.alive) {
    const vector = inputVector();
    if (vector.x || vector.y) {
      aim = vector;
      player.aimX = vector.x;
      player.aimY = vector.y;
      const next = moveWithWalls(player.x, player.y, vector.x * PLAYER_SPEED * dt, vector.y * PLAYER_SPEED * dt);
      player.x = next.x;
      player.y = next.y;
    }
  }

  player.lastSeen = Date.now();
  localPlayer = player;
  if (now - lastHeartbeat > HEARTBEAT_MS) {
    lastHeartbeat = now;
    syncLocalPlayer(now);
  }
}

async function syncLocalPlayer(now) {
  const nextGame = normalizeGame(game);
  const projectiles = pruneProjectiles(nextGame.projectiles, now);
  const players = prunePlayers({ ...nextGame.players, [user.uid]: localPlayer });
  resolveHits(players, projectiles, now);

  const shiftObstacles = now - (nextGame.lastObstacleShift || 0) > OBSTACLE_INTERVAL_MS;
  const patch = {
    "gameArena.players": players,
    "gameArena.projectiles": projectiles,
    "gameArena.updatedAt": Date.now()
  };
  if (shiftObstacles) {
    patch["gameArena.walls"] = buildObstacles(now, "wall");
    patch["gameArena.hazards"] = buildObstacles(now + 7, "hazard");
    patch["gameArena.lastObstacleShift"] = Date.now();
    patch["gameArena.obstacleSeed"] = Date.now();
  }
  if (demoMode) {
    game = {
      ...nextGame,
      players,
      projectiles,
      walls: shiftObstacles ? patch["gameArena.walls"] : nextGame.walls,
      hazards: shiftObstacles ? patch["gameArena.hazards"] : nextGame.hazards,
      lastObstacleShift: shiftObstacles ? Date.now() : nextGame.lastObstacleShift,
      updatedAt: Date.now()
    };
    localPlayer = game.players[user.uid];
    return;
  }
  await dbFns.updateDoc(familyRef, patch).catch(() => {});
}

function resolveHits(players, projectiles, now) {
  Object.values(projectiles).forEach((shot) => {
    Object.values(players).forEach((player) => {
      if (!player.alive || player.uid === shot.ownerUid) return;
      if (distance(player.x, player.y, shot.x, shot.y) < PLAYER_SIZE) {
        player.alive = false;
        player.deadUntil = now + RESPAWN_MS;
        delete projectiles[shot.id];
      }
    });
  });

  Object.values(players).forEach((player) => {
    if (!player.alive) return;
    if (game.hazards.some((hazard) => circleRectHit(player.x, player.y, PLAYER_SIZE / 2, hazard))) {
      player.alive = false;
      player.deadUntil = now + RESPAWN_MS;
    }
  });
}

function prunePlayers(players) {
  const now = Date.now();
  return Object.fromEntries(Object.entries(players).filter(([, player]) => now - (player.lastSeen || 0) < STALE_PLAYER_MS));
}

function pruneProjectiles(projectiles, now) {
  const next = {};
  Object.values(projectiles).forEach((shot) => {
    const age = now - shot.createdAt;
    if (age > PIZZA_LIFE_MS) return;
    next[shot.id] = {
      ...shot,
      x: shot.x + shot.vx * (HEARTBEAT_MS / 1000),
      y: shot.y + shot.vy * (HEARTBEAT_MS / 1000)
    };
  });
  return next;
}

function shoot() {
  const now = Date.now();
  if (!user || !localPlayer?.alive || now - lastShotAt < 430) return;
  lastShotAt = now;
  const shotId = `${user.uid}-${now}`;
  const mag = Math.hypot(aim.x, aim.y) || 1;
  const vx = (aim.x / mag) * PIZZA_SPEED;
  const vy = (aim.y / mag) * PIZZA_SPEED;
  const shot = {
    id: shotId,
    ownerUid: user.uid,
    x: localPlayer.x + (aim.x / mag) * 24,
    y: localPlayer.y + (aim.y / mag) * 24,
    vx,
    vy,
    createdAt: now
  };
  if (demoMode) {
    game.projectiles[shotId] = shot;
    return;
  }
  dbFns.updateDoc(familyRef, {
    [`gameArena.projectiles.${shotId}`]: shot
  }).catch(() => {});
}

function draw() {
  const scale = Math.min(canvas.clientWidth / ARENA.width, canvas.clientHeight / ARENA.height) || 1;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, ARENA.width, ARENA.height);

  ctx.fillStyle = "#15131f";
  ctx.fillRect(0, 0, ARENA.width, ARENA.height);
  drawGrid();
  game.walls.forEach(drawWall);
  game.hazards.forEach(drawHazard);
  Object.values(game.projectiles).forEach(drawPizzaShot);
  Object.values(game.players).forEach(drawPlayer);

  const living = Object.values(game.players).filter((player) => player.alive).length;
  playerCount.textContent = `${Object.keys(game.players).length} online`;
  playerStatus.textContent = localPlayer?.alive ? `${living} still standing` : "Respawning...";
}

function drawGrid() {
  ctx.strokeStyle = "rgba(255, 244, 223, 0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= ARENA.width; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, ARENA.height);
    ctx.stroke();
  }
  for (let y = 0; y <= ARENA.height; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(ARENA.width, y);
    ctx.stroke();
  }
}

function drawWall(wall) {
  ctx.fillStyle = "#4e4762";
  ctx.strokeStyle = "#9387b4";
  ctx.lineWidth = 3;
  roundRect(wall.x, wall.y, wall.w, wall.h, 8);
  ctx.fill();
  ctx.stroke();
}

function drawHazard(hazard) {
  ctx.fillStyle = "rgba(239, 71, 111, 0.78)";
  ctx.strokeStyle = "#ff9cb5";
  ctx.lineWidth = 3;
  roundRect(hazard.x, hazard.y, hazard.w, hazard.h, 8);
  ctx.fill();
  ctx.stroke();
}

function drawPlayer(player) {
  ctx.save();
  ctx.globalAlpha = player.alive ? 1 : 0.35;
  ctx.fillStyle = player.color;
  ctx.strokeStyle = "#fff4df";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(player.x, player.y, PLAYER_SIZE / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#111019";
  ctx.font = "900 11px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText((player.name || "?").slice(0, 1).toUpperCase(), player.x, player.y + 0.5);
  ctx.fillStyle = "#fff4df";
  ctx.font = "800 12px system-ui";
  ctx.fillText(player.name || "Player", player.x, player.y - 22);
  ctx.restore();
}

function drawPizzaShot(shot) {
  ctx.save();
  ctx.translate(shot.x, shot.y);
  ctx.rotate(Math.atan2(shot.vy, shot.vx));
  ctx.fillStyle = "#ffc83d";
  ctx.strokeStyle = "#5b2b17";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-10, -8);
  ctx.lineTo(12, 0);
  ctx.lineTo(-10, 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#d93d3d";
  ctx.beginPath();
  ctx.arc(-3, 0, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function buildObstacles(seed, type) {
  const rand = seededRandom(seed + (type === "hazard" ? 401 : 0));
  const count = type === "hazard" ? 4 : 7;
  return Array.from({ length: count }, () => ({
    x: 70 + rand() * (ARENA.width - 180),
    y: 70 + rand() * (ARENA.height - 170),
    w: type === "hazard" ? 44 + rand() * 55 : 70 + rand() * 110,
    h: type === "hazard" ? 36 + rand() * 45 : 34 + rand() * 60
  }));
}

function randomSpawn() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const x = 38 + Math.random() * (ARENA.width - 76);
    const y = 38 + Math.random() * (ARENA.height - 76);
    const blocked = [...game.walls, ...game.hazards].some((rect) => circleRectHit(x, y, PLAYER_SIZE, rect));
    if (!blocked) return { x, y };
  }
  return { x: 60, y: 60 };
}

function inputVector() {
  const x = Number(input.right) - Number(input.left);
  const y = Number(input.down) - Number(input.up);
  const mag = Math.hypot(x, y) || 1;
  return { x: x / mag, y: y / mag };
}

function moveWithWalls(x, y, dx, dy) {
  let nextX = clamp(x + dx, PLAYER_SIZE, ARENA.width - PLAYER_SIZE);
  let nextY = clamp(y + dy, PLAYER_SIZE, ARENA.height - PLAYER_SIZE);
  if (game.walls.some((wall) => circleRectHit(nextX, y, PLAYER_SIZE / 2, wall))) nextX = x;
  if (game.walls.some((wall) => circleRectHit(nextX, nextY, PLAYER_SIZE / 2, wall))) nextY = y;
  return { x: nextX, y: nextY };
}

function circleRectHit(cx, cy, radius, rect) {
  const nearestX = clamp(cx, rect.x, rect.x + rect.w);
  const nearestY = clamp(cy, rect.y, rect.y + rect.h);
  return distance(cx, cy, nearestX, nearestY) <= radius;
}

function roundRect(x, y, w, h, r) {
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

function seededRandom(seed) {
  let value = Math.sin(seed) * 10000;
  return () => {
    value = Math.sin(value) * 10000;
    return value - Math.floor(value);
  };
}

function colorFromUid(uid) {
  const palette = ["#ff7a59", "#f4c95d", "#3ddc97", "#66d9ef", "#c77dff", "#ef476f"];
  let sum = 0;
  [...uid].forEach((char) => {
    sum += char.charCodeAt(0);
  });
  return palette[sum % palette.length];
}

function setStatus(text, online) {
  statusPill.textContent = text;
  statusPill.classList.toggle("online", online);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distance(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") input.up = true;
  if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") input.down = true;
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") input.left = true;
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") input.right = true;
  if (event.key === " ") {
    event.preventDefault();
    shoot();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") input.up = false;
  if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") input.down = false;
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") input.left = false;
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") input.right = false;
});

shootButton.addEventListener("click", shoot);

moveButtons.forEach((button) => {
  const direction = button.dataset.move;
  const set = (value) => {
    input[direction] = value;
  };
  button.addEventListener("pointerdown", () => set(true));
  button.addEventListener("pointerup", () => set(false));
  button.addEventListener("pointercancel", () => set(false));
  button.addEventListener("pointerleave", () => set(false));
});
