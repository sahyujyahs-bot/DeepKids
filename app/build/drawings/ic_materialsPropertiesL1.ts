import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, plate, leaf, hand, person, cards } from "./flatKit";

// MATERIALS · PROPERTIES L1 · set-up cards and card pictures for the torch spot test, the paper
// bridge, the touch hunt, crayon rubbings, the gentle bend, the feel book, and the term pictures.
// Same child (orange top, side bun) and grown-up (blue top) on every card. Light from the upper left.

// ---------------------------------------------------------------- rooms and light
const room = (c: Ctx, dim = false) => {
  ground(c, dim ? "#a98a58" : COL.wood);
  c.fillStyle = dim ? "#6f7190" : "#f7efe0"; c.fillRect(0, 0, D, 600);
  line(c, [[0, 600], [D, 600]], 6);
  c.fillStyle = dim ? "#7d6238" : COL.woodDk; c.fillRect(0, 1000, D, 80); line(c, [[0, 1000], [D, 1000]], 5);
};
const curtain = (c: Ctx, x: number, w: number) => {
  shape(c, () => polyP(c, [[x, -10], [x + w, -10], [x + w, 600], [x, 600]]), "#3f4a7a");
  for (let i = 1; i < 4; i++) line(c, [[x + (i * w) / 4, 0], [x + (i * w) / 4 + 10, 600]], 4, "#2e3860");
};
// a torch, its middle at (x, y), lens pointing along an
const torch = (c: Ctx, x: number, y: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -75, -28, 150, 56, 14), COL.greyDk);
  shape(c, () => polyP(c, [[75, -34], [118, -48], [118, 48], [75, 34]]), COL.grey);
  shape(c, () => polyP(c, [[118, -48], [128, -48], [128, 48], [118, 48]]), COL.yellow, 5);
  c.restore();
};
// a translucent beam of light from (x0, y0) (half-width w0) to (x1, y1) (half-width w1)
const beam = (c: Ctx, x0: number, y0: number, x1: number, y1: number, w0: number, w1: number, alpha = 0.45) => {
  const an = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(an), ny = Math.cos(an);
  c.globalAlpha = alpha; shape(c, () => polyP(c, [[x0 + nx * w0, y0 + ny * w0], [x1 + nx * w1, y1 + ny * w1], [x1 - nx * w1, y1 - ny * w1], [x0 - nx * w0, y0 - ny * w0]]), COL.yellow, 0); c.globalAlpha = 1;
};
const spot = (c: Ctx, x: number, y: number, r: number, alpha = 1) => {
  c.globalAlpha = alpha; shape(c, () => ell(c, x, y, r, r * 0.82), COL.yellow, 0); shape(c, () => ell(c, x, y, r * 0.6, r * 0.5), "#fff6c4", 0); c.globalAlpha = 1;
};
// the grown-up's hand holding the torch, wrist at (wx, wy); returns the lens tip
const torchHand = (c: Ctx, wx: number, wy: number, an: number) => {
  torch(c, wx + Math.cos(an) * 77, wy + Math.sin(an) * 77, an);
  hand(c, wx, wy, an, 1.1, SKIN.adult, CLOTH.adult);
};
const tip = (wx: number, wy: number, an: number) => [wx + Math.cos(an) * 205, wy + Math.sin(an) * 205];
// where a person's wrist ends up for a pose (standing)
const wristAt = (x: number, y: number, h: number, side: number, a1: number, a2: number) => {
  const sx = x + side * h * 0.11, sy = y - h * 0.74 + h * 0.03, ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};
const mist = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  c.globalAlpha = 0.8; shape(c, () => ell(c, x, y, rx, ry), WHITE, 0); c.globalAlpha = 0.5; shape(c, () => ell(c, x, y, rx * 1.15, ry * 1.15), WHITE, 0); c.globalAlpha = 1;
};
const breath = (c: Ctx, x0: number, y0: number, x1: number, y1: number) => {
  for (let i = 0; i < 6; i++) { const t = i / 5, r = 16 + t * 44; c.globalAlpha = 0.85; shape(c, () => ell(c, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, r, r * 0.8), WHITE, 3); }
  c.globalAlpha = 1;
};

