/* Progress: subjects, time, work, history, school reports and documents */
/* subject filter for the work lists (lessons have their own subject row) */
const qfOf = () => (S.subjects.includes(ui.qf) ? ui.qf : "all");
// a small labelled dropdown, only when there is more than one subject to choose from
const subjChips = () =>
  S.subjects.length > 1
    ? `<label class="row sm" style="align-items:center;gap:8px">Subject <select class="inp" id="qfSel" style="width:auto;height:40px">${["all", ...S.subjects].map((x) => `<option value="${x}" ${qfOf() === x ? "selected" : ""}>${x === "all" ? "All subjects" : SUBJ[x]}</option>`).join("")}</select></label>`
    : "";
const bySubj = (L) => (qfOf() === "all" ? L : L.filter((x) => x.u?.subj === qfOf()));
/* reorder: the moved items keep the slots they had, so a filtered list reorders only itself */
/* Progress → History: everything finished, by kind and subject */
function boardDoneItems() {
  const out = [],
    W = WK(),
    last = {};
  S.log.forEach((l) => {
    if (!last[l.key] || l.date > last[l.key]) last[l.key] = l.date;
  });
  const keys = new Set([
    ...Object.keys(last),
    ...Object.keys(S.progress || {}),
    ...Object.keys(W).map((k) => k.slice(0, k.lastIndexOf("|"))),
    ...Object.keys(S.tasks || {}).map((k) => k.split("#")[0]),
    ...Object.keys(S.quiz || {}).map((k) => k.slice(0, k.lastIndexOf("|"))),
  ]);
  [...keys]
    .map(unitByK)
    .filter(Boolean)
    .forEach((u) => {
      const P = u.c?.p,
        dt = (v) => (typeof v === "string" ? v : "");
      if (rank[coverage(u)] >= 2)
        out.push({
          ty: "les",
          u,
          title: chT(u),
          date: last[u.k] || S.progress[u.k]?.updated || "",
          open: `data-act="chapter" data-k="${u.k}"`,
        });
      if (!P) return;
      [...(P.experiments || []), ...(P.activities || [])].forEach((e) => {
        const w = W[u.k + "|" + e.id];
        if (taskDone(u.k, e.id) || w?.st === "done")
          out.push({
            ty: wType(u, e.id),
            u,
            title: e.title,
            date: w?.done || dt(S.tasks[u.k]?.[e.id]),
            open: `data-act="chapter" data-k="${u.k}" data-t="lab"`,
          });
      });
      (P.worksheets || []).forEach((w) => {
        if (taskDone(u.k + "#" + w.id, "ws"))
          out.push({ ty: "ws", u, title: w.title, date: dt(S.tasks[u.k + "#" + w.id]?.ws), open: `data-act="folder"` });
      });
      for (let n = 1; n <= P.days.length; n++) {
        const r = S.quiz?.[u.k + "|" + n];
        if (!r) continue;
        const Q = quizQ(u, n),
          v = Object.values(r);
        if (v.length >= Q.length && Q.length)
          out.push({
            ty: "qz",
            u,
            title: `Quiz · Part ${n}`,
            date:
              v
                .map((x) => x.d)
                .sort()
                .pop() || "",
            sub: `${v.filter((x) => x.r).length} of ${Q.length} right`,
            open: `data-act="qzs" data-k="${u.k}" data-n="${n}"`,
          });
      }
    });
  (S.exps || [])
    .filter((e) => e.closed)
    .forEach((e) =>
      out.push({
        ty: "proj",
        u: null,
        title: e.title,
        date: e.closedAt || e.start,
        sub: "Daily check-in" + (e.topic ? " · " + e.topic : ""),
      }),
    );
  return out.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}
function unitDoneItems(out) {
  Object.keys(DATA.units || {}).forEach((id) => {
    const u = unitBy("unit|" + id);
    if (!u) return;
    fxStamp(id);
    const D = fxSt().done[id] || {},
      P = DATA.units[id].parts || [],
      X = fxStates(id);
    P.forEach((p, i) => {
      if (X[i] === "done")
        out.push({
          ty: FXWT[p[2]] || "les",
          u,
          title: `Part ${i + 1} of ${P.length} done: ${p[1]}`,
          sub2: u.title,
          go: "See it",
          date: D["at:" + p[0]] || "",
          open: `data-act="fxpart" data-u="${esc(id)}" data-p="${esc(p[0])}"`,
        });
    });
  });
  return out;
}
function doneItems() {
  // board chapters, then unit parts, then board lesson sessions from the log
  const out = boardDoneItems().map((x) => {
    if (x.u?.board === "unit" && / · /.test(x.title)) {
      const id = x.u.c.unit,
        P = DATA.units[id].parts,
        t = x.title.split(" · ")[0],
        i = P.findIndex((p) => p[1] === t);
      return { ...x, title: `Part ${i + 1} of ${P.length} done: ${t}`, sub2: x.u.title, go: "See it" };
    }
    return x;
  });
  unitDoneItems(out);
  const seen = new Set(out.map((x) => x.title + "|" + (x.u?.k || "")));
  S.log
    .filter((l) => l.kind !== "skipped" && l.kind !== "free" && !String(l.key).startsWith("unit|"))
    .forEach((l) => {
      const u = unitBy(l.key);
      if (!u) return;
      const t = `Part ${l.n} of ${sessionsFor(u)} done: ${chT(u)}`;
      if (seen.has(t + "|" + u.k)) return;
      seen.add(t + "|" + u.k);
      out.push({ ty: "les", u, title: t, date: l.date, open: `data-act="chapter" data-k="${u.k}"` });
    });
  return out.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}
function doneHistory() {
  const ty = WT[ui.hty] ? ui.hty : "all",
    sj = S.subjects.includes(ui.hs) ? ui.hs : "all",
    A = doneItems(),
    L = A.filter((x) => (ty === "all" || x.ty === ty) && (sj === "all" || x.u?.subj === sj)),
    n = ui.hn || 25;
  const cnt = (t) => A.filter((x) => x.ty === t && (sj === "all" || x.u?.subj === sj)).length;
  return `<section class="sec"><div class="sech"><h3>History</h3><span class="xs muted">Every finished part, newest first</span></div>
   <div class="seg qtypes"><button aria-pressed="${ty === "all"}" data-act="hty" data-t="all">All</button>${Object.entries(
     WT,
   )
     .map(
       ([k, [nm, ic]]) =>
         `<button aria-pressed="${ty === k}" data-act="hty" data-t="${k}">${ic} ${nm} <small>${cnt(k)}</small></button>`,
     )
     .join("")}</div>
   <div class="seg">${["all", ...S.subjects].map((x) => `<button aria-pressed="${sj === x}" data-act="hs" data-s="${x}">${x === "all" ? "All subjects" : SUBJ[x]}</button>`).join("")}</div>
   ${
     L.length
       ? `<div class="col" style="gap:8px">${L.slice(0, n)
           .map(
             (x) =>
               `<div class="trow"><span class="tic" aria-hidden="true">${WT[x.ty][1]}</span><div style="min-width:0;flex:1"><b>${esc(x.title)}</b><br><span class="xs muted">${x.u && x.ty !== "les" ? esc(chT(x.u)) + " · " : ""}${x.u ? esc(SUBJ[x.u.subj]) : ""}${x.sub ? " · " + esc(x.sub) : ""}${x.date ? " · " + esc(fmt(x.date)) : ""}</span></div>${x.open ? `<button class="btn xs soft" ${x.open}>Open</button>` : ""}</div>`,
           )
           .join(
             "",
           )}</div>${L.length > n ? `<button class="btn soft sm" data-act="hmore" style="justify-self:start">Show ${Math.min(25, L.length - n)} more</button>` : ""}`
       : `<p class="note">Nothing finished here yet. Things you finish show up here, newest first. What's in progress is under Plan → Ongoing.</p>`
   }</section>`;
}
/* Are we on track? For each subject: how much of the year has gone, how much of this year's syllabus is done, so how far
   ahead or behind, which topics would catch up, and the extras done beyond the syllabus. */
function onTrackView() {
  const start = S.start || today,
    end = fxYearEnd(),
    span = Math.max(1, parse(end) - parse(start)),
    gone = Math.min(1, Math.max(0, (parse(today) - parse(start)) / span));
  const rows = S.subjects
    .map((s) => {
      const all = plannedUnits(s),
        U = all.filter((u) => u.level === S.levels[s] && (S.board !== "combined" || fxReq(u)));
      if (!U.length) return "";
      const isDone = (u) => rank[coverage(u)] >= 2,
        done = U.filter(isDone).length,
        pct = done / U.length,
        diff = Math.round((pct - gone) * 100),
        owed = Math.max(0, Math.round(gone * U.length) - done),
        catchUp = U.filter((u) => !isDone(u)).slice(0, owed),
        extras = all.filter((u) => isDone(u) && !U.includes(u)),
        sc = schedule(s, 800).filter((x) => U.includes(x.u)),
        last = sc.length ? sc[sc.length - 1].date : today;
      return `<div class="trow2 ${SC(s)}"><div class="row" style="justify-content:space-between"><b>${SUBJ[s]}</b><span class="sm ${diff < -5 ? "behind" : diff > 5 ? "ahead" : ""}">${diff < -5 ? `${-diff}% behind` : diff > 5 ? `${diff}% ahead` : "On track"}</span></div>
       <div class="trkbar" role="img" aria-label="${Math.round(pct * 100)}% of this year's ${SUBJ[s]} done; ${Math.round(gone * 100)}% of the year gone"><i style="width:${Math.round(pct * 100)}%"></i><b style="left:${Math.round(gone * 100)}%"></b></div>
       <p class="xs muted">${done} of ${U.length} topics done (${Math.round(pct * 100)}%) · at this pace, finished by ${fmt(last)}${last > end ? " ⚠️ after the year ends" : ""}</p>
       ${catchUp.length ? `<details><summary class="sm">To catch up: ${catchUp.length} topic${catchUp.length > 1 ? "s" : ""}</summary>${catchUp.map((u) => `<div class="row catchrow"><button class="plain ylrow" data-act="chapter" data-k="${u.k}">${esc(chT(u))}</button><button class="btn xs soft" data-act="catchup" data-s="${s}" data-ks="${u.k}">Do next</button></div>`).join("")}<button class="btn sm" data-act="catchup" data-s="${s}" data-ks="${esc(catchUp.map((u) => u.k).join("~"))}">Put all ${catchUp.length} at the front of the queue</button></details>` : ""}
       ${extras.length ? `<details><summary class="sm">Extra topics done: ${extras.length}</summary>${extras.map((u) => `<button class="plain ylrow" data-act="chapter" data-k="${u.k}">✓ ${esc(chT(u))}</button>`).join("")}</details>` : ""}</div>`;
    })
    .join("");
  return rows
    ? `<section class="sec"><div class="sech"><h3>Are we on track?</h3></div><div class="card ontrack"><p class="sm">${Math.round(gone * 100)}% of the school year has gone (${fmt(start)} to ${fmt(end)}). Each bar is this year's syllabus: the filled part is done, the line is where you'd be by now.</p>${rows}</div></section>`
    : "";
}
function viewJourneyTabs() {
  const k = seg("journey"),
    kid = esc(S.child || "Your child");
  let h =
    pageHead(`${kid}'s progress`, kidBlob("", "happy", 'width="50" height="50"')) + segBar("journey") + `</section>`;
  if (k === "overview") {
    h += onTrackView();
    const o = viewJourney0().replace(
      /<button class="menurow" data-act="(rem|told|track|uploads|school|folder|todo|hist)"[\s\S]*?<\/button>/g,
      "",
    );
    h += o.replace(
      /^<section class="sec" style="margin-top:8px"><div class="sech"><h1[^>]*>[^<]*<\/h1>[\s\S]*?<\/div>/,
      '<section class="sec"><div class="sech"><h3>By subject</h3></div>',
    );
  } else if (k === "time")
    h += `<section class="sec"><button class="menurow" data-act="hist">${blob("var(--pist)", 9, "happy", "", 'width="40" height="40"')}<span><b>History</b><br><span class="xs muted">Each lesson your child finished, newest first, by date</span></span>${icon("next")}</button>${trackView()}</section>`;
  else if (k === "work")
    h += `<section class="sec">${uploadsView()}</section><section class="sec"><button class="menurow" data-act="tofinish">${blob("var(--tang)", 11, "calm", "", 'width="40" height="40"')}<span><b>Still to do</b><br><span class="xs muted">What your child started and hasn't finished, and what's not tried yet</span></span>${icon("next")}</button><button class="menurow" data-act="folder">${blob("var(--leaf)", 14, "wow", "", 'width="40" height="40"')}<span><b>Worksheets and quizzes, with answers</b><br><span class="xs muted">Everything finished in the app, to save or print</span></span>${icon("next")}</button></section>`;
  else h += `<section class="sec">${schoolView()}</section>`;
  return h;
}
const TBOARDS = [
  ["ncert", "NCERT / CBSE"],
  ["state", "State board (NCERT pattern)"],
  ["cambridge", "Cambridge Primary"],
  ["nios", "NIOS"],
];
const TB = (b) => (b === "state" ? "ncert" : b);
const tbName = (b) => TBOARDS.find((x) => x[0] === b)?.[1] || BOARDN[b] || b;
const ABCD = "ABCD";
const tLevel = (c) => Math.max(1, Math.min(5, (+c || 2) - 1));
const tSubs = (b, L) =>
  SUBJ_KEYS.filter((s) => DATA.items.some((u) => u.board === TB(b) && u.subj === s && u.level === L));
