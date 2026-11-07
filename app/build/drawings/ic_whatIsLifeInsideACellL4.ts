import type { Ctx } from "./core";
import { D, INK, SH, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, seed, leaf, hand, person, write, cards } from "./flatKit";

// sci.what-is-life.inside-a-cell.L4 · set-up cards for the three experiments (beetroot test, banana DNA,
// warm sprouts), then one picture card for each experiment, activity and project.
// Beetroot is deep red-purple, its water turns pink to deep red; banana mash is pale yellow, the alcohol
// layer is clear and the DNA is white cloudy strands; moong is olive green, boiled moong a dull khaki.
// The same child (orange sleeve) and grown-up (blue sleeve) hands as on every card.

const BEET = "#8e1b4a", BEETDK = "#5e0f32", BEETLT = "#b8396f", BEETPALE = "#c98aa5";
const PINK0 = "rgba(242,215,228,0.55)", PINK2 = "rgba(232,130,175,0.95)", PINK3 = "rgba(205,55,120,1)", PINK5 = "rgba(135,15,65,1)";
const BAN = "#f3e6a0", BANDK = "#d9c86e", PEEL = "#f6d55c", PEELDK = "#d9b23a", ALC = "rgba(226,240,252,0.8)", DNA = "#fffaf0";
const SOAP = "#79c36a", CARD = "#c9a46c", CARDDK = "#a8844f", TOWEL = "#f2d4c2", TOWELDK = "#d9a98f", NIGHT = "#1f2a5a";
const BOIL = "#c9c38a", BOILDK = "#a39d62", DOUGH = "#e9c892", NUC = "#b99ad8", ERB = "#8fb3dc", LENTIL = "#b8742f";

