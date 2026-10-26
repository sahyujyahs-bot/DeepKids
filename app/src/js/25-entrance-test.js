/* ---------- entrance test: board + joining class, MCQ paper on the class before ---------- */
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
