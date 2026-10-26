/* ---------- fixes from the founder's test ---------- */
/* Today: no separate date bar; the greeting already says the date */

/* opening a part counts as started straight away (it goes to Plan > To finish > Started) */

/* Add to plan: make sure the subject is in the plan, and show where it went */
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest('[data-act="fxq"]');
    if (!b) return;
    const s = b.dataset.s;
    if (!S.subjects.includes(s)) {
      S.subjects = [...S.subjects, s];
      S.levels = { ...S.levels, [s]: S.levels[s] || 3 };
    }
    ui.qs = s;
    ui.tq = "les";
  },
  true,
);
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest("[data-fxsee]");
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    ui.qs = b.dataset.fxsee;
    ui.tq = "les";
    ui.seg = { ...(ui.seg || {}), week: "next" };
    ui.flash = b.dataset.k;
    tab = "week";
    render();
    scrollTo(0, 0);
  },
  true,
);

/* "Later today" visibly moves the item: it shows at its new time with a note, and sorts there */

/* empty inputs say what to do instead of doing nothing */
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest('[data-act="tfind"],[data-act="invnew"]');
    if (!b) return;
    const id = b.dataset.act === "tfind" ? "tq" : "invName",
      v = (document.getElementById(id)?.value || "").trim();
    if (!v) {
      e.preventDefault();
      e.stopPropagation();
      sfx("no");
      toast(
        b.dataset.act === "tfind" ? "Type a topic to search for, like volcanoes" : "Type the name of the thing first",
      );
      document.getElementById(id)?.focus();
    }
  },
  true,
);
/* Practise again: every finished unit and chapter, plus every question answered wrongly anywhere */
function fxPractiseAll() {
  const U = fxRefs(),
    done = Object.keys(DATA.units || {}).filter((id) => rank[fxUnitSt("unit|" + id)] >= 2),
    R = S.fxRev || {},
    L = learnedUnits().filter((u) => u.board !== "unit" && rank[coverage(u)] >= 2);
  const due = (id) => {
    const r = R[id] || { n: 0 };
    const D = fxSt().done[id] || {},
      last =
        r.at ||
        Object.keys(D)
          .filter((k) => k.startsWith("at:"))
          .map((k) => D[k])
          .sort()
          .pop();
    return last ? addDays(last, FXGAP[Math.min(r.n, 3)]) : today;
  };
  const w = U.length
    ? `<p class="xs"><b>Questions to try again</b></p>${U.map((x) => `<div class="row" style="justify-content:space-between"><span class="sm">${esc(DATA.units[x.id].title)} · ${x.n} question${x.n > 1 ? "s" : ""}</span><button class="btn sm" data-fxprac="${esc(x.id)}">Try them</button></div>`).join("")}`
    : "";
  const d =
    done.length || L.length
      ? `<p class="xs" style="margin-top:10px"><b>Finished, to keep fresh</b></p>${done
          .map((id) => {
            const dd = due(id);
            return `<div class="row" style="justify-content:space-between"><span class="sm">${esc(DATA.units[id].title)} · <span class="muted">${dd <= today ? "due now" : "next review " + fmt(dd)}</span></span><button class="btn soft sm" data-act="fxpart" data-fxrev="${esc(id)}" data-u="${esc(id)}" data-p="quiz">Review</button></div>`;
          })
          .join(
            "",
          )}${L.map((u) => `<div class="row" style="justify-content:space-between"><span class="sm">${esc(chT(u))}</span><button class="btn soft sm" data-act="chapter" data-k="${u.k}">Review</button></div>`).join("")}`
      : "";
  return w || d
    ? `<section class="card">${w}${d}<p class="xs muted">The daily plan takes about ${RFS().mins} minutes from this list, most due first.</p></section>`
    : `<section class="card"><b>Nothing to practise yet</b><p class="sm muted">When your child gets a question wrong anywhere, or finishes a unit or chapter, it comes here to practise and review.</p></section>`;
}
/* History: every finished part, named clearly (lesson parts of board chapters too, not only whole chapters) */

// To finish: units show all parts and the core path separately

boot();
