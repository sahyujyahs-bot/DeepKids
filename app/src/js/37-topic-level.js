/* ---------- topic level: tags, summaries, ideas, related ---------- */
function tagsOfV0(u) {
  const T = [];
  const tag = (i) => ({
    board: i.board,
    txt: `${BOARDS[i.board] ? BOARDS[i.board].split(" ")[0] : "?"} · Class ${DATA.levels[i.level].cls} · ${i.book.replace(/ · Class \d+$/, "").replace(/ \(Class \d+\)$/, "")}${/^\d+$/.test(i.n) ? (i.board === "waldorf" ? " · Block " : " · Ch ") + i.n : ""}`,
    k: i.k,
    subj: i.subj,
  });
  if (u.board === "gen") {
    (u.gen.tags || []).forEach((k) => {
      const i = DATA.items.find((z) => z.k === k);
      if (i) T.push(tag(i));
    });
  } else if (u.board === "dk") {
    DATA.items.filter((i) => (i.dk || []).includes(u.n)).forEach((i) => T.push(tag(i)));
  } else {
    T.push(tag(u));
    const ids = u.dk || [];
    DATA.items
      .filter((i) => i.k !== u.k && i.board !== u.board && ids.some((d) => (i.dk || []).includes(d)))
      .slice(0, 4)
      .forEach((i) => T.push(tag(i)));
  }
  return T;
}
function tagsOf(u) {
  return tagsOfV0(u).map((t) => ({ ...t, txt: String(t.txt).replace(/^\?\s*·\s*/, "") }));
}
function subjectsOf(u) {
  const s = new Set([u.subj]);
  if (u.board === "gen") (u.gen.subjects || []).forEach((x) => SUBJ[x] && s.add(x));
  tagsOf(u).forEach((t) => s.add(t.subj));
  return [...s];
}
function summaryOf(u) {
  if (u.board === "gen") return u.gen.summary || "";
  if (u.board === "dk") return u.topic.summary;
  const T = tagsOf(u)
    .map((t) => DATA.items.find((i) => i.k === t.k))
    .filter(Boolean);
  const s = T.map((i) => i.c?.covers).filter(Boolean);
  return s.length
    ? [...new Set(s)].join(" ")
    : "Summary coming soon. (Placeholder: we collate this from every book that covers the topic.)";
}
function ideasOf(u) {
  if (u.board === "gen") return { sum: u.gen.plusSummary || "", ideas: (u.gen.ideas || []).map(String) };
  const x = u.c?.x;
  if (x) return { sum: x.oneness, ideas: x.deep.map((d) => d.q) };
  if (u.board === "dk") return { sum: u.topic.oneness, ideas: u.topic.sub.slice(0, 3) };
  return { sum: "", ideas: ["Placeholder: challenging ideas for this topic are being written."] };
}
function relatedOf(u) {
  const pool = allUnits(),
    ids = u.board === "dk" ? [u.n] : u.dk || [],
    pre = prereqOf(u)
      .map((k) => unitBy(k))
      .filter(Boolean)
      .slice(-2);
  let deeper = pool
    .filter((i) => i.k !== u.k && i.subj === u.subj && i.level > u.level && ids.some((d) => (i.dk || []).includes(d)))
    .slice(0, 3);
  if (!deeper.length && u.board !== "gen" && u.board !== "dk") {
    const us = DATA.items.filter((i) => i.board === u.board && i.subj === u.subj && i.book === u.book),
      j = us.findIndex((i) => i.k === u.k);
    deeper = us.slice(j + 1, j + 2);
  }
  const wider = [
    ...(u.board === "dk" ? [] : ids.map((d) => pool.find((i) => i.k === "dk|" + d)).filter(Boolean)),
    ...pool.filter((i) => i.k !== u.k && i.subj !== u.subj && ids.some((d) => (i.dk || []).includes(d))),
  ].slice(0, 4);
  const names = u.board === "gen" ? u.gen.related || {} : {};
  return { pre, deeper, wider, names };
}
const uchip = (v) =>
  `<button class="chip ${SC(v.subj)}" data-act="chapter" data-k="${v.k}"><span class="dotc"></span>${esc(v.title)}</button>`;
