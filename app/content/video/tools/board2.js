const fs = require("fs");
const { chromium } = require("playwright");
const { SK, INK, person, bubble, helix, seed, plant } = require("./art.js");
const BG = "#efe3cf";
const T = (x, y, t, s = 30, o = {}) => `<text x="${x}" y="${y}" font-family="${o.serif ? "Georgia,serif" : "Arial,sans-serif"}" font-size="${s}" font-weight="${o.w || 400}" fill="${o.c || INK}" text-anchor="${o.a || "start"}">${t}</text>`;
const ground = (y = 600) => `<rect x="0" y="${y}" width="1280" height="${720 - y}" fill="#d9c7a4"/><line x1="0" y1="${y}" x2="1280" y2="${y}" stroke="${INK}" stroke-width="4"/>`;
const meena = (x, y, s) => person(x, y, s, { skin: SK.b, hair: "#1b1410", hairStyle: "plaits", cloth: "#d63a2a", cloth2: "#f2b01e" });
const martha = (x, y, s) => person(x, y, s, { skin: "#f0c9a6", hair: "#6b4a2b", hairStyle: "short", extra: "coat", cloth: "#fff" });
const paati = (x, y, s) => person(x, y, s, { skin: SK.c, hair: "#eeeeee", hairStyle: "bun", extra: "glasses", cloth: "#2e7d6b", cloth2: "#f2b01e" });
const selvi = (x, y, s) => person(x, y, s, { skin: SK.a, hair: "#2b1d16", hairStyle: "turban", cloth: "#3a6fd6", cloth2: "#f2b01e" });
const sage = (x, y, s) => person(x, y, s, { skin: SK.d, hair: "#dddddd", hairStyle: "bald", extra: "beard", cloth: "#e8892b" });
const phone = (x, y, w, img) => `<g><rect x="${x}" y="${y}" width="${w}" height="${w * 2.1}" rx="34" fill="#fff" stroke="${INK}" stroke-width="8"/><image href="${img}" x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${(w - 12) * 2.164}" preserveAspectRatio="xMidYMin slice" clip-path="inset(0 round 28px)"/></g>`;
const pan = (x, y) => `<path d="M${x - 120} ${y} Q${x} ${y + 70} ${x + 120} ${y} Z" fill="#c9a227" stroke="${INK}" stroke-width="5"/><line x1="${x - 120}" y1="${y}" x2="${x}" y2="${y - 110}" stroke="${INK}" stroke-width="4"/><line x1="${x + 120}" y1="${y}" x2="${x}" y2="${y - 110}" stroke="${INK}" stroke-width="4"/>`;
const virus = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><polygon points="-26,-30 26,-30 40,0 26,30 -26,30 -40,0" fill="#7a4fd6" stroke="${INK}" stroke-width="4"/><rect x="-8" y="30" width="16" height="30" fill="#b58be8" stroke="${INK}" stroke-width="4"/>${[-24, -8, 8, 24].map((d) => `<line x1="${d}" y1="60" x2="${d * 1.8}" y2="86" stroke="${INK}" stroke-width="4"/>`).join("")}</g>`;
const star = (x, y, r = 3) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff6c9"/>`;
const slides = [
// 1 hook
`<rect width="1280" height="720" fill="${BG}"/>${ground()}
 ${[[780, 290, "#999"], [930, 300, "#aaa"], [1080, 285, "#bbb"], [860, 430, "#b5b5b5"], [1020, 440, "#a5a5a5"]].map(([x, y, c], i) => `<g opacity=".55"><circle cx="${x}" cy="${y}" r="42" fill="${c}"/><path d="M${x - 62} ${y + 140} C${x - 62} ${y + 70} ${x - 30} ${y + 48} ${x} ${y + 48} C${x + 30} ${y + 48} ${x + 62} ${y + 70} ${x + 62} ${y + 140} Z" fill="${c}"/><text x="${x + 10}" y="${y - 52}" font-family="Georgia" font-size="46" fill="${INK}" opacity=".7">?</text></g>`).join("")}
 ${meena(330, 360, 1.7)}${bubble(120, 90, 360, 120, "Who decides what is true?", { size: 30 })}
 <rect x="470" y="545" width="190" height="26" fill="#8a5230" stroke="${INK}" stroke-width="4"/><rect x="484" y="518" width="165" height="26" fill="#3a6fd6" stroke="${INK}" stroke-width="4"/><rect x="474" y="491" width="180" height="26" fill="#2e9e6b" stroke="${INK}" stroke-width="4"/>`,
// 2 many voices
`<rect width="1280" height="720" fill="${BG}"/>${ground(610)}
 ${martha(150, 440, 1.25)}${bubble(40, 120, 170, 84, "DNA!", { size: 36 })}${T(150, 660, "Martha Chase, 1952", 22, { a: "middle", w: 700 })}
 ${paati(410, 440, 1.25)}${bubble(260, 100, 260, 100, "It runs in the blood", { size: 25 })}${T(410, 660, "Paati", 22, { a: "middle", w: 700 })}
 ${selvi(670, 440, 1.25)}<g transform="translate(560 105)"><path d="M0 0 H170 Q184 0 184 14 V92 Q184 106 170 106 H44 L18 136 L24 106 H14 Q0 106 0 92 V14 Q0 0 14 0 Z" fill="#fff" stroke="${INK}" stroke-width="4"/>${seed(92, 53, 1.1)}</g>${T(670, 660, "Selvi, a farmer", 22, { a: "middle", w: 700 })}
 ${sage(930, 440, 1.25)}${bubble(800, 100, 240, 100, "All is one", { size: 28 })}${T(930, 660, "The Upanishads", 22, { a: "middle", w: 700 })}
 ${meena(1160, 460, 1.1)}${bubble(1060, 150, 150, 80, "Why?", { size: 34 })}${T(1160, 660, "Meena, 8", 22, { a: "middle", w: 700 })}`,
// 3 the real card
`<rect width="1280" height="720" fill="${BG}"/>${ground()}
 ${paati(190, 420, 1.55)}${bubble(40, 70, 330, 110, "It runs in the blood.", { size: 30 })}
 ${meena(470, 460, 1.3)}<g transform="translate(540 270)"><text font-family="Georgia" font-size="60" fill="${INK}">?</text></g>
 ${phone(760, 40, 330, "app-true-1.png")}
 <g stroke="#d63a2a" stroke-width="7" fill="none"><rect x="788" y="352" width="272" height="72" rx="30"/></g>
 <g transform="translate(1000 400) rotate(-20)"><path d="M0 0 C-8 -26 8 -34 14 -10 L28 28 C30 52 12 66 -8 56 Z" fill="${SK.d}" stroke="${INK}" stroke-width="4"/></g>`,
// 4 both sides
`<rect width="1280" height="720" fill="${BG}"/>${ground(640)}
 <rect x="615" y="270" width="50" height="370" fill="#8a5230" stroke="${INK}" stroke-width="4"/><polygon points="560,640 720,640 640,585" fill="#8a5230" stroke="${INK}" stroke-width="4"/>
 <g transform="rotate(-3 640 270)"><line x1="180" y1="270" x2="1100" y2="270" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>${pan(250, 330)}${pan(1030, 330)}<g transform="translate(250 305)">${helix(0, -20, 0.8)}</g><g transform="translate(1030 300)">${person(-50, -34, 0.42, { skin: SK.b, hair: "#1b1410", hairStyle: "plaits", cloth: "#d63a2a" })}${person(50, -34, 0.42, { skin: SK.b, hair: "#1b1410", hairStyle: "plaits", cloth: "#3a6fd6" })}</g></g>
 ${seed(900, 560, 0.9)}<path d="M860 600 q40 -20 80 0" stroke="${INK}" stroke-width="5" fill="none"/>${plant(1150, 625, 0.55)}
 ${T(250, 160, "The case for", 34, { a: "middle", w: 700, c: "#2e7d32" })}${T(1030, 160, "The case against", 34, { a: "middle", w: 700, c: "#c62828" })}
 <g transform="translate(640 120)"><rect x="-150" y="-40" width="300" height="64" rx="32" fill="#ffd166" stroke="${INK}" stroke-width="4"/>${T(0, 3, "Still argued", 30, { a: "middle", w: 700 })}</g>`,
// 5 rejected
`<rect width="1280" height="720" fill="${BG}"/>${ground(630)}
 <rect x="60" y="70" width="780" height="430" rx="14" fill="#2f5d50" stroke="#8a5230" stroke-width="18"/>
 <text x="110" y="200" font-family="Georgia" font-size="76" fill="#f5f5f0">Protein?</text><line x1="100" y1="170" x2="470" y2="170" stroke="#ff8a7a" stroke-width="8"/>
 <text x="110" y="360" font-family="Georgia" font-size="110" fill="#fff6c9" font-weight="700">DNA</text>
 <g transform="translate(600 250)">${helix(0, 60, 0.9)}</g>
 ${martha(1000, 440, 1.5)}<g transform="translate(920 430) rotate(-35)"><rect width="70" height="14" rx="5" fill="#fff" stroke="${INK}" stroke-width="3"/></g>
 ${virus(700, 540, 0.7)}
 <g>${[["1944", 160], ["1952", 420]].map(([y, x]) => `<circle cx="${x + 100}" cy="560" r="13" fill="#d63a2a" stroke="${INK}" stroke-width="4"/>${T(x + 100, 600, y, 28, { a: "middle", w: 700 })}`).join("")}<line x1="240" y1="560" x2="520" y2="560" stroke="${INK}" stroke-width="5"/></g>`,
// 6 big think
`<rect width="1280" height="720" fill="${BG}"/>${ground()}
 ${seed(330, 560, 1.3)}<path d="M390 520 C430 480 450 480 480 490" stroke="${INK}" stroke-width="6" fill="none" stroke-dasharray="14 10"/><polygon points="480,476 510,492 480,508" fill="${INK}"/>${plant(640, 600, 1.4)}
 ${meena(150, 360, 1.15)}
 <g transform="translate(250 60)"><ellipse cx="260" cy="95" rx="270" ry="90" fill="#fff" stroke="${INK}" stroke-width="5"/>${T(260, 82, "Is the plan", 40, { a: "middle", w: 700, serif: 1 })}${T(260, 130, "the same as the plant?", 40, { a: "middle", w: 700, serif: 1 })}<circle cx="-18" cy="228" r="14" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="-4" cy="186" r="22" fill="#fff" stroke="${INK}" stroke-width="4"/></g>
 ${phone(900, 40, 300, "app-bigq-0.png")}`,
// 7 close (night sky)
`<defs><radialGradient id="g" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#3b3a7a"/><stop offset="1" stop-color="#16162e"/></radialGradient></defs><rect width="1280" height="720" fill="url(#g)"/>
 ${[[100, 90], [260, 200], [400, 70], [560, 160], [800, 80], [980, 190], [1150, 100], [1220, 260], [60, 330], [1120, 380], [700, 40]].map(([x, y]) => star(x, y, 4)).join("")}
 <rect x="0" y="610" width="1280" height="110" fill="#1d1d3a"/>
 ${meena(430, 430, 1.5)}
 <circle cx="760" cy="330" r="230" fill="#ffd166" opacity=".1"/><g transform="translate(660 520)"><text font-family="Georgia" font-size="380" font-weight="700" fill="#ffd166" stroke="#fff6c9" stroke-width="3">?</text></g><text x="640" y="670" text-anchor="middle" font-family="Georgia" font-size="40" fill="#fff6c9">We hand you the question.</text>
 <path d="M560 470 Q590 400 640 440" stroke="${INK}" stroke-width="12" fill="none"/>`,
];
(async () => {
  const b = await chromium.launch(), p = await (await b.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
  for (let i = 0; i < slides.length; i++) {
    fs.writeFileSync(`/tmp/sh/persp/v${i + 1}.html`, `<meta charset=utf-8><body style="margin:0"><svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">${slides[i]}</svg>`);
    await p.goto(`file:///tmp/sh/persp/v${i + 1}.html`); await p.waitForTimeout(250);
    await p.screenshot({ path: `/tmp/sh/persp/v${i + 1}.png` });
  }
  await b.close();
})();
