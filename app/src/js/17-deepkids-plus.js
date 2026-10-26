/* ---------- DeepKids Plus: locked AI features open the upgrade; a message that needs AI is kept and read right after upgrading ---------- */
const PLUSR = {
  photo: "Reading photos and screenshots",
  chat: "Understanding longer messages",
  shelf: "Sorting your shelf from photos",
  test: "Entrance test papers",
  topic: "Exploring new topics",
};
const lockBtn = (r, cls, label) =>
  `<button class="${cls} locked" data-act="plus" data-r="${r}" aria-label="${esc(PLUSR[r])}: part of DeepKids Plus">${label}<span class="lk">🔒</span></button>`;
function plusView() {
  const r = ui.sheet?.r,
    pend = S.pendAI;
  document.getElementById("sheetTitle").textContent = "DeepKids Plus";
  const waiting = !!S.plusWait;
  return `<div class="exdone">${blob("var(--sun)", 6, "wow", "", 'width="76" height="76"')}<h2 style="font-size:24px">DeepKids Plus</h2>${r ? `<p class="sm"><b>${esc(PLUSR[r] || "")}</b> is part of Plus.</p>` : ""}</div>
  <ul class="pluslist"><li>📷 Send photos and screenshots of timetables, WhatsApp messages, notes and receipts; they go straight into your plan</li><li>💬 Write the way you talk: long or mixed-up messages are understood</li><li>🏷️ Photos of work are matched to the right chapter automatically</li><li>📚 Shelf photos become a tagged home library</li><li>📝 Entrance test papers for any board and class</li><li>🔎 Explore any new topic, with lesson plans written for you</li></ul>
  ${pend ? `<div class="ask"><span class="eyebrow">Your message is kept</span>“${esc(pend.text.slice(0, 160))}${pend.text.length > 160 ? "…" : ""}”<br><span class="xs muted">As soon as Plus is on, DeepKids reads it. No need to type it again.</span></div>` : ""}
  <div class="col" style="gap:10px;margin-top:12px"><button class="btn accent" data-act="plusgo" ${waiting && !window.DK_PLATFORM?.upgrade ? "disabled" : ""}>${waiting && !window.DK_PLATFORM?.upgrade ? "You're on the list ✓" : "Upgrade to Plus"}</button><button class="btn line sm" data-act="texit">Not now</button></div>
  ${waiting && !window.DK_PLATFORM?.upgrade ? `<p class="xs muted" style="text-align:center">Plus opens soon. We'll let you know here as soon as it does.</p>` : ""}`;
}
async function plusGo() {
  const P = window.DK_PLATFORM;
  if (P?.upgrade) {
    let ok = false;
    try {
      ok = await P.upgrade({ reason: ui.sheet?.r || "" });
    } catch (e) {}
    if (ok) {
      await afterUpgrade();
      return;
    }
    toast("Payment didn't go through. Nothing was charged.");
    return;
  }
  S.plusWait = S.plusWait || Date.now();
  sfx("ok");
  toast("You're on the list. Plus opens soon.");
  commit();
}
async function afterUpgrade() {
  try {
    SAMPLE = (await window.claude?.use?.("sample")) || null;
    const l = SAMPLE ? await SAMPLE.limits().catch(() => null) : null;
    IMGOK = !!l?.images;
  } catch (e) {}
  sfx("win");
  confetti();
  toast("Welcome to DeepKids Plus!");
  if (ui.sheet) goBack();
  if (S.pendAI && SAMPLE) {
    const t = S.pendAI.text;
    tab = "week";
    ui.seg = { ...(ui.seg || {}), week: "tell" };
    ui.dump = { text: t, chat: [] };
    delete S.pendAI;
    commit();
    setTimeout(() => {
      const ta = document.getElementById("dumpText");
      if (ta) ta.value = t;
      runDump();
    }, 300);
  } else commit();
}
/* a message the phone can't read well: too long, nothing found, or sentences that aren't plans */
function needsAI(text, R) {
  if (!R.items.length) return true;
  if (text.length > 280) return true;
  return R.items.some((x) => x.type !== "have" && x.title.split(" ").length > 5);
}
const clearItem = (x) =>
  x.type === "have" ||
  (x.title.split(" ").length <= 4 &&
    !/\b(said|might|maybe|thing|stuff|sometimes|basically|figure|think|probably|soon)\b/i.test(x._src || "") &&
    (x.start || x.days || (x.date && x.type !== "todo") || TODOW.test(x._src || "")));
function localDump(text) {
  const D_ = (ui.dump = ui.dump || {});
  const R0 = localParse(text),
    hard = needsAI(text, R0),
    R = hard ? { items: R0.items.filter(clearItem), asks: [] } : R0;
  if (hard) {
    const keep = new Set(R.items);
    R.asks = R0.asks.filter((a) => keep.has(R0.items[a.i])).map((a) => ({ ...a, i: R.items.indexOf(R0.items[a.i]) }));
  }
  if (hard) {
    S.pendAI = { text, at: Date.now() };
    save();
  }
  D_.needAI = hard;
  if (!R.items.length) {
    D_.err = "";
    D_.items = D_.items || null;
    sfx("tap");
    render();
    return;
  }
  D_.local = true;
  D_.items = [...(D_.items || []), ...R.items];
  const base = D_.items.length - R.items.length;
  D_.asks = [...(D_.asks || []), ...R.asks.map((a) => ({ ...a, i: a.i + base }))];
  D_.questions = D_.asks.map((a) => a.q);
  D_.err = "";
  clearIn("dumpText");
  sfx("ok");
  render();
}
const needAICard = (D_) =>
  D_.needAI && !SAMPLE
    ? `<div class="needai"><span class="lk">🔒</span><div><b>${D_.items?.length ? "Some of this needs DeepKids Plus to read properly." : "This needs DeepKids Plus to read."}</b><p class="xs muted">${D_.items?.length ? "We picked out what we could above. " : ""}Your message is kept. After upgrading, DeepKids reads it right away.</p></div><button class="btn sm accent" data-act="plus" data-r="chat">Upgrade</button></div>`
    : "";
