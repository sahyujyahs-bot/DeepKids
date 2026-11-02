import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, shape, ell, rrect, shadow, shade, line, arrow, hand, person, write, cards, ground } from "./flatKit";
import type { Pose } from "./flatKit";

// GROWING (L2) · set-up cards and card pictures: a girl (child) and her mother (adult) measuring height,
// arm span, feet and old clothes. Flat kit look; same people on every card.

const FLOOR = 880, WALL = "#f6efe0", STR = "#e8d9a8", BLUE = "#2f6fd1";
const PI = Math.PI;

// two-link arm to a target: shoulder (sx, sy), upper l1, fore l2; bend = 1 elbow one way, -1 the other
const ik = (sx: number, sy: number, tx: number, ty: number, l1: number, l2: number, bend = 1): [number, number] => {
  const dx = tx - sx, dy = ty - sy, d = Math.min(Math.hypot(dx, dy), l1 + l2 - 1), b = Math.atan2(dy, dx);
  const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))), a1 = b - bend * a;
  const ex = sx + Math.cos(a1) * l1, ey = sy + Math.sin(a1) * l1;
  return [a1, Math.atan2(ty - ey, tx - ex)];
};
// a pose whose hands reach the given points (left hand tL, right hand tR); undefined = hanging down
const reach = (x: number, y: number, h: number, tL?: number[], tR?: number[], bendL = 1, bendR = -1): Pose => ({
  armL: tL ? ik(x - h * 0.11, y - h * 0.71, tL[0], tL[1], h * 0.17, h * 0.16, bendL) : [PI / 2, PI / 2],
  armR: tR ? ik(x + h * 0.11, y - h * 0.71, tR[0], tR[1], h * 0.17, h * 0.16, bendR) : [PI / 2, PI / 2],
});
const room = (c: Ctx) => { ground(c, WALL); c.fillStyle = COL.wood; c.fillRect(0, FLOOR, D, D - FLOOR); line(c, [[0, FLOOR], [D, FLOOR]], 6); };
const floorView = (c: Ctx) => { ground(c, COL.wood); c.strokeStyle = COL.woodDk; c.lineWidth = 3; for (let y = 90; y < D; y += 180) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); } };
const tape = (c: Ctx, x: number, y: number, w: number, h: number) => { c.globalAlpha = 0.8; shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 4), "#ffe9a0", 3); c.globalAlpha = 1; };
// a paper strip taped upright on the wall
const strip = (c: Ctx, x: number, top: number, bot: number, w = 160, col = COL.paper) => {
  shadow(c, x + 8, bot + 6, w / 2, 8);
  shape(c, () => rrect(c, x - w / 2, top, w, bot - top, 6), col, 5);
  tape(c, x, top + 4, 90, 26); tape(c, x, bot - 4, 90, 26);
};
const windowAt = (c: Ctx, x: number, y: number, night: boolean) => {
  shape(c, () => rrect(c, x - 110, y - 110, 220, 220, 10), COL.woodDk, 6);
  shape(c, () => rrect(c, x - 92, y - 92, 184, 184, 6), night ? "#2a3a7a" : COL.sky, 4);
  if (night) { shape(c, () => ell(c, x + 20, y - 10, 46, 46), COL.yellow, 4); shape(c, () => ell(c, x + 42, y - 22, 36, 36), "#2a3a7a", 0); for (const [sx, sy] of [[-50, -50], [-60, 30], [-10, 60]]) shape(c, () => ell(c, x + sx, y + sy, 5, 5), WHITE, 0); }
  else { shape(c, () => ell(c, x, y, 50, 50), COL.yellow, 5); for (let k = 0; k < 8; k++) { const a = (k / 8) * PI * 2; line(c, [[x + Math.cos(a) * 64, y + Math.sin(a) * 64], [x + Math.cos(a) * 82, y + Math.sin(a) * 82]], 6, COL.orange); } }
};
const book = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 4), COL.green, 5);
  shape(c, () => rrect(c, x - w / 2 + 10, y - h / 2 + 4, w - 20, h - 8, 2), WHITE, 0);
};
const pencil = (c: Ctx, x: number, y: number, len: number, an: number, col: string) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -12, len - 30, 24, 4), col, 5);
  shape(c, () => { c.moveTo(len - 30, -12); c.lineTo(len, 0); c.lineTo(len - 30, 12); c.closePath(); }, COL.wood, 5);
  shape(c, () => { c.moveTo(len - 10, -4); c.lineTo(len, 0); c.lineTo(len - 10, 4); c.closePath(); }, INK, 0);
  c.restore();
};
// a wooden ruler lying along +x from (x, y), cm marks every cm px; vertical = true stands it up (marks to the right)
const ruler = (c: Ctx, x: number, y: number, cmN: number, cm: number, vertical = false, h = 70) => {
  c.save(); c.translate(x, y); if (vertical) c.rotate(-PI / 2);
  const len = cmN * cm + 30;
  shape(c, () => rrect(c, 0, 0, len, h, 4), COL.wood, 5);
  c.fillStyle = COL.woodDk; c.fillRect(3, h - 14, len - 6, 11);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let mm = 0; mm <= cmN * 10; mm++) { const px = 15 + (mm * cm) / 10, t = mm % 10 === 0 ? h * 0.42 : mm % 5 === 0 ? h * 0.3 : h * 0.17; c.lineWidth = mm % 10 === 0 ? 4 : 2.5; c.beginPath(); c.moveTo(px, 0); c.lineTo(px, t); c.stroke(); }
  for (let k = 0; k <= cmN; k++) write(c, String(k), 15 + k * cm - 9, h * 0.48, h * 0.34, INK, 4);
  c.restore();
};
const string = (c: Ctx, pts: number[][]) => { line(c, pts, 13, INK); line(c, pts, 7, STR); };
// a bare foot standing, toes up, centre (x, y), s = scale (1 = adult); outline = just the traced line on paper
const foot = (c: Ctx, x: number, y: number, s: number, fill: string, outline = false) => {
  const path = () => { c.moveTo(x - 62 * s, y + 150 * s); c.bezierCurveTo(x - 110 * s, y + 40 * s, x - 95 * s, y - 120 * s, x - 55 * s, y - 165 * s); c.bezierCurveTo(x - 10 * s, y - 200 * s, x + 70 * s, y - 180 * s, x + 80 * s, y - 110 * s); c.bezierCurveTo(x + 95 * s, y - 20 * s, x + 75 * s, y + 100 * s, x + 40 * s, y + 160 * s); c.bezierCurveTo(x + 10 * s, y + 195 * s, x - 50 * s, y + 190 * s, x - 62 * s, y + 150 * s); };
  if (!outline) shadow(c, x + 12 * s, y + 20 * s, 95 * s, 190 * s);
  shape(c, path, fill, outline ? 6 : 6);
  const toes = [[-62, -175, 24], [-20, -195, 20], [18, -192, 18], [50, -178, 16], [76, -150, 15]];
  toes.forEach(([tx, ty, r]) => shape(c, () => ell(c, x + tx * s, y + ty * s, r * s, r * s * 1.1), fill, outline ? 5 : 5));
  if (!outline) shade(c, path, fill === SKIN.child ? SKIN.childDk : SKIN.adultDk, 22 * s, 10 * s, 0.4);
};
// the towel bundle "baby": a swaddle with three atta packet tops showing (showTops) ; centre (x, y)
const bundle = (c: Ctx, x: number, y: number, s: number, showTops: boolean) => {
  shadow(c, x + 20 * s, y + 120 * s, 190 * s, 40 * s);
  if (showTops) for (let k = -1; k <= 1; k++) { const px = x + k * 95 * s; shape(c, () => rrect(c, px - 42 * s, y - 150 * s, 84 * s, 170 * s, 8 * s), COL.paper, 5); shape(c, () => rrect(c, px - 42 * s, y - 100 * s, 84 * s, 34 * s, 0), COL.orange, 3); write(c, "1", px - 10 * s, y - 92 * s, 24 * s, INK, 4); }
  const body = () => rrect(c, x - 190 * s, y - 70 * s, 380 * s, 190 * s, 70 * s);
  shape(c, body, COL.sky, 6); shade(c, body, COL.blue, 40 * s, 20 * s, 0.25);
  c.save(); c.beginPath(); body(); c.clip(); for (let k = -3; k <= 3; k++) line(c, [[x + k * 60 * s - 40 * s, y + 130 * s], [x + k * 60 * s + 60 * s, y - 80 * s]], 8 * s, "#7fb6de"); c.restore();
  line(c, [[x - 120 * s, y + 20 * s], [x + 30 * s, y - 50 * s]], 6);
};
const girlDress = (c: Ctx, x: number, y: number, h: number, pose: Pose) => {
  person(c, x, y, h, pose);
  // sleeves far above the wrists, hem above the knees: skin shows on forearms and lower legs
  for (const s of [-1, 1]) {
    const [a1, a2] = (s < 0 ? pose.armL : pose.armR) ?? [PI / 2, PI / 2], sx = x + s * h * 0.11, sy = y - h * 0.71;
    const ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17, wx = ex + Math.cos(a2) * h * 0.16, wy = ey + Math.sin(a2) * h * 0.16;
    line(c, [[ex + (wx - ex) * 0.1, ey + (wy - ey) * 0.1], [wx, wy]], h * 0.06 + 10, INK); line(c, [[ex + (wx - ex) * 0.1, ey + (wy - ey) * 0.1], [wx, wy]], h * 0.06, SKIN.child);
    line(c, [[x + s * h * 0.055, y - h * 0.3], [x + s * h * 0.06, y]], h * 0.075, INK); line(c, [[x + s * h * 0.055, y - h * 0.3], [x + s * h * 0.06, y]], h * 0.075 - 10, SKIN.child);
  }
};

