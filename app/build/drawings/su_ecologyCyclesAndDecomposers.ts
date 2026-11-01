import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, plate, hand, cards } from "./flatKit";

// SET-UP CARDS for sci.ecology.cycles-and-decomposers.L3: chapati and mould (e1), the pickle test (e2), the balloon bottle (e3).
// Same objects on every card of one experiment: the clear box with its letter tag, the chapati piece, the cucumber slice, the bottle.

const CH = { soft: "#ecc98f", softDk: "#c9a164", damp: "#d9b57c", dampDk: "#b38a52", crisp: "#c98b3e", crispDk: "#9a6126", spot: "#b9843c", char: "#6b4120" };
const CUKE = { skin: "#3f8a3a", skinDk: "#2c6a2c", flesh: "#d9efb0", fleshDk: "#b7d98a", seed: "#f6f9d8" };
const BAN = { peel: "#f5dc5e", peelDk: "#d9b92f", brown: "#8a5a2c" };
const BALL = { pink: COL.pink, pinkDk: "#d4708f" };

// ---------------------------------------------------------------- shared pieces
const drop = (c: Ctx, x: number, y: number, s: number) =>
  shape(c, () => { c.moveTo(x, y - s * 1.7); c.quadraticCurveTo(x + s * 0.9, y - s * 0.3, x + s * 0.9, y + s * 0.3); c.arc(x, y + s * 0.3, s * 0.9, 0, Math.PI); c.quadraticCurveTo(x - s * 0.9, y - s * 0.3, x, y - s * 1.7); c.closePath(); }, COL.water, 3.5);

const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.1, 0.68], [0.5, 0.68]]],
  B: [[[0, 1], [0, 0], [0.4, 0], [0.55, 0.2], [0.4, 0.48], [0, 0.48]], [[0.4, 0.48], [0.6, 0.72], [0.45, 1], [0, 1]]],
  C: [[[0.55, 0.15], [0.3, 0], [0.05, 0.25], [0.05, 0.75], [0.3, 1], [0.55, 0.85]]],
  P: [[[0, 1], [0, 0], [0.4, 0], [0.58, 0.22], [0.4, 0.48], [0, 0.48]]],
  S: [[[0.55, 0.12], [0.3, 0], [0.05, 0.2], [0.3, 0.48], [0.55, 0.78], [0.3, 1], [0.02, 0.88]]],
};
// a white paper tag with one big letter, stuck on a box
const tag = (c: Ctx, ch: string, cx: number, cy: number, s: number) => {
  shape(c, () => rrect(c, cx - s * 0.65, cy - s * 0.65, s * 1.3, s * 1.3, s * 0.2), WHITE, 5);
  const h = s * 0.9;
  c.strokeStyle = INK; c.lineWidth = s * 0.13; c.lineCap = "round"; c.lineJoin = "round";
  LET[ch].forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(cx - h * 0.3 + u * h, cy - h * 0.5 + v * h) : c.moveTo(cx - h * 0.3 + u * h, cy - h * 0.5 + v * h))); c.stroke(); });
};

