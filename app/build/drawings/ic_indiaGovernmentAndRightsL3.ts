import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, SKIN, WHITE, arrow, cards, ell, ground, hand, line, person, polyP, rrect, shade, shadow, shape, shine, write } from "./flatKit";

const FLOOR = "#e9dcc0", GRASS = "#cfe3a8", WALL = "#f3e9d2", TABLE = "#ecd3a1", STONE = "#f1dcb0", SAFFRON = "#f39a3c", NAVY = "#3b4a8c";
const floor = (c: Ctx, y = 780, col = FLOOR) => { ground(c); c.fillStyle = col; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 5); };
const wrist = (x: number, y: number, h: number, side: -1 | 1, [a1, a2]: [number, number]) => {
  const sh = y - h * 0.74, sx = x + side * h * 0.11, sy = sh + h * 0.03, ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};
// hair drawn over a person's head: grey for an elder, with an optional bun
const hairOver = (c: Ctx, x: number, y: number, h: number, col: string, sit = false, bun = false) => {
  const head = h * 0.13, sh = sit ? y - h * 0.38 : y - h * 0.74, hy = sh - head * 1.05;
  if (bun) shape(c, () => ell(c, x - head * 0.2, hy - head * 1.2, head * 0.5, head * 0.45), col, 5);
  shape(c, () => { c.moveTo(x - head * 1.02, hy); c.bezierCurveTo(x - head, hy - head * 1.5, x + head, hy - head * 1.5, x + head * 1.02, hy); c.quadraticCurveTo(x, hy - head * 0.55, x - head * 1.02, hy); c.closePath(); }, col, 5);
};

