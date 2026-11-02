import type { Ctx } from "./core";
import {
  INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, rrect, polyP, shadow, shade, line, arrow, plate, hand, person, write, cards,
} from "./flatKit";

// sci.india.national-identity.L3 · picture cards. Flat DeepKids look; red = arrows and circles; no words.
const TAU = Math.PI * 2;
const SAF = "#ff9933", GRN = "#138808", NAVY = "#1f3a93";
const TIG = "#f08a2e", TIG_DK = "#c9691a", CREAM = "#fbf3df";
const STONE = "#e3c48f", STONE_DK = "#b98f58";
const ATTA = "#f3e4c4", ATTA_DK = "#dcc79b", DENT = "#b89b68";

// ------------------------------------------------------------------ shared pieces
// the Ashoka Chakra: ring, 24 spokes, a dot between each pair of spokes, a hub
const chakra = (c: Ctx, x: number, y: number, r: number, col = NAVY) => {
  const sw = Math.max(2.5, r * 0.08);
  c.beginPath(); c.arc(x, y, r, 0, TAU); c.strokeStyle = col; c.lineWidth = sw; c.stroke();
  for (let i = 0; i < 24; i++) {
    const a = (i * TAU) / 24, b = ((i + 0.5) * TAU) / 24;
    line(c, [[x + Math.cos(a) * r * 0.14, y + Math.sin(a) * r * 0.14], [x + Math.cos(a) * r * 0.94, y + Math.sin(a) * r * 0.94]], Math.max(1.6, r * 0.04), col);
    c.beginPath(); c.arc(x + Math.cos(b) * r * 0.84, y + Math.sin(b) * r * 0.84, Math.max(1.5, r * 0.04), 0, TAU); c.fillStyle = col; c.fill();
  }
  c.beginPath(); c.arc(x, y, r * 0.15, 0, TAU); c.fillStyle = col; c.fill();
};
// a flat flag: saffron on top, white, green; the wheel in the middle of the white band
const flag = (c: Ctx, x: number, y: number, w: number, h: number, wheel = true, ln = 6) => {
  const b = h / 3;
  c.fillStyle = SAF; c.fillRect(x, y, w, b); c.fillStyle = WHITE; c.fillRect(x, y + b, w, b); c.fillStyle = GRN; c.fillRect(x, y + 2 * b, w, b);
  c.strokeStyle = INK; c.lineWidth = ln; c.lineJoin = "round"; c.strokeRect(x, y, w, h);
  if (wheel) chakra(c, x + w / 2, y + h / 2, b * 0.4);
};
// a flag waving from a pole: edges follow a wave
const waveFlag = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const b = h / 3, n = 24, wv = (u: number) => Math.sin(u * 6.5) * h * 0.07 * u;
  const band = (k: number, col: string) => {
    const top: number[][] = [], bot: number[][] = [];
    for (let i = 0; i <= n; i++) { const u = i / n; top.push([x + w * u, y + k * b + wv(u)]); bot.push([x + w * u, y + (k + 1) * b + wv(u)]); }
    shape(c, () => polyP(c, [...top, ...bot.reverse()]), col, 0);
  };
  band(0, SAF); band(1, WHITE); band(2, GRN);
  const top: number[][] = [], bot: number[][] = [];
  for (let i = 0; i <= n; i++) { const u = i / n; top.push([x + w * u, y + wv(u)]); bot.push([x + w * u, y + h + wv(u)]); }
  shape(c, () => polyP(c, [...top, ...bot.reverse()]), "rgba(0,0,0,0)", 6);
  const u = 0.5; chakra(c, x + w * u, y + h / 2 + wv(u), b * 0.38);
};
const pole = (c: Ctx, x: number, y1: number, y2: number, w = 14) => { line(c, [[x, y1], [x, y2]], w + 8, INK); line(c, [[x, y1], [x, y2]], w, COL.steel); shape(c, () => ell(c, x, y1 - 4, w * 0.85, w * 0.85), COL.yellow, 5); };

const tiger = (c: Ctx, x: number, y: number, s: number, o: { flip?: boolean; walk?: boolean } = {}) => {
  c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
  shadow(c, 10, 6, 200, 20);
  // tail with dark rings
  const tl = [[150, -215], [225, -235], [255, -310], [222, -372]];
  line(c, tl, 30, INK); line(c, tl, 20, TIG);
  [[246, -280], [236, -330], [224, -362]].forEach(([tx, ty]) => line(c, [[tx - 10, ty - 8], [tx + 10, ty + 8]], 8, INK));
  const leg = (lx: number, dx: number, dark: boolean) => {
    shape(c, () => rrect(c, lx - 21 + dx, -150, 44, 150, 20), dark ? TIG_DK : TIG);
    shape(c, () => rrect(c, lx - 24 + dx, -52, 50, 52, 20), CREAM);
    line(c, [[lx - 20 + dx, -118], [lx + 20 + dx, -108]], 7); line(c, [[lx - 20 + dx, -88], [lx + 20 + dx, -80]], 7);
  };
  const st = o.walk ? 34 : 0;
  leg(-95, -st, true); leg(120, st, true);
  const body = () => ell(c, 0, -205, 165, 82);
  shape(c, body, TIG);
  c.save(); c.beginPath(); body(); c.clip();
  shape(c, () => ell(c, 0, -120, 170, 48), CREAM, 0);
  shade(c, body, TIG_DK, 12, 18, 0.35);
  for (let i = -4; i <= 4; i++) { const sx = i * 34 + 8; line(c, [[sx + 6, -290], [sx - 6, -255], [sx + 8, -222], [sx - 2, -190]], 11); }
  c.restore();
  shape(c, body, "rgba(0,0,0,0)", 6);
  leg(-55, st, false); leg(80, -st, false);
  // neck and head, facing left
  shape(c, () => ell(c, -125, -228, 66, 66), TIG, 0);
  shape(c, () => ell(c, -150, -225, 66, 62), TIG);
  for (const ex of [-195, -112]) { shape(c, () => ell(c, ex, -285, 24, 26), TIG); shape(c, () => ell(c, ex, -283, 12, 14), "#f6c2a8", 0); }
  shape(c, () => ell(c, -150, -225, 66, 62), TIG);
  [[-120, -268, -108, -250], [-138, -272, -134, -250], [-156, -270, -158, -250]].forEach(([a, b, d, e]) => line(c, [[a, b], [d, e]], 7));
  line(c, [[-90, -222], [-112, -218]], 7); line(c, [[-92, -200], [-112, -204]], 7);
  shape(c, () => ell(c, -176, -200, 40, 30), CREAM);
  shape(c, () => ell(c, -150, -243, 9, 8), "#f5c518", 3);
  shape(c, () => ell(c, -190, -240, 9, 8), "#f5c518", 3);
  shape(c, () => ell(c, -150, -243, 3.5, 3.5), INK, 0); shape(c, () => ell(c, -190, -240, 3.5, 3.5), INK, 0);
  shape(c, () => polyP(c, [[-206, -218], [-186, -218], [-196, -204]]), "#d96a6a", 4);
  line(c, [[-196, -204], [-196, -190]], 4); line(c, [[-196, -190], [-184, -184]], 4);
  c.restore();
};

