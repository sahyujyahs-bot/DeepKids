import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, seed, leaf, hand, person, write, cards } from "./flatKit";

// FOOD NUTRIENTS L4 · burning nuts under a tumbler, rice before and after, food labels. Flat set-up kit.

const LCD = "#c9f06b", SCREEN = "#22303a", DOUGH = "#ecd9b4", DOUGHDK = "#cdb68a", NUT = "#c4714a", NUTDK = "#8c4a2c";
const CASHEW = "#f1e3c2", RICE = "#fffdf5", DARK = "#4a4650", CHIP = "#f5c84b", CHIPDK = "#d9a62e", DAL = "#e9b93a", BALL = "#6e4126", BALLDK = "#4d2b17";
const SH = "rgba(43,35,64,0.16)";

// the shade side: a darker tone on the right (light comes from the upper left)
const shadeR = (c: Ctx, path: () => void, col: string, d: number) => shade(c, path, col, -d, 0);
const adv = (ch: string, h: number) => (ch === " " ? h * 0.35 : ch === "." ? h * 0.3 : ch === "m" ? h * 0.95 : h * 0.8);
const measure = (t: string, h: number) => [...t].reduce((a, ch) => a + adv(ch, h), 0);
// numbers and units, plus a decimal point and the C of °C
const txt = (c: Ctx, t: string, x: number, y: number, h: number, col = INK, w = 6) => {
  let cx = x;
  for (const ch of t) {
    if (ch === ".") shape(c, () => ell(c, cx + h * 0.12, y + h * 0.93, w * 0.7, w * 0.7), col, 0);
    else if (ch === "C") { c.beginPath(); c.arc(cx + h * 0.35, y + h * 0.5, h * 0.33, 0.75, Math.PI * 2 - 0.75); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke(); }
    else if (ch !== " ") write(c, ch, cx, y, h, col, w);
    cx += adv(ch, h);
  }
};
const txtC = (c: Ctx, t: string, x: number, y: number, h: number, col = INK, w = 6) => txt(c, t, x - measure(t, h) / 2, y, h, col, w);
// a word on a label, drawn as a grey bar (never letters)
const word = (c: Ctx, x: number, y: number, w: number, h: number) => shape(c, () => rrect(c, x, y, w, h, h / 2), COL.grey, 0);

