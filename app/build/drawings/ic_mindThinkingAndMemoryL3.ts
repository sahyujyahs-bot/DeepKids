import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, plate, bowl, hand, person, write, cards, rnd } from "./flatKit";

// sci.mind.thinking-and-memory.L3 cards: cover pictures, terms, explanations and the activities / experiments / project / challenges

const TABLE = "#ecd3a1", FLOOR = "#e9dcc0", PINK = "#f0a3b8", PINKDK = "#d9768f", PINKFOLD = "#c4607b", GOLD = "#ffe58a", CLAY = "#c97a4f", CLAYDK = "#a85f3a";

// ---------------------------------------------------------------- shared pieces
const thick = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };
const floorBand = (c: Ctx, y: number, col = FLOOR) => { c.fillStyle = col; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 5); };
const tableBand = (c: Ctx, y: number) => { shape(c, () => rrect(c, -20, y, D + 40, D - y + 40, 0), TABLE, 6); c.fillStyle = "#d9b87c"; c.fillRect(0, y + 8, D, 20); line(c, [[0, y + 28], [D, y + 28]], 4); };

// a thought bubble: a big cloud with three little circles trailing to (tx, ty)
const bubble = (c: Ctx, x: number, y: number, rx: number, ry: number, tx: number, ty: number) => {
  [[0.9, 14], [0.62, 22], [0.34, 32]].forEach(([f, r]) => shape(c, () => ell(c, tx + (x - tx) * (1 - f), ty + (y - ty) * (1 - f), r, r), WHITE, 5));
  shape(c, () => ell(c, x, y, rx, ry), WHITE, 6);
};

// a child's face, big: short dark hair, ears; closed or open eyes
const face = (c: Ctx, x: number, y: number, r: number, closed: boolean, skin: string = SKIN.child, skinDk: string = SKIN.childDk, hair: string = CLOTH.hair, bun = false) => {
  if (bun) shape(c, () => ell(c, x, y - r * 1.3, r * 0.42, r * 0.42), hair, 6);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.97, y + r * 0.1, r * 0.17, r * 0.26), skin, 6);
  shape(c, () => ell(c, x, y, r, r * 1.05), skin, 7);
  shade(c, () => ell(c, x, y, r, r * 1.05), skinDk, r * 0.2, r * 0.1, 0.45);
  shape(c, () => { c.moveTo(x - r * 1.03, y - r * 0.02); c.bezierCurveTo(x - r * 1.15, y - r * 1.6, x + r * 1.15, y - r * 1.6, x + r * 1.03, y - r * 0.02); c.quadraticCurveTo(x + r * 0.55, y - r * 0.5, x, y - r * 0.45); c.quadraticCurveTo(x - r * 0.55, y - r * 0.5, x - r * 1.03, y - r * 0.02); c.closePath(); }, hair, 7);
  for (const s of [-1, 1]) {
    const ex = x + s * r * 0.4, ey = y + r * 0.12;
    if (closed) { c.beginPath(); c.arc(ex, ey - r * 0.04, r * 0.15, 0.1 * Math.PI, 0.9 * Math.PI); c.strokeStyle = INK; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); }
    else shape(c, () => ell(c, ex, ey + r * 0.08, r * 0.09, r * 0.12), INK, 0);
  }
  c.beginPath(); c.arc(x, y + r * 0.42, r * 0.26, 0.15 * Math.PI, 0.85 * Math.PI); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
};
// the child, head and shoulders
const kid = (c: Ctx, x: number, y: number, r: number, closed = false) => {
  shape(c, () => rrect(c, x - r * 1.5, y + r * 1.0, r * 3, r * 2.2, r * 0.6), CLOTH.child, 7);
  shade(c, () => rrect(c, x - r * 1.5, y + r * 1.0, r * 3, r * 2.2, r * 0.6), CLOTH.childDk, r * 0.3, 0, 0.55);
  shape(c, () => rrect(c, x - r * 0.3, y + r * 0.8, r * 0.6, r * 0.5, r * 0.15), SKIN.child, 6);
  face(c, x, y, r, closed);
};
const gran = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => rrect(c, x - r * 1.5, y + r * 1.0, r * 3, r * 2.2, r * 0.6), "#c2467a", 7);
  shade(c, () => rrect(c, x - r * 1.5, y + r * 1.0, r * 3, r * 2.2, r * 0.6), "#9b2f5e", r * 0.3, 0, 0.55);
  shape(c, () => rrect(c, x - r * 0.3, y + r * 0.8, r * 0.6, r * 0.5, r * 0.15), SKIN.adult, 6);
  face(c, x, y, r, false, SKIN.adult, SKIN.adultDk, "#cfcfd6", true);
  shape(c, () => ell(c, x, y - r * 0.38, r * 0.07, r * 0.07), RED, 0);
};
const thatha = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => rrect(c, x - r * 1.5, y + r * 1.0, r * 3, r * 2.2, r * 0.6), "#f7f3e8", 7);
  shade(c, () => rrect(c, x - r * 1.5, y + r * 1.0, r * 3, r * 2.2, r * 0.6), "#d9d2bd", r * 0.3, 0, 0.7);
  shape(c, () => rrect(c, x - r * 0.3, y + r * 0.8, r * 0.6, r * 0.5, r * 0.15), SKIN.adult, 6);
  face(c, x, y, r, false, SKIN.adult, SKIN.adultDk, "#d6d6dc");
  line(c, [[x - r * 0.7, y - r * 0.1 - r * 0.2], [x - r * 0.15, y - r * 0.05 - r * 0.32]], 7, "#d6d6dc");
  line(c, [[x + r * 0.7, y - r * 0.1 - r * 0.2], [x + r * 0.15, y - r * 0.05 - r * 0.32]], 7, "#d6d6dc");
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.4, y + r * 0.2, r * 0.24, r * 0.24), "rgba(255,255,255,0.4)", 5);
  line(c, [[x - r * 0.16, y + r * 0.2], [x + r * 0.16, y + r * 0.2]], 5);
};

// a crescent moon: a circle of radius R at (x, y) with a bite out of the right side
const crescent = (c: Ctx, x: number, y: number, R: number, r2: number, d: number) => {
  const a = (d * d + R * R - r2 * r2) / (2 * d), h = Math.sqrt(R * R - a * a);
  c.arc(x, y, R, Math.atan2(-h, a), Math.atan2(h, a), true);
  c.arc(x + d, y, r2, Math.atan2(h, a - d), Math.atan2(-h, a - d), false);
  c.closePath();
};

// a question mark
const qmark = (c: Ctx, x: number, y: number, s: number, col = RED) => {
  c.beginPath(); c.arc(x, y, s * 0.5, Math.PI * 1.05, Math.PI * 2.55); c.lineTo(x, y + s * 0.95); c.strokeStyle = col; c.lineWidth = s * 0.2; c.lineCap = "round"; c.lineJoin = "round"; c.stroke();
  shape(c, () => ell(c, x, y + s * 1.35, s * 0.13, s * 0.13), col, 0);
};

