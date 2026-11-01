import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, plate, bowl, hand, person, write, cards, rnd } from "./flatKit";

// sci.mind.thinking-and-memory.L3 set-up cards: Story Trick (e1), Other Hand (e2), Letters or Words (e3)

// ---------------------------------------------------------------- shared pieces
const MAT = "#e9b44c", MATDK = "#c98f2a", PINKL = "#f9d6e0";

// a phone lying or standing with a stopwatch dial; sweep = how far the red hand has gone (radians)
const phone = (c: Ctx, x: number, y: number, w: number, h: number, sweep: number) => {
  shadow(c, x + w * 0.1, y + h * 0.52, w * 0.62, h * 0.07);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, w * 0.14), "#3a3540", 6);
  shape(c, () => rrect(c, x - w / 2 + 11, y - h / 2 + 16, w - 22, h - 32, w * 0.09), COL.paper, 3);
  const r = w * 0.34, cy = y;
  shape(c, () => ell(c, x, cy, r, r), WHITE, 5);
  c.beginPath(); c.moveTo(x, cy); c.arc(x, cy, r - 3, -Math.PI / 2, sweep - Math.PI / 2); c.closePath(); c.fillStyle = PINKL; c.fill();
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.78, cy + Math.sin(a) * r * 0.78], [x + Math.cos(a) * r * 0.93, cy + Math.sin(a) * r * 0.93]], 4); }
  line(c, [[x, cy], [x + Math.cos(sweep - Math.PI / 2) * r * 0.8, cy + Math.sin(sweep - Math.PI / 2) * r * 0.8]], 7, RED);
  shape(c, () => ell(c, x, cy, 8, 8), INK, 0);
  shape(c, () => rrect(c, x - 14, cy - r - 28, 28, 16, 5), COL.steel, 4);
};

// an open notebook with lines of scribbled words; (x, y) is the centre
const notebook = (c: Ctx, x: number, y: number, w: number, h: number, seedN: number) => {
  shadow(c, x + w * 0.05, y + h / 2 + 6, w * 0.56, h * 0.07);
  shape(c, () => polyP(c, [[x - w / 2, y - h / 2], [x, y - h / 2 + 12], [x, y + h / 2 + 12], [x - w / 2, y + h / 2]]), COL.paper);
  shape(c, () => polyP(c, [[x, y - h / 2 + 12], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x, y + h / 2 + 12]]), WHITE);
  shade(c, () => polyP(c, [[x - w / 2, y - h / 2], [x, y - h / 2 + 12], [x, y + h / 2 + 12], [x - w / 2, y + h / 2]]), COL.cloth, 10, 0, 0.8);
  line(c, [[x, y - h / 2 + 12], [x, y + h / 2 + 12]], 6);
  const r = rnd(seedN);
  for (let p = 0; p < 2; p++) for (let i = 0; i < 6; i++) {
    let sx = x + (p ? 22 : -w / 2 + 22); const sy = y - h / 2 + 52 + i * (h - 80) / 5 + (p ? 5 : 2) * 0;
    for (let k = 0; k < 3; k++) { const L = 22 + r() * 28; line(c, [[sx, sy + (p ? 3 : 0)], [sx + L, sy + (p ? 3 : 0)]], 7, k === 1 ? COL.blueDk : INK); sx += L + 12; if (sx > x + (p ? w / 2 - 20 : -20)) break; }
  }
};

// a sheet of paper from above with two rows of five empty boxes; filled = numbers already written in the first boxes
const SHEET = { x: 110, y: 160, w: 700, h: 560, bx: 148, by: 270, step: 128, size: 100, row: 170 };
const sheet = (c: Ctx, filled: number, x = SHEET.x, y = SHEET.y) => {
  const dx = x - SHEET.x, dy = y - SHEET.y;
  shadow(c, SHEET.x + dx + SHEET.w / 2 + 14, SHEET.y + dy + SHEET.h + 14, SHEET.w / 2, 18);
  shape(c, () => rrect(c, SHEET.x + dx, SHEET.y + dy, SHEET.w, SHEET.h, 10), COL.paper);
  for (let i = 0; i < 10; i++) {
    const bx = SHEET.bx + dx + (i % 5) * SHEET.step, by = SHEET.by + dy + Math.floor(i / 5) * SHEET.row;
    shape(c, () => rrect(c, bx, by, SHEET.size, SHEET.size, 12), WHITE, 6);
    if (i < filled) write(c, String(i + 1), bx + (i === 9 ? 18 : 32), by + 20, 60, COL.blueDk, 8);
  }
};

