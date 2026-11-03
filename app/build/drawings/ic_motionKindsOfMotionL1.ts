import type { Ctx } from "./core";
import { D, INK, BG, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, plate, cards } from "./flatKit";

// KINDS OF MOTION L1 · roll, slide, spin, swing, bounce. Set-up cards for the Roll or Slide Test (e1)
// and the Bounce Test (e2), then card pictures. Side views on a tiled floor; depth goes back up-right.

const WALL = "#f6efe0", TILE = "#e9e3d7", TILELN = "#cfc6b6", CARD = "#c9a06b", DOUGH = "#e8c98f", DOUGHDK = "#c9a66a", RUBBER = "#e4523b", RUBBERDK = "#b53b2a";

// a tiled floor from y = hy down, a plain wall above
const floor = (c: Ctx, hy: number) => {
  ground(c, WALL);
  c.fillStyle = TILE; c.fillRect(0, hy, D, D - hy);
  c.strokeStyle = TILELN; c.lineWidth = 3;
  for (let x = 0; x <= D; x += 135) { c.beginPath(); c.moveTo(x, hy); c.lineTo(x, D); c.stroke(); }
  for (let y = hy; y <= D; y += 120) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
  line(c, [[0, hy], [D, hy]], 5, INK);
};
// a wooden table: its top surface from y0 to y1 (things stand on it), front edge below, two legs
const table = (c: Ctx, y0: number, y1: number, x0 = 60, x1 = 1020, legTo = 1040) => {
  shape(c, () => rrect(c, x0 + 40, y1 + 30, 36, legTo - y1 - 30, 6), COL.woodDk);
  shape(c, () => rrect(c, x1 - 76, y1 + 30, 36, legTo - y1 - 30, 6), COL.woodDk);
  shape(c, () => rrect(c, x0, y0, x1 - x0, y1 - y0, 10), COL.wood);
  shape(c, () => polyP(c, [[x0, y1], [x1, y1], [x1, y1 + 34], [x0, y1 + 34]]), COL.woodDk);
};
// a tape line across the floor (seen from the side it runs away from us)
const tape = (c: Ctx, x: number, y0: number, y1: number) => shape(c, () => rrect(c, x - 8, y0, 16, y1 - y0, 4), COL.yellow, 4);
// a hardback standing on its edge, base at y, the face that pushes at x = front; its width goes back up-right
const book = (c: Ctx, front: number, base: number, t = 34, h = 280, dpx = 110, dpy = -70) => {
  const x0 = front - t;
  shadow(c, front + 40, base + 6, 90, 14);
  shape(c, () => polyP(c, [[front, base - h], [front + dpx, base - h + dpy], [front + dpx, base + dpy], [front, base]]), COL.blue);
  shape(c, () => polyP(c, [[x0, base - h], [front, base - h], [front + dpx, base - h + dpy], [x0 + dpx, base - h + dpy]]), COL.paper);
  shape(c, () => rrect(c, x0, base - h, t, h, 5), COL.blueDk);
};
// a round steel dabba lying on its side, seen end on (the flat lid faces us), so it rolls left-right; centre (x, y), radius r
const dabbaRoll = (c: Ctx, x: number, y: number, r: number) => {
  const ox = r * 0.6, oy = -r * 0.39, nl = Math.hypot(ox, oy), ux = (-oy / nl) * r, uy = (ox / nl) * r;
  shadow(c, x + 24, y + r + 4, r * 1.1, r * 0.16);
  shape(c, () => ell(c, x + ox, y + oy, r, r), COL.steelDk);
  shape(c, () => polyP(c, [[x + ux, y + uy], [x + ox + ux, y + oy + uy], [x + ox - ux, y + oy - uy], [x - ux, y - uy]]), COL.steelDk, 0);
  line(c, [[x + ux, y + uy], [x + ox + ux, y + oy + uy]]); line(c, [[x - ux, y - uy], [x + ox - ux, y + oy - uy]]);
  shape(c, () => ell(c, x, y, r, r), COL.steel);
  shade(c, () => ell(c, x, y, r, r), COL.steelDk, -r * 0.3, -r * 0.22, 0.5);
  shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), COL.steelIn, 4);
  shine(c, [[x - r * 0.6, y - r * 0.25], [x - r * 0.3, y - r * 0.6]], 8);
};
// the same dabba standing flat on its bottom, base at (x, base), diameter w, height h
const dabbaStand = (c: Ctx, x: number, base: number, w = 200, h = 110) => {
  const r = w / 2, ry = r * 0.3, lt = base - h;
  shadow(c, x + 16, base + 4, r * 1.1, ry * 1.1);
  const body = () => { c.moveTo(x - r, lt + ry); c.lineTo(x - r, base); c.ellipse(x, base, r, ry, 0, Math.PI, 0, true); c.lineTo(x + r, lt + ry); c.closePath(); };
  shape(c, body, COL.steel);
  shade(c, body, COL.steelDk, -r * 0.35, 0, 0.5);
  const lid = () => { c.moveTo(x - r - 4, lt + ry); c.lineTo(x - r - 4, lt + ry + 26); c.ellipse(x, lt + ry + 26, r + 4, ry, 0, Math.PI, 0, true); c.lineTo(x + r + 4, lt + ry); c.closePath(); };
  shape(c, lid, COL.steel);
  shade(c, lid, COL.steelDk, -r * 0.35, 0, 0.5);
  shape(c, () => ell(c, x, lt + ry, r + 4, ry), COL.steelIn, 5);
  shine(c, [[x - r * 0.8, lt + ry + 44], [x - r * 0.8, base - 24]], 8);
};
// a paper slip lying flat on the floor
const slip = (c: Ctx, x: number, y: number) => shape(c, () => polyP(c, [[x, y], [x + 70, y], [x + 86, y + 34], [x + 16, y + 34]]), COL.paper, 4);
// a ball with its bottom at (x, bottom); sq squashes it (flatter and wider)
const ball = (c: Ctx, x: number, bottom: number, r: number, col: string, dk: string, sq = 0, shad = true) => {
  const ry = r * (1 - sq), rx = r * (1 + sq * 0.8), cy = bottom - ry, p = () => ell(c, x, cy, rx, ry);
  if (shad) shadow(c, x + 10, bottom + 4, rx * 0.9, r * 0.14);
  shape(c, p, col);
  shade(c, p, dk, -rx * 0.28, -ry * 0.28, 0.5);
  shine(c, [[x - rx * 0.5, cy - ry * 0.3], [x - rx * 0.22, cy - ry * 0.62]], Math.max(6, r * 0.09));
};
const sockBall = (c: Ctx, x: number, bottom: number, r: number) => {
  ball(c, x, bottom, r, COL.sky, COL.blue, 0.1);
  const ry = r * 0.9, cy = bottom - ry;
  c.save(); c.beginPath(); ell(c, x, cy, r * 1.08, ry); c.clip();
  line(c, [[x - r * 1.1, cy - ry * 0.25], [x, cy], [x + r * 1.1, cy - ry * 0.25]], 14, COL.blue);
  line(c, [[x - r * 1.1, cy + ry * 0.45], [x, cy + ry * 0.62], [x + r * 1.1, cy + ry * 0.45]], 14, COL.blue);
  c.restore();
  line(c, [[x + r * 0.2, cy - ry * 0.95], [x + r * 0.45, cy - ry * 0.5]], 4, COL.blueDk);
};
const paperBall = (c: Ctx, x: number, bottom: number, r: number) => {
  const cy = bottom - r * 0.92, pts: number[][] = [];
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, rr = r * (i % 2 ? 0.86 : 1); pts.push([x + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.92]); }
  shadow(c, x + 10, bottom + 4, r * 0.9, r * 0.14);
  shape(c, () => polyP(c, pts), "#ebe6da");
  line(c, [[x - r * 0.45, cy - r * 0.3], [x + r * 0.05, cy - r * 0.05], [x - r * 0.25, cy + r * 0.45]], 3, COL.grey);
  line(c, [[x + r * 0.05, cy - r * 0.05], [x + r * 0.55, cy + r * 0.2]], 3, COL.grey);
  for (let k = 0; k < 3; k++) line(c, [[x + r * 0.15, cy - r * 0.6 + k * 10], [x + r * 0.5, cy - r * 0.55 + k * 10]], 2.5, COL.greyDk);
};
// a flat ball of dough after it landed: a splat
const doughFlat = (c: Ctx, x: number, bottom: number, rx: number) => {
  const ry = rx * 0.3, cy = bottom - ry * 0.6;
  shadow(c, x + 10, bottom + 6, rx, ry * 0.5);
  shape(c, () => ell(c, x, cy, rx, ry), DOUGH);
  shade(c, () => ell(c, x, cy, rx, ry), DOUGHDK, -rx * 0.2, -ry * 0.5, 0.5);
  shape(c, () => ell(c, x - rx * 0.1, cy - ry * 0.2, rx * 0.5, ry * 0.3), DOUGHDK, 0);
};
// a clear plastic bottle with its blue cap, standing on (x, bottom)
const bottleStand = (c: Ctx, x: number, bottom: number, w: number, h: number) => {
  const r = w / 2, nk = w * 0.22, sh = bottom - h * 0.72;
  shadow(c, x + 8, bottom + 4, r * 1.1, r * 0.2);
  const body = () => { c.moveTo(x - nk, bottom - h); c.lineTo(x - nk, bottom - h * 0.86); c.quadraticCurveTo(x - r, bottom - h * 0.84, x - r, sh); c.lineTo(x - r, bottom - 14); c.quadraticCurveTo(x - r, bottom, x - r + 14, bottom); c.lineTo(x + r - 14, bottom); c.quadraticCurveTo(x + r, bottom, x + r, bottom - 14); c.lineTo(x + r, sh); c.quadraticCurveTo(x + r, bottom - h * 0.84, x + nk, bottom - h * 0.86); c.lineTo(x + nk, bottom - h); c.closePath(); };
  shape(c, body, COL.glass, 5);
  c.save(); c.beginPath(); body(); c.clip(); shape(c, () => polyP(c, [[x - r, sh + h * 0.12], [x + r, sh + h * 0.12], [x + r, sh + h * 0.36], [x - r, sh + h * 0.36]]), COL.teal, 0); c.restore();
  shape(c, () => rrect(c, x - nk - 6, bottom - h - 30, nk * 2 + 12, 34, 6), COL.blue);
  shine(c, [[x - r * 0.65, sh + h * 0.4], [x - r * 0.65, bottom - h * 0.2]], 7);
};
// a red arrow along an ellipse arc round (cx, cy), from angle a0 to a1 (0 = right, PI/2 = down)
const arcArrow = (c: Ctx, cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, w = 10) => {
  const n = 28, pts: number[][] = [];
  for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
  arrow(c, pts, RED, w);
};
// short lines behind a thing that moves right
const whoosh = (c: Ctx, x: number, y: number, len = 56, gap = 42) => { for (const k of [-1, 0, 1]) line(c, [[x - len, y + k * gap], [x, y + k * gap]], 5, COL.greyDk); };
// a scrape mark under a thing that rubs the floor
const scrape = (c: Ctx, x0: number, x1: number, y: number, n = 10) => { const pts: number[][] = []; for (let i = 0; i <= n; i++) pts.push([x0 + ((x1 - x0) * i) / n, y + (i % 2 ? 10 : 0)]); line(c, pts, 4, INK); };
const dashed = (c: Ctx, pts: number[][], w = 5, col = COL.greyDk) => { c.setLineDash([18, 16]); line(c, pts, w, col); c.setLineDash([]); };
// arm joint angles so the hand (wrist circle) of a person() lands on (tx, ty); shoulder (sx, sy), elbow kept low
const reach = (sx: number, sy: number, tx: number, ty: number, h: number): [number, number] => {
  const l1 = h * 0.17, l2 = h * 0.16, max = l1 + l2 - 2;
  let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy);
  if (d > max) { dx *= max / d; dy *= max / d; d = max; }
  const th = Math.atan2(dy, dx), al = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const pick = (s: number): [number, number] => { const a1 = th + s * al, ex = sx + Math.cos(a1) * l1, ey = sy + Math.sin(a1) * l1; return [a1, Math.atan2(sy + dy - ey, sx + dx - ex)]; };
  const A = pick(1), B = pick(-1);
  return Math.sin(A[0]) >= Math.sin(B[0]) ? A : B;
};
// shoulder of a standing person(): side -1 = their left on screen, +1 = right
const shoulder = (x: number, y: number, h: number, side: number): [number, number] => [x + side * h * 0.11, y - h * 0.74 + h * 0.03];

