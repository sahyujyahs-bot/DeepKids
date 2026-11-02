import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, hand, person, cards } from "./flatKit";
import type { Pose } from "./flatKit";

// MY FAMILY (L1) · set-up cards and card pictures. Same girl (orange) and grown-up (blue) on every card.

// ---------------------------------------------------------------- helpers
// two-link arm: angles that put the wrist of a person's arm at (tx, ty). side -1 = left arm, 1 = right
const armTo = (x: number, y: number, h: number, side: number, tx: number, ty: number, sit = false, bend = 1): [number, number] => {
  const sh = sit ? y - h * 0.06 - h * 0.32 : y - h * 0.74, sx = x + side * h * 0.11, sy = sh + h * 0.03, l1 = h * 0.17, l2 = h * 0.16;
  const dx = tx - sx, dy = ty - sy, d = Math.max(10, Math.min(Math.hypot(dx, dy), l1 + l2 - 2)), base = Math.atan2(dy, dx);
  const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))), a1 = base - bend * a;
  const ex = sx + Math.cos(a1) * l1, ey = sy + Math.sin(a1) * l1;
  return [a1, Math.atan2(ty - ey, tx - ex)];
};
const headOf = (y: number, h: number, sit = false) => { const head = h * 0.13, sh = sit ? y - h * 0.38 : y - h * 0.74; return { hy: sh - head * 1.05, head }; };
// a dupatta tied over the eyes
const blindfold = (c: Ctx, x: number, y: number, h: number, sit = false) => {
  const { hy, head } = headOf(y, h, sit);
  shape(c, () => rrect(c, x - head * 1.08, hy - head * 0.12, head * 2.16, head * 0.5, head * 0.2), COL.pink, 5);
  line(c, [[x + head * 1.05, hy + head * 0.1], [x + head * 1.5, hy - head * 0.1]], 8, COL.pink); line(c, [[x + head * 1.05, hy + head * 0.14], [x + head * 1.45, hy + head * 0.4]], 8, COL.pink);
};
// smell rising: n wavy lines from (x, y) going up (and drifting dx)
const waft = (c: Ctx, x: number, y: number, n: number, len = 120, dx = 0, col = COL.greyDk, w = 5) => {
  for (let i = 0; i < n; i++) { const ox = x + (i - (n - 1) / 2) * 34; c.beginPath(); c.moveTo(ox, y); c.bezierCurveTo(ox - 18 + dx * 0.3, y - len * 0.35, ox + 18 + dx * 0.7, y - len * 0.65, ox + dx, y - len); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.globalAlpha = 0.8; c.stroke(); c.globalAlpha = 1; }
};
// a steel tumbler, bottom centre (x, y); a folded shirt peeping out; a paper chit under it
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, shirt?: string, chit = false) => {
  shadow(c, x + w * 0.15, y + 8, w * 0.6, w * 0.14);
  if (chit) shape(c, () => rrect(c, x - w * 0.15, y - 8, w * 0.7, 30, 4), COL.paper, 4);
  const top = w / 2, bot = w * 0.42, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.55, 0);
  shape(c, () => ell(c, x, y - h, top, w * 0.14), COL.steelIn, 5);
  if (shirt) {
    shape(c, () => { c.moveTo(x - top * 0.8, y - h); c.bezierCurveTo(x - top * 0.7, y - h - w * 0.3, x - top * 0.2, y - h - w * 0.42, x, y - h - w * 0.3); c.bezierCurveTo(x + top * 0.3, y - h - w * 0.4, x + top * 0.75, y - h - w * 0.28, x + top * 0.8, y - h); c.closePath(); }, shirt, 5);
    line(c, [[x - top * 0.3, y - h - w * 0.1], [x + top * 0.1, y - h - w * 0.22]], 3, INK);
    c.beginPath(); c.ellipse(x, y - h, top, w * 0.14, 0, 0, Math.PI); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  }
  shine(c, [[x - top * 0.7, y - h * 0.8], [x - bot * 0.75, y - h * 0.2]], 7);
};
// a T-shirt, centre (x, y), width w
const tshirt = (c: Ctx, x: number, y: number, w: number, col = COL.cloth) => {
  const h = w * 1.1;
  shape(c, () => polyP(c, [[x - w * 0.3, y - h * 0.5], [x - w * 0.12, y - h * 0.56], [x, y - h * 0.48], [x + w * 0.12, y - h * 0.56], [x + w * 0.3, y - h * 0.5], [x + w * 0.5, y - h * 0.25], [x + w * 0.36, y - h * 0.08], [x + w * 0.3, y - h * 0.14], [x + w * 0.3, y + h * 0.5], [x - w * 0.3, y + h * 0.5], [x - w * 0.3, y - h * 0.14], [x - w * 0.36, y - h * 0.08], [x - w * 0.5, y - h * 0.25]]), col);
  c.beginPath(); c.arc(x, y - h * 0.52, w * 0.12, 0.1, Math.PI - 0.1); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
// a counter or table top across the card at height y
const counter = (c: Ctx, y: number, depth = 150) => {
  shape(c, () => polyP(c, [[0, y], [D, y], [D, y + depth], [0, y + depth]]), COL.wood, 0);
  c.fillStyle = COL.woodDk; c.fillRect(0, y + depth, D, D - y - depth);
  line(c, [[0, y], [D, y]], 6); line(c, [[0, y + depth], [D, y + depth]], 6);
};
const garlic = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x, y - s); c.bezierCurveTo(x + s * 0.9, y - s * 0.4, x + s * 0.8, y + s * 0.5, x, y + s * 0.6); c.bezierCurveTo(x - s * 0.8, y + s * 0.5, x - s * 0.9, y - s * 0.4, x, y - s); c.closePath(); }, "#f3ead4", 5);
  line(c, [[x - s * 0.1, y - s * 0.8], [x - s * 0.25, y + s * 0.3]], 3, "#c9b995"); line(c, [[x + s * 0.2, y - s * 0.7], [x + s * 0.3, y + s * 0.2]], 3, "#c9b995");
};
// a child's crayon stick person
const stick = (c: Ctx, x: number, y: number, h: number, col: string) => {
  const r = h * 0.17; line(c, [[x, y - h + r * 2], [x, y - h * 0.35]], 5, col); line(c, [[x - h * 0.2, y], [x, y - h * 0.35], [x + h * 0.2, y]], 5, col); line(c, [[x - h * 0.22, y - h * 0.6], [x, y - h * 0.5], [x + h * 0.22, y - h * 0.6]], 5, col);
  c.beginPath(); ell(c, x, y - h + r, r, r); c.strokeStyle = col; c.lineWidth = 5; c.stroke();
  c.beginPath(); c.arc(x, y - h + r * 1.1, r * 0.45, 0.3, Math.PI - 0.3); c.lineWidth = 3; c.stroke();
};
const crayonHouse = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => {
  line(c, [[x - w / 2, y], [x - w / 2, y - h * 0.6], [x, y - h], [x + w / 2, y - h * 0.6], [x + w / 2, y], [x - w / 2, y]], 6, col);
  line(c, [[x - w / 2, y - h * 0.6], [x + w / 2, y - h * 0.6]], 5, col);
};
const phone = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 14, y + h * 0.5 + 12, w * 0.5, 18);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, w * 0.12), COL.black);
  shape(c, () => rrect(c, x - w * 0.44, y - h * 0.45, w * 0.88, h * 0.9, w * 0.05), WHITE, 3);
};
const microbe = (c: Ctx, x: number, y: number, r: number, col: string, rod = false, rot = 0) => {
  if (rod) shape(c, () => { c.save(); c.translate(x, y); c.rotate(rot); rrect(c, -r * 1.6, -r * 0.6, r * 3.2, r * 1.2, r * 0.6); c.restore(); }, col, 4);
  else shape(c, () => ell(c, x, y, r, r), col, 4);
  shape(c, () => ell(c, x - r * 0.25, y - r * 0.2, r * 0.18, r * 0.18), INK, 0); shape(c, () => ell(c, x + r * 0.25, y - r * 0.2, r * 0.18, r * 0.18), INK, 0);
  c.beginPath(); c.arc(x, y + r * 0.15, r * 0.3, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
};
const smile = (c: Ctx, x: number, y: number, r: number, happy = true) => {
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 4);
  shape(c, () => ell(c, x - r * 0.35, y - r * 0.2, r * 0.1, r * 0.13), INK, 0); shape(c, () => ell(c, x + r * 0.35, y - r * 0.2, r * 0.1, r * 0.13), INK, 0);
  c.beginPath(); if (happy) c.arc(x, y + r * 0.2, r * 0.4, 0.2, Math.PI - 0.2); else { c.moveTo(x - r * 0.35, y + r * 0.4); c.lineTo(x + r * 0.35, y + r * 0.4); } c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
const moonWindow = (c: Ctx, x: number, y: number) => {
  shape(c, () => rrect(c, x - 130, y - 130, 260, 260, 14), "#2e3f6e");
  shape(c, () => ell(c, x + 20, y - 10, 60, 60), COL.yellow, 5); shape(c, () => ell(c, x + 45, y - 25, 50, 50), "#2e3f6e", 0);
  for (const [sx, sy] of [[x - 80, y - 70], [x - 50, y + 60], [x + 90, y + 80]]) shape(c, () => ell(c, sx, sy, 6, 6), WHITE, 0);
  line(c, [[x - 130, y], [x + 130, y]], 6); line(c, [[x, y - 130], [x, y + 130]], 6);
};

// ---------------------------------------------------------------- set-up cards
// e1.0 · the night before: a plain cotton T-shirt to sleep in
const e1s0 = (c: Ctx) => {
  ground(c); moonWindow(c, 880, 230);
  const ay = 940, ah = 740, ax = 250, ky = 940, kh = 540, kx = 830;
  person(c, ax, ay, ah, { adult: true, armR: armTo(ax, ay, ah, 1, 470, 540, false, -1), armL: [Math.PI * 0.55, Math.PI * 0.5] });
  person(c, kx, ky, kh, { armL: armTo(kx, ky, kh, -1, 690, 580), armR: [Math.PI * 0.45, Math.PI * 0.5] });
  tshirt(c, 580, 560, 300);
  shape(c, () => ell(c, 470, 540, 24, 24), SKIN.adult, 5); shape(c, () => ell(c, 690, 580, 19, 19), SKIN.child, 5);
};
// e1.1 · the morning: each shirt in a steel tumbler, a name chit under each
const e1s1 = (c: Ctx) => {
  ground(c); counter(c, 640, 170);
  const shirts = [COL.cloth, COL.sky, COL.cloth, "#f9d6e0"];
  shirts.forEach((s, i) => tumbler(c, 180 + i * 240, 740, 170, 250, s, true));
};
// e1.2 · eyes covered, sniffing a tumbler held by the grown-up
const sniffScene = (c: Ctx, row: boolean) => {
  ground(c);
  if (row) { counter(c, 560, 100); for (let i = 0; i < 4; i++) tumbler(c, 110 + i * 150, 600, 100, 140, COL.cloth, true); }
  const kx = 340, ky = 950, kh = 600, ax = 830, ay = 950, ah = 790;
  const { hy, head } = headOf(ky, kh); const nose: [number, number] = [kx + head * 0.2, hy + head * 0.3];
  person(c, ax, ay, ah, { adult: true, armL: armTo(ax, ay, ah, -1, 575, 600, false, -1), armR: [Math.PI * 0.45, Math.PI * 0.5] });
  person(c, kx, ky, kh, { armL: [Math.PI * 0.6, Math.PI * 0.35], armR: [Math.PI * 0.4, Math.PI * 0.65] });
  blindfold(c, kx, ky, kh);
  tumbler(c, 520, 660, 150, 210, COL.cloth);
  shape(c, () => ell(c, 575, 600, 26, 26), SKIN.adult, 5);
  waft(c, 490, 420, 3, 90, -60);
  arrow(c, [[640, 300], [430, 400]], RED, 8);
  void nose;
};
const e1s2 = (c: Ctx) => sniffScene(c, false);

// e2.0 · a grown-up crushes a garlic clove under the back of a steel spoon
const e2s0 = (c: Ctx) => {
  ground(c); counter(c, 760, 140);
  shadow(c, 560, 790, 400, 30);
  shape(c, () => rrect(c, 150, 520, 780, 250, 20), COL.wood); shade(c, () => rrect(c, 150, 520, 780, 250, 20), COL.woodDk, 0, 150, 0.5);
  garlic(c, 430, 700, 70); garlic(c, 300, 660, 55);
  // the spoon, bowl pressing on the clove, handle up to the right
  line(c, [[560, 640], [820, 380]], 44, INK); line(c, [[560, 640], [820, 380]], 32, COL.steel);
  shape(c, () => ell(c, 500, 650, 110, 55, -0.3), COL.steel); shade(c, () => ell(c, 500, 650, 110, 55, -0.3), COL.steelDk, 40, 20);
  shine(c, [[420, 630], [470, 605]], 8);
  hand(c, 860, 340, Math.atan2(640 - 380, 560 - 820), 1.5, SKIN.adult, CLOTH.adult);
  arrow(c, [[330, 380], [420, 560]], RED, 10);
  waft(c, 640, 600, 2, 80, 20, COL.greenDk);
};
// e2.1 · shake hands down the line
const handLine = (c: Ctx) => {
  ground(c);
  const P: [number, number, boolean][] = [[140, 660, true], [400, 520, false], [660, 720, true], [910, 420, false]];
  const Y = 950, meet: [number, number][] = [[270, 600], [530, 640], [785, 660]];
  P.forEach(([x, h, ad], i) => {
    const p: Pose = { adult: ad };
    if (i > 0) p.armL = armTo(x, Y, h, -1, meet[i - 1][0], meet[i - 1][1], false, 1);
    if (i < 3) p.armR = armTo(x, Y, h, 1, meet[i][0], meet[i][1], false, -1);
    person(c, x, Y, h, p);
  });
  meet.forEach(([x, y], i) => { shape(c, () => ell(c, x, y, 26, 26), i % 2 ? SKIN.child : SKIN.adult, 5); });
  return { P, Y, meet };
};
const e2s1 = (c: Ctx) => {
  handLine(c);
  waft(c, 270, 560, 2, 70, 0, COL.greenDk);
  arrow(c, [[180, 150], [900, 150]], RED, 10);
};
// e2.2 · everyone sniffs their own palm
const e2s2 = (c: Ctx) => {
  ground(c);
  const kx = 480, ky = 960, kh = 640, ax = 880, ay = 960, ah = 800;
  const kn = headOf(ky, kh), an = headOf(ay, ah);
  person(c, ax, ay, ah, { adult: true, armL: armTo(ax, ay, ah, -1, ax - 120, an.hy + an.head * 1.9, false, -1), armR: [Math.PI * 0.45, Math.PI * 0.5] });
  hand(c, ax - 120, an.hy + an.head * 1.9, -Math.PI / 2 + 0.35, 0.9, SKIN.adult, CLOTH.adult, true);
  waft(c, ax - 70, an.hy + an.head * 0.9, 1, 40, 0);
  person(c, kx, ky, kh, { armR: armTo(kx, ky, kh, 1, kx + 130, kn.hy + kn.head * 1.9, false, -1), armL: [Math.PI * 0.6, Math.PI * 0.5] });
  hand(c, kx + 130, kn.hy + kn.head * 1.9, -Math.PI / 2 - 0.35, 1.1, SKIN.child, CLOTH.child, true);
  waft(c, kx + 70, kn.hy + kn.head * 0.9, 2, 60, -20);
  // puzzled brows
  line(c, [[kx - kn.head * 0.55, kn.hy - kn.head * 0.2], [kx - kn.head * 0.15, kn.hy - kn.head * 0.1]], 4); line(c, [[kx + kn.head * 0.15, kn.hy - kn.head * 0.25], [kx + kn.head * 0.55, kn.hy - kn.head * 0.3]], 4);
};

// ---------------------------------------------------------------- card pictures
const flowE1 = (c: Ctx) => sniffScene(c, true);
// four open palms: strong, a little, faint, none
const flowE2 = (c: Ctx) => {
  ground(c);
  const xs = [150, 410, 670, 930], n = [3, 2, 1, 0];
  xs.forEach((x, i) => {
    const ad = i % 2 === 0;
    hand(c, x, 900, -Math.PI / 2, 2.1, ad ? SKIN.adult : SKIN.child, ad ? CLOTH.adult : CLOTH.child, true);
    if (i === 0) garlic(c, x + 15, 740, 55);
    if (n[i]) waft(c, x + 15, 640, n[i], 160 - i * 30, 0, COL.greenDk, 7);
  });
  arrow(c, [[150, 200], [930, 200]], RED, 11);
};
// the folded home picture
const flowA1 = (c: Ctx) => {
  ground(c); counter(c, 1000, 80);
  shadow(c, 560, 850, 440, 30);
  shape(c, () => rrect(c, 120, 200, 840, 620, 10), COL.paper);
  line(c, [[540, 200], [540, 820]], 4, COL.grey);
  crayonHouse(c, 330, 720, 340, 380, COL.red);
  [[230, 700, 150, COL.blue], [300, 700, 150, COL.purple], [370, 700, 110, COL.orange], [430, 700, 90, COL.green]].forEach(([x, y, h, col]) => stick(c, x as number, y as number, h as number, col as string));
  [[700, 600, 140, COL.teal], [790, 600, 110, COL.pink]].forEach(([x, y, h, col]) => stick(c, x as number, y as number, h as number, col as string));
  shape(c, () => rrect(c, 820, 650, 70, 120, 10), COL.black); shape(c, () => rrect(c, 830, 665, 50, 90, 4), COL.sky, 2);
  c.setLineDash([14, 14]); line(c, [[520, 560], [700, 480], [850, 640]], 5, COL.blue); c.setLineDash([]);
  hand(c, 980, 980, Math.atan2(-250, -200), 1.3, SKIN.child, CLOTH.child);
  line(c, [[855, 870], [760, 760]], 18, INK); line(c, [[855, 870], [760, 760]], 10, COL.green);
};
// a bean into one of two bowls
const flowA2 = (c: Ctx) => {
  ground(c); counter(c, 780, 120);
  bowl(c, 320, 720, 160); bowl(c, 780, 720, 160);
  const r = rnd(5); for (let i = 0; i < 8; i++) { const x = 480 + r() * 130, y = 840 + r() * 50; shape(c, () => ell(c, x, y, 20, 12, r() * 3), COL.red, 4); }
  shape(c, () => rrect(c, 250, 820, 140, 110, 10), COL.paper, 5); smile(c, 320, 875, 36, true);
  shape(c, () => rrect(c, 710, 820, 140, 110, 10), COL.paper, 5); smile(c, 780, 875, 36, false);
  hand(c, 260, 290, Math.PI / 2 - 0.2, 1.4, SKIN.child, CLOTH.child);
  shape(c, () => ell(c, 300, 520, 22, 13, 0.4), COL.red, 4);
  arrow(c, [[300, 560], [310, 680]], RED, 9);
};
// a baby photo on a phone, child and grandmother looking
const flowP1 = (c: Ctx) => {
  ground(c);
  const kx = 230, ky = 960, kh = 580, ax = 860, ay = 960, ah = 780;
  person(c, ax, ay, ah, { adult: true, armL: armTo(ax, ay, ah, -1, 700, 540, false, -1), armR: [Math.PI * 0.45, Math.PI * 0.5] });
  person(c, kx, ky, kh, { armR: armTo(kx, ky, kh, 1, 390, 600, false, -1), armL: [Math.PI * 0.6, Math.PI * 0.5] });
  phone(c, 545, 520, 320, 540);
  // baby in a cradle on the screen
  shape(c, () => rrect(c, 430, 560, 230, 150, 30), COL.wood); shade(c, () => rrect(c, 430, 560, 230, 150, 30), COL.woodDk, 60, 0);
  shape(c, () => rrect(c, 450, 560, 190, 80, 20), COL.pink, 5);
  shape(c, () => ell(c, 545, 480, 70, 72), SKIN.child); shape(c, () => ell(c, 545, 430, 40, 20), CLOTH.hair, 0);
  shape(c, () => ell(c, 520, 485, 7, 9), INK, 0); shape(c, () => ell(c, 570, 485, 7, 9), INK, 0);
  c.beginPath(); c.arc(545, 505, 22, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  shape(c, () => ell(c, 390, 600, 22, 22), SKIN.child, 5); shape(c, () => ell(c, 700, 540, 26, 26), SKIN.adult, 5);
};
// the family drawing standing up on its cardboard triangle
const flowC1 = (c: Ctx) => {
  ground(c); counter(c, 760, 160);
  shadow(c, 600, 775, 320, 24);
  shape(c, () => polyP(c, [[655, 480], [655, 760], [800, 760]]), COL.brown); shade(c, () => polyP(c, [[655, 480], [655, 760], [800, 760]]), COL.soilDk, 40, 0, 0.35);
  shape(c, () => rrect(c, 300, 300, 360, 460, 8), COL.paper);
  crayonHouse(c, 480, 700, 280, 300, COL.red);
  [[400, 690, 130, COL.blue], [460, 690, 130, COL.purple], [520, 690, 95, COL.orange], [570, 690, 75, COL.green]].forEach(([x, y, h, col]) => stick(c, x as number, y as number, h as number, col as string));
  shape(c, () => rrect(c, 620, 500, 50, 90, 6), "#d8c39a", 4);
};
// family eating together on a mat
const term0 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 930, 480, 40);
  shape(c, () => rrect(c, 60, 700, 960, 220, 20), COL.purple); shade(c, () => rrect(c, 60, 700, 960, 220, 20), "#6b4fa8", 0, 110, 0.5);
  const S: [number, number, boolean][] = [[150, 640, true], [400, 600, true], [660, 470, false], [900, 380, false]];
  S.forEach(([x, h, ad]) => person(c, x, 820, h, { adult: ad, sit: true, armL: [Math.PI * 0.6, Math.PI * 0.2], armR: [Math.PI * 0.5, Math.PI * 0.8] }));
  S.forEach(([x, h]) => { const px = x + h * 0.22; plate(c, px, 890, 90, 36); shape(c, () => ell(c, px - 10, 880, 55, 22), COL.yellow, 4); shape(c, () => ell(c, px + 45, 886, 18, 10), COL.cloth, 3); });
};
// sniffing the steam from a pot of sambar
const term3 = (c: Ctx) => {
  ground(c); counter(c, 760, 140);
  shape(c, () => rrect(c, 300, 720, 420, 50, 10), COL.black); for (let i = 0; i < 3; i++) shape(c, () => ell(c, 400 + i * 110, 745, 22, 10), COL.orange, 3);
  shadow(c, 540, 720, 230, 30);
  shape(c, () => rrect(c, 330, 520, 420, 200, 30), COL.steel); shade(c, () => rrect(c, 330, 520, 420, 200, 30), COL.steelDk, 150, 0);
  shape(c, () => ell(c, 540, 520, 210, 44), COL.steelIn); shape(c, () => ell(c, 540, 520, 190, 36), "#e5892f", 4);
  line(c, [[330, 600], [260, 600]], 26, INK); line(c, [[330, 600], [270, 600]], 16, COL.steel); line(c, [[750, 600], [820, 600]], 26, INK); line(c, [[750, 600], [810, 600]], 16, COL.steel);
  const kx = 870, ky = 960, kh = 620, { hy, head } = headOf(ky, kh);
  person(c, kx, ky, kh, { armL: [Math.PI * 0.7, Math.PI * 0.4], armR: [Math.PI * 0.4, Math.PI * 0.6] });
  waft(c, 600, 490, 3, 200, 180, COL.greyDk, 7);
  c.beginPath(); c.moveTo(640, 380); c.bezierCurveTo(700, 330, 760, 380, kx - head * 1.2, hy + head * 0.3); c.strokeStyle = COL.greyDk; c.lineWidth = 6; c.globalAlpha = 0.8; c.stroke(); c.globalAlpha = 1;
};
// microbes on a hand, zoomed in a bubble
const term4 = (c: Ctx) => {
  ground(c);
  const x = 400, y = 720;
  shape(c, () => rrect(c, x - 120, y + 160, 240, 140, 30), CLOTH.child); shade(c, () => rrect(c, x - 120, y + 160, 240, 140, 30), CLOTH.childDk, 60, 0);
  shape(c, () => rrect(c, x - 190, y - 150, 380, 330, 80), SKIN.child);
  const F = [[-135, 150, 60], [-50, 190, 62], [35, 180, 62], [120, 140, 56]];
  F.forEach(([fx, fh, fw]) => shape(c, () => rrect(c, x + fx - fw / 2, y - 150 - fh + 30, fw, fh + 50, fw / 2), SKIN.child, 5));
  shape(c, () => { c.save(); c.translate(x + 200, y + 10); c.rotate(-0.9); rrect(c, -34, -100, 68, 170, 34); c.restore(); }, SKIN.child, 5);
  shape(c, () => rrect(c, x - 190, y - 150, 380, 330, 80), SKIN.child, 0);
  line(c, [[x - 90, y + 40], [x - 20, y - 20]], 4, SKIN.childDk); line(c, [[x - 60, y + 110], [x + 40, y + 20]], 4, SKIN.childDk);
  shape(c, () => ell(c, x - 20, y - 40, 22, 22), "rgba(255,255,255,0)", 5);
  line(c, [[x - 4, y - 56], [560, 310]], 5); line(c, [[x - 6, y - 24], [560, 540]], 5);
  shape(c, () => ell(c, 760, 420, 220, 220), COL.sky, 7);
  const M: [number, number, number, string, boolean, number][] = [[680, 340, 28, COL.teal, false, 0], [800, 300, 24, COL.pink, false, 0], [860, 420, 26, COL.green, false, 0], [700, 470, 22, COL.purple, true, 0.6], [790, 520, 24, COL.orange, true, -0.3], [640, 430, 20, COL.yellow, false, 0], [760, 400, 20, COL.teal, true, 1.2]];
  M.forEach(([mx, my, r, col, rod, rot]) => microbe(c, mx, my, r, col, rod, rot));
};
// grandmother and the boy hugging, microbes passing between them
const expl3 = (c: Ctx) => {
  ground(c);
  const ax = 420, ay = 960, ah = 760, kx = 700, ky = 960, kh = 520;
  person(c, kx, ky, kh, { armL: armTo(kx, ky, kh, -1, 480, 700, false, -1), armR: [Math.PI * 0.45, Math.PI * 0.5] });
  person(c, ax, ay, ah, { adult: true, armR: armTo(ax, ay, ah, 1, 720, 660, false, 1), armL: [Math.PI * 0.55, Math.PI * 0.5] });
  shape(c, () => ell(c, 720, 660, 26, 26), SKIN.adult, 5);
  c.globalAlpha = 0.55; shape(c, () => ell(c, 560, 380, 150, 110, -0.6), WHITE, 0); c.globalAlpha = 1;
  const M: [number, number, number, string, boolean, number][] = [[480, 300, 16, COL.teal, false, 0], [540, 360, 14, COL.pink, true, 0.5], [600, 310, 15, COL.green, false, 0], [620, 420, 14, COL.purple, true, -0.4], [520, 440, 15, COL.orange, false, 0], [660, 480, 13, COL.yellow, false, 0]];
  M.forEach(([mx, my, r, col, rod, rot]) => microbe(c, mx, my, r, col, rod, rot));
  arrow(c, [[470, 240], [620, 250]], RED, 7); arrow(c, [[650, 520], [540, 520]], RED, 7);
};

export const ic_familyFamilyL1 = cards("sci.family.family.L1", [
  e1s0, e1s1, e1s2, e2s0, e2s1, e2s2,
  flowE1, flowE2, flowA1, flowA2, flowP1, flowC1, term0, term3, term4, expl3,
]);