// ------------------------------------------------------------------ e1 · bedtime tall, morning tall
const e1s0 = (c: Ctx) => {
  room(c);
  shape(c, () => rrect(c, 250, -20, 190, FLOOR + 30, 0), COL.woodDk, 6); shape(c, () => rrect(c, 285, -20, 120, FLOOR + 30, 0), COL.brown, 4);
  strip(c, 345, 300, 560, 110, COL.grey); for (let k = 0; k < 9; k++) line(c, [[310, 330 + k * 24], [380, 330 + k * 24]], 3, COL.greyDk);
  // the stool with the things on it
  shadow(c, 760, 895, 220, 22);
  for (const lx of [600, 880]) shape(c, () => rrect(c, lx - 18, 640, 36, 240, 6), COL.brown, 5);
  shape(c, () => rrect(c, 560, 600, 380, 50, 10), COL.wood, 6);
  book(c, 640, 582, 140, 30);
  ruler(c, 700, 540, 2, 95, false, 48);
  pencil(c, 590, 520, 150, -0.1, BLUE); pencil(c, 590, 560, 150, 0.1, RED);
};
const measureScene = (c: Ctx, night: boolean, lines: [number, string][]) => {
  room(c); windowAt(c, 880, 230, night);
  const gx = 430, gh = 460, head = FLOOR - gh * 1.01;
  strip(c, gx, 280, 640, 170);
  lines.forEach(([dy, col]) => line(c, [[gx - 78, head + dy], [gx + 78, head + dy]], 7, col));
  person(c, gx, FLOOR, gh, reach(gx, FLOOR, gh));
  const ax = 690, ah = 620, pen = lines[lines.length - 1][1];
  person(c, ax, FLOOR, ah, { adult: true, ...reach(ax, FLOOR, ah, [gx + 60, head - 14], [gx + 170, head + 40], 1, -1) });
  book(c, gx, head - 12, 200, 26);
  pencil(c, gx + 172, head + 42, 130, -PI * 0.78, pen);
};
const e1s1 = (c: Ctx) => measureScene(c, true, [[2, BLUE]]);
const e1s2 = (c: Ctx) => measureScene(c, false, [[14, BLUE], [-2, RED]]);
const e1s3 = (c: Ctx) => {
  ground(c, WALL);
  strip(c, 460, 60, 1020, 560);
  line(c, [[240, 600], [680, 600]], 9, BLUE); line(c, [[240, 548], [680, 548]], 9, RED);
  ruler(c, 700, 860, 6, 104, true, 110);
  arrow(c, [[880, 574], [730, 574]]);
  line(c, [[680, 548], [730, 548]], 4, RED); line(c, [[680, 600], [730, 600]], 4, BLUE);
};
const e1flow = (c: Ctx) => {
  room(c); windowAt(c, 180, 230, true); windowAt(c, 900, 230, false);
  const gx = 540, gh = 520, head = FLOOR - gh * 1.01;
  strip(c, gx, 240, 700, 200);
  line(c, [[gx - 95, head + 16], [gx + 95, head + 16]], 9, BLUE); line(c, [[gx - 95, head - 6], [gx + 95, head - 6]], 9, RED);
  person(c, gx, FLOOR, gh, reach(gx, FLOOR, gh));
  arrow(c, [[gx + 200, head + 90], [gx + 200, head - 10]]);
};

