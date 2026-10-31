/* Worksheets and Mission books: on screen, printed, and checking answers */
/* kolam: one dot per thing in the day; a loop is drawn round each one done */
const FDIR = { up: "↑", down: "↓", left: "←", right: "→" };
function forceSvg(obj, fs) {
  const L = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] },
    c = [150, 95];
  return `<svg viewBox="-20 -24 340 240" class="fdiag" role="img" aria-label="Force diagram of ${esc(obj)}"><rect x="115" y="70" width="70" height="50" rx="10" fill="var(--sunk)" stroke="var(--ink)" stroke-width="2.5"/><text x="150" y="100" text-anchor="middle" font-size="11" fill="var(--ink)">${esc(obj.length > 16 ? obj.slice(0, 15) + "…" : obj)}</text>
   ${fs
     .map((f, i) => {
       const [dx, dy] = L[f.dir] || [0, 0],
         n = fs.slice(0, i).filter((g) => g.dir === f.dir).length,
         o = (n % 2 ? 1 : -1) * Math.ceil(n / 2) * 16,
         sx = c[0] + dx * (dy ? 0 : 35) + (dy ? o : 0),
         sy = c[1] + dy * (dx ? 0 : 25) + (dx ? o : 0),
         ex = sx + dx * 70,
         ey = sy + dy * 55;
       return `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="var(--tang,#e0533d)" stroke-width="4" marker-end="url(#fa)"/><text x="${ex + dx * 6}" y="${ey + dy * 12 + (dx ? 4 : 0)}" text-anchor="${dx > 0 ? "start" : dx < 0 ? "end" : "middle"}" font-size="11" fill="var(--ink)">${esc(f.name)}</text>`;
     })
     .join("")}
   <defs><marker id="fa" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="var(--tang,#e0533d)"/></marker></defs></svg>`;
}
function forcesCheck(it, fs) {
  const key = (f) => f.name + "|" + f.dir,
    want = new Set(it.a.map(key));
  const right = fs.filter((f) => want.has(key(f))),
    wrongDir = fs.filter((f) => !want.has(key(f)) && it.a.some((a) => a.name === f.name)),
    extra = fs.filter((f) => !it.a.some((a) => a.name === f.name)),
    missing = it.a.filter((a) => !fs.some((f) => f.name === a.name));
  return { ok: right.length === it.a.length && fs.length === it.a.length, right, wrongDir, extra, missing };
}
/* answer key text for the AI checker */
function keyText(it) {
  return it.t === "mcq"
    ? it.opts[it.a]
    : it.t === "fill"
      ? it.a.join(" / ")
      : it.t === "match"
        ? it.pairs.map((p) => p.join(" → ")).join("; ")
        : it.t === "forces"
          ? it.a.map((f) => f.name + " " + f.dir).join(", ")
          : it.t === "sort"
            ? "sorted into: " + it.cats.join(", ")
            : "open answer: judge the reasoning";
}
/* line art (prints well in black and white, and can be coloured in). pts = numbered label points, in order */
const L = 'stroke="#2B2340" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"';
const ART = {
  plant: {
    w: 300,
    h: 320,
    svg: `<path d="M30 220 H270" ${L}/><path d="M50 228h6M90 232h4M200 230h6M240 226h4M120 236h5" ${L} stroke-width="2"/>
  <path d="M150 220 C148 180 152 130 150 96" ${L}/>
  <g transform="translate(150 70)">${[0, 72, 144, 216, 288].map((a) => `<ellipse rx="13" ry="25" transform="rotate(${a}) translate(0 -24)" fill="#fff" ${L.replace('fill="none"', "")}/>`).join("")}<circle r="11" fill="#fff" ${L.replace('fill="none"', "")}/></g>
  <path d="M150 150 C130 118 100 116 78 128 C100 146 130 154 150 150 Z M150 150 L84 129" ${L}/><path d="M150 182 C172 152 204 150 224 160 C204 180 172 186 150 182 Z M150 182 L218 160" ${L}/>
  <path d="M150 220 C150 250 148 275 150 305 M150 238 C135 250 120 262 108 280 M150 244 C165 255 180 266 193 283 M150 266 C140 276 132 286 128 302 M150 268 C160 280 168 292 173 306" ${L}/>`,
    pts: [
      [150, 30],
      [92, 108],
      [166, 206],
      [150, 300],
    ],
  },
  bean: {
    w: 300,
    h: 220,
    svg: `<path d="M40 110 C40 40 150 20 220 40 C290 60 290 170 220 185 C150 200 40 180 40 110 Z" ${L}/><path d="M56 110 C56 56 150 40 214 56 C272 74 272 158 214 170 C150 184 56 166 56 110 Z" ${L} stroke-dasharray="6 5"/>
  <path d="M150 50 C140 90 140 130 150 176" ${L}/><path d="M232 104 C214 100 200 104 190 114 C200 122 214 124 232 118" ${L}/><path d="M196 110 C186 92 176 86 166 88 M196 112 C190 96 186 86 182 74" ${L}/><path d="M232 110 C246 112 254 120 258 132" ${L}/>`,
    pts: [
      [40, 110],
      [100, 110],
      [172, 84],
      [258, 138],
    ],
  },
  leaves: {
    w: 320,
    h: 240,
    svg: `<path d="M80 30 C30 60 20 150 80 200 C140 150 130 60 80 30 Z" ${L}/><path d="M80 200 V230 M80 40 V200" ${L}/>${[60, 90, 120, 150, 175].map((y, i) => `<path d="M80 ${y} C66 ${y - 8} 54 ${y - 10} 44 ${y - 6} M80 ${y} C94 ${y - 8} 106 ${y - 10} 116 ${y - 6}" ${L} stroke-width="1.8"/>`).join("")}<path d="M56 80 l6 10 M104 80 l-6 10 M52 120 l8 8 M108 120 l-8 8" ${L} stroke-width="1.2"/>
  <path d="M230 20 C214 80 214 160 230 228 C246 160 246 80 230 20 Z" ${L}/>${[-10, -5, 0, 5, 10].map((d) => `<path d="M${230 + d} ${30 + Math.abs(d)} C${228 + d * 1.3} 90 ${228 + d * 1.3} 160 ${230 + d} ${218 - Math.abs(d)}" ${L} stroke-width="1.4"/>`).join("")}
  <text x="80" y="18" text-anchor="middle" font-size="16" font-weight="700">A</text><text x="230" y="14" text-anchor="middle" font-size="16" font-weight="700">B</text>`,
    pts: [],
  },
  roots: {
    w: 320,
    h: 240,
    svg: `<path d="M10 40 H310" ${L}/><path d="M80 20 V40 M70 22 C76 30 80 36 80 40 M90 22 C84 30 80 36 80 40" ${L}/><path d="M80 40 C86 100 84 160 80 225" ${L} stroke-width="4"/><path d="M82 80 C70 86 60 96 52 108 M82 100 C96 106 106 116 112 130 M82 130 C70 138 62 150 58 164 M81 160 C92 168 98 180 100 194" ${L} stroke-width="1.8"/>
  <path d="M240 20 V40 M228 22 C236 30 240 36 240 40 M252 22 C244 30 240 36 240 40" ${L}/>${[-40, -28, -16, -6, 4, 14, 26, 38].map((d, i) => `<path d="M240 40 C${240 + d * 0.4} 90 ${240 + d} 150 ${240 + d * 1.1} ${180 + (i % 3) * 14}" ${L} stroke-width="1.8"/>`).join("")}
  <text x="80" y="16" text-anchor="middle" font-size="16" font-weight="700">A</text><text x="240" y="16" text-anchor="middle" font-size="16" font-weight="700">B</text>`,
    pts: [],
  },
  glass: {
    w: 220,
    h: 300,
    svg: `<path d="M50 150 L65 290 H155 L170 150" ${L}/><path d="M52 170 C80 178 140 162 168 170" ${L} stroke-dasharray="5 4"/><path d="M110 280 C108 200 112 120 110 70" ${L}/><g transform="translate(110 50)">${[0, 60, 120, 180, 240, 300].map((a) => `<ellipse rx="10" ry="22" transform="rotate(${a}) translate(0 -20)" fill="#fff" ${L.replace('fill="none"', "")}/>`).join("")}<circle r="9" fill="#fff" ${L.replace('fill="none"', "")}/></g><path d="M124 250 V130 M118 140 l6 -10 6 10" ${L} stroke-width="2"/><text x="20" y="230" font-size="13">coloured</text><text x="20" y="246" font-size="13">water</text>`,
    pts: [],
  },
  tulsi: {
    w: 300,
    h: 260,
    svg: `<path d="M90 160 H210 L196 248 H104 Z M84 150 H216 V164 H84 Z" ${L}/><path d="M110 200 c8 -10 16 0 24 -8 M160 210 c10 -8 18 2 26 -6" ${L} stroke-width="1.8"/><path d="M150 150 C150 120 150 90 152 60" ${L}/><path d="M151 120 C130 118 112 128 100 146 M151 100 C172 98 190 110 200 130 M152 80 C134 76 120 84 112 100 M152 66 C164 56 176 58 186 66" ${L}/>
  ${[[146], [130], [100], [66]]
    .map(
      ([x, y]) =>
        `<ellipse cx="${x}" cy="${y + 8}" rx="7" ry="12" transform="rotate(20 ${x} ${y + 8})" fill="#fff" ${L.replace('fill="none"', "")}/>`,
    )
    .join(
      "",
    )}<path d="M120 252 h60" ${L} stroke-width="4"/><text x="150" y="276" text-anchor="middle" font-size="13">no hole underneath</text><path d="M232 40 l10 14 M246 30 l0 16 M258 42 l-10 12" ${L} stroke-width="1.6"/><text x="250" y="76" text-anchor="middle" font-size="12">dark corner</text>`,
    pts: [],
  },
  heli: {
    w: 200,
    h: 600,
    svg: `<rect x="0" y="0" width="200" height="600" fill="#fff" stroke="#2B2340" stroke-width="2" stroke-dasharray="8 6"/><path d="M100 0 V280" stroke="#2B2340" stroke-width="2.5" stroke-dasharray="8 6"/><path d="M0 280 H200" stroke="#2B2340" stroke-width="1.6" stroke-dasharray="2 5"/>
  <path d="M0 380 H60 M200 380 H140" stroke="#2B2340" stroke-width="2.5" stroke-dasharray="8 6"/><path d="M60 380 V600 M140 380 V600" stroke="#2B2340" stroke-width="1.6" stroke-dasharray="2 5"/>
  <text x="50" y="140" text-anchor="middle" font-size="22" font-weight="700">A</text><text x="50" y="170" text-anchor="middle" font-size="13">fold forward</text><text x="150" y="140" text-anchor="middle" font-size="22" font-weight="700">B</text><text x="150" y="170" text-anchor="middle" font-size="13">fold back</text>
  <text x="100" y="520" text-anchor="middle" font-size="13">fold both sides in,</text><text x="100" y="538" text-anchor="middle" font-size="13">add a paper clip here</text><text x="112" y="40" font-size="18">✂</text><text x="6" y="374" font-size="18">✂</text><text x="176" y="374" font-size="18">✂</text>`,
    pts: [],
    mm: [50, 150],
  },
  sal: {
    w: 120,
    h: 110,
    svg: `<ellipse cx="40" cy="86" rx="12" ry="10" ${L}/><path d="M48 80 C70 50 96 26 110 14 C96 40 78 66 50 90" ${L}/><path d="M50 84 C72 60 92 40 108 18" ${L} stroke-width="1.2"/>`,
    pts: [],
  },
  aak: {
    w: 120,
    h: 110,
    svg: `<ellipse cx="60" cy="92" rx="8" ry="11" ${L}/>${[-60, -40, -20, 0, 20, 40, 60].map((a) => `<path d="M60 82 L${60 + Math.sin((a * Math.PI) / 180) * 60} ${82 - Math.cos((a * Math.PI) / 180) * 70}" ${L} stroke-width="1.3"/>`).join("")}`,
    pts: [],
  },
  burr: {
    w: 120,
    h: 110,
    svg: `<ellipse cx="60" cy="55" rx="34" ry="22" ${L}/>${Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2,
        x = 60 + Math.cos(a) * 34,
        y = 55 + Math.sin(a) * 22,
        x2 = 60 + Math.cos(a) * 46,
        y2 = 55 + Math.sin(a) * 32;
      return `<path d="M${x} ${y} L${x2} ${y2} q4 -2 2 -6" ${L} stroke-width="1.6"/>`;
    }).join("")}`,
    pts: [],
  },
  coconut: {
    w: 120,
    h: 110,
    svg: `<path d="M10 92 c12 -8 22 8 34 0 s22 8 34 0 s22 8 34 0" ${L}/><ellipse cx="60" cy="58" rx="34" ry="28" ${L}/><circle cx="52" cy="46" r="4" ${L}/><circle cx="66" cy="44" r="4" ${L}/><circle cx="60" cy="56" r="4" ${L}/>`,
    pts: [],
  },
  balsam: {
    w: 120,
    h: 110,
    svg: `<path d="M30 80 C40 50 70 40 86 46 C80 66 56 84 30 80 Z" ${L}/><path d="M86 46 C96 30 104 24 112 22 M86 46 C100 44 110 48 116 56" ${L} stroke-width="1.8"/>${[
      [14],
      [70],
      [40],
      [22],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" ${L}/>`)
      .join("")}<path d="M62 30 l-4 -6 M94 66 l6 6 M36 54 l-8 -4" ${L} stroke-width="1.4"/>`,
    pts: [],
  },
  mango: {
    w: 120,
    h: 110,
    svg: `<path d="M40 30 C80 10 110 50 96 80 C84 104 44 104 30 80 C20 62 22 40 40 30 Z" ${L}/><path d="M56 26 C58 16 66 10 74 8 M60 22 C70 14 84 14 92 20 C82 26 70 26 60 22 Z" ${L}/>`,
    pts: [],
  },
  medal: {
    w: 200,
    h: 220,
    svg: `<path d="M70 120 L50 210 L80 190 L100 215 L110 130 M130 120 L150 210 L120 190 L100 215" ${L}/><circle cx="100" cy="90" r="70" ${L}/><circle cx="100" cy="90" r="58" ${L} stroke-width="1.5"/><path d="M100 140 C100 110 100 80 102 52 M101 110 C86 104 76 92 72 78 C88 78 98 90 101 110 Z M101 88 C116 82 126 70 128 56 C112 58 102 70 101 88 Z" ${L}/>`,
    pts: [],
  },
};
const artSvg = (n, cls = "wart") => {
  const A = ART[n];
  if (!A) return "";
  return A.mm
    ? `<svg class="${cls}" viewBox="0 0 ${A.w} ${A.h}" style="width:${A.mm[0]}mm;height:${A.mm[1]}mm">${A.svg}</svg>`
    : `<svg class="${cls}" viewBox="0 0 ${A.w} ${A.h}">${A.svg}</svg>`;
};
const lines = (n) => Array.from({ length: n }, () => `<div class="wline"></div>`).join("");
/* new block types for books; returns {h,k} like wsBlock */
function bookBasicBlock(b, seed, i) {
  const H = (t, inst) =>
    `<div class="wbh"><span class="wbn">${i + 1}</span><div><b>${esc(b.title || t)}</b>${b.inst || inst ? `<div class="winst">${esc(b.inst || inst)}</div>` : ""}</div></div>`;
  let h = "",
    k = "";
  const r = wsRng(seed + "|" + i);
  if (b.type === "read") {
    h =
      (b.text.length || b.art
        ? `<div class="wread">${b.art ? `<div class="wreadart">${artSvg(b.art)}${b.caption ? `<div class="wcap">${esc(b.caption)}</div>` : ""}</div>` : ""}<h3>${esc(b.title)}</h3>${b.text.map((p) => `<p>${esc(p)}</p>`).join("")}</div>`
        : "") +
      `${b.facts?.length ? `<div class="wfacts"><b>Did you know?</b>${b.facts.map((f) => `<div>★ ${esc(f)}</div>`).join("")}</div>` : ""}`;
    return { h, k, bare: 1 };
  }
  if (b.type === "case") {
    h = `<div class="wcase"><div class="wcasehd">🔎 ${esc(b.title || "The case")}</div>${b.art ? `<div class="wcaseart">${artSvg(b.art)}</div>` : ""}${b.story.map((p) => `<p>${esc(p)}</p>`).join("")}${b.task ? `<p class="wtask"><b>Your mission:</b> ${esc(b.task)}</p>` : ""}</div>`;
    return { h, k, bare: 1 };
  }
  if (b.type === "clue") {
    h = `<div class="wclue"><b>🗝️ Clue ${esc(b.n)}</b> ${esc(b.text)}<div class="winst">Copy it onto the Case board on the last pages.</div></div>`;
    return { h, k, bare: 1 };
  }
  if (b.type === "label2") {
    const A = ART[b.art];
    h =
      H("Label it", "Write the words from the box next to the numbers.") +
      `<div class="wlab"><svg viewBox="-30 -30 ${A.w + 60} ${A.h + 60}" class="wdiag">${A.svg}${A.pts.map((p, j) => `<circle cx="${p[0]}" cy="${p[1]}" r="12" fill="#fff" stroke="#2B2340" stroke-width="2.5"/><text x="${p[0]}" y="${p[1] + 5}" text-anchor="middle" font-size="14" font-weight="700">${j + 1}</text>`).join("")}</svg><div><div class="wbank">${wsShuf(
        b.labels,
        r,
      )
        .map((w) => `<span>${esc(w)}</span>`)
        .join(
          "",
        )}</div>${b.labels.map((_, j) => `<div class="wline">${j + 1}. </div>`).join("")}${b.jobs ? `<div class="winst" style="margin-top:6px">Now write what each part does:</div>${b.labels.map((_, j) => `<div class="wline">${j + 1} does this: </div>`).join("")}` : ""}</div></div>`;
    k = b.labels.map((l, j) => `${j + 1}. ${esc(l)}${b.jobs ? " — " + esc(b.jobs[j]) : ""}`).join("<br>");
    return { h, k };
  }
  if (b.type === "art") {
    h =
      H(b.title, b.inst) +
      `<div class="wartrow">${artSvg(b.art)}</div>${b.qs ? `<ol class="wqs">${b.qs.map((q) => `<li>${esc(q.q)}${lines(q.lines || 1)}</li>`).join("")}</ol>` : ""}`;
    k = (b.qs || []).map((q, j) => `${j + 1}. ${esc(q.a || "")}`).join("<br>");
    return { h, k };
  }
  if (b.type === "investigate") {
    h =
      H(b.title, "") +
      `<div class="winv"><div><b>Question:</b> ${esc(b.q)}</div>${b.art ? `<div class="winvart">${artSvg(b.art)}</div>` : ""}<div><b>You need:</b> ${esc(b.need.join(", "))}</div><ol>${b.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
    <div class="wpredict"><b>I predict:</b>${lines(2)}<b>because</b>${lines(1)}</div></div>${b.table ? `<table class="wtab">${`<tr>${b.table.cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr>`}${(b.table.rows || Array(4).fill(null)).map((rw) => `<tr>${b.table.cols.map((_, j) => `<td>${rw && rw[j] != null ? esc(rw[j]) : ""}</td>`).join("")}</tr>`).join("")}</table>` : ""}
    ${b.draw ? `<div class="wobs">${b.draw.map((d) => `<div><div class="wobsbox"></div><span>${esc(d)}</span></div>`).join("")}</div>` : ""}${b.conclude ? `<div class="wconc"><b>What I found out</b>${b.conclude.map((c) => `<div class="wline">${esc(c)}</div>`).join("")}</div>` : ""}`;
    k = esc(b.ans || "");
    return { h, k };
  }
  if (b.type === "graph") {
    const n = b.x.length,
      mx = b.max || 10;
    h =
      H(b.title, b.inst || "Colour one square for each one you counted.") +
      `<div class="wgraph"><div class="wgy">${esc(b.y)}</div><table class="wgt">${Array.from({ length: mx }, (_, y) => `<tr><th>${mx - y}</th>${Array(n).fill("<td></td>").join("")}</tr>`).join("")}<tr><th></th>${b.x.map((x) => `<th class="wgx">${esc(x)}</th>`).join("")}</tr></table></div>${b.qs ? `<ol class="wqs">${b.qs.map((q) => `<li>${esc(q)}${lines(1)}</li>`).join("")}</ol>` : ""}`;
    return { h, k };
  }
  if (b.type === "tally") {
    h =
      H(b.title, b.inst) +
      `<table class="wtab"><tr><th>${esc(b.what || "Kind")}</th><th>Tally (|||| )</th><th>Total</th><th>One example I found</th></tr>${b.rows.map((x) => `<tr><td><b>${esc(x)}</b></td><td></td><td></td><td></td></tr>`).join("")}</table>`;
    return { h, k };
  }
  if (b.type === "logic") {
    h =
      H(b.title, b.inst || "Read each clue. Put ✓ for yes and ✗ for no. Every row and column has exactly one ✓.") +
      `${b.intro ? `<p class="wsm">${esc(b.intro)}</p>` : ""}<div class="wlogic"><table class="wlg"><tr><th></th>${b.cols.map((c) => `<th class="wlgc"><span>${esc(c)}</span></th>`).join("")}</tr>${b.rows.map((rw) => `<tr><th>${esc(rw)}</th>${b.cols.map(() => `<td></td>`).join("")}</tr>`).join("")}</table><ol class="wclues2">${b.clues.map((c) => `<li>${esc(c)}</li>`).join("")}</ol></div><div class="winst">Answer: ${b.rows.map((rw) => `${esc(rw)} → ______`).join(" · ")}</div>`;
    k =
      Object.entries(b.ans)
        .map(([a, v]) => `${esc(a)} → ${esc(v)}`)
        .join(" · ") + (b.why ? `<br>${esc(b.why)}` : "");
    return { h, k };
  }
  if (b.type === "spot") {
    h =
      H(b.title, `There are ${b.ans.length} mistakes. Underline each one, then write the correct idea.`) +
      `<div class="wspot">${b.text.map((t) => `<p>${esc(t)}</p>`).join("")}</div>${b.ans.map((_, j) => `<div class="wline">${j + 1}. It should say: </div>`).join("")}`;
    k = b.ans.map((a, j) => `${j + 1}. ${esc(a)}`).join("<br>");
    return { h, k };
  }
  if (b.type === "cutout") {
    h =
      H(b.title, b.inst) +
      `<div class="wcutout"><div>${artSvg(b.art, "wtmpl")}</div><div><ol>${b.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>${b.table ? `<table class="wtab">${`<tr>${b.table.cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr>`}${b.table.rows.map((rw) => `<tr>${b.table.cols.map((_, j) => `<td>${rw[j] != null ? esc(rw[j]) : ""}</td>`).join("")}</tr>`).join("")}</table>` : ""}${b.after ? `<div class="winst" style="margin-top:6px">${esc(b.after)}</div>${lines(3)}` : ""}</div></div>`;
    k = esc(b.ans || "");
    return { h, k };
  }
  if (b.type === "pics") {
    h =
      H(b.title, b.inst) +
      `<div class="wpics">${b.items.map((x, j) => `<div class="wpic2">${artSvg(x.art)}<b>${String.fromCharCode(65 + j)}. ${esc(x.t)}</b></div>`).join("")}</div>${b.sortTo ? `<table class="wtab"><tr>${b.sortTo.map((c) => `<th>${esc(c)}</th>`).join("")}</tr><tr>${b.sortTo.map(() => `<td style="height:46px"></td>`).join("")}</tr></table>` : ""}${b.qs ? `<ol class="wqs">${b.qs.map((q) => `<li>${esc(q.q || q)}${lines(q.lines || 1)}</li>`).join("")}</ol>` : ""}`;
    k = esc(b.ans || "");
    return { h, k };
  }
  if (b.type === "debate") {
    h =
      H(b.title, "Read both sides. Then decide what you think, and why.") +
      `<p class="wsm"><b>${esc(b.q)}</b></p><div class="wdeb">${b.sides.map((s) => `<div><b>${esc(s.who)}</b>${s.says.map((x) => `<p class="wsm">“${esc(x)}”</p>`).join("")}</div>`).join("")}</div><div class="wconc"><b>I think…</b>${lines(3)}<b>A question I'd ask both of them:</b>${lines(1)}</div>`;
    return { h, k };
  }
  if (b.type === "caseboard") {
    h =
      H(b.title || "Case board", "Copy every clue here. Then solve the case.") +
      `<div class="wcb">${Array.from({ length: b.clues }, (_, j) => `<div class="wcbc"><b>Clue ${j + 1}</b>${lines(2)}</div>`).join("")}</div><div class="wconc"><b>What is wrong (give ${b.causes} reasons):</b>${lines(b.causes + 1)}<b>My plan to fix it:</b>${lines(3)}</div>${b.track ? `<table class="wtab"><tr><th>Day</th><th>What I did</th><th>How the plant looks</th></tr>${b.track.map((d) => `<tr><td>${esc(d)}</td><td></td><td></td></tr>`).join("")}</table>` : ""}`;
    k = esc(b.ans || "");
    return { h, k };
  }
  if (b.type === "quiz") {
    h =
      H(b.title || "Final challenge", "No looking back! Then check with the book.") +
      `<ol class="wquiz">${b.qs.map((q) => `<li><b>${esc(q.q)}</b>${q.opts ? `<div class="wopts">${q.opts.map((o) => `<span class="wopt">○ ${esc(o)}</span>`).join("")}</div>` : lines(q.lines || 1)}</li>`).join("")}</ol><div class="wscore">My score: ____ / ${b.qs.length}</div>`;
    k = b.qs.map((q, j) => `${j + 1}. ${esc(q.opts ? q.opts[q.a] : q.a)}`).join("<br>");
    return { h, k };
  }
  if (b.type === "cert") {
    h = `<div class="wcert">${artSvg("medal", "wmedal")}<div class="wcerttop">This certifies that</div><div class="wcertname"></div><div class="wcerttop">is a</div><h2>${esc(b.badge)}</h2><p>${esc(b.text)}</p><div class="wcertsig"><span>Date</span><span>Signed (a grown-up)</span></div></div>`;
    return { h, k, bare: 1 };
  }
  return wsBlock(b, seed, i);
}
function bookPuzzleBlock(b, seed, i) {
  const H = (t, inst) =>
    `<div class="wbh"><span class="wbn">${i + 1}</span><div><b>${esc(b.title || t)}</b>${b.inst || inst ? `<div class="winst">${esc(b.inst || inst)}</div>` : ""}</div></div>`;
  if (b.type === "makes")
    return {
      h:
        H("Make and do", "Choose at least three. Tick the ones you finish.") +
        `<div class="wmakes">${b.items.map((x, j) => `<div class="wmake"><div class="wmakeh"><b>☐ ${String.fromCharCode(65 + j)}. ${esc(x.title)}</b><span>${esc(x.time || "")}</span></div><div class="winst">You need: ${esc(x.need.join(", "))}</div><ol>${x.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>${x.ask ? `<div class="wmakeq"><b>Think:</b> ${esc(x.ask)}<div class="wline"></div></div>` : ""}</div>`).join("")}</div>`,
      k: b.items.map((x, j) => `${String.fromCharCode(65 + j)}. ${esc(x.title)}: ${esc(x.why)}`).join("<br>"),
    };
  if (b.type === "sudoku") {
    const n = b.grid.length;
    return {
      h:
        H("Picture sudoku", `Every row, every column and every 2×2 box must have each of the ${n} pictures once.`) +
        `<div class="wsudo"><table>${b.grid.map((rw, y) => `<tr>${rw.map((c, x) => `<td class="${y % 2 === 1 && y < n - 1 ? "bb" : ""} ${x % 2 === 1 && x < n - 1 ? "br" : ""}">${c ? esc(c) : ""}</td>`).join("")}</tr>`).join("")}</table><div class="winst">The pictures: ${esc(b.symbols.join("  "))}</div></div>`,
      k: b.ans.map((r) => r.join(" ")).join("<br>"),
    };
  }
  if (b.type === "oddone")
    return {
      h:
        H(
          "Odd one out",
          "Circle the odd one out and say why. There can be more than one right answer, if you can explain it!",
        ) +
        `<ol class="wodd">${b.sets.map((s) => `<li><div class="woddrow">${s.map((x) => `<span>${esc(x)}</span>`).join("")}</div><div class="wline">Odd one: ____________ because </div></li>`).join("")}</ol>`,
      k: b.ans.map((a, j) => `${j + 1}. ${esc(a)}`).join("<br>"),
    };
  if (b.type === "riddles")
    return {
      h:
        H("Riddles", "Read each riddle. Write your answer.") +
        `<ol class="wqs">${b.items.map((x) => `<li><i>${esc(x.q)}</i><div class="wline"></div></li>`).join("")}</ol>`,
      k: b.items.map((x, j) => `${j + 1}. ${esc(x.a)}`).join("<br>"),
    };
  return bookBasicBlock(b, seed, i);
}
function bookBlock(b, seed, i) {
  if (b.type === "story")
    return {
      h: `<div class="wstory"><div class="wstoryhd">A story to read aloud</div><h2>${esc(b.title)}</h2>${b.text.map((p, j) => `<p${j ? "" : ' class="first"'}>${esc(p)}</p>`).join("")}<div class="wstoryask"><b>Talk about it</b><ol>${b.ask.map((q) => `<li>${esc(q)}</li>`).join("")}</ol></div></div>`,
      k: "",
      bare: 1,
    };
  return bookPuzzleBlock(b, seed, i);
}
/* a book: cover with the mission and station checklist, one page per station, certificate, then the grown-up's pages */
function wsBook(ws, u) {
  const base = wsPage({ id: ws.id, title: ws.title, blocks: [] }, u),
    css = (base.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || "";
  let n = 0;
  const keys = [];
  const pages = ws.pages
    .map((pg, pi) => {
      const parts = pg.blocks
        .map((b) => {
          const isNum = !["read", "case", "clue", "cert"].includes(b.type),
            r = bookBlock(b, ws.id + "|" + pi, isNum ? n : 0);
          if (isNum) n++;
          if (r.k)
            keys.push(
              `<div class="wk"><b>${esc(pg.title)}${b.title ? " · " + esc(b.title) : ""}</b><div>${r.k}</div></div>`,
            );
          return r.bare ? r.h : `<div class="wb">${r.h}</div>`;
        })
        .join("");
      return `<div class="wpg wbp${pg.newpage || !pg.station ? " wnew" : ""}">${pg.station ? `<div class="wst"><span class="wstn">${esc(pg.station)}</span><b>${esc(pg.title)}</b><span class="wstt">${pg.mins ? `≈ ${pg.mins} min` : ""} ☐ done</span></div>` : `<h2 class="wpt">${esc(pg.title)}</h2>`}${parts}</div>`;
    })
    .join("");
  const st = ws.pages.filter((p) => p.station);
  const cover = `<div class="wpg wcover"><div class="whd">${sblob(u.subj, "happy", "", 'width="64" height="64"')}<div style="flex:1"><div class="wtag">DeepKids Mission Book · ${esc(ws.topicTitle || "")} · ${esc(PLN?.[ws.lvl] || "")}</div><h1>${esc(ws.title)}</h1><div class="wtag">${esc(ws.blurb || "")}</div></div></div>
   <div class="wname"><span>Detective's name:</span><span>Started on:</span></div>
   ${ws.cover.map((b) => bookBlock(b, ws.id + "|c", 0).h).join("")}
   <div class="wmap"><b>Your stations</b> <span class="winst">One a day is plenty. Tick each one when it's done.</span>${st.map((p) => `<div class="wmapr"><span class="wstn">${esc(p.station)}</span><span>${esc(p.title)}</span><span class="wstt">≈ ${p.mins || 30} min ☐</span></div>`).join("")}</div>
   ${ws.need ? `<div class="wneed"><b>You'll need</b> <span class="winst">(ask a grown-up)</span><div>${ws.need.map((x) => `<span>☐ ${esc(x)}</span>`).join("")}</div></div>` : ""}<div class="winst" style="text-align:right">About ${esc(ws.hours || "3–4 hours")} in all</div></div>`;
  const guide = `<div class="wpg wkey"><div class="whd"><div style="flex:1"><div class="wtag">For the grown-up</div><h1>Guide and answers</h1></div></div>${ws.guide ? ws.guide.map((p) => `<p class="wsm">${esc(p)}</p>`).join("") : ""}${keys.join("")}</div>`;
  const css2 = `.wbp{margin-top:14px}.wbp.wnew{break-before:page;margin-top:0}.wst{break-after:avoid}.wread,.wcase,.wfacts,.wclue,.wcert,.wmap{break-inside:avoid}.wst{display:flex;gap:10px;align-items:center;background:#2B2340;color:#fff;border-radius:14px;padding:8px 12px;margin-bottom:10px}.wst b{font-size:20px;flex:1}.wstn{background:var(--sun);color:#2B2340;border-radius:10px;padding:2px 8px;font-weight:700;font-size:13px;white-space:nowrap}.wstt{font-size:12px;white-space:nowrap}.wpt{margin:0 0 8px}
   .wread{border:2.5px solid #2B2340;border-radius:16px;padding:10px 14px;margin:8px 0;overflow:hidden}.wread h3{margin:0 0 6px;font-size:19px}.wread p{margin:6px 0;font-size:14.5px;line-height:1.5}.wreadart{float:right;width:44%;margin:0 0 6px 12px;text-align:center}.wreadart svg{width:100%;max-height:230px}.wcap{font-size:12px;color:#5d5670}
   .wfacts{background:#fff6d9;border-radius:14px;padding:8px 12px;margin:8px 0;font-size:13.5px}.wfacts div{margin:3px 0}
   .wcase{border:3px double #2B2340;border-radius:16px;padding:10px 14px;margin:8px 0;background:#fdfaf3;overflow:hidden}.wcasehd{font-weight:700;font-size:18px;margin-bottom:4px}.wcase p{margin:5px 0;font-size:14.5px}.wcaseart{float:right;width:38%;margin-left:10px}.wcaseart svg{width:100%}.wtask{background:#fff;border:2px dashed #2B2340;border-radius:10px;padding:6px 10px}
   .wclue{border:2.5px dashed #2B2340;border-radius:14px;padding:8px 12px;margin:8px 0;background:#f1f8ee;font-size:14.5px}
   .wartrow{text-align:center}.wartrow svg{width:80%;max-height:230px}.wqs li{margin:6px 0;font-size:14px}.wsm{font-size:14px;margin:4px 0}
   .winv{font-size:14px}.winv ol{margin:4px 0 6px 18px;padding:0}.winv li{margin:2px 0}.winvart{float:right;width:120px;margin-left:10px}.winvart svg{width:100%}.wpredict{border:2px solid #e6dfd2;border-radius:12px;padding:4px 10px;margin:6px 0;clear:both}
   .wobs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:8px 0;text-align:center;font-size:12.5px}.wobsbox{border:2px solid #2B2340;border-radius:10px;height:110px;margin-bottom:3px}.wconc{margin-top:6px;font-size:14px}
   .wgraph{display:flex;gap:6px;align-items:center}.wgy{writing-mode:vertical-rl;transform:rotate(180deg);font-size:12px}.wgt{border-collapse:collapse}.wgt td{width:52px;height:20px;border:1px solid #bbb}.wgt th{font-size:11px;font-weight:400;padding:0 4px}.wgt .wgx{font-size:11.5px;font-weight:700;text-align:center;padding-top:4px}
   .wlogic{display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap}.wlg{border-collapse:collapse}.wlg td{width:40px;height:40px;border:2px solid #2B2340}.wlg th{font-size:13px;padding:4px 6px;text-align:right}.wlgc{height:96px;vertical-align:bottom}.wlgc span{writing-mode:vertical-rl;transform:rotate(180deg);display:inline-block}.wclues2{flex:1;min-width:220px;font-size:14px;margin:0;padding-left:18px}.wclues2 li{margin:5px 0}
   .wspot{background:#fdfaf3;border:2px solid #e6dfd2;border-radius:12px;padding:6px 12px;font-family:"Comic Sans MS","Chalkboard SE",cursive;font-size:14.5px}.wspot p{margin:5px 0}
   .wcutout{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:start}.wcutout ol{font-size:14px;margin:0;padding-left:18px}.wtmpl{display:block}
   .wpics{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;font-size:13px}.wpic2{border:2px solid #e6dfd2;border-radius:12px;padding:4px}.wpic2 svg{width:100%;height:86px}
   .wdeb{display:grid;grid-template-columns:1fr 1fr;gap:10px}.wdeb>div{border:2px solid #e6dfd2;border-radius:12px;padding:6px 10px}
   .wcb{display:grid;grid-template-columns:1fr 1fr;gap:6px 12px}.wcbc{border:2px dashed #bbb;border-radius:10px;padding:4px 8px;font-size:13px}
   .wquiz{font-size:14px;padding-left:20px}.wquiz li{margin:7px 0}.wscore{text-align:right;font-weight:700;font-size:16px}
   .wstory{font-family:Georgia,"Times New Roman",serif;font-size:15.5px;line-height:1.65;column-count:2;column-gap:22px}.wstory h2{column-span:all;font-size:28px;margin:2px 0 10px;font-family:inherit}.wstoryhd{column-span:all;font:700 12px/1 "Trebuchet MS",sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6b6380}.wstory p{margin:0 0 9px;text-indent:1.2em}.wstory p.first{text-indent:0}.wstory p.first::first-letter{float:left;font-size:52px;line-height:.9;padding:4px 6px 0 0;font-weight:700}.wstoryask{column-span:all;break-inside:avoid;border-top:2px solid #2B2340;margin-top:8px;padding-top:6px;font:14px/1.5 "Trebuchet MS",sans-serif}.wmakes{display:grid;grid-template-columns:1fr 1fr;gap:8px}.wmake{border:2px solid #e6dfd2;border-radius:12px;padding:6px 10px;font-size:13px;break-inside:avoid}.wmakeh{display:flex;justify-content:space-between;gap:6px}.wmakeh b{font-size:14.5px}.wmakeh span{font-size:11.5px;color:#6b6380;white-space:nowrap}.wmake ol{margin:4px 0;padding-left:16px}.wmakeq{font-size:12.5px}
   .wsudo{display:flex;gap:16px;align-items:center}.wsudo table{border-collapse:collapse;border:3px solid #2B2340}.wsudo td{width:54px;height:54px;border:1px solid #999;text-align:center;font-size:30px}.wsudo td.bb{border-bottom:3px solid #2B2340}.wsudo td.br{border-right:3px solid #2B2340}
   .wodd li{margin:6px 0}.woddrow{display:flex;gap:10px;flex-wrap:wrap}.woddrow span{border:1.5px dashed #999;border-radius:10px;padding:3px 10px;font-size:14px}.wcert{border:6px double #2B2340;border-radius:20px;padding:24px;text-align:center;margin-top:10px}.wmedal{width:150px;height:165px}.wcerttop{font-size:15px;margin:6px 0}.wcertname{border-bottom:2px solid #2B2340;width:70%;height:38px;margin:0 auto 6px}.wcert h2{font-size:30px;margin:6px 0}.wcertsig{display:flex;justify-content:space-around;margin-top:46px;font-size:13px}.wcertsig span{border-top:1.5px solid #2B2340;padding-top:4px;width:35%}
   .wmap{border:2.5px solid #2B2340;border-radius:16px;padding:8px 12px;margin:10px 0}.wmapr{display:flex;gap:10px;align-items:center;padding:5px 0;border-bottom:1px dashed #ccc;font-size:14.5px}.wmapr span:nth-child(2){flex:1}
   .wneed{background:#f4eee4;border-radius:14px;padding:8px 12px;font-size:13.5px}.wneed div{display:grid;grid-template-columns:1fr 1fr;gap:2px 12px;margin-top:4px}
   @media screen{.wpg.wnew{margin-top:16px}}`;
  const st2 = `<style>${css}${css2}</style>`,
    bd = `<body>${cover}${pages}${guide}</body>`;
  return base.replace(/<style>[\s\S]*?<\/style>/, () => st2).replace(/<body>[\s\S]*<\/body>/, () => bd);
}
const TWN = () => DATA.wtopics || {};
function topicsOf(u) {
  const T = [];
  Object.entries(TWN()).forEach(([id, t]) => {
    if ((t.chapters || []).includes(u.k)) T.push(id);
  });
  (DATA.rconcepts || []).forEach((c) => {
    if (c.chapters.includes(u.k) && TWN()[c.id] && !T.includes(c.id)) T.push(c.id);
  });
  if (u.board === "combined" && TWN()[u.n] && !T.includes(u.n)) T.push(u.n);
  return T;
}
function wsRank(u) {
  const p = profOf(u.subj),
    L = wsOf(u),
    di = PLV.indexOf(p.lvl),
    pref = {
      explore: ["play", "make", "game", "think"],
      deep: ["make", "play", "think", "game"],
      challenge: ["think", "make", "game", "play"],
    }[p.depth];
  return L.map((w, i) => ({
    w,
    i,
    score: Math.abs(PLV.indexOf(w.lvl || "core") - di) * 10 + pref.indexOf(w.kind),
  })).sort((a, b) => a.score - b.score || a.i - b.i);
}
const wsCur = (u) => (DATA.cws || {})[u.k] || [];
const wsRng = (s) => {
  let x = (hsh(String(s)) % 2147483646) + 1;
  return () => (x = (x * 16807) % 2147483647) / 2147483647;
};
const wsShuf = (a, r) => {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
const wIc = (x) => (x.ic ? `<span class="wic">${x.ic}</span>` : "");
/* simple line drawings for label-the-picture */
const WDIAG = {
  plant: {
    w: 300,
    h: 300,
    svg: `<path d="M150 290 V120" stroke="#3b7a3b" stroke-width="6" fill="none"/><path d="M150 200 q-55 -10 -70 -45 q45 0 70 35" fill="#8bc58b" stroke="#3b7a3b" stroke-width="3"/><path d="M150 170 q55 -10 70 -45 q-45 0 -70 35" fill="#8bc58b" stroke="#3b7a3b" stroke-width="3"/><g transform="translate(150 95)">${[0, 72, 144, 216, 288].map((a) => `<ellipse rx="14" ry="26" transform="rotate(${a}) translate(0 -24)" fill="#f7a8c4" stroke="#c0567f" stroke-width="2"/>`).join("")}<circle r="12" fill="#f5c542" stroke="#b8901c" stroke-width="2"/></g><path d="M150 290 q-30 10 -50 5 M150 290 q-10 25 -30 30 M150 290 q15 25 35 28 M150 290 q30 8 52 2" stroke="#8a6a3a" stroke-width="3" fill="none"/><path d="M40 290 H260" stroke="#8a6a3a" stroke-width="2" stroke-dasharray="6 5"/>`,
    pts: [
      [150, 95],
      [205, 135],
      [150, 240],
      [120, 310],
    ],
  },
  tree: {
    w: 300,
    h: 300,
    svg: `<rect x="135" y="170" width="30" height="110" fill="#9a6b3c" stroke="#6b4422" stroke-width="3"/><circle cx="150" cy="120" r="80" fill="#7cc27c" stroke="#3b7a3b" stroke-width="3"/><circle cx="120" cy="110" r="9" fill="#e0533d"/><circle cx="185" cy="135" r="9" fill="#e0533d"/><path d="M135 280 q-25 15 -50 12 M165 280 q25 15 50 12" stroke="#6b4422" stroke-width="3" fill="none"/>`,
    pts: [
      [150, 60],
      [150, 230],
      [185, 135],
      [100, 292],
    ],
  },
  house: {
    w: 300,
    h: 280,
    svg: `<path d="M40 130 L150 40 L260 130 Z" fill="#e88b5a" stroke="#9c4a22" stroke-width="3"/><rect x="60" y="130" width="180" height="130" fill="#f4e2c4" stroke="#9c6a3a" stroke-width="3"/><rect x="130" y="185" width="40" height="75" fill="#a0683a" stroke="#6b4422" stroke-width="3"/><rect x="80" y="155" width="35" height="35" fill="#bfe3f5" stroke="#4a7c95" stroke-width="3"/><rect x="185" y="155" width="35" height="35" fill="#bfe3f5" stroke="#4a7c95" stroke-width="3"/><rect x="200" y="55" width="22" height="45" fill="#c9705a" stroke="#7a3a22" stroke-width="3"/>`,
    pts: [
      [150, 75],
      [100, 240],
      [150, 220],
      [200, 172],
      [211, 60],
    ],
  },
  body: {
    w: 260,
    h: 320,
    svg: `<circle cx="130" cy="50" r="32" fill="#f3c9a0" stroke="#9c6a3a" stroke-width="3"/><rect x="95" y="85" width="70" height="105" rx="20" fill="#7fb3e0" stroke="#3a6a95" stroke-width="3"/><path d="M95 100 L50 170 M165 100 L210 170" stroke="#f3c9a0" stroke-width="16" stroke-linecap="round"/><path d="M110 188 L100 290 M150 188 L160 290" stroke="#5a5a8a" stroke-width="18" stroke-linecap="round"/><circle cx="48" cy="176" r="10" fill="#f3c9a0"/><circle cx="212" cy="176" r="10" fill="#f3c9a0"/><ellipse cx="95" cy="298" rx="18" ry="8" fill="#6b4422"/><ellipse cx="165" cy="298" rx="18" ry="8" fill="#6b4422"/>`,
    pts: [
      [130, 50],
      [130, 135],
      [48, 176],
      [200, 140],
      [105, 250],
      [165, 298],
    ],
  },
  bird: {
    w: 300,
    h: 220,
    svg: `<ellipse cx="150" cy="120" rx="80" ry="50" fill="#f5c542" stroke="#b8901c" stroke-width="3"/><circle cx="225" cy="80" r="30" fill="#f5c542" stroke="#b8901c" stroke-width="3"/><circle cx="233" cy="74" r="5"/><path d="M253 80 L285 88 L253 95 Z" fill="#e8873a"/><path d="M120 110 q30 -50 80 -10 q-40 20 -80 10" fill="#e8b830" stroke="#b8901c" stroke-width="3"/><path d="M72 115 L25 95 L35 125 L25 150 Z" fill="#e8b830" stroke="#b8901c" stroke-width="3"/><path d="M140 168 v30 M165 168 v30" stroke="#e8873a" stroke-width="4"/>`,
    pts: [
      [245, 82],
      [270, 88],
      [160, 95],
      [40, 120],
      [150, 190],
    ],
  },
  fish: {
    w: 300,
    h: 180,
    svg: `<ellipse cx="140" cy="90" rx="95" ry="50" fill="#7fc7e0" stroke="#2f7a95" stroke-width="3"/><path d="M230 90 L285 45 L285 135 Z" fill="#5fb0d0" stroke="#2f7a95" stroke-width="3"/><circle cx="85" cy="78" r="7"/><path d="M120 45 q30 -35 60 -2" fill="#5fb0d0" stroke="#2f7a95" stroke-width="3"/><path d="M130 100 q20 25 45 5" fill="#5fb0d0" stroke="#2f7a95" stroke-width="3"/><path d="M105 60 q-12 30 0 60" stroke="#2f7a95" stroke-width="3" fill="none"/>`,
    pts: [
      [85, 78],
      [265, 90],
      [150, 30],
      [155, 115],
      [105, 90],
    ],
  },
  insect: {
    w: 300,
    h: 240,
    svg: `<circle cx="80" cy="120" r="30" fill="#5a5a5a"/><ellipse cx="150" cy="120" rx="35" ry="28" fill="#7a7a7a"/><ellipse cx="230" cy="120" rx="50" ry="35" fill="#5a5a5a"/><path d="M60 95 q-20 -40 -40 -45 M75 92 q-5 -45 -20 -55" stroke="#333" stroke-width="3" fill="none"/><path d="M130 140 l-20 50 M150 145 l0 55 M170 140 l20 50 M130 100 l-20 -50 M150 95 l0 -55 M170 100 l20 -50" stroke="#333" stroke-width="3"/><ellipse cx="150" cy="70" rx="45" ry="22" fill="#cfe8ff" stroke="#6a9ac0" stroke-width="2" opacity=".85"/>`,
    pts: [
      [80, 120],
      [150, 120],
      [230, 120],
      [40, 52],
      [150, 200],
      [150, 68],
    ],
  },
  water: {
    w: 320,
    h: 260,
    svg: `<circle cx="270" cy="45" r="25" fill="#f5c542"/><path d="M60 70 q20 -30 50 -15 q25 -25 50 0 q25 0 20 25 H55 q-15 0 5 -10" fill="#e6eef5" stroke="#7a95aa" stroke-width="3"/><path d="M80 95 l-6 18 M110 95 l-6 18 M140 95 l-6 18" stroke="#3a8ac0" stroke-width="3"/><path d="M0 210 q80 -20 160 0 t160 0 V260 H0 Z" fill="#7fc7e0"/><path d="M200 200 q-5 -40 15 -70 M240 200 q0 -40 10 -70" stroke="#9ab" stroke-width="3" stroke-dasharray="5 6" fill="none"/><path d="M215 125 l-8 10 h16 Z M250 125 l-8 10 h16 Z" fill="#9ab"/>`,
    pts: [
      [270, 45],
      [110, 70],
      [110, 110],
      [80, 235],
      [230, 160],
    ],
  },
  compass: {
    w: 260,
    h: 260,
    svg: `<circle cx="130" cy="130" r="110" fill="#fffaf0" stroke="#9c6a3a" stroke-width="3"/><path d="M130 30 L145 130 L130 230 L115 130 Z" fill="#e0533d"/><path d="M30 130 L130 115 L230 130 L130 145 Z" fill="#7a95aa"/><circle cx="130" cy="130" r="8" fill="#333"/>`,
    pts: [
      [130, 14],
      [130, 246],
      [246, 130],
      [14, 130],
    ],
  },
  flower: {
    w: 300,
    h: 300,
    svg: `<g transform="translate(150 140)">${[0, 60, 120, 180, 240, 300].map((a) => `<ellipse rx="26" ry="55" transform="rotate(${a}) translate(0 -55)" fill="#f7a8c4" stroke="#c0567f" stroke-width="2"/>`).join("")}<circle r="28" fill="#f5c542" stroke="#b8901c" stroke-width="3"/>${[0, 90, 180, 270].map((a) => `<path d="M0 0 L0 -40" transform="rotate(${a + 45})" stroke="#8a5a00" stroke-width="3"/>`).join("")}</g><path d="M150 198 V295" stroke="#3b7a3b" stroke-width="6"/><path d="M150 250 q-45 -5 -60 -35 q40 0 60 30" fill="#8bc58b" stroke="#3b7a3b" stroke-width="3"/>`,
    pts: [
      [150, 40],
      [150, 140],
      [118, 113],
      [150, 280],
      [95, 225],
    ],
  },
};
const WDOTS = {
  star: [
    [150, 20],
    [180, 110],
    [280, 110],
    [200, 165],
    [230, 260],
    [150, 200],
    [70, 260],
    [100, 165],
    [20, 110],
    [120, 110],
  ],
  fish: [
    [30, 150],
    [80, 95],
    [160, 80],
    [230, 110],
    [290, 60],
    [280, 150],
    [290, 240],
    [230, 190],
    [160, 220],
    [80, 205],
  ],
  house: [
    [40, 150],
    [150, 40],
    [260, 150],
    [230, 150],
    [230, 280],
    [70, 280],
    [70, 150],
  ],
  kite: [
    [150, 20],
    [250, 130],
    [150, 280],
    [50, 130],
  ],
  leaf: [
    [150, 280],
    [90, 230],
    [60, 160],
    [80, 90],
    [150, 20],
    [220, 90],
    [240, 160],
    [210, 230],
  ],
  boat: [
    [30, 180],
    [270, 180],
    [230, 250],
    [70, 250],
    [30, 180],
    [150, 180],
    [150, 30],
    [240, 160],
    [150, 160],
  ],
  pot: [
    [100, 40],
    [200, 40],
    [190, 70],
    [250, 140],
    [240, 220],
    [190, 270],
    [110, 270],
    [60, 220],
    [50, 140],
    [110, 70],
  ],
  mango: [
    [150, 30],
    [210, 60],
    [250, 130],
    [240, 210],
    [190, 265],
    [120, 270],
    [70, 220],
    [60, 150],
    [90, 80],
  ],
};
function wsBasicBlock(b, seed, i) {
  const r = wsRng(seed + "|" + i),
    H = (t, inst) =>
      `<div class="wbh"><span class="wbn">${i + 1}</span><div><b>${esc(b.title || t)}</b>${b.inst || inst ? `<div class="winst">${esc(b.inst || inst)}</div>` : ""}</div></div>`;
  let h = "",
    k = "";
  if (b.type === "match") {
    const R = wsShuf(
      b.pairs.map((p, j) => ({ ...p[1], j })),
      r,
    );
    h =
      H("Match them", "Draw a line from each one on the left to its partner on the right.") +
      `<table class="wmatch">${b.pairs.map((p, j) => `<tr><td class="wl"><div class="wcell"><span>${wIc(p[0])}${esc(p[0].t || "")}</span><span class="wdot"></span></div></td><td class="wgap"></td><td class="wr"><div class="wcell"><span class="wdot"></span><span>${wIc(R[j])}${esc(R[j].t || "")}</span></div></td></tr>`).join("")}</table>`;
    k = b.pairs.map((p) => `${esc(p[0].t || p[0].ic)} → ${esc(p[1].t || p[1].ic)}`).join("<br>");
  } else if (b.type === "circle") {
    h =
      H("Circle the right one", "Circle the right picture or word in each row.") +
      b.rows
        .map(
          (q) =>
            `<div class="wcirc"><div class="wq">${esc(q.q)}</div><div class="wopts">${q.opts.map((o) => `<span class="wopt">${wIc(o)}${esc(o.t || "")}</span>`).join("")}</div></div>`,
        )
        .join("");
    k = b.rows.map((q) => `${esc(q.q)} <b>${esc(q.opts[q.ans].t || q.opts[q.ans].ic)}</b>`).join("<br>");
  } else if (b.type === "fill") {
    const bank = wsShuf(
      b.items.map((x) => x.a),
      r,
    );
    h =
      H("Fill in the gaps", "Use the words in the box.") +
      `<div class="wbank">${bank.map((w) => `<span>${esc(w)}</span>`).join("")}</div><ol class="wfill">${b.items.map((x) => `<li>${wIc(x)}${esc(x.t).replace("____", '<span class="wblank"></span>')}</li>`).join("")}</ol>`;
    k = b.items.map((x, j) => `${j + 1}. ${esc(x.a)}`).join("<br>");
  } else if (b.type === "sort") {
    const items = wsShuf(b.items, r);
    h =
      H("Cut and sort", "Cut out the cards at the bottom along the dotted lines. Stick each one in the right box.") +
      `<div class="wbaskets">${b.cats.map((c) => `<div class="wbasket"><b>${esc(c)}</b></div>`).join("")}</div><div class="wcut"><span class="wsc">✂</span>${items.map((x) => `<span class="wcard">${wIc(x)}${esc(x.t || "")}</span>`).join("")}</div>`;
    k = b.cats
      .map(
        (c, j) =>
          `<b>${esc(c)}:</b> ${b.items
            .filter((x) => x.c === j)
            .map((x) => esc(x.t || x.ic))
            .join(", ")}`,
      )
      .join("<br>");
  } else if (b.type === "label") {
    const D = WDIAG[b.pic] || WDIAG.plant,
      P = D.pts.slice(0, b.labels.length),
      pad = 40;
    h =
      H("Label the picture", "Write the right word from the box next to each number.") +
      `<div class="wlab"><svg viewBox="${-pad} ${-pad} ${D.w + pad * 2} ${D.h + pad * 2}" class="wdiag">${D.svg}${P.map((p, j) => `<circle cx="${p[0]}" cy="${p[1]}" r="13" fill="#fff" stroke="#2B2340" stroke-width="2.5"/><text x="${p[0]}" y="${p[1] + 5}" text-anchor="middle" font-size="15" font-weight="700">${j + 1}</text>`).join("")}</svg><div><div class="wbank">${wsShuf(
        b.labels,
        r,
      )
        .map((w) => `<span>${esc(w)}</span>`)
        .join("")}</div>${b.labels.map((_, j) => `<div class="wline">${j + 1}. </div>`).join("")}</div></div>`;
    k = b.labels.map((l, j) => `${j + 1}. ${esc(l)}`).join("<br>");
  } else if (b.type === "maze") {
    const W = b.w || 11,
      Hh = b.h || 9,
      cell = 28,
      vis = Array.from({ length: Hh }, () => Array(W).fill(false)),
      wl = [];
    for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) wl.push([x, y, 1, 1]);
    const walls = new Set();
    for (let y = 0; y < Hh; y++)
      for (let x = 0; x < W; x++) {
        walls.add(`${x},${y},r`);
        walls.add(`${x},${y},b`);
      }
    const st = [[0, 0]];
    vis[0][0] = true;
    const prev = {};
    while (st.length) {
      const [x, y] = st[st.length - 1],
        nb = wsShuf(
          [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ],
          r,
        )
          .map(([dx, dy]) => [x + dx, y + dy])
          .filter(([a, c]) => a >= 0 && c >= 0 && a < W && c < Hh && !vis[c][a]);
      if (!nb.length) {
        st.pop();
        continue;
      }
      const [a, c] = nb[0];
      if (a > x) walls.delete(`${x},${y},r`);
      if (a < x) walls.delete(`${a},${c},r`);
      if (c > y) walls.delete(`${x},${y},b`);
      if (c < y) walls.delete(`${a},${c},b`);
      vis[c][a] = true;
      prev[`${a},${c}`] = [x, y];
      st.push([a, c]);
    }
    let path = [[W - 1, Hh - 1]];
    while (path[path.length - 1].join() !== "0,0") path.push(prev[path[path.length - 1].join()]);
    const L = [];
    walls.forEach((w) => {
      const [x, y, s] = w.split(",");
      const X = +x * cell,
        Y = +y * cell;
      if (s === "r" && !(+x === W - 1 && +y === Hh - 1)) L.push(`M${X + cell} ${Y}v${cell}`);
      if (s === "b") L.push(`M${X} ${Y + cell}h${cell}`);
    });
    const svg = (sol) =>
      `<svg viewBox="-34 -6 ${W * cell + 68} ${Hh * cell + 12}" class="wmaze"><path d="M0 ${cell}V0H${W * cell} M0 ${cell * 2}V${Hh * cell}" stroke="#2B2340" stroke-width="3" fill="none"/><path d="${L.join("")}" stroke="#2B2340" stroke-width="3" stroke-linecap="round" fill="none"/>${sol ? `<path d="M${path.map(([x, y]) => `${x * cell + cell / 2} ${y * cell + cell / 2}`).join(" L")}" stroke="#e0533d" stroke-width="4" fill="none" opacity=".8"/>` : ""}<text x="-17" y="${cell * 1.5 + 8}" text-anchor="middle" font-size="24">${b.from || "🙂"}</text><text x="${W * cell + 17}" y="${Hh * cell - cell / 2 + 8}" text-anchor="middle" font-size="24">${b.to || "⭐"}</text></svg>`;
    h =
      H(
        "Find the way",
        b.inst || "Help them find the way. Draw a line from the start to the end without crossing a wall.",
      ) + svg(false);
    k = svg(true);
  } else if (b.type === "wordsearch") {
    const words = b.words.map((w) => w.toUpperCase().replace(/[^A-Z]/g, "")),
      N = Math.max(b.size || 10, ...words.map((w) => w.length + 1)),
      G = Array.from({ length: N }, () => Array(N).fill("")),
      dirs = b.diag
        ? [
            [1, 0],
            [0, 1],
            [1, 1],
          ]
        : [
            [1, 0],
            [0, 1],
          ],
      put = [];
    words.forEach((w) => {
      for (let t = 0; t < 200; t++) {
        const [dx, dy] = dirs[Math.floor(r() * dirs.length)],
          x = Math.floor(r() * (N - (dx ? w.length : 0) + (dx ? 0 : 0))),
          y = Math.floor(r() * (N - (dy ? w.length : 0)));
        if (x < 0 || y < 0) continue;
        let ok = true;
        for (let j = 0; j < w.length; j++) {
          const c = G[y + dy * j]?.[x + dx * j];
          if (c === undefined || (c && c !== w[j])) {
            ok = false;
            break;
          }
        }
        if (!ok) continue;
        for (let j = 0; j < w.length; j++) G[y + dy * j][x + dx * j] = w[j];
        put.push({ w, x, y, dx, dy });
        break;
      }
    });
    const AB = "ABCDEFGHIJKLMNOPRSTUVWY",
      fillG = G.map((row) => row.map((c) => c || AB[Math.floor(r() * AB.length)])),
      on = new Set();
    put.forEach((p) => {
      for (let j = 0; j < p.w.length; j++) on.add(`${p.x + p.dx * j},${p.y + p.dy * j}`);
    });
    const grid = (key) =>
      `<table class="wgrid">${fillG.map((row, y) => `<tr>${row.map((c, x) => `<td${key && on.has(`${x},${y}`) ? ' class="won"' : ""}>${c}</td>`).join("")}</tr>`).join("")}</table>`;
    h =
      H(
        "Word search",
        `Find these ${put.length} words. They go ${b.diag ? "across, down or slanting" : "across or down"}.`,
      ) +
      `<div class="wws">${grid(false)}<div class="wbank wcol">${put.map((p) => `<span>☐ ${p.w}</span>`).join("")}</div></div>`;
    k = grid(true);
  } else if (b.type === "crossword") {
    const E = b.clues
        .map(([a, c]) => ({ a: a.toUpperCase().replace(/[^A-Z]/g, ""), c }))
        .sort((x, y) => y.a.length - x.a.length),
      M = new Map(),
      pl = [],
      at = (x, y) => M.get(x + "," + y);
    const fits = (w, x, y, d) => {
      let cross = 0;
      for (let j = 0; j < w.length; j++) {
        const X = x + (d ? 0 : j),
          Y = y + (d ? j : 0),
          c = at(X, Y);
        if (c && c !== w[j]) return -1;
        if (c) cross++;
        else {
          const n1 = d ? at(X - 1, Y) : at(X, Y - 1),
            n2 = d ? at(X + 1, Y) : at(X, Y + 1);
          if (n1 || n2) return -1;
        }
      }
      const bx = d ? at(x, y - 1) : at(x - 1, y),
        ax = d ? at(x, y + w.length) : at(x + w.length, y);
      if (bx || ax) return -1;
      return cross;
    };
    const place = (w, x, y, d, clue) => {
      for (let j = 0; j < w.length; j++) M.set(x + (d ? 0 : j) + "," + (y + (d ? j : 0)), w[j]);
      pl.push({ w, x, y, d, clue });
    };
    E.forEach((e, ei) => {
      if (!ei) {
        place(e.a, 0, 0, 0, e.c);
        return;
      }
      let best = null;
      pl.forEach((p) => {
        for (let i2 = 0; i2 < p.w.length; i2++)
          for (let j = 0; j < e.a.length; j++) {
            if (p.w[i2] !== e.a[j]) continue;
            const d = p.d ? 0 : 1,
              x = p.d ? p.x - j : p.x + i2,
              y = p.d ? p.y + i2 : p.y - j,
              f = fits(e.a, x, y, d);
            if (f > 0 && (!best || f > best.f)) best = { x, y, d, f };
          }
      });
      if (best) place(e.a, best.x, best.y, best.d, e.c);
      else {
        const ys2 = [...M.keys()].map((q) => +q.split(",")[1]),
          xs2 = [...M.keys()].map((q) => +q.split(",")[0]);
        place(e.a, Math.min(...xs2), Math.max(...ys2) + 2, 0, e.c);
      }
    });
    const xs = [...M.keys()].map((s) => +s.split(",")[0]),
      ys = [...M.keys()].map((s) => +s.split(",")[1]),
      x0 = Math.min(...xs),
      y0 = Math.min(...ys),
      X1 = Math.max(...xs),
      Y1 = Math.max(...ys),
      num = {};
    let n = 1;
    pl.slice()
      .sort((a, b2) => a.y - b2.y || a.x - b2.x)
      .forEach((p) => {
        const key = p.x + "," + p.y;
        if (!num[key]) num[key] = n++;
        p.n = num[key];
      });
    const grid = (key) =>
      `<table class="wcw">${Array.from(
        { length: Y1 - y0 + 1 },
        (_, yy) =>
          `<tr>${Array.from({ length: X1 - x0 + 1 }, (_, xx) => {
            const X = xx + x0,
              Y = yy + y0,
              c = at(X, Y);
            return c
              ? `<td class="on">${num[X + "," + Y] ? `<sup>${num[X + "," + Y]}</sup>` : ""}${key ? c : ""}</td>`
              : `<td></td>`;
          }).join("")}</tr>`,
      ).join("")}</table>`;
    const cl = (d) =>
      pl
        .filter((p) => p.d === d)
        .sort((a, b2) => a.n - b2.n)
        .map((p) => `<li><b>${p.n}</b> ${esc(p.clue)} (${p.w.length})</li>`)
        .join("");
    h =
      H("Crossword", "Read each clue and write the answer in the boxes.") +
      `<div class="wws">${grid(false)}<div class="wclues"><b>Across →</b><ol>${cl(0)}</ol><b>Down ↓</b><ol>${cl(1)}</ol></div></div>`;
    k = grid(true);
  } else if (b.type === "decode") {
    const msg = b.msg.toUpperCase(),
      SY = [
        "🍎",
        "🌙",
        "⭐",
        "🐟",
        "🌸",
        "🔺",
        "🔵",
        "🍃",
        "🐞",
        "☀️",
        "🪁",
        "🥭",
        "🐘",
        "🌈",
        "🦋",
        "🍌",
        "🚲",
        "🎈",
        "🐢",
        "🌻",
        "🪔",
        "🐝",
        "🍇",
        "🦚",
        "🧩",
        "🎵",
      ],
      L = [...new Set(msg.replace(/[^A-Z]/g, ""))],
      map = Object.fromEntries(wsShuf(L, r).map((c, j) => [c, SY[j % SY.length]]));
    h =
      H("Secret code", "Use the code to find the hidden message. Write a letter under each picture.") +
      `<div class="wcode">${Object.entries(map)
        .sort()
        .map(([c, s]) => `<span>${s} = ${c}</span>`)
        .join("")}</div><div class="wmsg">${msg
        .split(" ")
        .map(
          (w) =>
            `<span class="wword">${[...w].map((c) => (map[c] ? `<span class="wch"><span>${map[c]}</span><i></i></span>` : `<span class="wch">${c}</span>`)).join("")}</span>`,
        )
        .join("")}</div>`;
    k = esc(b.msg);
  } else if (b.type === "dots") {
    const P = WDOTS[b.shape] || WDOTS.star,
      svg = (line) =>
        `<svg viewBox="0 0 300 300" class="wdots">${line ? `<path d="M${P.map((p) => p.join(" ")).join(" L")} Z" stroke="#e0533d" stroke-width="3" fill="none"/>` : ""}${P.map((p, j) => `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="#2B2340"/><text x="${p[0] + 8}" y="${p[1] - 8}" font-size="15" font-weight="700">${j + 1}</text>`).join("")}</svg>`;
    h =
      H("Dot to dot", b.inst || "Join the dots from 1 in order, then colour it in.") +
      `<div class="wlab">${svg(false)}<div class="wq">${esc(b.ask || "What did you draw?")}<div class="wline"></div></div></div>`;
    k = svg(true);
  } else if (b.type === "sequence") {
    const S = wsShuf(
      b.steps.map((s, j) => ({ ...s, j })),
      r,
    );
    h =
      H("What happens first?", "Write 1, 2, 3… in the circles to put the pictures in order.") +
      `<div class="wseq">${S.map((s) => `<div class="wframe"><span class="wnum"></span>${wIc(s)}<div>${esc(s.t)}</div></div>`).join("")}</div>`;
    k = S.map((s) => `${s.j + 1}. ${esc(s.t)}`).join("<br>");
  } else if (b.type === "draw") {
    const fr = b.frame || "box";
    h =
      H(b.title || "Draw it", b.inst || "") +
      (fr === "comic"
        ? `<div class="wcomic">${(b.panels || ["", "", ""]).map((p) => `<div class="wpanel"><span class="wbub">${esc(p)}</span></div>`).join("")}</div>`
        : fr === "postcard"
          ? `<div class="wpost"><div class="wpic"></div><div class="wlines"><div class="wline"></div><div class="wline"></div><div class="wline"></div><div class="wline"></div></div></div>`
          : `<div class="wbox" style="height:${Math.min(b.h || 230, 240)}px">${b.ic ? `<span class="wwm">${b.ic}</span>` : ""}</div>`) +
      (b.lines ? Array.from({ length: b.lines }, () => `<div class="wline"></div>`).join("") : "");
  } else if (b.type === "table") {
    h =
      H("Find out and fill in", b.inst || "") +
      `<table class="wtab"><tr>${b.cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr>${(b.rows || Array(5).fill(null)).map((rw) => `<tr>${b.cols.map((_, j) => `<td>${rw && rw[j] != null ? esc(rw[j]) : ""}</td>`).join("")}</tr>`).join("")}</table>`;
  } else if (b.type === "board") {
    const sq = b.squares,
      cols = 6,
      rows = Math.ceil(sq.length / cols);
    h =
      H(
        "Board game",
        b.inst || "Play with a dice and a counter each. Do what the square says. First to the end wins!",
      ) +
      `<table class="wboard">${Array.from({ length: rows }, (_, y) => {
        const row = Array.from({ length: cols }, (_, x) => {
          const j = y * cols + (y % 2 ? cols - 1 - x : x);
          return sq[j] != null ? `<td><sup>${j + 1}</sup>${esc(sq[j])}</td>` : `<td class="wempty"></td>`;
        });
        return `<tr>${row.join("")}</tr>`;
      })
        .reverse()
        .join("")}</table>`;
  } else if (b.type === "numberline") {
    const a = b.from || 0,
      z = b.to || 20,
      st = b.step || 1,
      n = Math.round((z - a) / st);
    h =
      H("Number line", b.inst || "") +
      `<svg viewBox="-10 0 ${n * 30 + 20} 60" class="wnl"><path d="M0 30 H${n * 30}" stroke="#2B2340" stroke-width="3"/>${Array.from({ length: n + 1 }, (_, j) => `<path d="M${j * 30} 22 V38" stroke="#2B2340" stroke-width="2"/>${(b.show || []).includes(a + j * st) || !b.show ? `<text x="${j * 30}" y="55" text-anchor="middle" font-size="12">${a + j * st}</text>` : ""}`).join("")}</svg>${(b.qs || []).map((q) => `<div class="wline">${esc(q)}</div>`).join("")}`;
  } else if (b.type === "clocks") {
    const face = (t) => {
      const [hh, mm] = t.split(":").map(Number),
        ha = ((hh % 12) + mm / 60) * 30,
        ma = mm * 6;
      return `<svg viewBox="0 0 120 120" class="wclock"><circle cx="60" cy="60" r="55" fill="#fff" stroke="#2B2340" stroke-width="3"/>${Array.from({ length: 12 }, (_, j) => `<text x="${60 + 43 * Math.sin(((j + 1) * Math.PI) / 6)}" y="${64 - 43 * Math.cos(((j + 1) * Math.PI) / 6)}" text-anchor="middle" font-size="12">${j + 1}</text>`).join("")}${b.draw ? "" : `<path d="M60 60 L${60 + 28 * Math.sin((ha * Math.PI) / 180)} ${60 - 28 * Math.cos((ha * Math.PI) / 180)}" stroke="#2B2340" stroke-width="5" stroke-linecap="round"/><path d="M60 60 L${60 + 42 * Math.sin((ma * Math.PI) / 180)} ${60 - 42 * Math.cos((ma * Math.PI) / 180)}" stroke="#e0533d" stroke-width="3" stroke-linecap="round"/>`}<circle cx="60" cy="60" r="4"/></svg>`;
    };
    h =
      H(b.draw ? "Draw the hands" : "What time is it?", b.inst || "") +
      `<div class="wclocks">${b.times.map((t) => `<div>${face(t)}<div class="wline">${b.draw ? esc(t) : ""}</div></div>`).join("")}</div>`;
    k = b.draw ? "" : b.times.join(", ");
  } else if (b.type === "talk") {
    h =
      H("Think and talk", b.inst || "Talk about these with a grown-up. You can write or draw your answer.") +
      `<ul class="wtalk">${b.qs.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>`;
  }
  return { h, k };
}
function wsBlock(b, seed, i) {
  const H = (t) => `<div class="wbh"><span class="wbn">${i + 1}</span><div><b>${esc(b.title || t)}</b></div></div>`;
  if (b.type === "rules")
    return {
      h:
        H("How to play") +
        `<ol class="wrules">${b.items.map((r) => `<li>${esc(r)}</li>`).join("")}</ol>${b.need.length ? `<div class="winst">You need: ${esc(b.need.join(", "))}</div>` : ""}`,
      k: "",
    };
  if (b.type === "cards")
    return {
      h:
        H("Cut out the cards") +
        `<div class="wcards">${b.cards.map((c) => `<div class="wcard${c.job ? " job" : ""}"><span>${esc(c.front)}</span>${c.back ? `<small>${esc(c.back)}</small>` : ""}</div>`).join("")}</div>`,
      k: "",
    };
  return wsBasicBlock(b, seed, i);
}
function wsSinglePage(ws, u) {
  const parts = ws.blocks.map((b, i) => wsBlock(b, ws.id, i)),
    keys = parts
      .map((p, i) =>
        p.k ? `<div class="wk"><b>${i + 1}. ${esc(ws.blocks[i].title || "")}</b><div>${p.k}</div></div>` : "",
      )
      .join("");
  const tag = `${BNAME[u.board] === "DeepKids Plus" ? "DeepKids" : BOARDN[u.board] || BNAME[u.board] || "DeepKids"} · Class ${u.board === "dk" ? S.levels?.sci || 1 : u.level} · ${esc(SUBJ[u.subj] || "")}`,
    cs = getComputedStyle(document.documentElement),
    vars = [
      "--aqua",
      "--gum",
      "--tang",
      "--forest",
      "--peri",
      "--sun",
      "--leaf",
      "--sky",
      "--pist",
      "--teal",
      "--grape",
      "--tomato",
      "--ink",
      "--muted",
      "--surface",
      "--line",
    ]
      .map((v) => `${v}:${cs.getPropertyValue(v).trim() || "#8E8DD8"}`)
      .join(";");
  const css = `:root{${vars}}@page{size:A4;margin:11mm}*{box-sizing:border-box}body{margin:0;font:15px/1.45 "Trebuchet MS","Segoe UI",system-ui,sans-serif;color:#2B2340}.wpg{max-width:190mm;margin:0 auto}.whd{display:flex;gap:12px;align-items:center;border-bottom:3px solid #2B2340;padding-bottom:8px;margin-bottom:10px}.whd svg{width:54px;height:54px;flex:none}.whd h1{font-size:24px;margin:0;line-height:1.15}.wtag{font-size:11.5px;color:#6b6380}.wname{display:flex;gap:16px;font-size:13px;margin:4px 0 10px}.wname span{flex:1;border-bottom:1.5px solid #888;padding-bottom:2px}.wintro{background:#fff6d9;border-radius:12px;padding:8px 12px;font-size:14px;margin-bottom:10px}.wb{border:2px solid #e6dfd2;border-radius:16px;padding:8px 12px;margin:8px 0;break-inside:avoid}.wbh{display:flex;gap:8px;align-items:flex-start;margin-bottom:6px}.wbn{flex:none;width:26px;height:26px;border-radius:50%;background:#2B2340;color:#fff;display:grid;place-items:center;font-weight:700;font-size:14px}.wbh b{font-size:17px}.winst{font-size:13px;color:#5d5670}.wic{font-size:22px;margin-right:6px;vertical-align:middle}
   .wmatch{width:100%;border-collapse:separate;border-spacing:0 3px}.wmatch td{padding:4px 6px;font-size:15px}.wl{text-align:left;width:42%}.wr{width:42%}.wgap{width:16%}.wdot{display:inline-block;width:12px;height:12px;border-radius:50%;background:#2B2340;margin:0 8px;vertical-align:middle}.wcell{display:flex;align-items:center;justify-content:space-between;gap:6px}.wr .wcell{justify-content:flex-start}
   .wcirc{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:6px 0}.wq{font-weight:700;min-width:150px}.wopts{display:flex;gap:10px;flex-wrap:wrap}.wopt{border:1.5px dashed #bbb;border-radius:12px;padding:4px 10px}
   .wbank{display:flex;flex-wrap:wrap;gap:6px;border:2px dashed #c9b99a;border-radius:12px;padding:6px 8px;margin:4px 0 8px}.wbank span{background:#f4eee4;border-radius:8px;padding:2px 8px;font-weight:700}.wbank.wcol{flex-direction:column;align-self:flex-start}.wblank{display:inline-block;min-width:110px;border-bottom:2px solid #555;margin:0 4px}.wfill li{margin:8px 0}
   .wbaskets{display:flex;gap:10px}.wbasket{flex:1;min-height:150px;border:2.5px solid #2B2340;border-radius:4px 4px 22px 22px;padding:6px;text-align:center;background:repeating-linear-gradient(135deg,#fffaf0 0 10px,#fff 10px 20px)}.wcut{margin-top:12px;border-top:2px dashed #999;padding-top:10px;display:flex;flex-wrap:wrap;gap:8px;position:relative}.wsc{position:absolute;top:-14px;left:-4px;background:#fff;font-size:18px}.wcard{border:2px dashed #999;padding:8px 10px;border-radius:8px;min-width:90px;text-align:center}
   .wlab{display:grid;grid-template-columns:1.1fr 1fr;gap:12px;align-items:center}.wdiag{width:100%;max-height:300px}.wdots{width:100%;max-height:220px}.wline{border-bottom:1.5px solid #999;height:30px;margin:4px 0;font-size:14px;padding-top:6px}
   .wmaze{width:100%;max-height:330px}.wgrid,.wcw{border-collapse:collapse}.wgrid td{width:28px;height:28px;text-align:center;font-weight:700;font-size:16px;border:1px solid #ddd;font-family:monospace}.wgrid td.won{background:#ffe08a}.wws{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start}
   .wcw td{width:30px;height:30px;padding:0}.wcw td.on{border:2px solid #2B2340;position:relative;text-align:center;font-weight:700}.wcw sup{position:absolute;top:0;left:1px;font-size:8px;line-height:1;font-weight:400}.wcw td.on{font-size:15px;padding-top:4px}.wclues{flex:1;min-width:220px;font-size:13.5px}.wclues ol{list-style:none;padding:0;margin:4px 0 10px}
   .wcode{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:16px;margin-bottom:10px}.wmsg{display:flex;flex-wrap:wrap;gap:16px}.wword{display:flex;gap:4px}.wch{display:flex;flex-direction:column;align-items:center;font-size:22px}.wch i{display:block;width:26px;height:26px;border-bottom:2px solid #333}
   .wseq{display:grid;grid-template-columns:repeat(${Math.min(4, 4)},1fr);gap:8px}.wframe{border:2px solid #2B2340;border-radius:10px;padding:8px;min-height:120px;position:relative;font-size:13px;text-align:center}.wframe .wic{display:block;font-size:34px;margin:10px 0}.wnum{position:absolute;top:6px;left:6px;width:26px;height:26px;border:2px solid #2B2340;border-radius:50%}
   .wbox{border:2.5px solid #2B2340;border-radius:14px;position:relative}.wwm{position:absolute;right:10px;bottom:6px;font-size:40px;opacity:.25}.wcomic{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.wpanel{border:2.5px solid #2B2340;height:200px;position:relative}.wbub{position:absolute;top:8px;left:8px;right:30px;border:2px solid #2B2340;border-radius:16px;padding:4px 8px;min-height:40px;font-size:12px;background:#fff}
   .wpost{display:grid;grid-template-columns:1fr 1fr;gap:10px;border:2.5px solid #2B2340;padding:10px;border-radius:6px}.wpic{border:2px dashed #aaa;min-height:180px}
   .wtab{width:100%;border-collapse:collapse}.wtab th,.wtab td{border:1.5px solid #555;padding:8px;height:36px;text-align:left}.wtab th{background:#f4eee4}
   .wboard{width:100%;border-collapse:collapse;table-layout:fixed}.wrules{margin:4px 0 0 18px;font-size:13px;line-height:1.5}.wcards{display:grid;grid-template-columns:repeat(4,1fr);gap:0}.wcard{border:1.5px dashed #2B2340;height:92px;padding:8px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;font:600 13px/1.25 inherit;break-inside:avoid}.wcard small{font-weight:400;font-size:10px;color:#666;margin-top:6px;transform:rotate(180deg)}.wcard.job{background:var(--sun);font-size:15px}.wboard td{border:2px solid #2B2340;height:78px;padding:4px;font-size:11.5px;vertical-align:top;position:relative}.wboard sup{font-weight:700;font-size:12px;display:block}.wboard td.wempty{border:none}
   .wnl{width:100%}.wclocks{display:flex;gap:16px;flex-wrap:wrap}.wclocks>div{width:130px;text-align:center}.wclock{width:120px}.wtalk li{margin:6px 0}
   .wfoot{margin-top:12px;font-size:11px;color:#8a8399;display:flex;justify-content:space-between;border-top:1px solid #ddd;padding-top:6px}.wkey{break-before:page}.wk{margin:8px 0;font-size:13.5px}.wk .wgrid td,.wk .wcw td{width:22px;height:22px;font-size:12px}.wk svg{max-height:220px;width:auto;max-width:100%}
   .wstars{font-size:20px;letter-spacing:4px}@media screen{body{background:#eee;padding:10px}.wpg{background:#fff;padding:12mm;box-shadow:0 2px 10px rgba(0,0,0,.15)}.wkey{margin-top:16px}}`;
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(ws.title)} · DeepKids worksheet</title><style>${css}</style></head><body>
   <div class="wpg"><div class="whd">${sblob(u.subj, "happy", "", 'width="54" height="54"')}<div style="flex:1"><div class="wtag">${TWN()[(ws.id || "").split("|")[0]] ? `DeepKids · ${esc(TWN()[ws.id.split("|")[0]].title)} · ${PLN[ws.lvl || "core"]}` : `${tag} · ${esc(chT(u))}`}</div><h1>${esc(ws.title)}</h1></div><div class="wstars" title="How did it go?">☆☆☆</div></div>
   <div class="wname"><span>Name:</span><span>Date:</span></div>${ws.intro ? `<div class="wintro">${esc(ws.intro)}</div>` : ""}
   ${parts.map((p) => `<div class="wb">${p.h}</div>`).join("")}
   <div class="wfoot"><span>DeepKids · made for learning at home</span><span>About ${ws.mins || 20} minutes</span></div></div>
   ${keys ? `<div class="wpg wkey"><div class="whd"><div style="flex:1"><div class="wtag">For the grown-up</div><h1>Answers: ${esc(ws.title)}</h1></div></div>${keys}${ws.tip ? `<p class="wintro"><b>Tip:</b> ${esc(ws.tip)}</p>` : ""}</div>` : ""}</body></html>`;
}
function wsPage(ws, u) {
  return ws.pages ? wsBook(ws, u) : wsSinglePage(ws, u);
}
/* the list on each chapter: our own sheets, then curated ones from open sources */
function wsOf(u) {
  return topicsOf(u).flatMap((t) => ((DATA.tws || {})[t] || []).map((w) => ({ ...w, topic: t })));
}
const WSKIND = {
  book: "Mission book",
  play: "Picture puzzle",
  make: "Make and do",
  game: "Game sheet",
  think: "Think deeper",
};
function printSheetsOwn(u) {
  const R = wsRank(u),
    C = wsCur(u);
  if (!R.length && !C.length) return "";
  const p = profOf(u.subj),
    mine = R.filter((x) => (x.w.lvl || "core") === p.lvl),
    rest = R.filter((x) => (x.w.lvl || "core") !== p.lvl);
  const row = (x) =>
    `<div class="pws"><div style="min-width:0;flex:1"><span class="eyebrow">${PLN[x.w.lvl || "core"]} · ${esc(WSKIND[x.w.kind] || "Worksheet")} · ${x.w.pages ? `${x.w.pages.filter((p) => p.station).length} stations · ${esc(x.w.hours || "")}` : `≈ ${x.w.mins || 20} min`}</span><b>${esc(x.w.title)}</b><p class="xs muted">${esc(x.w.blurb || "")}</p></div><div class="col" style="gap:6px"><button class="btn sm accent" data-act="wsprint" data-k="${u.k}" data-i="${x.i}">Print</button><button class="link xs" data-act="wsview" data-k="${u.k}" data-i="${x.i}">Preview</button></div></div>`;
  const topics = [...new Set(R.map((x) => x.w.topic))].map((t) => TWN()[t]?.title).filter(Boolean);
  return `<section class="card"><div class="sech"><b style="font:600 17px var(--display)">🖨️ Printable worksheets</b><span class="pill">${R.length}</span></div><p class="xs muted">About ${esc(topics.join(", "))}. No textbook needed. Each prints on A4 with an answer page for you.</p>
   ${mine.length ? `<span class="eyebrow">Best for ${esc(S.child || "your child")} · ${PLN[p.lvl]} · ${PDN[p.depth]}</span>${mine.map(row).join("")}` : ""}
   ${rest.length ? `<details${mine.length ? "" : " open"}><summary class="sm"><b>Other levels (${rest.length})</b></summary>${rest.map(row).join("")}</details>` : ""}
   ${C.length ? `<span class="eyebrow" style="margin-top:6px">Also from official sources</span>${C.map((c) => `<div class="pws"><div style="min-width:0;flex:1"><b>${esc(c.title)}</b><p class="xs muted">${esc(c.src)}</p></div><a class="btn sm soft" href="${esc(c.url)}" target="_blank" rel="noopener">Open</a></div>`).join("")}` : ""}</section>`;
}
function printSheets(u) {
  const h = printSheetsOwn(u),
    R = curatedFor(u);
  if (!R.length) return h;
  const row = (r) =>
    `<a class="res" href="${esc(r.url)}" target="_blank" rel="noopener"><div style="min-width:0"><span class="eyebrow">${esc(CURT[r.type] || r.type)} · ${esc(r.source)} · ages ${r.ages[0]}–${r.ages[1]}${r.access !== "free" ? " · free account" : ""}</span><b>${esc(r.title)}</b><p class="xs">${esc(r.desc)}</p>${r.how ? `<p class="xs muted">${esc(r.how)}</p>` : ""}</div><span class="xs">open ↗</span></a>`;
  return (
    h +
    `<section class="card" style="gap:0"><div class="sech"><b style="font:600 17px var(--display)">⭐ The best from elsewhere</b><span class="pill">${R.length}</span></div><p class="xs muted" style="margin-bottom:6px">Free worksheets, hands-on activities, stories and lessons we checked and picked for this topic, best fit for ${esc(S.child || "your child")}'s age first.</p>${R.slice(0, 6).map(row).join("")}${R.length > 6 ? `<details><summary class="sm"><b>${R.length - 6} more</b></summary>${R.slice(6).map(row).join("")}</details>` : ""}</section>`
  );
}
function wsViewSheet() {
  const P = ui.sheet,
    u = unitByK(P.k),
    w = P.game ? gameSheet(u) : wsOf(u)[P.i];
  document.getElementById("sheetTitle").textContent = w ? w.title : "Worksheet";
  if (!w) return `<p class="note">Not found.</p>`;
  return `<div class="row">${P.game ? `<button class="btn accent sm" data-act="cgprint" data-k="${u.k}">🖨️ Print</button>` : `<button class="btn accent sm" data-act="wsprint" data-k="${u.k}" data-i="${P.i}">🖨️ Print</button><button class="btn soft sm" data-act="wssave" data-k="${u.k}" data-i="${P.i}">Save as a file</button>`}</div><iframe class="wsframe" title="Worksheet preview" srcdoc="${esc(wsPage(w, u))}"></iframe>`;
}
/* Waldorf: its own subjects (Main lesson, Hindi, Arts & handwork), shown only to Waldorf families */
const WFS = ["wml", "wart"],
  visSubj = (b) => (b === "waldorf" ? ["wml", "hin", "wart", "sci"] : SUBJ_KEYS.filter((k) => !WFS.includes(k)));
function wfGuideView() {
  const G = DATA.waldorf || {};
  document.getElementById("sheetTitle").textContent = "Waldorf at home";
  const cls = S.levels?.wml || 1,
    tbl = (rows, h) =>
      `<table class="wft">${h ? `<tr>${h.map((x) => `<th>${x}</th>`).join("")}</tr>` : ""}${rows.map((r) => `<tr>${r.map((x) => `<td>${esc(x)}</td>`).join("")}</tr>`).join("")}</table>`;
  return `<p>${esc(G.intro || "")}</p>
   <section class="card"><b style="font:600 17px var(--display)">What matters most</b>${(G.principles || []).map(([t, d]) => `<p class="sm"><b>${esc(t)}.</b> ${esc(d)}</p>`).join("")}</section>
   <section class="card"><b style="font:600 17px var(--display)">A Waldorf day at home</b>${tbl(G.day || [], ["", "Time", "What"])}<p class="xs muted">DeepKids plans the main lesson, Hindi and the arts each day from your Pace settings. Set times in Plan → Times and pace → Day times.</p></section>
   <section class="card"><b style="font:600 17px var(--display)">The week's arts rhythm</b>${tbl(G.week || [])}</section>
   <section class="card"><b style="font:600 17px var(--display)">The year and its festivals</b>${tbl(G.year || [])}<p class="xs muted">Keep a seasonal table: a cloth in the season's colour, and what you find outside.</p></section>
   <section class="card"><b style="font:600 17px var(--display)">What to get</b>${tbl(G.materials || [])}</section>
   <section class="card"><b style="font:600 17px var(--display)">Books</b><p class="sm"><b>For you:</b></p><ul class="sm">${(G.books?.parent || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>${[1, 2, 3, 4, 5].map((c) => `<details${c === cls ? " open" : ""}><summary class="sm"><b>Class ${c}</b>${c === cls ? " (your class)" : ""}</summary><ul class="sm">${(G.books?.[c] || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></details>`).join("")}</section>
   <p class="xs muted">${esc(G.schools || "")}</p><p class="xs muted">This plan is written in the spirit of Waldorf education for Indian families. It is not an accredited Steiner curriculum; a trained Waldorf teacher near you can help you go deeper.</p>`;
}
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
function wsQuestion(k, id, it, qn) {
  const v = A(k, id);
  let b = "";
  if (it.t === "mcq")
    b = `<div class="col" style="gap:8px">${it.opts.map((o, oi) => `<button class="opt ${v === undefined ? "" : oi === it.a ? "right" : oi === v ? "wrong" : ""}" data-act="mcq" data-k="${k}" data-id="${id}" data-o="${oi}" data-a="${it.a}" ${v !== undefined ? "disabled" : ""}>${esc(o)}</button>`).join("")}</div>${v !== undefined ? `<div class="row sm"><span>${v === it.a ? "Right." : "The green one is our answer. Talk about why."}</span><button class="link sm" data-act="mcqreset" data-k="${k}" data-id="${id}">Try again</button></div>` : ""}`;
  else if (it.t === "fill")
    b = `<div class="col" style="gap:8px">${it.a.map((_, bi) => `<input class="inp" id="f-${k}-${id}-${bi}" data-ans="${k}|${id}|${bi}" placeholder="Blank ${bi + 1}" value="${esc((v || [])[bi] || "")}">`).join("")}</div><div class="row"><button class="btn xs" data-act="checkfill" data-k="${k}" data-id="${id}" data-a="${esc(JSON.stringify(it.a))}">Check</button><button class="link sm" data-act="showfill" data-a="${esc(it.a.join(" · "))}">Show answers</button></div>`;
  else if (it.t === "write")
    b = `<textarea class="inp" id="w-${k}-${id}" data-ans="${k}|${id}" rows="${it.lines || 3}" placeholder="Write here">${esc(v || "")}</textarea>`;
  else if (it.t === "table") {
    const vv = v || {};
    b = `<div class="grid"><table><tr>${it.cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr>${Array.from({ length: it.rows }, (_, r) => `<tr>${it.cols.map((_, ci) => `<td><input id="t-${k}-${id}-${r}-${ci}" data-ans="${k}|${id}|${r}.${ci}" value="${esc(vv[r + "." + ci] ?? (ci === 0 && it.prefill ? it.prefill[r] || "" : ""))}" aria-label="${esc(it.cols[ci])}, row ${r + 1}"></td>`).join("")}</tr>`).join("")}</table></div>`;
  } else if (it.t === "draw")
    b = `<canvas class="pad" data-pad="${k}|${id}"></canvas><div class="row"><button class="link sm" data-act="clearpad" data-pad="${k}|${id}">Clear</button><button class="btn xs ${v ? "soft" : ""}" data-act="drew" data-k="${k}" data-id="${id}">${v ? "Drawn ✓" : "Drawn on paper"}</button></div>`;
  else if (it.t === "sort") {
    const vv = v || {},
      sel = ui.sel[k + id];
    b = `<div class="pool">${
      it.items
        .filter((z) => vv[z] === undefined)
        .map(
          (z) =>
            `<button class="token ${sel === z ? "sel" : ""}" data-act="tok" data-k="${k}" data-id="${id}" data-x="${esc(z)}">${esc(z)}</button>`,
        )
        .join("") || `<span class="sm">All sorted. Could any go in two boxes?</span>`
    }</div><div class="buckets">${it.cats
      .map(
        (c, ci) =>
          `<div class="bucket" data-act="bucket" data-k="${k}" data-id="${id}" data-c="${ci}"><b>${esc(c)}</b>${it.items
            .filter((z) => vv[z] === ci)
            .map(
              (z) =>
                `<button class="token" data-act="untok" data-k="${k}" data-id="${id}" data-x="${esc(z)}">${esc(z)} ×</button>`,
            )
            .join("")}</div>`,
      )
      .join(
        "",
      )}</div><p class="xs muted">${sel ? `Now tap a box for “${esc(sel)}”.` : "Tap a word, then tap its box."}</p>`;
  } else if (it.t === "match") {
    const vv = v || {},
      sel = ui.sel[k + id],
      rights = it.pairs
        .map((p) => p[1])
        .slice()
        .sort();
    b = `<div class="match"><div class="col" style="gap:6px">${it.pairs.map(([l]) => `<button class="mitem ${vv[l] !== undefined ? "paired" : sel === l ? "sel" : ""}" data-act="mleft" data-k="${k}" data-id="${id}" data-x="${esc(l)}">${esc(l)}${vv[l] !== undefined ? " → " + esc(vv[l]) : ""}</button>`).join("")}</div><div class="col" style="gap:6px">${rights.map((r) => `<button class="mitem ${Object.values(vv).includes(r) ? "paired" : ""}" data-act="mright" data-k="${k}" data-id="${id}" data-x="${esc(r)}">${esc(r)}</button>`).join("")}</div></div>${Object.keys(vv).length === it.pairs.length ? `<div class="row sm"><span>${it.pairs.filter(([l, r]) => vv[l] === r).length} of ${it.pairs.length} match ours.</span><button class="link sm" data-act="mreset" data-k="${k}" data-id="${id}">Try again</button></div>` : `<p class="xs muted">Tap a word on the left, then its match.</p>`}`;
  }
  // once a choice is made, right or wrong, say the answer and why
  const why =
    it.t === "mcq" && v !== undefined
      ? `<p class="sm qwhy"><b>${v === it.a ? "✓ Right." : `Not quite. The answer: ${esc(it.opts[it.a])}.`}</b>${it.why ? ` ${esc(it.why)}` : ""}</p>`
      : "";
  return `<div class="wq"><div class="p">${qn}. ${esc(it.p)}</div>${b}${why}</div>`;
}
function wsItem(k, id, it, qn) {
  if (it.t !== "forces") {
    let h = wsQuestion(k, id, it, qn);
    if (it.t === "draw" && SAMPLE)
      h = h.replace(
        /<\/div>\s*$/,
        `<button class="link sm" data-act="aidraw" data-k="${k}" data-id="${id}">✦ Check my drawing (uses AI)</button>${ui.aires?.[k + id] ? `<p class="sm note">${esc(ui.aires[k + id])}</p>` : ""}</div>`,
      );
    return h;
  }
  const v = A(k, id) || { fs: [] },
    fs = v.fs || [],
    sel = ui.fsel?.[k + id] || it.options[0],
    res = v.checked ? forcesCheck(it, fs) : null;
  return `<div class="wsq"><span class="eyebrow">Question ${qn} · force diagram</span><p><b>${esc(it.p)}</b></p>${forceSvg(it.obj, fs)}
   <div class="row" style="flex-wrap:wrap;gap:6px"><select class="inp" style="width:auto" data-fsel="1" data-fk="${k}" data-fid="${id}">${it.options.map((o) => `<option ${o === sel ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>${Object.entries(
     FDIR,
   )
     .map(
       ([d, a]) =>
         `<button class="btn xs soft" aria-label="${esc(sel)} ${d}" data-act="fadd" data-k="${k}" data-id="${id}" data-dir="${d}">${a}</button>`,
     )
     .join("")}</div>
   ${fs.length ? `<div class="row chips" style="flex-wrap:wrap">${fs.map((f, i) => `<button class="chip" data-act="fdel" data-k="${k}" data-id="${id}" data-i="${i}">${esc(f.name)} ${FDIR[f.dir]} ✕</button>`).join("")}</div>` : `<p class="xs muted">Choose a force, then tap the way it pushes or pulls. Add every force you think acts on it.</p>`}
   <div class="row"><button class="btn xs" data-act="fcheck" data-k="${k}" data-id="${id}" ${fs.length ? "" : "disabled"}>Check</button>${v.checked && !res.ok ? `<button class="link sm" data-act="fshow" data-k="${k}" data-id="${id}">Show our answer</button>` : ""}</div>
   ${res ? `<div class="sm ${res.ok ? "good" : "note"}">${res.ok ? "All right! Every force and direction matches." : [res.right.length ? `✓ Right: ${res.right.map((f) => f.name).join(", ")}.` : "", res.wrongDir.length ? `↺ Right force, wrong direction: ${res.wrongDir.map((f) => f.name).join(", ")}.` : "", res.extra.length ? `✕ Not acting here: ${res.extra.map((f) => f.name).join(", ")}.` : "", res.missing.length ? `… ${res.missing.length} force${res.missing.length > 1 ? "s" : ""} still missing.` : ""].filter(Boolean).join(" ")}</div>` : ""}
   ${v.shown ? `<p class="xs"><b>Our answer:</b> ${it.a.map((f) => `${esc(f.name)} ${FDIR[f.dir]}`).join(", ")}</p>` : ""}</div>`;
}
function wsSheet() {
  const u = unitBy(ui.sheet.k);
  if (!u) return "";
  const wid = ui.sheet.w,
    pw = wid && u.c?.p?.worksheets?.find((w) => w.id === wid),
    W = pw ? pw.sections : u.c.x.wsd,
    k = pw ? u.k + "#" + wid : u.k,
    si = Math.min(ui.wsec[k] || 0, W.length - 1);
  document.getElementById("sheetTitle").textContent = (pw ? pw.title : "Worksheet") + " · " + u.title;
  let qn = W.slice(0, si).reduce((a, s) => a + s[1].length, 0);
  const [title, items] = W[si];
  return `<div class="segs ${SC(u.subj)}">${W.map((_, i) => `<i class="${i < si ? "ok" : i === si ? "on" : ""}"></i>`).join("")}</div><section class="card"><span class="eyebrow">${pw ? TIER[pw.tier] + " · " : ""}Section ${si + 1} of ${W.length}</span><h2 style="font-size:22px">${esc(title.replace(/^[A-Z]\. /, ""))}</h2>${items.map((it, ii) => wsItem(k, si + "-" + ii, it, ++qn)).join("")}</section>
   <div class="pager"><button class="btn line" data-act="wsec" data-k="${k}" data-d="-1" ${si === 0 ? "disabled" : ""}>${icon("back")}Back</button>${si < W.length - 1 ? `<button class="btn accent wide" data-act="wsec" data-k="${k}" data-d="1">Next section${icon("next")}</button>` : `<button class="btn accent wide" data-act="wsdone" data-k="${k}">${taskDone(k, "ws") ? "Finished ✓" : "Finish the worksheet"}</button>`}</div><p class="xs muted">Many questions have no single right answer. The thinking is the point.</p>`;
}
function wsView() {
  let h = wsSheet();
  const k = ui.sheet.w ? ui.sheet.k + "#" + ui.sheet.w : "";
  if (!k) return h;
  const st = ui.aiws?.k === k ? ui.aiws : null;
  const box = `<section class="card"><span class="eyebrow">Did it on paper?</span><p class="sm">Take a photo of the printed sheet and DeepKids AI will check it against our answers, question by question. ${SAMPLE ? "" : "(Needs DeepKids Plus.)"}</p>${SAMPLE ? `<label class="btn sm soft" style="justify-self:start">📷 Check a photo of the paper sheet (uses AI)<input type="file" accept="image/*" capture="environment" multiple id="wsPhoto" data-k="${k}" hidden></label>` : ""}
   ${st?.busy ? `<p class="sm">Checking…</p>` : ""}${st?.err ? `<p class="sm note">${esc(st.err)}</p>` : ""}
   ${st?.res ? `<div class="col" style="gap:4px">${(st.res.results || []).map((r) => `<div class="sm">${r.verdict === "right" ? "✓" : r.verdict === "partly" ? "◐" : r.verdict === "not yet" ? "✕" : "?"} <b>Q${r.n}</b> ${esc(r.note || "")}</div>`).join("")}<p class="sm"><b>${esc(st.res.summary || "")}</b></p><p class="xs muted">Checked by AI: it can misread handwriting, so look over anything surprising.</p></div>` : ""}</section>`;
  return h + box;
}
function initPads() {
  document.querySelectorAll("canvas.pad").forEach((c) => {
    if (c._ok) return;
    const r = c.getBoundingClientRect();
    if (!r.width) return;
    c._ok = 1;
    c.width = r.width * devicePixelRatio;
    c.height = r.height * devicePixelRatio;
    const x = c.getContext("2d");
    x.scale(devicePixelRatio, devicePixelRatio);
    x.lineWidth = 3;
    x.lineCap = "round";
    x.lineJoin = "round";
    x.strokeStyle = getComputedStyle(document.body).color;
    let d = false,
      drew = false;
    const key = padKey(c.dataset.pad),
      old = lsGet(key);
    if (old) {
      const im = new Image();
      im.onload = () => x.drawImage(im, 0, 0, r.width, r.height);
      im.src = old;
    }
    const pt = (e) => {
      const b = c.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top];
    };
    c.onpointerdown = (e) => {
      d = true;
      drew = true;
      c.setPointerCapture(e.pointerId);
      x.beginPath();
      x.moveTo(...pt(e));
    };
    c.onpointermove = (e) => {
      if (d) {
        x.lineTo(...pt(e));
        x.stroke();
      }
    };
    c.onpointerup = () => {
      d = false;
      if (!drew) return;
      try {
        const s = document.createElement("canvas");
        s.width = Math.min(480, c.width);
        s.height = Math.round((s.width * c.height) / c.width);
        const g = s.getContext("2d");
        g.fillStyle = "#fff";
        g.fillRect(0, 0, s.width, s.height);
        g.drawImage(c, 0, 0, s.width, s.height);
        lsSet(key, s.toDataURL("image/jpeg", 0.7));
      } catch (e) {}
      const [k, id] = c.dataset.pad.split(/\|(?=[^|]*$)/);
      if (!A(k, id)) {
        setA(k, id, today);
        save();
      }
    };
  });
}
