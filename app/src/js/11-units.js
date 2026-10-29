/* DeepKids-track units: the feed, what counts as done, the unit planner, prep and buy lists */
/* parent mode shows what to do and say; child mode speaks to the child. ❤ saves a card, 🔊 reads it, 💬 asks DeepKids AI about it. */
const FXE = {
  summary: "✨",
  intro: "👀",
  story: "📖",
  terms: "🔤",
  explanations: "💡",
  agreed: "🤝",
  how_we_found_out: "🕰️",
  challenging: "⚖️",
  big_questions: "🌌",
  roots: "🪷",
  games: "🎲",
  experiments: "🧪",
  activities: "🤸",
  projects: "🛠️",
  challenges: "🧩",
  worksheets: "📝",
  videos: "▶️",
  quiz: "❓",
  jokes: "😂",
  maths: "➗",
  applications: "⚙️",
  spotted: "🔍",
  photos: "📷",
  open_questions: "🔭",
  ask_kids: "🗣️",
  links: "🌐",
  buy: "🛒",
  song: "🎵",
};
const FXN = {
  games: "Game",
  experiments: "Experiment",
  activities: "Activity",
  projects: "Project",
  challenges: "Challenge",
};
const fxSt = () => {
  S.fx = S.fx || { mode: "parent", pos: {}, done: {}, saved: {}, ref: {}, score: {} };
  for (const k of ["pos", "done", "saved", "ref", "score", "time"]) S.fx[k] = S.fx[k] || {};
  return S.fx;
};
let FXCUR = 0,
  FXU = null,
  FXCARDS = [],
  FXOBS = null;
