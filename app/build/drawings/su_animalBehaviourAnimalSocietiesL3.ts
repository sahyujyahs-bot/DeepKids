import type { Ctx } from "./core";
import {
  ground, shape, ell, rrect, polyP, shadow, line, arrow, bowl, hand, write, cards,
  INK, WHITE, RED, COL, SKIN, CLOTH,
} from "./flatKit";

// ANIMAL SOCIETIES L3 · set-up cards (ant sugar test, long-ago-and-now questions)
const ANT = "#4a2f27";
const ant = (c: Ctx, x: number, y: number, s: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  for (const k of [-1, 1]) for (const lx of [-8, 8, 24]) line(c, [[lx, 0], [lx + k * 6, k * 22], [lx + k * 20, k * 30]], 5);
  line(c, [[44, 0], [62, -20], [74, -26]], 5); line(c, [[44, 0], [62, 18], [74, 24]], 5);
  shape(c, () => ell(c, -30, 0, 28, 20), ANT, 5);
  shape(c, () => ell(c, 12, 0, 18, 14), ANT, 5);
  shape(c, () => ell(c, 44, 0, 16, 15), ANT, 5);
  c.beginPath(); ell(c, -36, -7, 12, 6); c.fillStyle = "rgba(255,255,255,0.3)"; c.fill();
  c.restore();
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col: string, w = 14) => {
  const P: Record<string, number[][]> = {
    W: [[0, 0], [0.22, 1], [0.5, 0.35], [0.78, 1], [1, 0]],
    S: [[0.95, 0.12], [0.5, 0], [0.08, 0.2], [0.5, 0.5], [0.92, 0.8], [0.5, 1], [0.05, 0.88]],
  };
  line(c, P[ch].map(([u, v]) => [x + u * h * 0.8, y + v * h]), w, col);
};
const tile = (c: Ctx, x: number, y: number, w: number, ch: string, col: string, top = 0.25) => {
  shadow(c, x + w / 2 + 14, y + w + 6, w / 2, w * 0.07);
  shape(c, () => rrect(c, x, y, w, w, 22), WHITE, 7);
  letter(c, ch, x + w * (top < 0.25 ? 0.38 : 0.27), y + w * top, w * (top < 0.25 ? 0.3 : 0.5), col, w * 0.045);
};
const pencil = (c: Ctx, x: number, y: number, an: number, len: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -17, len, 34, 6), COL.yellow, 6);
  shape(c, () => polyP(c, [[len, -17], [len + 50, 0], [len, 17]]), COL.wood, 6);
  shape(c, () => polyP(c, [[len + 36, -5], [len + 50, 0], [len + 36, 5]]), INK, 2);
  shape(c, () => rrect(c, -26, -17, 30, 34, 6), COL.pink, 6);
  c.restore();
};
const face = (c: Ctx, x: number, y: number, r: number, skin: string, hair: string, kind: "child" | "adult" | "elder") => {
  if (kind === "adult" || kind === "elder") shape(c, () => ell(c, x, y - r * 0.1, r * 1.12, r * 1.2), hair, 5);
  shape(c, () => ell(c, x, y, r, r * 1.08), skin, 5);
  shape(c, () => { c.moveTo(x - r * 1.02, y - r * 0.05); c.bezierCurveTo(x - r, y - r * 1.55, x + r, y - r * 1.55, x + r * 1.02, y - r * 0.05); c.quadraticCurveTo(x, y - r * 0.6, x - r * 1.02, y - r * 0.05); c.closePath(); }, hair, 5);
  if (kind === "child") shape(c, () => ell(c, x + r * 0.95, y - r * 0.35, r * 0.32, r * 0.5), hair, 4);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.36, y + r * 0.12, r * 0.09, r * 0.12), INK, 0);
  if (kind === "elder") for (const s of [-1, 1]) { c.beginPath(); c.arc(x + s * r * 0.36, y + r * 0.12, r * 0.24, 0, 7); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
  c.beginPath(); c.arc(x, y + r * 0.38, r * 0.3, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  if (kind === "elder") shape(c, () => ell(c, x, y - r * 0.5, r * 0.09, r * 0.09), RED, 0);
};
const qmark = (c: Ctx, x: number, y: number, h: number, col = INK, w = 7) => {
  c.beginPath(); c.arc(x + h * 0.25, y + h * 0.25, h * 0.25, Math.PI * 1.1, Math.PI * 2.35); c.lineTo(x + h * 0.25, y + h * 0.65);
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke();
  shape(c, () => ell(c, x + h * 0.25, y + h * 0.92, w * 0.6, w * 0.6), col, 0);
};
// a child's hand writing: the pencil tip rests at (tx, ty), pencil running along angle an
const writer = (c: Ctx, tx: number, ty: number, an: number) => {
  const dx = Math.cos(an), dy = Math.sin(an), s = 1.35;
  pencil(c, tx - dx * 240, ty - dy * 240, an, 190);
  hand(c, tx - dx * 130 - dx * 70 * s, ty - dy * 130 - dy * 70 * s, an, s, SKIN.child, CLOTH.child);
};
const phone = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 14, y + h + 6, w / 2, 18);
  shape(c, () => rrect(c, x, y, w, h, 38), COL.black, 7);
};