// ---------------------------------------------------------------- paper, books, coins
const pile = (c: Ctx, x: number, y: number, n: number, w = 240, bh = 52) => {
  shadow(c, x + 20, y + 8, w * 0.6, 16);
  const cols = [COL.blue, COL.red, COL.green, COL.purple, COL.orange];
  for (let i = 0; i < n; i++) {
    const by = y - (i + 1) * bh, bx = x - w / 2 + (((i * 7) % 3) - 1) * 6;
    shape(c, () => rrect(c, bx, by, w, bh, 8), cols[i % 5]);
    shape(c, () => rrect(c, bx + 18, by + 8, w - 26, bh - 16, 4), COL.paper, 3);
  }
  return y - n * bh;
};
const flatSheet = (c: Ctx, x0: number, x1: number, y: number, sag: number, dx = -50, dy = -40) => {
  const m = (x0 + x1) / 2;
  shape(c, () => { c.moveTo(x0, y); c.quadraticCurveTo(m, y + sag * 2, x1, y); c.lineTo(x1 + dx, y + dy); c.quadraticCurveTo(m + dx, y + dy + sag * 2, x0 + dx, y + dy); c.closePath(); }, COL.paper, 5);
};
// an accordion-folded sheet: valleys at y, peaks at y - 2 amp, folds running back into the picture
const zigzag = (c: Ctx, x0: number, x1: number, y: number, n: number, amp: number, dx = -50, dy = -40) => {
  const pts: number[][] = []; const step = (x1 - x0) / n;
  for (let i = 0; i <= n; i++) pts.push([x0 + i * step, i % 2 ? y - 2 * amp : y]);
  for (let i = 0; i < n; i++) { const a = pts[i], b = pts[i + 1]; shape(c, () => polyP(c, [a, b, [b[0] + dx, b[1] + dy], [a[0] + dx, a[1] + dy]]), i % 2 ? "#e6dcc6" : COL.paper, 4); }
  line(c, pts, 6);
};
const coin = (c: Ctx, x: number, y: number, r = 30) => { shape(c, () => ell(c, x, y, r, r * 0.42), COL.yellow, 4); shape(c, () => ell(c, x, y, r * 0.64, r * 0.26), COL.orange, 2.5); };
const coinStack = (c: Ctx, x: number, y: number, n: number, r = 30) => { for (let i = 0; i < n; i++) coin(c, x + ((i * 5) % 3) * 2 - 2, y - i * 9, r); };

