import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, plate, hand, person, cards } from "./flatKit";

// REVERSIBLE AND IRREVERSIBLE CHANGES (L2) · flat set-up cards and card pictures: dough squashed,
// frozen and cooked; a ruler, foil and a toothpick bent; paper crumpled; a dosa made from batter.

const DOUGH = "#ead2a6", DOUGHDK = "#c9a977", ROTI = "#e6b874", ROTIDK = "#c08d4a", SPOT = "#8a5a3c", TAWA = "#3a3540", TAWADK = "#221d2a";
const PI = Math.PI;
type P = number[];

// a ball of dough (or anything round), centre (x, y)
const ball = (c: Ctx, x: number, y: number, r: number, col = DOUGH, dk = DOUGHDK) => {
  shadow(c, x + r * 0.15, y + r * 0.98, r * 0.9, r * 0.2);
  shape(c, () => ell(c, x, y, r, r * 0.92), col);
  shade(c, () => ell(c, x, y, r, r * 0.92), dk, -r * 0.28, -r * 0.28);
  shine(c, [[x - r * 0.55, y - r * 0.4], [x - r * 0.3, y - r * 0.62]], 8);
};
// a flat disc lying on a surface, centre (x, y)
const disc = (c: Ctx, x: number, y: number, rx: number, ry: number, col = DOUGH, dk = DOUGHDK) => {
  shadow(c, x + rx * 0.08, y + ry * 0.45, rx, ry * 0.8);
  shape(c, () => ell(c, x, y, rx, ry), col);
  shade(c, () => ell(c, x, y, rx, ry), dk, -rx * 0.12, -ry * 0.3);
};
// brown spots on a cooked roti or dosa
const spots = (c: Ctx, x: number, y: number, rx: number, ry: number, seed: number, n = 9) => {
  const r = rnd(seed);
  for (let i = 0; i < n; i++) { const a = r() * PI * 2, d = Math.sqrt(r()) * 0.75; shape(c, () => ell(c, x + Math.cos(a) * rx * d, y + Math.sin(a) * ry * d, 10 + r() * 12, 7 + r() * 8), SPOT, 0); }
};
const roti = (c: Ctx, x: number, y: number, rx: number, ry: number, seed = 3) => { disc(c, x, y, rx, ry, ROTI, ROTIDK); spots(c, x, y, rx, ry, seed); };
// a frosty disc from the freezer
const frosty = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  disc(c, x, y, rx, ry, COL.sky, COL.steelDk);
  const r = rnd(5);
  for (let i = 0; i < 14; i++) { const a = r() * PI * 2, d = Math.sqrt(r()) * 0.8; shape(c, () => ell(c, x + Math.cos(a) * rx * d, y + Math.sin(a) * ry * d, 7, 5), WHITE, 0); }
};
// a long bar (ruler, stick, strip) bent along a quadratic curve p0 -> cp -> p1; ticks for a ruler
const bentBar = (c: Ctx, p0: P, cp: P, p1: P, w: number, col: string, ticks = false) => {
  const path = () => { c.moveTo(p0[0], p0[1]); c.quadraticCurveTo(cp[0], cp[1], p1[0], p1[1]); };
  c.beginPath(); path(); c.lineCap = "butt"; c.lineJoin = "round"; c.strokeStyle = INK; c.lineWidth = w + 10; c.stroke();
  c.beginPath(); path(); c.strokeStyle = col; c.lineWidth = w; c.stroke();
  if (ticks) for (let i = 1; i < 24; i++) {
    const t = i / 24, u = 1 - t, x = u * u * p0[0] + 2 * u * t * cp[0] + t * t * p1[0], y = u * u * p0[1] + 2 * u * t * cp[1] + t * t * p1[1];
    const dx = 2 * u * (cp[0] - p0[0]) + 2 * t * (p1[0] - cp[0]), dy = 2 * u * (cp[1] - p0[1]) + 2 * t * (p1[1] - cp[1]), l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l, h = i % 4 === 0 ? w * 0.55 : w * 0.3;
    line(c, [[x - nx * w * 0.5, y - ny * w * 0.5], [x - nx * (w * 0.5 - h), y - ny * (w * 0.5 - h)]], 3);
  }
};
const RULER = "rgba(170,210,245,0.9)";
// two hands gripping the ends of something: left grip at (lx, ly), right grip at (rx, ry)
const twoHands = (c: Ctx, lx: number, ly: number, rx: number, ry: number, open = false, s = 1.9) => {
  hand(c, lx - 70 * s, ly, 0, s, SKIN.child, CLOTH.child, open);
  hand(c, rx + 70 * s, ry, PI, s, SKIN.child, CLOTH.child, open);
};
// a tawa (flat black pan) seen at an angle, with a handle to the right and flames below
const tawa = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  for (let i = -2; i <= 2; i++) { const fx = x + i * rx * 0.3, fy = y + ry * 0.9; shape(c, () => { c.moveTo(fx, fy - 70); c.quadraticCurveTo(fx + 40, fy - 20, fx + 24, fy + 30); c.quadraticCurveTo(fx, fy + 48, fx - 24, fy + 30); c.quadraticCurveTo(fx - 40, fy - 20, fx, fy - 70); c.closePath(); }, COL.orange, 5); shape(c, () => ell(c, fx, fy + 10, 10, 20), COL.yellow, 0); }
  shape(c, () => rrect(c, x + rx * 0.9, y - 22, rx * 0.4, 44, 20), TAWA);
  shadow(c, x + 20, y + ry * 0.3, rx, ry);
  shape(c, () => ell(c, x, y, rx, ry), TAWA);
  shape(c, () => ell(c, x, y - 6, rx * 0.9, ry * 0.86), TAWADK, 0);
  shine(c, [[x - rx * 0.7, y - ry * 0.3], [x - rx * 0.35, y - ry * 0.65]], 7);
};
// a steel box (dabba) with a disc of dough in it; open top at (x, y)
const dabba = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 10, y + h + 10, w * 0.6, 18);
  shape(c, () => rrect(c, x - w / 2, y, w, h, 14), COL.steel);
  shade(c, () => rrect(c, x - w / 2, y, w, h, 14), COL.steelDk, -w * 0.12, 0);
  shape(c, () => ell(c, x, y, w / 2, h * 0.28), COL.steelIn, 5);
  disc(c, x, y + 6, w * 0.4, h * 0.2);
};
const foilStrip = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 8, y + h + 8, w * 0.7, 10); shape(c, () => rrect(c, x, y, w, h, 6), COL.steel); shade(c, () => rrect(c, x, y, w, h, 6), COL.steelDk, -w * 0.3, 0); shine(c, [[x + w * 0.3, y + h * 0.1], [x + w * 0.3, y + h * 0.5]], 6); };
const toothpick = (c: Ctx, x: number, y0: number, y1: number) => { shape(c, () => polyP(c, [[x, y0], [x + 9, y0 + 30], [x + 9, y1 - 30], [x, y1], [x - 9, y1 - 30], [x - 9, y0 + 30]]), COL.wood, 4); };
// a sheet of paper flat on the table, creased all over if creased
const sheet = (c: Ctx, x: number, y: number, w: number, h: number, creased: boolean) => {
  shadow(c, x + w / 2 + 14, y + h + 10, w * 0.5, 14);
  shape(c, () => rrect(c, x, y, w, h, 6), COL.paper);
  c.strokeStyle = COL.sky; c.lineWidth = 3; for (let i = 1; i < 9; i++) { c.beginPath(); c.moveTo(x + 20, y + i * h / 9); c.lineTo(x + w - 20, y + i * h / 9); c.stroke(); }
  if (creased) { const r = rnd(21); c.strokeStyle = COL.grey; c.lineWidth = 3; for (let i = 0; i < 40; i++) { const ax = x + r() * w, ay = y + r() * h; c.beginPath(); c.moveTo(ax, ay); c.lineTo(ax + (r() - 0.5) * 160, ay + (r() - 0.5) * 160); c.stroke(); } }
};
// a crumpled ball of paper
const paperBall = (c: Ctx, x: number, y: number, r: number) => {
  const rd = rnd(8), pts: P[] = []; for (let i = 0; i < 14; i++) { const a = (i / 14) * PI * 2, d = r * (0.8 + rd() * 0.25); pts.push([x + Math.cos(a) * d, y + Math.sin(a) * d]); }
  shadow(c, x + r * 0.15, y + r * 1.02, r * 0.9, r * 0.2);
  shape(c, () => polyP(c, pts), COL.paper);
  shade(c, () => polyP(c, pts), COL.grey, -r * 0.3, -r * 0.3, 0.45);
  for (let i = 0; i < 7; i++) line(c, [pts[i * 2], [x + (rd() - 0.5) * r * 0.6, y + (rd() - 0.5) * r * 0.6]], 3, COL.greyDk);
};
// a glass jar of ghee
const gheeJar = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 8, y + 8, w * 0.6, 14);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 18), COL.yellow);
  shade(c, () => rrect(c, x - w / 2, y - h, w, h, 18), COL.orange, -w * 0.25, 0, 0.5);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 18), COL.glass, 6);
  shape(c, () => rrect(c, x - w / 2 - 6, y - h - 40, w + 12, 52, 10), COL.red);
  shine(c, [[x - w * 0.3, y - h * 0.8], [x - w * 0.3, y - h * 0.4]], 7);
};
const dosaOn = (c: Ctx, x: number, y: number, rx: number, ry: number) => { shape(c, () => ell(c, x, y, rx, ry), ROTI, 5); shade(c, () => ell(c, x, y, rx, ry), ROTIDK, -rx * 0.1, -ry * 0.25, 0.4); spots(c, x, y, rx, ry, 11, 14); };

