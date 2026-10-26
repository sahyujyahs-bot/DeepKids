/* ---------- Prep and the weekly buy-and-gather list from unit materials ---------- */
function fxPrep(u, n) {
  const D = fxDayPlan(u),
    day = D[Math.min(n, D.length) - 1] || [],
    out = [];
  day.forEach((p) =>
    (p[9] || []).forEach(([it, q, url], i) => {
      if (!it) return;
      out.push({
        id: `p|${u.k}|${p[0]}|${i}`,
        kind: url ? "buy" : "act",
        lead: url ? 2 : i === 0 && (p[5] || 1) > 1 ? 1 : 0,
        task: (url ? "Get: " : "Gather: ") + it + (q ? ` (${q})` : ""),
        where: url ? "Shop link in the lesson" : `For “${p[1]}”`,
        url,
      });
    }),
  );
  return out;
}
function fxWeekList() {
  const until = addDays(today, 7),
    seen = new Set(),
    buy = [],
    home = [];
  upcoming()
    .filter((x) => x.date >= today && x.date <= until && x.u.board === "unit")
    .forEach((x) =>
      fxPrep(x.u, x.n).forEach((p) => {
        const key = p.task;
        if (seen.has(key)) return;
        seen.add(key);
        (p.url ? buy : home).push({ ...p, date: x.date, lesson: x.u.title });
      }),
    );
  const row = (p) =>
    `<label class="row" style="gap:8px"><input type="checkbox" data-fxtick="${esc(p.id)}" ${S.prep[p.id] ? "checked" : ""}><span class="sm">${esc(p.task.replace(/^(Get|Gather): /, ""))} <span class="xs muted">· ${fmt(p.date)} · ${esc(p.lesson)}</span>${p.url ? ` <a target="_blank" rel="noopener" href="${esc(p.url)}">🛒</a>` : ""}</span></label>`;
  if (!buy.length && !home.length) return "";
  return `<section class="sec"><div class="sech"><h3>This week: buy and gather</h3></div>${buy.length ? `<p class="xs"><b>To buy</b></p>${buy.map(row).join("")}` : ""}${home.length ? `<p class="xs"><b>From home</b></p>${home.map(row).join("")}` : ""}<p class="xs muted">Each item also shows in the morning or evening prep the day it is needed.</p></section>`;
}
document.addEventListener(
  "change",
  (e) => {
    const c = e.target.closest("[data-fxtick]");
    if (!c) return;
    S.prep = { ...S.prep, [c.dataset.fxtick]: c.checked ? today : 0 };
    save();
  },
  true,
);

/* ---------- Bought books and games join the plan: the parts that use them become part of the core path ---------- */

document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest("[data-fxbought]");
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    const k = b.dataset.fxbought,
      B = (S.bought = S.bought || {});
    if (B[k]) delete B[k];
    else B[k] = today;
    commit();
    b.textContent = B[k] ? "✔ We have it: added to the plan" : "We bought it";
    toast(B[k] ? "Added. The parts that use it are now in the plan." : "Removed from the plan.");
  },
  true,
);

/* ---------- The week: each weekday is a full, half or free day (half = short lessons, free = no lessons) ---------- */
const FXWT0 = { 0: "free", 1: "full", 2: "full", 3: "full", 4: "full", 5: "full", 6: "half" };
const fxWT = (wd) => (S.weekType || FXWT0)[wd] || "full";
function fxWeekRow() {
  const N = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    L = { full: "Full", half: "Half", free: "Free" };
  return `<div class="field"><label>Your week (tap a day to change it)</label><div class="row" style="gap:6px;flex-wrap:wrap">${[1, 2, 3, 4, 5, 6, 0].map((d) => `<button class="chip fxwt-${fxWT(d)}" data-fxwt="${d}">${N[d]} · ${L[fxWT(d)]}</button>`).join("")}</div><p class="xs muted">Full: the whole plan. Half: short lessons. Free: no lessons that day.</p></div>
  <div class="field"><label>Sounds</label><button class="chip" data-fxsnd="1">${document.getElementById("snd")?.getAttribute("aria-label") === "Turn sound on" ? "🔇 Off" : "🔊 On"}</button></div><div class="field"><label>AI features (chat, checking a photo of a worksheet)</label><button class="chip" data-fxai="1">${fxAIOn() ? "🔓 Unlocked" : "🔒 Locked until you top up"}</button><p class="xs muted">Top-ups are not open yet. For testing you can unlock here.</p></div>`;
}
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest("[data-fxwt]");
    if (b) {
      e.preventDefault();
      e.stopPropagation();
      const d = +b.dataset.fxwt,
        nx = { full: "half", half: "free", free: "full" }[fxWT(d)];
      S.weekType = { ...(S.weekType || FXWT0), [d]: nx };
      commit();
      render();
      return;
    }
    const a = e.target.closest("[data-fxai]");
    if (a) {
      e.preventDefault();
      e.stopPropagation();
      S.aiPlan = fxAIOn() ? "" : "on";
      commit();
      render();
    }
  },
  true,
);

/* ---------- AI is shown everywhere it helps, but locked until the family tops up ---------- */
const fxAIOn = () => S.aiPlan === "on";
document.addEventListener(
  "click",
  (e) => {
    if (fxAIOn()) return;
    const b = e.target.closest('[data-fx="chat"],[data-fx="askcard"],[data-fx="photo"],.fxchat,#fxChat');
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    toast("🔒 This uses AI. It unlocks when you top up (coming soon). For testing: Plan → Pace → AI features.", 6000);
  },
  true,
);
new MutationObserver(() => document.body.classList.toggle("ai-locked", !fxAIOn())).observe(document.body, {
  childList: true,
});
document.body.classList.toggle("ai-locked", !fxAIOn());
