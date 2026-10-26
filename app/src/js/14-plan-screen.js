/* Plan: This week, Up next, To finish, Settings, and the work lists behind them */
/* Day times: a usual routine, changes for a weekday, and changes for one date */
const DTF = [
  ["prepAt", "Morning prep", "time"],
  ["start", "Lessons start", "time"],
  ["brk", "Break between", "sel", [0, 10, 15, 20, 30]],
  ["lunch", "Lunch at", "time"],
  ["lunchMin", "Lunch length", "sel", [20, 30, 45, 60, 90]],
  ["eveAt", "Evening prep", "time"],
];
function dayTimesCard() {
  const sc = ui.dts || "all",
    isD = sc.startsWith("d:"),
    dt = isD ? sc.slice(2) : "",
    wd = sc[0] === "w" ? +sc.slice(1) : null,
    base = D(),
    ov = sc === "all" ? {} : wd != null ? (S.dayW || {})[wd] || {} : (S.dayOver || {})[dt] || {},
    cur = sc === "all" ? base : wd != null ? { ...base, ...ov } : Dd(dt);
  const field = ([f, l, ty, opts]) => {
    const changed = sc !== "all" && ov[f] != null;
    return `<div class="field"><label>${l}${changed ? " ✱" : ""}</label>${ty === "time" ? `<input class="inp" type="time" data-dt="${f}" value="${cur[f]}">` : `<select class="inp" data-dt="${f}">${opts.map((x) => `<option value="${x}" ${+cur[f] === x ? "selected" : ""}>${x} min</option>`).join("")}</select>`}</div>`;
  };
  const n = Object.keys(ov).length;
  return `<section class="sec"><div class="sech"><h3>Day times</h3><span class="xs muted">Your usual day, and changes for some days</span></div>
   <div class="row chips"><button class="chip" aria-pressed="${sc === "all"}" data-act="dts" data-s="all">Usual</button>${[1, 2, 3, 4, 5, 6, 0].map((d) => `<button class="chip" aria-pressed="${wd === d}" data-act="dts" data-s="w${d}">${DAYN[d]}${Object.keys((S.dayW || {})[d] || {}).length ? " ✱" : ""}</button>`).join("")}<label class="chip" aria-pressed="${isD}" style="cursor:pointer">📅 ${isD ? esc(fmt(dt)) : "A date"}<input type="date" id="dtDate" value="${dt || today}" style="width:1px;height:1px;opacity:0;position:absolute"></label></div>
   <div class="card"><p class="xs muted">${sc === "all" ? "Your usual times, every day." : wd != null ? `Every ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][wd]}. Change only what's different; the rest stays as usual.` : `Only on ${esc(fmt(dt))}. This beats the usual and the weekday times.`}</p>
    <div class="fgrid">${DTF.map(field).join("")}</div>${n ? `<button class="link xs" data-act="dtreset" style="justify-self:start">Back to usual times${wd != null ? " for " + DAYN[wd] : isD ? " for this date" : ""} (${n} changed)</button>` : ""}</div>
   ${
     Object.keys(S.dayOver || {}).filter((d) => d >= today && Object.keys(S.dayOver[d]).length).length
       ? `<p class="xs muted">Dates with their own times: ${Object.keys(S.dayOver)
           .filter((d) => d >= today && Object.keys(S.dayOver[d]).length)
           .sort()
           .map((d) => `<button class="link xs" data-act="dts" data-s="d:${d}">${esc(fmt(d))}</button>`)
           .join(", ")}</p>`
       : ""
   }</section>`;
}
/* add by hand: what kind, whose, when, and how it repeats */
const QREP = {
  once: ["Once", null],
  daily: ["Every day", [0, 1, 2, 3, 4, 5, 6]],
  wk: ["Weekdays", [1, 2, 3, 4, 5]],
  we: ["Weekends", [0, 6]],
  pick: ["Pick days", null],
};
const QKIND = [
  ["class", "Class or tuition"],
  ["rest", "Rest or meal"],
  ["outing", "Outing"],
  ["other", "Appointment"],
  ["todo", "To-do"],
];
/* Queued is a flag on top of an item's own state, so an item can be Pending + Queued, Not started + Queued, Ongoing + Queued */
const isQ = (u, id) => {
  const w = WK()[u.k + "|" + id];
  return !!(w && (w.q || w.st === "planned"));
};
const stPills = (x) =>
  `<span class="pill st-${x.st === "going" ? "going" : x.pend ? "new" : "none"}" style="font-size:11px">${x.st === "going" ? "Ongoing" : x.pend ? "Pending" : "Not started"}</span>${x.q ? ` <span class="pill st-queued" style="font-size:11px">Queued</span>` : ""}`;
function unQueue(ty, key) {
  const W = WK(),
    w = W[key];
  if (w) {
    delete w.q;
    delete w.planned;
    if (w.st === "planned") delete w.st;
  }
  WQ()[ty] = (WQ()[ty] || []).filter((x) => x !== ty + ":" + key);
}
const qCtl = (ty, u, id, st) => {
  if (st === "done" || st === "skip") return "";
  const r = ty + ":" + u.k + "|" + id;
  return isQ(u, id)
    ? `<button class="link xs" data-act="qx" data-ty="${ty}" data-r="${esc(r)}">Take out of the queue</button>`
    : qPick(ty, u.subj, r, "+ Queue", "btn xs soft");
};
const qTag = (ty, u, id, st) => {
  if (st === "done" || st === "skip" || !isQ(u, id)) return "";
  const r = ty + ":" + u.k + "|" + id,
    n = wqList(ty).findIndex((x) => x.ref === r) + 1;
  return ` <span class="pill st-queued" style="font-size:11px">Queued${n ? " · no. " + n : ""}</span>`;
};
/* Every worksheet, experiment, activity, project and quiz has its own state, whatever state its lesson is in:
   none (not started) · queued · going (ongoing) · done (completed) · skip (not doing) */
const ISTATE = { none: "Not started", queued: "Queued", going: "Ongoing", done: "Completed", skip: "Not doing" };
function itemState(ty, u, id) {
  const W = WK(),
    w = W[u.k + "|" + id],
    st = w?.st === "planned" ? null : w?.st;
  if (st === "skip") return "skip";
  if (ty === "ws") {
    const P = u.c?.p,
      x = (P?.worksheets || []).find((z) => z.id === id),
      k2 = u.k + "#" + id;
    if (taskDone(k2, "ws") || st === "done") return "done";
    if ((x && wsCount(k2, x.sections).ans > 0) || st === "started") return "going";
    return "none";
  }
  if (ty === "qz") {
    const n = +id.slice(1),
      Q = quizQ(u, n),
      a = Object.keys(S.quiz?.[u.k + "|" + n] || {}).length;
    if ((Q.length && a >= Q.length) || st === "done") return "done";
    if (a > 0 || st === "started") return "going";
    return "none";
  }
  if (taskDone(u.k, id) || st === "done" || stepTicked(u, id)) return "done";
  if (st === "started") return "going";
  if (ty === "proj") {
    const R = refParts(u, id),
      dn = done(u.k);
    if (R.length && R[0] <= dn && rank[coverage(u)] < 2) return "going";
  }
  return "none";
}
/* the state line shown on a worksheet or quiz wherever it appears */
function stateCtl(ty, u, id) {
  const s = itemState(ty, u, id),
    cls = { going: "started", done: "done", skip: "skip" }[s] || "",
    reached = (() => {
      const P = u.c?.p;
      if (!P) return false;
      const dn = rank[coverage(u)] >= 2 ? P.days.length : done(u.k);
      if (ty === "qz") return +id.slice(1) <= dn;
      const w = (P.worksheets || []).find((z) => z.id === id);
      return (w?.day || 99) <= dn;
    })();
  const lab = s === "none" && reached ? "Pending" : ISTATE[s],
    b = (to, l) =>
      `<button class="link xs" data-act="ist" data-ty="${ty}" data-k="${u.k}" data-id="${id}" data-to="${to}">${l}</button>`;
  return `<div class="wkctl ${cls}"><span class="xs"><b>${lab}${s === "done" ? " ✓" : ""}</b>${qTag(ty, u, id, s)}</span><div class="row" style="gap:8px;flex-wrap:wrap">${qCtl(ty, u, id, s)}${s === "none" && ui.qpick !== ty + ":" + u.k + "|" + id ? b("skip", "Not doing this") : s === "skip" ? b("none", "Undo") : s === "done" && ty === "ws" ? b("undo", "Undo finished") : ""}</div></div>`;
}
function subjCard() {
  return `<section class="sec"><div class="sech"><h3>Subjects</h3><span class="xs muted">Tap to add or leave out</span></div><div class="row chips">${visSubj(
    S.board,
  )
    .map(
      (k) =>
        `<button class="chip ${SC(k)}" aria-pressed="${S.subjects.includes(k)}" data-act="subtog" data-s="${k}">${S.subjects.includes(k) ? "✓ " : "+ "}${SUBJ[k]}</button>`,
    )
    .join(
      "",
    )}</div></section>${S.board === "waldorf" ? `<button class="menurow" data-act="wfguide">${blob("var(--sun)", 31, "happy", "", 'width="40" height="40"')}<span><b>Waldorf at home</b><br><span class="xs muted">Rhythm, festivals, materials and books for each class</span></span>${icon("next")}</button>` : ""}`;
}
/* Plan → To do: your own to-dos, and getting ready for the coming lessons */
function prepAhead(days) {
  const end = addDays(today, days),
    out = [];
  upcoming().forEach((x) => {
    if (x.date < today || x.date > end) return;
    prepFor(x.u, x.n, x.tot).forEach((p) => {
      if (LEARNK.has(p.kind)) return;
      const due = addDays(x.date, -p.lead);
      out.push({ ...p, x, due: due < today ? today : due, late: due < today });
    });
  });
  const seen = new Set();
  return out
    .filter((p) => !seen.has(p.id) && seen.add(p.id))
    .sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : 0));
}
function todoTab() {
  const T = (S.todos || []).filter((t) => !t.done).sort((a, b) => ((a.date || "") < (b.date || "") ? -1 : 1)),
    D = (S.todos || []).filter((t) => t.done && t.doneOn === today),
    P = prepAhead(7),
    open = P.filter((p) => !S.prep[p.id]),
    got = P.filter((p) => S.prep[p.id]);
  const when = (d) => (d === today ? "Today" : d === addDays(today, 1) ? "Tomorrow" : fmt(d)),
    tdRow = (t) =>
      `<div class="taskrow ${t.done ? "done" : ""}"><button class="ckb" data-act="tdtick" data-t="${t.id}" aria-label="Done: ${esc(t.title)}">${icon("check")}</button><div style="flex:1;min-width:0"><b style="font-weight:800">${esc(t.title)}</b><p class="xs muted">${t.done ? "Done today" : t.date < today ? "From " + fmt(t.date) + " · still open" : when(t.date)}${t.who && ROLE[t.who] ? " · " + esc(ROLE[t.who]) : ""}</p></div>${t.done ? "" : `<button class="link xs" data-act="todomove" data-t="${t.id}">Tomorrow</button><button class="link xs" data-act="tododel" data-t="${t.id}">Remove</button>`}</div>`;
  const byDay = {};
  open.forEach((p) => (byDay[p.due] = byDay[p.due] || []).push(p));
  let h = `<section class="sec"><div class="sech"><h3>Your to-dos</h3><span class="pill">${T.length}</span></div>${T.length || D.length ? `<div class="col" style="gap:8px">${[...T, ...D].map(tdRow).join("")}</div>` : `<p class="xs muted">Nothing on your list. Things you add without a time land here, like “buy chart paper” or “call the swimming coach”.</p>`}
    <details class="qa-in"${ui.tdAdd ? " open" : ""}><summary class="btn soft sm" style="justify-self:start" data-act="tdadd">${icon("plus")}Add a to-do</summary>${quickAdd(today)}</details></section>`;
  h += `<section class="sec"><div class="sech"><h3>Get ready for lessons</h3><span class="pill">${open.length}</span></div><p class="xs muted">Prep and things to gather for the next 7 days of lessons. Ticking here also ticks it on Today.</p>
    ${
      open.length
        ? Object.entries(byDay)
            .map(
              ([d, L]) =>
                `<div class="col" style="gap:8px"><span class="eyebrow">${when(d)}</span>${L.map((p) => `<div class="taskrow"><button class="ckb" data-act="prep" data-id="${p.id}" aria-label="Done: ${esc(p.task)}">${icon("check")}</button><div style="flex:1;min-width:0"><b style="font-weight:800">${esc(p.task)}</b><p class="xs muted">For ${esc(chT(p.x.u))} · ${esc(SUBJ[p.x.u.subj])}, ${esc(fmt(p.x.date))}${p.late ? " · was due earlier" : ""}</p></div></div>`).join("")}</div>`,
            )
            .join("")
        : `<p class="note">All set for the coming week.</p>`
    }
    ${got.length ? `<details><summary class="xs muted">Done (${got.length})</summary><div class="col" style="gap:6px;margin-top:6px">${got.map((p) => `<div class="taskrow done"><button class="ckb" data-act="prep" data-id="${p.id}" aria-label="Undo: ${esc(p.task)}">${icon("check")}</button><div><b>${esc(p.task)}</b></div></div>`).join("")}</div></details>` : ""}</section>`;
  return h;
}
const WT = {
  les: ["Lessons", "📘"],
  proj: ["Projects", "🧩"],
  exp: ["Experiments", "🧪"],
  act: ["Activities", "✂️"],
  ws: ["Worksheets", "📝"],
  qz: ["Quizzes", "❓"],
};
const WQ = () => S.wq || (S.wq = {});
function wType(u, id) {
  if (id === "proj") return "proj";
  const P = u.c?.p;
  if (P) {
    if (refParts(u, id).length >= 2) return "proj";
    if ((P.experiments || []).some((e) => e.id === id)) return "exp";
    if ((P.worksheets || []).some((w) => w.id === id)) return "ws";
    return "act";
  }
  return /^exp/.test(id) ? "exp" : "act";
}
function quizQ(u, n) {
  const P = u.c?.p;
  if (!P || u.board === "waldorf") return [];
  const d = pkDay(u, n),
    W = P.words || [];
  if (d.steps.some((s) => s.kind === "check") && P.check?.length) return P.check;
  const last = d.n === P.days.length;
  return last && P.check?.length
    ? P.check.slice(0, 5)
    : W.length
      ? [0, 1, 2]
          .map((i) => W[((d.n - 1) * 3 + i) % W.length])
          .filter((w, i, a) => a.indexOf(w) === i)
          .map(([w, m]) => ({ q: `What does “${w}” mean?`, a: m }))
      : [];
}
/* a step ticked off during the lesson counts as done */
function stepTicked(u, id) {
  const P = u.c?.p;
  if (!P) return false;
  const names = new Set();
  P.days.forEach((d) =>
    d.steps.forEach((s) => {
      if (s.ref === id) names.add((PKIND[s.kind] || ["act"])[0] + "|" + s.title);
    }),
  );
  if (!names.size) return false;
  return Object.entries(S.steps || {}).some(
    ([key, arr]) => key.replace(/^x/, "").startsWith(u.k + "|") && (arr || []).some((n) => names.has(n)),
  );
}
function boardWorkItems() {
  const out = [],
    W = WK(),
    refK = (r) => {
      const x = r.slice(r.indexOf(":") + 1);
      return x.slice(0, x.lastIndexOf("|"));
    };
  const seenK = new Set([
    ...S.log.map((l) => l.key),
    ...Object.keys(S.progress || {}).filter(
      (k) => (S.progress[k].sessions || 0) > 0 || rank[S.progress[k].status] >= 2,
    ),
    ...Object.keys(W).map((k) => k.slice(0, k.lastIndexOf("|"))),
    ...Object.values(WQ()).flat().map(refK),
    ...Object.keys(S.quiz || {}).map((k) => k.slice(0, k.lastIndexOf("|"))),
  ]);
  const add = (ty, u, id, title, o) => {
    const st = itemState(ty, u, id);
    if (st === "done" || st === "skip") return;
    const reached = o.day <= o.dn,
      q = isQ(u, id),
      pend = st === "none" && reached;
    if (st === "none" && !reached && !q) return;
    out.push({
      ref: ty + ":" + u.k + "|" + id,
      ty,
      u,
      id,
      title,
      st,
      q,
      pend,
      state: st === "going" ? "going" : pend ? "new" : "queued",
      sub: o.sub(st, reached),
      open: o.open,
      go: st === "going" ? "Continue" : "Start",
    });
  };
  [...seenK]
    .map(unitByK)
    .filter(Boolean)
    .forEach((u) => {
      const P = u.c?.p;
      if (!P) return;
      const real = done(u.k),
        dn = rank[coverage(u)] >= 2 ? P.days.length : real,
        from = (d) => (d <= real ? `From Part ${d}, which you've done` : "From a chapter marked done"),
        when = (d) => (d <= dn ? from(d) : `Comes up in Part ${d}`);
      (P.worksheets || []).forEach((w) => {
        const k2 = u.k + "#" + w.id;
        add("ws", u, w.id, w.title, {
          day: w.day || 99,
          dn,
          open: `data-act="ws" data-k="${u.k}" data-w="${esc(w.id)}"`,
          sub: (st) => {
            const c = wsCount(k2, w.sections);
            return st === "going" ? `${c.ans} of ${c.tot} answered` : when(w.day || 99);
          },
        });
      });
      [...(P.experiments || []), ...(P.activities || [])].forEach((e) => {
        const R = refParts(u, e.id),
          a = R[0] || 99,
          z = R[R.length - 1] || 99,
          w0 = W[u.k + "|" + e.id];
        add(wType(u, e.id), u, e.id, e.title, {
          day: a,
          dn,
          open: `data-act="chapter" data-k="${u.k}" data-t="lab"`,
          sub: (st) =>
            st === "going"
              ? w0?.st === "started"
                ? `Started ${fmt(w0.started)}`
                : dn >= z
                  ? "All its parts are done · mark it finished"
                  : `Parts ${a}–${z} · next check-in Part ${R.find((r) => r > dn)}`
              : when(a),
        });
      });
      for (let n = 1; n <= P.days.length; n++) {
        const Q = quizQ(u, n);
        if (!Q.length) continue;
        add("qz", u, "q" + n, `Quiz · Part ${n}`, {
          day: n,
          dn,
          open: `data-act="qzs" data-k="${u.k}" data-n="${n}"`,
          sub: (st) => {
            const a = Object.keys(S.quiz?.[u.k + "|" + n] || {}).length;
            return st === "going" ? `${a} of ${Q.length} asked` : when(n) + ` · ${Q.length} questions`;
          },
        });
      }
    });
  Object.entries(W).forEach(([key, w]) => {
    const q = !!(w.q || w.st === "planned");
    if (!(w.st === "started" || q) || ["done", "skip"].includes(w.st)) return;
    const j = key.lastIndexOf("|"),
      u = unitByK(key.slice(0, j)),
      id = key.slice(j + 1);
    if (!u || /^q\d+$/.test(id) || out.some((x) => x.u.k === u.k && x.id === id)) return;
    if (
      u.c?.p &&
      ((u.c.p.worksheets || []).some((x) => x.id === id) ||
        [...(u.c.p.experiments || []), ...(u.c.p.activities || [])].some((x) => x.id === id))
    )
      return;
    const ty = wType(u, id),
      st = w.st === "started" ? "going" : "none";
    out.push({
      ref: ty + ":" + key,
      ty,
      u,
      id,
      title: w.title || wkTitle(u, id, ""),
      st,
      q,
      pend: false,
      state: st === "going" ? "going" : "queued",
      sub: st === "going" ? `Started ${fmt(w.started)}` : "Added by you",
      open: `data-act="chapter" data-k="${u.k}" data-t="lab"`,
      go: "Open",
    });
  });
  return out;
}
function workItems() {
  const out = boardWorkItems();
  Object.keys(DATA.units || {}).forEach((id) => {
    const u = unitBy("unit|" + id);
    if (!u) return;
    const P = DATA.units[id].parts || [],
      X = fxStates(id);
    if (X.every((x) => x === "none")) return;
    P.forEach((p, i) => {
      const x = X[i];
      if (x !== "going" && x !== "pending") return;
      const multi = (p[5] || 1) > 1;
      out.push({
        ref: "fx:" + id + "|" + p[0],
        ty: FXWT[p[2]] || "les",
        u,
        id: p[0],
        title: p[1],
        st: x === "going" ? "going" : "none",
        q: false,
        pend: x === "pending",
        state: x === "going" ? "going" : "new",
        sub:
          `${u.title} · part ${i + 1} of ${P.length}` +
          (x === "pending" ? " · reached the end, questions left" : multi ? ` · runs ${p[5]} days` : ""),
        open: `data-act="fxpart" data-u="${esc(id)}" data-p="${esc(p[0])}"`,
        go: x === "going" ? "Continue" : "Finish it",
      });
    });
  });
  return out;
}
function lessonsGoing() {
  return S.subjects.flatMap((s) =>
    plannedUnits(s)
      .filter((u) => coverage(u) === "learning")
      .slice(0, 3)
      .map((u) => {
        const id = u.k.startsWith("unit") && DATA.units?.[u.k.slice(5)] ? u.k.slice(5) : "",
          X = id && fxStates(id);
        return {
          ref: "les:" + u.k,
          ty: "les",
          u,
          id: "",
          title: chT(u),
          state: "going",
          sub: id
            ? `${X.filter((x) => x === "done").length} of ${DATA.units[id].parts?.length || 0} parts done · core path: ${fxSessionsDone(u.k)} of ${fxSpineDays(unitBy(u.k)).length} sessions`
            : `${done(u.k)} of ${sessionsFor(u)} parts done`,
          open: `data-act="chapter" data-k="${u.k}"`,
          go: "Open",
        };
      }),
  );
}
function wqList(ty) {
  const its = workItems().filter((x) => x.ty === ty && x.q),
    o = WQ()[ty] || [],
    pos = (r) => {
      const i = o.indexOf(r);
      return i < 0 ? 1e6 : i;
    };
  return its
    .map((x, i) => ({ x, i }))
    .sort((a, b) => pos(a.x.ref) - pos(b.x.ref) || a.i - b.i)
    .map((z) => z.x);
}
function qItems(t, s) {
  if (t === "les") {
    const ex = (S.extra || {})[s] || [];
    return plannedUnits(s)
      .filter((u) => rank[coverage(u)] < 2)
      .filter((u, i) => i < 12 || ex.includes(u.k))
      .map((u) => ({
        ref: "les:" + u.k,
        u,
        title: chT(u),
        sub: `${u.board === "gen" ? "DeepKids topic" : u.board === "dk" ? "DeepKids Plus" : u.book} · ${sessionsFor(u)} days`,
        open: `data-act="chapter" data-k="${u.k}"`,
        rm: ex.includes(u.k),
      }));
  }
  return bySubj(wqList(t)).map((x) => ({ ...x, sub: `${chT(x.u)} · ${SUBJ[x.u.subj]}`, rm: true }));
}
function setOrder(ty, s, refs) {
  if (ty === "les") {
    const ks = refs.map((r) => r.slice(4));
    S.next = { ...(S.next || {}), [s]: ks };
    S.later = { ...(S.later || {}), [s]: ((S.later || {})[s] || []).filter((k) => !ks.includes(k)) };
  } else {
    const all = wqList(ty).map((x) => x.ref),
      slots = all.map((r, i) => (refs.includes(r) ? i : -1)).filter((i) => i >= 0);
    refs.forEach((r, j) => {
      if (slots[j] !== undefined) all[slots[j]] = r;
    });
    WQ()[ty] = all;
  }
  commit();
}
/* add to the front or the end of a line-up; returns its place */
function qPut(ty, s, r, where) {
  // a lesson from a subject that isn't in the plan yet brings the subject in
  if (ty === "les" && s && !S.subjects.includes(s)) {
    const u = unitBy(r.slice(r.indexOf(":") + 1));
    S.subjects = [...S.subjects, s];
    S.levels = { ...(S.levels || {}), [s]: S.levels?.[s] || u?.level || 1 };
  }
  const key = r.slice(r.indexOf(":") + 1);
  if (ty === "les") {
    const k = key,
      u = unitBy(k);
    if (!plannedUnits(s).some((z) => z.k === k))
      S.extra = { ...(S.extra || {}), [s]: [...new Set([...((S.extra || {})[s] || []), k])] };
    const nx = ((S.next || {})[s] || []).filter((x) => x !== k),
      cur = plannedAt(s, S.levels[s])
        .filter((z) => rank[coverage(z)] < 2 && z.k !== k)
        .map((z) => z.k);
    S.next = { ...(S.next || {}), [s]: where === "first" ? [k, ...nx] : [...new Set([...nx, ...cur]), k] };
    S.later = { ...(S.later || {}), [s]: ((S.later || {})[s] || []).filter((x) => x !== k) };
    commit();
    return qPos(u);
  }
  const W = WK(),
    w = { ...(W[key] || {}) };
  if (w.st === "planned") delete w.st;
  W[key] = { ...w, q: true, planned: w.planned || today };
  const all = wqList(ty)
    .map((x) => x.ref)
    .filter((x) => x !== r);
  WQ()[ty] = where === "first" ? [r, ...all] : [...all, r];
  commit();
  return WQ()[ty].indexOf(r) + 1;
}
function qPick(ty, s, r, label, cls) {
  const a = (w) => `data-act="qput" data-ty="${ty}" data-s="${s}" data-r="${esc(r)}" data-w="${w}"`;
  if (ui.qpick === r)
    return `<span class="qpick"><button class="btn xs accent" ${a("first")}>${ty === "les" ? "Do it next" : "First in queue"}</button><button class="btn xs soft" ${a("last")}>${ty === "les" ? "End of this class" : "Last in queue"}</button><button class="link xs" data-act="qpick" data-r="">Cancel</button></span>`;
  return `<button class="${cls || "btn sm"}" data-act="qpick" data-r="${esc(r)}">${label}</button>`;
}
function viewTasks() {
  initDrag();
  const k = seg("tasks");
  let h = pageHead("To do") + segBar("tasks") + `</section>`;
  return h + (k === "going" ? goingView() : k === "new" ? newView() : queuesView());
}
const taskRow = (x, extra = "") =>
  `<div class="trow"><span class="tic" aria-hidden="true">${WT[x.ty][1]}</span><div style="min-width:0;flex:1"><b>${esc(x.title)}</b> ${x.ty === "les" ? `<span class="pill st-going" style="font-size:11px">Ongoing</span>` : stPills(x)}<br><span class="xs muted">${x.ty === "les" ? "" : esc(chT(x.u)) + " · "}${esc(SUBJ[x.u.subj])} · ${esc(x.sub)}</span>${extra}</div><button class="btn xs ${x.state === "going" ? "accent" : "soft"}" ${x.open}>${x.go}</button></div>`;
