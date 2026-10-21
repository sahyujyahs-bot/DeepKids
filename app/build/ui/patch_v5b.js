function playerView(){const P=ui.sheet,it={u:unitBy(P.k),n:P.n,tot:P.tot,bonus:P.bonus};if(!it.u)return "";const st=stepState(it),pct=Math.min(100,(st.filter(x=>x.ok).length)/st.length*100);
  document.getElementById("sheetTitle").textContent=`${SUBJ[P.s]} · day ${P.n} of ${P.tot}`;
  let h=`<div class="ptrack"><span style="width:${pct}%"></span>${sblob(P.s,"happy","rider",`style="left:${Math.max(5,pct)}%"`)}</div>`;
  if(P.i>=st.length){const okN=st.filter(x=>x.ok).length,all=okN===st.length;h+=`<section class="stage finish">${sblob(P.s,all?"happy":"calm","bob",'width="120" height="120"')}<div class="stars">${[0,1,2].map(i=>`<svg width="44" height="44" viewBox="0 0 24 24" style="transform:rotate(${(i-1)*12}deg)"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill="${i<Math.max(1,Math.round(okN/st.length*3))?"var(--sun)":"var(--line)"}"/></svg>`).join("")}</div><h2>${all?"Congrats!":"Nearly there"}</h2><p class="muted">${esc(it.u.title)} · ${all?"every step done.":`${st.length-okN} step${st.length-okN>1?"s":""} still open. They move to the next lesson day automatically.`}</p>${photoBtn(P.k,"Add a photo of today's work")}<div class="row" style="justify-content:center"><button class="btn green" data-act="finish">${icon("check")}Finish the lesson</button><button class="btn soft" data-act="pstep" data-d="-1">Back</button></div></section>`;return h}
  const x=st[P.i];
  h+=`<section class="stage"><div class="kind"><span class="k">${icon(x.kind==="step"?"spark":x.kind)}</span><span>Step ${P.i+1} of ${st.length} · ${esc(x.label)}</span></div><h2>${esc(x.title)}</h2>
   <div class="timer"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="var(--surface)" stroke-width="6"/><circle id="tring" cx="22" cy="22" r="18" fill="none" stroke="var(--c)" stroke-width="6" stroke-linecap="round" stroke-dasharray="113 113" transform="rotate(-90 22 22)"/></svg><div><div class="tt2 num" id="tt">${mmss(timerLeft(x))}</div><button class="link" data-act="timer" id="tbtn">${ui.timer&&ui.timer.run?"Pause":"Start timer"}</button></div></div>
   <div class="body">${x.html}</div>
   <div class="row"><button class="btn soft" data-act="pstep" data-d="-1" ${P.i===0?"disabled":""} aria-label="Previous step">${icon("back")}</button><button class="btn green wide" data-act="pdone">${x.ok?"Next":"Done! Next step"}${icon("next")}</button></div></section>`;
  if(it.u.c?.x)h+=`<button class="btn soft sm" data-act="chapter" data-k="${it.u.k}" style="justify-self:start">Whole chapter</button>`;
  if(it.u.c?.x?.guide)h+=`<details class="card"><summary style="cursor:pointer;font:600 16px var(--display)">Parent guide for this chapter</summary><p class="sm">${esc(it.u.c.x.guide)}</p></details>`;
  return h}
function renderSheet(top){if(!ui.sheet)return;const b=document.getElementById("sheetBody"),y=sheet.scrollTop;_sess=null;
  const m=ui.sheet.mode;sheet.className="sheet"+(m==="player"?" colored "+SC(ui.sheet.s):m==="chapter"||m==="ws"?" "+SC(unitBy(ui.sheet.k)?.subj||""):"");
  const V={player:playerView,chapter:chapterView,ws:wsView,prep:prepView,games:gamesView,settings:settingsView,night:nightView,parent:parentView,swap:swapView,jsub:jsubView};
  const h=(V[m]||settingsView)();
  document.getElementById("sheetClose").innerHTML=ui.back?icon("back"):icon("close");document.getElementById("sheetClose").setAttribute("aria-label",ui.back?"Back to the lesson":"Close");
  b.replaceChildren(el(h));sheet.scrollTop=top?0:y;requestAnimationFrame(initPads);if(m==="player")paintTimer()}
