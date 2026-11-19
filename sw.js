/* ==========================================================
   CHAPTER 11: THE SERVICE WORKER (what makes the game work offline)
   ==========================================================
   A service worker is a small helper script that the browser keeps on your phone.
   It sits between the game and the internet. The first time you open the game online,
   it saves a copy of every game file. After that, when the game asks for a file, the
   helper hands over the saved copy, so no internet is needed.

   Think of it as a pantry: stock it once while you are online, cook from it offline.

   IMPORTANT: when you change ANY game file (html, css, js), change the version number below
   (v2 -> v3). That tells the phone "the pantry is out of date, restock it".
*/

const CACHE_NAME = "game2048-v2";

// The files to save. "./" is the page itself (index.html).
const FILES_TO_SAVE = [
  "./",
  "./index.html",
  "./css/palettes.css",
  "./css/style.css",
  "./js/config.js",
  "./js/storage.js",
  "./js/board.js",
  "./js/state.js",
  "./js/view.js",
  "./js/effects.js",
  "./js/palettes.js",
  "./js/game.js",
  "./js/input.js",
  "./js/main.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./apple-touch-icon.png"
];

// 1) INSTALL: runs once when the helper is first added. Stock the pantry.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_SAVE))
  );
  self.skipWaiting();   // start working right away instead of waiting
});

// 2) ACTIVATE: runs when this version takes over. Throw away old pantries (old versions).
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

// 3) FETCH: runs every time the game asks for a file.
//    Answer from the pantry first (fast, works offline).
//    If online, also fetch a fresh copy in the background and save it,
//    so the NEXT time you open the game you get the latest version.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((saved) => {
      const fresh = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => saved);          // offline: fall back to the saved copy

      return saved || fresh;          // saved copy first; otherwise wait for the network
    })
  );
});
