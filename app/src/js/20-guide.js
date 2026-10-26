/* Walkthrough mode: while it is on, each screen points out its parts one by one the first time a parent sees it.
   The ? in the top bar replays the current screen; Settings turns the mode on or off. */
const GUIDE = {
  today: [
    [".greetbar", "Your day at a glance", "The date, how much is left today, and the sound switch."],
    [".fxtoday", "This week", "Minutes learned this week, and the units your child is working on."],
    [".calhead", "Today's plan", "Everything planned for today, in time order. Use ‹ and › to look at other days."],
    [".now", "What to do now", "The next thing to do. Tap it to start. When you finish, tap Done and it moves on."],
    [".morebtn", "For spare moments", "Jokes, games, experiments and reading, whenever you have a few minutes."],
    [
      "#nav",
      "Four places",
      "Today is the day. Plan is the week and what comes next. Progress shows how it's going. Library has every lesson and book.",
    ],
    [
      "#guideBtn",
      "Need help again?",
      "Tap ? any time to see the tips for the screen you're on. Turn the walkthrough off in Settings.",
    ],
  ],
  "week:cal": [
    [
      ".segmain",
      "Plan has four tabs",
      "This week, Up next, To finish and Settings. Each is explained when you open it.",
    ],
    ['[data-act="pv"]', "See any stretch of time", "Switch between a day, a week, a month or the whole year."],
    [".fxfold", "Your to-dos", "Things to get ready for coming lessons, and your own to-dos."],
  ],
  "week:next": [
    [
      ".fxfold",
      "The year at a glance",
      "Whether you're on track, and this week's shopping for experiments and projects.",
    ],
    [
      ".qtypes",
      "What comes next",
      "The order of lessons, projects and experiments in each subject. Drag to change it.",
    ],
  ],
  "week:finish": [
    [".fxsh", "Started", "Lessons and parts your child started but hasn't finished."],
    [
      '[data-act="fxpractise"],.fxprac,#main .card:last-of-type',
      "Practise again",
      "Every question your child got wrong, and finished units to review, so nothing is forgotten.",
    ],
  ],
  "week:family": [
    [
      ".card.dump",
      "Tell DeepKids anything",
      "Type classes, trips, holidays or worries in your own words. DeepKids re-plans around them.",
    ],
    [
      "#paceSec",
      "Times, subjects and pace",
      "When lessons start, which subjects you do, your child's level, and how fast each subject goes.",
    ],
  ],
  journey: [
    [
      ".segmain",
      "Progress",
      "How each subject is going, time spent, finished work with photos, and reports for a school.",
    ],
    [".scard", "Each subject", "Tap a subject to see its chapters and what's done."],
  ],
  library: [
    [
      '[data-act="lt"]',
      "The Library",
      "Browse the syllabus, free resources, your own books (Home shelf), what's worth buying, and what to read and watch.",
    ],
    [
      ".card.fxnew",
      "Full DeepKids lessons",
      "Each unit is a whole lesson to scroll through: story, activities, games, worksheets and a quiz.",
    ],
  ],
};
// the screen the parent is on, as a key of GUIDE
function guideScreen() {
  if (!S.setup || ob || sheet.open || document.getElementById("fxDlg")?.open) return "";
  if (tab === "week") return "week:" + seg("week");
  return tab;
}
function guideSteps(key) {
  return (GUIDE[key] || []).filter(([sel]) => document.querySelector(sel));
}
// called after every render: shows the tips for a screen the parent hasn't seen yet
function guideCheck() {
  const key = guideScreen();
  if (!key || !(S.guide?.on ?? true) || S.guide?.seen?.[key] || ui.guide) return;
  if (guideSteps(key).length) setTimeout(() => guideStart(key, false), 300);
}
// manual: the parent tapped ?, so show the tips even if the walkthrough is off or this screen was seen
function guideStart(key = guideScreen(), manual = true) {
  if (!key || guideScreen() !== key || !guideSteps(key).length || ui.guide) return;
  if (!manual && (S.guide?.on === false || S.guide?.seen?.[key])) return;
  ui.guide = { key, i: 0 };
  guideShow();
}
function guideShow() {
  const g = ui.guide,
    L = guideSteps(g.key),
    st = L[g.i];
  let box = document.getElementById("guide");
  if (!st) return guideEnd();
  if (!box) {
    box = document.createElement("div");
    box.id = "guide";
    box.addEventListener("click", guideClick);
    document.body.appendChild(box);
  }
  const t = document.querySelector(st[0]);
  t.scrollIntoView({ block: "center" });
  const r = t.getBoundingClientRect(),
    pad = 6,
    below = r.top + r.height / 2 < innerHeight / 2;
  box.innerHTML = `<div class="ghole" style="left:${r.left - pad}px;top:${r.top - pad}px;width:${r.width + pad * 2}px;height:${r.height + pad * 2}px"></div>
    <div class="gbub" role="dialog" aria-label="${esc(st[1])}" style="${below ? `top:${Math.min(r.bottom + 14, innerHeight - 220)}px` : `bottom:${Math.min(innerHeight - r.top + 14, innerHeight - 220)}px`}">
    <span class="eyebrow">${g.i + 1} of ${L.length}</span><b>${esc(st[1])}</b><p>${esc(st[2])}</p>
    <div class="row"><button class="link sm" data-g="off">Turn off walkthrough</button><span style="flex:1"></span>${g.i ? `<button class="btn soft sm" data-g="back">Back</button>` : ""}<button class="btn sm" data-g="next">${g.i === L.length - 1 ? "Got it" : "Next"}</button></div></div>`;
}
function guideClick(e) {
  const a = e.target.closest("[data-g]")?.dataset.g;
  if (!a) return;
  sfx("tap");
  if (a === "next") ui.guide.i++;
  if (a === "back") ui.guide.i--;
  if (a === "off") {
    S.guide = { ...(S.guide || {}), on: false };
    commit();
    toast("Walkthrough off. Turn it on again in Settings, or tap ? for this screen.");
    return guideEnd();
  }
  guideShow();
}
function guideEnd() {
  const key = ui.guide?.key;
  document.getElementById("guide")?.remove();
  ui.guide = null;
  if (key) {
    S.guide = { on: S.guide?.on ?? true, seen: { ...(S.guide?.seen || {}), [key]: 1 } };
    save();
  }
}
function onGuideBtn() {
  sfx("tap");
  if (!guideScreen() || !guideSteps(guideScreen()).length) return toast("No tips for this screen yet.");
  guideStart();
}
function guideToggle(on) {
  S.guide = { on, seen: on ? {} : S.guide?.seen || {} };
  commit();
  toast(on ? "Walkthrough on: each screen shows its tips again." : "Walkthrough off.");
}
