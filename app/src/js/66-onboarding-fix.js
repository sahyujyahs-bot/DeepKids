/* ---------- Onboarding fix (founder): age never chooses the class. Step 1 asks only name and age; the level is picked
   per subject after the track and subjects, or found with the quick quiz. ---------- */
const _vo2 = viewOnboardingV1,
  _on2 = obNextV1;

document.addEventListener(
  "click",
  (e) => {
    if (!ob) return;
    const b = e.target.closest("[data-oblvl]");
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    const [x, l] = b.dataset.oblvl.split(":");
    ob.d.levels[x] = +l;
    ob.d.picked = { ...(ob.d.picked || {}), [x]: 1 };
    render();
  },
  true,
);
document.addEventListener(
  "change",
  (e) => {
    if (!ob) return;
    const t = e.target.closest("select[data-hpd]");
    if (!t) return;
    ob.d.hpd = { ...(ob.d.hpd || DEF_HPD), [t.dataset.hpd]: +t.value };
  },
  true,
);

document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest("[data-fxsnd]");
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    document.getElementById("snd")?.click();
    setTimeout(render, 50);
  },
  true,
);

/* ---------- Sign-in: a swipeable introduction to DeepKids above the form ---------- */
const FXINTRO = [
  [
    "track-deepkids",
    "Learning that goes deep",
    "Every topic followed all the way: from your child's hands to atoms, stars and the big questions nobody has answered yet.",
  ],
  [
    "today-hero",
    "A plan that fits your family",
    "Classes, rest days, outings and curiosity. DeepKids plans each day around them and re-plans itself as your child learns.",
  ],
  [
    "track-board",
    "Ready for any school",
    "Everything NCERT, Cambridge and NIOS teach, and more. Follow your board's book, or let DeepKids lead by topic.",
  ],
  [
    "subj-sci",
    "Together, or on their own",
    "Step-by-step for you to teach, or read aloud for your child to follow alone. Games, stories, experiments and songs in every lesson.",
  ],
];

document.addEventListener(
  "scroll",
  (e) => {
    const c = e.target;
    if (!(c instanceof Element) || c.id !== "fxintro") return;
    const i = Math.round(c.scrollLeft / c.clientWidth);
    document.querySelectorAll(".fxdots i").forEach((d, j) => d.classList.toggle("on", i === j));
  },
  true,
);
/* onboarding progress reads as steps, not as something to swipe */

/* topic chips: no "?" when a topic has no chapter number */

/* ---------- Plan, simplified (founder: too cluttered). Four tabs instead of seven:
   This week (the calendar, with the parent's to-dos and prep) · Up next (the queue, on track, buy and gather)
   · To finish (started, pending and refresher together) · Our family (tell DeepKids, routines, times, subjects, pace) ---------- */
const FXOLDW = SEGS.week;
SEGS.week = [
  ["cal", "This week", "What's planned, day by day. Tap a day to see it."],
  ["next", "Up next", "What comes next in each subject. Drag to change the order."],
  ["finish", "To finish", "Started, half-done and questions to practise again."],
  [
    "family",
    "Settings",
    "Your classes and routines, wake-up and lesson times, subjects, and how fast each subject goes.",
  ],
];
