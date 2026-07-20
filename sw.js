const CACHE = 'agulhas-negras-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  e.respondWith(
    fetch(e.request).then(function (res) {
      var clone = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, clone); });
      return res;
    }).catch(function () {
      return caches.match(e.request).then(function (cached) {
        return cached || caches.match('/index.html');
      });
    })
  );
});