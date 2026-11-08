import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards } from "./flatKit";

// PULLEYS, GEARS AND SCREWS (L4) · set-up cards for Count the Ropes and Bicycle Gears, then the flow
// cards. Thread reels on a broom handle, a water bottle, a pink rubber band, an upside-down bicycle.

const TAU = Math.PI * 2;
const FLOOR = "#e3d4b8", TWINE = "#eadfc4", TABLE = "#d9b26a", TABLE_DK = "#b88e45";
const floor = (c: Ctx, y: number) => { c.fillStyle = FLOOR; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 5); };
const arcPts = (x: number, y: number, r: number, a0: number, a1: number, n = 28) =>
  Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [x + Math.cos(a) * r, y + Math.sin(a) * r]; });
// string: ink under a pale twine line
const twine = (c: Ctx, pts: number[][], w = 8) => { line(c, pts, w, INK); line(c, pts, w - 4, TWINE); };
const knot = (c: Ctx, x: number, y: number, r = 9) => shape(c, () => ell(c, x, y, r, r), TWINE, 4);
const dot = (c: Ctx, x: number, y: number, r = 6, col = INK) => shape(c, () => ell(c, x, y, r, r), col, 0);
// a curved red arrow round (x, y) at radius r from angle a0 to a1 (canvas angles: clockwise when a1 > a0)
const arcArrow = (c: Ctx, x: number, y: number, r: number, a0: number, a1: number, w = 10) => arrow(c, arcPts(x, y, r, a0, a1, 48), RED, w);
// a bit of bright tape
const tape = (c: Ctx, x: number, y: number, an: number, w = 26, h = 44) => { c.save(); c.translate(x, y); c.rotate(an); shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 5), COL.yellow, 4); c.restore(); };

