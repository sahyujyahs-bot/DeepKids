// My books: a photo of a book page becomes lessons (with a stand-in for the AI), and those lessons open as chapters,
// give quiz questions, and can be added to the plan.
//   node app/tests/mybooks.js http://127.0.0.1:8765/app.html
const { chromium } = require("playwright");
const URL = process.argv[2] || "http://127.0.0.1:8765/app.html";
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==",
  "base64",
);
(async () => {
  const b = await chromium.launch(),
    p = await (await b.newContext({ viewport: { width: 400, height: 860 } })).newPage(),
    errs = [],
    out = [];
  p.on("pageerror", (e) => errs.push(e.message));
  p.on("dialog", (d) => d.accept());
  await p.goto(URL);
  await p.waitForTimeout(300);
  await p.fill("#lgPhone", "81234 56789");
  await p.fill("#lgName", "S");
  await p.click('[data-act="login"]');
  await p.waitForTimeout(300);
  await p.evaluate(() => {
    Object.assign(S, {
      setup: true,
      child: "Liri",
      age: 8,
      board: "ncert",
      subjects: ["sci", "math"],
      levels: { sci: 3, math: 3 },
    });
    S.guide = { on: false };
    ob = null;
    // a stand-in for the AI: first the list of lessons, then each lesson
    let calls = 0;
    const lesson = (t) => ({
      title: t,
      summary: "How seeds grow into plants.",
      goals: ["By the end your child can say what a seed needs to grow."],
      words: [["seed", "the part of a plant that grows into a new plant"]],
      days: [
        {
          n: 1,
          title: "Seeds",
          goal: "Look at seeds",
          steps: [{ kind: "read", title: "Read page 2", mins: 10, do: "Read page 2 aloud." }, { kind: "bad" }],
        },
      ],
      worksheets: [
        {
          title: "Seeds",
          sections: [
            [
              "A. Seeds",
              [
                { t: "mcq", p: "What does a seed need?", opts: ["Water", "Sand"], a: 0 },
                { t: "mcq", p: "broken", opts: ["x"], a: 5 },
              ],
            ],
          ],
        },
      ],
      check: [
        { q: "What does a seed need to grow?", a: "Water, air and warmth." },
        { q: "Where is the new plant?", a: "Inside the seed." },
      ],
    });
    SAMPLE = {
      json: async () =>
        calls++ === 0
          ? {
              lessons: [
                { title: "Seeds", pages: "1-2" },
                { title: "Roots", pages: "3-4" },
              ],
            }
          : lesson(calls === 2 ? "Seeds" : "Roots"),
      limits: async () => ({ images: true }),
    };
    tab = "library";
    ui.lt = "mine";
    render();
  });
  await p.setInputFiles("#mbFile", { name: "plants.png", mimeType: "image/png", buffer: PNG });
  await p.waitForTimeout(200);
  await p.selectOption("#mbSubj", "sci");
  await p.click('[data-act="mbmake"]');
  await p.waitForTimeout(800);
  const r = await p.evaluate(() => {
    const L = myBookItems();
    return {
      lessons: L.map(
        (u) =>
          `${u.title}: ${u.c.p.days.length} day, ${u.c.p.days[0].steps.length} step, ${u.c.p.worksheets[0].sections[0][1].length} worksheet question, ${u.c.p.check.length} questions`,
      ),
      found: !!unitByK(L[0]?.k),
      bank: qBank(L[0]).length,
      shown: document.getElementById("main").innerText.includes("Seeds"),
    };
  });
  out.push(JSON.stringify(r));
  await p.click('[data-act="chapter"][data-k^="mine|"]');
  await p.waitForTimeout(500);
  out.push(
    "chapter sheet: " +
      (await p.evaluate(
        () => sheet.open && document.getElementById("sheetBody").innerText.slice(0, 120).replace(/\s+/g, " "),
      )),
  );
  await p.evaluate(() => sheet.close());
  await p.click('[data-act="mbplan"]');
  await p.waitForTimeout(300);
  out.push(
    "in the plan: " +
      (await p.evaluate(() => {
        const k = myBookItems()[0].k;
        return (S.extra.sci || []).includes(k) + " | scheduled: " + plannedUnits("sci").some((u) => u.k === k);
      })),
  );
  console.log(out.join("\n"));
  console.log("errors", errs.length ? errs.join(" | ") : "none");
  await b.close();
})();
