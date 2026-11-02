import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, leaf, write, cards } from "./flatKit";

// sci.energy.stored-energy.L3 · picture cards. Same child and grown-up as the set-up cards.
const CLEAR = "rgba(224,240,250,0.7)", NONE = "rgba(0,0,0,0)", GLOW = "#ffe27a", FLOOR = "#e3cfa6", GOLD = "#e8b230", BAND = "#f2c63a";

const floor = (c: Ctx, y: number) => {
  c.fillStyle = FLOOR; c.fillRect(0, y, D, D - y);
  line(c, [[0, y], [D, y]], 6);
  for (let x = -60; x < D + 60; x += 150) line(c, [[x + 60, y], [x - 30, D]], 3, "#c9b186");
  line(c, [[0, y + (D - y) * 0.45], [D, y + (D - y) * 0.45]], 3, "#c9b186");
};
const table = (c: Ctx, y: number) => {
  shape(c, () => rrect(c, -20, y, 1120, 70, 4), COL.wood, 6);
  c.fillStyle = COL.woodDk; c.fillRect(-14, y + 44, 1108, 20);
  line(c, [[-14, y + 64], [1094, y + 64]], 6);
};
const ring = (c: Ctx, x: number, y: number, rx: number, ry: number, w: number, col: string = BAND, rot = 0) => {
  c.beginPath(); ell(c, x, y, rx, ry, rot); c.strokeStyle = INK; c.lineWidth = w + 10; c.stroke();
  c.beginPath(); ell(c, x, y, rx, ry, rot); c.strokeStyle = col; c.lineWidth = w; c.stroke();
};
const thick = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 10, INK); line(c, pts, w, col); };
// roll-back jar lying on its side, centre (x, y): rubber band across inside, padlock hanging in the middle
const jar = (c: Ctx, x: number, y: number, len: number, h: number) => {
  shadow(c, x + 12, y + h / 2 + 10, len * 0.55, h * 0.12);
  const body = () => rrect(c, x - len / 2, y - h / 2, len, h, h * 0.2);
  shape(c, body, CLEAR, 0);
  const l = x - len / 2 + h * 0.1, r = x + len / 2 - h * 0.1, o = h * 0.2;
  thick(c, [[l, y - o], [x - 26, y - o], [x + 26, y + o], [r, y + o]], 12, BAND);
  thick(c, [[l, y + o], [x - 26, y + o], [x + 26, y - o], [r, y - o]], 12, BAND);
  shape(c, () => c.arc(x, y + h * 0.02, h * 0.13, Math.PI, 0), NONE, 7);
  shape(c, () => rrect(c, x - h * 0.17, y + h * 0.02, h * 0.34, h * 0.26, 6), GOLD, 5);
  shape(c, body, NONE, 6);
  for (const s of [-1, 1]) shape(c, () => rrect(c, s < 0 ? x - len / 2 - h * 0.08 : x + len / 2 - h * 0.1, y - h * 0.55, h * 0.18, h * 1.1, 8), COL.red, 6);
  shine(c, [[x - len * 0.38, y - h * 0.34], [x + len * 0.1, y - h * 0.34]], 8);
};
// an AA cell standing with its base at (x, y)
const cell = (c: Ctx, x: number, y: number, w: number, h: number, col: string = COL.teal, dk: string = COL.tealDk) => {
  shadow(c, x + w * 0.2, y + 4, w * 0.7, w * 0.16);
  shape(c, () => rrect(c, x - w * 0.2, y - h - h * 0.06, w * 0.4, h * 0.1, 4), COL.steel, 5);
  const b = () => rrect(c, x - w / 2, y - h, w, h, w * 0.18);
  shape(c, b, col); shade(c, b, dk, w * 0.2, 0);
  shape(c, () => rrect(c, x - w / 2, y - h * 0.82, w, h * 0.12, 3), COL.steel, 4);
  write(c, "+", x - w * 0.2, y - h * 0.62, w * 0.5, WHITE, Math.max(4, w * 0.08));
};
const flame = (c: Ctx, x: number, y: number, s: number, col: string = COL.blue, inner: string = COL.sky) => {
  shape(c, () => { c.moveTo(x, y - s); c.bezierCurveTo(x + s * 0.7, y - s * 0.3, x + s * 0.55, y, x, y); c.bezierCurveTo(x - s * 0.55, y, x - s * 0.7, y - s * 0.3, x, y - s); c.closePath(); }, col, 5);
  shape(c, () => { c.moveTo(x, y - s * 0.5); c.bezierCurveTo(x + s * 0.3, y - s * 0.2, x + s * 0.25, y, x, y); c.bezierCurveTo(x - s * 0.25, y, x - s * 0.3, y - s * 0.2, x, y - s * 0.5); c.closePath(); }, inner, 3);
};
const torch = (c: Ctx, x: number, y: number, len: number, h: number, on: number) => {
  if (on > 0) {
    c.globalAlpha = on; shape(c, () => polyP(c, [[x + len * 0.5, y - h * 0.3], [x + len * 0.5 + 330 * on, y - h * 1.6], [x + len * 0.5 + 330 * on, y + h * 1.6], [x + len * 0.5, y + h * 0.3]]), GLOW, 0); c.globalAlpha = 1;
  }
  shadow(c, x + 10, y + h * 0.62, len * 0.55, h * 0.12);
  shape(c, () => rrect(c, x - len / 2, y - h / 2, len * 0.72, h, h * 0.2), COL.red);
  shade(c, () => rrect(c, x - len / 2, y - h / 2, len * 0.72, h, h * 0.2), "#b8392b", 0, h * 0.2);
  shape(c, () => polyP(c, [[x + len * 0.2, y - h / 2], [x + len * 0.5, y - h * 0.8], [x + len * 0.5, y + h * 0.8], [x + len * 0.2, y + h / 2]]), COL.steel);
  shape(c, () => ell(c, x + len * 0.5, y, h * 0.2, h * 0.8), on > 0 ? GLOW : COL.steelIn, 5);
  shape(c, () => rrect(c, x - len * 0.2, y - h * 0.64, h * 0.3, h * 0.2, 4), COL.steel, 4);
};
const clock = (c: Ctx, x: number, y: number, r: number, key = false, hr = -1.2, mn = 0.3) => {
  shadow(c, x + r * 0.12, y + r * 1.05, r * 0.9, r * 0.14);
  if (key) { thick(c, [[x + r, y], [x + r * 1.35, y]], 12, COL.steel); shape(c, () => rrect(c, x + r * 1.3, y - r * 0.28, r * 0.12, r * 0.56, 5), GOLD, 5); }
  shape(c, () => ell(c, x, y, r, r), COL.wood); shade(c, () => ell(c, x, y, r, r), COL.woodDk, r * 0.1, r * 0.1);
  shape(c, () => ell(c, x, y, r * 0.82, r * 0.82), COL.paper, 5);
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 0.66, y + Math.sin(a) * r * 0.66], [x + Math.cos(a) * r * 0.76, y + Math.sin(a) * r * 0.76]], 5); }
  line(c, [[x, y], [x + Math.cos(hr) * r * 0.42, y + Math.sin(hr) * r * 0.42]], 9); line(c, [[x, y], [x + Math.cos(mn) * r * 0.65, y + Math.sin(mn) * r * 0.65]], 6);
  shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), INK, 0);
};
const building = (c: Ctx, x: number, y: number, w: number, h: number, floors: number) => {
  shadow(c, x + w * 0.58, y + 8, w * 0.7, 18);
  const b = () => rrect(c, x, y - h, w, h, 6);
  shape(c, b, "#e9c9a0"); shade(c, b, "#c79e72", w * 0.14, 0);
  const fh = h / floors;
  for (let f = 0; f < floors; f++) for (let k = 0; k < 2; k++) shape(c, () => rrect(c, x + w * (0.14 + k * 0.5), y - h + f * fh + fh * 0.2, w * 0.28, fh * 0.45, 5), COL.sky, 4);
};
const tank = (c: Ctx, x: number, y: number, w: number, h: number) => {
  for (const s of [-1, 1]) line(c, [[x + s * w * 0.35, y], [x + s * w * 0.35, y + h * 0.3]], 10);
  const b = () => rrect(c, x - w / 2, y - h, w, h, w * 0.14);
  shape(c, b, COL.blue); shade(c, b, COL.blueDk, w * 0.2, 0);
  shape(c, () => rrect(c, x - w * 0.55, y - h - 10, w * 1.1, 22, 8), COL.blueDk, 5);
  shine(c, [[x - w * 0.34, y - h * 0.8], [x - w * 0.34, y - h * 0.2]], 9);
};
const banana = (c: Ctx, x: number, y: number, s: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const p = () => { c.moveTo(-120, -50); c.bezierCurveTo(-90, 90, 60, 110, 130, -40); c.bezierCurveTo(140, -62, 110, -62, 104, -48); c.bezierCurveTo(50, 35, -50, 35, -96, -66); c.closePath(); };
  shape(c, p, COL.yellow, 6 / s); shade(c, p, COL.orange, 0, 14, 0.4);
  shape(c, () => rrect(c, -132, -86, 26, 40, 8), COL.brown, 5 / s); shape(c, () => rrect(c, 108, -64, 26, 24, 8), COL.brown, 5 / s);
  c.restore();
};
const spiral = (c: Ctx, x: number, y: number, r0: number, r1: number, turns: number, w: number) => {
  const pts: number[][] = [], n = 120;
  for (let i = 0; i <= n; i++) { const t = i / n, a = t * turns * Math.PI * 2, r = r0 + (r1 - r0) * t; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
  line(c, pts, w + 10, INK); line(c, pts, w, COL.steel);
};
const curlArrow = (c: Ctx, x: number, y: number, r: number, a0: number, a1: number, col = RED) => {
  const pts: number[][] = []; for (let i = 0; i <= 14; i++) { const a = a0 + ((a1 - a0) * i) / 14; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
  arrow(c, pts, col, 9);
};
const wheel = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.black); shape(c, () => ell(c, x, y, r * 0.4, r * 0.4), COL.steel, 3); };
// a wind-up toy car facing right, wheels at y + h/2, with a key sticking up
const toyCar = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 10, 62, 150, 18);
  shape(c, () => rrect(c, -140, -30, 280, 70, 20), COL.red); shade(c, () => rrect(c, -140, -30, 280, 70, 20), "#b8392b", 0, 24);
  shape(c, () => polyP(c, [[-70, -30], [-40, -80], [50, -80], [90, -30]]), COL.sky, 6);
  line(c, [[-10, -78], [-10, -32]], 5);
  wheel(c, -80, 42, 30); wheel(c, 80, 42, 30);
  thick(c, [[-110, -30], [-110, -62]], 6, COL.steel); shape(c, () => rrect(c, -135, -90, 50, 30, 14), GOLD, 5);
  c.restore();
};
const bottle = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const p = () => { const r = w / 2, sy = y - h * 0.7; c.moveTo(x - r + 16, y); c.lineTo(x + r - 16, y); c.quadraticCurveTo(x + r, y, x + r, y - 16); c.lineTo(x + r, sy); c.quadraticCurveTo(x + r, sy - 40, x + w * 0.14, y - h * 0.86); c.lineTo(x + w * 0.14, y - h); c.lineTo(x - w * 0.14, y - h); c.lineTo(x - w * 0.14, y - h * 0.86); c.quadraticCurveTo(x - r, sy - 40, x - r, sy); c.lineTo(x - r, y - 16); c.quadraticCurveTo(x - r, y, x - r + 16, y); c.closePath(); };
  return p;
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.8, y + Math.sin(a) * r * 1.8]], 7, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
};
const moon = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
  c.save(); c.beginPath(); ell(c, x + r * 0.5, y - r * 0.2, r * 0.85, r * 0.85); c.fillStyle = "#efe4cf"; c.fill(); c.restore();
  c.save(); c.beginPath(); c.rect(0, 0, D, D); ell(c, x + r * 0.5, y - r * 0.2, r * 0.85, r * 0.85); c.clip("evenodd"); c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); c.restore();
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); c.beginPath(); ell(c, x + r * 0.5, y - r * 0.2, r * 0.85, r * 0.85); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); c.restore();
};
const phone = (c: Ctx, x: number, y: number, w: number, h: number, pct: number) => {
  shadow(c, x + w * 0.1, y + h / 2 + 8, w * 0.6, 14);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 20), COL.black);
  shape(c, () => rrect(c, x - w * 0.42, y - h * 0.44, w * 0.84, h * 0.88, 8), "#d8ecf7", 3);
  const bw = w * 0.5, bx = x - bw / 2, by = y - h * 0.12;
  shape(c, () => rrect(c, bx, by, bw, h * 0.2, 6), WHITE, 5);
  shape(c, () => rrect(c, bx + bw, by + h * 0.06, 8, h * 0.08, 3), INK, 0);
  shape(c, () => rrect(c, bx + 6, by + 6, (bw - 12) * pct, h * 0.2 - 12, 3), pct > 0.4 ? COL.green : COL.red, 0);
};
const tap = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => rrect(c, -20, -40, 40, 90, 8), COL.steel);
  shape(c, () => rrect(c, -20, 20, 110, 36, 12), COL.steel);
  shape(c, () => rrect(c, 70, 20, 28, 56, 8), COL.steelDk);
  shape(c, () => rrect(c, -50, -60, 100, 26, 10), COL.red);
  c.restore();
};
const bucket = (c: Ctx, x: number, y: number, w: number, h: number, water = 0) => {
  shadow(c, x + w * 0.1, y + 6, w * 0.6, 14);
  const b = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
  shape(c, b, COL.steel); shade(c, b, COL.steelDk, w * 0.2, 0);
  if (water) shape(c, () => ell(c, x, y - h, w / 2, 14), COL.water, 5); else shape(c, () => ell(c, x, y - h, w / 2, 14), COL.steelIn, 5);
};