// ---------------------------------------------------------------- things
// a wooden thread reel seen face on (used as a pulley); string runs round it at 0.8 r
const reel = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.wood);
  shade(c, () => ell(c, x, y, r, r), COL.woodDk, r * 0.22, r * 0.14);
  c.beginPath(); c.arc(x, y, r * 0.8, 0, TAU); c.strokeStyle = COL.woodDk; c.lineWidth = r * 0.2; c.stroke();
  c.beginPath(); c.arc(x, y, r * 0.8, 0, TAU); c.strokeStyle = INK; c.lineWidth = 2.5; c.stroke();
  shape(c, () => ell(c, x, y, r * 0.18, r * 0.18), "#6a5a4a", 4);
};
// a loop of string from the beam (bottom at yBeam) down to a reel's hole; draw the reel after it
const hangLoop = (c: Ctx, x: number, yBeam: number, yHole: number) => { twine(c, [[x - 10, yBeam], [x - 10, yHole]]); twine(c, [[x + 10, yBeam], [x + 10, yHole]]); };
// a broom handle lying level, centre line at y
const broom = (c: Ctx, x0: number, x1: number, y: number, t = 28) => {
  const p = () => rrect(c, x0, y - t / 2, x1 - x0, t, t / 2);
  shape(c, p, COL.wood); shade(c, p, COL.woodDk, 0, t * 0.4); shine(c, [[x0 + 40, y - t * 0.2], [x1 - 40, y - t * 0.2]], 4);
};
// a wooden chair seen from the front: back posts, slats, seat, legs
const chair = (c: Ctx, x: number, w: number, yTop: number, ySeat: number, yFloor: number) => {
  shadow(c, x + w / 2 + 20, yFloor + 4, w * 0.7, 14);
  for (const lx of [x - 6, x + w - 24]) shape(c, () => rrect(c, lx, ySeat + 30, 30, yFloor - ySeat - 30, 6), COL.brown);
  for (const px of [x, x + w - 30]) shape(c, () => rrect(c, px, yTop, 30, ySeat - yTop + 10, 10), COL.brown);
  for (let i = 0; i < 3; i++) shape(c, () => rrect(c, x + 26, yTop + 50 + i * 80, w - 52, 30, 8), COL.wood);
  shape(c, () => rrect(c, x - 20, ySeat, w + 40, 34, 10), COL.wood);
};
// a plastic water bottle, top of its cap at (x, y), width w, height h
const bottle = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const capH = h * 0.08, neckB = y + h * 0.2;
  shape(c, () => { c.moveTo(x - w * 0.2, y + capH); c.lineTo(x + w * 0.2, y + capH); c.lineTo(x + w * 0.5 - 3, neckB + 6); c.lineTo(x - w * 0.5 + 3, neckB + 6); c.closePath(); }, COL.glass, 6);
  const body = () => rrect(c, x - w / 2, neckB, w, y + h - neckB, w * 0.22);
  shape(c, body, COL.glass, 0);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(x - w / 2, neckB + (y + h - neckB) * 0.14, w, h); c.fillStyle = COL.drop; c.fillRect(x - w / 2, neckB + (y + h - neckB) * 0.14, w, Math.max(4, w * 0.06)); c.restore();
  shape(c, body, "rgba(0,0,0,0)", 6);
  shape(c, () => rrect(c, x - w * 0.22, y, w * 0.44, capH, 4), COL.blue);
  shine(c, [[x - w * 0.3, neckB + h * 0.1], [x - w * 0.3, y + h - h * 0.12]], Math.max(4, w * 0.05));
};
// a rubber band stretched straight down from y1 to y2 at x
const band = (c: Ctx, x: number, y1: number, y2: number, w = 24) => {
  shape(c, () => rrect(c, x - w / 2, y1, w, y2 - y1, w / 2), COL.pink, 5);
  line(c, [[x, y1 + w * 0.8], [x, y2 - w * 0.8]], 3.5, "#d86c8c");
};
// a wooden ruler standing up, top-left corner at (x, y); marks every half centimetre
const rulerV = (c: Ctx, x: number, y: number, len: number, w = 52) => {
  shape(c, () => rrect(c, x, y, w, len, 4), COL.wood);
  const n = Math.max(2, Math.round((len - 20) / 54)), step = (len - 20) / n;
  for (let i = 0; i <= n * 2; i++) { const yy = y + 10 + (i * step) / 2; line(c, [[x, yy], [x + (i % 2 === 0 ? w * 0.4 : w * 0.24), yy]], i % 2 === 0 ? 3.5 : 2.5); }
  for (let i = 0; i <= n; i += 5) write(c, String(i), x + w * 0.48, y + 10 + i * step - 8, 15, INK, 3);
};
// a stack of books, bottom centre at (x, yBottom)
const books = (c: Ctx, x: number, yBottom: number, w: number, n: number, hEach = 20) => {
  const cols = [COL.red, COL.teal, COL.purple, COL.green];
  for (let i = 0; i < n; i++) { const y = yBottom - (i + 1) * hEach, dx = (i % 2) * 8 - 4; shape(c, () => rrect(c, x - w / 2 + dx, y, w, hEach, 4), cols[i % 4], 4); line(c, [[x - w / 2 + dx + 12, y + hEach / 2], [x + w / 2 + dx - 12, y + hEach / 2]], 2, "rgba(255,255,255,0.5)"); }
};
// a toothed wheel: root radius r, n teeth of height th, a tooth centred on angle phase
const gear = (c: Ctx, x: number, y: number, r: number, n: number, col: string, dk: string, phase = 0, th = r * 0.14, hole = r * 0.18) => {
  const st = TAU / n;
  const path = () => { for (let i = 0; i < n; i++) { const a = phase + i * st; [[a - st * 0.5, r], [a - st * 0.27, r], [a - st * 0.15, r + th], [a + st * 0.15, r + th], [a + st * 0.27, r]].forEach(([aa, rr], k) => { const px = x + Math.cos(aa) * rr, py = y + Math.sin(aa) * rr; if (i === 0 && k === 0) c.moveTo(px, py); else c.lineTo(px, py); }); } c.closePath(); };
  shape(c, path, col); shade(c, path, dk, r * 0.16, r * 0.1);
  if (hole > 0) shape(c, () => ell(c, x, y, hole, hole), BG, 5);
};
// a pencil from (x0, y0) (eraser end) to (x1, y1) (point)
const pencil = (c: Ctx, x0: number, y0: number, x1: number, y1: number, w = 30) => {
  const an = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0);
  c.save(); c.translate(x0, y0); c.rotate(an);
  shape(c, () => rrect(c, 0, -w / 2, L - w * 1.6, w, 4), COL.yellow);
  line(c, [[w, -w * 0.18], [L - w * 1.7, -w * 0.18]], 3, COL.orange);
  shape(c, () => rrect(c, 0, -w / 2, w * 0.9, w, 4), COL.pink);
  line(c, [[w * 0.9, -w / 2], [w * 0.9, w / 2]], 4, COL.steelDk);
  shape(c, () => { c.moveTo(L - w * 1.6, -w / 2); c.lineTo(L, 0); c.lineTo(L - w * 1.6, w / 2); c.closePath(); }, COL.wood);
  shape(c, () => { c.moveTo(L - w * 0.5, -w * 0.16); c.lineTo(L, 0); c.lineTo(L - w * 0.5, w * 0.16); c.closePath(); }, INK, 0);
  c.restore();
};
// a belt or chain round two wheels (x1,y1,r1) and (x2,y2,r2): the two straight runs and the wrapped arcs
const beltPath = (x1: number, y1: number, r1: number, x2: number, y2: number, r2: number) => {
  const phi = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1), b = Math.acos((r1 - r2) / d);
  const top: number[][] = [[x1 + Math.cos(phi - b) * r1, y1 + Math.sin(phi - b) * r1], [x2 + Math.cos(phi - b) * r2, y2 + Math.sin(phi - b) * r2]];
  const bot: number[][] = [[x1 + Math.cos(phi + b) * r1, y1 + Math.sin(phi + b) * r1], [x2 + Math.cos(phi + b) * r2, y2 + Math.sin(phi + b) * r2]];
  return { top, bot, arc1: arcPts(x1, y1, r1, phi + b, phi + TAU - b, 40), arc2: arcPts(x2, y2, r2, phi - b, phi + b, 24) };
};
const chain = (c: Ctx, x1: number, y1: number, r1: number, x2: number, y2: number, r2: number, w = 14) => {
  const p = beltPath(x1, y1, r1, x2, y2, r2);
  for (const pts of [p.top, p.bot, p.arc1, p.arc2]) { line(c, pts, w, INK); c.save(); c.setLineDash([w * 0.9, w * 0.7]); line(c, pts, w * 0.45, COL.steel); c.restore(); }
};
// a bicycle wheel: black tyre, steel rim and spokes; tapeAt = angle of a tape mark on the tyre
const wheel = (c: Ctx, x: number, y: number, R: number, tapeAt?: number) => {
  c.beginPath(); c.arc(x, y, R, 0, TAU); c.strokeStyle = INK; c.lineWidth = R * 0.16; c.stroke();
  c.beginPath(); c.arc(x, y, R * 0.86, 0, TAU); c.strokeStyle = COL.steel; c.lineWidth = R * 0.06; c.stroke();
  for (let i = 0; i < 16; i++) { const a = (i / 16) * TAU; line(c, [[x, y], [x + Math.cos(a) * R * 0.84, y + Math.sin(a) * R * 0.84]], 2.5, COL.steelDk); }
  shape(c, () => ell(c, x, y, R * 0.1, R * 0.1), COL.steel, 4);
  if (tapeAt !== undefined) tape(c, x + Math.cos(tapeAt) * R, y + Math.sin(tapeAt) * R, tapeAt, R * 0.14, R * 0.24);
};
// a bicycle upside down on its saddle and handlebars, ground line gy, bottom bracket at bbx, wheel radius R.
// Returns the pedal's position. Upright geometry in units of R, flipped so saddle and bars touch the ground.
const bike = (c: Ctx, bbx: number, gy: number, R: number, o: { tapeTyre?: boolean; tapeTooth?: boolean; crankA?: number } = {}) => {
  const P = (ux: number, uy: number): number[] => [bbx + ux * R, gy - (1.95 - uy) * R];
  const bb = P(0, 0), back = P(-1.26, 0.2), front = P(1.8, 0.2), seatC = P(-0.45, 1.6), saddle = P(-0.62, 1.88), headT = P(1.35, 1.5), headB = P(1.5, 1.0), bars = P(1.55, 1.9);
  shadow(c, bbx + 0.45 * R, gy + 6, 2.2 * R, 0.09 * R);
  const tube = (a: number[], b: number[], w = R * 0.1) => { line(c, [a, b], w + 8, INK); line(c, [a, b], w, COL.green); };
  wheel(c, back[0], back[1], R, o.tapeTyre ? -Math.PI / 2 : undefined); wheel(c, front[0], front[1], R);
  tube(back, seatC, R * 0.07); tube(back, bb, R * 0.07); tube(bb, seatC); tube(seatC, headT); tube(bb, headB); tube(headB, headT); tube(front, headB, R * 0.07);
  tube(seatC, saddle, R * 0.06); tube(headT, bars, R * 0.07);
  shape(c, () => ell(c, saddle[0], saddle[1] + 0.02 * R, R * 0.3, R * 0.07), INK, 0);
  shape(c, () => rrect(c, bars[0] - R * 0.22, bars[1] - R * 0.05, R * 0.44, R * 0.09, R * 0.04), INK, 0);
  // drive: chainring at the bottom bracket, sprocket at the back axle, the chain between them
  gear(c, back[0], back[1], R * 0.16, 12, COL.steel, COL.steelDk, 0, R * 0.04, 0);
  const ring = R * 0.38, phase = -Math.PI / 2;
  gear(c, bb[0], bb[1], ring, 24, COL.steel, COL.steelDk, phase, R * 0.06, 0);
  chain(c, bb[0], bb[1], ring + R * 0.03, back[0], back[1], R * 0.18, R * 0.07);
  if (o.tapeTooth) tape(c, bb[0] + Math.cos(phase) * (ring + R * 0.05), bb[1] + Math.sin(phase) * (ring + R * 0.05), phase, R * 0.1, R * 0.17);
  const ca = o.crankA ?? 0.9, pedal = [bb[0] + Math.cos(ca) * R * 0.5, bb[1] + Math.sin(ca) * R * 0.5];
  shape(c, () => ell(c, bb[0], bb[1], R * 0.1, R * 0.1), COL.steelDk, 4);
  line(c, [bb, pedal], R * 0.09 + 8, INK); line(c, [bb, pedal], R * 0.09, COL.steelDk);
  c.save(); c.translate(pedal[0], pedal[1]); c.rotate(ca + Math.PI / 2); shape(c, () => rrect(c, -R * 0.13, -R * 0.045, R * 0.26, R * 0.09, R * 0.03), INK, 0); c.restore();
  return pedal;
};

