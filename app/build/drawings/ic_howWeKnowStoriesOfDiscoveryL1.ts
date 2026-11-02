import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, leaf, hand, person, write, cards } from "./flatKit";

// CURIOUS PEOPLE · the haldi test. Flat set-up cards and card pictures: haldi (turmeric) paper goes
// red with soap or cooking soda, stays yellow with lemon, water, salt, sugar; lemon turns a red spot
// back to yellow. The same girl (orange top) and grown-up (blue) on every card.

const HALDI = "#f4c431", HALDI_DK = "#d9a21d", SPOT_RED = "#c9352c", SPOT_YEL = "#e2a81c", PENCIL = "#8b8578";
const LEMON = "#f7df5a", LEMON_DK = "#d8b92a", SOAP = "#f29ab4", SOAP_DK = "#d87a98", SODA = "#5b8fd6";
const LIQ = { water: COL.water, lemon: "#f6e68a", salt: "#d8e9f6", sugar: "#e2eef8", soap: "#e9eef3", soda: "#eef3f8" };

// ---------------------------------------------------------------- small props
const dropIcon = (c: Ctx, x: number, y: number, s: number, col = COL.water) =>
  shape(c, () => { c.moveTo(x, y - s); c.quadraticCurveTo(x + s * 0.7, y - s * 0.1, x + s * 0.7, y + s * 0.3); c.arc(x, y + s * 0.3, s * 0.7, 0, Math.PI); c.quadraticCurveTo(x - s * 0.7, y - s * 0.1, x, y - s); c.closePath(); }, col, 4);
