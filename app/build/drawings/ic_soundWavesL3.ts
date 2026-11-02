import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, person, write, cards, leaf } from "./flatKit";

// sci.sound.waves.L3 · picture cards (cover, activities, terms, explanations).
const W = COL.water, WD = COL.waterDk, RICE = "#fff1d0", CLAY = "#c97b4a", CLAYDK = "#a35d33";
const TAU = Math.PI * 2;

// ---------------------------------------------------------------- shared pieces
const water = (c: Ctx, x0: number, x1: number, bot: number, f: (x: number) => number, col: string = W) => {
  shape(c, () => { c.moveTo(x0, f(x0)); for (let x = x0 + 6; x <= x1; x += 6) c.lineTo(x, f(x)); c.lineTo(x1, bot); c.lineTo(x0, bot); c.closePath(); }, col, 6);
};
const sine = (y0: number, amp: number, wl: number, crestX: number) => (x: number) => y0 - amp * Math.sin(((x - crestX) / wl) * TAU + Math.PI / 2);
const bump = (y0: number, amp: number, bx: number, bw: number) => (x: number) => y0 - amp * Math.exp(-(((x - bx) / bw) ** 2));
const tray = (c: Ctx, x0: number, x1: number, top: number, bot: number, f: (x: number) => number) => {
  shadow(c, (x0 + x1) / 2 + 20, bot + 12, (x1 - x0) / 2, 18);
  shape(c, () => rrect(c, x0, top, x1 - x0, bot - top, 18), COL.glass, 0);
  water(c, x0 + 4, x1 - 4, bot - 4, f);
  shape(c, () => rrect(c, x0, top, x1 - x0, bot - top, 18), "rgba(0,0,0,0)", 8);
};
const waveLine = (c: Ctx, f: (x: number) => number, w = 28, col: string = COL.blue) => {
  const pts: number[][] = []; for (let x = -20; x <= D + 20; x += 6) pts.push([x, f(x)]);
  line(c, pts, w + 10, INK); line(c, pts, w, col);
};
const dashed = (c: Ctx, pts: number[][], w = 5) => { c.setLineDash([18, 16]); line(c, pts, w, INK); c.setLineDash([]); };
const grain = (c: Ctx, x: number, y: number, r: number) => {
  for (const [dx, dy, k] of [[-0.55, 0.15, 0.7], [0.5, 0.2, 0.7], [0, -0.35, 0.8], [0, 0.25, 0.85]]) shape(c, () => ell(c, x + dx * r, y + dy * r, r * k, r * k * 0.85), RICE, 4);
};
const stopwatch = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => rrect(c, x - r * 0.18, y - r * 1.25, r * 0.36, r * 0.3, 6), COL.red, 5);
  shape(c, () => ell(c, x, y, r, r), WHITE); shade(c, () => ell(c, x, y, r, r), COL.steelDk, r * 0.15, r * 0.1, 0.35);
  shape(c, () => ell(c, x, y, r * 0.82, r * 0.82), "rgba(0,0,0,0)", 4);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; line(c, [[x + Math.cos(a) * r * 0.66, y + Math.sin(a) * r * 0.66], [x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78]], 4); }
  line(c, [[x, y], [x + r * 0.45, y - r * 0.42]], 7, RED); shape(c, () => ell(c, x, y, r * 0.09, r * 0.09), INK, 0);
};
const rings = (c: Ctx, x: number, y: number, radii: number[], sq = 1, col: string = WHITE, w = 8) => {
  for (const r of radii) { c.beginPath(); c.ellipse(x, y, r, r * sq, 0, 0, TAU); c.strokeStyle = col; c.lineWidth = w; c.stroke(); }
};
const house = (c: Ctx, x: number, yb: number, w: number, h: number) => {
  shape(c, () => rrect(c, x - w / 2, yb - h, w, h, 6), CLAY); shade(c, () => rrect(c, x - w / 2, yb - h, w, h, 6), CLAYDK, w * 0.15, 0, 0.5);
  shape(c, () => polyP(c, [[x - w * 0.62, yb - h], [x + w * 0.62, yb - h], [x, yb - h - h * 0.55]]), COL.red);
  shape(c, () => rrect(c, x - w * 0.12, yb - h * 0.55, w * 0.24, h * 0.55, 4), CLAYDK, 4);
};
const palm = (c: Ctx, x: number, yb: number, h: number) => {
  const t = [[x, yb], [x + h * 0.05, yb - h * 0.5], [x + h * 0.02, yb - h]]; line(c, t, 30, INK); line(c, t, 20, COL.brown);
  for (const a of [-2.9, -2.4, -1.9, -1.2, -0.7, -0.2]) leaf(c, x + h * 0.02, yb - h, h * 0.5, a, COL.leaf);
};
// the dupatta strung between a hand and a door handle, with bumps on it
const dupatta = (c: Ctx, y: number, bumps: [number, number, number][], x0 = 230, x1 = 905) => {
  const f = (x: number) => y - bumps.reduce((s, [bx, a, bw]) => s + a * Math.exp(-(((x - bx) / bw) ** 2)), 0);
  const pts: number[][] = []; for (let x = x0; x <= x1; x += 6) pts.push([x, f(x)]);
  line(c, pts, 46, INK); line(c, pts, 36, COL.pink); line(c, pts.map(([x, yy]) => [x, yy + 10]), 6, COL.purple);
};
const door = (c: Ctx, y: number) => {
  shape(c, () => rrect(c, 905, y - 330, 300, 760, 10), COL.wood); shade(c, () => rrect(c, 905, y - 330, 300, 760, 10), COL.woodDk, 25, 0, 0.5);
  shape(c, () => rrect(c, 925, y - 300, 120, 300, 8), COL.woodDk, 4);
  shape(c, () => ell(c, 930, y, 22, 22), COL.steel, 5);
};
const bolt = (c: Ctx, x: number, y: number, s: number) => shape(c, () => polyP(c, [[x, y], [x + 40 * s, y], [x + 18 * s, y + 55 * s], [x + 55 * s, y + 55 * s], [x - 15 * s, y + 150 * s], [x + 8 * s, y + 80 * s], [x - 22 * s, y + 80 * s]]), COL.yellow, 5);
const floor = (c: Ctx, y: number) => { c.fillStyle = "#e6d3ad"; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 5); };

