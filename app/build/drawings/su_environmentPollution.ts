import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, SH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, bowl, leaf, write, rnd, cards } from "./flatKit";

// sci.environment.pollution.L3 · set-up cards. Same white cards with a pencil square (A, B, C), same jar of jelly,
// same cotton ball, same cut bottle filter on every card of an experiment.

// ---------------------------------------------------------------- shared things
const JELLY = "rgba(255,222,120,0.8)", MUD = "#8a6a45", MUDDK = "#6d4f30", CLEAR = "#bfe0f5";
// a hand placed so that the object it holds is at (gx, gy); pointing left it is mirrored so the thumb stays on top
const handAt = (c: Ctx, gx: number, gy: number, an: number, s = 1, open = false) => {
  const wx = gx - Math.cos(an) * 70 * s, wy = gy - Math.sin(an) * 70 * s;
  if (Math.cos(an) < 0) { c.save(); c.scale(-1, 1); hand(c, -wx, wy, Math.PI - an, s, SKIN.child, CLOTH.child, open); c.restore(); }
  else hand(c, wx, wy, an, s, SKIN.child, CLOTH.child, open);
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number) => {
  const S: Record<string, number[][][]> = {
    A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.1, 0.66], [0.5, 0.66]]],
    B: [[[0, 0], [0, 1]], [[0, 0], [0.4, 0], [0.56, 0.2], [0.4, 0.48], [0, 0.48]], [[0.4, 0.48], [0.62, 0.72], [0.45, 1], [0, 1]]],
    C: [[[0.58, 0.15], [0.3, 0], [0.02, 0.25], [0, 0.75], [0.3, 1], [0.58, 0.85]]],
  };
  S[ch].forEach((st) => line(c, st.map(([u, v]) => [x + u * h, y + v * h]), 7, INK));
};
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) => {
  shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x - s * 0.2, y - s * 0.5, x - s, y + s * 0.2); c.arc(x, y + s * 0.2, s, Math.PI, 0, true); c.quadraticCurveTo(x + s * 0.2, y - s * 0.5, x, y - s * 1.5); c.closePath(); }, col, 4);
};
// a white card (rounded paper) with a soft shadow
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 18, y + h + 6, w * 0.52, 20);
  const p = () => rrect(c, x, y, w, h, 12);
  shape(c, p, WHITE, 6); shade(c, p, "#d9d0bd", -w * 0.025, -h * 0.02, 0.55);
};
const tape = (c: Ctx, x: number, y: number, w: number, h: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 3), "rgba(255,226,150,0.9)", 3);
  c.restore();
};
// a pencil, tip at (tx, ty), pointing along angle an (tip first), shaft running back behind the hand
const pencil = (c: Ctx, tx: number, ty: number, an: number, len = 380) => {
  const dx = Math.cos(an), dy = Math.sin(an), px = -dy, py = dx, at = (b: number, o = 0) => [tx - dx * b + px * o, ty - dy * b + py * o];
  line(c, [at(70), at(len - 38)], 36, INK); line(c, [at(70), at(len - 38)], 26, "#f2c230");
  line(c, [at(70, 8), at(len - 38, 8)], 6, "#d39a3a");
  shape(c, () => polyP(c, [at(0), at(70, -17), at(70, 17)]), "#f4d8a8", 5);
  shape(c, () => polyP(c, [at(0), at(24, -6), at(24, 6)]), "#3a3540", 3);
  line(c, [at(len - 38), at(len - 4)], 36, INK); line(c, [at(len - 38), at(len - 4)], 26, COL.pink);
  line(c, [at(len - 44, -13), at(len - 44, 13)], 8, COL.steelDk);
};
// the jar of petroleum jelly: glass jar, golden jelly, steel-blue ring where the lid goes
const jar = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.62, 22);
  const body = () => rrect(c, x - w / 2, y - h, w, h, 28);
  shape(c, body, "rgba(250,236,170,0.95)", 6);
  shade(c, body, "#e3bd55", -w * 0.1, 0, 0.45);
  shape(c, () => rrect(c, x - w / 2 - 6, y - h - 28, w + 12, 34, 10), COL.blue, 6);
  shape(c, () => ell(c, x, y - h - 12, w / 2 - 6, 14), "#ffe9a0", 4);
  shine(c, [[x - w * 0.32, y - h * 0.8], [x - w * 0.32, y - h * 0.2]], 9);
};
// ---------------------------------------------------------------- e1: dust on greased cards
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  const fx = 150, fy = 330, fw = 540, fh = 480;
  paper(c, fx + 120, fy - 100, fw, fh); letter(c, "C", fx + 160, fy - 90, 40);
  paper(c, fx + 60, fy - 50, fw, fh); letter(c, "B", fx + 100, fy - 40, 40);
  paper(c, fx, fy, fw, fh);
  letter(c, "A", fx + 30, fy + 22, 44);
  // a ruler laid below the square
  const ry = fy + fh - 125;
  shape(c, () => rrect(c, fx + 40, ry, fw - 80, 62, 6), COL.wood, 5);
  shade(c, () => rrect(c, fx + 40, ry, fw - 80, 62, 6), COL.woodDk, -4, -10, 0.5);
  for (let i = 0; i <= 20; i++) { const x = fx + 62 + i * 22.2, h = i % 5 === 0 ? 32 : 18; line(c, [[x, ry], [x, ry + h]], i % 5 === 0 ? 4 : 2.5, INK); }
  // the square, three sides done, the fourth being drawn
  const sx = 280, sy = 430, sd = 190;
  line(c, [[sx + sd, sy], [sx, sy], [sx, sy + sd], [sx + sd, sy + sd]], 8);
  const tx = sx + sd, ty = sy + sd * 0.7, an = Math.PI - 0.62;
  line(c, [[tx, sy + sd], [tx, ty]], 8);
  pencil(c, tx, ty, an, 330);
  handAt(c, tx - Math.cos(an) * 175, ty - Math.sin(an) * 175, an, 1.35);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  paper(c, 70, 250, 700, 640);
  const sx = 150, sy = 360, sd = 420;
  shape(c, () => rect4(c, sx, sy, sd, sd), "rgba(0,0,0,0)", 8);
  // jelly spread over most of the square, shiny
  shape(c, () => rrect(c, sx + 8, sy + 8, sd * 0.68, sd - 16, 10), JELLY, 4);
  shine(c, [[sx + 50, sy + 60], [sx + 50, sy + 330]], 14);
  shine(c, [[sx + 120, sy + 40], [sx + 200, sy + 40]], 10);
  shine(c, [[sx + 90, sy + 360], [sx + 220, sy + 360]], 10);
  arrow(c, [[sx + 70, sy - 40], [sx + 360, sy - 40]], RED, 12);
  jar(c, 890, 420, 220, 190);
  handAt(c, 520, 600, Math.PI + 0.5, 1.55, true);
};
const rect4 = (c: Ctx, x: number, y: number, w: number, h: number) => { c.rect(x, y, w, h); };

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  // window frame, sky, grill
  shape(c, () => rrect(c, 70, 70, 940, 540, 16), COL.teal, 8);
  shape(c, () => rrect(c, 110, 110, 860, 460, 8), COL.sky, 6);
  shade(c, () => rrect(c, 110, 110, 860, 460, 8), "#8fc3ea", -60, -40, 0.45);
  for (let i = 0; i < 9; i++) line(c, [[170 + i * 92, 110], [170 + i * 92, 570]], 12, INK);
  for (const y of [230, 470]) line(c, [[110, y], [970, y]], 12, INK);
  // the sill
  shape(c, () => polyP(c, [[40, 600], [1040, 600], [1060, 770], [20, 770]]), COL.wood, 6);
  shape(c, () => polyP(c, [[20, 770], [1060, 770], [1060, 850], [20, 850]]), COL.woodDk, 6);
  // card A flat on the sill, jelly up
  shadow(c, 270, 750, 200, 18);
  shape(c, () => polyP(c, [[110, 628], [400, 628], [450, 740], [60, 740]]), WHITE, 6);
  shape(c, () => polyP(c, [[190, 648], [320, 648], [350, 715], [160, 715]]), JELLY, 4);
  shine(c, [[215, 665], [290, 665]], 8);
  letter(c, "A", 352, 668, 34);
  tape(c, 122, 640, 60, 18, 0.5); tape(c, 392, 640, 60, 18, -0.5);
  // card B taped upright on the grill, jelly facing out
  paper(c, 430, 150, 230, 300);
  shape(c, () => rrect(c, 470, 250, 150, 150, 3), JELLY, 4); shine(c, [[490, 270], [490, 370]], 8);
  letter(c, "B", 520, 170, 50);
  tape(c, 445, 158, 70, 22, -0.5); tape(c, 645, 158, 70, 22, 0.5);
  // card C going into a steel dabba
  const dx = 850, dy = 750, dw = 210, dh = 190;
  shadow(c, dx + 20, dy + 8, dw * 0.6, 22);
  paper(c, dx - 75, dy - dh - 150, 150, 220);
  letter(c, "C", dx - 18, dy - dh - 130, 46);
  const body = () => { c.moveTo(dx - dw / 2, dy - dh); c.lineTo(dx - dw / 2, dy - 20); c.bezierCurveTo(dx - dw / 2, dy + 20, dx + dw / 2, dy + 20, dx + dw / 2, dy - 20); c.lineTo(dx + dw / 2, dy - dh); c.closePath(); };
  shape(c, body, COL.steel, 6); shade(c, body, COL.steelDk, -dw * 0.12, 0, 0.55);
  shine(c, [[dx - dw * 0.38, dy - dh * 0.85], [dx - dw * 0.38, dy - dh * 0.2]], 8);
  arrow(c, [[dx, dy - dh - 290], [dx, dy - dh - 180]], RED, 12);
};

// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  const sq: [number, string, number][] = [[90, "#5d5a60", 160], [410, "#b7b3ad", 40], [730, "#ffffff", 0]];
  sq.forEach(([x, col, n], i) => {
    paper(c, x, 460, 260, 330);
    shape(c, () => rrect(c, x + 30, 520, 200, 200, 3), col, 5);
    const r = rnd(5 + i); for (let k = 0; k < n; k++) shape(c, () => ell(c, x + 40 + r() * 180, 530 + r() * 180, 4, 4), INK, 0);
    letter(c, "ABC"[i], x + 100, 735, 42);
  });
  // magnifying glass over card A, held in a hand coming from the top left
  const lx = 270, ly = 520, lr = 150;
  line(c, [[lx - 100, ly - 110], [110, 270]], 38, INK); line(c, [[lx - 100, ly - 110], [110, 270]], 26, COL.brown);
  handAt(c, 120, 290, Math.atan2(160, 100), 1.4);
  shape(c, () => ell(c, lx, ly, lr, lr), "rgba(235,246,252,0.6)", 14);
  c.save(); c.beginPath(); ell(c, lx, ly, lr - 7, lr - 7); c.clip();
  shape(c, () => rrect(c, lx - 150, ly - 120, 300, 260, 3), "#5d5a60", 0);
  const r2 = rnd(21); for (let k = 0; k < 26; k++) shape(c, () => ell(c, lx - 130 + r2() * 260, ly - 110 + r2() * 230, 9 + r2() * 5, 9 + r2() * 4), INK, 0);
  c.restore();
  shape(c, () => ell(c, lx, ly, lr, lr), "rgba(0,0,0,0)", 14);
  shine(c, [[lx - 100, ly - 70], [lx - 70, ly - 105]], 12);
};

