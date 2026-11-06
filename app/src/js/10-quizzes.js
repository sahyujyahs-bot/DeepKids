/* Question bank, quick quizzes, the refresher, jokes and games */
const qid = (k, q) => {
  let h = 0;
  const s = k + "|" + q;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return "q" + (h >>> 0).toString(36);
};
function qBank(u) {
  const P = u.c?.p,
    out = [],
    seen = new Set(),
    add = (o) => {
      const id = qid(u.k, o.q);
      if (seen.has(id)) return;
      seen.add(id);
      out.push({ k: u.k, id, ...o });
    };
  if (P) {
    (P.check || []).forEach((c) => add({ q: c.q, a: c.a, why: c.why, kind: "open" }));
    (P.words || []).forEach(([w, m]) => add({ q: `What does “${w}” mean?`, a: m, kind: "open", rote: true }));
    (P.worksheets || []).forEach((w) =>
      w.sections.forEach(([, its]) =>
        its.forEach((it) => {
          if (it.t === "mcq" && Array.isArray(it.opts) && Number.isInteger(it.a) && it.opts[it.a] != null)
            add({ q: it.p, opts: it.opts, ans: it.a, a: String(it.opts[it.a]), why: it.why, kind: "mcq" });
          else if (it.t === "fill" && it.a?.length)
            add({ q: it.p, a: it.a.join(" / "), why: it.why, kind: "open", rote: true });
          else if (it.t === "match" && it.pairs?.length)
            it.pairs
              .slice(0, 3)
              .forEach(([x, y]) =>
                add({ q: `${String(it.p).replace(/\.$/, "")}: ${x}?`, a: String(y), kind: "open", rote: true }),
              );
        }),
      ),
    );
  }
  (u.c?.x?.quiz || []).forEach(([s, t, why]) =>
    add({
      q: s,
      kind: "tf",
      opts: ["True", "False"],
      ans: t ? 0 : 1,
      a: (t ? "True" : "False") + (why ? ". " + why : ""),
    }),
  );
  (S.qgen?.[u.k] || []).forEach((o) => add({ ...o, kind: o.opts ? "mcq" : "open", gen: true }));
  return out;
}
function learnedUnits() {
  const ks = new Set([
    ...S.log.map((l) => l.key),
    ...Object.keys(S.progress || {}).filter(
      (k) => (S.progress[k].sessions || 0) > 0 || rank[S.progress[k].status] >= 2,
    ),
  ]);
  return [...ks].map(unitByK).filter((u) => u && S.subjects.includes(u.subj) && !bookScience(u));
}
// on the DeepKids track, science quizzes and refreshers come from DeepKids lessons, never from a board book's chapter
const bookScience = (u) =>
  S.board === "combined" && u.subj === "sci" && ["ncert", "cambridge", "nios"].includes(u.board);
/* every answer to every question, from part quizzes, quick quizzes and refreshers; the latest one counts */
function lastAnswers() {
  const M = {};
  Object.entries(S.quiz || {}).forEach(([kk, o]) => {
    const k = kk.slice(0, kk.lastIndexOf("|"));
    Object.values(o || {}).forEach((x) => {
      if (x && x.q != null) {
        const id = qid(k, x.q);
        if (!M[id] || (x.d || "") >= (M[id].d || "")) M[id] = { k, q: x.q, a: x.a, r: x.r, d: x.d || "" };
      }
    });
  });
  Object.entries(S.qa || {}).forEach(([id, x]) => {
    if (!M[id] || (x.d || "") >= (M[id].d || "")) M[id] = x;
  });
  return M;
}
function qRecord(o, r) {
  S.qa = S.qa || {};
  const p = S.qa[o.id];
  S.qa[o.id] = { k: o.k, q: o.q, a: o.a, r: r ? 1 : 0, d: today, n: (p?.n || 0) + 1, w: (p?.w || 0) + (r ? 0 : 1) };
}
/* Not grasped: a question's latest answer is wrong. Mastered: chapter done, all its work done, nothing wrong. Grasped: the rest */
function masteryOf(u, M) {
  if (Object.values(M).some((x) => x.k === u.k && x.r === 0)) return "not";
  const P = u.c?.p;
  let all = rank[statusOf(u.k)] >= 2;
  if (all && P) {
    const its = [
      ...(P.worksheets || []).map((w) => ["ws", w.id]),
      ...[...(P.experiments || []), ...(P.activities || [])].map((e) => [wType(u, e.id), e.id]),
      ...P.days.filter((d) => quizQ(u, d.n).length).map((d) => ["qz", "q" + d.n]),
    ];
    all = its.every(([t, id]) => ["done", "skip"].includes(itemState(t, u, id)));
  }
  return all ? "mastered" : "grasped";
}
function masteryLists() {
  const M = lastAnswers(),
    L = { not: [], grasped: [], mastered: [] };
  learnedUnits().forEach((u) => L[masteryOf(u, M)].push(u));
  return L;
}
const MGN = { not: "Not grasped yet", grasped: "Grasped", mastered: "Mastered" };
const RFDEF = { mastered: { every: 10 }, mins: 45, days: [0, 1, 2, 3, 4, 5, 6] };
function RFS() {
  const s = S.rfs || {};
  return {
    mastered: { ...RFDEF.mastered, ...(s.mastered || {}) },
    mins: s.mins || RFDEF.mins,
    days: s.days || RFDEF.days,
  };
}
const hsh = (s) => {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};
/* The refresher. Every unit a child has completed comes back until they have answered 5 of its questions right: then it is
   mastered, and only returns every few days to keep fresh. A unit whose refresher was started and not finished comes first
   the next day, then the completed ones that are not mastered. A day's refresher is at most 20 questions, 5 from each of up
   to 4 units, taking turns across the subjects. Questions test ideas: no word meanings, fill-ins or matching. */
const RF_PER = 5,
  RF_MAX = 20;
