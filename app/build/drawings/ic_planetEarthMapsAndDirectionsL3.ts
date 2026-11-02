import type { Ctx } from "./core";
import { INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, rrect, polyP, shadow, shade, line, arrow, hand, person, glass, write, cards } from "./flatKit";

// CARDS · sci.planet-earth.maps-and-directions.L3: intro, summary, terms, explanations, activities.

const TILE_A = "#fbf3df", TILE_B = "#efdcb8", PL = "#9fc7e6", PINK = COL.pink;
const rect = (c: Ctx, x: number, y: number, w: number, h: number) => c.rect(x, y, w, h);
const tiles = (c: Ctx, x: number, y: number, cols: number, rows: number, t: number) => {
  for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) shape(c, () => rect(c, x + k * t, y + r * t, t, t), (r + k) % 2 ? TILE_B : TILE_A, 4);
};
const gridPaper = (c: Ctx, x: number, y: number, w: number, h: number, step: number, col: string = COL.paper, rot = 0) => {
  c.save(); if (rot) { c.translate(x + w / 2, y + h / 2); c.rotate(rot); c.translate(-(x + w / 2), -(y + h / 2)); }
  shadow(c, x + w / 2 + 14, y + h + 8, w / 2, 20);
  shape(c, () => rect(c, x, y, w, h), col, 6);
  c.save(); c.beginPath(); rect(c, x, y, w, h); c.clip();
  for (let gx = x + step; gx < x + w; gx += step) line(c, [[gx, y], [gx, y + h]], 2.5, PL);
  for (let gy = y + step; gy < y + h; gy += step) line(c, [[x, gy], [x + w, gy]], 2.5, PL);
  c.restore();
  shape(c, () => rect(c, x, y, w, h), "rgba(0,0,0,0)", 6);
  c.restore();
};
const coin = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.2, y + r * 0.35, r, r * 0.4);
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
  shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.3, r * 0.3, 0.5);
  shape(c, () => ell(c, x, y, r * 0.62, r * 0.62), "rgba(0,0,0,0)", 3.5);
};
const cross = (c: Ctx, x: number, y: number, r: number, w = 12) => { line(c, [[x - r, y - r], [x + r, y + r]], w, RED); line(c, [[x + r, y - r], [x - r, y + r]], w, RED); };
const dotted = (c: Ctx, pts: number[][], w = 10) => { c.setLineDash([2, w * 2.2]); line(c, pts, w + 2, RED); c.setLineDash([]); };
const LETTER: Record<string, number[][][]> = {
  N: [[[0, 1], [0, 0], [0.6, 1], [0.6, 0]]],
  E: [[[0.6, 0], [0, 0], [0, 1], [0.6, 1]], [[0, 0.5], [0.45, 0.5]]],
  S: [[[0.6, 0.12], [0.3, 0], [0, 0.2], [0.3, 0.5], [0.6, 0.8], [0.3, 1], [0, 0.88]]],
  W: [[[0, 0], [0.15, 1], [0.3, 0.4], [0.45, 1], [0.6, 0]]],
};
const badge = (c: Ctx, x: number, y: number, ch: string, lit = false, R = 44) => {
  shadow(c, x + 8, y + R * 0.8, R * 0.9, R * 0.22);
  shape(c, () => ell(c, x, y, R, R), lit ? COL.yellow : WHITE, 6);
  const h = R; c.strokeStyle = INK; c.lineWidth = R * 0.18; c.lineCap = "round"; c.lineJoin = "round";
  LETTER[ch].forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(x - h * 0.4 + u * h, y - h * 0.5 + v * h) : c.moveTo(x - h * 0.4 + u * h, y - h * 0.5 + v * h))); c.stroke(); });
};
const pencil = (c: Ctx, x: number, y: number, an: number, len: number) => {
  c.save(); c.translate(x, y); c.rotate(an); const hw = 20;
  shape(c, () => rrect(c, -len / 2, -hw, len, hw * 2, 6), COL.yellow);
  shade(c, () => rrect(c, -len / 2, -hw, len, hw * 2, 6), COL.orange, 0, 14, 0.55);
  shape(c, () => rrect(c, -len / 2 - 26, -hw, 30, hw * 2, 8), PINK);
  shape(c, () => polyP(c, [[len / 2, -hw], [len / 2 + 62, 0], [len / 2, hw]]), COL.woodDk);
  shape(c, () => polyP(c, [[len / 2 + 46, -6], [len / 2 + 62, 0], [len / 2 + 46, 6]]), COL.black, 3);
  c.restore();
};
const pointHand = (c: Ctx, x: number, y: number, an: number, s: number, skin: string = SKIN.child, sleeve: string = CLOTH.child) => {
  hand(c, x, y, an, s, skin, sleeve);
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s); shape(c, () => rrect(c, 34, -30, 116, 18, 9), skin, 5); c.restore();
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], r * 0.16, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow); shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.25, r * 0.25, 0.5);
};
// things seen from above
const bedTop = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 8), COL.blue); shade(c, () => rrect(c, x, y, w, h, 8), COL.blueDk, 8, 8, 0.5);
  shape(c, () => rrect(c, x + w * 0.1, y + h * 0.06, w * 0.8, h * 0.22, 10), WHITE, 4);
};
const treeTop = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.green); shade(c, () => ell(c, x, y, r, r), COL.greenDk, r * 0.25, r * 0.25, 0.55); shape(c, () => ell(c, x - r * 0.15, y - r * 0.15, r * 0.25, r * 0.25), COL.greenLt, 0); };
// walls of a room from above, with a gap (door) in one side: side 'b' bottom, 'l' left etc.
const roomBox = (c: Ctx, x: number, y: number, w: number, h: number, gap?: { side: "t" | "b" | "l" | "r"; at: number; len: number }, fill = COL.paper, lw = 14) => {
  shape(c, () => rect(c, x, y, w, h), fill, 0);
  c.save(); c.lineCap = "butt"; c.lineJoin = "miter";
  const seg = (a: number[], b: number[]) => line(c, [a, b], lw);
  const sides: Record<string, number[][]> = { t: [[x, y], [x + w, y]], b: [[x, y + h], [x + w, y + h]], l: [[x, y], [x, y + h]], r: [[x + w, y], [x + w, y + h]] };
  for (const s of ["t", "b", "l", "r"]) {
    const [a, b] = sides[s];
    if (gap && gap.side === s) {
      const hor = s === "t" || s === "b", L = hor ? w : h, g0 = gap.at * L, g1 = g0 + gap.len;
      const p = (u: number) => (hor ? [a[0] + u, a[1]] : [a[0], a[1] + u]);
      seg(a, p(g0)); seg(p(g1), b);
    } else seg(a, b);
  }
  c.restore();
};
// north arrow (corner of a map)
const northArrow = (c: Ctx, x: number, y: number, s = 1) => {
  shape(c, () => polyP(c, [[x, y - 70 * s], [x + 26 * s, y + 20 * s], [x, y + 4 * s], [x - 26 * s, y + 20 * s]]), RED, 5);
  c.save(); c.strokeStyle = INK; c.lineWidth = 7 * s; c.lineCap = "round"; c.lineJoin = "round"; const h = 44 * s;
  LETTER.N.forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(x - h * 0.3 + u * h, y + 40 * s + v * h) : c.moveTo(x - h * 0.3 + u * h, y + 40 * s + v * h))); c.stroke(); });
  c.restore();
};
const wall = (c: Ctx, hy: number) => { c.fillStyle = "#f7e6c4"; c.fillRect(0, 0, 1080, hy); c.fillStyle = TILE_B; c.fillRect(0, hy, 1080, 1080 - hy); line(c, [[0, hy], [1080, hy]], 8); };
const floorLines = (c: Ctx, hy: number, vx: number, vy: number) => {
  c.save(); c.beginPath(); rect(c, 0, hy, 1080, 1080 - hy); c.clip();
  for (let i = -8; i <= 18; i++) line(c, [[vx + (i * 90 - vx) * 0.0 + (i * 90 - vx) * 0.0 + vx * 0, vy], [i * 190 - 1500 + vx * 1.6, 1200]], 3, "#d7bf93");
  let y = hy + 40, st = 40; while (y < 1100) { line(c, [[0, y], [1080, y]], 3, "#d7bf93"); st *= 1.35; y += st; }
  c.restore();
};
const topFigure = (c: Ctx, x: number, y: number, rot: number, s = 1) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); // facing -y
  shadow(c, 10, 14, 62, 40);
  for (const sx of [-1, 1]) shape(c, () => ell(c, sx * 20, -52, 15, 24), INK, 0);
  shape(c, () => ell(c, 0, 8, 62, 28), CLOTH.child);
  shade(c, () => ell(c, 0, 8, 62, 28), CLOTH.childDk, 14, 10, 0.6);
  shape(c, () => ell(c, 0, 4, 34, 34), CLOTH.hair, 6);
  c.restore();
};
const crow = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => { c.moveTo(-40, -10); c.quadraticCurveTo(-130, -120, -230, -60); c.quadraticCurveTo(-150, -20, -70, 40); c.closePath(); }, "#4a4458", 7);
  shape(c, () => { c.moveTo(-40, -10); c.quadraticCurveTo(-60, -170, 10, -230); c.quadraticCurveTo(30, -130, 40, 0); c.closePath(); }, "#4a4458", 7);
  shape(c, () => { c.moveTo(-170, 30); c.lineTo(-250, 70); c.lineTo(-240, 30); c.lineTo(-250, -5); c.closePath(); }, COL.black, 6);
  shape(c, () => ell(c, -40, 20, 150, 62, 0.15), COL.black);
  shape(c, () => ell(c, 125, -8, 56, 48), COL.black);
  shape(c, () => polyP(c, [[165, -22], [250, 5], [165, 18]]), COL.grey, 6);
  shape(c, () => ell(c, 135, -22, 11, 11), WHITE, 3); shape(c, () => ell(c, 138, -22, 5, 5), INK, 0);
  c.restore();
};
const symTree = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.green, 5); shape(c, () => ell(c, x, y, r * 0.22, r * 0.22), COL.soil, 3); };
const symBed = (c: Ctx, x: number, y: number, w: number, h: number) => { shape(c, () => rect(c, x - w / 2, y - h / 2, w, h), COL.blue, 5); shape(c, () => rect(c, x - w / 2 + 6, y - h / 2 + 6, w * 0.3, h - 12), WHITE, 3); };
const symWindow = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => rect(c, x - s, y - s * 0.6, s * 2, s * 1.2), COL.sky, 5); line(c, [[x, y - s * 0.6], [x, y + s * 0.6]], 4); line(c, [[x - s, y], [x + s, y]], 4); };
const symDoor = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - s * 1.4, y], [x - s * 0.7, y]], 12); line(c, [[x + s * 0.7, y], [x + s * 1.4, y]], 12); c.beginPath(); c.arc(x - s * 0.7, y, s * 1.4, 0, -Math.PI / 2, true); c.strokeStyle = INK; c.lineWidth = 4; c.setLineDash([8, 8]); c.stroke(); c.setLineDash([]); line(c, [[x - s * 0.7, y], [x - s * 0.7, y - s * 1.4]], 6, COL.brown); };
const symTap = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => ell(c, x, y, s, s), COL.water, 5); shape(c, () => ell(c, x, y, s * 0.35, s * 0.35), WHITE, 3); };
const symFridge = (c: Ctx, x: number, y: number, w: number, h: number) => { shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 8), COL.steelIn, 5); line(c, [[x - w / 2, y - h * 0.1], [x + w / 2, y - h * 0.1]], 4); line(c, [[x + w * 0.25, y - h * 0.3], [x + w * 0.25, y - h * 0.15]], 5); };
const symPot = (c: Ctx, x: number, y: number, s: number) => {
  for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; shape(c, () => ell(c, x + Math.cos(a) * s * 0.55, y + Math.sin(a) * s * 0.55, s * 0.5, s * 0.25, a), COL.leaf, 4); }
  shape(c, () => ell(c, x, y, s * 0.4, s * 0.4), COL.orange, 5);
};
const feetPrints = (c: Ctx, x: number, y: number, s: number) => { for (const [dx, dy] of [[-s * 0.5, 0], [s * 0.5, s * 1.1], [-s * 0.5, s * 2.2]]) shape(c, () => ell(c, x + dx, y + dy, s * 0.32, s * 0.55, 0.15), SKIN.child, 4); };
// a flat plan: 4 rooms in a box with doors
const flatPlan = (c: Ctx, x: number, y: number, w: number, h: number, detail = false) => {
  shape(c, () => rect(c, x, y, w, h), COL.paper, 0);
  const mx = x + w * 0.45, my = y + h * 0.5;
  roomBox(c, x, y, mx - x, my - y, { side: "b", at: 0.55, len: 60 }, "#fde8ee", 12);
  roomBox(c, mx, y, x + w - mx, my - y, { side: "b", at: 0.2, len: 60 }, "#e3f1fa", 12);
  roomBox(c, x, my, mx - x, y + h - my, { side: "t", at: 0.55, len: 60 }, "#e8f5dc", 12);
  roomBox(c, mx, my, x + w - mx, y + h - my, { side: "l", at: 0.2, len: 60 }, "#fff1d0", 12);
  if (detail) {
    bedTop(c, x + 30, y + 30, 120, 150); symTap(c, x + w - 60, y + h - 60, 24); symTap(c, mx + 50, y + 60, 22); symWindow(c, mx + (x + w - mx) / 2, y + 6, 30);
  }
};
const lined = (c: Ctx, x: number, y: number, w: number) => line(c, [[x, y], [x + w, y]], 9, COL.grey);

