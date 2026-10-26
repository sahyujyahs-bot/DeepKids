/* ---------- come alive: day ring, streak, a little burst when something is done ---------- */
function streak() {
  const ds = new Set(S.log.filter((l) => l.kind !== "skipped").map((l) => l.date));
  let n = 0,
    d = ds.has(today) ? today : addDays(today, -1);
  while (ds.has(d)) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}
function dayRing() {
  const it = dayPlan(today).filter((i) => i.kind !== "brk" && OURS(i)),
    n = it.length,
    dn = it.filter((i) => i.done).length;
  if (!n) return "";
  const C = 2 * Math.PI * 16,
    p = dn / n,
    prev = ui.ringP ?? p;
  ui.ringP = p;
  setTimeout(animRings, 40);
  if (p === 1 && prev < 1 && Date.now() - lastTap < 5000 && !(S.cel || {})[today]) {
    S.cel = { [today]: 1 };
    setTimeout(() => {
      sfx("win");
      confetti();
      toast(`All done for today! ${S.child || ""} did great.`.replace(" !", "!"));
    }, 500);
    setTimeout(save, 0);
  }
  return `<span class="dring ${p === 1 ? "full" : ""}" title="${dn} of ${n} DeepKids items done today"><svg viewBox="0 0 40 40" width="40" height="40"><circle cx="20" cy="20" r="16" class="rbg"/><circle cx="20" cy="20" r="16" class="rfg" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - prev)}" data-to="${C * (1 - p)}"/></svg><b>${p === 1 ? "✓" : dn + "/" + n}</b></span>`;
}
function animRings() {
  document.querySelectorAll(".dring .rfg[data-to]").forEach((c) => {
    c.style.strokeDashoffset = c.dataset.to;
  });
}
const CHEER = ["Nice!", "Shabash!", "Well done!", "Lovely!", "One more done!", "Super!"];
function burst(x, y, txt) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const e = document.createElement("div");
  e.className = "burst";
  e.textContent = txt;
  e.style.left = x + "px";
  e.style.top = y + "px";
  document.body.appendChild(e);
  setTimeout(() => e.remove(), 900);
}
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest?.("[data-act]");
    if (!b) return;
    const a = b.dataset.act,
      done =
        a === "pdone" ||
        (a === "wkst" && b.dataset.to === "done") ||
        (a === "qz" && b.dataset.r === "1") ||
        a === "evsave" ||
        a === "iofin" ||
        a === "iodone" ||
        a === "drew" ||
        (a === "tlcheck" &&
          b.closest(".tr") &&
          !b.closest(".tr.done") &&
          !b.closest(".tr").querySelector('[data-id^="L-"]')) ||
        (a === "task" && !b.classList.contains("done"));
    if (!done) return;
    const r = b.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top, "✓ " + CHEER[Math.floor(Math.random() * CHEER.length)]);
    try {
      navigator.vibrate?.(15);
    } catch (_) {}
  },
  true,
);
document.getElementById("nav").addEventListener("click", (e) => {
  if (!e.target.closest("button[data-tab]")) return;
  const m = document.getElementById("main");
  m.classList.remove("enter");
  void m.offsetWidth;
  m.classList.add("enter");
  setTimeout(() => m.classList.remove("enter"), 700);
});

/* ---------- estimated time for a lesson part: planned minutes, adjusted to the family's own pace ---------- */
function paceFactor() {
  const R = (S.pace || [])
    .filter((p) => p.est > 0 && p.took > 0)
    .slice(-60)
    .map((p) => (p.took * 60) / p.est)
    .filter((r) => r > 0.2 && r < 4)
    .sort((a, b) => a - b);
  if (R.length < 5) return null;
  return Math.min(2, Math.max(0.5, R[Math.floor(R.length / 2)]));
}
function estMins(u, n, tot) {
  let m = 0;
  try {
    const st = stepState({ u, n, tot });
    m = st.filter((x) => !x.ok).reduce((a, x) => a + (x.mins || 0), 0) * 60;
  } catch (e) {}
  if (!m) m = lessonMins(u.subj, today);
  const f = paceFactor();
  return { m: Math.max(5, Math.round((m * (f || 1)) / 5) * 5), own: !!f };
}
const estTxt = (u, n, tot) => `≈ ${hmin(estMins(u, n, tot).m)}`;