const rfIsDk = (k) => k.startsWith("unit|");
const rfRight = (k) => Object.values(S.rfq || {}).filter((x) => x.k === k && x.r === 1).length;
const rfTitle = (k) => {
  const u = unitByK(k);
  return u ? chT(u) : k;
};
// the units with a refresher to do: g is open (started, not finished), learn (completed, not mastered) or keep (mastered,
// due to keep fresh)
function rfQueue(date) {
  const M = S.rfm || {},
    gap = RFS().mastered.every,
    seen = new Set(),
    out = [];
  const add = (k, subj, completed) => {
    if (seen.has(k) || !S.subjects.includes(subj)) return;
    seen.add(k);
    const m = M[k] || {},
      right = rfRight(k),
      g = m.open ? "open" : right >= RF_PER ? "keep" : completed ? "learn" : null;
    if (!g) return;
    if (g === "keep" && m.last && Math.round((parse(date) - parse(m.last)) / 864e5) < gap) return;
    if (!rfIsDk(k) && !qBank(unitByK(k) || {}).some((x) => !x.rote)) return;
    out.push({ k, subj, g, right, last: m.last || "" });
  };
  Object.keys(DATA.units || {}).forEach(
    (id) => rank[fxUnitSt("unit|" + id)] >= 2 && add("unit|" + id, id.split(".")[0], true),
  );
  learnedUnits().forEach((u) => u.board !== "unit" && rank[statusOf(u.k)] >= 2 && add(u.k, u.subj, true));
  Object.keys(M).forEach((k) => M[k].open && add(k, rfIsDk(k) ? k.slice(5).split(".")[0] : unitByK(k)?.subj, false));
  const ord = { open: 0, learn: 1, keep: 2 };
  return out.sort(
    (a, b) =>
      ord[a.g] - ord[b.g] ||
      a.right - b.right ||
      (a.last < b.last ? -1 : a.last > b.last ? 1 : 0) ||
      hsh(date + a.k) - hsh(date + b.k),
  );
}
// the units for a day: up to 4 (fewer when the daily time is short), taking turns across the subjects
function rfPick(date) {
  const Q = rfQueue(date),
    subs = S.subjects.filter((s) => Q.some((x) => x.subj === s)),
    by = Object.fromEntries(subs.map((s) => [s, Q.filter((x) => x.subj === s)])),
    max = Math.max(1, Math.min(RF_MAX / RF_PER, Math.round(RFS().mins / 10))),
    off = subs.length ? Math.floor(parse(date) / 864e5) % subs.length : 0,
    order = [...subs.slice(off), ...subs.slice(0, off)],
    pick = [];
  while (pick.length < max && order.some((s) => by[s].length))
    for (const s of order) {
      const x = pick.length < max && by[s].shift();
      if (x) pick.push(x);
    }
  return pick;
}
// the questions a DeepKids unit can give: the ones the child got wrong first, then its quiz and worksheet questions that can
// be answered by choosing
function rfDkQuestions(u, k) {
  const wrong = (fxSt().ref[u.id] || []).filter((r) => r.k).map((r) => r.k),
    all = [...wrong.map((kk) => [kk, fxFindItem(u, kk)]), ...fxDeepItems(u).map((x) => [x.k, x.it])],
    seen = new Set(),
    out = [];
  for (const [kk, it] of all) {
    if (!it || seen.has(kk)) continue;
    seen.add(kk);
    let o = null;
    if (it.t === "mcq" && Array.isArray(it.opts) && Number.isInteger(it.a))
      o = { opts: it.opts, ans: it.a, a: String(it.opts[it.a]) };
    else if (it.t === "truefalse") o = { opts: ["True", "False"], ans: it.a ? 0 : 1, a: it.a ? "True" : "False" };
    if (o) out.push({ id: qid(k, it.p), k, q: it.p, ...o, why: it.why, kind: "mcq", fx: kk });
  }
  return out;
}
// the questions a book chapter can give: wrong ones first, then new ones, then the rest
function rfBookQuestions(u, date) {
  const M = lastAnswers(),
    pri = (x) => (M[x.id]?.r === 0 ? 0 : M[x.id] ? 2 : 1);
  return qBank(u)
    .filter((x) => !x.rote)
    .sort((a, b) => pri(a) - pri(b) || hsh(date + a.id) - hsh(date + b.id));
}
// today's refresher, built once: its questions are kept, and each unit in it is marked as started
async function rfBuild(date) {
  if (S.rfp?.[date]?.built) return S.rfp[date];
  const picks = rfPick(date),
    spare = rfQueue(date).filter((x) => !picks.some((p) => p.k === x.k)),
    slots = [],
    topics = [],
    used = new Set();
  const take = async (x) => {
    let L = [];
    try {
      L = rfIsDk(x.k) ? rfDkQuestions(await fxLoad(x.k.slice(5)), x.k) : rfBookQuestions(unitByK(x.k), date);
    } catch (e) {}
    L = L.filter((y) => !used.has(y.id)).slice(0, RF_PER);
    L.forEach((y) => {
      used.add(y.id);
      slots.push({ ty: "qz", k: x.k, g: x.g, q: y });
    });
    if (L.length) topics.push({ k: x.k, g: x.g });
  };
  for (const x of picks) await take(x);
  for (const x of spare) if (slots.length < RF_PER) await take(x); // never fewer than 5 questions in all
  if (!slots.length) return null;
  S.rfm = S.rfm || {};
  topics.forEach((t) => {
    const prev = S.rfm[t.k] || {};
    S.rfm[t.k] = { ...prev, open: date, ids: slots.filter((s) => s.k === t.k).map((s) => s.q.id) };
  });
  const n = new Set(topics.map((t) => (rfIsDk(t.k) ? t.k.slice(5).split(".")[0] : unitByK(t.k)?.subj))).size;
  S.rfp = {
    ...(S.rfp || {}),
    [date]: {
      date,
      built: true,
      mins: slots.length * 2,
      topics,
      slots: slots.slice(0, RF_MAX),
      title: "Quick revision quiz",
      sub: `${slots.length} questions from ${topics.length} unit${topics.length > 1 ? "s" : ""}, ${n} subject${n > 1 ? "s" : ""}`,
    },
  };
  save();
  return S.rfp[date];
}
// what the Today list shows: today's built refresher, or what it will be
function rfPlan(date) {
  const p = S.rfp?.[date];
  if (p?.built) return p;
  if (date < today) return null;
  const picks = rfPick(date);
  if (!picks.length) return null;
  const n = Math.min(RF_MAX, picks.length * RF_PER);
  return {
    date,
    mins: n * 2,
    topics: picks.map((x) => ({ k: x.k, g: x.g })),
    slots: [],
    title: "Quick revision quiz",
    sub: `${n} questions from ${picks.length} unit${picks.length > 1 ? "s" : ""}`,
    lazy: true,
  };
}
// a refresher answer: kept for each question. A unit's refresher is finished when all its questions are answered, and the unit
// is mastered at 5 right
function rfRecord(q, ok) {
  S.rfq = { ...(S.rfq || {}), [q.id]: { k: q.k, r: ok ? 1 : 0, d: today } };
  if (q.fx && ok) {
    const id = q.k.slice(5);
    fxSt().ref[id] = (fxSt().ref[id] || []).filter((r) => (r.k || r) !== q.fx);
  }
  const m = (S.rfm || {})[q.k];
  if (m?.open && (m.ids || []).every((id) => S.rfq[id] && S.rfq[id].d >= m.open))
    S.rfm[q.k] = { ...m, open: null, last: today };
}
function qCard(q, state) {
  const res = state?.r,
    ch = state?.c;
  window._qmap = window._qmap || {};
  window._qmap[q.id] = q;
  const opts = q.opts
    ? `<div class="col" style="gap:6px">${q.opts.map((o, i) => `<button class="btn sm qopt ${res == null ? "soft" : i === q.ans ? "green" : i === ch ? "bad" : "line"}" data-act="qans" data-id="${q.id}" data-c="${i}" ${res != null ? "disabled" : ""}>${esc(String(o))}</button>`).join("")}</div>`
    : "";
  const open = !q.opts
    ? res == null
      ? `<details><summary class="sm muted">Show the answer</summary><p class="sm">${esc(q.a)}</p></details><div class="row" style="gap:6px"><button class="btn xs accent" data-act="qans" data-id="${q.id}" data-r="1">Got it</button><button class="btn xs soft" data-act="qans" data-id="${q.id}" data-r="0">Not yet</button></div>`
      : `<p class="sm"><b>Answer:</b> ${esc(q.a)}</p>`
    : "";
  return `<div class="qcard"><b class="h5">${esc(q.q)}</b>${opts}${open}${res != null ? `<p class="sm qwhy"><b>${res ? "✓ Right." : "✗ Not yet."}</b>${q.opts ? ` The answer: ${esc(q.a)}.` : ""}${q.why ? ` ${esc(q.why)}` : ""}</p>` : ""}</div>`;
}
/* Quick quiz: any time, on lessons done */
function quizPool(s, focus) {
  const M = lastAnswers(),
    U = learnedUnits().filter((u) => s === "all" || u.subj === s),
    B = U.flatMap(qBank),
    g = Object.fromEntries(U.map((u) => [u.k, masteryOf(u, M)]));
  if (focus === "not") return B.filter((q) => g[q.k] === "not");
  if (focus === "even") return B;
  const w = (q) => (M[q.id]?.r === 0 ? 0 : g[q.k] === "not" ? 1 : !M[q.id] ? 2 : 3);
  return B.slice().sort((a, b) => w(a) - w(b));
}
// before any lesson is done: the level quiz, to check each subject's class (the same one as in set-up)
function lvqOffer() {
  const L = S.subjects.filter(fxHasPQ),
    r = ui.lvqDone;
  if (!L.length) return "";
  return `<section class="card"><b class="h5">Check ${esc(S.child || "your child")}'s level</b><p class="sm">A 2-minute quiz per subject. It finds the class your child is at now, so the plan starts in the right place.</p>${r ? `<p class="sm"><b>${SUBJ[r.s]}: Class ${r.lvl}.</b> ${r.lvl === S.levels[r.s] ? "That's the class the plan already uses." : `The plan uses Class ${S.levels[r.s]}.`}</p>${r.lvl !== S.levels[r.s] ? `<button class="btn sm" data-act="lvqset" data-s="${r.s}" data-l="${r.lvl}">Use Class ${r.lvl} for ${SUBJ[r.s]}</button>` : ""}` : ""}<div class="row">${L.map((s) => `<button class="btn soft sm" data-act="lvq" data-s="${s}">${SUBJ[s]}</button>`).join("")}</div></section>`;
}
function quizzView() {
  setSheetTitle("Quick quiz");
  if (ui.lvq) return lvqCard(ui.lvq, 'data-act="lvqa" data-v');
  if (ui.qrun) return quizRunView();
  if (ui.qzv) return quizPastView();
  const Z = (ui.qz = ui.qz || { s: "all", by: "n", n: 10, m: 10, focus: "mix" }),
    U = learnedUnits(),
    cnt = (s) => U.filter((u) => s === "all" || u.subj === s).flatMap(qBank).length,
    L = masteryLists(),
    seg = (key, vals, lab) =>
      `<div class="seg">${vals.map((v) => `<button aria-pressed="${Z[key] === v}" data-act="qzset" data-key="${key}" data-v="${v}">${lab(v)}</button>`).join("")}</div>`;
  const noBank = S.subjects.filter((s) => U.some((u) => u.subj === s) && !cnt(s));
  return `<p class="sm muted">Questions from every lesson you've done. Ask aloud; your child answers, then you check. Results are saved for the transcript, and anything not yet grasped goes into the refresher.</p>
   <section class="card"><span class="eyebrow">Subjects</span><div class="row chips">${["all", ...S.subjects].map((s) => `<button class="chip" aria-pressed="${Z.s === s}" data-act="qzset" data-key="s" data-v="${s}">${s === "all" ? "All subjects" : SUBJ[s]} <small>${cnt(s)}</small></button>`).join("")}</div>
    <span class="eyebrow">How long</span>${seg("by", ["n", "m"], (v) => (v === "n" ? "Number of questions" : "Minutes"))}${Z.by === "n" ? seg("n", [5, 10, 15, 20], (v) => v + " questions") : seg("m", [5, 10, 15, 20], (v) => v + " min")}
    <span class="eyebrow">Which questions</span>${seg("focus", ["mix", "not", "even"], (v) => ({ mix: "Weak spots first", not: "Only not grasped", even: "Everything" })[v])}
    <button class="btn accent" data-act="qzstart" ${cnt(Z.s) ? "" : "disabled"}>Start the quiz</button>
    ${!U.length ? `<p class="xs muted">Do a lesson or two first. Questions come from lessons you've done.</p>` : !cnt(Z.s) ? `<p class="xs muted">No questions yet for this choice.</p>` : ""}</section>${!U.length ? lvqOffer() : ""}
   ${noBank.length ? `<section class="card"><b>${noBank.map((s) => SUBJ[s]).join(", ")}: no questions yet</b><p class="xs muted">These chapters don't have quiz questions in DeepKids yet.</p>${SAMPLE ? `<button class="btn soft sm" data-act="qgen" ${ui.qgen ? "disabled" : ""}>${ui.qgen ? "Writing questions…" : "Write questions with Claude"}</button>` : `<p class="xs muted">With DeepKids Plus, Claude writes questions for them.</p>`}</section>` : ""}
   <section class="card"><div class="sech"><b class="h5">How it's sticking</b><button class="link" data-act="rfset">Lists and refresher settings</button></div><div class="row">${["not", "grasped", "mastered"].map((g) => `<span class="pill mg-${g}">${MGN[g]} · ${L[g].length}</span>`).join("")}</div></section>
   ${
     (S.qzr || []).length
       ? `<section class="sec"><div class="sech"><h3 class="fs5">Past quizzes</h3></div>${(S.qzr || [])
           .slice()
           .reverse()
           .slice(0, 12)
           .map(
             (r) =>
               `<button class="menurow" data-act="qzpast" data-id="${r.id}"><span style="font-size:var(--fs-7)">🎯</span><span><b>${r.score} of ${r.items.length} right</b><br><span class="xs muted">${esc(fmt(r.date))} · ${esc(r.s === "all" ? "All subjects" : SUBJ[r.s] || "")}</span></span>${icon("next")}</button>`,
           )
           .join("")}</section>`
       : ""
   }`;
}
// a quiz left half-way waits in To finish until it is finished
function qzKeep() {
  const R = ui.qrun;
  if (R && !R.saved && R.i < R.qs.length && R.res.length)
    S.qzopen = { date: today, run: { ...R, cur: null, end: null } };
}
function quizRunView() {
  const R = ui.qrun,
    q = R.qs[R.i],
    left = R.end ? Math.max(0, Math.round((R.end - Date.now()) / 1000)) : null,
    over = R.i >= R.qs.length || left === 0;
  if (over && !R.res.length) {
    if (!R.saved) {
      R.saved = true;
    }
    return `<p class="note">${left === 0 ? "Time's up before any question was answered." : "Stopped before any question was answered."} Nothing was saved.</p><div class="row"><button class="btn accent" data-act="qzagain">Try again</button><button class="btn line" data-act="qzend">Done</button></div>`;
  }
  if (over) {
    if (!R.saved) {
      R.saved = true;
      setTimeout(celebrate, 200);
      delete S.qzopen;
      const items = R.res.map((x) => ({ k: x.q.k, q: x.q.q, a: x.q.a, r: x.r, c: x.c }));
      S.qzr = [
        ...(S.qzr || []),
        {
          id: newId(),
          date: today,
          s: R.s,
          by: R.by,
          items,
          score: items.filter((x) => x.r).length,
        },
      ];
      save();
    }
    const wrong = R.res.filter((x) => !x.r);
    return `<section class="card center"><h2 style="font-size:var(--fs-7)">${R.res.filter((x) => x.r).length} of ${R.res.length} right</h2><p class="sm muted">${left === 0 && R.i < R.qs.length ? "Time's up. " : ""}Saved for the transcript.</p></section>
     ${wrong.length ? `<section class="card"><b>Not yet (${wrong.length})</b><p class="xs muted">These chapters move to “Not grasped yet” and come back in the refresher.</p><ol class="sm">${wrong.map((x) => `<li><b>${esc(x.q.q)}</b><br>${esc(x.q.a)} <span class="xs muted">· ${esc(chT(unitByK(x.q.k)))}</span></li>`).join("")}</ol></section>` : `<p class="note">All right. Lovely work!</p>`}
     <div class="row"><button class="btn accent" data-act="qzagain">Another quiz</button><button class="btn line" data-act="qzend">Done</button></div>`;
  }
  const st = R.cur?.id === q.id ? R.cur : null,
    u = unitByK(q.k);
  return `<div class="row" style="justify-content:space-between"><span class="eyebrow">Question ${R.i + 1} of ${R.qs.length}${left != null ? ` · <span id="qzleft">${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}</span> left` : ""}</span><button class="link xs" data-act="qzstop">Stop</button></div>
   <span class="xs muted">${esc(chT(u))} · ${esc(SUBJ[u?.subj] || "")}</span>${qCard(q, st)}${st ? `<button class="btn accent wide" data-act="qznext">${R.i + 1 < R.qs.length ? "Next question" : "See the score"}</button>` : ""}`;
}
function quizPastView() {
  const r = (S.qzr || []).find((x) => x.id === ui.qzv);
  if (!r) {
    ui.qzv = null;
    return quizzView();
  }
  return `<button class="link" data-act="qzback">← Quick quiz</button><h3>${r.score} of ${r.items.length} right · ${esc(fmt(r.date))}</h3><ol class="sm">${r.items.map((x) => `<li><b>${esc(x.q)}</b> ${x.r ? "✓" : "✗"}<br>${esc(x.a)} <span class="xs muted">· ${esc(chT(unitByK(x.k)))}</span></li>`).join("")}</ol>`;
}
/* lists and refresher settings */
function rfsetView() {
  setSheetTitle("Refresher");
  return rfsetBody() + rfTiming();
}
// the refresher: what is unfinished, what is completed but not mastered, and what is mastered
function rfsetBody() {
  const Q = rfQueue(today),
    row = (k, subj, right) =>
      `<div class="sm">• <b>${esc(rfTitle(k))}</b> <span class="xs muted">${esc(SUBJ[subj] || "")} · ${right} of ${RF_PER} right</span></div>`,
    box = (title, note, L) =>
      `<section class="card"><div class="sech"><b class="h5">${title}</b><span class="pill">${L.length}</span></div><p class="xs muted">${note}</p>${L.length ? `<div class="col" style="gap:4px">${L.join("")}</div>` : `<p class="xs muted">None yet.</p>`}</section>`,
    mastered = [...new Set(Object.values(S.rfq || {}).map((x) => x.k))].filter((k) => rfRight(k) >= RF_PER);
  return `<p class="sm">Every unit your child completes comes back until they answer ${RF_PER} of its questions right. A day's refresher is at most ${RF_MAX} questions, ${RF_PER} from each of up to ${RF_MAX / RF_PER} units, taking turns across all subjects.</p>
   ${box(
     "Not finished",
     "Started in a refresher and not finished. These come first tomorrow.",
     Q.filter((x) => x.g === "open").map((x) => row(x.k, x.subj, x.right)),
   )}
   ${box(
     "Completed, not mastered yet",
     "These come back until 5 questions are answered right.",
     Q.filter((x) => x.g === "learn").map((x) => row(x.k, x.subj, x.right)),
   )}
   ${box(
     "Mastered",
     `5 questions answered right. They come back every ${RFS().mastered.every} days to keep fresh.`,
     mastered.map((k) => row(k, (rfIsDk(k) ? k.slice(5).split(".")[0] : unitByK(k)?.subj) || "", rfRight(k))),
   )}
   <button class="btn soft sm self-start" data-act="quizgo">🎯 Quick quiz</button>`;
}
// how long the daily refresher is, on which days, and how often mastered units come back (Plan → Plan settings)
function rfTiming() {
  const R = RFS(),
    EV = [3, 5, 7, 10, 14, 30];
  return `<section class="card"><b class="h5">Refresher</b><p class="xs muted">Already set for you. Change it only if you want to.</p>
   <div class="row" style="align-items:center"><span class="sm">Each day</span><select class="inp" style="width:auto;height:40px" id="rfmins">${[15, 20, 30, 45, 60].map((v) => `<option value="${v}" ${R.mins === v ? "selected" : ""}>${v} min</option>`).join("")}</select></div><div class="dpick">${[1, 2, 3, 4, 5, 6, 0].map((d) => `<button aria-pressed="${R.days.includes(d)}" data-act="rfday" data-d="${d}">${DAYN[d]}</button>`).join("")}</div>
   <div class="row" style="align-items:center"><span class="sm">Mastered units come back every</span><select class="inp" style="width:auto;height:40px" data-rfe="mastered">${EV.map((v) => `<option value="${v}" ${R.mastered.every === v ? "selected" : ""}>${v} days</option>`).join("")}</select></div></section>`;
}
function quizTranscript() {
  const R = S.qzr || [],
    L = masteryLists(),
    M = Object.values(lastAnswers());
  if (!R.length && !M.length) return "";
  const tot = R.reduce((a, r) => a + r.items.length, 0),
    ok = R.reduce((a, r) => a + r.score, 0);
  return `<h2>Quizzes and refreshers</h2><p class="sm">Quick quizzes taken: ${R.length} · Questions: ${tot} · Right: ${ok}${tot ? ` (${Math.round((ok / tot) * 100)}%)` : ""} · Different questions answered in all quizzes and refreshers: ${M.length}, latest answer right for ${M.filter((x) => x.r).length}</p>
   <table><tr><th>How it's sticking</th><th>Chapters</th></tr>${["mastered", "grasped", "not"].map((g) => `<tr><td>${MGN[g]}</td><td>${L[g].map((u) => esc(chT(u)) + " (" + esc(SUBJ[u.subj]) + ")").join(", ") || "—"}</td></tr>`).join("")}</table>
   ${
     R.length
       ? `<h3>Quick quizzes</h3><table><tr><th>Date</th><th>Subjects</th><th>Score</th></tr>${R.map((r) => `<tr><td>${esc(fmt(r.date))}</td><td>${esc(r.s === "all" ? "All subjects" : SUBJ[r.s] || "")}</td><td>${r.score} / ${r.items.length}</td></tr>`).join("")}</table>
   <h3>Questions and answers</h3><table><tr><th>Date</th><th>Chapter</th><th>Question</th><th>Answer</th><th>Result</th></tr>${R.flatMap((r) => r.items.map((x) => `<tr><td>${esc(fmt(r.date))}</td><td>${esc(chT(unitByK(x.k)))}</td><td>${esc(x.q)}</td><td>${esc(x.a)}</td><td>${x.r ? "Right" : "Not yet"}</td></tr>`)).join("")}</table>`
       : ""
   }`;
}
async function qGen() {
  const U = learnedUnits()
    .filter((u) => !qBank(u).length)
    .slice(0, 6);
  if (!U.length || !SAMPLE) return;
  ui.qgen = true;
  renderSheet();
  const prompt = `You write quiz questions for a home-schooled Indian child in Class ${S.levels?.math || 3}. For each chapter below, write 5 short multiple-choice questions that check what the chapter teaches. Each has 4 options and exactly one right answer. Simple words.\n${U.map((u) => `k: ${u.k} | ${SUBJ[u.subj]} | ${u.book} | ${chT(u)}`).join("\n")}\nReply with only JSON: {"chapters":[{"k":"...","questions":[{"q":"...","opts":["a","b","c","d"],"ans":0}]}]}`;
  try {
    const r = await SAMPLE.json(prompt, { modelTier: "quick" }),
      ok = new Set(U.map((u) => u.k));
    S.qgen = S.qgen || {};
    (r?.chapters || []).forEach((c) => {
      if (!ok.has(c.k)) return;
      const qs = (c.questions || [])
        .filter(
          (q) =>
            q &&
            typeof q.q === "string" &&
            Array.isArray(q.opts) &&
            q.opts.length === 4 &&
            Number.isInteger(q.ans) &&
            q.ans >= 0 &&
            q.ans < 4,
        )
        .map((q) => ({ q: q.q, opts: q.opts.map(String), ans: q.ans, a: String(q.opts[q.ans]) }));
      if (qs.length) S.qgen[c.k] = qs;
    });
    toast("Questions ready");
  } catch (e) {
    toast("Couldn't write questions just now. Try again later.");
  }
  ui.qgen = false;
  commit();
  renderSheet();
}
function rfCard() {
  const L = masteryLists(),
    it = dayPlan(today).find((i) => i.id === "refresh");
  return `<section class="sec"><div class="sech"><h3>Quizzes and refreshers</h3></div><div class="card"><div class="row">${["not", "grasped", "mastered"].map((g) => `<span class="pill mg-${g}">${MGN[g]} · ${L[g].length}</span>`).join("")}</div>
  <div class="row"><button class="btn accent sm" data-act="quizgo">🎯 Quick quiz</button>${it ? `<button class="btn soft sm" data-act="refresh" data-date="${today}">Today's refresher</button>` : ""}<button class="link" data-act="rfset">Lists and settings</button></div></div></section>`;
}
/* More for today: more jokes, and real games from the chapters */
function moreJG() {
  const n = ui.jg || 0;
  if (!n)
    return `<button class="btn soft sm self-start" data-act="morejg">${icon("spark")}More jokes and games</button>`;
  const mine = (i) => S.subjects.includes(i.subj),
    J = DATA.items.filter((i) => mine(i) && i.c?.x?.jokes?.length).flatMap((i) => i.c.x.jokes),
    Gm = DATA.items.filter((i) => mine(i) && Array.isArray(i.c?.game) && i.c.game.length >= 2);
  const pick = (L, c) => {
    const o = [];
    for (let i = 0; i < c && i < L.length; i++) o.push(L[((n - 1) * c + i + dayNo) % L.length]);
    return o;
  };
  return `<section class="card"><b class="h5">More jokes</b><div class="hs">${pick(J, 2)
    .map((j, i) => {
      const [q, a] = splitJoke(j),
        k = "x" + n + "-" + i;
      return `<button class="joke" data-act="joke" data-j="${k}"><span class="eyebrow">Joke</span><span class="q">${esc(q)}</span>${ui.jokes[k] ? `<span class="a">${esc(a)}</span>` : `<span class="tap">Tap for the answer</span>`}</button>`;
    })
    .join("")}</div>
   <b class="h5">Games to play</b>${pick(Gm, 2)
     .map(
       (u) =>
         `<div class="pk"><span class="eyebrow">${esc(chT(u))} · ${esc(SUBJ[u.subj])}</span><b>${esc(u.c.game[0])}</b><p class="sm">${esc(u.c.game[1])}</p></div>`,
     )
     .join("")}
   <button class="btn soft sm self-start" data-act="morejg">${icon("spark")}Two more of each</button></section>`;
}
const RFSTAT = { open: "not finished last time", learn: "not mastered yet", keep: "keeping fresh" };
function refreshAnswersView() {
  const date = ui.sheet.date || today,
    it = dayPlan(date).find((i) => i.id === "refresh");
  setSheetTitle("Refresher");
  if (!it)
    return `<p class="note">No refresher today. Units your child completes come into the refresher.</p><button class="link" data-act="rfset">Refresher settings and lists →</button>`;
  const r = it.rf;
  if (r.lazy) {
    rfBuild(date).then(() => renderSheet());
    return `<p class="note">Getting your questions…</p>`;
  }
  const ra = S.rfa?.[date] || {};
  return (
    `<p class="sm muted">About ${r.mins} minutes, from: ${r.topics.map((t) => `<b>${esc(rfTitle(t.k))}</b> (${RFSTAT[t.g]})`).join(", ")}.</p>` +
    r.slots
      .map(
        (s, i) =>
          `<section class="card"><span class="eyebrow">${i + 1} of ${r.slots.length} · ${esc(rfTitle(s.k))} · ${rfRight(s.k)} of ${RF_PER} right so far</span>${qCard(s.q, ra[s.q.id])}</section>`,
      )
      .join("") +
    `<div class="row"><button class="btn green wide" data-act="tlcheck" data-id="refresh" data-date="${date}">${icon("check")}${it.done ? "Done ✓" : "We did it"}</button></div><button class="link" data-act="rfset">Refresher settings and lists →</button>`
  );
}
function refreshView() {
  return refreshAnswersView();
}
function wordGame(u) {
  const x = u.c.x,
    word = x.words[dayNo % x.words.length],
    g = gamesToday(),
    won = g.g.includes(word),
    over = won || g.g.length >= 6,
    keys = {};
  g.g.forEach((w) =>
    [...w].forEach((ch, i) => {
      const c = ch === word[i] ? "hit" : word.includes(ch) ? "near" : "miss";
      if (keys[ch] !== "hit" && !(keys[ch] === "near" && c === "miss")) keys[ch] = c;
    }),
  );
  const rows = [...Array(6)]
    .map((_, r) => {
      const w = g.g[r] || (r === g.g.length && !over ? g.cur || "" : "");
      return `<div class="wordrow">${[0, 1, 2, 3, 4]
        .map((i) => {
          const ch = w[i] || "";
          let c = ch ? "f" : "";
          if (g.g[r]) c = ch === word[i] ? "hit" : word.includes(ch) ? "near" : "miss";
          return `<span class="wt ${c}" style="animation-delay:${i * 0.07}s">${esc(ch)}</span>`;
        })
        .join("")}</div>`;
    })
    .join("");
  return `<p class="sm muted center">A five-letter word from “${esc(u.title)}”. Green is the right place, yellow is in the word.</p><div class="wgrid">${rows}</div>${over ? `<p style="text-align:center;font:600 var(--fs-5) var(--display)">${won ? "You got it: " : "The word was "}${word}</p>` : `<div class="kb">${["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((r, i) => `<div>${i === 2 ? `<button class="w" data-act="wk" data-key="ENTER">Enter</button>` : ""}${[...r].map((c) => `<button class="${keys[c] || ""}" data-act="wk" data-key="${c}">${c}</button>`).join("")}${i === 2 ? `<button class="w" data-act="wk" data-key="DEL" aria-label="Delete">Del</button>` : ""}</div>`).join("")}</div>`}`;
}
function tfGame(u) {
  const g = gamesToday(),
    q = u.c.x.quiz,
    i = q.findIndex((_, k) => g.tf[k] === undefined),
    right = (k) => (g.tf[k] === 1) === q[k][1],
    sc = q.filter((_, k) => g.tf[k] !== undefined && right(k)).length;
  const dots = `<div class="dots">${q.map((_, k) => `<i class="${g.tf[k] === undefined ? (k === i ? "on" : "") : right(k) ? "ok" : "no"}"></i>`).join("")}</div>`;
  if (i < 0)
    return `${dots}<div class="score">${sc}/${q.length}</div><div class="col">${q.map((x) => `<div class="card" style="padding:14px"><span class="eyebrow">${x[1] ? "True" : "False"}</span><b style="font-weight:500">${esc(x[0])}</b><span class="sm muted">${esc(x[2])}</span></div>`).join("")}</div>`;
  const p = i > 0 ? q[i - 1] : null;
  return `${dots}${p ? `<p class="sm" style="text-align:center;color:${right(i - 1) ? "var(--good)" : "var(--bad)"}">${right(i - 1) ? "Right." : "Not quite."} ${esc(p[2])}</p>` : `<p class="sm muted center">Some of these sound true and aren't.</p>`}<div class="tfq">${esc(q[i][0])}</div><div class="tfrow"><button class="btn yes" data-act="tf" data-i="${i}" data-v="1">True</button><button class="btn no" data-act="tf" data-i="${i}" data-v="0">False</button></div>`;
}
function oddGame(u) {
  const g = gamesToday(),
    o = u.c.x.odd[dayNo % u.c.x.odd.length];
  return `<p class="sm muted center">Which one doesn't belong? There may be more than one good answer. Can you defend yours?</p><div class="oddgrid">${o[0].map((w) => `<button class="${g.odd ? (w === o[1] ? "right" : w === g.odd ? "wrong" : "") : ""}" data-act="odd" data-w="${esc(w)}" ${g.odd ? "disabled" : ""}>${esc(w)}</button>`).join("")}</div>${g.odd ? `<p class="center">${g.odd === o[1] ? "Yes. " : "We picked " + esc(o[1]) + ". "}${esc(o[2])}</p>` : ""}`;
}
function jokesAndGames() {
  const u = dailyUnit();
  setSheetTitle("Jokes and games");
  if (!u) return `<p class="note">Games come from the science chapter you're on. Add Science to see them.</p>`;
  const T = { word: ["Word of the Day", wordGame], tf: ["True or False", tfGame], odd: ["Odd One Out", oddGame] };
  return `${jokeCards(dayJokes())}
   <div class="seg">${Object.entries(T)
     .map(([k, [n]]) => `<button aria-pressed="${ui.game === k}" data-act="gtab" data-g="${k}">${n}</button>`)
     .join("")}</div><section class="col">${T[ui.game][1](u)}</section>
   <button class="btn ${S.tl[today + "|warm"] ? "soft" : "accent"}" data-act="tlcheck" data-id="warm" data-date="${today}">${S.tl[today + "|warm"] ? "Warm-up done ✓" : "Warm-up done"}</button>`;
}
function gamesView() {
  const id = fxWarmUnit(today),
    I = id && DATA.units[id];
  if (!I || !I.jokes?.length) return jokesAndGames();
  const sg = Object.values(DATA.songs || {}).find(
    (x) => (x.units || []).includes(id) || x.topic_level === I.song?.topic_level,
  );
  const jokes = jokeCards(dayJokes());
  const song = sg ? `<section class="card">${fxSongHtml(sg)}</section>` : "";
  const rest = dailyUnit() ? jokesAndGames().replace(jokeCards(dayJokes()), "") : "";
  return jokes + song + rest;
}
function lanes(date) {
  const items = dayPlan(date),
    d = dayDefaults();
  if (!items.length) return `<p class="note">Nothing on the clock this day.</p>`;
  const t0 = Math.floor((Math.min(toMins(d.prepAt), ...items.map((i) => i.at)) - 20) / 60) * 60,
    t1 = Math.ceil((Math.max(...items.map((i) => i.at + i.dur)) + 20) / 60) * 60,
    ppm = 1.2;
  const hrs = [];
  for (let h = t0; h < t1; h += 60)
    hrs.push(`<div class="hr" style="top:${(h - t0) * ppm}px">${clock(h).replace(":00", "")}</div>`);
  const b = (i) => {
    const lane =
      i.who === "you"
        ? "left:0;width:calc(50% - 3px)"
        : i.who === "kid"
          ? "right:0;width:calc(50% - 3px)"
          : "left:0;right:0";
    const col = i.kind === "lesson" ? subjClass(i.s) : "r-" + i.who;
    return `<div class="blk ${col} ${i.done ? "ok" : ""}" style="top:${(i.at - t0) * ppm + 1}px;height:${Math.max(20, i.dur * ppm - 3)}px;${lane}">${clock(i.at)} · ${esc(i.kind === "lesson" ? SUBJ[i.s] + ": " + i.u.title : i.title)}</div>`;
  };
  return `<div class="calhead"><span></span><span>${youBlob()}You</span><span>${kidBlob()}${esc(S.child || "Child")}</span></div><div class="cal" style="height:${(t1 - t0) * ppm}px">${hrs.join("")}<div class="lanes">${items.map(b).join("")}</div></div><p class="xs muted">Full-width blocks are things you do together.</p>`;
}

