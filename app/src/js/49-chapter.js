/* ---------- chapter ---------- */
function chapterViewV0() {
  const u = unitBy(ui.sheet.k);
  if (!u) return "";
  const c = u.c,
    x = c?.x,
    cs = coverage(u),
    m = modeOf();
  document.getElementById("sheetTitle").textContent = u.title;
  const tabs = c?.p
    ? {
        overview: "Overview",
        days: "Parts",
        ws: "Worksheets",
        lab: "Experiments",
        voices: "Other voices",
        ...(c.p.big
          ? { ...(c.p.story ? { story: "Story" } : {}), think: "Think deeper", game: "Game & project", books: "Books" }
          : {}),
        ...(resourcesFor(u).length ? { res: "Resources" } : {}),
        ...(x ? { questions: "Big questions", play: "Play" } : {}),
        ...(c.read ? { read: "Read more" } : {}),
      }
    : m === "books"
      ? {
          overview: "Overview",
          ...(c ? { read: "Read more" } : {}),
          ...(resourcesFor(u).length ? { res: "Free resources" } : {}),
        }
      : x
        ? {
            overview: "Overview",
            plans: "Lesson plans",
            questions: "Big questions",
            tasks: "Tasks",
            worksheet: "Worksheet",
            play: "Play",
            read: "Read more",
          }
        : c
          ? {
              overview: "Overview",
              plans: "Lesson plans",
              tasks: "Tasks",
              read: "Read more",
              ...(resourcesFor(u).length ? { res: "Free resources" } : {}),
            }
          : {
              overview: "Overview",
              plans: "Lesson plans",
              ...(resourcesFor(u).length ? { res: "Free resources" } : {}),
            };
  const t = tabs[ui.ctab[u.k]] ? ui.ctab[u.k] : "overview",
    inPlan = everyUnit().some((z) => z.k === u.k) && plannedUnits(u.subj).some((z) => z.k === u.k);
  let h = `<section class="chero ${SC(u.subj)}"><span class="n">${u.board === "combined" ? "" : /^\d+$/.test(u.n) ? u.n : esc(u.n)}</span><span class="eyebrow" style="color:#2B2340;opacity:.7">${u.board === "gen" ? "DeepKids topic · Level " + u.level : esc(u.book)}</span><h1>${esc(u.title)}</h1><span class="sticker ${cs}" style="justify-self:start">${STATUS[cs]}${cs === "learning" && done(u.k) ? ` · Part ${done(u.k)} of ${sessionsFor(u)}` : ""}</span><p>${c?.p ? `${c.p.days.length} parts · about ${c.p.day_mins} minutes each` : `${fh(hoursFor(u))} hours in all · ${sessionsFor(u)} lesson days at ${fh(hpdOf(u.subj))} h a day`}</p>${sblob(u.subj, "happy", "mascot sway")}</section>
   ${u.board === "gen" && !u.gen.reviewed ? `<p class="note">Written by Claude when a parent searched for it. Not yet reviewed by DeepKids.</p>` : ""}
   <div class="row">${inPlan ? `<span class="pill completed" style="align-self:center">✓ ${isNextUp(u) ? "Next up" : "In the plan · no. " + qPos(u)} in ${SUBJ[u.subj]}</span>${isNextUp(u) ? "" : `<button class="btn sm" data-act="qnext" data-s="${u.subj}" data-k="${u.k}">Do this next</button>`}<button class="btn line sm" data-act="gotab" data-tab="week" data-seg="queue" data-qs="${u.subj}">See the queue</button>` : u.board !== "dk" || plusOn() ? qPick("les", u.subj, "les:" + u.k, icon("plus") + "Add to the plan") : ""}</div>
   
   ${
     Object.keys(tabs).length > 1
       ? `<div class="seg" role="tablist">${Object.entries(tabs)
           .map(
             ([k, v]) =>
               `<button aria-pressed="${t === k}" data-act="ctab" data-k="${u.k}" data-t="${k}">${v}</button>`,
           )
           .join("")}</div>`
       : ""
   }`;
  if (t === "overview") {
    if (c?.p) h += packOverview(u);
    {
      const sh = shelfFor(u);
      if (sh.length)
        h += `<section class="card"><span class="eyebrow">From your shelf</span>${sh.map((i) => `<div class="sm"><b>${esc(i.name)}</b>${i.note ? ` · <span class="muted">${esc(i.note)}</span>` : ""}</div>`).join("")}</section>`;
    }
    h += topicOverview(u);
    if (x && m !== "books")
      h += `<section class="card ${SC(u.subj)}"><span class="eyebrow">What to learn</span>${x.learn.map((l, i) => `<div class="idea"><span class="k">${i + 1}</span><p>${esc(l)}</p></div>`).join("")}</section>`;
    if (m === "books" && c?.x?.cur)
      h += `<section class="card" style="gap:0"><span class="eyebrow" style="margin-bottom:6px">Curated resources</span>${c.x.cur.map(([w, src, url, how]) => `<a class="res" href="${esc(url)}" target="_blank" rel="noopener"><span class="xs muted">${esc(src)} ↗</span><b>${esc(w)}</b></a>`).join("")}</section>`;
    if (u.board === "dk" && u.topic.res.length)
      h += `<section class="card"><span class="eyebrow">Resources</span>${u.topic.res.map((r) => (r.url ? `<a class="res" href="${esc(r.url)}" target="_blank" rel="noopener"><b>${esc(r.title)} ↗</b></a>` : `<div class="res"><b>${esc(r.title)}</b></div>`)).join("")}</section>`;
    h += `<button class="btn line sm" data-act="logk" data-k="${u.k}" style="justify-self:start">Log a session today</button>${rank[cs] < 2 ? `<button class="link xs" data-act="status" data-k="${u.k}" data-s="completed" style="justify-self:start">Already knows this? Mark it done</button>` : ""}`;
  }
  if (t === "plans") h += plansTab(u);
  if (c?.p) h += packTab(u, t) + combTab(u, t);
  if (t === "res") h += resTab(u);
  if (t === "questions") {
    const qi = Math.min(ui.qi[u.k] || 0, x.deep.length - 1),
      d = x.deep[qi],
      key = "think" + qi;
    h += `<section class="qcard"><span class="eyebrow">Big question ${qi + 1} of ${x.deep.length}</span><h2>${esc(d.q)}</h2><p>${esc(d.why)}</p></section>
     <p class="sm muted">Ask your child first and really listen. Then read the voices together. Which is strongest? Which would you argue against?</p>
     <div class="col">${d.views.map(([w, v], j) => `<div class="voice" style="--c:${PAL[(j * 2 + 1) % PAL.length]}">${blob(PAL[(j * 2 + 1) % PAL.length], 30 + j + qi * 3, ["happy", "calm", "wow"][j % 3])}<div class="say"><b>${esc(w)}</b>${esc(v)}</div></div>`).join("")}</div>
     <section class="mission"><b>Try this</b><span>${esc(d.tryit)}</span></section>
     <div class="field"><label for="th-${u.k}-${qi}">What does ${esc(S.child || "your child")} think?</label><textarea class="inp" id="th-${u.k}-${qi}" data-ans="${u.k}|${key}" placeholder="Write their words, not yours">${esc(A(u.k, key) || "")}</textarea></div>
     <div class="pager"><button class="btn line sm" data-act="qi" data-k="${u.k}" data-d="-1" ${qi === 0 ? "disabled" : ""}>${icon("back")}Previous</button><span class="xs muted">${qi + 1} / ${x.deep.length}</span><button class="btn sm" data-act="qi" data-k="${u.k}" data-d="1" ${qi === x.deep.length - 1 ? "disabled" : ""}>Next${icon("next")}</button></div>`;
  }
  if (t === "tasks") {
    const ts = x
      ? chapterTasks(u)
      : [
          ["game", "", c.game[0], c.game[1]],
          ...c.exp.map((e, i) => ["exp" + i, "", "Experiment " + (i + 1), e]),
          ...c.act.map((e, i) => ["act" + i, "", "Activity " + (i + 1), e]),
          ["proj", "", c.proj[0], c.proj[1]],
        ];
    const dn = ts.filter((a) => taskDone(u.k, a[0])).length,
      H = x?.hours || [];
    const hh = (id) => {
      const re = { ws: /^Worksheet/, exp0: /^Experiment/, act0: /^Activit/, game: /^Game/, proj: /^Project/ }[id];
      const r = re && H.find((a) => re.test(a[0]));
      return r ? `<span class="chip">${mins(r[1])}${r[2] > 1 ? ` over ${r[2]} days` : ""}</span>` : "";
    };
    h += `<section class="card ${SC(u.subj)}"><div class="sech"><h3>${dn} of ${ts.length} done</h3></div><div class="bar"><span style="width:${(dn / ts.length) * 100}%;background:var(--c)"></span></div></section><section class="card" style="gap:0">${ts
      .map(([id, , ttl, desc]) => {
        const d = taskDone(u.k, id),
          kind = id.replace(/\d+$/, "");
        return `<div class="taskrow ${d ? "done" : ""}"><button class="ckb" data-act="task" data-k="${u.k}" data-id="${id}" aria-label="${d ? "Mark not done" : "Mark done"}: ${esc(ttl)}">${icon("check")}</button><div><div class="row" style="gap:8px">${icon(kind)}<b>${esc(ttl)}</b></div><p class="sm" style="margin-top:4px">${esc(desc)}</p><div class="meta">${hh(id)}${kind === "ws" ? `<button class="btn xs" data-act="ws" data-k="${u.k}">Open worksheet</button>` : ""}${kind === "proj" ? `<button class="btn xs soft" data-act="startexp" data-title="${esc(ttl)}" data-topic="${esc(u.title)}">Track it daily</button>` : ""}${photoBtn(u.k, "Photo")}</div></div></div>`;
      })
      .join("")}</section>`;
  }
  if (t === "worksheet") {
    const q = x.wsd.reduce((a, s) => a + s[1].length, 0);
    h += `<section class="card"><span class="eyebrow">Worksheet</span><h3 style="font-size:20px">${x.wsd.length} sections, ${q} questions</h3><div class="col" style="gap:6px">${x.wsd.map(([t2, its]) => `<div class="row" style="justify-content:space-between"><span>${esc(t2)}</span><span class="xs muted">${its.length} questions</span></div>`).join("")}</div><button class="btn" data-act="ws" data-k="${u.k}">${taskDone(u.k, "ws") ? "Open again (finished)" : "Start the worksheet"}</button></section>`;
  }
  if (t === "play")
    h += `<section class="qcard" style="background:var(--gum)"><span class="eyebrow">Chapter game</span><h2>${esc(c.game[0])}</h2><p>${esc(c.game[1])}</p></section><section class="card" style="gap:0"><span class="eyebrow" style="margin-bottom:6px">Curated from around the world</span>${x.cur.map(([w, src, url, how]) => `<a class="res" href="${esc(url)}" target="_blank" rel="noopener"><span class="xs muted">${esc(src)} ↗</span><b>${esc(w)}</b><span class="sm muted">${esc(how)}</span></a>`).join("")}</section>`;
  if (t === "read")
    h += `<section class="card" style="gap:0">${[`${u.book}${chNo(u) ? ", " + chNo(u) : ""}`, ...(c.links || []), ...(c.read || [])].map((r) => `<div class="res"><b>${esc(r)}</b></div>`).join("")}</section>`;
  return h;
}
function chapterView() {
  const h = chapterViewV0(),
    u = unitBy(ui.sheet.k),
    U = u?.c?.units || [];
  return U.length
    ? `<section class="card fxnew"><span class="eyebrow">Go deeper: subtopic feeds</span>${fxUnitBtns(U)}</section>` + h
    : h;
}
