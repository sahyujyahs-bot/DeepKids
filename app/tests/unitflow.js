// Walks a DeepKids-track unit the way a family does (open it, move through cards, answer questions right and wrong,
// mark a part done on paper) and prints what every list says afterwards. Compare the output before and after a change:
//   node app/tests/unitflow.js http://127.0.0.1:8765/app.html
const { chromium } = require("playwright");
const URL = process.argv[2] || "http://127.0.0.1:8765/app.html";
(async () => {
  const b = await chromium.launch(),
    p = await (await b.newContext({ viewport: { width: 400, height: 860 } })).newPage(),
    errs = [];
  await p.addInitScript(() => {
    const T = new Date("2026-10-26T10:00:00+05:30").getTime(),
      D = Date;
    globalThis.Date = class extends D {
      constructor(...a) {
        super(...(a.length ? a : [T]));
      }
      static now() {
        return T;
      }
    };
  });
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
  const id = "sci.materials.magnetic-materials.L3";
  await p.evaluate((id) => fxOpen(id), id);
  await p.waitForTimeout(800);
  const out = await p.evaluate(async (id) => {
    const r = [];
    // go through the first 8 parts to their last card, answering their checked questions: right, wrong, right…
    const P = DATA.units[id].parts;
    let n = 0;
    for (let si = 0; si < 8; si++) {
      fxGo(si, Math.max(0, (FXALL.sections[si].n || 1) - 1));
      const p = P.find((q) => q[0] === FXALL.sections[si].id);
      for (let k = 0; p && p[6] && k < (p[4] || 0); k++) fxMark(FXU, p[6] + k, n++ % 2 === 0, "question " + k);
    }
    // the first 5 parts were read to the end (the feed sets this when the last card is seen)
    P.slice(0, 5).forEach((p) => (fxSt().done[id]["sec:" + p[0]] = 1));
    fxSt().done[id]["man:" + P[P.length - 1][0]] = 1;
    fxStamp(id);
    save();
    r.push("states " + fxStates(id).join(","));
    r.push("unit " + fxUnitSt("unit|" + id) + " sessions " + fxSessionsDone("unit|" + id));
    r.push("going " + JSON.stringify(lessonsGoing().map((x) => x.sub)));
    r.push("spine " + fxSpineIds(unitBy("unit|" + id)).join(","));
    r.push("refs " + fxRefs().length);
    r.push("done " + doneItems().length + " work " + workItems().length);
    tab = "week";
    ui.seg = { week: "finish" };
    render();
    r.push(document.getElementById("main").innerText.slice(0, 900));
    return r.join("\n");
  }, id);
  console.log(out);
  console.log("errors", errs.length ? errs.join(" | ") : "none");
  await b.close();
})();