function grouped(list, empty, rowFn) {
  const by = Object.keys(WT)
    .map((t) => [t, list.filter((x) => x.ty === t)])
    .filter(([, l]) => l.length);
  if (!by.length) return `<section class="sec"><p class="note">${empty}</p></section>`;
  return by
    .map(
      ([t, l]) =>
        `<section class="sec"><div class="sech"><h3 style="font-size:18px">${WT[t][1]} ${WT[t][0]}</h3><span class="pill">${l.length}</span></div><div class="col" style="gap:8px">${l.map(rowFn).join("")}</div></section>`,
    )
    .join("");
}
function goingView() {
  const L = bySubj([...lessonsGoing(), ...workItems().filter((x) => x.state === "going")]),
    ex = (S.exps || []).filter((e) => !e.closed);
  let h =
    `<section class="sec">${subjChips()}</section>` +
    grouped(
      L,
      "Nothing started yet. When you start a lesson, worksheet, quiz or project, it stays here until it's finished.",
      (x) => taskRow(x),
    );
  if (ex.length)
    h += `<section class="sec"><div class="sech"><h3 style="font-size:18px">🌱 Daily check-ins</h3><span class="pill">${ex.length}</span></div><div class="col" style="gap:8px">${ex
      .map((e) => {
        const day = Math.round((parse(today) - parse(e.start)) / 864e5) + 1,
          c = e.checks.includes(today);
        return `<div class="trow"><span class="tic">🌱</span><div style="min-width:0;flex:1"><b>${esc(e.title)}</b><br><span class="xs muted">Day ${day}${e.topic ? " · " + esc(e.topic) : ""}${c ? " · checked today" : ""}</span><br><button class="link xs" data-act="close" data-e="${e.id}">Finish it</button></div><button class="btn xs ${c ? "soft" : "accent"}" data-act="check" data-e="${e.id}">${c ? "Checked ✓" : "Check today"}</button></div>`;
      })
      .join("")}</div></section>`;
  return h;
}
function newView() {
  const L = bySubj(workItems().filter((x) => x.pend));
  return (
    `<section class="sec">${subjChips()}<p class="sm muted">Not started yet, from lesson parts you've done. Queued ones stay here too, tagged Queued, until you start them.</p></section>` +
    grouped(
      L,
      "Nothing pending. When you finish a lesson part, its worksheets, quizzes, experiments and activities that weren't started show up here.",
      (x) =>
        taskRow(
          x,
          `<div class="row" style="gap:10px;margin-top:4px">${x.q ? `<button class="link xs" data-act="qx" data-ty="${x.ty}" data-r="${esc(x.ref)}">Take out of the queue</button>` : qPick(x.ty, x.u.subj, x.ref, "+ Queue", "link xs")}${ui.qpick === x.ref ? "" : `<button class="link xs" data-act="qx" data-ty="${x.ty}" data-r="${esc(x.ref)}" data-how="skip">Not doing this</button>`}</div>`,
        ),
    )
  );
}
function queuesView() {
  const t = WT[ui.tq] ? ui.tq : "les",
    s = S.subjects.includes(ui.qs) ? ui.qs : S.subjects[0];
  let h = `<section class="sec"><div class="seg qtypes">${Object.entries(WT)
    .map(
      ([k, [n, ic]]) =>
        `<button aria-pressed="${k === t}" data-act="tqt" data-t="${k}">${ic} ${n}${k === "les" ? "" : ` <small>${bySubj(wqList(k)).length}</small>`}</button>`,
    )
    .join("")}</div>`;
  h +=
    t === "les"
      ? `<div class="seg">${S.subjects.map((x) => `<button aria-pressed="${x === s}" data-act="qsub" data-s="${x}">${SUBJ[x]}</button>`).join("")}</div>`
      : subjChips();
  const L = qItems(t, s),
    mv = (x, d, on, lab, ch) =>
      `<button class="iconbtn qb" data-act="qmv" data-ty="${t}" data-s="${s}" data-r="${esc(x.ref)}" data-d="${d}" ${on ? "" : "disabled"} aria-label="${lab}">${ch}</button>`;
  h += `<div class="row"><button class="btn soft sm" data-act="qshuf" data-ty="${t}" data-s="${s}">${icon("spark")}Shuffle</button>${t === "les" ? `<button class="btn ${S.exam ? "" : "soft"} sm" data-act="exam">${S.exam ? "Exam track on" : "Exam track off"}</button>` : ""}</div>`;
  h += L.length
    ? `<div class="qlist" data-ty="${t}" data-s="${s}">${L.map((x, i) => `<div class="qrow2${x.ref === ui.flash ? " flash" : ""}" data-r="${esc(x.ref)}"><span class="dh" aria-hidden="true">⠿</span><span class="qn">${i + 1}</span><button class="plain" ${x.open} style="min-width:0;flex:1;text-align:left"><b>${esc(x.title)}</b>${x.ty && x.ty !== "les" ? " " + stPills(x).replace(/ <span class="pill st-queued"[^]*$/, "") : ""}<br><span class="xs muted">${esc(x.sub)}</span></button><span class="row" style="gap:4px;flex-wrap:nowrap">${mv(x, -1, i > 0, "Move up", "▲")}${mv(x, 1, i < L.length - 1, "Move down", "▼")}${x.rm ? `<button class="iconbtn qb" data-act="qx" data-ty="${t}" data-s="${s}" data-r="${esc(x.ref)}" aria-label="Take out">${icon("close")}</button>` : ""}</span></div>`).join("")}</div>`
    : `<p class="note">${t === "les" ? "No chapters waiting." : `No ${WT[t][0].toLowerCase()} queued${qfOf() === "all" ? "" : " in " + SUBJ[qfOf()]}. Tap “+ Queue” on one in Pending, in a lesson or in a chapter.`}</p>`;
  if (t === "les")
    h += `<button class="link" data-act="lt2" style="justify-self:start">Find more chapters and topics in the Library →</button>`;
  return h + `</section>`;
}
function qzsView() {
  const P = ui.sheet,
    u = unitBy(P.k),
    Q = u ? quizQ(u, P.n) : [];
  document.getElementById("sheetTitle").textContent = `Quiz · Part ${P.n}`;
  if (!u) return `<p class="note">Not found.</p>`;
  return `<p class="sm"><b>${esc(chT(u))}</b> · ${esc(SUBJ[u.subj])}</p><p class="sm muted">Ask aloud. Let your child answer first, then tap to check.</p>${quizList(u.k, P.n, Q)}`;
}
/* drag to reorder: works with a finger or a mouse, on the ⠿ handle */
function initDrag() {
  if (window._dkDrag) return;
  window._dkDrag = 1;
  let D = null;
  document.addEventListener("pointerdown", (e) => {
    const h = e.target.closest(".qlist .dh");
    if (!h) return;
    const row = h.closest(".qrow2");
    D = { row, list: row.parentElement, id: e.pointerId, moved: false };
    row.classList.add("drag");
    try {
      h.setPointerCapture(e.pointerId);
    } catch (_) {}
    e.preventDefault();
  });
  document.addEventListener("pointermove", (e) => {
    if (!D || e.pointerId !== D.id) return;
    const rows = [...D.list.children].filter((r) => r !== D.row),
      after = rows.find((r) => {
        const b = r.getBoundingClientRect();
        return e.clientY < b.top + b.height / 2;
      });
    if (after !== D.row.nextElementSibling || (!after && D.row !== D.list.lastElementChild)) {
      D.list.insertBefore(D.row, after || null);
      D.moved = true;
      [...D.list.children].forEach((r, i) => {
        const n = r.querySelector(".qn");
        if (n) n.textContent = i + 1;
      });
    }
    if (e.clientY < 90) scrollBy(0, -14);
    else if (e.clientY > innerHeight - 130) scrollBy(0, 14);
  });
  const end = (e) => {
    if (!D || (e.pointerId !== undefined && e.pointerId !== D.id)) return;
    const d = D;
    D = null;
    d.row.classList.remove("drag");
    if (!d.moved) return;
    sfx("flip");
    setOrder(
      d.list.dataset.ty,
      d.list.dataset.s,
      [...d.list.children].map((r) => r.dataset.r),
    );
  };
  document.addEventListener("pointerup", end);
  document.addEventListener("pointercancel", end);
}
/* daily check-ins: ideas when there are none */
function trackIdeas(n) {
  const have = new Set((S.exps || []).map((e) => e.title)),
    out = [],
    R =
      /\b(grow(s|ing|th)?|sprout\w*|seeds?|germinat\w*|crystals?|diary|every day|each day|daily|mould\w*|rot(s|ting)?)\b/i;
  const us = [
    ...S.subjects.flatMap((s) => plannedUnits(s).slice(0, 15)),
    ...DATA.items.filter((i) => i.c?.p && S.subjects.includes(i.subj)),
  ];
  for (const pass of [1, 2])
    for (const u of us) {
      const P = u.c?.p;
      if (!P) continue;
      for (const e of [...(P.experiments || []), ...(P.activities || [])]) {
        if (have.has(e.title) || out.some((o) => o.e.title === e.title)) continue;
        const ok =
          pass === 1
            ? R.test(e.title + " " + (e.question || "") + " " + (e.steps || []).join(" ")) &&
              refParts(u, e.id).length >= 1
            : refParts(u, e.id).length >= 2;
        if (ok) {
          out.push({ u, e });
          if (out.length >= n) return out;
        }
      }
    }
  return out;
}
/* DeepKids topics: how long each learning day, and which one fits the day's lessons */
const DKSTEPS = [0, 10, 15, 20, 30, 45, 60],
  dkMinsOf = () => 0;