const tChaps = (b, s, L) => DATA.items.filter((u) => u.board === TB(b) && u.subj === s && u.level === L);
const curTest = () => (S.tests || []).slice(-1)[0] || null;
const tDone = (t) => t && t.subjects.every((x) => t.done?.[x.s]);
function tSetup() {
  const T =
    S.tsetup ||
    (S.tsetup = {
      board: boardsOn().find((b) => ["ncert", "cambridge", "nios"].includes(b)) || "ncert",
      cls: "",
      n: 15,
      off: [],
    });
  return T;
}
function shuffleQ(q) {
  const idx = [0, 1, 2, 3];
  for (let i = 3; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return { ...q, opts: idx.map((i) => q.opts[i]), a: idx.indexOf(q.a) };
}
async function makeTest() {
  const T = tSetup(),
    L = tLevel(T.cls),
    subs = tSubs(T.board, L).filter((s) => !(T.off || []).includes(s));
  if (!T.cls) {
    toast("Pick the class they're joining");
    return;
  }
  if (!subs.length) {
    toast("No syllabus for that board and class yet");
    return;
  }
  if (!SAMPLE) {
    openSheet({ mode: "plus", r: "test" });
    return;
  }
  ui.tgen = { i: 0, n: subs.length, err: [] };
  render();
  const out = [];
  for (const s of subs) {
    ui.tgen.i++;
    ui.tgen.s = s;
    render();
    const ch = tChaps(T.board, s, L),
      keys = new Set(ch.map((u) => u.k)),
      N = +T.n || 15;
    const prompt = `Write an entrance test for a child joining Class ${T.cls} at a ${tbName(T.board)} school in India. The test covers the ${BOARDN[TB(T.board)]} ${lvN(TB(T.board), L)} syllabus for ${SUBJ[s]}, which has these chapters (key = title):
${ch.map((u) => `- ${u.k} = ${u.title}${u.book ? " (" + u.book + ")" : ""}`).join("\n")}
Write exactly ${N} multiple-choice questions for ${SUBJ[s]}.
- Spread them across the chapters. Mix about 40% recall, 40% understanding and 20% applying the idea to a new case, from easy to harder.
- Exactly 4 options each, exactly one correct. Wrong options must be believable mistakes a child makes. No "all of the above" or "none of the above".
- Simple words a ${L + 5}-year-old in India reads easily; Indian names, places, food and ₹.
- ${s === "hin" ? "Write everything in Hindi (Devanagari)." : s === "eng" ? 'Test reading, vocabulary, grammar and spelling from these chapters. For reading questions put a short passage (40 to 80 words) in "passage" and repeat the same passage on each question about it.' : s === "math" ? "Work out every answer yourself before writing it, and check the numbers twice." : "Test real understanding of the ideas, not trivia."}
- "ch" is the key of the chapter the question comes from.
Check every answer again before replying.
Reply with only JSON: {"questions":[{"q":"...","opts":["...","...","...","..."],"a":0,"ch":"<chapter key>","skill":"recall|understand|apply","passage":""}]}`;
    try {
      const r = await SAMPLE.json(prompt, { modelTier: "complex", cache: false });
      const qs = (r?.questions || [])
        .filter(
          (q) =>
            q &&
            typeof q.q === "string" &&
            Array.isArray(q.opts) &&
            q.opts.length === 4 &&
            new Set(q.opts.map(String)).size === 4 &&
            Number.isInteger(+q.a) &&
            +q.a >= 0 &&
            +q.a < 4,
        )
        .slice(0, N)
        .map((q) =>
          shuffleQ({
            q: String(q.q).slice(0, 600),
            opts: q.opts.map((o) => String(o).slice(0, 200)),
            a: +q.a,
            ch: keys.has(q.ch) ? q.ch : "",
            skill: ["recall", "understand", "apply"].includes(q.skill) ? q.skill : "",
            passage: String(q.passage || "").slice(0, 900),
          }),
        );
      if (qs.length >= Math.min(5, N)) out.push({ s, qs });
      else ui.tgen.err.push(SUBJ[s]);
    } catch (e) {
      ui.tgen.err.push(SUBJ[s] + (e?.code === "rate_limited" ? " (too many requests; try again in a minute)" : ""));
    }
  }
  const err = ui.tgen.err;
  ui.tgen = null;
  if (!out.length) {
    toast("Couldn't make the paper. Try again.");
    render();
    return;
  }
  S.tests = [
    ...(S.tests || []),
    {
      id: Math.random().toString(36).slice(2, 9),
      board: T.board,
      cls: T.cls,
      level: L,
      at: Date.now(),
      date: today,
      subjects: out,
      ans: {},
      start: {},
      done: {},
    },
  ].slice(-6);
  sfx("win");
  toast(err.length ? `Paper ready. Couldn't make: ${err.join(", ")}` : "Paper ready");
  commit();
}
function tScore(t) {
  const R = t.subjects.map((x) => {
      const right = x.qs.filter((q, i) => t.ans[x.s + "|" + i] === q.a).length,
        ans = x.qs.filter((q, i) => t.ans[x.s + "|" + i] !== undefined).length,
        pct = Math.round((right / x.qs.length) * 100),
        mins = t.done?.[x.s] && t.start?.[x.s] ? Math.max(1, Math.round((t.done[x.s] - t.start[x.s]) / 6e4)) : null;
      return { s: x.s, n: x.qs.length, right, ans, pct, grade: GRADE(pct), mins };
    }),
    n = R.reduce((a, x) => a + x.n, 0),
    right = R.reduce((a, x) => a + x.right, 0),
    pct = n ? Math.round((right / n) * 100) : 0;
  return { R, n, right, pct, grade: GRADE(pct) };
}
function testSection() {
  const T = tSetup(),
    L = tLevel(T.cls),
    subs = T.cls ? tSubs(T.board, L) : [],
    t = curTest(),
    G = ui.tgen;
  let h = `<section class="card exsec"><span class="eyebrow">Entrance test</span><h3 style="font-size:20px">A test paper for the new school</h3><p class="sm">Pick the school's board and the class ${esc(S.child || "your child")} is joining. DeepKids makes a multiple-choice paper on the syllabus of the class before, ${esc(S.child || "your child")} takes it here, and you get a score certificate, the paper, the answer key and the marked answer sheet.</p>
  <div class="fgrid"><div class="field"><label for="tsb">School's board</label><select class="inp" id="tsb" data-tsel="board">${TBOARDS.map(([k, n]) => `<option value="${k}" ${T.board === k ? "selected" : ""}>${n}</option>`).join("")}</select></div>
  <div class="field"><label for="tsc">Joining class</label><select class="inp" id="tsc" data-tsel="cls"><option value="">Pick a class</option>${[2, 3, 4, 5, 6].map((c) => `<option value="${c}" ${+T.cls === c ? "selected" : ""}>Class ${c}</option>`).join("")}</select></div>
  <div class="field"><label for="tsn">Questions per subject</label><select class="inp" id="tsn" data-tsel="n">${[10, 15, 20].map((n) => `<option value="${n}" ${+T.n === n ? "selected" : ""}>${n}</option>`).join("")}</select></div></div>`;
  if (T.cls) {
    h += subs.length
      ? `<p class="xs muted">Tests the ${esc(BOARDN[TB(T.board)])} ${esc(lvN(TB(T.board), L))} syllabus. Subjects:</p><div class="row">${subs.map((s) => `<button class="chip ${SC(s)}" aria-pressed="${!(T.off || []).includes(s)}" data-act="tsub" data-s="${s}">${esc(SUBJ[s])} · ${tChaps(T.board, s, L).length} ch</button>`).join("")}</div>`
      : `<p class="sm" style="color:var(--bad)">${TB(T.board) === "nios" ? "NIOS has Level A (≈ Class 3) and Level B (≈ Class 5), so pick joining Class 4 or Class 6." : "We don't have that syllabus yet."}</p>`;
  }
  h += `<div class="row" style="gap:10px;flex-wrap:wrap"><button class="btn accent sm" data-act="tmake" ${G || !subs.length ? "disabled" : ""}>${G ? `Writing ${esc(SUBJ[G.s] || "")} (${G.i} of ${G.n})…` : t ? "Make a new paper" : "Make the question paper"}</button></div>${G ? `<p class="xs muted">This takes about a minute a subject. Keep this open.</p>` : ""}`;
  if (t) {
    const sc = tScore(t),
      fin = tDone(t);
    h += `<div class="pk"><span class="eyebrow">${esc(tbName(t.board))} · joining Class ${t.cls} · made ${esc(fmt(t.date))}</span><b>${t.subjects.map((x) => `${SUBJ[x.s]} ${x.qs.length}`).join(" · ")} questions</b>
    ${
      fin
        ? `<p class="sm"><b>Score: ${sc.right} / ${sc.n} (${sc.pct}%) · Grade ${sc.grade}</b></p><table class="rtab"><tr><th>Subject</th><th>Marks</th><th>%</th><th>Grade</th><th>Time</th></tr>${sc.R.map((r) => `<tr><td>${esc(SUBJ[r.s])}</td><td>${r.right} / ${r.n}</td><td>${r.pct}%</td><td>${r.grade}</td><td>${r.mins ? r.mins + " min" : "—"}</td></tr>`).join("")}</table>`
        : `<p class="sm">${t.subjects.filter((x) => t.done?.[x.s]).length} of ${t.subjects.length} subjects done. ${esc(S.child || "Your child")} can do one subject at a time.</p>`
    }
    <div class="row" style="gap:10px;flex-wrap:wrap">${fin ? "" : `<button class="btn green sm" data-act="tstart">${Object.keys(t.ans).length ? "Carry on the test" : "Start the test"}</button>`}<button class="btn soft sm" data-act="tdl" data-d="paper">Question paper</button>${fin ? `<button class="btn soft sm" data-act="tdl" data-d="cert">Score certificate</button><button class="btn soft sm" data-act="tdl" data-d="key">Answer key and marking</button><button class="btn soft sm" data-act="tdl" data-d="sheet">Marked answer sheet</button>` : ""}</div>
    ${fin ? "" : `<p class="xs muted">Hand the phone to ${esc(S.child || "your child")}. Answers stay hidden until every subject is finished.</p>`}</div>`;
  }
  return h + `</section>`;
}
function examView() {
  const t = curTest();
  document.getElementById("sheetTitle").textContent = "Entrance test";
  if (!t) return `<p class="note">No paper yet.</p>`;
  const E = ui.ex || (ui.ex = { si: t.subjects.findIndex((x) => !t.done?.[x.s]), qi: -1 });
  if (E.si < 0 || tDone(t))
    return `<div class="exdone">${blob("var(--sun)", 7, "wow", "", 'width="90" height="90"')}<h2>All done!</h2><p>Well done, ${esc(S.child || "")}. Give the phone back to your grown-up.</p><button class="btn accent" data-act="texit">Close</button></div>`;
  const X = t.subjects[E.si],
    s = X.s,
    n = X.qs.length;
  if (E.qi < 0)
    return `<div class="exdone">${sblob(s, "happy", "mascot")}<span class="eyebrow">${esc(SUBJ[s])} · part ${E.si + 1} of ${t.subjects.length}</span><h2>${n} questions</h2><ul class="sm" style="text-align:left"><li>Read each question. Tap the answer you think is right.</li><li>Not sure? Pick your best guess, or skip and come back.</li><li>Take your time. There's no timer.</li></ul><button class="btn green" data-act="tgo">Start ${esc(SUBJ[s])}</button></div>`;
  const q = X.qs[E.qi],
    v = t.ans[s + "|" + E.qi],
    un = X.qs.filter((_, i) => t.ans[s + "|" + i] === undefined).length,
    last = E.qi === n - 1,
    prevP = E.qi > 0 ? X.qs[E.qi - 1].passage : "";
  return `<div class="exq ${SC(s)}"><div class="row" style="justify-content:space-between"><span class="eyebrow">${esc(SUBJ[s])} · Question ${E.qi + 1} of ${n}</span><span class="xs muted">${n - un} answered</span></div>
    <div class="exdots">${X.qs.map((_, i) => `<button class="${i === E.qi ? "on" : ""} ${t.ans[s + "|" + i] !== undefined ? "ans" : ""}" data-act="tjump" data-i="${i}" aria-label="Question ${i + 1}"></button>`).join("")}</div>
    ${q.passage ? `<div class="ask exp"><span class="eyebrow">${q.passage === prevP ? "Same passage" : "Read this"}</span>${esc(q.passage)}</div>` : ""}
    <p class="exqt">${esc(q.q)}</p><div class="col" style="gap:10px">${q.opts.map((o, i) => `<button class="exopt" aria-pressed="${v === i}" data-act="tans" data-i="${i}"><b>${ABCD[i]}</b><span>${esc(o)}</span></button>`).join("")}</div>
    <div class="row" style="justify-content:space-between;margin-top:14px"><button class="btn line sm" data-act="tmove" data-d="-1" ${E.qi ? "" : "disabled"}>Back</button>${last ? `<button class="btn green sm" data-act="tfin">${un ? `Finish ${esc(SUBJ[s])} (${un} not answered)` : `Finish ${esc(SUBJ[s])}`}</button>` : `<button class="btn sm" data-act="tmove" data-d="1">${v === undefined ? "Skip" : "Next"}</button>`}</div></div>`;
}
const DOCCSS = `body{font:14px/1.5 system-ui,sans-serif;color:#222;max-width:820px;margin:24px auto;padding:0 16px}h1{font-size:22px;margin:0}h2{font-size:17px;margin:24px 0 6px;border-bottom:2px solid #333;padding-bottom:3px}table{border-collapse:collapse;width:100%;margin:6px 0}th,td{border:1px solid #bbb;padding:5px 8px;text-align:left;vertical-align:top}th{background:#f2f2f2}.muted{color:#666}.sm{font-size:12px}ol{padding-left:22px}li{margin:10px 0;break-inside:avoid}.op{display:block;margin:2px 0 2px 6px}.ok{color:#1e7a3c;font-weight:700}.no{color:#b03a2e;font-weight:700}.pass{border-left:3px solid #999;padding:4px 10px;margin:6px 0;background:#f7f7f7}.sig{display:flex;gap:40px;margin-top:40px}.sig div{flex:1;border-top:1px solid #333;padding-top:4px;font-size:12px}.cert{border:6px double #555;padding:28px;text-align:center}.cert h1{font-size:26px}.big{font-size:34px;font-weight:800;margin:6px 0}.tw{overflow-x:auto}@media(max-width:520px){.cert{padding:14px}.big{font-size:26px}th,td{padding:4px 5px;font-size:12.5px}}@media print{body{margin:0}h2{break-after:avoid}}`;
const docWrap = (title, body) =>
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>${DOCCSS}</style></head><body>${body}</body></html>`;
const tHead = (t) =>
  `<p class="muted">${esc(tbName(t.board))} pattern · for admission to Class ${t.cls} · covers the ${esc(lvN(TB(t.board), t.level))} syllabus</p>`;
const tDate = (t) => new Date(t.at).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
function qList(t, x, mode) {
  let lastP = "";
  return `<ol>${x.qs
    .map((q, i) => {
      const v = t.ans[x.s + "|" + i],
        p = q.passage && q.passage !== lastP ? `<div class="pass">${esc(q.passage)}</div>` : "";
      lastP = q.passage || lastP;
      const ch = q.ch && unitByK(q.ch);
      return `<li>${p}<b>${esc(q.q)}</b>${q.opts.map((o, j) => `<span class="op">${mode !== "paper" && j === q.a ? "<span class='ok'>✓</span> " : mode === "sheet" && j === v ? "<span class='no'>✗</span> " : ""}(${ABCD[j]}) ${esc(o)}</span>`).join("")}${mode === "key" ? `<span class="sm muted">Answer: ${ABCD[q.a]} · 1 mark${ch ? " · " + esc(chT(ch)) : ""}${q.skill ? " · " + esc(q.skill) : ""}</span>` : mode === "sheet" ? `<span class="sm">${v === undefined ? "<span class='no'>Not answered</span> · 0 marks" : v === q.a ? `<span class='ok'>Chose ${ABCD[v]} · correct</span> · 1 mark` : `<span class='no'>Chose ${ABCD[v]}</span> · correct ${ABCD[q.a]} · 0 marks`}</span>` : ""}</li>`;
    })
    .join("")}</ol>`;
}
function paperDoc(t) {
  const n = t.subjects.reduce((a, x) => a + x.qs.length, 0);
  return docWrap(
    "Question paper",
    `<h1>Entrance test · question paper</h1>${tHead(t)}<p>Name: ______________________ &nbsp; Date: ____________</p><p class="sm"><b>Instructions:</b> ${n} multiple-choice questions, 1 mark each, no negative marking. Choose one answer for each question.</p>${t.subjects.map((x) => `<h2>${esc(SUBJ[x.s])} · ${x.qs.length} marks</h2>${qList(t, x, "paper")}`).join("")}`,
  );
}
function keyDoc(t) {
  return docWrap(
    "Answer key",
    `<h1>Entrance test · answer key and marking</h1>${tHead(t)}<h2>Marking scheme</h2><p class="sm">Each question carries 1 mark. No negative marking; unanswered questions get 0. Subject and overall percentages are marks ÷ questions × 100. Grades use the CBSE 8-point scale: A1 91–100, A2 81–90, B1 71–80, B2 61–70, C1 51–60, C2 41–50, D 33–40, E below 33.</p>${t.subjects.map((x) => `<h2>${esc(SUBJ[x.s])}</h2>${qList(t, x, "key")}`).join("")}`,
  );
}
function sheetDoc(t) {
  const sc = tScore(t);
  return docWrap(
    "Marked answer sheet",
    `<h1>Entrance test · marked answer sheet</h1>${tHead(t)}<p><b>${esc(S.child || "Student")}</b> · taken ${esc(tDate(t))} · ${sc.right} / ${sc.n} (${sc.pct}%) · Grade ${sc.grade}</p>${scoreTable(sc)}${t.subjects
      .map((x) => {
        const r = sc.R.find((z) => z.s === x.s);
        return `<h2>${esc(SUBJ[x.s])} · ${r.right} / ${r.n}</h2>${qList(t, x, "sheet")}`;
      })
      .join("")}`,
  );
}
const scoreTable = (sc) =>
  `<div class="tw"><table><tr><th>Subject</th><th>Questions</th><th>Answered</th><th>Marks</th><th>Percentage</th><th>Grade</th><th>Time taken</th></tr>${sc.R.map((r) => `<tr><td>${esc(SUBJ[r.s])}</td><td>${r.n}</td><td>${r.ans}</td><td>${r.right}</td><td>${r.pct}%</td><td>${r.grade}</td><td>${r.mins ? r.mins + " min" : "—"}</td></tr>`).join("")}<tr><th>Total</th><th>${sc.n}</th><th>${sc.R.reduce((a, r) => a + r.ans, 0)}</th><th>${sc.right}</th><th>${sc.pct}%</th><th>${sc.grade}</th><th></th></tr></table></div>`;
function certDoc(t) {
  const sc = tScore(t),
    I = S.school || {};
  return docWrap(
    "Score certificate",
    `<div class="cert"><p class="muted">Home assessment</p><h1>Score certificate</h1><p>This is to record that</p><p class="big">${esc(S.child || "Student")}</p>${I.dob ? `<p class="muted">born ${esc(parse(I.dob).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }))}</p>` : ""}<p>took an entrance test on the <b>${esc(BOARDN[TB(t.board)])} ${esc(lvN(TB(t.board), t.level))}</b> syllabus${I.to ? `, for admission to Class ${t.cls} at ${esc(I.to)}` : `, for admission to Class ${t.cls}`}, on ${esc(tDate(t))}, and scored</p><p class="big">${sc.right} / ${sc.n} · ${sc.pct}% · Grade ${sc.grade}</p><table><tr><th>Subject</th><th>Marks</th><th>%</th><th>Grade</th></tr>${sc.R.map((r) => `<tr><td>${esc(SUBJ[r.s])}</td><td>${r.right} / ${r.n}</td><td>${r.pct}%</td><td>${r.grade}</td></tr>`).join("")}</table><p class="sm muted">Taken at home on DeepKids under parent supervision. ${sc.n} multiple-choice questions, 1 mark each, no negative marking. This is a home assessment, not a board examination.</p><div class="sig"><div>Parent / guardian${S.parent?.name ? ": " + esc(S.parent.name) : ""}</div><div>Date</div></div></div>`,
  );
}
function testTranscript() {
  const t = curTest();
  if (!t || !tDone(t)) return "";
  const sc = tScore(t);
  return `<h2>Entrance test</h2><p class="sm">${esc(tbName(t.board))} pattern, for Class ${t.cls}, on the ${esc(lvN(TB(t.board), t.level))} syllabus. Taken ${esc(tDate(t))}. Total ${sc.right} / ${sc.n} (${sc.pct}%), grade ${sc.grade}.</p><table><tr><th>Subject</th><th>Marks</th><th>%</th><th>Grade</th></tr>${sc.R.map((r) => `<tr><td>${esc(SUBJ[r.s])}</td><td>${r.right} / ${r.n}</td><td>${r.pct}%</td><td>${r.grade}</td></tr>`).join("")}</table>`;
}
const CRCT = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (u) => {
  let c = 0xffffffff;
  for (let i = 0; i < u.length; i++) c = CRCT[(c ^ u[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
async function makeZip(files) {
  const enc = new TextEncoder(),
    parts = [],
    cen = [],
    d = new Date(),
    dt = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
    tm = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  let off = 0;
  for (const f of files) {
    const data =
        typeof f.data === "string"
          ? enc.encode(f.data)
          : f.data instanceof Blob
            ? new Uint8Array(await f.data.arrayBuffer())
            : f.data,
      nm = enc.encode(f.name),
      crc = crc32(data),
      L = new DataView(new ArrayBuffer(30)),
      C = new DataView(new ArrayBuffer(46));
    [
      [0, 0x04034b50, 4],
      [4, 20, 2],
      [6, 0x0800, 2],
      [8, 0, 2],
      [10, tm, 2],
      [12, dt, 2],
      [14, crc, 4],
      [18, data.length, 4],
      [22, data.length, 4],
      [26, nm.length, 2],
      [28, 0, 2],
    ].forEach(([o, v, w]) => (w === 4 ? L.setUint32(o, v, true) : L.setUint16(o, v, true)));
    [
      [0, 0x02014b50, 4],
      [4, 20, 2],
      [6, 20, 2],
      [8, 0x0800, 2],
      [10, 0, 2],
      [12, tm, 2],
      [14, dt, 2],
      [16, crc, 4],
      [20, data.length, 4],
      [24, data.length, 4],
      [28, nm.length, 2],
      [30, 0, 2],
      [32, 0, 2],
      [34, 0, 2],
      [36, 0, 2],
      [38, 0, 4],
      [42, off, 4],
    ].forEach(([o, v, w]) => (w === 4 ? C.setUint32(o, v, true) : C.setUint16(o, v, true)));
    parts.push(new Uint8Array(L.buffer), nm, data);
    cen.push(new Uint8Array(C.buffer), nm);
    off += 30 + nm.length + data.length;
  }
  const cs = cen.reduce((a, u) => a + u.length, 0),
    E = new DataView(new ArrayBuffer(22));
  E.setUint32(0, 0x06054b50, true);
  E.setUint16(8, files.length, true);
  E.setUint16(10, files.length, true);
  E.setUint32(12, cs, true);
  E.setUint32(16, off, true);
  return new Blob([...parts, ...cen, new Uint8Array(E.buffer)], { type: "application/zip" });
}
const fsafe = (s) =>
  String(s || "")
    .replace(/[\\/:*?"<>|#%]+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60) || "file";
function zipSel() {
  if (ui.zs) return ui.zs;
  const t = curTest(),
    F = folderData();
  ui.zs = {
    docs: new Set(["transcript", "work", ...(t ? ["paper"] : []), ...(tDone(t) ? ["cert", "key", "sheet"] : [])]),
    ws: new Set(F.flatMap((c) => c.ws.filter((w) => w.fin).map((w) => w.k))),
    up: new Set((S.work || []).filter((w) => w.k).map((w) => w.id)),
  };
  return ui.zs;
}
function bundleSection() {
  const Z = zipSel(),
    t = curTest(),
    fin = tDone(t),
    F = folderData(),
    W = F.flatMap((c) => c.ws.map((w) => ({ ...w, u: c.u }))),
    U = S.work || [],
    P = ui.zip;
  const ck = (grp, id, label, sub, dis) =>
    `<label class="zrow ${dis ? "off" : ""}"><input type="checkbox" data-zip="${grp}" value="${esc(id)}" ${Z[grp].has(id) && !dis ? "checked" : ""} ${dis ? "disabled" : ""}><span><b class="sm">${label}</b>${sub ? `<br><span class="xs muted">${sub}</span>` : ""}</span></label>`;
  let h = `<section class="card"><span class="eyebrow">For the school</span><h3 style="font-size:20px">Make one folder to send</h3><p class="sm">Tick what to include. DeepKids puts it all in one .zip folder you can save, then send by WhatsApp, email or anything else.</p>
  <div class="col" style="gap:6px">${ck("docs", "transcript", "Transcript", "Coverage by board and level, chapters, scores, attendance")}${ck("docs", "cert", "Score certificate", fin ? "" : "After the test is finished", !fin)}${ck("docs", "paper", "Question paper", t ? "" : "Make a paper first", !t)}${ck("docs", "key", "Answer key and marking", fin ? "" : "After the test is finished", !fin)}${ck("docs", "sheet", "Marked answer sheet", fin ? "" : "After the test is finished", !fin)}${ck("docs", "work", "Projects and experiments list", "With start and finish dates")}</div>`;
  if (W.length)
    h += `<details style="margin-top:8px"><summary class="link sm" style="cursor:pointer">Worksheets with answers · ${Z.ws.size} of ${W.length} ticked</summary><div class="col" style="gap:6px;margin-top:6px"><div class="row"><button class="link xs" data-act="zall" data-g="ws" data-v="1">Tick all</button><button class="link xs" data-act="zall" data-g="ws" data-v="0">Untick all</button></div>${W.map((w) => ck("ws", w.k, esc(w.title), `${esc(chT(w.u))} · ${w.fin ? "finished " + esc(fmt(w.fin)) : w.ans + " of " + w.tot + " answered"}`)).join("")}</div></details>`;
  if (U.length)
    h += `<details style="margin-top:8px"><summary class="link sm" style="cursor:pointer">Photos and files · ${[...Z.up].filter((id) => U.some((w) => w.id === id)).length} of ${U.length} ticked</summary><div class="col" style="gap:6px;margin-top:6px"><div class="row"><button class="link xs" data-act="zall" data-g="up" data-v="1">Tick all</button><button class="link xs" data-act="zall" data-g="up" data-v="0">Untick all</button></div>${U.map((w) => ck("up", w.id, esc(w.title || w.name || "Upload"), `${esc(fmt(w.date))}${w.k && unitByK(w.k) ? " · " + esc(chT(unitByK(w.k))) : ""}`)).join("")}</div></details>`;
  h += `<div class="row" style="gap:10px;flex-wrap:wrap;margin-top:10px"><button class="btn accent sm" data-act="zmake" ${P?.busy ? "disabled" : ""}>${P?.busy ? esc(P.busy) : "Make the folder"}</button></div>`;
  if (P?.blob) {
    const sh = !!(
      navigator.canShare && navigator.canShare({ files: [new File([P.blob], P.name, { type: "application/zip" })] })
    );
    h += `<div class="pk"><b>${esc(P.name)}</b><p class="xs muted">${P.count} files · ${(P.blob.size / 1048576).toFixed(1)} MB${P.miss ? ` · ${P.miss} photo${P.miss > 1 ? "s" : ""} couldn't be added` : ""}</p><div class="row" style="gap:10px;flex-wrap:wrap"><button class="btn green sm" data-act="zsave">Save the folder</button>${sh ? `<button class="btn soft sm" data-act="zshare">Share…</button>` : ""}<a class="btn soft sm" href="https://wa.me/?text=${encodeURIComponent(zipMsg())}" target="_blank" rel="noopener">WhatsApp</a><a class="btn soft sm" href="mailto:?subject=${encodeURIComponent((S.child || "Student") + " – home education records")}&body=${encodeURIComponent(zipMsg() + "\n\n(The folder is attached.)")}" target="_blank" rel="noopener">Email</a></div><p class="xs muted">${sh ? "Share… sends the folder straight to WhatsApp, email or any app. " : ""}For WhatsApp or email: save the folder first, then attach it from your Downloads.</p></div>`;
  }
  return h + `</section>`;
}
const zipMsg = () => {
  const t = curTest(),
    sc = tDone(t) && tScore(t);
  return `Dear Sir/Madam,\nPlease find attached ${S.child || "my child"}'s home education records for admission${t ? ` to Class ${t.cls}` : S.school?.cls ? ` to ${S.school.cls}` : ""}: transcript${sc ? `, entrance test certificate (${sc.pct}%, grade ${sc.grade}), question paper, answer key and marked answer sheet` : ""}, and samples of work.\nRegards,\n${S.parent?.name || ""}`;
};
async function zipBuild() {
  const Z = zipSel(),
    t = curTest(),
    fin = tDone(t),
    kid = fsafe(S.child || "Student"),
    files = [];
  ui.zip = { busy: "Making the folder…" };
  render();
  const D = Z.docs;
  if (D.has("transcript")) files.push({ name: "01 Transcript.html", data: transcriptDoc() });
  if (fin && D.has("cert")) files.push({ name: "02 Score certificate.html", data: certDoc(t) });
  if (t && D.has("paper")) files.push({ name: "03 Question paper.html", data: paperDoc(t) });
  if (fin && D.has("key")) files.push({ name: "04 Answer key and marking.html", data: keyDoc(t) });
  if (fin && D.has("sheet")) files.push({ name: "05 Marked answer sheet.html", data: sheetDoc(t) });
  if (Z.ws.size) {
    const F = folderData()
      .map((c) => ({ ...c, ws: c.ws.filter((w) => Z.ws.has(w.k)), qz: c.qz, pj: D.has("work") ? c.pj : [] }))
      .filter((c) => c.ws.length || c.qz.length || c.pj.length);
    if (F.length) files.push({ name: "06 Worksheets and answers.html", data: folderDoc(F) });
  } else if (D.has("work")) {
    const F = folderData()
      .map((c) => ({ ...c, ws: [], qz: [] }))
      .filter((c) => c.pj.length);
    if (F.length) files.push({ name: "06 Projects and experiments.html", data: folderDoc(F) });
  }
  const ups = (S.work || []).filter((w) => Z.up.has(w.id));
  let miss = 0,
    i = 0;
  for (const w of ups) {
    i++;
    ui.zip.busy = `Adding photos (${i} of ${ups.length})…`;
    render();
    try {
      const r = await fetch("/_blob/" + encodeURIComponent(w.id));
      if (!r.ok) throw 0;
      const bl = await r.blob(),
        ext = (w.name && /\.\w{2,5}$/.test(w.name) ? w.name.split(".").pop() : bl.type.split("/")[1] || "bin").replace(
          "jpeg",
          "jpg",
        );
      const u = w.k && unitByK(w.k);
      files.push({
        name: `Work samples/${w.date || ""} ${u ? fsafe(SUBJ[u.subj] + " " + chT(u)) + " - " : ""}${fsafe(w.title || w.name)}.${ext}`,
        data: bl,
      });
    } catch (e) {
      miss++;
    }
  }
  const names = new Set();
  files.forEach((f) => {
    let n = f.name,
      k = 2;
    while (names.has(n)) n = f.name.replace(/(\.\w+)$/, ` (${k++})$1`);
    names.add(n);
    f.name = n;
  });
  try {
    const blob = await makeZip(files);
    ui.zip = { blob, name: `${kid} school folder ${today}.zip`, count: files.length, miss };
    sfx("win");
  } catch (e) {
    ui.zip = null;
    toast("Couldn't make the folder");
  }
  render();
}
async function zipSave() {
  const P = ui.zip;
  if (!P?.blob) return;
  try {
    const dl = await window.claude?.use?.("downloads");
    if (dl) {
      await dl.save({ filename: P.name, data: P.blob });
      toast("Saved");
      return;
    }
  } catch (e) {
    if (e?.code === "declined") return;
  }
  try {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(P.blob);
    a.download = P.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast("Saved");
  } catch (e) {
    toast("Couldn't save here");
  }
}
async function zipShare() {
  const P = ui.zip;
  if (!P?.blob) return;
  try {
    await navigator.share({
      files: [new File([P.blob], P.name, { type: "application/zip" })],
      title: P.name,
      text: zipMsg(),
    });
  } catch (e) {
    if (e?.name !== "AbortError") toast("Sharing isn't available here. Save the folder, then send it.");
  }
}
function tdlDoc(d) {
  const t = curTest();
  if (!t) return;
  const kid = fsafe(S.child || "Student"),
    M = {
      paper: [paperDoc, "question paper"],
      key: [keyDoc, "answer key"],
      sheet: [sheetDoc, "marked answer sheet"],
      cert: [certDoc, "score certificate"],
    }[d];
  if (M) saveDoc(M[0](t), `${kid} ${M[1]} ${t.date}.html`);
}
const UPK = ["worksheet", "drawing", "notebook", "experiment", "craft", "outing", "reading", "certificate", "other"];
async function shrink(f, max = 900) {
  try {
    const b = await createImageBitmap(f),
      s = Math.min(1, max / Math.max(b.width, b.height)),
      c = document.createElement("canvas");
    c.width = Math.round(b.width * s);
    c.height = Math.round(b.height * s);
    c.getContext("2d").drawImage(b, 0, 0, c.width, c.height);
    return await new Promise((r) => c.toBlob(r, "image/jpeg", 0.8));
  } catch (e) {
    return null;
  }
}
function upCands(date) {
  const near = new Set();
  S.log.forEach((l) => {
    if (l.date >= addDays(date, -3) && l.date <= addDays(date, 1)) near.add(l.key);
  });
  S.subjects.forEach((s) => {
    const nx = nextUp(s);
    if (nx) near.add(nx.u.k);
  });
  return [...near]
    .map(unitByK)
    .filter(Boolean)
    .map((u) => {
      const ls = S.log.filter((l) => l.key === u.k && l.date >= addDays(date, -3) && l.date <= addDays(date, 1));
      return { u, ls };
    })
    .sort((a, b) => b.ls.length - a.ls.length);
}
function upGuess(x) {
  const C = upCands(x.date),
    same = C.filter((c) => c.ls.some((l) => l.date === x.date));
  return same.length === 1
    ? same[0].u.k
    : C.filter((c) => c.ls.length).length === 1
      ? C.find((c) => c.ls.length).u.k
      : "";
}
async function upTag(items) {
  items.forEach((x) => {
    x.k = upGuess(x);
  });
  if (!SAMPLE) return;
  for (let i = 0; i < items.length; i += 4) {
    const B = items.slice(i, i + 4),
      imgs = [];
    const lines = [];
    for (const [j, x] of B.entries()) {
      const C = upCands(x.date);
      let im = null;
      if (IMGOK && x.type.startsWith("image/") && x._f) {
        im = await shrink(x._f);
        if (im) imgs.push(im);
      }
      lines.push(
        `Item ${j + 1}: file "${x.name}", dated ${fmt(x.date)}${im ? `, image ${imgs.length} attached` : " (no image; use the name and date)"}. Candidate chapters:\n${
          C.slice(0, 8)
            .map(
              (c) =>
                `  - ${c.u.k} = ${SUBJ[c.u.subj]}, ${chT(c.u)}${c.ls.length ? `; studied ${c.ls.map((l) => fmt(l.date) + (l.n ? " (Part " + l.n + (c.u.c?.p ? ": " + pkDay(c.u, l.n).title : "") + ")" : "")).join(", ")}` : "; the chapter in progress"}`,
            )
            .join("\n") || "  (none)"
        }`,
      );
    }
    const prompt = `You file a homeschooling family's photos and files (child ${S.age || ""} in India). For each item, pick the chapter it belongs to from that item's candidates, judged from what the image shows and the date. Use "" if none fits. Then say what it is.
${lines.join("\n")}
Return JSON only: {"items":[{"i":1,"k":"<candidate key or empty>","kind":"${UPK.join("|")}","title":"what it shows, 3 to 8 words","tags":["2 to 4 short topic words"]}]}`;
    try {
      const r = await SAMPLE.json(prompt, {
        modelTier: "quick",
        cache: false,
        ...(imgs.length ? { images: imgs } : {}),
      });
      (r?.items || []).forEach((o) => {
        const x = B[(+o.i || 0) - 1];
        if (!x) return;
        const ok = new Set(upCands(x.date).map((c) => c.u.k));
        if (o.k && ok.has(o.k)) x.k = o.k;
        if (UPK.includes(o.kind)) x.kind = o.kind;
        if (o.title) x.title = String(o.title).slice(0, 70);
        if (Array.isArray(o.tags)) x.tags = o.tags.slice(0, 4).map((t) => String(t).slice(0, 24));
      });
    } catch (e) {}
  }
}
async function upFiles(files) {
  if (!ASSETS) {
    toast("Files can be saved when DeepKids is open in claude.ai.");
    return;
  }
  ui.up = { n: files.length, i: 0, fail: 0, step: "save" };
  render();
  const added = [];
  for (const f of files) {
    ui.up.i++;
    render();
    try {
      const r = await ASSETS.upload(f);
      const d = iso(f.lastModified || Date.now());
      added.push({
        id: r.id,
        name: f.name,
        type: f.type || "",
        date: d > today ? today : d,
        k: "",
        title: f.name.replace(/\.[^.]+$/, "").slice(0, 60),
        kind: "",
        tags: [],
        src: "up",
        at: Date.now(),
        _f: f,
      });
    } catch (e) {
      ui.up.fail++;
      ui.up.err = e?.code;
    }
  }
  if (added.length) {
    ui.up.step = "tag";
    render();
    await upTag(added);
  }
  added.forEach((x) => {
    delete x._f;
    x.title = x.title || x.name;
  });
  const fail = ui.up.fail,
    code = ui.up.err;
  S.work = [...(S.work || []), ...added];
  ui.up = null;
  if (added.length) {
    sfx("win");
    toast(
      `Filed ${added.length}${added.filter((x) => x.k).length < added.length ? ` · ${added.length - added.filter((x) => x.k).length} need a chapter` : ""}`,
    );
  }
  if (fail)
    toast(
      code === "too_large"
        ? `${fail} file${fail > 1 ? "s were" : " was"} too big (20 MB max)`
        : `${fail} couldn't be saved`,
    );
  commit();
}
const isImg = (w) => !w.type || w.type.startsWith("image/");
function upCard(w, i) {
  const u = w.k && unitByK(w.k),
    C = upCands(w.date);
  return `<div class="upc">${isImg(w) ? `<img src="/_blob/${esc(w.id)}" alt="${esc(w.title || "Upload")}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'ph',textContent:'Photo'}))">` : `<a class="ph" href="/_blob/${esc(w.id)}" target="_blank" rel="noopener">${esc((w.name || "file").split(".").pop().toUpperCase())}</a>`}
    <div class="col" style="gap:4px;min-width:0"><b class="sm">${esc(w.title || w.name || "Upload")}</b><span class="xs muted">${esc(fmt(w.date))}${w.kind ? " · " + esc(w.kind) : ""}${(w.tags || []).length ? " · " + w.tags.map(esc).join(", ") : ""}</span>
    <select class="inp" style="height:36px;font-size:13px" data-upk="${esc(w.id)}" aria-label="Chapter"><option value="">${u ? "" : "Which chapter? "}Not linked to a chapter</option>${[...new Map([...(u ? [[u.k, u]] : []), ...C.map((c) => [c.u.k, c.u])]).values()].map((x) => `<option value="${esc(x.k)}" ${x.k === w.k ? "selected" : ""}>${esc(SUBJ[x.subj])} · ${esc(chT(x))}</option>`).join("")}</select></div></div>`;
}
// one square in the uploads grid: the photo or video itself, or the file's type; tap to open it full size
function upTile(w) {
  const u = unitByK(w.k),
    src = `/_blob/${esc(w.id)}`,
    vid = /^video\//.test(w.type || "") || /\.(mp4|mov|webm|m4v)$/i.test(w.name || "");
  return `<a class="uptile" href="${src}" target="_blank" rel="noopener" title="${esc((w.title || w.name || "Upload") + (u ? " · " + chT(u) : "") + " · " + fmt(w.date))}">${isImg(w) ? `<img src="${src}" alt="${esc(w.title || "Upload")}" loading="lazy">` : vid ? `<video src="${src}" muted preload="metadata"></video><span class="upplay">▶</span>` : `<span class="upfile">${esc((w.name || "file").split(".").pop().toUpperCase())}</span>`}</a>`;
}
function uploadsView() {
  document.getElementById("sheetTitle").textContent = "Uploads";
  const U = (S.work || []).slice().sort((a, b) => ((b.date || "") < (a.date || "") ? -1 : 1)),
    P = ui.up;
  let h = `<label class="drop ${P ? "busy" : ""}">${blob("var(--leaf)", 5, "wow", "", 'width="48" height="48"')}<b>${P ? (P.step === "tag" ? "Reading and filing…" : `Saving ${P.i} of ${P.n}…`) : "Add photos, videos and files"}</b><span class="xs muted">${P ? "Keep this open for a moment." : "Pick as many as you like: worksheets, drawings, notebook pages, experiments, outings. DeepKids matches each to the day and chapter. Nothing to fill in."}</span><input type="file" id="upFiles" multiple accept="image/*,application/pdf,video/*,.doc,.docx,.ppt,.pptx" hidden ${P ? "disabled" : ""}></label>
  ${ASSETS ? "" : `<p class="xs muted">Saving files works when DeepKids is open in claude.ai.</p>`}`;
  const need = U.filter((w) => !w.k);
  if (need.length)
    h += `<section class="sec"><div class="sech"><h3 style="font-size:18px">Need a chapter</h3><span class="pill">${need.length}</span></div><p class="xs muted">Pick one, or leave it as a general memory.</p><div class="col" style="gap:8px">${need.map(upCard).join("")}</div></section>`;
  const done = U.filter((w) => w.k);
  if (done.length)
    h += `<section class="sec"><div class="sech"><h3 style="font-size:18px">Everything so far</h3><span class="pill">${done.length}</span></div><div class="upgrid">${done.map(upTile).join("")}</div></section>`;
  if (!U.length) h += `<p class="note">Nothing uploaded yet.</p>`;
  return h;
}
const CHC = {
  math: "#2A8FB0",
  eng: "#C24F8A",
  hin: "#D98A2B",
  sci: "#3F8A4F",
  wml: "#C9A227",
  wart: "#C24F8A",
};
const hmin = (m) => {
  m = Math.round(m);
  return m < 60 ? m + " min" : Math.floor(m / 60) + " h" + (m % 60 ? " " + (m % 60) + " m" : "");
};
// timed study, by day and subject: lesson steps (21-actions) and the time spent inside a DeepKids-track unit (fxOpen)
function addMins(subj, sec) {
  if (!subj) return;
  S.mins = S.mins || {};
  const key = today + "|" + subj;
  S.mins[key] = Math.round(((S.mins[key] || 0) + sec / 60) * 10) / 10;
}
function trackData() {
  const D = {},
    day = (d) => (D[d] = D[d] || { m: {}, e: {}, did: [] }),
    add = (d, s, f, m) => {
      const x = day(d);
      x[f][s] = (x[f][s] || 0) + m;
    };
  Object.entries(S.mins || {}).forEach(([k, m]) => {
    const [d, s] = k.split("|");
    add(d, s, "m", m);
  });
  (S.pace || []).forEach((p) => {
    const u = unitByK(p.k);
    if (!u || S.mins?.[p.date + "|" + u.subj] !== undefined) return;
    add(p.date, u.subj, "m", p.took || 0);
  });
  S.log
    .slice()
    .reverse()
    .forEach((l) => {
      if (l.kind === "free" && !l.title) return;
      const x = day(l.date),
        u = unitByK(l.key);
      if (!x.m[l.subj] && l.kind !== "skipped") add(l.date, l.subj, "e", lessonMins(l.subj, l.date));
      x.did.push({ t: "lesson", s: l.subj, u, n: l.n, title: l.title, at: l.at, sk: l.kind === "skipped" });
    });
  Object.entries(S.tasks || {}).forEach(([k, o]) =>
    Object.entries(o).forEach(([id, d]) => {
      if (typeof d !== "string" || !/^\d{4}-/.test(d)) return;
      const [uk, w] = k.split("#"),
        u = unitByK(uk);
      if (!u) return;
      if (id === "ws") {
        const pw = w && u.c?.p?.worksheets?.find((z) => z.id === w);
        day(d).did.push({ t: "ws", s: u.subj, u, title: pw ? pw.title : "Worksheet" });
      }
    }),
  );
  Object.entries(WK()).forEach(([key, w]) => {
    const j = key.lastIndexOf("|"),
      u = unitByK(key.slice(0, j));
    if (!u) return;
    if (w.started && w.st !== "done") day(w.started).did.push({ t: "start", s: u.subj, u, title: w.title });
    if (w.done) day(w.done).did.push({ t: "proj", s: u.subj, u, title: w.title });
  });
  Object.entries(S.quiz || {}).forEach(([key, q]) => {
    const j = key.lastIndexOf("|"),
      u = unitByK(key.slice(0, j)),
      its = Object.values(q);
    if (!u || !its.length) return;
    const d = its
      .map((x) => x.d)
      .sort()
      .pop();
    day(d).did.push({
      t: "quiz",
      s: u.subj,
      u,
      n: +key.slice(j + 1),
      title: `${its.filter((x) => x.r).length} of ${its.length} got it`,
    });
  });
  (S.work || []).forEach((w) => {
    if (w.date) day(w.date).did.push({ t: "up", w, u: w.k && unitByK(w.k), s: w.k && unitByK(w.k)?.subj });
  });
  Object.entries(fxSt().done).forEach(([id, D]) => {
    const u = unitBy("unit|" + id),
      P = DATA.units?.[id]?.parts || [];
    Object.entries(D).forEach(([k, d]) => {
      if (!k.startsWith("at:")) return;
      const pt = P.find((p) => p[0] === k.slice(3));
      day(d).did.push({ t: "part", s: u?.subj, u, title: pt ? pt[1] : "A part" });
    });
  });
  Object.entries(S.evlog || {}).forEach(([k, r]) => {
    const j = k.indexOf("|"),
      e = evFind(k.slice(j + 1));
    day(k.slice(0, j)).did.push({ t: "ev", title: e?.title || "Class", r });
  });
  (S.exps || []).forEach((e) => (e.checks || []).forEach((d) => day(d).did.push({ t: "check", title: e.title })));
  return D;
}
const dTot = (x) => Object.values(x.m).reduce((a, b) => a + b, 0) + Object.values(x.e).reduce((a, b) => a + b, 0);
function didLine(x) {
  const ch = x.u ? esc(chT(x.u)) : "";
  return x.t === "lesson"
    ? `<li><b>${ch}</b>${x.n ? ` · Part ${x.n}` : ""}${x.sk ? " (skipped)" : ""}${x.at != null ? ` <span class="xs muted">${clock(x.at)}</span>` : ""}</li>`
    : x.t === "ws"
      ? `<li>Worksheet finished: ${esc(x.title)} <span class="xs muted">${ch}</span></li>`
      : x.t === "quiz"
        ? `<li>Quiz, Part ${x.n}: ${esc(x.title)} <span class="xs muted">${ch}</span></li>`
        : x.t === "proj"
          ? `<li>Finished: ${esc(x.title)} <span class="xs muted">${ch}</span></li>`
          : x.t === "start"
            ? `<li>Started: ${esc(x.title)} <span class="xs muted">${ch}</span></li>`
            : x.t === "ev"
              ? evLogLine(x)
              : x.t === "check"
                ? `<li>Checked on: ${esc(x.title)}</li>`
                : x.t === "part"
                  ? `<li>${esc(x.title)} <span class="xs muted">${ch}</span></li>`
                  : "";
}
function trackChart(T, days) {
  const subs = SUBJ_KEYS.filter((s) => days.some((d) => T[d] && (T[d].m[s] || 0) + (T[d].e[s] || 0) > 0)),
    mx = Math.max(30, ...days.map((d) => (T[d] ? dTot(T[d]) : 0))),
    top = Math.ceil(mx / 30) * 30;
  if (!subs.length) return `<p class="note">No study time here yet. Time is measured as you go through lessons.</p>`;
  return `<div class="tlegend">${subs.map((s) => `<span><i style="background:${CHC[s]}"></i>${esc(SUBJ[s])}</span>`).join("")}<span class="xs muted"><i class="est"></i>Lighter: planned time, not timed</span></div>
  <div class="tchart" role="img" aria-label="Minutes studied each day"><div class="tgrid"><span style="bottom:100%">${hmin(top)}</span><span style="bottom:50%">${hmin(top / 2)}</span><span style="bottom:0">0</span></div>
  <div class="tbars">${days
    .map((d) => {
      const x = T[d] || { m: {}, e: {} },
        t = dTot(x),
        segs = subs
          .flatMap((s) => [
            [s, x.m[s] || 0, 0],
            [s, x.e[s] || 0, 1],
          ])
          .filter((z) => z[1] > 0),
        tip =
          `${fmt(d)} · ${hmin(t)}` +
          subs
            .filter((s) => (x.m[s] || 0) + (x.e[s] || 0))
            .map((s) => `\n${SUBJ[s]}: ${hmin((x.m[s] || 0) + (x.e[s] || 0))}${x.e[s] && !x.m[s] ? " (planned)" : ""}`)
            .join("");
      return `<div class="tcol" data-tip="${esc(t ? tip : fmt(d) + " · no study")}" tabindex="0"><div class="tstack" style="height:${(t / top) * 100}%">${segs.map(([s, m, e]) => `<i style="flex:${m};background:${CHC[s]};${e ? "opacity:.45" : ""}"></i>`).join("")}</div><span class="tx ${d === today ? "on" : ""}">${parse(d).getDate()}</span></div>`;
    })
    .join("")}</div></div>`;
}
function trackView() {
  document.getElementById("sheetTitle").textContent = "Tracking";
  const T = trackData(),
    ds = Object.keys(T)
      .filter((d) => d <= today)
      .sort()
      .reverse(),
    study = ds.filter((d) => dTot(T[d]) > 0 || T[d].did.some((x) => x.t === "lesson"));
  const all = study.reduce((a, d) => a + dTot(T[d]), 0),
    wk = study.filter((d) => d > addDays(today, -7)).reduce((a, d) => a + dTot(T[d]), 0),
    F = fxSt(),
    fin =
      Object.keys(S.progress || {}).filter((k) => st(k) === "completed").length +
      Object.keys({ ...F.done, ...F.time }).filter((id) => ["completed", "mastered"].includes(st("unit|" + id))).length,
    sub = {};
  study.forEach((d) =>
    SUBJ_KEYS.forEach((s) => {
      const m = (T[d].m[s] || 0) + (T[d].e[s] || 0);
      if (m || T[d].did.some((x) => x.s === s)) {
        sub[s] = sub[s] || { m: 0, days: 0 };
        sub[s].m += m;
        sub[s].days++;
      }
    }),
  );
  const smax = Math.max(1, ...Object.values(sub).map((x) => x.m));
  let h = `<div class="tiles"><div class="tile"><b>${hmin(all)}</b><span>studied in all</span></div><div class="tile"><b>${study.length}</b><span>study days</span></div><div class="tile"><b>${hmin(study.length ? all / study.length : 0)}</b><span>a study day, on average</span></div><div class="tile"><b>${hmin(wk)}</b><span>in the last 7 days</span></div><div class="tile"><b>${fin}</b><span>topics finished</span></div></div>`;
  h += trackPeriod(T);
  h += `<section class="sec"><div class="sech"><h3 style="font-size:18px">By subject</h3><span class="xs muted">all time</span></div>${
    Object.keys(sub).length
      ? `<div class="col" style="gap:10px">${SUBJ_KEYS.filter((s) => sub[s])
          .map(
            (s) =>
              `<div class="hbar"><span class="sm"><b>${esc(SUBJ[s])}</b> · ${hmin(sub[s].m)} on ${sub[s].days} day${sub[s].days === 1 ? "" : "s"}</span><div class="hb"><i style="width:${(sub[s].m / smax) * 100}%;background:${CHC[s]}"></i></div></div>`,
          )
          .join("")}</div>`
      : `<p class="xs muted">Nothing yet.</p>`
  }</section>`;
  return h;
}
// one day, week or month: how much time, by subject, and everything done in it, day by day
function trackPeriod(T) {
  const P = ui.tp || "week",
    o = Math.min(0, ui.tpo || 0),
    wd = parse(today).getDay();
  let days, label;
  if (P === "day") {
    days = [addDays(today, o)];
    label = o ? fmt(days[0]) : "Today";
  } else if (P === "week") {
    const mon = addDays(today, -((wd + 6) % 7) + 7 * o);
    days = Array.from({ length: 7 }, (_, i) => addDays(mon, i));
    label = o ? "Week of " + fmt(mon) : "This week";
  } else {
    const f = parse(today);
    f.setDate(1);
    f.setMonth(f.getMonth() + o);
    const first = iso(f),
      n = new Date(f.getFullYear(), f.getMonth() + 1, 0).getDate();
    days = Array.from({ length: n }, (_, i) => addDays(first, i));
    label = f.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  }
  const past = days.filter((d) => d <= today),
    tot = past.reduce((a, d) => a + (T[d] ? dTot(T[d]) : 0), 0),
    by = {};
  past.forEach((d) =>
    SUBJ_KEYS.forEach((s) => {
      const m = T[d] ? (T[d].m[s] || 0) + (T[d].e[s] || 0) : 0;
      if (m) by[s] = (by[s] || 0) + m;
    }),
  );
  const mx = Math.max(1, ...Object.values(by)),
    did = past
      .slice()
      .reverse()
      .filter((d) => T[d]?.did.length);
  return `<section class="sec"><div class="seg">${[
    ["day", "Day"],
    ["week", "Week"],
    ["month", "Month"],
  ]
    .map(([k, n]) => `<button aria-pressed="${P === k}" data-act="tp" data-v="${k}">${n}</button>`)
    .join("")}</div>
   <div class="pager"><button class="iconbtn" data-act="tpo" data-d="-1" aria-label="Earlier">${icon("back")}</button><b>${esc(label)}</b><button class="iconbtn" data-act="tpo" data-d="1" ${o >= 0 ? "disabled" : ""} aria-label="Later">${icon("next")}</button></div>
   <div class="tiles"><div class="tile"><b>${hmin(tot)}</b><span>studied</span></div><div class="tile"><b>${past.filter((d) => T[d] && dTot(T[d]) > 0).length}</b><span>study day${P === "day" ? "" : "s"}</span></div></div>
   ${P === "day" ? "" : trackChart(T, days)}
   ${
     Object.keys(by).length
       ? `<div class="col" style="gap:8px">${SUBJ_KEYS.filter((s) => by[s])
           .map(
             (s) =>
               `<div class="hbar"><span class="sm"><b>${esc(SUBJ[s])}</b> · ${hmin(by[s])}</span><div class="hb"><i style="width:${(by[s] / mx) * 100}%;background:${CHC[s]}"></i></div></div>`,
           )
           .join("")}</div>`
       : ""
   }
   <div class="sech" style="margin-top:8px"><h3 style="font-size:18px">What was done</h3></div>
   ${
     did.length
       ? did
           .map(
             (d) =>
               `<details class="card tday" ${d === did[0] ? "open" : ""}><summary><b>${esc(fmt(d))}</b> <span class="sm muted">· ${dTot(T[d]) ? hmin(dTot(T[d])) : "no timed study"}</span></summary><ul class="sm">${T[
                 d
               ].did
                 .filter((z) => z.t !== "up")
                 .map(didLine)
                 .join(
                   "",
                 )}${T[d].did.some((z) => z.t === "up") ? `<li>${T[d].did.filter((z) => z.t === "up").length} photo or file uploaded</li>` : ""}</ul></details>`,
           )
           .join("")
       : `<p class="note">Nothing done in this ${P} yet.</p>`
   }</section>`;
}
let TIP = null;
function tipAt(el) {
  if (!TIP) {
    TIP = document.createElement("div");
    TIP.id = "tip";
    document.body.appendChild(TIP);
  }
  TIP.textContent = el.dataset.tip;
  TIP.style.display = "block";
  const r = el.getBoundingClientRect(),
    w = TIP.offsetWidth;
  TIP.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + "px";
  TIP.style.top = Math.max(8, r.top - TIP.offsetHeight - 8) + "px";
}
const GRADE = (p) =>
  p >= 91
    ? "A1"
    : p >= 81
      ? "A2"
      : p >= 71
        ? "B1"
        : p >= 61
          ? "B2"
          : p >= 51
            ? "C1"
            : p >= 41
              ? "C2"
              : p >= 33
                ? "D"
                : "E";
