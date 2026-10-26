/* ---------- One refresher: wrong answers from units join the daily refresher; finished units come back for review ---------- */
function fxRefs() {
  const F = fxSt();
  return Object.entries(F.ref || {})
    .map(([id, L]) => ({ id, n: (L || []).filter((r) => r.k).length }))
    .filter((x) => x.n && DATA.units?.[x.id]);
}
const FXGAP = [3, 10, 30, 60];
function fxReviews(date) {
  const R = S.fxRev || {};
  return Object.keys(DATA.units || {})
    .filter((id) => rank[fxUnitSt("unit|" + id)] >= 2)
    .map((id) => {
      const D = fxSt().done[id] || {},
        last = Object.keys(D)
          .filter((k) => k.startsWith("at:"))
          .map((k) => D[k])
          .sort()
          .pop(),
        r = R[id] || { n: 0, at: null },
        from = r.at || last;
      return from && Math.round((parse(date) - parse(from)) / 864e5) >= FXGAP[Math.min(r.n, 3)] ? { id, n: r.n } : null;
    })
    .filter(Boolean);
}

document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest("[data-fxprac]");
    if (b) {
      e.preventDefault();
      e.stopPropagation();
      fxPractise(b.dataset.fxprac);
      return;
    }
    const r = e.target.closest("[data-fxrev]");
    if (r) {
      const R = (S.fxRev = S.fxRev || {}),
        o = R[r.dataset.fxrev] || { n: 0 };
      R[r.dataset.fxrev] = { n: o.n + 1, at: today };
      save();
    }
  },
  true,
);
