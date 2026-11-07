import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, seed, leaf, hand, person, write, cards } from "./flatKit";

// ONE CELL, THEN TWO (sci.what-is-life.cells-divide.L4) · set-up cards for the two root experiments, then the
// card pictures. Flat kit look: bold ink outline, flat colour, shade to the lower right, the main thing big and central.

const ROOT = "#fffaf0", TIP = "#f3e3a8", TISSUE = "#d6ebf7", PAPER = COL.paper, NUC = COL.purple, CELL = "#fde7b3", CELLDK = "#f0c97a";

// ---------------------------------------------------------------- small helpers
// capital letters the cards need (plate labels and the four DNA letters), as strokes in a 0..1 box
const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.12, 0.65], [0.48, 0.65]]],
  B: [[[0.05, 0], [0.05, 1]], [[0.05, 0], [0.4, 0], [0.55, 0.12], [0.55, 0.38], [0.4, 0.5], [0.05, 0.5]], [[0.4, 0.5], [0.58, 0.62], [0.58, 0.88], [0.4, 1], [0.05, 1]]],
  T: [[[0, 0], [0.6, 0]], [[0.3, 0], [0.3, 1]]],
  C: [[[0.58, 0.15], [0.4, 0], [0.15, 0.05], [0.02, 0.3], [0.02, 0.7], [0.15, 0.95], [0.4, 1], [0.58, 0.85]]],
  G: [[[0.58, 0.15], [0.4, 0], [0.15, 0.05], [0.02, 0.3], [0.02, 0.7], [0.15, 0.95], [0.4, 1], [0.6, 0.85], [0.6, 0.55], [0.35, 0.55]]],
};
const lett = (c: Ctx, t: string, x: number, y: number, h: number, col: string = INK, w = 6) => {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; let cx = x;
  for (const ch of t) { (LET[ch] ?? []).forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(cx + u * h, y + v * h) : c.moveTo(cx + u * h, y + v * h))); c.stroke(); }); cx += h * 0.8; }
};
// a white paper tag with one letter on it, centred at (x, y)
const tag = (c: Ctx, x: number, y: number, t: string, s = 64) => { shape(c, () => rrect(c, x - s * 0.6, y - s * 0.6, s * 1.2, s * 1.2, 8), WHITE, 5); lett(c, t, x - s * 0.3, y - s * 0.36, s * 0.72, INK, 7); };

