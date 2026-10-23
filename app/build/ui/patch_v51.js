/* ---------- Combined syllabus: every board's topics, taught once at the earliest class, deeper each year ---------- */
/* plan order comes from DATA.combined[subj][class]; a topic without its Combined lesson yet uses the board chapters for it */
const plannedAtP=plannedAt;
plannedAt=function(s,l){const L=S.board==="combined"&&DATA.combined?.[s]?.[l];if(!L)return plannedAtP(s,l);const c=collateAt(s,l),m=modeOf(),seen=new Set(),base=[];
  L.forEach(e=>(e.k?[e.k]:e.use||[]).forEach(k=>{const u=unitByK(k);if(u&&!seen.has(k)){seen.add(k);base.push(u)}}));
  return orderUnits(s,base,m==="books"?[...c.ex,...c.gen]:[...c.ex,...c.dk,...c.gen],m==="plus"?1:2)};
const CBN={ncert:"NCERT",cambridge:"Cambridge",nios:"NIOS"};
const amz=b=>`https://www.amazon.in/s?k=${encodeURIComponent(b.title+" "+b.author)}`;
function combTab(u,t){const P=u.c.p;if(!P?.big)return "";
  if(t==="overview")return `<section class="card"><span class="eyebrow">Builds on</span><p class="sm">${esc(P.builds_on)}</p>
    <span class="eyebrow" style="margin-top:6px">Ready for every board</span><p class="xs muted">This covers what these boards teach in Class ${u.level}:</p>${(u.c.boards||[]).map(x=>`<div class="sm"><b>${CBN[x.b]||x.b}</b> ${esc(x.ref)} · ${esc(x.title)}</div>`).join("")}</section>`;
  if(t==="think")return `<section class="card"><span class="eyebrow">Big questions</span>${P.big.map(q=>`<p class="sm">• ${esc(q)}</p>`).join("")}<p class="xs muted">No right answers. Ask "How could we find out?"</p></section>
    <section class="card"><span class="eyebrow">Is the usual story right?</span>${P.challenge.map(c=>`<details><summary class="sm"><b>${esc(c.q)}</b></summary><p class="sm">${esc(c.hint)}</p></details>`).join("")}</section>
    <section class="card"><span class="eyebrow">Other ways of seeing it</span>${P.perspectives.map(x=>`<p class="sm"><b>${esc(x.who)}.</b> ${esc(x.view)}</p>`).join("")}</section>`;
  if(t==="game"){const g=P.game,pr=P.project;return `<section class="card"><span class="eyebrow">Printable ${g.kind==="cards"?"card":"board"} game · ${esc(g.players)} players</span><h3 style="font-size:20px">${esc(g.title)}</h3><ol class="sm">${g.rules.map(r=>`<li>${esc(r)}</li>`).join("")}</ol>${g.need?.length?`<p class="xs muted">You need: ${esc(g.need.join(", "))}</p>`:""}<div class="row"><button class="btn sm accent" data-act="cgprint" data-k="${u.k}">🖨️ Print the game</button><button class="link sm" data-act="cgview" data-k="${u.k}">Preview</button></div></section>
    <section class="card"><span class="eyebrow">Project${pr.days?.length?` · days ${pr.days.join(" and ")}`:""}</span><h3 style="font-size:20px">${esc(pr.title)}</h3><ol class="sm">${pr.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol><p class="xs muted">You end up with: ${esc(pr.outcome)}</p></section>`}
  if(t==="books")return `<section class="card" style="gap:0"><span class="eyebrow" style="margin-bottom:6px">Books on this topic</span>${P.books.map(b=>`<a class="res" href="${esc(amz(b))}" target="_blank" rel="noopener"><div style="min-width:0"><b>${esc(b.title)}</b><span class="xs muted"> · ${esc(b.author)}</span><p class="xs">${esc(b.for[0].toUpperCase()+b.for.slice(1))} · ages ${esc(b.age)}. ${esc(b.why)}</p></div><span class="xs">amazon.in ↗</span></a>`).join("")}<p class="xs muted" style="margin-top:6px">Links open an amazon.in search for the book. Many are also in libraries.</p></section>`;
  return ""}
/* the printable game is a worksheet page: rules, then the board or the cards to cut out */
function gameSheet(u){const g=u.c.p.game;return {id:u.k+"|game",title:g.title,kind:"game",mins:20,blocks:[{type:"rules",title:"How to play",items:g.rules,need:g.need||[]},g.kind==="cards"?{type:"cards",title:"Cut out the cards",cards:g.cards}:{type:"board",title:"The board",squares:g.squares}]}}
const wsBlockP=wsBlock;
wsBlock=function(b,seed,i){const H=t=>`<div class="wbh"><span class="wbn">${i+1}</span><div><b>${esc(b.title||t)}</b></div></div>`;
  if(b.type==="rules")return {h:H("How to play")+`<ol class="wrules">${b.items.map(r=>`<li>${esc(r)}</li>`).join("")}</ol>${b.need.length?`<div class="winst">You need: ${esc(b.need.join(", "))}</div>`:""}`,k:""};
  if(b.type==="cards")return {h:H("Cut out the cards")+`<div class="wcards">${b.cards.map(c=>`<div class="wcard${c.job?" job":""}"><span>${esc(c.front)}</span>${c.back?`<small>${esc(c.back)}</small>`:""}</div>`).join("")}</div>`,k:""};
  return wsBlockP(b,seed,i)};