function fxImg(u, key, brief, cls) {
  const url = u.img?.[key],
    em = FXE[key.split(".")[0]] || "🎨";
  if (!url && !brief) return "";
  return url
    ? `<div class="fximg ${cls || ""}" data-e="${em}"><img loading="lazy" alt="${esc(brief || "")}" src="${esc(url)}" onerror="this.parentNode.classList.add('broken')"></div>`
    : `<div class="fxph ${cls || ""}"><span>${em}</span>${brief ? `<i>${esc(brief)}</i>` : ""}</div>`;
}
const FXPAL = ["#FD8326", "#4CC9C0", "#8C93C7", "#53A373", "#FF8BB4", "#6DB4F2", "#FFD65C", "#B6D693"];
function fxChart(c) {
  if (!c) return "";
  const T = c.title ? `<p class="fxct">${esc(c.title)}</p>` : "",
    D = c.data || [];
  if (c.type === "table")
    return `<figure class="fxchart">${T}<div class="fxtbl"><table><tr>${(c.cols || []).map((h) => `<th>${esc(h)}</th>`).join("")}</tr>${(c.rows || []).map((r) => `<tr>${r.map((x) => `<td>${esc(x)}</td>`).join("")}</tr>`).join("")}</table></div></figure>`;
  if (c.type === "pie") {
    const tot = D.reduce((a, d) => a + d.value, 0) || 1;
    let a0 = -Math.PI / 2;
    const seg = D.map((d, i) => {
      const a1 = a0 + (2 * Math.PI * d.value) / tot,
        big = a1 - a0 > Math.PI ? 1 : 0,
        p = [
          [60 + 50 * Math.cos(a0), 60 + 50 * Math.sin(a0)],
          [60 + 50 * Math.cos(a1), 60 + 50 * Math.sin(a1)],
        ];
      a0 = a1;
      return `<path d="M60 60 L${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)} A50 50 0 ${big} 1 ${p[1][0].toFixed(1)} ${p[1][1].toFixed(1)} Z" fill="${FXPAL[i % 8]}" stroke="#fff" stroke-width="2"/>`;
    }).join("");
    return `<figure class="fxchart">${T}<div class="fxpie"><svg viewBox="0 0 120 120" role="img" aria-label="${esc(c.title || "pie chart")}">${seg}<circle cx="60" cy="60" r="24" fill="var(--bg)"/></svg><ul>${D.map((d, i) => `<li><i style="background:${FXPAL[i % 8]}"></i>${esc(d.label)} <b>${esc(d.value)}${c.unit || "%"}</b></li>`).join("")}</ul></div></figure>`;
  }
  if (c.type === "scale") {
    const mn = c.min ?? 0,
      mx = c.max ?? 10,
      st = c.step || 1,
      W = 300,
      x = (v) => 20 + ((W - 40) * (v - mn)) / (mx - mn);
    let ticks = "";
    for (let v = mn; v <= mx + 1e-9; v += st) {
      const major = Math.abs(v - Math.round(v)) < 1e-9;
      ticks += `<line x1="${x(v)}" x2="${x(v)}" y1="40" y2="${major ? 62 : 52}" stroke="#2B2340" stroke-width="${major ? 2 : 1}"/>${major ? `<text x="${x(v)}" y="78" font-size="12" text-anchor="middle" fill="#2B2340">${v}</text>` : ""}`;
    }
    return `<figure class="fxchart">${T}<svg viewBox="0 0 ${W} 110" role="img" aria-label="${esc(c.title || "scale")}"><rect x="8" y="30" width="${W - 16}" height="56" rx="12" fill="#FFF3D6" stroke="#E9C9A0" stroke-width="2"/>${ticks}${c.value != null ? `<polygon points="${x(c.value)},38 ${x(c.value) - 8},18 ${x(c.value) + 8},18" fill="#F2575A"/><line x1="${x(c.value)}" x2="${x(c.value)}" y1="36" y2="66" stroke="#F2575A" stroke-width="3"/>` : ""}<text x="${W - 14}" y="102" font-size="12" text-anchor="end" fill="#7C7088">${esc(c.unit || "")}</text></svg></figure>`;
  }
  const mx = Math.max(1, ...D.map((d) => +d.value || 0)),
    stp = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500, 1000].find((v) => v * 4 >= mx) || Math.ceil(mx / 4),
    nice = stp * 4,
    H = 170,
    W = Math.max(300, D.length * 78),
    bw = Math.min(46, ((W - 50) / D.length) * 0.62),
    y = (v) => 20 + (H - 20) * (1 - v / nice),
    xs = (i) => 44 + ((i + 0.5) * (W - 54)) / D.length;
  let grid = "";
  for (let k = 0; k <= 4; k++) {
    const v = stp * k;
    grid += `<line x1="40" x2="${W - 6}" y1="${y(v)}" y2="${y(v)}" stroke="#F0E2D2"/><text x="34" y="${y(v) + 4}" font-size="11" text-anchor="end" fill="#7C7088">${v}</text>`;
  }
  const marks =
    c.type === "line"
      ? `<polyline fill="none" stroke="#FD8326" stroke-width="3" stroke-linejoin="round" points="${D.map((d, i) => xs(i) + "," + y(d.value)).join(" ")}"/>${D.map((d, i) => `<circle cx="${xs(i)}" cy="${y(d.value)}" r="4.5" fill="#FD8326"/>`).join("")}`
      : D.map(
          (d, i) =>
            `<rect x="${xs(i) - bw / 2}" y="${y(d.value)}" width="${bw}" height="${H - y(d.value)}" rx="6" fill="${FXPAL[i % 8]}"/><text x="${xs(i)}" y="${y(d.value) - 6}" font-size="13" font-weight="700" text-anchor="middle" fill="#2B2340">${esc(d.value)}</text>`,
        ).join("");
  return `<figure class="fxchart">${T}<div class="fxsvgw"><svg viewBox="0 0 ${W} ${H + 52}" role="img" aria-label="${esc(c.title || "chart")}">${grid}${marks}${D.map(
    (d, i) => {
      const w = String(d.label).split(" "),
        h = Math.ceil(w.length / 2),
        l1 = w.slice(0, h).join(" "),
        l2 = w.slice(h).join(" ");
      return `<text x="${xs(i)}" y="${H + 15}" font-size="11.5" text-anchor="middle" fill="#2B2340">${d.emoji ? esc(d.emoji) + " " : ""}${esc(l1)}${l2 ? `<tspan x="${xs(i)}" dy="13">${esc(l2)}</tspan>` : ""}</text>`;
    },
  ).join(
    "",
  )}<text x="${(W + 40) / 2}" y="${H + 44}" font-size="11" text-anchor="middle" fill="#7C7088">${esc(c.x || "")}</text></svg></div>${c.y ? `<p class="fxsm fxyl">↑ ${esc(c.y)}</p>` : ""}</figure>`;
}
/* drawn step scenes: "ramp" (a board lifted on books, with a ruler) and "pull" (something pulled with a forcemeter) */
function fxObj(kind, x, y, ang) {
  const t = `translate(${x} ${y}) rotate(${ang})`;
  if (kind === "sock")
    return `<g transform="${t}"><path d="M-22 -26 h16 v14 q0 10 12 10 h14 q6 0 6 6 v4 h-48 z" fill="#FF8BB4" stroke="#2B2340" stroke-width="2"/></g>`;
  if (kind === "box" || kind === "sledge")
    return `<g transform="${t}"><rect x="-26" y="-30" width="52" height="30" rx="4" fill="#E9C9A0" stroke="#2B2340" stroke-width="2"/>${kind === "sledge" ? `<path d="M-30 0 h60 q6 0 8 -6" fill="none" stroke="#2B2340" stroke-width="3"/>` : `<path d="M-26 -18 h52" stroke="#C9A97E" stroke-width="2"/>`}</g>`;
  if (kind === "brick")
    return `<g transform="${t}"><rect x="-28" y="-18" width="56" height="18" rx="2" fill="#D9661A" stroke="#2B2340" stroke-width="2"/></g>`;
  return `<g transform="${t}"><path d="M-28 0 h56 q4 -14 -10 -16 l-14 -2 q-6 -12 -18 -12 h-8 q-8 0 -8 10 z" fill="#53A373" stroke="#2B2340" stroke-width="2"/><rect x="-28" y="-4" width="58" height="5" rx="2" fill="#2B2340"/></g>`;
}
function fxScene(sc) {
  const W = 300,
    H = 190,
    fl = 170;
  if (sc.scene === "pull") {
    const surf =
      sc.surface === "sand"
        ? `<rect x="0" y="${fl}" width="${W}" height="20" fill="#F2D59B"/>${[...Array(30)].map((_, i) => `<circle cx="${(i * 37) % W}" cy="${fl + 4 + ((i * 7) % 12)}" r="1.6" fill="#C9A060"/>`).join("")}`
        : sc.surface === "carpet"
          ? `<rect x="0" y="${fl}" width="${W}" height="20" fill="#B9A3D9"/>`
          : `<rect x="0" y="${fl}" width="${W}" height="20" fill="#E9DCC6"/>`;
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(sc.caption || "pulling with a forcemeter")}">${surf}${fxObj(sc.object || "shoe", 70, fl, 0)}<line x1="98" y1="${fl - 10}" x2="160" y2="${fl - 30}" stroke="#2B2340" stroke-width="2"/>
      <g transform="translate(160 ${fl - 42})"><rect x="0" y="0" width="80" height="24" rx="10" fill="#FFF3D6" stroke="#2B2340" stroke-width="2"/><path d="M8 12 l6 -7 l6 14 l6 -14 l6 14 l6 -14 l6 7" fill="none" stroke="#7C7088" stroke-width="2"/>${sc.reading != null ? `<text x="40" y="-8" text-anchor="middle" font-size="15" font-weight="800" fill="#D9661A">${esc(sc.reading)} N</text>` : ""}</g>
      <circle cx="254" cy="${fl - 30}" r="13" fill="#C68A5E" stroke="#2B2340" stroke-width="2"/><path d="M200 ${fl - 60} h40 l-8 -6 m8 6 l-8 6" fill="none" stroke="#FD8326" stroke-width="3" stroke-linecap="round"/></svg>`;
  }
  const h = Math.min(110, (sc.height || 0) * 7.5),
    ax = 40,
    bx = 250,
    ang = Math.atan2(h, bx - ax),
    deg = (-ang * 180) / Math.PI,
    len = Math.hypot(bx - ax, h),
    f = sc.slide ? 0.22 : 0.7,
    ox = ax + Math.cos(ang) * len * f,
    oy = fl - Math.sin(ang) * len * f - 6;
  const books =
    h > 0
      ? [...Array(Math.max(1, Math.round(h / 16)))]
          .map(
            (_, i) =>
              `<rect x="${bx - 18}" y="${fl - (i + 1) * Math.min(16, h / Math.max(1, Math.round(h / 16)))}" width="40" height="${Math.min(16, h / Math.max(1, Math.round(h / 16))) - 1}" rx="2" fill="${["#6DB4F2", "#FF8BB4", "#FFD65C", "#4CC9C0", "#8C93C7", "#B6D693", "#FD8326"][i % 7]}" stroke="#2B2340" stroke-width="1"/>`,
          )
          .join("")
      : "";
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(sc.caption || "a board lifted at one end")}"><rect x="0" y="${fl}" width="${W}" height="20" fill="#E9DCC6"/>${books}
    <line x1="${ax}" y1="${fl - 3}" x2="${bx}" y2="${fl - h - 3}" stroke="#A8794A" stroke-width="8" stroke-linecap="round"/>${fxObj(sc.object || "shoe", ox, oy, deg)}
    ${sc.slide ? `<path d="M${ox + 34} ${oy - 18} l16 ${-16 * Math.tan(ang)} M${ox + 38} ${oy - 6} l16 ${-16 * Math.tan(ang)}" stroke="#FD8326" stroke-width="3" stroke-linecap="round"/>` : ""}
    ${sc.lift ? `<path d="M${bx + 28} ${fl - h + 8} v-30 m-6 8 l6 -8 l6 8" fill="none" stroke="#FD8326" stroke-width="3" stroke-linecap="round"/>` : ""}
    ${sc.ruler ? `<rect x="${bx + 30}" y="${fl - 115}" width="14" height="115" fill="#FFF3D6" stroke="#2B2340" stroke-width="1.5"/>${[...Array(12)].map((_, i) => `<line x1="${bx + 30}" x2="${bx + (i % 5 ? 36 : 40)}" y1="${fl - i * 10}" y2="${fl - i * 10}" stroke="#2B2340"/>`).join("")}<line x1="${bx + 22}" x2="${bx + 48}" y1="${fl - h - 3}" y2="${fl - h - 3}" stroke="#F2575A" stroke-width="2.5"/><text x="${bx + 14}" y="${fl - h - 8}" font-size="13" font-weight="800" text-anchor="end" fill="#F2575A">${esc(sc.height)} cm</text>` : ""}</svg>`;
}
function fxSetup(u, x, small) {
  const L = x?.setup || [];
  if (!L.length) return "";
  return `<div class="fxsetup${small ? " small" : ""}">${small ? `<p class="fxsm"><b>See how it's done:</b> ${esc(x.title)}</p>` : `<p class="fxeb">How it's done</p>`}<div class="fxsetrow">${L.map((st, i) => `<figure>${st.scene ? fxScene(st) : fxImg(u, `setup.${x.id}.${i}`, st.art || "", "fxsq")}<figcaption>${esc(st.caption || "")}</figcaption></figure>`).join("")}</div></div>`;
}
const fxHow = (u, o) => {
  if (o?.show?.length)
    return fxSetup(u, { setup: o.show, title: "", id: "show" }, true).replace(
      "<b>How the  works:</b>",
      "<b>What happens:</b>",
    );
  if (!o?.how) return "";
  for (const k of Object.keys(FXN)) for (const x of u[k] || []) if (x.id === o.how) return fxSetup(u, x, true);
  return "";
};
const fxCtx = (x) => (x?.context ? `<p class="fxctx2">${esc(x.context)}</p>` : "");
function fxSongHtml(sg) {
  return `<span class="fxeb">🎵 Song · about ${Math.round((sg.seconds || 0) / 60)} min</span><h2>${esc(sg.title)}</h2><p class="fxsm">Words: ${esc(sg.lyrics_by)}. Music: a first draft made by DeepKids; play it and sing along.</p>
  ${sg.audio ? `<audio class="fxaudio" controls preload="none" src="${sg.audio}"></audio>` : ""}
  <div class="fxlyr">${sg.sections
    .map(
      (sec) =>
        `<div class="fxsec"><span class="fxeb">${esc(sec.name)}</span>${sec.lines
          .map((l) => {
            const c = (sg.chords || []).find((x) => x.text === l);
            return `<p>${c ? `<span class="fxchd">${esc(c.chords.join(" "))}</span>` : ""}${esc(l)}</p>`;
          })
          .join("")}</div>`,
    )
    .join("")}</div>
  ${sg.abc ? `<button class="fxb" aria-pressed="false" data-fx="sheet" data-id="${esc(sg.id)}">🎼 Show the sheet music</button><div class="fxsheet" hidden></div>` : ""}`;
}
function fxSheet(b) {
  const sg = DATA.songs?.[b.dataset.id],
    box = b.nextElementSibling;
  box.hidden = false;
  b.remove();
  const draw = () => {
    try {
      window.ABCJS.renderAbc(box, sg.abc, { responsive: "resize", add_classes: true });
    } catch (e) {
      box.innerHTML = `<pre>${esc(sg.abc)}</pre>`;
    }
  };
  if (window.ABCJS) return draw();
  box.textContent = "Loading the sheet music…";
  const sc = document.createElement("script");
  sc.src = "https://cdn.jsdelivr.net/npm/abcjs@6.4.4/dist/abcjs-basic-min.js";
  sc.onload = draw;
  sc.onerror = () => {
    box.innerHTML = `<p class="fxsm">Couldn't load the music drawing. Here it is as text:</p><pre>${esc(sg.abc)}</pre>`;
  };
  document.head.appendChild(sc);
}
function fxOpenSong(id) {
  const sg = DATA.songs?.[id];
  if (!sg) return;
  let d = document.getElementById("fxDlg");
  if (!d) {
    d = document.createElement("dialog");
    d.id = "fxDlg";
    d.className = "fxdlg";
    document.body.appendChild(d);
    d.addEventListener("click", fxClick);
    d.addEventListener("cancel", (e) => {
      e.preventDefault();
      fxClose();
    });
  }
  FXSI = -2;
  d.innerHTML = `<div class="fxtop"><button class="fxx" data-fx="close" aria-label="Close">✕</button><div class="fxbar"><i style="width:100%"></i></div></div><div class="fxmap"><div class="fxin"><div class="fxtxt">${fxSongHtml(sg)}</div></div></div>`;
  if (!d.open) d.showModal();
}
function fxFlowCards(u, kind, x) {
  const C = [],
    n = x.flow.length;
  C.push({
    key: "flow." + x.id,
    kind,
    html: `${fxImg(u, "flow." + x.id, x.title)}<div class="fxtxt"><span class="fxeb">${FXE[kind]} ${FXN[kind]} · ${x.mins} min${x.days > 1 ? ` · ${x.days} days` : ""}</span><h2>${esc(x.title)}</h2>${fxCtx(x)}${fxSetup(u, x)}
    ${x.problem ? `<p>${esc(x.problem)}</p>` : ""}${x.question ? `<p><b>Question:</b> ${esc(x.question)}</p>` : ""}${x.predict ? `<p><b>Predict first:</b> ${esc(x.predict)}</p>` : ""}${x.fair_test ? `<p class="fxpo"><b>Fair test:</b> ${esc(x.fair_test)}</p>` : ""}
    ${
      (x.materials || []).length
        ? `<div class="fxneed"><b>You need</b>${x.materials
            .map((m) => {
              const it = typeof m === "string" ? m : m.item,
                bb = m.buy && u.buy.find((b) => b.id === m.buy);
              return `<span>• ${esc(it)}${bb ? ` <a target="_blank" rel="noopener" href="${esc(bb.url)}">🛒 get it</a>` : ""}</span>`;
            })
            .join("")}</div>`
        : ""
    }${x.players ? `<p class="fxsm"><b>Players:</b> ${esc(x.players)}</p>` : ""}
    ${x.safety ? `<p class="fxsm">⚠️ ${esc(x.safety)}</p>` : ""}${x.days > 1 && x.schedule ? `<p class="fxsm"><b>Over ${x.days} days:</b> ${x.schedule.map((s) => `Day ${s.day}: ${esc(s.what)}`).join(" · ")}</p>` : ""}
    ${x.printables ? `<button class="fxb" data-fx="print" data-id="${x.id}">🖨️ Print the game</button>` : ""}${x.example_chart ? `<p class="fxsm"><b>What results might look like (made-up example):</b></p>${fxChart(x.example_chart)}` : ""}<p class="fxhint">Scroll for ${x.printables ? "the game pieces and " : ""}the ${n} steps ↓</p></div>`,
  });
  if (x.printables)
    C.push({
      key: "pieces." + x.id,
      kind,
      html: `<div class="fxtxt"><span class="fxeb">🃏 ${esc(x.title)} · the game pieces</span><p class="fxsm">Print them, or play straight from the screen. Tap a card to pick it.</p>${x.printables.map((p) => `<h3>${esc(p.title)}</h3><div class="fxpieces ${p.kind.replace(/\W/g, "")}">${p.items.map((it, j) => `<div class="fxpc" data-fx="flip" style="--h:${(j * 47) % 360}">${p.kind === "tokens" ? "💡" : esc(it)}</div>`).join("")}</div>`).join("")}<h3>How to play</h3><ol>${x.rules.map((r) => `<li>${esc(r)}</li>`).join("")}</ol><button class="fxb" data-fx="print" data-id="${x.id}">🖨️ Print the pieces</button></div>`,
    });
  x.flow.forEach((s, i) =>
    C.push({
      key: `step.${x.id}.${s.id}`,
      kind,
      step: s,
      html: `<div class="fxtxt fxstep"><span class="fxeb">${FXE[kind]} ${esc(x.title)} · step ${i + 1} of ${n} · ${s.mins} min</span>
    ${fxCtx(s)}${fxHow(u, s)}${s.adult ? `<p class="fxadult">🧑 A grown-up needs to be here for this step.</p>` : ""}
    <div class="pm"><p><b>Do:</b> ${esc(s.do || "")}</p>${s.say ? `<p class="fxsay">“${esc(s.say)}”</p>` : ""}${(s.ask || []).map((a) => `<details class="fxask"><summary>Ask: ${esc(a.q)}</summary><p class="fxsm">Good answers: ${a.good.map(esc).join("; ")}</p></details>`).join("")}${s.parent ? `<p class="fxpo">For you: ${esc(s.parent)}</p>` : ""}</div>
    <div class="km"><p class="fxkid">${esc(s.kid)}</p></div>${fxChart(s.chart)}
    ${s.check ? fxMcq(u, `chk.${x.id}.${s.id}`, s.check.q, s.check.options, s.check.a, s.check.why || "", s.check) : ""}${s.wait ? `<p class="fxsm">⏳ ${esc(s.wait)}: DeepKids brings this back on the right day.</p>` : ""}
    ${s.think ? `<p class="fxthink">🤔 ${esc(s.think)}</p>` : ""}<button class="fxb fxdone" data-fx="done" data-key="step.${x.id}.${s.id}">✓ Done</button></div>`,
    }),
  );
  if (kind === "challenges")
    C.push({
      key: "sol." + x.id,
      kind,
      html: `<div class="fxtxt"><span class="fxeb">🧩 ${esc(x.title)} · solutions</span><h3>Usual solutions</h3><ul>${x.general.map((g) => `<li>${esc(g)}</li>`).join("")}</ul><h3>Creative solutions</h3><ul>${x.creative.map((g) => `<li>${esc(g)}</li>`).join("")}</ul><h3>Your turn</h3><p>${esc(x.your_turn)}</p></div>`,
    });
  return C;
}
function fxMcq(u, key, q, opts, a, why, it) {
  return `<div class="fxq" data-key="${esc(key)}" data-a="${a}" data-why="${esc(why || "")}">${fxCtx(it)}${fxHow(u, it)}${fxChart(it?.chart)}<p class="fxqq">${esc(q)}</p>${opts.map((o, i) => `<button class="fxopt" data-fx="opt" data-i="${i}">${esc(String(o))}</button>`).join("")}<p class="fxwhy" hidden></p>${it?.answer_chart ? `<div class="fxach" hidden>${fxChart(it.answer_chart)}</div>` : ""}</div>`;
}
function fxItem(u, key, it, i, n) {
  const head = `<span class="fxeb">Question ${i + 1} of ${n}</span>`,
    opts = it.opts || it.options;
  if (it.t === "mcq") return head + fxMcq(u, key, it.p, opts, it.a, it.why, it);
  if (it.t === "truefalse") return head + fxMcq(u, key, it.p, ["True", "False"], it.a ? 0 : 1, it.why, it);
  if (it.t === "fill")
    return (
      head +
      `<div class="fxq" data-key="${esc(key)}">${fxCtx(it)}${fxHow(u, it)}${fxChart(it.chart)}<p class="fxqq">${esc(it.p)}</p><input class="fxin" placeholder="Type your answer"><button class="fxb" data-fx="fill" data-ans="${esc(JSON.stringify(it.a))}" data-why="${esc(it.why)}">Check</button><p class="fxwhy" hidden></p></div>`
    );
  const ans =
    it.t === "sort"
      ? it.items.map(([x, c]) => `${x} → ${c}`).join("; ")
      : it.t === "match"
        ? it.pairs.map(([x, y]) => `${x} → ${y}`).join("; ")
        : it.t === "order"
          ? it.items.join(" → ")
          : it.t === "forces"
            ? it.a.map((f) => `${f.name}: ${f.dir}`).join(", ")
            : String(it.a);
  const body =
    it.t === "match"
      ? `<p class="fxsm">Match: ${it.pairs.map((p) => esc(p[0])).join(" · ")} ⟷ ${it.pairs
          .map((p) => esc(p[1]))
          .slice()
          .sort()
          .join(" · ")}</p>`
      : it.t === "sort"
        ? `<p class="fxsm">Sort into <b>${it.cats.map(esc).join("</b> and <b>")}</b>: ${it.items.map((x) => esc(x[0])).join(" · ")}</p>`
        : it.t === "order"
          ? `<p class="fxsm">${it.items.slice().sort().map(esc).join(" · ")}</p>`
          : it.t === "forces"
            ? `<p class="fxsm">Draw arrows for: ${it.options.map(esc).join(", ")}</p>`
            : `<p class="fxsm">${it.t === "draw" ? "Draw it on paper." : "Say it out loud or write it on paper."}</p>`;
  return (
    head +
    `<div class="fxq">${fxCtx(it)}${fxHow(u, it)}${fxChart(it.chart)}<p class="fxqq">${esc(it.p)}</p>${body}<details class="fxask"><summary>Show the answer</summary><p><b>${esc(ans)}</b></p><p class="fxsm">${esc(it.why)}</p>${fxChart(it.answer_chart)}</details></div>`
  );
}
function fxCarousel(u, pre, items, title) {
  return `<div class="fxcar">${items.map((it, i) => `<div class="fxslide">${fxItem(u, `${pre}.${i}`, it, i, items.length)}</div>`).join("")}</div><p class="fxhint">Swipe sideways for the next question →</p>`;
}
function fxCards(u) {
  const C = [],
    SL = [],
    add = (key, html, say, extra) => C.push({ key, html, say, ...(extra || {}) }),
    st = u.story;
  const order = [...u.plan.default_order];
  if (u.roots && !order.includes("roots")) {
    const j = order.indexOf("big_questions");
    order.splice(j < 0 ? order.length : j + 1, 0, "roots");
  }
  // the real discovery story comes after what scientists agree on (or after the explanations)
  if (u.how_we_found_out && !order.includes("how_we_found_out")) {
    const j = order.findIndex((k) => k === "agreed" || k === "explanations");
    order.splice(j < 0 ? order.length : j + 1, 0, "how_we_found_out");
  }
  for (const k of ["videos", "jokes", "maths", "applications", "photos", "spotted", "ask_kids", "song", "links", "buy"])
    if (!order.includes(k)) order.splice(k === "videos" ? order.length : order.length, 0, k);
  const all = {};
  for (const k of Object.keys(FXN)) for (const x of u[k] || []) all[x.id] = [k, x];
  for (const w of u.worksheets) all[w.id] = ["worksheets", w];
  for (const o of order) {
    const n0 = C.length;
    fxOne(o);
    const got = C.slice(n0);
    if (got.length) {
      const m = fxSecMeta(u, o, all[o]);
      got.forEach((c) => (c.sec = m.id));
      SL.push({ ...m, n: got.length });
    }
  }
  C.sections = SL;
  return C;
  function fxOne(o) {
    if (all[o]) {
      const [k, x] = all[o];
      if (k === "worksheets")
        add(
          "ws." + x.id,
          `${fxImg(u, "ws." + x.id, "")}<div class="fxtxt"><span class="fxeb">📝 Worksheet · ${esc(x.tier)} · ${x.items.length} questions · ${x.mins} min</span><h2>${esc(x.title)}</h2>${fxCarousel(u, "ws." + x.id, x.items)}<div class="fxrow"><button class="fxb" data-fx="print" data-id="${x.id}">🖨️ Print with answer key</button><button class="fxb" data-fx="photo">📷 Check my paper</button><button class="fxb" data-fx="paper" data-id="${x.id}">✔ We did it on paper</button></div></div>`,
          x.title,
          { wide: 1 },
        );
      else C.push(...fxFlowCards(u, k, x));
      return;
    }
    switch (o) {
      case "summary":
        break;
      case "intro":
        add(
          "intro",
          `${fxImg(u, "intro", u.intro.art)}<div class="fxtxt"><span class="fxeb">👀 Before we begin</span><h2>${esc(u.intro.hook)}</h2><p>${esc(u.intro.text)}</p></div>`,
          u.intro.hook + " " + u.intro.text,
        );
        break;
      case "story": {
        const P = st.text,
          per = Math.ceil(P.length / 5);
        add(
          "story",
          `${fxImg(u, "story.0", st.art[0], "fxhero")}<div class="fxtxt"><span class="fxeb">📖 Story · ${st.mins} min · read aloud</span><h1>${esc(st.title)}</h1><p class="fxsm">${esc(st.note || "")}</p><button class="fxb" data-fx="readall">🔊 Read the whole story to me</button></div>`,
          st.title,
        );
        for (let i = 0; i < P.length; i += per) {
          const pg = i / per,
            img = ["story.2", "story.3", "story.4", "story.5"][pg - 1];
          add(
            "story.p" + pg,
            `${pg ? fxImg(u, img, st.art[pg], "") : ""}<div class="fxtxt fxstory">${P.slice(i, i + per)
              .map((p) => `<p>${esc(p)}</p>`)
              .join("")}</div>`,
            P.slice(i, i + per).join(" "),
          );
        }
        add(
          "story.end",
          `<div class="fxtxt"><span class="fxeb">📖 After the story</span><div class="pm"><p class="fxpo">${esc(st.epiphany)}</p></div><h3>Talk about it</h3><ul>${st.ask.map((q) => `<li>${esc(q)}</li>`).join("")}</ul></div>`,
          st.ask.join(" "),
        );
        break;
      }
      case "terms":
        u.terms.forEach((t, i) =>
          add(
            "term." + i,
            `<div class="fxflip" data-fx="flip"><div class="fxf">${fxImg(u, "term." + i, t.art, "fxsq")}<h2>${esc(t.term)}</h2><p class="fxhint">Tap to turn the card</p></div><div class="fxbk"><h2>${esc(t.term)}</h2><p>${esc(t.meaning)}</p><p class="fxsm"><b>For example:</b> ${esc(t.example)}</p></div></div>`,
            t.term + ". " + t.meaning + " For example, " + t.example,
          ),
        );
        break;
      case "explanations":
        (u.explainers || [])
          .filter((x) => x.before === "explanations")
          .forEach((x) =>
            add(
              "xv." + x.id,
              `<div class="fxtxt"><span class="fxeb">🎬 A 30-second explainer · made by DeepKids</span><h2>${esc(x.title)}</h2><p class="fxctx2">Watch this first. It zooms in from a shoe on a step, down to the bumps, then down to the atoms gripping each other.</p><video class="fxexp" controls playsinline preload="metadata" src="${esc(window.DK_PLATFORM?.name === "web" ? x.web : x.artifact)}"></video></div>`,
              x.title,
            ),
          );
        u.explanations.forEach((x, i) =>
          add(
            "expl." + i,
            `${fxImg(u, "expl." + i, x.art)}<div class="fxtxt"><span class="fxeb">💡 ${x.status === "defined" ? "Agreed definition" : x.status === "idea" ? "Only ideas so far" : "Scientists disagree"}</span><h2>${esc(x.concept)}</h2>${fxCtx(x)}${x.definition ? `<p><b>${esc(x.definition)}</b></p>` : ""}<p>${esc(x.description || "")}</p>${x.perspectives.map((p) => `<div class="fxvoice"><b>${esc(p.who)}</b><p>${esc(p.explanation)}</p></div>`).join("")}${fxChart(x.chart)}<ul class="fxsm">${x.examples.map((e) => `<li>${esc(e)}</li>`).join("")}</ul></div>`,
            x.concept + ". " + (x.definition || "") + " " + (x.description || ""),
          ),
        );
        break;
      case "agreed":
        add(
          "agreed",
          `${fxImg(u, "agreed", "")}<div class="fxtxt"><span class="fxeb">🤝 What most scientists agree on</span>${u.agreed.map((a) => `<div class="fxvoice"><b>${esc(a.text)}</b><p class="fxsm">How we know: ${esc(a.evidence)}</p>${fxChart(a.chart)}</div>`).join("")}</div>`,
          u.agreed.map((a) => a.text).join(" "),
        );
        break;
      case "how_we_found_out": {
        const h = u.how_we_found_out;
        add(
          "how_we_found_out",
          `<div class="fxtxt"><span class="fxeb">🕰️ How we found out · ${esc(h.who)} · ${esc(h.when)}</span><p>${esc(h.story)}</p><p class="fxsm"><b>What people believed before:</b> ${esc(h.wrong_idea)}</p></div>`,
          h.story,
        );
        break;
      }
      case "challenging":
        u.challenging.forEach((c, i) =>
          add(
            "chal." + i,
            `${fxImg(u, "chal." + i, "")}<div class="fxtxt"><span class="fxeb">⚖️ Is this true?</span>${fxCtx(c)}<h2>“${esc(c.claim)}”</h2><p class="fxsm">Said by: ${esc(c.who)}</p><p class="fxsm">What do you think?</p><div class="fxrow"><button class="fxb" data-fx="vote">I agree</button><button class="fxb" data-fx="vote">Not sure</button><button class="fxb" data-fx="vote">I disagree</button></div><div class="fxreveal" hidden><div class="fxvoice"><b>For</b><p>${esc(c.for)}</p></div><div class="fxvoice"><b>Against</b><p>${esc(c.against)}</p></div><p class="fxbadge">Most scientists today: ${{ accepted: "accepted", debated: "still debated", minority: "a minority view", rejected: "not true" }[c.status]}</p></div></div>`,
            c.claim,
          ),
        );
        break;
      case "big_questions":
        u.big_questions.forEach((q, i) =>
          add(
            "bq." + i,
            `${fxImg(u, "bq." + i, "")}<div class="fxtxt fxbig ${q.kind}"><span class="fxeb">${q.kind === "deep" ? "🕳️ Deep think" : "🌌 Big think"}</span><h1>${esc(q.q)}</h1><details class="fxask"><summary>A hint</summary><p>${esc(q.hint)}</p></details><button class="fxb" data-fx="askcard">💬 Think it through with DeepKids AI</button></div>`,
            q.q,
          ),
        );
        break;
      case "roots": {
        const r = u.roots;
        if (!r) break;
        const T = r.three || {};
        add(
          "roots.0",
          `${fxImg(u, "roots.0", r.art)}<div class="fxtxt fxroots"><span class="fxeb">🪷 Roots · who am I, what is life, what is this world?</span><p class="fxctx2">${esc(r.context)}</p>${r.deep_truth ? `<div class="fxtruth"><span class="fxeb">👁️ The deep truth</span><h2>${esc(r.deep_truth.truth)}</h2><p>${esc(r.deep_truth.habit)}</p><p class="fxsm">How we know: ${esc(r.deep_truth.evidence)}</p></div>` : ""}<div class="fxvoice"><b>Who am I?</b><p>${esc(T.who_am_i || "")}</p></div><div class="fxvoice"><b>What is this life?</b><p>${esc(T.what_is_life || "")}</p></div><div class="fxvoice"><b>What is this world?</b><p>${esc(T.what_is_this_world || "")}</p></div></div>`,
          [r.context, r.deep_truth?.truth, r.deep_truth?.habit, T.who_am_i, T.what_is_life, T.what_is_this_world].join(
            " ",
          ),
        );
        add(
          "roots.1",
          `${fxImg(u, "roots.1", "")}<div class="fxtxt fxroots"><span class="fxeb">🪷 Roots · zero, One, the many</span><p class="fxsm">What many sages taught, and what the science shows:</p><h3>${esc(r.thread)}</h3>${(r.teachings || []).map((t) => `<div class="fxvoice"><b>${esc(t.source)}</b><p>${esc(t.teaching)}</p><p class="fxsm">${esc(t.link)}</p></div>`).join("")}</div>`,
          r.thread + " " + (r.teachings || []).map((t) => t.teaching).join(" "),
        );
        add(
          "roots.2",
          `<div class="fxtxt fxroots"><span class="fxeb">🪷 Roots · what science says, and who disagrees</span>${(r.science || []).map((x) => `<div class="fxvoice"><b>${esc(x.text)}</b><p class="fxbadge">${{ settled: "Science has found this", idea: "An idea some scientists hold", debated: "Scientists still argue", open: "Nobody knows yet" }[x.status] || ""}</p></div>`).join("")}${r.other_view ? `<div class="fxvoice"><b>Another view: ${esc(r.other_view.who)}</b><p>${esc(r.other_view.view)}</p></div>` : ""}<p class="fxsm">What do you think? There is no wrong answer here.</p></div>`,
          (r.science || []).map((x) => x.text).join(" "),
        );
        const pr = r.practice || {};
        add(
          "roots.3",
          `<div class="fxtxt fxroots"><span class="fxeb">🪷 Roots · a quiet moment · ${pr.mins || 3} min</span><h2>${esc(pr.title || "")}</h2><p class="pm">${esc(pr.say || "")}</p><p class="km">${esc(pr.kid || "")}</p><h3>Wonder about it</h3><ul>${(r.ask || []).map((q) => `<li>${esc(q)}</li>`).join("")}</ul><button class="fxb" data-fx="askcard">💬 Think it through with DeepKids AI</button></div>`,
          (pr.kid || "") + " " + (r.ask || []).join(" "),
        );
        break;
      }
      case "videos":
        u.videos.forEach((v, i) =>
          add(
            "vid." + i,
            `<div class="fxtxt"><span class="fxeb">▶️ Video ${i + 1} of ${u.videos.length} · ${v.mins} min · ${esc(v.channel)}</span><h2>${esc(v.title)}</h2>${v.youtube ? `<div class="fxvid" data-yt="${esc(v.youtube)}" style="background-image:url('https://i.ytimg.com/vi/${esc(v.youtube)}/hqdefault.jpg')"><button class="fxb" data-fx="play">▶ Play here</button></div><a class="fxsm" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=${esc(v.youtube)}">Open on YouTube</a>` : `<a class="fxb" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(v.title + " " + v.channel)}">Find it on YouTube</a>`}<p class="fxsm">${esc(v.why)}</p><p class="fxpo pm">${esc(v.check)}</p></div>`,
            v.title,
          ),
        );
        break;
      case "quiz":
        add(
          "quiz",
          `${fxImg(u, "quiz", "")}<div class="fxtxt"><span class="fxeb">❓ Quiz · ${u.quiz.length} questions</span><h2>How much stuck?</h2>${fxCarousel(u, "quiz", u.quiz)}<p class="fxsm">A wrong answer adds this unit to your refresher list.</p></div>`,
          "Quiz",
          { wide: 1 },
        );
        break;
      case "open_questions":
        add(
          "open",
          `${fxImg(u, "open", "")}<div class="fxtxt"><span class="fxeb">🔭 Nobody knows yet</span>${u.open_questions.map((q) => `<div class="fxvoice"><b>${esc(q.q)}</b><p class="fxsm">${esc(q.why_open)}</p></div>`).join("")}<p class="fxsm">Maybe you will find out.</p></div>`,
          u.open_questions.map((q) => q.q).join(" "),
        );
        break;
      case "jokes":
        add(
          "jokes",
          `${fxImg(u, "jokes", "")}<div class="fxtxt"><span class="fxeb">😂 Jokes</span><div class="fxcar">${u.jokes.map((j) => `<div class="fxslide fxjoke" data-fx="flip"><h2>${esc(j.j)}</h2><p class="fxbk2">${esc(j.a)}</p><p class="fxhint">Tap for the answer</p></div>`).join("")}</div><p class="fxhint">Swipe →</p></div>`,
          "",
          { wide: 1 },
        );
        break;
      case "maths":
        u.maths.forEach((m, i) =>
          add(
            "math." + i,
            `${m.chart ? "" : fxImg(u, "maths", "")}<div class="fxtxt"><span class="fxeb">➗ Maths from our experiments · problem ${i + 1} of ${u.maths.length}</span>${m.why_maths ? `<p class="fxwhym"><b>Why maths here?</b> ${esc(m.why_maths)}</p>` : ""}${fxCtx(m)}${fxHow(u, m)}${fxChart(m.chart)}<h2>${esc(m.problem)}</h2><details class="fxask"><summary>Show the answer</summary><p><b>${esc(m.answer)}</b></p><p class="fxsm">${esc(m.explain)}</p>${fxChart(m.answer_chart)}</details><p class="fxsm">Doing this adds the maths idea behind it to your queue next.</p></div>`,
            m.problem,
          ),
        );
        break;
      case "applications":
        add(
          "apps",
          `${fxImg(u, "apps", "")}<div class="fxtxt"><span class="fxeb">⚙️ Where people use it</span><ul>${u.applications.map((a) => `<li>${esc(a)}</li>`).join("")}</ul></div>`,
          u.applications.join(". "),
        );
        break;
      case "photos":
        if (u.photos?.length)
          add(
            "photos",
            `<div class="fxtxt"><span class="fxeb">📷 Real pictures</span><div class="fxcar">${u.photos.map((p) => `<div class="fxslide"><img class="fximg" loading="lazy" src="${esc(p.src)}" alt="${esc(p.caption)}"><p>${esc(p.caption)}</p><p class="fxcredit">${esc(p.credit)}</p></div>`).join("")}</div><p class="fxhint">Swipe →</p></div>`,
            u.photos.map((p) => p.caption).join(" "),
            { wide: 1 },
          );
        break;
      case "spotted":
        add(
          "spot",
          `<div class="fxtxt"><span class="fxeb">🔍 Spot it around you</span><div class="fxcar">${u.spotted.map((s, i) => `<div class="fxslide">${fxImg(u, "spot." + i, s.art)}<p>${esc(s.text)}</p></div>`).join("")}</div><p class="fxhint">Swipe →</p></div>`,
          u.spotted.map((s) => s.text).join(" "),
          { wide: 1 },
        );
        break;
      case "ask_kids":
        add(
          "askk",
          `${fxImg(u, "askk", "")}<div class="fxtxt"><span class="fxeb">🗣️ Ask during the day</span><ul>${u.ask_kids.map((a) => `<li>${esc(a)}</li>`).join("")}</ul></div>`,
          u.ask_kids.join(" "),
        );
        break;
      case "song": {
        const sg = Object.values(DATA.songs || {}).find((x) => (x.units || []).includes(u.id));
        add(
          "song",
          `${fxImg(u, "song", "")}<div class="fxtxt">${sg ? fxSongHtml(sg) : `<span class="fxeb">🎵 Song</span><h2>${esc(u.song.title)}</h2><p class="fxsm">This song is still being written.</p>`}</div>`,
          sg ? sg.sections.map((x) => x.lines.join(" ")).join(" ") : "",
        );
        break;
      }
      case "links":
        add(
          "links",
          `${fxImg(u, "links", "")}<div class="fxtxt"><span class="fxeb">🌐 Try these and go see</span>${u.links.map((l) => `<div class="fxvoice"><b>${l.url ? `<a target="_blank" rel="noopener" href="${esc(l.url)}">${esc(l.title)}</a>` : esc(l.title)}</b> <span class="fxsm">${l.kind === "place" ? "📍 " + esc(l.where) : l.kind}</span><p class="fxsm">${esc(l.why)}</p></div>`).join("")}</div>`,
          "",
        );
        break;
      case "buy":
        add(
          "buy",
          `${fxImg(u, "buy", "")}<div class="fxtxt"><span class="fxeb">🛒 Things that help</span>${u.buy.map((b) => `<div class="fxvoice"><b><a target="_blank" rel="noopener" href="${esc(b.url)}">${esc(b.item)}</a></b><p class="fxsm">${esc(b.why)}${b.plan ? " " + esc(b.plan) : ""}</p>${(b.used_in || []).length ? `<button class="fxb" data-fxbought="${esc(u.id + "|" + b.item)}">${(S.bought || {})[u.id + "|" + b.item] ? "✔ We have it: added to the plan" : "We bought it"}</button>` : ""}</div>`).join("")}</div>`,
          "",
        );
        break;
    }
  }
}
function fxScore(u) {
  const sc = fxSt().score[u.id] || { r: 0, w: 0 },
    rf = fxSt().ref[u.id] || [];
  return `${sc.r} right, ${sc.w} to practise${rf.length ? `. ${rf.length} question${rf.length > 1 ? "s are" : " is"} on your refresher list.` : "."}`;
}
const FXS = {
  intro: ["Before we begin", "👀", "A puzzle to wake up your brain."],
  story: [
    "The story",
    "📖",
    "Settle in somewhere cosy. We start with a story from nearly 4,000 years ago. Read it together, or let the app read it aloud.",
  ],
  terms: [
    "Flashcards",
    "🔤",
    "The words we'll need. Look at the picture, guess the meaning, then tap the card to turn it over.",
  ],
  explanations: [
    "How it really works",
    "💡",
    "Now we go deep: from your shoe, down to atoms, out to the Moon. Some answers are agreed; some scientists still argue about.",
  ],
  agreed: ["What we know for sure", "🤝", "The things nearly every scientist agrees on, and how they know."],
  how_we_found_out: ["How we found out", "🕰️", "Who worked this out, when, and the wrong idea people believed before."],
  challenging: [
    "Is this true?",
    "⚖️",
    "Things people say. Decide what YOU think first, then see the evidence for and against.",
  ],
  roots: [
    "Roots",
    "🪷",
    "Who am I? What is this life? What is this world? Every idea we learn is also an answer to these. Here we wonder about them together.",
  ],
  big_questions: [
    "Big questions",
    "🌌",
    "No right answers here. Think, wonder and talk. Take your time with each one.",
  ],
  videos: ["Watch", "▶️", "Three short videos that explain it another way. Grown-ups will enjoy them too."],
  quiz: ["Quiz", "❓", "Let's see what stuck. A wrong answer is fine: it goes on your refresher list for later."],
  open_questions: [
    "Nobody knows yet",
    "🔭",
    "The questions scientists are still working on. Maybe you will answer one.",
  ],
  jokes: ["Jokes", "😂", "A laugh before we go on."],
  maths: ["Maths time", "➗", "Real problems from our experiments. Each one brings its maths idea into your queue."],
  applications: ["Where it's used", "⚙️", "Where people put this idea to work."],
  photos: ["Real pictures", "📷", "Real photos and old drawings from free books, with who made them."],
  spotted: ["Spot it around you", "🔍", "Look for these at home and outside this week."],
  ask_kids: ["Questions for the day", "🗣️", "For the parent: drop these in at meals and on walks."],
  song: ["Song", "🎵", "Our song for this topic."],
  links: ["Try online and go see", "🌐", "Simulations to play with and places in India to visit."],
  buy: ["Things that help", "🛒", "Tools, books and games that make this unit richer, and where each is used."],
};
const FXKL = {
  games: "This is a game. Play it together. The questions on screen are part of the game, not a test.",
  experiments: "Time to be a scientist: predict first, then test fairly and measure.",
  activities: "Let's get up and try it with our own hands.",
  projects: "A bigger build. It runs over a few days; DeepKids will bring it back on the right days.",
  challenges: "An engineering challenge. Try your own ideas first, then see the usual and the creative solutions.",
  worksheets: "Pencils ready. Do it right here on the screen, or print it.",
};
function fxSecMeta(u, o, ent) {
  if (ent) {
    const [k, x] = ent;
    return {
      id: o,
      title: x.title,
      emoji: FXE[k],
      kind: k,
      mins: x.mins || 10,
      lead: FXKL[k],
      need: (x.materials || []).map((m) => (typeof m === "string" ? m : m.item)),
      what:
        x.question || x.problem || x.flow?.[0]?.do || (x.tier ? `${x.items.length} questions, ${x.tier} level.` : ""),
    };
  }
  const m = FXS[o] || [o, "✨", ""],
    mins =
      {
        story: u.story.mins,
        terms: Math.round((u.cards_mins || 20) / 2),
        explanations: 12,
        videos: u.videos.reduce((a, v) => a + v.mins, 0),
        quiz: u.quiz.length,
        big_questions: 10,
        challenging: 8,
        roots: (u.roots?.practice?.mins || 3) + 8,
      }[o] || 5;
  return { id: o, title: m[0], emoji: m[1], kind: o, mins, lead: m[2] };
}
/* colour coding: every kind of part has one colour, label and icon, used on the map, the opening card and every card */
const FXKC = {
  story: ["Story", "📖", "#8C93C7"],
  idea: ["Big idea", "💡", "#6DB4F2"],
  words: ["Words", "🔤", "#E0A800"],
  games: ["Game", "🎲", "#E2559A"],
  experiments: ["Experiment", "🧪", "#3F8F5F"],
  activities: ["Activity", "🤸", "#1FA89D"],
  projects: ["Project", "🛠️", "#E8741C"],
  challenges: ["Challenge", "🧩", "#9A5BD0"],
  worksheets: ["Worksheet", "📝", "#3B7DD8"],
  quiz: ["Quiz", "❓", "#E24B4E"],
  videos: ["Watch", "▶️", "#5A5470"],
  maths: ["Maths", "➗", "#0F8A7E"],
  song: ["Song", "🎵", "#C25B9E"],
  roots: ["Roots", "🪷", "#B0638C"],
  extra: ["Extras", "✨", "#8A9A3B"],
};
const fxGroup = (k) =>
  ({
    story: "story",
    intro: "idea",
    explanations: "idea",
    agreed: "idea",
    challenging: "idea",
    big_questions: "idea",
    open_questions: "idea",
    terms: "words",
    games: "games",
    experiments: "experiments",
    activities: "activities",
    projects: "projects",
    challenges: "challenges",
    worksheets: "worksheets",
    quiz: "quiz",
    videos: "videos",
    maths: "maths",
    song: "song",
    roots: "roots",
  })[k] || "extra";
