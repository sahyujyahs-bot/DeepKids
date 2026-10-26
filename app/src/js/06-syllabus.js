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
const plusOn = () => modeOf() !== "books";
let SHARED = { topics: [] };
const genUnit = (g) => ({
  k: "gen|" + g.id,
  board: "gen",
  subj: g.subj,
  level: g.level || 1,
  book: "DeepKids topic",
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
// DeepKids topics (the big-question lessons) are Science. They join the plan by themselves on the DeepKids
// track, Waldorf and DeepKids-only; board families follow their book, and can add any topic from the Library.
function dkUnits(subj, lvl) {
  if (subj !== "sci" || lvl !== S.levels[subj]) return [];
  const ex = (S.extra || {})[subj] || [],
    auto = ["combined", "waldorf", "none"].includes(S.board),
    seen = new Set();
  return DATA.topics
    .filter(
      (t) =>
        ex.includes("dk|" + t.id) || (auto && (t.subj || "sci") === "sci" && (t.cls || [1, 2, 3, 4, 5]).includes(lvl)),
    )
    .filter((t) => !seen.has(t.id) && seen.add(t.id))
    .map(dkUnit);
}
const dkUnit = (t) => ({
  k: "dk|" + t.id,
  board: "dk",
  subj: "sci",
  level: 1,
  book: "DeepKids Science",
  n: t.id,
  title: t.name,
  dk: [],
  topic: t,
});
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
    dk: dkUnits(subj, lvl),
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
function notesFor(subj, lvl) {
  const n = [];
  boardsOn().forEach((b) => {
    const x =
      b === "ncert" ? DATA.notes.ncert[subj + "|" + lvl] : (DATA.notes[b]?.[subj + "|" + lvl] ?? DATA.notes[b]?.[subj]);
    if (x) n.push(BOARDS[b] + ": " + x);
  });
  if (S.plus && subj === "sci" && lvl !== 1)
    n.push("DeepKids Plus Science for Level " + lvl + " is being written. Level 1 is ready.");
  if (S.plus && subj !== "sci") n.push("DeepKids Plus " + SUBJ[subj] + " is being written.");
  return n;
}
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
    return orderUnits(
      s,
      fxExpand(base),
      m === "books" ? [...c.ex, ...c.gen] : [...c.ex, ...c.dk, ...c.gen],
      m === "plus" ? 1 : 2,
    );
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
  return orderUnits(s, base, m === "books" ? [...c.ex, ...c.gen] : [...c.ex, ...c.dk, ...c.gen], m === "plus" ? 1 : 2);
}
function orderUnits(s, base, extra, every) {
  const later = (S.later || {})[s] || [],
    nx = (S.next || {})[s] || [];
  let b = (S.shuffle || {})[s] ? smartShuffle(base, s) : base;
  const out = [];
  if (S.exam || !b.length || !extra.length) out.push(...b, ...extra);
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
    const ok = left.filter((u) => prereqOf(u).every((k) => placed.has(k) || !inList.has(k) || rank[st(k)] >= 2));
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
  return o;
}
const everyUnit = () =>
  S.subjects.flatMap((s) =>
    [1, 2, 3, 4, 5].flatMap((l) => {
      const c = collateAt(s, l);
      return [...c.dk, ...c.board, ...c.gen, ...c.ex];
    }),
  );
const unitBy = (k) => everyUnit().find((u) => u.k === k) || allUnits().find((u) => u.k === k);
const st = (k) => (k.startsWith("unit|") ? fxUnitSt(k) : S.progress[k]?.status || "none");
const done = (k) => (k.startsWith("unit|") ? fxSessionsDone(k) : S.progress[k]?.sessions || 0);
const rank = { none: 0, learning: 1, completed: 2, mastered: 3 };
function coverage(u) {
  if (u.board !== "dk" && S.plus && u.dk.length) {
    const s = u.dk.map((id) => st("dk|" + id)),
      own = st(u.k);
    if (s.every((x) => rank[x] >= 2)) return rank[own] > 2 ? own : "completed";
    if (s.some((x) => x !== "none") || own !== "none") return rank[own] > 1 ? own : "learning";
    return own;
  }
  return st(u.k);
}
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
          : u.board === "dk"
            ? u.topic.weeks * 2.25
            : DEF_UNIT_H[u.board][u.subj];
const hoursFor = (u) => S.hrs[u.k] ?? estHours(u);
const sessionsFor = (u) =>
  u.board === "unit"
    ? fxSpineDays(u).length
    : u.c?.p
      ? u.c.p.days.length
      : Math.max(1, Math.ceil(hoursFor(u) / hpdOf(u.subj) - 1e-9));
function schedule(subj, limitDays = 420, fromTomorrow = false) {
  const q = [];
  plannedUnits(subj).forEach((u) => {
    if (rank[coverage(u)] >= 2) return;
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
    )
      out.push({ date: s, subj, ...fxTake(queue, s) });
    d.setDate(d.getDate() + 1);
  }
  return out;
}
const nextUp = (s) => {
  const q = [];
  plannedUnits(s).forEach((u) => {
    if (rank[coverage(u)] >= 2) return;
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
    ...R.filter((x) => coverage(x.u) === "learning"),
    ...R.filter((x) => coverage(x.u) !== "learning"),
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
  if (u.board === "dk") (PRESET_EXP[u.n] || []).forEach((t) => addExp(t, u.title));
}
function addExp(title, topic) {
  if (!S.exps.some((e) => e.title === title && !e.closed))
    S.exps.push({ id: Math.random().toString(36).slice(2, 9), title, topic, start: today, checks: [], closed: false });
}
const el = (h) => {
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
const PLD = {
  gentle: "More pictures, fewer words, one step at a time",
  core: "Right for the class: practice and a little thinking",
  stretch: "Harder puzzles, more writing and reasoning",
};
const PDD = {
  explore: "Hands-on and playful first",
  deep: "A balance of doing and thinking",
  challenge: "Lots of big questions and design tasks",
};
const defLvl = (s) => {
  const l = S.levels?.[s] || 1;
  return l <= 2 ? "gentle" : l >= 5 ? "stretch" : "core";
};
function profOf(s) {
  const p = (S.prof || {})[s] || {};
  return {
    lvl: p.lvl || defLvl(s),
    depth: p.depth || "deep",
    auto: p.auto !== false,
    why: p.why || "",
    at: p.at || "",
  };
}
/* recent answers in a subject: raise the level when it's easy, lower it when it's hard (at most once a week) */
function profAuto() {
  if (!S.setup) return;
  const M = Object.values(lastAnswers()).filter((x) => x.d);
  let ch = false;
  S.subjects.forEach((s) => {
    const p = profOf(s);
    if (!p.auto || (p.at && (parse(today) - parse(p.at)) / 864e5 < 7)) return;
    const A = M.filter((x) => unitByK(x.k)?.subj === s)
      .sort((a, b) => (a.d < b.d ? 1 : -1))
      .slice(0, 20);
    if (A.length < 8) return;
    const acc = A.filter((x) => x.r).length / A.length,
      i = PLV.indexOf(p.lvl);
    let to = null,
      why = "";
    if (acc >= 0.85 && A.length >= 10 && i < 2) {
      to = PLV[i + 1];
      why = `${Math.round(acc * 100)}% right in the last ${A.length} answers`;
    } else if (acc <= 0.5 && i > 0) {
      to = PLV[i - 1];
      why = `${Math.round(acc * 100)}% right in the last ${A.length} answers`;
    }
    if (to) {
      S.prof = { ...(S.prof || {}), [s]: { ...((S.prof || {})[s] || {}), lvl: to, why, at: today } };
      ch = true;
    }
  });
  if (ch) save();
}
function profCard() {
  return `<section class="sec"><div class="sech"><h3>Learning profile</h3><span class="xs muted">${esc(S.child || "Your child")}'s level and depth in each subject</span></div>
  ${S.subjects
    .map((s) => {
      const p = profOf(s);
      return `<div class="card ${SC(s)}" style="gap:6px"><div class="sech"><b style="font:600 16px var(--display)">${SUBJ[s]}</b><label class="xs"><input type="checkbox" data-pauto="${s}" ${p.auto ? "checked" : ""}> Adjust by itself</label></div>
   <div class="seg">${PLV.map((l) => `<button aria-pressed="${p.lvl === l}" data-act="plv" data-s="${s}" data-v="${l}">${PLN[l]}</button>`).join("")}</div><p class="xs muted">${PLD[p.lvl]}${p.why ? ` · changed on ${esc(fmt(p.at))}: ${esc(p.why)}` : ""}</p>
   <div class="seg">${Object.keys(PDN)
     .map(
       (d) => `<button aria-pressed="${p.depth === d}" data-act="pdep" data-s="${s}" data-v="${d}">${PDN[d]}</button>`,
     )
     .join("")}</div><p class="xs muted">${PDD[p.depth]}</p></div>`;
    })
    .join("")}</section>`;
}
const BNAME = {
  combined: "Combined",
  ncert: "NCERT",
  cambridge: "Cambridge",
  nios: "NIOS",
  waldorf: "Waldorf",
  dk: "DeepKids Plus",
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
  const u = [...DATA.items, ...DATA.topics.map(dkUnit), ...SHARED.topics.map(genUnit), ...myBookItems()];
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