const lemonIcon = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => ell(c, x, y, s, s * 0.7), LEMON, 4);
  shape(c, () => ell(c, x - s * 0.95, y, s * 0.18, s * 0.14), LEMON_DK, 3); shape(c, () => ell(c, x + s * 0.95, y, s * 0.18, s * 0.14), LEMON_DK, 3);
  leaf(c, x + s * 0.3, y - s * 0.6, s * 0.6, -0.9);
};
const lemonHalf = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), LEMON, 5);
  shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), "#fbf0a8", 3);
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; line(c, [[x, y], [x + Math.cos(a) * r * 0.75, y + Math.sin(a) * r * 0.75]], 3, LEMON_DK); }
};
const saltIcon = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - s, y + s * 0.4); c.quadraticCurveTo(x, y - s * 0.9, x + s, y + s * 0.4); c.closePath(); }, WHITE, 4);
  const r = rnd(3); for (let k = 0; k < 7; k++) shape(c, () => ell(c, x - s * 0.5 + r() * s, y - s * 0.1 + r() * s * 0.4, s * 0.08, s * 0.08), COL.grey, 2);
};
const sugarIcon = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => polyP(c, [[x - s * 0.6, y - s * 0.3], [x + s * 0.3, y - s * 0.3], [x + s * 0.3, y + s * 0.6], [x - s * 0.6, y + s * 0.6]]), WHITE, 4);
  shape(c, () => polyP(c, [[x - s * 0.6, y - s * 0.3], [x - s * 0.2, y - s * 0.7], [x + s * 0.7, y - s * 0.7], [x + s * 0.3, y - s * 0.3]]), "#f1f1f1", 4);
  shape(c, () => polyP(c, [[x + s * 0.3, y - s * 0.3], [x + s * 0.7, y - s * 0.7], [x + s * 0.7, y + s * 0.2], [x + s * 0.3, y + s * 0.6]]), COL.grey, 4);
};
const soapBar = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + s * 0.1, y + s * 0.55, s, s * 0.2);
  shape(c, () => rrect(c, x - s, y - s * 0.5, s * 2, s, s * 0.35), SOAP, 5);
  shade(c, () => rrect(c, x - s, y - s * 0.5, s * 2, s, s * 0.35), SOAP_DK, s * 0.3, s * 0.2);
  for (const [bx, by, br] of [[-0.6, -0.8, 0.22], [-0.2, -1.05, 0.15], [0.15, -0.85, 0.12]]) shape(c, () => ell(c, x + bx * s, y + by * s, br * s, br * s), WHITE, 3);
};
const sodaTin = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + s * 0.15, y + s * 0.95, s * 0.8, s * 0.15);
  shape(c, () => rrect(c, x - s * 0.6, y - s * 0.9, s * 1.2, s * 1.8, s * 0.1), SODA, 5);
  shade(c, () => rrect(c, x - s * 0.6, y - s * 0.9, s * 1.2, s * 1.8, s * 0.1), COL.blueDk, s * 0.4, 0);
  shape(c, () => ell(c, x, y - s * 0.9, s * 0.6, s * 0.16), COL.steel, 4);
  shape(c, () => rrect(c, x - s * 0.4, y - s * 0.4, s * 0.8, s * 0.7, s * 0.08), WHITE, 3);
};
const icons: Record<string, (c: Ctx, x: number, y: number, s: number) => void> = {
  water: (c, x, y, s) => dropIcon(c, x, y, s), lemon: lemonIcon, salt: saltIcon, sugar: sugarIcon,
  soap: (c, x, y, s) => soapBar(c, x, y + s * 0.2, s * 0.8), soda: (c, x, y, s) => sodaTin(c, x, y, s * 0.75),
};
const ORDER = ["water", "lemon", "salt", "sugar", "soap", "soda"] as const;
// a katori of one of the six liquids
const katori = (c: Ctx, x: number, y: number, r: number, liq: keyof typeof LIQ) => {
  bowl(c, x, y, r, LIQ[liq]);
  if (liq === "soap" || liq === "soda") for (const [bx, by] of [[-0.4, -0.05], [0.1, 0.06], [0.45, -0.04]]) shape(c, () => ell(c, x + bx * r, y + by * r, r * 0.07, r * 0.05), WHITE, 2);
  shine(c, [[x - r * 0.5, y + r * 0.2], [x - r * 0.2, y + r * 0.45]], 6);
};
// a white paper tag with a picture label on it
const tag = (c: Ctx, x: number, y: number, w: number, h: number, name: string) => {
  shadow(c, x + 8, y + h / 2 + 8, w / 2, h * 0.12);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 10), WHITE, 5);
  icons[name](c, x, y + 4, h * 0.3);
};
// the haldi paper: white sheet painted yellow (0..1 of its width), pencil grid of six boxes
const paper = (c: Ctx, x: number, y: number, w: number, h: number, painted = 1, boxes = true) => {
  shadow(c, x + w / 2 + 14, y + h + 10, w / 2, 16);
  shape(c, () => rrect(c, x, y, w, h, 8), COL.paper, 6);
  if (painted > 0) {
    c.save(); c.beginPath(); rrect(c, x, y, w, h, 8); c.clip();
    c.fillStyle = HALDI; c.fillRect(x, y, w * painted, h);
    c.globalAlpha = 0.5; c.strokeStyle = HALDI_DK; c.lineWidth = 7; c.lineCap = "round";
    for (let k = 0; k < 9; k++) { c.beginPath(); c.moveTo(x + 20, y + 30 + k * (h - 60) / 8); c.lineTo(x + w * painted - 25, y + 24 + k * (h - 60) / 8); c.stroke(); }
    c.globalAlpha = 1; c.restore();
  }
  if (boxes) { c.strokeStyle = PENCIL; c.lineWidth = 4; const bw = (w - 60) / 3, bh = (h - 50) / 2; for (let k = 0; k < 6; k++) c.strokeRect(x + 30 + (k % 3) * bw + 8, y + 25 + Math.floor(k / 3) * bh + 8, bw - 16, bh - 16); }
};
const boxC = (x: number, y: number, w: number, h: number, k: number): [number, number] => [x + 30 + ((k % 3) + 0.5) * ((w - 60) / 3), y + 25 + (Math.floor(k / 3) + 0.5) * ((h - 50) / 2)];
// a wet spot: red (soap) or yellow (still haldi)
const spot = (c: Ctx, x: number, y: number, r: number, red = true) => {
  const col = red ? SPOT_RED : SPOT_YEL;
  shape(c, () => { c.moveTo(x + r, y); for (let k = 1; k <= 12; k++) { const a = (k / 12) * Math.PI * 2, rr = r * (1 + 0.08 * Math.sin(k * 2.7)); c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); }, col, 3);
  shape(c, () => ell(c, x - r * 0.3, y - r * 0.3, r * 0.22, r * 0.14), red ? "#e05a4e" : "#f1c249", 0);
};
// a red spot going back to yellow: yellow spreading from the middle
const spotBack = (c: Ctx, x: number, y: number, r: number, t: number) => { spot(c, x, y, r, true); spot(c, x, y, r * t, false); };
const cottonBud = (c: Ctx, x: number, y: number, an: number, len: number) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len;
  line(c, [[x, y], [tx, ty]], 14, INK); line(c, [[x, y], [tx, ty]], 7, WHITE);
  shape(c, () => ell(c, tx, ty, 16, 16), WHITE, 5);
};
const brush = (c: Ctx, x: number, y: number, an: number, len: number) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len;
  line(c, [[x, y], [tx, ty]], 22, INK); line(c, [[x, y], [tx, ty]], 13, COL.wood);
  shape(c, () => rrect(c, -14, -16, 28, 32, 6), COL.steel, 0);
  c.save(); c.translate(tx, ty); c.rotate(an); shape(c, () => rrect(c, -8, -17, 24, 34, 6), COL.steel, 5); shape(c, () => { c.moveTo(16, -17); c.lineTo(52, -20); c.lineTo(58, 20); c.lineTo(16, 17); c.closePath(); }, HALDI, 5); c.restore();
};
const pencil = (c: Ctx, x: number, y: number, an: number, len: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -len * 0.1, -12, len * 0.85, 24, 4), COL.yellow, 5);
  shape(c, () => polyP(c, [[len * 0.75, -12], [len, 0], [len * 0.75, 12]]), "#f3dcb4", 5);
  shape(c, () => polyP(c, [[len * 0.93, -3], [len, 0], [len * 0.93, 3]]), INK, 2);
  shape(c, () => rrect(c, -len * 0.1, -12, len * 0.1, 24, 3), SOAP, 4);
  c.restore();
};
const qmark = (c: Ctx, x: number, y: number, s: number, col = INK, w = 14) => {
  c.beginPath(); c.arc(x, y - s * 0.6, s * 0.3, Math.PI, Math.PI * 2.35); c.lineTo(x, y - s * 0.12); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; c.stroke();
  shape(c, () => ell(c, x, y + s * 0.18, w * 0.6, w * 0.6), col, 0);
};
const tick = (c: Ctx, x: number, y: number, s: number) => line(c, [[x - s, y], [x - s * 0.3, y + s * 0.7], [x + s, y - s * 0.8]], 9, COL.greenDk);
const cross = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - s, y - s], [x + s, y + s]], 9, RED); line(c, [[x + s, y - s], [x - s, y + s]], 9, RED); };
const table = (c: Ctx, y: number) => {
  shape(c, () => polyP(c, [[40, y], [1040, y], [1040, y + 60], [40, y + 60]]), COL.brown, 6);
  shape(c, () => polyP(c, [[70, y], [1010, y], [1010, y + 40], [70, y + 40]]), COL.wood, 0);
  for (const lx of [120, 960]) line(c, [[lx, y + 60], [lx, D]], 26, COL.soilDk);
};
// shoulder->elbow->wrist maths of person(): where the hand is for a standing figure
const wristAt = (x: number, y: number, h: number, side: -1 | 1, [a1, a2]: [number, number]): [number, number] => {
  const sy = y - h * 0.74 + h * 0.03, sx = x + side * h * 0.11, ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};