// a chapati piece (a third of a round chapati) seen from above: torn straight edges, a round crust edge, brown spots
const sector = (c: Ctx, cx: number, cy: number, R: number, a0: number, a1: number, sq: number, fill: string, fillDk: string, thick: number, seedN: number, spotCol: string = CH.spot, spots = 14) => {
  const r = rnd(seedN), am = (a0 + a1) / 2;
  const P = (a: number, rad: number, j = 0) => [cx + Math.cos(a) * rad + (r() - 0.5) * j, cy + Math.sin(a) * rad * sq + (r() - 0.5) * j * sq];
  const pts: number[][] = [];
  for (let i = 0; i <= 8; i++) pts.push(P(a0, (R * i) / 8, i === 0 || i === 8 ? 0 : R * 0.06));
  for (let i = 1; i <= 16; i++) pts.push(P(a0 + ((a1 - a0) * i) / 16, R * (1 + (r() - 0.5) * 0.02)));
  for (let i = 7; i >= 1; i--) pts.push(P(a1, (R * i) / 8, R * 0.06));
  const path = (dx: number, dy: number) => { c.moveTo(pts[0][0] + dx, pts[0][1] + dy); pts.slice(1).forEach(([x, y]) => c.lineTo(x + dx, y + dy)); c.closePath(); };
  c.beginPath(); path(thick * 0.8 + 6, thick + 8); c.fillStyle = "rgba(43,35,64,0.16)"; c.fill();
  shape(c, () => path(0, thick), fillDk, 6);
  for (let d = thick; d > 0; d -= 2) { c.beginPath(); path(0, d); c.fillStyle = fillDk; c.fill(); }
  shape(c, () => path(0, 0), fill, 6);
  shade(c, () => path(0, 0), fillDk, -R * 0.07, -R * 0.04 * sq, 0.55);
  c.save(); c.beginPath(); path(0, 0); c.clip();
  for (let i = 0; i < spots; i++) { const x = cx + Math.cos(am) * R * 0.55 + (r() - 0.5) * R * 0.95, y = cy + Math.sin(am) * R * 0.55 * sq + (r() - 0.5) * R * 0.95 * sq; c.beginPath(); ell(c, x, y, R * (0.03 + r() * 0.04), R * (0.02 + r() * 0.03) * (sq + 0.4), r() * 3); c.fillStyle = spotCol; c.globalAlpha = 0.85; c.fill(); }
  c.restore(); c.globalAlpha = 1;
};

// a cucumber slice: green skin ring, pale flesh, a ring of seeds. rx, ry give the tilt, th the thickness
const cuke = (c: Ctx, x: number, y: number, rx: number, ry: number, th: number) => {
  shape(c, () => ell(c, x, y + th, rx, ry), CUKE.skinDk, 5);
  for (let d = th; d > 0; d -= 2) { c.beginPath(); ell(c, x, y + d, rx, ry); c.fillStyle = CUKE.skinDk; c.fill(); }
  shape(c, () => ell(c, x, y, rx, ry), CUKE.skin, 5);
  shape(c, () => ell(c, x, y, rx * 0.86, ry * 0.86), CUKE.flesh, 3);
  shade(c, () => ell(c, x, y, rx * 0.86, ry * 0.86), CUKE.fleshDk, -rx * 0.12, -ry * 0.12, 0.6);
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4 + 0.3; shape(c, () => ell(c, x + Math.cos(a) * rx * 0.45, y + Math.sin(a) * ry * 0.45, rx * 0.075, ry * 0.12, a), CUKE.seed, 2); }
};

// a heap of white salt, base centre (x, y), width rx each side, height hgt
const saltPile = (c: Ctx, x: number, y: number, rx: number, hgt: number, seedN: number) => {
  const body = () => { c.moveTo(x - rx, y); c.bezierCurveTo(x - rx * 0.75, y - hgt * 1.33, x + rx * 0.75, y - hgt * 1.33, x + rx, y); c.quadraticCurveTo(x, y + hgt * 0.22, x - rx, y); c.closePath(); };
  shape(c, body, WHITE, 5);
  shade(c, body, "#aeb8c8", -rx * 0.18, -hgt * 0.1, 0.6);
  const r = rnd(seedN);
  for (let i = 0; i < 12; i++) { const u = r(), px = x - rx * 0.7 + u * rx * 1.4, py = y - Math.sin(u * Math.PI) * hgt * 0.7 * r() - 4; shape(c, () => ell(c, px, py, 3.5, 3), "#c7cfdb", 0); }
};