const fxKC = (k) => FXKC[fxGroup(k)];
const fxPill = (k) => {
  const [n, e, c] = fxKC(k);
  return `<span class="fxkp" style="--kc:${c}">${e} ${n}</span>`;
};
let FXSI = -1,
  FXALL = [],
  FXTICK = null;
/* units load one file each (units/<id>.json) when first opened, so the app stays small however many there are */
const FXFULL = {};
async function fxLoad(id) {
  if (FXFULL[id]) return FXFULL[id];
  const ix = DATA.units?.[id];
  if (!ix) throw new Error("missing");
  const r = await fetch(`units/${id}.json?v=${ix.v || ""}`);
  if (!r.ok) throw new Error("HTTP " + r.status);
  return (FXFULL[id] = await r.json());
}
async function fxOpen(id) {
  if (!DATA.units?.[id]) return toast("This unit isn't in the app yet");
  if (!dkUnitOpen(id)) return dkLocked();
  let u;
  try {
    if (!FXFULL[id]) toast("Opening…", 900);
    u = await fxLoad(id);
  } catch (e) {
    return toast("Couldn't open this unit just now. Check your connection and try again.");
  }
  FXU = u;
  FXALL = fxCards(u);
  let d = document.getElementById("fxDlg");
  if (!d) {
    d = document.createElement("dialog");
    d.id = "fxDlg";
    d.className = "fxdlg";
    document.body.appendChild(d);
    d.addEventListener("click", fxClick);
    d.addEventListener("cancel", (e) => {
      e.preventDefault();
      FXSI >= 0 ? fxMap() : fxClose();
    });
  }
  d.dataset.mode = fxSt().mode;
  if (!d.open) d.showModal();
  fxMap();
  clearInterval(FXTICK);
  FXTICK = setInterval(() => {
    if (!d.open || FXSI < 0 || document.visibilityState !== "visible") return;
    const F = fxSt(),
      T = (F.time[u.id] = F.time[u.id] || {}),
      k = FXALL.sections[FXSI].id;
    T[k] = (T[k] || 0) + 5;
    addMins(unitBy("unit|" + u.id)?.subj, 5);
    if (T[k] % 30 === 0) save();
  }, 5000);
}
const fxMin = (s) => (s < 60 ? (s ? "under a minute" : "not started") : Math.round(s / 60) + " min");
function fxSecState(u, s) {
  const F = fxSt();
  return F.done[u.id]?.["sec:" + s.id] ? "done" : F.time[u.id]?.[s.id] ? "started" : "";
}
function fxTop(d, mapView) {
  const F = fxSt();
  return `<div class="fxtop"><button class="fxx" data-fx="${mapView ? "close" : "map"}" aria-label="${mapView ? "Close" : "Back to the unit map"}">${mapView ? "✕" : "🗺️"}</button><div class="fxbar"><i style="width:0"></i></div><button class="fxmd" data-fx="mode" data-m="${F.mode === "parent" ? "child" : "parent"}">${F.mode === "parent" ? "👩 Teaching" : "🧒 Learner"}</button></div>`;
}
function fxMap() {
  const u = FXU,
    d = document.getElementById("fxDlg"),
    F = fxSt(),
    SL = FXALL.sections;
  FXSI = -1;
  FXOBS?.disconnect();
  voxCtl("stop");
  const T = F.time[u.id] || {},
    done = SL.filter((s) => fxSecState(u, s) === "done").length,
    pos = F.pos[u.id],
    cont = pos && typeof pos === "object" ? pos.s : -1,
    tot = SL.reduce((a, s) => a + s.mins, 0),
    spent = Object.values(T).reduce((a, b) => a + b, 0);
  d.innerHTML =
    fxTop(d, true) +
    `<div class="fxmap"><div class="fxin">${fxImg(u, "summary", u.summary.art, "fxhero")}<div class="fxtxt"><span class="fxeb">${esc(u.id.split(".")[1])} · Class ${u.id.slice(-1)} · ${SL.length} parts · about ${Math.max(1, Math.round(tot / ({ 1: 30, 2: 35, 3: 40, 4: 45, 5: 45 }[+u.id.slice(-1)] || 40)))} days of ${{ 1: 30, 2: 35, 3: 40, 4: 45, 5: 45 }[+u.id.slice(-1)] || 40} minutes</span><h1>${esc(u.title)}</h1><p>${esc(u.summary.text)}</p>
    <div class="fxmode"><button class="fxb" data-fx="mode" data-m="parent" aria-pressed="${F.mode === "parent"}">👩 I'm teaching</button><button class="fxb" data-fx="mode" data-m="child" aria-pressed="${F.mode === "child"}">🧒 I'm the learner</button></div>
    ${cont >= 0 && cont < SL.length ? `<button class="fxb fxgo" data-fx="sec" data-s="${cont}" data-c="${pos.c || 0}">▶ Carry on: ${esc(SL[cont].title)}</button>` : `<button class="fxb fxgo" data-fx="sec" data-s="0">▶ Start at the beginning</button>`}
    <p class="fxsm">Or start with: </p><div class="fxchips">${u.plan.start_options
      .map((o) => {
        const i = SL.findIndex((s) => s.id === o || (o === "cards" && s.id === "terms"));
        return i < 0
          ? ""
          : `<button class="fxchip" data-fx="sec" data-s="${i}">${SL[i].emoji} ${esc(SL[i].title)}</button>`;
      })
      .join("")}</div>
    <div class="fxstats"><span><b>${done}</b> of ${SL.length} parts done</span><span><b>${fxMin(spent)}</b> spent</span><span>${fxScore(u)}</span></div>
    <h2>All the parts</h2><div class="fxlegend">${[...new Set(SL.map((s) => fxGroup(s.kind)))].map((g) => `<span class="fxkp" style="--kc:${FXKC[g][2]}">${FXKC[g][1]} ${FXKC[g][0]}</span>`).join("")}</div><ol class="fxparts">${SL.map(
      (s, i) => {
        const st = fxSecState(u, s);
        return `<li><button data-fx="sec" data-s="${i}" class="${st}" style="--kc:${fxKC(s.kind)[2]}"><span class="fxpe">${st === "done" ? "✅" : s.emoji}</span><span><b>${esc(s.title)}</b><br>${fxPill(s.kind)} <span class="fxsm">${s.mins} min planned${T[s.id] ? ` · ${fxMin(T[s.id])} spent` : ""}</span></span><span class="fxchev">›</span></button></li>`;
      },
    ).join("")}</ol></div></div></div>
    <div class="fxact"><button class="fxaskb" data-fx="chat">${iamFace("mini")}Ask IAm</button></div>`;
  d.querySelector(".fxbar i").style.width = (100 * done) / SL.length + "%";
}
function fxShowSection(si, ci) {
  const u = FXU,
    d = document.getElementById("fxDlg"),
    F = fxSt(),
    SL = FXALL.sections,
    s = SL[si];
  if (!s) return fxMap();
  FXSI = si;
  const T = F.time[u.id]?.[s.id] || 0,
    nx = SL[si + 1],
    body = FXALL.filter((c) => c.sec === s.id);
  const lead = {
    key: "lead." + s.id,
    html: `<div class="fxtxt fxlead"><span class="fxeb">Part ${si + 1} of ${SL.length}</span>${fxPill(s.kind)}<div class="fxbige">${s.emoji}</div><h1>${esc(s.title)}</h1><p class="fxsm">⏱️ About ${s.mins} min${T ? ` · ${fxMin(T)} so far` : ""}</p><p class="fxguide">${esc(s.lead || "")}</p>${s.what ? `<p class="fxsm">${esc(s.what)}</p>` : ""}${s.need?.length ? `<p class="fxsm"><b>Get ready:</b> ${s.need.map(esc).join(", ")}</p>` : ""}<button class="fxb" data-fx="begin">Let's begin ↓</button></div>`,
  };
  const end = {
    key: "end." + s.id,
    html: `<div class="fxtxt fxlead"><div class="fxbige">✅</div><h1>Done: ${esc(s.title)}</h1><p class="fxsm" data-fx-time>⏱️ You took ${fxMin(T)} (planned ${s.mins} min)</p>${nx ? `<div class="fxnext" style="--kc:${fxKC(nx.kind)[2]}"><span class="fxeb">Next up ${fxPill(nx.kind)}</span><b>${nx.emoji} ${esc(nx.title)}</b><span class="fxsm">${nx.mins} min · ${esc(nx.lead || "")}</span></div><button class="fxb fxgo" data-fx="sec" data-s="${si + 1}">Next: ${esc(nx.title)} →</button>` : `<p>🎉 That was the last part. ${fxScore(u)}</p>`}<div class="fxrow"><button class="fxb" aria-pressed="false" data-fx="map">🗺️ Back to the map</button><button class="fxb" aria-pressed="false" data-fx="sec" data-s="${si}">↻ Do it again</button></div></div>`,
  };
  FXCARDS = [
    lead,
    ...body.map((c, j) => ({
      ...c,
      html: `<div class="fxcrumb">${fxPill(s.kind)} ${esc(s.title)} · card ${j + 1} of ${body.length}</div>` + c.html,
    })),
    end,
  ];
  d.innerHTML =
    fxTop(d, false) +
    `<div class="fxfeed" style="--kc:${fxKC(s.kind)[2]}">${FXCARDS.map((c, i) => `<section class="fxc${F.done[u.id]?.[c.key] ? " isdone" : ""}" data-i="${i}" data-key="${esc(c.key)}"><div class="fxin">${c.html}</div></section>`).join("")}</div>
   <div class="fxact"><button data-fx="save" aria-label="Save this card">🤍</button><button data-fx="read" aria-label="Read this card aloud">🔊</button><button class="fxaskb" data-fx="askcard">${iamFace("mini")}Ask IAm</button></div>`;
  const feed = d.querySelector(".fxfeed"),
    bar = d.querySelector(".fxbar i");
  FXOBS?.disconnect();
  FXOBS = new IntersectionObserver(
    (es) => {
      for (const e of es)
        if (e.isIntersecting) {
          const i = +e.target.dataset.i;
          bar.style.width = (100 * (i + 1)) / FXCARDS.length + "%";
          FXCUR = i;
          const sv = d.querySelector('.fxact [data-fx="save"]');
          sv.textContent = fxSt().saved[u.id]?.[FXCARDS[i].key] ? "❤️" : "🤍";
          const F2 = fxSt();
          F2.pos[u.id] = { s: si, c: i };
          if (i === FXCARDS.length - 1) {
            const D = (F2.done[u.id] = F2.done[u.id] || {});
            D["sec:" + s.id] = 1;
            const t = e.target.querySelector("[data-fx-time]");
            if (t) t.textContent = `⏱️ You took ${fxMin(F2.time[u.id]?.[s.id] || 0)} (planned ${s.mins} min)`;
            if (i > 0) sfx?.("chime");
          }
          save();
        }
    },
    { root: feed, threshold: 0.6 },
  );
  feed.querySelectorAll(".fxc").forEach((c) => FXOBS.observe(c));
  if (ci > 0) feed.children[Math.min(ci, FXCARDS.length - 1)]?.scrollIntoView({ block: "start" });
}
function fxGo(si, ci) {
  const r = fxShowSection(si, ci),
    u = FXU,
    s = FXALL?.sections?.[si];
  if (u && s) {
    const p = (DATA.units?.[u.id]?.parts || []).find((q) => q[0] === s.id),
      D = (fxSt().done[u.id] = fxSt().done[u.id] || {});
    if (p && (p[5] || 1) > 1 && !D["start:" + p[0]]) {
      D["start:" + p[0]] = today;
      save();
    }
    fxStamp(u.id);
    if (!D["open:" + s.id]) {
      D["open:" + s.id] = today;
      save();
    }
  }
  return r;
}
function fxClose() {
  clearInterval(FXTICK);
  save();
  voxCtl("stop");
  FXOBS?.disconnect();
  const d = document.getElementById("fxDlg");
  if (d?.open) d.close();
}
function fxCardText(sec) {
  const c = FXCARDS[+sec.dataset.i];
  if (c?.step) return fxSt().mode === "child" ? c.step.kid : [c.step.say, c.step.do].filter(Boolean).join(" ");
  // the whole card as it reads on screen in this mode, without its labels ("Part 2 of 36", "ACTIVITY")
  const el = sec.querySelector(".fxtxt,.fxflip")?.cloneNode(true);
  el?.querySelectorAll(`.fxeb,.fxkp,.fxcrumb,${fxSt().mode === "child" ? ".pm" : ".km"}`).forEach((x) => x.remove());
  return readable(el);
}
function fxRecordAnswer(u, key, ok, q) {
  const F = fxSt();
  if (key.startsWith("rf.")) {
    const k = key.split("~")[1];
    if (ok) {
      F.ref[u.id] = (F.ref[u.id] || []).filter((r) => (r.k || r) !== k);
      save();
    }
    return ok;
  }
  const sc = (F.score[u.id] = F.score[u.id] || { r: 0, w: 0 });
  const D = (F.done[u.id] = F.done[u.id] || {});
  if (D["q:" + key]) return null;
  D["q:" + key] = ok ? 1 : -1;
  if (ok) sc.r++;
  else {
    sc.w++;
    const R = (F.ref[u.id] = (F.ref[u.id] || []).map((r) => (typeof r === "string" ? { k: "", q: r } : r)));
    if (!R.some((r) => r.k === key)) {
      const it = fxFindItem(u, key),
        o = it && (it.opts || it.options);
      R.push({
        k: key,
        q,
        sec: FXALL.sections?.[FXSI]?.title || "",
        at: Date.now(),
        ans: it
          ? String(
              it.t === "truefalse"
                ? it.a
                  ? "True"
                  : "False"
                : it.t === "mcq"
                  ? o[it.a]
                  : Array.isArray(it.a)
                    ? it.a[0]
                    : it.a,
            )
          : "",
        why: it?.why || "",
      });
    }
  }
  save();
  return ok;
}
function fxMark(u, key, ok, q) {
  const r = fxRecordAnswer(u, key, ok, q);
  fxStamp(u.id);
  return r;
}
/* find the question behind a refresher entry so it can be asked again */
function fxFindItem(u, k) {
  const p = k.split(".");
  if (p[0] === "quiz") return u.quiz[+p[1]];
  if (p[0] === "ws") {
    const w = u.worksheets.find((x) => x.id === p[1]);
    return w?.items[+p[2]];
  }
  if (p[0] === "chk")
    for (const kk of Object.keys(FXN))
      for (const x of u[kk] || [])
        if (x.id === p[1]) {
          const st = x.flow.find((y) => y.id === p[2]);
          if (st?.check) return { t: "mcq", p: st.check.q, opts: st.check.options, a: st.check.a, why: st.check.why };
        }
  return null;
}
async function fxPractise(id) {
  let u;
  try {
    u = await fxLoad(id);
  } catch (e) {
    return toast("Couldn't open this unit just now.");
  }
  FXU = u;
  FXALL = FXALL?.sections && FXU === u ? FXALL : fxCards(u);
  const L = (fxSt().ref[id] || []).filter((r) => r.k);
  let d = document.getElementById("fxDlg");
  if (!d) {
    d = document.createElement("dialog");
    d.id = "fxDlg";
    d.className = "fxdlg";
    document.body.appendChild(d);
    d.addEventListener("click", fxClick);
    d.addEventListener("cancel", (e) => {
      e.preventDefault();
      fxClose();
    });
  }
  FXSI = -3;
  d.dataset.mode = fxSt().mode;
  const items = L.map((r) => ({ r, it: fxFindItem(u, r.k) })).filter((x) => x.it);
  d.innerHTML = `<div class="fxtop"><button class="fxx" data-fx="close" aria-label="Close">✕</button><div class="fxbar"><i style="width:0"></i></div></div><div class="fxfeed">${items.map(({ r, it }, i) => `<section class="fxc" data-i="${i}" data-key="rf"><div class="fxin"><div class="fxcrumb">↻ Refresher · ${i + 1} of ${items.length}</div><div class="fxtxt">${fxItem(u, "rf." + Date.now() + "~" + r.k, { ...it, context: it.context || (r.sec ? "From: " + r.sec : "") }, i, items.length).replace(/Question \d+ of \d+/, "Let's try this one again")}</div></div></section>`).join("")}<section class="fxc"><div class="fxin"><div class="fxtxt fxlead"><div class="fxbige">🌱</div><h1>Practice done</h1><p class="fxsm">Right answers have left your refresher list. The rest stay for next time.</p><button class="fxb" data-fx="close">Close</button></div></div></section></div>`;
  if (!d.open) d.showModal();
}
// A worksheet as a printable A4 sheet: each question type in a form a child can do with a pencil, answers on their own page
const WS_PRINT_CSS = `@page{size:A4;margin:14mm}*{box-sizing:border-box}body{margin:0;font:15px/1.45 Mukta,system-ui,sans-serif;color:#1f2440}
header{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #1f2440;padding-bottom:6px;font-size:13px}
.brand{font:400 20px 'Rozha One',serif}.brand b{color:#d7372b;font-weight:400}.brand span{font-size:15px}
h1{font:400 28px/1.15 'Rozha One',serif;margin:12px 0 2px}.sub{margin:0 0 6px;color:#646985}
ol.q>li{margin:0 0 16px;break-inside:avoid}ol.q>li>p{margin:0 0 6px;font-size:16px}
.opts{display:flex;flex-wrap:wrap;gap:8px 22px}.opts span::before{content:"";display:inline-block;width:14px;height:14px;border:2px solid #1f2440;border-radius:50%;margin-right:7px;vertical-align:-2px}
.line{border-bottom:1.5px solid #1f2440;height:28px}.box{border:2px solid #1f2440;border-radius:12px;height:150px}
.cards{display:grid;grid-template-columns:repeat(4,1fr);border:2px dashed #9aa0b8}.cards span{border:1px dashed #9aa0b8;padding:12px 6px;text-align:center;font-weight:700}
.cut{font-size:12px;color:#646985;margin:3px 0 8px}.cols{display:grid;gap:10px}.cols div{border:2.5px solid #1f2440;border-radius:12px;min-height:90px;padding:6px;text-align:center;font-weight:700}
.match{display:grid;grid-template-columns:1fr 34px 1fr 1.4fr;row-gap:12px;align-items:center}.match .w{border:2px solid #1f2440;border-radius:10px;padding:6px 10px;font-weight:700}.match .m{border:2px solid #9aa0b8;border-radius:10px;padding:6px 10px}.dot{width:12px;height:12px;border-radius:50%;background:#1f2440;justify-self:center}
.order div{display:flex;gap:10px;align-items:center;margin:5px 0}.order i{width:28px;height:28px;border:2px solid #1f2440;border-radius:6px;flex:none}
.bank{display:flex;flex-wrap:wrap;gap:8px}.bank span{border:2px solid #1f2440;border-radius:999px;padding:2px 12px;font-weight:700}
.ans{page-break-before:always}.ans li{margin:0 0 10px}.foot{margin-top:18px;font-size:11px;color:#646985;border-top:1px solid #dce0ea;padding-top:4px}`;
// the same shuffle every time a sheet is printed, so a parent's copy matches the child's
const fxShuffle = (L, seed) => {
  let s = [...String(seed)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 2147483647, 7);
  return L.map((x) => [x, (s = (s * 16807) % 2147483647)])
    .sort((a, b) => a[1] - b[1])
    .map((x) => x[0]);
};
function fxWsItem(it, key) {
  const o = it.opts || it.options,
    lines = (n) => '<div class="line"></div>'.repeat(n);
  if (it.t === "mcq" || it.t === "odd")
    return `<div class="opts">${o.map((x) => `<span>${esc(x)}</span>`).join("")}</div>`;
  if (it.t === "truefalse") return `<div class="opts"><span>True</span><span>False</span></div>`;
  if (it.t === "fill" || it.t === "count") return it.p.includes("__") ? "" : lines(1);
  if (it.t === "sort")
    return `<div class="cards">${fxShuffle(it.items, key)
      .map((x) => `<span>${esc(x[0])}</span>`)
      .join(
        "",
      )}</div><div class="cut">✂ Cut out the cards and stick each one in the right box.</div><div class="cols" style="grid-template-columns:repeat(${it.cats.length},1fr)">${it.cats.map((c) => `<div>${esc(c)}</div>`).join("")}</div>`;
  if (it.t === "match") {
    const R = fxShuffle(
      it.pairs.map((x) => x[1]),
      key,
    );
    return `<div class="match">${it.pairs.map((x, i) => `<div class="w">${esc(x[0])}</div><div class="dot"></div><div></div><div class="m">${esc(R[i])}</div>`).join("")}</div>`;
  }
  if (it.t === "order")
    return `<div class="order">${it.items.map((x) => `<div><i></i>${esc(x)}</div>`).join("")}</div>`;
  if (it.t === "forces")
    return `<div class="bank">${o.map((x) => `<span>${esc(x)}</span>`).join("")}</div><div class="box"></div>`;
  if (it.t === "draw" || it.t === "label") return `<div class="box"></div>`;
  return lines(it.lines || 3);
}
function fxWsAnswer(it) {
  const o = it.opts || it.options,
    a =
      it.t === "mcq" || it.t === "odd"
        ? o[it.a]
        : it.t === "truefalse"
          ? it.a
            ? "True"
            : "False"
          : it.t === "sort"
            ? it.cats
                .map(
                  (c) =>
                    `${c}: ${it.items
                      .filter((x) => x[1] === c)
                      .map((x) => x[0])
                      .join(", ")}`,
                )
                .join(". ")
            : it.t === "match"
              ? it.pairs.map((p) => p.join(" → ")).join("; ")
              : it.t === "order"
                ? it.a.join(" → ")
                : it.t === "forces"
                  ? it.a.map((f) => f.name + " " + f.dir).join(", ")
                  : Array.isArray(it.a)
                    ? it.a.join(" / ")
                    : String(it.a ?? "");
  return `<b>${esc(a)}</b>${it.why ? ` ${esc(it.why)}` : ""}`;
}
function fxWsPrintDoc(u, w) {
  const head = `<header><div class="brand"><b>Deep</b>Kids <span>Gurukul</span></div><div>Name: ______________ &nbsp; Date: ________</div></header>`;
  return `<!doctype html><meta charset="utf-8"><title>${esc(w.title)}</title><link href="https://fonts.googleapis.com/css2?family=Rozha+One&family=Mukta:wght@400;700&display=swap" rel="stylesheet"><style>${WS_PRINT_CSS}</style>
  ${head}<h1>${esc(w.title)}</h1><p class="sub">${esc(u.title)} · ${w.items.length} questions · about ${w.mins} minutes</p>
  <ol class="q">${w.items.map((it, i) => `<li><p>${esc(it.p.replace(/_{2,}/g, "__________"))}</p>${fxWsItem(it, w.id + i)}</li>`).join("")}</ol>
  <div class="foot">DeepKids Gurukul · ${esc(u.title)}</div>
  <section class="ans">${head}<h1>Answers, for grown-ups</h1><p class="sub">${esc(w.title)}</p><ol>${w.items.map((it) => `<li>${fxWsAnswer(it)}</li>`).join("")}</ol></section>`;
}
function fxPrint(id) {
  const u = FXU,
    w = u.worksheets.find((x) => x.id === id),
    g = [...u.games].find((x) => x.id === id);
  let h = "";
  if (w) h = fxWsPrintDoc(u, w);
  else if (g) {
    h = `<h1>${esc(g.title)}</h1><h3>Rules</h3><ol>${g.rules.map((r) => `<li>${esc(r)}</li>`).join("")}</ol>${g.printables.map((p) => `<h3>${esc(p.title)}</h3><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">${p.items.map((x) => `<div style="border:2px dashed #999;border-radius:10px;padding:10px;min-height:90px;font:600 14px sans-serif">${esc(x)}</div>`).join("")}</div>`).join("")}`;
    h = `<!doctype html><meta charset="utf-8"><title>DeepKids</title><style>body{font:15px/1.5 Nunito,system-ui,sans-serif;padding:20px}li{margin:10px 0}</style>${h}`;
  }
  const f = document.createElement("iframe");
  f.style.cssText = "position:fixed;width:0;height:0;border:0";
  f.srcdoc = h;
  f.onload = () => {
    try {
      f.contentWindow.print();
    } catch (e) {
      toast("Printing isn't available here");
    }
    setTimeout(() => f.remove(), 60000);
  };
  document.body.appendChild(f);
}
function fxNote(q, ok, key) {
  const old = q.querySelector(".fxrefn");
  if (old) old.remove();
  if (ok === null) return;
  const n = document.createElement("p");
  n.className = "fxrefn" + (ok ? " ok" : "");
  n.innerHTML = key.startsWith("rf.")
    ? ok
      ? "🌱 Got it. It has left your refresher list."
      : "↻ Still on your refresher list. Read the explanation and try again later."
    : ok
      ? ""
      : "↻ Added to your refresher list. Practise it later from <b>Plan → Refresher</b>.";
  if (n.innerHTML) q.appendChild(n);
}
function fxClick(e) {
  const b = e.target.closest("[data-fx]");
  if (!b) return;
  const a = b.dataset.fx,
    u = FXU,
    sec = b.closest(".fxc") || document.querySelector(`#fxDlg .fxc[data-i="${FXCUR}"]`),
    F = fxSt(),
    d = document.getElementById("fxDlg");
  if (a === "close") return fxClose();
  if (a === "map") return fxMap();
  if (a === "sec") return fxGo(+b.dataset.s, +(b.dataset.c || 0));
  if (a === "begin") return sec?.nextElementSibling?.scrollIntoView({ behavior: "smooth" });
  if (a === "mode") {
    F.mode = b.dataset.m;
    save();
    d.dataset.mode = F.mode;
    if (FXSI === -1) fxMap();
    const t = d.querySelector(".fxmd");
    if (!t) return;
    t.dataset.m = F.mode === "parent" ? "child" : "parent";
    t.textContent = F.mode === "parent" ? "👩 Teaching" : "🧒 Learner";
    d.querySelectorAll('.fxmode [data-fx="mode"]').forEach((x) =>
      x.setAttribute("aria-pressed", x.dataset.m === F.mode),
    );
    return toast(F.mode === "parent" ? "Parent mode: what to do and say" : "Learner mode: the app talks to the child");
  }
  if (a === "save") {
    const S1 = (F.saved[u.id] = F.saved[u.id] || {}),
      k = sec.dataset.key;
    S1[k] = !S1[k];
    b.textContent = S1[k] ? "❤️" : "🤍";
    b.setAttribute("aria-pressed", !!S1[k]);
    save();
    return S1[k] && toast("Saved");
  }
  if (a === "read") return speak(fxCardText(sec));
  if (a === "readall") return speak(u.story.title + ". " + u.story.text.join(" "));
  if (a === "flip") return b.classList.toggle("on");
  if (a === "vote") {
    sec.querySelector(".fxreveal").hidden = false;
    b.parentNode.querySelectorAll("button").forEach((x) => (x.disabled = true));
    b.classList.add("on");
    return;
  }
  if (a === "opt") {
    const q = b.closest(".fxq"),
      ok = +b.dataset.i === +q.dataset.a;
    q.querySelectorAll(".fxopt").forEach((x, i) => {
      x.disabled = true;
      if (i === +q.dataset.a) x.classList.add("ok");
    });
    if (!ok) b.classList.add("bad");
    const w = q.querySelector(".fxwhy");
    w.hidden = false;
    w.textContent = (ok ? "✅ Yes! " : "Not quite: the right answer is in green. ") + (q.dataset.why || "");
    q.querySelector(".fxach")?.removeAttribute("hidden");
    sfx?.(ok ? "chime" : "flip");
    fxNote(q, fxMark(u, q.dataset.key, ok, q.querySelector(".fxqq").textContent), q.dataset.key);
    return;
  }
  if (a === "fill") {
    const q = b.closest(".fxq"),
      v = q.querySelector("input").value.trim().toLowerCase(),
      A = JSON.parse(b.dataset.ans),
      ok = !!v && A.some((x) => v.includes(String(x).toLowerCase()));
    const w = q.querySelector(".fxwhy");
    w.hidden = false;
    w.textContent = (ok ? "✅ Yes! " : `The answer: ${A[0]}. `) + b.dataset.why;
    fxNote(q, fxMark(u, q.dataset.key, ok, q.querySelector(".fxqq").textContent), q.dataset.key);
    return;
  }
  if (a === "done") {
    const D = (F.done[u.id] = F.done[u.id] || {});
    D[b.dataset.key] = 1;
    save();
    sec.classList.add("isdone");
    sfx?.("chime");
    const nx = sec.nextElementSibling;
    return nx && setTimeout(() => nx.scrollIntoView({ behavior: "smooth" }), 250);
  }
  if (a === "play") {
    const v = b.parentNode;
    v.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.dataset.yt)}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="Video"></iframe>`;
    return;
  }
  if (a === "print") return fxPrint(b.dataset.id);
  if (a === "sheet") return fxSheet(b);
  if (a === "askcard") return fxChat(sec ? fxCardText(sec) : "");
  if (a === "chat") return fxChat("");
  if (a === "photo") return fxChat("", true);
}
const fxSongBtns = () => {
  const L = Object.values(DATA.songs || {});
  return L.length
    ? `<span class="eyebrow">Songs</span><div class="row chips">${L.map((sg) => `<button class="chip" data-act="fxsong" data-s="${esc(sg.id)}">🎵 ${esc(sg.title)}</button>`).join("")}</div>`
    : "";
};
/* a subtopic-level unit in the library and the daily plan: its parts are packed into days by the subject's daily minutes */
function fxParts(u) {
  return DATA.units?.[u?.c?.unit || u?.id]?.parts || [];
}
/* the spine (core path, about 2 sessions) comes first; the rest of the unit is "Go deeper", offered after the spine */
function fxSpineIds(u) {
  // the core path, plus the parts that use something the family has bought
  const id = u?.c?.unit || u?.id,
    I = DATA.units?.[id] || {},
    P = I.parts || [],
    base = I.spine?.length ? I.spine.filter((x) => P.some((p) => p[0] === x)) : P.map((p) => p[0]),
    B = S.bought || {},
    add = [];
  (I.buy || []).forEach((b) => {
    if (B[id + "|" + b.item])
      (b.used_in || []).forEach((x) => {
        if (P.some((p) => p[0] === x) && !base.includes(x) && !add.includes(x)) add.push(x);
      });
  });
  return [...base, ...add];
}
function fxPack(u, L) {
  const cap = Math.max(20, Math.round(hpdOf(u.subj || "sci") * 60)),
    D = [];
  let cur = [],
    m = 0;
  for (const p of L) {
    if (cur.length && m + p[3] > cap) {
      D.push(cur);
      cur = [];
      m = 0;
    }
    cur.push(p);
    m += p[3];
  }
  if (cur.length) D.push(cur);
  return D;
}
function fxSpineDays(u) {
  const P = fxParts(u),
    sp = fxSpineIds(u);
  return fxPack(
    u,
    sp.map((id) => P.find((p) => p[0] === id)),
  );
}
function fxDeeper(u) {
  const sp = new Set(fxSpineIds(u));
  return fxParts(u).filter((p) => !sp.has(p[0]));
}
function fxDayPlan(u) {
  const D = [...fxSpineDays(u), ...fxPack(u, fxDeeper(u))];
  return D.length ? D : [[]];
}
function fxDaySteps(u, n) {
  const D = fxDayPlan(u),
    day = D[Math.min(n, D.length) - 1] || [],
    id = u.c.unit,
    P = fxParts(u);
  return day.map((p) => {
    const [lab, ic] = FXKC[fxGroup(p[2])] || ["Part", "✨"],
      i = P.findIndex((x) => x[0] === p[0]);
    return {
      kind: p[2] === "worksheets" ? "work" : p[2] === "quiz" ? "check" : "learn",
      label: lab,
      icon: ic,
      title: p[1],
      mins: p[3] / 60,
      html: `<p class="xs"><button class="link" data-act="fxopen" data-u="${esc(id)}">📚 Open the whole unit: every part, games, worksheets and more</button></p><p class="xs muted">Part ${i + 1} of ${P.length} · ${p[3]} min · ${{ done: "✔ done", pending: "⏳ pending: questions left", going: "▶ started", none: "not started" }[fxStates(id)[i]]}</p><button class="btn sm" data-act="fxpart" data-u="${esc(id)}" data-p="${esc(p[0])}">${ic} Open this part</button>`,
    };
  });
}
// On the board track, a family opens the DeepKids units linked to their own boards' chapters; the rest show, locked.
// The DeepKids track opens every unit (TRACKS.md "Who can see what").
function dkUnitOpen(id) {
  if (["combined", "none"].includes(S.board)) return true;
  const B = boardsOn();
  return DATA.items.some((i) => B.includes(i.board) && (i.c?.units || []).some((x) => x.id === id));
}
const fxLockedCard = (x, I) =>
  `<div class="fxucard locked"><button class="fxopenbtn" data-act="fxopen" data-u="${esc(x.id)}">${I.img?.summary ? `<img src="${esc(I.img.summary)}" alt="">` : "<span>🔒</span>"}<span><b>${esc(x.title)}</b> <span class="lk">🔒</span><br><span class="xs muted">On the DeepKids track · not linked to your board's chapters</span></span></button></div>`;
