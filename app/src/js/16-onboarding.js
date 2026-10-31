/* Sign-in and setting up */
function loginView() {
  let known = [];
  try {
    known = JSON.parse(lsGet("dk-known") || "[]");
  } catch (e) {}
  const intro = `<div class="fxintro" id="fxintro">${FXINTRO.map(([img, t, p]) => `<div class="fxslide2"><img src="media/ui/${img}.jpg" alt=""><h2>${t}</h2><p>${p}</p></div>`).join("")}</div><div class="fxdots">${FXINTRO.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("")}</div>`;
  return `<div class="ob">${intro}<div><span class="eyebrow">DeepKids Gurukul</span><h1 style="margin-top:6px">Log in</h1><p class="muted" style="margin-top:6px">Testing mode, so no OTP yet. The same number always brings back the same family. You stay logged in until you log out.</p></div>
   ${known.length ? `<div class="col" style="gap:8px"><span class="eyebrow">Used on this phone</span>${known.map((k) => `<button class="menurow" data-act="loginas" data-a="${esc(k.acct)}">${youBlob("", "happy", 'width="40" height="40"')}<span><b>${esc(k.name || "Parent")}</b><br><span class="xs muted">+91 ${esc(String(k.acct).slice(2))}${k.child ? " · " + esc(k.child) + "'s family" : ""}</span></span>${icon("next")}</button>`).join("")}</div><span class="eyebrow">Or a different number</span>` : ""}
   <div class="field"><label for="lgPhone">Phone number</label><div class="row" style="flex-wrap:nowrap"><span class="chip" style="height:50px;padding:0 14px;font-size:16px">+91</span><input class="inp" id="lgPhone" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="16" placeholder="98765 43210"></div></div>
   <div class="field"><label for="lgName">Your name</label><input class="inp" id="lgName" maxlength="40" autocomplete="given-name" placeholder="Your name"></div>
   <p class="sm" id="lgErr" style="color:var(--bad)" ${ui.lgErr ? "" : "hidden"}>${esc(ui.lgErr || "")}</p>
   <button class="btn" data-act="login" ${ui.lgBusy ? "disabled" : ""}>${ui.lgBusy ? "Logging in…" : "Log in"}${icon("next")}</button></div>`;
}
// On the website, Google is the sign-in: a family's first visit opens an account tied to their Google account,
// so there is no second, phone-number log-in. Returns true while that account is opening.
function googleFamily() {
  const g = window.DK_PLATFORM?.user?.();
  if (!g) return false;
  if (!ui.lgBusy) {
    ui.lgBusy = true;
    openAccount("g" + g.id, (g.user_metadata?.full_name || g.user_metadata?.name || "").split(" ")[0]).then(() => {
      ui.lgBusy = false;
      tab = "today";
      render();
    });
  }
  return true;
}
function accountCard() {
  const ph = !ACC
    ? ""
    : /^91\d{10}$/.test(ACC)
      ? "+91 " + ACC.slice(2, 7) + " " + ACC.slice(7)
      : window.DK_PLATFORM?.user?.()?.email || "";
  const d = ui.saved;
  return `<section class="card"><div class="sech"><span><span class="eyebrow">Logged in</span><br><b style="font:600 17px var(--display)">${esc(ph)}</b></span><button class="btn soft sm" data-act="logout">Log out</button></div>
   <button class="btn line sm" data-act="checksaved" style="justify-self:start">${ui.savedBusy ? "Reading…" : "Check what's saved"}</button>
   ${
     d
       ? d.err
         ? `<p class="sm" style="color:var(--bad)">${esc(d.err)}</p>`
         : `<div class="kv"><span>Read from</span><b>the database, ${new Date(d.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" })}</b><span>Your name</span><b>${esc(d.v.parent?.name || "(not set)")}</b><span>Wake-up</span><b>${esc((d.v.alarm || {}).time || "(not set)")}</b><span>Child</span><b>${esc(d.v.child || "")}, age ${esc(d.v.age || "")}</b><span>Subjects</span><b>${(d.v.subjects || []).map((s) => SUBJ[s] || s).join(", ")}</b><span>Lessons done</span><b>${(d.v.log || []).length}</b></div>${
             (d.v.log || []).length
               ? `<span class="eyebrow" style="margin-top:8px">Last things saved</span><ol class="sm">${d.v.log
                   .slice(0, 6)
                   .map(
                     (l) =>
                       `<li>${esc(fmt(l.date))}${l.at != null ? ", " + clock(l.at) : ""}: ${esc(l.title)}${l.n ? " (part " + l.n + ")" : ""}</li>`,
                   )
                   .join("")}</ol>`
               : ""
           }<div class="kv"><span>Classes and to-dos</span><b>${(d.v.events || []).length + (d.v.todos || []).length}</b><span>Last change</span><b>${d.v.updatedAt ? new Date(d.v.updatedAt).toLocaleString([], { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : "–"}</b></div>`
       : ""
   }</section>`;
}
function startOnboarding(step) {
  ob = {
    step: step ?? 0,
    d: JSON.parse(
      JSON.stringify({
        child: S.child,
        age: S.age,
        board: S.board,
        plus: S.plus,
        subjects: S.subjects,
        levels: S.levels,
        hpd: S.hpd || DEF_HPD,
        mode: S.mode || (S.plus ? "booksplus" : "books"),
        exam: !!S.exam,
      }),
    ),
  };
  render();
}
const obCls = (d) => d.cls || Math.min(5, Math.max(1, d.age - 5));
// which account the family is signed in with on the website, and a way to switch (each account has its own plan)
function acctLine() {
  const e = window.DK_PLATFORM?.user?.()?.email;
  return e
    ? `<p class="xs muted">Signed in as <b>${esc(e)}</b> · <button class="link xs" data-act="signout">Use a different account</button></p>`
    : "";
}
// Set-up, one screen per step: 0 who, 1 track, 2 subjects, 3 level per subject, 4 the week, 5 the year at a glance
function viewOnboarding() {
  const d = ob.d,
    s = ob.step;
  d.boards = d.boards || (["ncert", "cambridge", "nios"].includes(d.board) ? [d.board] : []);
  d.picked = d.picked || {};
  if (ob.quiz) return fxObQuiz();
  if (s === 0)
    return `<div class="ob">${fxObBar(0)}<img class="obhero" src="media/ui/intro-journey.jpg" alt=""><h1>Let's plan a year of learning at home</h1>${acctLine()}<div class="field"><label for="obName">Who is learning?</label><input class="inp" id="obName" maxlength="40" value="${esc(d.child || "")}" placeholder="Child's name, like Aarav"></div><div class="field"><span>Age</span><div class="ages">${[5, 6, 7, 8, 9, 10, 11].map((a) => `<button type="button" aria-pressed="${d.age === a}" data-age="${a}">${a}</button>`).join("")}</div><span class="xs muted">You choose the level for each subject in a later step. Children are often at different levels in different subjects.</span></div>${fxObNav(false, "Continue")}</div>`;
  if (s === 1) {
    const isB = ["ncert", "cambridge", "nios"].includes(d.board);
    return `<div class="ob">${fxObBar(1)}<h1>Which track?</h1><p class="muted">You can change this later. Every level and every chapter stays open to browse and add, whichever you pick.</p><div class="choices">
    <button type="button" class="choice" aria-pressed="${d.board === "combined"}" data-b="combined"><img class="obimg" src="media/ui/intro-together.jpg" alt=""><span><b>DeepKids track</b><span>Led by topics. Every topic that NCERT, Cambridge and NIOS teach in a class, and much more, so your child is ready for any school. The plan follows curiosity, keeps pace with the boards, and has one catch-up week each quarter.</span></span></button>
    <button type="button" class="choice" aria-pressed="${isB}" data-obtrack="board"><img class="obimg" src="media/ui/intro-schools.jpg" alt=""><span><b>Board track</b><span>Led by your textbook. The book chapter by chapter, with our quizzes, big questions, other points of view, songs, jokes and worksheets alongside.</span></span></button></div>
    ${
      isB
        ? `<h2 style="font-size:24px;margin-top:10px">Which boards?</h2><p class="xs muted">Pick one or more. The plan follows the first one you pick; the others' chapters show in the Library to add any time.</p><div class="row">${[
            ["ncert", "NCERT / CBSE"],
            ["cambridge", "Cambridge Primary"],
            ["nios", "NIOS"],
          ]
            .map(
              ([k, n]) =>
                `<button type="button" class="chip" aria-pressed="${d.boards.includes(k)}" data-obb="${k}">${d.boards.includes(k) ? (d.boards.indexOf(k) === 0 ? "1st · " : "✓ ") : ""}${n}</button>`,
            )
            .join("")}</div>`
        : ""
    }
    <p class="sm" style="margin-top:12px">Or a different way of learning:</p><div class="choices"><button type="button" class="choice" aria-pressed="${d.board === "waldorf"}" data-b="waldorf"><img class="obimg" src="media/ui/track-waldorf.jpg" alt=""><span><b>Waldorf (Steiner)</b><span>A way of teaching, not a board: a long morning main lesson, stories, arts and handwork, the Indian way.</span></span></button></div>
    ${fxObNav(true, "Continue")}</div>`;
  }
  if (s === 2)
    return `<div class="ob">${fxObBar(2)}<h1>Which subjects?</h1><div class="choices">${visSubj(d.board)
      .map(
        (k) =>
          `<button type="button" class="choice" aria-pressed="${d.subjects.includes(k)}" data-s="${k}">${sblob(k, d.subjects.includes(k) ? "happy" : "sleepy")}<span><b>${SUBJ[k]}</b><span>${k === "wml" ? "The long morning lesson: stories, letters, numbers, nature and history in blocks of 3–4 weeks" : k === "wart" ? "Painting, handwork, music, modelling and baking, one each weekday" : k === "hin" && d.board === "waldorf" ? "Hindi as the second language: songs first, then letters" : k === "hin" ? "Not part of Cambridge" : "Tap to include or leave out"}</span></span></button>`,
      )
      .join("")}</div>${fxObNav(true, `Continue${icon("next")}`)}</div>`;
  if (s === 3) {
    const sug = Math.min(5, Math.max(1, (d.age || 8) - 5));
    return `<div class="ob">${fxObBar(3)}<h1>Level for each subject</h1><p class="muted">Pick where ${esc(d.child || "your child")} is now in each subject, or take a 2-minute quiz together. Most ${d.age || 8}-year-olds are around Class ${sug}, but go by your child.</p>
   ${d.subjects.map((x) => `<div class="card ${SC(x)}"><b style="font-size:18px">${SUBJ[x]}</b><div class="row" style="gap:6px">${[1, 2, 3, 4, 5].map((l) => `<button type="button" class="chip" aria-pressed="${!!d.picked[x] && d.levels[x] === l}" data-oblvl="${x}:${l}">Class ${l}</button>`).join("")}</div><div class="row" style="justify-content:space-between">${fxHasPQ(x) ? `<button type="button" class="btn soft sm" data-obquiz="${x}">Not sure? Quiz</button>` : "<span></span>"}<select class="inp" style="width:auto" data-hpd="${x}" aria-label="${SUBJ[x]} time a day">${[0.25, 0.5, 0.75, 1, 1.5, 2, 3].map((v) => `<option value="${v}" ${(d.hpd || DEF_HPD)[x] === v ? "selected" : ""}>${v * 60} min a day</option>`).join("")}</select></div></div>`).join("")}${fxObNav(true, "Continue")}</div>`;
  }
  if (s === 4) {
    const N = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      L = { full: "Full day", half: "Half day", free: "Free" },
      W = d.weekType || FXWT0;
    return `<div class="ob">${fxObBar(4)}<h1>Your week</h1><p class="muted">Tap a day to change it. Full days get the whole plan, half days get short lessons, free days have no lessons.</p><div class="col" style="gap:8px">${[1, 2, 3, 4, 5, 6, 0].map((x) => `<button type="button" class="choice" data-obwt="${x}"><span><b>${N[x]}</b><span>${L[W[x] || "full"]}</span></span></button>`).join("")}</div>
    <div class="field"><label for="obEnd">Learning ends by</label><input class="inp" id="obEnd" type="time" value="${d.endAt || "18:30"}"></div>${fxObNav(true, "Continue")}</div>`;
  }
  {
    const keep = S;
    S = { ...S, ...d };
    const h = `<div class="ob">${fxObBar(5)}<h1>${esc(d.child || "Your child")}'s year</h1><div class="col">${d.subjects
      .map((s) => {
        return `<div class="card ${SC(s)}"><div class="row" style="gap:10px">${sblob(s, "happy", "", 'width="40" height="40"')}<b style="font:600 18px var(--display)">${SUBJ[s]}</b><span class="xs muted">${lvlLabel(d.levels[s])}</span></div>${planParts(
          s,
          d.levels[s],
        )
          .map((x) => `<span class="sm">${esc(x)}</span>`)
          .join("")}${notesFor(s, d.levels[s])
          .map((n) => `<span class="xs muted">${esc(n)}</span>`)
          .join("")}</div>`;
      })
      .join("")}</div>${fxObNav(true, `Build my plan${icon("next")}`)}</div>`;
    S = keep;
    return h;
  }
}
// Checks the current step, then moves on; the last step builds the plan
function obNext() {
  const d = ob.d,
    s = ob.step,
    no = (msg) => {
      sfx("no");
      toast(msg);
    };
  if (s === 0) {
    d.child = (document.getElementById("obName")?.value || "").trim();
    if (!d.child) return no("Type your child's name");
    if (!d.age) return no("Pick an age");
  }
  if (s === 1) {
    if (!d.board || d.board === "none") return no("Pick a track");
    if (["ncert", "cambridge", "nios"].includes(d.board) && !d.boards.length) return no("Pick at least one board");
    if (d.board === "combined" || d.board === "waldorf") d.boards = [];
    d.mode = "booksplus";
  }
  if (s === 2 && !d.subjects.length) return no("Pick at least one subject");
  if (s === 3) {
    const miss = d.subjects.filter((x) => !d.picked[x]);
    if (miss.length) return no("Pick a level for " + miss.map((x) => SUBJ[x]).join(", "));
  }
  if (s === 4) {
    const e = document.getElementById("obEnd");
    if (e?.value) d.endAt = e.value;
  }
  if (s < 5) {
    ob.step = s + 1;
    render();
    scrollTo(0, 0);
    return;
  }
  // step 5: build the plan
  const end = d.endAt;
  if (end) S.dayOver = S.dayOver || {};
  delete d.endAt;
  if (d.board === "none") d.mode = "plus";
  d.mode = d.mode || "booksplus";
  d.plus = d.mode !== "books";
  Object.assign(S, d, { setup: true });
  ob = null;
  tab = "today";
  commit();
  sfx("win");
  confetti();
  if (end) {
    S.day = { ...(S.day || {}), endAt: end };
    commit();
  }
  const f = dayFit();
  if (f.n && f.need > f.have)
    setTimeout(
      () =>
        toast(
          `⏰ Your plan needs about ${hmTxt(f.need)} on a busy day, but your day is ${hmTxt(f.have)}. Change the times in Plan → Plan settings.`,
          8000,
        ),
      1200,
    );
}
const FXPQ = {
  math: {
    1: [
      ["What is 7 + 5?", "12"],
      ["Count on in twos: 2, 4, 6, ...", "8"],
      ["Which is more: 14 or 41?", "41"],
    ],
    2: [
      ["What is 46 + 38?", "84"],
      ["What is 52 − 17?", "35"],
      ["How many 10s make 100?", "10"],
    ],
    3: [
      ["What is 6 × 7?", "42"],
      ["Share 24 sweets between 4 children. How many each?", "6"],
      ["What is half of 30?", "15"],
    ],
    4: [
      ["What is 125 × 4?", "500"],
      ["What is 3/4 of 20?", "15"],
      ["Round 4,682 to the nearest hundred.", "4,700"],
    ],
    5: [
      ["What is 0.5 + 0.25?", "0.75"],
      ["What is 15% of 200?", "30"],
      ["A rectangle is 8 cm by 5 cm. What is its area?", "40 square cm"],
    ],
  },
  eng: {
    1: [
      ["Read this word aloud: sun", "sun"],
      ["Which word rhymes with cat: dog, hat, cup?", "hat"],
      ["Say the first sound of 'mango'.", "m"],
    ],
    2: [
      ["Read aloud: The dog ran to the gate.", "read it smoothly"],
      ["What is the plural of 'box'?", "boxes"],
      ["Put in order: the / is / sky / blue", "The sky is blue."],
    ],
    3: [
      ["What does 'enormous' mean?", "very big"],
      ["Find the verb: The girl jumped over the puddle.", "jumped"],
      ["Write the past tense of 'go'.", "went"],
    ],
    4: [
      ["What is a synonym of 'happy'?", "glad, joyful"],
      ["Join with 'because': I stayed home. It rained.", "I stayed home because it rained."],
      ["What is the opposite of 'ancient'?", "modern"],
    ],
    5: [
      ["What is a metaphor? Give one example.", "saying one thing is another: 'The classroom was a zoo.'"],
      ["Change to reported speech: She said, 'I am tired.'", "She said that she was tired."],
      ["What is the main idea of a paragraph?", "what it is mostly about"],
    ],
  },
};
function fxPQ(s, l) {
  if (FXPQ[s]) return FXPQ[s][l] || [];
  const L = DATA.items.filter((i) => i.subj === s && i.level === l && i.c?.p?.check?.length);
  if (!L.length) return [];
  const h = hsh(s + l);
  return [0, 1, 2].map((k) => {
    const u = L[(h + k) % L.length],
      c = u.c.p.check;
    const q = c[(h + k * 7) % c.length];
    return [q.q, q.a];
  });
}
/* The level quiz: three questions at a class; two right moves up a class, fewer moves down, until the level is found.
   Used in set-up and in Quick quiz before any lesson is done. */
const lvqNew = (s, l) => ({ s, l, i: 0, n: 0, k: 0, best: 0, low: 6 });
function lvqCard(Q, attr) {
  const q = fxPQ(Q.s, Q.l)[Q.i];
  return `<h1>${SUBJ[Q.s]} level quiz</h1><p class="muted">Question ${Q.n + 1}. Ask it out loud. Show the answer only after your child has tried.</p><div class="card"><p style="font-size:20px"><b>${esc(q[0])}</b></p><details><summary class="link">Show the answer</summary><p>${esc(q[1])}</p></details></div><div class="row"><button class="btn" ${attr}="1">They knew it</button><button class="btn soft" ${attr}="0">Not yet</button></div><button class="link" ${attr}="stop">Stop the quiz</button>`;
}
// one answer in; returns the level once it is found, else 0
function lvqStep(Q, knew) {
  if (knew) Q.k++;
  Q.i++;
  Q.n++;
  if (Q.i < 3) return 0;
  const passed = Q.k >= 2;
  if (passed) Q.best = Math.max(Q.best, Q.l);
  else Q.low = Math.min(Q.low, Q.l);
  const next = passed ? Q.l + 1 : Q.l - 1;
  if (next >= 1 && next <= 5 && next < Q.low && next > Q.best && Q.n < 12) {
    Q.l = next;
    Q.i = 0;
    Q.k = 0;
    return 0;
  }
  return Math.max(1, Q.best || Math.max(1, Q.low - 1));
}
const fxHasPQ = (s) => [1, 2, 3, 4, 5].every((l) => fxPQ(s, l).length);
const fxObNav = (back, label) =>
  `<div class="row" style="justify-content:space-between">${back ? `<button class="btn soft" data-ob="back">Back</button>` : "<span></span>"}<button class="btn" data-ob="next">${label}</button></div>`;
function fxObQuiz() {
  return `<div class="ob">${fxObBar(3)}${lvqCard(ob.quiz, "data-obqa")}</div>`;
}
const FXINTRO = [
  [
    "intro-journey",
    "Learning that goes deep",
    "Every topic followed all the way: from your child's hands to atoms, stars and the big questions nobody has answered yet.",
  ],
  [
    "intro-family",
    "A plan that fits your family",
    "Classes, rest days, outings and curiosity. DeepKids plans each day around them and re-plans itself as your child learns.",
  ],
  [
    "intro-schools",
    "Ready for any school",
    "Everything NCERT, Cambridge and NIOS teach, and more. Follow your board's book, or let DeepKids lead by topic.",
  ],
  [
    "intro-together",
    "Together, or on their own",
    "Step-by-step for you to teach, or read aloud for your child to follow alone. Games, stories, experiments and songs in every lesson.",
  ],
];
/* Today: the week strip is gone (the calendar below already moves day by day) */
function fxObBar(n) {
  return `<div class="fxstep"><b><i style="width:${Math.round(((n + 1) / 6) * 100)}%"></i></b></div>`;
}
