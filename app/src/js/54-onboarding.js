/* ---------- onboarding ---------- */
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
function viewOnboardingV0() {
  const d = ob.d;
  let h = `<div class="ob"><div class="obbar">${[0, 1, 2, 3, 4].map((i) => `<i class="${i <= ob.step ? "on" : ""}"></i>`).join("")}</div>`;
  if (ob.step === 0)
    h += `${crowd()}<div><span class="eyebrow">Welcome to DeepKids</span><h1 style="margin-top:6px">Let's plan an amazing year of learning at home</h1></div><div class="field"><label for="obName">Who is learning?</label><input class="inp" id="obName" maxlength="40" value="${esc(d.child)}" placeholder="Child's name, like Aarav"></div><div class="field"><span>Age</span><div class="ages">${[6, 7, 8, 9, 10].map((a) => `<button type="button" aria-pressed="${d.age === a}" data-age="${a}">${a}</button>`).join("")}</div></div><div class="field"><span>Class this year</span><div class="ages">${[1, 2, 3, 4, 5].map((c) => `<button type="button" aria-pressed="${obCls(d) === c}" data-cls="${c}">${c}</button>`).join("")}</div><span class="xs muted">We use the class to pick the right syllabus books. You can still add any chapter from the Library.</span></div>`;
  if (ob.step === 1)
    h += `<h1>Which syllabus?</h1><div class="choices">${[
      ["ncert", "NCERT / CBSE", "India's national textbooks", "var(--tang)"],
      ["cambridge", "Cambridge Primary", "Stages 1–5", "var(--sky)"],
      ["nios", "NIOS", "Open Basic Education", "var(--pist)"],
      [
        "combined",
        "Combined",
        "Every topic from NCERT, Cambridge and NIOS, at the earliest class, deeper each year",
        "var(--peri)",
      ],
      ["waldorf", "Waldorf (Steiner)", "Main lesson blocks, stories, arts and handwork, the Indian way", "var(--sun)"],
      ["none", "Only DeepKids Plus", "Our own big-question curriculum", "var(--gum)"],
    ]
      .map(
        ([k, n, s, c], i) =>
          `<button type="button" class="choice" aria-pressed="${d.board === k}" data-b="${k}">${blob(c, 20 + i, d.board === k ? "happy" : "calm")}<span><b>${n}</b><span>${s}</span></span></button>`,
      )
      .join("")}</div>${
      d.board === "waldorf"
        ? `<p class="sm muted" style="margin-top:8px">Waldorf learning is built around a long morning main lesson, Hindi, and a weekly rhythm of painting, handwork, music, modelling and baking.</p>`
        : d.board !== "none"
          ? `<h2 style="font-size:24px;margin-top:8px">How do you want to learn?</h2><div class="choices">${Object.entries(
              MODES,
            )
              .map(
                ([k, [n, desc, c]], i) =>
                  `<button type="button" class="choice" aria-pressed="${(d.mode || "booksplus") === k}" data-mode="${k}">${blob(c, 40 + i, (d.mode || "booksplus") === k ? "happy" : "calm")}<span><b>${n}</b><span>${desc}</span></span></button>`,
              )
              .join(
                "",
              )}</div><label class="toggle"><input type="checkbox" id="obExam" ${d.exam ? "checked" : ""}><span><b style="font:600 17px var(--display)">Exam track</b><br><span class="sm muted">Planning for board or NIOS exams? Every syllabus chapter stays first.</span></span></label>`
          : `<p class="note">DeepKids Plus only: our own topics and lesson plans, drawing on every syllabus.</p>`
    }`;
  if (ob.step === 2)
    h += `<h1>Which subjects?</h1><div class="choices">${visSubj(d.board)
      .map(
        (k) =>
          `<button type="button" class="choice" aria-pressed="${d.subjects.includes(k)}" data-s="${k}">${sblob(k, d.subjects.includes(k) ? "happy" : "sleepy")}<span><b>${SUBJ[k]}</b><span>${k === "wml" ? "The long morning lesson: stories, letters, numbers, nature and history in blocks of 3–4 weeks" : k === "wart" ? "Painting, handwork, music, modelling and baking, one each weekday" : k === "hin" && d.board === "waldorf" ? "Hindi as the second language: songs first, then letters" : k === "hin" ? "Not part of Cambridge" : k === "dks" ? "Big questions about life, the earth and the universe. Every day, alongside the syllabus" : "Tap to include or leave out"}</span></span></button>`,
      )
      .join("")}</div>`;
  if (ob.step === 3)
    h += `<h1>Level and time</h1><p class="muted">A starting level, and roughly how long each subject gets on the days you do it.</p>${d.subjects.map((s) => `<div class="card ${SC(s)}"><div class="row" style="gap:10px">${sblob(s, "happy", "", 'width="40" height="40"')}<b style="font:600 18px var(--display)">${SUBJ[s]}</b></div><div class="fgrid"><select class="inp" id="obl-${s}" data-s="${s}" aria-label="${SUBJ[s]} level">${[1, 2, 3, 4, 5].map((l) => `<option value="${l}" ${d.levels[s] === l ? "selected" : ""}>${lvlLabel(l)}</option>`).join("")}</select><select class="inp" id="obh-${s}" data-hpd="${s}" aria-label="${SUBJ[s]} hours a day">${[0.25, 0.5, 0.75, 1, 1.5, 2, 3].map((v) => `<option value="${v}" ${(d.hpd || DEF_HPD)[s] === v ? "selected" : ""}>${v} h a day</option>`).join("")}</select></div></div>`).join("")}`;
  if (ob.step === 4) {
    const keep = S;
    S = { ...S, ...d };
    h += `<h1>${esc(d.child || "Your child")}'s year</h1><div class="col">${d.subjects
      .map((s) => {
        const c = collate(s),
          books = [...new Set(c.board.map((u) => u.book))];
        return `<div class="card ${SC(s)}"><div class="row" style="gap:10px">${sblob(s, "happy", "", 'width="40" height="40"')}<b style="font:600 18px var(--display)">${SUBJ[s]}</b><span class="xs muted">${lvlLabel(d.levels[s])}</span></div>${books.map((b) => `<span class="sm">${esc(b)}: ${c.board.filter((u) => u.book === b).length} chapters</span>`).join("")}${c.dk.length ? `<span class="sm">DeepKids Plus: ${c.dk.length} topics</span>` : ""}${notesFor(
          s,
          d.levels[s],
        )
          .map((n) => `<span class="xs muted">${esc(n)}</span>`)
          .join("")}</div>`;
      })
      .join("")}</div>`;
    S = keep;
  }
  h += `<div class="row" style="justify-content:space-between">${ob.step > 0 ? `<button class="btn soft" data-ob="back">Back</button>` : "<span></span>"}<button class="btn" data-ob="next">${ob.step === 4 ? "Build my plan" : "Continue"}${icon("next")}</button></div></div>`;
  return h;
}
function viewOnboardingV1() {
  const d = ob.d,
    s = ob.step;
  d.boards = d.boards || (["ncert", "cambridge", "nios"].includes(d.board) ? [d.board] : []);
  if (ob.quiz) return fxObQuiz();
  if (s === 1) {
    const isB = ["ncert", "cambridge", "nios"].includes(d.board);
    return `<div class="ob">${fxObBar(1)}<h1>Which track?</h1><p class="muted">You can change this later. Every level and every chapter stays open to browse and add, whichever you pick.</p><div class="choices">
    <button type="button" class="choice" aria-pressed="${d.board === "combined"}" data-b="combined"><img class="obimg" src="media/ui/track-deepkids.jpg" alt=""><span><b>DeepKids track</b><span>Led by topics. Every topic that NCERT, Cambridge and NIOS teach in a class, and much more, so your child is ready for any school. The plan follows curiosity, keeps pace with the boards, and has one catch-up week each quarter.</span></span></button>
    <button type="button" class="choice" aria-pressed="${isB}" data-obtrack="board"><img class="obimg" src="media/ui/track-board.jpg" alt=""><span><b>Board track</b><span>Led by your textbook. The book chapter by chapter, with our quizzes, big questions, other points of view, songs, jokes and worksheets alongside.</span></span></button></div>
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
  if (s === 4) {
    const N = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      L = { full: "Full day", half: "Half day", free: "Free" },
      W = d.weekType || FXWT0;
    return `<div class="ob">${fxObBar(4)}<h1>Your week</h1><p class="muted">Tap a day to change it. Full days get the whole plan, half days get short lessons, free days have no lessons.</p><div class="col" style="gap:8px">${[1, 2, 3, 4, 5, 6, 0].map((x) => `<button type="button" class="choice" data-obwt="${x}"><span><b>${N[x]}</b><span>${L[W[x] || "full"]}</span></span></button>`).join("")}</div>
    <div class="field"><label for="obEnd">Learning ends by</label><input class="inp" id="obEnd" type="time" value="${d.endAt || "18:30"}"></div>${fxObNav(true, "Continue")}</div>`;
  }
  if (s === 5) {
    ob.step = 4;
    let h = viewOnboardingV0();
    ob.step = 5;
    return h.replace(/<div class="obbar">[\s\S]*?<\/div>/, fxObBar(5));
  }
  let h = viewOnboardingV0().replace(/<div class="obbar">[\s\S]*?<\/div>/, fxObBar(s));
  if (s === 3)
    h = h.replace(
      '<div class="row" style="justify-content:space-between">',
      `<div class="card"><b>Not sure of the level?</b><p class="sm">Take a 2-minute quiz together. Your child answers out loud and you tap whether they knew it.</p><div class="row">${
        d.subjects
          .filter(fxHasPQ)
          .map((x) => `<button type="button" class="btn soft sm" data-obquiz="${x}">${SUBJ[x]} quiz</button>`)
          .join("") || `<span class="xs muted">No quiz yet for these subjects.</span>`
      }</div></div><div class="row" style="justify-content:space-between">`,
    );
  return h;
}
function viewOnboarding() {
  const d = ob.d,
    s = ob.step;
  d.picked = d.picked || {};
  if (ob.quiz) return viewOnboardingV1();
  if (s === 0)
    return `<div class="ob">${fxObBar(0)}<img class="obhero" src="media/ui/track-deepkids.jpg" alt=""><h1>Let's plan a year of learning at home</h1><div class="field"><label for="obName">Who is learning?</label><input class="inp" id="obName" maxlength="40" value="${esc(d.child || "")}" placeholder="Child's name, like Aarav"></div><div class="field"><span>Age</span><div class="ages">${[5, 6, 7, 8, 9, 10, 11].map((a) => `<button type="button" aria-pressed="${d.age === a}" data-age="${a}">${a}</button>`).join("")}</div><span class="xs muted">You choose the level for each subject in a later step. Children are often at different levels in different subjects.</span></div>${fxObNav(false, "Continue")}</div>`;
  if (s === 3) {
    const sug = Math.min(5, Math.max(1, (d.age || 8) - 5));
    return `<div class="ob">${fxObBar(3)}<h1>Level for each subject</h1><p class="muted">Pick where ${esc(d.child || "your child")} is now in each subject, or take a 2-minute quiz together. Most ${d.age || 8}-year-olds are around Class ${sug}, but go by your child.</p>
   ${d.subjects.map((x) => `<div class="card ${SC(x)}"><b style="font-size:18px">${SUBJ[x]}</b><div class="row" style="gap:6px">${[1, 2, 3, 4, 5].map((l) => `<button type="button" class="chip" aria-pressed="${!!d.picked[x] && d.levels[x] === l}" data-oblvl="${x}:${l}">Class ${l}</button>`).join("")}</div><div class="row" style="justify-content:space-between">${fxHasPQ(x) ? `<button type="button" class="btn soft sm" data-obquiz="${x}">Not sure? Quiz</button>` : "<span></span>"}<select class="inp" style="width:auto" data-hpd="${x}" aria-label="${SUBJ[x]} time a day">${[0.25, 0.5, 0.75, 1, 1.5, 2, 3].map((v) => `<option value="${v}" ${(d.hpd || DEF_HPD)[x] === v ? "selected" : ""}>${v * 60} min a day</option>`).join("")}</select></div></div>`).join("")}${fxObNav(true, "Continue")}</div>`;
  }
  return viewOnboardingV1();
}

const obCls = (d) => d.cls || Math.min(5, Math.max(1, d.age - 5));
function obNextV0() {
  const d = ob.d;
  if (ob.step === 0) {
    d.child = document.getElementById("obName").value.trim();
    const c = obCls(d);
    SUBJ_KEYS.forEach((s) => (d.levels[s] = c));
  }
  if (ob.step === 2 && !d.subjects.length) {
    sfx("no");
    toast("Pick at least one subject");
    return;
  }
  if (ob.step === 4) {
    if (d.board === "none") d.mode = "plus";
    d.mode = d.mode || "booksplus";
    d.plus = d.mode !== "books";
    Object.assign(S, d, { setup: true });
    ob = null;
    tab = "today";
    commit();
    sfx("win");
    confetti();
    return;
  }
  ob.step++;
  render();
  scrollTo(0, 0);
}
function obNextV1() {
  const d = ob.d,
    s = ob.step;
  if (s === 1) {
    if (!d.board || d.board === "none") {
      sfx("no");
      toast("Pick a track");
      return;
    }
    if (["ncert", "cambridge", "nios"].includes(d.board) && !d.boards.length) {
      sfx("no");
      toast("Pick at least one board");
      return;
    }
    if (d.board === "combined" || d.board === "waldorf") d.boards = [];
    d.mode = "booksplus";
    ob.step = 2;
    render();
    scrollTo(0, 0);
    return;
  }
  if (s === 4) {
    const e = document.getElementById("obEnd");
    if (e?.value) d.endAt = e.value;
    ob.step = 5;
    render();
    scrollTo(0, 0);
    return;
  }
  if (s === 5) {
    ob.step = 4;
    if (d.endAt) S.dayOver = S.dayOver || {};
    const end = d.endAt;
    delete d.endAt;
    obNextV0();
    if (end) {
      S.day = { ...(S.day || {}), endAt: end };
      commit();
    }
    return;
  }
  obNextV0();
}
function obNext() {
  const d = ob.d,
    s = ob.step;
  if (s === 0) {
    d.child = (document.getElementById("obName")?.value || "").trim();
    if (!d.child) {
      sfx("no");
      toast("Type your child's name");
      return;
    }
    if (!d.age) {
      sfx("no");
      toast("Pick an age");
      return;
    }
    ob.step = 1;
    render();
    scrollTo(0, 0);
    return;
  }
  if (s === 3) {
    const miss = d.subjects.filter((x) => !d.picked[x]);
    if (miss.length) {
      sfx("no");
      toast("Pick a level for " + miss.map((x) => SUBJ[x]).join(", "));
      return;
    }
    ob.step = 4;
    render();
    scrollTo(0, 0);
    return;
  }
  obNextV1();
}
