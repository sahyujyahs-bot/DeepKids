import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, cards, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, plate, leaf, hand, person, write } from "./flatKit";

// NATURE IN THE CITY (L2) · set-up cards for the two experiments, then card pictures.
// Same child and grown-up on every card (person()). Light from the upper left.

const FLOOR = "#dccab0", WALL = "#f6efe0", PAVE = "#cfc6b6", PAVE_DK = "#b9ae9c", ROAD = "#8f8a86", SKY = "#cfe7f6";
const SHADE = "rgba(43,35,64,0.22)";
const GY = 860; // where feet stand on an indoor card

// ---------------------------------------------------------------- places
const room = (c: Ctx) => { ground(c, WALL); c.fillStyle = FLOOR; c.fillRect(0, GY, D, D - GY); line(c, [[0, GY], [D, GY]], 5); };
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.35, y + Math.sin(a) * r * 1.35], [x + Math.cos(a) * r * 1.85, y + Math.sin(a) * r * 1.85]], 7, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
};
const railing = (c: Ctx, top: number, bot: number) => {
  for (let x = 40; x < D; x += 64) line(c, [[x, top + 10], [x, bot]], 9, COL.steelDk);
  shape(c, () => rrect(c, -10, top - 8, D + 20, 24, 8), COL.steel);
};
// a round street tree: trunk base at (x, y), scale s (1 = canopy about 340 wide)
const tree = (c: Ctx, x: number, y: number, s: number) => {
  const trunk = () => { c.moveTo(x - 26 * s, y); c.lineTo(x - 18 * s, y - 150 * s); c.lineTo(x + 18 * s, y - 150 * s); c.lineTo(x + 26 * s, y); c.closePath(); };
  shape(c, trunk, COL.brown); shade(c, trunk, COL.soilDk, 12 * s, 0, 0.4);
  const blobs: number[][] = [[0, -250, 110], [-110, -210, 85], [110, -215, 85], [-60, -300, 80], [65, -305, 78], [0, -190, 70]];
  blobs.forEach(([bx, by, r]) => shape(c, () => ell(c, x + bx * s, y + by * s, r * s, r * s), COL.green, 5));
  blobs.forEach(([bx, by, r]) => shade(c, () => ell(c, x + bx * s, y + by * s, r * s, r * s), COL.greenDk, 24 * s, 16 * s, 0.35));
};
const treeShade = (c: Ctx, x: number, y: number, rx: number, ry: number) => { c.beginPath(); ell(c, x, y, rx, ry); c.fillStyle = SHADE; c.fill(); };

