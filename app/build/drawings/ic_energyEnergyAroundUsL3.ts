import type { Ctx } from "./core";
import { D, INK, BG, WHITE, COL, SKIN, CLOTH, RED, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards } from "./flatKit";

// sci.energy.energy-around-us.L3 · picture cards (activities, challenges, terms, explanations).
// Same child and grown-up as the set-up cards. Heat is a red wavy line, sound is curved lines.

const FLAME = "#4f8fe0", FLAMEIN = "#bfe0f5", SUNY = "#ffd34d", BRASS = "#d9a43a", BRASSDK = "#a87a22";
const ink = (c: Ctx, w: number) => { c.lineWidth = w; c.strokeStyle = INK; c.lineJoin = "round"; c.lineCap = "round"; };
const dash = (c: Ctx, a: number[], b: number[], w = 6, col = INK, on = 16, off = 16) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
  for (let t = 0; t < L; t += on + off) { const e = Math.min(L, t + on); line(c, [[a[0] + ux * t, a[1] + uy * t], [a[0] + ux * e, a[1] + uy * e]], w, col); }
};
const wave = (c: Ctx, x: number, y: number, h: number, col: string = RED, w = 9, amp = 14) => {
  const pts: number[][] = []; for (let i = 0; i <= 24; i++) pts.push([x + Math.sin(i / 24 * Math.PI * 3) * amp, y - (i / 24) * h]); line(c, pts, w, col);
};
const arcLine = (c: Ctx, x: number, y: number, r: number, a0: number, a1: number, w = 9, col: string = INK) => { c.beginPath(); c.arc(x, y, r, a0, a1); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke(); };
const arcArrow = (c: Ctx, x: number, y: number, r: number, a0: number, a1: number, w = 10) => { const pts: number[][] = []; for (let i = 0; i <= 14; i++) { const a = a0 + (a1 - a0) * i / 14; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); } arrow(c, pts, RED, w); };
const panel = (c: Ctx, x: number, y: number, w: number, h: number, col: string = COL.paper) => shape(c, () => rrect(c, x, y, w, h, 28), col, 6);
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; const p = [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.8, y + Math.sin(a) * r * 1.8]]; line(c, p, r * 0.22 + 8, INK); line(c, p, r * 0.22, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), SUNY, 6); shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.25, r * 0.25, 0.45);
};
const flame = (c: Ctx, x: number, y: number, s: number, outer: string = FLAME) => {
  const f = (k: number) => () => { c.moveTo(x, y); c.bezierCurveTo(x - 38 * s * k, y - 30 * s * k, x - 30 * s * k, y - 80 * s * k, x, y - 130 * s * k); c.bezierCurveTo(x + 30 * s * k, y - 80 * s * k, x + 38 * s * k, y - 30 * s * k, x, y); c.closePath(); };
  shape(c, f(1), outer, 5); shape(c, f(0.55), FLAMEIN, 0);
};
const ball = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.95, r * 0.9, r * 0.15);
  shape(c, () => ell(c, x, y, r, r), COL.red, 6); shade(c, () => ell(c, x, y, r, r), "#b83a28", r * 0.3, r * 0.3, 0.5);
  arcLine(c, x - r * 0.9, y, r * 0.85, -0.7, 0.7, 5, WHITE); arcLine(c, x + r * 0.9, y, r * 0.85, Math.PI - 0.7, Math.PI + 0.7, 5, WHITE);
};
const marble = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.teal, Math.max(4, r * 0.12)); shade(c, () => ell(c, x, y, r, r), COL.tealDk, r * 0.3, r * 0.3, 0.6);
  line(c, [[x - r * 0.55, y - r * 0.2], [x - r * 0.3, y - r * 0.55]], Math.max(4, r * 0.14), WHITE);
};
const bulb = (c: Ctx, x: number, y: number, r: number, on = true) => {
  if (on) for (let i = 0; i < 9; i++) { const a = -Math.PI * 0.05 - i * Math.PI * 1.1 / 8 + Math.PI * 0.02; line(c, [[x + Math.cos(a) * r * 1.35, y + Math.sin(a) * r * 1.35 - r * 0.1], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75 - r * 0.1]], 8, COL.orange); }
  shape(c, () => rrect(c, x - r * 0.42, y + r * 0.78, r * 0.84, r * 0.6, 8), COL.steel, 5);
  line(c, [[x - r * 0.42, y + r * 1.0], [x + r * 0.42, y + r * 1.0]], 4); line(c, [[x - r * 0.42, y + r * 1.2], [x + r * 0.42, y + r * 1.2]], 4);
  shape(c, () => { c.moveTo(x - r * 0.36, y + r * 0.85); c.bezierCurveTo(x - r * 0.45, y + r * 0.45, x - r, y + r * 0.3, x - r, y - r * 0.15); c.arc(x, y - r * 0.15, r, Math.PI, 0); c.bezierCurveTo(x + r, y + r * 0.3, x + r * 0.45, y + r * 0.45, x + r * 0.36, y + r * 0.85); c.closePath(); }, on ? SUNY : COL.glass, 6);
  line(c, [[x - r * 0.3, y + r * 0.4], [x - r * 0.2, y - r * 0.1], [x, y + r * 0.1], [x + r * 0.2, y - r * 0.1], [x + r * 0.3, y + r * 0.4]], 4, on ? COL.orange : INK);
  shine(c, [[x - r * 0.7, y - r * 0.2], [x - r * 0.5, y - r * 0.6]], 8);
};
// a steel tumbler (water seen from above in its mouth), bottom centre (x, y)
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, water = true) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.1);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.quadraticCurveTo(x, y + w * 0.1, x - w * 0.4, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.28, 0);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), COL.steelIn, 5);
  if (water) shape(c, () => ell(c, x, y - h + 3, w * 0.4, w * 0.065), COL.water, 0);
  shine(c, [[x - w * 0.34, y - h * 0.85], [x - w * 0.27, y - h * 0.2]], 7);
};
const fan = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - 9 * s, 0, 18 * s, y - 20 * s, 3), COL.steel, 5);
  for (const k of [-1, 1]) shape(c, () => ell(c, x + k * 170 * s, y + 24 * s, 150 * s, 22 * s, k * 0.06), COL.wood, 6);
  shape(c, () => ell(c, x, y + 52 * s, 55 * s, 14 * s), COL.woodDk, 5);
  shape(c, () => rrect(c, x - 50 * s, y - 20 * s, 100 * s, 60 * s, 22 * s), COL.steel, 6);
  shade(c, () => rrect(c, x - 50 * s, y - 20 * s, 100 * s, 60 * s, 22 * s), COL.steelDk, 20 * s, 0);
};
const bell = (c: Ctx, x: number, y: number, s: number) => {
  const b = () => { c.moveTo(x - 36 * s, y); c.bezierCurveTo(x - 42 * s, y + 20 * s, x - 90 * s, y + 70 * s, x - 100 * s, y + 140 * s); c.lineTo(x - 112 * s, y + 160 * s); c.lineTo(x + 112 * s, y + 160 * s); c.lineTo(x + 100 * s, y + 140 * s); c.bezierCurveTo(x + 90 * s, y + 70 * s, x + 42 * s, y + 20 * s, x + 36 * s, y); c.closePath(); };
  shape(c, () => ell(c, x, y + 168 * s, 26 * s, 26 * s), BRASSDK, 5);
  shape(c, b, BRASS); shade(c, b, BRASSDK, 40 * s, 0);
  line(c, [[x - 98 * s, y + 118 * s], [x + 98 * s, y + 118 * s]], 5); shine(c, [[x - 40 * s, y + 30 * s], [x - 62 * s, y + 100 * s]], 8);
  shape(c, () => ell(c, x, y - 4 * s, 34 * s, 16 * s), BRASSDK, 5);
};
const apple = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.92), COL.red, 6); shade(c, () => ell(c, x, y, r, r * 0.92), "#b83a28", r * 0.3, r * 0.2, 0.5);
  line(c, [[x, y - r * 0.8], [x + r * 0.1, y - r * 1.2]], 6); leafP(c, x + r * 0.1, y - r * 1.1, r * 0.7);
  line(c, [[x - r * 0.55, y - r * 0.3], [x - r * 0.4, y - r * 0.6]], 7, WHITE);
};
const leafP = (c: Ctx, x: number, y: number, len: number) => shape(c, () => { c.moveTo(x, y); c.quadraticCurveTo(x + len * 0.5, y - len * 0.5, x + len, y - len * 0.1); c.quadraticCurveTo(x + len * 0.5, y + len * 0.1, x, y); c.closePath(); }, COL.leaf, 5);
const top = (c: Ctx, x: number, y: number, s: number, tilt = 0) => {
  c.save(); c.translate(x, y); c.rotate(tilt); c.scale(s, s);
  line(c, [[0, -150], [0, -100]], 14); line(c, [[0, -150], [0, -100]], 7, COL.wood);
  const body = () => { c.moveTo(-85, -95); c.lineTo(85, -95); c.quadraticCurveTo(60, -10, 0, 40); c.quadraticCurveTo(-60, -10, -85, -95); c.closePath(); };
  shape(c, body, COL.red); shade(c, body, "#b83a28", 30, 0, 0.5);
  shape(c, () => ell(c, 0, -95, 85, 20), COL.yellow, 6);
  line(c, [[-60, -55], [60, -55]], 7, SUNY);
  c.restore();
};
const table = (c: Ctx, y: number, col: string = COL.wood) => { shape(c, () => rrect(c, -20, y, 1120, 70, 4), col, 6); c.fillStyle = COL.woodDk; c.fillRect(-14, y + 44, 1108, 20); line(c, [[-14, y + 64], [1094, y + 64]], 6); };
const sound = (c: Ctx, x: number, y: number, r: number, dir: number, n = 3, w = 9) => { for (let i = 0; i < n; i++) arcLine(c, x, y, r + i * r * 0.55, dir - 0.55, dir + 0.55, w, INK); };
const tea = (c: Ctx, x: number, y: number, s: number) => {
  const b = () => { c.moveTo(x - 70 * s, y - 90 * s); c.lineTo(x + 70 * s, y - 90 * s); c.lineTo(x + 55 * s, y); c.lineTo(x - 55 * s, y); c.closePath(); };
  shadow(c, x + 10 * s, y + 4 * s, 75 * s, 12 * s); shape(c, b, COL.steel); shade(c, b, COL.steelDk, 28 * s, 0);
  shape(c, () => ell(c, x, y - 90 * s, 70 * s, 14 * s), "#b57a45", 5);
  wave(c, x - 25 * s, y - 100 * s, 90 * s, RED, 7, 9 * s); wave(c, x + 25 * s, y - 100 * s, 110 * s, RED, 7, 9 * s);
};

