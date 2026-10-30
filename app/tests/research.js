// Research for kids with made-up papers: the list, liking one (which reorders "Picked for you"), the flashcards,
// "We read it", and the weekly item on Today. Prints what it saw.
//   node app/tests/research.js http://127.0.0.1:8765/app.html
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
  await p.evaluate(() => {
    const K = ["q", "who", "how", "found", "sure", "why", "try", "think", "words"];
    const mk = (id, title, tags, topics) => ({
      id,
      title,
      blurb: "A short line about " + title,
      topics,
      tags,
      year: 2021,
      mins: 6,
      cover: { src: "media/ui/intro-family.jpg", alt: "", credit: "Test credit" },
      source: {
        name: "Frontiers for Young Minds",
        title: "Test article",
        authors: "A. Scientist",
        year: 2021,
        url: "https://kids.frontiersin.org/",
        license: "CC BY 4.0",
      },
      cards: K.map((k) =>
        k === "words"
          ? { k, t: "New words", words: [{ w: "colony", m: "a big group" }] }
          : {
              k,
              t: "Card " + k,
              b: "Body text for " + k + ". ".repeat(8),
              ...(k === "how" ? { img: { src: "media/ui/intro-journey.jpg", alt: "", credit: "Figure 1, test" } } : {}),
            },
      ),
    });
    DATA.research = [
      mk("ants", "Why don't ants get stuck in traffic?", ["ants", "insects"], ["sci.animals.invertebrates.L3"]),
      mk("moon", "Is there water on the Moon?", ["moon", "space"], ["sci.sky.moon-phases.L3"]),
      mk("bees", "Can bees count?", ["bees", "insects"], ["sci.animals.animal-minds.L3"]),
    ];
    tab = "today";
    render();
  });
  await p.waitForTimeout(300);
  const todayItem = await p.evaluate(() =>
    dayPlan(today)
      .filter((i) => i.kind === "paper")
      .map((i) => i.title),
  );
  await p.evaluate(() => {
    tab = "library";
    ui.lt = "research";
    render();
  });
  await p.waitForTimeout(400);
  await p.click('[data-act="rslike"][data-p="ants"]');
  await p.waitForTimeout(200);
  const order = await p.$$eval(".rscard b", (x) => x.map((e) => e.textContent));
  await p.click('[data-act="paper"][data-p="ants"]');
  await p.waitForTimeout(400);
  await p.click(".rsnav > button:last-child");
  await p.click(".rsnav > button:last-child");
  await p.waitForTimeout(300);
  await p.click(".rsdots button:last-child");
  await p.waitForTimeout(300);
  await p.click('[data-act="rsdone"]');
  await p.waitForTimeout(300);
  const after = await p.evaluate(() => ({
    read: S.rs.read,
    like: S.rs.like,
    today: dayPlan(today)
      .filter((i) => i.kind === "paper")
      .map((i) => i.title + " done=" + i.done),
    forYou: rsForYou().map((x) => x.id),
  }));
  console.log(JSON.stringify({ todayItem, order, after, errs }, null, 1));
  await b.close();
})();