const table = (c: Ctx, y: number) => { shape(c, () => rrect(c, -20, y, 1120, 110, 4), COL.wood, 6); c.fillStyle = COL.woodDk; c.fillRect(-14, y + 72, 1108, 34); };
// A, B, C and D as strokes, for glass labels only
const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.14, 0.62], [0.46, 0.62]]],
  B: [[[0, 0], [0, 1]], [[0, 0], [0.4, 0], [0.55, 0.12], [0.55, 0.38], [0.4, 0.5], [0, 0.5]], [[0, 0.5], [0.42, 0.5], [0.58, 0.62], [0.58, 0.88], [0.42, 1], [0, 1]]],
  C: [[[0.58, 0.15], [0.4, 0], [0.18, 0], [0, 0.2], [0, 0.8], [0.18, 1], [0.4, 1], [0.58, 0.85]]],
  D: [[[0, 0], [0, 1]], [[0, 0], [0.35, 0], [0.58, 0.2], [0.58, 0.8], [0.35, 1], [0, 1]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, w = 6) => LET[ch].forEach((st) => line(c, st.map(([u, v]) => [x + u * h, y + v * h]), w));
const tag = (c: Ctx, x: number, y: number, ch: string, s = 1) => { shape(c, () => rrect(c, x - 36 * s, y - 40 * s, 72 * s, 80 * s, 8), WHITE, 5); letter(c, ch, x - 20 * s, y - 24 * s, 48 * s, 6); };
// the kit's side-view hand, but pointing left (fingers to the left, sleeve to the right)
const handLeft = (c: Ctx, x: number, y: number, s: number, skin: string, sleeve: string, open = false) => { c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, 0, s, skin, sleeve, open); c.restore(); };
// a clear tumbler like the kit's glass(), with stacked liquid layers (fraction of height, colour) and a callback for what sits inside
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, layers: [number, string][], inside?: () => void) => {
  const top = w / 2, bot = w * 0.4, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  let prev = 0;
  for (const [f, col] of layers) {
    const ly = y - h * f, lw = bot + (top - bot) * f, py = y - h * prev, pw = bot + (top - bot) * prev;
    shape(c, () => { c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + pw, py); c.lineTo(x - pw, py); c.closePath(); }, col, 0);
    shape(c, () => ell(c, x, ly, lw, w * 0.07), "rgba(255,255,255,0.4)", 0);
    prev = f;
  }
  if (inside) { c.save(); c.beginPath(); body(); c.clip(); inside(); c.restore(); }
  shape(c, body, COL.glass, 5);
  shape(c, () => ell(c, x, y - h, top, w * 0.08), "rgba(255,255,255,0.35)", 5);
  shine(c, [[x - top * 0.65, y - h * 0.85], [x - bot * 0.7, y - h * 0.2]], 7);
};
// wisps of steam rising from (x, y) to height h
const steam = (c: Ctx, x: number, y: number, h: number, n = 3, w = 9, col: string = COL.greyDk) => {
  c.globalAlpha = 0.55;
  for (let i = 0; i < n; i++) { const sx = x + (i - (n - 1) / 2) * 46; c.beginPath(); c.moveTo(sx, y); c.bezierCurveTo(sx - 24, y - h * 0.35, sx + 24, y - h * 0.65, sx, y - h); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke(); }
  c.globalAlpha = 1;
};
const foam = (c: Ctx, x: number, y: number, w: number, seedN: number) => { const r = rnd(seedN); for (let i = 0; i < 16; i++) { const bx = x - w / 2 + r() * w, by = y - 6 - r() * 26, br = 9 + r() * 12; shape(c, () => ell(c, bx, by, br, br), "rgba(255,255,255,0.92)", 3); } };
// a small cube seen a little from above; (x, y) is its front bottom-left corner, s the edge
const cube = (c: Ctx, x: number, y: number, s: number, top = BEETLT, front = BEET, side = BEETDK) => {
  const k = s * 0.45, m = s * 0.32;
  shape(c, () => polyP(c, [[x, y - s], [x + s, y - s], [x + s + k, y - s - m], [x + k, y - s - m]]), top, 4);
  shape(c, () => polyP(c, [[x + s, y - s], [x + s + k, y - s - m], [x + s + k, y - m], [x + s, y]]), side, 4);
  shape(c, () => polyP(c, [[x, y - s], [x + s, y - s], [x + s, y], [x, y]]), front, 4);
};
// a whole beetroot with its tail and leaf stalks, body centre (x, y), radius r
const beet = (c: Ctx, x: number, y: number, r: number) => {
  for (const [dx, an] of [[-0.3, -1.95], [0, -1.57], [0.3, -1.2]]) {
    const bx = x + dx * r * 0.7, by = y - r * 0.8, tx = bx + Math.cos(an) * r * 0.9, ty = by + Math.sin(an) * r * 0.9;
    line(c, [[bx, by], [tx, ty]], 11, INK); line(c, [[bx, by], [tx, ty]], 5, BEETLT); leaf(c, tx, ty, r * 0.85, an, COL.leaf);
  }
  shape(c, () => { c.moveTo(x - r * 0.25, y + r * 0.8); c.quadraticCurveTo(x - r * 0.05, y + r * 1.45, x + r * 0.05, y + r * 1.7); c.quadraticCurveTo(x + r * 0.15, y + r * 1.45, x + r * 0.3, y + r * 0.8); c.closePath(); }, BEET, 5);
  shape(c, () => ell(c, x, y, r, r * 0.95), BEET); shade(c, () => ell(c, x, y, r, r * 0.95), BEETDK, r * 0.3, r * 0.15);
};
// a round kitchen timer showing t minutes
const timer = (c: Ctx, x: number, y: number, t: string, r = 70) => {
  shadow(c, x + 8, y + r + 4, r * 0.9, r * 0.14);
  shape(c, () => rrect(c, x - 18, y - r - 18, 36, 26, 6), COL.steelDk, 5);
  shape(c, () => ell(c, x, y, r, r), WHITE); shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), COL.paper, 3);
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 0.74, y + Math.sin(a) * r * 0.74], [x + Math.cos(a) * r * 0.64, y + Math.sin(a) * r * 0.64]], 3); }
  write(c, t, x - t.length * r * 0.19, y - r * 0.24, r * 0.48, RED, 5);
};
// a steel spoon from its handle end (hx, hy) to the middle of its bowl (bx, by)
const spoon = (c: Ctx, hx: number, hy: number, bx: number, by: number) => {
  const an = Math.atan2(by - hy, bx - hx), ex = bx - Math.cos(an) * 34, ey = by - Math.sin(an) * 34;
  line(c, [[hx, hy], [ex, ey]], 26, INK); line(c, [[hx, hy], [ex, ey]], 16, COL.steel);
  shape(c, () => ell(c, bx, by, 46, 30, an), COL.steel, 5); shape(c, () => ell(c, bx + 4, by + 3, 30, 18, an), COL.steelIn, 0);
};
// a fork standing on its tines: handle top at (x, y), tines end at y + len
const fork = (c: Ctx, x: number, y: number, len: number) => {
  shape(c, () => rrect(c, x - 13, y, 26, len - 70, 12), COL.steel, 5);
  shape(c, () => rrect(c, x - 32, y + len - 92, 64, 36, 10), COL.steel, 5);
  for (let i = 0; i < 4; i++) shape(c, () => rrect(c, x - 30 + i * 17, y + len - 62, 10, 62, 5), COL.steel, 3);
};
// a banana lying with its curve up, middle (x, y), half-length s; cut = a half banana with a cut end at the right
const banana = (c: Ctx, x: number, y: number, s: number, cut = false) => {
  shadow(c, x + s * 0.1, y + s * 0.3, s * 0.95, s * 0.12);
  const body = () => { c.moveTo(x - s, y + s * 0.1); c.bezierCurveTo(x - s * 0.6, y - s * 0.55, x + s * 0.6, y - s * 0.55, x + s, y + s * 0.05); c.lineTo(x + s * 0.95, y + s * 0.3); c.bezierCurveTo(x + s * 0.6, y - s * 0.2, x - s * 0.6, y - s * 0.2, x - s * 0.9, y + s * 0.35); c.closePath(); };
  shape(c, body, PEEL); shade(c, body, PEELDK, 0, s * 0.1);
  if (cut) shape(c, () => ell(c, x + s * 0.97, y + s * 0.17, s * 0.07, s * 0.14, 0.2), BAN, 4);
  else shape(c, () => rrect(c, x - s * 1.08, y + s * 0.02, s * 0.14, s * 0.16, 4), COL.soilDk, 4);
};
// a bottle standing on its base at (x, y)
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, col: string, cap: string) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const body = () => { c.moveTo(x - w / 2, y); c.lineTo(x - w / 2, y - h * 0.7); c.quadraticCurveTo(x - w / 2, y - h * 0.82, x - w * 0.22, y - h * 0.86); c.lineTo(x - w * 0.22, y - h); c.lineTo(x + w * 0.22, y - h); c.lineTo(x + w * 0.22, y - h * 0.86); c.quadraticCurveTo(x + w / 2, y - h * 0.82, x + w / 2, y - h * 0.7); c.lineTo(x + w / 2, y); c.closePath(); };
  shape(c, body, col); shade(c, body, "#2b2340", w * 0.3, 0, 0.18);
  shape(c, () => rrect(c, x - w * 0.26, y - h - 26, w * 0.52, 40, 8), cap, 5);
  shape(c, () => rrect(c, x - w * 0.34, y - h * 0.55, w * 0.68, h * 0.3, 8), COL.paper, 4);
  shine(c, [[x - w * 0.32, y - h * 0.66], [x - w * 0.32, y - h * 0.12]], 6);
};
// a bottle held tilted: its body middle at (gx, gy), the neck pointing along an; the open tip is tipOf()
const bottleTilted = (c: Ctx, gx: number, gy: number, an: number, w: number, h: number) => {
  c.save(); c.translate(gx, gy); c.rotate(an);
  const body = () => { c.moveTo(-h * 0.45, -w / 2); c.lineTo(h * 0.22, -w / 2); c.quadraticCurveTo(h * 0.3, -w / 2, h * 0.32, -w * 0.2); c.lineTo(h * 0.55, -w * 0.2); c.lineTo(h * 0.55, w * 0.2); c.lineTo(h * 0.32, w * 0.2); c.quadraticCurveTo(h * 0.3, w / 2, h * 0.22, w / 2); c.lineTo(-h * 0.45, w / 2); c.closePath(); };
  shape(c, body, "rgba(228,242,252,0.92)"); shade(c, body, COL.blueDk, 0, w * 0.3, 0.2);
  shape(c, () => rrect(c, -h * 0.38, -w * 0.34, h * 0.42, w * 0.68, 8), COL.sky, 4);
  line(c, [[-h * 0.3, -w * 0.1], [-h * 0.05, -w * 0.1]], 5, COL.blueDk); line(c, [[-h * 0.3, w * 0.1], [h * -0.12, w * 0.1]], 5, COL.blueDk);
  c.restore();
};
// a funnel with a coffee filter in it, rim centre (x, y), rim radius r; the stem ends at y + r * 1.1 + 80
const funnel = (c: Ctx, x: number, y: number, r: number, mash: boolean) => {
  shape(c, () => polyP(c, [[x - r, y], [x + r, y], [x + 14, y + r * 1.1], [x - 14, y + r * 1.1]]), COL.steelIn, 5);
  shape(c, () => rrect(c, x - 12, y + r * 1.05, 24, 86, 6), COL.steelIn, 5);
  shape(c, () => ell(c, x, y, r, r * 0.22), COL.steel, 5);
  // the paper filter, a scalloped white cone a little above the rim
  const fr = r * 0.86;
  shape(c, () => { c.moveTo(x - fr, y - 18); for (let i = 0; i < 8; i++) { const a = x - fr + ((i + 0.5) / 8) * 2 * fr; c.quadraticCurveTo(a, y - 34, x - fr + ((i + 1) / 8) * 2 * fr, y - 18); } c.lineTo(x + 8, y + r * 0.95); c.lineTo(x - 8, y + r * 0.95); c.closePath(); }, WHITE, 4);
  shape(c, () => ell(c, x, y - 18, fr, fr * 0.22), mash ? BAN : WHITE, 4);
};
// a thermometer: white tube from (x, top) down len, red column up to frac of it
const thermo = (c: Ctx, x: number, top: number, len: number, frac: number) => {
  shape(c, () => rrect(c, x - 11, top, 22, len, 11), WHITE, 4);
  shape(c, () => rrect(c, x - 5, top + len * (1 - frac), 10, len * frac - 4, 5), RED, 0);
  for (let i = 1; i < 6; i++) line(c, [[x + 12, top + (len * i) / 6], [x + 20, top + (len * i) / 6]], 3);
};
// a steel flask standing on its base at (x, y), with a window cut away to show the moong inside and a thermometer through the lid
const flask = (c: Ctx, x: number, y: number, w: number, h: number, kind: "raw" | "boiled" | "sprout", frac: number) => {
  shadow(c, x + w * 0.1, y + 6, w * 0.7, w * 0.12);
  const body = () => rrect(c, x - w / 2, y - h, w, h, 22);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.3, 0);
  shape(c, () => rrect(c, x - w / 2 - 6, y - h - 34, w + 12, 46, 12), COL.steelDk, 5);
  const win = () => rrect(c, x - w * 0.3, y - h * 0.78, w * 0.6, h * 0.64, 14);
  shape(c, win, COL.steelIn, 5);
  c.save(); c.beginPath(); win(); c.clip();
  const r = rnd(kind === "raw" ? 21 : kind === "boiled" ? 22 : 23), x0 = x - w * 0.3, y0 = y - h * 0.68, ww = w * 0.6, hh = h * 0.54;
  for (let i = 0; i < 48; i++) {
    const sx = x0 + r() * ww, sy = y0 + r() * hh, rot = r() * 3;
    if (kind === "boiled") seed(c, sx, sy, 15, rot, true, BOIL, BOILDK); else seed(c, sx, sy, 15, rot, true);
    if (kind === "sprout") line(c, [[sx + Math.cos(rot) * 12, sy + Math.sin(rot) * 9], [sx + Math.cos(rot) * 24 + 6, sy + Math.sin(rot) * 18 + 8]], 4, WHITE);
  }
  // the thermometer's bulb end, among the seeds
  shape(c, () => rrect(c, x - 11, y - h * 0.8, 22, h * 0.36, 11), WHITE, 4); shape(c, () => ell(c, x, y - h * 0.46, 18, 18), RED, 4);
  c.restore();
  shape(c, () => ell(c, x, y - h * 0.46, 18, 18), RED, 4);
  thermo(c, x, y - h - 150, 118, frac);
};
// a bean-shaped mitochondrion (or any bean), middle (x, y), half sizes rx, ry, turned by rot
const bean = (c: Ctx, x: number, y: number, rx: number, ry: number, rot: number, col: string = COL.orange, dk: string = "#c7701e", folds = true) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -rx, -ry, 2 * rx, 2 * ry, ry), col, 5);
  if (folds) { const pts: number[][] = []; for (let i = 0; i <= 6; i++) pts.push([-rx * 0.65 + (i / 6) * rx * 1.3, i % 2 ? ry * 0.45 : -ry * 0.45]); line(c, pts, Math.max(3, ry * 0.22), dk); }
  c.restore();
};
// a toothpick from (x0, y0) to its point (x1, y1)
const toothpick = (c: Ctx, x0: number, y0: number, x1: number, y1: number) => { line(c, [[x0, y0], [x1, y1]], 14, INK); line(c, [[x0, y0], [x1, y1]], 7, COL.wood); };
// white DNA strands at and above a boundary line at y, between x0 and x1
const strands = (c: Ctx, x0: number, x1: number, y: number, seedN: number) => {
  const r = rnd(seedN);
  for (let i = 0; i < 9; i++) {
    const sx = x0 + ((i + 0.5) / 9) * (x1 - x0), h = 60 + r() * 110, pts: number[][] = [[sx, y + 10]];
    for (let k = 1; k <= 5; k++) pts.push([sx + (k % 2 ? 1 : -1) * (10 + r() * 14), y + 10 - (k / 5) * h]);
    const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let k = 1; k < pts.length - 1; k++) c.quadraticCurveTo(pts[k][0], pts[k][1], (pts[k][0] + pts[k + 1][0]) / 2, (pts[k][1] + pts[k + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); c.lineCap = "round"; c.lineJoin = "round"; };
    path(); c.strokeStyle = INK; c.lineWidth = 15; c.stroke(); path(); c.strokeStyle = DNA; c.lineWidth = 8; c.stroke();
  }
  shape(c, () => ell(c, (x0 + x1) / 2, y, (x1 - x0) / 2, 14), "rgba(255,250,240,0.8)", 0);
};
// a paper flag on a toothpick stuck in at (x, y)
const flag = (c: Ctx, x: number, y: number, len: number, col: string = COL.paper) => {
  line(c, [[x, y], [x, y - len]], 9, INK); line(c, [[x, y], [x, y - len]], 4, COL.wood);
  shape(c, () => rrect(c, x, y - len, 64, 38, 3), col, 4); line(c, [[x + 10, y - len + 13], [x + 52, y - len + 13]], 3, COL.greyDk); line(c, [[x + 10, y - len + 25], [x + 40, y - len + 25]], 3, COL.greyDk);
};
const dotRow = (c: Ctx, x: number, y: number, step: number, r: number, cols: string[]) => cols.forEach((col, i) => shape(c, () => ell(c, x + i * step, y, r, r), col, Math.max(2.5, r * 0.2)));
const DOT = { R: COL.red, B: COL.blue, Y: COL.yellow };
const CODE = ["R", "R", "B", "Y", "Y", "R", "B", "B"].map((k) => DOT[k as "R"]);
const lentil = (c: Ctx, x: number, y: number, rot = 0) => shape(c, () => ell(c, x, y, 9, 6, rot), LENTIL, 2.5);

