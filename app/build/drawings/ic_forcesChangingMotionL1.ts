import type { Ctx } from "./core";
import { D, INK, BG, RED, WHITE, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards } from "./flatKit";
import type { Pose } from "./flatKit";

// START, STOP, FASTER, SLOWER (L1) · flat set-up and card pictures. Convention on every card:
// a red arrow is the push, an ink arrow is the way the thing is moving.

// ---------------------------------------------------------------- helpers
const TILE = "#ebe6dc", TILE_LINE = "#cfc7b8", WALL = BG;
const floor = (c: Ctx, y0 = 560, size = 135) => {
  ground(c, WALL);
  c.fillStyle = TILE; c.fillRect(0, y0, D, D - y0);
  c.strokeStyle = TILE_LINE; c.lineWidth = 4;
  for (let x = size; x < D; x += size) { c.beginPath(); c.moveTo(x, y0); c.lineTo(x, D); c.stroke(); }
  for (let y = y0 + size; y < D; y += size) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
  line(c, [[0, y0], [D, y0]], 6);
};
const tilesAll = (c: Ctx, size = 270) => { c.fillStyle = TILE; c.fillRect(0, 0, D, D); c.strokeStyle = TILE_LINE; c.lineWidth = 6; for (let x = size; x < D; x += size) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, D); c.stroke(); } for (let y = size; y < D; y += size) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); } };
const ball = (c: Ctx, x: number, y: number, r: number, col = COL.red, dk = "#b33a28") => {
  shadow(c, x + r * 0.15, y + r * 0.95, r * 0.95, r * 0.22);
  shape(c, () => ell(c, x, y, r, r), col);
  shade(c, () => ell(c, x, y, r, r), dk, -r * 0.32, -r * 0.28);
  shine(c, [[x - r * 0.55, y - r * 0.45], [x - r * 0.3, y - r * 0.65]], r * 0.1);
};
// a rolled-up newspaper, from (x1,y1) to (x2,y2): grey roll with a yellow tape band
const tapper = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w = 40) => {
  line(c, [[x1, y1], [x2, y2]], w + 10, INK); line(c, [[x1, y1], [x2, y2]], w, COL.grey);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, an = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(an), ny = Math.cos(an);
  line(c, [[mx - nx * w * 0.5, my - ny * w * 0.5], [mx + nx * w * 0.5, my + ny * w * 0.5]], 14, COL.yellow);
  line(c, [[x1 + (x2 - x1) * 0.1, y1 + (y2 - y1) * 0.1 - 0], [x1 + (x2 - x1) * 0.9, y1 + (y2 - y1) * 0.9]], 2, WHITE);
};
// a plastic bottle cap seen from a little above, centre (x, y)
const cap = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.2, y + r * 0.7, r * 1.05, r * 0.3);
  shape(c, () => { c.moveTo(x - r, y); c.lineTo(x - r, y + r * 0.45); c.quadraticCurveTo(x, y + r * 1.1, x + r, y + r * 0.45); c.lineTo(x + r, y); c.closePath(); }, COL.blueDk, 5);
  shape(c, () => ell(c, x, y, r, r * 0.6), COL.blue, 5);
  shape(c, () => ell(c, x, y, r * 0.72, r * 0.42), COL.sky, 4);
  for (let i = -3; i <= 3; i++) line(c, [[x + i * r * 0.26, y + r * 0.55 - Math.abs(i) * r * 0.04], [x + i * r * 0.26, y + r * 0.95 - Math.abs(i) * r * 0.08]], 3, COL.blueDk);
};
const motion = (c: Ctx, x: number, y: number, len: number, gap = 26) => { for (let k = -1; k <= 1; k++) line(c, [[x - len, y + k * gap], [x, y + k * gap]], 6, COL.greyDk); };
// where a person's hand lands, by the same arithmetic as flatKit.person
const wrist = (x: number, y: number, h: number, p: Pose, side: -1 | 1): [number, number] => {
  const sh = p.sit ? y - h * 0.06 - h * 0.32 : y - h * 0.74, a = (side < 0 ? p.armL : p.armR) ?? [Math.PI * 0.5, Math.PI * 0.5];
  const sx = x + side * h * 0.11, sy = sh + h * 0.03, ex = sx + Math.cos(a[0]) * h * 0.17, ey = sy + Math.sin(a[0]) * h * 0.17;
  return [ex + Math.cos(a[1]) * h * 0.16, ey + Math.sin(a[1]) * h * 0.16];
};
const tape = (c: Ctx, x: number, y0: number, y1: number, w = 44) => { shape(c, () => rrect(c, x - w / 2, y0, w, y1 - y0, 8), COL.yellow, 5); };

