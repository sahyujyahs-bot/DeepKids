import type { Ctx } from "./core";
import { COL, CLOTH, RED, SKIN, INK, D, WHITE, arrow, cards, ell, ground, hand, line, person, plate, rrect, shade, shadow, shape, shine, write } from "./flatKit";

// sci.motion.newtons-laws.L3 set-up cards: socks drop, spinning eggs, marble ramp.

const FLOOR = "#e6d6b3";
// a hall: pale wall above, tiled floor below the horizon
const hall = (c: Ctx, hz: number) => {
  ground(c); c.fillStyle = FLOOR; c.fillRect(0, hz, D, D - hz);
  c.strokeStyle = "rgba(43,35,64,0.14)"; c.lineWidth = 3;
  for (let x = -60; x < D + 140; x += 135) { c.beginPath(); c.moveTo(x, hz); c.lineTo(x - (x - 540) * 0.35, D); c.stroke(); }
  for (let k = 0; k < 6; k++) { const y = hz + (D - hz) * (k / 5) ** 1.5 + 50 * (k > 0 ? 1 : 0); c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
  line(c, [[0, hz], [D, hz]], 6);
};
const floorTop = (c: Ctx) => {
  ground(c, FLOOR); c.strokeStyle = "rgba(43,35,64,0.16)"; c.lineWidth = 3;
  for (let x = 0; x <= D; x += 180) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, D); c.stroke(); c.beginPath(); c.moveTo(0, x); c.lineTo(D, x); c.stroke(); }
};
const sockRoll = (c: Ctx, x: number, y: number, r: number) => {
  const p = () => ell(c, x, y, r, r * 0.82);
  shape(c, p, COL.pink, 6);
  c.save(); c.beginPath(); p(); c.clip();
  for (const k of [-0.55, 0, 0.55]) line(c, [[x + k * r - r * 0.5, y - r], [x + k * r + r * 0.5, y + r]], r * 0.22, COL.cloth);
  c.restore(); shade(c, p, COL.purple, r * 0.3, r * 0.25, 0.3);
  shape(c, () => ell(c, x, y, r, r * 0.82), "rgba(0,0,0,0)", 6);
  line(c, [[x - r * 0.4, y - r * 0.2], [x, y - r * 0.4], [x + r * 0.4, y - r * 0.1], [x, y + r * 0.1], [x - r * 0.3, y + r * 0.2]], 4, COL.purple);
};
const coin = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.3, r, r * 0.4);
  shape(c, () => ell(c, x, y, r, r * 0.6), COL.yellow, 6);
  shade(c, () => ell(c, x, y, r, r * 0.6), COL.orange, r * 0.4, r * 0.2, 0.5);
  shape(c, () => ell(c, x, y, r * 0.7, r * 0.4), "rgba(0,0,0,0)", 3);
};
const marble = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.2, y + r * 0.95, r * 0.9, r * 0.22);
  shape(c, () => ell(c, x, y, r, r), COL.blue, 6);
  shade(c, () => ell(c, x, y, r, r), COL.blueDk, r * 0.5, r * 0.5, 0.7);
  shape(c, () => ell(c, x - r * 0.3, y - r * 0.35, r * 0.25, r * 0.17, -0.6), WHITE, 0);
  line(c, [[x - r * 0.6, y + r * 0.1], [x, y + r * 0.35], [x + r * 0.5, y - r * 0.05]], 4, COL.sky);
};
const arcArrow = (c: Ctx, cx: number, cy: number, rx: number, ry: number, a0: number, a1: number) => {
  const pts: number[][] = []; for (let i = 0; i <= 14; i++) { const a = a0 + ((a1 - a0) * i) / 14; pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
  arrow(c, pts);
};
// a measuring tape laid flat from x0 to x1 at height y, hook end at x0
const tape = (c: Ctx, x0: number, x1: number, y: number) => {
  shadow(c, (x0 + x1) / 2 + 10, y + 26, (x1 - x0) / 2, 12);
  shape(c, () => rrect(c, x0, y - 24, x1 - x0, 48, 4), COL.yellow, 6);
  shade(c, () => rrect(c, x0, y - 24, x1 - x0, 48, 4), COL.orange, 0, 22, 0.35);
  for (let x = x0 + 16, i = 0; x < x1 - 6; x += 16, i++) line(c, [[x, y - 24], [x, y - (i % 5 === 0 ? 2 : 10)]], i % 5 === 0 ? 4 : 3);
  shape(c, () => rrect(c, x0 - 14, y - 32, 14, 64, 3), COL.steel, 5);
};
// an egg lying on its side
const egg = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0) => {
  const p = () => ell(c, x, y, rx, ry * 1.05);
  c.save(); c.translate(x, y); c.rotate(rot); c.translate(-x, -y);
  shadow(c, x + rx * 0.1, y + ry * 1.05, rx * 0.95, ry * 0.3);
  shape(c, p, COL.paper, 6); shade(c, p, COL.grey, rx * 0.3, ry * 0.45, 0.55);
  shine(c, [[x - rx * 0.6, y - ry * 0.35], [x - rx * 0.25, y - ry * 0.75]], 9);
  c.restore();
};
// a pencil letter A to D (letters are not in write())
const LETTER: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.1, 0.65], [0.5, 0.65]]],
  B: [[[0, 0], [0, 1], [0.4, 1], [0.55, 0.78], [0.4, 0.52], [0, 0.52]], [[0.4, 0.52], [0.52, 0.28], [0.4, 0], [0, 0]]],
  C: [[[0.58, 0.15], [0.3, 0], [0.04, 0.3], [0.04, 0.7], [0.3, 1], [0.58, 0.85]]],
  D: [[[0, 0], [0, 1], [0.32, 1], [0.6, 0.72], [0.6, 0.28], [0.32, 0], [0, 0]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number) => LETTER[ch].forEach((st) => line(c, st.map(([u, v]) => [x + u * h, y + v * h]), 7, "#6b6670"));

// a ramp: book, wooden ruler (30 cm), drawn at local scale s with the floor at (ox, floorY); eb = height of
// the ruler's low end above the floor. Returns where a marble of radius 30 sits at distance u along the ruler.
const RL = 520, RT = 36, BK = 190;
const ramp = (c: Ctx, ox: number, floorY: number, s: number, eb: number, u = 70) => {
  const top = -(BK + RT); let a = 0.2; for (let i = 0; i < 8; i++) a = Math.asin((-eb - top - RT * Math.cos(a)) / RL);
  c.save(); c.translate(ox, floorY); c.scale(s, s);
  shadow(c, -90, 8, 190, 20);
  const bk = () => rrect(c, -220, -BK, 250, BK, 8);
  shape(c, bk, COL.cloth, 6);
  for (const k of [60, 100, 140]) line(c, [[-190, -k], [24, -k]], 3, COL.grey);
  shape(c, () => rrect(c, -220, -BK, 250, 22, 8), COL.blue, 6); shape(c, () => rrect(c, -220, -22, 250, 22, 8), COL.blueDk, 6); shape(c, () => rrect(c, -220, -BK, 34, BK, 8), COL.blue, 6);
  c.save(); c.translate(0, top); c.rotate(a);
  shadow(c, RL / 2, RT + 12, RL / 2, 8);
  const rl = () => rrect(c, 0, 0, RL, RT, 5);
  shape(c, rl, COL.wood, 6); shade(c, rl, COL.woodDk, 0, 14, 0.5);
  for (let i = 0; i <= 30; i++) { const x = 8 + i * ((RL - 16) / 30), m = i % 10 === 0 ? 16 : i % 5 === 0 ? 12 : 7; line(c, [[x, 3], [x, 3 + m]], 2.5); }
  for (const n of [10, 20]) write(c, String(n), 8 + n * ((RL - 16) / 30) - 8, 20, 12, INK, 2.5);
  c.restore();
  const mx = Math.cos(a) * u + Math.sin(a) * 36, my = top + Math.sin(a) * u - Math.cos(a) * 36;
  c.restore();
  return { x: ox + mx * s, y: floorY + my * s, endX: ox + (Math.cos(a) * RL - Math.sin(a) * RT) * s };
};

// ---------------------------------------------------------------- e1: socks drop
// setup.e1.0
const e1_0 = (c: Ctx) => {
  hall(c, 400);
  shadow(c, 290, 968, 150, 26);
  person(c, 270, 960, 640, { armR: [0.12, -0.05], armL: [Math.PI * 0.5, Math.PI * 0.5] });
  const wx = 270 + 640 * 0.11 + 640 * 0.17 * Math.cos(0.12) + 640 * 0.16 * Math.cos(-0.05), wy = 960 - 640 * 0.74 + 640 * 0.03 + 640 * 0.17 * Math.sin(0.12) + 640 * 0.16 * Math.sin(-0.05);
  hand(c, wx - 50, wy, 0, 0.62);
  sockRoll(c, wx + 22, wy - 6, 44);
  plate(c, 770, 880, 200, 62);
  line(c, [[270, 1030], [770, 1030]], 6, COL.greyDk); line(c, [[270, 1014], [270, 1046]], 6, COL.greyDk); line(c, [[770, 1014], [770, 1046]], 6, COL.greyDk);
  c.fillStyle = FLOOR; c.fillRect(480, 1000, 100, 60); write(c, "3 m", 485, 1008, 46, INK, 7);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  hall(c, 400);
  shadow(c, 330, 968, 150, 26);
  person(c, 300, 960, 640, { armR: [0.12, -0.05], armL: [Math.PI * 0.5, Math.PI * 0.5] });
  const wx = 300 + 640 * 0.11 + 640 * 0.17 * Math.cos(0.12) + 640 * 0.16 * Math.cos(-0.05), wy = 960 - 640 * 0.74 + 640 * 0.03 + 640 * 0.17 * Math.sin(0.12) + 640 * 0.16 * Math.sin(-0.05);
  arrow(c, [[200, 230], [560, 230]], RED, 16);
  plate(c, wx + 20, 900, 200, 62);
  hand(c, wx - 50, wy, 0.2, 0.62, SKIN.child, CLOTH.child, true);
  sockRoll(c, wx + 30, wy + 90, 44);
  const pts: number[][] = []; for (let k = 0; k <= 12; k++) { const t = k / 12; pts.push([wx + 80 + t * 330, wy + 150 + t * t * (880 - wy - 150)]); }
  arrow(c, pts);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  floorTop(c);
  plate(c, 200, 560, 170, 80);
  tape(c, 380, 800, 560);
  coin(c, 830, 560, 44);
  sockRoll(c, 860, 520, 80);
  write(c, "40 cm", 480, 400, 90, INK, 12);
};
// ---------------------------------------------------------------- e2: spinning eggs
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 580, 470, 330);
  const E: [number, number, string][] = [[380, 470, "A"], [700, 470, "B"], [380, 700, "C"], [700, 700, "D"]];
  E.forEach(([x, y, ch]) => { egg(c, x, y, 125, 82); letter(c, ch, x - 22, y - 34, 68); });
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 700, 470, 290);
  egg(c, 640, 700, 190, 125, 0.1);
  letter(c, "A", 618, 660, 80);
  arcArrow(c, 640, 700, 290, 215, 3.5, 4.8);
  arcArrow(c, 640, 700, 290, 215, 0.35, 1.65);
  hand(c, 400, 640, 0.1, 1.7);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 860, 470, 190);
  egg(c, 540, 790, 200, 130);
  letter(c, "A", 516, 750, 80);
  hand(c, 540, 330, 1.57, 1.7, SKIN.child, CLOTH.child, true);
  arrow(c, [[780, 470], [780, 250]], RED, 14);
  arcArrow(c, 540, 800, 340, 190, 2.5, 3.9);
  arcArrow(c, 540, 800, 340, 190, 5.4, 6.8);
};
// ---------------------------------------------------------------- e3: marble ramp
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c); c.fillStyle = FLOOR; c.fillRect(0, 900, D, D - 900); line(c, [[0, 900], [D, 900]], 6);
  const m = ramp(c, 270, 900, 1.1, 0, 80);
  const an = 0.6, sc = 1.6;
  hand(c, m.x - 100 * sc * Math.cos(an), m.y - 100 * sc * Math.sin(an) - 20, an, sc);
  marble(c, m.x, m.y, 40);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c); c.fillStyle = FLOOR; c.fillRect(0, 900, D, D - 900); line(c, [[0, 900], [D, 900]], 6);
  const tw = () => rrect(c, 700, 858, 360, 42, 12);
  shadow(c, 890, 902, 200, 12);
  shape(c, tw, COL.teal, 6); shade(c, tw, COL.tealDk, 0, 18, 0.5);
  for (const x of [750, 830, 910, 990]) line(c, [[x, 866], [x, 892]], 5, COL.cloth);
  ramp(c, 270, 900, 1.1, 42 / 1.1, 80);
  marble(c, 960, 858 - 40, 40);
  arrow(c, [[850, 760], [920, 760]]);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c); c.fillStyle = FLOOR; c.fillRect(0, 560, D, D - 560); line(c, [[0, 560], [D, 560]], 6);
  const r = ramp(c, 230, 600, 0.9, 0, 80);
  line(c, [[r.endX, 606], [r.endX, 700]], 5, COL.greyDk);
  tape(c, r.endX, 880, 760);
  coin(c, 910, 760, 40);
  marble(c, 910, 718, 36);
  write(c, "150 cm", 380, 840, 80, INK, 11);
};
export const su_motionNewtonsLaws = cards("sci.motion.newtons-laws.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);

