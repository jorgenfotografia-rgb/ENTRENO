const CACHE='pitbull-academy-core-v1-1-1-prepilot';
const ASSETS=['./','./index.html','./styles.css','./core-v1.css','./app.js','./data/brands.js','./data/sources.js','./data/products.js','./data/modules.js','./data/clients.js','./data/scenarios/m01.js','./manifest.webmanifest',
'./assets/glutamina.webp','./assets/tiby-boss-check.webp','./assets/tiby-boss-review.webp','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-512-maskable.png',
'./assets/tomas.svg','./assets/luciano.svg','./assets/marina.svg','./assets/matias.svg','./assets/carla.svg','./assets/federico.svg'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)))});
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return resp}).catch(()=>hit)))});