// ---------------------------------------------------------------- set-up cards
// e1 step 1: a dough ball on a steel plate, a butter knife cutting it into three
const e1s0 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 660, 430, 190);
  ball(c, 540, 560, 150);
  line(c, [[540, 420], [548, 560], [470, 690]], 5); line(c, [[548, 560], [640, 680]], 5);
  shape(c, () => polyP(c, [[520, 130], [560, 130], [562, 300], [560, 420], [540, 432], [520, 420]]), COL.steel);
  shape(c, () => rrect(c, 512, 60, 56, 90, 14), INK);
  arrow(c, [[680, 200], [680, 400]]);
};
// e1 step 2: the child's palm squashing a piece flat, then a dough snake
const e1s1 = (c: Ctx) => {
  ground(c);
  disc(c, 300, 660, 170, 60);
  hand(c, 300, 385, PI / 2, 2.2, SKIN.child, CLOTH.child, true);
  arrow(c, [[520, 340], [520, 560]]);
  arrow(c, [[520, 680], [640, 680]]);
  const snake: P[] = [[680, 760], [760, 700], [860, 790], [960, 720]];
  line(c, snake, 70, INK); line(c, snake, 58, DOUGH); line(c, [[690, 740], [760, 690]], 8, "rgba(255,255,255,0.6)");
};
// e1 step 3: the dough disc in a steel box, going into the freezer
const e1s2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 540, 120, 480, 820, 20), COL.steelIn);
  shade(c, () => rrect(c, 540, 120, 480, 820, 20), COL.steelDk, -40, -40, 0.3);
  shape(c, () => rrect(c, 590, 170, 390, 720, 10), COL.sky, 5);
  line(c, [[590, 420], [980, 420]], 6); line(c, [[590, 660], [980, 660]], 6);
  const r = rnd(2); for (let i = 0; i < 30; i++) shape(c, () => ell(c, 610 + r() * 350, 190 + r() * 680, 6, 6), WHITE, 0);
  dabba(c, 260, 600, 300, 130);
  arrow(c, [[300, 520], [540, 520], [720, 520]]);
};
// e1 step 4: a grown-up's hand turns the disc on a hot tawa
const e1s3 = (c: Ctx) => {
  ground(c);
  tawa(c, 540, 640, 400, 170);
  roti(c, 560, 600, 180, 80, 4);
  hand(c, 257, 493, 0.5, 2, SKIN.adult, CLOTH.adult);
  arrow(c, [[640, 440], [740, 410], [830, 460], [860, 540]]);
};
// e1 step 5: the three pieces side by side: soft ball, frosty disc, cooked roti
const e1s4 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 640, 480, 210);
  ball(c, 270, 600, 95);
  frosty(c, 540, 630, 135, 52);
  roti(c, 820, 620, 125, 52, 6);
};
// e2 step 1: six things in a row: ruler, broom stick, foil strip, paper clip, eraser, toothpick
const e2s0 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 860, 420, 30);
  bentBar(c, [150, 280], [150, 540], [150, 800], 64, RULER, true);
  bentBar(c, [310, 260], [310, 540], [310, 820], 16, COL.brown);
  foilStrip(c, 420, 300, 70, 480);
  const px = 620, py = 540; line(c, [[px - 24, py + 70], [px - 24, py - 60], [px + 24, py - 60], [px + 24, py + 60], [px - 10, py + 60], [px - 10, py - 30]], 22, INK); line(c, [[px - 24, py + 70], [px - 24, py - 60], [px + 24, py - 60], [px + 24, py + 60], [px - 10, py + 60], [px - 10, py - 30]], 12, COL.steel);
  shape(c, () => rrect(c, 740, 450, 90, 180, 14), COL.pink); shade(c, () => rrect(c, 740, 450, 90, 180, 14), COL.red, -20, -20, 0.35);
  toothpick(c, 960, 380, 700);
};
// e2 step 2: two hands gently bending the ruler
const e2s1 = (c: Ctx) => {
  ground(c);
  bentBar(c, [300, 620], [540, 330], [780, 620], 64, RULER, true);
  twoHands(c, 310, 625, 770, 625);
  arrow(c, [[540, 470], [540, 400]], RED, 10); // hands push the ends; the middle bows up
};
// e2 step 3: letting go: the ruler straight again, the foil strip still bent
const e2s2 = (c: Ctx) => {
  ground(c);
  bentBar(c, [300, 500], [540, 500], [780, 500], 64, RULER, true);
  twoHands(c, 290, 440, 790, 440, true);
  shadow(c, 560, 900, 260, 20);
  bentBar(c, [360, 880], [540, 660], [720, 880], 52, COL.steel);
};