// ---------------------------------------------------------------- set-up cards · Count the Ropes
// 1. a reel hanging on a string loop from a broom handle laid across two chair backs
const e1s0 = (c: Ctx) => {
  ground(c); floor(c, 980);
  chair(c, 70, 200, 400, 860, 980); chair(c, 810, 200, 400, 860, 980);
  broom(c, 30, 1050, 386);
  hangLoop(c, 540, 400, 580); twine(c, arcPts(540, 386, 24, Math.PI, TAU));
  reel(c, 540, 580, 95);
};
// 2. Test A: the bottle hangs straight from the band held in a hand, a ruler beside the band
const e1s1 = (c: Ctx) => {
  ground(c); floor(c, 990);
  rulerV(c, 612, 190, 270);
  band(c, 540, 215, 440, 26);
  twine(c, [[540, 440], [540, 535]]); knot(c, 540, 440);
  bottle(c, 540, 530, 160, 400);
  hand(c, 540, 140, Math.PI / 2, 1.4, SKIN.child, CLOTH.child);
};
// 3. Test B: the string runs from the bottle up over one fixed reel and down to the band, pulled down
const e1s2 = (c: Ctx) => {
  ground(c); floor(c, 980);
  broom(c, 30, 1050, 190);
  books(c, 290, 980, 160, 4);
  hangLoop(c, 540, 204, 390);
  reel(c, 540, 390, 80);
  twine(c, [[476, 585], [476, 390], ...arcPts(540, 390, 64, Math.PI, TAU), [604, 560]]);
  knot(c, 476, 585);
  bottle(c, 476, 580, 130, 320);
  band(c, 604, 560, 845, 26);
  hand(c, 604, 905, -Math.PI / 2, 1.3, SKIN.child, CLOTH.child);
};
// 4. Test C: the bottle hangs from a moving reel in a loop of string, one end tied to the beam, the other over the fixed reel
const e1s3 = (c: Ctx) => {
  ground(c); floor(c, 1030);
  broom(c, 30, 1050, 180);
  hangLoop(c, 532, 194, 340);
  reel(c, 532, 340, 70);
  twine(c, [[364, 194], [364, 640], ...arcPts(420, 640, 56, Math.PI, 0), [476, 340], ...arcPts(532, 340, 56, Math.PI, TAU), [588, 470]]);
  knot(c, 364, 194);
  twine(c, [[420, 640], [420, 745]]);
  reel(c, 420, 640, 70);
  knot(c, 420, 745);
  bottle(c, 420, 740, 110, 250);
  band(c, 588, 470, 790, 26);
  hand(c, 588, 850, -Math.PI / 2, 1.3, SKIN.child, CLOTH.child);
};
// 5. the bar chart: one bar per way of lifting, the stretch written on each
const e1s4 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 60, 960, 960, 18), COL.paper, 6);
  line(c, [[150, 300], [150, 860], [900, 860]], 6);
  for (let i = 0; i <= 8; i++) { const y = 860 - i * 60; line(c, [[138, y], [150, y]], 4); if (i % 4 === 0) write(c, String(i), 92, y - 16, 32, INK, 5); }
  const bars: [number, number, string, string][] = [[240, 480, COL.orange, "8"], [470, 480, COL.teal, "8"], [700, 270, COL.purple, "4.5"]];
  bars.forEach(([x, h, col, t]) => {
    const p = () => rrect(c, x, 860 - h, 160, h, 8); shape(c, p, col); shade(c, p, INK, 18, 0, 0.18);
    const tw = t.length * 0.8 * 44; write(c, t.replace(".", " ").replace("  ", " "), x + 80 - tw / 2, 860 - h - 62, 44, INK, 7);
    if (t.includes(".")) dot(c, x + 80 - tw / 2 + 0.8 * 44 + 8, 860 - h - 22, 5);
  });
  // what each bar was: the bottle alone, one reel, two reels
  bottle(c, 320, 900, 40, 100);
  reel(c, 550, 905, 22); bottle(c, 550, 940, 36, 90);
  reel(c, 756, 905, 22); reel(c, 806, 905, 22); bottle(c, 780, 940, 36, 90);
};

