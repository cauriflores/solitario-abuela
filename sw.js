/* Service worker opcional.
  Colócalo junto a solitario-accesible.html si publicas el juego en una URL https
   (por ejemplo GitHub Pages). Sirve para que funcione sin conexión.
   Sube la versión de CACHE cuando cambies el juego. */
const CACHE = 'solitario-v3';
const FILES = ['./', './index.html', './solitario-accesible.html', './sw.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Primero la caché: el juego abre al instante y sin datos móviles.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match('./solitario-accesible.html')))
  );
});