const NAV=[["today","Today"],["week","Planner"],["journey","Journey"],["library","Library"]];
function render(){rollDay();_sess=null;const m=document.getElementById("main"),nav=document.getElementById("nav");
  if(!S.setup&&!ob)return startOnboarding(0);
  nav.hidden=!!ob;document.getElementById("me").hidden=!!ob;document.getElementById("snd").innerHTML=icon(soundOn?"sound":"mute");document.getElementById("snd").setAttribute("aria-label",soundOn?"Turn sound off":"Turn sound on");
  document.getElementById("me").innerHTML=icon("grid");
  document.getElementById("hello").innerHTML=`${youBlob("bl bob")}<div style="min-width:0"><b>${ob?"Hello!":S.parent?.name?"Hi, "+esc(S.parent.name):"Hi there!"}</b><span>${ob?"Let's set up your year":(S.child?esc(S.child)+"'s learning · ":"")+(S.board==="none"?"DeepKids Plus":S.board==="combined"?"Combined boards":BOARDS[S.board])}</span></div>`;
  nav.innerHTML=NAV.map(([k,n])=>`<button data-tab="${k}" ${tab===k?'aria-current="page"':""}>${icon(k)}<span>${n}</span></button>`).join("");
  const sx=[...m.querySelectorAll(".hs")].map(x=>x.scrollLeft);
  const banner=!ob&&nightDue()?`<button class="nightbar" data-act="night">${blob("var(--peri)",17,"sleepy","",'width="34" height="34"')}<span><b>Tomorrow isn't ready yet</b><br><span class="xs">${nightItems().filter(p=>!S.prep[p.id]).length} things to get ready · tap to finish</span></span>${icon("next")}</button>`:"";
  m.replaceChildren(el(`<div class="wrap">${banner}${ob?viewOnboarding():{today:viewToday,week:viewPlanner,library:viewLibrary,journey:viewJourney}[tab]()}</div>`));
  m.querySelectorAll(".hs").forEach((x,i)=>{if(sx[i])x.scrollLeft=sx[i]});
  if(ui.sheet&&sheet.open)renderSheet()}