// ---------------------------------------------------------------- things
const stool = (c: Ctx, x: number, y: number) => { // top at (x, y), standing on GY
  for (const s of [-1, 1]) line(c, [[x + s * 62, y + 10], [x + s * 74, GY - 4]], 14, INK), line(c, [[x + s * 62, y + 10], [x + s * 74, GY - 4]], 6, COL.woodDk);
  const top = () => rrect(c, x - 90, y - 16, 180, 32, 10);
  shape(c, top, COL.wood); shade(c, top, COL.woodDk, 0, 14, 0.6);
};
// a phone standing upright, bottom centre at (x, y), with a loudspeaker sign on the screen
const phone = (c: Ctx, x: number, y: number) => {
  shape(c, () => rrect(c, x - 34, y - 124, 68, 124, 12), COL.black, 5);
  shape(c, () => rrect(c, x - 27, y - 112, 54, 100, 6), COL.teal, 3);
  shape(c, () => polyP(c, [[x - 16, y - 70], [x - 6, y - 70], [x + 6, y - 82], [x + 6, y - 42], [x - 6, y - 54], [x - 16, y - 54]]), WHITE, 3);
  for (let i = 0; i < 2; i++) { c.beginPath(); c.arc(x + 6, y - 62, 12 + i * 9, -0.9, 0.9); c.strokeStyle = WHITE; c.lineWidth = 3.5; c.stroke(); }
};
// a zigzag of noise from (x, y) along angle an
const zig = (c: Ctx, x: number, y: number, an: number, len: number, w = 8, col = RED) => {
  const pts: number[][] = [], n = 7, amp = 13;
  for (let i = 0; i <= n; i++) { const t = (i / n) * len, off = i === 0 || i === n ? 0 : i % 2 ? amp : -amp; pts.push([x + Math.cos(an) * t - Math.sin(an) * off, y + Math.sin(an) * t + Math.cos(an) * off]); }
  line(c, pts, w, col);
};
// loud noise bursting out of a phone whose top is at (x, y)
const noise = (c: Ctx, x: number, y: number) => { for (const a of [-1.75, -1.2, -2.3, -0.7, -2.75]) zig(c, x + Math.cos(a) * 24, y + Math.sin(a) * 24, a, a === -1.75 ? 150 : 125); };
// sound arcs leaving a mouth at (mx, my) toward dir (1 right, -1 left); loud = thick and big
const voice = (c: Ctx, mx: number, my: number, dir: number, loud: boolean) => {
  const n = loud ? 4 : 3, w = loud ? 8 : 3.5, step = loud ? 30 : 20, r0 = loud ? 42 : 34, a0 = dir > 0 ? 0 : Math.PI;
  c.strokeStyle = INK; c.lineWidth = w; c.lineCap = "round";
  for (let i = 0; i < n; i++) { c.beginPath(); c.arc(mx + dir * 14, my, r0 + i * step, a0 - 0.6, a0 + 0.6); c.stroke(); }
};
// a word list on a sheet of paper, bottom centre at (x, y): ten short lines
const wordList = (c: Ctx, x: number, y: number) => {
  shape(c, () => rrect(c, x - 48, y - 130, 96, 130, 6), COL.paper, 5);
  for (let i = 0; i < 10; i++) line(c, [[x - 32, y - 115 + i * 11.5], [x - 32 + 36 + (i % 3) * 12, y - 115 + i * 11.5]], 3, COL.greyDk);
};
// an ice cube, bottom centre of its front face at (x, y), edge s
const ice = (c: Ctx, x: number, y: number, s: number) => {
  const d = s * 0.42, dy = d * 0.55;
  shape(c, () => polyP(c, [[x - s / 2, y - s], [x - s / 2 + d, y - s - dy], [x + s / 2 + d, y - s - dy], [x + s / 2, y - s]]), "#f4fbff", 5);
  shape(c, () => polyP(c, [[x + s / 2, y - s], [x + s / 2 + d, y - s - dy], [x + s / 2 + d, y - dy], [x + s / 2, y]]), "#b5d9ef", 5);
  shape(c, () => polyP(c, [[x - s / 2, y - s], [x + s / 2, y - s], [x + s / 2, y], [x - s / 2, y]]), "#dff1fb", 5);
  shine(c, [[x - s * 0.32, y - s * 0.78], [x - s * 0.32, y - s * 0.4]], 6);
};
const puddle = (c: Ctx, x: number, y: number, rx: number, ry: number) => shape(c, () => ell(c, x, y, rx, ry), COL.water, 4);
// a leafy potted plant standing at (x, y) (bottom of the pot)
const plant = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 14, y + 4, 90, 16);
  const pot = () => polyP(c, [[x - 70, y - 120], [x + 70, y - 120], [x + 56, y], [x - 56, y]]);
  shape(c, pot, "#c9623a"); shade(c, pot, "#9b4729", 30, 0, 0.5);
  shape(c, () => rrect(c, x - 78, y - 136, 156, 28, 8), "#d8744b");
  const top = y - 150;
  for (const [a, l] of [[-2.9, 150], [-2.45, 165], [-2.0, 150], [-1.57, 170], [-1.15, 150], [-0.7, 165], [-0.25, 150]]) { line(c, [[x, y - 125], [x + Math.cos(a) * 30, top + Math.sin(a) * 30]], 6, COL.leafDk); leaf(c, x + Math.cos(a) * 30, top + Math.sin(a) * 30, l, a); }
  for (const [a, l] of [[-2.7, 110], [-2.2, 125], [-1.57, 120], [-0.95, 125], [-0.45, 110]]) leaf(c, x, top - 10, l, a, COL.greenLt);
};
// a small clock showing ten minutes past the hour
const clock = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), WHITE);
  for (let i = 0; i < 12; i++) { const a = (i / 6) * Math.PI; line(c, [[x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8], [x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9]], i % 3 ? 3 : 5); }
  line(c, [[x, y], [x, y - r * 0.5]], 6); line(c, [[x, y], [x + Math.cos(-Math.PI / 2 + Math.PI / 3) * r * 0.72, y + Math.sin(-Math.PI / 2 + Math.PI / 3) * r * 0.72]], 5, RED);
  shape(c, () => ell(c, x, y, 6, 6), INK, 0);
};
// a side-view parked car, wheels on the ground at y, middle x
const car = (c: Ctx, x: number, y: number, col = COL.red) => {
  shadow(c, x + 12, y + 2, 150, 14);
  const body = () => { c.moveTo(x - 140, y - 24); c.lineTo(x - 140, y - 68); c.lineTo(x - 95, y - 74); c.lineTo(x - 70, y - 118); c.lineTo(x + 60, y - 118); c.lineTo(x + 100, y - 74); c.lineTo(x + 140, y - 66); c.lineTo(x + 140, y - 24); c.closePath(); };
  shape(c, body, col); shade(c, body, COL.black, 0, 60, 0.25);
  shape(c, () => polyP(c, [[x - 60, y - 78], [x - 44, y - 108], [x - 6, y - 108], [x - 6, y - 78]]), COL.sky, 4);
  shape(c, () => polyP(c, [[x + 6, y - 78], [x + 6, y - 108], [x + 52, y - 108], [x + 80, y - 78]]), COL.sky, 4);
  for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * 88, y - 26, 28, 28), COL.black); shape(c, () => ell(c, x + s * 88, y - 26, 11, 11), COL.grey, 3); }
};
// a side-view bus, wheels on the ground at y, middle x
const bus = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 16, y + 2, 200, 16);
  const body = () => rrect(c, x - 190, y - 250, 380, 222, 22);
  shape(c, body, COL.orange); shade(c, body, "#c9741c", 0, 150, 0.35);
  for (let i = 0; i < 4; i++) shape(c, () => rrect(c, x - 168 + i * 90, y - 222, 72, 80, 8), COL.sky, 4);
  shape(c, () => rrect(c, x - 170, y - 120, 340, 14, 6), COL.yellow, 3);
  for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * 120, y - 30, 32, 32), COL.black); shape(c, () => ell(c, x + s * 120, y - 30, 12, 12), COL.grey, 3); }
  shape(c, () => ell(c, x - 178, y - 70, 12, 12), COL.yellow, 3);
};

