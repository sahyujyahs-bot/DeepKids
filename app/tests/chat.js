// I am over a sheet: with AI locked, tapping him opens his Plus page (no AI); with AI on, the chat opens and ✕ closes it.
//   node app/tests/chat.js http://127.0.0.1:8765/app.html
const { chromium } = require("playwright");
const URL = process.argv[2] || "http://127.0.0.1:8765/app.html";
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
  await p.evaluate(() => {
    Object.assign(S, {
      setup: true,
      child: "Liri",
      age: 8,
      board: "combined",
      subjects: ["sci", "dks"],
      levels: { sci: 3, dks: 3 },
    });
    S.guide = { on: false };
    ob = null;
    render();
    openSheet({ mode: "games" });
  });
  await p.waitForTimeout(500);
  const chatOpen = () => p.evaluate(() => !!document.getElementById("fxChat")?.open);
  await p.click("#sheet .fxfab");
  await p.waitForTimeout(300);
  out.push(`AI locked: Plus page ${await p.evaluate(() => !!document.querySelector("#fxChat [data-cx=plus]"))} | AI chat box ${await p.evaluate(() => !!document.querySelector("#fxChat textarea"))}`);
  await p.click('#fxChat [data-cx="x"]');
  await p.waitForTimeout(300);
  await p.evaluate(() => (S.aiPlan = "on"));
  await p.click("#sheet .fxfab");
  await p.waitForTimeout(300);
  out.push(`AI on: chat opened ${await chatOpen()}`);
  await p.click('#fxChat [data-cx="x"]');
  await p.waitForTimeout(300);
  out.push(`after ✕: chat open ${await chatOpen()} | sheet still open ${await p.evaluate(() => sheet.open)}`);
  console.log(out.join("\n"));
  console.log("errors", errs.length ? errs.join(" | ") : "none");
  await b.close();
})();
