/* DeepKids web platform layer.
   The app was built against claude.ai's artifact runtime (window.claude.use("db"|"user"|"sample"|"assets"|"downloads")).
   This file signs the parent in with Google through Supabase, then provides the same calls backed by
   Supabase (database, storage, an edge function that calls Claude), and finally loads the app. */
(function(){
  "use strict";
  const C=window.DK_CONFIG||{},T=window.DK_TEST||null;
  const $=s=>document.querySelector(s);
  const ready=!!(C.supabaseUrl&&C.supabaseAnonKey)||!!T;
  let sb=null,session=null,uid=null,plus={until:null,prices:[],payments:false};
  /* config ai: false = Claude off; "plus" = only families with DeepKids Plus; true = every signed-in family */
  const AI=T?(T.ai??true):C.ai;
  const plusOn=()=>!!plus.until&&new Date(plus.until)>new Date();

  /* ---------- sign-in screen ---------- */
  const css=`.dkg{min-height:100vh;display:grid;place-items:center;padding:24px;background:#FFF6EC;font-family:system-ui,sans-serif;color:#2B2340}
   .dkg .box{max-width:380px;width:100%;display:grid;gap:16px;text-align:center}.dkg h1{font-size:30px;margin:0}.dkg p{margin:0;line-height:1.5;color:#5d5670}
   .dkg button{display:flex;gap:10px;align-items:center;justify-content:center;width:100%;padding:14px 18px;border-radius:16px;border:2px solid rgba(43,35,64,.15);background:#fff;font:600 17px system-ui,sans-serif;cursor:pointer;color:#2B2340}
   .dkg button:active{transform:scale(.98)}.dkg .err{color:#b03a2e;font-size:14px}.dkg small{color:#776f8a;font-size:12.5px;line-height:1.5}
   .dkg .blob{width:84px;height:84px;margin:0 auto;border-radius:46% 54% 50% 50%/55% 45% 55% 45%;background:#8E8DD8;display:grid;place-items:center;font-size:36px}`;
  function signInScreen(msg){
    document.body.innerHTML=`<style>${css}</style><div class="dkg"><div class="box"><div class="blob">🙂</div><h1>DeepKids Gurukul</h1><p>The homeschooling app for Indian families with children aged 6 to 10.</p>
      ${ready?`<button id="dkGoogle"><svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>Continue with Google</button>`:`<p class="err">This site isn't connected to its database yet. Fill in web/public/config.js (see web/SETUP.md).</p>`}
      ${msg?`<p class="err">${msg}</p>`:""}
      <small>We use your Google account only to sign you in. Your family's plans, progress and photos are private to you.</small></div></div>`;
    const b=$("#dkGoogle");if(b)b.onclick=async()=>{b.disabled=true;try{await sb.auth.signInWithOAuth({provider:"google",options:{redirectTo:location.origin+location.pathname}})}catch(e){signInScreen("Couldn't start Google sign-in. Try again.")}};
    if(b&&C.googleClientId)googleButton(b)}
  /* With our own Google client id, Google's own button signs in on this page, so Google shows "DeepKids"
     instead of the database's address. Without it (or if Google's script can't load) the plain button above is used. */
  function googleButton(b){
    load("https://accounts.google.com/gsi/client").then(()=>{const g=window.google?.accounts?.id;if(!g)return;
      g.initialize({client_id:C.googleClientId,ux_mode:"popup",callback:async r=>{const {error}=await sb.auth.signInWithIdToken({provider:"google",token:r.credential});if(error)return signInScreen("Couldn't sign in with Google. Try again.");location.reload()}});
      const d=document.createElement("div");d.style.cssText="display:flex;justify-content:center";b.replaceWith(d);g.renderButton(d,{theme:"outline",size:"large",shape:"pill",text:"continue_with",width:320})}).catch(()=>{})}

  /* ---------- helpers ---------- */
  const err=(code,message)=>Object.assign(new Error(message||code),{code});
  async function token(){if(T)return "test-token";const {data}=await sb.auth.getSession();return data?.session?.access_token||""}
  function toB64(blob){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(",")[1]);r.onerror=rej;r.readAsDataURL(blob)})}
  async function shrink(blob,max,q){try{if(!blob.type||!blob.type.startsWith("image/")||blob.type==="image/gif"||blob.type==="image/svg+xml")return blob;const b=await createImageBitmap(blob),s=Math.min(1,max/Math.max(b.width,b.height));if(s===1&&blob.size<400*1024)return blob;const c=document.createElement("canvas");c.width=Math.round(b.width*s);c.height=Math.round(b.height*s);const g=c.getContext("2d");g.fillStyle="#fff";g.fillRect(0,0,c.width,c.height);g.drawImage(b,0,0,c.width,c.height);const out=await new Promise(r=>c.toBlob(r,"image/jpeg",q));return out&&out.size<blob.size?out:blob}catch(e){return blob}}
  async function fn(name,body){let r;try{r=await fetch((name==="claude"&&C.functionsUrl)||(C.supabaseUrl+"/functions/v1/"+name),{method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+await token(),apikey:C.supabaseAnonKey||""},body:JSON.stringify(body)})}catch(e){throw err("unavailable","Couldn't reach DeepKids just now.")}
    let j=null;try{j=await r.json()}catch(e){}if(!r.ok)throw err(j?.code||"unavailable",j?.message||("HTTP "+r.status));return j}
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
  /* every AI call asks first: the parent sees what is sent and that it uses their Plus AI allowance */
  const AIK="dk-ai-ok-"+new Date().toISOString().slice(0,10);
  function aiConsent(opts){try{if(localStorage.getItem(AIK)==="1")return Promise.resolve(true)}catch(e){}
    return new Promise(res=>{const n=(opts.images||[]).length,d=document.createElement("dialog");d.className="dk-ai";
      d.innerHTML=`<div class="dk-ai-box"><b>✦ This step uses DeepKids AI</b><p>${opts.purpose?String(opts.purpose).replace(/[<&]/g,""):"DeepKids will ask Claude, an AI model made by Anthropic, to help with this."} What you typed${n?` and ${n} photo${n>1?"s":""}`:""} will be sent to Claude through DeepKids. Nothing is kept by Claude for training.</p><p class="dk-ai-s">It uses your DeepKids Plus AI allowance (tokens).</p><label><input type="checkbox"> Don't ask again today on this device</label><div><button data-v="0">Not now</button><button data-v="1" class="dk-ai-go">Go ahead</button></div></div>`;
      if(!document.getElementById("dk-ai-css")){const st=document.createElement("style");st.id="dk-ai-css";st.textContent=".dk-ai{border:0;padding:0;background:transparent;max-width:calc(100vw - 32px)}.dk-ai::backdrop{background:rgba(20,15,35,.45)}.dk-ai-box{background:#fff;color:#2B2340;border-radius:20px;max-width:380px;padding:18px;font:15px/1.45 system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.25)}.dk-ai-box b{font-size:17px}.dk-ai-box p{margin:8px 0}.dk-ai-s{font-size:13px;color:#6b6380}.dk-ai-box label{font-size:13px;display:flex;gap:6px;align-items:center;margin:6px 0 12px}.dk-ai-box div{display:flex;gap:8px;justify-content:flex-end}.dk-ai-box button{border:0;border-radius:12px;padding:10px 16px;font:600 15px system-ui;background:#f1ece4;color:#2B2340}.dk-ai-box .dk-ai-go{background:#2B2340;color:#fff}.dk-ai-run{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:99998;background:#2B2340;color:#fff;border-radius:999px;padding:8px 14px;font:600 13px system-ui}";document.head.appendChild(st)}
      d.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const ok=b.dataset.v==="1";if(ok&&d.querySelector("input").checked)try{localStorage.setItem(AIK,"1")}catch(x){}d.close();d.remove();res(ok)});
      d.addEventListener("cancel",e=>{e.preventDefault();d.close();d.remove();res(false)});
      document.body.appendChild(d);try{d.showModal()}catch(e){d.setAttribute("open","")}d.querySelector(".dk-ai-go").focus()})}
  function makeSample(){
    async function call(input,opts={}){if(!await aiConsent(opts))throw err("cancelled","You chose not to use AI this time.");
      const run=document.createElement("div");run.className="dk-ai-run";run.textContent="✦ Using DeepKids AI…";document.body.appendChild(run);
      try{return await callAI(input,opts)}finally{run.remove()}}
    async function callAI(input,opts={}){const imgs=[];for(const b of (opts.images||[]).slice(0,8)){const s=await shrink(b,1568,.85);imgs.push({media_type:s.type&&s.type.startsWith("image/")?s.type:"image/jpeg",data:await toB64(s)})}
      const docs=[];for(const b of (opts.docs||[]).slice(0,2))docs.push({media_type:"application/pdf",data:await toB64(b)});
      const body={input,images:imgs,docs,tier:opts.modelTier||"default"};
      let r;try{r=await fetch(C.functionsUrl||(C.supabaseUrl+"/functions/v1/claude"),{method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+await token(),apikey:C.supabaseAnonKey||""},body:JSON.stringify(body),signal:opts.signal})}catch(e){throw err("unavailable","Couldn't reach DeepKids just now.")}
      let j=null;try{j=await r.json()}catch(e){}
      if(!r.ok)throw err(j?.code||(r.status===429?"rate_limited":r.status===401?"not_granted":"unavailable"),j?.message||("HTTP "+r.status));
      return j}
    const sample=async(input,opts)=>{const j=await call(input,opts);if(opts?.onText)try{opts.onText({text:j.text,delta:j.text})}catch(e){}return {text:j.text||"",truncated:!!j.truncated}};
    sample.json=async(input,opts)=>{const j=await call(input,{...opts,json:true});if(j.json===undefined||j.json===null)throw err("invalid_json","No JSON in the answer");return j.json};
    sample.limits=async()=>({images:true,docs:true});
    return Object.freeze(sample)}

  /* ---------- assets: photos and files in private storage ---------- */
  function makeAssets(){const bucket=()=>sb.storage.from("uploads");return Object.freeze({
    async upload(blob){if(!blob||!blob.size)throw err("bad_request","Empty file");const s=await shrink(blob,1600,.82);if(s.size>20*1024*1024)throw err("too_large","Over 20 MB");
      const ext=(s.type==="image/jpeg"?"jpg":(blob.name&&/\.\w{2,5}$/.test(blob.name)?blob.name.split(".").pop():(s.type.split("/")[1]||"bin"))).toLowerCase().replace("jpeg","jpg");
      const id=`${uid}/${crypto.randomUUID()}.${ext}`;const {error}=await bucket().upload(id,s,{contentType:s.type||"application/octet-stream",upsert:false});if(error)throw err("upload_failed",error.message);
      return {id,url:"/_blob/"+id,sizeBytes:s.size,contentType:s.type}},
    async list(){const {data}=await bucket().list(uid,{limit:1000});return {assets:(data||[]).map(f=>({id:uid+"/"+f.name,url:"/_blob/"+uid+"/"+f.name,sizeBytes:f.metadata?.size||0,contentType:f.metadata?.mimetype||""})),usage:{}}},
    async delete(id){if(!String(id).startsWith(uid+"/"))throw err("bad_request");const {error}=await bucket().remove([id]);if(error)throw err("delete_failed",error.message)}})}

  /* ---------- content edits: the owner rewrites any text in the app; every family sees the new text ---------- */
  /* table content_edits (k = the original text, t = the new text), writable only by emails listed in table editors */
  function makeEdits(){const t=()=>sb.from("content_edits");return Object.freeze({
    async list(){const {data,error}=await t().select("k,t");if(error)throw err("db_error",error.message);return data||[]},
    async put(k,text){const {error}=await t().upsert({k,t:text,updated_at:new Date().toISOString()});if(error)throw err("db_error",error.message)},
    async del(k){const {error}=await t().delete().eq("k",k);if(error)throw err("db_error",error.message)},
    async canEdit(){try{const e=(session?.user?.email||"").toLowerCase();if(!e)return false;const {data}=await sb.from("editors").select("email").eq("email",e).maybeSingle();return !!data}catch(x){return false}}})}

  /* ---------- downloads ---------- */
  const downloads=Object.freeze({async save({filename,data}){const blob=data instanceof Blob?data:new Blob([data]);const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename||"download";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),30000);return "saved"}});

  /* ---------- the window.claude the app expects ---------- */
  const caps={};
  function install(){Object.assign(caps,{db:makeDb(),user:makeUser(),sample:(AI===true||(AI&&plusOn()))?makeSample():null,assets:makeAssets(),downloads});
    window.claude=Object.freeze({use:async name=>caps[name]||null});
    window.DK_PLATFORM={name:"web",edits:makeEdits(),signOut:async()=>{await sb.auth.signOut();location.reload()},user:()=>session?.user||null,plus:()=>({...plus,on:plusOn()})};
    if(AI==="plus"&&plus.payments)window.DK_PLATFORM.upgrade=upgrade}

  /* ---------- DeepKids Plus: status and Razorpay checkout ---------- */
  async function plusStatus(){if(AI!=="plus")return;try{const j=await Promise.race([fn("plus",{action:"status"}),new Promise((_,rej)=>setTimeout(()=>rej(err("timeout")),6000))]);plus={until:j.valid_until||null,prices:j.prices||[],payments:!!j.payments}}catch(e){console.warn("plus status",e)}}
  const inr=n=>"₹"+Number(n).toLocaleString("en-IN");
  const per=p=>p.months===1?"1 month":p.months===12?"1 year":p.months+" months";
  function pickPrice(){const P=plus.prices;if(P.length<2)return Promise.resolve(P[0]||null);
    return new Promise(res=>{const d=document.createElement("dialog");d.className="dkpay";
      d.innerHTML=`<style>.dkpay{border:0;padding:0;margin:0;max-width:none;max-height:none;width:100%;height:100%;background:rgba(43,35,64,.45);display:grid;place-items:end center;font-family:system-ui,sans-serif}.dkpay::backdrop{background:none}.dkpay .bx{background:#FFF6EC;color:#2B2340;width:100%;max-width:440px;border-radius:24px 24px 0 0;padding:22px 18px 26px;display:grid;gap:10px}.dkpay h3{margin:0 0 4px;font-size:20px}.dkpay button{padding:14px 16px;border-radius:16px;border:2px solid rgba(43,35,64,.15);background:#fff;font:600 16px system-ui,sans-serif;color:#2B2340;display:flex;justify-content:space-between;cursor:pointer}.dkpay button.x{justify-content:center;background:none;border:0;font-weight:500;color:#5d5670}.dkpay small{color:#776f8a;font-weight:500}</style>
        <div class="bx"><h3>Choose your DeepKids Plus</h3>${P.map((p,i)=>`<button data-i="${i}"><span>${per(p)}${p.months>1?` <small>(${inr(Math.round(p.inr/p.months))}/month)</small>`:""}</span><span>${inr(p.inr)}</span></button>`).join("")}<button class="x" data-i="-1">Not now</button></div>`;
      let got=false;const end=v=>{if(got)return;got=true;d.remove();res(v)};
      d.onclick=e=>{const b=e.target.closest("button");if(!b&&e.target!==d)return;const i=b?+b.dataset.i:-1;end(i>=0?P[i]:null)};d.oncancel=()=>end(null);document.body.appendChild(d);d.showModal()})}
  let rzpLoad=null;
  function razorpay(){return rzpLoad=rzpLoad||(window.Razorpay?Promise.resolve():load("https://checkout.razorpay.com/v1/checkout.js").catch(e=>{rzpLoad=null;throw e}))}
  async function upgrade(){
    const price=await pickPrice();if(!price)return false;
    await razorpay();const o=await fn("plus",{action:"order",months:price.months});
    /* the app's sheet is a modal dialog that would sit above Razorpay's window; close it (the app restores its state) */
    document.querySelectorAll("dialog[open]").forEach(d=>d.close());
    return new Promise(res=>{let done=false;const fin=v=>{if(!done){done=true;res(v)}};
      const rzp=new window.Razorpay({key:o.key_id,order_id:o.order_id,amount:o.amount,currency:o.currency,name:"DeepKids",description:"DeepKids Plus · "+per(price),
        prefill:{email:o.email,name:o.name},theme:{color:"#8E8DD8"},
        modal:{ondismiss:()=>fin(false)},
        handler:async r=>{try{const v=await fn("plus",{action:"verify",...r});plus.until=v.valid_until;if(plusOn()){caps.sample=makeSample();fin(true)}else fin(false)}catch(e){fin(false)}}});
      rzp.open()})}

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
    // the content is the big download: start it now, while signing in happens. Its version changes only when the
    // lessons change, so after the first visit it comes from the phone's cache
    const content=load("/data.js?v="+(window.DK_DATAV||window.DK_BUILD||""));content.catch(()=>{});
    if(T){sb=T.supabase;session=T.session;uid=session.user.id}
    else{if(!ready)return signInScreen();sb=window.supabase.createClient(C.supabaseUrl,C.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:"pkce"}});
      const {data}=await sb.auth.getSession();session=data?.session;
      if(!session)return signInScreen(new URLSearchParams(location.search).get("error_description")||"");
      uid=session.user.id;if(location.search.includes("code="))history.replaceState(null,"",location.pathname);
      sb.auth.onAuthStateChange((ev,s)=>{if(ev==="SIGNED_OUT")location.reload();if(s)session=s})}
    await plusStatus();install();await startSW();
    const wait=document.getElementById("dkLoading");if(wait)wait.textContent="Getting your lessons ready…";
    await content;await load("/app.js?v="+(window.DK_APPV||window.DK_BUILD||""));wait?.remove()}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();
