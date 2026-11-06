import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, CLOTH, SKIN, ground, shape, ell, rrect, shadow, shade, line, arrow, write, person, cards, plate, bowl } from "./flatKit";

// EXERCISE AND REST (L2) · flat set-up cards and card pictures: the puff count test, the three moves test,
// bedtime cards, the four-box chart, and the things a child can see (exercise, a muscle, rest, sleep, hopscotch).

const TROUSER = "#6b5a8c", SHOE = "#3a3540", MAT = "#3fb1a8", MATDK = "#2a8a83", FLOOR = "#e3d3b5", WALL = "#f3e9d6";

// where the parts of a person() sit, so things can be put at the tummy, mouth or cheeks
const geom = (y: number, h: number, sit = false, ad = false) => {
  const head = h * (ad ? 0.115 : 0.15), hip = sit ? y - h * 0.07 : y - h * (ad ? 0.46 : 0.4), sh = hip - h * (ad ? 0.3 : 0.27), torsoW = h * (ad ? 0.27 : 0.25);
  return { head, hip, sh, hy: sh - head * 1.12, torsoW, shY: sh + h * 0.03, shX: torsoW * 0.42 };
};
// the body path of person(), used to clip new legs so they stay under the shirt
const bodyPath = (c: Ctx, x: number, y: number, h: number) => {
  const { sh, hip, torsoW } = geom(y, h);
  c.moveTo(x - torsoW / 2, sh + h * 0.03); c.quadraticCurveTo(x - torsoW / 2, sh - h * 0.015, x - torsoW * 0.32, sh - h * 0.015); c.lineTo(x + torsoW * 0.32, sh - h * 0.015); c.quadraticCurveTo(x + torsoW / 2, sh - h * 0.015, x + torsoW / 2, sh + h * 0.03); c.lineTo(x + torsoW * 0.44, hip + h * 0.05); c.quadraticCurveTo(x, hip + h * 0.09, x - torsoW * 0.44, hip + h * 0.05); c.closePath();
};
type Leg = { side: -1 | 1; knee?: [number, number]; foot: [number, number]; sole?: boolean };
// give a standing child new legs (a lifted knee, legs spread in a jump, a foot folded back): the old legs are
// painted over with the background painter bg (clipped under the shirt), then the new legs drawn. ground = the
// floor line for the shadow (omit when the child is in the air and the shadow is drawn by hand)
const legsTo = (c: Ctx, x: number, y: number, h: number, bg: () => void, legs: Leg[], groundY?: number) => {
  const { hip } = geom(y, h), legW = h * 0.08;
  c.save(); c.beginPath(); c.rect(x - h * 0.45, hip + h * 0.04, h * 0.9, y - hip + h * 0.08); bodyPath(c, x, y, h); c.clip("evenodd"); bg(); c.restore();
  if (groundY !== undefined) shadow(c, x, groundY + 4, h * 0.2, h * 0.035);
  c.save(); c.beginPath(); c.rect(0, 0, D, D); bodyPath(c, x, y, h); c.clip("evenodd");
  for (const L of legs) {
    const pts = [[x + L.side * h * 0.055, hip], ...(L.knee ? [L.knee] : []), L.foot];
    line(c, pts, legW, INK); line(c, pts, legW - 10, TROUSER);
    const [fx, fy] = L.foot;
    if (L.sole) shape(c, () => ell(c, fx, fy, h * 0.055, h * 0.035), SHOE, 4);
    else shape(c, () => { c.moveTo(fx - h * 0.04, fy - 14); c.lineTo(fx + h * 0.04, fy - 14); c.quadraticCurveTo(fx + L.side * h * 0.1, fy - 12, fx + L.side * h * 0.1, fy); c.lineTo(fx - h * 0.045, fy); c.closePath(); }, SHOE, 4);
  }
  c.restore();
};
const blush = (c: Ctx, x: number, y: number, h: number, sit = false) => {
  const { head, hy } = geom(y, h, sit);
  c.globalAlpha = 0.85; for (const s of [-1, 1]) shape(c, () => ell(c, x + s * head * 0.62, hy + head * 0.38, head * 0.24, head * 0.15), "#ef7f6e", 0); c.globalAlpha = 1;
};
// a breath cloud: a few white bumps with one outline round the outside
const puff = (c: Ctx, x: number, y: number, r: number) => {
  const bs = [[x - r * 0.7, y + r * 0.1, r * 0.55], [x, y - r * 0.15, r * 0.7], [x + r * 0.7, y + r * 0.1, r * 0.55], [x, y + r * 0.35, r * 0.5]];
  bs.forEach(([bx, by, br]) => shape(c, () => ell(c, bx, by, br, br), WHITE, 5));
  bs.forEach(([bx, by, br]) => shape(c, () => ell(c, bx, by, br, br), WHITE, 0));
};
// short motion marks beside something moving fast
const whoosh = (c: Ctx, x: number, y: number, an: number, n = 3) => {
  for (let i = 0; i < n; i++) { const a = an + (i - (n - 1) / 2) * 0.5; line(c, [[x + Math.cos(a) * 18, y + Math.sin(a) * 18], [x + Math.cos(a) * 48, y + Math.sin(a) * 48]], 5, INK); }
};
// a phone showing a timer, held upright with its middle at the hand point
const phone = (c: Ctx, x: number, y: number) => {
  shape(c, () => rrect(c, x - 34, y - 60, 68, 120, 10), COL.black, 5);
  shape(c, () => rrect(c, x - 26, y - 50, 52, 100, 6), "#dff3f8", 3);
  c.beginPath(); c.arc(x, y - 22, 16, -Math.PI / 2, Math.PI * 0.9); c.strokeStyle = COL.tealDk; c.lineWidth = 5; c.lineCap = "round"; c.stroke();
  write(c, "30", x - 19, y + 6, 30, INK, 5);
};
// the exercise mat: a teal rectangle on the floor
const mat = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 10, y + h - 4, w / 2, 18);
  shape(c, () => rrect(c, x, y, w, h, 18), MAT); shade(c, () => rrect(c, x, y, w, h, 18), MATDK, 0, h * 0.45);
};
const floor = (c: Ctx, y = 700) => { ground(c, WALL); c.fillStyle = FLOOR; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 5, INK); };
// a sofa pushed back against the wall, and a small speaker: the dancing room
const sofa = (c: Ctx, x: number, y: number, w: number) => {
  shadow(c, x + w / 2 + 12, y + 8, w / 2, 16);
  shape(c, () => rrect(c, x, y - 190, w, 120, 18), COL.purple); shade(c, () => rrect(c, x, y - 190, w, 120, 18), "#6a4fa3", 0, 60);
  shape(c, () => rrect(c, x - 16, y - 100, w + 32, 100, 18), "#9b7fd6"); shade(c, () => rrect(c, x - 16, y - 100, w + 32, 100, 18), COL.purple, 0, 50);
  for (const k of [0, 1]) shape(c, () => rrect(c, x + 18 + k * (w / 2), y - 175, w / 2 - 36, 90, 14), COL.yellow, 5);
};
const speaker = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 8, y + 4, 50, 10);
  shape(c, () => rrect(c, x - 40, y - 110, 80, 110, 12), COL.black); shape(c, () => ell(c, x, y - 60, 24, 24), COL.greyDk, 4); shape(c, () => ell(c, x, y - 60, 9, 9), INK, 0);
  for (const r of [50, 75]) { c.beginPath(); c.arc(x, y - 60, r, -0.5, 0.5); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); c.beginPath(); c.arc(x, y - 60, r, Math.PI - 0.5, Math.PI + 0.5); c.stroke(); }
};
const note = (c: Ctx, x: number, y: number) => { shape(c, () => ell(c, x, y, 13, 10, -0.4), INK, 0); line(c, [[x + 11, y - 4], [x + 11, y - 48], [x + 32, y - 56]], 6, INK); };

