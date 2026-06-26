import { firebaseConfig } from "./firebase-config.js";

const FAMILY_ID = "pizza-movie-night";
const ARENA = { width: 960, height: 620 };
const PLAYER_SIZE = 22;
const PLAYER_SPEED = 235;
const PIZZA_SPEED = 520;
const PIZZA_LIFE_MS = 1300;
const RESPAWN_MS = 2600;
const TOMATO_SIZE = 26;
const TOMATO_SPEED = 95;
const HEARTBEAT_MS = 220;
const STALE_PLAYER_MS = 6000;
const MAZE_WALLS = [
  { x: 0, y: 0, w: 960, h: 24 },
  { x: 0, y: 596, w: 960, h: 24 },
  { x: 0, y: 0, w: 24, h: 620 },
  { x: 936, y: 0, w: 24, h: 620 },
  { x: 120, y: 95, w: 260, h: 30 },
  { x: 520, y: 95, w: 270, h: 30 },
  { x: 210, y: 205, w: 30, h: 220 },
  { x: 360, y: 205, w: 245, h: 30 },
  { x: 720, y: 205, w: 30, h: 225 },
  { x: 96, y: 500, w: 260, h: 30 },
  { x: 468, y: 390, w: 30, h: 145 },
  { x: 590, y: 500, w: 270, h: 30 }
];
const TOMATO_STARTS = [
  { id: "tomato-1", x: 92, y: 82, vx: 1, vy: 0.35 },
  { id: "tomato-2", x: 855, y: 122, vx: -0.85, vy: 0.55 },
  { id: "tomato-3", x: 120, y: 540, vx: 0.75, vy: -0.8 },
  { id: "tomato-4", x: 840, y: 515, vx: -0.7, vy: -0.65 }
];

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");
const overlay = document.querySelector("#game-overlay");
const statusPill = document.querySelector("#connection-status");
const playerCount = document.querySelector("#player-count");
const playerStatus = document.querySelector("#player-status");
const shootButton = document.querySelector("#shoot-button");
const mobileShootButton = document.querySelector("#mobile-shoot-button");
const leaderboardButton = document.querySelector("#leaderboard-button");
const leaderboardPanel = document.querySelector("#leaderboard-panel");
const closeLeaderboardButton = document.querySelector("#close-leaderboard");
const leaderboardList = document.querySelector("#leaderboard-list");
const joystick = document.querySelector("#joystick");
const joystickThumb = document.querySelector("#joystick-thumb");

let auth = null;
let db = null;
let dbFns = null;
let user = null;
let familyRef = null;
let unsubscribe = null;
let game = defaultGameState();
let localPlayer = null;
let input = { x: 0, y: 0 };
let keyboardInput = { up: false, down: false, left: false, right: false };
let aim = { x: 1, y: 0 };
let lastFrame = performance.now();
let lastHeartbeat = 0;
let lastShotAt = 0;
let demoMode = false;
let remoteProjectiles = {};

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
  const leaderboard = ensureLeaderboardEntry(next.leaderboard, player);
  await dbFns.updateDoc(familyRef, {
    gameArena: {
      ...next,
      players: {
        ...next.players,
        [user.uid]: player
      },
      leaderboard,
      updatedAt: Date.now()
    }
  });
  localPlayer = player;
  unsubscribe?.();
  unsubscribe = dbFns.onSnapshot(familyRef, (nextSnap) => {
    const remoteGame = normalizeGame(nextSnap.data()?.gameArena);
    const ownPlayer = localPlayer || remoteGame.players[user.uid];
    const players = {
      ...remoteGame.players,
      ...(ownPlayer ? { [user.uid]: ownPlayer } : {})
    };
    remoteProjectiles = remoteGame.projectiles;
    game = {
      ...remoteGame,
      players,
      projectiles: mergeProjectiles(remoteGame.projectiles, game.projectiles)
    };
    localPlayer = ownPlayer;
    setStatus("Online", true);
  });
  requestAnimationFrame(tick);
}