// a root: a band that tapers from width w at the base (pts[0]) to the tip; cut = a flat snipped end
const rootBand = (c: Ctx, pts: number[][], w: number, cut = false) => {
  const n = pts.length, L: number[][] = [], R: number[][] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], an = Math.atan2(b[1] - a[1], b[0] - a[0]), hw = (w / 2) * (1 - (cut ? 0.4 : 0.8) * (i / (n - 1)));
    L.push([pts[i][0] - Math.sin(an) * hw, pts[i][1] + Math.cos(an) * hw]); R.push([pts[i][0] + Math.sin(an) * hw, pts[i][1] - Math.cos(an) * hw]);
  }
  shape(c, () => polyP(c, [...L, ...R.reverse()]), ROOT, 5);
  const t = pts[n - 1];
  if (cut) line(c, [L[n - 1], R[0]], 5, COL.soilDk); else shape(c, () => ell(c, t[0], t[1], w * 0.28, w * 0.28), TIP, 0);
};
// a moong sprout: soaked seed at (x, y), root running out at angle an for len px with a gentle bend; returns the tip
const sprout = (c: Ctx, x: number, y: number, an: number, len: number, bend = 0.25, w = 16, sr = 24, cut = false) => {
  const pts: number[][] = [];
  for (let k = 0; k <= 5; k++) { const t = k / 5, a = an + bend * t; pts.push([x + Math.cos(a) * len * t, y + Math.sin(a) * len * t]); }
  rootBand(c, pts, w, cut); seed(c, x, y, sr, an + 0.3, true); return pts;
};
// damp tissue lying on a plate (a soft rounded square), with a few drops
const tissue = (c: Ctx, cx: number, cy: number, rx: number, ry: number, wet = true, sd = 3) => {
  shape(c, () => { c.moveTo(cx - rx * 0.7, cy - ry * 0.5); c.quadraticCurveTo(cx, cy - ry * 0.82, cx + rx * 0.7, cy - ry * 0.48); c.quadraticCurveTo(cx + rx * 0.82, cy, cx + rx * 0.66, cy + ry * 0.52); c.quadraticCurveTo(cx, cy + ry * 0.84, cx - rx * 0.66, cy + ry * 0.5); c.quadraticCurveTo(cx - rx * 0.82, cy, cx - rx * 0.7, cy - ry * 0.5); c.closePath(); }, wet ? TISSUE : COL.cloth, 5);
  if (wet) { const r = rnd(sd); for (let i = 0; i < 7; i++) { const x = cx - rx * 0.5 + r() * rx, y = cy - ry * 0.4 + r() * ry * 0.8; shape(c, () => ell(c, x, y, 8, 5), COL.drop, 2.5); } }
};
// a wooden ruler, top-left corner (x, y), mm ticks every `mm` px, numbers each centimetre
const ruler = (c: Ctx, x: number, y: number, len: number, mm = 7, h = 64) => {
  shadow(c, x + len / 2 + 10, y + h + 4, len / 2, 10);
  shape(c, () => rrect(c, x, y, len, h, 6), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(x + 3, y + h - 13, len - 6, 10);
  c.strokeStyle = INK; c.lineCap = "butt";
  const n = Math.floor((len - 40) / mm);
  for (let i = 0; i <= n; i++) { const xx = x + 20 + i * mm, th = i % 10 === 0 ? h * 0.46 : i % 5 === 0 ? h * 0.32 : h * 0.18; c.lineWidth = i % 10 === 0 ? 4 : 2.5; c.beginPath(); c.moveTo(xx, y); c.lineTo(xx, y + th); c.stroke(); }
  for (let cm = 0; cm * 10 <= n; cm++) write(c, String(cm), x + 20 + cm * 10 * mm - 8, y + h * 0.5, h * 0.3, INK, 4);
};
// a paper card with mm tick marks along its top edge (the ruler card of experiment 2), top-left (x, y)
const tickCard = (c: Ctx, x: number, y: number, w: number, h: number, mm: number, from = 0) => {
  shadow(c, x + w / 2 + 10, y + h + 6, w / 2, 12);
  shape(c, () => rrect(c, x, y, w, h, 10), PAPER, 5);
  c.strokeStyle = INK; c.lineCap = "butt";
  const n = Math.floor((w - 2 * from) / mm);
  for (let i = 0; i <= n; i++) { const xx = x + from + i * mm; c.lineWidth = i % 5 === 0 ? 4 : 2.5; c.beginPath(); c.moveTo(xx, y); c.lineTo(xx, y + (i % 5 === 0 ? 34 : 18)); c.stroke(); }
  for (let i = 0; i <= n; i += 5) write(c, String(i), x + from + i * mm - (i >= 10 ? 14 : 8), y + 42, 28, INK, 4);
};
// scissors: pivot at (x, y), blades pointing along angle an, opened by `open` radians, finger rings behind the pivot
const scissors = (c: Ctx, x: number, y: number, an: number, open = 0.4, s = 1) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  for (const k of [-1, 1]) {
    c.save(); c.rotate((k * open) / 2);
    shape(c, () => rrect(c, -78, -k * 26 - 12, 54, 24, 11), COL.red, 5); shape(c, () => rrect(c, -68, -k * 26 - 4, 34, 8, 4), BG, 3);
    shape(c, () => polyP(c, [[-6, -8], [88, -3], [104, 0], [88, 3], [-6, 8]]), COL.steel, 5);
    c.restore();
  }
  shape(c, () => ell(c, 0, 0, 7, 7), COL.greyDk, 3);
  c.restore();
};
// a fine pen: tip at (x, y), body running back along angle an for len px
const pen = (c: Ctx, x: number, y: number, an: number, len = 210) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 26, -11, len - 26, 22, 9), COL.blue, 5); shape(c, () => rrect(c, 26, -11, 36, 22, 6), COL.steel, 4);
  shape(c, () => polyP(c, [[0, 0], [28, -8], [28, 8]]), COL.black, 4);
  c.restore();
};
// a magnifying glass: grip end of the handle at (gx, gy), lens further along angle an; draws `inside` clipped to the lens
const magnifier = (c: Ctx, gx: number, gy: number, an: number, r: number, inside?: () => void) => {
  const hl = 150, lx = gx + Math.cos(an) * (hl + r), ly = gy + Math.sin(an) * (hl + r);
  c.save(); c.translate(gx, gy); c.rotate(an); shape(c, () => rrect(c, -10, -17, hl + 10, 34, 14), COL.wood, 6); c.restore();
  shape(c, () => ell(c, lx, ly, r + 16, r + 16), COL.greyDk, 6);
  shape(c, () => ell(c, lx, ly, r, r), "#eaf5fd", 5);
  if (inside) { c.save(); c.beginPath(); ell(c, lx, ly, r - 2, r - 2); c.clip(); inside(); c.restore(); }
  shine(c, [[lx - r * 0.65, ly - r * 0.35], [lx - r * 0.3, ly - r * 0.68]], 10);
  return [lx, ly];
};
// a living cell seen in a microscope picture: rounded blob with a nucleus
const cell = (c: Ctx, x: number, y: number, rx: number, ry: number, nuc = true, col = CELL) => {
  shape(c, () => ell(c, x, y, rx, ry), col, 6); shade(c, () => ell(c, x, y, rx, ry), CELLDK, rx * 0.18, ry * 0.14, 0.6);
  if (nuc) { shape(c, () => ell(c, x - rx * 0.05, y, rx * 0.36, ry * 0.36), NUC, 5); shape(c, () => ell(c, x - rx * 0.13, y - ry * 0.1, rx * 0.1, ry * 0.1), "#cdb9f0", 0); }
};
// a steel plate with a tissue on it, rim centre (x, y)
const tissuePlate = (c: Ctx, x: number, y: number, rx: number, ry: number, wet = true, sd = 3) => { plate(c, x, y, rx, ry); tissue(c, x, y, rx * 0.95, ry * 0.95, wet, sd); };