// ------------------------------------------------------------ small objects
const coin = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.9, r, r * 0.2);
  shape(c, () => ell(c, x, y, r, r), COL.yellow, Math.max(4, r * 0.1));
  shape(c, () => ell(c, x, y, r * 0.78, r * 0.78), "#ffe27a", 0);
  const w = Math.max(3, r * 0.1);
  line(c, [[x - r * 0.34, y - r * 0.42], [x + r * 0.34, y - r * 0.42]], w);
  line(c, [[x - r * 0.34, y - r * 0.15], [x + r * 0.34, y - r * 0.15]], w);
  c.beginPath(); c.moveTo(x - r * 0.3, y - r * 0.42); c.bezierCurveTo(x + r * 0.42, y - r * 0.42, x + r * 0.42, y + r * 0.1, x - r * 0.3, y + r * 0.1); c.strokeStyle = INK; c.lineWidth = w; c.lineCap = "round"; c.stroke();
  line(c, [[x - r * 0.1, y + r * 0.04], [x + r * 0.28, y + r * 0.5]], w);
};
const bill = (c: Ctx, x: number, y: number, w: number, h: number, hl = -1, rows = 7) => {
  shape(c, () => rrect(c, x, y, w, h, 10), COL.paper, 6);
  const top = y + h * 0.12, step = (h * 0.8) / rows;
  line(c, [[x + w * 0.25, top], [x + w * 0.75, top]], 10, COL.steelDk);
  for (let i = 1; i < rows; i++) {
    const yy = top + i * step;
    if (i === hl) { c.fillStyle = COL.yellow; c.fillRect(x + w * 0.05, yy - step * 0.42, w * 0.9, step * 0.84); }
    line(c, [[x + w * 0.1, yy], [x + w * (0.35 + ((i * 37) % 30) / 100), yy]], 7, COL.grey);
    line(c, [[x + w * 0.74, yy], [x + w * 0.9, yy]], 7, COL.greyDk);
  }
  return top + hl * step;
};
const magnifier = (c: Ctx, x: number, y: number, r: number) => {
  line(c, [[x + r * 0.7, y + r * 0.7], [x + r * 1.9, y + r * 1.9]], r * 0.34, INK);
  line(c, [[x + r * 0.7, y + r * 0.7], [x + r * 1.9, y + r * 1.9]], r * 0.34 - 10, COL.brown);
  shape(c, () => ell(c, x, y, r, r), "rgba(214,236,250,0.45)", 10);
  shine(c, [[x - r * 0.6, y - r * 0.1], [x - r * 0.3, y - r * 0.6]], 8);
};
const book = (c: Ctx, x: number, y: number, w: number, h: number, col: string = COL.blue, dk: string = COL.blueDk) => {
  shadow(c, x + w * 0.5, y + h + 8, w * 0.55, 14);
  shape(c, () => rrect(c, x, y, w, h, 8), "#fffaf0", 6);
  shape(c, () => rrect(c, x, y, w - 12, h - 12, 8), col, 6);
  shade(c, () => rrect(c, x, y, w - 12, h - 12, 8), dk, w * 0.08, 0, 0.6);
  shape(c, () => rrect(c, x + w * 0.16, y + h * 0.15, w * 0.5, h * 0.22, 4), COL.yellow, 4);
};
// a book standing up facing us with a red ribbon marker hanging from the bottom
const ribbonBook = (c: Ctx, x: number, y: number, w: number, h: number) => {
  book(c, x, y, w, h);
  shape(c, () => polyP(c, [[x + w * 0.5, y + h - 8], [x + w * 0.64, y + h - 8], [x + w * 0.64, y + h + h * 0.22], [x + w * 0.57, y + h + h * 0.14], [x + w * 0.5, y + h + h * 0.22]]), RED, 4);
};
const envelope = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.55, y + h + 8, w * 0.55, 12);
  shape(c, () => rrect(c, x, y, w, h, 6), "#fffaf0", 6);
  line(c, [[x + 4, y + 4], [x + w / 2, y + h * 0.58], [x + w - 4, y + 4]], 5);
  shape(c, () => rrect(c, x + w * 0.74, y + h * 0.14, w * 0.18, h * 0.24, 3), RED, 3);
};
const paperSheet = (c: Ctx, x: number, y: number, w: number, h: number, rows = 6) => {
  shape(c, () => rrect(c, x, y, w, h, 8), COL.paper, 6);
  for (let i = 0; i < rows; i++) line(c, [[x + w * 0.12, y + h * 0.15 + i * (h * 0.7 / rows)], [x + w * (0.6 + ((i * 29) % 30) / 100), y + h * 0.15 + i * (h * 0.7 / rows)]], 6, COL.grey);
};
const tick = (c: Ctx, x: number, y: number, s: number, col = COL.greenDk) => line(c, [[x - s * 0.5, y], [x - s * 0.1, y + s * 0.4], [x + s * 0.55, y - s * 0.45]], Math.max(6, s * 0.2), col);
const cross = (c: Ctx, x: number, y: number, s: number, col = RED) => { line(c, [[x - s * 0.45, y - s * 0.45], [x + s * 0.45, y + s * 0.45]], Math.max(6, s * 0.2), col); line(c, [[x + s * 0.45, y - s * 0.45], [x - s * 0.45, y + s * 0.45]], Math.max(6, s * 0.2), col); };
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.65, y + Math.sin(a) * r * 1.65]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
const tree = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => polyP(c, [[x - 28 * s, y], [x - 18 * s, y - 220 * s], [x + 18 * s, y - 220 * s], [x + 28 * s, y]]), COL.soil, 6);
  for (const [dx, dy, r] of [[-110, -250, 120], [110, -250, 120], [0, -340, 140], [-40, -230, 110], [60, -200, 100]]) shape(c, () => ell(c, x + dx * s, y + dy * s, r * s, r * s * 0.85), COL.leaf, 6);
  shade(c, () => ell(c, x + 60 * s, y - 330 * s, 150 * s, 130 * s), COL.leafDk, 40 * s, 40 * s, 0.4);
};
const calendar = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 10), COL.paper, 6);
  shape(c, () => rrect(c, x, y, w, h * 0.22, 10), RED, 6);
  for (const k of [0.25, 0.75]) line(c, [[x + w * k, y - 10], [x + w * k, y + 14]], 8);
};
const sack = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + 8 * s, y + 4, 75 * s, 14 * s);
  shape(c, () => { c.moveTo(x - 55 * s, y); c.bezierCurveTo(x - 80 * s, y - 70 * s, x - 55 * s, y - 120 * s, x - 22 * s, y - 138 * s); c.lineTo(x + 22 * s, y - 138 * s); c.bezierCurveTo(x + 55 * s, y - 120 * s, x + 80 * s, y - 70 * s, x + 55 * s, y); c.closePath(); }, "#e8cf9c", 6);
  shade(c, () => { c.moveTo(x - 55 * s, y); c.bezierCurveTo(x - 80 * s, y - 70 * s, x - 55 * s, y - 120 * s, x - 22 * s, y - 138 * s); c.lineTo(x + 22 * s, y - 138 * s); c.bezierCurveTo(x + 55 * s, y - 120 * s, x + 80 * s, y - 70 * s, x + 55 * s, y); c.closePath(); }, "#c9ac72", 24 * s, 0, 0.6);
  line(c, [[x - 30 * s, y - 128 * s], [x + 30 * s, y - 128 * s]], 6, INK);
  line(c, [[x - 20 * s, y - 138 * s], [x, y - 165 * s], [x + 20 * s, y - 138 * s]], 6, INK); line(c, [[x - 26 * s, y - 80 * s], [x + 26 * s, y - 80 * s]], 4, "#c9ac72");
};
const basket = (c: Ctx, x: number, y: number, rx: number, soil = true) => {
  if (soil) shape(c, () => ell(c, x, y - rx * 0.15, rx * 0.95, rx * 0.4), COL.soil, 4);
  shape(c, () => { c.moveTo(x - rx, y - rx * 0.2); c.lineTo(x - rx * 0.7, y + rx * 0.5); c.lineTo(x + rx * 0.7, y + rx * 0.5); c.lineTo(x + rx, y - rx * 0.2); c.closePath(); }, COL.woodDk, 5);
  for (let i = -1; i <= 1; i++) line(c, [[x + i * rx * 0.5, y - rx * 0.1], [x + i * rx * 0.4, y + rx * 0.45]], 3, COL.brown);
};
const spade = (c: Ctx, x: number, y: number, len: number, an: number) => {
  const dx = Math.cos(an), dy = Math.sin(an), ex = x + dx * len, ey = y + dy * len;
  line(c, [[x, y], [ex, ey]], 16, INK); line(c, [[x, y], [ex, ey]], 6, COL.wood);
  shape(c, () => { c.save(); c.translate(ex, ey); c.rotate(an); c.moveTo(0, -26); c.lineTo(50, -22); c.lineTo(70, 0); c.lineTo(50, 22); c.lineTo(0, 26); c.closePath(); c.restore(); }, COL.steelDk, 5);
};
const matka = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + 8 * s, y + 4, 70 * s, 12 * s);
  const p = () => { c.moveTo(x - 30 * s, y - 130 * s); c.bezierCurveTo(x - 110 * s, y - 110 * s, x - 100 * s, y, x - 40 * s, y); c.lineTo(x + 40 * s, y); c.bezierCurveTo(x + 100 * s, y, x + 110 * s, y - 110 * s, x + 30 * s, y - 130 * s); c.closePath(); };
  shape(c, p, "#c9693a"); shade(c, p, "#a24d27", 30 * s, 0, 0.6);
  shape(c, () => ell(c, x, y - 132 * s, 36 * s, 10 * s), "#a24d27", 5);
};
const globe = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 1.05, r * 0.8, r * 0.1);
  shape(c, () => ell(c, x, y, r, r), COL.water, 7);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip();
  for (const [dx, dy, rx, ry, rot] of [[-0.35, -0.3, 0.38, 0.28, 0.3], [0.3, -0.05, 0.3, 0.42, -0.2], [-0.2, 0.45, 0.28, 0.22, 0.5], [0.55, 0.5, 0.2, 0.15, 0]]) shape(c, () => ell(c, x + dx * r, y + dy * r, rx * r, ry * r, rot), COL.greenLt, 4);
  c.restore();
  shade(c, () => ell(c, x, y, r, r), COL.waterDk, r * 0.3, r * 0.25, 0.35);
  shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", 7);
  shine(c, [[x - r * 0.7, y - r * 0.35], [x - r * 0.45, y - r * 0.7]], 9);
};
const pin = (c: Ctx, x: number, y: number, s: number, col = RED) => shape(c, () => { c.moveTo(x, y); c.bezierCurveTo(x - 36 * s, y - 40 * s, x - 36 * s, y - 90 * s, x, y - 90 * s); c.bezierCurveTo(x + 36 * s, y - 90 * s, x + 36 * s, y - 40 * s, x, y); c.closePath(); }, col, 5);
// a register page: name bars down the left, a grid of day boxes with ticks; circleRow marks one row
const registerSheet = (c: Ctx, x: number, y: number, w: number, h: number, rows: number, cols: number, circleRow = -1, skipCells: number[][] = []) => {
  shadow(c, x + w * 0.55, y + h + 12, w * 0.55, 14);
  shape(c, () => rrect(c, x, y, w, h, 10), COL.paper, 6);
  const top = y + 30, rh = (h - 60) / rows, nameW = w * 0.3, cw = (w - nameW - 50) / cols;
  for (let r = 0; r < rows; r++) {
    const yy = top + r * rh;
    line(c, [[x + 20, yy + rh / 2], [x + 20 + nameW * (0.55 + ((r * 31) % 40) / 100), yy + rh / 2]], 8, COL.greyDk);
    for (let k = 0; k < cols; k++) {
      const bx = x + nameW + 30 + k * cw;
      shape(c, () => rrect(c, bx, yy + rh * 0.15, cw - 8, rh * 0.7, 4), "#fff", 3);
      if (!skipCells.some(([a, b]) => a === r && b === k)) tick(c, bx + (cw - 8) / 2, yy + rh / 2, Math.min(cw, rh) * 0.5);
    }
  }
  if (circleRow >= 0) { c.beginPath(); c.ellipse(x + w / 2, top + circleRow * rh + rh / 2, w * 0.52, rh * 0.62, 0, 0, Math.PI * 2); c.strokeStyle = RED; c.lineWidth = 9; c.stroke(); }
};
const govBuilding = (c: Ctx, cx: number, by: number, w: number) => {
  const h = w * 0.42, x0 = cx - w / 2, bt = by - 56 - h;
  shadow(c, cx + w * 0.04, by + 6, w * 0.58, 16);
  shape(c, () => rrect(c, x0 - 24, by - 28, w + 48, 28, 4), COL.steel, 6);
  shape(c, () => rrect(c, x0 - 8, by - 56, w + 16, 28, 4), COL.steelIn, 6);
  shape(c, () => rrect(c, x0 + 10, bt, w - 20, h, 4), STONE, 6);
  shade(c, () => rrect(c, x0 + 10, bt, w - 20, h, 4), "#d8bf8a", w * 0.03, 0, 0.5);
  for (let i = 0; i < 4; i++) for (const sx of [-1, 1]) { const wx = cx + sx * (w * 0.14 + i * w * 0.095) - w * 0.03; shape(c, () => rrect(c, wx, bt + h * 0.18, w * 0.06, h * 0.55, 4), COL.sky, 4); }
  shape(c, () => { c.moveTo(cx - w * 0.07, by - 56); c.lineTo(cx - w * 0.07, bt + h * 0.45); c.arc(cx, bt + h * 0.45, w * 0.07, Math.PI, 0); c.lineTo(cx + w * 0.07, by - 56); c.closePath(); }, COL.soilDk, 5);
  shape(c, () => { c.moveTo(cx - w * 0.2, bt); c.bezierCurveTo(cx - w * 0.2, bt - w * 0.26, cx + w * 0.2, bt - w * 0.26, cx + w * 0.2, bt); c.closePath(); }, "#e9c46a", 6);
  shape(c, () => rrect(c, cx - w * 0.23, bt - 14, w * 0.46, 18, 4), STONE, 5);
  line(c, [[cx, bt - w * 0.19], [cx, bt - w * 0.19 - 120]], 7);
  for (let i = 0; i < 3; i++) shape(c, () => rrect(c, cx, bt - w * 0.19 - 120 + i * 20, 90, 20, 0), [SAFFRON, WHITE, COL.green][i], 3);
};
const schoolBuilding = (c: Ctx, cx: number, by: number, w: number) => {
  const h = w * 0.36, x0 = cx - w / 2;
  shadow(c, cx + w * 0.05, by + 6, w * 0.56, 14);
  shape(c, () => rrect(c, x0, by - h, w, h, 6), "#f6c98a", 6);
  shade(c, () => rrect(c, x0, by - h, w, h, 6), "#dba66a", w * 0.03, 0, 0.5);
  shape(c, () => polyP(c, [[x0 - 20, by - h], [cx, by - h - w * 0.18], [x0 + w + 20, by - h]]), COL.red, 6);
  for (const sx of [-1, 1]) for (const k of [0, 1]) shape(c, () => rrect(c, cx + sx * (w * 0.2 + k * w * 0.13) - w * 0.04, by - h * 0.78, w * 0.08, h * 0.4, 4), COL.sky, 4);
  shape(c, () => { c.moveTo(cx - w * 0.08, by); c.lineTo(cx - w * 0.08, by - h * 0.55); c.arc(cx, by - h * 0.55, w * 0.08, Math.PI, 0); c.lineTo(cx + w * 0.08, by); c.closePath(); }, COL.soilDk, 5);
  shape(c, () => ell(c, cx, by - h - w * 0.07, w * 0.045, w * 0.045), WHITE, 4);
};
const crowdPerson = (c: Ctx, x: number, y: number, h: number, adult: boolean, sit = false, arms: Partial<{ armL: [number, number]; armR: [number, number] }> = {}) => person(c, x, y, h, { adult, sit, ...arms });