// a clear plastic box seen from the front and a little from above and the right. (x, y) = lower left of the front face.
// inside() draws the contents on the floor, given the floor's centre and the box width.
type Inside = (c: Ctx, fx: number, fy: number, w: number) => void;
const clearBox = (c: Ctx, x: number, y: number, w: number, h: number, inside: Inside, letter: string, lid = false) => {
  const dx = w * 0.15, dy = -w * 0.3;
  shadow(c, x + w * 0.56 + dx * 0.5, y + dy * 0.25 + 12, w * 0.66, w * 0.13);
  shape(c, () => polyP(c, [[x + dx, y - h + dy], [x + w + dx, y - h + dy], [x + w + dx, y + dy], [x + dx, y + dy]]), "#e3f1fa", 5);
  shape(c, () => polyP(c, [[x, y - h], [x + dx, y - h + dy], [x + dx, y + dy], [x, y]]), "#d3e6f3", 4);
  shape(c, () => polyP(c, [[x, y], [x + w, y], [x + w + dx, y + dy], [x + dx, y + dy]]), "#f1f8fc", 4);
  inside(c, x + w / 2 + dx / 2, y + dy / 2, w);
  shape(c, () => polyP(c, [[x + w, y - h], [x + w + dx, y - h + dy], [x + w + dx, y + dy], [x + w, y]]), "rgba(127,166,200,0.40)", 6);
  shape(c, () => rrect(c, x, y - h, w, h, 6), "rgba(214,236,250,0.26)", 6);
  shine(c, [[x + w * 0.08, y - h * 0.86], [x + w * 0.08, y - h * 0.3]], 9);
  if (lid) {
    shape(c, () => polyP(c, [[x - 10, y - h], [x + w + 10, y - h], [x + w + 10 + dx, y - h + dy], [x - 10 + dx, y - h + dy]]), "#cfe6f5", 6);
    shape(c, () => polyP(c, [[x + w + 10, y - h - 6], [x + w + 10 + dx, y - h + dy - 6], [x + w + 10 + dx, y - h + dy + 20], [x + w + 10, y - h + 20]]), "#8fbbd8", 6);
    shape(c, () => rrect(c, x - 10, y - h - 6, w + 20, 26, 6), "#a9cfe8", 6);
  } else line(c, [[x, y - h], [x + dx, y - h + dy], [x + w + dx, y - h + dy], [x + w, y - h]], 6);
  tag(c, letter, x + w * 0.2, y - h * 0.72, Math.min(w * 0.26, 100));
};

// one chapati piece lying on a box floor: kind soft / damp (with drops) / crisp
const boxPiece = (kind: "soft" | "damp" | "crisp"): Inside => (c, fx, fy, w) => {
  const R = w * 0.4, sq = 0.5, a0 = 0.5, a1 = a0 + 2.09, am = (a0 + a1) / 2;
  const col = kind === "crisp" ? CH.crisp : kind === "damp" ? CH.damp : CH.soft, dk = kind === "crisp" ? CH.crispDk : kind === "damp" ? CH.dampDk : CH.softDk;
  const cx = fx - Math.cos(am) * R * 0.5, cy = fy - Math.sin(am) * R * 0.5 * sq - 4;
  sector(c, cx, cy, R, a0, a1, sq, col, dk, 9, 21, kind === "crisp" ? CH.char : CH.spot, kind === "crisp" ? 22 : 12);
  if (kind === "damp") [[-0.18, -0.02], [0.05, 0.06], [0.2, -0.02], [-0.02, -0.07], [0.12, 0.12]].forEach(([u, v]) => shape(c, () => ell(c, fx + u * w, fy + v * w * 0.5 + 2, w * 0.035, w * 0.02), COL.drop, 2.5));
};

const spoon = (c: Ctx, bx: number, by: number, ang: number, len = 330, br = 62) => {
  const hx = bx + Math.cos(ang) * len, hy = by + Math.sin(ang) * len;
  line(c, [[bx, by], [hx, hy]], 26, INK); line(c, [[bx, by], [hx, hy]], 16, COL.steel);
  shape(c, () => ell(c, bx, by, br, br * 0.66, ang), COL.steel, 6);
  shape(c, () => ell(c, bx, by, br * 0.78, br * 0.5, ang), COL.steelIn, 3);
};
// the grown-up's hand gripping something whose middle is at (cx, cy), the fingers pointing at angle an
const grip = (c: Ctx, cx: number, cy: number, an: number, s: number) => hand(c, cx - Math.cos(an) * 70 * s, cy - Math.sin(an) * 70 * s, an, s, SKIN.adult, CLOTH.adult, false);