// ------------------------------------------------------------------ e2 · arms out
const e2s0 = (c: Ctx) => {
  room(c);
  const gx = 500, gh = 500, sy = FLOOR - gh * 0.71;
  person(c, gx, FLOOR, gh, { armL: [PI, PI], armR: [0, 0] });
  const ax = 900, ah = 620;
  person(c, ax, FLOOR, ah, { adult: true, ...reach(ax, FLOOR, ah, [gx + 240, sy + 6], undefined, 1) });
  string(c, [[gx - 230, sy + 6], [gx + 240, sy + 6]]);
  tape(c, gx - 230, sy + 6, 30, 30);
};
const e2s1 = (c: Ctx) => {
  room(c);
  const gx = 440, gh = 500, head = FLOOR - gh * 1.01, sx = 580;
  person(c, gx, FLOOR, gh, reach(gx, FLOOR, gh));
  const ax = 800, ah = 620;
  person(c, ax, FLOOR, ah, { adult: true, ...reach(ax, FLOOR, ah, [sx, head + 4], undefined, 1) });
  string(c, [[sx, FLOOR], [sx, head + 4]]);
  tape(c, sx, FLOOR - 6, 34, 20);
  line(c, [[gx - 70, head], [sx + 20, head]], 4, INK);
};
const tag = (c: Ctx, x: number, y: number, draw: () => void) => { shape(c, () => rrect(c, x - 75, y - 75, 150, 150, 10), WHITE, 5); draw(); };
const e2s2 = (c: Ctx) => {
  floorView(c);
  string(c, [[290, 430], [930, 430]]); tape(c, 290, 430, 28, 28); tape(c, 930, 430, 28, 28);
  string(c, [[290, 680], [918, 680]]); tape(c, 290, 680, 28, 28); tape(c, 918, 680, 28, 28);
  tag(c, 150, 430, () => person(c, 150, 490, 110, reach(150, 490, 110)));
  tag(c, 150, 680, () => person(c, 150, 740, 110, { armL: [PI, PI], armR: [0, 0] }));
  line(c, [[930, 400], [930, 710]], 4, INK);
};
const e2flow = (c: Ctx) => {
  room(c);
  const gx = 540, gh = 560, sy = FLOOR - gh * 0.71, head = FLOOR - gh * 1.01;
  c.setLineDash([18, 14]); line(c, [[gx - 280, head - 10], [gx + 280, head - 10], [gx + 280, FLOOR], [gx - 280, FLOOR], [gx - 280, head - 10]], 5, COL.greyDk); c.setLineDash([]);
  person(c, gx, FLOOR, gh, { armL: [PI, PI], armR: [0, 0] });
  arrow(c, [[gx - 240, sy + 70], [gx + 240, sy + 70]]);
  arrow(c, [[gx - 330, FLOOR - 20], [gx - 330, head]]);
};

