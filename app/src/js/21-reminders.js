/* ---------- reminders: a nudge when the day has free time and something is waiting ---------- */
function pendingWork() {
  const out = [],
    O = openWork();
  O.wsGoing.forEach((x) =>
    out.push({
      t: x.w.title,
      sub: `${chT(x.u)} · ${x.tot - x.ans} questions left`,
      m: Math.min(25, Math.max(5, Math.round((x.tot - x.ans) * 1.5))),
      act: `data-act="ws" data-k="${x.u.k}" ${x.w.id ? `data-w="${esc(x.w.id)}"` : ""}`,
      go: "Continue",
    }),
  );
  (S.todos || [])
    .filter((t) => !t.done && t.date <= today)
    .forEach((t) =>
      out.push({
        t: t.title,
        sub: t.date < today ? "To-do from " + fmt(t.date) : "To-do for today",
        m: 10,
        act: `data-act="told"`,
        go: "Open",
      }),
    );
  O.started.forEach((x) =>
    out.push({
      t: x.w.title || wkTitle(x.u, x.id, ""),
      sub: `${chT(x.u)} · started ${fmt(x.w.started)}`,
      m: 15,
      act: `data-act="todo"`,
      go: "Open",
    }),
  );
  O.wsMissed.forEach((x) =>
    out.push({
      t: x.w.title,
      sub: `${chT(x.u)} · not started`,
      m: Math.min(25, Math.max(8, Math.round(x.tot * 1.5))),
      act: `data-act="ws" data-k="${x.u.k}" ${x.w.id ? `data-w="${esc(x.w.id)}"` : ""}`,
      go: "Start",
    }),
  );
  return out;
}
function freeNow() {
  const nm = nowMin(),
    d = Dd(today),
    its = dayPlan(today).filter(
      (i) => i.kind !== "brk" && !i.anytime && !i.done && !evPast(i, today) && !snzd(i, today),
    );
  if (its.some((i) => i.at <= nm && nm < i.at + i.dur)) return 0;
  if (its.some((i) => OURS(i) && i.at + i.dur <= nm)) return 0;
  const nx = its.filter((i) => i.at > nm).sort((a, b) => a.at - b.at)[0],
    end = nx ? nx.at : Math.max(nm, hm(d.eveAt || "20:30"));
  return Math.max(0, Math.min(end - nm, 180));
}
const REM = () => S.rem || (S.rem = { nudge: true, notif: false });
function nudgeCard() {
  if (REM().nudge === false || (S.nudgeOff?.[today] || 0) > Date.now()) return "";
  const free = freeNow();
  if (free < 10) return "";
  const P = pendingWork()
    .filter((p) => p.m <= free)
    .slice(0, 2);
  if (!P.length) return "";
  return `<section class="card nudge-card"><div class="row" style="flex-wrap:nowrap;gap:10px">${blob("var(--sun)", 6, "wow", "nb", 'width="40" height="40"')}<div><b style="font:600 17px var(--display)">${free >= 120 ? "Free time now" : `${hmin(free)} free now`}. Finish one?</b><p class="xs muted">Nothing else is planned${free < 120 ? " until then" : ""}.</p></div></div>
    ${P.map((p) => `<div class="row nrow"><div style="flex:1;min-width:0"><b class="sm">${esc(p.t)}</b><br><span class="xs muted">${esc(p.sub)} · ≈ ${hmin(p.m)}</span></div><button class="btn sm" ${p.act}>${p.go}</button></div>`).join("")}
    <div class="row" style="gap:16px"><button class="link sm" data-act="nudgeoff">Not now</button><button class="link sm" data-act="rem">Reminders on my phone</button></div></section>`;
}
/* phone reminders go through the phone's own calendar: a repeating event with an alert */
function freeSlots(days = 7) {
  const out = [];
  for (let k = 0; k < days; k++) {
    const d = addDays(today, k),
      D0 = Dd(d),
      its = dayPlan(d)
        .filter((i) => i.kind !== "brk" && !i.anytime)
        .sort((a, b) => a.at - b.at),
      lo = hm(D0.start || "09:30"),
      hi = hm(D0.eveAt || "20:30") - 30;
    let cur = lo;
    const lastL = Math.max(lo, ...its.filter((i) => i.kind === "lesson").map((i) => i.at + i.dur));
    for (const i of [...its, { at: hi, dur: 0 }]) {
      if (i.at - cur >= 25 && cur >= lastL) {
        out.push({ d, at: Math.ceil(cur / 15) * 15 });
        break;
      }
      cur = Math.max(cur, i.at + i.dur);
    }
  }
  return out;
}
function suggestRemTime() {
  const dd = REM().days || [1, 2, 3, 4, 5],
    S2 = freeSlots(7).filter((x) => dd.includes(parse(x.d).getDay())),
    c = {};
  S2.forEach((x) => {
    c[x.at] = (c[x.at] || 0) + 1;
  });
  const best = Object.entries(c).sort((a, b) => b[1] - a[1] || a[0] - b[0])[0];
  return best ? clock24(+best[0]) : "16:30";
}
const BYD = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
function remLinks() {
  const R = REM(),
    t = R.time || suggestRemTime(),
    days = R.days || [1, 2, 3, 4, 5],
    [h, m] = t.split(":").map(Number),
    start = new Date(parse(today));
  start.setHours(h, m, 0, 0);
  if (start < new Date()) start.setDate(start.getDate() + 1);
  while (!days.includes(start.getDay())) start.setDate(start.getDate() + 1);
  const f = (d) =>
      `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`,
    end = new Date(start.getTime() + 20 * 6e4),
    rr = `RRULE:FREQ=WEEKLY;BYDAY=${days.map((x) => BYD[x]).join(",")}`,
    title = "DeepKids: a few minutes to finish what's open",
    body = "Open DeepKids to see what's waiting: worksheets, projects and anything you skipped.";
  let tz = "";
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {}
  const g = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${f(start)}/${f(end)}&details=${encodeURIComponent(body)}&recur=${encodeURIComponent(rr)}${tz ? "&ctz=" + encodeURIComponent(tz) : ""}`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DeepKids//Reminders//EN",
    "BEGIN:VEVENT",
    "UID:dk-rem-" + Date.now() + "@deepkids",
    "DTSTAMP:" + f(new Date()),
    "DTSTART:" + f(start),
    "DURATION:PT20M",
    rr,
    "SUMMARY:" + title,
    "DESCRIPTION:" + body,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:" + title,
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return { g, ics, t, days };
}
async function saveIcs() {
  const { ics } = remLinks(),
    name = "DeepKids reminder.ics";
  try {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast("Saved. Open it to add the reminder to your calendar.");
  } catch (e) {
    toast("Couldn't save the file here");
  }
}
function remView() {
  document.getElementById("sheetTitle").textContent = "Reminders";
  const R = REM(),
    L = remLinks(),
    NOK = typeof Notification !== "undefined";
  return `<p class="sm muted">DeepKids reminds you only when the day has free time and something is waiting to be finished.</p>
  <section class="card"><span class="eyebrow">On your phone</span><b style="font:600 18px var(--display)">A daily reminder in your calendar</b><p class="xs muted">Your phone's calendar alerts you, even when DeepKids is closed. We picked a time that's usually free in your plan.</p>
    <div class="row" style="gap:10px;align-items:center"><label class="sm">At <input class="inp" type="time" data-remf="time" value="${L.t}" style="width:auto;height:40px"></label></div>
    <div class="dpick">${[1, 2, 3, 4, 5, 6, 0].map((d) => `<button aria-pressed="${L.days.includes(d)}" data-act="remday" data-d="${d}">${DAYS3[d]}</button>`).join("")}</div>
    <div class="row" style="gap:10px;flex-wrap:wrap"><a class="btn accent sm" href="${esc(L.g)}" target="_blank" rel="noopener">Add to Google Calendar</a><button class="btn soft sm" data-act="remics">Apple or other calendar</button></div>
    <p class="xs muted">Google Calendar opens with the reminder filled in: tap Save. Changed the time? Delete the old one in your calendar and add again.</p></section>
  <section class="card"><span class="eyebrow">While DeepKids is open</span><label class="zrow"><input type="checkbox" data-remck="notif" ${R.notif && NOK && Notification.permission === "granted" ? "checked" : ""} ${NOK ? "" : "disabled"}><span><b class="sm">Pop-up when there's free time</b><br><span class="xs muted">${NOK ? "Even if you've switched to another app, as long as DeepKids is still open." : "This phone or view doesn't allow pop-ups from DeepKids."}</span></span></label>
    <label class="zrow"><input type="checkbox" data-remck="nudge" ${R.nudge !== false ? "checked" : ""}><span><b class="sm">A card on Today when you open the app</b><br><span class="xs muted">Shows one or two things that fit the free time.</span></span></label></section>`;
}
let lastNote = 0;
setInterval(() => {
  try {
    if (
      !S?.rem?.notif ||
      typeof Notification === "undefined" ||
      Notification.permission !== "granted" ||
      !document.hidden
    )
      return;
    if (Date.now() - lastNote < 2 * 36e5) return;
    const free = freeNow(),
      P = pendingWork().filter((p) => p.m <= free);
    if (free < 15 || !P.length) return;
    lastNote = Date.now();
    new Notification("DeepKids · " + hmin(free) + " free", {
      body: `Finish “${P[0].t}”? About ${hmin(P[0].m)}.`,
      tag: "dk-nudge",
    });
  } catch (e) {}
}, 5 * 6e4);
