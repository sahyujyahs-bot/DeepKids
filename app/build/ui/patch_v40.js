/* ---------- To do: what's started, what's not started yet, and the line-up of each kind ---------- */
const WT={les:["Lessons","📘"],proj:["Projects","🧩"],exp:["Experiments","🧪"],act:["Activities","✂️"],ws:["Worksheets","📝"],qz:["Quizzes","❓"]};
const WQ=()=>S.wq||(S.wq={});
function wType(u,id){if(id==="proj")return "proj";const P=u.c?.p;if(P){if(refParts(u,id).length>=2)return "proj";if((P.experiments||[]).some(e=>e.id===id))return "exp";if((P.worksheets||[]).some(w=>w.id===id))return "ws";return "act"}return /^exp/.test(id)?"exp":"act"}
function quizQ(u,n){const P=u.c?.p;if(!P)return [];const d=pkDay(u,n),W=P.words||[];if(d.steps.some(s=>s.kind==="check")&&P.check?.length)return P.check;const last=d.n===P.days.length;
  return last&&P.check?.length?P.check.slice(0,5):(W.length?[0,1,2].map(i=>W[((d.n-1)*3+i)%W.length]).filter((w,i,a)=>a.indexOf(w)===i).map(([w,m])=>({q:`What does “${w}” mean?`,a:m})):[])}
/* a step ticked off during the lesson counts as done */
function stepTicked(u,id){const P=u.c?.p;if(!P)return false;const names=new Set();P.days.forEach(d=>d.steps.forEach(s=>{if(s.ref===id)names.add((PKIND[s.kind]||["act"])[0]+"|"+s.title)}));if(!names.size)return false;
  return Object.entries(S.steps||{}).some(([key,arr])=>key.replace(/^x/,"").startsWith(u.k+"|")&&(arr||[]).some(n=>names.has(n)))}
function quizTicked(u,n){const tk=(S.steps||{})[u.k+"|"+n]||[],d=pkDay(u,n);return tk.some(x=>/^ws\|(Quick quiz|End-of-chapter quiz)$/.test(x))||d.steps.some(s=>s.kind==="check"&&tk.includes("ws|"+s.title))}
function workItems(){const out=[],W=WK(),refK=r=>{const x=r.slice(r.indexOf(":")+1);return x.slice(0,x.lastIndexOf("|"))};
  const seenK=new Set([...S.log.map(l=>l.key),...Object.keys(S.progress||{}).filter(k=>(S.progress[k].sessions||0)>0),...Object.keys(W).map(k=>k.slice(0,k.lastIndexOf("|"))),...Object.values(WQ()).flat().map(refK)]);
  const add=(ty,u,id,title,state,o)=>out.push({ref:ty+":"+u.k+"|"+id,ty,u,id,title,state,...o});
  [...seenK].map(unitByK).filter(Boolean).forEach(u=>{const P=u.c?.p,dn=done(u.k);if(!P)return;
    (P.worksheets||[]).forEach(w=>{const k2=u.k+"#"+w.id,w0=W[u.k+"|"+w.id];if(taskDone(k2,"ws")||["skip","done"].includes(w0?.st)||stepTicked(u,w.id)||((S.steps||{})[u.k+"|"+w.day]||[]).includes("ws|Worksheet: "+w.title))return;
      const c=wsCount(k2,w.sections),open=`data-act="ws" data-k="${u.k}" data-w="${esc(w.id)}"`;
      if(c.ans>0)add("ws",u,w.id,w.title,"going",{sub:`${c.ans} of ${c.tot} answered`,open,go:"Continue"});
      else if((w.day||99)<=dn||w0?.st==="planned")add("ws",u,w.id,w.title,"new",{sub:(w.day||99)<=dn?`From Part ${w.day}, which you've done`:"Added by you",open,go:"Start"})});
    [...(P.experiments||[]),...(P.activities||[])].forEach(e=>{const w0=W[u.k+"|"+e.id],R=refParts(u,e.id),ty=wType(u,e.id),open=`data-act="chapter" data-k="${u.k}" data-t="lab"`;if(taskDone(u.k,e.id)||["done","skip"].includes(w0?.st))return;
      const a=R[0]||99,z=R[R.length-1]||99;
      if(w0?.st==="started")add(ty,u,e.id,e.title,"going",{sub:`Started ${fmt(w0.started)}`,open,go:"Open"});
      else if(ty==="proj"&&a<=dn)add(ty,u,e.id,e.title,"going",{sub:dn>=z?"All its parts are done · mark it finished":`Parts ${a}–${z} · next check-in Part ${R.find(r=>r>dn)}`,open,go:"Open"});
      else if(stepTicked(u,e.id))return;
      else if(a<=dn||w0?.st==="planned")add(ty,u,e.id,e.title,"new",{sub:a<=dn?`From Part ${a}, which you've done`:"Added by you",open,go:"Open"})});
    for(let n=1;n<=Math.min(dn,P.days.length);n++){const Q=quizQ(u,n);if(!Q.length||quizTicked(u,n))continue;const r=S.quiz?.[u.k+"|"+n]||{},a=Object.keys(r).length,w0=W[u.k+"|q"+n];if(a>=Q.length||["skip","done"].includes(w0?.st))continue;
      add("qz",u,"q"+n,`Quiz · Part ${n}`,a?"going":"new",{sub:a?`${a} of ${Q.length} asked`:`${Q.length} questions`,open:`data-act="qzs" data-k="${u.k}" data-n="${n}"`,go:a?"Continue":"Start"})}});
  Object.entries(W).forEach(([key,w])=>{if(!["started","planned"].includes(w.st))return;const j=key.lastIndexOf("|"),u=unitByK(key.slice(0,j)),id=key.slice(j+1);if(!u||/^q\d+$/.test(id)||out.some(x=>x.u.k===u.k&&x.id===id))return;
    add(wType(u,id),u,id,w.title||wkTitle(u,id,""),w.st==="started"?"going":"new",{sub:w.st==="started"?`Started ${fmt(w.started)}`:"Added by you",open:`data-act="chapter" data-k="${u.k}" data-t="lab"`,go:"Open"})});
  return out}