// 0 intro: grandmother in the doorway with a map, a coin on the tiled floor, girl behind the door
const intro = (c: Ctx) => {
  wall(c, 560);
  floorLines(c, 560, 540, 300);
  shape(c, () => rect(c, 300, 90, 480, 470), "#d8c9ea", 0);
  shape(c, () => rect(c, 300, 90, 480, 470), "rgba(0,0,0,0)", 12);
  coin(c, 600, 880, 52);
  cross(c, 600, 880, 0, 0);
  person(c, 830, 820, 520, {});
  shape(c, () => rect(c, 700, 140, 60, 420), COL.brown, 8);
  person(c, 400, 1010, 880, { adult: true, armL: [1.5, 1.75], armR: [1.5, 1.3] });
  shape(c, () => polyP(c, [[330, 600], [570, 580], [590, 760], [350, 780]]), COL.paper, 6);
  line(c, [[375, 640], [470, 625], [520, 700]], 5, PL);
  shape(c, () => rect(c, 470, 668, 36, 28), COL.pink, 4);
  arrow(c, [[640, 760], [610, 840]], RED, 10);
};

// 1 summary: a child's squared-paper map of a bedroom from above
const summary = (c: Ctx) => {
  ground(c);
  gridPaper(c, 110, 130, 860, 820, 41, COL.paper);
  roomBox(c, 200, 220, 560, 600, { side: "b", at: 0.62, len: 110 }, "rgba(255,255,255,0)", 18);
  bedTop(c, 232, 252, 250, 190);
  shape(c, () => rect(c, 600, 250, 130, 200), COL.teal, 6);
  shade(c, () => rect(c, 600, 250, 130, 200), COL.tealDk, 14, 14, 0.5);
  cross(c, 480, 620, 44, 18);
  northArrow(c, 860, 250, 0.9);
};