const fxUnitBtns = (L) =>
  L.map((x) => {
    if (!dkUnitOpen(x.id)) return fxLockedCard(x, DATA.units?.[x.id] || {});
    const I = DATA.units?.[x.id] || {},
      k = "unit|" + x.id,
      u = unitBy(k),
      P = I.parts || [],
      X = fxStates(x.id),
      isD = (p) => X[P.indexOf(p)] === "done",
      nd = P.filter(isD).length,
      np = X.filter((z) => z === "pending").length,
      SD = u ? fxSpineDays(u) : [],
      tot = P.reduce((a, p) => a + p[3], 0),
      D = u ? fxDayPlan(u) : [],
      di = Math.max(
        0,
        D.findIndex((d) => d.some((p) => !isD(p))),
      ),
      day = D[di] || [],
      s = u?.subj || "sci";
    return `<div class="fxucard"><button class="fxopenbtn" data-act="fxopen" data-u="${esc(x.id)}">${I.img?.summary ? `<img src="${esc(I.img.summary)}" alt="">` : "<span>▶</span>"}<span><b>${esc(x.title)}</b><br><span class="xs muted">Subtopic: ${esc(I.subtopic || "")} · Topic: ${esc(I.topic || "")}</span></span></button>
  <ul class="fxustat xs"><li><b>Next session:</b> ${day.reduce((m, p) => m + p[3], 0)} min · ${di < SD.length ? `core session ${di + 1} of ${SD.length}` : "go deeper"}: ${day
    .map((p) => esc(p[1]))
    .slice(0, 3)
    .join(
      ", ",
    )}${day.length > 3 ? "…" : ""}</li><li><b>Whole unit:</b> about ${Math.round((tot / 60) * 10) / 10} hours, ${D.length} sessions</li><li><b>Core path:</b> ${SD.length} sessions${u && rank[fxUnitSt(k)] >= 2 ? " · done ✔" : ""} · <b>Go deeper:</b> ${u ? fxDeeper(u).length : 0} more parts</li><li><b>Done:</b> ${nd} of ${P.length} parts${np ? ` · ${np} pending` : ""}</li></ul>
  ${(S.extra?.[s] || []).includes(k) ? `<p class="xs"><b>✓ In the plan</b> · ${(S.next?.[s] || [])[0] === k ? "comes next" : "in the queue"} · <button class="link xs" data-fxsee="${s}" data-k="${esc(k)}">See it in Plan</button></p>` : `<div class="row" style="align-items:center"><button class="btn sm" data-act="fxq" data-front="1" data-s="${s}" data-k="${esc(k)}">＋ Add to plan</button><button class="link xs" data-act="fxq" data-s="${s}" data-k="${esc(k)}">or add it at the end</button></div>`}</div>`;
  }).join("");
