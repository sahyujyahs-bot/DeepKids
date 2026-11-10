/* Library: topics, syllabus browsing, resources, the home shelf */
// one labelled row of choices (Board, Subject, Class...): the label says what the row picks, each kind has its colour
const pickRow = (kind, label, chips) =>
  `<div class="pick ${kind}"><span class="pickl">${label}</span><div class="row chips">${chips}</div></div>`;
function combinedTopicList() {
  const sj = "sci",
    cls = Object.keys(DATA.combined?.[sj] || {})
      .map(Number)
      .sort((a, b) => a - b),
    lv = cls.includes(ui.bl) ? ui.bl : cls.includes(S.levels?.sci) ? S.levels.sci : cls[0],
    L = ((DATA.combined?.[sj] || {})[lv] || []).filter((e) => unitByK(e.k));
  return `${pickRow("c", "Class", cls.map((l) => `<button class="chip" aria-pressed="${lv === l}" data-act="bl" data-l="${l}">Class ${l}</button>`).join(""))}
   ${dkViewPick(`${L.length} topics`)}<p class="xs muted">Your Class ${lv} plan on the DeepKids track: every science topic any board teaches in Class ${lv}.</p>${L.map(combinedCard).join("")}`;
}
// a lesson of the DeepKids class plan, on the same card as a unit, with the picture of a unit it links to
function combinedCard(e) {
  const u = unitByK(e.k),
    s = statusOf(u.k),
    n = u.c?.p?.days?.length;
  return unitCard({
    act: `data-act="chapter" data-k="${esc(u.k)}"`,
    pic: unitPic((e.units || []).find((x) => DATA.units?.[x.id]?.pic)?.id || u.subj),
    title: u.title,
    gist: firstSentence(u.c?.p?.summary),
    tag: shortRef(e.boards || []),
    facts: [n ? `About ${n} session${n === 1 ? "" : "s"}` : "", s === "none" ? "" : `<b>${STATUS[s]}</b>`],
  });
}
// DeepKids track in the Library: per subject, the written units and topic ladder
function dkTrackBrowse() {
  const subjs = SUBJ_KEYS.filter((k) => !WFS.includes(k)),
    sj = subjs.includes(ui.bs) ? ui.bs : "sci",
    chips = pickRow(
      "s",
      "Subject",
      subjs
        .map((s) => `<button class="chip" aria-pressed="${sj === s}" data-act="bs" data-s="${s}">${SUBJ[s]}</button>`)
        .join(""),
    );
  if (sj !== "sci")
    return `${chips}<p class="note">DeepKids ${esc(SUBJ[sj])} is coming soon. For now, its chapters are under Board track.</p>`;
  return chips + combinedBrowse();
}
// DeepKids Science two ways, picked under View: the class plan, or every topic with its levels 1 to 5
const dkViewPick = (count) =>
  `<div class="libview"><label class="viewpick"><span class="sm">View:</span><select id="dkView">${[
    ["class", "Class plan"],
    ["topic", "All topics and levels"],
  ]
    .map(
      ([k, n]) =>
        `<option value="${k}"${(ui.dkview === "topic" ? "topic" : "class") === k ? " selected" : ""}>${n}</option>`,
    )
    .join("")}</select></label><span class="sm muted">${count}</span></div>`;
const combinedBrowse = () => (ui.dkview === "topic" ? fxTopicLadder() : combinedTopicList());
// every science unit, one level at a time: pick a level, see its units by strand; any open unit can be added to the
// plan alongside the class plan, and a count says how many more are coming
function fxTopicLadder() {
  const T = DATA.ladder?.sci || [];
  if (!T.length) return "";
  const lvs = [...new Set(T.flatMap((t) => t.levels.map(([l]) => +l)))].sort((a, b) => a - b),
    lv = lvs.includes(ui.bl) ? ui.bl : lvs.includes(S.levels?.sci) ? S.levels.sci : lvs[Math.min(2, lvs.length - 1)],
    at = (t) => t.levels.find(([l]) => +l === lv)?.[1] || [],
    all = T.flatMap(at),
    have = all.filter(([id]) => DATA.units?.[id]),
    strands = [...new Set(T.map((t) => t.strand))]
      .map((st) => [
        st,
        T.filter((t) => t.strand === st)
          .flatMap(at)
          .filter(([id]) => DATA.units?.[id]),
      ])
      .filter(([, L]) => L.length);
  return `${dkViewPick(`${have.length} units`)}${pickRow("c", "Level", lvs.map((l) => `<button class="chip" aria-pressed="${lv === l}" data-act="bl" data-l="${l}">Level ${l}</button>`).join(""))}
   <p class="xs muted">Level ${lv} is about Class ${DATA.levels?.[lv]?.cls || lv}. Add any unit to your plan, alongside your class plan.${["combined", "none"].includes(S.board) ? "" : " Units with a 🔒 open on the DeepKids track."}</p>
   <section class="fxnew">${strands.map(([st, L]) => `<h3 class="fxsh">${esc(st)}</h3>${fxUnitBtns(L.map(([id]) => DATA.units[id]))}`).join("")}${all.length > have.length ? `<p class="sm muted">${all.length - have.length} more units are coming at Level ${lv}.</p>` : ""}${fxSongBtns()}</section>`;
}
const LSUBJ = {
  sci: "Science",
  math: "Maths",
  eng: "English",
  hin: "Hindi",
  think: "Thinking",
  code: "Coding",
  all: "Textbooks",
};
const STRN = {
  number: "Numbers and place value",
  operations: "Adding, subtracting, multiplying, dividing",
  fractions: "Fractions",
  measurement: "Measuring",
  ["time-money"]: "Time and money",
  shapes: "Shapes and space",
  patterns: "Patterns",
  data: "Data and graphs",
  reasoning: "Puzzles and reasoning",
  ["all-maths"]: "All of maths",
  phonics: "Phonics",
  reading: "Reading",
  stories: "Stories",
  vocabulary: "Words",
  grammar: "Grammar",
  writing: "Writing",
  speaking: "Speaking",
  ["all-english"]: "All of English",
  varnamala: "वर्णमाला",
  poems: "Poems",
  ["all-hindi"]: "All of Hindi",
  thinking: "Thinking routines",
  philosophy: "Philosophy",
  coding: "Coding",
  unplugged: "Unplugged",
  ["all-science"]: "All of science",
  textbooks: "Textbooks",
  ["all-subjects"]: "All subjects",
};
const rOverlap = (r, l) => r.ages[0] <= l + 6 && r.ages[1] >= l + 5;
/* curated: the best free resources tagged to the same topics, shown under our own sheets */
const CURT = {
  worksheet: "Printable",
  activity: "Hands-on",
  experiment: "Experiment",
  reading: "Story or reading",
  lesson: "Lesson",
  game: "Game",
  sim: "Simulation",
  "citizen-science": "Real science project",
  video: "Video",
};
const CURO = ["worksheet", "activity", "experiment", "reading", "game", "lesson", "citizen-science", "sim", "video"];
function curatedFor(u) {
  const T = new Set(topicsOf(u)),
    age = +S.age || 8;
  return (DATA.resources || [])
    .filter((r) => r.concepts.some((c) => T.has(c)) && r.access !== "paid")
    .map((r) => ({
      r,
      s: CURO.indexOf(r.type) * 2 + (age < r.ages[0] || age > r.ages[1] ? 6 : 0) + (r.access === "free" ? 0 : 1),
    }))
    .sort((a, b) => a.s - b.s)
    .map((x) => x.r);
}
const storyHtml = (st) =>
  `<article class="story"><h2>${esc(st.title)}</h2>${st.text.map((p, i) => `<p${i ? "" : ' class="first"'}>${esc(p)}</p>`).join("")}<div class="storyask"><b>Talk about it</b><ol>${st.ask.map((q) => `<li>${esc(q)}</li>`).join("")}</ol></div></article>`;
