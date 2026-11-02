import type { Ctx } from "./core";
import { INK, WHITE, COL, SKIN, CLOTH, RED, SH, ground, shape, shade, ell, rrect, shadow, line, shine, arrow, hand, write, cards } from "./flatKit";

// sci.forces.push-and-pull.L3 · set-up cards. Experiment 1: the child on a teal towel, side view, wall on
// the left. Experiment 2: a white string, a striped straw, one long pink balloon. Experiment 3: a blue
// tray seen from above with a white ping-pong ball, and two children seen from above blowing through straws.

const FLOOR = "#e3d3ad", PANTS = "#6b5a8c", TOWEL = COL.teal, TOWELDK = COL.tealDk, TAPE = "#f5e9b8", CHALK = COL.yellow;
const BALLOON = COL.pink, BALLOONDK = "#d9708f";

// ---------------------------------------------------------------- shared pieces
// a child's head in side view, looking left (dir -1) or right (dir 1); blow = puffed cheek and round mouth
const profile = (c: Ctx, x: number, y: number, r: number, dir: number, blow = false) => {
  shape(c, () => ell(c, x - dir * r * 0.95, y - r * 0.2, r * 0.32, r * 0.55), CLOTH.hair, 4);
  shape(c, () => ell(c, x, y, r, r * 1.05), CLOTH.hair, 5);
  shape(c, () => ell(c, x + dir * r * 0.2, y + r * 0.2, r * 0.82, r * 0.84), SKIN.child, 5);
  shape(c, () => ell(c, x - dir * r * 0.15, y + r * 0.2, r * 0.14, r * 0.2), SKIN.childDk, 3);
  shape(c, () => ell(c, x + dir * r * 1.0, y + r * 0.3, r * 0.13, r * 0.14), SKIN.child, 4);
  shape(c, () => ell(c, x + dir * r * 0.55, y + r * 0.05, r * 0.08, r * 0.11), INK, 0);
  if (blow) {
    shape(c, () => ell(c, x + dir * r * 0.35, y + r * 0.55, r * 0.26, r * 0.22), COL.pink, 0);
    shape(c, () => ell(c, x + dir * r * 0.85, y + r * 0.58, r * 0.13, r * 0.12), INK, 0);
  } else { c.beginPath(); c.arc(x + dir * r * 0.55, y + r * 0.5, r * 0.18, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
};
const limb = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 10, INK); line(c, pts, w, col); };
const strawTube = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w = 26) => {
  line(c, [[x1, y1], [x2, y2]], w + 10, INK); line(c, [[x1, y1], [x2, y2]], w, WHITE);
  const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
  for (let t = 14; t < L - 14; t += 44) line(c, [[x1 + ux * t, y1 + uy * t], [x1 + ux * (t + 20), y1 + uy * (t + 20)]], w, COL.pink);
};
const string = (c: Ctx, x1: number, y1: number, x2: number, y2: number) => { line(c, [[x1, y1], [x2, y2]], 11, INK); line(c, [[x1, y1], [x2, y2]], 5, WHITE); };