const DKSTOP = new Set(
  "this that with from what your have they their them about into does which when where will would there these those child make each more some like other than then very just also only many much were been being because around chapter lesson learn talk book know things thing people today tell show find story".split(
    " ",
  ),
);
function dkWords(s) {
  return new Set(
    (
      String(s || "")
        .toLowerCase()
        .match(/[a-z]{4,}/g) || []
    )
      .filter((w) => !DKSTOP.has(w))
      .map((w) => w.replace(/(ies|es|s)$/, "")),
  );
}
function dkPick(date, lessons) {
  const L = lessons.map((l) => l.u).filter(Boolean),
    live = DATA.topics.filter(
      (t) => (t.cls || [1, 2, 3, 4, 5]).includes(S.levels.dks || S.levels.sci || 1) && rank[st("dk|" + t.id)] < 2,
    );
  if (!live.length) return null;
  const lw = new Set(
    L.flatMap((u) => [
      ...dkWords([u.title, u.c?.covers, u.c?.p?.summary, (u.c?.p?.words || []).map((x) => x[0]).join(" ")].join(" ")),
    ]),
  );
  let best = null,
    h0 = 0;
  for (const c of date) h0 = (h0 * 31 + c.charCodeAt(0)) % 9973;
  live.forEach((t, i) => {
    const mapped = L.find((u) => (u.dk || []).includes(t.id)),
      hit = [...dkWords([t.name, t.summary, t.sub, t.q].join(" "))].filter((w) => lw.has(w));
    const sc = (mapped ? 100 : 0) + hit.length + (rank[st("dk|" + t.id)] === 1 ? 2 : 0) + ((h0 + i * 7) % 13) / 100;
    if (!best || sc > best.sc) best = { sc, t, mapped, hit };
  });
  const u = unitBy("dk|" + best.t.id);
  if (!u) return null;
  const near = best.mapped || L.find((x) => [...dkWords(x.title)].some((w) => best.hit.includes(w))) || null;
  return {
    u,
    why: best.mapped
      ? `Goes with ${chT(best.mapped)}`
      : near
        ? `Goes with ${chT(near)} (${best.hit.slice(0, 2).join(", ")})`
        : best.hit.length
          ? `Links to today's lessons: ${best.hit.slice(0, 2).join(", ")}`
          : "Today's big question",
  };
}
function ideasHtml() {
  return trackIdeas(3)
    .map(
      ({ u, e }) =>
        `<div class="trow"><span class="tic">🌱</span><div style="min-width:0;flex:1"><b>${esc(e.title)}</b><br><span class="xs muted">${esc(chT(u))} · ${esc(SUBJ[u.subj])}</span></div><button class="btn xs soft" data-act="startexp" data-title="${esc(e.title)}" data-topic="${esc(chT(u))}">Start</button></div>`,
    )
    .join("");
}
function toldView() {
  document.getElementById("sheetTitle").textContent = "What you've told us";
  const E = (S.events || [])
      .slice()
      .sort((a, b) => (a.rep === "weekly" ? 0 : 1) - (b.rep === "weekly" ? 0 : 1) || hm(a.start) - hm(b.start)),
    T = (S.todos || []).filter((t) => !t.done),
    N = S.notes || [],
    L = (S.said || []).slice().reverse(),
    ed = ui.ted;
  const evRow = (e) =>
    ed === e.id
      ? `<div class="pk"><input class="inp" data-evf="title" data-id="${e.id}" value="${esc(e.title)}" aria-label="Name"><div class="dpick">${[1, 2, 3, 4, 5, 6, 0].map((d) => `<button aria-pressed="${(e.rep === "weekly" ? e.days : []).includes(d)}" data-act="evday" data-id="${e.id}" data-d="${d}">${DAYS3[d]}</button>`).join("")}</div><div class="row"><label class="xs">From <input class="inp" type="time" data-evf="start" data-id="${e.id}" value="${e.start || ""}" style="width:auto"></label><label class="xs">to <input class="inp" type="time" data-evf="end" data-id="${e.id}" value="${e.end || ""}" style="width:auto"></label></div><div class="whos">${[
          ["you", "Mine"],
          ["kid", S.child ? esc(S.child) + "'s" : "Child's"],
          ["both", "Together"],
        ]
          .map(
            ([k, n]) =>
              `<button type="button" aria-pressed="${e.who === k}" data-act="evwho" data-id="${e.id}" data-w="${k}">${n}</button>`,
          )
          .join(
            "",
          )}</div><div class="row"><button class="btn sm" data-act="ted" data-id="">Done</button><button class="link sm" data-act="evdel" data-id="${e.id}" style="color:var(--bad)">Remove</button></div></div>`
      : `<div class="pk ${e.start ? "" : "warn"}"><span class="eyebrow">${esc(EVK[e.kind] || "Plan")}${e.src === "gcal" ? " · Google Calendar" : ""}</span><b>${esc(e.title)}</b><p class="sm">${esc(evLine(e))}${e.who === "kid" ? ` · ${esc(S.child || "child")} alone` : e.who === "both" ? " · together" : ""}</p>${e.start ? "" : `<p class="xs" style="color:var(--bad)">Add a time so the day plan can work around it.</p>`}${e.src === "gcal" ? "" : `<div class="row"><button class="link sm" data-act="ted" data-id="${e.id}">Change</button></div>`}</div>`;
  let h = `<p class="sm muted">Everything you've added: by typing, chatting, photos or by hand. Change or remove anything here, and the plan follows.</p>`;
  h += `<section class="sec"><div class="sech"><h3 style="font-size:18px">Routines, classes and rest</h3><span class="pill">${E.length}</span></div>${E.length ? E.map(evRow).join("") : `<p class="xs muted">Nothing yet.</p>`}<button class="btn soft sm" data-act="toplan" style="justify-self:start">+ Add or change by telling DeepKids</button></section>`;
  h += `<section class="sec"><div class="sech"><h3 style="font-size:18px">To-dos</h3><span class="pill">${T.length}</span></div>${T.length ? T.map((t) => `<div class="pk"><b>${esc(t.title)}</b><p class="xs muted">${esc(fmt(t.date))}${t.note ? " · " + esc(t.note) : ""}</p><div class="row"><button class="link sm" data-act="tddel" data-id="${t.id}" style="color:var(--bad)">Remove</button></div></div>`).join("") : `<p class="xs muted">No open to-dos.</p>`}</section>`;
  h += `<section class="sec"><div class="sech"><h3 style="font-size:18px">Notes we keep in mind</h3><span class="pill">${N.length}</span></div>${N.length ? N.map((n) => `<div class="pk"><p class="sm">${esc(n.text)}</p><p class="xs muted">${esc(fmt(n.date))}</p><div class="row"><button class="link sm" data-act="notedel" data-id="${n.id}" style="color:var(--bad)">Remove</button></div></div>`).join("") : `<p class="xs muted">No notes.</p>`}</section>`;
  h += `<section class="sec"><div class="sech"><h3 style="font-size:18px">What you said</h3><span class="pill">${L.length}</span></div>${L.length ? L.map((x) => `<details class="card"><summary><b class="sm">${esc(fmt(x.date))} · ${esc(new Date(x.at).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }))}</b><br><span class="sm">${esc(x.text.split("\n")[0].slice(0, 120))}</span></summary><div class="chat" style="margin-top:8px"><div class="bub me">${esc(x.text).replace(/\n/g, "<br>")}</div>${(x.chat || []).map((c) => `<div class="bub cl">${esc(c.q)}</div><div class="bub me">${esc(c.a)}</div>`).join("")}</div>${x.added?.length ? `<p class="xs muted">Added to the plan:</p><ul class="sm">${x.added.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>` : ""}</details>`).join("") : `<p class="xs muted">Messages you send in the Planner are kept here from now on.</p>`}</section>`;
  return h;
}
const quizList = (k, n, Q) =>
  `<ol class="sm qzl">${Q.map((q, qi) => `<li><b>${esc(q.q)}</b><details><summary class="xs muted">Answer</summary><p class="sm">${esc(q.a)}</p></details>${quizBtns(k, n, qi, q)}</li>`).join("")}</ol>${((u) => (u ? stateCtl("qz", u, "q" + n) : ""))(unitByK(k))}`;