// ---------------------------------------------------------------- flows
// 0 flow.e2 · one tumbler of water in sunshine, one in the shade
const e2 = (c: Ctx) => {
  ground(c, "#fff0b8"); c.fillStyle = "#b9c4d9"; c.fillRect(540, 0, 540, D); line(c, [[540, 0], [540, D]], 6);
  sun(c, 170, 170, 80);
  for (const [a, b] of [[[250, 250], [330, 520]], [[300, 190], [440, 470]], [[210, 270], [250, 520]]]) line(c, [a, b], 9, COL.orange);
  shape(c, () => rrect(c, -20, 850, 1120, 80, 4), COL.wood, 6);
  tumbler(c, 330, 850, 230, 300); tumbler(c, 810, 850, 230, 300);
  c.globalAlpha = 0.18; c.fillStyle = INK; c.beginPath(); c.rect(540, 0, 540, D); c.fill(); c.globalAlpha = 1;
};
// 1 flow.a1 · hunt for energy at home
const a1 = (c: Ctx) => {
  ground(c, "#f6efe0"); c.fillStyle = "#e7d9bb"; c.fillRect(0, 0, D, 60); line(c, [[0, 60], [D, 60]], 6);
  fan(c, 700, 250, 1.1);
  arrow(c, [[560, 420], [700, 450], [850, 420]], RED, 9);
  shape(c, () => rrect(c, 40, 960, 1000, 30, 4), COL.woodDk, 0);
  person(c, 270, 990, 640, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [-Math.PI * 0.3, -Math.PI * 0.12] });
  c.save(); c.translate(172, 740); c.rotate(-0.12);
  shape(c, () => rrect(c, -55, -75, 110, 150, 8), COL.wood, 6); shape(c, () => rrect(c, -40, -58, 80, 118, 4), WHITE, 4);
  for (const y of [-35, -10, 15, 40]) line(c, [[-28, y], [28, y]], 4, COL.grey);
  c.restore();
  shape(c, () => ell(c, 150, 810, 24, 24), SKIN.child, 5);
  shadow(c, 850, 962, 110, 16); shape(c, () => rrect(c, 835, 880, 30, 80, 6), COL.steel, 5); bulb(c, 850, 830, 56);
};
// 2 flow.a2 · energy chain: Sun -> rice plant -> idli
const a2 = (c: Ctx) => {
  ground(c);
  sun(c, 540, 150, 80);
  arrow(c, [[540, 285], [540, 370]]);
  shape(c, () => ell(c, 540, 610, 230, 40), COL.soil, 6);
  for (const [dx, an, len] of [[-70, -2.1, 190], [-35, -1.85, 230], [0, -1.57, 245], [35, -1.3, 230], [70, -1.05, 190]]) {
    const x0 = 540 + dx, y0 = 610; const x1 = x0 + Math.cos(an) * len, y1 = y0 + Math.sin(an) * len;
    line(c, [[x0, y0], [x1, y1]], 16, INK); line(c, [[x0, y0], [x1, y1]], 8, COL.leaf);
  }
  for (const [x, y] of [[470, 430], [510, 400], [540, 390], [575, 400], [615, 430]]) shape(c, () => ell(c, x, y, 16, 30, 0.2), COL.yellow, 5);
  arrow(c, [[540, 665], [540, 745]]);
  shadow(c, 560, 940, 270, 50);
  shape(c, () => ell(c, 540, 910, 270, 70), COL.steel); shape(c, () => ell(c, 540, 905, 225, 54), COL.steelIn, 4);
  for (const x of [440, 540, 640]) { const i = () => { c.moveTo(x - 60, 905); c.quadraticCurveTo(x - 60, 825, x, 825); c.quadraticCurveTo(x + 60, 825, x + 60, 905); c.quadraticCurveTo(x, 930, x - 60, 905); }; shape(c, i, WHITE, 5); shade(c, i, "#e4dccb", 20, 0, 0.8); }
};
// 3 flow.a3 · paper spiral above a diya
const a3 = (c: Ctx) => {
  ground(c);
  hand(c, 617, 120, Math.PI, 1.1, SKIN.adult, CLOTH.adult);
  line(c, [[540, 120], [540, 300]], 5);
  for (let i = 0; i < 6; i++) { const y = 305 + i * 58, rx = 36 + i * 30; c.beginPath(); c.ellipse(540, y, rx, rx * 0.3, 0, 0.05, Math.PI - 0.05); ink(c, 24); c.stroke(); c.strokeStyle = COL.paper; c.lineWidth = 14; c.stroke(); }
  shadow(c, 560, 980, 250, 36);
  shape(c, () => ell(c, 540, 950, 250, 54), COL.steel); shape(c, () => ell(c, 540, 945, 205, 40), COL.steelIn, 4);
  const d = () => { c.moveTo(430, 905); c.quadraticCurveTo(440, 975, 540, 975); c.quadraticCurveTo(640, 975, 650, 905); c.closePath(); };
  shape(c, d, COL.brown); shade(c, d, COL.soilDk, 45, 0, 0.6); shape(c, () => ell(c, 540, 905, 110, 24), COL.soil, 5);
  flame(c, 540, 905, 0.9, COL.orange);
  arrow(c, [[425, 840], [380, 760], [400, 690]], RED, 9); arrow(c, [[655, 840], [700, 760], [680, 690]], RED, 9);
};
// 4 flow.a4 · acting out a ceiling fan
const a4 = (c: Ctx) => {
  ground(c);
  person(c, 330, 990, 640, { armL: [Math.PI, Math.PI], armR: [0, 0] });
  arcArrow(c, 330, 330, 190, Math.PI * 1.15, Math.PI * 1.95, 10);
  person(c, 790, 990, 700, { adult: true, armL: [Math.PI + 0.5, Math.PI + 0.3], armR: [Math.PI * 0.45, Math.PI * 0.5] });
};
// 5 flow.p1 · a diary page, and the tally
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 900, 450, 40);
  shape(c, () => polyP(c, [[90, 190], [530, 210], [530, 850], [90, 830]]), COL.paper); shape(c, () => polyP(c, [[550, 210], [990, 190], [990, 830], [550, 850]]), COL.paper);
  line(c, [[540, 205], [540, 850]], 8);
  sun(c, 190, 340, 38); bulb(c, 190, 520, 42); flame(c, 190, 770, 0.7, COL.orange);
  for (const y of [320, 360, 500, 540, 700, 740]) line(c, [[270, y + 8], [490, y]], 6, COL.greyDk);
  c.beginPath(); c.moveTo(620, 760); c.lineTo(950, 745); ink(c, 7); c.stroke();
  const bars: [number, number, string][] = [[640, 380, COL.orange], [730, 300, SUNY], [820, 210, COL.teal], [910, 120, COL.blue]];
  for (const [x, h, col] of bars) shape(c, () => rrect(c, x - 30, 745 - h, 60, h, 6), col, 6);
  for (const x of [640, 730, 820, 910]) line(c, [[x, 770], [x, 770]], 1);
  c.save(); c.translate(560, 960); c.rotate(-0.05);
  shape(c, () => polyP(c, [[-300, -16], [200, -16], [260, 0], [200, 16], [-300, 16]]), COL.yellow, 6);
  shape(c, () => polyP(c, [[200, -16], [260, 0], [200, 16]]), "#f3d3a4", 5); shape(c, () => rrect(c, -330, -16, 32, 32, 6), COL.pink, 5);
  c.restore();
};
// 6 flow.c1 · chain reaction bell
const c1 = (c: Ctx) => {
  ground(c, "#f6efe0"); table(c, 770);
  hand(c, 70, 645, 0, 0.6, SKIN.child, CLOTH.child, true);
  c.save(); c.translate(170, 760); c.rotate(0.22); shape(c, () => rrect(c, -20, -150, 40, 150, 4), COL.blue, 5); c.restore();
  for (const x of [235, 315]) shape(c, () => rrect(c, x - 20, 610, 40, 160, 4), COL.blue, 5);
  shape(c, () => rrect(c, 380, 720, 120, 50, 4), COL.pink, 5); shape(c, () => rrect(c, 380, 680, 120, 40, 4), COL.green, 5);
  c.save(); c.translate(440, 690); c.rotate(0.55); shape(c, () => rrect(c, -10, -12, 270, 20, 3), COL.wood, 5); c.restore();
  marble(c, 462, 640, 22);
  line(c, [[660, 530], [660, 580]], 4);
  shape(c, () => ell(c, 660, 600, 14, 24), COL.steel, 5); shape(c, () => ell(c, 660, 650, 28, 42), COL.steel, 5);
  tumbler(c, 790, 770, 120, 150);
  shape(c, () => rrect(c, 890, 540, 140, 40, 4), COL.green, 5); shape(c, () => rrect(c, 890, 580, 140, 45, 4), COL.orange, 5); shape(c, () => rrect(c, 890, 625, 140, 145, 4), COL.blue, 5);
  shape(c, () => polyP(c, [[640, 518], [900, 518], [905, 540], [640, 540]]), COL.yellow, 5);
  arrow(c, [[190, 540], [290, 500], [390, 540]]); arrow(c, [[520, 590], [600, 540]], RED, 9); arrow(c, [[690, 700], [740, 690]], RED, 9);
};
// 7 flow.c2 · a soft landing pad
const c2 = (c: Ctx) => {
  ground(c);
  shadow(c, 620, 930, 340, 50);
  shape(c, () => ell(c, 620, 880, 330, 80), COL.steel); shape(c, () => ell(c, 620, 875, 285, 62), COL.steelIn, 4);
  const stripes = [COL.blue, COL.pink, COL.yellow, COL.green];
  stripes.forEach((col, i) => shape(c, () => rrect(c, 470, 780 + i * 24, 300, 28, 8), col, 5));
  marble(c, 620, 190, 48);
  arrow(c, [[620, 260], [620, 640]], RED, 12);
  shape(c, () => rrect(c, 130, 190, 56, 700, 6), COL.wood, 6);
  for (let i = 0; i <= 8; i++) line(c, [[186, 890 - i * 87.5], [186 - (i % 2 ? 22 : 38), 890 - i * 87.5]], 4);
  dash(c, [190, 190], [560, 190], 5);
  write(c, "80", 90, 100, 60, INK, 8); write(c, "cm", 200, 118, 44, INK, 7);
};