// ---------------------------------------------------------------- experiment 1: push the wall
const WALL_X = 172, FLOOR_Y = 740;
const S1 = 1.3; // the wall scenes are drawn at 1.3 x, anchored at the wall foot, so the child is big
const wallScene = (c: Ctx, draw: () => void) => {
  ground(c);
  c.save(); c.translate(0, FLOOR_Y * (1 - S1)); c.scale(S1, S1);
  c.fillStyle = FLOOR; c.fillRect(0, FLOOR_Y, 1200, 900);
  c.fillStyle = "#cfdcea"; c.fillRect(0, -600, WALL_X, FLOOR_Y + 600);
  for (let y = FLOOR_Y - 90; y > -600; y -= 90) line(c, [[0, y], [WALL_X, y]], 3, "#9fb3c8");
  line(c, [[WALL_X, -600], [WALL_X, FLOOR_Y]], 6); line(c, [[0, FLOOR_Y], [1200, FLOOR_Y]], 6);
  for (const y of [880, 1010]) line(c, [[0, y], [1200, y]], 3, "#c3b087");
  for (let x = 100; x < 1200; x += 220) line(c, [[x, FLOOR_Y], [x - (540 - x) * 0.2, 1200]], 3, "#c3b087");
  draw();
  c.restore();
};
const towel = (c: Ctx, x: number, w: number) => {
  shadow(c, x + w / 2 + 20, 796, w / 2 + 20, 14);
  shape(c, () => rrect(c, x, 745, w, 48, 12), TOWEL);
  shade(c, () => rrect(c, x, 745, w, 48, 12), TOWELDK, 0, 18, 0.7);
  line(c, [[x + 24, 769], [x + w - 24, 769]], 4, COL.sky); line(c, [[x + w * 0.5, 749], [x + w * 0.5, 789]], 3, TOWELDK);
};
// the child sits on the towel looking left; hip at (hx, 715); bent = knees up, feet flat on the wall
const sitter = (c: Ctx, hx: number, bent: boolean) => {
  const A = [222, 693], hip = [hx, 715], knee = [355, 566];
  limb(c, bent ? [hip, knee, A] : [hip, A], 62, PANTS);
  shape(c, () => rrect(c, hx - 48, 485, 100, 250, 42), CLOTH.child);
  shade(c, () => rrect(c, hx - 48, 485, 100, 250, 42), CLOTH.childDk, 36, 0, 0.7);
  shape(c, () => rrect(c, WALL_X, 640, 64, 106, 22), WHITE); shape(c, () => rrect(c, WALL_X, 640, 16, 106, 8), COL.steelDk, 4);
  line(c, [[WALL_X + 30, 664], [WALL_X + 52, 664]], 4, COL.blue);
  profile(c, hx - 5, 420, 80, -1);
  const arm = bent ? [[hx + 10, 530], [hx - 30, 615], [375, 590]] : [[hx + 10, 530], [hx - 20, 620], [hx - 120, 690]];
  limb(c, arm, 34, CLOTH.child);
  const h = arm[2]; shape(c, () => ell(c, h[0], h[1], 25, 25), SKIN.child, 5);
};

// 1. sitting on the towel, feet flat on the wall
const e1s0 = (c: Ctx) => wallScene(c, () => { towel(c, 330, 310); sitter(c, 470, true); });

// 2. legs straight, the towel has slid away; a chalk mark where the back edge started
const e1s1 = (c: Ctx) => wallScene(c, () => {
  towel(c, 460, 310);
  const mx = 640;
  line(c, [[mx + 12, 830], [mx - 12, 980]], 34, INK); line(c, [[mx + 12, 830], [mx - 12, 980]], 20, CHALK);
  sitter(c, 600, false);
  arrow(c, [[330, 600], [258, 600]]);
  arrow(c, [[430, 270], [800, 270]]);
});

// 3. from above: two chalk marks on the floor, a grown-up holding a tape measure between them
const e1s2 = (c: Ctx) => {
  ground(c, FLOOR);
  for (let y = 60; y < 1080; y += 160) line(c, [[0, y], [1080, y]], 3, "#c3b087");
  for (let x = 100; x < 1080; x += 200) line(c, [[x, 0], [x, 1080]], 3, "#c3b087");
  for (const x of [270, 790]) { line(c, [[x, 230], [x, 850]], 30, INK); line(c, [[x, 230], [x, 850]], 18, CHALK); }
  shadow(c, 540, 565, 300, 30);
  shape(c, () => rrect(c, 250, 490, 540, 92, 6), COL.yellow);
  for (let i = 0; i <= 52; i++) { const x = 270 + i * 10, h = i % 10 === 0 ? 30 : i % 5 === 0 ? 22 : 13; line(c, [[x, 492], [x, 492 + h * 1.3]], i % 10 === 0 ? 4 : 2.5); }
  for (let n = 0; n <= 5; n++) write(c, String(n), 276 + n * 100, 540, 34, INK, 5);
  shape(c, () => rrect(c, 768, 484, 36, 104, 8), COL.steel);
  shape(c, () => rrect(c, 160, 470, 130, 132, 26), COL.orange);
  shape(c, () => ell(c, 230, 536, 34, 34), COL.yellow, 5);
  hand(c, 150, 536, 0, 1.15, SKIN.adult, CLOTH.adult);
  hand(c, 900, 536, Math.PI, 1.15, SKIN.adult, CLOTH.adult);
  arrow(c, [[300, 420], [760, 420]]);
};

