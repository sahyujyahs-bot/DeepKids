import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, SKIN, WHITE, arrow, bowl, cards, ell, glass, ground, hand, line, person, polyP, rrect, shade, shadow, shape, shine, write } from "./flatKit";

const TABLE = "#ecd3a1", FLOOR = "#e9dcc0", GRASS = "#cfe3a8";
const floor = (c: Ctx, y = 780, col = FLOOR) => { ground(c); c.fillStyle = col; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 5); };
const tableTop = (c: Ctx, y: number) => { shape(c, () => rrect(c, -20, y, 1120, 400, 0), TABLE, 6); c.fillStyle = "#d9b87c"; c.fillRect(0, y + 8, 1080, 22); line(c, [[0, y + 30], [1080, y + 30]], 4); };

const stone = (c: Ctx, x: number, y: number, r: number, col = "#a8a39a") => {
  shape(c, () => ell(c, x, y, r, r * 0.75, 0.3), col, Math.max(3, r * 0.1));
  shade(c, () => ell(c, x, y, r, r * 0.75, 0.3), "#7d7870", r * 0.3, r * 0.25, 0.6);
};
const toffee = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => polyP(c, [[x - r * 1.9, y - r * 0.6], [x - r * 0.8, y], [x - r * 1.9, y + r * 0.6]]), COL.pink, 4);
  shape(c, () => polyP(c, [[x + r * 1.9, y - r * 0.6], [x + r * 0.8, y], [x + r * 1.9, y + r * 0.6]]), COL.pink, 4);
  shape(c, () => ell(c, x, y, r * 1.3, r * 0.85), COL.red, 5);
  line(c, [[x - r * 0.5, y - r * 0.2], [x + r * 0.5, y - r * 0.2]], 4, "#f4f1e4");
};
const mango = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.85, -0.5), COL.orange, 6);
  shade(c, () => ell(c, x, y, r, r * 0.85, -0.5), COL.red, r * 0.3, r * 0.3, 0.4);
  shape(c, () => ell(c, x + r * 0.2, y - r * 0.85, r * 0.45, r * 0.22, -0.5), COL.leaf, 4);
};
const banana = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => { c.moveTo(x - r, y - r * 0.4); c.quadraticCurveTo(x - r * 0.2, y + r * 0.9, x + r, y - r * 0.5); c.quadraticCurveTo(x + r * 0.1, y + r * 0.35, x - r, y - r * 0.4); c.closePath(); }, COL.yellow, 6);
  shape(c, () => ell(c, x + r, y - r * 0.55, r * 0.1, r * 0.1), COL.soilDk, 3);
};
const sticker = (c: Ctx, x: number, y: number, r: number) => shape(c, () => ell(c, x, y, r, r), COL.yellow, 4);
const cup = (c: Ctx, x: number, y: number, s = 1) => {
  shadow(c, x + 14 * s, y + 4, 62 * s, 12 * s);
  shape(c, () => polyP(c, [[x - 42 * s, y - 100 * s], [x + 42 * s, y - 100 * s], [x + 60 * s, y], [x - 60 * s, y]]), COL.steel, 5);
  shade(c, () => polyP(c, [[x - 42 * s, y - 100 * s], [x + 42 * s, y - 100 * s], [x + 60 * s, y], [x - 60 * s, y]]), COL.steelDk, 24 * s, 0, 0.6);
  shine(c, [[x - 30 * s, y - 85 * s], [x - 42 * s, y - 15 * s]], 7);
};

