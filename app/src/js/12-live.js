/* Lessons written on request: when nothing in DeepKids matches a topic, Claude writes a short lesson (an introduction, key ideas,
   big think questions and things to try), checked against our rules before the family sees it. The family does it from the sheet,
   and at the end can ask DeepKids for the full lesson, which we write, review and send within a day. Kept in S.live. */
// words and habits that break our rules; the lesson is sent back to be rewritten once if any show up
const LIVE_BAN =
  /\b(units?|topics?|mankind|primitive|pests?|too advanced|when you are older|five senses|just a theory|simple organisms?|lower animals?)\b/i;
const LIVE_UNSAFE =
  /\b(knife|knives|blade|stove|flame|matches|lighter|candle|boiling|mains|socket|bleach|medicine|tablet|pills?)\b/i;
// "it" soon after a living being, a cell or a molecule that does life's work (a rough check, not a grammar parser)
const LIVE_IT =
  /\b(plants?|animals?|bacteri(?:a|um)|cells?|RNA|DNA|viruses|virus|fung(?:us|i)|trees?|birds?|seeds?|ribosomes?|people|person|child|children|women|woman|men|man)\b[^.?!]{0,45}\b(it|its|itself)\b/i;
const liveWords = (x) =>
  typeof x === "string"
    ? [x]
    : Array.isArray(x)
      ? x.flatMap(liveWords)
      : x && typeof x === "object"
        ? Object.values(x).flatMap(liveWords)
        : [];
// what is wrong with a lesson the model wrote, in plain sentences it can fix (empty when it is fine)
function liveCheck(l) {
  const bad = [],
    has = (x) => typeof x === "string" && x.trim().length > 2;
  if (!l || typeof l !== "object") return ["It was not the JSON asked for."];
  if (!has(l.title)) bad.push("A title is missing.");
  if (!Array.isArray(l.intro) || l.intro.filter(has).length < 2)
    bad.push("The introduction needs 2 or 3 short paragraphs.");
  if (!Array.isArray(l.ideas) || l.ideas.filter((x) => has(x?.idea) && has(x?.argued)).length < 2)
    bad.push("It needs 2 or 3 key ideas, each with what is still argued about or not yet known.");
  if (!Array.isArray(l.bigq) || l.bigq.filter(has).length !== 4) bad.push("It needs exactly 4 big think questions.");
  const T = Array.isArray(l.tryit) ? l.tryit : [];
  if (
    T.length < 1 ||
    T.length > 2 ||
    T.some((t) => !has(t?.name) || !(t?.materials || []).length || (t?.steps || []).length < 2 || !has(t?.expect))
  )
    bad.push("It needs 1 or 2 things to try, each with a name, materials, at least 2 steps and what they should see.");
  if (!has(l.indian?.who) || !has(l.indian?.what)) bad.push("It needs an Indian example with a name.");
  if (!has(l.underdog?.who) || !has(l.underdog?.what)) bad.push("It needs an overlooked scientist or thinker, named.");
  const text = liveWords(l);
  text.forEach((t) => {
    const b = t.match(LIVE_BAN);
    if (b) bad.push(`Never write "${b[0]}".`);
  });
  liveWords(l.tryit).forEach((t) => {
    const u = t.match(LIVE_UNSAFE);
    if (u) bad.push(`The activity uses "${u[0]}", which is not safe for a child at home.`);
  });
  text.forEach((t) =>
    t.split(/(?<=[.?!])\s+/).forEach((s) => {
      if (LIVE_IT.test(s))
        bad.push(`"${s.slice(0, 90)}" calls a living being, a cell or a molecule "it". Use she, he or they.`);
    }),
  );
  return [...new Set(bad)].slice(0, 8);
}
const livePrompt = (
  topic,
  fix = [],
) => `You write one short lesson for DeepKids, a homeschool app for Indian families with children aged 6–10. A parent searched for: "${topic.slice(0, 80)}". The child is about ${S.age || 8}.
${IAM_VOICE}
Write it at the right level (1 to 5 = Classes 1 to 5) and at full depth: short words, never fewer ideas, never talk down. About 60% of examples from South India, the rest from all of India. Name a real Indian example and a real overlooked scientist or thinker (a woman or an underdog where it fits), only people you are sure exist. Give what is still argued about or not yet known. Never write the words "unit" or "topic". Activities use only things in an ordinary city home, with no flame, stove, knife, mains electricity or medicine, and the result must really happen.
Reply with only JSON:
{"title":"","subj":"math|eng|hin|sci","level":1,"intro":["2-3 short paragraphs"],"ideas":[{"idea":"","argued":"what is still argued about or not yet known"}],"bigq":["exactly 4 questions with no single answer"],"tryit":[{"name":"","materials":[""],"steps":[""],"expect":"what they should see"}],"indian":{"who":"","what":""},"underdog":{"who":"","what":""}}
${fix.length ? `Your last try had these problems. Fix every one and keep the rest:\n- ${fix.join("\n- ")}` : ""}`;
const liveReviewPrompt = (l) =>
  `Check this children's lesson. List only real problems, each with the exact words: age-gating (too advanced, when you are older), a false simplification, one view given as the whole truth, human-centred wording, anything patriarchal, bias of caste, class, religion, language, city or skin colour, or "it" used for a living being, a cell, RNA, DNA or a virus. Reply with only JSON {"problems":[""]}, an empty list if there are none.\n${JSON.stringify(l)}`;
