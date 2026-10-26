/* ---------- chat-style answers to Claude's questions when sorting ---------- */
function dumpChat(D_) {
  const Q = D_.questions || [],
    C = D_.chat || [];
  if (!Q.length && !C.length) return "";
  return `<div class="chat">${C.map((c) => `<div class="bub cl">${esc(c.q)}</div><div class="bub me">${esc(c.a)}</div>`).join("")}${Q.map((q, i) => `<div class="bub cl">${esc(q)}</div><div class="qa"><input class="inp" id="qa-${i}" data-qa="${i}" placeholder="Type your answer" autocomplete="off"><button class="btn sm" data-act="qsend" ${D_.busy ? "disabled" : ""}>Send</button></div>`).join("")}${Q.length ? `<p class="xs muted">Skip any you'd rather not answer.</p>` : ""}</div>`;
}
function qSend() {
  const D_ = (ui.dump = ui.dump || {}),
    Q = D_.questions || [],
    ans = Q.map((q, i) => [q, (document.getElementById("qa-" + i)?.value || "").trim()]).filter(([, a]) => a);
  if (!ans.length) {
    toast("Type an answer first");
    return;
  }
  D_.chat = [...(D_.chat || []), ...ans.map(([q, a]) => ({ q, a }))];
  if (D_.local) {
    const left = [];
    (D_.asks || []).forEach((a, i) => {
      const v = (document.getElementById("qa-" + i)?.value || "").trim();
      if (!v) {
        left.push(a);
        return;
      }
      const it = D_.items[a.i];
      if (!it) return;
      if (a.need === "ampm") {
        if (/eve|night|pm|after/i.test(v)) {
          it.start = clock24(hm(it.start) + 720);
          if (it.end) it.end = clock24((hm(it.end) + 720) % 1440);
        }
      } else if (a.need === "days") {
        const d = recurring(v.includes("every") || dayNames(v).length > 1 ? v : "every " + v) || null,
          dt = d ? null : dateWords(v);
        if (d) {
          it.days = d;
          it.date = null;
        } else if (dt) {
          it.date = dt;
        } else left.push(a);
      } else if (a.need === "time") {
        const w = whenOf(/\d/.test(v) && !/at|from/.test(v) ? "at " + v : v);
        if (w.start) {
          it.start = w.start;
          it.end = w.end || clock24(hm(w.start) + (w.dur || 60));
          const ap = ampmGuess(v, it);
          if (ap === "pm") {
            it.start = clock24(hm(it.start) + 720);
            it.end = clock24(hm(it.end) + 720);
          }
        } else left.push(a);
      }
    });
    D_.asks = left;
    D_.questions = left.map((a) => a.q);
    sfx("ok");
    render();
    return;
  }
  const ta = document.getElementById("dumpText");
  if (ta) {
    ta.value = ((ta.value || D_.text || "").trim() + "\n" + ans.map(([q, a]) => `${q} ${a}`).join("\n")).trim();
  }
  D_.questions = [];
  runDump();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.dataset?.qa !== undefined) {
    e.preventDefault();
    qSend();
  }
});

const WKID = (id) => /^(e|a|exp|act)\d+$|^proj$|^st\d+_\d+$/.test(id);
const WK = () => S.wk || (S.wk = {});
function fixWork() {
  if (S.work && !Array.isArray(S.work)) {
    const ph = [],
      wk = {};
    Object.entries(S.work).forEach(([k, v]) => {
      if (/^\d+$/.test(k) && v && v.id) ph.push(v);
      else if (k.includes("|") && v && v.st) wk[k] = v;
    });
    S.wk = { ...wk, ...(S.wk || {}) };
    S.work = ph;
  }
}
const wkOf = (k, id) => {
  const w = WK()[k + "|" + id];
  if (w) return w;
  const t = S.tasks[k]?.[id];
  return t ? { st: "done", done: t } : null;
};
function wkTitle(u, id, text) {
  if (u.c?.p) {
    const [, x] = pkFind(u, id);
    if (x) return x.title;
  }
  if (id === "proj" && u.c?.proj) return u.c.proj[0];
  const m = /^(exp|act)(\d+)$/.exec(id);
  if (m) {
    const s = (m[1] === "exp" ? u.c?.exp : u.c?.act)?.[+m[2]];
    if (s) return s.split(":")[0].slice(0, 70);
  }
  return text;
}
function workCtl(u, id, text) {
  const w = wkOf(u.k, id),
    st = w?.st === "planned" ? null : w?.st,
    ty = wType(u, id),
    t = esc(wkTitle(u, id, text)),
    a = (to, l, cls) =>
      `<button class="${cls === "link" ? "link xs" : "btn xs " + cls}" data-act="wkst" data-k="${u.k}" data-id="${id}" data-to="${to}" data-t="${t}">${l}</button>`;
  const s = st === "done" ? "done" : st === "started" ? "going" : st === "skip" ? "skip" : "none",
    line =
      st === "done"
        ? `Completed ${fmt(w.done)}${w.started && w.started !== w.done ? ` · started ${fmt(w.started)}` : ""} ✓`
        : st === "started"
          ? `Ongoing · started ${fmt(w.started)}`
          : st === "skip"
            ? "Not doing this"
            : "Not started";
  return `<div class="wkctl ${st || ""}"><span class="xs"><b>${esc(line)}</b>${qTag(ty, u, id, s)}</span><div class="row" style="gap:6px;flex-wrap:wrap">${st === "done" ? a("undo", "Undo", "link") : st === "skip" ? a("none", "Undo", "link") : st === "started" ? a("done", "Mark finished", "accent") + a("none", "Clear", "link") + qCtl(ty, u, id, s) : qCtl(ty, u, id, s) + a("started", "Mark started", "soft") + a("done", "Finished", "accent") + a("skip", "Not doing this", "link")}</div></div>`;
}
function quizBtns(k, n, i, q) {
  const r = S.quiz?.[k + "|" + n]?.[i]?.r,
    b = (v, l) =>
      `<button class="btn xs ${r === v ? (v ? "accent" : "soft") : ""}" aria-pressed="${r === v}" data-act="qz" data-k="${k}" data-n="${n}" data-i="${i}" data-r="${v}" data-q="${esc(q.q)}" data-a="${esc(q.a)}">${l}</button>`;
  return `<div class="row" style="gap:6px;margin:4px 0 8px">${b(1, "Got it")}${b(0, "Not yet")}</div>`;
}
const padKey = (p) => "dk-pad-" + (ACC || "guest") + "-" + p;
function ansHtml(it, v, pad) {
  try {
    return ansHtml_(it, v, pad);
  } catch (e) {
    return `<p class="sm">${esc(typeof v === "object" ? JSON.stringify(v) : String(v))}</p>`;
  }
}
function ansHtml_(it, v, pad) {
  const no = `<p class="xs muted">Not answered</p>`,
    ok = (b) => (b ? ` <span class="fok">✓</span>` : ` <span class="fno">✗</span>`);
  if (it.t === "draw") {
    const im = pad && lsGet(padKey(pad));
    return im ? `<img class="fimg" src="${im}" alt="Drawing">` : v ? `<p class="sm">Drawn on paper ✓</p>` : no;
  }
  if (v === undefined || v === "" || (typeof v === "object" && !Object.keys(v).length)) return no;
  if (it.t === "mcq")
    return `<p class="sm"><b>${esc(it.opts[v] ?? "")}</b>${ok(v === it.a)}${v !== it.a ? ` <span class="xs muted">Ours: ${esc(it.opts[it.a])}</span>` : ""}</p>`;
  if (it.t === "fill")
    return `<p class="sm"><b>${[]
      .concat(v)
      .map((x) => esc(x || "—"))
      .join(" · ")}</b> <span class="xs muted">Ours: ${esc(it.a.join(" · "))}</span></p>`;
  if (it.t === "write") return `<p class="sm fans">${esc(v).replace(/\n/g, "<br>")}</p>`;
  if (it.t === "table")
    return `<table class="ftab"><tr>${it.cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr>${Array.from({ length: it.rows }, (_, r) => `<tr>${it.cols.map((_, ci) => `<td>${esc(v[r + "." + ci] ?? (ci === 0 && it.prefill ? it.prefill[r] || "" : ""))}</td>`).join("")}</tr>`).join("")}</table>`;
  if (it.t === "sort")
    return `<ul class="sm">${it.cats
      .map(
        (c, ci) =>
          `<li><b>${esc(c)}:</b> ${
            it.items
              .filter((z) => v[z] === ci)
              .map(esc)
              .join(", ") || "—"
          }</li>`,
      )
      .join("")}</ul>`;
  if (it.t === "match")
    return `<ul class="sm">${it.pairs.map(([l, r]) => `<li>${esc(l)} → <b>${esc(v[l] ?? "—")}</b>${v[l] !== undefined ? ok(v[l] === r) : ""}</li>`).join("")}</ul>`;
  return `<p class="sm">${esc(JSON.stringify(v))}</p>`;
}
function folderData() {
  const keys = new Set([
      ...S.log.map((l) => l.key),
      ...Object.keys(S.ans || {}).map((k) => k.split("#")[0]),
      ...Object.keys(S.quiz || {}).map((k) => k.slice(0, k.lastIndexOf("|"))),
      ...Object.keys(WK()).map((k) => k.slice(0, k.lastIndexOf("|"))),
      ...Object.keys(S.tasks || {}).map((k) => k.split("#")[0]),
    ]),
    out = [];
  [...keys]
    .map(unitByK)
    .filter(Boolean)
    .forEach((u) => {
      const P = u.c?.p,
        ws = [],
        qz = [],
        pj = [];
      const addWs = (k, title, tier, W) => {
        const c = wsCount(k, W);
        if (!c.ans && !taskDone(k, "ws")) return;
        ws.push({ k, title, tier, W, ...c, fin: S.tasks[k]?.ws || "" });
      };
      (P?.worksheets || []).forEach((w) => addWs(u.k + "#" + w.id, w.title, w.tier, w.sections));
      if (u.c?.x?.wsd) addWs(u.k, "Chapter worksheet", "", u.c.x.wsd);
      Object.entries(S.quiz || {}).forEach(([k, q]) => {
        if (k.slice(0, k.lastIndexOf("|")) !== u.k) return;
        const n = +k.slice(k.lastIndexOf("|") + 1),
          its = Object.entries(q)
            .sort((a, b) => a[0] - b[0])
            .map(([, x]) => x);
        if (its.length)
          qz.push({
            n,
            its,
            d: its
              .map((x) => x.d)
              .sort()
              .pop(),
          });
      });
      qz.sort((a, b) => a.n - b.n);
      const ids = new Set([
        ...Object.keys(WK())
          .filter((k) => k.slice(0, k.lastIndexOf("|")) === u.k)
          .map((k) => k.slice(k.lastIndexOf("|") + 1)),
        ...Object.keys(S.tasks[u.k] || {}).filter(WKID),
      ]);
      ids.forEach((id) => {
        const w = wkOf(u.k, id);
        if (w) pj.push({ id, title: w.title || wkTitle(u, id, id), ...w });
      });
      if (ws.length || qz.length || pj.length) out.push({ u, ws, qz, pj });
    });
  return out.sort(
    (a, b) =>
      SUBJ_KEYS.indexOf(a.u.subj) - SUBJ_KEYS.indexOf(b.u.subj) || a.u.level - b.u.level || (a.u.n || 0) - (b.u.n || 0),
  );
}
function folderBody(F, flat) {
  if (!F.length)
    return `<p class="note">Nothing here yet. Finished worksheets, quiz answers and projects collect here as you go.</p>`;
  return F.map(({ u, ws, qz, pj }, ci) => {
    const inner = `${ws.map((w) => `<div class="fws"><h4>${esc(w.title)}${w.tier ? ` <span class="xs muted">(${esc(TIER[w.tier] || "")})</span>` : ""}</h4><p class="xs muted">${w.fin ? "Finished " + fmt(w.fin) : "In progress"} · ${w.ans} of ${w.tot} answered</p>${w.W.map(([sn, its], si) => `<p class="xs eyebrow">${esc(sn)}</p><ol class="fq">${its.map((it, ii) => `<li><p class="sm">${esc(it.p)}</p>${ansHtml(it, A(w.k, si + "-" + ii), w.k + "|" + si + "-" + ii)}</li>`).join("")}</ol>`).join("")}</div>`).join("")}
    ${qz.map((q) => `<div class="fws"><h4>Quiz · Part ${q.n}</h4><p class="xs muted">${q.d ? fmt(q.d) + " · " : ""}${q.its.filter((x) => x.r).length} of ${q.its.length} got it</p><ol class="fq">${q.its.map((x) => `<li><p class="sm"><b>${esc(x.q)}</b> ${x.r ? `<span class="fok">Got it</span>` : `<span class="fno">Not yet</span>`}</p><p class="xs muted">${esc(x.a)}</p></li>`).join("")}</ol></div>`).join("")}
    ${pj.length ? `<div class="fws"><h4>Activities, experiments and projects</h4><ul class="sm">${pj.map((p) => `<li><b>${esc(p.title)}</b> · ${p.st === "done" ? `finished ${fmt(p.done)}${p.started && p.started !== p.done ? `, started ${fmt(p.started)}` : ""}` : p.st === "started" ? `started ${fmt(p.started)}, not finished` : `in the pipeline since ${fmt(p.planned)}`}</li>`).join("")}</ul></div>` : ""}`;
    const head = esc(chT(u)),
      meta = `${esc(SUBJ[u.subj])} · ${[ws.length && ws.length + " worksheet" + (ws.length > 1 ? "s" : ""), qz.length && qz.length + " quiz" + (qz.length > 1 ? "zes" : ""), pj.length && pj.length + " project" + (pj.length > 1 ? "s" : "")].filter(Boolean).join(" · ")}`;
    return flat
      ? `<section><h3>${head}</h3><p class="xs muted">${meta}</p>${inner}</section>`
      : `<details class="card fch" ${ci === 0 ? "open" : ""}><summary><b>${head}</b><br><span class="xs muted">${meta}</span></summary>${inner}</details>`;
  }).join("");
}
function folderView() {
  document.getElementById("sheetTitle").textContent = "Work folder";
  const F = folderData();
  return `<p class="sm muted">Every worksheet with your child's answers, every quiz, and every project with its dates. Read it here any time, or save a copy.</p><div class="row" style="gap:10px;flex-wrap:wrap"><button class="btn accent sm" data-act="fsave" ${F.length ? "" : "disabled"}>Save a copy (.html)</button><button class="btn soft sm" data-act="fprint" ${F.length ? "" : "disabled"}>Print or save as PDF</button></div><p class="xs muted">Drawings made on screen are kept on this device.</p>${folderBody(F, false)}`;
}
function folderDoc(F0) {
  const F = F0 || folderData(),
    who = S.child || "My child";
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(who)} · DeepKids work folder</title><style>body{font:15px/1.5 system-ui,sans-serif;color:#2b2340;max-width:760px;margin:24px auto;padding:0 16px}h1{font-size:24px}h3{margin:28px 0 2px;font-size:19px;border-top:2px solid #eee;padding-top:16px}h4{margin:14px 0 2px}.xs{font-size:12px}.sm{font-size:14px}.muted{color:#776f8a}.eyebrow{font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin:10px 0 2px}ol,ul{padding-left:22px}li{margin:6px 0}p{margin:2px 0}.fok{color:#2e6b45;font-weight:700}.fno{color:#a0522d;font-weight:700}.fimg{max-width:320px;border:1px solid #ddd;border-radius:8px}table{border-collapse:collapse;font-size:13px}td,th{border:1px solid #ccc;padding:4px 8px;text-align:left}.fans{background:#f6f3ee;padding:6px 10px;border-radius:8px}</style></head><body><h1>${esc(who)}'s work folder</h1><p class="muted">DeepKids · saved ${esc(fmt(today))}</p>${folderBody(F, true)}</body></html>`;
}
async function folderSave() {
  return saveDoc(folderDoc(), `DeepKids work folder ${today}.html`);
}
function folderPrint() {
  printDoc(folderDoc());
}