const BOARDN = {
  combined: "DeepKids track",
  ncert: "NCERT / CBSE",
  cambridge: "Cambridge Primary",
  nios: "NIOS Open Basic Education",
  waldorf: "Waldorf (Steiner) education",
};
const lvN = (b, l) =>
  b === "nios"
    ? l === 3
      ? "Level A (≈ Class 3)"
      : l === 5
        ? "Level B (≈ Class 5)"
        : "Level " + l
    : b === "cambridge"
      ? `Stage ${l} (≈ Class ${l})`
      : `Class ${l}`;
function chScore(u) {
  const k = u.k,
    P = u.c?.p,
    cov = Math.min(1, done(k) / sessionsFor(u));
  let r = 0,
    n = 0;
  const sets = [
    ...(u.c?.x?.wsd ? [[k, u.c.x.wsd]] : []),
    ...(P?.worksheets || []).map((w) => [k + "#" + w.id, w.sections]),
  ];
  sets.forEach(([kk, W]) =>
    W.forEach(([_, its], si) =>
      its.forEach((it, ii) => {
        const v = A(kk, si + "-" + ii);
        if (v === undefined || v === "") return;
        if (it.t === "mcq") {
          n++;
          if (v === it.a) r++;
        } else if (it.t === "match" && v && typeof v === "object")
          it.pairs.forEach(([l, rr]) => {
            if (v[l] !== undefined) {
              n++;
              if (v[l] === rr) r++;
            }
          });
        else if (it.t === "fill")
          [].concat(v).forEach((x, bi) => {
            if (!x) return;
            n++;
            const acc = []
              .concat(it.a[bi] ?? "")
              .join("/")
              .split("/")
              .map((z) => z.trim().toLowerCase());
            if (acc.includes(String(x).trim().toLowerCase())) r++;
          });
      }),
    ),
  );
  Object.entries(S.quiz || {}).forEach(([kk, q]) => {
    if (kk.slice(0, kk.lastIndexOf("|")) !== k) return;
    Object.values(q).forEach((x) => {
      n++;
      if (x.r) r++;
    });
  });
  const dn = done(k),
    due = (it) => !it.day || it.day <= dn,
    pool = [
      ...(P?.worksheets || []).filter(due).map((w) => taskDone(k + "#" + w.id, "ws")),
      ...(P?.experiments || []).filter(due).map((e) => taskDone(k, e.id)),
      ...(P?.activities || []).filter(due).map((a) => taskDone(k, a.id)),
      ...(u.c?.x?.wsd && cov >= 1 ? [taskDone(k, "ws")] : []),
    ];
  const prac = pool.length ? pool.filter(Boolean).length / pool.length : null,
    acc = n ? r / n : null,
    parts = [
      [acc, 0.7],
      [prac, 0.3],
    ].filter((p) => p[0] !== null),
    w = parts.reduce((a, p) => a + p[1], 0),
    score = w ? Math.round((parts.reduce((a, p) => a + p[0] * p[1], 0) / w) * 100) : null;
  const last = S.log
    .filter((l) => l.key === k)
    .map((l) => l.date)
    .sort();
  return {
    u,
    cov,
    acc,
    n,
    r,
    prac,
    score,
    grade: score == null ? "" : GRADE(score),
    fin: st(k) === "completed" || done(k) >= sessionsFor(u),
    from: last[0],
    to: last[last.length - 1],
  };
}
function schoolData() {
  const studied = Object.keys(S.progress || {})
      .filter((k) => done(k) > 0)
      .map(unitByK)
      .filter((u) => u && u.board !== "dk" && u.board !== "gen"),
    sc = studied.map(chScore),
    T = trackData(),
    ds = Object.keys(T)
      .filter((d) => dTot(T[d]) > 0 || T[d].did.some((x) => x.t === "lesson"))
      .sort();
  const finK = new Set(sc.filter((x) => x.fin).map((x) => x.u.k)),
    stK = new Set(sc.map((x) => x.u.k)),
    RC = DATA.rconcepts || [],
    conOf = {};
  RC.forEach((c) => c.chapters.forEach((k) => (conOf[k] = conOf[k] || []).push(c)));
  const cDone = new Set(RC.filter((c) => c.chapters.some((k) => finK.has(k))).map((c) => c.id)),
    cSome = new Set(RC.filter((c) => c.chapters.some((k) => stK.has(k))).map((c) => c.id));
  const subs = SUBJ_KEYS.filter((s) => S.subjects.includes(s) || sc.some((x) => x.u.subj === s)).map((s) => {
    const L = sc.filter((x) => x.u.subj === s),
      G = L.filter((x) => x.score != null),
      wt = G.reduce((a, x) => a + x.n + 1, 0),
      score = G.length ? Math.round(G.reduce((a, x) => a + x.score * (x.n + 1), 0) / wt) : null,
      mins = ds.reduce((a, d) => a + (T[d].m[s] || 0) + (T[d].e[s] || 0), 0);
    const boards = ["ncert", "cambridge", "nios"]
      .map((b) => {
        const us = DATA.items.filter((u) => u.board === b && u.subj === s);
        if (!us.length) return null;
        const lv = {};
        us.forEach((u) => {
          const R = (lv[u.level] = lv[u.level] || { tot: 0, done: 0, eq: 0, going: 0 });
          R.tot++;
          const cs = conOf[u.k] || [];
          if (finK.has(u.k)) R.done++;
          else if (stK.has(u.k)) R.going++;
          else if (cs.length && cs.every((c) => cDone.has(c.id))) R.eq++;
          else if (cs.some((c) => cDone.has(c.id) || cSome.has(c.id))) R.going++;
        });
        const levels = Object.keys(lv)
            .map(Number)
            .sort((a, b) => a - b),
          reached = levels.filter((l) => (lv[l].done + lv[l].eq) / lv[l].tot >= 0.8).pop(),
          working = levels.filter((l) => lv[l].done + lv[l].eq + lv[l].going > 0).pop();
        return { b, lv, levels, reached, working };
      })
      .filter(Boolean);
    return { s, L, score, grade: score == null ? "" : GRADE(score), mins, level: S.levels?.[s], boards };
  });
  const ws = Object.entries(S.tasks || {}).filter(([k, o]) => o.ws).length,
    proj = Object.values(WK()).filter((w) => w.st === "done").length,
    qz = Object.values(S.quiz || {}).reduce((a, q) => a + Object.keys(q).length, 0);
  const months = {};
  ds.forEach((d) => {
    const m = d.slice(0, 7);
    months[m] = months[m] || { d: 0, m: 0 };
    months[m].d++;
    months[m].m += dTot(T[d]);
  });
  return {
    subs,
    ds,
    from: ds[0],
    to: ds[ds.length - 1],
    mins: ds.reduce((a, d) => a + dTot(T[d]), 0),
    ws,
    proj,
    qz,
    ups: (S.work || []).length,
    months,
    cross: RC.length,
  };
}
const SCORE_NOTE =
  "Scores (0–100) measure the work done so far, not how far the child has got: 70% accuracy on auto-checked worksheet items and quiz questions, 30% worksheets, experiments and activities finished out of those due by the parts completed. How much of each chapter is complete is shown separately. Subject scores weight chapters by how many answers were checked. Grades use the CBSE 8-point scale: A1 91–100, A2 81–90, B1 71–80, B2 61–70, C1 51–60, C2 41–50, D 33–40, E below 33. These are records of home learning, not exam marks.";
