import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, D, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, write, rnd, glass, leaf, plate, cards } from "./flatKit";

// sci.seeds-and-life-cycles.plant-life-cycle.L3 · set-up cards. Same bhindi plant on e1, same pumpkin flowers on e3, same leaf circles on e4.

const PETAL = "#fbe9a0", PETAL_DK = "#e8c968", MAROON = "#8a2b3c", PUMP = "#f3a12c", PUMP_DK = "#d27c18", PGREEN = "#8fbf5a";

// ---------------------------------------------------------------- shared things
// soil strip along the bottom
const soil = (c: Ctx) => {
  shape(c, () => rrect(c, -20, 975, D + 40, 140, 0), COL.soil, 6);
  const r = rnd(4);
  for (let i = 0; i < 22; i++) { c.beginPath(); ell(c, 20 + r() * 1040, 1005 + r() * 60, 10 + r() * 8, 6, r()); c.fillStyle = COL.soilDk; c.fill(); }
};
// the bhindi plant: stem, big leaves, a short flower stalk (pedicel) ending at (640, 420)
const bhindiPlant = (c: Ctx) => {
  ground(c); soil(c);
  leaf(c, 420, 900, 300, Math.PI + 0.35); leaf(c, 470, 760, 310, -0.1); leaf(c, 400, 640, 250, Math.PI + 0.6);
  const stem = [[330, 990], [360, 800], [500, 650], [560, 560]];
  const path = () => { c.beginPath(); c.moveTo(330, 990); c.bezierCurveTo(350, 820, 470, 700, 560, 560); };
  path(); c.strokeStyle = INK; c.lineWidth = 50; c.lineCap = "round"; c.stroke(); path(); c.strokeStyle = COL.green; c.lineWidth = 36; c.stroke();
  line(c, [[558, 560], [640, 420]], 40, INK); line(c, [[558, 560], [640, 420]], 26, COL.green);
  line(c, [[340, 930], [380, 800]], 8, COL.greenLt);
  void stem;
};
// an open bhindi flower facing us, centre (x, y), petal reach r
const bhindiFlower = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 5; k++) {
    const a = -Math.PI / 2 + k * (Math.PI * 2 / 5), px = x + Math.cos(a) * r * 0.55, py = y + Math.sin(a) * r * 0.55;
    shape(c, () => ell(c, px, py, r * 0.55, r * 0.46, a), PETAL, 6);
    shade(c, () => ell(c, px, py, r * 0.55, r * 0.46, a), PETAL_DK, r * 0.08, r * 0.08, 0.6);
  }
  shape(c, () => ell(c, x, y, r * 0.27, r * 0.27), MAROON, 5);
  for (let k = 0; k < 6; k++) { c.beginPath(); ell(c, x + Math.cos(k) * r * 0.1, y + Math.sin(k) * r * 0.1, 6, 6); c.fillStyle = COL.yellow; c.fill(); }
};
// the red thread tied round the flower stalk at (x, y): a band across the stalk and a bow
const thread = (c: Ctx, x: number, y: number) => {
  line(c, [[x - 26, y - 13], [x + 26, y + 13]], 18, INK); line(c, [[x - 26, y - 13], [x + 26, y + 13]], 10, RED);
  line(c, [[x - 20, y - 16], [x + 32, y + 8]], 18, INK); line(c, [[x - 20, y - 16], [x + 32, y + 8]], 10, RED);
  shape(c, () => ell(c, x + 34, y - 26, 20, 11, -0.8), RED, 4); shape(c, () => ell(c, x + 52, y - 4, 20, 11, 0.5), RED, 4);
};
// a bhindi pod lying with its base at (x, y), pointing right, length len, width w
const pod = (c: Ctx, x: number, y: number, len: number, w: number) => {
  const p = () => { c.moveTo(x, y - w / 2); c.bezierCurveTo(x + len * 0.3, y - w * 0.62, x + len * 0.8, y - w * 0.4, x + len, y + w * 0.05); c.bezierCurveTo(x + len * 0.8, y + w * 0.5, x + len * 0.3, y + w * 0.62, x, y + w / 2); c.closePath(); };
  shape(c, p, COL.green, 6); shade(c, p, COL.greenDk, 0, w * 0.2, 0.6);
  for (const f of [-0.3, 0, 0.3]) line(c, [[x + len * 0.05, y + w * f], [x + len * 0.55, y + w * f * 0.9], [x + len * 0.9, y + w * 0.03]], 3, COL.greenDk);
  shape(c, () => ell(c, x, y, w * 0.2, w * 0.58), COL.leaf, 5);
};
// a ruler lying flat across the card, y = top edge, 0 at x0, 70 px per cm
const ruler = (c: Ctx, x0: number, y: number, cm: number) => {
  shadow(c, 540, y + 130, 470, 20);
  shape(c, () => rrect(c, x0 - 70, y, cm * 70 + 140, 110, 10), COL.wood, 6);
  for (let i = 0; i <= cm * 5; i++) { const xx = x0 + i * 14, h = i % 5 === 0 ? 44 : 22; line(c, [[xx, y], [xx, y + h]], i % 5 === 0 ? 5 : 3); }
  for (let i = 0; i <= cm; i++) write(c, String(i), x0 + i * 70 - (i > 9 ? 22 : 10), y + 54, 40, INK, 6);
};
// a pumpkin-flower trumpet: base at (x, y), pointing at angle rot, length len, mouth half-width w
const trumpet = (c: Ctx, x: number, y: number, len: number, w: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const body = () => { c.moveTo(0, -w * 0.15); c.bezierCurveTo(len * 0.4, -w * 0.2, len * 0.7, -w * 0.5, len, -w); c.lineTo(len, w); c.bezierCurveTo(len * 0.7, w * 0.5, len * 0.4, w * 0.2, 0, w * 0.15); c.closePath(); };
  shape(c, body, PUMP, 6); shade(c, body, PUMP_DK, 0, w * 0.3, 0.6);
  const rim = () => { for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2, rr = k % 2 ? 0.75 : 1.12, px = len + Math.cos(a) * w * 0.28 * rr, py = Math.sin(a) * w * rr * 1.05; k ? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); };
  shape(c, rim, PUMP, 6); shape(c, () => ell(c, len + w * 0.04, 0, w * 0.2, w * 0.68), PUMP_DK, 4);
  c.restore();
};
// the baby pumpkin behind a female flower: small green ridged ball with its centre at (x, y)
const babyPumpkin = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.85), PGREEN, 6); shade(c, () => ell(c, x, y, r, r * 0.85), COL.greenDk, r * 0.25, r * 0.15, 0.5);
  for (const f of [-0.5, 0, 0.5]) { c.beginPath(); c.ellipse(x, y, r * (0.5 - Math.abs(f) * 0.3 + 0.12), r * 0.85, 0, -Math.PI / 2 + 0.3, Math.PI / 2 - 0.3, f < 0); c.strokeStyle = COL.greenDk; c.lineWidth = 3.5; c.stroke(); }
};
// a round green leaf disc (cut from a palak leaf), seen at an angle
const disc = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.55), COL.leaf, 4); shade(c, () => ell(c, x, y, r, r * 0.55), COL.leafDk, r * 0.2, r * 0.12, 0.6); };
// a big palak leaf with its stalk, centre (x, y), length len, rotated
const palak = (c: Ctx, x: number, y: number, len: number, rot: number, holes: number[][] = []) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => { c.moveTo(-len / 2, 0); c.bezierCurveTo(-len * 0.4, -len * 0.4, len * 0.2, -len * 0.42, len / 2, 0); c.bezierCurveTo(len * 0.2, len * 0.42, -len * 0.4, len * 0.4, -len / 2, 0); c.closePath(); };
  shape(c, p, COL.leaf, 6); shade(c, p, COL.leafDk, 0, len * 0.1, 0.6);
  line(c, [[-len / 2 - 40, 0], [len * 0.42, 0]], 6, COL.leafDk);
  for (const s of [-1, 1]) for (const t of [-0.25, 0, 0.2]) line(c, [[len * t, 0], [len * (t + 0.15), s * len * 0.2]], 3.5, COL.leafDk);
  c.restore();
  holes.forEach(([hx, hy, hr]) => { shape(c, () => ell(c, hx, hy, hr, hr * 0.7), "#efe4cf", 5); });
};

