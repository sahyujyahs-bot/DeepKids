import type { Ctx } from "./core";
import { INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, glass, bowl, plate, leaf, person, write, cards } from "./flatKit";

// sci.chemistry.reaction-speed.L3 · picture cards (cover, flows, terms, explanations).
const RUST = "#b5532a", RUSTDK = "#8a3a1c", FOAM = "#fbfbff", POT = "#c99a5e", POTDK = "#a87a40", POTIN = "#f2e3b8", PEROX = "#e4f1fa";
const SPARK = "#ffe27a";

const table = (c: Ctx, y: number) => {
  shape(c, () => rrect(c, -20, y, 1120, 70, 4), COL.wood, 6);
  c.fillStyle = COL.woodDk; c.fillRect(-14, y + 44, 1108, 20);
  line(c, [[-14, y + 64], [1094, y + 64]], 6);
};
const night = (c: Ctx, x: number, y: number, w: number, h: number) => { shape(c, () => rrect(c, x, y, w, h, 16), "#2a2f5a", 6); const r = rnd(5); for (let i = 0; i < 9; i++) { c.beginPath(); ell(c, x + 20 + r() * (w - 40), y + 20 + r() * (h - 40), 3, 3); c.fillStyle = "#fff"; c.fill(); } };
const panel = (c: Ctx, x: number, y: number, w: number, h: number, col: string = COL.paper) => shape(c, () => rrect(c, x, y, w, h, 18), col, 6);
const clock = (c: Ctx, x: number, y: number, r: number, a1: number, a2: number) => {
  shape(c, () => ell(c, x, y, r, r), WHITE, 6);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.82, y + Math.sin(a) * r * 0.82], [x + Math.cos(a) * r * 0.93, y + Math.sin(a) * r * 0.93]], 3); }
  line(c, [[x, y], [x + Math.cos(a1) * r * 0.78, y + Math.sin(a1) * r * 0.78]], 6, RED);
  line(c, [[x, y], [x + Math.cos(a2) * r * 0.5, y + Math.sin(a2) * r * 0.5]], 7);
  shape(c, () => ell(c, x, y, r * 0.09, r * 0.09), INK, 0);
};
const bub = (c: Ctx, x: number, y: number, r: number) => { c.beginPath(); ell(c, x, y, r, r); c.fillStyle = "rgba(255,255,255,0.7)"; c.fill(); c.lineWidth = Math.max(2.5, r * 0.16); c.strokeStyle = INK; c.stroke(); };
const bubbles = (c: Ctx, x0: number, x1: number, y0: number, y1: number, n: number, seed: number, r0 = 9) => { const r = rnd(seed); for (let i = 0; i < n; i++) bub(c, x0 + r() * (x1 - x0), y0 + r() * (y1 - y0), r0 + r() * r0 * 0.7); };
const spark = (c: Ctx, x: number, y: number, len: number, an: number) => { line(c, [[x, y], [x + Math.cos(an) * len, y + Math.sin(an) * len]], 7, SPARK); line(c, [[x, y], [x + Math.cos(an) * len * 0.5, y + Math.sin(an) * len * 0.5]], 3, WHITE); };
// sparkler: a thin wire with a sparking tip at (tx, ty), wire going down-right to (bx, by)
const sparkler = (c: Ctx, tx: number, ty: number, bx: number, by: number, s = 1) => {
  line(c, [[tx, ty], [bx, by]], 12 * s + 8, INK); line(c, [[tx, ty], [bx, by]], 12 * s, COL.steelDk);
  const an = Math.atan2(by - ty, bx - tx);
  line(c, [[tx, ty], [tx + Math.cos(an) * 120 * s, ty + Math.sin(an) * 120 * s]], 14 * s + 8, INK); line(c, [[tx, ty], [tx + Math.cos(an) * 120 * s, ty + Math.sin(an) * 120 * s]], 14 * s, COL.greyDk);
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2 + 0.2; spark(c, tx, ty, (40 + (i % 3) * 22) * s, a); }
  c.beginPath(); ell(c, tx, ty, 16 * s, 16 * s); c.fillStyle = "#fff6c4"; c.fill();
};
const nail = (c: Ctx, x: number, y: number, len: number, rustFrac: number, vertical = false) => {
  c.save(); c.translate(x, y); if (vertical) c.rotate(Math.PI / 2);
  const w = 22, hl = len / 2;
  shape(c, () => polyP(c, [[-hl, -w / 2], [hl - 30, -w / 2], [hl, 0], [hl - 30, w / 2], [-hl, w / 2]]), COL.steel, 6);
  shape(c, () => rrect(c, -hl - 12, -w, 14, w * 2, 6), COL.steelDk, 6);
  if (rustFrac > 0) { const rx = hl - len * rustFrac; shape(c, () => polyP(c, [[rx, -w / 2], [hl - 30, -w / 2], [hl, 0], [hl - 30, w / 2], [rx, w / 2]]), RUST, 6); const r = rnd(3); for (let i = 0; i < 7; i++) { c.beginPath(); ell(c, rx + r() * (hl - rx - 20), (r() - 0.5) * 14, 5, 4); c.fillStyle = RUSTDK; c.fill(); } }
  c.restore();
};
const potato = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0) => {
  shape(c, () => ell(c, x, y, rx, ry, rot), POT, 6); shade(c, () => ell(c, x, y, rx, ry, rot), POTDK, rx * 0.2, ry * 0.2, 0.6);
  const r = rnd(8); for (let i = 0; i < 4; i++) { c.beginPath(); ell(c, x + (r() - 0.5) * rx, y + (r() - 0.5) * ry, 5, 3.5); c.fillStyle = POTDK; c.fill(); }
};
const gratedHeap = (c: Ctx, x: number, y: number, w: number, h: number, seed = 4) => {
  const r = rnd(seed); for (let i = 0; i < 26; i++) { const t = r(), u = r(); const px = x - w + t * 2 * w, top = y - Math.sin(t * Math.PI) * h; shape(c, () => ell(c, px, top + u * (y - top), 22, 9, (r() - 0.5) * 2), POTIN, 3); }
};
const foamTop = (c: Ctx, x: number, y: number, w: number, n: number, seed: number, rr = 28) => { const r = rnd(seed); for (let i = 0; i < n; i++) { c.beginPath(); ell(c, x - w + r() * 2 * w, y - r() * rr, rr * (0.6 + r() * 0.5), rr * (0.6 + r() * 0.5)); c.fillStyle = FOAM; c.fill(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke(); } };
// glass with foam column up through the top
const foamGlass = (c: Ctx, x: number, y: number, w: number, h: number, foamH: number, seed: number) => {
  glass(c, x, y, w, h, 0.35, PEROX);
  gratedHeap(c, x, y - 8, w * 0.32, 26, seed);
  foamTop(c, x, y - h * 0.4, w * 0.45, 8, seed + 1, 26);
  if (foamH > 0) {
    shape(c, () => rrect(c, x - w * 0.46, y - h - foamH, w * 0.92, foamH + h * 0.62, 30), FOAM, 6);
    foamTop(c, x, y - h - foamH + 24, w * 0.46, 14, seed + 2, 34);
    bubbles(c, x - w * 0.36, x + w * 0.36, y - h - foamH + 40, y - h * 0.5, 9, seed + 3, 10);
  }
};
const brownBottle = (c: Ctx, x: number, y: number, w: number, h: number, cap = WHITE) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const body = () => rrect(c, x - w / 2, y - h * 0.75, w, h * 0.75, w * 0.14);
  shape(c, () => rrect(c, x - w * 0.2, y - h - 4, w * 0.4, h * 0.3, 8), "#7b4a22", 6);
  shape(c, () => rrect(c, x - w * 0.24, y - h - 30, w * 0.48, 40, 6), cap, 5);
  shape(c, body, "#8a5224", 6); shade(c, body, "#5e3414", w * 0.16, 0, 0.55);
  shine(c, [[x - w * 0.36, y - h * 0.65], [x - w * 0.36, y - h * 0.25]], 9);
  shape(c, () => rrect(c, x - w * 0.34, y - h * 0.55, w * 0.68, h * 0.34, 6), WHITE, 5);
};
const smallBottle = brownBottle;
const crossedSun = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), SPARK, 5);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 7, COL.orange); }
  line(c, [[x - r * 1.9, y - r * 1.9], [x + r * 1.9, y + r * 1.9]], 13, RED);
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.8, y + Math.sin(a) * r * 1.8]], 8, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), SPARK, 6);
};
const egg = (c: Ctx, x: number, y: number, rx: number, ry: number) => shape(c, () => ell(c, x, y, rx, ry), "#f6ecdc", 5);
const shellPiece = (c: Ctx, x: number, y: number, w: number, rot = 0) => { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => { c.moveTo(-w, 0); c.quadraticCurveTo(0, -w * 0.9, w, 0); c.quadraticCurveTo(0, w * 0.35, -w, 0); c.closePath(); }, "#f6ecdc", 5); c.restore(); };
const grains = (c: Ctx, x: number, y: number, w: number, h: number, n: number, seed: number, col = "#f6ecdc", rr = 5) => { const r = rnd(seed); for (let i = 0; i < n; i++) { c.beginPath(); ell(c, x - w + r() * 2 * w, y - r() * h, rr, rr * 0.8, r() * 3); c.fillStyle = col; c.fill(); c.lineWidth = 2; c.strokeStyle = INK; c.stroke(); } };
const dosa = (c: Ctx, x: number, y: number, r: number, brown: boolean) => { shape(c, () => ell(c, x, y, r, r * 0.45), brown ? "#d99a4a" : "#f3dfb0", 6); if (brown) { const rr = rnd(2); for (let i = 0; i < 8; i++) { c.beginPath(); ell(c, x + (rr() - 0.5) * r * 1.5, y + (rr() - 0.5) * r * 0.5, 9, 5); c.fillStyle = "#a8602a"; c.fill(); } } };
const banana = (c: Ctx, x: number, y: number, s: number, spots: boolean) => {
  const p = () => { c.moveTo(x - s, y - s * 0.2); c.quadraticCurveTo(x, y + s * 1.0, x + s, y - s * 0.7); c.quadraticCurveTo(x + s * 0.2, y + s * 0.35, x - s, y - s * 0.2); c.closePath(); };
  shape(c, p, spots ? "#f1c640" : "#fbe35f", 6);
  if (spots) { const r = rnd(6); for (let i = 0; i < 7; i++) { c.beginPath(); ell(c, x - s * 0.5 + r() * s, y + s * 0.08 + r() * s * 0.2, 6, 5); c.fillStyle = "#6a4128"; c.fill(); } }
  line(c, [[x + s, y - s * 0.7], [x + s * 1.1, y - s * 0.95]], 10, COL.greenDk);
};
const hook = (c: Ctx, x: number, y: number, s: number) => {
  const path = () => { c.beginPath(); c.moveTo(x, y - s); c.lineTo(x, y + s * 0.4); c.arc(x + s * 0.4, y + s * 0.4, s * 0.4, Math.PI, Math.PI * 0.1, true); };
  path(); c.strokeStyle = INK; c.lineWidth = 26; c.lineCap = "round"; c.stroke(); path(); c.strokeStyle = RUST; c.lineWidth = 16; c.stroke();
  shape(c, () => ell(c, x, y - s, 18, 18), RUST, 5); c.beginPath(); ell(c, x, y - s, 6, 6); c.fillStyle = INK; c.fill();
};
const rustSpots = (c: Ctx, x: number, y: number, w: number, h: number, n: number, seed: number) => { const r = rnd(seed); for (let i = 0; i < n; i++) { c.beginPath(); ell(c, x + r() * w, y + r() * h, 7 + r() * 8, 5 + r() * 5, r() * 3); c.fillStyle = RUST; c.fill(); } };
const particle = (c: Ctx, x: number, y: number, r: number, col: string = COL.blue) => { shape(c, () => ell(c, x, y, r, r), col, Math.max(3, r * 0.2)); shine(c, [[x - r * 0.45, y - r * 0.2], [x - r * 0.2, y - r * 0.5]], Math.max(3, r * 0.22)); };
const motion = (c: Ctx, x: number, y: number, an: number, len: number) => { line(c, [[x - Math.cos(an) * len, y - Math.sin(an) * len], [x - Math.cos(an) * len * 0.3, y - Math.sin(an) * len * 0.3]], 5, COL.blueDk); };
const lens = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), "#f2f8ff", 8); };
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) => shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 1.1, y - s * 0.2, x + s * 0.8, y + s * 0.3); c.quadraticCurveTo(x, y + s * 1.1, x - s * 0.8, y + s * 0.3); c.quadraticCurveTo(x - s * 1.1, y - s * 0.2, x, y - s * 1.5); c.closePath(); }, col, Math.max(3, s * 0.2));
const strainer = (c: Ctx, x: number, y: number, r: number) => {
  line(c, [[x + r * 0.6, y - r * 0.3], [x + r * 1.9, y - r * 0.95]], 22, INK); line(c, [[x + r * 0.6, y - r * 0.3], [x + r * 1.9, y - r * 0.95]], 12, COL.steelDk);
  shape(c, () => { c.moveTo(x - r, y - r * 0.2); c.bezierCurveTo(x - r, y + r * 0.9, x + r, y + r * 0.9, x + r, y - r * 0.2); c.closePath(); }, COL.steelIn, 6);
  gratedHeap(c, x, y - r * 0.1, r * 0.55, 20, 11);
  shape(c, () => ell(c, x, y - r * 0.2, r, r * 0.22), "rgba(255,255,255,0.4)", 6);
};
const chain = (c: Ctx, x: number, y: number, n: number, gap: number, r: number, col: string) => { for (let i = 0; i < n; i++) { if (i) line(c, [[x + (i - 1) * gap, y], [x + i * gap, y]], 5); particle(c, x + i * gap, y, r, col); } };
const mouthChild = (c: Ctx, x: number, y: number, h: number) => person(c, x, y, h, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [Math.PI * 0.45, Math.PI * 0.5] });
const bigCell = (c: Ctx, x: number, y: number, rx: number, ry: number, col: string, rot = 0) => { shape(c, () => ell(c, x, y, rx, ry, rot), col, 7); };
const catalase = (c: Ctx, x: number, y: number, s: number, col: string = COL.purple) => { shape(c, () => { c.moveTo(x - s, y - s * 0.2); c.quadraticCurveTo(x - s * 1.2, y + s * 1.1, x, y + s * 1.1); c.quadraticCurveTo(x + s * 1.2, y + s * 1.1, x + s, y - s * 0.2); c.quadraticCurveTo(x + s * 0.4, y + s * 0.2, x, y + s * 0.2); c.quadraticCurveTo(x - s * 0.4, y + s * 0.2, x - s, y - s * 0.2); c.closePath(); }, col, Math.max(3, s * 0.1)); };
const cardRect = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => shape(c, () => rrect(c, x, y, w, h, 12), col, 5);

