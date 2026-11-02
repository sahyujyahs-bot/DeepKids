import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, rrect, polyP, shadow, shade, line, arrow, hand, person, write, bowl, cards } from "./flatKit";

// EXERCISE AND REST · picture cards for the intro, summary, activities, terms and explanations.
const WALL_DAY = "#f6e7c1", WALL_NIGHT = "#8a8cc4", NAVY = "#3b3f7a", PANTS = "#6b5a8c";
const writeC = (c: Ctx, t: string, cx: number, cy: number, h: number, col: string = INK, w = 6) => write(c, t, cx - ((t.length - 1) * 0.8 * h + 0.6 * h) / 2, cy - h / 2, h, col, w);
const limb = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 10, INK); line(c, pts, w, col); };
const floorOf = (c: Ctx, y: number, col = "#d9a766") => { c.fillStyle = col; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };
const wristOf = (x: number, y: number, h: number, side: -1 | 1, [a1, a2]: [number, number]) => {
  const sx = x + side * h * 0.11, sy = y - h * 0.71, ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};
const bottle = (c: Ctx, x: number, y: number, w: number, h: number) => {
  // water bottle, bottom centre (x, y)
  shadow(c, x + w * 0.15, y + 6, w * 0.7, w * 0.12);
  const body = () => rrect(c, x - w / 2, y - h, w, h, w * 0.22);
  shape(c, () => rrect(c, x - w * 0.2, y - h - w * 0.35, w * 0.4, w * 0.4, 6), COL.blue);
  shape(c, body, COL.glass);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(x - w / 2, y - h * 0.8, w, h); c.restore();
  shape(c, () => rrect(c, x - w / 2, y - h * 0.55, w, h * 0.22, 4), COL.teal, 5);
  shape(c, body, "rgba(0,0,0,0)", 6);
  shine(c, [[x - w * 0.3, y - h * 0.9], [x - w * 0.3, y - h * 0.62]]);
};
const shine = (c: Ctx, pts: number[][]) => { c.globalAlpha = 0.75; line(c, pts, 8, WHITE); c.globalAlpha = 1; };
const wallClock = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), WHITE, 7);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78], [x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9]], 4); }
  line(c, [[x, y], [x, y - r * 0.6]], 7); line(c, [[x, y], [x + r * 0.45, y + r * 0.2]], 8);
  shape(c, () => ell(c, x, y, 8, 8), INK, 0);
};
const stopwatch = (c: Ctx, x: number, y: number, r: number, wedge = Math.PI * 2) => {
  shadow(c, x + r * 0.12, y + r + 4, r * 0.9, r * 0.14);
  shape(c, () => rrect(c, x - 20, y - r - 38, 40, 40, 8), COL.steelDk);
  shape(c, () => ell(c, x, y, r, r), COL.steel);
  shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), WHITE, 4);
  c.beginPath(); c.moveTo(x, y); c.arc(x, y, r * 0.76, -Math.PI / 2, -Math.PI / 2 + wedge); c.closePath(); c.fillStyle = "rgba(243,154,60,0.55)"; c.fill();
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62], [x + Math.cos(a) * r * 0.76, y + Math.sin(a) * r * 0.76]], 4); }
  line(c, [[x, y], [x, y - r * 0.55]], 6);
};
const pegAt = (c: Ctx, x: number, y: number, s: number, t: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const hc = 44 - 24 * t, jc = 20 + 24 * t;
  for (const g of [1, -1]) {
    const pts = [[-150, -g * hc], [0, 0], [150, g * jc]];
    line(c, pts, 50, INK); line(c, pts, 38, COL.wood); line(c, [[-150, -g * hc + 12], [0, 12], [150, g * jc + 12]], 9, COL.woodDk);
  }
  shape(c, () => ell(c, -40, 0, 26, 26), COL.steel, 5);
  c.restore();
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.65, y + Math.sin(a) * r * 1.65]], 7); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
};
const moon = (c: Ctx, x: number, y: number, r: number) =>
  shape(c, () => { c.arc(x, y, r, -1.2, 1.2, true); c.arc(x + r * 0.616, y, r * 0.966, 1.834, -1.834, false); c.closePath(); }, COL.yellow, 6);
