/* A lesson: chapter page, steps, lesson packs, the lesson player */
const stepKey = (it) => (it.bonus ? "x" : "") + it.u.k + "|" + it.n;
/* step bodies used by the lesson player */
const taskLine = (u, id, text) => {
  if (WKID(id)) return workCtl(u, id, text);
  const d = taskDone(u.k, id);
  return `<button class="tline ${d ? "done" : ""}" data-act="task" data-k="${u.k}" data-id="${id}"><span class="ck">${icon("check")}</span><span>${esc(text)}</span></button>`;
};
function stepBody(u, name) {
  const c = u.c,
    x = c.x,
    k = KIND(name)[0],
    L = (a) => `<ul>${a.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
  if (k === "read")
    return `<p>Read <b>${esc(u.book)}, ${chNo(u)}</b> together. Let your child read parts aloud.</p><div class="ask"><span class="eyebrow">Stop and ask</span>${esc(x.deep[0].q)}</div>`;
  if (k === "learn")
    return `${L(x.learn)}<button class="btn soft sm" data-act="chapter" data-k="${u.k}" data-t="questions">Open the big questions</button>`;
  if (k === "ws")
    return `<p>${x.wsd.length} sections and ${x.wsd.reduce((a, s) => a + s[1].length, 0)} questions: drawing, tables, sorting, matching and thinking.</p><div class="row"><button class="btn accent sm" data-act="ws" data-k="${u.k}">Open the worksheet</button></div><div class="tasks-inline">${taskLine(u, "ws", "Worksheet finished")}</div>`;
  if (k === "exp")
    return `<p class="sm muted">Tick each one when it's done.</p><div class="tasks-inline">${c.exp.map((e, i) => taskLine(u, "exp" + i, e)).join("")}</div>`;
  if (k === "act")
    return `<p class="sm muted">Tick each one when it's done.</p><div class="tasks-inline">${c.act.map((e, i) => taskLine(u, "act" + i, e)).join("")}</div>`;
  if (k === "game")
    return `<p><b>${esc(c.game[0])}.</b> ${esc(c.game[1])}</p><div class="tasks-inline">${taskLine(u, "game", "We played it")}</div>`;
  if (k === "proj")
    return `<p><b>${esc(c.proj[0])}.</b> ${esc(c.proj[1])}</p><p class="sm muted">You end up with: ${esc(c.proj[2])}.</p><div class="row"><button class="btn soft sm" data-act="startexp" data-title="${esc(c.proj[0])}" data-topic="${esc(u.title)}">Track as an ongoing project</button></div><div class="tasks-inline">${taskLine(u, "proj", "Project finished")}</div>`;
  return "";
}
/* plan order comes from DATA.combined[subj][class]; a topic without its Combined lesson yet uses the board chapters for it */
const CBN = { ncert: "NCERT", cambridge: "Cambridge", nios: "NIOS" };
const amz = (b) => `https://www.amazon.in/s?k=${encodeURIComponent(b.title + " " + b.author)}`;
function combTabBasic(u, t) {
  const P = u.c.p;
  if (!P?.big) return "";
  if (t === "overview")
    return `<section class="card"><span class="eyebrow">Builds on</span><p class="sm">${esc(P.builds_on)}</p>
    <span class="eyebrow" style="margin-top:6px">Ready for every board</span><p class="xs muted">This covers what these boards teach in Class ${u.level}:</p>${(u.c.boards || []).map((x) => `<div class="sm"><b>${CBN[x.b] || x.b}</b> ${esc(x.ref)} · ${esc(x.title)}</div>`).join("")}</section>`;
  if (t === "think")
    return `<section class="card"><span class="eyebrow">Big questions</span>${P.big.map((q) => `<p class="sm">• ${esc(q)}</p>`).join("")}<p class="xs muted">No right answers. Ask "How could we find out?"</p></section>
    <section class="card"><span class="eyebrow">Is the usual story right?</span>${P.challenge.map((c) => `<details><summary class="sm"><b>${esc(c.q)}</b></summary><p class="sm">${esc(c.hint)}</p></details>`).join("")}</section>
    <section class="card"><span class="eyebrow">Other ways of seeing it</span>${P.perspectives.map((x) => `<p class="sm"><b>${esc(x.who)}.</b> ${esc(x.view)}</p>`).join("")}</section>`;
  if (t === "game") {
    const g = P.game,
      pr = P.project;
    return `<section class="card"><span class="eyebrow">Printable ${g.kind === "cards" ? "card" : "board"} game · ${esc(g.players)} players</span><h3 style="font-size:20px">${esc(g.title)}</h3><ol class="sm">${g.rules.map((r) => `<li>${esc(r)}</li>`).join("")}</ol>${g.need?.length ? `<p class="xs muted">You need: ${esc(g.need.join(", "))}</p>` : ""}<div class="row"><button class="btn sm accent" data-act="cgprint" data-k="${u.k}">🖨️ Print the game</button><button class="link sm" data-act="cgview" data-k="${u.k}">Preview</button></div></section>
    <section class="card"><span class="eyebrow">Project${pr.days?.length ? ` · days ${pr.days.join(" and ")}` : ""}</span><h3 style="font-size:20px">${esc(pr.title)}</h3><ol class="sm">${pr.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol><p class="xs muted">You end up with: ${esc(pr.outcome)}</p></section>`;
  }
  if (t === "books")
    return `<section class="card" style="gap:0"><span class="eyebrow" style="margin-bottom:6px">Books on this topic</span>${P.books.map((b) => `<a class="res" href="${esc(amz(b))}" target="_blank" rel="noopener"><div style="min-width:0"><b>${esc(b.title)}</b><span class="xs muted"> · ${esc(b.author)}</span><p class="xs">${esc(b.for[0].toUpperCase() + b.for.slice(1))} · ages ${esc(b.age)}. ${esc(b.why)}</p></div><span class="xs">amazon.in ↗</span></a>`).join("")}<p class="xs muted" style="margin-top:6px">Links open an amazon.in search for the book. Many are also in libraries.</p></section>`;
  return "";
}
function combTabWithBook(u, t) {
  let h = combTabBasic(u, t);
  const P = u.c.p;
  if (t === "overview" && P?.book) {
    const L = wsOf(u),
      i = L.findIndex((w) => w.id === P.book),
      w = L[i];
    if (w)
      h =
        `<section class="card ${SC(u.subj)}"><span class="eyebrow">This lesson uses a Mission book</span><h3 style="font-size:20px">${esc(w.title)}</h3><p class="sm">${esc(w.blurb || "")}</p><p class="xs muted">The day-by-day steps tell you which station to do. Print it before Day 1.</p><div class="row"><button class="btn sm accent" data-act="wsprint" data-k="${u.k}" data-i="${i}">🖨️ Print the book</button><button class="link sm" data-act="wsview" data-k="${u.k}" data-i="${i}">Preview</button></div></section>` +
        h;
  }
  return h;
}
function combTab(u, t) {
  const P = u.c.p;
  if (!P?.big) return "";
  if (t === "story")
    return P.story
      ? `<section class="card">${storyHtml(P.story)}</section><details class="card"><summary class="sm"><b>For you: the idea hidden in this story</b></summary><p class="sm">${esc(P.story.epiphany)}</p></details>`
      : "";
  if (t === "think")
    return (
      `${P.ideas?.length ? `<section class="card"><span class="eyebrow">Big ideas</span>${P.ideas.map((x) => `<p class="sm"><b>${esc(x.idea)}</b> ${esc(x.more)}</p>`).join("")}</section>` : ""}${P.unknowns?.length ? `<section class="card"><span class="eyebrow">Nobody knows yet</span>${P.unknowns.map((q) => `<p class="sm">❓ ${esc(q)}</p>`).join("")}<p class="xs muted">Science isn't finished. Maybe your child will answer one of these.</p></section>` : ""}` +
      combTabWithBook(u, t)
    );
  return combTabWithBook(u, t);
}
/* the printable game is a worksheet page: rules, then the board or the cards to cut out */
function gameSheet(u) {
  const g = u.c.p.game;
  return {
    id: u.k + "|game",
    title: g.title,
    kind: "game",
    mins: 20,
    blocks: [
      { type: "rules", title: "How to play", items: g.rules, need: g.need || [] },
      g.kind === "cards"
        ? { type: "cards", title: "Cut out the cards", cards: g.cards }
        : { type: "board", title: "The board", squares: g.squares },
    ],
  };
}
function isNextUp(u) {
  return ((S.next || {})[u.subj] || [])[0] === u.k;
}
function nextMsg(s, k) {
  _sess = null;
  const sc = schedule(s, 60)[0],
    u = unitBy(k);
  if (sc && sc.u.k === k)
    return sc.date === today
      ? `Done. Today's ${SUBJ[s]} lesson is now ${chT(sc.u)}, Part ${sc.n} of ${sc.tot}.`
      : `Done. ${chT(sc.u)} is your next ${SUBJ[s]} lesson, on ${fmt(sc.date)}.`;
  return `Done. ${chT(u)} is now first in the ${SUBJ[s]} queue.`;
}
const ACTN = {
  read: "reading",
  talk: "talking",
  think: "thinking",
  warmup: "warm-up",
  do: "activity",
  act: "activity",
  outdoor: "outdoor activity",
  exp: "experiment",
  ws: "worksheet",
  check: "quiz",
  review: "review",
  game: "game",
  watch: "video",
};
function srcOf(s) {
  const t = (s.title || "") + " · " + (s.do || ""),
    m = [...t.matchAll(/\b(?:pages?|pp?\.?)\s?(\d{1,3})(?:\s*(?:–|-|to|and)\s*(\d{1,3}))?/gi)],
    raw = [...new Set(m.map((x) => (x[2] ? x[1] + "–" + x[2] : x[1])))],
    rng = raw.filter((p) => p.includes("–")).map((p) => p.split("–").map(Number)),
    pages = raw.filter((p) => p.includes("–") || !rng.some(([a, b]) => +p >= a && +p <= b));
  return {
    book:
      (pages.length > 0 || /\bthe book['’]s\b|\bActivity \d+\.\d+|\bin the book\b|\bLearner['’]s Book\b/i.test(t)) &&
      !/\bwithout the book\b/i.test(t),
    pages,
  };
}
function srcLine(s) {
  const { book, pages } = srcOf(s),
    a = ACTN[s.kind] || "step",
    pg = pages.length ? ` · page${pages.length > 1 || pages[0].includes("–") ? "s" : ""} ${pages.join(", ")}` : "";
  return book
    ? `<div class="src book"><b>📖 Book step${pg}</b><span>Open the textbook now${pages.length ? " at " + (pages.length > 1 || pages[0].includes("–") ? "these pages" : "this page") : ""}.</span></div>`
    : `<div class="src dk"><b>✨ DeepKids step · ${a}</b><span>Book closed for this one. Everything is on this screen.</span></div>`;
}
function chT(u) {
  if (!u) return "";
  const pre =
    u.board === "waldorf"
      ? u.subj === "wart"
        ? ""
        : "Block " + u.n
      : u.board === "ncert"
        ? "Ch " + u.n
        : u.board === "cambridge"
          ? /^\d+$/.test(u.n)
            ? "Unit " + u.n
            : ""
          : u.board === "nios"
            ? "Lesson " + u.n
            : u.board === "dk"
              ? u.n
              : "";
  return (pre ? pre + " · " : "") + u.title;
}
let stepT = null;
const stepKeyNow = () => (ui.sheet?.mode === "player" ? ui.sheet.k + "|" + ui.sheet.n + "|" + ui.sheet.i : "");
function stepSecs() {
  const k = stepKeyNow();
  if (!k) return 0;
  if (!stepT || stepT.k !== k) stepT = { k, t0: Date.now() };
  return (Date.now() - stepT.t0) / 1000;
}
const SECS = [
    ["book", "The lesson"],
    ["ideas", "Big ideas"],
    ["lab", "Try it"],
    ["views", "Other views"],
    ["ws", "Worksheet"],
    ["quiz", "Quick quiz"],
  ],
  SECN = Object.fromEntries(SECS);