// ---------------------------------------------------------------- terms
// 8 term.0 Energy: switch -> wire -> fan
const t0 = (c: Ctx) => {
  ground(c, "#f6efe0"); c.fillStyle = "#e7d9bb"; c.fillRect(0, 0, D, 70); line(c, [[0, 70], [D, 70]], 6);
  fan(c, 640, 330, 1.0);
  shape(c, () => rrect(c, 90, 640, 150, 220, 14), WHITE, 6);
  shape(c, () => rrect(c, 135, 690, 60, 120, 10), COL.steel, 5); shape(c, () => rrect(c, 143, 700, 44, 52, 8), COL.green, 4);
  dash(c, [165, 630], [165, 150], 8, INK, 20, 16); dash(c, [165, 150], [640, 150], 8, INK, 20, 16);
  arcArrow(c, 640, 400, 300, Math.PI * 0.15, Math.PI * 0.85, 10);
};
// 9 term.1 Movement energy: a fast ball and a slow ball
const t1 = (c: Ctx) => {
  ground(c, COL.sky); c.fillStyle = COL.greenLt; c.fillRect(0, 560, D, 520); line(c, [[0, 560], [D, 560]], 6);
  for (const y of [260, 330, 400]) line(c, [[130 + (y - 260) * 0.3, y], [520, y]], 12, WHITE);
  ball(c, 700, 330, 85); arrow(c, [[780, 470], [980, 470]], RED, 12);
  ball(c, 340, 850, 85); line(c, [[190, 850], [235, 850]], 12, WHITE); arrow(c, [[460, 980], [540, 980]], RED, 12);
};
// 10 term.2 Stored energy: a coconut high on a palm
const t2 = (c: Ctx) => {
  ground(c, COL.sky); c.fillStyle = COL.greenLt; c.fillRect(0, 930, D, 150); line(c, [[0, 930], [D, 930]], 6);
  const trunk = [[400, 980], [440, 780], [470, 560], [480, 380]];
  line(c, trunk, 74, INK); line(c, trunk, 56, COL.brown);
  for (let i = 0; i < 6; i++) { const y = 880 - i * 100; line(c, [[430 + i * 8 - 25, y], [440 + i * 8 + 25, y - 22]], 6, COL.soilDk); }
  for (const an of [-2.9, -2.3, -1.8, -1.2, -0.6, -0.2]) { const l = 330; const tx = 480 + Math.cos(an) * l, ty = 370 + Math.sin(an) * l * 0.8; shape(c, () => { c.moveTo(480, 370); c.quadraticCurveTo(480 + Math.cos(an) * l * 0.5, 370 + Math.sin(an) * l * 0.5 - 70, tx, ty + 90); c.quadraticCurveTo(480 + Math.cos(an) * l * 0.5, 370 + Math.sin(an) * l * 0.5 - 20, 480, 370); c.closePath(); }, COL.leaf, 5); }
  shape(c, () => ell(c, 455, 400, 34, 34), COL.soil, 5); shape(c, () => ell(c, 520, 405, 34, 34), COL.soil, 5);
  line(c, [[600, 415], [560, 385]], 7);
  shape(c, () => ell(c, 610, 450, 46, 46), COL.soil, 6); shade(c, () => ell(c, 610, 450, 46, 46), COL.soilDk, 14, 14, 0.6);
  dash(c, [610, 515], [610, 880], 8, INK, 20, 16); arrow(c, [[610, 840], [610, 915]], RED, 10);
  shadow(c, 620, 955, 80, 14);
};
// 11 term.3 Heat: gas flame heats a tawa and a dosa
const t3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 130, 760, 820, 140, 10), COL.steel); shade(c, () => rrect(c, 130, 760, 820, 140, 10), COL.steelDk, 40, 0);
  shape(c, () => rrect(c, 420, 700, 240, 60, 14), COL.black, 5);
  for (const dx of [-80, -40, 0, 40, 80]) flame(c, 540 + dx, 700, 1.0);
  shape(c, () => rrect(c, 770, 450, 280, 30, 14), COL.black, 5);
  shape(c, () => ell(c, 540, 470, 380, 95), COL.greyDk, 6);
  shape(c, () => rrect(c, 160, 440, 760, 42, 10), COL.black, 0); shape(c, () => ell(c, 540, 450, 380, 95), COL.black, 6);
  shape(c, () => ell(c, 540, 435, 300, 70), COL.wood, 6); shade(c, () => ell(c, 540, 435, 300, 70), COL.woodDk, 40, 20, 0.5);
  for (const [x, y] of [[420, 420], [560, 440], [650, 415], [500, 455]]) shape(c, () => ell(c, x, y, 18, 8), COL.woodDk, 0);
  for (const x of [380, 540, 700]) wave(c, x, 330, 220, RED, 10, 16);
};
// 12 term.4 Light: a torch in a dark room
const t4 = (c: Ctx) => {
  ground(c, "#1f2a44");
  c.globalAlpha = 0.8; c.fillStyle = "#fff0a0"; c.beginPath(); polyP(c, [[330, 540], [D, 200], [D, 880], [330, 620]]); c.fill(); c.globalAlpha = 1;
  c.fillStyle = "#2c3a5e"; c.fillRect(0, 880, D, 200);
  tumbler(c, 500, 900, 190, 250);
  shape(c, () => rrect(c, 640, 830, 150, 50, 4), COL.green, 5); shape(c, () => rrect(c, 650, 780, 130, 50, 4), COL.orange, 5); ball(c, 930, 820, 55);
  c.save(); c.translate(40, 580); c.scale(1.35, 1.35);
  shape(c, () => rrect(c, 0, -34, 200, 68, 14), COL.red); shade(c, () => rrect(c, 0, -34, 200, 68, 14), "#b83a28", 0, 20, 0.5);
  shape(c, () => polyP(c, [[200, -50], [250, -62], [250, 62], [200, 50]]), COL.steel); shape(c, () => ell(c, 252, 0, 14, 62), SUNY, 5);
  shape(c, () => rrect(c, 70, -50, 40, 16, 6), COL.steel, 5);
  c.restore();
};
// 13 term.5 Sound: a temple bell
const t5 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 180, 90, 720, 50, 6), COL.wood, 6);
  c.save(); c.translate(540, 140); c.rotate(0.2);
  line(c, [[0, 0], [0, 130]], 8); bell(c, 0, 130, 1.45);
  c.restore();
  sound(c, 420, 640, 100, Math.PI, 3, 10); sound(c, 760, 600, 100, 0, 3, 10);
};
// 14 term.6 Vibrate: a plucked rubber band
const t6 = (c: Ctx) => {
  ground(c);
  const band = (amp: number, col: string, w: number, al: number) => { c.beginPath(); c.moveTo(380, 540); c.quadraticCurveTo(540, 540 + amp * 2, 700, 540); c.globalAlpha = al; c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke(); c.globalAlpha = 1; };
  band(-80, COL.blue, 14, 0.3); band(80, COL.blue, 14, 0.3); band(-40, COL.blue, 14, 0.5); band(40, COL.blue, 14, 0.5);
  c.beginPath(); c.moveTo(380, 540); c.lineTo(700, 540); c.strokeStyle = INK; c.lineWidth = 22; c.stroke(); c.strokeStyle = COL.blue; c.lineWidth = 12; c.stroke();
  for (const [x, an] of [[250, 0], [830, Math.PI]]) {
    c.save(); c.translate(x, 540); c.rotate(an);
    shape(c, () => rrect(c, -150, -58, 330, 116, 58), SKIN.child); shade(c, () => rrect(c, -150, -58, 330, 116, 58), SKIN.childDk, 0, 26, 0.5);
    shape(c, () => rrect(c, 120, -34, 50, 52, 24), "#f1c9a8", 4); line(c, [[0, -20], [10, 20]], 4, SKIN.childDk);
    c.restore();
  }
  arrow(c, [[540, 400], [540, 270]], RED, 10); arrow(c, [[540, 680], [540, 810]], RED, 10);
  sound(c, 700, 300, 50, -0.6, 2, 8);
};
// 15 term.7 Electricity: wind turbines, wires, a fan in a flat
const turbine = (c: Ctx, x: number, y: number, h: number, rot: number) => {
  shape(c, () => polyP(c, [[x - 12, y], [x + 12, y], [x + 5, y - h], [x - 5, y - h]]), WHITE, 5);
  for (let i = 0; i < 3; i++) { const a = rot + i * 2.094; shape(c, () => { c.moveTo(x, y - h); c.lineTo(x + Math.cos(a - 0.12) * h * 0.55, y - h + Math.sin(a - 0.12) * h * 0.55); c.lineTo(x + Math.cos(a + 0.05) * h * 0.55, y - h + Math.sin(a + 0.05) * h * 0.55); c.closePath(); }, WHITE, 5); }
  shape(c, () => ell(c, x, y - h, 14, 14), COL.steel, 5);
};
const pylon = (c: Ctx, x: number, y: number, h: number) => {
  line(c, [[x - 40, y], [x, y - h], [x + 40, y]], 10); line(c, [[x - 24, y - h * 0.45], [x + 24, y - h * 0.45]], 7);
  line(c, [[x - 60, y - h * 0.8], [x + 60, y - h * 0.8]], 10);
};
const t7 = (c: Ctx) => {
  ground(c, COL.sky);
  shape(c, () => { c.moveTo(-20, 1000); c.quadraticCurveTo(250, 640, 560, 800); c.lineTo(1100, 800); c.lineTo(1100, 1100); c.lineTo(-20, 1100); c.closePath(); }, COL.greenLt, 6);
  turbine(c, 150, 770, 300, 0.4); turbine(c, 360, 750, 230, 1.2);
  pylon(c, 560, 840, 280); pylon(c, 760, 860, 280);
  line(c, [[360, 520], [500, 590], [560, 580], [700, 640], [760, 580], [880, 470]], 5);
  shape(c, () => rrect(c, 800, 400, 260, 480, 6), COL.cloth, 6); shape(c, () => rrect(c, 840, 520, 180, 190, 10), "#cfe6f5", 6);
  shape(c, () => rrect(c, 850, 760, 70, 120, 6), COL.brown, 5);
  c.save(); c.beginPath(); rrect(c, 840, 520, 180, 190, 10); c.clip(); fan(c, 930, 600, 0.45); c.restore();
  shape(c, () => rrect(c, 840, 520, 180, 190, 10), "rgba(0,0,0,0)", 6);
};
// 16 term.8 Fuel: stove, flame and a gas cylinder
const t8 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 90, 760, 520, 130, 10), COL.steel); shade(c, () => rrect(c, 90, 760, 520, 130, 10), COL.steelDk, 40, 0);
  shape(c, () => rrect(c, 90, 890, 520, 80, 6), COL.steelDk, 6);
  shape(c, () => rrect(c, 250, 700, 200, 60, 14), COL.black, 5);
  for (const dx of [-70, -35, 0, 35, 70]) flame(c, 350 + dx, 700, 0.8);
  shape(c, () => ell(c, 540, 770, 18, 18), COL.black, 4);
  const cy = () => { c.moveTo(700, 940); c.lineTo(700, 520); c.quadraticCurveTo(700, 430, 790, 430); c.quadraticCurveTo(880, 430, 880, 520); c.lineTo(880, 940); c.closePath(); };
  shadow(c, 800, 945, 120, 18);
  shape(c, cy, COL.red); shade(c, cy, "#a8372a", 50, 0, 0.5); shine(c, [[725, 560], [725, 880]], 10);
  line(c, [[700, 650], [880, 650]], 5); line(c, [[700, 800], [880, 800]], 5);
  shape(c, () => rrect(c, 750, 360, 80, 70, 8), COL.steel, 5); shape(c, () => rrect(c, 715, 340, 150, 24, 8), COL.steelDk, 5);
  c.beginPath(); c.moveTo(790, 360); c.bezierCurveTo(740, 240, 560, 560, 530, 760); ink(c, 18); c.stroke(); c.strokeStyle = COL.orange; c.lineWidth = 9; c.stroke();
};
// 17 term.9 Energy transfer: a kick
const t9 = (c: Ctx) => {
  ground(c, COL.sky); c.fillStyle = COL.greenLt; c.fillRect(0, 840, D, 240); line(c, [[0, 840], [D, 840]], 6);
  const stand = [[110, 380], [100, 800]]; line(c, stand, 92, INK); line(c, stand, 76, SKIN.child);
  const leg = [[190, 380], [300, 580], [420, 720]]; line(c, leg, 92, INK); line(c, leg, 76, SKIN.child);
  shape(c, () => rrect(c, 30, -60, 240, 220, 20), COL.blue, 6);
  shape(c, () => polyP(c, [[30, 130], [250, 130], [290, 420], [30, 440]]), CLOTH.child, 6); shade(c, () => polyP(c, [[30, 130], [250, 130], [290, 420], [30, 440]]), CLOTH.childDk, 40, 0, 0.5);
  shape(c, () => ell(c, 85, 820, 70, 36), WHITE, 6);
  shape(c, () => { c.moveTo(390, 690); c.lineTo(460, 680); c.quadraticCurveTo(540, 740, 545, 790); c.lineTo(420, 800); c.closePath(); }, WHITE, 6);
  line(c, [[420, 785], [545, 780]], 8, COL.blue);
  shadow(c, 800, 925, 100, 16);
  shape(c, () => ell(c, 790, 810, 100, 100), WHITE, 6); shade(c, () => ell(c, 790, 810, 100, 100), COL.steel, 28, 28, 0.6);
  shape(c, () => polyP(c, [[790, 770], [828, 798], [814, 842], [766, 842], [752, 798]]), INK, 4);
  arrow(c, [[540, 640], [660, 600], [790, 660]], RED, 12);
  for (const y of [770, 830]) line(c, [[930, y], [1020, y]], 9, COL.grey);
};
// 18 term.10 Source of energy: a solar lamp and the Sun
const t10 = (c: Ctx) => {
  ground(c, COL.sky);
  sun(c, 170, 160, 85);
  line(c, [[250, 260], [480, 450]], 10, COL.orange); line(c, [[290, 190], [560, 400]], 10, COL.orange); line(c, [[210, 280], [400, 470]], 10, COL.orange);
  shape(c, () => rrect(c, -20, 790, 1120, 40, 8), COL.steel, 6);
  for (let x = 40; x < 1080; x += 110) shape(c, () => rrect(c, x, 830, 26, 220, 4), COL.steelDk, 5);
  shadow(c, 640, 800, 110, 14);
  shape(c, () => rrect(c, 575, 700, 130, 95, 10), COL.steelDk, 5);
  shape(c, () => rrect(c, 595, 540, 90, 160, 10), "#fff4c4", 6); shine(c, [[612, 565], [612, 670]], 8);
  shape(c, () => ell(c, 640, 620, 28, 28), SUNY, 4); shape(c, () => rrect(c, 625, 505, 30, 40, 4), COL.steelDk, 5);
  shape(c, () => polyP(c, [[520, 510], [750, 510], [790, 430], [560, 430]]), COL.blue, 6);
  for (const t of [0.33, 0.66]) line(c, [[520 + t * 230, 510], [560 + t * 230, 430]], 4, WHITE);
  line(c, [[540, 470], [770, 470]], 4, WHITE);
};
// 19 term.12 Joule: lift an apple 1 metre
const t12 = (c: Ctx) => {
  ground(c); c.fillStyle = "#e7d9bb"; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 6);
  shape(c, () => rrect(c, 700, 480, 340, 40, 6), COL.wood, 6);
  shape(c, () => rrect(c, 725, 520, 36, 360, 4), COL.woodDk, 5); shape(c, () => rrect(c, 980, 520, 36, 360, 4), COL.woodDk, 5);
  apple(c, 870, 428, 52);
  hand(c, 190, 815, 0, 1.2, SKIN.child, CLOTH.child);
  apple(c, 292, 810, 55);
  arrow(c, [[330, 740], [400, 430], [690, 360]], RED, 12);
  line(c, [[640, 880], [640, 480]], 6); line(c, [[610, 880], [670, 880]], 6); line(c, [[610, 480], [670, 480]], 6);
  write(c, "1", 480, 610, 90, INK, 9); write(c, "m", 545, 640, 70, INK, 9);
};
// 20 term.13 Conservation: where the marble's energy went
const t13 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 990, 450, 50);
  shape(c, () => ell(c, 540, 880, 440, 120), COL.steel); shape(c, () => ell(c, 540, 870, 380, 95), COL.steelIn, 4);
  shape(c, () => ell(c, 540, 870, 340, 80), "#f5e6c4", 4);
  shape(c, () => ell(c, 540, 872, 130, 36), "#d9c28f", 5);
  marble(c, 540, 850, 38);
  for (const [x, y, r] of [[330, 600, 14], [370, 540, 11], [300, 680, 10], [760, 640, 12]]) shape(c, () => ell(c, x, y, r, r), "#f5e6c4", 4);
  arrow(c, [[500, 780], [430, 700], [360, 640]], RED, 9);
  arrow(c, [[540, 770], [540, 530]], RED, 9); wave(c, 540, 480, 200, RED, 10, 16);
  arrow(c, [[590, 780], [680, 720], [720, 690]], RED, 9);
  sound(c, 800, 600, 50, 0, 3, 9);
};

