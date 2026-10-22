function refresherFor(date){const keys=[...new Set(S.log.filter(l=>l.date<date).map(l=>l.key))];if(!keys.length)return null;const dn=Math.floor(parse(date)/864e5),u=unitBy(keys[dn%keys.length]);if(!u)return null;
  const P=u.c?.p,c=u.c||{},pool=[];
  if(P){(P.experiments||[]).forEach(e=>pool.push({kind:"exp",title:e.title,body:e.question,steps:e.steps,need:e.need,predict:e.predict,why:e.why,safety:e.safety}));(P.activities||[]).forEach(a=>pool.push({kind:"act",title:a.title,body:a.outcome?"You end up with: "+a.outcome:"",steps:a.steps,need:a.need}))}
  if(c.game&&!P)pool.unshift({kind:"game",title:c.game[0],body:c.game[1]});
  if(!P){(c.exp||[]).forEach(e=>pool.push({kind:"exp",title:e.split(":")[0].slice(0,50),body:e}));(c.act||[]).forEach(e=>pool.push({kind:"act",title:e.split(":")[0].slice(0,50),body:e}))}
  const part=pool.length?pool[dn%pool.length]:{kind:"talk",title:"Quick recall",body:"Ask your child to tell you three things they remember from "+u.title+", then one question they still have."};
  const Q=P?.check||[],quiz=Q.length?[0,1,2].map(i=>Q[(dn+i*2)%Q.length]).filter((q,i,a)=>a.indexOf(q)===i):(c.x?.quiz||[]).slice(0,3).map(([s,t,w])=>({q:"True or false: "+s,a:(t?"True. ":"False. ")+w}));
  return {u,...part,quiz}}
function refreshView(){const it=dayPlan(ui.sheet.date||today).find(i=>i.id==="refresh");if(!it)return `<p class="note">No refresher today.</p>`;const r=it.rf,KL2={game:"Game",exp:"Experiment",act:"Activity",talk:"Talk"};document.getElementById("sheetTitle").textContent="Refresher · "+r.u.title;
  return `<section class="stage" style="--c:var(--sun)"><div class="kind"><span>${KL2[r.kind]||"Refresher"} · about 15 minutes</span></div><h2>${esc(r.title)}</h2>
    <div class="body"><p>${esc(r.body||"")}</p>${r.need?.length?`<p class="sm"><b>You need:</b> ${r.need.map(esc).join(", ")}</p>`:""}${r.steps?.length?pkList(r.steps,"ol"):""}${r.predict?`<div class="ask"><span class="eyebrow">Guess first</span>${esc(r.predict)}</div>`:""}${r.why?`<details><summary class="sm">Why it happens</summary><p class="sm">${esc(r.why)}</p></details>`:""}${r.safety?`<p class="sm" style="color:var(--bad)"><b>Safety:</b> ${esc(r.safety)}</p>`:""}</div></section>
   ${r.quiz?.length?`<section class="card"><span class="eyebrow">Then 3 quick questions</span><p class="xs muted">Ask aloud. Tap to see a good answer.</p><ol class="sm">${r.quiz.map(q=>`<li><b>${esc(q.q)}</b><details><summary class="xs muted">Answer</summary><p class="sm">${esc(q.a)}</p></details></li>`).join("")}</ol></section>`:""}
   <p class="xs muted">A quick return to ${esc(r.u.title)} (${esc(unitLabel(r.u))}) so it stays fresh.</p>
   <div class="row"><button class="btn green wide" data-act="tlcheck" data-id="refresh" data-date="${ui.sheet.date||today}">${icon("check")}${it.done?"Done ✓":"We did it"}</button></div>
   ${chapterHub(r.u)}`}