// ---------------------------------------------------------------- animals
// a street dog fast asleep, side view, head to the left, lying on the ground at y under its body middle x
const dog = (c: Ctx, x: number, y: number, s: number) => {
  const col = "#b98a5a", dk = "#8f6539";
  shadow(c, x + 12 * s, y + 3, 120 * s, 12 * s);
  line(c, [[x + 72 * s, y - 34 * s], [x + 112 * s, y - 54 * s], [x + 128 * s, y - 30 * s]], 14 * s, INK); line(c, [[x + 72 * s, y - 34 * s], [x + 112 * s, y - 54 * s], [x + 128 * s, y - 30 * s]], 7 * s, col);
  shape(c, () => ell(c, x, y - 32 * s, 84 * s, 32 * s), col); shade(c, () => ell(c, x, y - 32 * s, 84 * s, 32 * s), dk, 10 * s, 12 * s, 0.4);
  shape(c, () => ell(c, x - 24 * s, y - 9 * s, 34 * s, 10 * s), col, 4); shape(c, () => ell(c, x + 38 * s, y - 9 * s, 34 * s, 10 * s), col, 4);
  shape(c, () => ell(c, x - 88 * s, y - 26 * s, 38 * s, 27 * s), col);
  shape(c, () => ell(c, x - 122 * s, y - 20 * s, 18 * s, 13 * s), col, 4);
  shape(c, () => ell(c, x - 136 * s, y - 24 * s, 6 * s, 5 * s), INK, 0);
  shape(c, () => ell(c, x - 72 * s, y - 46 * s, 13 * s, 22 * s, 0.5), dk, 4);
  c.beginPath(); c.arc(x - 96 * s, y - 32 * s, 8 * s, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 3.5; c.stroke();
};
// a pigeon standing, side view facing dir, feet at (x, y)
const pigeon = (c: Ctx, x: number, y: number, s: number, dir = -1) => {
  const col = "#8f98a8", dk = "#6c7585";
  shape(c, () => polyP(c, [[x - dir * 14 * s, y - 22 * s], [x - dir * 40 * s, y - 14 * s], [x - dir * 38 * s, y - 4 * s], [x - dir * 10 * s, y - 10 * s]]), dk, 4);
  for (const d of [-7, 7]) line(c, [[x + d * s, y - 10 * s], [x + d * s + dir * 3 * s, y]], 4, COL.red);
  shape(c, () => ell(c, x, y - 24 * s, 26 * s, 16 * s), col); shade(c, () => ell(c, x, y - 24 * s, 26 * s, 16 * s), dk, 6 * s, 6 * s, 0.4);
  shape(c, () => ell(c, x + dir * 26 * s, y - 36 * s, 11 * s, 10 * s), col, 4);
  shape(c, () => polyP(c, [[x + dir * 36 * s, y - 38 * s], [x + dir * 46 * s, y - 34 * s], [x + dir * 36 * s, y - 31 * s]]), COL.yellow, 3);
  shape(c, () => ell(c, x + dir * 28 * s, y - 38 * s, 2.5 * s, 2.5 * s), INK, 0);
};
// a crow standing, side view facing dir, feet at (x, y)
const crow = (c: Ctx, x: number, y: number, s: number, dir = -1) => {
  const col = COL.black;
  shape(c, () => polyP(c, [[x - dir * 16 * s, y - 24 * s], [x - dir * 48 * s, y - 14 * s], [x - dir * 44 * s, y - 2 * s], [x - dir * 12 * s, y - 10 * s]]), col, 4);
  for (const d of [-7, 7]) line(c, [[x + d * s, y - 10 * s], [x + d * s + dir * 3 * s, y]], 4, INK);
  shape(c, () => ell(c, x, y - 26 * s, 28 * s, 17 * s), col);
  shape(c, () => ell(c, x + dir * 28 * s, y - 42 * s, 13 * s, 12 * s), col, 4);
  shape(c, () => polyP(c, [[x + dir * 40 * s, y - 46 * s], [x + dir * 58 * s, y - 40 * s], [x + dir * 40 * s, y - 36 * s]]), COL.greyDk, 3);
  shape(c, () => ell(c, x + dir * 30 * s, y - 44 * s, 3.5 * s, 3.5 * s), WHITE, 0);
};
// a stick nest in a fork, centre (x, y)
const nest = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - 60 * s, y - 10 * s); c.quadraticCurveTo(x, y + 50 * s, x + 60 * s, y - 10 * s); c.closePath(); }, COL.brown, 4);
  for (let i = 0; i < 9; i++) { const a = -0.4 + i * 0.35; line(c, [[x - 55 * s + i * 14 * s, y - 12 * s], [x - 55 * s + i * 14 * s + Math.cos(a) * 26 * s, y - 12 * s + Math.sin(a) * 14 * s]], 3, COL.soilDk); }
  shape(c, () => ell(c, x, y - 10 * s, 62 * s, 10 * s), COL.soilDk, 4);
};
// a palm squirrel clinging to a trunk, head up, at (x, y) = middle of its body
const squirrel = (c: Ctx, x: number, y: number, s: number) => {
  const col = "#a87c4f", dk = "#7f5a35";
  const tail = () => { c.moveTo(x + 8 * s, y + 30 * s); c.bezierCurveTo(x + 70 * s, y + 40 * s, x + 80 * s, y - 50 * s, x + 30 * s, y - 60 * s); c.bezierCurveTo(x + 60 * s, y - 30 * s, x + 56 * s, y + 10 * s, x + 14 * s, y + 10 * s); c.closePath(); };
  shape(c, tail, dk, 5);
  shape(c, () => ell(c, x, y, 16 * s, 34 * s), col);
  for (const d of [-7, 0, 7]) line(c, [[x + d * s, y - 24 * s], [x + d * s, y + 24 * s]], 2.5 * s, COL.paper);
  shape(c, () => ell(c, x, y - 42 * s, 13 * s, 12 * s), col, 4);
  shape(c, () => ell(c, x - 8 * s, y - 52 * s, 4 * s, 5 * s), col, 3); shape(c, () => ell(c, x + 8 * s, y - 52 * s, 4 * s, 5 * s), col, 3);
  shape(c, () => ell(c, x - 5 * s, y - 44 * s, 2.5 * s, 2.5 * s), INK, 0);
  for (const d of [-1, 1]) line(c, [[x + d * 12 * s, y - 20 * s], [x + d * 22 * s, y - 10 * s]], 5 * s, dk), line(c, [[x + d * 12 * s, y + 20 * s], [x + d * 22 * s, y + 30 * s]], 5 * s, dk);
};
// a house gecko on a wall, head up, body middle (x, y)
const gecko = (c: Ctx, x: number, y: number, s: number) => {
  const col = "#e2d3b0";
  line(c, [[x, y + 20 * s], [x + 8 * s, y + 50 * s], [x - 10 * s, y + 80 * s]], 12 * s, INK); line(c, [[x, y + 20 * s], [x + 8 * s, y + 50 * s], [x - 10 * s, y + 80 * s]], 6 * s, col);
  for (const d of [-1, 1]) { line(c, [[x + d * 8 * s, y - 12 * s], [x + d * 26 * s, y - 24 * s]], 5 * s, col); line(c, [[x + d * 8 * s, y + 12 * s], [x + d * 26 * s, y + 24 * s]], 5 * s, col); }
  shape(c, () => ell(c, x, y, 11 * s, 26 * s), col, 4);
  shape(c, () => ell(c, x, y - 32 * s, 10 * s, 11 * s), col, 4);
  shape(c, () => ell(c, x - 4 * s, y - 34 * s, 2.2 * s, 2.2 * s), INK, 0); shape(c, () => ell(c, x + 4 * s, y - 34 * s, 2.2 * s, 2.2 * s), INK, 0);
};
// a line of ants walking along the points
const ants = (c: Ctx, pts: number[][], s: number) => {
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1], an = Math.atan2(by - ay, bx - ax);
    for (let t = 0; t < 1; t += 0.5) { const x = ax + (bx - ax) * t, y = ay + (by - ay) * t;
      for (const k of [-1, 0, 1]) shape(c, () => ell(c, x + Math.cos(an) * k * 6 * s, y + Math.sin(an) * k * 6 * s, 3.2 * s, 2.6 * s), INK, 0);
      for (const k of [-1, 0, 1]) line(c, [[x + Math.cos(an) * k * 4 * s - Math.sin(an) * 5 * s, y + Math.sin(an) * k * 4 * s + Math.cos(an) * 5 * s], [x + Math.cos(an) * k * 4 * s + Math.sin(an) * 5 * s, y + Math.sin(an) * k * 4 * s - Math.cos(an) * 5 * s]], 1.5, INK); }
  }
};

