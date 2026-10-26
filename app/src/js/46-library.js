/* ---------- Library ---------- */
const AZ = (q) => "https://www.amazon.in/s?k=" + encodeURIComponent(q);
const LIB = {
  suggest: [
    [
      "book",
      "Ammachi's Amazing Machines",
      "Rajiv Eipe · Pratham Books",
      "A grandmother who builds machines. Simple machines, told warmly.",
      AZ("Ammachi's Amazing Machines Rajiv Eipe"),
    ],
    [
      "book",
      "Gajapati Kulapati",
      "Ashok Rajagopalan · Tulika",
      "A sneezing elephant and a village that helps. Great read-aloud for 6–8.",
      AZ("Gajapati Kulapati Tulika"),
    ],
    [
      "book",
      "Grandma's Bag of Stories",
      "Sudha Murty · Puffin",
      "Indian folk stories for bedtime, with questions to talk over.",
      AZ("Grandma's Bag of Stories Sudha Murty"),
    ],
    [
      "book",
      "The Way Things Work Now",
      "David Macaulay",
      "How machines work, from levers to the internet. A book to grow into.",
      AZ("The Way Things Work Now David Macaulay"),
    ],
    [
      "book",
      "Why? Over 1,111 Answers to Everything",
      "National Geographic Kids",
      "Short answers that start long conversations.",
      AZ("National Geographic Kids Why Over 1111 Answers"),
    ],
    [
      "game",
      "Pallanguzhi",
      "Traditional South Indian board game",
      "Counting, planning ahead and fair play, on a wooden board.",
      AZ("Pallanguzhi board game"),
    ],
    [
      "game",
      "Chaupar / Pachisi",
      "Traditional Indian race game",
      "Probability and strategy with cowrie shells.",
      AZ("Chaupar Pachisi game"),
    ],
    ["game", "SET", "Card game", "Spotting patterns across colour, shape, number and shading.", AZ("SET card game")],
    [
      "game",
      "Prime Climb",
      "Maths board game",
      "Multiplication and primes, coloured so children see factors.",
      AZ("Prime Climb board game"),
    ],
    ["game", "Rush Hour", "Logic puzzle", "Sliding cars to plan many moves ahead.", AZ("Rush Hour ThinkFun")],
    [
      "electronics",
      "Snap Circuits Jr. SC-100",
      "Electronics kit",
      "Real circuits that snap together. No soldering.",
      AZ("Snap Circuits Jr SC-100"),
    ],
    [
      "equipment",
      "Foldscope",
      "Paper microscope",
      "A folding microscope made in India that magnifies about 140 times.",
      "https://foldscope.com/",
    ],
    [
      "equipment",
      "Magnifying glass",
      "For nature walks",
      "Used in many EVS experiments.",
      AZ("magnifying glass for kids"),
    ],
    [
      "equipment",
      "Digital kitchen scale (1 g)",
      "For measuring",
      "Seeds, sprouts and waste weighing.",
      AZ("digital kitchen scale 1g"),
    ],
    ["equipment", "Bar magnet set", "For science", "The magnet hunt and more.", AZ("bar magnet set for kids")],
    ["equipment", "Binoculars", "For birds and stars", "Bird-feeder logs and moon diaries.", AZ("binoculars for kids")],
    [
      "tool",
      "Child-safe tool kit",
      "Real tools, small size",
      "Hammer, screwdriver and saw for making things.",
      AZ("kids real tool kit"),
    ],
  ],
  read: {
    parents: [
      [
        "Arvind Gupta Toys",
        "Free books and hundreds of toys made from trash, in many Indian languages.",
        "https://www.arvindguptatoys.com/",
      ],
      ["NCERT textbooks", "Every NCERT book as a free PDF.", "https://ncert.nic.in/textbook.php"],
      ["Eklavya", "Books, teaching ideas and the children's magazine Chakmak.", "https://www.eklavya.in/"],
      [
        "Teacher Plus",
        "A magazine for teachers, full of classroom ideas you can use at home.",
        "https://www.teacherplus.org/",
      ],
      [
        "How Children Learn",
        "John Holt. A classic on how children learn when they are trusted.",
        AZ("How Children Learn John Holt"),
      ],
      ["Free to Learn", "Peter Gray. Why play and self-directed learning matter.", AZ("Free to Learn Peter Gray")],
    ],
    kids: [
      [
        "StoryWeaver",
        "Thousands of free picture books in Indian languages, by Pratham Books.",
        "https://storyweaver.org.in/",
      ],
      ["NASA Space Place", "Space and Earth science games, crafts and explainers.", "https://spaceplace.nasa.gov/"],
      [
        "National Geographic Kids",
        "Animals, places and science for curious readers.",
        "https://kids.nationalgeographic.com/",
      ],
      ["Pratham Books", "Affordable books for every reading level.", "https://prathambooks.org/"],
    ],
  },
  watch: {
    parents: [
      [
        "Turning trash into toys for learning",
        "Arvind Gupta · TED",
        "https://www.ted.com/talks/arvind_gupta_turning_trash_into_toys_for_learning",
      ],
      [
        "Kids can teach themselves",
        "Sugata Mitra · TED",
        "https://www.ted.com/talks/sugata_mitra_kids_can_teach_themselves",
      ],
      [
        "Do schools kill creativity?",
        "Ken Robinson · TED",
        "https://www.ted.com/talks/sir_ken_robinson_do_schools_kill_creativity",
      ],
      [
        "A 50-cent microscope that folds like origami",
        "Manu Prakash · TED",
        "https://www.ted.com/talks/manu_prakash_a_50_cent_microscope_that_folds_like_origami",
      ],
    ],
    kids: [
      ["SciShow Kids", "Short, friendly science videos.", "https://www.youtube.com/@scishowkids"],
      ["Crash Course Kids", "Science and engineering for primary school.", "https://www.youtube.com/@crashcoursekids"],
      ["Peekaboo Kidz (Dr. Binocs)", "Indian-made science cartoons.", "https://www.youtube.com/@PeekabooKidz"],
    ],
    family: [
      ["Our Planet", "David Attenborough · Netflix", "https://www.justwatch.com/in/search?q=Our%20Planet"],
      ["Planet Earth II", "BBC", "https://www.justwatch.com/in/search?q=Planet%20Earth%20II"],
      [
        "Malgudi Days",
        "R. K. Narayan's stories · Doordarshan classic",
        "https://www.justwatch.com/in/search?q=Malgudi%20Days",
      ],
      [
        "The Magic School Bus Rides Again",
        "Netflix",
        "https://www.justwatch.com/in/search?q=Magic%20School%20Bus%20Rides%20Again",
      ],
    ],
  },
};
const CATS = {
  book: "Books",
  game: "Games",
  electronics: "Electronics",
  equipment: "Equipment",
  tool: "Tools",
  other: "Other",
};
const PREP_KW = [
  "magnifying glass",
  "magnifier",
  "magnet",
  "kitchen scale",
  "measuring tape",
  "ruler",
  "stopwatch",
  "thermometer",
  "Betadine",
  "food colour",
  "balloons",
  "straws",
  "clay",
  "seeds",
  "glitter",
  "lattu",
  "phone sound meter",
];
function preppedTasks() {
  return Object.keys(S.prep || {})
    .map((id) => {
      const p = id.split("|"),
        i = +p[p.length - 1],
        n = +p[p.length - 2],
        u = unitBy(p.slice(1, -2).join("|"));
      if (!u) return "";
      const x = prepFor(u, n, sessionsFor(u))[i];
      return x ? x.task : "";
    })
    .filter(Boolean);
}
/* uploads, night inputs, alarm and the clock */
document.addEventListener("change", async (e) => {
  const t = e.target;
  if (t.id === "obExam" && ob) {
    ob.d.exam = t.checked;
    return;
  }
  if (t.id === "sMode") {
    S.mode = t.value;
    S.plus = t.value !== "books";
    sfx("tick");
    commit();
    return;
  }
  if (t.id === "sExam") {
    S.exam = t.checked;
    sfx("tick");
    commit();
    return;
  }
  if (t.dataset.remf) {
    REM()[t.dataset.remf] = t.value;
    commit();
    return;
  }
  if (t.dataset.remck) {
    const R = REM(),
      k = t.dataset.remck;
    if (k === "notif" && t.checked && typeof Notification !== "undefined") {
      Notification.requestPermission()
        .then((p) => {
          R.notif = p === "granted";
          if (!R.notif) toast("Pop-ups were not allowed on this phone");
          commit();
        })
        .catch(() => {
          R.notif = false;
          toast("Pop-ups aren't available here");
          commit();
        });
      return;
    }
    R[k] = t.checked;
    commit();
    return;
  }
  if (t.dataset.tsel) {
    const T = tSetup();
    T[t.dataset.tsel] = t.value;
    sfx("tap");
    commit();
    return;
  }
  if (t.dataset.zip) {
    const Z = zipSel();
    t.checked ? Z[t.dataset.zip].add(t.value) : Z[t.dataset.zip].delete(t.value);
    ui.zip = null;
    render();
    return;
  }
  if (t.dataset.evf) {
    const e = (S.events || []).find((x) => x.id === t.dataset.id);
    if (e) {
      e[t.dataset.evf] = t.value || (t.dataset.evf === "title" ? e.title : null);
      save();
    }
    return;
  }
  if (t.id === "importFile" && t.files?.[0]) {
    const f = t.files[0];
    t.value = "";
    dataImport(f);
    return;
  }
  if (t.id === "upFiles" && t.files?.length) {
    const F = [...t.files];
    t.value = "";
    upFiles(F);
    return;
  }
  if (t.dataset.upk !== undefined) {
    const w = (S.work || []).find((x) => x.id === t.dataset.upk);
    if (w) {
      w.k = t.value;
      sfx("tap");
      commit();
    }
    return;
  }
  if (t.dataset.sch) {
    S.school = { ...(S.school || {}), [t.dataset.sch]: t.value };
    save();
    return;
  }
  if (t.id === "icsFile" && t.files?.[0]) {
    let items = [];
    try {
      items = parseICS(await t.files[0].text());
    } catch (err) {}
    ui.dump = { items, questions: [], text: "", err: items.length ? "" : "No upcoming events found in that file." };
    sfx(items.length ? "ok" : "no");
    render();
    setTimeout(() => document.querySelector(".dump")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    return;
  }
  if (t.id === "dumpImg") {
    ui.dump = ui.dump || {};
    ui.dump.text = document.getElementById("dumpText")?.value || "";
    ui.dump.files = [...t.files].slice(0, 4);
    render();
    return;
  }
  if (t.dataset.upload && t.files?.length) {
    if (!ASSETS) {
      toast("Photos can't be saved in this view");
      return;
    }
    const k = t.dataset.upload,
      u = unitBy(k);
    toast("Saving photo…");
    try {
      for (const f of [...t.files].slice(0, 4)) {
        const r = await ASSETS.upload(f);
        S.work = [...(S.work || []), { id: r.id, k, date: today, title: u?.title || "" }];
      }
      sfx("ok");
      toast("Photo saved to the journey");
      commit();
    } catch (err) {
      toast(
        {
          too_large: "That photo is too big (20 MB limit)",
          unsupported_type: "Use a JPG, PNG or WebP photo",
          quota_or_state: "Photo storage is full",
        }[err?.code] || "Couldn't save the photo. Try again.",
      );
    }
    return;
  }
  if (t.dataset.alarm) {
    S.alarm = {
      ...(S.alarm || { on: false, time: "06:30" }),
      [t.dataset.alarm]: t.type === "checkbox" ? t.checked : t.value,
    };
    S.updatedAt = Date.now();
    save();
    return;
  }
  if (t.dataset.over) {
    S.dayOver = {
      ...(S.dayOver || {}),
      [t.dataset.over]: { ...((S.dayOver || {})[t.dataset.over] || {}), start: t.value },
    };
    S.updatedAt = Date.now();
    save();
    return;
  }
});
let lastMin = -1,
  rang = {};
setInterval(() => {
  const nm = nowMin();
  if (nm === lastMin) return;
  lastMin = nm;
  const al = S.alarm;
  if (al?.on && clock24(nm) === al.time && !rang[today]) {
    rang[today] = 1;
    let n = 0;
    const ring = () => {
      if (n++ < 6) {
        sfx("win");
        setTimeout(ring, 1600);
      }
    };
    ring();
    toast(greetWord() + (pname() ? ", " + pname() : "") + "! Time to get up");
  }
  const busy = document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
  if (!busy && !(ui.sheet && sheet.open) && (rollDay() || tab === "today")) render();
}, 20000);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && !(ui.sheet && sheet.open)) {
    rollDay();
    render();
  }
});
document.getElementById("hello").onclick = () => {
  if (ACC && !ob && S.setup) {
    sfx("flip");
    openSheet({ mode: "parent" });
  }
};
(async () => {
  try {
    DBH = (await window.claude?.use?.("db")) || null;
    const us = await window.claude?.use?.("user");
    UID = us ? await us.id().catch(() => null) : null;
    if (us) {
      const me = await us.me().catch(() => null);
      ACCT =
        String(me?.name || "")
          .trim()
          .split(/\s+/)[0] || "";
      ACCT = ACCT ? ACCT[0].toUpperCase() + ACCT.slice(1) : "";
      render();
    }
    if (DBH) {
      const sn = await DBH.collection("topics")
        .limit(500)
        .get()
        .catch(() => null);
      if (sn)
        SHARED.topics = sn.docs
          .map((d) => {
            const g = d.data() || {};
            return { ...g, id: d.id, level: Math.min(5, Math.max(1, +g.level || 1)), hours: +g.hours || 3 };
          })
          .filter((g) => g.name && SUBJ[g.subj]);
      _all = null;
    }
  } catch (e) {}
  try {
    SAMPLE = (await window.claude?.use?.("sample")) || null;
    ASSETS = (await window.claude?.use?.("assets")) || null;
    if (SAMPLE) {
      const l = await SAMPLE.limits().catch(() => null);
      IMGOK = !!l?.images;
    }
  } catch (e) {}
  render();
})();

