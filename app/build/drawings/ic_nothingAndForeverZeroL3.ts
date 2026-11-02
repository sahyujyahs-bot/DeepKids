import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, plate, bowl, seed, glass, write, cards } from "./flatKit";

// sci.nothing-and-forever.zero.L3 · picture cards (intro, summary, experiments, activities, project,
// challenges, terms, explanations). Same child and grown-up as the set-up cards.

const NONE = "rgba(0,0,0,0)";
const wlen = (t: string, h: number) => [...t].reduce((a, ch) => a + (ch === " " ? h * 0.35 : h * (ch === "m" ? 0.95 : 0.8)), 0) - h * 0.2;
const cw = (c: Ctx, t: string, cx: number, y: number, h: number, col: string = INK, w = 6) => write(c, t, cx - wlen(t, h) / 2, y, h, col, w);
const eq = (c: Ctx, cx: number, cy: number, h: number, col: string = INK, w = 8) => { line(c, [[cx - h * 0.3, cy - h * 0.12], [cx + h * 0.3, cy - h * 0.12]], w, col); line(c, [[cx - h * 0.3, cy + h * 0.12], [cx + h * 0.3, cy + h * 0.12]], w, col); };
const times = (c: Ctx, cx: number, cy: number, h: number, col: string = INK, w = 8) => { line(c, [[cx - h * 0.22, cy - h * 0.22], [cx + h * 0.22, cy + h * 0.22]], w, col); line(c, [[cx + h * 0.22, cy - h * 0.22], [cx - h * 0.22, cy + h * 0.22]], w, col); };
const divs = (c: Ctx, cx: number, cy: number, h: number, col: string = INK, w = 8) => { line(c, [[cx - h * 0.3, cy], [cx + h * 0.3, cy]], w, col); for (const s of [-1, 1]) { c.beginPath(); c.arc(cx, cy + s * h * 0.26, w * 0.75, 0, Math.PI * 2); c.fillStyle = col; c.fill(); } };
const plus = (c: Ctx, cx: number, cy: number, h: number, col: string = INK, w = 8) => { line(c, [[cx - h * 0.3, cy], [cx + h * 0.3, cy]], w, col); line(c, [[cx, cy - h * 0.3], [cx, cy + h * 0.3]], w, col); };
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 14, y + h + 10, w * 0.52, 22);
  shape(c, () => rrect(c, x, y, w, h, 10), COL.paper);
  shade(c, () => rrect(c, x, y, w, h, 10), COL.cloth, 16, 0, 0.9);
  shape(c, () => rrect(c, x, y, w, h, 10), NONE);
};
// a dashed outline (an empty place)
const dashBox = (c: Ctx, x: number, y: number, w: number, h: number, col: string = COL.greyDk, lw = 6) => {
  const seg = (x1: number, y1: number, x2: number, y2: number) => { const n = Math.floor(Math.hypot(x2 - x1, y2 - y1) / 28); for (let i = 0; i < n; i++) { const a = (i * 2) / (n * 2 - 1), b = (i * 2 + 1) / (n * 2 - 1); line(c, [[x1 + (x2 - x1) * a, y1 + (y2 - y1) * a], [x1 + (x2 - x1) * b, y1 + (y2 - y1) * b]], lw, col); } };
  seg(x, y, x + w, y); seg(x + w, y, x + w, y + h); seg(x + w, y + h, x, y + h); seg(x, y + h, x, y);
};
const qmark = (c: Ctx, x: number, y: number, h: number, col: string = INK, w = 8) => {
  c.beginPath(); c.arc(x, y + h * 0.25, h * 0.25, Math.PI * 1.1, Math.PI * 2.4); c.quadraticCurveTo(x + h * 0.28, y + h * 0.58, x, y + h * 0.68); c.lineTo(x, y + h * 0.78);
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.arc(x, y + h * 0.97, w * 0.7, 0, Math.PI * 2); c.fillStyle = col; c.fill();
};
const pencil = (c: Ctx, x1: number, y1: number, x2: number, y2: number) => {
  const an = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(an), ny = Math.cos(an), tl = 46, bx = x2 - Math.cos(an) * tl, by = y2 - Math.sin(an) * tl, w = 15;
  shape(c, () => polyP(c, [[x1 + nx * w, y1 + ny * w], [bx + nx * w, by + ny * w], [bx - nx * w, by - ny * w], [x1 - nx * w, y1 - ny * w]]), COL.yellow, 6);
  shape(c, () => polyP(c, [[bx + nx * w, by + ny * w], [x2, y2], [bx - nx * w, by - ny * w]]), "#f1cfa0", 5);
  shape(c, () => polyP(c, [[x2 - Math.cos(an) * 12 + nx * 4, y2 - Math.sin(an) * 12 + ny * 4], [x2, y2], [x2 - Math.cos(an) * 12 - nx * 4, y2 - Math.sin(an) * 12 - ny * 4]]), INK, 0);
  shape(c, () => polyP(c, [[x1 + nx * w, y1 + ny * w], [x1 - nx * w, y1 - ny * w], [x1 - Math.cos(an) * 26 - nx * w, y1 - Math.sin(an) * 26 - ny * w], [x1 - Math.cos(an) * 26 + nx * w, y1 - Math.sin(an) * 26 + ny * w]]), COL.pink, 6);
};
const idli = (c: Ctx, x: number, y: number, r: number) => {
  const p = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r, y - r * 0.9, x + r, y - r * 0.9, x + r, y); c.quadraticCurveTo(x, y + r * 0.35, x - r, y); c.closePath(); };
  shape(c, p, "#fbf7ec"); shade(c, p, "#e6dcc4", r * 0.35, r * 0.1); shine(c, [[x - r * 0.55, y - r * 0.2], [x - r * 0.3, y - r * 0.45]], 7);
};
const rasgulla = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), "#fff6e0"); shade(c, () => ell(c, x, y, r, r), "#ecd9b0", r * 0.3, r * 0.3); shine(c, [[x - r * 0.5, y - r * 0.2], [x - r * 0.25, y - r * 0.5]], 7);
};
const bean = (c: Ctx, x: number, y: number, r: number, rot: number) => seed(c, x, y, r, rot, false, "#b04a3c", "#7a2b25");
const star = (c: Ctx, x: number, y: number, r: number, col: string = COL.yellow) => shape(c, () => { const p: number[][] = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; p.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } polyP(c, p); }, col, Math.max(2, r * 0.14));
const check = (c: Ctx, x: number, y: number, s: number, col: string = COL.tealDk) => line(c, [[x - s, y], [x - s * 0.3, y + s * 0.7], [x + s, y - s * 0.8]], 12, col);
const cross = (c: Ctx, x: number, y: number, s: number, col: string = RED) => { line(c, [[x - s, y - s], [x + s, y + s]], 12, col); line(c, [[x + s, y - s], [x - s, y + s]], 12, col); };
// a wooden ruler: left edge at x, zero mark at x+gap, one cm every cm px, n marks
const ruler = (c: Ctx, x: number, y: number, len: number, hh: number, gap: number, cm: number, n: number, lab = 40) => {
  shadow(c, x + len / 2 + 10, y + hh + 12, len / 2, 16);
  shape(c, () => rrect(c, x, y, len, hh, 6), COL.wood);
  shape(c, () => rrect(c, x, y, gap, hh, 0), "#ffe27a", 0);
  shape(c, () => rrect(c, x, y, len, hh, 6), NONE);
  for (let k = 0; k <= n; k++) { const xx = x + gap + k * cm; line(c, [[xx, y], [xx, y + hh * 0.42]], 5); write(c, String(k), xx - 12, y + hh * 0.5, lab, INK, 5); for (let m = 1; m < 2 && k < n; m++) line(c, [[xx + cm / 2, y], [xx + cm / 2, y + hh * 0.22]], 4); }
};