// ---------------------------------------------------------------- set-up cards · Bicycle Gears
// 1. the bicycle upside down, tape on the back tyre and on one tooth of the pedal gear
const e2s0 = (c: Ctx) => { ground(c); floor(c, 980); bike(c, 510, 980, 185, { tapeTyre: true, tapeTooth: true, crankA: 0.9 }); };
// 2. a child counting the teeth of the pedal gear, finger on the taped tooth
const e2s1 = (c: Ctx) => {
  ground(c); floor(c, 960);
  const gx = 720, gy = 560, r = 200, th = 28;
  gear(c, gx, gy, r, 30, COL.steel, COL.steelDk, Math.PI, th, 0);
  const ca = 0.75, pedal = [gx + Math.cos(ca) * 190, gy + Math.sin(ca) * 190];
  line(c, [[gx, gy], pedal], 30, INK); line(c, [[gx, gy], pedal], 22, COL.steelDk);
  shape(c, () => ell(c, gx, gy, 36, 36), COL.steelDk, 5);
  c.save(); c.translate(pedal[0], pedal[1]); c.rotate(ca + Math.PI / 2); shape(c, () => rrect(c, -46, -16, 92, 32, 10), INK, 0); c.restore();
  tape(c, gx - r - th * 0.6, gy, 0, 24, 44);
  person(c, 300, 960, 520, { reachR: [gx - r - th - 2, gy], dir: 1 });
};
// 3. the grown-up turns the pedal one full turn; the child watches the tape on the back tyre go round
const e2s2 = (c: Ctx) => {
  ground(c); floor(c, 960);
  // the grown-up stands behind the bicycle: the left hand down on the pedal (crank pointing up-left), the right
  // hand resting on top of the front tyre. Wheel radius 110: bottom bracket at (490, 745), pedal at (451, 707).
  person(c, 537, 960, 580, { reachL: [451, 707], reachR: [688, 652], dir: -1, adult: true });
  bike(c, 490, 960, 110, { tapeTyre: true, crankA: -Math.PI * 0.75 });
  person(c, 105, 960, 430, { dir: 1 });
  arcArrow(c, 351, 767, 135, -Math.PI * 0.85, -Math.PI * 0.38);
  arcArrow(c, 490, 745, 90, -Math.PI * 0.35, -Math.PI * 0.05, 8);
};
// 4. the results: the worked-out turns beside the counted turns
const e2s3 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 960, 400, 30);
  shape(c, () => rrect(c, 150, 120, 780, 830, 14), COL.paper, 6);
  line(c, [[540, 160], [540, 900]], 4); line(c, [[190, 400], [890, 400]], 4);
  // left column: the gears and the division
  gear(c, 300, 285, 52, 14, COL.steel, COL.steelDk, 0, 12, 10);
  gear(c, 400, 285, 26, 7, COL.steel, COL.steelDk, Math.PI + Math.PI / 7, 12, 6);
  write(c, "44", 285, 450, 90, INK, 9); line(c, [[270, 560], [450, 560]], 8); write(c, "18", 285, 580, 90, INK, 9);
  write(c, "2 4", 262, 740, 110, COL.blueDk, 12); dot(c, 358, 840, 9, COL.blueDk);
  // right column: the taped tyre going round, and the turns counted
  c.beginPath(); c.arc(715, 285, 58, 0, TAU); c.strokeStyle = INK; c.lineWidth = 14; c.stroke();
  tape(c, 715, 227, 0, 16, 26); arcArrow(c, 715, 285, 88, -Math.PI * 0.3, Math.PI * 0.45, 7);
  write(c, "2 5", 622, 740, 110, RED, 12); dot(c, 718, 840, 9, RED);
  pencil(c, 640, 1040, 1000, 900, 28);
};

