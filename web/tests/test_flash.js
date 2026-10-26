// A family that is already set up signs in on a fresh browser: the set-up screens must never show, not even briefly.
//   python3 web/build_web.py && node web/tests/test_flash.js
const { chromium } = require("playwright");
const http = require("http"),
  fs = require("fs"),
  path = require("path");
const PUB = path.join(__dirname, "..", "public"),
  FAKE = fs.readFileSync(path.join(__dirname, "fake_supabase.js"), "utf8");
const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const f = path.join(PUB, p);
  if (!f.startsWith(PUB) || !fs.existsSync(f)) {
    res.writeHead(404);
    return res.end("nf");
  }
  res.writeHead(200, {
    "content-type": TYPES[path.extname(f)] || "application/octet-stream",
  });
  fs.createReadStream(f).pipe(res);
});
(async () => {
  await new Promise((r) => server.listen(8789, r));
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 400, height: 860 } });
  await ctx.addInitScript(FAKE);
  // note every time the set-up screen appears
  await ctx.addInitScript(() => {
    new MutationObserver(() => {
      if (document.getElementById("obName") && window.__ready)
        window.__sawSetup = (window.__sawSetup || 0) + 1;
    }).observe(document, { childList: true, subtree: true });
  });
  const p = await ctx.newPage();
  await p.goto("http://localhost:8789/");
  await p.waitForTimeout(1500);
  await p.fill("#lgPhone", "81234 56789");
  await p.fill("#lgName", "Sahyujyah");
  await p.click('[data-act="login"]');
  await p.waitForTimeout(800);
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
    await p.waitForTimeout(200);
  }
  console.log("set up:", await p.evaluate(() => S.setup));
  // a fresh browser: only the sign-in survives, the family's data has to come from the database
  await p.evaluate(() => {
    for (const k of Object.keys(localStorage))
      if (k.startsWith("dk-") && k !== "dk-acct") localStorage.removeItem(k);
  });
  await p.addInitScript(() => (window.__ready = 1));
  await p.reload();
  await p.waitForTimeout(2500);
  const r = await p.evaluate(() => ({
    setup: S.setup,
    child: S.child,
    sawSetupScreen: window.__sawSetup || 0,
  }));
  console.log("after sign-in on a fresh browser:", JSON.stringify(r));
  console.log(
    r.setup && !r.sawSetupScreen ? "PASS" : "FAIL: the set-up screen showed",
  );
  await b.close();
  server.close();
})();