// e1: memory map vs tile map
const e1 = (c: Ctx) => {
  ground(c);
  gridPaper(c, 40, 190, 470, 560, 50, COL.paper, -0.05);
  c.save(); c.translate(275, 470); c.rotate(-0.05); c.translate(-275, -470);
  line(c, [[90, 240], [440, 250], [430, 700], [95, 690], [92, 245]], 10, INK);
  shape(c, () => rect(c, 120, 520, 120, 90), PINK, 6); shape(c, () => rect(c, 300, 260, 70, 140), COL.teal, 6); c.restore();
  cross(c, 330, 560, 24, 10);
  gridPaper(c, 570, 190, 470, 560, 50, COL.paper, 0.04);
  c.save(); c.translate(805, 470); c.rotate(0.04); c.translate(-805, -470);
  roomBox(c, 620, 240, 350, 450, undefined, "rgba(0,0,0,0)", 14);
  shape(c, () => rect(c, 620 + 50, 240 + 200, 150, 100), PINK, 6); shape(c, () => rect(c, 620 + 250, 240 + 20, 100, 150), COL.teal, 6);
  cross(c, 620 + 250, 240 + 330, 24, 10); c.restore();
  coin(c, 540, 900, 62);
  arrow(c, [[380, 880], [450, 900]], RED, 12); arrow(c, [[700, 880], [630, 900]], RED, 12);
};
// two gridded paths (shared with the explanation)
const gridRoom = (c: Ctx, cols: number, rows: number, t: number, ox: number, oy: number) => { tiles(c, ox, oy, cols, rows, t); };
const e2 = (c: Ctx) => {
  ground(c);
  const t = 120, ox = 180, oy = 150; gridRoom(c, 6, 5, t, ox, oy);
  const at = (col: number, row: number) => [ox + t / 2 + t * col, oy + t / 2 + t * row];
  badge(c, 540, 78, "N"); badge(c, 540, 748, "S"); badge(c, 90, 450, "W"); badge(c, 990, 450, "E");
  const [sx, sy] = at(1, 3), [kx, ky] = at(4, 1);
  coin(c, kx, ky, 40);
  topFigure(c, sx - 34, sy + 16, 0, 0.6); topFigure(c, sx + 34, sy + 16, Math.PI / 2, 0.6);
  arrow(c, [[sx - 34, sy - 50], [sx - 34, ky], [kx - 56, ky]], RED, 12);
  arrow(c, [[sx + 80, sy + 16], [kx, sy + 16], [kx, ky + 56]], COL.blueDk, 12);
};
const foot = (c: Ctx, x: number, y: number, L: number, skin: string = SKIN.child, dk: string = SKIN.childDk) => {
  const k = L / 225; c.save(); c.translate(x, y); c.scale(k, k);
  const body = () => { c.moveTo(18, 8); c.bezierCurveTo(-2, -18, 27, -36, 79, -34); c.bezierCurveTo(124, -30, 140, -46, 180, -46); c.bezierCurveTo(214, -44, 219, 30, 185, 46); c.bezierCurveTo(135, 48, 68, 40, 27, 38); c.bezierCurveTo(0, 34, -2, 20, 18, 8); c.closePath(); };
  [[0.9, -38, 17], [0.97, -16, 14], [0.98, 4, 13], [0.96, 22, 12], [0.9, 38, 11]].forEach(([u, v, r]) => shape(c, () => ell(c, 225 * u, v, r, r), skin, 5));
  shape(c, body, skin, 5); shade(c, body, dk, 10, 16, 0.7); c.restore();
};
const e3 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.wood; c.fillRect(0, 70, 1080, 70); line(c, [[0, 70], [1080, 70]], 6); line(c, [[0, 140], [1080, 140]], 6);
  for (let i = 0; i < 8; i++) foot(c, 60 + i * 120, 290, 110);
  for (let i = 0; i < 5; i++) foot(c, 60 + i * 190, 600, 175, SKIN.adult, SKIN.adultDk);
  line(c, [[40, 180], [40, 800]], 6, RED); line(c, [[1010, 180], [1010, 800]], 6, RED);
  arrow(c, [[60, 420], [980, 420]], RED, 12);
  arrow(c, [[60, 760], [980, 760]], RED, 12);
  write(c, "8", 440, 450, 80); write(c, "5", 440, 810, 80);
};

