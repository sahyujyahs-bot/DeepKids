/* ---------- What counts as done (the founder's rule: finished only when really done) ----------
   A part is done when it has been worked through to its last card AND every question the app checks in it is answered,
   or when a parent marks paper work done. A multi-day experiment or project stays ongoing until its last day.
   Reached the end with questions left = pending. Opened, or some answers given = ongoing. */
const fxDaysSince = (d) => Math.round((parse(today) - parse(d)) / 864e5);
function fxPSV0(id, p) {
  const F = fxSt(),
    D = F.done[id] || {},
    T = (F.time[id] || {})[p[0]] || 0;
  if (D["man:" + p[0]]) return "done";
  let a = 0;
  if (p[6]) for (const k in D) if (k.startsWith("q:" + p[6])) a++;
  const reached = !!D["sec:" + p[0]],
    ok = a >= (p[4] || 0);
  if (reached && ok) {
    if ((p[5] || 1) > 1) {
      const s0 = D["start:" + p[0]];
      if (!s0 || fxDaysSince(s0) < p[5] - 1) return "going";
    }
    return "done";
  }
  if (reached) return "pending";
  if (T > 0 || a > 0) return "going";
  return "none";
}
function fxPS(id, p) {
  const x = fxPSV0(id, p);
  return x === "none" && (fxSt().done[id] || {})["open:" + p[0]] ? "going" : x;
}
function fxStates(id) {
  const I = DATA.units?.[id] || {},
    P = I.parts || [],
    S0 = P.map((p) => fxPS(id, p)),
    sp = I.spine?.length ? I.spine : P.map((p) => p[0]),
    pos = (x) => sp.indexOf(x),
    last = Math.max(-1, ...sp.map((x, j) => (S0[P.findIndex((p) => p[0] === x)] === "done" ? j : -1)));
  return S0.map((x, i) => (x === "none" && pos(P[i][0]) >= 0 && pos(P[i][0]) < last ? "pending" : x));
} // a core-path part skipped while a later core part was finished = pending; Go deeper parts are optional
function fxUnitSt(k) {
  const id = k.slice(5),
    I = DATA.units?.[id];
  if (!I) return S.progress[k]?.status || "none";
  const P = I.parts || [],
    X = fxStates(id),
    sp = new Set(I.spine?.length ? I.spine : P.map((p) => p[0]));
  if (X.length && X.every((x) => x === "done")) return "mastered";
  if (P.every((p, i) => !sp.has(p[0]) || X[i] === "done")) return "completed";
  return X.some((x) => x !== "none") ? "learning" : "none";
}
function fxSessionsDone(k) {
  const u = unitBy(k);
  if (!u) return 0;
  const X = fxStates(k.slice(5)),
    P = fxParts(u),
    ok = (p) => X[P.findIndex((q) => q[0] === p[0])] === "done";
  let n = 0;
  for (const d of fxSpineDays(u)) {
    if (d.every(ok)) n++;
    else break;
  }
  return n;
}
function fxStampV0(id) {
  const F = fxSt(),
    D = (F.done[id] = F.done[id] || {});
  let ch = 0;
  (DATA.units?.[id]?.parts || []).forEach((p) => {
    if (!D["at:" + p[0]] && fxPS(id, p) === "done") {
      D["at:" + p[0]] = today;
      ch = 1;
    }
  });
  if (ch) save();
}
function fxStamp(id) {
  const F = fxSt(),
    D = F.done[id] || {},
    before = new Set(Object.keys(D).filter((k) => k.startsWith("at:")));
  fxStampV0(id);
  const D2 = F.done[id] || {};
  let added = 0;
  (DATA.units?.[id]?.parts || []).forEach((p) => {
    if (before.has("at:" + p[0]) || !D2["at:" + p[0]]) return;
    (p[7] || []).forEach((lk) => {
      if (!DATA.units?.[lk]) return;
      const k = "unit|" + lk,
        s = lk.split(".")[0];
      if (!S.subjects.includes(s)) return;
      if (rank[st(k)] >= 2) return;
      S.extra = { ...(S.extra || {}), [s]: [...new Set([...((S.extra || {})[s] || []), k])] };
      S.next = { ...(S.next || {}), [s]: [k, ...((S.next || {})[s] || []).filter((x) => x !== k)] };
      added = 1;
      toast(`Linked lesson added to tomorrow: ${DATA.units[lk].title}`, 5000);
    });
  });
  if (added) setTimeout(commit, 0);
}
const FXWT = {
  worksheets: "ws",
  quiz: "qz",
  experiments: "exp",
  projects: "proj",
  activities: "act",
  games: "act",
  challenges: "act",
};
/* unit parts join the app's Started, Pending and History lists */

/* hooks: stamp the date a part is finished; note the first day of a multi-day experiment or project */

/* paper work: a parent can mark a worksheet done when it was done on paper */
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest('[data-fx="paper"]');
    if (!b || !FXU) return;
    e.preventDefault();
    e.stopPropagation();
    const D = (fxSt().done[FXU.id] = fxSt().done[FXU.id] || {});
    D["man:" + b.dataset.id] = 1;
    D["sec:" + b.dataset.id] = 1;
    fxStamp(FXU.id);
    save();
    b.textContent = "✔ Marked done";
    b.disabled = true;
    toast("Marked done. It moves to History.");
  },
  true,
);