function wsCount(k, W) {
  let tot = 0,
    ans = 0;
  W.forEach(([_, its], si) =>
    its.forEach((it, ii) => {
      tot++;
      const v = A(k, si + "-" + ii);
      if (v !== undefined && v !== "" && !(typeof v === "object" && !Object.keys(v).length)) ans++;
    }),
  );
  return { tot, ans };
}
function refParts(u, id) {
  const P = u.c?.p;
  if (!P) return [];
  return P.days.filter((d) => d.steps.some((s) => s.ref === id)).map((d) => d.n);
}
function openWork() {
  const seen = new Set([
      ...S.log.map((l) => l.key),
      ...Object.keys(S.progress || {}).filter((k) => (S.progress[k].sessions || 0) > 0),
    ]),
    us = [...seen].map(unitByK).filter(Boolean),
    O = { wsGoing: [], wsMissed: [], going: [], finish: [], soon: [], started: [], planned: [] },
    held = new Set();
  us.forEach((u) => {
    const P = u.c?.p,
      dn = done(u.k);
    (P?.worksheets || []).forEach((w) => {
      const k = u.k + "#" + w.id;
      if (taskDone(k, "ws")) return;
      const c = wsCount(k, w.sections);
      if (c.ans > 0) O.wsGoing.push({ u, w, ...c });
      else if ((w.day || 99) <= dn) O.wsMissed.push({ u, w, ...c });
    });
    if (u.c?.x?.wsd && !taskDone(u.k, "ws")) {
      const c = wsCount(u.k, u.c.x.wsd);
      if (c.ans > 0) O.wsGoing.push({ u, w: { id: "", title: "Chapter worksheet", tier: "" }, ...c });
    }
    [...(P?.experiments || []), ...(P?.activities || [])].forEach((e) => {
      const R = refParts(u, e.id);
      if (R.length < 2 || taskDone(u.k, e.id) || ["planned", "skip"].includes(WK()[u.k + "|" + e.id]?.st)) return;
      const a = R[0],
        z = R[R.length - 1];
      if (a <= dn && dn < z) {
        O.going.push({ u, e, a, z, next: R.find((r) => r > dn) });
        held.add(u.k + "|" + e.id);
      } else if (dn >= z) {
        O.finish.push({ u, e, a, z });
        held.add(u.k + "|" + e.id);
      }
    });
  });
  Object.entries(WK()).forEach(([key, w]) => {
    if (held.has(key) || w.st === "done") return;
    const j = key.lastIndexOf("|"),
      u = unitByK(key.slice(0, j));
    if (!u) return;
    const x = { u, id: key.slice(j + 1), w };
    if (w.st === "started") O.started.push(x);
    else if (w.st === "planned") O.planned.push(x);
  });
  S.subjects.forEach((s) =>
    schedule(s, 28).forEach((x) => {
      const P = x.u.c?.p;
      if (!P) return;
      [...(P.experiments || []), ...(P.activities || [])].forEach((e) => {
        const R = refParts(x.u, e.id);
        if (R.length >= 2 && R[0] === x.n && !taskDone(x.u.k, e.id) && !WK()[x.u.k + "|" + e.id])
          O.soon.push({ u: x.u, e, date: x.date, n: x.n, z: R[R.length - 1], prep: pkDay(x.u, x.n).prep || [] });
      });
    }),
  );
  O.soon.sort((a, b) => (a.date < b.date ? -1 : 1));
  return O;
}
const openCount = () => {
  const O = openWork();
  return (
    O.wsGoing.length +
    O.wsMissed.length +
    O.going.length +
    O.finish.length +
    O.started.length +
    O.planned.length +
    (S.exps || []).filter((e) => !e.closed).length
  );
};
function todoView() {
  document.getElementById("sheetTitle").textContent = "To finish";
  const O = openWork(),
    ex = (S.exps || []).filter((e) => !e.closed),
    wsRow = (x, miss) =>
      `<div class="pk"><span class="eyebrow">${esc(chT(x.u))} · ${esc(SUBJ[x.u.subj])}</span><b>${esc(x.w.title)}${x.w.tier ? ` <span class="xs muted">(${esc(TIER[x.w.tier] || "")})</span>` : ""}</b><p class="xs muted">${miss ? `Planned for Part ${x.w.day}, which you've done · not started` : `${x.ans} of ${x.tot} questions answered`}</p><div class="row"><button class="btn accent sm" data-act="ws" data-k="${x.u.k}" ${x.w.id ? `data-w="${esc(x.w.id)}"` : ""}>${miss ? "Start it" : "Continue"}</button></div></div>`;
  const sec = (t, n, body, empty) =>
      `<section class="sec"><div class="sech"><h3 style="font-size:18px">${t}</h3><span class="pill">${n}</span></div>${n ? body : `<p class="xs muted">${empty}</p>`}</section>`,
    wkRow = (x) =>
      `<div class="pk"><span class="eyebrow">${esc(chT(x.u))} · ${esc(SUBJ[x.u.subj])}</span><b>${esc(x.w.title || wkTitle(x.u, x.id, ""))}</b>${taskLine(x.u, x.id, x.w.title)}<div class="row"><button class="link xs" data-act="chapter" data-k="${x.u.k}" data-t="lab">Open in the chapter</button></div></div>`;
  let h = `<p class="sm muted">Everything left open, in one place. Tick things off where they are, or open them from here.</p><button class="link" data-act="folder" style="justify-self:start">Work folder: everything finished, with answers →</button>`;
  h += sec("Worksheets started", O.wsGoing.length, O.wsGoing.map((x) => wsRow(x, false)).join(""), "None half-done.");
  h += sec(
    "Worksheets missed",
    O.wsMissed.length,
    O.wsMissed.map((x) => wsRow(x, true)).join(""),
    "No worksheets left behind from finished parts.",
  );
  h += sec(
    "Projects underway",
    O.going.length + O.started.length + ex.length + O.finish.length,
    [
      ...O.started.map(wkRow),
      ...O.going.map(
        (x) =>
          `<div class="pk"><span class="eyebrow">${esc(chT(x.u))} · Parts ${x.a}–${x.z}</span><b>${esc(x.e.title)}</b><p class="xs muted">Runs from Part ${x.a}. Next check-in: Part ${x.next}.</p>${taskLine(x.u, x.e.id, x.e.title)}</div>`,
      ),
      ...O.finish.map(
        (x) =>
          `<div class="pk"><span class="eyebrow">${esc(chT(x.u))} · Parts ${x.a}–${x.z}</span><b>${esc(x.e.title)}</b><p class="xs muted">All its parts are done. Mark it finished when the result is recorded.</p>${taskLine(x.u, x.e.id, x.e.title)}</div>`,
      ),
      ...ex.map((e) => {
        const day = Math.round((parse(today) - parse(e.start)) / 864e5) + 1,
          c = e.checks.includes(today);
        return `<div class="pk"><span class="eyebrow">Tracking daily · day ${day}</span><b>${esc(e.title)}</b><p class="xs muted">${esc(e.topic || "")}${c ? " · checked today" : ""}</p><div class="row"><button class="btn soft sm" data-act="check" data-e="${e.id}">${c ? "Checked today ✓" : "Check today"}</button><button class="link xs" data-act="close" data-e="${e.id}">Finish it</button></div></div>`;
      }),
    ].join(""),
    "No projects running right now.",
  );
  h += sec(
    "Your pipeline",
    O.planned.length,
    O.planned.map(wkRow).join(""),
    "Nothing saved for later. Tap “+ Pipeline” on any activity, experiment or project to keep it here.",
  );
  h += sec(
    "Projects coming up",
    O.soon.length,
    O.soon
      .map(
        (x) =>
          `<div class="pk"><span class="eyebrow">${esc(fmt(x.date))} · ${esc(chT(x.u))} · ${x.z > x.n ? `Parts ${x.n}–${x.z}` : `Part ${x.n}`}</span><b>${esc(x.e.title)}</b>${x.e.time ? `<p class="xs muted">${esc(x.e.time)}</p>` : ""}${x.e.need?.length ? `<p class="xs"><b>Get ready:</b> ${x.e.need.map(esc).join(", ")}</p>` : ""}${x.prep.map((q) => `<p class="xs"><b>Prep (${esc(q.when)}):</b> ${esc(q.task)}</p>`).join("")}${taskLine(x.u, x.e.id, x.e.title)}</div>`,
      )
      .join(""),
    "Nothing multi-part starts in the next four weeks.",
  );
  return h;
}
const PL = {
  queue: "Up next",
  events: "Classes, outings and to-dos",
  calendar: "Bring in your calendars",
  day: "Your day",
  pace: "Pace",
  asks: "DeepKids asks",
};
function plView() {
  const p = ui.sheet.p;
  document.getElementById("sheetTitle").textContent = PL[p] || "Planner";
  if (p === "queue") return queueCard();
  if (p === "calendar") return calendarCard();
  return plPart(p) || `<p class="note">Nothing here yet.</p>`;
}
function plPart(p) {
  let h = "";
  if (p === "asks") {
    const Q = askList();
    if (Q.length)
      h += `<section class="sec"><div class="sech"><h3>DeepKids asks</h3></div><div class="col" style="gap:8px">${Q.map(([q, a]) => `<button class="askq" data-act="askq" data-a="${esc(a)}">${blob("var(--sun)", 8, "wow", "", 'width="34" height="34"')}<span>${q}</span>${icon("next")}</button>`).join("")}</div></section>`;
  }
  if (p === "events") {
    const evs = S.events || [],
      tds = (S.todos || []).filter((x) => !x.done);
    h += `<section class="sec"><div class="sech"><h3>Classes, outings and to-dos</h3><button class="link" data-act="toplan">+ Add</button></div>${evs.length || tds.length ? `<div class="tt">${evs.map((e) => `<div class="tcard ${e.kind === "outing" ? "r-out" : "r-" + e.who}"><span class="ic">${icon("event")}</span><span class="m"><b>${esc(e.title)}</b><span>${clock(hm(e.start))} · ${e.rep === "weekly" ? "every " + e.days.map((d) => DAYN[d]).join(", ") : fmt(e.date)} · ${ROLE[e.kind === "outing" ? "out" : e.who]}</span></span><button class="iconbtn" style="width:38px;height:38px" data-act="delev" data-e="${e.id}" aria-label="Remove ${esc(e.title)}">${icon("close")}</button></div>`).join("")}${tds.map((x) => `<div class="tcard r-${x.who}"><span class="ic">${icon("prep")}</span><span class="m"><b>${esc(x.title)}</b><span>${fmt(x.date)} · any time · ${ROLE[x.who]}</span></span><button class="iconbtn" style="width:38px;height:38px" data-act="tododel" data-t="${x.id}" aria-label="Remove ${esc(x.title)}">${icon("close")}</button></div>`).join("")}</div>` : `<p class="note">Nothing yet. Tell DeepKids above, or add by hand.</p>`}</section>`;
  }
  if (p === "day") {
    const d = D();
    h += `<section class="sec"><div class="sech"><h3>Your day</h3></div><div class="card"><div class="fgrid">
    <div class="field"><label for="dPrep">Morning prep</label><input class="inp" id="dPrep" type="time" data-dayset="prepAt" value="${d.prepAt}"></div><div class="field"><label for="dStart">Lessons start</label><input class="inp" id="dStart" type="time" data-dayset="start" value="${d.start}"></div>
    <div class="field"><label for="dBrk">Break between</label><select class="inp" id="dBrk" data-dayset="brk">${[0, 10, 15, 20, 30].map((x) => `<option value="${x}" ${+d.brk === x ? "selected" : ""}>${x} min</option>`).join("")}</select></div>
    <div class="field"><label for="dLunch">Lunch at</label><input class="inp" id="dLunch" type="time" data-dayset="lunch" value="${d.lunch}"></div><div class="field"><label for="dLunchM">Lunch length</label><select class="inp" id="dLunchM" data-dayset="lunchMin">${[30, 45, 60, 90].map((x) => `<option value="${x}" ${+d.lunchMin === x ? "selected" : ""}>${x} min</option>`).join("")}</select></div>
    <div class="field"><label for="dEve">Evening prep</label><input class="inp" id="dEve" type="time" data-dayset="eveAt" value="${d.eveAt}"></div>${fxWeekRow()}<div class="field"><label for="dEnd">Learning ends by</label><input class="inp" id="dEnd" type="time" data-dayset="endAt" value="${d.endAt || "18:30"}"></div></div></div></section>`;
  }
  if (p === "pace") {
    h += `<section class="sec"><div class="sech"><h3>Pace</h3><span class="xs muted">Change anything and the year re-plans</span></div>${S.subjects
      .map((s) => {
        const sc = schedule(s),
          cur = sc.filter((x) => x.u.level === S.levels[s]),
          l = S.levels[s];
        return `<div class="card ${SC(s)}"><div class="sech"><div class="row" style="gap:8px">${sblob(s, "happy", "", 'width="34" height="34"')}<h3>${SUBJ[s]}</h3></div><div class="stepper"><button data-act="lvl" data-s="${s}" data-d="-1" ${l <= 1 ? "disabled" : ""} aria-label="Class down">−</button><span class="sm" style="min-width:64px;text-align:center">Class ${l}</span><button data-act="lvl" data-s="${s}" data-d="1" ${l >= 5 ? "disabled" : ""} aria-label="Class up">+</button></div></div>
     <div class="row"><select class="inp" style="width:auto;height:40px" id="hpd-${s}" data-hpd="${s}" aria-label="${SUBJ[s]} hours a day">${[0.25, 0.5, 0.75, 1, 1.5, 2, 3].map((v) => `<option value="${v}" ${hpdOf(s) === v ? "selected" : ""}>${v} h a day</option>`).join("")}</select><div class="dpick">${[1, 2, 3, 4, 5, 6, 0].map((dd) => `<button aria-pressed="${daysOf(s).includes(dd)}" data-act="day" data-s="${s}" data-d="${dd}">${DAYN[dd]}</button>`).join("")}</div></div>
     <p class="xs muted">${lvlLabel(l)} · ${cur.length} lesson days left at this level${cur.length ? `, finishing around ${fmt(cur[cur.length - 1].date)}` : ""}</p></div>`;
      })
      .join("")}</section>`;
  }
  return h;
}
const qPos = (u) =>
  plannedUnits(u.subj)
    .filter((z) => rank[coverage(z)] < 2 || z.k === u.k)
    .findIndex((z) => z.k === u.k) + 1;
