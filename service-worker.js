const CACHE='pitbull-academy-asset-quality-v1';

const CORE=[
  './','./index.html','./styles.css','./app.js','./data/module.js','./data/clients.js','./manifest.webmanifest',
  './assets/icon-192.png','./assets/icon-512.png','./assets/icon-512-maskable.png',
  './assets/tomas.svg','./assets/luciano.svg','./assets/marina.svg','./assets/matias.svg','./assets/carla.svg','./assets/federico.svg',
  './asset-data/checkW-0.js','./asset-data/checkW-1.js','./asset-data/checkW-2.js','./asset-data/checkW-3.js',
  './asset-data/reviewW-0.js','./asset-data/reviewW-1.js','./asset-data/reviewW-2.js','./asset-data/reviewW-3.js',
  './asset-data/glutW-0.js','./asset-data/glutW-1.js'
];

const EMBEDDED={
  'assets/tiby-boss-check.jpg':{key:'checkW',files:['checkW-0.js','checkW-1.js','checkW-2.js','checkW-3.js']},
  'assets/tiby-boss-review.jpg':{key:'reviewW',files:['reviewW-0.js','reviewW-1.js','reviewW-2.js','reviewW-3.js']},
  'assets/glutamina.jpg':{key:'glutW',files:['glutW-0.js','glutW-1.js']}
};

const decoded=new Map();

async function embeddedResponse(config){
  if(decoded.has(config.key)) return new Response(decoded.get(config.key),{headers:{'Content-Type':'image/webp','Cache-Control':'public, max-age=31536000, immutable'}});
  const cache=await caches.open(CACHE);
  let base64='';
  for(const file of config.files){
    const url=new URL(`./asset-data/${file}`,self.location.href).href;
    const hit=await cache.match(url) || await fetch(url);
    const text=await hit.text();
    const match=text.match(/\+\s*'([^']+)'/);
    if(!match) throw new Error(`Invalid embedded asset chunk: ${file}`);
    base64+=match[1];
  }
  const raw=atob(base64);
  const bytes=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
  decoded.set(config.key,bytes);
  return new Response(bytes,{headers:{'Content-Type':'image/webp','Cache-Control':'public, max-age=31536000, immutable'}});
}

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)));
});

self.addEventListener('activate',event=>event.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),
  self.clients.claim()
])));

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  const embedded=Object.entries(EMBEDDED).find(([path])=>url.pathname.endsWith(path));
  if(embedded){
    event.respondWith(embeddedResponse(embedded[1]).catch(()=>fetch(event.request)));
    return;
  }
  event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(resp=>{
    const copy=resp.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    return resp;
  })));
});