// a dog in side view facing left, feet on y, centre x. mood: happy (tail up, ears up), scared (tail tucked, ears flat), calm
const dog = (c: Ctx, x: number, y: number, s: number, mood: "happy" | "scared" | "calm" = "calm", flip = false, rot = 0, col: string = COL.brown, dk: string = COL.soil) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s); c.translate(0, -135); c.rotate(rot); c.translate(0, 135);
  shadow(c, 20, 6, 150, 16);
  const leg = (lx: number, ly: number) => { line(c, [[lx, -90], [lx, ly]], 34, INK); line(c, [[lx, -90], [lx, ly]], 22, col); shape(c, () => ell(c, lx - 6, ly - 2, 22, 12), dk, 4); };
  leg(75, -8); leg(-70, -8);
  // tail
  const tail = mood === "happy" ? [[100, -160], [150, -215], [150, -280]] : mood === "scared" ? [[100, -110], [130, -60], [95, -30]] : [[100, -150], [150, -150], [175, -110]];
  line(c, [[100, -140], ...tail], 24, INK); line(c, [[100, -140], ...tail], 12, col);
  shape(c, () => ell(c, 0, -135, 118, 56), col, 6);
  shade(c, () => ell(c, 0, -135, 118, 56), dk, 18, 26, 0.5);
  leg(100, -8); leg(-45, -8);
  const hy = mood === "scared" ? -170 : -195;
  shape(c, () => ell(c, -130, hy, 50, 46), col, 6);
  shape(c, () => ell(c, -178, hy + 14, 34, 24), "#e0ab72", 5);
  shape(c, () => ell(c, -206, hy + 6, 11, 8), INK, 0);
  if (mood === "happy") { shape(c, () => ell(c, -178, hy + 42, 14, 18), COL.red, 4); line(c, [[-205, hy + 26], [-165, hy + 30]], 4); }
  else if (mood === "scared") line(c, [[-205, hy + 26], [-165, hy + 30]], 4);
  else line(c, [[-205, hy + 26], [-165, hy + 30]], 4);
  if (mood === "happy") shape(c, () => polyP(c, [[-125, hy - 36], [-140, hy - 105], [-90, hy - 40]]), dk, 5);
  else if (mood === "scared") shape(c, () => ell(c, -95, hy - 2, 36, 12, 0.35), dk, 5);
  else shape(c, () => ell(c, -102, hy + 12, 18, 34, 0.2), dk, 5);
  shape(c, () => ell(c, -138, hy - 10, mood === "scared" ? 11 : 7, mood === "scared" ? 12 : 8), mood === "scared" ? WHITE : INK, mood === "scared" ? 4 : 0);
  if (mood === "scared") shape(c, () => ell(c, -138, hy - 10, 4, 5), INK, 0);
  c.restore();
};
// a dog's face from the front. mood happy, scared, angry
const dogFace = (c: Ctx, x: number, y: number, r: number, mood: "happy" | "scared" | "angry") => {
  const col = COL.brown, dk = COL.soil;
  if (mood === "angry") { shape(c, () => polyP(c, [[x - r * 0.8, y - r * 0.5], [x - r * 0.7, y - r * 1.25], [x - r * 0.25, y - r * 0.85]]), dk, 6); shape(c, () => polyP(c, [[x + r * 0.8, y - r * 0.5], [x + r * 0.7, y - r * 1.25], [x + r * 0.25, y - r * 0.85]]), dk, 6); }
  else if (mood === "happy") { shape(c, () => ell(c, x - r * 0.95, y - r * 0.1, r * 0.3, r * 0.6, 0.25), dk, 6); shape(c, () => ell(c, x + r * 0.95, y - r * 0.1, r * 0.3, r * 0.6, -0.25), dk, 6); }
  else { shape(c, () => ell(c, x - r * 1.05, y + r * 0.05, r * 0.5, r * 0.16, 0.2), dk, 6); shape(c, () => ell(c, x + r * 1.05, y + r * 0.05, r * 0.5, r * 0.16, -0.2), dk, 6); }
  shape(c, () => ell(c, x, y, r, r * 0.95), col, 6);
  shade(c, () => ell(c, x, y, r, r * 0.95), dk, r * 0.15, r * 0.15, 0.5);
  shape(c, () => ell(c, x, y + r * 0.4, r * 0.55, r * 0.4), "#e0ab72", 5);
  shape(c, () => ell(c, x, y + r * 0.2, r * 0.2, r * 0.14), INK, 0);
  const ey = y - r * 0.25;
  if (mood === "scared") for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * r * 0.38, ey, r * 0.17, r * 0.2), WHITE, 4); shape(c, () => ell(c, x + s * r * 0.38, ey + 4, r * 0.07, r * 0.08), INK, 0); line(c, [[x + s * r * 0.55, ey - r * 0.3], [x + s * r * 0.22, ey - r * 0.38]], 5); }
  else if (mood === "angry") for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * r * 0.38, ey + 4, r * 0.1, r * 0.08), INK, 0); line(c, [[x + s * r * 0.6, ey - r * 0.32], [x + s * r * 0.15, ey - r * 0.14]], 8); }
  else for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.38, ey, r * 0.09, r * 0.11), INK, 0);
  if (mood === "happy") { shape(c, () => { c.moveTo(x - r * 0.3, y + r * 0.5); c.quadraticCurveTo(x, y + r * 1.05, x + r * 0.3, y + r * 0.5); c.closePath(); }, COL.red, 5); line(c, [[x - r * 0.35, y + r * 0.45], [x, y + r * 0.55], [x + r * 0.35, y + r * 0.45]], 5); }
  else if (mood === "angry") { shape(c, () => rrect(c, x - r * 0.38, y + r * 0.52, r * 0.76, r * 0.26, r * 0.1), WHITE, 5); for (const dx of [-0.2, 0, 0.2]) line(c, [[x + r * dx, y + r * 0.54], [x + r * dx, y + r * 0.76]], 3); }
  else line(c, [[x - r * 0.25, y + r * 0.62], [x, y + r * 0.55], [x + r * 0.25, y + r * 0.62]], 5);
  if (mood === "scared") shape(c, () => { c.moveTo(x + r * 0.95, y - r * 0.85); c.quadraticCurveTo(x + r * 0.78, y - r * 0.55, x + r * 0.95, y - r * 0.45); c.quadraticCurveTo(x + r * 1.12, y - r * 0.55, x + r * 0.95, y - r * 0.85); c.closePath(); }, COL.drop, 4);
};
// a crow (rook) in side view facing left, feet on y
const crow = (c: Ctx, x: number, y: number, s: number, flip = false) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  const B = "#4a4558", W = "#5f5972";
  shadow(c, 10, 4, 90, 12);
  line(c, [[-10, -50], [-14, -4]], 8); line(c, [[16, -50], [14, -4]], 8);
  line(c, [[-30, -4], [-8, -4]], 7); line(c, [[0, -4], [24, -4]], 7);
  shape(c, () => polyP(c, [[50, -95], [140, -55], [128, -105], [60, -115]]), B, 6);
  shape(c, () => ell(c, 0, -95, 72, 44, -0.15), B, 6);
  shade(c, () => ell(c, 0, -95, 72, 44, -0.15), "#2f2b3c", 14, 18, 0.6);
  shape(c, () => ell(c, 14, -92, 46, 24, -0.2), W, 5);
  shape(c, () => ell(c, -66, -138, 30, 28), B, 6);
  shape(c, () => polyP(c, [[-92, -146], [-140, -128], [-92, -122]]), "#6a6578", 6);
  shape(c, () => ell(c, -72, -146, 8, 8), WHITE, 3); shape(c, () => ell(c, -74, -146, 4, 4), INK, 0);
  c.restore();
};
const childFace = (c: Ctx, x: number, y: number, r: number, mood: "happy" | "scared" | "angry") => {
  shape(c, () => ell(c, x, y, r, r * 1.05), SKIN.child, 6);
  shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.02, y); c.closePath(); }, CLOTH.hair, 5);
  const ey = y + r * 0.05;
  if (mood === "scared") for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * r * 0.38, ey, r * 0.17, r * 0.22), WHITE, 4); shape(c, () => ell(c, x + s * r * 0.38, ey + 3, r * 0.07, r * 0.09), INK, 0); line(c, [[x + s * r * 0.55, ey - r * 0.38], [x + s * r * 0.22, ey - r * 0.46]], 5); }
  else for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.38, ey, r * 0.1, r * 0.13), INK, 0);
  if (mood === "angry") for (const s of [-1, 1]) line(c, [[x + s * r * 0.65, ey - r * 0.32], [x + s * r * 0.15, ey - r * 0.12]], 8);
  if (mood === "happy") { c.beginPath(); c.arc(x, y + r * 0.3, r * 0.4, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); }
  else if (mood === "scared") shape(c, () => ell(c, x, y + r * 0.62, r * 0.17, r * 0.24), INK, 0);
  else { c.beginPath(); c.arc(x, y + r * 0.85, r * 0.35, Math.PI + 0.3, -0.3); c.strokeStyle = INK; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); }
};
const cloud = (c: Ctx, x: number, y: number, w: number, h: number) => {
  for (const [dx, dy, rx, ry] of [[0, 0, w, h], [-w * 0.7, h * 0.2, w * 0.5, h * 0.7], [w * 0.7, h * 0.2, w * 0.5, h * 0.7], [-w * 0.3, -h * 0.5, w * 0.5, h * 0.6], [w * 0.3, -h * 0.5, w * 0.5, h * 0.6]]) shape(c, () => ell(c, x + dx, y + dy, rx, ry), WHITE, 5);
  for (const [dx, dy, rx, ry] of [[0, 0, w, h], [-w * 0.7, h * 0.2, w * 0.5, h * 0.7], [w * 0.7, h * 0.2, w * 0.5, h * 0.7], [-w * 0.3, -h * 0.5, w * 0.5, h * 0.6], [w * 0.3, -h * 0.5, w * 0.5, h * 0.6]]) { c.beginPath(); ell(c, x + dx, y + dy, rx - 3, ry - 3); c.fillStyle = WHITE; c.fill(); }
};