// ---------------------------------------------------------------- things
// a flat digital kitchen scale, bottom centre (x, y), width w; returns the y of its top face middle
const kScale = (c: Ctx, x: number, y: number, w: number, label: string, fh = w * 0.15, th = w * 0.3) => {
  shadow(c, x + w * 0.06, y + 10, w * 0.56, w * 0.07);
  shape(c, () => polyP(c, [[x - w * 0.36, y - fh - th], [x + w * 0.36, y - fh - th], [x + w * 0.5, y - fh], [x - w * 0.5, y - fh]]), COL.teal);
  shape(c, () => polyP(c, [[x - w * 0.5, y - fh], [x + w * 0.5, y - fh], [x + w * 0.5, y], [x - w * 0.5, y]]), COL.tealDk);
  const sw = w * 0.42, shh = fh * 0.7, lh = shh * 0.62;
  shape(c, () => rrect(c, x - sw / 2, y - fh / 2 - shh / 2, sw, shh, 6), SCREEN, 5);
  txtC(c, label, x, y - fh / 2 - lh / 2, lh, LCD, 7);
  return y - fh - th / 2;
};
// a steel tumbler, bottom centre (x, y)
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, water = true) => {
  const top = w / 2, bot = w * 0.4;
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shape(c, body, COL.steel); shadeR(c, body, COL.steelDk, w * 0.3);
  shape(c, () => ell(c, x, y - h, top, w * 0.1), water ? COL.water : COL.steelIn, 5);
  if (water) shape(c, () => ell(c, x - top * 0.35, y - h - w * 0.015, top * 0.28, w * 0.03), COL.drop, 0);
  shine(c, [[x - top * 0.7, y - h * 0.85], [x - bot * 0.75, y - h * 0.15]], 8);
};
// a thermometer from its top (x1, y1) to its bulb (x2, y2)
const thermo = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w = 26, bulb = true) => {
  line(c, [[x1, y1], [x2, y2]], w + 10, INK); line(c, [[x1, y1], [x2, y2]], w, WHITE);
  line(c, [[x2 + (x1 - x2) * 0.55, y2 + (y1 - y2) * 0.55], [x2, y2]], w * 0.3, RED);
  const an = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(an), ny = Math.cos(an);
  for (let k = 1; k < 8; k++) { const u = k / 9, px = x1 + (x2 - x1) * u, py = y1 + (y2 - y1) * u; line(c, [[px + nx * w * 0.1, py + ny * w * 0.1], [px + nx * w * 0.42, py + ny * w * 0.42]], 3, INK); }
  if (bulb) shape(c, () => ell(c, x2, y2, w * 0.75, w * 0.75), RED, 5);
};
// a flame standing on its base (x, y), height s
const flame = (c: Ctx, x: number, y: number, s: number, outer: string = COL.orange, inner: string = COL.yellow) => {
  const f = (k: number) => () => { c.moveTo(x, y - s * k); c.bezierCurveTo(x + s * 0.5 * k, y - s * 0.55 * k, x + s * 0.4 * k, y - s * 0.08 * k, x, y); c.bezierCurveTo(x - s * 0.4 * k, y - s * 0.08 * k, x - s * 0.5 * k, y - s * 0.55 * k, x, y - s * k); c.closePath(); };
  shape(c, f(1), outer, 5); shape(c, f(0.5), inner, 0);
};
const nut = (c: Ctx, x: number, y: number, r: number, rot = 0) => seed(c, x, y, r, rot, false, NUT, NUTDK);
// half a cashew: a pale crescent lying on its back
const cashew = (c: Ctx, x: number, y: number, r: number) => {
  const pts: number[][] = []; for (let a = -0.1; a <= Math.PI + 0.1; a += 0.12) pts.push([x + Math.cos(a) * r, y - r * 0.5 + Math.sin(a) * r * 0.8]);
  line(c, pts, r * 0.8 + 10, INK); line(c, pts, r * 0.8, CASHEW);
};
// a piece of dry coconut: white flesh with the brown shell side underneath
const coconut = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + s * 0.1, y + 8, s, s * 0.14);
  shape(c, () => { c.moveTo(x - s, y); c.lineTo(x - s * 0.9, y - s * 0.55); c.quadraticCurveTo(x - s * 0.3, y - s * 0.95, x + s * 0.5, y - s * 0.8); c.lineTo(x + s, y - s * 0.35); c.lineTo(x + s * 0.95, y); c.closePath(); }, "#fbf7ee");
  shape(c, () => polyP(c, [[x - s, y], [x + s * 0.95, y], [x + s * 0.93, y - s * 0.16], [x - s * 0.98, y - s * 0.14]]), COL.soilDk, 4);
};
// a hairpin standing with its bend at the top (yTop), legs down to yBot
const hairpin = (c: Ctx, x: number, yTop: number, yBot: number, gap = 40) => {
  const p = () => { c.beginPath(); c.moveTo(x - gap / 2, yBot); c.lineTo(x - gap / 2, yTop + gap / 2); c.arc(x, yTop + gap / 2, gap / 2, Math.PI, 0); c.lineTo(x + gap / 2, yBot); };
  c.lineCap = "round"; c.lineJoin = "round";
  p(); c.strokeStyle = INK; c.lineWidth = 16; c.stroke();
  p(); c.strokeStyle = DARK; c.lineWidth = 8; c.stroke();
};
const dough = (c: Ctx, x: number, y: number, rx: number, ry: number) => { shape(c, () => ell(c, x, y, rx, ry), DOUGH); shadeR(c, () => ell(c, x, y, rx, ry), DOUGHDK, rx * 0.3); };
// kitchen tongs: joined at the pivot (px, py), the two arms reach the grip points a and b
const tongs = (c: Ctx, px: number, py: number, a: number[], b: number[]) => {
  const arms = [a, b].map((q) => [[px + (px - q[0]) * 0.14, py + (py - q[1]) * 0.14], q]);
  arms.forEach((s) => line(c, s, 22, INK)); arms.forEach((s) => line(c, s, 12, COL.steel));
  shape(c, () => ell(c, px, py, 14, 14), COL.steelDk, 4);
};
// a sheet of paper, centre (x, y)
const paper = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0, col: string = COL.paper) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  c.fillStyle = SH; c.fillRect(-w / 2 + 12, -h / 2 + 14, w, h);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 8), col, 5);
  c.restore();
};
const pencil = (c: Ctx, x: number, y: number, len: number, an: number, col: string = COL.yellow) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -14, len - 40, 28, 4), col);
  shape(c, () => polyP(c, [[len - 40, -14], [len, 0], [len - 40, 14]]), "#f0d9a8", 5);
  shape(c, () => polyP(c, [[len - 14, -5], [len, 0], [len - 14, 5]]), INK, 0);
  shape(c, () => rrect(c, -26, -14, 30, 28, 4), COL.pink, 5);
  c.restore();
};
// a steel pan seen from the front: rim centre (x, y), rim radius rx, depth d; handle out to the left
const pan = (c: Ctx, x: number, y: number, rx: number, d: number, handle = true, open = true) => {
  const ry = rx * 0.27;
  shadow(c, x + rx * 0.1, y + d + 8, rx * 0.95, ry * 0.5);
  if (handle) { const h0: number[] = [x - rx + 14, y + d * 0.3], h1: number[] = [x - rx * 1.85, y + d * 0.3 - 46]; line(c, [h0, h1], 32, INK); line(c, [h0, h1], 20, DARK); }
  const body = () => { c.moveTo(x - rx, y); c.lineTo(x - rx * 0.9, y + d); c.quadraticCurveTo(x, y + d + ry, x + rx * 0.9, y + d); c.lineTo(x + rx, y); c.closePath(); };
  shape(c, body, COL.steel); shadeR(c, body, COL.steelDk, rx * 0.35);
  if (open) shape(c, () => ell(c, x, y, rx, ry), COL.steelIn, 5);
  else {
    const domeP = () => { c.moveTo(x - rx, y); c.bezierCurveTo(x - rx * 0.9, y - rx * 0.55, x + rx * 0.9, y - rx * 0.55, x + rx, y); c.closePath(); };
    shape(c, () => ell(c, x, y, rx, ry), COL.steel, 5);
    shape(c, domeP, COL.steel); shadeR(c, domeP, COL.steelDk, rx * 0.3);
    shape(c, () => ell(c, x, y - rx * 0.41, 22, 22), DARK, 5);
    shine(c, [[x - rx * 0.55, y - rx * 0.2], [x - rx * 0.25, y - rx * 0.33]], 8);
  }
};
const grain = (c: Ctx, x: number, y: number, r: number, rot: number) => shape(c, () => ell(c, x, y, r, r * 0.42, rot), RICE, 2.5);
// a dome-shaped heap of small things with base centre (x, y)
const heap = (c: Ctx, x: number, y: number, rx: number, ry: number, n: number, sd: number, base: string, one: (x: number, y: number, r: () => number) => void) => {
  shape(c, () => { c.moveTo(x - rx, y); c.bezierCurveTo(x - rx * 0.9, y - ry * 1.35, x + rx * 0.9, y - ry * 1.35, x + rx, y); c.closePath(); }, base, 5);
  const r = rnd(sd);
  for (let i = 0; i < n; i++) { const t = r() * 2 - 1, u = r(), px = x + t * rx * 0.95, top = y - Math.sqrt(Math.max(0, 1 - t * t)) * ry; one(px, top + u * (y - top - 4) + 2, r); }
};
const riceHeap = (c: Ctx, x: number, y: number, rx: number, ry: number, n: number, sd: number, r0 = 13) => heap(c, x, y, rx, ry, n, sd, "#e9e3d2", (px, py, r) => grain(c, px, py, r0 + r() * 3, r() * Math.PI));
const chip = (c: Ctx, x: number, y: number, r: number, rot: number) => { shape(c, () => ell(c, x, y, r, r * 0.62, rot), CHIP, 4); shape(c, () => ell(c, x + r * 0.3, y + r * 0.15, r * 0.12, r * 0.12), CHIPDK, 0); };
// a nutrition table on a packet's back: a header of 100 g, word-bars at the left, numbers at the right
const nutriTable = (c: Ctx, x: number, y: number, w: number, h: number, rows: string[]) => {
  shape(c, () => rrect(c, x, y, w, h, 6), WHITE, 4);
  const n = rows.length + 1, rh = h / n;
  for (let i = 1; i < n; i++) line(c, [[x, y + rh * i], [x + w, y + rh * i]], 2.5);
  word(c, x + w * 0.08, y + rh * 0.35, w * 0.3, rh * 0.3);
  txt(c, "100 g", x + w * 0.5, y + rh * 0.2, rh * 0.55, INK, 4);
  rows.forEach((v, i) => { word(c, x + w * 0.08, y + rh * (i + 1.35), w * (0.26 + (i % 3) * 0.06), rh * 0.3); txt(c, v, x + w * 0.93 - measure(v, rh * 0.55), y + rh * (i + 1.2), rh * 0.55, INK, 4); });
};
// a packet standing or lying flat, centre (x, y), crimped at the top and bottom; back = true shows its nutrition table
const packet = (c: Ctx, x: number, y: number, w: number, h: number, col: string, rows?: string[]) => {
  c.fillStyle = SH; c.fillRect(x - w / 2 + 12, y - h / 2 + 14, w, h);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 10), col);
  shadeR(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 10), "rgba(43,35,64,0.5)", w * 0.12);
  for (const sy of [y - h / 2 + 22, y + h / 2 - 22]) line(c, [[x - w / 2, sy], [x + w / 2, sy]], 4);
  if (rows) nutriTable(c, x - w * 0.36, y - h * 0.3, w * 0.72, h * 0.55, rows);
  else { shape(c, () => ell(c, x, y - h * 0.05, w * 0.28, w * 0.28), WHITE, 5); word(c, x - w * 0.28, y + h * 0.28, w * 0.56, 16); }
};
const magnifier = (c: Ctx, x: number, y: number, r: number, an: number) => {
  const hx = x + Math.cos(an) * (r + 8), hy = y + Math.sin(an) * (r + 8), ex = x + Math.cos(an) * (r * 2.3), ey = y + Math.sin(an) * (r * 2.3);
  line(c, [[hx, hy], [ex, ey]], 34, INK); line(c, [[hx, hy], [ex, ey]], 22, COL.brown);
  shape(c, () => ell(c, x, y, r, r), "rgba(214,236,250,0.6)", 10);
  shine(c, [[x - r * 0.6, y - r * 0.2], [x - r * 0.25, y - r * 0.6]], 8);
};
const star = (c: Ctx, x: number, y: number, r: number, col: string = COL.yellow) => shape(c, () => { for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, rr = k % 2 ? r * 0.45 : r; k ? c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); }, col, 4);
const tick = (c: Ctx, x: number, y: number, s: number, col = COL.green) => line(c, [[x, y], [x + s * 0.4, y + s * 0.45], [x + s, y - s * 0.5]], 8, col);

