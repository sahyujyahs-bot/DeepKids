import type { Ctx } from "./core";
import { BG, COL, INK, RED, SH, SKIN, CLOTH, arrow, cards, ell, ground, hand, line, polyP, rrect, shade, shadow, shape, write } from "./flatKit";

// sci.senses.perception.L3 set-up cards: paper strips with test lines, a child's hand drawing, a ruler,
// two fingers and a pea, and a tally sheet.

// a paper strip lying flat, with its soft shadow and a shade side
const strip = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x + 14, y + 16, w, h, 8), SH, 0);
  shape(c, () => rrect(c, x, y, w, h, 8), COL.paper, 6);
  shade(c, () => rrect(c, x, y, w, h, 8), "#e4dccb", -14, -14, 0.8);
};
// a test line from x1 to x2 at height y: 0 plain, 1 arrowheads at both ends, 2 fins opening outwards
const testLine = (c: Ctx, kind: number, y: number, x1 = 250, x2 = 830) => {
  line(c, [[x1, y], [x2, y]], 10);
  if (kind === 0) return;
  const s = kind === 1 ? 1 : -1;
  for (const [x, d] of [[x1, s], [x2, -s]]) line(c, [[x + d * 55, y - 38], [x, y], [x + d * 55, y + 38]], 10);
};
// a pencil with its tip at (tx, ty), body running away at angle rot
const pencil = (c: Ctx, tx: number, ty: number, rot: number) => {
  c.save(); c.translate(tx, ty); c.rotate(rot);
  shape(c, () => rrect(c, 52, -17, 230, 34, 4), COL.yellow, 5);
  shape(c, () => rrect(c, 54, 3, 226, 12, 3), COL.orange, 0);
  shape(c, () => polyP(c, [[0, 0], [54, -17], [54, 17]]), COL.wood, 5);
  shape(c, () => polyP(c, [[0, 0], [17, -6], [17, 6]]), COL.black, 3);
  shape(c, () => rrect(c, 282, -17, 24, 34, 3), COL.steel, 5);
  shape(c, () => rrect(c, 306, -17, 26, 34, 10), COL.pink, 5);
  c.restore();
};
// a hand and long sleeve coming in from the card edge: wrist at (wx, wy), fingers pointing at angle an,
// thumb on the upper side; extra() paints in the hand's own frame (a pencil) under the fingers
const armHand = (c: Ctx, wx: number, wy: number, an: number, s: number, skin: string, sleeve: string, extra?: () => void) => {
  c.save(); c.translate(wx, wy); c.rotate(an); c.scale(1, -1);
  c.save(); c.scale(s, s);
  shape(c, () => rrect(c, -1500, -36, 1450, 72, 20), sleeve, 6);
  if (extra) extra();
  c.restore();
  hand(c, 0, 0, 0, s, skin, sleeve);
  c.restore();
};
// a green pea
const pea = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.greenLt, Math.max(3, r * 0.14));
  shade(c, () => ell(c, x, y, r, r), COL.greenDk, -r * 0.35, -r * 0.35, 0.5);
  line(c, [[x - r * 0.5, y - r * 0.2], [x - r * 0.25, y - r * 0.55]], Math.max(3, r * 0.14), "#ffffff");
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  [0, 1, 2].forEach((k) => {
    const sy = 150 + k * 280;
    strip(c, 90, sy, 900, 220);
    testLine(c, k, sy + 125);
    write(c, "10 cm", 120, sy + 22, 34, INK, 5);
  });
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  strip(c, 90, 100, 770, 190);
  testLine(c, 1, 195);
  strip(c, 90, 600, 900, 250);
  const T = [570, 730], an = Math.PI * 0.82, s = 1.7;
  line(c, [[250, T[1]], [T[0], T[1]]], 9);
  shape(c, () => ell(c, 250, T[1], 13, 13), INK, 0);
  // wrist placed so the pencil tip (215, 40 in the hand's frame, y flipped) lands on T
  const vx = 215 * s, vy = -40 * s;
  const wx = T[0] - (vx * Math.cos(an) - vy * Math.sin(an)), wy = T[1] - (vx * Math.sin(an) + vy * Math.cos(an));
  armHand(c, wx, wy, an, s, SKIN.child, CLOTH.child, () => pencil(c, 215, 40, Math.atan2(-116, -309)));
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  const oy = 110, PX = 58, x0 = 250, endX = x0 + 11.5 * PX;
  strip(c, 60, 330 + oy, 960, 230);
  line(c, [[x0, 420 + oy], [endX, 420 + oy]], 9);
  shape(c, () => ell(c, x0, 420 + oy, 13, 13), INK, 0);
  shape(c, () => rrect(c, 194, 496 + oy, 830, 170, 10), SH, 0);
  shape(c, () => rrect(c, 180, 480 + oy, 830, 170, 10), COL.wood, 6);
  shade(c, () => rrect(c, 180, 480 + oy, 830, 170, 10), COL.woodDk, -14, -14, 0.5);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let mm = 0; mm <= 126; mm++) { const x = x0 + mm * PX / 10, big = mm % 10 === 0; c.lineWidth = big ? 4 : 2.5; c.beginPath(); c.moveTo(x, 483 + oy); c.lineTo(x, 483 + oy + (big ? 56 : mm % 5 === 0 ? 38 : 22)); c.stroke(); }
  for (let cm = 0; cm <= 12; cm++) write(c, String(cm), x0 + cm * PX - 0.3 * 28 * String(cm).length, 556 + oy, 28, INK, 4);
  line(c, [[endX, 380 + oy], [endX, 640 + oy]], 8, RED);
  write(c, "11", 470, 150 + oy, 90, INK, 9);
  shape(c, () => ell(c, 632, 150 + oy + 82, 8, 8), INK, 0);
  write(c, "5", 652, 150 + oy, 90, INK, 9);
  write(c, "cm", 755, 150 + oy, 90, INK, 9);
  arrow(c, [[870, 270 + oy], [endX - 4, 366 + oy]]);
};