function covCell(R) {
  if (!R) return "—";
  const p = Math.round(((R.done + R.eq) / R.tot) * 100);
  return `${p}%<span class="xs muted"> · ${R.done} done${R.eq ? `, ${R.eq} by equivalent` : ""}${R.going ? `, ${R.going} begun` : ""} of ${R.tot}</span>`;
}
function schoolView() {
  document.getElementById("sheetTitle").textContent = "Moving to a school";
  const D = schoolData(),
    I = S.school || {},
    f = (k, l, type = "text", ph = "") =>
      `<div class="field"><label for="sch-${k}">${l}</label><input class="inp" id="sch-${k}" type="${type}" data-sch="${k}" value="${esc(I[k] || "")}" placeholder="${esc(ph)}"></div>`;
  let h = `<p class="sm muted">A full record of what ${esc(S.child || "your child")} has covered at home, by board and level, with scores. Download it as a transcript for the new school.</p>
  <div class="row" style="gap:10px;flex-wrap:wrap"><button class="btn accent sm" data-act="tsave">Download transcript</button><button class="btn soft sm" data-act="tprint">Print or save as PDF</button></div>
  <details class="card"><summary><b>Details for the school</b> <span class="xs muted">· optional</span></summary><div class="fgrid" style="margin-top:10px">${f("dob", "Date of birth", "date")}${f("to", "School applying to", "text", "e.g. Kendriya Vidyalaya, Indiranagar")}${f("cls", "Class applying for", "text", "e.g. Class 4")}${f("contact", "Parent phone or email")}</div><div class="field"><label for="sch-note">A note for the school</label><textarea class="inp" id="sch-note" data-sch="note" rows="3" placeholder="How you homeschool, strengths, anything they should know">${esc(I.note || "")}</textarea></div></details>`;
  h += testSection();
  h += `<div class="tiles"><div class="tile"><b>${D.ds.length}</b><span>study days${D.from ? ` since ${esc(fmt(D.from))}` : ""}</span></div><div class="tile"><b>${hmin(D.mins)}</b><span>of study</span></div><div class="tile"><b>${D.subs.reduce((a, x) => a + x.L.filter((c) => c.fin).length, 0)}</b><span>chapters completed</span></div><div class="tile"><b>${D.ws}</b><span>worksheets finished</span></div></div>`;
  const idle = D.subs.filter((x) => !x.L.length);
  D.subs
    .filter((x) => x.L.length)
    .forEach((x) => {
      h += `<section class="card ${SC(x.s)}"><div class="sech"><h3 style="font-size:19px">${esc(SUBJ[x.s])}</h3>${x.score != null ? `<span class="grade" title="Score ${x.score}">${x.grade} · ${x.score}</span>` : `<span class="xs muted">no checked work yet</span>`}</div>
    <p class="xs muted">${hmin(x.mins)} · ${x.L.filter((c) => c.fin).length} chapters completed, ${x.L.filter((c) => !c.fin).length} in progress${x.level ? ` · working at Level ${x.level}` : ""}</p>
    <div class="grid"><table class="rtab"><tr><th>Board</th><th>Where the child is</th>${[1, 2, 3, 4, 5].map((l) => `<th>L${l}</th>`).join("")}</tr>${x.boards.map((B) => `<tr><td><b>${esc(BOARDN[B.b])}</b></td><td class="xs">${B.reached ? `Covers ${esc(lvN(B.b, B.reached))}` : B.working ? `Working on ${esc(lvN(B.b, B.working))}` : "Not begun"}</td>${[1, 2, 3, 4, 5].map((l) => `<td class="xs">${B.lv[l] ? Math.round(((B.lv[l].done + B.lv[l].eq) / B.lv[l].tot) * 100) + "%" : "·"}</td>`).join("")}</tr>`).join("")}</table></div>
    ${
      x.L.length
        ? `<details><summary class="link sm" style="cursor:pointer">Chapters and scores (${x.L.length})</summary><table class="rtab" style="margin-top:8px"><tr><th>Chapter</th><th>Done</th><th>Accuracy</th><th>Score</th></tr>${x.L.sort(
            (a, b) => a.u.level - b.u.level || (+a.u.n || 0) - (+b.u.n || 0),
          )
            .map(
              (c) =>
                `<tr><td><b>${esc(chT(c.u))}</b><br><span class="xs muted">${esc(BOARDN[c.u.board] || c.u.book)} · ${esc(lvN(c.u.board, c.u.level))}</span></td><td>${Math.round(c.cov * 100)}%</td><td>${c.acc == null ? "—" : Math.round(c.acc * 100) + "%"}<span class="xs muted">${c.n ? ` (${c.r}/${c.n})` : ""}</span></td><td>${c.score == null ? "—" : `<b>${c.grade}</b> ${c.score}`}</td></tr>`,
            )
            .join("")}</table></details>`
        : ""
    }</section>`;
    });
  if (idle.length) h += `<p class="sm muted">Not started yet: ${idle.map((x) => esc(SUBJ[x.s])).join(", ")}.</p>`;
  if (!D.subs.some((x) => x.L.length)) h += `<p class="note">Finish a few lessons and the report fills in here.</p>`;
  h += `<p class="xs muted">${SCORE_NOTE}</p><p class="xs muted">Board percentages count chapters done in that board, plus Science chapters of other boards that teach the same ideas (${D.cross} shared Science concepts are mapped across NCERT, Cambridge and NIOS). Other subjects count each board's own chapters only.</p>`;
  h += bundleSection();
  return h;
}
function transcriptDoc() {
  const D = schoolData(),
    I = S.school || {},
    kid = S.child || "Student",
    row = (a, b) => (b ? `<tr><th>${a}</th><td>${b}</td></tr>` : "");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(kid)} · Home education transcript</title><style>body{font:14px/1.5 system-ui,sans-serif;color:#222;max-width:820px;margin:24px auto;padding:0 16px}h1{font-size:22px;margin:0}h2{font-size:17px;margin:26px 0 6px;border-bottom:2px solid #333;padding-bottom:3px}h3{font-size:15px;margin:16px 0 4px}table{border-collapse:collapse;width:100%;margin:4px 0}th,td{border:1px solid #bbb;padding:5px 8px;text-align:left;vertical-align:top}th{background:#f2f2f2}.k th{width:34%;background:#fafafa}.muted{color:#666}.sm{font-size:12px}.sig{display:flex;gap:40px;margin-top:40px}.sig div{flex:1;border-top:1px solid #333;padding-top:4px;font-size:12px}@media print{body{margin:0}h2{break-after:avoid}table{break-inside:auto}tr{break-inside:avoid}}</style></head><body>
  <h1>Home education transcript</h1><p class="muted">Prepared with DeepKids · ${esc(new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }))}</p>
  <h2>Student</h2><table class="k">${row("Name", esc(kid))}${row("Date of birth", I.dob ? esc(parse(I.dob).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })) : "")}${row("Age", S.age ? esc(S.age) + " years" : "")}${row("Parent / guardian", esc(S.parent?.name || ""))}${row("Contact", esc(I.contact || ""))}${row("Applying to", esc([I.to, I.cls].filter(Boolean).join(", ")))}${row(
    "Boards followed",
    esc(
      boardsOn()
        .map((b) => BOARDN[b] || b)
        .join(", ") || "DeepKids",
    ),
  )}${row("Period of home learning", D.from ? esc(fmt(D.from) + " to " + fmt(D.to)) : "")}</table>
  <h2>Summary</h2><table><tr><th>Subject</th><th>Level working at</th><th>Chapters completed</th><th>In progress</th><th>Study time</th><th>Score</th><th>Grade</th></tr>${D.subs.map((x) => `<tr><td>${esc(SUBJ[x.s])}</td><td>${x.level ? "Level " + x.level + " (≈ Class " + x.level + ")" : "—"}</td><td>${x.L.filter((c) => c.fin).length}</td><td>${x.L.filter((c) => !c.fin).length}</td><td>${hmin(x.mins)}</td><td>${x.score ?? "—"}</td><td>${x.grade || "—"}</td></tr>`).join("")}</table>
  <p class="sm">Study days: ${D.ds.length} · Total study time: ${hmin(D.mins)} · Worksheets finished: ${D.ws} · Quiz questions answered: ${D.qz} · Projects and experiments finished: ${D.proj} · Work samples kept: ${D.ups}</p>
  <h2>Coverage by board and level</h2><p class="sm muted">Share of each board's chapters covered at each level. "By equivalent" counts Science chapters of a board whose ideas were all covered through another board's chapters.</p>${D.subs.map((x) => `<h3>${esc(SUBJ[x.s])}</h3><table><tr><th>Board</th><th>Level reached</th><th>Level 1</th><th>Level 2</th><th>Level 3</th><th>Level 4</th><th>Level 5</th></tr>${x.boards.map((B) => `<tr><td>${esc(BOARDN[B.b])}</td><td>${B.reached ? esc(lvN(B.b, B.reached)) : B.working ? "Working on " + esc(lvN(B.b, B.working)) : "Not begun"}</td>${[1, 2, 3, 4, 5].map((l) => `<td>${covCell(B.lv[l])}</td>`).join("")}</tr>`).join("")}</table>`).join("")}
  <h2>Chapters studied</h2>${
    D.subs
      .filter((x) => x.L.length)
      .map(
        (x) =>
          `<h3>${esc(SUBJ[x.s])}</h3><table><tr><th>Chapter</th><th>Board · level</th><th>Dates</th><th>Completed</th><th>Accuracy</th><th>Score</th><th>Grade</th></tr>${x.L.map((c) => `<tr><td>${esc(chT(c.u))}</td><td>${esc(BOARDN[c.u.board] || c.u.book)} · ${esc(lvN(c.u.board, c.u.level))}</td><td>${c.from ? esc(fmt(c.from)) + (c.to && c.to !== c.from ? " – " + esc(fmt(c.to)) : "") : ""}</td><td>${Math.round(c.cov * 100)}%</td><td>${c.acc == null ? "—" : Math.round(c.acc * 100) + "% (" + c.r + "/" + c.n + ")"}</td><td>${c.score ?? "—"}</td><td>${c.grade || "—"}</td></tr>`).join("")}</table>`,
      )
      .join("") || `<p>No chapters recorded yet.</p>`
  }
  <h2>Attendance</h2><table><tr><th>Month</th><th>Study days</th><th>Study time</th></tr>${Object.keys(D.months)
    .sort()
    .map(
      (m) =>
        `<tr><td>${esc(parse(m + "-01").toLocaleDateString(undefined, { month: "long", year: "numeric" }))}</td><td>${D.months[m].d}</td><td>${hmin(D.months[m].m)}</td></tr>`,
    )
    .join("")}</table>
  ${I.note ? `<h2>Note from the parent</h2><p>${esc(I.note).replace(/\n/g, "<br>")}</p>` : ""}
  ${quizTranscript()}${testTranscript()}<h2>How scores are worked out</h2><p class="sm">${SCORE_NOTE}</p><p class="sm">Study time is measured while lessons are open in the app; days without timing use the planned lesson length and are included in totals.</p>
  <h2>Declaration</h2><p class="sm">I confirm that this record reflects my child's home learning.</p><div class="sig"><div>Parent / guardian signature</div><div>Date</div></div></body></html>`;
}
async function saveDoc(html, name) {
  try {
    const dl = await window.claude?.use?.("downloads");
    if (dl) {
      await dl.save({ filename: name, data: html });
      toast("Saved");
      return;
    }
  } catch (e) {
    if (e?.code === "declined") return;
  }
  try {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast("Saved");
  } catch (e) {
    toast("Couldn't save here. Try Print instead.");
  }
}
function printDoc(html) {
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
    setTimeout(() => {
      try {
        w.print();
      } catch (e) {}
    }, 300);
    return;
  }
  const f = document.createElement("iframe");
  f.style.cssText = "position:fixed;width:0;height:0;border:0";
  document.body.appendChild(f);
  f.srcdoc = html;
  f.onload = () => {
    try {
      f.contentWindow.print();
    } catch (e) {
      toast("Printing isn't allowed here. Download it, then print that.");
    }
    setTimeout(() => f.remove(), 4000);
  };
}
function folderData() {
  const keys = new Set([
      ...S.log.map((l) => l.key),
      ...Object.keys(S.ans || {}).map((k) => k.split("#")[0]),
      ...Object.keys(S.quiz || {}).map((k) => k.slice(0, k.lastIndexOf("|"))),
      ...Object.keys(WK()).map((k) => k.slice(0, k.lastIndexOf("|"))),
      ...Object.keys(S.tasks || {}).map((k) => k.split("#")[0]),
    ]),
    out = [];
  [...keys]
    .map(unitByK)
    .filter(Boolean)
    .forEach((u) => {
      const P = u.c?.p,
        ws = [],
        qz = [],
        pj = [];
      const addWs = (k, title, tier, W) => {
        const c = wsCount(k, W);
        if (!c.ans && !taskDone(k, "ws")) return;
        ws.push({ k, title, tier, W, ...c, fin: S.tasks[k]?.ws || "" });
      };
      (P?.worksheets || []).forEach((w) => addWs(u.k + "#" + w.id, w.title, w.tier, w.sections));
      if (u.c?.x?.wsd) addWs(u.k, "Chapter worksheet", "", u.c.x.wsd);
      Object.entries(S.quiz || {}).forEach(([k, q]) => {
        if (k.slice(0, k.lastIndexOf("|")) !== u.k) return;
        const n = +k.slice(k.lastIndexOf("|") + 1),
          its = Object.entries(q)
            .sort((a, b) => a[0] - b[0])
            .map(([, x]) => x);
        if (its.length)
          qz.push({
            n,
            its,
            d: its
              .map((x) => x.d)
              .sort()
              .pop(),
          });
      });
      qz.sort((a, b) => a.n - b.n);
      const ids = new Set([
        ...Object.keys(WK())
          .filter((k) => k.slice(0, k.lastIndexOf("|")) === u.k)
          .map((k) => k.slice(k.lastIndexOf("|") + 1)),
        ...Object.keys(S.tasks[u.k] || {}).filter(WKID),
      ]);
      ids.forEach((id) => {
        const w = wkOf(u.k, id);
        if (w) pj.push({ id, title: w.title || wkTitle(u, id, id), ...w });
      });
      if (ws.length || qz.length || pj.length) out.push({ u, ws, qz, pj });
    });
  return out.sort(
    (a, b) =>
      SUBJ_KEYS.indexOf(a.u.subj) - SUBJ_KEYS.indexOf(b.u.subj) || a.u.level - b.u.level || (a.u.n || 0) - (b.u.n || 0),
  );
}
function folderBody(F, flat) {
  if (!F.length)
    return `<p class="note">Nothing here yet. Finished worksheets, quiz answers and projects collect here as you go.</p>`;
  return F.map(({ u, ws, qz, pj }, ci) => {
    const inner = `${ws.map((w) => `<div class="fws"><h4>${esc(w.title)}${w.tier ? ` <span class="xs muted">(${esc(TIER[w.tier] || "")})</span>` : ""}</h4><p class="xs muted">${w.fin ? "Finished " + fmt(w.fin) : "In progress"} · ${w.ans} of ${w.tot} answered</p>${w.W.map(([sn, its], si) => `<p class="xs eyebrow">${esc(sn)}</p><ol class="fq">${its.map((it, ii) => `<li><p class="sm">${esc(it.p)}</p>${ansHtml(it, A(w.k, si + "-" + ii), w.k + "|" + si + "-" + ii)}</li>`).join("")}</ol>`).join("")}</div>`).join("")}
    ${qz.map((q) => `<div class="fws"><h4>Quiz · Part ${q.n}</h4><p class="xs muted">${q.d ? fmt(q.d) + " · " : ""}${q.its.filter((x) => x.r).length} of ${q.its.length} got it</p><ol class="fq">${q.its.map((x) => `<li><p class="sm"><b>${esc(x.q)}</b> ${x.r ? `<span class="fok">Got it</span>` : `<span class="fno">Not yet</span>`}</p><p class="xs muted">${esc(x.a)}</p></li>`).join("")}</ol></div>`).join("")}
    ${pj.length ? `<div class="fws"><h4>Activities, experiments and projects</h4><ul class="sm">${pj.map((p) => `<li><b>${esc(p.title)}</b> · ${p.st === "done" ? `finished ${fmt(p.done)}${p.started && p.started !== p.done ? `, started ${fmt(p.started)}` : ""}` : p.st === "started" ? `started ${fmt(p.started)}, not finished` : `in the pipeline since ${fmt(p.planned)}`}</li>`).join("")}</ul></div>` : ""}`;
    const head = esc(chT(u)),
      meta = `${esc(SUBJ[u.subj])} · ${[ws.length && ws.length + " worksheet" + (ws.length > 1 ? "s" : ""), qz.length && qz.length + " quiz" + (qz.length > 1 ? "zes" : ""), pj.length && pj.length + " project" + (pj.length > 1 ? "s" : "")].filter(Boolean).join(" · ")}`;
    return flat
      ? `<section><h3>${head}</h3><p class="xs muted">${meta}</p>${inner}</section>`
      : `<details class="card fch" ${ci === 0 ? "open" : ""}><summary><b>${head}</b><br><span class="xs muted">${meta}</span></summary>${inner}</details>`;
  }).join("");
}
function folderView() {
  document.getElementById("sheetTitle").textContent = "Work folder";
  const F = folderData();
  return `<p class="sm muted">Every worksheet with your child's answers, every quiz, and every project with its dates. Read it here any time, or save a copy.</p><div class="row" style="gap:10px;flex-wrap:wrap"><button class="btn accent sm" data-act="fsave" ${F.length ? "" : "disabled"}>Save a copy (.html)</button><button class="btn soft sm" data-act="fprint" ${F.length ? "" : "disabled"}>Print or save as PDF</button></div><p class="xs muted">Drawings made on screen are kept on this device.</p>${folderBody(F, false)}`;
}
function folderDoc(F0) {
  const F = F0 || folderData(),
    who = S.child || "My child";
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(who)} · DeepKids work folder</title><style>body{font:15px/1.5 system-ui,sans-serif;color:#2b2340;max-width:760px;margin:24px auto;padding:0 16px}h1{font-size:24px}h3{margin:28px 0 2px;font-size:19px;border-top:2px solid #eee;padding-top:16px}h4{margin:14px 0 2px}.xs{font-size:12px}.sm{font-size:14px}.muted{color:#776f8a}.eyebrow{font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin:10px 0 2px}ol,ul{padding-left:22px}li{margin:6px 0}p{margin:2px 0}.fok{color:#2e6b45;font-weight:700}.fno{color:#a0522d;font-weight:700}.fimg{max-width:320px;border:1px solid #ddd;border-radius:8px}table{border-collapse:collapse;font-size:13px}td,th{border:1px solid #ccc;padding:4px 8px;text-align:left}.fans{background:#f6f3ee;padding:6px 10px;border-radius:8px}</style></head><body><h1>${esc(who)}'s work folder</h1><p class="muted">DeepKids · saved ${esc(fmt(today))}</p>${folderBody(F, true)}</body></html>`;
}
async function folderSave() {
  return saveDoc(folderDoc(), `DeepKids work folder ${today}.html`);
}
function folderPrint() {
  printDoc(folderDoc());
}
function historyView() {
  document.getElementById("sheetTitle").textContent = "History";
  const L = S.log.filter((l) => l.kind !== "free" || l.title);
  if (!L.length)
    return `<p class="note">Lessons you finish are listed here, newest first, with the time and day of the chapter.</p>`;
  const by = {};
  L.forEach((l) => (by[l.date] = by[l.date] || []).push(l));
  const dates = Object.keys(by).sort().reverse(),
    chs = new Set(L.map((l) => l.key));
  return (
    `<p class="sm muted">${L.length} lesson${L.length === 1 ? "" : "s"} across ${chs.size} chapter${chs.size === 1 ? "" : "s"} and ${dates.length} day${dates.length === 1 ? "" : "s"}. Tap any to open the chapter.</p>` +
    dates
      .map(
        (d) =>
          `<section class="card" style="gap:0"><span class="eyebrow">${d === today ? "Today · " : d === addDays(today, -1) ? "Yesterday · " : ""}${esc(fmt(d))}</span>${by[
            d
          ]
            .slice()
            .sort((a, b) => (a.at ?? 9999) - (b.at ?? 9999))
            .map((l) => {
              const u = unitByK(l.key);
              return `<button class="plain hrow" ${u ? `data-act="chapter" data-k="${esc(l.key)}"` : ""}><span class="t num">${l.at != null ? clock(l.at) : "–"}</span><span style="min-width:0"><b>${esc(u ? chT(u) : l.title)}</b><br><span class="xs muted">${esc(SUBJ[l.subj] || "")}${l.n ? " · Part " + l.n + (u ? " of " + sessionsFor(u) : "") : ""}${u ? " · " + esc(unitLabel(u).split(" · ")[0]) : ""}</span></span>${u ? icon("next") : ""}</button>`;
            })
            .join("")}</section>`,
      )
      .join("")
  );
}
const JR = {
  high: "Highlights",
  board: "Syllabus progress",
  beyond: "Beyond the syllabus",
  diary: "Learning diary",
  numbers: "Numbers",
};
function jrView() {
  const p = ui.sheet.p;
  document.getElementById("sheetTitle").textContent = JR[p] || "Journey";
  return jPart(p) || `<p class="note">Nothing here yet. It fills up as ${esc(S.child || "your child")} learns.</p>`;
}
function jPart(p) {
  let h = "";
  if (p === "numbers") {
    const tasks = Object.values(S.tasks).reduce((a, t) => a + Object.keys(t).length, 0),
      gd = Object.values(S.games).filter((g) => g.g?.length || Object.keys(g.tf || {}).length || g.odd).length,
      hrs = S.log.reduce((a, l) => a + hpdOf(l.subj), 0);
    h += `<section class="sec"><div class="stack3">${[
      [S.log.length, "lessons", "var(--sun)"],
      [fh(hrs), "hours learned", "var(--pist)"],
      [tasks, "tasks done", "var(--gum)"],
      [gd, "game days", "var(--sky)"],
    ]
      .map(
        ([n, l, c], i) =>
          `<div class="scard" style="--c:${c};min-height:104px"><span class="big num">${n}</span><span class="sm" style="font-weight:800">${l}</span>${blob("rgba(255,255,255,.6)", 60 + i, "happy")}</div>`,
      )
      .join("")}</div></section>`;
  }
  if (p === "high") {
    const Qs = quotes().slice(-3).reverse(),
      W = workOf().slice(-6).reverse();
    if (Qs.length || W.length)
      h += `<section class="sec"><div class="sech"><h3>Highlights</h3></div>${Qs.map((q) => `<div class="quote ${SC(q.u.subj)}"><span class="eyebrow">${esc(q.q || "")}</span><p>“${esc(q.a)}”</p><span class="xs muted">${esc(q.u.title)}</span></div>`).join("")}${thumbs(W)}</section>`;
  }
  if (p === "board") {
    const bs = boardsOn();
    if (bs.length)
      h += `<section class="sec"><div class="sech"><h3>${JR.board}</h3><span class="xs muted">school year from ${fmt(AY0())}</span></div>${bs
        .map((b) => {
          const R = S.subjects.map((s) => ({ s, r: boardRows(s, b) })).filter((x) => x.r);
          if (!R.length) return "";
          return `<div class="card"><b style="font:600 17px var(--display)">${BOARDS[b]}</b>${R.map(({ s, r }) => `<div class="col" style="gap:4px"><div class="sech"><span class="sm" style="font-weight:800">${SUBJ[s]}</span><span class="xs ${r.behind.length ? "" : "muted"}" style="${r.behind.length ? "color:var(--bad);font-weight:800" : ""}">${r.behind.length ? `${r.behind.length} behind` : r.done.length >= r.exp ? "On track" : ""} · ${r.done.length} of ${r.us.length}</span></div><div class="bar ${SC(s)}"><span style="width:${(r.done.length / r.us.length) * 100}%;background:var(--c)"></span></div></div>`).join("")}</div>`;
        })
        .join("")}</section>`;
  }
  if (p === "beyond") {
    const beyond = S.log.filter((l) => l.key.startsWith("dk|") || l.kind === "free"),
      bk = [...new Set(beyond.map((l) => l.title))];
    h += `<section class="sec"><div class="sech"><h3>${JR.beyond}</h3></div><div class="card">${bk.length ? `<div class="row">${bk.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>` : `<p class="sm muted">DeepKids Plus topics and things you explore freely show up here.</p>`}<p class="xs muted">${S.exps.filter((e) => e.closed).length} experiments finished · ${quotes().length} big-question answers recorded</p></div></section>`;
  }
  if (p === "diary") {
    h += `<section class="sec"><div class="sech"><h3>Learning diary</h3></div><div class="card diary">${
      S.log
        .slice(0, 20)
        .map(
          (l) =>
            `<div class="dline ${SC(l.subj)}">${sblob(l.subj, "happy", "", 'width="34" height="34"')}<span><b style="font:600 16px var(--display)">${esc(l.title)}</b><br><span class="xs muted">${fmt(l.date)} · ${SUBJ[l.subj] || ""}${l.kind === "free" ? " · explored freely" : l.kind === "more" ? " · extra lesson" : ""}</span></span></div>`,
        )
        .join("") || `<p class="sm muted">Finished lessons appear here.</p>`
    }</div></section>`;
  }
  return h;
}
function learnItems() {
  const out = [],
    seen = new Set(),
    seenT = new Set();
  [today, tomorrow()].forEach((d) =>
    lessonsOn(d).forEach((l) => {
      if (l.done || !l.n) return;
      prepFor(l.u, l.n, l.tot)
        .filter((p) => LEARNK.has(p.kind))
        .forEach((p) => {
          const tk = l.u.k + "|" + p.task;
          if (!seen.has(p.id) && !seenT.has(tk)) {
            seen.add(p.id);
            seenT.add(tk);
            out.push({ ...p, u: l.u, s: l.s, date: d });
          }
        });
    }),
  );
  return out;
}
function learnView() {
  document.getElementById("sheetTitle").textContent = "For you";
  const its = learnItems(),
    groups = [];
  its.forEach((p) => {
    let g = groups.find((g) => g.u.k === p.u.k);
    if (!g) groups.push((g = { u: p.u, s: p.s, items: [] }));
    g.items.push(p);
  });
  const help = (S.parent?.help || []).filter((s) => S.subjects.includes(s));
  return `<section class="card r-you tint"><h2 style="font-size:22px">Your learning</h2><p class="sm muted">Guides and reading to help you teach today and tomorrow. Nothing here is required.</p></section>
   ${
     groups
       .map((g) => {
         const guide =
           g.u.c?.x?.guide ||
           (g.u.board !== "dk" && g.u.board !== "gen" ? DATA.prepgen.guide[g.u.subj] : summaryOf(g.u));
         return `<section class="card ${SC(g.s)}"><div class="row" style="gap:8px">${sblob(g.s, "happy", "", 'width="32" height="32"')}<b style="font:600 17px var(--display)">${esc(g.u.title)}</b></div>${guide ? `<p class="sm">${esc(guide)}</p>` : ""}${g.items
           .filter((p) => p.kind !== "guide")
           .map(
             (p) =>
               `<div class="taskrow ${S.prep[p.id] ? "done" : ""}"><button class="ckb" data-act="prep" data-id="${p.id}" aria-label="Done: ${esc(p.task)}">${icon("check")}</button><div><b style="font-weight:800">${esc(p.task)}</b><p class="xs muted">From: ${esc(p.where)}</p></div></div>`,
           )
           .join(
             "",
           )}<button class="btn soft sm" data-act="chapter" data-k="${g.u.k}" style="justify-self:start">Open the topic</button></section>`;
       })
       .join("") || `<p class="note">Nothing to read for today or tomorrow.</p>`
   }
   ${help.length ? `<section class="card"><span class="eyebrow">Subjects you asked for help with</span>${help.map((s) => `<p class="sm"><b>${SUBJ[s]}:</b> ${esc(DATA.prepgen.guide[s])}</p>`).join("")}</section>` : ""}`;
}
function photoBtn(k, label) {
  return ASSETS
    ? `<label class="btn soft sm" style="cursor:pointer">${icon("plus")}${label || "Add a photo of the work"}<input type="file" accept="image/*" data-upload="${k}" hidden></label>`
    : "";
}
function workOf(k) {
  return (S.work || []).filter((w) => !k || w.k === k);
}
const thumbs = (list) =>
  list.length
    ? `<div class="thumbs">${list.map((w) => `<figure><img src="/_blob/${esc(w.id)}" alt="Work from ${esc(w.title || "")}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'ph',textContent:'Photo'}))"><figcaption class="xs muted">${fmt(w.date)}</figcaption></figure>`).join("")}</div>`
    : "";
// parts done and parts in all, for a chapter or unit; a DeepKids-track unit counts every part done, in any order
function unitParts(u) {
  if (u.k.startsWith("unit|")) {
    const X = fxStates(u.k.slice(5));
    return [X.filter((x) => x === "done").length, X.length];
  }
  const n = sessionsFor(u);
  return [rank[coverage(u)] >= 2 ? n : Math.min(done(u.k), n), n];
}
// the exact share, to one decimal place: 5 of 412 parts is 1.2%
const pctTxt = (p) => (Math.round(p * 1000) / 10).toString() + "%";
function subjStats(s) {
  const us = [...collate(s).dk, ...collate(s).board],
    P = us.map(unitParts),
    tot = P.reduce((a, x) => a + x[1], 0),
    dn = P.reduce((a, x) => a + x[0], 0);
  return {
    us,
    pct: tot ? dn / tot : 0,
    parts: dn,
    allParts: tot,
    sessions: dn,
    total: tot,
    completed: us.filter((u) => rank[coverage(u)] >= 2).length,
    learning: us.filter((u) => coverage(u) === "learning").length,
  };
}
function wsStats(u) {
  const sets = [
    ...(u.c?.x?.wsd ? [[u.k, u.c.x.wsd]] : []),
    ...(u.c?.p?.worksheets || []).map((w) => [u.k + "#" + w.id, w.sections]),
  ];
  if (!sets.length) return null;
  let tot = 0,
    ans = 0,
    mq = 0,
    mr = 0;
  sets.forEach(([k, W]) =>
    W.forEach(([_, its], si) =>
      its.forEach((it, ii) => {
        tot++;
        const v = A(k, si + "-" + ii);
        if (v !== undefined && v !== "" && !(typeof v === "object" && !Object.keys(v).length)) ans++;
        if (it.t === "mcq" && v !== undefined) {
          mq++;
          if (v === it.a) mr++;
        }
      }),
    ),
  );
  return { tot, ans, mq, mr };
}
function quotes(filter) {
  const out = [];
  Object.entries(S.ans || {}).forEach(([k, o]) => {
    const u = unitBy(k);
    if (!u || !u.c?.x || (filter && !filter(u))) return;
    Object.entries(o).forEach(([q, v]) => {
      if (/^think\d$/.test(q) && typeof v === "string" && v.trim().length > 3)
        out.push({ u, q: u.c.x.deep[+q.slice(5)]?.q, a: v.trim() });
    });
  });
  return out;
}
const AY0 = () => {
  const d = parse(today),
    y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  return iso(new Date(y, 3, 1));
};
function boardRows(s, b) {
  const us = collateAt(s, S.levels[s]).board.filter((u) => u.board === b);
  if (!us.length) return null;
  const frac = Math.min(1, Math.max(0, (parse(today) - parse(AY0())) / (365 * 864e5))),
    exp = Math.round(us.length * frac);
  return {
    us,
    exp,
    done: us.filter((u) => rank[coverage(u)] >= 2),
    prog: us.filter((u) => coverage(u) === "learning"),
    behind: us.slice(0, exp).filter((u) => rank[coverage(u)] < 2),
  };
}
function jsubView() {
  const s = ui.sheet.s,
    x = subjStats(s);
  document.getElementById("sheetTitle").textContent = SUBJ[s] + " journey";
  const kid = esc(S.child || "Your child");
  const logs = S.log.filter((l) => l.subj === s),
    Qs = quotes((u) => u.subj === s),
    W = workOf().filter((w) => unitBy(w.k)?.subj === s);
  let h = `<section class="chero ${SC(s)}" style="min-height:140px"><span class="eyebrow" style="color:#2B2340;opacity:.7">${lvlLabel(S.levels[s])}</span><h1>${pctTxt(x.pct)} of this level</h1><p>${x.completed} chapters done · ${x.learning} in progress · ${x.parts} of ${x.allParts} parts done${logs.length ? ` · last on ${fmt(logs[0].date)}` : ""}</p>${sblob(s, "happy", "mascot sway")}</section>`;
  h += `<section class="card"><h3 style="font-size:19px">How well</h3>${(() => {
    let ans = 0,
      tot = 0,
      mq = 0,
      mr = 0,
      tk = 0,
      tt = 0;
    x.us.forEach((u) => {
      const w = wsStats(u);
      if (w) {
        ans += w.ans;
        tot += w.tot;
        mq += w.mq;
        mr += w.mr;
      }
      if (u.c?.x) {
        const ts = chapterTasks(u);
        tt += ts.length;
        tk += ts.filter((a) => taskDone(u.k, a[0])).length;
      }
    });
    return `<div class="stack3">${[
      [tot ? `${ans}/${tot}` : "–", "worksheet answers"],
      [mq ? Math.round((mr / mq) * 100) + "%" : "–", "multiple-choice right"],
      [tt ? `${tk}/${tt}` : "–", "tasks done"],
      [Qs.length, "big-question answers"],
    ]
      .map(([n, l]) => `<div class="rcardj"><b class="num">${n}</b><span class="xs muted">${l}</span></div>`)
      .join("")}</div>`;
  })()}</section>`;
  if (Qs.length || W.length)
    h += `<section class="card"><h3 style="font-size:19px">In ${kid}'s words</h3>${Qs.slice(-4)
      .reverse()
      .map(
        (q) =>
          `<div class="quote ${SC(s)}"><span class="eyebrow">${esc(q.q || "")}</span><p>“${esc(q.a)}”</p><span class="xs muted">${esc(q.u.title)}</span></div>`,
      )
      .join("")}${thumbs(W)}</section>`;
  boardsOn().forEach((b) => {
    const r = boardRows(s, b);
    if (!r) return;
    h += `<section class="card"><h3 style="font-size:19px">${BOARDS[b]}</h3><p class="xs muted">By this point in the school year, about ${r.exp} of ${r.us.length} chapters would usually be done.</p>${r.behind.length ? `<div><span class="eyebrow" style="color:var(--bad)">Not done yet, but due by now</span><div class="row" style="margin-top:6px">${r.behind.map((u) => `<button class="chip" data-act="chapter" data-k="${u.k}">${esc(u.title)}</button>`).join("")}</div></div>` : `<p class="sm" style="font-weight:800;color:var(--good)">On track for this point in the year.</p>`}${r.prog.length ? `<div><span class="eyebrow">In progress</span><div class="row" style="margin-top:6px">${r.prog.map((u) => `<button class="chip" data-act="chapter" data-k="${u.k}">${esc(u.title)}</button>`).join("")}</div></div>` : ""}</section>`;
  });
  const dk = x.us.filter((u) => u.board === "dk" && st(u.k) !== "none"),
    fr = [...new Set(logs.filter((l) => l.kind === "free").map((l) => l.title))];
  if (dk.length || fr.length)
    h += `<section class="card"><h3 style="font-size:19px">Learned beyond the syllabus</h3><div class="row">${[...dk.map((u) => u.title), ...fr].map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div></section>`;
  h += `<section class="sec"><div class="sech"><h3>Every topic</h3><span class="xs muted">tap for details</span></div><div class="col" style="gap:8px">${x.us
    .map((u) => {
      const cs = coverage(u),
        ul = S.log.filter((l) => l.key === u.k),
        w = wsStats(u),
        ts = u.c?.x ? chapterTasks(u) : null,
        open = ui.jopen === u.k;
      return `<div class="topic ${SC(u.subj)}"><button class="plain trow" data-act="jopen" data-k="${u.k}"><span class="no">${/^\d+$/.test(u.n) ? u.n : esc(u.n)}</span><span style="min-width:0"><b>${esc(u.title)}</b><br><span class="xs muted">${u.board === "dk" ? "DeepKids Plus" : BOARDS[u.board]} · Class ${DATA.levels[u.level].cls} · L${u.level}</span></span>${pillS(cs)}</button>${open ? `<div class="tdet"><div class="kv"><span>Lesson days</span><b>${Math.min(done(u.k), sessionsFor(u))} of ${sessionsFor(u)}</b><span>Started</span><b>${ul.length ? fmt(ul[ul.length - 1].date) : "Not yet"}</b><span>Last session</span><b>${ul.length ? fmt(ul[0].date) : "–"}</b>${ts ? `<span>Tasks</span><b>${ts.filter((a) => taskDone(u.k, a[0])).length} of ${ts.length}</b>` : ""}${w ? `<span>Worksheet</span><b>${w.ans} of ${w.tot} answered${w.mq ? `, ${w.mr}/${w.mq} choices right` : ""}</b>` : ""}${u.dk?.length ? `<span>DeepKids links</span><b>${u.dk.map((id) => esc(DATA.topics.find((t) => t.id === id)?.name || id)).join(", ")}</b>` : ""}</div>${thumbs(workOf(u.k))}<div class="row"><button class="btn soft sm" data-act="chapter" data-k="${u.k}">Open chapter</button>${photoBtn(u.k)}</div></div>` : ""}</div>`;
    })
    .join("")}</div></section>`;
  const c = collate(s);
  h += `<section class="sec"><div class="sech"><h3>Learning path</h3></div>${c.dk.length ? pathMap(c.dk, (u) => st(u.k)) : ""}${[
    ...new Set(c.board.map((u) => u.book)),
  ]
    .map(
      (b) =>
        `<p class="eyebrow">${esc(b)}</p>${pathMap(
          c.board.filter((u) => u.book === b),
          coverage,
        )}`,
    )
    .join("")}</section>`;
  return h;
}
const ring = (p, col) =>
  `<svg class="ring" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="var(--sunk)" stroke-width="5"/><circle cx="22" cy="22" r="18" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${113 * p} 113" transform="rotate(-90 22 22)"/><text x="22" y="26" text-anchor="middle" font-family="Fredoka,sans-serif" font-size="10" font-weight="600" fill="var(--ink)">${Math.round(p * 100)}%</text></svg>`;
function viewJourney0() {
  const kid = esc(S.child || "Your child"),
    Qn = quotes().length,
    W = workOf().length,
    bs = boardsOn();
  let h = `<section class="sec" style="margin-top:8px"><div class="sech"><h1 style="font-size:30px">${kid}'s journey</h1>${kidBlob("", "happy", 'width="54" height="54"')}</div><div class="stack3">${S.subjects
    .map((s) => {
      const x = subjStats(s);
      return `<button class="scard ${SC(s)}" data-act="jsub" data-s="${s}"><span class="eyebrow" style="color:#2B2340;opacity:.7">${SUBJ[s]}</span><span class="big num">${pctTxt(x.pct)}</span><span class="xs" style="font-weight:800">${x.parts} of ${x.allParts} parts done · ${x.completed} of ${x.us.length} chapters finished${x.learning ? ` · ${x.learning} started` : ""}</span>${sblob(s, "happy")}</button>`;
    })
    .join("")}</div></section>`;
  const rows = [
    [
      "high",
      "Highlights",
      Qn || W ? `${Qn} answers in ${kid}'s words · ${W} photos` : "Answers and photos of work",
      blob("var(--sun)", 4, "wow", "", 'width="40" height="40"'),
    ],
    ...(bs.length
      ? [
          [
            "board",
            JR.board,
            "What's done and what's due",
            blob("var(--sky)", 13, "calm", "", 'width="40" height="40"'),
          ],
        ]
      : []),
    [
      "beyond",
      JR.beyond,
      "Extra topics and free exploring",
      blob("var(--gum)", 7, "happy", "", 'width="40" height="40"'),
    ],
    [
      "diary",
      "Learning diary",
      S.log.length + " lessons so far",
      blob("var(--pist)", 9, "happy", "", 'width="40" height="40"'),
    ],
    [
      "numbers",
      "Numbers",
      "Lessons, hours, tasks, games",
      blob("var(--tang)", 11, "happy", "", 'width="40" height="40"'),
    ],
  ];
  h += `<section class="sec">${rows.map(([k, t, s, b]) => `<button class="menurow" data-act="jrsheet" data-p="${k}">${b}<span><b>${t}</b><br><span class="xs muted">${s}</span></span>${icon("next")}</button>`).join("")}</section>`;
  h += rfCard();
  h += doneHistory();
  return h;
}