const shelfPlank = (c: Ctx, x: number, y: number, w: number) => {
  shape(c, () => polyP(c, [[x + 70, y + 40], [x + 70, y + 130], [x + 140, y + 40]]), COL.greyDk, 5);
  shape(c, () => polyP(c, [[x + w - 70, y + 40], [x + w - 70, y + 130], [x + w - 140, y + 40]]), COL.greyDk, 5);
  shadow(c, x + w / 2, y + 52, w / 2, 12);
  shape(c, () => rrect(c, x, y, w, 40, 8), COL.wood, 6);
  shade(c, () => rrect(c, x, y, w, 40, 8), COL.woodDk, 0, -18, 0.6);
};

// ---------------------------------------------------------------- e1: Damp or Dry
// setup.e1.0
const e1c0 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 560, 450, 310);
  const R = 240, sq = 0.62, gap = 0.05;
  [0, 1, 2].map((k) => ({ k, a0: 0.9 + (k * 2 * Math.PI) / 3 })).map((p) => ({ ...p, am: p.a0 + Math.PI / 3 })).sort((a, b) => Math.sin(a.am) - Math.sin(b.am)).forEach(({ k, a0, am }) => {
    sector(c, 540 + Math.cos(am) * 36, 560 + Math.sin(am) * 36 * sq, R, a0 + gap, a0 + (2 * Math.PI) / 3 - gap, sq, CH.soft, CH.softDk, 16, 31 + k, CH.spot, 18);
  });
};

// setup.e1.1
const e1c1 = (c: Ctx) => {
  ground(c);
  // stove, flame, tawa
  shape(c, () => rrect(c, 60, 850, 960, 110, 18), COL.steel, 6);
  shade(c, () => rrect(c, 60, 850, 960, 110, 18), COL.steelDk, 0, -50, 0.6);
  shape(c, () => ell(c, 540, 850, 240, 36), COL.black, 6);
  [280, 800].forEach((x) => shape(c, () => rrect(c, x - 18, 690, 36, 160, 6), COL.greyDk, 5));
  [[400, 56], [470, 78], [540, 94], [610, 78], [680, 56]].forEach(([x, h]) => {
    shape(c, () => { c.moveTo(x - 24, 846); c.quadraticCurveTo(x - 24, 846 - h * 0.6, x, 846 - h); c.quadraticCurveTo(x + 24, 846 - h * 0.6, x + 24, 846); c.closePath(); }, COL.blue, 5);
    shape(c, () => { c.moveTo(x - 11, 846); c.quadraticCurveTo(x - 11, 846 - h * 0.4, x, 846 - h * 0.62); c.quadraticCurveTo(x + 11, 846 - h * 0.4, x + 11, 846); c.closePath(); }, COL.sky, 0);
  });
  shape(c, () => polyP(c, [[280, 585], [70, 680], [40, 630], [270, 535]]), COL.woodDk, 6);
  const tawaSide = () => { c.moveTo(210, 540); c.lineTo(210, 590); c.ellipse(540, 590, 330, 140, 0, Math.PI, 0, true); c.lineTo(870, 540); c.closePath(); };
  shape(c, tawaSide, "#3a3540", 6);
  shape(c, () => ell(c, 540, 540, 330, 140), "#55505f", 6);
  shape(c, () => ell(c, 540, 540, 290, 118), "#66606f", 3);
  // the crisp piece
  const am = 1.7, R = 230, sq = 0.5;
  sector(c, 520 - Math.cos(am) * 90, 545 - Math.sin(am) * 90 * sq, R, am - 1.05, am + 1.05, sq, CH.crisp, CH.crispDk, 14, 41, CH.char, 24);
  // the grown-up's hand pinching the far corner, with a red arrow turning it over
  hand(c, 790, 400, 2.35, 1.7, SKIN.adult, CLOTH.adult, true);
  arrow(c, Array.from({ length: 11 }, (_, i) => { const a = Math.PI * (1.05 + i * 0.085); return [470 + Math.cos(a) * 200, 500 + Math.sin(a) * 150]; }), RED, 12);
};