// ---------------------------------------------------------------- set-up cards: the Roll or Slide Test
// 1. book on the start line, the dabba on its side touching its front
const e1s0 = (c: Ctx) => {
  floor(c, 540);
  tape(c, 290, 560, 1060); tape(c, 400, 560, 1060);
  book(c, 290, 800);
  dabbaRoll(c, 390, 700, 100);
};
// 2. hands slide the book to the stop line; the dabba rolls away
const e1s1 = (c: Ctx) => {
  floor(c, 540);
  tape(c, 290, 560, 1060); tape(c, 400, 560, 1060);
  book(c, 400, 800);
  hand(c, 258, 610, 0, 1.1, SKIN.child, CLOTH.child, true);
  hand(c, 258, 710, 0, 1.1, SKIN.child, CLOTH.child, true);
  arrow(c, [[292, 470], [400, 470]], RED, 9);
  whoosh(c, 590, 700);
  dabbaRoll(c, 740, 700, 100);
  arcArrow(c, 740, 700, 136, 136, Math.PI * 1.12, Math.PI * 1.86);
};
// 3. the dabba standing flat, touching the book at the start line; slips mark where it rolled to before
const e1s2 = (c: Ctx) => {
  floor(c, 540);
  tape(c, 290, 560, 1060); tape(c, 400, 560, 1060);
  slip(c, 860, 850); slip(c, 950, 910);
  book(c, 290, 800);
  dabbaStand(c, 394, 800);
};