// what a locked unit says when tapped
const dkLocked = () =>
  toast(
    "This unit is on the DeepKids track. Your board track opens the DeepKids units for your board's chapters. To open them all, choose the DeepKids track in Settings.",
    7000,
  );
const fxDaysSince = (d) => Math.round((parse(today) - parse(d)) / 864e5);
function fxPS(id, p) {
  const F = fxSt(),
    D = F.done[id] || {},
    T = (F.time[id] || {})[p[0]] || 0;
  if (D["man:" + p[0]]) return "done";
  let a = 0;
  if (p[6]) for (const k in D) if (k.startsWith("q:" + p[6])) a++;
  const reached = !!D["sec:" + p[0]],
    ok = a >= (p[4] || 0);
  if (reached && ok) {
    if ((p[5] || 1) > 1) {
      const s0 = D["start:" + p[0]];
      if (!s0 || fxDaysSince(s0) < p[5] - 1) return "going";
    }
    return "done";
  }
  if (reached) return "pending";
  if (T > 0 || a > 0 || D["open:" + p[0]]) return "going";
  return "none";
}
function fxStates(id) {
  const I = DATA.units?.[id] || {},
    P = I.parts || [],
    S0 = P.map((p) => fxPS(id, p)),
    sp = I.spine?.length ? I.spine : P.map((p) => p[0]),
    pos = (x) => sp.indexOf(x),
    last = Math.max(-1, ...sp.map((x, j) => (S0[P.findIndex((p) => p[0] === x)] === "done" ? j : -1)));
  return S0.map((x, i) => (x === "none" && pos(P[i][0]) >= 0 && pos(P[i][0]) < last ? "pending" : x));
}
// a core-path part skipped while a later core part was finished = pending; Go deeper parts are optional
function fxUnitSt(k) {
  const id = k.slice(5),
    I = DATA.units?.[id];
  if (!I) return S.progress[k]?.status || "none";
  const P = I.parts || [],
    X = fxStates(id),
    sp = new Set(I.spine?.length ? I.spine : P.map((p) => p[0]));
  if (X.length && X.every((x) => x === "done")) return "mastered";
  if (P.every((p, i) => !sp.has(p[0]) || X[i] === "done")) return "completed";
  return X.some((x) => x !== "none") ? "learning" : "none";
}
function fxSessionsDone(k) {
  const u = unitBy(k);
  if (!u) return 0;
  const X = fxStates(k.slice(5)),
    P = fxParts(u),
    ok = (p) => X[P.findIndex((q) => q[0] === p[0])] === "done";
  let n = 0;
  for (const d of fxSpineDays(u)) {
    if (d.every(ok)) n++;
    else break;
  }
  return n;
}
// Dates every part that is now done; a part done just now also adds its linked units to the plan
function fxStamp(id) {
  const F = fxSt(),
    D = (F.done[id] = F.done[id] || {}),
    parts = DATA.units?.[id]?.parts || [],
    before = new Set(Object.keys(D).filter((k) => k.startsWith("at:")));
  let changed = 0,
    added = 0;
  parts.forEach((p) => {
    if (!D["at:" + p[0]] && fxPS(id, p) === "done") {
      D["at:" + p[0]] = today;
      changed = 1;
    }
  });
  if (changed) save();
  parts.forEach((p) => {
    if (before.has("at:" + p[0]) || !D["at:" + p[0]]) return;
    (p[7] || []).forEach((lk) => {
      if (!DATA.units?.[lk]) return;
      const k = "unit|" + lk,
        s = lk.split(".")[0];
      if (!S.subjects.includes(s)) return;
      if (rank[st(k)] >= 2) return;
      S.extra = { ...(S.extra || {}), [s]: [...new Set([...((S.extra || {})[s] || []), k])] };
      S.next = { ...(S.next || {}), [s]: [k, ...((S.next || {})[s] || []).filter((x) => x !== k)] };
      added = 1;
      toast(`Linked lesson added to tomorrow: ${DATA.units[lk].title}`, 5000);
    });
  });
  if (added) setTimeout(commit, 0);
}
const FXWT = {
  worksheets: "ws",
  quiz: "qz",
  experiments: "exp",
  projects: "proj",
  activities: "act",
  games: "act",
  challenges: "act",
};
function fxTrack(rungs, s, l) {
  const U = (id) => unitBy("unit|" + id),
    req = [],
    more = [],
    over = [];
  rungs.forEach((r) => {
    const L = (r.c?.units || [])
      .map((x) => x.id)
      .filter((id) => DATA.units?.[id])
      .sort((a, b) => (DATA.units[a].order || 0) - (DATA.units[b].order || 0));
    if (!L.length) {
      over.push(r);
      return;
    }
    L.forEach((id) => {
      const u = U(id);
      if (u) (DATA.units[id].req ? req : more).push(u);
    });
  });
  return [...req, ...over, ...more];
}
const fxReq = (u) => u?.board !== "unit" || !!DATA.units?.[u.c?.unit]?.req;
/* the school year: from the start date, ten months (a parent can set S.yearEnd) */
const fxYearEnd = () =>
  S.yearEnd ||
  iso(
    new Date(
      parse(S.start || today).getFullYear(),
      parse(S.start || today).getMonth() + 10,
      parse(S.start || today).getDate(),
    ),
  );