// ---------------------------------------------------------------- home things
const pillow = (c: Ctx, x: number, y: number, w: number, h: number, col = COL.cloth, dk = "#d9d1bf") => {
  shadow(c, x + 20, y + h / 2 + 8, w * 0.55, 18);
  const path = () => { c.moveTo(x - w / 2, y - h / 2); c.quadraticCurveTo(x, y - h / 2 + h * 0.14, x + w / 2, y - h / 2); c.quadraticCurveTo(x + w / 2 - w * 0.06, y, x + w / 2, y + h / 2); c.quadraticCurveTo(x, y + h / 2 - h * 0.14, x - w / 2, y + h / 2); c.quadraticCurveTo(x - w / 2 + w * 0.06, y, x - w / 2, y - h / 2); c.closePath(); };
  shape(c, path, col); shade(c, path, dk, -w * 0.07, -h * 0.12, 0.6);
};
const dent = (c: Ctx, x: number, y: number, col = "#d9d1bf") => { shape(c, () => ell(c, x, y, 62, 40), col, 4); shape(c, () => ell(c, x + 6, y + 6, 34, 20), col, 0); };
const coconut = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 0.95, r * 0.95, r * 0.2);
  const rd = rnd(3), path = () => ell(c, x, y, r, r * 0.88);
  shape(c, path, COL.brown); shade(c, path, COL.soilDk, -r * 0.25, -r * 0.15, 0.45);
  for (let i = 0; i < 80; i++) { const a = rd() * Math.PI * 2, rr = r * (0.3 + rd() * 0.62), px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr * 0.88; line(c, [[px, py], [px + Math.cos(a + 0.7) * r * 0.12, py + Math.sin(a + 0.7) * r * 0.1]], 3, COL.soilDk); }
  for (let i = 0; i < 44; i++) { const a = rd() * Math.PI * 2, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r * 0.88; line(c, [[px, py], [px + Math.cos(a) * r * 0.1, py + Math.sin(a) * r * 0.1]], 4, INK); }
  for (const [ex, ey] of [[-0.2, -0.3], [0.2, -0.3], [0, -0.02]]) shape(c, () => ell(c, x + ex * r, y + ey * r, r * 0.08, r * 0.07), INK, 0);
};
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const top = w / 2, bot = w * 0.42, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -w * 0.3, 0, 0.5);
  shape(c, () => ell(c, x, y - h, top, w * 0.1), COL.steelIn, 5);
  shine(c, [[x - top * 0.6, y - h * 0.85], [x - bot * 0.65, y - h * 0.2]], 8);
};
const bottle = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, y + 6, w * 0.55, w * 0.12);
  const body = () => { c.moveTo(x - w * 0.2, y - h); c.lineTo(x + w * 0.2, y - h); c.lineTo(x + w * 0.2, y - h * 0.7); c.quadraticCurveTo(x + w / 2, y - h * 0.62, x + w / 2, y - h * 0.5); c.lineTo(x + w / 2, y); c.lineTo(x - w / 2, y); c.lineTo(x - w / 2, y - h * 0.5); c.quadraticCurveTo(x - w / 2, y - h * 0.62, x - w * 0.2, y - h * 0.7); c.closePath(); };
  shape(c, body, COL.sky); shade(c, body, COL.glassEdge, -w * 0.25, 0, 0.3);
  shape(c, () => rrect(c, x - w * 0.24, y - h - 14, w * 0.48, 22, 5), COL.red, 4);
  shine(c, [[x - w * 0.3, y - h * 0.45], [x - w * 0.3, y - h * 0.1]], 8);
};
const spoon = (c: Ctx, x: number, y: number, len: number, an: number, col = COL.steel, dk = COL.steelDk) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shadow(c, len * 0.45, 22, len * 0.45, 12);
  shape(c, () => rrect(c, 0, -14, len * 0.64, 28, 14), col);
  const bowl = () => ell(c, len * 0.8, 0, len * 0.2, len * 0.13);
  shape(c, bowl, col); shade(c, bowl, dk, -len * 0.05, -len * 0.03, 0.5);
  shine(c, [[len * 0.66, -len * 0.05], [len * 0.78, -len * 0.08]], 6);
  c.restore();
};
const crayon = (c: Ctx, x: number, y: number, an: number, len: number, col: string) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -len / 2, -22, len * 0.85, 44, 6), col);
  shape(c, () => polyP(c, [[len * 0.35, -22], [len / 2, -6], [len / 2, 6], [len * 0.35, 22]]), col);
  c.restore();
};
// a woven doormat scrap and a square of kitchen foil
const matScrap = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 6), COL.brown);
  for (let i = 1; i < 6; i++) { line(c, [[x + (i * w) / 6, y + 4], [x + (i * w) / 6, y + h - 4]], 4, COL.soilDk); line(c, [[x + 4, y + (i * h) / 6], [x + w - 4, y + (i * h) / 6]], 4, COL.soilDk); }
  const rd = rnd(5);
  for (let i = 0; i < 40; i++) { const t = rd(), s = rd() < 0.5 ? -1 : 1, v = rd() < 0.5; const px = v ? x + t * w : x + (s > 0 ? w : 0), py = v ? y + (s > 0 ? h : 0) : y + t * h; line(c, [[px, py], [px + (v ? 0 : s * 14), py + (v ? s * 14 : 0)]], 3, COL.soilDk); }
};
const foil = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 4), COL.steel);
  shade(c, () => rrect(c, x, y, w, h, 4), COL.steelDk, -w * 0.3, -h * 0.3, 0.4);
  shine(c, [[x + w * 0.15, y + h * 0.75], [x + w * 0.55, y + h * 0.15]], 14);
  line(c, [[x + w * 0.7, y + 10], [x + w * 0.62, y + h * 0.5]], 2.5, COL.steelDk);
};