const UP_R: [number, number] = [-Math.PI * 0.25, -Math.PI * 0.55], UP_L: [number, number] = [-Math.PI * 0.75, -Math.PI * 0.45];
const FWD_R: [number, number] = [Math.PI * 0.15, -Math.PI * 0.15], FWD_L: [number, number] = [Math.PI * 0.85, Math.PI * 1.15];
const DOWN: [number, number] = [Math.PI * 0.5, Math.PI * 0.5];
const crow = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => ell(c, x, y - s * 0.5, s, s * 0.55), COL.black, 5);
  line(c, [[x - s * 0.9, y - s * 0.5], [x - s * 1.6, y - s * 0.35]], s * 0.35, INK);
  shape(c, () => ell(c, x + s * 0.8, y - s * 1.05, s * 0.42, s * 0.4), COL.black, 5);
  shape(c, () => polyP(c, [[x + s * 1.15, y - s * 1.15], [x + s * 1.6, y - s * 1.0], [x + s * 1.15, y - s * 0.9]]), COL.orange, 3);
  shape(c, () => ell(c, x + s * 0.9, y - s * 1.12, s * 0.07, s * 0.07), WHITE, 0);
  for (const lx of [-0.2, 0.2]) line(c, [[x + lx * s, y - s * 0.1], [x + lx * s, y]], 5, INK);
};

