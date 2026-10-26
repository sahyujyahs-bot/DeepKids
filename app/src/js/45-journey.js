/* ---------- Journey ---------- */
function subjStats(s) {
  const us = [...collate(s).dk, ...collate(s).board],
    tot = us.reduce((a, u) => a + sessionsFor(u), 0),
    dn = us.reduce((a, u) => a + (rank[coverage(u)] >= 2 ? sessionsFor(u) : Math.min(done(u.k), sessionsFor(u))), 0);
  return {
    us,
    pct: tot ? dn / tot : 0,
    sessions: dn,
    total: tot,
    completed: us.filter((u) => rank[coverage(u)] >= 2).length,
    learning: us.filter((u) => coverage(u) === "learning").length,
  };
}
function wsStats(u) {
  const sets = [
    ...(u.c?.x?.wsd ? [[u.k, u.c.x.wsd]] : []),
    ...(u.c?.p?.worksheets || []).map((w) => [u.k + "#" + w.id, w.sections]),
  ];
  if (!sets.length) return null;
  let tot = 0,
    ans = 0,
    mq = 0,
    mr = 0;
  sets.forEach(([k, W]) =>
    W.forEach(([_, its], si) =>
      its.forEach((it, ii) => {
        tot++;
        const v = A(k, si + "-" + ii);
        if (v !== undefined && v !== "" && !(typeof v === "object" && !Object.keys(v).length)) ans++;
        if (it.t === "mcq" && v !== undefined) {
          mq++;
          if (v === it.a) mr++;
        }
      }),
    ),
  );
  return { tot, ans, mq, mr };
}