/* What this file's buttons do, by their data-act name; the click handler in 21-actions.js calls ACT[name](button, event, name, b.dataset.k) */
Object.assign(ACT, {
  lvq(b, e, a, k) {
    ui.lvq = lvqNew(b.dataset.s, S.levels[b.dataset.s] || 3);
    ui.lvqDone = null;
    sfx("flip");
    renderSheet(true);
  },
  lvqa(b, e, a, k) {
    if (b.dataset.v === "stop") ui.lvq = null;
    else {
      const lvl = lvqStep(ui.lvq, b.dataset.v === "1");
      if (lvl) {
        ui.lvqDone = { s: ui.lvq.s, lvl };
        ui.lvq = null;
      }
    }
    sfx("tap");
    renderSheet(true);
  },
  lvqset(b, e, a, k) {
    S.levels = { ...S.levels, [b.dataset.s]: +b.dataset.l };
    ui.lvqDone = null;
    _sess = null;
    sfx("ok");
    toast(`${SUBJ[b.dataset.s]} now plans from Class ${b.dataset.l}`);
    commit();
    renderSheet();
  },
  morejg(b, e, a, k) {
    ui.jg = (ui.jg || 0) + 1;
    sfx("flip");
    renderSheet();
  },
  quizgo(b, e, a, k) {
    sfx("flip");
    ui.qrun = null;
    ui.qzv = null;
    openSheet({ mode: "quizz" });
  },
  rfset(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "rfset" });
  },
  qzset(b, e, a, k) {
    const Z = (ui.qz = ui.qz || {}),
      v = b.dataset.v;
    Z[b.dataset.key] = /^\d+$/.test(v) ? +v : v;
    sfx("tap");
    renderSheet();
  },
  qzstart(b, e, a, k) {
    const Z = ui.qz,
      N = Z.by === "n" ? Z.n : Z.m * 2,
      P = quizPool(Z.s, Z.focus);
    if (!P.length) return;
    const head = Z.focus === "mix" ? P.slice(0, Math.ceil(N / 2)) : [],
      rest = P.filter((q) => !head.includes(q));
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    const qs = [...head, ...rest].slice(0, N);
    for (let i = qs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [qs[i], qs[j]] = [qs[j], qs[i]];
    }
    ui.qrun = { s: Z.s, by: Z.by, qs, i: 0, res: [], end: Z.by === "m" ? Date.now() + Z.m * 60000 : null };
    clearInterval(ui.qtick);
    if (ui.qrun.end)
      ui.qtick = setInterval(() => {
        const R = ui.qrun;
        if (!R || ui.sheet?.mode !== "quizz" || R.saved) {
          clearInterval(ui.qtick);
          return;
        }
        const e = document.getElementById("qzleft"),
          l = Math.max(0, Math.round((R.end - Date.now()) / 1000));
        if (e) e.textContent = Math.floor(l / 60) + ":" + String(l % 60).padStart(2, "0");
        if (!l) renderSheet();
      }, 1000);
    sfx("ok");
    renderSheet();
  },
  qans(b, e, a, k) {
    const q = (window._qmap || {})[b.dataset.id];
    if (!q) return;
    const c = b.dataset.c != null ? +b.dataset.c : null,
      r = c != null ? c === q.ans : b.dataset.r === "1";
    qRecord(q, r);
    if (ui.sheet?.mode === "refresh") rfRecord(q, r);
    sfx(r ? "ok" : "flip");
    if (ui.sheet?.mode === "quizz" && ui.qrun) {
      const R = ui.qrun;
      if (R.cur?.id !== q.id) {
        R.cur = { id: q.id, r, c };
        R.res.push({ q, r, c });
      }
      qzKeep();
    } else {
      const d = ui.sheet?.date || today;
      S.rfa = { ...(S.rfa || {}), [d]: { ...((S.rfa || {})[d] || {}), [q.id]: { r, c } } };
    }
    commit();
    renderSheet();
  },
  qznext(b, e, a, k) {
    const R = ui.qrun;
    if (R) {
      R.i++;
      R.cur = null;
      qzKeep();
      save();
    }
    sfx("tap");
    renderSheet();
  },
  qzstop(b, e, a, k) {
    const R = ui.qrun;
    if (R) {
      R.qs = R.qs.slice(0, R.res.length);
      R.i = R.qs.length;
    }
    renderSheet();
  },
  qzagain(b, e, a, k) {
    ui.qrun = null;
    renderSheet();
  },
  qzend(b, e, a, k) {
    ui.qrun = null;
    goBack();
  },
  qzpast(b, e, a, k) {
    ui.qzv = b.dataset.id;
    renderSheet();
  },
  qzback(b, e, a, k) {
    ui.qzv = null;
    renderSheet();
  },
  qgen(b, e, a, k) {
    qGen();
  },
  rfday(b, e, a, k) {
    const R = RFS(),
      d = +b.dataset.d,
      days = R.days.includes(d) ? R.days.filter((x) => x !== d) : [...R.days, d];
    S.rfs = { ...(S.rfs || {}), days };
    delete (S.rfp || {})[today];
    sfx("tap");
    commit();
    renderSheet();
  },
  gtab(b, e, a, k) {
    ui.game = b.dataset.g;
    sfx("tap");
    renderSheet();
  },
  wk(b, e, a, k) {
    const u = dailyUnit();
    if (!u) return;
    const word = u.c.x.words[dayNo % u.c.x.words.length],
      g = gamesToday();
    g.cur = g.cur || "";
    const key = b.dataset.key;
    if (g.g.includes(word) || g.g.length >= 6) return;
    if (key === "DEL") {
      g.cur = g.cur.slice(0, -1);
      sfx("key");
    } else if (key === "ENTER") {
      if (g.cur.length === 5) {
        g.g.push(g.cur);
        const w = g.cur === word;
        g.cur = "";
        sfx(w ? "win" : g.g.length >= 6 ? "no" : "flip");
        if (w) confetti();
        S.updatedAt = Date.now();
        save();
      } else {
        sfx("no");
        toast("Five letters, please");
      }
    } else if (g.cur.length < 5) {
      g.cur += key;
      sfx("key");
    }
    renderSheet();
  },
  tf(b, e, a, k) {
    const u = dailyUnit(),
      q = u.c.x.quiz[+b.dataset.i];
    gamesToday().tf[b.dataset.i] = +b.dataset.v;
    sfx((+b.dataset.v === 1) === q[1] ? "ok" : "no");
    if (Object.keys(gamesToday().tf).length === u.c.x.quiz.length) setTimeout(() => sfx("win"), 300);
    commit();
  },
  odd(b, e, a, k) {
    const u = dailyUnit(),
      o = u.c.x.odd[dayNo % u.c.x.odd.length],
      g = gamesToday();
    if (!g.odd) {
      g.odd = b.dataset.w;
      sfx(g.odd === o[1] ? "win" : "no");
      if (g.odd === o[1]) confetti();
      commit();
    }
  },
});