// writes the lesson: write, check, one rewrite if anything is wrong, one more look, and only then is it shown
async function liveGenerate(topic) {
  if (!SAMPLE || ui.live) return;
  ui.live = { q: topic };
  render();
  try {
    let l = await SAMPLE.json(livePrompt(topic), { modelTier: "default", cache: false }),
      bad = liveCheck(l);
    if (!bad.length)
      bad = (await SAMPLE.json(liveReviewPrompt(l), { modelTier: "quick", cache: false }))?.problems || [];
    if (bad.length) {
      l = await SAMPLE.json(livePrompt(topic, bad), { modelTier: "default", cache: false });
      bad = liveCheck(l);
    }
    if (bad.length) throw { code: "failed_check" };
    const id = slug(topic) + "-" + newId();
    S.live = {
      ...(S.live || {}),
      [id]: {
        id,
        q: topic,
        title: l.title,
        subj: SUBJ[l.subj] ? l.subj : "sci",
        level: Math.min(5, Math.max(1, +l.level || 1)),
        lesson: l,
        made: today,
      },
    };
    commit();
    window.claude
      ?.use?.("request")
      .then((R) => R?.mini({ topic, subj: S.live[id].subj, level: S.live[id].level, lesson: l }).catch(() => {}));
  } catch (e) {
    ui.live = {
      q: topic,
      err:
        e?.code === "failed_check"
          ? "I couldn't write one that meets our standards just now. Please try again in a moment."
          : aiError(e),
    };
    render();
    return;
  }
  ui.live = null;
  render();
}
// lessons already written on request that fit what was searched
function liveHits(q) {
  const w = q
    .toLowerCase()
    .split(/\s+/)
    .filter((x) => x.length > 2);
  return Object.values(S.live || {}).filter((L) => w.some((x) => (L.q + " " + L.title).toLowerCase().includes(x)));
}
function liveRow(L) {
  return `<div class="findrow"><div class="topic ${subjClass(L.subj)}"><div class="trow"><span class="no">✎</span><span style="min-width:0;flex:1;overflow-wrap:anywhere"><b>${esc(L.title)}</b><br><span class="xs muted">${SUBJ[L.subj]} · Class ${L.level} · written for you${L.done ? " · done" : ""}</span></span></div></div><div class="row"><button class="btn xs accent" data-act="flive" data-id="${esc(L.id)}">${L.done ? "Open again" : "Do it now"}</button></div></div>`;
}
// what the search shows when nothing in DeepKids matches: the offer, the writing animation, or what went wrong
function liveCard(q) {
  if (ui.live?.q === q && !ui.live.err)
    return `<section class="card livewait">${iamFace("mini")}<div><b class="h5">Writing a lesson on “${esc(q)}”…</b><p class="xs muted">It is checked against our rules before you see it.</p><div class="lwlines"><i></i><i></i><i></i></div></div></section>`;
  const asked = (S.askedLesson || {})[q.toLowerCase()];
  return `<p class="sm">Nothing on “${esc(q)}” yet.</p>${ui.live?.err ? `<p class="sm err">${esc(ui.live.err)}</p>` : ""}<div class="row">${
    SAMPLE
      ? `<button class="btn sm accent" data-act="fgen" data-q="${esc(q)}">Write this lesson for me</button>`
      : lockBtn("topic", "btn sm accent", "Write this lesson for me")
  }${
    asked
      ? ""
      : `<button class="btn sm line" data-act="freq" data-q="${esc(q)}">Ask DeepKids to write it · free, in 24 hours</button>`
  }</div>${asked ? `<p class="sm">You asked DeepKids to write this. The full lesson will come here within 24 hours.</p>` : ""}`;
}
function liveView() {
  const L = (S.live || {})[ui.sheet.id];
  if (!L) return "";
  const l = L.lesson;
  setSheetTitle(L.title);
  return `<section class="card"><span class="eyebrow">Written for you · ${SUBJ[L.subj]} · Class ${L.level}</span><h2 class="fs6">${esc(L.title)}</h2>${l.intro.map((p) => `<p>${esc(p)}</p>`).join("")}<p class="xs muted">Written for you in minutes and not yet reviewed by DeepKids. The full lesson is better: ask for it at the end.</p></section>
   <section class="sec"><div class="sech"><h3>Key ideas</h3></div><div class="col">${l.ideas.map((x) => `<section class="card"><b>${esc(x.idea)}</b><p class="sm muted">Still argued or not yet known: ${esc(x.argued)}</p></section>`).join("")}</div></section>
   <section class="sec"><div class="sech"><h3>Big think</h3><span class="xs muted">No single answer</span></div><section class="card"><ol class="sm">${l.bigq.map((q) => `<li>${esc(q)}</li>`).join("")}</ol></section></section>
   <section class="sec"><div class="sech"><h3>Try it now</h3></div>${l.tryit.map((t) => `<section class="card"><b>${esc(t.name)}</b><p class="xs muted">You need: ${t.materials.map(esc).join(", ")}</p><ol class="sm">${t.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol><p class="sm"><b>You should see:</b> ${esc(t.expect)}</p></section>`).join("")}</section>
   <section class="sec"><section class="card"><b>${esc(l.indian.who)}</b><p class="sm">${esc(l.indian.what)}</p></section><section class="card"><b>${esc(l.underdog.who)}</b><p class="sm">${esc(l.underdog.what)}</p></section></section>
   <section class="card r-you tint">${
     L.requested
       ? `<b class="h5">Thank you</b><p class="sm">DeepKids will write the full lesson, review it and send it to you here within 24 hours.</p>`
       : `<b class="h5">Want the full lesson?</b><p class="sm">DeepKids writes it in full depth, reviews it, and sends it to you within 24 hours.</p><button class="btn accent" data-act="freqfull" data-id="${esc(L.id)}">Request the full lesson</button>`
   }${L.done ? "" : `<button class="btn sm soft" data-act="flivedone" data-id="${esc(L.id)}">I did it</button>`}</section>`;
}
Object.assign(ACT, {
  async freq(b) {
    if (await requestLesson(b.dataset.q)) render();
  },
  fgen(b) {
    liveGenerate(b.dataset.q);
  },
  flive(b) {
    sfx("flip");
    openSheet({ mode: "live", id: b.dataset.id });
  },
  flivedone(b) {
    S.live[b.dataset.id].done = today;
    sfx("ok");
    celebrate();
    commit();
    renderSheet();
  },
  async freqfull(b) {
    const L = S.live[b.dataset.id];
    if (await requestLesson(L.q, L.lesson, L.subj, L.level)) {
      L.requested = today;
      commit();
      renderSheet();
    }
  },
});