// ---- e1.0
const su_e1_0 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#cdbfa2"; c.fillRect(0, 0, 1080, 190); line(c, [[0, 190], [1080, 190]], 8);
  for (let i = 0; i < 6; i++) ant(c, 100 + i * 165, 300 + (i % 2) * 14, 0.95, 0);
  tile(c, 290, 560, 240, "W", COL.blueDk); tile(c, 560, 560, 240, "S", COL.orange);
  arrow(c, [[420, 395], [420, 500]]);
  arrow(c, [[690, 395], [690, 500]]);
};
// ---- e1.1
const grains = (c: Ctx, x: number, y: number, n: number, rx: number, ry: number, seedv: number) => {
  let s = seedv;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < n; i++) { const a = r() * 6.28, d = Math.sqrt(r()); shape(c, () => rrect(c, x + Math.cos(a) * d * rx - 7, y + Math.sin(a) * d * ry - 7, 14, 14, 3), WHITE, 2.5); }
};
const su_e1_1 = (c: Ctx) => {
  ground(c);
  bowl(c, 290, 470, 215, "#dcecf7"); grains(c, 290, 470, 4, 130, 22, 3);
  bowl(c, 790, 470, 215, "#e6b95a"); grains(c, 790, 470, 40, 150, 26, 7);
  // teaspoon stirring the strong one
  line(c, [[960, 120], [830, 440]], 30, INK); line(c, [[960, 120], [830, 440]], 18, COL.steel);
  shape(c, () => ell(c, 815, 470, 44, 26, 0.4), COL.steel, 6);
  arrow(c, [0.9, 0.75, 0.6, 0.45, 0.3, 0.15].map((k) => [790 + 175 * Math.cos(Math.PI * k), 500 + 70 * Math.sin(Math.PI * k)]));
  tile(c, 170, 800, 200, "W", COL.blueDk); tile(c, 670, 800, 200, "S", COL.orange);
};
// ---- e1.2
const timerFace = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), WHITE, 6);
  c.beginPath(); c.moveTo(x, y); c.arc(x, y, r * 0.85, -Math.PI / 2, 0); c.closePath(); c.fillStyle = RED; c.fill();
  c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