// ---------------------------------------------------------------- experiment 1: cut the tip
// 1. seeds soaking in a bowl, then wrapped in a damp cloth in a steel dabba, roots just showing
const e1s0 = (c: Ctx) => {
  ground(c);
  // bowl of water with seeds under the water
  bowl(c, 250, 600, 210, COL.water);
  const r = rnd(5);
  for (let i = 0; i < 26; i++) seed(c, 90 + r() * 320, 586 + r() * 34, 16, r() * 3, false);
  shape(c, () => ell(c, 170, 586, 55, 8), COL.drop, 0);
  arrow(c, [[480, 560], [580, 560]]);
  // steel dabba, open, with a damp cloth folded inside and sprouts lying on the cloth, white roots just showing
  shadow(c, 830, 790, 230, 30);
  const box = () => rrect(c, 610, 560, 420, 220, 20);
  shape(c, box, COL.steel); shade(c, box, COL.steelDk, 70, 0, 0.5);
  shape(c, () => ell(c, 820, 560, 210, 46), COL.steelIn, 5);
  const cloth = () => { c.moveTo(640, 556); c.bezierCurveTo(680, 470, 960, 470, 1000, 556); c.quadraticCurveTo(820, 600, 640, 556); c.closePath(); };
  shape(c, cloth, TISSUE, 5);
  line(c, [[690, 520], [760, 498], [850, 506]], 4, COL.waterDk); line(c, [[880, 540], [950, 530]], 4, COL.waterDk);
  const R2 = rnd(9);
  [[700, 540, 0.3], [770, 515, 0.2], [850, 512, -0.2], [920, 535, 0.1], [740, 560, -0.3], [890, 565, 0.4]].forEach(([x, y, a]) => {
    const an = 0.4 + a; rootBand(c, [[x, y], [x + Math.cos(an) * 24, y + Math.sin(an) * 24], [x + Math.cos(an) * 46, y + Math.sin(an) * 46]], 12); seed(c, x, y, 22, an + 0.3 + R2() * 0, true);
  });
};
// 2. two plates A and B, four sprouts on damp tissue each, a ruler measuring one root
const fourSprouts = (c: Ctx, x: number, y: number, cut = false, len = 90) => {
  sprout(c, x - 150, y - 50, 0.05, len, 0.12, 14, 20, cut); sprout(c, x + 20, y - 40, -0.05, len, -0.1, 14, 20, cut);
  sprout(c, x - 140, y + 30, -0.08, len, 0.15, 14, 20, cut); sprout(c, x + 30, y + 40, 0.06, len, -0.12, 14, 20, cut);
};
const e1s1 = (c: Ctx) => {
  ground(c);
  tissuePlate(c, 290, 470, 240, 125, true, 4); tissuePlate(c, 800, 470, 240, 125, true, 5);
  fourSprouts(c, 290, 470); fourSprouts(c, 800, 470);
  tag(c, 290, 260, "A"); tag(c, 800, 260, "B");
  // a ruler laid along one root, its zero at the seed
  ruler(c, 300, 720, 640, 8);
  const pts = sprout(c, 320, 690, 0, 160, 0, 16, 24);
  line(c, [[pts[5][0], pts[5][1] + 12], [pts[5][0], 722]], 5, RED);
  write(c, "2 cm", 450, 850, 80, INK, 9);
};
// 3. a grown-up sitting on the floor snips 3 mm off a root tip on plate B; on plate A the closed scissors only touch a tip
const e1s2 = (c: Ctx) => {
  ground(c);
  tissuePlate(c, 620, 840, 140, 85, true, 6); tissuePlate(c, 900, 840, 140, 85, true, 7);
  tag(c, 620, 660, "B"); tag(c, 900, 660, "A");
  // plate B: the root to be cut lies with its tip at the cutting point (554, 818), between the blades
  sprout(c, 690, 855, Math.atan2(818 - 855, 554 - 690), 142, 0, 14, 20);
  sprout(c, 640, 790, 0.1, 70, 0.1, 12, 18); sprout(c, 600, 885, 0.05, 90, -0.1, 12, 18);
  // plate A: closed scissors lie flat on the plate, their points only touching one root tip
  sprout(c, 870, 900, Math.atan2(830 - 900, 831 - 870), 80, 0, 14, 20);
  sprout(c, 1000, 800, 0.9, 50, 0.2, 12, 18); sprout(c, 960, 890, Math.PI - 0.2, 60, 0.2, 12, 18);
  scissors(c, 930, 830, Math.PI, 0, 0.95);
  // the grown-up sits on the floor; the right hand holds the open scissors, blades aimed at the root tip
  const { handR } = person(c, 230, 870, 640, { sit: true, dir: 1, adult: true, reachR: [455, 750], armL: [Math.PI * 0.6, Math.PI * 0.35] });
  const an = Math.atan2(818 - handR[1], 554 - handR[0]);
  scissors(c, handR[0] + Math.cos(an) * 50, handR[1] + Math.sin(an) * 50, an, 0.4, 1.2);
};
// 4. both plates covered with damp tissue and a lid, side by side on the shelf of a warm cupboard
const coveredPlate = (c: Ctx, x: number, y: number, t: string) => {
  plate(c, x, y, 170, 58);
  shape(c, () => ell(c, x, y - 10, 150, 46), TISSUE, 5);
  const lid = () => { c.moveTo(x - 160, y - 12); c.bezierCurveTo(x - 150, y - 90, x + 150, y - 90, x + 160, y - 12); c.closePath(); };
  shape(c, lid, COL.steel); shade(c, lid, COL.steelDk, 40, 0, 0.5);
  shape(c, () => ell(c, x, y - 12, 160, 24), COL.steelIn, 5);
  shape(c, () => ell(c, x, y - 70, 22, 12), COL.steelDk, 5);
  tag(c, x, y + 40, t, 54);
};
const e1s3 = (c: Ctx) => {
  ground(c);
  // cupboard: frame, dark inside, two doors open to the sides, a shelf
  shadow(c, 560, 960, 460, 24);
  shape(c, () => rrect(c, 110, 90, 860, 860, 14), COL.wood);
  shape(c, () => rrect(c, 160, 140, 760, 760, 6), "#5a3a26", 5);
  for (const [dx, k] of [[20, 1], [1060, -1]] as const) { shape(c, () => polyP(c, [[dx, 60], [dx + k * 90, 90], [dx + k * 90, 950], [dx, 980]]), COL.woodDk, 6); shape(c, () => ell(c, dx + k * 70, 520, 9, 9), INK, 0); }
  shape(c, () => polyP(c, [[160, 600], [920, 600], [920, 630], [160, 630]]), COL.wood, 5);
  shape(c, () => polyP(c, [[160, 630], [920, 630], [920, 648], [160, 648]]), COL.woodDk, 5);
  coveredPlate(c, 350, 600, "A"); coveredPlate(c, 730, 600, "B");
};
// 5. a child measures a root with a thread laid along it, then the ruler; a table of numbers beside the plate
const e1s4 = (c: Ctx) => {
  ground(c);
  tissuePlate(c, 585, 775, 165, 82, true, 8);
  sprout(c, 540, 830, 0.1, 80, 0.2, 12, 18); sprout(c, 690, 810, Math.PI + 0.3, 60, -0.2, 12, 18); sprout(c, 660, 735, 0.4, 50, 0, 12, 18);
  const pts = sprout(c, 650, 790, Math.atan2(760 - 790, 500 - 650), 150, 0.1, 14, 20);
  ruler(c, 360, 890, 420, 7, 56);
  // the table of numbers: two columns, three rows
  shape(c, () => rrect(c, 830, 600, 210, 300, 10), PAPER, 5);
  for (let i = 1; i <= 3; i++) line(c, [[830, 600 + i * 75], [1040, 600 + i * 75]], 3, COL.grey);
  line(c, [[930, 600], [930, 900]], 3, COL.grey);
  write(c, "1", 862, 620, 40, INK, 5); write(c, "12", 950, 620, 40, INK, 5);
  write(c, "2", 862, 695, 40, INK, 5); write(c, "19", 950, 695, 40, INK, 5);
  write(c, "3", 862, 770, 40, INK, 5); write(c, "27", 950, 770, 40, INK, 5);
  // the child, sitting on the floor, right hand holding the thread's end above the root tip
  const { handR } = person(c, 230, 830, 520, { sit: true, dir: 1, reachR: [405, 705], armL: [Math.PI * 0.6, Math.PI * 0.4] });
  line(c, [handR, [pts[5][0] - 4, pts[5][1] - 6], ...pts.slice(1, 5).reverse()], 4, RED);
};

