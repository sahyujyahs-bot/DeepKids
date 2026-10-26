/* ---------- tracking ---------- */
const CHC = {
  math: "#2A8FB0",
  eng: "#C24F8A",
  hin: "#D98A2B",
  sci: "#3F8A4F",
  dks: "#6E6CC9",
  wml: "#C9A227",
  wart: "#C24F8A",
};
const hmin = (m) => {
  m = Math.round(m);
  return m < 60 ? m + " min" : Math.floor(m / 60) + " h" + (m % 60 ? " " + (m % 60) + " m" : "");
};
function addMins(k, sec) {
  const u = unitByK(String(k || "").replace(/^x/, ""));
  if (!u) return;
  S.mins = S.mins || {};
  const key = today + "|" + u.subj;
  S.mins[key] = Math.round(((S.mins[key] || 0) + sec / 60) * 10) / 10;
}
function trackData() {
  const D = {},
    day = (d) => (D[d] = D[d] || { m: {}, e: {}, did: [] }),
    add = (d, s, f, m) => {
      const x = day(d);
      x[f][s] = (x[f][s] || 0) + m;
    };
  Object.entries(S.mins || {}).forEach(([k, m]) => {
    const [d, s] = k.split("|");
    add(d, s, "m", m);
  });
  (S.pace || []).forEach((p) => {
    const u = unitByK(p.k);
    if (!u || S.mins?.[p.date + "|" + u.subj] !== undefined) return;
    add(p.date, u.subj, "m", p.took || 0);
  });
  S.log
    .slice()
    .reverse()
    .forEach((l) => {
      if (l.kind === "free" && !l.title) return;
      const x = day(l.date),
        u = unitByK(l.key);
      if (!x.m[l.subj] && l.kind !== "skipped") add(l.date, l.subj, "e", lessonMins(l.subj, l.date));
      x.did.push({ t: "lesson", s: l.subj, u, n: l.n, title: l.title, at: l.at, sk: l.kind === "skipped" });
    });
  Object.entries(S.tasks || {}).forEach(([k, o]) =>
    Object.entries(o).forEach(([id, d]) => {
      if (typeof d !== "string" || !/^\d{4}-/.test(d)) return;
      const [uk, w] = k.split("#"),
        u = unitByK(uk);
      if (!u) return;
      if (id === "ws") {
        const pw = w && u.c?.p?.worksheets?.find((z) => z.id === w);
        day(d).did.push({ t: "ws", s: u.subj, u, title: pw ? pw.title : "Worksheet" });
      }
    }),
  );
  Object.entries(WK()).forEach(([key, w]) => {
    const j = key.lastIndexOf("|"),
      u = unitByK(key.slice(0, j));
    if (!u) return;
    if (w.started && w.st !== "done") day(w.started).did.push({ t: "start", s: u.subj, u, title: w.title });
    if (w.done) day(w.done).did.push({ t: "proj", s: u.subj, u, title: w.title });
  });
  Object.entries(S.quiz || {}).forEach(([key, q]) => {
    const j = key.lastIndexOf("|"),
      u = unitByK(key.slice(0, j)),
      its = Object.values(q);
    if (!u || !its.length) return;
    const d = its
      .map((x) => x.d)
      .sort()
      .pop();
    day(d).did.push({
      t: "quiz",
      s: u.subj,
      u,
      n: +key.slice(j + 1),
      title: `${its.filter((x) => x.r).length} of ${its.length} got it`,
    });
  });
  (S.work || []).forEach((w) => {
    if (w.date) day(w.date).did.push({ t: "up", w, u: w.k && unitByK(w.k), s: w.k && unitByK(w.k)?.subj });
  });
  Object.entries(S.evlog || {}).forEach(([k, r]) => {
    const j = k.indexOf("|"),
      e = evFind(k.slice(j + 1));
    day(k.slice(0, j)).did.push({ t: "ev", title: e?.title || "Class", r });
  });
  (S.exps || []).forEach((e) => (e.checks || []).forEach((d) => day(d).did.push({ t: "check", title: e.title })));
  return D;
}
const dTot = (x) => Object.values(x.m).reduce((a, b) => a + b, 0) + Object.values(x.e).reduce((a, b) => a + b, 0);
function didLine(x) {
  const ch = x.u ? esc(chT(x.u)) : "";
  return x.t === "lesson"
    ? `<li><b>${ch}</b>${x.n ? ` · Part ${x.n}` : ""}${x.sk ? " (skipped)" : ""}${x.at != null ? ` <span class="xs muted">${clock(x.at)}</span>` : ""}</li>`
    : x.t === "ws"
      ? `<li>Worksheet finished: ${esc(x.title)} <span class="xs muted">${ch}</span></li>`
      : x.t === "quiz"
        ? `<li>Quiz, Part ${x.n}: ${esc(x.title)} <span class="xs muted">${ch}</span></li>`
        : x.t === "proj"
          ? `<li>Finished: ${esc(x.title)} <span class="xs muted">${ch}</span></li>`
          : x.t === "start"
            ? `<li>Started: ${esc(x.title)} <span class="xs muted">${ch}</span></li>`
            : x.t === "ev"
              ? evLogLine(x)
              : x.t === "check"
                ? `<li>Checked on: ${esc(x.title)}</li>`
                : "";
}
function trackChart(T) {
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13)),
    subs = SUBJ_KEYS.filter((s) => days.some((d) => T[d] && (T[d].m[s] || 0) + (T[d].e[s] || 0) > 0)),
    mx = Math.max(30, ...days.map((d) => (T[d] ? dTot(T[d]) : 0))),
    top = Math.ceil(mx / 30) * 30;
  if (!subs.length)
    return `<p class="note">No study time in the last two weeks yet. Time is measured as you go through lessons.</p>`;
  return `<div class="tlegend">${subs.map((s) => `<span><i style="background:${CHC[s]}"></i>${esc(SUBJ[s])}</span>`).join("")}<span class="xs muted"><i class="est"></i>Lighter: planned time, not timed</span></div>
  <div class="tchart" role="img" aria-label="Minutes studied each day for the last 14 days"><div class="tgrid"><span style="bottom:100%">${hmin(top)}</span><span style="bottom:50%">${hmin(top / 2)}</span><span style="bottom:0">0</span></div>
  <div class="tbars">${days
    .map((d) => {
      const x = T[d] || { m: {}, e: {} },
        t = dTot(x),
        segs = subs
          .flatMap((s) => [
            [s, x.m[s] || 0, 0],
            [s, x.e[s] || 0, 1],
          ])
          .filter((z) => z[1] > 0),
        tip =
          `${fmt(d)} · ${hmin(t)}` +
          subs
            .filter((s) => (x.m[s] || 0) + (x.e[s] || 0))
            .map((s) => `\n${SUBJ[s]}: ${hmin((x.m[s] || 0) + (x.e[s] || 0))}${x.e[s] && !x.m[s] ? " (planned)" : ""}`)
            .join("");
      return `<div class="tcol" data-tip="${esc(t ? tip : fmt(d) + " · no study")}" tabindex="0"><div class="tstack" style="height:${(t / top) * 100}%">${segs.map(([s, m, e]) => `<i style="flex:${m};background:${CHC[s]};${e ? "opacity:.45" : ""}"></i>`).join("")}</div><span class="tx ${d === today ? "on" : ""}">${parse(d).getDate()}</span></div>`;
    })
    .join("")}</div></div>`;
}
function trackView() {
  document.getElementById("sheetTitle").textContent = "Tracking";
  const T = trackData(),
    ds = Object.keys(T)
      .filter((d) => d <= today)
      .sort()
      .reverse(),
    study = ds.filter((d) => dTot(T[d]) > 0 || T[d].did.some((x) => x.t === "lesson"));
  const all = study.reduce((a, d) => a + dTot(T[d]), 0),
    wk = study.filter((d) => d > addDays(today, -7)).reduce((a, d) => a + dTot(T[d]), 0),
    fin = Object.keys(S.progress || {}).filter((k) => st(k) === "completed").length,
    sub = {};
  study.forEach((d) =>
    SUBJ_KEYS.forEach((s) => {
      const m = (T[d].m[s] || 0) + (T[d].e[s] || 0),
        n = T[d].did.filter((x) => x.t === "lesson" && x.s === s).length;
      if (m || n) {
        sub[s] = sub[s] || { m: 0, n: 0, days: 0 };
        sub[s].m += m;
        sub[s].n += n;
        sub[s].days++;
      }
    }),
  );
  const smax = Math.max(1, ...Object.values(sub).map((x) => x.m));
  let h = `<div class="tiles"><div class="tile"><b>${hmin(all)}</b><span>studied in all</span></div><div class="tile"><b>${study.length}</b><span>study days</span></div><div class="tile"><b>${hmin(study.length ? all / study.length : 0)}</b><span>a study day, on average</span></div><div class="tile"><b>${hmin(wk)}</b><span>in the last 7 days</span></div><div class="tile"><b>${fin}</b><span>chapters finished</span></div></div>`;
  h += `<section class="sec"><div class="sech"><h3 style="font-size:18px">Last two weeks</h3></div>${trackChart(T)}</section>`;
  h += `<section class="sec"><div class="sech"><h3 style="font-size:18px">By subject</h3><span class="xs muted">all time</span></div>${
    Object.keys(sub).length
      ? `<div class="col" style="gap:10px">${SUBJ_KEYS.filter((s) => sub[s])
          .map(
            (s) =>
              `<div class="hbar"><span class="sm"><b>${esc(SUBJ[s])}</b> · ${hmin(sub[s].m)} · ${sub[s].n} lesson${sub[s].n === 1 ? "" : "s"} on ${sub[s].days} day${sub[s].days === 1 ? "" : "s"}</span><div class="hb"><i style="width:${(sub[s].m / smax) * 100}%;background:${CHC[s]}"></i></div></div>`,
          )
          .join("")}</div>`
      : `<p class="xs muted">Nothing yet.</p>`
  }</section>`;
  const lim = ui.tlim || 21;
  h += `<section class="sec"><div class="sech"><h3 style="font-size:18px">Day by day</h3><span class="xs muted">${ds.length} days with activity</span></div>${
    ds
      .slice(0, lim)
      .map((d) => {
        const x = T[d],
          t = dTot(x),
          subs = SUBJ_KEYS.filter((s) => x.m[s] || x.e[s]),
          ups = x.did.filter((z) => z.t === "up");
        return `<details class="card tday" ${d === ds[0] ? "open" : ""}><summary><b>${esc(fmt(d))}</b> <span class="sm muted">· ${t ? hmin(t) : "no timed study"}</span><div class="row" style="gap:6px;margin-top:4px">${subs.map((s) => `<span class="chip ${SC(s)}" style="pointer-events:none">${esc(SUBJ[s])} ${hmin((x.m[s] || 0) + (x.e[s] || 0))}${x.m[s] ? "" : " planned"}</span>`).join("")}</div></summary><ul class="sm" style="padding-left:18px;margin:8px 0 0">${x.did
          .filter((z) => z.t !== "up")
          .map(didLine)
          .join("")}${
          ups.length
            ? `<li>${ups.length} upload${ups.length > 1 ? "s" : ""}: ${ups
                .slice(0, 3)
                .map((z) => esc(z.w.title || z.w.name || ""))
                .join(", ")}</li>`
            : ""
        }</ul></details>`;
      })
      .join("") || `<p class="note">Your days show here as you study.</p>`
  }${ds.length > lim ? `<button class="link" data-act="tmore">Show older days</button>` : ""}</section>`;
  return h;
}
let TIP = null;
function tipAt(el) {
  if (!TIP) {
    TIP = document.createElement("div");
    TIP.id = "tip";
    document.body.appendChild(TIP);
  }
  TIP.textContent = el.dataset.tip;
  TIP.style.display = "block";
  const r = el.getBoundingClientRect(),
    w = TIP.offsetWidth;
  TIP.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + "px";
  TIP.style.top = Math.max(8, r.top - TIP.offsetHeight - 8) + "px";
}
document.addEventListener("pointerover", (e) => {
  const t = e.target.closest?.("[data-tip]");
  if (t) tipAt(t);
  else if (TIP) TIP.style.display = "none";
});
document.addEventListener("focusin", (e) => {
  const t = e.target.closest?.("[data-tip]");
  if (t) tipAt(t);
});
document.addEventListener(
  "scroll",
  () => {
    if (TIP) TIP.style.display = "none";
  },
  true,
);
