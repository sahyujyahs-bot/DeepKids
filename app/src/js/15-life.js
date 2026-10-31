/* Learning from life: classes, outings, cooking, gardening, something the child said. Each one is kept as a moment,
   linked to the topics it teaches (badminton: forces and materials; music: sound and patterns), counted as hours,
   built up into skills, offered to the queue, and shown in Progress and on the transcript. */
const LIFEK = {
  did: ["🧺", "Did"],
  said: ["💬", "Said or asked"],
  went: ["🚌", "Went somewhere"],
  class: ["🏸", "Class or practice"],
};
const SKILLCAT = {
  sport: "Sport",
  movement: "Movement",
  music: "Music",
  art: "Art and craft",
  language: "Language",
  mind: "Thinking games",
  life: "Life skills",
  other: "Other",
};
const lifeSt = () => (S.moments = S.moments || []);
// the child's interests ("dinosaurs", "stitching"): kept apart from the calendar, each linked to topics
const intSt = () => (S.interests = S.interests || []);
function addInterest(t) {
  t = t.trim();
  if (!t || intSt().some((x) => x.t.toLowerCase() === t.toLowerCase())) return;
  intSt().push({ id: Math.random().toString(36).slice(2, 9), t, date: today, links: lifeGuess(t).links, queued: [] });
}
const lifeBy = (id) => lifeSt().find((m) => m.id === id);
// the topics a moment can link to: every DeepKids science unit, and the maths, English, Hindi and social topic tags
// (app/content/life/tags.json), each of which stands for its chapters in every board
function lifePool() {
  return [
    ...Object.entries(DATA.units || {}).map(([id, x]) => ({ k: "unit|" + id, s: "sci", t: x.title })),
    ...(DATA.life?.tags || []).map((t) => ({ k: t.id, s: t.subj, t: t.name })),
  ];
}
// what a link points to: a unit, or a tag and the chapter that teaches it on the family's board, nearest the child's level
function lifeTarget(k) {
  const tag = (DATA.life?.tags || []).find((t) => t.id === k);
  if (!tag) return { u: unitBy(k), name: unitBy(k) && chT(unitBy(k)) };
  const lv = S.levels?.[tag.subj] || 3,
    u = tag.chapters
      .map(unitBy)
      .filter((x) => x && boardsOn().includes(x.board) && S.subjects.includes(x.subj))
      .sort((a, b) => Math.abs(a.level - lv) - Math.abs(b.level - lv))[0];
  return { u, tag, name: tag.name };
}
const lifeSubj = (k) => {
  const x = lifeTarget(k);
  return SUBJ[x.u?.subj || x.tag?.subj] || (x.tag?.subj === "social" ? "Social studies" : "");
};
// the library first (activities parents write about, each with its topics), then the parent's words against what
// each unit and tag is about
function lifeGuess(text) {
  const t = text.toLowerCase(),
    has = (w) => new RegExp("\\b" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b").test(t),
    A = (DATA.life?.acts || [])
      .map((a) => ({
        a,
        n:
          a.words.filter(has).length +
          (has(a.name.toLowerCase()) ? 2 : 0) +
          // a one- or two-word interest ("art", "space") also matches the activities named after it
          (t.split(/\s+/).length <= 2 && a.name.toLowerCase().split(/\W+/).includes(t.trim()) ? 1 : 0),
      }))
      .filter((x) => x.n)
      .sort((x, y) => y.n - x.n)
      .slice(0, 2)
      .map((x) => x.a),
    links = [];
  A.forEach((a) => a.links.forEach((l) => links.some((x) => x.k === l.k) || links.push({ k: l.k, why: l.why || "" })));
  const W = [...shelfWords(text)].filter((w) => !SHELF_SKIP.has(w));
  if (W.length && links.length < 3)
    lifePool()
      .map((p) => {
        const x = DATA.units?.[p.k.slice(5)],
          about = shelfWords(
            [p.t, x?.topic, x?.subtopic, x?.summary?.text, ...(x?.parts || []).map((q) => q[1])].join(" "),
          );
        return { k: p.k, n: W.filter((w) => about.has(w)).length };
      })
      .filter((p) => p.n && !links.some((l) => l.k === p.k))
      .sort((a, b) => b.n - a.n)
      .slice(0, 3 - links.length)
      .forEach((p) => links.push({ k: p.k, why: "" }));
  return {
    skill: A.find((a) => a.skill)?.skill || null,
    cat: A.find((a) => a.skillcat)?.skillcat || null,
    links: links.slice(0, 6),
    known: A.length > 0,
  };
}
// links from AI when it's on (it can see how badminton teaches geometry or music teaches fractions), otherwise the map
async function lifeLink(m) {
  const given = m.links || [],
    g = lifeGuess(m.title + " " + (m.text || ""));
  m.cat = m.cat || g.cat;
  if (m.kind === "class" || m.kind === "did") m.skill = m.skill || g.skill;
  m.links = g.links;
  // AI only for what the library doesn't know
  if (!g.known) await lifeAsk(m);
  // a link the caller already knew (a photo filed under a chapter) stays first
  m.links = [...given, ...m.links.filter((l) => !given.some((x) => x.k === l.k))].slice(0, 6);
}
async function lifeAsk(m) {
  if (!SAMPLE) return;
  const P = lifePool(),
    prompt = `A parent home-schooling a child aged ${S.age || "6 to 10"} in India told us about this:
Kind: ${LIFEK[m.kind][1]}. Title: ${m.title}. Details: ${m.text || "(none)"}. Time: ${m.mins || 0} minutes.
Think like a great teacher: which of the topics below does this really teach, or open a door to? Look past the obvious: badminton teaches forces, materials (the shuttle's feathers), angles and the body; music teaches sound, counting beats and history; cooking teaches measuring, heat, materials and where food comes from. Pick 2 to 6 topics, the strongest first, each with one plain sentence a parent can say to the child, linking what they did to the topic.
If this is a skill the child is building (a sport, instrument, art, dance, language, a game like chess, cooking), name the skill in one or two words ("Badminton", "Carnatic singing") and pick its kind: sport, movement, music, art, language, mind, life or other. Otherwise the skill is null.
Topics (key | subject | title):
${P.map((p) => `${p.k} | ${SUBJ[p.s] || p.s} | ${p.t}`).join("\n")}
Reply with only JSON: {"skill":null,"cat":null,"links":[{"k":"<key from the list>","why":"<one sentence>"}]}`;
  try {
    const r = await SAMPLE.json(prompt, { modelTier: "quick", cache: false }),
      keys = new Set(P.map((p) => p.k)),
      L = (r?.links || []).filter((l) => l && keys.has(l.k)).slice(0, 6);
    if (L.length) m.links = L.map((l) => ({ k: l.k, why: String(l.why || "").slice(0, 200) }));
    if (r?.skill && !m.skill) m.skill = String(r.skill).slice(0, 40);
    if (r?.cat && SKILLCAT[r.cat]) m.cat = r.cat;
  } catch (e) {}
}
// a class or practice builds a skill named after it; tuition in a school subject doesn't
const lifeSkillOf = (title) =>
  /tuition|coaching|homework|maths|math|science|english|hindi|school/i.test(title) ? null : title.trim().slice(0, 40);
// saves a moment and finds its topics; quiet (a class just marked done) skips showing them
async function lifeRecord(m, quiet) {
  m = { id: Math.random().toString(36).slice(2, 9), date: today, links: [], queued: [], ...m };
  if (m.kind === "class" && !m.skill) m.skill = lifeSkillOf(m.title);
  // checking in on the same class again replaces that day's moment
  S.moments = lifeSt().filter((x) => !(m.ev && x.ev === m.ev && x.date === m.date));
  S.moments.push(m);
  commit();
  // the topics replace the form or check-in that saved it, so Back returns to where the parent was
  if (!quiet && sheet.open) {
    ui.sheet = { mode: "moment", id: m.id, busy: true };
    renderSheet(true);
  } else if (!quiet) openSheet({ mode: "moment", id: m.id, busy: true });
  await lifeLink(m);
  if (ui.sheet?.id === m.id) ui.sheet.busy = false;
  commit();
  if (ui.sheet?.mode === "moment") renderSheet();
}
// every skill: its kind, sessions, hours and the dates it ran
function lifeSkills() {
  const K = {};
  lifeSt().forEach((m) => {
    if (!m.skill) return;
    const x = (K[m.skill.toLowerCase()] = K[m.skill.toLowerCase()] || {
      name: m.skill,
      cat: m.cat,
      n: 0,
      mins: 0,
      from: m.date,
      to: m.date,
    });
    x.n++;
    x.mins += +m.mins || 0;
    x.cat = x.cat || m.cat;
    if (m.date < x.from) x.from = m.date;
    if (m.date > x.to) x.to = m.date;
  });
  return Object.values(K).sort((a, b) => b.mins - a.mins);
}
function lifeLinkRow(m, l, i) {
  const x = lifeTarget(l.k);
  if (!x.name) return "";
  const q = m.queued.includes(l.k);
  return `<div class="lifelink"><div><b>${esc(x.name)}</b> <span class="xs muted">${esc(lifeSubj(l.k))}${x.tag && x.u ? " · " + esc(chT(x.u)) : ""}</span>${l.why ? `<p class="sm">${esc(l.why)}</p>` : ""}</div>${q ? `<span class="xs muted">In the queue</span>` : `<button class="link xs" data-act="lifex" data-id="${m.id}" data-i="${i}" aria-label="Remove ${esc(x.name)}">Remove</button>`}</div>`;
}
function momentView() {
  const m = lifeBy(ui.sheet.id);
  document.getElementById("sheetTitle").textContent = "What this taught";
  if (!m) return "";
  const sk = m.skill && lifeSkills().find((x) => x.name.toLowerCase() === m.skill.toLowerCase()),
    left = m.links.filter((l) => !m.queued.includes(l.k) && lifeTarget(l.k).u);
  return `<section class="sec"><span class="eyebrow">${LIFEK[m.kind][0]} ${esc(LIFEK[m.kind][1])} · ${esc(fmt(m.date))}${m.mins ? " · " + hmin(m.mins) : ""}</span><h2>${esc(m.title)}</h2>${m.text ? `<p class="sm">${esc(m.text)}</p>` : ""}
   ${sk ? `<p class="sm lifeskill">Counts towards <b>${esc(sk.name)}</b> · ${sk.n} session${sk.n === 1 ? "" : "s"}, ${hmin(sk.mins)} so far</p>` : ""}</section>
   <section class="sec"><h3>Topics it links to</h3>${ui.sheet.busy ? `<p class="sm muted">Finding the learning in this…</p>` : ""}${m.links.length ? `<div class="card lifelinks">${m.links.map((l, i) => lifeLinkRow(m, l, i)).join("")}</div>` : ui.sheet.busy ? "" : `<p class="sm muted">No topic found for this one. It still counts in hours${m.skill ? " and in the skill" : ""}.</p>`}
   ${left.length ? `<button class="btn" data-act="lifeq" data-id="${m.id}">Add ${left.length === 1 ? "this topic" : "these " + left.length + " topics"} to the queue</button><p class="xs muted">They go to the end of each subject's queue, so the next lessons build on what they did.</p>` : ""}</section>`;
}
function lifeAddView() {
  const F = (ui.lf = ui.lf || { kind: "did" });
  document.getElementById("sheetTitle").textContent = "Something they did";
  return `<section class="sec"><p class="sm muted">Anything counts: cooking with you, watering the plants, a class, a trip, a question they asked. DeepKids finds the learning in it and links it to topics.</p>
   <div class="row chips">${Object.entries(LIFEK)
     .map(
       ([k, [e, n]]) =>
         `<button class="chip" aria-pressed="${F.kind === k}" data-act="lifekind" data-k="${k}">${e} ${n}</button>`,
     )
     .join("")}</div>
   <div class="field"><label for="lfTitle">${F.kind === "said" ? "What did they say or ask?" : F.kind === "class" ? "Which class or practice?" : F.kind === "went" ? "Where did you go?" : "What did they do?"}</label><input class="inp" id="lfTitle" maxlength="80" value="${esc(F.title || "")}" placeholder="${{ did: "Made rotis with me", said: "Why does the moon follow our car?", went: "Visited the planetarium", class: "Badminton" }[F.kind]}"></div>
   <div class="field"><label for="lfText">Anything more? (optional)</label><textarea class="inp" id="lfText" rows="3" placeholder="What happened, what they noticed, what they asked">${esc(F.text || "")}</textarea></div>
   <div class="fgrid"><div class="field"><label for="lfDate">When</label><input class="inp" id="lfDate" type="date" max="${today}" value="${F.date || today}"></div><div class="field"><label for="lfMins">How long</label><select class="inp" id="lfMins">${[
     0, 15, 30, 45, 60, 90, 120, 180,
   ]
     .map(
       (x) =>
         `<option value="${x}" ${(F.mins ?? (F.kind === "said" ? 0 : 30)) === x ? "selected" : ""}>${x ? hmin(x) : "Not timed"}</option>`,
     )
     .join("")}</select></div></div>
   <button class="btn green" data-act="lifesave">Save and find the learning</button></section>`;
}
function lifeSave() {
  const v = (id) => (document.getElementById(id)?.value || "").trim(),
    title = v("lfTitle");
  if (!title) return toast("Write what happened first");
  const F = ui.lf || { kind: "did" };
  ui.lf = null;
  lifeRecord({ kind: F.kind, title, text: v("lfText"), date: v("lfDate") || today, mins: +v("lfMins") || 0 });
}
function lifeQueue(id) {
  const m = lifeBy(id);
  if (!m) return;
  const L = m.links.filter((l) => !m.queued.includes(l.k) && lifeTarget(l.k).u);
  L.forEach((l) => {
    const u = lifeTarget(l.k).u;
    qPut("les", u.subj, "les:" + u.k, "end");
  });
  m.queued = [...m.queued, ...L.map((l) => l.k)];
  sfx("ok");
  toast(L.length === 1 ? "Added to the queue" : `${L.length} topics added to the queue`);
  commit();
  renderSheet();
}
// Progress → Skills and life: each skill with its hours, and every moment, newest first
function lifeTab() {
  const I = intSt(),
    K = lifeSkills(),
    M = lifeSt()
      .slice()
      .sort((a, b) => (a.date < b.date ? 1 : -1)),
    mx = Math.max(1, ...K.map((x) => x.mins));
  return `<section class="sec"><button class="btn" data-act="lifeadd">＋ Something they did or said</button></section>
   <section class="sec"><div class="sech"><h3>Interests</h3><span class="xs muted">${I.length}</span></div>${
     I.length
       ? `<div class="card" style="gap:0">${I.map((x) => {
           const T = x.links.map((l) => lifeTarget(l.k)).filter((t) => t.name),
             left = x.links.filter((l) => !x.queued.includes(l.k) && lifeTarget(l.k).u);
           return `<div class="introw"><div><b>${esc(x.t)}</b>${T.length ? `<p class="xs muted">Topics: ${T.map((t) => esc(t.name)).join(" · ")}</p>` : `<p class="xs muted">No topic found yet. Research papers and projects on it are picked first.</p>`}</div><div class="row">${left.length ? `<button class="btn soft sm" data-act="intq" data-id="${x.id}">Add ${left.length === 1 ? "the topic" : left.length + " topics"} to the queue</button>` : x.queued.length ? `<span class="xs muted">✓ In the queue</span>` : ""}<button class="link xs" data-act="intx" data-id="${x.id}" aria-label="Remove ${esc(x.t)}">Remove</button></div></div>`;
         }).join("")}</div>`
       : `<p class="sm muted">Tell the Planner what your child loves (“She is interested in stitching and space”), and DeepKids links it to topics.</p>`
   }</section>
   <section class="sec"><div class="sech"><h3>Skills</h3><span class="xs muted">from classes and practice</span></div>${
     K.length
       ? `<div class="col" style="gap:10px">${K.map((x) => `<div class="hbar"><span class="sm"><b>${esc(x.name)}</b> · ${esc(SKILLCAT[x.cat] || "Skill")} · ${x.n} session${x.n === 1 ? "" : "s"}, ${hmin(x.mins)} since ${esc(fmt(x.from))}</span><div class="hb"><i style="width:${(x.mins / mx) * 100}%"></i></div></div>`).join("")}</div>`
       : `<p class="sm muted">Swimming, badminton, music, art, yoga: mark a class done on Today, or add one here, and its hours build up as a skill.</p>`
   }</section>
   <section class="sec"><div class="sech"><h3>Learning from life</h3><span class="xs muted">${M.length}</span></div>${
     M.length
       ? `<div class="card" style="gap:0">${M.map((m) => `<button class="menurow" data-act="lifeopen" data-id="${m.id}"><span style="font-size:22px">${LIFEK[m.kind][0]}</span><span><b>${esc(m.title)}</b><br><span class="xs muted">${esc(fmt(m.date))}${m.mins ? " · " + hmin(m.mins) : ""}${m.links.length ? ` · ${m.links.length} topic${m.links.length === 1 ? "" : "s"}` : ""}</span></span>${icon("next")}</button>`).join("")}</div>`
       : `<p class="sm muted">Nothing yet. Cooking, gardening, a trip, a big question: add it and see what it teaches.</p>`
   }</section>`;
}
// books, games and kits from the home shelf, ticked off next to the lesson they went with (07-day-plan)
function shelfUsed() {
  return Object.keys(S.tl || {})
    .map((k) => k.match(/^(\d{4}-\d\d-\d\d)\|shelf-([^-]+)-(.+)$/))
    .filter(Boolean)
    .map(([, date, id, uk]) => ({ date, it: (S.inv || []).find((i) => i.id === id), u: unitBy(uk) }))
    .filter((x) => x.it)
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}
// the transcript's sections: skills, learning outside lessons with the topics each one links to, and the home shelf
function lifeTranscript() {
  const I = intSt(),
    B = shelfUsed(),
    K = lifeSkills(),
    M = lifeSt()
      .slice()
      .sort((a, b) => (a.date < b.date ? -1 : 1));
  return (
    (I.length ? `<h2>Interests</h2><p>${I.map((x) => esc(x.t)).join(", ")}</p>` : "") +
    (K.length
      ? `<h2>Skills and activities</h2><table><tr><th>Skill</th><th>Kind</th><th>Sessions</th><th>Time</th><th>From</th><th>To</th></tr>${K.map((x) => `<tr><td>${esc(x.name)}</td><td>${esc(SKILLCAT[x.cat] || "")}</td><td>${x.n}</td><td>${hmin(x.mins)}</td><td>${esc(fmt(x.from))}</td><td>${esc(fmt(x.to))}</td></tr>`).join("")}</table>`
      : "") +
    (M.length
      ? `<h2>Learning outside lessons</h2><table><tr><th>Date</th><th>What</th><th>Time</th><th>Topics it links to</th></tr>${M.map(
          (m) =>
            `<tr><td>${esc(fmt(m.date))}</td><td>${esc(m.title)}</td><td>${m.mins ? hmin(m.mins) : ""}</td><td>${m.links
              .map((l) => lifeTarget(l.k).name)
              .filter(Boolean)
              .map(esc)
              .join("; ")}</td></tr>`,
        ).join("")}</table>`
      : "") +
    (B.length
      ? `<h2>Books, games and kits used</h2><table><tr><th>Date</th><th>What</th><th>With the lesson</th></tr>${B.map((x) => `<tr><td>${esc(fmt(x.date))}</td><td>${esc(x.it.name)}</td><td>${x.u ? esc(chT(x.u)) : ""}</td></tr>`).join("")}</table>`
      : "")
  );
}
