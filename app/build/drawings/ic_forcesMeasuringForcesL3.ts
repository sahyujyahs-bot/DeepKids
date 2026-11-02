import type { Ctx } from "./core";
import { INK, WHITE, COL, SKIN, CLOTH, RED, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, glass, write, cards } from "./flatKit";

// sci.forces.measuring-forces.L3 · picture cards (activities, experiments, challenges, terms).
// Child and grown-up are the same as on the set-up cards. Forcemeters hang from a ring; the pointer is red.

const PAPER = "#fffaf0", APPLE = "#e4523b", APPLEDK = "#b93a2a";
const dash = (c: Ctx, x1: number, y1: number, x2: number, y2: number, col = INK, w = 5, seg = 16) => {
  const L = Math.hypot(x2 - x1, y2 - y1), n = Math.max(1, Math.floor(L / seg));
  for (let i = 0; i < n; i += 2) { const a = i / n, b = Math.min(1, (i + 1) / n); line(c, [[x1 + (x2 - x1) * a, y1 + (y2 - y1) * a], [x1 + (x2 - x1) * b, y1 + (y2 - y1) * b]], w, col); }
};
const wN = (c: Ctx, x: number, y: number, h: number) => line(c, [[x, y + h], [x, y], [x + h * 0.55, y + h], [x + h * 0.55, y]], Math.max(6, h * 0.12));
// a number and then N, e.g. 10 N
const lab = (c: Ctx, d: string, x: number, y: number, h: number) => { write(c, d, x, y, h, INK, Math.max(6, h * 0.12)); wN(c, x + d.length * h * 0.8 + h * 0.15, y, h); };
const qmark = (c: Ctx, x: number, y: number, h: number, col: string = INK) => {
  const r = h * 0.25, cy = y + r; c.beginPath(); c.arc(x, cy, r, Math.PI, Math.PI * 2.5); c.strokeStyle = col; c.lineWidth = Math.max(7, h * 0.11); c.lineCap = "round"; c.stroke();
  line(c, [[x, cy + r], [x, y + h * 0.68]], Math.max(7, h * 0.11), col); c.beginPath(); c.arc(x, y + h * 0.97, h * 0.07, 0, Math.PI * 2); c.fillStyle = col; c.fill();
};
const tick = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.green, 6); line(c, [[x - r * 0.45, y], [x - r * 0.1, y + r * 0.4], [x + r * 0.5, y - r * 0.35]], r * 0.22, WHITE);
};
const apple = (c: Ctx, x: number, y: number, r: number) => {
  const b = () => { c.moveTo(x, y - r * 0.78); c.bezierCurveTo(x + r * 0.5, y - r * 1.1, x + r * 1.15, y - r * 0.5, x + r * 0.95, y + r * 0.25); c.bezierCurveTo(x + r * 0.75, y + r * 1.0, x + r * 0.25, y + r * 1.0, x, y + r * 0.88); c.bezierCurveTo(x - r * 0.25, y + r * 1.0, x - r * 0.75, y + r * 1.0, x - r * 0.95, y + r * 0.25); c.bezierCurveTo(x - r * 1.15, y - r * 0.5, x - r * 0.5, y - r * 1.1, x, y - r * 0.78); c.closePath(); };
  shape(c, b, APPLE); shade(c, b, APPLEDK, r * 0.3, r * 0.1);
  line(c, [[x, y - r * 0.75], [x + r * 0.08, y - r * 1.1]], Math.max(4, r * 0.1), COL.soilDk);
  shape(c, () => { c.moveTo(x + r * 0.1, y - r * 0.95); c.quadraticCurveTo(x + r * 0.5, y - r * 1.35, x + r * 0.75, y - r * 1.0); c.quadraticCurveTo(x + r * 0.45, y - r * 0.75, x + r * 0.1, y - r * 0.95); c.closePath(); }, COL.leaf, 4);
  line(c, [[x - r * 0.55, y - r * 0.25], [x - r * 0.45, y - r * 0.55]], Math.max(4, r * 0.1), WHITE);
};
const coin = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.yellow, 5); shape(c, () => ell(c, x, y, r * 0.62, r * 0.62), COL.orange, 3); };
const pencil = (c: Ctx, x: number, y: number, len: number, flip = false) => {
  c.save(); c.translate(x, y); if (flip) c.scale(-1, 1);
  const h = 17;
  shape(c, () => rrect(c, 0, -h, 26, h * 2, 6), COL.pink, 5);
  shape(c, () => rrect(c, 26, -h, 14, h * 2, 2), COL.steel, 4);
  shape(c, () => rrect(c, 40, -h, len - 40 - 52, h * 2, 2), COL.yellow, 5);
  line(c, [[48, -h * 0.2], [len - 60, -h * 0.2]], 3, COL.orange);
  shape(c, () => polyP(c, [[len - 52, -h], [len, 0], [len - 52, h]]), COL.wood, 5);
  shape(c, () => polyP(c, [[len - 14, -4], [len, 0], [len - 14, 4]]), INK, 2);
  c.restore();
};
const packet = (c: Ctx, x: number, top: number, w: number, h: number, col: string = COL.teal, dk: string = COL.tealDk, text = "") => {
  const b = () => { c.moveTo(x - w / 2, top + 14); c.quadraticCurveTo(x, top - 4, x + w / 2, top + 14); c.lineTo(x + w / 2 - 4, top + h - 14); c.quadraticCurveTo(x, top + h + 6, x - w / 2 + 4, top + h - 14); c.closePath(); };
  shape(c, b, col); shade(c, b, dk, w * 0.12, 0);
  for (let i = 0; i < 6; i++) { line(c, [[x - w / 2 + 6 + i * (w - 12) / 5, top + 6], [x - w / 2 + 6 + i * (w - 12) / 5, top + 18]], 3, INK); }
  if (text) { shape(c, () => rrect(c, x - w * 0.34, top + h * 0.35, w * 0.68, h * 0.34, 8), PAPER, 4); write(c, text, x - w * 0.26, top + h * 0.4, h * 0.2, INK, 5); }
};
const bottle = (c: Ctx, x: number, yb: number, w: number, h: number, lvl = 0.85, label = "") => {
  const body = () => { c.moveTo(x - w * 0.18, yb - h * 0.72); c.lineTo(x - w * 0.18, yb - h * 0.9); c.lineTo(x + w * 0.18, yb - h * 0.9); c.lineTo(x + w * 0.18, yb - h * 0.72); c.quadraticCurveTo(x + w / 2, yb - h * 0.68, x + w / 2, yb - h * 0.55); c.lineTo(x + w / 2, yb - 14); c.quadraticCurveTo(x + w / 2, yb, x + w / 2 - 14, yb); c.lineTo(x - w / 2 + 14, yb); c.quadraticCurveTo(x - w / 2, yb, x - w / 2, yb - 14); c.lineTo(x - w / 2, yb - h * 0.55); c.quadraticCurveTo(x - w / 2, yb - h * 0.68, x - w * 0.18, yb - h * 0.72); c.closePath(); };
  shape(c, body, COL.glass, 0);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(x - w, yb - h * 0.72 * lvl - h * 0.1, w * 2, h); c.restore();
  shade(c, body, COL.waterDk, w * 0.14, 0, 0.35);
  c.beginPath(); body(); c.lineWidth = 6; c.strokeStyle = INK; c.lineJoin = "round"; c.stroke();
  shape(c, () => rrect(c, x - w * 0.22, yb - h, w * 0.44, h * 0.1, 6), COL.blue, 5);
  shine(c, [[x - w * 0.34, yb - h * 0.5], [x - w * 0.34, yb - h * 0.15]], 7);
  if (label) { shape(c, () => rrect(c, x - w * 0.5, yb - h * 0.42, w, h * 0.22, 6), PAPER, 4); write(c, label, x - w * 0.22, yb - h * 0.4, h * 0.14, INK, 5); }
};
const spring = (c: Ctx, x: number, y1: number, y2: number, n: number, rx: number, col: string = COL.steelDk) => {
  const st = (y2 - y1) / n;
  for (let i = 0; i < n; i++) { const yy = y1 + (i + 0.5) * st; c.beginPath(); ell(c, x, yy, rx, Math.max(6, st * 0.4), 0); c.lineWidth = 13; c.strokeStyle = INK; c.stroke(); }
  for (let i = 0; i < n; i++) { const yy = y1 + (i + 0.5) * st; c.beginPath(); ell(c, x, yy, rx, Math.max(6, st * 0.4), 0); c.lineWidth = 6; c.strokeStyle = col; c.stroke(); }
};
// a forcemeter hanging from its ring at (x, y). h = body height, p = pointer 0..1 down the scale,
// labels = the numbers down the scale (empty string = a mark with no number). Returns where the hook ends.
const fm = (c: Ctx, x: number, y: number, h: number, p: number, labels: string[] = ["0", "1", "2", "3", "4", "5"]) => {
  const by = y + 44, bx = x - 64, bw = 144, hx = x - 22;
  c.beginPath(); c.arc(x, y + 22, 20, 0, Math.PI * 2); c.lineWidth = 15; c.strokeStyle = INK; c.stroke(); c.lineWidth = 7; c.strokeStyle = COL.steelDk; c.stroke();
  const body = () => rrect(c, bx, by, bw, h, 22);
  shadow(c, x + 20, by + h + 10, 70, 10);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, 18, 0, 0.5);
  shape(c, () => rrect(c, x - 52, by + 14, 60, h - 28, 10), "#f4f8fb", 4);
  const y0 = by + 34, y1 = by + h - 34, py = y0 + p * (y1 - y0);
  spring(c, hx, by + 20, py, Math.max(3, Math.round((py - by) / 22)), 18);
  const n = labels.length;
  for (let i = 0; i < n; i++) {
    const ty = y0 + i * (y1 - y0) / (n - 1);
    line(c, [[x + 14, ty], [x + 30, ty]], 5);
    if (i < n - 1) for (let k = 1; k < 5; k++) { const my = ty + k * (y1 - y0) / (n - 1) / 5; line(c, [[x + 14, my], [x + 21, my]], 3); }
    if (labels[i]) write(c, labels[i], x + 36, ty - 11, 22, INK, 4);
  }
  line(c, [[hx, py], [hx, by + h + 38]], 14, INK); line(c, [[hx, py], [hx, by + h + 38]], 7, COL.steelDk);
  shape(c, () => rrect(c, x - 52, py - 7, 60, 14, 4), RED, 4);
  c.beginPath(); c.moveTo(hx, by + h + 38); c.lineTo(hx, by + h + 62); c.arc(hx + 16, by + h + 62, 16, Math.PI, Math.PI * 0.35, true); c.lineWidth = 14; c.strokeStyle = INK; c.stroke(); c.lineWidth = 7; c.strokeStyle = COL.steelDk; c.stroke();
  return { x: hx + 16, y: by + h + 80 };
};
// a flat open palm held out, seen from the side: cuff at (x, y), palm L long; things rest on top of it
const palm = (c: Ctx, x: number, y: number, L: number, skin: string = SKIN.child, sleeve: string = CLOTH.child, dk: string = SKIN.childDk) => {
  shape(c, () => rrect(c, x, y - 44, 76, 88, 14), sleeve, 6);
  const p = () => rrect(c, x + 64, y - 30, L, 60, 28);
  shape(c, p, skin); shade(c, p, dk, 0, 10, 0.6);
  for (let k = 0; k < 3; k++) line(c, [[x + 64 + L - 70 + k * 22, y - 14], [x + 64 + L - 70 + k * 22, y + 14]], 3, dk);
};
// a forcemeter lying sideways: ring at (x, y), hook pointing right
const fmH = (c: Ctx, x: number, y: number, p: number) => {
  c.beginPath(); c.arc(x + 20, y, 20, 0, Math.PI * 2); c.lineWidth = 15; c.strokeStyle = INK; c.stroke(); c.lineWidth = 7; c.strokeStyle = COL.steelDk; c.stroke();
  shape(c, () => rrect(c, x + 42, y - 50, 170, 100, 18), COL.steel); shape(c, () => rrect(c, x + 56, y - 36, 142, 46, 8), "#f4f8fb", 4);
  const px = x + 72 + p * 110;
  for (let i = 0; i < 6; i++) line(c, [[x + 72 + i * 22, y + 20], [x + 72 + i * 22, y + 38]], 4);
  for (let i = 0; px - 14 - i * 12 > x + 66; i++) { c.beginPath(); ell(c, px - 14 - i * 12, y - 13, 7, 17); c.lineWidth = 8; c.strokeStyle = INK; c.stroke(); c.lineWidth = 4; c.strokeStyle = COL.steelDk; c.stroke(); }
  line(c, [[px, y - 13], [x + 296, y - 13]], 14, INK); line(c, [[px, y - 13], [x + 296, y - 13]], 7, COL.steelDk);
  shape(c, () => rrect(c, px - 6, y - 40, 12, 56, 4), RED, 4);
  c.beginPath(); c.moveTo(x + 296, y - 13); c.lineTo(x + 318, y - 13); c.arc(x + 318, y + 9, 22, -Math.PI / 2, Math.PI * 0.95); c.lineWidth = 14; c.strokeStyle = INK; c.stroke(); c.lineWidth = 7; c.strokeStyle = COL.steelDk; c.stroke();
};
const hang = (c: Ctx, hk: { x: number; y: number }, y: number) => line(c, [[hk.x, hk.y], [hk.x, y]], 5);