const peacock = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 0, 6, 150, 18);
  for (let i = -8; i <= 8; i++) {
    const a = -Math.PI / 2 + i * 0.165, L = 340, fx = Math.cos(a) * L, fy = -150 + Math.sin(a) * L;
    line(c, [[0, -150], [fx * 0.55, -150 + (fy + 150) * 0.55]], 10, INK);
    c.save(); c.translate(fx * 0.7, -150 + (fy + 150) * 0.7); c.rotate(a + Math.PI / 2);
    shape(c, () => ell(c, 0, 0, 40, 100), i % 2 ? "#2e9d5b" : "#3fb1a8", 5);
    shape(c, () => ell(c, 0, -34, 22, 32), "#d6a42b", 3); shape(c, () => ell(c, 0, -34, 15, 22), COL.blue, 3); shape(c, () => ell(c, 0, -34, 7, 11), "#1d2e6e", 0);
    c.restore();
  }
  for (const sg of [-1, 1]) { line(c, [[sg * 22, -70], [sg * 28, -4]], 16, INK); line(c, [[sg * 22, -70], [sg * 28, -4]], 8, "#d19a66"); line(c, [[sg * 28, -4], [sg * 52, 4]], 8, INK); }
  shape(c, () => ell(c, 0, -125, 62, 84), "#1f6fb5"); shade(c, () => ell(c, 0, -125, 62, 84), "#164f86", 14, 8, 0.6);
  shape(c, () => rrect(c, -22, -300, 44, 190, 22), "#1f6fb5", 5); shape(c, () => ell(c, 0, -300, 33, 30), "#1f6fb5", 5);
  [[-12, -352], [0, -360], [12, -352]].forEach(([cx, cy]) => { line(c, [[cx * 0.4, -325], [cx, cy + 6]], 4); shape(c, () => ell(c, cx, cy, 6, 6), "#3fb1a8", 3); });
  shape(c, () => ell(c, -16, -302, 6, 6), WHITE, 3); shape(c, () => ell(c, 12, -302, 6, 6), WHITE, 3);
  shape(c, () => polyP(c, [[-10, -288], [14, -288], [2, -270]]), COL.orange, 4);
  c.restore();
};

const lotus = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => ell(c, 0, 20, 260, 60), COL.waterDk, 5);
  shape(c, () => ell(c, -110, 4, 150, 34), COL.leaf, 5);
  line(c, [[-110, 4], [-210, -8]], 4, COL.leafDk);
  line(c, [[0, 10], [0, -160]], 18, INK); line(c, [[0, 10], [0, -160]], 8, COL.leafDk);
  const petal = (bx: number, by: number, tx: number, ty: number, w: number, col: string) => {
    const mx = (bx + tx) / 2, my = (by + ty) / 2, nx = -(ty - by) * w, ny = (tx - bx) * w;
    shape(c, () => { c.moveTo(bx, by); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, bx, by); c.closePath(); }, col, 6);
  };
  const by = -170;
  [[-165, -300], [165, -300]].forEach(([tx, ty]) => petal(0, by + 30, tx, ty + 30, 0.34, "#f29ab4"));
  [[-95, -360], [95, -360]].forEach(([tx, ty]) => petal(0, by + 24, tx, ty, 0.3, "#f6b1c6"));
  petal(0, by + 20, 0, -395, 0.28, "#f8c4d3");
  [[-70, -300], [70, -300]].forEach(([tx, ty]) => petal(0, by + 40, tx, ty, 0.3, "#f6b1c6"));
  shape(c, () => ell(c, 0, by + 10, 52, 22), COL.yellow, 5);
  c.restore();
};

// the Lion Capital: a round stone base with a wheel carved on it, three lions seen from the front
const lionCap = (c: Ctx, x: number, y: number, s: number, carved = true) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 10, 6, 260, 24);
  const lion = (lx: number, ly: number, k: number, front: boolean) => {
    c.save(); c.translate(lx, ly); c.scale(k, k);
    shape(c, () => rrect(c, -62, -215, 124, 215, 40), STONE); shade(c, () => rrect(c, -62, -215, 124, 215, 40), STONE_DK, 18, 0, 0.55);
    line(c, [[-30, -120], [-28, -10]], 5, STONE_DK); line(c, [[30, -120], [28, -10]], 5, STONE_DK);
    // mane: a ring of rounded curls around the face
    for (let i = 0; i < 14; i++) { const a = (i * TAU) / 14; shape(c, () => ell(c, Math.cos(a) * 76, -270 + Math.sin(a) * 74, 30, 30), STONE, 5); }
    shape(c, () => ell(c, 0, -268, 62, 62), STONE, 5);
    shape(c, () => ell(c, 0, -246, 30, 24), "#efd7a9", 4);
    shape(c, () => polyP(c, [[-10, -262], [10, -262], [0, -250]]), STONE_DK, 3);
    line(c, [[0, -250], [0, -238]], 4); line(c, [[-14, -230], [0, -238], [14, -230]], 4);
    for (const sg of [-1, 1]) { line(c, [[sg * 14, -290], [sg * 38, -284]], 6); shape(c, () => ell(c, sg * 26, -274, 6, 5), INK, 0); }
    c.restore();
    void front;
  };
  lion(-128, -92, 0.78, false); lion(128, -92, 0.78, false); lion(0, -92, 1, true);
  // the round base
  const dr = () => rrect(c, -230, -96, 460, 96, 18);
  shape(c, dr, STONE); shade(c, dr, STONE_DK, 22, 0, 0.5);
  shape(c, () => ell(c, 0, -96, 230, 26), "#efd7a9", 5);
  if (carved) {
    chakra(c, 0, -46, 36, "#7a5a2c");
    for (const sg of [-1, 1]) { const ax = sg * 128; shape(c, () => rrect(c, ax - 38, -56, 76, 32, 14), STONE_DK, 3); shape(c, () => rrect(c, ax + sg * 20, -74, 22, 24, 8), STONE_DK, 3); line(c, [[ax - 20, -26], [ax - 20, -8]], 6, STONE_DK); line(c, [[ax + 20, -26], [ax + 20, -8]], 6, STONE_DK); }
  }
  c.restore();
};