// ---------------------------------------------------------------- e2: wiping leaves with cotton
const cotton = (c: Ctx, x: number, y: number, r: number, tone = WHITE, toneDk = "#dcd6c8", smudge = 0) => {
  const bits: [number, number, number][] = [[0, 0, 1], [-0.55, 0.15, 0.62], [0.55, 0.1, 0.65], [-0.2, -0.55, 0.6], [0.3, -0.5, 0.55], [0.1, 0.55, 0.6], [-0.45, 0.5, 0.45]];
  bits.forEach(([a, b, k]) => { c.beginPath(); ell(c, x + a * r, y + b * r, r * k + 4, r * k + 4); c.fillStyle = INK; c.fill(); });
  bits.forEach(([a, b, k]) => { c.beginPath(); ell(c, x + a * r, y + b * r, r * k, r * k); c.fillStyle = tone; c.fill(); });
  c.save(); c.beginPath(); bits.forEach(([a, b, k]) => { c.moveTo(x + a * r + r * k, y + b * r); ell(c, x + a * r, y + b * r, r * k, r * k); }); c.clip();
  c.beginPath(); ell(c, x - r * 0.35, y - r * 0.35, r * 1.9, r * 1.9); c.rect(-9000, -9000, 18000, 18000); c.fillStyle = toneDk; c.globalAlpha = 0.7; c.fill("evenodd"); c.restore(); c.globalAlpha = 1;
  if (smudge > 0) { c.globalAlpha = smudge; c.beginPath(); ell(c, x + r * 0.05, y + r * 0.1, r * 0.75, r * 0.6); c.fillStyle = "#6f6a66"; c.fill(); c.globalAlpha = 1; }
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  // a steel katori of water
  bowl(c, 400, 700, 290, COL.water);
  c.beginPath(); ell(c, 330, 693, 90, 12); c.fillStyle = COL.drop; c.globalAlpha = 0.8; c.fill(); c.globalAlpha = 1;
  // a pot of tulsi on the balcony
  shadow(c, 880, 905, 130, 24);
  shape(c, () => polyP(c, [[780, 760], [980, 760], [955, 900], [805, 900]]), COL.orange, 6);
  shade(c, () => polyP(c, [[780, 760], [980, 760], [955, 900], [805, 900]]), "#d27c25", -40, 0, 0.55);
  shape(c, () => rrect(c, 765, 735, 230, 40, 12), COL.orange, 6);
  [[-0.2, 150], [-0.9, 120], [-1.5, 160], [-2.1, 130], [-2.7, 100], [0.4, 100]].forEach(([a, l], i) => leaf(c, 880, 745, l, a - 0.3 + 0.3, i % 2 ? COL.leaf : COL.green));
  // the wet cotton ball squeezed over the katori
  cotton(c, 450, 330, 105, "#e6f1fa", "#bcd4e8");
  [[400, 470], [450, 520], [500, 460], [430, 580], [380, 560]].forEach(([x, y], i) => drop(c, x, y, 14 + (i % 2) * 4));
  handAt(c, 450, 330, Math.PI - 0.4, 1.6);
  arrow(c, [[190, 330], [190, 540]], RED, 12);
};