function rng(seed) {
  let s = (seed * 9973) % 233280 || 7;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}
function blobD(seed, cx = 50, cy = 56, r = 37, n = 7) {
  const R = rng(seed),
    P = [...Array(n)].map((_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2,
        k = 0.86 + R() * 0.26;
      return [cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k];
    });
  const f = (v) => v.toFixed(1);
  let d = `M${f(P[0][0])},${f(P[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = P[(i - 1 + n) % n],
      p1 = P[i],
      p2 = P[(i + 1) % n],
      p3 = P[(i + 2) % n];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + "Z";
}
function blob(col, seed = 1, mood = "happy", cls = "bl", attrs = "") {
  const k = "#2B2340";
  const eyes =
    mood === "sleepy"
      ? `<path d="M35 52q6 5 12 0M53 52q6 5 12 0" stroke="${k}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="41" cy="51" rx="4.3" ry="5.4" fill="${k}"/><ellipse cx="59" cy="51" rx="4.3" ry="5.4" fill="${k}"/><circle cx="42.5" cy="48.8" r="1.6" fill="#fff"/><circle cx="60.5" cy="48.8" r="1.6" fill="#fff"/>`;
  const mouth =
    mood === "wow"
      ? `<ellipse cx="50" cy="64" rx="4" ry="5" fill="${k}"/>`
      : mood === "calm"
        ? `<path d="M45 63h10" stroke="${k}" stroke-width="3.4" stroke-linecap="round"/>`
        : `<path d="M43 61q7 7.5 14 0" stroke="${k}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
  return `<svg class="${cls}" ${attrs} viewBox="0 0 100 100" aria-hidden="true"><path d="${blobD(seed)}" fill="${col}"/><circle cx="32" cy="61" r="4.6" fill="#FF6F9F" opacity=".45"/><circle cx="68" cy="61" r="4.6" fill="#FF6F9F" opacity=".45"/>${eyes}${mouth}</svg>`;
}
const PAL = ["var(--aqua)", "var(--gum)", "var(--sun)", "var(--pist)", "var(--peri)", "var(--tang)", "var(--sky)"];
const SUBJ_BLOB = {
  math: ["var(--aqua)", 3],
  eng: ["var(--gum)", 7],
  hin: ["var(--tang)", 11],
  sci: ["var(--forest)", 5],
  dks: ["var(--peri)", 9],
  wml: ["var(--sun)", 13],
  wart: ["var(--gum)", 17],
};
function sblob(s, mood = "happy", cls = "bl", attrs = "") {
  const b = SUBJ_BLOB[s] || ["var(--peri)", 2];
  return blob(b[0], b[1], mood, cls, attrs);
}
const kidBlob = (cls = "bl", mood = "happy", attrs = "") => blob("var(--sky)", 13, mood, cls, attrs);
const youBlob = (cls = "bl", mood = "happy", attrs = "") => blob("var(--peri)", 17, mood, cls, attrs);

function flower(x, y, col, i, bloomed, isNow) {
  if (!bloomed)
    return `<g class="${isNow ? "bob" : "sway"}"><path d="M${x} ${y}v-16" stroke="var(--forest)" stroke-width="3" stroke-linecap="round"/><path d="M${x} ${y - 8}q-9-2-11-10q9 0 11 8zM${x} ${y - 11}q9-3 10-11q-9 1-10 9z" fill="var(--forest)"/>${isNow ? `<path d="M${x + 13} ${y - 34}l2.2 4.4 4.4 2.2-4.4 2.2-2.2 4.4-2.2-4.4-4.4-2.2 4.4-2.2z" fill="#fff"/>` : ""}</g>`;
  const h = 34 + (i % 3) * 9,
    cy = y - h,
    pet = [0, 72, 144, 216, 288]
      .map((a) => {
        const r = (a * Math.PI) / 180,
          px = x + Math.cos(r) * 9.5,
          py = cy + Math.sin(r) * 9.5;
        return `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="8" ry="6.2" transform="rotate(${a} ${px.toFixed(1)} ${py.toFixed(1)})" fill="${col}"/>`;
      })
      .join("");
  return `<g class="bloom" style="animation-delay:${(i * 0.07).toFixed(2)}s"><g class="sway" style="animation-delay:${(i * 0.3).toFixed(1)}s"><path d="M${x} ${y}V${cy}" stroke="var(--forest)" stroke-width="3.2" stroke-linecap="round"/><path d="M${x} ${y - 12}q-12-2-14-12q12 0 14 10z" fill="var(--forest)"/>${pet}<circle cx="${x}" cy="${cy}" r="7.5" fill="var(--sun)"/><circle cx="${x - 2.6}" cy="${cy - 1}" r="1.3" fill="#2B2340"/><circle cx="${x + 2.6}" cy="${cy - 1}" r="1.3" fill="#2B2340"/><path d="M${x - 2.6} ${cy + 2.2}q2.6 2.6 5.2 0" stroke="#2B2340" stroke-width="1.3" fill="none" stroke-linecap="round"/></g></g>`;
}

const KICO = {
  lesson: "read",
  prep: "prep",
  warm: "warm",
  exps: "exps",
  event: "event",
  todo: "prep",
  refresh: "game",
  plan: "week",
};

function pathMap(units, covOf) {
  const n = units.length;
  if (!n) return "";
  const step = 118,
    top = 56,
    H = top + n * step,
    xs = [50, 78, 50, 22];
  const P = units.map((u, i) => [xs[i % 4], top + i * step]);
  let d = `M${P[0][0]} ${P[0][1]}`;
  for (let i = 1; i < n; i++)
    d += ` C${P[i - 1][0]} ${P[i - 1][1] + step * 0.55} ${P[i][0]} ${P[i][1] - step * 0.55} ${P[i][0]} ${P[i][1]}`;
  const nextI = units.findIndex((u) => rank[covOf(u)] < 2);
  const deco = units
    .map((u, i) =>
      i % 3 === 1
        ? `<div style="position:absolute;left:${100 - xs[i % 4] > 50 ? 88 : 6}%;top:${P[i][1] - 30}px;width:34px">${blob(PAL[(i + 2) % PAL.length], 40 + i, "sleepy", "", 'width="34" height="34"')}</div>`
        : "",
    )
    .join("");
  return `<div class="pathmap" style="height:${H}px"><svg viewBox="0 0 100 ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" fill="none" stroke="var(--soil)" stroke-width="26" stroke-linecap="round" vector-effect="non-scaling-stroke"/><path d="${d}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round" vector-effect="non-scaling-stroke" opacity=".8"/></svg>${deco}
   ${units
     .map((u, i) => {
       const cs = covOf(u),
         ts = u.c?.x ? chapterTasks(u) : null,
         td = ts ? ts.filter((a) => taskDone(u.k, a[0])).length : 0;
       return `<button class="node ${SC(u.subj)} ${cs} ${i === nextI ? "next" : ""}" style="left:${P[i][0]}%;top:${P[i][1] + 12}px" data-act="chapter" data-k="${u.k}">${i === nextI ? kidBlob("", "happy", 'width="34" height="34" style="margin-bottom:-10px"') : ""}<span class="dot">${rank[cs] >= 2 ? `<svg width="28" height="28" viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill="#fff"/></svg>` : /^\d+$/.test(u.n) ? u.n : esc(u.n)}</span><span class="lbl">${esc(u.title)}</span><span class="sub">${ts ? `${td}/${ts.length} tasks · ` : ""}${STATUS[cs]}</span></button>`;
     })
     .join("")}</div>`;
}
function crowd() {
  const B = [
    ["var(--sun)", 4, "sleepy", -10, 70, 130],
    ["var(--gum)", 7, "happy", 80, 40, 150],
    ["var(--aqua)", 3, "wow", 190, 60, 140],
    ["var(--forest)", 5, "happy", 270, 30, 130],
    ["var(--peri)", 17, "calm", 30, 110, 120],
    ["var(--tang)", 11, "happy", 140, 105, 130],
    ["var(--sky)", 13, "happy", 240, 110, 125],
  ];
  return `<svg class="crowd" viewBox="0 0 380 230" aria-hidden="true">${B.map(([c, s, m, x, y, z], i) => blob(c, s, m, i % 2 ? "bob" : "", `x="${x}" y="${y}" width="${z}" height="${z}" style="animation-delay:${i * 0.2}s"`)).join("")}</svg>`;
}