// ---------------------------------------------------------------- the burning-nut set-up, used by two cards
// a groundnut on a hairpin in dough on a plate, burning; a tumbler of water with a thermometer held above it by tongs
const burnSetup = (c: Ctx, dimension: boolean) => {
  ground(c);
  plate(c, 540, 960, 320, 85);
  if (!dimension) { nut(c, 300, 972, 36, 0.3); cashew(c, 390, 980, 34); coconut(c, 740, 985, 62); }
  hairpin(c, 540, 700, 880, 40);
  dough(c, 540, 905, 105, 70);
  nut(c, 540, 672, 42, 0);
  flame(c, 540, 644, 130);
  // the tongs grip the tumbler on both sides: the far arm passes behind it, the near arm in front
  tongs(c, 880, 290, [655, 250], [418, 268]);
  tumbler(c, 540, 455, 220, 240);
  line(c, [[911, 295], [655, 250]], 22, INK); line(c, [[911, 295], [655, 250]], 12, COL.steel);
  shape(c, () => ell(c, 880, 290, 14, 14), COL.steelDk, 4);
  // thermometer: only the part above the rim shows; it leans in the tumbler
  thermo(c, 660, 70, 632, 232, 26, false);
  hand(c, 952, 263, 2.79, 1.1, SKIN.adult, CLOTH.adult);
  if (dimension) { line(c, [[330, 455], [330, 514]], 7, RED); line(c, [[305, 455], [355, 455]], 7, RED); line(c, [[305, 514], [355, 514]], 7, RED); txt(c, "2 cm", 120, 460, 48, RED, 7); }
};

