/* ---------- what to show next, and honest choices instead of "Done" for everything ---------- */
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