// ------------------------------------------------------------ the cards
const intro = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, -20, 860, 1120, 400, 0), TABLE, 6); c.fillStyle = "#d9b87c"; c.fillRect(0, 868, 1080, 22);
  const row = bill(c, 570, 220, 400, 620, 3);
  c.beginPath(); c.ellipse(770, row, 200, 52, 0, 0, Math.PI * 2); c.strokeStyle = RED; c.lineWidth = 10; c.stroke();
  book(c, 70, 600, 440, 250);
  arrow(c, [[555, row], [470, 400], [330, 410], [290, 585]], RED, 12);
};
const summary = (c: Ctx) => {
  ground(c); c.fillStyle = WALL; c.fillRect(0, 0, 1080, 760);
  c.globalAlpha = 0.5;
  schoolBuilding(c, 190, 560, 300);
  shape(c, () => rrect(c, 880, 220, 16, 340, 4), COL.steelDk, 5); shape(c, () => ell(c, 888, 215, 50, 28), COL.yellow, 5);
  c.globalAlpha = 1;
  c.fillStyle = "#cbbf9e"; c.fillRect(0, 700, 1080, 60);
  person(c, 540, 930, 760, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [-0.95, -1.5] });
  const [wx, wy] = wrist(540, 930, 760, 1, [-0.95, -1.5]);
  const row = bill(c, wx - 20, wy - 40, 300, 560, 3, 8);
  c.beginPath(); c.ellipse(wx + 130, row, 150, 40, 0, 0, Math.PI * 2); c.strokeStyle = RED; c.lineWidth = 9; c.stroke();
  shape(c, () => ell(c, wx - 8, wy + 6, 30, 30), SKIN.child, 5);
  shape(c, () => rrect(c, -20, 800, 1120, 300, 0), TABLE, 6); c.fillStyle = "#d9b87c"; c.fillRect(0, 808, 1080, 22);
};
const e1 = (c: Ctx) => {
  ground(c);
  for (const [dx, dy, r] of [[-70, 30, -0.12], [60, 10, 0.1]]) { c.save(); c.translate(540 + dx, 540 + dy); c.rotate(r); c.translate(-540, -540); bill(c, 340, 120, 400, 640, -1, 9); c.restore(); }
  const row = bill(c, 340, 140, 400, 640, 4, 9);
  magnifier(c, 640, row, 130);
  coin(c, 260, 860, 60); coin(c, 340, 900, 50); coin(c, 800, 880, 58);
  write(c, "18", 470, row - 28, 56, RED, 9);
};
const e2 = (c: Ctx) => {
  ground(c);
  // a T-shirt with its label
  const shirt = () => polyP(c, [[190, 330], [330, 270], [380, 320], [480, 320], [530, 270], [670, 330], [600, 470], [540, 430], [540, 800], [320, 800], [320, 430], [260, 470]]);
  shadow(c, 440, 820, 250, 24);
  shape(c, shirt, COL.teal, 6); shade(c, shirt, COL.tealDk, 40, 0, 0.55);
  shape(c, () => { c.moveTo(380, 320); c.quadraticCurveTo(430, 380, 480, 320); c.closePath(); }, COL.tealDk, 5);
  shape(c, () => rrect(c, 395, 335, 70, 100, 4), WHITE, 4); line(c, [[408, 360], [452, 360]], 5, COL.greyDk); line(c, [[408, 385], [452, 385]], 5, COL.greyDk); shape(c, () => ell(c, 430, 415, 9, 9), RED, 2);
  magnifier(c, 430, 385, 95);
  globe(c, 800, 560, 190);
  pin(c, 745, 560, 1.1);
  arrow(c, [[520, 300], [620, 200], [780, 230], [800, 330]], RED, 10);
};
const a1 = (c: Ctx) => {
  ground(c, COL.sky);
  c.fillStyle = "#b9d98a"; c.fillRect(0, 560, 1080, 520);
  c.fillStyle = COL.greyDk; c.fillRect(0, 680, 1080, 160); line(c, [[0, 680], [1080, 680]], 5); line(c, [[0, 840], [1080, 840]], 5);
  for (let i = 0; i < 6; i++) line(c, [[40 + i * 190, 760], [130 + i * 190, 760]], 8, WHITE);
  schoolBuilding(c, 230, 600, 340);
  tree(c, 850, 620, 0.9);
  shape(c, () => rrect(c, 592, 250, 18, 430, 4), COL.steelDk, 5); shape(c, () => ell(c, 560, 250, 70, 26), COL.yellow, 5);
  shape(c, () => rrect(c, 700, 540, 14, 140, 3), COL.steelDk, 4); shape(c, () => rrect(c, 680, 500, 90, 44, 6), COL.blue, 5);
  // window frame
  const fr = () => { rrect(c, 40, 40, 1000, 780, 20); };
  c.beginPath(); fr(); c.rect(1080, 0, -1080, 1080); c.fillStyle = "#c58a52"; c.fill("evenodd"); c.lineWidth = 8; c.strokeStyle = INK; c.stroke();
  c.fillStyle = "#c58a52"; c.fillRect(0, 0, 1080, 40); c.fillRect(0, 820, 1080, 260);
  line(c, [[540, 40], [540, 820]], 18, "#c58a52"); line(c, [[540, 40], [540, 820]], 5);
  line(c, [[40, 40], [1040, 40], [1040, 820], [40, 820], [40, 40]], 6);
  shape(c, () => rrect(c, -10, 800, 1100, 60, 6), "#d9a56c", 6);
  person(c, 330, 1130, 520, { armL: [Math.PI * 0.5, Math.PI * 0.4], armR: [Math.PI * 0.4, Math.PI * 0.3] });
  shape(c, () => rrect(c, 560, 880, 260, 180, 8), COL.paper, 6);
  for (let i = 0; i < 4; i++) { line(c, [[600, 920 + i * 36], [700, 920 + i * 36]], 6, COL.grey); tick(c, 760, 920 + i * 36, 22); }
};
const a2 = (c: Ctx) => {
  floor(c, 720, GRASS);
  schoolBuilding(c, 540, 520, 320);
  // two landing zones
  shape(c, () => ell(c, 240, 880, 200, 90), "#bfe6a8", 6); tick(c, 240, 880, 110, COL.greenDk);
  shape(c, () => ell(c, 840, 880, 200, 90), "#f6b9ae", 6); cross(c, 840, 880, 100);
  person(c, 540, 840, 560, { armL: [-2.5, -2.3], armR: [-0.65, -0.8] });
  shadow(c, 540, 905, 130, 20);
};
const a3 = (c: Ctx) => {
  ground(c);
  registerSheet(c, 120, 130, 700, 620, 6, 5, 3, [[3, 1], [3, 2], [3, 3]]);
  const card = (x: number, y: number, rot: number) => {
    c.save(); c.translate(x, y); c.rotate(rot); shadow(c, 70, 190, 90, 12);
    shape(c, () => rrect(c, 0, 0, 170, 190, 8), COL.orange, 6);
    shape(c, () => rrect(c, 22, 22, 126, 76, 4), WHITE, 4); shape(c, () => ell(c, 85, 56, 22, 22), SKIN.adult, 4);
    for (let i = 0; i < 3; i++) line(c, [[30, 122 + i * 24], [140, 122 + i * 24]], 6, COL.paper);
    c.restore();
  };
  card(800, 560, 0.1); card(740, 760, -0.08);
  magnifier(c, 600, 410, 100);
};
const a4 = (c: Ctx) => {
  floor(c, 800, TABLE);
  paperSheet(c, 130, 190, 480, 600, 7);
  shape(c, () => ell(c, 220, 260, 38, 38), "rgba(0,0,0,0)", 0);
  // a pencil writing
  const pen = () => polyP(c, [[400, 520], [440, 480], [720, 200], [770, 250], [490, 530], [450, 570]]);
  shape(c, pen, COL.yellow, 6);
  shape(c, () => polyP(c, [[400, 520], [440, 480], [450, 570]]), "#f2d9b0", 5);
  shape(c, () => polyP(c, [[400, 520], [412, 508], [420, 540]]), INK, 3);
  shape(c, () => polyP(c, [[720, 200], [770, 250], [790, 228], [742, 178]]), COL.pink, 5);
  line(c, [[150, 540], [330, 540]], 6, COL.greyDk);
  envelope(c, 700, 560, 280, 190);
  arrow(c, [[640, 430], [740, 470], [800, 540]], RED, 10);
};
const a5 = (c: Ctx) => {
  floor(c, 720, "#dcc79b");
  // speech bubble with an old slate, a few coins and a small school
  shape(c, () => rrect(c, 130, 90, 820, 400, 60), WHITE, 6);
  shape(c, () => polyP(c, [[420, 480], [520, 480], [480, 560]]), WHITE, 6); c.fillStyle = WHITE; c.fillRect(424, 476, 92, 12);
  shape(c, () => rrect(c, 190, 150, 270, 290, 14), COL.wood, 6); shape(c, () => rrect(c, 215, 175, 220, 240, 6), COL.black, 4);
  line(c, [[245, 240], [390, 240]], 6, WHITE); line(c, [[245, 290], [350, 290]], 6, WHITE); line(c, [[245, 340], [380, 340]], 6, WHITE);
  schoolBuilding(c, 700, 420, 240);
  coin(c, 830, 360, 38); coin(c, 880, 420, 34);
  person(c, 380, 870, 520, { sit: true, adult: true }); hairOver(c, 380, 870, 520, "#e8e4de", true);
  person(c, 700, 870, 440, { sit: true, armR: [Math.PI * 0.4, Math.PI * 0.3] });
  paperSheet(c, 760, 740, 160, 110, 3);
};
const p1 = (c: Ctx) => {
  ground(c);
  // the week strip
  for (let i = 0; i < 7; i++) {
    const x = 70 + i * 140;
    shape(c, () => rrect(c, x, 110, 120, 170, 10), COL.paper, 6); shape(c, () => rrect(c, x, 110, 120, 40, 10), COL.teal, 6);
    if (i < 5) { for (let k = 0; k < 2; k++) line(c, [[x + 24, 190 + k * 26], [x + 96, 190 + k * 26]], 6, COL.grey); tick(c, x + 60, 255, 30); }
    else write(c, String(i + 1), x + 40, 180, 70, COL.greyDk, 8);
  }
  // the envelope with bills sticking out
  for (const [dx, r] of [[-110, -0.12], [0, 0.02], [100, 0.12]]) { c.save(); c.translate(540 + dx, 560); c.rotate(r); c.translate(-540, -560); bill(c, 440, 330, 200, 330, 3, 6); c.restore(); }
  shadow(c, 560, 910, 330, 22);
  shape(c, () => rrect(c, 210, 540, 660, 360, 14), "#e8cf9c", 6);
  shade(c, () => rrect(c, 210, 540, 660, 360, 14), "#c9ac72", 40, 0, 0.5);
  line(c, [[222, 552], [540, 760], [858, 552]], 6);
  coin(c, 540, 760, 42);
  arrow(c, [[540, 300], [540, 420]], RED, 12);
};
const c1 = (c: Ctx) => {
  floor(c, 820, GRASS);
  line(c, [[240, 330], [240, 840]], 28); line(c, [[240, 330], [240, 840]], 14, COL.wood);
  line(c, [[840, 330], [840, 840]], 28); line(c, [[840, 330], [840, 840]], 14, COL.wood);
  shadow(c, 560, 850, 420, 20);
  shape(c, () => rrect(c, 100, 90, 880, 560, 22), "#fffaf0", 8);
  const cell = (i: number) => { const col = i % 3, row = Math.floor(i / 3), x = 140 + col * 285, y = 130 + row * 260; shape(c, () => rrect(c, x, y, 255, 230, 14), "#fff", 4); return [x, y]; };
  let [x, y] = cell(0); shape(c, () => ell(c, x + 128, y + 120, 100, 60), COL.water, 5); line(c, [[x + 70, y + 110], [x + 110, y + 110]], 4, WHITE); line(c, [[x + 140, y + 135], [x + 190, y + 135]], 4, WHITE);
  [x, y] = cell(1); for (let r = 0; r < 3; r++) for (let k = 0; k < 3 - (r === 2 ? 1 : 0); k++) shape(c, () => rrect(c, x + 20 + k * 74, y + 24 + r * 66, 66, 52, 4), "#bfe0a0", 4);
  [x, y] = cell(2); calendar(c, x + 40, y + 30, 175, 175); for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) shape(c, () => ell(c, x + 66 + k * 38, y + 100 + r * 32, 9, 9), k + r < 4 ? COL.teal : COL.grey, 2);
  [x, y] = cell(3); for (let k = 0; k < 3; k++) { shape(c, () => ell(c, x + 55 + k * 72, y + 80, 28, 30), SKIN.adult, 4); shape(c, () => ell(c, x + 55 + k * 72, y + 66, 28, 18), CLOTH.hair, 3); tick(c, x + 55 + k * 72, y + 160, 40); }
  [x, y] = cell(4); shape(c, () => rrect(c, x + 80, y + 20, 95, 190, 14), COL.black, 5); shape(c, () => rrect(c, x + 90, y + 40, 75, 120, 4), COL.lcd ?? "#c9f06b", 3); write(c, "1 8", x + 98, y + 60, 52, INK, 6);
  [x, y] = cell(5); person(c, x + 128, y + 215, 200, { adult: true }); line(c, [[x + 60, y + 210], [x + 195, y + 210]], 4);
};
const c2 = (c: Ctx) => {
  ground(c);
  // worker, phone camera, register row
  person(c, 180, 900, 520, { adult: true, armR: [Math.PI * 0.35, Math.PI * 0.3] });
  spade(c, 290, 520, 280, 1.9);
  shape(c, () => rrect(c, 450, 260, 180, 330, 24), COL.black, 6); shape(c, () => rrect(c, 466, 296, 148, 240, 8), COL.sky, 4);
  shape(c, () => ell(c, 540, 400, 38, 40), SKIN.adult, 3); shape(c, () => ell(c, 540, 470, 56, 40), CLOTH.adult, 3);
  shape(c, () => ell(c, 540, 565, 14, 14), COL.grey, 3);
  for (const a of [-0.5, 0, 0.5]) line(c, [[400 + Math.cos(a) * 20, 400 + Math.sin(a) * 80], [350 + Math.cos(a) * 20, 400 + Math.sin(a) * 120]], 6, COL.yellow);
  arrow(c, [[640, 420], [740, 420]], RED, 10);
  shape(c, () => rrect(c, 760, 200, 280, 460, 12), COL.paper, 6);
  for (let r = 0; r < 3; r++) {
    const y = 230 + r * 140;
    shape(c, () => rrect(c, 780, y, 100, 110, 6), "#fff", 4); shape(c, () => ell(c, 830, y + 42, 26, 28), SKIN.adult, 3); shape(c, () => ell(c, 830, y + 100, 38, 26), CLOTH.adult, 3);
    shape(c, () => ell(c, 925, y + 55, 30, 40), "#d8c8e8", 3); line(c, [[900, y + 50], [950, y + 50]], 3, COL.purple); line(c, [[905, y + 66], [945, y + 66]], 3, COL.purple);
    tick(c, 1000, y + 55, 40);
  }
  shape(c, () => rrect(c, 840, 740, 130, 120, 14), COL.steelDk, 6); c.beginPath(); c.arc(905, 740, 40, Math.PI, 0); c.strokeStyle = INK; c.lineWidth = 16; c.stroke(); shape(c, () => ell(c, 905, 800, 14, 14), INK, 0);
};

