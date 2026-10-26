/* Today */
const OURS = (i) => !["event", "todo", "prep", "plan"].includes(i.kind);
const snzd = (i, date) => (S.snz?.[date + "|" + i.id] || 0) > nowMin();
const evPast = (i, date) => i.kind === "event" && !i.done && !i.anytime && date === today && i.at + i.dur <= nowMin();
function pastEvCard(items) {
  const P = items.filter((i) => evPast(i, today));
  if (!P.length) return "";
  return `<section class="card pastev"><span class="eyebrow">Did ${P.length > 1 ? "these" : "this"} happen?</span>${P.map((i) => `<div class="row" style="flex-wrap:nowrap;gap:10px;align-items:center"><div style="flex:1;min-width:0"><b>${esc(i.title)}</b><br><span class="xs muted">${clock(i.at)}${i.ev?.end ? "–" + clock(hm(i.ev.end)) : ""} · ${esc(evShort(i.ev))}</span></div><button class="btn green xs" data-act="tlcheck" data-id="${i.id}" data-date="${today}">Done</button><button class="btn line xs" data-act="evmiss" data-id="${esc(i.ev.id)}" data-date="${today}">Didn't happen</button></div>`).join("")}</section>`;
}
function ioptsView() {
  const { date, id } = ui.sheet,
    it = dayPlan(date).find((i) => i.id === id);
  if (!it) return `<p class="note">That's no longer on the plan.</p>`;
  const L = it.kind === "lesson",
    title = L ? chT(it.u) : it.title,
    day = date === today ? "today" : fmt(date);
  document.getElementById("sheetTitle").textContent = title;
  const a = (act, label, sub, cls = "line", extra = "") =>
    `<button class="iopt ${cls}" data-act="${act}" data-id="${it.id}" data-date="${date}" ${extra}><b>${label}</b>${sub ? `<span>${sub}</span>` : ""}</button>`;
  const started = L && stepState(it).some((x) => x.ok);
  let h = `<p class="sm muted">${L ? `${esc(SUBJ[it.s])} · Part ${it.n} of ${it.tot}${started ? " · started" : ""}` : esc(it.sub || "")}</p><div class="col" style="gap:10px">`;
  if (L) {
    h +=
      (date === today
        ? a("play", started ? "Keep going" : "Start the lesson", "Opens the step-by-step lesson", "green")
        : "") +
      a("iofin", "We already did it", `Marks Part ${it.n} done${date === today ? " now" : ""}`) +
      (date === today ? a("iosnz", "Later today", "Moves it out of the way for an hour") : "") +
      a(
        "skip",
        "Do it on the next lesson day",
        "Today's slot is freed; the chapter carries on next time",
        "line",
        `data-s="${it.s}"`,
      ) +
      a(
        "ioskip",
        "Skip this part",
        `We move on to Part ${Math.min(it.tot, it.n + 1)}. It shows as skipped in the history`,
        "line warn",
      );
  } else {
    h +=
      (date === today
        ? it.kind === "warm"
          ? a("games", "Start the warm-up", "", "green")
          : it.kind === "refresh"
            ? a("refresh", "Play it", "", "green")
            : ""
        : "") +
      a("iodone", "We already did it", "") +
      (date === today ? a("iosnz", "Later today", "Moves it out of the way for an hour") : "") +
      a("ioskipday", `Skip it ${day}`, "It comes back on another day");
  }
  return h + `</div>`;
}
const greetBar = (sub) => {
  const st = streak();
  return `<section class="greetbar"><button class="readbtn" data-act="readnow" aria-label="Read the screen aloud" style="order:3;margin-left:auto">🔊</button>${dayRing()}<span style="display:grid;min-width:0"><b>${greetWord()}${pname() ? ", " + esc(pname()) : ""}!</b><span class="xs muted">${sub}${st > 1 ? ` · <span class="streak">${st} days in a row</span>` : ""}</span></span></section>`;
};
function calHead(d) {
  return calHead0(d) + cancelNote(d);
}
function calHead0(d) {
  const lab =
      d === today
        ? "Today"
        : d === addDays(today, 1)
          ? "Tomorrow"
          : d === addDays(today, -1)
            ? "Yesterday"
            : parse(d).toLocaleDateString(undefined, { weekday: "long" }),
    sub = parse(d).toLocaleDateString(undefined, {
      weekday: d === today || Math.abs(parse(d) - parse(today)) < 2 * 864e5 ? "short" : undefined,
      day: "numeric",
      month: "short",
    });
  return `<div class="calhead"><button class="iconbtn sm" data-act="tday" data-d="-1" aria-label="Previous day">${icon("back")}</button><div class="calt"><b>${lab}</b><span class="xs muted">${sub}</span></div><button class="iconbtn sm" data-act="tday" data-d="1" aria-label="Next day">${icon("next")}</button>${d !== today ? `<button class="link xs" data-act="tday" data-d="0" style="margin-left:auto">Back to today</button>` : `<button class="link xs" data-act="quick" style="margin-left:auto">${ui.qaOpen ? "Close" : "+ Add"}</button>`}</div>${ui.qaOpen && d === today ? `<section class="qa-in"><b style="font:600 17px var(--display)">Add to today</b>${quickAdd(today)}</section>` : ""}`;
}
function noLessonNote(d) {
  const wd = parse(d).getDay(),
    DN = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"],
    SD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    on = S.subjects.filter((s) => daysOf(s).includes(wd));
  if (on.length) return `<p class="note">Nothing planned yet.</p>`;
  const nx = upcoming().find((x) => x.date > d),
    rng = (a) => {
      const o = [1, 2, 3, 4, 5, 6, 0].filter((x) => a.includes(x));
      return o.join() === "1,2,3,4,5" ? "Mon–Fri" : o.map((x) => SD[x]).join(", ");
    };
  return `<div class="note"><p><b>No lessons on ${DN[wd]}.</b> It's a free day in your plan.</p><ul class="sm" style="margin:6px 0;padding-left:18px">${S.subjects.map((s) => `<li>${esc(SUBJ[s])}: ${rng(daysOf(s))}</li>`).join("")}</ul>${nx ? `<p class="sm">Next lessons: ${esc(fmt(nx.date))}.</p>` : ""}<button class="link sm" data-act="plsheet" data-p="pace">Change lesson days</button></div>`;
}
function otherDay(d) {
  const items = dayPlan(d).filter((i) => i.kind !== "brk"),
    past = d < today,
    dn = items.filter((i) => i.done).length;
  return `<section class="sec cal">${calHead(d)}<p class="xs muted">${past ? `${dn} of ${items.length} done that day` : `${items.length} thing${items.length === 1 ? "" : "s"} planned`}</p>
   ${items.length ? `<div class="tt compact">${items.map((i) => tRow(i, d, null)).join("")}</div>` : past ? `<p class="note">Nothing was recorded that day.</p>` : noLessonNote(d)}
   ${past ? "" : `<button class="btn soft sm" data-act="quickday" data-d="${d}" style="margin-top:12px">+ Add a plan for this day</button>`}</section>`;
}
function nowCard(it) {
  const col = it.kind === "lesson" ? SC(it.s) : "r-" + it.who,
    missed = isMissed(it, today),
    a = `data-id="${it.id}" data-date="${today}"`,
    open = !!ui.open["now|" + it.id];
  const label = missed ? "Pending" : it.anytime ? "Any time today" : it.at <= nowMin() ? "Now" : "Up next";
  const title = it.kind === "lesson" ? chT(it.u) : it.title;
  const sub =
    it.kind === "lesson"
      ? `${SUBJ[it.s]} · Part ${it.n} of ${it.tot} · ${estTxt(it.u, it.n, it.tot)}`
      : it.kind === "prep"
        ? ((n) => `${n} thing${n === 1 ? "" : "s"} to get ready · ${mins(it.dur / 60)}`)(
            it.prep.filter((p) => !S.prep[p.id]).length,
          )
        : it.sub || ROLE[it.who];
  const P = itemAction(it, a);
  if (it.kind === "event" && !it.done && !it.anytime && it.at > nowMin())
    P.splice(0, 2, `data-act="evcancel" data-id="${esc(it.ev.id)}" data-date="${today}"`, "Cancel for today");
  const mascot =
    it.kind === "lesson"
      ? sblob(it.s, "happy", "mascot bob")
      : it.who === "you"
        ? youBlob("mascot bob", "calm")
        : kidBlob("mascot bob");
  return `<section class="now ${col}">${mascot}<span class="eyebrow">${label} · ${it.anytime ? "any time" : clock(it.at)}</span><h2>${esc(title)}</h2><button class="sub subtap" data-act="nowmore" data-id="${it.id}" aria-expanded="${!!open}">${esc(sub)} <span class="chev">${open ? "▲ Hide" : "▼ What's in it"}</span></button>
   <div class="row" style="flex-wrap:nowrap"><button class="btn wide big" ${P[0]}>${it.kind === "lesson" ? icon("play") : ""}${P[1]}</button>${P[0].includes("tlcheck") || P[0].includes("evcancel") ? "" : `<button class="ck" data-act="tlcheck" ${a} aria-label="Mark done: ${esc(title)}">${icon("check")}</button>`}</div>
   ${OURS(it) && it.kind !== "exps" ? `<button class="nowalt" data-act="iopts" ${a}>Already did it, later, or skip ›</button>` : ""}${open ? `<div class="tdet">${itemDetail(it, today)}</div>` : ""}</section>`;
}
function moreView() {
  document.getElementById("sheetTitle").textContent = "More for today";
  const du = dailyUnit(),
    open = S.exps.filter((e) => !e.closed),
    li = learnItems().length;
  let h = `<section class="card"><span class="eyebrow">Today is a</span><div class="whos"><button aria-pressed="${dayTypeOf(today) === "full"}" data-act="daytype" data-t="full">Full day</button><button aria-pressed="${dayTypeOf(today) === "busy"}" data-act="daytype" data-t="busy">Busy day</button></div><p class="xs muted">Busy days use the short lesson plans.</p></section>`;
  h += `<button class="menurow" data-act="learn">${youBlob("", "calm", 'width="40" height="40"')}<span><b>For you</b><br><span class="xs muted">${li ? li + " guides and readings for today and tomorrow" : "Guides for teaching each topic"}</span></span>${icon("next")}</button>`;
  h += `<button class="menurow" data-act="games">${blob("var(--gum)", 21, "wow", "", 'width="40" height="40"')}<span><b>Jokes and games</b><br><span class="xs muted">Word of the Day, True or False, Odd One Out</span></span>${icon("next")}</button>`;
  if (du)
    h += `<div class="hs">${du.c.x.jokes
      .map((j, i) => {
        const [q, a] = splitJoke(j),
          k = today + i;
        return `<button class="joke" data-act="joke" data-j="${k}"><span class="eyebrow">Joke ${i + 1}</span><span class="q">${esc(q)}</span>${ui.jokes[k] ? `<span class="a">${esc(a)}</span>` : `<span class="tap">Tap for the answer</span>`}</button>`;
      })
      .join("")}</div>`;
  h += moreJG();
  h += `<section class="card"><b style="font:600 17px var(--display)">🌱 Daily check-ins</b><p class="xs muted">For experiments that take days, like seeds sprouting or crystals growing. Tick once a day and DeepKids counts the days.</p>${
    open
      .map((e) => {
        const day = Math.round((parse(today) - parse(e.start)) / 864e5) + 1,
          c = e.checks.includes(today);
        return `<div class="expi ${c ? "done" : ""}" style="box-shadow:none;padding:6px 0"><span class="daybadge"><span><small>DAY</small>${day}</span></span><span style="min-width:0"><b style="font:600 15px var(--display)">${esc(e.title)}</b><br><span class="xs muted"><button class="link xs" data-act="close" data-e="${e.id}">finish</button></span></span><button class="ck" data-act="check" data-e="${e.id}" aria-label="Checked today: ${esc(e.title)}">${icon("check")}</button></div>`;
      })
      .join("") || `<p class="sm"><b>Nothing running yet. Try one of these:</b></p>${ideasHtml()}`
  }<div class="row" style="flex-wrap:nowrap"><input class="inp" id="newExp" placeholder="Add your own" maxlength="80"><button class="btn sm" data-act="addexp">Add</button></div></section>`;
  h += `<button class="btn soft sm" data-act="free" style="justify-self:start">We explored something else</button>`;
  return h;
}
function focusOf(items, date) {
  if (date !== today) return null;
  const nm = nowMin(),
    d = Dd(date),
    real = items.filter((i) => i.kind !== "brk" && !i.done && !snzd(i, date) && !evPast(i, date));
  if (!real.length) return null;
  const pm = real.find((i) => i.id === "pm");
  if (pm && nm >= hm(d.eveAt) - 30) return pm;
  const R = real.filter((i) => i.id !== "pm");
  const now = R.find((i) => !i.anytime && i.at <= nm && nm < i.at + i.dur);
  if (now) return now;
  const next = R.filter((i) => !i.anytime && i.at > nm),
    missed = R.filter((i) => OURS(i) && !i.anytime && i.at + i.dur <= nm);
  if (missed.length && !(next[0] && next[0].at - nm <= 15)) return missed[0];
  return next[0] || missed[0] || R.find((i) => i.anytime && OURS(i)) || R.find((i) => i.anytime) || pm || null;
}
const isMissed = (it, date) =>
  date === today &&
  !it.done &&
  !it.anytime &&
  OURS(it) &&
  it.kind !== "brk" &&
  !snzd(it, date) &&
  it.at + it.dur < nowMin();