// setup.e2.1
const heart = (c: Ctx) => { c.moveTo(0, -100); c.bezierCurveTo(0, -190, -140, -230, -230, -160); c.bezierCurveTo(-330, -80, -250, 80, 0, 260); c.bezierCurveTo(250, 80, 330, -80, 230, -160); c.bezierCurveTo(140, -230, 0, -190, 0, -100); c.closePath(); };
const e2_1 = (c: Ctx) => {
  ground(c);
  // the hand holding the leaf from below
  handAt(c, 400, 790, -0.5, 1.9, true);
  // a money plant leaf, heart-shaped
  c.save(); c.translate(540, 450); c.rotate(-0.3); c.scale(1.55, 1.55);
  shadow(c, 20, 280, 220, 22);
  shape(c, () => heart(c), COL.leaf, 4); shade(c, () => heart(c), COL.leafDk, -34, -16, 0.55);
  line(c, [[0, -100], [0, 230]], 3, COL.leafDk);
  for (const k of [-0.3, 0.3]) for (const y of [-40, 40, 110]) line(c, [[0, y], [k * 360, y - 70]], 2.5, COL.leafDk);
  // the clean stripe already wiped
  c.save(); c.beginPath(); heart(c); c.clip(); line(c, [[-250, -35], [250, 20]], 56, "rgba(190,236,130,0.85)"); c.restore();
  c.restore();
  cotton(c, 590, 390, 70, WHITE, "#dcd6c8", 0.7);
  handAt(c, 590, 390, 0.0 + Math.PI * 0.2 + 0.0 > 0 ? Math.PI - 0.5 : 0, 1.5);
  arrow(c, [[230, 250], [450, 300], [240, 330], [470, 380]], RED, 12);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 925, 470, 22);
  shape(c, () => rrect(c, 60, 130, 960, 790, 10), WHITE, 6);
  const rows: [number, string, string, number][] = [[330, "#a49f98", "#7d7870", 0.55], [700, "#f7f5ee", "#e2dccf", 0.06]];
  rows.forEach(([y, tone, dk, sm], r) => {
    // a leaf seen from the side, wiped on its upper face (top row) or its under face (bottom row)
    const lx = 190;
    line(c, [[lx - 80, y + 25], [lx, y - 10], [lx + 80, y + 30]], 40, INK); line(c, [[lx - 80, y + 25], [lx, y - 10], [lx + 80, y + 30]], 28, COL.leaf);
    cotton(c, lx, r === 0 ? y - 70 : y + 75, 34, WHITE, "#dcd6c8", 0.5);
    arrow(c, [[lx + 70, r === 0 ? y - 80 : y + 90], [lx + 135, r === 0 ? y - 80 : y + 90]], RED, 8);
    [440, 640, 840].forEach((x, i) => { shadow(c, x + 14, y + 72, 78, 16); cotton(c, x, y, 82, tone, dk, sm + i * 0.04); });
  });
};