// ------------------------------------------------------------------ a1 · old clothes
const a1s0 = (c: Ctx) => {
  ground(c, WALL);
  shape(c, () => rrect(c, 80, 260, 920, 640, 30), COL.brown, 6);
  shape(c, () => rrect(c, 110, 300, 860, 560, 20), COL.sky, 5);
  shape(c, () => rrect(c, 140, 320, 300, 150, 30), WHITE, 5);
  // the small frock
  const fx = 560, fy = 600;
  shape(c, () => { c.moveTo(fx - 70, fy - 160); c.lineTo(fx + 70, fy - 160); c.lineTo(fx + 130, fy - 90); c.lineTo(fx + 90, fy - 60); c.lineTo(fx + 110, fy + 120); c.lineTo(fx - 110, fy + 120); c.lineTo(fx - 90, fy - 60); c.lineTo(fx - 130, fy - 90); c.closePath(); }, CLOTH.child, 6);
  shape(c, () => ell(c, fx, fy - 160, 40, 18), COL.sky, 5);
  for (const dx of [-40, 0, 40]) shape(c, () => ell(c, fx + dx, fy + 40, 10, 10), WHITE, 3);
  // tiny chappals
  for (const dx of [800, 900]) { shape(c, () => ell(c, dx, 640, 38, 90), COL.soil, 5); line(c, [[dx - 30, 650], [dx, 600], [dx + 30, 650]], 7, COL.red); }
};
const a1s1 = (c: Ctx) => {
  room(c);
  const gx = 330, gh = 520, pose = reach(gx, FLOOR, gh);
  girlDress(c, gx, FLOOR, gh, pose);
  shape(c, () => rrect(c, 600, 160, 340, 740, 24), COL.woodDk, 6);
  shape(c, () => rrect(c, 630, 190, 280, 680, 14), COL.sky, 4);
  c.save(); c.beginPath(); rrect(c, 630, 190, 280, 680, 14); c.clip();
  c.fillStyle = COL.wood; c.fillRect(630, FLOOR - 20, 280, 100); line(c, [[630, FLOOR - 20], [910, FLOOR - 20]], 5);
  girlDress(c, 770, FLOOR - 20, gh, pose);
  c.restore();
  shape(c, () => rrect(c, 630, 190, 280, 680, 14), "rgba(0,0,0,0)", 4);
  arrow(c, [[520, 520], [430, 560]], RED, 8); arrow(c, [[520, 760], [430, 740]], RED, 8);
};