// ---- the three people we reuse: the sitting counter, the dancer, the three movers
const sitter = (c: Ctx, x: number, y: number, h: number, puffed = false) => {
  const g = geom(y, h, true);
  person(c, x, y, h, { sit: true, dir: 1, reachR: [x + h * 0.04, g.hip - h * 0.07] });
  if (puffed) {
    blush(c, x, y, h, true);
    puff(c, x + g.head * 1.5, g.hy + g.head * 0.1, 26); puff(c, x + g.head * 2.3, g.hy - g.head * 0.5, 20);
    shape(c, () => { c.moveTo(x - g.head * 1.15, g.hy - g.head * 0.55); c.quadraticCurveTo(x - g.head * 1.45, g.hy - g.head * 0.1, x - g.head * 1.2, g.hy + g.head * 0.1); c.quadraticCurveTo(x - g.head * 0.95, g.hy - g.head * 0.1, x - g.head * 1.15, g.hy - g.head * 0.55); c.closePath(); }, COL.sky, 4);
  }
};
const adultTimer = (c: Ctx, x: number, y: number, h: number, countFingers = true) => {
  const g = geom(y, h, false, true);
  const hands = person(c, x, y, h, { adult: true, reachR: [x + g.shX - h * 0.01, g.shY + h * 0.13], ...(countFingers ? { reachL: [x - g.shX - h * 0.12, g.shY - h * 0.16] } : {}) });
  phone(c, hands.handR[0], hands.handR[1]);
};
const dancer = (c: Ctx, x: number, y: number, h: number, bg: () => void) => {
  const g = geom(y, h);
  const hands = person(c, x, y, h, { reachL: [x - g.shX - h * 0.27, g.shY - h * 0.15], reachR: [x + g.shX + h * 0.23, g.shY - h * 0.11] });
  legsTo(c, x, y, h, bg, [{ side: -1, knee: [x - h * 0.09, y - h * 0.2], foot: [x - h * 0.13, y] }, { side: 1, knee: [x + h * 0.14, y - h * 0.22], foot: [x + h * 0.24, y - h * 0.06] }], y);
  whoosh(c, hands.handL[0] - 30, hands.handL[1] - 30, -Math.PI * 0.75); whoosh(c, hands.handR[0] + 30, hands.handR[1] - 30, -Math.PI * 0.25);
  whoosh(c, x + h * 0.33, y - h * 0.08, 0.2, 2);
};
const stretcher = (c: Ctx, x: number, y: number, h: number) => {
  const g = geom(y, h);
  person(c, x, y, h, { reachL: [x - g.shX - h * 0.09, g.shY - h * 0.32], reachR: [x + g.shX + h * 0.09, g.shY - h * 0.32] });
  arrow(c, [[x - h * 0.3, g.shY - h * 0.12], [x - h * 0.3, g.shY - h * 0.3]], RED, 7); arrow(c, [[x + h * 0.3, g.shY - h * 0.12], [x + h * 0.3, g.shY - h * 0.3]], RED, 7);
};
const walker = (c: Ctx, x: number, y: number, h: number, bg: () => void) => {
  const g = geom(y, h);
  person(c, x, y, h, { reachL: [x - g.shX - h * 0.14, g.shY + h * 0.03], reachR: [x + g.shX + h * 0.14, g.shY + h * 0.14] });
  legsTo(c, x, y, h, bg, [{ side: -1, foot: [x - h * 0.075, y] }, { side: 1, knee: [x + h * 0.11, g.hip + h * 0.08], foot: [x + h * 0.125, g.hip + h * 0.27], sole: true }], y);
  whoosh(c, x + h * 0.2, g.hip + h * 0.02, -Math.PI * 0.3, 2);
};
const starJumper = (c: Ctx, x: number, y: number, h: number, bg: () => void, groundY: number) => {
  const g = geom(y, h);
  person(c, x, y, h, { reachL: [x - g.shX - h * 0.19, g.shY - h * 0.25], reachR: [x + g.shX + h * 0.19, g.shY - h * 0.25] });
  legsTo(c, x, y, h, bg, [{ side: -1, foot: [x - h * 0.23, y] }, { side: 1, foot: [x + h * 0.23, y] }]);
  shadow(c, x, groundY + 4, h * 0.2, h * 0.035);
};

