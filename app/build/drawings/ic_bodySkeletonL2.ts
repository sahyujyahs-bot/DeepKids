import type { Ctx } from "./core";
import { D, INK, BG, RED, WHITE, COL, SKIN, CLOTH, ground, shape, ell, rrect, shadow, line, arrow, hand, person, cards } from "./flatKit";
import type { Pose } from "./flatKit";

// SKELETON L2 · set-up cards and card pictures. One girl (SKIN.child) and one grown-up (SKIN.adult) throughout.
const PI = Math.PI, BONE = "#fffaf0", DARK = "#2f3350", WALL = "#434868", FLOOR = "#262a44", LIGHT = "#ffe98a", PAPER = "#ebe7dc";
const tube = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 10, INK); line(c, pts, w, col); };
const dash = (c: Ctx, pts: number[][], w: number, col: string, on = 18, off = 16) => { c.setLineDash([on, off]); line(c, pts, w, col); c.setLineDash([]); };
const arcPts = (x: number, y: number, r: number, a0: number, a1: number, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [x + Math.cos(a) * r, y + Math.sin(a) * r]; });
const dot = (c: Ctx, x: number, y: number, r: number, col: string) => shape(c, () => ell(c, x, y, r, r), col, 4);
// two-bone arm: angles [a1, a2] so the wrist of a person (feet x,y height h) lands at (tx, ty); flip puts the elbow the other side
const shoulder = (x: number, y: number, h: number, side: 1 | -1, sit = false): [number, number] => [x + side * h * 0.11, (sit ? y - h * 0.38 : y - h * 0.74) + h * 0.03];
const reach = (sx: number, sy: number, tx: number, ty: number, h: number, flip = 1): [number, number] => {
  const l1 = h * 0.17, l2 = h * 0.16, dx = tx - sx, dy = ty - sy, d = Math.min(Math.hypot(dx, dy), l1 + l2 - 2), b = Math.atan2(dy, dx);
  const a = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)), a1 = b - flip * a, ex = sx + Math.cos(a1) * l1, ey = sy + Math.sin(a1) * l1;
  return [a1, Math.atan2(ty - ey, tx - ex)];
};
const wristOf = (sx: number, sy: number, h: number, [a1, a2]: [number, number]) => [sx + Math.cos(a1) * h * 0.17 + Math.cos(a2) * h * 0.16, sy + Math.sin(a1) * h * 0.17 + Math.sin(a2) * h * 0.16];
const feet = (c: Ctx, x: number, y: number, h: number, tiptoe = false) => { for (const s of [-1, 1]) { c.save(); c.translate(x + s * h * 0.06, y); c.rotate(tiptoe ? -0.8 : 0); shape(c, () => rrect(c, -h * 0.03, -12, h * 0.13, 26, 12), SKIN.child, 5); c.restore(); } };
const darkRoom = (c: Ctx) => { ground(c, WALL); c.fillStyle = FLOOR; c.fillRect(0, 830, D, D); line(c, [[0, 830], [D, 830]], 6); };
// a torch centred at (x, y) pointing at angle an
const torch = (c: Ctx, x: number, y: number, an: number, s = 1, lit = true) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -90, -26, 130, 52, 14), COL.grey); shape(c, () => rrect(c, -90, -26, 130, 52, 14), COL.greyDk, 0); shape(c, () => rrect(c, -90, -26, 130, 52, 14), COL.grey, 6);
  shape(c, () => rrect(c, -60, -22, 40, 44, 8), COL.red, 4);
  shape(c, () => { c.moveTo(40, -26); c.lineTo(80, -42); c.lineTo(80, 42); c.lineTo(40, 26); c.closePath(); }, COL.greyDk);
  shape(c, () => ell(c, 80, 0, 10, 42), lit ? COL.yellow : COL.steel, 5);
  c.restore();
};
const beam = (c: Ctx, x: number, y: number, tx: number, ty: number, r: number) => { const an = Math.atan2(ty - y, tx - x), nx = -Math.sin(an) * r, ny = Math.cos(an) * r; c.globalAlpha = 0.28; shape(c, () => { c.moveTo(x, y - 20); c.lineTo(tx + nx, ty + ny); c.lineTo(tx - nx, ty - ny); c.lineTo(x, y + 20); c.closePath(); }, LIGHT, 0); c.globalAlpha = 1; };
const spot = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), LIGHT, 0); c.setLineDash([22, 18]); shape(c, () => ell(c, x, y, r + 14, r + 14), "rgba(0,0,0,0)", 8); c.setLineDash([]); };
const table = (c: Ctx, x: number, y: number, w: number) => { shadow(c, x + w / 2 + 20, y + 70, w / 2, 24); shape(c, () => rrect(c, x, y, w, 50, 10), COL.wood); shape(c, () => rrect(c, x, y + 30, w, 20, 6), COL.woodDk, 0); line(c, [[x, y], [x + w, y], [x + w, y + 50], [x, y + 50], [x, y]], 6); for (const lx of [x + 50, x + w - 50]) shape(c, () => rrect(c, lx - 18, y + 50, 36, 300), COL.woodDk); };
const paperSheet = (c: Ctx, x: number, y: number, w: number, h: number, taped = false) => {
  shadow(c, x + w / 2 + 16, y + h + 8, w / 2, 18); shape(c, () => rrect(c, x, y, w, h, 10), PAPER, 6);
  c.globalAlpha = 0.5; for (let ly = y + 40; ly < y + h - 20; ly += 36) line(c, [[x + 24, ly], [x + w - 24, ly]], 2, COL.grey); c.globalAlpha = 1;
  if (taped) { const sy = y + h / 2; line(c, [[x + 10, sy], [x + w - 10, sy]], 3, COL.greyDk); for (const tx of [x + w * 0.25, x + w * 0.55, x + w * 0.85]) shape(c, () => rrect(c, tx - 40, sy - 24, 80, 48, 4), "rgba(255,224,120,0.85)", 3); }
};
// a child's body outline, feet at (x, y), height h, as a marker line
const outline = (c: Ctx, x: number, y: number, h: number, fill = PAPER) => {
  for (const s of [-1, 1]) { tube(c, [[x + s * h * 0.14, y - h * 0.76], [x + s * h * 0.3, y - h * 0.56], [x + s * h * 0.36, y - h * 0.33]], h * 0.08, fill); tube(c, [[x + s * h * 0.07, y - h * 0.44], [x + s * h * 0.08, y - h * 0.22], [x + s * h * 0.09, y]], h * 0.1, fill); }
  shape(c, () => rrect(c, x - h * 0.15, y - h * 0.8, h * 0.3, h * 0.4, h * 0.06), fill, 6);
  shape(c, () => ell(c, x, y - h * 0.91, h * 0.09, h * 0.1), fill, 6);
};
const bonesIn = (c: Ctx, x: number, y: number, h: number) => {
  shape(c, () => ell(c, x, y - h * 0.91, h * 0.065, h * 0.075), BONE, 5); dot(c, x - h * 0.025, y - h * 0.92, h * 0.012, INK); dot(c, x + h * 0.025, y - h * 0.92, h * 0.012, INK);
  for (let k = 0; k < 11; k++) shape(c, () => rrect(c, x - h * 0.02, y - h * 0.79 + k * h * 0.034, h * 0.04, h * 0.027, h * 0.008), BONE, 4);
  for (let k = 0; k < 5; k++) for (const s of [-1, 1]) { const sy = y - h * 0.75 + k * h * 0.04; c.beginPath(); c.moveTo(x, sy); c.quadraticCurveTo(x + s * h * 0.14, sy - h * 0.01, x + s * h * 0.11, sy + h * 0.045); c.strokeStyle = INK; c.lineWidth = 14; c.lineCap = "round"; c.stroke(); c.strokeStyle = BONE; c.lineWidth = 7; c.stroke(); }
};
// a hand seen from above, wrist at the bottom centre (x, y); each finger has three bones, the thumb two
const FING = [[-66, 120], [-22, 150], [22, 140], [66, 110]];
const handTop = (c: Ctx, x: number, y: number, s: number, fill: string, lw = 6, marks?: (jx: number, jy: number, bone: boolean) => void) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => rrect(c, -85, -190, 170, 190, 40), fill, lw);
  for (const [fx, len] of FING) shape(c, () => rrect(c, fx - 20, -190 - len, 40, len + 50, 20), fill, lw);
  shape(c, () => rrect(c, -85, -190, 170, 190, 40), fill, 0);
  c.save(); c.translate(-80, -130); c.rotate(-0.9); shape(c, () => rrect(c, -20, -110, 40, 130, 20), fill, lw); c.restore();
  if (marks) {
    for (const [fx, len] of FING) for (let k = 0; k < 3; k++) { const y0 = -190 - len + (len * k) / 3; marks(fx, y0 + len / 6, true); if (k) marks(fx, y0, false); }
    const th = (t: number) => [-80 + Math.sin(0.9) * t, -130 + Math.cos(0.9) * t];
    for (const t of [-55, -105]) { const [px, py] = th(t); marks(px, py, true); } { const [px, py] = th(-80); marks(px, py, false); }
  }
  c.restore();
};
const pen = (c: Ctx, tx: number, ty: number, an: number, col: string, len = 220) => { c.save(); c.translate(tx, ty); c.rotate(an); shape(c, () => { c.moveTo(0, 0); c.lineTo(34, -14); c.lineTo(34, 14); c.closePath(); }, col, 5); shape(c, () => rrect(c, 34, -16, len - 34, 32, 8), WHITE, 6); shape(c, () => rrect(c, len - 60, -16, 26, 32, 4), col, 5); c.restore(); };
// a grown-up's (or child's) hand holding a pen whose tip is at (tx, ty), the pen body pointing along an
const penHand = (c: Ctx, tx: number, ty: number, an: number, col: string, adult = true) => {
  const s = adult ? 1.5 : 1.2, gx = tx + Math.cos(an) * 120, gy = ty + Math.sin(an) * 120;
  pen(c, tx, ty, an, col);
  hand(c, gx + Math.cos(an) * 70 * s, gy + Math.sin(an) * 70 * s, an + PI, s, adult ? SKIN.adult : SKIN.child, adult ? CLOTH.adult : CLOTH.child);
};
const sock = (c: Ctx, pts: number[][]) => { tube(c, pts, 110, COL.teal); const [a, b] = [pts[0], pts[1]], an = Math.atan2(b[1] - a[1], b[0] - a[0]); c.save(); c.translate(a[0], a[1]); c.rotate(an); shape(c, () => rrect(c, -10, -64, 60, 128, 12), COL.tealDk, 6); c.restore(); const e = pts[pts.length - 1]; shape(c, () => ell(c, e[0], e[1], 62, 62), COL.tealDk, 6); shape(c, () => ell(c, e[0], e[1], 50, 50), COL.teal, 0); };
const bottle = (c: Ctx, x: number, y: number, s = 1) => { c.save(); c.translate(x, y); c.scale(s, s); shape(c, () => rrect(c, -40, -120, 80, 240, 22), COL.steel); shape(c, () => rrect(c, 8, -110, 26, 220, 10), COL.steelDk, 0); shape(c, () => rrect(c, -26, -150, 52, 36, 8), COL.blueDk); c.restore(); };
const chair = (c: Ctx, x: number, y: number) => { shape(c, () => rrect(c, x, y - 420, 180, 40, 10), COL.wood); for (const px of [x, x + 150]) shape(c, () => rrect(c, px, y - 420, 30, 420), COL.woodDk); shape(c, () => rrect(c, x - 10, y - 200, 220, 36, 8), COL.wood); line(c, [[x + 190, y - 170], [x + 190, y]], 22, INK); line(c, [[x + 190, y - 170], [x + 190, y]], 12, COL.woodDk); };
// a crow standing, feet at (x, y): the leg bends backwards at the ankle (the joint that looks like a knee)
const crow = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const legs = (side: number) => { tube(c, [[side * 10, -170], [side * 10 - 40, -100], [side * 10 + 20, 0]], 16, COL.greyDk); for (const t of [-1, 0, 1]) line(c, [[side * 10 + 20, 0], [side * 10 + 20 + t * 30 + 10, 10]], 9, COL.greyDk); };
  legs(-1);
  shape(c, () => ell(c, 20, -250, 190, 105, -0.25), COL.black); shape(c, () => { c.moveTo(-150, -230); c.lineTo(-300, -150); c.lineTo(-260, -250); c.closePath(); }, COL.black);
  shape(c, () => ell(c, 60, -270, 150, 70, -0.35), "#4a4550", 0);
  shape(c, () => ell(c, 220, -350, 70, 65), COL.black); shape(c, () => { c.moveTo(270, -365); c.lineTo(370, -335); c.lineTo(270, -320); c.closePath(); }, COL.greyDk);
  dot(c, 230, -365, 12, WHITE); dot(c, 234, -365, 6, INK);
  legs(1);
  c.restore();
};
const bone = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w: number) => {
  const an = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(an) * w * 0.55, ny = Math.cos(an) * w * 0.55;
  tube(c, [[x1, y1], [x2, y2]], w, BONE);
  for (const [x, y] of [[x1, y1], [x2, y2]]) for (const s of [-1, 1]) shape(c, () => ell(c, x + s * nx, y + s * ny, w * 0.72, w * 0.72), BONE, 5);
};
const girl = (c: Ctx, x: number, y: number, h: number, p: Pose = {}, tiptoe?: boolean) => { person(c, x, y, h, p); if (tiptoe !== undefined) feet(c, x, y, h, tiptoe); };
const railing = (c: Ctx, y: number) => { for (const px of [140, 400, 680, 940]) shape(c, () => rrect(c, px - 16, y - 20, 32, 300), COL.steelDk); for (const ry of [y, y + 120]) shape(c, () => rrect(c, 60, ry - 18, 960, 36, 14), COL.steel); };
const legShin = (c: Ctx, pressY: number) => {
  ground(c); shadow(c, 560, 920, 190, 36);
  shape(c, () => rrect(c, 440, 150, 170, 700, 70), SKIN.child); shape(c, () => rrect(c, 560, 170, 46, 660, 20), SKIN.childDk, 0);
  shape(c, () => ell(c, 525, 230, 72, 62), SKIN.child, 5);
  shape(c, () => { c.moveTo(450, 800); c.quadraticCurveTo(470, 920, 700, 912); c.quadraticCurveTo(760, 880, 640, 840); c.lineTo(610, 800); c.closePath(); }, SKIN.child);
  // two fingertips pressing
  c.save(); c.translate(150, pressY); c.rotate(0.2); c.scale(2.2, 2.2);
  shape(c, () => rrect(c, -78, -36, 56, 72, 14), CLOTH.child, 6);
  shape(c, () => { c.moveTo(-26, -32); c.quadraticCurveTo(20, -42, 46, -30); c.lineTo(52, 30); c.quadraticCurveTo(10, 40, -26, 32); c.closePath(); }, SKIN.child, 6);
  for (let k = 0; k < 4; k++) shape(c, () => rrect(c, 34, -30 + k * 17, k < 2 ? 92 : 40, 16, 8), SKIN.child, 5);
  shape(c, () => { c.moveTo(-4, -30); c.quadraticCurveTo(22, -60, 52, -50); c.quadraticCurveTo(64, -44, 50, -34); c.quadraticCurveTo(26, -32, 12, -18); c.closePath(); }, SKIN.child, 5);
  c.restore();
  arrow(c, [[260, pressY - 170], [380, pressY - 110]]);
};