// ---------------------------------------------------------------- set-up cards: e1 the beetroot test
const setupE1_0 = (c: Ctx) => {
  ground(c); table(c, 740);
  // the tray, a shallow steel slab
  shadow(c, 560, 760, 490, 22);
  shape(c, () => rrect(c, 60, 660, 960, 92, 18), COL.steel, 6); shape(c, () => rrect(c, 78, 672, 924, 50, 12), COL.steelIn, 4);
  const xs = [190, 423, 657, 890];
  xs.forEach((x, i) => tumbler(c, x, 716, 170, 300, [[0.5, COL.water]], i === 3 ? () => foam(c, x, 566, 140, 5) : undefined));
  steam(c, 423, 405, 80, 2, 7); steam(c, 657, 405, 170, 3, 9);
  ["A", "B", "C", "D"].forEach((ch, i) => tag(c, xs[i], 480, ch, 0.8));
};
const setupE1_1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 868, 450, 36);
  shape(c, () => rrect(c, 90, 430, 900, 430, 30), COL.wood); c.fillStyle = COL.woodDk; c.fillRect(102, 830, 876, 24);
  beet(c, 230, 640, 95);
  // the cut half, cut face up, under the knife
  shape(c, () => ell(c, 480, 655, 108, 86), BEET, 6); shape(c, () => ell(c, 480, 655, 78, 60), BEETLT, 3); shape(c, () => ell(c, 480, 655, 46, 34), BEET, 3); shape(c, () => ell(c, 480, 655, 18, 12), BEETLT, 3);
  // eight cubes already cut, in two rows
  [[660, 650], [760, 650], [860, 650], [960, 650], [660, 760], [760, 760], [860, 760], [960, 760]].forEach(([x, y]) => cube(c, x - 25, y, 50));
  // the knife, its edge resting in the top of the half, handle to the right in the grown-up's hand
  shape(c, () => polyP(c, [[690, 500], [690, 572], [420, 572], [365, 545], [380, 500]]), COL.steel, 5); shine(c, [[420, 518], [640, 518]], 7);
  shape(c, () => rrect(c, 680, 508, 140, 54, 14), COL.black, 5);
  handLeft(c, 845, 535, 1.45, SKIN.adult, CLOTH.adult);
};
const setupE1_2 = (c: Ctx) => {
  ground(c); table(c, 800);
  bowl(c, 520, 570, 300, PINK0);
  // the cubes under the pale pink water
  c.save(); c.beginPath(); ell(c, 520, 570, 300, 60); c.clip();
  [[330, 580], [420, 600], [510, 575], [600, 600], [690, 580], [460, 630], [560, 635], [380, 545]].forEach(([x, y]) => cube(c, x, y, 40));
  c.fillStyle = "rgba(236,170,200,0.45)"; c.fillRect(0, 0, D, D);
  c.restore();
  c.beginPath(); ell(c, 520, 570, 300, 60); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  // a spoon swirling the cubes, the child's hand at its handle from the upper right
  spoon(c, 860, 330, 640, 560);
  hand(c, 883, 306, 2.33, 1.3);
};
const setupE1_3 = (c: Ctx) => {
  ground(c); table(c, 720);
  const xs = [200, 400, 600, 800];
  xs.forEach((x, i) => tumbler(c, x, 760, 150, 250, [[0.5, i === 0 || i === 3 ? PINK0 : COL.water]], i === 0 || i === 3 ? () => { cube(c, x - 36, 746, 26); cube(c, x + 4, 752, 26); } : undefined));
  // two flat hands above B and C letting two cubes fall straight down into each glass
  for (const x of [400, 600]) {
    hand(c, x - 4, 300, Math.PI / 2, 1.2, SKIN.child, CLOTH.child, true);
    cube(c, x - 34, 468, 28); cube(c, x + 6, 505, 28);
    line(c, [[x - 48, 440], [x - 48, 480]], 3, COL.greyDk); line(c, [[x + 54, 470], [x + 54, 505]], 3, COL.greyDk);
  }
  timer(c, 960, 700, "20", 58);
};
const setupE1_4 = (c: Ctx) => {
  ground(c); table(c, 780);
  // the white sheet standing behind the glasses, held at its top corners
  shape(c, () => rrect(c, 130, 220, 820, 600, 10), WHITE, 6);
  hand(c, 40, 262, 0, 1.3); handLeft(c, 1040, 262, 1.3, SKIN.child, CLOTH.child);
  const xs = [240, 440, 640, 840], cols = [PINK0, PINK2, PINK5, PINK3], cubeCols = [[BEETLT, BEET, BEETDK], [BEETLT, BEET, BEETDK], [BEETPALE, BEETPALE, BEETLT], [BEETPALE, BEETLT, BEET]];
  xs.forEach((x, i) => tumbler(c, x, 820, 150, 260, [[0.6, cols[i]]], () => { cube(c, x - 36, 806, 26, ...(cubeCols[i] as [string, string, string])); cube(c, x + 4, 812, 26, ...(cubeCols[i] as [string, string, string])); }));
  ["A", "B", "C", "D"].forEach((ch, i) => tag(c, xs[i], 610, ch, 0.7));
};
// ---------------------------------------------------------------- set-up cards: e2 banana DNA
const setupE2_0 = (c: Ctx) => {
  ground(c); table(c, 820);
  // a small glass of warm water at the left, the half banana and a katori of salt at the right
  tumbler(c, 160, 850, 120, 190, [[0.6, COL.water]]); steam(c, 160, 650, 80, 2, 7);
  bowl(c, 900, 580, 62, WHITE);
  shape(c, () => { c.moveTo(856, 580); c.quadraticCurveTo(900, 540, 944, 580); c.closePath(); }, WHITE, 3);
  const g = rnd(12); for (let i = 0; i < 12; i++) shape(c, () => ell(c, 862 + g() * 76, 556 + g() * 22, 3, 3), COL.grey, 0);
  banana(c, 860, 760, 150, true);
  bowl(c, 500, 600, 240, BAN);
  // the fork pressed down into the mash, the child's hand on its handle
  fork(c, 500, 300, 300);
  [[430, 600], [560, 612], [500, 585]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 36, 16), BANDK, 3));
  hand(c, 500, 250, Math.PI / 2, 1.3);
};
const setupE2_1 = (c: Ctx) => {
  ground(c); table(c, 820);
  bottle(c, 180, 860, 110, 330, SOAP, WHITE);
  bowl(c, 520, 620, 240, BAN);
  // one slow turn of the spoon round the bowl, no foam
  const pts: number[][] = []; for (let i = 0; i <= 10; i++) { const a = 0.35 + (i / 10) * 2.3; pts.push([520 + Math.cos(a) * 165, 620 + Math.sin(a) * 42]); }
  arrow(c, pts.reverse(), RED, 8);
  spoon(c, 800, 380, 580, 620);
  hand(c, 823, 356, 2.33, 1.3);
};
const setupE2_2 = (c: Ctx) => {
  ground(c); table(c, 860);
  // the funnel first, then the glass drawn over its stem
  funnel(c, 540, 480, 120, true);
  [[540, 712], [540, 752], [540, 788]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 9, 14), BAN, 2.5));
  tumbler(c, 540, 900, 180, 380, [[0.25, BAN]]);
  // the tilted bowl pouring mash onto the filter; the child's hand holds its raised side
  c.save(); c.translate(412, 342); c.rotate(0.55);
  shape(c, () => { c.moveTo(-150, 0); c.bezierCurveTo(-135, 112, 135, 112, 150, 0); c.closePath(); }, COL.steel);
  shape(c, () => ell(c, 0, 0, 150, 45), BAN, 5);
  shape(c, () => ell(c, 150, 6, 26, 16), BAN, 3);
  c.restore();
  shape(c, () => polyP(c, [[526, 420], [554, 420], [552, 466], [528, 466]]), BAN, 3);
  hand(c, 193, 264, 0, 1.3);
};
const setupE2_3 = (c: Ctx) => {
  ground(c); table(c, 800);
  // the tilted glass: banana liquid below, a clear alcohol layer forming on top, both surfaces level
  const bx = 470, by = 820, rot = 0.4, gh = 300, top = 85, bot = 68;
  const body = () => { c.save(); c.translate(bx, by); c.rotate(rot); c.moveTo(-top, -gh); c.lineTo(top, -gh); c.lineTo(bot, 0); c.lineTo(-bot, 0); c.closePath(); c.restore(); };
  shadow(c, 500, 826, 90, 16);
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = BAN; c.fillRect(0, 720, D, 200); c.fillStyle = ALC; c.fillRect(0, 622, D, 98);
  c.fillStyle = "rgba(255,255,255,0.5)"; c.fillRect(300, 620, 400, 6);
  c.restore();
  // the stream from the bottle falls onto the inner wall near the rim and runs down it to the layer
  shape(c, () => polyP(c, [[634, 540], [648, 540], [646, 612], [636, 612]]), ALC, 3);
  line(c, [[641, 612], [633, 634]], 10, "rgba(226,240,252,0.95)");
  shape(c, body, COL.glass, 5);
  c.save(); c.translate(bx, by); c.rotate(rot); shape(c, () => ell(c, 0, -gh, top, 14), "rgba(255,255,255,0.35)", 5); shine(c, [[-top * 0.65, -gh * 0.85], [-bot * 0.7, -gh * 0.2]], 7); c.restore();
  // the grown-up's left hand grips the glass; the right hand holds the cold bottle tipped over the rim
  hand(c, 353, 652, 0, 1.5, SKIN.adult, CLOTH.adult);
  bottleTilted(c, 722, 397, 2.094, 70, 300);
  hand(c, 774, 306, 2.094, 1.5, SKIN.adult, CLOTH.adult);
};
const setupE2_4 = (c: Ctx) => {
  ground(c); table(c, 860);
  tumbler(c, 480, 900, 320, 560, [[0.4, BAN], [0.8, ALC]], () => strands(c, 360, 600, 676, 31));
  // the toothpick, its point in the strands, a twirl of white lifted on it
  toothpick(c, 613, 355, 560, 650);
  const pts: number[][] = [[560, 650], [585, 630], [565, 612], [592, 596], [572, 580], [596, 566]];
  line(c, pts, 16, INK); line(c, pts, 9, DNA);
  line(c, [[560, 650], [540, 668], [520, 672]], 14, INK); line(c, [[560, 650], [540, 668], [520, 672]], 8, DNA);
  hand(c, 628, 272, 1.75, 1.2);
};
// ---------------------------------------------------------------- set-up cards: e3 warm sprouts
const setupE3_0 = (c: Ctx) => {
  ground(c);
  // the night window behind the counter
  shape(c, () => rrect(c, 240, 90, 600, 440, 14), COL.wood, 6); shape(c, () => rrect(c, 262, 112, 556, 396, 6), NIGHT, 4);
  line(c, [[540, 112], [540, 508]], 10, COL.wood); line(c, [[262, 310], [818, 310]], 10, COL.wood);
  shape(c, () => ell(c, 700, 220, 48, 48), COL.yellow, 4);
  const r = rnd(4); for (let i = 0; i < 14; i++) { const x = 280 + r() * 520, y = 130 + r() * 360; if (Math.abs(x - 700) < 70 && Math.abs(y - 220) < 70) continue; shape(c, () => ell(c, x, y, 4, 4), WHITE, 0); }
  table(c, 760);
  bowl(c, 540, 650, 270, COL.water);
  c.save(); c.beginPath(); ell(c, 540, 650, 270, 54); c.clip();
  const q = rnd(8); for (let i = 0; i < 70; i++) seed(c, 290 + q() * 500, 612 + q() * 76, 13, q() * 3, false);
  c.fillStyle = "rgba(143,195,234,0.45)"; c.fillRect(0, 0, D, D);
  c.restore();
  c.beginPath(); ell(c, 540, 650, 270, 54); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
};
const setupE3_1 = (c: Ctx) => {
  ground(c); table(c, 780);
  // the pan of boiled moong, still steaming, its handle out to the left
  line(c, [[160, 590], [30, 548]], 34, INK); line(c, [[160, 590], [30, 548]], 22, COL.black);
  shadow(c, 350, 780, 200, 24);
  shape(c, () => rrect(c, 150, 560, 360, 200, 16), COL.steel); shade(c, () => rrect(c, 150, 560, 360, 200, 16), COL.steelDk, 110, 0);
  shape(c, () => ell(c, 330, 560, 180, 40), COL.steelIn, 5);
  c.save(); c.beginPath(); ell(c, 330, 560, 180, 40); c.clip(); const r = rnd(5); for (let i = 0; i < 60; i++) seed(c, 160 + r() * 340, 530 + r() * 60, 15, r() * 3, true, BOIL, BOILDK); c.restore();
  c.beginPath(); ell(c, 330, 560, 180, 40); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  steam(c, 330, 505, 170, 3, 9);
  // the bowl of raw soaked moong beside it
  bowl(c, 800, 640, 180, COL.water);
  c.save(); c.beginPath(); ell(c, 800, 640, 180, 36); c.clip(); const q = rnd(6); for (let i = 0; i < 48; i++) seed(c, 640 + q() * 320, 616 + q() * 48, 15, q() * 3, true); c.restore();
  c.beginPath(); ell(c, 800, 640, 180, 36); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
};
const setupE3_2 = (c: Ctx) => {
  ground(c); table(c, 820);
  flask(c, 320, 860, 210, 400, "raw", 0.45);
  flask(c, 760, 860, 210, 400, "boiled", 0.45);
  // the same level in both: a dashed line across
  c.setLineDash([12, 12]); line(c, [[200, 588], [880, 588]], 4, RED); c.setLineDash([]);
};
const setupE3_3 = (c: Ctx) => {
  ground(c);
  // the corner of a room: a wall edge and the floor
  c.fillStyle = "rgba(43,35,64,0.06)"; c.fillRect(0, 0, 120, 930); line(c, [[120, 0], [120, 930]], 6); line(c, [[0, 930], [D, 930]], 6);
  // the open box: its back wall, the two towel rolls standing inside, then its front
  shape(c, () => rrect(c, 190, 230, 700, 380, 10), CARDDK, 6);
  for (const x of [380, 700]) {
    thermo(c, x, 160, 120, 0.45);
    shape(c, () => rrect(c, x - 110, 270, 220, 420, 34), TOWEL, 6);
    for (let k = 0; k < 4; k++) line(c, [[x - 104, 320 + k * 90], [x + 104, 320 + k * 90]], 8, TOWELDK);
    line(c, [[x + 30, 270], [x + 60, 500]], 4, TOWELDK);
  }
  shape(c, () => rrect(c, 170, 570, 740, 360, 10), CARD, 6); shade(c, () => rrect(c, 170, 570, 740, 360, 10), CARDDK, 0, 300, 0.4);
  line(c, [[170, 600], [910, 600]], 4, CARDDK);
};

