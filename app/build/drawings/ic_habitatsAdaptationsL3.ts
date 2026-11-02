import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, SKIN, WHITE, arrow, cards, ell, ground, hand, line, person, polyP, rrect, shade, shadow, shape, shine, leaf } from "./flatKit";

// HABITATS · ADAPTATIONS L3 · picture cards for the experiments, activities, words and ideas. Flat DeepKids look;
// the same child (orange shirt) and grown-up (blue shirt); red arrows = movement or change; blue dots = air.

const SAND = "#f0d9a0", SAND_DK = "#d9b86c", SNOW = "#f4f8fc", SNOW_DK = "#cfdcea", ROCK = "#8f8a93", ROCK_DK = "#6f6a75";
const MUD = "#7c6b5d", MUD_DK = "#5b4d42", TOWEL = "#bcd9f0", TOWEL_DK = "#8fb8de", CAM = "#dcae62", CAM_DK = "#bb8c47";
const AIR = "#4b86d6", NIGHT = "#2d2a4a";

const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.65, y + Math.sin(a) * r * 1.65]], Math.max(5, r * 0.14), COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, Math.max(4, r * 0.1));
};
const flake = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI; line(c, [[x - Math.cos(a) * r, y - Math.sin(a) * r], [x + Math.cos(a) * r, y + Math.sin(a) * r]], Math.max(4, r * 0.18), COL.blue); }
};
const dropShape = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) =>
  shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 1.1, y - s * 0.1, x, y + s * 0.7); c.quadraticCurveTo(x - s * 1.1, y - s * 0.1, x, y - s * 1.5); c.closePath(); }, col, Math.max(3, s * 0.18));
const dot = (c: Ctx, x: number, y: number, r: number) => shape(c, () => ell(c, x, y, r, r), AIR, Math.max(2.5, r * 0.18));
const moon = (c: Ctx, x: number, y: number, r: number) => shape(c, () => { c.arc(x, y, r, 0.5, Math.PI * 2 - 0.5); c.arc(x + r * 0.45, y, r * 0.8, Math.PI * 2 - 0.9, 0.9, true); c.closePath(); }, COL.yellow, 5);
// a wavy red arrow going up: water vapour leaving something
const vapour = (c: Ctx, x: number, y: number, h: number, w = 10) => {
  const pts: number[][] = []; for (let t = 0; t <= h; t += 12) pts.push([x + Math.sin(t / 22) * 12, y - t]);
  arrow(c, pts, RED, w);
};
const dunes = (c: Ctx, top: number) => {
  c.fillStyle = SAND; c.fillRect(0, top, 1080, 1080 - top);
  shape(c, () => { c.moveTo(0, top + 40); c.bezierCurveTo(200, top - 70, 400, top - 20, 560, top + 30); c.bezierCurveTo(740, top + 80, 900, top - 50, 1080, top + 20); c.lineTo(1080, 1080); c.lineTo(0, 1080); c.closePath(); }, SAND, 6);
};
const panel = (c: Ctx, x: number, y: number, w: number, h: number, body: () => void) => {
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 28); c.clip(); c.translate(x, y); body(); c.restore();
  shape(c, () => rrect(c, x, y, w, h, 28), "rgba(0,0,0,0)", 8);
};