// ---------------------------------------------------------------- people on the cards
const CH = 520, AD = 700; // heights
const childMouth = (x: number, y: number) => [x, y - CH * 0.67 - CH * 0.15 * 1.12 + CH * 0.15 * 0.46];
const adultMouth = (x: number, y: number) => [x, y - AD * 0.76 - AD * 0.115 * 1.12 + AD * 0.115 * 0.46];
const adultWithList = (c: Ctx, x: number, loud: boolean | null, dir: number) => {
  const sh = GY - AD * 0.76;
  const hands = person(c, x, GY, AD, { adult: true, reachR: [x + 62, sh + 150], dir: dir as 1 | -1 });
  wordList(c, hands.handR[0], hands.handR[1] - 6);
  if (loud !== null) { const [mx, my] = adultMouth(x, GY); voice(c, mx + dir * 50, my, dir, loud); }
};

// ---------------------------------------------------------------- set-up cards: Words in the Noise
const e1s0 = (c: Ctx) => {
  room(c);
  shape(c, () => polyP(c, [[0, 0], [150, 130], [150, GY], [0, 1010]]), "#e8dcc3");
  person(c, 270, GY, CH, { dir: -1 });
  for (let i = 0; i < 5; i++) { const x = 400 + i * 90, y = 955 + (i % 2 ? -14 : 14); shape(c, () => ell(c, x, y, 16, 26, i % 2 ? -0.25 : 0.25), COL.greyDk, 3); }
  write(c, "5", 540, 1000, 58, RED, 8);
  adultWithList(c, 830, null, -1);
};
const e1s1 = (c: Ctx) => {
  room(c);
  adultWithList(c, 270, false, 1);
  person(c, 810, GY, CH, { dir: -1 });
  const [mx, my] = childMouth(810, GY); voice(c, mx - 40, my, -1, false);
};
const e1s2 = (c: Ctx) => {
  room(c);
  adultWithList(c, 230, false, 1);
  stool(c, 620, 710); phone(c, 620, 694); noise(c, 620, 570);
  person(c, 870, GY, CH, { dir: -1 });
};
const e1s3 = (c: Ctx) => {
  room(c);
  adultWithList(c, 230, true, 1);
  stool(c, 620, 710); phone(c, 620, 694); noise(c, 620, 570);
  person(c, 870, GY, CH, { dir: -1 });
  const [mx, my] = childMouth(870, GY); voice(c, mx - 40, my, -1, false);
};

