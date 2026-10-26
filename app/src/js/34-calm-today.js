/* ---------- calm Today: one thing now, a short list, everything else behind More ---------- */
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
  const P = {
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
    dkt: [`data-act="chapter" data-k="${it.u?.k}"`, "Open the topic"],
  }[it.kind] || [`data-act="tlcheck" ${a}`, "Done"];
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

/* ---------- calm Planner: tell us, see the plan, the rest behind rows ---------- */
const PL = {
  queue: "Up next",
  events: "Classes, outings and to-dos",
  calendar: "Bring in your calendars",
  day: "Your day",
  pace: "Pace",
  asks: "DeepKids asks",
};
function plView() {
  const p = ui.sheet.p;
  document.getElementById("sheetTitle").textContent = PL[p] || "Planner";
  if (p === "queue") return queueCard();
  if (p === "calendar") return calendarCard();
  return plPart(p) || `<p class="note">Nothing here yet.</p>`;
}