// key: flow.e1  (thirsty crow test: stones dropped into a glass of water, water rises)
const flowE1 = (c: Ctx) => {
  floor(c, 700, TABLE);
  glass(c, 400, 700, 300, 420, 0.72);
  stone(c, 340, 662, 42); stone(c, 430, 668, 40, "#b5ab9a"); stone(c, 385, 600, 38);
  line(c, [[240, 700 - 420 * 0.72], [560, 700 - 420 * 0.72]], 6, RED);
  bowl(c, 810, 640, 130);
  for (const [px, py, pr] of [[760, 636, 30], [830, 628, 32], [880, 640, 28], [800, 600, 30], [850, 598, 28]]) stone(c, px, py, pr, "#b5ab9a");
  stone(c, 520, 170, 44);
  arrow(c, [[560, 190], [470, 230], [420, 290]], RED, 12);
  write(c, "3", 150, 130, 90, INK, 9);
};

// key: flow.e2  (Clever Hans test: a grown-up holds a number, the child taps; the child watches the face)
const flowE2 = (c: Ctx) => {
  floor(c, 1000, BG);
  person(c, 250, 1000, 820, { adult: true, armR: [-0.5, -1.57] });
  shape(c, () => rrect(c, 386, 70, 160, 200, 12), WHITE, 6);
  write(c, "3", 430, 100, 140, INK, 12);
  person(c, 790, 1000, 700, { armL: [0.9, 1.45] });
  tableTop(c, 720);
  for (const tx of [830, 880, 930]) arrow(c, [[tx, 560], [tx, 660]], RED, 10);
};

