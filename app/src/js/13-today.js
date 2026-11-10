/* Today */
const OURS = (i) => !["event", "todo", "prep", "plan"].includes(i.kind);
const snzd = (i, date) => (S.snz?.[date + "|" + i.id] || 0) > nowMin();
const evPast = (i, date) => i.kind === "event" && !i.done && !i.anytime && date === today && i.at + i.dur <= nowMin();
function pastEvCard(items) {
  const P = items.filter((i) => evPast(i, today));
  if (!P.length) return "";
  return `<section class="card pastev"><span class="eyebrow">Did ${P.length > 1 ? "these" : "this"} happen?</span>${P.map((i) => `<div class="pastrow"><div><b>${esc(i.title)}</b><br><span class="xs muted">${clock(i.at)}${i.ev?.end ? "–" + clock(toMins(i.ev.end)) : ""} · ${esc(evShort(i.ev))}</span></div><div class="row"><button class="btn green sm" data-act="tlcheck" data-id="${i.id}" data-date="${today}">Yes, done</button><button class="btn line sm" data-act="evmiss" data-id="${esc(i.ev.id)}" data-date="${today}">Didn't happen</button></div></div>`).join("")}</section>`;
}
function ioptsView() {
  const { date, id } = ui.sheet,
    it = dayPlan(date).find((i) => i.id === id);
  if (!it) return `<p class="note">That's no longer on the plan.</p>`;
  const L = it.kind === "lesson",
    title = L ? chT(it.u) : it.title,
    day = date === today ? "today" : fmt(date);
  setSheetTitle(title);
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
// the top of Today: the time-of-day picture with the greeting and the day's line (who, which day, how much is done)
function todayHero(parts) {
  dayCheer();
  const st = streak(),
    bits = [...parts, ...(st > 1 ? [`<span class="streak" title="${st} days in a row">🔥 ${st} days</span>`] : [])];
  return `<section class="thero ${dayPart() < 2 ? "" : "night"}"><img src="${greetPic()}" alt=""><div class="therotxt"><h1>${greetWord()}${pname() ? ", " + esc(pname()) : ""}</h1><p>${bits.map((b) => `<span>${b}</span>`).join("")}</p></div></section>`;
}
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
  return `<div class="calhead"><button class="iconbtn sm" data-act="tday" data-d="-1" aria-label="Previous day">${icon("back")}</button><div class="calt"><b>${lab}</b><span class="xs muted">${sub}</span></div><button class="iconbtn sm" data-act="tday" data-d="1" aria-label="Next day">${icon("next")}</button>${d !== today ? `<button class="link xs" data-act="tday" data-d="0" style="margin-left:auto">Back to today</button>` : `<button class="link xs" data-act="quick" style="margin-left:auto">${ui.qaOpen ? "Close" : "+ Add"}</button>`}</div>${ui.qaOpen && d === today ? `<section class="qa-in"><b class="h5">Add to today</b>${quickAdd(today)}</section>` : ""}`;
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
  const items = dayPlan(d).filter(isTask),
    past = d < today,
    dn = items.filter((i) => i.done).length;
  return `<section class="sec cal">${calHead(d)}<p class="xs muted">${past ? `${dn} of ${items.length} done that day` : `${items.length} thing${items.length === 1 ? "" : "s"} planned`}</p>
   ${items.length ? `<div class="tt compact">${items.map((i) => tRow(i, d, null)).join("")}</div>` : past ? `<p class="note">Nothing was recorded that day.</p>` : noLessonNote(d)}
   ${past ? "" : `<button class="btn soft sm" data-act="quickday" data-d="${d}" style="margin-top:12px">+ Add a plan for this day</button>`}</section>`;
}
// under the item that is up next (or now): its main button, and a way to say it was already done, later or skipped
function upNextActions(it, a, isFocus) {
  const P = itemAction(it, a);
  if (it.kind === "event" && !it.done && !it.anytime && it.at > nowMin())
    P.splice(0, 2, `data-act="evcancel" data-id="${esc(it.ev.id)}" data-date="${today}"`, "Cancel for today");
  const main = P[0].includes("tlcheck")
      ? ""
      : `<button class="btn sm" ${P[0]}>${it.kind === "lesson" ? icon("play") : ""}${P[1]}</button>`,
    alt =
      isFocus && OURS(it) && it.kind !== "exps"
        ? `<button class="tactalt" data-act="iopts" ${a}>Already did it, later, or skip ›</button>`
        : "";
  return main || alt ? `<div class="tact">${main}${alt}</div>` : "";
}
function moreView() {
  setSheetTitle("More for today");
  const open = S.exps.filter((e) => !e.closed),
    li = learnItems().length;
  const oc = openCount(),
    row = (act, ic, label, sub, extra = "") =>
      `<button class="menurow" data-act="${act}" ${extra}><span class="mqi">${icon(ic)}</span><span><b>${label}</b><br><span class="xs muted">${sub}</span></span>${icon("next")}</button>`;
  let h = `${row("quizgo", "spark", "Quick quiz", "A few questions on what was learned")}${row("uploads", "plus", "Add photos", "Work samples and things made")}${row("lifeadd", "plus", "Something they did", "A class, cooking, a question")}${row("gotab", "prep", "Unfinished", oc ? oc + " open" : "All caught up", 'data-tab="week" data-seg="finish"')}${row("gotab", "play", "Up next", "Next chapters", 'data-tab="week" data-seg="next"')}<button class="menurow" data-act="learn">${youBlob("", "calm", 'width="40" height="40"')}<span><b>For you</b><br><span class="xs muted">${li ? li + " guides and readings for today and tomorrow" : "Guides for teaching each topic"}</span></span>${icon("next")}</button>`;
  h += `<button class="menurow" data-act="games">${blob("var(--gum)", 21, "wow", "", 'width="40" height="40"')}<span><b>Jokes and games</b><br><span class="xs muted">Word of the Day, True or False, Odd One Out</span></span>${icon("next")}</button>`;
  h += jokeCards(dayJokes());
  h += moreJG();
  h += `<section class="card"><b class="h5">🌱 Daily check-ins</b><p class="xs muted">For experiments that take days, like seeds sprouting or crystals growing. Tick once a day and DeepKids counts the days.</p>${
    open
      .map((e) => {
        const day = Math.round((parse(today) - parse(e.start)) / 864e5) + 1,
          c = e.checks.includes(today);
        return `<div class="expi ${c ? "done" : ""}" style="box-shadow:none;padding:6px 0"><span class="daybadge"><span><small>DAY</small>${day}</span></span><span style="min-width:0"><b class="h4">${esc(e.title)}</b><br><span class="xs muted"><button class="link xs" data-act="close" data-e="${e.id}">finish</button></span></span><button class="ck" data-act="check" data-e="${e.id}" aria-label="Checked today: ${esc(e.title)}">${icon("check")}</button></div>`;
      })
      .join("") || `<p class="sm"><b>Nothing running yet. Try one of these:</b></p>${ideasHtml()}`
  }<div class="row" style="flex-wrap:nowrap"><input class="inp" id="newExp" placeholder="Add your own" maxlength="80"><button class="btn sm" data-act="addexp">Add</button></div></section>`;
  h += `<button class="btn soft sm self-start" data-act="free">We explored something else</button>`;
  return h;
}
function focusOf(items, date) {
  if (date !== today) return null;
  const nm = nowMin(),
    d = daySettings(date),
    real = items.filter((i) => isTask(i) && !i.done && !snzd(i, date) && !evPast(i, date));
  if (!real.length) return null;
  const pm = real.find((i) => i.id === "pm");
  if (pm && nm >= toMins(d.eveAt) - 30) return pm;
  const R = real.filter((i) => i.id !== "pm");
  const now = R.find((i) => !i.anytime && i.at <= nm && nm < i.at + i.dur);
  if (now) return now;
  const next = R.filter((i) => !i.anytime && i.at > nm),
    missed = R.filter((i) => OURS(i) && !i.anytime && i.at + i.dur <= nm);
  if (missed.length && !(next[0] && next[0].at - nm <= 15)) return missed[0];
  return next[0] || missed[0] || R.find((i) => i.anytime && OURS(i)) || R.find((i) => i.anytime) || pm || null;
}
const isMissed = (it, date) =>
  date === today && !it.done && !it.anytime && OURS(it) && isTask(it) && !snzd(it, date) && it.at + it.dur < nowMin();
