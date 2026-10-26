/* ---------- topics: search, Claude-written topics saved for everyone ---------- */
function topicHits(q) {
  q = q.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/).filter((w) => w.length > 2);
  return allUnits()
    .map((u) => {
      const hay = (
        u.title +
        " " +
        (u.c?.covers || "") +
        " " +
        (u.topic?.summary || "") +
        " " +
        (u.gen?.summary || "")
      ).toLowerCase();
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
function topicRowV0(u) {
  const T = tagsOf(u)[0];
  return `<div class="topic ${SC(u.subj)}"><button class="plain trow" data-act="chapter" data-k="${u.k}"><span class="no">${/^\d+$/.test(u.n) ? u.n : esc(u.n)}</span><span style="min-width:0"><b>${esc(u.title)}</b><br><span class="xs muted">${SUBJ[u.subj]} · ${u.board === "gen" ? "DeepKids topic" + (u.gen.reviewed ? "" : " · not yet reviewed") : u.board === "dk" ? "DeepKids Plus" : esc(T?.txt || u.book)}</span></span>${pillS(coverage(u))}</button></div>`;
}
function topicRow(u) {
  if (u.board !== "combined") return topicRowV0(u);
  const B = (u.c?.boards || []).map((x) => `${BNAME[x.b] || x.b} ${x.ref}`).join(", ");
  return `<div class="topic ${SC(u.subj)}"><button class="plain trow" data-act="chapter" data-k="${u.k}"><span class="no">✦</span><span style="min-width:0;flex:1;overflow-wrap:anywhere"><b>${esc(u.title)}</b><br><span class="xs muted">${SUBJ[u.subj]} · Class ${u.level} · Covers ${esc(B || u.c?.topic || "")}</span></span>${pillS(coverage(u))}</button></div>`;
}
function topicsTab() {
  const q = ui.tq || "",
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
      `<section class="card r-out tint"><b style="font:600 17px var(--display)">Explore “${esc(q)}” as a new topic</b><p class="sm">Claude writes a summary, big ideas, lesson plans, related topics and books, and tags it to any syllabus it belongs to. It's saved to DeepKids so other families find it too.</p>${SAMPLE ? `<button class="btn sm" data-act="tgen" style="justify-self:start" ${ui.tgen ? "disabled" : ""}>${ui.tgen ? "Writing the topic…" : "Create this topic"}</button>` : `<p class="xs muted">Creating topics needs Claude, which isn't available in this view.</p>`}${ui.terr ? `<p class="sm" style="color:var(--bad)">${esc(ui.terr)}</p>` : ""}</section></section>`;
    return h;
  }
  const B = ui.bb || boardsOn()[0] || "ncert",
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
  h += `<div class="sech"><h3 style="font-size:18px">Browse the syllabus</h3></div>
   <div class="row chips">${["combined", "ncert", "cambridge", "nios", "waldorf", "dk"].map((b) => `<button class="chip" aria-pressed="${B === b}" data-act="bb" data-b="${b}">${b === "combined" ? "DeepKids track" : BNAME[b]}</button>`).join("")}</div>${
     B === "combined"
       ? combinedBrowse()
       : `
   ${subjs.length > 1 ? `<div class="row chips">${subjs.map((s) => `<button class="chip" aria-pressed="${sj === s}" data-act="bs" data-s="${s}">${SUBJ[s]}</button>`).join("")}</div>` : ""}
   ${levels.length > 1 ? `<div class="row chips">${levels.map((l) => `<button class="chip" aria-pressed="${lv === l}" data-act="bl" data-l="${l}">${lvName(l)}</button>`).join("")}</div>` : ""}
   <p class="xs muted">${units.length} ${B === "cambridge" ? "units" : B === "nios" ? "lessons" : B === "dk" ? "topics" : B === "waldorf" ? "blocks" : "chapters"}${units.filter((u) => u.c?.p).length ? ` · ${units.filter((u) => u.c?.p).length} with full day plans` : ""}${units[0] ? " · " + esc(units[0].book) : ""}</p>
   ${units.map((u) => topicRow(u).replace("</b><br>", `</b>${u.c?.p ? ` <span class="pill completed" style="font-size:11px">${u.c.p.days.length} parts</span>` : ""}<br>`)).join("") || `<p class="note">${(DATA.notes[B] || {})[sj + "|" + lv] || (B === "ncert" ? DATA.notes.ncert[sj + "|" + lv] : "") || "Nothing here yet."}</p>`}`
   }`;
  if (gen.length)
    h += `<div class="sech"><h3 style="font-size:18px">Explored by families</h3></div>${gen.map((g) => topicRow(genUnit(g))).join("")}`;
  return h + `</section>`;
}
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "topic";
async function genTopic() {
  const q = (ui.tq || "").trim();
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
Give exactly 3 full-day plans (about 60–90 minutes each) and 3 busy-day plans (about 30 minutes each). Only list books you are sure exist. No URLs.`;
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

/* ---------- Up next: the topic queue ---------- */
const qPos = (u) =>
  plannedUnits(u.subj)
    .filter((z) => rank[coverage(z)] < 2 || z.k === u.k)
    .findIndex((z) => z.k === u.k) + 1;
function queueCard() {
  const s = S.subjects.includes(ui.qs) ? ui.qs : S.subjects[0];
  if (!s) return "";
  const extra = (S.extra || {})[s] || [],
    L0 = plannedUnits(s).filter((u) => rank[coverage(u)] < 2),
    L = L0.filter((u, i) => i < 8 || extra.includes(u.k)),
    sh = !!(S.shuffle || {})[s];
  const radio = allUnits()
    .filter(
      (u) =>
        u.subj === s &&
        (u.board === "gen" || (u.board === "dk" && plusOn())) &&
        !plannedUnits(s).some((z) => z.k === u.k),
    )
    .slice(0, 4);
  return `<section class="sec"><div class="sech"><h3>Up next</h3><span class="xs muted">${modeOf() === "books" ? "Syllabus books" : MODES[modeOf()][0]}</span></div>
   <div class="seg">${S.subjects.map((x) => `<button aria-pressed="${x === s}" data-act="qsub" data-s="${x}">${SUBJ[x]}</button>`).join("")}</div>
   <div class="row"><button class="btn ${sh ? "" : "soft"} sm" data-act="shuffle" data-s="${s}">${icon("spark")}Smart shuffle ${sh ? "on" : "off"}</button>${sh ? `<button class="btn soft sm" data-act="reshuffle" data-s="${s}">Shuffle again</button>` : ""}<button class="btn ${S.exam ? "" : "soft"} sm" data-act="exam">${S.exam ? "Exam track on" : "Exam track off"}</button></div>
   <p class="xs muted">${sh ? "Shuffle respects what each topic needs first, and never drops a syllabus chapter." : "Book order."} ${S.exam ? "Exam track keeps every syllabus chapter first; extra topics come after." : "Extra topics are mixed in between syllabus chapters."}</p>
   <div class="col" style="gap:8px">${L.map((u, i) => {
     const T = tagsOf(u)[0];
     return `<div class="qrow ${SC(u.subj)}${u.k === ui.flash ? " flash" : ""}"><span class="qn">${L0.indexOf(u) + 1}</span><button class="plain" data-act="chapter" data-k="${u.k}" style="min-width:0"><b style="font:600 15.5px var(--display)">${esc(u.title)}</b><br><span class="xs muted">${u.board === "gen" ? "DeepKids topic" : u.board === "dk" ? "DeepKids Plus" : esc(T?.txt || u.book)} · ${sessionsFor(u)} days</span></button><span class="row" style="gap:4px;flex-wrap:nowrap">${i ? `<button class="iconbtn" style="width:36px;height:36px" data-act="qnext" data-s="${s}" data-k="${u.k}" aria-label="Do ${esc(u.title)} next">${icon("play")}</button>` : `<span class="pill learning">Next</span>`}<button class="iconbtn" style="width:36px;height:36px" data-act="qlater" data-s="${s}" data-k="${u.k}" aria-label="Move ${esc(u.title)} to later">${icon("next")}</button>${extra.includes(u.k) ? `<button class="iconbtn" style="width:36px;height:36px" data-act="qrem" data-s="${s}" data-k="${u.k}" aria-label="Remove ${esc(u.title)}">${icon("close")}</button>` : ""}</span></div>`;
   }).join("")}</div>
   ${radio.length ? `<div class="sech"><h3 style="font-size:17px">More like this</h3><button class="link" data-act="lt2">Find topics</button></div><div class="row">${radio.map((u) => `<button class="chip ${SC(u.subj)}" data-act="qadd" data-s="${s}" data-k="${u.k}">${icon("plus")}${esc(u.title)}</button>`).join("")}</div>` : `<button class="link" data-act="lt2" style="justify-self:start">Find more topics →</button>`}</section>`;
}
