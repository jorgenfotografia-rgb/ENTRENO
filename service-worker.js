const CACHE='pitbull-academy-quality-pass-01';
const ASSETS=['./','./index.html','./styles.css','./app.js','./data/module.js','./data/clients.js',
'./assets/isotipo.jpg','./assets/glutamina.webp','./assets/tiby-boss-check.jpg','./assets/tiby-boss-review.jpg',
'./assets/tomas.jpg','./assets/luciano.jpg','./assets/marina.jpg','./assets/matias.jpg','./assets/carla.jpg','./assets/federico.jpg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