// ---------------------------------------------------------------- intro: fast to slow, a clock over each
const intro = (c: Ctx) => {
  ground(c);
  const xs = [135, 405, 675, 945];
  const hands: [number, number][] = [[-1.2, -1.2], [1.4, -0.8], [0.4, 2.2], [2.6, 0.1]];
  xs.forEach((x, i) => { panel(c, x - 120, 210, 240, 640); clock(c, x, 320, 70, hands[i][0], hands[i][1]); });
  // matchstick flaring
  line(c, [[135, 560], [135, 770]], 20, INK); line(c, [[135, 560], [135, 770]], 10, COL.wood);
  shape(c, () => ell(c, 135, 548, 24, 20), RED, 5);
  shape(c, () => { c.moveTo(135, 440); c.quadraticCurveTo(190, 500, 170, 545); c.quadraticCurveTo(135, 580, 100, 545); c.quadraticCurveTo(80, 500, 135, 440); c.closePath(); }, COL.orange, 5);
  shape(c, () => { c.moveTo(135, 490); c.quadraticCurveTo(165, 520, 152, 548); c.quadraticCurveTo(135, 565, 118, 548); c.quadraticCurveTo(105, 520, 135, 490); c.closePath(); }, SPARK, 4);
  // dosa on tava
  shape(c, () => ell(c, 405, 650, 100, 38), COL.black, 6);
  dosa(c, 405, 630, 82, true);
  line(c, [[505, 655], [530, 700]], 14, INK);
  // banana with spots
  banana(c, 675, 590, 95, true);
  banana(c, 675, 720, 95, true);
  // rusty hook
  hook(c, 945, 560, 110);
};