// key: flow.e3  (pointing test: a girl points at one of two upside-down bowls, a dog looks)
const flowE3 = (c: Ctx) => {
  floor(c, 760, FLOOR);
  person(c, 160, 1010, 780, { armR: [0.9, 1.2] });
  for (const bx of [400, 590]) {
    shadow(c, bx + 14, 880, 120, 18);
    shape(c, () => { c.moveTo(bx - 120, 872); c.bezierCurveTo(bx - 110, 740, bx + 110, 740, bx + 120, 872); c.closePath(); }, COL.steel, 6);
    shade(c, () => { c.moveTo(bx - 120, 872); c.bezierCurveTo(bx - 110, 740, bx + 110, 740, bx + 120, 872); c.closePath(); }, COL.steelDk, 40, 0, 0.6);
    shine(c, [[bx - 70, 820], [bx - 40, 770]], 8);
  }
  dog(c, 880, 1000, 0.9, "calm");
};

// key: flow.a3  (training game: the learner walks to the chair, the trainer claps)
const flowA3 = (c: Ctx) => {
  floor(c, 800, FLOOR);
  person(c, 170, 1010, 820, { adult: true, armL: [1.4, -0.9], armR: [Math.PI - 1.4, Math.PI + 0.9] });
  for (const [x1, y1, x2, y2] of [[85, 470, 55, 440], [85, 520, 50, 520], [255, 470, 285, 440], [255, 520, 290, 520]]) line(c, [[x1, y1], [x2, y2]], 8, COL.yellow);
  person(c, 520, 1010, 680);
  arrow(c, [[640, 920], [740, 920], [800, 920]], RED, 12);
  // a chair, side view
  shadow(c, 930, 1000, 130, 16);
  shape(c, () => rrect(c, 840, 560, 36, 270, 8), COL.wood, 6);
  shape(c, () => rrect(c, 840, 700, 180, 36, 10), COL.wood, 6);
  shape(c, () => rrect(c, 980, 736, 34, 260, 8), COL.woodDk, 6);
  shape(c, () => rrect(c, 850, 736, 34, 260, 8), COL.woodDk, 6);
  // a spoon on the seat
  shape(c, () => ell(c, 940, 690, 30, 14), COL.steel, 5); line(c, [[966, 690], [1010, 680]], 8, INK); line(c, [[966, 690], [1010, 680]], 4, COL.steel);
};

// key: flow.a4  (reading a dog: relaxed, scared, angry faces)
const flowA4 = (c: Ctx) => {
  ground(c);
  dogFace(c, 190, 540, 150, "happy"); dogFace(c, 540, 540, 150, "scared"); dogFace(c, 890, 540, 150, "angry");
};

