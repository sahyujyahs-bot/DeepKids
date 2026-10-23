function viewPlanner(){const k=seg("week"),v=ui.pv||"week";initDrag();let h=pageHead("Plan")+segBar("week")+`</section>`;
  if(k==="tell"){const Q=askList();h+=`<section class="sec">${dumpCard()}</section>`+(Q.length?plPart("asks"):"")+(ui.sheet?.mode==="told"?"":`<section class="sec">${toldView()}</section>`)}
  else if(k==="cal")h+=`<section class="sec"><div class="seg">${Object.entries(PV).map(([kk,nm])=>`<button aria-pressed="${v===kk}" data-act="pv" data-v="${kk}">${nm}</button>`).join("")}</div>${{year:yearOrbit,month:monthView,week:weekView,day:dayView}[v]()}</section>`;
  else if(k==="queue")h+=queuesView()+((WT[ui.tq]?ui.tq:"les")==="les"?plPart("pace"):"");
  else if(k==="pending")h+=newView();
  else h+=goingView();
  return h}
/* subject filter for the work lists (lessons have their own subject row) */
const qfOf=()=>S.subjects.includes(ui.qf)?ui.qf:"all";
const subjChips=()=>`<div class="seg">${["all",...S.subjects].map(x=>`<button aria-pressed="${qfOf()===x}" data-act="qf" data-s="${x}">${x==="all"?"All subjects":SUBJ[x]}</button>`).join("")}</div>`;
const bySubj=L=>qfOf()==="all"?L:L.filter(x=>x.u?.subj===qfOf());
function qItems(t,s){if(t==="les"){const ex=(S.extra||{})[s]||[];return plannedUnits(s).filter(u=>rank[coverage(u)]<2).filter((u,i)=>i<12||ex.includes(u.k)).map(u=>({ref:"les:"+u.k,u,title:chT(u),sub:`${u.board==="gen"?"DeepKids topic":u.board==="dk"?"DeepKids Plus":u.book} · ${sessionsFor(u)} days`,open:`data-act="chapter" data-k="${u.k}"`,rm:ex.includes(u.k)}))}
  return bySubj(wqList(t)).map(x=>({...x,sub:`${chT(x.u)} · ${SUBJ[x.u.subj]}`,rm:true}))}
/* reorder: the moved items keep the slots they had, so a filtered list reorders only itself */
function setOrder(ty,s,refs){if(ty==="les"){const ks=refs.map(r=>r.slice(4));S.next={...(S.next||{}),[s]:ks};S.later={...(S.later||{}),[s]:((S.later||{})[s]||[]).filter(k=>!ks.includes(k))}}
  else{const all=wqList(ty).map(x=>x.ref),slots=all.map((r,i)=>refs.includes(r)?i:-1).filter(i=>i>=0);refs.forEach((r,j)=>{if(slots[j]!==undefined)all[slots[j]]=r});WQ()[ty]=all}commit()}
function queuesView(){const t=WT[ui.tq]?ui.tq:"les",s=S.subjects.includes(ui.qs)?ui.qs:S.subjects[0];
  let h=`<section class="sec"><div class="seg qtypes">${Object.entries(WT).map(([k,[n,ic]])=>`<button aria-pressed="${k===t}" data-act="tqt" data-t="${k}">${ic} ${n}${k==="les"?"":` <small>${bySubj(wqList(k)).length}</small>`}</button>`).join("")}</div>`;
  h+=t==="les"?`<div class="seg">${S.subjects.map(x=>`<button aria-pressed="${x===s}" data-act="qsub" data-s="${x}">${SUBJ[x]}</button>`).join("")}</div>`:subjChips();
  const L=qItems(t,s),mv=(x,d,on,lab,ch)=>`<button class="iconbtn qb" data-act="qmv" data-ty="${t}" data-s="${s}" data-r="${esc(x.ref)}" data-d="${d}" ${on?"":"disabled"} aria-label="${lab}">${ch}</button>`;
  h+=`<div class="row"><button class="btn soft sm" data-act="qshuf" data-ty="${t}" data-s="${s}">${icon("spark")}Shuffle</button>${t==="les"?`<button class="btn ${S.exam?"":"soft"} sm" data-act="exam">${S.exam?"Exam track on":"Exam track off"}</button>`:""}</div>`;
  h+=L.length?`<div class="qlist" data-ty="${t}" data-s="${s}">${L.map((x,i)=>`<div class="qrow2${x.ref===ui.flash?" flash":""}" data-r="${esc(x.ref)}"><span class="dh" aria-hidden="true">⠿</span><span class="qn">${i+1}</span><button class="plain" ${x.open} style="min-width:0;flex:1;text-align:left"><b>${esc(x.title)}</b><br><span class="xs muted">${esc(x.sub)}</span></button><span class="row" style="gap:4px;flex-wrap:nowrap">${mv(x,-1,i>0,"Move up","▲")}${mv(x,1,i<L.length-1,"Move down","▼")}${x.rm?`<button class="iconbtn qb" data-act="qx" data-ty="${t}" data-s="${s}" data-r="${esc(x.ref)}" aria-label="Take out">${icon("close")}</button>`:""}</span></div>`).join("")}</div>`
    :`<p class="note">${t==="les"?"No chapters waiting.":`No ${WT[t][0].toLowerCase()} waiting${qfOf()==="all"?"":" in "+SUBJ[qfOf()]}. They join this queue when you finish the lesson part they belong to, or when you tap “+ Queue” in a lesson.`}</p>`;
  if(t==="les")h+=`<button class="link" data-act="lt2" style="justify-self:start">Find more chapters and topics in the Library →</button>`;
  return h+`</section>`}
function goingView(){const L=bySubj([...lessonsGoing(),...workItems().filter(x=>x.state==="going")]),ex=(S.exps||[]).filter(e=>!e.closed);
  let h=`<section class="sec">${subjChips()}</section>`+grouped(L,"Nothing started yet. When you start a lesson, worksheet, quiz or project, it stays here until it's finished.",x=>taskRow(x));
  if(ex.length)h+=`<section class="sec"><div class="sech"><h3 style="font-size:18px">🌱 Daily check-ins</h3><span class="pill">${ex.length}</span></div><div class="col" style="gap:8px">${ex.map(e=>{const day=Math.round((parse(today)-parse(e.start))/864e5)+1,c=e.checks.includes(today);return `<div class="trow"><span class="tic">🌱</span><div style="min-width:0;flex:1"><b>${esc(e.title)}</b><br><span class="xs muted">Day ${day}${e.topic?" · "+esc(e.topic):""}${c?" · checked today":""}</span><br><button class="link xs" data-act="close" data-e="${e.id}">Finish it</button></div><button class="btn xs ${c?"soft":"accent"}" data-act="check" data-e="${e.id}">${c?"Checked ✓":"Check today"}</button></div>`}).join("")}</div></section>`;
  return h}
function newView(){const L=bySubj(workItems().filter(x=>x.state==="new"));
  return `<section class="sec">${subjChips()}<p class="sm muted">Each one is already waiting in its queue under <b>Queue</b>. Move it first or last, or take it out.</p></section>`+
   grouped(L,"Nothing pending. Activities, experiments, projects, quizzes and worksheets from lessons you've done show up here if they weren't started.",x=>taskRow(x,`<div class="row" style="gap:10px;margin-top:4px">${qPick(x.ty,x.u.subj,x.ref,"Move in queue","link xs")}${ui.qpick===x.ref?"":`<button class="link xs" data-act="qx" data-ty="${x.ty}" data-r="${esc(x.ref)}">Not doing this</button>`}</div>`))}
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