// a hand writing with a pencil, its tip at (tx, ty); the arm comes in from the lower right (left = from the lower left)
const penHand = (c: Ctx, tx: number, ty: number, left = false) => {
  c.save();
  if (left) { c.translate(D, 0); c.scale(-1, 1); tx = D - tx; }
  const an = -2.1, dx = Math.cos(an), dy = Math.sin(an), wx = tx - 190 * dx, wy = ty - 190 * dy;
  const bx = 0.82, by = 0.57, ex = wx + (wx - tx) * 0 + bx * 300, ey = wy + by * 300;
  line(c, [[wx - 70 * dx, wy - 70 * dy], [wx + (-70 * dx + 0.25 * 0) , wy - 70 * dy], [ex + 700 * bx, ey + 700 * by]], 124, INK);
  line(c, [[wx - 70 * dx, wy - 70 * dy], [wx - 70 * dx, wy - 70 * dy], [ex + 700 * bx, ey + 700 * by]], 108, CLOTH.child);
  const P = (t: number): number[] => [tx - t * dx, ty - t * dy];
  line(c, [P(0), P(340)], 34, INK); line(c, [P(60), P(325)], 24, COL.yellow); line(c, [P(0), P(60)], 24, COL.wood); line(c, [P(0), P(16)], 24, INK); line(c, [P(300), P(325)], 24, COL.pink);
  hand(c, wx, wy, an, 1.5, SKIN.child, CLOTH.child);
  c.restore();
};

// a child's face, big: short dark hair, ears; closed or open eyes; optional tongue out in concentration
const face = (c: Ctx, x: number, y: number, r: number, closed: boolean, tongue: boolean) => {
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.97, y + r * 0.1, r * 0.17, r * 0.26), SKIN.child, 6);
  shape(c, () => ell(c, x, y, r, r * 1.05), SKIN.child, 7);
  shade(c, () => ell(c, x, y, r, r * 1.05), SKIN.childDk, r * 0.2, r * 0.1, 0.45);
  shape(c, () => { c.moveTo(x - r * 1.03, y - r * 0.02); c.bezierCurveTo(x - r * 1.15, y - r * 1.6, x + r * 1.15, y - r * 1.6, x + r * 1.03, y - r * 0.02); c.quadraticCurveTo(x + r * 0.55, y - r * 0.5, x, y - r * 0.45); c.quadraticCurveTo(x - r * 0.55, y - r * 0.5, x - r * 1.03, y - r * 0.02); c.closePath(); }, CLOTH.hair, 7);
  for (const s of [-1, 1]) {
    const ex = x + s * r * 0.4, ey = y + r * 0.12;
    if (closed) { c.beginPath(); c.arc(ex, ey - r * 0.04, r * 0.15, 0.1 * Math.PI, 0.9 * Math.PI); c.strokeStyle = INK; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); }
    else shape(c, () => ell(c, ex, ey + r * 0.08, r * 0.09, r * 0.12), INK, 0);
    if (tongue) line(c, [[ex - s * r * 0.2, ey - r * 0.24 - s * 0], [ex + s * r * 0.2, ey - r * 0.12 + 0]].map((p, i) => (s < 0 ? p : [p[0], i ? p[1] - r * 0.12 : p[1] + r * 0.12])), 7);
  }
  if (tongue) {
    line(c, [[x - r * 0.28, y + r * 0.52], [x + r * 0.2, y + r * 0.52]], 7);
    shape(c, () => rrect(c, x + r * 0.02, y + r * 0.5, r * 0.22, r * 0.28, r * 0.1), COL.pink, 5);
  } else { c.beginPath(); c.arc(x, y + r * 0.42, r * 0.26, 0.15 * Math.PI, 0.85 * Math.PI); c.strokeStyle = INK; c.lineWidth = 7; c.stroke(); }
};

