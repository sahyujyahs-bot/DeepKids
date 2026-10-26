/* Notes and study material: a family's own notes (a PDF or photos of pages) become lessons, each put with the matching
   lesson of the plan (c.with), in the same lesson-pack
   format as the board chapters, so the chapter page, day steps, worksheets, quick quiz, refresher, progress
   and the plan all work for them. Reading the book uses AI (DeepKids Plus). Kept in S.mine. */
const MB_MAX_PDF = 10 * 1024 * 1024,
  MB_MAX_LESSONS = 6;
// every lesson made from the family's books, as items like DATA.items (board "mine")
function myBookItems() {
  return (S.mine?.books || []).flatMap((b) => b.lessons || []);
}
// parts of the family's notes that go with a lesson of the plan
const myNotesFor = (u) => myBookItems().filter((l) => (l.c.with || []).includes(u.k));
function mbBook(id) {
  return (S.mine?.books || []).find((b) => b.id === id);
}
function mbSaved() {
  _all = null;
  _ubk = null;
  commit();
}
function myBooksTab() {
  const B = S.mine?.books || [],
    f = ui.mbFiles || [],
    subj = ui.mbSubj || S.subjects[0] || "sci";
  const form = `<section class="card r-you tint"><span class="eyebrow">Add your notes or study material</span>
    <p class="sm">Your own notes, a study guide, a workbook chapter: a PDF (up to 10 MB) or photos of the pages. DeepKids reads it, puts each part with the matching lesson in your plan, and makes steps, words to know, a worksheet and questions from it. The questions join Quick quiz and the refresher. Books and games you own go on the Home shelf.</p>
    <label class="btn soft sm" style="cursor:pointer;justify-self:start">${icon("plus")}Choose a PDF or photos<input type="file" id="mbFile" accept="application/pdf,image/*" multiple hidden></label>
    ${
      f.length
        ? `<p class="xs">${f.map((x) => esc(x.name)).join(", ")}</p>
    <div class="field"><label for="mbTitle">What is it called?</label><input class="inp" id="mbTitle" maxlength="80" value="${esc(ui.mbTitle || f[0].name.replace(/\.[a-z]+$/i, ""))}"></div>
    <div class="fgrid"><div class="field"><label for="mbSubj">Subject</label><select class="inp" id="mbSubj">${S.subjects
      .map((s) => `<option value="${s}" ${s === subj ? "selected" : ""}>${SUBJ[s]}</option>`)
      .join("")}</select></div>
    <div class="field"><label for="mbLevel">Class</label><select class="inp" id="mbLevel">${[1, 2, 3, 4, 5]
      .map((l) => `<option value="${l}" ${l === (S.levels?.[subj] || 3) ? "selected" : ""}>Class ${l}</option>`)
      .join("")}</select></div></div>
    <button class="btn" data-act="mbmake" ${ui.mbBusy ? "disabled" : ""}>${ui.mbBusy ? esc(ui.mbBusy) : "Read it and match it to lessons"}</button>`
        : ""
    }</section>`;
  const list = B.length
    ? B.map(
        (
          b,
        ) => `<section class="card ${SC(b.subj)}"><div class="sech"><h3 style="font-size:19px">${esc(b.title)}</h3><span class="pill">${SUBJ[b.subj]} · Class ${b.level}</span></div>
      ${b.err ? `<p class="sm note">${esc(b.err)}</p>` : ""}
      ${(b.lessons || [])
        .map(
          (u) =>
            `<div class="row" style="justify-content:space-between;flex-wrap:nowrap;gap:8px"><button class="plain" data-act="chapter" data-k="${esc(u.k)}" style="text-align:left;min-width:0"><b>${esc(u.title)}</b><br>${(u.c.with || []).length ? `<span class="xs">Goes with: ${u.c.with.map((k) => esc(chT(unitByK(k)) || k)).join(", ")}</span><br>` : ""}<span class="xs muted">${u.c.p.days.length} day${u.c.p.days.length === 1 ? "" : "s"} · ${u.c.p.check.length} questions</span></button>${
              (S.extra?.[u.subj] || []).includes(u.k)
                ? `<span class="xs">✓ In the plan</span>`
                : `<button class="btn soft sm" data-act="mbplan" data-k="${esc(u.k)}">＋ Plan</button>`
            }</div>`,
        )
        .join("")}
      <button class="link xs" data-act="mbdel" data-id="${esc(b.id)}" style="justify-self:start">Remove this</button></section>`,
      ).join("")
    : `<p class="sm muted">Nothing here yet. Add notes you've written, a study guide or a workbook chapter.</p>`;
  return `<section class="sec">${form}${list}</section>`;
}
function onMyBookFiles(files) {
  ui.mbFiles = [...files].filter((f) => f.type === "application/pdf" || f.type.startsWith("image/"));
  const big = ui.mbFiles.find((f) => f.type === "application/pdf" && f.size > MB_MAX_PDF);
  if (big) {
    ui.mbFiles = ui.mbFiles.filter((f) => f !== big);
    toast(`${big.name} is over 10 MB. Add one chapter at a time, or compress it first.`, 6000);
  }
  ui.mbTitle = "";
  render();
}
// the AI writes the lesson list first, then each lesson in the lesson-pack format
async function myBooksMake() {
  const f = ui.mbFiles || [];
  if (!f.length) return;
  if (!SAMPLE) return toast("🔒 Reading books uses AI, which is part of DeepKids Plus.", 6000);
  const pdfs = f.filter((x) => x.type === "application/pdf"),
    images = f.filter((x) => x.type.startsWith("image/")).slice(0, 8);
  if (pdfs.length && !(await SAMPLE.limits().catch(() => ({})))?.docs)
    return toast("Reading PDFs works on the DeepKids website. Here, add photos of the pages instead.", 6000);
  const subj = document.getElementById("mbSubj")?.value || S.subjects[0],
    level = +(document.getElementById("mbLevel")?.value || S.levels?.[subj] || 3),
    title = (document.getElementById("mbTitle")?.value || "").trim() || f[0].name,
    book = { id: "b" + Date.now().toString(36), title, subj, level, added: today, lessons: [] },
    opts = {
      modelTier: "default",
      cache: false,
      images,
      docs: pdfs.slice(0, 2),
      purpose: "DeepKids AI reads your book and writes lessons from it.",
    },
    who = `a home-schooled child in India, ${S.age || 8} years old, Class ${level}, subject ${SUBJ[subj]}`;
  S.mine = { books: [...(S.mine?.books || []), book] };
  ui.mbBusy = "Reading the book…";
  render();
  try {
    const out = await SAMPLE.json(
      `The attached file is a family's own notes or study material for ${who}. List the lessons it holds: one per subtopic, at most ${MB_MAX_LESSONS}, in its order. Only use what it teaches.
For each, "with" lists the keys of the lessons below that it belongs with (the same topic), or [] if none fit. Only tag ones that truly fit.
Lessons planned for this child (key = label):
${invContext()}
Return JSON only: {"lessons":[{"title":"short, plain","pages":"which pages or part","summary":"2 sentences: what the child learns","with":["key"]}]}`,
      opts,
    );
    const L = (out?.lessons || []).slice(0, MB_MAX_LESSONS).filter((x) => x?.title),
      valid = new Set([...allUnits(), ...everyUnit()].map((u) => u.k));
    if (!L.length) throw new Error("no lessons");
    for (let i = 0; i < L.length; i++) {
      ui.mbBusy = `Writing lesson ${i + 1} of ${L.length}…`;
      render();
      const p = await SAMPLE.json(mbPackPrompt(L[i], who, title), opts);
      const pack = mbPack(p, L[i]);
      if (!pack) continue;
      book.lessons.push({
        k: `mine|${book.id}|${i + 1}`,
        board: "mine",
        subj,
        level,
        book: title,
        n: String(i + 1),
        title: pack.title,
        dk: [],
        c: {
          covers: pack.summary,
          game: [],
          exp: [],
          act: [],
          proj: [],
          read: [],
          links: [],
          unit: title,
          p: pack,
          with: (Array.isArray(L[i].with) ? L[i].with : []).filter((k) => valid.has(k)).slice(0, 3),
        },
      });
      mbSaved();
    }
    if (!book.lessons.length) throw new Error("no lessons");
    toast(`${book.lessons.length} lessons made from ${title}. Add them to the plan, or open one to start.`, 6000);
    ui.mbFiles = [];
  } catch (e) {
    book.err =
      e?.code === "needs_plan" || e?.code === "not_granted"
        ? "Reading books uses AI, which is part of DeepKids Plus."
        : e?.code === "cancelled"
          ? "You chose not to use AI this time."
          : "DeepKids couldn't read this one. Try a clearer PDF, or fewer pages at a time.";
  }
  ui.mbBusy = "";
  mbSaved();
  render();
}
function mbPackPrompt(l, who, title) {
  return `From the attached book "${title}", write one lesson for ${who}, on this part only: "${l.title}" (${l.pages || ""}). Use what the book says; explain it plainly for the parent and the child; no poetry.
Return JSON only, in this shape:
{"title":"${l.title}","summary":"2-3 sentences","goals":["By the end your child can …" (2 to 4)],
"words":[["word","plain meaning"]] (5 to 10),
"days":[{"n":1,"title":"…","goal":"…","steps":[{"kind":"warmup|read|talk|do|act|think|check|review","title":"…","mins":5,"do":"what the parent does and says, with the pages to read"}]}] (2 to 4 days, about 30 minutes each),
"worksheets":[{"id":"ws1","tier":"core","title":"…","day":2,"sections":[["A. …",[{"t":"mcq","p":"question","opts":["…","…","…"],"a":0},{"t":"fill","p":"sentence with ____","a":["answer"]}]]]}] (one worksheet, 6 to 10 questions),
"activities":[{"id":"a1","title":"…","day":1,"mins":15,"need":["…"],"steps":["…"]}] (0 to 2, using things at home),
"check":[{"q":"question","a":"answer"}] (6 to 10 questions covering the whole lesson)}`;
}
// keep only well-formed parts of the AI's lesson, so every screen can rely on them
function mbPack(p, l) {
  if (!p || typeof p !== "object") return null;
  const str = (x) => (typeof x === "string" ? x.trim() : ""),
    arr = (x) => (Array.isArray(x) ? x : []);
  const days = arr(p.days)
    .map((d, i) => ({
      n: i + 1,
      title: str(d?.title) || `Day ${i + 1}`,
      goal: str(d?.goal),
      steps: arr(d?.steps)
        .filter((s) => str(s?.do))
        .map((s) => ({
          kind: str(s.kind) || "do",
          title: str(s.title) || "Step",
          mins: Math.max(1, Math.min(60, +s.mins || 5)),
          do: str(s.do),
        })),
    }))
    .filter((d) => d.steps.length);
  const items = (L) =>
    arr(L).filter(
      (it) =>
        str(it?.p) &&
        ((it.t === "mcq" && arr(it.opts).length >= 2 && Number.isInteger(it.a) && it.opts[it.a] != null) ||
          (it.t === "fill" && arr(it.a).length)),
    );
  const worksheets = arr(p.worksheets)
    .slice(0, 1)
    .map((w) => ({
      id: "ws1",
      tier: "core",
      title: str(w?.title) || "Worksheet",
      day: Math.min(days.length, Math.max(1, +w?.day || days.length)),
      sections: arr(w?.sections)
        .map((s) => [str(s?.[0]) || "Questions", items(s?.[1])])
        .filter((s) => s[1].length),
    }))
    .filter((w) => w.sections.length);
  const check = arr(p.check)
    .filter((c) => str(c?.q) && str(c?.a))
    .map((c) => ({ q: str(c.q), a: str(c.a) }));
  if (!days.length || !check.length) return null;
  return {
    title: str(p.title) || l.title,
    source: str(l.pages),
    summary: str(p.summary) || str(l.summary),
    goals: arr(p.goals).map(str).filter(Boolean),
    words: arr(p.words)
      .filter((w) => str(w?.[0]) && str(w?.[1]))
      .map((w) => [str(w[0]), str(w[1])]),
    day_mins: Math.round(days.reduce((a, d) => a + d.steps.reduce((b, s) => b + s.mins, 0), 0) / days.length),
    days,
    worksheets,
    experiments: [],
    activities: arr(p.activities)
      .filter((a) => str(a?.title))
      .slice(0, 2)
      .map((a, i) => ({
        id: "a" + (i + 1),
        title: str(a.title),
        day: Math.min(days.length, Math.max(1, +a.day || 1)),
        mins: Math.max(5, Math.min(60, +a.mins || 15)),
        need: arr(a.need).map(str).filter(Boolean),
        steps: arr(a.steps).map(str).filter(Boolean),
      })),
    voices: [],
    check,
  };
}
function myBookPlan(k) {
  const u = myBookItems().find((x) => x.k === k);
  if (!u) return;
  if (!S.subjects.includes(u.subj)) S.subjects = [...S.subjects, u.subj];
  S.extra = { ...(S.extra || {}), [u.subj]: [...new Set([...((S.extra || {})[u.subj] || []), k])] };
  sfx("ok");
  toast(`Added to the plan: ${u.title}`);
  mbSaved();
}
function myBookRemove(id) {
  const b = mbBook(id);
  if (!b || !confirm(`Remove ${b.title} and its lessons?`)) return;
  const ks = new Set((b.lessons || []).map((u) => u.k));
  S.mine = { books: S.mine.books.filter((x) => x.id !== id) };
  Object.keys(S.extra || {}).forEach((s) => (S.extra[s] = S.extra[s].filter((k) => !ks.has(k))));
  mbSaved();
}
