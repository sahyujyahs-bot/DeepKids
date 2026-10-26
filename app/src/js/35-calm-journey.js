/* ---------- calm Journey: subjects first, the rest behind rows ---------- */
const JR = {
  high: "Highlights",
  board: "Against the board",
  beyond: "Beyond the board",
  diary: "Learning diary",
  numbers: "Numbers",
};
function jrView() {
  const p = ui.sheet.p;
  document.getElementById("sheetTitle").textContent = JR[p] || "Journey";
  return jPart(p) || `<p class="note">Nothing here yet. It fills up as ${esc(S.child || "your child")} learns.</p>`;
}

function plPart(p) {
  let h = "";
  if (p === "asks") {
    const Q = askList();
    if (Q.length)
      h += `<section class="sec"><div class="sech"><h3>DeepKids asks</h3></div><div class="col" style="gap:8px">${Q.map(([q, a]) => `<button class="askq" data-act="askq" data-a="${esc(a)}">${blob("var(--sun)", 8, "wow", "", 'width="34" height="34"')}<span>${q}</span>${icon("next")}</button>`).join("")}</div></section>`;
  }
  if (p === "events") {
    const evs = S.events || [],
      tds = (S.todos || []).filter((x) => !x.done);
    h += `<section class="sec"><div class="sech"><h3>Classes, outings and to-dos</h3><button class="link" data-act="toplan">+ Add</button></div>${evs.length || tds.length ? `<div class="tt">${evs.map((e) => `<div class="tcard ${e.kind === "outing" ? "r-out" : "r-" + e.who}"><span class="ic">${icon("event")}</span><span class="m"><b>${esc(e.title)}</b><span>${clock(hm(e.start))} · ${e.rep === "weekly" ? "every " + e.days.map((d) => DAYN[d]).join(", ") : fmt(e.date)} · ${ROLE[e.kind === "outing" ? "out" : e.who]}</span></span><button class="iconbtn" style="width:38px;height:38px" data-act="delev" data-e="${e.id}" aria-label="Remove ${esc(e.title)}">${icon("close")}</button></div>`).join("")}${tds.map((x) => `<div class="tcard r-${x.who}"><span class="ic">${icon("prep")}</span><span class="m"><b>${esc(x.title)}</b><span>${fmt(x.date)} · any time · ${ROLE[x.who]}</span></span><button class="iconbtn" style="width:38px;height:38px" data-act="tododel" data-t="${x.id}" aria-label="Remove ${esc(x.title)}">${icon("close")}</button></div>`).join("")}</div>` : `<p class="note">Nothing yet. Tell DeepKids above, or add by hand.</p>`}</section>`;
  }
  if (p === "day") {
    const d = D();
    h += `<section class="sec"><div class="sech"><h3>Your day</h3></div><div class="card"><div class="fgrid">
    <div class="field"><label for="dPrep">Morning prep</label><input class="inp" id="dPrep" type="time" data-dayset="prepAt" value="${d.prepAt}"></div><div class="field"><label for="dStart">Lessons start</label><input class="inp" id="dStart" type="time" data-dayset="start" value="${d.start}"></div>
    <div class="field"><label for="dBrk">Break between</label><select class="inp" id="dBrk" data-dayset="brk">${[0, 10, 15, 20, 30].map((x) => `<option value="${x}" ${+d.brk === x ? "selected" : ""}>${x} min</option>`).join("")}</select></div>
    <div class="field"><label for="dLunch">Lunch at</label><input class="inp" id="dLunch" type="time" data-dayset="lunch" value="${d.lunch}"></div><div class="field"><label for="dLunchM">Lunch length</label><select class="inp" id="dLunchM" data-dayset="lunchMin">${[30, 45, 60, 90].map((x) => `<option value="${x}" ${+d.lunchMin === x ? "selected" : ""}>${x} min</option>`).join("")}</select></div>
    <div class="field"><label for="dEve">Evening prep</label><input class="inp" id="dEve" type="time" data-dayset="eveAt" value="${d.eveAt}"></div>${fxWeekRow()}<div class="field"><label for="dEnd">Learning ends by</label><input class="inp" id="dEnd" type="time" data-dayset="endAt" value="${d.endAt || "18:30"}"></div></div></div></section>`;
  }
  if (p === "pace") {
    h += `<section class="sec"><div class="sech"><h3>Pace</h3><span class="xs muted">Change anything and the year re-plans</span></div>${S.subjects
      .map((s) => {
        const sc = schedule(s),
          cur = sc.filter((x) => x.u.level === S.levels[s]),
          l = S.levels[s];
        return `<div class="card ${SC(s)}"><div class="sech"><div class="row" style="gap:8px">${sblob(s, "happy", "", 'width="34" height="34"')}<h3>${SUBJ[s]}</h3></div><div class="stepper"><button data-act="lvl" data-s="${s}" data-d="-1" ${l <= 1 ? "disabled" : ""} aria-label="Class down">−</button><span class="sm" style="min-width:64px;text-align:center">Class ${l}</span><button data-act="lvl" data-s="${s}" data-d="1" ${l >= 5 ? "disabled" : ""} aria-label="Class up">+</button></div></div>
     <div class="row"><select class="inp" style="width:auto;height:40px" id="hpd-${s}" data-hpd="${s}" aria-label="${SUBJ[s]} hours a day">${[0.25, 0.5, 0.75, 1, 1.5, 2, 3].map((v) => `<option value="${v}" ${hpdOf(s) === v ? "selected" : ""}>${v} h a day</option>`).join("")}</select><div class="dpick">${[1, 2, 3, 4, 5, 6, 0].map((dd) => `<button aria-pressed="${daysOf(s).includes(dd)}" data-act="day" data-s="${s}" data-d="${dd}">${DAYN[dd]}</button>`).join("")}</div></div>
     <p class="xs muted">${lvlLabel(l)} · ${cur.length} lesson days left at this level${cur.length ? `, finishing around ${fmt(cur[cur.length - 1].date)}` : ""}</p></div>`;
      })
      .join("")}</section>`;
  }
  return h;
}
function jPart(p) {
  let h = "";
  if (p === "numbers") {
    const tasks = Object.values(S.tasks).reduce((a, t) => a + Object.keys(t).length, 0),
      gd = Object.values(S.games).filter((g) => g.g?.length || Object.keys(g.tf || {}).length || g.odd).length,
      hrs = S.log.reduce((a, l) => a + hpdOf(l.subj), 0);
    h += `<section class="sec"><div class="stack3">${[
      [S.log.length, "lessons", "var(--sun)"],
      [fh(hrs), "hours learned", "var(--pist)"],
      [tasks, "tasks done", "var(--gum)"],
      [gd, "game days", "var(--sky)"],
    ]
      .map(
        ([n, l, c], i) =>
          `<div class="scard" style="--c:${c};min-height:104px"><span class="big num">${n}</span><span class="sm" style="font-weight:800">${l}</span>${blob("rgba(255,255,255,.6)", 60 + i, "happy")}</div>`,
      )
      .join("")}</div></section>`;
  }
  if (p === "high") {
    const Qs = quotes().slice(-3).reverse(),
      W = workOf().slice(-6).reverse();
    if (Qs.length || W.length)
      h += `<section class="sec"><div class="sech"><h3>Highlights</h3></div>${Qs.map((q) => `<div class="quote ${SC(q.u.subj)}"><span class="eyebrow">${esc(q.q || "")}</span><p>“${esc(q.a)}”</p><span class="xs muted">${esc(q.u.title)}</span></div>`).join("")}${thumbs(W)}</section>`;
  }
  if (p === "board") {
    const bs = boardsOn();
    if (bs.length)
      h += `<section class="sec"><div class="sech"><h3>Against the board</h3><span class="xs muted">school year from ${fmt(AY0())}</span></div>${bs
        .map((b) => {
          const R = S.subjects.map((s) => ({ s, r: boardRows(s, b) })).filter((x) => x.r);
          if (!R.length) return "";
          return `<div class="card"><b style="font:600 17px var(--display)">${BOARDS[b]}</b>${R.map(({ s, r }) => `<div class="col" style="gap:4px"><div class="sech"><span class="sm" style="font-weight:800">${SUBJ[s]}</span><span class="xs ${r.behind.length ? "" : "muted"}" style="${r.behind.length ? "color:var(--bad);font-weight:800" : ""}">${r.behind.length ? `${r.behind.length} behind` : r.done.length >= r.exp ? "On track" : ""} · ${r.done.length} of ${r.us.length}</span></div><div class="bar ${SC(s)}"><span style="width:${(r.done.length / r.us.length) * 100}%;background:var(--c)"></span></div></div>`).join("")}</div>`;
        })
        .join("")}</section>`;
  }
  if (p === "beyond") {
    const beyond = S.log.filter((l) => l.key.startsWith("dk|") || l.kind === "free"),
      bk = [...new Set(beyond.map((l) => l.title))];
    h += `<section class="sec"><div class="sech"><h3>Beyond the board</h3></div><div class="card">${bk.length ? `<div class="row">${bk.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>` : `<p class="sm muted">DeepKids Plus topics and things you explore freely show up here.</p>`}<p class="xs muted">${S.exps.filter((e) => e.closed).length} experiments finished · ${quotes().length} big-question answers recorded</p></div></section>`;
  }
  if (p === "diary") {
    h += `<section class="sec"><div class="sech"><h3>Learning diary</h3></div><div class="card diary">${
      S.log
        .slice(0, 20)
        .map(
          (l) =>
            `<div class="dline ${SC(l.subj)}">${sblob(l.subj, "happy", "", 'width="34" height="34"')}<span><b style="font:600 16px var(--display)">${esc(l.title)}</b><br><span class="xs muted">${fmt(l.date)} · ${SUBJ[l.subj] || ""}${l.kind === "free" ? " · explored freely" : l.kind === "more" ? " · extra lesson" : ""}</span></span></div>`,
        )
        .join("") || `<p class="sm muted">Finished lessons appear here.</p>`
    }</div></section>`;
  }
  return h;
}

let DBH = null,
  UID = null,
  _all = null,
  ACCT = "";
function keepInputs(root) {
  const o = {};
  root.querySelectorAll("input[id],textarea[id],select[id]").forEach((e) => {
    if (e.dataset.dirty && e.type !== "file") o[e.id] = e.type === "checkbox" ? e.checked : e.value;
  });
  const a = document.activeElement;
  return {
    o,
    focus: a && root.contains(a) && a.id ? a.id : null,
    sel: a && typeof a.selectionStart === "number" ? a.selectionStart : null,
  };
}
function restoreInputs(root, k) {
  Object.entries(k.o).forEach(([id, v]) => {
    const e = root.querySelector("#" + CSS.escape(id));
    if (!e) return;
    if (e.type === "checkbox") e.checked = v;
    else e.value = v;
    e.dataset.dirty = "1";
  });
  if (k.focus) {
    const e = root.querySelector("#" + CSS.escape(k.focus));
    if (e && document.activeElement !== e) {
      e.focus({ preventScroll: true });
      try {
        if (k.sel != null) e.setSelectionRange(k.sel, k.sel);
      } catch (x) {}
    }
  }
}
function clearIn(id) {
  document.querySelectorAll("#" + CSS.escape(id)).forEach((e) => {
    e.value = "";
    delete e.dataset.dirty;
  });
}
document.addEventListener(
  "input",
  (e) => {
    if (e.target.id) e.target.dataset.dirty = "1";
  },
  true,
);
document.addEventListener(
  "change",
  (e) => {
    if (e.target.id) e.target.dataset.dirty = "1";
  },
  true,
);
const pname = () => (S.parent && S.parent.name) || ACCT;
function allUnits() {
  if (_all && _all.n === SHARED.topics.length) return _all.u;
  const u = [
    ...DATA.items,
    ...DATA.topics.map((t) => ({
      k: "dk|" + t.id,
      board: "dk",
      subj: "dks",
      level: 1,
      book: "DeepKids Science",
      n: t.id,
      title: t.name,
      dk: [],
      topic: t,
    })),
    ...SHARED.topics.map(genUnit),
  ];
  _all = { n: SHARED.topics.length, u };
  return u;
}
const dayTypeOf = (d) => (S.dayType || {})[d] || (fxWT(parse(d).getDay()) === "half" ? "busy" : "full");
const lessonMins = (s, date) => (dayTypeOf(date) === "busy" ? Math.min(30, hpdOf(s) * 60) : hpdOf(s) * 60);
const MODES = {
  books: [
    "Syllabus books",
    "Read the board's books, with a summary and curated resources for every chapter.",
    "var(--sky)",
  ],
  booksplus: [
    "Books + DeepKids Plus",
    "The books, plus our lesson plans, big questions, worksheets and games for each topic.",
    "var(--tang)",
  ],
  plus: [
    "DeepKids Plus first",
    "All syllabuses combined and more. Lesson plans lead; the books become suggested reading.",
    "var(--gum)",
  ],
};
