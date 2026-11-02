/* A tab strip that scrolls sideways always shows the chosen tab in full, whichever tab is chosen. */
const URL = process.argv[2] || "http://127.0.0.1:8765/app.html";
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  let bad = 0;
  const out = [];
  for (const w of [390, 360]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 860 } }),
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
    await p.evaluate(() => {
      S.guide = { on: false };
      ui.guide = null;
      document.getElementById("guide")?.remove();
      S.wk1 = { off: true };
    });
    for (const t of ["Plan", "Library", "Progress"]) {
      await p.click(`#nav button:has-text("${t}")`);
      await p.waitForTimeout(300);
      const vs = await p.evaluate(() =>
        [...document.querySelectorAll('.seg [data-act="seg"]')].map((x) => x.dataset.v),
      );
      for (const v of vs) {
        await p.evaluate((v) => document.querySelector(`.seg [data-act="seg"][data-v="${v}"]`).click(), v);
        await p.waitForTimeout(250);
        const r = await p.evaluate(() => {
          const on = document.querySelector('.seg [data-act="seg"][aria-pressed="true"]');
          if (!on) return { ok: true };
          const s = on.closest(".seg").getBoundingClientRect(),
            o = on.getBoundingClientRect();
          return { ok: o.left >= s.left - 1 && o.right <= s.right + 1, label: on.textContent.trim() };
        });
        if (!r.ok) {
          bad++;
          out.push(`${w}px ${t} tab "${r.label}" is cut off`);
        }
      }
    }
    await ctx.close();
  }
  console.log(out.join("\n"));
  console.log(bad ? `seg: ${bad} cut-off tab(s)` : "seg: every chosen tab is fully in view");
  await b.close();
  process.exit(bad ? 1 : 0);
})();
