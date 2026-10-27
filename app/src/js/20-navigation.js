/* Screens and sheets: render, tabs, back, breadcrumbs */
/* keep sideways (and inner) scroll positions when the screen redraws, e.g. jokes in a row */
function scrollSnap(root) {
  if (!root) return null;
  const L = [...root.querySelectorAll("div,section,ul,ol,nav")],
    out = [];
  L.forEach((e) => {
    if (e.scrollLeft > 0 || e.scrollTop > 0) {
      const cls = e.className || "",
        i = L.filter((z) => (z.className || "") === cls).indexOf(e);
      out.push({ cls, i, x: e.scrollLeft, y: e.scrollTop });
    }
  });
  return out;
}
function scrollBack(root, snap) {
  if (!root || !snap?.length) return;
  const L = [...root.querySelectorAll("div,section,ul,ol,nav")];
  snap.forEach((s) => {
    const e = L.filter((z) => (z.className || "") === s.cls)[s.i];
    if (e) {
      if (s.x) e.scrollLeft = s.x;
      if (s.y) e.scrollTop = s.y;
    }
  });
}
const SEGS = {
  week: [
    ["cal", "Calendar", "Your plan by day, week, month or year, and where you add classes, trips and to-dos."],
    ["next", "Up next", "What comes next in each subject. Drag to change the order."],
    ["finish", "To finish", "What your child started, and what is still to try."],
    ["refresh", "Refresher", "Past topics your child goes back over, so they stick."],
    [
      "family",
      "Settings",
      "Lesson times, subjects, your child's level, how fast each subject goes, and the refresher.",
    ],
  ],
  tasks: [
    ["going", "Started", "Started and not finished yet: lessons, worksheets, quizzes, projects and more"],
    ["new", "Not started", "From lessons you've done: things that weren't started yet"],
    ["queue", "Queues", "What comes next for each kind. Drag or use the arrows to change the order"],
  ],
  journey: [
    ["overview", "Overview", "How each subject is going, chapter by chapter"],
    ["time", "Time", "How much time, by day, week or month, and everything done"],
    ["work", "Photos and files", "Photos, videos and files of what your child made, and what's still to do"],
    ["school", "School", "Report, entrance test and a folder to send to a school"],
  ],
};
const seg = (k) => {
  ui.seg = ui.seg || {};
  const L = SEGS[k];
  return L.some((x) => x[0] === ui.seg[k]) ? ui.seg[k] : L[0][0];
};
function segBar(k) {
  const cur = seg(k),
    L = SEGS[k];
  return `<div class="seg segmain">${L.map(([v, n, d]) => `<button aria-pressed="${cur === v}" data-act="seg" data-k="${k}" data-v="${v}" title="${esc(d)}">${n}</button>`).join("")}</div>`;
}
const pageHead = (t, extra = "") =>
  `<section class="sec" style="margin-top:8px"><div class="sech"><h1 style="font-size:30px">${t}</h1>${extra}</div>`;
const DEX = [
  ["A class or tuition", "Swimming every Tue and Thu 5 to 6 pm"],
  ["A trip or outing", "Visiting grandma in Mysore from 2 to 5 Nov"],
  ["Rest or meals", "Liri naps 2 to 3 pm every day"],
  ["Something we own", "We have a microscope, Ludo and a globe"],
  ["A to-do", "Buy a geometry box this week"],
];
const navSnap = () => ({
  tab,
  lt: ui.lt,
  pv: ui.pv,
  pday: ui.pday,
  tday: ui.tday,
  sheet: ui.sheet ? JSON.parse(JSON.stringify(ui.sheet)) : null,
  ctab: ui.sheet?.k ? ui.ctab[ui.sheet.k] : undefined,
  y: scrollY,
});
let navHist = [],
  navRestoring = false;