// ------------------------------------------------------------------ a2 · feet in a row
const paperSheet = (c: Ctx, x: number, y: number, w: number, h: number, news = false) => {
  shadow(c, x + 10, y + h / 2 + 8, w / 2, 10);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 6), news ? "#eeeae0" : COL.paper, 5);
  if (news) { c.globalAlpha = 0.5; for (let k = 0; k < Math.floor(h / 26); k++) line(c, [[x - w / 2 + 24, y - h / 2 + 30 + k * 26], [x + w / 2 - 24, y - h / 2 + 30 + k * 26]], 4, COL.greyDk); c.globalAlpha = 1; }
};
const a2s0 = (c: Ctx) => {
  floorView(c);
  paperSheet(c, 500, 540, 620, 820, true);
  foot(c, 470, 540, 1.1, SKIN.adult);
  c.setLineDash([14, 12]); c.save(); c.translate(470, 540); c.scale(1.18, 1.14); c.translate(-470, -540); c.beginPath(); c.moveTo(470 - 62 * 1.1, 540 + 150 * 1.1); c.bezierCurveTo(470 - 110 * 1.1, 540 + 40 * 1.1, 470 - 95 * 1.1, 540 - 120 * 1.1, 470 - 55 * 1.1, 540 - 165 * 1.1); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); c.restore(); c.setLineDash([]);
  pencil(c, 760, 300, 210, 2.25, COL.yellow);
  hand(c, 790, 268, 2.25, 1, SKIN.child, CLOTH.child);
};
const a2s1 = (c: Ctx) => {
  floorView(c);
  const S = [[0.5, "3"], [0.68, "8"], [0.86, "35"], [1, "40"]];
  S.forEach(([s, age], i) => { const x = 160 + i * 255, y = 500; paperSheet(c, x, y, 230, 520); foot(c, x, y - 20, (s as number) * 1.05, COL.paper, true); write(c, age as string, x - 20 * String(age).length, y + 180, 52, INK, 6); });
  arrow(c, [[150, 860], [930, 860]]);
};

