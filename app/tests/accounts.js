/* Signing in again must never replace a family with another log-in's family.
   A person has two Google log-ins. The first holds a small DeepKids-track family with a class on the calendar. The second
   holds a bigger board-track family. The saved session has no "adopted" mark, as after a log-out. Opening the first one
   must keep its own track and its own class. */
const URL = process.argv[2] || "http://127.0.0.1:8765/app.html";
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const run = async (signedIn) => {
    const ctx = await b.newContext({ viewport: { width: 400, height: 860 } });
    await ctx.addInitScript((signedIn) => {
      const own = {
        setup: true,
        board: "combined",
        child: "Liri",
        age: 8,
        subjects: ["math", "sci"],
        levels: { math: 3, sci: 3 },
        updatedAt: 2000,
        events: [
          {
            id: "c1",
            title: "Maths tuition",
            kind: "class",
            who: "kid",
            rep: "once",
            date: "2026-11-05",
            start: "16:00",
            end: "17:00",
          },
        ],
        log: [],
      };
      const other = {
        setup: true,
        board: "ncert",
        boards: ["ncert"],
        child: "Asha",
        age: 9,
        subjects: ["math", "eng", "hin", "sci"],
        levels: { math: 3, eng: 3, hin: 3, sci: 3 },
        updatedAt: 1000,
        events: [],
        log: Array.from({ length: 40 }, (_, i) => ({
          date: "2026-10-" + String((i % 28) + 1).padStart(2, "0"),
          key: "k" + i,
          kind: "les",
        })),
      };
      const dbs = {
        "data/users/u1/acct_g1": own,
        "data/users/u1/acct_g2": other,
        "data/users/u1/session": { acct: signedIn, migrated: true },
      };
      window.__db = dbs;
      const doc = (path) => ({
        get: async () => ({ exists: path in dbs, data: () => JSON.parse(JSON.stringify(dbs[path])) }),
        set: async (v) => {
          dbs[path] = JSON.parse(JSON.stringify(v));
        },
        onSnapshot: () => () => {},
      });
      const db = {
        doc,
        collection: (path) => ({
          get: async () => ({
            docs: Object.keys(dbs)
              .filter((k) => k.startsWith(path + "/"))
              .map((k) => ({ id: k.slice(path.length + 1), data: () => JSON.parse(JSON.stringify(dbs[k])) })),
          }),
        }),
      };
      window.claude = { use: async (n) => (n === "db" ? db : { id: async () => "u1" }) };
      localStorage.setItem("dk-acct", signedIn);
    }, signedIn);
    const p = await ctx.newPage(),
      errs = [];
    p.on("pageerror", (e) => errs.push(e.message.slice(0, 100)));
    await p.goto(URL);
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => ({
      board: S.board,
      child: S.child,
      classes: (S.events || []).map((e) => e.title),
    }));
    await ctx.close();
    return { r, errs };
  };
  // a log-in with its own family keeps it; a new log-in with no family still brings in the fullest one
  const mine = await run("g1"),
    fresh = await run("g3");
  const okMine = mine.r.board === "combined" && mine.r.child === "Liri" && mine.r.classes.includes("Maths tuition"),
    okFresh = fresh.r.child === "Asha";
  console.log(
    okMine ? "accounts own family: ok" : "accounts own family: FAIL",
    JSON.stringify(mine.r),
    mine.errs.join("|"),
  );
  console.log(
    okFresh ? "accounts new log-in: ok" : "accounts new log-in: FAIL",
    JSON.stringify(fresh.r),
    fresh.errs.join("|"),
  );
  // Delete this profile: the family is wiped, the log-in is signed out, and signing in again starts clean, with no other
  // log-in's family brought in
  const del = await (async () => {
    const ctx = await b.newContext({ viewport: { width: 400, height: 860 } });
    await ctx.addInitScript(() => {
      const dbs = {
        "data/users/u1/acct_g1": {
          setup: true,
          board: "combined",
          child: "Liri",
          age: 8,
          subjects: ["math"],
          levels: { math: 3 },
          updatedAt: 2000,
          events: [
            {
              id: "c1",
              title: "Maths tuition",
              kind: "class",
              who: "kid",
              rep: "once",
              date: "2026-11-05",
              start: "16:00",
              end: "17:00",
            },
          ],
          log: [],
        },
        "data/users/u1/acct_g2": {
          setup: true,
          board: "ncert",
          boards: ["ncert"],
          child: "Asha",
          age: 9,
          subjects: ["math"],
          levels: { math: 3 },
          updatedAt: 1000,
          events: [],
          log: [],
        },
        "data/users/u1/session": { acct: "g1", migrated: true },
      };
      window.__db = dbs;
      const doc = (path) => ({
        get: async () => ({ exists: path in dbs, data: () => JSON.parse(JSON.stringify(dbs[path])) }),
        set: async (v) => {
          dbs[path] = JSON.parse(JSON.stringify(v));
        },
        onSnapshot: () => () => {},
      });
      const db = {
        doc,
        collection: (path) => ({
          get: async () => ({
            docs: Object.keys(dbs)
              .filter((k) => k.startsWith(path + "/"))
              .map((k) => ({ id: k.slice(path.length + 1), data: () => JSON.parse(JSON.stringify(dbs[k])) })),
          }),
        }),
      };
      window.claude = { use: async (n) => (n === "db" ? db : { id: async () => "u1" }) };
      if (!sessionStorage.getItem("seen")) localStorage.setItem("dk-acct", "g1");
    });
    const p = await ctx.newPage();
    await p.goto(URL);
    await p.waitForTimeout(1200);
    await p.evaluate(() => {
      S.guide = { on: false };
      document.getElementById("guide")?.remove();
      openSheet({ mode: "settings" });
      ui.sopen = "delete";
      renderSheet();
    });
    await p.waitForTimeout(300);
    const ask = await p.evaluate(() => !!document.querySelector('[data-act="delprofile"]'));
    await p.evaluate(() => document.querySelector('[data-act="delprofile"]').click());
    await p.waitForTimeout(300);
    const sure = await p.evaluate(() => !!document.querySelector('[data-act="delprofileyes"]'));
    await p.evaluate(() => document.querySelector('[data-act="delprofileyes"]').click());
    await p.waitForTimeout(1200);
    const after = await p.evaluate(() => ({
      acct: localStorage.getItem("dk-acct"),
      cloud: window.__db["data/users/u1/acct_g1"],
      adopted: window.__db["data/users/u1/session"].adopted,
      login: !!document.getElementById("lgPhone") || !!document.querySelector(".fxintro"),
    }));
    await ctx.close();
    return { ask, sure, ...after };
  })();
  const okDel =
    del.ask &&
    del.sure &&
    !del.acct &&
    del.cloud.setup === false &&
    !(del.cloud.events || []).length &&
    del.adopted === true &&
    del.login;
  console.log(
    okDel ? "accounts delete profile: ok" : "accounts delete profile: FAIL",
    JSON.stringify({ ...del, cloud: { setup: del.cloud?.setup, events: (del.cloud?.events || []).length } }),
  );
  await b.close();
  process.exit(okMine && okFresh && okDel ? 0 : 1);
})();