// has the family begun this lesson? (a unit keeps its own place; a chapter keeps its ticked steps)
const lessonStarted = (it) =>
  it.u.board === "unit" ? fxProgress(it.u.c.unit).started : stepState(it).some((x) => x.ok);
const lessonLabel = (it) => (lessonStarted(it) ? "Continue lesson" : "Start lesson");
// the main thing to do with an item: [the button's attributes, its label]
function itemAction(it, a) {
  return (
    {
      lesson: [`data-act="play" ${a}`, it.kind === "lesson" ? lessonLabel(it) : ""],
      prep: [it.id === "pm" ? `data-act="night"` : `data-act="tlopen" ${a}`, "Open the checklist"],
      warm: [`data-act="games"`, "Start the warm-up"],
      plan: [`data-act="quickplan"`, "Open the Planner"],
      paper: [`data-act="paper" data-p="${it.p?.id}"`, "Read it together"],
      exps: [`data-act="tlcheck" ${a}`, "Checked them all"],
      refresh: [`data-act="refresh" data-date="${today}"`, "Play it"],
      finish: [`data-act="tofinish"`, "Open the list"],
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
    const prep = prepFor(it.u, it.n, it.tot).filter((p) => p.lead === 0);
    const P = it.u.board === "unit" ? fxProgress(it.u.c.unit) : null;
    return `${P ? `<p class="sm muted dhead">${P.started ? `${P.done} of ${P.parts} parts done` : "Not started yet"}</p>` : ""}
    ${prep.length ? `<div class="sm"><b style="font-family:var(--display)">Have ready</b><ul class="haveready">${prep.map((p) => `<li>${esc(p.task.replace(/^(Gather|Get):? /, "").replace(/ \(\d+\)$/, ""))}</li>`).join("")}</ul></div>` : ""}
    <div class="row">${!it.done && !it.bonus ? `<button class="btn soft sm" data-act="swap" data-s="${it.s}">Swap topic</button>` : ""}${isT && !it.done ? (it.bonus ? `<button class="btn line sm" data-act="less" data-s="${it.s}">Not now</button>` : `<button class="btn line sm" data-act="skip" data-s="${it.s}">Not today</button>`) : ""}</div>`;
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
    const j = dayJokes()[0];
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
    return `<p class="sm" style="font-weight:700">${clock(toMins(e.start))} to ${clock(toMins(e.end))} · ${ROLE[e.kind === "outing" ? "out" : e.who]}${e.rep === "weekly" ? " · every " + e.days.map((d) => DAYN[d]).join(", ") : ""}${e.note ? " · " + esc(e.note) : ""}</p><div class="row"><button class="btn line sm" data-act="delev" data-e="${e.id}">Remove</button></div>`;
  }
  if (it.kind === "todo")
    return `<p class="sm" style="font-weight:700">${esc(it.sub)}</p><div class="row"><button class="btn soft sm" data-act="todomove" data-t="${it.td.id}">Move to tomorrow</button><button class="btn line sm" data-act="tododel" data-t="${it.td.id}">Remove</button></div>`;
  // anything else: what it is, and its main button
  const A = itemAction(it, `data-id="${it.id}" data-date="${date}"`);
  return `${it.sub ? `<p class="sm" style="font-weight:700">${esc(it.sub)}</p>` : ""}<div class="row"><button class="btn sm" ${A[0]}>${it.done ? "Done ✓" : A[1]}</button></div>`;
}
// each row's picture: a lesson shows its unit's picture (or its subject's), a research paper its cover, some kinds one
// of the founder's drawings; the rest keep an icon until they have an illustration that fits
const DAYPIC = {
  prep: "prep",
  warm: "jokes",
  finish: "finish",
  exps: "science",
  paper: "science",
  refresh: "refresh",
  shelf: "other",
  mynote: "other",
  other: "other",
};
const DAYICON = { todo: "prep", plan: "week", event: "event" };
// a calendar entry or shelf item shows the drawing for what it is: a sport, a tuition or class, or a game
const evPic = (title) =>
  SPORTW.test(title) ? "sport" : TUITIONW.test(title) ? "tuition" : GAMEW.test(title) ? "games" : "";
function dayPic(it) {
  const img = (src, cls = "") => `<span class="ic pic ${cls}"><img src="${esc(src)}" alt="" loading="lazy"></span>`;
  if (it.kind === "lesson") return img(lessonPic(it.u));
  if (it.kind === "paper" && it.p?.cover?.src) return img(it.p.cover.src);
  const own = it.kind === "event" || it.kind === "shelf" ? evPic(it.title) : "";
  if (own) return img(`media/ui/day-${own}.webp`, "draw");
  if (DAYPIC[it.kind]) return img(`media/ui/day-${DAYPIC[it.kind]}.webp`, "draw");
  return `<span class="ic">${icon(DAYICON[it.kind] || "spark")}</span>`;
}
// a lesson's last finished part and its next one, for its row on the day
function lessonLines(it) {
  if (it.u.board === "unit") {
    const P = fxProgress(it.u.c.unit),
      show = (p) => (p ? (fxKC(p.kind)[0] === p.title ? p.title : `${fxKC(p.kind)[0]}: ${p.title}`) : "");
    return { last: show(P.last), next: show(P.next) };
  }
  const st = stepState(it),
    ok = st.filter((x) => x.ok);
  return { last: ok.length ? ok[ok.length - 1].title : "", next: st.find((x) => !x.ok)?.title || "" };
}
function tRow(it, date, focus) {
  const col = it.kind === "lesson" ? subjClass(it.s) : "r-" + it.who,
    [hh, ap] = it.anytime ? ["Any", "time"] : it.done && it.doneNoTime ? ["Done", ""] : clock(it.at).split(" ");
  if (it.kind === "brk" || it.kind === "rest")
    return `<div class="tr brk ${it.kind === "rest" ? "rest " + col : ""}"><span class="t num">${hh}<small>${ap}</small></span><span class="brkline">${esc(it.title)} · ${mins(it.dur / 60)}</span></div>`;
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
  const drag = date === today && !it.done && !it.anytime && DAYMOVE.has(it.kind),
    L = it.kind === "lesson" ? lessonLines(it) : null,
    mid = L
      ? `<div class="lmid"><div class="ltags"><span class="stag">${esc(SUBJ[it.s])}</span>${it.n ? `<span class="stag soft">Session ${it.n}${it.tot ? ` of ${it.tot}` : ""}</span>` : ""}<span class="stag soft">${mins(it.dur / 60)}</span>${tag}</div><button class="m plain" data-act="topen" data-id="${it.id}" aria-expanded="${open}"><b>${esc(chT(it.u))}</b></button>${!open ? "" : it.done ? `<p class="lline"><b>Done</b> ${it.doneAt != null ? "at " + clock(it.doneAt) : "today"}</p>` : `${L.last ? `<p class="lline"><b>Last done</b> ${esc(L.last)}</p>` : ""}${L.next ? `<p class="lline"><b>Next up</b> ${esc(L.next)}</p>` : ""}`}</div>`
      : "";
  return `<div class="tr ${col} ${it.done ? "done" : ""} ${it === focus ? "focus" : ""} ${missed ? "missed" : ""}" data-r="${esc(it.id)}"><span class="t num">${drag ? `<span class="dh" aria-label="Drag to change the order">⠿</span>` : ""}${hh}<small>${ap}</small></span><div class="tcard">${dayPic(it)}${mid}${L ? "" : `<button class="m plain" data-act="topen" data-id="${it.id}" aria-expanded="${open}"><b>${esc(it.kind === "lesson" ? chT(it.u) : it.title)}</b><span>${tag}${it.kind === "lesson" ? SUBJ[it.s] + " · " + (it.n ? `Session ${it.n}${it.tot ? " of " + it.tot : ""} · ` : "") : ""}${S.tl[date + "|" + it.id] === "skip" ? "skipped today" : S.tl[date + "|" + it.id] === "missed" ? "didn't happen" : it.skipped ? "skipped" : it.done && it.doneAt != null ? "done at " + clock(it.doneAt) : it.done && it.doneNoTime ? "done, time not recorded" : (it.kind === "event" && it.ev ? evShort(it.ev) : esc(ROLE[it.who])) + " · " + mins(it.dur / 60)}</span></button>`}<button class="ck" data-act="tlcheck" ${a} aria-label="${it.done ? "Done" : "Mark done"}: ${esc(it.title)}">${icon("check")}</button>${(it === focus ? it.kind !== "lesson" || open : it.kind === "lesson" && open) && date === today && !it.done ? upNextActions(it, a, it === focus) : ""}${open ? `<div class="tdet">${itemDetail(it, date)}</div>` : ""}</div></div>`;
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
    nowMin() >= toMins(dayDefaults().eveAt) &&
    (its.length > 0 || dayPlan(tomorrow()).some((i) => i.kind === "lesson"))
  );
};
const dayPart = () => {
  const h = new Date().getHours();
  return h < 12 ? 0 : h < 17 ? 1 : 2;
};
const greetWord = () => ["Good morning", "Good afternoon", "Good evening"][dayPart()];
// Today's picture follows the time of day, all drawn by the founder: climbing the tree in the morning sun, the fruit tree with friends, dancing under the night star
const greetPic = () => `media/ui/greet-${dayPart() < 2 ? "day" : "night"}.jpg`;
function nightView() {
  const tm = tomorrow(),
    its = nightItems(),
    dn = its.filter((p) => S.prep[p.id]).length,
    tp = dayPlan(tm).filter(isTask),
    d = daySettings(tm),
    al = S.alarm || { on: false, time: "06:30" };
  setSheetTitle("Tomorrow · " + fmt(tm));
  return `<section class="card r-you tint"><div class="sech"><h3>Things to get ready</h3><span class="pill">${dn} of ${its.length}</span></div>${its.length ? `<div class="col" style="gap:0">${its.map((p) => `<div class="taskrow ${S.prep[p.id] ? "done" : ""}"><button class="ckb" data-act="prep" data-id="${p.id}" aria-label="Ready: ${esc(p.task)}">${icon("check")}</button><div><b style="font-weight:800">${esc(p.task)}</b><p class="xs muted">${SUBJ[p.x.subj]} · ${esc(p.x.u.title)} · from ${esc(p.where)}</p></div></div>`).join("")}</div>` : `<p class="sm muted">Nothing to get ready tonight.</p>`}</section>
   <section class="card"><h3 class="fs5">Tomorrow's plan</h3>${tp.length ? tp.map((i) => `<div class="row sm ${i.kind === "lesson" ? subjClass(i.s) : "r-" + i.who}" style="flex-wrap:nowrap;font-weight:700"><span class="dotc"></span><span class="muted num" style="min-width:64px">${i.anytime ? "Any time" : clock(i.at)}</span><span>${esc(i.kind === "lesson" ? SUBJ[i.s] + ": " + i.u.title : i.title)}</span></div>`).join("") : `<p class="sm muted">Nothing planned yet.</p>`}</section>
   <section class="card"><h3 class="fs5">Your morning</h3><div class="fgrid"><div class="field"><label for="nWake">I'll wake up at</label><input class="inp" id="nWake" type="time" value="${al.time}" data-alarm="time"></div><div class="field"><label for="nStart">Start learning with ${esc(S.child || "my child")} at</label><input class="inp" id="nStart" type="time" value="${d.start}" data-over="${tm}"></div></div>
     <label class="toggle" style="box-shadow:none;padding:0"><input type="checkbox" id="nAlarm" ${al.on ? "checked" : ""} data-alarm="on"><span><b class="h4">Wake-up alarm</b><br><span class="xs muted">Rings only while DeepKids is open on this phone. For a sure wake-up, also set your phone's alarm for ${clock(toMins(al.time))}.</span></span></label></section>
   <section class="card"><h3 class="fs5">Any other plans tomorrow?</h3>${quickAdd(tm)}</section>
   <button class="btn green" data-act="nightdone">${icon("check")}${(S.night || {})[today] ? "Tomorrow is ready" : "All set for tomorrow"}</button>`;
}
// Add by hand: pick what it is, fill in only what that kind needs, and it goes where it does its job
const ADDK = [
  ["class", "🏸", "Class", "Swimming, Science tuition, tabla"],
  ["interest", "💡", "Interest", "Dinosaurs, stitching, space"],
  ["todo", "✅", "To-do", "Buy chart paper"],
  ["outing", "🚌", "Outing or plan", "Zoo trip, cousin's wedding", "Outing"],
  ["did", "🧺", "Something they did", "Made rotis, planted beans", "They did"],
  ["went", "📍", "Place they went", "Planetarium, the beach", "Went to"],
  ["remind", "⏰", "Reminder", "Pay the tuition fees"],
  ["rest", "🍽️", "Rest or meal", "Lunch, nap, quiet time", "Rest, meal"],
  ["other", "🩺", "Appointment", "Dentist, parent-teacher meet"],
  ["have", "📚", "Something we own", "Microscope, Lego, Tinkle comics", "We own"],
];
const ADDJOB = {
  class: "It goes on the calendar every week. Mark it done on Today and the hours build up as a skill.",
  interest: "Kept for your child, linked to topics you can add to the plan. Not put on the calendar.",
  todo: "It shows on that day's list on Today.",
  outing: "It goes on the calendar. Afterwards DeepKids asks how it went and counts it as learning.",
  did: "Counted as learning: linked to the topics it teaches, in hours, in History and on the transcript.",
  went: "Counted as learning: linked to the topics it teaches, in hours, in History and on the transcript.",
  remind: "It shows on Today at that time.",
  rest: "A routine on the calendar. Lessons are planned around it.",
  other: "It goes on the calendar on that day, and lessons fit around it.",
  have: "It goes on your Home shelf, and shows up next to the lessons it fits. Separate several with commas.",
};
// the kind chosen in Add by hand, with who and how often it repeats (the kind's own default until changed)
function qaPick() {
  const kd = ui.qkind || "class",
    repeats = ["class", "remind", "rest"].includes(kd);
  return {
    kd,
    repeats,
    w: ui.qwho || (kd === "class" ? "kid" : kd === "remind" || kd === "other" ? "you" : "both"),
    r: repeats ? ui.qrep || (kd === "class" ? "pick" : kd === "rest" ? "daily" : "once") : "once",
  };
}
// keeps what was typed in Add by hand while a chip re-draws the form
function qaKeep(b) {
  const f = b.closest(".addbox");
  if (f) ui.qdraft = Object.fromEntries(["t", "s", "e", "d"].map((k) => [k, f.querySelector("#qa-" + k)?.value]));
}
function quickAdd(date) {
  const Q = ui.qdraft || {},
    { kd, repeats, w, r } = qaPick(),
    K = ADDK.find((x) => x[0] === kd),
    days = ui.qdays || [],
    timed = ["class", "outing", "remind", "rest", "other"].includes(kd),
    dated = !["interest", "have"].includes(kd) && !(repeats && r !== "once"),
    life = kd === "did" || kd === "went";
  return `<div class="addbox">
   <div class="addkinds">${ADDK.map(([k, e, n, , sh]) => `<button type="button" class="addk" aria-pressed="${kd === k}" data-act="qkind" data-k="${k}"><span>${e}</span>${sh || n}</button>`).join("")}</div>
   <div class="addform"><label class="sm" for="qa-t"><b>${K[2]}</b></label><input class="inp" id="qa-t" maxlength="${kd === "have" ? 300 : 80}" value="${esc(Q.t || "")}" placeholder="${esc(K[3])}">
   ${
     timed
       ? `<div class="whos">${[
           ["kid", S.child ? esc(S.child) + "'s" : "Child's"],
           ["you", "Mine"],
           ["both", "Together"],
         ]
           .map(
             ([k, n]) => `<button type="button" aria-pressed="${w === k}" data-act="qwho" data-w="${k}">${n}</button>`,
           )
           .join("")}</div>`
       : ""
   }
   ${
     repeats
       ? `<div class="row chips">${Object.entries(QREP)
           .map(
             ([k, [n]]) =>
               `<button type="button" class="chip" aria-pressed="${r === k}" data-act="qrep" data-r="${k}">${n}</button>`,
           )
           .join(
             "",
           )}</div>${r === "pick" ? `<div class="dpick">${[1, 2, 3, 4, 5, 6, 0].map((d) => `<button type="button" aria-pressed="${days.includes(d)}" data-act="qday" data-d="${d}">${DAYN[d]}</button>`).join("")}</div>` : ""}`
       : ""
   }
   <div class="addrow">${dated ? `<label class="sm">${life ? "When" : "On"} <input class="inp" id="qa-d" type="date" value="${Q.d || date}" ${life ? `max="${today}"` : ""}></label>` : ""}${timed ? `<label class="sm">${kd === "remind" ? "At" : "From"} <input class="inp" id="qa-s" type="time" value="${Q.s || ""}"></label>${kd === "remind" ? "" : `<label class="sm">to <input class="inp" id="qa-e" type="time" value="${Q.e || ""}"></label>`}` : ""}${life ? `<label class="sm">How long <select class="inp" id="qa-m">${[0, 15, 30, 45, 60, 90, 120, 180].map((x) => `<option value="${x}" ${x === 30 ? "selected" : ""}>${x ? hmin(x) : "Not timed"}</option>`).join("")}</select></label>` : ""}</div>
   <button class="btn" data-act="qaddq">Add ${K[2].toLowerCase()}</button><p class="xs muted">${ADDJOB[kd]}</p></div></div>`;
}
// saves what Add by hand describes, each kind where it does its job
function quickSave(root) {
  const g = (q) => root?.querySelector(q)?.value || "",
    t = g("#qa-t").trim(),
    s = g("#qa-s"),
    e = g("#qa-e"),
    d = g("#qa-d") || today,
    { kd, w, r } = qaPick(),
    days = r === "pick" ? ui.qdays || [] : QREP[r][1] || [],
    id = newId(),
    no = (m) => (sfx("no"), toast(m));
  if (!t) return no("Write what it is first");
  if (kd === "interest") {
    addInterest(t);
    toast(`${t} saved as an interest. See it in Progress → Skills and life.`);
  } else if (kd === "have") {
    const L = invLocal(t);
    S.inv = [
      ...(S.inv || []),
      ...L.map((x) => ({
        id: newId(),
        name: x.name,
        cat: x.cat,
        note: "",
        from: "told",
      })),
    ];
    toast(L.length === 1 ? `${L[0].name} added to your Home shelf` : `${L.length} things added to your Home shelf`);
  } else if (kd === "did" || kd === "went") {
    ui.qdraft = null;
    lifeRecord({ kind: kd, title: t, date: d > today ? today : d, mins: +g("#qa-m") || 0 });
    clearIn("qa-t");
    return;
  } else if (kd === "todo") {
    S.todos = [...(S.todos || []), { id, title: t, who: "you", date: d, note: "", done: false }];
    toast("To-do added for " + fmt(d));
  } else {
    if (r !== "once" && !s) return no("Add the time, for something that repeats");
    if (r === "pick" && !days.length) return no("Pick the days");
    const end = s ? (e && toMins(e) > toMins(s) ? e : clock24(toMins(s) + (kd === "remind" ? 15 : 60))) : null,
      title = kd === "remind" ? "⏰ " + t : t,
      kind = kd === "remind" ? "other" : kd;
    S.events = [
      ...(S.events || []),
      r === "once"
        ? { id, title, kind, who: w, start: s || null, end, rep: "once", date: d, days: [], from: today, note: "" }
        : { id, title, kind, who: w, start: s, end, rep: "weekly", days: [...days].sort(), from: today, note: "" },
    ];
    toast(
      r === "once"
        ? `${t}: ${fmt(d)}${s ? ", " + clock(toMins(s)) : ""}`
        : `${t}: ${days.length === 7 ? "every day" : days.map((x) => DAYN[x]).join(", ")}, ${clock(toMins(s))}`,
    );
  }
  sfx("ok");
  ui.qdays = [];
  ui.qdraft = null;
  commit();
  ["qa-t", "qa-s", "qa-e"].forEach(clearIn);
}
function parentView() {
  const p = S.parent || {},
    al = S.alarm || { on: false, time: "06:30" },
    d = dayDefaults();
  setSheetTitle("About you");
  return `<section class="card r-you tint" style="text-align:center;justify-items:center">${youBlob("bob", "happy", 'width="90" height="90"')}<h2 class="fs6">DeepKids is your planning partner</h2><p class="sm muted">It plans your mornings, evenings and the lessons in between. A few things about you help it plan better.</p></section>
   <section class="card"><div class="field"><label for="pName">What should we call you?</label><input class="inp" id="pName" maxlength="40" value="${esc(p.name || pname())}" placeholder="Your name"></div>
   <div class="fgrid"><div class="field"><label for="pWake">You usually wake up at</label><input class="inp" id="pWake" type="time" value="${al.time}"></div><div class="field"><label for="pPrep">Morning prep time</label><input class="inp" id="pPrep" type="time" value="${d.prepAt}"></div><div class="field"><label for="pStart">Learning starts at</label><input class="inp" id="pStart" type="time" value="${d.start}"></div><div class="field"><label for="pEve">Evening prep time</label><input class="inp" id="pEve" type="time" value="${d.eveAt}"></div></div>
   <label class="toggle" style="box-shadow:none;padding:0"><input type="checkbox" id="pAlarm" ${al.on ? "checked" : ""}><span><b class="h4">Wake-up alarm</b><br><span class="xs muted">Rings only while the app is open on this phone.</span></span></label>
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
    ? `<div class="col" style="gap:8px">${L.map(({ s, nx }) => `<div class="offer ${subjClass(s)}">${sblob(s)}<span style="min-width:0"><b class="h4">${esc(chT(nx.u))}</b><br><span class="xs muted">${SUBJ[s]} · Part ${nx.n} of ${nx.tot}</span><br><span class="xs est">${estTxt(nx.u, nx.n, nx.tot)}</span></span><button class="btn sm" data-act="more" data-s="${s}">Start</button></div>`).join("")}</div>`
    : `<p class="sm muted">Everything planned is done. Explore anything you like.</p>`;
}
/* The first week: one small thing a day, so a new family meets the app a piece at a time.
   [id, title, what to do, the "Show me" button's attributes, done already without a tick] */
const WEEK1 = [
  [
    "lesson",
    "Do one lesson together",
    "Pick the first lesson on today's list and do it with your child. Tick it when you finish.",
    "",
    () => S.log.length > 0,
  ],
  [
    "unit",
    "Try one experiment",
    "Open today's science topic and do its experiment with things from your kitchen. Most take 15 minutes.",
    'data-act="wk1exp"',
    () => Object.keys(fxSt().time).length > 0,
  ],
  [
    "week",
    "Tell DeepKids your week",
    "Type or say your classes, outings and chores, like “Swimming Tue and Thu 5 pm”. Lessons fit around them.",
    'data-act="gotab" data-tab="week" data-seg="days" data-focus="dumpText"',
    () => S.events.length > 0,
  ],
  [
    "print",
    "Print one worksheet",
    "Print a worksheet for one of your lessons. Ten minutes at the table, away from the screen.",
    'data-act="wk1ws"',
  ],
  [
    "iam",
    "Ask the Guru a “why”",
    "Children ask one every day. Tap IAm in the corner and ask it together, then try the answer out.",
    'data-act="wk1iam"',
  ],
  [
    "photo",
    "Save your child's work",
    "Take a photo of a drawing, a model or a worksheet. It goes into their learning diary and progress.",
    'data-act="uploads"',
  ],
  [
    "journey",
    "See how far you've come",
    "Open Progress: what's done, and how it matches the board. One week in!",
    'data-act="gotab" data-tab="journey"',
  ],
];
const wk1Done = ([id, , , , auto]) => !!(S.wk1?.done?.[id] || auto?.());
// the lessons a first-week step can open: today's, then what's next in each subject
const wk1Lessons = () => [
  ...dayPlan(today)
    .filter((i) => i.kind === "lesson")
    .map((i) => i.u),
  ...offers().map((o) => o.nx.u),
];
// the guide's lesson, experiment and printable come from the family's own track: on the DeepKids track a DeepKids unit
// (today's, else the first one), on a board track their board's lessons, and a DeepKids unit only when one is in today's plan
const wk1Unit = () =>
  wk1Lessons().find((u) => u.board === "unit") ||
  (onDkTrack() ? unitBy("unit|" + Object.values(DATA.units || {}).sort((a, b) => a.order - b.order)[0]?.id) : null);
// Day 2: an experiment opens at once. DeepKids track: the first experiment of a DeepKids unit. Board track: the
// experiment step of today's science lesson from their own book
function wk1Experiment() {
  const sci = dayPlan(today).filter((i) => i.kind === "lesson" && i.u.subj === "sci"),
    it = sci.find((i) => !i.done) || sci[0],
    u =
      it?.u.board === "unit"
        ? it.u
        : onDkTrack()
          ? wk1Lessons().find((x) => x.board === "unit" && x.subj === "sci") || wk1Unit()
          : null;
  if (u) return fxOpenExperiment(u.c.unit);
  if (it) return playItem(it, true);
  tab = "library";
  ui.lt = "topics";
  render();
}
// Day 1 starts a lesson from the card: a finished science unit, or today's first lesson, or the next one
function wk1Lesson(d0) {
  const U = wk1Unit();
  if (U)
    return [
      `Start with a science unit together: “${chT(U)}”. It opens right here.`,
      `<button class="btn sm" data-act="wk1unit">${icon("play")}Start the unit</button>`,
    ];
  const L = dayPlan(today).find((i) => i.kind === "lesson" && !i.done),
    o = !L && offers()[0];
  if (L)
    return [
      `Today's first lesson is “${chT(L.u)}”. Start it here and do it with your child.`,
      `<button class="btn sm" data-act="play" data-id="${L.id}">${icon("play")}Start the lesson</button>`,
    ];
  if (o)
    return [
      `No lesson is planned for today. If you like, start the next one now: “${chT(o.nx.u)}”.`,
      `<button class="btn sm" data-act="more" data-s="${o.s}">${icon("play")}Start it now</button>`,
    ];
  return [d0, ""];
}
function firstWeekCard() {
  if (!S.setup || S.wk1?.off) return "";
  // the guide lives for the family's first seven days and opens on that day's step; the dots and arrows look back or ahead
  if (!S.wk1?.start) S.wk1 = { ...(S.wk1 || {}), start: today }; // families set up before the guide had a start day begin today
  const k = Math.round((parse(today) - parse(S.wk1.start)) / 864e5);
  if (k < 0 || k > 6) return "";
  const v = ui.wk1at ?? k,
    [id, t, d0, go] = WEEK1[v],
    done = wk1Done(WEEK1[v]),
    [d, show] = id === "lesson" ? wk1Lesson(d0) : [d0, go ? `<button class="btn sm" ${go}>Show me</button>` : ""],
    step = (i, ic, label) =>
      `<button type="button" class="wk1arr" data-act="wk1go" data-i="${i}" aria-label="${label}" ${i < 0 || i > 6 ? "disabled" : ""}>${icon(ic)}</button>`,
    head = (n) =>
      `<div class="wk1h"><span class="eyebrow">Your first week · Day ${n + 1} of 7</span><span class="wk1dots">${step(n - 1, "back", "Day before")}${WEEK1.map((s, i) => `<button type="button" data-act="wk1go" data-i="${i}" class="${wk1Done(s) ? "on" : ""} ${i === n ? "cur" : ""}" aria-label="Day ${i + 1}: ${esc(s[1])}" ${i === n ? 'aria-current="step"' : ""}></button>`).join("")}${step(n + 1, "next", "Day after")}</span></div>`;
  return `<section class="card wk1">${head(v)}<div class="row wk1t">${blob("var(--sun)", 6 + v, done ? "happy" : "wow", "nb", 'width="40" height="40"')}<div><h3>${t}</h3><p class="sm">${d}</p></div></div>
   <div class="row">${show}${done ? `<span class="wk1ok">${icon("check")} Done</span>` : `<button class="btn soft sm" data-act="wk1done" data-k="${id}">${icon("check")} Done</button>`}<button class="link xs" data-act="wk1off">Hide this guide</button></div></section>`;
}
function viewToday() {
  const items = dayPlan(today),
    real = items.filter(isTask),
    dn = real.filter((i) => i.done).length,
    f = focusOf(items, today);
  const lessons = real.filter((i) => i.kind === "lesson"),
    lessonsDone = lessons.length > 0 && lessons.every((i) => i.done);
  let h = todayHero([
    ...(S.child ? [esc(S.child) + "'s day"] : []),
    shortDate(),
    real.length ? `${dn} of ${real.length} done` : "nothing planned",
  ]);
  if (S.setup && !S.parent?.saved && !S.parent?.name)
    h += `<button class="nudge" data-act="parent">${youBlob("", "happy", 'width="36" height="36"')}<span>${pname() ? "Set your wake-up and prep times" : "Tell us your name and wake-up time"}</span>${icon("next")}</button>`;
  if (ui.tday && ui.tday !== today) return h + otherDay(ui.tday);
  // the first-week guide on top, then what to do next, then the day as a list; the week's numbers sit below it
  h += `${firstWeekCard()}<section class="sec cal">${pastEvCard(real)}${nudgeCard()}${calHead(today)}`;
  if (lessonsDone || !real.length)
    h += `<section class="donecard">${blob("var(--sun)", 4, "happy", "mascot bob")}<h2>${lessons.length ? "Lessons done! Keep going?" : "Want to start something?"}</h2>${offerList()}</section>`;
  if (real.length) h += `<div class="tt compact daydrag">${real.map((i) => tRow(i, today, f)).join("")}</div>`;
  h += `</section><div class="lotusline" aria-hidden="true"></div>${real.some((i) => !i.done) ? "" : fxTodayTop(!window.FXANIMED)}`; // the founder's lotus pond marks where the day's plan ends; "Continue learning" only comes once everything planned is done (it animates in the first time only)
  window.FXANIMED = 1;
  h += `<button class="morebtn" data-act="moresheet">${icon("grid")}<span>More for today</span><span class="xs muted">quiz, photos, jokes, games, your reading</span></button>`;
  return h;
}
function fxTodayTop(animate) {
  const units = Object.keys(DATA.units || {}).map((id) => ({
    id,
    st: fxUnitSt("unit|" + id),
    t: Object.values(fxSt().time[id] || {}).reduce((a, b) => a + b, 0),
  }));
  const going = units.filter((x) => x.st === "learning").sort((a, b) => b.t - a.t);
  const c = going[0];
  let cont = "";
  if (c) {
    const I = DATA.units[c.id],
      X = fxStates(c.id),
      pct = Math.round((100 * X.filter((z) => z === "done").length) / Math.max(1, X.length));
    cont = `<button class="fxcont" data-act="fxopen" data-u="${esc(c.id)}"><img src="${esc(unitPic(c.id))}" alt=""><span><span class="xs muted">Continue learning</span><b>${esc(I.title)}</b><span class="fxbar"><i style="width:${pct}%"></i></span><span class="xs muted">${pct}% done</span></span></button>`;
  }
  const L = dayPlan(today).filter((x) => x.kind === "lesson"),
    pic = !L.length
      ? ["empty-rest", "No lessons today. Rest, play outside, wonder about something."]
      : L.every((x) => x.done)
        ? ["empty-done", "All of today's lessons are done. Well learned!"]
        : null;
  const em = pic ? `<div class="fxempty"><img src="media/ui/${pic[0]}.jpg" alt=""><p>${pic[1]}</p></div>` : "";
  return em || cont ? `<section class="sec fxtoday${animate ? " fxanim" : ""}">${em}${cont}</section>` : "";
}