// ---------------------------------------------------------------- experiment 1: flower to fruit
// setup.e1.0
const e1s0 = (c: Ctx) => {
  bhindiPlant(c); bhindiFlower(c, 640, 250, 175);
  const tl = [[604, 486], [500, 540], [400, 500]];
  line(c, tl, 16, INK); line(c, tl, 9, RED);
  thread(c, 604, 486);
  hand(c, 190, 470, 0.05, 2.1, SKIN.child, CLOTH.child, false);
};
// setup.e1.1
// a fallen, shrivelled bhindi petal: pale yellow, brown curled edge, maroon spot at its base
const wiltPetal = (c: Ctx, x: number, y: number, r: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => { c.moveTo(-r * 0.3, 0); c.bezierCurveTo(-r * 0.2, -r * 0.9, r * 0.5, -r * 1.05, r * 0.95, -r * 0.55); c.bezierCurveTo(r * 1.1, -r * 0.2, r * 0.8, -r * 0.05, r, r * 0.2); c.bezierCurveTo(r * 0.85, r * 0.85, -r * 0.1, r * 0.9, -r * 0.3, 0); c.closePath(); };
  shape(c, p, PETAL, 6); shade(c, p, "#a8742f", r * 0.35, -r * 0.05, 0.7);
  line(c, [[r * 0.1, -r * 0.1], [r * 0.7, -r * 0.35]], 3.5, "#a8742f"); line(c, [[r * 0.1, r * 0.1], [r * 0.7, r * 0.3]], 3.5, "#a8742f");
  shape(c, () => ell(c, -r * 0.18, 0, r * 0.2, r * 0.2), MAROON, 4);
  c.restore();
};
const e1s1 = (c: Ctx) => {
  bhindiPlant(c);
  // petals that have dropped onto the soil and two still falling
  for (const [px, py, r, a] of [[170, 950, 80, 0.3], [310, 1010, 70, -0.5], [760, 960, 85, 0.8], [900, 1020, 70, -0.2], [560, 1030, 60, 0.4]]) wiltPetal(c, px, py, r, a);
  wiltPetal(c, 840, 600, 70, 0.9); wiltPetal(c, 450, 330, 66, -0.7);
  arrow(c, [[840, 680], [840, 790]], RED, 12);
  // the thin green baby pod standing up from the dry green cup at the end of the stalk
  const tip = () => { c.moveTo(618, 420); c.quadraticCurveTo(606, 280, 640, 150); c.quadraticCurveTo(676, 280, 664, 420); c.closePath(); };
  shape(c, tip, COL.greenLt, 6); shade(c, tip, COL.green, 10, 0, 0.7);
  shape(c, () => polyP(c, [[590, 392], [694, 392], [676, 452], [606, 452]]), COL.greenDk, 6);
  thread(c, 604, 486);
};
// setup.e1.2
const e1s2 = (c: Ctx) => {
  ground(c);
  line(c, [[110, 60], [190, 220], [240, 370]], 34, INK); line(c, [[110, 60], [190, 220], [240, 370]], 22, COL.green);
  thread(c, 205, 215);
  shadow(c, 520, 560, 340, 24);
  pod(c, 240, 470, 560, 120);
  ruler(c, 240, 585, 10);
  line(c, [[800, 510], [800, 600]], 6, RED);
};