// ---------------------------------------------------------------- animals and plants
// a camel (one hump) in profile facing right, feet at (x, y), scale s (1 = about 420 px long)
const camel = (c: Ctx, x: number, y: number, s: number, o: { flip?: boolean; hump?: number; dk?: boolean } = {}) => {
  const hump = o.hump ?? 1, B = o.dk ? "#c79546" : CAM, BD = o.dk ? "#a67a33" : CAM_DK, w = 6 / s;
  shadow(c, x + 10 * s, y + 4, 190 * s, 15 * s);
  c.save(); c.translate(x, y); c.scale((o.flip ? -1 : 1) * s, s);
  const leg = (lx: number, col: string) => { shape(c, () => rrect(c, lx - 15, -230, 30, 230, 10), col, w); shape(c, () => rrect(c, lx - 22, -16, 46, 18, 9), "#8d6a3a", w); };
  leg(-105, BD); leg(95, BD); leg(-72, B); leg(128, B);
  line(c, [[-150, -250], [-178, -215], [-172, -165]], 18, INK); line(c, [[-150, -250], [-178, -215], [-172, -165]], 8, BD);
  shape(c, () => ell(c, -35, -305, 52, 56 * hump), B, w);
  const body = () => ell(c, 0, -235, 165, 66);
  shape(c, body, B, w); shade(c, body, BD, 14, 20, 0.5);
  shape(c, () => ell(c, -35, -280, 44, 30), B, 0);
  line(c, [[95, -265], [160, -320], [200, -368]], 70, INK); line(c, [[95, -265], [160, -320], [200, -368]], 58, B);
  shape(c, () => ell(c, 200, -380, 52, 30, 0.3), B, w);
  shape(c, () => ell(c, 238, -368, 26, 21, 0.3), "#ecc787", w * 0.8);
  shape(c, () => ell(c, 168, -402, 10, 20, -0.5), BD, w * 0.8);
  shape(c, () => ell(c, 205, -388, 6, 8), INK, 0);
  c.restore();
};
const frog = (c: Ctx, x: number, y: number, s: number) => {
  const w = 6 / s; shadow(c, x + 10 * s, y + 4, 130 * s, 14 * s);
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => ell(c, -50, -50, 70, 46, -0.3), COL.leaf, w);
  shape(c, () => ell(c, 60, -10, 80, 14), COL.leaf, w);
  const body = () => ell(c, 0, -85, 112, 80, -0.1);
  shape(c, body, COL.green, w); shade(c, body, COL.greenDk, 12, 18, 0.5);
  shape(c, () => ell(c, 40, -60, 70, 44, -0.2), COL.greenLt, w * 0.7);
  for (const ex of [45, 95]) { shape(c, () => ell(c, ex, -158, 30, 30), COL.green, w); shape(c, () => ell(c, ex + 6, -160, 15, 15), WHITE, w * 0.7); shape(c, () => ell(c, ex + 9, -160, 7, 9), INK, 0); }
  line(c, [[40, -105], [105, -100], [125, -88]], 6 / s, INK);
  shape(c, () => ell(c, 60, -3, 40, 12), COL.leaf, w);
  c.restore();
};
const cactus = (c: Ctx, x: number, y: number, s: number) => {
  const w = 6 / s; shadow(c, x + 20 * s, y + 4, 150 * s, 15 * s);
  c.save(); c.translate(x, y); c.scale(s, s);
  const arm = (side: number, up: number) => {
    const p = () => { rrect(c, side * 50 - (side > 0 ? 0 : 80), -150 - up * 0, 80, 46, 23); rrect(c, side * 100 + (side > 0 ? 0 : -50) - (side > 0 ? 0 : 0), -100 - 80 - up, 50, 80 + up + 50, 25); };
    shape(c, p, COL.green, w); shade(c, p, COL.greenDk, 10, 0, 0.45);
  };
  arm(-1, 60); arm(1, 0);
  const trunk = () => rrect(c, -55, -420, 110, 420, 55);
  shape(c, trunk, COL.green, w); shade(c, trunk, COL.greenDk, 20, 0, 0.5);
  for (const rx of [-22, 0, 22]) line(c, [[rx, -380], [rx, -20]], 3 / s, COL.greenDk);
  for (let k = 0; k < 8; k++) for (const sx of [-34, 34]) line(c, [[sx, -370 + k * 44], [sx + Math.sign(sx) * 14, -378 + k * 44]], 3 / s, INK);
  shape(c, () => { ell(c, 0, -428, 22, 14); }, COL.pink, w * 0.8);
  c.restore();
};
const fish = (c: Ctx, x: number, y: number, L: number, dir: number, o: { eye?: boolean; col: string; dk: string }) => {
  c.save(); c.translate(x, y); c.scale(dir, 1);
  const w = Math.max(4, L * 0.016);
  shape(c, () => polyP(c, [[-L * 0.34, 0], [-L * 0.56, -L * 0.2], [-L * 0.5, 0], [-L * 0.56, L * 0.2]]), o.dk, w);
  shape(c, () => polyP(c, [[-L * 0.1, -L * 0.2], [L * 0.1, -L * 0.34], [-L * 0.2, -L * 0.17]]), o.dk, w);
  const bodyP = () => { c.moveTo(L * 0.5, 0); c.bezierCurveTo(L * 0.3, -L * 0.28, -L * 0.2, -L * 0.26, -L * 0.38, -L * 0.05); c.lineTo(-L * 0.38, L * 0.05); c.bezierCurveTo(-L * 0.2, L * 0.26, L * 0.3, L * 0.28, L * 0.5, 0); c.closePath(); };
  shape(c, bodyP, o.col, w); shade(c, bodyP, o.dk, L * 0.04, L * 0.07, 0.55);
  shape(c, () => polyP(c, [[-L * 0.05, L * 0.2], [L * 0.04, L * 0.3], [L * 0.08, L * 0.2]]), o.dk, w);
  line(c, [[L * 0.22, -L * 0.18], [L * 0.16, 0], [L * 0.22, L * 0.18]], w, INK);
  if (o.eye) { shape(c, () => ell(c, L * 0.34, -L * 0.05, L * 0.07, L * 0.07), WHITE, w * 0.8); shape(c, () => ell(c, L * 0.36, -L * 0.05, L * 0.035, L * 0.04), INK, 0); }
  else line(c, [[L * 0.4, -L * 0.02], [L * 0.46, 0]], w * 0.8, INK);
  c.restore();
};
// a curled-up snow leopard, asleep
const snowLeopard = (c: Ctx, x: number, y: number, s: number) => {
  const w = 6 / s; shadow(c, x + 10 * s, y + 4, 170 * s, 16 * s);
  c.save(); c.translate(x, y); c.scale(s, s);
  const body = () => ell(c, 0, -90, 160, 90);
  shape(c, body, "#d9d5d0", w); shade(c, body, "#aaa6a4", 14, 20, 0.5);
  for (const [sx, sy] of [[-60, -140], [-10, -150], [40, -135], [90, -105], [-95, -90], [20, -100], [-40, -95], [70, -60]]) shape(c, () => ell(c, sx, sy, 15, 11), "rgba(0,0,0,0)", w);
  line(c, [[130, -75], [165, -40], [90, -12], [-40, -8], [-120, -25]], 50, INK); line(c, [[130, -75], [165, -40], [90, -12], [-40, -8], [-120, -25]], 38, "#d9d5d0");
  for (const [tx, ty] of [[160, -50], [120, -17], [60, -10], [0, -8], [-60, -12]]) line(c, [[tx - 6, ty - 14], [tx + 6, ty + 14]], 9, "#6f6a75");
  shape(c, () => ell(c, -105, -55, 62, 52), "#e6e2dd", w);
  for (const sx of [-1, 1]) shape(c, () => polyP(c, [[-105 + sx * 52, -92], [-105 + sx * 38, -118], [-105 + sx * 18, -98]]), "#d9d5d0", w);
  for (const sx of [-1, 1]) line(c, [[-105 + sx * 36 - 11, -58], [-105 + sx * 36, -52], [-105 + sx * 36 + 11, -58]], 4 / s, INK);
  shape(c, () => ell(c, -105, -38, 11, 8), COL.pink, w * 0.6);
  c.restore();
};
const yak = (c: Ctx, x: number, y: number, s: number, hot: boolean) => {
  const w = 6 / s; shadow(c, x + 10 * s, y + 4, 215 * s, 16 * s);
  c.save(); c.translate(x, y); c.scale(s, s);
  const DK = "#4a3b34", DD = "#33282a";
  for (const lx of [-130, -60, 70, 140]) shape(c, () => rrect(c, lx - 17, -110, 34, 110, 8), lx < 0 ? DD : DK, w);
  const body = () => ell(c, -10, -200, 200, 105);
  shape(c, body, DK, w);
  const skirt = () => { c.moveTo(-205, -190); for (let k = 0; k <= 9; k++) { c.lineTo(-205 + k * 42 + 21, -70 + (k % 2 ? 0 : 0)); c.lineTo(-205 + (k + 1) * 42, -150); } c.lineTo(185, -190); c.closePath(); };
  shape(c, skirt, DK, w); shade(c, body, DD, 18, 30, 0.45);
  shape(c, () => ell(c, 60, -290, 70, 44), DK, w);
  shape(c, () => ell(c, 30, -270, 90, 50), DK, 0);
  shape(c, () => ell(c, 205, -170, 68, 62, 0.2), DK, w);
  shape(c, () => ell(c, 250, -150, 34, 30), "#8d7a6c", w * 0.8);
  line(c, [[190, -215], [210, -265], [180, -300], [140, -300]], 20, INK); line(c, [[190, -215], [210, -265], [180, -300], [140, -300]], 11, "#efe3c8");
  shape(c, () => ell(c, 215, -185, 8, 10), WHITE, 0); shape(c, () => ell(c, 217, -185, 4, 6), INK, 0);
  if (hot) { shape(c, () => ell(c, 262, -118, 13, 24), COL.pink, w * 0.7); line(c, [[240, -135], [270, -135]], 5 / s, INK); }
  else { c.beginPath(); c.arc(247, -130, 18, 0.1, Math.PI * 0.75); c.strokeStyle = INK; c.lineWidth = 5 / s; c.stroke(); }
  c.restore();
};
const duckFoot = (c: Ctx, x: number, y: number, s: number) => {
  const w = 7 / s; c.save(); c.translate(x, y); c.scale(s, s);
  line(c, [[0, -170], [0, 0]], 40, INK); line(c, [[0, -170], [0, 0]], 28, COL.orange);
  const web = () => { c.moveTo(0, -4); c.lineTo(-135, 125); c.quadraticCurveTo(-95, 130, -52, 110); c.quadraticCurveTo(-30, 150, 0, 160); c.quadraticCurveTo(30, 150, 52, 110); c.quadraticCurveTo(95, 130, 135, 125); c.closePath(); };
  shape(c, web, "#f6b04d", w); shade(c, web, COL.orange, 14, 14, 0.5);
  for (const tx of [-135, 0, 135]) line(c, [[0, -4], [tx, tx === 0 ? 160 : 125]], 12 / s * s, INK);
  c.restore();
};
const shirt = (c: Ctx, x: number, y: number, s: number, col: string, dk: string) => {
  const p = () => polyP(c, [[x - 60 * s, y], [x - 30 * s, y - 14 * s], [x, y - 4 * s], [x + 30 * s, y - 14 * s], [x + 60 * s, y], [x + 80 * s, y + 40 * s], [x + 50 * s, y + 55 * s], [x + 40 * s, y + 35 * s], [x + 40 * s, y + 130 * s], [x - 40 * s, y + 130 * s], [x - 40 * s, y + 35 * s], [x - 50 * s, y + 55 * s], [x - 80 * s, y + 40 * s]]);
  shape(c, p, col, 6); shade(c, p, dk, 10 * s, 0, 0.5);
};
const towel = (c: Ctx, cx: number, cy: number, rx: number, ry: number) => {
  const p = () => polyP(c, [[cx - 0.62 * rx, cy - 0.34 * ry], [cx + 0.5 * rx, cy - 0.4 * ry], [cx + 0.64 * rx, cy + 0.3 * ry], [cx - 0.5 * rx, cy + 0.4 * ry]]);
  shape(c, p, TOWEL, 5); shade(c, p, TOWEL_DK, -rx * 0.06, -ry * 0.12, 0.55);
};
const plate = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shadow(c, x + rx * 0.08, y + ry * 0.25, rx, ry);
  shape(c, () => ell(c, x, y, rx, ry), COL.steel); shape(c, () => ell(c, x, y - ry * 0.04, rx * 0.84, ry * 0.8), COL.steelIn, 4);
};
const roll = (c: Ctx, cx: number, cy: number, rx: number, ry: number) => {
  const R = ry * 0.46, x1 = cx - rx * 0.5, x2 = cx + rx * 0.5, body = () => rrect(c, x1, cy - R, x2 - x1, 2 * R, R * 0.2);
  shape(c, () => ell(c, x1, cy, R * 0.5, R), TOWEL); shape(c, body, TOWEL); shade(c, body, TOWEL_DK, 0, -R * 0.7, 0.6);
  shape(c, () => ell(c, x2, cy, R * 0.5, R), "#d3e6f6");
  const sp: number[][] = []; for (let t = 0; t < 3.2 * Math.PI; t += 0.25) sp.push([x2 + Math.cos(t) * R * 0.5 * (t / 10), cy + Math.sin(t) * R * (t / 10)]);
  line(c, sp, 4, TOWEL_DK);
};
const covered = (c: Ctx, cx: number, cy: number, rx: number, ry: number) => {
  towel(c, cx, cy, rx, ry);
  const p = () => polyP(c, [[cx - 0.74 * rx, cy - 0.4 * ry], [cx + 0.6 * rx, cy - 0.48 * ry], [cx + 0.77 * rx, cy + 0.36 * ry], [cx - 0.6 * rx, cy + 0.48 * ry]]);
  shape(c, p, "rgba(222,242,253,0.55)", 5); c.save(); c.beginPath(); p(); c.strokeStyle = COL.glassEdge; c.lineWidth = 4; c.stroke(); c.restore();
  shine(c, [[cx - rx * 0.5, cy - ry * 0.3], [cx - rx * 0.1, cy - ry * 0.42]], 9);
};
// a leaf lying flat: tip to the right
const flatLeaf = (c: Ctx, x: number, y: number, L: number, W: number, fill: string, dk: string, wilt = false) => {
  const p = () => { c.moveTo(x - L / 2, y); c.bezierCurveTo(x - L * 0.2, y - W, x + L * 0.25, y - W * 0.9, x + L / 2, y); c.bezierCurveTo(x + L * 0.25, y + W * 0.9, x - L * 0.2, y + W, x - L / 2, y); c.closePath(); };
  line(c, [[x - L / 2 - 50, y + 6], [x - L / 2, y]], 20, INK); line(c, [[x - L / 2 - 50, y + 6], [x - L / 2, y]], 10, COL.greenLt);
  shape(c, p, fill, 6); shade(c, p, dk, 10, 18, 0.45);
  line(c, [[x - L / 2, y], [x + L * 0.42, y]], 5, dk);
  for (const t of [-0.25, 0, 0.22]) for (const sg of [-1, 1]) line(c, [[x + L * t, y], [x + L * (t + 0.15), y + sg * W * 0.6]], 3.5, dk);
  if (wilt) { shape(c, p, "rgba(214,190,70,0.45)", 0); }
};
const sheetOf = (c: Ctx, pts: number[][], fill = WHITE) => { shape(c, () => polyP(c, pts), fill, 6); };