// a child skipping: the rope's top arc passes behind her, the bottom arc under her feet
const skipper = (c: Ctx, x: number, y: number, h: number) => {
  const g = geom(y, h), hl: [number, number] = [x - g.shX - h * 0.2, g.shY + h * 0.16], hr: [number, number] = [x + g.shX + h * 0.2, g.shY + h * 0.16];
  const rope = (top: boolean) => { c.beginPath(); c.moveTo(hl[0], hl[1]); if (top) c.quadraticCurveTo(x, g.hy - g.head * 2.8, hr[0], hr[1]); else c.quadraticCurveTo(x, y + h * 0.14, hr[0], hr[1]); c.strokeStyle = COL.red; c.lineWidth = Math.max(5, h * 0.02); c.lineCap = "round"; c.stroke(); };
  rope(true);
  person(c, x, y, h, { reachL: hl, reachR: hr });
  rope(false);
};

// ================================================================ set-up cards
// e1 step 1: sit still on the mat, hand on the tummy; the grown-up holds the timer and counts on their fingers
const e1_0 = (c: Ctx) => { floor(c, 620); mat(c, 160, 790, 520, 140); sitter(c, 400, 900, 420); adultTimer(c, 800, 900, 640); };
// e1 step 2: dance as fast as you can, furniture pushed back
const e1_1 = (c: Ctx) => {
  const bg = () => floor(c, 620);
  bg(); sofa(c, 30, 880, 280); speaker(c, 960, 880); note(c, 900, 700); note(c, 960, 640); note(c, 1010, 720);
  dancer(c, 580, 880, 560, bg);
};
// e1 step 3: sit down at once, red-faced and puffing; the grown-up counts again
const e1_2 = (c: Ctx) => { floor(c, 620); mat(c, 160, 790, 520, 140); sitter(c, 400, 900, 420, true); adultTimer(c, 800, 900, 640); };
// e1 step 4: the results sheet: seven counts, a row of blocks for each, the longest right after dancing
const e1_3 = (c: Ctx) => {
  ground(c, FLOOR);
  shadow(c, 560, 960, 380, 24);
  shape(c, () => rrect(c, 150, 110, 780, 860, 10), COL.paper);
  line(c, [[200, 170], [520, 170]], 9, COL.greyDk); line(c, [[560, 170], [760, 170]], 9, COL.greyDk);
  line(c, [[200, 215], [880, 215]], 4, COL.grey);
  const counts = [11, 22, 17, 14, 12, 11, 11];
  counts.forEach((n, i) => {
    const y = 262 + i * 98;
    line(c, [[200, y + 20], [330, y + 20]], 8, COL.greyDk);
    write(c, String(n), 380, y, 42, INK, 6);
    const blocks = Math.ceil(n / 2);
    for (let b = 0; b < blocks; b++) shape(c, () => rrect(c, 480 + b * 34, y + 2, 30, 38, 4), i === 1 ? RED : COL.orange, 4);
  });
  // a pencil lying across the corner
  c.save(); c.translate(860, 930); c.rotate(-0.6);
  shape(c, () => rrect(c, -130, -14, 220, 28, 6), COL.yellow); shape(c, () => { c.moveTo(90, -14); c.lineTo(130, 0); c.lineTo(90, 14); c.closePath(); }, COL.wood, 5); shape(c, () => { c.moveTo(116, -5); c.lineTo(130, 0); c.lineTo(116, 5); c.closePath(); }, INK, 0);
  shape(c, () => rrect(c, -140, -14, 30, 28, 4), COL.pink, 5);
  c.restore();
};
// e2 step 1: stretch up high, slowly
const e2_0 = (c: Ctx) => { floor(c, 620); mat(c, 240, 800, 600, 140); stretcher(c, 540, 880, 560); };
// e2 step 2: walk on the spot, knees up
const e2_1 = (c: Ctx) => { const bg = () => { floor(c, 620); mat(c, 240, 800, 600, 140); }; bg(); walker(c, 540, 880, 560, bg); };
// e2 step 3: star jumps while the grown-up times a minute
const e2_2 = (c: Ctx) => {
  const bg = () => { floor(c, 620); mat(c, 120, 800, 600, 140); };
  bg(); starJumper(c, 400, 790, 460, bg, 880); adultTimer(c, 850, 900, 620, false);
};

