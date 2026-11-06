import type { Ctx } from "./core";
import { INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, person, write, cards } from "./flatKit";

// OUR EARS L1 · near and far sounds. The same child (orange top) and grown-up (blue top) on every card.
// People are the kit's person(); arm angles come from reach(), which puts a hand exactly on the thing it
// holds, covers or cups.

const PI = Math.PI;
const FLOOR = "#e3cfae", NEXT_ROOM = "#d6e9f2", DUPATTA = COL.pink, DUPATTA_DK = "#d87a98", ROAD = "#c9c3b8", PENCIL = "#7b7b7b";

// ---------------------------------------------------------------- people geometry (mirrors person())
type Geo = { x: number; y: number; h: number; sit: boolean; adult: boolean; head: number; hip: number; sh: number; hy: number; shy: number; shxL: number; shxR: number; l1: number; l2: number; hr: number; skin: string };
const geo = (x: number, y: number, h: number, sit = false, adult = false): Geo => {
  const head = h * 0.13, hip = sit ? y - h * 0.06 : y - h * 0.42, sh = sit ? hip - h * 0.32 : y - h * 0.74;
  return { x, y, h, sit, adult, head, hip, sh, hy: sh - head * 1.05, shy: sh + h * 0.03, shxL: x - h * 0.11, shxR: x + h * 0.11, l1: h * 0.17, l2: h * 0.16, hr: h * 0.06 * 0.62, skin: adult ? SKIN.adult : SKIN.child };
};
// joint angles that land a hand on (tx, ty); out = -1 bends the elbow to the left, +1 to the right
const reach = (g: Geo, side: "L" | "R", tx: number, ty: number, out: number): [number, number] => {
  const sx = side === "L" ? g.shxL : g.shxR, sy = g.shy;
  let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy);
  const max = g.l1 + g.l2 - 2;
  if (d > max) { dx *= max / d; dy *= max / d; d = max; }
  const phi = Math.atan2(dy, dx), al = Math.acos(Math.max(-1, Math.min(1, (g.l1 * g.l1 + d * d - g.l2 * g.l2) / (2 * g.l1 * d))));
  const pick = (a1: number): [number, number] => { const ex = sx + Math.cos(a1) * g.l1, ey = sy + Math.sin(a1) * g.l1; return [a1, Math.atan2(sy + dy - ey, sx + dx - ex)]; };
  const A = pick(phi - al), B = pick(phi + al), exA = sx + Math.cos(A[0]) * g.l1, exB = sx + Math.cos(B[0]) * g.l1;
  return (out < 0 ? exA < exB : exA > exB) ? A : B;
};
const figure = (c: Ctx, g: Geo, armL?: [number, number], armR?: [number, number]) => person(c, g.x, g.y, g.h, { armL, armR, sit: g.sit, adult: g.adult });
const earL = (g: Geo): [number, number] => [g.x - g.head * 0.95, g.hy + g.head * 0.1];
const earR = (g: Geo): [number, number] => [g.x + g.head * 0.95, g.hy + g.head * 0.1];
const cupL = (g: Geo): [number, number] => [g.x - g.head * 1.25, g.hy + g.head * 0.05];
const cupR = (g: Geo): [number, number] => [g.x + g.head * 1.25, g.hy + g.head * 0.05];
// a hand drawn again on top of something (the dupatta, a tumbler)
const handDot = (c: Ctx, g: Geo, x: number, y: number) => shape(c, () => ell(c, x, y, g.hr, g.hr), g.skin, 5);
// a hand cupped behind the ear: an upright palm
const cupHand = (c: Ctx, g: Geo, x: number, y: number) => shape(c, () => ell(c, x, y, g.hr * 0.75, g.hr * 1.3), g.skin, 5);
const eyesShut = (c: Ctx, g: Geo) => {
  for (const s of [-1, 1]) {
    const ex = g.x + s * g.head * 0.35, ey = g.hy + g.head * 0.12;
    shape(c, () => ell(c, ex, ey, g.head * 0.16, g.head * 0.2), g.skin, 0);
    c.beginPath(); c.arc(ex, ey - g.head * 0.04, g.head * 0.12, 0.25, PI - 0.25); c.strokeStyle = INK; c.lineWidth = 4; c.lineCap = "round"; c.stroke();
  }
};
// a dupatta tied over the eyes, its tail hanging by the right ear
const dupatta = (c: Ctx, g: Geo) => {
  const { x, hy, head } = g;
  shape(c, () => { c.moveTo(x + head * 0.95, hy); c.quadraticCurveTo(x + head * 1.7, hy + head * 0.6, x + head * 1.35, hy + head * 1.5); c.lineTo(x + head * 1.05, hy + head * 1.4); c.quadraticCurveTo(x + head * 1.3, hy + head * 0.6, x + head * 0.9, hy + head * 0.35); c.closePath(); }, DUPATTA, 5);
  shape(c, () => rrect(c, x - head * 1.08, hy - head * 0.1, head * 2.16, head * 0.44, head * 0.12), DUPATTA, 5);
  shade(c, () => rrect(c, x - head * 1.08, hy - head * 0.1, head * 2.16, head * 0.44, head * 0.12), DUPATTA_DK, head * 0.5, 0, 0.45);
};
// curved sound lines spreading from (x, y) in direction dir; one radius per line, fading if alphas given
const sound = (c: Ctx, x: number, y: number, dir: number, rs: number[], w = 6, spread = 0.55, alphas?: number[]) => {
  rs.forEach((r, i) => { c.globalAlpha = alphas ? alphas[i] : 1; c.beginPath(); c.arc(x, y, r, dir - spread, dir + spread); c.strokeStyle = INK; c.lineWidth = w; c.lineCap = "round"; c.stroke(); });
  c.globalAlpha = 1;
};