// ---------------------------------------------------------------- set-up cards: Sun or Shade
const balcony = (c: Ctx) => { ground(c, "#e6d9c0"); c.fillStyle = PAVE; c.fillRect(0, 230, D, D - 230); line(c, [[0, 230], [D, 230]], 5); for (let x = 0; x < D; x += 180) line(c, [[x, 230], [x, D]], 3, PAVE_DK); for (let y = 410; y < D; y += 180) line(c, [[0, y], [D, y]], 3, PAVE_DK); railing(c, 40, 230); };
const sunAndShade = (c: Ctx, after: boolean) => {
  balcony(c);
  sun(c, 150, 420, 70);
  plant(c, 800, 560);
  treeShade(c, 760, 760, 250, 110);
  plate(c, 330, 700, 170, 70); plate(c, 760, 770, 170, 70);
  if (after) { puddle(c, 330, 706, 80, 26); shape(c, () => { c.moveTo(302, 704); c.quadraticCurveTo(312, 672, 338, 676); c.quadraticCurveTo(362, 680, 356, 706); c.closePath(); }, "#dff1fb", 4); puddle(c, 760, 778, 55, 16); ice(c, 760, 776, 74); clock(c, 520, 380, 70); }
  else { ice(c, 330, 706, 88); ice(c, 760, 776, 88); }
};
const e2s0 = (c: Ctx) => sunAndShade(c, false);
const e2s1 = (c: Ctx) => sunAndShade(c, true);