// twelve tiles with different marks (stand-ins for letters; never words)
const SYM: number[][][] = [
  [[0, -1], [0.7, -0.7], [1, 0], [0.7, 0.7], [0, 1], [-0.7, 0.7], [-1, 0], [-0.7, -0.7], [0, -1]], [[0, -1], [0, 1]], [[-1, 0.8], [1, 0.8], [0, -0.9], [-1, 0.8]],
  [[0, -1], [0, 1]], [[-0.8, -0.8], [0.8, -0.8], [0.8, 0.8], [-0.8, 0.8], [-0.8, -0.8]], [[-1, 0.6], [-0.4, -0.6], [0.4, 0.6], [1, -0.6]],
  [[-0.9, 0.5], [-0.4, -0.7], [0.4, -0.7], [0.9, 0.5]], [[-0.6, 0], [-0.5, 0]], [[0, -1], [0.9, 0], [0, 1], [-0.9, 0], [0, -1]], [[-1, 0], [1, 0]],
  [[-0.8, -0.8], [0.8, 0.8]], [[0.8, -0.8], [-0.6, -0.5], [0.6, 0.5], [-0.8, 0.8]],
];
const SYM2: Record<number, number[][]> = { 3: [[-1, 0], [1, 0]], 7: [[0.5, 0], [0.6, 0]], 10: [[0.8, -0.8], [-0.8, 0.8]] };
const TCOL = [COL.teal, COL.orange, COL.purple, COL.blue, COL.red, COL.green, COL.pink, COL.blueDk, COL.tealDk, COL.orange, COL.purple, COL.red];
const ORDER = [7, 2, 10, 4, 0, 9, 5, 11, 1, 8, 3, 6];
const tile = (c: Ctx, x: number, y: number, s: number, k: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -s / 2, -s / 2, s, s, s * 0.16), WHITE, Math.max(3, s * 0.07));
  const u = s * 0.28, col = TCOL[k];
  line(c, SYM[k].map(([a, b]) => [a * u, b * u]), s * 0.11, col);
  if (SYM2[k]) line(c, SYM2[k].map(([a, b]) => [a * u, b * u]), s * 0.11, col);
  if (k === 7) { shape(c, () => ell(c, -u * 0.5, 0, u * 0.26, u * 0.26), col, 0); shape(c, () => ell(c, u * 0.5, 0, u * 0.26, u * 0.26), col, 0); }
  c.restore();
};

// ---------------------------------------------------------------- experiment 1: the story trick
// setup.e1.0: the grown-up's hand holds the notebook and reads words aloud; the child says them back; a phone times it
const e1_0 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6d6b8"; c.fillRect(0, 960, D, 120); line(c, [[0, 960], [D, 960]], 5);
  notebook(c, 260, 740, 400, 330, 3);
  hand(c, 260, 1005, -Math.PI / 2, 1.5, SKIN.adult, CLOTH.adult);
  for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(450, 630, 70 + i * 32, -0.5, 0.5); c.strokeStyle = COL.blueDk; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
  phone(c, 548, 860, 130, 190, 1.4);
  shape(c, () => rrect(c, 640, 800, 300, 300, 70), CLOTH.child);
  shape(c, () => rrect(c, 735, 680, 110, 160, 20), SKIN.child, 6);
  face(c, 790, 560, 165, false, false);
  shape(c, () => ell(c, 790, 640, 40, 30), INK, 0); shape(c, () => ell(c, 790, 656, 24, 12), COL.pink, 0);
  for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(790, 640, 200 + i * 30, -0.25, 0.4); c.strokeStyle = COL.blueDk; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
};

const broom = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.rotate(0.3); c.scale(s, s);
  line(c, [[0, -110], [0, 40]], 24, INK); line(c, [[0, -110], [0, 40]], 14, COL.wood);
  shape(c, () => polyP(c, [[-24, 36], [24, 36], [50, 130], [-50, 130]]), COL.woodDk, 6);
  for (const t of [-0.5, 0, 0.5]) line(c, [[t * 36, 50], [t * 70, 125]], 4);
  shape(c, () => rrect(c, -28, 28, 56, 20, 6), COL.red, 5);
  c.restore();
};
const candle = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => ell(c, 0, 104, 56, 14), COL.steel, 5);
  shape(c, () => rrect(c, -28, -70, 56, 180, 6), "#fff1d6", 6);
  shade(c, () => rrect(c, -28, -70, 56, 180, 6), "#e6cfa0", 18, 0, 0.7);
  line(c, [[0, -70], [0, -96]], 6);
  c.restore();
};
const banana = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => { c.moveTo(-90, -40); c.bezierCurveTo(-60, 90, 60, 90, 95, -55); c.bezierCurveTo(70, 15, -30, 25, -90, -40); c.closePath(); }, COL.yellow, 6);
  shape(c, () => rrect(c, -104, -62, 22, 30, 5), COL.brown, 5);
  shape(c, () => ell(c, 96, -56, 8, 8), COL.black, 0);
  c.restore();
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6d6b8"; c.fillRect(0, 960, D, 120); line(c, [[0, 960], [D, 960]], 5);
  shape(c, () => ell(c, 650, 235, 395, 195), WHITE, 7);
  shape(c, () => ell(c, 400, 450, 22, 18), WHITE, 6); shape(c, () => ell(c, 345, 500, 14, 11), WHITE, 5);
  broom(c, 470, 235, 1.1); candle(c, 650, 232, 1.05); banana(c, 840, 230, 1.25);
  arrow(c, [[540, 330], [585, 330]], RED, 7); arrow(c, [[715, 330], [760, 330]], RED, 7);
  shadow(c, 260, 1005, 170, 24);
  person(c, 230, 1010, 600, { armL: [-2.4, -2.0], armR: [-0.7, -1.2] });
};