const star = (c: Ctx, x: number, y: number, r: number) => shape(c, () => polyP(c, [[x, y - r], [x + r * 0.3, y - r * 0.3], [x + r, y], [x + r * 0.3, y + r * 0.3], [x, y + r], [x - r * 0.3, y + r * 0.3], [x - r, y], [x - r * 0.3, y - r * 0.3]]), COL.yellow, 4);
const bubble = (c: Ctx, x: number, y: number, rx: number, ry: number) => shape(c, () => ell(c, x, y, rx, ry), WHITE, 5);
const headOf = (c: Ctx, x: number, hy: number, head: number, adult: boolean, closed = false) => {
  const skin = adult ? SKIN.adult : SKIN.child;
  shape(c, () => ell(c, x, hy, head, head * 1.05), skin);
  shape(c, () => { c.moveTo(x - head * 1.02, hy); c.bezierCurveTo(x - head, hy - head * 1.5, x + head, hy - head * 1.5, x + head * 1.02, hy); c.quadraticCurveTo(x, hy - head * 0.55, x - head * 1.02, hy); c.closePath(); }, CLOTH.hair, 5);
  if (!adult) shape(c, () => ell(c, x + head * 0.95, hy - head * 0.2, head * 0.32, head * 0.55), CLOTH.hair, 4);
  if (closed) for (const s of [-1, 1]) { c.beginPath(); c.arc(x + s * head * 0.38, hy + head * 0.08, head * 0.17, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
  else for (const s of [-1, 1]) shape(c, () => ell(c, x + s * head * 0.35, hy + head * 0.12, head * 0.09, head * 0.12), INK, 0);
  c.beginPath(); c.arc(x, hy + head * 0.38, head * 0.3, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
// a child asleep, head on a pillow at (x, y), body under a blanket going right
const sleeper = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - 110 * s, y - 10 * s, 190 * s, 70 * s, 30 * s), WHITE);
  headOf(c, x - 20 * s, y - 40 * s, 66 * s, false, true);
  shape(c, () => rrect(c, x + 20 * s, y - 20 * s, 420 * s, 110 * s, 40 * s), COL.teal);
  shade(c, () => rrect(c, x + 20 * s, y - 20 * s, 420 * s, 110 * s, 40 * s), COL.tealDk, 0, 30 * s);
  for (let k = 0; k < 4; k++) line(c, [[x + (120 + k * 85) * s, y - 4 * s], [x + (140 + k * 85) * s, y + 40 * s]], 4, COL.tealDk);
};
const dreamTrail = (c: Ctx, x: number, y: number, s: number) => {
  bubble(c, x, y, 14 * s, 14 * s); bubble(c, x + 36 * s, y - 50 * s, 24 * s, 24 * s);
  bubble(c, x + 110 * s, y - 130 * s, 80 * s, 62 * s); star(c, x + 110 * s, y - 130 * s, 32 * s);
};

// ---- 0 intro: arm out sideways holding a bottle, shaking, a wall clock behind
const intro = (c: Ctx) => {
  ground(c, WALL_DAY); floorOf(c, 930);
  wallClock(c, 800, 250, 120);
  shadow(c, 400, 935, 150, 22);
  const arm: [number, number] = [-0.03, 0.03], h = 640;
  person(c, 400, 930, h, { armR: arm, armL: [Math.PI * 0.55, Math.PI * 0.5] });
  const [wx, wy] = wristOf(400, 930, h, 1, arm);
  bottle(c, wx + 14, wy + 120, 110, 240);
  shape(c, () => ell(c, wx + 14, wy, 34, 34), SKIN.child, 5);
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { const yy = wy - 90 + k * 12; line(c, [[wx - 150 + s * 0 + k * 40, wy - 70 - s * 12], [wx - 130 + k * 40, wy - 90 - s * 10]], 5, RED); }
  line(c, [[wx + 90, wy - 40], [wx + 120, wy - 60]], 6, RED); line(c, [[wx + 100, wy + 10], [wx + 135, wy + 10]], 6, RED); line(c, [[wx + 90, wy + 60], [wx + 120, wy + 80]], 6, RED);
};
// ---- 1 summary: peg and timer by day, sleep by night
const summary = (c: Ctx) => {
  ground(c, WALL_DAY); c.fillStyle = WALL_NIGHT; c.fillRect(540, 0, 540, D); line(c, [[540, 0], [540, D]], 6);
  c.fillStyle = "#d9a766"; c.fillRect(0, 900, 540, 180); c.fillStyle = "#6a5a7a"; c.fillRect(540, 900, 540, 180); line(c, [[0, 900], [D, 900]], 6);
  // day: child at a table with a peg and a timer
  const h = 470, arm: [number, number] = [0.9, -0.5];
  person(c, 230, 905, h, { armR: arm });
  const [wx, wy] = wristOf(230, 905, h, 1, arm);
  pegAt(c, wx + 28, wy - 4, 0.3, 0.8, -0.5);
  shape(c, () => rrect(c, 40, 740, 470, 36, 10), COL.wood);
  for (const s of [60, 470]) { line(c, [[s, 776], [s, 900]], 24); line(c, [[s, 776], [s, 900]], 14, COL.brown); }
  stopwatch(c, 420, 690, 50, 2.2);
  // night: window with stars, bed, sleeping child, dreams
  shape(c, () => rrect(c, 770, 90, 220, 280, 14), NAVY, 7);
  line(c, [[880, 90], [880, 370]], 6); line(c, [[770, 230], [990, 230]], 6);
  moon(c, 925, 165, 38); star(c, 820, 135, 20); star(c, 830, 310, 16); star(c, 940, 300, 14);
  shape(c, () => rrect(c, 590, 760, 450, 130, 14), COL.brown);
  shape(c, () => rrect(c, 580, 700, 460, 80, 16), COL.cloth);
  for (const s of [595, 1025]) line(c, [[s, 880], [s, 900]], 22);
  sleeper(c, 690, 700, 0.75);
  dreamTrail(c, 650, 590, 0.9);
};
// ---- 2 flow.e2: arm down and arm up, both with a peg
const armUpDown = (c: Ctx) => {
  ground(c, WALL_DAY); floorOf(c, 930);
  const h = 560, down: [number, number] = [Math.PI / 2, Math.PI / 2], up: [number, number] = [-Math.PI / 2, -Math.PI / 2];
  for (const [x, a] of [[290, down], [790, up]] as [number, [number, number]][]) {
    shadow(c, x, 935, 120, 20);
    person(c, x, 930, h, { armR: a, armL: [Math.PI * 0.55, Math.PI * 0.5] });
    const [wx, wy] = wristOf(x, 930, h, 1, a);
    pegAt(c, wx + 8, a === up ? wy - 36 : wy + 30, 0.28, 0.8, Math.PI / 2);
  }
  arrow(c, [[460, 700], [460, 800]]); arrow(c, [[640, 300], [640, 200]]);
  line(c, [[540, 120], [540, 900]], 4, COL.greyDk);
};
// ---- 3 flow.e3: measuring height at the wall with a book on the head
const wallHeight = (c: Ctx) => {
  ground(c, WALL_DAY); floorOf(c, 930);
  const h = 640, x = 560, top = 930 - h * 1.013;
  // tape measure on the wall
  shape(c, () => rrect(c, 150, 200, 80, 730, 8), COL.yellow);
  for (let i = 0; i < 24; i++) line(c, [[230 - (i % 5 === 0 ? 40 : 22), 210 + i * 30], [230, 210 + i * 30]], 4);
  shadow(c, x, 935, 150, 22);
  person(c, x, 930, h, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [Math.PI * 0.45, Math.PI * 0.5] });
  shape(c, () => rrect(c, x - 130, top - 44, 260, 44, 8), COL.teal);
  line(c, [[x - 130, top - 12], [x + 130, top - 12]], 4, COL.tealDk);
  line(c, [[240, top - 44 + 44], [x - 130, top]], 4, RED);
  line(c, [[240, top], [880, top]], 6, COL.greyDk);
  shape(c, () => polyP(c, [[860, top - 12], [940, top - 76], [960, top - 56], [880, top + 12]]), COL.yellow);
  shape(c, () => polyP(c, [[860, top - 12], [880, top + 12], [848, top + 6]]), COL.wood);
};
// ---- 4 flow.a1: the heavy bottle, a hand holding it, shaking, with a timer
const heavyBottle = (c: Ctx) => {
  ground(c, WALL_DAY);
  limb(c, [[0, 560], [200, 560]], 110, CLOTH.child);
  bottle(c, 470, 800, 210, 460);
  hand(c, 215, 560, 0, 2.2);
  for (let k = 0; k < 3; k++) { line(c, [[290 + k * 0, 330 - k * 8]], 1); }
  line(c, [[320, 330], [300, 300]], 7, RED); line(c, [[380, 300], [380, 260]], 7, RED); line(c, [[440, 330], [460, 295]], 7, RED);
  line(c, [[640, 500], [690, 480]], 7, RED); line(c, [[650, 560], [705, 560]], 7, RED); line(c, [[640, 620], [690, 640]], 7, RED);
  stopwatch(c, 830, 440, 120, 4.4);
};
// ---- 5 flow.a3: a sleep diary and a 24-hour circle
const sleepDiary = (c: Ctx) => {
  ground(c, "#efe4cf");
  shadow(c, 540, 860, 460, 30);
  shape(c, () => rrect(c, 80, 190, 440, 640, 16), COL.paper); shape(c, () => rrect(c, 520, 190, 440, 640, 16), COL.paper);
  line(c, [[520, 190], [520, 830]], 6);
  for (let i = 0; i < 8; i++) line(c, [[120, 270 + i * 70], [480, 270 + i * 70]], 4, COL.grey);
  for (let i = 0; i < 6; i++) { const w = [330, 300, 350, 280, 320, 340][i]; shape(c, () => rrect(c, 130, 250 + i * 90, w, 44, 14), NAVY, 4); star(c, 160, 272 + i * 90, 10); }
  const cx = 740, cy = 500, r = 190;
  shape(c, () => { c.moveTo(cx, cy); c.arc(cx, cy, r, Math.PI, 0); c.closePath(); }, COL.yellow, 6);
  shape(c, () => { c.moveTo(cx, cy); c.arc(cx, cy, r, 0, Math.PI); c.closePath(); }, NAVY, 6);
  sun(c, cx, cy - 100, 36); moon(c, cx, cy + 100, 34); star(c, cx - 80, cy + 120, 12); star(c, cx + 90, cy + 70, 10);
  for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; line(c, [[cx + Math.cos(a) * (r - 4), cy + Math.sin(a) * (r - 4)], [cx + Math.cos(a) * (r + 18), cy + Math.sin(a) * (r + 18)]], 4); }
  // pencil
  c.save(); c.translate(860, 760); c.rotate(-0.9);
  shape(c, () => polyP(c, [[30, -16], [200, -16], [200, 16], [30, 16]]), COL.yellow); shape(c, () => polyP(c, [[-20, 0], [30, -16], [30, 16]]), COL.wood); shape(c, () => polyP(c, [[-20, 0], [-4, -6], [-4, 6]]), INK, 0);
  c.restore();
};
// ---- helpers for symbols
const bucket = (c: Ctx, x: number, y: number, w: number, h: number, water = true) => {
  shadow(c, x + w * 0.1, y + 6, w * 0.6, w * 0.1);
  c.beginPath(); c.arc(x, y - h, w * 0.5, Math.PI, 0); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
  const body = () => polyP(c, [[x - w / 2, y - h], [x + w / 2, y - h], [x + w * 0.38, y], [x - w * 0.38, y]]);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.2, 0);
  if (water) shape(c, () => ell(c, x, y - h, w / 2, w * 0.08), COL.water, 5);
  line(c, [[x - w * 0.4, y - h * 0.55], [x + w * 0.4, y - h * 0.55]], 4, COL.steelDk);
};
const slip = (c: Ctx, x: number, y: number, rot: number) => { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -50, -34, 100, 68, 5), WHITE, 5); line(c, [[-30, -10], [30, -10]], 4, COL.grey); line(c, [[-30, 10], [14, 10]], 4, COL.grey); c.restore(); };
// ---- 6 flow.a4: sort into stamina, strength, stretch
const sortBowls = (c: Ctx) => {
  ground(c, "#efe4cf");
  const xs = [200, 540, 880];
  xs.forEach((x, i) => {
    shape(c, () => rrect(c, x - 130, 170, 260, 300, 18), COL.paper);
    if (i === 0) stopwatch(c, x, 340, 85, 3);
    if (i === 1) bucket(c, x, 440, 140, 160);
    if (i === 2) { // a child reaching for the toes, small
      limb(c, [[x - 90, 430], [x + 100, 430]], 26, PANTS); limb(c, [[x - 90, 425], [x - 10, 345]], 46, CLOTH.child);
      limb(c, [[x - 5, 350], [x + 60, 400], [x + 100, 425]], 18, SKIN.child);
      headOf(c, x + 25, 322, 34, false);
    }
    bowl(c, x, 650, 130);
  });
  slip(c, 190, 640, -0.3); slip(c, 240, 665, 0.2); slip(c, 530, 645, 0.15); slip(c, 880, 650, -0.2);
  slip(c, 360, 800, 0.1);
  arrow(c, [[410, 780], [320, 700]]);
};
// ---- 7 flow.a5: a child asks a grandparent
const askElder = (c: Ctx) => {
  ground(c, WALL_DAY); floorOf(c, 900);
  shape(c, () => rrect(c, 90, 840, 900, 50, 12), COL.wood); // a bench
  for (const s of [150, 930]) line(c, [[s, 890], [s, 960]], 26);
  const cx = 320, ax = 700;
  person(c, cx, 840, 520, { sit: true });
  person(c, ax, 840, 600, { sit: true, adult: true });
  // grey hair on the grandparent
  const h = 600, head = h * 0.13, hy = (840 - h * 0.06 - h * 0.32) - head * 1.05;
  shape(c, () => { c.moveTo(ax - head * 1.02, hy); c.bezierCurveTo(ax - head, hy - head * 1.5, ax + head, hy - head * 1.5, ax + head * 1.02, hy); c.quadraticCurveTo(ax, hy - head * 0.55, ax - head * 1.02, hy); c.closePath(); }, "#e8e4ec", 5);
  // notebook
  shape(c, () => rrect(c, 380, 640, 110, 80, 8), COL.teal); line(c, [[395, 665], [475, 665]], 4, WHITE); line(c, [[395, 690], [455, 690]], 4, WHITE);
  // speech bubble: a ball in the sun
  bubble(c, 780, 220, 220, 130);
  sun(c, 700, 205, 38); shape(c, () => ell(c, 850, 240, 38, 38), COL.red, 5); line(c, [[820, 225], [880, 255]], 4, WHITE);
  bubble(c, 735, 345, 18, 14); bubble(c, 715, 390, 11, 9);
};
// ---- a girl in tree pose, feet (standing foot) at (x, y)
const treePose = (c: Ctx, x: number, y: number, h: number, adult = false) => {
  const skin = adult ? SKIN.adult : SKIN.child, cloth = adult ? CLOTH.adult : CLOTH.child, clothDk = adult ? CLOTH.adultDk : CLOTH.childDk;
  const hip = y - h * 0.42, sh = y - h * 0.74, head = h * 0.13;
  limb(c, [[x, hip], [x, y]], h * 0.075, PANTS);
  limb(c, [[x + h * 0.04, hip], [x + h * 0.21, hip + h * 0.04], [x + h * 0.03, y - h * 0.2]], h * 0.07, PANTS);
  shape(c, () => ell(c, x + h * 0.03, y - h * 0.2, h * 0.04, h * 0.03), skin, 5);
  shape(c, () => rrect(c, x - h * 0.13, sh - h * 0.02, h * 0.26, hip - sh + h * 0.06, h * 0.06), cloth);
  shade(c, () => rrect(c, x - h * 0.13, sh - h * 0.02, h * 0.26, hip - sh + h * 0.06, h * 0.06), clothDk, h * 0.07, 0);
  const hy = sh - head * 1.05;
  const sy = sh + h * 0.03;
  limb(c, [[x - h * 0.11, sy], [x - h * 0.15, sy - h * 0.14], [x - h * 0.02, hy - head * 2.1]], h * 0.06, cloth);
  limb(c, [[x + h * 0.11, sy], [x + h * 0.15, sy - h * 0.14], [x + h * 0.02, hy - head * 2.1]], h * 0.06, cloth);
  shape(c, () => ell(c, x, hy - head * 2.15, h * 0.05, h * 0.04), skin, 5);
  headOf(c, x, hy, head, adult);
};
// ---- 8 flow.p1: ten-day yoga log
const yogaLog = (c: Ctx) => {
  ground(c, WALL_DAY); floorOf(c, 900);
  shape(c, () => rrect(c, 40, 880, 420, 40, 14), COL.purple);
  shadow(c, 250, 905, 130, 14);
  treePose(c, 250, 890, 600);
  shadow(c, 750, 880, 300, 24);
  shape(c, () => rrect(c, 520, 250, 440, 600, 16), COL.paper);
  shape(c, () => rrect(c, 520, 250, 440, 60, 16), COL.teal);
  for (let i = 0; i < 10; i++) {
    const bx = 565 + (i % 2) * 190, by = 350 + Math.floor(i / 2) * 96;
    shape(c, () => rrect(c, bx, by, 150, 70, 8), "#fffdf6", 4);
    if (i < 7) line(c, [[bx + 50, by + 36], [bx + 72, by + 54], [bx + 106, by + 14]], 10, COL.leafDk);
  }
};
// ---- 9 flow.c1: a rainy day, a workout in a small flat
const monsoonWorkout = (c: Ctx) => {
  ground(c, WALL_DAY); floorOf(c, 930);
  shape(c, () => rrect(c, 90, 150, 300, 380, 14), COL.sky, 7);
  line(c, [[240, 150], [240, 530]], 6); line(c, [[90, 340], [390, 340]], 6);
  shape(c, () => { ell(c, 170, 220, 60, 30); ell(c, 240, 205, 56, 38); ell(c, 305, 225, 55, 30); }, COL.steel, 5);
  for (let i = 0; i < 9; i++) line(c, [[130 + i * 30, 290 + (i % 3) * 30], [120 + i * 30, 330 + (i % 3) * 30]], 6, COL.blueDk);
  shape(c, () => rrect(c, 400, 905, 580, 36, 16), COL.purple);
  const h = 600, up: [number, number] = [-1.1, -1.4], upL: [number, number] = [Math.PI + 1.1, Math.PI + 1.4];
  shadow(c, 690, 940, 140, 20);
  person(c, 690, 905, h, { armR: up, armL: upL });
  for (const [side, a] of [[1, up], [-1, upL]] as [-1 | 1, [number, number]][]) {
    const [wx, wy] = wristOf(690, 905, h, side, a);
    bottle(c, wx, wy + 60, 70, 150);
    shape(c, () => ell(c, wx, wy - 4, 24, 24), SKIN.child, 5);
  }
  arrow(c, [[900, 520], [900, 400]]); arrow(c, [[480, 400], [480, 520]]);
};
// ---- 10 flow.c2: a shoebox model of a quiet sleeping room
const sleepDen = (c: Ctx) => {
  ground(c, "#efe4cf");
  shadow(c, 600, 900, 380, 30);
  shape(c, () => polyP(c, [[230, 280], [830, 280], [830, 700], [230, 700]]), "#7a7fb8");
  shape(c, () => polyP(c, [[150, 200], [230, 280], [230, 700], [150, 820]]), "#b5b7dd");
  shape(c, () => polyP(c, [[910, 200], [830, 280], [830, 700], [910, 820]]), "#a3a6d2");
  shape(c, () => polyP(c, [[230, 700], [830, 700], [910, 820], [150, 820]]), "#d9a766");
  shape(c, () => polyP(c, [[150, 200], [910, 200], [830, 280], [230, 280]]), "#9a9fd0");
  shape(c, () => rrect(c, 420, 340, 220, 200, 8), NAVY, 6); moon(c, 570, 410, 30); star(c, 470, 400, 14); star(c, 500, 490, 12);
  shape(c, () => polyP(c, [[390, 320], [430, 320], [450, 560], [380, 560]]), "#3a3550", 5); shape(c, () => polyP(c, [[650, 320], [690, 320], [700, 560], [630, 560]]), "#3a3550", 5);
  for (const [px, py] of [[190, 380], [200, 500], [185, 620], [875, 380], [870, 500], [880, 620]]) shape(c, () => { ell(c, px, py, 30, 22); ell(c, px + 22, py - 10, 24, 20); }, WHITE, 4);
  shape(c, () => rrect(c, 300, 590, 230, 70, 12), COL.brown); shape(c, () => rrect(c, 310, 550, 215, 50, 14), COL.cloth); shape(c, () => rrect(c, 312, 540, 62, 34, 14), WHITE);
  for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(70, 560, 40 + i * 36, -0.9, 0.9); c.strokeStyle = RED; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
  arrow(c, [[10, 740], [90, 740]]);
};