const rupee = (c: Ctx, x: number, y: number, h: number, col = INK, w = 14) => {
  const ww = h * 0.62;
  line(c, [[x, y], [x + ww, y]], w, col); line(c, [[x, y + h * 0.2], [x + ww, y + h * 0.2]], w, col);
  c.beginPath(); c.moveTo(x + ww * 0.1, y); c.bezierCurveTo(x + ww * 1.05, y, x + ww * 1.05, y + h * 0.42, x + ww * 0.1, y + h * 0.42);
  c.lineTo(x + ww * 0.95, y + h); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; c.stroke();
};

const star = (c: Ctx, x: number, y: number, r: number, col = COL.yellow) => {
  const pts: number[][] = [];
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  shape(c, () => polyP(c, pts), col, 5);
};
const note = (c: Ctx, x: number, y: number, s: number, col: string) => {
  line(c, [[x + s * 0.5, y], [x + s * 0.5, y - s * 1.8], [x + s * 1.2, y - s * 1.4]], s * 0.2, INK);
  shape(c, () => ell(c, x, y, s * 0.55, s * 0.4, -0.4), col, 5);
};
const ruler = (c: Ctx, x: number, y: number, w: number, h: number, cm: number) => {
  shape(c, () => rrect(c, x, y, w, h, 8), COL.wood, 6); shade(c, () => rrect(c, x, y, w, h, 8), COL.woodDk, 0, h * 0.2, 0.5);
  const step = (w - 40) / cm;
  for (let k = 0; k <= cm; k++) line(c, [[x + 20 + k * step, y], [x + 20 + k * step, y + (k % 5 === 0 ? 38 : 26)]], 4);
};
const paperPlate = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  plate(c, x, y, rx, ry);
  const ar = rx * 0.82, br = ry * 0.78;
  shape(c, () => ell(c, x, y - 2, ar, br), ATTA, 5); shade(c, () => ell(c, x, y - 2, ar, br), ATTA_DK, ar * 0.25, br * 0.25, 0.6);
};
const fist = (c: Ctx, x: number, y: number, k: number, col: string) => { for (let i = 0; i < 4; i++) shape(c, () => ell(c, x + i * 62 * k, y, 28 * k, 20 * k), col, 4); };
const sing = (c: Ctx, x: number, y: number, h: number) => { const head = h * 0.13, hy = y - h * 0.74 - head * 1.05; shape(c, () => ell(c, x, hy + head * 0.5, head * 0.3, head * 0.27), "#7a2f3a", 4); };
const mini = (c: Ctx, x: number, y: number, s: number, col: string) => {
  shape(c, () => rrect(c, x - 9 * s, y - 20 * s, 18 * s, 22 * s, 6 * s), col, 3);
  shape(c, () => ell(c, x, y - 28 * s, 8 * s, 8.5 * s), SKIN.child, 3);
  shape(c, () => ell(c, x, y - 32 * s, 8.4 * s, 5 * s), CLOTH.hair, 0);
};
const phone = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 26), COL.black, 6);
  shape(c, () => rrect(c, x - w / 2 + 12, y - h / 2 + 16, w - 24, h - 32, 14), "#22303a", 4);
};
const pinePaper = (c: Ctx, x: number, y: number, w: number, h: number, col = COL.paper) => { shape(c, () => rrect(c, x, y, w, h, 10), col, 6); };
const mapPts: number[][] = [[74.4, 37], [76.8, 35.7], [78, 35.5], [79.3, 34], [78.8, 32.6], [79.5, 31.2], [80.4, 30.4], [81.2, 30.1], [80.6, 29], [82.3, 27.9], [84.2, 27.4], [86.5, 26.5], [88.1, 26.6], [88, 27.5], [88.9, 28], [89, 27.2], [91.5, 27], [92.8, 27.5], [94.3, 28.6], [96.1, 29.3], [97.3, 28.2], [96.2, 27.2], [95.2, 26.2], [94.7, 25], [94.2, 23.8], [93.4, 23], [92.6, 21.9], [92.3, 23.6], [91.7, 24.2], [91.2, 25.2], [90, 25.2], [89.8, 26], [89, 26.2], [88.4, 25.3], [88.9, 24.3], [88.5, 23.3], [89, 22.2], [88.6, 21.6], [87, 21.5], [86.7, 20.4], [85.2, 19.6], [84, 18.5], [82.5, 17], [81.3, 16.2], [80.3, 15.2], [80.2, 13.5], [79.9, 11.8], [79.8, 10.4], [79.2, 10.3], [78.2, 8.9], [77.5, 8.1], [76.6, 8.9], [75.8, 11.2], [74.9, 12.9], [74.2, 14.8], [73.7, 16.5], [72.9, 18.9], [72.8, 20.4], [72.6, 21.4], [72, 21.2], [70.4, 20.9], [69, 22.3], [70.2, 22.8], [68.6, 23.3], [68.2, 23.7], [68.8, 24.3], [70, 24.2], [71.1, 24.4], [70.6, 25.5], [70.3, 27], [71.9, 27.9], [72.8, 29.3], [74, 30.6], [74.6, 31.6], [75.3, 32.4], [74.4, 33.6], [73.7, 34.7]];
const indiaMap = (c: Ctx, ox: number, oy: number, k: number) => {
  const P = (lon: number, lat: number) => [ox + (lon - 68) * k, oy + (37.2 - lat) * k];
  shape(c, () => polyP(c, mapPts.map(([a, b]) => P(a, b))), COL.greenLt, 7);
  return P;
};

