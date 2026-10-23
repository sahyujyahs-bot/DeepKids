















































































































































































































































































































































































































































































































































































const DATA = window.DK_DATA;
const SUBJ = {...DATA.subjects,dks:"DeepKids Science",wml:"Main lesson",wart:"Arts & handwork"}, SUBJ_KEYS = Object.keys(SUBJ);
DATA.prepgen.guide.dks=DATA.prepgen.guide.dks||"DeepKids Science starts from a big question. Read the topic story yourself first, then let your child wonder out loud before you explain anything. Their questions matter more than the answers.";
DATA.prepgen.guide.wml="Prepare tomorrow's story the night before so you can tell it in your own words. Keep the rhythm: circle, recall, new content, Main Lesson Book, practice, closing.";DATA.prepgen.guide.wart="Lay out the materials before you begin: a cloth on the table, water, the paper soaked for painting.";DATA.prepgen.prep.wml=[["read",1,"Read tomorrow's story or lesson and practise telling it (10 min)","The day plan in DeepKids"]];DATA.prepgen.prep.wart=[["act",0,"Lay out today's art materials","Around the house"]];DATA.prepgen.prep.dks=DATA.prepgen.prep.dks||[["read",1,"Read the topic story and its big question yourself (5 min)","The topic page in DeepKids"],["act",0,"Keep a wonder notebook handy for your child's questions","At home"]];
const BOARDS = {ncert:"NCERT / CBSE",cambridge:"Cambridge Primary",nios:"NIOS (Open Basic Education)",waldorf:"Waldorf"};
const STATUS = {none:"Not started",learning:"Learning",completed:"Completed",mastered:"Mastered"};
const DAYN=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DEF_DAYS={math:[1,2,3,4,5],eng:[1,2,4,5],hin:[2,4],sci:[1,3,5],dks:[1,2,3,4,5],wml:[1,2,3,4,5],wart:[1,2,3,4,5]};
const DEF_HPD={math:1,eng:0.75,hin:0.5,sci:0.75,dks:0.5,wml:1.5,wart:0.75};
const DEF_DAY={prepAt:"07:30",start:"09:30",brk:15,lunch:"13:00",lunchMin:45,eveAt:"20:30"};
const SCOL={math:"var(--teal)",eng:"var(--grape)",hin:"var(--tomato)",sci:"var(--leaf)",dks:"var(--peri)",wml:"var(--sun)",wart:"var(--gum)"};
const PRESET_EXP={A1:["Lotus seeds (Kamali): change water","Alum crystal (Fitkari): check growth","World in a Jar: look for droplets","Bread mould bag: look, never open"],A5:["Moong sprouts: light vs dark"],B5:["Moon diary: draw tonight's Moon"],B10:["Bury test: dig up after 3 weeks"]};
const iso=d=>{const x=new Date(d);return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0")};
const parse=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
let today=iso(new Date()),dayNo=Math.floor(parse(today)/864e5);
function rollDay(){const t=iso(new Date());if(t===today)return false;today=t;dayNo=Math.floor(parse(today)/864e5);_sess=null;ui.more={};ui.jokes={};ui.open={};return true}
const fmt=s=>parse(s).toLocaleDateString(undefined,{weekday:"short",day:"numeric",month:"short"});
const monday=()=>{const d=new Date();d.setDate(d.getDate()-((d.getDay()+6)%7));return iso(d)};
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fh=h=>(Math.round(h*4)/4).toString();
const mins=h=>{const m=Math.round(h*60);return m>=60?`${fh(m/60)} h`:`${m} min`};
const fresh=()=>({setup:false,child:"",age:6,board:"ncert",plus:true,subjects:["math","eng","hin","sci","dks"],levels:{math:1,eng:1,hin:1,sci:1,dks:1},start:monday(),days:DEF_DAYS,hpd:DEF_HPD,progress:{},log:[],exps:[],skips:{},hrs:{},games:{},steps:{},tasks:{},ans:{},events:[],prep:{},tl:{},day:DEF_DAY,hideHow:false,updatedAt:0});
let S=fresh(),store=null,saving=Promise.resolve(),saveTimer=null,syncMode="device",tab="today",ob=null;
const ui={open:{},pm:0,pv:"week",dump:{},view:{},ctab:{},qi:{},wsec:{},game:"word",jokes:{},more:{},sheet:null,back:null,sel:{},week:0,wday:null,wview:"lanes",lsub:null,timer:null};

/* ---------- sound: a tiny synth; the browser only allows it after a tap ---------- */
let AC=null,soundOn=true;try{soundOn=localStorage.getItem("dk-sound")!=="off"}catch(e){}
function tone(f,t0,d,type="sine",g=.12){const o=AC.createOscillator(),v=AC.createGain(),t=AC.currentTime+t0;o.type=type;o.frequency.setValueAtTime(f,t);v.gain.setValueAtTime(0,t);v.gain.linearRampToValueAtTime(g,t+.01);v.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(v).connect(AC.destination);o.start(t);o.stop(t+d+.02)}
const SFX={tap:()=>tone(660,0,.07,"triangle",.08),tick:()=>{tone(784,0,.08);tone(1046,.07,.12)},ok:()=>{tone(523,0,.1);tone(659,.09,.1);tone(784,.18,.18)},no:()=>{tone(220,0,.18,"square",.05);tone(180,.12,.2,"square",.05)},
  flip:()=>{tone(400,0,.06,"triangle",.06);tone(600,.05,.08,"triangle",.06)},win:()=>[523,659,784,1046,1318].forEach((f,i)=>tone(f,i*.08,.22,"triangle",.1)),key:()=>tone(900,0,.03,"square",.03)};
function sfx(k){if(!soundOn||!SFX[k])return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==="suspended")AC.resume();SFX[k]()}catch(e){}}
function confetti(){if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;const c=document.createElement("canvas");c.className="confetti";c.width=innerWidth;c.height=innerHeight;document.body.appendChild(c);const x=c.getContext("2d");
  const cols=["#F2603F","#FFB21E","#38A862","#3E86F5","#8C5CF0","#F06BA8"];const P=Array.from({length:90},()=>({x:innerWidth/2,y:innerHeight*.6,vx:(Math.random()-.5)*12,vy:-Math.random()*14-4,r:Math.random()*6+4,c:cols[Math.random()*6|0],a:Math.random()*6}));
  let n=0;(function f(){x.clearRect(0,0,c.width,c.height);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.45;p.a+=.2;x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillStyle=p.c;x.fillRect(-p.r/2,-p.r/2,p.r,p.r*.6);x.restore()});if(++n<80)requestAnimationFrame(f);else c.remove()})()}
function toast(m,ms){document.querySelectorAll(".toast").forEach(t=>t.remove());const t=document.createElement("div");t.className="toast";t.textContent=m;const sh=document.getElementById("sheet");(sh&&sh.open?sh:document.body).appendChild(t);setTimeout(()=>t.remove(),ms||Math.max(2200,m.length*60))}

/* ---------- persistence: one private document per viewer; the newer copy wins ---------- */
let ACC=null,DBR=null,UIDR=null,unsub=null;
const LSK=()=>"dk-state-"+(ACC||"guest");
const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}},lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}},lsDel=k=>{try{localStorage.removeItem(k)}catch(e){}};
async function boot(){
  ACC=lsGet("dk-acct");if(ACC){try{const ls=lsGet(LSK());if(ls)S={...fresh(),...JSON.parse(ls)}}catch(e){}}if(!ACC||S.setup)render();
  try{const [db,user]=await Promise.all([window.claude?.use?.("db"),window.claude?.use?.("user")]);UIDR=db&&user?await user.id():null;DBR=UIDR?db:null}catch(e){DBR=null}
  if(DBR&&!ACC){try{const s=await DBR.doc("data/users/"+UIDR+"/session").get();if(s.exists&&s.data().acct){ACC=String(s.data().acct);lsSet("dk-acct",ACC)}}catch(e){}}
  if(ACC)await openAccount(ACC);else render()}
async function openAccount(acct,name){ACC=acct;lsSet("dk-acct",acct);if(unsub){try{unsub()}catch(e){}unsub=null}store=null;
  let local=null;try{const ls=lsGet(LSK());if(ls)local=JSON.parse(ls)}catch(e){}
  if(!local){const v2=lsGet("dk-state-v2");if(v2&&!lsGet("dk-v2-migrated")){try{local=JSON.parse(v2)}catch(e){}lsSet("dk-v2-migrated","1")}}
  S={...fresh(),...(local||{})};ob=null;if(S.setup||!DBR)render();
  if(DBR){try{store=DBR.doc("data/users/"+UIDR+"/acct_"+acct);const snap=await store.get();const remote=snap.exists?snap.data():null;
      const ks=await DBR.doc("data/users/"+UIDR+"/session").get().catch(()=>null),known=(ks&&ks.exists&&ks.data())||{};let legacy=null;
      if(!known.migrated){const old=await DBR.doc("data/users/"+UIDR+"/planner").get().catch(()=>null);if(old&&old.exists)legacy=old.data()}
      const cands=[local,remote,legacy].filter(x=>x&&x.setup!==undefined).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));
      if(cands.length){let m=cands[0];cands.slice(1).forEach(c=>m=mergeIn(m,c));S={...fresh(),...m};ob=null}
      if(name&&!S.parent?.name)S.parent={...(S.parent||{}),name};
      S.acct=acct;S.updatedAt=Math.max(S.updatedAt||0,1);await store.set(JSON.parse(JSON.stringify(S)));
      await DBR.doc("data/users/"+UIDR+"/session").set({acct,at:Date.now(),migrated:true});
      lsSet(LSK(),JSON.stringify(S));syncMode="account";lastSaved=Date.now();
      unsub=store.onSnapshot(s=>{const r=s.exists?s.data():null;if(r&&r.setup!==undefined&&(r.updatedAt||0)>(S.updatedAt||0)){S={...fresh(),...r};lsSet(LSK(),JSON.stringify(S));render()}},()=>{})}
    catch(e){console.warn("account sync failed",e);store=null;syncMode="device"}}
  else{if(name&&!S.parent?.name)S.parent={...(S.parent||{}),name};S.acct=acct;lsSet(LSK(),JSON.stringify(S))}
  const k=JSON.parse(lsGet("dk-known")||"[]").filter(x=>x.acct!==acct);k.unshift({acct,name:S.parent?.name||name||"",child:S.child||""});lsSet("dk-known",JSON.stringify(k.slice(0,5)));
  render()}
function mergeIn(a,b){const key=l=>l.date+"|"+l.key+"|"+l.kind,seen=new Set((a.log||[]).map(key));
  const log=[...(a.log||[]),...(b.log||[]).filter(l=>!seen.has(key(l)))].sort((x,y)=>x.date<y.date?1:x.date>y.date?-1:0).slice(0,3000);
  const progress={...(b.progress||{}),...(a.progress||{})};Object.entries(b.progress||{}).forEach(([k,q])=>{const p=(a.progress||{})[k];if(p&&(q.sessions||0)>(p.sessions||0))progress[k]={...p,sessions:q.sessions,status:rank[q.status]>rank[p.status]?q.status:p.status}});
  const keep=o=>Object.fromEntries(Object.entries(o||{}).filter(([,v])=>v!==""&&v!=null));
  return {...a,log,progress,steps:{...(b.steps||{}),...(a.steps||{})},prep:{...(b.prep||{}),...(a.prep||{})},tasks:{...(b.tasks||{}),...(a.tasks||{})},ans:{...(b.ans||{}),...(a.ans||{})},games:{...(b.games||{}),...(a.games||{})},wk:{...(b.wk||{}),...(a.wk||{})},quiz:{...(b.quiz||{}),...(a.quiz||{})},work:Array.isArray(a.work)||Array.isArray(b.work)?(()=>{const m=new Map();[...(Array.isArray(b.work)?b.work:[]),...(Array.isArray(a.work)?a.work:[])].forEach(w=>w&&w.id&&m.set(w.id,{...(m.get(w.id)||{}),...w}));return [...m.values()]})():a.work,mins:(()=>{const m={...(b.mins||{})};Object.entries(a.mins||{}).forEach(([k,v])=>{m[k]=Math.max(v,m[k]||0)});return m})(),cal:(a.cal?.at||0)>=(b.cal?.at||0)?a.cal:b.cal,school:{...(b.school||{}),...(a.school||{})},evlog:{...(b.evlog||{}),...(a.evlog||{})},evoff:{...(b.evoff||{}),...(a.evoff||{})},snz:{...(b.snz||{}),...(a.snz||{})},rem:{...(b.rem||{}),...(a.rem||{})},parent:{...keep(b.parent),...keep(a.parent)}}}
async function logout(){if(store){clearTimeout(saveTimer);await writeNow().catch(()=>{})}if(unsub){try{unsub()}catch(e){}unsub=null}
  if(DBR){try{await DBR.doc("data/users/"+UIDR+"/session").set({acct:null,at:Date.now(),migrated:true})}catch(e){}}
  lsDel("dk-acct");ACC=null;store=null;S=fresh();ob=null;render()}
let lastSaved=0;
function writeNow(){const body=JSON.parse(JSON.stringify(S));const p=saving.then(()=>store.set(body)).then(()=>{syncMode="account";lastSaved=Date.now();return true},()=>{syncMode="device";return false});saving=p.then(()=>{});return p}
function save(){if(!ACC)return;lsSet(LSK(),JSON.stringify(S));
  if(!store)return;clearTimeout(saveTimer);saveTimer=setTimeout(writeNow,600)}
async function saveNow(){if(!ACC)return false;lsSet(LSK(),JSON.stringify(S));if(!store)return false;clearTimeout(saveTimer);return writeNow()}
addEventListener("pagehide",()=>{if(store&&saveTimer){clearTimeout(saveTimer);writeNow()}});
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"&&store){clearTimeout(saveTimer);writeNow()}});
const commit=()=>{S.updatedAt=Date.now();save();render()};

/* ---------- syllabus collation ---------- */
const boardsOn=()=>S.board==="combined"?["ncert","cambridge","nios"]:S.board==="none"?[]:[S.board];
const modeOf=()=>S.mode||(S.board==="none"?"plus":S.plus?"booksplus":"books");const plusOn=()=>modeOf()!=="books";
let SHARED={topics:[]};
const genUnit=g=>({k:"gen|"+g.id,board:"gen",subj:g.subj,level:g.level||1,book:"DeepKids topic",n:"★",title:g.name,dk:[],gen:g});
function genUnits(subj,lvl){const ex=(S.extra||{})[subj]||[];return SHARED.topics.filter(g=>g.subj===subj&&((g.level||1)===lvl||(lvl===S.levels[subj]&&(g.level||1)<lvl))&&ex.includes("gen|"+g.id)).map(genUnit)}
const DKSUB={dks:"sci"};
function dkUnits(subj,lvl){if(!DKSUB[subj])return [];const ex=(S.extra||{})[subj]||[],added=lvl===S.levels[subj]?DATA.topics.filter(t=>ex.includes("dk|"+t.id)):[],seen=new Set();
  return [...added,...(lvl===S.levels[subj]?DATA.topics.filter(t=>(t.subj||"sci")===DKSUB[subj]&&(t.cls||[1,2,3,4,5]).includes(lvl)):[])].filter(t=>!seen.has(t.id)&&seen.add(t.id)).map(t=>({k:"dk|"+t.id,board:"dk",subj:"dks",level:1,book:"DeepKids Science",n:t.id,title:t.name,dk:[],topic:t}))}
function collateAt(subj,lvl){return {board:DATA.items.filter(i=>i.subj===subj&&i.level===lvl&&boardsOn().includes(i.board)),dk:dkUnits(subj,lvl),gen:genUnits(subj,lvl),ex:addedUnits(subj,lvl)}}
function addedUnits(subj,lvl){if(lvl!==S.levels[subj])return [];const ex=(S.extra||{})[subj]||[];return DATA.items.filter(i=>i.subj===subj&&ex.includes(i.k)&&!(boardsOn().includes(i.board)&&i.level>=lvl))}
const collate=s=>collateAt(s,S.levels[s]);
function notesFor(subj,lvl){const n=[];boardsOn().forEach(b=>{const x=b==="ncert"?DATA.notes.ncert[subj+"|"+lvl]:(DATA.notes[b]?.[subj+"|"+lvl]??DATA.notes[b]?.[subj]);if(x)n.push(BOARDS[b]+": "+x)});
  if(S.plus&&subj==="sci"&&lvl!==1)n.push("DeepKids Plus Science for Level "+lvl+" is being written. Level 1 is ready.");if(S.plus&&subj!=="sci")n.push("DeepKids Plus "+SUBJ[subj]+" is being written.");return n}
function plannedAt(s,l){const c=collateAt(s,l),m=modeOf();let base=[];for(const b of boardsOn()){const u=c.board.filter(i=>i.board===b);if(u.length){base=u;break}}
  return orderUnits(s,base,m==="books"?[...c.ex,...c.gen]:[...c.ex,...c.dk,...c.gen],m==="plus"?1:2)}
function orderUnits(s,base,extra,every){const later=(S.later||{})[s]||[],nx=(S.next||{})[s]||[];
  let b=(S.shuffle||{})[s]?smartShuffle(base,s):base;const out=[];
  if(S.exam||!b.length||!extra.length)out.push(...b,...extra);else{let j=0;b.forEach((u,i)=>{out.push(u);if((i+1)%every===0&&j<extra.length)out.push(extra[j++])});out.push(...extra.slice(j))}
  const front=nx.map(k=>out.find(u=>u.k===k)).filter(Boolean),back=out.filter(u=>later.includes(u.k)&&!nx.includes(u.k));
  return [...front,...out.filter(u=>!nx.includes(u.k)&&!later.includes(u.k)),...back]}
function smartShuffle(list,s){const R=rng(((S.seed||{})[s]||7)+list.length),left=[...list],out=[],placed=new Set(),inList=new Set(list.map(u=>u.k));
  while(left.length){const ok=left.filter(u=>prereqOf(u).every(k=>placed.has(k)||!inList.has(k)||rank[st(k)]>=2));const pool=ok.length?ok:[left[0]],pick=pool[Math.floor(R()*pool.length)];out.push(pick);placed.add(pick.k);left.splice(left.indexOf(pick),1)}return out}
function plannedUnits(s){const o=[];for(let l=S.levels[s];l<=5;l++)o.push(...plannedAt(s,l));return o}
const everyUnit=()=>S.subjects.flatMap(s=>[1,2,3,4,5].flatMap(l=>{const c=collateAt(s,l);return [...c.dk,...c.board,...c.gen,...c.ex]}));
const unitBy=k=>everyUnit().find(u=>u.k===k)||allUnits().find(u=>u.k===k);
const st=k=>S.progress[k]?.status||"none";const done=k=>S.progress[k]?.sessions||0;
const rank={none:0,learning:1,completed:2,mastered:3};
function coverage(u){if(u.board!=="dk"&&S.plus&&u.dk.length){const s=u.dk.map(id=>st("dk|"+id)),own=st(u.k);if(s.every(x=>rank[x]>=2))return rank[own]>2?own:"completed";if(s.some(x=>x!=="none")||own!=="none")return rank[own]>1?own:"learning";return own}return st(u.k)}
const daysOf=s=>(S.days[s]||DEF_DAYS[s]);const hpdOf=s=>(S.hpd&&S.hpd[s])||DEF_HPD[s];
const DEF_UNIT_H={ncert:{math:8,eng:5,hin:4,sci:8},cambridge:{math:30,eng:30,hin:30,sci:20},nios:{math:5,eng:5,hin:5,sci:5}};
const estHours=u=>u.c?.p?u.c.p.days.length*u.c.p.day_mins/60:u.board==="gen"?(+u.gen.hours||3):u.c?.x?.hours?u.c.x.hours.reduce((a,h)=>a+h[1],0):u.board==="dk"?u.topic.weeks*2.25:DEF_UNIT_H[u.board][u.subj];
const hoursFor=u=>S.hrs[u.k]??estHours(u);
const sessionsFor=u=>u.c?.p?u.c.p.days.length:Math.max(1,Math.ceil(hoursFor(u)/hpdOf(u.subj)-1e-9));
function schedule(subj,limitDays=420,fromTomorrow=false){
  const q=[];plannedUnits(subj).forEach(u=>{if(rank[coverage(u)]>=2)return;const tot=sessionsFor(u);for(let i=Math.min(done(u.k),tot-1);i<tot;i++)q.push({u,n:i+1,tot})});
  const queue=pinOrder(subj,q);
  const out=[];const days=daysOf(subj);let d=parse(S.start>today?S.start:today);const doneToday=S.log.some(l=>l.date===today&&l.subj===subj);
  for(let k=0;k<limitDays&&queue.length;k++){const s=iso(d);if(days.includes(d.getDay())&&!S.skips[s+"|"+subj]&&!(s===today&&(doneToday||fromTomorrow)))out.push({date:s,subj,...queue.shift()});d.setDate(d.getDate()+1)}
  return out}
const nextUp=s=>{const q=[];plannedUnits(s).forEach(u=>{if(rank[coverage(u)]>=2)return;const tot=sessionsFor(u);for(let i=Math.min(done(u.k),tot-1);i<tot;i++)q.push({u,n:i+1,tot})});return pinOrder(s,q)[0]};
function pinOrder(s,q){const pin=S.pin&&S.pin[s],NX=(S.next||{})[s]||[],P=q.filter(x=>x.u.k===pin),N=NX.flatMap(k=>q.filter(x=>x.u.k===k&&x.u.k!==pin)),R=q.filter(x=>x.u.k!==pin&&!NX.includes(x.u.k));return [...P,...N,...R.filter(x=>coverage(x.u)==="learning"),...R.filter(x=>coverage(x.u)!=="learning")]}
function logSession(u,kind){const p=S.progress[u.k]||{status:"none",sessions:0};p.sessions=(p.sessions||0)+1;if(p.status==="none")p.status="learning";if(p.sessions>=sessionsFor(u)&&p.status==="learning")p.status="completed";p.updated=today;S.progress[u.k]=p;
  {const d=new Date();S.log.unshift({date:today,key:u.k,subj:u.subj,title:u.title,kind,n:p.sessions,at:d.getHours()*60+d.getMinutes(),t:d.getTime()})}S.log=S.log.slice(0,3000);
  if(u.board==="dk")(PRESET_EXP[u.n]||[]).forEach(t=>addExp(t,u.title))}
function addExp(title,topic){if(!S.exps.some(e=>e.title===title&&!e.closed))S.exps.push({id:Math.random().toString(36).slice(2,9),title,topic,start:today,checks:[],closed:false})}
const el=h=>{const t=document.createElement("template");t.innerHTML=h.trim();return t.content};
const chNo=u=>/^\d+$/.test(u.n)?"Ch "+u.n:"";
const lvlLabel=l=>{const x=DATA.levels[l];return `Level ${l} · Class ${x.cls} · age ${x.age}`};
const sticker=s=>`<span class="sticker ${s}">${STATUS[s]}</span>`;
/* ---------- day steps ---------- */
const HINT={wml:"Tell, don't read. Move it first, then draw it, then write it.",wart:"Process before product: enjoy the colours and the making.",dks:"Start from your child's own questions. There are no wrong answers here: ask “how do we know?” and try it out at home.",wml:"Tell, don't read. Move it first, then draw it, then write it.",wart:"Process before product: enjoy the colours and the making.",dks:"Start from your child's own questions. There are no wrong answers here: ask “how do we know?” and try it out at home.",wml:"Tell, don't read. Move it first, then draw it, then write it.",wart:"Process before product: enjoy the colours and the making.",dks:"Start from your child's own questions. There are no wrong answers here: ask “how do we know?” and try it out at home.",math:"Use real things for every problem (coins, beans, rotis, a ruler) before writing anything down.",eng:"Read aloud together, collect new words in a notebook, and ask your child to retell it in their own words.",hin:"Read aloud in Hindi, collect new words with meanings, and ask your child to retell it in Hindi.",sci:"Look for the idea in your own home or street before reading about it."};
const KIND=n=>/^Read/.test(n)?["read","Read","📖"]:/^What to learn/.test(n)?["learn","Learn & think","💡"]:/^Worksheet/.test(n)?["ws","Worksheet","✏️"]:/^Experiment/.test(n)?["exp","Experiment","🧪"]:/^Activit/.test(n)?["act","Activity","🧭"]:/^Game/.test(n)?["game","Game","🎲"]:/^Project/.test(n)?["proj","Project","🛠️"]:["step","Step","⭐"];
const TASKOF={ws:"ws",exp:"exp0",act:"act0",game:"game",proj:"proj"};
function daySteps(u,n,tot){if(u.c?.p)return packDay(u,n);const cap=hpdOf(u.subj);
  if(u.c?.x?.hours){const days=[];let cur=[],left=cap;u.c.x.hours.forEach(([name,h])=>{let rem=h,part=1;while(rem>1e-9){const take=Math.min(rem,left);cur.push({name,take,part});rem-=take;left-=take;part++;if(left<1e-9){days.push(cur);cur=[];left=cap}}});if(cur.length)days.push(cur);
    const parts={};days.flat().forEach(s=>parts[s.name]=Math.max(parts[s.name]||0,s.part));
    return (days[Math.min(n,days.length)-1]||[]).map(s=>{const [kind,label,icon]=KIND(s.name);return {kind,label,icon,title:s.name.replace(/^(Experiments?|Activities|Game|Project): /,"")+(parts[s.name]>1?` · part ${s.part} of ${parts[s.name]}`:""),mins:s.take,html:stepBody(u,s.name)}})}
  if(u.board==="dk"){const t=u.topic,k=t.sub.length;
    if(t.full)return [{kind:"game",label:"Lesson",icon:"👑",title:"The King's Doubt",mins:cap,html:`<p>${n===1?"The Proclamation, setting your rules, and the first guests.":n===tot?"The Nakkeeran challenge, the verdicts and the treats.":"The next investigation cards; check the lotus seeds and crystals."}</p>`}];
    if(n===1)return [{kind:"read",label:"Story",icon:"📖",title:"Start with the story",mins:cap*.6,html:`<p>${esc(t.summary)}</p>`},{kind:"learn",label:"Wonder",icon:"💡",title:"Wonder together",mins:cap*.4,html:`<div class="ask">${esc(t.oneness)}</div>`}];
    const i=Math.min(k-1,Math.floor((n-2)*k/Math.max(1,tot-1)));
    return n===tot?[{kind:"learn",label:"Wrap up",icon:"🎤",title:"Teach it back",mins:cap,html:`<p>Your child teaches you the topic in five minutes.</p><div class="ask">${esc(t.oneness)}</div>`}]:[{kind:"exp",label:"Explore",icon:"🧭",title:t.sub[i].slice(0,60)+(t.sub[i].length>60?"…":""),mins:cap,html:`<p>${esc(t.sub[i])}</p><p class="small muted">${esc(HINT.sci)}</p>`}]}
  const w=`${esc(u.book)}${chNo(u)?", "+chNo(u):""}`;
  const A=n===1?[["read","Read","📖","Open the chapter",.6,`Read the first part of <b>${w}</b> together. Ask what your child thinks it's about.`],["act","Try it","🧭","Hands-on",.4,esc(HINT[u.subj])]]
   :n===tot?[["act","Finish","🧭","Last activities",.5,`Do the final activities in <b>${w}</b>.`],["learn","Review","🎤","Teach it back",.3,"Your child explains the chapter to you, as if you were the student."],["ws","Mark","✅","Mark it done",.2,"If it feels solid, mark the chapter Completed in Topics."]]
   :[["read","Continue","📖","Continue the chapter",.6,`Carry on in <b>${w}</b> from where you stopped.`],["act","Practice","🧭","Hands-on practice",.3,esc(HINT[u.subj])],["ws","Note","📝","Note what's hard",.1,"Write down anything that needs another go."]];
  return A.map(([kind,label,icon,title,f,html])=>({kind,label,icon,title,mins:cap*f,html,generic:true}))}

function dailyUnit(){if(!S.subjects.includes("sci"))return null;const sc=schedule("sci",60);const t=sc.find(x=>x.u.c?.x);if(t)return t.u;const any=S.log.find(l=>unitBy(l.key)?.c?.x);if(any)return unitBy(any.key);return DATA.items.find(i=>i.c?.x)||null}
const G=()=>(S.games[today]=S.games[today]||{g:[],tf:{},odd:null});
const splitJoke=j=>{const m=j.match(/^(.*?\?)\s*(.*)$/);return m?[m[1],m[2]]:[j,""]};
const taskDone=(k,id)=>!!(S.tasks[k]&&S.tasks[k][id]);
function chapterTasks(u){const c=u.c;return [["ws","✏️","Worksheet",c.x.wsd.length+" sections: "+c.x.wsd.map(s=>s[0].replace(/^[A-Z]\. /,"")).join(", ")],...c.exp.map((e,i)=>["exp"+i,"🧪","Experiment "+(i+1),e]),...c.act.map((e,i)=>["act"+i,"🧭","Activity "+(i+1),e]),["game","🎲",c.game[0],c.game[1]],["proj","🛠️",c.proj[0],c.proj[1]+" You end up with: "+c.proj[2]+"."]]}
const A=(k,id)=>(S.ans[k]||{})[id];
function setA(k,id,v){S.ans[k]=S.ans[k]||{};S.ans[k][id]=v}
const hm=s=>{const [h,m]=String(s||"0:0").split(":").map(Number);return h*60+(m||0)};
const clock=m=>{m=Math.round(m);let h=Math.floor(m/60)%24,mm=String(m%60).padStart(2,"0");const ap=h<12?"am":"pm";h=h%12||12;return `${h}:${mm} ${ap}`};
const D=()=>({...DEF_DAY,...(S.day||{})});
const Dd=date=>({...D(),...((S.dayW||{})[parse(date).getDay()]||{}),...((S.dayOver||{})[date]||{})});
const addDays=(s,n)=>{const d=parse(s);d.setDate(d.getDate()+n);return iso(d)};
const todosOn=date=>(S.todos||[]).filter(x=>x.date===date||(date===today&&x.date<date&&!x.done)||(x.done&&x.doneOn===date&&x.date!==date));
const eventsOn=date=>[...(S.events||[]),...(S.cal?.on?S.cal.ev||[]:[])].filter(e=>!S.evoff?.[date+"|"+e.id]).filter(e=>e.rep==="weekly"?e.days.includes(parse(date).getDay())&&date>=e.from:e.date===date).sort((a,b)=>hm(a.start)-hm(b.start));
const ncertWhere=(u,w)=>u.board==="ncert"?w:w.replace(/ or the NCERT PDF \(ncert\.nic\.in\/textbook\.php\)/,"");
function prepFor(u,n,tot){if(u.c?.p)return packPrep(u,n);const kinds=new Set(daySteps(u,n,tot).map(s=>s.kind));let L=[];
  if(u.c?.x?.prep){L=u.c.x.prep.filter(p=>kinds.has(p[0]));if(n===1)L=[["guide",1,"Read this chapter's parent guide (3 min)","Here, at the top of this list"],...L]}
  else if(u.board==="dk")L=u.topic.full?[["print",2,"Print The King's Doubt cards, rule scrolls and the comic parent guide","The DeepKids printables for topic A1"],["read",1,"Read the parent guide comic once before you play","The printed guide"]]:[["read",1,"Read the topic summary and the wonder prompt (5 min)","The topic page in this app (Topics → "+u.title+")"]];
  else L=(DATA.prepgen.prep[u.subj]||[]).map(p=>[p[0],p[1],p[2],ncertWhere(u,p[3])]);
  return L.map((p,i)=>({id:`p|${u.k}|${n}|${i}`,kind:p[0],lead:p[1],task:p[2],where:p[3]}))}
let _sess=null;
function upcoming(){if(_sess)return _sess;const out=[];S.subjects.forEach(s=>schedule(s,12).forEach(x=>out.push(x)));return _sess=out.sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:SUBJ_KEYS.indexOf(a.subj)-SUBJ_KEYS.indexOf(b.subj))}
const LEARNK=new Set(["guide","read","learn"]);
function prepBlock(date,when){const items=[];
  upcoming().forEach(x=>{if(x.date<date)return;prepFor(x.u,x.n,x.tot).forEach(p=>{const due=addDays(x.date,-p.lead);let ok=false;
    if(when==="am")ok=(p.lead===0&&x.date===date)||(p.lead>=2&&due===date)||(date===today&&due<date&&(!S.prep[p.id]||S.prep[p.id]===today));
    else ok=p.lead===1&&due===date;
    if(ok&&!LEARNK.has(p.kind))items.push({...p,x,early:p.lead>=2&&x.date!==date})})});
  return items}
const prepMins=its=>Math.max(10,its.reduce((a,p)=>a+(p.kind==="guide"?3:6),0));
function lessonsOn(date){const L=[];S.subjects.forEach(s=>{
    if(date<=today){S.log.filter(l=>l.date===date&&l.subj===s&&l.kind!=="free").slice().reverse().forEach(l=>{const u=unitBy(l.key);if(u)L.push({s,u,done:true,title:l.title,at:l.at,n:l.n,tot:sessionsFor(u),skipped:l.kind==="skipped"})});
      if(date===today&&ui.more[s]){const nx=nextUp(s);if(nx&&!(L.some(z=>z.s===s&&!z.done)))L.push({s,u:nx.u,n:nx.n,tot:nx.tot,bonus:true})}}
    const x=upcoming().find(z=>z.subj===s&&z.date===date);if(x&&!(date===today&&ui.more[s]))L.push({s,u:x.u,n:x.n,tot:x.tot})});return L}
function dayPlan(date){const d=Dd(date),items=[],ev=eventsOn(date),isT=date===today;
  const am=prepBlock(date,"am"),pm=prepBlock(date,"pm");
  if(am.length)items.push({id:"am",at:hm(d.prepAt),dur:prepMins(am),who:"you",kind:"prep",title:"Your morning prep",sub:`${am.length} things to get ready`+(am.some(p=>p.early)?" · includes early starts":""),prep:am,done:am.every(p=>S.prep[p.id])});
  const lessons=lessonsOn(date);const fixed=[{a:hm(d.lunch),b:hm(d.lunch)+(+d.lunchMin)},...ev.filter(e=>e.start).map(e=>({a:hm(e.start),b:e.end?hm(e.end):hm(e.start)+60}))];
  let cur=hm(d.start);const place=dur=>{let moved=true;while(moved){moved=false;for(const f of fixed){if(cur<f.b&&cur+dur>f.a){cur=f.b;moved=true}}}const at=cur;cur+=dur;return at};
  if(lessons.length){if(S.board!=="waldorf")items.push({id:"warm",at:place(15),dur:15,who:"both",kind:"warm",title:"Warm-up: jokes and Word of the Day",sub:"Start the day laughing",done:!!S.tl[date+"|warm"]||(isT&&(G().g.length>0))});
    const rf=rfPlan(date);if(rf)items.push({id:"refresh",at:place(rf.mins),dur:rf.mins,who:"both",kind:"refresh",title:"Refresher: "+rf.title,sub:rf.sub,rf,done:!!S.tl[date+"|refresh"]});
    const open=S.exps.filter(e=>!e.closed&&e.start<=date);if(open.length)items.push({id:"exps",at:place(5),dur:5,who:"both",kind:"exps",title:"Daily check-ins",sub:open.map(e=>e.title).slice(0,2).join(" · ")+(open.length>2?` +${open.length-2}`:""),done:isT&&open.every(e=>e.checks.includes(today))});cur+=5}
  lessons.forEach((l,i)=>{if(l.done&&l.at!=null){items.push({id:"L-"+l.s+"d"+i,at:l.at,doneAt:l.at,dur:lessonMins(l.s,date),who:"both",kind:"lesson",s:l.s,u:l.u,n:l.n,tot:l.tot,title:SUBJ[l.s]+": "+l.u.title,sub:l.skipped?"Skipped":"Done ✓",skipped:l.skipped,done:true});return}const dur=lessonMins(l.s,date),lastEnd=cur;if(i>0)cur+=+d.brk;const at=place(dur);if(i>0&&+d.brk&&at===lastEnd+ +d.brk)items.push({id:"brk"+i,at:lastEnd,dur:+d.brk,who:"free",kind:"brk",title:"Break: water, snack, move"});items.push({id:"L-"+l.s+(l.bonus?"b":"")+i,at,dur,who:"both",kind:"lesson",s:l.s,u:l.u,n:l.n,tot:l.tot,bonus:!!l.bonus,doneNoTime:!!l.done,title:(l.bonus?"Bonus · ":"")+SUBJ[l.s]+": "+(l.u.subj==="wart"&&l.u.c?.p?pkDay(l.u,l.n).title:l.u.title),sub:l.done?"Done ✓":`Part ${l.n} of ${l.tot}`+(l.u.c?.x?` · ${daySteps(l.u,l.n,l.tot).map(z=>z.label).join(", ")}`:""),done:!!l.done});
});
  if(lessons.some(l=>!l.bonus)&&plusOn()&&S.subjects.includes("sci")&&dkMinsOf()>0){const pk=dkPick(date,lessons);if(pk){const dur=dkMinsOf();cur+=+d.brk;items.push({id:"dkt",at:place(dur),dur,who:"both",kind:"dkt",u:pk.u,title:"DeepKids topic: "+pk.u.title,sub:pk.why,done:!!S.tl[date+"|dkt"]})}}
  if(!lessons.length){const rf=rfPlan(date);if(rf)items.push({id:"refresh",at:place(rf.mins),dur:rf.mins,who:"both",kind:"refresh",title:"Refresher: "+rf.title,sub:rf.sub,rf,done:!!S.tl[date+"|refresh"]})}
  if(lessons.some(l=>!l.bonus)&&plusOn()&&S.subjects.includes("sci")&&dkMinsOf()>0){const pk=dkPick(date,lessons);if(pk){const dur=dkMinsOf();cur+=+d.brk;items.push({id:"dkt",at:place(dur),dur,who:"both",kind:"dkt",u:pk.u,title:"DeepKids topic: "+pk.u.title,sub:pk.why,done:!!S.tl[date+"|dkt"]})}}
  if(!lessons.length){const rf=rfPlan(date);if(rf)items.push({id:"refresh",at:place(rf.mins),dur:rf.mins,who:"both",kind:"refresh",title:"Refresher: "+rf.title,sub:rf.sub,rf,done:!!S.tl[date+"|refresh"]})}
  if(lessons.some(l=>!l.bonus)&&plusOn()&&S.subjects.includes("sci")&&dkMinsOf()>0){const pk=dkPick(date,lessons);if(pk){const dur=dkMinsOf();cur+=+d.brk;items.push({id:"dkt",at:place(dur),dur,who:"both",kind:"dkt",u:pk.u,title:"DeepKids topic: "+pk.u.title,sub:pk.why,done:!!S.tl[date+"|dkt"]})}}
  if(!lessons.length){const rf=rfPlan(date);if(rf)items.push({id:"refresh",at:place(rf.mins),dur:rf.mins,who:"both",kind:"refresh",title:"Refresher: "+rf.title,sub:rf.sub,rf,done:!!S.tl[date+"|refresh"]})}
  if(lessons.some(l=>!l.bonus)&&plusOn()&&S.subjects.includes("sci")&&dkMinsOf()>0){const pk=dkPick(date,lessons);if(pk){const dur=dkMinsOf();cur+=+d.brk;items.push({id:"dkt",at:place(dur),dur,who:"both",kind:"dkt",u:pk.u,title:"DeepKids topic: "+pk.u.title,sub:pk.why,done:!!S.tl[date+"|dkt"]})}}
  if(!lessons.length){const rf=rfPlan(date);if(rf)items.push({id:"refresh",at:place(rf.mins),dur:rf.mins,who:"both",kind:"refresh",title:"Refresher: "+rf.title,sub:rf.sub,rf,done:!!S.tl[date+"|refresh"]})}
  if(lessons.some(l=>!l.bonus)&&plusOn()&&S.subjects.includes("sci")&&dkMinsOf()>0){const pk=dkPick(date,lessons);if(pk){const dur=dkMinsOf();cur+=+d.brk;items.push({id:"dkt",at:place(dur),dur,who:"both",kind:"dkt",u:pk.u,title:"DeepKids topic: "+pk.u.title,sub:pk.why,done:!!S.tl[date+"|dkt"]})}}
  if(!lessons.length){const rf=rfPlan(date);if(rf)items.push({id:"refresh",at:place(rf.mins),dur:rf.mins,who:"both",kind:"refresh",title:"Refresher: "+rf.title,sub:rf.sub,rf,done:!!S.tl[date+"|refresh"]})}
  if(lessons.some(l=>!l.bonus)&&plusOn()&&S.subjects.includes("sci")&&dkMinsOf()>0){const pk=dkPick(date,lessons);if(pk){const dur=dkMinsOf();cur+=+d.brk;items.push({id:"dkt",at:place(dur),dur,who:"both",kind:"dkt",u:pk.u,title:"DeepKids topic: "+pk.u.title,sub:pk.why,done:!!S.tl[date+"|dkt"]})}}
  if(!lessons.length){const rf=rfPlan(date);if(rf)items.push({id:"refresh",at:place(rf.mins),dur:rf.mins,who:"both",kind:"refresh",title:"Refresher: "+rf.title,sub:rf.sub,rf,done:!!S.tl[date+"|refresh"]})}
  if(lessons.some(l=>!l.bonus)&&plusOn()&&S.subjects.includes("sci")&&dkMinsOf()>0){const pk=dkPick(date,lessons);if(pk){const dur=dkMinsOf();cur+=+d.brk;items.push({id:"dkt",at:place(dur),dur,who:"both",kind:"dkt",u:pk.u,title:"DeepKids topic: "+pk.u.title,sub:pk.why,done:!!S.tl[date+"|dkt"]})}}
  if(!lessons.length){const rf=rfPlan(date);if(rf)items.push({id:"refresh",at:place(rf.mins),dur:rf.mins,who:"both",kind:"refresh",title:"Refresher: "+rf.title,sub:rf.sub,rf,done:!!S.tl[date+"|refresh"]})}
  if(lessons.some(l=>!l.bonus)&&plusOn()&&S.subjects.includes("sci")&&dkMinsOf()>0){const pk=dkPick(date,lessons);if(pk){const dur=dkMinsOf();cur+=+d.brk;items.push({id:"dkt",at:place(dur),dur,who:"both",kind:"dkt",u:pk.u,title:"DeepKids topic: "+pk.u.title,sub:pk.why,done:!!S.tl[date+"|dkt"]})}}
  if(!lessons.length){const rf=rfPlan(date);if(rf)items.push({id:"refresh",at:place(rf.mins),dur:rf.mins,who:"both",kind:"refresh",title:"Refresher: "+rf.title,sub:rf.sub,rf,done:!!S.tl[date+"|refresh"]})}
  if(lessons.length)items.push({id:"lunch",at:hm(d.lunch),dur:+d.lunchMin,who:"free",kind:"brk",title:"Lunch"});
  ev.forEach(e=>items.push({id:"e-"+e.id,at:e.start?hm(e.start):24*60-1,anytime:!e.start,dur:e.start&&e.end?Math.max(15,hm(e.end)-hm(e.start)):15,who:e.kind==="outing"?"out":e.who,kind:"event",ev:e,title:e.title,sub:evSub(e)+(e.start?"":e.allDay?" · all day":" · time not set"),done:!!S.tl[date+"|e-"+e.id]}));
  todosOn(date).forEach(td=>items.push({id:"t-"+td.id,at:24*60-1,dur:15,anytime:true,who:td.who||"you",kind:"todo",td,title:td.title,sub:(td.date<date?"Carried over from "+fmt(td.date):"Any time today")+(td.note?" · "+td.note:""),done:!!td.done&&td.doneOn===date}));
  if(parse(date).getDay()===0)items.push({id:"weekplan",at:hm(d.eveAt)-20,dur:15,who:"you",kind:"plan",title:"Plan next week",sub:"Add classes, outings and family plans for the coming week",done:!!S.tl[date+"|weekplan"]});
  if(pm.length)items.push({id:"pm",at:hm(d.eveAt),dur:prepMins(pm),who:"you",kind:"prep",title:"Prep for tomorrow",sub:`${pm.length} things for ${fmt(addDays(date,1))}`,prep:pm,done:pm.every(p=>S.prep[p.id])});
  items.forEach(it=>{if(!it.done||it.kind==="event"||it.kind==="lesson")return;const v=S.tl[date+"|"+it.id];if(typeof v==="number"&&v>1e12){const x=new Date(v);it.at=it.doneAt=x.getHours()*60+x.getMinutes()}else if(it.kind!=="prep")it.doneNoTime=true});
  return items.sort((a,b)=>a.at-b.at||(a.kind==="prep"?-1:1))}
/* ================= UI ================= */
const IC={
 grid:'<rect x="4" y="4" width="7" height="7" rx="2.5"/><rect x="13" y="4" width="7" height="7" rx="2.5"/><rect x="4" y="13" width="7" height="7" rx="2.5"/><circle cx="16.5" cy="16.5" r="3.5"/>',
 today:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
 week:'<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4M8 14h2M12 14h2M16 14h.5"/>',
 library:'<path d="M4 4.5h4.5v15H4zM10 4.5h4.5v15H10zM16 5.5l3.8-1 3 14.2-3.8 1z" transform="translate(-1 0)"/>',
 tasks:'<path d="M10 6.5h10M10 12h10M10 17.5h10"/><path d="M3.5 6.5l1.6 1.6 2.7-2.9M3.5 12l1.6 1.6 2.7-2.9M3.5 17.5l1.6 1.6 2.7-2.9"/>',
 journey:'<path d="M3 20l6.5-11 4.5 7 2.5-3.5L21 20z"/><path d="M9.5 9V3.5l4 1.5-4 1.5"/>',
 read:'<path d="M3.5 5.5c0-.8.7-1.5 1.5-1.5h6v16H5a1.5 1.5 0 0 1-1.5-1.5zM20.5 5.5c0-.8-.7-1.5-1.5-1.5h-6v16h6c.8 0 1.5-.7 1.5-1.5z"/>',
 learn:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"/>',
 ws:'<path d="M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3"/>',
 exp:'<path d="M9 3h6M10 3v6l-5.2 9.1A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-2.9L14 9V3M7.2 15h9.6"/>',
 act:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
 game:'<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 9h.01M15 15h.01M15 9h.01M9 15h.01M12 12h.01" stroke-width="3"/>',
 proj:'<path d="M14 3.5l6.5 6.5-3 3L11 6.5zM11.5 7l-8 8 4 4 8-8"/>',
 prep:'<path d="M9 3.5h6v3H9zM7 5H5v16h14V5h-2M8.5 13l2.5 2.5 4.5-5"/>',
 event:'<path d="M5 21V4h11.5l-2.2 4 2.2 4H5"/>',
 warm:'<circle cx="12" cy="12" r="9"/><path d="M8.5 14a4 4 0 0 0 7 0M9 9.5h.01M15 9.5h.01" stroke-width="2.2"/>',
 brk:'<path d="M5 9h11v4a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10.5h1.5a2 2 0 0 1 0 4H16M8.5 3.5v2.5M12 3.5v2.5"/>',
 exps:'<path d="M12 21v-8M12 13c0-4-3-6.5-7.5-6.5 0 4.2 3 6.5 7.5 6.5zM12 11c0-3.5 2.4-6.5 7-6.5 0 3.5-2.4 6.5-7 6.5z"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5" stroke-width="2.4"/>',
 close:'<path d="M6 6l12 12M18 6L6 18"/>', plus:'<path d="M12 5v14M5 12h14"/>', next:'<path d="M9 6l6 6-6 6"/>', back:'<path d="M15 6l-6 6 6 6"/>',
 sound:'<path d="M4 9.5v5h3.5L13 19V5L7.5 9.5zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>', mute:'<path d="M4 9.5v5h3.5L13 19V5L7.5 9.5zM17 9.5l4.5 5M21.5 9.5L17 14.5"/>',
 play:'<path d="M8 5.5v13l10.5-6.5z"/>', pause:'<path d="M9 5.5v13M15 5.5v13" stroke-width="2.4"/>', spark:'<path d="M12 3l2.2 6.3L20.5 12l-6.3 2.2L12 20.5l-2.2-6.3L3.5 12l6.3-2.7z"/>'};
const icon=(n,c="")=>`<svg class="ico ${c}" viewBox="0 0 24 24" aria-hidden="true">${IC[n]||IC.spark}</svg>`;
const KL={read:"Read together",learn:"Learn & think",ws:"Worksheet",exp:"Experiment",act:"Activity",game:"Game",proj:"Project",step:"Step"};
const ROLE={you:"For you",both:"Together",kid:"Child goes",out:"Outing",free:"Break"};
const pillS=s=>`<span class="pill ${s}">${STATUS[s]}</span>`;
const SC=s=>"s-"+s;
const stepKey=(it)=>(it.bonus?"x":"")+it.u.k+"|"+it.n;
const longDate=()=>new Date().toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long"});

/* step bodies used by the lesson player */
const taskLine=(u,id,text)=>{if(WKID(id))return workCtl(u,id,text);const d=taskDone(u.k,id);return `<button class="tline ${d?"done":""}" data-act="task" data-k="${u.k}" data-id="${id}"><span class="ck">${icon("check")}</span><span>${esc(text)}</span></button>`};
function stepBody(u,name){const c=u.c,x=c.x,k=KIND(name)[0],L=a=>`<ul>${a.map(i=>`<li>${esc(i)}</li>`).join("")}</ul>`;
  if(k==="read")return `<p>Read <b>${esc(u.book)}, ${chNo(u)}</b> together. Let your child read parts aloud.</p><div class="ask"><span class="eyebrow">Stop and ask</span>${esc(x.deep[0].q)}</div>`;
  if(k==="learn")return `${L(x.learn)}<button class="btn soft sm" data-act="chapter" data-k="${u.k}" data-t="questions">Open the big questions</button>`;
  if(k==="ws")return `<p>${x.wsd.length} sections and ${x.wsd.reduce((a,s)=>a+s[1].length,0)} questions: drawing, tables, sorting, matching and thinking.</p><div class="row"><button class="btn accent sm" data-act="ws" data-k="${u.k}">Open the worksheet</button></div><div class="tasks-inline">${taskLine(u,"ws","Worksheet finished")}</div>`;
  if(k==="exp")return `<p class="sm muted">Tick each one when it's done.</p><div class="tasks-inline">${c.exp.map((e,i)=>taskLine(u,"exp"+i,e)).join("")}</div>`;
  if(k==="act")return `<p class="sm muted">Tick each one when it's done.</p><div class="tasks-inline">${c.act.map((e,i)=>taskLine(u,"act"+i,e)).join("")}</div>`;
  if(k==="game")return `<p><b>${esc(c.game[0])}.</b> ${esc(c.game[1])}</p><div class="tasks-inline">${taskLine(u,"game","We played it")}</div>`;
  if(k==="proj")return `<p><b>${esc(c.proj[0])}.</b> ${esc(c.proj[1])}</p><p class="sm muted">You end up with: ${esc(c.proj[2])}.</p><div class="row"><button class="btn soft sm" data-act="startexp" data-title="${esc(c.proj[0])}" data-topic="${esc(u.title)}">Track as an ongoing project</button></div><div class="tasks-inline">${taskLine(u,"proj","Project finished")}</div>`;
  return ""}

/* kolam: one dot per thing in the day; a loop is drawn round each one done */
function kolam(){return ""}
/* Waldorf: its own subjects (Main lesson, Hindi, Arts & handwork), shown only to Waldorf families */
const WFS=["wml","wart"],visSubj=b=>b==="waldorf"?["wml","hin","wart","dks"]:SUBJ_KEYS.filter(k=>!WFS.includes(k));
function wfGuideView(){const G=DATA.waldorf||{};document.getElementById("sheetTitle").textContent="Waldorf at home";const cls=S.levels?.wml||1,tbl=(rows,h)=>`<table class="wft">${h?`<tr>${h.map(x=>`<th>${x}</th>`).join("")}</tr>`:""}${rows.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join("")}</tr>`).join("")}</table>`;
  return `<p>${esc(G.intro||"")}</p>
   <section class="card"><b style="font:600 17px var(--display)">What matters most</b>${(G.principles||[]).map(([t,d])=>`<p class="sm"><b>${esc(t)}.</b> ${esc(d)}</p>`).join("")}</section>
   <section class="card"><b style="font:600 17px var(--display)">A Waldorf day at home</b>${tbl(G.day||[],["","Time","What"])}<p class="xs muted">DeepKids plans the main lesson, Hindi and the arts each day from your Pace settings. Set times in Plan → Tell DeepKids → Day times.</p></section>
   <section class="card"><b style="font:600 17px var(--display)">The week's arts rhythm</b>${tbl(G.week||[])}</section>
   <section class="card"><b style="font:600 17px var(--display)">The year and its festivals</b>${tbl(G.year||[])}<p class="xs muted">Keep a seasonal table: a cloth in the season's colour, and what you find outside.</p></section>
   <section class="card"><b style="font:600 17px var(--display)">What to get</b>${tbl(G.materials||[])}</section>
   <section class="card"><b style="font:600 17px var(--display)">Books</b><p class="sm"><b>For you:</b></p><ul class="sm">${(G.books?.parent||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ul>${[1,2,3,4,5].map(c=>`<details${c===cls?" open":""}><summary class="sm"><b>Class ${c}</b>${c===cls?" (your class)":""}</summary><ul class="sm">${(G.books?.[c]||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ul></details>`).join("")}</section>
   <p class="xs muted">${esc(G.schools||"")}</p><p class="xs muted">This plan is written in the spirit of Waldorf education for Indian families. It is not an accredited Steiner curriculum; a trained Waldorf teacher near you can help you go deeper.</p>`}

/* ---------- Question bank from the lessons done ---------- */
const qid=(k,q)=>{let h=0;const s=k+"|"+q;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return "q"+(h>>>0).toString(36)};
function qBank(u){const P=u.c?.p,out=[],seen=new Set(),add=o=>{const id=qid(u.k,o.q);if(seen.has(id))return;seen.add(id);out.push({k:u.k,id,...o})};
  if(P){(P.check||[]).forEach(c=>add({q:c.q,a:c.a,kind:"open"}));(P.words||[]).forEach(([w,m])=>add({q:`What does “${w}” mean?`,a:m,kind:"open"}));
    (P.worksheets||[]).forEach(w=>w.sections.forEach(([,its])=>its.forEach(it=>{if(it.t==="mcq"&&Array.isArray(it.opts)&&Number.isInteger(it.a)&&it.opts[it.a]!=null)add({q:it.p,opts:it.opts,ans:it.a,a:String(it.opts[it.a]),kind:"mcq"});else if(it.t==="fill"&&it.a?.length)add({q:it.p,a:it.a.join(" / "),kind:"open"});else if(it.t==="match"&&it.pairs?.length)it.pairs.slice(0,3).forEach(([x,y])=>add({q:`${String(it.p).replace(/\.$/,"")}: ${x}?`,a:String(y),kind:"open"}))})))}
  (u.c?.x?.quiz||[]).forEach(([s,t,why])=>add({q:s,kind:"tf",opts:["True","False"],ans:t?0:1,a:(t?"True":"False")+(why?". "+why:"")}));
  (S.qgen?.[u.k]||[]).forEach(o=>add({...o,kind:o.opts?"mcq":"open",gen:true}));
  return out}
const lastLearn=u=>{let d="";S.log.forEach(l=>{if(l.key===u.k&&l.date>d)d=l.date});return d||S.progress?.[u.k]?.updated||""};
function learnedUnits(){const ks=new Set([...S.log.map(l=>l.key),...Object.keys(S.progress||{}).filter(k=>(S.progress[k].sessions||0)>0||rank[S.progress[k].status]>=2)]);return [...ks].map(unitByK).filter(u=>u&&S.subjects.includes(u.subj))}
/* every answer to every question, from part quizzes, quick quizzes and refreshers; the latest one counts */
function lastAnswers(){const M={};Object.entries(S.quiz||{}).forEach(([kk,o])=>{const k=kk.slice(0,kk.lastIndexOf("|"));Object.values(o||{}).forEach(x=>{if(x&&x.q!=null){const id=qid(k,x.q);if(!M[id]||(x.d||"")>=(M[id].d||""))M[id]={k,q:x.q,a:x.a,r:x.r,d:x.d||""}}})});
  Object.entries(S.qa||{}).forEach(([id,x])=>{if(!M[id]||(x.d||"")>=(M[id].d||""))M[id]=x});return M}
function qRecord(o,r){S.qa=S.qa||{};const p=S.qa[o.id];S.qa[o.id]={k:o.k,q:o.q,a:o.a,r:r?1:0,d:today,n:(p?.n||0)+1,w:(p?.w||0)+(r?0:1)}}
/* Not grasped: a question's latest answer is wrong. Mastered: chapter done, all its work done, nothing wrong. Grasped: the rest */
function masteryOf(u,M){if(Object.values(M).some(x=>x.k===u.k&&x.r===0))return "not";const P=u.c?.p;let all=rank[coverage(u)]>=2;
  if(all&&P){const its=[...(P.worksheets||[]).map(w=>["ws",w.id]),...[...(P.experiments||[]),...(P.activities||[])].map(e=>[wType(u,e.id),e.id]),...P.days.filter(d=>quizQ(u,d.n).length).map(d=>["qz","q"+d.n])];all=its.every(([t,id])=>["done","skip"].includes(itemState(t,u,id)))}
  return all?"mastered":"grasped"}
function masteryLists(){const M=lastAnswers(),L={not:[],grasped:[],mastered:[]};learnedUnits().forEach(u=>L[masteryOf(u,M)].push(u));return L}
const MGN={not:"Not grasped yet",grasped:"Grasped",mastered:"Mastered"},RTN={qz:"Quiz questions",think:"Big think",reread:"Re-read",act:"Redo an activity"};
const RFDEF={not:{every:1,mix:{qz:50,think:20,reread:30,act:0}},grasped:{every:3,mix:{qz:50,think:30,reread:10,act:10}},mastered:{every:10,mix:{qz:30,think:50,reread:0,act:20}},mins:15,days:[0,1,2,3,4,5,6]};
function RFS(){const s=S.rfs||{},g=k=>({...RFDEF[k],...(s[k]||{}),mix:{...RFDEF[k].mix,...(s[k]?.mix||{})}});return {not:g("not"),grasped:g("grasped"),mastered:g("mastered"),mins:s.mins||RFDEF.mins,days:s.days||RFDEF.days}}
const hsh=s=>{let h=7;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h};
function thinkFor(u,i){const P=u.c?.p,t=u.topic;if(P?.voices?.length){const v=P.voices[i%P.voices.length];return {title:"Big think: "+v.who.split(/[,(]/)[0].trim(),body:v.idea,ask:"What do you think, and why? Is there another way to see it?"}}
  if(t)return {title:"Big think: "+t.name,body:t.summary,ask:t.oneness};if(P?.goals?.length){const g=P.goals[i%P.goals.length].replace(/^By the end your child can\s*/i,"");return {title:"Big think: "+u.title,body:"Can you still "+g.replace(/\.$/,"")+"?",ask:"Show me or tell me, in your own words."}}
  return {title:"Teach it back: "+u.title,body:"Your child teaches you what they remember from this chapter, as if you were the student.",ask:"What is one question about it you still have?"}}
function rereadFor(u){const P=u.c?.p;if(P)return {title:"Re-read: "+u.title,body:P.summary,words:(P.words||[]).slice(0,5)};if(u.topic)return {title:"Re-read: "+u.title,body:u.topic.summary};return {title:"Re-read: "+chT(u),body:`Open ${u.book||"the book"} at this chapter. Your child reads a page aloud and tells you what it was about.`}}
function actFor(u,i){const P=u.c?.p,c=u.c||{},pool=[];if(P){(P.experiments||[]).forEach(e=>pool.push({title:e.title,body:e.question,steps:e.steps,need:e.need}));(P.activities||[]).forEach(a=>pool.push({title:a.title,body:a.outcome?"You end up with: "+a.outcome:"",steps:a.steps,need:a.need}))}
  if(c.game)pool.push({title:c.game[0],body:c.game[1]});(c.exp||[]).forEach(e=>pool.push({title:e.split(":")[0].slice(0,50),body:e}));(c.act||[]).forEach(e=>pool.push({title:e.split(":")[0].slice(0,50),body:e}));return pool.length?pool[i%pool.length]:null}
function pickType(mix,h){const T=Object.entries(mix).filter(([,v])=>v>0),tot=T.reduce((a,[,v])=>a+v,0);if(!tot)return "qz";let x=h%tot;for(const [k,v] of T){if(x<v)return k;x-=v}return T[0][0]}
/* the day's refresher: topics due by their list's frequency, a mix of short bits by their list's mix */
function rfPlan(date){if(S.rfp?.[date])return S.rfp[date];const R=RFS();if(!R.days.includes(parse(date).getDay()))return null;const M=lastAnswers(),dn=parse(date);
  const lastRef={};Object.entries(S.rfp||{}).forEach(([d,p])=>{if(d<date&&S.tl?.[d+"|refresh"])(p.topics||[]).forEach(t=>{if(!lastRef[t.k]||d>lastRef[t.k])lastRef[t.k]=d})});
  const due=[];learnedUnits().forEach(u=>{const ll=lastLearn(u);if(!ll||ll>=date)return;const g=masteryOf(u,M),from=lastRef[u.k]&&lastRef[u.k]>ll?lastRef[u.k]:ll,gap=Math.round((dn-parse(from))/864e5);if(gap>=R[g].every)due.push({u,g,gap})});
  if(!due.length)return null;const ord={not:0,grasped:1,mastered:2};due.sort((a,b)=>ord[a.g]-ord[b.g]||b.gap-a.gap||(hsh(date+a.u.k)-hsh(date+b.u.k)));
  const T=due.slice(0,3),n=Math.max(3,Math.round(R.mins/3)),slots=[];
  for(let i=0;i<n;i++){const t=T[i%T.length],h=hsh(date+"|"+i+"|"+t.u.k);let ty=pickType(R[t.g].mix,h);
    if(ty==="qz"){const B=qBank(t.u),w=B.filter(q=>M[q.id]?.r===0),fresh=B.filter(q=>!M[q.id]),pool=w.length?w:fresh.length?fresh:B,used=new Set(slots.filter(s=>s.q).map(s=>s.q.id)),cand=pool.filter(q=>!used.has(q.id));if(cand.length){slots.push({ty,k:t.u.k,g:t.g,q:cand[h%cand.length]});continue}ty="think"}
    if(ty==="act"){const a=actFor(t.u,h);if(a){slots.push({ty,k:t.u.k,g:t.g,...a});continue}ty="think"}
    slots.push({ty,k:t.u.k,g:t.g,...(ty==="reread"?rereadFor(t.u):thinkFor(t.u,h))})}
  const p={date,mins:R.mins,topics:T.map(t=>({k:t.u.k,g:t.g})),slots,title:T.map(t=>t.u.title).slice(0,2).join(" · ")+(T.length>2?` +${T.length-2}`:""),sub:`${slots.length} short bits from ${T.length} past topic${T.length>1?"s":""}`};
  if(date===today){S.rfp={...(S.rfp||{}),[date]:p}}return p}
function qCard(q,state){const res=state?.r,ch=state?.c;window._qmap=window._qmap||{};window._qmap[q.id]=q;
  const opts=q.opts?`<div class="col" style="gap:6px">${q.opts.map((o,i)=>`<button class="btn sm ${res==null?"soft":i===q.ans?"green":i===ch?"bad":"line"}" data-act="qans" data-id="${q.id}" data-c="${i}" ${res!=null?"disabled":""}>${esc(String(o))}</button>`).join("")}</div>`:"";
  const open=!q.opts?(res==null?`<details><summary class="sm muted">Show the answer</summary><p class="sm">${esc(q.a)}</p></details><div class="row" style="gap:6px"><button class="btn xs accent" data-act="qans" data-id="${q.id}" data-r="1">Got it</button><button class="btn xs soft" data-act="qans" data-id="${q.id}" data-r="0">Not yet</button></div>`:`<p class="sm"><b>Answer:</b> ${esc(q.a)}</p>`):"";
  return `<div class="qcard"><b style="font:600 17px var(--display)">${esc(q.q)}</b>${opts}${open}${res!=null?`<p class="sm"><b>${res?"✓ Right":"✗ Not yet"}</b>${q.opts&&!res?` · Answer: ${esc(q.a)}`:""}</p>`:""}</div>`}
/* Quick quiz: any time, on lessons done */
function quizPool(s,focus){const M=lastAnswers(),U=learnedUnits().filter(u=>s==="all"||u.subj===s),B=U.flatMap(qBank),g=Object.fromEntries(U.map(u=>[u.k,masteryOf(u,M)]));
  if(focus==="not")return B.filter(q=>g[q.k]==="not");if(focus==="even")return B;const w=q=>M[q.id]?.r===0?0:g[q.k]==="not"?1:!M[q.id]?2:3;return B.slice().sort((a,b)=>w(a)-w(b))}
function quizzView(){document.getElementById("sheetTitle").textContent="Quick quiz";if(ui.qrun)return quizRunView();if(ui.qzv)return quizPastView();
  const Z=ui.qz=ui.qz||{s:"all",by:"n",n:10,m:10,focus:"mix"},U=learnedUnits(),cnt=s=>U.filter(u=>s==="all"||u.subj===s).flatMap(qBank).length,L=masteryLists(),seg=(key,vals,lab)=>`<div class="seg">${vals.map(v=>`<button aria-pressed="${Z[key]===v}" data-act="qzset" data-key="${key}" data-v="${v}">${lab(v)}</button>`).join("")}</div>`;
  const noBank=S.subjects.filter(s=>U.some(u=>u.subj===s)&&!cnt(s));
  return `<p class="sm muted">Questions from every lesson you've done. Ask aloud; your child answers, then you check. Results are saved for the transcript, and anything not yet grasped goes into the refresher.</p>
   <section class="card"><span class="eyebrow">Subjects</span><div class="row chips">${["all",...S.subjects].map(s=>`<button class="chip" aria-pressed="${Z.s===s}" data-act="qzset" data-key="s" data-v="${s}">${s==="all"?"All subjects":SUBJ[s]} <small>${cnt(s)}</small></button>`).join("")}</div>
    <span class="eyebrow">How long</span>${seg("by",["n","m"],v=>v==="n"?"Number of questions":"Minutes")}${Z.by==="n"?seg("n",[5,10,15,20],v=>v+" questions"):seg("m",[5,10,15,20],v=>v+" min")}
    <span class="eyebrow">Which questions</span>${seg("focus",["mix","not","even"],v=>({mix:"Weak spots first",not:"Only not grasped",even:"Everything"})[v])}
    <button class="btn accent" data-act="qzstart" ${cnt(Z.s)?"":"disabled"}>Start the quiz</button>
    ${!U.length?`<p class="xs muted">Do a lesson or two first. Questions come from lessons you've done.</p>`:!cnt(Z.s)?`<p class="xs muted">No questions yet for this choice.</p>`:""}</section>
   ${noBank.length?`<section class="card"><b>${noBank.map(s=>SUBJ[s]).join(", ")}: no questions yet</b><p class="xs muted">These chapters don't have quiz questions in DeepKids yet.</p>${SAMPLE?`<button class="btn soft sm" data-act="qgen" ${ui.qgen?"disabled":""}>${ui.qgen?"Writing questions…":"Write questions with Claude"}</button>`:`<p class="xs muted">With DeepKids Plus, Claude writes questions for them.</p>`}</section>`:""}
   <section class="card"><div class="sech"><b style="font:600 17px var(--display)">How it's sticking</b><button class="link" data-act="rfset">Lists and refresher settings</button></div><div class="row">${["not","grasped","mastered"].map(g=>`<span class="pill mg-${g}">${MGN[g]} · ${L[g].length}</span>`).join("")}</div></section>
   ${(S.qzr||[]).length?`<section class="sec"><div class="sech"><h3 style="font-size:18px">Past quizzes</h3></div>${(S.qzr||[]).slice().reverse().slice(0,12).map(r=>`<button class="menurow" data-act="qzpast" data-id="${r.id}"><span style="font-size:26px">🎯</span><span><b>${r.score} of ${r.items.length} right</b><br><span class="xs muted">${esc(fmt(r.date))} · ${esc(r.s==="all"?"All subjects":SUBJ[r.s]||"")}</span></span>${icon("next")}</button>`).join("")}</section>`:""}`}
function quizRunView(){const R=ui.qrun,q=R.qs[R.i],left=R.end?Math.max(0,Math.round((R.end-Date.now())/1000)):null,over=R.i>=R.qs.length||(left===0);
  if(over&&!R.res.length){if(!R.saved){R.saved=true}return `<p class="note">${left===0?"Time's up before any question was answered.":"Stopped before any question was answered."} Nothing was saved.</p><div class="row"><button class="btn accent" data-act="qzagain">Try again</button><button class="btn line" data-act="qzend">Done</button></div>`}
  if(over){if(!R.saved){R.saved=true;const items=R.res.map(x=>({k:x.q.k,q:x.q.q,a:x.q.a,r:x.r,c:x.c}));S.qzr=[...(S.qzr||[]),{id:Math.random().toString(36).slice(2,9),date:today,s:R.s,by:R.by,items,score:items.filter(x=>x.r).length}];save()}
    const wrong=R.res.filter(x=>!x.r);return `<section class="card" style="text-align:center"><h2 style="font-size:28px">${R.res.filter(x=>x.r).length} of ${R.res.length} right</h2><p class="sm muted">${left===0&&R.i<R.qs.length?"Time's up. ":""}Saved for the transcript.</p></section>
     ${wrong.length?`<section class="card"><b>Not yet (${wrong.length})</b><p class="xs muted">These chapters move to “Not grasped yet” and come back in the refresher.</p><ol class="sm">${wrong.map(x=>`<li><b>${esc(x.q.q)}</b><br>${esc(x.q.a)} <span class="xs muted">· ${esc(chT(unitByK(x.q.k)))}</span></li>`).join("")}</ol></section>`:`<p class="note">All right. Lovely work!</p>`}
     <div class="row"><button class="btn accent" data-act="qzagain">Another quiz</button><button class="btn line" data-act="qzend">Done</button></div>`}
  const st=R.cur?.id===q.id?R.cur:null,u=unitByK(q.k);
  return `<div class="row" style="justify-content:space-between"><span class="eyebrow">Question ${R.i+1} of ${R.qs.length}${left!=null?` · <span id="qzleft">${Math.floor(left/60)}:${String(left%60).padStart(2,"0")}</span> left`:""}</span><button class="link xs" data-act="qzstop">Stop</button></div>
   <span class="xs muted">${esc(chT(u))} · ${esc(SUBJ[u?.subj]||"")}</span>${qCard(q,st)}${st?`<button class="btn accent wide" data-act="qznext">${R.i+1<R.qs.length?"Next question":"See the score"}</button>`:""}`}
function quizPastView(){const r=(S.qzr||[]).find(x=>x.id===ui.qzv);if(!r){ui.qzv=null;return quizzView()}
  return `<button class="link" data-act="qzback">← Quick quiz</button><h3>${r.score} of ${r.items.length} right · ${esc(fmt(r.date))}</h3><ol class="sm">${r.items.map(x=>`<li><b>${esc(x.q)}</b> ${x.r?"✓":"✗"}<br>${esc(x.a)} <span class="xs muted">· ${esc(chT(unitByK(x.k)))}</span></li>`).join("")}</ol>`}
/* lists and refresher settings */
function rfsetView(){document.getElementById("sheetTitle").textContent="Refresher";const R=RFS(),L=masteryLists(),M=lastAnswers(),EV=[1,2,3,5,7,10,14,30];
  const card=g=>`<section class="card mgc-${g}"><div class="sech"><b style="font:600 17px var(--display)">${MGN[g]}</b><span class="pill">${L[g].length}</span></div>
    <p class="xs muted">${g==="not"?"A question from it was last answered wrong, whatever else is finished.":g==="grasped"?"Nothing answered wrong, but not everything in it is finished yet.":"Chapter done, all its worksheets, quizzes and projects finished, and nothing answered wrong."}</p>
    ${L[g].length?`<div class="col" style="gap:4px">${L[g].slice(0,12).map(u=>`<button class="plain sm" data-act="chapter" data-k="${u.k}" style="text-align:left">• ${esc(chT(u))} <span class="xs muted">${esc(SUBJ[u.subj])}${g==="not"?` · ${Object.values(M).filter(x=>x.k===u.k&&x.r===0).length} not yet`:""}</span></button>`).join("")}${L[g].length>12?`<span class="xs muted">+${L[g].length-12} more</span>`:""}</div>`:""}
    <div class="row" style="align-items:center"><span class="sm">Refresh every</span><select class="inp" style="width:auto;height:40px" data-rfe="${g}">${EV.map(v=>`<option value="${v}" ${R[g].every===v?"selected":""}>${v===1?"day":v+" days"}</option>`).join("")}</select></div>
    <span class="eyebrow">Mix of refresher bits</span>${Object.keys(RTN).map(t=>`<div class="row" style="align-items:center;justify-content:space-between;flex-wrap:nowrap"><span class="sm">${RTN[t]}</span><div class="stepper"><button data-act="rfmix" data-g="${g}" data-t="${t}" data-d="-10" ${R[g].mix[t]<=0?"disabled":""} aria-label="Less ${RTN[t]}">−</button><span class="sm" style="min-width:48px;text-align:center">${R[g].mix[t]}%</span><button data-act="rfmix" data-g="${g}" data-t="${t}" data-d="10" ${R[g].mix[t]>=100?"disabled":""} aria-label="More ${RTN[t]}">+</button></div></div>`).join("")}</section>`;
  return `<p class="sm muted">Every day, a short refresher from past lessons. Each list has its own rhythm and mix. The shares are relative: 50 and 50 means half and half.</p>
   <section class="card"><div class="row" style="align-items:center"><span class="sm">Daily refresher</span><select class="inp" style="width:auto;height:40px" id="rfmins">${[10,15,20,30].map(v=>`<option value="${v}" ${R.mins===v?"selected":""}>${v} min</option>`).join("")}</select></div><div class="dpick">${[1,2,3,4,5,6,0].map(d=>`<button aria-pressed="${R.days.includes(d)}" data-act="rfday" data-d="${d}">${DAYN[d]}</button>`).join("")}</div></section>
   ${card("not")}${card("grasped")}${card("mastered")}<button class="btn soft sm" data-act="quizgo" style="justify-self:start">🎯 Quick quiz</button>`}
function quizTranscript(){const R=S.qzr||[],L=masteryLists(),M=Object.values(lastAnswers());if(!R.length&&!M.length)return "";const tot=R.reduce((a,r)=>a+r.items.length,0),ok=R.reduce((a,r)=>a+r.score,0);
  return `<h2>Quizzes and refreshers</h2><p class="sm">Quick quizzes taken: ${R.length} · Questions: ${tot} · Right: ${ok}${tot?` (${Math.round(ok/tot*100)}%)`:""} · Different questions answered in all quizzes and refreshers: ${M.length}, latest answer right for ${M.filter(x=>x.r).length}</p>
   <table><tr><th>How it's sticking</th><th>Chapters</th></tr>${["mastered","grasped","not"].map(g=>`<tr><td>${MGN[g]}</td><td>${L[g].map(u=>esc(chT(u))+" ("+esc(SUBJ[u.subj])+")").join(", ")||"—"}</td></tr>`).join("")}</table>
   ${R.length?`<h3>Quick quizzes</h3><table><tr><th>Date</th><th>Subjects</th><th>Score</th></tr>${R.map(r=>`<tr><td>${esc(fmt(r.date))}</td><td>${esc(r.s==="all"?"All subjects":SUBJ[r.s]||"")}</td><td>${r.score} / ${r.items.length}</td></tr>`).join("")}</table>
   <h3>Questions and answers</h3><table><tr><th>Date</th><th>Chapter</th><th>Question</th><th>Answer</th><th>Result</th></tr>${R.flatMap(r=>r.items.map(x=>`<tr><td>${esc(fmt(r.date))}</td><td>${esc(chT(unitByK(x.k)))}</td><td>${esc(x.q)}</td><td>${esc(x.a)}</td><td>${x.r?"Right":"Not yet"}</td></tr>`)).join("")}</table>`:""}`}
async function qGen(){const U=learnedUnits().filter(u=>!qBank(u).length).slice(0,6);if(!U.length||!SAMPLE)return;ui.qgen=true;renderSheet();
  const prompt=`You write quiz questions for a home-schooled Indian child in Class ${S.levels?.math||3}. For each chapter below, write 5 short multiple-choice questions that check what the chapter teaches. Each has 4 options and exactly one right answer. Simple words.\n${U.map(u=>`k: ${u.k} | ${SUBJ[u.subj]} | ${u.book} | ${chT(u)}`).join("\n")}\nReply with only JSON: {"chapters":[{"k":"...","questions":[{"q":"...","opts":["a","b","c","d"],"ans":0}]}]}`;
  try{const r=await SAMPLE.json(prompt,{modelTier:"default"}),ok=new Set(U.map(u=>u.k));S.qgen=S.qgen||{};(r?.chapters||[]).forEach(c=>{if(!ok.has(c.k))return;const qs=(c.questions||[]).filter(q=>q&&typeof q.q==="string"&&Array.isArray(q.opts)&&q.opts.length===4&&Number.isInteger(q.ans)&&q.ans>=0&&q.ans<4).map(q=>({q:q.q,opts:q.opts.map(String),ans:q.ans,a:String(q.opts[q.ans])}));if(qs.length)S.qgen[c.k]=qs});toast("Questions ready")}catch(e){toast("Couldn't write questions just now. Try again later.")}
  ui.qgen=false;commit();renderSheet()}
/* Day times: a usual routine, changes for a weekday, and changes for one date */
const DTF=[["prepAt","Morning prep","time"],["start","Lessons start","time"],["brk","Break between","sel",[0,10,15,20,30]],["lunch","Lunch at","time"],["lunchMin","Lunch length","sel",[20,30,45,60,90]],["eveAt","Evening prep","time"]];
function dayTimesCard(){const sc=ui.dts||"all",isD=sc.startsWith("d:"),dt=isD?sc.slice(2):"",wd=sc[0]==="w"?+sc.slice(1):null,base=D(),ov=sc==="all"?{}:wd!=null?((S.dayW||{})[wd]||{}):((S.dayOver||{})[dt]||{}),cur=sc==="all"?base:wd!=null?{...base,...ov}:Dd(dt);
  const field=([f,l,ty,opts])=>{const changed=sc!=="all"&&ov[f]!=null;return `<div class="field"><label>${l}${changed?" ✱":""}</label>${ty==="time"?`<input class="inp" type="time" data-dt="${f}" value="${cur[f]}">`:`<select class="inp" data-dt="${f}">${opts.map(x=>`<option value="${x}" ${+cur[f]===x?"selected":""}>${x} min</option>`).join("")}</select>`}</div>`};
  const n=Object.keys(ov).length;
  return `<section class="sec"><div class="sech"><h3>Day times</h3><span class="xs muted">Your usual day, and changes for some days</span></div>
   <div class="row chips"><button class="chip" aria-pressed="${sc==="all"}" data-act="dts" data-s="all">Usual</button>${[1,2,3,4,5,6,0].map(d=>`<button class="chip" aria-pressed="${wd===d}" data-act="dts" data-s="w${d}">${DAYN[d]}${Object.keys((S.dayW||{})[d]||{}).length?" ✱":""}</button>`).join("")}<label class="chip" aria-pressed="${isD}" style="cursor:pointer">📅 ${isD?esc(fmt(dt)):"A date"}<input type="date" id="dtDate" value="${dt||today}" style="width:1px;height:1px;opacity:0;position:absolute"></label></div>
   <div class="card"><p class="xs muted">${sc==="all"?"Your usual times, every day.":wd!=null?`Every ${["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][wd]}. Change only what's different; the rest stays as usual.`:`Only on ${esc(fmt(dt))}. This beats the usual and the weekday times.`}</p>
    <div class="fgrid">${DTF.map(field).join("")}</div>${n?`<button class="link xs" data-act="dtreset" style="justify-self:start">Back to usual times${wd!=null?" for "+DAYN[wd]:isD?" for this date":""} (${n} changed)</button>`:""}</div>
   ${Object.keys(S.dayOver||{}).filter(d=>d>=today&&Object.keys(S.dayOver[d]).length).length?`<p class="xs muted">Dates with their own times: ${Object.keys(S.dayOver).filter(d=>d>=today&&Object.keys(S.dayOver[d]).length).sort().map(d=>`<button class="link xs" data-act="dts" data-s="d:${d}">${esc(fmt(d))}</button>`).join(", ")}</p>`:""}</section>`}
function rfCard(){const L=masteryLists(),it=dayPlan(today).find(i=>i.id==="refresh");return `<section class="sec"><div class="sech"><h3>Quizzes and refreshers</h3></div><div class="card"><div class="row">${["not","grasped","mastered"].map(g=>`<span class="pill mg-${g}">${MGN[g]} · ${L[g].length}</span>`).join("")}</div>
  <div class="row"><button class="btn accent sm" data-act="quizgo">🎯 Quick quiz</button>${it?`<button class="btn soft sm" data-act="refresh" data-date="${today}">Today's refresher</button>`:""}<button class="link" data-act="rfset">Lists and settings</button></div></div></section>`}
/* add by hand: what kind, whose, when, and how it repeats */
const QREP={once:["Once",null],daily:["Every day",[0,1,2,3,4,5,6]],wk:["Weekdays",[1,2,3,4,5]],we:["Weekends",[0,6]],pick:["Pick days",null]};
const QKIND=[["class","Class or tuition"],["rest","Rest or meal"],["outing","Outing"],["other","Appointment"],["todo","To-do"]];
/* Queued is a flag on top of an item's own state, so an item can be Pending + Queued, Not started + Queued, Ongoing + Queued */
const isQ=(u,id)=>{const w=WK()[u.k+"|"+id];return !!(w&&(w.q||w.st==="planned"))};
const stPills=x=>`<span class="pill st-${x.st==="going"?"going":x.pend?"new":"none"}" style="font-size:11px">${x.st==="going"?"Ongoing":x.pend?"Pending":"Not started"}</span>${x.q?` <span class="pill st-queued" style="font-size:11px">Queued</span>`:""}`;
function unQueue(ty,key){const W=WK(),w=W[key];if(w){delete w.q;delete w.planned;if(w.st==="planned")delete w.st}WQ()[ty]=(WQ()[ty]||[]).filter(x=>x!==ty+":"+key)}
const qCtl=(ty,u,id,st)=>{if(st==="done"||st==="skip")return "";const r=ty+":"+u.k+"|"+id;return isQ(u,id)?`<button class="link xs" data-act="qx" data-ty="${ty}" data-r="${esc(r)}">Take out of the queue</button>`:qPick(ty,u.subj,r,"+ Queue","btn xs soft")};
const qTag=(ty,u,id,st)=>{if(st==="done"||st==="skip"||!isQ(u,id))return "";const r=ty+":"+u.k+"|"+id,n=wqList(ty).findIndex(x=>x.ref===r)+1;return ` <span class="pill st-queued" style="font-size:11px">Queued${n?" · no. "+n:""}</span>`};
/* Every worksheet, experiment, activity, project and quiz has its own state, whatever state its lesson is in:
   none (not started) · queued · going (ongoing) · done (completed) · skip (not doing) */
const ISTATE={none:"Not started",queued:"Queued",going:"Ongoing",done:"Completed",skip:"Not doing"};
function itemState(ty,u,id){const W=WK(),w=W[u.k+"|"+id],st=w?.st==="planned"?null:w?.st;if(st==="skip")return "skip";
  if(ty==="ws"){const P=u.c?.p,x=(P?.worksheets||[]).find(z=>z.id===id),k2=u.k+"#"+id;if(taskDone(k2,"ws")||st==="done")return "done";if((x&&wsCount(k2,x.sections).ans>0)||st==="started")return "going";return "none"}
  if(ty==="qz"){const n=+id.slice(1),Q=quizQ(u,n),a=Object.keys(S.quiz?.[u.k+"|"+n]||{}).length;if((Q.length&&a>=Q.length)||st==="done")return "done";if(a>0||st==="started")return "going";return "none"}
  if(taskDone(u.k,id)||st==="done"||stepTicked(u,id))return "done";if(st==="started")return "going";
  if(ty==="proj"){const R=refParts(u,id),dn=done(u.k);if(R.length&&R[0]<=dn&&rank[coverage(u)]<2)return "going"}
  return "none"}
/* the state line shown on a worksheet or quiz wherever it appears */
function stateCtl(ty,u,id){const s=itemState(ty,u,id),cls={going:"started",done:"done",skip:"skip"}[s]||"",reached=(()=>{const P=u.c?.p;if(!P)return false;const dn=rank[coverage(u)]>=2?P.days.length:done(u.k);if(ty==="qz")return +id.slice(1)<=dn;const w=(P.worksheets||[]).find(z=>z.id===id);return (w?.day||99)<=dn})();
  const lab=s==="none"&&reached?"Pending":ISTATE[s],b=(to,l)=>`<button class="link xs" data-act="ist" data-ty="${ty}" data-k="${u.k}" data-id="${id}" data-to="${to}">${l}</button>`;
  return `<div class="wkctl ${cls}"><span class="xs"><b>${lab}${s==="done"?" ✓":""}</b>${qTag(ty,u,id,s)}</span><div class="row" style="gap:8px;flex-wrap:wrap">${qCtl(ty,u,id,s)}${s==="none"&&ui.qpick!==ty+":"+u.k+"|"+id?b("skip","Not doing this"):s==="skip"?b("none","Undo"):s==="done"&&ty==="ws"?b("undo","Undo finished"):""}</div></div>`}
function subjCard(){return `<section class="sec"><div class="sech"><h3>Subjects</h3><span class="xs muted">Tap to add or leave out</span></div><div class="row chips">${visSubj(S.board).map(k=>`<button class="chip ${SC(k)}" aria-pressed="${S.subjects.includes(k)}" data-act="subtog" data-s="${k}">${S.subjects.includes(k)?"✓ ":"+ "}${SUBJ[k]}</button>`).join("")}</div></section>${S.board==="waldorf"?`<button class="menurow" data-act="wfguide">${blob("var(--sun)",31,"happy","",'width="40" height="40"')}<span><b>Waldorf at home</b><br><span class="xs muted">Rhythm, festivals, materials and books for each class</span></span>${icon("next")}</button>`:""}`}
/* DeepKids Science is its own subject now (it used to ride inside EVS): move a family's DeepKids topics across once */
function dksMigrate(){if(!S||!S.setup||S.dksMig)return;S.dksMig=1;const mv=o=>{if(!o||!o.sci)return o;const dk=o.sci.filter(k=>String(k).startsWith("dk|"));if(!dk.length)return o;return {...o,sci:o.sci.filter(k=>!String(k).startsWith("dk|")),dks:[...new Set([...(o.dks||[]),...dk])]}};
  S.extra=mv(S.extra);S.next=mv(S.next);S.later=mv(S.later);S.levels={...S.levels,dks:S.levels?.dks||S.levels?.sci||1};
  if(modeOf()!=="books"&&!S.subjects.includes("dks"))S.subjects=[...S.subjects,"dks"];save()}

/* keep sideways (and inner) scroll positions when the screen redraws, e.g. jokes in a row */
function scrollSnap(root){if(!root)return null;const L=[...root.querySelectorAll("div,section,ul,ol,nav")],out=[];L.forEach(e=>{if(e.scrollLeft>0||e.scrollTop>0){const cls=e.className||"",i=L.filter(z=>(z.className||"")===cls).indexOf(e);out.push({cls,i,x:e.scrollLeft,y:e.scrollTop})}});return out}
function scrollBack(root,snap){if(!root||!snap?.length)return;const L=[...root.querySelectorAll("div,section,ul,ol,nav")];snap.forEach(s=>{const e=L.filter(z=>(z.className||"")===s.cls)[s.i];if(e){if(s.x)e.scrollLeft=s.x;if(s.y)e.scrollTop=s.y}})}
const _dkRender=render,_dkRenderSheet=renderSheet;
render=function(...a){dksMigrate();const m=document.getElementById("main"),s=scrollSnap(m),r=_dkRender.apply(this,a);scrollBack(document.getElementById("main"),s);return r};
renderSheet=function(...a){const b=document.getElementById("sheetBody"),s=a[0]?null:scrollSnap(b),r=_dkRenderSheet.apply(this,a);scrollBack(document.getElementById("sheetBody"),s);return r};
/* Plan → To do: your own to-dos, and getting ready for the coming lessons */
function prepAhead(days){const end=addDays(today,days),out=[];upcoming().forEach(x=>{if(x.date<today||x.date>end)return;prepFor(x.u,x.n,x.tot).forEach(p=>{if(LEARNK.has(p.kind))return;const due=addDays(x.date,-p.lead);out.push({...p,x,due:due<today?today:due,late:due<today})})});
  const seen=new Set();return out.filter(p=>!seen.has(p.id)&&seen.add(p.id)).sort((a,b)=>a.due<b.due?-1:a.due>b.due?1:0)}
function todoTab(){const T=(S.todos||[]).filter(t=>!t.done).sort((a,b)=>(a.date||"")<(b.date||"")?-1:1),D=(S.todos||[]).filter(t=>t.done&&t.doneOn===today),P=prepAhead(7),open=P.filter(p=>!S.prep[p.id]),got=P.filter(p=>S.prep[p.id]);
  const when=d=>d===today?"Today":d===addDays(today,1)?"Tomorrow":fmt(d),tdRow=t=>`<div class="taskrow ${t.done?"done":""}"><button class="ckb" data-act="tdtick" data-t="${t.id}" aria-label="Done: ${esc(t.title)}">${icon("check")}</button><div style="flex:1;min-width:0"><b style="font-weight:800">${esc(t.title)}</b><p class="xs muted">${t.done?"Done today":t.date<today?"From "+fmt(t.date)+" · still open":when(t.date)}${t.who&&ROLE[t.who]?" · "+esc(ROLE[t.who]):""}</p></div>${t.done?"":`<button class="link xs" data-act="todomove" data-t="${t.id}">Tomorrow</button><button class="link xs" data-act="tododel" data-t="${t.id}">Remove</button>`}</div>`;
  const byDay={};open.forEach(p=>(byDay[p.due]=byDay[p.due]||[]).push(p));
  let h=`<section class="sec"><div class="sech"><h3>Your to-dos</h3><span class="pill">${T.length}</span></div>${T.length||D.length?`<div class="col" style="gap:8px">${[...T,...D].map(tdRow).join("")}</div>`:`<p class="xs muted">Nothing on your list. Things you add without a time land here, like “buy chart paper” or “call the swimming coach”.</p>`}
    <details class="qa-in"${ui.tdAdd?" open":""}><summary class="btn soft sm" style="justify-self:start" data-act="tdadd">${icon("plus")}Add a to-do</summary>${quickAdd(today)}</details></section>`;
  h+=`<section class="sec"><div class="sech"><h3>Get ready for lessons</h3><span class="pill">${open.length}</span></div><p class="xs muted">Prep and things to gather for the next 7 days of lessons. Ticking here also ticks it on Today.</p>
    ${open.length?Object.entries(byDay).map(([d,L])=>`<div class="col" style="gap:8px"><span class="eyebrow">${when(d)}</span>${L.map(p=>`<div class="taskrow"><button class="ckb" data-act="prep" data-id="${p.id}" aria-label="Done: ${esc(p.task)}">${icon("check")}</button><div style="flex:1;min-width:0"><b style="font-weight:800">${esc(p.task)}</b><p class="xs muted">For ${esc(chT(p.x.u))} · ${esc(SUBJ[p.x.u.subj])}, ${esc(fmt(p.x.date))}${p.late?" · was due earlier":""}</p></div></div>`).join("")}</div>`).join(""):`<p class="note">All set for the coming week.</p>`}
    ${got.length?`<details><summary class="xs muted">Done (${got.length})</summary><div class="col" style="gap:6px;margin-top:6px">${got.map(p=>`<div class="taskrow done"><button class="ckb" data-act="prep" data-id="${p.id}" aria-label="Undo: ${esc(p.task)}">${icon("check")}</button><div><b>${esc(p.task)}</b></div></div>`).join("")}</div></details>`:""}</section>`;
  return h}
/* subject filter for the work lists (lessons have their own subject row) */
const qfOf=()=>S.subjects.includes(ui.qf)?ui.qf:"all";
const subjChips=()=>`<div class="seg">${["all",...S.subjects].map(x=>`<button aria-pressed="${qfOf()===x}" data-act="qf" data-s="${x}">${x==="all"?"All subjects":SUBJ[x]}</button>`).join("")}</div>`;
const bySubj=L=>qfOf()==="all"?L:L.filter(x=>x.u?.subj===qfOf());
/* reorder: the moved items keep the slots they had, so a filtered list reorders only itself */
/* Progress → History: everything finished, by kind and subject */
function doneItems(){const out=[],W=WK(),last={};S.log.forEach(l=>{if(!last[l.key]||l.date>last[l.key])last[l.key]=l.date});
  const keys=new Set([...Object.keys(last),...Object.keys(S.progress||{}),...Object.keys(W).map(k=>k.slice(0,k.lastIndexOf("|"))),...Object.keys(S.tasks||{}).map(k=>k.split("#")[0]),...Object.keys(S.quiz||{}).map(k=>k.slice(0,k.lastIndexOf("|")))]);
  [...keys].map(unitByK).filter(Boolean).forEach(u=>{const P=u.c?.p,dt=v=>typeof v==="string"?v:"";
    if(rank[coverage(u)]>=2)out.push({ty:"les",u,title:chT(u),date:last[u.k]||S.progress[u.k]?.updated||"",open:`data-act="chapter" data-k="${u.k}"`});
    if(!P)return;
    [...(P.experiments||[]),...(P.activities||[])].forEach(e=>{const w=W[u.k+"|"+e.id];if(taskDone(u.k,e.id)||w?.st==="done")out.push({ty:wType(u,e.id),u,title:e.title,date:w?.done||dt(S.tasks[u.k]?.[e.id]),open:`data-act="chapter" data-k="${u.k}" data-t="lab"`})});
    (P.worksheets||[]).forEach(w=>{if(taskDone(u.k+"#"+w.id,"ws"))out.push({ty:"ws",u,title:w.title,date:dt(S.tasks[u.k+"#"+w.id]?.ws),open:`data-act="folder"`})});
    for(let n=1;n<=P.days.length;n++){const r=S.quiz?.[u.k+"|"+n];if(!r)continue;const Q=quizQ(u,n),v=Object.values(r);if(v.length>=Q.length&&Q.length)out.push({ty:"qz",u,title:`Quiz · Part ${n}`,date:v.map(x=>x.d).sort().pop()||"",sub:`${v.filter(x=>x.r).length} of ${Q.length} right`,open:`data-act="qzs" data-k="${u.k}" data-n="${n}"`})}});
  (S.exps||[]).filter(e=>e.closed).forEach(e=>out.push({ty:"proj",u:null,title:e.title,date:e.closedAt||e.start,sub:"Daily check-in"+(e.topic?" · "+e.topic:"")}));
  return out.sort((a,b)=>(b.date||"").localeCompare(a.date||""))}
function doneHistory(){const ty=WT[ui.hty]?ui.hty:"all",sj=S.subjects.includes(ui.hs)?ui.hs:"all",A=doneItems(),L=A.filter(x=>(ty==="all"||x.ty===ty)&&(sj==="all"||x.u?.subj===sj)),n=ui.hn||25;
  const cnt=t=>A.filter(x=>x.ty===t&&(sj==="all"||x.u?.subj===sj)).length;
  return `<section class="sec"><div class="sech"><h3>History</h3><span class="xs muted">Everything finished</span></div>
   <div class="seg qtypes"><button aria-pressed="${ty==="all"}" data-act="hty" data-t="all">All</button>${Object.entries(WT).map(([k,[nm,ic]])=>`<button aria-pressed="${ty===k}" data-act="hty" data-t="${k}">${ic} ${nm} <small>${cnt(k)}</small></button>`).join("")}</div>
   <div class="seg">${["all",...S.subjects].map(x=>`<button aria-pressed="${sj===x}" data-act="hs" data-s="${x}">${x==="all"?"All subjects":SUBJ[x]}</button>`).join("")}</div>
   ${L.length?`<div class="col" style="gap:8px">${L.slice(0,n).map(x=>`<div class="trow"><span class="tic" aria-hidden="true">${WT[x.ty][1]}</span><div style="min-width:0;flex:1"><b>${esc(x.title)}</b><br><span class="xs muted">${x.u&&x.ty!=="les"?esc(chT(x.u))+" · ":""}${x.u?esc(SUBJ[x.u.subj]):""}${x.sub?" · "+esc(x.sub):""}${x.date?" · "+esc(fmt(x.date)):""}</span></div>${x.open?`<button class="btn xs soft" ${x.open}>Open</button>`:""}</div>`).join("")}</div>${L.length>n?`<button class="btn soft sm" data-act="hmore" style="justify-self:start">Show ${Math.min(25,L.length-n)} more</button>`:""}`
     :`<p class="note">Nothing finished here yet. Things you finish show up here, newest first. What's in progress is under Plan → Ongoing.</p>`}</section>`}
/* More for today: more jokes, and real games from the chapters */
function moreJG(){const n=ui.jg||0;if(!n)return `<button class="btn soft sm" data-act="morejg" style="justify-self:start">${icon("spark")}More jokes and games</button>`;
  const mine=i=>S.subjects.includes(i.subj),J=DATA.items.filter(i=>mine(i)&&i.c?.x?.jokes?.length).flatMap(i=>i.c.x.jokes),Gm=DATA.items.filter(i=>mine(i)&&Array.isArray(i.c?.game)&&i.c.game.length>=2);
  const pick=(L,c)=>{const o=[];for(let i=0;i<c&&i<L.length;i++)o.push(L[((n-1)*c+i+dayNo)%L.length]);return o};
  return `<section class="card"><b style="font:600 17px var(--display)">More jokes</b><div class="hs">${pick(J,2).map((j,i)=>{const [q,a]=splitJoke(j),k="x"+n+"-"+i;return `<button class="joke" data-act="joke" data-j="${k}"><span class="eyebrow">Joke</span><span class="q">${esc(q)}</span>${ui.jokes[k]?`<span class="a">${esc(a)}</span>`:`<span class="tap">Tap for the answer</span>`}</button>`}).join("")}</div>
   <b style="font:600 17px var(--display)">Games to play</b>${pick(Gm,2).map(u=>`<div class="pk"><span class="eyebrow">${esc(chT(u))} · ${esc(SUBJ[u.subj])}</span><b>${esc(u.c.game[0])}</b><p class="sm">${esc(u.c.game[1])}</p></div>`).join("")}
   <button class="btn soft sm" data-act="morejg" style="justify-self:start">${icon("spark")}Two more of each</button></section>`}

/* ---------- To do: what's started, what's not started yet, and the line-up of each kind ---------- */
const WT={les:["Lessons","📘"],proj:["Projects","🧩"],exp:["Experiments","🧪"],act:["Activities","✂️"],ws:["Worksheets","📝"],qz:["Quizzes","❓"]};
const WQ=()=>S.wq||(S.wq={});
function wType(u,id){if(id==="proj")return "proj";const P=u.c?.p;if(P){if(refParts(u,id).length>=2)return "proj";if((P.experiments||[]).some(e=>e.id===id))return "exp";if((P.worksheets||[]).some(w=>w.id===id))return "ws";return "act"}return /^exp/.test(id)?"exp":"act"}
function quizQ(u,n){const P=u.c?.p;if(!P||u.board==="waldorf")return [];const d=pkDay(u,n),W=P.words||[];if(d.steps.some(s=>s.kind==="check")&&P.check?.length)return P.check;const last=d.n===P.days.length;
  return last&&P.check?.length?P.check.slice(0,5):(W.length?[0,1,2].map(i=>W[((d.n-1)*3+i)%W.length]).filter((w,i,a)=>a.indexOf(w)===i).map(([w,m])=>({q:`What does “${w}” mean?`,a:m})):[])}
/* a step ticked off during the lesson counts as done */
function stepTicked(u,id){const P=u.c?.p;if(!P)return false;const names=new Set();P.days.forEach(d=>d.steps.forEach(s=>{if(s.ref===id)names.add((PKIND[s.kind]||["act"])[0]+"|"+s.title)}));if(!names.size)return false;
  return Object.entries(S.steps||{}).some(([key,arr])=>key.replace(/^x/,"").startsWith(u.k+"|")&&(arr||[]).some(n=>names.has(n)))}
function quizTicked(u,n){const tk=(S.steps||{})[u.k+"|"+n]||[],d=pkDay(u,n);return tk.some(x=>/^ws\|(Quick quiz|End-of-chapter quiz)$/.test(x))||d.steps.some(s=>s.kind==="check"&&tk.includes("ws|"+s.title))}
function workItems(){const out=[],W=WK(),refK=r=>{const x=r.slice(r.indexOf(":")+1);return x.slice(0,x.lastIndexOf("|"))};
  const seenK=new Set([...S.log.map(l=>l.key),...Object.keys(S.progress||{}).filter(k=>(S.progress[k].sessions||0)>0||rank[S.progress[k].status]>=2),...Object.keys(W).map(k=>k.slice(0,k.lastIndexOf("|"))),...Object.values(WQ()).flat().map(refK),...Object.keys(S.quiz||{}).map(k=>k.slice(0,k.lastIndexOf("|")))]);
  const add=(ty,u,id,title,o)=>{const st=itemState(ty,u,id);if(st==="done"||st==="skip")return;const reached=o.day<=o.dn,q=isQ(u,id),pend=st==="none"&&reached;if(st==="none"&&!reached&&!q)return;
    out.push({ref:ty+":"+u.k+"|"+id,ty,u,id,title,st,q,pend,state:st==="going"?"going":pend?"new":"queued",sub:o.sub(st,reached),open:o.open,go:st==="going"?"Continue":"Start"})};
  [...seenK].map(unitByK).filter(Boolean).forEach(u=>{const P=u.c?.p;if(!P)return;const real=done(u.k),dn=rank[coverage(u)]>=2?P.days.length:real,from=d=>d<=real?`From Part ${d}, which you've done`:"From a chapter marked done",when=d=>d<=dn?from(d):`Comes up in Part ${d}`;
    (P.worksheets||[]).forEach(w=>{const k2=u.k+"#"+w.id;add("ws",u,w.id,w.title,{day:w.day||99,dn,open:`data-act="ws" data-k="${u.k}" data-w="${esc(w.id)}"`,sub:st=>{const c=wsCount(k2,w.sections);return st==="going"?`${c.ans} of ${c.tot} answered`:when(w.day||99)}})});
    [...(P.experiments||[]),...(P.activities||[])].forEach(e=>{const R=refParts(u,e.id),a=R[0]||99,z=R[R.length-1]||99,w0=W[u.k+"|"+e.id];
      add(wType(u,e.id),u,e.id,e.title,{day:a,dn,open:`data-act="chapter" data-k="${u.k}" data-t="lab"`,sub:st=>st==="going"?(w0?.st==="started"?`Started ${fmt(w0.started)}`:dn>=z?"All its parts are done · mark it finished":`Parts ${a}–${z} · next check-in Part ${R.find(r=>r>dn)}`):when(a)})});
    for(let n=1;n<=P.days.length;n++){const Q=quizQ(u,n);if(!Q.length)continue;add("qz",u,"q"+n,`Quiz · Part ${n}`,{day:n,dn,open:`data-act="qzs" data-k="${u.k}" data-n="${n}"`,sub:st=>{const a=Object.keys(S.quiz?.[u.k+"|"+n]||{}).length;return st==="going"?`${a} of ${Q.length} asked`:when(n)+` · ${Q.length} questions`}})}});
  Object.entries(W).forEach(([key,w])=>{const q=!!(w.q||w.st==="planned");if(!(w.st==="started"||q)||["done","skip"].includes(w.st))return;const j=key.lastIndexOf("|"),u=unitByK(key.slice(0,j)),id=key.slice(j+1);if(!u||/^q\d+$/.test(id)||out.some(x=>x.u.k===u.k&&x.id===id))return;
    if(u.c?.p&&((u.c.p.worksheets||[]).some(x=>x.id===id)||[...(u.c.p.experiments||[]),...(u.c.p.activities||[])].some(x=>x.id===id)))return;const ty=wType(u,id),st=w.st==="started"?"going":"none";
    out.push({ref:ty+":"+key,ty,u,id,title:w.title||wkTitle(u,id,""),st,q,pend:false,state:st==="going"?"going":"queued",sub:st==="going"?`Started ${fmt(w.started)}`:"Added by you",open:`data-act="chapter" data-k="${u.k}" data-t="lab"`,go:"Open"})});
  return out}
function lessonsGoing(){return S.subjects.flatMap(s=>plannedUnits(s).filter(u=>coverage(u)==="learning").slice(0,3).map(u=>{const n=done(u.k),tot=sessionsFor(u);return {ref:"les:"+u.k,ty:"les",u,id:"",title:chT(u),state:"going",sub:`${n} of ${tot} parts done`,open:`data-act="chapter" data-k="${u.k}"`,go:"Open"}}))}
function wqList(ty){const its=workItems().filter(x=>x.ty===ty&&x.q),o=WQ()[ty]||[],pos=r=>{const i=o.indexOf(r);return i<0?1e6:i};return its.map((x,i)=>({x,i})).sort((a,b)=>pos(a.x.ref)-pos(b.x.ref)||a.i-b.i).map(z=>z.x)}
function qItems(t,s){if(t==="les"){const ex=(S.extra||{})[s]||[];return plannedUnits(s).filter(u=>rank[coverage(u)]<2).filter((u,i)=>i<12||ex.includes(u.k)).map(u=>({ref:"les:"+u.k,u,title:chT(u),sub:`${u.board==="gen"?"DeepKids topic":u.board==="dk"?"DeepKids Plus":u.book} · ${sessionsFor(u)} days`,open:`data-act="chapter" data-k="${u.k}"`,rm:ex.includes(u.k)}))}
  return bySubj(wqList(t)).map(x=>({...x,sub:`${chT(x.u)} · ${SUBJ[x.u.subj]}`,rm:true}))}
function setOrder(ty,s,refs){if(ty==="les"){const ks=refs.map(r=>r.slice(4));S.next={...(S.next||{}),[s]:ks};S.later={...(S.later||{}),[s]:((S.later||{})[s]||[]).filter(k=>!ks.includes(k))}}
  else{const all=wqList(ty).map(x=>x.ref),slots=all.map((r,i)=>refs.includes(r)?i:-1).filter(i=>i>=0);refs.forEach((r,j)=>{if(slots[j]!==undefined)all[slots[j]]=r});WQ()[ty]=all}commit()}
/* add to the front or the end of a line-up; returns its place */
function qPut(ty,s,r,where){const key=r.slice(r.indexOf(":")+1);
  if(ty==="les"){const k=key,u=unitBy(k);if(!plannedUnits(s).some(z=>z.k===k))S.extra={...(S.extra||{}),[s]:[...new Set([...((S.extra||{})[s]||[]),k])]};
    const nx=((S.next||{})[s]||[]).filter(x=>x!==k),cur=plannedAt(s,S.levels[s]).filter(z=>rank[coverage(z)]<2&&z.k!==k).map(z=>z.k);
    S.next={...(S.next||{}),[s]:where==="first"?[k,...nx]:[...new Set([...nx,...cur]),k]};S.later={...(S.later||{}),[s]:((S.later||{})[s]||[]).filter(x=>x!==k)};commit();return qPos(u)}
  const W=WK(),w={...(W[key]||{})};if(w.st==="planned")delete w.st;W[key]={...w,q:true,planned:w.planned||today};
  const all=wqList(ty).map(x=>x.ref).filter(x=>x!==r);WQ()[ty]=where==="first"?[r,...all]:[...all,r];commit();return WQ()[ty].indexOf(r)+1}
function qPick(ty,s,r,label,cls){const a=w=>`data-act="qput" data-ty="${ty}" data-s="${s}" data-r="${esc(r)}" data-w="${w}"`;
  if(ui.qpick===r)return `<span class="qpick"><button class="btn xs accent" ${a("first")}>${ty==="les"?"Do it next":"First in queue"}</button><button class="btn xs soft" ${a("last")}>${ty==="les"?"End of this class":"Last in queue"}</button><button class="link xs" data-act="qpick" data-r="">Cancel</button></span>`;
  return `<button class="${cls||"btn sm"}" data-act="qpick" data-r="${esc(r)}">${label}</button>`}
function viewTasks(){initDrag();const k=seg("tasks");let h=pageHead("To do")+segBar("tasks")+`</section>`;return h+(k==="going"?goingView():k==="new"?newView():queuesView())}
const taskRow=(x,extra="")=>`<div class="trow"><span class="tic" aria-hidden="true">${WT[x.ty][1]}</span><div style="min-width:0;flex:1"><b>${esc(x.title)}</b> ${x.ty==="les"?`<span class="pill st-going" style="font-size:11px">Ongoing</span>`:stPills(x)}<br><span class="xs muted">${x.ty==="les"?"":esc(chT(x.u))+" · "}${esc(SUBJ[x.u.subj])} · ${esc(x.sub)}</span>${extra}</div><button class="btn xs ${x.state==="going"?"accent":"soft"}" ${x.open}>${x.go}</button></div>`;
function grouped(list,empty,rowFn){const by=Object.keys(WT).map(t=>[t,list.filter(x=>x.ty===t)]).filter(([,l])=>l.length);if(!by.length)return `<section class="sec"><p class="note">${empty}</p></section>`;
  return by.map(([t,l])=>`<section class="sec"><div class="sech"><h3 style="font-size:18px">${WT[t][1]} ${WT[t][0]}</h3><span class="pill">${l.length}</span></div><div class="col" style="gap:8px">${l.map(rowFn).join("")}</div></section>`).join("")}
function goingView(){const L=bySubj([...lessonsGoing(),...workItems().filter(x=>x.state==="going")]),ex=(S.exps||[]).filter(e=>!e.closed);
  let h=`<section class="sec">${subjChips()}</section>`+grouped(L,"Nothing started yet. When you start a lesson, worksheet, quiz or project, it stays here until it's finished.",x=>taskRow(x));
  if(ex.length)h+=`<section class="sec"><div class="sech"><h3 style="font-size:18px">🌱 Daily check-ins</h3><span class="pill">${ex.length}</span></div><div class="col" style="gap:8px">${ex.map(e=>{const day=Math.round((parse(today)-parse(e.start))/864e5)+1,c=e.checks.includes(today);return `<div class="trow"><span class="tic">🌱</span><div style="min-width:0;flex:1"><b>${esc(e.title)}</b><br><span class="xs muted">Day ${day}${e.topic?" · "+esc(e.topic):""}${c?" · checked today":""}</span><br><button class="link xs" data-act="close" data-e="${e.id}">Finish it</button></div><button class="btn xs ${c?"soft":"accent"}" data-act="check" data-e="${e.id}">${c?"Checked ✓":"Check today"}</button></div>`}).join("")}</div></section>`;
  return h}
function newView(){const L=bySubj(workItems().filter(x=>x.pend));
  return `<section class="sec">${subjChips()}<p class="sm muted">Not started yet, from lesson parts you've done. Queued ones stay here too, tagged Queued, until you start them.</p></section>`+
   grouped(L,"Nothing pending. When you finish a lesson part, its worksheets, quizzes, experiments and activities that weren't started show up here.",x=>taskRow(x,`<div class="row" style="gap:10px;margin-top:4px">${x.q?`<button class="link xs" data-act="qx" data-ty="${x.ty}" data-r="${esc(x.ref)}">Take out of the queue</button>`:qPick(x.ty,x.u.subj,x.ref,"+ Queue","link xs")}${ui.qpick===x.ref?"":`<button class="link xs" data-act="qx" data-ty="${x.ty}" data-r="${esc(x.ref)}" data-how="skip">Not doing this</button>`}</div>`))}

function queuesView(){const t=WT[ui.tq]?ui.tq:"les",s=S.subjects.includes(ui.qs)?ui.qs:S.subjects[0];
  let h=`<section class="sec"><div class="seg qtypes">${Object.entries(WT).map(([k,[n,ic]])=>`<button aria-pressed="${k===t}" data-act="tqt" data-t="${k}">${ic} ${n}${k==="les"?"":` <small>${bySubj(wqList(k)).length}</small>`}</button>`).join("")}</div>`;
  h+=t==="les"?`<div class="seg">${S.subjects.map(x=>`<button aria-pressed="${x===s}" data-act="qsub" data-s="${x}">${SUBJ[x]}</button>`).join("")}</div>`:subjChips();
  const L=qItems(t,s),mv=(x,d,on,lab,ch)=>`<button class="iconbtn qb" data-act="qmv" data-ty="${t}" data-s="${s}" data-r="${esc(x.ref)}" data-d="${d}" ${on?"":"disabled"} aria-label="${lab}">${ch}</button>`;
  h+=`<div class="row"><button class="btn soft sm" data-act="qshuf" data-ty="${t}" data-s="${s}">${icon("spark")}Shuffle</button>${t==="les"?`<button class="btn ${S.exam?"":"soft"} sm" data-act="exam">${S.exam?"Exam track on":"Exam track off"}</button>`:""}</div>`;
  h+=L.length?`<div class="qlist" data-ty="${t}" data-s="${s}">${L.map((x,i)=>`<div class="qrow2${x.ref===ui.flash?" flash":""}" data-r="${esc(x.ref)}"><span class="dh" aria-hidden="true">⠿</span><span class="qn">${i+1}</span><button class="plain" ${x.open} style="min-width:0;flex:1;text-align:left"><b>${esc(x.title)}</b>${x.ty&&x.ty!=="les"?" "+stPills(x).replace(/ <span class="pill st-queued"[^]*$/,""):""}<br><span class="xs muted">${esc(x.sub)}</span></button><span class="row" style="gap:4px;flex-wrap:nowrap">${mv(x,-1,i>0,"Move up","▲")}${mv(x,1,i<L.length-1,"Move down","▼")}${x.rm?`<button class="iconbtn qb" data-act="qx" data-ty="${t}" data-s="${s}" data-r="${esc(x.ref)}" aria-label="Take out">${icon("close")}</button>`:""}</span></div>`).join("")}</div>`
    :`<p class="note">${t==="les"?"No chapters waiting.":`No ${WT[t][0].toLowerCase()} queued${qfOf()==="all"?"":" in "+SUBJ[qfOf()]}. Tap “+ Queue” on one in Pending, in a lesson or in a chapter.`}</p>`;
  if(t==="les")h+=`<button class="link" data-act="lt2" style="justify-self:start">Find more chapters and topics in the Library →</button>`;
  return h+`</section>`}
function qzsView(){const P=ui.sheet,u=unitBy(P.k),Q=u?quizQ(u,P.n):[];document.getElementById("sheetTitle").textContent=`Quiz · Part ${P.n}`;if(!u)return `<p class="note">Not found.</p>`;
  return `<p class="sm"><b>${esc(chT(u))}</b> · ${esc(SUBJ[u.subj])}</p><p class="sm muted">Ask aloud. Let your child answer first, then tap to check.</p>${quizList(u.k,P.n,Q)}`}
/* drag to reorder: works with a finger or a mouse, on the ⠿ handle */
function initDrag(){if(window._dkDrag)return;window._dkDrag=1;let D=null;
  document.addEventListener("pointerdown",e=>{const h=e.target.closest(".qlist .dh");if(!h)return;const row=h.closest(".qrow2");D={row,list:row.parentElement,id:e.pointerId,moved:false};row.classList.add("drag");try{h.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault()});
  document.addEventListener("pointermove",e=>{if(!D||e.pointerId!==D.id)return;const rows=[...D.list.children].filter(r=>r!==D.row),after=rows.find(r=>{const b=r.getBoundingClientRect();return e.clientY<b.top+b.height/2});
    if(after!==D.row.nextElementSibling||(!after&&D.row!==D.list.lastElementChild)){D.list.insertBefore(D.row,after||null);D.moved=true;[...D.list.children].forEach((r,i)=>{const n=r.querySelector(".qn");if(n)n.textContent=i+1})}
    if(e.clientY<90)scrollBy(0,-14);else if(e.clientY>innerHeight-130)scrollBy(0,14)});
  const end=e=>{if(!D||(e.pointerId!==undefined&&e.pointerId!==D.id))return;const d=D;D=null;d.row.classList.remove("drag");if(!d.moved)return;sfx("flip");setOrder(d.list.dataset.ty,d.list.dataset.s,[...d.list.children].map(r=>r.dataset.r))};
  document.addEventListener("pointerup",end);document.addEventListener("pointercancel",end)}
/* daily check-ins: ideas when there are none */
function trackIdeas(n){const have=new Set((S.exps||[]).map(e=>e.title)),out=[],R=/\b(grow(s|ing|th)?|sprout\w*|seeds?|germinat\w*|crystals?|diary|every day|each day|daily|mould\w*|rot(s|ting)?)\b/i;
  const us=[...S.subjects.flatMap(s=>plannedUnits(s).slice(0,15)),...DATA.items.filter(i=>i.c?.p&&S.subjects.includes(i.subj))];
  for(const pass of [1,2])for(const u of us){const P=u.c?.p;if(!P)continue;for(const e of [...(P.experiments||[]),...(P.activities||[])]){if(have.has(e.title)||out.some(o=>o.e.title===e.title))continue;
    const ok=pass===1?R.test(e.title+" "+(e.question||"")+" "+(e.steps||[]).join(" "))&&refParts(u,e.id).length>=1:refParts(u,e.id).length>=2;if(ok){out.push({u,e});if(out.length>=n)return out}}}return out}
/* DeepKids topics: how long each learning day, and which one fits the day's lessons */
const DKSTEPS=[0,10,15,20,30,45,60],dkMinsOf=()=>0;
const DKSTOP=new Set("this that with from what your have they their them about into does which when where will would there these those child make each more some like other than then very just also only many much were been being because around chapter lesson learn talk book know things thing people today tell show find story".split(" "));
function dkWords(s){return new Set((String(s||"").toLowerCase().match(/[a-z]{4,}/g)||[]).filter(w=>!DKSTOP.has(w)).map(w=>w.replace(/(ies|es|s)$/,"")))}
function dkPick(date,lessons){const L=lessons.map(l=>l.u).filter(Boolean),live=DATA.topics.filter(t=>(t.cls||[1,2,3,4,5]).includes(S.levels.dks||S.levels.sci||1)&&rank[st("dk|"+t.id)]<2);if(!live.length)return null;
  const lw=new Set(L.flatMap(u=>[...dkWords([u.title,u.c?.covers,u.c?.p?.summary,(u.c?.p?.words||[]).map(x=>x[0]).join(" ")].join(" "))]));let best=null,h0=0;for(const c of date)h0=(h0*31+c.charCodeAt(0))%9973;
  live.forEach((t,i)=>{const mapped=L.find(u=>(u.dk||[]).includes(t.id)),hit=[...dkWords([t.name,t.summary,t.sub,t.q].join(" "))].filter(w=>lw.has(w));const sc=(mapped?100:0)+hit.length+(rank[st("dk|"+t.id)]===1?2:0)+((h0+i*7)%13)/100;if(!best||sc>best.sc)best={sc,t,mapped,hit}});
  const u=unitBy("dk|"+best.t.id);if(!u)return null;const near=best.mapped||L.find(x=>[...dkWords(x.title)].some(w=>best.hit.includes(w)))||null;
  return {u,why:best.mapped?`Goes with ${chT(best.mapped)}`:near?`Goes with ${chT(near)} (${best.hit.slice(0,2).join(", ")})`:best.hit.length?`Links to today's lessons: ${best.hit.slice(0,2).join(", ")}`:"Today's big question"}}
function ideasHtml(){return trackIdeas(3).map(({u,e})=>`<div class="trow"><span class="tic">🌱</span><div style="min-width:0;flex:1"><b>${esc(e.title)}</b><br><span class="xs muted">${esc(chT(u))} · ${esc(SUBJ[u.subj])}</span></div><button class="btn xs soft" data-act="startexp" data-title="${esc(e.title)}" data-topic="${esc(chT(u))}">Start</button></div>`).join("")}
function dkPaceCard(){if(!plusOn()||!S.subjects.includes("sci"))return "";const m=dkMinsOf(),left=DATA.topics.filter(t=>(t.cls||[1,2,3,4,5]).includes(S.levels.sci||1)&&rank[st("dk|"+t.id)]<2).length;
  return `<div class="card r-both"><div class="sech"><div class="row" style="gap:8px"><span style="font-size:28px" aria-hidden="true">✨</span><h3>DeepKids topics</h3></div><div class="stepper"><button data-act="dkmin" data-d="-1" ${m<=0?"disabled":""} aria-label="Less time">−</button><span class="sm" style="min-width:64px;text-align:center">${m?m+" min":"Off"}</span><button data-act="dkmin" data-d="1" ${m>=60?"disabled":""} aria-label="More time">+</button></div></div>
   <p class="xs muted">${m?`Each learning day: ${m} minutes on a big question that goes with that day's lessons. ${left} topic${left===1?"":"s"} for Class ${S.levels.sci||1}.`:"Off. Turn it on to add a big question to each learning day."}</p></div>`}
/* every lesson step says where it comes from: the textbook (open it at these pages) or DeepKids (book closed) */
/* ---------- DeepKids Plus: locked AI features open the upgrade; a message that needs AI is kept and read right after upgrading ---------- */
const PLUSR={photo:"Reading photos and screenshots",chat:"Understanding longer messages",shelf:"Sorting your shelf from photos",test:"Entrance test papers",topic:"Exploring new topics"};
const lockBtn=(r,cls,label)=>`<button class="${cls} locked" data-act="plus" data-r="${r}" aria-label="${esc(PLUSR[r])}: part of DeepKids Plus">${label}<span class="lk">🔒</span></button>`;
function plusView(){const r=ui.sheet?.r,pend=S.pendAI;document.getElementById("sheetTitle").textContent="DeepKids Plus";const waiting=!!S.plusWait;
  return `<div class="exdone">${blob("var(--sun)",6,"wow","",'width="76" height="76"')}<h2 style="font-size:24px">DeepKids Plus</h2>${r?`<p class="sm"><b>${esc(PLUSR[r]||"")}</b> is part of Plus.</p>`:""}</div>
  <ul class="pluslist"><li>📷 Send photos and screenshots of timetables, WhatsApp messages, notes and receipts; they go straight into your plan</li><li>💬 Write the way you talk: long or mixed-up messages are understood</li><li>🏷️ Photos of work are matched to the right chapter automatically</li><li>📚 Shelf photos become a tagged home library</li><li>📝 Entrance test papers for any board and class</li><li>🔎 Explore any new topic, with lesson plans written for you</li></ul>
  ${pend?`<div class="ask"><span class="eyebrow">Your message is kept</span>“${esc(pend.text.slice(0,160))}${pend.text.length>160?"…":""}”<br><span class="xs muted">As soon as Plus is on, DeepKids reads it. No need to type it again.</span></div>`:""}
  <div class="col" style="gap:10px;margin-top:12px"><button class="btn accent" data-act="plusgo" ${waiting&&!window.DK_PLATFORM?.upgrade?"disabled":""}>${waiting&&!window.DK_PLATFORM?.upgrade?"You're on the list ✓":"Upgrade to Plus"}</button><button class="btn line sm" data-act="texit">Not now</button></div>
  ${waiting&&!window.DK_PLATFORM?.upgrade?`<p class="xs muted" style="text-align:center">Plus opens soon. We'll let you know here as soon as it does.</p>`:""}`}
async function plusGo(){const P=window.DK_PLATFORM;if(P?.upgrade){let ok=false;try{ok=await P.upgrade({reason:ui.sheet?.r||""})}catch(e){}if(ok){await afterUpgrade();return}toast("Payment didn't go through. Nothing was charged.");return}
  S.plusWait=S.plusWait||Date.now();sfx("ok");toast("You're on the list. Plus opens soon.");commit()}
async function afterUpgrade(){try{SAMPLE=await window.claude?.use?.("sample")||null;const l=SAMPLE?await SAMPLE.limits().catch(()=>null):null;IMGOK=!!l?.images}catch(e){}sfx("win");confetti();toast("Welcome to DeepKids Plus!");
  if(ui.sheet)goBack();if(S.pendAI&&SAMPLE){const t=S.pendAI.text;tab="week";ui.seg={...(ui.seg||{}),week:"tell"};ui.dump={text:t,chat:[]};delete S.pendAI;commit();setTimeout(()=>{const ta=document.getElementById("dumpText");if(ta)ta.value=t;runDump()},300)}else commit()}
/* a message the phone can't read well: too long, nothing found, or sentences that aren't plans */
function needsAI(text,R){if(!R.items.length)return true;if(text.length>280)return true;return R.items.some(x=>x.type!=="have"&&x.title.split(" ").length>5)}
const clearItem=x=>x.type==="have"||(x.title.split(" ").length<=4&&!/\b(said|might|maybe|thing|stuff|sometimes|basically|figure|think|probably|soon)\b/i.test(x._src||"")&&(x.start||x.days||(x.date&&x.type!=="todo")||TODOW.test(x._src||"")));
function localDump(text){const D_=ui.dump=ui.dump||{};const R0=localParse(text),hard=needsAI(text,R0),R=hard?{items:R0.items.filter(clearItem),asks:[]}:R0;if(hard){const keep=new Set(R.items);R.asks=R0.asks.filter(a=>keep.has(R0.items[a.i])).map(a=>({...a,i:R.items.indexOf(R0.items[a.i])}))}
  if(hard){S.pendAI={text,at:Date.now()};save()}D_.needAI=hard;
  if(!R.items.length){D_.err="";D_.items=D_.items||null;sfx("tap");render();return}
  D_.local=true;D_.items=[...(D_.items||[]),...R.items];const base=D_.items.length-R.items.length;D_.asks=[...(D_.asks||[]),...R.asks.map(a=>({...a,i:a.i+base}))];D_.questions=D_.asks.map(a=>a.q);D_.err="";clearIn("dumpText");sfx("ok");render()}
const needAICard=D_=>D_.needAI&&!SAMPLE?`<div class="needai"><span class="lk">🔒</span><div><b>${D_.items?.length?"Some of this needs DeepKids Plus to read properly.":"This needs DeepKids Plus to read."}</b><p class="xs muted">${D_.items?.length?"We picked out what we could above. ":""}Your message is kept. After upgrading, DeepKids reads it right away.</p></div><button class="btn sm accent" data-act="plus" data-r="chat">Upgrade</button></div>`:"";

/* ---------- reading plans without AI: the common ways parents write classes, rest, outings, to-dos and things they own ---------- */
const MONTHS={jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,sept:8,oct:9,nov:10,dec:11};
const DAYW={sun:0,mon:1,tue:2,tues:2,wed:3,thu:4,thur:4,thurs:4,fri:5,sat:6};
const CLASSW=/\b(tuition|class|classes|coaching|lesson|lessons|swim\w*|dance|dancing|tabla|music|piano|guitar|keyboard|violin|singing|karate|taekwondo|judo|chess|art|drawing|painting|abacus|robotics|coding|cricket|football|tennis|badminton|skating|yoga|gym|sports?|practice|training|kathak|bharatanatyam|carnatic|hindustani|veena|mridangam|sloka|shloka|vedic|phonics|tutor|camp)\b/i;
const OUTW=/\b(trip|visit|visiting|outing|zoo|museum|park|picnic|party|birthday|wedding|function|holiday|vacation|festival|temple|travel|travelling|going to|movie|show|exhibition|fair|mela|library|farm|beach|grandma|grandpa|nani|dadi|nana|dada|cousin)\b/i;
const APPTW=/\b(doctor|dentist|appointment|check-?up|vaccin\w*|hospital|clinic|eye test|haircut|meeting|ptm|interview|exam)\b/i;
const MEALW=/\b(lunch|dinner|breakfast|snack|tiffin|meal)\b/i;
const TODOW=/^(buy|get|order|call|pay|book|send|remember|need to|pick up|collect|return|print|fill|submit|renew|fix|clean|pack|bring|make)\b/i;
const HAVEW=/^(we\s+(have|own|got|bought)|we've\s+got|i\s+(have|bought)|there(?:'s| is| are)\s+(a|an)?|have\s+(a|an))\s+/i;
const FILLER=new Set(["every","each","at","from","to","till","until","on","and","the","next","this","coming","for","an","a","of","in","is","are","will","be","has","have","goes","go","going","does","do","daily","weekly","weekday","weekdays","weekend","weekends","hour","hours","hr","hrs","min","mins","minutes","pm","am","morning","evening","night","afternoon","noon","today","tomorrow","tonight","day","days","between","around","about","by","with","her","his","she","he","they","we","our","my","me","i","there","after","before","then","also","plus","starts","starting","start","ends","ending","time","times","week","month","p.m.","a.m.","o'clock","oclock"]);
function dateWords(t){t=t.toLowerCase();const now=parse(today);
  if(/\bday after tomorrow\b/.test(t))return addDays(today,2);if(/\btomorrow\b/.test(t))return addDays(today,1);if(/\btoday\b|\btonight\b/.test(t))return today;
  let m=/\b(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)[a-z]*\b/.exec(t)||null,mo,d;if(m){d=+m[1];mo=MONTHS[m[2]]}
  else if(m=/\b(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)[a-z]*\s+(\d{1,2})(?:st|nd|rd|th)?\b/.exec(t)){mo=MONTHS[m[1]];d=+m[2]}
  else if(m=/\b(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{2,4}))?\b/.exec(t)){d=+m[1];mo=+m[2]-1;if(m[3]){const y=+m[3]<100?2000+ +m[3]:+m[3];return iso(new Date(y,mo,d))}}
  if(mo!==undefined&&d>=1&&d<=31){let dt=new Date(now.getFullYear(),mo,d);if(iso(dt)<addDays(today,-30))dt=new Date(now.getFullYear()+1,mo,d);return iso(dt)}
  m=/\b(?:next|this|coming|on)?\s*(sun|mon|tues?|wed|thu(?:rs?)?|fri|sat)[a-z]*\b/.exec(t);if(m){const wd=DAYW[m[1]]??DAYW[m[1].slice(0,3)];let k=(wd-now.getDay()+7)%7;if(k===0||/\bnext\b/.test(t)&&k<7&&/\bnext week\b/.test(t))k+=7;return addDays(today,k)}
  return null}
const dayNames=t=>[...t.toLowerCase().matchAll(/\b(sun|mon|tues?|wed(?:nes)?|thu(?:rs?)?|fri|sat(?:ur)?)(?:days?|s|\.)?\b/g)].map(m=>DAYW[m[1].slice(0,3)]).filter((v,i,a)=>v!==undefined&&a.indexOf(v)===i);
function recurring(t){const l=t.toLowerCase();if(/\bevery ?day\b|\bdaily\b|\beach day\b/.test(l))return [0,1,2,3,4,5,6];if(/\bweek ?days\b|\bmon(day)?\s*(-|–|to)\s*fri(day)?\b/.test(l))return [1,2,3,4,5];if(/\bweekends?\b/.test(l))return [0,6];
  const D=dayNames(l);if(D.length&&(/\bevery\b|\beach\b|\bweekly\b|\b(sun|mon|tues|wednes|thurs|fri|satur)days\b/.test(l)||D.length>1))return D;if(D.length&&CLASSW.test(l)&&!/\bnext\b|\bthis\b|\bcoming\b|\bon\s+\d/.test(l))return D;return null}
function titleOf(seg){const kid=(S.child||"").toLowerCase();let t=seg.replace(/\b(after|before)\b.*$/i,"").replace(/\b\d{1,2}([:.]\d{2})?\s*(am|pm|a\.m\.|p\.m\.)?\b/gi," ").replace(/\b(\d{1,2})(st|nd|rd|th)\b/gi," ").replace(/[–—\-\/,:;()!?]/g," ");
  const W=t.split(/\s+/).filter(Boolean).filter(w=>{const l=w.toLowerCase().replace(/'s$/,"");if(FILLER.has(l))return false;if(kid&&l===kid)return false;if(/^(sun|mon|tue|tues|wed|wednes|thu|thur|thurs|fri|sat|satur)(day|days|s)?$/.test(l))return false;if(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*$/.test(l))return false;if(/^(one|two|three|half|an)$/.test(l))return false;return true});
  const s=W.slice(0,6).join(" ").trim();return s?s[0].toUpperCase()+s.slice(1):""}
function splitPlans(text){const out=[];const add=s=>{s=s.trim().replace(/[.!]+$/,"");if(!s)return;if(out.length&&!titleOf(s)&&!HAVEW.test(s))out[out.length-1]+=" "+s;else out.push(s)};
  text.split(/\n+|(?<=[.!?])\s+(?=[A-Z])|;\s*/).forEach(sent=>{if(HAVEW.test(sent.trim()))add(sent);else sent.split(/,\s+/).forEach(add)});return out}
function ampmGuess(t,w){const l=t.toLowerCase();if(!w.start||/\d\s*(am|pm|a\.m\.|p\.m\.)|\b(am|pm|noon)\b/.test(l))return null;const h=+w.start.slice(0,2);if(/\b(morning)\b/.test(l))return h>=12?clock24(hm(w.start)-720):null;if(/\b(evening|night|afternoon)\b/.test(l))return h<12?clock24(hm(w.start)+720):null;if(h>=1&&h<=6)return "pm";if(h>=7&&h<=11)return "ask";return null}
function localParse(text){const items=[],asks=[];
  splitPlans(text).forEach(seg=>{const l=seg.toLowerCase();
    const hv=HAVEW.exec(seg);if(hv){seg.slice(hv[0].length).split(/,\s*|\s+and\s+/).map(s=>s.replace(/^(a|an|the|some)\s+/i,"").trim()).filter(Boolean).forEach(n=>items.push({type:"have",title:n[0].toUpperCase()+n.slice(1),who:"you",category:/\b(book|books|comic|comics|story|novel|encyclopedia|atlas)\b/i.test(n)?"book":/\b(game|ludo|chess|carrom|puzzle|cards|monopoly|scrabble|uno|jenga|snakes)\b/i.test(n)?"game":/\b(tablet|laptop|computer|ipad|phone|kindle|tv|speaker)\b/i.test(n)?"electronics":/\b(microscope|magnifying|telescope|globe|kit|magnet|lens|thermometer|binoculars)\b/i.test(n)?"equipment":"other",keep:true}));return}
    let w=whenOf(seg),days=recurring(seg),date=days?null:dateWords(seg);const title=titleOf(seg);if(!title)return;
    let type=RESTW.test(l)?"rest":MEALW.test(l)?"meal":TODOW.test(seg)?"todo":APPTW.test(l)?"other":CLASSW.test(l)?"class":OUTW.test(l)?"outing":(w.start||days)?"class":"todo";
    if(type==="todo"&&w.start&&!TODOW.test(seg))type="other";
    const who=/\b(i|me|my)\b/.test(l)&&!CLASSW.test(l)?"you":["class","rest"].includes(type)?"kid":/\b(we|us|together|family)\b/.test(l)?"both":type==="todo"?"you":"both";
    const it={type,title,who,date:days?null:(date||(type==="todo"?today:null)),days:days||null,start:w.start||null,end:w.end||null,note:"",keep:true,_src:seg};
    if(!it.start&&/\bafter\b/.test(l)){const fx=fixItem({...it,note:seg});if(fx.start){it.start=fx.start;it.end=fx.end||null;if(fx.days?.length)it.days=fx.days}}
    const ap=ampmGuess(seg,it);if(ap==="pm"){it.start=clock24(hm(it.start)+720);if(it.end&&hm(it.end)<hm(it.start))it.end=clock24(hm(it.end)+720)}else if(ap==="ask")asks.push({i:items.length,need:"ampm",q:`Is ${title} at ${clock(hm(it.start)).replace(/:00/,"").replace(/ ?(am|pm)/,"")} in the morning or the evening?`});else if(ap)it.start=ap;
    if(it.start&&!it.end){const d=w.dur||(type==="meal"?45:60);it.end=clock24(hm(it.start)+d)}
    if(["class","rest","meal","outing"].includes(type)){if(!it.days&&!it.date)asks.push({i:items.length,need:"days",q:`Which days is ${title}? (e.g. Tue and Thu, every day, or a date)`});if(!it.start&&type!=="outing")asks.push({i:items.length,need:"time",q:`What time is ${title}? (e.g. 5 to 6 pm)`})}
    items.push(it)});
  return {items,asks}}
/* ---------- your data: save a full copy (plan, progress, answers, photos) and bring it into another device or the website ---------- */
function dataBox(){const P=ui.dx;return `<p class="xs muted">One file with everything: your plan, progress, answers, routines and photos. Use it to keep a backup, or to move to the DeepKids website.</p>
  <div class="row" style="gap:10px;flex-wrap:wrap"><button class="btn soft sm" data-act="dexport" ${P?"disabled":""}>${P?.what==="out"?esc(P.msg):"Save a copy"}</button><label class="btn line sm" style="cursor:pointer">${P?.what==="in"?esc(P.msg):"Bring in a copy"}<input type="file" id="importFile" accept=".zip,.json,application/zip,application/json" hidden ${P?"disabled":""}></label></div>`}
async function dataExport(){ui.dx={what:"out",msg:"Packing…"};renderSheet();const files=[{name:"deepkids-data.json",data:JSON.stringify({app:"DeepKids",v:1,exported:new Date().toISOString(),state:S},null,1)}];let miss=0,i=0;const W=S.work||[];
  for(const w of W){i++;ui.dx.msg=`Adding photos (${i} of ${W.length})…`;renderSheet();try{const r=await fetch("/_blob/"+encodeURIComponent(w.id));if(!r.ok)throw 0;files.push({name:"photos/"+encodeURIComponent(w.id),data:await r.blob()})}catch(e){miss++}}
  try{const blob=await makeZip(files),name=`DeepKids ${fsafe(S.child||"family")} ${today}.zip`;ui.dx=null;renderSheet();await saveDoc(blob,name);if(miss)toast(`${miss} photo${miss>1?"s":""} couldn't be added`)}catch(e){ui.dx=null;renderSheet();toast("Couldn't make the file")}}
function readZip(buf){const u=new Uint8Array(buf),dv=new DataView(buf),out={},dec=new TextDecoder();let e=u.length-22;while(e>=0&&dv.getUint32(e,true)!==0x06054b50)e--;if(e<0)throw new Error("not a zip");const n=dv.getUint16(e+10,true);let p=dv.getUint32(e+16,true);
  for(let k=0;k<n;k++){const method=dv.getUint16(p+10,true),size=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lo=dv.getUint32(p+42,true),name=dec.decode(u.subarray(p+46,p+46+nl));
    if(method===0){const lnl=dv.getUint16(lo+26,true),lxl=dv.getUint16(lo+28,true),st=lo+30+lnl+lxl;out[name]=u.slice(st,st+size)}p+=46+nl+xl+cl}return out}
async function dataImport(file){let data=null,photos={};try{if(/\.zip$/i.test(file.name)||file.type.includes("zip")){const Z=readZip(await file.arrayBuffer());data=JSON.parse(new TextDecoder().decode(Z["deepkids-data.json"]));for(const k in Z)if(k.startsWith("photos/"))photos[decodeURIComponent(k.slice(7))]=Z[k]}else data=JSON.parse(await file.text())}catch(e){toast("That isn't a DeepKids file");return}
  const st=data?.state;if(!st||st.setup===undefined){toast("That isn't a DeepKids file");return}
  if(!confirm(`Bring in ${st.child||"this family"}'s data? It replaces what's on this device now. Your current data is kept as a backup file first.`))return;
  try{const bk=JSON.stringify({app:"DeepKids",v:1,exported:new Date().toISOString(),state:S});lsSet("dk-backup-"+(ACC||"guest"),bk)}catch(e){}
  ui.dx={what:"in",msg:"Bringing it in…"};renderSheet();const W=st.work||[],ids=Object.keys(photos);let i=0,miss=0;
  if(ids.length&&ASSETS){for(const w of W){const b=photos[w.id];if(!b){continue}i++;ui.dx.msg=`Photos (${i} of ${ids.length})…`;renderSheet();try{const r=await ASSETS.upload(new Blob([b],{type:w.type||"image/jpeg"}));w.id=r.id}catch(e){miss++}}}
  else if(ids.length)miss=ids.length;
  S={...fresh(),...st,acct:S.acct};ui.dx=null;sfx("win");toast(miss?`Brought in. ${miss} photo${miss>1?"s":""} couldn't be added here.`:"All brought in");commit()}

/* Today always opens on today: leaving the tab, or the app, resets a day you browsed to */
let hiddenAt=0;
document.addEventListener("visibilitychange",()=>{if(document.hidden){hiddenAt=Date.now();return}if(hiddenAt&&Date.now()-hiddenAt>20000&&ui.tday){ui.tday=null;render()}hiddenAt=0});

/* ---------- one clear home for everything: 4 tabs, each with a few named parts, plus Settings ---------- */
const SEGS={
  week:[["tell","Tell DeepKids","Chat, type or add by hand. What DeepKids asked, routines, classes and rest"],["cal","Calendar","See the plan by day, week, month or year"],["todo","To do","Your own to-dos, and prep and things to gather for coming lessons"],["queue","Queue","What comes next, by kind and subject. Drag or use the arrows to change the order"],["pending","Pending","From lessons you've done: not started yet"],["ongoing","Ongoing","Started and not finished yet"]],
  tasks:[["going","Started","Started and not finished yet: lessons, worksheets, quizzes, projects and more"],["new","Not started","From lessons you've done: things that weren't started yet"],["queue","Queues","What comes next for each kind. Drag or use the arrows to change the order"]],
  journey:[["overview","Overview","How each subject is going, chapter by chapter"],["time","Time","Time spent each day and subject, and everything done"],["work","Work","Finished work with answers, and photos"],["school","School","Report, entrance test and a folder to send to a school"]],
};
const seg=k=>{ui.seg=ui.seg||{};const L=SEGS[k];return L.some(x=>x[0]===ui.seg[k])?ui.seg[k]:L[0][0]};
function segBar(k){const cur=seg(k),L=SEGS[k];return `<div class="seg segmain">${L.map(([v,n])=>`<button aria-pressed="${cur===v}" data-act="seg" data-k="${k}" data-v="${v}">${n}</button>`).join("")}</div><p class="xs muted segdesc">${esc(L.find(x=>x[0]===cur)[2])}</p>`}
const pageHead=(t,extra="")=>`<section class="sec" style="margin-top:8px"><div class="sech"><h1 style="font-size:30px">${t}</h1>${extra}</div>`;
function viewJourneyTabs(){const k=seg("journey"),kid=esc(S.child||"Your child");let h=pageHead(`${kid}'s progress`,kidBlob("","happy",'width="50" height="50"'))+segBar("journey")+`</section>`;
  if(k==="overview"){const o=viewJourney0().replace(/<button class="menurow" data-act="(rem|told|track|uploads|school|folder|todo|hist)"[\s\S]*?<\/button>/g,"");h+=o.replace(/^<section class="sec" style="margin-top:8px"><div class="sech"><h1[^>]*>[^<]*<\/h1>[\s\S]*?<\/div>/,'<section class="sec"><div class="sech"><h3>By subject</h3></div>')}
  else if(k==="time")h+=`<section class="sec"><button class="menurow" data-act="hist">${blob("var(--pist)",9,"happy","",'width="40" height="40"')}<span><b>Everything done, day by day</b><br><span class="xs muted">${S.log.length} lessons with times</span></span>${icon("next")}</button>${trackView()}</section>`;
  else if(k==="work")h+=`<section class="sec"><button class="menurow" data-act="todo">${blob("var(--tang)",11,"calm","",'width="40" height="40"')}<span><b>Unfinished work</b><br><span class="xs muted">Started, pending and queued things are in Plan → Ongoing, Pending and Queue</span></span>${icon("next")}</button></section><section class="sec"><div class="sech"><h3>Finished work</h3></div><button class="menurow" data-act="folder">${blob("var(--leaf)",14,"wow","",'width="40" height="40"')}<span><b>Work folder</b><br><span class="xs muted">Every worksheet with answers, quizzes and projects. Save or print.</span></span>${icon("next")}</button></section><section class="sec"><div class="sech"><h3>Photos and files</h3></div>${uploadsView()}</section>`;
  else h+=`<section class="sec">${schoolView()}</section>`;
  return h}
const LIBT=[["topics","Syllabus","Every chapter of every board, by subject and class"],["science","Resources","Free activities, simulations and videos, tagged to chapters"],["have","Home shelf","Books, games and kits you have at home. We suggest them in the right lesson"],["suggest","Worth buying","Books, games and kits picked for your child's age and syllabus"],["read","Read","Books and stories to read together"],["watch","Watch","Videos and shows worth watching"]];
SFX.chime=()=>{tone(988,0,.1,"sine",.07);tone(1319,.07,.16,"sine",.05)};
const MTIPS=["Tap Start when you're both ready. No rush.","Did it already? Tap the tick and choose.","Busy day? Later today moves it out of the way.","Photos of work go in Add photos.","Tell me plans in the Planner, like a message.","Small steps every day add up.","Need a break? That's part of learning too."];
document.addEventListener("click",e=>{const m=e.target.closest?.(".mascot");if(!m||e.target.closest("button,a"))return;m.classList.remove("wig");void m.getBoundingClientRect();m.classList.add("wig");sfx("chime");const r=m.getBoundingClientRect();burst(r.left+r.width/2,r.top,MTIPS[Math.floor(Math.random()*MTIPS.length)])});
document.addEventListener("click",e=>{const b=e.target.closest?.("[data-act]");if(!b)return;const a=b.dataset.act;if((a==="wkst"&&b.dataset.to==="done")||(a==="qz"&&b.dataset.r==="1")||a==="evsave"||a==="iofin"||a==="iodone"||a==="drew")setTimeout(()=>sfx("chime"),120)},true);

let lastTap=0;
document.addEventListener("click",()=>{lastTap=Date.now()},true);

const DEX=[["A class or tuition","Swimming every Tue and Thu 5 to 6 pm"],["A trip or outing","Visiting grandma in Mysore from 2 to 5 Nov"],["Rest or meals","Liri naps 2 to 3 pm every day"],["Something we own","We have a microscope, Ludo and a globe"],["A to-do","Buy a geometry box this week"]];
document.addEventListener("input",e=>{if(e.target.id==="dumpText"){const t=e.target;t.style.height="auto";t.style.height=Math.min(160,t.scrollHeight)+"px"}});

/* ---------- reminders: a nudge when the day has free time and something is waiting ---------- */
function pendingWork(){const out=[],O=openWork();
  O.wsGoing.forEach(x=>out.push({t:x.w.title,sub:`${chT(x.u)} · ${x.tot-x.ans} questions left`,m:Math.min(25,Math.max(5,Math.round((x.tot-x.ans)*1.5))),act:`data-act="ws" data-k="${x.u.k}" ${x.w.id?`data-w="${esc(x.w.id)}"`:""}`,go:"Continue"}));
  (S.todos||[]).filter(t=>!t.done&&t.date<=today).forEach(t=>out.push({t:t.title,sub:t.date<today?"To-do from "+fmt(t.date):"To-do for today",m:10,act:`data-act="told"`,go:"Open"}));
  O.started.forEach(x=>out.push({t:x.w.title||wkTitle(x.u,x.id,""),sub:`${chT(x.u)} · started ${fmt(x.w.started)}`,m:15,act:`data-act="todo"`,go:"Open"}));
  O.wsMissed.forEach(x=>out.push({t:x.w.title,sub:`${chT(x.u)} · not started`,m:Math.min(25,Math.max(8,Math.round(x.tot*1.5))),act:`data-act="ws" data-k="${x.u.k}" ${x.w.id?`data-w="${esc(x.w.id)}"`:""}`,go:"Start"}));
  return out}
function freeNow(){const nm=nowMin(),d=Dd(today),its=dayPlan(today).filter(i=>i.kind!=="brk"&&!i.anytime&&!i.done&&!evPast(i,today)&&!snzd(i,today));if(its.some(i=>i.at<=nm&&nm<i.at+i.dur))return 0;
  if(its.some(i=>OURS(i)&&i.at+i.dur<=nm))return 0;const nx=its.filter(i=>i.at>nm).sort((a,b)=>a.at-b.at)[0],end=nx?nx.at:Math.max(nm,hm(d.eveAt||"20:30"));return Math.max(0,Math.min(end-nm,180))}
const REM=()=>S.rem||(S.rem={nudge:true,notif:false});
function nudgeCard(){if(REM().nudge===false||(S.nudgeOff?.[today]||0)>Date.now())return "";const free=freeNow();if(free<10)return "";const P=pendingWork().filter(p=>p.m<=free).slice(0,2);if(!P.length)return "";
  return `<section class="card nudge-card"><div class="row" style="flex-wrap:nowrap;gap:10px">${blob("var(--sun)",6,"wow","nb",'width="40" height="40"')}<div><b style="font:600 17px var(--display)">${free>=120?"Free time now":`${hmin(free)} free now`}. Finish one?</b><p class="xs muted">Nothing else is planned${free<120?" until then":""}.</p></div></div>
    ${P.map(p=>`<div class="row nrow"><div style="flex:1;min-width:0"><b class="sm">${esc(p.t)}</b><br><span class="xs muted">${esc(p.sub)} · ≈ ${hmin(p.m)}</span></div><button class="btn sm" ${p.act}>${p.go}</button></div>`).join("")}
    <div class="row" style="gap:16px"><button class="link sm" data-act="nudgeoff">Not now</button><button class="link sm" data-act="rem">Reminders on my phone</button></div></section>`}
/* phone reminders go through the phone's own calendar: a repeating event with an alert */
function freeSlots(days=7){const out=[];for(let k=0;k<days;k++){const d=addDays(today,k),D0=Dd(d),its=dayPlan(d).filter(i=>i.kind!=="brk"&&!i.anytime).sort((a,b)=>a.at-b.at),lo=hm(D0.start||"09:30"),hi=hm(D0.eveAt||"20:30")-30;let cur=lo;const lastL=Math.max(lo,...its.filter(i=>i.kind==="lesson").map(i=>i.at+i.dur));
    for(const i of [...its,{at:hi,dur:0}]){if(i.at-cur>=25&&cur>=lastL){out.push({d,at:Math.ceil(cur/15)*15});break}cur=Math.max(cur,i.at+i.dur)}}return out}
function suggestRemTime(){const dd=REM().days||[1,2,3,4,5],S2=freeSlots(7).filter(x=>dd.includes(parse(x.d).getDay())),c={};S2.forEach(x=>{c[x.at]=(c[x.at]||0)+1});const best=Object.entries(c).sort((a,b)=>b[1]-a[1]||a[0]-b[0])[0];return best?clock24(+best[0]):"16:30"}
const BYD=["SU","MO","TU","WE","TH","FR","SA"];
function remLinks(){const R=REM(),t=R.time||suggestRemTime(),days=R.days||[1,2,3,4,5],[h,m]=t.split(":").map(Number),start=new Date(parse(today));start.setHours(h,m,0,0);if(start<new Date())start.setDate(start.getDate()+1);while(!days.includes(start.getDay()))start.setDate(start.getDate()+1);
  const f=d=>`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}T${String(d.getHours()).padStart(2,"0")}${String(d.getMinutes()).padStart(2,"0")}00`,end=new Date(start.getTime()+20*6e4),rr=`RRULE:FREQ=WEEKLY;BYDAY=${days.map(x=>BYD[x]).join(",")}`,title="DeepKids: a few minutes to finish what's open",body="Open DeepKids to see what's waiting: worksheets, projects and anything you skipped.";
  let tz="";try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone}catch(e){}
  const g=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${f(start)}/${f(end)}&details=${encodeURIComponent(body)}&recur=${encodeURIComponent(rr)}${tz?"&ctz="+encodeURIComponent(tz):""}`;
  const ics=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//DeepKids//Reminders//EN","BEGIN:VEVENT","UID:dk-rem-"+Date.now()+"@deepkids","DTSTAMP:"+f(new Date()),"DTSTART:"+f(start),"DURATION:PT20M",rr,"SUMMARY:"+title,"DESCRIPTION:"+body,"BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+title,"TRIGGER:PT0M","END:VALARM","END:VEVENT","END:VCALENDAR"].join("\r\n");
  return {g,ics,t,days}}
async function saveIcs(){const {ics}=remLinks(),name="DeepKids reminder.ics";try{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([ics],{type:"text/calendar"}));a.download=name;document.body.appendChild(a);a.click();a.remove();toast("Saved. Open it to add the reminder to your calendar.")}catch(e){toast("Couldn't save the file here")}}
function remView(){document.getElementById("sheetTitle").textContent="Reminders";const R=REM(),L=remLinks(),NOK=typeof Notification!=="undefined";
  return `<p class="sm muted">DeepKids reminds you only when the day has free time and something is waiting to be finished.</p>
  <section class="card"><span class="eyebrow">On your phone</span><b style="font:600 18px var(--display)">A daily reminder in your calendar</b><p class="xs muted">Your phone's calendar alerts you, even when DeepKids is closed. We picked a time that's usually free in your plan.</p>
    <div class="row" style="gap:10px;align-items:center"><label class="sm">At <input class="inp" type="time" data-remf="time" value="${L.t}" style="width:auto;height:40px"></label></div>
    <div class="dpick">${[1,2,3,4,5,6,0].map(d=>`<button aria-pressed="${L.days.includes(d)}" data-act="remday" data-d="${d}">${DAYS3[d]}</button>`).join("")}</div>
    <div class="row" style="gap:10px;flex-wrap:wrap"><a class="btn accent sm" href="${esc(L.g)}" target="_blank" rel="noopener">Add to Google Calendar</a><button class="btn soft sm" data-act="remics">Apple or other calendar</button></div>
    <p class="xs muted">Google Calendar opens with the reminder filled in: tap Save. Changed the time? Delete the old one in your calendar and add again.</p></section>
  <section class="card"><span class="eyebrow">While DeepKids is open</span><label class="zrow"><input type="checkbox" data-remck="notif" ${R.notif&&NOK&&Notification.permission==="granted"?"checked":""} ${NOK?"":"disabled"}><span><b class="sm">Pop-up when there's free time</b><br><span class="xs muted">${NOK?"Even if you've switched to another app, as long as DeepKids is still open.":"This phone or view doesn't allow pop-ups from DeepKids."}</span></span></label>
    <label class="zrow"><input type="checkbox" data-remck="nudge" ${R.nudge!==false?"checked":""}><span><b class="sm">A card on Today when you open the app</b><br><span class="xs muted">Shows one or two things that fit the free time.</span></span></label></section>`}
let lastNote=0;
setInterval(()=>{try{if(!S?.rem?.notif||typeof Notification==="undefined"||Notification.permission!=="granted"||!document.hidden)return;if(Date.now()-lastNote<2*36e5)return;const free=freeNow(),P=pendingWork().filter(p=>p.m<=free);if(free<15||!P.length)return;lastNote=Date.now();new Notification("DeepKids · "+hmin(free)+" free",{body:`Finish “${P[0].t}”? About ${hmin(P[0].m)}.`,tag:"dk-nudge"})}catch(e){}},5*6e4);
/* ---------- come alive: day ring, streak, a little burst when something is done ---------- */
function streak(){const ds=new Set(S.log.filter(l=>l.kind!=="skipped").map(l=>l.date));let n=0,d=ds.has(today)?today:addDays(today,-1);while(ds.has(d)){n++;d=addDays(d,-1)}return n}
function dayRing(){const it=dayPlan(today).filter(i=>i.kind!=="brk"&&OURS(i)),n=it.length,dn=it.filter(i=>i.done).length;if(!n)return "";const C=2*Math.PI*16,p=dn/n,prev=ui.ringP??p;ui.ringP=p;setTimeout(animRings,40);
  if(p===1&&prev<1&&Date.now()-lastTap<5000&&!(S.cel||{})[today]){S.cel={[today]:1};setTimeout(()=>{sfx("win");confetti();toast(`All done for today! ${S.child||""} did great.`.replace(" !","!"))},500);setTimeout(save,0)}
  return `<span class="dring ${p===1?"full":""}" title="${dn} of ${n} DeepKids items done today"><svg viewBox="0 0 40 40" width="40" height="40"><circle cx="20" cy="20" r="16" class="rbg"/><circle cx="20" cy="20" r="16" class="rfg" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-prev)}" data-to="${C*(1-p)}"/></svg><b>${p===1?"✓":dn+"/"+n}</b></span>`}
function animRings(){document.querySelectorAll(".dring .rfg[data-to]").forEach(c=>{c.style.strokeDashoffset=c.dataset.to})}
const CHEER=["Nice!","Shabash!","Well done!","Lovely!","One more done!","Super!"];
function burst(x,y,txt){if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;const e=document.createElement("div");e.className="burst";e.textContent=txt;e.style.left=x+"px";e.style.top=y+"px";document.body.appendChild(e);setTimeout(()=>e.remove(),900)}
document.addEventListener("click",e=>{const b=e.target.closest?.("[data-act]");if(!b)return;const a=b.dataset.act,done=(a==="pdone")||(a==="wkst"&&b.dataset.to==="done")||(a==="qz"&&b.dataset.r==="1")||a==="evsave"||a==="iofin"||a==="iodone"||a==="drew"||(a==="tlcheck"&&b.closest(".tr")&&!b.closest(".tr.done")&&!b.closest(".tr").querySelector('[data-id^="L-"]'))||(a==="task"&&!b.classList.contains("done"));
  if(!done)return;const r=b.getBoundingClientRect();burst(r.left+r.width/2,r.top,"✓ "+CHEER[Math.floor(Math.random()*CHEER.length)]);try{navigator.vibrate?.(15)}catch(_){}},true);
document.getElementById("nav").addEventListener("click",e=>{if(!e.target.closest("button[data-tab]"))return;const m=document.getElementById("main");m.classList.remove("enter");void m.offsetWidth;m.classList.add("enter");setTimeout(()=>m.classList.remove("enter"),700)});

/* ---------- estimated time for a lesson part: planned minutes, adjusted to the family's own pace ---------- */
function paceFactor(){const R=(S.pace||[]).filter(p=>p.est>0&&p.took>0).slice(-60).map(p=>p.took*60/p.est).filter(r=>r>.2&&r<4).sort((a,b)=>a-b);if(R.length<5)return null;return Math.min(2,Math.max(.5,R[Math.floor(R.length/2)]))}
function estMins(u,n,tot){let m=0;try{const st=stepState({u,n,tot});m=st.filter(x=>!x.ok).reduce((a,x)=>a+(x.mins||0),0)*60}catch(e){}if(!m)m=lessonMins(u.subj,today);const f=paceFactor();return {m:Math.max(5,Math.round(m*(f||1)/5)*5),own:!!f}}
const estTxt=(u,n,tot)=>`≈ ${hmin(estMins(u,n,tot).m)}`;
/* ---------- what to show next, and honest choices instead of "Done" for everything ---------- */
const OURS=i=>!["event","todo","prep","plan"].includes(i.kind);
const snzd=(i,date)=>(S.snz?.[date+"|"+i.id]||0)>nowMin();
const evPast=(i,date)=>i.kind==="event"&&!i.done&&!i.anytime&&date===today&&i.at+i.dur<=nowMin();
function pastEvCard(items){const P=items.filter(i=>evPast(i,today));if(!P.length)return "";
  return `<section class="card pastev"><span class="eyebrow">Did ${P.length>1?"these":"this"} happen?</span>${P.map(i=>`<div class="row" style="flex-wrap:nowrap;gap:10px;align-items:center"><div style="flex:1;min-width:0"><b>${esc(i.title)}</b><br><span class="xs muted">${clock(i.at)}${i.ev?.end?"–"+clock(hm(i.ev.end)):""} · ${esc(evShort(i.ev))}</span></div><button class="btn green xs" data-act="tlcheck" data-id="${i.id}" data-date="${today}">Done</button><button class="btn line xs" data-act="evmiss" data-id="${esc(i.ev.id)}" data-date="${today}">Didn't happen</button></div>`).join("")}</section>`}
function ioptsView(){const {date,id}=ui.sheet,it=dayPlan(date).find(i=>i.id===id);if(!it)return `<p class="note">That's no longer on the plan.</p>`;const L=it.kind==="lesson",title=L?chT(it.u):it.title,day=date===today?"today":fmt(date);
  document.getElementById("sheetTitle").textContent=title;const a=(act,label,sub,cls="line",extra="")=>`<button class="iopt ${cls}" data-act="${act}" data-id="${it.id}" data-date="${date}" ${extra}><b>${label}</b>${sub?`<span>${sub}</span>`:""}</button>`;
  const started=L&&stepState(it).some(x=>x.ok);let h=`<p class="sm muted">${L?`${esc(SUBJ[it.s])} · Part ${it.n} of ${it.tot}${started?" · started":""}`:esc(it.sub||"")}</p><div class="col" style="gap:10px">`;
  if(L){h+=(date===today?a("play",started?"Keep going":"Start the lesson","Opens the step-by-step lesson","green"):"")+a("iofin","We already did it",`Marks Part ${it.n} done${date===today?" now":""}`)+(date===today?a("iosnz","Later today","Moves it out of the way for an hour"):"")+a("skip","Do it on the next lesson day","Today's slot is freed; the chapter carries on next time","line",`data-s="${it.s}"`)+a("ioskip","Skip this part",`We move on to Part ${Math.min(it.tot,it.n+1)}. It shows as skipped in the history`,"line warn")}
  else{h+=(date===today?(it.kind==="warm"?a("games","Start the warm-up","","green"):it.kind==="refresh"?a("refresh","Play it","","green"):""):"")+a("iodone","We already did it","")+(date===today?a("iosnz","Later today","Moves it out of the way for an hour"):"")+a("ioskipday",`Skip it ${day}`,"It comes back on another day")}
  return h+`</div>`}

/* ---------- classes and tuitions: no "done" before they start; cancel; a short check-in after ---------- */
function dedupeEv(){const seen=new Set(),E=S.events||[],F=E.filter(e=>{const k=[String(e.title||"").toLowerCase(),e.start,e.end,e.rep,(e.days||[]).slice().sort().join(),e.date||""].join("|");if(seen.has(k))return false;seen.add(k);return true});if(F.length!==E.length)S.events=F}
const evShort=e=>e.who==="kid"?`${S.child||"Child"} ${e.kind==="rest"?"rests":"goes"}`:e.who==="both"?"Together":"You";
const evAsk=e=>["class","online","outing"].includes(e.kind)||/tuition|class|coaching|lesson/i.test(e.title);
function evGate(it,date){const e=it.ev;if(!e||it.done)return false;if(date>today||(date===today&&!it.anytime&&nowMin()<it.at)){openSheet({mode:"evpre",date,id:e.id});return true}if(evAsk(e)){ui.evf={};openSheet({mode:"evdone",date,id:e.id});return true}return false}
const evFind=id=>[...(S.events||[]),...(S.cal?.ev||[])].find(e=>e.id===id);
function evpreView(){const {date,id}=ui.sheet,e=evFind(id);document.getElementById("sheetTitle").textContent=e?e.title:"Plan";if(!e)return "";const day=date===today?"today":fmt(date);
  return `<div class="exdone">${kidBlob("mascot")}<h2 style="font-size:22px">${esc(e.title)}</h2><p>${e.start?`Starts at <b>${clock(hm(e.start))}</b> ${esc(day)}.`:""} You can mark it done once it has started.</p><div class="col" style="gap:10px;width:100%"><button class="btn line" data-act="evcancel" data-id="${esc(id)}" data-date="${date}">Cancel it for ${esc(day)}</button><button class="btn" data-act="texit">Keep it</button></div><p class="xs muted">Cancelling frees the time for lessons that day. You can undo it.</p></div>`}
const MOODS=[["great","Went well"],["ok","Okay"],["hard","Was hard"]];
function evdoneView(){const {date,id}=ui.sheet,e=evFind(id),F=ui.evf||(ui.evf={});document.getElementById("sheetTitle").textContent=e?e.title:"Check-in";if(!e)return "";const kid=esc(S.child||"your child");
  return `<p class="sm muted">${esc(fmt(date))}${e.start?" · "+clock(hm(e.start))+(e.end?"–"+clock(hm(e.end)):""):""}. A few quick questions so DeepKids knows what happened. Skip any.</p>
  <div class="chat"><div class="bub cl">Did ${kid} go?</div><div class="row" style="gap:8px"><button class="chip" aria-pressed="${F.went!==false}" data-act="evf" data-k="went" data-v="1">Yes, went</button><button class="chip" aria-pressed="${F.went===false}" data-act="evf" data-k="went" data-v="0">Missed it</button></div>
  ${F.went===false?`<div class="bub cl">What happened?</div><div class="qa"><input class="inp" id="evf-note" placeholder="Unwell, teacher on leave, holiday…" value="${esc(F.note||"")}"></div>`:`<div class="bub cl">What did they cover?</div><div class="qa"><textarea class="inp" id="evf-covered" rows="2" placeholder="e.g. Plants: parts of a flower, did a worksheet">${esc(F.covered||"")}</textarea></div>
  <div class="bub cl">How did it go?</div><div class="row" style="gap:8px">${MOODS.map(([k,l])=>`<button class="chip" aria-pressed="${F.mood===k}" data-act="evf" data-k="mood" data-v="${k}">${l}</button>`).join("")}</div>
  <div class="bub cl">Any homework?</div><div class="qa"><input class="inp" id="evf-hw" placeholder="Leave empty if none" value="${esc(F.hw||"")}"></div>
  <div class="bub cl">Anything the teacher said, or to follow up?</div><div class="qa"><input class="inp" id="evf-note" placeholder="Optional" value="${esc(F.note||"")}"></div>`}</div>
  <div class="row" style="gap:10px;margin-top:10px"><button class="btn green" data-act="evsave">Save</button><button class="link sm" data-act="evsave" data-quick="1">Just mark it done</button></div>`}
function evSave(quick){const {date,id}=ui.sheet,e=evFind(id),F=ui.evf||{},v=k=>(document.getElementById("evf-"+k)?.value||"").trim();if(!e)return;
  const rec=quick?{went:true,at:Date.now()}:{went:F.went!==false,covered:v("covered"),mood:F.mood||"",hw:v("hw"),note:v("note"),at:Date.now()};
  S.evlog={...(S.evlog||{}),[date+"|"+id]:rec};S.tl[date+"|e-"+id]=Date.now();
  if(rec.hw)S.todos=[...(S.todos||[]),{id:Math.random().toString(36).slice(2,9),title:`${e.title} homework: ${rec.hw}`.slice(0,120),who:"kid",date:addDays(date,1),note:"From "+fmt(date),done:false}];
  ui.evf=null;sfx(rec.went?"ok":"flip");toast(rec.went?(rec.hw?"Saved · homework added for tomorrow":"Saved"):"Marked as missed");goBack();commit()}
function cancelNote(d){const C=[...(S.events||[]),...(S.cal?.ev||[])].filter(e=>S.evoff?.[d+"|"+e.id]);return C.length?`<p class="xs muted" style="margin:6px 0 0">Cancelled ${d===today?"today":"this day"}: ${C.map(e=>`${esc(e.title)} <button class="link xs" data-act="evundo" data-id="${esc(e.id)}" data-date="${d}">Undo</button>`).join(" · ")}</p>`:""}
function evLogLine(x){const r=x.r;return `<li>${esc(x.title)}: ${r.went?`${r.covered?esc(r.covered):"went"}${r.mood?` <span class="xs muted">(${esc((MOODS.find(m=>m[0]===r.mood)||[,""])[1])})</span>`:""}${r.hw?` · homework: ${esc(r.hw)}`:""}${r.note?` · ${esc(r.note)}`:""}`:`missed${r.note?" ("+esc(r.note)+")":""}`}</li>`}

/* ---------- entrance test: board + joining class, MCQ paper on the class before ---------- */
const TBOARDS=[["ncert","NCERT / CBSE"],["state","State board (NCERT pattern)"],["cambridge","Cambridge Primary"],["nios","NIOS"]];
const TB=b=>b==="state"?"ncert":b;
const tbName=b=>(TBOARDS.find(x=>x[0]===b)||[,BOARDN[b]||b])[1];
const ABCD="ABCD";
const tLevel=c=>Math.max(1,Math.min(5,(+c||2)-1));
const tSubs=(b,L)=>SUBJ_KEYS.filter(s=>DATA.items.some(u=>u.board===TB(b)&&u.subj===s&&u.level===L));
const tChaps=(b,s,L)=>DATA.items.filter(u=>u.board===TB(b)&&u.subj===s&&u.level===L);
const curTest=()=>(S.tests||[]).slice(-1)[0]||null;
const tDone=t=>t&&t.subjects.every(x=>t.done?.[x.s]);
function tSetup(){const T=S.tsetup||(S.tsetup={board:boardsOn().find(b=>["ncert","cambridge","nios"].includes(b))||"ncert",cls:"",n:15,off:[]});return T}
function shuffleQ(q){const idx=[0,1,2,3];for(let i=3;i>0;i--){const j=Math.floor(Math.random()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]]}return {...q,opts:idx.map(i=>q.opts[i]),a:idx.indexOf(q.a)}}
async function makeTest(){const T=tSetup(),L=tLevel(T.cls),subs=tSubs(T.board,L).filter(s=>!(T.off||[]).includes(s));if(!T.cls){toast("Pick the class they're joining");return}if(!subs.length){toast("No syllabus for that board and class yet");return}
  if(!SAMPLE){openSheet({mode:"plus",r:"test"});return}
  ui.tgen={i:0,n:subs.length,err:[]};render();const out=[];
  for(const s of subs){ui.tgen.i++;ui.tgen.s=s;render();const ch=tChaps(T.board,s,L),keys=new Set(ch.map(u=>u.k)),N=+T.n||15;
    const prompt=`Write an entrance test for a child joining Class ${T.cls} at a ${tbName(T.board)} school in India. The test covers the ${BOARDN[TB(T.board)]} ${lvN(TB(T.board),L)} syllabus for ${SUBJ[s]}, which has these chapters (key = title):
${ch.map(u=>`- ${u.k} = ${u.title}${u.book?" ("+u.book+")":""}`).join("\n")}
Write exactly ${N} multiple-choice questions for ${SUBJ[s]}.
- Spread them across the chapters. Mix about 40% recall, 40% understanding and 20% applying the idea to a new case, from easy to harder.
- Exactly 4 options each, exactly one correct. Wrong options must be believable mistakes a child makes. No "all of the above" or "none of the above".
- Simple words a ${L+5}-year-old in India reads easily; Indian names, places, food and ₹.
- ${s==="hin"?"Write everything in Hindi (Devanagari).":s==="eng"?"Test reading, vocabulary, grammar and spelling from these chapters. For reading questions put a short passage (40 to 80 words) in \"passage\" and repeat the same passage on each question about it.":s==="math"?"Work out every answer yourself before writing it, and check the numbers twice.":"Test real understanding of the ideas, not trivia."}
- "ch" is the key of the chapter the question comes from.
Check every answer again before replying.
Reply with only JSON: {"questions":[{"q":"...","opts":["...","...","...","..."],"a":0,"ch":"<chapter key>","skill":"recall|understand|apply","passage":""}]}`;
    try{const r=await SAMPLE.json(prompt,{modelTier:"complex",cache:false});const qs=(r?.questions||[]).filter(q=>q&&typeof q.q==="string"&&Array.isArray(q.opts)&&q.opts.length===4&&new Set(q.opts.map(String)).size===4&&Number.isInteger(+q.a)&&+q.a>=0&&+q.a<4).slice(0,N).map(q=>shuffleQ({q:String(q.q).slice(0,600),opts:q.opts.map(o=>String(o).slice(0,200)),a:+q.a,ch:keys.has(q.ch)?q.ch:"",skill:["recall","understand","apply"].includes(q.skill)?q.skill:"",passage:String(q.passage||"").slice(0,900)}));
      if(qs.length>=Math.min(5,N))out.push({s,qs});else ui.tgen.err.push(SUBJ[s])}catch(e){ui.tgen.err.push(SUBJ[s]+(e?.code==="rate_limited"?" (too many requests; try again in a minute)":""))}}
  const err=ui.tgen.err;ui.tgen=null;if(!out.length){toast("Couldn't make the paper. Try again.");render();return}
  S.tests=[...(S.tests||[]),{id:Math.random().toString(36).slice(2,9),board:T.board,cls:T.cls,level:L,at:Date.now(),date:today,subjects:out,ans:{},start:{},done:{}}].slice(-6);
  sfx("win");toast(err.length?`Paper ready. Couldn't make: ${err.join(", ")}`:"Paper ready");commit()}
function tScore(t){const R=t.subjects.map(x=>{const right=x.qs.filter((q,i)=>t.ans[x.s+"|"+i]===q.a).length,ans=x.qs.filter((q,i)=>t.ans[x.s+"|"+i]!==undefined).length,pct=Math.round(right/x.qs.length*100),mins=t.done?.[x.s]&&t.start?.[x.s]?Math.max(1,Math.round((t.done[x.s]-t.start[x.s])/6e4)):null;return {s:x.s,n:x.qs.length,right,ans,pct,grade:GRADE(pct),mins}}),n=R.reduce((a,x)=>a+x.n,0),right=R.reduce((a,x)=>a+x.right,0),pct=n?Math.round(right/n*100):0;return {R,n,right,pct,grade:GRADE(pct)}}
function testSection(){const T=tSetup(),L=tLevel(T.cls),subs=T.cls?tSubs(T.board,L):[],t=curTest(),G=ui.tgen;
  let h=`<section class="card exsec"><span class="eyebrow">Entrance test</span><h3 style="font-size:20px">A test paper for the new school</h3><p class="sm">Pick the school's board and the class ${esc(S.child||"your child")} is joining. DeepKids makes a multiple-choice paper on the syllabus of the class before, ${esc(S.child||"your child")} takes it here, and you get a score certificate, the paper, the answer key and the marked answer sheet.</p>
  <div class="fgrid"><div class="field"><label for="tsb">School's board</label><select class="inp" id="tsb" data-tsel="board">${TBOARDS.map(([k,n])=>`<option value="${k}" ${T.board===k?"selected":""}>${n}</option>`).join("")}</select></div>
  <div class="field"><label for="tsc">Joining class</label><select class="inp" id="tsc" data-tsel="cls"><option value="">Pick a class</option>${[2,3,4,5,6].map(c=>`<option value="${c}" ${+T.cls===c?"selected":""}>Class ${c}</option>`).join("")}</select></div>
  <div class="field"><label for="tsn">Questions per subject</label><select class="inp" id="tsn" data-tsel="n">${[10,15,20].map(n=>`<option value="${n}" ${+T.n===n?"selected":""}>${n}</option>`).join("")}</select></div></div>`;
  if(T.cls){h+=subs.length?`<p class="xs muted">Tests the ${esc(BOARDN[TB(T.board)])} ${esc(lvN(TB(T.board),L))} syllabus. Subjects:</p><div class="row">${subs.map(s=>`<button class="chip ${SC(s)}" aria-pressed="${!(T.off||[]).includes(s)}" data-act="tsub" data-s="${s}">${esc(SUBJ[s])} · ${tChaps(T.board,s,L).length} ch</button>`).join("")}</div>`:`<p class="sm" style="color:var(--bad)">${TB(T.board)==="nios"?"NIOS has Level A (≈ Class 3) and Level B (≈ Class 5), so pick joining Class 4 or Class 6.":"We don't have that syllabus yet."}</p>`}
  h+=`<div class="row" style="gap:10px;flex-wrap:wrap"><button class="btn accent sm" data-act="tmake" ${G||!subs.length?"disabled":""}>${G?`Writing ${esc(SUBJ[G.s]||"")} (${G.i} of ${G.n})…`:t?"Make a new paper":"Make the question paper"}</button></div>${G?`<p class="xs muted">This takes about a minute a subject. Keep this open.</p>`:""}`;
  if(t){const sc=tScore(t),fin=tDone(t);h+=`<div class="pk"><span class="eyebrow">${esc(tbName(t.board))} · joining Class ${t.cls} · made ${esc(fmt(t.date))}</span><b>${t.subjects.map(x=>`${SUBJ[x.s]} ${x.qs.length}`).join(" · ")} questions</b>
    ${fin?`<p class="sm"><b>Score: ${sc.right} / ${sc.n} (${sc.pct}%) · Grade ${sc.grade}</b></p><table class="rtab"><tr><th>Subject</th><th>Marks</th><th>%</th><th>Grade</th><th>Time</th></tr>${sc.R.map(r=>`<tr><td>${esc(SUBJ[r.s])}</td><td>${r.right} / ${r.n}</td><td>${r.pct}%</td><td>${r.grade}</td><td>${r.mins?r.mins+" min":"—"}</td></tr>`).join("")}</table>`
      :`<p class="sm">${t.subjects.filter(x=>t.done?.[x.s]).length} of ${t.subjects.length} subjects done. ${esc(S.child||"Your child")} can do one subject at a time.</p>`}
    <div class="row" style="gap:10px;flex-wrap:wrap">${fin?"":`<button class="btn green sm" data-act="tstart">${Object.keys(t.ans).length?"Carry on the test":"Start the test"}</button>`}<button class="btn soft sm" data-act="tdl" data-d="paper">Question paper</button>${fin?`<button class="btn soft sm" data-act="tdl" data-d="cert">Score certificate</button><button class="btn soft sm" data-act="tdl" data-d="key">Answer key and marking</button><button class="btn soft sm" data-act="tdl" data-d="sheet">Marked answer sheet</button>`:""}</div>
    ${fin?"":`<p class="xs muted">Hand the phone to ${esc(S.child||"your child")}. Answers stay hidden until every subject is finished.</p>`}</div>`}
  return h+`</section>`}
function examView(){const t=curTest();document.getElementById("sheetTitle").textContent="Entrance test";if(!t)return `<p class="note">No paper yet.</p>`;const E=ui.ex||(ui.ex={si:t.subjects.findIndex(x=>!t.done?.[x.s]),qi:-1});
  if(E.si<0||tDone(t))return `<div class="exdone">${blob("var(--sun)",7,"wow","",'width="90" height="90"')}<h2>All done!</h2><p>Well done, ${esc(S.child||"")}. Give the phone back to your grown-up.</p><button class="btn accent" data-act="texit">Close</button></div>`;
  const X=t.subjects[E.si],s=X.s,n=X.qs.length;
  if(E.qi<0)return `<div class="exdone">${sblob(s,"happy","mascot")}<span class="eyebrow">${esc(SUBJ[s])} · part ${E.si+1} of ${t.subjects.length}</span><h2>${n} questions</h2><ul class="sm" style="text-align:left"><li>Read each question. Tap the answer you think is right.</li><li>Not sure? Pick your best guess, or skip and come back.</li><li>Take your time. There's no timer.</li></ul><button class="btn green" data-act="tgo">Start ${esc(SUBJ[s])}</button></div>`;
  const q=X.qs[E.qi],v=t.ans[s+"|"+E.qi],un=X.qs.filter((_,i)=>t.ans[s+"|"+i]===undefined).length,last=E.qi===n-1,prevP=E.qi>0?X.qs[E.qi-1].passage:"";
  return `<div class="exq ${SC(s)}"><div class="row" style="justify-content:space-between"><span class="eyebrow">${esc(SUBJ[s])} · Question ${E.qi+1} of ${n}</span><span class="xs muted">${n-un} answered</span></div>
    <div class="exdots">${X.qs.map((_,i)=>`<button class="${i===E.qi?"on":""} ${t.ans[s+"|"+i]!==undefined?"ans":""}" data-act="tjump" data-i="${i}" aria-label="Question ${i+1}"></button>`).join("")}</div>
    ${q.passage?`<div class="ask exp"><span class="eyebrow">${q.passage===prevP?"Same passage":"Read this"}</span>${esc(q.passage)}</div>`:""}
    <p class="exqt">${esc(q.q)}</p><div class="col" style="gap:10px">${q.opts.map((o,i)=>`<button class="exopt" aria-pressed="${v===i}" data-act="tans" data-i="${i}"><b>${ABCD[i]}</b><span>${esc(o)}</span></button>`).join("")}</div>
    <div class="row" style="justify-content:space-between;margin-top:14px"><button class="btn line sm" data-act="tmove" data-d="-1" ${E.qi?"":"disabled"}>Back</button>${last?`<button class="btn green sm" data-act="tfin">${un?`Finish ${esc(SUBJ[s])} (${un} not answered)`:`Finish ${esc(SUBJ[s])}`}</button>`:`<button class="btn sm" data-act="tmove" data-d="1">${v===undefined?"Skip":"Next"}</button>`}</div></div>`}
/* ---------- documents for the school ---------- */
const DOCCSS=`body{font:14px/1.5 system-ui,sans-serif;color:#222;max-width:820px;margin:24px auto;padding:0 16px}h1{font-size:22px;margin:0}h2{font-size:17px;margin:24px 0 6px;border-bottom:2px solid #333;padding-bottom:3px}table{border-collapse:collapse;width:100%;margin:6px 0}th,td{border:1px solid #bbb;padding:5px 8px;text-align:left;vertical-align:top}th{background:#f2f2f2}.muted{color:#666}.sm{font-size:12px}ol{padding-left:22px}li{margin:10px 0;break-inside:avoid}.op{display:block;margin:2px 0 2px 6px}.ok{color:#1e7a3c;font-weight:700}.no{color:#b03a2e;font-weight:700}.pass{border-left:3px solid #999;padding:4px 10px;margin:6px 0;background:#f7f7f7}.sig{display:flex;gap:40px;margin-top:40px}.sig div{flex:1;border-top:1px solid #333;padding-top:4px;font-size:12px}.cert{border:6px double #555;padding:28px;text-align:center}.cert h1{font-size:26px}.big{font-size:34px;font-weight:800;margin:6px 0}.tw{overflow-x:auto}@media(max-width:520px){.cert{padding:14px}.big{font-size:26px}th,td{padding:4px 5px;font-size:12.5px}}@media print{body{margin:0}h2{break-after:avoid}}`;
const docWrap=(title,body)=>`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>${DOCCSS}</style></head><body>${body}</body></html>`;
const tHead=t=>`<p class="muted">${esc(tbName(t.board))} pattern · for admission to Class ${t.cls} · covers the ${esc(lvN(TB(t.board),t.level))} syllabus</p>`;
const tDate=t=>new Date(t.at).toLocaleDateString(undefined,{day:"numeric",month:"long",year:"numeric"});
function qList(t,x,mode){let lastP="";return `<ol>${x.qs.map((q,i)=>{const v=t.ans[x.s+"|"+i],p=q.passage&&q.passage!==lastP?`<div class="pass">${esc(q.passage)}</div>`:"";lastP=q.passage||lastP;const ch=q.ch&&unitByK(q.ch);
  return `<li>${p}<b>${esc(q.q)}</b>${q.opts.map((o,j)=>`<span class="op">${mode!=="paper"&&j===q.a?"<span class='ok'>✓</span> ":mode==="sheet"&&j===v?"<span class='no'>✗</span> ":""}(${ABCD[j]}) ${esc(o)}</span>`).join("")}${mode==="key"?`<span class="sm muted">Answer: ${ABCD[q.a]} · 1 mark${ch?" · "+esc(chT(ch)):""}${q.skill?" · "+esc(q.skill):""}</span>`:mode==="sheet"?`<span class="sm">${v===undefined?"<span class='no'>Not answered</span> · 0 marks":v===q.a?`<span class='ok'>Chose ${ABCD[v]} · correct</span> · 1 mark`:`<span class='no'>Chose ${ABCD[v]}</span> · correct ${ABCD[q.a]} · 0 marks`}</span>`:""}</li>`}).join("")}</ol>`}
function paperDoc(t){const n=t.subjects.reduce((a,x)=>a+x.qs.length,0);return docWrap("Question paper",`<h1>Entrance test · question paper</h1>${tHead(t)}<p>Name: ______________________ &nbsp; Date: ____________</p><p class="sm"><b>Instructions:</b> ${n} multiple-choice questions, 1 mark each, no negative marking. Choose one answer for each question.</p>${t.subjects.map(x=>`<h2>${esc(SUBJ[x.s])} · ${x.qs.length} marks</h2>${qList(t,x,"paper")}`).join("")}`)}
function keyDoc(t){return docWrap("Answer key",`<h1>Entrance test · answer key and marking</h1>${tHead(t)}<h2>Marking scheme</h2><p class="sm">Each question carries 1 mark. No negative marking; unanswered questions get 0. Subject and overall percentages are marks ÷ questions × 100. Grades use the CBSE 8-point scale: A1 91–100, A2 81–90, B1 71–80, B2 61–70, C1 51–60, C2 41–50, D 33–40, E below 33.</p>${t.subjects.map(x=>`<h2>${esc(SUBJ[x.s])}</h2>${qList(t,x,"key")}`).join("")}`)}
function sheetDoc(t){const sc=tScore(t);return docWrap("Marked answer sheet",`<h1>Entrance test · marked answer sheet</h1>${tHead(t)}<p><b>${esc(S.child||"Student")}</b> · taken ${esc(tDate(t))} · ${sc.right} / ${sc.n} (${sc.pct}%) · Grade ${sc.grade}</p>${scoreTable(sc)}${t.subjects.map(x=>{const r=sc.R.find(z=>z.s===x.s);return `<h2>${esc(SUBJ[x.s])} · ${r.right} / ${r.n}</h2>${qList(t,x,"sheet")}`}).join("")}`)}
const scoreTable=sc=>`<div class="tw"><table><tr><th>Subject</th><th>Questions</th><th>Answered</th><th>Marks</th><th>Percentage</th><th>Grade</th><th>Time taken</th></tr>${sc.R.map(r=>`<tr><td>${esc(SUBJ[r.s])}</td><td>${r.n}</td><td>${r.ans}</td><td>${r.right}</td><td>${r.pct}%</td><td>${r.grade}</td><td>${r.mins?r.mins+" min":"—"}</td></tr>`).join("")}<tr><th>Total</th><th>${sc.n}</th><th>${sc.R.reduce((a,r)=>a+r.ans,0)}</th><th>${sc.right}</th><th>${sc.pct}%</th><th>${sc.grade}</th><th></th></tr></table></div>`;
function certDoc(t){const sc=tScore(t),I=S.school||{};return docWrap("Score certificate",`<div class="cert"><p class="muted">Home assessment</p><h1>Score certificate</h1><p>This is to record that</p><p class="big">${esc(S.child||"Student")}</p>${I.dob?`<p class="muted">born ${esc(parse(I.dob).toLocaleDateString(undefined,{day:"numeric",month:"long",year:"numeric"}))}</p>`:""}<p>took an entrance test on the <b>${esc(BOARDN[TB(t.board)])} ${esc(lvN(TB(t.board),t.level))}</b> syllabus${I.to?`, for admission to Class ${t.cls} at ${esc(I.to)}`:`, for admission to Class ${t.cls}`}, on ${esc(tDate(t))}, and scored</p><p class="big">${sc.right} / ${sc.n} · ${sc.pct}% · Grade ${sc.grade}</p><table><tr><th>Subject</th><th>Marks</th><th>%</th><th>Grade</th></tr>${sc.R.map(r=>`<tr><td>${esc(SUBJ[r.s])}</td><td>${r.right} / ${r.n}</td><td>${r.pct}%</td><td>${r.grade}</td></tr>`).join("")}</table><p class="sm muted">Taken at home on DeepKids under parent supervision. ${sc.n} multiple-choice questions, 1 mark each, no negative marking. This is a home assessment, not a board examination.</p><div class="sig"><div>Parent / guardian${S.parent?.name?": "+esc(S.parent.name):""}</div><div>Date</div></div></div>`)}
function testTranscript(){const t=curTest();if(!t||!tDone(t))return "";const sc=tScore(t);return `<h2>Entrance test</h2><p class="sm">${esc(tbName(t.board))} pattern, for Class ${t.cls}, on the ${esc(lvN(TB(t.board),t.level))} syllabus. Taken ${esc(tDate(t))}. Total ${sc.right} / ${sc.n} (${sc.pct}%), grade ${sc.grade}.</p><table><tr><th>Subject</th><th>Marks</th><th>%</th><th>Grade</th></tr>${sc.R.map(r=>`<tr><td>${esc(SUBJ[r.s])}</td><td>${r.right} / ${r.n}</td><td>${r.pct}%</td><td>${r.grade}</td></tr>`).join("")}</table>`}
/* ---------- a zip folder for the school, shared any way they like ---------- */
const CRCT=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc32=u=>{let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=CRCT[(c^u[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0};
async function makeZip(files){const enc=new TextEncoder(),parts=[],cen=[],d=new Date(),dt=((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate(),tm=(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1);let off=0;
  for(const f of files){const data=typeof f.data==="string"?enc.encode(f.data):f.data instanceof Blob?new Uint8Array(await f.data.arrayBuffer()):f.data,nm=enc.encode(f.name),crc=crc32(data),L=new DataView(new ArrayBuffer(30)),C=new DataView(new ArrayBuffer(46));
    [[0,0x04034b50,4],[4,20,2],[6,0x0800,2],[8,0,2],[10,tm,2],[12,dt,2],[14,crc,4],[18,data.length,4],[22,data.length,4],[26,nm.length,2],[28,0,2]].forEach(([o,v,w])=>w===4?L.setUint32(o,v,true):L.setUint16(o,v,true));
    [[0,0x02014b50,4],[4,20,2],[6,20,2],[8,0x0800,2],[10,0,2],[12,tm,2],[14,dt,2],[16,crc,4],[20,data.length,4],[24,data.length,4],[28,nm.length,2],[30,0,2],[32,0,2],[34,0,2],[36,0,2],[38,0,4],[42,off,4]].forEach(([o,v,w])=>w===4?C.setUint32(o,v,true):C.setUint16(o,v,true));
    parts.push(new Uint8Array(L.buffer),nm,data);cen.push(new Uint8Array(C.buffer),nm);off+=30+nm.length+data.length}
  const cs=cen.reduce((a,u)=>a+u.length,0),E=new DataView(new ArrayBuffer(22));E.setUint32(0,0x06054b50,true);E.setUint16(8,files.length,true);E.setUint16(10,files.length,true);E.setUint32(12,cs,true);E.setUint32(16,off,true);
  return new Blob([...parts,...cen,new Uint8Array(E.buffer)],{type:"application/zip"})}
const fsafe=s=>String(s||"").replace(/[\\/:*?"<>|#%]+/g,"").replace(/\s+/g," ").trim().slice(0,60)||"file";
function zipSel(){if(ui.zs)return ui.zs;const t=curTest(),F=folderData();ui.zs={docs:new Set(["transcript","work",...(t?["paper"]:[]),...(tDone(t)?["cert","key","sheet"]:[])]),ws:new Set(F.flatMap(c=>c.ws.filter(w=>w.fin).map(w=>w.k))),up:new Set((S.work||[]).filter(w=>w.k).map(w=>w.id))};return ui.zs}
function bundleSection(){const Z=zipSel(),t=curTest(),fin=tDone(t),F=folderData(),W=F.flatMap(c=>c.ws.map(w=>({...w,u:c.u}))),U=S.work||[],P=ui.zip;
  const ck=(grp,id,label,sub,dis)=>`<label class="zrow ${dis?"off":""}"><input type="checkbox" data-zip="${grp}" value="${esc(id)}" ${Z[grp].has(id)&&!dis?"checked":""} ${dis?"disabled":""}><span><b class="sm">${label}</b>${sub?`<br><span class="xs muted">${sub}</span>`:""}</span></label>`;
  let h=`<section class="card"><span class="eyebrow">For the school</span><h3 style="font-size:20px">Make one folder to send</h3><p class="sm">Tick what to include. DeepKids puts it all in one .zip folder you can save, then send by WhatsApp, email or anything else.</p>
  <div class="col" style="gap:6px">${ck("docs","transcript","Transcript","Coverage by board and level, chapters, scores, attendance")}${ck("docs","cert","Score certificate",fin?"":"After the test is finished",!fin)}${ck("docs","paper","Question paper",t?"":"Make a paper first",!t)}${ck("docs","key","Answer key and marking",fin?"":"After the test is finished",!fin)}${ck("docs","sheet","Marked answer sheet",fin?"":"After the test is finished",!fin)}${ck("docs","work","Projects and experiments list","With start and finish dates")}</div>`;
  if(W.length)h+=`<details style="margin-top:8px"><summary class="link sm" style="cursor:pointer">Worksheets with answers · ${Z.ws.size} of ${W.length} ticked</summary><div class="col" style="gap:6px;margin-top:6px"><div class="row"><button class="link xs" data-act="zall" data-g="ws" data-v="1">Tick all</button><button class="link xs" data-act="zall" data-g="ws" data-v="0">Untick all</button></div>${W.map(w=>ck("ws",w.k,esc(w.title),`${esc(chT(w.u))} · ${w.fin?"finished "+esc(fmt(w.fin)):w.ans+" of "+w.tot+" answered"}`)).join("")}</div></details>`;
  if(U.length)h+=`<details style="margin-top:8px"><summary class="link sm" style="cursor:pointer">Photos and files · ${[...Z.up].filter(id=>U.some(w=>w.id===id)).length} of ${U.length} ticked</summary><div class="col" style="gap:6px;margin-top:6px"><div class="row"><button class="link xs" data-act="zall" data-g="up" data-v="1">Tick all</button><button class="link xs" data-act="zall" data-g="up" data-v="0">Untick all</button></div>${U.map(w=>ck("up",w.id,esc(w.title||w.name||"Upload"),`${esc(fmt(w.date))}${w.k&&unitByK(w.k)?" · "+esc(chT(unitByK(w.k))):""}`)).join("")}</div></details>`;
  h+=`<div class="row" style="gap:10px;flex-wrap:wrap;margin-top:10px"><button class="btn accent sm" data-act="zmake" ${P?.busy?"disabled":""}>${P?.busy?esc(P.busy):"Make the folder"}</button></div>`;
  if(P?.blob){const sh=!!(navigator.canShare&&navigator.canShare({files:[new File([P.blob],P.name,{type:"application/zip"})]}));h+=`<div class="pk"><b>${esc(P.name)}</b><p class="xs muted">${P.count} files · ${(P.blob.size/1048576).toFixed(1)} MB${P.miss?` · ${P.miss} photo${P.miss>1?"s":""} couldn't be added`:""}</p><div class="row" style="gap:10px;flex-wrap:wrap"><button class="btn green sm" data-act="zsave">Save the folder</button>${sh?`<button class="btn soft sm" data-act="zshare">Share…</button>`:""}<a class="btn soft sm" href="https://wa.me/?text=${encodeURIComponent(zipMsg())}" target="_blank" rel="noopener">WhatsApp</a><a class="btn soft sm" href="mailto:?subject=${encodeURIComponent((S.child||"Student")+" – home education records")}&body=${encodeURIComponent(zipMsg()+"\n\n(The folder is attached.)")}" target="_blank" rel="noopener">Email</a></div><p class="xs muted">${sh?"Share… sends the folder straight to WhatsApp, email or any app. ":""}For WhatsApp or email: save the folder first, then attach it from your Downloads.</p></div>`}
  return h+`</section>`}
const zipMsg=()=>{const t=curTest(),sc=tDone(t)&&tScore(t);return `Dear Sir/Madam,\nPlease find attached ${S.child||"my child"}'s home education records for admission${t?` to Class ${t.cls}`:S.school?.cls?` to ${S.school.cls}`:""}: transcript${sc?`, entrance test certificate (${sc.pct}%, grade ${sc.grade}), question paper, answer key and marked answer sheet`:""}, and samples of work.\nRegards,\n${S.parent?.name||""}`};
async function zipBuild(){const Z=zipSel(),t=curTest(),fin=tDone(t),kid=fsafe(S.child||"Student"),files=[];ui.zip={busy:"Making the folder…"};render();
  const D=Z.docs;if(D.has("transcript"))files.push({name:"01 Transcript.html",data:transcriptDoc()});if(fin&&D.has("cert"))files.push({name:"02 Score certificate.html",data:certDoc(t)});if(t&&D.has("paper"))files.push({name:"03 Question paper.html",data:paperDoc(t)});if(fin&&D.has("key"))files.push({name:"04 Answer key and marking.html",data:keyDoc(t)});if(fin&&D.has("sheet"))files.push({name:"05 Marked answer sheet.html",data:sheetDoc(t)});
  if(Z.ws.size){const F=folderData().map(c=>({...c,ws:c.ws.filter(w=>Z.ws.has(w.k)),qz:c.qz,pj:D.has("work")?c.pj:[]})).filter(c=>c.ws.length||c.qz.length||c.pj.length);if(F.length)files.push({name:"06 Worksheets and answers.html",data:folderDoc(F)})}
  else if(D.has("work")){const F=folderData().map(c=>({...c,ws:[],qz:[]})).filter(c=>c.pj.length);if(F.length)files.push({name:"06 Projects and experiments.html",data:folderDoc(F)})}
  const ups=(S.work||[]).filter(w=>Z.up.has(w.id));let miss=0,i=0;
  for(const w of ups){i++;ui.zip.busy=`Adding photos (${i} of ${ups.length})…`;render();try{const r=await fetch("/_blob/"+encodeURIComponent(w.id));if(!r.ok)throw 0;const bl=await r.blob(),ext=(w.name&&/\.\w{2,5}$/.test(w.name)?w.name.split(".").pop():(bl.type.split("/")[1]||"bin")).replace("jpeg","jpg");const u=w.k&&unitByK(w.k);files.push({name:`Work samples/${w.date||""} ${u?fsafe(SUBJ[u.subj]+" "+chT(u))+" - ":""}${fsafe(w.title||w.name)}.${ext}`,data:bl})}catch(e){miss++}}
  const names=new Set();files.forEach(f=>{let n=f.name,k=2;while(names.has(n))n=f.name.replace(/(\.\w+)$/,` (${k++})$1`);names.add(n);f.name=n});
  try{const blob=await makeZip(files);ui.zip={blob,name:`${kid} school folder ${today}.zip`,count:files.length,miss};sfx("win")}catch(e){ui.zip=null;toast("Couldn't make the folder")}render()}
async function zipSave(){const P=ui.zip;if(!P?.blob)return;try{const dl=await window.claude?.use?.("downloads");if(dl){await dl.save({filename:P.name,data:P.blob});toast("Saved");return}}catch(e){if(e?.code==="declined")return}
  try{const a=document.createElement("a");a.href=URL.createObjectURL(P.blob);a.download=P.name;document.body.appendChild(a);a.click();a.remove();toast("Saved")}catch(e){toast("Couldn't save here")}}
async function zipShare(){const P=ui.zip;if(!P?.blob)return;try{await navigator.share({files:[new File([P.blob],P.name,{type:"application/zip"})],title:P.name,text:zipMsg()})}catch(e){if(e?.name!=="AbortError")toast("Sharing isn't available here. Save the folder, then send it.")}}
function tdlDoc(d){const t=curTest();if(!t)return;const kid=fsafe(S.child||"Student"),M={paper:[paperDoc,"question paper"],key:[keyDoc,"answer key"],sheet:[sheetDoc,"marked answer sheet"],cert:[certDoc,"score certificate"]}[d];if(M)saveDoc(M[0](t),`${kid} ${M[1]} ${t.date}.html`)}

/* ---------- planner: understand routines properly, and show everything the parent told us ---------- */
const DAYS3=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const dayList=a=>{const o=[1,2,3,4,5,6,0].filter(x=>(a||[]).includes(x)),j=o.join();return j==="1,2,3,4,5,6,0"?"Every day":j==="1,2,3,4,5"?"Mon–Fri":j==="1,2,3,4,5,6"?"Mon–Sat":j==="6,0"?"Weekends":o.map(x=>DAYS3[x]).join(", ")};
const EVK={class:"Class",online:"Online class",outing:"Outing",rest:"Rest",meal:"Meal",other:""};
function evSub(e){const who=e.who==="kid"?(e.kind==="rest"?`${S.child||"Child"} rests`:`${S.child||"Child"} goes`)+" · you're free":e.who==="both"?"Together":"";return [EVK[e.kind]??"",e.rep==="weekly"?dayList(e.days):"",who].filter(Boolean).join(" · ")}
function evLine(e){return `${e.rep==="weekly"?dayList(e.days):e.date?fmt(e.date):""}${e.start?` · ${clock(hm(e.start))}${e.end?"–"+clock(hm(e.end)):""}`:" · time not set"}`}
function routinesText(){return (S.events||[]).map(e=>`- id ${e.id}: "${e.title}" (${e.kind}, ${e.who}) ${e.rep==="weekly"?"every "+dayList(e.days):"on "+e.date} ${e.start||"?"}–${e.end||"?"}`).join("\n")||"(none yet)"}
/* old bad sorts saved repeating things as to-dos: turn them into timed routines */
function fixRoutines(){if(S.fixR1||!S.todos?.length)return;S.fixR1=1;const E=[...(S.events||[])],rep=/every ?day|daily|weekdays?|every (mon|tue|wed|thu|fri|sat|sun)/i;
  S.todos=S.todos.filter(td=>{const txt=td.title+" "+(td.note||"");if(!rep.test(txt))return true;
    if(E.some(e=>e.title.toLowerCase()===td.title.toLowerCase()))return false;
    const m=/after (?:returning from |coming from |coming back from )?(.+?)(?:,|$| every| daily)/i.exec(txt),ref=m&&E.find(e=>txt.toLowerCase().includes(e.title.toLowerCase())||e.title.toLowerCase().includes(m[1].trim().toLowerCase())),hrs=+(/(\d+(?:\.\d+)?) ?(?:hour|hr)/i.exec(txt)||[])[1]||1;
    if(ref&&ref.end){if(E.some(e=>e.start===ref.end&&(e.days||[]).join()===(ref.days||[]).join()&&e.kind!=="class"))return false;E.push({id:Math.random().toString(36).slice(2,9),title:td.title.replace(/ for \d+ hours?/i,""),kind:/rest|nap|sleep/i.test(txt)?"rest":"other",who:td.who||"kid",start:ref.end,end:clock24(hm(ref.end)+hrs*60),rep:ref.rep,date:ref.date,days:[...(ref.days||[])],from:today,note:""});return false}return true});S.events=E}
function toldView(){document.getElementById("sheetTitle").textContent="What you've told us";const E=(S.events||[]).slice().sort((a,b)=>(a.rep==="weekly"?0:1)-(b.rep==="weekly"?0:1)||hm(a.start)-hm(b.start)),T=(S.todos||[]).filter(t=>!t.done),N=S.notes||[],L=(S.said||[]).slice().reverse(),ed=ui.ted;
  const evRow=e=>ed===e.id?`<div class="pk"><input class="inp" data-evf="title" data-id="${e.id}" value="${esc(e.title)}" aria-label="Name"><div class="dpick">${[1,2,3,4,5,6,0].map(d=>`<button aria-pressed="${(e.rep==="weekly"?e.days:[]).includes(d)}" data-act="evday" data-id="${e.id}" data-d="${d}">${DAYS3[d]}</button>`).join("")}</div><div class="row"><label class="xs">From <input class="inp" type="time" data-evf="start" data-id="${e.id}" value="${e.start||""}" style="width:auto"></label><label class="xs">to <input class="inp" type="time" data-evf="end" data-id="${e.id}" value="${e.end||""}" style="width:auto"></label></div><div class="whos">${[["you","Mine"],["kid",S.child?esc(S.child)+"'s":"Child's"],["both","Together"]].map(([k,n])=>`<button type="button" aria-pressed="${e.who===k}" data-act="evwho" data-id="${e.id}" data-w="${k}">${n}</button>`).join("")}</div><div class="row"><button class="btn sm" data-act="ted" data-id="">Done</button><button class="link sm" data-act="evdel" data-id="${e.id}" style="color:var(--bad)">Remove</button></div></div>`
    :`<div class="pk ${e.start?"":"warn"}"><span class="eyebrow">${esc(EVK[e.kind]||"Plan")}${e.src==="gcal"?" · Google Calendar":""}</span><b>${esc(e.title)}</b><p class="sm">${esc(evLine(e))}${e.who==="kid"?` · ${esc(S.child||"child")} alone`:e.who==="both"?" · together":""}</p>${e.start?"":`<p class="xs" style="color:var(--bad)">Add a time so the day plan can work around it.</p>`}${e.src==="gcal"?"":`<div class="row"><button class="link sm" data-act="ted" data-id="${e.id}">Change</button></div>`}</div>`;
  let h=`<p class="sm muted">Everything you've added: by typing, chatting, photos or by hand. Change or remove anything here, and the plan follows.</p>`;
  h+=`<section class="sec"><div class="sech"><h3 style="font-size:18px">Routines, classes and rest</h3><span class="pill">${E.length}</span></div>${E.length?E.map(evRow).join(""):`<p class="xs muted">Nothing yet.</p>`}<button class="btn soft sm" data-act="toplan" style="justify-self:start">+ Add or change by telling DeepKids</button></section>`;
  h+=`<section class="sec"><div class="sech"><h3 style="font-size:18px">To-dos</h3><span class="pill">${T.length}</span></div>${T.length?T.map(t=>`<div class="pk"><b>${esc(t.title)}</b><p class="xs muted">${esc(fmt(t.date))}${t.note?" · "+esc(t.note):""}</p><div class="row"><button class="link sm" data-act="tddel" data-id="${t.id}" style="color:var(--bad)">Remove</button></div></div>`).join(""):`<p class="xs muted">No open to-dos.</p>`}</section>`;
  h+=`<section class="sec"><div class="sech"><h3 style="font-size:18px">Notes we keep in mind</h3><span class="pill">${N.length}</span></div>${N.length?N.map(n=>`<div class="pk"><p class="sm">${esc(n.text)}</p><p class="xs muted">${esc(fmt(n.date))}</p><div class="row"><button class="link sm" data-act="notedel" data-id="${n.id}" style="color:var(--bad)">Remove</button></div></div>`).join(""):`<p class="xs muted">No notes.</p>`}</section>`;
  h+=`<section class="sec"><div class="sech"><h3 style="font-size:18px">What you said</h3><span class="pill">${L.length}</span></div>${L.length?L.map(x=>`<details class="card"><summary><b class="sm">${esc(fmt(x.date))} · ${esc(new Date(x.at).toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"}))}</b><br><span class="sm">${esc(x.text.split("\n")[0].slice(0,120))}</span></summary><div class="chat" style="margin-top:8px"><div class="bub me">${esc(x.text).replace(/\n/g,"<br>")}</div>${(x.chat||[]).map(c=>`<div class="bub cl">${esc(c.q)}</div><div class="bub me">${esc(c.a)}</div>`).join("")}</div>${x.added?.length?`<p class="xs muted">Added to the plan:</p><ul class="sm">${x.added.map(a=>`<li>${esc(a)}</li>`).join("")}</ul>`:""}</details>`).join(""):`<p class="xs muted">Messages you send in the Planner are kept here from now on.</p>`}</section>`;
  return h}
/* safety net: whatever Claude returns, anything with a time or a repeat lands on the calendar */
function whenOf(txt){const t=" "+String(txt||"").toLowerCase()+" ",T=[];t.replace(/(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?/g,(m,h,mm,ap,off)=>{if(+h>23)return m;const prev=t.slice(Math.max(0,off-8),off),next=t.slice(off+m.length,off+m.length+8);if(!ap&&!mm&&!/(at|from|to|till|until|-|–)\s*$/.test(prev)&&!/^\s*(to|-|–|till)\s*\d/.test(next))return m;let H=+h;if(ap){const p=ap[0]==="p";if(p&&H<12)H+=12;if(!p&&H===12)H=0}T.push([H,+(mm||0),!!ap]);return m});
  if(T.length===2&&!T[0][2]&&T[1][2]&&T[1][0]>=12&&T[0][0]<12&&T[0][0]+12<=T[1][0])T[0][0]+=12;
  const f=x=>String(x[0]).padStart(2,"0")+":"+String(x[1]).padStart(2,"0"),W={one:1,an:1,a:1,two:2,three:3,half:.5},hx=/(\d+(?:\.\d+)?|one|two|three|an|a|half)\s*(?:hours?|hrs?)/.exec(t),dur=/half an hour/.test(t)?30:hx?(W[hx[1]]??+hx[1])*60:+(/(\d+)\s*min/.exec(t)||[])[1]||0;
  let days=null;if(/every ?day|daily|each day/.test(t))days=[0,1,2,3,4,5,6];else if(/week ?days|mon(day)?\s*(-|–|to)\s*fri/.test(t))days=[1,2,3,4,5];else if(/weekends?/.test(t))days=[0,6];else{const D=[["sun",0],["mon",1],["tue",2],["wed",3],["thu",4],["fri",5],["sat",6]].filter(([k])=>new RegExp("\\b"+k+"[a-z]*").test(t)).map(x=>x[1]);if(D.length&&(/every|on |\b(mon|tue|wed|thu|fri|sat|sun)[a-z]*s\b/.test(t)||D.length>1))days=D}
  return {start:T[0]?f(T[0]):null,end:T[1]?f(T[1]):null,days,dur}}
const RESTW=/\b(nap|naps|napping|sleep|sleeps|sleeping|rest|rests|resting)\b/i;
function fixItem(x){if(["have","update"].includes(x.type))return x;const txt=[x.title,x.note].join(" "),w=whenOf(txt);if(x.date&&!/every|daily/i.test(txt))w.days=null;
  if(RESTW.test(txt)&&["todo","note","chore","reminder"].includes(x.type))x.type="rest";
  if(!x.days?.length&&w.days)x.days=w.days;if(!x.start&&w.start){x.start=w.start;if(!x.end&&w.end)x.end=w.end}
  if(!x.start){const m=/after\s+(?:returning from |coming (?:back )?from |coming home from )?(?:the |her |his )?(.+?)(?:[,.;]|$| every| daily| on )/i.exec(txt),E=S.events||[],ref=m&&(E.find(e=>m[1].toLowerCase().includes(e.title.toLowerCase()))||E.find(e=>e.title.toLowerCase().includes(m[1].trim().toLowerCase().split(" ")[0])));if(ref?.end){x.start=ref.end;if(ref.rep==="weekly")x.days=[...ref.days];else if(ref.date)x.date=ref.date}}
  if(x.start&&!x.end&&w.dur)x.end=clock24(hm(x.start)+w.dur);
  if((x.type==="todo"&&x.days?.length&&x.start)||(x.type==="note"&&x.start))x.type=RESTW.test(txt)?"rest":"other";
  return x}

/* ---------- live Google Calendar (the viewer's claude.ai connector) ---------- */
const GC="Google Calendar";let MCP=null,MCPT=false;
async function mcpH(){if(!MCPT){MCPT=true;try{MCP=await window.claude?.use?.("mcp")||null}catch(e){MCP=null}}return MCP}
function findArr(x,d=0){if(x==null||d>5)return null;if(typeof x==="string"){try{return findArr(JSON.parse(x),d+1)}catch(e){return null}}
  if(Array.isArray(x)){if(x.some(o=>o&&typeof o==="object"&&(o.start||o.summary||o.start_time||o.startTime)))return x;for(const y of x){const r=findArr(y,d+1);if(r)return r}return null}
  if(typeof x==="object"){for(const k of ["events","items","data","results","result"])if(x[k]!=null){const r=findArr(x[k],d+1);if(r)return r}for(const v of Object.values(x)){const r=findArr(v,d+1);if(r)return r}}return null}
function calArr(x,d=0){if(x==null||d>5)return [];if(typeof x==="string"){try{return calArr(JSON.parse(x),d+1)}catch(e){return []}}if(Array.isArray(x))return x.filter(o=>o&&typeof o==="object"&&o.id&&(o.summary||o.name||o.title));if(typeof x==="object"){for(const v of Object.values(x)){const r=calArr(v,d+1);if(r.length)return r}}return []}
const tOf=v=>typeof v==="string"?v:v?.dateTime||v?.date_time||v?.date||null;
function gcMap(o){const s=tOf(o.start||o.start_time||o.startTime),e=tOf(o.end||o.end_time||o.endTime);if(!s||o.status==="cancelled")return null;const allDay=/^\d{4}-\d{2}-\d{2}$/.test(s),sd=allDay?parse(s):new Date(s);if(isNaN(sd))return null;const ed=e?(allDay?parse(e):new Date(e)):null,hh=d=>String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");
  return {id:"g"+String(o.id||o.eventId||(s+(o.summary||""))).replace(/[^\w-]/g,"").slice(-40),title:String(o.summary||o.title||o.name||"Busy").slice(0,80),date:iso(sd),start:allDay?null:hh(sd),end:allDay||!ed||isNaN(ed)?null:hh(ed),who:"you",kind:"other",note:"Google Calendar",src:"gcal",allDay}}
async function gcInput(cal){let props={};try{const d=await MCP.describeTool(GC,"list_events");props=d?.inputSchema?.properties||{}}catch(e){}
  const K=Object.keys(props),used=new Set(),pick=re=>{const k=K.find(k=>!used.has(k)&&re.test(k));if(k)used.add(k);return k},inp={};
  const cid=pick(/^calendar_?id$|^calendar$/i)||pick(/calendar/i);if(cid&&cal)inp[cid]=cal;
  const a=pick(/^time_?min$/i)||pick(/^(start|from|after)|min_?time|start_?time/i)||"timeMin",b=pick(/^time_?max$/i)||pick(/^(end|to|until|before)|max_?time|end_?time/i)||"timeMax";inp[a]=new Date(parse(today)).toISOString();inp[b]=new Date(parse(addDays(today,60))).toISOString();
  const mx=pick(/max|limit|page_?size/i);if(mx)inp[mx]=250;const se=pick(/single|expand/i);if(se&&props[se]?.type==="boolean")inp[se]=true;const ob=pick(/order/i);if(ob&&se)inp[ob]="startTime";return inp}
async function gcSync(manual){if(!ACC)return;const m=await mcpH();if(!m){S.cal={...(S.cal||{}),err:"nomcp"};if(manual)render();return}
  ui.gcBusy=true;if(manual)render();
  try{if(!S.cal?.list){try{const r=await m.callTool(GC,"list_calendars",{});const L=calArr(r.payload).map(c=>({id:String(c.id),name:String(c.summary||c.name||c.title).slice(0,60),primary:!!c.primary}));S.cal={...(S.cal||{}),list:L,cals:S.cal?.cals||L.filter(c=>c.primary).map(c=>c.id)}}catch(e){if(["server_not_connected","needs_reauth","not_in_manifest","approval_required","consent_required","blocked_by_policy","selection_required"].includes(e?.code))throw e}}
    const cals=S.cal?.cals?.length?S.cal.cals:[null];let all=[];
    for(const c of cals){const r=await m.callTool(GC,"list_events",await gcInput(c),{cache:false});all=all.concat((findArr(r.payload)||[]).map(gcMap).filter(Boolean))}
    const seen=new Set();all=all.filter(e=>!seen.has(e.id)&&seen.add(e.id)).sort((a,b)=>a.date<b.date?-1:1).slice(0,400);
    S.cal={...(S.cal||{}),on:true,ev:all,at:Date.now(),err:""};if(manual){sfx("ok");toast(all.length?`${all.length} events from Google Calendar`:"Connected. Nothing on your calendar in the next 60 days.")}commit()}
  catch(e){S.cal={...(S.cal||{}),err:e?.code||"upstream_error"};if(manual)render()}finally{ui.gcBusy=false;if(manual)render()}}
const GCERR={nomcp:"Linking Google Calendar is coming soon on the website. Use the reminder file or calendar import below for now.",server_not_connected:"Add Google Calendar in claude.ai Settings → Connectors, then tap Connect again.",selection_required:"Pick which Google Calendar account to use in the prompt claude.ai shows, then tap Connect again.",needs_reauth:"Google Calendar needs signing in again: claude.ai Settings → Connectors → Google Calendar.",not_in_manifest:"DeepKids needs your OK to read your calendar. Tap Connect and choose Allow.",approval_required:"DeepKids needs your OK to read your calendar. Tap Connect and choose Allow.",consent_required:"DeepKids needs your OK to read your calendar. Tap Connect and choose Allow.",blocked_by_policy:"Your organisation doesn't allow calendar access here.",server_unavailable:"Google Calendar didn't answer. Try again in a minute.",tool_error:"Google Calendar couldn't send the events. Try Refresh."};
setTimeout(()=>{if(S?.cal?.on)gcSync(false)},5000);
setInterval(()=>{if(S?.cal?.on&&!document.hidden&&Date.now()-(S.cal.at||0)>15*6e4)gcSync(false)},6e4);

/* ---------- uploads: drop everything in, DeepKids files it ---------- */
const UPK=["worksheet","drawing","notebook","experiment","craft","outing","reading","certificate","other"];
async function shrink(f,max=900){try{const b=await createImageBitmap(f),s=Math.min(1,max/Math.max(b.width,b.height)),c=document.createElement("canvas");c.width=Math.round(b.width*s);c.height=Math.round(b.height*s);c.getContext("2d").drawImage(b,0,0,c.width,c.height);return await new Promise(r=>c.toBlob(r,"image/jpeg",.8))}catch(e){return null}}
function upCands(date){const near=new Set();S.log.forEach(l=>{if(l.date>=addDays(date,-3)&&l.date<=addDays(date,1))near.add(l.key)});S.subjects.forEach(s=>{const nx=nextUp(s);if(nx)near.add(nx.u.k)});
  return [...near].map(unitByK).filter(Boolean).map(u=>{const ls=S.log.filter(l=>l.key===u.k&&l.date>=addDays(date,-3)&&l.date<=addDays(date,1));return {u,ls}}).sort((a,b)=>b.ls.length-a.ls.length)}
function upGuess(x){const C=upCands(x.date),same=C.filter(c=>c.ls.some(l=>l.date===x.date));return same.length===1?same[0].u.k:C.filter(c=>c.ls.length).length===1?C.find(c=>c.ls.length).u.k:""}
async function upTag(items){items.forEach(x=>{x.k=upGuess(x)});if(!SAMPLE)return;
  for(let i=0;i<items.length;i+=4){const B=items.slice(i,i+4),imgs=[];const lines=[];
    for(const [j,x] of B.entries()){const C=upCands(x.date);let im=null;if(IMGOK&&x.type.startsWith("image/")&&x._f){im=await shrink(x._f);if(im)imgs.push(im)}
      lines.push(`Item ${j+1}: file "${x.name}", dated ${fmt(x.date)}${im?`, image ${imgs.length} attached`:" (no image; use the name and date)"}. Candidate chapters:\n${C.slice(0,8).map(c=>`  - ${c.u.k} = ${SUBJ[c.u.subj]}, ${chT(c.u)}${c.ls.length?`; studied ${c.ls.map(l=>fmt(l.date)+(l.n?" (Part "+l.n+(c.u.c?.p?": "+pkDay(c.u,l.n).title:"")+")":"")).join(", ")}`:"; the chapter in progress"}`).join("\n")||"  (none)"}`)}
    const prompt=`You file a homeschooling family's photos and files (child ${S.age||""} in India). For each item, pick the chapter it belongs to from that item's candidates, judged from what the image shows and the date. Use "" if none fits. Then say what it is.
${lines.join("\n")}
Return JSON only: {"items":[{"i":1,"k":"<candidate key or empty>","kind":"${UPK.join("|")}","title":"what it shows, 3 to 8 words","tags":["2 to 4 short topic words"]}]}`;
    try{const r=await SAMPLE.json(prompt,{modelTier:"default",cache:false,...(imgs.length?{images:imgs}:{})});(r?.items||[]).forEach(o=>{const x=B[(+o.i||0)-1];if(!x)return;const ok=new Set(upCands(x.date).map(c=>c.u.k));if(o.k&&ok.has(o.k))x.k=o.k;if(UPK.includes(o.kind))x.kind=o.kind;if(o.title)x.title=String(o.title).slice(0,70);if(Array.isArray(o.tags))x.tags=o.tags.slice(0,4).map(t=>String(t).slice(0,24))})}catch(e){}}}
async function upFiles(files){if(!ASSETS){toast("Files couldn’t be saved just now. Check your connection and try again.");return}ui.up={n:files.length,i:0,fail:0,step:"save"};render();const added=[];
  for(const f of files){ui.up.i++;render();try{const r=await ASSETS.upload(f);const d=iso(f.lastModified||Date.now());added.push({id:r.id,name:f.name,type:f.type||"",date:d>today?today:d,k:"",title:f.name.replace(/\.[^.]+$/,"").slice(0,60),kind:"",tags:[],src:"up",at:Date.now(),_f:f})}catch(e){ui.up.fail++;ui.up.err=e?.code}}
  if(added.length){ui.up.step="tag";render();await upTag(added)}added.forEach(x=>{delete x._f;x.title=x.title||x.name});
  const fail=ui.up.fail,code=ui.up.err;S.work=[...(S.work||[]),...added];ui.up=null;
  if(added.length){sfx("win");toast(`Filed ${added.length}${added.filter(x=>x.k).length<added.length?` · ${added.length-added.filter(x=>x.k).length} need a chapter`:""}`)}if(fail)toast(code==="too_large"?`${fail} file${fail>1?"s were":" was"} too big (20 MB max)`:`${fail} couldn't be saved`);commit()}
const isImg=w=>!w.type||w.type.startsWith("image/");
function upCard(w,i){const u=w.k&&unitByK(w.k),C=upCands(w.date);
  return `<div class="upc">${isImg(w)?`<img src="/_blob/${esc(w.id)}" alt="${esc(w.title||"Upload")}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'ph',textContent:'Photo'}))">`:`<a class="ph" href="/_blob/${esc(w.id)}" target="_blank" rel="noopener">${esc((w.name||"file").split(".").pop().toUpperCase())}</a>`}
    <div class="col" style="gap:4px;min-width:0"><b class="sm">${esc(w.title||w.name||"Upload")}</b><span class="xs muted">${esc(fmt(w.date))}${w.kind?" · "+esc(w.kind):""}${(w.tags||[]).length?" · "+w.tags.map(esc).join(", "):""}</span>
    <select class="inp" style="height:36px;font-size:13px" data-upk="${esc(w.id)}" aria-label="Chapter"><option value="">${u?"":"Which chapter? "}Not linked to a chapter</option>${[...new Map([...(u?[[u.k,u]]:[]),...C.map(c=>[c.u.k,c.u])]).values()].map(x=>`<option value="${esc(x.k)}" ${x.k===w.k?"selected":""}>${esc(SUBJ[x.subj])} · ${esc(chT(x))}</option>`).join("")}</select></div></div>`}
function uploadsView(){document.getElementById("sheetTitle").textContent="Uploads";const U=(S.work||[]).slice().sort((a,b)=>(b.date||"")<(a.date||"")?-1:1),P=ui.up;
  let h=`<label class="drop ${P?"busy":""}">${blob("var(--leaf)",5,"wow","",'width="48" height="48"')}<b>${P?(P.step==="tag"?"Reading and filing…":`Saving ${P.i} of ${P.n}…`):"Add photos and files"}</b><span class="xs muted">${P?"Keep this open for a moment.":"Pick as many as you like: worksheets, drawings, notebook pages, experiments, outings. DeepKids matches each to the day and chapter. Nothing to fill in."}</span><input type="file" id="upFiles" multiple accept="image/*,application/pdf,video/*,.doc,.docx,.ppt,.pptx" hidden ${P?"disabled":""}></label>
  ${ASSETS?"":`<p class="xs muted">Saving files needs a connection.</p>`}`;
  const need=U.filter(w=>!w.k);if(need.length)h+=`<section class="sec"><div class="sech"><h3 style="font-size:18px">Need a chapter</h3><span class="pill">${need.length}</span></div><p class="xs muted">Pick one, or leave it as a general memory.</p><div class="col" style="gap:8px">${need.map(upCard).join("")}</div></section>`;
  const by={};U.filter(w=>w.k).forEach(w=>{const m=(w.date||"").slice(0,7);(by[m]=by[m]||[]).push(w)});
  Object.keys(by).sort().reverse().forEach(m=>{h+=`<section class="sec"><div class="sech"><h3 style="font-size:18px">${parse(m+"-01").toLocaleDateString(undefined,{month:"long",year:"numeric"})}</h3><span class="pill">${by[m].length}</span></div><div class="col" style="gap:8px">${by[m].map(upCard).join("")}</div></section>`});
  if(!U.length)h+=`<p class="note">Nothing uploaded yet.</p>`;return h}

/* ---------- tracking ---------- */
const CHC={math:"#2A8FB0",eng:"#C24F8A",hin:"#D98A2B",sci:"#3F8A4F",dks:"#6E6CC9",wml:"#C9A227",wart:"#C24F8A"};
const hmin=m=>{m=Math.round(m);return m<60?m+" min":Math.floor(m/60)+" h"+(m%60?" "+m%60+" m":"")};
function addMins(k,sec){const u=unitByK(String(k||"").replace(/^x/,""));if(!u)return;S.mins=S.mins||{};const key=today+"|"+u.subj;S.mins[key]=Math.round(((S.mins[key]||0)+sec/60)*10)/10}
function trackData(){const D={},day=d=>D[d]=D[d]||{m:{},e:{},did:[]},add=(d,s,f,m)=>{const x=day(d);x[f][s]=(x[f][s]||0)+m};
  Object.entries(S.mins||{}).forEach(([k,m])=>{const [d,s]=k.split("|");add(d,s,"m",m)});
  (S.pace||[]).forEach(p=>{const u=unitByK(p.k);if(!u||S.mins?.[p.date+"|"+u.subj]!==undefined)return;add(p.date,u.subj,"m",p.took||0)});
  S.log.slice().reverse().forEach(l=>{if(l.kind==="free"&&!l.title)return;const x=day(l.date),u=unitByK(l.key);if(!x.m[l.subj]&&l.kind!=="skipped")add(l.date,l.subj,"e",lessonMins(l.subj,l.date));x.did.push({t:"lesson",s:l.subj,u,n:l.n,title:l.title,at:l.at,sk:l.kind==="skipped"})});
  Object.entries(S.tasks||{}).forEach(([k,o])=>Object.entries(o).forEach(([id,d])=>{if(typeof d!=="string"||!/^\d{4}-/.test(d))return;const [uk,w]=k.split("#"),u=unitByK(uk);if(!u)return;if(id==="ws"){const pw=w&&u.c?.p?.worksheets?.find(z=>z.id===w);day(d).did.push({t:"ws",s:u.subj,u,title:pw?pw.title:"Worksheet"})}}));
  Object.entries(WK()).forEach(([key,w])=>{const j=key.lastIndexOf("|"),u=unitByK(key.slice(0,j));if(!u)return;if(w.started&&w.st!=="done")day(w.started).did.push({t:"start",s:u.subj,u,title:w.title});if(w.done)day(w.done).did.push({t:"proj",s:u.subj,u,title:w.title})});
  Object.entries(S.quiz||{}).forEach(([key,q])=>{const j=key.lastIndexOf("|"),u=unitByK(key.slice(0,j)),its=Object.values(q);if(!u||!its.length)return;const d=its.map(x=>x.d).sort().pop();day(d).did.push({t:"quiz",s:u.subj,u,n:+key.slice(j+1),title:`${its.filter(x=>x.r).length} of ${its.length} got it`})});
  (S.work||[]).forEach(w=>{if(w.date)day(w.date).did.push({t:"up",w,u:w.k&&unitByK(w.k),s:w.k&&unitByK(w.k)?.subj})});
  Object.entries(S.evlog||{}).forEach(([k,r])=>{const j=k.indexOf("|"),e=evFind(k.slice(j+1));day(k.slice(0,j)).did.push({t:"ev",title:e?.title||"Class",r})});
  (S.exps||[]).forEach(e=>(e.checks||[]).forEach(d=>day(d).did.push({t:"check",title:e.title})));
  return D}
const dTot=x=>Object.values(x.m).reduce((a,b)=>a+b,0)+Object.values(x.e).reduce((a,b)=>a+b,0);
function didLine(x){const ch=x.u?esc(chT(x.u)):"";return x.t==="lesson"?`<li><b>${ch}</b>${x.n?` · Part ${x.n}`:""}${x.sk?" (skipped)":""}${x.at!=null?` <span class="xs muted">${clock(x.at)}</span>`:""}</li>`:x.t==="ws"?`<li>Worksheet finished: ${esc(x.title)} <span class="xs muted">${ch}</span></li>`:x.t==="quiz"?`<li>Quiz, Part ${x.n}: ${esc(x.title)} <span class="xs muted">${ch}</span></li>`:x.t==="proj"?`<li>Finished: ${esc(x.title)} <span class="xs muted">${ch}</span></li>`:x.t==="start"?`<li>Started: ${esc(x.title)} <span class="xs muted">${ch}</span></li>`:x.t==="ev"?evLogLine(x):x.t==="check"?`<li>Checked on: ${esc(x.title)}</li>`:""}
function trackChart(T){const days=Array.from({length:14},(_,i)=>addDays(today,i-13)),subs=SUBJ_KEYS.filter(s=>days.some(d=>T[d]&&((T[d].m[s]||0)+(T[d].e[s]||0))>0)),mx=Math.max(30,...days.map(d=>T[d]?dTot(T[d]):0)),top=Math.ceil(mx/30)*30;
  if(!subs.length)return `<p class="note">No study time in the last two weeks yet. Time is measured as you go through lessons.</p>`;
  return `<div class="tlegend">${subs.map(s=>`<span><i style="background:${CHC[s]}"></i>${esc(SUBJ[s])}</span>`).join("")}<span class="xs muted"><i class="est"></i>Lighter: planned time, not timed</span></div>
  <div class="tchart" role="img" aria-label="Minutes studied each day for the last 14 days"><div class="tgrid"><span style="bottom:100%">${hmin(top)}</span><span style="bottom:50%">${hmin(top/2)}</span><span style="bottom:0">0</span></div>
  <div class="tbars">${days.map(d=>{const x=T[d]||{m:{},e:{}},t=dTot(x),segs=subs.flatMap(s=>[[s,x.m[s]||0,0],[s,x.e[s]||0,1]]).filter(z=>z[1]>0),tip=`${fmt(d)} · ${hmin(t)}`+subs.filter(s=>(x.m[s]||0)+(x.e[s]||0)).map(s=>`\n${SUBJ[s]}: ${hmin((x.m[s]||0)+(x.e[s]||0))}${x.e[s]&&!x.m[s]?" (planned)":""}`).join("");
    return `<div class="tcol" data-tip="${esc(t?tip:fmt(d)+" · no study")}" tabindex="0"><div class="tstack" style="height:${t/top*100}%">${segs.map(([s,m,e])=>`<i style="flex:${m};background:${CHC[s]};${e?"opacity:.45":""}"></i>`).join("")}</div><span class="tx ${d===today?"on":""}">${parse(d).getDate()}</span></div>`}).join("")}</div></div>`}
function trackView(){document.getElementById("sheetTitle").textContent="Tracking";const T=trackData(),ds=Object.keys(T).filter(d=>d<=today).sort().reverse(),study=ds.filter(d=>dTot(T[d])>0||T[d].did.some(x=>x.t==="lesson"));
  const all=study.reduce((a,d)=>a+dTot(T[d]),0),wk=study.filter(d=>d>addDays(today,-7)).reduce((a,d)=>a+dTot(T[d]),0),fin=Object.keys(S.progress||{}).filter(k=>st(k)==="completed").length,sub={};
  study.forEach(d=>SUBJ_KEYS.forEach(s=>{const m=(T[d].m[s]||0)+(T[d].e[s]||0),n=T[d].did.filter(x=>x.t==="lesson"&&x.s===s).length;if(m||n){sub[s]=sub[s]||{m:0,n:0,days:0};sub[s].m+=m;sub[s].n+=n;sub[s].days++}}));
  const smax=Math.max(1,...Object.values(sub).map(x=>x.m));
  let h=`<div class="tiles"><div class="tile"><b>${hmin(all)}</b><span>studied in all</span></div><div class="tile"><b>${study.length}</b><span>study days</span></div><div class="tile"><b>${hmin(study.length?all/study.length:0)}</b><span>a study day, on average</span></div><div class="tile"><b>${hmin(wk)}</b><span>in the last 7 days</span></div><div class="tile"><b>${fin}</b><span>chapters finished</span></div></div>`;
  h+=`<section class="sec"><div class="sech"><h3 style="font-size:18px">Last two weeks</h3></div>${trackChart(T)}</section>`;
  h+=`<section class="sec"><div class="sech"><h3 style="font-size:18px">By subject</h3><span class="xs muted">all time</span></div>${Object.keys(sub).length?`<div class="col" style="gap:10px">${SUBJ_KEYS.filter(s=>sub[s]).map(s=>`<div class="hbar"><span class="sm"><b>${esc(SUBJ[s])}</b> · ${hmin(sub[s].m)} · ${sub[s].n} lesson${sub[s].n===1?"":"s"} on ${sub[s].days} day${sub[s].days===1?"":"s"}</span><div class="hb"><i style="width:${sub[s].m/smax*100}%;background:${CHC[s]}"></i></div></div>`).join("")}</div>`:`<p class="xs muted">Nothing yet.</p>`}</section>`;
  const lim=ui.tlim||21;h+=`<section class="sec"><div class="sech"><h3 style="font-size:18px">Day by day</h3><span class="xs muted">${ds.length} days with activity</span></div>${ds.slice(0,lim).map(d=>{const x=T[d],t=dTot(x),subs=SUBJ_KEYS.filter(s=>x.m[s]||x.e[s]),ups=x.did.filter(z=>z.t==="up");
    return `<details class="card tday" ${d===ds[0]?"open":""}><summary><b>${esc(fmt(d))}</b> <span class="sm muted">· ${t?hmin(t):"no timed study"}</span><div class="row" style="gap:6px;margin-top:4px">${subs.map(s=>`<span class="chip ${SC(s)}" style="pointer-events:none">${esc(SUBJ[s])} ${hmin((x.m[s]||0)+(x.e[s]||0))}${x.m[s]?"":" planned"}</span>`).join("")}</div></summary><ul class="sm" style="padding-left:18px;margin:8px 0 0">${x.did.filter(z=>z.t!=="up").map(didLine).join("")}${ups.length?`<li>${ups.length} upload${ups.length>1?"s":""}: ${ups.slice(0,3).map(z=>esc(z.w.title||z.w.name||"")).join(", ")}</li>`:""}</ul></details>`}).join("")||`<p class="note">Your days show here as you study.</p>`}${ds.length>lim?`<button class="link" data-act="tmore">Show older days</button>`:""}</section>`;
  return h}
let TIP=null;
function tipAt(el){if(!TIP){TIP=document.createElement("div");TIP.id="tip";document.body.appendChild(TIP)}TIP.textContent=el.dataset.tip;TIP.style.display="block";const r=el.getBoundingClientRect(),w=TIP.offsetWidth;TIP.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2))+"px";TIP.style.top=Math.max(8,r.top-TIP.offsetHeight-8)+"px"}
document.addEventListener("pointerover",e=>{const t=e.target.closest?.("[data-tip]");if(t)tipAt(t);else if(TIP)TIP.style.display="none"});
document.addEventListener("focusin",e=>{const t=e.target.closest?.("[data-tip]");if(t)tipAt(t)});
document.addEventListener("scroll",()=>{if(TIP)TIP.style.display="none"},true);

/* ---------- school transfer report ---------- */
const GRADE=p=>p>=91?"A1":p>=81?"A2":p>=71?"B1":p>=61?"B2":p>=51?"C1":p>=41?"C2":p>=33?"D":"E";
const BOARDN={ncert:"NCERT / CBSE",cambridge:"Cambridge Primary",nios:"NIOS Open Basic Education",waldorf:"Waldorf (Steiner) education"};
const lvN=(b,l)=>b==="nios"?(l===3?"Level A (≈ Class 3)":l===5?"Level B (≈ Class 5)":"Level "+l):b==="cambridge"?`Stage ${l} (≈ Class ${l})`:`Class ${l}`;
function chScore(u){const k=u.k,P=u.c?.p,cov=Math.min(1,done(k)/sessionsFor(u));let r=0,n=0;
  const sets=[...(u.c?.x?.wsd?[[k,u.c.x.wsd]]:[]),...(P?.worksheets||[]).map(w=>[k+"#"+w.id,w.sections])];
  sets.forEach(([kk,W])=>W.forEach(([_,its],si)=>its.forEach((it,ii)=>{const v=A(kk,si+"-"+ii);if(v===undefined||v==="")return;
    if(it.t==="mcq"){n++;if(v===it.a)r++}else if(it.t==="match"&&v&&typeof v==="object")it.pairs.forEach(([l,rr])=>{if(v[l]!==undefined){n++;if(v[l]===rr)r++}});
    else if(it.t==="fill")[].concat(v).forEach((x,bi)=>{if(!x)return;n++;const acc=[].concat(it.a[bi]??"").join("/").split("/").map(z=>z.trim().toLowerCase());if(acc.includes(String(x).trim().toLowerCase()))r++})})));
  Object.entries(S.quiz||{}).forEach(([kk,q])=>{if(kk.slice(0,kk.lastIndexOf("|"))!==k)return;Object.values(q).forEach(x=>{n++;if(x.r)r++})});
  const dn=done(k),due=it=>!it.day||it.day<=dn,pool=[...(P?.worksheets||[]).filter(due).map(w=>taskDone(k+"#"+w.id,"ws")),...(P?.experiments||[]).filter(due).map(e=>taskDone(k,e.id)),...(P?.activities||[]).filter(due).map(a=>taskDone(k,a.id)),...(u.c?.x?.wsd&&cov>=1?[taskDone(k,"ws")]:[])];
  const prac=pool.length?pool.filter(Boolean).length/pool.length:null,acc=n?r/n:null,parts=[[acc,.7],[prac,.3]].filter(p=>p[0]!==null),w=parts.reduce((a,p)=>a+p[1],0),score=w?Math.round(parts.reduce((a,p)=>a+p[0]*p[1],0)/w*100):null;
  const last=S.log.filter(l=>l.key===k).map(l=>l.date).sort();return {u,cov,acc,n,r,prac,score,grade:score==null?"":GRADE(score),fin:st(k)==="completed"||done(k)>=sessionsFor(u),from:last[0],to:last[last.length-1]}}
function schoolData(){const studied=Object.keys(S.progress||{}).filter(k=>done(k)>0).map(unitByK).filter(u=>u&&u.board!=="dk"&&u.board!=="gen"),sc=studied.map(chScore),T=trackData(),ds=Object.keys(T).filter(d=>dTot(T[d])>0||T[d].did.some(x=>x.t==="lesson")).sort();
  const finK=new Set(sc.filter(x=>x.fin).map(x=>x.u.k)),stK=new Set(sc.map(x=>x.u.k)),RC=DATA.rconcepts||[],conOf={};RC.forEach(c=>c.chapters.forEach(k=>(conOf[k]=conOf[k]||[]).push(c)));
  const cDone=new Set(RC.filter(c=>c.chapters.some(k=>finK.has(k))).map(c=>c.id)),cSome=new Set(RC.filter(c=>c.chapters.some(k=>stK.has(k))).map(c=>c.id));
  const subs=SUBJ_KEYS.filter(s=>S.subjects.includes(s)||sc.some(x=>x.u.subj===s)).map(s=>{const L=sc.filter(x=>x.u.subj===s),G=L.filter(x=>x.score!=null),wt=G.reduce((a,x)=>a+x.n+1,0),score=G.length?Math.round(G.reduce((a,x)=>a+x.score*(x.n+1),0)/wt):null,mins=ds.reduce((a,d)=>a+(T[d].m[s]||0)+(T[d].e[s]||0),0);
    const boards=["ncert","cambridge","nios"].map(b=>{const us=DATA.items.filter(u=>u.board===b&&u.subj===s);if(!us.length)return null;const lv={};
      us.forEach(u=>{const R=lv[u.level]=lv[u.level]||{tot:0,done:0,eq:0,going:0};R.tot++;const cs=conOf[u.k]||[];if(finK.has(u.k))R.done++;else if(stK.has(u.k))R.going++;else if(cs.length&&cs.every(c=>cDone.has(c.id)))R.eq++;else if(cs.some(c=>cDone.has(c.id)||cSome.has(c.id)))R.going++});
      const levels=Object.keys(lv).map(Number).sort((a,b)=>a-b),reached=levels.filter(l=>(lv[l].done+lv[l].eq)/lv[l].tot>=.8).pop(),working=levels.filter(l=>lv[l].done+lv[l].eq+lv[l].going>0).pop();return {b,lv,levels,reached,working}}).filter(Boolean);
    return {s,L,score,grade:score==null?"":GRADE(score),mins,level:S.levels?.[s],boards}});
  const ws=Object.entries(S.tasks||{}).filter(([k,o])=>o.ws).length,proj=Object.values(WK()).filter(w=>w.st==="done").length,qz=Object.values(S.quiz||{}).reduce((a,q)=>a+Object.keys(q).length,0);
  const months={};ds.forEach(d=>{const m=d.slice(0,7);months[m]=months[m]||{d:0,m:0};months[m].d++;months[m].m+=dTot(T[d])});
  return {subs,ds,from:ds[0],to:ds[ds.length-1],mins:ds.reduce((a,d)=>a+dTot(T[d]),0),ws,proj,qz,ups:(S.work||[]).length,months,cross:RC.length}}
const SCORE_NOTE="Scores (0–100) measure the work done so far, not how far the child has got: 70% accuracy on auto-checked worksheet items and quiz questions, 30% worksheets, experiments and activities finished out of those due by the parts completed. How much of each chapter is complete is shown separately. Subject scores weight chapters by how many answers were checked. Grades use the CBSE 8-point scale: A1 91–100, A2 81–90, B1 71–80, B2 61–70, C1 51–60, C2 41–50, D 33–40, E below 33. These are records of home learning, not exam marks.";
function covCell(R){if(!R)return "—";const p=Math.round((R.done+R.eq)/R.tot*100);return `${p}%<span class="xs muted"> · ${R.done} done${R.eq?`, ${R.eq} by equivalent`:""}${R.going?`, ${R.going} begun`:""} of ${R.tot}</span>`}
function schoolView(){document.getElementById("sheetTitle").textContent="Moving to a school";const D=schoolData(),I=S.school||{},f=(k,l,type="text",ph="")=>`<div class="field"><label for="sch-${k}">${l}</label><input class="inp" id="sch-${k}" type="${type}" data-sch="${k}" value="${esc(I[k]||"")}" placeholder="${esc(ph)}"></div>`;
  let h=`<p class="sm muted">A full record of what ${esc(S.child||"your child")} has covered at home, by board and level, with scores. Download it as a transcript for the new school.</p>
  <div class="row" style="gap:10px;flex-wrap:wrap"><button class="btn accent sm" data-act="tsave">Download transcript</button><button class="btn soft sm" data-act="tprint">Print or save as PDF</button></div>
  <details class="card"><summary><b>Details for the school</b> <span class="xs muted">· optional</span></summary><div class="fgrid" style="margin-top:10px">${f("dob","Date of birth","date")}${f("to","School applying to","text","e.g. Kendriya Vidyalaya, Indiranagar")}${f("cls","Class applying for","text","e.g. Class 4")}${f("contact","Parent phone or email")}</div><div class="field"><label for="sch-note">A note for the school</label><textarea class="inp" id="sch-note" data-sch="note" rows="3" placeholder="How you homeschool, strengths, anything they should know">${esc(I.note||"")}</textarea></div></details>`;
  h+=testSection();
  h+=testSection();
  h+=testSection();
  h+=testSection();
  h+=testSection();
  h+=testSection();
  h+=testSection();
  h+=testSection();
  h+=testSection();
  h+=testSection();
  h+=testSection();
  h+=testSection();
  h+=`<div class="tiles"><div class="tile"><b>${D.ds.length}</b><span>study days${D.from?` since ${esc(fmt(D.from))}`:""}</span></div><div class="tile"><b>${hmin(D.mins)}</b><span>of study</span></div><div class="tile"><b>${D.subs.reduce((a,x)=>a+x.L.filter(c=>c.fin).length,0)}</b><span>chapters completed</span></div><div class="tile"><b>${D.ws}</b><span>worksheets finished</span></div></div>`;
  const idle=D.subs.filter(x=>!x.L.length);D.subs.filter(x=>x.L.length).forEach(x=>{h+=`<section class="card ${SC(x.s)}"><div class="sech"><h3 style="font-size:19px">${esc(SUBJ[x.s])}</h3>${x.score!=null?`<span class="grade" title="Score ${x.score}">${x.grade} · ${x.score}</span>`:`<span class="xs muted">no checked work yet</span>`}</div>
    <p class="xs muted">${hmin(x.mins)} · ${x.L.filter(c=>c.fin).length} chapters completed, ${x.L.filter(c=>!c.fin).length} in progress${x.level?` · working at Level ${x.level}`:""}</p>
    <div class="grid"><table class="rtab"><tr><th>Board</th><th>Where the child is</th>${[1,2,3,4,5].map(l=>`<th>L${l}</th>`).join("")}</tr>${x.boards.map(B=>`<tr><td><b>${esc(BOARDN[B.b])}</b></td><td class="xs">${B.reached?`Covers ${esc(lvN(B.b,B.reached))}`:B.working?`Working on ${esc(lvN(B.b,B.working))}`:"Not begun"}</td>${[1,2,3,4,5].map(l=>`<td class="xs">${B.lv[l]?Math.round((B.lv[l].done+B.lv[l].eq)/B.lv[l].tot*100)+"%":"·"}</td>`).join("")}</tr>`).join("")}</table></div>
    ${x.L.length?`<details><summary class="link sm" style="cursor:pointer">Chapters and scores (${x.L.length})</summary><table class="rtab" style="margin-top:8px"><tr><th>Chapter</th><th>Done</th><th>Accuracy</th><th>Score</th></tr>${x.L.sort((a,b)=>a.u.level-b.u.level||(+a.u.n||0)-(+b.u.n||0)).map(c=>`<tr><td><b>${esc(chT(c.u))}</b><br><span class="xs muted">${esc(BOARDN[c.u.board]||c.u.book)} · ${esc(lvN(c.u.board,c.u.level))}</span></td><td>${Math.round(c.cov*100)}%</td><td>${c.acc==null?"—":Math.round(c.acc*100)+"%"}<span class="xs muted">${c.n?` (${c.r}/${c.n})`:""}</span></td><td>${c.score==null?"—":`<b>${c.grade}</b> ${c.score}`}</td></tr>`).join("")}</table></details>`:""}</section>`});
  if(idle.length)h+=`<p class="sm muted">Not started yet: ${idle.map(x=>esc(SUBJ[x.s])).join(", ")}.</p>`;if(!D.subs.some(x=>x.L.length))h+=`<p class="note">Finish a few lessons and the report fills in here.</p>`;
  h+=`<p class="xs muted">${SCORE_NOTE}</p><p class="xs muted">Board percentages count chapters done in that board, plus Science chapters of other boards that teach the same ideas (${D.cross} shared Science concepts are mapped across NCERT, Cambridge and NIOS). Other subjects count each board's own chapters only.</p>`;
  h+=bundleSection();
  return h}
function transcriptDoc(){const D=schoolData(),I=S.school||{},kid=S.child||"Student",row=(a,b)=>b?`<tr><th>${a}</th><td>${b}</td></tr>`:"";
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(kid)} · Home education transcript</title><style>body{font:14px/1.5 system-ui,sans-serif;color:#222;max-width:820px;margin:24px auto;padding:0 16px}h1{font-size:22px;margin:0}h2{font-size:17px;margin:26px 0 6px;border-bottom:2px solid #333;padding-bottom:3px}h3{font-size:15px;margin:16px 0 4px}table{border-collapse:collapse;width:100%;margin:4px 0}th,td{border:1px solid #bbb;padding:5px 8px;text-align:left;vertical-align:top}th{background:#f2f2f2}.k th{width:34%;background:#fafafa}.muted{color:#666}.sm{font-size:12px}.sig{display:flex;gap:40px;margin-top:40px}.sig div{flex:1;border-top:1px solid #333;padding-top:4px;font-size:12px}@media print{body{margin:0}h2{break-after:avoid}table{break-inside:auto}tr{break-inside:avoid}}</style></head><body>
  <h1>Home education transcript</h1><p class="muted">Prepared with DeepKids · ${esc(new Date().toLocaleDateString(undefined,{day:"numeric",month:"long",year:"numeric"}))}</p>
  <h2>Student</h2><table class="k">${row("Name",esc(kid))}${row("Date of birth",I.dob?esc(parse(I.dob).toLocaleDateString(undefined,{day:"numeric",month:"long",year:"numeric"})):"")}${row("Age",S.age?esc(S.age)+" years":"")}${row("Parent / guardian",esc(S.parent?.name||""))}${row("Contact",esc(I.contact||""))}${row("Applying to",esc([I.to,I.cls].filter(Boolean).join(", ")))}${row("Boards followed",esc(boardsOn().map(b=>BOARDN[b]||b).join(", ")||"DeepKids"))}${row("Period of home learning",D.from?esc(fmt(D.from)+" to "+fmt(D.to)):"")}</table>
  <h2>Summary</h2><table><tr><th>Subject</th><th>Level working at</th><th>Chapters completed</th><th>In progress</th><th>Study time</th><th>Score</th><th>Grade</th></tr>${D.subs.map(x=>`<tr><td>${esc(SUBJ[x.s])}</td><td>${x.level?"Level "+x.level+" (≈ Class "+x.level+")":"—"}</td><td>${x.L.filter(c=>c.fin).length}</td><td>${x.L.filter(c=>!c.fin).length}</td><td>${hmin(x.mins)}</td><td>${x.score??"—"}</td><td>${x.grade||"—"}</td></tr>`).join("")}</table>
  <p class="sm">Study days: ${D.ds.length} · Total study time: ${hmin(D.mins)} · Worksheets finished: ${D.ws} · Quiz questions answered: ${D.qz} · Projects and experiments finished: ${D.proj} · Work samples kept: ${D.ups}</p>
  <h2>Coverage by board and level</h2><p class="sm muted">Share of each board's chapters covered at each level. "By equivalent" counts Science chapters of a board whose ideas were all covered through another board's chapters.</p>${D.subs.map(x=>`<h3>${esc(SUBJ[x.s])}</h3><table><tr><th>Board</th><th>Level reached</th><th>Level 1</th><th>Level 2</th><th>Level 3</th><th>Level 4</th><th>Level 5</th></tr>${x.boards.map(B=>`<tr><td>${esc(BOARDN[B.b])}</td><td>${B.reached?esc(lvN(B.b,B.reached)):B.working?"Working on "+esc(lvN(B.b,B.working)):"Not begun"}</td>${[1,2,3,4,5].map(l=>`<td>${covCell(B.lv[l])}</td>`).join("")}</tr>`).join("")}</table>`).join("")}
  <h2>Chapters studied</h2>${D.subs.filter(x=>x.L.length).map(x=>`<h3>${esc(SUBJ[x.s])}</h3><table><tr><th>Chapter</th><th>Board · level</th><th>Dates</th><th>Completed</th><th>Accuracy</th><th>Score</th><th>Grade</th></tr>${x.L.map(c=>`<tr><td>${esc(chT(c.u))}</td><td>${esc(BOARDN[c.u.board]||c.u.book)} · ${esc(lvN(c.u.board,c.u.level))}</td><td>${c.from?esc(fmt(c.from))+(c.to&&c.to!==c.from?" – "+esc(fmt(c.to)):""):""}</td><td>${Math.round(c.cov*100)}%</td><td>${c.acc==null?"—":Math.round(c.acc*100)+"% ("+c.r+"/"+c.n+")"}</td><td>${c.score??"—"}</td><td>${c.grade||"—"}</td></tr>`).join("")}</table>`).join("")||`<p>No chapters recorded yet.</p>`}
  <h2>Attendance</h2><table><tr><th>Month</th><th>Study days</th><th>Study time</th></tr>${Object.keys(D.months).sort().map(m=>`<tr><td>${esc(parse(m+"-01").toLocaleDateString(undefined,{month:"long",year:"numeric"}))}</td><td>${D.months[m].d}</td><td>${hmin(D.months[m].m)}</td></tr>`).join("")}</table>
  ${I.note?`<h2>Note from the parent</h2><p>${esc(I.note).replace(/\n/g,"<br>")}</p>`:""}
  ${quizTranscript()}${testTranscript()}<h2>How scores are worked out</h2><p class="sm">${SCORE_NOTE}</p><p class="sm">Study time is measured while lessons are open in the app; days without timing use the planned lesson length and are included in totals.</p>
  <h2>Declaration</h2><p class="sm">I confirm that this record reflects my child's home learning.</p><div class="sig"><div>Parent / guardian signature</div><div>Date</div></div></body></html>`}
async function saveDoc(html,name){try{const dl=await window.claude?.use?.("downloads");if(dl){await dl.save({filename:name,data:html});toast("Saved");return}}catch(e){if(e?.code==="declined")return}
  try{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([html],{type:"text/html"}));a.download=name;document.body.appendChild(a);a.click();a.remove();toast("Saved")}catch(e){toast("Couldn't save here. Try Print instead.")}}
function printDoc(html){const w=window.open("","_blank");if(w){w.document.write(html);w.document.close();setTimeout(()=>{try{w.print()}catch(e){}},300);return}const f=document.createElement("iframe");f.style.cssText="position:fixed;width:0;height:0;border:0";document.body.appendChild(f);f.srcdoc=html;f.onload=()=>{try{f.contentWindow.print()}catch(e){toast("Printing isn't allowed here. Download it, then print that.")}setTimeout(()=>f.remove(),4000)}}
/* ---------- chat-style answers to Claude's questions when sorting ---------- */
function dumpChat(D_){const Q=D_.questions||[],C=D_.chat||[];if(!Q.length&&!C.length)return "";
  return `<div class="chat">${C.map(c=>`<div class="bub cl">${esc(c.q)}</div><div class="bub me">${esc(c.a)}</div>`).join("")}${Q.map((q,i)=>`<div class="bub cl">${esc(q)}</div><div class="qa"><input class="inp" id="qa-${i}" data-qa="${i}" placeholder="Type your answer" autocomplete="off"><button class="btn sm" data-act="qsend" ${D_.busy?"disabled":""}>Send</button></div>`).join("")}${Q.length?`<p class="xs muted">Skip any you'd rather not answer.</p>`:""}</div>`}
function qSend(){const D_=ui.dump=ui.dump||{},Q=D_.questions||[],ans=Q.map((q,i)=>[q,(document.getElementById("qa-"+i)?.value||"").trim()]).filter(([,a])=>a);if(!ans.length){toast("Type an answer first");return}
  D_.chat=[...(D_.chat||[]),...ans.map(([q,a])=>({q,a}))];
  if(D_.local){const left=[];(D_.asks||[]).forEach((a,i)=>{const v=(document.getElementById("qa-"+i)?.value||"").trim();if(!v){left.push(a);return}const it=D_.items[a.i];if(!it)return;
      if(a.need==="ampm"){if(/eve|night|pm|after/i.test(v)){it.start=clock24(hm(it.start)+720);if(it.end)it.end=clock24((hm(it.end)+720)%1440)}}
      else if(a.need==="days"){const d=recurring(v.includes("every")||dayNames(v).length>1?v:"every "+v)||null,dt=d?null:dateWords(v);if(d){it.days=d;it.date=null}else if(dt){it.date=dt}else left.push(a)}
      else if(a.need==="time"){const w=whenOf(/\d/.test(v)&&!/at|from/.test(v)?"at "+v:v);if(w.start){it.start=w.start;it.end=w.end||clock24(hm(w.start)+(w.dur||60));const ap=ampmGuess(v,it);if(ap==="pm"){it.start=clock24(hm(it.start)+720);it.end=clock24(hm(it.end)+720)}}else left.push(a)}});
    D_.asks=left;D_.questions=left.map(a=>a.q);sfx("ok");render();return}
  const ta=document.getElementById("dumpText");if(ta){ta.value=((ta.value||D_.text||"").trim()+"\n"+ans.map(([q,a])=>`${q} ${a}`).join("\n")).trim()}D_.questions=[];runDump()}

document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.dataset?.qa!==undefined){e.preventDefault();qSend()}});

const WKID=id=>/^(e|a|exp|act)\d+$|^proj$|^st\d+_\d+$/.test(id);
const WK=()=>S.wk||(S.wk={});
function fixWork(){if(S.work&&!Array.isArray(S.work)){const ph=[],wk={};Object.entries(S.work).forEach(([k,v])=>{if(/^\d+$/.test(k)&&v&&v.id)ph.push(v);else if(k.includes("|")&&v&&v.st)wk[k]=v});S.wk={...wk,...(S.wk||{})};S.work=ph}}
const wkOf=(k,id)=>{const w=WK()[k+"|"+id];if(w)return w;const t=S.tasks[k]?.[id];return t?{st:"done",done:t}:null};
function wkTitle(u,id,text){if(u.c?.p){const [,x]=pkFind(u,id);if(x)return x.title}if(id==="proj"&&u.c?.proj)return u.c.proj[0];const m=/^(exp|act)(\d+)$/.exec(id);if(m){const s=(m[1]==="exp"?u.c?.exp:u.c?.act)?.[+m[2]];if(s)return s.split(":")[0].slice(0,70)}return text}
function workCtl(u,id,text){const w=wkOf(u.k,id),st=w?.st==="planned"?null:w?.st,ty=wType(u,id),t=esc(wkTitle(u,id,text)),a=(to,l,cls)=>`<button class="${cls==="link"?"link xs":"btn xs "+cls}" data-act="wkst" data-k="${u.k}" data-id="${id}" data-to="${to}" data-t="${t}">${l}</button>`;
  const s=st==="done"?"done":st==="started"?"going":st==="skip"?"skip":"none",line=st==="done"?`Completed ${fmt(w.done)}${w.started&&w.started!==w.done?` · started ${fmt(w.started)}`:""} ✓`:st==="started"?`Ongoing · started ${fmt(w.started)}`:st==="skip"?"Not doing this":"Not started";
  return `<div class="wkctl ${st||""}"><span class="xs"><b>${esc(line)}</b>${qTag(ty,u,id,s)}</span><div class="row" style="gap:6px;flex-wrap:wrap">${st==="done"?a("undo","Undo","link"):st==="skip"?a("none","Undo","link"):st==="started"?a("done","Mark finished","accent")+a("none","Clear","link")+qCtl(ty,u,id,s):qCtl(ty,u,id,s)+a("started","Mark started","soft")+a("done","Finished","accent")+a("skip","Not doing this","link")}</div></div>`}
function quizBtns(k,n,i,q){const r=S.quiz?.[k+"|"+n]?.[i]?.r,b=(v,l)=>`<button class="btn xs ${r===v?(v?"accent":"soft"):""}" aria-pressed="${r===v}" data-act="qz" data-k="${k}" data-n="${n}" data-i="${i}" data-r="${v}" data-q="${esc(q.q)}" data-a="${esc(q.a)}">${l}</button>`;return `<div class="row" style="gap:6px;margin:4px 0 8px">${b(1,"Got it")}${b(0,"Not yet")}</div>`}
const padKey=p=>"dk-pad-"+(ACC||"guest")+"-"+p;
function ansHtml(it,v,pad){try{return ansHtml_(it,v,pad)}catch(e){return `<p class="sm">${esc(typeof v==="object"?JSON.stringify(v):String(v))}</p>`}}
function ansHtml_(it,v,pad){const no=`<p class="xs muted">Not answered</p>`,ok=b=>b?` <span class="fok">✓</span>`:` <span class="fno">✗</span>`;
  if(it.t==="draw"){const im=pad&&lsGet(padKey(pad));return im?`<img class="fimg" src="${im}" alt="Drawing">`:v?`<p class="sm">Drawn on paper ✓</p>`:no}
  if(v===undefined||v===""||(typeof v==="object"&&!Object.keys(v).length))return no;
  if(it.t==="mcq")return `<p class="sm"><b>${esc(it.opts[v]??"")}</b>${ok(v===it.a)}${v!==it.a?` <span class="xs muted">Ours: ${esc(it.opts[it.a])}</span>`:""}</p>`;
  if(it.t==="fill")return `<p class="sm"><b>${[].concat(v).map(x=>esc(x||"—")).join(" · ")}</b> <span class="xs muted">Ours: ${esc(it.a.join(" · "))}</span></p>`;
  if(it.t==="write")return `<p class="sm fans">${esc(v).replace(/\n/g,"<br>")}</p>`;
  if(it.t==="table")return `<table class="ftab"><tr>${it.cols.map(c=>`<th>${esc(c)}</th>`).join("")}</tr>${Array.from({length:it.rows},(_,r)=>`<tr>${it.cols.map((_,ci)=>`<td>${esc(v[r+"."+ci]??(ci===0&&it.prefill?it.prefill[r]||"":""))}</td>`).join("")}</tr>`).join("")}</table>`;
  if(it.t==="sort")return `<ul class="sm">${it.cats.map((c,ci)=>`<li><b>${esc(c)}:</b> ${it.items.filter(z=>v[z]===ci).map(esc).join(", ")||"—"}</li>`).join("")}</ul>`;
  if(it.t==="match")return `<ul class="sm">${it.pairs.map(([l,r])=>`<li>${esc(l)} → <b>${esc(v[l]??"—")}</b>${v[l]!==undefined?ok(v[l]===r):""}</li>`).join("")}</ul>`;
  return `<p class="sm">${esc(JSON.stringify(v))}</p>`}
function folderData(){const keys=new Set([...S.log.map(l=>l.key),...Object.keys(S.ans||{}).map(k=>k.split("#")[0]),...Object.keys(S.quiz||{}).map(k=>k.slice(0,k.lastIndexOf("|"))),...Object.keys(WK()).map(k=>k.slice(0,k.lastIndexOf("|"))),...Object.keys(S.tasks||{}).map(k=>k.split("#")[0])]),out=[];
  [...keys].map(unitByK).filter(Boolean).forEach(u=>{const P=u.c?.p,ws=[],qz=[],pj=[];
    const addWs=(k,title,tier,W)=>{const c=wsCount(k,W);if(!c.ans&&!taskDone(k,"ws"))return;ws.push({k,title,tier,W,...c,fin:S.tasks[k]?.ws||""})};
    (P?.worksheets||[]).forEach(w=>addWs(u.k+"#"+w.id,w.title,w.tier,w.sections));if(u.c?.x?.wsd)addWs(u.k,"Chapter worksheet","",u.c.x.wsd);
    Object.entries(S.quiz||{}).forEach(([k,q])=>{if(k.slice(0,k.lastIndexOf("|"))!==u.k)return;const n=+k.slice(k.lastIndexOf("|")+1),its=Object.entries(q).sort((a,b)=>a[0]-b[0]).map(([,x])=>x);if(its.length)qz.push({n,its,d:its.map(x=>x.d).sort().pop()})});qz.sort((a,b)=>a.n-b.n);
    const ids=new Set([...Object.keys(WK()).filter(k=>k.slice(0,k.lastIndexOf("|"))===u.k).map(k=>k.slice(k.lastIndexOf("|")+1)),...Object.keys(S.tasks[u.k]||{}).filter(WKID)]);
    ids.forEach(id=>{const w=wkOf(u.k,id);if(w)pj.push({id,title:w.title||wkTitle(u,id,id),...w})});
    if(ws.length||qz.length||pj.length)out.push({u,ws,qz,pj})});
  return out.sort((a,b)=>SUBJ_KEYS.indexOf(a.u.subj)-SUBJ_KEYS.indexOf(b.u.subj)||a.u.level-b.u.level||(a.u.n||0)-(b.u.n||0))}
function folderBody(F,flat){if(!F.length)return `<p class="note">Nothing here yet. Finished worksheets, quiz answers and projects collect here as you go.</p>`;
  return F.map(({u,ws,qz,pj},ci)=>{const inner=`${ws.map(w=>`<div class="fws"><h4>${esc(w.title)}${w.tier?` <span class="xs muted">(${esc(TIER[w.tier]||"")})</span>`:""}</h4><p class="xs muted">${w.fin?"Finished "+fmt(w.fin):"In progress"} · ${w.ans} of ${w.tot} answered</p>${w.W.map(([sn,its],si)=>`<p class="xs eyebrow">${esc(sn)}</p><ol class="fq">${its.map((it,ii)=>`<li><p class="sm">${esc(it.p)}</p>${ansHtml(it,A(w.k,si+"-"+ii),w.k+"|"+si+"-"+ii)}</li>`).join("")}</ol>`).join("")}</div>`).join("")}
    ${qz.map(q=>`<div class="fws"><h4>Quiz · Part ${q.n}</h4><p class="xs muted">${q.d?fmt(q.d)+" · ":""}${q.its.filter(x=>x.r).length} of ${q.its.length} got it</p><ol class="fq">${q.its.map(x=>`<li><p class="sm"><b>${esc(x.q)}</b> ${x.r?`<span class="fok">Got it</span>`:`<span class="fno">Not yet</span>`}</p><p class="xs muted">${esc(x.a)}</p></li>`).join("")}</ol></div>`).join("")}
    ${pj.length?`<div class="fws"><h4>Activities, experiments and projects</h4><ul class="sm">${pj.map(p=>`<li><b>${esc(p.title)}</b> · ${p.st==="done"?`finished ${fmt(p.done)}${p.started&&p.started!==p.done?`, started ${fmt(p.started)}`:""}`:p.st==="started"?`started ${fmt(p.started)}, not finished`:`in the pipeline since ${fmt(p.planned)}`}</li>`).join("")}</ul></div>`:""}`;
    const head=esc(chT(u)),meta=`${esc(SUBJ[u.subj])} · ${[ws.length&&ws.length+" worksheet"+(ws.length>1?"s":""),qz.length&&qz.length+" quiz"+(qz.length>1?"zes":""),pj.length&&pj.length+" project"+(pj.length>1?"s":"")].filter(Boolean).join(" · ")}`;
    return flat?`<section><h3>${head}</h3><p class="xs muted">${meta}</p>${inner}</section>`:`<details class="card fch" ${ci===0?"open":""}><summary><b>${head}</b><br><span class="xs muted">${meta}</span></summary>${inner}</details>`}).join("")}
function folderView(){document.getElementById("sheetTitle").textContent="Work folder";const F=folderData();
  return `<p class="sm muted">Every worksheet with your child's answers, every quiz, and every project with its dates. Read it here any time, or save a copy.</p><div class="row" style="gap:10px;flex-wrap:wrap"><button class="btn accent sm" data-act="fsave" ${F.length?"":"disabled"}>Save a copy (.html)</button><button class="btn soft sm" data-act="fprint" ${F.length?"":"disabled"}>Print or save as PDF</button></div><p class="xs muted">Drawings made on screen are kept on this device.</p>${folderBody(F,false)}`}
function folderDoc(F0){const F=F0||folderData(),who=S.child||"My child";return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(who)} · DeepKids work folder</title><style>body{font:15px/1.5 system-ui,sans-serif;color:#2b2340;max-width:760px;margin:24px auto;padding:0 16px}h1{font-size:24px}h3{margin:28px 0 2px;font-size:19px;border-top:2px solid #eee;padding-top:16px}h4{margin:14px 0 2px}.xs{font-size:12px}.sm{font-size:14px}.muted{color:#776f8a}.eyebrow{font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin:10px 0 2px}ol,ul{padding-left:22px}li{margin:6px 0}p{margin:2px 0}.fok{color:#2e6b45;font-weight:700}.fno{color:#a0522d;font-weight:700}.fimg{max-width:320px;border:1px solid #ddd;border-radius:8px}table{border-collapse:collapse;font-size:13px}td,th{border:1px solid #ccc;padding:4px 8px;text-align:left}.fans{background:#f6f3ee;padding:6px 10px;border-radius:8px}</style></head><body><h1>${esc(who)}'s work folder</h1><p class="muted">DeepKids · saved ${esc(fmt(today))}</p>${folderBody(F,true)}</body></html>`}
async function folderSave(){return saveDoc(folderDoc(),`DeepKids work folder ${today}.html`)}
function folderPrint(){printDoc(folderDoc())}

const quizList=(k,n,Q)=>`<ol class="sm qzl">${Q.map((q,qi)=>`<li><b>${esc(q.q)}</b><details><summary class="xs muted">Answer</summary><p class="sm">${esc(q.a)}</p></details>${quizBtns(k,n,qi,q)}</li>`).join("")}</ol>${(u=>u?stateCtl("qz",u,"q"+n):"")(unitByK(k))}`;
function wsCount(k,W){let tot=0,ans=0;W.forEach(([_,its],si)=>its.forEach((it,ii)=>{tot++;const v=A(k,si+"-"+ii);if(v!==undefined&&v!==""&&!(typeof v==="object"&&!Object.keys(v).length))ans++}));return {tot,ans}}
function refParts(u,id){const P=u.c?.p;if(!P)return [];return P.days.filter(d=>d.steps.some(s=>s.ref===id)).map(d=>d.n)}
function openWork(){const seen=new Set([...S.log.map(l=>l.key),...Object.keys(S.progress||{}).filter(k=>(S.progress[k].sessions||0)>0)]),us=[...seen].map(unitByK).filter(Boolean),O={wsGoing:[],wsMissed:[],going:[],finish:[],soon:[],started:[],planned:[]},held=new Set();
  us.forEach(u=>{const P=u.c?.p,dn=done(u.k);
    (P?.worksheets||[]).forEach(w=>{const k=u.k+"#"+w.id;if(taskDone(k,"ws"))return;const c=wsCount(k,w.sections);if(c.ans>0)O.wsGoing.push({u,w,...c});else if((w.day||99)<=dn)O.wsMissed.push({u,w,...c})});
    if(u.c?.x?.wsd&&!taskDone(u.k,"ws")){const c=wsCount(u.k,u.c.x.wsd);if(c.ans>0)O.wsGoing.push({u,w:{id:"",title:"Chapter worksheet",tier:""},...c})}
    [...(P?.experiments||[]),...(P?.activities||[])].forEach(e=>{const R=refParts(u,e.id);if(R.length<2||taskDone(u.k,e.id)||["planned","skip"].includes(WK()[u.k+"|"+e.id]?.st))return;const a=R[0],z=R[R.length-1];if(a<=dn&&dn<z){O.going.push({u,e,a,z,next:R.find(r=>r>dn)});held.add(u.k+"|"+e.id)}else if(dn>=z){O.finish.push({u,e,a,z});held.add(u.k+"|"+e.id)}})});
  Object.entries(WK()).forEach(([key,w])=>{if(held.has(key)||w.st==="done")return;const j=key.lastIndexOf("|"),u=unitByK(key.slice(0,j));if(!u)return;const x={u,id:key.slice(j+1),w};if(w.st==="started")O.started.push(x);else if(w.st==="planned")O.planned.push(x)});
  S.subjects.forEach(s=>schedule(s,28).forEach(x=>{const P=x.u.c?.p;if(!P)return;[...(P.experiments||[]),...(P.activities||[])].forEach(e=>{const R=refParts(x.u,e.id);if(R.length>=2&&R[0]===x.n&&!taskDone(x.u.k,e.id)&&!WK()[x.u.k+"|"+e.id])O.soon.push({u:x.u,e,date:x.date,n:x.n,z:R[R.length-1],prep:(pkDay(x.u,x.n).prep||[])})})}));
  O.soon.sort((a,b)=>a.date<b.date?-1:1);return O}
const openCount=()=>{const O=openWork();return O.wsGoing.length+O.wsMissed.length+O.going.length+O.finish.length+O.started.length+O.planned.length+(S.exps||[]).filter(e=>!e.closed).length};
function todoView(){document.getElementById("sheetTitle").textContent="To finish";const O=openWork(),ex=(S.exps||[]).filter(e=>!e.closed),wsRow=(x,miss)=>`<div class="pk"><span class="eyebrow">${esc(chT(x.u))} · ${esc(SUBJ[x.u.subj])}</span><b>${esc(x.w.title)}${x.w.tier?` <span class="xs muted">(${esc(TIER[x.w.tier]||"")})</span>`:""}</b><p class="xs muted">${miss?`Planned for Part ${x.w.day}, which you've done · not started`:`${x.ans} of ${x.tot} questions answered`}</p><div class="row"><button class="btn accent sm" data-act="ws" data-k="${x.u.k}" ${x.w.id?`data-w="${esc(x.w.id)}"`:""}>${miss?"Start it":"Continue"}</button></div></div>`;
  const sec=(t,n,body,empty)=>`<section class="sec"><div class="sech"><h3 style="font-size:18px">${t}</h3><span class="pill">${n}</span></div>${n?body:`<p class="xs muted">${empty}</p>`}</section>`,wkRow=x=>`<div class="pk"><span class="eyebrow">${esc(chT(x.u))} · ${esc(SUBJ[x.u.subj])}</span><b>${esc(x.w.title||wkTitle(x.u,x.id,""))}</b>${taskLine(x.u,x.id,x.w.title)}<div class="row"><button class="link xs" data-act="chapter" data-k="${x.u.k}" data-t="lab">Open in the chapter</button></div></div>`;
  let h=`<p class="sm muted">Everything left open, in one place. Tick things off where they are, or open them from here.</p><button class="link" data-act="folder" style="justify-self:start">Work folder: everything finished, with answers →</button>`;
  h+=sec("Worksheets started",O.wsGoing.length,O.wsGoing.map(x=>wsRow(x,false)).join(""),"None half-done.");
  h+=sec("Worksheets missed",O.wsMissed.length,O.wsMissed.map(x=>wsRow(x,true)).join(""),"No worksheets left behind from finished parts.");
  h+=sec("Projects underway",O.going.length+O.started.length+ex.length+O.finish.length,[...O.started.map(wkRow),...O.going.map(x=>`<div class="pk"><span class="eyebrow">${esc(chT(x.u))} · Parts ${x.a}–${x.z}</span><b>${esc(x.e.title)}</b><p class="xs muted">Runs from Part ${x.a}. Next check-in: Part ${x.next}.</p>${taskLine(x.u,x.e.id,x.e.title)}</div>`),...O.finish.map(x=>`<div class="pk"><span class="eyebrow">${esc(chT(x.u))} · Parts ${x.a}–${x.z}</span><b>${esc(x.e.title)}</b><p class="xs muted">All its parts are done. Mark it finished when the result is recorded.</p>${taskLine(x.u,x.e.id,x.e.title)}</div>`),...ex.map(e=>{const day=Math.round((parse(today)-parse(e.start))/864e5)+1,c=e.checks.includes(today);return `<div class="pk"><span class="eyebrow">Tracking daily · day ${day}</span><b>${esc(e.title)}</b><p class="xs muted">${esc(e.topic||"")}${c?" · checked today":""}</p><div class="row"><button class="btn soft sm" data-act="check" data-e="${e.id}">${c?"Checked today ✓":"Check today"}</button><button class="link xs" data-act="close" data-e="${e.id}">Finish it</button></div></div>`})].join(""),"No projects running right now.");
  h+=sec("Your pipeline",O.planned.length,O.planned.map(wkRow).join(""),"Nothing saved for later. Tap “+ Pipeline” on any activity, experiment or project to keep it here.");
  h+=sec("Projects coming up",O.soon.length,O.soon.map(x=>`<div class="pk"><span class="eyebrow">${esc(fmt(x.date))} · ${esc(chT(x.u))} · ${x.z>x.n?`Parts ${x.n}–${x.z}`:`Part ${x.n}`}</span><b>${esc(x.e.title)}</b>${x.e.time?`<p class="xs muted">${esc(x.e.time)}</p>`:""}${x.e.need?.length?`<p class="xs"><b>Get ready:</b> ${x.e.need.map(esc).join(", ")}</p>`:""}${x.prep.map(q=>`<p class="xs"><b>Prep (${esc(q.when)}):</b> ${esc(q.task)}</p>`).join("")}${taskLine(x.u,x.e.id,x.e.title)}</div>`).join(""),"Nothing multi-part starts in the next four weeks.");
  return h}
function splitSent(t){const out=[];let cur="",q=null;for(let i=0;i<t.length;i++){const c=t[i],p=t[i-1]||" ",n=t[i+1]||" ";let closed=false;
    if(!q&&(c==="“"||(c==="'"&&/[\s:(—-]/.test(p)))){q=c==="“"?"”":"'"}else if(q&&(c===q||(q==="'"&&c==="’"))&&(q==="”"||/[\s.,!?;:)—-]/.test(n))){q=null;closed=true}
    cur+=c;const end=(!q&&!closed&&/[.!?]/.test(c))||(closed&&/[.!?]/.test(p))||(!q&&c===")"&&/[.!?]/.test(p));
    if(end&&/\s/.test(n)&&/[A-Z('‘“0-9]/.test(t[i+2]||"")){out.push(cur.trim());cur=""}}
  if(cur.trim())out.push(cur.trim());return out}
function fmtPts(text,plain){if(!text)return "";let t=String(text).replace(/\bDays (\d+)\s*(–|-|to|and)\s*(\d+)/g,"Parts $1$2$3").replace(/\bDay (\d+)\b/g,"Part $1").replace(/\bDo (Experiment|Activity) [ea]\d+(?:,? [^.]*?)?\.\s*/g,(m,k)=>`Use the ${k.toLowerCase()} card below. `).replace(/\bDo Worksheet ws\d+(?: \((core|stretch|challenge)\))?\.?/g,"Open the worksheet below.").replace(/\b(?:in |from )?Voice v\d+\b/g,"on the card below").replace(/\bthe ['‘]why['’] of [ea]\d+\b/gi,"'Why it happens' on the card below").replace(/\b(Experiment|Activity) [ea]\d+\b/g,(m,k)=>"the "+k.toLowerCase());
  const S=splitSent(t),items=[];S.forEach(x=>{if(/^\(.*\)\.?$/.test(x)&&items.length){items[items.length-1].ans=(items[items.length-1].ans?items[items.length-1].ans+" ":"")+x.replace(/^\(|\)\.?$/g,"");return}
    const m=x.match(/^(.*?['’”?])\s*\(([^()]+)\)\.?$/);if(m&&/^(Ask|['‘“])/.test(x)){items.push({t:m[1],ans:m[2]});return}items.push({t:x})});
  const ic=x=>plain?"p-pl":/^Ask:|\bask:\s*['‘“]|^['‘“]|[?]['’”]?$/i.test(x)?"p-ask":/^(Say|Tell|Explain)\b/.test(x)?"p-say":/^(Read|Open|Turn to|Look at)\b/.test(x)?"p-read":/^(If|Note|Be honest|Safety)/.test(x)?"p-note":"p-do";
  return `<ul class="pts">${items.map(x=>`<li class="${ic(x.t)}"><span>${esc(x.t)}</span>${x.ans?`<span class="ans"><b>Listen for:</b> ${esc(x.ans)}</span>`:""}</li>`).join("")}</ul>`}
let voxQ=[],voxDone=[],voxOn=false,voxPaused=false,voxCur="",_vv=null;
function pickVoice(){if(!("speechSynthesis" in window))return null;const V=speechSynthesis.getVoices();if(!V.length)return null;const fem=/female|woman|veena|heera|neerja|kajal|aditi|swara|lekha|priya|isha|google/i,male=/\bmale\b|rishi|ravi|prabhat|hemant|madhur|kumar/i,en=V.filter(v=>/en[-_]IN/i.test(v.lang));
  return en.find(v=>fem.test(v.name)&&!male.test(v.name))||en.find(v=>!male.test(v.name))||en[0]||V.find(v=>/^en/i.test(v.lang)&&/female|samantha|zira|susan|karen|moira|tessa/i.test(v.name))||V.find(v=>/^en/i.test(v.lang))||null}
if("speechSynthesis" in window)speechSynthesis.onvoiceschanged=()=>{_vv=null};
const voxRate=()=>S.voiceRate||0.8;
function speak(text){if(!("speechSynthesis" in window)){toast("Read-aloud isn't available on this phone's browser.");return}speechSynthesis.cancel();
  const parts=String(text).replace(/\s+/g," ").replace(/ ?([·•]) ?/g,". ").match(/[^.!?।:;]+[.!?।:;]*/g)||[];voxQ=parts.map(x=>x.trim()).filter(x=>x.length>1);voxDone=[];voxOn=!!voxQ.length;voxPaused=false;voxNext();voxBar()}
function voxNext(){if(!voxOn||voxPaused)return;const t=voxQ.shift();if(!t){voxOn=false;voxBar();return}voxCur=t;voxDone.push(t);const u=new SpeechSynthesisUtterance(t),v=_vv||(_vv=pickVoice());u.lang=v?.lang||"en-IN";if(v)try{u.voice=v}catch(e){}u.rate=voxRate();u.pitch=1.05;
  u.onend=()=>{if(voxCur===t)setTimeout(voxNext,S.voiceGap??450)};u.onerror=()=>{if(voxCur===t&&!voxPaused)setTimeout(voxNext,50)};speechSynthesis.speak(u);voxBar()}
function voxCtl(c){if(c==="stop"){voxOn=false;voxQ=[];voxPaused=false;voxCur="";speechSynthesis.cancel();voxBar();return}
  if(c==="pause"){if(!voxPaused){voxPaused=true;if(voxDone.length)voxQ.unshift(voxDone.pop());voxCur="";speechSynthesis.cancel()}else{voxPaused=false;voxNext()}voxBar();return}
  if(c==="back"){const cur=voxDone.pop(),prev=voxDone.pop();if(cur)voxQ.unshift(cur);if(prev)voxQ.unshift(prev);voxCur="";speechSynthesis.cancel();voxPaused=false;voxNext();return}
  if(c==="skip"){voxCur="";speechSynthesis.cancel();voxPaused=false;voxNext();return}
  if(c==="slower"||c==="faster"){S.voiceRate=Math.round(Math.min(1.3,Math.max(0.5,voxRate()+(c==="faster"?0.1:-0.1)))*10)/10;save();if(voxOn&&!voxPaused){if(voxDone.length)voxQ.unshift(voxDone.pop());voxCur="";speechSynthesis.cancel();voxNext()}voxBar()}}
function voxBar(){let b=document.getElementById("voxbar");if(!voxOn&&!voxPaused){if(b)b.remove();return}if(!b){b=document.createElement("div");b.id="voxbar"}const host=sheet.open?sheet:document.body;if(b.parentNode!==host)host.appendChild(b);
  b.innerHTML=`<span class="vt">${voxPaused?"Paused":"Reading"} · ${voxRate().toFixed(1)}×</span><button data-vox="back" aria-label="Repeat the last sentence">⏮</button><button data-vox="pause" aria-label="${voxPaused?"Resume":"Pause"}">${voxPaused?"▶":"⏸"}</button><button data-vox="skip" aria-label="Next sentence">⏭</button><button data-vox="slower" aria-label="Slower">🐢</button><button data-vox="faster" aria-label="Faster">🐇</button><button data-vox="stop" aria-label="Stop reading">✕</button>`}
document.addEventListener("click",e=>{const b=e.target.closest("[data-vox]");if(b){e.preventDefault();e.stopPropagation();voxCtl(b.dataset.vox)}},true);
function readable(el){if(!el)return "";const c=el.cloneNode(true);c.querySelectorAll(".spent,.secbar,.kind,button,.ptrack,svg,.tasks-inline,summary,.xs.muted,#voxbar,.readbtn").forEach(x=>x.remove());c.querySelectorAll("h1,h2,h3,p,li,.ask,.src b,.src span,.eyebrow,.idea,.kv span,.kv b").forEach(x=>x.append(" ¶ "));return (c.textContent||"").replace(/\s*¶\s*/g,". ").replace(/([.!?:;])\s*\.\s/g,"$1 ").replace(/\.\s*\./g,".").replace(/[📖✨🔊]/g,"").replace(/\s+/g," ").trim()}
function readNow(){if(sheet.open){const st=document.querySelector("#sheetBody .stage");if(st)return speak(readable(st));return speak(document.getElementById("sheetTitle").textContent+". "+readable(document.getElementById("sheetBody")))}speak(readable(document.getElementById("main")))}
function autoRead(){if(S.autoRead&&sheet.open&&ui.sheet?.mode==="player")setTimeout(()=>{const st=document.querySelector("#sheetBody .stage");if(st)speak(readable(st))},250)}
function isNextUp(u){return ((S.next||{})[u.subj]||[])[0]===u.k}
function nextMsg(s,k){_sess=null;const sc=schedule(s,60)[0],u=unitBy(k);if(sc&&sc.u.k===k)return sc.date===today?`Done. Today's ${SUBJ[s]} lesson is now ${chT(sc.u)}, Part ${sc.n} of ${sc.tot}.`:`Done. ${chT(sc.u)} is your next ${SUBJ[s]} lesson, on ${fmt(sc.date)}.`;return `Done. ${chT(u)} is now first in the ${SUBJ[s]} queue.`}

const ACTN={read:"reading",talk:"talking",think:"thinking",warmup:"warm-up",do:"activity",act:"activity",outdoor:"outdoor activity",exp:"experiment",ws:"worksheet",check:"quiz",review:"review",game:"game",watch:"video"};
function srcOf(s){const t=(s.title||"")+" · "+(s.do||""),m=[...t.matchAll(/\b(?:pages?|pp?\.?)\s?(\d{1,3})(?:\s*(?:–|-|to|and)\s*(\d{1,3}))?/gi)],raw=[...new Set(m.map(x=>x[2]?x[1]+"–"+x[2]:x[1]))],rng=raw.filter(p=>p.includes("–")).map(p=>p.split("–").map(Number)),pages=raw.filter(p=>p.includes("–")||!rng.some(([a,b])=>+p>=a&&+p<=b));return {book:(pages.length>0||/\bthe book['’]s\b|\bActivity \d+\.\d+|\bin the book\b|\bLearner['’]s Book\b/i.test(t))&&!/\bwithout the book\b/i.test(t),pages}}
function srcLine(s){const {book,pages}=srcOf(s),a=ACTN[s.kind]||"step",pg=pages.length?` · page${pages.length>1||pages[0].includes("–")?"s":""} ${pages.join(", ")}`:"";
  return book?`<div class="src book"><b>📖 Book step${pg}</b><span>Open the textbook now${pages.length?" at "+(pages.length>1||pages[0].includes("–")?"these pages":"this page"):""}.</span></div>`:`<div class="src dk"><b>✨ DeepKids step · ${a}</b><span>Book closed for this one. Everything is on this screen.</span></div>`}
function chT(u){if(!u)return "";const pre=u.board==="waldorf"?(u.subj==="wart"?"":"Block "+u.n):u.board==="ncert"?"Ch "+u.n:u.board==="cambridge"?(/^\d+$/.test(u.n)?"Unit "+u.n:""):u.board==="nios"?"Lesson "+u.n:u.board==="dk"?u.n:"";return (pre?pre+" · ":"")+u.title}
let stepT=null;const stepKeyNow=()=>ui.sheet?.mode==="player"?ui.sheet.k+"|"+ui.sheet.n+"|"+ui.sheet.i:"";
function stepSecs(){const k=stepKeyNow();if(!k)return 0;if(!stepT||stepT.k!==k)stepT={k,t0:Date.now()};return (Date.now()-stepT.t0)/1000}
setInterval(()=>{const e=document.getElementById("spent");if(e&&sheet.open)e.textContent=mmss(stepSecs())},1000);

const SECS=[["book","The lesson"],["ideas","Big ideas"],["lab","Try it"],["views","Other views"],["ws","Worksheet"],["quiz","Quick quiz"]],SECN=Object.fromEntries(SECS);
function stepSec(u,s){const [g]=s.ref?pkFind(u,s.ref):[];if(g==="worksheets")return "ws";if(g==="voices")return "views";if(g==="experiments"||g==="activities")return "lab";
  if(s.kind==="check"||s.kind==="review")return "quiz";if(s.kind==="ws")return "ws";if(s.kind==="think")return "ideas";if(["exp","act","game","outdoor"].includes(s.kind))return "lab";if(s.kind==="do")return /page/i.test(s.do)?"book":"lab";return "book"}
function secBar(st,i){const ord=SECS.map(s=>s[0]),G=[];st.forEach((x,j)=>{const s=x.sec||"book";let g=G.find(g=>g.s===s);if(!g)G.push(g={s,first:j,n:0,ok:0});g.n++;if(x.ok)g.ok++});G.sort((a,b)=>ord.indexOf(a.s)-ord.indexOf(b.s));const cur=i>=st.length?"fin":(st[i].sec||"book");
  return `<div class="secbar">${G.map((g,k)=>`<button class="secchip ${g.s===cur?"on":""} ${g.ok===g.n?"ok":""}" data-act="pjump" data-i="${g.first}"><span class="n">${g.ok===g.n?"✓":k+1}</span><span class="l">${SECN[g.s]}</span><small>${g.ok}/${g.n}</small></button>`).join("")}<button class="secchip ${cur==="fin"?"on":""}" data-act="pjump" data-i="${st.length}"><span class="n">★</span><span class="l">Finish</span></button></div>`}
function historyView(){document.getElementById("sheetTitle").textContent="Everything done";const L=S.log.filter(l=>l.kind!=="free"||l.title);if(!L.length)return `<p class="note">Lessons you finish are listed here, newest first, with the time and day of the chapter.</p>`;
  const by={};L.forEach(l=>(by[l.date]=by[l.date]||[]).push(l));const dates=Object.keys(by).sort().reverse(),chs=new Set(L.map(l=>l.key));
  return `<p class="sm muted">${L.length} lesson${L.length===1?"":"s"} across ${chs.size} chapter${chs.size===1?"":"s"} and ${dates.length} day${dates.length===1?"":"s"}. Tap any to open the chapter.</p>`+dates.map(d=>`<section class="card" style="gap:0"><span class="eyebrow">${d===today?"Today · ":d===addDays(today,-1)?"Yesterday · ":""}${esc(fmt(d))}</span>${by[d].slice().sort((a,b)=>(a.at??9999)-(b.at??9999)).map(l=>{const u=unitByK(l.key);return `<button class="plain hrow" ${u?`data-act="chapter" data-k="${esc(l.key)}"`:""}><span class="t num">${l.at!=null?clock(l.at):"–"}</span><span style="min-width:0"><b>${esc(u?chT(u):l.title)}</b><br><span class="xs muted">${esc(SUBJ[l.subj]||"")}${l.n?" · Part "+l.n+(u?" of "+sessionsFor(u):""):""}${u?" · "+esc(unitLabel(u).split(" · ")[0]):""}</span></span>${u?icon("next"):""}</button>`}).join("")}</section>`).join("")}

function refreshView(){const date=ui.sheet.date||today,it=dayPlan(date).find(i=>i.id==="refresh");document.getElementById("sheetTitle").textContent="Refresher";
  if(!it)return `<p class="note">No refresher today. It starts the day after your first lesson, and follows the refresher settings.</p><button class="link" data-act="rfset">Refresher settings and lists →</button>`;
  const r=it.rf;if(date===today&&!S.rfp?.[date]){S.rfp={...(S.rfp||{}),[date]:r};save()}const ra=S.rfa?.[date]||{};
  return `<p class="sm muted">About ${r.mins} minutes, from: ${r.topics.map(t=>`<b>${esc(unitByK(t.k)?.title||"")}</b> (${MGN[t.g]})`).join(", ")}.</p>`+r.slots.map((s,i)=>{const u=unitByK(s.k);return `<section class="card"><span class="eyebrow">${i+1} · ${RTN[s.ty]} · ${esc(u?chT(u):"")}</span>${s.ty==="qz"?qCard(s.q,ra[s.q.id]):`<b style="font:600 17px var(--display)">${esc(s.title)}</b>${s.body?fmtPts(s.body):""}${s.words?.length?`<div class="kv">${s.words.map(([w,m])=>`<span>${esc(w)}</span><b style="font-weight:400">${esc(m)}</b>`).join("")}</div>`:""}${s.need?.length?`<p class="sm"><b>You need:</b> ${s.need.map(esc).join(", ")}</p>`:""}${s.steps?.length?pkList(s.steps,"ol"):""}${s.ask?`<div class="ask">${esc(s.ask)}</div>`:""}`}</section>`}).join("")+
   `<div class="row"><button class="btn green wide" data-act="tlcheck" data-id="refresh" data-date="${date}">${icon("check")}${it.done?"Done ✓":"We did it"}</button></div><button class="link" data-act="rfset">Refresher settings and lists →</button>`}
function plusFor(u){const ids=new Set([...(u.dk||[]),...(DATA.rconcepts||[]).filter(c=>c.chapters.includes(u.k)).flatMap(c=>c.plus||[])]);if(u.board==="dk")ids.delete(u.n);return [...ids].map(id=>DATA.topics.find(t=>t.id===id)).filter(Boolean).slice(0,3)}
const hubSec=(id,title,count,body,open)=>body?`<details class="card hub" ${open?"open":""}><summary><b>${title}</b>${count!=null?`<span class="pill">${count}</span>`:""}</summary><div class="hubb">${body}</div></details>`:"";
function chapterHub(u){const P=u.c?.p,x=u.c?.x,c=u.c||{},plus=plusFor(u),res=resSort(resourcesFor(u)),shelf=shelfFor(u);let h=`<div class="sech" style="margin-top:6px"><h3 style="font-size:19px">Everything for this chapter</h3></div>`;
  const ideas=[P?`<p class="sm">${esc(P.summary)}</p>`:c.covers?`<p class="sm">${esc(c.covers)}</p>`:"",P?.goals?.length?`<span class="eyebrow">By the end your child can</span>${pkList(P.goals.map(g=>g.replace(/^By the end your child can\s*/i,"")))}`:"",x?.learn?`<span class="eyebrow">Big ideas</span>${x.learn.map((l,i)=>`<div class="idea"><span class="k">${i+1}</span><p class="sm">${esc(l)}</p></div>`).join("")}`:"",P?.words?.length?`<span class="eyebrow">Key words</span><div class="kv">${P.words.map(([w,m])=>`<span>${esc(w)}</span><b style="font-weight:400">${esc(m)}</b>`).join("")}</div>`:""].join("");
  h+=hubSec("ideas","Big ideas and key words",null,ideas,false);
  const pv=[...plus.map(t=>`<div class="pk"><span class="eyebrow">DeepKids Plus · ${esc(t.id)}</span><b>${esc(t.name)}</b><p class="sm">${esc(t.summary)}</p>${t.oneness?`<div class="ask"><span class="eyebrow">Wonder together</span>${esc(t.oneness)}</div>`:""}</div>`),...(x?.deep||[]).map(d=>`<div class="pk"><span class="eyebrow">Big question</span><b>${esc(d.q)}</b><p class="sm">${esc(d.why)}</p>${(d.views||[]).map(([w,v])=>`<p class="sm"><b>${esc(w)}:</b> ${esc(v)}</p>`).join("")}${d.tryit?`<p class="sm"><b>Try this:</b> ${esc(d.tryit)}</p>`:""}</div>`)].join("");
  h+=hubSec("plus","DeepKids view and big questions",plus.length+(x?.deep?.length||0)||null,pv,false);
  if(P?.voices?.length)h+=hubSec("voices","Other scientists and challenging views",P.voices.length,`<p class="xs muted">Some were laughed at and later proved right; some are still argued over; some turned out wrong.</p>${P.voices.map(pkVoice).join("")}`,false);
  const ws=[...(P?.worksheets||[]).map(w=>pkWs(u,w)),x?.wsd?`<div class="pk"><span class="eyebrow">Chapter worksheet</span><b>${x.wsd.length} sections</b><div class="row"><button class="btn accent sm" data-act="ws" data-k="${u.k}">Open the worksheet</button></div></div>`:""].join("");
  h+=hubSec("ws","Worksheets",(P?.worksheets?.length||0)+(x?.wsd?1:0)||null,ws,false);
  const lab=[...(P?.experiments||[]).map(e=>pkExp(u,e)),...(P?.activities||[]).map(a=>pkAct(u,a)),...(!P?(c.exp||[]).map(e=>`<div class="pk"><span class="eyebrow">Experiment</span><p class="sm">${esc(e)}</p></div>`):[]),...(!P?(c.act||[]).map(e=>`<div class="pk"><span class="eyebrow">Activity</span><p class="sm">${esc(e)}</p></div>`):[]),c.game?`<div class="pk"><span class="eyebrow">Game</span><b>${esc(c.game[0])}</b><p class="sm">${esc(c.game[1])}</p></div>`:"",c.proj?`<div class="pk"><span class="eyebrow">Project</span><b>${esc(c.proj[0])}</b><p class="sm">${esc(c.proj[1])}</p></div>`:""].join("");
  h+=hubSec("lab","Experiments, activities and games",null,lab,false);
  const rs=[shelf.length?`<div class="sm"><b>From your shelf:</b> ${shelf.map(i=>esc(i.name)).join(" · ")}</div>`:"",...res.slice(0,ui.hubres?99:6).map(r=>`<a class="res" href="${esc(r.url)}" target="_blank" rel="noopener"><span class="xs muted">${RTYPE[r.type]} · ages ${r.ages[0]}–${r.ages[1]} · ${esc(r.source)} ↗</span><b>${esc(r.title)}</b><span class="xs">${esc(r.desc)}</span></a>`),res.length>6&&!ui.hubres?`<button class="link xs" data-act="hubres" style="justify-self:start">Show all ${res.length}</button>`:"",...(c.read||[]).map(r=>`<div class="res"><span class="xs muted">Book</span><b>${esc(r)}</b></div>`)].join("");
  h+=hubSec("res","Resources, books and your shelf",res.length+shelf.length+(c.read?.length||0)||null,rs,false);
  if(P)h+=hubSec("days","All parts of this chapter",P.days.length+" parts",packTab(u,"days"),false);
  if(P?.check?.length)h+=hubSec("check","End-of-chapter check",P.check.length,`<ol class="sm">${P.check.map(q=>`<li>${esc(q.q)}<details><summary class="xs muted">Answer</summary><p class="sm">${esc(q.a)}</p></details></li>`).join("")}</ol>`,false);
  if(x?.guide)h+=hubSec("guide","Parent guide",null,`<p class="sm">${esc(x.guide)}</p>`,false);
  return h}
function journeyChapters(){const last={};S.log.forEach(l=>{if(!last[l.key]||l.date>last[l.key])last[l.key]=l.date});Object.entries(S.progress||{}).forEach(([k,p])=>{if(!last[k])last[k]=p.updated||""});
  const us=Object.keys(last).map(k=>unitByK(k)).filter(Boolean),fin=us.filter(u=>rank[coverage(u)]>=2),going=us.filter(u=>coverage(u)==="learning"),by=(a,b)=>(last[b.k]||"")>(last[a.k]||"")?1:-1;
  if(!us.length)return `<section class="sec"><div class="sech"><h3>Chapters</h3></div><p class="note">Chapters you start and finish will be listed here, so you can open any of them again.</p></section>`;
  const row=u=>`<div class="topic ${SC(u.subj)}"><button class="plain trow" data-act="chapter" data-k="${u.k}"><span class="no">${/^\d+$/.test(u.n)?u.n:esc(u.n)}</span><span style="min-width:0"><b>${esc(u.title)}</b><br><span class="xs muted">${esc(unitLabel(u).split(" · ").slice(0,2).join(" · "))}${last[u.k]?" · last "+fmt(last[u.k]):""}${coverage(u)==="learning"?` · Part ${Math.min(done(u.k)+1,sessionsFor(u))} of ${sessionsFor(u)} next`:""}</span></span>${pillS(coverage(u))}</button></div>`;
  return `<section class="sec"><div class="sech"><h3>Chapters</h3><span class="xs muted">tap to open again</span></div>${(n=>`<button class="menurow" data-act="rem">${blob("var(--sun)",8,"happy","",'width="40" height="40"')}<span><b>Reminders</b><br><span class="xs muted">A nudge when there's free time and something is waiting</span></span>${icon("next")}</button><button class="menurow" data-act="told">${blob("var(--sky)",4,"happy","",'width="40" height="40"')}<span><b>What you've told us</b><br><span class="xs muted">Every routine, class, rest time, to-do and note you added</span></span>${icon("next")}</button><button class="menurow" data-act="track">${blob("var(--aqua)",6,"happy","",'width="40" height="40"')}<span><b>Tracking</b><br><span class="xs muted">Time each day and subject, and what was covered</span></span>${icon("next")}</button><button class="menurow" data-act="uploads">${blob("var(--gum)",9,"happy","",'width="40" height="40"')}<span><b>Uploads</b><br><span class="xs muted">Add photos and files; DeepKids files them by chapter</span></span>${icon("next")}</button><button class="menurow" data-act="school">${blob("var(--sun)",12,"happy","",'width="40" height="40"')}<span><b>Moving to a school</b><br><span class="xs muted">Full report by board and level, scores, transcript</span></span>${icon("next")}</button><button class="menurow" data-act="folder">${blob("var(--leaf)",14,"wow","",'width="40" height="40"')}<span><b>Work folder</b><br><span class="xs muted">Finished worksheets with answers, quizzes and projects. Save or print.</span></span>${icon("next")}</button><button class="menurow" data-act="todo">${blob("var(--tang)",11,"wow","",'width="40" height="40"')}<span><b>To finish</b><br><span class="xs muted">${n?n+" open: worksheets and projects":"Nothing left open"}</span></span>${icon("next")}</button>`)(openCount())}<button class="menurow" data-act="hist">${blob("var(--sky)",13,"calm","",'width="40" height="40"')}<span><b>Everything done, day by day</b><br><span class="xs muted">${S.log.length} lessons with times</span></span>${icon("next")}</button>
   ${going.length?`<span class="eyebrow">In progress · ${going.length}</span>${going.sort(by).map(row).join("")}`:""}
   ${fin.length?`<span class="eyebrow" style="margin-top:6px">Done · ${fin.length}</span>${fin.sort(by).slice(0,ui.jall?999:8).map(row).join("")}${fin.length>8&&!ui.jall?`<button class="link" data-act="jall" style="justify-self:start">Show all ${fin.length}</button>`:""}`:""}</section>`}

const BNAME={ncert:"NCERT",cambridge:"Cambridge",nios:"NIOS",waldorf:"Waldorf",dk:"DeepKids Plus",gen:"DeepKids"};
function unitLabel(u){if(!u)return "";const L=u.board==="ncert"||u.board==="waldorf"?"Class "+u.level:u.board==="cambridge"?"Stage "+u.level:u.board==="nios"?"Level "+(u.level<=3?"A":"B"):"";const n=u.board==="ncert"?"Ch "+u.n:u.board==="cambridge"?(/^\d+$/.test(u.n)?"Unit "+u.n:u.n):u.board==="nios"?"Lesson "+u.n:u.n;
  return `${BNAME[u.board]||""}${L?" "+L:""} · ${u.subj==="sci"?(u.board==="cambridge"?"Science":"EVS"):SUBJ[u.subj]||""} · ${n} ${u.title}`}
let _ubk=null;const unitByK=k=>{if(!_ubk){_ubk=new Map();allUnits().forEach(u=>_ubk.set(u.k,u))}return _ubk.get(k)||unitBy(k)};
function chapterRank(u){const mine=boardsOn().includes(u.board)?0:1,lv=S.levels?.[u.subj]||3;return mine*10+Math.abs((u.level||lv)-lv)}
function resChapters(r){const ks=new Set([...(r.chapters||[]),...r.concepts.flatMap(c=>RCON[c]?.chapters||[])]);return [...ks].map(unitByK).filter(Boolean).sort((a,b)=>chapterRank(a)-chapterRank(b))}
const chipK=u=>`<button class="chip xs" data-act="chapter" data-k="${esc(u.k)}">${esc(unitLabel(u))}</button>`;
function lessonExtras(u){const R=resSort(resourcesFor(u)).filter(rFits),pick=[],seen=new Set();for(const r of R){if(seen.has(r.type))continue;seen.add(r.type);pick.push(r);if(pick.length===3)break}const shelf=shelfFor(u);
  if(!pick.length&&!shelf.length)return "";
  return `<div class="extras">${shelf.length?`<div class="sm"><b style="font-family:var(--display)">From your shelf:</b> ${shelf.map(i=>esc(i.name)).join(" · ")}</div>`:""}${pick.length?`<div class="sm"><b style="font-family:var(--display)">Good extras for this chapter</b></div>${pick.map(r=>`<a class="res" href="${esc(r.url)}" target="_blank" rel="noopener"><span class="xs muted">${RTYPE[r.type]} · ${esc(r.source)} ↗</span><b>${esc(r.title)}</b></a>`).join("")}<button class="link xs" data-act="chapter" data-k="${u.k}" data-t="res" style="justify-self:start">All resources for this chapter</button>`:""}</div>`}
const shelfFor=u=>(S.inv||[]).filter(i=>(i.chapters||[]).includes(u.k)||(i.concepts||[]).some(c=>(RCON[c]?.chapters||[]).includes(u.k)));
function invCard(){const D_=ui.idump||{};return `<section class="card dump"><div class="row" style="flex-wrap:nowrap;gap:12px">${blob("var(--gum)",7,"wow","",'width="48" height="48"')}<div><h3 style="font-size:19px">Tell us what you have</h3><p class="xs muted">Type a list, say it with your keyboard's mic, or add photos of a shelf, book covers or game boxes. We sort it into books, games and more, and tag each to the chapters it helps with.</p></div></div>
   <textarea class="inp" id="invText" placeholder="Ruskin Bond's The Blue Umbrella, a magnifying glass, Ludo, Snakes and Ladders, a globe, Tinkle comics, a kids' microscope, 2 bar magnets">${esc(D_.text||"")}</textarea>
   <div class="row">${IMGOK?`<label class="btn soft sm" style="cursor:pointer">${icon("plus")}Photos<input type="file" id="invImg" accept="image/*" multiple hidden></label>`:lockBtn("shelf","btn soft sm","📷 Photos")}<span class="xs muted">${D_.files?.length?D_.files.length+" photo"+(D_.files.length>1?"s":"")+" added":""}</span><button class="btn sm" data-act="isort" style="margin-left:auto" ${D_.busy?"disabled":""}>${D_.busy?"Sorting…":"Sort it in"}</button></div>
   ${SAMPLE?"":`<p class="xs muted">Sorting lists and photos is part of DeepKids Plus. Add things one by one below.</p>`}${D_.err?`<p class="sm" style="color:var(--bad)">${esc(D_.err)}</p>`:""}
   ${D_.items?`<div class="col" style="gap:8px">${D_.items.map((it,i)=>`<div class="parsed ${it.keep?"":"off"}"><button class="ck ${it.keep?"on":""}" data-act="ikeep" data-i="${i}" aria-label="Keep">${icon("check")}</button><div style="min-width:0"><b style="font:600 16px var(--display)">${esc(it.name)}</b><p class="xs muted">${esc([CATS[it.cat]||"Other",it.by,it.kind,it.ages].filter(Boolean).join(" · "))}</p>${(it.chapters||[]).length?`<div class="row chips">${it.chapters.map(unitByK).filter(Boolean).slice(0,3).map(chipK).join("")}</div>`:""}</div></div>`).join("")}<div class="row"><button class="btn green" data-act="iadd">${icon("check")}Add ${D_.items.filter(x=>x.keep).length}</button><button class="btn line sm" data-act="iclear">Clear</button></div></div>`:""}</section>`}
function invContext(){const keys=[];S.subjects.forEach(s=>{const lv=S.levels[s];allUnits().filter(u=>u.subj===s&&["ncert","cambridge","nios"].includes(u.board)&&Math.abs(u.level-lv)<=1).forEach(u=>keys.push(`${u.k} = ${unitLabel(u)}`))});return keys.slice(0,260).join("\n")}
async function runInvSort(){const ta=document.getElementById("invText"),text=(ta?.value||"").trim(),D_=ui.idump=ui.idump||{};D_.text=text;
  if(!SAMPLE){D_.err="Smart sorting is part of DeepKids Plus. Use Add by hand for now.";return render()}if(!text&&!D_.files?.length){D_.err="Type something or add a photo first.";sfx("no");return render()}
  D_.busy=true;D_.err="";render();
  const prompt=`You help a parent in India who homeschools ${S.child||"their child"} (age ${S.age}). They told us what learning things they own${D_.files?.length?", and attached photos (a shelf, book covers, game boxes, toys or equipment). Read every title, author and brand you can see":""}.
List each separate thing once. For each give: "name" (the real title or product name, as printed), "cat" (book|game|electronics|equipment|tool|other), "by" (author, publisher or maker if known, else ""), "kind" (e.g. picture book, chapter book, comic, board game, card game, puzzle, kit, instrument), "ages" (e.g. "6–9" if known, else ""), "note" (one short line on what it is or how it helps learning), "chapters" (0–4 keys from the list below that it genuinely helps with), "concepts" (0–3 ids from: ${Object.keys(RCON).join(", ")}).
Only tag chapters and concepts that truly fit. Never invent a title you can't read; if unsure write what you see, e.g. "a blue science activity book".
Chapters (key = label):
${invContext()}
Reply with only JSON: {"items":[{"name":"","cat":"","by":"","kind":"","ages":"","note":"","chapters":[],"concepts":[]}]}
Message:
"""${text.slice(0,5000)}"""`;
  try{const opt={modelTier:"default",cache:false};if(D_.files?.length)opt.images=D_.files;const r=await SAMPLE.json(prompt,opt),valid=new Set(allUnits().map(u=>u.k));
    D_.items=(Array.isArray(r?.items)?r.items:[]).filter(x=>x&&x.name).map(x=>({name:String(x.name).slice(0,80),cat:CATS[x.cat]?x.cat:"other",by:String(x.by||"").slice(0,60),kind:String(x.kind||"").slice(0,40),ages:String(x.ages||"").slice(0,10),note:String(x.note||"").slice(0,160),chapters:(x.chapters||[]).filter(k=>valid.has(k)).slice(0,4),concepts:(x.concepts||[]).filter(c=>RCON[c]).slice(0,3),keep:true}));
    if(!D_.items.length)D_.err="We couldn't find anything in that. Try listing titles.";sfx(D_.items.length?"ok":"no")}
  catch(e){D_.err=({not_granted:"Claude wasn't allowed for this page, so we can't sort it.",rate_limited:"Too many requests just now. Try again in a minute.",image_rejected:"That photo couldn't be read. Try a different one.",invalid_json:"We couldn't read the answer. Try again.",images_unavailable:"Photos can't be sent from this view. Type it instead."})[e?.code]||"Something went wrong. Try again.";sfx("no")}
  D_.busy=false;render()}
function invItem(i){const ch=(i.chapters||[]).map(unitByK).filter(Boolean);return `<div class="invi"><div style="min-width:0"><b>${esc(i.name)}</b>${i.by||i.kind?`<span class="xs muted"> · ${esc([i.by,i.kind].filter(Boolean).join(" · "))}</span>`:""}${i.note?`<p class="xs muted">${esc(i.note)}</p>`:""}${ch.length?`<div class="row chips">${ch.slice(0,3).map(chipK).join("")}</div>`:(i.concepts||[]).length?`<p class="xs"><b>Idea:</b> ${i.concepts.map(c=>esc(RCON[c]?.concept||c)).join(" · ")}</p>`:""}</div><button class="plain" data-act="invdel" data-i="${i.id}" aria-label="Remove ${esc(i.name)}">${icon("close")}</button></div>`}
document.addEventListener("change",e=>{if(e.target.id==="invImg"){ui.idump=ui.idump||{};ui.idump.text=document.getElementById("invText")?.value||"";ui.idump.files=[...e.target.files].slice(0,4);render()}});

const RTYPE={sim:"Simulation",worksheet:"Worksheet",experiment:"Experiment",activity:"Activity",video:"Video",game:"Game",reading:"Reading",lesson:"Lesson",tool:"Tool","citizen-science":"Citizen science"};
const RACC={free:"Free","free-account":"Free sign-up",freemium:"Partly free",paid:"Paid"};
const RCON=Object.fromEntries((DATA.rconcepts||[]).map(c=>[c.id,c]));
const rFits=r=>!S.age||(r.ages[0]<=S.age&&S.age<=r.ages[1]);
function resourcesFor(u){const k=u.k;return (DATA.resources||[]).filter(r=>(r.chapters||[]).includes(k)||r.concepts.some(c=>(RCON[c]?.chapters||[]).includes(k)))}
const resSort=L=>[...L].sort((a,b)=>(rFits(b)-rFits(a))||((a.access==="free"?0:1)-(b.access==="free"?0:1)));
function resCard(r,i){const ch=resChapters(r),show=ch.slice(0,3),more=ch.length-show.length;
  return `<div class="libcard rescard" style="--c:${PAL[i%PAL.length]}"><span class="row" style="gap:6px;flex-wrap:wrap"><span class="pill">${RTYPE[r.type]||esc(r.type)}</span><span class="xs muted">Ages ${r.ages[0]}–${r.ages[1]} · ${RACC[r.access]||""}${(r.lang||[]).filter(l=>l!=="en").length?" · "+r.lang.map(l=>l.toUpperCase()).join(", "):""}</span></span>
   <a href="${esc(r.url)}" target="_blank" rel="noopener" style="color:inherit"><b>${esc(r.title)} ↗</b></a><span class="xs muted">${esc(r.source)}</span><span class="sm">${esc(r.desc)}</span>${r.how?`<span class="xs"><b>How to use:</b> ${esc(r.how)}</span>`:""}
   <span class="xs"><b>Idea:</b> ${r.concepts.map(c=>esc(RCON[c]?.concept||c)).join(" · ")}</span>
   ${show.length?`<span class="xs"><b>Fits:</b></span><div class="row chips">${show.map(chipK).join("")}${more>0?`<span class="xs muted">+${more} more</span>`:""}</div>`:""}</div>`}
function resTab(u){const L=resSort(resourcesFor(u));if(!L.length)return `<p class="note">No outside resources tagged to this chapter yet.</p>`;const ty=ui.rtc||"all",T=[...new Set(L.map(r=>r.type))],F=ty==="all"?L:L.filter(r=>r.type===ty);
  return `<p class="sm muted">${L.length} free and low-cost resources from trusted sites, matched to this chapter's ideas.${S.age?` Ones that suit age ${S.age} come first.`:""}</p><div class="row" style="flex-wrap:wrap;gap:6px">${[["all","All"],...T.map(t=>[t,RTYPE[t]||t])].map(([k,n])=>`<button class="chip" aria-pressed="${ty===k}" data-act="rtc" data-t="${k}">${n}</button>`).join("")}</div><div class="grid2">${F.map(resCard).join("")}</div>`}
function scienceTab(){const R=DATA.resources||[],C=DATA.rconcepts||[],cn=ui.rc||"",ty=ui.rt||"all",fit=ui.rfit!==false;
  let L=R.filter(r=>(!cn||r.concepts.includes(cn))&&(ty==="all"||r.type===ty)&&(!fit||rFits(r)));
  const counts={};R.forEach(r=>r.concepts.forEach(c=>counts[c]=(counts[c]||0)+1));
  return `<section class="sec"><p class="sm muted">${R.length} free and low-cost science resources (simulations, experiments, worksheets, videos and more) from trusted sites, each tagged to the ideas and chapters it fits.</p>
   <div class="field"><label for="rcSel">Idea</label><select class="inp" id="rcSel"><option value="">All ideas</option>${C.filter(c=>counts[c.id]).map(c=>`<option value="${esc(c.id)}" ${cn===c.id?"selected":""}>${esc(c.concept)} (${counts[c.id]})</option>`).join("")}</select></div>
   <div class="row" style="flex-wrap:wrap;gap:6px">${[["all","All"],...Object.entries(RTYPE)].filter(([k])=>k==="all"||R.some(r=>r.type===k)).map(([k,n])=>`<button class="chip" aria-pressed="${ty===k}" data-act="rt" data-t="${k}">${n}</button>`).join("")}</div>
   ${S.age?`<button class="chip" aria-pressed="${fit}" data-act="rfit" style="justify-self:start">Suits age ${S.age}</button>`:""}
   <p class="xs muted">${L.length} shown</p><div class="grid2">${resSort(L).slice(0,ui.rmore||40).map(resCard).join("")}</div>${L.length>(ui.rmore||40)?`<button class="btn line sm" data-act="rmore">Show more</button>`:""}</section>`}
document.addEventListener("change",e=>{if(e.target.id==="rcSel"){ui.rc=e.target.value;ui.rmore=40;delete e.target.dataset.dirty;render()}});
const greetBar=sub=>{const st=streak();return `<section class="greetbar"><button class="readbtn" data-act="readnow" aria-label="Read the screen aloud" style="order:3;margin-left:auto">🔊</button>${dayRing()}<span style="display:grid;min-width:0"><b>${greetWord()}${pname()?", "+esc(pname()):""}!</b><span class="xs muted">${sub}${st>1?` · <span class="streak">${st} days in a row</span>`:""}</span></span></section>`};
function calHead(d){return calHead0(d)+cancelNote(d)}
function calHead0(d){const lab=d===today?"Today":d===addDays(today,1)?"Tomorrow":d===addDays(today,-1)?"Yesterday":parse(d).toLocaleDateString(undefined,{weekday:"long"}),sub=parse(d).toLocaleDateString(undefined,{weekday:d===today||Math.abs(parse(d)-parse(today))<2*864e5?"short":undefined,day:"numeric",month:"short"});
  return `<div class="calhead"><button class="iconbtn sm" data-act="tday" data-d="-1" aria-label="Previous day">${icon("back")}</button><div class="calt"><b>${lab}</b><span class="xs muted">${sub}</span></div><button class="iconbtn sm" data-act="tday" data-d="1" aria-label="Next day">${icon("next")}</button>${d!==today?`<button class="link xs" data-act="tday" data-d="0" style="margin-left:auto">Back to today</button>`:`<button class="link xs" data-act="quick" style="margin-left:auto">${ui.qaOpen?"Close":"+ Add"}</button>`}</div>${ui.qaOpen&&d===today?`<section class="qa-in"><b style="font:600 17px var(--display)">Add to today</b>${quickAdd(today)}</section>`:""}`}
const navSnap=()=>({tab,lt:ui.lt,pv:ui.pv,pday:ui.pday,tday:ui.tday,sheet:ui.sheet?JSON.parse(JSON.stringify(ui.sheet)):null,ctab:ui.sheet?.k?ui.ctab[ui.sheet.k]:undefined,y:scrollY});
let navHist=[],navRestoring=false;
function navPush(){if(navRestoring)return;navHist.push(navSnap());if(navHist.length>40)navHist.shift();try{history.pushState({dk:navHist.length},"")}catch(e){}updBack()}
function navBack(){if(!navHist.length)return;const s=navHist.pop();navRestoring=true;tab=s.tab;ui.lt=s.lt;ui.pv=s.pv;ui.pday=s.pday;ui.tday=s.tday;
  if(s.sheet){if(s.sheet.k){if(s.ctab)ui.ctab[s.sheet.k]=s.ctab;else delete ui.ctab[s.sheet.k]}ui.sheet=s.sheet;if(!sheet.open)sheet.showModal();renderSheet(true);render()}else{if(sheet.open)sheet.close();else render()}
  requestAnimationFrame(()=>scrollTo(0,s.y||0));navRestoring=false;updBack()}
function goBack(){if(!navHist.length){if(sheet.open)sheet.close();return}sfx("tap");try{history.back()}catch(e){navBack()}}
function updBack(){const b=document.getElementById("backTop");if(b)b.hidden=!navHist.length||!ACC;const c=document.getElementById("sheetClose"),top=navHist[navHist.length-1];if(c&&sheet.open){const bk=!!top?.sheet;c.innerHTML=bk?icon("back"):icon("close");c.setAttribute("aria-label",bk?"Back":"Close")}}
addEventListener("popstate",()=>navBack());
document.querySelector("header.top .wrap").insertAdjacentHTML("afterbegin",`<button class="iconbtn" id="backTop" aria-label="Back" hidden>${icon("back")}</button>`);
document.getElementById("backTop").onclick=goBack;

const PKIND={warmup:["learn","Warm-up"],read:["read","Read"],talk:["learn","Talk"],do:["act","Do"],exp:["exp","Experiment"],act:["act","Activity"],ws:["ws","Worksheet"],game:["game","Game"],think:["learn","Think"],watch:["read","Watch"],outdoor:["act","Outdoors"],review:["learn","Review"],check:["ws","Check"]};
const TIER={core:"Core",stretch:"Stretch",challenge:"Challenge"};
const VST={accepted:"Now accepted",debated:"Still debated",minority:"Minority view",rejected:"Evidence went against it"};
const PLEAD={"morning":0,"night before":1,"day before":1,"2 days before":2,"3 days before":3,"1 week before":7,"week before":7};
const pkDay=(u,n)=>{const D=u.c.p.days;return D[Math.min(Math.max(n,1),D.length)-1]};
const pkFind=(u,id)=>{const P=u.c.p;for(const g of ["worksheets","experiments","activities","voices"]){const x=(P[g]||[]).find(z=>z.id===id);if(x)return [g,x]}return [null,null]};
function packDay(u,n){const P=u.c.p,d=pkDay(u,n),last=d.n===P.days.length,refs=new Set(d.steps.map(s=>s.ref).filter(Boolean));
  const out=d.steps.map((s,i)=>{const [kind,label]=PKIND[s.kind]||["act","Step"];return {kind,label,title:s.title,mins:s.mins/60,bk:srcOf(s),html:srcLine(s)+packStep(u,s)+(s.kind==="check"&&P.check?.length?quizList(u.k,d.n,P.check):"")+(stepSec(u,s)==="lab"&&!s.ref?workCtl(u,"st"+d.n+"_"+i,s.title):""),name:`pk:${d.n}:${i}`,sec:stepSec(u,s)}});
  const W=P.words||[];
  if(!out.some(x=>x.sec==="ideas")&&!(u.board==="waldorf"&&(u.subj!=="wml"||d.n>1))){const k=W.length?((d.n-1)*3)%W.length:0,ws=W.length?[0,1,2].map(i=>W[(k+i)%W.length]).filter((w,i,a)=>a.indexOf(w)===i):[];
    out.push({kind:"learn",label:"Big ideas",title:d.n===1?"What this chapter is about":"Today's big idea and key words",mins:5/60,sec:"ideas",name:"pkx:ideas",
      html:srcLine({kind:"think"})+(d.n===1?`${fmtPts(P.summary,1)}${P.goals?.length?`<p class="sm"><b>By the end, your child can:</b></p>${pkList(P.goals.map(g=>g.replace(/^By the end your child can\s*/i,"")))}`:""}`:`<p><b>Today:</b> ${esc(d.goal)}</p>${ws.length?`<p class="sm"><b>Key words to use today:</b></p><div class="kv">${ws.map(([w,m])=>`<span>${esc(w)}</span><b style="font-weight:400">${esc(m)}</b>`).join("")}</div><p class="sm muted">Ask your child to use each word in a sentence about today's lesson.</p>`:""}`)})}
  (P.voices||[]).filter(v=>v.day===d.n&&!refs.has(v.id)).forEach(v=>out.push({kind:"learn",label:"Other views",title:"Other views: "+v.who.split(/[,(]/)[0].trim(),mins:5/60,sec:"views",name:"pkx:v:"+v.id,html:srcLine({kind:"read"})+pkVoice(v)}));
  (P.worksheets||[]).filter(w=>w.day===d.n&&!refs.has(w.id)).forEach(w=>out.push({kind:"ws",label:"Worksheet",title:"Worksheet: "+w.title,mins:10/60,sec:"ws",name:"pkx:w:"+w.id,html:srcLine({kind:"ws"})+pkWs(u,w)}));
  if(!out.some(x=>x.sec==="quiz")&&u.board!=="waldorf"){const Q=last&&P.check?.length?P.check.slice(0,5):(W.length?[0,1,2].map(i=>W[((d.n-1)*3+i)%W.length]).filter((w,i,a)=>a.indexOf(w)===i).map(([w,m])=>({q:`What does “${w}” mean?`,a:m})):[]);
    if(Q.length)out.push({kind:"ws",label:"Quick quiz",title:last?"End-of-chapter quiz":"Quick quiz",mins:5/60,sec:"quiz",name:"pkx:quiz",html:srcLine({kind:"check"})+`<p class="sm">Ask aloud. Let your child answer first, then tap to check.</p>${quizList(u.k,d.n,Q)}`})}
  const ord=SECS.map(s=>s[0]),srt=out.map((x,i)=>({x,i})).sort((a,b)=>ord.indexOf(a.x.sec)-ord.indexOf(b.x.sec)||a.i-b.i).map(o=>o.x),F=srt.map(x=>({title:x.title,bk:!!x.bk?.book,pages:x.bk?.pages||[]}));return srt.map((x,j)=>({...x,html:(j===0?pkHead(d,F):"")+x.html}))}
function packStepByName(u,name){if(!u.c?.p)return "";const [,dn,i]=name.split(":"),d=pkDay(u,+dn),s=d?.steps[+i];return s?packStep(u,s):""}
const pkHead=(d,F)=>{const L=(F||[]).map((x,i)=>({...x,i:i+1})),bk=L.filter(x=>x.bk),isBook=n=>/text ?book|learner['’]s book|book pages?|^pages? \d/i.test(n),need=(d.need||[]).filter(n=>!(bk.length&&isBook(n)));
  let pages=[...new Set(bk.flatMap(x=>x.pages))];if(bk.length&&!pages.length)pages=[...new Set((d.need||[]).filter(isBook).flatMap(n=>srcOf({title:n}).pages))];
  const sh=t=>t.length>26?t.slice(0,25).trim()+"…":t;
  return `<div class="phead"><p class="sm"><b>Today:</b> ${esc(d.goal)}</p>${L.length?`<div class="flow" aria-label="Today's steps">${L.map(x=>`<span class="fl ${x.bk?"bk":"dk"}"><i>${x.i}</i>${x.bk?"📖":"✨"} ${esc(sh(x.title))}</span>`).join("")}</div><p class="xs muted">✨ DeepKids step: book closed, follow the screen. 📖 Book step: open the textbook where it says.</p>`:""}
   ${bk.length?`<p class="sm"><b>📖 Textbook${pages.length?", page"+(pages.length>1||pages[0].includes("–")?"s ":" ")+pages.join(", "):""}</b> · for step${bk.length>1?"s":""} ${bk.map(x=>x.i).join(", ")}</p>`:`<p class="sm"><b>✨ No textbook today.</b> Every step is on screen.</p>`}${need.length?`<p class="sm"><b>Get ready:</b> ${need.map(esc).join(", ")}</p>`:""}</div>`};

const packStep=(u,s)=>`${fmtPts(s.do)}${s.ref?pkRef(u,s.ref):""}`;
function pkRef(u,id){const [g,x]=pkFind(u,id);if(!x)return "";
  if(g==="worksheets")return pkWs(u,x);if(g==="experiments")return pkExp(u,x);if(g==="activities")return pkAct(u,x);return pkVoice(x)}
const pkList=(a,tag="ul")=>a?.length?`<${tag} class="sm">${a.map(i=>`<li>${esc(i)}</li>`).join("")}</${tag}>`:"";
const pkWs=(u,w)=>`<div class="pk"><span class="eyebrow">${TIER[w.tier]||""} worksheet</span><b>${esc(w.title)}</b><p class="xs muted">${w.sections.length} sections · ${w.sections.reduce((a,s)=>a+s[1].length,0)} questions</p><div class="row"><button class="btn accent sm" data-act="ws" data-k="${u.k}" data-w="${esc(w.id)}">${taskDone(u.k+"#"+w.id,"ws")?"Open again (finished)":itemState("ws",u,w.id)==="going"?"Continue the worksheet":"Open the worksheet"}</button></div>${stateCtl("ws",u,w.id)}</div>`;
const pkExp=(u,e)=>`<div class="pk"><span class="eyebrow">Experiment${e.time?" · "+esc(e.time):""}</span><b>${esc(e.title)}</b><p class="sm"><i>${esc(e.question)}</i></p>${e.need?.length?`<p class="sm"><b>You need:</b> ${e.need.map(esc).join(", ")}</p>`:""}${pkList(e.steps,"ol")}<div class="ask"><span class="eyebrow">Guess first</span>${esc(e.predict)}</div><p class="sm"><b>Look for:</b> ${esc(e.observe)}</p><details><summary class="sm">Why it happens</summary>${fmtPts(e.why)}</details>${e.safety?`<p class="sm" style="color:var(--bad)"><b>Safety:</b> ${esc(e.safety)}</p>`:""}<div class="tasks-inline">${taskLine(u,e.id,"Experiment done")}</div></div>`;
const pkAct=(u,a)=>`<div class="pk"><span class="eyebrow">Activity${a.mins?" · "+a.mins+" min":""}</span><b>${esc(a.title)}</b>${a.need?.length?`<p class="sm"><b>You need:</b> ${a.need.map(esc).join(", ")}</p>`:""}${pkList(a.steps,"ol")}${a.outcome?`<p class="sm"><b>You end up with:</b> ${esc(a.outcome)}</p>`:""}<div class="tasks-inline">${taskLine(u,a.id,"Activity done")}</div></div>`;
const pkVoice=v=>`<div class="pk voicecard"><span class="vst ${esc(v.status)}">${VST[v.status]||esc(v.status)}</span><b>${esc(v.who)}</b>${fmtPts(v.idea,1)}<span class="eyebrow">Back then</span>${fmtPts(v.then,1)}<span class="eyebrow">Today</span>${fmtPts(v.now,1)}<div class="ask"><span class="eyebrow">Ask your child</span>${esc(v.ask)}</div></div>`;

function packPrep(u,n){const P=u.c.p,d=pkDay(u,n),L=[];
  if(n===1)L.push(["guide",1,`Skim the ${P.days.length}-day plan for ${u.title} (3 min)`,"The chapter page → Day plan"]);
  (d.prep||[]).forEach(q=>L.push(["get",PLEAD[String(q.when).toLowerCase()]??1,q.task,`Part ${d.n} of the chapter`]));
  if(d.need?.length)L.push(["get",1,"Gather: "+d.need.join(", "),"Around the house"]);
  return L.map((p,i)=>({id:`p|${u.k}|${n}|${i}`,kind:p[0],lead:p[1],task:p[2],where:p[3]}))}
function packOverview(u){const P=u.c.p;
  return `<section class="card ${SC(u.subj)}"><span class="eyebrow">${esc(P.source)}</span><p>${esc(P.summary)}</p>${P.goals?.length?`<span class="eyebrow" style="margin-top:6px">By the end your child can</span>${pkList(P.goals.map(g=>g.replace(/^By the end your child can\s*/i,"")))}`:""}</section>
   ${P.words?.length?`<section class="card"><span class="eyebrow">Key words</span><div class="kv">${P.words.map(([w,m])=>`<span>${esc(w)}</span><b style="font-weight:400">${esc(m)}</b>`).join("")}</div></section>`:""}
   ${P.check?.length?`<details class="card"><summary><b>End-of-chapter check</b> <span class="xs muted">${P.check.length} questions</span></summary><ol class="sm">${P.check.map(c=>`<li>${esc(c.q)}<details><summary class="xs muted">Answer</summary><p class="sm">${esc(c.a)}</p></details></li>`).join("")}</ol></details>`:""}`}
function packTab(u,t){const P=u.c.p;
  if(t==="days"){const cur=Math.min(done(u.k)+1,P.days.length);
    return `<p class="sm muted">This chapter has ${P.days.length} parts of about ${P.day_mins} minutes. Each lesson is one part; anything left unticked moves to the next day.</p>`+P.days.map(d=>`<details class="card pkday" ${d.n===cur?"open":""}><summary><b>Part ${d.n}</b> · ${esc(d.title)} <span class="xs muted">${d.steps.reduce((a,s)=>a+s.mins,0)} min${d.n<cur?" · done":d.n===cur?" · next":""}</span></summary>
      <p class="sm">${esc(d.goal)}</p>${d.need?.length?`<p class="sm muted">You need: ${d.need.map(esc).join(", ")}</p>`:""}${(d.prep||[]).map(q=>`<p class="sm muted">Prep (${esc(q.when)}): ${esc(q.task)}</p>`).join("")}
      ${d.steps.map(s=>{const [,lab]=PKIND[s.kind]||["","Step"],[,x]=s.ref?pkFind(u,s.ref):[];return `<div class="pkstep"><span class="chip">${lab} · ${s.mins} min</span> <b>${esc(s.title)}</b><p class="sm">${esc(s.do)}</p>${x?`<p class="xs muted">Uses: ${esc(x.title||x.who)}</p>`:""}</div>`}).join("")}</details>`).join("")}
  if(t==="ws")return `<p class="sm muted">Three levels: core for everyone, stretch to apply it, challenge to think harder.</p>`+P.worksheets.map(w=>`<section class="card">${pkWs(u,w)}<p class="xs muted">Planned for day ${w.day||"–"}</p></section>`).join("");
  if(t==="lab")return `<span class="eyebrow">Experiments</span>${P.experiments.map(e=>pkExp(u,e)).join("")}<span class="eyebrow" style="margin-top:10px">Activities</span>${P.activities.map(a=>pkAct(u,a)).join("")}`;
  if(t==="voices")return `<p class="sm muted">Other scientists and challenging views. Some were laughed at and later proved right; some are still argued over; some turned out wrong. Read one together and ask what evidence would change your mind.</p>${P.voices.map(pkVoice).join("")}`;
  return ""}
function loginView(){let known=[];try{known=JSON.parse(lsGet("dk-known")||"[]")}catch(e){}
  return `<div class="ob">${crowd()}<div><span class="eyebrow">DeepKids</span><h1 style="margin-top:6px">Log in</h1><p class="muted" style="margin-top:6px">Testing mode, so no OTP yet. The same number always brings back the same family. You stay logged in until you log out.</p></div>
   ${known.length?`<div class="col" style="gap:8px"><span class="eyebrow">Used on this phone</span>${known.map(k=>`<button class="menurow" data-act="loginas" data-a="${esc(k.acct)}">${youBlob("","happy",'width="40" height="40"')}<span><b>${esc(k.name||"Parent")}</b><br><span class="xs muted">+91 ${esc(String(k.acct).slice(2))}${k.child?" · "+esc(k.child)+"'s family":""}</span></span>${icon("next")}</button>`).join("")}</div><span class="eyebrow">Or a different number</span>`:""}
   <div class="field"><label for="lgPhone">Phone number</label><div class="row" style="flex-wrap:nowrap"><span class="chip" style="height:50px;padding:0 14px;font-size:16px">+91</span><input class="inp" id="lgPhone" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="11" placeholder="98765 43210"></div></div>
   <div class="field"><label for="lgName">Your name</label><input class="inp" id="lgName" maxlength="40" autocomplete="given-name" placeholder="Your name"></div>
   <p class="sm" id="lgErr" style="color:var(--bad)" ${ui.lgErr?"":"hidden"}>${esc(ui.lgErr||"")}</p>
   <button class="btn" data-act="login" ${ui.lgBusy?"disabled":""}>${ui.lgBusy?"Logging in…":"Log in"}${icon("next")}</button></div>`}
function accountCard(){const ph=ACC?"+91 "+ACC.slice(2,7)+" "+ACC.slice(7):"";const d=ui.saved;
  return `<section class="card"><div class="sech"><span><span class="eyebrow">Logged in</span><br><b style="font:600 17px var(--display)">${esc(ph)}</b></span><button class="btn soft sm" data-act="logout">Log out</button></div>
   <button class="btn line sm" data-act="checksaved" style="justify-self:start">${ui.savedBusy?"Reading…":"Check what's saved"}</button>
   ${d?d.err?`<p class="sm" style="color:var(--bad)">${esc(d.err)}</p>`:`<div class="kv"><span>Read from</span><b>the database, ${new Date(d.at).toLocaleTimeString([],{hour:"numeric",minute:"2-digit",second:"2-digit"})}</b><span>Your name</span><b>${esc(d.v.parent?.name||"(not set)")}</b><span>Wake-up</span><b>${esc((d.v.alarm||{}).time||"(not set)")}</b><span>Child</span><b>${esc(d.v.child||"")}, age ${esc(d.v.age||"")}</b><span>Subjects</span><b>${(d.v.subjects||[]).map(s=>SUBJ[s]||s).join(", ")}</b><span>Lessons done</span><b>${(d.v.log||[]).length}</b></div>${(d.v.log||[]).length?`<span class="eyebrow" style="margin-top:8px">Last things saved</span><ol class="sm">${d.v.log.slice(0,6).map(l=>`<li>${esc(fmt(l.date))}${l.at!=null?", "+clock(l.at):""}: ${esc(l.title)}${l.n?" (part "+l.n+")":""}</li>`).join("")}</ol>`:""}<div class="kv"><span>Classes and to-dos</span><b>${(d.v.events||[]).length+(d.v.todos||[]).length}</b><span>Last change</span><b>${d.v.updatedAt?new Date(d.v.updatedAt).toLocaleString([],{day:"numeric",month:"short",hour:"numeric",minute:"2-digit"}):"–"}</b></div>`:""}</section>`}
const dayNavBtns=(lab)=>`<div class="daynav"><button class="iconbtn sm" data-act="tday" data-d="-1" aria-label="Previous day">${icon("back")}</button><span class="eyebrow">${lab}</span><button class="iconbtn sm" data-act="tday" data-d="1" aria-label="Next day">${icon("next")}</button></div>`;
function noLessonNote(d){const wd=parse(d).getDay(),DN=["Sundays","Mondays","Tuesdays","Wednesdays","Thursdays","Fridays","Saturdays"],SD=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],on=S.subjects.filter(s=>daysOf(s).includes(wd));
  if(on.length)return `<p class="note">Nothing planned yet.</p>`;const nx=upcoming().find(x=>x.date>d),rng=a=>{const o=[1,2,3,4,5,6,0].filter(x=>a.includes(x));return o.join()==="1,2,3,4,5"?"Mon–Fri":o.map(x=>SD[x]).join(", ")};
  return `<div class="note"><p><b>No lessons on ${DN[wd]}.</b> It's a free day in your plan.</p><ul class="sm" style="margin:6px 0;padding-left:18px">${S.subjects.map(s=>`<li>${esc(SUBJ[s])}: ${rng(daysOf(s))}</li>`).join("")}</ul>${nx?`<p class="sm">Next lessons: ${esc(fmt(nx.date))}.</p>`:""}<button class="link sm" data-act="plsheet" data-p="pace">Change lesson days</button></div>`}
function otherDay(d){const items=dayPlan(d).filter(i=>i.kind!=="brk"),past=d<today,dn=items.filter(i=>i.done).length;
  return `<section class="sec cal">${calHead(d)}<p class="xs muted">${past?`${dn} of ${items.length} done that day`:`${items.length} thing${items.length===1?"":"s"} planned`}</p>
   ${items.length?`<div class="tt compact">${items.map(i=>tRow(i,d,null)).join("")}</div>`:(past?`<p class="note">Nothing was recorded that day.</p>`:noLessonNote(d))}
   ${past?"":`<button class="btn soft sm" data-act="quickday" data-d="${d}" style="margin-top:12px">+ Add a plan for this day</button>`}</section>`}
/* ---------- calm Today: one thing now, a short list, everything else behind More ---------- */
function nowCard(it){const col=it.kind==="lesson"?SC(it.s):"r-"+it.who,missed=isMissed(it,today),a=`data-id="${it.id}" data-date="${today}"`,open=!!ui.open["now|"+it.id];
  const label=missed?"Pending":it.anytime?"Any time today":it.at<=nowMin()?"Now":"Up next";
  const title=it.kind==="lesson"?chT(it.u):it.title;
  const sub=it.kind==="lesson"?`${SUBJ[it.s]} · Part ${it.n} of ${it.tot} · ${estTxt(it.u,it.n,it.tot)}`:it.kind==="prep"?(n=>`${n} thing${n===1?"":"s"} to get ready · ${mins(it.dur/60)}`)(it.prep.filter(p=>!S.prep[p.id]).length):it.sub||ROLE[it.who];
  const P={lesson:[`data-act="play" ${a}`,it.kind==="lesson"&&stepState(it).some(x=>x.ok)?"Keep going":"Start the lesson"],prep:it.id==="pm"?[`data-act="night"`,"Get tomorrow ready"]:[`data-act="tlopen" ${a}`,"Open the checklist"],warm:[`data-act="games"`,"Start the warm-up"],plan:[`data-act="quickplan"`,"Open the Planner"],exps:[`data-act="tlcheck" ${a}`,"Checked them all"],refresh:[`data-act="refresh" data-date="${today}"`,"Play it"],dkt:[`data-act="chapter" data-k="${it.u?.k}"`,"Open the topic"]}[it.kind]||[`data-act="tlcheck" ${a}`,"Done"];
  if(it.kind==="event"&&!it.done&&!it.anytime&&it.at>nowMin())P.splice(0,2,`data-act="evcancel" data-id="${esc(it.ev.id)}" data-date="${today}"`,"Cancel for today");
  const mascot=it.kind==="lesson"?sblob(it.s,"happy","mascot bob"):it.who==="you"?youBlob("mascot bob","calm"):kidBlob("mascot bob");
  return `<section class="now ${col}">${mascot}<span class="eyebrow">${label} · ${it.anytime?"any time":clock(it.at)}</span><h2>${esc(title)}</h2><button class="sub subtap" data-act="nowmore" data-id="${it.id}" aria-expanded="${!!open}">${esc(sub)} <span class="chev">${open?"▲ Hide":"▼ What's in it"}</span></button>
   <div class="row" style="flex-wrap:nowrap"><button class="btn wide big" ${P[0]}>${it.kind==="lesson"?icon("play"):""}${P[1]}</button>${P[0].includes("tlcheck")||P[0].includes("evcancel")?"":`<button class="ck" data-act="tlcheck" ${a} aria-label="Mark done: ${esc(title)}">${icon("check")}</button>`}</div>
   ${OURS(it)&&it.kind!=="exps"?`<button class="nowalt" data-act="iopts" ${a}>Already did it, later, or skip ›</button>`:""}${open?`<div class="tdet">${itemDetail(it,today)}</div>`:""}</section>`}
function moreView(){document.getElementById("sheetTitle").textContent="More for today";const du=dailyUnit(),open=S.exps.filter(e=>!e.closed),li=learnItems().length;
  let h=`<section class="card"><span class="eyebrow">Today is a</span><div class="whos"><button aria-pressed="${dayTypeOf(today)==="full"}" data-act="daytype" data-t="full">Full day</button><button aria-pressed="${dayTypeOf(today)==="busy"}" data-act="daytype" data-t="busy">Busy day</button></div><p class="xs muted">Busy days use the short lesson plans.</p></section>`;
  h+=`<button class="menurow" data-act="learn">${youBlob("","calm",'width="40" height="40"')}<span><b>For you</b><br><span class="xs muted">${li?li+" guides and readings for today and tomorrow":"Guides for teaching each topic"}</span></span>${icon("next")}</button>`;
  h+=`<button class="menurow" data-act="games">${blob("var(--gum)",21,"wow","",'width="40" height="40"')}<span><b>Jokes and games</b><br><span class="xs muted">Word of the Day, True or False, Odd One Out</span></span>${icon("next")}</button>`;
  if(du)h+=`<div class="hs">${du.c.x.jokes.map((j,i)=>{const [q,a]=splitJoke(j),k=today+i;return `<button class="joke" data-act="joke" data-j="${k}"><span class="eyebrow">Joke ${i+1}</span><span class="q">${esc(q)}</span>${ui.jokes[k]?`<span class="a">${esc(a)}</span>`:`<span class="tap">Tap for the answer</span>`}</button>`}).join("")}</div>`;
  h+=moreJG();
  h+=`<section class="card"><b style="font:600 17px var(--display)">🌱 Daily check-ins</b><p class="xs muted">For experiments that take days, like seeds sprouting or crystals growing. Tick once a day and DeepKids counts the days.</p>${open.map(e=>{const day=Math.round((parse(today)-parse(e.start))/864e5)+1,c=e.checks.includes(today);return `<div class="expi ${c?"done":""}" style="box-shadow:none;padding:6px 0"><span class="daybadge"><span><small>DAY</small>${day}</span></span><span style="min-width:0"><b style="font:600 15px var(--display)">${esc(e.title)}</b><br><span class="xs muted"><button class="link xs" data-act="close" data-e="${e.id}">finish</button></span></span><button class="ck" data-act="check" data-e="${e.id}" aria-label="Checked today: ${esc(e.title)}">${icon("check")}</button></div>`}).join("")||`<p class="sm"><b>Nothing running yet. Try one of these:</b></p>${ideasHtml()}`}<div class="row" style="flex-wrap:nowrap"><input class="inp" id="newExp" placeholder="Add your own" maxlength="80"><button class="btn sm" data-act="addexp">Add</button></div></section>`;
  h+=`<button class="btn soft sm" data-act="free" style="justify-self:start">We explored something else</button>`;
  return h}

/* ---------- calm Planner: tell us, see the plan, the rest behind rows ---------- */
const PL={queue:"Up next",events:"Classes, outings and to-dos",calendar:"Bring in your calendars",day:"Your day",pace:"Pace",asks:"DeepKids asks"};
function plView(){const p=ui.sheet.p;document.getElementById("sheetTitle").textContent=PL[p]||"Planner";if(p==="queue")return queueCard();if(p==="calendar")return calendarCard();return plPart(p)||`<p class="note">Nothing here yet.</p>`}

/* ---------- calm Journey: subjects first, the rest behind rows ---------- */
const JR={high:"Highlights",board:"Against the board",beyond:"Beyond the board",diary:"Learning diary",numbers:"Numbers"};
function jrView(){const p=ui.sheet.p;document.getElementById("sheetTitle").textContent=JR[p]||"Journey";return jPart(p)||`<p class="note">Nothing here yet. It fills up as ${esc(S.child||"your child")} learns.</p>`}

function plPart(p){let h="";
  if(p==="asks"){  const Q=askList();if(Q.length)h+=`<section class="sec"><div class="sech"><h3>DeepKids asks</h3></div><div class="col" style="gap:8px">${Q.map(([q,a])=>`<button class="askq" data-act="askq" data-a="${esc(a)}">${blob("var(--sun)",8,"wow","",'width="34" height="34"')}<span>${q}</span>${icon("next")}</button>`).join("")}</div></section>`;}
  if(p==="events"){  const evs=S.events||[],tds=(S.todos||[]).filter(x=>!x.done);
  h+=`<section class="sec"><div class="sech"><h3>Classes, outings and to-dos</h3><button class="link" data-act="toplan">+ Add</button></div>${evs.length||tds.length?`<div class="tt">${evs.map(e=>`<div class="tcard ${e.kind==="outing"?"r-out":"r-"+e.who}"><span class="ic">${icon("event")}</span><span class="m"><b>${esc(e.title)}</b><span>${clock(hm(e.start))} · ${e.rep==="weekly"?"every "+e.days.map(d=>DAYN[d]).join(", "):fmt(e.date)} · ${ROLE[e.kind==="outing"?"out":e.who]}</span></span><button class="iconbtn" style="width:38px;height:38px" data-act="delev" data-e="${e.id}" aria-label="Remove ${esc(e.title)}">${icon("close")}</button></div>`).join("")}${tds.map(x=>`<div class="tcard r-${x.who}"><span class="ic">${icon("prep")}</span><span class="m"><b>${esc(x.title)}</b><span>${fmt(x.date)} · any time · ${ROLE[x.who]}</span></span><button class="iconbtn" style="width:38px;height:38px" data-act="tododel" data-t="${x.id}" aria-label="Remove ${esc(x.title)}">${icon("close")}</button></div>`).join("")}</div>`:`<p class="note">Nothing yet. Tell DeepKids above, or add by hand.</p>`}</section>`;}
  if(p==="day"){  const d=D();h+=`<section class="sec"><div class="sech"><h3>Your day</h3></div><div class="card"><div class="fgrid">
    <div class="field"><label for="dPrep">Morning prep</label><input class="inp" id="dPrep" type="time" data-dayset="prepAt" value="${d.prepAt}"></div><div class="field"><label for="dStart">Lessons start</label><input class="inp" id="dStart" type="time" data-dayset="start" value="${d.start}"></div>
    <div class="field"><label for="dBrk">Break between</label><select class="inp" id="dBrk" data-dayset="brk">${[0,10,15,20,30].map(x=>`<option value="${x}" ${+d.brk===x?"selected":""}>${x} min</option>`).join("")}</select></div>
    <div class="field"><label for="dLunch">Lunch at</label><input class="inp" id="dLunch" type="time" data-dayset="lunch" value="${d.lunch}"></div><div class="field"><label for="dLunchM">Lunch length</label><select class="inp" id="dLunchM" data-dayset="lunchMin">${[30,45,60,90].map(x=>`<option value="${x}" ${+d.lunchMin===x?"selected":""}>${x} min</option>`).join("")}</select></div>
    <div class="field"><label for="dEve">Evening prep</label><input class="inp" id="dEve" type="time" data-dayset="eveAt" value="${d.eveAt}"></div></div></div></section>`;}
  if(p==="pace"){  h+=`<section class="sec"><div class="sech"><h3>Pace</h3><span class="xs muted">Change anything and the year re-plans</span></div>${S.subjects.map(s=>{const sc=schedule(s),cur=sc.filter(x=>x.u.level===S.levels[s]),l=S.levels[s];return `<div class="card ${SC(s)}"><div class="sech"><div class="row" style="gap:8px">${sblob(s,"happy","",'width="34" height="34"')}<h3>${SUBJ[s]}</h3></div><div class="stepper"><button data-act="lvl" data-s="${s}" data-d="-1" ${l<=1?"disabled":""} aria-label="Class down">−</button><span class="sm" style="min-width:64px;text-align:center">Class ${l}</span><button data-act="lvl" data-s="${s}" data-d="1" ${l>=5?"disabled":""} aria-label="Class up">+</button></div></div>
     <div class="row"><select class="inp" style="width:auto;height:40px" id="hpd-${s}" data-hpd="${s}" aria-label="${SUBJ[s]} hours a day">${[.25,.5,.75,1,1.5,2,3].map(v=>`<option value="${v}" ${hpdOf(s)===v?"selected":""}>${v} h a day</option>`).join("")}</select><div class="dpick">${[1,2,3,4,5,6,0].map(dd=>`<button aria-pressed="${daysOf(s).includes(dd)}" data-act="day" data-s="${s}" data-d="${dd}">${DAYN[dd]}</button>`).join("")}</div></div>
     <p class="xs muted">${lvlLabel(l)} · ${cur.length} lesson days left at this level${cur.length?`, finishing around ${fmt(cur[cur.length-1].date)}`:""}</p></div>`}).join("")}</section>`;}
  return h}
function jPart(p){const kid=esc(S.child||"Your child");let h="";
  if(p==="numbers"){  const tasks=Object.values(S.tasks).reduce((a,t)=>a+Object.keys(t).length,0),gd=Object.values(S.games).filter(g=>g.g?.length||Object.keys(g.tf||{}).length||g.odd).length,hrs=S.log.reduce((a,l)=>a+hpdOf(l.subj),0);
  h+=`<section class="sec"><div class="stack3">${[[S.log.length,"lessons","var(--sun)"],[fh(hrs),"hours learned","var(--pist)"],[tasks,"tasks done","var(--gum)"],[gd,"game days","var(--sky)"]].map(([n,l,c],i)=>`<div class="scard" style="--c:${c};min-height:104px"><span class="big num">${n}</span><span class="sm" style="font-weight:800">${l}</span>${blob("rgba(255,255,255,.6)",60+i,"happy")}</div>`).join("")}</div></section>`;}
  if(p==="high"){  const Qs=quotes().slice(-3).reverse(),W=workOf().slice(-6).reverse();
  if(Qs.length||W.length)h+=`<section class="sec"><div class="sech"><h3>Highlights</h3></div>${Qs.map(q=>`<div class="quote ${SC(q.u.subj)}"><span class="eyebrow">${esc(q.q||"")}</span><p>“${esc(q.a)}”</p><span class="xs muted">${esc(q.u.title)}</span></div>`).join("")}${thumbs(W)}</section>`;}
  if(p==="board"){  const bs=boardsOn();if(bs.length)h+=`<section class="sec"><div class="sech"><h3>Against the board</h3><span class="xs muted">school year from ${fmt(AY0())}</span></div>${bs.map(b=>{const R=S.subjects.map(s=>({s,r:boardRows(s,b)})).filter(x=>x.r);if(!R.length)return "";return `<div class="card"><b style="font:600 17px var(--display)">${BOARDS[b]}</b>${R.map(({s,r})=>`<div class="col" style="gap:4px"><div class="sech"><span class="sm" style="font-weight:800">${SUBJ[s]}</span><span class="xs ${r.behind.length?"":"muted"}" style="${r.behind.length?"color:var(--bad);font-weight:800":""}">${r.behind.length?`${r.behind.length} behind`:r.done.length>=r.exp?"On track":""} · ${r.done.length} of ${r.us.length}</span></div><div class="bar ${SC(s)}"><span style="width:${r.done.length/r.us.length*100}%;background:var(--c)"></span></div></div>`).join("")}</div>`}).join("")}</section>`;}
  if(p==="beyond"){  const beyond=S.log.filter(l=>l.key.startsWith("dk|")||l.kind==="free"),bk=[...new Set(beyond.map(l=>l.title))];
  h+=`<section class="sec"><div class="sech"><h3>Beyond the board</h3></div><div class="card">${bk.length?`<div class="row">${bk.map(t=>`<span class="chip">${esc(t)}</span>`).join("")}</div>`:`<p class="sm muted">DeepKids Plus topics and things you explore freely show up here.</p>`}<p class="xs muted">${S.exps.filter(e=>e.closed).length} experiments finished · ${quotes().length} big-question answers recorded</p></div></section>`;}
  if(p==="diary"){  h+=`<section class="sec"><div class="sech"><h3>Learning diary</h3></div><div class="card diary">${S.log.slice(0,20).map(l=>`<div class="dline ${SC(l.subj)}">${sblob(l.subj,"happy","",'width="34" height="34"')}<span><b style="font:600 16px var(--display)">${esc(l.title)}</b><br><span class="xs muted">${fmt(l.date)} · ${SUBJ[l.subj]||""}${l.kind==="free"?" · explored freely":l.kind==="more"?" · extra lesson":""}</span></span></div>`).join("")||`<p class="sm muted">Finished lessons appear here.</p>`}</div></section>`;}
  return h}

let DBH=null,UID=null,_all=null,ACCT="";
function keepInputs(root){const o={};root.querySelectorAll("input[id],textarea[id],select[id]").forEach(e=>{if(e.dataset.dirty&&e.type!=="file")o[e.id]=e.type==="checkbox"?e.checked:e.value});const a=document.activeElement;return {o,focus:a&&root.contains(a)&&a.id?a.id:null,sel:a&&typeof a.selectionStart==="number"?a.selectionStart:null}}
function restoreInputs(root,k){Object.entries(k.o).forEach(([id,v])=>{const e=root.querySelector("#"+CSS.escape(id));if(!e)return;if(e.type==="checkbox")e.checked=v;else e.value=v;e.dataset.dirty="1"});if(k.focus){const e=root.querySelector("#"+CSS.escape(k.focus));if(e&&document.activeElement!==e){e.focus({preventScroll:true});try{if(k.sel!=null)e.setSelectionRange(k.sel,k.sel)}catch(x){}}}}
function clearIn(id){document.querySelectorAll("#"+CSS.escape(id)).forEach(e=>{e.value="";delete e.dataset.dirty})}
document.addEventListener("input",e=>{if(e.target.id)e.target.dataset.dirty="1"},true);
document.addEventListener("change",e=>{if(e.target.id)e.target.dataset.dirty="1"},true);
const pname=()=>(S.parent&&S.parent.name)||ACCT;
function allUnits(){if(_all&&_all.n===SHARED.topics.length)return _all.u;const u=[...DATA.items,...DATA.topics.map(t=>({k:"dk|"+t.id,board:"dk",subj:"dks",level:1,book:"DeepKids Science",n:t.id,title:t.name,dk:[],topic:t})),...SHARED.topics.map(genUnit)];_all={n:SHARED.topics.length,u};return u}
const dayTypeOf=d=>((S.dayType||{})[d])||"full";
const lessonMins=(s,date)=>dayTypeOf(date)==="busy"?Math.min(30,hpdOf(s)*60):hpdOf(s)*60;
const MODES={books:["Syllabus books","Read the board's books, with a summary and curated resources for every chapter.","var(--sky)"],booksplus:["Books + DeepKids Plus","The books, plus our lesson plans, big questions, worksheets and games for each topic.","var(--tang)"],plus:["DeepKids Plus first","All syllabuses combined and more. Lesson plans lead; the books become suggested reading.","var(--gum)"]};

/* ---------- lesson plan options: 3 for a full day, 3 for a busy day (placeholders until written) ---------- */
function planOptions(u){const c=u.c,x=c?.x,g=u.gen,t=u.topic;
  if(g?.plans)return {full:(g.plans.full||[]).slice(0,3).map((o,i)=>genOpt(o,"f"+(i+1))),busy:(g.plans.busy||[]).slice(0,3).map((o,i)=>genOpt(o,"b"+(i+1)))};
  const game=c?.game?.[0]||"The topic game",gameHow=c?.game?.[1]||"Play a quick game about the topic.",act=c?.act?.[0]||t?.sub?.[0]||"A hands-on activity about the topic.",exp=c?.exp?.[0]||"A small experiment or observation.",bq=x?.deep?.[0]?.q||t?.oneness||"What do you already know about this, and how do you know it?";
  const P=(kind,title,f,body)=>({kind,label:KL[kind]||"Step",title,f,body});
  return {full:[
    {id:"f1",name:x?"DeepKids plan":"Chapter day",idea:x?"Our full plan: read, think, worksheet, experiments, activities, game and project.":"Read the chapter together, talk about it, then try it with your hands.",real:true},
    {id:"f2",name:"Story and play day",idea:"Start with a story, play the chapter game, end with something to make.",placeholder:true,parts:[P("read","Story time",.3,"Tell or read the story of this topic in your own words."),P("game",game,.4,gameHow),P("act","Make it real",.3,act)]},
    {id:"f3",name:"Outdoor and make day",idea:"Take it outside: observe, collect, build.",placeholder:true,parts:[P("exp","Go and look",.4,exp),P("proj","Make something",.4,c?.proj?.[1]||"Build a small model or poster."),P("learn","Talk it over",.2,bq)]}],
   busy:[
    {id:"b1",name:"30-minute core",idea:"The one idea that matters most, then a quick check.",placeholder:true,parts:[P("read","The key idea",.5,x?.learn?.[0]||c?.covers||t?.summary||"Read the main part of the chapter."),P("learn","One big question",.3,bq),P("game","Quick check",.2,"Three quick questions, said aloud.")]},
    {id:"b2",name:"Game-only day",idea:"Learn by playing. Nothing to write.",placeholder:true,parts:[P("game",game,.8,gameHow),P("learn","What did we learn?",.2,"Each of you says one thing the game taught.")]},
    {id:"b3",name:"Talk and walk",idea:"A walk and a conversation. No screens, no books.",placeholder:true,parts:[P("act","Walk and spot",.6,"On a short walk, look for this topic around you."),P("learn","The big question",.4,bq)]}]}}
function genOpt(o,id){const parts=(Array.isArray(o.steps)?o.steps:[]).slice(0,6).map(s=>({kind:KL[s.kind]?s.kind:"act",label:KL[s.kind]||"Step",title:String(s.title||"").slice(0,80),mins:Math.max(5,Math.min(90,+s.mins||10)),body:String(s.how||"").slice(0,600)}));return {id,name:String(o.name||"Plan").slice(0,40),idea:String(o.idea||"").slice(0,200),parts,gen:true}}
const pickOf=(u,type)=>{const P=planOptions(u)[type]||[],id=((S.planPick||{})[u.k]||{})[type];return P.find(o=>o.id===id)||P[0]};
function bookSteps(u,n,tot){const cap=hpdOf(u.subj),w=`${esc(u.book)}${chNo(u)?", "+chNo(u):""}`,res=u.c?.read?.[0];
  const L=n===1?[["read","Read","Read the chapter",.6,`Read the first part of <b>${w}</b> together. Ask what your child thinks it's about.`],["act","Try it","Try it out",.4,esc(HINT[u.subj])]]
   :n===tot?[["act","Finish","Finish the chapter",.5,`Do the last exercises in <b>${w}</b>.`],["learn","Review","Teach it back",.5,"Your child explains the chapter to you."]]
   :[["read","Continue","Continue the chapter",.6,`Carry on in <b>${w}</b>.`],["act","Practice","Practice",.4,esc(HINT[u.subj])+(res?` More: ${esc(res)}.`:"")]];
  return L.map(([kind,label,title,f,html])=>({kind,label,title,mins:cap*f,html,name:""}))}
function optionSteps(u,n,tot,date){const type=dayTypeOf(date),o=pickOf(u,type);if(!o||(o.real&&type==="full"))return daySteps(u,n,tot);
  if(o.real)return daySteps(u,n,tot);const total=lessonMins(u.subj,date);
  return o.parts.map(p=>({kind:p.kind,label:p.label,title:p.title,mins:(p.mins||p.f*total)/60,html:`<p>${esc(p.body)}</p>${o.placeholder?`<p class="xs muted">Placeholder plan: “${esc(o.name)}”. The full version is being written.</p>`:""}`,name:"opt:"+o.id}))}
function refresherFor(date){const keys=[...new Set(S.log.filter(l=>l.date<date).map(l=>l.key))];if(!keys.length)return null;const dn=Math.floor(parse(date)/864e5),u=unitBy(keys[dn%keys.length]);if(!u)return null;
  const P=u.c?.p,c=u.c||{},pool=[];
  if(P){(P.experiments||[]).forEach(e=>pool.push({kind:"exp",title:e.title,body:e.question,steps:e.steps,need:e.need,predict:e.predict,why:e.why,safety:e.safety}));(P.activities||[]).forEach(a=>pool.push({kind:"act",title:a.title,body:a.outcome?"You end up with: "+a.outcome:"",steps:a.steps,need:a.need}))}
  if(c.game&&!P)pool.unshift({kind:"game",title:c.game[0],body:c.game[1]});
  if(!P){(c.exp||[]).forEach(e=>pool.push({kind:"exp",title:e.split(":")[0].slice(0,50),body:e}));(c.act||[]).forEach(e=>pool.push({kind:"act",title:e.split(":")[0].slice(0,50),body:e}))}
  const part=pool.length?pool[dn%pool.length]:{kind:"talk",title:"Quick recall",body:"Ask your child to tell you three things they remember from "+u.title+", then one question they still have."};
  const Q=P?.check||[],quiz=Q.length?[0,1,2].map(i=>Q[(dn+i*2)%Q.length]).filter((q,i,a)=>a.indexOf(q)===i):(c.x?.quiz||[]).slice(0,3).map(([s,t,w])=>({q:"True or false: "+s,a:(t?"True. ":"False. ")+w}));
  return {u,...part,quiz}}
/* ---------- topic level: tags, summaries, ideas, related ---------- */
function tagsOf(u){const T=[];const tag=i=>({board:i.board,txt:`${BOARDS[i.board]?BOARDS[i.board].split(" ")[0]:"?"} · Class ${DATA.levels[i.level].cls} · ${i.book.replace(/ · Class \d+$/,"").replace(/ \(Class \d+\)$/,"")}${/^\d+$/.test(i.n)?(i.board==="waldorf"?" · Block ":" · Ch ")+i.n:""}`,k:i.k,subj:i.subj});
  if(u.board==="gen"){(u.gen.tags||[]).forEach(k=>{const i=DATA.items.find(z=>z.k===k);if(i)T.push(tag(i))})}
  else if(u.board==="dk"){DATA.items.filter(i=>(i.dk||[]).includes(u.n)).forEach(i=>T.push(tag(i)))}
  else{T.push(tag(u));const ids=u.dk||[];DATA.items.filter(i=>i.k!==u.k&&i.board!==u.board&&ids.some(d=>(i.dk||[]).includes(d))).slice(0,4).forEach(i=>T.push(tag(i)))}
  return T}
function subjectsOf(u){const s=new Set([u.subj]);if(u.board==="gen")(u.gen.subjects||[]).forEach(x=>SUBJ[x]&&s.add(x));tagsOf(u).forEach(t=>s.add(t.subj));return [...s]}
function summaryOf(u){if(u.board==="gen")return u.gen.summary||"";if(u.board==="dk")return u.topic.summary;const T=tagsOf(u).map(t=>DATA.items.find(i=>i.k===t.k)).filter(Boolean);const s=T.map(i=>i.c?.covers).filter(Boolean);return s.length?[...new Set(s)].join(" "):"Summary coming soon. (Placeholder: we collate this from every book that covers the topic.)"}
function ideasOf(u){if(u.board==="gen")return {sum:u.gen.plusSummary||"",ideas:(u.gen.ideas||[]).map(String)};const x=u.c?.x;if(x)return {sum:x.oneness,ideas:x.deep.map(d=>d.q)};if(u.board==="dk")return {sum:u.topic.oneness,ideas:u.topic.sub.slice(0,3)};return {sum:"",ideas:["Placeholder: challenging ideas for this topic are being written."]}}
function relatedOf(u){const pool=allUnits(),ids=u.board==="dk"?[u.n]:u.dk||[],pre=prereqOf(u).map(k=>unitBy(k)).filter(Boolean).slice(-2);
  let deeper=pool.filter(i=>i.k!==u.k&&i.subj===u.subj&&i.level>u.level&&ids.some(d=>(i.dk||[]).includes(d))).slice(0,3);
  if(!deeper.length&&u.board!=="gen"&&u.board!=="dk"){const us=DATA.items.filter(i=>i.board===u.board&&i.subj===u.subj&&i.book===u.book),j=us.findIndex(i=>i.k===u.k);deeper=us.slice(j+1,j+2)}
  const wider=[...(u.board==="dk"?[]:ids.map(d=>pool.find(i=>i.k==="dk|"+d)).filter(Boolean)),...pool.filter(i=>i.k!==u.k&&i.subj!==u.subj&&ids.some(d=>(i.dk||[]).includes(d)))].slice(0,4);
  const names=u.board==="gen"?u.gen.related||{}:{};return {pre,deeper,wider,names}}
const uchip=v=>`<button class="chip ${SC(v.subj)}" data-act="chapter" data-k="${v.k}"><span class="dotc"></span>${esc(v.title)}</button>`;
function topicOverview(u){const m=modeOf(),T=tagsOf(u),I=ideasOf(u),R=relatedOf(u),sub=subjectsOf(u);
  let h=`<section class="card"><span class="eyebrow">Where this topic sits</span><div class="row">${T.length?T.map(t=>`<span class="chip">${esc(t.txt)}</span>`).join(""):`<span class="chip">Not in a board syllabus · DeepKids topic</span>`}${sub.length>1?sub.map(s=>`<span class="chip ${SC(s)}"><span class="dotc"></span>${SUBJ[s]}</span>`).join(""):""}</div>
    <span class="eyebrow" style="margin-top:4px">Summary</span><p>${esc(summaryOf(u))}</p></section>`;
  h+=`<section class="oneness"><span class="eyebrow">Big ideas</span>${I.sum?`<p>${esc(I.sum)}</p>`:""}<ul style="margin:8px 0 0;padding-left:20px;display:grid;gap:4px;font-weight:700">${I.ideas.map(i=>`<li>${esc(i)}</li>`).join("")}</ul></section>`;
  if(m==="books")h+=`<section class="card r-you tint"><b style="font:600 16px var(--display)">Lesson plans come with DeepKids Plus</b><p class="sm">Ready-made plans for full and busy days, big questions, worksheets and games. Switch in Settings.</p></section>`;
  if(u.board!=="gen"&&u.board!=="dk"&&m==="plus")h+=`<section class="card"><span class="eyebrow">Suggested reading</span><p class="sm">${esc(u.book)}${chNo(u)?", "+chNo(u):""}${(u.c?.read||[]).length?"; "+u.c.read.map(esc).join("; "):""}</p></section>`;
  if(u.board==="gen"&&(u.gen.books||[]).length)h+=`<section class="card" style="gap:0"><span class="eyebrow" style="margin-bottom:4px">Books to try</span>${u.gen.books.slice(0,5).map(b=>`<a class="res" href="${AZ((b.title||"")+" "+(b.author||""))}" target="_blank" rel="noopener"><b>${esc(b.title)} ↗</b><span class="xs muted">${esc(b.author||"")}${b.why?" · "+esc(b.why):""}</span></a>`).join("")}</section>`;
  if(R.pre.length||R.deeper.length||R.wider.length||Object.keys(R.names).length)h+=`<section class="card"><span class="eyebrow">Related topics</span>${R.pre.length?`<div><span class="xs muted">Needs first</span><div class="row">${R.pre.map(uchip).join("")}</div></div>`:""}${R.deeper.length?`<div><span class="xs muted">Go deeper</span><div class="row">${R.deeper.map(uchip).join("")}</div></div>`:""}${R.wider.length?`<div><span class="xs muted">Go wider</span><div class="row">${R.wider.map(uchip).join("")}</div></div>`:""}${["prereq","deeper","wider"].filter(k=>(R.names[k]||[]).length).map(k=>`<div><span class="xs muted">${{prereq:"Needs first",deeper:"Go deeper",wider:"Go wider"}[k]}</span><div class="row">${R.names[k].slice(0,4).map(n=>`<button class="chip" data-act="tsearch" data-q="${esc(n)}">${esc(n)}</button>`).join("")}</div></div>`).join("")}</section>`;
  return h}
function plansTab(u){const ty=ui.ptype||"full",P=planOptions(u)[ty]||[],pk=((S.planPick||{})[u.k]||{})[ty]||P[0]?.id;
  return `<div class="seg"><button aria-pressed="${ty==="full"}" data-act="ptype" data-t="full">Full day · 3 plans</button><button aria-pressed="${ty==="busy"}" data-act="ptype" data-t="busy">Busy day · 3 plans</button></div><p class="xs muted">Pick one for ${ty==="full"?"full":"busy"} days. The plans you don't pick come back as games, refreshers and jokes on other days.</p>
   ${P.map((o,i)=>`<section class="card optcard ${o.id===pk?"chosen":""}" style="--c:${PAL[(i+(ty==="busy"?3:0))%PAL.length]}"><div class="sech"><b style="font:600 18px var(--display)">${esc(o.name)}</b>${o.id===pk?`<span class="pill completed">Chosen</span>`:o.placeholder?`<span class="pill">Placeholder</span>`:o.gen?`<span class="pill learning">Claude draft</span>`:""}</div><p class="sm">${esc(o.idea)}</p>${o.parts?`<ol class="dsteps">${o.parts.map(p=>`<li><span>${esc(p.label)}</span><b>${esc(p.title)}</b><i>${p.mins?p.mins+" min":Math.round(p.f*100)+"%"}</i></li>`).join("")}</ol>`:`<p class="xs muted">${sessionsFor(u)} lesson days, step by step.</p>`}${o.id!==pk?`<button class="btn sm" data-act="ppick" data-k="${u.k}" data-t="${ty}" data-o="${o.id}" style="justify-self:start">Use this plan</button>`:""}</section>`).join("")}`}
/* ---------- your learning: kept out of the way, opened on purpose ---------- */
function learnItems(){const out=[],seen=new Set(),seenT=new Set();[today,tomorrow()].forEach(d=>lessonsOn(d).forEach(l=>{if(l.done||!l.n)return;prepFor(l.u,l.n,l.tot).filter(p=>LEARNK.has(p.kind)).forEach(p=>{const tk=l.u.k+"|"+p.task;if(!seen.has(p.id)&&!seenT.has(tk)){seen.add(p.id);seenT.add(tk);out.push({...p,u:l.u,s:l.s,date:d})}})}));return out}
function learnView(){document.getElementById("sheetTitle").textContent="For you";const its=learnItems(),groups=[];its.forEach(p=>{let g=groups.find(g=>g.u.k===p.u.k);if(!g)groups.push(g={u:p.u,s:p.s,items:[]});g.items.push(p)});
  const help=(S.parent?.help||[]).filter(s=>S.subjects.includes(s));
  return `<section class="card r-you tint"><h2 style="font-size:22px">Your learning</h2><p class="sm muted">Guides and reading to help you teach today and tomorrow. Nothing here is required.</p></section>
   ${groups.map(g=>{const guide=g.u.c?.x?.guide||(g.u.board!=="dk"&&g.u.board!=="gen"?DATA.prepgen.guide[g.u.subj]:summaryOf(g.u));return `<section class="card ${SC(g.s)}"><div class="row" style="gap:8px">${sblob(g.s,"happy","",'width="32" height="32"')}<b style="font:600 17px var(--display)">${esc(g.u.title)}</b></div>${guide?`<p class="sm">${esc(guide)}</p>`:""}${g.items.filter(p=>p.kind!=="guide").map(p=>`<div class="taskrow ${S.prep[p.id]?"done":""}"><button class="ckb" data-act="prep" data-id="${p.id}" aria-label="Done: ${esc(p.task)}">${icon("check")}</button><div><b style="font-weight:800">${esc(p.task)}</b><p class="xs muted">From: ${esc(p.where)}</p></div></div>`).join("")}<button class="btn soft sm" data-act="chapter" data-k="${g.u.k}" style="justify-self:start">Open the topic</button></section>`}).join("")||`<p class="note">Nothing to read for today or tomorrow.</p>`}
   ${help.length?`<section class="card"><span class="eyebrow">Subjects you asked for help with</span>${help.map(s=>`<p class="sm"><b>${SUBJ[s]}:</b> ${esc(DATA.prepgen.guide[s])}</p>`).join("")}</section>`:""}`}

/* ---------- topics: search, Claude-written topics saved for everyone ---------- */
function topicHits(q){q=q.trim().toLowerCase();if(!q)return [];const words=q.split(/\s+/).filter(w=>w.length>2);return allUnits().map(u=>{const hay=(u.title+" "+(u.c?.covers||"")+" "+(u.topic?.summary||"")+" "+(u.gen?.summary||"")).toLowerCase();let sc=hay.includes(q)?5:0;words.forEach(w=>{if(hay.includes(w))sc++});if(u.title.toLowerCase().includes(q))sc+=5;return {u,sc}}).filter(x=>x.sc>0).sort((a,b)=>b.sc-a.sc).slice(0,12).map(x=>x.u)}
function topicRow(u){const T=tagsOf(u)[0];return `<div class="topic ${SC(u.subj)}"><button class="plain trow" data-act="chapter" data-k="${u.k}"><span class="no">${/^\d+$/.test(u.n)?u.n:esc(u.n)}</span><span style="min-width:0"><b>${esc(u.title)}</b><br><span class="xs muted">${SUBJ[u.subj]} · ${u.board==="gen"?"DeepKids topic"+(u.gen.reviewed?"":" · not yet reviewed"):u.board==="dk"?"DeepKids Plus":esc(T?.txt||u.book)}</span></span>${pillS(coverage(u))}</button></div>`}
function topicsTab(){const q=ui.tq||"",hits=topicHits(q),gen=SHARED.topics.slice().sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,8);
  let h=`<section class="sec"><div class="card"><div class="row" style="flex-wrap:nowrap"><input class="inp" id="tq" placeholder="Search any topic: volcanoes, fractions, Akbar…" value="${esc(q)}" maxlength="80"><button class="btn sm" data-act="tfind">Search</button></div>
    <p class="xs muted">${q?`${hits.length} found in the syllabuses and DeepKids topics.`:"Search, or browse every chapter of every board below."}</p></div>`;
  if(q){h+=hits.map(topicRow).join("")+`<section class="card r-out tint"><b style="font:600 17px var(--display)">Explore “${esc(q)}” as a new topic</b><p class="sm">Claude writes a summary, big ideas, lesson plans, related topics and books, and tags it to any syllabus it belongs to. It's saved to DeepKids so other families find it too.</p>${SAMPLE?`<button class="btn sm" data-act="tgen" style="justify-self:start" ${ui.tgen?"disabled":""}>${ui.tgen?"Writing the topic…":"Create this topic"}</button>`:`<p class="xs muted">Exploring new topics is part of DeepKids Plus.</p>`}${ui.terr?`<p class="sm" style="color:var(--bad)">${esc(ui.terr)}</p>`:""}</section></section>`;return h}
  const B=ui.bb||boardsOn()[0]||"ncert",subjs=[...new Set(allUnits().filter(u=>u.board===B).map(u=>u.subj))],sj=subjs.includes(ui.bs)?ui.bs:(subjs.includes("sci")?"sci":subjs[0]),levels=[...new Set(allUnits().filter(u=>u.board===B&&u.subj===sj).map(u=>u.level))].sort(),lv=levels.includes(ui.bl)?ui.bl:(levels.includes(S.levels?.[sj])?S.levels[sj]:levels[0]);
  const units=allUnits().filter(u=>u.board===B&&u.subj===sj&&u.level===lv),lvName=l=>B==="ncert"||B==="waldorf"?"Class "+l:B==="cambridge"?"Stage "+l:B==="nios"?"Level "+(l<=3?"A":"B"):"Level "+l;
  h+=`<div class="sech"><h3 style="font-size:18px">Browse the syllabus</h3></div>
   <div class="row chips">${["ncert","cambridge","nios","waldorf","dk"].map(b=>`<button class="chip" aria-pressed="${B===b}" data-act="bb" data-b="${b}">${BNAME[b]}</button>`).join("")}</div>
   ${subjs.length>1?`<div class="row chips">${subjs.map(s=>`<button class="chip" aria-pressed="${sj===s}" data-act="bs" data-s="${s}">${SUBJ[s]}</button>`).join("")}</div>`:""}
   ${levels.length>1?`<div class="row chips">${levels.map(l=>`<button class="chip" aria-pressed="${lv===l}" data-act="bl" data-l="${l}">${lvName(l)}</button>`).join("")}</div>`:""}
   <p class="xs muted">${units.length} ${B==="cambridge"?"units":B==="nios"?"lessons":B==="dk"?"topics":B==="waldorf"?"blocks":"chapters"}${units.filter(u=>u.c?.p).length?` · ${units.filter(u=>u.c?.p).length} with full day plans`:""}${units[0]?" · "+esc(units[0].book):""}</p>
   ${units.map(u=>topicRow(u).replace("</b><br>",`</b>${u.c?.p?` <span class="pill completed" style="font-size:11px">${u.c.p.days.length} parts</span>`:""}<br>`)).join("")||`<p class="note">${(DATA.notes[B]||{})[sj+"|"+lv]||(B==="ncert"?DATA.notes.ncert[sj+"|"+lv]:"")||"Nothing here yet."}</p>`}`;
  if(gen.length)h+=`<div class="sech"><h3 style="font-size:18px">Explored by families</h3></div>${gen.map(g=>topicRow(genUnit(g))).join("")}`;
  return h+`</section>`}
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"topic";
async function genTopic(){const q=(ui.tq||"").trim();if(!q||!SAMPLE)return;ui.tgen=true;ui.terr="";render();
  const list=DATA.items.filter(i=>i.board==="ncert"||i.level<=5).map(i=>`${i.k}: ${i.title}`).join("\n").slice(0,40000);
  const prompt=`You write topics for DeepKids, a homeschool app for Indian families with children aged 6–10 (Levels 1–5 = Classes 1–5). A parent searched for: "${q.slice(0,80)}". The child is ${S.age}.
Write one topic level for this, pitched at the right level. Keep substance; never dumb it down. Include Indian perspectives and, where they fit, Vedic, consciousness and oneness ideas, and at least one real scientific debate or contrarian view. Use only English.
Tag it to any of these syllabus chapters that genuinely cover it (use the keys exactly; empty if none):
${list}
Reply with only JSON:
{"name":"","subj":"math|eng|hin|sci","subjects":["math|eng|hin|sci"],"level":1,"hours":3,"tags":["key"],"summary":"3-4 sentences","plusSummary":"1-2 sentences, the wonder of it","ideas":["challenging idea","another","a contrarian view"],"plans":{"full":[{"name":"","idea":"","steps":[{"kind":"read|learn|exp|act|game|proj","title":"","mins":20,"how":"what to do, concretely"}]}],"busy":[{"name":"","idea":"","steps":[{"kind":"","title":"","mins":10,"how":""}]}]},"related":{"prereq":["topic name"],"deeper":["topic name"],"wider":["topic name"]},"books":[{"title":"","author":"","why":""}]}
Give exactly 3 full-day plans (about 60–90 minutes each) and 3 busy-day plans (about 30 minutes each). Only list books you are sure exist. No URLs.`;
  try{const r=await SAMPLE.json(prompt,{modelTier:"default",cache:false});if(!r||!r.name)throw {code:"invalid_json"};
    const g={id:slug(r.name),name:String(r.name).slice(0,80),subj:SUBJ[r.subj]?r.subj:"sci",subjects:(r.subjects||[]).filter(s=>SUBJ[s]),level:Math.min(5,Math.max(1,+r.level||S.levels[r.subj]||1)),hours:Math.min(20,Math.max(1,+r.hours||3)),tags:(r.tags||[]).filter(k=>DATA.items.some(i=>i.k===k)).slice(0,6),summary:String(r.summary||"").slice(0,1200),plusSummary:String(r.plusSummary||"").slice(0,400),ideas:(r.ideas||[]).slice(0,5).map(x=>String(x).slice(0,300)),plans:{full:(r.plans?.full||[]).slice(0,3),busy:(r.plans?.busy||[]).slice(0,3)},related:{prereq:(r.related?.prereq||[]).slice(0,4).map(String),deeper:(r.related?.deeper||[]).slice(0,4).map(String),wider:(r.related?.wider||[]).slice(0,4).map(String)},books:(r.books||[]).slice(0,5).map(b=>({title:String(b.title||"").slice(0,100),author:String(b.author||"").slice(0,80),why:String(b.why||"").slice(0,160)})),source:"search",query:q.slice(0,80),reviewed:false,createdAt:Date.now(),by:UID||""};
    SHARED.topics=[...SHARED.topics.filter(x=>x.id!==g.id),g];_all=null;
    if(DBH){try{await DBH.collection("topics").doc(g.id).set(g);await DBH.collection("searches").add({q:q.slice(0,80),topic:g.id,at:Date.now(),by:UID||""})}catch(e){ui.terr="Saved on this device only; the shared library couldn't be reached."}}
    ui.tgen=false;sfx("win");render();openSheet({mode:"chapter",k:"gen|"+g.id})}
  catch(e){ui.tgen=false;ui.terr=({not_granted:"Claude wasn't allowed for this page.",rate_limited:"Too many requests just now. Try again in a minute.",invalid_json:"The topic didn't come back in the right shape. Try again."})[e?.code]||"Something went wrong. Try again.";sfx("no");render()}}

/* ---------- Up next: the topic queue ---------- */
const qPos=u=>plannedUnits(u.subj).filter(z=>rank[coverage(z)]<2||z.k===u.k).findIndex(z=>z.k===u.k)+1;
function queueCard(){const s=S.subjects.includes(ui.qs)?ui.qs:S.subjects[0];if(!s)return "";const extra=(S.extra||{})[s]||[],L0=plannedUnits(s).filter(u=>rank[coverage(u)]<2),L=L0.filter((u,i)=>i<8||extra.includes(u.k)),sh=!!(S.shuffle||{})[s];
  const radio=allUnits().filter(u=>u.subj===s&&(u.board==="gen"||(u.board==="dk"&&plusOn()))&&!plannedUnits(s).some(z=>z.k===u.k)).slice(0,4);
  return `<section class="sec"><div class="sech"><h3>Up next</h3><span class="xs muted">${modeOf()==="books"?"Syllabus books":MODES[modeOf()][0]}</span></div>
   <div class="seg">${S.subjects.map(x=>`<button aria-pressed="${x===s}" data-act="qsub" data-s="${x}">${SUBJ[x]}</button>`).join("")}</div>
   <div class="row"><button class="btn ${sh?"":"soft"} sm" data-act="shuffle" data-s="${s}">${icon("spark")}Smart shuffle ${sh?"on":"off"}</button>${sh?`<button class="btn soft sm" data-act="reshuffle" data-s="${s}">Shuffle again</button>`:""}<button class="btn ${S.exam?"":"soft"} sm" data-act="exam">${S.exam?"Exam track on":"Exam track off"}</button></div>
   <p class="xs muted">${sh?"Shuffle respects what each topic needs first, and never drops a syllabus chapter.":"Book order."} ${S.exam?"Exam track keeps every syllabus chapter first; extra topics come after.":"Extra topics are mixed in between syllabus chapters."}</p>
   <div class="col" style="gap:8px">${L.map((u,i)=>{const T=tagsOf(u)[0];return `<div class="qrow ${SC(u.subj)}${u.k===ui.flash?" flash":""}"><span class="qn">${L0.indexOf(u)+1}</span><button class="plain" data-act="chapter" data-k="${u.k}" style="min-width:0"><b style="font:600 15.5px var(--display)">${esc(u.title)}</b><br><span class="xs muted">${u.board==="gen"?"DeepKids topic":u.board==="dk"?"DeepKids Plus":esc(T?.txt||u.book)} · ${sessionsFor(u)} days</span></button><span class="row" style="gap:4px;flex-wrap:nowrap">${i?`<button class="iconbtn" style="width:36px;height:36px" data-act="qnext" data-s="${s}" data-k="${u.k}" aria-label="Do ${esc(u.title)} next">${icon("play")}</button>`:`<span class="pill learning">Next</span>`}<button class="iconbtn" style="width:36px;height:36px" data-act="qlater" data-s="${s}" data-k="${u.k}" aria-label="Move ${esc(u.title)} to later">${icon("next")}</button>${extra.includes(u.k)?`<button class="iconbtn" style="width:36px;height:36px" data-act="qrem" data-s="${s}" data-k="${u.k}" aria-label="Remove ${esc(u.title)}">${icon("close")}</button>`:""}</span></div>`}).join("")}</div>
   ${radio.length?`<div class="sech"><h3 style="font-size:17px">More like this</h3><button class="link" data-act="lt2">Find topics</button></div><div class="row">${radio.map(u=>`<button class="chip ${SC(u.subj)}" data-act="qadd" data-s="${s}" data-k="${u.k}">${icon("plus")}${esc(u.title)}</button>`).join("")}</div>`:`<button class="link" data-act="lt2" style="justify-self:start">Find more topics →</button>`}</section>`}

/* ---------- calendars ---------- */
function parseICS(txt){const lines=txt.replace(/\r?\n[ \t]/g,"").split(/\r?\n/),ev=[];let cur=null;
  for(const l of lines){if(l==="BEGIN:VEVENT")cur={};else if(l==="END:VEVENT"){if(cur)ev.push(cur);cur=null}else if(cur){const i=l.indexOf(":");if(i<0)continue;cur[l.slice(0,i).split(";")[0]]=l.slice(i+1)}}
  const P=v=>{const m=(v||"").match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?/);if(!m)return null;return {d:m[4]?(m[7]?new Date(Date.UTC(+m[1],m[2]-1,+m[3],+m[4],+m[5])):new Date(+m[1],m[2]-1,+m[3],+m[4],+m[5])):new Date(+m[1],m[2]-1,+m[3]),allDay:!m[4]}};
  const BY={SU:0,MO:1,TU:2,WE:3,TH:4,FR:5,SA:6},lim=addDays(today,90),hh=d=>String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0"),out=[];
  ev.forEach(e=>{const s=P(e.DTSTART),en=P(e.DTEND);if(!s)return;const rr=e.RRULE||"",weekly=/FREQ=(WEEKLY|DAILY)/.test(rr),until=(rr.match(/UNTIL=(\d{8})/)||[])[1],ds=iso(s.d);
    if(!weekly&&(ds<today||ds>lim))return;if(weekly&&until&&until<today.replace(/-/g,""))return;
    let days=null;if(weekly){days=/DAILY/.test(rr)?[0,1,2,3,4,5,6]:((rr.match(/BYDAY=([A-Z0-9,+-]+)/)||[])[1]||"").split(",").map(x=>BY[x.replace(/[^A-Z]/g,"")]).filter(x=>x!==undefined);if(!days.length)days=[s.d.getDay()]}
    const title=(e.SUMMARY||"Calendar event").replace(/\\,/g,",").replace(/\\n/g," ").replace(/\\;/g,";").slice(0,80);
    out.push({type:"calendar",title,who:"you",date:weekly?null:ds,days,start:s.allDay?null:hh(s.d),end:en&&!en.allDay?hh(en.d):null,note:"From your calendar",keep:true})});
  return out.slice(0,80)}
function calendarCard(){if(window.DK_PLATFORM?.name==="web")return `<section class="card"><div class="row" style="flex-wrap:nowrap;gap:12px">${blob("var(--sky)",14,"happy","",'width="46" height="46"')}<div><h3 style="font-size:19px">Your calendars</h3><p class="xs muted">Live Google Calendar linking is coming soon. For now, bring in a calendar file: you choose what to keep.</p></div></div><p class="xs muted">Google Calendar on a computer: Settings → Import & export → Export, then unzip. Apple Calendar on a Mac: File → Export.</p><label class="btn soft sm" style="cursor:pointer;justify-self:start">${icon("plus")}Choose an .ics file<input type="file" id="icsFile" accept=".ics,text/calendar" hidden></label></section>`;const C=S.cal||{},busy=ui.gcBusy,err=C.err?`<p class="sm" style="color:var(--bad)">${esc(GCERR[C.err]||"Couldn't read your calendar ("+C.err+"). Try Refresh.")}</p>`:"";
  const ics=`<details style="margin-top:6px"><summary class="link sm" style="cursor:pointer">Use Apple or Outlook? Import a file instead</summary><p class="xs muted">Export an .ics file and pick it here. You choose what to keep. A file doesn't update by itself.</p><label class="btn soft sm" style="cursor:pointer;justify-self:start">${icon("plus")}Choose an .ics file<input type="file" id="icsFile" accept=".ics,text/calendar" hidden></label></details>`;
  if(C.on){const n=(C.ev||[]).filter(e=>e.date>=today).length,L=C.list||[];return `<section class="card"><div class="row" style="flex-wrap:nowrap;gap:12px">${blob("var(--sky)",14,"happy","",'width="46" height="46"')}<div><h3 style="font-size:19px">Google Calendar is linked</h3><p class="xs muted">${n} event${n===1?"":"s"} in the next 60 days${C.at?" · updated "+new Date(C.at).toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"}):""}. It refreshes by itself while DeepKids is open, and the day plan works around it.</p></div></div>
    ${L.length>1?`<div class="col" style="gap:6px"><span class="xs muted">Calendars to show</span><div class="row">${L.map(c=>`<button class="chip" aria-pressed="${(C.cals||[]).includes(c.id)}" data-act="gccal" data-id="${esc(c.id)}">${esc(c.name)}</button>`).join("")}</div></div>`:""}
    ${err}<div class="row"><button class="btn soft sm" data-act="gcsync" ${busy?"disabled":""}>${busy?"Refreshing…":"Refresh now"}</button><button class="link sm" data-act="gcoff">Unlink</button></div>${ics}</section>`}
  return `<section class="card"><div class="row" style="flex-wrap:nowrap;gap:12px">${blob("var(--sky)",14,"happy","",'width="46" height="46"')}<div><h3 style="font-size:19px">Link your calendar</h3><p class="xs muted">Classes, tuitions, outings and busy times flow in by themselves and stay up to date. DeepKids only reads your calendar; it never changes it.</p></div></div>
    <button class="btn accent sm" data-act="gcsync" style="justify-self:start" ${busy?"disabled":""}>${busy?"Connecting…":"Connect Google Calendar"}</button>${err}<p class="xs muted">First time: claude.ai asks you to add Google Calendar under Settings → Connectors and to allow DeepKids to read it.</p>${ics}</section>`}
const nowMin=()=>{const d=new Date();return d.getHours()*60+d.getMinutes()};
const sid=x=>x.kind+"|"+x.title;
let SAMPLE=null,ASSETS=null,IMGOK=false;
function focusOf(items,date){if(date!==today)return null;const nm=nowMin(),d=Dd(date),real=items.filter(i=>i.kind!=="brk"&&!i.done&&!snzd(i,date)&&!evPast(i,date));if(!real.length)return null;
  const pm=real.find(i=>i.id==="pm");if(pm&&nm>=hm(d.eveAt)-30)return pm;const R=real.filter(i=>i.id!=="pm");
  const now=R.find(i=>!i.anytime&&i.at<=nm&&nm<i.at+i.dur);if(now)return now;
  const next=R.filter(i=>!i.anytime&&i.at>nm),missed=R.filter(i=>OURS(i)&&!i.anytime&&i.at+i.dur<=nm);
  if(missed.length&&!(next[0]&&next[0].at-nm<=15))return missed[0];
  return next[0]||missed[0]||R.find(i=>i.anytime&&OURS(i))||R.find(i=>i.anytime)||pm||null}
const isMissed=(it,date)=>date===today&&!it.done&&!it.anytime&&OURS(it)&&it.kind!=="brk"&&!snzd(it,date)&&it.at+it.dur<nowMin();
function photoBtn(k,label){return ASSETS?`<label class="btn soft sm" style="cursor:pointer">${icon("plus")}${label||"Add a photo of the work"}<input type="file" accept="image/*" data-upload="${k}" hidden></label>`:""}
function workOf(k){return (S.work||[]).filter(w=>!k||w.k===k)}
const thumbs=list=>list.length?`<div class="thumbs">${list.map(w=>`<figure><img src="/_blob/${esc(w.id)}" alt="Work from ${esc(w.title||"")}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'ph',textContent:'Photo'}))"><figcaption class="xs muted">${fmt(w.date)}</figcaption></figure>`).join("")}</div>`:"";

/* ---------- Today: greeting, then the day on the clock ---------- */
function itemDetail(it,date){const isT=date===today;
  if(it.kind==="refresh")return `<p class="sm" style="font-weight:700">${esc(it.rf.title)}</p><p class="xs muted">A 15-minute return to ${esc(it.rf.u.title)}, then 3 quick questions.</p><div class="row"><button class="btn sm" data-act="refresh" data-date="${date}">${icon("play")}Play it</button></div>`;
  if(it.kind==="plan")return `<p class="sm" style="font-weight:700">${esc(it.sub)}</p><div class="row"><button class="btn sm" data-act="quickplan">Open the Planner</button></div>`;
  if(it.kind==="lesson"){const st=stepState(it),prep=prepFor(it.u,it.n,it.tot).filter(p=>p.lead===0);return `<div class="sm muted" style="font-weight:700">${esc(it.u.book)}${chNo(it.u)?" · "+chNo(it.u):""} · Part ${it.n} of ${it.tot}</div>
    <ol class="dsteps">${st.map(x=>`<li class="${x.ok?"ok":""}"><span>${esc(x.label)}</span><b>${esc(x.title)}</b><i>${mins(x.mins)}</i></li>`).join("")}</ol>
    ${prep.length?`<div class="sm"><b style="font-family:var(--display)">Have ready:</b> ${prep.map(p=>esc(p.task.replace(/^(Gather|Get) /,""))).join(" · ")}</div>`:""}
    <div class="row">${isT&&!it.done?`<button class="btn" data-act="play" data-id="${it.id}">${icon("play")}${st.some(x=>x.ok)?"Keep going":"Start the lesson"}</button>`:""}${!isT||it.done?`<button class="btn soft sm" data-act="chapter" data-k="${it.u.k}">Everything for this chapter</button>`:""}${!it.done&&!it.bonus?`<button class="btn soft sm" data-act="swap" data-s="${it.s}">Swap topic</button>`:""}${isT&&!it.done?(it.bonus?`<button class="btn line sm" data-act="less" data-s="${it.s}">Not now</button>`:`<button class="btn line sm" data-act="skip" data-s="${it.s}">Not today</button>`):""}</div>${lessonExtras(it.u)}`}
  if(it.kind==="prep"){const more=it.prep.length-4;return `<div class="col" style="gap:0">${it.prep.slice(0,4).map(p=>`<div class="taskrow ${S.prep[p.id]?"done":""}"><button class="ckb" data-act="prep" data-id="${p.id}" aria-label="Ready: ${esc(p.task)}">${icon("check")}</button><div><b style="font-weight:800">${esc(p.task)}</b>${p.early?` <span class="pill learning">early start for ${fmt(p.x.date)}</span>`:""}<p class="xs muted">${SUBJ[p.x.subj]} · ${esc(p.x.u.title)} · from ${esc(p.where)}</p></div></div>`).join("")}</div><div class="row">${more>0?`<button class="btn soft sm" data-act="tlopen" data-id="${it.id}" data-date="${date}">See all ${it.prep.length}</button>`:""}${it.id==="pm"?`<button class="btn" data-act="night">Get ready for tomorrow</button>`:`<button class="btn soft sm" data-act="tlopen" data-id="${it.id}" data-date="${date}">Parent guides</button>`}</div>`}
  if(it.kind==="warm"){const du=dailyUnit();const j=du?splitJoke(du.c.x.jokes[0]):null;return `${j?`<div class="ask"><span class="eyebrow">Joke 1</span>${esc(j[0])} <i>${esc(j[1])}</i></div>`:""}<div class="row"><button class="btn" data-act="games">Jokes and games</button></div>`}
  if(it.kind==="exps")return `<div class="col" style="gap:8px">${S.exps.filter(e=>!e.closed&&e.start<=date).map(e=>`<div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span class="sm" style="font-weight:800">${esc(e.title)}</span><button class="btn xs ${e.checks.includes(today)?"soft":""}" data-act="check" data-e="${e.id}">${e.checks.includes(today)?"Checked":"Check"}</button></div>`).join("")}</div>`;
  if(it.kind==="event"){const e=it.ev;return `<p class="sm" style="font-weight:700">${clock(hm(e.start))} to ${clock(hm(e.end))} · ${ROLE[e.kind==="outing"?"out":e.who]}${e.rep==="weekly"?" · every "+e.days.map(d=>DAYN[d]).join(", "):""}${e.note?" · "+esc(e.note):""}</p><div class="row"><button class="btn line sm" data-act="delev" data-e="${e.id}">Remove</button></div>`}
  if(it.kind==="todo")return `<p class="sm" style="font-weight:700">${esc(it.sub)}</p><div class="row"><button class="btn soft sm" data-act="todomove" data-t="${it.td.id}">Move to tomorrow</button><button class="btn line sm" data-act="tododel" data-t="${it.td.id}">Remove</button></div>`;
  return ""}
function tRow(it,date,focus){const col=it.kind==="lesson"?SC(it.s):"r-"+it.who,[hh,ap]=it.anytime?["Any","time"]:it.done&&it.doneNoTime?["Done",""]:clock(it.at).split(" ");
  if(it.kind==="brk")return `<div class="tr brk"><span class="t num">${hh}<small>${ap}</small></span><span class="brkline">${esc(it.title)} · ${mins(it.dur/60)}</span></div>`;
  const open=!!ui.open[it.id],missed=isMissed(it,date)&&it!==focus,a=`data-id="${it.id}" data-date="${date}"`;
  const late=isMissed(it,date),tag=it===focus?(late?`<span class="tag now">Pending</span>`:`<span class="tag now">${date===today&&!it.anytime&&it.at<=nowMin()&&nowMin()<it.at+it.dur?"Now":"Up next"}</span>`):evPast(it,date)?`<span class="tag miss">Did it happen?</span>`:snzd(it,date)?`<span class="tag">Later today</span>`:missed?`<span class="tag miss">Pending</span>`:"";
  return `<div class="tr ${col} ${it.done?"done":""} ${it===focus?"focus":""} ${missed?"missed":""}"><span class="t num">${hh}<small>${ap}</small></span><div class="tcard"><span class="ic">${icon(KICO[it.kind]||"spark")}</span><button class="m plain" data-act="topen" data-id="${it.id}" aria-expanded="${open}"><b>${esc(it.kind==="lesson"?chT(it.u):it.title)}</b><span>${tag}${it.kind==="lesson"?SUBJ[it.s]+" · "+(it.n?`Part ${it.n}${it.tot?" of "+it.tot:""} · `:""):""}${S.tl[date+"|"+it.id]==="skip"?"skipped today":S.tl[date+"|"+it.id]==="missed"?"didn't happen":it.skipped?"skipped":it.done&&it.doneAt!=null?"done at "+clock(it.doneAt):it.done&&it.doneNoTime?"done, time not recorded":(it.kind==="event"&&it.ev?evShort(it.ev):ROLE[it.who])+" · "+mins(it.dur/60)}</span></button><button class="ck" data-act="tlcheck" ${a} aria-label="${it.done?"Done":"Mark done"}: ${esc(it.title)}">${icon("check")}</button>${open?`<div class="tdet">${itemDetail(it,date)}</div>`:""}</div></div>`}
function timeline(date){const items=dayPlan(date),f=focusOf(items,date);return items.length?`<div class="tt compact">${items.map(i=>tRow(i,date,f)).join("")}</div>`:`<p class="note">Nothing planned for this day yet.</p>`}
const tomorrow=()=>addDays(today,1);
function nightItems(){const seen=new Set(),out=[];[...prepBlock(today,"pm"),...prepBlock(tomorrow(),"am").filter(p=>p.lead===0)].forEach(p=>{if(!seen.has(p.id)){seen.add(p.id);out.push(p)}});return out}
const nightDue=()=>{const its=nightItems();return S.setup&&!(S.night||{})[today]&&nowMin()>=hm(D().eveAt)&&(its.length>0||dayPlan(tomorrow()).some(i=>i.kind==="lesson"))};
const greetWord=()=>{const h=new Date().getHours();return h<12?"Good morning":h<17?"Good afternoon":"Good evening"};

/* ---------- night before ---------- */
function nightView(){const tm=tomorrow(),its=nightItems(),dn=its.filter(p=>S.prep[p.id]).length,tp=dayPlan(tm).filter(i=>i.kind!=="brk"),d=Dd(tm),al=S.alarm||{on:false,time:"06:30"};
  document.getElementById("sheetTitle").textContent="Tomorrow · "+fmt(tm);
  return `<section class="card r-you tint"><div class="sech"><h3>Things to get ready</h3><span class="pill">${dn} of ${its.length}</span></div>${its.length?`<div class="col" style="gap:0">${its.map(p=>`<div class="taskrow ${S.prep[p.id]?"done":""}"><button class="ckb" data-act="prep" data-id="${p.id}" aria-label="Ready: ${esc(p.task)}">${icon("check")}</button><div><b style="font-weight:800">${esc(p.task)}</b><p class="xs muted">${SUBJ[p.x.subj]} · ${esc(p.x.u.title)} · from ${esc(p.where)}</p></div></div>`).join("")}</div>`:`<p class="sm muted">Nothing to get ready tonight.</p>`}</section>
   <section class="card"><h3 style="font-size:19px">Tomorrow's plan</h3>${tp.length?tp.map(i=>`<div class="row sm ${i.kind==="lesson"?SC(i.s):"r-"+i.who}" style="flex-wrap:nowrap;font-weight:700"><span class="dotc"></span><span class="muted num" style="min-width:64px">${i.anytime?"Any time":clock(i.at)}</span><span>${esc(i.kind==="lesson"?SUBJ[i.s]+": "+i.u.title:i.title)}</span></div>`).join(""):`<p class="sm muted">Nothing planned yet.</p>`}</section>
   <section class="card"><h3 style="font-size:19px">Your morning</h3><div class="fgrid"><div class="field"><label for="nWake">I'll wake up at</label><input class="inp" id="nWake" type="time" value="${al.time}" data-alarm="time"></div><div class="field"><label for="nStart">Start learning with ${esc(S.child||"my child")} at</label><input class="inp" id="nStart" type="time" value="${d.start}" data-over="${tm}"></div></div>
     <label class="toggle" style="box-shadow:none;padding:0"><input type="checkbox" id="nAlarm" ${al.on?"checked":""} data-alarm="on"><span><b style="font:600 16px var(--display)">Wake-up alarm</b><br><span class="xs muted">Rings only while DeepKids is open on this phone. For a sure wake-up, also set your phone's alarm for ${clock(hm(al.time))}.</span></span></label></section>
   <section class="card"><h3 style="font-size:19px">Any other plans tomorrow?</h3>${quickAdd(tm)}</section>
   <button class="btn green" data-act="nightdone">${icon("check")}${(S.night||{})[today]?"Tomorrow is ready":"All set for tomorrow"}</button>`}
function quickAdd(date){const Q=ui.qdraft||{},w=ui.qwho||"you",r=ui.qrep||"once",kd=ui.qkind||"other",days=ui.qdays||[],todo=kd==="todo";
  return `<div class="col" style="gap:10px"><input class="inp" id="qa-t" maxlength="80" value="${esc(Q.t||"")}" placeholder="${kd==="class"?"Science tuition, swimming, tabla":kd==="rest"?"Nap, lunch, quiet time":kd==="outing"?"Zoo trip, park, grandma's house":todo?"Buy chart paper, call the coach":"Dentist, cousin's birthday"}">
   <div class="row chips">${QKIND.map(([k,n])=>`<button type="button" class="chip" aria-pressed="${kd===k}" data-act="qkind" data-k="${k}">${n}</button>`).join("")}</div>
   <div class="whos">${[["you","Mine"],["kid",S.child?esc(S.child)+"'s":"Child's"],["both","Together"]].map(([k,n])=>`<button type="button" aria-pressed="${w===k}" data-act="qwho" data-w="${k}">${n}</button>`).join("")}</div>
   ${todo?"":`<div class="row" style="align-items:center"><label class="sm">From <input class="inp" id="qa-s" type="time" value="${Q.s||""}" style="width:auto"></label><label class="sm">to <input class="inp" id="qa-e" type="time" value="${Q.e||""}" style="width:auto"></label></div>`}
   <div class="row chips">${Object.entries(QREP).filter(([k])=>!todo||k==="once").map(([k,[n]])=>`<button type="button" class="chip" aria-pressed="${r===k||(todo&&k==="once")}" data-act="qrep" data-r="${k}">${n}</button>`).join("")}</div>
   ${!todo&&r==="pick"?`<div class="dpick">${[1,2,3,4,5,6,0].map(d=>`<button type="button" aria-pressed="${days.includes(d)}" data-act="qday" data-d="${d}">${DAYN[d]}</button>`).join("")}</div>`:""}
   <label class="sm">${!todo&&r!=="once"?"Starting":"On"} <input class="inp" id="qa-d" type="date" value="${Q.d||date}" style="width:auto"></label>
   <button class="btn sm" data-act="qaddq" style="justify-self:start">Add</button><p class="xs muted">${todo?"A to-do shows on that day's list and in Plan → To do.":r==="once"?"Leave the time empty for a to-do any time that day.":"Repeats every week on those days. Change or remove it any time under “What you've told us”."}</p></div>`}

/* ---------- parent profile ---------- */
function parentView(){const p=S.parent||{},al=S.alarm||{on:false,time:"06:30"},d=D();document.getElementById("sheetTitle").textContent="About you";
  return `<section class="card r-you tint" style="text-align:center;justify-items:center">${youBlob("bob","happy",'width="90" height="90"')}<h2 style="font-size:24px">DeepKids is your planning partner</h2><p class="sm muted">It plans your mornings, evenings and the lessons in between. A few things about you help it plan better.</p></section>
   <section class="card"><div class="field"><label for="pName">What should we call you?</label><input class="inp" id="pName" maxlength="40" value="${esc(p.name||pname())}" placeholder="Your name"></div>
   <div class="fgrid"><div class="field"><label for="pWake">You usually wake up at</label><input class="inp" id="pWake" type="time" value="${al.time}"></div><div class="field"><label for="pPrep">Morning prep time</label><input class="inp" id="pPrep" type="time" value="${d.prepAt}"></div><div class="field"><label for="pStart">Learning starts at</label><input class="inp" id="pStart" type="time" value="${d.start}"></div><div class="field"><label for="pEve">Evening prep time</label><input class="inp" id="pEve" type="time" value="${d.eveAt}"></div></div>
   <label class="toggle" style="box-shadow:none;padding:0"><input type="checkbox" id="pAlarm" ${al.on?"checked":""}><span><b style="font:600 16px var(--display)">Wake-up alarm</b><br><span class="xs muted">Rings only while the app is open on this phone.</span></span></label>
   <div class="field"><span>Subjects you'd like more help teaching</span><div class="whos">${S.subjects.map(s=>`<button type="button" aria-pressed="${ui.phelp?ui.phelp.has(s):(p.help||[]).includes(s)}" data-act="phelp" data-s="${s}">${SUBJ[s]}</button>`).join("")}</div></div>
   <div class="field"><label for="pLang">Languages spoken at home</label><input class="inp" id="pLang" maxlength="80" value="${esc(p.langs||"")}" placeholder="Tamil, English"></div>
   <button class="btn" data-act="psave">Save</button></section>`}

/* ---------- smart topic swap ---------- */
function prereqOf(u){if(u.board==="gen")return [];if(u.board==="dk"){const g=DATA.topics.filter(t=>t.q===u.topic.q),first=g[0];return first.id===u.topic.id?[]:["dk|"+first.id]}
  if(u.subj==="math"){const us=DATA.items.filter(x=>x.board===u.board&&x.book===u.book&&x.subj==="math"),i=us.findIndex(x=>x.k===u.k);return us.slice(0,i).map(x=>x.k)}return []}
function swapView(){const s=ui.sheet.s,cur=nextUp(s);document.getElementById("sheetTitle").textContent="Swap "+SUBJ[s]+" topic";
  const us=plannedUnits(s).filter(u=>u.level===S.levels[s]&&rank[coverage(u)]<2);
  const rows=us.map(u=>{const need=prereqOf(u).filter(k=>rank[coverage(unitBy(k)||{k})||"none"]<2&&rank[st(k)]<2);return {u,need}});
  return `<p class="sm muted">${s==="math"?"Maths builds on itself, so a chapter opens once the chapters before it are done.":s==="sci"&&S.plus?"Each big question opens with its first topic. After that, its topics can go in any order.":"These chapters don't depend on each other, so any order works."}</p>
   <section class="card" style="gap:0">${rows.map(({u,need})=>{const isCur=cur&&cur.u.k===u.k,ok=!need.length;return `<div class="taskrow ${SC(u.subj)}"><span class="unit" style="all:unset"><span class="no" style="width:40px;height:40px;border-radius:13px;display:grid;place-items:center;font:700 15px var(--display);background:var(--c)">${/^\d+$/.test(u.n)?u.n:esc(u.n)}</span></span><div><b style="font:600 16px var(--display)">${esc(u.title)}</b><p class="xs muted">${coverage(u)==="learning"?`In progress · Part ${done(u.k)} of ${sessionsFor(u)}`:`${sessionsFor(u)} lesson days`}${ok?"":` · first: ${need.map(k=>esc(unitBy(k)?.title||k)).slice(0,2).join(", ")}`}</p><div class="meta">${isCur?`<span class="pill learning">Up next</span>`:ok?`<button class="btn xs" data-act="pin" data-s="${s}" data-k="${u.k}">Do this next</button>`:`<span class="pill">Locked</span>`}</div></div></div>`}).join("")}</section>`}

/* ---------- Planner ---------- */
const PV={year:"Year",month:"Month",week:"Week",day:"Day"};
function firstDates(){const m={};S.subjects.forEach(s=>schedule(s,400).forEach(x=>{if(!m[x.u.k])m[x.u.k]=x.date}));S.log.forEach(l=>{if(!m[l.key]||l.date<m[l.key])m[l.key]=l.date});return m}
function yearOrbit(){const W=360,c=180,fd=firstDates(),st0=parse([S.start,...S.log.map(l=>l.date)].sort()[0]||today);const m0=new Date(st0.getFullYear(),st0.getMonth(),1);
  const ang=ds=>{const d=parse(ds);return(((d.getFullYear()-m0.getFullYear())*12+d.getMonth()-m0.getMonth()+(d.getDate()-1)/31)/12)*Math.PI*2-Math.PI/2};
  const pt=(a,r)=>[c+Math.cos(a)*r,c+Math.sin(a)*r];let o="";
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2-Math.PI/2,[x,y]=pt(a+Math.PI/12,166),[x1,y1]=pt(a,52),[x2,y2]=pt(a,156),md=new Date(m0.getFullYear(),m0.getMonth()+i,1);o+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="2 5"/><text x="${x}" y="${y+4}" text-anchor="middle" font-family="Fredoka,sans-serif" font-size="11" font-weight="600" fill="var(--muted)">${md.toLocaleDateString(undefined,{month:"short"})}</text>`}
  S.subjects.forEach((s,i)=>{const r=66+i*24;o+=`<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="color-mix(in srgb,${SUBJ_BLOB[s][0]} 35%,transparent)" stroke-width="10"/>`;
    plannedUnits(s).forEach(u=>{const d=fd[u.k];if(!d)return;const a=ang(d);if(a>Math.PI*1.5)return;const [x,y]=pt(a,r),cs=coverage(u),dn=rank[cs]>=2,lr=cs==="learning";
      o+=`<g class="${SC(s)} bead ${lr?"pulse":""}" data-act="chapter" data-k="${u.k}" role="button" aria-label="${esc(u.title)}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${lr?7.5:6}" fill="${dn||lr?"var(--c)":"var(--surface)"}" stroke="var(--c)" stroke-width="2.5"/>${dn?`<path d="M${(x-3).toFixed(1)} ${y.toFixed(1)}l2 2 4-4" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`:""}</g>`})});
  const [nx,ny]=pt(ang(today),158);o+=`<line x1="${c}" y1="${c}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="var(--tang)" stroke-width="2.5" stroke-linecap="round"/><circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="5" fill="var(--tang)"/>`;
  return `<div class="orbit"><svg viewBox="0 0 ${W} ${W}" role="img" aria-label="The year's plan as orbits">${o}${kidBlob("bob","happy",`x="${c-26}" y="${c-26}" width="52" height="52"`)}</svg></div><div class="row" style="justify-content:center">${S.subjects.map(s=>`<span class="chip ${SC(s)}"><span class="dotc"></span>${SUBJ[s]}</span>`).join("")}<span class="chip"><span class="dotc" style="--c:var(--tang)"></span>Today</span></div><p class="xs muted" style="text-align:center">Each ring is a subject; each bead is a chapter, placed in the month it starts. Filled beads are done; the glowing one is in progress. Tap a bead to open it.</p>`}
function sessMap(){const by={};S.subjects.forEach(s=>schedule(s,120).forEach(x=>(by[x.date]=by[x.date]||[]).push({s:x.subj,t:x.u.title})));S.log.forEach(l=>{if(l.date<=today)(by[l.date]=by[l.date]||[]).push({s:l.subj,t:l.title,done:1})});return by}
function monthView(){const by=sessMap(),b=new Date(parse(today));b.setDate(1);b.setMonth(b.getMonth()+(ui.pm||0));const y=b.getFullYear(),m=b.getMonth(),start=new Date(b);start.setDate(1-((b.getDay()+6)%7));
  let rows="";for(let w=0;w<6;w++){let cells="";for(let i=0;i<7;i++){const d=new Date(start);d.setDate(start.getDate()+w*7+i);const ds=iso(d),inM=d.getMonth()===m,L=by[ds]||[],ev=eventsOn(ds).length;cells+=`<button class="mday ${inM?"":"out"} ${ds===today?"today":""}" data-act="pday" data-d="${ds}"><b>${d.getDate()}</b><span class="beads">${L.map(x=>`<i class="${SC(x.s)} ${x.done?"ok":""}"></i>`).join("")}${ev?`<i class="ev"></i>`:""}</span></button>`}rows+=`<div class="mrow">${cells}</div>`;if(new Date(start.getFullYear(),start.getMonth(),start.getDate()+(w+1)*7).getMonth()!==m&&w>=3)break}
  return `<div class="pager"><button class="iconbtn" data-act="pmon" data-d="-1" aria-label="Previous month">${icon("back")}</button><h3 style="font-size:20px">${b.toLocaleDateString(undefined,{month:"long",year:"numeric"})}</h3><button class="iconbtn" data-act="pmon" data-d="1" aria-label="Next month">${icon("next")}</button></div><div class="mhead">${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(x=>`<span>${x}</span>`).join("")}</div><div class="month">${rows}</div><p class="xs muted">Each bead is a lesson in that subject's colour; a pink diamond is a class or outing. Tap a day to see it.</p>`}
function weekView(){const by=sessMap(),m=parse(monday());m.setDate(m.getDate()+7*(ui.week||0));const days=[...Array(7)].map((_,i)=>{const d=new Date(m);d.setDate(m.getDate()+i);return iso(d)});
  return `<div class="pager"><button class="iconbtn" data-act="wk2" data-d="-1" aria-label="Previous week">${icon("back")}</button><h3 style="font-size:20px">${ui.week?"Week of "+fmt(days[0]):"This week"}</h3><button class="iconbtn" data-act="wk2" data-d="1" aria-label="Next week">${icon("next")}</button></div><div class="hs pebbles">${days.map((d,i)=>{const L=by[d]||[],ev=eventsOn(d),td=todosOn(d).filter(x=>!x.done);return `<button class="pebble ${d===today?"today":""}" style="--c:${PAL[i%PAL.length]}" data-act="pday" data-d="${d}"><span class="eyebrow">${DAYN[parse(d).getDay()]}</span><b>${parse(d).getDate()}</b>${L.map(x=>`<span class="pchip ${SC(x.s)} ${x.done?"ok":""}">${esc(x.t)}</span>`).join("")}${ev.map(e=>`<span class="pchip r-out">${clock(hm(e.start))} ${esc(e.title)}</span>`).join("")}${td.map(x=>`<span class="pchip r-you">${esc(x.title)}</span>`).join("")}${!L.length&&!ev.length&&!td.length?`<span class="xs muted">Free day</span>`:""}</button>`}).join("")}</div>`}
function dayView(){const d=ui.pday||today;return `<div class="pager"><button class="iconbtn" data-act="pdd" data-d="-1" aria-label="Previous day">${icon("back")}</button><h3 style="font-size:20px">${d===today?"Today":fmt(d)}</h3><button class="iconbtn" data-act="pdd" data-d="1" aria-label="Next day">${icon("next")}</button></div>${timeline(d)}`}
function askList(){const Q=[];if(!S.parent?.name)Q.push(["What should we call you?","parent"]);if(!(S.events||[]).some(e=>e.kind==="class"||e.kind==="online"))Q.push([`Does ${esc(S.child||"your child")} go to any classes or tuitions? Tell us the days and times.`,"say:Classes and tuitions: "]);
  if(!(S.alarm||{}).time)Q.push(["When do you usually wake up?","parent"]);Q.push(["Any holidays, trips or family events coming up this month?","say:Coming up this month: "]);if(boardsOn().includes("nios"))Q.push(["Are you planning to register for NIOS exams this year?","say:About exams: "]);Q.push([`What does ${esc(S.child||"your child")} love doing these days?`,"say:These days they love: "]);return Q.slice(0,3)}
function dumpCard(){const D_=ui.dump||{},n=(S.events||[]).length+(S.todos||[]).filter(t=>!t.done).length+(S.notes||[]).length,empty=!D_.text&&!D_.items&&!D_.files?.length;
  return `<section class="card dump"><div class="row" style="flex-wrap:nowrap;gap:12px;align-items:center">${blob("var(--aqua)",3,"wow","",'width="44" height="44"')}<div><h3 style="font-size:19px">Tell DeepKids anything</h3><p class="xs muted">Classes, trips, rest times, to-dos, things you own. Type, use your keyboard's mic, or send a photo.</p></div></div>
   ${D_.chat?.length||D_.items?`<div class="chat">${D_.text?`<div class="bub me">${esc(D_.text.split("\n")[0].slice(0,200))}${D_.text.includes("\n")?"…":""}</div>`:""}</div>`:""}
   ${D_.items?`<div class="col" style="gap:8px"><span class="xs muted">Here's what we found. Untick anything that's wrong.</span>${D_.items.map((it,i)=>`<div class="parsed ${it.keep?"":"off"}"><button class="ck ${it.keep?"on":""}" data-act="dkeep" data-i="${i}" aria-label="Keep">${icon("check")}</button><div><b style="font:600 16px var(--display)">${esc(it.title)}</b><p class="xs muted">${esc(parsedLine(it))}</p></div><button class="pill" data-act="dwho" data-i="${i}">${it.type==="have"?"We have it":ROLE[it.who]||"For you"}</button></div>`).join("")}${dumpChat(D_)}<div class="row"><button class="btn green" data-act="dadd">${icon("check")}Add ${D_.items.filter(x=>x.keep).length} to my plan</button><button class="btn line sm" data-act="dclear">Clear</button></div></div>`:dumpChat(D_)}
   ${D_.err?`<p class="sm" style="color:var(--bad)">${esc(D_.err)}</p>`:""}
   ${needAICard(D_)}
   ${D_.files?.length?`<div class="row" style="gap:6px"><span class="chip" style="pointer-events:none">${icon("plus")}${D_.files.length} photo${D_.files.length>1?"s":""} attached</span><button class="link xs" data-act="dnofiles">Remove</button></div>`:""}
   <div class="composer ${D_.busy?"busy":""}">${IMGOK&&SAMPLE?`<label class="cbtn" aria-label="Add a photo or screenshot">📷<input type="file" id="dumpImg" accept="image/*" multiple hidden></label>`:lockBtn("photo","cbtn","📷")}<textarea class="inp" id="dumpText" rows="1" placeholder="${D_.items||D_.chat?.length?"Add more…":"Type or speak a plan…"}">${esc(D_.items?"":D_.text||"")}</textarea><button class="send" data-act="dump" aria-label="Sort it into my plan" ${D_.busy?"disabled":""}>${D_.busy?`<span class="dots"><i></i><i></i><i></i></span>`:icon("next")}</button></div>
   ${D_.busy?`<p class="xs muted">Reading it and putting it on your plan…</p>`:""}
   ${empty?`<div class="dex">${DEX.map(([l,t])=>`<button class="chip" data-act="dex" data-t="${esc(t)}">${esc(l)}</button>`).join("")}</div>`:""}
   ${SAMPLE?"":`<p class="xs muted">Read on this phone: classes, times, days, dates, rest and to-dos. Photos 📷 and longer messages are part of DeepKids Plus.</p>`}
   <div class="row dfoot"><button class="link sm" data-act="told">What you've told us · ${n}</button><button class="link sm" data-act="dhand" aria-expanded="${!!ui.dhand}">${ui.dhand?"Hide add by hand":"Add by hand"}</button></div>
   ${ui.dhand?`<div class="handbox">${quickAdd(ui.pday||today)}</div>`:""}</section>`}
function parsedLine(it){if(it.type==="have")return "Library · "+(it.category||"other");if(it.type==="update"){const e=(S.events||[]).find(z=>z.id===it.id);return "Change"+(e?` “${e.title}”`:"")+": "+[it.days?.length?dayList(it.days):"",it.start?clock(hm(it.start))+(it.end?"–"+clock(hm(it.end)):""):""].filter(Boolean).join(" · ")}
  const when=it.days&&it.days.length?dayList(it.days):it.date?fmt(it.date):"Today";return [it.type==="tuition"?"class":it.type,when,it.start?clock(hm(it.start))+(it.end?"–"+clock(hm(it.end)):""):it.type==="todo"||it.type==="note"?"":"time not set",it.note].filter(Boolean).join(" · ")}
function viewPlanner(){const k=seg("week"),v=ui.pv||"week";initDrag();let h=pageHead("Plan")+segBar("week")+`</section>`;
  if(k==="tell"){const Q=askList();h+=`<section class="sec">${dumpCard()}</section>`+(Q.length?plPart("asks"):"")+(ui.sheet?.mode==="told"?"":`<section class="sec">${toldView()}</section>`)+`<div id="paceSec">${dayTimesCard()}${subjCard()}${plPart("pace")}${rfCard()}</div>`}
  else if(k==="cal")h+=`<section class="sec"><div class="seg">${Object.entries(PV).map(([kk,nm])=>`<button aria-pressed="${v===kk}" data-act="pv" data-v="${kk}">${nm}</button>`).join("")}</div>${{year:yearOrbit,month:monthView,week:weekView,day:dayView}[v]()}</section>`;
  else if(k==="todo")h+=todoTab();
  else if(k==="queue")h+=queuesView()+((WT[ui.tq]?ui.tq:"les")==="les"?`<section class="sec"><button class="link" data-act="pacego" style="justify-self:start">Pace: hours, days and class for each subject → Tell DeepKids</button></section>`:"");
  else if(k==="pending")h+=newView();
  else h+=goingView();
  return h}
async function runDump(){const ta=document.getElementById("dumpText"),D_=ui.dump=ui.dump||{},typed=(ta?.value||"").trim(),text=(D_.items&&typed&&D_.text&&!D_.text.includes(typed)?D_.text+"\n"+typed:typed||D_.text||"").trim();D_.text=text;if(!SAMPLE){if(!text){D_.err="Type something first.";sfx("no");return render()}localDump(text);return}
  if(!text&&!D_.files?.length){D_.err="Type something or add a photo first.";sfx("no");return render()}
  D_.busy=true;D_.err="";render();
  const prompt=`You are the planning helper inside DeepKids, a homeschool planner used by a parent in India. Today is ${new Date().toLocaleDateString("en-IN",{weekday:"long"})} ${today}. The child is ${S.child||"the child"}, age ${S.age}. The day's lessons start at ${D().start}; lunch is at ${D().lunch}.
Routines and classes already in the plan:
${routinesText()}
The parent wrote the message below${D_.files?.length?" and attached photos (they may be WhatsApp screenshots, notes, timetables or receipts)":""}${D_.chat?.length?". It ends with their answers to your earlier questions":""}.
Pull out every class, tuition, online class, outing, rest or nap, meal, chore, to-do, exam, reminder, and every learning item the family owns (books, games, electronics, equipment, tools).
Rules:
- Anything that repeats ("every day", "weekdays", "on Mondays") is weekly, with "days" as numbers, 0 = Sunday to 6 = Saturday. "Every day" is [0,1,2,3,4,5,6]; "weekdays" is [1,2,3,4,5]. Never make a repeating thing a todo.
- Rest, naps, sleep and meals are type "rest" or "meal" with a start and end. A time given relative to something ("1 hour rest after tuition") gets real times worked out from that thing's end time, on the same days.
- Times are 24-hour HH:MM. "4pm-5pm" is 16:00–17:00. If only a length is given, set end from it.
- If an item is already in the list above, leave it out. If the message changes one (new time, new days), return {"type":"update","id":"<its id>", with the new fields}.
- "who" is "you" (the parent alone), "kid" (the child alone, parent free), or "both".
- Resolve dates like "tomorrow" or "next Friday" to YYYY-MM-DD.
- A "todo" is a one-off task with no fixed time. A "note" is only for facts that can't go on a calendar.
- Ask a question only when a needed time or day is really missing and can't be worked out. Never ask about something already in the list above. One short question per gap, at most 3.
- Never invent details.
Reply with only JSON: {"items":[{"type":"class|tuition|online|outing|rest|meal|chore|todo|exam|reminder|have|note|update","id":null,"title":"short title","who":"you|kid|both","date":null,"days":null,"start":null,"end":null,"note":"","category":"book|game|electronics|equipment|tool|other"}],"questions":["..."]}
Message:
"""${text.slice(0,6000)}"""`;
  try{const opt={modelTier:"default",cache:false};if(D_.files?.length)opt.images=D_.files;const r=await SAMPLE.json(prompt,opt);D_.items=(Array.isArray(r?.items)?r.items:[]).filter(x=>x&&(x.title||x.type==="update")).map(x=>({...x,title:x.title||(S.events||[]).find(e=>e.id===x.id)?.title||"Change",who:["you","kid","both"].includes(x.who)?x.who:x.type==="rest"?"kid":"you",keep:true})).map(fixItem);D_.questions=Array.isArray(r?.questions)?r.questions.filter(q=>typeof q==="string").slice(0,3):[];if(D_.items.length)clearIn("dumpText");if(!D_.items.length&&!D_.questions.length)D_.err="We couldn't find plans in that. Try adding days and times.";sfx(D_.items.length?"ok":"no")}
  catch(e){D_.err=({not_granted:"Claude wasn't allowed for this page, so we can't sort it. Use quick add below.",rate_limited:"Too many requests just now. Try again in a minute.",image_rejected:"That photo couldn't be read. Try a different one.",invalid_json:"We couldn't read the answer. Try again.",images_unavailable:"Photos can't be sent from this view. Type it instead."})[e?.code]||"Something went wrong. Try again.";sfx("no")}
  D_.busy=false;render()}
function addParsed(){clearIn("dumpText");const D_=ui.dump;if(!D_?.items)return;let n=0;const got=[];D_.items.filter(x=>x.keep).forEach(x=>{n++;const id=Math.random().toString(36).slice(2,9);got.push(x.title+" · "+parsedLine(x));
  if(x.type==="have"){S.inv=[...(S.inv||[]),{id,name:x.title,cat:x.category||"other",note:x.note||"",from:"told"}];return}
  if(x.type==="note"){S.notes=[...(S.notes||[]),{id,text:x.title+(x.note?": "+x.note:""),date:today}];return}
  if(x.type==="update"){const e=(S.events||[]).find(z=>z.id===x.id);if(e){if(x.start)e.start=x.start;if(x.end)e.end=x.end;if(x.days?.length){e.days=x.days;e.rep="weekly";e.date=null}if(x.date&&!x.days?.length){e.date=x.date}if(x.title&&x.title!=="Change")e.title=x.title}return}
  const kind={class:"class",tuition:"class",online:"online",outing:"outing",rest:"rest",meal:"meal"}[x.type]||"other",rep=x.days?.length?"weekly":"once";
  if(x.start||rep==="weekly"||kind!=="other"){const end=x.start?(x.end&&hm(x.end)>hm(x.start)?x.end:clock24(hm(x.start)+60)):null;S.events=[...(S.events||[]),{id,title:x.title,kind,who:x.who,start:x.start||null,end,rep,date:rep==="weekly"?null:(x.date||today),days:x.days||[],from:today,note:x.note||""}]}
  else S.todos=[...(S.todos||[]),{id,title:x.title,who:x.who,date:x.date||today,note:x.note||"",done:false}]});
  S.said=[...(S.said||[]),{id:Math.random().toString(36).slice(2,9),at:Date.now(),date:today,text:(D_.text||"").slice(0,2000),chat:D_.chat||[],added:got}].slice(-300);
  ui.dump={};sfx("win");toast(`Added ${n} to your plan · see What you've told us`);commit()}
const clock24=m=>String(Math.floor(m/60)%24).padStart(2,"0")+":"+String(m%60).padStart(2,"0");

/* ---------- Journey ---------- */
function subjStats(s){const us=[...collate(s).dk,...collate(s).board],tot=us.reduce((a,u)=>a+sessionsFor(u),0),dn=us.reduce((a,u)=>a+(rank[coverage(u)]>=2?sessionsFor(u):Math.min(done(u.k),sessionsFor(u))),0);
  return {us,pct:tot?dn/tot:0,sessions:dn,total:tot,completed:us.filter(u=>rank[coverage(u)]>=2).length,learning:us.filter(u=>coverage(u)==="learning").length}}
function wsStats(u){const sets=[...(u.c?.x?.wsd?[[u.k,u.c.x.wsd]]:[]),...(u.c?.p?.worksheets||[]).map(w=>[u.k+"#"+w.id,w.sections])];if(!sets.length)return null;let tot=0,ans=0,mq=0,mr=0;
  sets.forEach(([k,W])=>W.forEach(([_,its],si)=>its.forEach((it,ii)=>{tot++;const v=A(k,si+"-"+ii);if(v!==undefined&&v!==""&&!(typeof v==="object"&&!Object.keys(v).length))ans++;if(it.t==="mcq"&&v!==undefined){mq++;if(v===it.a)mr++}})));return {tot,ans,mq,mr}}

function quotes(filter){const out=[];Object.entries(S.ans||{}).forEach(([k,o])=>{const u=unitBy(k);if(!u||!u.c?.x||(filter&&!filter(u)))return;Object.entries(o).forEach(([q,v])=>{if(/^think\d$/.test(q)&&typeof v==="string"&&v.trim().length>3)out.push({u,q:u.c.x.deep[+q.slice(5)]?.q,a:v.trim()})})});return out}
const AY0=()=>{const d=parse(today),y=d.getMonth()>=3?d.getFullYear():d.getFullYear()-1;return iso(new Date(y,3,1))};
function boardRows(s,b){const us=collateAt(s,S.levels[s]).board.filter(u=>u.board===b);if(!us.length)return null;const frac=Math.min(1,Math.max(0,(parse(today)-parse(AY0()))/(365*864e5))),exp=Math.round(us.length*frac);
  return {us,exp,done:us.filter(u=>rank[coverage(u)]>=2),prog:us.filter(u=>coverage(u)==="learning"),behind:us.slice(0,exp).filter(u=>rank[coverage(u)]<2)}}
function jsubView(){const s=ui.sheet.s,x=subjStats(s);document.getElementById("sheetTitle").textContent=SUBJ[s]+" journey";const kid=esc(S.child||"Your child");
  const logs=S.log.filter(l=>l.subj===s),Qs=quotes(u=>u.subj===s),W=workOf().filter(w=>unitBy(w.k)?.subj===s);
  let h=`<section class="chero ${SC(s)}" style="min-height:140px"><span class="eyebrow" style="color:#2B2340;opacity:.7">${lvlLabel(S.levels[s])}</span><h1>${Math.round(x.pct*100)}% of this level</h1><p>${x.completed} chapters done · ${x.learning} in progress · ${x.sessions} of ${x.total} lesson days${logs.length?` · last on ${fmt(logs[0].date)}`:""}</p>${sblob(s,"happy","mascot sway")}</section>`;
  h+=`<section class="card"><h3 style="font-size:19px">How well</h3>${(()=>{let ans=0,tot=0,mq=0,mr=0,tk=0,tt=0;x.us.forEach(u=>{const w=wsStats(u);if(w){ans+=w.ans;tot+=w.tot;mq+=w.mq;mr+=w.mr}if(u.c?.x){const ts=chapterTasks(u);tt+=ts.length;tk+=ts.filter(a=>taskDone(u.k,a[0])).length}});return `<div class="stack3">${[[tot?`${ans}/${tot}`:"–","worksheet answers"],[mq?Math.round(mr/mq*100)+"%":"–","multiple-choice right"],[tt?`${tk}/${tt}`:"–","tasks done"],[Qs.length,"big-question answers"]].map(([n,l])=>`<div class="rcardj"><b class="num">${n}</b><span class="xs muted">${l}</span></div>`).join("")}</div>`})()}</section>`;
  if(Qs.length||W.length)h+=`<section class="card"><h3 style="font-size:19px">In ${kid}'s words</h3>${Qs.slice(-4).reverse().map(q=>`<div class="quote ${SC(s)}"><span class="eyebrow">${esc(q.q||"")}</span><p>“${esc(q.a)}”</p><span class="xs muted">${esc(q.u.title)}</span></div>`).join("")}${thumbs(W)}</section>`;
  boardsOn().forEach(b=>{const r=boardRows(s,b);if(!r)return;h+=`<section class="card"><h3 style="font-size:19px">${BOARDS[b]}</h3><p class="xs muted">By this point in the school year, about ${r.exp} of ${r.us.length} chapters would usually be done.</p>${r.behind.length?`<div><span class="eyebrow" style="color:var(--bad)">Not done yet, but due by now</span><div class="row" style="margin-top:6px">${r.behind.map(u=>`<button class="chip" data-act="chapter" data-k="${u.k}">${esc(u.title)}</button>`).join("")}</div></div>`:`<p class="sm" style="font-weight:800;color:var(--good)">On track for this point in the year.</p>`}${r.prog.length?`<div><span class="eyebrow">In progress</span><div class="row" style="margin-top:6px">${r.prog.map(u=>`<button class="chip" data-act="chapter" data-k="${u.k}">${esc(u.title)}</button>`).join("")}</div></div>`:""}</section>`});
  const dk=x.us.filter(u=>u.board==="dk"&&st(u.k)!=="none"),fr=[...new Set(logs.filter(l=>l.kind==="free").map(l=>l.title))];
  if(dk.length||fr.length)h+=`<section class="card"><h3 style="font-size:19px">Learned beyond the board</h3><div class="row">${[...dk.map(u=>u.title),...fr].map(t=>`<span class="chip">${esc(t)}</span>`).join("")}</div></section>`;
  h+=`<section class="sec"><div class="sech"><h3>Every topic</h3><span class="xs muted">tap for details</span></div><div class="col" style="gap:8px">${x.us.map(u=>{const cs=coverage(u),ul=S.log.filter(l=>l.key===u.k),w=wsStats(u),ts=u.c?.x?chapterTasks(u):null,open=ui.jopen===u.k;return `<div class="topic ${SC(u.subj)}"><button class="plain trow" data-act="jopen" data-k="${u.k}"><span class="no">${/^\d+$/.test(u.n)?u.n:esc(u.n)}</span><span style="min-width:0"><b>${esc(u.title)}</b><br><span class="xs muted">${u.board==="dk"?"DeepKids Plus":BOARDS[u.board]} · Class ${DATA.levels[u.level].cls} · L${u.level}</span></span>${pillS(cs)}</button>${open?`<div class="tdet"><div class="kv"><span>Lesson days</span><b>${Math.min(done(u.k),sessionsFor(u))} of ${sessionsFor(u)}</b><span>Started</span><b>${ul.length?fmt(ul[ul.length-1].date):"Not yet"}</b><span>Last session</span><b>${ul.length?fmt(ul[0].date):"–"}</b>${ts?`<span>Tasks</span><b>${ts.filter(a=>taskDone(u.k,a[0])).length} of ${ts.length}</b>`:""}${w?`<span>Worksheet</span><b>${w.ans} of ${w.tot} answered${w.mq?`, ${w.mr}/${w.mq} choices right`:""}</b>`:""}${u.dk?.length?`<span>DeepKids links</span><b>${u.dk.map(id=>esc(DATA.topics.find(t=>t.id===id)?.name||id)).join(", ")}</b>`:""}</div>${thumbs(workOf(u.k))}<div class="row"><button class="btn soft sm" data-act="chapter" data-k="${u.k}">Open chapter</button>${photoBtn(u.k)}</div></div>`:""}</div>`}).join("")}</div></section>`;
  const c=collate(s);h+=`<section class="sec"><div class="sech"><h3>Learning path</h3></div>${c.dk.length?pathMap(c.dk,u=>st(u.k)):""}${[...new Set(c.board.map(u=>u.book))].map(b=>`<p class="eyebrow">${esc(b)}</p>${pathMap(c.board.filter(u=>u.book===b),coverage)}`).join("")}</section>`;
  return h}

/* ---------- Library ---------- */
const AZ=q=>"https://www.amazon.in/s?k="+encodeURIComponent(q);
const LIB={
 suggest:[
  ["book","Ammachi's Amazing Machines","Rajiv Eipe · Pratham Books","A grandmother who builds machines. Simple machines, told warmly.",AZ("Ammachi's Amazing Machines Rajiv Eipe")],
  ["book","Gajapati Kulapati","Ashok Rajagopalan · Tulika","A sneezing elephant and a village that helps. Great read-aloud for 6–8.",AZ("Gajapati Kulapati Tulika")],
  ["book","Grandma's Bag of Stories","Sudha Murty · Puffin","Indian folk stories for bedtime, with questions to talk over.",AZ("Grandma's Bag of Stories Sudha Murty")],
  ["book","The Way Things Work Now","David Macaulay","How machines work, from levers to the internet. A book to grow into.",AZ("The Way Things Work Now David Macaulay")],
  ["book","Why? Over 1,111 Answers to Everything","National Geographic Kids","Short answers that start long conversations.",AZ("National Geographic Kids Why Over 1111 Answers")],
  ["game","Pallanguzhi","Traditional South Indian board game","Counting, planning ahead and fair play, on a wooden board.",AZ("Pallanguzhi board game")],
  ["game","Chaupar / Pachisi","Traditional Indian race game","Probability and strategy with cowrie shells.",AZ("Chaupar Pachisi game")],
  ["game","SET","Card game","Spotting patterns across colour, shape, number and shading.",AZ("SET card game")],
  ["game","Prime Climb","Maths board game","Multiplication and primes, coloured so children see factors.",AZ("Prime Climb board game")],
  ["game","Rush Hour","Logic puzzle","Sliding cars to plan many moves ahead.",AZ("Rush Hour ThinkFun")],
  ["electronics","Snap Circuits Jr. SC-100","Electronics kit","Real circuits that snap together. No soldering.",AZ("Snap Circuits Jr SC-100")],
  ["equipment","Foldscope","Paper microscope","A folding microscope made in India that magnifies about 140 times.","https://foldscope.com/"],
  ["equipment","Magnifying glass","For nature walks","Used in many EVS experiments.",AZ("magnifying glass for kids")],
  ["equipment","Digital kitchen scale (1 g)","For measuring","Seeds, sprouts and waste weighing.",AZ("digital kitchen scale 1g")],
  ["equipment","Bar magnet set","For science","The magnet hunt and more.",AZ("bar magnet set for kids")],
  ["equipment","Binoculars","For birds and stars","Bird-feeder logs and moon diaries.",AZ("binoculars for kids")],
  ["tool","Child-safe tool kit","Real tools, small size","Hammer, screwdriver and saw for making things.",AZ("kids real tool kit")]],
 read:{parents:[
  ["Arvind Gupta Toys","Free books and hundreds of toys made from trash, in many Indian languages.","https://www.arvindguptatoys.com/"],
  ["NCERT textbooks","Every NCERT book as a free PDF.","https://ncert.nic.in/textbook.php"],
  ["Eklavya","Books, teaching ideas and the children's magazine Chakmak.","https://www.eklavya.in/"],
  ["Teacher Plus","A magazine for teachers, full of classroom ideas you can use at home.","https://www.teacherplus.org/"],
  ["How Children Learn","John Holt. A classic on how children learn when they are trusted.",AZ("How Children Learn John Holt")],
  ["Free to Learn","Peter Gray. Why play and self-directed learning matter.",AZ("Free to Learn Peter Gray")]],
 kids:[
  ["StoryWeaver","Thousands of free picture books in Indian languages, by Pratham Books.","https://storyweaver.org.in/"],
  ["NASA Space Place","Space and Earth science games, crafts and explainers.","https://spaceplace.nasa.gov/"],
  ["National Geographic Kids","Animals, places and science for curious readers.","https://kids.nationalgeographic.com/"],
  ["Pratham Books","Affordable books for every reading level.","https://prathambooks.org/"]]},
 watch:{parents:[
  ["Turning trash into toys for learning","Arvind Gupta · TED","https://www.ted.com/talks/arvind_gupta_turning_trash_into_toys_for_learning"],
  ["Kids can teach themselves","Sugata Mitra · TED","https://www.ted.com/talks/sugata_mitra_kids_can_teach_themselves"],
  ["Do schools kill creativity?","Ken Robinson · TED","https://www.ted.com/talks/sir_ken_robinson_do_schools_kill_creativity"],
  ["A 50-cent microscope that folds like origami","Manu Prakash · TED","https://www.ted.com/talks/manu_prakash_a_50_cent_microscope_that_folds_like_origami"]],
 kids:[
  ["SciShow Kids","Short, friendly science videos.","https://www.youtube.com/@scishowkids"],
  ["Crash Course Kids","Science and engineering for primary school.","https://www.youtube.com/@crashcoursekids"],
  ["Peekaboo Kidz (Dr. Binocs)","Indian-made science cartoons.","https://www.youtube.com/@PeekabooKidz"]],
 family:[
  ["Our Planet","David Attenborough · Netflix","https://www.justwatch.com/in/search?q=Our%20Planet"],
  ["Planet Earth II","BBC","https://www.justwatch.com/in/search?q=Planet%20Earth%20II"],
  ["Malgudi Days","R. K. Narayan's stories · Doordarshan classic","https://www.justwatch.com/in/search?q=Malgudi%20Days"],
  ["The Magic School Bus Rides Again","Netflix","https://www.justwatch.com/in/search?q=Magic%20School%20Bus%20Rides%20Again"]]}};
const CATS={book:"Books",game:"Games",electronics:"Electronics",equipment:"Equipment",tool:"Tools",other:"Other"};
const PREP_KW=["magnifying glass","magnifier","magnet","kitchen scale","measuring tape","ruler","stopwatch","thermometer","Betadine","food colour","balloons","straws","clay","seeds","glitter","lattu","phone sound meter"];
function preppedTasks(){return Object.keys(S.prep||{}).map(id=>{const p=id.split("|"),i=+p[p.length-1],n=+p[p.length-2],u=unitBy(p.slice(1,-2).join("|"));if(!u)return "";const x=prepFor(u,n,sessionsFor(u))[i];return x?x.task:""}).filter(Boolean)}
/* uploads, night inputs, alarm and the clock */
document.addEventListener("change",async e=>{const t=e.target;
  if(t.id==="obExam"&&ob){ob.d.exam=t.checked;return}
  if(t.id==="sMode"){S.mode=t.value;S.plus=t.value!=="books";sfx("tick");commit();return}
  if(t.id==="sExam"){S.exam=t.checked;sfx("tick");commit();return}
  if(t.dataset.remf){REM()[t.dataset.remf]=t.value;commit();return}if(t.dataset.remck){const R=REM(),k=t.dataset.remck;if(k==="notif"&&t.checked&&typeof Notification!=="undefined"){Notification.requestPermission().then(p=>{R.notif=p==="granted";if(!R.notif)toast("Pop-ups were not allowed on this phone");commit()}).catch(()=>{R.notif=false;toast("Pop-ups aren't available here");commit()});return}R[k]=t.checked;commit();return}if(t.dataset.tsel){const T=tSetup();T[t.dataset.tsel]=t.value;sfx("tap");commit();return}if(t.dataset.zip){const Z=zipSel();t.checked?Z[t.dataset.zip].add(t.value):Z[t.dataset.zip].delete(t.value);ui.zip=null;render();return}if(t.dataset.evf){const e=(S.events||[]).find(x=>x.id===t.dataset.id);if(e){e[t.dataset.evf]=t.value||(t.dataset.evf==="title"?e.title:null);save()}return}if(t.id==="importFile"&&t.files?.[0]){const f=t.files[0];t.value="";dataImport(f);return}if(t.id==="upFiles"&&t.files?.length){const F=[...t.files];t.value="";upFiles(F);return}if(t.dataset.upk!==undefined){const w=(S.work||[]).find(x=>x.id===t.dataset.upk);if(w){w.k=t.value;sfx("tap");commit()}return}if(t.dataset.sch){S.school={...(S.school||{}),[t.dataset.sch]:t.value};save();return}if(t.id==="icsFile"&&t.files?.[0]){let items=[];try{items=parseICS(await t.files[0].text())}catch(err){}ui.dump={items,questions:[],text:"",err:items.length?"":"No upcoming events found in that file."};sfx(items.length?"ok":"no");render();setTimeout(()=>document.querySelector(".dump")?.scrollIntoView({behavior:"smooth",block:"start"}),50);return}
  if(t.id==="dumpImg"){ui.dump=ui.dump||{};ui.dump.text=document.getElementById("dumpText")?.value||"";ui.dump.files=[...t.files].slice(0,4);render();return}
  if(t.dataset.upload&&t.files?.length){if(!ASSETS){toast("Photos can't be saved in this view");return}const k=t.dataset.upload,u=unitBy(k);toast("Saving photo…");
    try{for(const f of [...t.files].slice(0,4)){const r=await ASSETS.upload(f);S.work=[...(S.work||[]),{id:r.id,k,date:today,title:u?.title||""}]}sfx("ok");toast("Photo saved to the journey");commit()}catch(err){toast({too_large:"That photo is too big (20 MB limit)",unsupported_type:"Use a JPG, PNG or WebP photo",quota_or_state:"Photo storage is full"}[err?.code]||"Couldn't save the photo. Try again.")}return}
  if(t.dataset.alarm){S.alarm={...(S.alarm||{on:false,time:"06:30"}),[t.dataset.alarm]:t.type==="checkbox"?t.checked:t.value};S.updatedAt=Date.now();save();return}
  if(t.dataset.over){S.dayOver={...(S.dayOver||{}),[t.dataset.over]:{...((S.dayOver||{})[t.dataset.over]||{}),start:t.value}};S.updatedAt=Date.now();save();return}});
let lastMin=-1,rang={};
setInterval(()=>{const nm=nowMin();if(nm===lastMin)return;lastMin=nm;
  const al=S.alarm;if(al?.on&&clock24(nm)===al.time&&!rang[today]){rang[today]=1;let n=0;const ring=()=>{if(n++<6){sfx("win");setTimeout(ring,1600)}};ring();toast(greetWord()+(pname()?", "+pname():"")+"! Time to get up")}
  const busy=document.activeElement&&/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);if(!busy&&!(ui.sheet&&sheet.open)&&(rollDay()||tab==="today"))render()},20000);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&!(ui.sheet&&sheet.open)){rollDay();render()}});
document.getElementById("hello").onclick=()=>{if(ACC&&!ob&&S.setup){sfx("flip");openSheet({mode:"parent"})}};(async()=>{try{DBH=await window.claude?.use?.("db")||null;const us=await window.claude?.use?.("user");UID=us?await us.id().catch(()=>null):null;if(us){const me=await us.me().catch(()=>null);ACCT=String(me?.name||"").trim().split(/\s+/)[0]||"";ACCT=ACCT?ACCT[0].toUpperCase()+ACCT.slice(1):"";render()}if(DBH){const sn=await DBH.collection("topics").limit(500).get().catch(()=>null);if(sn)SHARED.topics=sn.docs.map(d=>{const g=d.data()||{};return {...g,id:d.id,level:Math.min(5,Math.max(1,+g.level||1)),hours:+g.hours||3}}).filter(g=>g.name&&SUBJ[g.subj]);_all=null}}catch(e){}try{SAMPLE=await window.claude?.use?.("sample")||null;ASSETS=await window.claude?.use?.("assets")||null;if(SAMPLE){const l=await SAMPLE.limits().catch(()=>null);IMGOK=!!l?.images}}catch(e){}render()})();

function rng(seed){let s=(seed*9973)%233280||7;return()=>(s=(s*9301+49297)%233280)/233280}
function blobD(seed,cx=50,cy=56,r=37,n=7){const R=rng(seed),P=[...Array(n)].map((_,i)=>{const a=i/n*Math.PI*2-Math.PI/2,k=.86+R()*.26;return [cx+Math.cos(a)*r*k,cy+Math.sin(a)*r*k]});const f=v=>v.toFixed(1);
  let d=`M${f(P[0][0])},${f(P[0][1])}`;for(let i=0;i<n;i++){const p0=P[(i-1+n)%n],p1=P[i],p2=P[(i+1)%n],p3=P[(i+2)%n];d+=` C${f(p1[0]+(p2[0]-p0[0])/6)},${f(p1[1]+(p2[1]-p0[1])/6)} ${f(p2[0]-(p3[0]-p1[0])/6)},${f(p2[1]-(p3[1]-p1[1])/6)} ${f(p2[0])},${f(p2[1])}`}return d+"Z"}
function blob(col,seed=1,mood="happy",cls="bl",attrs=""){const k="#2B2340";
  const eyes=mood==="sleepy"?`<path d="M35 52q6 5 12 0M53 52q6 5 12 0" stroke="${k}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`:`<ellipse cx="41" cy="51" rx="4.3" ry="5.4" fill="${k}"/><ellipse cx="59" cy="51" rx="4.3" ry="5.4" fill="${k}"/><circle cx="42.5" cy="48.8" r="1.6" fill="#fff"/><circle cx="60.5" cy="48.8" r="1.6" fill="#fff"/>`;
  const mouth=mood==="wow"?`<ellipse cx="50" cy="64" rx="4" ry="5" fill="${k}"/>`:mood==="calm"?`<path d="M45 63h10" stroke="${k}" stroke-width="3.4" stroke-linecap="round"/>`:`<path d="M43 61q7 7.5 14 0" stroke="${k}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
  return `<svg class="${cls}" ${attrs} viewBox="0 0 100 100" aria-hidden="true"><path d="${blobD(seed)}" fill="${col}"/><circle cx="32" cy="61" r="4.6" fill="#FF6F9F" opacity=".45"/><circle cx="68" cy="61" r="4.6" fill="#FF6F9F" opacity=".45"/>${eyes}${mouth}</svg>`}
const PAL=["var(--aqua)","var(--gum)","var(--sun)","var(--pist)","var(--peri)","var(--tang)","var(--sky)"];
const SUBJ_BLOB={math:["var(--aqua)",3],eng:["var(--gum)",7],hin:["var(--tang)",11],sci:["var(--forest)",5],dks:["var(--peri)",9],wml:["var(--sun)",13],wart:["var(--gum)",17]};
function sblob(s,mood="happy",cls="bl",attrs=""){const b=SUBJ_BLOB[s]||["var(--peri)",2];return blob(b[0],b[1],mood,cls,attrs)}
const kidBlob=(cls="bl",mood="happy",attrs="")=>blob("var(--sky)",13,mood,cls,attrs);
const youBlob=(cls="bl",mood="happy",attrs="")=>blob("var(--peri)",17,mood,cls,attrs);
const greet=()=>{const h=new Date().getHours();return (h<12?"Good morning":h<17?"Good afternoon":"Good evening")+(S.child?", "+esc(S.child)+"!":"!")};
function flower(x,y,col,i,bloomed,isNow){
  if(!bloomed)return `<g class="${isNow?"bob":"sway"}"><path d="M${x} ${y}v-16" stroke="var(--forest)" stroke-width="3" stroke-linecap="round"/><path d="M${x} ${y-8}q-9-2-11-10q9 0 11 8zM${x} ${y-11}q9-3 10-11q-9 1-10 9z" fill="var(--forest)"/>${isNow?`<path d="M${x+13} ${y-34}l2.2 4.4 4.4 2.2-4.4 2.2-2.2 4.4-2.2-4.4-4.4-2.2 4.4-2.2z" fill="#fff"/>`:""}</g>`;
  const h=34+(i%3)*9,cy=y-h,pet=[0,72,144,216,288].map(a=>{const r=a*Math.PI/180,px=x+Math.cos(r)*9.5,py=cy+Math.sin(r)*9.5;return `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="8" ry="6.2" transform="rotate(${a} ${px.toFixed(1)} ${py.toFixed(1)})" fill="${col}"/>`}).join("");
  return `<g class="bloom" style="animation-delay:${(i*.07).toFixed(2)}s"><g class="sway" style="animation-delay:${(i*.3).toFixed(1)}s"><path d="M${x} ${y}V${cy}" stroke="var(--forest)" stroke-width="3.2" stroke-linecap="round"/><path d="M${x} ${y-12}q-12-2-14-12q12 0 14 10z" fill="var(--forest)"/>${pet}<circle cx="${x}" cy="${cy}" r="7.5" fill="var(--sun)"/><circle cx="${x-2.6}" cy="${cy-1}" r="1.3" fill="#2B2340"/><circle cx="${x+2.6}" cy="${cy-1}" r="1.3" fill="#2B2340"/><path d="M${x-2.6} ${cy+2.2}q2.6 2.6 5.2 0" stroke="#2B2340" stroke-width="1.3" fill="none" stroke-linecap="round"/></g></g>`}
function garden(items,now){const its=items.filter(i=>i.kind!=="brk"),n=its.length;let fl="",kidX=40;
  const list=n?its:[{done:true},{done:true},{done:true}];const N=list.length,x0=34,x1=326;
  list.forEach((it,i)=>{const x=Math.round(N===1?180:x0+(x1-x0)*i/(N-1)),y=182-(i%2)*7;fl+=flower(x,y,PAL[i%PAL.length],i,it.done,it===now);if(it===now)kidX=x-34});
  if(!now&&n)kidX=150;
  return `<svg class="scene" viewBox="0 0 360 250" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
   <g><ellipse cx="70" cy="58" rx="30" ry="11" fill="#fff" opacity=".8"/><ellipse cx="92" cy="50" rx="20" ry="12" fill="#fff" opacity=".8"/><ellipse cx="226" cy="40" rx="24" ry="9" fill="#fff" opacity=".7"/></g>
   <g transform="translate(300 34)"><circle r="22" fill="var(--sun)"/><circle cx="-7" cy="-2" r="2.2" fill="#2B2340"/><circle cx="7" cy="-2" r="2.2" fill="#2B2340"/><path d="M-6 6q6 6 12 0" stroke="#2B2340" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>
   <path d="M0 150Q90 108 190 142T360 130V250H0Z" fill="var(--hill1)"/><path d="M-10 182Q100 152 210 176T370 168V250H-10Z" fill="var(--hill2)"/>
   <g fill="var(--forest)" opacity=".9"><path d="M300 150c0-26 22-26 22 0z"/><rect x="309" y="148" width="4" height="12" rx="2" fill="#9A6B45"/><path d="M28 140c0-22 18-22 18 0z"/><rect x="35" y="138" width="4" height="10" rx="2" fill="#9A6B45"/></g>
   ${fl}${n?blob("var(--sky)",13,now?"happy":"wow","bob",`x="${kidX}" y="132" width="40" height="40"`):""}</svg>`}

const KICO={lesson:"read",prep:"prep",warm:"warm",exps:"exps",event:"event",todo:"prep",refresh:"game",plan:"week"};

function pathMap(units,covOf){const n=units.length;if(!n)return "";const step=118,top=56,H=top+n*step,xs=[50,78,50,22];const P=units.map((u,i)=>[xs[i%4],top+i*step]);
  let d=`M${P[0][0]} ${P[0][1]}`;for(let i=1;i<n;i++)d+=` C${P[i-1][0]} ${P[i-1][1]+step*.55} ${P[i][0]} ${P[i][1]-step*.55} ${P[i][0]} ${P[i][1]}`;
  const nextI=units.findIndex(u=>rank[covOf(u)]<2);
  const deco=units.map((u,i)=>i%3===1?`<div style="position:absolute;left:${100-xs[i%4]>50?88:6}%;top:${P[i][1]-30}px;width:34px">${blob(PAL[(i+2)%PAL.length],40+i,"sleepy","",'width="34" height="34"')}</div>`:"").join("");
  return `<div class="pathmap" style="height:${H}px"><svg viewBox="0 0 100 ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" fill="none" stroke="var(--soil)" stroke-width="26" stroke-linecap="round" vector-effect="non-scaling-stroke"/><path d="${d}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round" vector-effect="non-scaling-stroke" opacity=".8"/></svg>${deco}
   ${units.map((u,i)=>{const cs=covOf(u),ts=u.c?.x?chapterTasks(u):null,td=ts?ts.filter(a=>taskDone(u.k,a[0])).length:0;return `<button class="node ${SC(u.subj)} ${cs} ${i===nextI?"next":""}" style="left:${P[i][0]}%;top:${P[i][1]+12}px" data-act="chapter" data-k="${u.k}">${i===nextI?kidBlob("","happy",'width="34" height="34" style="margin-bottom:-10px"'):""}<span class="dot">${rank[cs]>=2?`<svg width="28" height="28" viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill="#fff"/></svg>`:/^\d+$/.test(u.n)?u.n:esc(u.n)}</span><span class="lbl">${esc(u.title)}</span><span class="sub">${ts?`${td}/${ts.length} tasks · `:""}${STATUS[cs]}</span></button>`}).join("")}</div>`}
function crowd(){const B=[["var(--sun)",4,"sleepy",-10,70,130],["var(--gum)",7,"happy",80,40,150],["var(--aqua)",3,"wow",190,60,140],["var(--forest)",5,"happy",270,30,130],["var(--peri)",17,"calm",30,110,120],["var(--tang)",11,"happy",140,105,130],["var(--sky)",13,"happy",240,110,125]];
  return `<svg class="crowd" viewBox="0 0 380 230" aria-hidden="true">${B.map(([c,s,m,x,y,z],i)=>blob(c,s,m,i%2?"bob":"",`x="${x}" y="${y}" width="${z}" height="${z}" style="animation-delay:${i*.2}s"`)).join("")}</svg>`}
/* ---------- Today ---------- */
function stepState(it){const tk=new Set(S.steps[stepKey(it)]||[]),u=it.u;
  const carried=((S.carry||{})[u.k]||[]).filter(c=>c.forN===it.n).map(c=>({kind:c.kind,label:c.label,title:"From last time: "+c.title,mins:c.mins,html:c.name?.startsWith("pk:")?packStepByName(u,c.name):u.c?.x&&c.name&&!c.name.startsWith("opt:")?stepBody(u,c.name):`<p>${esc(c.title)}</p>`,name:c.name,carried:true}));
  const base=u.c?.p?daySteps(u,it.n,it.tot):modeOf()==="books"&&u.board!=="gen"&&u.board!=="dk"?bookSteps(u,it.n,it.tot):optionSteps(u,it.n,it.tot,today);
  return [...carried,...base].map((x,i)=>({...x,ok:tk.has(sid(x))}))}
function focusCard(it){const col=it.kind==="lesson"?SC(it.s):"r-"+it.who;let body="",acts="",title=it.title,mascot;
  const who=`<div class="who">${icon(it.kind==="lesson"?"read":it.kind)}<span>${it.kind==="lesson"?SUBJ[it.s]:ROLE[it.who]} · ${clock(it.at)} · ${mins(it.dur/60)}</span></div>`;
  if(it.kind==="lesson"){const st=stepState(it);title=chT(it.u);mascot=sblob(it.s,"happy","mascot bob");body=`<div class="sm muted" style="font-weight:700">${esc(it.u.book)}${chNo(it.u)?" · "+chNo(it.u):""} · Part ${it.n} of ${it.tot}</div><div class="steps-mini">${st.map(x=>`<span class="${x.ok?"ok":""}">${esc(x.label)} · ${mins(x.mins)}</span>`).join("")}</div>`;
    acts=`<button class="btn wide" data-act="play" data-id="${it.id}">${icon("play")}${st.some(x=>x.ok)?"Keep going":"Let's start"}</button>${it.bonus?`<button class="btn soft" data-act="less" data-s="${it.s}">Not now</button>`:`<button class="btn soft" data-act="skip" data-s="${it.s}">Not today</button>`}`}
  else if(it.kind==="prep"){mascot=youBlob("mascot bob","calm");body=`<ul class="sm" style="margin:0;padding-left:18px;display:grid;gap:4px;font-weight:700">${it.prep.slice(0,3).map(p=>`<li${S.prep[p.id]?' style="text-decoration:line-through;opacity:.6"':""}>${esc(p.task)}</li>`).join("")}${it.prep.length>3?`<li class="muted">and ${it.prep.length-3} more</li>`:""}</ul>`;acts=`<button class="btn wide" data-act="tlopen" data-id="${it.id}" data-date="${today}">Open my checklist</button><button class="btn soft" data-act="tlcheck" data-id="${it.id}" data-date="${today}">All ready</button>`}
  else if(it.kind==="warm"){mascot=blob("var(--gum)",21,"wow","mascot bob");body=`<p class="sm" style="font-weight:700">Three jokes, then today's word game. Ten minutes that wake everyone up.</p>`;acts=`<button class="btn wide" data-act="games">Jokes and games</button><button class="btn soft" data-act="tlcheck" data-id="warm" data-date="${today}">Done</button>`}
  else if(it.kind==="exps"){mascot=blob("var(--pist)",9,"happy","mascot bob");body=`<p class="sm" style="font-weight:700">${esc(it.sub)}</p>`;acts=`<button class="btn green wide" data-act="tlcheck" data-id="exps" data-date="${today}">Checked them all</button><button class="btn soft" data-act="goto" data-to="exps">See them</button>`}
  else{mascot=it.who==="you"?youBlob("mascot bob"):kidBlob("mascot bob","wow");body=it.sub?`<p class="sm" style="font-weight:700">${esc(it.sub)}</p>`:"";acts=`<button class="btn green wide" data-act="tlcheck" data-id="${it.id}" data-date="${today}">Done</button>`}
  return `<section class="focus ${col}">${mascot}<span class="eyebrow">Up next</span>${who}<h2>${esc(title)}</h2>${body}<div class="row">${acts}</div></section>`}
function offers(){return S.subjects.filter(s=>!ui.more[s]).map(s=>({s,nx:nextUp(s)})).filter(x=>x.nx)}
function offerList(){const L=offers();return L.length?`<div class="col" style="gap:8px">${L.map(({s,nx})=>`<div class="offer ${SC(s)}">${sblob(s)}<span style="min-width:0"><b style="font:600 16px var(--display)">${esc(chT(nx.u))}</b><br><span class="xs muted">${SUBJ[s]} · Part ${nx.n} of ${nx.tot}</span><br><span class="xs est">${estTxt(nx.u,nx.n,nx.tot)}</span></span><button class="btn sm" data-act="more" data-s="${s}">Start</button></div>`).join("")}</div>`:`<p class="sm muted">Everything planned is done. Explore anything you like.</p>`}

function agRow(it,now){const col=it.kind==="lesson"?SC(it.s):"r-"+it.who,[hh,ap]=clock(it.at).split(" ");
  if(it.kind==="brk")return `<div class="tr brk"><span class="t num">${hh}<small>${ap}</small></span><span class="brkline">${esc(it.title)} · ${mins(it.dur/60)}</span></div>`;
  const a=`data-id="${it.id}" data-date="${today}"`;
  return `<div class="tr ${col} ${it.done?"done":""} ${it===now?"now":""}"><span class="t num">${hh}<small>${ap}</small></span><div class="tcard"><span class="ic">${icon(KICO[it.kind])}</span><button class="m plain" data-act="tlopen" ${a}><b>${esc(it.kind==="lesson"?chT(it.u):it.title)}</b><span>${it.kind==="lesson"?SUBJ[it.s]+" · ":""}${ROLE[it.who]} · ${mins(it.dur/60)}</span></button><button class="ck" data-act="tlcheck" ${a} aria-label="${it.done?"Done":"Mark done"}: ${esc(it.title)}">${icon("check")}</button></div></div>`}
function viewToday(){const items=dayPlan(today),real=items.filter(i=>i.kind!=="brk"),dn=real.filter(i=>i.done).length,f=focusOf(items,today);
  const lessons=real.filter(i=>i.kind==="lesson"),lessonsDone=lessons.length>0&&lessons.every(i=>i.done),left=real.filter(i=>!i.done&&i!==f),doneL=real.filter(i=>i.done);
  let h=greetBar(`${longDate()} · ${real.length?(f?`${real.length-dn} thing${real.length-dn===1?"":"s"} left`:"all done"):"nothing planned"}`);
  if(S.setup&&!S.parent?.saved&&!S.parent?.name)h+=`<button class="nudge" data-act="parent">${youBlob("","happy",'width="36" height="36"')}<span>${pname()?"Set your wake-up and prep times":"Tell us your name and wake-up time"}</span>${icon("next")}</button>`;
  if(ui.tday&&ui.tday!==today)return h+otherDay(ui.tday);
  h+=`<section class="sec cal">${calHead(today)}`;
  h+=pastEvCard(real);if(f)h+=nowCard(f);h+=nudgeCard();
  if(lessonsDone||!real.length)h+=`<section class="donecard">${blob("var(--sun)",4,"happy","mascot bob")}<h2>${lessons.length?"Lessons done! Keep going?":"Want to start something?"}</h2>${offerList()}</section>`;
  if(left.length)h+=`<div class="sech" style="margin-top:12px"><h3>Later today</h3></div><div class="tt compact">${left.map(i=>tRow(i,today,null)).join("")}</div>`;
  if(doneL.length)h+=`<button class="donebar" data-act="showdone" aria-expanded="${!!ui.showDone}"><span class="ck on">${icon("check")}</span><b>${doneL.length} done today</b><span class="xs">${ui.showDone?"Hide":"Show"}</span></button>${ui.showDone?`<div class="tt compact">${doneL.map(i=>tRow(i,today,null)).join("")}</div>`:""}`;
  {const oc=openCount(),tile=(act,ic,label,sub,extra="")=>`<button class="qtile" data-act="${act}" ${extra}><span class="qi">${icon(ic)}</span><b>${label}</b><span class="xs muted">${sub}</span></button>`;h+=`<div class="qtiles">${tile("gotab","prep","Unfinished",oc?oc+" open":"All caught up",'data-tab="week" data-seg="ongoing"')}${tile("gotab","play","Up next","Next chapters",'data-tab="week" data-seg="queue"')}${tile("quizgo","spark","Quick quiz","Ask a few questions")}${tile("uploads","plus","Add photos","Work samples")}</div>`}
h+=`</section><button class="morebtn" data-act="moresheet">${icon("grid")}<span>More for today</span><span class="xs muted">jokes, games, experiments, your reading</span></button>`;
  return h}
/* ---------- lesson player ---------- */
function findItem(id){return dayPlan(today).find(i=>i.id===id)}
function playerView(){const P=ui.sheet,it={u:unitBy(P.k),n:P.n,tot:P.tot,bonus:P.bonus};if(!it.u)return "";const st=stepState(it),pct=Math.min(100,(st.filter(x=>x.ok).length)/st.length*100);
  document.getElementById("sheetTitle").textContent=`${chT(it.u)} · Part ${P.n} of ${P.tot}`;
  let h=`<div class="ptrack"><span style="width:${pct}%"></span>${sblob(P.s,"happy","rider",`style="left:${Math.max(5,pct)}%"`)}</div>`;
  h+=secBar(st,P.i);
  if(P.i>=st.length){const okN=st.filter(x=>x.ok).length,all=okN===st.length;h+=`<section class="stage finish">${sblob(P.s,all?"happy":"calm","bob",'width="120" height="120"')}<div class="stars">${[0,1,2].map(i=>`<svg width="44" height="44" viewBox="0 0 24 24" style="transform:rotate(${(i-1)*12}deg)"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill="${i<Math.max(1,Math.round(okN/st.length*3))?"var(--sun)":"var(--line)"}"/></svg>`).join("")}</div><h2>${all?"Congrats!":"Nearly there"}</h2><p class="muted">${esc(chT(it.u))} · ${all?"every step done.":`${st.length-okN} step${st.length-okN>1?"s":""} still open. They move to the next lesson day automatically.`}</p>${photoBtn(P.k,"Add a photo of today's work")}</section>`;return h+`<details class="card hub"><summary><b>Want more? Everything for this chapter</b></summary><div class="hubb">${chapterHub(it.u)}</div></details><p class="sm muted" style="text-align:center">Looked through everything? Then finish today\'s lesson.</p><div class="row" style="justify-content:center"><button class="btn green" data-act="finish">${icon("check")}Finish the lesson</button><button class="btn soft" data-act="pstep" data-d="-1">Back</button></div>`}
  const x=st[P.i];
  h+=`<section class="stage"><div class="kind"><span class="k">${icon(x.kind==="step"?"spark":x.kind)}</span><span>${SECN[x.sec||"book"]} · step ${P.i+1} of ${st.length}</span><button class="readbtn" data-act="readnow" aria-label="Read this step aloud">🔊 Read aloud</button></div><h2>${esc(x.title)}</h2>
   <div class="spent"><span class="xs muted">Take your time. Time on this step<br><button class="link xs" data-act="autoread">${S.autoRead?"✓ Reading each step aloud":"Read each step aloud as we go"}</button></span><b class="num" id="spent">${mmss(stepSecs())}</b></div>
   <div class="body">${x.html}</div>
   <div class="row"><button class="btn soft" data-act="pstep" data-d="-1" ${P.i===0?"disabled":""} aria-label="Previous step">${icon("back")}</button><button class="btn green wide" data-act="pdone">${x.ok?"Next":"Done! Next step"}${icon("next")}</button></div></section>`;
  return h}
const mmss=s=>`${Math.floor(s/60)}:${String(Math.max(0,Math.round(s%60))).padStart(2,"0")}`;
function timerLeft(x){const T=ui.timer;if(!T||T.key!==timerKey())return Math.round(x.mins*60);return T.run?Math.max(0,(T.end-Date.now())/1000):T.left}
const timerKey=()=>ui.sheet?ui.sheet.k+"|"+ui.sheet.n+"|"+ui.sheet.i:"";
let tick=null;
function timerToggle(){const P=ui.sheet,it={u:unitBy(P.k),n:P.n,tot:P.tot,bonus:P.bonus},x=stepState(it)[P.i];let T=ui.timer;
  if(!T||T.key!==timerKey())T=ui.timer={key:timerKey(),total:x.mins*60,left:x.mins*60,run:false};
  if(T.run){T.left=Math.max(0,(T.end-Date.now())/1000);T.run=false;clearInterval(tick)}else{T.end=Date.now()+T.left*1000;T.run=true;clearInterval(tick);tick=setInterval(paintTimer,500)}paintTimer()}
function paintTimer(){const T=ui.timer,tt=document.getElementById("tt"),r=document.getElementById("tring"),b=document.getElementById("tbtn");if(!T||!tt||T.key!==timerKey()){clearInterval(tick);return}
  const left=T.run?Math.max(0,(T.end-Date.now())/1000):T.left;tt.textContent=mmss(left);r.setAttribute("stroke-dasharray",`${113*left/T.total} 113`);b.textContent=T.run?"Pause":"Start timer";
  if(T.run&&left<=0){T.run=false;T.left=0;clearInterval(tick);sfx("win");toast("Time's up for this step");b.textContent="Done"}}

/* ---------- chapter ---------- */
function chapterView(){const u=unitBy(ui.sheet.k);if(!u)return "";const c=u.c,x=c?.x,cs=coverage(u),m=modeOf();document.getElementById("sheetTitle").textContent=u.title;
  const tabs=c?.p?{overview:"Overview",days:"Parts",ws:"Worksheets",lab:"Experiments",voices:"Other voices",...(resourcesFor(u).length?{res:"Resources"}:{}),...(x?{questions:"Big questions",play:"Play"}:{}),...(c.read?{read:"Read more"}:{})}:m==="books"?{overview:"Overview",...(c?{read:"Read more"}:{})}:x?{overview:"Overview",plans:"Lesson plans",questions:"Big questions",tasks:"Tasks",worksheet:"Worksheet",play:"Play",read:"Read more"}:c?{overview:"Overview",plans:"Lesson plans",tasks:"Tasks",read:"Read more"}:{overview:"Overview",plans:"Lesson plans"};
  const t=tabs[ui.ctab[u.k]]?ui.ctab[u.k]:"overview",inPlan=everyUnit().some(z=>z.k===u.k)&&plannedUnits(u.subj).some(z=>z.k===u.k);
  let h=`<section class="chero ${SC(u.subj)}"><span class="n">${/^\d+$/.test(u.n)?u.n:esc(u.n)}</span><span class="eyebrow" style="color:#2B2340;opacity:.7">${u.board==="gen"?"DeepKids topic · Level "+u.level:esc(u.book)}</span><h1>${esc(u.title)}</h1><span class="sticker ${cs}" style="justify-self:start">${STATUS[cs]}${cs==="learning"&&done(u.k)?` · Part ${done(u.k)} of ${sessionsFor(u)}`:""}</span><p>${c?.p?`${c.p.days.length} parts · about ${c.p.day_mins} minutes each`:`${fh(hoursFor(u))} hours in all · ${sessionsFor(u)} lesson days at ${fh(hpdOf(u.subj))} h a day`}</p>${sblob(u.subj,"happy","mascot sway")}</section>
   ${u.board==="gen"&&!u.gen.reviewed?`<p class="note">Written by Claude when a parent searched for it. Not yet reviewed by DeepKids.</p>`:""}
   <div class="row">${inPlan?`<span class="pill completed" style="align-self:center">✓ ${isNextUp(u)?"Next up":"In the plan · no. "+qPos(u)} in ${SUBJ[u.subj]}</span>${isNextUp(u)?"":`<button class="btn sm" data-act="qnext" data-s="${u.subj}" data-k="${u.k}">Do this next</button>`}<button class="btn line sm" data-act="gotab" data-tab="week" data-seg="queue" data-qs="${u.subj}">See the queue</button>`:S.subjects.includes(u.subj)&&(u.board!=="dk"||plusOn())?qPick("les",u.subj,"les:"+u.k,icon("plus")+"Add to the plan"):""}</div>
   
   ${Object.keys(tabs).length>1?`<div class="seg" role="tablist">${Object.entries(tabs).map(([k,v])=>`<button aria-pressed="${t===k}" data-act="ctab" data-k="${u.k}" data-t="${k}">${v}</button>`).join("")}</div>`:""}`;
  if(t==="overview"){if(c?.p)h+=packOverview(u);{const sh=shelfFor(u);if(sh.length)h+=`<section class="card"><span class="eyebrow">From your shelf</span>${sh.map(i=>`<div class="sm"><b>${esc(i.name)}</b>${i.note?` · <span class="muted">${esc(i.note)}</span>`:""}</div>`).join("")}</section>`}h+=topicOverview(u);if(x&&m!=="books")h+=`<section class="card ${SC(u.subj)}"><span class="eyebrow">What to learn</span>${x.learn.map((l,i)=>`<div class="idea"><span class="k">${i+1}</span><p>${esc(l)}</p></div>`).join("")}</section>`;
    if(m==="books"&&c?.x?.cur)h+=`<section class="card" style="gap:0"><span class="eyebrow" style="margin-bottom:6px">Curated resources</span>${c.x.cur.map(([w,src,url,how])=>`<a class="res" href="${esc(url)}" target="_blank" rel="noopener"><span class="xs muted">${esc(src)} ↗</span><b>${esc(w)}</b></a>`).join("")}</section>`;
    if(u.board==="dk"&&u.topic.res.length)h+=`<section class="card"><span class="eyebrow">Resources</span>${u.topic.res.map(r=>r.url?`<a class="res" href="${esc(r.url)}" target="_blank" rel="noopener"><b>${esc(r.title)} ↗</b></a>`:`<div class="res"><b>${esc(r.title)}</b></div>`).join("")}</section>`;
    h+=`<button class="btn line sm" data-act="logk" data-k="${u.k}" style="justify-self:start">Log a session today</button>${rank[cs]<2?`<button class="link xs" data-act="status" data-k="${u.k}" data-s="completed" style="justify-self:start">Already knows this? Mark it done</button>`:""}`}
  if(t==="plans")h+=plansTab(u);if(c?.p)h+=packTab(u,t);if(t==="res")h+=resTab(u);
  if(t==="questions"){const qi=Math.min(ui.qi[u.k]||0,x.deep.length-1),d=x.deep[qi],key="think"+qi;
    h+=`<section class="qcard"><span class="eyebrow">Big question ${qi+1} of ${x.deep.length}</span><h2>${esc(d.q)}</h2><p>${esc(d.why)}</p></section>
     <p class="sm muted">Ask your child first and really listen. Then read the voices together. Which is strongest? Which would you argue against?</p>
     <div class="col">${d.views.map(([w,v],j)=>`<div class="voice" style="--c:${PAL[(j*2+1)%PAL.length]}">${blob(PAL[(j*2+1)%PAL.length],30+j+qi*3,["happy","calm","wow"][j%3])}<div class="say"><b>${esc(w)}</b>${esc(v)}</div></div>`).join("")}</div>
     <section class="mission"><b>Try this</b><span>${esc(d.tryit)}</span></section>
     <div class="field"><label for="th-${u.k}-${qi}">What does ${esc(S.child||"your child")} think?</label><textarea class="inp" id="th-${u.k}-${qi}" data-ans="${u.k}|${key}" placeholder="Write their words, not yours">${esc(A(u.k,key)||"")}</textarea></div>
     <div class="pager"><button class="btn line sm" data-act="qi" data-k="${u.k}" data-d="-1" ${qi===0?"disabled":""}>${icon("back")}Previous</button><span class="xs muted">${qi+1} / ${x.deep.length}</span><button class="btn sm" data-act="qi" data-k="${u.k}" data-d="1" ${qi===x.deep.length-1?"disabled":""}>Next${icon("next")}</button></div>`}
  if(t==="tasks"){const ts=x?chapterTasks(u):[["game","",c.game[0],c.game[1]],...c.exp.map((e,i)=>["exp"+i,"","Experiment "+(i+1),e]),...c.act.map((e,i)=>["act"+i,"","Activity "+(i+1),e]),["proj","",c.proj[0],c.proj[1]]];const dn=ts.filter(a=>taskDone(u.k,a[0])).length,H=x?.hours||[];
    const hh=id=>{const re={ws:/^Worksheet/,exp0:/^Experiment/,act0:/^Activit/,game:/^Game/,proj:/^Project/}[id];const r=re&&H.find(a=>re.test(a[0]));return r?`<span class="chip">${mins(r[1])}${r[2]>1?` over ${r[2]} days`:""}</span>`:""};
    h+=`<section class="card ${SC(u.subj)}"><div class="sech"><h3>${dn} of ${ts.length} done</h3></div><div class="bar"><span style="width:${dn/ts.length*100}%;background:var(--c)"></span></div></section><section class="card" style="gap:0">${ts.map(([id,,ttl,desc])=>{const d=taskDone(u.k,id),kind=id.replace(/\d+$/,"");return `<div class="taskrow ${d?"done":""}"><button class="ckb" data-act="task" data-k="${u.k}" data-id="${id}" aria-label="${d?"Mark not done":"Mark done"}: ${esc(ttl)}">${icon("check")}</button><div><div class="row" style="gap:8px">${icon(kind)}<b>${esc(ttl)}</b></div><p class="sm" style="margin-top:4px">${esc(desc)}</p><div class="meta">${hh(id)}${kind==="ws"?`<button class="btn xs" data-act="ws" data-k="${u.k}">Open worksheet</button>`:""}${kind==="proj"?`<button class="btn xs soft" data-act="startexp" data-title="${esc(ttl)}" data-topic="${esc(u.title)}">Track it daily</button>`:""}${photoBtn(u.k,"Photo")}</div></div></div>`}).join("")}</section>`}
  if(t==="worksheet"){const q=x.wsd.reduce((a,s)=>a+s[1].length,0);h+=`<section class="card"><span class="eyebrow">Worksheet</span><h3 style="font-size:20px">${x.wsd.length} sections, ${q} questions</h3><div class="col" style="gap:6px">${x.wsd.map(([t2,its])=>`<div class="row" style="justify-content:space-between"><span>${esc(t2)}</span><span class="xs muted">${its.length} questions</span></div>`).join("")}</div><button class="btn" data-act="ws" data-k="${u.k}">${taskDone(u.k,"ws")?"Open again (finished)":"Start the worksheet"}</button></section>`}
  if(t==="play")h+=`<section class="qcard" style="background:var(--gum)"><span class="eyebrow">Chapter game</span><h2>${esc(c.game[0])}</h2><p>${esc(c.game[1])}</p></section><section class="card" style="gap:0"><span class="eyebrow" style="margin-bottom:6px">Curated from around the world</span>${x.cur.map(([w,src,url,how])=>`<a class="res" href="${esc(url)}" target="_blank" rel="noopener"><span class="xs muted">${esc(src)} ↗</span><b>${esc(w)}</b><span class="sm muted">${esc(how)}</span></a>`).join("")}</section>`;
  if(t==="read")h+=`<section class="card" style="gap:0">${[`${u.book}${chNo(u)?", "+chNo(u):""}`,...(c.links||[]),...(c.read||[])].map(r=>`<div class="res"><b>${esc(r)}</b></div>`).join("")}</section>`;
  return h}

/* ---------- worksheet (one section per page) ---------- */
function wsItem(k,id,it,qn){const v=A(k,id);let b="";
  if(it.t==="mcq")b=`<div class="col" style="gap:8px">${it.opts.map((o,oi)=>`<button class="opt ${v===undefined?"":oi===it.a?"right":oi===v?"wrong":""}" data-act="mcq" data-k="${k}" data-id="${id}" data-o="${oi}" data-a="${it.a}" ${v!==undefined?"disabled":""}>${esc(o)}</button>`).join("")}</div>${v!==undefined?`<div class="row sm"><span>${v===it.a?"Right.":"The green one is our answer. Talk about why."}</span><button class="link sm" data-act="mcqreset" data-k="${k}" data-id="${id}">Try again</button></div>`:""}`;
  else if(it.t==="fill")b=`<div class="col" style="gap:8px">${it.a.map((_,bi)=>`<input class="inp" id="f-${k}-${id}-${bi}" data-ans="${k}|${id}|${bi}" placeholder="Blank ${bi+1}" value="${esc((v||[])[bi]||"")}">`).join("")}</div><div class="row"><button class="btn xs" data-act="checkfill" data-k="${k}" data-id="${id}" data-a="${esc(JSON.stringify(it.a))}">Check</button><button class="link sm" data-act="showfill" data-a="${esc(it.a.join(" · "))}">Show answers</button></div>`;
  else if(it.t==="write")b=`<textarea class="inp" id="w-${k}-${id}" data-ans="${k}|${id}" rows="${it.lines||3}" placeholder="Write here">${esc(v||"")}</textarea>`;
  else if(it.t==="table"){const vv=v||{};b=`<div class="grid"><table><tr>${it.cols.map(c=>`<th>${esc(c)}</th>`).join("")}</tr>${Array.from({length:it.rows},(_,r)=>`<tr>${it.cols.map((_,ci)=>`<td><input id="t-${k}-${id}-${r}-${ci}" data-ans="${k}|${id}|${r}.${ci}" value="${esc(vv[r+"."+ci]??(ci===0&&it.prefill?it.prefill[r]||"":""))}" aria-label="${esc(it.cols[ci])}, row ${r+1}"></td>`).join("")}</tr>`).join("")}</table></div>`}
  else if(it.t==="draw")b=`<canvas class="pad" data-pad="${k}|${id}"></canvas><div class="row"><button class="link sm" data-act="clearpad" data-pad="${k}|${id}">Clear</button><button class="btn xs ${v?"soft":""}" data-act="drew" data-k="${k}" data-id="${id}">${v?"Drawn ✓":"Drawn on paper"}</button></div>`;
  else if(it.t==="sort"){const vv=v||{},sel=ui.sel[k+id];b=`<div class="pool">${it.items.filter(z=>vv[z]===undefined).map(z=>`<button class="token ${sel===z?"sel":""}" data-act="tok" data-k="${k}" data-id="${id}" data-x="${esc(z)}">${esc(z)}</button>`).join("")||`<span class="sm">All sorted. Could any go in two boxes?</span>`}</div><div class="buckets">${it.cats.map((c,ci)=>`<div class="bucket" data-act="bucket" data-k="${k}" data-id="${id}" data-c="${ci}"><b>${esc(c)}</b>${it.items.filter(z=>vv[z]===ci).map(z=>`<button class="token" data-act="untok" data-k="${k}" data-id="${id}" data-x="${esc(z)}">${esc(z)} ×</button>`).join("")}</div>`).join("")}</div><p class="xs muted">${sel?`Now tap a box for “${esc(sel)}”.`:"Tap a word, then tap its box."}</p>`}
  else if(it.t==="match"){const vv=v||{},sel=ui.sel[k+id],rights=it.pairs.map(p=>p[1]).slice().sort();b=`<div class="match"><div class="col" style="gap:6px">${it.pairs.map(([l])=>`<button class="mitem ${vv[l]!==undefined?"paired":sel===l?"sel":""}" data-act="mleft" data-k="${k}" data-id="${id}" data-x="${esc(l)}">${esc(l)}${vv[l]!==undefined?" → "+esc(vv[l]):""}</button>`).join("")}</div><div class="col" style="gap:6px">${rights.map(r=>`<button class="mitem ${Object.values(vv).includes(r)?"paired":""}" data-act="mright" data-k="${k}" data-id="${id}" data-x="${esc(r)}">${esc(r)}</button>`).join("")}</div></div>${Object.keys(vv).length===it.pairs.length?`<div class="row sm"><span>${it.pairs.filter(([l,r])=>vv[l]===r).length} of ${it.pairs.length} match ours.</span><button class="link sm" data-act="mreset" data-k="${k}" data-id="${id}">Try again</button></div>`:`<p class="xs muted">Tap a word on the left, then its match.</p>`}`}
  return `<div class="wq"><div class="p">${qn}. ${esc(it.p)}</div>${b}</div>`}
function wsView(){const u=unitBy(ui.sheet.k);if(!u)return "";const wid=ui.sheet.w,pw=wid&&u.c?.p?.worksheets?.find(w=>w.id===wid),W=pw?pw.sections:u.c.x.wsd,k=pw?u.k+"#"+wid:u.k,si=Math.min(ui.wsec[k]||0,W.length-1);document.getElementById("sheetTitle").textContent=(pw?pw.title:"Worksheet")+" · "+u.title;
  let qn=W.slice(0,si).reduce((a,s)=>a+s[1].length,0);const [title,items]=W[si];
  return `<div class="segs ${SC(u.subj)}">${W.map((_,i)=>`<i class="${i<si?"ok":i===si?"on":""}"></i>`).join("")}</div><section class="card"><span class="eyebrow">${pw?TIER[pw.tier]+" · ":""}Section ${si+1} of ${W.length}</span><h2 style="font-size:22px">${esc(title.replace(/^[A-Z]\. /,""))}</h2>${items.map((it,ii)=>wsItem(k,si+"-"+ii,it,++qn)).join("")}</section>
   <div class="pager"><button class="btn line" data-act="wsec" data-k="${k}" data-d="-1" ${si===0?"disabled":""}>${icon("back")}Back</button>${si<W.length-1?`<button class="btn accent wide" data-act="wsec" data-k="${k}" data-d="1">Next section${icon("next")}</button>`:`<button class="btn accent wide" data-act="wsdone" data-k="${k}">${taskDone(k,"ws")?"Finished ✓":"Finish the worksheet"}</button>`}</div><p class="xs muted">Many questions have no single right answer. The thinking is the point.</p>`}
function initPads(){document.querySelectorAll("canvas.pad").forEach(c=>{if(c._ok)return;const r=c.getBoundingClientRect();if(!r.width)return;c._ok=1;c.width=r.width*devicePixelRatio;c.height=r.height*devicePixelRatio;const x=c.getContext("2d");x.scale(devicePixelRatio,devicePixelRatio);x.lineWidth=3;x.lineCap="round";x.lineJoin="round";x.strokeStyle=getComputedStyle(document.body).color;let d=false,drew=false;
  const key=padKey(c.dataset.pad),old=lsGet(key);if(old){const im=new Image();im.onload=()=>x.drawImage(im,0,0,r.width,r.height);im.src=old}
  const pt=e=>{const b=c.getBoundingClientRect();return [e.clientX-b.left,e.clientY-b.top]};c.onpointerdown=e=>{d=true;drew=true;c.setPointerCapture(e.pointerId);x.beginPath();x.moveTo(...pt(e))};c.onpointermove=e=>{if(d){x.lineTo(...pt(e));x.stroke()}};
  c.onpointerup=()=>{d=false;if(!drew)return;try{const s=document.createElement("canvas");s.width=Math.min(480,c.width);s.height=Math.round(s.width*c.height/c.width);const g=s.getContext("2d");g.fillStyle="#fff";g.fillRect(0,0,s.width,s.height);g.drawImage(c,0,0,s.width,s.height);lsSet(key,s.toDataURL("image/jpeg",.7))}catch(e){}const [k,id]=c.dataset.pad.split(/\|(?=[^|]*$)/);if(!A(k,id)){setA(k,id,today);save()}}})}
/* ---------- prep checklist ---------- */
function prepView(){const {date,when}=ui.sheet,its=prepBlock(date,when);document.getElementById("sheetTitle").textContent=(when==="am"?"Morning prep":"Prep for tomorrow")+" · "+fmt(date);
  if(!its.length)return `<p class="note">Nothing to prepare. Enjoy the calm.</p>`;const dn=its.filter(p=>S.prep[p.id]).length;
  const groups=[];its.forEach(p=>{let g=groups.find(g=>g.x===p.x);if(!g)groups.push(g={x:p.x,items:[]});g.items.push(p)});
  return `<section class="card r-you"><div class="sech"><h3>${dn} of ${its.length} ready</h3><span class="xs muted">about ${prepMins(its)} min</span></div><div class="bar"><span style="width:${dn/its.length*100}%;background:var(--marigold)"></span></div><p class="xs muted">Set a daily phone alarm for ${clock(hm(D()[when==="am"?"prepAt":"eveAt"]))}. The app can't send reminders itself.</p></section>`+
  groups.map(({x,items})=>{const u=x.u,g=u.c?.p?.summary||u.c?.x?.guide||(u.board!=="dk"?DATA.prepgen.guide[u.subj]:u.topic?.summary);return `<section class="card ${SC(x.subj)}" style="gap:0"><div class="row" style="gap:8px;margin-bottom:4px"><span class="dotc"></span><span class="eyebrow">${SUBJ[x.subj]} · ${fmt(x.date)} · Part ${x.n} of ${x.tot}</span></div><h3 style="font-size:19px;margin-bottom:8px">${esc(u.title)}</h3>
   ${g?`<details style="margin-bottom:6px" ${items.some(p=>p.kind==="guide")?"open":""}><summary style="cursor:pointer;font-weight:500;color:var(--plum)">Parent guide</summary><p class="sm" style="margin-top:6px">${esc(g)}</p></details>`:""}
   ${items.map(p=>`<div class="taskrow ${S.prep[p.id]?"done":""}"><button class="ckb" data-act="prep" data-id="${p.id}" aria-label="Done: ${esc(p.task)}">${icon("check")}</button><div><b style="font-weight:500">${esc(p.task)}</b>${p.early?` <span class="pill learning">start early for ${fmt(x.date)}</span>`:""}<p class="xs muted" style="margin-top:3px">From: ${esc(p.where)}</p></div></div>`).join("")}
   <div class="row" style="margin-top:8px">${u.c?.x?`<button class="btn xs soft" data-act="chapter" data-k="${u.k}" data-t="questions">Big questions</button><button class="btn xs soft" data-act="ws" data-k="${u.k}">Worksheet</button>`:""}<button class="btn xs soft" data-act="chapter" data-k="${u.k}">Chapter</button></div></section>`}).join("")}

/* ---------- jokes & games ---------- */
function wordGame(u){const x=u.c.x,word=x.words[dayNo%x.words.length],g=G(),won=g.g.includes(word),over=won||g.g.length>=6,keys={};
  g.g.forEach(w=>[...w].forEach((ch,i)=>{const c=ch===word[i]?"hit":word.includes(ch)?"near":"miss";if(keys[ch]!=="hit"&&!(keys[ch]==="near"&&c==="miss"))keys[ch]=c}));
  const rows=[...Array(6)].map((_,r)=>{const w=g.g[r]||(r===g.g.length&&!over?(g.cur||""):"");return `<div class="wrow">${[0,1,2,3,4].map(i=>{const ch=w[i]||"";let c=ch?"f":"";if(g.g[r])c=ch===word[i]?"hit":word.includes(ch)?"near":"miss";return `<span class="wt ${c}" style="animation-delay:${i*.07}s">${esc(ch)}</span>`}).join("")}</div>`}).join("");
  return `<p class="sm muted" style="text-align:center">A five-letter word from “${esc(u.title)}”. Green is the right place, yellow is in the word.</p><div class="wgrid">${rows}</div>${over?`<p style="text-align:center;font:600 18px var(--display)">${won?"You got it: ":"The word was "}${word}</p>`:`<div class="kb">${["QWERTYUIOP","ASDFGHJKL","ZXCVBNM"].map((r,i)=>`<div>${i===2?`<button class="w" data-act="wk" data-key="ENTER">Enter</button>`:""}${[...r].map(c=>`<button class="${keys[c]||""}" data-act="wk" data-key="${c}">${c}</button>`).join("")}${i===2?`<button class="w" data-act="wk" data-key="DEL" aria-label="Delete">Del</button>`:""}</div>`).join("")}</div>`}`}
function tfGame(u){const g=G(),q=u.c.x.quiz,i=q.findIndex((_,k)=>g.tf[k]===undefined),right=k=>(g.tf[k]===1)===q[k][1],sc=q.filter((_,k)=>g.tf[k]!==undefined&&right(k)).length;
  const dots=`<div class="dots">${q.map((_,k)=>`<i class="${g.tf[k]===undefined?(k===i?"on":""):right(k)?"ok":"no"}"></i>`).join("")}</div>`;
  if(i<0)return `${dots}<div class="score">${sc}/${q.length}</div><div class="col">${q.map(x=>`<div class="card" style="padding:14px"><span class="eyebrow">${x[1]?"True":"False"}</span><b style="font-weight:500">${esc(x[0])}</b><span class="sm muted">${esc(x[2])}</span></div>`).join("")}</div>`;
  const p=i>0?q[i-1]:null;return `${dots}${p?`<p class="sm" style="text-align:center;color:${right(i-1)?"var(--good)":"var(--bad)"}">${right(i-1)?"Right.":"Not quite."} ${esc(p[2])}</p>`:`<p class="sm muted" style="text-align:center">Some of these sound true and aren't.</p>`}<div class="tfq">${esc(q[i][0])}</div><div class="tfrow"><button class="btn yes" data-act="tf" data-i="${i}" data-v="1">True</button><button class="btn no" data-act="tf" data-i="${i}" data-v="0">False</button></div>`}
function oddGame(u){const g=G(),o=u.c.x.odd[dayNo%u.c.x.odd.length];return `<p class="sm muted" style="text-align:center">Which one doesn't belong? There may be more than one good answer. Can you defend yours?</p><div class="oddgrid">${o[0].map(w=>`<button class="${g.odd?(w===o[1]?"right":w===g.odd?"wrong":""):""}" data-act="odd" data-w="${esc(w)}" ${g.odd?"disabled":""}>${esc(w)}</button>`).join("")}</div>${g.odd?`<p style="text-align:center">${g.odd===o[1]?"Yes. ":"We picked "+esc(o[1])+". "}${esc(o[2])}</p>`:""}`}
function gamesView(){const u=dailyUnit();document.getElementById("sheetTitle").textContent="Jokes and games";if(!u)return `<p class="note">Games come from the science chapter you're on. Add EVS / Science to see them.</p>`;
  const T={word:["Word of the Day",wordGame],tf:["True or False",tfGame],odd:["Odd One Out",oddGame]};
  return `<div class="hs">${u.c.x.jokes.map((j,i)=>{const [q,a]=splitJoke(j),k=today+i;return `<button class="joke" data-act="joke" data-j="${k}"><span class="eyebrow">Joke ${i+1}</span><span class="q">${esc(q)}</span>${ui.jokes[k]?`<span class="a">${esc(a)}</span>`:`<span class="tap">Tap for the answer</span>`}</button>`}).join("")}</div>
   <div class="seg">${Object.entries(T).map(([k,[n]])=>`<button aria-pressed="${ui.game===k}" data-act="gtab" data-g="${k}">${n}</button>`).join("")}</div><section class="col">${T[ui.game][1](u)}</section>
   <button class="btn ${S.tl[today+"|warm"]?"soft":"accent"}" data-act="tlcheck" data-id="warm" data-date="${today}">${S.tl[today+"|warm"]?"Warm-up done ✓":"Warm-up done"}</button>`}

/* ---------- settings ---------- */
function settingsView(){const grp=(id,t,sub,body,open)=>`<details class="card sgrp" ${open||ui.sopen===id?"open":""}><summary><b>${t}</b><span class="xs muted">${sub}</span></summary><div class="sgbody">${body}</div></details>`;
  const R=S.rem||{},out=`${accountCard()}
  ${grp("you","You and your child",`${pname()?esc(pname()):"Your profile"} · ${esc(S.child||"child")}, ${S.age||""}`,`<section class="card r-you tint"><div class="row" style="flex-wrap:nowrap;gap:12px">${youBlob("","happy",'width="48" height="48"')}<div><b style="font:600 17px var(--display)">${pname()?esc(pname()):"Your profile"}</b><p class="xs muted">${S.parent?.saved||S.parent?.name?`Wakes ${clock(hm((S.alarm||{}).time||"06:30"))} · prep ${clock(hm(D().prepAt))} and ${clock(hm(D().eveAt))}`:"Not set up yet"}</p></div></div><button class="btn soft sm" data-act="parent" style="justify-self:start">Edit my profile</button></section>
    <div class="field"><label for="sName">Child's name</label><input class="inp" id="sName" maxlength="40" value="${esc(S.child)}"></div><div class="field"><label for="sStart">Plan starts on</label><input class="inp" id="sStart" type="date" value="${S.start}"></div><button class="btn sm" data-act="saveset" style="justify-self:start">Save</button>`)}
  ${grp("learn","Syllabus and how you learn",`${S.board==="none"?"DeepKids Plus":S.board==="combined"?"NCERT, Cambridge and NIOS":BOARDS[S.board]} · ${esc(MODES[modeOf()][0])}`,`<span class="eyebrow">How you learn</span><select class="inp" id="sMode">${Object.entries(MODES).map(([k,[n]])=>`<option value="${k}" ${modeOf()===k?"selected":""}>${n}</option>`).join("")}</select><p class="xs muted">${esc(MODES[modeOf()][1])}</p><label class="toggle" style="box-shadow:none;padding:0"><input type="checkbox" id="sExam" ${S.exam?"checked":""}><span><b style="font:600 16px var(--display)">Exam track</b><br><span class="xs muted">Every syllabus chapter comes first, in a sensible order, so nothing is missed before exams.</span></span></label><button class="btn sm" data-act="saveset" style="justify-self:start">Save</button>
    <span class="eyebrow" style="margin-top:8px">Syllabus</span><p class="sm">${S.board==="none"?"DeepKids Plus only":S.board==="combined"?"NCERT, Cambridge and NIOS":BOARDS[S.board]}${S.plus&&S.board!=="none"?" + DeepKids Plus":""} · ${S.subjects.map(s=>SUBJ[s]).join(", ")}</p><button class="btn line sm" data-act="redo" style="justify-self:start">Change syllabus or subjects</button>`)}
  ${grp("day","Your day",`Lessons from ${clock(hm(D().start))} · lunch ${clock(hm(D().lunch))}`,plPart("day"))}
  ${grp("cal","Calendar link",S.cal?.on?"Google Calendar linked":"Not linked",calendarCard())}
  ${grp("rem","Reminders",R.time?`Daily at ${clock(hm(R.time))}`:"Free-time nudges on Today",remView())}
  ${grp("data","Your data","Save a copy, or bring one in from another device",dataBox())}
  ${grp("sound","Sound and reading aloud",`${soundOn?"Sounds on":"Sounds off"} · ${S.autoRead?"reads each step aloud":"read aloud on tap"}`,`<label class="zrow"><input type="checkbox" data-act="sndtoggle" ${soundOn?"checked":""}><span><b class="sm">Sounds</b><br><span class="xs muted">Little chimes when things are done</span></span></label><label class="zrow"><input type="checkbox" data-act="autoread" ${S.autoRead?"checked":""}><span><b class="sm">Read each lesson step aloud</b><br><span class="xs muted">Or tap 🔊 on any screen to hear it</span></span></label>`)}
  <p class="xs muted">${syncMode==="account"?`Everything is saved privately to your DeepKids account${lastSaved?" · last saved "+new Date(lastSaved).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):""}. It follows you to any device where you're signed in.`:store?"Couldn't reach your account just now. Saved on this device; it will retry.":"Saved in this browser only."}</p>`;document.getElementById("sheetTitle").textContent="Settings";return out}

/* ---------- Week ---------- */
function weekDays(){const m=parse(monday());m.setDate(m.getDate()+7*(ui.week||0));return [...Array(7)].map((_,i)=>{const d=new Date(m);d.setDate(d.getDate()+i);return iso(d)})}
function lanes(date){const items=dayPlan(date),d=D();if(!items.length)return `<p class="note">Nothing on the clock this day.</p>`;const t0=Math.floor((Math.min(hm(d.prepAt),...items.map(i=>i.at))-20)/60)*60,t1=Math.ceil((Math.max(...items.map(i=>i.at+i.dur))+20)/60)*60,ppm=1.2;
  const hrs=[];for(let h=t0;h<t1;h+=60)hrs.push(`<div class="hr" style="top:${(h-t0)*ppm}px">${clock(h).replace(":00","")}</div>`);
  const b=i=>{const lane=i.who==="you"?"left:0;width:calc(50% - 3px)":i.who==="kid"?"right:0;width:calc(50% - 3px)":"left:0;right:0";const col=i.kind==="lesson"?SC(i.s):"r-"+i.who;return `<div class="blk ${col} ${i.done?"ok":""}" style="top:${(i.at-t0)*ppm+1}px;height:${Math.max(20,i.dur*ppm-3)}px;${lane}">${clock(i.at)} · ${esc(i.kind==="lesson"?SUBJ[i.s]+": "+i.u.title:i.title)}</div>`};
  return `<div class="calhead"><span></span><span>${youBlob()}You</span><span>${kidBlob()}${esc(S.child||"Child")}</span></div><div class="cal" style="height:${(t1-t0)*ppm}px">${hrs.join("")}<div class="lanes">${items.map(b).join("")}</div></div><p class="xs muted">Full-width blocks are things you do together.</p>`}
function viewWeek(){const days=weekDays(),all=S.subjects.flatMap(s=>schedule(s));const by={};all.forEach(x=>(by[x.date]=by[x.date]||[]).push(x));const sel=days.includes(ui.wday)?ui.wday:days.includes(today)?today:days[0];
  let h=`<section class="sec" style="margin-top:8px"><div class="sech"><h1 style="font-size:28px">Week</h1><div class="row" style="gap:6px"><button class="iconbtn" style="width:38px;height:38px" data-act="wk2" data-d="-1" aria-label="Previous week">${icon("back")}</button><span class="sm" style="min-width:86px;text-align:center">${ui.week?fmt(days[0]).replace(/^\w+,?\s*/,""):"This week"}</span><button class="iconbtn" style="width:38px;height:38px" data-act="wk2" data-d="1" aria-label="Next week">${icon("next")}</button></div></div>
   <div class="days">${days.map(d=>`<button class="day ${d===today?"today":""}" aria-pressed="${d===sel}" data-act="wday" data-d="${d}">${DAYN[parse(d).getDay()]}<b>${parse(d).getDate()}</b><span class="pips">${(by[d]||[]).map(x=>`<i class="${SC(x.subj)}"></i>`).join("")}${eventsOn(d).length?`<i class="r-out"></i>`:""}</span></button>`).join("")}</div></section>
   <section class="sec"><div class="sech"><h3>${fmt(sel)}</h3><div class="seg" style="width:auto"><button aria-pressed="${ui.wview!=="list"}" data-act="wview" data-v="lanes">Calendar</button><button aria-pressed="${ui.wview==="list"}" data-act="wview" data-v="list">List</button></div></div>
   ${ui.wview==="list"?(()=>{const its=dayPlan(sel);return its.length?`<div class="tt">${its.map(i=>{const [hh,ap]=clock(i.at).split(" ");return i.kind==="brk"?agRow(i):`<div class="tr ${i.kind==="lesson"?SC(i.s):"r-"+i.who} ${i.done?"done":""}"><span class="t num">${hh}<small>${ap}</small></span><div class="tcard"><span class="ic">${icon(KICO[i.kind])}</span><span class="m"><b>${esc(i.kind==="lesson"?i.u.title:i.title)}</b><span>${i.kind==="lesson"?SUBJ[i.s]+" · ":""}${ROLE[i.who]} · ${mins(i.dur/60)}</span></span>${i.kind==="lesson"?`<button class="btn xs soft" data-act="chapter" data-k="${i.u.k}">Open</button>`:"<span></span>"}</div></div>`}).join("")}</div>`:`<p class="note">Nothing planned this day.</p>`})():lanes(sel)}</section>`;
  const evs=S.events||[];
  h+=`<section class="sec"><div class="sech"><h3>Classes and outings</h3><button class="link" data-act="addev">+ Add</button></div><div class="tt">${evs.map(e=>`<div class="tcard ${e.kind==="outing"?"r-out":"r-"+e.who}"><span class="ic">${icon("event")}</span><span class="m"><b>${esc(e.title)}</b><span>${clock(hm(e.start))} · ${e.rep==="weekly"?"Every "+e.days.map(d=>DAYN[d]).join(", "):fmt(e.date)} · until ${clock(hm(e.end))} · ${ROLE[e.kind==="outing"?"out":e.who]}${e.note?" · "+esc(e.note):""}</span></span><button class="iconbtn" style="width:34px;height:34px" data-act="delev" data-e="${e.id}" aria-label="Remove ${esc(e.title)}">${icon("close")}</button></div>`).join("")||`<p class="sm muted" style="padding:16px">Tuitions, swimming, art class, museum trips. Lessons move around them.</p>`}</div></section>`;
  const d=D();h+=`<section class="sec"><div class="sech"><h3>Your day</h3></div><div class="card"><div class="fgrid">
    <div class="field"><label for="dPrep">Morning prep</label><input class="inp" id="dPrep" type="time" data-dayset="prepAt" value="${d.prepAt}"></div><div class="field"><label for="dStart">Lessons start</label><input class="inp" id="dStart" type="time" data-dayset="start" value="${d.start}"></div>
    <div class="field"><label for="dBrk">Break between</label><select class="inp" id="dBrk" data-dayset="brk">${[0,10,15,20,30].map(v=>`<option value="${v}" ${+d.brk===v?"selected":""}>${v} min</option>`).join("")}</select></div>
    <div class="field"><label for="dLunch">Lunch at</label><input class="inp" id="dLunch" type="time" data-dayset="lunch" value="${d.lunch}"></div><div class="field"><label for="dLunchM">Lunch length</label><select class="inp" id="dLunchM" data-dayset="lunchMin">${[30,45,60,90].map(v=>`<option value="${v}" ${+d.lunchMin===v?"selected":""}>${v} min</option>`).join("")}</select></div>
    <div class="field"><label for="dEve">Evening prep</label><input class="inp" id="dEve" type="time" data-dayset="eveAt" value="${d.eveAt}"></div></div></div></section>`;
  h+=`<section class="sec"><div class="sech"><h3>Pace</h3><span class="xs muted">Change anything and the year re-plans</span></div>${S.subjects.map(s=>{const sc=schedule(s),cur=sc.filter(x=>x.u.level===S.levels[s]),l=S.levels[s];return `<div class="card ${SC(s)}"><div class="sech"><div class="row" style="gap:8px"><span class="dotc"></span><h3>${SUBJ[s]}</h3></div><div class="stepper"><button data-act="lvl" data-s="${s}" data-d="-1" ${l<=1?"disabled":""} aria-label="Class down">−</button><span class="sm" style="min-width:64px;text-align:center">Class ${l}</span><button data-act="lvl" data-s="${s}" data-d="1" ${l>=5?"disabled":""} aria-label="Class up">+</button></div></div>
     <div class="row"><select class="inp" style="width:auto;height:38px" id="hpd-${s}" data-hpd="${s}" aria-label="${SUBJ[s]} hours a day">${[.25,.5,.75,1,1.5,2,3].map(v=>`<option value="${v}" ${hpdOf(s)===v?"selected":""}>${v} h a day</option>`).join("")}</select><div class="dpick">${[1,2,3,4,5,6,0].map(dd=>`<button aria-pressed="${daysOf(s).includes(dd)}" data-act="day" data-s="${s}" data-d="${dd}">${DAYN[dd]}</button>`).join("")}</div></div>
     <p class="xs muted">${lvlLabel(l)} · ${cur.length} lesson days left at this level${cur.length?`, finishing around ${fmt(cur[cur.length-1].date)}`:""}</p></div>`}).join("")}</section>`;
  return h}

/* ---------- Library ---------- */
function unitRow(u,cs){const ts=u.c?.x?chapterTasks(u):null,td=ts?ts.filter(a=>taskDone(u.k,a[0])).length:0;return `<button class="unit ${SC(u.subj)}" data-act="chapter" data-k="${u.k}"><span class="no">${/^\d+$/.test(u.n)?u.n:esc(u.n)}</span><span style="min-width:0"><b>${esc(u.title)}</b><br><span class="xs muted">${ts?`Full chapter · ${td} of ${ts.length} tasks`:u.c?"Games and projects":u.board==="dk"?"DeepKids Plus":"Textbook chapter"} · ${fh(hoursFor(u))} h</span></span>${pillS(cs)}</button>`}
function viewLibrary(){const t=ui.lt||"topics",inv=S.inv||[];
  let h=`<section class="sec" style="margin-top:8px"><div class="sech"><h1 style="font-size:30px">Library</h1>${blob("var(--gum)",7,"happy","",'width="50" height="50"')}</div><div class="seg">${LIBT.map(([k,n])=>`<button aria-pressed="${t===k}" data-act="lt" data-t="${k}">${n}</button>`).join("")}</div><p class="xs muted segdesc">${esc((LIBT.find(x=>x[0]===t)||LIBT[0])[2])}</p></section>`;
  if(t==="topics")h+=topicsTab();if(t==="science")h+=scienceTab();
  if(t==="have"){const seen=new Set(inv.map(i=>i.name.toLowerCase())),kw=new Set(),doneTasks=preppedTasks();
    PREP_KW.forEach(k=>{if(doneTasks.some(x=>x.toLowerCase().includes(k.toLowerCase()))&&!seen.has(k.toLowerCase()))kw.add(k)});
    h+=`<section class="sec">${invCard()}${Object.keys(CATS).map(c=>{const L=inv.filter(i=>i.cat===c);return L.length?`<div class="card" style="gap:0"><div class="sech"><h3 style="font-size:18px">${CATS[c]}</h3><span class="pill">${L.length}</span></div>${L.map(invItem).join("")}</div>`:""}).join("")}
     ${kw.size?`<div class="card r-you tint"><span class="eyebrow">From your lesson prep</span><p class="sm">You gathered these for lessons. Add them to your home shelf?</p><div class="row">${[...kw].map(k=>`<button class="chip" data-act="invadd" data-n="${esc(k)}" data-c="equipment">${icon("plus")}${esc(k)}</button>`).join("")}</div></div>`:""}
     <details class="card"><summary class="link" style="cursor:pointer">Add one thing by hand</summary><div class="row" style="flex-wrap:nowrap;margin-top:10px"><input class="inp" id="invName" maxlength="60" placeholder="Add something you have"><select class="inp" id="invCat" style="width:auto">${Object.entries(CATS).map(([k,n])=>`<option value="${k}">${n}</option>`).join("")}</select></div><button class="btn sm" data-act="invnew" style="justify-self:start;margin-top:8px">Add</button></details></section>`}
  if(t==="suggest"){const have=new Set(inv.map(i=>i.name.toLowerCase()));h+=`<section class="sec"><p class="sm muted">Picked for ${esc(S.child||"your child")}'s age and syllabus. Links go to the shop or maker; check the price there.</p>${Object.keys(CATS).map(c=>{const L=LIB.suggest.filter(x=>x[0]===c);return L.length?`<div class="sech"><h3 style="font-size:18px">${CATS[c]}</h3></div><div class="grid2">${L.map(([cat,n,by,why,url],i)=>`<div class="libcard" style="--c:${PAL[i%PAL.length]}"><span class="eyebrow">${esc(by)}</span><b>${esc(n)}</b><p class="sm">${esc(why)}</p><div class="row"><a class="btn xs" href="${esc(url)}" target="_blank" rel="noopener">See it ↗</a>${have.has(n.toLowerCase())?`<span class="pill completed">We have it</span>`:`<button class="btn xs soft" data-act="invadd" data-n="${esc(n)}" data-c="${cat}">We have it</button>`}</div></div>`).join("")}</div>`:""}).join("")}</section>`}
  if(t==="read")h+=`<section class="sec">${[["parents","For you"],["kids","For "+esc(S.child||"kids")]].map(([k,n])=>`<div class="sech"><h3 style="font-size:18px">${n}</h3></div><div class="card" style="gap:0">${LIB.read[k].map(([ti,d,u])=>`<a class="res" href="${esc(u)}" target="_blank" rel="noopener"><b style="font:600 16px var(--display)">${esc(ti)} ↗</b><span class="sm muted">${esc(d)}</span></a>`).join("")}</div>`).join("")}</section>`;
  if(t==="watch")h+=`<section class="sec">${[["parents","For you"],["kids","For "+esc(S.child||"kids")],["family","Family watch"]].map(([k,n])=>`<div class="sech"><h3 style="font-size:18px">${n}</h3></div><div class="grid2">${LIB.watch[k].map(([ti,d,u],i)=>`<a class="libcard" style="--c:${PAL[(i+2)%PAL.length]};text-decoration:none;color:inherit" href="${esc(u)}" target="_blank" rel="noopener">${icon("play")}<b>${esc(ti)}</b><span class="sm">${esc(d)}</span></a>`).join("")}</div>`).join("")}</section>`;
  return h}

/* ---------- Journey ---------- */
const ring=(p,col)=>`<svg class="ring" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="var(--sunk)" stroke-width="5"/><circle cx="22" cy="22" r="18" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${113*p} 113" transform="rotate(-90 22 22)"/><text x="22" y="26" text-anchor="middle" font-family="Fredoka,sans-serif" font-size="10" font-weight="600" fill="var(--ink)">${Math.round(p*100)}%</text></svg>`;
function viewJourney0(){const kid=esc(S.child||"Your child"),Qn=quotes().length,W=workOf().length,bs=boardsOn();
  let h=`<section class="sec" style="margin-top:8px"><div class="sech"><h1 style="font-size:30px">${kid}'s journey</h1>${kidBlob("","happy",'width="54" height="54"')}</div><div class="stack3">${S.subjects.map(s=>{const x=subjStats(s);return `<button class="scard ${SC(s)}" data-act="jsub" data-s="${s}"><span class="eyebrow" style="color:#2B2340;opacity:.7">${SUBJ[s]}</span><span class="big num">${Math.round(x.pct*100)}%</span><span class="xs" style="font-weight:800">${x.completed} of ${x.us.length} chapters${x.learning?` · ${x.learning} in progress`:""}</span>${sblob(s,"happy")}</button>`}).join("")}</div></section>`;
  const rows=[["high","Highlights",Qn||W?`${Qn} answers in ${kid}'s words · ${W} photos`:"Answers and photos of work",blob("var(--sun)",4,"wow","",'width="40" height="40"')],...(bs.length?[["board","Against the board","What's done and what's due",blob("var(--sky)",13,"calm","",'width="40" height="40"')]]:[]),["beyond","Beyond the board","Plus topics and free exploring",blob("var(--gum)",7,"happy","",'width="40" height="40"')],["diary","Learning diary",S.log.length+" lessons so far",blob("var(--pist)",9,"happy","",'width="40" height="40"')],["numbers","Numbers","Lessons, hours, tasks, games",blob("var(--tang)",11,"happy","",'width="40" height="40"')]];
  h+=`<section class="sec">${rows.map(([k,t,s,b])=>`<button class="menurow" data-act="jrsheet" data-p="${k}">${b}<span><b>${t}</b><br><span class="xs muted">${s}</span></span>${icon("next")}</button>`).join("")}</section>`;
  h+=rfCard();h+=doneHistory();
  return h}
/* ---------- onboarding ---------- */
function startOnboarding(step){ob={step:step??0,d:JSON.parse(JSON.stringify({child:S.child,age:S.age,board:S.board,plus:S.plus,subjects:S.subjects,levels:S.levels,hpd:S.hpd||DEF_HPD,mode:S.mode||(S.plus?"booksplus":"books"),exam:!!S.exam}))};render()}
function viewOnboarding(){const d=ob.d;let h=`<div class="ob"><div class="obbar">${[0,1,2,3,4].map(i=>`<i class="${i<=ob.step?"on":""}"></i>`).join("")}</div>`;
  if(ob.step===0)h+=`${crowd()}<div><span class="eyebrow">Welcome to DeepKids</span><h1 style="margin-top:6px">Let's plan an amazing year of learning at home</h1></div><div class="field"><label for="obName">Who is learning?</label><input class="inp" id="obName" maxlength="40" value="${esc(d.child)}" placeholder="Child's name, like Aarav"></div><div class="field"><span>Age</span><div class="ages">${[6,7,8,9,10].map(a=>`<button type="button" aria-pressed="${d.age===a}" data-age="${a}">${a}</button>`).join("")}</div></div><div class="field"><span>Class this year</span><div class="ages">${[1,2,3,4,5].map(c=>`<button type="button" aria-pressed="${obCls(d)===c}" data-cls="${c}">${c}</button>`).join("")}</div><span class="xs muted">We use the class to pick the right syllabus books. You can still add any chapter from the Library.</span></div>`;
  if(ob.step===1)h+=`<h1>Which syllabus?</h1><div class="choices">${[["ncert","NCERT / CBSE","India's national textbooks","var(--tang)"],["cambridge","Cambridge Primary","Stages 1–5","var(--sky)"],["nios","NIOS","Open Basic Education","var(--pist)"],["combined","Combined","All three boards, mapped together","var(--peri)"],["waldorf","Waldorf (Steiner)","Main lesson blocks, stories, arts and handwork, the Indian way","var(--sun)"],["none","Only DeepKids Plus","Our own big-question curriculum","var(--gum)"]].map(([k,n,s,c],i)=>`<button type="button" class="choice" aria-pressed="${d.board===k}" data-b="${k}">${blob(c,20+i,d.board===k?"happy":"calm")}<span><b>${n}</b><span>${s}</span></span></button>`).join("")}</div>${d.board==="waldorf"?`<p class="sm muted" style="margin-top:8px">Waldorf learning is built around a long morning main lesson, Hindi, and a weekly rhythm of painting, handwork, music, modelling and baking.</p>`:d.board!=="none"?`<h2 style="font-size:24px;margin-top:8px">How do you want to learn?</h2><div class="choices">${Object.entries(MODES).map(([k,[n,desc,c]],i)=>`<button type="button" class="choice" aria-pressed="${(d.mode||"booksplus")===k}" data-mode="${k}">${blob(c,40+i,(d.mode||"booksplus")===k?"happy":"calm")}<span><b>${n}</b><span>${desc}</span></span></button>`).join("")}</div><label class="toggle"><input type="checkbox" id="obExam" ${d.exam?"checked":""}><span><b style="font:600 17px var(--display)">Exam track</b><br><span class="sm muted">Planning for board or NIOS exams? Every syllabus chapter stays first.</span></span></label>`:`<p class="note">DeepKids Plus only: our own topics and lesson plans, drawing on every syllabus.</p>`}`;
  if(ob.step===2)h+=`<h1>Which subjects?</h1><div class="choices">${visSubj(d.board).map(k=>`<button type="button" class="choice" aria-pressed="${d.subjects.includes(k)}" data-s="${k}">${sblob(k,d.subjects.includes(k)?"happy":"sleepy")}<span><b>${SUBJ[k]}</b><span>${k==="wml"?"The long morning lesson: stories, letters, numbers, nature and history in blocks of 3–4 weeks":k==="wart"?"Painting, handwork, music, modelling and baking, one each weekday":k==="hin"&&d.board==="waldorf"?"Hindi as the second language: songs first, then letters":k==="hin"?"Not part of Cambridge":k==="dks"?"Big questions about life, the earth and the universe. Every day, alongside the syllabus":"Tap to include or leave out"}</span></span></button>`).join("")}</div>`;
  if(ob.step===3)h+=`<h1>Level and time</h1><p class="muted">A starting level, and roughly how long each subject gets on the days you do it.</p>${d.subjects.map(s=>`<div class="card ${SC(s)}"><div class="row" style="gap:10px">${sblob(s,"happy","",'width="40" height="40"')}<b style="font:600 18px var(--display)">${SUBJ[s]}</b></div><div class="fgrid"><select class="inp" id="obl-${s}" data-s="${s}" aria-label="${SUBJ[s]} level">${[1,2,3,4,5].map(l=>`<option value="${l}" ${d.levels[s]===l?"selected":""}>${lvlLabel(l)}</option>`).join("")}</select><select class="inp" id="obh-${s}" data-hpd="${s}" aria-label="${SUBJ[s]} hours a day">${[.25,.5,.75,1,1.5,2,3].map(v=>`<option value="${v}" ${(d.hpd||DEF_HPD)[s]===v?"selected":""}>${v} h a day</option>`).join("")}</select></div></div>`).join("")}`;
  if(ob.step===4){const keep=S;S={...S,...d};h+=`<h1>${esc(d.child||"Your child")}'s year</h1><div class="col">${d.subjects.map(s=>{const c=collate(s),books=[...new Set(c.board.map(u=>u.book))];return `<div class="card ${SC(s)}"><div class="row" style="gap:10px">${sblob(s,"happy","",'width="40" height="40"')}<b style="font:600 18px var(--display)">${SUBJ[s]}</b><span class="xs muted">${lvlLabel(d.levels[s])}</span></div>${books.map(b=>`<span class="sm">${esc(b)}: ${c.board.filter(u=>u.book===b).length} chapters</span>`).join("")}${c.dk.length?`<span class="sm">DeepKids Plus: ${c.dk.length} topics</span>`:""}${notesFor(s,d.levels[s]).map(n=>`<span class="xs muted">${esc(n)}</span>`).join("")}</div>`}).join("")}</div>`;S=keep}
  h+=`<div class="row" style="justify-content:space-between">${ob.step>0?`<button class="btn soft" data-ob="back">Back</button>`:"<span></span>"}<button class="btn" data-ob="next">${ob.step===4?"Build my plan":"Continue"}${icon("next")}</button></div></div>`;return h}

const obCls=d=>d.cls||Math.min(5,Math.max(1,d.age-5));
function obNext(){const d=ob.d;if(ob.step===0){d.child=document.getElementById("obName").value.trim();const c=obCls(d);SUBJ_KEYS.forEach(s=>d.levels[s]=c)}if(ob.step===2&&!d.subjects.length){sfx("no");toast("Pick at least one subject");return}
  if(ob.step===4){if(d.board==="none")d.mode="plus";d.mode=d.mode||"booksplus";d.plus=d.mode!=="books";Object.assign(S,d,{setup:true});ob=null;tab="today";commit();sfx("win");confetti();return}ob.step++;render();scrollTo(0,0)}

/* ---------- sheet + render ---------- */
const sheet=document.getElementById("sheet");
function openSheet(o){navPush();ui.sheet=o;if(!sheet.open)sheet.showModal();renderSheet(true);updBack()}
function renderSheet(top){if(!ui.sheet)return;{const ex=document.getElementById("sheetExtra");if(ex&&!ex.querySelector(".readbtn"))ex.innerHTML=`<button class="readbtn" data-act="readnow" aria-label="Read this page aloud">🔊</button>`}const b=document.getElementById("sheetBody"),y=sheet.scrollTop;_sess=null;
  const m=ui.sheet.mode;sheet.className="sheet"+(m==="player"?" colored "+SC(ui.sheet.s):m==="chapter"||m==="ws"?" "+SC(unitBy(ui.sheet.k)?.subj||""):"");
  const V={more:moreView,pl:plView,jr:jrView,learn:learnView,player:playerView,chapter:chapterView,ws:wsView,todo:todoView,folder:folderView,plus:plusView,qzs:qzsView,quizz:quizzView,rfset:rfsetView,wfguide:wfGuideView,rem:remView,iopts:ioptsView,evpre:evpreView,evdone:evdoneView,exam:examView,told:toldView,uploads:uploadsView,track:trackView,school:schoolView,hist:historyView,refresh:refreshView,prep:prepView,games:gamesView,settings:settingsView,night:nightView,parent:parentView,swap:swapView,jsub:jsubView};
  const h=(V[m]||settingsView)();
  updBack();
  const kept=top?null:keepInputs(b);b.replaceChildren(el(h));if(kept)restoreInputs(b,kept);sheet.scrollTop=top?0:y;requestAnimationFrame(initPads);if(m==="player")paintTimer()}
document.getElementById("sheetClose").onclick=()=>{sfx("tap");goBack()};
sheet.addEventListener("close",()=>{if(sheet.open)return;ui.phelp=null;sheet.className="sheet";ui.sheet=null;clearInterval(tick);render();updBack()});
const NAV=[["today","Today"],["week","Plan"],["journey","Progress"],["library","Library"]];
function render(){if(tab==="today"&&ui.lastTab&&ui.lastTab!=="today")ui.tday=null;ui.lastTab=tab;fixWork();fixRoutines();dedupeEv();rollDay();_sess=null;const m=document.getElementById("main"),nav=document.getElementById("nav");
  if(!ACC){nav.hidden=true;document.getElementById("me").hidden=true;document.getElementById("snd").hidden=true;document.getElementById("hello").innerHTML=`${youBlob("bl bob")}<div><b>Welcome</b><span>DeepKids home planner</span></div>`;m.replaceChildren(el(`<div class="wrap">${loginView()}</div>`));if(sheet.open)sheet.close();return}
  document.getElementById("snd").hidden=false;
  if(!S.setup&&!ob)return startOnboarding(0);
  nav.hidden=!!ob;document.getElementById("me").hidden=!!ob;document.getElementById("snd").innerHTML=icon(soundOn?"sound":"mute");document.getElementById("snd").setAttribute("aria-label",soundOn?"Turn sound off":"Turn sound on");
  document.getElementById("me").innerHTML=icon("grid");
  document.getElementById("hello").innerHTML=`${youBlob("bl bob")}<div style="min-width:0"><b>${ob?"Hello!":pname()?"Hi, "+esc(pname()):"Hi there!"}</b><span>${ob?"Let's set up your year":(S.child?esc(S.child)+"'s learning · ":"")+(S.board==="none"?"DeepKids Plus":S.board==="combined"?"Combined boards":BOARDS[S.board])}</span></div>`;
  nav.innerHTML=NAV.map(([k,n])=>`<button data-tab="${k}" ${tab===k?'aria-current="page"':""}>${icon(k)}<span>${n}</span></button>`).join("");
  const sx=[...m.querySelectorAll(".hs")].map(x=>x.scrollLeft);
  const banner=!ob&&nightDue()?`<button class="nightbar" data-act="night">${blob("var(--peri)",17,"sleepy","",'width="34" height="34"')}<span><b>Tomorrow isn't ready yet</b><br><span class="xs">${nightItems().filter(p=>!S.prep[p.id]).length} things to get ready · tap to finish</span></span>${icon("next")}</button>`:"";
  const vk=ob?"ob"+ob.step:tab,kept=ui.lastView===vk?keepInputs(m):null;ui.lastView=vk;m.replaceChildren(el(`<div class="wrap">${banner}${ob?viewOnboarding():{today:viewToday,week:viewPlanner,tasks:viewTasks,library:viewLibrary,journey:viewJourneyTabs}[tab]()}</div>`));
  if(kept)restoreInputs(m,kept);m.querySelectorAll(".hs").forEach((x,i)=>{if(sx[i])x.scrollLeft=sx[i]});
  if(ui.sheet&&sheet.open)renderSheet()}
/* ---------- events ---------- */
document.getElementById("nav").addEventListener("click",e=>{const b=e.target.closest("button[data-tab]");if(!b)return;if(tab!==b.dataset.tab)navPush();tab=b.dataset.tab;sfx("tap");render();scrollTo(0,0)});
document.getElementById("snd").onclick=()=>{soundOn=!soundOn;try{localStorage.setItem("dk-sound",soundOn?"on":"off")}catch(e){}sfx("tick");render()};
document.getElementById("me").onclick=()=>{sfx("tap");openSheet({mode:"settings"})};
function playItem(it){setTimeout(autoRead,100);openSheet({mode:"player",s:it.s,k:it.u.k,n:it.n,tot:it.tot,bonus:it.bonus,i:Math.max(0,stepState(it).findIndex(x=>!x.ok))});if(ui.sheet.i<0)ui.sheet.i=0}
function onAct(e){
  if(ob){const d=ob.d,t=e.target.closest("[data-ob],button[data-age],button[data-cls],button[data-b],button.choice[data-s],button[data-mode]");if(!t)return;sfx("tap");
    if(t.dataset.ob==="next")return obNext();if(t.dataset.ob==="back"){ob.step--;return render()}
    if(t.dataset.age){d.child=document.getElementById("obName").value;d.age=+t.dataset.age}
    if(t.dataset.cls){d.child=document.getElementById("obName").value;d.cls=+t.dataset.cls}
    if(t.dataset.b){const was=d.board;d.board=t.dataset.b;if(d.board==="none")d.plus=true;if(d.board==="waldorf"){d.mode="books";d.subjects=["wml","hin","wart"];d.days={...DEF_DAYS,...(d.days||{}),hin:[1,2,3,4,5]}}else if(was==="waldorf"){d.subjects=["math","eng","hin","sci","dks"];d.mode="booksplus"}else d.subjects=d.subjects.filter(s=>!WFS.includes(s))}
    if(t.dataset.mode)d.mode=t.dataset.mode;
    if(t.dataset.s){const s=t.dataset.s;d.subjects=d.subjects.includes(s)?d.subjects.filter(x=>x!==s):[...d.subjects,s].sort((a,b)=>SUBJ_KEYS.indexOf(a)-SUBJ_KEYS.indexOf(b))}
    return render()}
  const b=e.target.closest("[data-act]");if(!b)return;const a=b.dataset.act,k=b.dataset.k;
  switch(a){
   case "topen":{const id=b.dataset.id,items=dayPlan(b.closest("[data-date]")?.dataset.date||today),cur=ui.open[id]??(focusOf(dayPlan(today),today)?.id===id);ui.open[id]=!cur;sfx(cur?"tap":"flip");render();break}
   case "play":{const it=findItem(b.dataset.id);if(it){sfx("flip");playItem(it)}break}
   case "pstep":{ui.sheet.i=Math.max(0,ui.sheet.i+(+b.dataset.d));sfx("tap");renderSheet(true);autoRead();break}
   case "readnow":{readNow();break}
   case "autoread":{S.autoRead=!S.autoRead;save();toast(S.autoRead?"Each step will be read aloud as you go.":"Steps won't be read automatically.");renderSheet();break}
   case "pdone":{const P=ui.sheet,it={u:unitBy(P.k),n:P.n,tot:P.tot,bonus:P.bonus},x=stepState(it)[P.i],key=stepKey(it),set=new Set(S.steps[key]||[]);if(x){const sec=Math.round(stepSecs());if(sec>=3){S.pace=(S.pace||[]).concat([{k:P.k,sec:x.sec||"book",kind:x.kind,est:Math.round(x.mins*60),took:Math.round(sec/60*10)/10,date:today}]).slice(-3000);addMins(P.k,sec)}stepT=null}if(x&&!x.ok){set.add(sid(x));S.steps[key]=[...set];sfx("tick")}else sfx("tap");P.i++;S.updatedAt=Date.now();save();renderSheet(true);autoRead();break}
   case "timer":{sfx("tap");timerToggle();break}
   case "finish":{const P=ui.sheet,u=unitBy(P.k);if(!u)return;const it={u,n:P.n,tot:P.tot,bonus:P.bonus},open=stepState(it).filter(x=>!x.ok);
     S.carry=S.carry||{};S.carry[u.k]=open.length&&P.n<P.tot?open.map(x=>({kind:x.kind,label:x.label,title:x.title.replace(/^From last time: /,""),mins:x.mins,name:x.name,forN:P.n+1})):[];
     logSession(u,P.bonus?"more":"plan");ui.more[P.s]=false;sheet.close();sfx("win");confetti();toast(open.length&&P.n<P.tot?`Done. ${open.length} open step${open.length>1?"s":""} moved to next time`:P.bonus?"Extra lesson done":"Lesson done. Well done!");commit();scrollTo({top:0,behavior:"smooth"});break}
   case "more":{const s=b.dataset.s;ui.more[s]=true;sfx("tick");_sess=null;const it=dayPlan(today).find(i=>i.kind==="lesson"&&i.s===s&&!i.done);render();if(it)playItem(it);break}
   case "less":{ui.more[b.dataset.s]=false;sfx("flip");render();break}
   case "skip":{S.skips[today+"|"+b.dataset.s]=true;sfx("flip");toast("Moved to the next lesson day");commit();break}
   case "swap":{sfx("flip");openSheet({mode:"swap",s:b.dataset.s});break}
   case "pin":{const s=b.dataset.s;S.next={...(S.next||{}),[s]:[k,...((S.next||{})[s]||[]).filter(x=>x!==k)]};sfx("ok");toast("That's up next");sheet.close();commit();break}
   case "tday":{navPush();const d=b.dataset.d;ui.tday=d==="0"?null:addDays(ui.tday||today,+d);if(ui.tday===today)ui.tday=null;sfx("tap");render();scrollTo(0,0);break}
   case "quickday":{navPush();ui.pday=b.dataset.d;ui.pv="day";tab="week";render();scrollTo(0,0);break}
   case "login":{const ph=(document.getElementById("lgPhone").value||"").replace(/\D/g,"").replace(/^(91|0)(?=\d{10}$)/,""),nm=(document.getElementById("lgName").value||"").trim();if(ph.length!==10){ui.lgErr="Enter a 10-digit phone number.";sfx("no");render();return}ui.lgErr="";ui.lgBusy=true;render();openAccount("91"+ph,nm).then(()=>{ui.lgBusy=false;tab="today";ui.tday=null;sfx("win");toast(S.setup?"Welcome back"+(pname()?", "+pname():"")+"!":"Logged in. Let's set up your year.");render()});break}
   case "loginas":{ui.lgBusy=true;openAccount(b.dataset.a).then(()=>{ui.lgBusy=false;tab="today";ui.tday=null;sfx("win");toast("Welcome back"+(pname()?", "+pname():"")+"!");render()});break}
   case "logout":{sheet.close();logout().then(()=>{ui.saved=null;toast("Logged out")});break}
   case "checksaved":{if(!store){ui.saved={err:"This view isn't connected to your account, so data is only on this device."};renderSheet();break}ui.savedBusy=true;renderSheet();store.get().then(sn=>{ui.saved=sn.exists?{v:sn.data(),at:Date.now()}:{err:"Nothing saved yet for this number."}}).catch(()=>{ui.saved={err:"Couldn't read the database just now. Try again."}}).finally(()=>{ui.savedBusy=false;renderSheet()});break}
   case "nowmore":{const k2="now|"+b.dataset.id;ui.open[k2]=!ui.open[k2];sfx("tap");render();break}
   case "showdone":{ui.showDone=!ui.showDone;sfx("tap");render();break}
   case "moresheet":{sfx("flip");openSheet({mode:"more"});break}
   case "plsheet":{sfx("flip");openSheet({mode:"pl",p:b.dataset.p});break}
   case "jrsheet":{sfx("flip");openSheet({mode:"jr",p:b.dataset.p});break}
   case "daytype":{S.dayType={...(S.dayType||{}),[today]:b.dataset.t};sfx("tick");toast(b.dataset.t==="busy"?"Busy day: shorter lessons":"Full day");commit();break}
   case "learn":{sfx("flip");openSheet({mode:"learn"});break}
   case "ptype":{ui.ptype=b.dataset.t;sfx("tap");renderSheet();break}
   case "ppick":{S.planPick={...(S.planPick||{}),[k]:{...((S.planPick||{})[k]||{}),[b.dataset.t]:b.dataset.o}};sfx("ok");toast("Plan chosen");commit();break}
   case "tfind":{ui.tq=document.getElementById("tq")?.value||"";ui.terr="";sfx("tap");render();break}
   case "tsearch":{ui.tq=b.dataset.q;ui.lt="topics";tab="library";if(sheet.open)sheet.close();render();scrollTo(0,0);break}
   case "tgen":{sfx("tap");genTopic();break}
   case "qsub":{ui.qs=b.dataset.s;sfx("tap");render();break}
   case "shuffle":{const s=b.dataset.s;S.shuffle={...(S.shuffle||{}),[s]:!(S.shuffle||{})[s]};S.seed={...(S.seed||{}),[s]:Math.floor(Math.random()*9999)};sfx("flip");commit();break}
   case "reshuffle":{const s=b.dataset.s;S.seed={...(S.seed||{}),[s]:Math.floor(Math.random()*9999)};sfx("flip");commit();break}
   case "exam":{S.exam=!S.exam;sfx("tick");toast(S.exam?"Exam track on: syllabus first":"Exam track off");commit();break}
   case "qnext":{const s=b.dataset.s;S.next={...(S.next||{}),[s]:[k,...((S.next||{})[s]||[]).filter(x=>x!==k)]};S.later={...(S.later||{}),[s]:((S.later||{})[s]||[]).filter(x=>x!==k)};sfx("ok");commit();toast(nextMsg(s,k),5000);if(sheet.open)renderSheet();break}
   case "qlater":{const s=b.dataset.s;S.later={...(S.later||{}),[s]:[...((S.later||{})[s]||[]).filter(x=>x!==k),k]};S.next={...(S.next||{}),[s]:((S.next||{})[s]||[]).filter(x=>x!==k)};sfx("flip");toast("Moved to later");commit();break}
   case "qrem":{const s=b.dataset.s;S.extra={...(S.extra||{}),[s]:((S.extra||{})[s]||[]).filter(x=>x!==k)};S.next={...(S.next||{}),[s]:((S.next||{})[s]||[]).filter(x=>x!==k)};sfx("flip");commit();break}
   case "qadd":{ui.flash=k;setTimeout(()=>{ui.flash=null},2500);setTimeout(()=>document.querySelector(".flash")?.scrollIntoView({block:"center",behavior:"smooth"}),120);const s=b.dataset.s;S.extra={...(S.extra||{}),[s]:[...new Set([...((S.extra||{})[s]||[]),k])]};sfx("ok");commit();toast(`Added to the ${SUBJ[s]} queue as no. ${qPos(unitBy(k))||"–"}. Find it in Plan → Lesson plan.`,5000);if(sheet.open)renderSheet();break}
   case "lt2":{ui.lt="topics";tab="library";render();scrollTo(0,0);break}
   case "quickplan":{tab="week";render();scrollTo(0,0);break}
   case "free":{openPicker();break}
   case "chapter":{sfx("flip");if(b.dataset.t)ui.ctab[k]=b.dataset.t;openSheet({mode:"chapter",k});break}
   case "ctab":{navPush();ui.ctab[k]=b.dataset.t;sfx("tap");renderSheet(true);break}
   case "qi":{ui.qi[k]=Math.max(0,(ui.qi[k]||0)+(+b.dataset.d));sfx("flip");renderSheet(true);break}
   case "ws":{sfx("flip");openSheet({mode:"ws",k,w:b.dataset.w});break}
   case "wsec":{ui.wsec[k]=Math.max(0,(ui.wsec[k]||0)+(+b.dataset.d));sfx("flip");renderSheet(true);break}
   case "wsdone":{S.tasks[k]=S.tasks[k]||{};S.tasks[k].ws=S.tasks[k].ws||today;sfx("win");confetti();toast("Worksheet finished! Taking you back…",1400);commit();setTimeout(()=>{if(ui.sheet?.mode==="ws")goBack()},1400);break}
   case "games":{sfx("flip");openSheet({mode:"games"});break}
   case "night":{sfx("flip");openSheet({mode:"night"});break}
   case "nightdone":{S.night={...(S.night||{}),[today]:1};sfx("win");toast("All set. Sleep well!");sheet.close();commit();break}
   case "parent":{sfx("flip");openSheet({mode:"parent"});break}
   case "phelp":{ui.phelp=ui.phelp||new Set((S.parent||{}).help||[]);ui.phelp.has(b.dataset.s)?ui.phelp.delete(b.dataset.s):ui.phelp.add(b.dataset.s);b.setAttribute("aria-pressed",ui.phelp.has(b.dataset.s));sfx("tap");break}
   case "psave":{const g=id=>document.getElementById(id).value;S.parent={...(S.parent||{}),name:g("pName").trim(),langs:g("pLang").trim(),help:[...(ui.phelp||new Set((S.parent||{}).help||[]))],saved:Date.now()};ui.phelp=null;S.alarm={on:document.getElementById("pAlarm").checked,time:g("pWake")||"06:30"};S.day={...D(),prepAt:g("pPrep")||D().prepAt,start:g("pStart")||D().start,eveAt:g("pEve")||D().eveAt};sfx("win");S.updatedAt=Date.now();sheet.close();render();saveNow().then(ok=>toast(ok?(S.parent.name?"Saved. Hi, "+S.parent.name+"!":"Saved to your account"):store?"Couldn't reach your account. Saved on this phone; it will retry.":"Saved"));break}
   case "quick":{sfx("flip");ui.qaOpen=!ui.qaOpen;render();if(ui.qaOpen)setTimeout(()=>document.getElementById("qa-t")?.focus(),80);break}
   case "qwho":{ui.qwho=b.dataset.w;b.parentElement.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));sfx("tap");break}
   case "qaddq":{const root=b.closest(".col")||b.closest("#sheetBody")||document.getElementById("main"),g=s=>root.querySelector(s)?.value||"",t=g("#qa-t").trim(),s=g("#qa-s"),e=g("#qa-e"),d=g("#qa-d")||today,w=ui.qwho||"you",kd=ui.qkind||"other",r=kd==="todo"?"once":(ui.qrep||"once"),days=r==="pick"?(ui.qdays||[]):QREP[r][1]||[];
     if(!t){sfx("no");toast("Type what the plan is");return}if(r!=="once"&&!s){sfx("no");toast("Add a start time for something that repeats");return}if(r==="pick"&&!days.length){sfx("no");toast("Pick at least one day");return}const id=Math.random().toString(36).slice(2,9);
     if(s&&kd!=="todo"){const end=e&&hm(e)>hm(s)?e:clock24(hm(s)+60);S.events=[...(S.events||[]),r==="once"?{id,title:t,kind:kd,who:w,start:s,end,rep:"once",date:d,days:[],from:today,note:""}:{id,title:t,kind:kd,who:w,start:s,end,rep:"weekly",days:[...days].sort(),from:d,note:""}];
       toast(r==="once"?"Added for "+fmt(d):`Added: ${days.length===7?"every day":days.map(x=>DAYN[x]).join(", ")}, ${clock(hm(s))}`)}else{S.todos=[...(S.todos||[]),{id,title:t,who:w,date:d,note:"",done:false}];toast("To-do added for "+fmt(d))}
     sfx("ok");ui.qdays=[];ui.qdraft=null;commit();["qa-t","qa-s","qa-e"].forEach(clearIn);break}
   case "qkind":{const _r=b.closest(".col");if(_r)ui.qdraft={t:_r.querySelector("#qa-t")?.value,s:_r.querySelector("#qa-s")?.value,e:_r.querySelector("#qa-e")?.value,d:_r.querySelector("#qa-d")?.value};ui.qkind=b.dataset.k;sfx("tap");render();if(sheet.open)renderSheet();break}
   case "qrep":{const _r=b.closest(".col");if(_r)ui.qdraft={t:_r.querySelector("#qa-t")?.value,s:_r.querySelector("#qa-s")?.value,e:_r.querySelector("#qa-e")?.value,d:_r.querySelector("#qa-d")?.value};ui.qrep=b.dataset.r;sfx("tap");render();if(sheet.open)renderSheet();break}
   case "qday":{const _r=b.closest(".col");if(_r)ui.qdraft={t:_r.querySelector("#qa-t")?.value,s:_r.querySelector("#qa-s")?.value,e:_r.querySelector("#qa-e")?.value,d:_r.querySelector("#qa-d")?.value};const d=+b.dataset.d,a=ui.qdays||[];ui.qdays=a.includes(d)?a.filter(x=>x!==d):[...a,d];sfx("tap");render();if(sheet.open)renderSheet();break}
   case "todomove":{const x=(S.todos||[]).find(z=>z.id===b.dataset.t);if(x){x.date=tomorrow();sfx("flip");toast("Moved to tomorrow");commit()}break}
   case "tododel":{S.todos=(S.todos||[]).filter(z=>z.id!==b.dataset.t);sfx("flip");commit();break}
   case "goto":{const t=document.getElementById(b.dataset.to);if(t)t.scrollIntoView({behavior:"smooth",block:"start"});break}
   case "task":{const id=b.dataset.id;S.tasks[k]=S.tasks[k]||{};if(S.tasks[k][id]){delete S.tasks[k][id];sfx("flip")}else{S.tasks[k][id]=today;sfx("ok")}commit();break}
   case "startexp":{addExp(b.dataset.title,b.dataset.topic);sfx("ok");toast("Started. Tick it once a day under Daily check-ins.");commit();break}
   case "status":{const p=S.progress[k]||{sessions:0};p.status=b.dataset.s;p.updated=today;S.progress[k]=p;sfx(b.dataset.s==="mastered"?"win":"tick");commit();break}
   case "logk":{const u=unitBy(k);if(u){logSession(u,"free");sfx("ok");toast("Logged for today");commit()}break}
   case "tlcheck":{const date=b.dataset.date,it=dayPlan(date).find(i=>i.id===b.dataset.id);if(!it)return;if(it.kind==="event"&&evGate(it,date))return;if(["lesson","warm","refresh"].includes(it.kind)&&!it.done){openSheet({mode:"iopts",date,id:it.id});return}
     if(it.kind==="prep"){const all=it.prep.every(p=>S.prep[p.id]);it.prep.forEach(p=>{if(all)delete S.prep[p.id];else S.prep[p.id]=today});sfx(all?"flip":"ok")}
     else if(it.kind==="exps"){S.exps.filter(x=>!x.closed&&x.start<=date).forEach(x=>{if(!x.checks.includes(today))x.checks.push(today)});sfx("ok")}
     else if(it.kind==="lesson"){if(it.done){toast("Already done today");return}if(date!==today){openSheet({mode:"chapter",k:it.u.k});return}return playItem(it)}
     else if(it.kind==="todo"){const x=it.td;if(x.done&&x.doneOn===date){x.done=false;delete x.doneOn;sfx("flip")}else{x.done=true;x.doneOn=date;sfx("ok")}}
     else{const key=date+"|"+it.id;if(S.tl[key])delete S.tl[key];else{S.tl[key]=Date.now();sfx("ok")}}
     commit();break}
   case "tlopen":{const date=b.dataset.date,it=dayPlan(date).find(i=>i.id===b.dataset.id);if(!it)return;sfx("tap");
     if(it.kind==="prep")return openSheet({mode:"prep",date,when:it.id});
     if(it.kind==="lesson")return it.done?openSheet({mode:"chapter",k:it.u.k}):playItem(it);
     if(it.kind==="warm")return openSheet({mode:"games"});break}
   case "prep":{const id=b.dataset.id;if(S.prep[id])delete S.prep[id];else{S.prep[id]=today;sfx("tick")}commit();break}
   case "addev":{openEv();break}
   case "delev":{S.events=(S.events||[]).filter(x=>x.id!==b.dataset.e);sfx("flip");commit();break}
   case "pv":{ui.pv=b.dataset.v;sfx("tap");render();break}
   case "pday":{ui.pday=b.dataset.d;ui.pv="day";sfx("tap");render();break}
   case "pdd":{ui.pday=addDays(ui.pday||today,+b.dataset.d);sfx("tap");render();break}
   case "pmon":{ui.pm=(ui.pm||0)+(+b.dataset.d);sfx("tap");render();break}
   case "wk2":{ui.week=(ui.week||0)+(+b.dataset.d);sfx("tap");render();break}
   case "dump":{sfx("tap");runDump();break}
   case "dkeep":{const it=ui.dump.items[+b.dataset.i];it.keep=!it.keep;sfx("tap");render();break}
   case "dwho":{const it=ui.dump.items[+b.dataset.i];if(it.type!=="have"){it.who={you:"kid",kid:"both",both:"you"}[it.who]||"you";sfx("tap");render()}break}
   case "dadd":{addParsed();break}
   case "dclear":{ui.dump={};render();break}
   case "askq":{const v=b.dataset.a;if(v==="parent")return openSheet({mode:"parent"});if(sheet.open)sheet.close();const ta=document.getElementById("dumpText");if(ta){ta.value=(ta.value?ta.value+"\n":"")+v.slice(4);ta.focus();ta.scrollIntoView({behavior:"smooth",block:"center"})}break}
   case "jsub":{sfx("flip");openSheet({mode:"jsub",s:b.dataset.s});break}
   case "jopen":{ui.jopen=ui.jopen===k?null:k;sfx("tap");renderSheet();break}
   case "rt":{ui.rt=b.dataset.t;ui.rmore=40;sfx("tap");render();break}
   case "rfit":{ui.rfit=ui.rfit===false;sfx("tap");render();break}
   case "rmore":{ui.rmore=(ui.rmore||40)+40;render();break}
   case "rtc":{ui.rtc=b.dataset.t;sfx("tap");renderSheet();break}
   case "bb":{navPush();ui.bb=b.dataset.b;ui.bs=null;ui.bl=null;sfx("tap");render();break}
   case "bs":{ui.bs=b.dataset.s;ui.bl=null;sfx("tap");render();break}
   case "bl":{ui.bl=+b.dataset.l;sfx("tap");render();break}
   case "isort":{sfx("tap");runInvSort();break}
   case "ikeep":{const it=ui.idump.items[+b.dataset.i];it.keep=!it.keep;sfx("tap");render();break}
   case "iclear":{ui.idump={};clearIn("invText");render();break}
   case "iadd":{const L=(ui.idump?.items||[]).filter(x=>x.keep);S.inv=[...(S.inv||[]),...L.map(({keep,...x})=>({id:Math.random().toString(36).slice(2,9),...x,from:"sorted"}))];ui.idump={};clearIn("invText");sfx("win");toast(`Added ${L.length} to what you have`);commit();break}
   case "hubres":{ui.hubres=true;renderSheet();break}
   case "jall":{ui.jall=true;render();break}
   case "refresh":{sfx("flip");openSheet({mode:"refresh",date:b.dataset.date||today});break}
   case "pjump":{ui.sheet.i=Math.max(0,+b.dataset.i);sfx("tap");renderSheet(true);autoRead();break}
   case "hist":{sfx("flip");openSheet({mode:"hist"});break}
   case "wkst":{const id=b.dataset.id,to=b.dataset.to,key=k+"|"+id,W=WK(),w=W[key]||{};w.title=b.dataset.t||w.title;const untask=()=>{if(S.tasks[k])delete S.tasks[k][id]};
     if(to==="none"||(to==="undo"&&!w.started)){const q=w.q;delete W[key];if(q)W[key]={q:true,planned:w.planned,title:w.title};untask();sfx("flip")}
     else if(to==="undo"){w.st="started";delete w.done;delete w.doneAt;untask();W[key]=w;sfx("flip")}
     else{w.st=to;w[to]=w[to]||today;w[to+"At"]=w[to+"At"]||Date.now();if(to==="done"){w.started=w.started||today;S.tasks[k]=S.tasks[k]||{};S.tasks[k][id]=w.done;sfx("win");toast("Finished · saved to your Work folder")}else{untask();sfx("ok");toast(to==="planned"?"Added to your pipeline · see To finish":to==="skip"?"Okay, not doing this one":"Marked started · finish it any time")}W[key]=w}
     commit();break}
   case "qz":{S.quiz=S.quiz||{};const q=S.quiz[k+"|"+b.dataset.n]=S.quiz[k+"|"+b.dataset.n]||{};q[b.dataset.i]={q:b.dataset.q,a:b.dataset.a,r:+b.dataset.r,d:today};sfx(+b.dataset.r?"ok":"tap");commit();break}
   case "folder":{sfx("flip");openSheet({mode:"folder"});break}
   case "fsave":{folderSave();break}
   case "fprint":{folderPrint();break}
   case "qsend":{qSend();break}
   case "gcsync":{gcSync(true);break}
   case "gcoff":{S.cal={on:false};sfx("flip");toast("Calendar unlinked");commit();break}
   case "gccal":{const c=S.cal||{},id=b.dataset.id,set=new Set(c.cals||[]);set.has(id)?set.delete(id):set.add(id);S.cal={...c,cals:[...set]};gcSync(true);break}
   case "uploads":{sfx("flip");openSheet({mode:"uploads"});break}
   case "track":{sfx("flip");openSheet({mode:"track"});break}
   case "school":{sfx("flip");openSheet({mode:"school"});break}
   case "tmore":{ui.tlim=(ui.tlim||21)+30;render();break}
   case "tsave":{saveDoc(transcriptDoc(),`${(S.child||"Student").replace(/[^\w ]/g,"")} transcript ${today}.html`);break}
   case "tprint":{printDoc(transcriptDoc());break}
   case "told":{sfx("flip");ui.ted="";if(tab==="week"&&seg("week")==="tell"&&!sheet.open){render();document.querySelector('#main [data-act="ted"]')?.closest("section")?.scrollIntoView({behavior:"smooth",block:"start"});break}openSheet({mode:"told"});render();break}
   case "ted":{ui.ted=b.dataset.id;if(!b.dataset.id){sfx("ok");commit()}else render();break}
   case "evday":{const e=(S.events||[]).find(x=>x.id===b.dataset.id);if(e){const d=+b.dataset.d,set=new Set(e.rep==="weekly"?e.days:[]);set.has(d)?set.delete(d):set.add(d);if(set.size){e.days=[...set];e.rep="weekly";e.date=null}else{e.rep="once";e.days=[];e.date=e.date||today}sfx("tap");commit()}break}
   case "evwho":{const e=(S.events||[]).find(x=>x.id===b.dataset.id);if(e){e.who=b.dataset.w;sfx("tap");commit()}break}
   case "evdel":{S.events=(S.events||[]).filter(x=>x.id!==b.dataset.id);ui.ted="";sfx("flip");toast("Removed");commit();break}
   case "tddel":{S.todos=(S.todos||[]).filter(x=>x.id!==b.dataset.id);sfx("flip");commit();break}
   case "notedel":{S.notes=(S.notes||[]).filter(x=>x.id!==b.dataset.id);sfx("flip");commit();break}
   case "tsub":{const T=tSetup(),s=b.dataset.s,o=new Set(T.off||[]);o.has(s)?o.delete(s):o.add(s);T.off=[...o];sfx("tap");commit();break}
   case "tmake":{const t=curTest();if(t&&Object.keys(t.ans).length&&!tDone(t)&&!confirm("Start a new paper? The unfinished test will be kept but not continued."))break;ui.zs=null;makeTest();break}
   case "tstart":{ui.ex=null;sfx("flip");openSheet({mode:"exam"});break}
   case "tgo":{const t=curTest(),X=t.subjects[ui.ex.si];t.start=t.start||{};t.start[X.s]=t.start[X.s]||Date.now();ui.ex.qi=0;sfx("tap");commit();break}
   case "tans":{const t=curTest(),X=t.subjects[ui.ex.si];if(t.done?.[X.s])break;t.ans[X.s+"|"+ui.ex.qi]=+b.dataset.i;sfx("tap");commit();break}
   case "tmove":{const t=curTest(),n=t.subjects[ui.ex.si].qs.length;ui.ex.qi=Math.max(0,Math.min(n-1,ui.ex.qi+ +b.dataset.d));sfx("flip");render();document.getElementById("sheetBody")?.scrollTo?.(0,0);break}
   case "tjump":{ui.ex.qi=+b.dataset.i;sfx("tap");render();break}
   case "tfin":{const t=curTest(),X=t.subjects[ui.ex.si];t.done=t.done||{};t.done[X.s]=Date.now();ui.ex={si:t.subjects.findIndex(x=>!t.done[x.s]),qi:-1};ui.zs=null;sfx("win");if(ui.ex.si<0)confetti();commit();break}
   case "texit":{goBack();break}
   case "tdl":{tdlDoc(b.dataset.d);break}
   case "zall":{const Z=zipSel(),g=b.dataset.g;if(b.dataset.v==="1"){if(g==="ws")folderData().forEach(c=>c.ws.forEach(w=>Z.ws.add(w.k)));else (S.work||[]).forEach(w=>Z.up.add(w.id))}else Z[g].clear();ui.zip=null;render();break}
   case "zmake":{zipBuild();break}
   case "zsave":{zipSave();break}
   case "zshare":{zipShare();break}
   case "evcancel":{const k=b.dataset.date+"|"+b.dataset.id;S.evoff={...(S.evoff||{}),[k]:Date.now()};sfx("flip");toast("Cancelled · undo it under the day's date");if(ui.sheet?.mode==="evpre")goBack();commit();break}
   case "evundo":{const o={...(S.evoff||{})};delete o[b.dataset.date+"|"+b.dataset.id];S.evoff=o;sfx("tap");commit();break}
   case "evf":{const F=ui.evf=ui.evf||{};["covered","hw","note"].forEach(k=>{const el=document.getElementById("evf-"+k);if(el)F[k]=el.value});F[b.dataset.k]=b.dataset.k==="went"?b.dataset.v==="1":b.dataset.v;sfx("tap");render();break}
   case "evsave":{evSave(!!b.dataset.quick);break}
   case "toplan":{const dl=document.getElementById("sheet");ui.sheet=null;if(dl?.open)dl.close();tab="week";ui.seg={...(ui.seg||{}),week:"tell"};render();scrollTo(0,0);setTimeout(()=>{const t=document.getElementById("dumpText");if(t){t.scrollIntoView({block:"center"});t.focus()}},200);break}
   case "iopts":{sfx("flip");openSheet({mode:"iopts",date:b.dataset.date,id:b.dataset.id});break}
   case "iofin":case "ioskip":case "iosnz":case "iodone":case "ioskipday":{const date=b.dataset.date,it=dayPlan(date).find(i=>i.id===b.dataset.id),act=b.dataset.act;if(!it)break;const key=date+"|"+it.id;
     if(act==="iofin"){logSession(it.u,"plan");sfx("win");toast(`Part ${it.n} marked done`)}
     else if(act==="ioskip"){logSession(it.u,"skipped");sfx("flip");toast(`Skipped Part ${it.n}`)}
     else if(act==="iosnz"){S.snz={...(S.snz||{}),[key]:nowMin()+60};sfx("flip");toast("Okay, later today")}
     else if(act==="iodone"){S.tl[key]=Date.now();sfx("ok")}
     else{S.tl[key]="skip";sfx("flip");toast("Skipped "+(date===today?"today":"that day"))}
     if(ui.sheet?.mode==="iopts")goBack();commit();break}
   case "evmiss":{const date=b.dataset.date,id=b.dataset.id;S.evlog={...(S.evlog||{}),[date+"|"+id]:{went:false,at:Date.now()}};S.tl[date+"|e-"+id]="missed";sfx("flip");toast("Noted: didn't happen");commit();break}
   case "rem":{sfx("flip");openSheet({mode:"rem"});break}
   case "remday":{const R=REM(),d=+b.dataset.d,set=new Set(R.days||[1,2,3,4,5]);set.has(d)?set.delete(d):set.add(d);if(set.size){R.days=[...set];sfx("tap");commit()}break}
   case "remics":{saveIcs();break}
   case "nudgeoff":{S.nudgeOff={...(S.nudgeOff||{}),[today]:Date.now()+2*36e5};sfx("flip");toast("Okay. We'll check again later.");commit();break}
   case "dex":{const t=document.getElementById("dumpText");if(t){t.value=b.dataset.t;t.dispatchEvent(new Event("input",{bubbles:true}));t.focus();t.select()}sfx("tap");break}
   case "dhand":{ui.dhand=!ui.dhand;sfx("tap");render();break}
   case "dnofiles":{if(ui.dump)ui.dump.files=[];sfx("flip");render();break}
   case "seg":{navPush();ui.seg={...(ui.seg||{}),[b.dataset.k]:b.dataset.v};sfx("tap");render();scrollTo(0,0);break}
   case "gotab":{navPush();if(b.dataset.qs){ui.qs=b.dataset.qs;ui.tq="les"}const dl=document.getElementById("sheet");if(dl?.open){ui.sheet=null;dl.close()}tab=b.dataset.tab;if(b.dataset.seg)ui.seg={...(ui.seg||{}),[tab]:b.dataset.seg};sfx("flip");render();scrollTo(0,0);break}
   case "sndtoggle":{document.getElementById("snd")?.click();setTimeout(()=>{if(ui.sheet)renderSheet()},50);break}
   case "dexport":{dataExport();break}
   case "plus":{sfx("flip");openSheet({mode:"plus",r:b.dataset.r||""});break}
   case "plusgo":{plusGo();break}
   case "todo":{navPush();const dl=document.getElementById("sheet");if(dl?.open){ui.sheet=null;dl.close()}tab="week";ui.seg={...(ui.seg||{}),week:"ongoing"};sfx("flip");render();scrollTo(0,0);break}
   case "qpick":{ui.qpick=b.dataset.r||null;sfx("tap");render();if(sheet.open)renderSheet();break}
   case "qput":{const ty=b.dataset.ty,r=b.dataset.r,n=qPut(ty,b.dataset.s,r,b.dataset.w);ui.qpick=null;ui.flash=r;setTimeout(()=>{ui.flash=null},2500);sfx("ok");toast(`${b.dataset.w==="first"?"Put first":"Added at the end"}: no. ${n} in the ${ty==="les"?SUBJ[b.dataset.s]:WT[ty][0].toLowerCase()} queue. See Plan → Queue.`,4500);render();if(sheet.open)renderSheet();break}
   case "qmv":{const ty=b.dataset.ty,s=b.dataset.s,L=qItems(ty,s).map(x=>x.ref),i=L.indexOf(b.dataset.r),j=i+ +b.dataset.d;if(i<0||j<0||j>=L.length)break;[L[i],L[j]]=[L[j],L[i]];ui.flash=b.dataset.r;setTimeout(()=>{ui.flash=null},1500);sfx("tap");setOrder(ty,s,L);break}
   case "qshuf":{const ty=b.dataset.ty,s=b.dataset.s;if(ty==="les"){S.next={...(S.next||{}),[s]:[]};S.shuffle={...(S.shuffle||{}),[s]:true};S.seed={...(S.seed||{}),[s]:Math.floor(Math.random()*9999)};sfx("flip");commit();toast("Shuffled. Each topic still comes after what it needs first.")}else{const L=qItems(ty,s).map(x=>x.ref);for(let i=L.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[L[i],L[j]]=[L[j],L[i]]}sfx("flip");setOrder(ty,s,L);toast("Shuffled")}break}
   case "qx":{const ty=b.dataset.ty,r=b.dataset.r,key=r.slice(r.indexOf(":")+1);if(ty!=="les"&&b.dataset.how!=="skip"){unQueue(ty,key);sfx("flip");commit();if(sheet.open)renderSheet();toast("Taken out of the queue");break}if(ty==="les"){const s=b.dataset.s;S.extra={...(S.extra||{}),[s]:((S.extra||{})[s]||[]).filter(x=>x!==key)};S.next={...(S.next||{}),[s]:((S.next||{})[s]||[]).filter(x=>x!==key)}}else{const W=WK();W[key]={...(W[key]||{}),st:"skip"};WQ()[ty]=(WQ()[ty]||[]).filter(x=>x!==r)}sfx("flip");commit();toast("Taken out. You can bring it back from its chapter.");break}
   case "qf":{ui.qf=b.dataset.s;sfx("tap");render();break}
   case "hty":{ui.hty=b.dataset.t;ui.hn=25;sfx("tap");render();break}
   case "hs":{ui.hs=b.dataset.s;ui.hn=25;sfx("tap");render();break}
   case "hmore":{ui.hn=(ui.hn||25)+25;render();break}
   case "morejg":{ui.jg=(ui.jg||0)+1;sfx("flip");renderSheet();break}
   case "tdtick":{const x=(S.todos||[]).find(z=>z.id===b.dataset.t);if(x){x.done=!x.done;x.doneOn=x.done?today:null;sfx(x.done?"tick":"flip");commit()}break}
   case "tdadd":{ui.tdAdd=!ui.tdAdd;break}
   case "subtog":{const s=b.dataset.s,on=S.subjects.includes(s);if(on&&S.subjects.length<2){sfx("no");toast("Keep at least one subject");break}S.subjects=on?S.subjects.filter(x=>x!==s):SUBJ_KEYS.filter(x=>x===s||S.subjects.includes(x));if(!on){S.levels={...S.levels,[s]:S.levels?.[s]||S.levels?.sci||1}}sfx(on?"flip":"ok");commit();toast(on?`${SUBJ[s]} left out. Its progress is kept.`:`${SUBJ[s]} added. It's in Today and the Queue now.`);break}
   case "pacego":{navPush();ui.seg={...(ui.seg||{}),week:"tell"};sfx("flip");render();setTimeout(()=>document.getElementById("paceSec")?.scrollIntoView({behavior:"smooth",block:"start"}),60);break}
   case "ist":{const key=k+"|"+b.dataset.id,W=WK(),w=W[key]||{},to=b.dataset.to;if(to==="none"){if(w.st!=="planned")delete w.st;W[key]=w}else if(to==="skip")W[key]={...w,st:"skip"};else if(to==="undo"){if(S.tasks[k+"#"+b.dataset.id])delete S.tasks[k+"#"+b.dataset.id].ws;delete w.st;W[key]=w}
     sfx("flip");commit();if(sheet.open)renderSheet();toast(to==="skip"?"Marked not doing":to==="undo"?"Back to not finished":"Done");break}
   case "quizgo":{sfx("flip");ui.qrun=null;ui.qzv=null;openSheet({mode:"quizz"});break}
   case "rfset":{sfx("flip");openSheet({mode:"rfset"});break}
   case "qzset":{const Z=ui.qz=ui.qz||{},v=b.dataset.v;Z[b.dataset.key]=/^\d+$/.test(v)?+v:v;sfx("tap");renderSheet();break}
   case "qzstart":{const Z=ui.qz,N=Z.by==="n"?Z.n:Z.m*2,P=quizPool(Z.s,Z.focus);if(!P.length)break;const head=Z.focus==="mix"?P.slice(0,Math.ceil(N/2)):[],rest=P.filter(q=>!head.includes(q));for(let i=rest.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[rest[i],rest[j]]=[rest[j],rest[i]]}
     const qs=[...head,...rest].slice(0,N);for(let i=qs.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[qs[i],qs[j]]=[qs[j],qs[i]]}ui.qrun={s:Z.s,by:Z.by,qs,i:0,res:[],end:Z.by==="m"?Date.now()+Z.m*60000:null};
     clearInterval(ui.qtick);if(ui.qrun.end)ui.qtick=setInterval(()=>{const R=ui.qrun;if(!R||ui.sheet?.mode!=="quizz"||R.saved){clearInterval(ui.qtick);return}const e=document.getElementById("qzleft"),l=Math.max(0,Math.round((R.end-Date.now())/1000));if(e)e.textContent=Math.floor(l/60)+":"+String(l%60).padStart(2,"0");if(!l)renderSheet()},1000);sfx("ok");renderSheet();break}
   case "qans":{const q=(window._qmap||{})[b.dataset.id];if(!q)break;const c=b.dataset.c!=null?+b.dataset.c:null,r=c!=null?c===q.ans:b.dataset.r==="1";qRecord(q,r);sfx(r?"ok":"flip");
     if(ui.sheet?.mode==="quizz"&&ui.qrun){const R=ui.qrun;if(R.cur?.id!==q.id){R.cur={id:q.id,r,c};R.res.push({q,r,c})}}else{const d=ui.sheet?.date||today;S.rfa={...(S.rfa||{}),[d]:{...((S.rfa||{})[d]||{}),[q.id]:{r,c}}}}commit();renderSheet();break}
   case "qznext":{const R=ui.qrun;if(R){R.i++;R.cur=null}sfx("tap");renderSheet();break}
   case "qzstop":{const R=ui.qrun;if(R){R.qs=R.qs.slice(0,R.res.length);R.i=R.qs.length}renderSheet();break}
   case "qzagain":{ui.qrun=null;renderSheet();break}
   case "qzend":{ui.qrun=null;goBack();break}
   case "qzpast":{ui.qzv=b.dataset.id;renderSheet();break}
   case "qzback":{ui.qzv=null;renderSheet();break}
   case "qgen":{qGen();break}
   case "rfmix":{const g=b.dataset.g,t=b.dataset.t,R=RFS(),v=Math.max(0,Math.min(100,R[g].mix[t]+ +b.dataset.d));S.rfs={...(S.rfs||{}),[g]:{...((S.rfs||{})[g]||{}),mix:{...R[g].mix,[t]:v}}};delete (S.rfp||{})[today];sfx("tap");commit();renderSheet();break}
   case "rfday":{const R=RFS(),d=+b.dataset.d,days=R.days.includes(d)?R.days.filter(x=>x!==d):[...R.days,d];S.rfs={...(S.rfs||{}),days};delete (S.rfp||{})[today];sfx("tap");commit();renderSheet();break}
   case "dts":{ui.dts=b.dataset.s;sfx("tap");render();break}
   case "dtreset":{const sc=ui.dts||"all";if(sc[0]==="w"){const w={...(S.dayW||{})};delete w[sc.slice(1)];S.dayW=w}else if(sc.startsWith("d:")){const o={...(S.dayOver||{})};delete o[sc.slice(2)];S.dayOver=o}sfx("flip");commit();break}
   case "wfguide":{sfx("flip");openSheet({mode:"wfguide"});break}
   case "tqt":{ui.tq=b.dataset.t;ui.qpick=null;sfx("tap");render();break}
   case "qzs":{sfx("flip");openSheet({mode:"qzs",k,n:+b.dataset.n});break}
   case "dkmin":{const i=Math.max(0,DKSTEPS.indexOf(dkMinsOf()));S.dkMins=DKSTEPS[Math.min(DKSTEPS.length-1,Math.max(0,i+ +b.dataset.d))];sfx("tap");commit();break}
   case "lt":{navPush();ui.lt=b.dataset.t;sfx("tap");render();break}
   case "invadd":{S.inv=[...(S.inv||[]),{id:Math.random().toString(36).slice(2,9),name:b.dataset.n,cat:b.dataset.c||"other",from:"tap"}];sfx("ok");toast("Added to what we have");commit();break}
   case "invnew":{const n=document.getElementById("invName").value.trim();if(!n)return;S.inv=[...(S.inv||[]),{id:Math.random().toString(36).slice(2,9),name:n,cat:document.getElementById("invCat").value}];sfx("ok");commit();clearIn("invName");break}
   case "invdel":{S.inv=(S.inv||[]).filter(i=>i.id!==b.dataset.i);sfx("flip");commit();break}
   case "lvl":{const s=b.dataset.s;S.levels[s]=Math.min(5,Math.max(1,S.levels[s]+(+b.dataset.d)));ui.view[s]=S.levels[s];sfx("tick");commit();break}
   case "day":{const s=b.dataset.s,d=+b.dataset.d,cur=new Set(daysOf(s));cur.has(d)?cur.delete(d):cur.add(d);if(cur.size){S.days={...S.days,[s]:[...cur].sort()};sfx("tap");commit()}break}
   case "lsub":{ui.lsub=b.dataset.s;sfx("tap");render();break}
   case "view":{ui.view[b.dataset.s]=+b.dataset.l;sfx("tap");render();break}
   case "setlvl":{S.levels[b.dataset.s]=+b.dataset.l;sfx("tick");commit();break}
   case "check":{const x=S.exps.find(x=>x.id===b.dataset.e);if(x&&!x.checks.includes(today)){x.checks.push(today);sfx("ok");commit()}break}
   case "close":{const x=S.exps.find(x=>x.id===b.dataset.e);if(x){x.closed=true;x.end=today;sfx("win");confetti();toast("Finished: "+x.title);commit()}break}
   case "addexp":{const v=document.getElementById("newExp").value.trim();if(v){addExp(v,"Our own experiment");sfx("ok");commit();clearIn("newExp")}break}
   case "joke":{ui.jokes[b.dataset.j]=!ui.jokes[b.dataset.j];sfx(ui.jokes[b.dataset.j]?"ok":"flip");sheet.open?renderSheet():render();break}
   case "gtab":{ui.game=b.dataset.g;sfx("tap");renderSheet();break}
   case "wk":{const u=dailyUnit();if(!u)return;const word=u.c.x.words[dayNo%u.c.x.words.length],g=G();g.cur=g.cur||"";const key=b.dataset.key;if(g.g.includes(word)||g.g.length>=6)return;
     if(key==="DEL"){g.cur=g.cur.slice(0,-1);sfx("key")}else if(key==="ENTER"){if(g.cur.length===5){g.g.push(g.cur);const w=g.cur===word;g.cur="";sfx(w?"win":g.g.length>=6?"no":"flip");if(w)confetti();S.updatedAt=Date.now();save()}else{sfx("no");toast("Five letters, please")}}else if(g.cur.length<5){g.cur+=key;sfx("key")}renderSheet();break}
   case "tf":{const u=dailyUnit(),q=u.c.x.quiz[+b.dataset.i];G().tf[b.dataset.i]=+b.dataset.v;sfx((+b.dataset.v===1)===q[1]?"ok":"no");if(Object.keys(G().tf).length===u.c.x.quiz.length)setTimeout(()=>sfx("win"),300);commit();break}
   case "odd":{const u=dailyUnit(),o=u.c.x.odd[dayNo%u.c.x.odd.length],g=G();if(!g.odd){g.odd=b.dataset.w;sfx(g.odd===o[1]?"win":"no");if(g.odd===o[1])confetti();commit()}break}
   case "mcq":{setA(k,b.dataset.id,+b.dataset.o);sfx(+b.dataset.o===+b.dataset.a?"ok":"no");commit();break}
   case "mcqreset":{delete S.ans[k][b.dataset.id];sfx("flip");commit();break}
   case "checkfill":{const ans=JSON.parse(b.dataset.a),v=A(k,b.dataset.id)||[],n=s=>String(s||"").trim().toLowerCase();const good=ans.every((x,i)=>{const w=n(v[i]);return w&&(n(x).includes(w)||w.includes(n(x).split(/[ (]/)[0]))});sfx(good?"ok":"no");toast(good?"Looks right":"Have another look");break}
   case "showfill":{sfx("flip");toast(b.dataset.a);break}
   case "drew":{if(A(k,b.dataset.id))delete S.ans[k][b.dataset.id];else{setA(k,b.dataset.id,today);sfx("ok")}commit();break}
   case "tok":{const key=k+b.dataset.id;ui.sel[key]=ui.sel[key]===b.dataset.x?undefined:b.dataset.x;sfx("tap");renderSheet();break}
   case "bucket":{const sel=ui.sel[k+b.dataset.id];if(sel===undefined)return;const v={...(A(k,b.dataset.id)||{})};v[sel]=+b.dataset.c;setA(k,b.dataset.id,v);ui.sel[k+b.dataset.id]=undefined;sfx("tick");commit();break}
   case "untok":{const v={...(A(k,b.dataset.id)||{})};delete v[b.dataset.x];setA(k,b.dataset.id,v);sfx("flip");commit();break}
   case "mleft":{ui.sel[k+b.dataset.id]=b.dataset.x;sfx("tap");renderSheet();break}
   case "mright":{const l=ui.sel[k+b.dataset.id];if(!l){sfx("no");toast("Tap a word on the left first");return}const v={...(A(k,b.dataset.id)||{})};Object.keys(v).forEach(x=>{if(v[x]===b.dataset.x)delete v[x]});v[l]=b.dataset.x;setA(k,b.dataset.id,v);ui.sel[k+b.dataset.id]=undefined;const [si,ii]=b.dataset.id.split("-").map(Number),it=unitBy(k).c.x.wsd[si][1][ii];sfx(it.pairs.some(p=>p[0]===l&&p[1]===b.dataset.x)?"ok":"tick");commit();break}
   case "mreset":{setA(k,b.dataset.id,{});sfx("flip");commit();break}
   case "clearpad":{const c=document.querySelector(`canvas[data-pad="${CSS.escape(b.dataset.pad)}"]`);if(c)c.getContext("2d").clearRect(0,0,c.width,c.height);sfx("flip");break}
   case "saveset":{S.child=document.getElementById("sName").value.trim();const v=document.getElementById("sStart").value;if(v)S.start=v;sfx("ok");S.updatedAt=Date.now();render();saveNow().then(ok=>toast(ok||!store?"Saved":"Couldn't reach your account. Saved on this phone; it will retry."));break}
   case "redo":{sheet.close();startOnboarding(1);break}
  }}
document.getElementById("main").addEventListener("click",onAct);
document.getElementById("sheetBody").addEventListener("click",onAct);
document.addEventListener("input",e=>{const t=e.target;if(!t.dataset.ans)return;const [k,id,sub]=t.dataset.ans.split("|");if(sub===undefined)setA(k,id,t.value);else if(sub.includes(".")){const v={...(A(k,id)||{})};v[sub]=t.value;setA(k,id,v)}else{const v=[...(A(k,id)||[])];v[+sub]=t.value;setA(k,id,v)}S.updatedAt=Date.now();save()});
document.addEventListener("change",e=>{const t=e.target;
  if(t.dataset.dt){const f=t.dataset.dt,v=t.type==="time"?t.value:+t.value,sc=ui.dts||"all";if(!v&&t.type==="time")return;if(sc==="all")S.day={...D(),[f]:v};else if(sc[0]==="w"){const w=sc.slice(1);S.dayW={...(S.dayW||{}),[w]:{...((S.dayW||{})[w]||{}),[f]:v}}}else{const d=sc.slice(2);S.dayOver={...(S.dayOver||{}),[d]:{...((S.dayOver||{})[d]||{}),[f]:v}}}sfx("tap");commit();return}
  if(t.id==="dtDate"&&t.value){ui.dts="d:"+t.value;sfx("tap");render();return}
  if(t.dataset.rfe){S.rfs={...(S.rfs||{}),[t.dataset.rfe]:{...((S.rfs||{})[t.dataset.rfe]||{}),every:+t.value}};delete (S.rfp||{})[today];sfx("tap");commit();renderSheet();return}
  if(t.id==="rfmins"){S.rfs={...(S.rfs||{}),mins:+t.value};delete (S.rfp||{})[today];sfx("tap");commit();renderSheet();return}
  if(t.dataset.dayset){S.day={...D(),[t.dataset.dayset]:t.type==="time"?t.value:+t.value};sfx("tap");commit();return}
  if(t.matches("select[data-hpd]")){const s=t.dataset.hpd,v=+t.value;sfx("tap");if(ob)ob.d.hpd={...(ob.d.hpd||DEF_HPD),[s]:v};else{S.hpd={...(S.hpd||DEF_HPD),[s]:v};commit()}return}
  if(ob&&t.matches("#obPlus")){ob.d.plus=t.checked;sfx("tap");return}if(ob&&t.matches("select[data-s]")){ob.d.levels[t.dataset.s]=+t.value;sfx("tap")}});
/* event dialog */
const evd=document.getElementById("evd");let evRep="once";
document.getElementById("eDays").innerHTML=[1,2,3,4,5,6,0].map(d=>`<button type="button" data-d="${d}" aria-pressed="false">${DAYN[d]}</button>`).join("");
function openEv(){evForm.reset();eDate.value=ui.wday||today;evRep="once";syncEv();eErr.hidden=true;eDays.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed","false"));sfx("tap");evd.showModal()}
function syncEv(){eRep.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.rep===evRep));eDateF.hidden=evRep!=="once";eDaysF.hidden=evRep==="once"}
eRep.addEventListener("click",e=>{const x=e.target.closest("button");if(!x)return;evRep=x.dataset.rep;syncEv();sfx("tap")});
eDays.addEventListener("click",e=>{const x=e.target.closest("button");if(!x)return;x.setAttribute("aria-pressed",x.getAttribute("aria-pressed")!=="true");sfx("tap")});
evForm.addEventListener("submit",e=>{if(!e.submitter||e.submitter.value!=="save")return;const days=[...eDays.querySelectorAll('[aria-pressed="true"]')].map(x=>+x.dataset.d);
  const err=!eTitle.value.trim()?"Give it a name.":evRep==="weekly"&&!days.length?"Pick at least one day.":evRep==="once"&&!eDate.value?"Pick a date.":hm(eEnd.value)<=hm(eStart.value)?"The end time must be after the start.":"";
  if(err){e.preventDefault();eErr.textContent=err;eErr.hidden=false;sfx("no");return}
  S.events=[...(S.events||[]),{id:Math.random().toString(36).slice(2,9),title:eTitle.value.trim(),kind:eKind.value,who:eKind.value==="outing"&&eWho.value==="kid"?"both":eWho.value,start:eStart.value,end:eEnd.value,rep:evRep,date:evRep==="once"?eDate.value:null,days:evRep==="weekly"?days:[],from:today,note:eNote.value.trim()}];sfx("ok");toast("Added to the day");commit()});
const pick=document.getElementById("pick");
function openPicker(){document.getElementById("pickList").replaceChildren(el(everyUnit().map(u=>`<button class="unit ${SC(u.subj)}" style="grid-template-columns:44px 1fr" data-k="${u.k}"><span class="no">${/^\d+$/.test(u.n)?u.n:esc(u.n)}</span><span><b>${esc(u.title)}</b><br><span class="xs muted">${SUBJ[u.subj]} · Level ${u.level}</span></span></button>`).join("")));sfx("tap");pick.showModal()}
document.getElementById("pickList").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const u=unitBy(b.dataset.k);if(u){logSession(u,"free");pick.close();sfx("ok");toast("Logged");commit()}});
document.getElementById("pickClose").onclick=()=>pick.close();
boot();