// ---------------------------------------------------------------- e3: the soil filter
// a cut bottle: the top half upside down inside the bottom half, cotton in the neck, soil on top; x = centre line
const bottle = (c: Ctx, x: number, soilTop: number, water: number, soil: string, soilWet = false) => {
  const bl = x - 190, br = x + 190, rim = 490, bot = 930;
  const fun = () => { c.moveTo(x - 205, 290); c.lineTo(x - 205, 470); c.lineTo(x - 34, 650); c.lineTo(x - 34, 745); c.lineTo(x + 34, 745); c.lineTo(x + 34, 650); c.lineTo(x + 205, 470); c.lineTo(x + 205, 290); c.closePath(); };
  shadow(c, x + 40, bot + 8, 230, 24);
  // the bottom half, behind
  shape(c, () => rrect(c, bl, rim, 380, bot - rim, 22), "rgba(214,236,250,0.35)", 0);
  if (water > 0) shape(c, () => rrect(c, bl + 4, bot - water, 372, water - 4, 18), CLEAR, 0);
  // the top half, upside down inside, with soil
  shape(c, fun, "rgba(214,236,250,0.5)", 6);
  c.save(); c.beginPath(); fun(); c.clip();
  c.fillStyle = soil; c.fillRect(x - 220, soilTop, 440, 680 - soilTop);
  if (soilWet) { c.fillStyle = MUDDK; c.globalAlpha = 0.5; c.fillRect(x - 220, soilTop, 440, 150); c.globalAlpha = 1; }
  c.fillStyle = "rgba(60,40,20,0.25)"; c.fillRect(x + 90, soilTop, 140, 680 - soilTop);
  const r = rnd(9); for (let i = 0; i < 40; i++) { c.beginPath(); ell(c, x - 190 + r() * 380, soilTop + 20 + r() * (640 - soilTop), 7, 5); c.fillStyle = "rgba(60,40,20,0.35)"; c.fill(); }
  c.restore();
  shape(c, () => ell(c, x, soilTop, 205, 22), soilWet ? MUDDK : COL.soilDk, 5);
  // cotton plug in the neck
  shape(c, () => rrect(c, x - 40, 660, 80, 72, 30), WHITE, 5);
  shine(c, [[x - 20, 675], [x - 20, 710]], 6);
  // the funnel's wall and the bottom half's front wall over it
  shape(c, fun, "rgba(0,0,0,0)", 6);
  shape(c, () => rrect(c, bl, rim, 380, bot - rim, 22), "rgba(214,236,250,0.18)", 6);
  shape(c, () => ell(c, x, rim, 190, 18), "rgba(255,255,255,0.25)", 4);
  shine(c, [[bl + 24, rim + 40], [bl + 24, bot - 80]], 9);
};

// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  bottle(c, 540, 340, 0, COL.soil);
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  bottle(c, 440, 360, 70, COL.soil, true);
  // clearer water dripping from the neck
  drop(c, 440, 790, 13, CLEAR); drop(c, 440, 850, 10, CLEAR);
  // the glass tilted, brown water flowing over the lip into the funnel
  const lipx = 400, lipy = 240, an = -1.95, gw = 190, gh = 270;
  const P = (u: number, v: number) => [lipx + (u - 0) * Math.cos(an) - (v - 0) * Math.sin(an) + 0, lipy + u * Math.sin(an) + v * Math.cos(an)];
  // glass local: rim centre at local (0, -gh) -> placed at the lip; so shift so rim centre is at lip
  const gx = lipx - (0 * Math.cos(an) - (-gh) * Math.sin(an)), gy = lipy - (0 * Math.sin(an) + (-gh) * Math.cos(an));
  const Q = (u: number, v: number) => [gx + u * Math.cos(an) - v * Math.sin(an), gy + u * Math.sin(an) + v * Math.cos(an)];
  void P;
  const body = () => polyP(c, [Q(-gw / 2, -gh), Q(gw / 2, -gh), Q(gw * 0.4, 0), Q(-gw * 0.4, 0)]);
  shape(c, body, COL.glass, 5);
  // brown water: the part of the glass lower than the lip, level in the world
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = MUD; c.beginPath(); c.rect(-100, lipy + 20, 1400, 800); c.fill(); c.restore();
  shape(c, body, "rgba(0,0,0,0)", 5);
  line(c, [Q(-gw * 0.3, -gh * 0.9), Q(-gw * 0.2, -gh * 0.2)], 9, "rgba(255,255,255,0.7)");
  // the stream
  line(c, [[lipx, lipy + 10], [lipx + 6, lipy + 60], [lipx + 10, 345]], 26, INK); line(c, [[lipx, lipy + 10], [lipx + 6, lipy + 60], [lipx + 10, 345]], 15, MUD);
  handAt(c, gx + 0 + Q(0, -gh * 0.35)[0] - gx, Q(0, -gh * 0.35)[1], Math.PI - 0.45, 1.4);
  arrow(c, [[250, 140], [250, 235]], RED, 12);
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  // sunshine
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; line(c, [[170 + Math.cos(a) * 110, 160 + Math.sin(a) * 110], [170 + Math.cos(a) * 160, 160 + Math.sin(a) * 160]], 12, COL.orange); }
  shape(c, () => ell(c, 170, 160, 85, 85), COL.yellow, 7);
  // the steel plate with its two dried spots
  c.save(); c.translate(0, -100); shadow(c, 560, 720, 450, 150);
  shape(c, () => ell(c, 540, 560, 470, 240), COL.steel, 7);
  shape(c, () => ell(c, 540, 550, 395, 192), "#aeb8c6", 5);
  shade(c, () => ell(c, 540, 560, 470, 240), COL.steelDk, -60, -30, 0.5);
  // thick white crust, left
  const crust = () => { c.moveTo(210, 520); c.quadraticCurveTo(250, 440, 340, 455); c.quadraticCurveTo(440, 460, 450, 540); c.quadraticCurveTo(455, 640, 350, 650); c.quadraticCurveTo(230, 660, 210, 520); c.closePath(); };
  shape(c, crust, WHITE, 6); shade(c, crust, "#d6d2c8", -26, -18, 0.8);
  const r = rnd(33); for (let i = 0; i < 16; i++) shape(c, () => ell(c, 245 + r() * 180, 480 + r() * 150, 14, 10, r()), WHITE, 3);
  // faint ring, right
  c.beginPath(); ell(c, 720, 555, 115, 78); c.strokeStyle = "rgba(255,255,255,0.8)"; c.lineWidth = 9; c.stroke();
  c.beginPath(); ell(c, 720, 555, 118, 80); c.strokeStyle = "rgba(43,35,64,0.22)"; c.lineWidth = 3; c.stroke();
  c.restore();
  // what each spot came from: soil filter and tap
  c.save(); c.translate(335, 745); c.scale(0.3, 0.3); bottle(c, 0, 340, 120, COL.soil, true); c.restore();
  const tx = 720, tp = [[tx - 100, 800], [tx + 20, 800], [tx + 20, 870]];
  line(c, tp, 58, INK); line(c, tp, 44, COL.steel);
  drop(c, tx + 20, 940, 22);
};

export const su_environmentPollution = cards("sci.environment.pollution.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