// a1: the view from above: side view left, top view right
const a1 = (c: Ctx) => {
  ground(c);
  line(c, [[540, 90], [540, 990]], 6, COL.grey);
  // side view, left
  shape(c, () => rect(c, 40, 640, 460, 26), COL.wood, 6);
  glass(c, 130, 640, 130, 250, 0.4);
  shape(c, () => rrect(c, 200, 520, 120, 120, 8), COL.red); shape(c, () => rect(c, 214, 530, 98, 100), WHITE, 4);
  shape(c, () => { c.moveTo(340, 636); c.quadraticCurveTo(420, 660, 490, 570); c.quadraticCurveTo(420, 618, 350, 580); c.closePath(); }, COL.yellow, 6);
  // top view, right: the same three things
  shape(c, () => ell(c, 640, 400, 70, 70), COL.steel); shape(c, () => ell(c, 640, 400, 48, 48), COL.steelIn, 4);
  shape(c, () => rrect(c, 740, 320, 120, 160, 8), COL.red); shape(c, () => rrect(c, 752, 330, 96, 140, 4), WHITE, 4);
  shape(c, () => { c.moveTo(900, 330); c.quadraticCurveTo(1010, 400, 900, 500); c.quadraticCurveTo(960, 400, 900, 330); c.closePath(); }, COL.yellow, 6);
  arrow(c, [[300, 900], [780, 900]], RED, 14);
};

// a2: morning sun through the east window, patch on the floor, child pointing
const a2 = (c: Ctx) => {
  wall(c, 700);
  shape(c, () => rect(c, 640, 150, 340, 380), COL.sky, 8);
  sun(c, 760, 400, 55); line(c, [[810, 150], [810, 530]], 8); line(c, [[640, 340], [980, 340]], 8);
  shape(c, () => polyP(c, [[640, 530], [980, 530], [940, 760], [560, 760]]), "rgba(255,211,77,0.55)", 0);
  shape(c, () => ell(c, 770, 880, 220, 70), "rgba(255,211,77,0.65)", 5);
  person(c, 270, 1010, 760, { armR: [0.12, -0.1], armL: [1.4, 1.5] });
  arrow(c, [[420, 600], [590, 600]], RED, 12);
};

// a3: a map of a home with a key and a north arrow
const a3 = (c: Ctx) => {
  ground(c);
  gridPaper(c, 70, 90, 940, 900, 47, COL.paper);
  flatPlan(c, 130, 140, 640, 560, true);
  // key
  shape(c, () => rrect(c, 130, 750, 520, 200, 12), WHITE, 6);
  const ks: [() => void, number][] = [[() => bedTop(c, 160, 780, 70, 50), 0], [() => symWindow(c, 195, 880, 22), 0], [() => symTap(c, 195, 925, 15), 0]];
  ks.forEach(([f]) => f()); lined(c, 260, 805, 330); lined(c, 260, 880, 330); lined(c, 260, 925, 330);
  northArrow(c, 880, 220, 1.1);
};