// ---------------------------------------------------------------- set-up cards
// e1 step 1: a pocket scale showing 0.5 g with a groundnut on it, three foods lined up beside
const s_e1_0 = (c: Ctx) => {
  ground(c);
  kScale(c, 350, 850, 520, "0.5 g", 70, 120);
  shape(c, () => ell(c, 350, 705, 150, 52), COL.steel, 6); shape(c, () => ell(c, 350, 700, 125, 40), COL.steelIn, 4);
  nut(c, 350, 678, 50, 0.1);
  shadow(c, 740, 848, 50, 12); nut(c, 730, 820, 42, 0.2);
  shadow(c, 860, 848, 55, 12); cashew(c, 850, 828, 42);
  coconut(c, 970, 845, 75);
};
// e1 step 2: the hairpin in a dough ball on a plate, the nut on top of the pin
const s_e1_1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 800, 400, 125);
  hairpin(c, 540, 380, 720, 44);
  dough(c, 540, 730, 130, 92);
  nut(c, 540, 346, 58, 0);
};
const s_e1_2 = (c: Ctx) => burnSetup(c, true);
// e1 step 4: stirring the water with the thermometer, before and after temperatures on a card
const s_e1_3 = (c: Ctx) => {
  ground(c);
  tumbler(c, 400, 800, 280, 320);
  thermo(c, 560, 300, 496, 497, 28, false);
  hand(c, 567, 278, 1.885, 1, SKIN.child, CLOTH.child);
  const pts: number[][] = []; for (let a = Math.PI * 0.82; a >= Math.PI * 0.18; a -= 0.1) pts.push([400 + Math.cos(a) * 185, 480 + Math.sin(a) * 70]);
  arrow(c, pts, RED, 9);
  paper(c, 800, 740, 300, 280, 0.05);
  txtC(c, "25 °C", 800, 650, 54);
  arrow(c, [[800, 730], [800, 780]], INK, 7);
  txtC(c, "41 °C", 800, 790, 54, RED);
};
// e2 step 1: the empty pan on the scale, 50 g of rice and 150 ml of water beside
const s_e2_0 = (c: Ctx) => {
  ground(c);
  kScale(c, 360, 880, 520, "320 g");
  pan(c, 360, 650, 150, 85);
  bowl(c, 745, 860, 90); riceHeap(c, 745, 862, 80, 42, 40, 3, 11);
  txtC(c, "50 g", 745, 700, 46);
  glass(c, 930, 900, 150, 230, 0.65);
  for (let k = 1; k <= 4; k++) line(c, [[868 + k * 2, 900 - k * 46], [896 + k * 2, 900 - k * 46]], 3, COL.glassEdge);
  txtC(c, "150 ml", 920, 590, 44);
};
// e2 step 2: the pan on the stove with its lid on; a grown-up stands beside it with a spoon
const s_e2_1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e3d3b4"; c.fillRect(0, 1000, D, 80); line(c, [[0, 1000], [D, 1000]], 5);
  // the counter and a tabletop gas stove
  shape(c, () => polyP(c, [[60, 760], [600, 760], [600, 1000], [60, 1000]]), COL.wood); shadeR(c, () => polyP(c, [[60, 760], [600, 760], [600, 1000], [60, 1000]]), COL.woodDk, 60);
  shape(c, () => rrect(c, 110, 700, 440, 60, 10), DARK);
  shape(c, () => ell(c, 340, 712, 95, 24), COL.steelDk, 5);
  for (const fx of [262, 300, 380, 418]) flame(c, fx, 708, 42, COL.blueDk, COL.sky);
  pan(c, 340, 600, 150, 100, true, false);
  // the grown-up, spoon in the hand nearest the stove
  const { handR } = person(c, 820, 1000, 640, { adult: true, reachR: [650, 590] });
  const sp = [handR[0] + 20, handR[1] + 46], tip = [handR[0] - 52, handR[1] - 112];
  line(c, [sp, tip], 26, INK); line(c, [sp, tip], 16, COL.steel);
  shape(c, () => ell(c, tip[0] - 10, tip[1] - 22, 34, 24, -0.4), COL.steel, 5);
};
// e2 step 3: the pan of cooked rice on the scale, the sum on a card
const s_e2_2 = (c: Ctx) => {
  ground(c);
  kScale(c, 380, 880, 520, "480 g");
  pan(c, 380, 650, 150, 85);
  riceHeap(c, 380, 652, 140, 70, 90, 5, 13);
  paper(c, 830, 720, 300, 320, -0.04);
  txt(c, "480 g", 740, 600, 50); txt(c, "-320 g", 700, 690, 50);
  line(c, [[690, 770], [960, 770]], 6);
  txt(c, "160 g", 700, 800, 50, RED);
};

