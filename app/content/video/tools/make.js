const fs = require("fs");
const { SK, INK, person, bubble, helix, seed, plant } = require("../art.js");
const C = require("./clauses.js"), TM = require("./timing.json");
const LEAD = 0.25, GAP = 0.3, TAIL = 0.45;
// clause start offsets per slide, slide lengths
const OFF = TM.map((row) => { let t = LEAD; return row.map((d) => { const s = t; t += d + GAP; return s; }); });
const DUR = TM.map((row) => LEAD + row.reduce((a, d) => a + d, 0) + GAP * (row.length - 1) + TAIL);
// time of word k of clause j in slide i (spread over characters)
const wt = (i, j, k) => { const ws = C[i][j].split(" "), tot = ws.join(" ").length; let ch = 0; for (let q = 0; q < k; q++) ch += ws[q].length + 1; return OFF[i][j] + (TM[i][j] * ch) / tot - 0.1; };
const wl = (i, j) => C[i][j].split(" ").length - 1;
const c = (i, j) => OFF[i][j];
const BG = "#efe3cf";
const T = (x, y, t, s = 30, o = {}) => `<text x="${x}" y="${y}" font-family="${o.serif ? "Georgia,serif" : "Arial,sans-serif"}" font-size="${s}" font-weight="${o.w || 400}" fill="${o.c || INK}" text-anchor="${o.a || "start"}">${t}</text>`;
const ground = (y = 600) => `<rect x="0" y="${y}" width="1280" height="${720 - y}" fill="#d9c7a4"/><line x1="0" y1="${y}" x2="1280" y2="${y}" stroke="${INK}" stroke-width="4"/>`;
const meena = (x, y, s) => person(x, y, s, { skin: SK.b, hair: "#1b1410", hairStyle: "plaits", cloth: "#d63a2a", cloth2: "#f2b01e" });
const martha = (x, y, s) => person(x, y, s, { skin: "#f0c9a6", hair: "#6b4a2b", hairStyle: "short", extra: "coat", cloth: "#fff" });
const paati = (x, y, s) => person(x, y, s, { skin: SK.c, hair: "#eeeeee", hairStyle: "bun", extra: "glasses", cloth: "#2e7d6b", cloth2: "#f2b01e" });
const selvi = (x, y, s) => person(x, y, s, { skin: SK.a, hair: "#2b1d16", hairStyle: "turban", cloth: "#3a6fd6", cloth2: "#f2b01e" });
const sage = (x, y, s) => person(x, y, s, { skin: SK.d, hair: "#dddddd", hairStyle: "bald", extra: "beard", cloth: "#e8892b" });
const phone = (x, y, w, img) => `<g><rect x="${x}" y="${y}" width="${w}" height="${w * 2.1}" rx="34" fill="#fff" stroke="${INK}" stroke-width="8"/><image href="${img}" x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${(w - 12) * 2.164}" preserveAspectRatio="xMidYMin slice" clip-path="inset(0 round 28px)"/></g>`;
const pan = (x, y) => `<path d="M${x - 120} ${y} Q${x} ${y + 70} ${x + 120} ${y} Z" fill="#c9a227" stroke="${INK}" stroke-width="5"/><line x1="${x - 120}" y1="${y}" x2="${x}" y2="240" stroke="${INK}" stroke-width="4"/><line x1="${x + 120}" y1="${y}" x2="${x}" y2="240" stroke="${INK}" stroke-width="4"/>`;
const virus = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><polygon points="-26,-30 26,-30 40,0 26,30 -26,30 -40,0" fill="#7a4fd6" stroke="${INK}" stroke-width="4"/><rect x="-8" y="30" width="16" height="30" fill="#b58be8" stroke="${INK}" stroke-width="4"/>${[-24, -8, 8, 24].map((d) => `<line x1="${d}" y1="60" x2="${d * 1.8}" y2="86" stroke="${INK}" stroke-width="4"/>`).join("")}</g>`;
const D = (t) => `style="--d:${t.toFixed(2)}s"`;
const pop = (t, inner, o = "15% 100%") => `<g class="pop" style="--d:${t.toFixed(2)}s;--o:${o}">${inner}</g>`;
const fade = (t, inner) => `<g class="fade" ${D(t)}>${inner}</g>`;
const rise = (t, inner) => `<g class="rise" ${D(t)}>${inner}</g>`;
const bob = (inner, k = 0) => `<g class="bob" style="animation-delay:${(-k * 0.7).toFixed(2)}s">${inner}</g>`;
const CSS = `
html,body{margin:0;background:${BG};overflow:hidden}svg{display:block}
.pop,.fade,.rise,.slide{opacity:0;transform-box:fill-box}
.pop{transform-origin:var(--o,50% 100%);animation:pop .55s cubic-bezier(.2,.9,.3,1.3) var(--d) forwards}
.fade{animation:fade .7s ease-out var(--d) forwards}
.rise{animation:rise .8s cubic-bezier(.2,.8,.2,1) var(--d) forwards}
.slide{animation:slide .8s cubic-bezier(.2,.8,.2,1) var(--d) forwards}
.bob{transform-box:fill-box;animation:bob 3.2s ease-in-out infinite alternate}
.beat{transform-box:fill-box;transform-origin:50% 50%;animation:beat .7s ease-in-out var(--d) both}
.draw{opacity:0;animation:fadeq .01s linear var(--d) forwards}
.line{stroke-dasharray:1;stroke-dashoffset:1;animation:dr var(--t,.8s) ease-out var(--d) forwards}
.cover{transform-box:fill-box;transform-origin:100% 50%;animation:wipe var(--t,1s) linear var(--d) forwards}
.chalk{animation:chalk var(--t,1s) linear var(--d) forwards;opacity:0}
.tw{transform-box:fill-box;transform-origin:50% 50%;animation:tw 2.2s ease-in-out infinite alternate}
@keyframes pop{0%{opacity:0;transform:scale(.15)}100%{opacity:1;transform:scale(1)}}
@keyframes fade{to{opacity:1}}@keyframes fadeq{to{opacity:1}}
@keyframes rise{from{opacity:0;transform:translateY(90px)}to{opacity:1;transform:none}}
@keyframes slide{from{opacity:0;transform:translateX(160px)}to{opacity:1;transform:none}}
@keyframes bob{to{transform:translateY(-7px)}}
@keyframes beat{50%{transform:scale(1.18)}}
@keyframes dr{to{stroke-dashoffset:0}}
@keyframes wipe{to{transform:scaleX(0)}}
@keyframes chalk{0%{opacity:1;transform:translateX(0)}99%{opacity:1}100%{opacity:0;transform:translateX(var(--w,300px))}}
@keyframes tw{from{opacity:.25;transform:scale(.6)}to{opacity:1;transform:scale(1.5)}}
@keyframes rock{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}
@keyframes unrock{from{transform:rotate(5deg)}to{transform:rotate(-5deg)}}
@keyframes spinx{0%{transform:scaleX(1)}25%{transform:scaleX(.25)}50%{transform:scaleX(-1)}75%{transform:scaleX(.25)}100%{transform:scaleX(1)}}
@keyframes tap{0%{opacity:0;transform:translate(50px,110px)}25%{opacity:1;transform:translate(0,0)}50%{transform:translate(0,0)}62%{transform:translate(2px,9px) scale(.94)}78%{opacity:1;transform:translate(0,0)}100%{opacity:1;transform:translate(0,0)}}
@keyframes ringp{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(1.45,1.9)}}
@keyframes glow{from{filter:drop-shadow(0 0 6px #ffd166)}to{filter:drop-shadow(0 0 34px #ffd166)}}
@keyframes moon{from{opacity:.08}to{opacity:.22}}
`;
const S = [];
// 1 ---------------------------------------------------------------
{ const i = 0;
  const gs = [[780, 290, "#999"], [930, 300, "#aaa"], [1080, 285, "#bbb"], [860, 430, "#b5b5b5"], [1020, 440, "#a5a5a5"]];
  S.push(`<rect width="1280" height="720" fill="${BG}"/>${ground()}
  ${gs.map(([x, y, col], k) => fade(c(i, 1) + k * 0.55, bob(`<g opacity=".6"><circle cx="${x}" cy="${y}" r="42" fill="${col}"/><path d="M${x - 62} ${y + 140} C${x - 62} ${y + 70} ${x - 30} ${y + 48} ${x} ${y + 48} C${x + 30} ${y + 48} ${x + 62} ${y + 70} ${x + 62} ${y + 140} Z" fill="${col}"/></g>`, k) + pop(c(i, 1) + k * 0.55 + 0.35, `<text x="${x + 6}" y="${y - 52}" font-family="Georgia" font-size="54" fill="${INK}" opacity=".75">?</text>`, "50% 100%")).replace("</g><g class=\"pop\"", "</g><g class=\"pop\"")).join("")}
  ${rise(0.1, bob(meena(330, 360, 1.7)))}${pop(c(i, 0), bubble(120, 90, 360, 120, "Who decides what is true?", { size: 30 }))}
  ${[["#8a5230", 470, 545, 190], ["#3a6fd6", 484, 518, 165], ["#2e9e6b", 474, 491, 180]].map(([col, x, y, w], k) => rise(0.4 + k * 0.25, `<rect x="${x}" y="${y}" width="${w}" height="26" fill="${col}" stroke="${INK}" stroke-width="4"/>`)).join("")}`);
}
// 2 ---------------------------------------------------------------
{ const i = 1;
  const P = [[martha, 150, 440, 1.25, 40, 120, 170, 84, "DNA!", 36, "Martha Chase, 1952", 150], [paati, 410, 440, 1.25, 260, 100, 260, 100, "It runs in the blood", 25, "Paati", 410], [selvi, 670, 440, 1.25, 560, 105, 170, 106, null, 0, "Selvi, a farmer", 670], [sage, 930, 440, 1.25, 800, 100, 240, 100, "All is one", 28, "The Upanishads", 930], [meena, 1160, 460, 1.1, 1060, 150, 150, 80, "Why?", 34, "Meena, 8", 1160]];
  S.push(`<rect width="1280" height="720" fill="${BG}"/>${ground(610)}` + P.map(([fn, x, y, s, bx, by, bw, bh, txt, sz, name, nx], k) => {
    const t = c(i, k + 1);
    const b = txt ? bubble(bx, by, bw, bh, txt, { size: sz }) : `<g transform="translate(${bx} ${by})"><path d="M0 0 H170 Q184 0 184 14 V92 Q184 106 170 106 H44 L18 136 L24 106 H14 Q0 106 0 92 V14 Q0 0 14 0 Z" fill="#fff" stroke="${INK}" stroke-width="4"/>${seed(92, 53, 1.1)}</g>`;
    return rise(0.15 + k * 0.3, bob(fn(x, y, s), k)) + pop(t, b) + fade(t + 0.15, `<g class="beat" ${D(c(i, 6) + 0.3 + k * 0.25)}>${T(nx, 660, name, 22, { a: "middle", w: 700 })}</g>`);
  }).join(""));
}
// 3 ---------------------------------------------------------------
{ const i = 2, tp = c(i, 2) + 0.2;
  S.push(`<rect width="1280" height="720" fill="${BG}"/>${ground()}
  ${rise(0.1, bob(paati(190, 420, 1.55)))}${pop(c(i, 0) + 1.3, bubble(40, 70, 330, 110, "It runs in the blood.", { size: 30 }))}
  ${rise(0.3, bob(meena(470, 460, 1.3), 2))}${pop(c(i, 1) + 0.3, `<text x="540" y="330" font-family="Georgia" font-size="60" fill="${INK}">?</text>`, "50% 100%")}
  <g class="slide" ${D(0.2)}>${phone(760, 40, 330, "app-true-1.png")}</g>
  <g class="fade" ${D(tp + 0.9)}><rect x="948" y="326" width="88" height="37" rx="12" fill="#5b1108" opacity=".35"/></g>
  <g class="fade" ${D(tp + 0.7)}><rect x="940" y="318" width="104" height="52" rx="20" fill="none" stroke="#d63a2a" stroke-width="6"/></g>
  <g style="transform-box:fill-box;transform-origin:50% 50%;animation:ringp 1.3s ease-out ${(tp + 0.9).toFixed(2)}s infinite;opacity:0"><rect x="940" y="318" width="104" height="52" rx="20" fill="none" stroke="#d63a2a" stroke-width="5"/></g>
  <g transform="translate(990 352) rotate(-20)"><g style="opacity:0;animation:tap 1.4s ease-out ${tp.toFixed(2)}s forwards"><path d="M0 0 C-8 -26 8 -34 14 -10 L28 28 C30 52 12 66 -8 56 Z" fill="${SK.d}" stroke="${INK}" stroke-width="4"/></g></g>`);
}
// 4 ---------------------------------------------------------------
{ const i = 3, rk = `animation:rock 2.6s ease-in-out infinite alternate;transform-origin:640px 240px`;
  const un = (cx) => `animation:unrock 2.6s ease-in-out infinite alternate;transform-origin:${cx}px 240px`;
  const tw = () => person(-58, -93, 0.62, { skin: SK.b, hair: "#1b1410", hairStyle: "plaits", cloth: "#d63a2a" }) + person(58, -93, 0.62, { skin: SK.b, hair: "#1b1410", hairStyle: "plaits", cloth: "#3a6fd6" });
  S.push(`<rect width="1280" height="720" fill="${BG}"/>${ground(640)}
  ${fade(0.3, `<text x="640" y="62" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="34" fill="${INK}">“Your DNA decides everything.”</text>`)}
  ${rise(0.1, `<rect x="615" y="240" width="50" height="400" fill="#8a5230" stroke="${INK}" stroke-width="4"/><polygon points="560,640 720,640 640,585" fill="#8a5230" stroke="${INK}" stroke-width="4"/>`)}
  <g style="${rk}"><line x1="180" y1="240" x2="1100" y2="240" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>
   <g style="${un(250)}">${pan(250, 400)}<g transform="translate(250 330)">${helix(0, 0, 0.8)}</g></g>
   <g style="${un(1030)}">${pan(1030, 400)}<g transform="translate(1030 400)">${tw()}</g></g></g>
  ${seed(900, 570, 0.9)}<path d="M860 610 q40 -20 80 0" stroke="${INK}" stroke-width="5" fill="none"/>${plant(1150, 635, 0.55)}
  ${pop(c(i, 1), T(250, 160, "The case for", 36, { a: "middle", w: 700, c: "#2e7d32" }), "50% 100%")}
  ${pop(c(i, 2), T(1030, 160, "The case against", 36, { a: "middle", w: 700, c: "#c62828" }), "50% 100%")}
  ${pop(c(i, 3), `<g transform="translate(640 150)"><rect x="-150" y="-40" width="300" height="64" rx="32" fill="#ffd166" stroke="${INK}" stroke-width="4"/>${T(0, 3, "Still argued", 30, { a: "middle", w: 700 })}</g>`, "50% 50%")}`);
}
// 5 ---------------------------------------------------------------
{ const i = 4, tS = wt(i, 0, 3), tD = wt(i, 1, wl(i, 1)), t44 = wt(i, 1, 2), t52 = wt(i, 1, 4);
  S.push(`<rect width="1280" height="720" fill="${BG}"/>${ground(630)}
  <rect x="60" y="70" width="780" height="430" rx="14" fill="#2f5d50" stroke="#8a5230" stroke-width="18"/>
  <text x="110" y="200" font-family="Georgia" font-size="76" fill="#f5f5f0">Protein?</text>
  <rect class="cover" style="--d:0.4s;--t:1.2s" x="100" y="120" width="400" height="110" fill="#2f5d50"/>
  <rect class="chalk" style="--d:0.4s;--t:1.2s;--w:380px" x="100" y="150" width="26" height="10" rx="4" fill="#fff"/>
  <line class="line" style="--d:${tS.toFixed(2)}s;--t:.8s" pathLength="1" x1="100" y1="170" x2="395" y2="170" stroke="#ff8a7a" stroke-width="8" stroke-linecap="round"/>
  <text x="110" y="360" font-family="Georgia" font-size="110" fill="#fff6c9" font-weight="700">DNA</text>
  <rect class="cover" style="--d:${tD.toFixed(2)}s;--t:1s" x="100" y="260" width="360" height="130" fill="#2f5d50"/>
  <rect class="chalk" style="--d:${tD.toFixed(2)}s;--t:1s;--w:340px" x="100" y="300" width="26" height="10" rx="4" fill="#fff"/>
  <g transform="translate(600 250)"><g class="pop" style="--d:${(tD + 0.9).toFixed(2)}s;--o:50% 50%"><g style="transform-box:fill-box;transform-origin:50% 50%;animation:spinx 3.4s linear infinite">${helix(0, 60, 0.9)}</g></g></g>
  ${rise(0.2, bob(martha(1000, 440, 1.5)))}<g transform="translate(920 430) rotate(-35)"><rect width="70" height="14" rx="5" fill="#fff" stroke="${INK}" stroke-width="3"/></g>
  ${pop(t52 + 0.1, virus(700, 540, 0.7), "50% 100%")}
  <line class="line" style="--d:${c(i, 1).toFixed(2)}s;--t:2s" pathLength="1" x1="240" y1="560" x2="520" y2="560" stroke="${INK}" stroke-width="5"/>
  ${[["1944", 260, t44], ["1952", 520, t52]].map(([y, x, t]) => pop(t, `<circle cx="${x}" cy="560" r="13" fill="#d63a2a" stroke="${INK}" stroke-width="4"/>${T(x, 604, y, 28, { a: "middle", w: 700 })}`, "50% 50%")).join("")}`);
}
// 6 ---------------------------------------------------------------
{ const i = 5, tA = wt(i, 1, 4), tPl = wt(i, 1, 8);
  const bz = (t) => { const p0 = [390, 520], p1 = [430, 480], p2 = [450, 480], p3 = [480, 490], u = 1 - t; return [0, 1].map((a) => u * u * u * p0[a] + 3 * u * u * t * p1[a] + 3 * u * t * t * p2[a] + t * t * t * p3[a]); };
  const dots = [0, 1, 2, 3, 4, 5].map((k) => { const [x, y] = bz(k / 6); return pop(tA + k * 0.18, `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="${INK}"/>`, "50% 50%"); }).join("");
  S.push(`<rect width="1280" height="720" fill="${BG}"/>${ground()}
  <g class="pop" style="--d:${(c(i, 1)).toFixed(2)}s;--o:50% 80%"><g style="transform-box:fill-box;transform-origin:50% 100%;animation:bob 1.1s ease-in-out infinite alternate">${seed(330, 560, 1.3)}</g></g>
  ${dots}${pop(tA + 1.2, `<polygon points="480,476 510,492 480,508" fill="${INK}"/>`, "0% 50%")}
  <g class="grow" style="--d:${tPl.toFixed(2)}s">${plant(640, 600, 1.4)}</g>
  ${rise(0.1, bob(meena(150, 360, 1.15)))}
  ${pop(c(i, 2), `<circle cx="232" cy="288" r="14" fill="#fff" stroke="${INK}" stroke-width="4"/>`, "50% 50%")}${pop(c(i, 2) + 0.25, `<circle cx="246" cy="246" r="22" fill="#fff" stroke="${INK}" stroke-width="4"/>`, "50% 50%")}
  ${pop(c(i, 2) + 0.55, `<g transform="translate(250 60)"><ellipse cx="260" cy="95" rx="270" ry="90" fill="#fff" stroke="${INK}" stroke-width="5"/>${T(260, 82, "Is the plan", 40, { a: "middle", w: 700, serif: 1 })}${T(260, 130, "the same as the plant?", 40, { a: "middle", w: 700, serif: 1 })}</g>`, "5% 100%")}
  <g class="slide" style="--d:0.3s">${phone(900, 40, 300, "app-bigq-0.png")}</g>`);
}
// 7 ---------------------------------------------------------------
{ const i = 6;
  const st = [[100, 90], [260, 200], [400, 70], [560, 160], [800, 80], [980, 190], [1150, 100], [1220, 260], [60, 330], [1120, 380], [700, 40], [200, 480], [1230, 500], [880, 300]];
  S.push(`<defs><radialGradient id="g" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#3b3a7a"/><stop offset="1" stop-color="#16162e"/></radialGradient></defs><rect width="1280" height="720" fill="url(#g)"/>
  ${st.map(([x, y], k) => fade(0.2 + k * 0.17, `<g class="tw" style="animation-delay:${(-k * 0.37).toFixed(2)}s"><circle cx="${x}" cy="${y}" r="4.5" fill="#fff6c9"/></g>`)).join("")}
  <rect x="0" y="610" width="1280" height="110" fill="#1d1d3a"/>
  ${rise(0.2, bob(meena(330, 430, 1.5)))}
  <circle cx="760" cy="330" r="230" fill="#ffd166" style="animation:moon 2.4s ease-in-out infinite alternate"/>
  ${pop(c(i, 0) + 0.2, `<g style="animation:glow 2.4s ease-in-out infinite alternate"><text x="660" y="520" font-family="Georgia" font-size="380" font-weight="700" fill="#ffd166" stroke="#fff6c9" stroke-width="3">?</text></g>`, "50% 80%")}
  <path d="M425 540 Q500 480 590 470" stroke="${INK}" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M425 540 Q500 480 590 470" stroke="${SK.b}" stroke-width="16" fill="none" stroke-linecap="round"/>
  ${fade(c(i, 1), `<text x="640" y="672" text-anchor="middle" font-family="Georgia" font-size="40" fill="#fff6c9">We hand you the question.</text>`)}`);
}
const html = (svg) => `<meta charset=utf-8><style>${CSS}.grow{opacity:0;transform-box:fill-box;transform-origin:50% 100%;animation:grow 1.6s cubic-bezier(.2,.8,.3,1) var(--d) forwards}@keyframes grow{from{opacity:1;transform:scale(.02)}to{opacity:1;transform:scale(1)}}</style><body><svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">${svg}</svg>`;
module.exports = { S: S.map(html), DUR, OFF };
if (require.main === module) { S.forEach((s, k) => fs.writeFileSync(`s${k + 1}.html`, html(s))); console.log(DUR.map((d) => d.toFixed(2)).join(" "), DUR.reduce((a, b) => a + b, 0)); }