function lessonsGoing(){return S.subjects.flatMap(s=>plannedUnits(s).filter(u=>coverage(u)==="learning").slice(0,3).map(u=>{const n=done(u.k),tot=sessionsFor(u);return {ref:"les:"+u.k,ty:"les",u,id:"",title:chT(u),state:"going",sub:`${n} of ${tot} parts done`,open:`data-act="chapter" data-k="${u.k}"`,go:"Open"}}))}
function wqList(ty){const its=workItems().filter(x=>x.ty===ty&&x.state==="new"),o=WQ()[ty]||[],pos=r=>{const i=o.indexOf(r);return i<0?1e6:i};return its.map((x,i)=>({x,i})).sort((a,b)=>pos(a.x.ref)-pos(b.x.ref)||a.i-b.i).map(z=>z.x)}
function qItems(t,s){if(t==="les"){const ex=(S.extra||{})[s]||[];return plannedUnits(s).filter(u=>rank[coverage(u)]<2).filter((u,i)=>i<12||ex.includes(u.k)).map(u=>({ref:"les:"+u.k,title:chT(u),sub:`${u.board==="gen"?"DeepKids topic":u.board==="dk"?"DeepKids Plus":u.book} · ${sessionsFor(u)} days`,open:`data-act="chapter" data-k="${u.k}"`,rm:ex.includes(u.k)}))}
  return wqList(t).map(x=>({...x,sub:`${chT(x.u)} · ${SUBJ[x.u.subj]}`,rm:true}))}
function setOrder(ty,s,refs){if(ty==="les"){const ks=refs.map(r=>r.slice(4));S.next={...(S.next||{}),[s]:ks};S.later={...(S.later||{}),[s]:((S.later||{})[s]||[]).filter(k=>!ks.includes(k))}}
  else{const all=wqList(ty).map(x=>x.ref);WQ()[ty]=[...refs,...all.filter(r=>!refs.includes(r))]}commit()}