function navPush() {
  if (navRestoring) return;
  navHist.push(navSnap());
  if (navHist.length > 40) navHist.shift();
  try {
    history.pushState({ dk: navHist.length }, "");
  } catch (e) {}
  updBack();
}
function navBack() {
  if (!navHist.length) return;
  const s = navHist.pop();
  navRestoring = true;
  tab = s.tab;
  ui.lt = s.lt;
  ui.pv = s.pv;
  ui.pday = s.pday;
  ui.tday = s.tday;
  if (s.sheet) {
    if (s.sheet.k) {
      if (s.ctab) ui.ctab[s.sheet.k] = s.ctab;
      else delete ui.ctab[s.sheet.k];
    }
    ui.sheet = s.sheet;
    if (!sheet.open) sheet.showModal();
    renderSheet(true);
    render();
  } else {
    if (sheet.open) sheet.close();
    else render();
  }
  requestAnimationFrame(() => scrollTo(0, s.y || 0));
  navRestoring = false;
  updBack();
}
function goBack() {
  if (!navHist.length) {
    if (sheet.open) sheet.close();
    return;
  }
  sfx("tap");
  try {
    history.back();
  } catch (e) {
    navBack();
  }
}
function updBack() {
  const b = document.getElementById("backTop");
  if (b) b.hidden = !navHist.length || !ACC;
  const c = document.getElementById("sheetClose"),
    top = navHist[navHist.length - 1];
  if (c && sheet.open) {
    const bk = !!top?.sheet;
    c.innerHTML = bk ? icon("back") : icon("close");
    c.setAttribute("aria-label", bk ? "Back" : "Close");
  }
}
function settingsView() {
  const grp = (id, t, sub, body, open) =>
    `<details class="card sgrp" ${open || ui.sopen === id ? "open" : ""}><summary><b>${t}</b><span class="xs muted">${sub}</span></summary><div class="sgbody">${body}</div></details>`;
  const R = S.rem || {},
    out = `${accountCard()}
  ${grp(
    "you",
    "You and your child",
    `${pname() ? esc(pname()) : "Your profile"} · ${esc(S.child || "child")}, ${S.age || ""}`,
    `<section class="card r-you tint"><div class="row" style="flex-wrap:nowrap;gap:12px">${youBlob("", "happy", 'width="48" height="48"')}<div><b style="font:600 17px var(--display)">${pname() ? esc(pname()) : "Your profile"}</b><p class="xs muted">${S.parent?.saved || S.parent?.name ? `Wakes ${clock(hm((S.alarm || {}).time || "06:30"))} · prep ${clock(hm(D().prepAt))} and ${clock(hm(D().eveAt))}` : "Not set up yet"}</p></div></div><button class="btn soft sm" data-act="parent" style="justify-self:start">Edit my profile</button></section>
    <div class="field"><label for="sName">Child's name</label><input class="inp" id="sName" maxlength="40" value="${esc(S.child)}"></div><div class="field"><label for="sStart">Plan starts on</label><input class="inp" id="sStart" type="date" value="${S.start}"></div><button class="btn sm" data-act="saveset" style="justify-self:start">Save</button>`,
  )}
  ${grp(
    "learn",
    "Syllabus and how you learn",
    `${S.board === "none" ? "DeepKids Plus" : S.board === "combined" ? "NCERT, Cambridge and NIOS" : BOARDS[S.board]} · ${esc(MODES[modeOf()][0])}`,
    `<span class="eyebrow">How you learn</span><select class="inp" id="sMode">${Object.entries(MODES)
      .map(([k, [n]]) => `<option value="${k}" ${modeOf() === k ? "selected" : ""}>${n}</option>`)
      .join(
        "",
      )}</select><p class="xs muted">${esc(MODES[modeOf()][1])}</p><label class="toggle" style="box-shadow:none;padding:0"><input type="checkbox" id="sExam" ${S.exam ? "checked" : ""}><span><b style="font:600 16px var(--display)">Exam track</b><br><span class="xs muted">Every syllabus chapter comes first, in a sensible order, so nothing is missed before exams.</span></span></label><button class="btn sm" data-act="saveset" style="justify-self:start">Save</button>
    <span class="eyebrow" style="margin-top:8px">Syllabus</span><p class="sm">${S.board === "none" ? "DeepKids Plus only" : S.board === "combined" ? "NCERT, Cambridge and NIOS" : BOARDS[S.board]}${S.plus && S.board !== "none" ? " + DeepKids Plus" : ""} · ${S.subjects.map((s) => SUBJ[s]).join(", ")}</p><button class="btn line sm" data-act="redo" style="justify-self:start">Change syllabus or subjects</button>`,
  )}
  ${grp(
    "guide",
    "Walkthrough",
    S.guide?.on === false ? "Off" : "On: each screen shows its tips the first time",
    `<label class="zrow"><input type="checkbox" data-act="guidetoggle" ${S.guide?.on === false ? "" : "checked"}><span>Show tips on each screen</span></label><p class="xs muted">Turning it on again shows every screen's tips once more. The ? at the top shows the tips for the screen you're on at any time.</p>`,
  )}
  ${grp("day", "Your day", `Lessons from ${clock(hm(D().start))} · lunch ${clock(hm(D().lunch))}`, plPart("day"))}
  ${grp("cal", "Calendar link", S.cal?.on ? "Google Calendar linked" : "Not linked", calendarCard())}
  ${grp("rem", "Reminders", R.time ? `Daily at ${clock(hm(R.time))}` : "Free-time nudges on Today", remView())}
  ${grp("data", "Your data", "Save a copy, or bring one in from another device", dataBox())}
  ${grp("sound", "Sound and reading aloud", `${soundOn ? "Sounds on" : "Sounds off"} · ${S.autoRead ? "reads each step aloud" : "read aloud on tap"}`, `<label class="zrow"><input type="checkbox" data-act="sndtoggle" ${soundOn ? "checked" : ""}><span><b class="sm">Sounds</b><br><span class="xs muted">Little chimes when things are done</span></span></label><label class="zrow"><input type="checkbox" data-act="autoread" ${S.autoRead ? "checked" : ""}><span><b class="sm">Read each lesson step aloud</b><br><span class="xs muted">Or tap 🔊 on any screen to hear it</span></span></label>`)}
  <p class="xs muted">${syncMode === "account" ? `Everything is saved privately to your claude.ai account${lastSaved ? " · last saved " + new Date(lastSaved).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : ""}. It follows you to any device where you're signed in.` : store ? "Couldn't reach your account just now. Saved on this device; it will retry." : "Saved in this browser only."}</p>`;
  document.getElementById("sheetTitle").textContent = "Settings";
  return out;
}
const sheet = document.getElementById("sheet");
function openSheet(o) {
  navPush();
  ui.sheet = o;
  if (!sheet.open) sheet.showModal();
  renderSheet(true);
  updBack();
}
// The open sheet: keeps the reader's scroll place, then the edit layer and edit button
function renderSheet(top) {
  const body = document.getElementById("sheetBody"),
    place = top ? null : scrollSnap(body);
  renderSheetBody(top);
  scrollBack(body, place);
  applyAll();
  editBtn();
}
function renderSheetBody(top) {
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
const NAV = [
  ["today", "Today"],
  ["week", "Plan"],
  ["journey", "Progress"],
  ["library", "Library"],
];
// The whole screen: the daily profile check, the main view (keeping its scroll place), then the
// edit layer, the AI button and the way-finding bar
function render() {
  if (ui.profDay !== today) {
    ui.profDay = today;
    try {
      profAuto();
    } catch (e) {}
  }
  sciMerge();
  const main = document.getElementById("main"),
    place = scrollSnap(main);
  renderMain();
  scrollBack(main, place);
  applyAll();
  editBtn();
  try {
    if (ACC) fxFab();
  } catch (e) {}
  try {
    fxWay();
  } catch (e) {}
  guideCheck();
}
function renderMain() {
  if (tab === "today" && ui.lastTab && ui.lastTab !== "today") ui.tday = null;
  ui.lastTab = tab;
  fixWork();
  fixRoutines();
  fixWho();
  dedupeEv();
  rollDay();
  _sess = null;
  const m = document.getElementById("main"),
    nav = document.getElementById("nav");
  if (!ACC) {
    nav.hidden = true;
    document.getElementById("me").hidden = true;
    document.getElementById("guideBtn").hidden = true;
    document.getElementById("snd").hidden = true;
    document.getElementById("hello").innerHTML =
      `${youBlob("bl bob")}<div><b>Welcome</b><span>DeepKids home planner</span></div>`;
    m.replaceChildren(
      el(`<div class="wrap">${googleFamily() ? `<p class="note">Opening your family…</p>` : loginView()}</div>`),
    );
    if (sheet.open) sheet.close();
    return;
  }
  document.getElementById("snd").hidden = false;
  if (!S.setup && !ob && ui.acctLoading) {
    m.replaceChildren(el(`<div class="wrap"><p class="muted acctload">Opening your family's plan…</p></div>`));
    return;
  }
  if (!S.setup && !ob) return startOnboarding(0);
  nav.hidden = !!ob;
  document.getElementById("me").hidden = !!ob;
  document.getElementById("guideBtn").hidden = !!ob;
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
      ? `<button class="nightbar" data-act="night">${blob("var(--peri)", 17, "sleepy", "", 'width="34" height="34"')}<span><b>Get ready for tomorrow</b><br><span class="xs">${nightItems().filter((p) => !S.prep[p.id]).length} things to set up tonight for tomorrow's lessons · tap to see them</span></span>${icon("next")}</button>`
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
/* onboarding progress reads as steps, not as something to swipe */
/* topic chips: no "?" when a topic has no chapter number */
function fxCrumbs() {
  if (!ACC) return "";
  if (ob) {
    const N = ["Child", "Track", "Subjects", "Levels", "Week", "Summary"];
    return N.slice(0, ob.step + 1)
      .map((n, i) => (i < ob.step ? `<button class="fxcr" data-fxob="${i}">${n}</button><i>›</i>` : `<b>${n}</b>`))
      .join("");
  }
  const T = { today: "Today", week: "Plan", journey: "Progress", library: "Library" },
    parts = [T[tab] || "Today"];
  if (tab === "week") parts.push((SEGS.week.find((x) => x[0] === seg("week")) || [])[1]);
  if (tab === "library") {
    const l = (LIBT.find((x) => x[0] === (ui.lt || "topics")) || [])[1];
    if (l) parts.push(l);
  }
  if (tab === "today" && ui.tday && ui.tday !== today) parts.push(fmt(ui.tday));
  return parts
    .filter(Boolean)
    .map((p, i, a) =>
      i < a.length - 1 ? `<button class="fxcr" data-fxcr="${i}">${esc(p)}</button><i>›</i>` : `<b>${esc(p)}</b>`,
    )
    .join("");
}
function fxWay() {
  const w = document.querySelector("header.top .wrap");
  if (!w) return;
  if (!document.getElementById("fxlogo")) {
    const a = document.createElement("button");
    a.id = "fxlogo";
    a.setAttribute("aria-label", "DeepKids Gurukul home");
    a.innerHTML = `<span>Deep</span>Kids <small>Gurukul</small>`;
    w.prepend(a);
  }
  let c = document.getElementById("fxcrumb");
  if (!c) {
    c = document.createElement("nav");
    c.id = "fxcrumb";
    c.setAttribute("aria-label", "You are here");
    document.querySelector("header.top").after(c);
  }
  c.innerHTML = fxCrumbs();
  const b = document.getElementById("backTop");
  if (b) b.hidden = !ACC || (tab === "today" && !ui.tday && !navHist.length && !(ob && ob.step > 0));
}
const fxHome = () => {
  if (ob) {
    if (!confirm("Leave setup? Your answers so far are kept.")) return;
  }
  if (sheet.open) sheet.close();
  ui.tday = null;
  tab = "today";
  render();
  scrollTo(0, 0);
};
