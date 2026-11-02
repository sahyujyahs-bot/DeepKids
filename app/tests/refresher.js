/* Refreshers: "Play it" starts the quiz at once. Every unit in it gives at least 5 questions, the whole refresher has at least
   5, and a board-track refresher is concept questions only (no word meanings, fill-ins or matching). */
const URL = process.argv[2] || "http://127.0.0.1:8765/app.html";
const { chromium } = require("playwright");
const family = async (b, track) => {
  const ctx = await b.newContext({ viewport: { width: 390, height: 860 } }),
    p = await ctx.newPage();
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
  await p.click(track === "dk" ? '[data-b="combined"]' : '[data-obtrack="board"]');
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
  await p.evaluate(() => {
    S.guide = { on: false };
    document.getElementById("guide")?.remove();
  });
  return { p, ctx };
};
(async () => {
  const b = await chromium.launch();
  const out = [];
  let bad = 0;
  const check = (name, ok, info) => {
    if (!ok) bad++;
    out.push(`${ok ? "ok  " : "FAIL"} ${name} ${JSON.stringify(info)}`);
  };
  // DeepKids track: two units each with one wrong answer give at least 5 questions each
  {
    const { p, ctx } = await family(b, "dk");
    const r = await p.evaluate(async () => {
      const ids = Object.keys(DATA.units)
        .filter((k) => k.endsWith(".L3"))
        .slice(0, 2);
      S.fx = {
        mode: "parent",
        pos: {},
        done: {},
        saved: {},
        ref: Object.fromEntries(ids.map((id) => [id, [{ k: "quiz.0" }]])),
        score: {},
        time: {},
      };
      const btn = document.createElement("button");
      btn.dataset.act = "refresh";
      btn.dataset.date = today;
      document.getElementById("main").appendChild(btn);
      btn.click();
      await new Promise((r) => setTimeout(r, 2000));
      const d = document.getElementById("fxDlg"),
        secs = [...d.querySelectorAll('.fxfeed section.fxc[data-key="rf"]')],
        per = {};
      secs.forEach((s) => (per[s.dataset.uid] = (per[s.dataset.uid] || 0) + 1));
      return {
        dialog: !!d.open,
        sheetOpen: !!document.getElementById("sheet")?.open,
        total: secs.length,
        per,
        units: ids.length,
      };
    });
    check("DeepKids track: Play it opens the quiz at once", r.dialog && !r.sheetOpen, r);
    check(
      "DeepKids track: at least 5 questions for each unit",
      Object.keys(r.per).length === 2 && Object.values(r.per).every((n) => n >= 5),
      r.per,
    );
    await ctx.close();
  }
  // board track: concept questions only, at least 5 for a topic and at least 5 in all
  {
    const { p, ctx } = await family(b, "board");
    const r = await p.evaluate(() => {
      const y = addDays(today, -3);
      const U = DATA.items
        .map((i) => unitByK(i.k))
        .filter((u) => u && S.subjects.includes(u.subj) && qBank(u).filter((q) => !q.rote).length >= 5);
      if (!U.length) return { none: true };
      S.log.push({ key: U[0].k, date: y, subj: U[0].subj, kind: "les" });
      S.rfp = {};
      const plan = rfPlanFromAnswers(today);
      if (!plan) return { noPlan: true, learned: learnedUnits().length };
      return {
        slots: plan.slots.length,
        allQuestions: plan.slots.every((s) => s.ty === "qz"),
        rote: plan.slots.filter((s) => s.q.rote).length,
        topics: plan.topics.length,
      };
    });
    check("board track: at least 5 questions", r.slots >= 5, r);
    check("board track: every slot is a question, none rote", r.allQuestions && r.rote === 0, r);
    await ctx.close();
  }
  console.log(out.join("\n"));
  console.log(bad ? `refresher: ${bad} problem(s)` : "refresher: all ok");
  await b.close();
  process.exit(bad ? 1 : 0);
})();