// ---------------------------------------------------------------- things
// a room: wall, floor from y = 800, and (door) an open doorway to the next room at the right
const room = (c: Ctx, door: boolean) => {
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, 800, 1080, 280);
  line(c, [[0, 800], [1080, 800]], 6);
  if (door) { shape(c, () => rrect(c, 900, 250, 160, 556, 8), COL.wood, 6); shape(c, () => rrect(c, 920, 270, 120, 530, 4), NEXT_ROOM, 5); }
};
// a chalk cross on the floor
const cross = (c: Ctx, x: number, y: number, s: number) => {
  line(c, [[x - s, y - s * 0.6], [x + s, y + s * 0.6]], 16); line(c, [[x - s, y + s * 0.6], [x + s, y - s * 0.6]], 16);
  line(c, [[x - s, y - s * 0.6], [x + s, y + s * 0.6]], 8, WHITE); line(c, [[x - s, y + s * 0.6], [x + s, y - s * 0.6]], 8, WHITE);
};
// a low wooden chair for the sitting pose (seat at the sitter's hip, feet on the floor at y)
const chair = (c: Ctx, x: number, y: number, h: number) => {
  shadow(c, x + h * 0.04, y + 8, h * 0.26, h * 0.03);
  for (const px of [x - h * 0.21, x + h * 0.08]) shape(c, () => rrect(c, px, y - h * 0.47, h * 0.07, h * 0.44, 8), COL.wood, 6);
  for (const ry of [y - h * 0.47, y - h * 0.3]) shape(c, () => rrect(c, x - h * 0.21, ry, h * 0.36, h * 0.06, 8), COL.wood, 6);
  shape(c, () => rrect(c, x - h * 0.22, y - h * 0.05, h * 0.48, h * 0.05, 6), COL.woodDk, 6);
};
// a steel tumbler, bottom centre (x, y)
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const body = () => polyP(c, [[x - w / 2, y - h], [x + w / 2, y - h], [x + w * 0.42, y], [x - w * 0.42, y]]);
  shape(c, body, COL.steel, 6); shade(c, body, COL.steelDk, w * 0.3, 0, 0.5);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), COL.steelIn, 5);
  c.globalAlpha = 0.7; line(c, [[x - w * 0.3, y - h * 0.8], [x - w * 0.26, y - h * 0.25]], 7, WHITE); c.globalAlpha = 1;
};
// a steel spoon, handle end at (x, y), pointing at angle an
const spoon = (c: Ctx, x: number, y: number, an: number, len: number) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len;
  line(c, [[x, y], [tx, ty]], 16); line(c, [[x, y], [tx, ty]], 8, COL.steel);
  shape(c, () => ell(c, tx, ty, len * 0.16, len * 0.1, an), COL.steel, 5);
};
// a phone lying flat, centre (x, y)
const phone = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 12), COL.black, 6);
  shape(c, () => rrect(c, x - w / 2 + 10, y - h / 2 + 10, w - 20, h - 20, 8), COL.sky, 3);
};
// a pressure cooker standing on something at y, centre x, size s (1 = big)
const cooker = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 12, 6, 120, 16);
  const body = () => polyP(c, [[-100, -150], [100, -150], [112, 0], [-112, 0]]);
  shape(c, body, COL.steel, 6); shade(c, body, COL.steelDk, 55, 0, 0.5);
  shape(c, () => rrect(c, 95, -140, 95, 32, 12), COL.black, 5); // handle
  shape(c, () => ell(c, 0, -150, 104, 20), COL.steelIn, 5); // lid rim
  shape(c, () => ell(c, 0, -162, 70, 14), COL.steel, 5);
  shape(c, () => rrect(c, -18, -198, 36, 34, 8), COL.black, 5); // weight
  c.globalAlpha = 0.7; line(c, [[-70, -120], [-64, -30]], 7, WHITE); c.globalAlpha = 1;
  c.restore();
};
const crow = (c: Ctx, x: number, y: number, s: number, flip = false) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  shape(c, () => ell(c, 0, 0, 44, 24), COL.black, 5);
  shape(c, () => polyP(c, [[-30, -6], [-70, 6], [-32, 12]]), COL.black, 5);
  shape(c, () => ell(c, 40, -16, 20, 17), COL.black, 5);
  shape(c, () => polyP(c, [[56, -14], [82, -8], [56, -4]]), COL.orange, 4);
  shape(c, () => ell(c, 44, -20, 4, 4), WHITE, 0);
  line(c, [[-6, 22], [-10, 38]], 5); line(c, [[12, 22], [10, 38]], 5);
  c.restore();
};
const plane = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => polyP(c, [[-20, -4], [-60, -40], [-40, -42], [10, -8]]), COL.steel, 4);
  shape(c, () => ell(c, 0, 0, 70, 16), WHITE, 5);
  shape(c, () => polyP(c, [[10, 4], [-30, 44], [-6, 46], [40, 8]]), COL.steel, 4);
  shape(c, () => polyP(c, [[-50, -8], [-72, -38], [-56, -40], [-30, -12]]), COL.red, 4);
  c.restore();
};
const fan = (c: Ctx, x: number, y: number, s: number) => {
  for (let i = 0; i < 3; i++) { const an = -PI / 2 + (i * 2 * PI) / 3; shape(c, () => ell(c, x + Math.cos(an) * 36 * s, y + Math.sin(an) * 36 * s, 34 * s, 13 * s, an), COL.brown, 4); }
  shape(c, () => ell(c, x, y, 14 * s, 14 * s), COL.grey, 4);
};
const car = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => rrect(c, -60, -22, 120, 36, 8), COL.red, 4);
  shape(c, () => polyP(c, [[-32, -22], [-20, -48], [26, -48], [40, -22]]), COL.sky, 4);
  shape(c, () => ell(c, -34, 16, 14, 14), COL.black, 4); shape(c, () => ell(c, 34, 16, 14, 14), COL.black, 4);
  c.restore();
};
const train = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (let i = 0; i < 2; i++) { const ox = -92 + i * 94; shape(c, () => rrect(c, ox, -40, 88, 48, 8), i ? COL.blue : COL.teal, 4); shape(c, () => rrect(c, ox + 14, -30, 22, 18, 3), COL.sky, 3); shape(c, () => rrect(c, ox + 52, -30, 22, 18, 3), COL.sky, 3); shape(c, () => ell(c, ox + 22, 10, 10, 10), COL.black, 3); shape(c, () => ell(c, ox + 66, 10, 10, 10), COL.black, 3); }
  line(c, [[-100, 22], [100, 22]], 5);
  c.restore();
};
// a block of flats seen from the front
const flats = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 6), COL.cloth, 5);
  shape(c, () => rrect(c, x - w / 2 + 6, y - h - 18, w - 12, 18, 4), COL.greyDk, 4);
  const cols = 3, rows = Math.floor(h / 34), cw = (w - 20) / cols;
  for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) shape(c, () => rrect(c, x - w / 2 + 12 + k * cw, y - h + 12 + r * 34, cw - 10, 20, 3), COL.sky, 3);
};

