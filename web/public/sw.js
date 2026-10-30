/* DeepKids service worker
   1. /_blob/<id> serves a photo or file from the family's private Supabase storage, adding their sign-in token.
   2. The app shell is cached so DeepKids opens on a weak connection (network first, cache as fallback). */
const SHELL="dk-shell-6bd9fb36da48c13342";
let AUTH={token:"",base:"",key:""};
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(SHELL).then(c=>c.addAll(["/","/index.html","/config.js","/platform.js","/vendor/supabase-2.118.0.js","/manifest.webmanifest"]).catch(()=>{})))});
self.addEventListener("activate",e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith("dk-shell-")&&k!==SHELL)await caches.delete(k);await self.clients.claim()})())});
self.addEventListener("message",e=>{if(e.data?.type==="token")AUTH={token:e.data.token||"",base:e.data.base||"",key:e.data.key||""}});
async function askToken(clientId){const cs=clientId?[await self.clients.get(clientId)]:await self.clients.matchAll({type:"window"});for(const c of cs){if(!c)continue;const ch=new MessageChannel();const p=new Promise(r=>{ch.port1.onmessage=e=>r(e.data);setTimeout(()=>r(null),2000)});c.postMessage({type:"token?"},[ch.port2]);const d=await p;if(d?.token){AUTH={token:d.token,base:d.base,key:d.key};return}}}
async function blob(req,clientId){const id=decodeURIComponent(new URL(req.url).pathname.slice("/_blob/".length));if(!AUTH.token)await askToken(clientId);
  const get=()=>fetch(`${AUTH.base}/storage/v1/object/authenticated/uploads/${id.split("/").map(encodeURIComponent).join("/")}`,{headers:{authorization:"Bearer "+AUTH.token,apikey:AUTH.key}});
  let r=await get();if(r.status===400||r.status===401||r.status===403){await askToken(clientId);r=await get()}
  if(!r.ok)return new Response("Not found",{status:404});const h=new Headers(r.headers);h.set("cache-control","private, max-age=3600");return new Response(r.body,{status:200,headers:h})}
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(u.origin!==location.origin||e.request.method!=="GET")return;
  if(u.pathname.startsWith("/_blob/")){e.respondWith(blob(e.request,e.clientId));return}
  if(e.request.mode==="navigate"||/\.(js|webmanifest|css|png|svg)$/.test(u.pathname)){e.respondWith((async()=>{try{const r=await fetch(e.request);if(r.ok){const c=await caches.open(SHELL);c.put(e.request,r.clone())}return r}catch(err){const m=await caches.match(e.request,{ignoreSearch:e.request.mode==="navigate"})||await caches.match("/index.html");return m||new Response("Offline",{status:503})}})())}});
