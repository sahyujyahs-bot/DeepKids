/* Question bank, quick quizzes, the refresher, jokes and games */
const qid = (k, q) => {
  let h = 0;
  const s = k + "|" + q;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return "q" + (h >>> 0).toString(36);
};
function qBank(u) {
  const P = u.c?.p,
    out = [],
    seen = new Set(),
    add = (o) => {
      const id = qid(u.k, o.q);
      if (seen.has(id)) return;
      seen.add(id);
      out.push({ k: u.k, id, ...o });
    };
  if (P) {
    (P.check || []).forEach((c) => add({ q: c.q, a: c.a, kind: "open" }));
    (P.words || []).forEach(([w, m]) => add({ q: `What does “${w}” mean?`, a: m, kind: "open" }));
    (P.worksheets || []).forEach((w) =>
      w.sections.forEach(([, its]) =>
        its.forEach((it) => {
          if (it.t === "mcq" && Array.isArray(it.opts) && Number.isInteger(it.a) && it.opts[it.a] != null)
            add({ q: it.p, opts: it.opts, ans: it.a, a: String(it.opts[it.a]), kind: "mcq" });
          else if (it.t === "fill" && it.a?.length) add({ q: it.p, a: it.a.join(" / "), kind: "open" });
          else if (it.t === "match" && it.pairs?.length)
            it.pairs
              .slice(0, 3)
              .forEach(([x, y]) => add({ q: `${String(it.p).replace(/\.$/, "")}: ${x}?`, a: String(y), kind: "open" }));
        }),
      ),
    );
  }
  (u.c?.x?.quiz || []).forEach(([s, t, why]) =>
    add({
      q: s,
      kind: "tf",
      opts: ["True", "False"],
      ans: t ? 0 : 1,
      a: (t ? "True" : "False") + (why ? ". " + why : ""),
    }),
  );
  (S.qgen?.[u.k] || []).forEach((o) => add({ ...o, kind: o.opts ? "mcq" : "open", gen: true }));
  return out;
}
const lastLearn = (u) => {
  let d = "";
  S.log.forEach((l) => {
    if (l.key === u.k && l.date > d) d = l.date;
  });
  return d || S.progress?.[u.k]?.updated || "";
};
function learnedUnits() {
  const ks = new Set([
    ...S.log.map((l) => l.key),
    ...Object.keys(S.progress || {}).filter(
      (k) => (S.progress[k].sessions || 0) > 0 || rank[S.progress[k].status] >= 2,
    ),
  ]);
  return [...ks].map(unitByK).filter((u) => u && S.subjects.includes(u.subj));
}
/* every answer to every question, from part quizzes, quick quizzes and refreshers; the latest one counts */
function lastAnswers() {
  const M = {};
  Object.entries(S.quiz || {}).forEach(([kk, o]) => {
    const k = kk.slice(0, kk.lastIndexOf("|"));
    Object.values(o || {}).forEach((x) => {
      if (x && x.q != null) {
        const id = qid(k, x.q);
        if (!M[id] || (x.d || "") >= (M[id].d || "")) M[id] = { k, q: x.q, a: x.a, r: x.r, d: x.d || "" };
      }
    });
  });
  Object.entries(S.qa || {}).forEach(([id, x]) => {
    if (!M[id] || (x.d || "") >= (M[id].d || "")) M[id] = x;
  });
  return M;
}
function qRecord(o, r) {
  S.qa = S.qa || {};
  const p = S.qa[o.id];
  S.qa[o.id] = { k: o.k, q: o.q, a: o.a, r: r ? 1 : 0, d: today, n: (p?.n || 0) + 1, w: (p?.w || 0) + (r ? 0 : 1) };
}
/* Not grasped: a question's latest answer is wrong. Mastered: chapter done, all its work done, nothing wrong. Grasped: the rest */
function masteryOf(u, M) {
  if (Object.values(M).some((x) => x.k === u.k && x.r === 0)) return "not";
  const P = u.c?.p;
  let all = rank[coverage(u)] >= 2;
  if (all && P) {
    const its = [
      ...(P.worksheets || []).map((w) => ["ws", w.id]),
      ...[...(P.experiments || []), ...(P.activities || [])].map((e) => [wType(u, e.id), e.id]),
      ...P.days.filter((d) => quizQ(u, d.n).length).map((d) => ["qz", "q" + d.n]),
    ];
    all = its.every(([t, id]) => ["done", "skip"].includes(itemState(t, u, id)));
  }
  return all ? "mastered" : "grasped";
}
function masteryLists() {
  const M = lastAnswers(),
    L = { not: [], grasped: [], mastered: [] };
  learnedUnits().forEach((u) => L[masteryOf(u, M)].push(u));
  return L;
}
const MGN = { not: "Not grasped yet", grasped: "Grasped", mastered: "Mastered" },
  RTN = { qz: "Quiz questions", think: "Big think", reread: "Re-read", act: "Redo an activity" };