// setup.e1.2
const e1c2 = (c: Ctx) => {
  ground(c);
  const w = 240, h = 240, y = 920;
  clearBox(c, 25, y, w, h, boxPiece("crisp"), "A");
  clearBox(c, 335, y, w, h, boxPiece("soft"), "B");
  clearBox(c, 645, y, w, h, boxPiece("soft"), "C");
  // one hand waters B from the left, the other waters C from the right: A gets nothing
  [[470, 1], [765, -1]].forEach(([bx, dir]) => {
    const ang = dir > 0 ? Math.PI + 0.45 : -0.45, gx = bx - dir * 164, gy = 322;
    spoon(c, bx, 400, ang, 250, 66);
    [[bx - 6, 470, 12], [bx - 8, 540, 11], [bx - 4, 605, 10]].forEach(([x, yy, sz]) => drop(c, x, yy, sz));
    grip(c, gx, gy, dir > 0 ? 0.45 : Math.PI - 0.45, 0.95);
  });
};

// setup.e1.3
const e1c3 = (c: Ctx) => {
  ground(c);
  shelfPlank(c, 25, 790, 590);
  clearBox(c, 40, 790, 240, 240, boxPiece("crisp"), "A", true);
  clearBox(c, 320, 790, 240, 240, boxPiece("damp"), "B", true);
  // the fridge, open, with a snowflake
  shadow(c, 850, 1020, 230, 24);
  shape(c, () => rrect(c, 640, 80, 410, 940, 26), "#eaf1f6", 6);
  shape(c, () => rrect(c, 668, 110, 354, 880, 10), "#a9d0ea", 5);
  shade(c, () => rrect(c, 668, 110, 354, 880, 10), "#6fa6cc", 22, 0, 0.5);
  shape(c, () => rrect(c, 668, 880, 354, 110, 8), "#8fbfe0", 5);
  shape(c, () => rrect(c, 668, 790, 354, 18, 4), "#e3f1fa", 5);
  [0, 1, 2].forEach((k) => { const a = (k * Math.PI) / 3; line(c, [[845 - Math.cos(a) * 62, 230 - Math.sin(a) * 62], [845 + Math.cos(a) * 62, 230 + Math.sin(a) * 62]], 10, WHITE); });
  clearBox(c, 715, 790, 240, 240, boxPiece("damp"), "C", true);
};

// ---------------------------------------------------------------- e2: The Pickle Test
const sliceTwo: Inside = (c, fx, fy, w) => { cuke(c, fx - w * 0.2, fy + 10, w * 0.19, w * 0.19 * 0.5, 9); cuke(c, fx + w * 0.2, fy - 8, w * 0.19, w * 0.19 * 0.5, 9); };

// setup.e2.0
const e2c0 = (c: Ctx) => {
  ground(c);
  const w = 350, h = 210, y = 800;
  clearBox(c, 60, y, w, h, sliceTwo, "P");
  clearBox(c, 620, y, w, h, () => {}, "S");
  // a grown-up's hand pinches two slices and lowers them into the empty box S
  cuke(c, 850, 400, 92, 78, 14);
  cuke(c, 830, 380, 92, 78, 14);
  hand(c, 955, 215, 2.05, 1.5, SKIN.adult, CLOTH.adult, false);
  arrow(c, [[830, 505], [830, 580]], RED, 14);
};

// setup.e2.1
const e2c1 = (c: Ctx) => {
  ground(c);
  const w = 600, h = 300, y = 880;
  clearBox(c, 150, y, w, h, (cc, fx, fy, ww) => {
    cuke(cc, fx - ww * 0.2, fy + 12, ww * 0.19, ww * 0.19 * 0.5, 12); cuke(cc, fx + ww * 0.2, fy - 14, ww * 0.19, ww * 0.19 * 0.5, 12);
    saltPile(cc, fx - ww * 0.2, fy + 16, ww * 0.15, 70, 3); saltPile(cc, fx + ww * 0.2, fy - 10, ww * 0.15, 70, 4);
  }, "S");
  spoon(c, 520, 400, -0.45, 340, 74);
  saltPile(c, 520, 400, 52, 32, 6);
  const r = rnd(9);
  for (let i = 0; i < 16; i++) { const t = i / 15; shape(c, () => ell(c, 458 - t * 40 + (r() - 0.5) * 22, 440 + t * 270, 8, 7), WHITE, 3); }
  grip(c, 745, 305, Math.PI - 0.45, 1.25);
};