// ---------------------------------------------------------------- experiment 2: the balloon rocket
const chair = (c: Ctx, flip: boolean) => {
  c.save(); if (flip) { c.translate(1080, 0); c.scale(-1, 1); }
  shadow(c, 190, 884, 150, 16);
  shape(c, () => rrect(c, 235, 745, 36, 140, 6), COL.woodDk);
  shape(c, () => rrect(c, 55, 700, 240, 48, 10), COL.wood);
  shape(c, () => rrect(c, 55, 490, 50, 395, 14), COL.wood);
  shade(c, () => rrect(c, 55, 490, 50, 395, 14), COL.woodDk, 14, 0, 0.7);
  c.restore();
};
const floorLine = (c: Ctx) => { c.fillStyle = FLOOR; c.fillRect(0, 880, 1080, 200); line(c, [[0, 880], [1080, 880]], 6); };

// 1. string through a straw, tied between two chairs
const e2s0 = (c: Ctx) => {
  ground(c); floorLine(c);
  chair(c, false); chair(c, true);
  string(c, 80, 540, 1000, 540);
  for (const x of [80, 1000]) { shape(c, () => ell(c, x, 540, 20, 20), WHITE, 5); }
  strawTube(c, 440, 540, 740, 540, 44);
  arrow(c, [[400, 440], [760, 440]]);
};

// 2. the long balloon taped under the straw, a child blowing into its neck
const balloonLong = (c: Ctx, cx: number, cy: number, rx: number, ry: number, neck: number[][]) => {
  line(c, neck, 46, INK);
  shape(c, () => ell(c, cx, cy, rx, ry), BALLOON);
  shade(c, () => ell(c, cx, cy, rx, ry), BALLOONDK, rx * 0.12, ry * 0.4, 0.55);
  line(c, neck, 32, BALLOON);
  shape(c, () => ell(c, neck[neck.length - 1][0], neck[neck.length - 1][1], 22, 12, 0.3), BALLOONDK, 4);
  shine(c, [[cx - rx * 0.6, cy - ry * 0.5], [cx - rx * 0.2, cy - ry * 0.7]], 9);
};
const tapeStrip = (c: Ctx, x: number, y1: number, y2: number) => { shape(c, () => rrect(c, x - 22, y1, 44, y2 - y1, 6), TAPE, 5); };
const e2s1 = (c: Ctx) => {
  ground(c);
  string(c, -10, 380, 1090, 380);
  balloonLong(c, 640, 480, 300, 78, [[350, 480], [275, 540], [246, 646]]);
  strawTube(c, 420, 380, 860, 380, 44);
  tapeStrip(c, 480, 350, 450); tapeStrip(c, 780, 350, 450);
  shape(c, () => rrect(c, 20, 720, 260, 330, 70), CLOTH.child);
  shade(c, () => rrect(c, 20, 720, 260, 330, 70), CLOTH.childDk, 36, 0, 0.7);
  profile(c, 150, 640, 105, 1, true);
  arrow(c, [[300, 665], [345, 585]]);
};

// 3. the balloon whooshing along the string, a tape measure on the floor
const e2s2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, 730, 1080, 350); line(c, [[0, 730], [1080, 730]], 6);
  string(c, -10, 330, 1090, 330);
  const cx = 700;
  balloonLong(c, cx, 430, 190, 62, [[cx - 185, 430], [cx - 245, 440], [cx - 290, 440]]);
  strawTube(c, cx - 150, 330, cx + 150, 330, 44);
  tapeStrip(c, cx - 90, 305, 392); tapeStrip(c, cx + 100, 305, 392);
  for (const [dy, dx] of [[-26, 0], [0, -30], [26, 0]] as number[][]) line(c, [[cx - 310 + dx, 440 + dy], [cx - 440 + dx, 440 + dy * 1.8]], 10, COL.sky);
  arrow(c, [[cx - 140, 235], [cx + 180, 235]]);
  shadow(c, 540, 925, 440, 18);
  shape(c, () => rrect(c, 90, 840, 900, 78, 8), COL.yellow);
  for (let i = 0; i <= 80; i++) { const x = 140 + i * 10, h = i % 10 === 0 ? 36 : i % 5 === 0 ? 26 : 15; line(c, [[x, 842], [x, 842 + h]], i % 10 === 0 ? 4 : 2.5); }
  for (let n = 0; n <= 8; n++) write(c, String(n), 130 + n * 100, 880, 26, INK, 4);
  shape(c, () => rrect(c, 60, 825, 60, 108, 14), COL.steel);
};