// ------------------------------------------------------------ set-up cards
const e1s0 = (c: Ctx) => {
  darkRoom(c);
  shape(c, () => rrect(c, 40, 60, 260, 790, 12), "#5a3f7a"); for (const fx of [100, 170, 240]) line(c, [[fx, 80], [fx, 830]], 4, "#3f2a5a");
  shape(c, () => rrect(c, 660, 560, 400, 290, 20), COL.wood); shape(c, () => rrect(c, 640, 600, 440, 150, 24), COL.blue); shape(c, () => ell(c, 760, 560, 90, 40), WHITE);
  torch(c, 900, 600, 0.1, 1.1, false);
  girl(c, 420, 870, 520, { armL: [PI * 0.58, PI * 0.5], armR: [PI * 0.42, PI * 0.5] }, false);
  dash(c, [[470, 950], [700, 950]], 7, WHITE); dot(c, 560, 950, 14, WHITE); dot(c, 660, 950, 14, WHITE);
};
const e1s1 = (c: Ctx) => {
  darkRoom(c);
  const h = 560, x = 300, y = 890, [sx, sy] = shoulder(x, y, h, 1), [wx, wy] = wristOf(sx, sy, h, [0, 0]);
  spot(c, 850, wy - 10, 160); beam(c, wx + 60, wy, 850, wy - 10, 160);
  girl(c, x, y, h, { armR: [0, 0] }, false); torch(c, wx + 40, wy, 0, 1.1);
  arrow(c, arcPts(850, wy - 10, 215, -PI * 0.6, PI * 0.9), RED, 10);
};
const e1s2 = (c: Ctx) => {
  darkRoom(c);
  const h = 520, x = 470, y = 900, [sx, sy] = shoulder(x, y, h, 1), [wx, wy] = wristOf(sx, sy, h, [PI / 2, 0]);
  shape(c, () => rrect(c, 900, 380, 46, 460, 23), LIGHT, 0); beam(c, wx + 60, wy, 920, 610, 150);
  const ah = 720, [asx, asy] = shoulder(250, 930, ah, 1, false);
  person(c, 250, 930, ah, { adult: true, armR: reach(asx, asy, sx - 4, sy + h * 0.09, ah, -1), armL: [PI * 0.58, PI * 0.5] });
  girl(c, x, y, h, { armR: [PI / 2, 0], armL: [PI * 0.55, PI * 0.5] }, false); torch(c, wx + 40, wy, 0, 1.1);
  shape(c, () => ell(c, sx - 4, sy + h * 0.09, 30, 30), SKIN.adult, 5);
  arrow(c, [[1010, 600], [1010, 400]]); arrow(c, [[1010, 640], [1010, 830]]);
};
const e1s3 = (c: Ctx) => {
  ground(c); table(c, 60, 640, 620);
  shape(c, () => rrect(c, 160, 548, 320, 96, 40), CLOTH.child); shape(c, () => rrect(c, 160, 600, 320, 44, 20), CLOTH.childDk, 0); shape(c, () => rrect(c, 160, 548, 320, 96, 40), "rgba(0,0,0,0)", 6);
  hand(c, 470, 596, 0, 1.6); torch(c, 640, 596, 0, 1.2);
  shape(c, () => rrect(c, 900, 0, 180, D, 0), "#9aa0b8", 0); line(c, [[900, 0], [900, D]], 6);
  beam(c, 740, 596, 980, 560, 90); shape(c, () => ell(c, 985, 560, 60, 90), LIGHT, 0);
  arrow(c, arcPts(470, 596, 300, -0.15, -0.55), RED, 10); arrow(c, arcPts(470, 596, 300, 0.15, 0.55), RED, 10);
};
const e1s4 = (c: Ctx) => {
  ground(c); table(c, 80, 706, 920);
  hand(c, 300, 620, 0, 2.2, SKIN.child, CLOTH.child, true);
  const kx = 375, ky = 554, an = -0.95, L = 140, tx = kx + Math.cos(an) * L, ty = ky + Math.sin(an) * L;
  tube(c, [[kx, ky], [tx, ty]], 34, SKIN.child); dot(c, tx + 6, ty - 4, 13, RED);
  dash(c, arcPts(kx, ky, L + 30, -1.25, 0.05), 8, INK, 6, 22);
};
const e2s0 = (c: Ctx) => { ground(c); paperSheet(c, 120, 90, 700, 840); outline(c, 470, 880, 660); pen(c, 820, 1000, -PI / 2, RED); pen(c, 940, 1000, -PI / 2, COL.blue); };
const e2s1 = (c: Ctx) => legShin(c, 560);
const e2s2 = (c: Ctx) => {
  ground(c); paperSheet(c, 120, 60, 840, 960); const x = 540, y = 960, h = 760; outline(c, x, y, h);
  const R: number[][] = [[0, -0.91], [0, -0.72], [0.3, -0.56], [-0.3, -0.56], [0.08, -0.22], [-0.08, -0.22], [0.09, -0.04], [-0.09, -0.04]], B: number[][] = [[0, -0.52], [0.22, -0.66], [-0.22, -0.66], [0.085, -0.13], [-0.085, -0.13]];
  R.forEach(([u, v]) => dot(c, x + u * h, y + v * h, 16, RED)); B.forEach(([u, v]) => dot(c, x + u * h, y + v * h, 16, COL.blue));
};
const a1s0 = (c: Ctx) => {
  ground(c); hand(c, 200, 620, 0, 2.4, SKIN.child, CLOTH.child, true);
  const J: number[][] = [[282, 548]], A = [-0.3, 0.55, 1.25], L = [132, 100, 85];
  for (let k = 0; k < 3; k++) { const [px, py] = J[k]; J.push([px + Math.cos(A[k]) * L[k], py + Math.sin(A[k]) * L[k]]); }
  tube(c, J, 36, SKIN.child); J.slice(0, 3).forEach(([px, py]) => dot(c, px, py - 14, 12, RED));
  penHand(c, J[2][0], J[2][1] - 24, -1.1, RED);
};
const a1s1 = (c: Ctx) => {
  ground(c); paperSheet(c, 110, 60, 860, 960);
  handTop(c, 540, 900, 1.9, PAPER, 6, (jx, jy, isBone) => { if (isBone) line(c, [[jx, jy - 14], [jx, jy + 14]], 6, INK); else dot(c, jx, jy, 5, RED); });
};
const a2s0 = (c: Ctx) => { ground(c); shadow(c, 560, 980, 260, 30); hand(c, 380, 150, PI / 2, 2); sock(c, [[380, 300], [380, 440], [430, 600], [530, 720], [690, 790]]); arrow(c, [[300, 500], [300, 740]]); };
const a2s1 = (c: Ctx) => {
  ground(c); hand(c, 190, 540, 0, 2); sock(c, [[330, 540], [900, 540]]);
  c.globalAlpha = 0.8; shape(c, () => rrect(c, 360, 516, 560, 48, 6), COL.wood, 0); c.globalAlpha = 1; dash(c, [[360, 516], [920, 516], [920, 564], [360, 564], [360, 516]], 4, INK, 10, 10);
  for (let k = 0; k <= 10; k++) line(c, [[380 + k * 52, 518], [380 + k * 52, k % 5 ? 532 : 544]], 3, INK);
};
const a2s2 = (c: Ctx) => {
  ground(c); hand(c, 170, 440, 0, 2); sock(c, [[310, 440], [600, 440], [810, 700]]);
  c.globalAlpha = 0.85; for (const p of [[330, 440, 590, 440], [612, 452, 800, 690]]) { tube(c, [[p[0], p[1]], [p[2], p[3]]], 24, COL.yellow); const an = Math.atan2(p[3] - p[1], p[2] - p[0]); dot(c, p[2] + Math.cos(an) * 16, p[3] + Math.sin(an) * 16, 8, INK); } c.globalAlpha = 1;
  arrow(c, arcPts(600, 440, 200, -0.2, 0.75), RED, 10);
};
const a3s0 = (c: Ctx) => {
  ground(c); const x = 500, y = 940, h = 620, [sx, sy] = shoulder(x, y, h, 1), [lx, ly] = shoulder(x, y, h, -1), [wx, wy] = wristOf(sx, sy, h, [PI / 2, PI / 2]);
  girl(c, x, y, h, { armR: [PI / 2, PI / 2], armL: reach(lx, ly, sx - 14, sy + h * 0.08, h, 1) }, false);
  bottle(c, wx, wy + 110); shape(c, () => ell(c, sx - 14, sy + h * 0.08, 30, 30), SKIN.child, 5);
};
const a3s1 = (c: Ctx) => {
  ground(c); const x = 500, y = 940, h = 620, [sx, sy] = shoulder(x, y, h, 1), [lx, ly] = shoulder(x, y, h, -1), [wx, wy] = wristOf(sx, sy, h, [PI / 2, -PI / 2]);
  girl(c, x, y, h, { armR: [PI / 2, -PI / 2], armL: reach(lx, ly, sx - 22, sy + h * 0.08, h, 1) }, false);
  shape(c, () => ell(c, sx - 26, sy + h * 0.085, 34, 48), CLOTH.child, 6); shape(c, () => ell(c, sx - 22, sy + h * 0.08, 30, 30), SKIN.child, 5);
  bottle(c, wx + 20, wy - 40); arrow(c, arcPts(sx + 20, sy + h * 0.17, 180, 0.9, -0.5), RED, 10);
};
const a3s2 = (c: Ctx) => {
  ground(c); line(c, [[0, 940], [D, 940]], 6); chair(c, 120, 940);
  const x = 560, y = 905, h = 620, [lx, ly] = shoulder(x, y, h, -1);
  girl(c, x, y, h, { armL: reach(lx, ly, 330, 530, h, -1), armR: [PI * 0.45, PI * 0.5] }, true);
  arrow(c, [[760, 760], [630, 880]]);
  shape(c, () => ell(c, 880, 300, 170, 170), COL.sky, 8);
  c.save(); c.beginPath(); ell(c, 880, 300, 165, 165); c.clip(); shape(c, () => rrect(c, 820, 120, 130, 300, 40), SKIN.child, 6); shape(c, () => { c.moveTo(830, 360); c.quadraticCurveTo(900, 470, 1040, 440); c.lineTo(1040, 480); c.lineTo(800, 480); c.closePath(); }, SKIN.child, 6); tube(c, [[840, 180], [832, 360]], 18, SKIN.childDk); c.restore();
  dot(c, 836, 300, 14, RED);
};
const a4s0 = (c: Ctx) => { ground(c, COL.sky); railing(c, 760); crow(c, 540, 745, 1.15); shape(c, () => ell(c, 540 - 46 + 12, 745 - 115, 58, 58), "rgba(0,0,0,0)", 10); c.strokeStyle = RED; c.lineWidth = 10; c.beginPath(); ell(c, 506, 630, 58, 58); c.stroke(); };
const a4s1 = (c: Ctx) => {
  ground(c); line(c, [[0, 940], [D, 940]], 6); paperSheet(c, 60, 160, 420, 740);
  tube(c, [[300, 260], [200, 460], [300, 760]], 26, COL.greyDk); for (const t of [-1, 0, 1]) line(c, [[300, 760], [300 + t * 60 + 20, 820]], 12, COL.greyDk);
  const x = 780, y = 905, h = 620; girl(c, x, y, h, {}, true);
  c.strokeStyle = RED; c.lineWidth = 10; for (const [cx, cy] of [[200, 460], [x + 20, 880]]) { c.beginPath(); ell(c, cx, cy, 60, 60); c.stroke(); }
};
const p1s0 = (c: Ctx) => {
  ground(c); paperSheet(c, 90, 150, 900, 780, true);
  c.save(); c.translate(540, 540); c.rotate(-PI / 2); person(c, 0, 330, 640, { armL: [PI * 0.78, PI * 0.78], armR: [PI * 0.22, PI * 0.22] }); c.restore();
  line(c, arcPts(540 - 240, 540, 112, PI * 0.6, PI * 1.5), 9, COL.black);
  penHand(c, 300, 428, -0.6, COL.black);
};
const p1s1 = (c: Ctx) => {
  ground(c); paperSheet(c, 60, 60, 640, 960, true); outline(c, 380, 960, 780); bonesIn(c, 380, 960, 780);
  const x = 880, y = 980, h = 420, [sx, sy] = shoulder(x, y, h, 1, true);
  person(c, x, y, h, { sit: true, armR: reach(sx, sy, x + 10, sy + h * 0.14, h, -1), armL: [PI * 0.62, PI * 0.5] });
};
const p1s2 = (c: Ctx) => {
  ground(c); line(c, [[0, 940], [D, 940]], 6); const x = 420, y = 920, h = 640, [sx, sy] = shoulder(x, y, h, 1);
  const hip = [x + h * 0.09, y - h * 0.42], knee = [x + h * 0.08, y - h * 0.2];
  girl(c, x, y, h, { armR: reach(sx, sy, hip[0] + 10, hip[1] - 10, h, -1), armL: [PI * 0.6, PI * 0.5] }, false);
  line(c, [hip, knee], 7, COL.teal); line(c, [[knee[0] - 22, knee[1]], [knee[0] + 22, knee[1]]], 8, RED);
  penHand(c, knee[0] + 10, knee[1] + 4, 0.35, RED);
};