// ---------------------------------------------------------------- experiment 2: inside the fruit
const tomato = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.12, y + r * 0.85, r * 0.9, r * 0.16);
  shape(c, () => ell(c, x, y, r, r * 0.88), COL.red, 6); shade(c, () => ell(c, x, y, r, r * 0.88), "#b03a28", r * 0.3, r * 0.2, 0.5);
  shine(c, [[x - r * 0.6, y - r * 0.2], [x - r * 0.4, y - r * 0.55]], 9);
  const pts: number[][] = []; for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? 0.2 : 0.55; pts.push([x + Math.cos(a) * r * rr * 1.2, y - r * 0.72 + Math.sin(a) * r * rr * 0.45]); }
  shape(c, () => polyP(c, pts), COL.green, 5);
};
const brinjal = (c: Ctx, x: number, y: number, len: number, w: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => { c.moveTo(-len / 2, -w * 0.25); c.bezierCurveTo(-len * 0.2, -w * 0.6, len * 0.3, -w * 0.75, len / 2, -w * 0.3); c.bezierCurveTo(len * 0.6, w * 0.2, len * 0.3, w * 0.75, -len * 0.1, w * 0.6); c.bezierCurveTo(-len * 0.4, w * 0.5, -len / 2, w * 0.2, -len / 2, -w * 0.25); c.closePath(); };
  shape(c, p, "#6b3f98", 6); shade(c, p, "#4a2a70", 0, w * 0.25, 0.6); shine(c, [[-len * 0.2, -w * 0.35], [len * 0.15, -w * 0.5]], 9);
  const cap = [[-len / 2 - 18, -w * 0.3], [-len / 2 + 30, -w * 0.62], [-len / 2 + 60, -w * 0.3], [-len / 2 + 62, w * 0.1], [-len / 2 + 30, w * 0.4], [-len / 2 - 8, w * 0.15]];
  shape(c, () => polyP(c, cap), COL.green, 5);
  line(c, [[-len / 2 - 18, -w * 0.3], [-len / 2 - 60, -w * 0.45]], 14, INK); line(c, [[-len / 2 - 18, -w * 0.3], [-len / 2 - 60, -w * 0.45]], 7, COL.green);
  c.restore();
};
const banana = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 10, 50, 150, 18);
  const p = () => { c.moveTo(-130, -40); c.bezierCurveTo(-90, 55, 70, 70, 135, -45); c.lineTo(122, -62); c.bezierCurveTo(60, 5, -60, 0, -118, -62); c.closePath(); };
  shape(c, p, COL.yellow, 6); shade(c, p, COL.orange, 0, 14, 0.5);
  shape(c, () => ell(c, 130, -54, 14, 12, -0.5), "#4a3a30", 5);
  shape(c, () => rrect(c, -150, -85, 30, 40, 6), COL.leafDk, 5);
  c.restore();
};
// setup.e2.0
const e2s0 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 640, 500, 300);
  tomato(c, 260, 560, 100);
  brinjal(c, 560, 540, 270, 130, 0.1);
  banana(c, 850, 580, 1.15);
  // bhindi and a pea pod lower down
  const bh = (x: number, y: number, rot: number) => { c.save(); c.translate(x, y); c.rotate(rot); pod(c, 0, 0, 320, 84); c.restore(); };
  bh(130, 790, -0.08);
  c.save(); c.translate(540, 820);
  const pp = () => { c.moveTo(0, 0); c.bezierCurveTo(60, -90, 330, -80, 380, -20); c.bezierCurveTo(300, 50, 80, 60, 0, 0); c.closePath(); };
  shape(c, pp, COL.greenLt, 6); shade(c, pp, COL.green, 0, 14, 0.5);
  for (let k = 0; k < 5; k++) { c.beginPath(); ell(c, 90 + k * 60, -22 + Math.sin(k) * 4, 20, 20); c.fillStyle = COL.green; c.fill(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke(); }
  c.restore();
  arrow(c, [[260, 230], [260, 400]], RED, 14); arrow(c, [[420, 230], [420, 410]], RED, 14); arrow(c, [[990, 270], [945, 400]], RED, 14);
};
const cutBhindi = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 0.85, r, r * 0.2);
  // a five-ridged pod cut across: green ridged rim, pale inside, five chambers each with round white seeds
  const ridged = (k: number) => () => { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = (i % 2 ? 0.8 : 1) * k, px = x + Math.cos(a) * r * rr, py = y + Math.sin(a) * r * rr * 0.92; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); };
  shape(c, ridged(1), COL.green, 6); shape(c, ridged(0.8), "#e9f2c4", 4);
  for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + k * Math.PI * 2 / 5; line(c, [[x + Math.cos(a) * r * 0.1, y + Math.sin(a) * r * 0.1], [x + Math.cos(a + Math.PI / 5) * r * 0.74, y + Math.sin(a + Math.PI / 5) * r * 0.74 * 0.92]], 4, COL.greenDk); }
  for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + k * Math.PI * 2 / 5 + Math.PI / 5 + 0.63; for (const t of [0.34, 0.56]) { c.beginPath(); ell(c, x + Math.cos(a) * r * t, y + Math.sin(a) * r * t * 0.92, r * 0.1, r * 0.1); c.fillStyle = WHITE; c.fill(); c.lineWidth = 3.5; c.strokeStyle = INK; c.stroke(); } }
};
const cutTomato = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 0.8, r, r * 0.2);
  shape(c, () => ell(c, x, y, r, r * 0.88), COL.red, 6); shape(c, () => ell(c, x, y, r * 0.84, r * 0.72), "#f7a08e", 3);
  for (let k = 0; k < 3; k++) { const a = -Math.PI / 2 + k * Math.PI * 2 / 3 + 0.5; const cx = x + Math.cos(a) * r * 0.38, cy = y + Math.sin(a) * r * 0.32; shape(c, () => ell(c, cx, cy, r * 0.3, r * 0.22, a), "#e86b55", 3); for (let j = 0; j < 4; j++) { c.beginPath(); ell(c, cx + (j - 1.5) * r * 0.1, cy + (j % 2) * 6, r * 0.045, r * 0.03); c.fillStyle = COL.yellow; c.fill(); } }
};
// setup.e2.1
const e2s1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 960, 470, 30);
  const board = () => polyP(c, [[80, 330], [1010, 330], [1040, 950], [50, 950]]);
  shape(c, board, COL.wood, 6); shade(c, board, COL.woodDk, 0, 30, 0.35);
  cutTomato(c, 250, 760, 150); cutBhindi(c, 640, 810, 120); cutBhindi(c, 880, 700, 105);
  c.save(); c.translate(420, 470); pod(c, 0, 0, 380, 84); c.restore();
  // knife in the grown-up's grip: dark handle, steel blade pressed down on the bhindi
  const g = [240, 228], d = [Math.cos(0.45), Math.sin(0.45)], nn = [-d[1], d[0]];
  const at = (sv: number, nv: number) => [g[0] + d[0] * sv + nn[0] * nv, g[1] + d[1] * sv + nn[1] * nv];
  line(c, [at(-60, 0), at(115, 0)], 38, INK); line(c, [at(-60, 0), at(115, 0)], 26, COL.black);
  shape(c, () => polyP(c, [at(110, -30), at(420, -10), at(440, 6), at(110, 34)]), COL.steel, 6);
  hand(c, 120, 170, 0.45, 1.9, SKIN.adult, CLOTH.adult, false);
};
// setup.e2.2
const e2s2 = (c: Ctx) => {
  ground(c);
  // paper with a table and a number written in it
  shadow(c, 760, 400, 330, 20);
  shape(c, () => rrect(c, 420, 70, 560, 330, 10), COL.paper, 6);
  for (const xx of [600, 790]) line(c, [[xx, 70], [xx, 400]], 5); for (const yy of [180, 290]) line(c, [[420, yy], [980, yy]], 5);
  write(c, "6", 650, 205, 70, COL.blueDk, 9); write(c, "5", 840, 85, 70, COL.blueDk, 9);
  // plate, the open pod and a row of peas
  plate(c, 540, 750, 480, 240);
  const pp = () => { c.moveTo(100, 760); c.quadraticCurveTo(300, 640, 520, 770); c.quadraticCurveTo(300, 860, 100, 760); c.closePath(); };
  void pp;
  c.save(); c.translate(80, 820);
  const pod2 = () => { c.moveTo(0, 0); c.quadraticCurveTo(140, -120, 320, -30); c.quadraticCurveTo(160, 50, 0, 0); c.closePath(); };
  shape(c, pod2, COL.greenLt, 6); shade(c, pod2, COL.green, 0, 12, 0.5);
  for (const t of [0.18, 0.5]) { c.beginPath(); ell(c, 40 + t * 280, -28 + (t - 0.4) * 30, 7, 7); c.fillStyle = COL.greenDk; c.fill(); }
  c.restore();
  for (let i = 0; i < 6; i++) { const px = 470 + i * 95, py = 720; shadow(c, px + 8, py + 36, 36, 9); shape(c, () => ell(c, px, py, 38, 38), COL.leaf, 6); shade(c, () => ell(c, px, py, 38, 38), COL.leafDk, 10, 8, 0.5); shine(c, [[px - 20, py - 8], [px - 10, py - 22]], 7); }
  // the child's hand with a pencil
  line(c, [[130, 275], [440, 340]], 22, INK); line(c, [[130, 275], [440, 340]], 14, COL.yellow);
  shape(c, () => polyP(c, [[440, 330], [492, 348], [440, 352]]), "#f2d9b0", 4);
  hand(c, 70, 190, 0.2, 1.7, SKIN.child, CLOTH.child, false);
};

