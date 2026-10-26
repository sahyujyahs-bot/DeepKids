/* ---------- documents for the school ---------- */
const DOCCSS = `body{font:14px/1.5 system-ui,sans-serif;color:#222;max-width:820px;margin:24px auto;padding:0 16px}h1{font-size:22px;margin:0}h2{font-size:17px;margin:24px 0 6px;border-bottom:2px solid #333;padding-bottom:3px}table{border-collapse:collapse;width:100%;margin:6px 0}th,td{border:1px solid #bbb;padding:5px 8px;text-align:left;vertical-align:top}th{background:#f2f2f2}.muted{color:#666}.sm{font-size:12px}ol{padding-left:22px}li{margin:10px 0;break-inside:avoid}.op{display:block;margin:2px 0 2px 6px}.ok{color:#1e7a3c;font-weight:700}.no{color:#b03a2e;font-weight:700}.pass{border-left:3px solid #999;padding:4px 10px;margin:6px 0;background:#f7f7f7}.sig{display:flex;gap:40px;margin-top:40px}.sig div{flex:1;border-top:1px solid #333;padding-top:4px;font-size:12px}.cert{border:6px double #555;padding:28px;text-align:center}.cert h1{font-size:26px}.big{font-size:34px;font-weight:800;margin:6px 0}.tw{overflow-x:auto}@media(max-width:520px){.cert{padding:14px}.big{font-size:26px}th,td{padding:4px 5px;font-size:12.5px}}@media print{body{margin:0}h2{break-after:avoid}}`;
const docWrap = (title, body) =>
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>${DOCCSS}</style></head><body>${body}</body></html>`;
const tHead = (t) =>
  `<p class="muted">${esc(tbName(t.board))} pattern · for admission to Class ${t.cls} · covers the ${esc(lvN(TB(t.board), t.level))} syllabus</p>`;
const tDate = (t) => new Date(t.at).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
function qList(t, x, mode) {
  let lastP = "";
  return `<ol>${x.qs
    .map((q, i) => {
      const v = t.ans[x.s + "|" + i],
        p = q.passage && q.passage !== lastP ? `<div class="pass">${esc(q.passage)}</div>` : "";
      lastP = q.passage || lastP;
      const ch = q.ch && unitByK(q.ch);
      return `<li>${p}<b>${esc(q.q)}</b>${q.opts.map((o, j) => `<span class="op">${mode !== "paper" && j === q.a ? "<span class='ok'>✓</span> " : mode === "sheet" && j === v ? "<span class='no'>✗</span> " : ""}(${ABCD[j]}) ${esc(o)}</span>`).join("")}${mode === "key" ? `<span class="sm muted">Answer: ${ABCD[q.a]} · 1 mark${ch ? " · " + esc(chT(ch)) : ""}${q.skill ? " · " + esc(q.skill) : ""}</span>` : mode === "sheet" ? `<span class="sm">${v === undefined ? "<span class='no'>Not answered</span> · 0 marks" : v === q.a ? `<span class='ok'>Chose ${ABCD[v]} · correct</span> · 1 mark` : `<span class='no'>Chose ${ABCD[v]}</span> · correct ${ABCD[q.a]} · 0 marks`}</span>` : ""}</li>`;
    })
    .join("")}</ol>`;
}
function paperDoc(t) {
  const n = t.subjects.reduce((a, x) => a + x.qs.length, 0);
  return docWrap(
    "Question paper",
    `<h1>Entrance test · question paper</h1>${tHead(t)}<p>Name: ______________________ &nbsp; Date: ____________</p><p class="sm"><b>Instructions:</b> ${n} multiple-choice questions, 1 mark each, no negative marking. Choose one answer for each question.</p>${t.subjects.map((x) => `<h2>${esc(SUBJ[x.s])} · ${x.qs.length} marks</h2>${qList(t, x, "paper")}`).join("")}`,
  );
}
function keyDoc(t) {
  return docWrap(
    "Answer key",
    `<h1>Entrance test · answer key and marking</h1>${tHead(t)}<h2>Marking scheme</h2><p class="sm">Each question carries 1 mark. No negative marking; unanswered questions get 0. Subject and overall percentages are marks ÷ questions × 100. Grades use the CBSE 8-point scale: A1 91–100, A2 81–90, B1 71–80, B2 61–70, C1 51–60, C2 41–50, D 33–40, E below 33.</p>${t.subjects.map((x) => `<h2>${esc(SUBJ[x.s])}</h2>${qList(t, x, "key")}`).join("")}`,
  );
}
function sheetDoc(t) {
  const sc = tScore(t);
  return docWrap(
    "Marked answer sheet",
    `<h1>Entrance test · marked answer sheet</h1>${tHead(t)}<p><b>${esc(S.child || "Student")}</b> · taken ${esc(tDate(t))} · ${sc.right} / ${sc.n} (${sc.pct}%) · Grade ${sc.grade}</p>${scoreTable(sc)}${t.subjects
      .map((x) => {
        const r = sc.R.find((z) => z.s === x.s);
        return `<h2>${esc(SUBJ[x.s])} · ${r.right} / ${r.n}</h2>${qList(t, x, "sheet")}`;
      })
      .join("")}`,
  );
}
const scoreTable = (sc) =>
  `<div class="tw"><table><tr><th>Subject</th><th>Questions</th><th>Answered</th><th>Marks</th><th>Percentage</th><th>Grade</th><th>Time taken</th></tr>${sc.R.map((r) => `<tr><td>${esc(SUBJ[r.s])}</td><td>${r.n}</td><td>${r.ans}</td><td>${r.right}</td><td>${r.pct}%</td><td>${r.grade}</td><td>${r.mins ? r.mins + " min" : "—"}</td></tr>`).join("")}<tr><th>Total</th><th>${sc.n}</th><th>${sc.R.reduce((a, r) => a + r.ans, 0)}</th><th>${sc.right}</th><th>${sc.pct}%</th><th>${sc.grade}</th><th></th></tr></table></div>`;
function certDoc(t) {
  const sc = tScore(t),
    I = S.school || {};
  return docWrap(
    "Score certificate",
    `<div class="cert"><p class="muted">Home assessment</p><h1>Score certificate</h1><p>This is to record that</p><p class="big">${esc(S.child || "Student")}</p>${I.dob ? `<p class="muted">born ${esc(parse(I.dob).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }))}</p>` : ""}<p>took an entrance test on the <b>${esc(BOARDN[TB(t.board)])} ${esc(lvN(TB(t.board), t.level))}</b> syllabus${I.to ? `, for admission to Class ${t.cls} at ${esc(I.to)}` : `, for admission to Class ${t.cls}`}, on ${esc(tDate(t))}, and scored</p><p class="big">${sc.right} / ${sc.n} · ${sc.pct}% · Grade ${sc.grade}</p><table><tr><th>Subject</th><th>Marks</th><th>%</th><th>Grade</th></tr>${sc.R.map((r) => `<tr><td>${esc(SUBJ[r.s])}</td><td>${r.right} / ${r.n}</td><td>${r.pct}%</td><td>${r.grade}</td></tr>`).join("")}</table><p class="sm muted">Taken at home on DeepKids under parent supervision. ${sc.n} multiple-choice questions, 1 mark each, no negative marking. This is a home assessment, not a board examination.</p><div class="sig"><div>Parent / guardian${S.parent?.name ? ": " + esc(S.parent.name) : ""}</div><div>Date</div></div></div>`,
  );
}
function testTranscript() {
  const t = curTest();
  if (!t || !tDone(t)) return "";
  const sc = tScore(t);
  return `<h2>Entrance test</h2><p class="sm">${esc(tbName(t.board))} pattern, for Class ${t.cls}, on the ${esc(lvN(TB(t.board), t.level))} syllabus. Taken ${esc(tDate(t))}. Total ${sc.right} / ${sc.n} (${sc.pct}%), grade ${sc.grade}.</p><table><tr><th>Subject</th><th>Marks</th><th>%</th><th>Grade</th></tr>${sc.R.map((r) => `<tr><td>${esc(SUBJ[r.s])}</td><td>${r.right} / ${r.n}</td><td>${r.pct}%</td><td>${r.grade}</td></tr>`).join("")}</table>`;
}
