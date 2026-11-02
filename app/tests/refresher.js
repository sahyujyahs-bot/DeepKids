/* "Play it" on a refresher made from units starts the quiz at once, with no list in between. */
const URL = process.argv[2] || "http://127.0.0.1:8765/app.html";
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch(),
    ctx = await b.newContext({ viewport: { width: 390, height: 860 } }),
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
    const id = Object.keys(DATA.units).find((k) => k.endsWith("stretching-springs.L3")) || Object.keys(DATA.units)[0];
    S.fx = {
      mode: "parent",
      pos: {},
      done: {},
      saved: {},
      ref: { [id]: [{ k: "quiz.0" }, { k: "quiz.1" }] },
      score: {},
      time: {},
    };
    window.rfPlan = (date) => ({
      date,
      mins: 12,
      topics: [],
      slots: [],
      title: "Quick revision quiz",
      sub: "2 to try again",
      fxOnly: true,
    });
    const btn = document.createElement("button");
    btn.dataset.act = "refresh";
    btn.dataset.date = today;
    document.getElementById("main").appendChild(btn);
    btn.click();
    await new Promise((r) => setTimeout(r, 1500));
    const d = document.getElementById("fxDlg");
    return {
      dialog: !!d?.open,
      questions: d?.querySelectorAll(".fxfeed .fxq, .fxfeed [data-fxq], .fxfeed .fxcard, .fxfeed section").length,
      sheetOpen: !!document.getElementById("sheet")?.open,
    };
  });
  const ok = r.dialog && !r.sheetOpen;
  console.log(ok ? "refresher: Play it starts the quiz at once" : "refresher: FAIL", JSON.stringify(r));
  await b.close();
  process.exit(ok ? 0 : 1);
})();
