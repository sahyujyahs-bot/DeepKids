// Walkthrough mode: a new family sees each screen's tips once, can step through them, turn them off, and replay them with ?
//   node app/tests/guide.js http://127.0.0.1:8765/app.html [folder for screenshots]
const { chromium } = require("playwright");
const URL = process.argv[2] || "http://127.0.0.1:8765/app.html",
  SHOTS = process.argv[3];
(async () => {
  const b = await chromium.launch(),
    p = await (await b.newContext({ viewport: { width: 400, height: 860 } })).newPage(),
    errs = [],
    out = [];
  p.on("pageerror", (e) => errs.push(e.message));
  await p.goto(URL);
  await p.waitForTimeout(300);
  await p.fill("#lgPhone", "81234 56789");
  await p.fill("#lgName", "S");
  await p.click('[data-act="login"]');
  await p.waitForTimeout(300);
  await p.fill("#obName", "Liri");
  await p.click('[data-age="8"]');
  await p.click('[data-ob="next"]');
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
    const n = await p.$('[data-ob="next"]');
    if (!n) break;
    await n.click();
    await p.waitForTimeout(150);
  }
  await p.evaluate(() => document.querySelectorAll(".toast,.confetti").forEach((e) => e.remove()));
  await p.waitForTimeout(800);
  const step = () => p.evaluate(() => document.querySelector("#guide .gbub")?.innerText.replace(/\s+/g, " ") || "none");
  out.push("today, first time: " + (await step()));
  if (SHOTS) await p.screenshot({ path: SHOTS + "/guide-today-1.png" });
  let n = 0;
  while ((await p.$('#guide [data-g="next"]')) && n++ < 12) {
    out.push("  " + (await step()));
    if (SHOTS && n === 4) await p.screenshot({ path: SHOTS + "/guide-today-4.png" });
    await p.click('#guide [data-g="next"]');
    await p.waitForTimeout(350);
  }
  out.push("after Got it: " + (await step()) + " | seen today: " + (await p.evaluate(() => !!S.guide?.seen?.today)));
  await p.click('#nav button:has-text("Plan")');
  await p.waitForTimeout(800);
  out.push("Plan, first time: " + (await step()));
  if (SHOTS) await p.screenshot({ path: SHOTS + "/guide-plan.png" });
  await p.click('#guide [data-g="off"]');
  await p.waitForTimeout(300);
  out.push("after Turn off: " + (await step()) + " | on: " + (await p.evaluate(() => S.guide.on)));
  await p.click('#nav button:has-text("Library")');
  await p.waitForTimeout(800);
  out.push("Library with walkthrough off: " + (await step()));
  await p.click("#guideBtn");
  await p.waitForTimeout(500);
  out.push("after tapping ?: " + (await step()));
  console.log(out.join("\n"));
  console.log("errors", errs.length ? errs.join(" | ") : "none");
  await b.close();
})();