const summary = (c: Ctx) => {
  ground(c);
  night(c, 40, 240, 320, 560);
  sparkler(c, 150, 400, 290, 740, 0.9);
  hand(c, 330, 760, -2.3, 0.9, SKIN.child, CLOTH.child);
  panel(c, 380, 240, 320, 560, COL.sky);
  foamGlass(c, 540, 770, 190, 270, 150, 20);
  panel(c, 720, 240, 320, 560, COL.paper);
  // balcony grill, rusty
  for (let i = 0; i < 5; i++) { const x = 760 + i * 55; line(c, [[x, 280], [x, 770]], 26, INK); line(c, [[x, 280], [x, 770]], 14, RUST); }
  line(c, [[745, 340], [1015, 340]], 28, INK); line(c, [[745, 340], [1015, 340]], 16, RUST);
  line(c, [[745, 700], [1015, 700]], 28, INK); line(c, [[745, 700], [1015, 700]], 16, RUST);
  rustSpots(c, 750, 300, 260, 460, 14, 12);
};

// ---------------------------------------------------------------- flows
const flowE2 = (c: Ctx) => {
  ground(c); table(c, 800);
  glass(c, 290, 800, 330, 380, 0.5, "#eef6fb"); glass(c, 790, 800, 330, 380, 0.5, "#eef6fb");
  shellPiece(c, 290, 700, 80, -0.3);
  bubbles(c, 240, 340, 560, 640, 3, 31, 9);
  grains(c, 790, 790, 90, 22, 40, 14);
  bubbles(c, 710, 870, 500, 720, 22, 32, 11);
  foamTop(c, 790, 480, 100, 6, 33, 24);
};
const flowE3 = (c: Ctx) => {
  ground(c); table(c, 800);
  const xs = [150, 400, 650, 900];
  xs.forEach((x, i) => { glass(c, x, 800, 190, 250, 0.55, PEROX); });
  // potato, carrot, cucumber, beetroot sitting in the glasses
  potato(c, 150, 720, 50, 36, 0.3);
  shape(c, () => polyP(c, [[375, 640], [425, 640], [402, 760]]), COL.orange, 5);
  shape(c, () => rrect(c, 625, 650, 50, 100, 20), COL.leaf, 5);
  shape(c, () => ell(c, 900, 720, 42, 40), "#8c2b4f", 5);
  // bubbles: lots, few, none, few
  bubbles(c, 100, 200, 580, 700, 12, 41, 10); foamTop(c, 150, 570, 70, 5, 42, 20);
  bubbles(c, 360, 440, 620, 700, 2, 43, 8);
  bubbles(c, 910, 960, 640, 700, 2, 45, 8);
  // a red tick over the glass that fizzes the most
  line(c, [[110, 380], [150, 420], [220, 330]], 16, COL.greenDk);
  line(c, [[610, 360], [690, 440]], 14, RED); line(c, [[690, 360], [610, 440]], 14, RED);
};
const flowA1 = (c: Ctx) => {
  ground(c); table(c, 800);
  panel(c, 40, 160, 480, 560, COL.sky); panel(c, 560, 160, 480, 560, COL.paper);
  // fast: baking soda and lemon fizz
  glass(c, 280, 650, 260, 300, 0.5, "#fff3a8");
  bubbles(c, 190, 370, 360, 560, 14, 51, 11); foamTop(c, 280, 400, 80, 5, 52, 20);
  clock(c, 120, 240, 50, -1.4, -1.2);
  // slow: rusty nail with a long clock hand
  nail(c, 800, 560, 360, 0.5);
  clock(c, 640, 240, 50, 1.2, 3.1);
  // sun over many days
  sun(c, 960, 250, 28);
  arrow(c, [[760, 640], [900, 640]], RED, 8);
};
const flowA2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 440, 1000, 150, 10), COL.paper, 6);
  const cols = [COL.red, COL.orange, COL.yellow, COL.greenLt, COL.teal, COL.purple];
  cols.forEach((col, i) => { cardRect(c, 70 + i * 160, 300 + (i % 2) * 20, 130, 160, col); });
  // small pictures on cards: spark, fire, dosa, banana, rust, statue
  line(c, [[135, 380], [135, 340]], 6, WHITE); line(c, [[100, 380], [170, 380]], 6, WHITE);
  dosa(c, 455, 400, 40, true); banana(c, 615, 410, 40, true);
  line(c, [[775, 360], [775, 440]], 14, RUST);
  arrow(c, [[80, 710], [980, 710]], RED, 14);
  clock(c, 100, 850, 60, -1.4, -1.2); clock(c, 980, 850, 60, 1.2, 3.1);
};
const flowA3 = (c: Ctx) => {
  ground(c); table(c, 820);
  brownBottle(c, 400, 820, 230, 420);
  // foam coming out of the bottle top and spilling down
  shape(c, () => rrect(c, 330, 180, 140, 200, 60), FOAM, 6);
  foamTop(c, 400, 200, 80, 8, 61, 32);
  shape(c, () => rrect(c, 280, 360, 240, 140, 40), FOAM, 6);
  bubbles(c, 300, 500, 380, 480, 8, 62, 12);
  // yeast packet
  shape(c, () => rrect(c, 640, 560, 220, 260, 16), COL.yellow, 6);
  shape(c, () => rrect(c, 670, 640, 160, 90, 10), WHITE, 5);
  line(c, [[640, 590], [860, 590]], 6);
  grains(c, 750, 580, 60, 40, 14, 63, "#d9b27a", 6);
  arrow(c, [[740, 540], [560, 330]], RED, 10);
};
const flowA4 = (c: Ctx) => {
  ground(c);
  mouthChild(c, 380, 900, 640);
  bowl(c, 780, 700, 110);
  grains(c, 780, 690, 60, 20, 28, 71, WHITE, 8);
  arrow(c, [[690, 600], [480, 340]], RED, 9);
  clock(c, 830, 300, 100, -1.4, 0.4);
};
const flowA5 = (c: Ctx) => {
  ground(c);
  panel(c, 40, 200, 480, 600, COL.sky); panel(c, 560, 200, 480, 600, "#fbd9b8");
  // cold: slow, few arrows; warm: fast, many
  person(c, 160, 740, 360); person(c, 380, 700, 330);
  person(c, 700, 740, 360); person(c, 930, 700, 330);
  arrow(c, [[200, 330], [260, 330]], RED, 8);
  arrow(c, [[600, 300], [760, 300]], RED, 12); arrow(c, [[850, 340], [690, 380]], RED, 12);
  // snowflake mark and sun
  line(c, [[430, 280], [490, 340]], 8, COL.blueDk); line(c, [[490, 280], [430, 340]], 8, COL.blueDk);
  sun(c, 980, 270, 30);
};
const flowP1 = (c: Ctx) => {
  ground(c); table(c, 800);
  panel(c, 40, 180, 480, 560, COL.sky); panel(c, 560, 180, 480, 560, "#cfc7dc");
  sun(c, 150, 250, 40);
  shape(c, () => rrect(c, 160, 400, 120, 260, 6), "#f2c016", 5); shape(c, () => rrect(c, 330, 400, 120, 260, 6), "#fbe27a", 5);
  shape(c, () => rrect(c, 650, 400, 120, 260, 6), "#f2c016", 5); shape(c, () => rrect(c, 820, 400, 120, 260, 6), "#f2c016", 5);
  // shade: a cupboard door shape with a dark moon-less shadow
  shape(c, () => rrect(c, 1000, 220, 0, 0, 0), WHITE, 0);
  shape(c, () => ell(c, 960, 260, 50, 40), COL.greyDk, 5);
  clock(c, 620, 250, 45, -1.4, 0.3);
};
const flowC1 = (c: Ctx) => {
  ground(c); table(c, 820);
  foamGlass(c, 400, 820, 260, 340, 330, 81);
  // ruler beside
  shape(c, () => rrect(c, 640, 120, 90, 700, 6), COL.wood, 6);
  for (let i = 0; i <= 14; i++) line(c, [[640, 120 + i * 50], [640 + (i % 5 === 0 ? 50 : 28), 120 + i * 50]], 4);
  arrow(c, [[860, 640], [860, 200]], RED, 12);
  clock(c, 900, 760, 70, -1.4, -0.3);
};
const flowC2 = (c: Ctx) => {
  ground(c); table(c, 800);
  sun(c, 160, 190, 60);
  // three yellow cards, one covered with foil, one with plastic
  cardRect(c, 80, 450, 250, 280, "#f2c016");
  cardRect(c, 420, 450, 250, 280, "#c9d1dc");
  cardRect(c, 760, 450, 250, 280, "rgba(120,170,220,0.7)");
  shape(c, () => rrect(c, 440, 470, 210, 240, 8), "#dfe5ec", 5);
  arrow(c, [[300, 330], [220, 420]], RED, 10); arrow(c, [[400, 300], [520, 420]], RED, 10); arrow(c, [[460, 240], [860, 420]], RED, 10);
  shape(c, () => rrect(c, 780, 470, 210, 240, 8), "#f2c016", 4);
};