const table = (c: Ctx, x1: number, x2: number, y: number, legs = true) => {
  if (legs) { shape(c, () => rrect(c, x1 + 60, y + 60, 46, 340, 6), COL.woodDk); shape(c, () => rrect(c, x2 - 160, y + 60, 46, 340, 6), COL.woodDk); }
  shape(c, () => rrect(c, x1, y, x2 - x1, 64, 10), COL.wood); line(c, [[x1 + 12, y + 46], [x2 - 12, y + 46]], 4, COL.woodDk);
};
const digiScale = (c: Ctx, cx: number, y: number, w: number, text: string) => {
  shadow(c, cx + 20, y + 225, w * 0.55, 22);
  shape(c, () => polyP(c, [[cx - w * 0.36, y], [cx + w * 0.36, y], [cx + w * 0.5, y + 130], [cx - w * 0.5, y + 130]]), COL.teal);
  shape(c, () => polyP(c, [[cx - w * 0.5, y + 130], [cx + w * 0.5, y + 130], [cx + w * 0.5, y + 210], [cx - w * 0.5, y + 210]]), COL.tealDk);
  shape(c, () => rrect(c, cx - 115, y + 146, 230, 50, 8), "#22303a", 5); write(c, text, cx - 100, y + 156, 30, "#c9f06b", 6);
};