const su_e1_2 = (c: Ctx) => {
  ground(c);
  phone(c, 660, 90, 330, 480);
  shape(c, () => rrect(c, 685, 125, 280, 410, 20), COL.sky, 0);
  timerFace(c, 825, 270, 95);
  write(c, "15", 765, 410, 80, INK, 12);
  tile(c, 140, 640, 340, "W", COL.blueDk, 0.07); tile(c, 560, 640, 340, "S", COL.orange, 0.07);
  ant(c, 230, 850, 0.8, 0.3); ant(c, 380, 820, 0.8, 2.4);
  const a: [number, number, number][] = [[630, 850, 0.2], [750, 850, 0.1], [650, 925, 0.3], [770, 925, 0.0], [830, 885, 3.3]];
  a.forEach(([x, y, t]) => ant(c, x, y, 0.65, t));
  hand(c, 170, 400, 1.0, 1.9, SKIN.child, CLOTH.child, true);
  arrow(c, [[470, 500], [530, 540], [560, 600]]);
};
// ---- notebook page
const page = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 12, y + h + 4, w / 2, 18);
  shape(c, () => rrect(c, x, y, w, h, 18), COL.paper, 7);
  for (let i = 0; i < 6; i++) shape(c, () => ell(c, x + 6, y + 50 + i * ((h - 100) / 5), 14, 14), COL.steelDk, 4);
};
const qline = (c: Ctx, n: string, x: number, y: number, len: number) => {
  write(c, n, x, y - 20, 44, INK, 6);
  line(c, [[x + 50, y + 20], [x + len, y + 20]], 6, COL.greyDk);
  qmark(c, x + len + 14, y - 24, 56);
};
// ---- e2.0
const su_e2_0 = (c: Ctx) => {
  ground(c);
  page(c, 90, 110, 900, 800);
  // long ago: a diya; now: a phone
  shape(c, () => polyP(c, [[225, 250], [345, 250], [320, 295], [250, 295]]), COL.brown, 6);
  shape(c, () => { c.moveTo(285, 150); c.quadraticCurveTo(325, 205, 300, 245); c.lineTo(270, 245); c.quadraticCurveTo(245, 205, 285, 150); }, COL.orange, 5);
  shape(c, () => rrect(c, 650, 150, 90, 150, 14), COL.black, 6);
  shape(c, () => rrect(c, 662, 168, 66, 105, 6), COL.sky, 0);
  line(c, [[500, 140], [500, 800]], 5, COL.grey);
  [0, 1, 2].forEach((i) => { qline(c, String(i + 1), 160, 420 + i * 120, 140); qline(c, String(i + 1), 560, 420 + i * 120, 100); });
  writer(c, 650, 700, 2.6);
};
// ---- e2.1
const su_e2_1 = (c: Ctx) => {
  ground(c);
  phone(c, 170, 60, 740, 440);
  shape(c, () => rrect(c, 195, 85, 690, 390, 22), "#f3d9a8", 0);
  shape(c, () => rrect(c, 380, 370, 320, 130, 40), COL.pink, 5);
  face(c, 540, 270, 125, SKIN.adult, "#e8e6e8", "elder");
  shadow(c, 540, 515, 330, 10);
  page(c, 130, 560, 820, 470);
  qline(c, "1", 200, 700, 200); qline(c, "2", 200, 830, 200);
  writer(c, 470, 855, 2.6);
  arrow(c, [[70, 780], [70, 640], [70, 500]]);
};
// ---- e2.2
const su_e2_2 = (c: Ctx) => {
  ground(c);
  page(c, 70, 50, 940, 990);
  line(c, [[170, 790], [950, 790]], 7);
  const bars: [number, number, string, string][] = [[310, 200, COL.teal, COL.tealDk], [560, 390, COL.blue, COL.blueDk], [810, 560, COL.orange, "#d27c25"]];
  bars.forEach(([x, h, col]) => shape(c, () => rrect(c, x - 80, 790 - h, 160, h, 10), col, 7));
  face(c, 310, 870, 62, SKIN.child, CLOTH.hair, "child");
  face(c, 560, 870, 62, SKIN.adult, CLOTH.hair, "adult");
  face(c, 810, 870, 62, SKIN.adult, "#e8e6e8", "elder");
  write(c, "8", 290, 948, 56); write(c, "35", 520, 948, 56); write(c, "68", 770, 948, 56);
  arrow(c, [[810, 110], [810, 190]]);
};

export const su_animalBehaviourAnimalSocietiesL3 = cards("sci.animal-behaviour.animal-societies.L3 set-up", [su_e1_0, su_e1_1, su_e1_2, su_e2_0, su_e2_1, su_e2_2]);
