import type { Ctx } from "./core";
import { COL, CLOTH, SKIN, INK, WHITE, RED, D, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, hand, leaf, ground, write, cards, rnd } from "./flatKit";

// sci.plants.water-transport.L3 set-up cards. Same objects on every card of an experiment:
// e1 white flower, plain glass (left) and blue glass (right); e2 two narrow bottles, leafy (left) and bare (right);
// e3 a clear bag on a leafy branch, sun panel (left) and shade panel (right).
const BLUE = "#2f5fc0", BLUEMID = "#5b86d8", THREAD = COL.purple, OIL = "#f6c928", ADULT = SKIN.adult, SLEEVE = CLOTH.adult;

const dropP = (c: Ctx, x: number, y: number, r: number, col: string = COL.water) => shape(c, () => { c.moveTo(x, y - r * 1.5); c.quadraticCurveTo(x + r * 0.2, y - r * 0.6, x + r, y + r * 0.2); c.arc(x, y + r * 0.2, r, 0, Math.PI); c.quadraticCurveTo(x - r * 0.2, y - r * 0.6, x, y - r * 1.5); c.closePath(); }, col, 3);
// the long sleeve of an arm behind a hand(), reaching back from the wrist
const armBack = (c: Ctx, x: number, y: number, an: number, s: number) => { c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s); shape(c, () => rrect(c, -900, -34, 860, 68, 10), SLEEVE, 6); c.restore(); };
const stemLine = (c: Ctx, pts: number[][], w = 18) => { line(c, pts, w + 9, INK); line(c, pts, w, COL.green); };
// a white flower head; blue = the blue-water one: blue-edged petals with fine blue veins
const flowerHead = (c: Ctx, x: number, y: number, R: number, blue = false) => {
  const n = 9;
  for (let i = 0; i < n; i++) {
    const a = (i * Math.PI * 2) / n + 0.3, px = x + Math.cos(a) * R * 0.58, py = y + Math.sin(a) * R * 0.58;
    shape(c, () => ell(c, px, py, R * 0.46, R * 0.27, a), blue ? BLUEMID : WHITE, 5);
    if (blue) shape(c, () => ell(c, x + Math.cos(a) * R * 0.52, y + Math.sin(a) * R * 0.52, R * 0.3, R * 0.14, a), "#eef4ff", 0);
    else shade(c, () => ell(c, px, py, R * 0.46, R * 0.27, a), "#cfc8b8", R * 0.1, R * 0.1, 0.5);
    if (blue) line(c, [[x + Math.cos(a) * R * 0.3, y + Math.sin(a) * R * 0.3], [x + Math.cos(a) * R * 0.95, y + Math.sin(a) * R * 0.95]], 3, BLUE);
  }
  shape(c, () => ell(c, x, y, R * 0.22, R * 0.22), COL.yellow, 5);
};
const flowerStemLeaf = (c: Ctx, x: number, y: number, an: number, len: number) => leaf(c, x, y, len, an);

