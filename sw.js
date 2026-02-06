self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("tracker-cache").then(cache => {
      return cache.addAll([
        "/AniruddhTracker/",
        "/AniruddhTracker/index.html",
        "/AniruddhTracker/css/main.css",
        "/AniruddhTracker/js/app.js"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
