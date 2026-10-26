/* ---------- school transfer report ---------- */
const GRADE = (p) =>
  p >= 91
    ? "A1"
    : p >= 81
      ? "A2"
      : p >= 71
        ? "B1"
        : p >= 61
          ? "B2"
          : p >= 51
            ? "C1"
            : p >= 41
              ? "C2"
              : p >= 33
                ? "D"
                : "E";
const BOARDN = {
  combined: "DeepKids track",
  ncert: "NCERT / CBSE",
  cambridge: "Cambridge Primary",
  nios: "NIOS Open Basic Education",
  waldorf: "Waldorf (Steiner) education",
};
const lvN = (b, l) =>
  b === "nios"
    ? l === 3
      ? "Level A (≈ Class 3)"
      : l === 5
        ? "Level B (≈ Class 5)"
        : "Level " + l
    : b === "cambridge"
      ? `Stage ${l} (≈ Class ${l})`
      : `Class ${l}`;
function chScore(u) {
  const k = u.k,
    P = u.c?.p,
    cov = Math.min(1, done(k) / sessionsFor(u));
  let r = 0,
    n = 0;
  const sets = [
    ...(u.c?.x?.wsd ? [[k, u.c.x.wsd]] : []),
    ...(P?.worksheets || []).map((w) => [k + "#" + w.id, w.sections]),
  ];
  sets.forEach(([kk, W]) =>
    W.forEach(([_, its], si) =>
      its.forEach((it, ii) => {
        const v = A(kk, si + "-" + ii);
        if (v === undefined || v === "") return;
        if (it.t === "mcq") {
          n++;
          if (v === it.a) r++;
        } else if (it.t === "match" && v && typeof v === "object")
          it.pairs.forEach(([l, rr]) => {
            if (v[l] !== undefined) {
              n++;
              if (v[l] === rr) r++;
            }
          });
        else if (it.t === "fill")
          [].concat(v).forEach((x, bi) => {
            if (!x) return;
            n++;
            const acc = []
              .concat(it.a[bi] ?? "")
              .join("/")
              .split("/")
              .map((z) => z.trim().toLowerCase());
            if (acc.includes(String(x).trim().toLowerCase())) r++;
          });
      }),
    ),
  );
  Object.entries(S.quiz || {}).forEach(([kk, q]) => {
    if (kk.slice(0, kk.lastIndexOf("|")) !== k) return;
    Object.values(q).forEach((x) => {
      n++;
      if (x.r) r++;
    });
  });
  const dn = done(k),
    due = (it) => !it.day || it.day <= dn,
    pool = [
      ...(P?.worksheets || []).filter(due).map((w) => taskDone(k + "#" + w.id, "ws")),
      ...(P?.experiments || []).filter(due).map((e) => taskDone(k, e.id)),
      ...(P?.activities || []).filter(due).map((a) => taskDone(k, a.id)),
      ...(u.c?.x?.wsd && cov >= 1 ? [taskDone(k, "ws")] : []),
    ];
  const prac = pool.length ? pool.filter(Boolean).length / pool.length : null,
    acc = n ? r / n : null,
    parts = [
      [acc, 0.7],
      [prac, 0.3],
    ].filter((p) => p[0] !== null),
    w = parts.reduce((a, p) => a + p[1], 0),
    score = w ? Math.round((parts.reduce((a, p) => a + p[0] * p[1], 0) / w) * 100) : null;
  const last = S.log
    .filter((l) => l.key === k)
    .map((l) => l.date)
    .sort();
  return {
    u,
    cov,
    acc,
    n,
    r,
    prac,
    score,
    grade: score == null ? "" : GRADE(score),
    fin: st(k) === "completed" || done(k) >= sessionsFor(u),
    from: last[0],
    to: last[last.length - 1],
  };
}
function schoolData() {
  const studied = Object.keys(S.progress || {})
      .filter((k) => done(k) > 0)
      .map(unitByK)
      .filter((u) => u && u.board !== "dk" && u.board !== "gen"),
    sc = studied.map(chScore),
    T = trackData(),
    ds = Object.keys(T)
      .filter((d) => dTot(T[d]) > 0 || T[d].did.some((x) => x.t === "lesson"))
      .sort();
  const finK = new Set(sc.filter((x) => x.fin).map((x) => x.u.k)),
    stK = new Set(sc.map((x) => x.u.k)),
    RC = DATA.rconcepts || [],
    conOf = {};
  RC.forEach((c) => c.chapters.forEach((k) => (conOf[k] = conOf[k] || []).push(c)));
  const cDone = new Set(RC.filter((c) => c.chapters.some((k) => finK.has(k))).map((c) => c.id)),
    cSome = new Set(RC.filter((c) => c.chapters.some((k) => stK.has(k))).map((c) => c.id));
  const subs = SUBJ_KEYS.filter((s) => S.subjects.includes(s) || sc.some((x) => x.u.subj === s)).map((s) => {
    const L = sc.filter((x) => x.u.subj === s),
      G = L.filter((x) => x.score != null),
      wt = G.reduce((a, x) => a + x.n + 1, 0),
      score = G.length ? Math.round(G.reduce((a, x) => a + x.score * (x.n + 1), 0) / wt) : null,
      mins = ds.reduce((a, d) => a + (T[d].m[s] || 0) + (T[d].e[s] || 0), 0);
    const boards = ["ncert", "cambridge", "nios"]
      .map((b) => {
        const us = DATA.items.filter((u) => u.board === b && u.subj === s);
        if (!us.length) return null;
        const lv = {};
        us.forEach((u) => {
          const R = (lv[u.level] = lv[u.level] || { tot: 0, done: 0, eq: 0, going: 0 });
          R.tot++;
          const cs = conOf[u.k] || [];
          if (finK.has(u.k)) R.done++;
          else if (stK.has(u.k)) R.going++;
          else if (cs.length && cs.every((c) => cDone.has(c.id))) R.eq++;
          else if (cs.some((c) => cDone.has(c.id) || cSome.has(c.id))) R.going++;
        });
        const levels = Object.keys(lv)
            .map(Number)
            .sort((a, b) => a - b),
          reached = levels.filter((l) => (lv[l].done + lv[l].eq) / lv[l].tot >= 0.8).pop(),
          working = levels.filter((l) => lv[l].done + lv[l].eq + lv[l].going > 0).pop();
        return { b, lv, levels, reached, working };
      })
      .filter(Boolean);
    return { s, L, score, grade: score == null ? "" : GRADE(score), mins, level: S.levels?.[s], boards };
  });
  const ws = Object.entries(S.tasks || {}).filter(([k, o]) => o.ws).length,
    proj = Object.values(WK()).filter((w) => w.st === "done").length,
    qz = Object.values(S.quiz || {}).reduce((a, q) => a + Object.keys(q).length, 0);
  const months = {};
  ds.forEach((d) => {
    const m = d.slice(0, 7);
    months[m] = months[m] || { d: 0, m: 0 };
    months[m].d++;
    months[m].m += dTot(T[d]);
  });
  return {
    subs,
    ds,
    from: ds[0],
    to: ds[ds.length - 1],
    mins: ds.reduce((a, d) => a + dTot(T[d]), 0),
    ws,
    proj,
    qz,
    ups: (S.work || []).length,
    months,
    cross: RC.length,
  };
}
const SCORE_NOTE =
  "Scores (0–100) measure the work done so far, not how far the child has got: 70% accuracy on auto-checked worksheet items and quiz questions, 30% worksheets, experiments and activities finished out of those due by the parts completed. How much of each chapter is complete is shown separately. Subject scores weight chapters by how many answers were checked. Grades use the CBSE 8-point scale: A1 91–100, A2 81–90, B1 71–80, B2 61–70, C1 51–60, C2 41–50, D 33–40, E below 33. These are records of home learning, not exam marks.";