// ------------------------------------------------------------------ a3 · atta packet baby
const a3s0 = (c: Ctx) => { ground(c, WALL); c.fillStyle = COL.wood; c.fillRect(0, 700, D, 380); line(c, [[0, 700], [D, 700]], 6); bundle(c, 540, 600, 1.25, true); };
const a3s1 = (c: Ctx) => {
  room(c);
  const gx = 540, gh = 600, by = FLOOR - gh * 0.5;
  person(c, gx, FLOOR, gh, reach(gx, FLOOR, gh, [gx + 90, by + 40], [gx - 90, by + 40], 1, -1));
  bundle(c, gx, by - 20, 0.75, false);
  shape(c, () => ell(c, gx - 110, by - 50, 48, 48), COL.sky, 6); shade(c, () => ell(c, gx - 110, by - 50, 48, 48), COL.blue, 10, 6, 0.25);
};

// ------------------------------------------------------------------ a4 · birth numbers
const a4s0 = (c: Ctx) => {
  room(c);
  const ax = 240, ah = 640, gx = 840, gh = 480;
  const cx = 540, cy = 520;
  person(c, ax, FLOOR, ah, { adult: true, ...reach(ax, FLOOR, ah, undefined, [cx - 150, cy + 100], 1, -1) });
  person(c, gx, FLOOR, gh, reach(gx, FLOOR, gh, [cx + 150, cy + 120], undefined, 1));
  shadow(c, cx + 12, cy + 182, 170, 14);
  shape(c, () => rrect(c, cx - 170, cy - 180, 340, 360, 10), COL.paper, 6);
  c.strokeStyle = COL.grey; c.lineWidth = 2; for (let k = 0; k <= 6; k++) { c.beginPath(); c.moveTo(cx - 140, cy - 150 + k * 50); c.lineTo(cx + 140, cy - 150 + k * 50); c.stroke(); c.beginPath(); c.moveTo(cx - 140 + k * 46, cy - 150); c.lineTo(cx - 140 + k * 46, cy + 150); c.stroke(); }
  line(c, [[cx - 140, cy + 120], [cx - 80, cy + 20], [cx - 20, cy - 40], [cx + 60, cy - 90], [cx + 140, cy - 120]], 7, COL.green);
  for (const [px, py] of [[-140, 120], [-80, 20], [-20, -40], [60, -90], [140, -120]]) shape(c, () => ell(c, cx + px, cy + py, 9, 9), BLUE, 3);
  write(c, "50", cx - 150, cy + 128, 30, BLUE, 4); write(c, "3", cx - 150, cy - 160, 30, BLUE, 4);
};
const a4s1 = (c: Ctx) => {
  floorView(c);
  string(c, [[290, 430], [590, 430]]); tape(c, 290, 430, 28, 28); tape(c, 590, 430, 28, 28);
  string(c, [[290, 680], [980, 680]]); tape(c, 290, 680, 28, 28); tape(c, 980, 680, 28, 28);
  tag(c, 150, 430, () => { shape(c, () => rrect(c, 90, 400, 120, 70, 35), COL.sky, 5); shape(c, () => ell(c, 112, 435, 26, 26), SKIN.child, 5); shape(c, () => { c.moveTo(86, 430); c.bezierCurveTo(90, 395, 134, 395, 138, 430); c.quadraticCurveTo(112, 418, 86, 430); c.closePath(); }, CLOTH.hair, 3); });
  tag(c, 150, 680, () => person(c, 150, 740, 110, reach(150, 740, 110)));
  write(c, "50 cm", 350, 470, 52, INK, 6);
};