// ---------------------------------------------------------------- picture cards
const flowE1 = (c: Ctx) => {
  ground(c); table(c, 840);
  // cold water: the cube sits in clear water. hot water: red streams out of the cube and fills the glass
  tumbler(c, 300, 880, 240, 420, [[0.6, COL.water]], () => cube(c, 268, 872, 54));
  // the red spreads up from the cube: deepest at the bottom, fading toward the surface
  tumbler(c, 760, 880, 240, 420, [[0.17, PINK5], [0.32, PINK3], [0.47, PINK2], [0.6, "rgba(240,190,215,0.9)"]], () => cube(c, 728, 872, 54, BEETPALE, BEETLT, BEET));
  steam(c, 760, 450, 160, 3, 9);
};
const flowE2 = (c: Ctx) => {
  ground(c); table(c, 860);
  tumbler(c, 600, 900, 260, 480, [[0.4, BAN], [0.8, ALC]], () => strands(c, 500, 700, 708, 32));
  banana(c, 230, 830, 170);
  toothpick(c, 690, 325, 640, 600);
  const pts: number[][] = [[640, 600], [662, 582], [644, 566], [668, 550], [650, 536]];
  line(c, pts, 15, INK); line(c, pts, 8, DNA);
  line(c, [[640, 600], [622, 618], [604, 624]], 13, INK); line(c, [[640, 600], [622, 618], [604, 624]], 7, DNA);
  hand(c, 705, 242, 1.75, 1.2);
};
const flowE3 = (c: Ctx) => {
  ground(c); table(c, 820);
  flask(c, 320, 860, 210, 400, "sprout", 0.78);
  flask(c, 760, 860, 210, 400, "boiled", 0.38);
  steam(c, 320, 300, 150, 3, 9, COL.orange);
};
const flowA1 = (c: Ctx) => {
  ground(c);
  // the nucleus plate with the strip of eight dots; the ribosome plate with the four grains in order
  plate(c, 250, 600, 200, 120); plate(c, 830, 600, 200, 120);
  shape(c, () => rrect(c, 108, 570, 284, 62, 6), WHITE, 5); dotRow(c, 138, 601, 32, 13, CODE);
  arrow(c, [[470, 620], [610, 620]], RED, 9);
  // the sticky-note copy carried across
  c.save(); c.translate(540, 400); c.rotate(-0.08);
  shape(c, () => rrect(c, -95, -75, 190, 150, 4), COL.yellow, 5); dotRow(c, -70, 0, 20, 8, CODE);
  c.restore();
  // chana, rajma, rice, moong
  shape(c, () => ell(c, 740, 600, 22, 20), "#e2c28a", 4); shape(c, () => ell(c, 744, 592, 7, 5), "#c9a467", 0);
  bean(c, 802, 600, 24, 13, -0.3, "#7a2a2e", "#7a2a2e", false);
  shape(c, () => ell(c, 862, 600, 24, 9, -0.2), WHITE, 4);
  seed(c, 924, 600, 20, 0.3, false);
};
const flowA2 = (c: Ctx) => {
  ground(c);
  // the slips lie on the table top, seen from above
  c.fillStyle = COL.wood; c.fillRect(0, 0, D, D);
  const xs = [160, 350, 540, 730, 920], n = [0, 1, 2, 4, 6], y0 = 340;
  xs.forEach((x, i) => {
    shape(c, () => rrect(c, x - 70, y0 + 12, 160, 230, 6), SH, 0);
    shape(c, () => rrect(c, x - 80, y0, 160, 230, 6), WHITE, 5);
    const cy = y0 + 95;
    if (i === 0) { shape(c, () => ell(c, x, cy, 48, 48), COL.red, 5); shape(c, () => ell(c, x, cy, 22, 22), "#f08a7a", 3); }
    if (i === 1) { shape(c, () => ell(c, x - 20, cy - 30, 20, 26, 0.4), COL.sky, 4); line(c, [[x - 8, cy - 8], [x + 10, cy + 8], [x - 4, cy + 30], [x + 20, cy + 50]], 5, INK); }
    if (i === 2) { shape(c, () => polyP(c, [[x - 44, cy - 20], [x - 10, cy - 48], [x + 40, cy - 36], [x + 48, cy + 14], [x + 14, cy + 48], [x - 40, cy + 30]]), "#c98a6a", 5); shape(c, () => ell(c, x, cy, 14, 14), "#7a4a3a", 3); }
    if (i === 3) shape(c, () => { c.moveTo(x, cy + 46); c.bezierCurveTo(x - 70, cy - 10, x - 40, cy - 60, x, cy - 24); c.bezierCurveTo(x + 40, cy - 60, x + 70, cy - 10, x, cy + 46); c.closePath(); }, COL.red, 5);
    if (i === 4) { shape(c, () => ell(c, x, cy, 54, 54), COL.pink, 5); shape(c, () => ell(c, x + 6, cy - 4, 18, 18), COL.purple, 3); }
    for (let k = 0; k < n[i]; k++) bean(c, x - ((n[i] - 1) * 24) / 2 + k * 24, y0 + 190, 11, 7, -0.4, COL.orange, "#c7701e", false);
  });
  arrow(c, [[120, 760], [960, 760]], RED, 10);
};
const flowA3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 200, 60, 680, 960, 8), WHITE, 6);
  // the child at the bottom, then mother, grandmother, great-grandmother above; a bean beside each, arrows down the line
  person(c, 540, 1000, 160);
  [770, 540, 310].forEach((y) => person(c, 540, y, 180, { adult: true }));
  [900, 680, 450, 220].forEach((y) => bean(c, 720, y, 34, 20, -0.3));
  [[320, 440], [550, 670], [780, 900]].forEach(([a, b]) => arrow(c, [[400, a - 90], [400, b - 90]], RED, 7));
  write(c, "100", 690, 80, 56, INK, 6);
};
const flowP1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 580, 440, 350);
  // the membrane: a rope of dough round the rim
  c.beginPath(); ell(c, 540, 580, 380, 296); c.strokeStyle = INK; c.lineWidth = 40; c.stroke(); c.beginPath(); ell(c, 540, 580, 380, 296); c.strokeStyle = DOUGH; c.lineWidth = 28; c.stroke();
  // rough ER: folded blue strips with lentils on them, to the right of the nucleus
  for (let k = 0; k < 3; k++) { const y = 470 + k * 52, pts: number[][] = []; for (let i = 0; i <= 8; i++) pts.push([640 + i * 20, y + (i % 2 ? 14 : -14)]); line(c, pts, 26, INK); line(c, pts, 16, ERB); pts.forEach(([x, py], i) => { if (i % 2) lentil(c, x, py - 4, 0.3); }); }
  // Golgi: a stack of curved pink strips; a lysosome; mitochondria; free ribosomes
  for (let k = 0; k < 4; k++) { const y = 650 + k * 30; c.beginPath(); c.moveTo(690, y); c.quadraticCurveTo(780, y - 34, 870, y); c.strokeStyle = INK; c.lineWidth = 22; c.lineCap = "round"; c.stroke(); c.beginPath(); c.moveTo(690, y); c.quadraticCurveTo(780, y - 34, 870, y); c.strokeStyle = COL.pink; c.lineWidth = 12; c.stroke(); }
  shape(c, () => ell(c, 420, 760, 26, 24), COL.purple, 5);
  [[300, 470, 0.4], [330, 660, -0.5], [760, 400, 0.2], [600, 790, -0.2], [850, 560, 0.9]].forEach(([x, y, r]) => bean(c, x, y, 50, 28, r));
  const q = rnd(9); for (let i = 0; i < 14; i++) { const a = q() * Math.PI * 2, d = 0.45 + q() * 0.45; lentil(c, 540 + Math.cos(a) * 340 * d, 580 + Math.sin(a) * 260 * d, q() * 3); }
  // the nucleus: a ball of purple dough with holes poked in for pores
  shadow(c, 530, 640, 100, 24);
  shape(c, () => ell(c, 520, 560, 95, 88), NUC); shade(c, () => ell(c, 520, 560, 95, 88), "#8c6cb0", 28, 14);
  for (let i = 0; i < 7; i++) { const a = -0.6 + i * 0.9; shape(c, () => ell(c, 520 + Math.cos(a) * 58, 560 + Math.sin(a) * 52, 9, 9), INK, 0); }
  // flags on toothpicks naming each room's job
  flag(c, 520, 540, 110); flag(c, 760, 400, 90, COL.sky); flag(c, 780, 690, 110, COL.cloth); flag(c, 700, 470, 90, COL.paper);
};

export const ic_whatIsLifeInsideACellL4 = cards("sci.what-is-life.inside-a-cell.L4", [
  setupE1_0, setupE1_1, setupE1_2, setupE1_3, setupE1_4,
  setupE2_0, setupE2_1, setupE2_2, setupE2_3, setupE2_4,
  setupE3_0, setupE3_1, setupE3_2, setupE3_3,
  flowE1, flowE2, flowE3, flowA1, flowA2, flowA3, flowP1,
]);