// a4: grandmother and child, each says the four directions (a compass cross in each bubble)
const miniCross = (c: Ctx, x: number, y: number, r: number) => {
  line(c, [[x - r, y], [x + r, y]], 8); line(c, [[x, y - r], [x, y + r]], 8);
  arrow(c, [[x, y], [x, y - r]], RED, 8);
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1]]) shape(c, () => ell(c, x + dx * (r + 14), y + dy * (r + 14), 8, 8), COL.blue, 3);
};
const bubble = (c: Ctx, x: number, y: number, w: number, h: number, tx: number, ty: number) => {
  shape(c, () => rrect(c, x, y, w, h, 40), WHITE, 6);
  shape(c, () => polyP(c, [[tx > x + w / 2 ? x + w - 130 : x + 90, y + h - 6], [tx, ty], [tx > x + w / 2 ? x + w - 60 : x + 160, y + h - 6]]), WHITE, 6);
  shape(c, () => rect(c, tx > x + w / 2 ? x + w - 128 : x + 92, y + h - 12, tx > x + w / 2 ? 66 : 66, 10), WHITE, 0);
};
const a4 = (c: Ctx) => {
  ground(c);
  bubble(c, 40, 80, 480, 330, 200, 520); miniCross(c, 280, 255, 80);
  bubble(c, 560, 140, 480, 330, 850, 580); miniCross(c, 800, 315, 80);
  person(c, 240, 1030, 520, {});
  person(c, 850, 1030, 520, { adult: true });
  // the phone line between them
  shape(c, () => rrect(c, 470, 780, 120, 200, 18), COL.black, 6); shape(c, () => rrect(c, 485, 800, 90, 130, 8), COL.sky, 4);
};

// a5: a child's map of a street from above
const a5 = (c: Ctx) => {
  ground(c);
  gridPaper(c, 80, 80, 920, 900, 45, COL.paper);
  shape(c, () => rect(c, 80, 460, 920, 150), COL.greyDk === "x" ? COL.grey : "#cfcac0", 6);
  c.setLineDash([36, 28]); line(c, [[90, 535], [990, 535]], 6, WHITE); c.setLineDash([]);
  for (const [x, w] of [[130, 190], [350, 140], [530, 180]] as number[][]) shape(c, () => rect(c, x, 140, w, 240), [PINK, COL.sky, COL.wood][[130, 350, 530].indexOf(x)], 7);
  shape(c, () => rect(c, 760, 140, 190, 240), COL.orange, 7); shape(c, () => polyP(c, [[855, 170], [925, 360], [785, 360]]), COL.red, 5);
  for (const x of [140, 330, 520, 690, 800]) treeTop(c, x, 700, 40);
  shape(c, () => rect(c, 110, 700, 0, 0), WHITE, 0);
  for (const [x, w] of [[180, 220], [450, 160], [640, 170]] as number[][]) shape(c, () => rect(c, x, 780, w, 160), [COL.teal, COL.yellow, COL.purple][[180, 450, 640].indexOf(x)], 7);
  northArrow(c, 940, 840, 0.7);
};

// a6: turn the map so its N arrow points where N really is
const a6 = (c: Ctx) => {
  ground(c);
  tiles(c, 150, 170, 7, 6, 110);
  badge(c, 540, 90, "N", true, 52);
  c.setLineDash([16, 16]); c.save(); c.translate(540, 520); c.rotate(-0.9); c.translate(-540, -520); shape(c, () => rect(c, 360, 340, 360, 360), "rgba(255,255,255,0.4)", 5); c.restore(); c.setLineDash([]);
  c.save(); c.translate(540, 500); c.rotate(0.06); c.translate(-540, -500);
  gridPaper(c, 360, 320, 360, 360, 45, COL.paper);
  flatPlan(c, 385, 400, 310, 255, false);
  northArrow(c, 650, 400, 0.55);
  c.restore();
  arrow(c, [[300, 380], [250, 520], [330, 640]], RED, 12);
};

// p1: a map from the gate to the front door with landmarks
const p1 = (c: Ctx) => {
  ground(c);
  gridPaper(c, 70, 80, 940, 900, 47, COL.paper);
  shape(c, () => rect(c, 120, 780, 560, 130), "#cfcac0", 6);
  shape(c, () => rect(c, 106, 770, 26, 26), COL.brown, 5); shape(c, () => rect(c, 106, 896, 26, 26), COL.brown, 5);
  shape(c, () => rect(c, 620, 130, 300, 190), COL.teal, 6); shape(c, () => rect(c, 700, 190, 70, 70), COL.steelIn, 4);
  treeTop(c, 330, 620, 70);
  shape(c, () => rect(c, 520, 540, 110, 110), COL.orange, 6);
  shape(c, () => rect(c, 150, 540, 110, 110), COL.wood, 6);
  dotted(c, [[200, 860], [450, 860], [450, 430], [740, 430], [740, 330]], 11);
  arrow(c, [[740, 400], [740, 340]], RED, 12);
  northArrow(c, 880, 700, 0.8);
  shape(c, () => ell(c, 200, 860, 22, 22), COL.yellow, 5);
};

// c1: a map with no words: only pictures
const c1 = (c: Ctx) => {
  ground(c);
  gridPaper(c, 70, 90, 940, 900, 47, COL.paper);
  flatPlan(c, 120, 140, 840, 790, false);
  symFridge(c, 260, 330, 90, 120); symPot(c, 700, 330, 80); symTap(c, 260, 740, 40);
  feetPrints(c, 700, 640, 34);
  sun(c, 1000, 860, 36);
};