/* add to the front or the end of a line-up; returns its place */
function qPut(ty,s,r,where){const key=r.slice(r.indexOf(":")+1);
  if(ty==="les"){const k=key,u=unitBy(k);if(!plannedUnits(s).some(z=>z.k===k))S.extra={...(S.extra||{}),[s]:[...new Set([...((S.extra||{})[s]||[]),k])]};
    const nx=((S.next||{})[s]||[]).filter(x=>x!==k),cur=plannedAt(s,S.levels[s]).filter(z=>rank[coverage(z)]<2&&z.k!==k).map(z=>z.k);
    S.next={...(S.next||{}),[s]:where==="first"?[k,...nx]:[...new Set([...nx,...cur]),k]};S.later={...(S.later||{}),[s]:((S.later||{})[s]||[]).filter(x=>x!==k)};commit();return qPos(u)}
  const W=WK(),w=W[key]||{};if(!w.st||w.st==="skip")W[key]={...w,st:"planned",planned:today};
  const all=wqList(ty).map(x=>x.ref).filter(x=>x!==r);WQ()[ty]=where==="first"?[r,...all]:[...all,r];commit();return WQ()[ty].indexOf(r)+1}
function qPick(ty,s,r,label,cls){const a=w=>`data-act="qput" data-ty="${ty}" data-s="${s}" data-r="${esc(r)}" data-w="${w}"`;
  if(ui.qpick===r)return `<span class="qpick"><button class="btn xs accent" ${a("first")}>${ty==="les"?"Do it next":"First in queue"}</button><button class="btn xs soft" ${a("last")}>${ty==="les"?"End of this class":"Last in queue"}</button><button class="link xs" data-act="qpick" data-r="">Cancel</button></span>`;
  return `<button class="${cls||"btn sm"}" data-act="qpick" data-r="${esc(r)}">${label}</button>`}
function viewTasks(){initDrag();const k=seg("tasks");let h=pageHead("To do")+segBar("tasks")+`</section>`;return h+(k==="going"?goingView():k==="new"?newView():queuesView())}
const taskRow=(x,extra="")=>`<div class="trow"><span class="tic" aria-hidden="true">${WT[x.ty][1]}</span><div style="min-width:0;flex:1"><b>${esc(x.title)}</b><br><span class="xs muted">${x.ty==="les"?"":esc(chT(x.u))+" · "}${esc(SUBJ[x.u.subj])} · ${esc(x.sub)}</span>${extra}</div><button class="btn xs ${x.state==="going"?"accent":"soft"}" ${x.open}>${x.go}</button></div>`;
function grouped(list,empty,rowFn){const by=Object.keys(WT).map(t=>[t,list.filter(x=>x.ty===t)]).filter(([,l])=>l.length);if(!by.length)return `<section class="sec"><p class="note">${empty}</p></section>`;
  return by.map(([t,l])=>`<section class="sec"><div class="sech"><h3 style="font-size:18px">${WT[t][1]} ${WT[t][0]}</h3><span class="pill">${l.length}</span></div><div class="col" style="gap:8px">${l.map(rowFn).join("")}</div></section>`).join("")}
function goingView(){const L=[...lessonsGoing(),...workItems().filter(x=>x.state==="going")],ex=(S.exps||[]).filter(e=>!e.closed);
  let h=grouped(L,"Nothing started yet. When you start a lesson, worksheet, quiz or project, it stays here until it's finished.",x=>taskRow(x));
  if(ex.length)h+=`<section class="sec"><div class="sech"><h3 style="font-size:18px">🌱 Daily check-ins</h3><span class="pill">${ex.length}</span></div><div class="col" style="gap:8px">${ex.map(e=>{const day=Math.round((parse(today)-parse(e.start))/864e5)+1,c=e.checks.includes(today);return `<div class="trow"><span class="tic">🌱</span><div style="min-width:0;flex:1"><b>${esc(e.title)}</b><br><span class="xs muted">Day ${day}${e.topic?" · "+esc(e.topic):""}${c?" · checked today":""}</span><br><button class="link xs" data-act="close" data-e="${e.id}">Finish it</button></div><button class="btn xs ${c?"soft":"accent"}" data-act="check" data-e="${e.id}">${c?"Checked ✓":"Check today"}</button></div>`}).join("")}</div></section>`;
  return h}
function newView(){const L=workItems().filter(x=>x.state==="new");
  return `<section class="sec"><p class="sm muted">From lessons you've done. Each one is already waiting in its queue under <b>Queues</b>. Move it first or last, or take it out.</p></section>`+
   grouped(L,"Nothing left behind. Activities, experiments, projects, quizzes and worksheets from lessons you've done show up here if they weren't started.",x=>taskRow(x,`<div class="row" style="gap:10px;margin-top:4px">${qPick(x.ty,x.u.subj,x.ref,"Move in queue","link xs")}${ui.qpick===x.ref?"":`<button class="link xs" data-act="qx" data-ty="${x.ty}" data-r="${esc(x.ref)}">Not doing this</button>`}</div>`))}