// notebook pulled by a cup over a table edge (coins or water); the unit-of-pull test
const pullScene = (c: Ctx, water: boolean) => {
  ground(c); c.translate(0, 40); shadow(c, 520, 1010, 460, 22);
  table(c, 40, 770, 600);
  shape(c, () => rrect(c, 200, 538, 260, 62, 6), COL.blue); shape(c, () => rrect(c, 214, 572, 236, 20, 4), PAPER, 3);
  line(c, [[460, 566], [750, 566], [774, 592], [774, 700]], 5);
  line(c, [[700, 790], [774, 700], [848, 790]], 4);
  if (!water) for (const [cx, cy] of [[742, 770], [806, 770], [774, 742], [774, 794]]) coin(c, cx, cy, 30);
  const cup = () => polyP(c, [[694, 790], [854, 790], [836, 940], [712, 940]]);
  shape(c, cup, PAPER); shade(c, cup, COL.cloth, 40, 0, 0.9);
  if (water) { shape(c, () => ell(c, 774, 800, 80, 14), COL.water, 5); }
  else shape(c, () => ell(c, 774, 790, 80, 14), COL.cloth, 5);
  arrow(c, [[250, 480], [430, 480]]);
  if (water) {
    glass(c, 930, 1000, 130, 250, 0.6);
    for (let i = 1; i < 5; i++) line(c, [[895, 1000 - 50 * i], [925, 1000 - 50 * i]], 4);
    arrow(c, [[940, 720], [930, 640], [815, 640], [815, 750]]);
  }
};

