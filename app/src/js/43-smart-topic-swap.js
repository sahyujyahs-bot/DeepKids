/* ---------- smart topic swap ---------- */
function prereqOf(u) {
  if (u.board === "gen") return [];
  if (u.board === "dk") {
    const g = DATA.topics.filter((t) => t.q === u.topic.q),
      first = g[0];
    return first.id === u.topic.id ? [] : ["dk|" + first.id];
  }
  if (u.subj === "math") {
    const us = DATA.items.filter((x) => x.board === u.board && x.book === u.book && x.subj === "math"),
      i = us.findIndex((x) => x.k === u.k);
    return us.slice(0, i).map((x) => x.k);
  }
  return [];
}
function swapView() {
  const s = ui.sheet.s,
    cur = nextUp(s);
  document.getElementById("sheetTitle").textContent = "Swap " + SUBJ[s] + " topic";
  const us = plannedUnits(s).filter((u) => u.level === S.levels[s] && rank[coverage(u)] < 2);
  const rows = us.map((u) => {
    const need = prereqOf(u).filter((k) => rank[coverage(unitBy(k) || { k }) || "none"] < 2 && rank[st(k)] < 2);
    return { u, need };
  });
  return `<p class="sm muted">${s === "math" ? "Maths builds on itself, so a chapter opens once the chapters before it are done." : s === "sci" && S.plus ? "Each big question opens with its first topic. After that, its topics can go in any order." : "These chapters don't depend on each other, so any order works."}</p>
   <section class="card" style="gap:0">${rows
     .map(({ u, need }) => {
       const isCur = cur && cur.u.k === u.k,
         ok = !need.length;
       return `<div class="taskrow ${SC(u.subj)}"><span class="unit" style="all:unset"><span class="no" style="width:40px;height:40px;border-radius:13px;display:grid;place-items:center;font:700 15px var(--display);background:var(--c)">${/^\d+$/.test(u.n) ? u.n : esc(u.n)}</span></span><div><b style="font:600 16px var(--display)">${esc(u.title)}</b><p class="xs muted">${coverage(u) === "learning" ? `In progress · Part ${done(u.k)} of ${sessionsFor(u)}` : `${sessionsFor(u)} lesson days`}${
         ok
           ? ""
           : ` · first: ${need
               .map((k) => esc(unitBy(k)?.title || k))
               .slice(0, 2)
               .join(", ")}`
       }</p><div class="meta">${isCur ? `<span class="pill learning">Up next</span>` : ok ? `<button class="btn xs" data-act="pin" data-s="${s}" data-k="${u.k}">Do this next</button>` : `<span class="pill">Locked</span>`}</div></div></div>`;
     })
     .join("")}</section>`;
}
