/* ---------- one clear home for everything: 4 tabs, each with a few named parts, plus Settings ---------- */
const SEGS = {
  week: [
    ["tell", "Tell DeepKids", "Chat, type or add by hand. What DeepKids asked, routines, classes and rest"],
    ["cal", "Calendar", "See the plan by day, week, month or year"],
    ["todo", "To do", "Your own to-dos, and prep and things to gather for coming lessons"],
    ["queue", "Queue", "What comes next, by kind and subject. Drag or use the arrows to change the order"],
    ["pending", "Pending", "From lessons you've done: not started yet"],
    ["ongoing", "Ongoing", "Started and not finished yet"],
  ],
  tasks: [
    ["going", "Started", "Started and not finished yet: lessons, worksheets, quizzes, projects and more"],
    ["new", "Not started", "From lessons you've done: things that weren't started yet"],
    ["queue", "Queues", "What comes next for each kind. Drag or use the arrows to change the order"],
  ],
  journey: [
    ["overview", "Overview", "How each subject is going, chapter by chapter"],
    ["time", "Time", "Time spent each day and subject, and everything done"],
    ["work", "Work", "Finished work with answers, and photos"],
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
  return `<div class="seg segmain">${L.map(([v, n]) => `<button aria-pressed="${cur === v}" data-act="seg" data-k="${k}" data-v="${v}">${n}</button>`).join("")}</div><p class="xs muted segdesc">${esc(L.find((x) => x[0] === cur)[2])}</p>`;
}
const pageHead = (t, extra = "") =>
  `<section class="sec" style="margin-top:8px"><div class="sech"><h1 style="font-size:30px">${t}</h1>${extra}</div>`;
function viewJourneyTabs() {
  const k = seg("journey"),
    kid = esc(S.child || "Your child");
  let h =
    pageHead(`${kid}'s progress`, kidBlob("", "happy", 'width="50" height="50"')) + segBar("journey") + `</section>`;
  if (k === "overview") {
    const o = viewJourney0().replace(
      /<button class="menurow" data-act="(rem|told|track|uploads|school|folder|todo|hist)"[\s\S]*?<\/button>/g,
      "",
    );
    h += o.replace(
      /^<section class="sec" style="margin-top:8px"><div class="sech"><h1[^>]*>[^<]*<\/h1>[\s\S]*?<\/div>/,
      '<section class="sec"><div class="sech"><h3>By subject</h3></div>',
    );
  } else if (k === "time")
    h += `<section class="sec"><button class="menurow" data-act="hist">${blob("var(--pist)", 9, "happy", "", 'width="40" height="40"')}<span><b>Everything done, day by day</b><br><span class="xs muted">${S.log.length} lessons with times</span></span>${icon("next")}</button>${trackView()}</section>`;
  else if (k === "work")
    h += `<section class="sec"><button class="menurow" data-act="todo">${blob("var(--tang)", 11, "calm", "", 'width="40" height="40"')}<span><b>Unfinished work</b><br><span class="xs muted">Started, pending and queued things are in Plan → Ongoing, Pending and Queue</span></span>${icon("next")}</button></section><section class="sec"><div class="sech"><h3>Finished work</h3></div><button class="menurow" data-act="folder">${blob("var(--leaf)", 14, "wow", "", 'width="40" height="40"')}<span><b>Work folder</b><br><span class="xs muted">Every worksheet with answers, quizzes and projects. Save or print.</span></span>${icon("next")}</button></section><section class="sec"><div class="sech"><h3>Photos and files</h3></div>${uploadsView()}</section>`;
  else h += `<section class="sec">${schoolView()}</section>`;
  return h;
}
const LIBT = [
  ["topics", "Syllabus", "Every chapter of every board, by subject and class"],
  ["science", "Resources", "Free activities, simulations and videos, tagged to chapters"],
  ["have", "Home shelf", "Books, games and kits you have at home. We suggest them in the right lesson"],
  ["suggest", "Worth buying", "Books, games and kits picked for your child's age and syllabus"],
  ["read", "Read", "Books and stories to read together"],
  ["watch", "Watch", "Videos and shows worth watching"],
];
SFX.chime = () => {
  tone(988, 0, 0.1, "sine", 0.07);
  tone(1319, 0.07, 0.16, "sine", 0.05);
};
const MTIPS = [
  "Tap Start when you're both ready. No rush.",
  "Did it already? Tap the tick and choose.",
  "Busy day? Later today moves it out of the way.",
  "Photos of work go in Add photos.",
  "Tell me plans in the Planner, like a message.",
  "Small steps every day add up.",
  "Need a break? That's part of learning too.",
];
document.addEventListener("click", (e) => {
  const m = e.target.closest?.(".mascot");
  if (!m || e.target.closest("button,a")) return;
  m.classList.remove("wig");
  void m.getBoundingClientRect();
  m.classList.add("wig");
  sfx("chime");
  const r = m.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top, MTIPS[Math.floor(Math.random() * MTIPS.length)]);
});
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest?.("[data-act]");
    if (!b) return;
    const a = b.dataset.act;
    if (
      (a === "wkst" && b.dataset.to === "done") ||
      (a === "qz" && b.dataset.r === "1") ||
      a === "evsave" ||
      a === "iofin" ||
      a === "iodone" ||
      a === "drew"
    )
      setTimeout(() => sfx("chime"), 120);
  },
  true,
);

let lastTap = 0;
document.addEventListener(
  "click",
  () => {
    lastTap = Date.now();
  },
  true,
);

const DEX = [
  ["A class or tuition", "Swimming every Tue and Thu 5 to 6 pm"],
  ["A trip or outing", "Visiting grandma in Mysore from 2 to 5 Nov"],
  ["Rest or meals", "Liri naps 2 to 3 pm every day"],
  ["Something we own", "We have a microscope, Ludo and a globe"],
  ["A to-do", "Buy a geometry box this week"],
];
document.addEventListener("input", (e) => {
  if (e.target.id === "dumpText") {
    const t = e.target;
    t.style.height = "auto";
    t.style.height = Math.min(160, t.scrollHeight) + "px";
  }
});