// c2: steer the toy car on a grid
const toyCar = (c: Ctx, x: number, y: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); // faces +x
  for (const sx of [-26, 26]) for (const sy of [-26, 26]) shape(c, () => rrect(c, sx - 14, sy - 6 + (sy > 0 ? 8 : -8), 28, 12, 4), INK, 0);
  shape(c, () => rrect(c, -50, -28, 100, 56, 16), RED, 5); shade(c, () => rrect(c, -50, -28, 100, 56, 16), "#a82a20", 6, 8, 0.5);
  shape(c, () => rrect(c, -10, -20, 36, 40, 8), COL.sky, 4);
  c.restore();
};
const c2 = (c: Ctx) => {
  ground(c);
  const t = 110, ox = 130, oy = 170; gridPaper(c, ox, oy, t * 7, t * 6, t, COL.paper);
  badge(c, 540, 85, "N"); badge(c, 540, 905, "S", false, 40); badge(c, 70, 500, "W", false, 40); badge(c, 1010, 500, "E", false, 40);
  const at = (col: number, row: number) => [ox + t / 2 + t * col, oy + t / 2 + t * row];
  const [x0, y0] = at(0, 5), [x1, y1] = at(5, 1);
  shape(c, () => rrect(c, ox + t * 2 + 10, oy + t * 2 + 10, t * 2 - 20, t - 20, 12), COL.purple, 6);
  shape(c, () => rrect(c, ox + t * 4 + 10, oy + t * 3 + 10, t - 20, t * 2 - 20, 12), COL.purple, 6);
  coin(c, at(6, 0)[0], at(6, 0)[1], 36);
  dotted(c, [[x0 + 50, y0], [at(1, 5)[0], y0], [at(1, 5)[0], at(1, 1)[1]], [at(3, 1)[0], at(1, 1)[1]], [at(3, 1)[0] + 0, at(6, 1)[1]], [at(6, 1)[0] - 20, at(6, 1)[1]], [at(6, 0)[0], at(6, 0)[1] + 50]], 10);
  toyCar(c, x0, y0, 0);
};