// ================================================================ card pictures
// flow.e1: the grown-up starts the timer and the child dances as fast as she can
const flowE1 = (c: Ctx) => {
  const bg = () => floor(c, 620);
  bg(); speaker(c, 1000, 880); note(c, 940, 700); note(c, 1000, 650);
  adultTimer(c, 230, 900, 640, false); dancer(c, 680, 880, 540, bg);
  puff(c, 560, 330, 24); puff(c, 610, 270, 18);
};
// flow.e2: the three moves side by side: more work, more puffing
const flowE2 = (c: Ctx) => {
  const bg = () => { floor(c, 560); mat(c, 60, 820, 960, 130); };
  bg();
  stretcher(c, 200, 890, 340); walker(c, 540, 890, 340, bg); starJumper(c, 860, 830, 340, bg, 890);
  puff(c, 200, 420, 18);
  puff(c, 510, 420, 20); puff(c, 580, 380, 20);
  puff(c, 800, 360, 24); puff(c, 880, 320, 24); puff(c, 930, 400, 20); puff(c, 820, 290, 18);
};
// small drawings for the bedtime cards: a plate, a bucket bath, a toothbrush, a book, a lamp off, a fan
const cardIcon = (c: Ctx, k: number, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (k === 0) { shape(c, () => ell(c, 0, 0, 40, 20), COL.steel, 4); shape(c, () => ell(c, 0, -6, 22, 10), COL.cloth, 3); }
  if (k === 1) { shape(c, () => { c.moveTo(-30, -24); c.lineTo(30, -24); c.lineTo(24, 30); c.lineTo(-24, 30); c.closePath(); }, COL.blue, 4); shape(c, () => ell(c, 0, -24, 30, 7), COL.water, 3); shape(c, () => rrect(c, 24, -44, 22, 16, 4), COL.teal, 3); }
  if (k === 2) { shape(c, () => rrect(c, -36, -8, 72, 14, 7), COL.teal, 4); for (let i = 0; i < 4; i++) shape(c, () => rrect(c, 12 + i * 7, -22, 5, 16, 2), WHITE, 2); }
  if (k === 3) { shape(c, () => rrect(c, -36, -24, 72, 48, 4), COL.red, 4); line(c, [[0, -24], [0, 24]], 3, INK); line(c, [[-28, -12], [-8, -12]], 3, COL.paper); line(c, [[-28, 0], [-8, 0]], 3, COL.paper); }
  if (k === 4) { shape(c, () => ell(c, 0, -10, 22, 24), COL.grey, 4); shape(c, () => rrect(c, -10, 12, 20, 14, 3), COL.greyDk, 3); line(c, [[-34, -34], [34, 24]], 5, RED); }
  if (k === 5) { for (let i = 0; i < 3; i++) shape(c, () => ell(c, Math.cos(i * 2.1) * 20, Math.sin(i * 2.1) * 20, 22, 11, i * 2.1), COL.sky, 4); shape(c, () => ell(c, 0, 0, 9, 9), COL.greyDk, 3); }
  c.restore();
};
// flow.a2: the child draws a bedtime step on a card; the others lie in a row on the floor
const flowA2 = (c: Ctx) => {
  floor(c, 480);
  const x = 540, y = 730, h = 470, g = geom(y, h, true);
  const hands = person(c, x, y, h, { sit: true, dir: 1, reachL: [x - g.shX - h * 0.03, g.shY + h * 0.11], reachR: [x + g.shX + h * 0.03, g.shY + h * 0.12] });
  // the card held in the left hand, the crayon in the right pointing at it
  const [lx, ly] = hands.handL, [rx, ry] = hands.handR;
  shape(c, () => rrect(c, lx - 10, ly - 60, 130, 95, 6), COL.paper, 5);
  shape(c, () => rrect(c, lx + 20, ly - 32, 70, 36, 6), COL.purple, 4); shape(c, () => rrect(c, lx + 20, ly - 44, 24, 18, 5), COL.pink, 3);
  c.save(); c.translate(rx, ry); c.rotate(Math.atan2(ly - 30 - ry, lx + 90 - rx));
  shape(c, () => rrect(c, -10, -9, 80, 18, 5), COL.green, 4); shape(c, () => { c.moveTo(70, -9); c.lineTo(88, 0); c.lineTo(70, 9); c.closePath(); }, COL.green, 4);
  c.restore();
  for (let k = 0; k < 6; k++) {
    const cx = 70 + k * 162;
    shadow(c, cx + 75, 905, 62, 10);
    shape(c, () => rrect(c, cx, 790, 130, 110, 8), COL.paper, 5);
    cardIcon(c, k, cx + 65, 845, 0.9);
  }
};
// flow.a3: the four-box day chart: move, rest and sleep, eat, keep clean
const flowA3 = (c: Ctx) => {
  ground(c, FLOOR);
  shadow(c, 560, 960, 400, 24);
  shape(c, () => rrect(c, 140, 110, 800, 820, 10), COL.paper);
  c.setLineDash([18, 14]); line(c, [[540, 110], [540, 930]], 4, COL.greyDk); line(c, [[140, 520], [940, 520]], 4, COL.greyDk); c.setLineDash([]);
  const head = (x: number, y: number) => { line(c, [[x, y], [x + 150, y]], 9, COL.greyDk); line(c, [[x + 170, y], [x + 230, y]], 9, COL.greyDk); };
  head(190, 160); head(590, 160); head(190, 570); head(590, 570);
  // move: a child skipping with a rope
  skipper(c, 340, 460, 230);
  // rest and sleep: a bed
  shape(c, () => rrect(c, 600, 330, 300, 110, 10), COL.wood); shape(c, () => rrect(c, 600, 220, 60, 120, 8), COL.woodDk, 5); shape(c, () => rrect(c, 850, 260, 50, 80, 8), COL.woodDk, 5);
  shape(c, () => rrect(c, 660, 300, 190, 50, 10), COL.sky, 5); shape(c, () => rrect(c, 665, 270, 70, 40, 10), WHITE, 5);
  line(c, [[610, 440], [610, 480]], 8, INK); line(c, [[890, 440], [890, 480]], 8, INK);
  // eat: a plate of rice and a katori of sambar
  plate(c, 330, 780, 150, 70); shape(c, () => ell(c, 300, 770, 70, 32), WHITE, 4); bowl(c, 410, 760, 42, COL.orange);
  // keep clean: a bucket and a mug
  shape(c, () => { c.moveTo(640, 680); c.lineTo(820, 680); c.lineTo(800, 860); c.lineTo(660, 860); c.closePath(); }, COL.blue); shade(c, () => { c.moveTo(640, 680); c.lineTo(820, 680); c.lineTo(800, 860); c.lineTo(660, 860); c.closePath(); }, COL.blueDk, 60, 0);
  shape(c, () => ell(c, 730, 680, 90, 22), COL.water, 5);
  c.beginPath(); c.arc(730, 672, 84, Math.PI * 1.1, Math.PI * 1.9); c.strokeStyle = INK; c.lineWidth = 8; c.stroke();
  shape(c, () => rrect(c, 840, 790, 60, 60, 6), COL.teal, 5); line(c, [[900, 800], [920, 790], [920, 840]], 6, INK);
  // crayons at the bottom edge
  [COL.red, COL.green, COL.blue].forEach((col, i) => shape(c, () => rrect(c, 580 + i * 90, 880, 70, 22, 6), col, 4));
};
// term.0: exercise: skipping, dancing, climbing stairs
const term0 = (c: Ctx) => {
  const bg = () => floor(c, 560);
  bg();
  // the skipper, a little off the ground, the rope under her feet
  shadow(c, 190, 884, 70, 12); skipper(c, 190, 840, 340);
  dancer(c, 520, 880, 340, bg);
  // the stairs rising to the right, a child standing on the second step
  const steps = () => { c.moveTo(720, 880); c.lineTo(720, 810); c.lineTo(830, 810); c.lineTo(830, 740); c.lineTo(940, 740); c.lineTo(940, 670); c.lineTo(1080, 670); c.lineTo(1080, 880); c.closePath(); };
  shape(c, steps, COL.steel); shade(c, steps, COL.steelDk, 0, 36);
  person(c, 885, 740, 320, { armR: [Math.PI * 0.4, Math.PI * 0.35] });
};
// term.1: a bent arm with the muscle bulging on top
const term1 = (c: Ctx) => {
  floor(c, 640);
  const x = 500, y = 940, h = 640, g = geom(y, h);
  const sx = x + g.shX, sy = g.shY, tx = x + g.shX + h * 0.17, ty = g.shY - h * 0.17;
  person(c, x, y, h, { reachR: [tx, ty] });
  // the elbow of that arm, worked out the way person() does it
  const l1 = h * 0.17, l2 = h * 0.155, d = Math.hypot(tx - sx, ty - sy), a = Math.atan2(ty - sy, tx - sx), th = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)), ea = a + th;
  const ex = sx + Math.cos(ea) * l1, ey = sy + Math.sin(ea) * l1, mx = (sx + ex) / 2, my = (sy + ey) / 2, nx = Math.sin(ea), ny = -Math.cos(ea);
  const bump = () => ell(c, mx + nx * 12, my + ny * 12, l1 * 0.44, l1 * 0.34, ea);
  shape(c, bump, CLOTH.child, 5); shade(c, bump, CLOTH.childDk, 10, 10);
  // the arm drawn back over the bump's lower half, so the bump grows out of the arm
  line(c, [[sx, sy], [ex, ey]], h * 0.062, CLOTH.child);
  // three short strength marks above the bump
  for (const k of [-1, 0, 1]) { const a = ea - Math.PI / 2 + k * 0.45, bx = mx + nx * 12, by = my + ny * 12; line(c, [[bx + Math.cos(a) * 50, by + Math.sin(a) * 50], [bx + Math.cos(a) * 78, by + Math.sin(a) * 78]], 6, RED); }
};
// term.6: rest: two children sitting in the shade on a step, drinking water from steel tumblers
const tumbler = (c: Ctx, x: number, y: number, tilt: number) => {
  c.save(); c.translate(x, y); c.rotate(tilt);
  shape(c, () => { c.moveTo(-30, -44); c.lineTo(30, -44); c.lineTo(24, 40); c.lineTo(-24, 40); c.closePath(); }, COL.steel);
  shade(c, () => { c.moveTo(-30, -44); c.lineTo(30, -44); c.lineTo(24, 40); c.lineTo(-24, 40); c.closePath(); }, COL.steelDk, 18, 0);
  shape(c, () => ell(c, 0, -44, 30, 8), COL.water, 4);
  c.restore();
};
const term6 = (c: Ctx) => {
  ground(c, WALL);
  // the step they sit on, and the riser below
  c.fillStyle = COL.steel; c.fillRect(0, 640, D, 440); line(c, [[0, 640], [D, 640]], 5, INK);
  c.fillStyle = COL.steelDk; c.fillRect(0, 930, D, 150); line(c, [[0, 930], [D, 930]], 5, INK);
  // the shade: a tree's leaves across the top and its trunk at the edge
  shape(c, () => rrect(c, 980, 0, 100, 700, 20), COL.brown);
  for (const [bx, by, br] of [[120, 40, 150], [360, 10, 170], [620, 40, 160], [880, 0, 170]]) shape(c, () => ell(c, bx, by, br, br * 0.8), COL.green, 6);
  for (const [bx, by, br] of [[120, 40, 150], [360, 10, 170], [620, 40, 160], [880, 0, 170]]) shape(c, () => ell(c, bx, by, br, br * 0.8), COL.green, 0);
  c.fillStyle = "rgba(43,35,64,0.1)"; c.fillRect(0, 0, D, 640);
  for (const [x, dir] of [[320, 1], [760, -1]] as [number, 1 | -1][]) {
    const y = 890, h = 400, g = geom(y, h, true);
    const hd = person(c, x, y, h, { sit: true, dir, reachR: [x + g.shX - h * 0.03, g.shY - h * 0.1] });
    tumbler(c, hd.handR[0] + 4, hd.handR[1] - 10, -0.35);
  }
};
// term.7: asleep on a mat under a light sheet; a clock on the wall, the Moon in the window
const term7 = (c: Ctx) => {
  ground(c, "#7d8bb0"); c.fillStyle = "#b9a888"; c.fillRect(0, 640, D, 440); line(c, [[0, 640], [D, 640]], 5, INK);
  // the window with the night sky
  shape(c, () => rrect(c, 620, 110, 340, 300, 8), "#1d2446"); shape(c, () => ell(c, 790, 230, 60, 60), COL.yellow, 5);
  shape(c, () => ell(c, 812, 218, 48, 48), "#1d2446", 0);
  for (const [sx, sy] of [[670, 160], [720, 330], [900, 150], [920, 360]]) shape(c, () => ell(c, sx, sy, 7, 7), WHITE, 0);
  line(c, [[620, 260], [960, 260]], 6, INK); line(c, [[790, 110], [790, 410]], 6, INK);
  c.lineWidth = 10; c.strokeStyle = INK; c.beginPath(); rrect(c, 620, 110, 340, 300, 8); c.stroke();
  // the clock at nine
  shape(c, () => ell(c, 250, 250, 95, 95), COL.paper, 7);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[250 + Math.cos(a) * 76, 250 + Math.sin(a) * 76], [250 + Math.cos(a) * 86, 250 + Math.sin(a) * 86]], i % 3 ? 3 : 6, INK); }
  line(c, [[250, 250], [250, 190]], 8, INK); line(c, [[250, 250], [200, 250]], 8, INK); shape(c, () => ell(c, 250, 250, 7, 7), INK, 0);
  // the mat, the pillow, the child under the sheet
  mat(c, 100, 740, 900, 200);
  shape(c, () => rrect(c, 150, 770, 220, 110, 24), WHITE, 5);
  const hx = 270, hy = 810, r = 62;
  shape(c, () => rrect(c, 380, 760, 560, 150, 30), COL.sky); shade(c, () => rrect(c, 380, 760, 560, 150, 30), "#9fcbe6", 0, 70);
  line(c, [[760, 790], [820, 900]], 4, "#9fcbe6"); line(c, [[600, 780], [640, 905]], 4, "#9fcbe6");
  shape(c, () => rrect(c, hx + 40, hy - 35, 90, 80, 20), SKIN.child, 5);
  shape(c, () => ell(c, hx, hy, r, r * 1.05), SKIN.child);
  shape(c, () => { c.moveTo(hx - r * 1.04, hy + r * 0.05); c.bezierCurveTo(hx - r * 1.1, hy - r * 1.6, hx + r * 1.1, hy - r * 1.6, hx + r * 1.04, hy + r * 0.05); c.quadraticCurveTo(hx + r * 0.5, hy - r * 0.5, hx - r * 0.2, hy - r * 0.52); c.quadraticCurveTo(hx - r * 0.8, hy - r * 0.4, hx - r * 1.04, hy + r * 0.05); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, hx - r * 0.97, hy + r * 0.12, r * 0.2, r * 0.26), SKIN.child, 4);
  for (const s of [-1, 1]) { c.beginPath(); c.arc(hx + s * r * 0.38, hy + r * 0.1, r * 0.16, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
  c.beginPath(); c.arc(hx, hy + r * 0.46, r * 0.22, 0.3, Math.PI - 0.3); c.stroke();
  for (const [sx, sy] of [[420, 690], [470, 650], [530, 700]]) shape(c, () => ell(c, sx, sy, 6, 6), COL.yellow, 3);
};
// expl.0: sitting still with small slow breaths, dancing with big fast ones
const expl0 = (c: Ctx) => {
  const bg = () => floor(c, 600);
  bg(); line(c, [[540, 60], [540, 1020]], 5, COL.greyDk);
  const x = 270, y = 860, h = 380, g = geom(y, h, true);
  person(c, x, y, h, { sit: true, dir: 1, reachR: [x + h * 0.04, g.hip - h * 0.07] });
  puff(c, x + g.head * 1.6, g.hy + g.head * 0.2, 14); puff(c, x + g.head * 2.2, g.hy - g.head * 0.3, 12);
  dancer(c, 790, 880, 460, bg);
  blush(c, 790, 880, 460);
  puff(c, 905, 400, 30); puff(c, 980, 330, 28); puff(c, 1000, 450, 24); puff(c, 930, 280, 22);
};
// expl.2: hopping across a chalk hopscotch grid; a strong heart, a bone and a smile around
const expl2 = (c: Ctx) => {
  const bg = () => {
    ground(c, FLOOR);
    const sq = (x: number, y: number, n: number) => { c.strokeStyle = WHITE; c.lineWidth = 8; c.lineJoin = "round"; c.strokeRect(x, y, 150, 140); write(c, String(n), x + 50, y + 42, 56, WHITE, 8); };
    const rows: number[][] = [[1], [2, 3], [4], [5, 6], [7], [8]];
    rows.forEach((r, i) => { const y = 880 - i * 150; r.forEach((n, j) => sq(540 - 75 - (r.length - 1) * 80 + j * 160, y, n)); });
  };
  bg();
  const x = 540, y = 700, h = 400, g = geom(y, h);
  shadow(c, x, 744, 70, 14);
  person(c, x, y, h, { reachL: [x - g.shX - h * 0.26, g.shY - h * 0.06], reachR: [x + g.shX + h * 0.26, g.shY - h * 0.06] });
  legsTo(c, x, y, h, bg, [{ side: -1, foot: [x - h * 0.07, y] }, { side: 1, knee: [x + h * 0.13, g.hip + h * 0.2], foot: [x + h * 0.2, g.hip + h * 0.06], sole: true }]);
  // a heart, a bone and a smile in little circles
  const badge = (bx: number, by: number, draw: () => void) => { shape(c, () => ell(c, bx, by, 80, 80), WHITE, 6); c.save(); c.translate(bx, by); draw(); c.restore(); };
  badge(150, 180, () => { shape(c, () => { c.moveTo(0, 40); c.bezierCurveTo(-60, -5, -40, -50, 0, -22); c.bezierCurveTo(40, -50, 60, -5, 0, 40); c.closePath(); }, COL.red, 5); });
  badge(930, 180, () => { shape(c, () => rrect(c, -44, -12, 88, 24, 10), COL.paper, 5); for (const s of [-1, 1]) for (const t of [-1, 1]) shape(c, () => ell(c, s * 44, t * 12, 14, 14), COL.paper, 5); });
  badge(150, 420, () => { shape(c, () => ell(c, 0, 0, 40, 40), COL.yellow, 5); for (const s of [-1, 1]) shape(c, () => ell(c, s * 14, -8, 5, 7), INK, 0); c.beginPath(); c.arc(0, 4, 22, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); });
};

export const ic_healthExerciseAndRestL2 = cards("sci.health.exercise-and-rest.L2", [
  e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2,
  flowE1, flowE2, flowA2, flowA3, term0, term1, term6, term7, expl0, expl2,
]);