// the child's right hand, fingers up, back toward us; crossed: the middle finger over the first finger
const fingersHand = (c: Ctx, crossed: boolean) => {
  const fin = (pts: number[][], w: number) => { line(c, pts, w + 12, INK); line(c, pts, w, SKIN.child); };
  shape(c, () => rrect(c, 405, 790, 235, 400, 30), CLOTH.child, 6);
  shade(c, () => rrect(c, 405, 790, 235, 400, 30), CLOTH.childDk, -16, 0, 0.8);
  fin([[575, 640], [575, 455]], 60);
  fin([[633, 660], [633, 505]], 52);
  const idx = crossed ? [[443, 610], [468, 340]] : [[443, 610], [443, 340]];
  const mid = crossed ? [[509, 610], [509, 545], [470, 455], [402, 332]] : [[509, 610], [509, 330]];
  fin(idx, 66); fin(mid, 66);
  const nail = (p: number[]) => shape(c, () => ell(c, p[0], p[1] - 6, 17, 13), "#e8c2a6", 3);
  nail(idx[1]); nail(mid[mid.length - 1]);
  shape(c, () => rrect(c, 380, 560, 290, 280, 70), SKIN.child, 6);
  shade(c, () => rrect(c, 380, 560, 290, 280, 70), SKIN.childDk, -18, -18, 0.6);
  fin([[410, 740], [352, 650], [350, 595]], 62);
  shape(c, () => ell(c, 350, 597, 17, 13), "#e8c2a6", 3);
};
// the round badge with the child's face, eyes shut
const eyesShut = (c: Ctx) => {
  shape(c, () => ell(c, 180, 190, 125, 125), COL.sky, 6);
  const hx = 180, hy = 205, hd = 80;
  shape(c, () => ell(c, hx, hy, hd, hd * 1.05), SKIN.child);
  shape(c, () => { c.moveTo(hx - hd * 1.02, hy); c.bezierCurveTo(hx - hd, hy - hd * 1.5, hx + hd, hy - hd * 1.5, hx + hd * 1.02, hy); c.quadraticCurveTo(hx, hy - hd * 0.55, hx - hd * 1.02, hy); c.closePath(); }, CLOTH.hair, 5);
  for (const dx of [-0.38, 0.38]) { c.beginPath(); c.arc(hx + dx * hd, hy + hd * 0.1, hd * 0.2, 0.15 * Math.PI, 0.85 * Math.PI); c.strokeStyle = INK; c.lineWidth = 5; c.lineCap = "round"; c.stroke(); }
  c.beginPath(); c.arc(hx, hy + hd * 0.4, hd * 0.3, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
// the parent's hand coming from the upper right, fingertips on the pea at (px, py)
const touchPea = (c: Ctx, px: number, py: number) => {
  const an = Math.PI * 0.7, s = 1.9, d = 36 - 4 + 78 * s;
  armHand(c, px - d * Math.cos(an), py - d * Math.sin(an), an, s, SKIN.adult, CLOTH.adult);
  pea(c, px, py, 36);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  fingersHand(c, false);
  eyesShut(c);
  touchPea(c, 476, 302);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  fingersHand(c, true);
  eyesShut(c);
  touchPea(c, 435, 302);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  strip(c, 100, 120, 880, 800);
  const tick = (x: number, y: number) => line(c, [[x - 20, y], [x - 6, y + 17], [x + 22, y - 20]], 11, COL.greenDk);
  const cross = (x: number, y: number) => { line(c, [[x - 18, y - 18], [x + 18, y + 18]], 11, RED); line(c, [[x + 18, y - 18], [x - 18, y + 18]], 11, RED); };
  const wrong = [new Set([4, 13]), new Set([0, 2, 3, 5, 7, 8, 9, 11, 12, 14, 16, 18])];
  [0, 1].forEach((t) => {
    const x0 = t ? 600 : 160, y0 = 340, cx = x0 + 160;
    // the header: two fingers side by side, or crossed, with a pea on the tips
    const f = (pts: number[][]) => { line(c, pts, 46, INK); line(c, pts, 34, SKIN.child); };
    if (t) { f([[cx - 24, 305], [cx + 24, 220]]); f([[cx + 24, 305], [cx - 24, 220]]); } else { f([[cx - 22, 305], [cx - 22, 220]]); f([[cx + 22, 305], [cx + 22, 220]]); }
    pea(c, cx, 205, 17);
    shape(c, () => rrect(c, x0, y0, 320, 400, 4), "#ffffff", 5);
    for (let i = 1; i < 4; i++) line(c, [[x0 + i * 80, y0], [x0 + i * 80, y0 + 400]], 4);
    for (let j = 1; j < 5; j++) line(c, [[x0, y0 + j * 80], [x0 + 320, y0 + j * 80]], 4);
    for (let n = 0; n < 20; n++) { const x = x0 + (n % 4) * 80 + 40, y = y0 + Math.floor(n / 4) * 80 + 40; if (wrong[t].has(n)) cross(x, y); else tick(x, y); }
    tick(x0 + 70, 815);
    write(c, String(20 - wrong[t].size), x0 + 130, 780, 70, INK, 8);
  });
};

export const su_sensesPerception = cards("sci.senses.perception.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2]);
