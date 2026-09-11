const CACHE='pitbull-academy-qpass02-v1';
const ASSETS=['./','./index.html','./styles.css','./app.js','./data/module.js','./data/clients.js','./manifest.webmanifest',
'./assets/glutamina.jpg','./assets/tiby-boss-check.jpg','./assets/tiby-boss-review.jpg','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-512-maskable.png',
'./assets/tomas.svg','./assets/luciano.svg','./assets/marina.svg','./assets/matias.svg','./assets/carla.svg','./assets/federico.svg'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)))});
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return resp}).catch(()=>hit)))});
