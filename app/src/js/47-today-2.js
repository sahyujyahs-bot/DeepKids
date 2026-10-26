/* ---------- Today ---------- */
function stepState(it) {
  const tk = new Set(S.steps[stepKey(it)] || []),
    u = it.u;
  const carried = ((S.carry || {})[u.k] || [])
    .filter((c) => c.forN === it.n)
    .map((c) => ({
      kind: c.kind,
      label: c.label,
      title: "From last time: " + c.title,
      mins: c.mins,
      html: c.name?.startsWith("pk:")
        ? packStepByName(u, c.name)
        : u.c?.x && c.name && !c.name.startsWith("opt:")
          ? stepBody(u, c.name)
          : `<p>${esc(c.title)}</p>`,
      name: c.name,
      carried: true,
    }));
  const base = u.c?.p
    ? daySteps(u, it.n, it.tot)
    : modeOf() === "books" && u.board !== "gen" && u.board !== "dk"
      ? bookSteps(u, it.n, it.tot)
      : optionSteps(u, it.n, it.tot, today);
  return [...carried, ...base].map((x, i) => ({ ...x, ok: tk.has(sid(x)) }));
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

function viewTodayV0() {
  const items = dayPlan(today),
    real = items.filter((i) => i.kind !== "brk"),
    dn = real.filter((i) => i.done).length,
    f = focusOf(items, today);
  const lessons = real.filter((i) => i.kind === "lesson"),
    lessonsDone = lessons.length > 0 && lessons.every((i) => i.done),
    left = real.filter((i) => !i.done && i !== f),
    doneL = real.filter((i) => i.done);
  let h = greetBar(
    `${longDate()} · ${real.length ? (f ? `${real.length - dn} thing${real.length - dn === 1 ? "" : "s"} left` : "all done") : "nothing planned"}`,
  );
  if (S.setup && !S.parent?.saved && !S.parent?.name)
    h += `<button class="nudge" data-act="parent">${youBlob("", "happy", 'width="36" height="36"')}<span>${pname() ? "Set your wake-up and prep times" : "Tell us your name and wake-up time"}</span>${icon("next")}</button>`;
  if (ui.tday && ui.tday !== today) return h + otherDay(ui.tday);
  h += `<section class="sec cal">${calHead(today)}`;
  h += pastEvCard(real);
  if (f) h += nowCard(f);
  h += nudgeCard();
  if (lessonsDone || !real.length)
    h += `<section class="donecard">${blob("var(--sun)", 4, "happy", "mascot bob")}<h2>${lessons.length ? "Lessons done! Keep going?" : "Want to start something?"}</h2>${offerList()}</section>`;
  if (left.length)
    h += `<div class="sech" style="margin-top:12px"><h3>Later today</h3></div><div class="tt compact">${left.map((i) => tRow(i, today, null)).join("")}</div>`;
  if (doneL.length)
    h += `<button class="donebar" data-act="showdone" aria-expanded="${!!ui.showDone}"><span class="ck on">${icon("check")}</span><b>${doneL.length} done today</b><span class="xs">${ui.showDone ? "Hide" : "Show"}</span></button>${ui.showDone ? `<div class="tt compact">${doneL.map((i) => tRow(i, today, null)).join("")}</div>` : ""}`;
  {
    const oc = openCount(),
      tile = (act, ic, label, sub, extra = "") =>
        `<button class="qtile" data-act="${act}" ${extra}><span class="qi">${icon(ic)}</span><b>${label}</b><span class="xs muted">${sub}</span></button>`;
    h += `<div class="qtiles">${tile("gotab", "prep", "Unfinished", oc ? oc + " open" : "All caught up", 'data-tab="week" data-seg="ongoing"')}${tile("gotab", "play", "Up next", "Next chapters", 'data-tab="week" data-seg="queue"')}${tile("quizgo", "spark", "Quick quiz", "Ask a few questions")}${tile("uploads", "plus", "Add photos", "Work samples")}</div>`;
  }
  h += `</section><button class="morebtn" data-act="moresheet">${icon("grid")}<span>More for today</span><span class="xs muted">jokes, games, experiments, your reading</span></button>`;
  return h;
}
function viewTodayV1() {
  const h = viewTodayV0();
  if (ui.tday && ui.tday !== today) return h;
  const first = !window.FXANIMED;
  window.FXANIMED = 1;
  return h.replace(
    '<section class="sec cal">',
    fxTodayTop().replace('class="sec fxtoday"', 'class="sec fxtoday' + (first ? " fxanim" : "") + '"') +
      '<section class="sec cal">',
  );
}
function viewToday() {
  const h = viewTodayV1();
  return ui.tday && ui.tday !== today ? h : h.replace('<div class="calhead">', '<div class="calhead fxnodate">');
}