// ---- terms
const t0 = (c: Ctx) => {
  floor(c, 800, GRASS);
  govBuilding(c, 540, 770, 800);
  const xs = [150, 300, 450, 640, 790, 930];
  xs.forEach((x, i) => crowdPerson(c, x, 1000, 300, i % 2 === 0));
};
const t1 = (c: Ctx) => {
  ground(c, WALL); shape(c, () => rrect(c, -20, 700, 1120, 400, 0), TABLE, 6);
  shadow(c, 560, 930, 440, 30);
  // an open thick book
  shape(c, () => polyP(c, [[110, 900], [110, 460], [540, 520], [540, 920]]), "#fff7e0", 6);
  shape(c, () => polyP(c, [[970, 900], [970, 460], [540, 520], [540, 920]]), "#fff7e0", 6);
  shape(c, () => polyP(c, [[110, 900], [110, 460], [90, 480], [90, 920]]), COL.blueDk, 5);
  shape(c, () => polyP(c, [[970, 900], [970, 460], [990, 480], [990, 920]]), COL.blueDk, 5);
  for (let i = 0; i < 4; i++) for (const s of [-1, 1]) line(c, [[540 + s * 50, 570 + i * 70 + s * 0], [540 + s * 380, 530 + i * 70 + (s > 0 ? -10 : -10) + 0]], 6, COL.grey);
  line(c, [[540, 520], [540, 920]], 6);
  shape(c, () => polyP(c, [[560, 520], [610, 520], [610, 980], [585, 950], [560, 980]]), RED, 5);
};
const t2 = (c: Ctx) => {
  ground(c, WALL);
  // a stand and a big open book with a decorated border
  shadow(c, 540, 980, 280, 22);
  shape(c, () => polyP(c, [[470, 760], [610, 760], [660, 980], [420, 980]]), COL.soil, 6);
  shape(c, () => rrect(c, 400, 960, 280, 36, 8), COL.soilDk, 5);
  shape(c, () => polyP(c, [[120, 770], [540, 800], [960, 770], [960, 250], [540, 280], [120, 250]]), "#fff7e0", 7);
  line(c, [[540, 280], [540, 800]], 7);
  for (const s of [-1, 1]) {
    const x0 = 540 + s * 40, x1 = 540 + s * 380;
    shape(c, () => polyP(c, [[x0, 320], [x1, 300], [x1, 740], [x0, 760]]), "rgba(0,0,0,0)", 5);
    c.setLineDash([16, 12]); line(c, [[x0, 345], [x1 - s * 25, 328], [x1 - s * 25, 715], [x0, 735], [x0, 345]], 6, COL.orange); c.setLineDash([]);
    for (let i = 0; i < 6; i++) line(c, [[x0 + s * 30, 470 + i * 38 + 0], [x1 - s * 55, 450 + i * 38 + 6]], 6, COL.grey);
  }
  // the wheel at the top of the page
  shape(c, () => ell(c, 330, 390, 58, 58), NAVY, 5); for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[330, 390], [330 + Math.cos(a) * 52, 390 + Math.sin(a) * 52]], 3, WHITE); }
  shape(c, () => ell(c, 330, 390, 14, 14), WHITE, 3);
  line(c, [[420, 390], [490, 390]], 8, COL.orange);
};
const t3 = (c: Ctx) => {
  floor(c, 800, GRASS);
  schoolBuilding(c, 540, 700, 560);
  // open gate leaves and posts
  for (const s of [-1, 1]) { shape(c, () => rrect(c, 540 + s * 250 - 25, 540, 50, 280, 6), COL.steel, 6); }
  for (const s of [-1, 1]) shape(c, () => polyP(c, [[540 + s * 250, 620], [540 + s * 320, 590], [540 + s * 320, 800], [540 + s * 250, 800]]), COL.teal, 5);
  // the girl with her bag, walking in
  shape(c, () => rrect(c, 380, 560, 120, 200, 24), COL.purple, 6);
  person(c, 560, 1010, 560, { armL: [Math.PI * 0.5, Math.PI * 0.5], armR: [Math.PI * 0.35, Math.PI * 0.4] });
  line(c, [[500, 590], [480, 700]], 10, COL.purple);
  arrow(c, [[250, 940], [350, 940]], RED, 10);
};
const t5 = (c: Ctx) => {
  ground(c);
  const row = bill(c, 340, 80, 400, 620, 2, 8);
  const row2 = 80 + 620 * 0.12 + 5 * (620 * 0.8 / 8);
  line(c, [[370, row + 38], [710, row + 38]], 9, COL.blue);
  line(c, [[370, row2 + 38], [710, row2 + 38]], 9, COL.orange);
  govBuilding(c, 190, 1040, 340);
  govBuilding(c, 890, 1040, 240);
  arrow(c, [[350, row + 60], [260, 560], [210, 700]], COL.blue, 10);
  arrow(c, [[730, row2 + 60], [880, 720]], COL.orange, 10);
};
const t7 = (c: Ctx) => {
  floor(c, 800, GRASS);
  schoolBuilding(c, 540, 700, 700);
  person(c, 260, 1030, 560, { adult: true, armR: [Math.PI * 0.3, Math.PI * 0.12] });
  person(c, 520, 1030, 400, { armL: [Math.PI * 0.4, Math.PI * 0.1] });
  const teacher = 820; person(c, teacher, 1000, 520, { adult: true, armL: [Math.PI * 0.6, Math.PI * 0.4], armR: [-0.4, -1.0] });
  hairOver(c, teacher, 1000, 520, CLOTH.hair, false, true);
};
const t8 = (c: Ctx) => {
  ground(c, WALL);
  // a post box with a slot, a letter and a hand
  shadow(c, 540, 1000, 300, 24);
  shape(c, () => rrect(c, 340, 420, 400, 580, 30), RED, 7); shade(c, () => rrect(c, 340, 420, 400, 580, 30), "#a62c20", 70, 0, 0.5);
  shape(c, () => rrect(c, 380, 480, 320, 60, 12), INK, 5);
  shape(c, () => rrect(c, 410, 640, 260, 240, 12), COL.paper, 5);
  for (let i = 0; i < 4; i++) line(c, [[440, 690 + i * 44], [640, 690 + i * 44]], 6, COL.grey);
  envelope(c, 420, 330, 240, 160);
  hand(c, 540, 190, Math.PI * 0.5, 1.8, SKIN.child, CLOTH.child, false);
  arrow(c, [[860, 250], [860, 450]], RED, 12);
};
const t9 = (c: Ctx) => {
  ground(c, WALL);
  person(c, 480, 1030, 640, { adult: true, armL: [Math.PI * 0.4, -0.1], armR: [Math.PI * 0.35, -0.1] });
  hairOver(c, 480, 1030, 640, CLOTH.hair, false, true);
  const [lx, ly] = wrist(480, 1030, 640, -1, [Math.PI * 0.4, -0.1]);
  const [rx, ry] = wrist(480, 1030, 640, 1, [Math.PI * 0.35, -0.1]);
  paperSheet(c, Math.min(lx, rx) - 10, Math.min(ly, ry) - 60, Math.abs(rx - lx) + 20, 110, 3);
  shape(c, () => ell(c, lx, ly, 20, 20), SKIN.adult, 4); shape(c, () => ell(c, rx, ry, 20, 20), SKIN.adult, 4);
  shape(c, () => rrect(c, -20, 760, 1120, 400, 0), TABLE, 6); c.fillStyle = "#d9b87c"; c.fillRect(0, 768, 1080, 22);
  // files
  for (let i = 0; i < 5; i++) shape(c, () => rrect(c, 770 - (i % 2) * 14, 700 - i * 44, 230, 44, 6), [COL.blue, COL.orange, COL.teal, COL.purple, COL.red][i], 5);
  line(c, [[100, 760], [100, 760]], 4);
};
const t10 = (c: Ctx) => {
  floor(c, 700, "#e6cf95");
  sun(c, 880, 160, 90);
  shape(c, () => ell(c, 540, 860, 380, 110), COL.soilDk, 6); shape(c, () => ell(c, 540, 880, 320, 80), COL.water, 5);
  // digging woman with spade, woman carrying basket on her head
  const a = 190; person(c, a + 40, 760, 440, { adult: true, armL: [Math.PI * 0.3, Math.PI * 0.45], armR: [Math.PI * 0.3, Math.PI * 0.4] });
  spade(c, a + 140, 560, 250, 1.2);
  const b = 760; person(c, b, 770, 480, { adult: true, armL: [-0.6, -1.7], armR: [-2.5, -1.4] });
  hairOver(c, b, 770, 480, CLOTH.hair, false, true);
  basket(c, b, 270, 80, true);
  const e = 480; person(c, e, 770, 400, { armR: [0.6, 0.5] });
  basket(c, 580, 790, 40, true);
  for (const x of [150, 330]) { shape(c, () => ell(c, x + 20, 805, 40, 14), COL.soil, 4); }
};
const t11 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 930, 440, 26);
  shape(c, () => rrect(c, 80, 240, 920, 640, 22), COL.orange, 7);
  line(c, [[540, 240], [540, 880]], 7);
  // left page: family photo
  shape(c, () => rrect(c, 140, 300, 340, 520, 12), COL.paper, 5);
  shape(c, () => rrect(c, 180, 350, 260, 300, 8), COL.sky, 4);
  const faces: [number, number, number, string, string][] = [[260, 540, 52, SKIN.adult, CLOTH.adult], [350, 560, 42, SKIN.adult, CLOTH.adult], [305, 600, 34, SKIN.child, CLOTH.child]];
  faces.forEach(([x, y, r, s, cl]) => { shape(c, () => ell(c, x, y + r * 1.6, r * 1.3, r * 0.9), cl, 4); shape(c, () => ell(c, x, y, r * 0.7, r * 0.78), s, 4); shape(c, () => ell(c, x, y - r * 0.4, r * 0.7, r * 0.45), CLOTH.hair, 3); });
  line(c, [[190, 700], [430, 700]], 8, COL.grey); line(c, [[190, 750], [380, 750]], 8, COL.grey);
  // right page: table of dates with ticks
  shape(c, () => rrect(c, 600, 300, 340, 520, 12), COL.paper, 5);
  for (let r = 0; r < 6; r++) for (let k = 0; k < 4; k++) { shape(c, () => rrect(c, 625 + k * 78, 325 + r * 80, 70, 68, 4), "#fff", 3); if ((r + k * 3) % 5 !== 0) tick(c, 660 + k * 78, 359 + r * 80, 34); }
};
const t12 = (c: Ctx) => {
  ground(c);
  registerSheet(c, 140, 100, 800, 880, 9, 6);
};
const t13 = (c: Ctx) => {
  floor(c, 700, "#d9cda2");
  tree(c, 540, 700, 1.3);
  person(c, 540, 860, 560, { adult: true, armL: [Math.PI * 0.4, Math.PI * 0.1], armR: [Math.PI * 0.4, Math.PI * 0.1] });
  hairOver(c, 540, 860, 560, CLOTH.hair, false, true);
  const [lx, ly] = wrist(540, 860, 560, -1, [Math.PI * 0.4, Math.PI * 0.1]);
  paperSheet(c, lx - 10, ly - 90, 150, 110, 3);
  [[150, true], [300, false], [790, false], [930, true]].forEach(([x, ad], i) => crowdPerson(c, x as number, 1040, i % 3 === 0 ? 480 : 420, ad as boolean, true));
  crowdPerson(c, 420, 1060, 380, false, true); crowdPerson(c, 660, 1060, 400, true, true);
};
const t14 = (c: Ctx) => {
  ground(c, WALL);
  shadow(c, 540, 860, 280, 30);
  // glass cube with coins inside
  shape(c, () => polyP(c, [[330, 360], [750, 360], [750, 800], [330, 800]]), "rgba(214,236,250,0.5)", 7);
  shape(c, () => polyP(c, [[330, 360], [400, 300], [820, 300], [750, 360]]), "rgba(255,255,255,0.55)", 6);
  shape(c, () => polyP(c, [[750, 360], [820, 300], [820, 740], [750, 800]]), "rgba(160,200,230,0.5)", 6);
  for (const [x, y] of [[440, 740], [540, 745], [640, 740], [490, 690], [590, 692], [540, 640]]) coin(c, x, y, 46);
  shine(c, [[360, 400], [360, 560]], 10);
  // people looking in from both sides
  person(c, 130, 1000, 520, { armL: [Math.PI * 0.55, Math.PI * 0.5] });
  person(c, 950, 1000, 520, { adult: true });
  for (const [x, y] of [[250, 500], [840, 500]]) { shape(c, () => ell(c, x, y, 26, 18), WHITE, 4); shape(c, () => ell(c, x + (x < 540 ? 8 : -8), y, 9, 9), INK, 0); }
  arrow(c, [[240, 460], [320, 520]], RED, 8); arrow(c, [[840, 460], [760, 520]], RED, 8);
};
const t15 = (c: Ctx) => {
  ground(c, "#dff0fa");
  const gx = 540, gy = 560, gr = 280;
  globe(c, gx, gy, gr);
  const cities: number[][] = [[430, 440], [620, 400], [700, 600], [480, 690], [400, 580]];
  const route = (a: number[], b: number[], lift: number) => { c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - lift, b[0], b[1]); c.strokeStyle = RED; c.lineWidth = 6; c.setLineDash([14, 12]); c.stroke(); c.setLineDash([]); };
  route(cities[0], cities[1], 90); route(cities[1], cities[2], 70); route(cities[2], cities[3], 90); route(cities[3], cities[4], 60); route(cities[4], cities[0], 50); route(cities[0], cities[2], 160);
  cities.forEach(([x, y]) => shape(c, () => ell(c, x, y, 14, 14), RED, 5));
  // aeroplane
  c.save(); c.translate(860, 190); c.rotate(-0.25);
  shape(c, () => ell(c, 0, 0, 100, 24), WHITE, 6);
  shape(c, () => polyP(c, [[-10, 0], [-60, -90], [-30, -90], [40, 0]]), COL.steel, 5); shape(c, () => polyP(c, [[-10, 0], [-60, 90], [-30, 90], [40, 0]]), COL.steel, 5);
  shape(c, () => polyP(c, [[-80, 0], [-110, -48], [-84, -48], [-56, 0]]), COL.steel, 5);
  c.restore();
  // ship
  shape(c, () => rrect(c, 40, 990, 1000, 80, 0), COL.water, 0); line(c, [[0, 990], [1080, 990]], 5);
  shape(c, () => polyP(c, [[90, 930], [350, 930], [310, 1000], [130, 1000]]), COL.red, 6);
  shape(c, () => rrect(c, 160, 880, 80, 60, 4), COL.paper, 5); for (let i = 0; i < 3; i++) shape(c, () => rrect(c, 130 + i * 62, 860 + 0, 56, 50, 3), [COL.teal, COL.orange, COL.blue][i], 4);
};
const t16 = (c: Ctx) => {
  ground(c, "#dff0fa");
  c.fillStyle = COL.water; c.fillRect(0, 800, 1080, 280); line(c, [[0, 800], [1080, 800]], 5);
  // quay on the left, with sacks
  shape(c, () => rrect(c, -20, 740, 360, 340, 6), COL.steel, 6);
  [[80, 740], [190, 740], [135, 650]].forEach(([x, y]) => sack(c, x, y, 0.85));
  // ship with sacks on deck
  shape(c, () => polyP(c, [[380, 740], [1040, 740], [960, 900], [450, 900]]), COL.red, 7); shade(c, () => polyP(c, [[380, 740], [1040, 740], [960, 900], [450, 900]]), "#a62c20", 40, 0, 0.5);
  shape(c, () => rrect(c, 790, 570, 180, 170, 6), COL.paper, 6); shape(c, () => rrect(c, 820, 610, 50, 40, 3), COL.sky, 3); shape(c, () => rrect(c, 890, 610, 50, 40, 3), COL.sky, 3);
  [[470, 740], [570, 740], [670, 740], [520, 650], [620, 650]].forEach(([x, y]) => sack(c, x, y, 0.8));
  arrow(c, [[210, 560], [330, 520], [470, 530]], RED, 12);
  c.fillStyle = "rgba(255,255,255,0.5)"; for (let i = 0; i < 5; i++) line(c, [[60 + i * 220, 950], [150 + i * 220, 950]], 6, WHITE);
};
// ---- explanations
const x0 = (c: Ctx) => {
  floor(c, 800, GRASS);
  const folk: [number, number, boolean, number, boolean][] = [[170, 330, false, 0, false], [420, 560, true, 0, false], [680, 520, true, 1, true], [920, 400, false, 0, false]];
  const arms: [number, number][] = [[Math.PI * 0.35, -Math.PI * 0.45], [Math.PI * 0.35, -Math.PI * 0.45]];
  folk.forEach(([x, h, ad, , elder]) => {
    const y = 960; person(c, x, y, h, { adult: ad, armR: arms[0], armL: arms[1] });
    if (elder) hairOver(c, x, y, h, "#e8e4de");
    const [wx, wy] = wrist(x, y, h, 1, arms[0]);
    ribbonBook(c, wx - 40, wy - 80, 80, 100);
  });
};
const x4 = (c: Ctx) => {
  ground(c, WALL);
  calendar(c, 640, 90, 340, 340);
  for (let r = 0; r < 2; r++) for (let k = 0; k < 6; k++) shape(c, () => ell(c, 690 + k * 52, 195 + r * 0 + (r ? 195 : 0), 11, 11), COL.grey, 0);
  write(c, "30", 740, 310, 80, INK, 10);
  c.beginPath(); c.ellipse(808, 345, 100, 78, 0, 0, Math.PI * 2); c.strokeStyle = RED; c.lineWidth = 10; c.stroke();
  // counter and window
  shape(c, () => rrect(c, 520, 560, 600, 520, 0), COL.wood, 6);
  shape(c, () => rrect(c, 520, 520, 600, 52, 6), COL.woodDk, 6);
  shape(c, () => rrect(c, 600, 440, 140, 80, 6), RED, 5);
  person(c, 200, 1040, 640, { adult: true, armR: [Math.PI * 0.2, -Math.PI * 0.05] });
  hairOver(c, 200, 1040, 640, CLOTH.hair, false, true);
  envelope(c, 440, 560, 170, 110);
};
const x5 = (c: Ctx) => {
  floor(c, 640, "#e6cf95");
  sun(c, 920, 140, 80);
  // half-dug pond with a heap of earth, shaded shelter and a water pot
  shape(c, () => ell(c, 400, 800, 360, 100), COL.soilDk, 6); shape(c, () => ell(c, 400, 815, 290, 62), "#7a5033", 5);
  shape(c, () => polyP(c, [[780, 640], [1000, 640], [960, 560], [820, 560]]), "#d8bd7a", 0);
  shape(c, () => polyP(c, [[740, 400], [1040, 400], [980, 300], [800, 300]]), COL.wood, 6);
  line(c, [[780, 400], [780, 700]], 14); line(c, [[1000, 400], [1000, 700]], 14);
  matka(c, 890, 700, 0.8);
  // two carriers, one walking away from the pit with earth
  const p = 560; person(c, p, 660, 480, { adult: true, armL: [-0.6, -1.7], armR: [-2.5, -1.4] });
  hairOver(c, p, 660, 480, CLOTH.hair, false, true); basket(c, p, 160, 80, true);
  const q = 280; person(c, q, 760, 420, { armL: [-0.6, -1.7], armR: [-2.5, -1.4] });
  basket(c, q, 760 - 420 * 0.74 - 55 * 0 - 130, 70, true);
  arrow(c, [[380, 960], [560, 960], [700, 940]], RED, 10);
};

export const ic_indiaGovernmentAndRightsL3 = cards("sci.india.government-and-rights.L3 cards", [
  intro, summary, e1, e2, a1, a2, a3, a4, a5, p1, c1, c2, t0, t1, t2, t3, t5, t7, t8, t9, t10, t11, t12, t13, t14, t15, t16, x0, x4, x5,
]);