// ---------------------------------------------------------------- set-up cards: the Bounce Test
// 1. the five things in a row on a table
const e2s0 = (c: Ctx) => {
  ground(c, WALL);
  table(c, 480, 720, 40, 1040, 1060);
  ball(c, 145, 700, 72, RUBBER, RUBBERDK);
  sockBall(c, 345, 700, 76);
  paperBall(c, 550, 700, 76);
  ball(c, 750, 700, 70, DOUGH, DOUGHDK, 0.08);
  bottleStand(c, 950, 700, 110, 300);
};
// 2. the girl holds the ball at the table edge and lets go; it bounces up from the floor
const e2s1 = (c: Ctx) => {
  floor(c, 600);
  table(c, 640, 676, 640, 1040, 960);
  const [sx, sy] = shoulder(340, 960, 620, 1);
  person(c, 340, 960, 620, { armR: reach(sx, sy, 560, 600, 620) });
  ball(c, 560, 715, 50, RUBBER, RUBBERDK, 0, false);
  dashed(c, [[560, 780], [560, 850]]);
  ball(c, 560, 960, 50, RUBBER, RUBBERDK, 0.2);
  arrow(c, [[605, 890], [640, 790], [650, 700]], RED, 9);
};
// 3. after landing: the dough flat on the floor, the rubber ball high in the air
const e2s2 = (c: Ctx) => {
  floor(c, 500);
  doughFlat(c, 330, 860, 150);
  shadow(c, 760, 864, 70, 14);
  ball(c, 740, 500, 72, RUBBER, RUBBERDK, 0, false);
  arrow(c, [[740, 820], [740, 600]], RED, 10);
};

