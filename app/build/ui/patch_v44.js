function viewPlanner(){const k=seg("week"),v=ui.pv||"week";initDrag();let h=pageHead("Plan")+segBar("week")+`</section>`;
  if(k==="tell"){const Q=askList();h+=`<section class="sec">${dumpCard()}</section>`+(Q.length?plPart("asks"):"")+(ui.sheet?.mode==="told"?"":`<section class="sec">${toldView()}</section>`)+`<div id="paceSec">${subjCard()}${plPart("pace")}</div>`}
  else if(k==="cal")h+=`<section class="sec"><div class="seg">${Object.entries(PV).map(([kk,nm])=>`<button aria-pressed="${v===kk}" data-act="pv" data-v="${kk}">${nm}</button>`).join("")}</div>${{year:yearOrbit,month:monthView,week:weekView,day:dayView}[v]()}</section>`;
  else if(k==="todo")h+=todoTab();
  else if(k==="queue")h+=queuesView()+((WT[ui.tq]?ui.tq:"les")==="les"?`<section class="sec"><button class="link" data-act="pacego" style="justify-self:start">Pace: hours, days and class for each subject → Tell DeepKids</button></section>`:"");
  else if(k==="pending")h+=newView();
  else h+=goingView();
  return h}
function subjCard(){return `<section class="sec"><div class="sech"><h3>Subjects</h3><span class="xs muted">Tap to add or leave out</span></div><div class="row chips">${SUBJ_KEYS.map(k=>`<button class="chip ${SC(k)}" aria-pressed="${S.subjects.includes(k)}" data-act="subtog" data-s="${k}">${S.subjects.includes(k)?"✓ ":"+ "}${SUBJ[k]}</button>`).join("")}</div></section>`}