// key: flow.a5  (brain line-up: sesame seed, walnut, lemon, cauliflower under bee, crow, dog, person)
const flowA5 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 830, 480, 38);
  shape(c, () => ell(c, 540, 800, 480, 70), COL.steel); shape(c, () => ell(c, 540, 796, 420, 56), COL.steelIn, 4);
  // sesame seed
  shape(c, () => ell(c, 150, 790, 16, 9, 0.2), "#f4e6c0", 3);
  // walnut
  shape(c, () => ell(c, 380, 745, 62, 54), "#c8955c", 6); shade(c, () => ell(c, 380, 745, 62, 54), COL.brown, 16, 16, 0.5);
  line(c, [[380, 695], [380, 795]], 4, COL.soilDk); line(c, [[345, 725], [360, 770]], 3, COL.soilDk); line(c, [[415, 725], [400, 770]], 3, COL.soilDk);
  // lemon
  shape(c, () => ell(c, 620, 735, 92, 66), COL.yellow, 6); shade(c, () => ell(c, 620, 735, 92, 66), COL.orange, 20, 20, 0.45);
  shape(c, () => ell(c, 718, 735, 10, 10), COL.yellow, 5); shape(c, () => ell(c, 522, 735, 10, 10), COL.yellow, 5);
  // cauliflower
  for (const a of [-0.9, 0.9, 0]) shape(c, () => ell(c, 900 + a * 130, 800, 70, 24, a * 0.4), COL.leaf, 5);
  for (const [dx, dy, r] of [[-70, -40, 70], [60, -50, 74], [0, -100, 76], [-30, 10, 70], [50, 0, 66], [-90, -90, 56], [90, -100, 54]]) shape(c, () => ell(c, 900 + dx, 700 + dy, r, r * 0.9), "#f3efe0", 5);
  // the four animals above
  for (const x of [150, 380, 620, 900]) { shape(c, () => ell(c, x, 290, 105, 105), "#f7f1df", 5); }
  // bee
  c.save(); c.translate(150, 290);
  shape(c, () => ell(c, -22, -40, 34, 18, -0.5), "rgba(214,236,250,0.85)", 4); shape(c, () => ell(c, 22, -40, 34, 18, 0.5), "rgba(214,236,250,0.85)", 4);
  shape(c, () => ell(c, 0, 5, 52, 36), COL.yellow, 6);
  c.save(); c.beginPath(); ell(c, 0, 5, 52, 36); c.clip(); for (const bx of [-18, 8, 34]) { c.fillStyle = INK; c.fillRect(bx, -40, 12, 90); } c.restore();
  shape(c, () => ell(c, 0, 5, 52, 36), "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, -54, 0, 20, 20), INK, 0);
  c.restore();
  // crow head
  c.save(); c.translate(380, 290); c.scale(0.8, 0.8);
  shape(c, () => ell(c, 0, 10, 62, 56), "#4a4558", 6); shape(c, () => polyP(c, [[-50, 0], [-120, 22], [-50, 36]]), "#6a6578", 6);
  shape(c, () => ell(c, -20, -8, 11, 11), WHITE, 3); shape(c, () => ell(c, -22, -8, 5, 5), INK, 0);
  c.restore();
  dogFace(c, 620, 285, 70, "happy");
  childFace(c, 900, 290, 72, "happy");
};

// key: flow.a6  (mirror: a child with a sticker on their forehead, and the mirror)
const flowA6 = (c: Ctx) => {
  ground(c, "#f6efe0");
  // the mirror
  shape(c, () => rrect(c, 570, 150, 420, 780, 30), COL.teal, 6);
  c.save(); c.beginPath(); rrect(c, 590, 170, 380, 740, 18); c.clip(); c.fillStyle = COL.sky; c.fillRect(570, 150, 420, 780);
  person(c, 780, 880, 640, { armL: [Math.PI + 1.2, Math.PI + 2.9] });
  sticker(c, 780, 880 - 640 * 0.88 + 12 - 5, 13);
  c.fillStyle = "rgba(255,255,255,0.28)"; c.beginPath(); c.moveTo(590, 170); c.lineTo(760, 170); c.lineTo(590, 560); c.closePath(); c.fill();
  c.restore(); c.beginPath(); rrect(c, 590, 170, 380, 740, 18); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  person(c, 280, 1040, 800, { armR: [-1.2, -2.9] });
  sticker(c, 280, 1040 - 800 * 0.88 + 12 - 5, 15);
};