// ================================================================ set-up cards
// setup.e1.0: a corridor; the grown-up sits at one end with the ball, the girl kneels halfway with the tapper
const se1_0 = (c: Ctx) => {
  floor(c, 520);
  const ad: Pose = { sit: true, adult: true, armR: [Math.PI * 0.3, Math.PI * 0.45], armL: [Math.PI * 0.6, Math.PI * 0.45] };
  person(c, 170, 900, 440, ad);
  ball(c, 380, 850, 72);
  const kid: Pose = { sit: true, armR: [-Math.PI * 0.25, -Math.PI * 0.4], armL: [Math.PI * 0.55, Math.PI * 0.5] };
  person(c, 720, 900, 400, kid);
  const [wx, wy] = wrist(720, 900, 400, kid, 1);
  tapper(c, wx + 40, wy + 60, wx - 40, wy - 110);
  arrow(c, [[470, 760], [600, 760]], INK, 9);
};
// setup.e1.1: the girl walks beside the rolling ball and taps it from behind; the ball shoots ahead
const se1_1 = (c: Ctx) => {
  floor(c, 560);
  const kid: Pose = { armR: [Math.PI * 0.2, Math.PI * 0.3], armL: [Math.PI * 0.6, Math.PI * 0.5] };
  person(c, 300, 950, 560, kid);
  const [wx, wy] = wrist(300, 950, 560, kid, 1);
  const bx = 660, by = 820, r = 110;
  motion(c, bx - r - 30, by, 90);
  ball(c, bx, by, r);
  const an = Math.atan2(by - wy, bx - wx);
  tapper(c, wx, wy, bx - Math.cos(an) * (r + 4), by - Math.sin(an) * (r + 4));
  arrow(c, [[wx - 150, wy - 70], [wx - 20, wy - 70]], RED, 10);
  arrow(c, [[bx + r + 40, by - 20], [bx + r + 300, by - 20]], INK, 10);
};
// setup.e1.2: the ball rolls towards the girl, who kneels in front and taps it from the front; it slows
const se1_2 = (c: Ctx) => {
  floor(c, 560);
  const bx = 400, by = 820, r = 110;
  motion(c, bx - r - 30, by, 110);
  arrow(c, [[150, 620], [330, 620]], INK, 10);
  ball(c, bx, by, r);
  const kid: Pose = { sit: true, armL: [Math.PI * 0.92, Math.PI * 1.02], armR: [Math.PI * 0.55, Math.PI * 0.5] };
  person(c, 820, 950, 420, kid);
  const [wx, wy] = wrist(820, 950, 420, kid, -1);
  const an = Math.atan2(by - wy, bx - wx);
  tapper(c, wx, wy, bx - Math.cos(an) * (r + 4), by - Math.sin(an) * (r + 4));
  arrow(c, [[wx + 20, wy - 90], [wx - 110, wy - 90]], RED, 10);
};
// setup.e2.0: the cap on the start line, a finger curled ready to flick it
const se2_0 = (c: Ctx) => {
  tilesAll(c);
  tape(c, 440, 150, 930, 48);
  cap(c, 560, 560, 70);
  hand(c, 250, 560, 0, 1.6);
};
// setup.e2.1: the cap slides over the tiles; the girl counts the tiles with her finger
const se2_1 = (c: Ctx) => {
  tilesAll(c, 180);
  tape(c, 110, 120, 980, 40);
  for (let i = 0; i < 5; i++) write(c, String(i + 1), 160 + i * 180, 300, 70, COL.greyDk, 8);
  motion(c, 540, 560, 260, 30);
  arrow(c, [[200, 450], [560, 450]], INK, 9);
  cap(c, 640, 560, 60);
  const kid: Pose = { sit: true, armL: [Math.PI * 0.8, Math.PI * 0.72], armR: [Math.PI * 0.6, Math.PI * 0.5] };
  person(c, 860, 980, 420, kid);
  const [wx, wy] = wrist(860, 980, 420, kid, -1);
  line(c, [[wx, wy], [wx - 48, wy + 30]], 14, INK); line(c, [[wx, wy], [wx - 48, wy + 30]], 8, SKIN.child);
};