/* one sprint week each quarter: weeks 12, 25 and 38 from the start; only board-required lessons are planned that week */
function fxSprint(date) {
  const w = Math.floor((parse(date) - parse(S.start || today)) / (7 * 864e5));
  return S.board === "combined" && [12, 25, 38].includes(w);
}
function fxTake(queue, date) {
  if (fxSprint(date)) {
    const i = queue.findIndex((x) => fxReq(x.u));
    if (i > 0) return queue.splice(i, 1)[0];
  }
  return queue.shift();
}
/* year-end check: when will this subject's board-required lessons be done at the current pace? */
function fxCoverageNote() {
  if (S.board !== "combined") return "";
  const rows = S.subjects
    .map((s) => {
      const sc = schedule(s, 800),
        R = sc.filter((x) => fxReq(x.u) && x.u.level === S.levels[s]);
      if (!R.length) return "";
      const last = R[R.length - 1].date,
        end = fxYearEnd(),
        ok = last <= end;
      return `<li>${SUBJ[s]}: board topics done by <b>${fmt(last)}</b> ${ok ? "✔ before the year ends (" + fmt(end) + ")" : `⚠️ after the year ends (${fmt(end)}). Add a day or a few minutes a day in Pace, or the sprint weeks will catch up.`}</li>`;
    })
    .join("");
  return rows
    ? `<section class="sec"><div class="sech"><h3>On track for the year?</h3></div><ul class="xs">${rows}</ul><p class="xs muted">One week each quarter is a catch-up sprint: only board topics are planned that week.</p></section>`
    : "";
}
/* ongoing multi-day experiments and projects from units: today's check-in and its minutes */
function fxOngoing(date) {
  const out = [];
  Object.keys(DATA.units || {}).forEach((id) => {
    const D = fxSt().done[id] || {};
    (DATA.units[id].parts || []).forEach((p) => {
      if ((p[5] || 1) < 2) return;
      const s0 = D["start:" + p[0]];
      if (!s0 || s0 > date) return;
      const day = Math.round((parse(date) - parse(s0)) / 864e5) + 1;
      if (day > p[5] || fxPS(id, p) === "done") return;
      const t = (p[8] || []).find((x) => x[0] === day);
      out.push({
        title: `${p[1]} · day ${day} of ${p[5]}` + (t ? ": " + t[2] : ""),
        checks: [],
        mins: t ? +t[1] || 5 : 5,
        fx: id,
      });
    });
  });
  return out;
}
const fxOM = (open) => Math.min(30, 5 + open.filter((e) => e.fx).reduce((a, e) => a + e.mins, 0));
/* linked units: when a part is finished, the units it links to (a maths problem's maths unit, a project's units) join tomorrow's plan */
/* the DeepKids-track year plan (DATA.combined) lists topics in teaching order; each topic with written units is taught through
   them (board-required units in place, DeepKids-only units after the board topics) */
