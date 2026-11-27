const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }), p = await ctx.newPage();
  await p.goto("http://127.0.0.1:8801/app.html"); await p.waitForTimeout(500);
  await p.fill("#lgPhone", "81234 56789"); await p.fill("#lgName", "P"); await p.click('[data-act="login"]'); await p.waitForTimeout(400);
  await p.fill("#obName", "Aarav"); await p.click('[data-age="8"]'); await p.waitForTimeout(250); await p.click('[data-b="combined"]');
  for (let i = 0; i < 8; i++) {
    await p.evaluate(() => { for (let i = 0; i < 12; i++) { const c = [...document.querySelectorAll('[data-oblvl$=":3"]')].find((x) => x.getAttribute("aria-pressed") !== "true"); if (!c) break; c.click(); } });
    const n = await p.$('[data-ob="next"],[data-ob="done"],[data-ob="finish"]'); if (!n) break; await n.click(); await p.waitForTimeout(250);
  }
  await p.evaluate(() => { S.guide = { on: false }; S.wk1 = { off: true }; ui.guide = null; document.getElementById("guide")?.remove(); render(); });
  await p.waitForTimeout(7000);
  await p.evaluate(() => fxOpen("sci.genetics.dna-and-rna.L3")); await p.waitForTimeout(1800);
  const keys = await p.evaluate(() => [...new Set(FXALL.map((c) => c.key.split(".")[0]))].join(" "));
  console.log("keys", keys);
  const go = async (needle, name) => {
    const r = await p.evaluate((n) => { const c = FXALL.find((x) => x.key.startsWith(n)); if (!c) return null; const si = FXALL.sections.findIndex((q) => q.id === c.sec), ci = FXALL.filter((x) => x.sec === c.sec).findIndex((x) => x.key === c.key); fxGo(si, ci); return c.key; }, needle);
    await p.waitForTimeout(1200);
    if (r) await p.screenshot({ path: "/tmp/sh/persp/" + name + ".png" });
    console.log(name, r);
  };
  await go("chal.0", "app-true-0"); await go("chal.1", "app-true-1"); await go("chal.2", "app-true-2"); await go("bq.0", "app-bigq-0"); await go("open.0", "app-open-0");
  await b.close();
})();
