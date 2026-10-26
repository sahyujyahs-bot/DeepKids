/* ---------- Today: greeting, then the day on the clock ---------- */
function itemDetail(it, date) {
  const isT = date === today;
  if (it.kind === "refresh")
    return `<p class="sm" style="font-weight:700">${esc(it.rf.title)}</p><p class="xs muted">A 15-minute return to ${esc(it.rf.u.title)}, then 3 quick questions.</p><div class="row"><button class="btn sm" data-act="refresh" data-date="${date}">${icon("play")}Play it</button></div>`;
  if (it.kind === "plan")
    return `<p class="sm" style="font-weight:700">${esc(it.sub)}</p><div class="row"><button class="btn sm" data-act="quickplan">Open the Planner</button></div>`;
  if (it.kind === "lesson") {
    const st = stepState(it),
      prep = prepFor(it.u, it.n, it.tot).filter((p) => p.lead === 0);
    return `<div class="sm muted" style="font-weight:700">${esc(it.u.book)}${chNo(it.u) ? " · " + chNo(it.u) : ""} · Part ${it.n} of ${it.tot}</div>
    <ol class="dsteps">${st.map((x) => `<li class="${x.ok ? "ok" : ""}"><span>${esc(x.label)}</span><b>${esc(x.title)}</b><i>${mins(x.mins)}</i></li>`).join("")}</ol>
    ${prep.length ? `<div class="sm"><b style="font-family:var(--display)">Have ready:</b> ${prep.map((p) => esc(p.task.replace(/^(Gather|Get) /, ""))).join(" · ")}</div>` : ""}
    <div class="row">${isT && !it.done ? `<button class="btn" data-act="play" data-id="${it.id}">${icon("play")}${st.some((x) => x.ok) ? "Keep going" : "Start the lesson"}</button>` : ""}${!isT || it.done ? `<button class="btn soft sm" data-act="chapter" data-k="${it.u.k}">Everything for this chapter</button>` : ""}${!it.done && !it.bonus ? `<button class="btn soft sm" data-act="swap" data-s="${it.s}">Swap topic</button>` : ""}${isT && !it.done ? (it.bonus ? `<button class="btn line sm" data-act="less" data-s="${it.s}">Not now</button>` : `<button class="btn line sm" data-act="skip" data-s="${it.s}">Not today</button>`) : ""}</div>${lessonExtras(it.u)}`;
  }
  if (it.kind === "prep") {
    const more = it.prep.length - 4;
    return `<div class="col" style="gap:0">${it.prep
      .slice(0, 4)
      .map(
        (p) =>
          `<div class="taskrow ${S.prep[p.id] ? "done" : ""}"><button class="ckb" data-act="prep" data-id="${p.id}" aria-label="Ready: ${esc(p.task)}">${icon("check")}</button><div><b style="font-weight:800">${esc(p.task)}</b>${p.early ? ` <span class="pill learning">early start for ${fmt(p.x.date)}</span>` : ""}<p class="xs muted">${SUBJ[p.x.subj]} · ${esc(p.x.u.title)} · from ${esc(p.where)}</p></div></div>`,
      )
      .join(
        "",
      )}</div><div class="row">${more > 0 ? `<button class="btn soft sm" data-act="tlopen" data-id="${it.id}" data-date="${date}">See all ${it.prep.length}</button>` : ""}${it.id === "pm" ? `<button class="btn" data-act="night">Get ready for tomorrow</button>` : `<button class="btn soft sm" data-act="tlopen" data-id="${it.id}" data-date="${date}">Parent guides</button>`}</div>`;
  }
  if (it.kind === "warm") {
    const du = dailyUnit();
    const j = du ? splitJoke(du.c.x.jokes[0]) : null;
    return `${j ? `<div class="ask"><span class="eyebrow">Joke 1</span>${esc(j[0])} <i>${esc(j[1])}</i></div>` : ""}<div class="row"><button class="btn" data-act="games">Jokes and games</button></div>`;
  }
  if (it.kind === "exps")
    return `<div class="col" style="gap:8px">${S.exps
      .filter((e) => !e.closed && e.start <= date)
      .map(
        (e) =>
          `<div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span class="sm" style="font-weight:800">${esc(e.title)}</span><button class="btn xs ${e.checks.includes(today) ? "soft" : ""}" data-act="check" data-e="${e.id}">${e.checks.includes(today) ? "Checked" : "Check"}</button></div>`,
      )
      .join("")}</div>`;
  if (it.kind === "event") {
    const e = it.ev;
    return `<p class="sm" style="font-weight:700">${clock(hm(e.start))} to ${clock(hm(e.end))} · ${ROLE[e.kind === "outing" ? "out" : e.who]}${e.rep === "weekly" ? " · every " + e.days.map((d) => DAYN[d]).join(", ") : ""}${e.note ? " · " + esc(e.note) : ""}</p><div class="row"><button class="btn line sm" data-act="delev" data-e="${e.id}">Remove</button></div>`;
  }
  if (it.kind === "todo")
    return `<p class="sm" style="font-weight:700">${esc(it.sub)}</p><div class="row"><button class="btn soft sm" data-act="todomove" data-t="${it.td.id}">Move to tomorrow</button><button class="btn line sm" data-act="tododel" data-t="${it.td.id}">Remove</button></div>`;
  return "";
}
function tRow(it, date, focus) {
  const col = it.kind === "lesson" ? SC(it.s) : "r-" + it.who,
    [hh, ap] = it.anytime ? ["Any", "time"] : it.done && it.doneNoTime ? ["Done", ""] : clock(it.at).split(" ");
  if (it.kind === "brk")
    return `<div class="tr brk"><span class="t num">${hh}<small>${ap}</small></span><span class="brkline">${esc(it.title)} · ${mins(it.dur / 60)}</span></div>`;
  const open = !!ui.open[it.id],
    missed = isMissed(it, date) && it !== focus,
    a = `data-id="${it.id}" data-date="${date}"`;
  const late = isMissed(it, date),
    tag =
      it === focus
        ? late
          ? `<span class="tag now">Pending</span>`
          : `<span class="tag now">${date === today && !it.anytime && it.at <= nowMin() && nowMin() < it.at + it.dur ? "Now" : "Up next"}</span>`
        : evPast(it, date)
          ? `<span class="tag miss">Did it happen?</span>`
          : snzd(it, date)
            ? `<span class="tag">Later today</span>`
            : missed
              ? `<span class="tag miss">Pending</span>`
              : "";
  return `<div class="tr ${col} ${it.done ? "done" : ""} ${it === focus ? "focus" : ""} ${missed ? "missed" : ""}"><span class="t num">${hh}<small>${ap}</small></span><div class="tcard"><span class="ic">${icon(KICO[it.kind] || "spark")}</span><button class="m plain" data-act="topen" data-id="${it.id}" aria-expanded="${open}"><b>${esc(it.kind === "lesson" ? chT(it.u) : it.title)}</b><span>${tag}${it.kind === "lesson" ? SUBJ[it.s] + " · " + (it.n ? `Part ${it.n}${it.tot ? " of " + it.tot : ""} · ` : "") : ""}${S.tl[date + "|" + it.id] === "skip" ? "skipped today" : S.tl[date + "|" + it.id] === "missed" ? "didn't happen" : it.skipped ? "skipped" : it.done && it.doneAt != null ? "done at " + clock(it.doneAt) : it.done && it.doneNoTime ? "done, time not recorded" : (it.kind === "event" && it.ev ? evShort(it.ev) : ROLE[it.who]) + " · " + mins(it.dur / 60)}</span></button><button class="ck" data-act="tlcheck" ${a} aria-label="${it.done ? "Done" : "Mark done"}: ${esc(it.title)}">${icon("check")}</button>${open ? `<div class="tdet">${itemDetail(it, date)}</div>` : ""}</div></div>`;
}
function timeline(date) {
  const items = dayPlan(date),
    f = focusOf(items, date);
  return items.length
    ? `<div class="tt compact">${items.map((i) => tRow(i, date, f)).join("")}</div>`
    : `<p class="note">Nothing planned for this day yet.</p>`;
}
const tomorrow = () => addDays(today, 1);
function nightItems() {
  const seen = new Set(),
    out = [];
  [...prepBlock(today, "pm"), ...prepBlock(tomorrow(), "am").filter((p) => p.lead === 0)].forEach((p) => {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      out.push(p);
    }
  });
  return out;
}
const nightDue = () => {
  const its = nightItems();
  return (
    S.setup &&
    !(S.night || {})[today] &&
    nowMin() >= hm(D().eveAt) &&
    (its.length > 0 || dayPlan(tomorrow()).some((i) => i.kind === "lesson"))
  );
};
const greetWord = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};
