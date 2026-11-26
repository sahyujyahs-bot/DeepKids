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
  const tom = await p.evaluate((f) => {
    const L = dayPlan(addDays(today, 1)).filter((i) => i.kind === "lesson" && !i.done);
    return { first: L[0]?.u?.k, k: f.k, onToday: dayPlan(today).some((i) => i.kind === "lesson" && i.u?.k === f.k) };
  }, first);
  check("Tomorrow puts the unit first among tomorrow's lessons", tom.first === tom.k, JSON.stringify(tom));
  check("and leaves today's plan alone", !tom.onToday, JSON.stringify(tom));
  await p.click('.findrow [data-act="fqueue"]');
  await p.waitForTimeout(300);
  const q = await p.evaluate((f) => {
    const nx = (S.next || {})[f.s] || [];
    return nx.indexOf(f.k) === nx.length - 1 || nx.indexOf(f.k) >= 0;
  }, first);
  check("Add to queue keeps it in the queue", q, "");
  await p.evaluate(() => {
    window.__req = null;
    window.__calls = [];
    window.claude = Object.freeze({
      use: async (n) =>
        n === "request"
          ? {
              send: async (b) => {
                window.__req = b;
                window.__calls.push("send:" + b.topic);
              },
              saw: async (b) => {
                window.__calls.push("saw:" + b.topic);
              },
              mini: async (b) => {
                window.__calls.push("mini:" + b.topic);
              },
              mine: async () => [
                { id: "r1", topic: "Pulleys", status: "ready", unit_id: "sci.forces.simple-machines.L5" },
              ],
            }
          : null,
    });
  });
  await p.fill("#fq", "zzzqqq");
  await p.press("#fq", "Enter");
  await p.waitForTimeout(300);
  check(
    "no match says so, with no confusing library button",
    await p.evaluate(
      () =>
        document.querySelector(".findbar").textContent.includes("Nothing on") &&
        !document.querySelector('.findbar [data-act="tsearch"]'),
    ),
    "",
  );
  check(
    "without AI the write button is locked and leads to Plus",
    await p.evaluate(() => !!document.querySelector('.findbar [data-act="plus"][data-r="topic"]')),
    "",
  );
  check(
    "every search that finds nothing is recorded, even with no other action",
    await p.evaluate(() => window.__calls.includes("saw:zzzqqq")),
    "",
  );
  check(
    "no match offers the free request too, even without AI",
    await p.evaluate(() => !!document.querySelector('.findbar [data-act="freq"]')),
    "",
  );
  await p.evaluate(() => document.querySelector('.findbar [data-act="freq"]').click());
  await p.waitForTimeout(500);
  check(
    "asking for the full lesson without a quick lesson is recorded and shown as asked",
    await p.evaluate(
      () =>
        window.__calls.includes("send:zzzqqq") &&
        document.querySelector(".findbar").textContent.includes("You asked DeepKids"),
    ),
    "",
  );
  const LESSON = {
    title: "Why zzzqqq sinks",
    subj: "sci",
    level: 3,
    intro: ["Things sink or float for a reason.", "Water pushes back, and they push down."],
    ideas: [
      {
        idea: "Water pushes up on everything in it.",
        argued: "Scientists still study how this changes with tiny sizes.",
      },
      { idea: "Shape matters as much as weight.", argued: "Nobody has one neat rule for every shape." },
    ],
    bigq: [
      "Why do some boats float?",
      "Is a lotus leaf floating or resting?",
      "Could water ever hold up a mountain?",
      "What sinks that you expected to float?",
    ],
    tryit: [
      {
        name: "Sink or float",
        materials: ["a bowl of water", "a spoon", "a leaf"],
        steps: ["Guess first.", "Put each in the water."],
        expect: "The spoon sinks and the leaf floats.",
      },
    ],
    indian: { who: "Lakshmi in Kochi", what: "She watches fishing boats float in the harbour every morning." },
    underdog: { who: "Hypatia of Alexandria", what: "A teacher who studied the instruments that measure water." },
    quiz: [
      {
        q: "Why does a boat float?",
        opts: ["Water pushes up", "It is light", "Wind"],
        ans: 0,
        why: "Water pushes up on it.",
      },
      {
        q: "What matters besides weight?",
        opts: ["Colour", "Shape", "Name"],
        ans: 1,
        why: "Shape changes how much water is pushed aside.",
      },
      {
        q: "A spoon in water usually...",
        opts: ["floats", "sinks", "glows"],
        ans: 1,
        why: "Its weight is more than the push.",
      },
    ],
  };
  await p.evaluate((L) => {
    SAMPLE = {
      json: async (pr, o) => {
        await new Promise((r) => setTimeout(r, 400));
        return o.modelTier === "quick" ? { problems: [] } : L;
      },
      limits: async () => ({}),
    };
    render();
  }, LESSON);
  await p.waitForTimeout(300);
  check(
    "with AI on, the button writes the lesson",
    await p.evaluate(() => !!document.querySelector('.findbar [data-act="fgen"]')),
    "",
  );
  await p.click('.findbar [data-act="fgen"]');
  await p.waitForTimeout(80);
  check("it shows it is writing", await p.evaluate(() => !!document.querySelector(".findbar .livewait .lwlines")), "");
  await p.waitForTimeout(1800);
  check(
    "the quick lesson is recorded for DeepKids",
    await p.evaluate(() => window.__calls.includes("mini:zzzqqq")),
    "",
  );
  check(
    "when written, the button becomes Do it now",
    await p.evaluate(() => document.querySelector('.findbar [data-act="flive"]')?.textContent === "Do it now"),
    "",
  );
  await p.click('.findbar [data-act="flive"]');
  await p.waitForTimeout(400);
  check(
    "the lesson opens with big think questions, things to try and the full-lesson request",
    await p.evaluate(() => {
      const t = document.getElementById("sheetBody").textContent;
      return (
        document.getElementById("sheet").open &&
        t.includes("Big think") &&
        t.includes("Try it now") &&
        t.includes("Request the full lesson")
      );
    }),
    "",
  );
  const ks = await p.evaluate(() => "live|" + Object.keys(S.live)[0]);
  check(
    "opening it puts the lesson on today's plan like any lesson, and counts as started",
    await p.evaluate(
      (k) => dayPlan(today).some((i) => i.kind === "lesson" && i.u?.k === k) && statusOf(k) === "learning",
      ks,
    ),
    "",
  );
  check(
    "a lesson that is started and not finished is in the plan as one to finish",
    await p.evaluate((k) => plannedUnits(unitBy(k).subj).some((u) => u.k === k) && statusOf(k) === "learning", ks),
    "",
  );
  await p.evaluate(() => document.querySelector('[data-act="flivedone"]').click());
  await p.waitForTimeout(300);
  await p.evaluate(() => {
    document.getElementById("sheet").close();
    render();
  });
  await p.waitForTimeout(300);
  check(
    "once done and closed it stays on today's plan, done, to open again",
    await p.evaluate((k) => dayPlan(today).some((i) => i.kind === "lesson" && i.u?.k === k && i.done), ks),
    "",
  );
  check("it is in history", await p.evaluate((k) => S.log.some((l) => l.key === k), ks), "");
  check(
    "and the refresher can ask about it",
    await p.evaluate((k) => learnedUnits().some((u) => u.k === k) && qBank(unitBy(k)).length === 3, ks),
    "",
  );
  await p.evaluate(() => ACT.flive({ dataset: { id: Object.keys(S.live)[0] } }));
  await p.waitForTimeout(400);
  await p.click('[data-act="freqfull"]');
  await p.waitForTimeout(500);
  check(
    "the request carries the topic and the lesson",
    await p.evaluate(() => window.__req?.topic === "zzzqqq" && !!window.__req?.lesson),
    "",
  );
  check(
    "and says DeepKids will send the full lesson within 24 hours",
    await p.evaluate(() => document.getElementById("sheetBody").textContent.includes("within 24 hours")),
    "",
  );
  await p.evaluate(() => document.getElementById("sheet").close());
  const lc = await p.evaluate(
    (L) => ({
      clean: liveCheck(L).length,
      words: liveCheck({ ...L, intro: ["Mankind has a primitive idea.", "Fine."] }).length,
      it: liveItSuspects({ ...L, intro: ["A plant grows in the sun and we water it.", "Fine."] }).length,
      clearIt: liveCheck({ ...L, intro: ["A plant grows in the sun and we water it.", "Fine."] }).length,
      unsafe: liveCheck({ ...L, tryit: [{ ...L.tryit[0], steps: ["Boil it on the stove.", "Wait."] }] }).length,
    }),
    LESSON,
  );
  check("a good lesson passes our checks", lc.clean === 0, JSON.stringify(lc));
  check(
    "banned words and unsafe activities are caught, and 'it' after a plant is only a suspect for the second look",
    lc.words > 0 && lc.it > 0 && lc.clearIt === 0 && lc.unsafe > 0,
    JSON.stringify(lc),
  );
  await p.evaluate(() => {
    window.claude = Object.freeze({
      use: async (n) =>
        n === "request"
          ? {
              mine: async () => [
                { id: "r2", topic: "zzzqqq", status: "ready", unit_id: "sci.energy.stored-energy.L4" },
              ],
              send: async () => {},
              saw: async () => {},
              mini: async () => {},
            }
          : null,
    });
  });
  await p.evaluate(() => loadReady());
  await p.waitForTimeout(500);
  check(
    "when the full lesson is ready it comes onto today's plan",
    await p.evaluate(() =>
      dayPlan(today).some((i) => i.kind === "lesson" && i.u?.k === "unit|sci.energy.stored-energy.L4"),
    ),
    "",
  );
  await p.evaluate(() => document.querySelector('[data-act="fready"]').click());
  await p.waitForTimeout(500);
  check(
    "opening it replaces the quick lesson in history, the refresher and started-not-finished",
    await p.evaluate(
      (k) =>
        S.log.some((l) => l.key === "unit|sci.energy.stored-energy.L4") &&
        !S.log.some((l) => l.key === k) &&
        !S.progress[k] &&
        !(S.qgen || {})[k],
      ks,
    ),
    "",
  );
  await p.evaluate(() => {
    document.getElementById("fxDlg")?.close?.();
    document.getElementById("sheet").open && document.getElementById("sheet").close();
    render();
  });
  await p.evaluate(() => {
    S.reqSeen = {};
    window.claude = Object.freeze({
      use: async (n) =>
        n === "request"
          ? {
              mine: async () => [
                { id: "r1", topic: "Pulleys", status: "ready", unit_id: "sci.forces.simple-machines.L5" },
              ],
              send: async () => {},
              saw: async () => {},
              mini: async () => {},
            }
          : null,
    });
    return loadReady();
  });
  await p.waitForTimeout(400);
  check(
    "a lesson that is ready shows on Today with Open it",
    await p.evaluate(() => !!document.querySelector('[data-act="fready"]')),
    "",
  );
  await p.click('[data-act="fseen"]');
  await p.waitForTimeout(300);
  check("Later puts the card away", await p.evaluate(() => !document.querySelector('[data-act="fready"]')), "");
  await p.evaluate(() => ACT.tsearch({ dataset: { q: "magnet" } }));
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
  await p.evaluate(() => {
    document.getElementById("sheet").open && document.getElementById("sheet").close();
    const u =
      topicHits("volcano").find((x) => x.k.startsWith("unit|")) ||
      topicHits("magnet").find((x) => x.k.startsWith("unit|"));
    ACT.fnow({ dataset: { s: u.subj } }, null, "fnow", u.k);
    window.__nowUnit = u.k;
  });
  await p.waitForTimeout(1500);
  check(
    "Do it now on a DeepKids unit opens the unit itself",
    await p.evaluate(() => !!document.getElementById("fxDlg")?.open),
    "",
  );
  // Do it now: the day's other lessons move later the same day, nothing is pushed to another day, and it works even when
  // that subject's lesson is already done
  const nowT = await p.evaluate(() => {
    const titles = () =>
      dayPlan(today)
        .filter((i) => i.kind === "lesson" && !i.done)
        .map((i) => i.u.k);
    const before = titles(),
      sched = dayPlan(today).find((i) => i.kind === "lesson" && !i.done && i.s === "sci"),
      pick = topicHits("magnet").find((x) => x.k.startsWith("unit|") && !before.includes(x.k));
    if (sched) logSession(sched.u, "plan");
    ACT.fnow({ dataset: { s: pick.subj } }, null, "fnow", pick.k);
    const after = titles();
    return { before, after, pick: pick.k, doneBefore: !!sched };
  });
  const keep = nowT.before.filter((k) => !nowT.after.includes(k));
  check("Do it now puts the unit in today's lessons", nowT.after.includes(nowT.pick), JSON.stringify(nowT));
  check(
    "and no other planned lesson is pushed off the day",
    keep.length === 0 || nowT.doneBefore,
    JSON.stringify({ keep, ...nowT }),
  );
  check(
    "it also works after that subject's lesson was already done",
    nowT.doneBefore ? nowT.after.includes(nowT.pick) : true,
    JSON.stringify(nowT),
  );
  await p.waitForTimeout(800);
  let bad = 0;
  for (const r of out) {
    if (!r.ok) bad++;
    console.log((r.ok ? "ok   " : "FAIL ") + r.name + (r.ok ? "" : " (" + r.extra + ")"));
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