function onAct(e){
  if(ob){const d=ob.d,t=e.target.closest("[data-ob],button[data-age],button[data-b],button.choice[data-s]");if(!t)return;sfx("tap");
    if(t.dataset.ob==="next")return obNext();if(t.dataset.ob==="back"){ob.step--;return render()}
    if(t.dataset.age){d.child=document.getElementById("obName").value;d.age=+t.dataset.age}
    if(t.dataset.b){d.board=t.dataset.b;if(d.board==="none")d.plus=true}
    if(t.dataset.s){const s=t.dataset.s;d.subjects=d.subjects.includes(s)?d.subjects.filter(x=>x!==s):[...d.subjects,s].sort((a,b)=>SUBJ_KEYS.indexOf(a)-SUBJ_KEYS.indexOf(b))}
    return render()}
  const b=e.target.closest("[data-act]");if(!b)return;const a=b.dataset.act,k=b.dataset.k;
  switch(a){
   case "topen":{const id=b.dataset.id,items=dayPlan(b.closest("[data-date]")?.dataset.date||today),cur=ui.open[id]??(focusOf(dayPlan(today),today)?.id===id);ui.open[id]=!cur;sfx(cur?"tap":"flip");render();break}
   case "play":{const it=findItem(b.dataset.id);if(it){sfx("flip");playItem(it)}break}
   case "pstep":{ui.sheet.i=Math.max(0,ui.sheet.i+(+b.dataset.d));sfx("tap");renderSheet(true);break}
   case "pdone":{const P=ui.sheet,it={u:unitBy(P.k),n:P.n,tot:P.tot,bonus:P.bonus},x=stepState(it)[P.i],key=stepKey(it),set=new Set(S.steps[key]||[]);if(x&&!x.ok){set.add(sid(x));S.steps[key]=[...set];sfx("tick")}else sfx("tap");P.i++;S.updatedAt=Date.now();save();renderSheet(true);break}
   case "timer":{sfx("tap");timerToggle();break}
   case "finish":{const P=ui.sheet,u=unitBy(P.k);if(!u)return;const it={u,n:P.n,tot:P.tot,bonus:P.bonus},open=stepState(it).filter(x=>!x.ok);
     S.carry=S.carry||{};S.carry[u.k]=open.length&&P.n<P.tot?open.map(x=>({kind:x.kind,label:x.label,title:x.title.replace(/^From last time: /,""),mins:x.mins,name:x.name,forN:P.n+1})):[];
     logSession(u,P.bonus?"more":"plan");ui.more[P.s]=false;sheet.close();sfx("win");confetti();toast(open.length&&P.n<P.tot?`Done. ${open.length} open step${open.length>1?"s":""} moved to next time`:P.bonus?"Extra lesson done":"Lesson done. Well done!");commit();scrollTo({top:0,behavior:"smooth"});break}
   case "more":{const s=b.dataset.s;ui.more[s]=true;sfx("tick");_sess=null;const it=dayPlan(today).find(i=>i.kind==="lesson"&&i.s===s&&!i.done);render();if(it)playItem(it);break}
   case "less":{ui.more[b.dataset.s]=false;sfx("flip");render();break}
   case "skip":{S.skips[today+"|"+b.dataset.s]=true;sfx("flip");toast("Moved to the next lesson day");commit();break}
   case "swap":{sfx("flip");openSheet({mode:"swap",s:b.dataset.s});break}
   case "pin":{S.pin={...(S.pin||{}),[b.dataset.s]:k};sfx("ok");toast("That's up next");sheet.close();commit();break}
   case "free":{openPicker();break}
   case "chapter":{sfx("flip");if(b.dataset.t)ui.ctab[k]=b.dataset.t;openSheet({mode:"chapter",k});break}
   case "ctab":{ui.ctab[k]=b.dataset.t;sfx("tap");renderSheet(true);break}
   case "qi":{ui.qi[k]=Math.max(0,(ui.qi[k]||0)+(+b.dataset.d));sfx("flip");renderSheet(true);break}
   case "ws":{sfx("flip");openSheet({mode:"ws",k});break}
   case "wsec":{ui.wsec[k]=Math.max(0,(ui.wsec[k]||0)+(+b.dataset.d));sfx("flip");renderSheet(true);break}
   case "wsdone":{S.tasks[k]=S.tasks[k]||{};S.tasks[k].ws=S.tasks[k].ws||today;sfx("win");confetti();toast("Worksheet finished");commit();break}
   case "games":{sfx("flip");openSheet({mode:"games"});break}
   case "night":{sfx("flip");openSheet({mode:"night"});break}
   case "nightdone":{S.night={...(S.night||{}),[today]:1};sfx("win");toast("All set. Sleep well!");sheet.close();commit();break}
   case "parent":{sfx("flip");openSheet({mode:"parent"});break}
   case "phelp":{S.parent=S.parent||{};const h=new Set(S.parent.help||[]);h.has(b.dataset.s)?h.delete(b.dataset.s):h.add(b.dataset.s);S.parent.help=[...h];sfx("tap");renderSheet();break}
   case "psave":{const g=id=>document.getElementById(id).value;S.parent={...(S.parent||{}),name:g("pName").trim(),langs:g("pLang").trim()};S.alarm={on:document.getElementById("pAlarm").checked,time:g("pWake")||"06:30"};S.day={...D(),prepAt:g("pPrep")||D().prepAt,start:g("pStart")||D().start,eveAt:g("pEve")||D().eveAt};sfx("win");toast(S.parent.name?"Thanks, "+S.parent.name+"!":"Saved");sheet.close();commit();break}
   case "quick":{sfx("flip");ui.pday=today;tab="week";ui.pv="day";render();setTimeout(()=>document.getElementById("dumpText")?.focus(),100);break}
   case "qwho":{ui.qwho=b.dataset.w;sfx("tap");const sc=b.closest("#sheetBody")?renderSheet():render();break}
   case "qadd":{const root=b.closest("#sheetBody")||document.getElementById("main"),t=root.querySelector("#qa-t").value.trim(),s=root.querySelector("#qa-s").value,d=root.querySelector("#qa-d").value||today,w=ui.qwho||"you";if(!t){sfx("no");toast("Type what the plan is");return}const id=Math.random().toString(36).slice(2,9);
     if(s)S.events=[...(S.events||[]),{id,title:t,kind:"other",who:w,start:s,end:clock24(hm(s)+60),rep:"once",date:d,days:[],from:today,note:""}];else S.todos=[...(S.todos||[]),{id,title:t,who:w,date:d,note:"",done:false}];sfx("ok");toast("Added for "+fmt(d));commit();break}
   case "todomove":{const x=(S.todos||[]).find(z=>z.id===b.dataset.t);if(x){x.date=tomorrow();sfx("flip");toast("Moved to tomorrow");commit()}break}
   case "tododel":{S.todos=(S.todos||[]).filter(z=>z.id!==b.dataset.t);sfx("flip");commit();break}
   case "goto":{const t=document.getElementById(b.dataset.to);if(t)t.scrollIntoView({behavior:"smooth",block:"start"});break}
   case "task":{const id=b.dataset.id;S.tasks[k]=S.tasks[k]||{};if(S.tasks[k][id]){delete S.tasks[k][id];sfx("flip")}else{S.tasks[k][id]=today;sfx("ok")}commit();break}
   case "startexp":{addExp(b.dataset.title,b.dataset.topic);sfx("ok");toast("Added to Growing and ongoing");commit();break}
   case "status":{const p=S.progress[k]||{sessions:0};p.status=b.dataset.s;p.updated=today;S.progress[k]=p;sfx(b.dataset.s==="mastered"?"win":"tick");commit();break}
   case "logk":{const u=unitBy(k);if(u){logSession(u,"free");sfx("ok");toast("Logged for today");commit()}break}
   case "tlcheck":{const date=b.dataset.date,it=dayPlan(date).find(i=>i.id===b.dataset.id);if(!it)return;
     if(it.kind==="prep"){const all=it.prep.every(p=>S.prep[p.id]);it.prep.forEach(p=>{if(all)delete S.prep[p.id];else S.prep[p.id]=today});sfx(all?"flip":"ok")}
     else if(it.kind==="exps"){S.exps.filter(x=>!x.closed&&x.start<=date).forEach(x=>{if(!x.checks.includes(today))x.checks.push(today)});sfx("ok")}
     else if(it.kind==="lesson"){if(it.done){toast("Already done today");return}if(date!==today){openSheet({mode:"chapter",k:it.u.k});return}return playItem(it)}
     else if(it.kind==="todo"){const x=it.td;if(x.done&&x.doneOn===date){x.done=false;delete x.doneOn;sfx("flip")}else{x.done=true;x.doneOn=date;sfx("ok")}}
     else{const key=date+"|"+it.id;if(S.tl[key])delete S.tl[key];else{S.tl[key]=1;sfx("ok")}}
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
   case "askq":{const v=b.dataset.a;if(v==="parent")return openSheet({mode:"parent"});const ta=document.getElementById("dumpText");if(ta){ta.value=(ta.value?ta.value+"\n":"")+v.slice(4);ta.focus();ta.scrollIntoView({behavior:"smooth",block:"center"})}break}
   case "jsub":{sfx("flip");openSheet({mode:"jsub",s:b.dataset.s});break}
   case "jopen":{ui.jopen=ui.jopen===k?null:k;sfx("tap");renderSheet();break}
   case "lt":{ui.lt=b.dataset.t;sfx("tap");render();break}
   case "invadd":{S.inv=[...(S.inv||[]),{id:Math.random().toString(36).slice(2,9),name:b.dataset.n,cat:b.dataset.c||"other",from:"tap"}];sfx("ok");toast("Added to what we have");commit();break}
   case "invnew":{const n=document.getElementById("invName").value.trim();if(!n)return;S.inv=[...(S.inv||[]),{id:Math.random().toString(36).slice(2,9),name:n,cat:document.getElementById("invCat").value}];sfx("ok");commit();break}
   case "invdel":{S.inv=(S.inv||[]).filter(i=>i.id!==b.dataset.i);sfx("flip");commit();break}
   case "lvl":{const s=b.dataset.s;S.levels[s]=Math.min(5,Math.max(1,S.levels[s]+(+b.dataset.d)));ui.view[s]=S.levels[s];sfx("tick");commit();break}
   case "day":{const s=b.dataset.s,d=+b.dataset.d,cur=new Set(daysOf(s));cur.has(d)?cur.delete(d):cur.add(d);if(cur.size){S.days={...S.days,[s]:[...cur].sort()};sfx("tap");commit()}break}
   case "lsub":{ui.lsub=b.dataset.s;sfx("tap");render();break}
   case "view":{ui.view[b.dataset.s]=+b.dataset.l;sfx("tap");render();break}
   case "setlvl":{S.levels[b.dataset.s]=+b.dataset.l;sfx("tick");commit();break}
   case "check":{const x=S.exps.find(x=>x.id===b.dataset.e);if(x&&!x.checks.includes(today)){x.checks.push(today);sfx("ok");commit()}break}
   case "close":{const x=S.exps.find(x=>x.id===b.dataset.e);if(x){x.closed=true;x.end=today;sfx("win");confetti();toast("Finished: "+x.title);commit()}break}
   case "addexp":{const v=document.getElementById("newExp").value.trim();if(v){addExp(v,"Our own experiment");sfx("ok");commit()}break}
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
   case "saveset":{S.child=document.getElementById("sName").value.trim();const v=document.getElementById("sStart").value;if(v)S.start=v;sfx("ok");toast("Saved");commit();break}
   case "redo":{sheet.close();startOnboarding(1);break}
  }}
/* uploads, night inputs, alarm and the clock */
document.addEventListener("change",async e=>{const t=e.target;
  if(t.id==="dumpImg"){ui.dump=ui.dump||{};ui.dump.text=document.getElementById("dumpText")?.value||"";ui.dump.files=[...t.files].slice(0,4);render();return}
  if(t.dataset.upload&&t.files?.length){if(!ASSETS){toast("Photos can't be saved in this view");return}const k=t.dataset.upload,u=unitBy(k);toast("Saving photo…");
    try{for(const f of [...t.files].slice(0,4)){const r=await ASSETS.upload(f);S.work=[...(S.work||[]),{id:r.id,k,date:today,title:u?.title||""}]}sfx("ok");toast("Photo saved to the journey");commit()}catch(err){toast({too_large:"That photo is too big (20 MB limit)",unsupported_type:"Use a JPG, PNG or WebP photo",quota_or_state:"Photo storage is full"}[err?.code]||"Couldn't save the photo. Try again.")}return}
  if(t.dataset.alarm){S.alarm={...(S.alarm||{on:false,time:"06:30"}),[t.dataset.alarm]:t.type==="checkbox"?t.checked:t.value};S.updatedAt=Date.now();save();return}
  if(t.dataset.over){S.dayOver={...(S.dayOver||{}),[t.dataset.over]:{...((S.dayOver||{})[t.dataset.over]||{}),start:t.value}};S.updatedAt=Date.now();save();return}});
let lastMin=-1,rang={};
setInterval(()=>{const nm=nowMin();if(nm===lastMin)return;lastMin=nm;
  const al=S.alarm;if(al?.on&&clock24(nm)===al.time&&!rang[today]){rang[today]=1;let n=0;const ring=()=>{if(n++<6){sfx("win");setTimeout(ring,1600)}};ring();toast(greetWord()+(S.parent?.name?", "+S.parent.name:"")+"! Time to get up")}
  const busy=document.activeElement&&/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);if(!busy&&!(ui.sheet&&sheet.open)&&(rollDay()||tab==="today"))render()},20000);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&!(ui.sheet&&sheet.open)){rollDay();render()}});