function stepSec(u, s) {
  const [g] = s.ref ? pkFind(u, s.ref) : [];
  if (g === "worksheets") return "ws";
  if (g === "voices") return "views";
  if (g === "experiments" || g === "activities") return "lab";
  if (s.kind === "check" || s.kind === "review") return "quiz";
  if (s.kind === "ws") return "ws";
  if (s.kind === "think") return "ideas";
  if (["exp", "act", "game", "outdoor"].includes(s.kind)) return "lab";
  if (s.kind === "do") return /page/i.test(s.do) ? "book" : "lab";
  return "book";
}
function secBar(st, i) {
  const ord = SECS.map((s) => s[0]),
    G = [];
  st.forEach((x, j) => {
    const s = x.sec || "book";
    let g = G.find((g) => g.s === s);
    if (!g) G.push((g = { s, first: j, n: 0, ok: 0 }));
    g.n++;
    if (x.ok) g.ok++;
  });
  G.sort((a, b) => ord.indexOf(a.s) - ord.indexOf(b.s));
  const cur = i >= st.length ? "fin" : st[i].sec || "book";
  return `<div class="secbar">${G.map((g, k) => `<button class="secchip ${g.s === cur ? "on" : ""} ${g.ok === g.n ? "ok" : ""}" data-act="pjump" data-i="${g.first}"><span class="n">${g.ok === g.n ? "✓" : k + 1}</span><span class="l">${SECN[g.s]}</span><small>${g.ok}/${g.n}</small></button>`).join("")}<button class="secchip ${cur === "fin" ? "on" : ""}" data-act="pjump" data-i="${st.length}"><span class="n">★</span><span class="l">Finish</span></button></div>`;
}
const hubSec = (id, title, count, body, open) =>
  body
    ? `<details class="card hub" ${open ? "open" : ""}><summary><b>${title}</b>${count != null ? `<span class="pill">${count}</span>` : ""}</summary><div class="hubb">${body}</div></details>`
    : "";
