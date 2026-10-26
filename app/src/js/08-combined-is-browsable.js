/* ---------- Combined is browsable; any chapter from any syllabus can be added from anywhere ---------- */
const combinedNote = () => {
  if (S.board !== "combined") return "";
  const L = DATA.combined?.sci?.[S.levels?.sci] || [],
    w = L.filter((e) => e.k).length;
  return `<section class="card r-out tint"><span class="eyebrow">DeepKids track · Class ${S.levels?.sci || 1}</span><p class="sm">Science this year covers <b>${L.length} topics</b> from NCERT, Cambridge and NIOS, each at the earliest class any board teaches it. <b>${w}</b> are written in full on the DeepKids track (stories, big ideas, open questions, games, Mission books). The rest use the best board chapter for now and switch over as they are written. Maths, English and Hindi follow NCERT until their topic ladders are ready.</p><button class="link sm" data-act="libcombined" style="justify-self:start">See the whole Combined ladder in the Library →</button></section>`;
};
function combinedBrowseV0() {
  const sj = "sci",
    cls = Object.keys(DATA.combined?.[sj] || {})
      .map(Number)
      .sort((a, b) => a - b),
    lv = cls.includes(ui.bl) ? ui.bl : cls.includes(S.levels?.sci) ? S.levels.sci : cls[0],
    L = (DATA.combined?.[sj] || {})[lv] || [];
  const row = (e) => {
    const u = e.k && unitByK(e.k),
      boards = [...new Set(e.boards.map((b) => BNAME[b.b] || b.b))].join(", ");
    if (u)
      return topicRow(u).replace(
        "</b><br>",
        `</b> <span class="pill completed" style="font-size:11px">Written in full</span><br>`,
      );
    return `<div class="topic ${SC(sj)}"><div class="trow plain"><span class="no">${esc((e.title || "?")[0])}</span><span style="min-width:0;flex:1;overflow-wrap:anywhere"><b>${esc(e.title)}</b><br><span class="xs muted">Taught by ${esc(boards)} in Class ${lv} · DeepKids version being written</span><div class="row chips" style="margin-top:4px;flex-wrap:wrap">${(
      e.use || []
    )
      .map((k) => {
        const v = unitByK(k);
        return v
          ? `<button class="chip" style="white-space:normal;text-align:left;height:auto;min-height:36px;line-height:1.3;padding:6px 12px" data-act="chapter" data-k="${k}">${esc(BNAME[v.board] || v.board)}: ${esc(v.title)}</button>`
          : "";
      })
      .join("")}</div></span></div></div>`;
  };
  return `<p class="xs muted">The Combined science ladder: every topic any board teaches in Class ${lv}, once, at the earliest class, deeper each year. ${L.filter((e) => e.k).length} of ${L.length} written in full on the DeepKids track; the others link to the board chapters used for now.</p>
   <div class="row chips">${cls.map((l) => `<button class="chip" aria-pressed="${lv === l}" data-act="bl" data-l="${l}">Class ${l}</button>`).join("")}</div>${L.map(row).join("")}`;
}
function combinedBrowse() {
  const h = combinedBrowseV0(),
    cls = Object.keys(DATA.combined?.sci || {})
      .map(Number)
      .sort((a, b) => a - b),
    lv = cls.includes(ui.bl) ? ui.bl : cls.includes(S.levels?.sci) ? S.levels.sci : cls[0],
    U = (DATA.combined?.sci?.[lv] || []).flatMap((e) => e.units || []);
  return U.length
    ? `<section class="card fxnew"><span class="eyebrow">DeepKids track · subtopic units</span><p class="sm">Subtopics written in full: scroll through them like a feed, with pictures, steps for you or your child, games, worksheets and a quiz.</p>${fxUnitBtns(U)}${fxSongBtns()}</section>` +
        h
    : h;
}

/* ---------- Combined lessons use their topic's Mission book and worksheets ---------- */
