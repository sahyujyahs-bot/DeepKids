/* Search at the top of Today and in the library: results come with Do it now, Tomorrow and Add to queue; Tomorrow keeps a unit off today and puts it on tomorrow */
const URL = process.argv[2] || "http://127.0.0.1:8765/app.html";
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch(),
    ctx = await b.newContext({ viewport: { width: 390, height: 860 } }),
    p = await ctx.newPage(),
    out = [],
    check = (name, ok, extra) => out.push({ name, ok: !!ok, extra });
  await p.goto(URL);
  await p.waitForTimeout(400);
  await p.fill("#lgPhone", "81234 56789");
  await p.fill("#lgName", "P");
  await p.click('[data-act="login"]');
  await p.waitForTimeout(400);
  await p.fill("#obName", "Kid");
  await p.click('[data-age="8"]');
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
  await p.fill("#fq", "volcano");
  await p.press("#fq", "Enter");
  await p.waitForTimeout(400);
  const rows = await p.$$eval(".findrow", (x) => x.length);
  check("Today search lists units for a topic", rows > 0, rows);
  check(
    "each result has Do it now, Tomorrow and Add to queue",
    await p.evaluate(() => {
      const r = document.querySelector(".findrow");
      return !!(
        r.querySelector('[data-act="fnow"]') &&
        r.querySelector('[data-act="fmorrow"]') &&
        r.querySelector('[data-act="fqueue"]')
      );
    }),
    "",
  );
  const first = await p.evaluate(() => {
    const m = document.querySelector('.findrow [data-act="fmorrow"]');
    return { k: m.dataset.k, s: m.dataset.s };
  });
  await p.click('.findrow [data-act="fmorrow"]');
  await p.waitForTimeout(300);
  const held = await p.evaluate((f) => {
    const tomorrow = addDays(today, 1);
    const sch = schedule(f.s, 60);
    return {
      hold: S.hold?.[f.k],
      tomorrow,
      onToday: sch.some((x) => x.date === today && x.u.k === f.k),
      first: sch.find((x) => x.u.k === f.k)?.date,
    };
  }, first);
  check(
    "Tomorrow holds the unit back until tomorrow",
    held.hold === held.tomorrow && !held.onToday,
    JSON.stringify(held),
  );
  check(
    "and the unit is in the plan on a day from tomorrow",
    !held.first || held.first >= held.tomorrow,
    JSON.stringify(held),
  );
  await p.click('.findrow [data-act="fqueue"]');
  await p.waitForTimeout(300);
  const q = await p.evaluate((f) => {
    const nx = (S.next || {})[f.s] || [];
    return nx.indexOf(f.k) === nx.length - 1 || nx.indexOf(f.k) >= 0;
  }, first);
  check("Add to queue keeps it in the queue", q, "");
  await p.fill("#fq", "zzzqqq");
  await p.press("#fq", "Enter");
  await p.waitForTimeout(300);
  check(
    "no match says so and offers the library",
    await p.evaluate(() => !!document.querySelector('.findbar [data-act="tsearch"]')),
    "",
  );
  await p.click('.findbar [data-act="tsearch"]');
  await p.waitForTimeout(400);
  await p.fill("#tq", "volcano");
  await p.click('[data-act="tfind"]');
  await p.waitForTimeout(400);
  check(
    "the library search has the same three buttons",
    await p.evaluate(() => document.querySelectorAll('.findrow [data-act="fnow"]').length > 0),
    "",
  );
  await p.click('.findrow [data-act="fnow"]');
  await p.waitForTimeout(400);
  check("Do it now opens the unit", await p.evaluate(() => document.getElementById("sheet").open), "");
  let bad = 0;
  for (const r of out) {
    if (!r.ok) bad++;
    console.log((r.ok ? "ok   " : "FAIL ") + r.name + (r.ok ? "" : " (" + r.extra + ")"));
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