// ------------------------------------------------------------------ p1 · my growing chart
const p1s0 = (c: Ctx) => {
  room(c);
  shape(c, () => rrect(c, 60, 560, 300, 320, 14), COL.brown, 6); shape(c, () => rrect(c, 80, 580, 260, 90, 12), COL.sky, 5); shape(c, () => rrect(c, 90, 540, 120, 60, 30), WHITE, 5);
  strip(c, 620, 100, 840, 300);
  shadow(c, 880, 895, 80, 14); shape(c, () => rrect(c, 820, 790, 120, 90, 8), COL.wood, 6); tape(c, 880, 790, 60, 24);
};
const p1s1 = (c: Ctx) => {
  ground(c, WALL);
  strip(c, 540, 60, 1020, 640);
  const L = [[640, "1-6"], [580, "1-7"], [520, "1-8"]];
  L.forEach(([y, d]) => { line(c, [[300, y as number], [620, y as number]], 9, INK); write(c, d as string, 650, (y as number) - 30, 54, INK, 6); });
  arrow(c, [[200, 720], [200, 480]]);
};

// ------------------------------------------------------------------ terms
const term5 = (c: Ctx) => {
  ground(c, BG);
  const x = 540;
  for (let k = 0; k < 6; k++) {
    const y = 180 + k * 125;
    shadow(c, x + 40, y + 60, 150, 30);
    shape(c, () => rrect(c, x - 130, y, 260, 78, 26), COL.steelIn, 6); shade(c, () => rrect(c, x - 130, y, 260, 78, 26), COL.steelDk, 30, 14, 0.4);
    shape(c, () => rrect(c, x + 100, y + 8, 110, 60, 20), COL.steelIn, 6);
    if (k < 5) { shape(c, () => rrect(c, x - 118, y + 80, 236, 44, 18), COL.blue, 6); shade(c, () => rrect(c, x - 118, y + 80, 236, 44, 18), COL.blueDk, 20, 10, 0.4); }
  }
  arrow(c, [[220, 460], [400, 410]]);
};
const term2 = (c: Ctx) => {
  ground(c, BG);
  ruler(c, 100, 560, 5, 170, false, 130);
  shape(c, () => rrect(c, 215, 150, 180, 400, 80), SKIN.child, 6); shade(c, () => rrect(c, 215, 150, 180, 400, 80), SKIN.childDk, 40, 20, 0.4);
  shape(c, () => rrect(c, 240, 400, 130, 125, 40), COL.pink, 5);
  arrow(c, [[285, 640], [285, 580]], RED, 8); arrow(c, [[455, 640], [455, 580]], RED, 8);
  line(c, [[285, 660], [455, 660]], 8, RED);
};

export const ic_bodyGrowingL2 = cards("sci.body.growing.L2", [
  e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, a1s0, a1s1, a2s0, a2s1, a3s0, a3s1, a4s0, a4s1, p1s0, p1s1,
  e1flow, e2flow, term5, term2,
]);
