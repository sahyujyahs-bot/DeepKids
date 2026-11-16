/* Plan → Up next and To finish: every kind of work is collated from the planned units, with the same count as its list */
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
  const kinds = ["proj", "exp", "act", "ws", "qz"];
  for (const k of kinds) {
    const r = await p.evaluate((k) => {
      tab = "week";
      ui.seg = { week: "next" };
      ui.tq = k;
      ui.qf = "all";
      render();
      const n = upList(k).length,
        rows = document.querySelectorAll("#main .trow").length,
        tabN = +[...document.querySelectorAll('[data-act="tqt"]')].find((b) => b.dataset.t === k).querySelector("small")
          .textContent;
      return { n, rows, tabN };
    }, k);
    check(`Up next ${k}: some are planned (${r.n})`, r.n > 0, "");
    check(`Up next ${k}: the tab count and the list agree`, r.tabN === r.n && r.rows === r.n, JSON.stringify(r));
  }
  // a part that is started shows under To finish, tagged Started
  const t = await p.evaluate(() => {
    const id = Object.keys(DATA.units).find((i) => unitBy("unit|" + i) && fxStates(i).every((x) => x === "none"));
    const P = DATA.units[id].parts,
      pi = P.findIndex((q) => FXWT[q[2]] === "proj" || FXWT[q[2]] === "ws");
    fxSt().done[id] = fxSt().done[id] || {};
    fxSt().time[id] = { ...(fxSt().time[id] || {}), [P[pi][0]]: 60 };
    commit();
    const ty = FXWT[P[pi][2]];
    tab = "week";
    ui.seg = { week: "finish" };
    ui.tq = ty;
    render();
    return {
      ty,
      states: fxStates(id).join(),
      tags: [...document.querySelectorAll("#main .pill")].map((x) => x.textContent),
    };
  });
  check(
    "To finish lists a part with a Started or Not tried yet tag",
    t.tags.some((x) => /Started|Not tried yet/.test(x)),
    JSON.stringify(t),
  );
  // Today holds one project; when it is finished the next one takes its place
  const pr = await p.evaluate(() => {
    const first = nextProject(),
      onToday = dayPlan(today).filter((x) => x.kind === "project").length;
    const uid = first.u.k.slice(5);
    fxSt().done[uid] = fxSt().done[uid] || {};
    fxSt().done[uid]["sec:" + first.id] = 1;
    fxSt().done[uid]["man:" + first.id] = 1;
    const second = nextProject();
    return { onToday, first: first.title, second: second?.title };
  });
  check("Today holds exactly one project", pr.onToday === 1, JSON.stringify(pr));
  check("a finished project is replaced by the next one", pr.second && pr.second !== pr.first, JSON.stringify(pr));
  let bad = 0;
  for (const r of out) {
    if (!r.ok) bad++;
    console.log((r.ok ? "ok   " : "FAIL ") + r.name + (r.ok ? "" : " (" + r.extra + ")"));
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
