/* The refresher: at most 20 questions a day, 5 from each of up to 4 completed units, taking turns across the subjects.
   A unit is mastered at 5 right answers. A unit whose questions were not all answered comes first the next day; a completed
   unit that is not mastered stays in the queue; a mastered one leaves it. Concept questions only. */
const URL = process.argv[2] || "http://127.0.0.1:8765/app.html";
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch(),
    ctx = await b.newContext({ viewport: { width: 390, height: 860 } }),
    p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message.slice(0, 120)));
  await p.goto(URL);
  await p.waitForTimeout(400);
  await p.fill("#lgPhone", "81234 56789");
  await p.fill("#lgName", "P");
  await p.click('[data-act="login"]');
  await p.waitForTimeout(400);
  await p.fill("#obName", "Kid");
  await p.click('[data-age="8"]');
  await p.click('[data-ob="next"]');
  await p.waitForTimeout(250);
  await p.click('[data-b="combined"]');
  for (let i = 0; i < 8; i++) {
    await p.evaluate(() => {
      for (let i = 0; i < 12; i++) {
        const c = [...document.querySelectorAll('[data-oblvl$=":3"]')].find(
          (x) => x.getAttribute("aria-pressed") !== "true",
        );
        if (!c) break;
        c.click();
      }
    });
    const n = await p.$('[data-ob="next"],[data-ob="done"],[data-ob="finish"]');
    if (!n) break;
    await n.click();
    await p.waitForTimeout(250);
  }
  const r = await p.evaluate(async () => {
    S.guide = { on: false };
    document.getElementById("guide")?.remove();
    const out = {};
    // every DeepKids unit and the first book chapter of each other subject count as completed
    window.fxUnitSt = () => "completed";
    S.progress = S.progress || {};
    // maths, English and Hindi chapters have no question banks yet, so the test gives one chapter of each five questions
    const fake = (u) => {
      S.qgen = S.qgen || {};
      S.qgen[u.k] = Array.from({ length: 5 }, (_, i) => ({
        q: `Test question ${i} for ${u.k}`,
        opts: ["a", "b", "c"],
        ans: 0,
        a: "a",
        why: "because",
      }));
      S.progress[u.k] = { status: "completed", sessions: 1, updated: addDays(today, -2) };
    };
    ["math", "eng", "hin"].forEach((s) => {
      const u = DATA.items.map((i) => unitByK(i.k)).find((u) => u && u.subj === s && u.board !== "unit");
      if (u) fake(u);
    });
    S.rfp = {};
    const plan = await rfBuild(today);
    const subj = (k) => (rfIsDk(k) ? k.slice(5).split(".")[0] : unitByK(k)?.subj);
    const per = {};
    plan.slots.forEach((s) => (per[s.k] = (per[s.k] || 0) + 1));
    out.total = plan.slots.length;
    out.units = Object.keys(per).length;
    out.subjects = [...new Set(Object.keys(per).map(subj))].sort();
    out.minPerUnit = Math.min(...Object.values(per));
    out.allQuestions = plan.slots.every((s) => s.ty === "qz" && !s.q.rote);
    // answer one unit's questions all right, and only two of another's
    const ks = Object.keys(per),
      first = ks[0],
      second = ks.find((k) => k !== first);
    ui.sheet = { mode: "refresh", date: today };
    plan.slots.filter((s) => s.k === first).forEach((s) => rfRecord(s.q, true));
    plan.slots
      .filter((s) => s.k === second)
      .slice(0, 2)
      .forEach((s) => rfRecord(s.q, true));
    out.firstRight = rfRight(first);
    out.firstOpen = !!S.rfm[first].open;
    out.secondOpen = !!S.rfm[second].open;
    const tomorrow = addDays(today, 1),
      q = rfQueue(tomorrow);
    out.tomorrowFirst = q.slice(0, 1).map((x) => x.g)[0];
    out.secondQueuedOpen = q.some((x) => x.k === second && x.g === "open");
    out.firstGone = !q.some((x) => x.k === first);
    // a day with only one completed unit still gives at least 5 questions
    window.fxUnitSt = () => "none";
    S.progress = {};
    S.rfm = {};
    S.rfq = {};
    S.rfp = {};
    const only = DATA.items.map((i) => unitByK(i.k)).find((u) => u && u.subj === "math" && u.board !== "unit");
    fake(only);
    const solo = await rfBuild(today);
    out.solo = solo?.slots.length;
    return out;
  });
  const t = [];
  const check = (name, ok) => t.push(`${ok ? "ok  " : "FAIL"} ${name}`);
  check(`at most 20 questions (${r.total})`, r.total >= 5 && r.total <= 20);
  check(`5 from each of up to 4 units (${r.units} units, min ${r.minPerUnit} each)`, r.units <= 4 && r.minPerUnit >= 5);
  check(`all subjects take turns (${r.subjects.join(", ")})`, r.subjects.length >= 3);
  check("concept questions only", r.allQuestions);
  check(
    `5 right answers is mastered (${r.firstRight}) and its refresher is finished`,
    r.firstRight >= 5 && !r.firstOpen,
  );
  check("a unit with questions left unanswered stays open", r.secondOpen);
  check(
    "tomorrow the unfinished unit comes first, the mastered one has left",
    r.tomorrowFirst === "open" && r.secondQueuedOpen && r.firstGone,
  );
  check(`one completed unit still gives at least 5 questions (${r.solo})`, r.solo >= 5);
  if (errs.length) check("no page errors " + errs.slice(0, 2).join(" | "), false);
  console.log(t.join("\n"));
  const bad = t.filter((x) => x.startsWith("FAIL")).length;
  console.log(bad ? `refresher: ${bad} problem(s)` : "refresher: all ok");
  await b.close();
  process.exit(bad ? 1 : 0);
})();