const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, y + 6, w * 0.6, w * 0.12);
  const p = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
  shape(c, p, COL.steel); shade(c, p, COL.steelDk, w * 0.3, 0, 0.6);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), COL.steelIn, 5);
  line(c, [[x - w * 0.3, y - h * 0.85], [x - w * 0.24, y - h * 0.2]], 7, WHITE);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  // the counting hand: three fingers up, the thumb and little finger folded down
  shape(c, () => rrect(c, 210, 650, 240, 150, 18), CLOTH.child);
  shade(c, () => rrect(c, 210, 650, 240, 150, 18), CLOTH.childDk, 20, 0, 0.7);
  [[226, 230], [276, 262], [326, 236]].forEach(([fx, fh]) => shape(c, () => rrect(c, fx, 450 - fh + 20, 54, fh, 27), SKIN.child, 6));
  shape(c, () => rrect(c, 226, 440, 186, 225, 28), SKIN.child, 6);
  shade(c, () => rrect(c, 226, 440, 186, 225, 28), SKIN.childDk, 20, 0, 0.45);
  shape(c, () => rrect(c, 370, 470, 56, 70, 28), SKIN.child, 6);
  shape(c, () => rrect(c, 236, 560, 150, 52, 26), SKIN.child, 6);
  shape(c, () => rrect(c, 226, 470, 50, 4, 2), SKIN.childDk, 0);
  // table
  c.fillStyle = COL.wood; c.fillRect(0, 820, D, 260); line(c, [[0, 820], [D, 820]], 6);
  shade(c, () => { c.rect(0, 820, D, 260); }, COL.woodDk, 0, 40, 0.5);
  plate(c, 230, 940, 190, 70);
  for (const [ix, iy] of [[165, 935], [230, 925], [295, 940]]) shape(c, () => { c.moveTo(ix - 38, iy + 14); c.bezierCurveTo(ix - 38, iy - 36, ix + 38, iy - 36, ix + 38, iy + 14); c.closePath(); }, WHITE, 5);
  bowl(c, 500, 905, 62, COL.orange);
  tumbler(c, 615, 1010, 80, 130);
  // the grown-up's hand holds a tick list
  shape(c, () => rrect(c, 750, 600, 80, 480, 0), CLOTH.adult); // forearm
  shape(c, () => rrect(c, 660, 150, 290, 520, 22), COL.brown);
  shape(c, () => rrect(c, 682, 200, 246, 446, 8), WHITE, 5);
  shape(c, () => rrect(c, 750, 128, 110, 54, 12), COL.steel, 6);
  for (let i = 0; i < 5; i++) {
    const ry = 270 + i * 82;
    shape(c, () => ell(c, 725, ry, 20, 20), i < 4 ? "#d9f0c8" : WHITE, 5);
    if (i < 4) line(c, [[713, ry], [722, ry + 10], [740, ry - 12]], 7, COL.greenDk);
    line(c, [[770, ry], [895, ry]], 8, COL.blueDk);
  }
  hand(c, 790, 790, -Math.PI / 2, 1.3, SKIN.adult, CLOTH.adult);
};