// ---------------------------------------------------------------- set-up cards
// e1 step 1: the dim room, the torch at a slant over the steel plate
const setupE1a = (c: Ctx) => {
  room(c, true); curtain(c, 0, 230);
  plate(c, 580, 820, 230, 95);
  const [wx, wy, an] = [290, 250, 0.95], [tx, ty] = tip(wx, wy, an);
  beam(c, tx, ty, 580, 800, 24, 160);
  torchHand(c, wx, wy, an);
};
// e1 step 2: the bright spot on the wall, the child pointing
const setupE1b = (c: Ctx) => {
  room(c, true);
  spot(c, 780, 240, 120);
  plate(c, 520, 830, 230, 95);
  const [wx, wy, an] = [270, 250, 0.95], [tx, ty] = tip(wx, wy, an);
  beam(c, tx, ty, 520, 810, 24, 160);
  beam(c, 520, 810, 780, 240, 60, 110, 0.35);
  torchHand(c, wx, wy, an);
  person(c, 900, 1075, 520, { armL: [-1.9, -1.75] });
};
// e1 step 3: the child breathes on the cold plate; mist, and the spot goes faint
const setupE1c = (c: Ctx) => {
  room(c, true);
  spot(c, 780, 240, 120, 0.3);
  plate(c, 560, 830, 230, 95);
  mist(c, 560, 820, 150, 58);
  const [wx, wy, an] = [290, 250, 0.95], [tx, ty] = tip(wx, wy, an);
  beam(c, tx, ty, 560, 810, 24, 160);
  beam(c, 560, 810, 780, 240, 60, 110, 0.12);
  torchHand(c, wx, wy, an);
  person(c, 200, 1080, 500);
  breath(c, 270, 672, 470, 790);
};
// e2 step 1: a flat sheet across two piles of books sags under one coin
const setupE2a = (c: Ctx) => {
  ground(c);
  const top = pile(c, 250, 940, 4); pile(c, 830, 940, 4);
  flatSheet(c, 215, 865, top, 70);
  coin(c, 540, top + 66, 32);
  const [wx, wy, an] = [720, 470, 2.0];
  coin(c, wx + Math.cos(an) * 80, wy + Math.sin(an) * 80, 30);
  hand(c, wx, wy, an, 1.1);
  arrow(c, [[640, 600], [580, 700]]);
};
// e2 step 2: folding the sheet back and forth into a zigzag
const setupE2b = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 740, 420, 30);
  flatSheet(c, 520, 920, 700, 0);
  zigzag(c, 140, 520, 700, 6, 45);
  arrow(c, [[250, 520], [320, 575], [390, 520], [460, 575]]);
  hand(c, 660, 560, 2.0, 1.2, SKIN.child, CLOTH.child, true);
};
// e2 step 3: the zigzag bridge holding a pile of coins
const setupE2c = (c: Ctx) => {
  ground(c);
  const top = pile(c, 250, 940, 4); pile(c, 830, 940, 4);
  zigzag(c, 215, 865, top, 10, 34);
  coinStack(c, 540, top - 80, 7, 32);
  const [wx, wy, an] = [760, 420, 2.0];
  coin(c, wx + Math.cos(an) * 80, wy + Math.sin(an) * 80, 30);
  hand(c, wx, wy, an, 1.1);
  arrow(c, [[690, 530], [620, 590]]);
};