function covCell(R) {
  if (!R) return "—";
  const p = Math.round(((R.done + R.eq) / R.tot) * 100);
  return `${p}%<span class="xs muted"> · ${R.done} done${R.eq ? `, ${R.eq} by equivalent` : ""}${R.going ? `, ${R.going} begun` : ""} of ${R.tot}</span>`;
}
function schoolView() {
  document.getElementById("sheetTitle").textContent = "Moving to a school";
  const D = schoolData(),
    I = S.school || {},
    f = (k, l, type = "text", ph = "") =>
      `<div class="field"><label for="sch-${k}">${l}</label><input class="inp" id="sch-${k}" type="${type}" data-sch="${k}" value="${esc(I[k] || "")}" placeholder="${esc(ph)}"></div>`;
  let h = `<p class="sm muted">A full record of what ${esc(S.child || "your child")} has covered at home, by board and level, with scores. Download it as a transcript for the new school.</p>
  <div class="row" style="gap:10px;flex-wrap:wrap"><button class="btn accent sm" data-act="tsave">Download transcript</button><button class="btn soft sm" data-act="tprint">Print or save as PDF</button></div>
  <details class="card"><summary><b>Details for the school</b> <span class="xs muted">· optional</span></summary><div class="fgrid" style="margin-top:10px">${f("dob", "Date of birth", "date")}${f("to", "School applying to", "text", "e.g. Kendriya Vidyalaya, Indiranagar")}${f("cls", "Class applying for", "text", "e.g. Class 4")}${f("contact", "Parent phone or email")}</div><div class="field"><label for="sch-note">A note for the school</label><textarea class="inp" id="sch-note" data-sch="note" rows="3" placeholder="How you homeschool, strengths, anything they should know">${esc(I.note || "")}</textarea></div></details>`;
  h += testSection();
  h += testSection();
  h += testSection();
  h += testSection();
  h += testSection();
  h += testSection();
  h += testSection();
  h += testSection();
  h += testSection();
  h += testSection();
  h += testSection();
  h += testSection();
  h += `<div class="tiles"><div class="tile"><b>${D.ds.length}</b><span>study days${D.from ? ` since ${esc(fmt(D.from))}` : ""}</span></div><div class="tile"><b>${hmin(D.mins)}</b><span>of study</span></div><div class="tile"><b>${D.subs.reduce((a, x) => a + x.L.filter((c) => c.fin).length, 0)}</b><span>chapters completed</span></div><div class="tile"><b>${D.ws}</b><span>worksheets finished</span></div></div>`;
  const idle = D.subs.filter((x) => !x.L.length);
  D.subs
    .filter((x) => x.L.length)
    .forEach((x) => {
      h += `<section class="card ${SC(x.s)}"><div class="sech"><h3 style="font-size:19px">${esc(SUBJ[x.s])}</h3>${x.score != null ? `<span class="grade" title="Score ${x.score}">${x.grade} · ${x.score}</span>` : `<span class="xs muted">no checked work yet</span>`}</div>
    <p class="xs muted">${hmin(x.mins)} · ${x.L.filter((c) => c.fin).length} chapters completed, ${x.L.filter((c) => !c.fin).length} in progress${x.level ? ` · working at Level ${x.level}` : ""}</p>
    <div class="grid"><table class="rtab"><tr><th>Board</th><th>Where the child is</th>${[1, 2, 3, 4, 5].map((l) => `<th>L${l}</th>`).join("")}</tr>${x.boards.map((B) => `<tr><td><b>${esc(BOARDN[B.b])}</b></td><td class="xs">${B.reached ? `Covers ${esc(lvN(B.b, B.reached))}` : B.working ? `Working on ${esc(lvN(B.b, B.working))}` : "Not begun"}</td>${[1, 2, 3, 4, 5].map((l) => `<td class="xs">${B.lv[l] ? Math.round(((B.lv[l].done + B.lv[l].eq) / B.lv[l].tot) * 100) + "%" : "·"}</td>`).join("")}</tr>`).join("")}</table></div>
    ${
      x.L.length
        ? `<details><summary class="link sm" style="cursor:pointer">Chapters and scores (${x.L.length})</summary><table class="rtab" style="margin-top:8px"><tr><th>Chapter</th><th>Done</th><th>Accuracy</th><th>Score</th></tr>${x.L.sort(
            (a, b) => a.u.level - b.u.level || (+a.u.n || 0) - (+b.u.n || 0),
          )
            .map(
              (c) =>
                `<tr><td><b>${esc(chT(c.u))}</b><br><span class="xs muted">${esc(BOARDN[c.u.board] || c.u.book)} · ${esc(lvN(c.u.board, c.u.level))}</span></td><td>${Math.round(c.cov * 100)}%</td><td>${c.acc == null ? "—" : Math.round(c.acc * 100) + "%"}<span class="xs muted">${c.n ? ` (${c.r}/${c.n})` : ""}</span></td><td>${c.score == null ? "—" : `<b>${c.grade}</b> ${c.score}`}</td></tr>`,
            )
            .join("")}</table></details>`
        : ""
    }</section>`;
    });
  if (idle.length) h += `<p class="sm muted">Not started yet: ${idle.map((x) => esc(SUBJ[x.s])).join(", ")}.</p>`;
  if (!D.subs.some((x) => x.L.length)) h += `<p class="note">Finish a few lessons and the report fills in here.</p>`;
  h += `<p class="xs muted">${SCORE_NOTE}</p><p class="xs muted">Board percentages count chapters done in that board, plus Science chapters of other boards that teach the same ideas (${D.cross} shared Science concepts are mapped across NCERT, Cambridge and NIOS). Other subjects count each board's own chapters only.</p>`;
  h += bundleSection();
  return h;
}
function transcriptDoc() {
  const D = schoolData(),
    I = S.school || {},
    kid = S.child || "Student",
    row = (a, b) => (b ? `<tr><th>${a}</th><td>${b}</td></tr>` : "");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(kid)} · Home education transcript</title><style>body{font:14px/1.5 system-ui,sans-serif;color:#222;max-width:820px;margin:24px auto;padding:0 16px}h1{font-size:22px;margin:0}h2{font-size:17px;margin:26px 0 6px;border-bottom:2px solid #333;padding-bottom:3px}h3{font-size:15px;margin:16px 0 4px}table{border-collapse:collapse;width:100%;margin:4px 0}th,td{border:1px solid #bbb;padding:5px 8px;text-align:left;vertical-align:top}th{background:#f2f2f2}.k th{width:34%;background:#fafafa}.muted{color:#666}.sm{font-size:12px}.sig{display:flex;gap:40px;margin-top:40px}.sig div{flex:1;border-top:1px solid #333;padding-top:4px;font-size:12px}@media print{body{margin:0}h2{break-after:avoid}table{break-inside:auto}tr{break-inside:avoid}}</style></head><body>
  <h1>Home education transcript</h1><p class="muted">Prepared with DeepKids · ${esc(new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }))}</p>
  <h2>Student</h2><table class="k">${row("Name", esc(kid))}${row("Date of birth", I.dob ? esc(parse(I.dob).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })) : "")}${row("Age", S.age ? esc(S.age) + " years" : "")}${row("Parent / guardian", esc(S.parent?.name || ""))}${row("Contact", esc(I.contact || ""))}${row("Applying to", esc([I.to, I.cls].filter(Boolean).join(", ")))}${row(
    "Boards followed",
    esc(
      boardsOn()
        .map((b) => BOARDN[b] || b)
        .join(", ") || "DeepKids",
    ),
  )}${row("Period of home learning", D.from ? esc(fmt(D.from) + " to " + fmt(D.to)) : "")}</table>
  <h2>Summary</h2><table><tr><th>Subject</th><th>Level working at</th><th>Chapters completed</th><th>In progress</th><th>Study time</th><th>Score</th><th>Grade</th></tr>${D.subs.map((x) => `<tr><td>${esc(SUBJ[x.s])}</td><td>${x.level ? "Level " + x.level + " (≈ Class " + x.level + ")" : "—"}</td><td>${x.L.filter((c) => c.fin).length}</td><td>${x.L.filter((c) => !c.fin).length}</td><td>${hmin(x.mins)}</td><td>${x.score ?? "—"}</td><td>${x.grade || "—"}</td></tr>`).join("")}</table>
  <p class="sm">Study days: ${D.ds.length} · Total study time: ${hmin(D.mins)} · Worksheets finished: ${D.ws} · Quiz questions answered: ${D.qz} · Projects and experiments finished: ${D.proj} · Work samples kept: ${D.ups}</p>
  <h2>Coverage by board and level</h2><p class="sm muted">Share of each board's chapters covered at each level. "By equivalent" counts Science chapters of a board whose ideas were all covered through another board's chapters.</p>${D.subs.map((x) => `<h3>${esc(SUBJ[x.s])}</h3><table><tr><th>Board</th><th>Level reached</th><th>Level 1</th><th>Level 2</th><th>Level 3</th><th>Level 4</th><th>Level 5</th></tr>${x.boards.map((B) => `<tr><td>${esc(BOARDN[B.b])}</td><td>${B.reached ? esc(lvN(B.b, B.reached)) : B.working ? "Working on " + esc(lvN(B.b, B.working)) : "Not begun"}</td>${[1, 2, 3, 4, 5].map((l) => `<td>${covCell(B.lv[l])}</td>`).join("")}</tr>`).join("")}</table>`).join("")}
  <h2>Chapters studied</h2>${
    D.subs
      .filter((x) => x.L.length)
      .map(
        (x) =>
          `<h3>${esc(SUBJ[x.s])}</h3><table><tr><th>Chapter</th><th>Board · level</th><th>Dates</th><th>Completed</th><th>Accuracy</th><th>Score</th><th>Grade</th></tr>${x.L.map((c) => `<tr><td>${esc(chT(c.u))}</td><td>${esc(BOARDN[c.u.board] || c.u.book)} · ${esc(lvN(c.u.board, c.u.level))}</td><td>${c.from ? esc(fmt(c.from)) + (c.to && c.to !== c.from ? " – " + esc(fmt(c.to)) : "") : ""}</td><td>${Math.round(c.cov * 100)}%</td><td>${c.acc == null ? "—" : Math.round(c.acc * 100) + "% (" + c.r + "/" + c.n + ")"}</td><td>${c.score ?? "—"}</td><td>${c.grade || "—"}</td></tr>`).join("")}</table>`,
      )
      .join("") || `<p>No chapters recorded yet.</p>`
  }
  <h2>Attendance</h2><table><tr><th>Month</th><th>Study days</th><th>Study time</th></tr>${Object.keys(D.months)
    .sort()
    .map(
      (m) =>
        `<tr><td>${esc(parse(m + "-01").toLocaleDateString(undefined, { month: "long", year: "numeric" }))}</td><td>${D.months[m].d}</td><td>${hmin(D.months[m].m)}</td></tr>`,
    )
    .join("")}</table>
  ${I.note ? `<h2>Note from the parent</h2><p>${esc(I.note).replace(/\n/g, "<br>")}</p>` : ""}
  ${quizTranscript()}${testTranscript()}<h2>How scores are worked out</h2><p class="sm">${SCORE_NOTE}</p><p class="sm">Study time is measured while lessons are open in the app; days without timing use the planned lesson length and are included in totals.</p>
  <h2>Declaration</h2><p class="sm">I confirm that this record reflects my child's home learning.</p><div class="sig"><div>Parent / guardian signature</div><div>Date</div></div></body></html>`;
}
async function saveDoc(html, name) {
  try {
    const dl = await window.claude?.use?.("downloads");
    if (dl) {
      await dl.save({ filename: name, data: html });
      toast("Saved");
      return;
    }
  } catch (e) {
    if (e?.code === "declined") return;
  }
  try {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast("Saved");
  } catch (e) {
    toast("Couldn't save here. Try Print instead.");
  }
}
function printDoc(html) {
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
    setTimeout(() => {
      try {
        w.print();
      } catch (e) {}
    }, 300);
    return;
  }
  const f = document.createElement("iframe");
  f.style.cssText = "position:fixed;width:0;height:0;border:0";
  document.body.appendChild(f);
  f.srcdoc = html;
  f.onload = () => {
    try {
      f.contentWindow.print();
    } catch (e) {
      toast("Printing isn't allowed here. Download it, then print that.");
    }
    setTimeout(() => f.remove(), 4000);
  };
}
