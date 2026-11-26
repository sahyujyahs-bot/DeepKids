/* Boards, levels and syllabus: which chapters and topics a child does, in what order */
const boardsOn = () =>
  S.board === "combined"
    ? ["combined", "ncert", "cambridge", "nios"]
    : S.board === "none"
      ? []
      : S.boards?.length
        ? S.boards
        : [S.board];
const modeOf = () => S.mode || (S.board === "none" ? "plus" : S.plus ? "booksplus" : "books");
let SHARED = { topics: [] };
const genUnit = (g) => ({
  k: "gen|" + g.id,
  board: "gen",
  subj: g.subj,
  level: g.level || 1,
  book: "DeepKids track",
  n: "★",
  title: g.name,
  dk: [],
  gen: g,
});
function genUnits(subj, lvl) {
  const ex = (S.extra || {})[subj] || [];
  return SHARED.topics
    .filter(
      (g) =>
        g.subj === subj &&
        ((g.level || 1) === lvl || (lvl === S.levels[subj] && (g.level || 1) < lvl)) &&
        ex.includes("gen|" + g.id),
    )
    .map(genUnit);
}
function collateAt(subj, lvl) {
  const bo = [...boardsOn()];
  if (
    S.board !== "waldorf" &&
    S.board !== "none" &&
    !DATA.items.some((i) => i.subj === subj && i.level === lvl && bo.includes(i.board))
  )
    for (const f of ["ncert", "cambridge", "nios"])
      if (DATA.items.some((i) => i.subj === subj && i.level === lvl && i.board === f)) {
        bo.push(f);
        break;
      }
  return {
    board: DATA.items.filter((i) => i.subj === subj && i.level === lvl && bo.includes(i.board)),
    gen: genUnits(subj, lvl),
    ex: addedUnits(subj, lvl),
  };
}
function addedUnits(subj, lvl) {
  if (lvl !== S.levels[subj]) return [];
  const ex = (S.extra || {})[subj] || [];
  return [...DATA.items, ...myBookItems()].filter(
    (i) => i.subj === subj && ex.includes(i.k) && !(boardsOn().includes(i.board) && i.level >= lvl),
  );
}
const collate = (s) => collateAt(s, S.levels[s]);
function plannedAt(s, l) {
  // the DeepKids track follows its own topic list for the class
  const L = S.board === "combined" && DATA.combined?.[s]?.[l];
  if (L) {
    const c = collateAt(s, l),
      m = modeOf(),
      seen = new Set(),
      base = [];
    L.forEach((e) =>
      (e.k ? [e.k] : e.use || []).forEach((k) => {
        const u = unitByK(k);
        if (u && !seen.has(k)) {
          seen.add(k);
          base.push(u);
        }
      }),
    );
    return orderUnits(s, fxExpand(base), [...c.ex, ...c.gen], m === "plus" ? 1 : 2);
  }
  const c = collateAt(s, l),
    m = modeOf();
  let base = [];
  for (const b of [...boardsOn(), "ncert", "cambridge", "nios"]) {
    const u = c.board.filter((i) => i.board === b);
    if (u.length) {
      base = u;
      break;
    }
  }
  if (boardsOn()[0] === "combined") base = fxTrack(base, s, l);
  return orderUnits(s, base, [...c.ex, ...c.gen], m === "plus" ? 1 : 2);
}
function orderUnits(s, base, extra, every) {
  const later = (S.later || {})[s] || [],
    nx = (S.next || {})[s] || [];
  let b = (S.shuffle || {})[s] ? smartShuffle(base, s) : base;
  const out = [];
  if (!b.length || !extra.length) out.push(...b, ...extra);
  else {
    let j = 0;
    b.forEach((u, i) => {
      out.push(u);
      if ((i + 1) % every === 0 && j < extra.length) out.push(extra[j++]);
    });
    out.push(...extra.slice(j));
  }
  const front = nx.map((k) => out.find((u) => u.k === k)).filter(Boolean),
    back = out.filter((u) => later.includes(u.k) && !nx.includes(u.k));
  return [...front, ...out.filter((u) => !nx.includes(u.k) && !later.includes(u.k)), ...back];
}
function smartShuffle(list, s) {
  const R = rng(((S.seed || {})[s] || 7) + list.length),
    left = [...list],
    out = [],
    placed = new Set(),
    inList = new Set(list.map((u) => u.k));
  while (left.length) {
    const ok = left.filter((u) => prereqOf(u).every((k) => placed.has(k) || !inList.has(k) || rank[statusOf(k)] >= 2));
    const pool = ok.length ? ok : [left[0]],
      pick = pool[Math.floor(R() * pool.length)];
    out.push(pick);
    placed.add(pick.k);
    left.splice(left.indexOf(pick), 1);
  }
  return out;
}
function plannedUnits(s) {
  const o = [];
  for (let l = S.levels[s]; l <= 5; l++) o.push(...plannedAt(s, l));
  // a unit that sits in the plan of more than one level is one unit
  return [...new Map(o.map((u) => [u.k, u])).values()];
}
const everyUnit = () =>
  S.subjects.flatMap((s) =>
    [1, 2, 3, 4, 5].flatMap((l) => {
      const c = collateAt(s, l);
      return [...c.board, ...c.gen, ...c.ex];
    }),
  );