function quotes(filter) {
  const out = [];
  Object.entries(S.ans || {}).forEach(([k, o]) => {
    const u = unitBy(k);
    if (!u || !u.c?.x || (filter && !filter(u))) return;
    Object.entries(o).forEach(([q, v]) => {
      if (/^think\d$/.test(q) && typeof v === "string" && v.trim().length > 3)
        out.push({ u, q: u.c.x.deep[+q.slice(5)]?.q, a: v.trim() });
    });
  });
  return out;
}
const AY0 = () => {
  const d = parse(today),
    y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  return iso(new Date(y, 3, 1));
};
function boardRows(s, b) {
  const us = collateAt(s, S.levels[s]).board.filter((u) => u.board === b);
  if (!us.length) return null;
  const frac = Math.min(1, Math.max(0, (parse(today) - parse(AY0())) / (365 * 864e5))),
    exp = Math.round(us.length * frac);
  return {
    us,
    exp,
    done: us.filter((u) => rank[coverage(u)] >= 2),
    prog: us.filter((u) => coverage(u) === "learning"),
    behind: us.slice(0, exp).filter((u) => rank[coverage(u)] < 2),
  };
}
function jsubView() {
  const s = ui.sheet.s,
    x = subjStats(s);
  document.getElementById("sheetTitle").textContent = SUBJ[s] + " journey";
  const kid = esc(S.child || "Your child");
  const logs = S.log.filter((l) => l.subj === s),
    Qs = quotes((u) => u.subj === s),
    W = workOf().filter((w) => unitBy(w.k)?.subj === s);
  let h = `<section class="chero ${SC(s)}" style="min-height:140px"><span class="eyebrow" style="color:#2B2340;opacity:.7">${lvlLabel(S.levels[s])}</span><h1>${Math.round(x.pct * 100)}% of this level</h1><p>${x.completed} chapters done · ${x.learning} in progress · ${x.sessions} of ${x.total} lesson days${logs.length ? ` · last on ${fmt(logs[0].date)}` : ""}</p>${sblob(s, "happy", "mascot sway")}</section>`;
  h += `<section class="card"><h3 style="font-size:19px">How well</h3>${(() => {
    let ans = 0,
      tot = 0,
      mq = 0,
      mr = 0,
      tk = 0,
      tt = 0;
    x.us.forEach((u) => {
      const w = wsStats(u);
      if (w) {
        ans += w.ans;
        tot += w.tot;
        mq += w.mq;
        mr += w.mr;
      }
      if (u.c?.x) {
        const ts = chapterTasks(u);
        tt += ts.length;
        tk += ts.filter((a) => taskDone(u.k, a[0])).length;
      }
    });
    return `<div class="stack3">${[
      [tot ? `${ans}/${tot}` : "–", "worksheet answers"],
      [mq ? Math.round((mr / mq) * 100) + "%" : "–", "multiple-choice right"],
      [tt ? `${tk}/${tt}` : "–", "tasks done"],
      [Qs.length, "big-question answers"],
    ]
      .map(([n, l]) => `<div class="rcardj"><b class="num">${n}</b><span class="xs muted">${l}</span></div>`)
      .join("")}</div>`;
  })()}</section>`;
  if (Qs.length || W.length)
    h += `<section class="card"><h3 style="font-size:19px">In ${kid}'s words</h3>${Qs.slice(-4)
      .reverse()
      .map(
        (q) =>
          `<div class="quote ${SC(s)}"><span class="eyebrow">${esc(q.q || "")}</span><p>“${esc(q.a)}”</p><span class="xs muted">${esc(q.u.title)}</span></div>`,
      )
      .join("")}${thumbs(W)}</section>`;
  boardsOn().forEach((b) => {
    const r = boardRows(s, b);
    if (!r) return;
    h += `<section class="card"><h3 style="font-size:19px">${BOARDS[b]}</h3><p class="xs muted">By this point in the school year, about ${r.exp} of ${r.us.length} chapters would usually be done.</p>${r.behind.length ? `<div><span class="eyebrow" style="color:var(--bad)">Not done yet, but due by now</span><div class="row" style="margin-top:6px">${r.behind.map((u) => `<button class="chip" data-act="chapter" data-k="${u.k}">${esc(u.title)}</button>`).join("")}</div></div>` : `<p class="sm" style="font-weight:800;color:var(--good)">On track for this point in the year.</p>`}${r.prog.length ? `<div><span class="eyebrow">In progress</span><div class="row" style="margin-top:6px">${r.prog.map((u) => `<button class="chip" data-act="chapter" data-k="${u.k}">${esc(u.title)}</button>`).join("")}</div></div>` : ""}</section>`;
  });
  const dk = x.us.filter((u) => u.board === "dk" && st(u.k) !== "none"),
    fr = [...new Set(logs.filter((l) => l.kind === "free").map((l) => l.title))];
  if (dk.length || fr.length)
    h += `<section class="card"><h3 style="font-size:19px">Learned beyond the board</h3><div class="row">${[...dk.map((u) => u.title), ...fr].map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div></section>`;
  h += `<section class="sec"><div class="sech"><h3>Every topic</h3><span class="xs muted">tap for details</span></div><div class="col" style="gap:8px">${x.us
    .map((u) => {
      const cs = coverage(u),
        ul = S.log.filter((l) => l.key === u.k),
        w = wsStats(u),
        ts = u.c?.x ? chapterTasks(u) : null,
        open = ui.jopen === u.k;
      return `<div class="topic ${SC(u.subj)}"><button class="plain trow" data-act="jopen" data-k="${u.k}"><span class="no">${/^\d+$/.test(u.n) ? u.n : esc(u.n)}</span><span style="min-width:0"><b>${esc(u.title)}</b><br><span class="xs muted">${u.board === "dk" ? "DeepKids Plus" : BOARDS[u.board]} · Class ${DATA.levels[u.level].cls} · L${u.level}</span></span>${pillS(cs)}</button>${open ? `<div class="tdet"><div class="kv"><span>Lesson days</span><b>${Math.min(done(u.k), sessionsFor(u))} of ${sessionsFor(u)}</b><span>Started</span><b>${ul.length ? fmt(ul[ul.length - 1].date) : "Not yet"}</b><span>Last session</span><b>${ul.length ? fmt(ul[0].date) : "–"}</b>${ts ? `<span>Tasks</span><b>${ts.filter((a) => taskDone(u.k, a[0])).length} of ${ts.length}</b>` : ""}${w ? `<span>Worksheet</span><b>${w.ans} of ${w.tot} answered${w.mq ? `, ${w.mr}/${w.mq} choices right` : ""}</b>` : ""}${u.dk?.length ? `<span>DeepKids links</span><b>${u.dk.map((id) => esc(DATA.topics.find((t) => t.id === id)?.name || id)).join(", ")}</b>` : ""}</div>${thumbs(workOf(u.k))}<div class="row"><button class="btn soft sm" data-act="chapter" data-k="${u.k}">Open chapter</button>${photoBtn(u.k)}</div></div>` : ""}</div>`;
    })
    .join("")}</div></section>`;
  const c = collate(s);
  h += `<section class="sec"><div class="sech"><h3>Learning path</h3></div>${c.dk.length ? pathMap(c.dk, (u) => st(u.k)) : ""}${[
    ...new Set(c.board.map((u) => u.book)),
  ]
    .map(
      (b) =>
        `<p class="eyebrow">${esc(b)}</p>${pathMap(
          c.board.filter((u) => u.book === b),
          coverage,
        )}`,
    )
    .join("")}</section>`;
  return h;
}