// ---- terms
const t0 = (c: Ctx) => { ground(c); gridPaper(c, 80, 110, 920, 860, 46, COL.paper); flatPlan(c, 150, 170, 780, 740, true); };
const t1 = (c: Ctx) => {
  ground(c);
  tiles(c, 90, 520, 7, 4, 128);
  crow(c, 590, 230, 1.0);
  for (const [x, y] of [[250, 600], [560, 640], [800, 790]]) c.setLineDash([2, 22]), line(c, [[480, 330], [x, y - 60]], 8, RED), c.setLineDash([]);
  bedTop(c, 160, 570, 190, 150);
  shape(c, () => ell(c, 560, 660, 80, 80), COL.wood); shape(c, () => ell(c, 560, 660, 54, 54), COL.woodDk, 4);
  shape(c, () => ell(c, 800, 820, 44, 44), COL.steel); shape(c, () => ell(c, 800, 820, 30, 30), COL.steelIn, 4);
};
const t2 = (c: Ctx) => {
  wall(c, 700);
  shape(c, () => rect(c, 640, 130, 380, 570), "#fff3d8", 8);
  symFridge(c, 760, 460, 120, 300); shape(c, () => rrect(c, 850, 520, 150, 180, 8), COL.steelIn, 6); shape(c, () => ell(c, 925, 505, 55, 22), COL.steel, 5);
  shape(c, () => rect(c, 880, 440, 90, 60), COL.orange, 6);
  person(c, 270, 1010, 760, { armR: [0.1, -0.05], armL: [1.4, 1.5] });
  arrow(c, [[420, 560], [620, 560]], RED, 14);
  shape(c, () => polyP(c, [[560, 700], [640, 700], [640, 760], [530, 760]]), "rgba(0,0,0,0)", 0);
};
const compassCross = (c: Ctx, cx: number, cy: number, r: number) => {
  line(c, [[cx - r, cy], [cx + r, cy]], 14); line(c, [[cx, cy - r], [cx, cy + r]], 14);
  shape(c, () => ell(c, cx, cy, 36, 36), WHITE, 6);
  badge(c, cx, cy - r - 70, "N", true, 56); badge(c, cx, cy + r + 70, "S", false, 56); badge(c, cx - r - 70, cy, "W", false, 56); badge(c, cx + r + 70, cy, "E", false, 56);
};
const t3 = (c: Ctx) => { ground(c); compassCross(c, 540, 540, 260); arrow(c, [[540, 560], [540, 330]], RED, 16); };
const t4 = (c: Ctx) => {
  wall(c, 800);
  shape(c, () => rect(c, 230, 120, 620, 520), "#f7b27a", 10);
  c.save(); c.beginPath(); rect(c, 235, 125, 610, 510); c.clip();
  c.fillStyle = "#ffd9a0"; c.fillRect(235, 125, 610, 250);
  sun(c, 540, 470, 90);
  c.fillStyle = COL.greenDk; c.beginPath(); c.moveTo(235, 520); c.quadraticCurveTo(400, 440, 540, 520); c.quadraticCurveTo(700, 430, 845, 530); c.lineTo(845, 635); c.lineTo(235, 635); c.closePath(); c.fill();
  c.fillStyle = COL.green; c.beginPath(); c.moveTo(235, 570); c.quadraticCurveTo(540, 520, 845, 580); c.lineTo(845, 635); c.lineTo(235, 635); c.closePath(); c.fill();
  c.restore();
  line(c, [[540, 120], [540, 640]], 8); line(c, [[230, 380], [850, 380]], 8);
  shape(c, () => polyP(c, [[230, 640], [850, 640], [900, 940], [180, 940]]), "rgba(255,211,77,0.5)", 0);
  arrow(c, [[540, 330], [540, 270]], RED, 12);
};
const t5 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 880, 340, 50);
  shape(c, () => ell(c, 540, 520, 380, 380), COL.steelDk); shape(c, () => ell(c, 540, 520, 340, 340), COL.steel);
  shade(c, () => ell(c, 540, 520, 340, 340), COL.steelDk, 18, 18, 0.35);
  shape(c, () => ell(c, 540, 520, 290, 290), WHITE, 6);
  for (let i = 0; i < 24; i++) { const a = (i * Math.PI) / 12; line(c, [[540 + Math.cos(a) * 270, 520 + Math.sin(a) * 270], [540 + Math.cos(a) * (i % 6 ? 245 : 225), 520 + Math.sin(a) * (i % 6 ? 245 : 225)]], i % 6 ? 4 : 7); }
  shape(c, () => polyP(c, [[540, 250], [585, 520], [540, 500], [495, 520]]), RED, 6);
  shape(c, () => polyP(c, [[540, 790], [585, 520], [540, 540], [495, 520]]), COL.steelIn, 6);
  shape(c, () => ell(c, 540, 520, 22, 22), COL.yellow, 6);
  badge(c, 540, 175, "N", true, 40);
};
const star = (c: Ctx, cx: number, cy: number, R: number, r: number, n: number, rot: number, col: string) => {
  const pts: number[][] = []; for (let i = 0; i < n * 2; i++) { const a = rot + (i * Math.PI) / n, rr = i % 2 ? r : R; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
  shape(c, () => polyP(c, pts), col, 6);
};
const t6 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 540, 300, 300), COL.paper, 6);
  star(c, 540, 540, 220, 70, 4, Math.PI / 4, COL.sky);
  star(c, 540, 540, 300, 60, 4, 0, COL.blue);
  shape(c, () => polyP(c, [[540, 240], [585, 540], [540, 520], [495, 540]]), RED, 6);
  shape(c, () => ell(c, 540, 540, 26, 26), COL.yellow, 6);
  badge(c, 540, 110, "N", true, 52); badge(c, 540, 970, "S", false, 52); badge(c, 100, 540, "W", false, 52); badge(c, 980, 540, "E", false, 52);
};
const t7 = (c: Ctx) => {
  ground(c);
  const card = (x: number, y: number, f: () => void) => { shape(c, () => rrect(c, x, y, 400, 400, 24), COL.paper, 6); f(); };
  card(80, 100, () => symTree(c, 280, 300, 110));
  card(600, 100, () => symBed(c, 800, 300, 280, 190));
  card(80, 580, () => symWindow(c, 280, 780, 120));
  card(600, 580, () => symDoor(c, 800, 830, 110));
};
const t8 = (c: Ctx) => {
  ground(c);
  gridPaper(c, 60, 80, 960, 920, 46, COL.paper);
  roomBox(c, 120, 140, 560, 500, { side: "b", at: 0.5, len: 100 }, "rgba(0,0,0,0)", 14);
  symBed(c, 280, 280, 240, 160); symTree(c, 560, 260, 50); symWindow(c, 400, 146, 40);
  shape(c, () => rrect(c, 130, 690, 880, 290, 14), WHITE, 7);
  const rows: [() => void, number][] = [[() => symTree(c, 200, 740, 28), 740], [() => symBed(c, 200, 820, 70, 46), 820], [() => symWindow(c, 200, 895, 34), 895], [() => symTap(c, 200, 950, 20), 950]];
  rows.forEach(([f]) => f()); [740, 820, 895, 950].forEach((y) => lined(c, 290, y, 600));
  northArrow(c, 880, 280, 1);
};
const t9 = (c: Ctx) => {
  ground(c);
  tiles(c, 150, 120, 4, 1, 200);
  gridPaper(c, 150, 600, 800, 200, 200, COL.paper);
  for (let i = 0; i < 4; i++) { const x = 250 + i * 200; c.setLineDash([2, 20]); line(c, [[x, 330], [x, 590]], 8, RED); c.setLineDash([]); }
  shape(c, () => rect(c, 150 + 10, 130, 180, 180), "rgba(0,0,0,0)", 0);
  arrow(c, [[540, 330], [540, 580]], RED, 14);
  write(c, "4", 520, 880, 90); 
};
const t10 = (c: Ctx) => {
  ground(c); c.fillStyle = COL.sky; c.fillRect(0, 0, 1080, 650); line(c, [[0, 650], [1080, 650]], 8); c.fillStyle = "#cfcac0"; c.fillRect(0, 650, 1080, 430);
  // neem tree
  shape(c, () => rect(c, 800, 380, 70, 290), COL.soil, 7); shape(c, () => ell(c, 835, 270, 200, 170), COL.green); shade(c, () => ell(c, 835, 270, 200, 170), COL.greenDk, 30, 30, 0.5);
  for (const [x, y] of [[740, 230], [860, 200], [800, 310], [930, 290]]) shape(c, () => ell(c, x, y, 55, 40), COL.leaf, 5);
  // gate
  shape(c, () => rect(c, 60, 250, 90, 420), COL.wood, 7); shape(c, () => rect(c, 460, 250, 90, 420), COL.wood, 7); shape(c, () => rect(c, 50, 220, 510, 60), COL.woodDk, 7);
  for (let x = 160; x < 460; x += 50) line(c, [[x, 330], [x, 670]], 8);
  line(c, [[150, 360], [460, 360]], 8);
  // milk booth
  shape(c, () => rect(c, 570, 420, 200, 250), COL.paper, 7); shape(c, () => rect(c, 600, 470, 140, 90), COL.sky, 5);
  shape(c, () => polyP(c, [[550, 420], [790, 420], [770, 360], [570, 360]]), COL.red, 7);
  shape(c, () => glassMilk(c), "rgba(0,0,0,0)", 0);
  shadow(c, 500, 800, 450, 40);
};
const glassMilk = (c: Ctx) => { c.rect(0, 0, 0, 0); };
const t11 = (c: Ctx) => {
  ground(c);
  gridPaper(c, 80, 80, 920, 900, 46, COL.paper);
  roomBox(c, 300, 130, 280, 640, undefined, "#e9eef3", 12);
  roomBox(c, 580, 130, 340, 640, undefined, "#e9eef3", 12);
  shape(c, () => rect(c, 300, 780, 130, 150), COL.steel, 7);
  line(c, [[340, 780], [390, 780]], 0);
  for (const y of [230, 400, 570]) { line(c, [[580, y], [580, y + 70]], 16, COL.paper); }
  shape(c, () => rect(c, 700, 380, 190, 150), COL.yellow, 5);
  dotted(c, [[365, 850], [440, 850], [440, 440], [560, 440]], 12);
  arrow(c, [[520, 440], [585, 440]], RED, 14);
  northArrow(c, 160, 220, 0.7);
};