function queueCard() {
  const s = S.subjects.includes(ui.qs) ? ui.qs : S.subjects[0];
  if (!s) return "";
  const extra = (S.extra || {})[s] || [],
    L0 = plannedUnits(s).filter((u) => rank[coverage(u)] < 2),
    L = L0.filter((u, i) => i < 8 || extra.includes(u.k)),
    sh = !!(S.shuffle || {})[s];
  const radio = allUnits()
    .filter(
      (u) =>
        u.subj === s &&
        (u.board === "gen" || (u.board === "dk" && plusOn())) &&
        !plannedUnits(s).some((z) => z.k === u.k),
    )
    .slice(0, 4);
  return `<section class="sec"><div class="sech"><h3>Up next</h3><span class="xs muted">${modeOf() === "books" ? "Syllabus books" : MODES[modeOf()][0]}</span></div>
   <div class="seg">${S.subjects.map((x) => `<button aria-pressed="${x === s}" data-act="qsub" data-s="${x}">${SUBJ[x]}</button>`).join("")}</div>
   <div class="row"><button class="btn ${sh ? "" : "soft"} sm" data-act="shuffle" data-s="${s}">${icon("spark")}Smart shuffle ${sh ? "on" : "off"}</button>${sh ? `<button class="btn soft sm" data-act="reshuffle" data-s="${s}">Shuffle again</button>` : ""}<button class="btn ${S.exam ? "" : "soft"} sm" data-act="exam">${S.exam ? "Exam track on" : "Exam track off"}</button></div>
   <p class="xs muted">${sh ? "Shuffle respects what each topic needs first, and never drops a syllabus chapter." : "Book order."} ${S.exam ? "Exam track keeps every syllabus chapter first; extra topics come after." : "Extra topics are mixed in between syllabus chapters."}</p>
   <div class="col" style="gap:8px">${L.map((u, i) => {
     const T = tagsOf(u)[0];
     return `<div class="qrow ${SC(u.subj)}${u.k === ui.flash ? " flash" : ""}"><span class="qn">${L0.indexOf(u) + 1}</span><button class="plain" data-act="chapter" data-k="${u.k}" style="min-width:0"><b style="font:600 15.5px var(--display)">${esc(u.title)}</b><br><span class="xs muted">${u.board === "gen" ? "DeepKids topic" : u.board === "dk" ? "DeepKids Plus" : esc(T?.txt || u.book)} · ${sessionsFor(u)} days</span></button><span class="row" style="gap:4px;flex-wrap:nowrap">${i ? `<button class="iconbtn" style="width:36px;height:36px" data-act="qnext" data-s="${s}" data-k="${u.k}" aria-label="Do ${esc(u.title)} next">${icon("play")}</button>` : `<span class="pill learning">Next</span>`}<button class="iconbtn" style="width:36px;height:36px" data-act="qlater" data-s="${s}" data-k="${u.k}" aria-label="Move ${esc(u.title)} to later">${icon("next")}</button>${extra.includes(u.k) ? `<button class="iconbtn" style="width:36px;height:36px" data-act="qrem" data-s="${s}" data-k="${u.k}" aria-label="Remove ${esc(u.title)}">${icon("close")}</button>` : ""}</span></div>`;
   }).join("")}</div>
   ${radio.length ? `<div class="sech"><h3 style="font-size:17px">More like this</h3><button class="link" data-act="lt2">Find topics</button></div><div class="row">${radio.map((u) => `<button class="chip ${SC(u.subj)}" data-act="qadd" data-s="${s}" data-k="${u.k}">${icon("plus")}${esc(u.title)}</button>`).join("")}</div>` : `<button class="link" data-act="lt2" style="justify-self:start">Find more topics →</button>`}</section>`;
}
const PV = { year: "Year", month: "Month", week: "Week", day: "Day" };
function firstDates() {
  const m = {};
  S.subjects.forEach((s) =>
    schedule(s, 400).forEach((x) => {
      if (!m[x.u.k]) m[x.u.k] = x.date;
    }),
  );
  S.log.forEach((l) => {
    if (!m[l.key] || l.date < m[l.key]) m[l.key] = l.date;
  });
  return m;
}
function yearOrbit() {
  const W = 360,
    c = 180,
    fd = firstDates(),
    st0 = parse([S.start, ...S.log.map((l) => l.date)].sort()[0] || today);
  const m0 = new Date(st0.getFullYear(), st0.getMonth(), 1);
  const ang = (ds) => {
    const d = parse(ds);
    return (
      (((d.getFullYear() - m0.getFullYear()) * 12 + d.getMonth() - m0.getMonth() + (d.getDate() - 1) / 31) / 12) *
        Math.PI *
        2 -
      Math.PI / 2
    );
  };
  const pt = (a, r) => [c + Math.cos(a) * r, c + Math.sin(a) * r];
  let o = "";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2,
      [x, y] = pt(a + Math.PI / 12, 166),
      [x1, y1] = pt(a, 52),
      [x2, y2] = pt(a, 156),
      md = new Date(m0.getFullYear(), m0.getMonth() + i, 1);
    o += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="2 5"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-family="Fredoka,sans-serif" font-size="11" font-weight="600" fill="var(--muted)">${md.toLocaleDateString(undefined, { month: "short" })}</text>`;
  }
  S.subjects.forEach((s, i) => {
    const r = 66 + i * 24;
    o += `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="color-mix(in srgb,${SUBJ_BLOB[s][0]} 35%,transparent)" stroke-width="10"/>`;
    plannedUnits(s).forEach((u) => {
      const d = fd[u.k];
      if (!d) return;
      const a = ang(d);
      if (a > Math.PI * 1.5) return;
      const [x, y] = pt(a, r),
        cs = coverage(u),
        dn = rank[cs] >= 2,
        lr = cs === "learning";
      o += `<g class="${SC(s)} bead ${lr ? "pulse" : ""}" data-act="chapter" data-k="${u.k}" role="button" aria-label="${esc(u.title)}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${lr ? 7.5 : 6}" fill="${dn || lr ? "var(--c)" : "var(--surface)"}" stroke="var(--c)" stroke-width="2.5"/>${dn ? `<path d="M${(x - 3).toFixed(1)} ${y.toFixed(1)}l2 2 4-4" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>` : ""}</g>`;
    });
  });
  const [nx, ny] = pt(ang(today), 158);
  o += `<line x1="${c}" y1="${c}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="var(--tang)" stroke-width="2.5" stroke-linecap="round"/><circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="5" fill="var(--tang)"/>`;
  return `<div class="orbit"><svg viewBox="0 0 ${W} ${W}" role="img" aria-label="The year's plan as orbits">${o}${kidBlob("bob", "happy", `x="${c - 26}" y="${c - 26}" width="52" height="52"`)}</svg></div><div class="row" style="justify-content:center">${S.subjects.map((s) => `<span class="chip ${SC(s)}"><span class="dotc"></span>${SUBJ[s]}</span>`).join("")}<span class="chip"><span class="dotc" style="--c:var(--tang)"></span>Today</span></div><p class="xs muted" style="text-align:center">Each ring is a subject; each bead is a chapter, placed in the month it starts. Filled beads are done; the glowing one is in progress. Tap a bead to open it.</p>`;
}
function sessMap() {
  const by = {};
  S.subjects.forEach((s) =>
    schedule(s, 120).forEach((x) => (by[x.date] = by[x.date] || []).push({ s: x.subj, t: x.u.title })),
  );
  S.log.forEach((l) => {
    if (l.date <= today) (by[l.date] = by[l.date] || []).push({ s: l.subj, t: l.title, done: 1 });
  });
  return by;
}
function monthView() {
  const by = sessMap(),
    b = new Date(parse(today));
  b.setDate(1);
  b.setMonth(b.getMonth() + (ui.pm || 0));
  const m = b.getMonth(),
    start = new Date(b);
  start.setDate(1 - ((b.getDay() + 6) % 7));
  let rows = "";
  for (let w = 0; w < 6; w++) {
    let cells = "";
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + w * 7 + i);
      const ds = iso(d),
        inM = d.getMonth() === m,
        L = by[ds] || [],
        ev = eventsOn(ds).length;
      cells += `<button class="mday ${inM ? "" : "out"} ${ds === today ? "today" : ""}" data-act="pday" data-d="${ds}"><b>${d.getDate()}</b><span class="beads">${L.map((x) => `<i class="${SC(x.s)} ${x.done ? "ok" : ""}"></i>`).join("")}${ev ? `<i class="ev"></i>` : ""}</span></button>`;
    }
    rows += `<div class="mrow">${cells}</div>`;
    if (new Date(start.getFullYear(), start.getMonth(), start.getDate() + (w + 1) * 7).getMonth() !== m && w >= 3)
      break;
  }
  return `<div class="pager"><button class="iconbtn" data-act="pmon" data-d="-1" aria-label="Previous month">${icon("back")}</button><h3 style="font-size:20px">${b.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</h3><button class="iconbtn" data-act="pmon" data-d="1" aria-label="Next month">${icon("next")}</button></div><div class="mhead">${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((x) => `<span>${x}</span>`).join("")}</div><div class="month">${rows}</div><p class="xs muted">Each bead is a lesson in that subject's colour; a pink diamond is a class or outing. Tap a day to see it.</p>`;
}
function weekView() {
  const by = sessMap(),
    m = parse(monday());
  m.setDate(m.getDate() + 7 * (ui.week || 0));
  const days = [...Array(7)].map((_, i) => {
    const d = new Date(m);
    d.setDate(m.getDate() + i);
    return iso(d);
  });
  return `<div class="pager"><button class="iconbtn" data-act="wk2" data-d="-1" aria-label="Previous week">${icon("back")}</button><h3 style="font-size:20px">${ui.week ? "Week of " + fmt(days[0]) : "This week"}</h3><button class="iconbtn" data-act="wk2" data-d="1" aria-label="Next week">${icon("next")}</button></div><div class="hs pebbles">${days
    .map((d, i) => {
      const L = by[d] || [],
        ev = eventsOn(d),
        td = todosOn(d).filter((x) => !x.done);
      return `<button class="pebble ${d === today ? "today" : ""}" style="--c:${PAL[i % PAL.length]}" data-act="pday" data-d="${d}"><span class="eyebrow">${DAYN[parse(d).getDay()]}</span><b>${parse(d).getDate()}</b>${L.map((x) => `<span class="pchip ${SC(x.s)} ${x.done ? "ok" : ""}">${esc(x.t)}</span>`).join("")}${ev.map((e) => `<span class="pchip r-out">${clock(hm(e.start))} ${esc(e.title)}</span>`).join("")}${td.map((x) => `<span class="pchip r-you">${esc(x.title)}</span>`).join("")}${!L.length && !ev.length && !td.length ? `<span class="xs muted">Free day</span>` : ""}</button>`;
    })
    .join("")}</div>`;
}
function dayView() {
  const d = ui.pday || today;
  return `<div class="pager"><button class="iconbtn" data-act="pdd" data-d="-1" aria-label="Previous day">${icon("back")}</button><h3 style="font-size:20px">${d === today ? "Today" : fmt(d)}</h3><button class="iconbtn" data-act="pdd" data-d="1" aria-label="Next day">${icon("next")}</button></div>${timeline(d)}`;
}
function askList() {
  const Q = [];
  if (!S.parent?.name) Q.push(["What should we call you?", "parent"]);
  if (!(S.events || []).some((e) => e.kind === "class" || e.kind === "online"))
    Q.push([
      `Does ${esc(S.child || "your child")} go to any classes or tuitions? Tell us the days and times.`,
      "say:Classes and tuitions: ",
    ]);
  if (!(S.alarm || {}).time) Q.push(["When do you usually wake up?", "parent"]);
  Q.push(["Any holidays, trips or family events coming up this month?", "say:Coming up this month: "]);
  if (boardsOn().includes("nios"))
    Q.push(["Are you planning to register for NIOS exams this year?", "say:About exams: "]);
  Q.push([`What does ${esc(S.child || "your child")} love doing these days?`, "say:These days they love: "]);
  return Q.slice(0, 3);
}
function dumpCard() {
  const D_ = ui.dump || {},
    n = (S.events || []).length + (S.todos || []).filter((t) => !t.done).length + (S.notes || []).length,
    empty = !D_.text && !D_.items && !D_.files?.length;
  return `<section class="card dump"><div class="row" style="flex-wrap:nowrap;gap:12px;align-items:center">${blob("var(--aqua)", 3, "wow", "", 'width="44" height="44"')}<div><h3 style="font-size:19px">Tell DeepKids anything</h3><p class="xs muted">Classes, trips, rest times, to-dos, things you own. Type, use your keyboard's mic, or send a photo.</p></div></div>
   ${D_.chat?.length || D_.items ? `<div class="chat">${D_.text ? `<div class="bub me">${esc(D_.text.split("\n")[0].slice(0, 200))}${D_.text.includes("\n") ? "…" : ""}</div>` : ""}</div>` : ""}
   ${D_.items ? `<div class="col" style="gap:8px"><span class="xs muted">Here's what we found. Untick anything that's wrong.</span>${D_.items.map((it, i) => `<div class="parsed ${it.keep ? "" : "off"}"><button class="ck ${it.keep ? "on" : ""}" data-act="dkeep" data-i="${i}" aria-label="Keep">${icon("check")}</button><div><b style="font:600 16px var(--display)">${esc(it.title)}</b><p class="xs muted">${esc(parsedLine(it))}</p></div><button class="pill" data-act="dwho" data-i="${i}">${it.type === "have" ? "We have it" : ROLE[it.who] || "For you"}</button></div>`).join("")}${dumpChat(D_)}<div class="row"><button class="btn green" data-act="dadd">${icon("check")}Add ${D_.items.filter((x) => x.keep).length} to my plan</button><button class="btn line sm" data-act="dclear">Clear</button></div></div>` : dumpChat(D_)}
   ${D_.err ? `<p class="sm" style="color:var(--bad)">${esc(D_.err)}</p>` : ""}
   ${needAICard(D_)}
   ${D_.files?.length ? `<div class="row" style="gap:6px"><span class="chip" style="pointer-events:none">${icon("plus")}${D_.files.length} photo${D_.files.length > 1 ? "s" : ""} attached</span><button class="link xs" data-act="dnofiles">Remove</button></div>` : ""}
   <div class="composer ${D_.busy ? "busy" : ""}">${IMGOK && SAMPLE ? `<label class="cbtn" aria-label="Add a photo or screenshot">📷<input type="file" id="dumpImg" accept="image/*" multiple hidden></label>` : lockBtn("photo", "cbtn", "📷")}<textarea class="inp" id="dumpText" rows="1" placeholder="${D_.items || D_.chat?.length ? "Add more…" : "Type or speak a plan…"}">${esc(D_.items ? "" : D_.text || "")}</textarea><button class="send" data-act="dump" aria-label="Sort it into my plan" ${D_.busy ? "disabled" : ""}>${D_.busy ? `<span class="dots"><i></i><i></i><i></i></span>` : icon("next")}</button></div>
   ${D_.busy ? `<p class="xs muted">Reading it and putting it on your plan…</p>` : ""}
   ${empty ? `<div class="dex">${DEX.map(([l, t]) => `<button class="chip" data-act="dex" data-t="${esc(t)}">${esc(l)}</button>`).join("")}</div>` : ""}
   ${SAMPLE ? "" : `<p class="xs muted">Read on this phone: classes, times, days, dates, rest and to-dos. Photos 📷 and longer messages are part of DeepKids Plus.</p>`}
   <div class="row dfoot"><button class="link sm" data-act="told">What you've told us · ${n}</button><button class="link sm" data-act="dhand" aria-expanded="${!!ui.dhand}">${ui.dhand ? "Hide add by hand" : "Add by hand"}</button></div>
   ${ui.dhand ? `<div class="handbox">${quickAdd(ui.pday || today)}</div>` : ""}</section>`;
}
function parsedLine(it) {
  if (it.type === "have") return "Library · " + (it.category || "other");
  if (it.type === "update") {
    const e = (S.events || []).find((z) => z.id === it.id);
    return (
      "Change" +
      (e ? ` “${e.title}”` : "") +
      ": " +
      [
        it.days?.length ? dayList(it.days) : "",
        it.start ? clock(hm(it.start)) + (it.end ? "–" + clock(hm(it.end)) : "") : "",
      ]
        .filter(Boolean)
        .join(" · ")
    );
  }
  const when = it.days && it.days.length ? dayList(it.days) : it.date ? fmt(it.date) : "Today";
  return [
    it.type === "tuition" ? "class" : it.type,
    when,
    it.start
      ? clock(hm(it.start)) + (it.end ? "–" + clock(hm(it.end)) : "")
      : it.type === "todo" || it.type === "note"
        ? ""
        : "time not set",
    it.note,
  ]
    .filter(Boolean)
    .join(" · ");
}
// One part of the Plan screen; the tabs below put these together
function planPart(k) {
  const v = ui.pv || "week";
  if (k === "tell") {
    const Q = askList();
    return (
      `<section class="sec">${dumpCard()}</section>` +
      (Q.length ? plPart("asks") : "") +
      (ui.sheet?.mode === "told" ? "" : `<section class="sec">${toldView()}</section>`) +
      `<div id="paceSec">${dayTimesCard()}${subjCard()}${profCard()}${plPart("pace")}${rfCard()}</div>`
    );
  }
  if (k === "cal")
    return `<section class="sec"><div class="seg">${Object.entries(PV)
      .map(([kk, nm]) => `<button aria-pressed="${v === kk}" data-act="pv" data-v="${kk}">${nm}</button>`)
      .join("")}</div>${{ year: yearOrbit, month: monthView, week: weekView, day: dayView }[v]()}</section>`;
  if (k === "todo") return todoTab();
  if (k === "queue")
    return (
      combinedNote() +
      fxCoverageNote() +
      fxWeekList() +
      queuesView() +
      ((WT[ui.tq] ? ui.tq : "les") === "les"
        ? `<section class="sec"><button class="link" data-act="pacego" style="justify-self:start">Pace: hours, days and class for each subject → Tell DeepKids</button></section>`
        : "")
    );
  if (k === "pending") return newView();
  return goingView();
}
// Plan: This week, Up next, To finish and Settings
function viewPlanner() {
  const k = seg("week"),
    head = pageHead("Plan") + segBar("week") + `</section>`;
  initDrag();
  if (k === "cal") {
    ui.pv = ui.pv || "week";
    return (
      head +
      planPart("cal") +
      `<details class="sec fxfold"><summary><b>Your to-dos and things to get ready</b></summary>${planPart("todo")}</details>`
    );
  }
  if (k === "next") {
    const L = planPart("queue"),
      i = L.indexOf('<div class="seg qtypes"'),
      j = L.lastIndexOf("<section", i);
    return (
      head +
      (j > 0
        ? `<details class="sec fxfold"><summary><b>The year at a glance</b> <span class="xs muted">· on track? · this week\'s shopping</span></summary>${L.slice(0, j)}</details>` +
          L.slice(j)
        : L)
    );
  }
  if (k === "finish")
    return (
      head +
      `<h3 class="fxsh">Started</h3>${planPart("ongoing")}<h3 class="fxsh">Done, but parts left</h3>${planPart("pending")}<h3 class="fxsh">Practise again</h3>${fxPractiseAll()}`
    );
  return head + planPart("tell");
}
async function runDump() {
  const ta = document.getElementById("dumpText"),
    D_ = (ui.dump = ui.dump || {}),
    typed = (ta?.value || "").trim(),
    text = (
      D_.items && typed && D_.text && !D_.text.includes(typed) ? D_.text + "\n" + typed : typed || D_.text || ""
    ).trim();
  D_.text = text;
  if (!SAMPLE) {
    if (!text) {
      D_.err = "Type something first.";
      sfx("no");
      return render();
    }
    localDump(text);
    return;
  }
  if (!text && !D_.files?.length) {
    D_.err = "Type something or add a photo first.";
    sfx("no");
    return render();
  }
  D_.busy = true;
  D_.err = "";
  render();
  const prompt = `You are the planning helper inside DeepKids, a homeschool planner used by a parent in India. Today is ${new Date().toLocaleDateString("en-IN", { weekday: "long" })} ${today}. The child is ${S.child || "the child"}, age ${S.age}. The day's lessons start at ${D().start}; lunch is at ${D().lunch}.
Routines and classes already in the plan:
${routinesText()}
The parent wrote the message below${D_.files?.length ? " and attached photos (they may be WhatsApp screenshots, notes, timetables or receipts)" : ""}${D_.chat?.length ? ". It ends with their answers to your earlier questions" : ""}.
Pull out every class, tuition, online class, outing, rest or nap, meal, chore, to-do, exam, reminder, and every learning item the family owns (books, games, electronics, equipment, tools).
Rules:
- Anything that repeats ("every day", "weekdays", "on Mondays") is weekly, with "days" as numbers, 0 = Sunday to 6 = Saturday. "Every day" is [0,1,2,3,4,5,6]; "weekdays" is [1,2,3,4,5]. Never make a repeating thing a todo.
- Rest, naps, sleep and meals are type "rest" or "meal" with a start and end. A time given relative to something ("1 hour rest after tuition") gets real times worked out from that thing's end time, on the same days.
- Times are 24-hour HH:MM. "4pm-5pm" is 16:00–17:00. If only a length is given, set end from it.
- If an item is already in the list above, leave it out. If the message changes one (new time, new days), return {"type":"update","id":"<its id>", with the new fields}.
- "who" is "you" (the parent alone), "kid" (the child alone, parent free), or "both".
- Resolve dates like "tomorrow" or "next Friday" to YYYY-MM-DD.
- A "todo" is a one-off task with no fixed time. A "note" is only for facts that can't go on a calendar.
- Ask a question only when a needed time or day is really missing and can't be worked out. Never ask about something already in the list above. One short question per gap, at most 3.
- Never invent details.
Reply with only JSON: {"items":[{"type":"class|tuition|online|outing|rest|meal|chore|todo|exam|reminder|have|note|update","id":null,"title":"short title","who":"you|kid|both","date":null,"days":null,"start":null,"end":null,"note":"","category":"book|game|electronics|equipment|tool|other"}],"questions":["..."]}
Message:
"""${text.slice(0, 6000)}"""`;
  try {
    const opt = { modelTier: "quick", cache: false };
    if (D_.files?.length) opt.images = D_.files;
    const r = await SAMPLE.json(prompt, opt);
    D_.items = (Array.isArray(r?.items) ? r.items : [])
      .filter((x) => x && (x.title || x.type === "update"))
      .map((x) => ({
        ...x,
        title: x.title || (S.events || []).find((e) => e.id === x.id)?.title || "Change",
        who: ["you", "kid", "both"].includes(x.who) ? x.who : x.type === "rest" ? "kid" : "you",
        keep: true,
      }))
      .map(fixItem);
    D_.questions = Array.isArray(r?.questions) ? r.questions.filter((q) => typeof q === "string").slice(0, 3) : [];
    if (D_.items.length) clearIn("dumpText");
    if (!D_.items.length && !D_.questions.length) D_.err = "We couldn't find plans in that. Try adding days and times.";
    sfx(D_.items.length ? "ok" : "no");
  } catch (e) {
    D_.err =
      {
        not_granted: "Claude wasn't allowed for this page, so we can't sort it. Use quick add below.",
        rate_limited: "Too many requests just now. Try again in a minute.",
        image_rejected: "That photo couldn't be read. Try a different one.",
        invalid_json: "We couldn't read the answer. Try again.",
        images_unavailable: "Photos can't be sent from this view. Type it instead.",
      }[e?.code] || "Something went wrong. Try again.";
    sfx("no");
  }
  D_.busy = false;
  render();
}
function addParsed() {
  clearIn("dumpText");
  const D_ = ui.dump;
  if (!D_?.items) return;
  let n = 0;
  const got = [];
  D_.items
    .filter((x) => x.keep)
    .forEach((x) => {
      n++;
      const id = Math.random().toString(36).slice(2, 9);
      got.push(x.title + " · " + parsedLine(x));
      if (x.type === "have") {
        S.inv = [...(S.inv || []), { id, name: x.title, cat: x.category || "other", note: x.note || "", from: "told" }];
        return;
      }
      if (x.type === "note") {
        S.notes = [...(S.notes || []), { id, text: x.title + (x.note ? ": " + x.note : ""), date: today }];
        return;
      }
      if (x.type === "update") {
        const e = (S.events || []).find((z) => z.id === x.id);
        if (e) {
          if (x.start) e.start = x.start;
          if (x.end) e.end = x.end;
          if (x.days?.length) {
            e.days = x.days;
            e.rep = "weekly";
            e.date = null;
          }
          if (x.date && !x.days?.length) {
            e.date = x.date;
          }
          if (x.title && x.title !== "Change") e.title = x.title;
        }
        return;
      }
      const kind =
          { class: "class", tuition: "class", online: "online", outing: "outing", rest: "rest", meal: "meal" }[
            x.type
          ] || "other",
        rep = x.days?.length ? "weekly" : "once";
      if (x.start || rep === "weekly" || kind !== "other") {
        const end = x.start ? (x.end && hm(x.end) > hm(x.start) ? x.end : clock24(hm(x.start) + 60)) : null;
        S.events = [
          ...(S.events || []),
          {
            id,
            title: x.title,
            kind,
            who: x.who,
            start: x.start || null,
            end,
            rep,
            date: rep === "weekly" ? null : x.date || today,
            days: x.days || [],
            from: today,
            note: x.note || "",
          },
        ];
      } else
        S.todos = [
          ...(S.todos || []),
          { id, title: x.title, who: x.who, date: x.date || today, note: x.note || "", done: false },
        ];
    });
  S.said = [
    ...(S.said || []),
    {
      id: Math.random().toString(36).slice(2, 9),
      at: Date.now(),
      date: today,
      text: (D_.text || "").slice(0, 2000),
      chat: D_.chat || [],
      added: got,
    },
  ].slice(-300);
  ui.dump = {};
  sfx("win");
  toast(`Added ${n} to your plan · see What you've told us`);
  commit();
}
const clock24 = (m) => String(Math.floor(m / 60) % 24).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