// unitBy is called many times on every screen, so its lookup table is built once for each set-up (track, boards, subjects,
// levels and mode); a unit in the family's own list wins over the same key in the full list
let _unitIdx = null,
  _unitSig = "";
function unitBy(k) {
  const sig = [
    S.board,
    (S.boards || []).join(),
    S.subjects.join(),
    JSON.stringify(S.levels),
    S.plus ? 1 : 0,
    S.mode || "",
    allUnits().length,
  ].join("|");
  if (!_unitIdx || sig !== _unitSig) {
    _unitIdx = new Map(allUnits().map((u) => [u.k, u]));
    const own = new Set();
    everyUnit().forEach((u) => {
      if (!own.has(u.k)) _unitIdx.set(u.k, u);
      own.add(u.k);
    });
    _unitSig = sig;
  }
  return _unitIdx.get(k);
}
const statusOf = (k) => (k.startsWith("unit|") ? fxUnitSt(k) : S.progress[k]?.status || "none");
const done = (k) => (k.startsWith("unit|") ? fxLogged(k.slice(5)) : S.progress[k]?.sessions || 0);
const rank = { none: 0, learning: 1, completed: 2, mastered: 3 };
const daysOf = (s) => S.days[s] || DEF_DAYS[s];
const hpdOf = (s) => (S.hpd && S.hpd[s]) || DEF_HPD[s];
const DEF_UNIT_H = {
  ncert: { math: 8, eng: 5, hin: 4, sci: 8 },
  cambridge: { math: 30, eng: 30, hin: 30, sci: 20 },
  nios: { math: 5, eng: 5, hin: 5, sci: 5 },
};
const estHours = (u) =>
  u.board === "unit"
    ? fxParts(u).reduce((a, p) => a + p[3], 0) / 60
    : u.c?.p
      ? (u.c.p.days.length * u.c.p.day_mins) / 60
      : u.board === "gen"
        ? +u.gen.hours || 3
        : u.c?.x?.hours
          ? u.c.x.hours.reduce((a, h) => a + h[1], 0)
          : DEF_UNIT_H[u.board][u.subj];
const hoursFor = (u) => S.hrs[u.k] ?? estHours(u);
const sessionsFor = (u) =>
  u.board === "unit"
    ? fxLogged(u.c.unit) + fxDays(u).length
    : u.c?.p
      ? u.c.p.days.length
      : Math.max(1, Math.ceil(hoursFor(u) / hpdOf(u.subj) - 1e-9));