// ---------------------------------------------------------------- card pictures
// flow.e1: the same dabba rolling far and sliding a little
const fE1 = (c: Ctx) => {
  ground(c, WALL);
  const lane = (base: number) => { c.fillStyle = TILE; c.fillRect(0, base, D, 80); line(c, [[0, base], [D, base]], 5, INK); };
  lane(430); lane(900);
  book(c, 200, 430); dabbaRoll(c, 300, 330, 100);
  arcArrow(c, 300, 330, 136, 136, Math.PI * 1.12, Math.PI * 1.86, 9);
  arrow(c, [[470, 330], [1000, 330]], RED, 11);
  book(c, 200, 900); dabbaStand(c, 304, 900);
  arrow(c, [[430, 820], [560, 820]], RED, 11);
  scrape(c, 220, 400, 906);
};
// flow.e2: how high each of the five things bounced
const fE2 = (c: Ctx) => {
  floor(c, 520);
  ball(c, 130, 900, 58, RUBBER, RUBBERDK);
  arrow(c, [[130, 760], [130, 330]], RED, 10);
  sockBall(c, 330, 900, 62);
  paperBall(c, 530, 900, 62);
  arrow(c, [[530, 760], [530, 690]], RED, 10);
  doughFlat(c, 730, 900, 90);
  bottleStand(c, 930, 900, 92, 250);
  arrow(c, [[930, 610], [930, 540]], RED, 10);
};
// flow.a1: rolling sideways on a dari like a log, arms above the head
const fA1 = (c: Ctx) => {
  ground(c, BG);
  shape(c, () => rrect(c, 60, 320, 960, 560, 16), "#c8603f");
  for (let k = 0; k < 5; k++) { c.fillStyle = k % 2 ? COL.yellow : COL.teal; c.fillRect(66, 360 + k * 100, 948, 26); }
  c.save(); c.translate(800, 600); c.rotate(-Math.PI / 2);
  person(c, 0, 0, 560, { armL: [-Math.PI / 2 - 0.4, -Math.PI / 2 - 0.15], armR: [-Math.PI / 2 + 0.4, -Math.PI / 2 + 0.15] });
  c.restore();
  arcArrow(c, 560, 600, 70, 240, -Math.PI / 2, Math.PI / 2, 10);
};
// flow.a3: the bag swinging on the door handle, the girl giving it a push
const fA3 = (c: Ctx) => {
  floor(c, 980);
  shape(c, () => rrect(c, 280, 40, 440, 950, 8), COL.brown);
  shape(c, () => rrect(c, 330, 100, 340, 300, 8), "#9a6536", 4);
  shape(c, () => rrect(c, 330, 560, 340, 380, 8), "#9a6536", 4);
  shape(c, () => rrect(c, 520, 440, 44, 70, 8), COL.steelDk);
  shape(c, () => rrect(c, 410, 458, 140, 24, 12), COL.steel);
  const px = 470, py = 470;
  c.save(); c.translate(px, py); c.rotate(-0.32);
  line(c, [[-14, 0], [-70, 150]], 18, INK); line(c, [[14, 0], [70, 150]], 18, INK);
  line(c, [[-14, 0], [-70, 150]], 9, COL.teal); line(c, [[14, 0], [70, 150]], 9, COL.teal);
  shape(c, () => rrect(c, -110, 150, 220, 230, 40), COL.teal);
  shade(c, () => rrect(c, -110, 150, 220, 230, 40), COL.tealDk, -40, -30, 0.5);
  shape(c, () => ell(c, 0, 300, 62, 54), "#4cbdb3", 0);
  c.restore();
  const [sx, sy] = shoulder(850, 1000, 560, -1);
  person(c, 850, 1000, 560, { armL: reach(sx, sy, 680, 701, 560) });
  arcArrow(c, px, py, 430, 430, Math.PI / 2 - 0.42, Math.PI / 2 + 0.42, 9);
  arcArrow(c, px, py, 430, 430, Math.PI / 2 + 0.42, Math.PI / 2 - 0.42, 9);
};
// flow.a4: a plate, a pencil and a cap spinning on the floor, a dot at the still middle of each
const fA4 = (c: Ctx) => {
  floor(c, -10);
  plate(c, 430, 540, 260, 120);
  shape(c, () => ell(c, 430, 540, 13, 13), INK, 0);
  arcArrow(c, 430, 540, 330, 170, Math.PI * 0.62, Math.PI * 1.92, 10);
  shadow(c, 250, 880, 46, 16);
  shape(c, () => ell(c, 240, 870, 42, 30), COL.blue);
  shape(c, () => ell(c, 240, 862, 34, 22), COL.blueDk, 3);
  shape(c, () => ell(c, 240, 862, 9, 9), INK, 0);
  arcArrow(c, 240, 866, 80, 56, Math.PI * 0.62, Math.PI * 1.92, 7);
  c.save(); c.translate(810, 790); c.rotate(0.5);
  shadow(c, 10, 22, 160, 14);
  shape(c, () => rrect(c, -150, -14, 300, 28, 4), COL.yellow);
  line(c, [[-146, 0], [146, 0]], 3, COL.orange);
  shape(c, () => polyP(c, [[150, -14], [186, 0], [150, 14]]), COL.wood, 4);
  shape(c, () => ell(c, 183, 0, 5, 5), INK, 0);
  shape(c, () => rrect(c, -170, -14, 28, 28, 4), COL.pink);
  c.restore();
  shape(c, () => ell(c, 810, 790, 11, 11), INK, 0);
  arcArrow(c, 810, 790, 215, 150, Math.PI * 0.62, Math.PI * 1.92, 8);
};
// flow.c1: the bottle taped onto flat cardboard slides when pushed
const fC1 = (c: Ctx) => {
  ground(c, WALL);
  table(c, 480, 800, 40, 1040, 1060);
  shape(c, () => polyP(c, [[330, 700], [830, 700], [870, 760], [370, 760]]), CARD);
  shadow(c, 580, 730, 170, 14);
  const r = 50, cy = 680, x0 = 400, x1 = 720;
  const body = () => { c.moveTo(x0 + 14, cy - r); c.lineTo(x1, cy - r); c.quadraticCurveTo(x1 + 30, cy - r, x1 + 40, cy - 22); c.lineTo(x1 + 60, cy - 22); c.lineTo(x1 + 60, cy + 22); c.lineTo(x1 + 40, cy + 22); c.quadraticCurveTo(x1 + 30, cy + r, x1, cy + r); c.lineTo(x0 + 14, cy + r); c.quadraticCurveTo(x0, cy + r, x0, cy + r - 14); c.lineTo(x0, cy - r + 14); c.quadraticCurveTo(x0, cy - r, x0 + 14, cy - r); c.closePath(); };
  shape(c, body, COL.glass, 5);
  c.save(); c.beginPath(); body(); c.clip(); shape(c, () => polyP(c, [[470, cy - r], [600, cy - r], [600, cy + r], [470, cy + r]]), COL.teal, 0); c.restore();
  shape(c, () => rrect(c, x1 + 58, cy - 26, 36, 52, 6), COL.blue);
  shine(c, [[x0 + 40, cy - r * 0.55], [x1 - 40, cy - r * 0.55]], 7);
  for (const tx of [440, 650]) { c.globalAlpha = 0.85; shape(c, () => polyP(c, [[tx, cy - r - 6], [tx + 30, cy - r - 6], [tx + 30, 748], [tx, 748]]), COL.yellow, 3); c.globalAlpha = 1; }
  hand(c, 254, 716, 0, 1.1, SKIN.child, CLOTH.child, true);
  arrow(c, [[860, 680], [1010, 680]], RED, 11);
};
// term.1 Roll: a ball turning over as it goes along the floor
const tRoll = (c: Ctx) => {
  floor(c, 420);
  whoosh(c, 280, 730, 70, 60);
  ball(c, 480, 880, 150, RUBBER, RUBBERDK);
  arcArrow(c, 480, 730, 200, 200, Math.PI * 1.12, Math.PI * 1.86, 11);
  arrow(c, [[690, 730], [940, 730]], RED, 11);
};
// term.2 Slide: a steel plate pushed along a table, rubbing as it goes
const tSlide = (c: Ctx) => {
  ground(c, WALL);
  table(c, 440, 820, 40, 1040, 1060);
  whoosh(c, 150, 660, 60, 50);
  plate(c, 420, 660, 250, 95);
  scrape(c, 230, 420, 762, 12);
  arrow(c, [[700, 660], [960, 660]], RED, 11);
};
// term.3 Spin: a wooden top turning round on its point
const tSpin = (c: Ctx) => {
  floor(c, 420);
  shadow(c, 560, 866, 90, 18);
  const top = () => { c.moveTo(540, 860); c.quadraticCurveTo(400, 790, 395, 680); c.quadraticCurveTo(400, 560, 540, 545); c.quadraticCurveTo(680, 560, 685, 680); c.quadraticCurveTo(680, 790, 540, 860); c.closePath(); };
  shape(c, () => rrect(c, 522, 486, 36, 70, 8), COL.wood);
  shape(c, top, COL.wood);
  c.save(); c.beginPath(); top(); c.clip();
  c.fillStyle = COL.red; c.fillRect(380, 640, 320, 34); c.fillStyle = COL.teal; c.fillRect(380, 700, 320, 24);
  c.restore();
  shade(c, top, COL.woodDk, -50, -20, 0.5);
  arcArrow(c, 540, 700, 240, 95, Math.PI * 0.88, Math.PI * 0.08, 11);
};
// term.5 Bounce: a rubber ball squashed a little where it meets the floor, springing up
const tBounce = (c: Ctx) => {
  floor(c, 420);
  ball(c, 460, 880, 140, RUBBER, RUBBERDK, 0.22);
  for (const [dx, dy] of [[-200, -30], [-215, 10], [190, -30], [205, 10]]) line(c, [[460 + dx, 880 + dy], [460 + dx * 1.2, 880 + dy * 1.3]], 6, COL.greyDk);
  arrow(c, [[588, 684], [640, 430]], RED, 11);
};

export const ic_motionKindsOfMotionL1 = cards("sci.motion.kinds-of-motion.L1", [e1s0, e1s1, e1s2, e2s0, e2s1, e2s2, fE1, fE2, fA1, fA3, fA4, fC1, tRoll, tSlide, tSpin, tBounce]);