// ---------------------------------------------------------------- the cards
// cover: the wave goes across, the grain only bobs
const cover = (c: Ctx) => {
  ground(c);
  const f = sine(640, 55, 460, 540); water(c, -10, D + 10, 1000, f);
  grain(c, 540, f(540) - 52, 50);
  arrow(c, [[400, f(540) - 70], [400, f(540) - 200]]); arrow(c, [[680, f(540) - 200], [680, f(540) - 70]]);
  arrow(c, [[170, 250], [900, 250]], RED, 18);
};
// e1: the same wave over three depths
const trayTest = (c: Ctx) => {
  ground(c);
  [100, 390, 680].forEach((top, i) => {
    const bot = top + 240, lvl = bot - (50 + i * 55);
    tray(c, 90, 990, top, bot, bump(lvl, 26, 220, 60));
    arrow(c, [[150, top - 28], [150 + [180, 400, 680][i], top - 28]], RED, 12);
  });
};
// e2: wave passes, the grain stays
const riceStay = (c: Ctx) => {
  ground(c);
  const a = bump(330, 60, 300, 90), b = bump(790, 60, 760, 90);
  tray(c, 90, 990, 170, 450, (x) => a(x) + 20); tray(c, 90, 990, 630, 910, (x) => b(x) + 20);
  const gx = 540; dashed(c, [[gx, 120], [gx, 960]]);
  grain(c, gx, (a(gx) + 20) - 34, 32); grain(c, gx, (b(gx) + 20) - 34, 32);
  arrow(c, [[200, 130], [420, 130]], RED, 14); arrow(c, [[200, 590], [420, 590]], RED, 14);
};
// a1: the dupatta wave
const dupattaWave = (c: Ctx) => {
  ground(c); floor(c, 820); door(c, 520);
  dupatta(c, 520, [[470, 120, 60]]);
  hand(c, 120, 520, 0, 1.3, SKIN.child, CLOTH.child, false);
  arrow(c, [[120, 400], [120, 280]], RED, 14);
  arrow(c, [[330, 330], [640, 330]], RED, 16);
};
// a3: the family stadium wave
const stadium = (c: Ctx) => {
  ground(c); floor(c, 830);
  const up: [number, number] = [-2.0, -1.55], upR: [number, number] = [-1.1, -1.6];
  const ppl: [number, boolean, boolean, boolean][] = [[150, false, false, false], [340, true, true, false], [540, true, true, true], [740, false, true, false], [930, false, false, false]];
  ppl.forEach(([x, stand, arms, ad], i) => {
    if (stand) person(c, x, 830, 400, { adult: i === 2, armL: up, armR: upR });
    else person(c, x, 822, 400, { sit: true, adult: i === 0 || i === 4, ...(arms ? { armL: up, armR: upR } : {}) });
  });
  arrow(c, [[200, 90], [880, 90]], RED, 16);
};
// a4: wave hunt
const waveHunt = (c: Ctx) => {
  ground(c); floor(c, 780);
  // a bowl of water with ripples
  shadow(c, 390, 760, 240, 30);
  shape(c, () => { c.moveTo(150, 520); c.bezierCurveTo(170, 760, 610, 760, 630, 520); c.closePath(); }, COL.steel);
  shape(c, () => ell(c, 390, 520, 240, 70), W); rings(c, 390, 520, [30, 80, 140, 200], 0.29, WHITE, 7);
  shape(c, () => ell(c, 390, 520, 240, 70), "rgba(0,0,0,0)", 6);
  // a magnifying glass
  line(c, [[500, 330], [610, 190]], 36, INK); line(c, [[500, 330], [610, 190]], 24, COL.wood);
  shape(c, () => ell(c, 440, 380, 100, 100), "rgba(214,236,250,0.5)", 12);
  // a speaker with sound waves
  const b = () => rrect(c, 680, 360, 220, 380, 22); shadow(c, 800, 750, 130, 18);
  shape(c, b, COL.teal); shade(c, b, COL.tealDk, 20, 0, 0.5);
  shape(c, () => ell(c, 790, 440, 52, 52), COL.black, 5); shape(c, () => ell(c, 790, 610, 80, 80), COL.black, 5); shape(c, () => ell(c, 790, 610, 30, 30), COL.steelDk, 4);
  for (const r of [50, 95, 140]) { c.beginPath(); c.arc(910, 550, r, -0.9, 0.9); c.strokeStyle = COL.blue; c.lineWidth = 10; c.lineCap = "round"; c.stroke(); }
};
// a5: draw and label a wave
const drawWave = (c: Ctx) => {
  ground(c);
  waveLine(c, sine(250, 80, 380, 190), 28, COL.pink);
  arrow(c, [[540, 380], [540, 500]], RED, 14);
  shadow(c, 560, 930, 440, 24);
  shape(c, () => rrect(c, 120, 540, 840, 380, 12), COL.paper); shade(c, () => rrect(c, 120, 540, 840, 380, 12), COL.cloth, 18, 0, 0.7);
  const pts: number[][] = []; const f = sine(730, 80, 380, 310); for (let x = 170; x <= 910; x += 6) pts.push([x, f(x)]);
  line(c, pts, 10, COL.black);
  line(c, [[900, 520], [760, 700]], 36, INK); line(c, [[900, 520], [760, 700]], 24, COL.yellow);
  shape(c, () => polyP(c, [[765, 695], [740, 745], [795, 725]]), "#f2d6b0", 4);
};
// a6: tap the water, tap the curd
const bowlTop = (c: Ctx, x: number, y: number, inside: string) => {
  shadow(c, x + 14, y + 190, 240, 28);
  shape(c, () => { c.moveTo(x - 250, y); c.bezierCurveTo(x - 230, y + 230, x + 230, y + 230, x + 250, y); c.closePath(); }, COL.steel);
  shape(c, () => ell(c, x, y, 250, 72), inside, 6);
};
const tapBowls = (c: Ctx) => {
  ground(c);
  bowlTop(c, 290, 600, W); rings(c, 290, 600, [35, 90, 150, 205], 0.29, WHITE, 7);
  bowlTop(c, 800, 600, "#fffaf0"); rings(c, 800, 600, [28], 0.29, COL.greyDk, 5);
  for (const x of [290, 800]) {
    line(c, [[x + 20, 600], [x + 150, 280]], 20, INK); line(c, [[x + 20, 600], [x + 150, 280]], 10, COL.steel);
    shape(c, () => ell(c, x + 8, 590, 36, 26, -0.6), COL.steel, 5);
  }
  arrow(c, [[200, 250], [200, 340]], RED, 12); arrow(c, [[710, 250], [710, 340]], RED, 12);
};
// p1: straw wave machine
const strawMachine = (c: Ctx) => {
  ground(c); shadow(c, 560, 860, 440, 26);
  const cols = [COL.pink, COL.teal, COL.yellow];
  for (let i = 0; i < 16; i++) {
    const x = 120 + i * 56, a = 0.55 * Math.sin(i * 0.6);
    c.save(); c.translate(x, 520); c.rotate(a);
    shape(c, () => rrect(c, -13, -160, 26, 320, 13), cols[i % 3], 5);
    c.restore();
  }
  shape(c, () => rrect(c, 70, 498, 940, 44, 8), "#e8d9b0", 5);
  arrow(c, [[160, 900], [900, 900]], RED, 16);
};
// c1: save the clay village
const clayVillage = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 880, 450, 20);
  shape(c, () => rrect(c, 90, 330, 900, 540, 18), COL.glass, 0);
  water(c, 94, 560, 866, sine(660, 40, 400, 200));
  shape(c, () => rrect(c, 540, 480, 90, 386, 8), CLAY); shade(c, () => rrect(c, 540, 480, 90, 386, 8), CLAYDK, 20, 0, 0.5);
  house(c, 760, 866, 110, 110); house(c, 900, 866, 90, 90);
  shape(c, () => rrect(c, 90, 330, 900, 540, 18), "rgba(0,0,0,0)", 8);
  arrow(c, [[150, 250], [520, 250]], RED, 16);
};
// c2: a message along the dupatta
const message = (c: Ctx) => {
  ground(c); floor(c, 900);
  dupatta(c, 599, [[480, 90, 28], [620, 45, 28]], 352, 728);
  person(c, 160, 920, 440, { armR: [0.15, 0] });
  person(c, 920, 920, 440, { adult: true, armL: [Math.PI - 0.15, Math.PI] });
  arrow(c, [[400, 360], [680, 360]], RED, 16);
};

