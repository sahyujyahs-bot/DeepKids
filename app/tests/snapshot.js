// Visits every main screen for several family types with a frozen clock and seeded randomness, and writes
// each screen's text and a screenshot into <out>. Run it before and after a change, then compare the folders:
//   node app/tests/snapshot.js http://127.0.0.1:8765/app_prev.html /tmp/before
const { chromium } = require("playwright");
const fs = require("fs"),
  path = require("path");
const [URL, OUT] = process.argv.slice(2);
// ONLY=combined8,ncert8 limits the run to some families
const FAMILIES = [
  ["combined", 8],
  ["combined", 6],
  ["ncert", 8],
  ["cambridge", 10],
  ["nios", 8],
  ["waldorf", 8],
].filter(([b, a]) => !process.env.ONLY || process.env.ONLY.split(",").includes(b + a));
const FREEZE = () => {
  const T = new Date("2026-10-26T10:00:00+05:30").getTime(),
    D = Date;
  let s = 42;
  Math.random = () => (s = (s * 16807) % 2147483647) / 2147483647;
  globalThis.Date = class extends D {
    constructor(...a) {
      super(...(a.length ? a : [T]));
    }
    static now() {
      return T;
    }
  };
};
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  // full Chromium (not the headless shell), so screenshots match from run to run
  const b = await chromium.launch({ executablePath: chromium.executablePath() });
  for (const [board, age] of FAMILIES) {
    const ctx = await b.newContext({ viewport: { width: 400, height: 860 } }),
      p = await ctx.newPage(),
      errs = [];
    await ctx.addInitScript(FREEZE);
    p.on("pageerror", (e) => errs.push(e.message));
    const shot = async (name) => {
      await p.evaluate(() =>
        document.querySelectorAll(".toast,.confetti,[class*=confetti]").forEach((e) => e.remove()),
      );
      const f = path.join(OUT, `${board}${age}-${name}`);
      fs.writeFileSync(f + ".txt", await p.evaluate(() => document.body.innerText));
      if (!process.env.NOSHOT) await p.screenshot({ path: f + ".png", fullPage: true, animations: "disabled" });
    };
    await p.goto(URL);
    await p.waitForTimeout(400);
    await shot("0login");
    await p.fill("#lgPhone", "81234 56789");
    await p.fill("#lgName", "P");
    await p.click('[data-act="login"]');
    await p.waitForTimeout(400);
    await p.fill("#obName", "Kid");
    await p.click(`[data-age="${age}"]`);
    await shot("1onboard");
    await p.click('[data-ob="next"]');
    await p.waitForTimeout(200);
    if (board === "waldorf") await p.click('[data-obtrack="waldorf"]').catch(() => {});
    else if (board !== "combined") {
      await p.click('[data-obtrack="board"]');
      await p.waitForTimeout(150);
      if (board !== "ncert") {
        await p.click(`[data-obb="${board}"]`);
        await p.waitForTimeout(100);
        await p.click('[data-obb="ncert"]');
        await p.waitForTimeout(100);
      }
    }
    await shot("2track");
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
      await shot("3step" + i);
      await n.click();
      await p.waitForTimeout(250);
    }
    await p.evaluate(() => {
      S.guide = { on: false };
      ui.guide = null;
      document.getElementById("guide")?.remove();
    }); // walkthrough off: guide.js tests it

    const tabs = [
      ["today", null],
      ["week", "cal"],
      ["week", "next"],
      ["week", "finish"],
      ["week", "family"],
      ["journey", null],
      ["library", "topics"],
      ["library", "have"],
      ["library", "read"],
    ];
    for (const [t, seg] of tabs) {
      await p
        .evaluate(
          ([t, seg]) => {
            tab = t;
            if (seg) {
              (SEGS[t] || []).length;
              ui[t + "Seg"] = seg;
            }
            render();
          },
          [t, seg],
        )
        .catch((e) => errs.push("nav " + e.message));
      if (seg) await p.click(`[data-act="seg"][data-v="${seg}"]`).catch(() => {});
      await p.waitForTimeout(250);
      await shot(`4${t}-${seg || ""}`);
    }
    // open a unit, a lesson sheet and the refresher
    await p
      .evaluate(() => {
        const k = Object.keys(DATA.units || {})[0];
        if (k && typeof fxOpen === "function") fxOpen(k);
      })
      .catch((e) => errs.push("unit " + e.message));
    await p.waitForTimeout(400);
    await shot("5unit");
    fs.writeFileSync(path.join(OUT, `${board}${age}-errors.txt`), errs.join("\n"));
    await ctx.close();
  }
  await b.close();
})();