// ---- e1: the Blue Climb
const e1glasses = (c: Ctx, xs: number[], y: number, w: number, h: number, fill: number) => {
  glass(c, xs[0], y, w, h, fill, COL.sky);
  glass(c, xs[1], y, w, h, fill, BLUE);
};
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  const P = (u: number, v: number) => [20 + 40 * v + (1040 - 80 * v) * u - 0, 700 + 250 * v];
  shape(c, () => polyP(c, [P(0, 0), P(1, 0), P(1, 1), P(0, 1)]), "#f1ece0", 5);
  for (let r = 0; r < 9; r++) for (const [u0, u1] of [[0.05, 0.3], [0.36, 0.64], [0.7, 0.95]]) { const v = 0.22 + r * 0.085; const a = P(u0, v), b = P(u1 - (r % 3) * 0.03, v); line(c, [a, b], 6, "#b9b4ab"); }
  { const a = P(0.05, 0.1), b = P(0.95, 0.1); line(c, [a, b], 14, "#7d7870"); }
  e1glasses(c, [290, 600], 830, 250, 370, 0.62);
  // the dropper bottle of food colour
  shadow(c, 905, 845, 80, 18);
  shape(c, () => rrect(c, 840, 700, 130, 140, 24), BLUE, 6);
  shade(c, () => rrect(c, 840, 700, 130, 140, 24), "#1f4396", 40, 0, 0.5);
  shape(c, () => polyP(c, [[870, 700], [940, 700], [925, 640], [885, 640]]), WHITE, 6);
  shape(c, () => polyP(c, [[893, 640], [917, 640], [905, 585]]), BLUE, 5);
  shape(c, () => rrect(c, 862, 735, 86, 70, 12), WHITE, 4);
  dropP(c, 905, 774, 14, BLUE);
  shine(c, [[856, 725], [856, 800]], 7);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  const bowlP = () => { c.moveTo(110, 600); c.lineTo(970, 600); c.quadraticCurveTo(950, 930, 820, 950); c.lineTo(260, 950); c.quadraticCurveTo(130, 930, 110, 600); c.closePath(); };
  shadow(c, 560, 965, 440, 34);
  shape(c, bowlP, "rgba(214,236,250,0.35)", 0);
  // the flower held upright, its stem dipping into the water; the cut end is under water
  stemLine(c, [[330, 240], [330, 745]], 26);
  leaf(c, 330, 390, 130, -0.35); leaf(c, 330, 330, 120, 3.5);
  shape(c, () => ell(c, 330, 745, 18, 11, -0.4), "#e8f3c8", 5);
  flowerHead(c, 330, 215, 120);
  // right hand holding the scissors (the blades come out of the fist, under the water)
  const rw = [656, 502], ra = 2.531, rs = 1.4;
  armBack(c, rw[0], rw[1], ra, rs);
  hand(c, rw[0], rw[1], ra, rs, ADULT, SLEEVE);
  c.save(); c.translate(rw[0], rw[1]); c.rotate(ra); c.scale(rs, rs);
  for (const sg of [-1, 1]) { shape(c, () => { c.moveTo(78, 0); c.lineTo(78 + 235, sg * 24); c.lineTo(78 + 205, sg * 52); c.lineTo(78, sg * 30); c.closePath(); }, COL.steel, 5); }
  shape(c, () => ell(c, 130, 0, 10, 10), COL.steelDk, 4);
  c.restore();
  // water over the lower part
  c.save(); c.beginPath(); bowlP(); c.clip(); c.fillStyle = COL.water; c.globalAlpha = 0.5; c.fillRect(0, 640, D, 400); c.globalAlpha = 1; c.restore();
  line(c, [[118, 640], [962, 640]], 5, WHITE);
  shape(c, bowlP, "rgba(0,0,0,0)", 6);
  shine(c, [[160, 690], [200, 860]], 10);
  // left hand holding the stem above the water
  armBack(c, 225, 470, 0, 1.5);
  hand(c, 225, 470, 0, 1.5, ADULT, SLEEVE);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  const gx = [270, 810], gy = 970, gw = 270, gh = 320;
  // clock between the flowers
  shape(c, () => ell(c, 540, 170, 86, 86), WHITE, 7);
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[540 + Math.cos(a) * 68, 170 + Math.sin(a) * 68], [540 + Math.cos(a) * 78, 170 + Math.sin(a) * 78]], 4); }
  line(c, [[540, 170], [540 + 36 * Math.cos(-0.5), 170 + 36 * Math.sin(-0.5)]], 8); line(c, [[540, 170], [540, 170 - 58]], 6);
  [0, 1].forEach((k) => {
    const x = gx[k], hx = k ? 830 : 250, top: number[] = [hx, 380];
    stemLine(c, [top, [x + (k ? 6 : -6), gy - 90]], 20);
    flowerStemLeaf(c, hx + (k ? -8 : 8), 560, k ? 3.6 : -0.5, 120);
  });
  glass(c, gx[0], gy, gw, gh, 0.62, COL.sky); glass(c, gx[1], gy, gw, gh, 0.62, BLUE);
  [0, 1].forEach((k) => { const x = gx[k]; c.save(); c.globalAlpha = 0.6; line(c, [[x + (k ? 6 : -6), gy - 90], [x + (k ? 4 : -4), gy - 205]], 18, COL.green); c.restore(); });
  flowerHead(c, 250, 380, 150, false); flowerHead(c, 830, 380, 150, true);
};
// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  // cabbage leaf, its rib cut across: a curved band with a row of blue dots
  const cx = 800, cy = 700;
  shape(c, () => { c.moveTo(cx - 230, cy - 40); c.bezierCurveTo(cx - 290, cy - 200, cx - 250, cy - 330, cx - 150, cy - 300); c.bezierCurveTo(cx - 110, cy - 360, cx - 20, cy - 350, cx, cy - 300); c.bezierCurveTo(cx + 40, cy - 360, cx + 130, cy - 350, cx + 150, cy - 300); c.bezierCurveTo(cx + 250, cy - 330, cx + 290, cy - 200, cx + 230, cy - 40); c.closePath(); }, COL.greenLt, 6);
  for (const dx of [-150, -70, 0, 70, 150]) line(c, [[cx + dx * 0.3, cy - 60], [cx + dx * 1.1, cy - 270]], 4, COL.leafDk);
  shape(c, () => { c.moveTo(cx - 220, cy - 50); c.quadraticCurveTo(cx, cy + 70, cx + 220, cy - 50); c.lineTo(cx + 205, cy + 40); c.quadraticCurveTo(cx, cy + 170, cx - 205, cy + 40); c.closePath(); }, "#eef6d0", 6);
  for (let i = 0; i < 7; i++) { const t = 0.12 + i * 0.12, x = cx - 220 + 440 * t, y = cy - 50 + 4 * 60 * t * (1 - t) + 50; shape(c, () => ell(c, x, y, 15, 15), BLUE, 3.5); }
  // the magnifying glass over a cut stem: a ring of blue dots
  const lx = 330, ly = 480, R = 245;
  line(c, [[lx - 175, ly + 175], [70, 780]], 56, INK); line(c, [[lx - 175, ly + 175], [70, 780]], 44, COL.wood);
  shape(c, () => ell(c, lx, ly, R, R), "#f4f1d8", 0);
  c.save(); c.beginPath(); ell(c, lx, ly, R - 8, R - 8); c.clip();
  shape(c, () => ell(c, lx, ly, 175, 175), COL.greenLt, 6);
  shape(c, () => ell(c, lx, ly, 150, 150), "#f4f1d8", 4);
  shape(c, () => ell(c, lx, ly, 70, 70), "#e5e0b9", 4);
  for (let i = 0; i < 10; i++) { const a = (i * Math.PI * 2) / 10 + 0.2; shape(c, () => ell(c, lx + Math.cos(a) * 110, ly + Math.sin(a) * 110, 19, 19), BLUE, 4); }
  c.restore();
  shape(c, () => ell(c, lx, ly, R, R), "rgba(214,236,250,0.25)", 0);
  c.beginPath(); ell(c, lx, ly, R, R); c.lineWidth = 26; c.strokeStyle = INK; c.stroke(); c.lineWidth = 14; c.strokeStyle = COL.steel; c.stroke();
  shine(c, [[lx - 150, ly - 120], [lx - 90, ly - 175]], 10);
};