// a neuron: round middle, short branches on the left, one long tail to the right
const neuron = (c: Ctx, x: number, y: number, s: number, col: string = COL.purple, dk: string = "#6a4fa8", tail = 330, glow = false) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const br: number[][][] = [
    [[-40, -30], [-120, -75], [-185, -70]], [[-120, -75], [-150, -135]], [[-45, 0], [-170, -2], [-235, 32]], [[-170, -2], [-215, -45]],
    [[-38, 32], [-115, 92], [-175, 128]], [[-115, 92], [-85, 150]],
  ];
  const ax: number[][] = [[45, 0], [tail * 0.5, 14], [tail, 0]];
  const ends: number[][][] = [[[tail, 0], [tail + 55, -40]], [[tail, 0], [tail + 62, 4]], [[tail, 0], [tail + 50, 48]]];
  [...br, ax, ...ends].forEach((p) => line(c, p, 26, INK));
  [...br, ax, ...ends].forEach((p) => line(c, p, 15, col));
  ends.forEach((p) => shape(c, () => ell(c, p[1][0], p[1][1], 17, 17), glow ? GOLD : col, 5));
  shape(c, () => ell(c, 0, 0, 62, 56), col, 7);
  shade(c, () => ell(c, 0, 0, 62, 56), dk, 14, 12, 0.55);
  shape(c, () => ell(c, -8, -4, 22, 20), dk, 4);
  c.restore();
};
// a small neuron, round middle and stubby branches all round
const mini = (c: Ctx, x: number, y: number, r: number, col: string = COL.purple) => {
  for (let k = 0; k < 6; k++) { const a = k * 1.05 + 0.3; thick(c, [[x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7], [x + Math.cos(a) * r * 1.7, y + Math.sin(a) * r * 1.7]], r * 0.22, col); }
  shape(c, () => ell(c, x, y, r, r), col, 6);
  shade(c, () => ell(c, x, y, r, r), "#6a4fa8", r * 0.2, r * 0.2, 0.5);
};

// a brain from the side, centre (x, y), width w; folds in a darker pink
const brain = (c: Ctx, x: number, y: number, w: number, h: number, folds = true) => {
  const path = () => {
    for (let i = 0; i <= 90; i++) {
      const a = (i / 90) * Math.PI * 2, bump = 1 + 0.045 * Math.sin(a * 9) + 0.02 * Math.sin(a * 5), sy = Math.sin(a) > 0 ? 0.82 : 1;
      const px = x + Math.cos(a) * (w / 2) * bump, py = y + Math.sin(a) * (h / 2) * sy * bump;
      i ? c.lineTo(px, py) : c.moveTo(px, py);
    }
    c.closePath();
  };
  const cb = () => ell(c, x - w * 0.3, y + h * 0.38, w * 0.2, h * 0.14, -0.2);
  shape(c, cb, PINKDK, 6);
  shape(c, () => rrect(c, x - w * 0.02, y + h * 0.3, w * 0.1, h * 0.38, w * 0.03), PINKDK, 6);
  shape(c, path, PINK, 7);
  shade(c, path, PINKDK, w * 0.07, h * 0.07, 0.6);
  if (folds) {
    c.save(); c.beginPath(); path(); c.clip();
    const f: number[][][] = [
      [[-0.38, -0.05], [-0.25, -0.3], [-0.1, -0.1], [0.05, -0.32]], [[0.12, -0.05], [0.28, -0.28], [0.4, -0.05]], [[-0.4, 0.15], [-0.22, 0.02], [-0.05, 0.2], [0.15, 0.05], [0.35, 0.22]],
      [[-0.2, -0.38], [-0.05, -0.22]], [[0.2, 0.3], [0.32, 0.12]],
    ];
    f.forEach((p) => line(c, p.map(([u, v]) => [x + u * w, y + v * h]), 7, PINKFOLD));
    c.restore();
    shape(c, path, "rgba(0,0,0,0)", 7);
  }
};

// a child's fist seen from the front, centre (x, y), size s
const fist = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - s * 0.5, y - s * 0.45, s, s * 0.9, s * 0.25), SKIN.child, 6);
  shade(c, () => rrect(c, x - s * 0.5, y - s * 0.45, s, s * 0.9, s * 0.25), SKIN.childDk, s * 0.08, s * 0.08, 0.5);
  for (let k = 1; k < 4; k++) line(c, [[x - s * 0.5 + (k * s) / 4, y - s * 0.4], [x - s * 0.5 + (k * s) / 4, y - s * 0.05]], 4, SKIN.childDk);
  shape(c, () => ell(c, x - s * 0.38, y + s * 0.25, s * 0.2, s * 0.14, 0.5), SKIN.child, 5);
};