function fxExpand(base) {
  const out = [],
    more = [];
  base.forEach((r) => {
    const L =
      r.board === "combined"
        ? (r.c?.units || [])
            .map((x) => x.id)
            .filter((id) => DATA.units?.[id])
            .sort((a, b) => (DATA.units[a].order || 0) - (DATA.units[b].order || 0))
        : [];
    if (!L.length) {
      out.push(r);
      return;
    }
    L.forEach((id) => {
      const u = unitBy("unit|" + id);
      if (u) (DATA.units[id].req ? out : more).push(u);
    });
  });
  return [...out, ...more];
}
function fxWarmUnit(date) {
  const L = lessonsOn(date || today).map((l) => l.u);
  let u = L.find((x) => x.board === "unit");
  if (u) return u.c.unit;
  for (const x of [...L, dailyUnit()].filter(Boolean)) {
    const r = (x.c?.units || []).find((y) => DATA.units?.[y.id]);
    if (r) return r.id;
  }
  return null;
}
function fxRefs() {
  const F = fxSt();
  return Object.entries(F.ref || {})
    .map(([id, L]) => ({ id, n: (L || []).filter((r) => r.k).length }))
    .filter((x) => x.n && DATA.units?.[x.id]);
}
const FXGAP = [3, 10, 30, 60];
function fxReviews(date) {
  const R = S.fxRev || {};
  return Object.keys(DATA.units || {})
    .filter((id) => rank[fxUnitSt("unit|" + id)] >= 2)
    .map((id) => {
      const D = fxSt().done[id] || {},
        last = Object.keys(D)
          .filter((k) => k.startsWith("at:"))
          .map((k) => D[k])
          .sort()
          .pop(),
        r = R[id] || { n: 0, at: null },
        from = r.at || last;
      return from && Math.round((parse(date) - parse(from)) / 864e5) >= FXGAP[Math.min(r.n, 3)] ? { id, n: r.n } : null;
    })
    .filter(Boolean);
}
function fxPrep(u, n) {
  const D = fxDayPlan(u),
    day = D[Math.min(n, D.length) - 1] || [],
    out = [];
  day.forEach((p) =>
    (p[9] || []).forEach(([it, q, url], i) => {
      if (!it) return;
      out.push({
        id: `p|${u.k}|${p[0]}|${i}`,
        kind: url ? "buy" : "act",
        lead: url ? 2 : i === 0 && (p[5] || 1) > 1 ? 1 : 0,
        task: (url ? "Get: " : "Gather: ") + it + (q ? ` (${q})` : ""),
        where: url ? "Shop link in the lesson" : `For “${p[1]}”`,
        url,
      });
    }),
  );
  return out;
}
function fxWeekList() {
  const until = addDays(today, 7),
    seen = new Set(),
    buy = [],
    home = [];
  upcoming()
    .filter((x) => x.date >= today && x.date <= until && x.u.board === "unit")
    .forEach((x) =>
      fxPrep(x.u, x.n).forEach((p) => {
        const key = p.task;
        if (seen.has(key)) return;
        seen.add(key);
        (p.url ? buy : home).push({ ...p, date: x.date, lesson: x.u.title });
      }),
    );
  const row = (p) =>
    `<label class="row" style="gap:8px"><input type="checkbox" data-fxtick="${esc(p.id)}" ${S.prep[p.id] ? "checked" : ""}><span class="sm">${esc(p.task.replace(/^(Get|Gather): /, ""))} <span class="xs muted">· ${fmt(p.date)} · ${esc(p.lesson)}</span>${p.url ? ` <a target="_blank" rel="noopener" href="${esc(p.url)}">🛒</a>` : ""}</span></label>`;
  if (!buy.length && !home.length) return "";
  return `<section class="sec"><div class="sech"><h3>This week: buy and gather</h3></div>${buy.length ? `<p class="xs"><b>To buy</b></p>${buy.map(row).join("")}` : ""}${home.length ? `<p class="xs"><b>From home</b></p>${home.map(row).join("")}` : ""}<p class="xs muted">Each item also shows in the morning or evening prep the day it is needed.</p></section>`;
}
/* Practise again: every finished unit and chapter, plus every question answered wrongly anywhere */
function fxPractiseAll() {
  const U = fxRefs(),
    done = Object.keys(DATA.units || {}).filter((id) => rank[fxUnitSt("unit|" + id)] >= 2),
    R = S.fxRev || {},
    L = learnedUnits().filter((u) => u.board !== "unit" && rank[coverage(u)] >= 2);
  const due = (id) => {
    const r = R[id] || { n: 0 };
    const D = fxSt().done[id] || {},
      last =
        r.at ||
        Object.keys(D)
          .filter((k) => k.startsWith("at:"))
          .map((k) => D[k])
          .sort()
          .pop();
    return last ? addDays(last, FXGAP[Math.min(r.n, 3)]) : today;
  };
  const w = U.length
    ? `<p class="xs"><b>Questions to try again</b></p>${U.map((x) => `<div class="row" style="justify-content:space-between"><span class="sm">${esc(DATA.units[x.id].title)} · ${x.n} question${x.n > 1 ? "s" : ""}</span><button class="btn sm" data-fxprac="${esc(x.id)}">Try them</button></div>`).join("")}`
    : "";
  const d =
    done.length || L.length
      ? `<p class="xs" style="margin-top:10px"><b>Finished, to keep fresh</b></p>${done
          .map((id) => {
            const dd = due(id);
            return `<div class="row" style="justify-content:space-between"><span class="sm">${esc(DATA.units[id].title)} · <span class="muted">${dd <= today ? "due now" : "next review " + fmt(dd)}</span></span><button class="btn soft sm" data-act="fxpart" data-fxrev="${esc(id)}" data-u="${esc(id)}" data-p="quiz">Review</button></div>`;
          })
          .join(
            "",
          )}${L.map((u) => `<div class="row" style="justify-content:space-between"><span class="sm">${esc(chT(u))}</span><button class="btn soft sm" data-act="chapter" data-k="${u.k}">Review</button></div>`).join("")}`
      : "";
  return w || d
    ? `<section class="card">${w}${d}<p class="xs muted">The daily plan takes about ${RFS().mins} minutes from this list, most due first.</p></section>`
    : Object.values(masteryLists()).some((L) => L.length)
      ? ""
      : `<section class="card"><b>Nothing to practise yet</b><p class="sm muted">When your child gets a question wrong anywhere, or finishes a unit or chapter, it comes here to practise and review.</p></section>`;
}
