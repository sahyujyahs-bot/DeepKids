/* ---------- The DeepKids-track planner ----------
   Each topic of the class is taught through its subtopic units (core path first). Units a board teaches that year
   ("required") come first, so every board's syllabus is covered by year end; DeepKids-only units follow, and the
   topic overview stands in for topics whose units are not written yet. */
function fxTrack(rungs, s, l) {
  const U = (id) => unitBy("unit|" + id),
    req = [],
    more = [],
    over = [];
  rungs.forEach((r) => {
    const L = (r.c?.units || [])
      .map((x) => x.id)
      .filter((id) => DATA.units?.[id])
      .sort((a, b) => (DATA.units[a].order || 0) - (DATA.units[b].order || 0));
    if (!L.length) {
      over.push(r);
      return;
    }
    L.forEach((id) => {
      const u = U(id);
      if (u) (DATA.units[id].req ? req : more).push(u);
    });
  });
  return [...req, ...over, ...more];
}
const fxReq = (u) => u?.board !== "unit" || !!DATA.units?.[u.c?.unit]?.req;
/* the school year: from the start date, ten months (a parent can set S.yearEnd) */
const fxYearEnd = () =>
  S.yearEnd ||
  iso(
    new Date(
      parse(S.start || today).getFullYear(),
      parse(S.start || today).getMonth() + 10,
      parse(S.start || today).getDate(),
    ),
  );
/* one sprint week each quarter: weeks 12, 25 and 38 from the start; only board-required lessons are planned that week */
function fxSprint(date) {
  const w = Math.floor((parse(date) - parse(S.start || today)) / (7 * 864e5));
  return S.board === "combined" && [12, 25, 38].includes(w);
}
function fxTake(queue, date) {
  if (fxSprint(date)) {
    const i = queue.findIndex((x) => fxReq(x.u));
    if (i > 0) return queue.splice(i, 1)[0];
  }
  return queue.shift();
}
/* year-end check: when will this subject's board-required lessons be done at the current pace? */
function fxCoverageNote() {
  if (S.board !== "combined") return "";
  const rows = S.subjects
    .map((s) => {
      const sc = schedule(s, 800),
        R = sc.filter((x) => fxReq(x.u) && x.u.level === S.levels[s]);
      if (!R.length) return "";
      const last = R[R.length - 1].date,
        end = fxYearEnd(),
        ok = last <= end;
      return `<li>${SUBJ[s]}: board topics done by <b>${fmt(last)}</b> ${ok ? "✔ before the year ends (" + fmt(end) + ")" : `⚠️ after the year ends (${fmt(end)}). Add a day or a few minutes a day in Pace, or the sprint weeks will catch up.`}</li>`;
    })
    .join("");
  return rows
    ? `<section class="sec"><div class="sech"><h3>On track for the year?</h3></div><ul class="xs">${rows}</ul><p class="xs muted">One week each quarter is a catch-up sprint: only board topics are planned that week.</p></section>`
    : "";
}
/* ongoing multi-day experiments and projects from units: today's check-in and its minutes */
function fxOngoing(date) {
  const out = [];
  Object.keys(DATA.units || {}).forEach((id) => {
    const D = fxSt().done[id] || {};
    (DATA.units[id].parts || []).forEach((p) => {
      if ((p[5] || 1) < 2) return;
      const s0 = D["start:" + p[0]];
      if (!s0 || s0 > date) return;
      const day = Math.round((parse(date) - parse(s0)) / 864e5) + 1;
      if (day > p[5] || fxPS(id, p) === "done") return;
      const t = (p[8] || []).find((x) => x[0] === day);
      out.push({
        title: `${p[1]} · day ${day} of ${p[5]}` + (t ? ": " + t[2] : ""),
        checks: [],
        mins: t ? +t[1] || 5 : 5,
        fx: id,
      });
    });
  });
  return out;
}
const fxOM = (open) => Math.min(30, 5 + open.filter((e) => e.fx).reduce((a, e) => a + e.mins, 0));
/* linked units: when a part is finished, the units it links to (a maths problem's maths unit, a project's units) join tomorrow's plan */

/* the DeepKids-track year plan (DATA.combined) lists topics in teaching order; each topic with written units is taught through
   them (board-required units in place, DeepKids-only units after the board topics) */
function fxExpand(base) {
  const out = [],
    more = [];
  base.forEach((r) => {
    const L =
      r.board === "combined"
        ? (r.c?.units || [])
            .map((x) => x.id)
            .filter((id) => DATA.units?.[id])
            .sort((a, b) => (DATA.units[a].order || 0) - (DATA.units[b].order || 0))
        : [];
    if (!L.length) {
      out.push(r);
      return;
    }
    L.forEach((id) => {
      const u = unitBy("unit|" + id);
      if (u) (DATA.units[id].req ? out : more).push(u);
    });
  });
  return [...out, ...more];
}

/* ---------- Warm-up: the jokes and song of the unit being studied (board chapters use their linked unit) ---------- */
function fxWarmUnit(date) {
  const L = lessonsOn(date || today).map((l) => l.u);
  let u = L.find((x) => x.board === "unit");
  if (u) return u.c.unit;
  for (const x of [...L, dailyUnit()].filter(Boolean)) {
    const r = (x.c?.units || []).find((y) => DATA.units?.[y.id]);
    if (r) return r.id;
  }
  return null;
}