// ---------------------------------------------------------------- things
const idli = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - 90 * s, y); c.lineTo(x - 90 * s, y + 30 * s); c.ellipse(x, y + 30 * s, 90 * s, 34 * s, 0, Math.PI, 0, true); c.lineTo(x + 90 * s, y); c.closePath(); }, "#f4efe2", 6);
  shade(c, () => { c.moveTo(x - 90 * s, y); c.lineTo(x - 90 * s, y + 30 * s); c.ellipse(x, y + 30 * s, 90 * s, 34 * s, 0, Math.PI, 0, true); c.lineTo(x + 90 * s, y); c.closePath(); }, "#d9d2bd", 26 * s, 0, 0.6);
  shape(c, () => ell(c, x, y, 90 * s, 34 * s), WHITE, 6);
  shape(c, () => ell(c, x, y, 28 * s, 10 * s), "#ece6d6", 3);
};
const idliPlate = (c: Ctx, x: number, y: number, s: number) => {
  plate(c, x, y, 250 * s, 120 * s);
  idli(c, x - 70 * s, y - 14 * s, 0.9 * s); idli(c, x + 65 * s, y + 6 * s, 0.9 * s);
  bowl(c, x + 110 * s, y - 70 * s, 62 * s, COL.greenLt);
};
const fadedPlate = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); (c as unknown as { filter: string }).filter = "blur(10px)"; c.globalAlpha = 0.4; idliPlate(c, x, y, s); c.restore();
};
const kite = (c: Ctx, x: number, y: number, s: number, col: string = COL.red, rot = 0.3) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  line(c, [[0, 90], [-30, 170], [20, 230], [-20, 290]], 5);
  shape(c, () => polyP(c, [[0, -100], [70, 0], [0, 90], [-70, 0]]), col, 6);
  shade(c, () => polyP(c, [[0, -100], [70, 0], [0, 90], [-70, 0]]), COL.orange, 22, 22, 0.55);
  line(c, [[0, -100], [0, 90]], 4); line(c, [[-70, 0], [70, 0]], 4);
  [[-30, 170, COL.yellow], [20, 230, COL.teal]].forEach(([bx, by, bc]) => shape(c, () => polyP(c, [[bx as number - 14, by as number - 10], [bx as number + 14, by as number - 10], [bx as number, by as number + 14]]), bc as string, 3));
  c.restore();
};
const house = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - 70 * s, y - 20 * s, 140 * s, 100 * s, 4), "#f1d9a8", 6);
  shape(c, () => polyP(c, [[x - 90 * s, y - 20 * s], [x, y - 90 * s], [x + 90 * s, y - 20 * s]]), COL.red, 6);
  shape(c, () => rrect(c, x - 18 * s, y + 20 * s, 36 * s, 60 * s, 4), COL.woodDk, 4);
};
const diya = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - 60 * s, y); c.quadraticCurveTo(x, y + 70 * s, x + 60 * s, y); c.closePath(); }, CLAY, 6);
  shape(c, () => { c.moveTo(x - 12 * s, y - 6 * s); c.quadraticCurveTo(x - 30 * s, y - 50 * s, x, y - 90 * s); c.quadraticCurveTo(x + 30 * s, y - 50 * s, x + 12 * s, y - 6 * s); c.closePath(); }, COL.yellow, 5);
  shape(c, () => ell(c, x, y - 36 * s, 8 * s, 16 * s), COL.orange, 0);
};
const eye = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - 60 * s, y); c.quadraticCurveTo(x, y - 55 * s, x + 60 * s, y); c.quadraticCurveTo(x, y + 55 * s, x - 60 * s, y); c.closePath(); }, WHITE, 6);
  shape(c, () => ell(c, x, y, 20 * s, 20 * s), COL.blueDk, 4); shape(c, () => ell(c, x, y, 8 * s, 8 * s), INK, 0);
};
const ear = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - 20 * s, y + 60 * s); c.bezierCurveTo(x - 70 * s, y + 20 * s, x - 50 * s, y - 70 * s, x + 10 * s, y - 70 * s); c.bezierCurveTo(x + 60 * s, y - 70 * s, x + 60 * s, y - 10 * s, x + 20 * s, y + 20 * s); c.bezierCurveTo(x, y + 50 * s, x + 10 * s, y + 70 * s, x - 20 * s, y + 60 * s); c.closePath(); }, SKIN.child, 6);
  line(c, [[x - 10 * s, y - 40 * s], [x + 20 * s, y - 30 * s], [x + 10 * s, y + 10 * s]], 5, SKIN.childDk);
};
const phoneBody = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.08, y + h / 2 + 8, w * 0.6, h * 0.03);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, w * 0.12), "#3a3540", 6);
  shape(c, () => rrect(c, x - w / 2 + 12, y - h / 2 + 30, w - 24, h - 60, w * 0.07), "#e6f2fb", 3);
};
const spoon = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.rotate(-0.5); c.scale(s, s);
  shape(c, () => rrect(c, -9, -10, 18, 130, 8), COL.steel, 5); shape(c, () => ell(c, 0, -40, 34, 50), COL.steel, 5); shape(c, () => ell(c, -4, -42, 18, 30), COL.steelIn, 0);
  c.restore();
};
const key = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.rotate(0.5); c.scale(s, s);
  shape(c, () => rrect(c, -8, -10, 16, 130, 6), COL.yellow, 5); shape(c, () => rrect(c, 8, 80, 28, 12, 3), COL.yellow, 5); shape(c, () => rrect(c, 8, 102, 22, 12, 3), COL.yellow, 5);
  shape(c, () => ell(c, 0, -40, 42, 42), COL.yellow, 5); shape(c, () => ell(c, 0, -40, 16, 16), BG, 4);
  c.restore();
};
const mango = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => ell(c, x, y, 70 * s, 58 * s, -0.5), COL.orange, 6);
  shade(c, () => ell(c, x, y, 70 * s, 58 * s, -0.5), COL.red, 20 * s, 20 * s, 0.4);
  shape(c, () => ell(c, x + 18 * s, y - 62 * s, 32 * s, 16 * s, -0.5), COL.leaf, 4);
};
const bucket = (c: Ctx, x: number, y: number, s: number) => {
  c.beginPath(); c.arc(x, y - 30 * s, 62 * s, Math.PI, 0); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  shape(c, () => polyP(c, [[x - 68 * s, y - 30 * s], [x + 68 * s, y - 30 * s], [x + 52 * s, y + 70 * s], [x - 52 * s, y + 70 * s]]), COL.blue, 6);
  shade(c, () => polyP(c, [[x - 68 * s, y - 30 * s], [x + 68 * s, y - 30 * s], [x + 52 * s, y + 70 * s], [x - 52 * s, y + 70 * s]]), COL.blueDk, 24 * s, 0, 0.6);
};
const pencil = (c: Ctx, x1: number, y1: number, x2: number, y2: number) => {
  const an = Math.atan2(y2 - y1, x2 - x1), tx = x2 - Math.cos(an) * 46, ty = y2 - Math.sin(an) * 46;
  line(c, [[x1, y1], [tx, ty]], 28, INK); line(c, [[x1, y1], [tx, ty]], 16, COL.yellow);
  shape(c, () => polyP(c, [[tx - Math.sin(an) * 14, ty + Math.cos(an) * 14], [tx + Math.sin(an) * 14, ty - Math.cos(an) * 14], [x2, y2]]), COL.wood, 5);
  shape(c, () => ell(c, x2, y2, 4, 4), INK, 0);
};
const crayon = (c: Ctx, x: number, y: number, h: number, col: string) => {
  shape(c, () => rrect(c, x - 22, y - h / 2 + 24, 44, h - 24, 4), col, 6);
  shape(c, () => polyP(c, [[x - 22, y - h / 2 + 24], [x + 22, y - h / 2 + 24], [x, y - h / 2]]), col, 6);
  shade(c, () => rrect(c, x - 22, y - h / 2 + 24, 44, h - 24, 4), INK, 14, 0, 0.18);
  shape(c, () => rrect(c, x - 22, y - 4, 44, 34, 2), WHITE, 5);
};
const tick = (c: Ctx, x: number, y: number, s: number, col: string = COL.greenDk) => line(c, [[x - s * 0.5, y], [x - s * 0.12, y + s * 0.4], [x + s * 0.55, y - s * 0.45]], s * 0.2, col);
const paperSheet = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 12, y + h + 14, w / 2, 16); shape(c, () => rrect(c, x, y, w, h, 10), COL.paper); };

// twelve tiles with different marks (stand-ins for letters; never words)
const SYM: number[][][] = [
  [[0, -1], [0.7, -0.7], [1, 0], [0.7, 0.7], [0, 1], [-0.7, 0.7], [-1, 0], [-0.7, -0.7], [0, -1]], [[0, -1], [0, 1]], [[-1, 0.8], [1, 0.8], [0, -0.9], [-1, 0.8]],
  [[-1, 0], [1, 0]], [[-0.8, -0.8], [0.8, -0.8], [0.8, 0.8], [-0.8, 0.8], [-0.8, -0.8]], [[-1, 0.6], [-0.4, -0.6], [0.4, 0.6], [1, -0.6]],
  [[-0.9, 0.5], [-0.4, -0.7], [0.4, -0.7], [0.9, 0.5]], [[-0.6, 0], [-0.5, 0]], [[0, -1], [0.9, 0], [0, 1], [-0.9, 0], [0, -1]], [[-1, 0], [1, 0]],
  [[-0.8, -0.8], [0.8, 0.8]], [[0.8, -0.8], [-0.6, -0.5], [0.6, 0.5], [-0.8, 0.8]],
];
const SYM2: Record<number, number[][]> = { 3: [[0, -1], [0, 1]], 7: [[0.5, 0], [0.6, 0]], 9: [[0, -1], [0, 1]], 10: [[0.8, -0.8], [-0.8, 0.8]] };
const TCOL = [COL.teal, COL.orange, COL.purple, COL.blue, COL.red, COL.green, COL.pink, COL.blueDk, COL.tealDk, COL.orange, COL.purple, COL.red];
const tile = (c: Ctx, x: number, y: number, s: number, k: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -s / 2, -s / 2, s, s, s * 0.16), WHITE, Math.max(3, s * 0.07));
  const u = s * 0.28, col = TCOL[k];
  line(c, SYM[k].map(([a, b]) => [a * u, b * u]), s * 0.11, col);
  if (SYM2[k]) line(c, SYM2[k].map(([a, b]) => [a * u, b * u]), s * 0.11, col);
  if (k === 7) { shape(c, () => ell(c, -u * 0.5, 0, u * 0.26, u * 0.26), col, 0); shape(c, () => ell(c, u * 0.5, 0, u * 0.26, u * 0.26), col, 0); }
  c.restore();
};