// ================================================================ card pictures
// flow.e1: the Tap Test, the grown-up rolls, the girl waits with the tapper
const fe1 = (c: Ctx) => {
  floor(c, 540);
  const ad: Pose = { sit: true, adult: true, armR: [Math.PI * 0.25, Math.PI * 0.1], armL: [Math.PI * 0.6, Math.PI * 0.45] };
  person(c, 150, 920, 460, ad);
  const [ax, ay] = wrist(150, 920, 460, ad, 1);
  arrow(c, [[ax + 20, ay - 40], [ax + 130, ay - 40]], RED, 9);
  motion(c, 470, 830, 60, 22);
  ball(c, 560, 830, 90);
  arrow(c, [[680, 700], [840, 700]], INK, 10);
  const kid: Pose = { sit: true, armL: [Math.PI * 0.75, Math.PI * 1.2], armR: [Math.PI * 0.55, Math.PI * 0.5] };
  person(c, 860, 940, 400, kid);
  const [wx, wy] = wrist(860, 940, 400, kid, -1);
  tapper(c, wx + 30, wy + 70, wx - 30, wy - 110);
};
// flow.e2: the Flick Test, a hard flick sends the cap far along the tiles
const fe2 = (c: Ctx) => {
  tilesAll(c, 180);
  tape(c, 200, 120, 980, 40);
  hand(c, 150, 560, 0, 1.3);
  arrow(c, [[150, 430], [270, 430]], RED, 10);
  motion(c, 820, 560, 420, 30);
  arrow(c, [[330, 680], [860, 680]], INK, 10);
  cap(c, 900, 560, 64);
};
// flow.a1: the ceiling fan turning, the boy on a mat to one side looking up
const fa1 = (c: Ctx) => {
  ground(c, WALL);
  c.fillStyle = TILE; c.fillRect(0, 760, D, D - 760); line(c, [[0, 760], [D, 760]], 6);
  const fx = 560, fy = 330;
  line(c, [[fx, 0], [fx, fy - 60]], 22, INK); line(c, [[fx, 0], [fx, fy - 60]], 12, COL.steel);
  // blur: faint blades at other angles, then the three blades
  const blade = (an: number, alpha: number) => { c.save(); c.translate(fx, fy); c.rotate(an); c.globalAlpha = alpha; shape(c, () => rrect(c, 60, -34, 330, 68, 30), COL.brown, alpha < 1 ? 0 : 6); c.restore(); c.globalAlpha = 1; };
  for (let k = 0; k < 3; k++) { blade(k * Math.PI * 2 / 3 + 0.5, 0.18); blade(k * Math.PI * 2 / 3 + 0.3, 0.3); }
  for (let k = 0; k < 3; k++) blade(k * Math.PI * 2 / 3, 1);
  shape(c, () => ell(c, fx, fy, 70, 60), COL.steel); shade(c, () => ell(c, fx, fy, 70, 60), COL.steelDk, -24, -20);
  shape(c, () => ell(c, fx, fy - 70, 40, 18), COL.steelDk, 5);
  c.beginPath(); c.arc(fx, fy, 430, Math.PI * 1.05, Math.PI * 1.38); c.strokeStyle = INK; c.lineWidth = 10; c.lineCap = "round"; c.stroke();
  arrow(c, [[fx + Math.cos(Math.PI * 1.38) * 430, fy + Math.sin(Math.PI * 1.38) * 430], [fx + Math.cos(Math.PI * 1.42) * 430, fy + Math.sin(Math.PI * 1.42) * 430]], INK, 10);
  c.beginPath(); c.arc(fx, fy, 430, -Math.PI * 0.38, -Math.PI * 0.05); c.stroke();
  arrow(c, [[fx + Math.cos(-Math.PI * 0.05) * 430, fy + Math.sin(-Math.PI * 0.05) * 430], [fx + Math.cos(-Math.PI * 0.01) * 430, fy + Math.sin(-Math.PI * 0.01) * 430]], INK, 10);
  shape(c, () => rrect(c, 60, 900, 420, 70, 20), COL.teal); shade(c, () => rrect(c, 60, 900, 420, 70, 20), COL.tealDk, 0, 30);
  person(c, 180, 910, 380, { sit: true, armL: [-Math.PI * 0.65, -Math.PI * 0.55], armR: [Math.PI * 0.4, Math.PI * 0.5] });
};
// flow.a2: the window watch, a bus stopping at a stop, an auto and a scooter on the road
const fa2 = (c: Ctx) => {
  ground(c, "#d9c9a8");
  shape(c, () => rrect(c, 90, 60, 900, 760, 20), COL.sky, 8);
  c.save(); c.beginPath(); rrect(c, 90, 60, 900, 760, 20); c.clip();
  c.fillStyle = COL.greenLt; c.fillRect(90, 420, 900, 90);
  c.fillStyle = COL.greyDk; c.fillRect(90, 500, 900, 320); c.fillStyle = COL.grey; for (let x = 100; x < 1000; x += 120) c.fillRect(x, 655, 70, 10);
  // the bus stop pole and sign
  line(c, [[880, 330], [880, 505]], 10, INK); shape(c, () => rrect(c, 840, 290, 80, 50, 8), COL.yellow, 5);
  // the bus
  shadow(c, 560, 640, 300, 24);
  shape(c, () => rrect(c, 260, 400, 560, 220, 24), COL.orange); shade(c, () => rrect(c, 260, 400, 560, 220, 24), "#d27c25", 0, 150);
  for (let k = 0; k < 5; k++) shape(c, () => rrect(c, 290 + k * 105, 425, 80, 70, 8), COL.sky, 5);
  for (const x of [360, 720]) { shape(c, () => ell(c, x, 620, 46, 46), COL.black); shape(c, () => ell(c, x, 620, 18, 18), COL.grey, 4); }
  arrow(c, [[300, 690], [180, 690]], RED, 9);
  // the auto, small, further off
  shape(c, () => polyP(c, [[600, 330], [700, 300], [760, 330], [760, 400], [600, 400]]), COL.green);
  c.fillStyle = COL.yellow; c.fillRect(600, 385, 160, 15);
  for (const x of [630, 735]) shape(c, () => ell(c, x, 405, 14, 14), COL.black, 4);
  arrow(c, [[720, 268], [800, 268]], INK, 7);
  c.restore();
  line(c, [[540, 60], [540, 820]], 14, INK); line(c, [[90, 440], [990, 440]], 14, INK);
  shape(c, () => rrect(c, 60, 820, 960, 40, 8), COL.wood, 6);
  person(c, 300, 1070, 300, { armR: [-Math.PI * 0.4, -Math.PI * 0.3] });
  person(c, 780, 1070, 380, { adult: true, armL: [-Math.PI * 0.6, -Math.PI * 0.65] });
};
// flow.a3: three stoppers in a row, a pillow, a standing book, a paper tent; the ball rolls at them
const fa3 = (c: Ctx) => {
  floor(c, 500);
  // pillow, upright
  shadow(c, 300, 905, 130, 24);
  shape(c, () => rrect(c, 200, 600, 190, 290, 50), COL.cloth); shade(c, () => rrect(c, 200, 600, 190, 290, 50), "#ddd3c0", 40, 0);
  // book standing open like a wall
  shadow(c, 590, 905, 160, 22);
  shape(c, () => polyP(c, [[470, 890], [530, 600], [590, 640], [590, 890]]), COL.purple);
  shape(c, () => polyP(c, [[590, 890], [590, 640], [650, 600], [710, 890]]), COL.purple);
  shape(c, () => polyP(c, [[480, 880], [535, 620], [585, 650], [585, 880]]), COL.paper, 4);
  shape(c, () => polyP(c, [[595, 880], [595, 650], [645, 620], [700, 880]]), COL.paper, 4);
  // paper tent, small
  shadow(c, 880, 905, 110, 18);
  shape(c, () => polyP(c, [[790, 890], [870, 740], [950, 890]]), COL.paper);
  shape(c, () => polyP(c, [[870, 740], [950, 890], [980, 870]]), "#e8e0cc");
  // the ball, rolling at them
  motion(c, 70, 820, 50, 22);
  ball(c, 150, 820, 70);
  arrow(c, [[160, 690], [340, 690]], INK, 10);
};
// flow.p1: the little tied book, open at a crayon bus stopping with a red arrow at its front wheels
const fp1 = (c: Ctx) => {
  ground(c, "#d9c9a8");
  shadow(c, 560, 870, 440, 40);
  shape(c, () => polyP(c, [[110, 260], [540, 300], [540, 860], [110, 820]]), COL.paper);
  shape(c, () => polyP(c, [[540, 300], [970, 260], [970, 820], [540, 860]]), COL.paper);
  shade(c, () => polyP(c, [[110, 260], [540, 300], [540, 860], [110, 820]]), "#e5dcc6", -60, 0, 0.5);
  for (const y of [380, 580, 760]) { line(c, [[525, y - 10], [555, y + 10]], 5, COL.red); line(c, [[555, y - 10], [525, y + 10]], 5, COL.red); }
  // the crayon bus on the right page
  c.save(); c.translate(590, 400); c.scale(0.68, 0.68);
  shape(c, () => rrect(c, 40, 60, 440, 220, 24), COL.yellow, 7);
  for (let k = 0; k < 4; k++) shape(c, () => rrect(c, 70 + k * 100, 90, 70, 70, 8), COL.sky, 5);
  for (const x of [130, 400]) shape(c, () => ell(c, x, 290, 44, 44), COL.black, 7);
  line(c, [[0, 340], [520, 340]], 7, COL.green);
  c.restore();
  arrow(c, [[905, 650], [790, 650]], RED, 10);
  // a hand and a still ball on the left page
  ball(c, 330, 560, 60);
  hand(c, 160, 560, 0, 0.8);
  // crayons beside the book
  for (const [x, col] of [[1000, COL.red], [1030, COL.green]] as [number, string][]) { shape(c, () => rrect(c, x, 560, 22, 300, 8), col, 5); shape(c, () => polyP(c, [[x, 560], [x + 11, 520], [x + 22, 560]]), col, 5); }
};
// term.1: a cheetah racing and a snail crawling, side by side
const t1 = (c: Ctx) => {
  ground(c, WALL);
  c.fillStyle = COL.greenLt; c.fillRect(0, 700, D, D - 700); line(c, [[0, 700], [D, 700]], 6);
  // cheetah: body, legs stretched, tail, head with tear lines
  const cx = 330, cy = 560;
  shadow(c, cx + 20, 700, 300, 26);
  line(c, [[cx - 240, cy - 40], [cx - 330, cy - 120], [cx - 380, cy - 90]], 26, INK); line(c, [[cx - 240, cy - 40], [cx - 330, cy - 120], [cx - 380, cy - 90]], 16, COL.yellow);
  for (const [x1, x2, y2] of [[cx - 180, cx - 290, cy + 120], [cx - 150, cx - 160, cy + 130], [cx + 150, cx + 300, cy + 110], [cx + 180, cx + 230, cy + 130]]) { line(c, [[x1, cy + 20], [x2, y2]], 42, INK); line(c, [[x1, cy + 20], [x2, y2]], 30, COL.yellow); }
  shape(c, () => ell(c, cx, cy, 250, 95), COL.yellow);
  shade(c, () => ell(c, cx, cy, 250, 95), COL.orange, -40, -40, 0.4);
  shape(c, () => ell(c, cx + 270, cy - 70, 80, 70), COL.yellow);
  shape(c, () => ell(c, cx + 320, cy - 50, 40, 28), COL.yellow, 5);
  shape(c, () => ell(c, cx + 240, cy - 130, 20, 20), COL.yellow, 5); shape(c, () => ell(c, cx + 290, cy - 130, 20, 20), COL.yellow, 5);
  shape(c, () => ell(c, cx + 285, cy - 85, 9, 10), INK, 0); shape(c, () => ell(c, cx + 355, cy - 58, 9, 7), INK, 0);
  line(c, [[cx + 285, cy - 72], [cx + 300, cy - 30]], 5, INK);
  for (const [x, y] of [[cx - 150, cy - 30], [cx - 80, cy + 30], [cx - 10, cy - 40], [cx + 60, cy + 20], [cx + 130, cy - 30], [cx - 190, cy + 30], [cx + 40, cy - 70]]) shape(c, () => ell(c, x, y, 14, 12), INK, 0);
  arrow(c, [[cx - 120, cy - 240], [cx + 330, cy - 240]], INK, 12);
  // snail: shell spiral, body, eye stalks
  const sx = 850, sy = 660;
  shadow(c, sx + 10, 700, 150, 18);
  shape(c, () => { c.moveTo(sx - 150, sy + 40); c.quadraticCurveTo(sx - 120, sy - 30, sx - 40, sy - 20); c.lineTo(sx + 110, sy - 20); c.quadraticCurveTo(sx + 160, sy, sx + 120, sy + 40); c.closePath(); }, COL.greyDk);
  shape(c, () => ell(c, sx + 20, sy - 40, 95, 80), COL.orange);
  shade(c, () => ell(c, sx + 20, sy - 40, 95, 80), "#d27c25", -30, -25, 0.5);
  c.beginPath(); for (let t = 0; t < Math.PI * 4; t += 0.1) { const r = 8 + t * 7; const px = sx + 20 + Math.cos(t) * r, py = sy - 40 + Math.sin(t) * r * 0.85; t ? c.lineTo(px, py) : c.moveTo(px, py); } c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  for (const dx of [-120, -95]) { line(c, [[dx + sx, sy - 10], [dx + sx - 20, sy - 70]], 8, INK); line(c, [[dx + sx, sy - 10], [dx + sx - 20, sy - 70]], 4, COL.greyDk); shape(c, () => ell(c, dx + sx - 20, sy - 72, 9, 9), INK, 0); }
  arrow(c, [[sx - 30, sy - 180], [sx - 110, sy - 180]], INK, 12);
};
// term.2: the grown-up pushes the girl on a swing from behind; the swing moves forward
const t2 = (c: Ctx) => {
  ground(c, WALL);
  c.fillStyle = COL.greenLt; c.fillRect(0, 900, D, D - 900); line(c, [[0, 900], [D, 900]], 6);
  // the frame
  for (const x of [120, 960]) { line(c, [[x - 70, 900], [x, 120]], 24, INK); line(c, [[x + 70, 900], [x, 120]], 24, INK); line(c, [[x - 70, 900], [x, 120]], 14, COL.steel); line(c, [[x + 70, 900], [x, 120]], 14, COL.steel); }
  line(c, [[90, 120], [990, 120]], 28, INK); line(c, [[90, 120], [990, 120]], 18, COL.steel);
  // ropes, swung forward, the seat
  const px = 700, py = 640;
  for (const dx of [-40, 50]) { line(c, [[540 + dx, 120], [px + dx, py]], 12, INK); line(c, [[540 + dx, 120], [px + dx, py]], 6, COL.brown); }
  shape(c, () => rrect(c, px - 90, py - 10, 180, 36, 12), COL.wood);
  person(c, px - 20, py + 150, 300, { sit: true, armL: [Math.PI * 0.75, Math.PI * 1.1], armR: [Math.PI * 0.4, Math.PI * 1.3] });
  // the grown-up behind, pushing with open hands
  const ad: Pose = { adult: true, armR: [Math.PI * 0.4, Math.PI * 0.25], armL: [Math.PI * 0.45, Math.PI * 0.3] };
  person(c, 450, 900, 600, ad);
  const [wx, wy] = wrist(450, 900, 600, ad, 1);
  hand(c, wx - 40, wy, 0, 0.9, SKIN.adult, CLOTH.adult, true);
  arrow(c, [[660, 530], [800, 530]], RED, 12);
  arrow(c, [[px + 80, py - 220], [px + 230, py - 220]], INK, 10);
};
// expl.2: a gentle flick sends the cap a short way, a hard flick far
const x2 = (c: Ctx) => {
  tilesAll(c, 180);
  tape(c, 240, 60, 1020, 40);
  for (const [y, dist, sc] of [[330, 160, 0.9], [760, 640, 1.4]]) {
    hand(c, 110, y, 0, 1.2);
    arrow(c, [[200, y - 110], [200 + 60 * sc, y - 110]], RED, 8 * sc);
    motion(c, 260 + dist, y, dist - 40, 26);
    arrow(c, [[270, y + 100], [250 + dist, y + 100]], INK, 9);
    cap(c, 300 + dist, y, 56);
  }
};
// expl.3: the ball rolls from shiny tiles onto a folded towel and stops there
const x3 = (c: Ctx) => {
  tilesAll(c, 270);
  shine(c, [[60, 300], [240, 120]], 14); shine(c, [[120, 760], [330, 550]], 14);
  // the folded towel: a thick striped slab
  shadow(c, 800, 960, 300, 30);
  shape(c, () => polyP(c, [[560, 400], [1040, 400], [1040, 900], [560, 900]]), COL.pink);
  c.save(); c.beginPath(); c.rect(560, 400, 480, 500); c.clip(); c.strokeStyle = COL.purple; c.lineWidth = 16; for (let y = 440; y < 900; y += 70) { c.beginPath(); c.moveTo(560, y); c.lineTo(1040, y); c.stroke(); } c.restore();
  shape(c, () => polyP(c, [[560, 900], [1040, 900], [1040, 940], [560, 940]]), "#d97c96");
  motion(c, 330, 640, 220, 32);
  arrow(c, [[120, 480], [560, 480]], INK, 12);
  arrow(c, [[600, 480], [680, 480]], INK, 8);
  ball(c, 800, 640, 110);
};

export const ic_forcesChangingMotionL1 = cards("sci.forces.changing-motion.L1", [se1_0, se1_1, se1_2, se2_0, se2_1, fe1, fe2, fa1, fa2, fa3, fp1, t1, t2, x2, x3]);