// ---------------------------------------------------------------- explanations
// small pictures, drawn round (0, 0), about 340 across
const iMarble = (c: Ctx) => { line(c, [[-140, 130], [140, 130]], 7); marble(c, 0, -110, 40); arrow(c, [[0, -50], [0, 85]], RED, 11); };
const iBulb = (c: Ctx) => { bulb(c, 0, -20, 80, true); };
const iSun = (c: Ctx) => { sun(c, -80, -90, 42); line(c, [[-70, -30], [10, 20]], 9, COL.orange); line(c, [[-110, -30], [-70, 30]], 9, COL.orange); tumbler(c, 50, 130, 150, 200); };
const iBell = (c: Ctx) => { shape(c, () => rrect(c, -140, -140, 280, 26, 4), COL.wood, 5); line(c, [[0, -114], [0, -90]], 6); bell(c, 0, -90, 0.9); sound(c, -20, 40, 40, Math.PI, 2, 8); sound(c, 20, 40, 40, 0, 2, 8); };
const iTea = (c: Ctx) => tea(c, 0, 110, 1.4);
const withIcon = (c: Ctx, x: number, y: number, s: number, f: (c: Ctx) => void) => { c.save(); c.translate(x, y); c.scale(s, s); f(c); c.restore(); };

// 21 expl.0 What energy is: four things that happen
const x0 = (c: Ctx) => {
  ground(c);
  for (const [x, y, col, f] of [[40, 40, "#fff0b8", iMarble], [550, 40, "#fff7d6", iBulb], [40, 550, "#d9ecf8", iSun], [550, 550, "#efe4f8", iBell]] as [number, number, string, (c: Ctx) => void][]) {
    panel(c, x, y, 490, 490, col); withIcon(c, x + 245, y + 255, 1.05, f);
  }
};
// 22 expl.1 Forms: inside a torch
const x1 = (c: Ctx) => {
  ground(c);
  shadow(c, 520, 700, 450, 36);
  shape(c, () => rrect(c, 90, 430, 520, 220, 40), COL.teal); shade(c, () => rrect(c, 90, 430, 520, 220, 40), COL.tealDk, 0, 70, 0.5);
  shape(c, () => rrect(c, 130, 470, 440, 140, 24), COL.paper, 5);
  for (const x of [150, 330]) { shape(c, () => rrect(c, x, 495, 160, 90, 12), COL.steel, 5); shape(c, () => rrect(c, x + 160, 525, 20, 30, 4), COL.steelDk, 4); write(c, "+", x + 100, 520, 36, RED, 7); }
  shape(c, () => polyP(c, [[610, 400], [760, 340], [760, 740], [610, 680]]), COL.teal);
  shape(c, () => ell(c, 770, 540, 40, 200), SUNY, 6);
  line(c, [[510, 600], [510, 625], [610, 625], [660, 560]], 7, INK);
  for (const [y, x2] of [[390, 1010], [540, 1040], [690, 1010]]) line(c, [[820, 540 + (y - 540) * 0.2], [x2, y]], 16, COL.yellow);
  arrow(c, [[180, 740], [330, 780], [520, 760]], RED, 9);
};
// 23 expl.2 Passing it on: hand, top, slowing top
const x2 = (c: Ctx) => {
  ground(c);
  for (const [x, col] of [[40, "#fff0b8"], [390, "#fff7d6"], [740, "#efe4f8"]] as [number, string][]) panel(c, x, 250, 300, 560, col);
  for (const x of [190, 540, 890]) { line(c, [[x - 110, 740], [x + 110, 740]], 7); }
  top(c, 190, 700, 1.1, 0); hand(c, 100, 540, 0.05, 0.8, SKIN.child, CLOTH.child);
  arcArrow(c, 190, 400, 80, Math.PI * 1.15, Math.PI * 1.9, 8);
  top(c, 540, 700, 1.1, 0); arcLine(c, 540, 540, 100, Math.PI * 1.1, Math.PI * 1.9, 8, INK); arcLine(c, 540, 600, 110, Math.PI * 0.1, Math.PI * 0.9, 8, INK);
  top(c, 890, 700, 1.1, 0.55);
  arrow(c, [[344, 540], [388, 540]], RED, 10); arrow(c, [[694, 540], [738, 540]], RED, 10);
};
// 24 expl.4 Never used up: the energy spreads out as heat
const x4 = (c: Ctx) => {
  ground(c);
  line(c, [[-20, 800], [1100, 800]], 7);
  top(c, 230, 740, 1.5, 0); arcLine(c, 230, 600, 150, Math.PI * 1.1, Math.PI * 1.9, 10, INK);
  arrow(c, [[400, 560], [520, 560]], RED, 12);
  c.save(); c.translate(760, 745); c.rotate(1.4); c.translate(-0, 0);
  top(c, 0, 0, 1.4, 0); c.restore();
  for (const [x, y] of [[620, 780], [700, 780], [800, 780], [900, 780]]) wave(c, x, y, 190 + (x % 3) * 20, RED, 9, 14);
  for (const [x, y, an] of [[600, 640, -2.5], [930, 640, -0.6]]) arrow(c, [[x, y], [x + Math.cos(an) * 140, y + Math.sin(an) * 140]], RED, 8);
};
// 25 expl.7 Thinking: what is energy, really?
const x7 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 270, 450, 200), COL.paper, 6);
  for (const [x, y, r] of [[500, 510, 24], [470, 570, 16]]) shape(c, () => ell(c, x, y, r, r), COL.paper, 5);
  withIcon(c, 270, 270, 0.62, iBulb); withIcon(c, 540, 270, 0.62, iMarble); withIcon(c, 810, 270, 0.62, iTea);
  person(c, 540, 1040, 560, { armR: [Math.PI * 0.2, -Math.PI * 0.6], armL: [Math.PI * 0.55, Math.PI * 0.5] });
};

export const ic_energyEnergyAroundUsL3 = cards("sci.energy.energy-around-us.L3 cards", [e2, a1, a2, a3, a4, p1, c1, c2, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t12, t13, x0, x1, x2, x4, x7]);