// key: flow.c2  (puzzle feeder: a bottle with holes, seeds falling out, a crow)
const flowC2 = (c: Ctx) => {
  floor(c, 800, GRASS);
  crow(c, 190, 960, 1.2, true);
  shadow(c, 620, 905, 330, 22);
  // plastic bottle lying on the ground, neck to the right
  shape(c, () => { c.moveTo(310, 640); c.lineTo(740, 640); c.quadraticCurveTo(840, 650, 870, 700); c.lineTo(960, 705); c.lineTo(960, 775); c.lineTo(870, 780); c.quadraticCurveTo(840, 840, 740, 850); c.lineTo(310, 850); c.quadraticCurveTo(290, 745, 310, 640); c.closePath(); }, COL.glass, 6);
  shape(c, () => rrect(c, 960, 700, 50, 80, 8), COL.blue, 6);
  for (const [sx, sy] of [[400, 800], [470, 820], [540, 790], [610, 815], [680, 790], [440, 750], [520, 740], [600, 755], [660, 735]]) shape(c, () => ell(c, sx, sy, 20, 12, sx * 0.01), COL.yellow, 4);
  for (const hx of [430, 560, 690]) shape(c, () => ell(c, hx, 640, 34, 12), INK, 0);
  shine(c, [[360, 665], [700, 662]], 8);
  for (const [sx, sy] of [[430, 705], [440, 760]]) shape(c, () => ell(c, sx, sy, 20, 12), COL.yellow, 4);
  shape(c, () => ell(c, 440, 880, 20, 12), COL.yellow, 4); shape(c, () => ell(c, 380, 905, 20, 12, 0.5), COL.yellow, 4);
  arrow(c, [[430, 560], [430, 610]], RED, 10);
};

// key: term.0  (mind: a child choosing between a mango and a banana; the head glows)
const term0 = (c: Ctx) => {
  ground(c);
  for (const [r, a] of [[210, 0.18], [160, 0.3], [120, 0.5]]) { c.beginPath(); ell(c, 380, 339, r, r); c.fillStyle = `rgba(255,211,77,${a})`; c.fill(); }
  person(c, 380, 1040, 800, { armR: [0.5, 1.1] });
  cloud(c, 800, 230, 120, 80);
  mango(c, 800, 230, 48);
  shape(c, () => ell(c, 610, 400, 22, 22), WHITE, 5); shape(c, () => ell(c, 560, 450, 12, 12), WHITE, 5);
  tableTop(c, 790);
  mango(c, 690, 745, 60); banana(c, 900, 740, 90);
};

// key: term.1  (learning: the dog runs to the gate at the click of the latch)
const term1 = (c: Ctx) => {
  floor(c, 800, GRASS);
  shape(c, () => rrect(c, 640, 250, 180, 540, 10), COL.blueDk); shape(c, () => rrect(c, 830, 250, 180, 540, 10), COL.blue);
  for (let i = 0; i < 4; i++) { line(c, [[665 + i * 42, 275], [665 + i * 42, 765]], 5); line(c, [[855 + i * 42, 275], [855 + i * 42, 765]], 5); }
  shape(c, () => rrect(c, 790, 500, 60, 22, 6), COL.steel, 5);
  for (const [x1, y1, x2, y2] of [[770, 470, 740, 430], [820, 460, 820, 405], [870, 470, 905, 430]]) line(c, [[x1, y1], [x2, y2]], 9, COL.yellow);
  dog(c, 400, 960, 1.15, "happy");
  arrow(c, [[480, 640], [560, 590], [620, 580]], RED, 12);
};

// key: term.2  (memory: a hand finds the sweet hidden behind a book)
const term2 = (c: Ctx) => {
  ground(c);
  person(c, 810, 1040, 800, { armL: [2.7, 2.9] });
  tableTop(c, 780);
  toffee(c, 320, 740, 32);
  shadow(c, 440, 790, 120, 16);
  shape(c, () => rrect(c, 340, 400, 200, 390, 10), COL.red, 7);
  shade(c, () => rrect(c, 340, 400, 200, 390, 10), "#a63a28", 40, 0, 0.6);
  shape(c, () => rrect(c, 340, 400, 28, 390, 8), "#a63a28", 5);
  shape(c, () => rrect(c, 395, 460, 105, 70, 8), COL.yellow, 5);
  hand(c, 700, 640, Math.PI, 0.9, SKIN.child, CLOTH.child, false);
};

// key: term.4  (play: two puppies tumbling on the grass)
const term4 = (c: Ctx) => {
  floor(c, 700, GRASS);
  dog(c, 360, 900, 1.05, "happy", true, 0, "#d9a066", COL.brown);
  dog(c, 760, 900, 1.05, "happy", false, 2.7, "#8a6a4a", COL.soilDk);
  for (const [x, y] of [[560, 640], [600, 600], [520, 610]]) line(c, [[x, y], [x + 24, y - 30]], 8, COL.yellow);
};