// ------------------------------------------------------------ card pictures
const flowE1 = (c: Ctx) => { darkRoom(c); spot(c, 840, 500, 170); beam(c, 560, 560, 840, 500, 170); hand(c, 260, 560, 0, 2.4); torch(c, 500, 560, 0, 1.4); };
const flowE2 = (c: Ctx) => legShin(c, 250);
const flowA1 = (c: Ctx) => { ground(c); shadow(c, 580, 960, 300, 36); handTop(c, 540, 920, 2.1, SKIN.child, 6, (jx, jy, isBone) => { if (!isBone) dot(c, jx, jy, 7, RED); }); };
const flowA3 = (c: Ctx) => {
  ground(c); tube(c, [[160, 640], [560, 640]], 150, CLOTH.child); shape(c, () => ell(c, 390, 580, 150, 95), CLOTH.child, 6); tube(c, [[560, 640], [600, 250]], 120, SKIN.child);
  shape(c, () => ell(c, 605, 230, 70, 70), SKIN.child, 6); bottle(c, 610, 180, 1.1);
  arrow(c, arcPts(560, 640, 330, 0.5, -1.1), RED, 12);
};
const flowP1 = (c: Ctx) => { ground(c); paperSheet(c, 160, 40, 760, 1000, true); outline(c, 540, 980, 800); bonesIn(c, 540, 980, 800); };
const termBone = (c: Ctx) => { ground(c); shadow(c, 560, 820, 380, 40); bone(c, 200, 760, 880, 320, 90); };
const termXray = (c: Ctx) => {
  ground(c); shadow(c, 560, 1000, 320, 30); shape(c, () => rrect(c, 230, 90, 620, 900, 24), "#161a2a", 8);
  handTop(c, 540, 930, 1.85, "rgba(170,180,210,0.3)", 0);
  const sc = 1.85, bx = 540, by = 930;
  for (const [fx] of FING) tube(c, [[bx, by - 20], [bx + fx * sc, by - 180 * sc]], 20, BONE);
  handTop(c, bx, by, sc, "rgba(0,0,0,0)", 0, (jx, jy, isBone) => { if (isBone) bone(c, jx, jy - 16, jx, jy + 16, 8); });
};

export const ic_bodySkeletonL2 = cards("sci.body.skeleton.L2", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, a1s0, a1s1, a2s0, a2s1, a2s2, a3s0, a3s1, a3s2, a4s0, a4s1, p1s0, p1s1, p1s2,
  flowE1, flowE2, flowA1, flowA3, flowP1, termBone, termXray,
]);