const RFDEF = {
  not: { every: 1, mix: { qz: 50, think: 20, reread: 30, act: 0 } },
  grasped: { every: 3, mix: { qz: 50, think: 30, reread: 10, act: 10 } },
  mastered: { every: 10, mix: { qz: 30, think: 50, reread: 0, act: 20 } },
  mins: 45,
  days: [0, 1, 2, 3, 4, 5, 6],
};
function RFS() {
  const s = S.rfs || {},
    g = (k) => ({ ...RFDEF[k], ...(s[k] || {}), mix: { ...RFDEF[k].mix, ...(s[k]?.mix || {}) } });
  return {
    not: g("not"),
    grasped: g("grasped"),
    mastered: g("mastered"),
    mins: s.mins || RFDEF.mins,
    days: s.days || RFDEF.days,
  };
}
const hsh = (s) => {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};
function thinkFor(u, i) {
  const P = u.c?.p,
    t = u.topic;
  if (P?.voices?.length) {
    const v = P.voices[i % P.voices.length];
    return {
      title: "Big think: " + v.who.split(/[,(]/)[0].trim(),
      body: v.idea,
      ask: "What do you think, and why? Is there another way to see it?",
    };
  }
  if (t) return { title: "Big think: " + t.name, body: t.summary, ask: t.oneness };
  if (P?.goals?.length) {
    const g = P.goals[i % P.goals.length].replace(/^By the end your child can\s*/i, "");
    return {
      title: "Big think: " + u.title,
      body: "Can you still " + g.replace(/\.$/, "") + "?",
      ask: "Show me or tell me, in your own words.",
    };
  }
  return {
    title: "Teach it back: " + u.title,
    body: "Your child teaches you what they remember from this chapter, as if you were the student.",
    ask: "What is one question about it you still have?",
  };
}
function rereadFor(u) {
  const P = u.c?.p;
  if (P) return { title: "Re-read: " + u.title, body: P.summary, words: (P.words || []).slice(0, 5) };
  if (u.topic) return { title: "Re-read: " + u.title, body: u.topic.summary };
  return {
    title: "Re-read: " + chT(u),
    body: `Open ${u.book || "the book"} at this chapter. Your child reads a page aloud and tells you what it was about.`,
  };
}
function actFor(u, i) {
  const P = u.c?.p,
    c = u.c || {},
    pool = [];
  if (P) {
    (P.experiments || []).forEach((e) => pool.push({ title: e.title, body: e.question, steps: e.steps, need: e.need }));
    (P.activities || []).forEach((a) =>
      pool.push({
        title: a.title,
        body: a.outcome ? "You end up with: " + a.outcome : "",
        steps: a.steps,
        need: a.need,
      }),
    );
  }
  if (c.game) pool.push({ title: c.game[0], body: c.game[1] });
  (c.exp || []).forEach((e) => pool.push({ title: e.split(":")[0].slice(0, 50), body: e }));
  (c.act || []).forEach((e) => pool.push({ title: e.split(":")[0].slice(0, 50), body: e }));
  return pool.length ? pool[i % pool.length] : null;
}
function pickType(mix, h) {
  const T = Object.entries(mix).filter(([, v]) => v > 0),
    tot = T.reduce((a, [, v]) => a + v, 0);
  if (!tot) return "qz";
  let x = h % tot;
  for (const [k, v] of T) {
    if (x < v) return k;
    x -= v;
  }
  return T[0][0];
}
/* the day's refresher: topics due by their list's frequency, a mix of short bits by their list's mix */
function rfPlanFromAnswers(date) {
  if (S.rfp?.[date]) return S.rfp[date];
  const R = RFS();
  if (!R.days.includes(parse(date).getDay())) return null;
  const M = lastAnswers(),
    dn = parse(date);
  const lastRef = {};
  Object.entries(S.rfp || {}).forEach(([d, p]) => {
    if (d < date && S.tl?.[d + "|refresh"])
      (p.topics || []).forEach((t) => {
        if (!lastRef[t.k] || d > lastRef[t.k]) lastRef[t.k] = d;
      });
  });
  const due = [];
  learnedUnits().forEach((u) => {
    const ll = lastLearn(u);
    if (!ll || ll >= date) return;
    const g = masteryOf(u, M),
      from = lastRef[u.k] && lastRef[u.k] > ll ? lastRef[u.k] : ll,
      gap = Math.round((dn - parse(from)) / 864e5);
    if (gap >= R[g].every) due.push({ u, g, gap });
  });
  if (!due.length) return null;
  const ord = { not: 0, grasped: 1, mastered: 2 };
  due.sort((a, b) => ord[a.g] - ord[b.g] || b.gap - a.gap || hsh(date + a.u.k) - hsh(date + b.u.k));
  const T = due.slice(0, 3),
    n = Math.max(3, Math.round(R.mins / 3)),
    slots = [];
  for (let i = 0; i < n; i++) {
    const t = T[i % T.length],
      h = hsh(date + "|" + i + "|" + t.u.k);
    let ty = pickType(R[t.g].mix, h);
    if (ty === "qz") {
      const B = qBank(t.u),
        w = B.filter((q) => M[q.id]?.r === 0),
        fresh = B.filter((q) => !M[q.id]),
        pool = w.length ? w : fresh.length ? fresh : B,
        used = new Set(slots.filter((s) => s.q).map((s) => s.q.id)),
        cand = pool.filter((q) => !used.has(q.id));
      if (cand.length) {
        slots.push({ ty, k: t.u.k, g: t.g, q: cand[h % cand.length] });
        continue;
      }
      ty = "think";
    }
    if (ty === "act") {
      const a = actFor(t.u, h);
      if (a) {
        slots.push({ ty, k: t.u.k, g: t.g, ...a });
        continue;
      }
      ty = "think";
    }
    slots.push({ ty, k: t.u.k, g: t.g, ...(ty === "reread" ? rereadFor(t.u) : thinkFor(t.u, h)) });
  }
  const p = {
    date,
    mins: R.mins,
    topics: T.map((t) => ({ k: t.u.k, g: t.g })),
    slots,
    title:
      T.map((t) => t.u.title)
        .slice(0, 2)
        .join(" · ") + (T.length > 2 ? ` +${T.length - 2}` : ""),
    sub: `${slots.length} short bits from ${T.length} past topic${T.length > 1 ? "s" : ""}`,
  };
  if (date === today) {
    S.rfp = { ...(S.rfp || {}), [date]: p };
  }
  return p;
}
function rfPlan(date) {
  const p = rfPlanFromAnswers(date),
    U = fxRefs(),
    V = fxReviews(date),
    n = U.reduce((a, x) => a + x.n, 0);
  if (!n && !V.length) return p;
  const extra = [
    n ? `${n} question${n > 1 ? "s" : ""} to try again` : "",
    V.length ? `${V.length} unit${V.length > 1 ? "s" : ""} to review` : "",
  ]
    .filter(Boolean)
    .join(" · ");
  if (p) return { ...p, sub: (p.sub || "") + " · plus " + extra };
  const m = Math.min(RFS().mins, 10 + n * 2 + V.length * 5);
  return { date, mins: m, topics: [], slots: [], title: "Try again and review", sub: extra, fxOnly: true };
}
function qCard(q, state) {
  const res = state?.r,
    ch = state?.c;
  window._qmap = window._qmap || {};
  window._qmap[q.id] = q;
  const opts = q.opts
    ? `<div class="col" style="gap:6px">${q.opts.map((o, i) => `<button class="btn sm ${res == null ? "soft" : i === q.ans ? "green" : i === ch ? "bad" : "line"}" data-act="qans" data-id="${q.id}" data-c="${i}" ${res != null ? "disabled" : ""}>${esc(String(o))}</button>`).join("")}</div>`
    : "";
  const open = !q.opts
    ? res == null
      ? `<details><summary class="sm muted">Show the answer</summary><p class="sm">${esc(q.a)}</p></details><div class="row" style="gap:6px"><button class="btn xs accent" data-act="qans" data-id="${q.id}" data-r="1">Got it</button><button class="btn xs soft" data-act="qans" data-id="${q.id}" data-r="0">Not yet</button></div>`
      : `<p class="sm"><b>Answer:</b> ${esc(q.a)}</p>`
    : "";
  return `<div class="qcard"><b style="font:600 17px var(--display)">${esc(q.q)}</b>${opts}${open}${res != null ? `<p class="sm"><b>${res ? "✓ Right" : "✗ Not yet"}</b>${q.opts && !res ? ` · Answer: ${esc(q.a)}` : ""}</p>` : ""}</div>`;
}
/* Quick quiz: any time, on lessons done */
function quizPool(s, focus) {
  const M = lastAnswers(),
    U = learnedUnits().filter((u) => s === "all" || u.subj === s),
    B = U.flatMap(qBank),
    g = Object.fromEntries(U.map((u) => [u.k, masteryOf(u, M)]));
  if (focus === "not") return B.filter((q) => g[q.k] === "not");
  if (focus === "even") return B;
  const w = (q) => (M[q.id]?.r === 0 ? 0 : g[q.k] === "not" ? 1 : !M[q.id] ? 2 : 3);
  return B.slice().sort((a, b) => w(a) - w(b));
}
function quizzView() {
  document.getElementById("sheetTitle").textContent = "Quick quiz";
  if (ui.qrun) return quizRunView();
  if (ui.qzv) return quizPastView();
  const Z = (ui.qz = ui.qz || { s: "all", by: "n", n: 10, m: 10, focus: "mix" }),
    U = learnedUnits(),
    cnt = (s) => U.filter((u) => s === "all" || u.subj === s).flatMap(qBank).length,
    L = masteryLists(),
    seg = (key, vals, lab) =>
      `<div class="seg">${vals.map((v) => `<button aria-pressed="${Z[key] === v}" data-act="qzset" data-key="${key}" data-v="${v}">${lab(v)}</button>`).join("")}</div>`;
  const noBank = S.subjects.filter((s) => U.some((u) => u.subj === s) && !cnt(s));
  return `<p class="sm muted">Questions from every lesson you've done. Ask aloud; your child answers, then you check. Results are saved for the transcript, and anything not yet grasped goes into the refresher.</p>
   <section class="card"><span class="eyebrow">Subjects</span><div class="row chips">${["all", ...S.subjects].map((s) => `<button class="chip" aria-pressed="${Z.s === s}" data-act="qzset" data-key="s" data-v="${s}">${s === "all" ? "All subjects" : SUBJ[s]} <small>${cnt(s)}</small></button>`).join("")}</div>
    <span class="eyebrow">How long</span>${seg("by", ["n", "m"], (v) => (v === "n" ? "Number of questions" : "Minutes"))}${Z.by === "n" ? seg("n", [5, 10, 15, 20], (v) => v + " questions") : seg("m", [5, 10, 15, 20], (v) => v + " min")}
    <span class="eyebrow">Which questions</span>${seg("focus", ["mix", "not", "even"], (v) => ({ mix: "Weak spots first", not: "Only not grasped", even: "Everything" })[v])}
    <button class="btn accent" data-act="qzstart" ${cnt(Z.s) ? "" : "disabled"}>Start the quiz</button>
    ${!U.length ? `<p class="xs muted">Do a lesson or two first. Questions come from lessons you've done.</p>` : !cnt(Z.s) ? `<p class="xs muted">No questions yet for this choice.</p>` : ""}</section>
   ${noBank.length ? `<section class="card"><b>${noBank.map((s) => SUBJ[s]).join(", ")}: no questions yet</b><p class="xs muted">These chapters don't have quiz questions in DeepKids yet.</p>${SAMPLE ? `<button class="btn soft sm" data-act="qgen" ${ui.qgen ? "disabled" : ""}>${ui.qgen ? "Writing questions…" : "Write questions with Claude"}</button>` : `<p class="xs muted">With DeepKids Plus, Claude writes questions for them.</p>`}</section>` : ""}
   <section class="card"><div class="sech"><b style="font:600 17px var(--display)">How it's sticking</b><button class="link" data-act="rfset">Lists and refresher settings</button></div><div class="row">${["not", "grasped", "mastered"].map((g) => `<span class="pill mg-${g}">${MGN[g]} · ${L[g].length}</span>`).join("")}</div></section>
   ${
     (S.qzr || []).length
       ? `<section class="sec"><div class="sech"><h3 style="font-size:18px">Past quizzes</h3></div>${(S.qzr || [])
           .slice()
           .reverse()
           .slice(0, 12)
           .map(
             (r) =>
               `<button class="menurow" data-act="qzpast" data-id="${r.id}"><span style="font-size:26px">🎯</span><span><b>${r.score} of ${r.items.length} right</b><br><span class="xs muted">${esc(fmt(r.date))} · ${esc(r.s === "all" ? "All subjects" : SUBJ[r.s] || "")}</span></span>${icon("next")}</button>`,
           )
           .join("")}</section>`
       : ""
   }`;
}
function quizRunView() {
  const R = ui.qrun,
    q = R.qs[R.i],
    left = R.end ? Math.max(0, Math.round((R.end - Date.now()) / 1000)) : null,
    over = R.i >= R.qs.length || left === 0;
  if (over && !R.res.length) {
    if (!R.saved) {
      R.saved = true;
    }
    return `<p class="note">${left === 0 ? "Time's up before any question was answered." : "Stopped before any question was answered."} Nothing was saved.</p><div class="row"><button class="btn accent" data-act="qzagain">Try again</button><button class="btn line" data-act="qzend">Done</button></div>`;
  }
  if (over) {
    if (!R.saved) {
      R.saved = true;
      const items = R.res.map((x) => ({ k: x.q.k, q: x.q.q, a: x.q.a, r: x.r, c: x.c }));
      S.qzr = [
        ...(S.qzr || []),
        {
          id: Math.random().toString(36).slice(2, 9),
          date: today,
          s: R.s,
          by: R.by,
          items,
          score: items.filter((x) => x.r).length,
        },
      ];
      save();
    }
    const wrong = R.res.filter((x) => !x.r);
    return `<section class="card" style="text-align:center"><h2 style="font-size:28px">${R.res.filter((x) => x.r).length} of ${R.res.length} right</h2><p class="sm muted">${left === 0 && R.i < R.qs.length ? "Time's up. " : ""}Saved for the transcript.</p></section>
     ${wrong.length ? `<section class="card"><b>Not yet (${wrong.length})</b><p class="xs muted">These chapters move to “Not grasped yet” and come back in the refresher.</p><ol class="sm">${wrong.map((x) => `<li><b>${esc(x.q.q)}</b><br>${esc(x.q.a)} <span class="xs muted">· ${esc(chT(unitByK(x.q.k)))}</span></li>`).join("")}</ol></section>` : `<p class="note">All right. Lovely work!</p>`}
     <div class="row"><button class="btn accent" data-act="qzagain">Another quiz</button><button class="btn line" data-act="qzend">Done</button></div>`;
  }
  const st = R.cur?.id === q.id ? R.cur : null,
    u = unitByK(q.k);
  return `<div class="row" style="justify-content:space-between"><span class="eyebrow">Question ${R.i + 1} of ${R.qs.length}${left != null ? ` · <span id="qzleft">${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}</span> left` : ""}</span><button class="link xs" data-act="qzstop">Stop</button></div>
   <span class="xs muted">${esc(chT(u))} · ${esc(SUBJ[u?.subj] || "")}</span>${qCard(q, st)}${st ? `<button class="btn accent wide" data-act="qznext">${R.i + 1 < R.qs.length ? "Next question" : "See the score"}</button>` : ""}`;
}
function quizPastView() {
  const r = (S.qzr || []).find((x) => x.id === ui.qzv);
  if (!r) {
    ui.qzv = null;
    return quizzView();
  }
  return `<button class="link" data-act="qzback">← Quick quiz</button><h3>${r.score} of ${r.items.length} right · ${esc(fmt(r.date))}</h3><ol class="sm">${r.items.map((x) => `<li><b>${esc(x.q)}</b> ${x.r ? "✓" : "✗"}<br>${esc(x.a)} <span class="xs muted">· ${esc(chT(unitByK(x.k)))}</span></li>`).join("")}</ol>`;
}
/* lists and refresher settings */
function rfsetView() {
  document.getElementById("sheetTitle").textContent = "Refresher";
  const R = RFS(),
    L = masteryLists(),
    M = lastAnswers(),
    EV = [1, 2, 3, 5, 7, 10, 14, 30];
  const card = (
    g,
  ) => `<section class="card mgc-${g}"><div class="sech"><b style="font:600 17px var(--display)">${MGN[g]}</b><span class="pill">${L[g].length}</span></div>
    <p class="xs muted">${g === "not" ? "A question from it was last answered wrong, whatever else is finished." : g === "grasped" ? "Nothing answered wrong, but not everything in it is finished yet." : "Chapter done, all its worksheets, quizzes and projects finished, and nothing answered wrong."}</p>
    ${
      L[g].length
        ? `<div class="col" style="gap:4px">${L[g]
            .slice(0, 12)
            .map(
              (u) =>
                `<button class="plain sm" data-act="chapter" data-k="${u.k}" style="text-align:left">• ${esc(chT(u))} <span class="xs muted">${esc(SUBJ[u.subj])}${g === "not" ? ` · ${Object.values(M).filter((x) => x.k === u.k && x.r === 0).length} not yet` : ""}</span></button>`,
            )
            .join("")}${L[g].length > 12 ? `<span class="xs muted">+${L[g].length - 12} more</span>` : ""}</div>`
        : ""
    }
    <div class="row" style="align-items:center"><span class="sm">Refresh every</span><select class="inp" style="width:auto;height:40px" data-rfe="${g}">${EV.map((v) => `<option value="${v}" ${R[g].every === v ? "selected" : ""}>${v === 1 ? "day" : v + " days"}</option>`).join("")}</select></div>
    <span class="eyebrow">Mix of refresher bits</span>${Object.keys(RTN)
      .map(
        (t) =>
          `<div class="row" style="align-items:center;justify-content:space-between;flex-wrap:nowrap"><span class="sm">${RTN[t]}</span><div class="stepper"><button data-act="rfmix" data-g="${g}" data-t="${t}" data-d="-10" ${R[g].mix[t] <= 0 ? "disabled" : ""} aria-label="Less ${RTN[t]}">−</button><span class="sm" style="min-width:48px;text-align:center">${R[g].mix[t]}%</span><button data-act="rfmix" data-g="${g}" data-t="${t}" data-d="10" ${R[g].mix[t] >= 100 ? "disabled" : ""} aria-label="More ${RTN[t]}">+</button></div></div>`,
      )
      .join("")}</section>`;
  return `<p class="sm muted">Every day, a short refresher from past lessons. Each list has its own rhythm and mix. The shares are relative: 50 and 50 means half and half.</p>
   <section class="card"><div class="row" style="align-items:center"><span class="sm">Daily refresher</span><select class="inp" style="width:auto;height:40px" id="rfmins">${[10, 15, 20, 30].map((v) => `<option value="${v}" ${R.mins === v ? "selected" : ""}>${v} min</option>`).join("")}</select></div><div class="dpick">${[1, 2, 3, 4, 5, 6, 0].map((d) => `<button aria-pressed="${R.days.includes(d)}" data-act="rfday" data-d="${d}">${DAYN[d]}</button>`).join("")}</div></section>
   ${card("not")}${card("grasped")}${card("mastered")}<button class="btn soft sm" data-act="quizgo" style="justify-self:start">🎯 Quick quiz</button>`;
}
function quizTranscript() {
  const R = S.qzr || [],
    L = masteryLists(),
    M = Object.values(lastAnswers());
  if (!R.length && !M.length) return "";
  const tot = R.reduce((a, r) => a + r.items.length, 0),
    ok = R.reduce((a, r) => a + r.score, 0);
  return `<h2>Quizzes and refreshers</h2><p class="sm">Quick quizzes taken: ${R.length} · Questions: ${tot} · Right: ${ok}${tot ? ` (${Math.round((ok / tot) * 100)}%)` : ""} · Different questions answered in all quizzes and refreshers: ${M.length}, latest answer right for ${M.filter((x) => x.r).length}</p>
   <table><tr><th>How it's sticking</th><th>Chapters</th></tr>${["mastered", "grasped", "not"].map((g) => `<tr><td>${MGN[g]}</td><td>${L[g].map((u) => esc(chT(u)) + " (" + esc(SUBJ[u.subj]) + ")").join(", ") || "—"}</td></tr>`).join("")}</table>
   ${
     R.length
       ? `<h3>Quick quizzes</h3><table><tr><th>Date</th><th>Subjects</th><th>Score</th></tr>${R.map((r) => `<tr><td>${esc(fmt(r.date))}</td><td>${esc(r.s === "all" ? "All subjects" : SUBJ[r.s] || "")}</td><td>${r.score} / ${r.items.length}</td></tr>`).join("")}</table>
   <h3>Questions and answers</h3><table><tr><th>Date</th><th>Chapter</th><th>Question</th><th>Answer</th><th>Result</th></tr>${R.flatMap((r) => r.items.map((x) => `<tr><td>${esc(fmt(r.date))}</td><td>${esc(chT(unitByK(x.k)))}</td><td>${esc(x.q)}</td><td>${esc(x.a)}</td><td>${x.r ? "Right" : "Not yet"}</td></tr>`)).join("")}</table>`
       : ""
   }`;
}
async function qGen() {
  const U = learnedUnits()
    .filter((u) => !qBank(u).length)
    .slice(0, 6);
  if (!U.length || !SAMPLE) return;
  ui.qgen = true;
  renderSheet();
  const prompt = `You write quiz questions for a home-schooled Indian child in Class ${S.levels?.math || 3}. For each chapter below, write 5 short multiple-choice questions that check what the chapter teaches. Each has 4 options and exactly one right answer. Simple words.\n${U.map((u) => `k: ${u.k} | ${SUBJ[u.subj]} | ${u.book} | ${chT(u)}`).join("\n")}\nReply with only JSON: {"chapters":[{"k":"...","questions":[{"q":"...","opts":["a","b","c","d"],"ans":0}]}]}`;
  try {
    const r = await SAMPLE.json(prompt, { modelTier: "default" }),
      ok = new Set(U.map((u) => u.k));
    S.qgen = S.qgen || {};
    (r?.chapters || []).forEach((c) => {
      if (!ok.has(c.k)) return;
      const qs = (c.questions || [])
        .filter(
          (q) =>
            q &&
            typeof q.q === "string" &&
            Array.isArray(q.opts) &&
            q.opts.length === 4 &&
            Number.isInteger(q.ans) &&
            q.ans >= 0 &&
            q.ans < 4,
        )
        .map((q) => ({ q: q.q, opts: q.opts.map(String), ans: q.ans, a: String(q.opts[q.ans]) }));
      if (qs.length) S.qgen[c.k] = qs;
    });
    toast("Questions ready");
  } catch (e) {
    toast("Couldn't write questions just now. Try again later.");
  }
  ui.qgen = false;
  commit();
  renderSheet();
}
function rfCard() {
  const L = masteryLists(),
    it = dayPlan(today).find((i) => i.id === "refresh");
  return `<section class="sec"><div class="sech"><h3>Quizzes and refreshers</h3></div><div class="card"><div class="row">${["not", "grasped", "mastered"].map((g) => `<span class="pill mg-${g}">${MGN[g]} · ${L[g].length}</span>`).join("")}</div>
  <div class="row"><button class="btn accent sm" data-act="quizgo">🎯 Quick quiz</button>${it ? `<button class="btn soft sm" data-act="refresh" data-date="${today}">Today's refresher</button>` : ""}<button class="link" data-act="rfset">Lists and settings</button></div></div></section>`;
}
/* More for today: more jokes, and real games from the chapters */
function moreJG() {
  const n = ui.jg || 0;
  if (!n)
    return `<button class="btn soft sm" data-act="morejg" style="justify-self:start">${icon("spark")}More jokes and games</button>`;
  const mine = (i) => S.subjects.includes(i.subj),
    J = DATA.items.filter((i) => mine(i) && i.c?.x?.jokes?.length).flatMap((i) => i.c.x.jokes),
    Gm = DATA.items.filter((i) => mine(i) && Array.isArray(i.c?.game) && i.c.game.length >= 2);
  const pick = (L, c) => {
    const o = [];
    for (let i = 0; i < c && i < L.length; i++) o.push(L[((n - 1) * c + i + dayNo) % L.length]);
    return o;
  };
  return `<section class="card"><b style="font:600 17px var(--display)">More jokes</b><div class="hs">${pick(J, 2)
    .map((j, i) => {
      const [q, a] = splitJoke(j),
        k = "x" + n + "-" + i;
      return `<button class="joke" data-act="joke" data-j="${k}"><span class="eyebrow">Joke</span><span class="q">${esc(q)}</span>${ui.jokes[k] ? `<span class="a">${esc(a)}</span>` : `<span class="tap">Tap for the answer</span>`}</button>`;
    })
    .join("")}</div>
   <b style="font:600 17px var(--display)">Games to play</b>${pick(Gm, 2)
     .map(
       (u) =>
         `<div class="pk"><span class="eyebrow">${esc(chT(u))} · ${esc(SUBJ[u.subj])}</span><b>${esc(u.c.game[0])}</b><p class="sm">${esc(u.c.game[1])}</p></div>`,
     )
     .join("")}
   <button class="btn soft sm" data-act="morejg" style="justify-self:start">${icon("spark")}Two more of each</button></section>`;
}
function refreshAnswersView() {
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
  return top + (it?.rf?.fxOnly ? "" : refreshAnswersView());
}
function wordGame(u) {
  const x = u.c.x,
    word = x.words[dayNo % x.words.length],
    g = G(),
    won = g.g.includes(word),
    over = won || g.g.length >= 6,
    keys = {};
  g.g.forEach((w) =>
    [...w].forEach((ch, i) => {
      const c = ch === word[i] ? "hit" : word.includes(ch) ? "near" : "miss";
      if (keys[ch] !== "hit" && !(keys[ch] === "near" && c === "miss")) keys[ch] = c;
    }),
  );
  const rows = [...Array(6)]
    .map((_, r) => {
      const w = g.g[r] || (r === g.g.length && !over ? g.cur || "" : "");
      return `<div class="wrow">${[4]
        .map((i) => {
          const ch = w[i] || "";
          let c = ch ? "f" : "";
          if (g.g[r]) c = ch === word[i] ? "hit" : word.includes(ch) ? "near" : "miss";
          return `<span class="wt ${c}" style="animation-delay:${i * 0.07}s">${esc(ch)}</span>`;
        })
        .join("")}</div>`;
    })
    .join("");
  return `<p class="sm muted" style="text-align:center">A five-letter word from “${esc(u.title)}”. Green is the right place, yellow is in the word.</p><div class="wgrid">${rows}</div>${over ? `<p style="text-align:center;font:600 18px var(--display)">${won ? "You got it: " : "The word was "}${word}</p>` : `<div class="kb">${["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((r, i) => `<div>${i === 2 ? `<button class="w" data-act="wk" data-key="ENTER">Enter</button>` : ""}${[...r].map((c) => `<button class="${keys[c] || ""}" data-act="wk" data-key="${c}">${c}</button>`).join("")}${i === 2 ? `<button class="w" data-act="wk" data-key="DEL" aria-label="Delete">Del</button>` : ""}</div>`).join("")}</div>`}`;
}
function tfGame(u) {
  const g = G(),
    q = u.c.x.quiz,
    i = q.findIndex((_, k) => g.tf[k] === undefined),
    right = (k) => (g.tf[k] === 1) === q[k][1],
    sc = q.filter((_, k) => g.tf[k] !== undefined && right(k)).length;
  const dots = `<div class="dots">${q.map((_, k) => `<i class="${g.tf[k] === undefined ? (k === i ? "on" : "") : right(k) ? "ok" : "no"}"></i>`).join("")}</div>`;
  if (i < 0)
    return `${dots}<div class="score">${sc}/${q.length}</div><div class="col">${q.map((x) => `<div class="card" style="padding:14px"><span class="eyebrow">${x[1] ? "True" : "False"}</span><b style="font-weight:500">${esc(x[0])}</b><span class="sm muted">${esc(x[2])}</span></div>`).join("")}</div>`;
  const p = i > 0 ? q[i - 1] : null;
  return `${dots}${p ? `<p class="sm" style="text-align:center;color:${right(i - 1) ? "var(--good)" : "var(--bad)"}">${right(i - 1) ? "Right." : "Not quite."} ${esc(p[2])}</p>` : `<p class="sm muted" style="text-align:center">Some of these sound true and aren't.</p>`}<div class="tfq">${esc(q[i][0])}</div><div class="tfrow"><button class="btn yes" data-act="tf" data-i="${i}" data-v="1">True</button><button class="btn no" data-act="tf" data-i="${i}" data-v="0">False</button></div>`;
}
function oddGame(u) {
  const g = G(),
    o = u.c.x.odd[dayNo % u.c.x.odd.length];
  return `<p class="sm muted" style="text-align:center">Which one doesn't belong? There may be more than one good answer. Can you defend yours?</p><div class="oddgrid">${o[0].map((w) => `<button class="${g.odd ? (w === o[1] ? "right" : w === g.odd ? "wrong" : "") : ""}" data-act="odd" data-w="${esc(w)}" ${g.odd ? "disabled" : ""}>${esc(w)}</button>`).join("")}</div>${g.odd ? `<p style="text-align:center">${g.odd === o[1] ? "Yes. " : "We picked " + esc(o[1]) + ". "}${esc(o[2])}</p>` : ""}`;
}
function jokesAndGames() {
  const u = dailyUnit();
  document.getElementById("sheetTitle").textContent = "Jokes and games";
  if (!u) return `<p class="note">Games come from the science chapter you're on. Add Science to see them.</p>`;
  const T = { word: ["Word of the Day", wordGame], tf: ["True or False", tfGame], odd: ["Odd One Out", oddGame] };
  return `<div class="hs">${u.c.x.jokes
    .map((j, i) => {
      const [q, a] = splitJoke(j),
        k = today + i;
      return `<button class="joke" data-act="joke" data-j="${k}"><span class="eyebrow">Joke ${i + 1}</span><span class="q">${esc(q)}</span>${ui.jokes[k] ? `<span class="a">${esc(a)}</span>` : `<span class="tap">Tap for the answer</span>`}</button>`;
    })
    .join("")}</div>
   <div class="seg">${Object.entries(T)
     .map(([k, [n]]) => `<button aria-pressed="${ui.game === k}" data-act="gtab" data-g="${k}">${n}</button>`)
     .join("")}</div><section class="col">${T[ui.game][1](u)}</section>
   <button class="btn ${S.tl[today + "|warm"] ? "soft" : "accent"}" data-act="tlcheck" data-id="warm" data-date="${today}">${S.tl[today + "|warm"] ? "Warm-up done ✓" : "Warm-up done"}</button>`;
}
function gamesView() {
  const id = fxWarmUnit(today),
    I = id && DATA.units[id];
  if (!I || !I.jokes?.length) return jokesAndGames();
  const J = I.jokes,
    k0 = (Math.floor(parse(today) / 864e5) * 3) % J.length,
    pick = [0, 1, 2].map((i) => J[(k0 + i) % J.length]).filter((j, i, a) => a.indexOf(j) === i);
  const sg = Object.values(DATA.songs || {}).find(
    (x) => (x.units || []).includes(id) || x.topic_level === I.song?.topic_level,
  );
  const jokes = `<p class="xs muted">From today's lesson: ${esc(I.title)}</p><div class="hs">${pick
    .map((j, i) => {
      const k = today + "u" + i;
      return `<button class="joke" data-act="joke" data-j="${k}"><span class="eyebrow">Joke ${i + 1}</span><span class="q">${esc(j[0])}</span>${ui.jokes[k] ? `<span class="a">${esc(j[1])}</span>` : `<span class="tap">Tap for the answer</span>`}</button>`;
    })
    .join("")}</div>`;
  const song = sg
    ? `<section class="card">${fxSongHtml(sg)}</section>`
    : `<p class="xs muted">🎵 Song: ${esc(I.song?.title || "")} (being written)</p>`;
  const rest = dailyUnit() ? jokesAndGames().replace(/^<div class="hs">[\s\S]*?<\/button><\/div>/, "") : "";
  return jokes + song + rest;
}
function lanes(date) {
  const items = dayPlan(date),
    d = D();
  if (!items.length) return `<p class="note">Nothing on the clock this day.</p>`;
  const t0 = Math.floor((Math.min(hm(d.prepAt), ...items.map((i) => i.at)) - 20) / 60) * 60,
    t1 = Math.ceil((Math.max(...items.map((i) => i.at + i.dur)) + 20) / 60) * 60,
    ppm = 1.2;
  const hrs = [];
  for (let h = t0; h < t1; h += 60)
    hrs.push(`<div class="hr" style="top:${(h - t0) * ppm}px">${clock(h).replace(":00", "")}</div>`);
  const b = (i) => {
    const lane =
      i.who === "you"
        ? "left:0;width:calc(50% - 3px)"
        : i.who === "kid"
          ? "right:0;width:calc(50% - 3px)"
          : "left:0;right:0";
    const col = i.kind === "lesson" ? SC(i.s) : "r-" + i.who;
    return `<div class="blk ${col} ${i.done ? "ok" : ""}" style="top:${(i.at - t0) * ppm + 1}px;height:${Math.max(20, i.dur * ppm - 3)}px;${lane}">${clock(i.at)} · ${esc(i.kind === "lesson" ? SUBJ[i.s] + ": " + i.u.title : i.title)}</div>`;
  };
  return `<div class="calhead"><span></span><span>${youBlob()}You</span><span>${kidBlob()}${esc(S.child || "Child")}</span></div><div class="cal" style="height:${(t1 - t0) * ppm}px">${hrs.join("")}<div class="lanes">${items.map(b).join("")}</div></div><p class="xs muted">Full-width blocks are things you do together.</p>`;
}