// ---------------------------------------------------------------- card pictures
const f_e1 = (c: Ctx) => burnSetup(c, false);
// a small heap of raw rice and a big pot of cooked rice, with their weights
const f_e2 = (c: Ctx) => {
  ground(c);
  bowl(c, 260, 760, 115); riceHeap(c, 260, 762, 100, 55, 60, 8, 12);
  txtC(c, "50 g", 260, 560, 60);
  arrow(c, [[400, 700], [500, 700]], RED, 12);
  pan(c, 750, 660, 230, 200, false);
  riceHeap(c, 750, 664, 215, 110, 220, 9, 15);
  txtC(c, "160 g", 750, 380, 60);
};
// four packets turned over to show their tables, and a table drawn on paper
const f_a1 = (c: Ctx) => {
  ground(c);
  const cols = [COL.red, COL.blue, COL.green, COL.purple], rows = [["480", "7", "12", "76"], ["380", "7", "0.5", "80"], ["570", "25", "45", "20"], ["450", "6", "20", "60"]];
  cols.forEach((col, i) => packet(c, 185 + i * 236, 330, 200, 330, col, rows[i]));
  paper(c, 540, 810, 820, 300);
  const x0 = 170, y0 = 690, cw = 740 / 4, rh = 240 / 5;
  for (let r = 1; r < 5; r++) line(c, [[x0, y0 + rh * r], [x0 + 740, y0 + rh * r]], 3);
  for (let k = 1; k < 4; k++) line(c, [[x0 + cw * k, y0], [x0 + cw * k, y0 + 240]], 3);
  for (let k = 0; k < 4; k++) word(c, x0 + cw * k + 20, y0 + 16, cw - 40, 16);
  for (let r = 0; r < 4; r++) { word(c, x0 + 20, y0 + rh * (r + 1) + 16, 90, 16); txt(c, rows[r][0], x0 + cw + 50, y0 + rh * (r + 1) + 8, 32, INK, 4); }
  pencil(c, 960, 940, 150, -2.3);
};
// one serving of chips on the scale, and the helping a child really takes in a bowl beside
const f_a2 = (c: Ctx) => {
  ground(c);
  packet(c, 870, 470, 210, 320, COL.red);
  kScale(c, 330, 920, 480, "30 g");
  plate(c, 330, 760, 175, 55);
  const r = rnd(4); for (let i = 0; i < 7; i++) chip(c, 240 + i * 30 + r() * 10, 745 + ((i % 2) * 2 - 1) * 10 + r() * 8, 30, r() * 1.2 - 0.6);
  bowl(c, 830, 790, 180);
  heap(c, 830, 792, 165, 110, 48, 6, CHIPDK, (px, py, rr) => chip(c, px, py, 32, rr() * 1.4 - 0.7));
};
// a meal drawn on a round plate on paper, each food coloured by its job, stars where a food does two jobs
const f_a3 = (c: Ctx) => {
  ground(c);
  paper(c, 540, 540, 860, 860);
  shape(c, () => ell(c, 540, 500, 310, 310), WHITE, 7);
  c.beginPath(); ell(c, 540, 500, 268, 268); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
  riceHeap(c, 440, 440, 110, 60, 60, 12, 13);
  bowl(c, 680, 400, 80, DAL); shape(c, () => ell(c, 680, 400, 70, 12), "#d49a22", 0);
  leaf(c, 360, 610, 110, -0.5); leaf(c, 380, 640, 100, 0.25); leaf(c, 350, 560, 90, 0.9);
  bowl(c, 660, 600, 80, "#fbf7ee");
  shape(c, () => ell(c, 540, 700, 60, 40), COL.red, 5); shape(c, () => ell(c, 520, 690, 22, 14, 0.4), "#b8321f", 0); shape(c, () => ell(c, 560, 712, 18, 12, -0.3), "#b8321f", 0);
  // the colour of each food's job: red energy, blue building, green protection
  const dotAt = (x: number, y: number, col: string) => shape(c, () => ell(c, x, y, 22, 22), col, 4);
  dotAt(440, 300, COL.red); dotAt(680, 280, COL.blue); dotAt(300, 500, COL.green); dotAt(660, 720, COL.blue); dotAt(540, 790, COL.green);
  star(c, 770, 300, 28); star(c, 760, 690, 28);
  pencil(c, 180, 980, 220, -0.08, COL.red); pencil(c, 450, 980, 220, -0.08, COL.blue); pencil(c, 720, 980, 220, -0.08, COL.green);
};
// ten date and groundnut balls on a plate, with the label a child drew for them
const f_p1 = (c: Ctx) => {
  ground(c);
  plate(c, 500, 720, 340, 115);
  const ball = (x: number, y: number) => { shape(c, () => ell(c, x, y, 50, 46), BALL); shadeR(c, () => ell(c, x, y, 50, 46), BALLDK, 20); for (let k = 0; k < 4; k++) shape(c, () => ell(c, x - 22 + k * 15, y - 18 + (k % 2) * 30, 6, 6), "#f1dfb8", 0); };
  for (let i = 0; i < 5; i++) ball(340 + i * 82, 745);
  for (let i = 0; i < 5; i++) ball(340 + i * 82, 660);
  paper(c, 850, 370, 330, 320, 0.06);
  nutriTable(c, 710, 240, 280, 260, ["420", "9", "18", "55"]);
  nut(c, 150, 920, 46, 0.3); nut(c, 240, 935, 44, -0.4);
  shape(c, () => ell(c, 170, 1000, 60, 32, 0.1), "#5a3119", 5); shape(c, () => ell(c, 270, 1010, 58, 30, -0.1), "#5a3119", 5);
};
// a child sitting with a Mystery Label card in both hands; the pile and the score sheet beside
const f_g1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e3d3b4"; c.fillRect(0, 940, D, 140); line(c, [[0, 940], [D, 940]], 5);
  for (let k = 5; k >= 0; k--) paper(c, 190 + k * 3, 880 - k * 6, 220, 150, 0.04 * (k % 2));
  nutriTable(c, 100, 820, 180, 110, ["580", "25"]);
  paper(c, 880, 880, 210, 160, -0.05);
  for (let k = 0; k < 3; k++) { word(c, 800, 830 + k * 40, 70, 14); tick(c, 900, 834 + k * 40, 36); }
  pencil(c, 960, 990, 170, -2.6);
  // the card sits in the lap, a hand at each of its bottom corners
  const { handL, handR } = person(c, 540, 940, 520, { sit: true, dir: 1, reachR: [432, 925], reachL: [648, 925] });
  const cx = (handL[0] + handR[0]) / 2, cy = (handL[1] + handR[1]) / 2 - 42;
  paper(c, cx, cy, 220, 130, 0);
  nutriTable(c, cx - 92, cy - 54, 184, 108, ["580", "25"]);
};
// energy-giving food: rice, a roti and a spoon of ghee on a plate, small flames above
const t_2 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 720, 420, 135);
  riceHeap(c, 400, 700, 130, 70, 70, 21, 14);
  shape(c, () => ell(c, 690, 660, 135, 48), "#e8c389", 5); const r = rnd(2); for (let i = 0; i < 9; i++) shape(c, () => ell(c, 590 + r() * 200, 640 + r() * 40, 9, 6), "#b98448", 0);
  const sp: number[] = [700, 790], tp: number[] = [850, 830]; line(c, [sp, tp], 24, INK); line(c, [sp, tp], 14, COL.steel);
  shape(c, () => ell(c, 660, 780, 48, 32, 0.15), COL.steel, 5); shape(c, () => ell(c, 660, 776, 38, 22, 0.15), "#f6d35a", 3);
  flame(c, 400, 590, 110); flame(c, 690, 570, 110); flame(c, 660, 740, 70);
};
// body-building food: a bowl of dal, an egg and a block of paneer, with a drawing of a muscle
const t_3 = (c: Ctx) => {
  ground(c);
  bowl(c, 290, 660, 160, DAL); shape(c, () => ell(c, 290, 660, 140, 24), "#d49a22", 0);
  shadow(c, 560, 770, 70, 16); shape(c, () => ell(c, 550, 680, 72, 92), "#fdfbf4"); shadeR(c, () => ell(c, 550, 680, 72, 92), "#dcd6c6", 30);
  shadow(c, 830, 790, 120, 22);
  shape(c, () => polyP(c, [[710, 650], [860, 650], [900, 610], [750, 610]]), "#ffffff");
  shape(c, () => polyP(c, [[710, 650], [860, 650], [860, 780], [710, 780]]), "#f6f2e7");
  shape(c, () => polyP(c, [[860, 650], [900, 610], [900, 740], [860, 780]]), "#dcd6c6");
  // the muscle: a flexed arm drawn on a card above
  paper(c, 540, 300, 400, 240, -0.03);
  // a flexed arm: upper arm flat, forearm up, a fist at the top and the bicep bulging over the upper arm
  shape(c, () => ell(c, 500, 335, 80, 58), SKIN.child);
  shape(c, () => rrect(c, 380, 330, 250, 76, 36), SKIN.child);
  c.save(); c.translate(610, 372); c.rotate(0.3); shape(c, () => rrect(c, -34, -150, 68, 186, 34), SKIN.child); c.restore();
  shape(c, () => ell(c, 658, 226, 36, 32), SKIN.childDk, 5);
  shape(c, () => rrect(c, 380, 330, 250, 76, 36), SKIN.child, 0);
  shape(c, () => { c.moveTo(430, 333); c.bezierCurveTo(440, 260, 570, 255, 580, 333); c.closePath(); }, SKIN.child, 5);
};
// protective food: a basket of bright fruit and vegetables, a shield above
const t_4 = (c: Ctx) => {
  ground(c);
  shape(c, () => { c.moveTo(540, 170); c.lineTo(640, 205); c.lineTo(635, 300); c.quadraticCurveTo(620, 370, 540, 400); c.quadraticCurveTo(460, 370, 445, 300); c.lineTo(440, 205); c.closePath(); }, COL.teal, 6);
  tick(c, 495, 285, 90, WHITE);
  shadow(c, 560, 890, 300, 40);
  const basketP = () => { c.moveTo(250, 640); c.lineTo(830, 640); c.quadraticCurveTo(800, 880, 540, 880); c.quadraticCurveTo(280, 880, 250, 640); c.closePath(); };
  // handle behind the fruit
  c.beginPath(); c.moveTo(300, 645); c.quadraticCurveTo(540, 300, 780, 645); c.strokeStyle = INK; c.lineWidth = 30; c.stroke();
  c.beginPath(); c.moveTo(300, 645); c.quadraticCurveTo(540, 300, 780, 645); c.strokeStyle = COL.brown; c.lineWidth = 18; c.stroke();
  // fruit and vegetables stacked above the rim
  leaf(c, 330, 630, 150, -1.9, COL.leafDk); leaf(c, 380, 630, 160, -1.5, COL.leaf); leaf(c, 440, 625, 140, -1.2, COL.leafDk);
  shape(c, () => polyP(c, [[330, 640], [470, 560], [500, 600]]), COL.orange, 5); leaf(c, 470, 565, 60, -2.4, COL.leaf); leaf(c, 480, 560, 60, -1.7, COL.leaf);
  shape(c, () => ell(c, 720, 560, 95, 120, 0.3), COL.orange); shadeR(c, () => ell(c, 720, 560, 95, 120, 0.3), "#d27c25", 35);
  shape(c, () => ell(c, 560, 575, 78, 72), COL.red); shadeR(c, () => ell(c, 560, 575, 78, 72), "#b8321f", 30); leaf(c, 560, 510, 40, -1.1, COL.leaf);
  shape(c, () => ell(c, 640, 620, 62, 60), COL.greenLt); shadeR(c, () => ell(c, 640, 620, 62, 60), COL.green, 24); leaf(c, 650, 565, 44, -0.8, COL.leaf);
  for (const [ax, ay] of [[800, 610], [760, 640], [820, 650]]) { shape(c, () => ell(c, ax, ay, 30, 28), "#c5dd7a", 4); line(c, [[ax, ay - 26], [ax, ay + 26]], 2.5, "#8aa84a"); }
  shape(c, basketP, "#b87b45"); shadeR(c, basketP, "#8a5a30", 70);
  c.save(); c.beginPath(); basketP(); c.clip(); c.strokeStyle = "rgba(43,35,64,0.35)"; c.lineWidth = 3;
  for (let k = 0; k < 12; k++) { c.beginPath(); c.moveTo(200 + k * 60, 650); c.lineTo(320 + k * 60, 880); c.stroke(); c.beginPath(); c.moveTo(880 - k * 60, 650); c.lineTo(760 - k * 60, 880); c.stroke(); }
  for (let y = 700; y < 880; y += 55) { c.beginPath(); c.moveTo(240, y); c.lineTo(840, y); c.stroke(); }
  c.restore();
  shape(c, () => ell(c, 540, 640, 295, 34), "#c98d55", 6);
};

export const ic_foodNutrientsL4 = cards("sci.food.nutrients.L4", [s_e1_0, s_e1_1, s_e1_2, s_e1_3, s_e2_0, s_e2_1, s_e2_2, f_e1, f_e2, f_a1, f_a2, f_a3, f_p1, f_g1, t_2, t_3, t_4]);
