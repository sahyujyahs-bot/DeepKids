const { chromium } = require("playwright"); const fs = require("fs");
const { S } = require("./make9.js"); const B = "http://127.0.0.1:8796/";
const T = { 11: [4.3, 5.4, 6.5] };
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 1.5 });
  fs.rmSync("/tmp/sh/dna/sb/st9", { recursive: true, force: true }); fs.mkdirSync("/tmp/sh/dna/sb/st9");
  for (let i = 10; i < 11; i++) { fs.writeFileSync(`/tmp/sh/dna/sb/c9_${i}.html`, S[i][1]); await p.goto(B + `c9_${i}.html`, { waitUntil: "load" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    for (const t of T[i + 1]) { await p.evaluate((t) => document.getAnimations().forEach((a) => { try { a.pause(); a.currentTime = t * 1000; } catch (e) {} }), t); await p.waitForTimeout(200); await p.screenshot({ path: `/tmp/sh/dna/sb/st9/s${String(i + 1).padStart(2, "0")}_${String(t).padStart(5, "0")}.png` }); } }
  await b.close(); console.log("ok"); })();
