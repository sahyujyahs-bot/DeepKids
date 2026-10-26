/* ---------- Worksheets belong to topics, shared by every chapter on that topic in every board ---------- */
const TWN = () => DATA.wtopics || {};
function topicsOfV0(u) {
  const T = [];
  Object.entries(TWN()).forEach(([id, t]) => {
    if ((t.chapters || []).includes(u.k)) T.push(id);
  });
  (DATA.rconcepts || []).forEach((c) => {
    if (c.chapters.includes(u.k) && TWN()[c.id] && !T.includes(c.id)) T.push(c.id);
  });
  return T;
}
function topicsOf(u) {
  const T = topicsOfV0(u);
  if (u.board === "combined" && TWN()[u.n] && !T.includes(u.n)) T.push(u.n);
  return T;
}
function wsRank(u) {
  const p = profOf(u.subj === "dk" ? "dks" : u.subj),
    L = wsOf(u),
    di = PLV.indexOf(p.lvl),
    pref = {
      explore: ["play", "make", "game", "think"],
      deep: ["make", "play", "think", "game"],
      challenge: ["think", "make", "game", "play"],
    }[p.depth];
  return L.map((w, i) => ({
    w,
    i,
    score: Math.abs(PLV.indexOf(w.lvl || "core") - di) * 10 + pref.indexOf(w.kind),
  })).sort((a, b) => a.score - b.score || a.i - b.i);
}
const wsCur = (u) => (DATA.cws || {})[u.k] || [];
/* re-check the profile once a day */

document.addEventListener("change", (e) => {
  const s = e.target.dataset?.pauto;
  if (!s) return;
  S.prof = { ...(S.prof || {}), [s]: { ...((S.prof || {})[s] || {}), auto: e.target.checked } };
  save();
  render();
});
