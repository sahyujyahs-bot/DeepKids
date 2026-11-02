import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, hand, write, cards } from "./flatKit";

// ASKING QUESTIONS L1 · Mystery Dabbas and friends. Same girl (orange frock) and grown-up (blue) on every card.

// ---------------------------------------------------------------- helpers
// two-link arm: angles that put the wrist at (tx, ty) from the shoulder (sx, sy)
const ik = (sx: number, sy: number, tx: number, ty: number, l1: number, l2: number, bend: number): [number, number] => {
  let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy); const mx = l1 + l2 - 2, mn = Math.abs(l1 - l2) + 2;
  if (d > mx) { dx *= mx / d; dy *= mx / d; d = mx; } if (d < mn) { dx *= mn / d; dy *= mn / d; d = mn; }
  const th = Math.atan2(dy, dx), al = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
  const a1 = th + bend * al, ex = sx + Math.cos(a1) * l1, ey = sy + Math.sin(a1) * l1;
  return [a1, Math.atan2(sy + dy - ey, sx + dx - ex)];
};
const geo = (x: number, y: number, h: number, sit = false) => { const head = h * 0.13, hip = sit ? y - h * 0.06 : y - h * 0.42, sh = sit ? hip - h * 0.32 : y - h * 0.74; return { head, hip, sh, hy: sh - head * 1.05, sy: sh + h * 0.03, sl: x - h * 0.11, sr: x + h * 0.11, l1: h * 0.17, l2: h * 0.16, uw: h * 0.06 }; };
const reach = (x: number, y: number, h: number, sit: boolean, side: -1 | 1, tx: number, ty: number, bend = side): [number, number] => { const g = geo(x, y, h, sit); return ik(side < 0 ? g.sl : g.sr, g.sy, tx, ty, g.l1, g.l2, bend); };
// fingers wrapped round a held thing: a skin circle redrawn over the object
const grip = (c: Ctx, x: number, y: number, r: number, skin: string = SKIN.child) => shape(c, () => ell(c, x, y, r, r), skin, 5);
const feetShadow = (c: Ctx, x: number, y: number, h: number) => shadow(c, x + 10, y + 6, h * 0.17, h * 0.03);
const mat = (c: Ctx, x: number, y: number, rx: number, ry: number, col = "#d9a7b8") => { shadow(c, x + 12, y + 10, rx, ry); shape(c, () => ell(c, x, y, rx, ry), col, 5); shape(c, () => ell(c, x, y, rx * 0.85, ry * 0.8), "#e8bfcc", 3); };
// a question mark, top at (x, y), height s
const qmark = (c: Ctx, x: number, y: number, s: number, col = INK, w = s * 0.12) => {
  c.beginPath(); c.arc(x, y + s * 0.28, s * 0.28, Math.PI * 1.05, Math.PI * 0.35); c.lineTo(x, y + s * 0.72); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; c.stroke();
  shape(c, () => ell(c, x, y + s * 0.95, w * 0.55, w * 0.55), col, 0);
};
// a thought bubble with a question mark, bubble centre (x, y), small circles trailing towards (fx, fy)
const thoughtQ = (c: Ctx, x: number, y: number, r: number, fx: number, fy: number) => {
  for (let i = 1; i <= 3; i++) { const t = i / 4; shape(c, () => ell(c, fx + (x - fx) * t, fy + (y - fy) * t, r * 0.08 * (i + 1), r * 0.08 * (i + 1)), WHITE, 5); }
  shape(c, () => ell(c, x, y, r, r * 0.8), WHITE, 6); qmark(c, x, y - r * 0.5, r);
};
// a steel dabba: top rim centre (x, y), radius r, height hh. open = lid off, the inside visible
const dabba = (c: Ctx, x: number, y: number, r: number, hh: number, o: { label?: string; open?: boolean; inside?: () => void } = {}) => {
  const ry = r * 0.32;
  shadow(c, x + r * 0.18, y + hh + 6, r * 1.08, ry);
  const body = () => { c.moveTo(x - r, y); c.lineTo(x - r, y + hh); c.ellipse(x, y + hh, r, ry, 0, Math.PI, 0, true); c.lineTo(x + r, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, r * 0.55, 0);
  shine(c, [[x - r * 0.72, y + hh * 0.25], [x - r * 0.72, y + hh * 0.75]], 8);
  if (o.open) {
    shape(c, () => ell(c, x, y, r, ry), COL.steelDk);
    if (o.inside) { c.save(); c.beginPath(); ell(c, x, y, r - 3, ry - 2); c.clip(); o.inside(); c.restore(); }
    c.beginPath(); ell(c, x, y, r, ry); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  } else {
    const lid = () => { c.moveTo(x - r - 7, y - 18); c.lineTo(x - r - 7, y); c.ellipse(x, y, r + 7, ry * 1.05, 0, Math.PI, 0, true); c.lineTo(x + r + 7, y - 18); c.closePath(); };
    shape(c, lid, COL.steel); shade(c, lid, COL.steelDk, r * 0.55, 0);
    shape(c, () => ell(c, x, y - 18, r + 7, ry * 1.05), COL.steelIn);
    shape(c, () => ell(c, x, y - 18, r * 0.3, ry * 0.3), COL.steel, 4);
  }
  if (o.label) { const s = r * 0.62; shape(c, () => rrect(c, x - s / 2, y + hh * 0.3, s, s, 6), COL.paper, 4); write(c, o.label, x - s * 0.22, y + hh * 0.3 + s * 0.17, s * 0.66, INK, 6); }
};
const lemon = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.82, -0.3), COL.yellow); shade(c, () => ell(c, x, y, r, r * 0.82, -0.3), COL.orange, r * 0.3, r * 0.15, 0.45); shape(c, () => ell(c, x + r * 0.92, y - r * 0.28, r * 0.16, r * 0.12, -0.3), COL.green, 4); };
const cotton = (c: Ctx, x: number, y: number, r: number) => { for (const [dx, dy, k] of [[-0.55, 0.1, 0.6], [0.55, 0.1, 0.6], [0, -0.45, 0.62], [0, 0.4, 0.55], [0, 0, 0.75]]) shape(c, () => ell(c, x + dx * r, y + dy * r, r * k, r * k * 0.95), WHITE, 5); };
const riceHeap = (c: Ctx, x: number, y: number, w: number, hh: number, seed: number) => { const r = rnd(seed); shape(c, () => { c.moveTo(x - w, y); c.quadraticCurveTo(x, y - hh * 2, x + w, y); c.closePath(); }, "#f3ecd8", 5); for (let i = 0; i < 40; i++) { const t = r(), u = r(); const gx = x - w + t * 2 * w, top = y - Math.sin(t * Math.PI) * hh * 0.95; shape(c, () => ell(c, gx, top + u * (y - top - 4), 7, 4, r() * 3), WHITE, 2); } };
const coin = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.yellow, 5); shape(c, () => ell(c, x, y, r * 0.72, r * 0.72), COL.wood, 3); write(c, "1", x - r * 0.25, y - r * 0.4, r * 0.8, INK, 5); };
// a shake: two red arrows pointing out from a held thing at (x, y)
const shake = (c: Ctx, x: number, y: number, s = 1) => { arrow(c, [[x + 55 * s, y], [x + 110 * s, y]], RED, 9); arrow(c, [[x - 55 * s, y], [x - 110 * s, y]], RED, 9); };
const paperSlip = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0, lines = 2) => { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 6), COL.paper, 5); for (let i = 0; i < lines; i++) line(c, [[-w * 0.32, -h * 0.2 + i * h * 0.3], [w * 0.32 - (i % 2) * w * 0.2, -h * 0.2 + i * h * 0.3]], 4, COL.greyDk); c.restore(); };
const pencil = (c: Ctx, x: number, y: number, len: number, an: number) => { c.save(); c.translate(x, y); c.rotate(an); shape(c, () => rrect(c, 0, -9, len, 18, 4), COL.yellow, 5); shape(c, () => polyP(c, [[0, -9], [-22, 0], [0, 9]]), COL.wood, 4); shape(c, () => polyP(c, [[-22, 0], [-14, -3.5], [-14, 3.5]]), INK, 0); c.restore(); };