function defaultGameState() {
  return {
    players: {},
    projectiles: {},
    walls: MAZE_WALLS,
    tomatoes: TOMATO_STARTS.map((tomato) => ({ ...tomato })),
    leaderboard: {},
    killLog: [],
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
    walls: MAZE_WALLS,
    tomatoes: value?.tomatoes || fallback.tomatoes,
    leaderboard: value?.leaderboard || {},
    killLog: value?.killLog || []
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
  updateLocal(dt, Date.now());
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

  player.lastSeen = now;
  const projectiles = pruneProjectiles(moveProjectiles(game.projectiles, dt, now), now);
  const tomatoes = moveTomatoes(game.tomatoes, dt);
  const players = { ...game.players, [user.uid]: player };
  const leaderboard = ensureLeaderboardEntry(game.leaderboard, player);
  const nextKillLog = [...(game.killLog || [])];
  resolveHits(players, projectiles, tomatoes, leaderboard, nextKillLog, now);
  game = {
    ...game,
    players,
    projectiles,
    tomatoes,
    leaderboard,
    killLog: nextKillLog.slice(-20),
    walls: MAZE_WALLS,
    updatedAt: now
  };
  localPlayer = game.players[user.uid];
  if (now - lastHeartbeat > HEARTBEAT_MS) {
    lastHeartbeat = now;
    syncLocalPlayer(now);
  }
}

async function syncLocalPlayer(now) {
  const nextGame = normalizeGame(game);
  const projectiles = pruneProjectiles(mergeProjectiles(remoteProjectiles, nextGame.projectiles), now);
  const tomatoes = nextGame.tomatoes;
  const players = prunePlayers({ ...nextGame.players, [user.uid]: localPlayer });
  const leaderboard = ensureLeaderboardEntry(nextGame.leaderboard, localPlayer);

  const patch = {
    "gameArena.players": players,
    "gameArena.projectiles": projectiles,
    "gameArena.walls": MAZE_WALLS,
    "gameArena.tomatoes": tomatoes,
    "gameArena.leaderboard": leaderboard,
    "gameArena.killLog": (nextGame.killLog || []).slice(-20),
    "gameArena.updatedAt": Date.now()
  };
  if (demoMode) {
    game = {
      ...nextGame,
      players,
      projectiles,
      walls: MAZE_WALLS,
      tomatoes,
      leaderboard,
      killLog: (nextGame.killLog || []).slice(-20),
      updatedAt: Date.now()
    };
    localPlayer = game.players[user.uid];
    return;
  }
  await dbFns.updateDoc(familyRef, patch).catch(() => {});
}

function resolveHits(players, projectiles, tomatoes, leaderboard, nextKillLog, now) {
  Object.values(projectiles).forEach((shot) => {
    if (shot.ownerUid !== user.uid) return;
    Object.values(players).forEach((player) => {
      if (!player.alive || player.uid === shot.ownerUid) return;
      if (distance(player.x, player.y, shot.x, shot.y) < PLAYER_SIZE) {
        player.alive = false;
        player.deadUntil = now + RESPAWN_MS;
        recordKill(leaderboard, nextKillLog, shot.ownerUid, player.uid, players);
        delete projectiles[shot.id];
      }
    });
  });

  Object.values(players).forEach((player) => {
    if (player.uid !== user.uid) return;
    if (!player.alive) return;
    if (tomatoes.some((tomato) => distance(player.x, player.y, tomato.x, tomato.y) < (PLAYER_SIZE + TOMATO_SIZE) / 2)) {
      player.alive = false;
      player.deadUntil = now + RESPAWN_MS;
    }
  });
}

function ensureLeaderboardEntry(leaderboard = {}, player) {
  if (!player?.uid) return leaderboard || {};
  return {
    ...(leaderboard || {}),
    [player.uid]: {
      uid: player.uid,
      name: player.name || "Player",
      kills: Number(leaderboard?.[player.uid]?.kills || 0),
      lastKillAt: leaderboard?.[player.uid]?.lastKillAt || 0
    }
  };
}

function recordKill(leaderboard, nextKillLog, killerUid, victimUid, players) {
  if (!killerUid || killerUid === victimUid) return;
  const killer = players[killerUid] || { uid: killerUid, name: "Player" };
  const victim = players[victimUid] || { uid: victimUid, name: "Player" };
  const current = leaderboard[killerUid] || { uid: killerUid, name: killer.name || "Player", kills: 0 };
  leaderboard[killerUid] = {
    ...current,
    name: killer.name || current.name || "Player",
    kills: Number(current.kills || 0) + 1,
    lastKillAt: Date.now()
  };
  nextKillLog.push({
    id: `${killerUid}-${victimUid}-${Date.now()}`,
    killerUid,
    killerName: killer.name || "Player",
    victimUid,
    victimName: victim.name || "Player",
    createdAt: Date.now()
  });
}

function moveTomatoes(tomatoes, dt) {
  return tomatoes.map((tomato) => {
    let next = {
      ...tomato,
      x: tomato.x + tomato.vx * TOMATO_SPEED * dt,
      y: tomato.y + tomato.vy * TOMATO_SPEED * dt
    };
    const hitX = next.x < TOMATO_SIZE || next.x > ARENA.width - TOMATO_SIZE
      || MAZE_WALLS.some((wall) => circleRectHit(next.x, tomato.y, TOMATO_SIZE / 2, wall));
    const hitY = next.y < TOMATO_SIZE || next.y > ARENA.height - TOMATO_SIZE
      || MAZE_WALLS.some((wall) => circleRectHit(next.x, next.y, TOMATO_SIZE / 2, wall));
    if (hitX) {
      next.vx *= -1;
      next.x = tomato.x;
    }
    if (hitY) {
      next.vy *= -1;
      next.y = tomato.y;
    }
    return next;
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
    next[shot.id] = { ...shot };
  });
  return next;
}

function moveProjectiles(projectiles, dt, now = Date.now()) {
  return Object.fromEntries(Object.values(projectiles).map((shot) => [
    shot.id,
    {
      ...shot,
      x: shot.x + shot.vx * dt,
      y: shot.y + shot.vy * dt,
      updatedAt: now
    }
  ]));
}

function mergeProjectiles(remote, local) {
  const merged = { ...remote };
  Object.entries(local || {}).forEach(([id, shot]) => {
    const existing = merged[id];
    if (!existing || (shot.updatedAt || shot.createdAt || 0) >= (existing.updatedAt || existing.createdAt || 0)) {
      merged[id] = shot;
    }
  });
  return merged;
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
    createdAt: now,
    updatedAt: now
  };
  game.projectiles = {
    ...game.projectiles,
    [shotId]: shot
  };
  remoteProjectiles = {
    ...remoteProjectiles,
    [shotId]: shot
  };
  if (!demoMode) syncLocalPlayer(now);
}

