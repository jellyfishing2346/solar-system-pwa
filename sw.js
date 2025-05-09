const CACHE_NAME = 'solar-system-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/data.json',
  '/images/sun.jpg',
  '/images/mercury.jpg',
  '/images/venus.jpg',
  '/images/earth.jpg',
  '/images/mars.jpg',
  '/images/jupiter.jpg',
  '/images/saturn.jpg',
  '/images/uranus.jpg',
  '/images/neptune.jpg',
  '/audio/sun.mp3',
  '/audio/mercury.mp3',
  '/audio/venus.mp3',
  '/audio/earth.mp3',
  '/audio/mars.mp3',
  '/audio/jupiter.mp3',
  '/audio/saturn.mp3',
  '/audio/uranus.mp3',
  '/audio/neptune.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});