// ---------------------------------------------------------------- set-up cards (experiment e1)
// 1. a grown-up, back turned, drops a lemon into one dabba; rice and a cotton ball wait beside two more
const setup0 = (c: Ctx) => {
  ground(c);
  const x = 300, y = 1010, h = 820, g = geo(x, y, h);
  person(c, x, y, h, { adult: true, armR: reach(x, y, h, false, 1, 505, 420), armL: reach(x, y, h, false, -1, 190, 640) });
  shape(c, () => ell(c, x, g.hy, g.head * 1.02, g.head * 1.07), CLOTH.hair, 6);
  shape(c, () => ell(c, x, g.hy - g.head * 0.15, g.head * 0.42, g.head * 0.42), CLOTH.hair, 5);
  shape(c, () => polyP(c, [[0, 600], [D, 600], [D, 720], [0, 720]]), COL.wood);
  shape(c, () => polyP(c, [[0, 720], [D, 720], [D, D], [0, D]]), COL.woodDk);
  const inRice = () => riceHeap(c, 720, 690, 90, 45, 3);
  dabba(c, 520, 490, 90, 150, { open: true, inside: () => { shape(c, () => ell(c, 520, 490, 90, 29), COL.steelDk, 0); } });
  lemon(c, 505, 390, 50); grip(c, 505, 420, g.uw * 0.62, SKIN.adult);
  arrow(c, [[590, 380], [590, 470]]);
  dabba(c, 780, 490, 80, 150); dabba(c, 985, 490, 80, 150);
  inRice(); cotton(c, 930, 690, 42);
};
// 2. the girl shakes dabba 2 next to her ear; dabbas 1 and 3 wait on the floor
const setup1 = (c: Ctx) => {
  ground(c);
  mat(c, 540, 900, 500, 120);
  const x = 430, y = 850, h = 700;
  person(c, x, y, h, { sit: true, armR: reach(x, y, h, true, 1, 605, 495), armL: reach(x, y, h, true, -1, 560, 780, 1) });
  dabba(c, 660, 420, 70, 110, { label: "2" }); grip(c, 605, 495, 26);
  shake(c, 660, 350);
  dabba(c, 180, 790, 70, 110, { label: "1" }); dabba(c, 860, 790, 70, 110, { label: "3" });
};
// 3. one dabba in each hand, arms out like a scale, a puzzled face
const setup2 = (c: Ctx) => {
  ground(c);
  mat(c, 540, 985, 480, 70);
  const x = 540, y = 980, h = 760, g = geo(x, y, h);
  feetShadow(c, x, y, h);
  person(c, x, y, h, { armL: reach(x, y, h, false, -1, 262, 455), armR: reach(x, y, h, false, 1, 818, 455) });
  dabba(c, 240, 395, 72, 110, { label: "1" }); grip(c, 262, 455, g.uw * 0.62);
  dabba(c, 840, 395, 72, 110, { label: "2" }); grip(c, 818, 455, g.uw * 0.62);
  line(c, [[x - g.head * 0.55, g.hy - g.head * 0.2], [x - g.head * 0.18, g.hy - g.head * 0.3]], 5); line(c, [[x + g.head * 0.18, g.hy - g.head * 0.3], [x + g.head * 0.55, g.hy - g.head * 0.12]], 5);
  qmark(c, x + 150, 60, 150);
  dabba(c, 900, 870, 60, 95, { label: "3" });
};
// 4. the three dabbas open: rice, a lemon, a cotton ball; the girl points at her drawing of her guesses
const setup3 = (c: Ctx) => {
  ground(c);
  mat(c, 540, 840, 520, 110);
  const x = 790, y = 640, h = 600;
  person(c, x, y, h, { sit: true, armL: reach(x, y, h, true, -1, 520, 330), armR: reach(x, y, h, true, 1, 880, 560, 1) });
  shape(c, () => rrect(c, 110, 150, 370, 360, 12), COL.paper, 6);
  const r = rnd(5); for (let i = 0; i < 18; i++) shape(c, () => ell(c, 165 + r() * 90, 215 + r() * 60, 7, 4, r() * 3), COL.grey, 2.5);
  shape(c, () => ell(c, 210, 350, 42, 36), COL.yellow, 5); cotton(c, 210, 455, 28);
  for (const ty of [240, 350, 455]) line(c, [[340, ty], [370, ty + 30], [430, ty - 35]], 9, COL.green);
  const lid = (lx: number, ly: number) => { shadow(c, lx + 10, ly + 8, 90, 28); shape(c, () => ell(c, lx, ly, 90, 28), COL.steel); shape(c, () => ell(c, lx, ly - 6, 82, 24), COL.steelIn, 4); };
  lid(300, 690); lid(640, 690); lid(980, 690);
  const r2 = rnd(9);
  dabba(c, 200, 720, 95, 140, { open: true, label: "1", inside: () => { shape(c, () => ell(c, 200, 720, 95, 30), "#f3ecd8", 0); for (let i = 0; i < 50; i++) shape(c, () => ell(c, 120 + r2() * 160, 700 + r2() * 40, 7, 4, r2() * 3), WHITE, 2); } });
  dabba(c, 540, 720, 95, 140, { open: true, label: "2", inside: () => lemon(c, 540, 725, 58) });
  dabba(c, 880, 720, 95, 140, { open: true, label: "3", inside: () => cotton(c, 880, 722, 38) });
};