function topicOverview(u) {
  const m = modeOf(),
    T = tagsOf(u),
    I = ideasOf(u),
    R = relatedOf(u),
    sub = subjectsOf(u);
  let h = `<section class="card"><span class="eyebrow">Where this topic sits</span><div class="row">${T.length ? T.map((t) => `<span class="chip">${esc(t.txt)}</span>`).join("") : `<span class="chip">Not in a board syllabus · DeepKids topic</span>`}${sub.length > 1 ? sub.map((s) => `<span class="chip ${SC(s)}"><span class="dotc"></span>${SUBJ[s]}</span>`).join("") : ""}</div>
    <span class="eyebrow" style="margin-top:4px">Summary</span><p>${esc(summaryOf(u))}</p></section>`;
  h += `<section class="oneness"><span class="eyebrow">Big ideas</span>${I.sum ? `<p>${esc(I.sum)}</p>` : ""}<ul style="margin:8px 0 0;padding-left:20px;display:grid;gap:4px;font-weight:700">${I.ideas.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></section>`;
  if (m === "books")
    h += `<section class="card r-you tint"><b style="font:600 16px var(--display)">Lesson plans come with DeepKids Plus</b><p class="sm">Ready-made plans for full and busy days, big questions, worksheets and games. Switch in Settings.</p></section>`;
  if (u.board !== "gen" && u.board !== "dk" && m === "plus")
    h += `<section class="card"><span class="eyebrow">Suggested reading</span><p class="sm">${esc(u.book)}${chNo(u) ? ", " + chNo(u) : ""}${(u.c?.read || []).length ? "; " + u.c.read.map(esc).join("; ") : ""}</p></section>`;
  if (u.board === "gen" && (u.gen.books || []).length)
    h += `<section class="card" style="gap:0"><span class="eyebrow" style="margin-bottom:4px">Books to try</span>${u.gen.books
      .slice(0, 5)
      .map(
        (b) =>
          `<a class="res" href="${AZ((b.title || "") + " " + (b.author || ""))}" target="_blank" rel="noopener"><b>${esc(b.title)} ↗</b><span class="xs muted">${esc(b.author || "")}${b.why ? " · " + esc(b.why) : ""}</span></a>`,
      )
      .join("")}</section>`;
  if (R.pre.length || R.deeper.length || R.wider.length || Object.keys(R.names).length)
    h += `<section class="card"><span class="eyebrow">Related topics</span>${R.pre.length ? `<div><span class="xs muted">Needs first</span><div class="row">${R.pre.map(uchip).join("")}</div></div>` : ""}${R.deeper.length ? `<div><span class="xs muted">Go deeper</span><div class="row">${R.deeper.map(uchip).join("")}</div></div>` : ""}${R.wider.length ? `<div><span class="xs muted">Go wider</span><div class="row">${R.wider.map(uchip).join("")}</div></div>` : ""}${[
      "prereq",
      "deeper",
      "wider",
    ]
      .filter((k) => (R.names[k] || []).length)
      .map(
        (k) =>
          `<div><span class="xs muted">${{ prereq: "Needs first", deeper: "Go deeper", wider: "Go wider" }[k]}</span><div class="row">${R.names[
            k
          ]
            .slice(0, 4)
            .map((n) => `<button class="chip" data-act="tsearch" data-q="${esc(n)}">${esc(n)}</button>`)
            .join("")}</div></div>`,
      )
      .join("")}</section>`;
  return h;
}
function plansTab(u) {
  const ty = ui.ptype || "full",
    P = planOptions(u)[ty] || [],
    pk = ((S.planPick || {})[u.k] || {})[ty] || P[0]?.id;
  return `<div class="seg"><button aria-pressed="${ty === "full"}" data-act="ptype" data-t="full">Full day · 3 plans</button><button aria-pressed="${ty === "busy"}" data-act="ptype" data-t="busy">Busy day · 3 plans</button></div><p class="xs muted">Pick one for ${ty === "full" ? "full" : "busy"} days. The plans you don't pick come back as games, refreshers and jokes on other days.</p>
   ${P.map((o, i) => `<section class="card optcard ${o.id === pk ? "chosen" : ""}" style="--c:${PAL[(i + (ty === "busy" ? 3 : 0)) % PAL.length]}"><div class="sech"><b style="font:600 18px var(--display)">${esc(o.name)}</b>${o.id === pk ? `<span class="pill completed">Chosen</span>` : o.placeholder ? `<span class="pill">Placeholder</span>` : o.gen ? `<span class="pill learning">Claude draft</span>` : ""}</div><p class="sm">${esc(o.idea)}</p>${o.parts ? `<ol class="dsteps">${o.parts.map((p) => `<li><span>${esc(p.label)}</span><b>${esc(p.title)}</b><i>${p.mins ? p.mins + " min" : Math.round(p.f * 100) + "%"}</i></li>`).join("")}</ol>` : `<p class="xs muted">${sessionsFor(u)} lesson days, step by step.</p>`}${o.id !== pk ? `<button class="btn sm" data-act="ppick" data-k="${u.k}" data-t="${ty}" data-o="${o.id}" style="justify-self:start">Use this plan</button>` : ""}</section>`).join("")}`;
}
