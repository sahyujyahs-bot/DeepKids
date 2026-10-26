/* ---------- Today, top of the page (founder's inspiration: a week strip, two goal tiles, continue learning, subject tiles) ---------- */
function fxTodayTop() {
  const wd = parse(today).getDay(),
    mon = addDays(today, -((wd + 6) % 7));
  let planned = 0,
    doneM = 0;
  for (let i = 0; i < 7; i++) {
    const d = addDays(mon, i);
    if (d >= today)
      dayPlan(d)
        .filter((x) => x.kind === "lesson" && !x.done)
        .forEach((x) => (planned += x.dur));
  }
  S.log
    .filter((l) => l.date >= mon && l.date <= today && l.kind !== "skipped")
    .forEach((l) => {
      const m = lessonMins(l.subj, l.date);
      doneM += m;
      planned += m;
    });
  const units = Object.keys(DATA.units || {}).map((id) => ({
    id,
    st: fxUnitSt("unit|" + id),
    t: Object.values(fxSt().time[id] || {}).reduce((a, b) => a + b, 0),
  }));
  const going = units.filter((x) => x.st === "learning").sort((a, b) => b.t - a.t),
    doneU = units.filter((x) => rank[x.st] >= 2).length;
  const tiles = `<div class="fxgoals"><div class="fxgoal"><b>${Math.round(doneM)}<small> / ${Math.round(planned)} min</small></b><span>learned this week</span></div><div class="fxgoal"><b>${doneU}<small> done · ${going.length} going</small></b><span>units</span></div></div>`;
  const c = going[0];
  let cont = "";
  if (c) {
    const I = DATA.units[c.id],
      X = fxStates(c.id),
      pct = Math.round((100 * X.filter((z) => z === "done").length) / Math.max(1, X.length));
    cont = `<button class="fxcont" data-act="fxopen" data-u="${esc(c.id)}"><img src="${esc(I.img?.summary || "media/ui/subj-" + (c.id.split(".")[0] === "sci" ? "sci" : "dks") + ".jpg")}" alt=""><span><span class="xs muted">Continue learning</span><b>${esc(I.title)}</b><span class="fxbar"><i style="width:${pct}%"></i></span><span class="xs muted">${pct}% done</span></span></button>`;
  }
  const L = dayPlan(today).filter((x) => x.kind === "lesson"),
    pic = !L.length
      ? ["empty-rest", "No lessons today. Rest, play outside, wonder about something."]
      : L.every((x) => x.done)
        ? ["empty-done", "All of today's lessons are done. Well learned!"]
        : null;
  const em = pic ? `<div class="fxempty"><img src="media/ui/${pic[0]}.jpg" alt=""><p>${pic[1]}</p></div>` : "";
  return `<section class="sec fxtoday">${tiles}${em}${cont}</section>`;
}