// ---------------------------------------------------------------- cover pictures
const intro = (c: Ctx) => {
  ground(c, TABLE);
  idliPlate(c, 360, 300, 1.2);
  fadedPlate(c, 730, 770, 1.2);
  // mist round the faded plate
  c.save(); c.globalAlpha = 0.5; (c as unknown as { filter: string }).filter = "blur(14px)";
  for (const [mx, my, mr] of [[560, 700, 110], [760, 640, 140], [930, 760, 100], [650, 860, 100]]) { c.beginPath(); ell(c, mx, my, mr, mr * 0.6); c.fillStyle = WHITE; c.fill(); }
  c.restore();
};

const summary = (c: Ctx) => {
  ground(c);
  // the network above her head: some links thin, some thick
  const N: number[][] = [[300, 230], [470, 120], [640, 210], [790, 120], [410, 330], [600, 350], [760, 310]];
  const L: number[][] = [[0, 1, 5], [1, 2, 18], [2, 3, 6], [0, 4, 20], [4, 5, 22], [5, 2, 7], [5, 6, 18], [6, 3, 6], [1, 4, 5]];
  L.forEach(([a, b, w]) => line(c, [N[a], N[b]], w, "#c9a227"));
  N.forEach(([nx, ny]) => { c.beginPath(); ell(c, nx, ny, 62, 62); c.fillStyle = "rgba(255,229,138,0.45)"; c.fill(); shape(c, () => ell(c, nx, ny, 26, 26), GOLD, 6); });
  kid(c, 540, 650, 160);
  tableBand(c, 940);
  hand(c, 300, 990, -1.95, 1.6, SKIN.child, CLOTH.child, true);
  hand(c, 780, 1010, -1.2, 1.6, SKIN.child, CLOTH.child, true);
};

// ---------------------------------------------------------------- flows
const e1 = (c: Ctx) => {
  ground(c);
  const objs = [spoon, mango, key, bucket];
  // top: repeat a list, round and round
  floorBand(c, 515, "#e6dcc3");
  [[190, 210], [400, 300], [640, 190], [850, 290]].forEach(([x, y], i) => objs[i](c, x, y, 1.15));
  const loopPts: number[][] = []; for (let k = 0; k <= 22; k++) { const a = 0.9 * Math.PI - (k / 22) * 1.8 * Math.PI; loopPts.push([540 + Math.cos(a) * 470, 270 + Math.sin(a) * 215]); }
  arrow(c, loopPts, RED, 10);
  // bottom: the same four things in one silly story, linked
  [[170, 720], [420, 800], [660, 720], [900, 800]].forEach(([x, y], i) => objs[i](c, x, y, 1.1));
  arrow(c, [[250, 700], [330, 700]], RED, 12); arrow(c, [[510, 760], [570, 730]], RED, 12); arrow(c, [[740, 730], [810, 770]], RED, 12);
};

const e2 = (c: Ctx) => {
  ground(c);
  paperSheet(c, 90, 140, 900, 640);
  for (let r = 0; r < 2; r++) for (let i = 0; i < 5; i++) {
    const bx = 130 + i * 168, by = 190 + r * 290;
    shape(c, () => rrect(c, bx, by, 140, 140, 14), WHITE, 6);
    const num = String(i + 1);
    if (r === 0) write(c, num, bx + 50, by + 34, 78, COL.blueDk, 10);
    else if (i < 2) { c.save(); c.translate(bx + 70, by + 70); c.rotate(i ? 0.25 : -0.3); write(c, num, -26, -34, 78, RED, 10); c.restore(); }
  }
  // the other hand, holding the pencil, writing the third number
  pencil(c, 960, 770, 540, 545);
  hand(c, 850, 710, -2.64, 1.6, SKIN.child, CLOTH.child);
};

const e3 = (c: Ctx) => {
  ground(c);
  const r = rnd(5);
  const place: number[][] = [[150, 190], [330, 120], [510, 220], [700, 130], [900, 210], [190, 380], [400, 400], [590, 350], [790, 410], [330, 280], [640, 230], [960, 380]];
  place.forEach(([x, y], i) => tile(c, x, y, 100, i, (r() - 0.5) * 0.9));
  arrow(c, [[540, 500], [540, 580]], RED, 12);
  const G = ["#f6d6df", "#d6ecf2", "#e3f0cf", "#fbe6bf"];
  for (let g = 0; g < 4; g++) {
    const gx = 62 + g * 240;
    shape(c, () => rrect(c, gx, 640, 224, 150, 22), G[g], 6);
    for (let k = 0; k < 3; k++) tile(c, gx + 44 + k * 68, 715, 62, g * 3 + k);
  }
  line(c, [[80, 860], [980, 860]], 6, "rgba(43,35,64,0.0)");
};

const a1 = (c: Ctx) => {
  ground(c);
  bubble(c, 650, 300, 380, 235, 400, 620);
  idliPlate(c, 500, 310, 0.62);
  fadedPlate(c, 810, 310, 0.62);
  kid(c, 330, 700, 150, true);
  tableBand(c, 930);
};

const a2 = (c: Ctx) => {
  ground(c);
  // two fists together = the brain
  fist(c, 190, 290, 190); fist(c, 380, 290, 190);
  line(c, [[500, 270], [610, 270]], 14); line(c, [[500, 320], [610, 320]], 14);
  brain(c, 800, 290, 340, 270);
  // lift the bag: about as heavy as a brain
  floorBand(c, 900);
  shape(c, () => polyP(c, [[340, 600], [740, 600], [790, 900], [290, 900]]), "#f1e3bd", 6);
  shade(c, () => polyP(c, [[340, 600], [740, 600], [790, 900], [290, 900]]), "#d6c28d", 30, 0, 0.6);
  shape(c, () => rrect(c, 440, 520, 200, 120, 40), "rgba(0,0,0,0)", 0);
  c.beginPath(); c.arc(540, 600, 100, Math.PI, 0); c.strokeStyle = INK; c.lineWidth = 16; c.stroke();
  // the bottles show in the bag
  shape(c, () => rrect(c, 410, 560, 130, 330, 40), COL.glass, 5);
  shape(c, () => rrect(c, 410, 700, 130, 190, 30), COL.water, 0);
  shape(c, () => rrect(c, 450, 520, 50, 50, 8), COL.blue, 5);
  shape(c, () => rrect(c, 590, 740, 90, 150, 24), COL.water, 5);
  shape(c, () => rrect(c, 615, 710, 40, 40, 6), COL.blue, 5);
  write(c, "1300 g", 390, 930, 70, INK, 9);
};