// ---------------------------------------------------------------- experiment 2: dots on a root
const dotsAlong = (c: Ctx, pts: number[][], mm: number[], mmPx: number, col = INK) => {
  // dots at the given mm from the tip (the last point), measured back along the straight root
  const tip = pts[pts.length - 1], base = pts[0], an = Math.atan2(base[1] - tip[1], base[0] - tip[0]);
  mm.forEach((m) => shape(c, () => ell(c, tip[0] + Math.cos(an) * m * mmPx, tip[1] + Math.sin(an) * m * mmPx, 8, 8), col, 0));
};
// 1. a sprout lying on the marked card, its pale tip at the zero line
const e2s0 = (c: Ctx) => {
  ground(c);
  tickCard(c, 90, 400, 900, 300, 30, 60);
  sprout(c, 150 + 14 * 30, 580, Math.PI, 14 * 30, 0, 24, 30);
  arrow(c, [[150, 780], [150, 712]]);
};
// 2. a hand touches a fine pen to the root at the first tick mark; six dots in a row along the root
const e2s1 = (c: Ctx) => {
  ground(c);
  tickCard(c, 90, 420, 900, 300, 30, 60);
  const pts = sprout(c, 150 + 14 * 30, 600, Math.PI, 14 * 30, 0, 20, 30);
  dotsAlong(c, pts, [1, 3, 5, 7, 9, 11], 30);
  // the pen's point rests on the first dot (1 mm from the tip)
  const dot: [number, number] = [150 + 30, 600], an = -Math.PI * 0.72;
  const wrist: [number, number] = [dot[0] - Math.cos(an) * 150, dot[1] - Math.sin(an) * 150];
  pen(c, dot[0], dot[1], an + Math.PI, 200);
  hand(c, wrist[0], wrist[1], an, 1, SKIN.child, CLOTH.child);
};
// 3. the marked sprouts on damp tissue on a plate, under a clear lid
const e2s2 = (c: Ctx) => {
  ground(c);
  tissuePlate(c, 540, 640, 330, 160, true, 9);
  const P = [sprout(c, 360, 580, 0.05, 170, 0.1, 16, 22), sprout(c, 760, 640, Math.PI - 0.1, 170, 0.1, 16, 22), sprout(c, 380, 690, -0.05, 160, -0.15, 16, 22)];
  P.forEach((pts) => dotsAlong(c, pts, [1, 3, 5, 7, 9, 11], 11));
  const dome = () => { c.moveTo(220, 640); c.bezierCurveTo(230, 330, 850, 330, 860, 640); c.closePath(); };
  shape(c, dome, COL.glass, 0); c.lineWidth = 6; c.strokeStyle = COL.glassEdge; c.beginPath(); dome(); c.stroke();
  shape(c, () => ell(c, 540, 640, 320, 40), "rgba(255,255,255,0.3)", 5);
  shape(c, () => ell(c, 540, 404, 30, 14), COL.glassEdge, 5);
  shine(c, [[330, 560], [370, 440], [440, 400]], 12);
};
// 4. a magnifying glass over the root the next day: the first gaps between the dots are now wider
const e2s3 = (c: Ctx) => {
  ground(c);
  tickCard(c, 90, 520, 900, 260, 30, 60);
  const pts = sprout(c, 150 + 17 * 30, 650, Math.PI, 17 * 30, 0, 20, 30);
  dotsAlong(c, pts, [1, 5, 9, 12, 14, 16], 30);
  // the hand holds the magnifier from the lower right; the lens sits over the tip end of the root
  const an = -Math.PI * 0.62, lensR = 180, grip: [number, number] = [330 - Math.cos(-Math.PI * 0.62) * (150 + lensR), 650 - Math.sin(-Math.PI * 0.62) * (150 + lensR)];
  const lx = grip[0] + Math.cos(an) * (150 + lensR), ly = grip[1] + Math.sin(an) * (150 + lensR);
  magnifier(c, grip[0], grip[1], an, lensR, () => {
    c.save(); c.translate(lx, ly); c.scale(1.6, 1.6); c.translate(-330, -650);
    tickCard(c, 90, 520, 900, 260, 30, 60); const p2 = sprout(c, 150 + 17 * 30, 650, Math.PI, 17 * 30, 0, 20, 30); dotsAlong(c, p2, [1, 5, 9, 12, 14, 16], 30);
    c.restore();
  });
  hand(c, grip[0], grip[1], an, 1, SKIN.child, CLOTH.child);
};