function settingsView(){document.getElementById("sheetTitle").textContent="Settings";
  return `<section class="card r-you tint"><div class="row" style="flex-wrap:nowrap;gap:12px">${youBlob("","happy",'width="48" height="48"')}<div><b style="font:600 17px var(--display)">${S.parent?.name?esc(S.parent.name):"Your profile"}</b><p class="xs muted">Wake-up, prep times and where you'd like help</p></div></div><button class="btn soft sm" data-act="parent" style="justify-self:start">Edit my profile</button></section>
   <section class="card"><div class="field"><label for="sName">Child's name</label><input class="inp" id="sName" maxlength="40" value="${esc(S.child)}"></div><div class="field"><label for="sStart">Plan starts on</label><input class="inp" id="sStart" type="date" value="${S.start}"></div><button class="btn" data-act="saveset">Save</button></section>
   <section class="card"><span class="eyebrow">Syllabus</span><p>${S.board==="none"?"DeepKids Plus only":S.board==="combined"?"NCERT, Cambridge and NIOS":BOARDS[S.board]}${S.plus&&S.board!=="none"?" + DeepKids Plus":""} · ${S.subjects.map(s=>SUBJ[s]).join(", ")}</p><button class="btn line sm" data-act="redo" style="justify-self:start">Change syllabus or subjects</button></section>
   <p class="xs muted">${syncMode==="account"?"Progress is saved privately to your claude.ai account.":"Progress is saved in this browser only."}</p>`}
(async()=>{try{SAMPLE=await window.claude?.use?.("sample")||null;ASSETS=await window.claude?.use?.("assets")||null;if(SAMPLE){const l=await SAMPLE.limits().catch(()=>null);IMGOK=!!l?.images}}catch(e){}render()})();