// ---- e2: Leafy or Bare
// the cut stem lying down, leafy or bare, cut end on the left
const lyingStem = (c: Ctx, y: number, leafy: boolean) => {
  stemLine(c, [[140, y], [940, y]], 20);
  shape(c, () => ell(c, 138, y, 10, 15), "#e8f3c8", 5);
  for (let i = 0; i < 4; i++) {
    const x = 270 + i * 170;
    if (leafy) { leaf(c, x, y, 170, -1.05); leaf(c, x, y, 170, 1.05); } else for (const sg of [-1, 1]) shape(c, () => ell(c, x, y + sg * 16, 8, 12), COL.greenDk, 4);
  }
  if (leafy) leaf(c, 930, y, 140, 0);
};
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  lyingStem(c, 270, true);
  lyingStem(c, 640, false);
  const r = rnd(5);
  for (let i = 0; i < 11; i++) leaf(c, 560 + r() * 330, 800 + r() * 130, 130, r() * 6.28);
};
// one narrow bottle with a stem in it: x centre, water level, leafy or not; mark = where the water used to be
const bottlePath = (c: Ctx, x: number) => { const yb = 950; c.moveTo(x - 105, yb - 10); c.quadraticCurveTo(x - 105, yb, x - 95, yb); c.lineTo(x + 95, yb); c.quadraticCurveTo(x + 105, yb, x + 105, yb - 10); c.lineTo(x + 105, yb - 300); c.quadraticCurveTo(x + 105, yb - 340, x + 48, yb - 370); c.lineTo(x + 48, yb - 440); c.lineTo(x - 48, yb - 440); c.lineTo(x - 48, yb - 370); c.quadraticCurveTo(x - 105, yb - 340, x - 105, yb - 300); c.closePath(); };
const bottle = (c: Ctx, x: number, level: number, leafy: boolean) => {
  shadow(c, x + 20, 955, 130, 22);
  stemLine(c, [[x, 910], [x + 6, 150]], 14);
  if (leafy) for (let i = 0; i < 5; i++) { const y = 420 - i * 55; leaf(c, x + 4, y, 120, -Math.PI / 2 - 0.9); leaf(c, x + 4, y, 120, -Math.PI / 2 + 0.9); }
  if (leafy) leaf(c, x + 6, 150, 90, -1.57);
  c.save(); c.beginPath(); bottlePath(c, x); c.clip();
  c.fillStyle = COL.water; c.globalAlpha = 0.75; c.fillRect(x - 120, level, 240, 400); c.globalAlpha = 1;
  c.fillStyle = OIL; c.globalAlpha = 0.95; c.fillRect(x - 120, level - 26, 240, 26); c.globalAlpha = 1;
  c.restore();
  shape(c, () => bottlePath(c, x), COL.glass, 5);
  shine(c, [[x - 80, 640], [x - 80, 880]], 8);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  for (const [x, lf] of [[230, true], [850, false]] as [number, boolean][]) { bottle(c, x, 700, lf); line(c, [[x - 112, 700], [x + 112, 700]], 7, THREAD); }
  // the marker pen
  shadow(c, 545, 958, 110, 14);
  shape(c, () => rrect(c, 440, 915, 210, 36, 14), COL.yellow, 5);
  shape(c, () => rrect(c, 440, 915, 80, 36, 14), THREAD, 5);
  shape(c, () => polyP(c, [[650, 922], [685, 933], [650, 944]]), INK, 4);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  bottle(c, 230, 820, true); bottle(c, 850, 740, false);
  for (const x of [230, 850]) line(c, [[x - 112, 700], [x + 112, 700]], 7, THREAD);
  // the ruler: its 0 level with the old mark, held by a hand from above
  line(c, [[335, 700], [385, 700]], 5, THREAD); line(c, [[335, 820], [385, 820]], 5, COL.blueDk);
  shadow(c, 470, 955, 50, 10);
  shape(c, () => rrect(c, 385, 620, 120, 325, 6), COL.wood, 6);
  for (let k = 0; k <= 11; k++) { const y = 700 + k * 20; line(c, [[385, y], [385 + (k % 2 ? 24 : 44), y]], k % 2 ? 3 : 5); }
  for (let k = 0; k <= 5; k++) write(c, String(k), 440, 700 + k * 40 + 3, 30, INK, 5);
  const arm = [[580, 640], [650, 600], [665, 480], [668, -60]];
  line(c, arm, 98, INK); line(c, arm, 86, SLEEVE);
  hand(c, 540, 640, Math.PI, 1.3, ADULT, SLEEVE);
};

