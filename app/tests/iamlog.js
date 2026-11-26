/* What a family asks IAm is kept for them: each question goes to the server with a log note, and Settings shows it back and can delete it all */
const URL = process.argv[2] || "http://127.0.0.1:8765/app.html";
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch(),
    p = await (await b.newContext({ viewport: { width: 400, height: 860 } })).newPage(),
    out = [],
    check = (name, ok, extra) => out.push({ name, ok: !!ok, extra });
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
      board: "combined",
      subjects: ["sci"],
      levels: { sci: 3 },
      aiPlan: "on",
    });
    S.guide = { on: false };
    ob = null;
    window.__logs = [];
    window.__rows = [
      {
        id: "1",
        created_at: "2026-11-26T10:00:00Z",
        place: "the Today screen",
        question: "Why is the sky blue?",
        answer: "Good question. What colour is the sunset?",
      },
    ];
    window.claude = Object.freeze({
      use: async (n) =>
        n === "sample"
          ? Object.assign(
              async (input, o) => {
                window.__logs.push(o.log);
                return { text: "Let's find out. What do you see?" };
              },
              { json: async () => ({}), limits: async () => ({}) },
            )
          : n === "chats"
            ? {
                list: async () => window.__rows,
                clear: async () => {
                  window.__rows = [];
                },
              }
            : null,
    });
    render();
  });
  await p.waitForTimeout(300);
  await p.evaluate(async () => {
    fxChat("Today", null, null, "");
    await new Promise((r) => setTimeout(r, 300));
    const ta = document.querySelector("#fxChat textarea");
    ta.value = "Why do leaves fall?";
    await fxSend();
  });
  await p.waitForTimeout(500);
  check(
    "the question is sent with a log note",
    await p.evaluate(() => window.__logs[0]?.kind === "iam" && window.__logs[0]?.question === "Why do leaves fall?"),
    JSON.stringify(await p.evaluate(() => window.__logs)),
  );
  await p.evaluate(() => {
    document.getElementById("fxChat")?.close();
    openSheet({ mode: "settings" });
  });
  await p.waitForTimeout(400);
  check(
    "Settings has a place to read what was asked",
    await p.evaluate(() => !!document.querySelector('[data-act="iamlog"]')),
    "",
  );
  await p.evaluate(() => document.querySelector('[data-act="iamlog"]').click());
  await p.waitForTimeout(500);
  check(
    "it shows the questions and answers",
    await p.evaluate(() => document.getElementById("sheetBody").textContent.includes("Why is the sky blue?")),
    "",
  );
  await p.evaluate(() => document.querySelector('[data-act="iamclear"]').click());
  await p.waitForTimeout(300);
  check(
    "deleting asks once more first",
    await p.evaluate(
      () =>
        document.querySelector('[data-act="iamclear"]')?.textContent.includes("Yes, delete") &&
        window.__rows.length === 1,
    ),
    "",
  );
  await p.evaluate(() => document.querySelector('[data-act="iamclear"]').click());
  await p.waitForTimeout(400);
  check(
    "then it deletes everything",
    await p.evaluate(
      () => window.__rows.length === 0 && document.getElementById("sheetBody").textContent.includes("Nothing yet"),
    ),
    "",
  );
  let bad = 0;
  for (const r of out) {
    if (!r.ok) bad++;
    console.log((r.ok ? "ok   " : "FAIL ") + r.name + (r.ok ? "" : " (" + r.extra + ")"));
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