const a3 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 600, 480, 250);
  const dough = "#ecd9a8", doughDk = "#cdb77f";
  neuron(c, 250, 590, 0.58, dough, doughDk, 330);
  neuron(c, 730, 610, 0.58, dough, doughDk, 330);
  // the message crosses the gap as tiny grains
  for (let k = 0; k < 4; k++) shape(c, () => ell(c, 520 + k * 18, 610 + (k % 2) * 16, 9, 6, 0.5), "#fff5d9", 3);
  arrow(c, [[470, 470], [640, 470]], RED, 12);
};

const a4 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 560, 480, 380);
  shape(c, () => ell(c, 540, 556, 400, 308), "#fffdf5", 4);
  // line A: drawn once, faint; line B: drawn ten times, deep
  const wave = (y: number) => [[300, y], [390, y - 24], [490, y + 22], [590, y - 22], [690, y + 24], [790, y - 12]];
  line(c, wave(440), 7, "#e3dcc9");
  line(c, wave(670), 22, "#b9ab8a"); line(c, wave(670), 9, "#8c7c58");
  write(c, "1", 225, 415, 56, INK, 8);
  write(c, "10", 200, 645, 56, INK, 8);
  hand(c, 930, 840, -2.2, 1.5, SKIN.child, CLOTH.child);
};

const a5 = (c: Ctx) => {
  ground(c);
  // a flat seen from above: rooms and ten numbered spots in a walk
  shape(c, () => rrect(c, 90, 110, 900, 860, 14), COL.paper, 8);
  line(c, [[90, 540], [420, 540]], 8); line(c, [[600, 110], [600, 400]], 8); line(c, [[420, 540], [420, 970]], 8); line(c, [[600, 540], [990, 540]], 8);
  c.fillStyle = BG; c.fillRect(300, 536, 80, 8); c.fillRect(596, 250, 8, 80); c.fillRect(416, 780, 8, 80); c.fillRect(700, 536, 80, 8);
  shape(c, () => rrect(c, 40, 640, 60, 150, 6), COL.woodDk, 6);
  const P: number[][] = [[170, 760], [240, 620], [150, 400], [270, 210], [470, 280], [740, 200], [860, 380], [760, 640], [800, 860], [520, 800]];
  for (let i = 0; i < P.length - 1; i++) arrow(c, [P[i], P[i + 1]].map((p, k, a) => { const dx = a[1][0] - a[0][0], dy = a[1][1] - a[0][1], d = Math.hypot(dx, dy), t = 46 / d; return k ? [p[0] - dx * t, p[1] - dy * t] : [p[0] + dx * t, p[1] + dy * t]; }), RED, 7);
  P.forEach(([x, y], i) => { shape(c, () => ell(c, x, y, 40, 40), GOLD, 6); write(c, String(i + 1), x - (i === 9 ? 24 : 11), y - 18, 36, INK, 6); });
};

const a6 = (c: Ctx) => {
  ground(c);
  const cols = [RED, COL.blue, COL.green, COL.yellow], nums = ["47", "82", "15", "69"];
  cols.forEach((col, i) => {
    const x = 160 + i * 250;
    crayon(c, x, 270, 330, col);
    shape(c, () => rrect(c, x - 100, 560, 200, 200, 26), WHITE, 6);
    write(c, nums[i], x - 62, 610, 90, INK, 11);
    line(c, [[x, 450], [x, 545]], 8, INK);
  });
  arrow(c, [[160, 860], [840, 860]], RED, 10);
  qmark(c, 905, 800, 70);
};

const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 880, 460, 24);
  shape(c, () => polyP(c, [[90, 140], [540, 160], [540, 850], [90, 830]]), COL.paper, 7);
  shape(c, () => polyP(c, [[540, 160], [990, 140], [990, 830], [540, 850]]), WHITE, 7);
  for (let i = 0; i < 7; i++) {
    const y = 240 + i * 90;
    shape(c, () => rrect(c, 140, y - 30, 60, 60, 10), WHITE, 5);
    tick(c, 170, y + 2, 36);
    write(c, String(i + 1), 230, y - 24, 48, COL.blueDk, 8);
    shape(c, () => rrect(c, 600, y - 26, 80 + i * 48, 52, 12), i < 6 ? COL.teal : COL.orange, 6);
  }
  pencil(c, 1000, 700, 740, 900);
};

const c1 = (c: Ctx) => {
  ground(c);
  bubble(c, 710, 280, 330, 210, 480, 560);
  // the tablet and a sticky question
  shape(c, () => ell(c, 600, 290, 90, 90), WHITE, 7);
  line(c, [[600, 200], [600, 380]], 6);
  shape(c, () => rrect(c, 740, 210, 190, 150, 14), COL.blue, 6);
  for (let k = 0; k < 4; k++) for (let j = 0; j < 2; j++) shape(c, () => rrect(c, 756 + k * 44, 230 + j * 62, 36, 50, 8), "#eaf3fc", 4);
  qmark(c, 520, 250, 70);
  thatha(c, 330, 640, 175);
  tableBand(c, 940);
};

const c2 = (c: Ctx) => {
  ground(c);
  bubble(c, 620, 290, 400, 235, 380, 610);
  const cl = [COL.red, COL.blue, COL.yellow, COL.green, COL.purple, COL.orange, COL.teal];
  for (let i = 0; i < 20; i++) {
    const x = 330 + (i % 5) * 80, y = 190 + Math.floor(i / 5) * 78, k = i % 3;
    if (k === 0) shape(c, () => ell(c, x, y, 28, 28), cl[i % 7], 5);
    else if (k === 1) shape(c, () => rrect(c, x - 26, y - 26, 52, 52, 8), cl[i % 7], 5);
    else shape(c, () => polyP(c, [[x - 30, y + 26], [x + 30, y + 26], [x, y - 30]]), cl[i % 7], 5);
  }
  write(c, "20", 820, 230, 100, INK, 12);
  kid(c, 330, 730, 150, true);
  // until tomorrow: night, then morning
  shape(c, () => crescent(c, 780, 780, 70, 58, 35), COL.yellow, 6);
  arrow(c, [[880, 800], [950, 800]], RED, 10);
  shape(c, () => ell(c, 1000, 800, 38, 38), COL.orange, 6);
  tableBand(c, 950);
};

// ---------------------------------------------------------------- terms
const t0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 160, 840, 560, 300, 90), CLOTH.child, 7);
  shape(c, () => rrect(c, 360, 760, 160, 140, 30), SKIN.child, 6);
  // head, facing right
  const head = () => { c.moveTo(540, 130); c.bezierCurveTo(240, 110, 130, 400, 230, 590); c.bezierCurveTo(300, 740, 420, 780, 520, 760); c.lineTo(660, 750); c.bezierCurveTo(740, 740, 760, 700, 750, 640); c.lineTo(790, 600); c.lineTo(750, 570); c.bezierCurveTo(780, 480, 740, 380, 700, 330); c.bezierCurveTo(660, 190, 600, 140, 540, 130); c.closePath(); };
  shape(c, head, SKIN.child, 8);
  shade(c, head, SKIN.childDk, 12, 18, 0.35);
  shape(c, () => { c.moveTo(540, 130); c.bezierCurveTo(240, 110, 130, 400, 230, 590); c.bezierCurveTo(200, 400, 280, 260, 360, 230); c.bezierCurveTo(450, 200, 560, 230, 640, 260); c.bezierCurveTo(610, 170, 590, 140, 540, 130); c.closePath(); }, CLOTH.hair, 7);
  brain(c, 470, 400, 360, 270);
  shape(c, () => ell(c, 330, 640, 50, 70, 0.1), SKIN.child, 6);
  shape(c, () => ell(c, 690, 445, 16, 22), INK, 0);
  c.beginPath(); c.arc(690, 660, 30, 0.2, 2.2); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
};