function chapterHub(u) {
  const P = u.c?.p,
    x = u.c?.x,
    c = u.c || {},
    plus = plusFor(u),
    res = resSort(resourcesFor(u)),
    shelf = shelfFor(u);
  let h =
    `<div class="sech" style="margin-top:6px"><h3 style="font-size:19px">Everything for this chapter</h3></div>` +
    printSheets(u);
  const ideas = [
    P ? `<p class="sm">${esc(P.summary)}</p>` : c.covers ? `<p class="sm">${esc(c.covers)}</p>` : "",
    P?.goals?.length
      ? `<span class="eyebrow">By the end your child can</span>${pkList(P.goals.map((g) => g.replace(/^By the end your child can\s*/i, "")))}`
      : "",
    x?.learn
      ? `<span class="eyebrow">Big ideas</span>${x.learn.map((l, i) => `<div class="idea"><span class="k">${i + 1}</span><p class="sm">${esc(l)}</p></div>`).join("")}`
      : "",
    P?.words?.length
      ? `<span class="eyebrow">Key words</span><div class="kv">${P.words.map(([w, m]) => `<span>${esc(w)}</span><b style="font-weight:400">${esc(m)}</b>`).join("")}</div>`
      : "",
  ].join("");
  h += hubSec("ideas", "Big ideas and key words", null, ideas, false);
  const pv = [
    ...plus.map(
      (t) =>
        `<div class="pk"><span class="eyebrow">DeepKids Plus · ${esc(t.id)}</span><b>${esc(t.name)}</b><p class="sm">${esc(t.summary)}</p>${t.oneness ? `<div class="ask"><span class="eyebrow">Wonder together</span>${esc(t.oneness)}</div>` : ""}</div>`,
    ),
    ...(x?.deep || []).map(
      (d) =>
        `<div class="pk"><span class="eyebrow">Big question</span><b>${esc(d.q)}</b><p class="sm">${esc(d.why)}</p>${(d.views || []).map(([w, v]) => `<p class="sm"><b>${esc(w)}:</b> ${esc(v)}</p>`).join("")}${d.tryit ? `<p class="sm"><b>Try this:</b> ${esc(d.tryit)}</p>` : ""}</div>`,
    ),
  ].join("");
  h += hubSec("plus", "DeepKids view and big questions", plus.length + (x?.deep?.length || 0) || null, pv, false);
  if (P?.voices?.length)
    h += hubSec(
      "voices",
      "Other scientists and challenging views",
      P.voices.length,
      `<p class="xs muted">Some were laughed at and later proved right; some are still argued over; some turned out wrong.</p>${P.voices.map(pkVoice).join("")}`,
      false,
    );
  const ws = [
    ...(P?.worksheets || []).map((w) => pkWs(u, w)),
    x?.wsd
      ? `<div class="pk"><span class="eyebrow">Chapter worksheet</span><b>${x.wsd.length} sections</b><div class="row"><button class="btn accent sm" data-act="ws" data-k="${u.k}">Open the worksheet</button></div></div>`
      : "",
  ].join("");
  h += hubSec("ws", "Worksheets", (P?.worksheets?.length || 0) + (x?.wsd ? 1 : 0) || null, ws, false);
  const lab = [
    ...(P?.experiments || []).map((e) => pkExp(u, e)),
    ...(P?.activities || []).map((a) => pkAct(u, a)),
    ...(!P
      ? (c.exp || []).map(
          (e) => `<div class="pk"><span class="eyebrow">Experiment</span><p class="sm">${esc(e)}</p></div>`,
        )
      : []),
    ...(!P
      ? (c.act || []).map(
          (e) => `<div class="pk"><span class="eyebrow">Activity</span><p class="sm">${esc(e)}</p></div>`,
        )
      : []),
    c.game
      ? `<div class="pk"><span class="eyebrow">Game</span><b>${esc(c.game[0])}</b><p class="sm">${esc(c.game[1])}</p></div>`
      : "",
    c.proj
      ? `<div class="pk"><span class="eyebrow">Project</span><b>${esc(c.proj[0])}</b><p class="sm">${esc(c.proj[1])}</p></div>`
      : "",
  ].join("");
  h += hubSec("lab", "Experiments, activities and games", null, lab, false);
  const rs = [
    shelf.length ? `<div class="sm"><b>From your shelf:</b> ${shelf.map((i) => esc(i.name)).join(" · ")}</div>` : "",
    ...res
      .slice(0, ui.hubres ? 99 : 6)
      .map(
        (r) =>
          `<a class="res" href="${esc(r.url)}" target="_blank" rel="noopener"><span class="xs muted">${RTYPE[r.type]} · ages ${r.ages[0]}–${r.ages[1]} · ${esc(r.source)} ↗</span><b>${esc(r.title)}</b><span class="xs">${esc(r.desc)}</span></a>`,
      ),
    res.length > 6 && !ui.hubres
      ? `<button class="link xs" data-act="hubres" style="justify-self:start">Show all ${res.length}</button>`
      : "",
    ...(c.read || []).map((r) => `<div class="res"><span class="xs muted">Book</span><b>${esc(r)}</b></div>`),
  ].join("");
  h += hubSec(
    "res",
    "Resources, books and your shelf",
    res.length + shelf.length + (c.read?.length || 0) || null,
    rs,
    false,
  );
  if (P) h += hubSec("days", "All parts of this chapter", P.days.length + " parts", packTab(u, "days"), false);
  if (P?.check?.length)
    h += hubSec(
      "check",
      "End-of-chapter check",
      P.check.length,
      `<ol class="sm">${P.check.map((q) => `<li>${esc(q.q)}<details><summary class="xs muted">Answer</summary><p class="sm">${esc(q.a)}</p></details></li>`).join("")}</ol>`,
      false,
    );
  if (x?.guide) h += hubSec("guide", "Parent guide", null, `<p class="sm">${esc(x.guide)}</p>`, false);
  return h;
}
const PKIND = {
  warmup: ["learn", "Warm-up"],
  read: ["read", "Read"],
  talk: ["learn", "Talk"],
  do: ["act", "Do"],
  exp: ["exp", "Experiment"],
  act: ["act", "Activity"],
  ws: ["ws", "Worksheet"],
  game: ["game", "Game"],
  think: ["learn", "Think"],
  watch: ["read", "Watch"],
  outdoor: ["act", "Outdoors"],
  review: ["learn", "Review"],
  check: ["ws", "Check"],
};
const TIER = { core: "Core", stretch: "Stretch", challenge: "Challenge" };
const VST = {
  accepted: "Now accepted",
  debated: "Still debated",
  minority: "Minority view",
  rejected: "Evidence went against it",
};
const PLEAD = {
  morning: 0,
  "night before": 1,
  "day before": 1,
  "2 days before": 2,
  "3 days before": 3,
  "1 week before": 7,
  "week before": 7,
};
const pkDay = (u, n) => {
  const D = u.c.p.days;
  return D[Math.min(Math.max(n, 1), D.length) - 1];
};
const pkFind = (u, id) => {
  const P = u.c.p;
  for (const g of ["worksheets", "experiments", "activities", "voices"]) {
    const x = (P[g] || []).find((z) => z.id === id);
    if (x) return [g, x];
  }
  return [null, null];
};
function packDay(u, n) {
  const P = u.c.p,
    d = pkDay(u, n),
    last = d.n === P.days.length,
    refs = new Set(d.steps.map((s) => s.ref).filter(Boolean));
  const out = d.steps.map((s, i) => {
    const [kind, label] = PKIND[s.kind] || ["act", "Step"];
    return {
      kind,
      label,
      title: s.title,
      mins: s.mins / 60,
      bk: srcOf(s),
      html:
        srcLine(s) +
        packStep(u, s) +
        (s.kind === "check" && P.check?.length ? quizList(u.k, d.n, P.check) : "") +
        (stepSec(u, s) === "lab" && !s.ref ? workCtl(u, "st" + d.n + "_" + i, s.title) : ""),
      name: `pk:${d.n}:${i}`,
      sec: stepSec(u, s),
    };
  });
  const W = P.words || [];
  if (!out.some((x) => x.sec === "ideas") && !(u.board === "waldorf" && (u.subj !== "wml" || d.n > 1))) {
    const k = W.length ? ((d.n - 1) * 3) % W.length : 0,
      ws = W.length ? [0, 1, 2].map((i) => W[(k + i) % W.length]).filter((w, i, a) => a.indexOf(w) === i) : [];
    out.push({
      kind: "learn",
      label: "Big ideas",
      title: d.n === 1 ? "What this chapter is about" : "Today's big idea and key words",
      mins: 5 / 60,
      sec: "ideas",
      name: "pkx:ideas",
      html:
        srcLine({ kind: "think" }) +
        (d.n === 1
          ? `${fmtPts(P.summary, 1)}${P.goals?.length ? `<p class="sm"><b>By the end, your child can:</b></p>${pkList(P.goals.map((g) => g.replace(/^By the end your child can\s*/i, "")))}` : ""}`
          : `<p><b>Today:</b> ${esc(d.goal)}</p>${ws.length ? `<p class="sm"><b>Key words to use today:</b></p><div class="kv">${ws.map(([w, m]) => `<span>${esc(w)}</span><b style="font-weight:400">${esc(m)}</b>`).join("")}</div><p class="sm muted">Ask your child to use each word in a sentence about today's lesson.</p>` : ""}`),
    });
  }
  (P.voices || [])
    .filter((v) => v.day === d.n && !refs.has(v.id))
    .forEach((v) =>
      out.push({
        kind: "learn",
        label: "Other views",
        title: "Other views: " + v.who.split(/[,(]/)[0].trim(),
        mins: 5 / 60,
        sec: "views",
        name: "pkx:v:" + v.id,
        html: srcLine({ kind: "read" }) + pkVoice(v),
      }),
    );
  (P.worksheets || [])
    .filter((w) => w.day === d.n && !refs.has(w.id))
    .forEach((w) =>
      out.push({
        kind: "ws",
        label: "Worksheet",
        title: "Worksheet: " + w.title,
        mins: 10 / 60,
        sec: "ws",
        name: "pkx:w:" + w.id,
        html: srcLine({ kind: "ws" }) + pkWs(u, w),
      }),
    );
  if (!out.some((x) => x.sec === "quiz") && u.board !== "waldorf") {
    const Q =
      last && P.check?.length
        ? P.check.slice(0, 5)
        : W.length
          ? [0, 1, 2]
              .map((i) => W[((d.n - 1) * 3 + i) % W.length])
              .filter((w, i, a) => a.indexOf(w) === i)
              .map(([w, m]) => ({ q: `What does “${w}” mean?`, a: m }))
          : [];
    if (Q.length)
      out.push({
        kind: "ws",
        label: "Quick quiz",
        title: last ? "End-of-chapter quiz" : "Quick quiz",
        mins: 5 / 60,
        sec: "quiz",
        name: "pkx:quiz",
        html:
          srcLine({ kind: "check" }) +
          `<p class="sm">Ask aloud. Let your child answer first, then tap to check.</p>${quizList(u.k, d.n, Q)}`,
      });
  }
  const ord = SECS.map((s) => s[0]),
    srt = out
      .map((x, i) => ({ x, i }))
      .sort((a, b) => ord.indexOf(a.x.sec) - ord.indexOf(b.x.sec) || a.i - b.i)
      .map((o) => o.x),
    F = srt.map((x) => ({ title: x.title, bk: !!x.bk?.book, pages: x.bk?.pages || [] }));
  return srt.map((x, j) => ({ ...x, html: (j === 0 ? pkHead(d, F) : "") + x.html }));
}
function packStepByName(u, name) {
  if (!u.c?.p) return "";
  const [, dn, i] = name.split(":"),
    d = pkDay(u, +dn),
    s = d?.steps[+i];
  return s ? packStep(u, s) : "";
}
const pkHead = (d, F) => {
  const L = (F || []).map((x, i) => ({ ...x, i: i + 1 })),
    bk = L.filter((x) => x.bk),
    isBook = (n) => /text ?book|learner['’]s book|book pages?|^pages? \d/i.test(n),
    need = (d.need || []).filter((n) => !(bk.length && isBook(n)));
  let pages = [...new Set(bk.flatMap((x) => x.pages))];
  if (bk.length && !pages.length)
    pages = [...new Set((d.need || []).filter(isBook).flatMap((n) => srcOf({ title: n }).pages))];
  const sh = (t) => (t.length > 26 ? t.slice(0, 25).trim() + "…" : t);
  return `<div class="phead"><p class="sm"><b>Today:</b> ${esc(d.goal)}</p>${L.length ? `<div class="flow" aria-label="Today's steps">${L.map((x) => `<span class="fl ${x.bk ? "bk" : "dk"}"><i>${x.i}</i>${x.bk ? "📖" : "✨"} ${esc(sh(x.title))}</span>`).join("")}</div><p class="xs muted">✨ DeepKids step: book closed, follow the screen. 📖 Book step: open the textbook where it says.</p>` : ""}
   ${bk.length ? `<p class="sm"><b>📖 Textbook${pages.length ? ", page" + (pages.length > 1 || pages[0].includes("–") ? "s " : " ") + pages.join(", ") : ""}</b> · for step${bk.length > 1 ? "s" : ""} ${bk.map((x) => x.i).join(", ")}</p>` : `<p class="sm"><b>✨ No textbook today.</b> Every step is on screen.</p>`}${need.length ? `<p class="sm"><b>Get ready:</b> ${need.map(esc).join(", ")}</p>` : ""}</div>`;
};
const packStep = (u, s) => `${fmtPts(s.do)}${s.ref ? pkRef(u, s.ref) : ""}`;
function pkRef(u, id) {
  const [g, x] = pkFind(u, id);
  if (!x) return "";
  if (g === "worksheets") return pkWs(u, x);
  if (g === "experiments") return pkExp(u, x);
  if (g === "activities") return pkAct(u, x);
  return pkVoice(x);
}
const pkList = (a, tag = "ul") =>
  a?.length ? `<${tag} class="sm">${a.map((i) => `<li>${esc(i)}</li>`).join("")}</${tag}>` : "";
const pkWs = (u, w) =>
  `<div class="pk"><span class="eyebrow">${TIER[w.tier] || ""} worksheet</span><b>${esc(w.title)}</b><p class="xs muted">${w.sections.length} sections · ${w.sections.reduce((a, s) => a + s[1].length, 0)} questions</p><div class="row"><button class="btn accent sm" data-act="ws" data-k="${u.k}" data-w="${esc(w.id)}">${taskDone(u.k + "#" + w.id, "ws") ? "Open again (finished)" : itemState("ws", u, w.id) === "going" ? "Continue the worksheet" : "Open the worksheet"}</button></div>${stateCtl("ws", u, w.id)}</div>`;
const pkExp = (u, e) =>
  `<div class="pk"><span class="eyebrow">Experiment${e.time ? " · " + esc(e.time) : ""}</span><b>${esc(e.title)}</b><p class="sm"><i>${esc(e.question)}</i></p>${e.need?.length ? `<p class="sm"><b>You need:</b> ${e.need.map(esc).join(", ")}</p>` : ""}${pkList(e.steps, "ol")}<div class="ask"><span class="eyebrow">Guess first</span>${esc(e.predict)}</div><p class="sm"><b>Look for:</b> ${esc(e.observe)}</p><details><summary class="sm">Why it happens</summary>${fmtPts(e.why)}</details>${e.safety ? `<p class="sm" style="color:var(--bad)"><b>Safety:</b> ${esc(e.safety)}</p>` : ""}<div class="tasks-inline">${taskLine(u, e.id, "Experiment done")}</div></div>`;
const pkAct = (u, a) =>
  `<div class="pk"><span class="eyebrow">Activity${a.mins ? " · " + a.mins + " min" : ""}</span><b>${esc(a.title)}</b>${a.need?.length ? `<p class="sm"><b>You need:</b> ${a.need.map(esc).join(", ")}</p>` : ""}${pkList(a.steps, "ol")}${a.outcome ? `<p class="sm"><b>You end up with:</b> ${esc(a.outcome)}</p>` : ""}<div class="tasks-inline">${taskLine(u, a.id, "Activity done")}</div></div>`;
const pkVoice = (v) =>
  `<div class="pk voicecard"><span class="vst ${esc(v.status)}">${VST[v.status] || esc(v.status)}</span><b>${esc(v.who)}</b>${fmtPts(v.idea, 1)}<span class="eyebrow">Back then</span>${fmtPts(v.then, 1)}<span class="eyebrow">Today</span>${fmtPts(v.now, 1)}<div class="ask"><span class="eyebrow">Ask your child</span>${esc(v.ask)}</div></div>`;
function packPrep(u, n) {
  const P = u.c.p,
    d = pkDay(u, n),
    L = [];
  if (n === 1)
    L.push(["guide", 1, `Skim the ${P.days.length}-day plan for ${u.title} (3 min)`, "The chapter page → Day plan"]);
  (d.prep || []).forEach((q) =>
    L.push(["get", PLEAD[String(q.when).toLowerCase()] ?? 1, q.task, `Part ${d.n} of the chapter`]),
  );
  if (d.need?.length) L.push(["get", 1, "Gather: " + d.need.join(", "), "Around the house"]);
  return L.map((p, i) => ({ id: `p|${u.k}|${n}|${i}`, kind: p[0], lead: p[1], task: p[2], where: p[3] }));
}
function packOverview(u) {
  const P = u.c.p;
  return `<section class="card ${SC(u.subj)}"><span class="eyebrow">${esc(P.source)}</span><p>${esc(P.summary)}</p>${P.goals?.length ? `<span class="eyebrow" style="margin-top:6px">By the end your child can</span>${pkList(P.goals.map((g) => g.replace(/^By the end your child can\s*/i, "")))}` : ""}</section>
   ${P.words?.length ? `<section class="card"><span class="eyebrow">Key words</span><div class="kv">${P.words.map(([w, m]) => `<span>${esc(w)}</span><b style="font-weight:400">${esc(m)}</b>`).join("")}</div></section>` : ""}
   ${P.check?.length ? `<details class="card"><summary><b>End-of-chapter check</b> <span class="xs muted">${P.check.length} questions</span></summary><ol class="sm">${P.check.map((c) => `<li>${esc(c.q)}<details><summary class="xs muted">Answer</summary><p class="sm">${esc(c.a)}</p></details></li>`).join("")}</ol></details>` : ""}`;
}
function packTab(u, t) {
  const P = u.c.p;
  if (t === "days") {
    const cur = Math.min(done(u.k) + 1, P.days.length);
    return (
      `<p class="sm muted">This chapter has ${P.days.length} parts of about ${P.day_mins} minutes. Each lesson is one part; anything left unticked moves to the next day.</p>` +
      P.days
        .map(
          (
            d,
          ) => `<details class="card pkday" ${d.n === cur ? "open" : ""}><summary><b>Part ${d.n}</b> · ${esc(d.title)} <span class="xs muted">${d.steps.reduce((a, s) => a + s.mins, 0)} min${d.n < cur ? " · done" : d.n === cur ? " · next" : ""}</span></summary>
      <p class="sm">${esc(d.goal)}</p>${d.need?.length ? `<p class="sm muted">You need: ${d.need.map(esc).join(", ")}</p>` : ""}${(d.prep || []).map((q) => `<p class="sm muted">Prep (${esc(q.when)}): ${esc(q.task)}</p>`).join("")}
      ${d.steps
        .map((s) => {
          const [, lab] = PKIND[s.kind] || ["", "Step"],
            [, x] = s.ref ? pkFind(u, s.ref) : [];
          return `<div class="pkstep"><span class="chip">${lab} · ${s.mins} min</span> <b>${esc(s.title)}</b><p class="sm">${esc(s.do)}</p>${x ? `<p class="xs muted">Uses: ${esc(x.title || x.who)}</p>` : ""}</div>`;
        })
        .join("")}</details>`,
        )
        .join("")
    );
  }
  if (t === "ws")
    return (
      printSheets(u) +
      `<p class="sm muted">Three levels: core for everyone, stretch to apply it, challenge to think harder.</p>` +
      P.worksheets
        .map(
          (w) => `<section class="card">${pkWs(u, w)}<p class="xs muted">Planned for day ${w.day || "–"}</p></section>`,
        )
        .join("")
    );
  if (t === "lab")
    return `<span class="eyebrow">Experiments</span>${P.experiments.map((e) => pkExp(u, e)).join("")}<span class="eyebrow" style="margin-top:10px">Activities</span>${P.activities.map((a) => pkAct(u, a)).join("")}`;
  if (t === "voices")
    return `<p class="sm muted">Other scientists and challenging views. Some were laughed at and later proved right; some are still argued over; some turned out wrong. Read one together and ask what evidence would change your mind.</p>${P.voices.map(pkVoice).join("")}`;
  return "";
}
function planOptions(u) {
  const c = u.c,
    x = c?.x,
    g = u.gen,
    t = u.topic;
  if (g?.plans)
    return {
      full: (g.plans.full || []).slice(0, 3).map((o, i) => genOpt(o, "f" + (i + 1))),
      busy: (g.plans.busy || []).slice(0, 3).map((o, i) => genOpt(o, "b" + (i + 1))),
    };
  const game = c?.game?.[0] || "The topic game",
    gameHow = c?.game?.[1] || "Play a quick game about the topic.",
    act = c?.act?.[0] || t?.sub?.[0] || "A hands-on activity about the topic.",
    exp = c?.exp?.[0] || "A small experiment or observation.",
    bq = x?.deep?.[0]?.q || t?.oneness || "What do you already know about this, and how do you know it?";
  const P = (kind, title, f, body) => ({ kind, label: KL[kind] || "Step", title, f, body });
  return {
    full: [
      {
        id: "f1",
        name: x ? "DeepKids plan" : "Chapter day",
        idea: x
          ? "Our full plan: read, think, worksheet, experiments, activities, game and project."
          : "Read the chapter together, talk about it, then try it with your hands.",
        real: true,
      },
      {
        id: "f2",
        name: "Story and play day",
        idea: "Start with a story, play the chapter game, end with something to make.",
        placeholder: true,
        parts: [
          P("read", "Story time", 0.3, "Tell or read the story of this topic in your own words."),
          P("game", game, 0.4, gameHow),
          P("act", "Make it real", 0.3, act),
        ],
      },
      {
        id: "f3",
        name: "Outdoor and make day",
        idea: "Take it outside: observe, collect, build.",
        placeholder: true,
        parts: [
          P("exp", "Go and look", 0.4, exp),
          P("proj", "Make something", 0.4, c?.proj?.[1] || "Build a small model or poster."),
          P("learn", "Talk it over", 0.2, bq),
        ],
      },
    ],
    busy: [
      {
        id: "b1",
        name: "30-minute core",
        idea: "The one idea that matters most, then a quick check.",
        placeholder: true,
        parts: [
          P(
            "read",
            "The key idea",
            0.5,
            x?.learn?.[0] || c?.covers || t?.summary || "Read the main part of the chapter.",
          ),
          P("learn", "One big question", 0.3, bq),
          P("game", "Quick check", 0.2, "Three quick questions, said aloud."),
        ],
      },
      {
        id: "b2",
        name: "Game-only day",
        idea: "Learn by playing. Nothing to write.",
        placeholder: true,
        parts: [
          P("game", game, 0.8, gameHow),
          P("learn", "What did we learn?", 0.2, "Each of you says one thing the game taught."),
        ],
      },
      {
        id: "b3",
        name: "Talk and walk",
        idea: "A walk and a conversation. No screens, no books.",
        placeholder: true,
        parts: [
          P("act", "Walk and spot", 0.6, "On a short walk, look for this topic around you."),
          P("learn", "The big question", 0.4, bq),
        ],
      },
    ],
  };
}
function genOpt(o, id) {
  const parts = (Array.isArray(o.steps) ? o.steps : []).slice(0, 6).map((s) => ({
    kind: KL[s.kind] ? s.kind : "act",
    label: KL[s.kind] || "Step",
    title: String(s.title || "").slice(0, 80),
    mins: Math.max(5, Math.min(90, +s.mins || 10)),
    body: String(s.how || "").slice(0, 600),
  }));
  return {
    id,
    name: String(o.name || "Plan").slice(0, 40),
    idea: String(o.idea || "").slice(0, 200),
    parts,
    gen: true,
  };
}
// the plan picked for a chapter: one of its full plans or its short (about 30 minutes) plans
const pickOf = (u) => {
  const O = planOptions(u),
    P = [...O.full, ...O.busy],
    id = ((S.planPick || {})[u.k] || {}).full;
  return P.find((o) => o.id === id) || P[0];
};
function bookSteps(u, n, tot) {
  const cap = hpdOf(u.subj),
    w = `${esc(u.book)}${chNo(u) ? ", " + chNo(u) : ""}`,
    res = u.c?.read?.[0];
  const L =
    n === 1
      ? [
          [
            "read",
            "Read",
            "Read the chapter",
            0.6,
            `Read the first part of <b>${w}</b> together. Ask what your child thinks it's about.`,
          ],
          ["act", "Try it", "Try it out", 0.4, esc(HINT[u.subj])],
        ]
      : n === tot
        ? [
            ["act", "Finish", "Finish the chapter", 0.5, `Do the last exercises in <b>${w}</b>.`],
            ["learn", "Review", "Teach it back", 0.5, "Your child explains the chapter to you."],
          ]
        : [
            ["read", "Continue", "Continue the chapter", 0.6, `Carry on in <b>${w}</b>.`],
            ["act", "Practice", "Practice", 0.4, esc(HINT[u.subj]) + (res ? ` More: ${esc(res)}.` : "")],
          ];
  return L.map(([kind, label, title, f, html]) => ({ kind, label, title, mins: cap * f, html, name: "" }));
}
function optionSteps(u, n, tot, date) {
  const o = pickOf(u);
  if (!o || o.real) return daySteps(u, n, tot);
  const total = o.id[0] === "b" ? Math.min(30, lessonMins(u.subj)) : lessonMins(u.subj);
  return o.parts.map((p) => ({
    kind: p.kind,
    label: p.label,
    title: p.title,
    mins: (p.mins || p.f * total) / 60,
    html: `<p>${esc(p.body)}</p>${o.placeholder ? `<p class="xs muted">Placeholder plan: “${esc(o.name)}”. The full version is being written.</p>` : ""}`,
    name: "opt:" + o.id,
  }));
}
function stepState(it) {
  const tk = new Set(S.steps[stepKey(it)] || []),
    u = it.u;
  const carried = ((S.carry || {})[u.k] || [])
    .filter((c) => c.forN === it.n)
    .map((c) => ({
      kind: c.kind,
      label: c.label,
      title: "From last time: " + c.title,
      mins: c.mins,
      html: c.name?.startsWith("pk:")
        ? packStepByName(u, c.name)
        : u.c?.x && c.name && !c.name.startsWith("opt:")
          ? stepBody(u, c.name)
          : `<p>${esc(c.title)}</p>`,
      name: c.name,
      carried: true,
    }));
  const base = u.c?.p
    ? daySteps(u, it.n, it.tot)
    : modeOf() === "books" && u.board !== "gen" && u.board !== "dk"
      ? bookSteps(u, it.n, it.tot)
      : optionSteps(u, it.n, it.tot, today);
  return [...carried, ...base].map((x, i) => ({ ...x, ok: tk.has(sid(x)) }));
}
function findItem(id) {
  return dayPlan(today).find((i) => i.id === id);
}
function playerView() {
  const P = ui.sheet,
    it = { u: unitBy(P.k), n: P.n, tot: P.tot, bonus: P.bonus };
  if (!it.u) return "";
  const st = stepState(it),
    pct = Math.min(100, (st.filter((x) => x.ok).length / st.length) * 100);
  document.getElementById("sheetTitle").textContent = `${chT(it.u)} · Part ${P.n} of ${P.tot}`;
  let h = `<div class="ptrack"><span style="width:${pct}%"></span>${sblob(P.s, "happy", "rider", `style="left:${Math.max(5, pct)}%"`)}</div>`;
  h += secBar(st, P.i);
  if (P.i >= st.length) {
    const okN = st.filter((x) => x.ok).length,
      all = okN === st.length;
    h += `<section class="stage finish">${sblob(P.s, all ? "happy" : "calm", "bob", 'width="120" height="120"')}<div class="stars">${[0, 1, 2].map((i) => `<svg width="44" height="44" viewBox="0 0 24 24" style="transform:rotate(${(i - 1) * 12}deg)"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill="${i < Math.max(1, Math.round((okN / st.length) * 3)) ? "var(--sun)" : "var(--line)"}"/></svg>`).join("")}</div><h2>${all ? "Congrats!" : "Nearly there"}</h2><p class="muted">${esc(chT(it.u))} · ${all ? "every step done." : `${st.length - okN} step${st.length - okN > 1 ? "s" : ""} still open. They move to the next lesson day automatically.`}</p>${photoBtn(P.k, "Add a photo of today's work")}</section>`;
    return (
      h +
      `<details class="card hub"><summary><b>Want more? Everything for this chapter</b></summary><div class="hubb">${chapterHub(it.u)}</div></details><p class="sm muted" style="text-align:center">Looked through everything? Then finish today\'s lesson.</p><div class="row" style="justify-content:center"><button class="btn green" data-act="finish">${icon("check")}Finish the lesson</button><button class="btn soft" data-act="pstep" data-d="-1">Back</button></div>`
    );
  }
  const x = st[P.i];
  h += `<section class="stage"><div class="kind"><span class="k">${icon(x.kind === "step" ? "spark" : x.kind)}</span><span>${SECN[x.sec || "book"]} · step ${P.i + 1} of ${st.length}</span><button class="readbtn" data-act="readnow" aria-label="Read this step aloud">🔊 Read aloud</button></div><h2>${esc(x.title)}</h2>
   <div class="spent"><span class="xs muted">Take your time. Time on this step<br><button class="link xs" data-act="autoread">${S.autoRead ? "✓ Reading each step aloud" : "Read each step aloud as we go"}</button></span><b class="num" id="spent">${mmss(stepSecs())}</b></div>
   <div class="body">${x.html}</div>
   <div class="row"><button class="btn soft" data-act="pstep" data-d="-1" ${P.i === 0 ? "disabled" : ""} aria-label="Previous step">${icon("back")}</button><button class="btn green wide" data-act="pdone">${x.ok ? "Next" : "Done! Next step"}${icon("next")}</button></div></section>`;
  return h;
}
const timerKey = () => (ui.sheet ? ui.sheet.k + "|" + ui.sheet.n + "|" + ui.sheet.i : "");
let tick = null;
function timerToggle() {
  const P = ui.sheet,
    it = { u: unitBy(P.k), n: P.n, tot: P.tot, bonus: P.bonus },
    x = stepState(it)[P.i];
  let T = ui.timer;
  if (!T || T.key !== timerKey()) T = ui.timer = { key: timerKey(), total: x.mins * 60, left: x.mins * 60, run: false };
  if (T.run) {
    T.left = Math.max(0, (T.end - Date.now()) / 1000);
    T.run = false;
    clearInterval(tick);
  } else {
    T.end = Date.now() + T.left * 1000;
    T.run = true;
    clearInterval(tick);
    tick = setInterval(paintTimer, 500);
  }
  paintTimer();
}
function paintTimer() {
  const T = ui.timer,
    tt = document.getElementById("tt"),
    r = document.getElementById("tring"),
    b = document.getElementById("tbtn");
  if (!T || !tt || T.key !== timerKey()) {
    clearInterval(tick);
    return;
  }
  const left = T.run ? Math.max(0, (T.end - Date.now()) / 1000) : T.left;
  tt.textContent = mmss(left);
  r.setAttribute("stroke-dasharray", `${(113 * left) / T.total} 113`);
  b.textContent = T.run ? "Pause" : "Start timer";
  if (T.run && left <= 0) {
    T.run = false;
    T.left = 0;
    clearInterval(tick);
    sfx("win");
    toast("Time's up for this step");
    b.textContent = "Done";
  }
}
function chapterPage() {
  const u = unitBy(ui.sheet.k);
  if (!u) return "";
  const c = u.c,
    x = c?.x,
    cs = coverage(u),
    m = modeOf();
  document.getElementById("sheetTitle").textContent = u.title;
  const tabs = c?.p
    ? {
        overview: "Overview",
        days: "Parts",
        ws: "Worksheets",
        lab: "Experiments",
        voices: "Other voices",
        ...(c.p.big
          ? { ...(c.p.story ? { story: "Story" } : {}), think: "Think deeper", game: "Game & project", books: "Books" }
          : {}),
        ...(resourcesFor(u).length ? { res: "Resources" } : {}),
        ...(x ? { questions: "Big questions", play: "Play" } : {}),
        ...(c.read ? { read: "Read more" } : {}),
      }
    : m === "books"
      ? {
          overview: "Overview",
          ...(c ? { read: "Read more" } : {}),
          ...(resourcesFor(u).length ? { res: "Free resources" } : {}),
        }
      : x
        ? {
            overview: "Overview",
            plans: "Lesson plans",
            questions: "Big questions",
            tasks: "Tasks",
            worksheet: "Worksheet",
            play: "Play",
            read: "Read more",
          }
        : c
          ? {
              overview: "Overview",
              plans: "Lesson plans",
              tasks: "Tasks",
              read: "Read more",
              ...(resourcesFor(u).length ? { res: "Free resources" } : {}),
            }
          : {
              overview: "Overview",
              plans: "Lesson plans",
              ...(resourcesFor(u).length ? { res: "Free resources" } : {}),
            };
  const t = tabs[ui.ctab[u.k]] ? ui.ctab[u.k] : "overview",
    inPlan = everyUnit().some((z) => z.k === u.k) && plannedUnits(u.subj).some((z) => z.k === u.k);
  let h = `<section class="chero ${SC(u.subj)}"><span class="n">${u.board === "combined" ? "" : /^\d+$/.test(u.n) ? u.n : esc(u.n)}</span><span class="eyebrow">${u.board === "gen" ? "DeepKids topic · Level " + u.level : esc(u.book)}</span><h1>${esc(u.title)}</h1><span class="sticker ${cs}" style="justify-self:start">${STATUS[cs]}${cs === "learning" && done(u.k) ? ` · Part ${done(u.k)} of ${sessionsFor(u)}` : ""}</span><p>${c?.p ? `${c.p.days.length} parts · about ${c.p.day_mins} minutes each` : `${fh(hoursFor(u))} hours in all · ${sessionsFor(u)} lesson days at ${fh(hpdOf(u.subj))} h a day`}</p>${sblob(u.subj, "happy", "mascot sway")}</section>
   ${u.board === "gen" && !u.gen.reviewed ? `<p class="note">Written by Claude when a parent searched for it. Not yet reviewed by DeepKids.</p>` : ""}
   <div class="row">${inPlan ? `<span class="pill completed" style="align-self:center">✓ ${isNextUp(u) ? "Next up" : "In the plan · no. " + qPos(u)} in ${SUBJ[u.subj]}</span>${isNextUp(u) ? "" : `<button class="btn sm" data-act="qnext" data-s="${u.subj}" data-k="${u.k}">Do this next</button>`}<button class="btn line sm" data-act="gotab" data-tab="week" data-seg="next" data-qs="${u.subj}">See the queue</button>` : u.board === "unit" && !dkUnitOpen(u.c?.unit) ? `<span class="xs muted">🔒 On the DeepKids track</span>` : qPick("les", u.subj, "les:" + u.k, icon("plus") + "Add to the plan")}</div>
   
   ${
     Object.keys(tabs).length > 1
       ? `<div class="seg" role="tablist">${Object.entries(tabs)
           .map(
             ([k, v]) =>
               `<button aria-pressed="${t === k}" data-act="ctab" data-k="${u.k}" data-t="${k}">${v}</button>`,
           )
           .join("")}</div>`
       : ""
   }`;
  if (t === "overview") {
    if (c?.p) h += packOverview(u);
    {
      const sh = shelfFor(u);
      if (sh.length)
        h += `<section class="card"><span class="eyebrow">From your shelf</span>${sh.map((i) => `<div class="sm"><b>${esc(i.name)}</b>${i.note ? ` · <span class="muted">${esc(i.note)}</span>` : ""}</div>`).join("")}</section>`;
    }
    h += topicOverview(u);
    if (x && m !== "books")
      h += `<section class="card ${SC(u.subj)}"><span class="eyebrow">What to learn</span>${x.learn.map((l, i) => `<div class="idea"><span class="k">${i + 1}</span><p>${esc(l)}</p></div>`).join("")}</section>`;
    if (m === "books" && c?.x?.cur)
      h += `<section class="card" style="gap:0"><span class="eyebrow" style="margin-bottom:6px">Curated resources</span>${c.x.cur.map(([w, src, url, how]) => `<a class="res" href="${esc(url)}" target="_blank" rel="noopener"><span class="xs muted">${esc(src)} ↗</span><b>${esc(w)}</b></a>`).join("")}</section>`;
    if (u.board === "dk" && u.topic.res.length)
      h += `<section class="card"><span class="eyebrow">Resources</span>${u.topic.res.map((r) => (r.url ? `<a class="res" href="${esc(r.url)}" target="_blank" rel="noopener"><b>${esc(r.title)} ↗</b></a>` : `<div class="res"><b>${esc(r.title)}</b></div>`)).join("")}</section>`;
    h += `<button class="btn line sm" data-act="logk" data-k="${u.k}" style="justify-self:start">Log a session today</button>${rank[cs] < 2 ? `<button class="link xs" data-act="status" data-k="${u.k}" data-s="completed" style="justify-self:start">Already knows this? Mark it done</button>` : ""}`;
  }
  if (t === "plans") h += plansTab(u);
  if (c?.p) h += packTab(u, t) + combTab(u, t);
  if (t === "res") h += resTab(u);
  if (t === "questions") {
    const qi = Math.min(ui.qi[u.k] || 0, x.deep.length - 1),
      d = x.deep[qi],
      key = "think" + qi;
    h += `<section class="qcard"><span class="eyebrow">Big question ${qi + 1} of ${x.deep.length}</span><h2>${esc(d.q)}</h2><p>${esc(d.why)}</p></section>
     <p class="sm muted">Ask your child first and really listen. Then read the voices together. Which is strongest? Which would you argue against?</p>
     <div class="col">${d.views.map(([w, v], j) => `<div class="voice" style="--c:${PAL[(j * 2 + 1) % PAL.length]}">${blob(PAL[(j * 2 + 1) % PAL.length], 30 + j + qi * 3, ["happy", "calm", "wow"][j % 3])}<div class="say"><b>${esc(w)}</b>${esc(v)}</div></div>`).join("")}</div>
     <section class="mission"><b>Try this</b><span>${esc(d.tryit)}</span></section>
     <div class="field"><label for="th-${u.k}-${qi}">What does ${esc(S.child || "your child")} think?</label><textarea class="inp" id="th-${u.k}-${qi}" data-ans="${u.k}|${key}" placeholder="Write their words, not yours">${esc(A(u.k, key) || "")}</textarea></div>
     <div class="pager"><button class="btn line sm" data-act="qi" data-k="${u.k}" data-d="-1" ${qi === 0 ? "disabled" : ""}>${icon("back")}Previous</button><span class="xs muted">${qi + 1} / ${x.deep.length}</span><button class="btn sm" data-act="qi" data-k="${u.k}" data-d="1" ${qi === x.deep.length - 1 ? "disabled" : ""}>Next${icon("next")}</button></div>`;
  }
  if (t === "tasks") {
    const ts = x
      ? chapterTasks(u)
      : [
          ["game", "", c.game[0], c.game[1]],
          ...c.exp.map((e, i) => ["exp" + i, "", "Experiment " + (i + 1), e]),
          ...c.act.map((e, i) => ["act" + i, "", "Activity " + (i + 1), e]),
          ["proj", "", c.proj[0], c.proj[1]],
        ];
    const dn = ts.filter((a) => taskDone(u.k, a[0])).length,
      H = x?.hours || [];
    const hh = (id) => {
      const re = { ws: /^Worksheet/, exp0: /^Experiment/, act0: /^Activit/, game: /^Game/, proj: /^Project/ }[id];
      const r = re && H.find((a) => re.test(a[0]));
      return r ? `<span class="chip">${mins(r[1])}${r[2] > 1 ? ` over ${r[2]} days` : ""}</span>` : "";
    };
    h += `<section class="card ${SC(u.subj)}"><div class="sech"><h3>${dn} of ${ts.length} done</h3></div><div class="bar"><span style="width:${(dn / ts.length) * 100}%;background:var(--c)"></span></div></section><section class="card" style="gap:0">${ts
      .map(([id, , ttl, desc]) => {
        const d = taskDone(u.k, id),
          kind = id.replace(/\d+$/, "");
        return `<div class="taskrow ${d ? "done" : ""}"><button class="ckb" data-act="task" data-k="${u.k}" data-id="${id}" aria-label="${d ? "Mark not done" : "Mark done"}: ${esc(ttl)}">${icon("check")}</button><div><div class="row" style="gap:8px">${icon(kind)}<b>${esc(ttl)}</b></div><p class="sm" style="margin-top:4px">${esc(desc)}</p><div class="meta">${hh(id)}${kind === "ws" ? `<button class="btn xs" data-act="ws" data-k="${u.k}">Open worksheet</button>` : ""}${kind === "proj" ? `<button class="btn xs soft" data-act="startexp" data-title="${esc(ttl)}" data-topic="${esc(u.title)}">Track it daily</button>` : ""}${photoBtn(u.k, "Photo")}</div></div></div>`;
      })
      .join("")}</section>`;
  }
  if (t === "worksheet") {
    const q = x.wsd.reduce((a, s) => a + s[1].length, 0);
    h += `<section class="card"><span class="eyebrow">Worksheet</span><h3 style="font-size:20px">${x.wsd.length} sections, ${q} questions</h3><div class="col" style="gap:6px">${x.wsd.map(([t2, its]) => `<div class="row" style="justify-content:space-between"><span>${esc(t2)}</span><span class="xs muted">${its.length} questions</span></div>`).join("")}</div><button class="btn" data-act="ws" data-k="${u.k}">${taskDone(u.k, "ws") ? "Open again (finished)" : "Start the worksheet"}</button></section>`;
  }
  if (t === "play")
    h += `<section class="qcard" style="background:var(--gum)"><span class="eyebrow">Chapter game</span><h2>${esc(c.game[0])}</h2><p>${esc(c.game[1])}</p></section><section class="card" style="gap:0"><span class="eyebrow" style="margin-bottom:6px">Curated from around the world</span>${x.cur.map(([w, src, url, how]) => `<a class="res" href="${esc(url)}" target="_blank" rel="noopener"><span class="xs muted">${esc(src)} ↗</span><b>${esc(w)}</b><span class="sm muted">${esc(how)}</span></a>`).join("")}</section>`;
  if (t === "read")
    h += `<section class="card" style="gap:0">${[`${u.book}${chNo(u) ? ", " + chNo(u) : ""}`, ...(c.links || []), ...(c.read || [])].map((r) => `<div class="res"><b>${esc(r)}</b></div>`).join("")}</section>`;
  return h;
}
function chapterView() {
  const u = unitBy(ui.sheet.k),
    U = u?.c?.units || [],
    M = u?.c?.more || [],
    h = chapterPage() + (M.length ? moreFromOtherSites(M) : "");
  return U.length
    ? `<section class="card fxnew"><span class="eyebrow">Go deeper: subtopic feeds</span>${fxUnitBtns(U)}</section>` + h
    : h;
}
// free sheets made by others for this chapter, as links to their own sites (content/curriculum/free_worksheets.json)
const moreFromOtherSites = (M) =>
  `<section class="card"><span class="eyebrow">More from other sites</span><p class="xs muted">Free sheets made by others for this chapter. They open on their own site.</p>${M.map((w) => `<a class="res" href="${esc(w.url)}" target="_blank" rel="noopener"><b>${esc(w.title)}</b><br><span class="xs muted">${esc(w.publisher)}${w.age ? " · " + esc(w.age) : ""}${w.what ? " · " + esc(w.what) : ""}</span></a>`).join("")}</section>`;