// ============================================================ flows
const e4 = (c: Ctx) => pullScene(c, false);
const a7 = (c: Ctx) => pullScene(c, true);

const e2 = (c: Ctx) => {
  ground(c); shadow(c, 450, 880, 260, 22);
  shape(c, () => rrect(c, 230, 800, 440, 64, 20), COL.steel); shade(c, () => rrect(c, 230, 800, 440, 64, 20), COL.steelDk, 30, 0, 0.5);
  shape(c, () => rrect(c, 250, 864, 60, 16, 5), INK, 0); shape(c, () => rrect(c, 590, 864, 60, 16, 5), INK, 0);
  person(c, 450, 800, 560);
  arrow(c, [[150, 560], [150, 760]]);
  const dx = 850, dy = 470;
  dash(c, 560, 830, dx - 90, dy + 130); dash(c, 640, 830, dx + 20, dy + 160);
  shape(c, () => ell(c, dx, dy, 150, 150), WHITE, 8); shape(c, () => ell(c, dx, dy, 128, 128), "#f4f8fb", 3);
  for (let i = 0; i <= 10; i++) { const a = Math.PI * (0.8 + 1.4 * i / 10); line(c, [[dx + Math.cos(a) * 100, dy + Math.sin(a) * 100], [dx + Math.cos(a) * 124, dy + Math.sin(a) * 124]], i % 5 ? 4 : 7); }
  const a = Math.PI * 1.55; line(c, [[dx, dy], [dx + Math.cos(a) * 110, dy + Math.sin(a) * 110]], 10, RED); shape(c, () => ell(c, dx, dy, 14, 14), INK, 0);
};

const e3 = (c: Ctx) => {
  ground(c); c.translate(0, 130);
  const h1 = fm(c, 300, 40, 240, 0.45), h2 = fm(c, 780, 40, 240, 0.45);
  hang(c, h1, 440); hang(c, h2, 440);
  shadow(c, h1.x + 15, 700, 140, 18); shadow(c, h2.x + 10, 590, 80, 14);
  shape(c, () => rrect(c, h1.x - 125, 440, 250, 250, 8), COL.brown); shade(c, () => rrect(c, h1.x - 125, 440, 250, 250, 8), COL.soilDk, 40, 0, 0.35);
  shape(c, () => rrect(c, h1.x - 18, 440, 36, 250, 0), COL.wood, 3);
  shape(c, () => rrect(c, h2.x - 65, 440, 130, 130, 8), COL.steelDk); shade(c, () => rrect(c, h2.x - 65, 440, 130, 130, 8), COL.black, 28, 0, 0.35);
  shape(c, () => rrect(c, h2.x - 18, 440, 36, 130, 0), COL.steel, 3);
  line(c, [[480, 270], [600, 270]], 12); line(c, [[480, 320], [600, 320]], 12);
};

const a1 = (c: Ctx) => {
  ground(c); shadow(c, 520, 880, 440, 22);
  shape(c, () => rrect(c, 770, 260, 200, 620, 8), COL.brown); for (let y = 330; y < 880; y += 70) line(c, [[770, y], [970, y]], 4, COL.soilDk);
  const b = () => { c.moveTo(560, 360); c.bezierCurveTo(430, 340, 360, 470, 400, 580); c.bezierCurveTo(430, 700, 520, 770, 560, 760); c.lineTo(770, 740); c.lineTo(770, 380); c.closePath(); };
  shape(c, b, COL.pink); shade(c, b, "#d9708e", 60, 10);
  line(c, [[450, 440], [480, 400]], 12, WHITE);
  shape(c, () => polyP(c, [[400, 575], [365, 560], [365, 590]]), "#d9708e", 4);
  hand(c, 230, 570, 0, 1.5);
  arrow(c, [[180, 420], [330, 420]]);
};

