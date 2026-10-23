/* keep sideways (and inner) scroll positions when the screen redraws, e.g. jokes in a row */
function scrollSnap(root){if(!root)return null;const L=[...root.querySelectorAll("div,section,ul,ol,nav")],out=[];L.forEach(e=>{if(e.scrollLeft>0||e.scrollTop>0){const cls=e.className||"",i=L.filter(z=>(z.className||"")===cls).indexOf(e);out.push({cls,i,x:e.scrollLeft,y:e.scrollTop})}});return out}
function scrollBack(root,snap){if(!root||!snap?.length)return;const L=[...root.querySelectorAll("div,section,ul,ol,nav")];snap.forEach(s=>{const e=L.filter(z=>(z.className||"")===s.cls)[s.i];if(e){if(s.x)e.scrollLeft=s.x;if(s.y)e.scrollTop=s.y}})}
const _dkRender=render,_dkRenderSheet=renderSheet;
render=function(...a){const m=document.getElementById("main"),s=scrollSnap(m),r=_dkRender.apply(this,a);scrollBack(document.getElementById("main"),s);return r};
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
function viewPlanner(){const k=seg("week"),v=ui.pv||"week";initDrag();let h=pageHead("Plan")+segBar("week")+`</section>`;
  if(k==="tell"){const Q=askList();h+=`<section class="sec">${dumpCard()}</section>`+(Q.length?plPart("asks"):"")+(ui.sheet?.mode==="told"?"":`<section class="sec">${toldView()}</section>`)}
  else if(k==="cal")h+=`<section class="sec"><div class="seg">${Object.entries(PV).map(([kk,nm])=>`<button aria-pressed="${v===kk}" data-act="pv" data-v="${kk}">${nm}</button>`).join("")}</div>${{year:yearOrbit,month:monthView,week:weekView,day:dayView}[v]()}</section>`;
  else if(k==="todo")h+=todoTab();
  else if(k==="queue")h+=queuesView()+((WT[ui.tq]?ui.tq:"les")==="les"?plPart("pace"):"");
  else if(k==="pending")h+=newView();
  else h+=goingView();
  return h}