// ---------------------------------------------------------------- set-up cards · e1
const setupE1_0 = (c: Ctx) => {
  ground(c);
  // newspaper
  shape(c, () => rrect(c, 40, 250, 1000, 680, 6), "#e9e5da", 5);
  c.strokeStyle = COL.grey; c.lineWidth = 3; for (let k = 0; k < 14; k++) { c.beginPath(); c.moveTo(80, 300 + k * 44); c.lineTo(1000, 300 + k * 44); c.stroke(); }
  c.fillStyle = COL.greyDk; c.fillRect(80, 270, 300, 18);
  ORDER.forEach((n, i) => { const x = 130 + i * 164; tag(c, x, 420, 128, 120, n); katori(c, x, 680, 74, n); });
};
const setupE1_1 = (c: Ctx) => {
  ground(c);
  katori(c, 150, 880, 90, "water"); c.save(); shape(c, () => ell(c, 150, 880, 90, 18), HALDI, 0); c.restore();
  paper(c, 250, 270, 620, 520, 0.6, true);
  hand(c, 640, 820, -Math.PI * 0.6, 1.5, SKIN.child, CLOTH.child, true);
  // haldi on the fingers and a fresh streak under them
  c.save(); c.translate(640, 820); c.rotate(-Math.PI * 0.6); c.scale(1.5, 1.5); c.globalAlpha = 0.85; c.fillStyle = HALDI; for (let k = 0; k < 4; k++) c.beginPath(), ell(c, 86 - Math.abs(k - 1.3) * 7, -22 + k * 17, 14, 8), c.fill(); c.restore();
  arrow(c, [[560, 520], [660, 500]], RED, 9);
};
const setupE1_2 = (c: Ctx) => {
  ground(c);
  paper(c, 250, 270, 620, 520, 1, true);
  const [bx, by] = boxC(250, 270, 620, 520, 1); spot(c, bx, by, 44, true);
  katori(c, 900, 900, 90, "soap");
  cottonBud(c, 720, 640, Math.atan2(by - 640, bx - 720), Math.hypot(bx - 720, by - 640) - 10);
  hand(c, 800, 780, Math.atan2(640 - 780, 720 - 800), 1.4);
  arrow(c, [[860, 790], [700, 560]], RED, 9);
};
const setupE1_3 = (c: Ctx) => {
  ground(c);
  paper(c, 50, 300, 520, 460, 1, true);
  for (let k = 0; k < 6; k++) { const [bx, by] = boxC(50, 300, 520, 460, k); spot(c, bx, by, 38, k >= 4); }
  // results table: six rows, a picture label and a tick (went red) or a cross (stayed yellow)
  shadow(c, 810, 780, 220, 18);
  shape(c, () => rrect(c, 610, 260, 410, 520, 10), WHITE, 6);
  c.strokeStyle = PENCIL; c.lineWidth = 4; for (let k = 1; k < 6; k++) { c.beginPath(); c.moveTo(620, 260 + k * 86.6); c.lineTo(1010, 260 + k * 86.6); c.stroke(); } c.beginPath(); c.moveTo(815, 262); c.lineTo(815, 778); c.stroke();
  ORDER.forEach((n, i) => { const y = 260 + (i + 0.5) * 86.6; icons[n](c, 712, y, 26); if (i >= 4) tick(c, 912, y, 22); else cross(c, 912, y, 18); });
};
// ---------------------------------------------------------------- set-up cards · e2
const setupE2_0 = (c: Ctx) => {
  ground(c);
  paper(c, 140, 250, 800, 520, 1, false);
  for (let k = 0; k < 3; k++) spot(c, 300 + k * 240, 510, 72, true);
  katori(c, 760, 920, 80, "soap"); soapBar(c, 940, 905, 60);
};
const setupE2_1 = (c: Ctx) => {
  ground(c);
  paper(c, 140, 330, 800, 520, 1, false);
  spotBack(c, 300, 590, 72, 0.55); spot(c, 540, 590, 72, true); spot(c, 780, 590, 72, true);
  dropIcon(c, 300, 455, 22, LEMON);
  lemonHalf(c, 300, 300, 95);
  hand(c, 470, 180, Math.PI * 0.8, 1.3);
  arrow(c, [[300, 390], [300, 500]], RED, 9);
  katori(c, 940, 990, 70, "water"); dropIcon(c, 660, 990, 26, COL.water);
};