// ---------------------------------------------------------------- card pictures
// flow.e1: the girl shakes a dabba at her ear while the grown-up writes down the clue
const flowE1 = (c: Ctx) => {
  ground(c);
  mat(c, 620, 920, 440, 110);
  const ax = 190, ay = 1010, ah = 820, ag = geo(ax, ay, ah);
  feetShadow(c, ax, ay, ah);
  person(c, ax, ay, ah, { adult: true, armL: reach(ax, ay, ah, false, -1, 250, 640, 1), armR: reach(ax, ay, ah, false, 1, 340, 650) });
  paperSlip(c, 280, 600, 120, 150, -0.1, 3); grip(c, 250, 640, ag.uw * 0.62, SKIN.adult); pencil(c, 340, 650, 90, -1.2); grip(c, 340, 650, ag.uw * 0.62, SKIN.adult);
  const x = 560, y = 880, h = 700;
  person(c, x, y, h, { sit: true, armR: reach(x, y, h, true, 1, 735, 525), armL: reach(x, y, h, true, -1, 690, 810, 1) });
  dabba(c, 790, 450, 70, 110, { label: "2" }); grip(c, 735, 525, 26);
  shake(c, 790, 380);
  dabba(c, 960, 860, 60, 95, { label: "3" }); dabba(c, 440, 950, 60, 95, { label: "1" });
};
// flow.a2: a wonder walk: the girl points at the ceiling fan, the grown-up writes her question on a slip
const flowA2 = (c: Ctx) => {
  ground(c);
  line(c, [[540, 0], [540, 110]], 14); shape(c, () => ell(c, 540, 130, 44, 30), COL.greyDk);
  for (const an of [-0.1, 0.95, 2.1]) { c.save(); c.translate(540, 140); c.scale(1, 0.42); c.rotate(an); shape(c, () => rrect(c, 40, -34, 260, 68, 30), COL.brown, 6); c.restore(); }
  shape(c, () => ell(c, 540, 140, 30, 20), COL.grey, 5);
  const x = 310, y = 1000, h = 720, g = geo(x, y, h);
  feetShadow(c, x, y, h);
  person(c, x, y, h, { armR: reach(x, y, h, false, 1, 520, 330, -1), armL: reach(x, y, h, false, -1, 230, 700) });
  line(c, [[520, 330], [565, 265]], 22, INK); line(c, [[520, 330], [565, 265]], 12, SKIN.child);
  qmark(c, 150, 90, 130);
  const ax = 800, ay = 1010, ah = 820, ag = geo(ax, ay, ah);
  feetShadow(c, ax, ay, ah);
  person(c, ax, ay, ah, { adult: true, armL: reach(ax, ay, ah, false, -1, 672, 585, 1), armR: reach(ax, ay, ah, false, 1, 760, 555) });
  paperSlip(c, 700, 540, 150, 110, 0.05, 2); grip(c, 672, 585, ag.uw * 0.62, SKIN.adult); pencil(c, 762, 548, 90, -1.1); grip(c, 762, 550, ag.uw * 0.62, SKIN.adult);
  void g;
};
// flow.a3: on the sofa, the girl asks and the grown-up explains, one hand raised
const flowA3 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 990, 480, 40);
  shape(c, () => rrect(c, 80, 400, 920, 320, 50), COL.teal); shade(c, () => rrect(c, 80, 400, 920, 320, 50), COL.tealDk, 40, 0);
  shape(c, () => rrect(c, 80, 700, 920, 280, 40), COL.teal); shade(c, () => rrect(c, 80, 700, 920, 280, 40), COL.tealDk, 0, 60, 0.5);
  const x = 380, y = 880, h = 620;
  person(c, x, y, h, { sit: true, armL: reach(x, y, h, true, -1, 300, 760, 1), armR: reach(x, y, h, true, 1, 470, 770, 1) });
  const ax = 740, ay = 880, ah = 760;
  person(c, ax, ay, ah, { sit: true, adult: true, armR: reach(ax, ay, ah, true, 1, 930, 470), armL: reach(ax, ay, ah, true, -1, 640, 760, 1) });
  shape(c, () => rrect(c, 30, 640, 100, 320, 40), COL.tealDk); shape(c, () => rrect(c, 950, 640, 100, 320, 40), COL.tealDk);
  thoughtQ(c, 330, 170, 95, 400, 360);
};
// flow.p1: the Wonder Jar: folded question slips in a glass jar, a hand lifting one out
const flowP1 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[0, 940], [D, 940], [D, D], [0, D]]), COL.wood);
  shadow(c, 570, 935, 260, 36);
  const jar = () => rrect(c, 330, 380, 420, 550, 60);
  shape(c, jar, "#dbeefb", 6);
  const r = rnd(21);
  c.save(); c.beginPath(); jar(); c.clip();
  for (let i = 0; i < 12; i++) paperSlip(c, 400 + r() * 280, 560 + r() * 320, 120, 60, r() * 3, 1);
  c.restore();
  c.beginPath(); jar(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  shine(c, [[370, 440], [370, 850]], 10);
  shape(c, () => rrect(c, 310, 320, 460, 70, 18), COL.glassEdge, 6);
  shape(c, () => ell(c, 540, 320, 230, 30), "#dbeefb", 6);
  paperSlip(c, 650, 190, 150, 70, -0.5, 1);
  hand(c, 800, 290, -2.3, 1.5);
  arrow(c, [[430, 300], [430, 150]]);
};
// flow.c1: count the coins: a closed dabba with a secret, an open one you fill with coins to match
const flowC1 = (c: Ctx) => {
  ground(c);
  mat(c, 540, 860, 500, 120, "#c9d9b8");
  dabba(c, 290, 560, 115, 180); qmark(c, 290, 610, 110, INK, 14);
  dabba(c, 760, 560, 115, 180, { open: true, inside: () => { coin(c, 735, 560, 30); coin(c, 790, 568, 30); } });
  const r = rnd(4); for (let i = 0; i < 6; i++) coin(c, 900 + (i % 3) * 50 - 20, 920 - Math.floor(i / 3) * 40 + r() * 6, 30);
  arrow(c, [[880, 830], [800, 640]]);
};
// term.0 Question: the girl points at a whistling pressure cooker and wonders why
const term0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 420, 720, 600, 70, 14), COL.black); shape(c, () => ell(c, 720, 720, 150, 24), COL.greyDk, 5);
  const cx = 720, top = 480;
  dabba(c, cx, top, 150, 230, { open: true, inside: () => shape(c, () => ell(c, cx, top, 150, 48), COL.steel, 0) });
  shape(c, () => { c.moveTo(cx - 150, top); c.bezierCurveTo(cx - 120, top - 90, cx + 120, top - 90, cx + 150, top); c.closePath(); }, COL.steel);
  shape(c, () => rrect(c, cx - 36, top - 120, 72, 54, 12), COL.black, 5);
  shape(c, () => rrect(c, cx + 120, top + 50, 220, 36, 14), COL.black, 5);
  const r = rnd(2); for (let i = 0; i < 4; i++) { const px = cx + 20 + i * 38, py = top - 170 - i * 70; shape(c, () => ell(c, px, py, 42 + i * 10, 34 + i * 8), WHITE, 5); }
  for (let i = 0; i < 3; i++) line(c, [[cx + 90 + i * 30, top - 150 - i * 20], [cx + 130 + i * 30, top - 190 - i * 20]], 5, COL.greyDk);
  const x = 250, y = 1000, h = 680;
  feetShadow(c, x, y, h);
  person(c, x, y, h, { armR: reach(x, y, h, false, 1, 460, 560, -1), armL: reach(x, y, h, false, -1, 190, 700) });
  line(c, [[460, 560], [520, 530]], 22, INK); line(c, [[460, 560], [520, 530]], 12, SKIN.child);
  qmark(c, 250, 120, 150);
  void r;
};
// term.2 Clue: wet footprints on a tiled floor, from the bathroom door to a towel on a chair
const term2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#f4ece0"; c.fillRect(0, 0, D, D);
  c.strokeStyle = "#cdbfae"; c.lineWidth = 4; for (let k = 0; k <= D; k += 135) { c.beginPath(); c.moveTo(k, 0); c.lineTo(k, D); c.stroke(); c.beginPath(); c.moveTo(0, k); c.lineTo(D, k); c.stroke(); }
  shape(c, () => rrect(c, 40, 60, 250, 720, 10), COL.brown, 6); shape(c, () => rrect(c, 70, 90, 150, 660, 6), COL.sky, 5);
  shape(c, () => ell(c, 250, 420, 14, 14), COL.yellow, 4);
  shape(c, () => rrect(c, 800, 300, 190, 260, 16), COL.wood, 6); shape(c, () => rrect(c, 770, 540, 250, 60, 12), COL.wood, 6);
  for (const lx of [790, 990]) line(c, [[lx, 600], [lx, 800]], 16, INK);
  shape(c, () => rrect(c, 830, 320, 130, 330, 14), COL.pink, 6); for (let i = 0; i < 6; i++) line(c, [[840 + i * 22, 650], [840 + i * 22, 690]], 4, COL.pink);
  const foot = (fx: number, fy: number, an: number, flip: number) => { c.save(); c.translate(fx, fy); c.rotate(an); shape(c, () => ell(c, 0, 0, 30, 58), COL.waterDk, 4); for (let i = 0; i < 5; i++) shape(c, () => ell(c, (i - 2) * 13 * flip, -72 + Math.abs(i - 1.5) * 5, 8 - i * 0.8, 9 - i * 0.8), COL.waterDk, 3); c.restore(); };
  const path: number[][] = [[330, 760], [420, 640], [500, 720], [590, 600], [680, 680], [770, 760]];
  path.forEach(([px, py], i) => { const nx = path[Math.min(i + 1, path.length - 1)][0], ny = path[Math.min(i + 1, path.length - 1)][1]; const an = Math.atan2(ny - py, nx - px) + Math.PI / 2; foot(px, py, an, i % 2 ? 1 : -1); });
  for (const [dx, dy] of [[380, 700], [550, 650], [700, 740]]) shape(c, () => ell(c, dx, dy, 10, 7), COL.water, 3);
};
// term.3 Scientist: a woman in a lab coat and the girl, both shaking closed boxes and listening
const term3 = (c: Ctx) => {
  ground(c);
  mat(c, 540, 1000, 520, 60, "#c9d9b8");
  const ax = 330, ay = 1000, ah = 820, ag = geo(ax, ay, ah);
  feetShadow(c, ax, ay, ah);
  const aL = reach(ax, ay, ah, false, -1, 230, 700), aR = reach(ax, ay, ah, false, 1, 455, 335);
  person(c, ax, ay, ah, { adult: true, armL: aL, armR: aR });
  shape(c, () => rrect(c, ax - ah * 0.14, ag.sh + 4, ah * 0.28, ag.hip - ag.sh + ah * 0.06, ah * 0.05), WHITE, 6);
  shape(c, () => polyP(c, [[ax - 40, ag.sh + 4], [ax + 40, ag.sh + 4], [ax, ag.sh + 90]]), CLOTH.adult, 5); line(c, [[ax, ag.sh + 90], [ax, ag.hip + 40]], 4, COL.grey);
  const sleeve = (sx: number, [a1, a2]: [number, number]) => { const ex = sx + Math.cos(a1) * ag.l1, ey = ag.sy + Math.sin(a1) * ag.l1, wx = ex + Math.cos(a2) * ag.l2, wy = ey + Math.sin(a2) * ag.l2; line(c, [[sx, ag.sy], [ex, ey], [wx, wy]], ag.uw + 10, INK); line(c, [[sx, ag.sy], [ex, ey], [wx, wy]], ag.uw, WHITE); shape(c, () => ell(c, wx, wy, ag.uw * 0.62, ag.uw * 0.62), SKIN.adult, 5); };
  sleeve(ag.sl, aL); sleeve(ag.sr, aR);
  const box = (bx: number, by: number, s: number) => { shadow(c, bx + 8, by + s * 0.6, s * 0.7, s * 0.15); shape(c, () => rrect(c, bx - s / 2, by - s / 2, s, s, 8), COL.wood, 6); shade(c, () => rrect(c, bx - s / 2, by - s / 2, s, s, 8), COL.woodDk, s * 0.4, 0); line(c, [[bx - s / 2, by - s * 0.2], [bx + s / 2, by - s * 0.2]], 5); };
  box(500, 290, 110); grip(c, 455, 335, ag.uw * 0.62, SKIN.adult); shake(c, 500, 200);
  const x = 760, y = 1000, h = 680, g = geo(x, y, h);
  feetShadow(c, x, y, h);
  person(c, x, y, h, { armR: reach(x, y, h, false, 1, 865, 440), armL: reach(x, y, h, false, -1, 690, 700) });
  box(910, 400, 100); grip(c, 865, 440, g.uw * 0.62); shake(c, 910, 320);
};
// expl.2 Clues: three shut dabbas, and what the shake tells you: rain-like grains, one round thing, something soft
const expl2 = (c: Ctx) => {
  ground(c);
  mat(c, 540, 870, 520, 110, "#c9d9b8");
  dabba(c, 200, 660, 95, 150, { label: "1" }); dabba(c, 540, 660, 95, 150, { label: "2" }); dabba(c, 880, 660, 95, 150, { label: "3" });
  for (const bx of [200, 540, 880]) shape(c, () => ell(c, bx, 330, 150, 130), WHITE, 6);
  for (let i = 0; i < 6; i++) line(c, [[150 + i * 22, 270 + (i % 2) * 20], [130 + i * 22, 330 + (i % 2) * 20]], 7, COL.blue);
  const r = rnd(8); for (let i = 0; i < 14; i++) shape(c, () => ell(c, 120 + r() * 160, 370 + r() * 40, 8, 5, r() * 3), COL.grey, 2.5);
  lemon(c, 540, 330, 62);
  cotton(c, 880, 330, 48);
  for (const bx of [200, 540, 880]) shake(c, bx, 585, 0.9);
};
// expl.0 Wondering: C. V. Raman at a ship's rail, looking at the deep blue sea and asking why
const expl0 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 420);
  shape(c, () => ell(c, 900, 120, 70, 70), COL.yellow, 5);
  c.fillStyle = "#1f4e9a"; c.fillRect(0, 420, D, 500);
  line(c, [[0, 420], [D, 420]], 6);
  for (let i = 0; i < 7; i++) { const wy = 470 + i * 60; line(c, [[60 + (i % 2) * 120, wy], [200 + (i % 2) * 120, wy]], 7, "#5b8fd6"); line(c, [[520 + (i % 3) * 100, wy + 20], [680 + (i % 3) * 100, wy + 20], ], 7, "#5b8fd6"); }
  shape(c, () => polyP(c, [[0, 900], [D, 900], [D, D], [0, D]]), COL.wood);
  for (const px of [120, 540, 960]) line(c, [[px, 560], [px, 900]], 16, COL.grey);
  line(c, [[0, 660], [D, 660]], 14, COL.grey);
  const x = 420, y = 980, h = 820, g = geo(x, y, h);
  person(c, x, y, h, { adult: true, armL: reach(x, y, h, false, -1, 280, 560), armR: reach(x, y, h, false, 1, 560, 560) });
  line(c, [[0, 560], [D, 560]], 22, INK); line(c, [[0, 560], [D, 560]], 14, COL.grey);
  grip(c, 280, 560, g.uw * 0.62, SKIN.adult); grip(c, 560, 560, g.uw * 0.62, SKIN.adult);
  shape(c, () => ell(c, x, g.hy - g.head * 0.45, g.head * 1.12, g.head * 0.72), "#f7e3b0", 6);
  for (let i = 0; i < 3; i++) line(c, [[x - g.head * 0.9 + i * 20, g.hy - g.head * 0.3 - i * 18], [x + g.head * 0.9 - i * 20, g.hy - g.head * 0.75 - i * 12]], 4, COL.woodDk);
  line(c, [[x - 50, g.sh + 10], [x, g.sh + 120], [x + 50, g.sh + 10]], 8, WHITE);
  thoughtQ(c, 780, 190, 100, 520, 300);
};

export const ic_howWeKnowAskingQuestionsL1 = cards("sci.how-we-know.asking-questions.L1", [
  setup0, setup1, setup2, setup3,
  flowE1, flowA2, flowA3, flowP1, flowC1, term0, term2, term3, expl2, expl0,
]);