const a2 = (c: Ctx) => {
  ground(c);
  shadow(c, 230, 880, 190, 14); palm(c, 10, 860, 280); apple(c, 220, 786, 66);
  shadow(c, 760, 880, 190, 14); palm(c, 500, 860, 340, SKIN.adult, CLOTH.adult, SKIN.adultDk); bottle(c, 740, 842, 130, 300, 0.85);
  lab(c, "1", 150, 280, 130); lab(c, "10", 600, 280, 130);
};

const a3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 560, 90, 150, 800, 10), PAPER);
  for (let i = 0; i <= 5; i++) { const ty = 160 + i * 140; line(c, [[560, ty], [620, ty]], 6); write(c, String(i), 640, ty - 22, 44, INK, 6); for (let k = 1; k < 5; k++) if (i < 5) line(c, [[560, ty + k * 28], [588, ty + k * 28]], 3); }
  const py = 160 + 3 * 140 + 28;
  shape(c, () => rrect(c, 536, py - 22, 206, 44, 6), "rgba(243,154,60,0.25)", 6); line(c, [[536, py], [742, py]], 5, RED);
  const ey = py;
  shape(c, () => { c.moveTo(70, ey); c.quadraticCurveTo(160, ey - 90, 250, ey); c.quadraticCurveTo(160, ey + 90, 70, ey); c.closePath(); }, WHITE, 6);
  shape(c, () => ell(c, 165, ey, 38, 38), COL.brown, 4); shape(c, () => ell(c, 165, ey, 16, 16), INK, 0);
  dash(c, 262, ey, 530, ey, RED, 7);
};

const a4 = (c: Ctx) => {
  ground(c);
  person(c, 90, 990, 420, { armR: [0, 0] });
  person(c, 990, 990, 420, { adult: true, armL: [Math.PI, Math.PI] });
  const wy = 692;
  fmH(c, 275, wy, 0.5);
  c.save(); c.translate(1080, 2 * wy); c.scale(-1, -1); fmH(c, 275, wy, 0.5); c.restore();
  arrow(c, [[500, 520], [370, 520]]); arrow(c, [[580, 520], [710, 520]]);
};

const seal = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6); shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), WHITE, 4);
  tick(c, x, y, r * 0.5);
};
const a6 = (c: Ctx) => {
  ground(c);
  digiScale(c, 330, 520, 560, "250 g");
  for (const [tx, ty] of [[250, 520], [320, 492], [395, 520]]) { shape(c, () => ell(c, tx, ty + 8, 42, 36), APPLE, 5); line(c, [[tx, ty - 22], [tx + 4, ty - 36]], 5, COL.leafDk); }
  seal(c, 520, 745, 34);
  const zx = 800, zy = 330;
  dash(c, 540, 722, zx - 120, zy + 120, INK, 4);
  shape(c, () => ell(c, zx, zy, 190, 190), "rgba(214,236,250,0.55)", 8);
  seal(c, zx, zy, 120);
  line(c, [[zx + 135, zy + 135], [zx + 230, zy + 235]], 26, INK); line(c, [[zx + 135, zy + 135], [zx + 230, zy + 235]], 14, COL.brown);
};

const c1 = (c: Ctx) => {
  ground(c);
  const hk = fm(c, 360, 40, 360, 0.0);
  hang(c, hk, 560);
  shadow(c, hk.x + 10, 880, 120, 14);
  const sh = () => polyP(c, [[hk.x - 105, 560], [hk.x + 105, 560], [hk.x + 105, 810], [hk.x + 70, 840], [hk.x - 105, 840]]);
  shape(c, sh, WHITE, 6); shade(c, sh, COL.cloth, 40, 0, 0.8);
  shape(c, () => polyP(c, [[hk.x + 105, 810], [hk.x + 70, 840], [hk.x + 70, 810]]), COL.steel, 4);
  arrow(c, [[hk.x + 160, 640], [hk.x + 160, 700]], RED, 8);
  qmark(c, 760, 230, 400);
};

const c2 = (c: Ctx) => {
  ground(c);
  digiScale(c, 540, 600, 700, "1000 g");
  bottle(c, 540, 705, 220, 520, 0.9);
  tick(c, 880, 330, 70);
};