// ================================================================ set-up cards for e1
// 1. a chair in the middle, a chalk cross a big step from it (near), another by the far doorway (far)
const setup0 = (c: Ctx) => {
  room(c, true);
  chair(c, 430, 800, 420);
  cross(c, 700, 880, 46);
  cross(c, 990, 850, 34);
};
// 2. the girl on the chair, dupatta over her eyes, hands over her ears, counting; mother tiptoes to the far door with tumbler and spoon
const setup1 = (c: Ctx) => {
  room(c, true);
  const g = geo(360, 800, 420, true);
  chair(c, g.x, g.y, g.h);
  const [lx, ly] = earL(g), [rx, ry] = earR(g);
  figure(c, g, reach(g, "L", lx, ly, -1), reach(g, "R", rx, ry, 1));
  dupatta(c, g); handDot(c, g, lx, ly); handDot(c, g, rx, ry);
  write(c, "1 2 3", 430, 440, 40, INK, 6);
  const m = geo(740, 800, 500, false, true);
  const T: [number, number] = [m.x + 70, 575], S: [number, number] = [m.x - 70, 580];
  figure(c, m, reach(m, "L", S[0], S[1], -1), reach(m, "R", T[0], T[1], 1));
  tumbler(c, T[0] + 30, T[1] + 45, 70, 95); handDot(c, m, T[0], T[1]);
  spoon(c, S[0], S[1] + 6, -PI / 2 - 0.15, 115); handDot(c, m, S[0], S[1]);
  arrow(c, [[m.x + 90, 860], [m.x + 190, 860]]);
};
// 3. the girl listens, hands down; the mother at the far door taps the tumbler
const tapScene = (c: Ctx, gx: number, mx: number) => {
  room(c, true);
  const g = geo(gx, 800, 420, true);
  chair(c, g.x, g.y, g.h);
  figure(c, g);
  dupatta(c, g);
  const m = geo(mx, 800, 500, false, true);
  // the tumbler held low in front of her in the left hand; the spoon comes down from the right hand onto its rim
  const T: [number, number] = [m.x - 38, 625], S: [number, number] = [m.x + 85, 540], rim: [number, number] = [m.x + 8, 578];
  figure(c, m, reach(m, "L", T[0], T[1], -1), reach(m, "R", S[0], S[1], 1));
  tumbler(c, m.x + 5, 672, 72, 96); handDot(c, m, T[0], T[1]);
  spoon(c, S[0], S[1], Math.atan2(rim[1] - S[1], rim[0] - S[0]), Math.hypot(rim[0] - S[0], rim[1] - S[1])); handDot(c, m, S[0], S[1]);
  sound(c, m.x + 8, 568, -PI / 2, [48, 72, 96], 6, 0.4);
};
const setup2 = (c: Ctx) => tapScene(c, 360, 860);

