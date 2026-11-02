/* The website's sign-in screen shows the five welcome slides from app/content/welcome.json, the same list the app uses.
   node web/tests/welcome.js <address of web/public, e.g. http://127.0.0.1:8779/index.html> */
const URL = process.argv[2] || "http://127.0.0.1:8779/index.html";
const fs = require("fs");
const { chromium } = require("playwright");
(async () => {
  const want = JSON.parse(
    fs.readFileSync(__dirname + "/../../app/content/welcome.json", "utf8"),
  ).map((s) => s[1]);
  const b = await chromium.launch(),
    p = await b.newPage({ viewport: { width: 400, height: 900 } });
  await p.goto(URL);
  await p.waitForTimeout(2500);
  const got = await p.evaluate(() =>
    [...document.querySelectorAll(".dkg .slide b")].map((x) => x.textContent),
  );
  const imgs = await p.evaluate(() =>
    [...document.querySelectorAll(".dkg .slide img")].every(
      (i) => i.complete && i.naturalWidth > 0,
    ),
  );
  const ok =
    want.length === 5 && JSON.stringify(got) === JSON.stringify(want) && imgs;
  console.log(
    ok
      ? "welcome: the sign-in page shows the five slides from welcome.json"
      : "welcome: FAIL",
    JSON.stringify({ got, imgs }),
  );
  await b.close();
  process.exit(ok ? 0 : 1);
})();