// ------------------------------------------------------------------ the cards
// 0 summary (the unit's cover): a child with a paper flag, a tiger beside her
const summary = (c: Ctx) => {
  ground(c);
  const h = 640, px = 270, py = 1010;
  person(c, px, py, h, { armR: [-0.28 * Math.PI, -0.5 * Math.PI] });
  const wx = px + h * 0.11 + Math.cos(-0.28 * Math.PI) * h * 0.17, wy = py - h * 0.74 + h * 0.03 + Math.sin(-0.28 * Math.PI) * h * 0.17 - h * 0.16;
  line(c, [[wx, wy + 60], [wx, wy - 220]], 18, INK); line(c, [[wx, wy + 60], [wx, wy - 220]], 8, COL.wood);
  flag(c, wx, wy - 222, 170, 113);
  tiger(c, 760, 990, 1.3, { flip: false });
};
// flow.e1 Paw Print Test: a small faint print and a wide deep print in atta, a ruler across both
const e1 = (c: Ctx) => {
  ground(c);
  paperPlate(c, 540, 640, 490, 300);
  fist(c, 150, 600, 0.95, DENT); fist(c, 470, 600, 1.45, "#a98b5a");
  for (let i = 0; i < 4; i++) shape(c, () => ell(c, 470 + i * 90, 604, 42, 30), "#8f7448", 0);
  // dashed guides from the outer marks of each print up to the ruler, the width written under it
  c.setLineDash([14, 12]);
  for (const gx of [123, 354, 429, 781]) line(c, [[gx, 590], [gx, 420]], 5, RED);
  c.setLineDash([]);
  shadow(c, 540, 400, 420, 18);
  ruler(c, 90, 330, 900, 76, 12);
  arrow(c, [[123, 690], [354, 690]], RED, 8); arrow(c, [[354, 690], [123, 690]], RED, 8);
  arrow(c, [[429, 700], [781, 700]], RED, 8); arrow(c, [[781, 700], [429, 700]], RED, 8);
  write(c, "4", 215, 730, 80, INK, 9); write(c, "6", 580, 740, 90, INK, 10);
};
// flow.e2 Anthem Clock: a phone stopwatch showing 53, a family singing under it
const e2 = (c: Ctx) => {
  ground(c);
  phone(c, 540, 270, 360, 480);
  shape(c, () => ell(c, 540, 190, 80, 80), COL.yellow, 6); line(c, [[540, 190], [540, 140]], 7); line(c, [[540, 190], [585, 210]], 7);
  write(c, "0", 405, 320, 100, WHITE, 11); c.fillStyle = WHITE; for (const dy of [0.3, 0.7]) { c.beginPath(); c.arc(485, 320 + 100 * dy, 9, 0, TAU); c.fill(); } write(c, "53", 520, 320, 100, WHITE, 11);
  const base = 1000, ppl: [number, number, boolean][] = [[200, 400, false], [400, 470, true], [680, 470, true], [880, 400, false]];
  ppl.forEach(([x, h, ad]) => { person(c, x, base, h, { adult: ad }); sing(c, x, base, h); });
  note(c, 90, 760, 34, COL.purple); note(c, 970, 760, 34, COL.pink);
};
// flow.a1 Make an exact Tricolour: a 3 to 2 flag with its measures, and the folded 24-spoke wheel
const a1 = (c: Ctx) => {
  ground(c);
  shadow(c, 400, 880, 330, 24);
  flag(c, 90, 420, 600, 400, false);
  arrow(c, [[100, 360], [340, 360]], RED, 10); arrow(c, [[680, 360], [440, 360]], RED, 10); write(c, "30", 365, 295, 60, INK, 8);
  arrow(c, [[760, 430], [760, 540]], RED, 10); arrow(c, [[760, 810], [760, 650]], RED, 10); write(c, "20", 735, 565, 50, INK, 7);
  shape(c, () => ell(c, 840, 170, 120, 120), WHITE, 6); chakra(c, 840, 170, 100);
  write(c, "24", 540, 120, 80, INK, 10);
  arrow(c, [[780, 290], [560, 560]], RED, 8);
};
// flow.a2 Emblem Hunt: a rupee note, its lions, and a magnifying glass over them
const a2 = (c: Ctx) => {
  ground(c);
  shadow(c, 480, 790, 400, 26);
  shape(c, () => rrect(c, 90, 330, 780, 420, 18), "#cfe3c4"); shade(c, () => rrect(c, 90, 330, 780, 420, 18), "#a9c79b", 24, 20, 0.4);
  shape(c, () => rrect(c, 130, 370, 700, 340, 10), "rgba(0,0,0,0)", 4);
  lionCap(c, 270, 560, 0.34, false);
  rupee(c, 600, 440, 150, "#4b7a47", 14); line(c, [[560, 640], [790, 640]], 8, "#4b7a47"); line(c, [[560, 675], [740, 675]], 8, "#4b7a47");
  for (let i = 0; i < 4; i++) line(c, [[470, 600 + i * 22], [510, 600 + i * 22]], 6, "#4b7a47");
  // magnifier
  line(c, [[640, 700], [900, 960]], 50, INK); line(c, [[640, 700], [900, 960]], 34, COL.brown);
  shape(c, () => ell(c, 400, 620, 180, 180), COL.glass, 12);
  c.save(); c.beginPath(); ell(c, 400, 620, 172, 172); c.clip(); lionCap(c, 400, 770, 0.74, true); c.restore();
  shape(c, () => ell(c, 400, 620, 180, 180), "rgba(0,0,0,0)", 12);
  shape(c, () => ell(c, 900, 230, 70, 70), COL.steel); shape(c, () => ell(c, 900, 230, 50, 50), "#e6e1d6", 4); rupee(c, 880, 205, 50, INK, 7);
};
// flow.a3 Fact Check: a notebook with tally marks, a phone showing a tick
const a3 = (c: Ctx) => {
  ground(c);
  shadow(c, 420, 920, 360, 24);
  pinePaper(c, 90, 150, 600, 760);
  for (const gx of [300, 500]) line(c, [[gx, 150], [gx, 910]], 5, COL.greyDk);
  for (let r = 0; r < 5; r++) line(c, [[90, 270 + r * 128], [690, 270 + r * 128]], 5, COL.greyDk);
  // tally marks in rows
  [4, 3, 1, 2].forEach((n, r) => {
    const y = 310 + r * 128;
    for (let i = 0; i < Math.min(n, 4); i++) line(c, [[345 + i * 30, y - 24], [345 + i * 30, y + 42]], 9, COL.blueDk);
    if (n === 5) line(c, [[330, y + 30], [450, y - 14]], 9, COL.blueDk);
  });
  [COL.orange, COL.green, COL.purple, COL.pink].forEach((col, r) => shape(c, () => ell(c, 195, 330 + r * 128, 34, 34), col, 5));
  line(c, [[120, 232], [270, 232]], 7, INK);
  phone(c, 820, 500, 280, 520);
  line(c, [[730, 380], [800, 600], [900, 640]], 28, INK); line(c, [[730, 380], [800, 600], [900, 640]], 18, COL.wood);
  shape(c, () => ell(c, 930, 640, 14, 14), WHITE, 3);
  shape(c, () => ell(c, 820, 500, 105, 105), "rgba(0,0,0,0)", 0); c.beginPath(); c.arc(820, 500, 110, 0, TAU); c.strokeStyle = RED; c.lineWidth = 16; c.stroke(); line(c, [[742, 422], [898, 578]], 16, RED);
};
// flow.a4 Map the anthem: a map of India, stars on the places named, the Ganga and Yamuna
const a4 = (c: Ctx) => {
  ground(c);
  const P = indiaMap(c, 130, 120, 28);
  const river = (pts: number[][]) => { const q = pts.map(([a, b]) => P(a, b)); line(c, q, 16, INK); line(c, q, 8, COL.water); };
  river([[78.9, 31], [79.3, 29.5], [80.3, 26.8], [82.5, 25.4], [85, 25.6], [87.5, 24.8], [88.5, 23.6]]);
  river([[78.4, 31], [77.2, 28.6], [78.4, 27], [80.7, 25.5]]);
  [[75, 31], [72, 22.6], [75.5, 19.2], [77.4, 11.5], [84.5, 20.6], [88, 23.8]].forEach(([a, b]) => { const [x, y] = P(a, b); star(c, x, y, 36); });
  note(c, 120, 220, 38, COL.purple); note(c, 960, 960, 38, COL.pink);
};
// flow.p1 National Symbols Museum: a table with a flag, coins, a feather and a map, each with a label card
const p1 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[40, 700], [1040, 700], [1080, 790], [0, 790]]), COL.wood, 6);
  shape(c, () => rrect(c, 0, 790, 1080, 70, 4), COL.woodDk, 6);
  shape(c, () => rrect(c, 80, 860, 80, 200, 4), COL.woodDk, 6); shape(c, () => rrect(c, 920, 860, 80, 200, 4), COL.woodDk, 6);
  // flag in a cup
  shape(c, () => polyP(c, [[130, 560], [250, 560], [235, 700], [145, 700]]), COL.steel);
  line(c, [[190, 560], [190, 280]], 14, INK); line(c, [[190, 560], [190, 280]], 7, COL.wood); flag(c, 190, 280, 170, 112);
  // coins and a note
  shape(c, () => ell(c, 470, 690, 60, 18), COL.steelDk, 5); shape(c, () => ell(c, 470, 670, 60, 18), COL.steel, 5); shape(c, () => ell(c, 470, 650, 60, 18), "#e6e1d6", 5);
  shape(c, () => polyP(c, [[400, 600], [640, 600], [660, 660], [420, 660]]), "#cfe3c4", 5); lionCap(c, 520, 656, 0.14, false);
  // feather
  line(c, [[740, 690], [820, 420]], 8, INK);
  shape(c, () => { c.moveTo(820, 420); c.quadraticCurveTo(900, 480, 790, 640); c.quadraticCurveTo(740, 540, 820, 420); }, "#2e9d5b", 5);
  shape(c, () => ell(c, 820, 500, 24, 36, 0.2), COL.blue, 4); shape(c, () => ell(c, 820, 500, 10, 16, 0.2), "#1d2e6e", 0);
  // map card
  shape(c, () => rrect(c, 880, 560, 150, 130, 8), COL.paper, 5); shape(c, () => ell(c, 955, 625, 36, 44), COL.greenLt, 4);
  // label cards
  [190, 470, 755, 955].forEach((x) => { shape(c, () => rrect(c, x - 55, 725, 110, 52, 6), WHITE, 5); line(c, [[x - 35, 745], [x + 35, 745]], 4, COL.greyDk); line(c, [[x - 35, 760], [x + 15, 760]], 4, COL.greyDk); });
};
// flow.c1 A flag anyone can remember: three quick sketches, one circled
const c1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 70, 130, 940, 820, 20), COL.paper, 6);
  const f = (x: number, y: number, draw: () => void) => { shape(c, () => rrect(c, x, y, 270, 180, 6), WHITE, 6); c.save(); c.beginPath(); c.rect(x, y, 270, 180); c.clip(); draw(); c.restore(); };
  f(110, 200, () => { c.fillStyle = COL.blue; c.fillRect(110, 200, 270, 90); c.fillStyle = COL.yellow; c.fillRect(110, 290, 270, 90); });
  f(410, 200, () => { c.fillStyle = COL.red; c.fillRect(410, 200, 270, 180); c.fillStyle = WHITE; c.fillRect(535, 200, 40, 180); c.fillRect(410, 270, 270, 40); });
  f(710, 200, () => { c.fillStyle = COL.teal; c.fillRect(710, 200, 270, 180); shape(c, () => ell(c, 845, 290, 52, 52), COL.yellow, 5); });
  shape(c, () => ell(c, 545, 290, 190, 120), "rgba(0,0,0,0)", 0); c.beginPath(); c.ellipse(545, 290, 190, 125, 0, 0, TAU); c.strokeStyle = RED; c.lineWidth = 9; c.stroke();
  // her chosen flag, drawn big, and a friend drawing it from memory
  f(300, 500, () => { c.fillStyle = COL.teal; c.fillRect(300, 500, 270, 180); shape(c, () => ell(c, 435, 590, 52, 52), COL.yellow, 5); });
  arrow(c, [[545, 430], [435, 490]], RED, 10);
  shape(c, () => rrect(c, 640, 500, 270, 180, 6), "rgba(0,0,0,0)", 0);
  c.setLineDash([16, 12]); c.strokeStyle = COL.greyDk; c.lineWidth = 6; c.strokeRect(640, 500, 270, 180); c.setLineDash([]);
  shape(c, () => ell(c, 775, 590, 52, 52), "rgba(0,0,0,0)", 0);
  c.setLineDash([12, 10]); c.beginPath(); c.arc(775, 590, 52, 0, TAU); c.strokeStyle = COL.greyDk; c.lineWidth = 6; c.stroke(); c.setLineDash([]);
  write(c, "10", 470, 760, 90, INK, 9);
  line(c, [[130, 800], [260, 740]], 18, INK); line(c, [[130, 800], [260, 740]], 9, COL.yellow);
};

