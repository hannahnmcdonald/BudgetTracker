const CACHE_NAME = "my-site-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

const filesToCache = [
  "/",
  "/db.js",
  "/index.js",
  "/manifest.webmanifest",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

// Installation
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches
        .open(CACHE_NAME).then(function(cache) {
        console.log("Intalling Cache:" = CACHE_NAME);
        return cache.addAll(filesToCache);
    })
  );
});

// Activate Service Worker
self.addEventListener("activate", function(evt) {
    evt.waitUntil(
      caches.keys().then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
              console.log("Removing old cache data", key);
              return caches.delete(key);
            }
          })
        );
      })
    );
  self.clients.claim();
});

// Fetch 
self.addEventListener("fetch", event => {
  // cache all get requests to /api routes
  if (event.request.url.includes("/api/")) {
        // Console log results
        console.log("Service Worker fetch(data", event.request.url)
    event.respondWith(
      caches.open(DATA_CACHE_NAME)
        .then(cache => {
            return fetch(event.request)
            .then(response => {
                // If the response is good, copy it and store it in the cache.
                if (response.status === 200) {
                    cache.put(event.request.url, response.clone());
                }
                return response;
            })
            .catch(err => {
                // If request failed, attempt to get it from the cache.
                return cache.match(event.request);
            });
        })
    );
    return;
  }
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
            return response || fetch(event.request);
        });
        })
    );
});