// ---------------------------------------------------------------- card pictures
// flow.e1: the grown-up shines the torch on the plate, the spot jumps to the wall, the child looks
const flowE1 = (c: Ctx) => {
  room(c, true);
  spot(c, 800, 230, 110);
  plate(c, 560, 860, 200, 80);
  const [wx, wy] = wristAt(170, 1080, 720, 1, -0.5, 0.3), an = Math.atan2(850 - wy, 560 - wx), [tx, ty] = [wx + Math.cos(an) * 148, wy + Math.sin(an) * 148];
  beam(c, tx, ty, 560, 845, 24, 140);
  beam(c, 560, 845, 800, 230, 55, 100, 0.35);
  person(c, 170, 1080, 720, { adult: true, armR: [-0.5, 0.3] });
  torch(c, wx + Math.cos(an) * 20, wy + Math.sin(an) * 20, an);
  person(c, 920, 1080, 520, { armL: [-1.9, -1.75] });
};
// flow.e2: the child adds coins to the zigzag bridge
const flowE2 = (c: Ctx) => {
  ground(c);
  const top = pile(c, 230, 940, 4, 220); pile(c, 740, 940, 4, 220);
  zigzag(c, 200, 790, top, 10, 34);
  coinStack(c, 495, top - 80, 10, 32);
  person(c, 960, 1080, 520, { armL: [-2.6, -2.6] });
  const [wx, wy] = wristAt(960, 1080, 520, -1, -2.6, -2.6);
  coin(c, wx, wy, 28);
  arrow(c, [[700, 600], [600, 590]]);
};
// flow.a1: the touch hunt, a thumb pressing into a cushion, finds around it
const flowA1 = (c: Ctx) => {
  ground(c);
  pillow(c, 540, 720, 480, 300, COL.pink, "#d47a94");
  dent(c, 430, 640, "#d47a94");
  hand(c, 330, 540, 0.75, 1.3, SKIN.child, CLOTH.child, true);
  coconut(c, 170, 930, 115);
  tumbler(c, 900, 960, 150, 230);
  bottle(c, 900, 600, 110, 300);
};
// flow.a2: paper over a leaf, the side of a crayon rubbed across, veins showing through
const flowA2 = (c: Ctx) => {
  ground(c, COL.wood);
  shadow(c, 560, 650, 330, 290);
  leaf(c, 300, 780, 480, -0.55);
  const vein = (t: number, s: number) => { const bx = 300 + Math.cos(-0.55) * 480 * t, by = 780 + Math.sin(-0.55) * 480 * t; line(c, [[bx, by], [bx + Math.cos(-0.55 + s * 1.1) * 110 * (1 - t * 0.6), by + Math.sin(-0.55 + s * 1.1) * 110 * (1 - t * 0.6)]], 4, COL.leafDk); };
  for (let i = 1; i < 7; i++) { vein(i / 7.5, 1); vein(i / 7.5 + 0.05, -1); }
  shape(c, () => rrect(c, 230, 330, 620, 560, 6), "rgba(255,250,240,0.8)", 5);
  c.save(); c.beginPath(); ell(c, 510, 620, 230, 180); c.clip();
  c.globalAlpha = 0.55; c.fillStyle = COL.greenLt; c.fillRect(0, 0, D, D); c.globalAlpha = 0.8;
  leaf(c, 300, 780, 480, -0.55, COL.green); for (let i = 1; i < 7; i++) { vein(i / 7.5, 1); vein(i / 7.5 + 0.05, -1); }
  c.restore(); c.globalAlpha = 1;
  const [wx, wy, an] = [900, 320, 2.3];
  crayon(c, wx + Math.cos(an) * 90, wy + Math.sin(an) * 90, an + Math.PI / 2, 260, COL.green);
  hand(c, wx, wy, an, 1.2);
  arrow(c, [[330, 470], [440, 440]]); arrow(c, [[440, 530], [330, 560]]);
};
// flow.a3: two hands gently bending a rubber chappal; a steel spoon stays straight
const flowA3 = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 1250, ro = 720, ri = 610, a0 = -Math.PI / 2 - 0.55, a1 = -Math.PI / 2 + 0.55;
  shadow(c, 560, 720, 300, 40);
  shape(c, () => { c.arc(cx, cy, ro, a0, a1); c.arc(cx, cy, ri, a1, a0, true); c.closePath(); }, COL.blue);
  shade(c, () => { c.arc(cx, cy, ro, a0, a1); c.arc(cx, cy, ri, a1, a0, true); c.closePath(); }, COL.blueDk, 0, -40, 0.5);
  line(c, [[400, 610], [540, 545], [680, 610]], 22, INK); line(c, [[400, 610], [540, 545], [680, 610]], 12, COL.red);
  shape(c, () => ell(c, 540, 545, 16, 16), COL.red, 4);
  hand(c, 150, 760, -0.6, 1.2); hand(c, 930, 760, Math.PI + 0.6, 1.2);
  arrow(c, [[200, 560], [250, 470], [340, 420]]); arrow(c, [[880, 560], [830, 470], [740, 420]]);
  spoon(c, 240, 940, 580, 0);
};
// flow.p1: the open feel book, a rough doormat scrap and a shiny foil square
const flowP1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 910, 420, 30);
  shape(c, () => rrect(c, 130, 330, 820, 560, 12), COL.orange);
  shape(c, () => rrect(c, 150, 350, 385, 520, 8), COL.paper); shape(c, () => rrect(c, 545, 350, 385, 520, 8), COL.paper);
  for (const y of [420, 610, 800]) { line(c, [[525, y - 20], [555, y + 20]], 5, COL.red); line(c, [[555, y - 20], [525, y + 20]], 5, COL.red); }
  matScrap(c, 205, 470, 270, 270);
  foil(c, 605, 470, 270, 270);
  hand(c, 230, 860, -1.0, 1.2, SKIN.child, CLOTH.child, true);
};
// term.1: the child presses a pillow with one hand and knocks a wooden table with the other
const term1 = (c: Ctx) => {
  ground(c);
  pillow(c, 240, 870, 320, 190);
  shape(c, () => rrect(c, 700, 826, 30, 254, 4), COL.woodDk); shape(c, () => rrect(c, 990, 826, 30, 254, 4), COL.woodDk);
  shape(c, () => rrect(c, 680, 790, 360, 36, 6), COL.wood);
  person(c, 540, 1080, 600, { armL: [2.44, 2.44], armR: [0.72, 0.72] });
  dent(c, 323, 800);
  for (const [a, b] of [[[790, 760], [800, 735]], [[815, 772], [840, 760]], [[770, 755], [760, 730]]]) line(c, [a, b], 5, INK);
};
// term.2: fingers stroking the hairy surface of a coconut
const term2 = (c: Ctx) => {
  ground(c);
  coconut(c, 540, 620, 290);
  arrow(c, [[760, 430], [620, 380], [480, 410]]);
  hand(c, 900, 300, 2.5, 1.5, SKIN.child, CLOTH.child, true);
};
// term.3: the torch shines on a tilted plate; the light bounces to a bright spot on the wall
const term3 = (c: Ctx) => {
  room(c, true);
  spot(c, 800, 230, 120);
  shadow(c, 600, 900, 240, 40);
  shape(c, () => ell(c, 560, 760, 240, 150, -0.35), COL.steel);
  shape(c, () => ell(c, 560, 760, 200, 122, -0.35), COL.steelIn, 4);
  const [wx, wy, an] = [240, 250, 0.95], [tx, ty] = tip(wx, wy, an);
  beam(c, tx, ty, 560, 760, 24, 120);
  beam(c, 560, 760, 800, 230, 70, 110, 0.4);
  torchHand(c, wx, wy, an);
};
// expl.2: a flat sheet sags under one coin; the same paper folded zigzag holds a pile
const expl2 = (c: Ctx) => {
  ground(c);
  const t1 = pile(c, 250, 470, 3, 200, 44); pile(c, 830, 470, 3, 200, 44);
  flatSheet(c, 220, 860, t1, 50, -40, -32);
  coin(c, 540, t1 + 48, 30);
  line(c, [[80, 560], [1000, 560]], 4, COL.grey);
  const t2 = pile(c, 250, 980, 3, 200, 44); pile(c, 830, 980, 3, 200, 44);
  zigzag(c, 220, 860, t2, 10, 30, -40, -32);
  coinStack(c, 540, t2 - 72, 8, 30);
};

export const ic_materialsPropertiesL1 = cards("sci.materials.properties.L1", [
  setupE1a, setupE1b, setupE1c, setupE2a, setupE2b, setupE2c,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowP1, term1, term2, term3, expl2,
]);