// ---------------------------------------------------------------- experiment 3: pumpkin flowers
const flowerStalk = (c: Ctx, pts: number[][], w: number) => { line(c, pts, w + 12, INK); line(c, pts, w, COL.green); };
// setup.e3.0
const e3s0 = (c: Ctx) => {
  ground(c);
  // female: flower on top of a baby pumpkin on a short stalk
  flowerStalk(c, [[260, 1000], [260, 860]], 30);
  babyPumpkin(c, 260, 760, 120);
  trumpet(c, 260, 650, 330, 150, -Math.PI / 2);
  // male: same flower on a long thin stalk
  flowerStalk(c, [[790, 1000], [790, 520]], 18);
  trumpet(c, 790, 520, 330, 150, -Math.PI / 2);
  leaf(c, 790, 860, 190, -0.5); leaf(c, 260, 940, 150, Math.PI + 0.5);
};
// setup.e3.1
const e3s1 = (c: Ctx) => {
  c.fillStyle = "#f0a96a"; c.fillRect(0, 0, D, 1080); c.fillStyle = "#6b4a8c"; c.fillRect(0, 0, D, 380); c.fillStyle = "#9a6aa0"; c.fillRect(0, 380, D, 120);
  shape(c, () => ell(c, 880, 150, 70, 70), "#fff3c8", 5); shape(c, () => ell(c, 910, 130, 62, 62), "#6b4a8c", 0);
  const vine = () => { c.beginPath(); c.moveTo(-20, 940); c.bezierCurveTo(250, 820, 400, 960, 600, 900); c.bezierCurveTo(800, 840, 950, 900, 1100, 830); };
  vine(); c.strokeStyle = INK; c.lineWidth = 30; c.lineCap = "round"; c.stroke(); vine(); c.strokeStyle = COL.green; c.lineWidth = 20; c.stroke();
  leaf(c, 200, 880, 280, -2.3, COL.leaf); leaf(c, 900, 880, 280, -0.8, COL.leaf);
  flowerStalk(c, [[560, 910], [560, 700]], 28);
  // the paper bag over the bud and baby fruit, gathered and tied at the stalk
  const bag = () => { c.moveTo(535, 705); c.bezierCurveTo(430, 680, 400, 600, 400, 520); c.lineTo(400, 270); c.lineTo(720, 270); c.lineTo(720, 520); c.bezierCurveTo(720, 600, 690, 680, 585, 705); c.closePath(); };
  shadow(c, 600, 930, 190, 16);
  shape(c, bag, "#e7c68f", 6); shade(c, bag, "#c79b5c", 50, 0, 0.5);
  shape(c, () => polyP(c, [[400, 270], [720, 270], [720, 330], [400, 330]]), "#d9b172", 5); line(c, [[470, 420], [500, 600]], 3, "#c79b5c");
  line(c, [[528, 706], [592, 706]], 22, INK); line(c, [[528, 706], [592, 706]], 14, RED);
  shape(c, () => ell(c, 520, 676, 34, 16, -0.6), RED, 4); shape(c, () => ell(c, 610, 676, 34, 16, 0.6), RED, 4);
  const tl = [[528, 708], [420, 730], [330, 700]];
  line(c, tl, 16, INK); line(c, tl, 9, RED);
  hand(c, 110, 680, 0.05, 1.8, SKIN.child, CLOTH.child, false);
};
// setup.e3.2
const e3s2 = (c: Ctx) => {
  c.fillStyle = "#fff0b8"; c.fillRect(0, 0, D, D);
  c.fillStyle = "#ffe08a"; c.beginPath(); c.arc(960, 100, 190, 0, Math.PI * 2); c.fill();
  shape(c, () => ell(c, 960, 100, 95, 95), COL.yellow, 6);
  for (let k = 0; k < 6; k++) { const a = 1.7 + k * 0.28; line(c, [[960 + Math.cos(a) * 115, 100 + Math.sin(a) * 115], [960 + Math.cos(a) * 160, 100 + Math.sin(a) * 160]], 8, COL.orange); }
  soil(c);
  // open female flower, facing up, on its baby pumpkin
  flowerStalk(c, [[760, 1000], [760, 900]], 30);
  babyPumpkin(c, 760, 840, 105);
  trumpet(c, 760, 760, 280, 130, -Math.PI / 2);
  shape(c, () => ell(c, 765, 478, 40, 26), COL.yellow, 5);
  // the male flower in the child's hand, its middle brushed on the sticky middle
  line(c, [[215, 215], [420, 340]], 24, INK); line(c, [[215, 215], [420, 340]], 14, COL.green);
  trumpet(c, 410, 335, 260, 110, 0.55);
  for (const [px, py] of [[690, 430], [720, 410], [745, 440], [705, 462], [790, 440]]) { c.beginPath(); ell(c, px, py, 9, 9); c.fillStyle = COL.yellow; c.fill(); c.lineWidth = 3; c.strokeStyle = INK; c.stroke(); }
  arrow(c, [[420, 470], [580, 560]], RED, 14);
  hand(c, 100, 150, 0.5, 1.8, SKIN.child, CLOTH.child, false);
};