// ---------------------------------------------------------------- flow cards
// Count the Ropes: the whole rig between two chairs, the child pulling the band down beside a ruler
const flowE1 = (c: Ctx) => {
  ground(c); floor(c, 960);
  chair(c, 40, 180, 454, 850, 960); chair(c, 860, 180, 454, 850, 960);
  broom(c, 14, 1066, 440);
  hangLoop(c, 523, 454, 540);
  twine(c, [[391, 454], [391, 700], ...arcPts(435, 700, 44, Math.PI, 0), [479, 540], ...arcPts(523, 540, 44, Math.PI, TAU), [567, 600]], 7);
  knot(c, 391, 454, 8);
  reel(c, 523, 540, 55);
  twine(c, [[435, 700], [435, 792]], 7);
  reel(c, 435, 700, 55);
  knot(c, 435, 792, 7);
  bottle(c, 435, 790, 52, 115);
  books(c, 435, 960, 84, 3, 18);
  band(c, 567, 600, 700, 20);
  rulerV(c, 592, 596, 164, 44);
  person(c, 740, 960, 660, { reachL: [567, 702], dir: -1 });
};
// Bicycle Gears: the chain from the big pedal gear to the small gear at the back wheel
const flowE2 = (c: Ctx) => {
  ground(c);
  const x1 = 330, x2 = 830, y = 560, r1 = 210, r2 = 85, th = 24;
  chain(c, x1, y, r1 + th * 0.6, x2, y, r2 + th * 0.6, 16);
  gear(c, x1, y, r1, 32, COL.steel, COL.steelDk, -Math.PI / 2, th, 30);
  gear(c, x2, y, r2, 13, COL.steel, COL.steelDk, -Math.PI / 2, th, 18);
  tape(c, x1, y - r1 - th * 0.6, 0, 24, 40);
  const ca = 0.65, pedal = [x1 + Math.cos(ca) * 200, y + Math.sin(ca) * 200];
  line(c, [[x1, y], pedal], 30, INK); line(c, [[x1, y], pedal], 22, COL.steelDk);
  shape(c, () => ell(c, x1, y, 34, 34), COL.steelDk, 5);
  c.save(); c.translate(pedal[0], pedal[1]); c.rotate(ca + Math.PI / 2); shape(c, () => rrect(c, -46, -16, 92, 32, 10), INK, 0); c.restore();
  arcArrow(c, x1, y, r1 + 70, -Math.PI * 0.88, -Math.PI * 0.6);
  arrow(c, [[500, 270], [720, 300]], RED, 10);
  arcArrow(c, x2, y, r2 + 70, -Math.PI * 0.35, Math.PI * 0.1);
};
// Paper Screw: a tall and a short paper ramp, and one wound round a pencil into a spiral
const flowA1 = (c: Ctx) => {
  ground(c);
  const tri = (x: number, yb: number, L: number, h: number, col: string) => {
    shadow(c, x + L / 2 + 10, yb + 10, L / 2, 10);
    shape(c, () => polyP(c, [[x, yb], [x + L, yb], [x, yb - h]]), COL.paper, 5);
    line(c, [[x, yb - h], [x + L, yb]], 12, col);
  };
  tri(90, 330, 440, 120, COL.blue);
  tri(90, 560, 440, 60, COL.red);
  // the pencil standing up with the tall ramp wound round it
  const px = 820, top = 150, bot = 980;
  shadow(c, px + 20, bot + 6, 60, 12);
  pencil(c, px, top, px, bot, 34);
  const y0 = 280, len = 440, w = 44, p = 62;
  shape(c, () => rrect(c, px - w, y0, w * 2, len, 6), COL.paper, 5);
  for (let i = 0; i < 7; i++) {
    const ya = y0 + 14 + i * p;
    c.globalAlpha = 0.35; line(c, [[px + w, ya - p / 2], [px - w, ya]], 6, COL.blue); c.globalAlpha = 1;
    line(c, [[px - w, ya], [px + w, ya + p / 2]], 10, COL.blue);
  }
  arrow(c, [[590, 420], [740, 500]], RED, 10);
};
// Clock Gears: an alarm clock, the minute hand gone round once, the hour hand moved to 1
const flowA2 = (c: Ctx) => {
  ground(c); floor(c, 960);
  const x = 540, y = 580, r = 280;
  shadow(c, x + 30, 962, 260, 22);
  for (const s of [-1, 1]) { line(c, [[x + s * 120, y + r - 20], [x + s * 170, 955]], 26, INK); line(c, [[x + s * 120, y + r - 20], [x + s * 170, 955]], 16, COL.steelDk); }
  for (const s of [-1, 1]) { line(c, [[x + s * 140, y - r + 50], [x + s * 170, y - r - 10]], 22, INK); shape(c, () => ell(c, x + s * 175, y - r - 30, 66, 60), COL.steel, 6); shade(c, () => ell(c, x + s * 175, y - r - 30, 66, 60), COL.steelDk, 18, 10); }
  shape(c, () => ell(c, x, y, r, r), COL.red); shade(c, () => ell(c, x, y, r, r), "#b23a2a", 30, 18);
  shape(c, () => ell(c, x, y, r - 46, r - 46), WHITE, 6);
  for (let i = 0; i < 60; i++) { const a = (i / 60) * TAU, l = i % 5 === 0 ? 22 : 10; line(c, [[x + Math.cos(a) * (r - 60), y + Math.sin(a) * (r - 60)], [x + Math.cos(a) * (r - 60 - l), y + Math.sin(a) * (r - 60 - l)]], i % 5 === 0 ? 5 : 3); }
  write(c, "12", x - 30, y - r + 92, 46, INK, 6); write(c, "3", x + r - 128, y - 24, 46, INK, 6); write(c, "6", x - 20, y + r - 140, 46, INK, 6); write(c, "9", x - r + 86, y - 24, 46, INK, 6);
  // hands: hour at 1, minute back at 12
  const hA = -Math.PI / 2 + Math.PI / 6;
  line(c, [[x, y], [x + Math.cos(hA) * 120, y + Math.sin(hA) * 120]], 18, INK);
  line(c, [[x, y], [x, y - 190]], 12, INK);
  dot(c, x, y, 14);
  arcArrow(c, x, y, 150, -Math.PI / 2 - 0.08, hA + 0.1, 7);
  arcArrow(c, x, y, r + 56, -Math.PI / 2 + 0.8, Math.PI * 1.5 - 0.82);
};
// Kitchen Machine Detective: scissors, a peeler, a bottle opener and a pressure cooker lid laid out on a table
const flowA3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 160, 1000, 760, 20), TABLE, 6);
  c.save(); c.globalAlpha = 0.4; c.strokeStyle = TABLE_DK; c.lineWidth = 3; for (let yy = 220; yy < 900; yy += 70) { c.beginPath(); c.moveTo(60, yy); c.lineTo(1020, yy); c.stroke(); } c.restore();
  // scissors: two blades crossing at a screw, two ring handles
  const sx = 210, sy = 540;
  shadow(c, sx + 12, sy + 16, 60, 120);
  for (const s of [-1, 1]) {
    const ba = -Math.PI / 2 + s * 0.26, ha = Math.PI / 2 + s * 0.3;
    c.save(); c.translate(sx, sy); c.rotate(ba);
    shape(c, () => { c.moveTo(0, -16); c.lineTo(190, -6); c.lineTo(205, 0); c.lineTo(0, 16); c.closePath(); }, COL.steel, 5);
    c.restore();
    c.save(); c.translate(sx, sy); c.rotate(ha);
    shape(c, () => rrect(c, 0, -14, 60, 28, 8), COL.orange, 5);
    shape(c, () => ell(c, 110, 0, 58, 40), COL.orange, 5); shape(c, () => ell(c, 110, 0, 36, 22), TABLE, 4);
    c.restore();
  }
  shape(c, () => ell(c, sx, sy, 13, 13), COL.steelDk, 4);
  // peeler: an orange handle with a slotted steel head
  const px = 440, py = 560;
  shadow(c, px + 12, py + 150, 40, 14);
  shape(c, () => rrect(c, px - 26, py - 20, 52, 190, 14), COL.orange);
  shape(c, () => rrect(c, px - 46, py - 110, 92, 96, 12), COL.steel); shade(c, () => rrect(c, px - 46, py - 110, 92, 96, 12), COL.steelDk, 14, 8);
  line(c, [[px - 30, py - 64], [px + 30, py - 64]], 7);
  // bottle opener: a steel bar with an oval mouth
  const ox = 600, oy = 560;
  shadow(c, ox + 10, oy + 130, 36, 12);
  shape(c, () => rrect(c, ox - 24, oy - 30, 48, 180, 12), COL.steel);
  shape(c, () => rrect(c, ox - 44, oy - 120, 88, 110, 30), COL.steel); shape(c, () => ell(c, ox, oy - 62, 24, 34), TABLE, 5);
  // pressure cooker lid from above: a steel disc, the weight in the middle, a black handle to the right
  const lx = 780, ly = 560, lr = 135;
  shadow(c, lx + 18, ly + 20, lr, lr);
  shape(c, () => rrect(c, lx + lr - 30, ly - 22, 150, 44, 18), INK, 0);
  shape(c, () => ell(c, lx, ly, lr, lr), COL.steel); shade(c, () => ell(c, lx, ly, lr, lr), COL.steelDk, 36, 24);
  c.beginPath(); c.arc(lx, ly, lr - 26, 0, TAU); c.strokeStyle = COL.steelDk; c.lineWidth = 4; c.stroke();
  shape(c, () => ell(c, lx, ly, 34, 34), INK, 0); shape(c, () => ell(c, lx, ly - 10, 22, 22), COL.greyDk, 4);
  shine(c, [[lx - 90, ly - 70], [lx - 40, ly - 110]], 8);
};
// Rope Count at Home: a ceiling clothes rack hung on a rope through two small pulleys, tied to a wall cleat
const flowA4 = (c: Ctx) => {
  ground(c); floor(c, 960);
  c.fillStyle = "#e6dcc8"; c.fillRect(0, 0, D, 92); line(c, [[0, 92], [D, 92]], 5);
  c.fillStyle = "#e6dcc8"; c.fillRect(940, 92, 140, 868); line(c, [[940, 92], [940, 960]], 5);
  const pulley = (x: number, y: number, r: number) => {
    line(c, [[x, 92], [x, y]], 12, INK);
    shape(c, () => ell(c, x, y, r, r), COL.steel); c.beginPath(); c.arc(x, y, r * 0.8, 0, TAU); c.strokeStyle = COL.steelDk; c.lineWidth = r * 0.22; c.stroke();
    shape(c, () => ell(c, x, y, r * 0.2, r * 0.2), INK, 0);
  };
  const r = 30, rr = r * 0.8, p1 = [300, 160], p2 = [760, 160], cleat = [985, 640];
  // the rack: a long wooden bar with towels over it
  const rackY = 540;
  twine(c, [[p1[0] - rr, rackY], [p1[0] - rr, p1[1]], ...arcPts(p1[0], p1[1], rr, Math.PI, Math.PI * 1.5), [p2[0], p2[1] - rr], ...arcPts(p2[0], p2[1], rr, Math.PI * 1.5, TAU), [p2[0] + rr, p2[1]], cleat], 7);
  twine(c, [[p2[0] - rr, rackY], [p2[0] - rr, p2[1]], ...arcPts(p2[0], p2[1], rr, Math.PI, TAU), [p2[0] + rr + 6, p2[1]], [cleat[0] + 4, cleat[1] - 6]], 7);
  pulley(p1[0], p1[1], r); pulley(p2[0], p2[1], r);
  shape(c, () => rrect(c, p1[0] - rr - 18, rackY - 14, p2[0] - p1[0] + 36, 28, 10), COL.wood);
  const cloths: [number, number, string][] = [[330, 230, COL.teal], [540, 200, COL.purple], [700, 200, COL.green]];
  cloths.forEach(([x, h, col]) => { shape(c, () => rrect(c, x - 60, rackY - 20, 120, h, 8), col, 5); line(c, [[x - 44, rackY + h * 0.55], [x + 44, rackY + h * 0.55]], 3, "rgba(255,255,255,0.45)"); });
  shape(c, () => rrect(c, p1[0] - rr - 18, rackY - 14, p2[0] - p1[0] + 36, 28, 10), "rgba(0,0,0,0)", 5);
  // the cleat on the wall
  shape(c, () => rrect(c, cleat[0] - 12, cleat[1] - 60, 24, 120, 10), COL.steelDk); shape(c, () => rrect(c, cleat[0] - 40, cleat[1] - 12, 80, 24, 10), COL.steelDk);
};
// Charkha Belt Drive: a card wheel and a small card wheel on pencils through straws on a shoebox, a thread belt round both
const flowP1 = (c: Ctx) => {
  ground(c); floor(c, 840);
  const bx = 180, by = 540, bw = 720, bh = 288;
  shadow(c, bx + bw / 2 + 30, 846, bw / 2, 20);
  shape(c, () => rrect(c, bx, by, bw, bh, 8), COL.brown); shade(c, () => rrect(c, bx, by, bw, bh, 8), COL.soilDk, 0, 40, 0.35);
  shape(c, () => rrect(c, bx - 10, by - 16, bw + 20, 34, 6), COL.soil);
  const W1 = [380, 530, 144], W2 = [716, 530, 48];
  // straws across the box top, seen end on, and the pencils through them
  for (const [x, y] of [W1, W2]) shape(c, () => ell(c, x, y, 16, 16), COL.pink, 4);
  for (const [x, y, r] of [W1, W2]) { shape(c, () => ell(c, x, y, r, r), COL.cloth); shade(c, () => ell(c, x, y, r, r), "#d9cfb8", r * 0.2, r * 0.12); c.beginPath(); c.arc(x, y, r * 0.6, 0, TAU); c.strokeStyle = COL.teal; c.lineWidth = 5; c.stroke(); }
  for (const [x, y] of [W1, W2]) shape(c, () => ell(c, x, y, 11, 11), COL.yellow, 4);
  const p = beltPath(W1[0], W1[1], W1[2] + 4, W2[0], W2[1], W2[2] + 4);
  for (const pts of [p.top, p.bot, p.arc1, p.arc2]) twine(c, pts, 7);
  arcArrow(c, W1[0], W1[1], W1[2] + 44, -Math.PI * 0.97, -Math.PI * 0.6);
  arcArrow(c, W2[0], W2[1], W2[2] + 50, -Math.PI * 0.22, Math.PI * 0.3, 8);
  hand(c, 162, 452, 0.35, 1.3, SKIN.child, CLOTH.child);
};