// ---- explanations
const e0 = (c: Ctx) => {
  ground(c);
  line(c, [[540, 90], [540, 990]], 6, COL.grey);
  // the room from the side
  shape(c, () => rect(c, 40, 260, 460, 380), "#f7e6c4", 7); shape(c, () => rect(c, 40, 640, 460, 140), TILE_B, 7);
  shape(c, () => rrect(c, 80, 470, 220, 150, 10), COL.blue); shape(c, () => rrect(c, 80, 420, 60, 110, 10), WHITE, 5);
  shape(c, () => rrect(c, 340, 300, 140, 330, 10), COL.teal); line(c, [[410, 300], [410, 630]], 5);
  // the same room from above
  roomBox(c, 580, 270, 440, 500, { side: "b", at: 0.7, len: 90 }, COL.paper, 14);
  bedTop(c, 610, 300, 200, 150); shape(c, () => rect(c, 870, 300, 120, 130), COL.teal, 6);
  arrow(c, [[420, 860], [690, 860]], RED, 14);
};
const e1x = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 500, 560, 340, 340), COL.blue); shade(c, () => ell(c, 500, 560, 340, 340), COL.blueDk, 40, 40, 0.5);
  c.save(); c.beginPath(); ell(c, 500, 560, 336, 336); c.clip();
  for (const pts of [[[430, 330], [570, 300], [640, 400], [560, 520], [450, 500], [380, 410]], [[560, 600], [680, 580], [690, 720], [600, 800], [530, 720]], [[320, 560], [400, 590], [350, 700], [290, 640]]])
    shape(c, () => { c.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(([x, y]) => c.lineTo(x, y)); c.closePath(); }, COL.green, 5);
  c.restore();
  shape(c, () => ell(c, 500, 560, 340, 340), "rgba(0,0,0,0)", 8);
  shape(c, () => ell(c, 600, 430, 18, 18), RED, 4);
  arrow(c, [[600, 410], [560, 270], [520, 150]], RED, 14);
  badge(c, 500, 100, "N", true, 46);
  sun(c, 930, 560, 70); arrow(c, [[930, 700], [930, 780]], RED, 10);
};
const e2x = (c: Ctx) => {
  ground(c);
  const t = 120, ox = 180, oy = 150; tiles(c, ox, oy, 6, 5, t);
  badge(c, 540, 78, "N", true); badge(c, 540, 748, "S"); badge(c, 90, 450, "W");
  shape(c, () => rect(c, 900, 270, 24, 280), COL.sky, 7); sun(c, 1000, 410, 40);
  shape(c, () => polyP(c, [[900, 280], [900, 540], [740, 560], [740, 300]]), "rgba(255,211,77,0.45)", 0);
  topFigure(c, 440, 520, 0, 1.0);
  arrow(c, [[500, 380], [820, 400]], RED, 14);
  badge(c, 990, 660, "E");
};
const e3x = (c: Ctx) => {
  ground(c);
  const t = 120, ox = 180, oy = 150; tiles(c, ox, oy, 6, 5, t);
  badge(c, 540, 78, "N"); badge(c, 540, 748, "S"); badge(c, 90, 450, "W"); badge(c, 990, 450, "E");
  const sx = 400, sy = 540;
  topFigure(c, sx - 34, sy + 16, 0, 0.6); topFigure(c, sx + 34, sy + 16, Math.PI / 2, 0.6);
  arrow(c, [[sx - 34, sy - 50], [sx - 34, sy - 290], [sx + 200, sy - 290]], RED, 12);
  arrow(c, [[sx + 86, sy + 16], [sx + 400, sy + 16], [sx + 400, sy + 200]], COL.blueDk, 12);
  shape(c, () => ell(c, sx + 220, sy - 290, 14, 14), RED, 0); shape(c, () => ell(c, sx + 400, sy + 220, 14, 14), COL.blueDk, 0);
};

export const ic_planetEarthMapsAndDirectionsL3 = cards("sci.planet-earth.maps-and-directions.L3 cards", [intro, summary, e1, e2, e3, a1, a2, a3, a4, a5, a6, p1, c1, c2, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, e0, e1x, e2x, e3x]);