const quizList = (k, n, Q) =>
  `<ol class="sm qzl">${Q.map((q, qi) => `<li><b>${esc(q.q)}</b><details><summary class="xs muted">Answer</summary><p class="sm">${esc(q.a)}</p></details>${quizBtns(k, n, qi, q)}</li>`).join("")}</ol>${((u) => (u ? stateCtl("qz", u, "q" + n) : ""))(unitByK(k))}`;
function wsCount(k, W) {
  let tot = 0,
    ans = 0;
  W.forEach(([_, its], si) =>
    its.forEach((it, ii) => {
      tot++;
      const v = A(k, si + "-" + ii);
      if (v !== undefined && v !== "" && !(typeof v === "object" && !Object.keys(v).length)) ans++;
    }),
  );
  return { tot, ans };
}
function refParts(u, id) {
  const P = u.c?.p;
  if (!P) return [];
  return P.days.filter((d) => d.steps.some((s) => s.ref === id)).map((d) => d.n);
}
function openWork() {
  const seen = new Set([
      ...S.log.map((l) => l.key),
      ...Object.keys(S.progress || {}).filter((k) => (S.progress[k].sessions || 0) > 0),
    ]),
    us = [...seen].map(unitByK).filter(Boolean),
    O = { wsGoing: [], wsMissed: [], going: [], finish: [], soon: [], started: [], planned: [] },
    held = new Set();
  us.forEach((u) => {
    const P = u.c?.p,
      dn = done(u.k);
    (P?.worksheets || []).forEach((w) => {
      const k = u.k + "#" + w.id;
      if (taskDone(k, "ws")) return;
      const c = wsCount(k, w.sections);
      if (c.ans > 0) O.wsGoing.push({ u, w, ...c });
      else if ((w.day || 99) <= dn) O.wsMissed.push({ u, w, ...c });
    });
    if (u.c?.x?.wsd && !taskDone(u.k, "ws")) {
      const c = wsCount(u.k, u.c.x.wsd);
      if (c.ans > 0) O.wsGoing.push({ u, w: { id: "", title: "Chapter worksheet", tier: "" }, ...c });
    }
    [...(P?.experiments || []), ...(P?.activities || [])].forEach((e) => {
      const R = refParts(u, e.id);
      if (R.length < 2 || taskDone(u.k, e.id) || ["planned", "skip"].includes(WK()[u.k + "|" + e.id]?.st)) return;
      const a = R[0],
        z = R[R.length - 1];
      if (a <= dn && dn < z) {
        O.going.push({ u, e, a, z, next: R.find((r) => r > dn) });
        held.add(u.k + "|" + e.id);
      } else if (dn >= z) {
        O.finish.push({ u, e, a, z });
        held.add(u.k + "|" + e.id);
      }
    });
  });
  Object.entries(WK()).forEach(([key, w]) => {
    if (held.has(key) || w.st === "done") return;
    const j = key.lastIndexOf("|"),
      u = unitByK(key.slice(0, j));
    if (!u) return;
    const x = { u, id: key.slice(j + 1), w };
    if (w.st === "started") O.started.push(x);
    else if (w.st === "planned") O.planned.push(x);
  });
  S.subjects.forEach((s) =>
    schedule(s, 28).forEach((x) => {
      const P = x.u.c?.p;
      if (!P) return;
      [...(P.experiments || []), ...(P.activities || [])].forEach((e) => {
        const R = refParts(x.u, e.id);
        if (R.length >= 2 && R[0] === x.n && !taskDone(x.u.k, e.id) && !WK()[x.u.k + "|" + e.id])
          O.soon.push({ u: x.u, e, date: x.date, n: x.n, z: R[R.length - 1], prep: pkDay(x.u, x.n).prep || [] });
      });
    }),
  );
  O.soon.sort((a, b) => (a.date < b.date ? -1 : 1));
  return O;
}
const openCount = () => {
  const O = openWork();
  return (
    O.wsGoing.length +
    O.wsMissed.length +
    O.going.length +
    O.finish.length +
    O.started.length +
    O.planned.length +
    (S.exps || []).filter((e) => !e.closed).length
  );
};
function todoView() {
  document.getElementById("sheetTitle").textContent = "To finish";
  const O = openWork(),
    ex = (S.exps || []).filter((e) => !e.closed),
    wsRow = (x, miss) =>
      `<div class="pk"><span class="eyebrow">${esc(chT(x.u))} · ${esc(SUBJ[x.u.subj])}</span><b>${esc(x.w.title)}${x.w.tier ? ` <span class="xs muted">(${esc(TIER[x.w.tier] || "")})</span>` : ""}</b><p class="xs muted">${miss ? `Planned for Part ${x.w.day}, which you've done · not started` : `${x.ans} of ${x.tot} questions answered`}</p><div class="row"><button class="btn accent sm" data-act="ws" data-k="${x.u.k}" ${x.w.id ? `data-w="${esc(x.w.id)}"` : ""}>${miss ? "Start it" : "Continue"}</button></div></div>`;
  const sec = (t, n, body, empty) =>
      `<section class="sec"><div class="sech"><h3 style="font-size:18px">${t}</h3><span class="pill">${n}</span></div>${n ? body : `<p class="xs muted">${empty}</p>`}</section>`,
    wkRow = (x) =>
      `<div class="pk"><span class="eyebrow">${esc(chT(x.u))} · ${esc(SUBJ[x.u.subj])}</span><b>${esc(x.w.title || wkTitle(x.u, x.id, ""))}</b>${taskLine(x.u, x.id, x.w.title)}<div class="row"><button class="link xs" data-act="chapter" data-k="${x.u.k}" data-t="lab">Open in the chapter</button></div></div>`;
  let h = `<p class="sm muted">Everything left open, in one place. Tick things off where they are, or open them from here.</p><button class="link" data-act="folder" style="justify-self:start">Work folder: everything finished, with answers →</button>`;
  h += sec("Worksheets started", O.wsGoing.length, O.wsGoing.map((x) => wsRow(x, false)).join(""), "None half-done.");
  h += sec(
    "Worksheets missed",
    O.wsMissed.length,
    O.wsMissed.map((x) => wsRow(x, true)).join(""),
    "No worksheets left behind from finished parts.",
  );
  h += sec(
    "Projects underway",
    O.going.length + O.started.length + ex.length + O.finish.length,
    [
      ...O.started.map(wkRow),
      ...O.going.map(
        (x) =>
          `<div class="pk"><span class="eyebrow">${esc(chT(x.u))} · Parts ${x.a}–${x.z}</span><b>${esc(x.e.title)}</b><p class="xs muted">Runs from Part ${x.a}. Next check-in: Part ${x.next}.</p>${taskLine(x.u, x.e.id, x.e.title)}</div>`,
      ),
      ...O.finish.map(
        (x) =>
          `<div class="pk"><span class="eyebrow">${esc(chT(x.u))} · Parts ${x.a}–${x.z}</span><b>${esc(x.e.title)}</b><p class="xs muted">All its parts are done. Mark it finished when the result is recorded.</p>${taskLine(x.u, x.e.id, x.e.title)}</div>`,
      ),
      ...ex.map((e) => {
        const day = Math.round((parse(today) - parse(e.start)) / 864e5) + 1,
          c = e.checks.includes(today);
        return `<div class="pk"><span class="eyebrow">Tracking daily · day ${day}</span><b>${esc(e.title)}</b><p class="xs muted">${esc(e.topic || "")}${c ? " · checked today" : ""}</p><div class="row"><button class="btn soft sm" data-act="check" data-e="${e.id}">${c ? "Checked today ✓" : "Check today"}</button><button class="link xs" data-act="close" data-e="${e.id}">Finish it</button></div></div>`;
      }),
    ].join(""),
    "No projects running right now.",
  );
  h += sec(
    "Your pipeline",
    O.planned.length,
    O.planned.map(wkRow).join(""),
    "Nothing saved for later. Tap “+ Pipeline” on any activity, experiment or project to keep it here.",
  );
  h += sec(
    "Projects coming up",
    O.soon.length,
    O.soon
      .map(
        (x) =>
          `<div class="pk"><span class="eyebrow">${esc(fmt(x.date))} · ${esc(chT(x.u))} · ${x.z > x.n ? `Parts ${x.n}–${x.z}` : `Part ${x.n}`}</span><b>${esc(x.e.title)}</b>${x.e.time ? `<p class="xs muted">${esc(x.e.time)}</p>` : ""}${x.e.need?.length ? `<p class="xs"><b>Get ready:</b> ${x.e.need.map(esc).join(", ")}</p>` : ""}${x.prep.map((q) => `<p class="xs"><b>Prep (${esc(q.when)}):</b> ${esc(q.task)}</p>`).join("")}${taskLine(x.u, x.e.id, x.e.title)}</div>`,
      )
      .join(""),
    "Nothing multi-part starts in the next four weeks.",
  );
  return h;
}
function splitSent(t) {
  const out = [];
  let cur = "",
    q = null;
  for (let i = 0; i < t.length; i++) {
    const c = t[i],
      p = t[i - 1] || " ",
      n = t[i + 1] || " ";
    let closed = false;
    if (!q && (c === "“" || (c === "'" && /[\s:(—-]/.test(p)))) {
      q = c === "“" ? "”" : "'";
    } else if (q && (c === q || (q === "'" && c === "’")) && (q === "”" || /[\s.,!?;:)—-]/.test(n))) {
      q = null;
      closed = true;
    }
    cur += c;
    const end =
      (!q && !closed && /[.!?]/.test(c)) || (closed && /[.!?]/.test(p)) || (!q && c === ")" && /[.!?]/.test(p));
    if (end && /\s/.test(n) && /[A-Z('‘“0-9]/.test(t[i + 2] || "")) {
      out.push(cur.trim());
      cur = "";
    }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function fmtPts(text, plain) {
  if (!text) return "";
  let t = String(text)
    .replace(/\bDays (\d+)\s*(–|-|to|and)\s*(\d+)/g, "Parts $1$2$3")
    .replace(/\bDay (\d+)\b/g, "Part $1")
    .replace(
      /\bDo (Experiment|Activity) [ea]\d+(?:,? [^.]*?)?\.\s*/g,
      (m, k) => `Use the ${k.toLowerCase()} card below. `,
    )
    .replace(/\bDo Worksheet ws\d+(?: \((core|stretch|challenge)\))?\.?/g, "Open the worksheet below.")
    .replace(/\b(?:in |from )?Voice v\d+\b/g, "on the card below")
    .replace(/\bthe ['‘]why['’] of [ea]\d+\b/gi, "'Why it happens' on the card below")
    .replace(/\b(Experiment|Activity) [ea]\d+\b/g, (m, k) => "the " + k.toLowerCase());
  const S = splitSent(t),
    items = [];
  S.forEach((x) => {
    if (/^\(.*\)\.?$/.test(x) && items.length) {
      items[items.length - 1].ans =
        (items[items.length - 1].ans ? items[items.length - 1].ans + " " : "") + x.replace(/^\(|\)\.?$/g, "");
      return;
    }
    const m = x.match(/^(.*?['’”?])\s*\(([^()]+)\)\.?$/);
    if (m && /^(Ask|['‘“])/.test(x)) {
      items.push({ t: m[1], ans: m[2] });
      return;
    }
    items.push({ t: x });
  });
  const ic = (x) =>
    plain
      ? "p-pl"
      : /^Ask:|\bask:\s*['‘“]|^['‘“]|[?]['’”]?$/i.test(x)
        ? "p-ask"
        : /^(Say|Tell|Explain)\b/.test(x)
          ? "p-say"
          : /^(Read|Open|Turn to|Look at)\b/.test(x)
            ? "p-read"
            : /^(If|Note|Be honest|Safety)/.test(x)
              ? "p-note"
              : "p-do";
  return `<ul class="pts">${items.map((x) => `<li class="${ic(x.t)}"><span>${esc(x.t)}</span>${x.ans ? `<span class="ans"><b>Listen for:</b> ${esc(x.ans)}</span>` : ""}</li>`).join("")}</ul>`;
}
let voxQ = [],
  voxDone = [],
  voxOn = false,
  voxPaused = false,
  voxCur = "",
  _vv = null;
function pickVoice() {
  if (!("speechSynthesis" in window)) return null;
  const V = speechSynthesis.getVoices();
  if (!V.length) return null;
  const fem = /female|woman|veena|heera|neerja|kajal|aditi|swara|lekha|priya|isha|google/i,
    male = /\bmale\b|rishi|ravi|prabhat|hemant|madhur|kumar/i,
    en = V.filter((v) => /en[-_]IN/i.test(v.lang));
  return (
    en.find((v) => fem.test(v.name) && !male.test(v.name)) ||
    en.find((v) => !male.test(v.name)) ||
    en[0] ||
    V.find((v) => /^en/i.test(v.lang) && /female|samantha|zira|susan|karen|moira|tessa/i.test(v.name)) ||
    V.find((v) => /^en/i.test(v.lang)) ||
    null
  );
}
if ("speechSynthesis" in window)
  speechSynthesis.onvoiceschanged = () => {
    _vv = null;
  };
const voxRate = () => S.voiceRate || 0.8;
function speak(text) {
  if (!("speechSynthesis" in window)) {
    toast("Read-aloud isn't available on this phone's browser.");
    return;
  }
  speechSynthesis.cancel();
  const parts =
    String(text)
      .replace(/\s+/g, " ")
      .replace(/ ?([·•]) ?/g, ". ")
      .match(/[^.!?।:;]+[.!?।:;]*/g) || [];
  voxQ = parts.map((x) => x.trim()).filter((x) => x.length > 1);
  voxDone = [];
  voxOn = !!voxQ.length;
  voxPaused = false;
  voxNext();
  voxBar();
}
function voxNext() {
  if (!voxOn || voxPaused) return;
  const t = voxQ.shift();
  if (!t) {
    voxOn = false;
    voxBar();
    return;
  }
  voxCur = t;
  voxDone.push(t);
  const u = new SpeechSynthesisUtterance(t),
    v = _vv || (_vv = pickVoice());
  u.lang = v?.lang || "en-IN";
  if (v)
    try {
      u.voice = v;
    } catch (e) {}
  u.rate = voxRate();
  u.pitch = 1.05;
  u.onend = () => {
    if (voxCur === t) setTimeout(voxNext, S.voiceGap ?? 450);
  };
  u.onerror = () => {
    if (voxCur === t && !voxPaused) setTimeout(voxNext, 50);
  };
  speechSynthesis.speak(u);
  voxBar();
}
function voxCtl(c) {
  if (c === "stop") {
    voxOn = false;
    voxQ = [];
    voxPaused = false;
    voxCur = "";
    speechSynthesis.cancel();
    voxBar();
    return;
  }
  if (c === "pause") {
    if (!voxPaused) {
      voxPaused = true;
      if (voxDone.length) voxQ.unshift(voxDone.pop());
      voxCur = "";
      speechSynthesis.cancel();
    } else {
      voxPaused = false;
      voxNext();
    }
    voxBar();
    return;
  }
  if (c === "back") {
    const cur = voxDone.pop(),
      prev = voxDone.pop();
    if (cur) voxQ.unshift(cur);
    if (prev) voxQ.unshift(prev);
    voxCur = "";
    speechSynthesis.cancel();
    voxPaused = false;
    voxNext();
    return;
  }
  if (c === "skip") {
    voxCur = "";
    speechSynthesis.cancel();
    voxPaused = false;
    voxNext();
    return;
  }
  if (c === "slower" || c === "faster") {
    S.voiceRate = Math.round(Math.min(1.3, Math.max(0.5, voxRate() + (c === "faster" ? 0.1 : -0.1))) * 10) / 10;
    save();
    if (voxOn && !voxPaused) {
      if (voxDone.length) voxQ.unshift(voxDone.pop());
      voxCur = "";
      speechSynthesis.cancel();
      voxNext();
    }
    voxBar();
  }
}
function voxBar() {
  let b = document.getElementById("voxbar");
  if (!voxOn && !voxPaused) {
    if (b) b.remove();
    return;
  }
  if (!b) {
    b = document.createElement("div");
    b.id = "voxbar";
  }
  const host = sheet.open ? sheet : document.body;
  if (b.parentNode !== host) host.appendChild(b);
  b.innerHTML = `<span class="vt">${voxPaused ? "Paused" : "Reading"} · ${voxRate().toFixed(1)}×</span><button data-vox="back" aria-label="Repeat the last sentence">⏮</button><button data-vox="pause" aria-label="${voxPaused ? "Resume" : "Pause"}">${voxPaused ? "▶" : "⏸"}</button><button data-vox="skip" aria-label="Next sentence">⏭</button><button data-vox="slower" aria-label="Slower">🐢</button><button data-vox="faster" aria-label="Faster">🐇</button><button data-vox="stop" aria-label="Stop reading">✕</button>`;
}
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest("[data-vox]");
    if (b) {
      e.preventDefault();
      e.stopPropagation();
      voxCtl(b.dataset.vox);
    }
  },
  true,
);
function readable(el) {
  if (!el) return "";
  const c = el.cloneNode(true);
  c.querySelectorAll(
    ".spent,.secbar,.kind,button,.ptrack,svg,.tasks-inline,summary,.xs.muted,#voxbar,.readbtn",
  ).forEach((x) => x.remove());
  c.querySelectorAll("h1,h2,h3,p,li,.ask,.src b,.src span,.eyebrow,.idea,.kv span,.kv b").forEach((x) =>
    x.append(" ¶ "),
  );
  return (c.textContent || "")
    .replace(/\s*¶\s*/g, ". ")
    .replace(/([.!?:;])\s*\.\s/g, "$1 ")
    .replace(/\.\s*\./g, ".")
    .replace(/[📖✨🔊]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
function readNow() {
  if (sheet.open) {
    const st = document.querySelector("#sheetBody .stage");
    if (st) return speak(readable(st));
    return speak(
      document.getElementById("sheetTitle").textContent + ". " + readable(document.getElementById("sheetBody")),
    );
  }
  speak(readable(document.getElementById("main")));
}
function autoRead() {
  if (S.autoRead && sheet.open && ui.sheet?.mode === "player")
    setTimeout(() => {
      const st = document.querySelector("#sheetBody .stage");
      if (st) speak(readable(st));
    }, 250);
}
function isNextUp(u) {
  return ((S.next || {})[u.subj] || [])[0] === u.k;
}
function nextMsg(s, k) {
  _sess = null;
  const sc = schedule(s, 60)[0],
    u = unitBy(k);
  if (sc && sc.u.k === k)
    return sc.date === today
      ? `Done. Today's ${SUBJ[s]} lesson is now ${chT(sc.u)}, Part ${sc.n} of ${sc.tot}.`
      : `Done. ${chT(sc.u)} is your next ${SUBJ[s]} lesson, on ${fmt(sc.date)}.`;
  return `Done. ${chT(u)} is now first in the ${SUBJ[s]} queue.`;
}

const ACTN = {
  read: "reading",
  talk: "talking",
  think: "thinking",
  warmup: "warm-up",
  do: "activity",
  act: "activity",
  outdoor: "outdoor activity",
  exp: "experiment",
  ws: "worksheet",
  check: "quiz",
  review: "review",
  game: "game",
  watch: "video",
};
function srcOf(s) {
  const t = (s.title || "") + " · " + (s.do || ""),
    m = [...t.matchAll(/\b(?:pages?|pp?\.?)\s?(\d{1,3})(?:\s*(?:–|-|to|and)\s*(\d{1,3}))?/gi)],
    raw = [...new Set(m.map((x) => (x[2] ? x[1] + "–" + x[2] : x[1])))],
    rng = raw.filter((p) => p.includes("–")).map((p) => p.split("–").map(Number)),
    pages = raw.filter((p) => p.includes("–") || !rng.some(([a, b]) => +p >= a && +p <= b));
  return {
    book:
      (pages.length > 0 || /\bthe book['’]s\b|\bActivity \d+\.\d+|\bin the book\b|\bLearner['’]s Book\b/i.test(t)) &&
      !/\bwithout the book\b/i.test(t),
    pages,
  };
}
function srcLine(s) {
  const { book, pages } = srcOf(s),
    a = ACTN[s.kind] || "step",
    pg = pages.length ? ` · page${pages.length > 1 || pages[0].includes("–") ? "s" : ""} ${pages.join(", ")}` : "";
  return book
    ? `<div class="src book"><b>📖 Book step${pg}</b><span>Open the textbook now${pages.length ? " at " + (pages.length > 1 || pages[0].includes("–") ? "these pages" : "this page") : ""}.</span></div>`
    : `<div class="src dk"><b>✨ DeepKids step · ${a}</b><span>Book closed for this one. Everything is on this screen.</span></div>`;
}
function chT(u) {
  if (!u) return "";
  const pre =
    u.board === "waldorf"
      ? u.subj === "wart"
        ? ""
        : "Block " + u.n
      : u.board === "ncert"
        ? "Ch " + u.n
        : u.board === "cambridge"
          ? /^\d+$/.test(u.n)
            ? "Unit " + u.n
            : ""
          : u.board === "nios"
            ? "Lesson " + u.n
            : u.board === "dk"
              ? u.n
              : "";
  return (pre ? pre + " · " : "") + u.title;
}
let stepT = null;
const stepKeyNow = () => (ui.sheet?.mode === "player" ? ui.sheet.k + "|" + ui.sheet.n + "|" + ui.sheet.i : "");
function stepSecs() {
  const k = stepKeyNow();
  if (!k) return 0;
  if (!stepT || stepT.k !== k) stepT = { k, t0: Date.now() };
  return (Date.now() - stepT.t0) / 1000;
}
setInterval(() => {
  const e = document.getElementById("spent");
  if (e && sheet.open) e.textContent = mmss(stepSecs());
}, 1000);

const SECS = [
    ["book", "The lesson"],
    ["ideas", "Big ideas"],
    ["lab", "Try it"],
    ["views", "Other views"],
    ["ws", "Worksheet"],
    ["quiz", "Quick quiz"],
  ],
  SECN = Object.fromEntries(SECS);
function stepSec(u, s) {
  const [g] = s.ref ? pkFind(u, s.ref) : [];
  if (g === "worksheets") return "ws";
  if (g === "voices") return "views";
  if (g === "experiments" || g === "activities") return "lab";
  if (s.kind === "check" || s.kind === "review") return "quiz";
  if (s.kind === "ws") return "ws";
  if (s.kind === "think") return "ideas";
  if (["exp", "act", "game", "outdoor"].includes(s.kind)) return "lab";
  if (s.kind === "do") return /page/i.test(s.do) ? "book" : "lab";
  return "book";
}
function secBar(st, i) {
  const ord = SECS.map((s) => s[0]),
    G = [];
  st.forEach((x, j) => {
    const s = x.sec || "book";
    let g = G.find((g) => g.s === s);
    if (!g) G.push((g = { s, first: j, n: 0, ok: 0 }));
    g.n++;
    if (x.ok) g.ok++;
  });
  G.sort((a, b) => ord.indexOf(a.s) - ord.indexOf(b.s));
  const cur = i >= st.length ? "fin" : st[i].sec || "book";
  return `<div class="secbar">${G.map((g, k) => `<button class="secchip ${g.s === cur ? "on" : ""} ${g.ok === g.n ? "ok" : ""}" data-act="pjump" data-i="${g.first}"><span class="n">${g.ok === g.n ? "✓" : k + 1}</span><span class="l">${SECN[g.s]}</span><small>${g.ok}/${g.n}</small></button>`).join("")}<button class="secchip ${cur === "fin" ? "on" : ""}" data-act="pjump" data-i="${st.length}"><span class="n">★</span><span class="l">Finish</span></button></div>`;
}
function historyView() {
  document.getElementById("sheetTitle").textContent = "Everything done";
  const L = S.log.filter((l) => l.kind !== "free" || l.title);
  if (!L.length)
    return `<p class="note">Lessons you finish are listed here, newest first, with the time and day of the chapter.</p>`;
  const by = {};
  L.forEach((l) => (by[l.date] = by[l.date] || []).push(l));
  const dates = Object.keys(by).sort().reverse(),
    chs = new Set(L.map((l) => l.key));
  return (
    `<p class="sm muted">${L.length} lesson${L.length === 1 ? "" : "s"} across ${chs.size} chapter${chs.size === 1 ? "" : "s"} and ${dates.length} day${dates.length === 1 ? "" : "s"}. Tap any to open the chapter.</p>` +
    dates
      .map(
        (d) =>
          `<section class="card" style="gap:0"><span class="eyebrow">${d === today ? "Today · " : d === addDays(today, -1) ? "Yesterday · " : ""}${esc(fmt(d))}</span>${by[
            d
          ]
            .slice()
            .sort((a, b) => (a.at ?? 9999) - (b.at ?? 9999))
            .map((l) => {
              const u = unitByK(l.key);
              return `<button class="plain hrow" ${u ? `data-act="chapter" data-k="${esc(l.key)}"` : ""}><span class="t num">${l.at != null ? clock(l.at) : "–"}</span><span style="min-width:0"><b>${esc(u ? chT(u) : l.title)}</b><br><span class="xs muted">${esc(SUBJ[l.subj] || "")}${l.n ? " · Part " + l.n + (u ? " of " + sessionsFor(u) : "") : ""}${u ? " · " + esc(unitLabel(u).split(" · ")[0]) : ""}</span></span>${u ? icon("next") : ""}</button>`;
            })
            .join("")}</section>`,
      )
      .join("")
  );
}

function refreshViewV0() {
  const date = ui.sheet.date || today,
    it = dayPlan(date).find((i) => i.id === "refresh");
  document.getElementById("sheetTitle").textContent = "Refresher";
  if (!it)
    return `<p class="note">No refresher today. It starts the day after your first lesson, and follows the refresher settings.</p><button class="link" data-act="rfset">Refresher settings and lists →</button>`;
  const r = it.rf;
  if (date === today && !S.rfp?.[date]) {
    S.rfp = { ...(S.rfp || {}), [date]: r };
    save();
  }
  const ra = S.rfa?.[date] || {};
  return (
    `<p class="sm muted">About ${r.mins} minutes, from: ${r.topics.map((t) => `<b>${esc(unitByK(t.k)?.title || "")}</b> (${MGN[t.g]})`).join(", ")}.</p>` +
    r.slots
      .map((s, i) => {
        const u = unitByK(s.k);
        return `<section class="card"><span class="eyebrow">${i + 1} · ${RTN[s.ty]} · ${esc(u ? chT(u) : "")}</span>${s.ty === "qz" ? qCard(s.q, ra[s.q.id]) : `<b style="font:600 17px var(--display)">${esc(s.title)}</b>${s.body ? fmtPts(s.body) : ""}${s.words?.length ? `<div class="kv">${s.words.map(([w, m]) => `<span>${esc(w)}</span><b style="font-weight:400">${esc(m)}</b>`).join("")}</div>` : ""}${s.need?.length ? `<p class="sm"><b>You need:</b> ${s.need.map(esc).join(", ")}</p>` : ""}${s.steps?.length ? pkList(s.steps, "ol") : ""}${s.ask ? `<div class="ask">${esc(s.ask)}</div>` : ""}`}</section>`;
      })
      .join("") +
    `<div class="row"><button class="btn green wide" data-act="tlcheck" data-id="refresh" data-date="${date}">${icon("check")}${it.done ? "Done ✓" : "We did it"}</button></div><button class="link" data-act="rfset">Refresher settings and lists →</button>`
  );
}
function refreshView() {
  const date = ui.sheet.date || today,
    U = fxRefs(),
    V = fxReviews(date);
  const top =
    U.length || V.length
      ? `<section class="card"><span class="eyebrow">From the units</span>${U.map((x) => `<div class="row" style="justify-content:space-between"><span class="sm">${esc(DATA.units[x.id].title)} · ${x.n} to try again</span><button class="btn sm" data-fxprac="${esc(x.id)}">Try them</button></div>`).join("")}${V.map((x) => `<div class="row" style="justify-content:space-between"><span class="sm">Review: ${esc(DATA.units[x.id].title)}</span><button class="btn soft sm" data-act="fxpart" data-fxrev="${esc(x.id)}" data-u="${esc(x.id)}" data-p="quiz">Retake the quiz</button></div>`).join("")}</section>`
      : "";
  const it = dayPlan(date).find((i) => i.id === "refresh");
  return top + (it?.rf?.fxOnly ? "" : refreshViewV0());
}
function plusFor(u) {
  const ids = new Set([
    ...(u.dk || []),
    ...(DATA.rconcepts || []).filter((c) => c.chapters.includes(u.k)).flatMap((c) => c.plus || []),
  ]);
  if (u.board === "dk") ids.delete(u.n);
  return [...ids]
    .map((id) => DATA.topics.find((t) => t.id === id))
    .filter(Boolean)
    .slice(0, 3);
}
const hubSec = (id, title, count, body, open) =>
  body
    ? `<details class="card hub" ${open ? "open" : ""}><summary><b>${title}</b>${count != null ? `<span class="pill">${count}</span>` : ""}</summary><div class="hubb">${body}</div></details>`
    : "";
function chapterHub(u) {
  const P = u.c?.p,
    x = u.c?.x,
    c = u.c || {},
    plus = plusFor(u),
    res = resSort(resourcesFor(u)),
    shelf = shelfFor(u);
  let h =
    `<div class="sech" style="margin-top:6px"><h3 style="font-size:19px">Everything for this chapter</h3></div>` +
    printSheets(u);
  const ideas = [
    P ? `<p class="sm">${esc(P.summary)}</p>` : c.covers ? `<p class="sm">${esc(c.covers)}</p>` : "",
    P?.goals?.length
      ? `<span class="eyebrow">By the end your child can</span>${pkList(P.goals.map((g) => g.replace(/^By the end your child can\s*/i, "")))}`
      : "",
    x?.learn
      ? `<span class="eyebrow">Big ideas</span>${x.learn.map((l, i) => `<div class="idea"><span class="k">${i + 1}</span><p class="sm">${esc(l)}</p></div>`).join("")}`
      : "",
    P?.words?.length
      ? `<span class="eyebrow">Key words</span><div class="kv">${P.words.map(([w, m]) => `<span>${esc(w)}</span><b style="font-weight:400">${esc(m)}</b>`).join("")}</div>`
      : "",
  ].join("");
  h += hubSec("ideas", "Big ideas and key words", null, ideas, false);
  const pv = [
    ...plus.map(
      (t) =>
        `<div class="pk"><span class="eyebrow">DeepKids Plus · ${esc(t.id)}</span><b>${esc(t.name)}</b><p class="sm">${esc(t.summary)}</p>${t.oneness ? `<div class="ask"><span class="eyebrow">Wonder together</span>${esc(t.oneness)}</div>` : ""}</div>`,
    ),
    ...(x?.deep || []).map(
      (d) =>
        `<div class="pk"><span class="eyebrow">Big question</span><b>${esc(d.q)}</b><p class="sm">${esc(d.why)}</p>${(d.views || []).map(([w, v]) => `<p class="sm"><b>${esc(w)}:</b> ${esc(v)}</p>`).join("")}${d.tryit ? `<p class="sm"><b>Try this:</b> ${esc(d.tryit)}</p>` : ""}</div>`,
    ),
  ].join("");
  h += hubSec("plus", "DeepKids view and big questions", plus.length + (x?.deep?.length || 0) || null, pv, false);
  if (P?.voices?.length)
    h += hubSec(
      "voices",
      "Other scientists and challenging views",
      P.voices.length,
      `<p class="xs muted">Some were laughed at and later proved right; some are still argued over; some turned out wrong.</p>${P.voices.map(pkVoice).join("")}`,
      false,
    );
  const ws = [
    ...(P?.worksheets || []).map((w) => pkWs(u, w)),
    x?.wsd
      ? `<div class="pk"><span class="eyebrow">Chapter worksheet</span><b>${x.wsd.length} sections</b><div class="row"><button class="btn accent sm" data-act="ws" data-k="${u.k}">Open the worksheet</button></div></div>`
      : "",
  ].join("");
  h += hubSec("ws", "Worksheets", (P?.worksheets?.length || 0) + (x?.wsd ? 1 : 0) || null, ws, false);
  const lab = [
    ...(P?.experiments || []).map((e) => pkExp(u, e)),
    ...(P?.activities || []).map((a) => pkAct(u, a)),
    ...(!P
      ? (c.exp || []).map(
          (e) => `<div class="pk"><span class="eyebrow">Experiment</span><p class="sm">${esc(e)}</p></div>`,
        )
      : []),
    ...(!P
      ? (c.act || []).map(
          (e) => `<div class="pk"><span class="eyebrow">Activity</span><p class="sm">${esc(e)}</p></div>`,
        )
      : []),
    c.game
      ? `<div class="pk"><span class="eyebrow">Game</span><b>${esc(c.game[0])}</b><p class="sm">${esc(c.game[1])}</p></div>`
      : "",
    c.proj
      ? `<div class="pk"><span class="eyebrow">Project</span><b>${esc(c.proj[0])}</b><p class="sm">${esc(c.proj[1])}</p></div>`
      : "",
  ].join("");
  h += hubSec("lab", "Experiments, activities and games", null, lab, false);
  const rs = [
    shelf.length ? `<div class="sm"><b>From your shelf:</b> ${shelf.map((i) => esc(i.name)).join(" · ")}</div>` : "",
    ...res
      .slice(0, ui.hubres ? 99 : 6)
      .map(
        (r) =>
          `<a class="res" href="${esc(r.url)}" target="_blank" rel="noopener"><span class="xs muted">${RTYPE[r.type]} · ages ${r.ages[0]}–${r.ages[1]} · ${esc(r.source)} ↗</span><b>${esc(r.title)}</b><span class="xs">${esc(r.desc)}</span></a>`,
      ),
    res.length > 6 && !ui.hubres
      ? `<button class="link xs" data-act="hubres" style="justify-self:start">Show all ${res.length}</button>`
      : "",
    ...(c.read || []).map((r) => `<div class="res"><span class="xs muted">Book</span><b>${esc(r)}</b></div>`),
  ].join("");
  h += hubSec(
    "res",
    "Resources, books and your shelf",
    res.length + shelf.length + (c.read?.length || 0) || null,
    rs,
    false,
  );
  if (P) h += hubSec("days", "All parts of this chapter", P.days.length + " parts", packTab(u, "days"), false);
  if (P?.check?.length)
    h += hubSec(
      "check",
      "End-of-chapter check",
      P.check.length,
      `<ol class="sm">${P.check.map((q) => `<li>${esc(q.q)}<details><summary class="xs muted">Answer</summary><p class="sm">${esc(q.a)}</p></details></li>`).join("")}</ol>`,
      false,
    );
  if (x?.guide) h += hubSec("guide", "Parent guide", null, `<p class="sm">${esc(x.guide)}</p>`, false);
  return h;
}

const BNAME = {
  combined: "Combined",
  ncert: "NCERT",
  cambridge: "Cambridge",
  nios: "NIOS",
  waldorf: "Waldorf",
  dk: "DeepKids Plus",
  gen: "DeepKids",
};
function unitLabel(u) {
  if (!u) return "";
  const L =
    u.board === "ncert" || u.board === "waldorf"
      ? "Class " + u.level
      : u.board === "cambridge"
        ? "Stage " + u.level
        : u.board === "nios"
          ? "Level " + (u.level <= 3 ? "A" : "B")
          : "";
  const n =
    u.board === "ncert"
      ? "Ch " + u.n
      : u.board === "cambridge"
        ? /^\d+$/.test(u.n)
          ? "Unit " + u.n
          : u.n
        : u.board === "nios"
          ? "Lesson " + u.n
          : u.n;
  return `${BNAME[u.board] || ""}${L ? " " + L : ""} · ${u.subj === "sci" ? (u.board === "cambridge" ? "Science" : "EVS") : SUBJ[u.subj] || ""} · ${n} ${u.title}`;
}
let _ubk = null;
const unitByK = (k) => {
  if (!_ubk) {
    _ubk = new Map();
    allUnits().forEach((u) => _ubk.set(u.k, u));
  }
  return _ubk.get(k) || unitBy(k);
};
function chapterRank(u) {
  const mine = boardsOn().includes(u.board) ? 0 : 1,
    lv = S.levels?.[u.subj] || 3;
  return mine * 10 + Math.abs((u.level || lv) - lv);
}
function resChapters(r) {
  const ks = new Set([...(r.chapters || []), ...r.concepts.flatMap((c) => RCON[c]?.chapters || [])]);
  return [...ks]
    .map(unitByK)
    .filter(Boolean)
    .sort((a, b) => chapterRank(a) - chapterRank(b));
}
const chipK = (u) => `<button class="chip xs" data-act="chapter" data-k="${esc(u.k)}">${esc(unitLabel(u))}</button>`;
function lessonExtras(u) {
  const R = resSort(resourcesFor(u)).filter(rFits),
    pick = [],
    seen = new Set();
  for (const r of R) {
    if (seen.has(r.type)) continue;
    seen.add(r.type);
    pick.push(r);
    if (pick.length === 3) break;
  }
  const shelf = shelfFor(u);
  if (!pick.length && !shelf.length) return "";
  return `<div class="extras">${shelf.length ? `<div class="sm"><b style="font-family:var(--display)">From your shelf:</b> ${shelf.map((i) => esc(i.name)).join(" · ")}</div>` : ""}${pick.length ? `<div class="sm"><b style="font-family:var(--display)">Good extras for this chapter</b></div>${pick.map((r) => `<a class="res" href="${esc(r.url)}" target="_blank" rel="noopener"><span class="xs muted">${RTYPE[r.type]} · ${esc(r.source)} ↗</span><b>${esc(r.title)}</b></a>`).join("")}<button class="link xs" data-act="chapter" data-k="${u.k}" data-t="res" style="justify-self:start">All resources for this chapter</button>` : ""}</div>`;
}
const shelfFor = (u) =>
  (S.inv || []).filter(
    (i) => (i.chapters || []).includes(u.k) || (i.concepts || []).some((c) => (RCON[c]?.chapters || []).includes(u.k)),
  );
function invCard() {
  const D_ = ui.idump || {};
  return `<section class="card dump"><div class="row" style="flex-wrap:nowrap;gap:12px">${blob("var(--gum)", 7, "wow", "", 'width="48" height="48"')}<div><h3 style="font-size:19px">Tell us what you have</h3><p class="xs muted">Type a list, say it with your keyboard's mic, or add photos of a shelf, book covers or game boxes. We sort it into books, games and more, and tag each to the chapters it helps with.</p></div></div>
   <textarea class="inp" id="invText" placeholder="Ruskin Bond's The Blue Umbrella, a magnifying glass, Ludo, Snakes and Ladders, a globe, Tinkle comics, a kids' microscope, 2 bar magnets">${esc(D_.text || "")}</textarea>
   <div class="row">${IMGOK ? `<label class="btn soft sm" style="cursor:pointer">${icon("plus")}Photos<input type="file" id="invImg" accept="image/*" multiple hidden></label>` : lockBtn("shelf", "btn soft sm", "📷 Photos")}<span class="xs muted">${D_.files?.length ? D_.files.length + " photo" + (D_.files.length > 1 ? "s" : "") + " added" : ""}</span><button class="btn sm" data-act="isort" style="margin-left:auto" ${D_.busy ? "disabled" : ""}>${D_.busy ? "Sorting…" : "Sort it in"}</button></div>
   ${SAMPLE ? "" : `<p class="xs muted">Sorting needs Claude, which isn't available in this view. Add things one by one below.</p>`}${D_.err ? `<p class="sm" style="color:var(--bad)">${esc(D_.err)}</p>` : ""}
   ${D_.items ? `<div class="col" style="gap:8px">${D_.items.map((it, i) => `<div class="parsed ${it.keep ? "" : "off"}"><button class="ck ${it.keep ? "on" : ""}" data-act="ikeep" data-i="${i}" aria-label="Keep">${icon("check")}</button><div style="min-width:0"><b style="font:600 16px var(--display)">${esc(it.name)}</b><p class="xs muted">${esc([CATS[it.cat] || "Other", it.by, it.kind, it.ages].filter(Boolean).join(" · "))}</p>${(it.chapters || []).length ? `<div class="row chips">${it.chapters.map(unitByK).filter(Boolean).slice(0, 3).map(chipK).join("")}</div>` : ""}</div></div>`).join("")}<div class="row"><button class="btn green" data-act="iadd">${icon("check")}Add ${D_.items.filter((x) => x.keep).length}</button><button class="btn line sm" data-act="iclear">Clear</button></div></div>` : ""}</section>`;
}
function invContext() {
  const keys = [];
  S.subjects.forEach((s) => {
    const lv = S.levels[s];
    allUnits()
      .filter((u) => u.subj === s && ["ncert", "cambridge", "nios"].includes(u.board) && Math.abs(u.level - lv) <= 1)
      .forEach((u) => keys.push(`${u.k} = ${unitLabel(u)}`));
  });
  return keys.slice(0, 260).join("\n");
}
async function runInvSort() {
  const ta = document.getElementById("invText"),
    text = (ta?.value || "").trim(),
    D_ = (ui.idump = ui.idump || {});
  D_.text = text;
  if (!SAMPLE) {
    D_.err = "Sorting needs Claude, which isn't available in this view.";
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
    const opt = { modelTier: "default", cache: false };
    if (D_.files?.length) opt.images = D_.files;
    const r = await SAMPLE.json(prompt, opt),
      valid = new Set(allUnits().map((u) => u.k));
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
    D_.err =
      {
        not_granted: "Claude wasn't allowed for this page, so we can't sort it.",
        rate_limited: "Too many requests just now. Try again in a minute.",
        image_rejected: "That photo couldn't be read. Try a different one.",
        invalid_json: "We couldn't read the answer. Try again.",
        images_unavailable: "Photos can't be sent from this view. Type it instead.",
      }[e?.code] || "Something went wrong. Try again.";
    sfx("no");
  }
  D_.busy = false;
  render();
}
function invItem(i) {
  const ch = (i.chapters || []).map(unitByK).filter(Boolean);
  return `<div class="invi"><div style="min-width:0"><b>${esc(i.name)}</b>${i.by || i.kind ? `<span class="xs muted"> · ${esc([i.by, i.kind].filter(Boolean).join(" · "))}</span>` : ""}${i.note ? `<p class="xs muted">${esc(i.note)}</p>` : ""}${ch.length ? `<div class="row chips">${ch.slice(0, 3).map(chipK).join("")}</div>` : (i.concepts || []).length ? `<p class="xs"><b>Idea:</b> ${i.concepts.map((c) => esc(RCON[c]?.concept || c)).join(" · ")}</p>` : ""}</div><button class="plain" data-act="invdel" data-i="${i.id}" aria-label="Remove ${esc(i.name)}">${icon("close")}</button></div>`;
}
document.addEventListener("change", (e) => {
  if (e.target.id === "invImg") {
    ui.idump = ui.idump || {};
    ui.idump.text = document.getElementById("invText")?.value || "";
    ui.idump.files = [...e.target.files].slice(0, 4);
    render();
  }
});

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
function resourcesForV0(u) {
  const k = u.k;
  return (DATA.resources || []).filter(
    (r) => (r.chapters || []).includes(k) || r.concepts.some((c) => (RCON[c]?.chapters || []).includes(k)),
  );
}
function resourcesFor(u) {
  const L = resourcesForV0(u);
  if (u.subj === "sci" || u.subj === "dks" || !LSUBJ[u.subj]) return L;
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
   ${S.age ? `<button class="chip" aria-pressed="${fit}" data-act="rfit" style="justify-self:start">Suits age ${S.age}</button>` : ""}
   <p class="xs muted">${L.length} shown</p><div class="grid2">${resSort(L)
     .slice(0, ui.rmore || 40)
     .map(resCard)
     .join(
       "",
     )}</div>${L.length > (ui.rmore || 40) ? `<button class="btn line sm" data-act="rmore">Show more</button>` : ""}</section>`;
}

document.addEventListener("change", (e) => {
  if (e.target.id === "rcSel") {
    ui.rc = e.target.value;
    ui.rmore = 40;
    delete e.target.dataset.dirty;
    render();
  }
});
const greetBar = (sub) => {
  const st = streak();
  return `<section class="greetbar"><button class="readbtn" data-act="readnow" aria-label="Read the screen aloud" style="order:3;margin-left:auto">🔊</button>${dayRing()}<span style="display:grid;min-width:0"><b>${greetWord()}${pname() ? ", " + esc(pname()) : ""}!</b><span class="xs muted">${sub}${st > 1 ? ` · <span class="streak">${st} days in a row</span>` : ""}</span></span></section>`;
};
function calHead(d) {
  return calHead0(d) + cancelNote(d);
}
function calHead0(d) {
  const lab =
      d === today
        ? "Today"
        : d === addDays(today, 1)
          ? "Tomorrow"
          : d === addDays(today, -1)
            ? "Yesterday"
            : parse(d).toLocaleDateString(undefined, { weekday: "long" }),
    sub = parse(d).toLocaleDateString(undefined, {
      weekday: d === today || Math.abs(parse(d) - parse(today)) < 2 * 864e5 ? "short" : undefined,
      day: "numeric",
      month: "short",
    });
  return `<div class="calhead"><button class="iconbtn sm" data-act="tday" data-d="-1" aria-label="Previous day">${icon("back")}</button><div class="calt"><b>${lab}</b><span class="xs muted">${sub}</span></div><button class="iconbtn sm" data-act="tday" data-d="1" aria-label="Next day">${icon("next")}</button>${d !== today ? `<button class="link xs" data-act="tday" data-d="0" style="margin-left:auto">Back to today</button>` : `<button class="link xs" data-act="quick" style="margin-left:auto">${ui.qaOpen ? "Close" : "+ Add"}</button>`}</div>${ui.qaOpen && d === today ? `<section class="qa-in"><b style="font:600 17px var(--display)">Add to today</b>${quickAdd(today)}</section>` : ""}`;
}
const navSnap = () => ({
  tab,
  lt: ui.lt,
  pv: ui.pv,
  pday: ui.pday,
  tday: ui.tday,
  sheet: ui.sheet ? JSON.parse(JSON.stringify(ui.sheet)) : null,
  ctab: ui.sheet?.k ? ui.ctab[ui.sheet.k] : undefined,
  y: scrollY,
});
let navHist = [],
  navRestoring = false;
function navPush() {
  if (navRestoring) return;
  navHist.push(navSnap());
  if (navHist.length > 40) navHist.shift();
  try {
    history.pushState({ dk: navHist.length }, "");
  } catch (e) {}
  updBack();
}
function navBack() {
  if (!navHist.length) return;
  const s = navHist.pop();
  navRestoring = true;
  tab = s.tab;
  ui.lt = s.lt;
  ui.pv = s.pv;
  ui.pday = s.pday;
  ui.tday = s.tday;
  if (s.sheet) {
    if (s.sheet.k) {
      if (s.ctab) ui.ctab[s.sheet.k] = s.ctab;
      else delete ui.ctab[s.sheet.k];
    }
    ui.sheet = s.sheet;
    if (!sheet.open) sheet.showModal();
    renderSheet(true);
    render();
  } else {
    if (sheet.open) sheet.close();
    else render();
  }
  requestAnimationFrame(() => scrollTo(0, s.y || 0));
  navRestoring = false;
  updBack();
}
function goBack() {
  if (!navHist.length) {
    if (sheet.open) sheet.close();
    return;
  }
  sfx("tap");
  try {
    history.back();
  } catch (e) {
    navBack();
  }
}
function updBack() {
  const b = document.getElementById("backTop");
  if (b) b.hidden = !navHist.length || !ACC;
  const c = document.getElementById("sheetClose"),
    top = navHist[navHist.length - 1];
  if (c && sheet.open) {
    const bk = !!top?.sheet;
    c.innerHTML = bk ? icon("back") : icon("close");
    c.setAttribute("aria-label", bk ? "Back" : "Close");
  }
}
addEventListener("popstate", () => navBack());
document
  .querySelector("header.top .wrap")
  .insertAdjacentHTML(
    "afterbegin",
    `<button class="iconbtn" id="backTop" aria-label="Back" hidden>${icon("back")}</button>`,
  );
document.getElementById("backTop").onclick = goBack;

const PKIND = {
  warmup: ["learn", "Warm-up"],
  read: ["read", "Read"],
  talk: ["learn", "Talk"],
  do: ["act", "Do"],
  exp: ["exp", "Experiment"],
  act: ["act", "Activity"],
  ws: ["ws", "Worksheet"],
  game: ["game", "Game"],
  think: ["learn", "Think"],
  watch: ["read", "Watch"],
  outdoor: ["act", "Outdoors"],
  review: ["learn", "Review"],
  check: ["ws", "Check"],
};
const TIER = { core: "Core", stretch: "Stretch", challenge: "Challenge" };
const VST = {
  accepted: "Now accepted",
  debated: "Still debated",
  minority: "Minority view",
  rejected: "Evidence went against it",
};
const PLEAD = {
  morning: 0,
  "night before": 1,
  "day before": 1,
  "2 days before": 2,
  "3 days before": 3,
  "1 week before": 7,
  "week before": 7,
};
const pkDay = (u, n) => {
  const D = u.c.p.days;
  return D[Math.min(Math.max(n, 1), D.length) - 1];
};
const pkFind = (u, id) => {
  const P = u.c.p;
  for (const g of ["worksheets", "experiments", "activities", "voices"]) {
    const x = (P[g] || []).find((z) => z.id === id);
    if (x) return [g, x];
  }
  return [null, null];
};
function packDay(u, n) {
  const P = u.c.p,
    d = pkDay(u, n),
    last = d.n === P.days.length,
    refs = new Set(d.steps.map((s) => s.ref).filter(Boolean));
  const out = d.steps.map((s, i) => {
    const [kind, label] = PKIND[s.kind] || ["act", "Step"];
    return {
      kind,
      label,
      title: s.title,
      mins: s.mins / 60,
      bk: srcOf(s),
      html:
        srcLine(s) +
        packStep(u, s) +
        (s.kind === "check" && P.check?.length ? quizList(u.k, d.n, P.check) : "") +
        (stepSec(u, s) === "lab" && !s.ref ? workCtl(u, "st" + d.n + "_" + i, s.title) : ""),
      name: `pk:${d.n}:${i}`,
      sec: stepSec(u, s),
    };
  });
  const W = P.words || [];
  if (!out.some((x) => x.sec === "ideas") && !(u.board === "waldorf" && (u.subj !== "wml" || d.n > 1))) {
    const k = W.length ? ((d.n - 1) * 3) % W.length : 0,
      ws = W.length ? [0, 1, 2].map((i) => W[(k + i) % W.length]).filter((w, i, a) => a.indexOf(w) === i) : [];
    out.push({
      kind: "learn",
      label: "Big ideas",
      title: d.n === 1 ? "What this chapter is about" : "Today's big idea and key words",
      mins: 5 / 60,
      sec: "ideas",
      name: "pkx:ideas",
      html:
        srcLine({ kind: "think" }) +
        (d.n === 1
          ? `${fmtPts(P.summary, 1)}${P.goals?.length ? `<p class="sm"><b>By the end, your child can:</b></p>${pkList(P.goals.map((g) => g.replace(/^By the end your child can\s*/i, "")))}` : ""}`
          : `<p><b>Today:</b> ${esc(d.goal)}</p>${ws.length ? `<p class="sm"><b>Key words to use today:</b></p><div class="kv">${ws.map(([w, m]) => `<span>${esc(w)}</span><b style="font-weight:400">${esc(m)}</b>`).join("")}</div><p class="sm muted">Ask your child to use each word in a sentence about today's lesson.</p>` : ""}`),
    });
  }
  (P.voices || [])
    .filter((v) => v.day === d.n && !refs.has(v.id))
    .forEach((v) =>
      out.push({
        kind: "learn",
        label: "Other views",
        title: "Other views: " + v.who.split(/[,(]/)[0].trim(),
        mins: 5 / 60,
        sec: "views",
        name: "pkx:v:" + v.id,
        html: srcLine({ kind: "read" }) + pkVoice(v),
      }),
    );
  (P.worksheets || [])
    .filter((w) => w.day === d.n && !refs.has(w.id))
    .forEach((w) =>
      out.push({
        kind: "ws",
        label: "Worksheet",
        title: "Worksheet: " + w.title,
        mins: 10 / 60,
        sec: "ws",
        name: "pkx:w:" + w.id,
        html: srcLine({ kind: "ws" }) + pkWs(u, w),
      }),
    );
  if (!out.some((x) => x.sec === "quiz") && u.board !== "waldorf") {
    const Q =
      last && P.check?.length
        ? P.check.slice(0, 5)
        : W.length
          ? [0, 1, 2]
              .map((i) => W[((d.n - 1) * 3 + i) % W.length])
              .filter((w, i, a) => a.indexOf(w) === i)
              .map(([w, m]) => ({ q: `What does “${w}” mean?`, a: m }))
          : [];
    if (Q.length)
      out.push({
        kind: "ws",
        label: "Quick quiz",
        title: last ? "End-of-chapter quiz" : "Quick quiz",
        mins: 5 / 60,
        sec: "quiz",
        name: "pkx:quiz",
        html:
          srcLine({ kind: "check" }) +
          `<p class="sm">Ask aloud. Let your child answer first, then tap to check.</p>${quizList(u.k, d.n, Q)}`,
      });
  }
  const ord = SECS.map((s) => s[0]),
    srt = out
      .map((x, i) => ({ x, i }))
      .sort((a, b) => ord.indexOf(a.x.sec) - ord.indexOf(b.x.sec) || a.i - b.i)
      .map((o) => o.x),
    F = srt.map((x) => ({ title: x.title, bk: !!x.bk?.book, pages: x.bk?.pages || [] }));
  return srt.map((x, j) => ({ ...x, html: (j === 0 ? pkHead(d, F) : "") + x.html }));
}
function packStepByName(u, name) {
  if (!u.c?.p) return "";
  const [, dn, i] = name.split(":"),
    d = pkDay(u, +dn),
    s = d?.steps[+i];
  return s ? packStep(u, s) : "";
}
const pkHead = (d, F) => {
  const L = (F || []).map((x, i) => ({ ...x, i: i + 1 })),
    bk = L.filter((x) => x.bk),
    isBook = (n) => /text ?book|learner['’]s book|book pages?|^pages? \d/i.test(n),
    need = (d.need || []).filter((n) => !(bk.length && isBook(n)));
  let pages = [...new Set(bk.flatMap((x) => x.pages))];
  if (bk.length && !pages.length)
    pages = [...new Set((d.need || []).filter(isBook).flatMap((n) => srcOf({ title: n }).pages))];
  const sh = (t) => (t.length > 26 ? t.slice(0, 25).trim() + "…" : t);
  return `<div class="phead"><p class="sm"><b>Today:</b> ${esc(d.goal)}</p>${L.length ? `<div class="flow" aria-label="Today's steps">${L.map((x) => `<span class="fl ${x.bk ? "bk" : "dk"}"><i>${x.i}</i>${x.bk ? "📖" : "✨"} ${esc(sh(x.title))}</span>`).join("")}</div><p class="xs muted">✨ DeepKids step: book closed, follow the screen. 📖 Book step: open the textbook where it says.</p>` : ""}
   ${bk.length ? `<p class="sm"><b>📖 Textbook${pages.length ? ", page" + (pages.length > 1 || pages[0].includes("–") ? "s " : " ") + pages.join(", ") : ""}</b> · for step${bk.length > 1 ? "s" : ""} ${bk.map((x) => x.i).join(", ")}</p>` : `<p class="sm"><b>✨ No textbook today.</b> Every step is on screen.</p>`}${need.length ? `<p class="sm"><b>Get ready:</b> ${need.map(esc).join(", ")}</p>` : ""}</div>`;
};

const packStep = (u, s) => `${fmtPts(s.do)}${s.ref ? pkRef(u, s.ref) : ""}`;
function pkRef(u, id) {
  const [g, x] = pkFind(u, id);
  if (!x) return "";
  if (g === "worksheets") return pkWs(u, x);
  if (g === "experiments") return pkExp(u, x);
  if (g === "activities") return pkAct(u, x);
  return pkVoice(x);
}
const pkList = (a, tag = "ul") =>
  a?.length ? `<${tag} class="sm">${a.map((i) => `<li>${esc(i)}</li>`).join("")}</${tag}>` : "";
const pkWs = (u, w) =>
  `<div class="pk"><span class="eyebrow">${TIER[w.tier] || ""} worksheet</span><b>${esc(w.title)}</b><p class="xs muted">${w.sections.length} sections · ${w.sections.reduce((a, s) => a + s[1].length, 0)} questions</p><div class="row"><button class="btn accent sm" data-act="ws" data-k="${u.k}" data-w="${esc(w.id)}">${taskDone(u.k + "#" + w.id, "ws") ? "Open again (finished)" : itemState("ws", u, w.id) === "going" ? "Continue the worksheet" : "Open the worksheet"}</button></div>${stateCtl("ws", u, w.id)}</div>`;
const pkExp = (u, e) =>
  `<div class="pk"><span class="eyebrow">Experiment${e.time ? " · " + esc(e.time) : ""}</span><b>${esc(e.title)}</b><p class="sm"><i>${esc(e.question)}</i></p>${e.need?.length ? `<p class="sm"><b>You need:</b> ${e.need.map(esc).join(", ")}</p>` : ""}${pkList(e.steps, "ol")}<div class="ask"><span class="eyebrow">Guess first</span>${esc(e.predict)}</div><p class="sm"><b>Look for:</b> ${esc(e.observe)}</p><details><summary class="sm">Why it happens</summary>${fmtPts(e.why)}</details>${e.safety ? `<p class="sm" style="color:var(--bad)"><b>Safety:</b> ${esc(e.safety)}</p>` : ""}<div class="tasks-inline">${taskLine(u, e.id, "Experiment done")}</div></div>`;
const pkAct = (u, a) =>
  `<div class="pk"><span class="eyebrow">Activity${a.mins ? " · " + a.mins + " min" : ""}</span><b>${esc(a.title)}</b>${a.need?.length ? `<p class="sm"><b>You need:</b> ${a.need.map(esc).join(", ")}</p>` : ""}${pkList(a.steps, "ol")}${a.outcome ? `<p class="sm"><b>You end up with:</b> ${esc(a.outcome)}</p>` : ""}<div class="tasks-inline">${taskLine(u, a.id, "Activity done")}</div></div>`;
const pkVoice = (v) =>
  `<div class="pk voicecard"><span class="vst ${esc(v.status)}">${VST[v.status] || esc(v.status)}</span><b>${esc(v.who)}</b>${fmtPts(v.idea, 1)}<span class="eyebrow">Back then</span>${fmtPts(v.then, 1)}<span class="eyebrow">Today</span>${fmtPts(v.now, 1)}<div class="ask"><span class="eyebrow">Ask your child</span>${esc(v.ask)}</div></div>`;

function packPrep(u, n) {
  const P = u.c.p,
    d = pkDay(u, n),
    L = [];
  if (n === 1)
    L.push(["guide", 1, `Skim the ${P.days.length}-day plan for ${u.title} (3 min)`, "The chapter page → Day plan"]);
  (d.prep || []).forEach((q) =>
    L.push(["get", PLEAD[String(q.when).toLowerCase()] ?? 1, q.task, `Part ${d.n} of the chapter`]),
  );
  if (d.need?.length) L.push(["get", 1, "Gather: " + d.need.join(", "), "Around the house"]);
  return L.map((p, i) => ({ id: `p|${u.k}|${n}|${i}`, kind: p[0], lead: p[1], task: p[2], where: p[3] }));
}
function packOverview(u) {
  const P = u.c.p;
  return `<section class="card ${SC(u.subj)}"><span class="eyebrow">${esc(P.source)}</span><p>${esc(P.summary)}</p>${P.goals?.length ? `<span class="eyebrow" style="margin-top:6px">By the end your child can</span>${pkList(P.goals.map((g) => g.replace(/^By the end your child can\s*/i, "")))}` : ""}</section>
   ${P.words?.length ? `<section class="card"><span class="eyebrow">Key words</span><div class="kv">${P.words.map(([w, m]) => `<span>${esc(w)}</span><b style="font-weight:400">${esc(m)}</b>`).join("")}</div></section>` : ""}
   ${P.check?.length ? `<details class="card"><summary><b>End-of-chapter check</b> <span class="xs muted">${P.check.length} questions</span></summary><ol class="sm">${P.check.map((c) => `<li>${esc(c.q)}<details><summary class="xs muted">Answer</summary><p class="sm">${esc(c.a)}</p></details></li>`).join("")}</ol></details>` : ""}`;
}
function packTab(u, t) {
  const P = u.c.p;
  if (t === "days") {
    const cur = Math.min(done(u.k) + 1, P.days.length);
    return (
      `<p class="sm muted">This chapter has ${P.days.length} parts of about ${P.day_mins} minutes. Each lesson is one part; anything left unticked moves to the next day.</p>` +
      P.days
        .map(
          (
            d,
          ) => `<details class="card pkday" ${d.n === cur ? "open" : ""}><summary><b>Part ${d.n}</b> · ${esc(d.title)} <span class="xs muted">${d.steps.reduce((a, s) => a + s.mins, 0)} min${d.n < cur ? " · done" : d.n === cur ? " · next" : ""}</span></summary>
      <p class="sm">${esc(d.goal)}</p>${d.need?.length ? `<p class="sm muted">You need: ${d.need.map(esc).join(", ")}</p>` : ""}${(d.prep || []).map((q) => `<p class="sm muted">Prep (${esc(q.when)}): ${esc(q.task)}</p>`).join("")}
      ${d.steps
        .map((s) => {
          const [, lab] = PKIND[s.kind] || ["", "Step"],
            [, x] = s.ref ? pkFind(u, s.ref) : [];
          return `<div class="pkstep"><span class="chip">${lab} · ${s.mins} min</span> <b>${esc(s.title)}</b><p class="sm">${esc(s.do)}</p>${x ? `<p class="xs muted">Uses: ${esc(x.title || x.who)}</p>` : ""}</div>`;
        })
        .join("")}</details>`,
        )
        .join("")
    );
  }
  if (t === "ws")
    return (
      printSheets(u) +
      `<p class="sm muted">Three levels: core for everyone, stretch to apply it, challenge to think harder.</p>` +
      P.worksheets
        .map(
          (w) => `<section class="card">${pkWs(u, w)}<p class="xs muted">Planned for day ${w.day || "–"}</p></section>`,
        )
        .join("")
    );
  if (t === "lab")
    return `<span class="eyebrow">Experiments</span>${P.experiments.map((e) => pkExp(u, e)).join("")}<span class="eyebrow" style="margin-top:10px">Activities</span>${P.activities.map((a) => pkAct(u, a)).join("")}`;
  if (t === "voices")
    return `<p class="sm muted">Other scientists and challenging views. Some were laughed at and later proved right; some are still argued over; some turned out wrong. Read one together and ask what evidence would change your mind.</p>${P.voices.map(pkVoice).join("")}`;
  return "";
}
function loginViewV0() {
  let known = [];
  try {
    known = JSON.parse(lsGet("dk-known") || "[]");
  } catch (e) {}
  return `<div class="ob">${crowd()}<div><span class="eyebrow">DeepKids</span><h1 style="margin-top:6px">Log in</h1><p class="muted" style="margin-top:6px">Testing mode, so no OTP yet. The same number always brings back the same family. You stay logged in until you log out.</p></div>
   ${known.length ? `<div class="col" style="gap:8px"><span class="eyebrow">Used on this phone</span>${known.map((k) => `<button class="menurow" data-act="loginas" data-a="${esc(k.acct)}">${youBlob("", "happy", 'width="40" height="40"')}<span><b>${esc(k.name || "Parent")}</b><br><span class="xs muted">+91 ${esc(String(k.acct).slice(2))}${k.child ? " · " + esc(k.child) + "'s family" : ""}</span></span>${icon("next")}</button>`).join("")}</div><span class="eyebrow">Or a different number</span>` : ""}
   <div class="field"><label for="lgPhone">Phone number</label><div class="row" style="flex-wrap:nowrap"><span class="chip" style="height:50px;padding:0 14px;font-size:16px">+91</span><input class="inp" id="lgPhone" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="16" placeholder="98765 43210"></div></div>
   <div class="field"><label for="lgName">Your name</label><input class="inp" id="lgName" maxlength="40" autocomplete="given-name" placeholder="Your name"></div>
   <p class="sm" id="lgErr" style="color:var(--bad)" ${ui.lgErr ? "" : "hidden"}>${esc(ui.lgErr || "")}</p>
   <button class="btn" data-act="login" ${ui.lgBusy ? "disabled" : ""}>${ui.lgBusy ? "Logging in…" : "Log in"}${icon("next")}</button></div>`;
}
function loginView() {
  const h = loginViewV0(),
    car = `<div class="fxintro" id="fxintro">${FXINTRO.map(([img, t, p]) => `<div class="fxslide2"><img src="media/ui/${img}.jpg" alt=""><h2>${t}</h2><p>${p}</p></div>`).join("")}</div><div class="fxdots">${FXINTRO.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("")}</div>`;
  return h.replace(/<div class="ob">[\s\S]*?<div>/, (m) => `<div class="ob">${car}<div>`);
}
function accountCard() {
  const ph = ACC ? "+91 " + ACC.slice(2, 7) + " " + ACC.slice(7) : "";
  const d = ui.saved;
  return `<section class="card"><div class="sech"><span><span class="eyebrow">Logged in</span><br><b style="font:600 17px var(--display)">${esc(ph)}</b></span><button class="btn soft sm" data-act="logout">Log out</button></div>
   <button class="btn line sm" data-act="checksaved" style="justify-self:start">${ui.savedBusy ? "Reading…" : "Check what's saved"}</button>
   ${
     d
       ? d.err
         ? `<p class="sm" style="color:var(--bad)">${esc(d.err)}</p>`
         : `<div class="kv"><span>Read from</span><b>the database, ${new Date(d.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" })}</b><span>Your name</span><b>${esc(d.v.parent?.name || "(not set)")}</b><span>Wake-up</span><b>${esc((d.v.alarm || {}).time || "(not set)")}</b><span>Child</span><b>${esc(d.v.child || "")}, age ${esc(d.v.age || "")}</b><span>Subjects</span><b>${(d.v.subjects || []).map((s) => SUBJ[s] || s).join(", ")}</b><span>Lessons done</span><b>${(d.v.log || []).length}</b></div>${
             (d.v.log || []).length
               ? `<span class="eyebrow" style="margin-top:8px">Last things saved</span><ol class="sm">${d.v.log
                   .slice(0, 6)
                   .map(
                     (l) =>
                       `<li>${esc(fmt(l.date))}${l.at != null ? ", " + clock(l.at) : ""}: ${esc(l.title)}${l.n ? " (part " + l.n + ")" : ""}</li>`,
                   )
                   .join("")}</ol>`
               : ""
           }<div class="kv"><span>Classes and to-dos</span><b>${(d.v.events || []).length + (d.v.todos || []).length}</b><span>Last change</span><b>${d.v.updatedAt ? new Date(d.v.updatedAt).toLocaleString([], { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : "–"}</b></div>`
       : ""
   }</section>`;
}

function noLessonNote(d) {
  const wd = parse(d).getDay(),
    DN = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"],
    SD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    on = S.subjects.filter((s) => daysOf(s).includes(wd));
  if (on.length) return `<p class="note">Nothing planned yet.</p>`;
  const nx = upcoming().find((x) => x.date > d),
    rng = (a) => {
      const o = [1, 2, 3, 4, 5, 6, 0].filter((x) => a.includes(x));
      return o.join() === "1,2,3,4,5" ? "Mon–Fri" : o.map((x) => SD[x]).join(", ");
    };
  return `<div class="note"><p><b>No lessons on ${DN[wd]}.</b> It's a free day in your plan.</p><ul class="sm" style="margin:6px 0;padding-left:18px">${S.subjects.map((s) => `<li>${esc(SUBJ[s])}: ${rng(daysOf(s))}</li>`).join("")}</ul>${nx ? `<p class="sm">Next lessons: ${esc(fmt(nx.date))}.</p>` : ""}<button class="link sm" data-act="plsheet" data-p="pace">Change lesson days</button></div>`;
}
function otherDay(d) {
  const items = dayPlan(d).filter((i) => i.kind !== "brk"),
    past = d < today,
    dn = items.filter((i) => i.done).length;
  return `<section class="sec cal">${calHead(d)}<p class="xs muted">${past ? `${dn} of ${items.length} done that day` : `${items.length} thing${items.length === 1 ? "" : "s"} planned`}</p>
   ${items.length ? `<div class="tt compact">${items.map((i) => tRow(i, d, null)).join("")}</div>` : past ? `<p class="note">Nothing was recorded that day.</p>` : noLessonNote(d)}
   ${past ? "" : `<button class="btn soft sm" data-act="quickday" data-d="${d}" style="margin-top:12px">+ Add a plan for this day</button>`}</section>`;
}