// ============================================================ terms
const rect2 = (c: Ctx, x: number, y: number, w: number, h: number) => rrect(c, x, y, w, h, 0);
const t0 = (c: Ctx) => {
  ground(c); dash(c, 60, 540, 1020, 540, COL.grey, 5);
  shadow(c, 700, 520, 300, 14);
  shape(c, () => rrect(c, 560, 120, 420, 390, 10), COL.brown); shade(c, () => rrect(c, 560, 120, 420, 390, 10), COL.soilDk, 40, 0, 0.3);
  line(c, [[560, 250], [980, 250]], 4, COL.soilDk); line(c, [[560, 400], [980, 400]], 4, COL.soilDk);
  shape(c, () => rrect(c, 330, 270, 240, 120, 8), COL.wood); shape(c, () => ell(c, 316, 330, 16, 16), COL.steel, 5);
  hand(c, 180, 330, 0, 1.5); arrow(c, [[520, 190], [260, 190]]);
  shadow(c, 800, 1010, 280, 14);
  shape(c, () => rect2(c, 780, 560, 300, 440), COL.grey); shape(c, () => rrect(c, 700, 580, 70, 420, 6), COL.wood); shape(c, () => ell(c, 720, 800, 12, 12), COL.steel, 4);
  hand(c, 540, 780, 0, 1.5); arrow(c, [[420, 640], [650, 640]]);
};
const t1 = (c: Ctx) => {
  ground(c); dash(c, 540, 200, 540, 900, COL.grey, 5);
  shadow(c, 270, 700, 170, 14); pencil(c, 90, 640, 360);
  arrow(c, [[270, 570], [270, 440]], RED, 8);
  shadow(c, 790, 820, 140, 16);
  shape(c, () => polyP(c, [[690, 620], [890, 620], [860, 800], [720, 800]]), COL.blue); shade(c, () => polyP(c, [[690, 620], [890, 620], [860, 800], [720, 800]]), COL.blueDk, 40, 0, 0.5);
  shape(c, () => ell(c, 790, 620, 100, 20), COL.water, 5);
  c.beginPath(); c.arc(790, 620, 100, Math.PI, Math.PI * 2); c.lineWidth = 10; c.strokeStyle = INK; c.stroke();
  arrow(c, [[790, 480], [790, 140]], RED, 22);
};
const ruler = (c: Ctx, x0: number, y: number, cm: number, per: number, digitsEvery = 5) => {
  shape(c, () => rrect(c, x0 - 30, y, cm * per + 70, 120, 10), COL.wood);
  for (let i = 0; i <= cm; i++) { line(c, [[x0 + i * per, y], [x0 + i * per, y + (i % 5 ? 36 : 56)]], 4); if (digitsEvery && i % digitsEvery === 0) write(c, String(i), x0 + i * per - (i > 9 ? 16 : 8), y + 66, 36, INK, 5); }
};
const t2 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 560, 440, 14); pencil(c, 120, 470, 840);
  ruler(c, 120, 620, 15, 56);
  dash(c, 120, 490, 120, 650, RED, 5); dash(c, 960, 490, 960, 650, RED, 5);
};
const t3 = (c: Ctx) => {
  ground(c);
  for (const x of [40, 380, 720]) shape(c, () => rrect(c, x, 280, 320, 520, 20), PAPER, 6);
  ruler(c, 80, 460, 5, 50, 0); write(c, "5 cm", 130, 660, 70, INK, 8);
  for (let i = 0; i < 5; i++) coin(c, 440 + i * 50, 520, 24); write(c, "5", 520, 660, 70, INK, 8);
  for (let i = 0; i < 5; i++) apple(c, 770 + i * 50 + 0, 520, 24); lab(c, "5", 800, 660, 70);
};
const t4 = (c: Ctx) => {
  ground(c); const x = 540, yb = 900;
  shadow(c, x + 20, yb + 14, 330, 24);
  shape(c, () => rrect(c, x - 300, yb - 28, 600, 40, 12), COL.wood);
  shape(c, () => rrect(c, x - 70, yb - 190, 140, 162, 14), COL.steel); shade(c, () => rrect(c, x - 70, yb - 190, 140, 162, 14), COL.steelDk, 30, 0, 0.6);
  shape(c, () => ell(c, x, yb - 190, 70, 18), COL.steelIn, 5); shine(c, [[x - 44, yb - 160], [x - 44, yb - 60]], 8);
  for (const [r, h] of [[120, 290], [175, 400], [230, 520]]) {
    c.beginPath(); c.moveTo(x - r, yb - 28); c.lineTo(x - r, yb - 28 - h + r); c.arc(x, yb - 28 - h + r, r, Math.PI, 0); c.lineTo(x + r, yb - 28);
    c.fillStyle = COL.glass; c.fill(); c.lineWidth = 6; c.strokeStyle = COL.glassEdge; c.stroke();
    shine(c, [[x - r + 26, yb - 28 - h + r + 40], [x - r + 26, yb - 90]], 7);
  }
};
const t5 = (c: Ctx) => {
  ground(c); shadow(c, 340, 860, 330, 16);
  palm(c, 30, 840, 520); apple(c, 340, 724, 92);
  lab(c, "1", 640, 380, 190);
};
const t6 = (c: Ctx) => {
  ground(c);
  const hk = fm(c, 500, 50, 400, 0.2); hang(c, hk, 700); apple(c, hk.x, 775, 78);
};
const t7 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 80, 100, 920, 40, 10), COL.steel);
  spring(c, 290, 140, 330, 9, 40); line(c, [[290, 330], [290, 360]], 8); shape(c, () => ell(c, 290, 380, 20, 20), COL.steel, 6);
  spring(c, 790, 140, 640, 9, 40); line(c, [[790, 640], [790, 670]], 8); shape(c, () => ell(c, 790, 690, 20, 20), COL.steel, 6);
  hand(c, 790, 790, -Math.PI / 2, 1.3);
  arrow(c, [[930, 700], [930, 880]]);
};
const strip = (c: Ctx, y: number, ptr = false) => {
  shape(c, () => rrect(c, 60, y, 960, 260, 22), COL.steelIn, 6);
  for (let i = 0; i <= 5; i++) {
    const x = 160 + i * 160; line(c, [[x, y + 30], [x, y + 130]], 8); write(c, String(i), x - 14, y + 150, 70, INK, 9);
    if (i < 5) for (let k = 1; k < 5; k++) line(c, [[x + k * 32, y + 30], [x + k * 32, y + 80]], 4);
  }
  if (ptr) { const x = 160 + 3 * 160; shape(c, () => polyP(c, [[x, y + 10], [x - 28, y - 50], [x + 28, y - 50]]), RED, 5); line(c, [[x, y - 30], [x, y + 140]], 8, RED); }
};
const t8 = (c: Ctx) => { ground(c); strip(c, 380); };
const t9 = (c: Ctx) => {
  ground(c);
  fm(c, 220, 60, 440, 0.6);
  dash(c, 330, 330, 520, 250, INK, 4); dash(c, 330, 500, 520, 750, INK, 4);
  shape(c, () => ell(c, 760, 500, 270, 270), "rgba(214,236,250,0.55)", 8);
  c.save(); c.beginPath(); ell(c, 760, 500, 262, 262); c.clip();
  shape(c, () => rrect(c, 500, 400, 520, 100, 0), "#f4f8fb", 0);
  for (let i = 0; i < 4; i++) { const x = 600 + i * 150; line(c, [[x, 420], [x, 500]], 8); write(c, String(i + 2), x - 14, 520, 60, INK, 8); }
  line(c, [[740, 400], [740, 740]], 0);
  shape(c, () => polyP(c, [[750, 505], [715, 400], [785, 400]]), RED, 5); line(c, [[750, 380], [750, 480]], 12, RED);
  c.restore();
};
const t10 = (c: Ctx) => {
  ground(c);
  const hk = fm(c, 600, 60, 640, 0.6); void hk;
  const ey = 60 + 44 + 34 + 0.6 * (640 - 68);
  shape(c, () => { c.moveTo(60, ey); c.quadraticCurveTo(150, ey - 90, 240, ey); c.quadraticCurveTo(150, ey + 90, 60, ey); c.closePath(); }, WHITE, 6);
  shape(c, () => ell(c, 155, ey, 38, 38), COL.brown, 4); shape(c, () => ell(c, 155, ey, 16, 16), INK, 0);
  dash(c, 252, ey, 536, ey, RED, 6);
  lab(c, "3", 810, ey - 70, 140);
};
const t11 = (c: Ctx) => {
  ground(c);
  fm(c, 480, 70, 560, 0);
  c.beginPath(); ell(c, 470, 184, 100, 28); c.lineWidth = 8; c.strokeStyle = RED; c.stroke();
  tick(c, 860, 300, 90);
};
const t12 = (c: Ctx) => {
  ground(c);
  fm(c, 290, 120, 280, 0.5, ["0", "5", "10"]); fm(c, 760, 120, 520, 0.5, ["0", "50", "100"]);
};
const t13 = (c: Ctx) => {
  ground(c); c.translate(540, 540); c.scale(1.1, 1.1); c.translate(-626, -380);
  shape(c, () => rrect(c, 380, 60, 160, 640, 8), PAPER);
  shape(c, () => ell(c, 460, 70, 14, 14), INK, 0);
  c.beginPath(); ell(c, 460, 210, 18, 130); c.lineWidth = 14; c.strokeStyle = INK; c.stroke(); c.lineWidth = 8; c.strokeStyle = COL.orange; c.stroke();
  shape(c, () => rrect(c, 440, 330, 40, 60, 16), COL.steel, 5);
  line(c, [[460, 390], [460, 440]], 5);
  packet(c, 460, 440, 130, 180, COL.teal, COL.tealDk, "100");
  line(c, [[380, 340], [540, 340]], 6, RED); write(c, "1", 322, 316, 48, INK, 7);
  pencil(c, 780, 340, 230, true);
  hand(c, 900, 340, Math.PI, 1.2);
};
const t14 = (c: Ctx) => {
  ground(c);
  person(c, 270, 1000, 700);
  c.beginPath(); ell(c, 650, 200, 270, 120); c.fillStyle = WHITE; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  for (const [x, y, r] of [[470, 310, 20], [420, 360, 12]]) shape(c, () => ell(c, x, y, r, r), WHITE, 5);
  lab(c, "5", 500, 135, 130); qmark(c, 790, 125, 150);
  table(c, 580, 1060, 800, false);
  shadow(c, 830, 800, 100, 12); bottle(c, 830, 800, 150, 340, 0.85);
};
const t15 = (c: Ctx) => {
  ground(c);
  const hk = fm(c, 440, 30, 250, 0.9, ["0", "5", "10"]); hang(c, hk, 380);
  packet(c, hk.x, 380, 190, 230);
  shape(c, () => ell(c, hk.x, 920, 130, 130), COL.blue, 6);
  shape(c, () => polyP(c, [[hk.x - 70, 870], [hk.x - 20, 840], [hk.x + 10, 890], [hk.x - 30, 940]]), COL.green, 4);
  shape(c, () => polyP(c, [[hk.x + 40, 930], [hk.x + 90, 910], [hk.x + 80, 970]]), COL.green, 4);
  arrow(c, [[hk.x, 640], [hk.x, 770]]);
};
const t16 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 270, 860, 170, 170), COL.blue, 6); shape(c, () => polyP(c, [[200, 790], [260, 760], [300, 810], [250, 860]]), COL.green, 4); shape(c, () => polyP(c, [[290, 880], [350, 860], [340, 930]]), COL.green, 4);
  shape(c, () => ell(c, 810, 860, 170, 170), COL.steel, 6); for (const [x, y, r] of [[760, 800, 30], [860, 860, 36], [780, 920, 22], [870, 790, 18]]) shape(c, () => ell(c, x, y, r, r), COL.steelDk, 4);
  packet(c, 270, 505, 150, 200); packet(c, 810, 505, 150, 200);
  write(c, "1000 g", 120, 340, 70, INK, 8); write(c, "1000 g", 660, 340, 70, INK, 8);
  line(c, [[500, 420], [580, 420]], 12); line(c, [[500, 470], [580, 470]], 12);
};
const t17 = (c: Ctx) => {
  ground(c); shadow(c, 560, 880, 420, 20);
  const pl = () => polyP(c, [[220, 400], [860, 400], [960, 860], [120, 860]]);
  shape(c, pl, COL.steel); shade(c, pl, COL.steelDk, 40, 0, 0.4);
  for (const x of [430, 650]) {
    shape(c, () => ell(c, x, 590, 62, 120), "#dfe5ec", 5);
    for (let k = 0; k < 4; k++) shape(c, () => ell(c, x - 36 + k * 24, 450 - Math.abs(k - 1.5) * 8, 10, 10), "#dfe5ec", 4);
  }
  shape(c, () => rrect(c, 400, 770, 280, 70, 12), "#22303a", 5); write(c, "62", 500, 782, 46, "#c9f06b", 8);
  arrow(c, [[540, 130], [540, 340]]);
};
const t18 = (c: Ctx) => {
  ground(c); shadow(c, 540, 930, 440, 20);
  shape(c, () => rrect(c, 120, 850, 840, 60, 12), COL.teal);
  shape(c, () => rrect(c, 220, 770, 70, 90, 4), COL.steelDk, 4);
  const blk = () => polyP(c, [[220, 650], [860, 690], [860, 790], [220, 770]]);
  shape(c, blk, COL.steel); shade(c, blk, COL.steelDk, 0, 22, 0.5);
  for (const x of [400, 640]) shape(c, () => ell(c, x, 725, 42, 38), BG_HOLE, 5);
  shape(c, () => polyP(c, [[370, 712], [670, 728], [670, 738], [370, 722]]), BG_HOLE, 3);
  shape(c, () => rrect(c, 330, 662, 80, 28, 4), COL.orange, 4);
  shape(c, () => rrect(c, 780, 580, 50, 120, 4), COL.steelDk, 4);
  shape(c, () => rrect(c, 160, 480, 740, 40, 10), COL.steelIn); shape(c, () => rrect(c, 790, 520, 20, 70, 0), COL.steelDk, 4);
  for (const x of [330, 470, 610]) { shape(c, () => ell(c, x, 440, 52, 44), APPLE, 5); shape(c, () => polyP(c, [[x - 18, 400], [x, 388], [x + 18, 400], [x, 410]]), COL.leaf, 3); }
  arrow(c, [[500, 220], [500, 370]]);
  shape(c, () => rrect(c, 560, 862, 220, 36, 6), "#22303a", 4); write(c, "250", 620, 866, 26, "#c9f06b", 5);
};
const BG_HOLE = "#efe4cf";

export const ic_forcesMeasuringForcesL3 = cards("sci.forces.measuring-forces.L3 cards", [
  e4, e2, e3, a1, a2, a3, a4, a6, a7, c1, c2,
  t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15, t16, t17, t18,
]);