// ---------------------------------------------------------------- card pictures
// flow.e1: dough can be cooked into a roti, but a roti cannot go back to dough
const fE1 = (c: Ctx) => {
  ground(c);
  ball(c, 270, 440, 140);
  arrow(c, [[440, 440], [620, 440]]);
  roti(c, 820, 450, 180, 80, 8);
  arrow(c, [[780, 720], [340, 720]], COL.greyDk, 10);
  line(c, [[500, 660], [620, 780]], 14, RED); line(c, [[620, 660], [500, 780]], 14, RED);
};
// flow.e2: the ruler springs back, the foil stays bent, the toothpick breaks
const fE2 = (c: Ctx) => {
  ground(c);
  bentBar(c, [140, 240], [140, 540], [140, 840], 64, RULER, true);
  bentBar(c, [430, 860], [560, 240], [700, 860], 52, COL.steel);
  toothpick(c, 880, 240, 520); c.save(); c.translate(900, 560); c.rotate(0.45); toothpick(c, 0, 0, 300); c.restore();
  line(c, [[850, 525], [930, 560]], 7, RED); line(c, [[930, 525], [850, 560]], 7, RED);
};
// flow.a1: crumpled paper, then flattened: the creases stay
const fA1 = (c: Ctx) => {
  ground(c);
  paperBall(c, 270, 540, 150);
  arrow(c, [[450, 540], [580, 540]]);
  sheet(c, 620, 240, 380, 600, true);
};
// flow.a2: the child's fist squeezes a slice of bread; sponge and foil ball beside
const fA2 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 720, 470, 200);
  shape(c, () => rrect(c, 180, 620, 220, 110, 18), COL.yellow); shade(c, () => rrect(c, 180, 620, 220, 110, 18), COL.orange, -30, -20, 0.4); shape(c, () => rrect(c, 180, 600, 220, 36, 8), COL.green, 5);
  const r = rnd(3); for (let i = 0; i < 12; i++) shape(c, () => ell(c, 200 + r() * 180, 650 + r() * 60, 7, 5), COL.orange, 0);
  shape(c, () => { c.moveTo(460, 690); c.lineTo(460, 560); c.quadraticCurveTo(470, 500, 540, 530); c.quadraticCurveTo(610, 500, 620, 560); c.lineTo(620, 690); c.closePath(); }, COL.brown);
  shape(c, () => { c.moveTo(480, 672); c.lineTo(480, 570); c.quadraticCurveTo(490, 530, 540, 550); c.quadraticCurveTo(590, 530, 600, 570); c.lineTo(600, 672); c.closePath(); }, COL.paper, 0);
  ball(c, 820, 650, 85, COL.steel, COL.steelDk);
  hand(c, 540, 350, PI / 2, 2.2, SKIN.child, CLOTH.child);
  arrow(c, [[740, 300], [740, 480]]);
};
// flow.a3: batter poured from a ladle on to a hot tawa becomes a dosa
const fA3 = (c: Ctx) => {
  ground(c);
  tawa(c, 540, 680, 420, 180);
  dosaOn(c, 540, 650, 290, 125);
  shape(c, () => ell(c, 540, 650, 110, 46), COL.paper, 4);
  shape(c, () => polyP(c, [[640, 300], [660, 290], [660, 630], [640, 630]]), COL.paper, 4);
  line(c, [[700, 290], [960, 130]], 34, INK); line(c, [[700, 290], [960, 130]], 22, COL.steel);
  shape(c, () => { c.moveTo(560, 240); c.bezierCurveTo(570, 340, 730, 340, 740, 240); c.closePath(); }, COL.steel);
  shape(c, () => ell(c, 650, 240, 90, 24), COL.paper, 5);
};
// flow.a4: the child looks along a kitchen shelf: ice tray, ghee jar, papad packet
const fA4 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 520, 660, 36, 6), COL.wood); shade(c, () => rrect(c, 60, 520, 660, 36, 6), COL.woodDk, 0, -14, 0.6);
  shape(c, () => rrect(c, 110, 420, 230, 100, 10), COL.blue);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) shape(c, () => rrect(c, 124 + i * 54, 432 + j * 42, 44, 34, 6), COL.sky, 3);
  gheeJar(c, 450, 520, 150, 220);
  shape(c, () => rrect(c, 560, 330, 150, 190, 14), COL.pink); shade(c, () => rrect(c, 560, 330, 150, 190, 14), COL.red, -24, -24, 0.3);
  for (let i = 0; i < 3; i++) shape(c, () => ell(c, 635, 380 + i * 55, 44, 18), ROTI, 4);
  person(c, 880, 950, 720, { armL: [PI * 0.92, PI * 0.98], armR: [PI * 0.45, PI * 0.5] });
};
// flow.p1: the change diary: a little book, an ice cube in one box and a dosa in the other
const fP1 = (c: Ctx) => {
  ground(c);
  for (const [dx, dy] of [[70, 60], [35, 30]]) shape(c, () => rrect(c, 240 + dx, 160 + dy, 600, 740, 12), COL.paper);
  shadow(c, 560, 920, 300, 20);
  shape(c, () => rrect(c, 240, 160, 600, 740, 12), COL.paper);
  line(c, [[240, 530], [840, 530]], 6);
  for (let i = 0; i < 3; i++) shape(c, () => ell(c, 270, 300 + i * 230, 9, 9), INK, 0);
  const ix = 540, iy = 350, s = 110;
  shape(c, () => polyP(c, [[ix - s, iy - s * 0.5], [ix, iy - s], [ix + s, iy - s * 0.5], [ix + s, iy + s * 0.5], [ix, iy + s], [ix - s, iy + s * 0.5]]), COL.sky);
  line(c, [[ix - s, iy - s * 0.5], [ix, iy], [ix + s, iy - s * 0.5]], 6); line(c, [[ix, iy], [ix, iy + s]], 6);
  shade(c, () => polyP(c, [[ix, iy], [ix + s, iy - s * 0.5], [ix + s, iy + s * 0.5], [ix, iy + s]]), COL.waterDk, 0, 0, 0.35);
  shine(c, [[ix - 70, iy - 20], [ix - 40, iy - 50]], 8);
  dosaOn(c, 540, 720, 230, 120);
};
// term: squash: the child's palm presses a dough ball flat
const tSquash = (c: Ctx) => {
  ground(c);
  disc(c, 540, 720, 270, 85);
  hand(c, 540, 380, PI / 2, 2.6, SKIN.child, CLOTH.child, true);
  arrow(c, [[880, 360], [880, 600]]);
};
// term: bend: two hands bend a broom stick into a curve
const tBend = (c: Ctx) => {
  ground(c);
  bentBar(c, [280, 640], [540, 300], [800, 640], 22, COL.brown);
  twoHands(c, 290, 645, 790, 645);
  arrow(c, [[200, 520], [240, 420]], RED, 9); arrow(c, [[880, 520], [840, 420]], RED, 9);
};
// term: stretch: two hands pull a dough snake longer, thin in the middle
const tStretch = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 640, 300, 24);
  shape(c, () => { c.moveTo(290, 500); c.quadraticCurveTo(540, 560, 790, 500); c.lineTo(790, 620); c.quadraticCurveTo(540, 565, 290, 620); c.closePath(); }, DOUGH);
  shade(c, () => { c.moveTo(290, 500); c.quadraticCurveTo(540, 560, 790, 500); c.lineTo(790, 620); c.quadraticCurveTo(540, 565, 290, 620); c.closePath(); }, DOUGHDK, 0, -20, 0.5);
  twoHands(c, 300, 560, 780, 560, false, 1.8);
  arrow(c, [[260, 380], [110, 380]]); arrow(c, [[820, 380], [970, 380]]);
};

export const ic_changesReversibleAndIrreversibleL2 = cards("sci.changes.reversible-and-irreversible.L2", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, // setup.e1.0-4, setup.e2.0-2
  fE1, fE2, fA1, fA2, fA3, fA4, fP1, tSquash, tBend, tStretch, // flow.e1, flow.e2, flow.a1, flow.a2, flow.a3, flow.a4, flow.p1, term.1, term.2, term.4
]);
