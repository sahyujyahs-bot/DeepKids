/* Khan Academy videos ride along with a unit: the built unit carries them, and the video card shows the player */
const URL = process.argv[2] || "http://127.0.0.1:8765/app.html";
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch(),
    p = await (await b.newContext()).newPage(),
    out = [],
    check = (name, ok, extra) => out.push({ name, ok: !!ok, extra });
  await p.goto(URL);
  await p.waitForTimeout(500);
  const r = await p.evaluate(async () => {
    const u = await (await fetch("units/sci.energy.stored-energy.L4.json")).json();
    const none = await (await fetch("units/sci.air.air-around-us.L1.json")).json();
    return {
      n: (u.khan || []).length,
      own: u.videos.length,
      none: (none.khan || []).length,
      card: (u.khan || [])[0] ? fxVidCard(u.khan[0], "More to watch") : "",
    };
  });
  check(
    "a unit with a matching Khan video carries it, beside its own three",
    r.n > 0 && r.own === 3,
    JSON.stringify(r),
  );
  check(
    "the card has the player and the More to watch eyebrow",
    r.card.includes("data-yt=") && r.card.includes("More to watch"),
    "",
  );
  check("a unit with no good match carries none", r.none === 0, r.none);
  let bad = 0;
  for (const x of out) {
    if (!x.ok) bad++;
    console.log((x.ok ? "ok   " : "FAIL ") + x.name + (x.ok ? "" : " (" + x.extra + ")"));
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