// the main thing to do with an item: [the button's attributes, its label]
function itemAction(it, a) {
  return (
    {
      lesson: [
        `data-act="play" ${a}`,
        it.kind === "lesson" && stepState(it).some((x) => x.ok) ? "Keep going" : "Start the lesson",
      ],
      prep:
        it.id === "pm" ? [`data-act="night"`, "Get tomorrow ready"] : [`data-act="tlopen" ${a}`, "Open the checklist"],
      warm: [`data-act="games"`, "Start the warm-up"],
      plan: [`data-act="quickplan"`, "Open the Planner"],
      exps: [`data-act="tlcheck" ${a}`, "Checked them all"],
      refresh: [`data-act="refresh" data-date="${today}"`, "Play it"],
      finish: [`data-act="tofinish"`, "Open the list"],
      dkt: [`data-act="chapter" data-k="${it.u?.k}"`, "Open the topic"],
      mynote: [`data-act="chapter" data-k="${it.mk}"`, "Open your notes"],
    }[it.kind] || [`data-act="tlcheck" ${a}`, "Done"]
  );
}
function itemDetail(it, date) {
  const isT = date === today;
  if (it.kind === "refresh")
    return `<p class="sm" style="font-weight:700">${esc(it.rf.title)}</p><p class="xs muted">About ${it.dur} minutes, going back over ${(it.rf.topics || []).length ? esc(it.rf.topics.map((t) => chT(unitByK(t.k)) || t.k).join(", ")) : "past lessons"} with quick questions${it.rf.sub ? " · " + esc(it.rf.sub) : ""}.</p><div class="row"><button class="btn sm" data-act="refresh" data-date="${date}">${icon("play")}Play it</button></div>`;
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
  // anything else: what it is, and its main button
  const A = itemAction(it, `data-id="${it.id}" data-date="${date}"`);
  return `${it.sub ? `<p class="sm" style="font-weight:700">${esc(it.sub)}</p>` : ""}<div class="row"><button class="btn sm" ${A[0]}>${it.done ? "Done ✓" : A[1]}</button></div>`;
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
function nightView() {
  const tm = tomorrow(),
    its = nightItems(),
    dn = its.filter((p) => S.prep[p.id]).length,
    tp = dayPlan(tm).filter((i) => i.kind !== "brk"),
    d = Dd(tm),
    al = S.alarm || { on: false, time: "06:30" };
  document.getElementById("sheetTitle").textContent = "Tomorrow · " + fmt(tm);
  return `<section class="card r-you tint"><div class="sech"><h3>Things to get ready</h3><span class="pill">${dn} of ${its.length}</span></div>${its.length ? `<div class="col" style="gap:0">${its.map((p) => `<div class="taskrow ${S.prep[p.id] ? "done" : ""}"><button class="ckb" data-act="prep" data-id="${p.id}" aria-label="Ready: ${esc(p.task)}">${icon("check")}</button><div><b style="font-weight:800">${esc(p.task)}</b><p class="xs muted">${SUBJ[p.x.subj]} · ${esc(p.x.u.title)} · from ${esc(p.where)}</p></div></div>`).join("")}</div>` : `<p class="sm muted">Nothing to get ready tonight.</p>`}</section>
   <section class="card"><h3 style="font-size:19px">Tomorrow's plan</h3>${tp.length ? tp.map((i) => `<div class="row sm ${i.kind === "lesson" ? SC(i.s) : "r-" + i.who}" style="flex-wrap:nowrap;font-weight:700"><span class="dotc"></span><span class="muted num" style="min-width:64px">${i.anytime ? "Any time" : clock(i.at)}</span><span>${esc(i.kind === "lesson" ? SUBJ[i.s] + ": " + i.u.title : i.title)}</span></div>`).join("") : `<p class="sm muted">Nothing planned yet.</p>`}</section>
   <section class="card"><h3 style="font-size:19px">Your morning</h3><div class="fgrid"><div class="field"><label for="nWake">I'll wake up at</label><input class="inp" id="nWake" type="time" value="${al.time}" data-alarm="time"></div><div class="field"><label for="nStart">Start learning with ${esc(S.child || "my child")} at</label><input class="inp" id="nStart" type="time" value="${d.start}" data-over="${tm}"></div></div>
     <label class="toggle" style="box-shadow:none;padding:0"><input type="checkbox" id="nAlarm" ${al.on ? "checked" : ""} data-alarm="on"><span><b style="font:600 16px var(--display)">Wake-up alarm</b><br><span class="xs muted">Rings only while DeepKids is open on this phone. For a sure wake-up, also set your phone's alarm for ${clock(hm(al.time))}.</span></span></label></section>
   <section class="card"><h3 style="font-size:19px">Any other plans tomorrow?</h3>${quickAdd(tm)}</section>
   <button class="btn green" data-act="nightdone">${icon("check")}${(S.night || {})[today] ? "Tomorrow is ready" : "All set for tomorrow"}</button>`;
}
function quickAdd(date) {
  const Q = ui.qdraft || {},
    w = ui.qwho || "you",
    r = ui.qrep || "once",
    kd = ui.qkind || "other",
    days = ui.qdays || [],
    todo = kd === "todo";
  return `<div class="col" style="gap:10px"><input class="inp" id="qa-t" maxlength="80" value="${esc(Q.t || "")}" placeholder="${kd === "class" ? "Science tuition, swimming, tabla" : kd === "rest" ? "Nap, lunch, quiet time" : kd === "outing" ? "Zoo trip, park, grandma's house" : todo ? "Buy chart paper, call the coach" : "Dentist, cousin's birthday"}">
   <div class="row chips">${QKIND.map(([k, n]) => `<button type="button" class="chip" aria-pressed="${kd === k}" data-act="qkind" data-k="${k}">${n}</button>`).join("")}</div>
   <div class="whos">${[
     ["you", "Mine"],
     ["kid", S.child ? esc(S.child) + "'s" : "Child's"],
     ["both", "Together"],
   ]
     .map(([k, n]) => `<button type="button" aria-pressed="${w === k}" data-act="qwho" data-w="${k}">${n}</button>`)
     .join("")}</div>
   ${todo ? "" : `<div class="row" style="align-items:center"><label class="sm">From <input class="inp" id="qa-s" type="time" value="${Q.s || ""}" style="width:auto"></label><label class="sm">to <input class="inp" id="qa-e" type="time" value="${Q.e || ""}" style="width:auto"></label></div>`}
   <div class="row chips">${Object.entries(QREP)
     .filter(([k]) => !todo || k === "once")
     .map(
       ([k, [n]]) =>
         `<button type="button" class="chip" aria-pressed="${r === k || (todo && k === "once")}" data-act="qrep" data-r="${k}">${n}</button>`,
     )
     .join("")}</div>
   ${!todo && r === "pick" ? `<div class="dpick">${[1, 2, 3, 4, 5, 6, 0].map((d) => `<button type="button" aria-pressed="${days.includes(d)}" data-act="qday" data-d="${d}">${DAYN[d]}</button>`).join("")}</div>` : ""}
   <label class="sm">${!todo && r !== "once" ? "Starting" : "On"} <input class="inp" id="qa-d" type="date" value="${Q.d || date}" style="width:auto"></label>
   <button class="btn sm" data-act="qaddq" style="justify-self:start">Add</button><p class="xs muted">${todo ? "A to-do shows on that day's list, and all of them are in Plan → This week, under “Your to-dos”." : r === "once" ? "Leave the time empty for a to-do any time that day." : "Repeats every week on those days. Change or remove it any time in Plan → Settings → Your classes, routines and to-dos."}</p></div>`;
}
function parentView() {
  const p = S.parent || {},
    al = S.alarm || { on: false, time: "06:30" },
    d = D();
  document.getElementById("sheetTitle").textContent = "About you";
  return `<section class="card r-you tint" style="text-align:center;justify-items:center">${youBlob("bob", "happy", 'width="90" height="90"')}<h2 style="font-size:24px">DeepKids is your planning partner</h2><p class="sm muted">It plans your mornings, evenings and the lessons in between. A few things about you help it plan better.</p></section>
   <section class="card"><div class="field"><label for="pName">What should we call you?</label><input class="inp" id="pName" maxlength="40" value="${esc(p.name || pname())}" placeholder="Your name"></div>
   <div class="fgrid"><div class="field"><label for="pWake">You usually wake up at</label><input class="inp" id="pWake" type="time" value="${al.time}"></div><div class="field"><label for="pPrep">Morning prep time</label><input class="inp" id="pPrep" type="time" value="${d.prepAt}"></div><div class="field"><label for="pStart">Learning starts at</label><input class="inp" id="pStart" type="time" value="${d.start}"></div><div class="field"><label for="pEve">Evening prep time</label><input class="inp" id="pEve" type="time" value="${d.eveAt}"></div></div>
   <label class="toggle" style="box-shadow:none;padding:0"><input type="checkbox" id="pAlarm" ${al.on ? "checked" : ""}><span><b style="font:600 16px var(--display)">Wake-up alarm</b><br><span class="xs muted">Rings only while the app is open on this phone.</span></span></label>
   <div class="field"><span>Subjects you'd like more help teaching</span><div class="whos">${S.subjects.map((s) => `<button type="button" aria-pressed="${ui.phelp ? ui.phelp.has(s) : (p.help || []).includes(s)}" data-act="phelp" data-s="${s}">${SUBJ[s]}</button>`).join("")}</div></div>
   <div class="field"><label for="pLang">Languages spoken at home</label><input class="inp" id="pLang" maxlength="80" value="${esc(p.langs || "")}" placeholder="Tamil, English"></div>
   <button class="btn" data-act="psave">Save</button></section>`;
}
function offers() {
  return S.subjects
    .filter((s) => !ui.more[s])
    .map((s) => ({ s, nx: nextUp(s) }))
    .filter((x) => x.nx);
}
function offerList() {
  const L = offers();
  return L.length
    ? `<div class="col" style="gap:8px">${L.map(({ s, nx }) => `<div class="offer ${SC(s)}">${sblob(s)}<span style="min-width:0"><b style="font:600 16px var(--display)">${esc(chT(nx.u))}</b><br><span class="xs muted">${SUBJ[s]} · Part ${nx.n} of ${nx.tot}</span><br><span class="xs est">${estTxt(nx.u, nx.n, nx.tot)}</span></span><button class="btn sm" data-act="more" data-s="${s}">Start</button></div>`).join("")}</div>`
    : `<p class="sm muted">Everything planned is done. Explore anything you like.</p>`;
}
function viewToday() {
  const items = dayPlan(today),
    real = items.filter((i) => i.kind !== "brk"),
    dn = real.filter((i) => i.done).length,
    f = focusOf(items, today);
  const lessons = real.filter((i) => i.kind === "lesson"),
    lessonsDone = lessons.length > 0 && lessons.every((i) => i.done),
    left = real.filter((i) => !i.done),
    doneL = real.filter((i) => i.done);
  let h = greetBar(
    `${S.child ? esc(S.child) + "'s day · " : ""}${longDate()} · ${real.length ? (f ? `${real.length - dn} thing${real.length - dn === 1 ? "" : "s"} left` : "all done") : "nothing planned"}`,
  );
  if (S.setup && !S.parent?.saved && !S.parent?.name)
    h += `<button class="nudge" data-act="parent">${youBlob("", "happy", 'width="36" height="36"')}<span>${pname() ? "Set your wake-up and prep times" : "Tell us your name and wake-up time"}</span>${icon("next")}</button>`;
  if (ui.tday && ui.tday !== today) return h + otherDay(ui.tday);
  h += fxTodayTop(!window.FXANIMED); // the summary animates in the first time only
  window.FXANIMED = 1;
  // what to do next comes first; the day toggle sits right above the day's list, which marks the next thing
  h += `<section class="sec cal">${pastEvCard(real)}${f ? nowCard(f) : ""}${nudgeCard()}${calHead(today)}`;
  if (lessonsDone || !real.length)
    h += `<section class="donecard">${blob("var(--sun)", 4, "happy", "mascot bob")}<h2>${lessons.length ? "Lessons done! Keep going?" : "Want to start something?"}</h2>${offerList()}</section>`;
  if (left.length) h += `<div class="tt compact">${left.map((i) => tRow(i, today, f)).join("")}</div>`;
  if (doneL.length)
    h += `<button class="donebar" data-act="showdone" aria-expanded="${!!ui.showDone}"><span class="ck on">${icon("check")}</span><b>${doneL.length} done today</b><span class="xs">${ui.showDone ? "Hide" : "Show"}</span></button>${ui.showDone ? `<div class="tt compact">${doneL.map((i) => tRow(i, today, null)).join("")}</div>` : ""}`;
  {
    const oc = openCount(),
      tile = (act, ic, label, sub, extra = "") =>
        `<button class="qtile" data-act="${act}" ${extra}><span class="qi">${icon(ic)}</span><b>${label}</b><span class="xs muted">${sub}</span></button>`;
    h += `<div class="qtiles">${tile("gotab", "prep", "Unfinished", oc ? oc + " open" : "All caught up", 'data-tab="week" data-seg="finish"')}${tile("gotab", "play", "Up next", "Next chapters", 'data-tab="week" data-seg="next"')}${tile("quizgo", "spark", "Quick quiz", "Ask a few questions")}${tile("uploads", "plus", "Add photos", "Work samples")}</div>`;
  }
  h += `</section><button class="morebtn" data-act="moresheet">${icon("grid")}<span>More for today</span><span class="xs muted">jokes, games, experiments, your reading</span></button>`;
  return h;
}
function fxTodayTop(animate) {
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
  const tiles = `<div class="fxgoals"><div class="fxgoal"><b>${Math.round(doneM)}<small> / ${Math.round(planned)} min</small></b><span>learned this week</span></div><div class="fxgoal"><b>${going.length}<small> started · ${doneU} finished</small></b><span>topics</span></div></div>`;
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
  return `<section class="sec fxtoday${animate ? " fxanim" : ""}">${tiles}${em}${cont}</section>`;
}
