/* ---------- Mission books: multi-page printable activity books built around a case to solve ---------- */
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
function bookBlockV0(b, seed, i) {
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
function bookBlockV1(b, seed, i) {
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
  return bookBlockV0(b, seed, i);
}
function bookBlock(b, seed, i) {
  if (b.type === "story")
    return {
      h: `<div class="wstory"><div class="wstoryhd">A story to read aloud</div><h2>${esc(b.title)}</h2>${b.text.map((p, j) => `<p${j ? "" : ' class="first"'}>${esc(p)}</p>`).join("")}<div class="wstoryask"><b>Talk about it</b><ol>${b.ask.map((q) => `<li>${esc(q)}</li>`).join("")}</ol></div></div>`,
      k: "",
      bare: 1,
    };
  return bookBlockV1(b, seed, i);
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