function schedule(subj, limitDays = 420, fromTomorrow = false) {
  const q = [];
  plannedUnits(subj).forEach((u) => {
    if (rank[statusOf(u.k)] >= 2) return;
    const tot = sessionsFor(u);
    for (let i = Math.min(done(u.k), tot - 1); i < tot; i++) q.push({ u, n: i + 1, tot });
  });
  const queue = pinOrder(subj, q);
  const out = [];
  const days = daysOf(subj);
  let d = parse(S.start > today ? S.start : today);
  const doneToday = S.log.some((l) => l.date === today && l.subj === subj);
  for (let k = 0; k < limitDays && queue.length; k++) {
    const s = iso(d);
    if (
      days.includes(d.getDay()) &&
      fxWT(d.getDay()) !== "free" &&
      !S.skips[s + "|" + subj] &&
      !(s === today && (doneToday || fromTomorrow))
    ) {
      const ready = queue.filter((x) => ((S.hold || {})[x.u.k] || "") <= s); // "Tomorrow" holds a unit back until then
      if (ready.length) {
        const t = fxTake(ready, s);
        queue.splice(queue.indexOf(t), 1);
        out.push({ date: s, subj, ...t });
      }
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
}
const nextUp = (s) => {
  const q = [];
  plannedUnits(s).forEach((u) => {
    if (rank[statusOf(u.k)] >= 2) return;
    const tot = sessionsFor(u);
    for (let i = Math.min(done(u.k), tot - 1); i < tot; i++) q.push({ u, n: i + 1, tot });
  });
  return pinOrder(s, q)[0];
};
function pinOrder(s, q) {
  const pin = S.pin && S.pin[s],
    NX = (S.next || {})[s] || [],
    P = q.filter((x) => x.u.k === pin),
    N = NX.flatMap((k) => q.filter((x) => x.u.k === k && x.u.k !== pin)),
    R = q.filter((x) => x.u.k !== pin && !NX.includes(x.u.k));
  return [
    ...P,
    ...N,
    ...R.filter((x) => statusOf(x.u.k) === "learning"),
    ...R.filter((x) => statusOf(x.u.k) !== "learning"),
  ];
}
function logSession(u, kind) {
  if (u.board === "unit") {
    const d = new Date();
    S.log.unshift({
      date: today,
      key: u.k,
      subj: u.subj,
      title: u.title,
      kind,
      n: done(u.k),
      at: d.getHours() * 60 + d.getMinutes(),
      t: d.getTime(),
    });
    S.log = S.log.slice(0, 3000);
    return;
  }
  const p = S.progress[u.k] || { status: "none", sessions: 0 };
  p.sessions = (p.sessions || 0) + 1;
  if (p.status === "none") p.status = "learning";
  if (p.sessions >= sessionsFor(u) && p.status === "learning") p.status = "completed";
  p.updated = today;
  S.progress[u.k] = p;
  {
    const d = new Date();
    S.log.unshift({
      date: today,
      key: u.k,
      subj: u.subj,
      title: u.title,
      kind,
      n: p.sessions,
      at: d.getHours() * 60 + d.getMinutes(),
      t: d.getTime(),
    });
  }
  S.log = S.log.slice(0, 3000);
}
function addExp(title, topic, look) {
  if (!S.exps.some((e) => e.title === title && !e.closed))
    S.exps.push({ id: newId(), title, topic, look, start: today, checks: [], closed: false });
}
const htmlToEl = (h) => {
  const t = document.createElement("template");
  t.innerHTML = h.trim();
  return t.content;
};
const chNo = (u) => (/^\d+$/.test(u.n) ? "Ch " + u.n : "");
const lvlLabel = (l) => {
  const x = DATA.levels[l];
  return `Level ${l} · Class ${x.cls} · age ${x.age}`;
};
const sticker = (s) => `<span class="sticker ${s}">${STATUS[s]}</span>`;
const PLV = ["gentle", "core", "stretch"],
  PLN = { gentle: "Gentle", core: "Core", stretch: "Stretch" },
  PDN = { explore: "Explore", deep: "Deep", challenge: "Challenge" };
const defLvl = (s) => {
  const l = S.levels?.[s] || 1;
  return l <= 2 ? "gentle" : l >= 5 ? "stretch" : "core";
};
// how worksheets are picked for a subject: from the level of its class, unless a saved choice says otherwise
function profOf(s) {
  const p = (S.prof || {})[s] || {};
  return { lvl: p.lvl || defLvl(s), depth: p.depth || "deep" };
}
const BNAME = {
  combined: "Combined",
  ncert: "NCERT",
  cambridge: "Cambridge",
  nios: "NIOS",
  waldorf: "Waldorf",
  gen: "DeepKids",
};
function unitLabel(u) {
  if (!u) return "";
  const L =
    u.board === "ncert" || u.board === "waldorf"
      ? "Class " + u.level
      : u.board === "cambridge"
        ? "Stage " + u.level
        : u.board === "nios"
          ? "Level " + (u.level <= 3 ? "A" : "B")
          : "";
  const n =
    u.board === "ncert"
      ? "Ch " + u.n
      : u.board === "cambridge"
        ? /^\d+$/.test(u.n)
          ? "Unit " + u.n
          : u.n
        : u.board === "nios"
          ? "Lesson " + u.n
          : u.n;
  return `${BNAME[u.board] || ""}${L ? " " + L : ""} · ${u.subj === "sci" ? (u.board === "cambridge" ? "Science" : "EVS") : SUBJ[u.subj] || ""} · ${n} ${u.title}`;
}
let _ubk = null;
const unitByK = (k) => {
  if (!_ubk) {
    _ubk = new Map();
    allUnits().forEach((u) => _ubk.set(u.k, u));
  }
  return _ubk.get(k) || unitBy(k);
};
function chapterRank(u) {
  const mine = boardsOn().includes(u.board) ? 0 : 1,
    lv = S.levels?.[u.subj] || 3;
  return mine * 10 + Math.abs((u.level || lv) - lv);
}
function allUnits() {
  if (_all && _all.n === SHARED.topics.length + myBookItems().length) return _all.u;
  const u = [...DATA.items, ...SHARED.topics.map(genUnit), ...myBookItems()];
  _all = { n: SHARED.topics.length + myBookItems().length, u };
  return u;
}
const MODES = {
  books: [
    "Syllabus books",
    "Read the board's books, with a summary and curated resources for every chapter.",
    "var(--sky)",
  ],
  booksplus: [
    "Books + DeepKids Plus",
    "The books, plus our lesson plans, big questions, worksheets and games for each topic.",
    "var(--tang)",
  ],
  plus: [
    "DeepKids Plus first",
    "All syllabuses combined and more. Lesson plans lead; the books become suggested reading.",
    "var(--gum)",
  ],
};