// terms
const termWave = (c: Ctx) => {
  ground(c); shadow(c, 560, 930, 330, 26);
  shape(c, () => ell(c, 540, 540, 380, 380), COL.steel); shade(c, () => ell(c, 540, 540, 380, 380), COL.steelDk, 40, 40, 0.5);
  shape(c, () => ell(c, 540, 540, 330, 330), W, 6);
  rings(c, 540, 540, [50, 120, 195, 265], 1, WHITE, 10);
  shape(c, () => ell(c, 540, 540, 28, 22, 0.3), COL.greyDk, 5);
};
const termEnergy = (c: Ctx) => {
  ground(c); floor(c, 820); door(c, 520);
  dupatta(c, 520, [[360, 130, 55]]);
  hand(c, 120, 520, 0, 1.3, SKIN.child, CLOTH.child, false);
  arrow(c, [[120, 410], [120, 290]], RED, 14); bolt(c, 330, 150, 1.2);
};
const termMedium = (c: Ctx) => {
  ground(c);
  const panel = (x: number, y: number, col: string) => shape(c, () => rrect(c, x, y, 470, 470, 26), col, 6);
  panel(50, 50, "#e9f3ff"); panel(560, 50, "#fdf3e1"); panel(50, 560, "#f1f6ee"); panel(560, 560, "#efe9f7");
  // water
  water(c, 56, 514, 514, sine(300, 30, 230, 170), W);
  // rope with a bump
  const rp: number[][] = []; const rf = bump(290, 100, 800, 60); for (let x = 590; x <= 1000; x += 6) rp.push([x, rf(x)]);
  line(c, rp, 26, INK); line(c, rp, 16, COL.brown);
  // air with a drum
  shape(c, () => rrect(c, 90, 760, 130, 120, 14), COL.red); shape(c, () => ell(c, 155, 760, 65, 22), COL.cloth, 5);
  for (const r of [50, 100, 150]) { c.beginPath(); c.arc(240, 800, r, -0.8, 0.8); c.strokeStyle = COL.blue; c.lineWidth = 9; c.lineCap = "round"; c.stroke(); }
  // rock with a crack and shaking marks
  shape(c, () => polyP(c, [[640, 940], [680, 760], [780, 700], [900, 720], [980, 800], [960, 940]]), COL.grey); 
  line(c, [[800, 706], [780, 790], [820, 840], [790, 940]], 7);
  for (const dx of [-1, 1]) for (const dy of [0, 60]) { c.beginPath(); c.arc(810 + dx * 190, 800 + dy, 18, -1, 1); c.strokeStyle = RED; c.lineWidth = 7; c.stroke(); }
};
const termPulse = (c: Ctx) => {
  ground(c); floor(c, 820); door(c, 520);
  dupatta(c, 520, [[570, 130, 55]]);
  hand(c, 120, 520, 0, 1.3, SKIN.child, CLOTH.child, false);
  arrow(c, [[460, 320], [690, 320]], RED, 16);
};
const crestX = 270, WL = 480;
const WAVEF = sine(560, 130, WL, crestX);
const termCrest = (c: Ctx) => {
  ground(c); waveLine(c, WAVEF);
  for (const x of [crestX, crestX + WL]) arrow(c, [[x, WAVEF(x) - 260], [x, WAVEF(x) - 60]], RED, 14);
};
const termTrough = (c: Ctx) => {
  ground(c); waveLine(c, WAVEF);
  const x = crestX + WL / 2, y = WAVEF(x) - 14;
  shape(c, () => polyP(c, [[x - 80, y - 70], [x + 80, y - 70], [x + 55, y], [x - 55, y]]), COL.red);
  line(c, [[x, y - 70], [x, y - 230]], 8); shape(c, () => polyP(c, [[x + 6, y - 225], [x + 6, y - 85], [x + 80, y - 85]]), WHITE, 5);
};
const termLength = (c: Ctx) => {
  ground(c); waveLine(c, WAVEF);
  const y = WAVEF(crestX) - 150, xa = crestX, xb = crestX + WL;
  for (const x of [xa, xb]) dashed(c, [[x, y - 30], [x, WAVEF(x) - 20]]);
  arrow(c, [[(xa + xb) / 2, y], [xa + 8, y]], RED, 14); arrow(c, [[(xa + xb) / 2, y], [xb - 8, y]], RED, 14);
};
const termHeight = (c: Ctx) => {
  ground(c); waveLine(c, WAVEF);
  dashed(c, [[40, 560], [1040, 560]]);
  arrow(c, [[crestX, 560], [crestX, WAVEF(crestX) - 30]], RED, 14); arrow(c, [[crestX + WL, 560], [crestX + WL, WAVEF(crestX) - 30]], RED, 14);
};
const termSpeed = (c: Ctx) => {
  ground(c);
  tray(c, 60, 740, 430, 780, bump(640, 60, 400, 80));
  arrow(c, [[160, 380], [560, 380]], RED, 16);
  stopwatch(c, 890, 560, 120);
};
const termDepth = (c: Ctx) => {
  ground(c);
  tray(c, 140, 940, 330, 840, () => 640);
  shape(c, () => rrect(c, 500, 300, 80, 540, 6), COL.wood, 5);
  for (let i = 0; i <= 5; i++) { const y = 840 - i * 100; line(c, [[500, y], [500 + (i ? 36 : 26), y]], 4); if (i) write(c, String(i), 526, y - 18 - 0, 36, INK, 5); }
  arrow(c, [[760, 820], [760, 665]], RED, 14); arrow(c, [[760, 665], [760, 820]], RED, 14);
};
const termReflect = (c: Ctx) => {
  ground(c);
  const wavefront = (x: number, y: number, dir: number) => { for (const k of [0, 60, 120]) { c.beginPath(); c.arc(x - dir * k - dir * 160, y, 190, dir > 0 ? -0.7 : Math.PI - 0.7 + 1.4 - 1.4 + 0, dir > 0 ? 0.7 : Math.PI + 0.7); c.strokeStyle = WHITE; c.lineWidth = 9; c.lineCap = "round"; c.stroke(); } };
  for (const [y, dir] of [[300, 1], [770, -1]] as [number, number][]) {
    shape(c, () => rrect(c, 70, y - 190, 940, 380, 20), W, 7);
    shape(c, () => rrect(c, 970, y - 190, 40, 380, 8), COL.steel, 6);
    wavefront(dir > 0 ? 720 : 560, y, dir);
    arrow(c, dir > 0 ? [[130, y], [350, y]] : [[900, y], [680, y]], RED, 14);
  }
};
const termTsunami = (c: Ctx) => {
  ground(c);
  const f = (x: number) => 520 - 120 * Math.exp(-(((x - 650) / 170) ** 2)) * (x > 400 ? 1 : 0.2) - 10 * Math.sin(x / 40) * 0;
  water(c, -10, D + 10, 800, f);
  shape(c, () => polyP(c, [[-10, 800], [D + 10, 800], [D + 10, 1090], [-10, 1090]]), COL.soil, 6);
  line(c, [[110, 800], [140, 880], [100, 960], [130, 1060]], 9, INK);
  for (const dx of [-60, 0, 60]) { c.beginPath(); c.arc(130 + dx, 820, 40 + Math.abs(dx) * 0.4, -2.6, -0.5); c.strokeStyle = RED; c.lineWidth = 8; c.stroke(); }
  arrow(c, [[250, 380], [560, 380]], RED, 16);
};
const earth = (c: Ctx) => {
  shadow(c, 560, 950, 360, 24);
  shape(c, () => ell(c, 540, 520, 400, 400), COL.brown); shape(c, () => ell(c, 540, 520, 365, 365), COL.orange, 6);
  shape(c, () => ell(c, 540, 520, 200, 200), "#e4723b", 6); shape(c, () => ell(c, 540, 520, 90, 90), COL.yellow, 6);
};
const termQuake = (c: Ctx) => {
  ground(c); earth(c);
  for (const r of [80, 160, 240, 320]) { c.save(); c.beginPath(); ell(c, 540, 520, 365, 365); c.clip(); c.beginPath(); c.arc(150, 520, r, -1.2, 1.2); c.strokeStyle = RED; c.lineWidth = 9; c.lineCap = "round"; c.stroke(); c.restore(); }
  shape(c, () => ell(c, 150, 520, 20, 20), RED, 5);
};
// explanations
const explCircle = (c: Ctx) => {
  ground(c);
  const f = sine(500, 70, 520, 540); water(c, -10, D + 10, 1000, f);
  c.beginPath(); c.arc(540, 420, 150, 0, TAU); c.setLineDash([16, 16]); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); c.setLineDash([]);
  for (const [x, y] of [[540, 270], [690, 420], [540, 570], [390, 420]]) grain(c, x, y, 30);
  arrow(c, [[455, 300], [500, 280]], RED, 12); arrow(c, [[700, 330], [710, 380]], RED, 12); arrow(c, [[630, 580], [585, 590]], RED, 12); arrow(c, [[380, 510], [372, 460]], RED, 12);
};
const explDepth = (c: Ctx) => {
  ground(c);
  tray(c, 40, 520, 330, 600, bump(500, 30, 150, 50)); tray(c, 560, 1040, 330, 780, bump(480, 30, 150, 50));
  arrow(c, [[150, 270], [260, 270]], RED, 14); arrow(c, [[670, 270], [950, 270]], RED, 14);
};
const explTsunami = (c: Ctx) => {
  ground(c);
  const f = (x: number) => {
    const amp = 22 + (x / 900) ** 2 * 150, ph = (x / 110) * (1 + x / 1500), t = Math.min(1, Math.max(0, (x - 800) / 160));
    return (520 - amp * Math.sin(ph)) * (1 - t) + 760 * t;
  };
  water(c, -10, 970, 1000, f);
  shape(c, () => polyP(c, [[-10, 940], [380, 940], [800, 800], [960, 760], [D + 10, 760], [D + 10, 1090], [-10, 1090]]), COL.wood, 6);
  palm(c, 975, 760, 240);
  arrow(c, [[60, 330], [420, 330]], RED, 18); arrow(c, [[560, 230], [680, 230]], RED, 10);
};
const explParts = (c: Ctx) => {
  ground(c); waveLine(c, WAVEF);
  dashed(c, [[40, 560], [1040, 560]], 4);
  for (const x of [crestX, crestX + WL]) shape(c, () => ell(c, x, WAVEF(x), 22, 22), COL.yellow, 6);
  shape(c, () => ell(c, crestX + WL / 2, WAVEF(crestX + WL / 2), 22, 22), COL.purple, 6);
  const y = WAVEF(crestX) - 190, xa = crestX, xb = crestX + WL;
  for (const x of [xa, xb]) dashed(c, [[x, y - 30], [x, WAVEF(x) - 30]], 4);
  arrow(c, [[(xa + xb) / 2, y], [xa + 8, y]], RED, 14); arrow(c, [[(xa + xb) / 2, y], [xb - 8, y]], RED, 14);
  arrow(c, [[crestX, 560], [crestX, WAVEF(crestX) + 34]], RED, 14);
};
const explBounce = (c: Ctx) => {
  ground(c); floor(c, 900);
  shape(c, () => ell(c, 540, 280, 440, 150), W, 7); rings(c, 400, 280, [40, 90, 140], 0.34, WHITE, 7); rings(c, 680, 280, [40, 90, 140], 0.34, WHITE, 7);
  door(c, 650);
  dupatta(c, 650, [[600, 90, 40]], 230, 905);
  hand(c, 120, 650, 0, 1.3, SKIN.child, CLOTH.child, false);
  arrow(c, [[480, 480], [720, 480]], RED, 14); arrow(c, [[720, 830], [480, 830]], RED, 14);
};
const explQuake = (c: Ctx) => {
  ground(c); earth(c);
  const sx = 175, sy = 520;
  for (const a of [-0.85, -0.4, 0, 0.4, 0.85]) {
    const ex = 540 + Math.cos(a) * 360, ey = 520 + Math.sin(a) * 360, mx = (sx + ex) / 2, my = (sy + ey) / 2;
    c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(mx + (540 - mx) * 0.5, my + (520 - my) * 0.5, ex, ey);
    c.strokeStyle = RED; c.lineWidth = 8; c.lineCap = "round"; c.stroke();
  }
  shape(c, () => ell(c, sx, sy, 20, 20), RED, 5);
};

const LIST: [string, (c: Ctx) => void][] = [
  ["summary", cover], ["flow.e1", trayTest], ["flow.e2", riceStay], ["flow.a1", dupattaWave], ["flow.a3", stadium], ["flow.a4", waveHunt],
  ["flow.a5", drawWave], ["flow.a6", tapBowls], ["flow.p1", strawMachine], ["flow.c1", clayVillage], ["flow.c2", message],
  ["term.0", termWave], ["term.1", termEnergy], ["term.2", termMedium], ["term.4", termPulse], ["term.5", termCrest], ["term.6", termTrough],
  ["term.7", termLength], ["term.8", termHeight], ["term.9", termSpeed], ["term.10", termDepth], ["term.11", termReflect], ["term.12", termTsunami], ["term.13", termQuake],
  ["expl.1", explCircle], ["expl.3", explDepth], ["expl.4", explTsunami], ["expl.5", explParts], ["expl.6", explBounce], ["expl.7", explQuake],
];
export const ic_soundWavesL3 = cards("sci.sound.waves.L3 cards", LIST.map(([, f]) => f));
export const KEYS = LIST.map(([k]) => k);
