/* Today → + Add: the sheet lists the kinds; choosing one shows its form; saving adds it and closes the sheet */
const URL = process.argv[2] || "http://127.0.0.1:8765/app.html";
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch(),
    ctx = await b.newContext({ viewport: { width: 390, height: 860 } }),
    p = await ctx.newPage(),
    out = [],
    check = (name, ok, extra) => out.push({ name, ok: !!ok, extra });
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
  await p.evaluate(() => {
    S.guide = { on: false };
    ui.guide = null;
    document.getElementById("guide")?.remove();
    S.wk1 = { off: true };
  });
  const n0 = await p.evaluate(() => (S.todos || []).length);
  await p.click('[data-act="quick"]');
  await p.waitForTimeout(300);
  const kinds = await p.$$eval('[data-act="addkind"]', (x) => x.length);
  check("the sheet lists the kinds", kinds >= 8, kinds);
  await p.click('[data-act="addkind"][data-k="todo"]');
  await p.waitForTimeout(300);
  check("choosing a kind shows its form", !!(await p.$("#qa-t")), "");
  await p.fill("#qa-t", "Buy chart paper");
  await p.click('[data-act="qaddq"]');
  await p.waitForTimeout(400);
  check("saving adds it", (await p.evaluate(() => (S.todos || []).length)) === n0 + 1, "");
  check("and closes the sheet", await p.evaluate(() => !document.getElementById("sheet").open), "");
  let bad = 0;
  for (const r of out) {
    if (!r.ok) bad++;
    console.log((r.ok ? "ok   " : "FAIL ") + r.name + (r.ok ? "" : " (" + r.extra + ")"));
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
