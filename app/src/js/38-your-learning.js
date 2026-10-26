/* ---------- your learning: kept out of the way, opened on purpose ---------- */
function learnItems() {
  const out = [],
    seen = new Set(),
    seenT = new Set();
  [today, tomorrow()].forEach((d) =>
    lessonsOn(d).forEach((l) => {
      if (l.done || !l.n) return;
      prepFor(l.u, l.n, l.tot)
        .filter((p) => LEARNK.has(p.kind))
        .forEach((p) => {
          const tk = l.u.k + "|" + p.task;
          if (!seen.has(p.id) && !seenT.has(tk)) {
            seen.add(p.id);
            seenT.add(tk);
            out.push({ ...p, u: l.u, s: l.s, date: d });
          }
        });
    }),
  );
  return out;
}
function learnView() {
  document.getElementById("sheetTitle").textContent = "For you";
  const its = learnItems(),
    groups = [];
  its.forEach((p) => {
    let g = groups.find((g) => g.u.k === p.u.k);
    if (!g) groups.push((g = { u: p.u, s: p.s, items: [] }));
    g.items.push(p);
  });
  const help = (S.parent?.help || []).filter((s) => S.subjects.includes(s));
  return `<section class="card r-you tint"><h2 style="font-size:22px">Your learning</h2><p class="sm muted">Guides and reading to help you teach today and tomorrow. Nothing here is required.</p></section>
   ${
     groups
       .map((g) => {
         const guide =
           g.u.c?.x?.guide ||
           (g.u.board !== "dk" && g.u.board !== "gen" ? DATA.prepgen.guide[g.u.subj] : summaryOf(g.u));
         return `<section class="card ${SC(g.s)}"><div class="row" style="gap:8px">${sblob(g.s, "happy", "", 'width="32" height="32"')}<b style="font:600 17px var(--display)">${esc(g.u.title)}</b></div>${guide ? `<p class="sm">${esc(guide)}</p>` : ""}${g.items
           .filter((p) => p.kind !== "guide")
           .map(
             (p) =>
               `<div class="taskrow ${S.prep[p.id] ? "done" : ""}"><button class="ckb" data-act="prep" data-id="${p.id}" aria-label="Done: ${esc(p.task)}">${icon("check")}</button><div><b style="font-weight:800">${esc(p.task)}</b><p class="xs muted">From: ${esc(p.where)}</p></div></div>`,
           )
           .join(
             "",
           )}<button class="btn soft sm" data-act="chapter" data-k="${g.u.k}" style="justify-self:start">Open the topic</button></section>`;
       })
       .join("") || `<p class="note">Nothing to read for today or tomorrow.</p>`
   }
   ${help.length ? `<section class="card"><span class="eyebrow">Subjects you asked for help with</span>${help.map((s) => `<p class="sm"><b>${SUBJ[s]}:</b> ${esc(DATA.prepgen.guide[s])}</p>`).join("")}</section>` : ""}`;
}