const LIBT = [
  ["topics", "Syllabus", "Every chapter of every board, by subject and class"],
  ["research", "Research Papers", "Real research papers, retold for children as flashcards"],
  ["games", "Games", "Quick games to play now, puzzles to play here, and every card and board game"],
  ["science", "Curated Resources", "Free activities, simulations and videos, tagged to chapters"],
  [
    "have",
    "Home shelf",
    "Books, games and kits you have at home. Each goes into the plan on the day of the lesson it fits",
  ],
  [
    "mine",
    "Notes and study material",
    "Your own notes and study material, put with the matching lessons, with quizzes and refreshers",
  ],
  ["suggest", "Worth buying", "Books, games and kits picked for your child's age and syllabus"],
  ["read", "Read", "Books and stories to read together"],
  ["watch", "Watch", "Videos and shows worth watching"],
];
function resChapters(r) {
  const ks = new Set([...(r.chapters || []), ...r.concepts.flatMap((c) => RCON[c]?.chapters || [])]);
  return [...ks]
    .map(unitByK)
    .filter(Boolean)
    .sort((a, b) => chapterRank(a) - chapterRank(b));
}
const chipK = (u) => `<button class="chip xs" data-act="chapter" data-k="${esc(u.k)}">${esc(unitLabel(u))}</button>`;
// what the family owns that goes with a lesson: tagged to it when sorted, or (added by hand, untagged)
// sharing a real word with the lesson's title, like "bar magnets" and "Magnets: …"
const shelfWords = (t) =>
  new Set(
    (
      String(t)
        .toLowerCase()
        .match(/[a-z]{4,}/g) || []
    ).map((w) => w.replace(/(es|s)$/, "")),
  );
const SHELF_SKIP = new Set([
  "book",
  "game",
  "with",
  "from",
  "your",
  "what",
  "that",
  "this",
  "kid",
  "children",
  "little",
]);
const shelfFor = (u) =>
  (S.inv || []).filter(
    (i) =>
      (i.chapters || []).includes(u.k) ||
      (i.concepts || []).some((c) => (RCON[c]?.chapters || []).includes(u.k)) ||
      (!i.chapters?.length &&
        !i.concepts?.length &&
        [...shelfWords(i.name)].some((w) => !SHELF_SKIP.has(w) && shelfWords(u.title).has(w))),
  );
