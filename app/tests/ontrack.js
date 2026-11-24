/* Progress → Overview: "Are we on track?" is the one place for done-versus-a-school; its numbers match the plan and move when a unit is finished */
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
  await p.click('#nav button:has-text("Progress")');
  await p.waitForTimeout(400);
  const read = () =>
    p.evaluate(() => {
      const rows = [...document.querySelectorAll(".ontrack .trow2")].map((r) => {
        const lines = [...r.querySelectorAll(".trkline b")].map((x) => x.textContent.trim());
        return {
          s: r.querySelector("b").textContent.trim(),
          chip: r.querySelector(".trkchip")?.textContent.trim(),
          lines,
        };
      });
      // what the plan itself says for each subject: units at the chosen level the family must do, and how many are done
      const plan = S.subjects.map((s) => {
        const U = plannedUnits(s).filter((u) => u.level === S.levels[s] && (S.board !== "combined" || fxReq(u)));
        return { s: SUBJ[s], total: U.length, done: U.filter((u) => rank[statusOf(u.k)] >= 2).length };
      });
      return {
        rows,
        plan,
        menu: [...document.querySelectorAll(".menurow b")].map((x) => x.textContent.trim()),
        yearGone: document.querySelector(".ys-top b")?.textContent,
      };
    });
  const a = await read();
  check(
    "the on-track card shows every subject",
    a.rows.length === a.plan.length,
    a.rows.length + " of " + a.plan.length,
  );
  check(
    "each subject's 'of N' matches the plan",
    a.rows.every((r, i) => r.lines[0] === `${a.plan[i].done} of ${a.plan[i].total}`),
    JSON.stringify(a.rows.map((r) => r.lines[0])),
  );
  // a school's share is measured against the whole school year, whenever the family started
  check(
    "the school's share is the share of the year gone, even for a family that has just started",
    a.rows.every((r, i) => {
      const exp = +r.lines[1].split(" of ")[0],
        want = Math.round((parseInt(a.yearGone) / 100) * a.plan[i].total);
      return exp === want;
    }),
    a.yearGone + " " + JSON.stringify(a.rows.map((r) => r.lines[1])),
  );
  check(
    "no second 'Syllabus progress' row for one board",
    !a.menu.some((t) => /Syllabus progress/.test(t)),
    a.menu.join(" | "),
  );
  // finish one lesson that is not a DeepKids unit: its subject's Done count goes up by one
  const k = await p.evaluate(() => {
    for (const s of S.subjects) {
      const u = plannedUnits(s).find(
        (x) =>
          x.level === S.levels[s] &&
          (S.board !== "combined" || fxReq(x)) &&
          !x.k.startsWith("unit|") &&
          rank[statusOf(x.k)] < 2,
      );
      if (u) {
        S.progress[u.k] = { status: "completed", sessions: 1 };
        commit();
        return { k: u.k, i: S.subjects.indexOf(s) };
      }
    }
    return null;
  });
  await p.waitForTimeout(400);
  const c = await read();
  check(
    "finishing a lesson raises Done by one",
    k && c.rows[k.i].lines[0] === `${a.plan[k.i].done + 1} of ${a.plan[k.i].total}`,
    JSON.stringify(k) + " " + (k ? c.rows[k.i].lines[0] : ""),
  );
  // 'Do next' puts the topic at the front of that subject's queue
  const before = await p.evaluate(() => JSON.stringify(S.next || null));
  await p.evaluate(() => document.querySelector(".ontrack details summary")?.click());
  const had = await p.$(".ontrack [data-act='catchup']");
  if (had) {
    await p.evaluate(() => document.querySelector(".ontrack [data-act='catchup']").click());
    await p.waitForTimeout(300);
    const after = await p.evaluate(() => JSON.stringify(S.next || null));
    check("'Do next' changes the queue", after !== before, "");
  } else check("a catch-up button exists", false, "");
  let bad = 0;
  for (const r of out) {
    if (!r.ok) bad++;
    console.log((r.ok ? "ok   " : "FAIL ") + r.name + (r.ok ? "" : " (" + r.extra + ")"));
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