const t2 = (c: Ctx) => {
  ground(c);
  // the tail end of one neuron, the branch of another, a gap between, dots crossing
  thick(c, [[40, 400], [320, 420], [440, 470]], 62, COL.purple);
  shape(c, () => ell(c, 460, 480, 80, 90), COL.purple, 7);
  shade(c, () => ell(c, 460, 480, 80, 90), "#6a4fa8", 16, 16, 0.55);
  thick(c, [[1040, 690], [820, 650], [690, 560]], 62, COL.teal);
  shape(c, () => ell(c, 670, 560, 80, 90), COL.teal, 7);
  shade(c, () => ell(c, 670, 560, 80, 90), COL.tealDk, 16, 16, 0.55);
  thick(c, [[690, 480], [720, 400], [780, 360]], 22, COL.teal); thick(c, [[740, 520], [830, 480], [900, 500]], 22, COL.teal);
  for (const [dx, dy, r] of [[528, 497, 12], [555, 520, 12], [585, 508, 12], [575, 545, 12], [545, 560, 12], [600, 530, 11]]) shape(c, () => ell(c, dx, dy, r, r), GOLD, 4);
  arrow(c, [[530, 440], [620, 470]], RED, 10);
  shape(c, () => rrect(c, 270, 800, 540, 10, 5), "rgba(0,0,0,0)", 0);
};

const t3 = (c: Ctx) => {
  ground(c);
  const b = [[280, 300], [800, 300], [540, 740]];
  b.forEach(([x, y]) => shape(c, () => ell(c, x, y, 215, 215), WHITE, 7));
  // a birthday cake with a candle
  shape(c, () => rrect(c, 190, 310, 180, 90, 12), COL.pink, 6);
  shape(c, () => rrect(c, 210, 230, 140, 82, 12), "#fff1d6", 6);
  line(c, [[280, 230], [280, 190]], 8, INK); shape(c, () => ell(c, 280, 165, 12, 22), COL.orange, 4);
  line(c, [[210, 312], [350, 312]], 8, COL.red);
  // 2 + 2 = 4
  write(c, "2+2", 660, 225, 90, INK, 12); line(c, [[660, 395], [750, 395]], 10); line(c, [[660, 430], [750, 430]], 10); write(c, "4", 800, 350, 110, RED, 14);
  // a child on a cycle
  c.save(); c.translate(540, 740);
  [[-90, 60], [90, 60]].forEach(([x, y]) => { shape(c, () => ell(c, x, y, 52, 52), "rgba(0,0,0,0)", 8); shape(c, () => ell(c, x, y, 13, 13), INK, 0); });
  line(c, [[-90, 60], [-10, 60], [30, -20], [-40, -20], [-90, 60]], 8); line(c, [[30, -20], [90, 60]], 8); line(c, [[30, -20], [45, -50]], 8); line(c, [[35, -50], [75, -50]], 8);
  line(c, [[-30, -20], [-40, -50]], 8); line(c, [[-60, -50], [-20, -50]], 10);
  line(c, [[-30, -45], [10, -110]], 34, CLOTH.child);
  line(c, [[-30, -45], [-5, 10], [-10, 50]], 12, COL.blueDk);
  line(c, [[10, -105], [50, -60]], 11, SKIN.child);
  shape(c, () => ell(c, 20, -145, 34, 34), SKIN.child, 6);
  shape(c, () => ell(c, 15, -158, 36, 26), CLOTH.hair, 5);
  c.restore();
};

const t4 = (c: Ctx) => {
  ground(c);
  phoneBody(c, 190, 500, 330, 640);
  write(c, "482", 85, 440, 90, INK, 10); write(c, "915", 85, 560, 90, INK, 10);
  // the child holds the number in mind
  kid(c, 540, 600, 110);
  bubble(c, 540, 260, 160, 100, 540, 440);
  write(c, "482915", 440, 235, 44, INK, 6);
  phoneBody(c, 890, 500, 330, 640);
  write(c, "482", 785, 440, 90, COL.blueDk, 10); write(c, "9", 785, 560, 90, COL.blueDk, 10); line(c, [[850, 560], [850, 650]], 8, RED);
};

const t5 = (c: Ctx) => {
  ground(c);
  gran(c, 290, 330, 120);
  kid(c, 790, 380, 105);
  // the album open between them
  shadow(c, 560, 1000, 460, 28);
  shape(c, () => polyP(c, [[120, 700], [540, 730], [540, 1000], [120, 960]]), COL.paper, 7);
  shape(c, () => polyP(c, [[540, 730], [960, 700], [960, 960], [540, 1000]]), WHITE, 7);
  shape(c, () => polyP(c, [[170, 750], [340, 765], [340, 880], [170, 860]]), COL.sky, 5);
  shape(c, () => polyP(c, [[370, 768], [500, 778], [500, 890], [370, 882]]), "#cfe3a8", 5);
  shape(c, () => ell(c, 255, 800, 28, 28), COL.yellow, 4);
  shape(c, () => ell(c, 435, 835, 22, 22), COL.pink, 4);
  shape(c, () => polyP(c, [[590, 780], [740, 770], [740, 890], [590, 890]]), "#f6d6a8", 5);
  shape(c, () => ell(c, 665, 815, 30, 30), SKIN.adult, 4);
  shape(c, () => polyP(c, [[770, 770], [920, 765], [920, 880], [770, 890]]), COL.sky, 5);
  shape(c, () => ell(c, 845, 810, 30, 30), SKIN.child, 4);
};

const t6 = (c: Ctx) => {
  ground(c);
  bubble(c, 640, 250, 420, 190, 400, 560);
  const pl: [number, number, string][] = [[300, 24, "#c9c2b5"], [365, 34, "#e8c98a"], [435, 36, "#4f8ed0"], [505, 30, "#d86a4b"], [600, 56, "#e0b97a"], [725, 48, "#e8d29a"], [820, 38, "#8fd3e0"], [900, 36, "#4b69c4"]];
  pl.forEach(([x, r, col]) => shape(c, () => ell(c, x, 250, r, r), col, 5));
  shape(c, () => ell(c, 725, 252, 80, 16, -0.15), "rgba(0,0,0,0)", 5);
  kid(c, 330, 660, 150, true);
  tableBand(c, 960);
  // counting on the fingers: three up
  line(c, [[860, 1100], [800, 880]], 150, INK); line(c, [[860, 1100], [800, 880]], 136, CLOTH.child);
  shape(c, () => rrect(c, 740, 740, 130, 160, 40), SKIN.child, 6);
  [[755, 640], [790, 612], [825, 640]].forEach(([x, y]) => shape(c, () => rrect(c, x - 16, y, 32, 140, 16), SKIN.child, 5));
  shape(c, () => ell(c, 740, 820, 22, 40, 0.5), SKIN.child, 5);
};