// ---------------------------------------------------------------- card pictures
// flow.e1: after two days, plate A's roots have grown long and plate B's snipped roots have not
const flowE1 = (c: Ctx) => {
  ground(c);
  tissuePlate(c, 290, 440, 240, 130, true, 11); tissuePlate(c, 800, 440, 240, 130, true, 12);
  tag(c, 290, 210, "A"); tag(c, 800, 210, "B");
  fourSprouts(c, 290, 440, false, 150); fourSprouts(c, 800, 440, true, 60);
  scissors(c, 870, 700, Math.PI + 0.15, 0, 0.9);
  ruler(c, 110, 760, 860, 8, 70);
  const pts = sprout(c, 150, 720, 0, 300, 0, 18, 26); line(c, [[pts[5][0], pts[5][1] + 14], [pts[5][0], 762]], 5, RED);
  const q = sprout(c, 620, 720, 0, 120, 0, 18, 26, true); line(c, [[q[5][0], q[5][1] + 14], [q[5][0], 762]], 5, RED);
};
// flow.e2: the same dotted root, the day it was marked and one day later
const flowE2 = (c: Ctx) => {
  ground(c);
  tickCard(c, 90, 150, 900, 220, 30, 60);
  const a = sprout(c, 150 + 14 * 30, 300, Math.PI, 14 * 30, 0, 20, 30); dotsAlong(c, a, [1, 3, 5, 7, 9, 11], 30);
  arrow(c, [[540, 420], [540, 560]]);
  shape(c, () => ell(c, 640, 490, 58, 58), COL.yellow, 5); for (let i = 0; i < 8; i++) line(c, [[640 + Math.cos(i * 0.785) * 72, 490 + Math.sin(i * 0.785) * 72], [640 + Math.cos(i * 0.785) * 90, 490 + Math.sin(i * 0.785) * 90]], 6, COL.orange);
  write(c, "1", 420, 455, 70, INK, 8);
  tickCard(c, 90, 620, 900, 220, 30, 60);
  const b = sprout(c, 150 + 18 * 30, 770, Math.PI, 18 * 30, 0, 20, 30); dotsAlong(c, b, [1, 5, 9, 13, 15, 17], 30);
};
// flow.a1: a sheet folded once, twice, three times: 1, 2, 4, 8 boxes
const sheet = (c: Ctx, x: number, y: number, w: number, h: number, folds: number) => {
  shadow(c, x + w / 2 + 8, y + h + 6, w / 2, 10);
  shape(c, () => rrect(c, x, y, w, h, 4), "#f1ecdf", 5);
  c.strokeStyle = COL.grey; c.lineWidth = 2; for (let k = 1; k < 9; k++) { c.beginPath(); c.moveTo(x + 14, y + k * h * 0.11); c.lineTo(x + w - 14, y + k * h * 0.11); c.stroke(); }
  if (folds >= 1) line(c, [[x + w / 2, y], [x + w / 2, y + h]], 5, INK);
  if (folds >= 2) line(c, [[x, y + h / 2], [x + w, y + h / 2]], 5, INK);
  if (folds >= 3) { line(c, [[x + w / 4, y], [x + w / 4, y + h]], 5, INK); line(c, [[x + (3 * w) / 4, y], [x + (3 * w) / 4, y + h]], 5, INK); }
};
const flowA1 = (c: Ctx) => {
  ground(c);
  const W = 400, H = 300;
  sheet(c, 70, 110, W, H, 0); sheet(c, 610, 110, W, H, 1); sheet(c, 70, 580, W, H, 2); sheet(c, 610, 580, W, H, 3);
  arrow(c, [[490, 260], [590, 260]]); arrow(c, [[940, 430], [940, 560]]); arrow(c, [[590, 730], [490, 730]]);
  write(c, "1", 250, 430, 90, RED, 9); write(c, "2", 650, 430, 90, RED, 9); write(c, "4", 250, 900, 90, RED, 9); write(c, "8", 650, 900, 90, RED, 9);
};
// flow.a2: a code in A, T, C and G on a strip, the copy below it, two mistakes circled
const codeRow = (c: Ctx, x: number, y: number, code: string, s = 66) => {
  const col: Record<string, string> = { A: COL.yellow, T: COL.blue, C: COL.green, G: COL.red };
  [...code].forEach((ch, i) => { const cx = x + i * s; shape(c, () => rrect(c, cx, y, s - 8, s - 8, 8), col[ch], 4); lett(c, ch, cx + s * 0.2, y + s * 0.17, s * 0.55, ch === "A" ? INK : WHITE, 6); });
};
const flowA2 = (c: Ctx) => {
  ground(c);
  const code = "ATGCCATGTACG", copy = "ATGCGATGTTCG";
  shape(c, () => rrect(c, 70, 250, 940, 150, 12), PAPER, 5); codeRow(c, 120, 292, code, 70);
  arrow(c, [[540, 430], [540, 540]]);
  shape(c, () => rrect(c, 70, 580, 940, 150, 12), PAPER, 5); codeRow(c, 120, 622, copy, 70);
  [...code].forEach((ch, i) => { if (ch !== copy[i]) { c.beginPath(); ell(c, 120 + i * 70 + 31, 653, 46, 46); c.strokeStyle = RED; c.lineWidth = 8; c.stroke(); } });
  // a kitchen timer at 2 minutes
  shape(c, () => ell(c, 900, 140, 70, 70), COL.steel, 6); shape(c, () => ell(c, 900, 140, 54, 54), WHITE, 4);
  for (let i = 0; i < 12; i++) line(c, [[900 + Math.cos(i * 0.5236) * 44, 140 + Math.sin(i * 0.5236) * 44], [900 + Math.cos(i * 0.5236) * 50, 140 + Math.sin(i * 0.5236) * 50]], 3, INK);
  line(c, [[900, 140], [900 + Math.cos(-Math.PI / 2 + 0.21) * 44, 140 + Math.sin(-Math.PI / 2 + 0.21) * 44]], 6, RED);
  write(c, "2", 760, 110, 60, INK, 7);
  shape(c, () => rrect(c, 890, 58, 20, 16, 4), COL.steelDk, 4);
};
// flow.a3: the tape on black paper under a magnifier, the cloudy patch of skin flakes seen big
const flowA3 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 920, 420, 22);
  shape(c, () => rrect(c, 130, 300, 820, 600, 8), COL.black, 6);
  const tape = (s: number) => { c.save(); c.scale(s, s); shape(c, () => rrect(c, 230 / s, 520, 620, 130, 6), "rgba(255,255,255,0.35)", 4); const r = rnd(21); for (let i = 0; i < 90; i++) { const x = 260 + r() * 560, y = 535 + r() * 100; shape(c, () => ell(c, x, y, 3 + r() * 4, 2 + r() * 3, r() * 3), "rgba(255,250,235,0.85)", 0); } c.restore(); };
  tape(1);
  const an = -Math.PI * 0.6, grip: [number, number] = [830, 930], lensR = 190, lx = grip[0] + Math.cos(an) * (150 + lensR), ly = grip[1] + Math.sin(an) * (150 + lensR);
  magnifier(c, grip[0], grip[1], an, lensR, () => {
    c.save(); c.translate(lx, ly); c.scale(2.6, 2.6); c.translate(-560, -585);
    c.fillStyle = COL.black; c.fillRect(0, 0, D, D);
    shape(c, () => rrect(c, 230, 520, 620, 130, 6), "rgba(255,255,255,0.35)", 3);
    const r = rnd(21); for (let i = 0; i < 90; i++) { const x = 260 + r() * 560, y = 535 + r() * 100; shape(c, () => polyP(c, [[x - 5, y - 3], [x + 2, y - 5], [x + 6, y + 1], [x + 1, y + 5], [x - 5, y + 3]]), "#f6ecd8", 1.5); }
    c.restore();
  });
  hand(c, grip[0], grip[1], an, 1, SKIN.child, CLOTH.child);
};
// flow.a4: six paper X shapes lined up on a string across the cell, the halves pulled apart into two bowls
const xChrom = (c: Ctx, x: number, y: number, col: string, split = 0) => {
  for (const k of [-1, 1]) { c.save(); c.translate(x + k * split, y); c.rotate(k * 0.35); shape(c, () => rrect(c, -13, -70, 26, 140, 10), col, 5); c.restore(); }
  if (!split) shape(c, () => rrect(c, x - 18, y - 12, 36, 24, 5), COL.grey, 4);
};
const flowA4 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 980, 480, 20);
  shape(c, () => rrect(c, 110, 80, 860, 880, 10), PAPER, 5);
  shape(c, () => ell(c, 540, 520, 360, 360), "#fbf3d8", 7);
  line(c, [[130, 520], [950, 520]], 5, COL.brown);
  const cols = [COL.red, COL.blue, COL.green, COL.red, COL.blue, COL.green];
  cols.forEach((col, i) => xChrom(c, 290 + i * 100, 520, col));
  arrow(c, [[250, 600], [190, 770]]); arrow(c, [[830, 600], [890, 770]]);
  bowl(c, 190, 860, 90); bowl(c, 890, 860, 90);
  c.save(); c.translate(190, 820); c.rotate(-0.9); shape(c, () => rrect(c, -10, -55, 20, 110, 8), COL.red, 4); c.restore();
  c.save(); c.translate(890, 820); c.rotate(0.9); shape(c, () => rrect(c, -10, -55, 20, 110, 8), COL.blue, 4); c.restore();
};
// flow.p1: a week later, the pinched red-thread stem has two side shoots; the blue-thread stem is taller
const flowP1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 985, 300, 24);
  // pot
  const pot = () => polyP(c, [[330, 720], [790, 720], [740, 970], [380, 970]]);
  shape(c, pot, COL.orange); shade(c, pot, "#d27c25", 70, 0, 0.5);
  shape(c, () => rrect(c, 310, 690, 500, 44, 8), COL.orange, 6);
  shape(c, () => ell(c, 560, 690, 230, 20), COL.soil, 5);
  // stems
  const stem = (x: number, top: number, thread: string, pinched: boolean) => {
    line(c, [[x, 690], [x, top]], 14, INK); line(c, [[x, 690], [x, top]], 7, COL.leafDk);
    for (let y = 640; y > top + 60; y -= 90) { leaf(c, x, y, 80, -0.5 + Math.PI, COL.leaf); leaf(c, x, y - 20, 80, -0.5, COL.leaf); }
    if (pinched) {
      line(c, [[x - 10, top - 4], [x + 10, top - 4]], 7, COL.soilDk);
      for (const k of [-1, 1]) { const pts = [[x, top + 50], [x + k * 50, top + 10]]; line(c, pts, 10, INK); line(c, pts, 5, COL.leafDk); leaf(c, x + k * 50, top + 10, 50, k > 0 ? -0.9 : Math.PI + 0.9, COL.leaf); leaf(c, x + k * 50, top + 10, 44, k > 0 ? -0.2 : Math.PI + 0.2, COL.leaf); }
    } else { leaf(c, x, top + 6, 70, -Math.PI / 2 - 0.5, COL.leaf); leaf(c, x, top + 6, 70, -Math.PI / 2 + 0.5, COL.leaf); leaf(c, x, top + 6, 60, -Math.PI / 2, COL.leafDk); }
    const bow = () => { c.moveTo(x - 24, 620); c.quadraticCurveTo(x, 600, x + 24, 620); c.quadraticCurveTo(x, 640, x - 24, 620); c.closePath(); };
    shape(c, bow, thread, 4); line(c, [[x - 10, 630], [x - 22, 668]], 5, thread); line(c, [[x + 10, 630], [x + 22, 668]], 5, thread);
  };
  stem(450, 330, RED, true); stem(680, 190, COL.blue, false);
  // a ruler standing beside the pot
  c.save(); c.translate(880, 970); c.rotate(-Math.PI / 2); ruler(c, 0, 0, 800, 8, 64); c.restore();
};
// term.0 cell division: one round cell pinches in the middle into two round cells
const term0 = (c: Ctx) => {
  ground(c);
  cell(c, 180, 320, 130, 130);
  arrow(c, [[340, 320], [430, 320]]);
  const bean = () => { c.moveTo(640, 320); c.bezierCurveTo(640, 210, 470, 180, 470, 320); c.bezierCurveTo(470, 460, 640, 430, 640, 320); c.bezierCurveTo(640, 430, 810, 460, 810, 320); c.bezierCurveTo(810, 180, 640, 210, 640, 320); c.closePath(); };
  shape(c, bean, CELL, 6); shade(c, bean, CELLDK, 22, 18, 0.6);
  shape(c, () => ell(c, 555, 320, 40, 40), NUC, 5); shape(c, () => ell(c, 725, 320, 40, 40), NUC, 5);
  arrow(c, [[640, 500], [640, 590]]);
  cell(c, 420, 790, 130, 130); cell(c, 860, 790, 130, 130);
};
// expl.5: a root tip in four zones: cap, dividing zone, stretching zone, older zone with root hairs
const expl5 = (c: Ctx) => {
  ground(c);
  const rootShape = () => { c.moveTo(400, 60); c.lineTo(680, 60); c.lineTo(680, 760); c.quadraticCurveTo(680, 940, 540, 980); c.quadraticCurveTo(400, 940, 400, 760); c.closePath(); };
  // root hairs on the oldest part
  for (let y = 90; y < 330; y += 36) for (const [a, b] of [[[400, y], [300 - (y % 72), y - 20]], [[680, y], [780 + (y % 72), y - 14]]]) { line(c, [a, b], 11, INK); line(c, [a, b], 5, ROOT); }
  shape(c, rootShape, ROOT, 6);
  c.save(); c.beginPath(); rootShape(); c.clip();
  // zone 4 (old, top): big long cells; zone 3 (stretching): long cells; zone 2 (dividing): small boxes; zone 1 cap
  c.fillStyle = "#f6f0dd"; c.fillRect(400, 60, 280, 300); c.fillStyle = "#fff6c9"; c.fillRect(400, 360, 280, 260); c.fillStyle = "#ffe08a"; c.fillRect(400, 620, 280, 170); c.fillStyle = COL.wood; c.fillRect(400, 790, 280, 200);
  const box = (x: number, y: number, w: number, h: number, nuc = true) => { shape(c, () => rrect(c, x, y, w, h, 6), "rgba(255,255,255,0.35)", 3); if (nuc) shape(c, () => ell(c, x + w / 2, y + h / 2, Math.min(w, h) * 0.18, Math.min(w, h) * 0.18), NUC, 2); };
  for (let col = 0; col < 4; col++) for (let r = 0; r < 3; r++) box(400 + col * 70, 60 + r * 100, 70, 100);
  for (let col = 0; col < 4; col++) for (let r = 0; r < 4; r++) box(400 + col * 70, 360 + r * 65, 70, 65);
  for (let col = 0; col < 8; col++) for (let r = 0; r < 5; r++) box(400 + col * 35, 620 + r * 34, 35, 34);
  for (let col = 0; col < 7; col++) for (let r = 0; r < 4; r++) box(400 + col * 40, 790 + r * 42, 40, 42, false);
  c.restore();
  // zone bands with numbers 4..1 from the top, brackets on the right
  const zones: [number, number, string][] = [[60, 360, COL.greyDk], [360, 620, COL.greenDk], [620, 790, RED], [790, 980, COL.soilDk]];
  zones.forEach(([a, b, col], i) => { line(c, [[860, a + 8], [880, a + 8], [880, b - 8], [860, b - 8]], 6, col); write(c, String(4 - i), 910, (a + b) / 2 - 30, 60, col, 8); });
  line(c, [[400, 790], [680, 790]], 4, INK);
};
// term.15 wound healing: a cut in skin in three stages as new cells fill the gap
const term15 = (c: Ctx) => {
  ground(c);
  const block = (x: number, gap: number, fill: number) => {
    const w = 290, top = 300, bot = 800;
    shape(c, () => rrect(c, x, top, w, bot - top, 10), "#f2b7a8", 6);
    shape(c, () => rrect(c, x, top, w, 90, 10), SKIN.child, 6);
    const mid = x + w / 2;
    if (gap > 0) {
      shape(c, () => polyP(c, [[mid - gap, top], [mid + gap, top], [mid + gap * 0.4, top + 170], [mid - gap * 0.4, top + 170]]), "#c9382b", 5);
      // new cells creeping in from both edges
      for (let k = 0; k < fill; k++) for (const s of [-1, 1]) shape(c, () => ell(c, mid + s * (gap - 14 - k * 24), top + 48, 12, 12), CELL, 3);
    } else { line(c, [[mid, top], [mid, top + 60]], 4, "#d78d7e"); for (let k = 0; k < 7; k++) shape(c, () => ell(c, mid - 72 + k * 24, top + 48, 12, 12), CELL, 3); }
  };
  block(60, 50, 1); block(395, 36, 2); block(730, 0, 0);
  arrow(c, [[335, 550], [390, 550]], RED, 8); arrow(c, [[670, 550], [725, 550]], RED, 8);
};

export const ic_whatIsLifeCellsDivideL4 = cards("sci.what-is-life.cells-divide.L4", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, e2s3,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowA4, flowP1, term0, expl5, term15,
]);