// ---------------------------------------------------------------- terms
const term0 = (c: Ctx) => { ground(c); shadow(c, 540, 700, 440, 40); c.save(); c.translate(540, 600); c.scale(1.35, 1.8); c.translate(-540, -600); nail(c, 540, 600, 700, 0.5); c.restore(); arrow(c, [[420, 450], [700, 450]], RED, 12); };
const term1 = (c: Ctx) => { ground(c); night(c, 60, 60, 960, 960); sparkler(c, 420, 400, 640, 900, 2.2); clock(c, 850, 200, 100, -1.4, -1.2); };
const term2 = (c: Ctx) => {
  ground(c); table(c, 800);
  const anklet = (x: number, col: string, dk: string) => { shape(c, () => ell(c, x, 560, 190, 190), col, 8); shape(c, () => ell(c, x, 560, 120, 120), "#efe4cf", 8); for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; shape(c, () => ell(c, x + Math.cos(a) * 155, 560 + Math.sin(a) * 155, 20, 20), dk, 4); } };
  anklet(290, "#e5e9ef", "#c9d1dc"); anklet(790, "#5a5560", "#3a3540");
  clock(c, 540, 300, 80, 1.2, 3.1);
  arrow(c, [[420, 560], [660, 560]], RED, 12);
};
const term3 = (c: Ctx) => {
  ground(c);
  drop(c, 300, 780, 130);
  lens(c, 640, 400, 340);
  const r = rnd(9);
  for (let i = 0; i < 22; i++) { const a = r() * 6.28, d = r() * 250; particle(c, 640 + Math.cos(a) * d, 400 + Math.sin(a) * d, 28, i % 2 ? COL.blue : COL.teal); }
  arrow(c, [[420, 600], [470, 560]], RED, 8);
};
const term4 = (c: Ctx) => {
  ground(c); table(c, 820);
  glass(c, 540, 820, 400, 400, 0.6, PEROX);
  strainer(c, 480, 340, 130);
  arrow(c, [[480, 130], [480, 220]], RED, 12);
  bubbles(c, 430, 650, 560, 700, 10, 91, 12);
};
const term5 = (c: Ctx) => {
  ground(c);
  mouthChild(c, 330, 940, 760);
  lens(c, 740, 420, 270);
  chain(c, 560, 360, 4, 55, 20, COL.purple); chain(c, 640, 450, 2, 55, 20, COL.pink); chain(c, 560, 510, 3, 55, 20, COL.pink);
  arrow(c, [[460, 400], [510, 380]], RED, 8);
};
const term7 = (c: Ctx) => { ground(c); table(c, 860); brownBottle(c, 400, 860, 330, 560); crossedSun(c, 790, 400, 80); };
const term8 = (c: Ctx) => {
  ground(c); table(c, 860);
  glass(c, 540, 860, 460, 640, 0.75, COL.drop);
  bubbles(c, 390, 690, 380, 760, 10, 95, 24);
  arrow(c, [[540, 180], [540, 60]], RED, 12);
  // O2 written with the letter o as a circle and a 2
  shape(c, () => ell(c, 870, 330, 34, 34), "rgba(0,0,0,0)", 8); write(c, "2", 905, 350, 60, INK, 9);
};
const term9 = (c: Ctx) => {
  ground(c); table(c, 800);
  shellPiece(c, 290, 640, 150, -0.2);
  grains(c, 790, 740, 220, 130, 150, 97, "#f6ecdc", 9);
  arrow(c, [[640, 380], [740, 510]], RED, 9); arrow(c, [[940, 380], [850, 510]], RED, 9);
};