const t7 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 110, 180, 860, 640, 20), COL.woodDk, 8);
  shape(c, () => rrect(c, 150, 220, 780, 560, 8), "#2f4a3f", 6);
  // a name in chalk, clear on the left and rubbed away to the right
  const r = rnd(9);
  for (let i = 0; i < 10; i++) {
    const x = 200 + i * 64, a = Math.max(0.08, 1 - i * 0.11);
    c.globalAlpha = a;
    line(c, [[x, 470], [x + 14, 380 + r() * 20], [x + 30, 470], [x + 46, 400 + r() * 20], [x + 50, 470]], 12, "#f4f1e4");
    c.globalAlpha = 1;
  }
  c.save(); c.globalAlpha = 0.28; for (let i = 0; i < 7; i++) { c.beginPath(); ell(c, 560 + i * 48, 440 + (i % 2) * 40, 52, 34, 0.2); c.fillStyle = "#e9e5d6"; c.fill(); } c.restore();
  // the duster
  shape(c, () => rrect(c, 640, 570, 240, 120, 16), COL.red, 7);
  shape(c, () => rrect(c, 640, 640, 240, 50, 12), "#f7f3e8", 6);
  arrow(c, [[860, 530], [600, 510]], RED, 10);
  shape(c, () => rrect(c, 220, 700, 90, 22, 8), "#f4f1e4", 5);
};

const t9 = (c: Ctx) => {
  ground(c);
  floorBand(c, 800, "#e6d6b8");
  // girl sitting on the floor, veena in front
  shape(c, () => rrect(c, 250, 480, 340, 380, 70), CLOTH.child, 7);
  shape(c, () => ell(c, 420, 830, 260, 60), "#6b5a8c", 6);
  kid(c, 420, 300, 110);
  // the veena: big gourd on the floor, a long neck to the top right, a smaller gourd
  c.save(); c.translate(420, 760); c.rotate(-0.62);
  shape(c, () => rrect(c, 0, -22, 620, 44, 16), COL.woodDk, 7);
  shape(c, () => ell(c, 30, 0, 140, 105), CLAY, 7);
  shade(c, () => ell(c, 30, 0, 140, 105), CLAYDK, 28, 24, 0.6);
  shape(c, () => ell(c, 580, 0, 52, 40), CLAY, 6);
  for (let k = 0; k < 3; k++) line(c, [[110, -8 + k * 8], [560, -8 + k * 8]], 3);
  c.restore();
  hand(c, 520, 640, -0.62 - 0.2, 1.15, SKIN.child, CLOTH.child);
  // practice ticks in a notebook
  shadow(c, 860, 990, 200, 20);
  shape(c, () => polyP(c, [[690, 820], [1030, 820], [1030, 980], [690, 980]]), COL.paper, 7);
  for (let i = 0; i < 5; i++) tick(c, 740 + i * 62, 900, 40, COL.greenDk);
};

const t10 = (c: Ctx) => {
  ground(c);
  floorBand(c, 800);
  // clay ball, pressed by a hand ...
  shadow(c, 310, 790, 190, 30);
  const ball = () => ell(c, 310, 650, 150, 130);
  shape(c, ball, CLAY, 7);
  shade(c, ball, CLAYDK, 28, 22, 0.6);
  shape(c, () => rrect(c, 252, -20, 116, 330, 10), CLOTH.child, 7);
  hand(c, 310, 400, Math.PI / 2, 1.6, SKIN.child, CLOTH.child, true);
  // ... becomes a new shape
  arrow(c, [[500, 640], [640, 640]], RED, 12);
  shadow(c, 830, 790, 150, 26);
  const pot = () => { c.moveTo(700, 520); c.lineTo(960, 520); c.bezierCurveTo(1000, 650, 950, 780, 880, 785); c.lineTo(780, 785); c.bezierCurveTo(710, 780, 660, 650, 700, 520); c.closePath(); };
  shape(c, pot, CLAY, 7);
  shade(c, pot, CLAYDK, 30, 10, 0.6);
  shape(c, () => ell(c, 830, 520, 130, 32), CLAYDK, 7);
  shape(c, () => ell(c, 830, 524, 100, 20), "#7a4126", 0);
};

const t11 = (c: Ctx) => {
  ground(c);
  const r = rnd(3);
  const bc = [COL.red, COL.blue, COL.yellow, COL.green, COL.purple, COL.orange, COL.teal, COL.pink, COL.red, COL.blue];
  const P: number[][] = [[170, 190], [370, 120], [560, 230], [770, 150], [930, 260], [250, 380], [450, 410], [660, 370], [870, 430], [90, 330]];
  P.forEach(([x, y], i) => { shape(c, () => ell(c, x, y, 52, 52), bc[i], 6); shape(c, () => ell(c, x - 16, y - 16, 12, 12), "rgba(255,255,255,0.7)", 0); });
  r();
  arrow(c, [[540, 520], [540, 610]], RED, 12);
  [[790], [930]].forEach(([y]) => {
    line(c, [[90, y], [990, y]], 5);
  });
  [790, 930].forEach((y, row) => {
    for (let i = 0; i < 5; i++) { const x = 230 + i * 120; shape(c, () => ell(c, x, y, 52, 52), bc[row * 5 + i], 6); shape(c, () => ell(c, x - 16, y - 16, 12, 12), "rgba(255,255,255,0.7)", 0); }
  });
};

const t12 = (c: Ctx) => {
  ground(c);
  // a shoe from above, the toe at the bottom, laces crossing up to a bow
  shadow(c, 560, 990, 250, 30);
  const shoe = () => { c.moveTo(380, 120); c.bezierCurveTo(300, 300, 330, 560, 320, 760); c.bezierCurveTo(310, 940, 420, 1010, 560, 1010); c.bezierCurveTo(710, 1010, 800, 930, 770, 740); c.bezierCurveTo(760, 580, 790, 300, 700, 120); c.closePath(); };
  shape(c, shoe, COL.blue, 8);
  shade(c, shoe, COL.blueDk, 22, 10, 0.55);
  shape(c, () => { c.moveTo(420, 140); c.bezierCurveTo(400, 300, 410, 500, 410, 640); c.lineTo(690, 640); c.bezierCurveTo(690, 500, 700, 300, 670, 140); c.closePath(); }, "#e8f0f8", 6);
  for (let k = 0; k < 3; k++) {
    const y = 250 + k * 110;
    line(c, [[420, y], [670, y + 80]], 10, RED); line(c, [[670, y], [420, y + 80]], 10, RED);
    shape(c, () => ell(c, 410, y, 12, 12), INK, 0); shape(c, () => ell(c, 680, y, 12, 12), INK, 0);
  }
  // the bow: two loops and two tails
  shape(c, () => { c.moveTo(545, 580); c.bezierCurveTo(430, 470, 400, 640, 530, 640); c.closePath(); }, "rgba(0,0,0,0)", 0);
  const loop = (s: number) => shape(c, () => { c.moveTo(545, 600); c.bezierCurveTo(545 + s * 80, 500, 545 + s * 200, 520, 545 + s * 190, 600); c.bezierCurveTo(545 + s * 180, 680, 545 + s * 70, 650, 545, 600); c.closePath(); }, RED, 8);
  loop(-1); loop(1);
  line(c, [[545, 600], [505, 720]], 14, RED); line(c, [[545, 600], [600, 720]], 14, RED);
  shape(c, () => ell(c, 545, 600, 26, 26), COL.red, 7);
  hand(c, 190, 590, 0.0, 1.5, SKIN.child, CLOTH.child);
  hand(c, 900, 590, Math.PI, 1.5, SKIN.child, CLOTH.child);
};

