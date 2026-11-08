/* The first-week guide: Day 1 starts a lesson and Day 2 opens an experiment, from the family's own track.
   DeepKids track: a DeepKids unit opens, at its first experiment. Board track: the board lesson's player opens, at its experiment step.
   Nothing may show the "This unit is on the DeepKids track" message on the way. */
const URL = process.argv[2] || "http://127.0.0.1:8765/app.html";
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const out = [];
  let bad = 0;
  for (const board of ["combined", "ncert"]) {
    const ctx = await b.newContext({ viewport: { width: 400, height: 860 } }),
      p = await ctx.newPage(),
      errs = [];
    p.on("pageerror", (e) => errs.push(e.message.slice(0, 120)));
    await p.clock.install({ time: new Date("2026-11-04T10:00:00") }); // a Wednesday: the guide plans no lessons at weekends
    await p.goto(URL);
    await p.waitForTimeout(400);
    await p.fill("#lgPhone", "81234 56789");
    await p.fill("#lgName", "P");
    await p.click('[data-act="login"]');
    await p.waitForTimeout(500);
    await p.fill("#obName", "Kid");
    await p.click('[data-age="8"]');
    await p.click('[data-ob="next"]');
    await p.waitForTimeout(200);
    if (board === "ncert") {
      await p.click('[data-obtrack="board"]');
      await p.waitForTimeout(150);
    } else await p.click(`[data-b="${board}"]`);
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
      S.wk1 = { start: today };
    });
    const check = async (label, day, sel, test) => {
      await p.evaluate((d) => {
        document.getElementById("fxDlg")?.open && fxClose();
        if (ui.sheet) goBack();
        document.querySelectorAll(".toast").forEach((t) => t.remove());
        ui.wk1at = d;
        tab = "today";
        render();
      }, day);
      await p.waitForTimeout(300);
      const hit = await p.evaluate((q) => {
        const x = document.querySelector(`.wk1 ${q}`);
        x?.click();
        return !!x;
      }, sel);
      if (!hit) {
        bad++;
        return out.push(`${board} ${label}: FAIL no button ${sel}`);
      }
      await p.waitForTimeout(1500);
      const r = await p.evaluate(test);
      if (!r.ok) bad++;
      out.push(`${board} ${label}: ${r.ok ? "ok" : "FAIL"} ${JSON.stringify(r)}`);
    };
    if (board === "combined") {
      await check("day 1 start the unit", 0, '[data-act="wk1unit"]', () => ({
        ok: !!document.getElementById("fxDlg")?.open && !/choose the DeepKids track/.test(document.body.innerText),
      }));
      await check("day 2 experiment", 1, '[data-act="wk1exp"]', () => {
        const s = FXALL?.sections?.[FXSI];
        return {
          ok: !!document.getElementById("fxDlg")?.open && !!s && (FXU.experiments || []).some((e) => e.id === s.id),
          at: s?.id,
        };
      });
    } else {
      await check("day 1 start the lesson", 0, '[data-act="play"]', () => ({
        ok: ui.sheet?.mode === "player" && !/choose the DeepKids track/.test(document.body.innerText),
        mode: ui.sheet?.mode,
      }));
      await check("day 2 experiment", 1, '[data-act="wk1exp"]', () => {
        const P = ui.sheet,
          st = P?.mode === "player" ? stepState({ u: unitBy(P.k), n: P.n, tot: P.tot, bonus: P.bonus }) : [];
        return { ok: P?.mode === "player" && st[P.i]?.sec === "lab", mode: P?.mode, sec: st[P?.i]?.sec };
      });
    }
    if (errs.length) {
      bad++;
      out.push(`${board}: page errors ${errs.slice(0, 3).join(" | ")}`);
    }
    await ctx.close();
  }
  console.log(out.join("\n"));
  console.log(bad ? `wk1: ${bad} problem(s)` : "wk1: all ok");
  await b.close();
  process.exit(bad ? 1 : 0);
})();