// ---------------------------------------------------------------- experiment 3: blow the ball
const TX = 230, TY = 230, TW = 720, TH = 600, CX = TX + TW / 2, CY = TY + TH / 2;
const tray = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, TX + 16, TY + 18, TW, TH, 36), SH, 0);
  shape(c, () => rrect(c, TX, TY, TW, TH, 36), COL.blue);
  shade(c, () => rrect(c, TX, TY, TW, TH, 36), COL.blueDk, 14, 14, 0.6);
  shape(c, () => rrect(c, TX + 34, TY + 34, TW - 68, TH - 68, 22), COL.sky, 5);
};
const ball = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 12, y + 16, 85, 78);
  shape(c, () => ell(c, x, y, 85, 85), WHITE);
  shade(c, () => ell(c, x, y, 85, 85), COL.steelDk, 28, 28, 0.5);
  shine(c, [[x - 55, y - 25], [x - 30, y - 55]], 9);
};
const straw = (c: Ctx, x1: number, y1: number, x2: number, y2: number) => strawTube(c, x1, y1, x2, y2, 22);
// a child seen from above, leaning over an edge; facing direction angle a (0 = looking down the card)
const topKid = (c: Ctx, x: number, y: number, a: number, shirt: string, shirtDk: string, clip?: string) => {
  c.save(); c.translate(x, y); c.rotate(a);
  shape(c, () => rrect(c, -135, -120, 270, 100, 44), shirt);
  shade(c, () => rrect(c, -135, -120, 270, 100, 44), shirtDk, 0, 22, 0.7);
  shape(c, () => ell(c, 0, 26, 56, 58), SKIN.child, 5);
  shape(c, () => ell(c, -66, 0, 13, 22), SKIN.child, 4); shape(c, () => ell(c, 66, 0, 13, 22), SKIN.child, 4);
  shape(c, () => ell(c, 0, -8, 66, 62), CLOTH.hair, 5);
  line(c, [[-30, -40], [0, -50], [30, -40]], 5, "#5a4d80"); line(c, [[0, -58], [0, 6]], 4, "#5a4d80");
  if (clip) shape(c, () => rrect(c, 28, -42, 30, 14, 5), clip, 3);
  c.restore();
};
const KID1: [string, string] = [CLOTH.child, CLOTH.childDk], KID2: [string, string] = [COL.teal, COL.tealDk];

// 1. the ball in the middle of the tray, a straw at the bottom edge
const e3s0 = (c: Ctx) => { tray(c); ball(c, CX, CY); straw(c, CX + 40, 1010, CX + 8, 880); arrow(c, [[CX, 330], [CX, 425]]); };

// 2. two children blowing from opposite edges, the ball stays
const e3s1 = (c: Ctx) => {
  tray(c); ball(c, CX, CY);
  topKid(c, CX, 150, 0, ...KID2, COL.yellow); topKid(c, CX, 930, Math.PI, ...KID1);
  straw(c, CX, 215, CX, 360); straw(c, CX, 865, CX, 700);
  arrow(c, [[CX, 372], [CX, 435]]); arrow(c, [[CX, 688], [CX, 625]]);
};

// 3. blowing from the bottom edge and the left edge, the ball rolls to the top right
const e3s2 = (c: Ctx) => {
  tray(c);
  c.save(); c.setLineDash([14, 16]); c.beginPath(); ell(c, CX, CY, 85, 85); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); c.restore();
  ball(c, 800, 370);
  topKid(c, CX, 930, Math.PI, ...KID1); topKid(c, 150, CY, -Math.PI / 2, ...KID2, COL.yellow);
  straw(c, CX, 865, CX, 700); straw(c, 215, CY, 370, CY);
  arrow(c, [[CX, 688], [CX, 625]]); arrow(c, [[382, CY], [445, CY]]);
  arrow(c, [[650, 480], [730, 420]]);
};

export const su_forcesPushAndPullL3 = cards("sci.forces.push-and-pull.L3 set-up", [e1s0, e1s1, e1s2, e2s0, e2s1, e2s2, e3s0, e3s1, e3s2]);