// terms
const t0 = (c: Ctx) => {
  ground(c);
  c.beginPath(); c.arc(540, 540, 440, 0, TAU); c.strokeStyle = COL.grey; c.lineWidth = 6; c.setLineDash([2, 22]); c.stroke(); c.setLineDash([]);
  flag(c, 130, 150, 360, 240);
  tiger(c, 790, 470, 0.82);
  peacock(c, 270, 1000, 0.62);
  lotus(c, 800, 1000, 0.62);
};
const t1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.sky; c.fillRect(0, 0, D1, 640);
  shape(c, () => rrect(c, 60, 640, 960, 420, 6), "#f1c9a0"); shade(c, () => rrect(c, 60, 640, 960, 420, 6), "#d9a77a", 20, 0, 0.5);
  shape(c, () => rrect(c, 40, 620, 1000, 40, 4), COL.greyDk);
  for (let i = 0; i < 4; i++) { shape(c, () => rrect(c, 130 + i * 230, 740, 130, 150, 6), COL.sky); line(c, [[195 + i * 230, 740], [195 + i * 230, 890]], 5); }
  pole(c, 300, 130, 620, 16);
  waveFlag(c, 308, 150, 420, 280);
  shape(c, () => ell(c, 880, 170, 70, 40), WHITE, 0); shape(c, () => ell(c, 940, 190, 50, 32), WHITE, 0);
};
const t2 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 940, 380, 26);
  shape(c, () => ell(c, 540, 530, 400, 400), WHITE, 7);
  chakra(c, 540, 530, 365);
};
const t3 = (c: Ctx) => { ground(c); lionCap(c, 540, 900, 1.5); };
const t4 = (c: Ctx) => {
  ground(c);
  lionCap(c, 540, 600, 1.1);
  shape(c, () => rrect(c, 160, 700, 760, 150, 14), WHITE, 6);
  line(c, [[200, 745], [880, 745]], 7);
  const r = rnd(5);
  for (let i = 0; i < 15; i++) { const x = 205 + i * 45 + r() * 8; line(c, [[x + 14, 745], [x + 14, 800 + r() * 16]], 7); c.beginPath(); c.arc(x - 2, 775, 14 + r() * 4, 0, TAU); c.strokeStyle = INK; c.lineWidth = 7; c.stroke(); if (r() > 0.6) line(c, [[x + 14, 790], [x + 40, 820]], 6); }
};
const t5 = (c: Ctx) => {
  ground(c);
  const base = 990, hs = [560, 620, 640, 580, 600];
  hs.forEach((h, i) => { const x = 150 + i * 195; person(c, x, base, h); sing(c, x, base, h); });
  note(c, 330, 250, 38, COL.purple); note(c, 600, 190, 44, COL.pink); note(c, 850, 250, 38, COL.teal);
};
const t6 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#dcd0b4"; c.fillRect(0, 780, D1, 300);
  // flag bearer in front, drummers behind
  const drum = (x: number, y: number, h: number) => { person(c, x, y, h); shape(c, () => rrect(c, x - 70, y - h * 0.46, 140, 90, 12), COL.red); line(c, [[x - 70, y - h * 0.46 + 24], [x + 70, y - h * 0.46 + 24]], 6, WHITE); line(c, [[x - 70, y - h * 0.46 + 66], [x + 70, y - h * 0.46 + 66]], 6, WHITE); };
  drum(160, 900, 500); drum(380, 930, 560);
  person(c, 620, 1000, 640, { armR: [-0.28 * Math.PI, -0.5 * Math.PI] });
  const wx = 620 + 640 * 0.11 + Math.cos(-0.28 * Math.PI) * 640 * 0.17, wy = 1000 - 640 * 0.74 + 640 * 0.03 + Math.sin(-0.28 * Math.PI) * 640 * 0.17 - 640 * 0.16;
  line(c, [[wx, wy + 60], [wx, wy - 250]], 18, INK); line(c, [[wx, wy + 60], [wx, wy - 250]], 8, COL.wood);
  waveFlag(c, wx, wy - 252, 250, 165);
  arrow(c, [[300, 190], [500, 190]], RED, 12);
};
const t7 = (c: Ctx) => {
  ground(c, "#a47a50");
  const MUD = "#7d5836";
  c.fillStyle = "#a47a50"; c.fillRect(0, 0, D1, D1);
  const r = rnd(3); for (let i = 0; i < 30; i++) shape(c, () => ell(c, r() * 1080, r() * 1080, 14 + r() * 24, 8 + r() * 12, r() * 3), "#946a43", 0);
  const dent = (draw: () => void) => { shape(c, draw, MUD, 8); };
  dent(() => { c.moveTo(540, 560); c.bezierCurveTo(400, 560, 340, 650, 360, 740); c.bezierCurveTo(375, 780, 440, 760, 470, 785); c.bezierCurveTo(500, 810, 520, 780, 540, 790); c.bezierCurveTo(560, 780, 580, 810, 610, 785); c.bezierCurveTo(640, 760, 705, 780, 720, 740); c.bezierCurveTo(740, 650, 680, 560, 540, 560); c.closePath(); });
  [[300, 470, -0.45], [430, 360, -0.15], [650, 360, 0.15], [780, 470, 0.45]].forEach(([x, y, a]) => dent(() => ell(c, x, y, 62, 82, a)));
  shade(c, () => ell(c, 540, 700, 190, 120), "#5b3f25", 20, 20, 0.0);
  ruler(c, 220, 880, 640, 76, 8);
};
const t8 = (c: Ctx) => {
  ground(c, "#cfd9a8");
  c.fillStyle = "#b5c27d"; c.fillRect(0, 760, D1, 320);
  const tree = (x: number, w: number) => { shape(c, () => rrect(c, x - w / 2, 0, w, 900, 14), "#7a5a3a"); shade(c, () => rrect(c, x - w / 2, 0, w, 900, 14), "#5b3f25", w * 0.25, 0, 0.5); };
  tree(930, 140); tree(110, 80);
  // strap and camera on the trunk
  line(c, [[860, 330], [1000, 330]], 26, INK); line(c, [[860, 330], [1000, 330]], 14, COL.black);
  shape(c, () => rrect(c, 790, 250, 190, 150, 18), COL.black, 6); shape(c, () => ell(c, 850, 325, 44, 44), "#22303a", 6); shape(c, () => ell(c, 850, 325, 20, 20), COL.blue, 0);
  shape(c, () => ell(c, 940, 285, 10, 10), RED, 0);
  // light rays toward the tiger
  c.globalAlpha = 0.25; shape(c, () => polyP(c, [[790, 325], [140, 480], [140, 960]]), COL.yellow, 0); c.globalAlpha = 1;
  tiger(c, 400, 960, 0.9, { flip: true, walk: true });
};
const t9 = (c: Ctx) => {
  ground(c, "#cfd9a8");
  c.fillStyle = "#b5c27d"; c.fillRect(0, 800, D1, 280);
  const tr = (x: number, h: number) => { shape(c, () => rrect(c, x - 20, 800 - h, 40, h, 8), "#7a5a3a"); shape(c, () => ell(c, x, 800 - h, 110, 130), COL.leaf); shade(c, () => ell(c, x, 800 - h, 110, 130), COL.leafDk, 20, 20, 0.5); };
  tr(560, 380); tr(760, 330); tr(960, 400);
  const hh = 740, px = 280, py = 1010;
  person(c, px, py, hh, { adult: true, armR: [Math.PI * 0.4, -Math.PI * 0.1] });
  // notebook in the hand, camera on a strap
  shape(c, () => rrect(c, 330, 560, 150, 110, 8), COL.paper, 5); line(c, [[355, 595], [450, 595]], 4, COL.greyDk); line(c, [[355, 625], [430, 625]], 4, COL.greyDk);
  line(c, [[px - 60, py - hh * 0.72], [px + 10, py - hh * 0.4], [px + 70, py - hh * 0.72]], 8, INK);
  shape(c, () => rrect(c, px - 40, py - hh * 0.46, 100, 70, 10), COL.black, 5); shape(c, () => ell(c, px + 10, py - hh * 0.46 + 36, 22, 22), "#22303a", 4);
};
const t11 = (c: Ctx) => {
  ground(c);
  paperPlate(c, 370, 740, 340, 200);
  fist(c, 220, 740, 0.9, "#a98b5a");
  c.setLineDash([12, 10]); for (const gx of [195, 413]) line(c, [[gx, 730], [gx, 500]], 5, RED); c.setLineDash([]);
  shadow(c, 340, 520, 300, 16);
  ruler(c, 90, 420, 560, 70, 10);
  pinePaper(c, 690, 330, 330, 560);
  write(c, "6", 760, 450, 140, INK, 13); write(c, "cm", 840, 520, 80, INK, 10);
  line(c, [[740, 800], [980, 760]], 16, INK); line(c, [[740, 800], [980, 760]], 8, COL.yellow);
};