// ---------------------------------------------------------------- the pictures
const intro = (c: Ctx) => {
  ground(c); floor(c, 640);
  person(c, 330, 940, 760, { armL: [Math.PI * 0.8, Math.PI * 0.95], armR: [Math.PI * 0.2, Math.PI * 0.05] });
  jar(c, 780, 820, 380, 170);
  arrow(c, [[640, 960], [520, 960]], RED, 14);
};
const summary = (c: Ctx) => {
  ground(c);
  clock(c, 260, 300, 170, true);
  building(c, 640, 540, 300, 360, 3); tank(c, 790, 180, 130, 110);
  jar(c, 300, 800, 460, 200);
  banana(c, 700, 860, 1.1, 0.2);
  cell(c, 960, 960, 90, 230);
};
const e1 = (c: Ctx) => {
  ground(c); floor(c, 80);
  jar(c, 330, 300, 380, 170);
  arrow(c, [[560, 300], [820, 300]], RED, 14); arrow(c, [[820, 380], [700, 380]], RED, 14);
  write(c, "2", 880, 250, 100, INK, 12);
  jar(c, 330, 780, 380, 170);
  arrow(c, [[560, 780], [820, 780]], RED, 14); arrow(c, [[960, 860], [330, 860]], RED, 14);
  write(c, "6", 880, 730, 100, INK, 12);
};
const e2 = (c: Ctx) => {
  ground(c); table(c, 700);
  torch(c, 230, 580, 330, 130, 0.25);
  cell(c, 590, 700, 120, 290);
  clock(c, 850, 520, 140, false);
  for (const [a, b] of [[890, 330], [990, 350]]) line(c, [[a - 20, b], [a, b - 24]], 7, COL.greyDk);
};
const a1 = (c: Ctx) => {
  ground(c); floor(c, 760);
  person(c, 220, 1000, 700, { armR: [-0.2, -0.1] });
  shape(c, () => rrect(c, 420, 640, 620, 40, 6), COL.wood, 6);
  toyCar(c, 590, 570, 0.95); banana(c, 830, 640, 0.8, 0); cell(c, 970, 640, 70, 190);
};
const a2 = (c: Ctx) => {
  ground(c); table(c, 800);
  // flat, pressed down
  shape(c, () => polyP(c, [[110, 750], [470, 750], [500, 790], [80, 790]]), COL.wood, 6);
  thick(c, [[160, 750], [160, 700], [420, 700], [420, 750]], 8, BAND);
  hand(c, 290, 560, Math.PI * 0.5, 1.1, SKIN.child, CLOTH.child, true);
  // jumped up
  shadow(c, 770, 800, 220, 22);
  c.save(); c.translate(770, 430); c.rotate(-0.25);
  shape(c, () => polyP(c, [[-170, 20], [170, 20], [200, 60], [-140, 60]]), COL.wood, 6);
  thick(c, [[-120, 20], [-120, -30], [140, -30], [140, 20]], 8, BAND);
  c.restore();
  arrow(c, [[770, 700], [770, 560]], RED, 14);
};
const packet = (c: Ctx, x: number, y: number, w: number, h: number, col: string, dk: string, num: string) => {
  shadow(c, x + w * 0.1, y + 6, w * 0.6, 14);
  const b = () => rrect(c, x - w / 2, y - h, w, h, 10);
  shape(c, b, col); shade(c, b, dk, w * 0.14, 0);
  shape(c, () => ell(c, x, y - h * 0.5, w * 0.34, w * 0.34), WHITE, 5);
  if (num) write(c, num, x - num.length * w * 0.075, y - h * 0.5 - w * 0.12, w * 0.24, INK, 7);
};
const a3 = (c: Ctx) => {
  ground(c); table(c, 780);
  packet(c, 250, 790, 270, 380, COL.orange, "#d27c25", "450");
  packet(c, 560, 790, 270, 380, COL.paper, COL.grey, "360");
  packet(c, 870, 790, 270, 380, COL.greenLt, COL.green, "880");
};
const a4 = (c: Ctx) => {
  ground(c); table(c, 760);
  shape(c, () => rrect(c, 80, 600, 200, 160, 8), COL.red, 6);
  shape(c, () => rrect(c, 340, 690, 700, 70, 10), COL.steel);
  const p = bottle(c, 180, 600, 190, 440);
  shape(c, p, CLEAR, 0); c.save(); c.beginPath(); p(); c.clip(); c.fillStyle = COL.water; c.fillRect(0, 230, 600, 400); c.restore(); shape(c, p, NONE, 6);
  const jet = (y: number, dx: number) => { const pts: number[][] = []; for (let i = 0; i <= 16; i++) { const t = i / 16; pts.push([275 + t * dx, y + (692 - y) * t * t]); } return pts; };
  line(c, jet(300, 150), 14, COL.waterDk); line(c, jet(430, 330), 14, COL.waterDk); line(c, jet(560, 600), 14, COL.waterDk);
  for (const y of [300, 430, 560]) shape(c, () => ell(c, 275, y, 8, 8), INK, 0);
};
const a5 = (c: Ctx) => {
  ground(c);
  hand(c, 130, 540, 0, 1.3); hand(c, 950, 540, Math.PI, 1.3);
  const tw: number[][] = [], tw2: number[][] = [];
  for (let i = 0; i <= 20; i++) { const t = i / 20, x = 250 + t * 600, a = Math.sin(t * Math.PI * 7) * (t > 0.2 && t < 0.8 ? 16 : 3); tw.push([x, 540 + a]); tw2.push([x, 540 - a]); }
  line(c, tw, 12, INK); line(c, tw, 6, COL.paper); line(c, tw2, 12, INK); line(c, tw2, 6, COL.paper);
  shape(c, () => ell(c, 550, 540, 130, 130), COL.blue); shade(c, () => ell(c, 550, 540, 130, 130), COL.blueDk, 40, 40);
  shape(c, () => ell(c, 550, 540, 85, 85), COL.blueDk, 4);
  for (const dy of [-30, 30]) shape(c, () => ell(c, 550, 540 + dy, 12, 12), INK, 0);
  curlArrow(c, 550, 540, 190, Math.PI * 1.1, Math.PI * 1.9); curlArrow(c, 550, 540, 190, Math.PI * 0.9, Math.PI * 0.1);
};
const p1 = (c: Ctx) => {
  ground(c);
  [[200, 0.9], [540, 0.55], [880, 0.2]].forEach(([x, pct], i) => {
    phone(c, x, 620, 250, 480, pct);
    write(c, ["90", "55", "20"][i], x - 62, 480, 70, INK, 9);
    if (i === 0) sun(c, x, 250, 50); if (i === 1) sun(c, x, 250, 70); if (i === 2) moon(c, x, 250, 70);
  });
  arrow(c, [[300, 960], [780, 960]], RED, 12);
};
const c1 = (c: Ctx) => {
  ground(c); floor(c, 640);
  jar(c, 760, 800, 340, 150);
  write(c, "3", 720, 460, 110, INK, 12);
  arrow(c, [[960, 960], [320, 960]], RED, 14);
  shape(c, () => { c.moveTo(130, 520); c.lineTo(290, 520); c.quadraticCurveTo(290, 660, 210, 680); c.quadraticCurveTo(130, 660, 130, 520); c.closePath(); }, GOLD);
  shape(c, () => rrect(c, 195, 680, 30, 60, 4), GOLD); shape(c, () => rrect(c, 150, 740, 120, 36, 8), COL.brown);
  c.beginPath(); c.arc(130, 560, 36, Math.PI * 0.5, Math.PI * 1.5); c.strokeStyle = INK; c.lineWidth = 10; c.stroke();
  c.beginPath(); c.arc(290, 560, 36, -Math.PI * 0.5, Math.PI * 0.5); c.stroke();
};
const c2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 100, 90, 620, 860, 14), COL.wood); shade(c, () => rrect(c, 100, 90, 620, 860, 14), COL.woodDk, 24, 0);
  const chan = (x0: number, y0: number, x1: number, y1: number) => { thick(c, [[x0, y0], [x1, y1]], 26, COL.paper); };
  chan(150, 200, 650, 280); chan(660, 380, 180, 460); chan(170, 560, 650, 640); chan(660, 740, 200, 820);
  shape(c, () => ell(c, 190, 175, 22, 22), COL.blue, 5);
  arrow(c, [[300, 340], [520, 345]], RED, 8);
  shape(c, () => rrect(c, 856, 240, 48, 36, 6), COL.steel);
  shape(c, () => ell(c, 880, 420, 130, 130), COL.steel); shape(c, () => ell(c, 880, 420, 100, 100), COL.paper, 5);
  line(c, [[880, 420], [880, 345]], 8); line(c, [[880, 420], [935, 450]], 6);
};
// ---- terms
const t0 = (c: Ctx) => {
  ground(c);
  line(c, [[540, 20], [540, 150]], 14);
  for (const a of [0, 2.1, 4.2]) { c.save(); c.translate(540, 260); c.rotate(a + 0.3); shape(c, () => rrect(c, 20, -24, 190, 48, 22), COL.steel); c.restore(); }
  shape(c, () => ell(c, 540, 260, 44, 44), COL.red);
  curlArrow(c, 540, 260, 260, -0.5, 0.5);
  torch(c, 230, 780, 330, 120, 0.6);
  shape(c, () => rrect(c, 720, 660, 250, 190, 14), COL.steel); shade(c, () => rrect(c, 720, 660, 250, 190, 14), COL.steelDk, 40, 0);
  shape(c, () => rrect(c, 710, 630, 270, 44, 12), COL.steelDk); shape(c, () => rrect(c, 825, 600, 40, 36, 8), COL.black);
  for (const [x, y] of [[780, 520], [850, 450], [910, 520]]) shape(c, () => ell(c, x, y, 50, 36), WHITE, 5);
};
const t1 = (c: Ctx) => {
  ground(c); floor(c, 640);
  toyCar(c, 520, 700, 1.4);
  hand(c, 120, 740, 0, 1.6);
};
const t2 = (c: Ctx) => {
  ground(c);
  building(c, 120, 900, 480, 560, 4); tank(c, 360, 340, 280, 220);
  thick(c, [[640, 340], [700, 340], [700, 760]], 18, COL.steel);
  tap(c, 740, 740, 1.5);
  for (let i = 0; i < 3; i++) shape(c, () => ell(c, 850, 860 + i * 55, 14, 20), COL.water, 4);
};
const t3 = (c: Ctx) => {
  ground(c); floor(c, 640);
  shadow(c, 700, 840, 130, 20);
  for (let i = 0; i < 4; i++) line(c, [[220, 700 + i * 36], [440 - i * 30, 700 + i * 36]], 12, COL.greyDk);
  shape(c, () => ell(c, 700, 740, 120, 120), COL.red); shade(c, () => ell(c, 700, 740, 120, 120), "#b8392b", 36, 36);
  line(c, [[600, 690], [800, 690]], 4, WHITE); line(c, [[590, 790], [810, 790]], 4, WHITE);
  arrow(c, [[500, 540], [900, 540]], RED, 14);
};
const t5 = (c: Ctx) => {
  ground(c);
  const path: number[][] = []; for (let i = 0; i <= 30; i++) path.push([250 + i * 19, 480]);
  line(c, path, 130, INK); line(c, path, 116, WHITE);
  for (let i = 0; i < 22; i++) { const x = 270 + i * 26; line(c, [[x, 424], [x + 22, 536]], 7, COL.greyDk); }
  hand(c, 150, 480, 0, 1.4); hand(c, 930, 480, Math.PI, 1.4);
  curlArrow(c, 190, 480, 140, -2.6, -1.6); curlArrow(c, 890, 480, 140, 2.2, 1.2);
  bucket(c, 540, 930, 260, 180, 1);
  for (const x of [520, 560]) shape(c, () => ell(c, x, 700 + (x - 520) * 2, 12, 18), COL.water, 4);
};
const t6 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 540, 380, 380), COL.wood); shade(c, () => ell(c, 540, 540, 380, 380), COL.woodDk, 30, 30);
  shape(c, () => ell(c, 540, 540, 320, 320), COL.grey, 5);
  spiral(c, 540, 540, 30, 280, 4.5, 24);
  shape(c, () => ell(c, 540, 540, 40, 40), COL.steelDk, 6);
  curlArrow(c, 540, 540, 340, -2.2, -0.8);
};
const t7 = (c: Ctx) => {
  ground(c); table(c, 800);
  shape(c, () => rrect(c, 100, 580, 80, 220, 8), COL.paper); flame(c, 140, 570, 70, COL.orange, COL.yellow);
  shape(c, () => ell(c, 400, 780, 170, 38), COL.steel);
  for (const x of [340, 400, 460]) shape(c, () => ell(c, x, 730, 48, 40), WHITE, 5);
  cell(c, 640, 800, 110, 280);
  line(c, [[780, 700], [780, 800]], 12); line(c, [[1000, 700], [1000, 800]], 12);
  shape(c, () => rrect(c, 760, 600, 260, 100, 14), COL.black);
  flame(c, 840, 800, 80); flame(c, 930, 800, 80);
};
const t8 = (c: Ctx) => {
  ground(c); table(c, 800);
  const b = () => rrect(c, 120, 330, 230, 400, 70);
  shadow(c, 250, 740, 150, 20);
  shape(c, b, COL.red); shade(c, b, "#b8392b", 36, 0);
  shape(c, () => rrect(c, 190, 280, 90, 60, 10), COL.steel);
  thick(c, [[235, 290], [235, 170], [560, 170], [560, 520]], 14, COL.black);
  shape(c, () => rrect(c, 420, 520, 360, 280, 12), COL.steel); shade(c, () => rrect(c, 420, 520, 360, 280, 12), COL.steelDk, 40, 0);
  for (const x of [510, 690]) { shape(c, () => ell(c, x, 580, 52, 18), COL.black); }
  flame(c, 510, 585, 70); flame(c, 690, 585, 70);
  shape(c, () => ell(c, 600, 700, 22, 22), COL.red);
};
const t9 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(540, 540); c.rotate(-0.0);
  shape(c, () => rrect(c, -230, -440, 460, 880, 70), COL.black);
  shape(c, () => rrect(c, -170, -120, 340, 440, 20), "#4c4658", 5);
  c.restore();
  for (const x of [440, 640]) { cell(c, x, 730, 100, 340); }
  for (let i = 0; i < 4; i++) shape(c, () => ell(c, 450 + (i % 2) * 180, 200 + Math.floor(i / 2) * 90, 36, 36), [COL.red, COL.green, COL.blue, COL.yellow][i], 4);
  write(c, "+", 410, 790, 40, WHITE, 6); write(c, "-", 595, 790, 40, WHITE, 6);
};
const t12 = (c: Ctx) => {
  ground(c); table(c, 860);
  tap(c, 330, 330, 2); hand(c, 330, 150, Math.PI * 0.5, 1.2, SKIN.child, CLOTH.child, true);
  for (let i = 0; i < 6; i++) line(c, [[605, 440 + i * 50], [605, 470 + i * 50]], 14, COL.water);
  bucket(c, 620, 860, 340, 260, 1);
};
// ---- explanations
const glow = (c: Ctx, x: number, y: number, r: number) => { c.beginPath(); ell(c, x, y, r, r); c.setLineDash([14, 14]); c.strokeStyle = COL.orange; c.lineWidth = 7; c.stroke(); c.setLineDash([]); };
const x0 = (c: Ctx) => {
  ground(c);
  line(c, [[540, 40], [540, 1040]], 3, "#cbbd9f"); line(c, [[40, 540], [1040, 540]], 3, "#cbbd9f");
  for (const x of [160, 400]) shape(c, () => rrect(c, x - 22, 280, 44, 190, 20), SKIN.child, 5);
  thick(c, [[160, 330], [400, 330]], 12, BAND); thick(c, [[160, 400], [400, 400]], 12, BAND);
  glow(c, 280, 365, 190);
  thick(c, [[800, 470], [800, 180]], 36, COL.brown); for (const a of [-0.6, -2.5, -1.4]) leaf(c, 800, 170, 150, a, COL.leaf);
  shape(c, () => ell(c, 850, 215, 38, 38), COL.soilDk); glow(c, 850, 215, 80);
  building(c, 130, 1000, 300, 220, 2); tank(c, 280, 780, 150, 100); glow(c, 280, 730, 130);
  packet(c, 800, 1000, 220, 280, COL.paper, COL.grey, ""); glow(c, 800, 850, 190);
};
const x1 = (c: Ctx) => {
  ground(c);
  line(c, [[540, 40], [540, 1040]], 3, "#cbbd9f"); line(c, [[40, 540], [1040, 540]], 3, "#cbbd9f");
  // bow and arrow
  c.beginPath(); c.arc(170, 280, 180, -Math.PI * 0.45, Math.PI * 0.45); c.strokeStyle = INK; c.lineWidth = 26; c.stroke(); c.strokeStyle = COL.brown; c.lineWidth = 14; c.stroke();
  const by = 280, tipx = 170 + Math.cos(Math.PI * 0.45) * 180; line(c, [[tipx, by - 175], [100, by], [tipx, by + 175]], 5);
  thick(c, [[100, by], [440, by]], 8, COL.wood); shape(c, () => polyP(c, [[440, by - 22], [440, by + 22], [490, by]]), COL.steel, 5);
  // coiled spring
  spiral(c, 810, 280, 20, 150, 3.5, 22);
  // squashed mattress with a hand
  shape(c, () => rrect(c, 90, 800, 400, 70, 20), COL.pink); line(c, [[130, 835], [450, 835]], 4, "#d9708e");
  hand(c, 290, 640, Math.PI * 0.5, 1.2, SKIN.child, CLOTH.child, true);
  // twisted band in jar
  jar(c, 810, 800, 380, 170);
};
const x2 = (c: Ctx) => {
  ground(c);
  building(c, 330, 1000, 420, 760, 4); tank(c, 540, 240, 260, 180);
  shape(c, () => rrect(c, 90, 880, 120, 90, 10), COL.teal); shape(c, () => ell(c, 150, 925, 26, 26), COL.tealDk, 4);
  thick(c, [[210, 920], [210, 120], [400, 120]], 14, COL.steel);
  arrow(c, [[280, 800], [280, 400]], RED, 12);
  thick(c, [[790, 330], [850, 330], [850, 960]], 14, COL.steel);
  [[400, 8], [580, 18], [760, 34], [930, 56]].forEach(([y, len]) => { thick(c, [[850, y], [880, y]], 12, COL.steel); const pts: number[][] = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push([880 + t * len * 2.4, y + 10 + t * t * 70]); } line(c, pts, 10, COL.waterDk); });
};
const oilBottle = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const p = bottle(c, x, y, w, h); shape(c, p, COL.yellow); shade(c, p, COL.orange, w * 0.14, 0); shape(c, () => rrect(c, x - w * 0.16, y - h - 18, w * 0.32, 24, 6), COL.red, 4);
  shape(c, () => ell(c, x, y - h * 0.4, w * 0.3, w * 0.3), WHITE, 4);
};
const x3 = (c: Ctx) => {
  ground(c);
  line(c, [[540, 40], [540, 1040]], 3, "#cbbd9f"); line(c, [[40, 540], [1040, 540]], 3, "#cbbd9f");
  shape(c, () => ell(c, 270, 400, 210, 60), COL.steel); shape(c, () => ell(c, 270, 380, 160, 46), "#e9c27a", 5); banana(c, 190, 340, 0.45, 0.1);
  oilBottle(c, 810, 480, 170, 340);
  c.save(); c.translate(270, 900); for (const a of [-0.3, 0.3]) { c.save(); c.rotate(a); shape(c, () => rrect(c, -150, -20, 300, 44, 20), COL.brown); c.restore(); } c.restore();
  flame(c, 270, 820, 150, COL.orange, COL.yellow);
  packet(c, 810, 990, 200, 260, COL.paper, COL.grey, "");
};
const x4 = (c: Ctx) => {
  ground(c); table(c, 700);
  torch(c, 190, 590, 260, 120, 0.25);
  arrow(c, [[340, 620], [440, 620]], RED, 12);
  cell(c, 560, 700, 100, 250);
  arrow(c, [[660, 620], [740, 620]], RED, 12);
  clock(c, 890, 560, 120, false);
};
const x5 = (c: Ctx) => {
  ground(c);
  for (let i = 0; i < 7; i++) shape(c, () => rrect(c, 70 + i * 135, 90, 115, 115, 10), i === 0 ? GLOW : WHITE, 5);
  shape(c, () => ell(c, 127, 147, 18, 18), RED, 0);
  clock(c, 880, 148, 42, false);
  arrow(c, [[200, 270], [880, 270]], RED, 10);
  clock(c, 230, 700, 130, true);
  person(c, 640, 1000, 640, { adult: true, armL: [Math.PI * 0.97, Math.PI], armR: [Math.PI * 0.45, Math.PI * 0.5] });
};
const x6 = (c: Ctx) => {
  ground(c); floor(c, 440);
  jar(c, 170, 700, 250, 120);
  let y = 560, x = 330, dir = 1, len = 640;
  for (let i = 0; i < 5; i++) { arrow(c, [[x, y], [x + dir * len, y]], RED, 12); x += dir * len; len *= 0.62; dir = -dir; y += 90; }
  for (const r of [30, 60]) { c.beginPath(); c.arc(170, 550, r + 20, -2.2, -0.9); c.strokeStyle = COL.greyDk; c.lineWidth = 6; c.stroke(); }
  for (const x2 of [600, 720, 840]) { const pts: number[][] = []; for (let i = 0; i <= 10; i++) pts.push([x2 + Math.sin(i) * 14, 380 - i * 22]); line(c, pts, 10, COL.orange); }
};
const x7 = (c: Ctx) => {
  ground(c);
  line(c, [[540, 40], [540, 1040]], 3, "#cbbd9f"); line(c, [[40, 540], [1040, 540]], 3, "#cbbd9f");
  shape(c, () => ell(c, 150, 330, 110, 60, -0.2), "#e3b57a"); line(c, [[150, 275], [150, 385]], 4, COL.brown);
  shape(c, () => ell(c, 130, 340, 36, 30), "#f0d9b8", 4); shape(c, () => ell(c, 205, 320, 36, 30), "#f0d9b8", 4);
  glow(c, 150, 335, 130);
  thick(c, [[800, 480], [800, 330]], 16, COL.greenLt); leaf(c, 800, 330, 110, -0.6); leaf(c, 800, 330, 110, -2.5);
  shape(c, () => rrect(c, 700, 470, 200, 36, 8), COL.soilDk);
  const cx = 270, cy = 790;
  shadow(c, cx, cy + 150, 200, 20);
  for (const dx of [-120, -70, 70, 120]) thick(c, [[cx + dx, cy + 40], [cx + dx, cy + 150]], 22, COL.woodDk);
  thick(c, [[cx + 140, cy - 20], [cx + 200, cy - 120]], 44, COL.wood);
  shape(c, () => ell(c, cx, cy, 170, 70), COL.wood);
  shape(c, () => ell(c, cx - 20, cy - 80, 60, 70), COL.wood); glow(c, cx - 20, cy - 80, 100);
  shape(c, () => ell(c, cx + 235, cy - 140, 55, 34, -0.3), COL.wood);
  person(c, 810, 1000, 420, { armL: [Math.PI * 0.8, Math.PI * 0.6], armR: [-0.5, Math.PI * 0.3] });
  glow(c, 810, 800, 170);
};

export const ic_energyStoredEnergyL3 = cards("sci.energy.stored-energy.L3 cards", [
  intro, summary, e1, e2, a1, a2, a3, a4, a5, p1, c1, c2, t0, t1, t2, t3, t5, t6, t7, t8, t9, t12, x0, x1, x2, x3, x4, x5, x6, x7,
]);
