// Clicks every button on every main screen, one at a time from a fresh state, and reports buttons that
// throw an error or change nothing (no state, page, sheet, dialog, toast or URL change).
const URL = process.argv[2] || "http://127.0.0.1:8765/app.html";
const { chromium } = require("playwright");
const SCREENS = [
  ["today", null],
  ["week", "cal"],
  ["week", "next"],
  ["week", "finish"],
  ["week", "family"],
  ["journey", null],
  ["library", "topics"],
  ["library", "have"],
  ["library", "read"],
  ["unit", null],
];
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 400, height: 860 } });
  const p = await ctx.newPage();
  p.on("dialog", (d) => d.dismiss());
  await p.goto(URL);
  await p.waitForTimeout(400);
  await p.fill("#lgPhone", "81234 56789");
  await p.fill("#lgName", "S");
  await p.click('[data-act="login"]');
  await p.waitForTimeout(400);
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
  await p.evaluate(() => {
    S.guide = { on: false };
    ui.guide = null;
    document.getElementById("guide")?.remove();
  }); // walkthrough off: guide.js tests it

  const snap = await p.evaluate(() => JSON.stringify(S));
  const go = async ([t, sg]) => {
    await p.evaluate(
      ([t, sg, snap]) => {
        Object.assign(S, JSON.parse(snap));
        if (sheet.open) sheet.close();
        document.getElementById("fxDlg")?.close?.();
        ui.seg = ui.seg || {};
        if (t === "unit") {
          tab = "library";
        } else {
          tab = t;
          if (t === "week") ui.seg.week = sg;
          if (t === "library") ui.lt = sg;
        }
        render();
        scrollTo(0, 0);
      },
      [t, sg, snap],
    );
    if (t === "unit") {
      await p.evaluate(async () => {
        await fxOpen("sci.forces.friction.L3");
      });
    }
    await p.waitForTimeout(250);
  };
  const sig = () =>
    p.evaluate(() => {
      const tx = document.querySelector(".toast")?.innerText || "";
      const d = document.getElementById("fxDlg");
      return (
        JSON.stringify([
          JSON.stringify(S).length,
          JSON.stringify(S),
          document.getElementById("main").innerHTML.length,
          document.getElementById("main").innerHTML.slice(0, 3000).length,
          sheet.open,
          sheet.open ? document.getElementById("sheetBody").innerHTML.length : 0,
          d?.open ? d.innerHTML.length : 0,
          !!document.getElementById("fxChat")?.open,
          tx,
          tab,
          location.href,
        ]) +
        "|" +
        document.body.innerHTML.length
      );
    });
  const report = [];
  for (const sc of SCREENS) {
    await go(sc);
    const list = await p.evaluate(() => {
      const root = document.getElementById("fxDlg")?.open
        ? document.getElementById("fxDlg")
        : document.getElementById("main");
      const out = [];
      const seen = new Set();
      root.querySelectorAll("button,a[data-act],[data-act],[data-fx]").forEach((e) => {
        const r = e.getBoundingClientRect();
        if (!r.width || e.disabled) return;
        const k =
          (e.dataset.act || e.dataset.fx || e.tagName) +
          "|" +
          (e.innerText || e.getAttribute("aria-label") || "").trim().slice(0, 30);
        if (seen.has(k)) return;
        seen.add(k);
        out.push(k);
      });
      return out.slice(0, 60);
    });
    for (const k of list) {
      await go(sc);
      const before = await sig();
      let err = null;
      const errs = [];
      const h = (e) => errs.push(e.message);
      p.on("pageerror", h);
      try {
        await p.evaluate((k) => {
          const root = document.getElementById("fxDlg")?.open
            ? document.getElementById("fxDlg")
            : document.getElementById("main");
          const [a, t] = k.split("|");
          const e = [...root.querySelectorAll("button,a[data-act],[data-act],[data-fx]")].find(
            (e) =>
              (e.dataset.act || e.dataset.fx || e.tagName) +
                "|" +
                (e.innerText || e.getAttribute("aria-label") || "").trim().slice(0, 30) ===
              k,
          );
          if (!e) throw new Error("gone");
          if (e.tagName === "A" && e.target === "_blank") {
            e.dataset.ext = 1;
            return;
          }
          e.scrollIntoView();
          e.click();
        }, k);
      } catch (x) {
        err = x.message;
      }
      await p.waitForTimeout(250);
      p.off("pageerror", h);
      const after = await sig();
      const ext = await p.evaluate(() => !!document.querySelector("[data-ext]"));
      if (errs.length || err) report.push(`ERROR  ${sc.join("/")}  ${k}  ${(errs[0] || err).slice(0, 90)}`);
      else if (before === after && !ext) report.push(`NOTHING ${sc.join("/")}  ${k}`);
    }
  }
  console.log(report.filter((r) => !r.includes("Error: gone")).join("\n") || "all buttons did something");
  await b.close();
})();