// ---------------------------------------------------------------- card pictures
// flow.e1: the three towers of blocks, 9, 2 and 8 words heard
const flowE1 = (c: Ctx) => {
  ground(c);
  const base = 790, cols = [COL.green, COL.red, COL.blue], counts = [9, 2, 8], xs = [230, 520, 790];
  line(c, [[90, base], [990, base]], 6);
  counts.forEach((n, i) => {
    const x = xs[i];
    for (let k = 0; k < n; k++) { const b = () => rrect(c, x - 60, base - 46 * (k + 1) - 2, 120, 44, 7); shape(c, b, cols[i], 5); shade(c, b, INK, 0, 26, 0.18); }
    write(c, String(n), x - 18, base - 46 * n - 78, 56, INK, 8);
    // under the line: noise or no noise, then the voice
    const zy = base + 70;
    zig(c, x - 110, zy, 0, 90, 7, i ? RED : COL.greyDk);
    if (!i) line(c, [[x - 110, zy + 36], [x - 20, zy - 36]], 8, RED);
    voice(c, x + 40, zy, 1, i === 2);
    write(c, String(i + 1), x - 16, 930, 46, COL.greyDk, 6);
  });
};
// flow.e2: the child sits on the balcony watching the two plates
const flowE2 = (c: Ctx) => {
  balcony(c);
  sun(c, 150, 400, 66);
  plant(c, 840, 560);
  treeShade(c, 800, 790, 230, 100);
  plate(c, 560, 740, 130, 54); plate(c, 800, 800, 130, 54);
  ice(c, 560, 744, 68); ice(c, 800, 804, 68);
  const h = 480, x = 250, y = 900;
  person(c, x, y, h, { sit: true, dir: 1, reachL: [x - 115, y - 40], reachR: [x + 115, y - 40] });
};
// flow.a1: window watch from the balcony
const flowA1 = (c: Ctx) => {
  ground(c, SKY);
  c.fillStyle = ROAD; c.fillRect(0, 640, D, 160); line(c, [[0, 640], [D, 640]], 5);
  // the building across the road, with window ledges
  shape(c, () => polyP(c, [[0, 100], [300, 100], [300, 640], [0, 640]]), "#e9c9a6");
  for (let r = 0; r < 3; r++) for (let k = 0; k < 2; k++) { const wx = 50 + k * 130, wy = 150 + r * 160; shape(c, () => rrect(c, wx, wy, 80, 90, 4), COL.sky, 4); shape(c, () => rrect(c, wx - 10, wy + 90, 100, 16, 3), COL.grey, 4); }
  pigeon(c, 230, 240, 1.1, -1); pigeon(c, 90, 560, 1.1, 1);
  tree(c, 560, 640, 0.95);
  crow(c, 470, 420, 0.9, 1);
  car(c, 760, 640, COL.blue);
  dog(c, 990, 640, 0.55);
  // the child on the balcony, holding the notebook; the parapet in front of her legs
  const x = 300, y = 1000, sh = y - CH * 0.67;
  const hands = person(c, x, y, CH, { dir: 1, reachL: [x - 70, sh + 150], reachR: [x + 70, sh + 150] });
  const nb = () => rrect(c, (hands.handL[0] + hands.handR[0]) / 2 - 80, hands.handL[1] - 110, 160, 118, 8);
  shape(c, nb, COL.paper, 5); for (let i = 0; i < 5; i++) line(c, [[x - 55, hands.handL[1] - 90 + i * 18], [x + 55, hands.handL[1] - 90 + i * 18]], 3, COL.greyDk);
  c.fillStyle = "#d9cdb8"; c.fillRect(0, 800, D, D - 800); line(c, [[0, 800], [D, 800]], 5);
  for (let bx = 40; bx < D; bx += 70) line(c, [[bx, 810], [bx, 1060]], 10, COL.steelDk);
  shape(c, () => rrect(c, -10, 790, D + 20, 22, 8), COL.steel);
};
// flow.a2: on the walk, standing in the sun, the child points at a dog resting in the shade of a big tree
const flowA2 = (c: Ctx) => {
  ground(c, SKY);
  sun(c, 540, 150, 70);
  c.fillStyle = PAVE; c.fillRect(0, 700, D, D - 700); line(c, [[0, 700], [D, 700]], 5);
  tree(c, 820, 760, 1.1);
  treeShade(c, 760, 870, 300, 110);
  const dx = 760, dy = 900;
  dog(c, dx, dy, 0.8);
  for (let i = 0; i < 3; i++) { const x = 300 + i * 60; line(c, [[x, 690], [x + 12, 650], [x - 12, 610], [x, 570]], 5, COL.orange); }
  person(c, 170, GY, AD, { adult: true, dir: 1 });
  // the pointing hand lies on the line from the shoulder to the dog
  const x = 370, sx = x + CH * 0.25 * 0.42, sy = GY - CH * 0.67 + CH * 0.03, an = Math.atan2(dy - 20 - sy, dx - sx);
  person(c, x, GY, CH, { dir: 1, reachR: [sx + Math.cos(an) * 160, sy + Math.sin(an) * 160] });
};
// flow.a3: the map of homes drawn on a big sheet
const flowA3 = (c: Ctx) => {
  ground(c, COL.wood);
  shadow(c, 560, 580, 440, 420);
  shape(c, () => rrect(c, 110, 110, 860, 860, 14), COL.paper, 6);
  // the drawn street: a building, a tree, a lamp post, a drain, a wall of road
  c.fillStyle = "#cfd6de"; c.fillRect(140, 760, 800, 150); line(c, [[140, 760], [940, 760]], 4);
  shape(c, () => rrect(c, 170, 260, 240, 500, 6), "#f1cfa8", 5);
  for (let r = 0; r < 3; r++) { shape(c, () => rrect(c, 210, 300 + r * 140, 70, 80, 4), COL.sky, 4); shape(c, () => rrect(c, 300, 300 + r * 140, 70, 80, 4), COL.sky, 4); shape(c, () => rrect(c, 200, 380 + r * 140, 180, 14, 3), COL.grey, 3); }
  pigeon(c, 250, 380, 1.0, 1); pigeon(c, 340, 520, 1.0, -1);
  tree(c, 600, 760, 0.7); nest(c, 600, 560, 0.7); crow(c, 600, 560, 0.75, 1);
  line(c, [[830, 760], [830, 330]], 14, INK); line(c, [[830, 760], [830, 330]], 7, COL.steelDk);
  shape(c, () => rrect(c, 800, 290, 60, 48, 10), COL.yellow, 5);
  gecko(c, 880, 400, 1.0);
  shape(c, () => rrect(c, 700, 780, 110, 40, 5), COL.greyDk, 4); for (let i = 0; i < 4; i++) line(c, [[715 + i * 26, 786], [715 + i * 26, 814]], 4, INK);
  ants(c, [[560, 850], [640, 820], [700, 800]], 1.2);
  // crayons beside the sheet
  for (const [cx, col] of [[1000, COL.red], [1030, COL.green], [1060, COL.blue]] as [number, string][]) { shape(c, () => rrect(c, cx - 11, 600, 22, 200, 5), col, 4); shape(c, () => polyP(c, [[cx - 11, 600], [cx, 572], [cx + 11, 600]]), col, 4); }
};
// flow.p1: the diary open at a page with a squirrel on a tree and one sentence
const flowP1 = (c: Ctx) => {
  ground(c, FLOOR);
  shadow(c, 560, 600, 460, 330);
  for (const s of [-1, 1]) { const pg = () => rrect(c, 540 + (s < 0 ? -430 : 0), 250, 430, 640, 10); shape(c, pg, COL.paper, 6); }
  line(c, [[540, 250], [540, 890]], 6);
  for (let i = 0; i < 7; i++) shape(c, () => ell(c, 540, 290 + i * 90, 14, 14), COL.steelDk, 4);
  // the drawing: a trunk with a squirrel
  const trunk = () => polyP(c, [[260, 840], [285, 300], [395, 300], [420, 840]]);
  shape(c, trunk, COL.brown, 5); shade(c, trunk, COL.soilDk, 20, 0, 0.3);
  squirrel(c, 320, 560, 2.2);
  // the sentence: three lines of writing
  for (let i = 0; i < 3; i++) { const y = 330 + i * 56, pts: number[][] = []; for (let x = 600; x <= 900 - (i === 2 ? 120 : 0); x += 12) pts.push([x, y + (Math.floor(x / 12) % 2 ? -8 : 8)]); line(c, pts, 4, COL.blueDk); }
  // a pencil lying on the right page
  c.save(); c.translate(760, 760); c.rotate(-0.35);
  shape(c, () => rrect(c, -150, -16, 270, 32, 6), COL.yellow, 5); shape(c, () => polyP(c, [[120, -16], [165, 0], [120, 16]]), "#f1cfa8", 4); shape(c, () => polyP(c, [[152, -5], [165, 0], [152, 5]]), INK, 0);
  shape(c, () => rrect(c, -150, -16, 34, 32, 6), COL.pink, 4);
  c.restore();
};
// term.4 Noise: a girl calls to a friend across a road, a bus and its horn between them
const term4 = (c: Ctx) => {
  ground(c, SKY);
  c.fillStyle = ROAD; c.fillRect(0, 700, D, 130); c.fillStyle = PAVE; c.fillRect(0, 830, D, D - 830); line(c, [[0, 700], [D, 700]], 5); line(c, [[0, 830], [D, 830]], 5);
  for (let x = 40; x < D; x += 120) line(c, [[x, 765], [x + 60, 765]], 6, WHITE);
  bus(c, 540, 790);
  for (const a of [-2.2, -1.57, -0.95]) zig(c, 540 + Math.cos(a) * 30, 530 + Math.sin(a) * 30, a, 150, 10);
  const x1 = 170, x2 = 910, y = GY;
  const [mx, my] = childMouth(x1, y);
  person(c, x1, y, CH, { dir: 1, reachL: [x1 - 50, my + 14], reachR: [x1 + 50, my + 14] });
  voice(c, mx + 60, my, 1, true);
  const sh2 = y - CH * 0.67, hy2 = sh2 - CH * 0.15 * 1.12;
  person(c, x2, y, CH, { dir: -1, reachL: [x2 - 84, hy2 + 14] });
};
// expl.0: a cut-away building and street, who lives where
const expl0 = (c: Ctx) => {
  ground(c, SKY);
  c.fillStyle = ROAD; c.fillRect(0, 820, D, D - 820); line(c, [[0, 820], [D, 820]], 5);
  // the building: front wall cut away on the ground floor to show the kitchen floor and its tiles
  shape(c, () => rrect(c, 60, 90, 440, 730, 6), "#e9c9a6", 6);
  for (let k = 0; k < 2; k++) { const wx = 120 + k * 200, wy = 150; shape(c, () => rrect(c, wx, wy, 90, 100, 4), COL.sky, 4); shape(c, () => rrect(c, wx - 12, wy + 100, 114, 18, 3), COL.grey, 4); }
  pigeon(c, 170, 250, 1.1, 1); pigeon(c, 380, 250, 1.1, -1);
  // first floor: a balcony with a tube light and a gecko beside it
  shape(c, () => rrect(c, 90, 350, 380, 230, 4), "#f6ecd8", 5);
  shape(c, () => rrect(c, 90, 560, 380, 22, 3), COL.grey, 4); for (let bx = 110; bx < 470; bx += 40) line(c, [[bx, 500], [bx, 560]], 6, COL.steelDk); line(c, [[90, 500], [470, 500]], 8, COL.steel);
  shape(c, () => rrect(c, 150, 385, 160, 22, 11), "#f7fbe8", 4); for (let i = 0; i < 5; i++) line(c, [[150 + i * 20, 430 + i * 12], [340 + i * 20, 430 + i * 12]], 3, "rgba(255,250,200,0.6)");
  gecko(c, 390, 440, 1.0);
  // ground floor cut away: kitchen tiles, and ants in the gap under them
  shape(c, () => rrect(c, 90, 620, 380, 200, 4), "#fbf5ea", 5);
  for (let i = 0; i < 6; i++) shape(c, () => rrect(c, 100 + i * 62, 740, 56, 36, 3), "#d7dde3", 3);
  c.fillStyle = COL.soil; c.fillRect(96, 784, 374, 32); line(c, [[96, 784], [470, 784]], 3);
  ants(c, [[130, 800], [230, 800], [330, 800], [430, 800]], 0.9);
  // the tree with a crow in a nest, the car with a dog under it
  tree(c, 760, 820, 1.0); nest(c, 760, 560, 0.9); crow(c, 760, 560, 0.9, -1);
  car(c, 840, 1000, COL.blue);
  dog(c, 840, 1000, 0.42);
};

export const ic_habitatsCityNatureL2 = cards("sci.habitats.city-nature.L2", [e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, flowE1, flowE2, flowA1, flowA2, flowA3, flowP1, term4, expl0]);