// ---------------------------------------------------------------- explanations
const expl0 = (c: Ctx) => {
  ground(c); panel(c, 30, 200, 490, 640, COL.sky); panel(c, 560, 200, 490, 640, "#fbe8c4");
  // ice cube melting to water: same stuff
  shape(c, () => rrect(c, 90, 280, 150, 150, 20), "#dff1fb", 6);
  shine(c, [[110, 300], [120, 400]], 9);
  arrow(c, [[170, 470], [170, 540]], RED, 10);
  shape(c, () => ell(c, 280, 700, 190, 55), COL.water, 6);
  // dosa batter to brown dosa: new stuff
  bowl(c, 710, 420, 100, "#f6ecd0");
  arrow(c, [[820, 440], [880, 520]], RED, 10);
  shape(c, () => ell(c, 850, 710, 170, 50), COL.black, 6); dosa(c, 850, 690, 130, true);
};
const expl1 = (c: Ctx) => {
  ground(c);
  arrow(c, [[60, 540], [1010, 540]], RED, 16);
  const items: [number, () => void][] = [
    [120, () => { sparkler(c, 120, 330, 170, 480, 0.5); }],
    [300, () => { dosa(c, 300, 400, 70, true); }],
    [480, () => { banana(c, 480, 400, 70, true); }],
    [660, () => { for (let i = 0; i < 3; i++) line(c, [[630 + i * 30, 330], [630 + i * 30, 450]], 16, RUST); }],
    [860, () => { shape(c, () => ell(c, 860, 400, 70, 80), "#4fb6a0", 6); }],
  ];
  items.forEach(([x, f]) => { panel(c, x - 80, 280, 160, 220, COL.paper); f(); });
  clock(c, 120, 720, 60, -1.4, -1.2); clock(c, 540, 720, 60, 1.0, 2.0); clock(c, 960, 720, 60, 1.2, 3.1);
};
const expl2 = (c: Ctx) => {
  ground(c);
  panel(c, 30, 200, 490, 640, COL.sky); panel(c, 560, 200, 490, 640, "#fbd9b8");
  const r = rnd(14);
  for (let i = 0; i < 6; i++) { particle(c, 100 + r() * 340, 280 + r() * 480, 32, COL.blue); }
  for (let i = 0; i < 10; i++) { const x = 620 + r() * 350, y = 280 + r() * 480; particle(c, x, y, 32, COL.orange); }
  [[740, 400], [860, 560], [680, 690]].forEach(([x, y]) => { for (let k = 0; k < 6; k++) { const a = k * 1.047; line(c, [[x + Math.cos(a) * 18, y + Math.sin(a) * 18], [x + Math.cos(a) * 44, y + Math.sin(a) * 44]], 6, RED); } });
};
const expl3 = (c: Ctx) => {
  ground(c);
  const xs = [190, 540, 890];
  xs.forEach((x) => panel(c, x - 160, 260, 320, 520));
  // 1: cupped hand holding a particle; 2: particle in two; 3: hand empty
  catalase(c, 190, 520, 120); particle(c, 190, 480, 38, COL.orange);
  catalase(c, 540, 520, 120); particle(c, 510, 470, 30, COL.blue); particle(c, 575, 470, 30, COL.teal);
  catalase(c, 890, 520, 120);
  arrow(c, [[330, 880], [400, 880]], RED, 10); arrow(c, [[690, 880], [740, 880]], RED, 10);
  particle(c, 190, 320, 28, COL.orange);
};
const expl4 = (c: Ctx) => {
  ground(c);
  // plant cell, yeast cell, blood cell
  const xs = [190, 540, 890];
  xs.forEach((x) => panel(c, x - 160, 260, 320, 520));
  shape(c, () => rrect(c, 55, 330, 270, 360, 30), COL.greenLt, 7);
  shape(c, () => ell(c, 540, 520, 130, 160, 0.3), "#f1deb0", 7);
  shape(c, () => ell(c, 890, 520, 120, 120), COL.red, 7); shape(c, () => ell(c, 890, 520, 55, 55), "#b73a2a", 5);
  [190, 540, 890].forEach((x, i) => { catalase(c, x + (i === 2 ? 0 : 0), 560 + (i === 2 ? 130 : 0), 50); particle(c, x, 500 + (i === 2 ? 120 : 0), 20, COL.orange); });
};
const expl5 = (c: Ctx) => {
  ground(c);
  night(c, 40, 120, 1000, 840);
  const wig = [[160, 520], [260, 400], [380, 480], [480, 360], [600, 450], [700, 340], [820, 430], [920, 520], [820, 640], [700, 560], [580, 680], [460, 600], [340, 700], [220, 640]];
  line(c, wig, 38, INK); line(c, wig, 24, COL.pink);
  particle(c, 480, 300, 30, COL.orange); particle(c, 600, 300, 30, COL.teal);
  arrow(c, [[480, 240], [540, 200]], WHITE, 8);
};

const LIST = [intro, summary, flowE2, flowE3, flowA1, flowA2, flowA3, flowA4, flowA5, flowP1, flowC1, flowC2, term0, term1, term2, term3, term4, term5, term7, term8, term9, expl0, expl1, expl2, expl3, expl4, expl5];
export const ic_chemistryReactionSpeedL3 = cards("sci.chemistry.reaction-speed.L3 cards", LIST);