// ================================================================ card pictures
// flow.e1: the girl blindfolded on the chair, the mother tapping the tumbler a few steps behind
const flowE1 = (c: Ctx) => tapScene(c, 430, 790);
// flow.a1: child and parent on the floor by an open window, eyes shut, the child holding up two fingers
const flowA1 = (c: Ctx) => {
  room(c, false);
  shape(c, () => rrect(c, 560, 140, 430, 370, 8), COL.wood, 6);
  shape(c, () => rrect(c, 582, 162, 386, 326, 4), COL.sky, 5);
  line(c, [[775, 162], [775, 488]], 6); line(c, [[582, 325], [968, 325]], 6);
  shape(c, () => rrect(c, 548, 505, 454, 22, 4), COL.woodDk, 5);
  plane(c, 870, 230, 0.55); sound(c, 870, 230, PI, [40, 60], 3, 0.5, [0.5, 0.3]);
  crow(c, 660, 420, 0.8); sound(c, 700, 405, 0, [40, 62], 5, 0.5);
  const g = geo(300, 800, 400, true), F: [number, number] = [g.x + 110, g.hy - 10];
  figure(c, g, undefined, reach(g, "R", F[0], F[1], 1));
  eyesShut(c, g);
  for (const dx of [-8, 8]) { line(c, [[F[0] + dx, F[1] - 6], [F[0] + dx * 1.3, F[1] - 46]], 13); line(c, [[F[0] + dx, F[1] - 6], [F[0] + dx * 1.3, F[1] - 46]], 7, g.skin); }
  handDot(c, g, F[0], F[1] + 2);
  const m = geo(700, 800, 480, true, true);
  figure(c, m);
  eyesShut(c, m);
};
// flow.a2: the girl with hands cupped behind both ears, listening to a phone on the table
const flowA2 = (c: Ctx) => {
  room(c, false);
  shape(c, () => rrect(c, 700, 600, 320, 26, 6), COL.wood, 6);
  for (const x of [720, 980]) shape(c, () => rrect(c, x, 626, 22, 174, 4), COL.woodDk, 5);
  phone(c, 860, 575, 150, 56);
  sound(c, 790, 570, PI, [50, 80, 110], 6, 0.5);
  const g = geo(430, 800, 420), [lx, ly] = cupL(g), [rx, ry] = cupR(g);
  figure(c, g, reach(g, "L", lx, ly, -1), reach(g, "R", rx, ry, 1));
  cupHand(c, g, lx, ly); cupHand(c, g, rx, ry);
};
// flow.a3: the boy walks towards the sofa, a hand cupped behind his ear; the song is under a cushion
const flowA3 = (c: Ctx) => {
  room(c, false);
  shadow(c, 800, 812, 260, 20);
  shape(c, () => rrect(c, 560, 450, 460, 150, 30), COL.teal, 6);
  shape(c, () => rrect(c, 560, 580, 460, 220, 24), COL.teal, 6);
  shade(c, () => rrect(c, 560, 580, 460, 220, 24), COL.tealDk, 60, 0, 0.4);
  shape(c, () => rrect(c, 548, 560, 60, 170, 20), COL.tealDk, 6); shape(c, () => rrect(c, 972, 560, 60, 170, 20), COL.tealDk, 6);
  phone(c, 760, 604, 120, 44);
  shape(c, () => rrect(c, 640, 530, 220, 70, 18), COL.yellow, 6);
  shade(c, () => rrect(c, 640, 530, 220, 70, 18), COL.orange, 40, 0, 0.4);
  shape(c, () => rrect(c, 870, 520, 130, 70, 18), COL.yellow, 6);
  sound(c, 750, 540, -PI * 0.75, [60, 100, 140], 6, 0.5);
  const g = geo(300, 800, 420), [rx, ry] = cupR(g);
  figure(c, g, undefined, reach(g, "R", rx, ry, 1));
  cupHand(c, g, rx, ry);
  arrow(c, [[380, 870], [520, 870]]);
};
// flow.p1: the sound map: the home in the middle, three circles, near sounds close and far sounds at the edge
const flowP1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 580, 470, 470);
  shape(c, () => rrect(c, 80, 80, 920, 920, 10), COL.paper, 6);
  for (const r of [150, 270, 390]) { c.beginPath(); c.arc(540, 560, r, 0, PI * 2); c.strokeStyle = PENCIL; c.lineWidth = 5; c.stroke(); }
  flats(c, 540, 630, 110, 140);
  fan(c, 440, 480, 0.9);
  cooker(c, 625, 660, 0.3);
  crow(c, 375, 700, 0.7, true);
  car(c, 720, 410, 0.8); sound(c, 790, 390, 0, [22, 36], 4, 0.5);
  plane(c, 300, 300, 0.6);
  train(c, 770, 850, 0.6);
};
// term.0: the child in a doorway, a hand at one ear; the pressure cooker on the stove in the kitchen beyond
const term0 = (c: Ctx) => {
  room(c, false);
  shape(c, () => rrect(c, 230, 220, 270, 586, 8), COL.wood, 6);
  shape(c, () => rrect(c, 252, 242, 226, 560, 4), NEXT_ROOM, 5);
  shape(c, () => rrect(c, 620, 600, 400, 200, 10), COL.steel, 6);
  shape(c, () => rrect(c, 640, 620, 170, 60, 8), COL.steelDk, 4); shape(c, () => rrect(c, 830, 620, 170, 60, 8), COL.steelDk, 4);
  cooker(c, 790, 600, 0.95);
  sound(c, 790, 420, -PI * 0.8, [50, 85, 120], 6, 0.5);
  const g = geo(365, 800, 400), [rx, ry] = cupR(g);
  figure(c, g, undefined, reach(g, "R", rx, ry, 1));
  cupHand(c, g, rx, ry);
};
// term.1: a close drawing of the ear flap, its folds, and an arrow into the ear hole
const term1 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 180, 560, 440, 540), SKIN.child, 6);
  shape(c, () => { c.ellipse(180, 560, 440, 540, 0, PI, PI * 2); c.quadraticCurveTo(180, 330, -260, 560); c.closePath(); }, CLOTH.hair, 6);
  const outer = () => { c.moveTo(470, 300); c.bezierCurveTo(600, 170, 860, 250, 845, 470); c.bezierCurveTo(835, 630, 770, 760, 670, 860); c.bezierCurveTo(600, 925, 500, 905, 470, 820); c.closePath(); };
  shadow(c, 680, 600, 190, 300);
  shape(c, outer, SKIN.child, 7);
  shade(c, outer, SKIN.childDk, 40, 0, 0.35);
  // the curly rim (helix) and the fold inside it
  c.beginPath(); c.moveTo(520, 330); c.bezierCurveTo(640, 240, 790, 310, 778, 470); c.bezierCurveTo(770, 570, 740, 660, 690, 730); c.strokeStyle = INK; c.lineWidth = 7; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.moveTo(560, 440); c.bezierCurveTo(650, 380, 720, 440, 712, 540); c.bezierCurveTo(706, 610, 672, 670, 630, 710); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  shape(c, () => ell(c, 590, 600, 78, 110), SKIN.childDk, 5);
  shape(c, () => ell(c, 548, 598, 30, 44), INK, 0);
  shape(c, () => ell(c, 500, 590, 22, 42), SKIN.child, 5);
  arrow(c, [[980, 360], [820, 440], [600, 580]], RED, 12);
};
// term.3: loud (hands over ears by a big drum) and soft (leaning in to hear a whisper)
const term3 = (c: Ctx) => {
  room(c, false);
  line(c, [[540, 60], [540, 1020]], 6);
  const a = geo(250, 800, 380), [lx, ly] = earL(a), [rx, ry] = earR(a);
  figure(c, a, reach(a, "L", lx, ly, -1), reach(a, "R", rx, ry, 1));
  handDot(c, a, lx, ly); handDot(c, a, rx, ry);
  shadow(c, 450, 806, 90, 16);
  shape(c, () => rrect(c, 360, 600, 170, 200, 14), COL.red, 6);
  shade(c, () => rrect(c, 360, 600, 170, 200, 14), "#a9321f", 50, 0, 0.4);
  shape(c, () => ell(c, 445, 600, 85, 22), COL.paper, 6);
  sound(c, 445, 590, -PI / 2, [60, 95, 130], 9, 0.5);
  const w = geo(670, 800, 380), M: [number, number] = [w.x + w.head * 0.6, w.hy + w.head * 0.6];
  figure(c, w, undefined, reach(w, "R", M[0], M[1], 1));
  const f = geo(935, 800, 380), [fx, fy] = cupL(f);
  figure(c, f, reach(f, "L", fx, fy, -1));
  cupHand(c, f, fx, fy);
  sound(c, M[0] + 20, M[1] - 10, 0, [22, 38], 4, 0.5);
};
// expl.1: the jasmine seller calling in the street: bold sound near the child at the gate, faint at the far end
const expl1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = ROAD; c.fillRect(0, 800, 1080, 280);
  line(c, [[0, 800], [1080, 800]], 6);
  shape(c, () => rrect(c, 40, 600, 140, 200, 4), COL.cloth, 5);
  shape(c, () => polyP(c, [[30, 600], [110, 530], [190, 600]]), COL.brown, 5);
  const k = geo(900, 800, 400);
  figure(c, k);
  for (const x of [790, 850, 910, 970, 1030]) shape(c, () => rrect(c, x, 610, 24, 190, 4), COL.wood, 5);
  shape(c, () => rrect(c, 780, 650, 280, 20, 4), COL.woodDk, 5); shape(c, () => rrect(c, 780, 740, 280, 20, 4), COL.woodDk, 5);
  const m = geo(520, 800, 500, false, true), top = m.hy - m.head * 1.05;
  const B: [number, number] = [m.x + 82, top - 20];
  figure(c, m, undefined, reach(m, "R", B[0], B[1], 1));
  shape(c, () => polyP(c, [[m.x - 80, top - 62], [m.x + 80, top - 62], [m.x + 62, top + 2], [m.x - 62, top + 2]]), COL.brown, 6);
  for (let i = 0; i < 14; i++) { const x = m.x - 66 + (i % 7) * 22, y = top - 70 - (i < 7 ? 0 : 18) + (i % 2) * 8; shape(c, () => ell(c, x, y, 11, 11), WHITE, 4); }
  handDot(c, m, B[0], B[1]);
  shape(c, () => ell(c, m.x, m.hy + m.head * 0.45, m.head * 0.2, m.head * 0.22), INK, 0);
  sound(c, m.x - 20, m.hy + m.head * 0.4, PI, [95, 150, 205, 260], 7, 0.5, [1, 0.6, 0.35, 0.18]);
  sound(c, m.x + 20, m.hy + m.head * 0.4, 0, [95, 140], 9, 0.5);
};

export const ic_soundHearingL1 = cards("sci.sound.hearing.L1", [setup0, setup1, setup2, flowE1, flowA1, flowA2, flowA3, flowP1, term0, term1, term3, expl1]);