function queuesView(){const t=WT[ui.tq]?ui.tq:"les",s=S.subjects.includes(ui.qs)?ui.qs:S.subjects[0];
  let h=`<section class="sec"><div class="seg qtypes">${Object.entries(WT).map(([k,[n,ic]])=>`<button aria-pressed="${k===t}" data-act="tqt" data-t="${k}">${ic} ${n}${k==="les"?"":` <small>${wqList(k).length}</small>`}</button>`).join("")}</div>`;
  if(t==="les")h+=`<div class="seg">${S.subjects.map(x=>`<button aria-pressed="${x===s}" data-act="qsub" data-s="${x}">${SUBJ[x]}</button>`).join("")}</div>`;
  const L=qItems(t,s),mv=(x,d,on,lab,ch)=>`<button class="iconbtn qb" data-act="qmv" data-ty="${t}" data-s="${s}" data-r="${esc(x.ref)}" data-d="${d}" ${on?"":"disabled"} aria-label="${lab}">${ch}</button>`;
  h+=`<div class="row"><button class="btn soft sm" data-act="qshuf" data-ty="${t}" data-s="${s}">${icon("spark")}Shuffle</button></div>`;
  h+=L.length?`<div class="qlist" data-ty="${t}" data-s="${s}">${L.map((x,i)=>`<div class="qrow2${x.ref===ui.flash?" flash":""}" data-r="${esc(x.ref)}"><span class="dh" aria-hidden="true">⠿</span><span class="qn">${i+1}</span><button class="plain" ${x.open} style="min-width:0;flex:1;text-align:left"><b>${esc(x.title)}</b><br><span class="xs muted">${esc(x.sub)}</span></button><span class="row" style="gap:4px;flex-wrap:nowrap">${mv(x,-1,i>0,"Move up","▲")}${mv(x,1,i<L.length-1,"Move down","▼")}${x.rm?`<button class="iconbtn qb" data-act="qx" data-ty="${t}" data-s="${s}" data-r="${esc(x.ref)}" aria-label="Take out">${icon("close")}</button>`:""}</span></div>`).join("")}</div>`
    :`<p class="note">${t==="les"?"No chapters waiting.":`No ${WT[t][0].toLowerCase()} waiting. They join this line when you finish the lesson part they belong to, or when you tap “+ Queue” in a lesson.`}</p>`;
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
const DKSTEPS=[0,10,15,20,30,45,60],dkMinsOf=()=>S.dkMins??20;
const DKSTOP=new Set("this that with from what your have they their them about into does which when where will would there these those child make each more some like other than then very just also only many much were been being because around chapter lesson learn talk book know things thing people today tell show find story".split(" "));
function dkWords(s){return new Set((String(s||"").toLowerCase().match(/[a-z]{4,}/g)||[]).filter(w=>!DKSTOP.has(w)).map(w=>w.replace(/(ies|es|s)$/,"")))}
function dkPick(date,lessons){const L=lessons.map(l=>l.u).filter(Boolean),live=DATA.topics.filter(t=>(t.cls||[1,2,3,4,5]).includes(S.levels.sci||1)&&rank[st("dk|"+t.id)]<2);if(!live.length)return null;
  const lw=new Set(L.flatMap(u=>[...dkWords([u.title,u.c?.covers,u.c?.p?.summary,(u.c?.p?.words||[]).map(x=>x[0]).join(" ")].join(" "))]));let best=null,h0=0;for(const c of date)h0=(h0*31+c.charCodeAt(0))%9973;
  live.forEach((t,i)=>{const mapped=L.find(u=>(u.dk||[]).includes(t.id)),hit=[...dkWords([t.name,t.summary,t.sub,t.q].join(" "))].filter(w=>lw.has(w));const sc=(mapped?100:0)+hit.length+(rank[st("dk|"+t.id)]===1?2:0)+((h0+i*7)%13)/100;if(!best||sc>best.sc)best={sc,t,mapped,hit}});
  const u=unitBy("dk|"+best.t.id);if(!u)return null;const near=best.mapped||L.find(x=>[...dkWords(x.title)].some(w=>best.hit.includes(w)))||null;
  return {u,why:best.mapped?`Goes with ${chT(best.mapped)}`:near?`Goes with ${chT(near)} (${best.hit.slice(0,2).join(", ")})`:best.hit.length?`Links to today's lessons: ${best.hit.slice(0,2).join(", ")}`:"Today's big question"}}
function ideasHtml(){return trackIdeas(3).map(({u,e})=>`<div class="trow"><span class="tic">🌱</span><div style="min-width:0;flex:1"><b>${esc(e.title)}</b><br><span class="xs muted">${esc(chT(u))} · ${esc(SUBJ[u.subj])}</span></div><button class="btn xs soft" data-act="startexp" data-title="${esc(e.title)}" data-topic="${esc(chT(u))}">Start</button></div>`).join("")}
function dkPaceCard(){if(!plusOn()||!S.subjects.includes("sci"))return "";const m=dkMinsOf(),left=DATA.topics.filter(t=>(t.cls||[1,2,3,4,5]).includes(S.levels.sci||1)&&rank[st("dk|"+t.id)]<2).length;
  return `<div class="card r-both"><div class="sech"><div class="row" style="gap:8px"><span style="font-size:28px" aria-hidden="true">✨</span><h3>DeepKids topics</h3></div><div class="stepper"><button data-act="dkmin" data-d="-1" ${m<=0?"disabled":""} aria-label="Less time">−</button><span class="sm" style="min-width:64px;text-align:center">${m?m+" min":"Off"}</span><button data-act="dkmin" data-d="1" ${m>=60?"disabled":""} aria-label="More time">+</button></div></div>
   <p class="xs muted">${m?`Each learning day: ${m} minutes on a big question that goes with that day's lessons. ${left} topic${left===1?"":"s"} for Class ${S.levels.sci||1}.`:"Off. Turn it on to add a big question to each learning day."}</p></div>`}
/* every lesson step says where it comes from: the textbook (open it at these pages) or DeepKids (book closed) */
function srcLine(s){const {book,pages}=srcOf(s),a=ACTN[s.kind]||"step",pg=pages.length?` · page${pages.length>1||pages[0].includes("–")?"s":""} ${pages.join(", ")}`:"";
  return book?`<div class="src book"><b>📖 Book step${pg}</b><span>Open the textbook now${pages.length?" at "+(pages.length>1||pages[0].includes("–")?"these pages":"this page"):""}.</span></div>`:`<div class="src dk"><b>✨ DeepKids step · ${a}</b><span>Book closed for this one. Everything is on this screen.</span></div>`}
const pkHead=(d,F)=>{const L=(F||[]).map((x,i)=>({...x,i:i+1})),bk=L.filter(x=>x.bk),isBook=n=>/text ?book|learner['’]s book|book pages?|^pages? \d/i.test(n),need=(d.need||[]).filter(n=>!(bk.length&&isBook(n)));
  let pages=[...new Set(bk.flatMap(x=>x.pages))];if(bk.length&&!pages.length)pages=[...new Set((d.need||[]).filter(isBook).flatMap(n=>srcOf({title:n}).pages))];
  const sh=t=>t.length>26?t.slice(0,25).trim()+"…":t;
  return `<div class="phead"><p class="sm"><b>Today:</b> ${esc(d.goal)}</p>${L.length?`<div class="flow" aria-label="Today's steps">${L.map(x=>`<span class="fl ${x.bk?"bk":"dk"}"><i>${x.i}</i>${x.bk?"📖":"✨"} ${esc(sh(x.title))}</span>`).join("")}</div><p class="xs muted">✨ DeepKids step: book closed, follow the screen. 📖 Book step: open the textbook where it says.</p>`:""}
   ${bk.length?`<p class="sm"><b>📖 Textbook${pages.length?", page"+(pages.length>1||pages[0].includes("–")?"s ":" ")+pages.join(", "):""}</b> · for step${bk.length>1?"s":""} ${bk.map(x=>x.i).join(", ")}</p>`:`<p class="sm"><b>✨ No textbook today.</b> Every step is on screen.</p>`}${need.length?`<p class="sm"><b>Get ready:</b> ${need.map(esc).join(", ")}</p>`:""}</div>`};