// explanations
const x0 = (c: Ctx) => {
  ground(c);
  const P = indiaMap(c, 130, 130, 28);
  const cols = [COL.orange, COL.blue, COL.pink, COL.purple, COL.teal, COL.red, COL.yellow];
  const [fx, fy] = P(79, 21.5);
  const ppl = [[75.5, 31.5], [72, 22.8], [76, 27], [88.5, 25], [75.5, 18.5], [77.5, 11.5], [84.5, 21], [93, 26.5], [81, 28]];
  c.setLineDash([10, 12]); ppl.forEach(([a, b]) => { const [x, y] = P(a, b); line(c, [[x, y - 30], [fx, fy - 40]], 4, COL.greyDk); }); c.setLineDash([]);
  ppl.forEach(([a, b], i) => { const [x, y] = P(a, b); mini(c, x, y, 2.3, cols[i % cols.length]); });
  pole(c, fx, fy - 130, fy + 40, 12); flag(c, fx, fy - 120, 160, 106);
};
const x1 = (c: Ctx) => {
  ground(c);
  shadow(c, 520, 830, 380, 26);
  flag(c, 140, 260, 720, 480);
  arrow(c, [[80, 330], [150, 330]], RED, 12); arrow(c, [[80, 500], [150, 500]], RED, 12); arrow(c, [[80, 670], [150, 670]], RED, 12);
  arrow(c, [[940, 500], [630, 500]], RED, 12);
  arrow(c, [[160, 190], [490, 190]], RED, 10); arrow(c, [[840, 190], [510, 190]], RED, 10); write(c, "3", 480, 100, 80, INK, 10);
  arrow(c, [[920, 280], [920, 480]], RED, 10); arrow(c, [[920, 720], [920, 520]], RED, 10); write(c, "2", 950, 450, 70, INK, 9);
};
const x2 = (c: Ctx) => {
  ground(c);
  lionCap(c, 270, 800, 1.0);
  shape(c, () => ell(c, 800, 520, 215, 215), WHITE, 6);
  rupee(c, 685, 360, 320, INK, 30);
};
const x3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 640, 120, 330, 400, 12), COL.sky, 8); line(c, [[805, 120], [805, 520]], 6); line(c, [[640, 320], [970, 320]], 6);
  shape(c, () => polyP(c, [[60, 780], [1020, 780], [1060, 900], [20, 900]]), COL.wood, 6);
  shape(c, () => rrect(c, 20, 900, 1040, 80, 4), COL.woodDk, 6);
  // old man seated: robe, white hair, face, long white beard
  shape(c, () => rrect(c, 250, 470, 330, 330, 80), COL.cloth, 6); shade(c, () => rrect(c, 250, 470, 330, 330, 80), "#d9d4c6", 40, 0, 0.6);
  shape(c, () => ell(c, 415, 320, 122, 135), "#f3f1ea", 6);
  shape(c, () => ell(c, 415, 340, 92, 108), SKIN.child, 6);
  shape(c, () => { c.moveTo(325, 350); c.quadraticCurveTo(330, 540, 415, 680); c.quadraticCurveTo(500, 540, 505, 350); c.quadraticCurveTo(480, 440, 415, 430); c.quadraticCurveTo(350, 440, 325, 350); c.closePath(); }, "#f3f1ea", 6);
  shape(c, () => { c.moveTo(380, 395); c.quadraticCurveTo(415, 380, 450, 395); c.quadraticCurveTo(415, 415, 380, 395); c.closePath(); }, "#f3f1ea", 4);
  shape(c, () => ell(c, 382, 336, 10, 7), INK, 0); shape(c, () => ell(c, 448, 336, 10, 7), INK, 0);
  line(c, [[362, 316], [398, 312]], 6, "#d9d4c6"); line(c, [[432, 312], [468, 316]], 6, "#d9d4c6");
  line(c, [[415, 345], [410, 372]], 4, SKIN.childDk);
  // paper and pen
  shape(c, () => polyP(c, [[470, 800], [740, 800], [770, 740], [500, 740]]), COL.paper, 6); line(c, [[520, 775], [700, 775]], 4, COL.greyDk); line(c, [[535, 757], [690, 757]], 4, COL.greyDk);
  shape(c, () => ell(c, 560, 600, 36, 36), SKIN.child, 6);
  line(c, [[560, 600], [610, 730]], 8, INK); line(c, [[546, 636], [610, 730]], 6, COL.brown);
  note(c, 880, 700, 36, COL.purple);
};
const calPage = (c: Ctx, x: number, y: number, num: string, draw: () => void) => {
  shadow(c, x + 130, y + 560, 150, 20);
  shape(c, () => rrect(c, x, y, 290, 540, 18), WHITE, 6); shape(c, () => rrect(c, x, y, 290, 120, 18), COL.red);
  shape(c, () => rrect(c, x, y + 80, 290, 40, 0), COL.red, 0); line(c, [[x, y + 120], [x + 290, y + 120]], 6);
  for (const rx of [x + 70, x + 220]) shape(c, () => rrect(c, rx - 10, y - 24, 20, 56, 8), COL.steel, 5);
  write(c, num, x + 145 - num.length * 36, y + 22, 78, WHITE, 11);
  c.save(); c.beginPath(); c.rect(x + 6, y + 126, 278, 408); c.clip(); draw(); c.restore();
};
const x4 = (c: Ctx) => {
  ground(c);
  calPage(c, 40, 240, "15", () => { pole(c, 110, 330, 700, 12); flag(c, 110, 350, 110, 74); arrow(c, [[250, 640], [250, 480]], RED, 10); });
  calPage(c, 395, 240, "26", () => { pole(c, 470, 330, 520, 12); flag(c, 470, 350, 110, 74); shape(c, () => rrect(c, 430, 620, 190, 80, 14), COL.red); shape(c, () => ell(c, 525, 620, 85, 18), COL.steelIn, 5); });
  calPage(c, 750, 240, "2", () => {
    c.beginPath(); c.arc(810, 440, 38, 0, TAU); c.moveTo(938, 440); c.arc(900, 440, 38, 0, TAU); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
    line(c, [[848, 440], [862, 440]], 6); line(c, [[772, 440], [756, 420]], 6); line(c, [[938, 440], [958, 420]], 6);
    // a spinning wheel: a big wheel with spokes on a wooden stand
    shape(c, () => polyP(c, [[800, 700], [930, 700], [950, 730], [780, 730]]), COL.wood, 5); line(c, [[865, 700], [865, 640]], 10);
    c.beginPath(); c.arc(865, 600, 70, 0, TAU); c.strokeStyle = INK; c.lineWidth = 8; c.stroke();
    for (let i = 0; i < 8; i++) line(c, [[865, 600], [865 + Math.cos((i * TAU) / 8) * 70, 600 + Math.sin((i * TAU) / 8) * 70]], 5);
    shape(c, () => ell(c, 865, 600, 12, 12), COL.wood, 4);
  });
};
const camFrame = (c: Ctx, x: number, y: number, w: number, h: number, tx: number, ty: number, k: number) => {
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 14); c.clip();
  c.fillStyle = "#33463a"; c.fillRect(x, y, w, h); c.fillStyle = "#273529"; c.fillRect(x, y + h * 0.7, w, h * 0.3);
  tiger(c, tx, ty, k);
  c.restore();
  shape(c, () => rrect(c, x, y, w, h, 14), "rgba(0,0,0,0)", 10);
};
const x6 = (c: Ctx) => {
  ground(c);
  camFrame(c, 40, 170, 480, 600, 290, 640, 0.9);
  camFrame(c, 560, 170, 480, 600, 800, 650, 0.9);
  // the same shoulder stripes circled on both pictures
  for (const [ox, oy] of [[290, 640], [800, 650]]) { c.beginPath(); c.ellipse(ox - 10, oy - 215 * 0.9, 95, 70, 0, 0, TAU); c.strokeStyle = RED; c.lineWidth = 9; c.stroke(); }
  line(c, [[505, 860], [575, 860]], 14, RED); line(c, [[505, 900], [575, 900]], 14, RED);
};
const x7 = (c: Ctx) => {
  ground(c);
  // chalk court
  shape(c, () => polyP(c, [[560, 560], [1040, 560], [1070, 900], [530, 900]]), "#d9c9a6", 6);
  line(c, [[800, 560], [800, 900]], 8, WHITE); line(c, [[595, 640], [1025, 640]], 6, WHITE); line(c, [[580, 760], [1040, 760]], 6, WHITE);
  // hockey stick and ball
  line(c, [[80, 280], [270, 760], [420, 790]], 40, INK); line(c, [[80, 280], [270, 760], [420, 790]], 26, COL.wood);
  shape(c, () => ell(c, 500, 800, 24, 24), WHITE, 5);
  // cricket bat and ball
  c.save(); c.translate(660, 330); c.rotate(0.35);
  shape(c, () => rrect(c, -34, 0, 68, 300, 20), COL.wood); shape(c, () => rrect(c, -14, -120, 28, 140, 10), COL.brown); c.restore();
  shape(c, () => ell(c, 860, 440, 36, 36), COL.red, 6); line(c, [[838, 430], [882, 450]], 4, WHITE);
  // a big question mark
  c.beginPath(); c.arc(420, 400, 110, Math.PI * 1.1, Math.PI * 2.55); c.strokeStyle = RED; c.lineWidth = 34; c.lineCap = "round"; c.stroke();
  line(c, [[480, 480], [420, 560], [420, 620]], 34, RED); c.beginPath(); c.arc(420, 700, 24, 0, TAU); c.fillStyle = RED; c.fill();
};
const D1 = 1080;

export const ic_indiaNationalIdentityL3 = cards("sci.india.national-identity.L3 cards", [
  summary, e1, e2, a1, a2, a3, a4, p1, c1,
  t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t11,
  x0, x1, x2, x3, x4, x6, x7,
]);