// ---- e3: the Sweating Branch. Each panel is 540 wide; the branch runs down-right at 45 degrees from the left edge.
const AX = Math.PI / 4, BP = (t: number) => [t * Math.SQRT1_2, 250 + t * Math.SQRT1_2];
const bagPath = (c: Ctx) => { c.moveTo(0, -85); c.bezierCurveTo(60, -130, 180, -135, 280, -125); c.bezierCurveTo(330, -120, 345, -60, 345, 0); c.bezierCurveTo(345, 60, 330, 120, 280, 125); c.bezierCurveTo(180, 135, 60, 130, 0, 85); c.closePath(); };
const panelBack = (c: Ctx, sunny: boolean) => {
  c.fillStyle = sunny ? "#fff0b5" : "#aebfd4"; c.fillRect(0, 0, 540, D);
  if (sunny) {
    for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[95 + Math.cos(a) * 84, 95 + Math.sin(a) * 84], [95 + Math.cos(a) * 128, 95 + Math.sin(a) * 128]], 10, COL.orange); }
    shape(c, () => ell(c, 95, 95, 62, 62), COL.yellow, 6);
  } else {
    for (let x = -20; x < 600; x += 90) { shape(c, () => ell(c, x, 30, 80, 80), COL.leafDk, 5); shape(c, () => ell(c, x + 45, 10, 60, 60), COL.leaf, 5); }
    c.fillStyle = "rgba(43,35,64,0.12)"; c.fillRect(0, 120, 540, D);
  }
};
// the branch and its leaves, with the clear bag over the end
const branchBag = (c: Ctx, mist = 0, drops = 0) => {
  line(c, [BP(-30), BP(570)], 31, INK); line(c, [BP(-30), BP(570)], 22, COL.brown);
  for (const t of [90, 170, 300, 380, 460]) { const [x, y] = BP(t); leaf(c, x, y, 105, AX - 1.0); leaf(c, x, y, 105, AX + 1.0); }
  { const [x, y] = BP(550); leaf(c, x, y, 85, AX); }
  const [px, py] = BP(250);
  c.save(); c.translate(px, py); c.rotate(AX);
  shape(c, () => bagPath(c), "rgba(222,240,252,0.4)", 5);
  if (mist) { c.save(); c.beginPath(); bagPath(c); c.clip(); c.fillStyle = WHITE; c.globalAlpha = mist; c.fillRect(-10, -150, 380, 300); c.restore(); }
  line(c, [[40, -100], [210, -118]], 8, WHITE);
  c.restore();
  if (drops) {
    const r = rnd(9);
    // drops on the inside of the bag, a pool at the lowest corner
    c.save(); c.translate(px, py); c.rotate(AX); c.beginPath(); bagPath(c); c.clip(); c.rotate(-AX); c.translate(-px, -py);
    shape(c, () => ell(c, 322, 698, drops > 20 ? 78 : 30, drops > 20 ? 22 : 9), COL.water, 4);
    c.restore();
    for (let i = 0; i < drops; i++) { const u = 30 + r() * 290, v = (r() - 0.5) * 220; dropP(c, px + (u - v) * Math.SQRT1_2, py + (u + v) * Math.SQRT1_2, 7 + r() * 6, COL.drop); }
  }
};
const panelsIn = (c: Ctx, fn: (c: Ctx, sunny: boolean) => void) => {
  for (const sunny of [true, false]) { c.save(); c.translate(sunny ? 0 : 540, 0); c.beginPath(); c.rect(0, 0, 540, D); c.clip(); panelBack(c, sunny); fn(c, sunny); c.restore(); }
  line(c, [[540, 0], [540, D]], 10);
};
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  panelsIn(c, (c) => {
    branchBag(c);
    armBack(c, 282, 322, 2.356, 0.95);
    hand(c, 282, 322, 2.356, 0.95, ADULT, SLEEVE);
    arrow(c, [[60, 590], [160, 690]], RED, 11);
  });
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  const y = 520;
  line(c, [[-20, y], [960, y]], 31, INK); line(c, [[-20, y], [960, y]], 22, COL.brown);
  leaf(c, 120, y, 120, -0.9); leaf(c, 120, y, 120, 0.9);
  // the bag body beyond the gathered neck, leaves inside
  for (const x of [520, 640, 760]) { leaf(c, x, y, 120, -0.9); leaf(c, x, y, 120, 0.9); }
  leaf(c, 880, y, 100, 0);
  shape(c, () => { c.moveTo(410, y - 45); c.bezierCurveTo(450, y - 220, 700, y - 250, 900, y - 200); c.bezierCurveTo(1040, y - 150, 1050, y + 180, 900, y + 225); c.bezierCurveTo(700, y + 270, 450, y + 220, 410, y + 45); c.closePath(); }, "rgba(222,240,252,0.4)", 5);
  line(c, [[480, y - 150], [760, y - 195]], 9, WHITE);
  // gathered neck with folds
  shape(c, () => { c.moveTo(300, y - 36); for (let i = 0; i < 6; i++) c.lineTo(300 + (i + 1) * 20, y - 36 - (i % 2 ? 4 : 18) - i * 3); c.lineTo(430, y - 40); c.lineTo(430, y + 40); for (let i = 5; i >= 0; i--) c.lineTo(300 + (i + 1) * 20, y + 36 + (i % 2 ? 4 : 18) + i * 3); c.lineTo(300, y + 36); c.closePath(); }, "#dcecf7", 5);
  for (let i = 0; i < 5; i++) line(c, [[315 + i * 23, y - 28], [320 + i * 23, y + 28]], 3, COL.glassEdge);
  // thread wound three times, and a bow
  for (let i = 0; i < 3; i++) { const x = 330 + i * 22; line(c, [[x, y - 58], [x + 12, y + 58]], 15, INK); line(c, [[x, y - 58], [x + 12, y + 58]], 8, THREAD); }
  shape(c, () => ell(c, 330, y + 70, 42, 22, -0.5), THREAD, 5); shape(c, () => ell(c, 405, y + 70, 42, 22, 0.5), THREAD, 5);
  const tail = [[375, y + 66], [360, y + 200], [372, y + 330], [355, y + 440]];
  line(c, tail, 14, INK); line(c, tail, 8, THREAD);
  shape(c, () => ell(c, 368, y + 68, 17, 17), THREAD, 5);
  armBack(c, 439, 870, Math.PI, 1.2);
  hand(c, 439, 870, Math.PI, 1.2, ADULT, SLEEVE);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  panelsIn(c, (c, sunny) => {
    branchBag(c, sunny ? 0.6 : 0.12, sunny ? 34 : 5);
    // a spoon with the water that ran down
    shadow(c, 340, 960, 150, 22);
    line(c, [[40, 900], [230, 900]], 38, INK); line(c, [[40, 900], [230, 900]], 26, COL.steel);
    shape(c, () => ell(c, 340, 890, 125, 80), COL.steel, 6);
    shape(c, () => ell(c, 340, 888, 98, 58), COL.steelIn, 4);
    if (sunny) { shape(c, () => ell(c, 340, 888, 90, 52), COL.water, 3); shine(c, [[290, 870], [340, 860]], 8); } else shape(c, () => ell(c, 340, 905, 34, 17), COL.water, 3);
    arrow(c, [[330, 730], [330, 805]], RED, 11);
  });
};

export const su_plantsWaterTransport = cards("sci.plants.water-transport.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