function draw() {
  if (canvas.width !== ARENA.width) canvas.width = ARENA.width;
  if (canvas.height !== ARENA.height) canvas.height = ARENA.height;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ARENA.width, ARENA.height);

  ctx.fillStyle = "#15131f";
  ctx.fillRect(0, 0, ARENA.width, ARENA.height);
  drawGrid();
  game.walls.forEach(drawWall);
  game.tomatoes.forEach(drawTomato);
  Object.values(game.projectiles).forEach(drawPizzaShot);
  Object.values(game.players).forEach(drawPlayer);

  const living = Object.values(game.players).filter((player) => player.alive).length;
  playerCount.textContent = `${Object.keys(game.players).length} online`;
  playerStatus.textContent = localPlayer?.alive ? `${living} still standing` : "Respawning...";
  renderLeaderboard();
}

function renderLeaderboard() {
  const rows = Object.values(game.leaderboard || {})
    .sort((a, b) => Number(b.kills || 0) - Number(a.kills || 0) || (a.name || "").localeCompare(b.name || ""));
  const leaderboardRows = rows.length ? rows : [{ name: "No kills yet", kills: 0 }];
  leaderboardList.replaceChildren(...leaderboardRows.map((row) => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${escapeHtml(row.name || "Player")}</strong> - ${Number(row.kills || 0)} kill${Number(row.kills || 0) === 1 ? "" : "s"}`;
    return item;
  }));

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

function drawTomato(tomato) {
  ctx.save();
  ctx.translate(tomato.x, tomato.y);
  ctx.fillStyle = "#e63946";
  ctx.strokeStyle = "#7a1721";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, TOMATO_SIZE / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#3ddc97";
  ctx.beginPath();
  ctx.moveTo(-7, -12);
  ctx.lineTo(0, -20);
  ctx.lineTo(7, -12);
  ctx.lineTo(2, -14);
  ctx.lineTo(0, -8);
  ctx.lineTo(-2, -14);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255, 244, 223, 0.8)";
  ctx.beginPath();
  ctx.arc(-4, -4, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
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

function randomSpawn() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const x = 38 + Math.random() * (ARENA.width - 76);
    const y = 38 + Math.random() * (ARENA.height - 76);
    const blocked = game.walls.some((rect) => circleRectHit(x, y, PLAYER_SIZE, rect))
      || game.tomatoes.some((tomato) => distance(x, y, tomato.x, tomato.y) < 90);
    if (!blocked) return { x, y };
  }
  return { x: 60, y: 60 };
}

function inputVector() {
  const keyX = Number(keyboardInput.right) - Number(keyboardInput.left);
  const keyY = Number(keyboardInput.down) - Number(keyboardInput.up);
  const x = input.x || keyX;
  const y = input.y || keyY;
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") keyboardInput.up = true;
  if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") keyboardInput.down = true;
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") keyboardInput.left = true;
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") keyboardInput.right = true;
  if (event.key === " ") {
    event.preventDefault();
    shoot();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") keyboardInput.up = false;
  if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") keyboardInput.down = false;
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") keyboardInput.left = false;
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") keyboardInput.right = false;
});

shootButton.addEventListener("pointerdown", shootFromButton);
mobileShootButton.addEventListener("pointerdown", shootFromButton);
leaderboardButton.addEventListener("click", () => {
  leaderboardPanel.hidden = false;
  renderLeaderboard();
});
closeLeaderboardButton.addEventListener("click", () => {
  leaderboardPanel.hidden = true;
});

function shootFromButton(event) {
  event.preventDefault();
  shoot();
}

joystick.addEventListener("pointerdown", handleJoystick);
joystick.addEventListener("pointermove", handleJoystick);
joystick.addEventListener("pointerup", resetJoystick);
joystick.addEventListener("pointercancel", resetJoystick);

function handleJoystick(event) {
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
  input = { x: nx * (clamped / max), y: ny * (clamped / max) };
  joystickThumb.style.transform = `translate(calc(-50% + ${nx * clamped}px), calc(-50% + ${ny * clamped}px))`;
}

function resetJoystick() {
  input = { x: 0, y: 0 };
  joystickThumb.style.transform = "translate(-50%, -50%)";
}
