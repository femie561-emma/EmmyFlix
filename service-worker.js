const CATCHE_NAME = "emmyflix-v1";

const STATIC_FILES = [
    "/",
    "/index.html",
    "/home.html",
    "/watch.html",
    "/yofilm.html",
    "/signup.html",
    "/script.js",
    "/style.css"
     
];





// INSTALL -> CACHE IMPORTANT FILES

self.addEventListener("install", event => {
  console.log("Service Worker Installed");

  event.waitUntil(
    caches.open(CATCHE_NAME)
      .then(cache => {
        return cache.addAll(STATIC_FILES);
      })
  );

});


// ACTIVATE -> DELETE OLD CACHES
self.addEventListener("activate", event => {
  console.log("Service Worker Activated");

  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CATCHE_NAME) {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// FETCH -> SERVER FROM CACHE FIRST, THEN NETWORK
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});