// ---------------------------------------------------------------- card pictures
const flowE2 = (c: Ctx) => {
  ground(c);
  person(c, 230, 980, 640, { adult: true, armR: FWD_R, armL: DOWN });
  person(c, 860, 980, 500, { armL: FWD_L, armR: DOWN });
  table(c, 700);
  paper(c, 220, 540, 640, 240, 1, false);
  spotBack(c, 330, 660, 52, 0.6); spot(c, 540, 660, 52, true); spot(c, 750, 660, 52, true);
  lemonHalf(c, 330, 480, 48); dropIcon(c, 540, 475, 24, COL.water); soapBar(c, 750, 480, 36);
  arrow(c, [[330, 540], [330, 600]], RED, 7); arrow(c, [[540, 540], [540, 600]], RED, 7); arrow(c, [[750, 540], [750, 600]], RED, 7);
};
const flowA1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6d9c0"; c.fillRect(0, 0, D, D);
  // window: sky, clouds, tree, wire, crow
  shape(c, () => rrect(c, 150, 60, 780, 580, 12), COL.sky, 10);
  c.save(); c.beginPath(); rrect(c, 150, 60, 780, 580, 12); c.clip();
  for (const [cx, cy, s] of [[330, 170, 1], [720, 130, 0.8]]) { shape(c, () => { ell(c, cx, cy, 90 * s, 42 * s); }, WHITE, 5); shape(c, () => ell(c, cx - 30 * s, cy - 25 * s, 50 * s, 40 * s), WHITE, 5); shape(c, () => ell(c, cx + 35 * s, cy - 20 * s, 42 * s, 34 * s), WHITE, 5); shape(c, () => ell(c, cx, cy + 4, 88 * s, 34 * s), WHITE, 0); }
  shape(c, () => rrect(c, 250, 420, 44, 240, 8), COL.brown, 6);
  shape(c, () => ell(c, 272, 380, 150, 125), COL.leaf, 6); shape(c, () => ell(c, 230, 330, 90, 80), COL.green, 6); shape(c, () => ell(c, 330, 320, 80, 72), COL.greenLt, 6);
  line(c, [[150, 300], [930, 330]], 6, INK);
  crow(c, 640, 318, 42);
  c.restore();
  shape(c, () => rrect(c, 150, 60, 780, 580, 12), "rgba(0,0,0,0)", 10);
  line(c, [[540, 60], [540, 640]], 12, INK); line(c, [[150, 350], [930, 350]], 12, INK);
  person(c, 400, 1060, 480, { armR: UP_R, armL: DOWN });
  person(c, 760, 1060, 600, { adult: true, armL: UP_L, armR: DOWN });
};
const flowA2 = (c: Ctx) => {
  ground(c);
  paper(c, 200, 180, 680, 620, 0, false);
  // the hidden red star: visible only where haldi water has been brushed
  c.save(); c.beginPath(); c.rect(200, 180, 680 * 0.55, 620); c.clip();
  c.fillStyle = HALDI; c.fillRect(200, 180, 680 * 0.55, 620);
  c.globalAlpha = 0.5; c.strokeStyle = HALDI_DK; c.lineWidth = 8; for (let k = 0; k < 10; k++) { c.beginPath(); c.moveTo(220, 215 + k * 60); c.lineTo(560, 210 + k * 60); c.stroke(); } c.globalAlpha = 1;
  const star = () => { for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, r = k % 2 ? 90 : 200; k ? c.lineTo(540 + Math.cos(a) * r, 490 + Math.sin(a) * r) : c.moveTo(540 + Math.cos(a) * r, 490 + Math.sin(a) * r); } c.closePath(); };
  c.beginPath(); star(); c.fillStyle = SPOT_RED; c.fill(); c.lineWidth = 18; c.strokeStyle = SPOT_RED; c.lineJoin = "round"; c.stroke();
  c.restore();
  katori(c, 140, 960, 90, "water"); shape(c, () => ell(c, 140, 960, 90, 18), HALDI, 0);
  brush(c, 760, 760, Math.atan2(470 - 760, 580 - 760), 330);
  hand(c, 840, 860, Math.atan2(760 - 860, 760 - 840), 1.5, SKIN.adult, CLOTH.adult);
  arrow(c, [[470, 920], [720, 920]], RED, 10);
};
const flowA3 = (c: Ctx) => {
  ground(c);
  table(c, 760);
  person(c, 420, 1000, 560, { armL: UP_L, armR: FWD_R });
  person(c, 860, 1000, 660, { adult: true, armL: DOWN, armR: DOWN });
  // leaf in the left hand, cup of cool water in the right
  const [lx, ly] = wristAt(420, 1000, 560, -1, UP_L); leaf(c, lx + 10, ly - 10, 150, -1.1, COL.leaf); leaf(c, lx + 10, ly - 10, 110, -1.9, COL.green);
  const [gx, gy] = wristAt(420, 1000, 560, 1, FWD_R); glass(c, gx + 30, gy + 50, 90, 120, 0.6);
  // the old book, open, a clue card on its page
  shadow(c, 190, 760, 170, 18);
  shape(c, () => polyP(c, [[40, 640], [200, 660], [200, 760], [40, 740]]), COL.paper, 6); shape(c, () => polyP(c, [[200, 660], [360, 640], [360, 740], [200, 760]]), COL.paper, 6);
  shape(c, () => polyP(c, [[30, 630], [200, 650], [370, 630], [370, 650], [200, 672], [30, 650]]), COL.soilDk, 5);
  c.strokeStyle = PENCIL; c.lineWidth = 3; for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(60, 680 + k * 16); c.lineTo(180, 684 + k * 16); c.stroke(); }
  shape(c, () => rrect(c, 230, 660, 110, 70, 6), "#fff4c2", 5); line(c, [[250, 682], [320, 682]], 4, PENCIL); line(c, [[250, 700], [310, 700]], 4, PENCIL);
};
const flowP1 = (c: Ctx) => {
  ground(c);
  // the open wonder book: left page a question, right page the spoon test drawing
  shadow(c, 560, 830, 420, 24);
  shape(c, () => polyP(c, [[140, 260], [540, 290], [540, 820], [140, 790]]), COL.paper, 6);
  shape(c, () => polyP(c, [[540, 290], [940, 260], [940, 790], [540, 820]]), COL.paper, 6);
  for (const y of [360, 500, 640]) shape(c, () => ell(c, 540, y, 10, 16), COL.steel, 4);
  qmark(c, 340, 520, 300, PENCIL, 20);
  // child's drawing: a bowl of water, a steel spoon sunk, a plastic spoon floating
  c.strokeStyle = PENCIL; c.lineWidth = 5; c.lineCap = "round";
  shape(c, () => { c.moveTo(600, 520); c.bezierCurveTo(620, 700, 860, 700, 880, 520); c.closePath(); }, COL.water, 5);
  shape(c, () => ell(c, 740, 520, 140, 30), COL.sky, 5);
  shape(c, () => ell(c, 660, 500, 50, 18, 0.1), COL.pink, 5); line(c, [[705, 500], [790, 470]], 10, COL.pink);
  shape(c, () => ell(c, 720, 630, 44, 16, 0.15), COL.steel, 5); line(c, [[760, 625], [830, 590]], 9, COL.steel);
  pencil(c, 760, 760, -Math.PI * 0.75, 200); hand(c, 840, 830, -Math.PI * 0.75, 1.3);
};
const term0 = (c: Ctx) => {
  ground(c);
  person(c, 320, 940, 560, { armR: FWD_R, armL: DOWN });
  qmark(c, 320, 330, 190, RED, 18);
  // the white shirt laid flat, a red spot on the front
  shadow(c, 730, 930, 300, 26);
  shape(c, () => polyP(c, [[520, 560], [620, 500], [700, 520], [780, 500], [880, 560], [940, 680], [860, 710], [850, 920], [560, 920], [550, 710], [470, 680]]), COL.cloth, 6);
  shape(c, () => { c.moveTo(620, 500); c.quadraticCurveTo(700, 580, 780, 500); c.quadraticCurveTo(700, 540, 620, 500); c.closePath(); }, COL.steelIn, 5);
  for (let k = 0; k < 4; k++) shape(c, () => ell(c, 705, 580 + k * 80, 9, 9), COL.steel, 3);
  spot(c, 620, 700, 60, true);
  line(c, [[520, 560], [470, 680]], 6, INK);
};
const term1 = (c: Ctx) => {
  ground(c);
  const H = 460, Y = 940;
  // a woman with a notebook, a girl with a hand lens, an old man looking up at the sky, a woman with a leaf
  person(c, 150, Y, H, { adult: true, armR: FWD_R, armL: DOWN });
  const [nx, ny] = wristAt(150, Y, H, 1, FWD_R); shape(c, () => rrect(c, nx - 20, ny - 60, 90, 120, 6), WHITE, 5); for (let k = 0; k < 4; k++) line(c, [[nx, ny - 40 + k * 24], [nx + 50, ny - 40 + k * 24]], 4, PENCIL);
  shape(c, () => ell(c, 150 - H * 0.13, Y - H * 0.74 - H * 0.13 * 1.4, 28, 28), CLOTH.hair, 4);
  person(c, 400, Y, H, { armR: UP_R, armL: DOWN });
  const [lx, ly] = wristAt(400, Y, H, 1, UP_R); line(c, [[lx, ly], [lx + 40, ly - 50]], 14, INK); shape(c, () => ell(c, lx + 62, ly - 78, 44, 44), COL.glass, 8); shine(c, [[lx + 45, ly - 95], [lx + 55, ly - 105]], 6);
  person(c, 640, Y, H, { adult: true, armR: UP_R, armL: DOWN });
  const hy = Y - H * 0.74 - H * 0.13 * 1.05, hd = H * 0.13;
  shape(c, () => { c.moveTo(640 - hd * 1.02, hy); c.bezierCurveTo(640 - hd, hy - hd * 1.5, 640 + hd, hy - hd * 1.5, 640 + hd * 1.02, hy); c.quadraticCurveTo(640, hy - hd * 0.55, 640 - hd * 1.02, hy); c.closePath(); }, "#e8e4dc", 5);
  shape(c, () => ell(c, 640, hy + hd * 0.6, hd * 0.5, hd * 0.25), "#e8e4dc", 4);
  for (const [sx, sy] of [[690, 150], [760, 90], [820, 190], [740, 250]]) { c.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, r = k % 2 ? 7 : 16; k ? c.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r) : c.moveTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); } c.closePath(); c.fillStyle = COL.yellow; c.fill(); c.lineWidth = 3; c.strokeStyle = INK; c.stroke(); }
  person(c, 900, Y, H, { adult: true, armL: FWD_L, armR: DOWN });
  const [fx, fy] = wristAt(900, Y, H, -1, FWD_L); leaf(c, fx, fy, 130, -1.3, COL.leaf);
  shape(c, () => ell(c, 900 + H * 0.13, Y - H * 0.74 - H * 0.13 * 1.1, 26, 26), CLOTH.hair, 4);
};
const term2 = (c: Ctx) => {
  ground(c);
  person(c, 330, 1000, 580, { armR: UP_R, armL: DOWN });
  person(c, 860, 1000, 680, { adult: true, armL: FWD_L, armR: DOWN });
  const [px, py] = wristAt(330, 1000, 580, 1, UP_R);
  paper(c, px - 120, py - 260, 300, 240, 1, false);
  spot(c, px + 110, py - 140, 60, true);
};
const term3 = (c: Ctx) => {
  ground(c);
  const L: (keyof typeof LIQ)[] = ["water", "lemon", "soap", "soda"];
  L.forEach((n, i) => { const x = 180 + i * 240; katori(c, x, 330, 88, n); icons[n](c, x, 180, 34); });
  paper(c, 120, 520, 840, 400, 1, false);
  L.forEach((n, i) => spot(c, 180 + i * 240, 720, 64, n === "soap" || n === "soda"));
};
const expl2 = (c: Ctx) => {
  ground(c);
  for (let k = 0; k < 3; k++) paper(c, 50 + k * 340, 420, 300, 300, 1, false);
  soapBar(c, 200, 240, 70); spot(c, 200, 570, 70, true);
  lemonIcon(c, 540, 240, 70); spot(c, 540, 570, 70, false);
  lemonHalf(c, 880, 180, 70); dropIcon(c, 880, 320, 22, LEMON); arrow(c, [[880, 300], [880, 470]], RED, 8); spotBack(c, 880, 580, 70, 0.6);
  arrow(c, [[200, 330], [200, 480]], RED, 8); arrow(c, [[540, 330], [540, 480]], RED, 8);
};

export const ic_howWeKnowStoriesOfDiscoveryL1 = cards("sci.how-we-know.stories-of-discovery.L1", [
  setupE1_0, setupE1_1, setupE1_2, setupE1_3, setupE2_0, setupE2_1,
  flowE2, flowA1, flowA2, flowA3, flowP1, term0, term1, term2, term3, expl2,
]);