// setup.e2.2
const e2c2 = (c: Ctx) => {
  ground(c);
  shelfPlank(c, 30, 706, 1020);
  const w = 400, h = 260, y = 706;
  clearBox(c, 70, y, w, h, sliceTwo, "P", true);
  clearBox(c, 580, y, w, h, (cc, fx, fy, ww) => {
    shape(cc, () => ell(cc, fx, fy + 4, ww * 0.45, ww * 0.095), COL.water, 4);
    shape(cc, () => ell(cc, fx - ww * 0.18, fy - 2, ww * 0.12, ww * 0.025), COL.drop, 0);
    cuke(cc, fx - ww * 0.2, fy + 6, ww * 0.17, ww * 0.17 * 0.5, 9); cuke(cc, fx + ww * 0.2, fy - 6, ww * 0.17, ww * 0.17 * 0.5, 9);
    saltPile(cc, fx - ww * 0.2, fy + 10, ww * 0.12, 46, 3); saltPile(cc, fx + ww * 0.2, fy - 2, ww * 0.12, 46, 4);
  }, "S", true);
};

// ---------------------------------------------------------------- e3: Balloon Bottle
const bottlePath = (c: Ctx, x: number, yb: number, w: number, h: number) => {
  const bw = w / 2, nw = w * 0.16, ys = yb - h * 0.7, yn = yb - h * 0.9, yt = yb - h;
  c.moveTo(x - nw, yt); c.lineTo(x - nw, yn); c.bezierCurveTo(x - nw, yn + h * 0.07, x - bw, ys - h * 0.06, x - bw, ys + h * 0.02);
  c.lineTo(x - bw, yb - bw * 0.3); c.quadraticCurveTo(x - bw, yb, x - bw * 0.7, yb); c.lineTo(x + bw * 0.7, yb); c.quadraticCurveTo(x + bw, yb, x + bw, yb - bw * 0.3);
  c.lineTo(x + bw, ys + h * 0.02); c.bezierCurveTo(x + bw, ys - h * 0.06, x + nw, yn + h * 0.07, x + nw, yn); c.lineTo(x + nw, yt); c.closePath();
};
// a curved strip of banana peel: yellow with brown freckles, a brown tip, a pale inside edge
const peel = (c: Ctx, x: number, y: number, rot: number, sc = 1) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(sc, sc);
  const strip = () => { c.moveTo(-46, 8); c.quadraticCurveTo(0, -30, 46, 8); c.lineTo(38, 24); c.quadraticCurveTo(0, -4, -38, 24); c.closePath(); };
  shape(c, strip, BAN.peel, 4);
  shade(c, strip, BAN.peelDk, 0, 7, 0.6);
  c.save(); c.beginPath(); strip(); c.clip(); c.fillStyle = BAN.brown; c.fillRect(30, -40, 30, 80); c.restore();
  c.beginPath(); strip(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  [[-26, 4], [-8, -6], [10, -2], [-14, 12]].forEach(([u, v]) => shape(c, () => ell(c, u, v, 4.5, 3), BAN.brown, 0));
  c.restore();
};
// a plastic bottle standing on the counter, water up to 'level' (0..1 of its height), optional peels floating in it
const bottle = (c: Ctx, x: number, yb: number, w: number, h: number, level: number, peels: boolean, bubbles = false) => {
  shadow(c, x + w * 0.12, yb + 8, w * 0.62, w * 0.1);
  shape(c, () => bottlePath(c, x, yb, w, h), "rgba(225,242,252,0.75)", 0);
  c.save(); c.beginPath(); bottlePath(c, x, yb, w, h); c.clip();
  const yl = yb - h * level;
  c.fillStyle = COL.water; c.fillRect(x - w, yl, w * 2, h);
  c.globalAlpha = 0.5; c.fillStyle = COL.waterDk; c.fillRect(x + w * 0.22, yl, w, h); c.globalAlpha = 1;
  shape(c, () => ell(c, x, yl, w * 0.5, w * 0.06), COL.drop, 0);
  if (peels) [[-50, 4, 0.3], [40, 30, -0.5], [-20, 80, 0.9], [45, 130, 0.5], [-45, 150, -0.2], [10, 168, 0.1], [-40, 190, 0.7]].forEach(([u, v, r]) => peel(c, x + u, yl + v + 14, r, 1.1));
  if (bubbles) [[-40, -30, 11], [30, -60, 9], [-5, -100, 12], [55, 20, 8]].forEach(([u, v, r]) => { shape(c, () => ell(c, x + u, yl + v, r, r), "rgba(233,243,255,0.8)", 3); });
  c.lineWidth = 5; c.strokeStyle = COL.glassEdge; c.globalAlpha = 0.6;
  for (const f of [0.3, 0.42, 0.54]) { const yy = yb - h * f * 0.5 - h * 0.04; c.beginPath(); c.moveTo(x - w, yy); c.quadraticCurveTo(x, yy + 14, x + w, yy); c.stroke(); }
  c.restore(); c.globalAlpha = 1;
  shape(c, () => bottlePath(c, x, yb, w, h), "rgba(255,255,255,0.1)", 6);
  shape(c, () => rrect(c, x - w * 0.16 - 9, yb - h * 0.955, w * 0.32 + 18, 16, 6), COL.glass, 5);
  shape(c, () => ell(c, x, yb - h, w * 0.16, w * 0.045), "rgba(255,255,255,0.4)", 5);
  shine(c, [[x - w * 0.36, yb - h * 0.62], [x - w * 0.36, yb - h * 0.12]], 10);
};

