const CACHE_NAME = "pizza-movie-night-v142";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app-v35.js",
  "./firebase-config.js",
  "./omdb-config.js",
  "./manifest.webmanifest",
  "./assets/pizza-logo.png",
  "./assets/zombie.png",
  "./assets/home/arena-icon.png",
  "./assets/home/bottom-bar.png",
  "./assets/home/find-icon.png",
  "./assets/home/hero-movie-pizza.png",
  "./assets/home/movie-list-icon.png",
  "./assets/home/rankings-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response.ok) return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