// the child's face with a red blindfold over the eyes
const blindfold = (c: Ctx, x: number, y: number, h: number) => {
  const head = h * 0.13, hy = y - h * 0.74 - head * 1.05;
  shape(c, () => rrect(c, x - head * 1.04, hy - head * 0.26, head * 2.08, head * 0.52, 8), COL.red, 5);
  line(c, [[x + head * 1.0, hy], [x + head * 1.45, hy + head * 0.5]], 9, COL.red);
};

// ================================================================= the cards
// e1: three wet towels, flat, rolled, covered: the flat one loses the most water
const e1 = (c: Ctx) => {
  ground(c);
  sun(c, 130, 130, 55);
  const xs = [200, 540, 880];
  xs.forEach((x) => plate(c, x, 760, 160, 100));
  towel(c, xs[0], 755, 168, 105); roll(c, xs[1], 755, 168, 105); covered(c, xs[2], 755, 168, 105);
  [[0, 3], [1, 2], [2, 1]].forEach(([i, n]) => { for (let k = 0; k < n; k++) vapour(c, xs[i] - (n - 1) * 45 + k * 90, 600, 150 + (3 - n) * -25 + n * 40, 9); });
};
// e3: a plain leaf going limp beside a leaf with a coat of jelly, and the jar
const e3 = (c: Ctx) => {
  ground(c);
  plate(c, 290, 560, 250, 120); plate(c, 790, 560, 250, 120);
  flatLeaf(c, 305, 520, 290, 95, "#a9b45a", "#7f8a3a", true);
  flatLeaf(c, 800, 520, 290, 95, COL.leaf, COL.leafDk);
  c.globalAlpha = 0.35; shape(c, () => ell(c, 800, 520, 150, 55), "#fff6c0", 0); c.globalAlpha = 1;
  shine(c, [[690, 485], [820, 468]], 12); shine(c, [[860, 478], [905, 490]], 9);
  vapour(c, 270, 400, 120, 9); vapour(c, 340, 400, 100, 9);
  // jar of jelly
  shadow(c, 540, 905, 130, 22);
  shape(c, () => rrect(c, 440, 780, 200, 125, 24), "rgba(255,246,190,0.9)", 6);
  shape(c, () => rrect(c, 428, 750, 224, 48, 12), COL.steel, 6);
  shine(c, [[470, 810], [470, 880]], 9);
  shape(c, () => ell(c, 540, 845, 55, 40), "#fffbe0", 4);
};
// a2: blindfolded child walking down a passage, feeling ahead with a long rolled newspaper
const a2 = (c: Ctx) => {
  ground(c, "#f3ead8");
  c.fillStyle = "#e0c99a"; c.fillRect(0, 820, 1080, 260); line(c, [[0, 820], [1080, 820]], 6);
  shape(c, () => rrect(c, 800, 260, 280, 560, 0), "#d9c2a0", 6);
  shape(c, () => rrect(c, 846, 420, 150, 400, 10), COL.brown, 6);
  const h = 640, px = 300, py = 900;
  person(c, px, py, h, { armR: [-0.05, 0.02], armL: [Math.PI * 0.55, Math.PI * 0.5] });
  blindfold(c, px, py, h);
  const wy = py - h * 0.74 + h * 0.03 + Math.sin(-0.05) * h * 0.17 + Math.sin(0.02) * h * 0.16;
  const wx = px + h * 0.11 + Math.cos(-0.05) * h * 0.17 + Math.cos(0.02) * h * 0.16;
  line(c, [[wx - 80, wy + 4], [800, wy - 4]], 36, INK); line(c, [[wx - 80, wy + 4], [800, wy - 4]], 24, WHITE);
  for (const t of [0.2, 0.4, 0.6, 0.8]) line(c, [[wx - 80 + (800 - wx + 80) * t, wy - 6], [wx - 80 + (800 - wx + 80) * t + 40, wy - 6]], 4, COL.grey);
  shape(c, () => ell(c, wx, wy, 26, 26), SKIN.child, 5);
  arrow(c, [[480, 330], [640, 330]], RED, 12);
};
// a5: water on two leaves: beads on a waxy one, spread flat on a thin one
const a5 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(0, 110);
  const big = (x: number, y: number, col: string, dk: string) => {
    const p = () => { c.moveTo(x - 210, y); c.bezierCurveTo(x - 190, y - 220, x + 190, y - 220, x + 210, y); c.bezierCurveTo(x + 190, y + 190, x - 190, y + 190, x - 210, y); c.closePath(); };
    shape(c, p, col, 7); shade(c, p, dk, 14, 20, 0.45);
    line(c, [[x - 210, y], [x + 190, y]], 7, dk);
    for (const t of [-110, -20, 70]) for (const sg of [-1, 1]) line(c, [[x + t, y], [x + t + 60, y + sg * 110]], 4, dk);
  };
  big(290, 560, "#8cc16a", COL.leafDk);
  big(790, 560, "#58a14a", COL.leafDk);
  // beads on the waxy leaf, left
  [[230, 470, 28], [330, 500, 22], [260, 580, 32], [370, 600, 20], [180, 560, 18], [300, 420, 18]].forEach(([x, y, r]) => { shape(c, () => ell(c, x, y, r, r * 0.85), COL.drop, 4); shine(c, [[x - r * 0.45, y - r * 0.35], [x - r * 0.15, y - r * 0.55]], 5); });
  // a flat wet patch on the thin leaf, right
  shape(c, () => { c.moveTo(690, 560); c.bezierCurveTo(700, 480, 880, 470, 900, 560); c.bezierCurveTo(890, 650, 710, 650, 690, 560); c.closePath(); }, "rgba(190,225,245,0.8)", 4);
  shine(c, [[730, 520], [790, 505]], 7);
  // the drop falling from a spoon-like dropper above each
  dropShape(c, 290, 230, 24); dropShape(c, 790, 230, 24);
  arrow(c, [[290, 290], [290, 345]], RED, 9); arrow(c, [[790, 290], [790, 345]], RED, 9);
  c.restore();
};
// a6: drawing a made-up animal and joining each feature to the problem it solves
const a6 = (c: Ctx) => {
  ground(c, "#e9dcc2");
  c.save(); c.translate(540, 560); c.rotate(-0.04);
  shape(c, () => rrect(c, -430, -400, 860, 780, 12), WHITE, 6);
  // the made-up animal: round furry body, wide webbed feet, big ears, huge eyes
  const body = () => ell(c, 0, 20, 150, 120);
  for (const sx of [-1, 1]) shape(c, () => polyP(c, [[sx * 100 - 38, -80], [sx * 140, -190], [sx * 100 + 38, -80]]), "#b09ad8", 6);
  shape(c, body, "#c8b4ea", 6); shade(c, body, "#a58cd0", 14, 20, 0.5);
  for (let k = 0; k < 9; k++) { const a = Math.PI * 0.1 + k * 0.38; line(c, [[Math.cos(a) * 150, 20 + Math.sin(a) * 120], [Math.cos(a) * 172, 20 + Math.sin(a) * 138]], 6); }
  for (const sx of [-1, 1]) { shape(c, () => ell(c, sx * 60, -20, 44, 44), WHITE, 5); shape(c, () => ell(c, sx * 62, -18, 22, 22), INK, 0); }
  for (const sx of [-1, 1]) shape(c, () => polyP(c, [[sx * 60, 128], [sx * 60 - 56, 172], [sx * 60, 178], [sx * 60 + 56, 172]]), COL.orange, 6);
  // little pictures of the problem each feature answers, joined by lines
  const join = (fx: number, fy: number, ix: number, iy: number) => line(c, [[fx, fy], [ix, iy]], 5, INK);
  join(-150, 40, -300, 150); join(-110, -170, -300, -230); join(80, 170, 300, 230); join(150, -30, 300, -100);
  flake(c, -310, 150, 38); moon(c, -310, -235, 36); dropShape(c, 305, 235, 22); sun(c, 310, -100, 30);
  c.restore();
  hand(c, 140, 980, -0.9, 1, SKIN.child, CLOTH.child, false);
  line(c, [[218, 950], [430, 790]], 26, INK); line(c, [[218, 950], [430, 790]], 14, COL.yellow);
  shape(c, () => polyP(c, [[430, 790], [470, 764], [452, 818]]), "#f2d9b3", 4);
};
// p1: a notebook with a crow sketched on one page and a plant in a pot on the other
const p1 = (c: Ctx) => {
  ground(c, "#e9dcc2");
  shadow(c, 560, 880, 470, 40);
  shape(c, () => polyP(c, [[70, 260], [540, 300], [540, 860], [70, 820]]), WHITE, 7);
  shape(c, () => polyP(c, [[1010, 260], [540, 300], [540, 860], [1010, 820]]), "#fffaf0", 7);
  line(c, [[540, 300], [540, 860]], 8);
  for (let k = 0; k < 5; k++) { line(c, [[600, 620 + k * 40], [960, 610 + k * 40]], 3, COL.grey); }
  // the crow, left page
  const crow = () => { c.moveTo(130, 540); c.bezierCurveTo(130, 420, 250, 380, 330, 430); c.bezierCurveTo(400, 360, 470, 400, 460, 470); c.lineTo(500, 480); c.lineTo(455, 505); c.bezierCurveTo(430, 600, 270, 640, 130, 540); c.closePath(); };
  shape(c, crow, "#4a4650", 6); shape(c, () => ell(c, 436, 456, 9, 9), WHITE, 0); shape(c, () => ell(c, 438, 456, 4, 4), INK, 0);
  line(c, [[250, 610], [250, 690]], 8); line(c, [[320, 610], [320, 690]], 8); line(c, [[230, 700], [290, 700]], 7); line(c, [[300, 700], [350, 700]], 7);
  for (let k = 0; k < 3; k++) line(c, [[120, 740 + k * 30], [330 - k * 40, 735 + k * 30]], 3, COL.grey);
  // the plant in a pot, right page
  shape(c, () => polyP(c, [[690, 500], [830, 500], [810, 580], [710, 580]]), COL.orange, 5);
  line(c, [[760, 500], [760, 420]], 7, COL.leafDk); leaf(c, 760, 440, 90, -0.8); leaf(c, 760, 450, 90, -2.3); leaf(c, 760, 420, 80, -1.57);
  // a pencil lying across
  line(c, [[700, 930], [1020, 760]], 30, INK); line(c, [[700, 930], [1020, 760]], 18, COL.yellow);
  shape(c, () => polyP(c, [[700, 930], [662, 950], [706, 903]]), "#f2d9b3", 4);
};
// term.0 Habitat: a camel in the desert and a frog in a pond
const t0 = (c: Ctx) => {
  ground(c);
  panel(c, 30, 130, 500, 820, () => {
    c.fillStyle = COL.sky; c.fillRect(0, 0, 500, 820);
    sun(c, 120, 120, 50);
    c.save(); c.translate(-30, -130); dunes(c, 600); c.restore();
    camel(c, 270, 700, 0.9);
  });
  panel(c, 550, 130, 500, 820, () => {
    c.fillStyle = COL.sky; c.fillRect(0, 0, 500, 820);
    c.fillStyle = COL.leaf; c.fillRect(0, 380, 500, 440);
    shape(c, () => { c.moveTo(-10, 470); c.bezierCurveTo(100, 420, 400, 420, 510, 470); c.lineTo(510, 830); c.lineTo(-10, 830); c.closePath(); }, COL.water, 6);
    shape(c, () => ell(c, 120, 640, 70, 24), COL.leaf, 5); shape(c, () => ell(c, 360, 560, 60, 20), COL.leaf, 5);
    shape(c, () => ell(c, 120, 640, 12, 6), COL.pink, 0);
    frog(c, 280, 500, 0.9);
    for (const r of [40, 70]) { c.beginPath(); c.ellipse(120, 640, r * 1.4, r * 0.4, 0, 0, Math.PI * 2); c.strokeStyle = "rgba(255,255,255,0.7)"; c.lineWidth = 4; c.stroke(); }
  });
};
// term.1 Adaptation: a thin pole sinks into sand, a camel's wide foot stays on top
const t1 = (c: Ctx) => {
  ground(c, COL.sky);
  c.fillStyle = SAND; c.fillRect(0, 580, 1080, 500);
  line(c, [[0, 580], [1080, 580]], 7);
  // a thin pole sunk into the sand (left)
  shape(c, () => ell(c, 250, 585, 100, 18), SAND_DK, 5);
  shape(c, () => rrect(c, 232, 280, 36, 380, 8), "#9a9aa4", 6);
  shape(c, () => ell(c, 250, 580, 56, 14), SAND, 0);
  arrow(c, [[250, 180], [250, 250]], RED, 11);
  // the camel's leg and wide foot (right)
  shape(c, () => rrect(c, 700, 120, 130, 340, 30), CAM, 6);
  for (const hy of [180, 250, 320, 390]) line(c, [[716, hy], [740, hy + 20]], 5, CAM_DK);
  const pad = () => { c.moveTo(690, 440); c.lineTo(840, 440); c.quadraticCurveTo(1010, 450, 1010, 540); c.lineTo(1010, 580); c.lineTo(560, 580); c.lineTo(560, 540); c.quadraticCurveTo(570, 450, 690, 440); c.closePath(); };
  shape(c, pad, "#c99a55", 6); shade(c, pad, CAM_DK, 14, 18, 0.5);
  line(c, [[785, 480], [785, 580]], 6, "#8d6a3a");
  arrow(c, [[960, 330], [960, 410]], RED, 11);
};
// term.2 Acclimatise: a hot day, a child drinking, two weeks crossed off
const t2 = (c: Ctx) => {
  ground(c, "#fbe8c0");
  sun(c, 140, 140, 80);
  const h = 600, px = 330, py = 960;
  person(c, px, py, h, { armR: [-0.4, -2.84] });
  const wx = px + h * 0.11 + Math.cos(-0.4) * h * 0.17 + Math.cos(-2.84) * h * 0.16, wy = py - h * 0.74 + h * 0.03 + Math.sin(-0.4) * h * 0.17 + Math.sin(-2.84) * h * 0.16;
  c.save(); c.translate(wx + 10, wy - 16); c.rotate(-0.45); c.scale(1.5, 1.5);
  shape(c, () => polyP(c, [[-34, -50], [34, -50], [26, 50], [-26, 50]]), COL.steel, 6); shade(c, () => polyP(c, [[-34, -50], [34, -50], [26, 50], [-26, 50]]), COL.steelDk, 12, 0, 0.5);
  shape(c, () => ell(c, 0, -50, 34, 8), COL.steelIn, 4); c.restore();
  for (const [dx, dy] of [[-100, -540], [110, -520], [-120, -450]]) dropShape(c, px + dx, py + dy, 16);
  // the calendar: two rows of seven, all crossed off
  shape(c, () => rrect(c, 610, 300, 440, 330, 20), WHITE, 7);
  shape(c, () => rrect(c, 610, 300, 440, 70, 20), COL.red, 7);
  for (const bx of [680, 980]) line(c, [[bx, 280], [bx, 330]], 12);
  for (let r = 0; r < 2; r++) for (let k = 0; k < 7; k++) { const x = 640 + k * 56, y = 400 + r * 100; line(c, [[x, y], [x + 38, y + 68]], 8, RED); line(c, [[x + 38, y], [x, y + 68]], 8, RED); }
  arrow(c, [[700, 700], [900, 700]], RED, 12);
  dropShape(c, 960, 840, 20); dropShape(c, 840, 880, 28); dropShape(c, 740, 830, 20);
};
// term.3 Evaporate: wet washing on a line, water leaving it as vapour
const t3 = (c: Ctx) => {
  ground(c, COL.sky);
  sun(c, 900, 150, 70);
  c.fillStyle = "#e7dcc6"; c.fillRect(0, 880, 1080, 200); line(c, [[0, 880], [1080, 880]], 6);
  for (const px of [60, 1020]) { shape(c, () => rrect(c, px - 14, 280, 28, 610, 6), COL.steelDk, 6); }
  line(c, [[60, 300], [540, 360], [1020, 300]], 7);
  shirt(c, 300, 372, 1.8, "#f39a3c", "#d27c25"); shirt(c, 760, 372, 1.8, "#5b8fd6", "#3f6fb3");
  for (const [x, y] of [[270, 640], [330, 690], [740, 660], [800, 620]]) dropShape(c, x, y, 10);
  for (const x of [270, 340, 400, 640, 710, 780]) vapour(c, x, 330, 150 + (x % 3) * 20, 8);
};
// term.4 Surface: a flat sheet shows its whole surface to the air; the same sheet rolled hides most of it
const t4 = (c: Ctx) => {
  ground(c);
  sheetOf(c, [[60, 460], [520, 400], [560, 760], [100, 830]]);
  shade(c, () => polyP(c, [[60, 460], [520, 400], [560, 760], [100, 830]]), "#e3dccd", 18, 24, 0.5);
  shape(c, () => rrect(c, 700, 480, 300, 330, 40), "rgba(0,0,0,0)", 0);
  const body = () => rrect(c, 710, 450, 280, 330, 20);
  shape(c, body, WHITE, 6); shade(c, body, "#e3dccd", 0, -120, 0.6);
  shape(c, () => ell(c, 850, 780, 140, 46), "#e9e3d4", 6);
  const sp: number[][] = []; for (let t = 0; t < 4.4 * Math.PI; t += 0.2) sp.push([850 + Math.cos(t) * 130 * (t / 14), 780 + Math.sin(t) * 40 * (t / 14)]);
  line(c, sp, 5, COL.grey);
  arrow(c, [[590, 590], [670, 590]], RED, 12);
  for (const [x, y] of [[90, 380], [230, 340], [380, 320], [520, 340], [600, 470], [600, 640], [130, 880], [320, 890], [500, 870], [40, 560], [40, 720]]) dot(c, x, y, 14);
  for (const [x, y] of [[700, 400], [880, 380], [1030, 420], [1040, 620], [1040, 760], [680, 800]]) dot(c, x, y, 14);
};
// term.7 Stomata: under a lens, tiny mouths in the leaf skin, some open and some shut
const stoma = (c: Ctx, x: number, y: number, open: boolean, s = 1) => {
  const gap = open ? 20 * s : 0, cell = (cy: number) => shape(c, () => ell(c, x, cy, 78 * s, 28 * s), COL.greenLt, 5);
  if (open) shape(c, () => ell(c, x, y, 62 * s, gap + 6), "#3a2f45", 0);
  cell(y - 26 * s - gap); cell(y + 26 * s + gap);
  if (!open) line(c, [[x - 60 * s, y], [x + 60 * s, y]], 4, INK);
};
const t7 = (c: Ctx) => {
  ground(c);
  const cx = 470, cy = 470, R = 340;
  c.save(); c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.clip();
  c.fillStyle = "#cfe8a8"; c.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  for (let r = 0; r < 9; r++) for (let k = 0; k < 7; k++) { const x = cx - R + 40 + k * 108 + (r % 2) * 54, y = cy - R + 30 + r * 80; shape(c, () => ell(c, x, y, 58, 40), r % 2 ? "#c2de96" : "#d6edb5", 3); }
  c.restore();
  for (const [x, y, o] of [[360, 330, true], [600, 380, false], [330, 580, false], [570, 590, true]] as [number, number, boolean][]) stoma(c, x, y, o, 0.95);
  shape(c, () => c.arc(cx, cy, R, 0, Math.PI * 2), "rgba(255,255,255,0.12)", 14);
  shine(c, [[cx - R * 0.7, cy - R * 0.45], [cx - R * 0.45, cy - R * 0.72]], 16);
  line(c, [[cx + R * 0.72, cy + R * 0.72], [930, 930]], 52, INK); line(c, [[cx + R * 0.72, cy + R * 0.72], [930, 930]], 40, COL.wood);
  leaf(c, 80, 1020, 330, -0.5); 
};
// term.20 Breathing roots: roots standing up out of the mud round a mangrove tree, taking in air
const t20 = (c: Ctx) => {
  ground(c, COL.sky);
  c.fillStyle = "#cfe9d0"; c.fillRect(0, 560, 1080, 120);
  // trunk and prop roots
  const trunk = () => { c.moveTo(500, 600); c.bezierCurveTo(500, 460, 510, 380, 520, 300); c.lineTo(580, 300); c.bezierCurveTo(590, 400, 600, 520, 640, 640); c.lineTo(660, 780); c.lineTo(440, 780); c.lineTo(470, 640); c.closePath(); };
  shape(c, trunk, "#8a6544", 7);
  for (const [bx, by, r] of [[400, 240, 150], [560, 190, 170], [700, 250, 150], [520, 290, 120]]) shape(c, () => ell(c, bx, by, r, r * 0.7), COL.leaf, 6);
  // mud with water over it
  shape(c, () => { c.moveTo(0, 790); c.lineTo(1080, 790); c.lineTo(1080, 1080); c.lineTo(0, 1080); c.closePath(); }, MUD, 6);
  const rr = [ [90, 90], [170, 130], [250, 80], [330, 140], [410, 100], [480, 150], [700, 110], [770, 150], [850, 90], [930, 130], [1000, 100], [620, 75], [140, 60], [300, 60] ];
  rr.forEach(([x, h], i) => { const by = 800 + (i % 3) * 14; shape(c, () => rrect(c, x - 11, by - h - 70, 22, h + 80, 11), "#a07c58", 5); });
  c.fillStyle = "rgba(143,195,234,0.55)"; c.fillRect(0, 700, 1080, 90); line(c, [[0, 700], [1080, 700]], 4, COL.waterDk);
  rr.filter((_, i) => i % 4 === 0).forEach(([x, h]) => { dot(c, x - 24, 800 - h - 130, 11); dot(c, x + 28, 800 - h - 160, 9); arrow(c, [[x, 800 - h - 160], [x, 800 - h - 100]], RED, 8); });
  for (let k = 0; k < 6; k++) shape(c, () => ell(c, 60 + k * 190, 900 + (k % 2) * 60, 50, 12), MUD_DK, 0);
};
// term.21 Generation: a grandmother, a mother and a child, tallest to shortest
const t21 = (c: Ctx) => {
  ground(c);
  line(c, [[40, 940], [1040, 940]], 6);
  const gm = (x: number, y: number, h: number) => {
    person(c, x, y, h, { adult: true });
    const head = h * 0.13, hy = y - h * 0.74 - head * 1.05;
    shape(c, () => { c.moveTo(x - head * 1.04, hy + head * 0.1); c.bezierCurveTo(x - head, hy - head * 1.5, x + head, hy - head * 1.5, x + head * 1.04, hy + head * 0.1); c.quadraticCurveTo(x, hy - head * 0.5, x - head * 1.04, hy + head * 0.1); c.closePath(); }, "#e3dee6", 5);
    shape(c, () => ell(c, x, hy - head * 1.15, head * 0.45, head * 0.4), "#e3dee6", 5);
    shape(c, () => rrect(c, x - h * 0.14, y - h * 0.74 + h * 0.02, h * 0.28, h * 0.24, h * 0.06), COL.purple, 5);
  };
  gm(210, 940, 720);
  person(c, 540, 940, 640, { adult: true });
  person(c, 860, 940, 450);
};
// expl.0 What an adaptation is: four places, each with its problem and an answer
const e0 = (c: Ctx) => {
  ground(c);
  const S = 500;
  panel(c, 30, 30, S, S, () => { c.fillStyle = COL.sky; c.fillRect(0, 0, S, S); sun(c, 90, 90, 40); c.fillStyle = SAND; c.fillRect(0, 340, S, 200); line(c, [[0, 340], [S, 340]], 6); cactus(c, 250, 470, 0.62); });
  panel(c, 550, 30, S, S, () => { c.fillStyle = "#dbe9f5"; c.fillRect(0, 0, S, S); flake(c, 60, 70, 28); flake(c, 430, 60, 24); flake(c, 440, 200, 20); shape(c, () => { c.moveTo(-10, 400); c.lineTo(120, 330); c.lineTo(S + 10, 360); c.lineTo(S + 10, S + 10); c.lineTo(-10, S + 10); c.closePath(); }, SNOW, 6); snowLeopard(c, 260, 440, 0.8); });
  panel(c, 30, 550, S, S, () => { c.fillStyle = COL.sky; c.fillRect(0, 0, S, S); shape(c, () => { c.moveTo(-10, 150); c.bezierCurveTo(150, 120, 350, 180, S + 10, 140); c.lineTo(S + 10, S + 10); c.lineTo(-10, S + 10); c.closePath(); }, COL.water, 6); for (let k = 0; k < 3; k++) line(c, [[40 + k * 150, 90 + k * 26], [120 + k * 150, 90 + k * 26]], 4, "rgba(255,255,255,0.7)"); duckFoot(c, 250, 280, 0.9); });
  panel(c, 550, 550, S, S, () => { c.fillStyle = NIGHT; c.fillRect(0, 0, S, S); shape(c, () => { c.moveTo(-10, 60); c.lineTo(S + 10, 60); c.lineTo(S + 10, 100); c.lineTo(-10, 100); c.closePath(); }, "#5d5880", 0); shape(c, () => { c.moveTo(-10, 360); c.bezierCurveTo(100, 330, 400, 330, S + 10, 360); c.lineTo(S + 10, S + 10); c.lineTo(-10, S + 10); c.closePath(); }, "#3a4a6e", 6); fish(c, 250, 260, 330, 1, { col: "#f4c9c0", dk: "#dfa299" }); });
};
// expl.7 Cave fish: a river fish with good eyes, and a pale blind fish in a dark cave pool
const e7 = (c: Ctx) => {
  ground(c);
  panel(c, 30, 130, 500, 820, () => { c.fillStyle = COL.sky; c.fillRect(0, 0, 500, 820); sun(c, 400, 100, 44); shape(c, () => { c.moveTo(-10, 220); c.bezierCurveTo(130, 190, 350, 250, 510, 210); c.lineTo(510, 830); c.lineTo(-10, 830); c.closePath(); }, COL.water, 6); fish(c, 250, 520, 400, 1, { eye: true, col: "#b7c9d8", dk: "#8aa3b8" }); });
  panel(c, 550, 130, 500, 820, () => { c.fillStyle = NIGHT; c.fillRect(0, 0, 500, 820); shape(c, () => { c.moveTo(-10, 0); for (let k = 0; k < 6; k++) c.lineTo(k * 100 + 40, 90 + (k % 2) * 60); c.lineTo(510, 0); c.closePath(); }, "#46406a", 6); shape(c, () => { c.moveTo(-10, 300); c.bezierCurveTo(130, 270, 350, 330, 510, 290); c.lineTo(510, 830); c.lineTo(-10, 830); c.closePath(); }, "#2a3d63", 6); fish(c, 250, 560, 400, -1, { col: "#f4c9c0", dk: "#dfa299" }); });
};
// expl.8 Where adaptations come from: camels down the generations, each a little different
const e8 = (c: Ctx) => {
  ground(c, "#fbe8c0");
  sun(c, 900, 120, 70);
  const rowsY = [330, 640, 940];
  const spec: number[][][] = [[[540, 0.95]], [[330, 1.0], [750, 1.2]], [[170, 1.05], [440, 0.8], [660, 1.1], [920, 1.3]]];
  const sc = [0.6, 0.55, 0.42];
  // lines of descent
  const pos: number[][][] = spec.map((row, i) => row.map(([x]) => [x, rowsY[i]]));
  spec[1].forEach((_, k) => line(c, [[pos[0][0][0], rowsY[0] + 30], [pos[1][k][0], rowsY[1] - 420 * sc[1] - 10]], 9));
  spec[2].forEach((_, k) => line(c, [[pos[1][Math.floor(k / 2)][0], rowsY[1] + 30], [pos[2][k][0], rowsY[2] - 420 * sc[2] - 10]], 9));
  spec.forEach((row, i) => row.forEach(([x, hump], k) => camel(c, x, rowsY[i], sc[i], { hump, dk: (i + k) % 2 === 1 })));
};
// expl.10 Every adaptation has a cost: a thick-coated yak is hot on the plains and happy in the snow
const e10 = (c: Ctx) => {
  ground(c);
  panel(c, 30, 150, 500, 780, () => { c.fillStyle = "#fbe8c0"; c.fillRect(0, 0, 500, 780); sun(c, 400, 100, 60); c.fillStyle = "#c9d98a"; c.fillRect(0, 520, 500, 260); line(c, [[0, 520], [500, 520]], 6); yak(c, 230, 700, 0.78, true); for (const [x, y] of [[410, 440], [360, 480], [440, 500]]) dropShape(c, x, y, 13); });
  panel(c, 550, 150, 500, 780, () => { c.fillStyle = "#dbe9f5"; c.fillRect(0, 0, 500, 780); flake(c, 80, 80, 26); flake(c, 420, 110, 22); flake(c, 250, 50, 18); shape(c, () => { c.moveTo(-10, 330); c.lineTo(160, 190); c.lineTo(300, 300); c.lineTo(400, 230); c.lineTo(510, 330); c.lineTo(510, 790); c.lineTo(-10, 790); c.closePath(); }, ROCK, 6); shape(c, () => { c.moveTo(-10, 520); c.bezierCurveTo(150, 480, 350, 500, 510, 480); c.lineTo(510, 790); c.lineTo(-10, 790); c.closePath(); }, SNOW, 6); yak(c, 230, 700, 0.78, false); });
};
// expl.11 People adapt with what they make: three homes for three places
const house = (c: Ctx, kind: number, x: number, y: number) => {
  if (kind === 0) {
    shape(c, () => rrect(c, x - 140, y - 230, 280, 230, 8), "#f0e6d4", 7);
    shape(c, () => rrect(c, x - 155, y - 255, 310, 32, 6), "#a8723f", 6);
    shape(c, () => rrect(c, x - 100, y - 190, 120, 110, 6), COL.sky, 6); line(c, [[x - 40, y - 190], [x - 40, y - 80]], 5); line(c, [[x - 100, y - 135], [x + 20, y - 135]], 5);
    shape(c, () => rrect(c, x + 50, y - 120, 60, 120, 6), COL.brown, 6);
  } else if (kind === 1) {
    shape(c, () => rrect(c, x - 130, y - 200, 260, 200, 40), "#d9b07c", 7);
    shape(c, () => polyP(c, [[x - 165, y - 190], [x, y - 330], [x + 165, y - 190]]), "#e6c35a", 7);
    for (let k = 0; k < 4; k++) line(c, [[x - 120 + k * 60, y - 200], [x - 40 + k * 20, y - 300 + k * 6]], 4, "#b8942e");
    shape(c, () => rrect(c, x - 36, y - 120, 72, 120, 30), "#6a4128", 6);
  } else {
    shape(c, () => rrect(c, x - 120, y - 170, 240, 170, 8), "#f6e3b4", 7);
    shape(c, () => polyP(c, [[x - 170, y - 160], [x - 50, y - 330], [x + 50, y - 330], [x + 170, y - 160]]), "#c0553a", 7);
    for (let k = 1; k < 4; k++) line(c, [[x - 170 + k * 30, y - 160 - k * 20], [x + 170 - k * 30, y - 160 - k * 20]], 4, "#8c3c28");
    shape(c, () => rrect(c, x - 30, y - 110, 60, 110, 6), COL.brown, 6); shape(c, () => rrect(c, x + 60, y - 130, 40, 40, 4), COL.sky, 5);
  }
};
const e11 = (c: Ctx) => {
  ground(c, COL.sky);
  c.fillStyle = "#e7dcc6"; c.fillRect(0, 880, 1080, 200); line(c, [[0, 880], [1080, 880]], 6);
  [[190, 0], [540, 1], [890, 2]].forEach(([x, k]) => { c.save(); c.translate(x, 880); c.scale(1.02, 1.02); house(c, k, 0, 0); c.restore(); });
  sun(c, 90, 330, 44); arrow(c, [[140, 360], [200, 640]], RED, 10); flake(c, 90, 150, 26); flake(c, 220, 190, 20);
  sun(c, 540, 170, 62);
  const cx = 880, cy = 190;
  shape(c, () => { ell(c, cx - 60, cy, 70, 40); ell(c, cx + 20, cy - 20, 80, 50); ell(c, cx + 90, cy + 5, 60, 36); }, "#cdd7e2", 6);
  for (let k = 0; k < 6; k++) line(c, [[cx - 80 + k * 38, cy + 70], [cx - 95 + k * 38, cy + 130]], 7, COL.blue);
};

export const ic_habitatsAdaptationsL3 = cards("sci.habitats.adaptations.L3 cards", [e1, e3, a2, a5, a6, p1, t0, t1, t2, t3, t4, t7, t20, t21, e0, e7, e8, e10, e11]);