function invCard() {
  const D_ = ui.idump || {};
  return `<section class="card dump"><div class="row" style="flex-wrap:nowrap;gap:12px">${blob("var(--gum)", 7, "wow", "", 'width="48" height="48"')}<div><h3 class="fs5">Tell us what you have</h3><p class="xs muted">Type a list, say it with your keyboard's mic, or add photos of a shelf, book covers or game boxes. We sort it into books, games and more, and tag each to the chapters it helps with.</p></div></div>
   <textarea class="inp" id="invText" placeholder="Ruskin Bond's The Blue Umbrella, a magnifying glass, Ludo, Snakes and Ladders, a globe, Tinkle comics, a kids' microscope, 2 bar magnets">${esc(D_.text || "")}</textarea>
   <div class="row">${IMGOK ? `<label class="btn soft sm pointer">${icon("plus")}Photos<input type="file" id="invImg" accept="image/*" multiple hidden></label>` : lockBtn("shelf", "btn soft sm", "📷 Photos")}<span class="xs muted">${D_.files?.length ? D_.files.length + " photo" + (D_.files.length > 1 ? "s" : "") + " added" : ""}</span><button class="btn sm" data-act="isort" style="margin-left:auto" ${D_.busy ? "disabled" : ""}>${D_.busy ? "Sorting…" : "Sort it in"}</button></div>
   ${SAMPLE ? "" : `<p class="xs muted">A typed list is sorted on this phone. Reading photos is part of DeepKids Plus.</p>`}${D_.err ? `<p class="sm err">${esc(D_.err)}</p>` : ""}
   ${D_.items ? `<div class="col" style="gap:8px">${D_.items.map((it, i) => `<div class="parsed ${it.keep ? "" : "off"}"><button class="ck ${it.keep ? "on" : ""}" data-act="ikeep" data-i="${i}" aria-label="Keep">${icon("check")}</button><div style="min-width:0"><b class="h4">${esc(it.name)}</b><p class="xs muted">${esc([CATS[it.cat] || "Other", it.by, it.kind, it.ages].filter(Boolean).join(" · "))}</p>${(it.chapters || []).length ? `<div class="row chips">${it.chapters.map(unitByK).filter(Boolean).slice(0, 3).map(chipK).join("")}</div>` : ""}</div></div>`).join("")}<div class="row"><button class="btn green" data-act="iadd">${icon("check")}Add ${D_.items.filter((x) => x.keep).length}</button><button class="btn line sm" data-act="iclear">Clear</button></div></div>` : ""}</section>`;
}
// the lessons planned for this year and after, in order, so each thing owned is matched to the lesson it will be used in
function invContext() {
  return S.subjects
    .flatMap((s) => plannedUnits(s).slice(0, 80))
    .slice(0, 260)
    .map((u) => `${u.k} = ${unitLabel(u)}`)
    .join("\n");
}
// a typed list of things the family owns, read on the phone: one thing per comma, line or "and", sorted by what it is
const INVCAT = [
  ["book", /\b(book|reader|encyclop|atlas|comic|magazine|dictionar|novel|series)|[A-Z][\w]+'s [A-Z]/],
  [
    "game",
    /\b(game|games|cards|puzzle|jigsaw|lego|blocks|chess|ludo|carrom|uno|monopoly|scrabble|domino|snakes|ladders|bingo|housie|pictionary|jenga|business)/i,
  ],
  ["electronics", /\b(tablet|laptop|computer|kindle|phone|ipad|speaker|tv|television)\b/i],
  [
    "equipment",
    /\b(microscope|magnif|telescope|globe|kit|scale|thermometer|magnet|prism|binocular|abacus|ruler|compass|stethoscope)/i,
  ],
  ["tool", /\b(scissors|hammer|screwdriver|tool|glue|stapler|saw|pliers)\b/i],
];
function invLocal(text) {
  // "Snakes and Ladders": an "and" between two capitalised words is part of a title
  return text
    .replace(/\b([A-Z][\w']*) and (?=[A-Z])/g, "$1 \u0026 ")
    .split(/\n|,|;|\band\b/i)
    .map((t) => t.replace(/ \u0026 /g, " and "))
    .map((t) =>
      t
        .trim()
        .replace(/^(we|i)\s+(have|own|got|bought)\s+/i, "")
        .replace(/^(a|an|the|some|our|my)\s+/i, "")
        .replace(/[.!]+$/, ""),
    )
    .filter((t) => t.length > 1)
    .map((name) => ({
      name: name[0].toUpperCase() + name.slice(1, 80),
      cat: (INVCAT.find(([, re]) => re.test(name)) || ["other"])[0],
      by: "",
      kind: "",
      ages: "",
      note: "",
      chapters: [],
      concepts: [],
      keep: true,
    }));
}
async function runInvSort() {
  const ta = document.getElementById("invText"),
    text = (ta?.value || "").trim(),
    D_ = (ui.idump = ui.idump || {});
  D_.text = text;
  // a typed list is sorted on the phone; AI only reads photos of shelves and covers
  if (!D_.files?.length) {
    D_.items = invLocal(text);
    D_.err = D_.items.length ? "" : "Type what you have, like “a microscope, Lego, Ganit Mala books”.";
    sfx(D_.items.length ? "ok" : "no");
    return render();
  }
  if (!SAMPLE) {
    D_.err = "Reading a photo is part of DeepKids Plus. Type the names instead and they're added right away.";
    return render();
  }
  if (!text && !D_.files?.length) {
    D_.err = "Type something or add a photo first.";
    sfx("no");
    return render();
  }
  D_.busy = true;
  D_.err = "";
  render();
  const prompt = `You help a parent in India who homeschools ${S.child || "their child"} (age ${S.age}). They told us what learning things they own${D_.files?.length ? ", and attached photos (a shelf, book covers, game boxes, toys or equipment). Read every title, author and brand you can see" : ""}.
List each separate thing once. For each give: "name" (the real title or product name, as printed), "cat" (book|game|electronics|equipment|tool|other), "by" (author, publisher or maker if known, else ""), "kind" (e.g. picture book, chapter book, comic, board game, card game, puzzle, kit, instrument), "ages" (e.g. "6–9" if known, else ""), "note" (one short line on what it is or how it helps learning), "chapters" (0–4 keys from the list below that it genuinely helps with), "concepts" (0–3 ids from: ${Object.keys(RCON).join(", ")}).
Only tag chapters and concepts that truly fit. Never invent a title you can't read; if unsure write what you see, e.g. "a blue science activity book".
Chapters (key = label):
${invContext()}
Reply with only JSON: {"items":[{"name":"","cat":"","by":"","kind":"","ages":"","note":"","chapters":[],"concepts":[]}]}
Message:
"""${text.slice(0, 5000)}"""`;
  try {
    const opt = { modelTier: "quick", cache: false };
    if (D_.files?.length) opt.images = D_.files;
    const r = await SAMPLE.json(prompt, opt),
      valid = new Set([...allUnits(), ...everyUnit()].map((u) => u.k));
    D_.items = (Array.isArray(r?.items) ? r.items : [])
      .filter((x) => x && x.name)
      .map((x) => ({
        name: String(x.name).slice(0, 80),
        cat: CATS[x.cat] ? x.cat : "other",
        by: String(x.by || "").slice(0, 60),
        kind: String(x.kind || "").slice(0, 40),
        ages: String(x.ages || "").slice(0, 10),
        note: String(x.note || "").slice(0, 160),
        chapters: (x.chapters || []).filter((k) => valid.has(k)).slice(0, 4),
        concepts: (x.concepts || []).filter((c) => RCON[c]).slice(0, 3),
        keep: true,
      }));
    if (!D_.items.length) D_.err = "We couldn't find anything in that. Try listing titles.";
    sfx(D_.items.length ? "ok" : "no");
  } catch (e) {
    D_.err = aiError(e);
    sfx("no");
  }
  D_.busy = false;
  render();
}
// one thing on the shelf: a book stands as a spine, a game is a box, anything else a small block
function shelfThing(i) {
  const h = [...i.name].reduce((a, c) => a + c.charCodeAt(0), 0),
    col = ["var(--tang)", "var(--aqua)", "var(--peri)", "var(--sun)", "var(--forest)", "var(--sky)", "var(--soil)"][
      h % 7
    ],
    cls = i.cat === "book" ? "spine" : i.cat === "game" ? "gbox" : "kit",
    size = i.cat === "book" ? `height:${78 + (h % 26)}px;width:${26 + (h % 12)}px` : "";
  return `<button class="sthing" data-act="invsel" data-i="${esc(i.id)}" aria-pressed="${ui.invSel === i.id}" title="${esc(i.name)}"><span class="${cls}" style="background:${col};${size}">${esc(i.name)}</span></button>`;
}
function invItem(i) {
  // the planned lessons it goes into
  const ch = S.subjects.flatMap((s) => plannedUnits(s)).filter((u) => shelfFor(u).includes(i));
  return `<div class="invi"><div style="min-width:0"><b>${esc(i.name)}</b>${i.by || i.kind ? `<span class="xs muted"> · ${esc([i.by, i.kind].filter(Boolean).join(" · "))}</span>` : ""}${i.note ? `<p class="xs muted">${esc(i.note)}</p>` : ""}${ch.length ? `<p class="xs muted">Goes into the plan with:</p><div class="row chips">${ch.slice(0, 3).map(chipK).join("")}</div>` : `<p class="xs muted">Not matched to a lesson in this year's plan yet.</p>`}</div><button class="plain" data-act="invdel" data-i="${i.id}" aria-label="Remove ${esc(i.name)}">${icon("close")}</button></div>`;
}
const RTYPE = {
  sim: "Simulation",
  worksheet: "Worksheet",
  experiment: "Experiment",
  activity: "Activity",
  video: "Video",
  game: "Game",
  reading: "Reading",
  lesson: "Lesson",
  tool: "Tool",
  "citizen-science": "Citizen science",
};
const RACC = { free: "Free", "free-account": "Free sign-up", freemium: "Partly free", paid: "Paid" };
const RCON = Object.fromEntries((DATA.rconcepts || []).map((c) => [c.id, c]));
const rFits = (r) => !S.age || (r.ages[0] <= S.age && S.age <= r.ages[1]);
function resourcesFor(u) {
  const L = (DATA.resources || []).filter(
    (r) => (r.chapters || []).includes(u.k) || r.concepts.some((c) => (RCON[c]?.chapters || []).includes(u.k)),
  );
  // maths, English and Hindi also get the free resources for their level
  if (u.subj === "sci" || !LSUBJ[u.subj]) return L;
  const seen = new Set(L.map((r) => r.url));
  return [
    ...L,
    ...(DATA.resources || []).filter((r) => r.subj.includes(u.subj) && rOverlap(r, u.level || 1) && !seen.has(r.url)),
  ];
}
const resSort = (L) =>
  [...L].sort((a, b) => rFits(b) - rFits(a) || (a.access === "free" ? 0 : 1) - (b.access === "free" ? 0 : 1));
function resCard(r, i) {
  const ch = resChapters(r),
    show = ch.slice(0, 3),
    more = ch.length - show.length;
  return `<div class="libcard rescard" style="--c:${PAL[i % PAL.length]}"><span class="row" style="gap:6px;flex-wrap:wrap"><span class="pill">${RTYPE[r.type] || esc(r.type)}</span><span class="xs muted">Ages ${r.ages[0]}–${r.ages[1]} · ${RACC[r.access] || ""}${(r.lang || []).filter((l) => l !== "en").length ? " · " + r.lang.map((l) => l.toUpperCase()).join(", ") : ""}</span></span>
   <a href="${esc(r.url)}" target="_blank" rel="noopener" style="color:inherit"><b>${esc(r.title)} ↗</b></a><span class="xs muted">${esc(r.source)}</span><span class="sm">${esc(r.desc)}</span>${r.how ? `<span class="xs"><b>How to use:</b> ${esc(r.how)}</span>` : ""}
   <span class="xs"><b>${r.concepts.length ? "Idea" : "Area"}:</b> ${(r.concepts.length ? r.concepts.map((c) => esc(RCON[c]?.concept || c)) : r.strands.map((s) => esc(STRN[s] || s))).join(" · ")}</span>
   ${show.length ? `<span class="xs"><b>Fits:</b></span><div class="row chips">${show.map(chipK).join("")}${more > 0 ? `<span class="xs muted">+${more} more</span>` : ""}</div>` : ""}</div>`;
}
function resTab(u) {
  const L = resSort(resourcesFor(u));
  if (!L.length) return `<p class="note">No outside resources tagged to this chapter yet.</p>`;
  const ty = ui.rtc || "all",
    T = [...new Set(L.map((r) => r.type))],
    F = ty === "all" ? L : L.filter((r) => r.type === ty);
  return `<p class="sm muted">${L.length} free and low-cost resources from trusted sites, matched to this chapter's ideas.${S.age ? ` Ones that suit age ${S.age} come first.` : ""}</p><div class="row" style="flex-wrap:wrap;gap:6px">${[["all", "All"], ...T.map((t) => [t, RTYPE[t] || t])].map(([k, n]) => `<button class="chip" aria-pressed="${ty === k}" data-act="rtc" data-t="${k}">${n}</button>`).join("")}</div><div class="grid2">${F.map(resCard).join("")}</div>`;
}
function scienceTab() {
  const R = DATA.resources || [],
    sj = ui.rsj || "sci",
    C = DATA.rconcepts || [],
    cn = ui.rc || "",
    ty = ui.rt || "all",
    fit = ui.rfit !== false;
  const inS = R.filter((r) => r.subj.includes(sj)),
    tags = (r) => (sj === "sci" ? r.concepts.concat(r.strands) : r.strands);
  let L = inS.filter((r) => (!cn || tags(r).includes(cn)) && (ty === "all" || r.type === ty) && (!fit || rFits(r)));
  const counts = {};
  inS.forEach((r) => tags(r).forEach((c) => (counts[c] = (counts[c] || 0) + 1)));
  const opts =
    sj === "sci"
      ? [...C.map((c) => [c.id, c.concept]), ["all-science", STRN["all-science"]]]
      : Object.keys(counts).map((k) => [k, STRN[k] || k]);
  return `<section class="sec"><p class="sm muted">${R.length} free and low-cost resources from trusted sites: NASA, Cambridge's NRICH, Harvard's Project Zero, Stanford's youcubed, Khan Academy, PhET, Oak National Academy, StoryWeaver, NCERT and many more. Each one is described and tagged so you can find the right one fast.</p>
   <div class="seg">${Object.entries(LSUBJ)
     .filter(([k]) => R.some((r) => r.subj.includes(k)))
     .map(
       ([k, n]) =>
         `<button aria-pressed="${sj === k}" data-act="rsj" data-v="${k}">${n} (${R.filter((r) => r.subj.includes(k)).length})</button>`,
     )
     .join("")}</div>
   <div class="field"><label for="rcSel">${sj === "sci" ? "Idea" : "Area"}</label><select class="inp" id="rcSel"><option value="">Everything</option>${opts
     .filter(([k]) => counts[k])
     .map(([k, n]) => `<option value="${esc(k)}" ${cn === k ? "selected" : ""}>${esc(n)} (${counts[k]})</option>`)
     .join("")}</select></div>
   <div class="row" style="flex-wrap:wrap;gap:6px">${[["all", "All"], ...Object.entries(RTYPE)]
     .filter(([k]) => k === "all" || inS.some((r) => r.type === k))
     .map(([k, n]) => `<button class="chip" aria-pressed="${ty === k}" data-act="rt" data-t="${k}">${n}</button>`)
     .join("")}</div>
   ${S.age ? `<button class="chip self-start" aria-pressed="${fit}" data-act="rfit">Suits age ${S.age}</button>` : ""}
   <p class="xs muted">${L.length} shown</p><div class="grid2">${resSort(L)
     .slice(0, ui.rmore || 40)
     .map(resCard)
     .join(
       "",
     )}</div>${L.length > (ui.rmore || 40) ? `<button class="btn line sm" data-act="rmore">Show more</button>` : ""}</section>`;
}
function tagsOf(u) {
  const T = [];
  const tag = (i) => ({
    board: i.board,
    txt: `${BOARDS[i.board] ? BOARDS[i.board].split(" ")[0] + " · " : ""}Class ${DATA.levels[i.level].cls} · ${i.book.replace(/ · Class \d+$/, "").replace(/ \(Class \d+\)$/, "")}${/^\d+$/.test(i.n) ? (i.board === "waldorf" ? " · Block " : " · Ch ") + i.n : ""}`,
    k: i.k,
    subj: i.subj,
  });
  if (u.board === "gen") {
    (u.gen.tags || []).forEach((k) => {
      const i = DATA.items.find((z) => z.k === k);
      if (i) T.push(tag(i));
    });
  } else {
    T.push(tag(u));
    const ids = u.dk || [];
    DATA.items
      .filter((i) => i.k !== u.k && i.board !== u.board && ids.some((d) => (i.dk || []).includes(d)))
      .slice(0, 4)
      .forEach((i) => T.push(tag(i)));
  }
  return T;
}
function subjectsOf(u) {
  const s = new Set([u.subj]);
  if (u.board === "gen") (u.gen.subjects || []).forEach((x) => SUBJ[x] && s.add(x));
  tagsOf(u).forEach((t) => s.add(t.subj));
  return [...s];
}
function summaryOf(u) {
  if (u.board === "gen") return u.gen.summary || "";
  const T = tagsOf(u)
    .map((t) => DATA.items.find((i) => i.k === t.k))
    .filter(Boolean);
  const s = T.map((i) => i.c?.covers).filter(Boolean);
  return s.length
    ? [...new Set(s)].join(" ")
    : "Summary coming soon. (Placeholder: we collate this from every book that covers the topic.)";
}
function ideasOf(u) {
  if (u.board === "gen") return { sum: u.gen.plusSummary || "", ideas: (u.gen.ideas || []).map(String) };
  if (u.board === "mine") return { sum: u.c.p.summary, ideas: [] };
  const x = u.c?.x;
  if (x) return { sum: x.oneness, ideas: x.deep.map((d) => d.q) };
  return { sum: "", ideas: ["Placeholder: challenging ideas for this topic are being written."] };
}
function relatedOf(u) {
  const pool = allUnits(),
    ids = u.dk || [],
    pre = prereqOf(u)
      .map((k) => unitBy(k))
      .filter(Boolean)
      .slice(-2);
  let deeper = pool
    .filter((i) => i.k !== u.k && i.subj === u.subj && i.level > u.level && ids.some((d) => (i.dk || []).includes(d)))
    .slice(0, 3);
  if (!deeper.length && u.board !== "gen") {
    const us = DATA.items.filter((i) => i.board === u.board && i.subj === u.subj && i.book === u.book),
      j = us.findIndex((i) => i.k === u.k);
    deeper = us.slice(j + 1, j + 2);
  }
  const wider = pool
    .filter((i) => i.k !== u.k && i.subj !== u.subj && ids.some((d) => (i.dk || []).includes(d)))
    .slice(0, 4);
  const names = u.board === "gen" ? u.gen.related || {} : {};
  return { pre, deeper, wider, names };
}
const uchip = (v) =>
  `<button class="chip ${subjClass(v.subj)}" data-act="chapter" data-k="${v.k}"><span class="dotc"></span>${esc(v.title)}</button>`;
function topicOverview(u) {
  const m = modeOf(),
    T = tagsOf(u),
    I = ideasOf(u),
    R = relatedOf(u),
    sub = subjectsOf(u);
  let h = `<section class="card"><span class="eyebrow">Where this topic sits</span><div class="row">${T.length ? T.map((t) => `<span class="chip">${esc(t.txt)}</span>`).join("") : `<span class="chip">Not in a board syllabus · DeepKids topic</span>`}${sub.length > 1 ? sub.map((s) => `<span class="chip ${subjClass(s)}"><span class="dotc"></span>${SUBJ[s]}</span>`).join("") : ""}</div>
    <span class="eyebrow" style="margin-top:4px">Summary</span><p>${esc(summaryOf(u))}</p></section>`;
  h += `<section class="oneness"><span class="eyebrow">Big ideas</span>${I.sum ? `<p>${esc(I.sum)}</p>` : ""}<ul style="margin:8px 0 0;padding-left:20px;display:grid;gap:4px;font-weight:700">${I.ideas.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></section>`;
  if (m === "books")
    h += `<section class="card r-you tint"><b class="h4">Lesson plans come with DeepKids Plus</b><p class="sm">Ready-made plans for each lesson, big questions, worksheets and games. Switch in App settings.</p></section>`;
  if (u.board !== "gen" && m === "plus")
    h += `<section class="card"><span class="eyebrow">Suggested reading</span><p class="sm">${esc(u.book)}${chNo(u) ? ", " + chNo(u) : ""}${(u.c?.read || []).length ? "; " + u.c.read.map(esc).join("; ") : ""}</p></section>`;
  if (u.board === "gen" && (u.gen.books || []).length)
    h += `<section class="card" style="gap:0"><span class="eyebrow" style="margin-bottom:4px">Books to try</span>${u.gen.books
      .slice(0, 5)
      .map(
        (b) =>
          `<a class="res" href="${AZ((b.title || "") + " " + (b.author || ""))}" target="_blank" rel="noopener"><b>${esc(b.title)} ↗</b><span class="xs muted">${esc(b.author || "")}${b.why ? " · " + esc(b.why) : ""}</span></a>`,
      )
      .join("")}</section>`;
  if (R.pre.length || R.deeper.length || R.wider.length || Object.keys(R.names).length)
    h += `<section class="card"><span class="eyebrow">Related topics</span>${R.pre.length ? `<div><span class="xs muted">Needs first</span><div class="row">${R.pre.map(uchip).join("")}</div></div>` : ""}${R.deeper.length ? `<div><span class="xs muted">Go deeper</span><div class="row">${R.deeper.map(uchip).join("")}</div></div>` : ""}${R.wider.length ? `<div><span class="xs muted">Go wider</span><div class="row">${R.wider.map(uchip).join("")}</div></div>` : ""}${[
      "prereq",
      "deeper",
      "wider",
    ]
      .filter((k) => (R.names[k] || []).length)
      .map(
        (k) =>
          `<div><span class="xs muted">${{ prereq: "Needs first", deeper: "Go deeper", wider: "Go wider" }[k]}</span><div class="row">${R.names[
            k
          ]
            .slice(0, 4)
            .map((n) => `<button class="chip" data-act="tsearch" data-q="${esc(n)}">${esc(n)}</button>`)
            .join("")}</div></div>`,
      )
      .join("")}</section>`;
  return h;
}
function plansTab(u) {
  const O = planOptions(u),
    pk = ((S.planPick || {})[u.k] || {}).full || O.full[0]?.id,
    card = (o, i) =>
      `<section class="card optcard ${o.id === pk ? "chosen" : ""}" style="--c:${PAL[i % PAL.length]}"><div class="sech"><b class="h5">${esc(o.name)}</b>${o.id === pk ? `<span class="pill completed">Chosen</span>` : o.placeholder ? `<span class="pill">Placeholder</span>` : o.gen ? `<span class="pill learning">Claude draft</span>` : ""}</div><p class="sm">${esc(o.idea)}</p>${o.parts ? `<ol class="dsteps">${o.parts.map((p) => `<li><span>${esc(p.label)}</span><b>${esc(p.title)}</b><i>${p.mins ? p.mins + " min" : Math.round(p.f * 100) + "%"}</i></li>`).join("")}</ol>` : `<p class="xs muted">${sessionsFor(u)} lesson days, step by step.</p>`}${o.id !== pk ? `<button class="btn sm self-start" data-act="ppick" data-k="${u.k}" data-o="${o.id}">Use this plan</button>` : ""}</section>`;
  return `<p class="xs muted">Pick one way to teach this chapter. The plans you don't pick come back as games, refreshers and jokes on other days.</p>
   <h3>Full plans</h3>${O.full.map(card).join("")}
   <h3>Short plans · about 30 minutes</h3>${O.busy.map((o, i) => card(o, i + 3)).join("")}`;
}
function topicHits(q) {
  q = q.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/).filter((w) => w.length > 2);
  return allUnits()
    .map((u) => {
      const hay = (u.title + " " + (u.c?.covers || "") + " " + (u.gen?.summary || "")).toLowerCase();
      let sc = hay.includes(q) ? 5 : 0;
      words.forEach((w) => {
        if (hay.includes(w)) sc++;
      });
      if (u.title.toLowerCase().includes(q)) sc += 5;
      return { u, sc };
    })
    .filter((x) => x.sc > 0)
    .sort((a, b) => b.sc - a.sc)
    .slice(0, 12)
    .map((x) => x.u);
}
function topicRow(u) {
  if (u.board === "combined") {
    const B = (u.c?.boards || []).map((x) => `${BNAME[x.b] || x.b} ${x.ref}`).join(", ");
    return `<div class="topic ${subjClass(u.subj)}"><button class="plain trow" data-act="chapter" data-k="${u.k}"><span class="no">✦</span><span style="min-width:0;flex:1;overflow-wrap:anywhere"><b>${esc(u.title)}</b><br><span class="xs muted">${SUBJ[u.subj]} · Class ${u.level} · Covers ${esc(B || u.c?.topic || "")}</span></span>${pillS(statusOf(u.k))}</button></div>`;
  }
  const T = tagsOf(u)[0];
  return `<div class="topic ${subjClass(u.subj)}"><button class="plain trow" data-act="chapter" data-k="${u.k}"><span class="no">${/^\d+$/.test(u.n) ? u.n : esc((u.title || "?")[0])}</span><span style="min-width:0;flex:1"><b>${esc(u.title)}</b><br><span class="xs muted">${SUBJ[u.subj]} · ${u.board === "gen" ? "DeepKids topic" + (u.gen.reviewed ? "" : " · not yet reviewed") : esc(T?.txt || u.book)}</span></span>${pillS(statusOf(u.k))}</button></div>`;
}
function topicsTab() {
  const q = ui.libq || "",
    hits = topicHits(q),
    gen = SHARED.topics
      .slice()
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .slice(0, 8);
  let h = `<section class="sec"><div class="card"><div class="row" style="flex-wrap:nowrap"><input class="inp" id="tq" placeholder="Search any topic: volcanoes, fractions, Akbar…" value="${esc(q)}" maxlength="80"><button class="btn sm" data-act="tfind">Search</button></div>
    <p class="xs muted">${q ? `${hits.length} found in the syllabuses and DeepKids topics.` : "Search, or browse every chapter of every board below."}</p></div>`;
  if (q) {
    h +=
      hits.map(topicRow).join("") +
      `<section class="card r-out tint"><b class="h5">Explore “${esc(q)}” as a new topic</b><p class="sm">Claude writes a summary, big ideas, lesson plans, related topics and books, and tags it to any syllabus it belongs to. It's saved to DeepKids so other families find it too.</p>${SAMPLE ? `<button class="btn sm self-start" data-act="tgen" ${ui.tgen ? "disabled" : ""}>${ui.tgen ? "Writing the topic…" : "Create this topic"}</button>` : `<p class="xs muted">Creating topics needs Claude, which isn't available in this view.</p>`}${ui.terr ? `<p class="sm err">${esc(ui.terr)}</p>` : ""}</section></section>`;
    return h;
  }
  const track = ui.btrack || (onDkTrack() ? "dk" : "board"),
    head = `<div class="sech"><h3 class="fs5">Browse the syllabus</h3></div><div class="pickl">Track</div><div class="seg trackseg">${[
      ["dk", "DeepKids track"],
      ["board", "Board track"],
    ]
      .map(([k, n]) => `<button aria-pressed="${track === k}" data-act="btrack" data-v="${k}">${n}</button>`)
      .join("")}</div>`;
  if (track === "dk") {
    h += head + dkTrackBrowse();
    if (gen.length)
      h += `<div class="sech"><h3 class="fs5">Explored by families</h3></div>${gen.map((g) => topicRow(genUnit(g))).join("")}`;
    return h + `</section>`;
  }
  const BT = ["ncert", "cambridge", "nios", "waldorf"],
    B = BT.includes(ui.bb) ? ui.bb : BT.find((b) => boardsOn().includes(b)) || "ncert",
    subjs = [
      ...new Set(
        allUnits()
          .filter((u) => u.board === B)
          .map((u) => u.subj),
      ),
    ],
    sj = subjs.includes(ui.bs) ? ui.bs : subjs.includes("sci") ? "sci" : subjs[0],
    levels = [
      ...new Set(
        allUnits()
          .filter((u) => u.board === B && u.subj === sj)
          .map((u) => u.level),
      ),
    ].sort(),
    lv = levels.includes(ui.bl) ? ui.bl : levels.includes(S.levels?.[sj]) ? S.levels[sj] : levels[0];
  const units = allUnits().filter((u) => u.board === B && u.subj === sj && u.level === lv),
    lvName = (l) =>
      B === "ncert" || B === "waldorf"
        ? "Class " + l
        : B === "cambridge"
          ? "Stage " + l
          : B === "nios"
            ? "Level " + (l <= 3 ? "A" : "B")
            : "Level " + l;
  h += `${head}
   ${pickRow("b", "Board", BT.map((b) => `<button class="chip" aria-pressed="${B === b}" data-act="bb" data-b="${b}">${BNAME[b]}</button>`).join(""))}${`
   ${subjs.length > 1 ? pickRow("s", "Subject", subjs.map((s) => `<button class="chip" aria-pressed="${sj === s}" data-act="bs" data-s="${s}">${SUBJ[s]}</button>`).join("")) : ""}
   ${levels.length > 1 ? pickRow("c", B === "cambridge" ? "Stage" : B === "nios" ? "Level" : "Class", levels.map((l) => `<button class="chip" aria-pressed="${lv === l}" data-act="bl" data-l="${l}">${lvName(l)}</button>`).join("")) : ""}
   <p class="xs muted">${units.length} ${B === "cambridge" ? "units" : B === "nios" ? "lessons" : B === "waldorf" ? "blocks" : "chapters"}${units.filter((u) => u.c?.p).length ? ` · ${units.filter((u) => u.c?.p).length} with full day plans` : ""}${units[0] ? " · " + esc(units[0].book) : ""}</p>
   ${units.map((u) => topicRow(u).replace("</b><br>", `</b>${u.c?.p ? ` <span class="pill completed" style="font-size:var(--fs-1)">${u.c.p.days.length} parts</span>` : ""}<br>`)).join("") || `<p class="note">${(DATA.notes[B] || {})[sj + "|" + lv] || (B === "ncert" ? DATA.notes.ncert[sj + "|" + lv] : "") || "Nothing here yet."}</p>`}`}`;
  if (gen.length)
    h += `<div class="sech"><h3 class="fs5">Explored by families</h3></div>${gen.map((g) => topicRow(genUnit(g))).join("")}`;
  return h + `</section>`;
}
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "topic";
async function genTopic() {
  const q = (ui.libq || "").trim();
  if (!q || !SAMPLE) return;
  ui.tgen = true;
  ui.terr = "";
  render();
  const list = DATA.items
    .filter((i) => i.board === "ncert" || i.level <= 5)
    .map((i) => `${i.k}: ${i.title}`)
    .join("\n")
    .slice(0, 40000);
  const prompt = `You write topics for DeepKids, a homeschool app for Indian families with children aged 6–10 (Levels 1–5 = Classes 1–5). A parent searched for: "${q.slice(0, 80)}". The child is ${S.age}.
Write one topic level for this, pitched at the right level. Keep substance; never dumb it down. Include Indian perspectives and, where they fit, Vedic, consciousness and oneness ideas, and at least one real scientific debate or contrarian view. Use only English.
Tag it to any of these syllabus chapters that genuinely cover it (use the keys exactly; empty if none):
${list}
Reply with only JSON:
{"name":"","subj":"math|eng|hin|sci","subjects":["math|eng|hin|sci"],"level":1,"hours":3,"tags":["key"],"summary":"3-4 sentences","plusSummary":"1-2 sentences, the wonder of it","ideas":["challenging idea","another","a contrarian view"],"plans":{"full":[{"name":"","idea":"","steps":[{"kind":"read|learn|exp|act|game|proj","title":"","mins":20,"how":"what to do, concretely"}]}],"busy":[{"name":"","idea":"","steps":[{"kind":"","title":"","mins":10,"how":""}]}]},"related":{"prereq":["topic name"],"deeper":["topic name"],"wider":["topic name"]},"books":[{"title":"","author":"","why":""}]}
Give exactly 3 full-day plans (about 60–90 minutes each) and 3 short plans (about 30 minutes each). Only list books you are sure exist. No URLs.`;
  try {
    const r = await SAMPLE.json(prompt, { modelTier: "default", cache: false });
    if (!r || !r.name) throw { code: "invalid_json" };
    const g = {
      id: slug(r.name),
      name: String(r.name).slice(0, 80),
      subj: SUBJ[r.subj] ? r.subj : "sci",
      subjects: (r.subjects || []).filter((s) => SUBJ[s]),
      level: Math.min(5, Math.max(1, +r.level || S.levels[r.subj] || 1)),
      hours: Math.min(20, Math.max(1, +r.hours || 3)),
      tags: (r.tags || []).filter((k) => DATA.items.some((i) => i.k === k)).slice(0, 6),
      summary: String(r.summary || "").slice(0, 1200),
      plusSummary: String(r.plusSummary || "").slice(0, 400),
      ideas: (r.ideas || []).slice(0, 5).map((x) => String(x).slice(0, 300)),
      plans: { full: (r.plans?.full || []).slice(0, 3), busy: (r.plans?.busy || []).slice(0, 3) },
      related: {
        prereq: (r.related?.prereq || []).slice(0, 4).map(String),
        deeper: (r.related?.deeper || []).slice(0, 4).map(String),
        wider: (r.related?.wider || []).slice(0, 4).map(String),
      },
      books: (r.books || []).slice(0, 5).map((b) => ({
        title: String(b.title || "").slice(0, 100),
        author: String(b.author || "").slice(0, 80),
        why: String(b.why || "").slice(0, 160),
      })),
      source: "search",
      query: q.slice(0, 80),
      reviewed: false,
      createdAt: Date.now(),
      by: UID || "",
    };
    SHARED.topics = [...SHARED.topics.filter((x) => x.id !== g.id), g];
    _all = null;
    if (DBH) {
      try {
        await DBH.collection("topics").doc(g.id).set(g);
        await DBH.collection("searches").add({ q: q.slice(0, 80), topic: g.id, at: Date.now(), by: UID || "" });
      } catch (e) {
        ui.terr = "Saved on this device only; the shared library couldn't be reached.";
      }
    }
    ui.tgen = false;
    sfx("win");
    render();
    openSheet({ mode: "chapter", k: "gen|" + g.id });
  } catch (e) {
    ui.tgen = false;
    ui.terr =
      {
        not_granted: "Claude wasn't allowed for this page.",
        rate_limited: "Too many requests just now. Try again in a minute.",
        invalid_json: "The topic didn't come back in the right shape. Try again.",
      }[e?.code] || "Something went wrong. Try again.";
    sfx("no");
    render();
  }
}
function prereqOf(u) {
  if (u.board === "gen") return [];
  if (u.subj === "math") {
    const us = DATA.items.filter((x) => x.board === u.board && x.book === u.book && x.subj === "math"),
      i = us.findIndex((x) => x.k === u.k);
    return us.slice(0, i).map((x) => x.k);
  }
  return [];
}
function swapView() {
  const s = ui.sheet.s,
    cur = nextUp(s);
  setSheetTitle("Swap " + SUBJ[s] + " topic");
  const us = plannedUnits(s).filter((u) => u.level === S.levels[s] && rank[statusOf(u.k)] < 2);
  const rows = us.map((u) => {
    const need = prereqOf(u).filter((k) => rank[statusOf(k)] < 2);
    return { u, need };
  });
  return `<p class="sm muted">${s === "math" ? "Maths builds on itself, so a chapter opens once the chapters before it are done." : "These chapters don't depend on each other, so any order works."}</p>
   <section class="card" style="gap:0">${rows
     .map(({ u, need }, i) => {
       const isCur = cur && cur.u.k === u.k,
         ok = !need.length;
       return `<div class="taskrow ${subjClass(u.subj)}"><span class="unit" style="all:unset"><span class="no" style="width:40px;height:40px;border-radius:13px;display:grid;place-items:center;font:700 var(--fs-4) var(--display);background:var(--c)">${/^\d+$/.test(u.n) ? u.n : i + 1}</span></span><div><b class="h4">${esc(u.title)}</b><p class="xs muted">${statusOf(u.k) === "learning" ? `In progress · Part ${done(u.k)} of ${sessionsFor(u)}` : `${sessionsFor(u)} lesson days`}${
         ok
           ? ""
           : ` · first: ${need
               .map((k) => esc(unitBy(k)?.title || k))
               .slice(0, 2)
               .join(", ")}`
       }</p><div class="meta">${isCur ? `<span class="pill learning">Up next</span>` : ok ? `<button class="btn xs" data-act="pin" data-s="${s}" data-k="${u.k}">Do this next</button>` : `<span class="pill">Locked</span>`}</div></div></div>`;
     })
     .join("")}</section>`;
}
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
const SHELFDO = { book: "Read", game: "Play" };
const CATS = {
  book: "Books",
  game: "Games",
  electronics: "Electronics",
  equipment: "Equipment",
  tool: "Tools",
  other: "Other",
};
function viewLibrary() {
  const t = ui.lt || "topics",
    inv = S.inv || [];
  let h = `<section class="sec libtop"><h1>Library</h1><div class="seg libtabs">${LIBT.map(([k, n, d]) => `<button aria-pressed="${t === k}" data-act="lt" data-t="${k}" title="${esc(d)}">${n}</button>`).join("")}</div></section>`;
  if (t === "topics") h += topicsTab();
  if (t === "research") h += researchTab();
  else if (t === "games") h += gamesTab();
  if (t === "science") h += scienceTab();
  if (t === "mine") h += myBooksTab();
  if (t === "have") {
    const seen = new Set(inv.map((i) => i.name.toLowerCase())),
      kw = new Set(),
      doneTasks = preppedTasks();
    PREP_KW.forEach((k) => {
      if (doneTasks.some((x) => x.toLowerCase().includes(k.toLowerCase())) && !seen.has(k.toLowerCase())) kw.add(k);
    });
    const sel = inv.find((i) => i.id === ui.invSel);
    h += `<section class="sec">${invCard()}${inv.length ? `<div class="shelfwall">${["book", "game", "electronics", "equipment", "tool", "other"].flatMap((c) => inv.filter((i) => (CATS[i.cat] ? i.cat : "other") === c).map(shelfThing)).join("")}</div><p class="xs muted">Tap one to see which lessons it goes with.</p>${sel ? `<div class="card">${invItem(sel)}</div>` : ""}` : ""}
     ${kw.size ? `<div class="card r-you tint"><span class="eyebrow">From your lesson prep</span><p class="sm">You gathered these for lessons. Add them to your home shelf?</p><div class="row">${[...kw].map((k) => `<button class="chip" data-act="invadd" data-n="${esc(k)}" data-c="equipment">${icon("plus")}${esc(k)}</button>`).join("")}</div></div>` : ""}
     <details class="card"><summary class="link pointer">Add one thing by hand</summary><div class="row" style="flex-wrap:nowrap;margin-top:10px"><input class="inp" id="invName" maxlength="60" placeholder="Add something you have"><select class="inp" id="invCat" style="width:auto">${Object.entries(
       CATS,
     )
       .map(([k, n]) => `<option value="${k}">${n}</option>`)
       .join(
         "",
       )}</select></div><button class="btn sm" data-act="invnew" style="justify-self:start;margin-top:8px">Add</button></details></section>`;
  }
  if (t === "suggest") {
    const have = new Set(inv.map((i) => i.name.toLowerCase()));
    h += `<section class="sec"><p class="sm muted">Picked for ${esc(S.child || "your child")}'s age and syllabus. Links go to the shop or maker; check the price there.</p>${Object.keys(
      CATS,
    )
      .map((c) => {
        const L = LIB.suggest.filter((x) => x[0] === c);
        return L.length
          ? `<div class="sech"><h3 class="fs5">${CATS[c]}</h3></div><div class="grid2">${L.map(([cat, n, by, why, url], i) => `<div class="libcard" style="--c:${PAL[i % PAL.length]}"><span class="eyebrow">${esc(by)}</span><b>${esc(n)}</b><p class="sm">${esc(why)}</p><div class="row"><a class="btn xs" href="${esc(url)}" target="_blank" rel="noopener">See it ↗</a>${have.has(n.toLowerCase()) ? `<span class="pill completed">We have it</span>` : `<button class="btn xs soft" data-act="invadd" data-n="${esc(n)}" data-c="${cat}">We have it</button>`}</div></div>`).join("")}</div>`
          : "";
      })
      .join("")}</section>`;
  }
  if (t === "read")
    h += `<section class="sec">${[
      ["parents", "For you"],
      ["kids", "For " + esc(S.child || "kids")],
    ]
      .map(
        ([k, n]) =>
          `<div class="sech"><h3 class="fs5">${n}</h3></div><div class="card" style="gap:0">${LIB.read[k].map(([ti, d, u]) => `<a class="res" href="${esc(u)}" target="_blank" rel="noopener"><b class="h4">${esc(ti)} ↗</b><span class="sm muted">${esc(d)}</span></a>`).join("")}</div>`,
      )
      .join("")}</section>`;
  if (t === "watch")
    h += `<section class="sec">${[
      ["parents", "For you"],
      ["kids", "For " + esc(S.child || "kids")],
      ["family", "Family watch"],
    ]
      .map(
        ([k, n]) =>
          `<div class="sech"><h3 class="fs5">${n}</h3></div><div class="grid2">${LIB.watch[k].map(([ti, d, u], i) => `<a class="libcard" style="--c:${PAL[(i + 2) % PAL.length]};text-decoration:none;color:inherit" href="${esc(u)}" target="_blank" rel="noopener">${icon("play")}<b>${esc(ti)}</b><span class="sm">${esc(d)}</span></a>`).join("")}</div>`,
      )
      .join("")}</section>`;
  return h;
}

/* What this file's buttons do, by their data-act name; the click handler in 21-actions.js calls ACT[name](button, event, name, b.dataset.k) */
Object.assign(ACT, {
  pin(b, e, a, k) {
    const s = b.dataset.s;
    S.next = { ...(S.next || {}), [s]: [k, ...((S.next || {})[s] || []).filter((x) => x !== k)] };
    sfx("ok");
    toast("That's up next");
    sheet.close();
    commit();
  },
  ppick(b, e, a, k) {
    S.planPick = { ...(S.planPick || {}), [k]: { full: b.dataset.o } };
    sfx("ok");
    toast("Plan chosen");
    commit();
  },
  tfind(b, e, a, k) {
    ui.libq = document.getElementById("tq")?.value || "";
    ui.terr = "";
    sfx("tap");
    render();
  },
  tsearch(b, e, a, k) {
    ui.libq = b.dataset.q;
    ui.lt = "topics";
    tab = "library";
    if (sheet.open) sheet.close();
    render();
    scrollTo(0, 0);
  },
  tgen(b, e, a, k) {
    sfx("tap");
    genTopic();
  },
  rt(b, e, a, k) {
    ui.rt = b.dataset.t;
    ui.rmore = 40;
    sfx("tap");
    render();
  },
  rsj(b, e, a, k) {
    ui.rsj = b.dataset.v;
    ui.rc = "";
    ui.rt = "all";
    ui.rmore = 40;
    sfx("tap");
    render();
  },
  rfit(b, e, a, k) {
    ui.rfit = ui.rfit === false;
    sfx("tap");
    render();
  },
  rmore(b, e, a, k) {
    ui.rmore = (ui.rmore || 40) + 40;
    render();
  },
  rtc(b, e, a, k) {
    ui.rtc = b.dataset.t;
    sfx("tap");
    renderSheet();
  },
  btrack(b, e, a, k) {
    navPush();
    ui.btrack = b.dataset.v;
    ui.bs = null;
    ui.bl = null;
    sfx("tap");
    render();
  },
  bb(b, e, a, k) {
    navPush();
    ui.bb = b.dataset.b;
    ui.bs = null;
    ui.bl = null;
    sfx("tap");
    render();
  },
  bs(b, e, a, k) {
    ui.bs = b.dataset.s;
    ui.bl = null;
    sfx("tap");
    render();
  },
  bl(b, e, a, k) {
    ui.bl = +b.dataset.l;
    sfx("tap");
    render();
  },
  isort(b, e, a, k) {
    sfx("tap");
    runInvSort();
  },
  ikeep(b, e, a, k) {
    const it = ui.idump.items[+b.dataset.i];
    it.keep = !it.keep;
    sfx("tap");
    render();
  },
  iclear(b, e, a, k) {
    ui.idump = {};
    clearIn("invText");
    render();
  },
  iadd(b, e, a, k) {
    const L = (ui.idump?.items || []).filter((x) => x.keep);
    S.inv = [...(S.inv || []), ...L.map(({ keep, ...x }) => ({ id: newId(), ...x, from: "sorted" }))];
    ui.idump = {};
    clearIn("invText");
    sfx("win");
    toast(`Added ${L.length} to what you have`);
    commit();
  },
  lt(b, e, a, k) {
    navPush();
    ui.lt = b.dataset.t;
    sfx("tap");
    render();
  },
  invadd(b, e, a, k) {
    S.inv = [...(S.inv || []), { id: newId(), name: b.dataset.n, cat: b.dataset.c || "other", from: "tap" }];
    sfx("ok");
    toast("Added to what we have");
    commit();
  },
  invnew(b, e, a, k) {
    const n = document.getElementById("invName").value.trim();
    if (!n) return;
    S.inv = [...(S.inv || []), { id: newId(), name: n, cat: document.getElementById("invCat").value }];
    sfx("ok");
    commit();
    clearIn("invName");
  },
  invsel(b, e, a, k) {
    ui.invSel = ui.invSel === b.dataset.i ? null : b.dataset.i;
    sfx("tap");
    render();
  },
  invdel(b, e, a, k) {
    S.inv = (S.inv || []).filter((i) => i.id !== b.dataset.i);
    sfx("flip");
    commit();
  },
});