// ---- an arm drawn bare: shoulder cap on the left, upper arm, elbow, forearm, fist
const bareArm = (c: Ctx, pts: number[][], w: number) => { limb(c, pts, w, SKIN.child); const e = pts[pts.length - 1]; shape(c, () => ell(c, e[0], e[1], w * 0.8, w * 0.8), SKIN.child, 6); };
// ---- 11 term.1 Contract: arm bent, muscle bulging
const contract = (c: Ctx) => {
  ground(c, WALL_DAY);
  shape(c, () => rrect(c, 60, 400, 230, 420, 50), CLOTH.child);
  shadow(c, 600, 880, 330, 24);
  limb(c, [[220, 560], [560, 600], [640, 250]], 120, SKIN.child);
  shape(c, () => ell(c, 640, 205, 66, 66), SKIN.child, 6);
  shape(c, () => { c.moveTo(380, 540); c.bezierCurveTo(420, 400, 560, 400, 600, 530); c.bezierCurveTo(540, 560, 440, 560, 380, 540); c.closePath(); }, COL.red, 7);
  line(c, [[420, 500], [560, 490]], 4, "#b03a28");
  arrow(c, [[380, 400], [440, 360]]); arrow(c, [[620, 400], [560, 360]]);
};
// ---- 12 term.2 Relax: same arm hanging soft
const relax = (c: Ctx) => {
  ground(c, WALL_DAY);
  shape(c, () => rrect(c, 280, 70, 420, 220, 60), CLOTH.child);
  shadow(c, 480, 960, 100, 16);
  limb(c, [[400, 200], [410, 520], [420, 860]], 120, SKIN.child);
  shape(c, () => ell(c, 420, 900, 60, 60), SKIN.child, 6);
  shape(c, () => { c.moveTo(350, 300); c.bezierCurveTo(350, 400, 350, 470, 380, 510); c.lineTo(450, 510); c.bezierCurveTo(480, 470, 470, 400, 470, 300); c.closePath(); }, "#d9806b", 6);
  arrow(c, [[640, 300], [640, 460]]);
};
// ---- 13 term.3 Fatigue: a hand squeezing a peg, shaking
const fatigue = (c: Ctx) => {
  ground(c, WALL_DAY);
  limb(c, [[0, 640], [230, 640]], 120, CLOTH.child);
  pegAt(c, 660, 560, 1.2, 0.9, 0);
  limb(c, [[250, 570], [450, 510], [580, 500]], 70, SKIN.child);
  limb(c, [[250, 700], [450, 730], [560, 650]], 60, SKIN.child);
  shape(c, () => ell(c, 330, 625, 100, 100), SKIN.child, 6);
  for (let k = 0; k < 3; k++) { line(c, [[790, 430 + k * 60], [850, 410 + k * 60]], 8, RED); line(c, [[440, 330 + k * 0], [440, 330]], 1); }
  line(c, [[480, 380], [450, 340]], 8, RED); line(c, [[560, 360], [560, 310]], 8, RED); line(c, [[640, 380], [670, 340]], 8, RED);
  for (const [x, y] of [[860, 700], [900, 780]]) shape(c, () => polyP(c, [[x, y - 24], [x + 10, y - 6], [x + 28, y - 4], [x + 14, y + 10], [x + 18, y + 28], [x, y + 18], [x - 18, y + 28], [x - 14, y + 10], [x - 28, y - 4], [x - 10, y - 6]]), COL.yellow, 4);
};
// ---- 14 term.4 Oxygen: breath in, lungs, blood to the legs
const oxygen = (c: Ctx) => {
  ground(c, WALL_DAY); floorOf(c, 960);
  const h = 800, x = 540;
  shadow(c, x, 965, 150, 22);
  person(c, x, 960, h, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [Math.PI * 0.45, Math.PI * 0.5] });
  const sh = 960 - h * 0.74;
  for (const s of [-1, 1]) shape(c, () => { c.moveTo(x + s * 8, sh + 20); c.bezierCurveTo(x + s * 70, sh, x + s * 90, sh + 110, x + s * 70, sh + 150); c.bezierCurveTo(x + s * 30, sh + 165, x + s * 8, sh + 120, x + s * 8, sh + 20); c.closePath(); }, COL.pink, 5);
  line(c, [[x, sh - 20], [x, sh + 70]], 8, INK);
  for (const [dx, dy] of [[-170, -150], [-130, -110], [-190, -80], [-90, -170]]) shape(c, () => ell(c, x + dx, sh + dy, 14, 14), COL.sky, 4);
  arrow(c, [[x - 200, sh - 40], [x - 90, sh + 40]]);
  const red = [[x, sh + 160], [x, 960 - h * 0.42], [x + 55, 960 - h * 0.42 + 40], [x + 55, 960 - 70]];
  line(c, red, 22, INK); line(c, red, 12, COL.red); line(c, [[x, 960 - h * 0.42], [x - 55, 960 - h * 0.42 + 40], [x - 55, 960 - 70]], 22, INK); line(c, [[x, 960 - h * 0.42], [x - 55, 960 - h * 0.42 + 40], [x - 55, 960 - 70]], 12, COL.red);
  for (const [dx, dy] of [[0, 960 - h * 0.42 - 60], [55, 960 - h * 0.2], [-55, 960 - h * 0.2]]) shape(c, () => ell(c, x + dx, dy, 9, 9), COL.sky, 3);
};
// ---- 15 term.6 Strength: carrying a bucket of water up the stairs
const strength = (c: Ctx) => {
  ground(c, WALL_DAY);
  for (let i = 0; i < 4; i++) shape(c, () => polyP(c, [[140 + i * 190, 930 - i * 150], [D, 930 - i * 150], [D, D], [140 + i * 190, D]]), i % 2 ? "#cfc4ae" : "#d9ceb8", 6);
  shape(c, () => rrect(c, 0, 930, 340, 150, 0), "#d9ceb8", 6);
  const x = 600, y = 630, h = 430;
  shadow(c, x, y + 4, 120, 18);
  person(c, x, y, h, { armL: [Math.PI * 0.5, Math.PI * 0.5], armR: [Math.PI * 0.45, Math.PI * 0.5] });
  const [wx, wy] = wristOf(x, y, h, -1, [Math.PI * 0.5, Math.PI * 0.5]);
  bucket(c, wx, wy + 100, 90, 90);
  shape(c, () => ell(c, wx, wy, 16, 16), SKIN.child, 5);
  arrow(c, [[690, 420], [790, 340]]);
};
// ---- 16 term.7 Flexibility: sitting, legs straight, reaching for the toes
const flexibility = (c: Ctx) => {
  ground(c, WALL_DAY); floorOf(c, 800);
  shadow(c, 540, 800, 400, 28);
  limb(c, [[330, 770], [810, 770]], 90, PANTS);
  shape(c, () => rrect(c, 790, 680, 70, 100, 20), SKIN.child, 6);
  limb(c, [[300, 760], [470, 520]], 190, CLOTH.child);
  limb(c, [[480, 560], [660, 640], [790, 720]], 52, SKIN.child);
  headOf(c, 560, 460, 105, false);
  arrow(c, [[640, 400], [790, 560]], RED, 10);
};
// ---- 17 term.9 Pranayama: cross-legged, eyes closed, hand on belly
const pranayama = (c: Ctx) => {
  ground(c, WALL_DAY); floorOf(c, 900);
  const x = 540;
  shape(c, () => rrect(c, 180, 880, 720, 36, 16), COL.purple);
  shadow(c, x, 880, 260, 22);
  shape(c, () => ell(c, x - 80, 800, 190, 70, 0.1), PANTS); shape(c, () => ell(c, x + 80, 800, 190, 70, -0.1), "#7d6ba0");
  shape(c, () => rrect(c, x - 125, 400, 250, 400, 70), CLOTH.child); shade(c, () => rrect(c, x - 125, 400, 250, 400, 70), CLOTH.childDk, 40, 0);
  headOf(c, x, 300, 100, false, true);
  limb(c, [[x - 120, 470], [x - 150, 610], [x - 20, 640]], 40, CLOTH.child); limb(c, [[x + 120, 470], [x + 150, 610], [x + 20, 640]], 40, CLOTH.child);
  shape(c, () => ell(c, x - 10, 640, 36, 36), SKIN.child, 5); shape(c, () => ell(c, x + 14, 640, 36, 36), SKIN.child, 5);
  arrow(c, [[x + 270, 720], [x + 270, 540]]); arrow(c, [[x + 340, 540], [x + 340, 720]]);
  arrow(c, [[x - 270, 720], [x - 270, 540]]); arrow(c, [[x - 340, 540], [x - 340, 720]]);
};
// ---- 18 term.10 Sleep cycle: a ring over a sleeping child
const sleepCycle = (c: Ctx) => {
  ground(c, WALL_NIGHT);
  const cx = 540, cy = 480, R = 400, r0 = 260;
  const cols = ["#bfe0f5", NAVY, COL.purple];
  for (let i = 0; i < 3; i++) {
    const a0 = -Math.PI / 2 + (i * 2 * Math.PI) / 3 + 0.03, a1 = -Math.PI / 2 + ((i + 1) * 2 * Math.PI) / 3 - 0.03;
    shape(c, () => { c.arc(cx, cy, R, a0, a1); c.arc(cx, cy, r0, a1, a0, true); c.closePath(); }, cols[i], 7);
  }
  const ic = (i: number) => [cx + 330 * Math.cos(-Math.PI / 2 + ((i + 0.5) * 2 * Math.PI) / 3), cy + 330 * Math.sin(-Math.PI / 2 + ((i + 0.5) * 2 * Math.PI) / 3)];
  let [px, py] = ic(0); line(c, [[px - 50, py], [px - 25, py - 14], [px, py], [px + 25, py - 14], [px + 50, py]], 8, INK);
  [px, py] = ic(1); line(c, [[px - 50, py], [px + 50, py]], 10, WHITE);
  [px, py] = ic(2); bubble(c, px, py, 55, 42); star(c, px, py, 24);
  arrow(c, [[cx + 190, cy - 330], [cx + 330, cy - 200]], RED, 12);
  shape(c, () => ell(c, cx, cy + 60, 210, 130), "#6a5a7a", 0);
  sleeper(c, cx - 150, cy + 20, 0.55);
};
// ---- 19 term.11 REM: a sleeping face, eyes moving under the lids
const rem = (c: Ctx) => {
  ground(c, WALL_NIGHT);
  const x = 540, y = 600;
  shape(c, () => ell(c, x, y, 330, 350), SKIN.child, 7);
  shape(c, () => { c.moveTo(x - 335, y - 20); c.bezierCurveTo(x - 330, y - 520, x + 330, y - 520, x + 335, y - 20); c.quadraticCurveTo(x, y - 230, x - 335, y - 20); c.closePath(); }, CLOTH.hair, 7);
  for (const s of [-1, 1]) {
    shape(c, () => ell(c, x + s * 135, y + 20, 80, 52), "#d8956b", 6);
    c.beginPath(); c.arc(x + s * 135, y + 10, 80, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
    arrow(c, [[x + s * 135 - 50, y + 150], [x + s * 135 + 50, y + 150]], RED, 9); arrow(c, [[x + s * 135 + 50, y + 150], [x + s * 135 - 50, y + 150]], RED, 9);
  }
  c.beginPath(); c.arc(x, y + 200, 80, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
  bubble(c, 880, 180, 120, 90); star(c, 880, 180, 44); bubble(c, 760, 290, 26, 20);
};
// ---- 20 term.12 Spinal disc: bones with soft pads between
const disc = (c: Ctx) => {
  ground(c, WALL_DAY);
  shadow(c, 540, 960, 300, 24);
  for (let i = 0; i < 5; i++) {
    const y = 120 + i * 175, off = [0, -14, -20, -14, 0][i];
    shape(c, () => rrect(c, 340 + off, y, 330, 120, 40), "#f0e2c6", 7);
    shape(c, () => polyP(c, [[670 + off, y + 25], [800 + off, y + 55], [670 + off, y + 90]]), "#f0e2c6", 7);
    if (i < 4) { shape(c, () => rrect(c, 360 + off * 0.8, y + 124, 290, 46, 23), COL.pink, 6); line(c, [[400 + off, y + 147], [610 + off, y + 147]], 4, "#c9728f"); }
  }
  arrow(c, [[200, 110], [200, 260]]); arrow(c, [[200, 960], [200, 810]]);
};

// ---- 21 expl.0 What a working muscle uses up: fuel tank emptying, blood bringing oxygen
const fuelStore = (c: Ctx, x: number, y: number, w: number, h: number, level: number) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 24), COL.glass, 6);
  c.save(); c.beginPath(); rrect(c, x - w / 2, y - h / 2, w, h, 24); c.clip(); c.fillStyle = COL.orange; c.fillRect(x - w / 2, y + h / 2 - h * level, w, h * level); c.restore();
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 24), "rgba(0,0,0,0)", 6);
  c.setLineDash([14, 12]); line(c, [[x - w / 2 + 8, y - h / 2 + 24], [x + w / 2 - 8, y - h / 2 + 24]], 4, COL.greyDk); c.setLineDash([]);
};
const muscleBody = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const p = () => { c.moveTo(x - w / 2, y); c.bezierCurveTo(x - w * 0.3, y - h * 0.62, x + w * 0.3, y - h * 0.62, x + w / 2, y); c.bezierCurveTo(x + w * 0.3, y + h * 0.62, x - w * 0.3, y + h * 0.62, x - w / 2, y); c.closePath(); };
  shape(c, p, COL.red, 7);
  for (let k = -2; k <= 2; k++) line(c, [[x - w * 0.4, y + k * h * 0.13], [x + w * 0.4, y + k * h * 0.13]], 4, "#b03a28");
};
const muscleFuel = (c: Ctx) => {
  ground(c, WALL_DAY);
  muscleBody(c, 540, 400, 940, 520);
  fuelStore(c, 540, 400, 190, 260, 0.2);
  arrow(c, [[540, 330], [540, 400]], RED, 0);
  const v = [[60, 850], [980, 850]]; line(c, v, 70, INK); line(c, v, 56, COL.red);
  for (const x of [150, 300, 450, 600, 750]) shape(c, () => ell(c, x, 850, 17, 17), COL.sky, 4);
  arrow(c, [[540, 800], [540, 640]], RED, 12);
  arrow(c, [[400, 360], [400, 440]], RED, 10);
};
// ---- 22 expl.1 Tired muscle, or the brain braking
const twoAnswers = (c: Ctx) => {
  ground(c, WALL_DAY); line(c, [[540, 60], [540, 1020]], 6);
  muscleBody(c, 270, 520, 430, 330); fuelStore(c, 270, 520, 100, 170, 0.12);
  shape(c, () => { c.moveTo(600, 460); c.bezierCurveTo(600, 330, 700, 290, 800, 280); c.bezierCurveTo(930, 280, 1010, 380, 990, 470); c.bezierCurveTo(970, 560, 880, 580, 800, 570); c.bezierCurveTo(700, 580, 600, 560, 600, 460); c.closePath(); }, COL.pink, 7);
  for (const pts of [[[680, 420], [740, 360], [800, 400], [850, 340]], [[720, 500], [790, 450], [850, 510], [920, 450]], [[900, 400], [940, 440]]]) line(c, pts, 6, "#c9728f");
  line(c, [[790, 575], [790, 690]], 18, INK); line(c, [[790, 575], [790, 690]], 10, "#e8a9b8");
  shape(c, () => rrect(c, 700, 860, 200, 50, 14), COL.steelDk);
  line(c, [[790, 690], [790, 860]], 28, INK); line(c, [[790, 690], [790, 860]], 18, RED);
  hand(c, 850, 770, Math.PI, 0.8);
  arrow(c, [[690, 760], [690, 850]], RED, 9);
};
// ---- 23 expl.3 Yoga on a balcony: tree pose and cobra
const balconyYoga = (c: Ctx) => {
  ground(c, "#fbe4b8"); sun(c, 800, 230, 70);
  floorOf(c, 900, "#cfc4ae");
  shape(c, () => rrect(c, 0, 780, D, 36, 8), COL.wood);
  for (let i = 0; i < 14; i++) line(c, [[40 + i * 80, 816], [40 + i * 80, 900]], 14);
  shape(c, () => rrect(c, 80, 940, 330, 30, 14), COL.purple); shape(c, () => rrect(c, 500, 940, 480, 30, 14), COL.teal);
  const g = { x: 240, h: 600 };
  treePose(c, g.x, 940, g.h, true);
  const head = g.h * 0.13, hy = 940 - g.h * 0.74 - head * 1.05;
  shape(c, () => { c.moveTo(g.x - head * 1.02, hy); c.bezierCurveTo(g.x - head, hy - head * 1.5, g.x + head, hy - head * 1.5, g.x + head * 1.02, hy); c.quadraticCurveTo(g.x, hy - head * 0.55, g.x - head * 1.02, hy); c.closePath(); }, "#e8e4ec", 5);
  // child in cobra
  c.save(); c.translate(150, 0);
  limb(c, [[560, 925], [960, 925]], 56, PANTS);
  limb(c, [[640, 920], [540, 790], [470, 700]], 100, CLOTH.child);
  limb(c, [[500, 730], [540, 840], [540, 930]], 30, SKIN.child);
  headOf(c, 440, 600, 70, false);
  c.restore();
};
// ---- 24 expl.5 Why we sleep: three animals asleep or resting, each with a moon
const animalsSleep = (c: Ctx) => {
  ground(c, WALL_NIGHT);
  line(c, [[360, 60], [360, 1020]], 6); line(c, [[720, 60], [720, 1020]], 6);
  [180, 540, 900].forEach((x) => moon(c, x, 150, 50));
  // fruit fly, seen from above, at (180, 600)
  c.save(); c.translate(180, 620); c.scale(1.25, 1.25);
  for (const s of [-1, 1]) for (const [dy, dx] of [[-30, 70], [0, 80], [30, 70]]) line(c, [[s * 20, dy], [s * dx, dy + 24], [s * (dx + 20), dy + 70]], 7);
  for (const s of [-1, 1]) shape(c, () => ell(c, s * 52, 20, 24, 70, s * -0.5), "rgba(214,236,250,0.8)", 5);
  shape(c, () => ell(c, 0, 55, 36, 62), COL.orange); for (let k = 0; k < 3; k++) line(c, [[-30, 38 + k * 22], [30, 38 + k * 22]], 5);
  shape(c, () => ell(c, 0, -22, 30, 28), COL.brown);
  for (const s of [-1, 1]) shape(c, () => ell(c, s * 24, -48, 18, 20), RED, 4);
  c.restore();
  // dolphin at (540, 640), one eye open
  c.save(); c.translate(540, 640);
  const body = () => { c.moveTo(-160, 20); c.bezierCurveTo(-120, -90, 40, -110, 130, -30); c.bezierCurveTo(170, 0, 190, 40, 200, 90); c.bezierCurveTo(130, 80, 20, 120, -60, 80); c.bezierCurveTo(-110, 60, -150, 60, -160, 20); c.closePath(); };
  shape(c, body, COL.steelDk, 7); shade(c, body, COL.greyDk, 0, 30);
  shape(c, () => { c.moveTo(-160, 20); c.lineTo(-190, 12); c.lineTo(-192, 30); c.lineTo(-150, 50); c.closePath(); }, COL.steelDk, 6);
  shape(c, () => polyP(c, [[190, 70], [260, 20], [250, 110], [215, 100]]), COL.steelDk, 6);
  shape(c, () => polyP(c, [[-10, -85], [20, -150], [60, -85]]), COL.steelDk, 6);
  shape(c, () => ell(c, -105, 22, 10, 10), WHITE, 4); shape(c, () => ell(c, -105, 22, 4, 4), INK, 0);
  line(c, [[-155, 30], [-80, 50]], 4);
  c.restore();
  // frigatebird gliding at (900, 640)
  c.save(); c.translate(905, 640); c.scale(0.78, 0.78);
  const wing = (s: number) => shape(c, () => { c.moveTo(s * 30, -10); c.bezierCurveTo(s * 100, -90, s * 180, -60, s * 215, 0); c.bezierCurveTo(s * 130, -10, s * 80, 30, s * 30, 30); c.closePath(); }, INK, 7);
  wing(-1); wing(1);
  shape(c, () => polyP(c, [[-20, 40], [-70, 160], [-18, 120], [0, 180], [18, 120], [70, 160], [20, 40]]), INK, 6);
  shape(c, () => ell(c, 0, 10, 36, 56), INK, 6);
  shape(c, () => ell(c, 0, -52, 22, 24), INK, 6);
  shape(c, () => polyP(c, [[10, -56], [60, -42], [14, -40]]), COL.greyDk, 5);
  shape(c, () => ell(c, 4, -26, 18, 16), RED, 4);
  c.restore();
};
// ---- 25 expl.6 Taller in the morning: two marks, night and morning
const twoMarks = (c: Ctx) => {
  ground(c, WALL_DAY); floorOf(c, 930);
  const h = 640, x = 380, top = 930 - h * 1.013;
  shadow(c, x, 935, 150, 22);
  person(c, x, 930, h, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [Math.PI * 0.45, Math.PI * 0.5] });
  line(c, [[x + 90, top + 60], [840, top + 60]], 10, COL.greyDk);
  line(c, [[x + 90, top], [840, top]], 10, INK);
  moon(c, 920, top + 80, 36); sun(c, 920, top - 20, 30);
  arrow(c, [[740, top + 50], [740, top + 5]], RED, 10);
};

export const ic_healthExerciseAndRestL3 = cards("sci.health.exercise-and-rest.L3 cards", [intro, summary, armUpDown, wallHeight, heavyBottle, sleepDiary, sortBowls, askElder, yogaLog, monsoonWorkout, sleepDen, contract, relax, fatigue, oxygen, strength, flexibility, pranayama, sleepCycle, rem, disc, muscleFuel, twoAnswers, balconyYoga, animalsSleep, twoMarks]);