// key: term.6  (problem solving: pulling a ball from under the bed with a broom)
const term6 = (c: Ctx) => {
  floor(c, 800, FLOOR);
  for (const lx of [500, 990]) shape(c, () => rrect(c, lx - 18, 500, 36, 300, 8), COL.woodDk, 6);
  shape(c, () => rrect(c, 470, 400, 580, 110, 18), COL.blue, 6);
  shade(c, () => rrect(c, 470, 400, 580, 110, 18), COL.blueDk, 30, 20, 0.5);
  shape(c, () => rrect(c, 470, 340, 580, 70, 28), COL.cloth, 6);
  shadow(c, 650, 800, 70, 10);
  shape(c, () => ell(c, 650, 748, 50, 50), COL.orange, 6); shade(c, () => ell(c, 650, 748, 50, 50), COL.red, 14, 14, 0.4);
  // child lying on the floor
  shape(c, () => rrect(c, 40, 735, 130, 52, 20), "#6b5a8c", 6);
  shape(c, () => rrect(c, 150, 710, 240, 78, 30), CLOTH.child, 6);
  shape(c, () => ell(c, 430, 740, 60, 58), SKIN.child, 6);
  shape(c, () => { c.moveTo(372, 740); c.bezierCurveTo(372, 670, 490, 670, 490, 740); c.quadraticCurveTo(430, 715, 372, 740); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, 462, 752, 7, 9), INK, 0);
  line(c, [[480, 742], [780, 700]], 14, INK); line(c, [[480, 742], [780, 700]], 8, COL.wood);
  shape(c, () => ell(c, 480, 744, 24, 24), SKIN.child, 5);
  shape(c, () => polyP(c, [[765, 685], [830, 690], [850, 790], [750, 790]]), COL.yellow, 5);
  line(c, [[790, 700], [785, 785]], 3); line(c, [[815, 700], [820, 785]], 3);
  arrow(c, [[740, 620], [650, 620], [580, 620]], RED, 12);
};

// key: term.7  (brain: eyes send a message to the brain, the brain sends one to the hand that catches the ball)
const term7 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 180, 560, 300, 420, 40), CLOTH.child, 6);
  shape(c, () => ell(c, 330, 380, 200, 230), SKIN.child, 6);
  shape(c, () => ell(c, 516, 450, 28, 36), SKIN.child, 6);
  shape(c, () => { c.moveTo(130, 400); c.bezierCurveTo(100, 100, 560, 80, 520, 380); c.quadraticCurveTo(330, 260, 130, 400); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, 440, 400, 14, 18), INK, 0);
  shape(c, () => { c.moveTo(200, 340); c.bezierCurveTo(170, 230, 330, 190, 400, 250); c.bezierCurveTo(470, 290, 420, 380, 340, 380); c.bezierCurveTo(260, 400, 220, 390, 200, 340); c.closePath(); }, COL.pink, 6);
  for (const pts of [[[240, 290], [290, 260], [330, 290]], [[290, 330], [340, 300], [390, 320]], [[250, 350], [300, 345]]]) line(c, pts, 5, "#c06f8c");
  arrow(c, [[430, 392], [385, 350]], RED, 9);
  arrow(c, [[300, 400], [300, 590], [440, 720], [620, 720]], RED, 12);
  shape(c, () => ell(c, 880, 220, 60, 60), COL.orange, 6); shade(c, () => ell(c, 880, 220, 60, 60), COL.red, 18, 18, 0.4);
  line(c, [[800, 150], [840, 190]], 7, COL.yellow); line(c, [[760, 200], [810, 220]], 7, COL.yellow);
  arrow(c, [[860, 320], [860, 450]], RED, 10);
  hand(c, 780, 800, -1.3, 1.4, SKIN.child, CLOTH.child, true);
};

// key: term.8  (neuron: a cell with branches and a spark running along its long arm)
const term8 = (c: Ctx) => {
  ground(c, "#2f3a6b");
  const limb = (pts: number[][], w: number) => { line(c, pts, w + 10, INK); line(c, pts, w, "#f6b8c8"); };
  for (const pts of [[[470, 470], [380, 380], [300, 300]], [[470, 480], [350, 470], [250, 480]], [[470, 500], [380, 590], [310, 680]], [[460, 450], [450, 320], [470, 230]], [[380, 380], [350, 310]], [[350, 470], [290, 420]], [[380, 590], [300, 570]]]) limb(pts, 18);
  limb([[560, 500], [720, 500], [900, 500]], 20);
  for (const pts of [[[900, 500], [960, 440], [1010, 420]], [[900, 500], [980, 500], [1030, 510]], [[900, 500], [960, 560], [1010, 600]]]) limb(pts, 14);
  shape(c, () => ell(c, 520, 500, 90, 80), "#f6b8c8", 7);
  shape(c, () => ell(c, 520, 500, 32, 30), COL.purple, 5);
  c.beginPath(); ell(c, 730, 500, 55, 55); c.fillStyle = "rgba(255,211,77,0.35)"; c.fill();
  shape(c, () => polyP(c, [[730, 450], [752, 492], [782, 500], [752, 510], [730, 552], [708, 510], [678, 500], [708, 492]]), COL.yellow, 5);
};