// ---------------------------------------------------------------- experiment 4: floating leaves
// setup.e4.0
const e4s0 = (c: Ctx) => {
  ground(c);
  palak(c, 600, 660, 760, -0.35, [[760, 580, 36], [700, 720, 36]]);
  // the straw standing on the leaf
  shadow(c, 480, 600, 60, 14);
  shape(c, () => rrect(c, 440, 130, 76, 470, 8), "rgba(255,255,255,0.9)", 6);
  for (let k = 0; k < 6; k++) line(c, [[440, 190 + k * 70], [516, 160 + k * 70]], 12, RED);
  shape(c, () => ell(c, 478, 600, 38, 16), "#f5ece0", 5);
  arrow(c, [[320, 150], [320, 400]], RED, 14);
  hand(c, 50, 850, -0.4, 1.9, SKIN.child, CLOTH.child, false);
};
// setup.e4.1
const e4s1 = (c: Ctx) => {
  ground(c);
  shadow(c, 520, 700, 380, 22);
  // syringe lying flat: nozzle on the left under the child's fingertip, leaf circles sunk in the water, plunger pulled back
  line(c, [[300, 480], [190, 480]], 50, INK); line(c, [[300, 480], [190, 480]], 32, COL.glass);
  shape(c, () => rrect(c, 305, 495, 400, 80, 8), COL.water, 0);
  shape(c, () => rrect(c, 300, 385, 440, 190, 20), "rgba(214,236,250,0.55)", 7); shine(c, [[345, 412], [680, 412]], 9);
  shape(c, () => rrect(c, 305, 489, 400, 12, 4), COL.drop, 0);
  for (const [dx, dy] of [[360, 546], [440, 552], [520, 544], [600, 554]]) disc(c, dx, dy, 32);
  shape(c, () => rrect(c, 690, 395, 60, 170, 10), COL.black, 5);
  line(c, [[750, 480], [880, 480]], 28, INK); line(c, [[750, 480], [880, 480]], 16, COL.steelIn);
  shape(c, () => rrect(c, 740, 360, 20, 240, 8), COL.steel, 5);
  shape(c, () => rrect(c, 860, 390, 40, 180, 12), COL.steel, 6);
  arrow(c, [[480, 700], [760, 700]], RED, 14);
  // right hand pulls the plunger back, left fingertip presses over the nozzle
  hand(c, 975, 480, Math.PI, 1.25, SKIN.child, CLOTH.child, false);
  hand(c, 225, 655, -Math.PI / 2, 1.8, SKIN.child, CLOTH.child, true);
};
// setup.e4.2
const e4s2 = (c: Ctx) => {
  c.fillStyle = "#fff0b8"; c.fillRect(0, 0, 540, D); c.fillStyle = "#26233f"; c.fillRect(540, 0, 540, D);
  shape(c, () => ell(c, 270, 170, 90, 90), COL.yellow, 6);
  for (let k = 0; k < 10; k++) { const a = k * Math.PI / 5; line(c, [[270 + Math.cos(a) * 115, 170 + Math.sin(a) * 115], [270 + Math.cos(a) * 160, 170 + Math.sin(a) * 160]], 9, COL.orange); }
  shape(c, () => rrect(c, 560, 40, 500, 1000, 8), "#3a3560", 6);
  glass(c, 270, 940, 330, 520, 0.85); glass(c, 810, 940, 330, 520, 0.85);
  for (const [dx, dy] of [[210, 500], [270, 520], [330, 498], [240, 548], [305, 550]]) disc(c, dx, dy, 28);
  for (const [dx, dy] of [[740, 920], [800, 924], [860, 916], [770, 898], [835, 896]]) disc(c, dx, dy, 28);
  line(c, [[540, 0], [540, D]], 8);
};

export const su_seedsAndLifeCyclesPlantLifeCycle = cards("sci.seeds-and-life-cycles.plant-life-cycle.L3 set-up", [
  e1s0, e1s1, e1s2, e2s0, e2s1, e2s2, e3s0, e3s1, e3s2, e4s0, e4s1, e4s2,
]);
void INK; void RED; void WHITE; void rnd; void shine; void arrow; void write; void polyP; void rrect;
