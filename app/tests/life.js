// Learning from life: a badminton class added from Today, the topics it links to, queueing them, the skill and its
// hours in Progress, the transcript, and a class checked in on Today. Prints what it saw.
//   node app/tests/life.js http://127.0.0.1:8765/app.html
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
  await p.evaluate(() => {
    S.guide = { on: false };
    ui.guide = null;
    document.getElementById("guide")?.remove();
  }); // walkthrough off: guide.js tests it
  const out = {};
  await p.click('[data-act="lifeadd"]');
  await p.click('[data-act="lifekind"][data-k="class"]');
  await p.fill("#lfTitle", "Badminton");
  await p.fill("#lfText", "Practised smashes and footwork");
  await p.selectOption("#lfMins", "60");
  await p.click('[data-act="lifesave"]');
  await p.waitForTimeout(400);
  out.links = await p.$$eval(".lifelink b", (L) => L.map((x) => x.textContent));
  out.skillLine = await p.$eval(".lifeskill", (x) => x.textContent).catch(() => "");
  await p.click('[data-act="lifeq"]');
  await p.waitForTimeout(200);
  out.queued = await p.evaluate(() => (S.next?.sci || []).filter((k) => S.moments[0].queued.includes(k)).length);
  await p.evaluate(() => document.getElementById("sheet").close());
  await p.evaluate(() => {
    ui.seg = { ...(ui.seg || {}), journey: "life" };
    tab = "journey";
    render();
  });
  await p.waitForTimeout(200);
  out.skills = await p.$$eval(".hbar .sm", (L) => L.map((x) => x.textContent));
  out.hoursToday = await p.evaluate(() => trackData()[today].l);
  out.transcript = await p.evaluate(() => /Skills and activities[\s\S]*Badminton/.test(transcriptDoc()));
  // a class on the calendar, checked in on Today, counts as a session of its skill
  await p.evaluate(() => {
    S.events = [
      ...(S.events || []),
      { id: "sw1", title: "Swimming", kind: "class", who: "kid", date: today, start: "08:00", end: "09:00" },
    ];
    openSheet({ mode: "evdone", date: today, id: "sw1" });
  });
  await p.waitForTimeout(150);
  await p.fill("#evf-covered", "Floating on the back");
  await p.click('[data-act="evsave"]');
  await p.waitForTimeout(400);
  out.afterClass = await p.evaluate(() => lifeSkills().map((x) => x.name + " " + x.mins));
  // the planner reads spoken, unpunctuated messages on the phone: classes, days, times and interests
  out.planner = await p.evaluate(() =>
    [
      "Ok so Liri goes to art class art and crafts class on few days a week Tuesday she also likes to sing and play badminton",
      "Liri goes to Science tuition everyday 4 to 5:00 p.m. only on weekdays. She is interested in stitching chemistry art",
      "um so he has karate on monday and wednesday at 5 he loves dinosaurs and space and he likes to draw",
    ].map((t) =>
      readOnPhone(t).items.map((x) => [x.type, x.title, (x.days || []).join(""), x.start || ""].join(" ").trim()),
    ),
  );
  // Add by hand on the Planner: each kind goes where it does its job
  await p.evaluate(() => {
    const d = document.getElementById("sheet");
    if (d.open) d.close();
    ui.seg = { ...(ui.seg || {}), week: "days" };
    tab = "week";
    render();
  });
  const before = await p.evaluate(() => ({
    ev: S.events.length,
    todo: (S.todos || []).length,
    inv: (S.inv || []).length,
    mo: S.moments.length,
  }));
  const add = async (k, fill) => {
    await p.click(`[data-act="qkind"][data-k="${k}"]`);
    for (const [sel, v] of Object.entries(fill)) await p.fill(sel, v);
    await p.click('[data-act="qaddq"]');
    await p.waitForTimeout(300);
    await p.evaluate(() => document.getElementById("sheet").open && document.getElementById("sheet").close());
  };
  await add("class", { "#qa-t": "Tabla", "#qa-s": "17:00" });
  out.classNeedsDays = await p.evaluate(() => S.events.length);
  await p.click('[data-act="qday"][data-d="3"]');
  await p.click('[data-act="qaddq"]');
  await p.waitForTimeout(200);
  await add("interest", { "#qa-t": "Origami" });
  await add("todo", { "#qa-t": "Buy chart paper" });
  await add("outing", { "#qa-t": "Zoo trip", "#qa-d": "2026-10-31" });
  await add("did", { "#qa-t": "Made rotis" });
  await add("went", { "#qa-t": "Planetarium" });
  await add("remind", { "#qa-t": "Pay the fees", "#qa-s": "09:00" });
  await add("rest", { "#qa-t": "Lunch", "#qa-s": "13:00" });
  await add("other", { "#qa-t": "Dentist", "#qa-s": "11:00" });
  await add("have", { "#qa-t": "Microscope, Lego" });
  out.addByHand = await p.evaluate(
    (B) => ({
      events: S.events.slice(B.ev).map((e) => [e.kind, e.title, e.rep, e.days.join(""), e.start || ""].join(" ")),
      todos: S.todos.slice(B.todo).map((t) => t.title),
      interest:
        intSt().list?.some?.((x) => /origami/i.test(x.name || x)) ?? JSON.stringify(intSt()).includes("Origami"),
      moments: S.moments.slice(B.mo).map((m) => m.kind + " " + m.title),
      shelf: S.inv.slice(B.inv).map((x) => x.name),
    }),
    before,
  );
  out.chatLocked = await p.$eval(".dump", (x) => x.classList.contains("locked"));
  console.log(JSON.stringify({ ...out, errs }, null, 1));
  await b.close();
})();