// ---------------------------------------------------------------- experiment 2: the other hand
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  sheet(c, 0);
  phone(c, 930, 420, 160, 270, 0);
  penHand(c, 188, 320);
};
// setup.e2.1: the child writes with the other hand (the left one, from the right of the card); the usual hand rests, unused
const e2_1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 240, 330, 360, 220, 90), CLOTH.child, 6);
  shape(c, () => rrect(c, 380, 290, 80, 70, 20), SKIN.child, 6);
  face(c, 420, 205, 115, false, true);
  sheet(c, 3, 110, 400);
  phone(c, 930, 230, 160, 270, 2.2);
  hand(c, 80, 1000, -0.1, 1.1, SKIN.child, CLOTH.child, true);
  penHand(c, 582, 562);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 870, 440, 24);
  shape(c, () => rrect(c, 110, 120, 830, 740, 10), COL.paper);
  c.save(); c.beginPath(); rrect(c, 110, 120, 830, 740, 10); c.clip();
  for (let x = 150; x < 940; x += 40) line(c, [[x, 120], [x, 860]], 2, COL.sky);
  for (let y = 160; y < 860; y += 40) line(c, [[110, y], [940, y]], 2, COL.sky);
  c.restore();
  line(c, [[210, 160], [210, 760], [900, 760]], 10);
  const P = [[280, 240], [450, 380], [620, 520]];
  line(c, P, 14, COL.orange);
  P.forEach(([x, y], i) => { shape(c, () => ell(c, x, y, 26, 26), COL.yellow, 7); line(c, [[x, 745], [x, 775]], 6); write(c, String(i + 1), x - 14, 790, 44, INK, 7); });
  penHand(c, 620, 520);
};

// ---------------------------------------------------------------- experiment 3: letters or words
const CARD = { x: 700, y: 400, w: 440, h: 540 };
const letterCard = (c: Ctx, grouped: boolean) => {
  const { x, y, w, h } = CARD;
  line(c, [[x, 790], [x, 1100]], 100, INK); line(c, [[x, 790], [x, 1100]], 86, CLOTH.adult);
  shadow(c, x + 14, y + h / 2 + 14, w / 2, 16);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 18), COL.paper);
  const r = rnd(5);
  ORDER.forEach((k, i) => {
    const col = i % 3, row = Math.floor(i / 3), tx = x - 120 + col * 120, ty = y - 195 + row * 130;
    if (grouped) tile(c, tx, ty, 82, k, 0); else tile(c, tx + (r() - 0.5) * 40, ty + (r() - 0.5) * 40, 82, k, (r() - 0.5) * 0.9);
  });
  if (grouped) for (let row = 0; row < 4; row++) shape(c, () => rrect(c, x - 195, y - 195 + row * 130 - 56, 390, 112, 56), "rgba(215,55,43,0)", 7), c.stroke();
  hand(c, x, 770, -Math.PI / 2, 1.3, SKIN.adult, CLOTH.adult);
};
const listener = (c: Ctx) => {
  face(c, 260, 480, 190, true, false);
  for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(520, 400, 40 + i * 30, Math.PI - 0.8, Math.PI + 0.8); c.strokeStyle = COL.blueDk; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); }
};
// setup.e3.0
const e3_0 = (c: Ctx) => { ground(c); letterCard(c, false); listener(c); };
// setup.e3.1
const e3_1 = (c: Ctx) => { ground(c); letterCard(c, true); listener(c); };
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  line(c, [[130, 130], [130, 740], [960, 740]], 10);
  for (const [bx, hh, col, dk] of [[230, 230, COL.blue, COL.blueDk], [600, 580, COL.green, COL.greenDk]] as [number, number, string, string][]) {
    shadow(c, bx + 150, 746, 140, 14);
    const p = () => rrect(c, bx, 740 - hh, 220, hh, 8);
    shape(c, p, col); shade(c, p, dk, 40, 0, 0.6); line(c, [[bx + 30, 740 - hh + 24], [bx + 30, 740 - hh + Math.min(hh - 20, 90)]], 9, WHITE);
  }
  // under each bar: the card it came from, small
  const r = rnd(5);
  ORDER.forEach((k, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    tile(c, 280 + col * 68 + (r() - 0.5) * 12, 815 + row * 64 + (r() - 0.5) * 10, 52, k, (r() - 0.5) * 0.9);
    tile(c, 650 + col * 68, 815 + row * 64, 52, k, 0);
  });
  for (let row = 0; row < 4; row++) shape(c, () => rrect(c, 650 - 38, 815 + row * 64 - 32, 68 * 2 + 76, 64, 32), "rgba(0,0,0,0)", 5), c.stroke();
};

export const su_mindThinkingAndMemory = cards("sci.mind.thinking-and-memory.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
