/* ---------- sheet + render ---------- */
const sheet = document.getElementById("sheet");
function openSheet(o) {
  navPush();
  ui.sheet = o;
  if (!sheet.open) sheet.showModal();
  renderSheet(true);
  updBack();
}
function renderSheetV0(top) {
  if (!ui.sheet) return;
  {
    const ex = document.getElementById("sheetExtra");
    if (ex && !ex.querySelector(".readbtn"))
      ex.innerHTML = `<button class="readbtn" data-act="readnow" aria-label="Read this page aloud">🔊</button>`;
  }
  const b = document.getElementById("sheetBody"),
    y = sheet.scrollTop;
  _sess = null;
  const m = ui.sheet.mode;
  sheet.className =
    "sheet" +
    (m === "player"
      ? " colored " + SC(ui.sheet.s)
      : m === "chapter" || m === "ws"
        ? " " + SC(unitBy(ui.sheet.k)?.subj || "")
        : "");
  const V = {
    more: moreView,
    pl: plView,
    jr: jrView,
    learn: learnView,
    player: playerView,
    chapter: chapterView,
    ws: wsView,
    todo: todoView,
    folder: folderView,
    plus: plusView,
    qzs: qzsView,
    quizz: quizzView,
    rfset: rfsetView,
    wfguide: wfGuideView,
    wsv: wsViewSheet,
    rem: remView,
    iopts: ioptsView,
    evpre: evpreView,
    evdone: evdoneView,
    exam: examView,
    told: toldView,
    uploads: uploadsView,
    track: trackView,
    school: schoolView,
    hist: historyView,
    refresh: refreshView,
    prep: prepView,
    games: gamesView,
    settings: settingsView,
    night: nightView,
    parent: parentView,
    swap: swapView,
    jsub: jsubView,
  };
  const h = (V[m] || settingsView)();
  updBack();
  const kept = top ? null : keepInputs(b);
  b.replaceChildren(el(h));
  if (kept) restoreInputs(b, kept);
  sheet.scrollTop = top ? 0 : y;
  requestAnimationFrame(initPads);
  if (m === "player") paintTimer();
}
function renderSheetV1(...a) {
  const b = document.getElementById("sheetBody"),
    s = a[0] ? null : scrollSnap(b),
    r = renderSheetV0.apply(this, a);
  scrollBack(document.getElementById("sheetBody"), s);
  return r;
}
function renderSheet() {
  const r = renderSheetV1.apply(this, arguments);
  applyAll();
  editBtn();
  return r;
}
document.getElementById("sheetClose").onclick = () => {
  sfx("tap");
  goBack();
};
sheet.addEventListener("close", () => {
  if (sheet.open) return;
  ui.phelp = null;
  sheet.className = "sheet";
  ui.sheet = null;
  clearInterval(tick);
  render();
  updBack();
});
const NAV = [
  ["today", "Today"],
  ["week", "Plan"],
  ["journey", "Progress"],
  ["library", "Library"],
];
function renderV0() {
  if (tab === "today" && ui.lastTab && ui.lastTab !== "today") ui.tday = null;
  ui.lastTab = tab;
  fixWork();
  fixRoutines();
  dedupeEv();
  rollDay();
  _sess = null;
  const m = document.getElementById("main"),
    nav = document.getElementById("nav");
  if (!ACC) {
    nav.hidden = true;
    document.getElementById("me").hidden = true;
    document.getElementById("snd").hidden = true;
    document.getElementById("hello").innerHTML =
      `${youBlob("bl bob")}<div><b>Welcome</b><span>DeepKids home planner</span></div>`;
    m.replaceChildren(el(`<div class="wrap">${loginView()}</div>`));
    if (sheet.open) sheet.close();
    return;
  }
  document.getElementById("snd").hidden = false;
  if (!S.setup && !ob) return startOnboarding(0);
  nav.hidden = !!ob;
  document.getElementById("me").hidden = !!ob;
  document.getElementById("snd").innerHTML = icon(soundOn ? "sound" : "mute");
  document.getElementById("snd").setAttribute("aria-label", soundOn ? "Turn sound off" : "Turn sound on");
  document.getElementById("me").innerHTML = icon("grid");
  document.getElementById("hello").innerHTML =
    `${youBlob("bl bob")}<div style="min-width:0"><b>${ob ? "Hello!" : pname() ? "Hi, " + esc(pname()) : "Hi there!"}</b><span>${ob ? "Let's set up your year" : (S.child ? esc(S.child) + "'s learning · " : "") + (S.board === "none" ? "DeepKids Plus" : S.board === "combined" ? "Combined boards" : BOARDS[S.board])}</span></div>`;
  nav.innerHTML = NAV.map(
    ([k, n]) =>
      `<button data-tab="${k}" ${tab === k ? 'aria-current="page"' : ""}>${icon(k)}<span>${n}</span></button>`,
  ).join("");
  const sx = [...m.querySelectorAll(".hs")].map((x) => x.scrollLeft);
  const banner =
    !ob && nightDue()
      ? `<button class="nightbar" data-act="night">${blob("var(--peri)", 17, "sleepy", "", 'width="34" height="34"')}<span><b>Tomorrow isn't ready yet</b><br><span class="xs">${nightItems().filter((p) => !S.prep[p.id]).length} things to get ready · tap to finish</span></span>${icon("next")}</button>`
      : "";
  const vk = ob ? "ob" + ob.step : tab,
    kept = ui.lastView === vk ? keepInputs(m) : null;
  ui.lastView = vk;
  m.replaceChildren(
    el(
      `<div class="wrap">${banner}${ob ? viewOnboarding() : { today: viewToday, week: viewPlanner, tasks: viewTasks, library: viewLibrary, journey: viewJourneyTabs }[tab]()}</div>`,
    ),
  );
  if (kept) restoreInputs(m, kept);
  m.querySelectorAll(".hs").forEach((x, i) => {
    if (sx[i]) x.scrollLeft = sx[i];
  });
  if (ui.sheet && sheet.open) renderSheet();
}
function renderV1() {
  if (ui.profDay !== today) {
    ui.profDay = today;
    try {
      profAuto();
    } catch (e) {}
  }
  return renderV0.apply(this, arguments);
}
function renderV2(...a) {
  dksMigrate();
  const m = document.getElementById("main"),
    s = scrollSnap(m),
    r = renderV1.apply(this, a);
  scrollBack(document.getElementById("main"), s);
  return r;
}
function renderV3() {
  const r = renderV2.apply(this, arguments);
  applyAll();
  editBtn();
  return r;
}
function renderV4() {
  const r = renderV3.apply(this, arguments);
  try {
    if (ACC) fxFab();
  } catch (e) {}
  return r;
}
function render() {
  const r = renderV4.apply(this, arguments);
  try {
    fxWay();
  } catch (e) {}
  return r;
}