// 0 intro: a chit with 52 and a gap; the reader puzzled, a girl with a pencil
const f0 = (c: Ctx) => {
  ground(c);
  paper(c, 170, 80, 740, 380);
  write(c, "52", 250, 150, 220, INK, 16);
  dashBox(c, 610, 150, 170, 220);
  pencil(c, 330, 600, 600, 420);
  shadow(c, 540, 1010, 460, 24);
  person(c, 200, 1010, 470, { armR: [-0.9, -1.0] });
  person(c, 880, 1010, 500, { adult: true });
  qmark(c, 990, 470, 100, RED, 10);
};
// 1 summary: two chits, 52 with a gap and 520, an empty plate behind
const f1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 270, 260, 90);
  paper(c, 70, 440, 440, 340); paper(c, 570, 440, 440, 340);
  write(c, "52", 105, 500, 160, INK, 13); dashBox(c, 365, 500, 110, 160);
  write(c, "520", 595, 500, 160, INK, 13);
  qmark(c, 290, 820, 130, RED, 11);
  check(c, 790, 900, 55);
};
// 2 flow.e1: chits with a blank space and the same chits with a 0
const f2 = (c: Ctx) => {
  ground(c);
  const nums = ["9", "13", "62"];
  nums.forEach((t, i) => {
    const x = 60 + i * 330;
    paper(c, x, 90, 290, 260); paper(c, x, 460, 290, 260);
    write(c, t, x + 40, 150, 90, INK, 9); dashBox(c, x + 40 + wlen(t, 90) + 24, 150, 56, 90);
    write(c, t + "0", x + 40, 520, 90, INK, 9);
  });
  arrow(c, [[540, 380], [540, 440]], RED, 8);
  person(c, 250, 1050, 290, { adult: true }); qmark(c, 400, 800, 80, RED, 9);
  pencil(c, 800, 960, 960, 800);
};
// 3 flow.e2: pencil at the 0 mark; from the edge reads too long, from 0 is right
const f3 = (c: Ctx) => {
  ground(c);
  ruler(c, 60, 470, 960, 150, 70, 110, 8, 44);
  shape(c, () => rrect(c, 130, 360, 770, 62, 12), COL.orange, 6);
  shape(c, () => polyP(c, [[900, 360], [980, 391], [900, 422]]), "#f1cfa0", 6);
  line(c, [[130, 365], [130, 640]], 6, RED);
  arrow(c, [[60, 720], [895, 720]], RED, 10); cross(c, 970, 720, 24);
  arrow(c, [[130, 840], [895, 840]], COL.tealDk, 10); check(c, 970, 840, 30);
};
// 4 flow.a1: zero hunt: a child with an empty plate and an empty katori, a notebook with 0
const f4 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 0, 640, D, 440, 0), COL.wood, 0); line(c, [[0, 640], [D, 640]], 8);
  plate(c, 640, 800, 260, 100); bowl(c, 270, 780, 110);
  paper(c, 740, 330, 270, 330); cw(c, "0", 875, 400, 190, INK, 16);
  person(c, 260, 640, 520, { armR: [Math.PI * 0.4, Math.PI * 0.2] });
};
// 5 flow.a3: 4 beans + nothing = 4 beans; 3 x nothing = nothing
const f5 = (c: Ctx) => {
  ground(c);
  const beansOn = (x: number, y: number, n: number) => { const r = rnd(3 + n); for (let i = 0; i < n; i++) bean(c, x - 40 + (i % 2) * 80 + r() * 6, y - 28 + Math.floor(i / 2) * 45, 28, r() * 3); };
  plate(c, 150, 230, 130, 62); beansOn(150, 245, 4); plus(c, 345, 230, 100); plate(c, 540, 230, 130, 62); eq(c, 735, 230, 100); plate(c, 930, 230, 130, 62); beansOn(930, 245, 4);
  line(c, [[80, 420], [1000, 420]], 5, COL.grey);
  cw(c, "3", 300, 520, 170, INK, 15); times(c, 440, 600, 150); cw(c, "0", 590, 520, 170, INK, 15); eq(c, 740, 600, 150); cw(c, "0", 890, 520, 170, INK, 15);
  for (let i = 0; i < 3; i++) plate(c, 240 + i * 300, 880, 130, 62);
};
// 6 flow.a4: a number with a zero, and the Roman number with no zero
const f6 = (c: Ctx) => {
  ground(c);
  paper(c, 50, 240, 440, 520); paper(c, 590, 240, 440, 520);
  cw(c, "30", 270, 350, 260, INK, 20);
  c.beginPath(); ell(c, 374, 480, 100, 150); c.strokeStyle = RED; c.lineWidth = 10; c.stroke();
  for (let i = 0; i < 3; i++) { const x = 670 + i * 110; line(c, [[x, 400], [x + 80, 600]], 22); line(c, [[x + 80, 400], [x, 600]], 22); }
  eq(c, 540, 500, 70, RED, 10);
};
// 7 flow.a5: tiles -3..3, a coin walking left of zero, a child
const f7 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 0, 620, D, 460, 0), "#e7d9bf", 0); line(c, [[0, 620], [D, 620]], 8);
  [-3, -2, -1, 0, 1, 2, 3].forEach((n, i) => {
    const x = 40 + i * 142;
    shape(c, () => polyP(c, [[x + 24, 700], [x + 134, 700], [x + 142, 870], [x, 870]]), n === 0 ? COL.yellow : COL.paper, 6);
    cw(c, String(n), x + 71, 718, 62, INK, 8);
  });
  shape(c, () => ell(c, 466, 835, 44, 15), COL.steelDk, 0);
  shape(c, () => ell(c, 466, 826, 44, 15), COL.yellow, 6);
  arrow(c, [[690, 940], [330, 940]], RED, 12);
  person(c, 900, 640, 470, {});
};
// 8 flow.p1: a paper strip: a time line with three dates and a small 0 hopping along
const f8 = (c: Ctx) => {
  ground(c);
  paper(c, 40, 200, 1000, 520);
  line(c, [[110, 480], [980, 480]], 14, INK);
  const pts: [number, string][] = [[200, "628"], [540, "825"], [880, "1202"]];
  pts.forEach(([x, t]) => { shape(c, () => ell(c, x, 480, 30, 30), COL.yellow, 7); cw(c, t, x, 330, 90, INK, 9); });
  shape(c, () => ell(c, 370, 600, 42, 42), COL.paper, 7); cw(c, "0", 370, 574, 56, INK, 7);
  arrow(c, [[230, 545], [320, 590]], RED, 8); arrow(c, [[420, 590], [510, 545]], RED, 8);
  person(c, 250, 1060, 320, {});
  pencil(c, 500, 900, 780, 680);
};
// 9 challenge c1: a number written in boxes so no zero can be missed
const f9 = (c: Ctx) => {
  ground(c);
  paper(c, 60, 130, 960, 520);
  const ds = ["1", "0", "0", "5"];
  ds.forEach((t, i) => { const x = 110 + i * 220; shape(c, () => rrect(c, x, 220, 190, 330, 18), WHITE, 8); cw(c, t, x + 95, 270, 220, i === 1 || i === 2 ? RED : INK, 18); });
  person(c, 260, 1050, 360, {}); person(c, 800, 1050, 380, { adult: true });
  check(c, 540, 800, 55);
};
// 10 challenge c2: a shoebox-lid abacus with 4 rods: 1, 0, 0, 5
const f10 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 470, 34);
  shape(c, () => rrect(c, 80, 190, 920, 740, 22), COL.brown, 8);
  shape(c, () => rrect(c, 110, 220, 860, 680, 14), "#c18a55", 0);
  const nums = [1, 0, 0, 5];
  nums.forEach((n, i) => {
    const x = 225 + i * 210;
    line(c, [[x, 250], [x, 770]], 26, INK); line(c, [[x, 250], [x, 770]], 12, COL.wood);
    for (let b = 0; b < n; b++) shape(c, () => ell(c, x, 725 - b * 74, 52, 32), [COL.red, COL.teal, COL.purple, COL.orange, COL.blue][b % 5], 6);
    cw(c, String(n), x, 800, 80, WHITE, 9);
  });
};
// 11 term.0: an empty plate and a plate with three idlis
const f11 = (c: Ctx) => {
  ground(c);
  plate(c, 270, 700, 240, 110); plate(c, 810, 700, 240, 110);
  idli(c, 810, 650, 78); idli(c, 735, 725, 78); idli(c, 885, 725, 78);
  cw(c, "0", 270, 180, 280, INK, 22); cw(c, "3", 810, 180, 280, INK, 22);
};
// 12 term.2: 520 and the blocks each digit is worth
const f12 = (c: Ctx) => {
  ground(c);
  const xs = [210, 540, 870];
  ["5", "2", "0"].forEach((t, i) => cw(c, t, xs[i], 80, 240, INK, 20));
  xs.forEach((x) => arrow(c, [[x, 360], [x, 440]], RED, 9));
  for (let i = 0; i < 5; i++) { const px = 210 + (i < 3 ? (i - 1) * 100 : (i - 3.5) * 100), py = i < 3 ? 520 : 630; shape(c, () => rrect(c, px - 45, py - 45, 90, 90, 8), COL.blue, 6); }
  for (let i = 0; i < 2; i++) shape(c, () => rrect(c, 490 + i * 100, 480, 60, 360, 10), COL.teal, 6);
  dashBox(c, 770, 480, 200, 200);
};
// 13 term.3: 205, the middle 0 circled, an arrow to an empty katori
const f13 = (c: Ctx) => {
  ground(c);
  cw(c, "205", 540, 100, 270, INK, 22);
  c.beginPath(); ell(c, 540, 235, 98, 165); c.strokeStyle = RED; c.lineWidth = 12; c.stroke();
  arrow(c, [[540, 440], [540, 580]], RED, 12);
  bowl(c, 540, 760, 200);
};
// 14 term.5: Brahmagupta at his desk by lamplight, the stars in the window
const f14 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 90, 60, 340, 400, 14), "#243064", 8);
  [[170, 140], [300, 120], [370, 220], [200, 280], [320, 350], [140, 390]].forEach(([x, y], i) => star(c, x, y, i % 2 ? 18 : 24));
  line(c, [[260, 60], [260, 460]], 8); line(c, [[90, 260], [430, 260]], 8);
  // desk
  shadow(c, 420, 940, 440, 26);
  shape(c, () => rrect(c, 90, 770, 560, 60, 10), COL.woodDk, 6);
  shape(c, () => rrect(c, 130, 830, 60, 100, 6), COL.brown, 6); shape(c, () => rrect(c, 550, 830, 60, 100, 6), COL.brown, 6);
  // palm leaf with numbers
  shape(c, () => polyP(c, [[230, 730], [610, 730], [630, 770], [210, 770]]), "#d9c98a", 6);
  write(c, "0", 280, 690, 0.1);
  // diya
  shape(c, () => { c.moveTo(110, 740); c.quadraticCurveTo(150, 790, 210, 740); c.closePath(); }, COL.orange, 6);
  shape(c, () => { c.moveTo(160, 730); c.quadraticCurveTo(130, 690, 160, 650); c.quadraticCurveTo(190, 690, 160, 730); }, COL.yellow, 5);
  // the man, seated
  shape(c, () => ell(c, 770, 880, 250, 80), "#ffffff", 7);
  shape(c, () => rrect(c, 620, 520, 300, 380, 60), "#ffffff", 7);
  shade(c, () => rrect(c, 620, 520, 300, 380, 60), COL.grey, 40, 0, 0.55);
  line(c, [[640, 560], [880, 760]], 36, COL.cloth); line(c, [[640, 560], [880, 760]], 36, NONE);
  shape(c, () => ell(c, 770, 410, 100, 108), SKIN.adult, 7);
  shape(c, () => { c.moveTo(668, 400); c.bezierCurveTo(660, 300, 880, 300, 872, 400); c.quadraticCurveTo(770, 340, 668, 400); c.closePath(); }, CLOTH.hair, 6);
  shape(c, () => ell(c, 770, 300, 40, 34), CLOTH.hair, 6);
  shape(c, () => ell(c, 735, 420, 9, 12), INK, 0); shape(c, () => ell(c, 805, 420, 9, 12), INK, 0);
  line(c, [[740, 470], [770, 480], [800, 470]], 7, CLOTH.hair);
  // arm to the leaf
  line(c, [[680, 600], [600, 700], [470, 730]], 52, INK); line(c, [[680, 600], [600, 700], [470, 730]], 38, "#ffffff");
  shape(c, () => ell(c, 450, 728, 30, 26), SKIN.adult, 6);
  line(c, [[430, 735], [350, 715]], 8, INK);
};
// 15 term.6: 12 rasgullas shared on three plates, 4 each
const f15 = (c: Ctx) => {
  ground(c);
  cw(c, "12", 280, 70, 150, INK, 13); divs(c, 540, 145, 130); cw(c, "3", 800, 70, 150, INK, 13);
  [190, 540, 890].forEach((x) => {
    plate(c, x, 560, 160, 90);
    rasgulla(c, x - 45, 535, 42); rasgulla(c, x + 45, 535, 42); rasgulla(c, x - 45, 595, 42); rasgulla(c, x + 45, 595, 42);
    arrow(c, [[x, 720], [x, 780]], RED, 8); cw(c, "4", x, 800, 130, INK, 12);
  });
};
// 16 term.7: a phone calculator: 6 ÷ 0 and a warning
const f16 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1010, 300, 24);
  shape(c, () => rrect(c, 250, 40, 580, 960, 60), "#3a3540", 8);
  shape(c, () => rrect(c, 285, 90, 510, 280, 24), "#c9f06b", 6);
  cw(c, "6", 470, 120, 90, INK, 9); divs(c, 560, 165, 70); cw(c, "0", 650, 120, 90, INK, 9);
  shape(c, () => polyP(c, [[540, 250], [610, 355], [470, 355]]), RED, 7); line(c, [[540, 280], [540, 322]], 8, WHITE);
  c.beginPath(); c.arc(540, 340, 5, 0, Math.PI * 2); c.fillStyle = WHITE; c.fill();
  for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) shape(c, () => rrect(c, 300 + k * 170, 420 + r * 135, 140, 105, 22), r === 0 ? COL.steelDk : COL.steel, 6);
};
// 17 term.8: a number line from -3 to 5, zero in a bold circle
const f17 = (c: Ctx) => {
  ground(c);
  line(c, [[40, 540], [1040, 540]], 12); line(c, [[1000, 500], [1040, 540], [1000, 580]], 12);
  for (let n = -3; n <= 5; n++) {
    const x = 110 + (n + 3) * 108;
    line(c, [[x, 515], [x, 565]], 8);
    cw(c, String(n), x, 600, n === 0 ? 60 : 52, n === 0 ? RED : INK, n === 0 ? 9 : 6);
  }
  c.beginPath(); ell(c, 434, 540, 62, 62); c.strokeStyle = RED; c.lineWidth = 14; c.stroke();
  arrow(c, [[434, 330], [434, 450]], RED, 10);
};
// 18 term.9: a lift panel with -2 -1 0 1 2 and a number line beside it
const f18 = (c: Ctx) => {
  ground(c);
  shadow(c, 340, 1030, 220, 20);
  shape(c, () => rrect(c, 130, 70, 420, 950, 40), COL.steelDk, 8);
  shape(c, () => rrect(c, 160, 100, 360, 890, 24), COL.steel, 0);
  [2, 1, 0, -1, -2].forEach((n, i) => {
    const y = 140 + i * 165;
    shape(c, () => ell(c, 340, y + 55, 70, 70), n === 0 ? COL.yellow : n < 0 ? COL.blue : COL.paper, 7);
    cw(c, String(n), 340, y + 28, 56, n < 0 ? WHITE : INK, 7);
  });
  line(c, [[810, 140], [810, 960]], 12); line(c, [[770, 180], [810, 140], [850, 180]], 12);
  [2, 1, 0, -1, -2].forEach((n, i) => { const y = 195 + i * 165; line(c, [[775, y], [845, y]], 8); write(c, String(n), 880, y - 28, 56, n < 0 ? COL.blueDk : INK, 7); });
  c.beginPath(); ell(c, 810, 525, 42, 42); c.strokeStyle = RED; c.lineWidth = 10; c.stroke();
  arrow(c, [[700, 560], [700, 830]], RED, 10);
};
// 19 term.10: the left end of a ruler, the yellow gap before 0
const f19 = (c: Ctx) => {
  ground(c);
  ruler(c, -20, 330, 1100, 330, 190, 220, 4, 110);
  arrow(c, [[85, 160], [85, 300]], RED, 14);
};
// 20 expl.0: a farmer reads an empty rain gauge: 0 mm
const f20 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 0, 760, D, 320, 0), COL.soil, 0); line(c, [[0, 760], [D, 760]], 8);
  for (let i = 0; i < 6; i++) line(c, [[80 + i * 190, 880 + (i % 2) * 40], [130 + i * 190, 920 + (i % 2) * 40], [180 + i * 190, 890 + (i % 2) * 40]], 6, COL.soilDk);
  shape(c, () => ell(c, 900, 130, 70, 70), COL.yellow, 7);
  shadow(c, 760, 770, 130, 20);
  shape(c, () => rrect(c, 690, 250, 150, 500, 24), COL.glass, 7);
  for (let i = 0; i <= 7; i++) line(c, [[700, 320 + i * 55], [i % 2 ? 745 : 770, 320 + i * 55]], 5, COL.glassEdge);
  shine(c, [[710, 290], [710, 700]], 9);
  line(c, [[740, 750], [740, 790]], 0);
  person(c, 330, 860, 520, { adult: true, armR: [-0.3, -0.1] });
  shape(c, () => rrect(c, 90, 90, 380, 170, 60), WHITE, 7); shape(c, () => polyP(c, [[310, 250], [350, 330], [380, 250]]), WHITE, 7); shape(c, () => rrect(c, 300, 244, 90, 14), WHITE, 0);
  write(c, "0 mm", 130, 130, 90, INK, 9);
};
// 21 expl.1: three katoris with 2, none, 5 beans; 205
const f21 = (c: Ctx) => {
  ground(c);
  const xs = [190, 540, 890], lab = ["100", "10", "1"], cnt = [2, 0, 5];
  xs.forEach((x, i) => {
    cw(c, lab[i], x, 90, 90, COL.greyDk, 8);
    bowl(c, x, 520, 140);
    const r = rnd(20 + i);
    for (let k = 0; k < cnt[i]; k++) bean(c, x - 70 + (k % 3) * 70 + r() * 8, 480 + Math.floor(k / 3) * 50, 30, r() * 3);
    cw(c, String(cnt[i]), x, 640, 130, i === 1 ? RED : INK, 13);
  });
  c.beginPath(); ell(c, 540, 700, 70, 120); c.strokeStyle = RED; c.lineWidth = 8; c.stroke();
  cw(c, "205", 540, 850, 160, INK, 14);
};
// 22 expl.2: a clay tablet with wedge marks and two slanted marks in the gap
const f22 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 880, 480, 36);
  shape(c, () => rrect(c, 80, 190, 920, 650, 90), "#c98d5a", 8);
  shade(c, () => rrect(c, 80, 190, 920, 650, 90), "#9c6338", 30, 20, 0.5);
  // a wedge: a small head and a long tail
  const wedge = (x: number, y: number) => { shape(c, () => polyP(c, [[x - 34, y - 90], [x + 34, y - 90], [x + 34, y - 40], [x + 8, y + 100], [x - 8, y + 100], [x - 34, y - 40]]), "#a56a40", 5); };
  [250, 340, 430].forEach((x) => wedge(x, 440));
  [700, 790].forEach((x) => wedge(x, 440));
  [535, 600].forEach((x) => { shape(c, () => polyP(c, [[x - 12, 360], [x + 38, 360], [x + 6, 520], [x - 18, 520]]), "#8a5430", 5); });
  c.beginPath(); ell(c, 575, 440, 90, 140); c.strokeStyle = RED; c.lineWidth = 10; c.stroke();
};
// 23 expl.4: chalk on a slate: 4 x 0 = 0; four empty plates
const f23 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 90, 40, 900, 330, 20), "#2f4a45", 0);
  shape(c, () => rrect(c, 90, 40, 900, 330, 20), NONE, 0);
  shape(c, () => rrect(c, 90, 40, 900, 330, 20), COL.woodDk, 0);
  shape(c, () => rrect(c, 110, 60, 860, 290, 10), "#2f4a45", 6);
  cw(c, "4", 230, 130, 150, WHITE, 14); times(c, 365, 205, 140, WHITE, 14); cw(c, "0", 500, 130, 150, WHITE, 14); eq(c, 650, 205, 140, WHITE, 14); cw(c, "0", 800, 130, 150, WHITE, 14);
  plate(c, 300, 560, 200, 82); plate(c, 780, 560, 200, 82); plate(c, 300, 810, 200, 82); plate(c, 780, 810, 200, 82);
};
// 24 expl.5: 12 beans; a long row of empty katoris; the heap never gets smaller
const f24 = (c: Ctx) => {
  ground(c);
  cw(c, "12", 260, 60, 130, INK, 12); divs(c, 540, 125, 110); cw(c, "0", 650, 60, 130, INK, 12);
  plate(c, 200, 740, 170, 80);
  const r = rnd(11); const rows = [[110, 5], [200, 4], [290, 3]];
  let k = 0; rows.forEach(([x, n], ri) => { for (let i = 0; i < n; i++) { bean(c, 200 - (n - 1) * 30 + i * 60, 760 - ri * 40, 29, r() * 3); k++; } });
  [[470, 90], [620, 76], [750, 62], [850, 50], [930, 40]].forEach(([x, rr]) => bowl(c, x, 740, rr));
  [985, 1010, 1035].forEach((x) => { c.beginPath(); c.arc(x, 740, 6, 0, Math.PI * 2); c.fillStyle = INK; c.fill(); });
  arrow(c, [[400, 520], [1030, 520]], RED, 12);
};
// 25 expl.6: three starting points: ruler 0, scale 0 g with an empty bowl, thermometer at 0
const f25 = (c: Ctx) => {
  ground(c);
  [30, 375, 720].forEach((x) => shape(c, () => rrect(c, x, 150, 330, 780, 30), COL.cloth, 6));
  // ruler end + pencil at 0
  ruler(c, 45, 470, 300, 130, 40, 82, 3, 34);
  pencil(c, 85, 400, 300, 400);
  // scale with empty bowl showing 0 g
  shape(c, () => polyP(c, [[430, 600], [660, 600], [690, 700], [400, 700]]), COL.teal);
  shape(c, () => polyP(c, [[400, 700], [690, 700], [690, 780], [400, 780]]), COL.tealDk);
  shape(c, () => rrect(c, 470, 715, 150, 52, 6), "#22303a", 5); write(c, "0 g", 500, 722, 34, "#c9f06b", 6);
  bowl(c, 545, 575, 105);
  // thermometer in a glass of ice water: 0 mark
  glass(c, 885, 840, 230, 330, 0.7);
  [[850, 720], [920, 740], [880, 780]].forEach(([x, y], i) => shape(c, () => rrect(c, x - 28, y - 28, 56, 56, 10), "#ffffff", 5));
  shape(c, () => rrect(c, 868, 210, 34, 500, 17), WHITE, 6); shape(c, () => rrect(c, 878, 480, 14, 230, 7), RED, 0);
  line(c, [[915, 480], [945, 480]], 6); write(c, "0", 955, 455, 50, INK, 6);
};
// 26 expl.8: dark space between two galaxies; one cube holds just a dot or two of atoms
const f26 = (c: Ctx) => {
  ground(c, "#141a3a");
  const r = rnd(5); for (let i = 0; i < 45; i++) { c.beginPath(); c.arc(r() * D, r() * D, 3 + r() * 4, 0, Math.PI * 2); c.fillStyle = "rgba(255,255,255,0.7)"; c.fill(); }
  const gal = (x: number, y: number, rx: number, rot: number) => {
    shape(c, () => ell(c, x, y, rx, rx * 0.38, rot), "#f4e6b8", 6);
    shape(c, () => ell(c, x, y, rx * 0.6, rx * 0.2, rot), COL.yellow, 0);
    c.save(); c.translate(x, y); c.rotate(rot);
    for (let a = 0; a < 2; a++) { c.beginPath(); for (let t = 0; t <= 1; t += 0.05) { const an = t * 3.2 + a * Math.PI, rr = t * rx * 0.95; c.lineTo(Math.cos(an) * rr, Math.sin(an) * rr * 0.38); } c.strokeStyle = "#8b6cc9"; c.lineWidth = 5; c.stroke(); }
    c.restore();
  };
  gal(180, 240, 150, -0.3); gal(900, 830, 150, 0.2);
  // a small cube, seen in outline, holding one dot
  const cx = 540, cy = 540, s = 200;
  shape(c, () => polyP(c, [[cx - s / 2, cy - s / 2 + 50], [cx + s / 2, cy - s / 2 + 50], [cx + s / 2, cy + s / 2 + 50], [cx - s / 2, cy + s / 2 + 50]]), "rgba(214,236,250,0.18)", 7);
  shape(c, () => polyP(c, [[cx - s / 2 + 60, cy - s / 2 - 10], [cx + s / 2 + 60, cy - s / 2 - 10], [cx + s / 2 + 60, cy + s / 2 - 10], [cx - s / 2 + 60, cy + s / 2 - 10]]), "rgba(214,236,250,0.12)", 5);
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => line(c, [[cx + a * s / 2, cy + b * s / 2 + 50], [cx + a * s / 2 + 60, cy + b * s / 2 - 10]], 5, INK));
  shape(c, () => ell(c, cx + 20, cy + 70, 12, 12), COL.yellow, 4);
};
// 27 expl.9: a honeybee heads for the blank card, next to a card with one dot
const bee = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const legs = [[-20, 40, -60, 110], [30, 40, 30, 120], [80, 35, 130, 105]];
  legs.forEach(([a, b, d, e]) => line(c, [[a, b], [d, e]], 10, INK));
  shape(c, () => ell(c, -40, -100, 55, 110, -0.5), "rgba(214,236,250,0.85)", 6);
  shape(c, () => ell(c, 40, -110, 55, 105, 0.3), "rgba(214,236,250,0.85)", 6);
  shape(c, () => ell(c, 120, 0, 130, 85, 0.05), COL.yellow, 7);
  c.save(); c.beginPath(); ell(c, 120, 0, 130, 85, 0.05); c.clip(); [60, 130, 200].forEach((sx) => { c.fillStyle = INK; c.fillRect(sx, -120, 32, 240); }); c.restore();
  shape(c, () => ell(c, 120, 0, 130, 85, 0.05), NONE, 7);
  shape(c, () => polyP(c, [[245, 0], [290, 8], [245, 22]]), INK, 4);
  shape(c, () => ell(c, 0, 0, 70, 65), COL.orange, 7);
  shape(c, () => ell(c, -95, 8, 52, 48), "#4a3a2a", 7);
  shape(c, () => ell(c, -105, 0, 12, 14), WHITE, 3); shape(c, () => ell(c, -102, 2, 6, 7), INK, 0);
  line(c, [[-120, -38], [-150, -90], [-180, -100]], 6); line(c, [[-100, -40], [-110, -100], [-135, -118]], 6);
  c.restore();
};
const f27 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 90, 540, 360, 400, 20), WHITE, 8); shape(c, () => rrect(c, 630, 540, 360, 400, 20), WHITE, 8);
  shape(c, () => ell(c, 810, 740, 55, 55), INK, 0);
  shadow(c, 270, 960, 200, 20); shadow(c, 810, 960, 200, 20);
  bee(c, 250, 260, 0.9);
  arrow(c, [[270, 420], [270, 510]], RED, 12);
};
// 28 expl.10: a rough map: India -> Baghdad -> North Africa -> Pisa, a 0 travelling
const f28 = (c: Ctx) => {
  ground(c, COL.sky);
  const land = COL.greenLt;
  shape(c, () => polyP(c, [[30, 300], [110, 230], [260, 190], [420, 130], [620, 110], [840, 100], [1050, 140], [1050, 430], [980, 500], [930, 560], [880, 540], [830, 530], [790, 640], [750, 720], [710, 630], [690, 540], [640, 500], [560, 470], [490, 420], [440, 380], [400, 350], [380, 420], [340, 440], [310, 360], [200, 360], [90, 380]]), land, 7);
  shape(c, () => polyP(c, [[100, 450], [260, 430], [440, 450], [520, 500], [580, 590], [540, 720], [460, 880], [380, 920], [330, 780], [280, 650], [160, 570], [90, 500]]), land, 7);
  shape(c, () => polyP(c, [[590, 500], [690, 560], [650, 640], [590, 600]]), land, 7);
  const route = [[790, 540], [590, 440], [420, 470], [330, 340]];
  for (let i = 0; i < route.length - 1; i++) { const [a, b] = [route[i], route[i + 1]], n = 9; for (let k = 0; k < n; k++) { const t0 = k / n, t1 = (k + 0.55) / n; line(c, [[a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0], [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]], 9, RED); } }
  arrow(c, [[350, 372], [330, 345]], RED, 9);
  route.forEach(([x, y]) => shape(c, () => ell(c, x, y, 26, 26), COL.yellow, 7));
  shape(c, () => ell(c, 520, 740, 0.1, 0.1), NONE, 0);
  shape(c, () => ell(c, 505, 455, 44, 44), WHITE, 8); cw(c, "0", 505, 428, 54, INK, 8);
};

export const ic_nothingAndForeverZeroL3 = cards("sci.nothing-and-forever.zero.L3 cards", [f0, f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11, f12, f13, f14, f15, f16, f17, f18, f19, f20, f21, f22, f23, f24, f25, f26, f27, f28]);