// key: term.9  (emotion: happy, scared, angry faces)
const term9 = (c: Ctx) => {
  ground(c);
  childFace(c, 190, 540, 150, "happy"); childFace(c, 540, 540, 150, "scared"); childFace(c, 890, 540, 150, "angry");
};

// key: term.10  (body language: a scared dog and a relaxed dog)
const term10 = (c: Ctx) => {
  floor(c, 740, GRASS);
  dog(c, 300, 920, 1, "scared", true, 0, "#8a6a4a", COL.soilDk);
  dog(c, 800, 920, 1, "happy", false);
};

// key: term.11  (fair test: two identical glasses with the same water, one with big stones and one with small)
const term11 = (c: Ctx) => {
  floor(c, 760, TABLE);
  glass(c, 290, 760, 260, 400, 0.6); glass(c, 790, 760, 260, 400, 0.6);
  stone(c, 240, 722, 40); stone(c, 330, 728, 38, "#b5ab9a"); stone(c, 285, 665, 36);
  for (const [x, y] of [[742, 740], [776, 740], [810, 740], [842, 740], [760, 712], [796, 712], [830, 712]]) stone(c, x, y, 17, "#b5ab9a");
  line(c, [[110, 760 - 400 * 0.6], [970, 760 - 400 * 0.6]], 6, RED);
  write(c, "=", 500, 470, 80, RED, 10);
  line(c, [[500, 515], [560, 515]], 10, RED); line(c, [[500, 545], [560, 545]], 10, RED);
};

// key: term.12  (blind test: the helper covers their eyes, so they cannot give the answer away)
const term12 = (c: Ctx) => {
  floor(c, 1000, BG);
  person(c, 200, 1000, 700, { adult: true, armL: [-1.2, 0.5], armR: [-1.94, Math.PI - 0.5] });
  shape(c, () => rrect(c, 105, 355, 190, 54, 14), COL.pink, 6);
  person(c, 900, 1000, 640, { armL: [2.4, 2.0] });
  tableTop(c, 745);
  cup(c, 440, 745); cup(c, 590, 745); cup(c, 740, 745);
};

// key: term.13  (evidence: a rook drops stones into a tube; a notebook with a tick)
const term13 = (c: Ctx) => {
  floor(c, 590, TABLE);
  crow(c, 270, 560, 1.5);
  glass(c, 780, 570, 190, 420, 0.8);
  stone(c, 740, 545, 26); stone(c, 810, 548, 26, "#b5ab9a"); stone(c, 775, 495, 24);
  shape(c, () => ell(c, 780, 570 - 420 * 0.8 - 8, 38, 12), COL.pink, 4);
  // the notebook
  shadow(c, 570, 1010, 400, 20);
  shape(c, () => rrect(c, 150, 660, 840, 340, 16), COL.paper, 6);
  line(c, [[570, 660], [570, 1000]], 5);
  for (const yy of [740, 800, 860, 920]) { line(c, [[200, yy], [520, yy]], 3, COL.steelDk); line(c, [[620, yy], [940, yy]], 3, COL.steelDk); }
  line(c, [[630, 830], [730, 920], [900, 720]], 22, "#2a8a43"); line(c, [[630, 830], [730, 920], [900, 720]], 14, COL.greenLt);
};

// key: term.15  (mirror test: a child touches the sticker on their forehead, seen in the mirror)
const term15 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 470, 330, 400), COL.teal, 6);
  shape(c, () => ell(c, 540, 470, 296, 366), COL.sky, 4);
  childFace(c, 540, 500, 190, "happy");
  sticker(c, 540, 372, 24);
  shine(c, [[330, 330], [370, 230]], 14);
  shape(c, () => rrect(c, 500, 880, 80, 160, 12), COL.tealDk, 6);
  // a small hand reaching up to the sticker
  shape(c, () => rrect(c, 700, 790, 70, 220, 26), CLOTH.child, 6);
  shape(c, () => ell(c, 735, 740, 52, 62), SKIN.child, 6);
  shape(c, () => rrect(c, 688, 570, 28, 150, 14), SKIN.child, 5);
  arrow(c, [[690, 560], [610, 450], [570, 395]], RED, 10);
};

export const ic_animalsAnimalMindsL3 = cards("sci.animals.animal-minds.L3 cards", [
  flowE1, flowE2, flowE3, flowA3, flowA4, flowA5, flowA6, flowC2,
  term0, term1, term2, term4, term6, term7, term8, term9, term10, term11, term12, term13, term15,
]);