// ---------------------------------------------------------------- terms
// Pulley: a grooved wheel hung from a beam, a rope over it, a bucket on one end
const termPulley = (c: Ctx) => {
  ground(c); floor(c, 960);
  shape(c, () => rrect(c, -20, 90, D + 40, 80, 0), COL.wood); shade(c, () => rrect(c, -20, 90, D + 40, 80, 0), COL.woodDk, 0, 36);
  const x = 540, y = 350, r = 100, rr = 80;
  line(c, [[x, 170], [x, 230]], 14, INK);
  shape(c, () => { c.moveTo(x - 40, 230); c.lineTo(x + 40, 230); c.lineTo(x + 26, y + 10); c.lineTo(x - 26, y + 10); c.closePath(); }, COL.steelDk, 5);
  twine(c, [[x - rr, 640], [x - rr, y], ...arcPts(x, y, rr, Math.PI, TAU), [x + rr, 880]], 9);
  knot(c, x + rr, 880, 12);
  shape(c, () => ell(c, x, y, r, r), COL.steel); shade(c, () => ell(c, x, y, r, r), COL.steelDk, 24, 14);
  c.beginPath(); c.arc(x, y, rr, 0, TAU); c.strokeStyle = COL.steelDk; c.lineWidth = 22; c.stroke();
  twine(c, arcPts(x, y, rr, Math.PI, TAU), 9);
  shape(c, () => ell(c, x, y, 20, 20), INK, 0);
  // the bucket, its handle up to the rope
  const bxc = x - rr, top = 690, bot = 880;
  line(c, [[bxc, 640], [bxc, 660]], 9, INK);
  shape(c, () => { c.moveTo(bxc - 100, top); c.quadraticCurveTo(bxc, top - 110, bxc + 100, top); }, "rgba(0,0,0,0)", 10);
  shape(c, () => polyP(c, [[bxc - 105, top], [bxc + 105, top], [bxc + 85, bot], [bxc - 85, bot]]), COL.steel);
  shade(c, () => polyP(c, [[bxc - 105, top], [bxc + 105, top], [bxc + 85, bot], [bxc - 85, bot]]), COL.steelDk, 40, 0);
  shape(c, () => ell(c, bxc, top, 105, 22), COL.waterDk, 5);
  line(c, [[bxc - 95, top + 40], [bxc + 95, top + 40]], 4, COL.steelDk);
};
// Gear: a big and a small toothed wheel with their teeth meshed
const termGear = (c: Ctx) => {
  ground(c);
  const th = 32, r1 = 230, r2 = 115, x1 = 370, y = 560, x2 = x1 + r1 + r2 + th * 0.9;
  shadow(c, x1 + 20, y + r1 + 50, r1, 24); shadow(c, x2 + 10, y + r2 + 50, r2, 16);
  gear(c, x1, y, r1, 24, COL.blue, COL.blueDk, 0, th, 42);
  gear(c, x2, y, r2, 12, COL.orange, "#d27c25", Math.PI + Math.PI / 12, th, 24);
  arcArrow(c, x1, y, r1 + 80, -Math.PI * 0.85, -Math.PI * 0.55);
  arcArrow(c, x2, y, r2 + 76, -Math.PI * 0.1, -Math.PI * 0.55);
};

export const ic_forcesSimpleMachinesL4 = cards("sci.forces.simple-machines.L4", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, e2s3,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowA4, flowP1, termPulley, termGear,
]);