const t13 = (c: Ctx) => {
  ground(c);
  floorBand(c, 900);
  // the door, with a school bag dropped in front of it
  shape(c, () => rrect(c, 50, 130, 250, 770, 6), COL.woodDk, 7);
  shape(c, () => ell(c, 250, 520, 14, 14), COL.yellow, 5);
  shadow(c, 200, 910, 130, 20);
  shape(c, () => rrect(c, 90, 720, 220, 180, 40), COL.red, 7);
  shade(c, () => rrect(c, 90, 720, 220, 180, 40), "#a8321f", 26, 0, 0.5);
  shape(c, () => rrect(c, 125, 790, 150, 80, 18), "#f08a74", 5);
  c.beginPath(); c.arc(200, 720, 50, Math.PI, 0); c.strokeStyle = INK; c.lineWidth = 10; c.stroke();
  // the wash basin
  shape(c, () => rrect(c, 700, 600, 340, 300, 10), COL.steel, 7);
  shape(c, () => rrect(c, 680, 570, 380, 60, 14), COL.steelIn, 7);
  line(c, [[880, 570], [880, 420], [800, 420], [800, 470]], 26, INK); line(c, [[880, 570], [880, 420], [800, 420], [800, 470]], 14, COL.steelDk);
  line(c, [[800, 480], [800, 565]], 12, COL.water);
  // the child, hands under the tap
  person(c, 540, 900, 780, { armL: [0.8, 0.0], armR: [0.55, 0.0] });
  [[800, 500], [790, 530], [810, 550]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 8, 12), COL.drop, 3));
};

// ---------------------------------------------------------------- explanations
const x0 = (c: Ctx) => {
  ground(c);
  // a lane with an auto coming, and a child crossing
  c.fillStyle = "#cfcabd"; c.fillRect(0, 820, D, 260); line(c, [[0, 820], [D, 820]], 5);
  for (let i = 0; i < 6; i++) c.fillRect(0, 0, 0, 0);
  for (let i = 0; i < 5; i++) { c.fillStyle = WHITE; c.fillRect(70 + i * 210, 940, 110, 22); }
  shape(c, () => rrect(c, 800, 690, 220, 130, 30), COL.yellow, 7);
  shape(c, () => rrect(c, 820, 650, 150, 60, 18), "#3a3540", 6);
  [[850, 825], [980, 825]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 34, 34), "#3a3540", 6));
  person(c, 420, 980, 720, { armL: [1.2, 1.5], armR: [0.4, 0.5] });
  // what the senses bring in, and the brain's order to the legs
  eye(c, 180, 190, 1.1); ear(c, 820, 200, 1.0);
  shape(c, () => ell(c, 500, 160, 0, 0), WHITE, 0);
  brain(c, 500, 190, 230, 160);
  arrow(c, [[250, 215], [370, 200]], RED, 9);
  arrow(c, [[780, 215], [650, 205]], RED, 9);
  arrow(c, [[500, 285], [500, 330]], RED, 9);
  arrow(c, [[640, 420], [640, 640]], RED, 9);
};

const x2 = (c: Ctx) => {
  ground(c);
  // 1: noticing a kite
  eye(c, 170, 800, 1.6); kite(c, 170, 400, 1.0);
  arrow(c, [[170, 700], [170, 640]], RED, 9);
  arrow(c, [[320, 500], [390, 500]], RED, 12);
  // 2: the kite, small, in a bubble
  shape(c, () => ell(c, 540, 520, 120, 120), WHITE, 7); kite(c, 540, 500, 0.4);
  arrow(c, [[690, 500], [750, 500]], RED, 12);
  // 3: the kite linked to a rooftop and a festival, a bigger bubble
  shape(c, () => ell(c, 900, 520, 150, 150), WHITE, 7); kite(c, 900, 400, 0.45); house(c, 830, 580, 0.6); diya(c, 980, 620, 0.5);
  line(c, [[900, 450], [840, 540]], 5, COL.blueDk); line(c, [[900, 450], [980, 570]], 5, COL.blueDk);
};

const x3 = (c: Ctx) => {
  ground(c);
  // two neurons with a faint link ...
  mini(c, 130, 300, 60); mini(c, 330, 720, 60);
  line(c, [[170, 345], [300, 675]], 8, "#b9b4ab");
  c.setLineDash([10, 22]); line(c, [[170, 345], [300, 675]], 8, "#b9b4ab"); c.setLineDash([]);
  arrow(c, [[420, 520], [560, 520]], RED, 12);
  // ... after practice, a thick strong link
  mini(c, 700, 300, 60); mini(c, 900, 720, 60);
  line(c, [[740, 345], [870, 675]], 40, INK); line(c, [[740, 345], [870, 675]], 28, COL.purple);
  [[790, 460], [820, 540]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 14, 14), GOLD, 4));
};

const x4 = (c: Ctx) => {
  ground(c);
  floorBand(c, 900, "#cfe3a8");
  // a slide: steep at first, then flatter
  const slide = [[210, 190], [260, 390], [360, 580], [520, 720], [740, 790], [930, 800]];
  line(c, slide, 120, INK); line(c, slide, 100, COL.red);
  line(c, slide, 40, "#f08a74");
  line(c, [[210, 190], [210, 900]], 22, INK); line(c, [[210, 190], [210, 900]], 12, COL.steel);
  line(c, [[520, 720], [520, 900]], 22, INK); line(c, [[520, 720], [520, 900]], 12, COL.steel);
  shape(c, () => rrect(c, 130, 150, 160, 30, 6), COL.woodDk, 6);
  // a child sliding down
  line(c, [[420, 600], [470, 690]], 30, COL.blueDk);
  line(c, [[345, 520], [425, 610]], 66, INK); line(c, [[345, 520], [425, 610]], 54, CLOTH.child);
  line(c, [[350, 500], [280, 440]], 16, SKIN.child);
  shape(c, () => ell(c, 330, 458, 44, 44), SKIN.child, 6);
  shape(c, () => ell(c, 322, 438, 44, 32), CLOTH.hair, 5);
  // the way back up: recall again
  arrow(c, [[960, 740], [1000, 500], [900, 260], [410, 170]], RED, 12);
};

export const ic_mindThinkingAndMemoryL3 = cards("sci.mind.thinking-and-memory.L3 cards", [
  intro, summary, e1, e2, e3, a1, a2, a3, a4, a5, a6, p1, c1, c2,
  t0, t2, t3, t4, t5, t6, t7, t9, t10, t11, t12, t13,
  x0, x2, x3, x4,
]);