/* What this file's buttons do, by their data-act name; the click handler in 21-actions.js calls ACT[name](button, event, name, b.dataset.k) */
Object.assign(ACT, {
  topen(b, e, a, k) {
    const id = b.dataset.id,
      cur = !!ui.open[id];
    ui.open[id] = !cur;
    sfx(cur ? "tap" : "flip");
    render();
  },
  play(b, e, a, k) {
    const it = findItem(b.dataset.id);
    if (it) {
      sfx("flip");
      playItem(it);
    }
  },
  more(b, e, a, k) {
    const s = b.dataset.s;
    ui.more[s] = true;
    sfx("tick");
    _sess = null;
    const it = dayPlan(today).find((i) => i.kind === "lesson" && i.s === s && !i.done);
    render();
    if (it) playItem(it);
  },
  less(b, e, a, k) {
    ui.more[b.dataset.s] = false;
    sfx("flip");
    render();
  },
  skip(b, e, a, k) {
    S.skips[today + "|" + b.dataset.s] = true;
    sfx("flip");
    toast("Moved to the next lesson day");
    commit();
  },
  swap(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "swap", s: b.dataset.s });
  },
  tday(b, e, a, k) {
    // the day changes in place: the day header stays where it was on the screen, only the list below it changes
    const d = b.dataset.d,
      top = document.querySelector(".calhead")?.getBoundingClientRect().top;
    ui.tday = d === "0" ? null : addDays(ui.tday || today, +d);
    if (ui.tday === today) ui.tday = null;
    sfx("tap");
    render();
    const el = document.querySelector(".calhead");
    if (el && top != null) scrollBy(0, el.getBoundingClientRect().top - top);
  },
  quickday(b, e, a, k) {
    navPush();
    ui.pday = b.dataset.d;
    ui.pv = "day";
    tab = "week";
    render();
    scrollTo(0, 0);
  },
  moresheet(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "more" });
  },
  plsheet(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "pl", p: b.dataset.p });
  },
  learn(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "learn" });
  },
  quickplan(b, e, a, k) {
    tab = "week";
    render();
    scrollTo(0, 0);
  },
  free(b, e, a, k) {
    openPicker();
  },
  games(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "games" });
  },
  night(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "night" });
  },
  nightdone(b, e, a, k) {
    S.night = { ...(S.night || {}), [today]: 1 };
    sfx("win");
    toast("All set. Sleep well!");
    sheet.close();
    commit();
  },
  parent(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "parent" });
  },
  phelp(b, e, a, k) {
    ui.phelp = ui.phelp || new Set((S.parent || {}).help || []);
    ui.phelp.has(b.dataset.s) ? ui.phelp.delete(b.dataset.s) : ui.phelp.add(b.dataset.s);
    b.setAttribute("aria-pressed", ui.phelp.has(b.dataset.s));
    sfx("tap");
  },
  psave(b, e, a, k) {
    const g = (id) => document.getElementById(id).value;
    S.parent = {
      ...(S.parent || {}),
      name: g("pName").trim(),
      langs: g("pLang").trim(),
      help: [...(ui.phelp || new Set((S.parent || {}).help || []))],
      saved: Date.now(),
    };
    ui.phelp = null;
    S.alarm = { on: document.getElementById("pAlarm").checked, time: g("pWake") || "06:30" };
    S.day = {
      ...dayDefaults(),
      prepAt: g("pPrep") || dayDefaults().prepAt,
      start: g("pStart") || dayDefaults().start,
      eveAt: g("pEve") || dayDefaults().eveAt,
    };
    sfx("win");
    S.updatedAt = Date.now();
    sheet.close();
    render();
    saveNow().then((ok) =>
      toast(
        ok
          ? S.parent.name
            ? "Saved. Hi, " + S.parent.name + "!"
            : "Saved to your account"
          : store
            ? "Couldn't reach your account. Saved on this phone; it will retry."
            : "Saved",
      ),
    );
  },
  quick(b, e, a, k) {
    sfx("flip");
    ui.qaOpen = !ui.qaOpen;
    render();
    if (ui.qaOpen) setTimeout(() => document.getElementById("qa-t")?.focus(), 80);
  },
  qwho(b, e, a, k) {
    ui.qwho = b.dataset.w;
    b.parentElement.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    sfx("tap");
  },
  qaddq(b, e, a, k) {
    quickSave(b.closest(".addbox"));
  },
  qkind(b, e, a, k) {
    qaKeep(b);
    ui.qkind = b.dataset.k;
    ui.qrep = ui.qwho = null;
    ui.qdays = [];
    sfx("tap");
    render();
    if (sheet.open) renderSheet();
  },
  qrep(b, e, a, k) {
    qaKeep(b);
    ui.qrep = b.dataset.r;
    sfx("tap");
    render();
    if (sheet.open) renderSheet();
  },
  qday(b, e, a, k) {
    qaKeep(b);
    const d = +b.dataset.d,
      days = ui.qdays || [];
    ui.qdays = days.includes(d) ? days.filter((x) => x !== d) : [...days, d];
    sfx("tap");
    render();
    if (sheet.open) renderSheet();
  },
  todomove(b, e, a, k) {
    const x = (S.todos || []).find((z) => z.id === b.dataset.t);
    if (x) {
      x.date = tomorrow();
      sfx("flip");
      toast("Moved to tomorrow");
      commit();
    }
  },
  tlcheck(b, e, a, k) {
    const date = b.dataset.date,
      it = dayPlan(date).find((i) => i.id === b.dataset.id);
    if (!it) return;
    if (it.kind === "event" && evGate(it, date)) return;
    if (["lesson", "warm", "refresh"].includes(it.kind) && !it.done) {
      openSheet({ mode: "iopts", date, id: it.id });
      return;
    }
    if (it.kind === "prep") {
      const all = it.prep.every((p) => S.prep[p.id]);
      it.prep.forEach((p) => {
        if (all) delete S.prep[p.id];
        else S.prep[p.id] = today;
      });
      sfx(all ? "flip" : "ok");
    } else if (it.kind === "exps") {
      S.exps
        .filter((x) => !x.closed && x.start <= date)
        .forEach((x) => {
          if (!x.checks.includes(today)) x.checks.push(today);
        });
      sfx("ok");
    } else if (it.kind === "lesson") {
      if (it.done) {
        toast("Already done today");
        return;
      }
      if (date !== today) {
        openSheet({ mode: "chapter", k: it.u.k });
        return;
      }
      return playItem(it);
    } else if (it.kind === "todo") {
      const x = it.td;
      if (x.done && x.doneOn === date) {
        x.done = false;
        delete x.doneOn;
        sfx("flip");
      } else {
        x.done = true;
        x.doneOn = date;
        sfx("ok");
      }
    } else {
      const key = date + "|" + it.id;
      if (S.tl[key]) delete S.tl[key];
      else {
        S.tl[key] = Date.now();
        sfx("ok");
      }
    }
    commit();
  },
  tlopen(b, e, a, k) {
    const date = b.dataset.date,
      it = dayPlan(date).find((i) => i.id === b.dataset.id);
    if (!it) return;
    sfx("tap");
    if (it.kind === "prep") return openSheet({ mode: "prep", date, when: it.id });
    if (it.kind === "lesson") return it.done ? openSheet({ mode: "chapter", k: it.u.k }) : playItem(it);
    if (it.kind === "warm") return openSheet({ mode: "games" });
  },
  prep(b, e, a, k) {
    const id = b.dataset.id;
    if (S.prep[id]) delete S.prep[id];
    else {
      S.prep[id] = today;
      sfx("tick");
    }
    commit();
  },
  delev(b, e, a, k) {
    S.events = (S.events || []).filter((x) => x.id !== b.dataset.e);
    sfx("flip");
    commit();
  },
  refresh(b, e, a, k) {
    sfx("flip");
    const date = b.dataset.date || today;
    // today's refresher is built first (a DeepKids unit's questions are loaded), then it opens with its first question
    if (date === today) rfBuild(date).then(() => openSheet({ mode: "refresh", date }));
    else openSheet({ mode: "refresh", date });
  },
  uploads(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "uploads" });
  },
  iopts(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "iopts", date: b.dataset.date, id: b.dataset.id });
  },
  evmiss(b, e, a, k) {
    const date = b.dataset.date,
      id = b.dataset.id;
    S.evlog = { ...(S.evlog || {}), [date + "|" + id]: { went: false, at: Date.now() } };
    S.tl[date + "|e-" + id] = "missed";
    sfx("flip");
    toast("Noted: didn't happen");
    commit();
  },
  wk1done(b, e, a, k) {
    S.wk1 = { ...(S.wk1 || {}), done: { ...(S.wk1?.done || {}), [b.dataset.k]: today } };
    ui.wk1at = null;
    sfx("win");
    toast(
      WEEK1.every(wk1Done)
        ? "Your first week is done. Well done, both of you!"
        : "Lovely. The next one is waiting for tomorrow.",
    );
    commit();
  },
  wk1go(b, e, a, k) {
    ui.wk1at = +b.dataset.i;
    sfx("flip");
    render();
  },
  wk1exp(b, e, a, k) {
    wk1Experiment();
  },
  wk1unit(b, e, a, k) {
    fxOpen(wk1Unit().c.unit);
  },
  wk1ws(b, e, a, k) {
    // the first lesson with something to print: a DeepKids unit opens at its first worksheet, a DeepKids
    // lesson at its own worksheet, a board chapter at its topic's worksheets
    const u = wk1Unit() || wk1Lessons().find((x) => x.c?.p?.worksheets?.length || wsOf(x).length);
    if (u?.board === "unit")
      fxOpen(u.c.unit).then(() => {
        const i = (FXALL?.sections || []).findIndex((x) => x.id.startsWith("ws-"));
        if (i >= 0) fxGo(i, 0);
      });
    else if (u?.c?.p?.worksheets?.length) openSheet({ mode: "ws", k: u.k, w: u.c.p.worksheets[0].id });
    else if (u) openSheet({ mode: "wsv", k: u.k, i: 0 });
    else {
      tab = "library";
      ui.lt = "science";
      render();
    }
  },
  wk1iam(b, e, a, k) {
    document.getElementById("fxFab")?.click();
  },
  wk1off(b, e, a, k) {
    S.wk1 = { ...(S.wk1 || {}), off: true };
    sfx("flip");
    toast("Hidden. You can find every feature from the menu.");
    commit();
  },
  gotab(b, e, a, k) {
    navPush();
    if (b.dataset.qs) {
      ui.qs = b.dataset.qs;
      ui.tq = "les";
    }
    const dl = document.getElementById("sheet");
    if (dl?.open) {
      ui.sheet = null;
      dl.close();
    }
    tab = b.dataset.tab;
    if (b.dataset.seg) ui.seg = { ...(ui.seg || {}), [tab]: b.dataset.seg };
    sfx("flip");
    render();
    scrollTo(0, 0);
    // a "Show me" can point at one box on that screen
    const f = b.dataset.focus && document.getElementById(b.dataset.focus);
    if (f) {
      f.scrollIntoView({ block: "center" });
      f.focus({ preventScroll: true });
    }
  },
  tofinish(b, e, a, k) {
    navPush();
    tab = "week";
    ui.seg = { ...(ui.seg || {}), week: "finish" };
    sfx("flip");
    render();
    scrollTo(0, 0);
  },
  check(b, e, a, k) {
    const x = S.exps.find((x) => x.id === b.dataset.e);
    if (x && !x.checks.includes(today)) {
      x.checks.push(today);
      sfx("ok");
      commit();
    }
  },
  addexp(b, e, a, k) {
    const v = document.getElementById("newExp").value.trim();
    if (v) {
      addExp(v, "Our own experiment");
      sfx("ok");
      commit();
      clearIn("newExp");
    }
  },
});
