/* DeepKids web platform layer.
   The app was built against claude.ai's artifact runtime (window.claude.use("db"|"user"|"sample"|"assets"|"downloads")).
   This file signs the parent in with Google through Supabase, then provides the same calls backed by
   Supabase (database, storage, an edge function that calls Claude), and finally loads the app. */
(function(){
  "use strict";
  const C=window.DK_CONFIG||{},T=window.DK_TEST||null;
  const $=s=>document.querySelector(s);
  const ready=!!(C.supabaseUrl&&C.supabaseAnonKey)||!!T;
  let sb=null,session=null,uid=null;

  /* ---------- sign-in screen ---------- */
  const css=`.dkg{min-height:100vh;display:grid;place-items:center;padding:24px;background:#FFF6EC;font-family:system-ui,sans-serif;color:#2B2340}
   .dkg .box{max-width:380px;width:100%;display:grid;gap:16px;text-align:center}.dkg h1{font-size:30px;margin:0}.dkg p{margin:0;line-height:1.5;color:#5d5670}
   .dkg button{display:flex;gap:10px;align-items:center;justify-content:center;width:100%;padding:14px 18px;border-radius:16px;border:2px solid rgba(43,35,64,.15);background:#fff;font:600 17px system-ui,sans-serif;cursor:pointer;color:#2B2340}
   .dkg button:active{transform:scale(.98)}.dkg .err{color:#b03a2e;font-size:14px}.dkg small{color:#776f8a;font-size:12.5px;line-height:1.5}
   .dkg .blob{width:84px;height:84px;margin:0 auto;border-radius:46% 54% 50% 50%/55% 45% 55% 45%;background:#8E8DD8;display:grid;place-items:center;font-size:36px}`;
  function signInScreen(msg){
    document.body.innerHTML=`<style>${css}</style><div class="dkg"><div class="box"><div class="blob">🙂</div><h1>DeepKids</h1><p>Homeschooling made simple, for Indian families with children aged 6 to 10.</p>
      ${ready?`<button id="dkGoogle"><svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>Continue with Google</button>`:`<p class="err">This site isn't connected to its database yet. Fill in web/public/config.js (see web/SETUP.md).</p>`}
      ${msg?`<p class="err">${msg}</p>`:""}
      <small>We use your Google account only to sign you in. Your family's plans, progress and photos are private to you.</small></div></div>`;
    const b=$("#dkGoogle");if(b)b.onclick=async()=>{b.disabled=true;try{await sb.auth.signInWithOAuth({provider:"google",options:{redirectTo:location.origin+location.pathname}})}catch(e){signInScreen("Couldn't start Google sign-in. Try again.")}}}

  /* ---------- helpers ---------- */
  const err=(code,message)=>Object.assign(new Error(message||code),{code});
  async function token(){if(T)return "test-token";const {data}=await sb.auth.getSession();return data?.session?.access_token||""}
  function toB64(blob){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(",")[1]);r.onerror=rej;r.readAsDataURL(blob)})}
  async function shrink(blob,max,q){try{if(!blob.type||!blob.type.startsWith("image/")||blob.type==="image/gif"||blob.type==="image/svg+xml")return blob;const b=await createImageBitmap(blob),s=Math.min(1,max/Math.max(b.width,b.height));if(s===1&&blob.size<400*1024)return blob;const c=document.createElement("canvas");c.width=Math.round(b.width*s);c.height=Math.round(b.height*s);const g=c.getContext("2d");g.fillStyle="#fff";g.fillRect(0,0,c.width,c.height);g.drawImage(b,0,0,c.width,c.height);const out=await new Promise(r=>c.toBlob(r,"image/jpeg",q));return out&&out.size<blob.size?out:blob}catch(e){return blob}}
  const snap=(row)=>({exists:!!row,data:()=>row?row.data:undefined});

  /* ---------- db: private family documents + shared topic library ---------- */
  function makeDb(){
    const docs=()=>sb.from("docs"),shared=()=>sb.from("shared");
    const isPrivate=p=>p.startsWith("data/users/");
    function doc(path){
      if(!isPrivate(path)){const [coll,...rest]=path.split("/");return sharedDoc(coll,rest.join("/"))}
      return {
        async get(){const {data,error}=await docs().select("data,updated_at").eq("path",path).maybeSingle();if(error)throw err("db_error",error.message);return snap(data)},
        async set(obj){const {error}=await docs().upsert({path,owner:uid,data:obj,updated_at:new Date().toISOString()});if(error)throw err("db_error",error.message)},
        async update(obj){const cur=(await this.get()).data()||{};return this.set({...cur,...obj})},
        async delete(){const {error}=await docs().delete().eq("path",path);if(error)throw err("db_error",error.message)},
        onSnapshot(cb,onErr){let last=null,stop=false;const poll=async()=>{if(stop||document.hidden)return;try{const {data,error}=await docs().select("data,updated_at").eq("path",path).maybeSingle();if(error)throw error;const v=data?.updated_at||"";if(last!==null&&v!==last)cb(snap(data));last=v}catch(e){onErr&&onErr(e)}};
          poll();const t=setInterval(poll,60000),vis=()=>{if(!document.hidden)poll()};document.addEventListener("visibilitychange",vis);return ()=>{stop=true;clearInterval(t);document.removeEventListener("visibilitychange",vis)}}}}
    function sharedDoc(coll,id){return {
      async get(){const {data,error}=await shared().select("id,data").eq("coll",coll).eq("id",id).maybeSingle();if(error)throw err("db_error",error.message);return snap(data)},
      async set(obj){const {error}=await shared().upsert({id,coll,data:obj});if(error)throw err("db_error",error.message)}}}
    function collection(name){
      if(isPrivate(name))return {doc:id=>doc(name+"/"+id)};
      const q={n:500};const api={
        limit(n){q.n=n;return api},
        async get(){const {data,error}=await shared().select("id,data").eq("coll",name).order("created_at",{ascending:false}).limit(q.n);if(error)throw err("db_error",error.message);return {docs:(data||[]).map(r=>({id:r.id,data:()=>r.data})),size:(data||[]).length}},
        doc:id=>sharedDoc(name,id),
        async add(obj){const id=crypto.randomUUID();const {error}=await shared().insert({id,coll:name,data:obj});if(error)throw err("db_error",error.message);return {id}}};
      return api}
    return Object.freeze({doc,collection})}

  /* ---------- user ---------- */
  function makeUser(){const u=session.user||{},m=u.user_metadata||{};return Object.freeze({
    id:async()=>u.id,me:async()=>({id:u.id,name:m.full_name||m.name||(u.email||"").split("@")[0],email:u.email||"",avatar:m.avatar_url||""}),
    isOwner:()=>false,canEdit:()=>false,can:()=>null,profiles:async ids=>Object.fromEntries((ids||[]).map(i=>[i,{name:""}]))})}

  /* ---------- sample: Claude through our edge function ---------- */
  function makeSample(){
    async function call(input,opts={}){const imgs=[];for(const b of (opts.images||[]).slice(0,8)){const s=await shrink(b,1568,.85);imgs.push({media_type:s.type&&s.type.startsWith("image/")?s.type:"image/jpeg",data:await toB64(s)})}
      const body={input,images:imgs,tier:opts.modelTier||"default"};
      let r;try{r=await fetch(C.functionsUrl||(C.supabaseUrl+"/functions/v1/claude"),{method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+await token(),apikey:C.supabaseAnonKey||""},body:JSON.stringify(body),signal:opts.signal})}catch(e){throw err("unavailable","Couldn't reach DeepKids just now.")}
      let j=null;try{j=await r.json()}catch(e){}
      if(!r.ok)throw err(j?.code||(r.status===429?"rate_limited":r.status===401?"not_granted":"unavailable"),j?.message||("HTTP "+r.status));
      return j}
    const sample=async(input,opts)=>{const j=await call(input,opts);if(opts?.onText)try{opts.onText({text:j.text,delta:j.text})}catch(e){}return {text:j.text||"",truncated:!!j.truncated}};
    sample.json=async(input,opts)=>{const j=await call(input,{...opts,json:true});if(j.json===undefined||j.json===null)throw err("invalid_json","No JSON in the answer");return j.json};
    sample.limits=async()=>({images:true});
    return Object.freeze(sample)}

  /* ---------- assets: photos and files in private storage ---------- */
  function makeAssets(){const bucket=()=>sb.storage.from("uploads");return Object.freeze({
    async upload(blob){if(!blob||!blob.size)throw err("bad_request","Empty file");const s=await shrink(blob,1600,.82);if(s.size>20*1024*1024)throw err("too_large","Over 20 MB");
      const ext=(s.type==="image/jpeg"?"jpg":(blob.name&&/\.\w{2,5}$/.test(blob.name)?blob.name.split(".").pop():(s.type.split("/")[1]||"bin"))).toLowerCase().replace("jpeg","jpg");
      const id=`${uid}/${crypto.randomUUID()}.${ext}`;const {error}=await bucket().upload(id,s,{contentType:s.type||"application/octet-stream",upsert:false});if(error)throw err("upload_failed",error.message);
      return {id,url:"/_blob/"+id,sizeBytes:s.size,contentType:s.type}},
    async list(){const {data}=await bucket().list(uid,{limit:1000});return {assets:(data||[]).map(f=>({id:uid+"/"+f.name,url:"/_blob/"+uid+"/"+f.name,sizeBytes:f.metadata?.size||0,contentType:f.metadata?.mimetype||""})),usage:{}}},
    async delete(id){if(!String(id).startsWith(uid+"/"))throw err("bad_request");const {error}=await bucket().remove([id]);if(error)throw err("delete_failed",error.message)}})}

  /* ---------- downloads ---------- */
  const downloads=Object.freeze({async save({filename,data}){const blob=data instanceof Blob?data:new Blob([data]);const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename||"download";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),30000);return "saved"}});

  /* ---------- the window.claude the app expects ---------- */
  function install(){const caps={db:makeDb(),user:makeUser(),sample:makeSample(),assets:makeAssets(),downloads};
    window.claude=Object.freeze({use:async name=>caps[name]||null});
    window.DK_PLATFORM={name:"web",signOut:async()=>{await sb.auth.signOut();location.reload()},user:()=>session?.user||null}}

  /* ---------- service worker: serves /_blob/ photos from private storage, caches the app ---------- */
  async function startSW(){if(!("serviceWorker" in navigator)||T)return;try{
    const reg=await navigator.serviceWorker.register("/sw.js");
    navigator.serviceWorker.addEventListener("message",async e=>{if(e.data?.type==="token?"&&e.ports[0])e.ports[0].postMessage({token:await token(),base:C.supabaseUrl,key:C.supabaseAnonKey})});
    const send=async()=>{const t=await token();(navigator.serviceWorker.controller||reg.active)?.postMessage({type:"token",token:t,base:C.supabaseUrl,key:C.supabaseAnonKey})};
    if(!navigator.serviceWorker.controller)await new Promise(r=>{navigator.serviceWorker.addEventListener("controllerchange",r,{once:true});setTimeout(r,3000)});
    await send();sb.auth.onAuthStateChange(()=>send())}catch(e){console.warn("service worker",e)}}

  /* ---------- load the app ---------- */
  function load(src){return new Promise((res,rej)=>{const s=document.createElement("script");s.src=src;s.onload=res;s.onerror=()=>rej(new Error("load "+src));document.head.appendChild(s)})}
  async function boot(){
    if(T){sb=T.supabase;session=T.session;uid=session.user.id}
    else{if(!ready)return signInScreen();sb=window.supabase.createClient(C.supabaseUrl,C.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:"pkce"}});
      const {data}=await sb.auth.getSession();session=data?.session;
      if(!session)return signInScreen(new URLSearchParams(location.search).get("error_description")||"");
      uid=session.user.id;if(location.search.includes("code="))history.replaceState(null,"",location.pathname);
      sb.auth.onAuthStateChange((ev,s)=>{if(ev==="SIGNED_OUT")location.reload();if(s)session=s})}
    install();await startSW();
    const v=window.DK_BUILD||"";document.getElementById("dkLoading")?.remove();
    await load("/data.js?v="+v);await load("/app.js?v="+v)}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();