// setup.e3.0
const e3c0 = (c: Ctx) => {
  ground(c);
  const yb = 910, w = 250, h = 540;
  bottle(c, 290, yb, w, h, 0.5, true);
  bottle(c, 740, yb, w, h, 0.5, false);
  // spoon tipping chopped banana peel into the neck
  spoon(c, 312, 262, -0.315, 340, 76);
  peel(c, 280, 248, -0.2, 1.1); peel(c, 345, 260, 0.2, 1.1);
  peel(c, 300, 335, 1.5, 1.2);
  arrow(c, [[170, 250], [190, 340]], RED, 12);
  grip(c, 592, 185, Math.PI - 0.315, 1.2);
};

// setup.e3.1
const balloon = (c: Ctx, x: number, yt: number, w: number, full: boolean) => {
  const nw = w * 0.16;
  if (full) {
    const body = () => ell(c, x, yt - 190, 150, 175);
    shape(c, body, BALL.pink, 6);
    shade(c, body, BALL.pinkDk, -34, -30, 0.65);
    shine(c, [[x - 85, yt - 270], [x - 100, yt - 200]], 12);
  } else {
    const sack = () => { c.moveTo(x + 10, yt - 34); c.bezierCurveTo(x + 120, yt - 80, x + 230, yt - 20, x + 205, yt + 130); c.bezierCurveTo(x + 195, yt + 220, x + 110, yt + 215, x + 104, yt + 110); c.bezierCurveTo(x + 98, yt + 30, x + 40, yt + 10, x - 10, yt - 6); c.closePath(); };
    shape(c, sack, BALL.pink, 6);
    shade(c, sack, BALL.pinkDk, -14, -10, 0.6);
    line(c, [[x + 120, yt - 20], [x + 150, yt + 30]], 5, BALL.pinkDk); line(c, [[x + 135, yt + 60], [x + 150, yt + 100]], 5, BALL.pinkDk);
  }
  shape(c, () => rrect(c, x - nw - 12, yt - 44, nw * 2 + 24, 62, 12), BALL.pinkDk, 6);
};
const e3c1 = (c: Ctx) => {
  ground(c);
  const yb = 930, w = 250, h = 500;
  bottle(c, 300, yb, w, h, 0.5, true, true);
  bottle(c, 740, yb, w, h, 0.5, false);
  balloon(c, 300, yb - h, w, true);
  balloon(c, 740, yb - h, w, false);
};

export const su_ecologyCyclesAndDecomposers = cards("sci.ecology.cycles-and-decomposers.L3 set-up", [e1c0, e1c1, e1c2, e1c3, e2c0, e2c1, e2c2, e3c0, e3c1]);
