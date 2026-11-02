import type { Ctx } from "./core";
import { INK, BG, SH, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, rrect, polyP, shadow, shade, line, shine, arrow, glass, leaf, person, hand, write, cards } from "./flatKit";

// apple browning scale: cream to brown, the same on every card
const FL = ["#f6ecc4", "#e9cf94", "#cfa465", "#a56d3a"];
const FL6 = ["#f6ecc4", "#f0dba9", "#e9cf94", "#dcb97c", "#cfa465", "#a56d3a"];
const PAPER = COL.paper;

const slice = (c: Ctx, x: number, y: number, r: number, flesh: string, k = 0.92) => {
  shadow(c, x + r * 0.12, y + r * k * 0.95, r * 0.95, r * 0.18);
  shape(c, () => ell(c, x, y, r, r * k), COL.red, Math.max(3, r * 0.07));
  shape(c, () => ell(c, x, y, r * 0.82, r * k * 0.8), flesh, Math.max(2.5, r * 0.05));
  shape(c, () => ell(c, x, y, r * 0.24, r * k * 0.22), "rgba(120,80,40,0.3)", 0);
  shape(c, () => ell(c, x - r * 0.08, y, r * 0.045, r * k * 0.09, 0.5), "#5b3a22", 0);
  shape(c, () => ell(c, x + r * 0.08, y, r * 0.045, r * k * 0.09, -0.5), "#5b3a22", 0);
};
const appleSide = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.95, r * 0.9, r * 0.16);
  const body = () => { c.moveTo(x, y - r * 0.8); c.bezierCurveTo(x + r * 0.5, y - r * 1.1, x + r * 1.15, y - r * 0.5, x + r * 0.95, y + r * 0.25); c.bezierCurveTo(x + r * 0.75, y + r * 0.95, x + r * 0.3, y + r * 1.0, x, y + r * 0.85); c.bezierCurveTo(x - r * 0.3, y + r * 1.0, x - r * 0.75, y + r * 0.95, x - r * 0.95, y + r * 0.25); c.bezierCurveTo(x - r * 1.15, y - r * 0.5, x - r * 0.5, y - r * 1.1, x, y - r * 0.8); c.closePath(); };
  shape(c, body, COL.red, 6); shade(c, body, "#b8372a", r * 0.3, r * 0.1, 0.45);
  shine(c, [[x - r * 0.7, y - r * 0.35], [x - r * 0.55, y - r * 0.1]], 8);
  line(c, [[x, y - r * 0.78], [x + r * 0.08, y - r * 1.2]], 8);
  leaf(c, x + r * 0.08, y - r * 1.05, r * 0.6, -0.5);
};
const clock = (c: Ctx, x: number, y: number, r: number, m: number, h: number, faint = false) => {
  shadow(c, x + r * 0.1, y + r * 0.95, r * 0.9, r * 0.14);
  shape(c, () => ell(c, x, y, r, r), WHITE, Math.max(4, r * 0.06));
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.sin(a) * r * 0.8, y - Math.cos(a) * r * 0.8], [x + Math.sin(a) * r * 0.92, y - Math.cos(a) * r * 0.92]], Math.max(2.5, r * 0.04)); }
  const hand = (deg: number, len: number, w: number, col: string = INK) => { const a = (deg * Math.PI) / 180; line(c, [[x, y], [x + Math.sin(a) * r * len, y - Math.cos(a) * r * len]], w, col); };
  hand(h, 0.5, Math.max(5, r * 0.08)); hand(m, 0.75, Math.max(4, r * 0.055));
  void faint;
  shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), INK, 0);
};
const qmark = (c: Ctx, x: number, y: number, s: number, col: string = INK) => {
  const w = s * 0.2;
  c.beginPath(); c.arc(x, y - s * 0.4, s * 0.32, Math.PI * 1.05, Math.PI * 2.4); c.lineTo(x, y + s * 0.2); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke();
  shape(c, () => ell(c, x, y + s * 0.5, w * 0.6, w * 0.6), col, 0);
};
const tick = (c: Ctx, x: number, y: number, s: number) => {
  const p = [[x - s * 0.5, y], [x - s * 0.15, y + s * 0.4], [x + s * 0.55, y - s * 0.5]];
  line(c, p, s * 0.22 + 8, INK); line(c, p, s * 0.22, COL.greenLt);
};
const page = (c: Ctx, x: number, y: number, w: number, h: number, rules = 0) => {
  shape(c, () => rrect(c, x + 14, y + 16, w, h, 14), SH, 0);
  shape(c, () => rrect(c, x, y, w, h, 14), PAPER, 6);
  line(c, [[x + 56, y + 12], [x + 56, y + h - 12]], 3, COL.pink);
  for (let i = 1; i <= rules; i++) line(c, [[x + 30, y + (h * i) / (rules + 1)], [x + w - 30, y + (h * i) / (rules + 1)]], 3, "#cfd8e6");
};
const cloudB = (c: Ctx, x: number, y: number, w: number, h: number, fill: string = WHITE) => {
  const P = [[-0.25, 0.05, 0.28, 0.38], [0, -0.12, 0.28, 0.4], [0.27, 0.04, 0.26, 0.38], [0, 0.14, 0.44, 0.3]];
  P.forEach(([a, b, rx, ry]) => shape(c, () => ell(c, x + a * w, y + b * h, rx * w, ry * h), fill, 6));
  P.forEach(([a, b, rx, ry]) => shape(c, () => ell(c, x + a * w, y + b * h, rx * w - 2, ry * h - 2), fill, 0));
};
const bubble = (c: Ctx, x: number, y: number, w: number, h: number, tx: number, ty: number) => {
  shape(c, () => rrect(c, x, y, w, h, 40), WHITE, 6);
  const mx = x + w / 2;
  shape(c, () => polyP(c, [[mx - 30, y + h - 3], [mx + 30, y + h - 3], [tx, ty]]), WHITE, 6);
  shape(c, () => rrect(c, x + 6, y + h - 12, w - 12, 20, 6), WHITE, 0);
  shape(c, () => polyP(c, [[mx - 26, y + h - 8], [mx + 26, y + h - 8], [mx + 22, y + h + 6], [mx - 22, y + h + 6]]), WHITE, 0);
};
const banana = (c: Ctx, x: number, y: number, s: number, rot: number, col: string, spots: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const body = () => { c.moveTo(-100, -30); c.bezierCurveTo(-60, 95, 60, 100, 110, -45); c.bezierCurveTo(50, 10, -50, 5, -100, -30); c.closePath(); };
  shape(c, body, col, 6 / s); shade(c, body, "#8a6a2a", 8, 8, 0.25);
  shape(c, () => polyP(c, [[104, -42], [120, -66], [134, -60], [116, -36]]), "#8a6a3a", 5 / s);
  shape(c, () => ell(c, -100, -30, 8, 8), "#5b4126", 0);
  const sp = [[-40, 38], [10, 52], [55, 38], [-5, 28], [30, 24], [-70, 12], [70, 8], [-20, 56]];
  for (let i = 0; i < spots; i++) shape(c, () => ell(c, sp[i][0], sp[i][1], 7, 6), "#6b4423", 0);
  c.restore();
};
const magnifier = (c: Ctx, x: number, y: number, r: number, an: number) => {
  const hx = x + Math.cos(an) * r * 2.2, hy = y + Math.sin(an) * r * 2.2;
  line(c, [[x + Math.cos(an) * r, y + Math.sin(an) * r], [hx, hy]], r * 0.28 + 8, INK); line(c, [[x + Math.cos(an) * r, y + Math.sin(an) * r], [hx, hy]], r * 0.28, COL.brown);
  shape(c, () => ell(c, x, y, r, r), COL.glass, r * 0.14);
  line(c, [[x - r * 0.6, y - r * 0.25], [x - r * 0.25, y - r * 0.6]], 8, WHITE);
};
const pencil = (c: Ctx, x1: number, y1: number, x2: number, y2: number, t = 30) => {
  const an = Math.atan2(y2 - y1, x2 - x1), dx = Math.cos(an), dy = Math.sin(an), px = -dy, py = dx, bx = x2 - dx * t * 1.5, by = y2 - dy * t * 1.5;
  line(c, [[x1, y1], [bx, by]], t + 12, INK); line(c, [[x1, y1], [bx, by]], t, COL.yellow);
  shape(c, () => polyP(c, [[bx + px * t / 2 - px * 0, by + py * t / 2], [x2, y2], [bx - px * t / 2, by - py * t / 2]]), COL.wood, 5);
  shape(c, () => polyP(c, [[x2 - dx * t * 0.4 + px * t * 0.15, y2 - dy * t * 0.4 + py * t * 0.15], [x2, y2], [x2 - dx * t * 0.4 - px * t * 0.15, y2 - dy * t * 0.4 - py * t * 0.15]]), INK, 3);
};
const eye = (c: Ctx, x: number, y: number, s: number, open = true) => {
  if (open) {
    shape(c, () => ell(c, x, y, s, s * 0.58), WHITE, 5);
    shape(c, () => ell(c, x, y, s * 0.42, s * 0.42), COL.teal, 4); shape(c, () => ell(c, x, y, s * 0.2, s * 0.2), INK, 0);
  } else { c.beginPath(); c.arc(x, y - s * 0.4, s, Math.PI * 0.2, Math.PI * 0.8); c.strokeStyle = INK; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
};
const lemonHalf = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shape(c, () => ell(c, x, y, rx, ry), COL.yellow, 6);
  shade(c, () => ell(c, x, y, rx, ry), COL.orange, rx * 0.25, ry * 0.2, 0.35);
  shape(c, () => ell(c, x, y + ry * 0.86, rx * 0.78, ry * 0.26), "#fff3b0", 5);
};
const drop = (c: Ctx, x: number, y: number, s: number) => shape(c, () => { c.moveTo(x, y - s); c.quadraticCurveTo(x - s * 0.9, y + s * 0.2, x, y + s * 0.8); c.quadraticCurveTo(x + s * 0.9, y + s * 0.2, x, y - s); c.closePath(); }, COL.water, 5);
const desk = (c: Ctx, top: number) => {
  shape(c, () => rrect(c, -20, top, D2 + 40, 1100 - top, 0), COL.wood, 6);
  shade(c, () => rrect(c, -20, top, D2 + 40, 1100 - top, 0), COL.woodDk, 0, 40, 0.5);
  shape(c, () => rrect(c, -20, top, D2 + 40, 26, 0), "#f7d58a", 6);
};
const D2 = 1080;
const platE = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shadow(c, x + rx * 0.08, y + ry * 0.3, rx, ry);
  shape(c, () => ell(c, x, y, rx, ry), COL.steel); shape(c, () => ell(c, x, y - ry * 0.04, rx * 0.84, ry * 0.8), COL.steelIn, 4);
};
const treeT = (c: Ctx, x: number, y: number, s: number, st: "bare" | "leaves" | "flower" | "fruit") => {
  shape(c, () => polyP(c, [[x - 18 * s, y], [x + 18 * s, y], [x + 10 * s, y - 130 * s], [x - 10 * s, y - 130 * s]]), COL.brown, 5);
  if (st === "bare") { line(c, [[x, y - 110 * s], [x - 70 * s, y - 190 * s]], 8 * s, INK); line(c, [[x, y - 110 * s], [x + 70 * s, y - 190 * s]], 8 * s, INK); line(c, [[x, y - 120 * s], [x, y - 210 * s]], 8 * s, INK); return; }
  const bl = [[-60, -150, 55], [60, -150, 55], [0, -200, 65], [-30, -125, 50], [35, -125, 50]];
  bl.forEach(([a, b, r]) => shape(c, () => ell(c, x + a * s, y + b * s, r * s, r * s), COL.leaf, 5));
  bl.forEach(([a, b, r]) => shape(c, () => ell(c, x + a * s, y + b * s, r * s - 2, r * s - 2), COL.leaf, 0));
  const dots = [[-70, -160], [-20, -215], [50, -190], [75, -135], [-35, -125], [20, -150], [-85, -125]];
  if (st !== "leaves") dots.forEach(([a, b]) => shape(c, () => ell(c, x + a * s, y + b * s, 11 * s, 11 * s), st === "flower" ? COL.pink : COL.red, 3));
};
const winFrame = (c: Ctx, x: number, y: number, w: number, h: number, inside: () => void) => {
  shape(c, () => rrect(c, x - 20, y - 20, w + 40, h + 40, 10), WHITE, 6);
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 4); c.clip();
  c.fillStyle = COL.sky; c.fillRect(x, y, w, h); inside(); c.restore();
  shape(c, () => rrect(c, x, y, w, h, 4), "rgba(0,0,0,0)", 5);
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 10; i++) { const a = (i * Math.PI) / 5; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.7, y + Math.sin(a) * r * 1.7]], 7, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 5);
};
const grid = (c: Ctx, x: number, y: number, w: number, h: number, n: number, filled: number) => {
  shape(c, () => rrect(c, x, y, w, h, 10), WHITE, 5);
  const cw = (w - 20) / n;
  for (let i = 0; i < n; i++) shape(c, () => rrect(c, x + 10 + i * cw + 3, y + h * 0.35, cw - 6, h * 0.5, 4), i < filled ? COL.orange : "#e8e2d4", 3);
};
const armEnd = (x: number, y: number, h: number, side: number, [a1, a2]: [number, number]) => {
  const sx = x + side * h * 0.11, sy = y - h * 0.74 + h * 0.03, ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};
const flip = (c: Ctx, f: () => void) => { c.save(); c.translate(D2, 0); c.scale(-1, 1); f(); c.restore(); };
const leafBig = (c: Ctx, x: number, y: number, len: number, veins: boolean, col: string = COL.leaf) => {
  const w = len * 0.32;
  const sh = () => { c.moveTo(x, y); c.bezierCurveTo(x - w * 1.5, y - len * 0.3, x - w * 0.9, y - len * 0.85, x, y - len); c.bezierCurveTo(x + w * 0.9, y - len * 0.85, x + w * 1.5, y - len * 0.3, x, y); c.closePath(); };
  shape(c, sh, col, 6); shade(c, sh, COL.leafDk, len * 0.1, 0, 0.4);
  line(c, [[x, y + len * 0.15], [x, y - len * 0.92]], 5, INK);
  if (veins) for (let i = 1; i <= 4; i++) { const vy = y - len * 0.15 * i - len * 0.05; line(c, [[x, vy], [x - w * (1.1 - i * 0.2), vy - len * 0.12]], 3, COL.leafDk); line(c, [[x, vy], [x + w * (1.1 - i * 0.2), vy - len * 0.12]], 3, COL.leafDk); }
};

// intro
const intro = (c: Ctx) => {
  ground(c);
  person(c, 250, 900, 620);
  desk(c, 700);
  platE(c, 250, 760, 180, 46); slice(c, 250, 748, 88, FL[0], 0.7);
  platE(c, 800, 790, 200, 50); slice(c, 800, 778, 100, FL[3], 0.7);
  clock(c, 800, 400, 150, 180, 30);
  arrow(c, [[470, 640], [580, 560]]);
};

// summary
const summary = (c: Ctx) => {
  ground(c);
  platE(c, 300, 640, 290, 110);
  slice(c, 160, 640, 75, FL[0], 0.8); slice(c, 300, 668, 75, FL[0], 0.8); slice(c, 440, 640, 75, FL[0], 0.8);
  lemonHalf(c, 300, 440, 70, 52); drop(c, 440, 440, 46);
  arrow(c, [[300, 505], [300, 570]], RED, 8); arrow(c, [[440, 495], [440, 560]], RED, 8);
  page(c, 640, 150, 390, 760, 0);
  const rows = [[FL[0], FL[1], FL[3]], [FL[0], FL[0], FL[1]], [FL[0], FL[0], FL[0]]];
  rows.forEach((row, i) => row.forEach((f, j) => slice(c, 740 + j * 120, 290 + i * 180, 46, f, 0.9)));
  ["0", "10", "20"].forEach((t, j) => write(c, t, 722 + j * 120 - (t.length - 1) * 14, 810, 46, INK, 6));
  line(c, [[690, 760], [1000, 760]], 4, COL.pink);
};

// a1: from wondering to a question
const a1 = (c: Ctx) => {
  ground(c);
  page(c, 70, 90, 940, 900, 0);
  for (let i = 0; i < 5; i++) { cloudB(c, 190 + i * 175, 250 + (i % 2) * 40, 150, 110, i === 1 || i === 3 ? "#fff1b8" : "#eef0f6"); qmark(c, 190 + i * 175, 250 + (i % 2) * 40, 54, i === 1 || i === 3 ? INK : COL.greyDk); }
  arrow(c, [[365, 440], [300, 590]]); arrow(c, [[715, 440], [780, 590]]);
  shape(c, () => rrect(c, 130, 600, 340, 320, 24), WHITE, 6);
  slice(c, 230, 740, 70, FL[2], 0.9); clock(c, 390, 700, 56, 120, 0); tick(c, 300, 860, 70);
  shape(c, () => rrect(c, 610, 600, 340, 320, 24), WHITE, 6);
  banana(c, 760, 730, 0.8, -0.3, "#ffd34d", 4); eye(c, 880, 680, 40); tick(c, 780, 860, 70);
};

// a2: draw it twice
const a2 = (c: Ctx) => {
  ground(c);
  page(c, 40, 190, 320, 600, 0);
  leafBig(c, 210, 680, 340, false, "#9ccf62");
  page(c, 720, 190, 320, 600, 0);
  leafBig(c, 890, 680, 340, true, COL.leaf);
  leafBig(c, 540, 880, 480, true, COL.leaf);
  magnifier(c, 560, 450, 100, 0.9);
  cloudB(c, 200, 100, 170, 110); qmark(c, 200, 100, 56);
  eye(c, 880, 100, 70);
};

// a3: window watch
const a3 = (c: Ctx) => {
  ground(c);
  winFrame(c, 80, 110, 480, 430, () => {
    sun(c, 460, 200, 36);
    c.fillStyle = COL.greenLt; c.fillRect(80, 470, 480, 100);
    treeT(c, 170, 520, 1.0, "leaves");
    shape(c, () => ell(c, 400, 330, 34, 22), COL.black, 5); shape(c, () => polyP(c, [[366, 330], [340, 318], [366, 344]]), COL.black, 4);
    line(c, [[380, 345], [380, 380]], 5); line(c, [[408, 345], [408, 380]], 5);
    line(c, [[330, 380], [490, 380]], 10, COL.brown);
  });
  page(c, 640, 110, 380, 480, 4);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) line(c, [[720 + k * 40, 175 + r * 100], [720 + k * 40, 225 + r * 100]], 6);
  for (let r = 0; r < 4; r++) line(c, [[705, 235 + r * 100], [875, 190 + r * 100]], 6, COL.red);
  [0, 1, 2].forEach((i) => { clock(c, 250 + i * 290, 780, 90, 0, [210, 270, 330][i]); });
  arrow(c, [[350, 780], [440, 780]], RED, 9); arrow(c, [[640, 780], [730, 780]], RED, 9);
  void ell;
};

// a4: pencil jump
const a4 = (c: Ctx) => {
  ground(c);
  const panel = (x: number, px: number, openLeft: boolean) => {
    eye(c, x + 130, 120, 54, openLeft); eye(c, x + 330, 120, 54, !openLeft);
    shape(c, () => rrect(c, x, 220, 460, 600, 18), COL.sky, 6);
    c.save(); c.beginPath(); rrect(c, x, 220, 460, 600, 18); c.clip();
    shape(c, () => rrect(c, x + 150, 360, 170, 460, 4), COL.pink, 6);
    shape(c, () => rrect(c, x + 200, 640, 70, 180, 4), COL.brown, 5);
    [0, 1].forEach((i) => [0, 1].forEach((j) => shape(c, () => rrect(c, x + 175 + i * 80, 400 + j * 100, 50, 60, 3), WHITE, 4)));
    c.restore();
    pencil(c, x + px, 250, x + px, 790, 36);
  };
  panel(40, 100, true); panel(580, 360, false);
  arrow(c, [[190, 900], [720, 900]], RED, 12);
};

// a5: same spot, same time
const a5 = (c: Ctx) => {
  ground(c);
  const photo = (x: number, st: "leaves" | "flower" | "fruit") => {
    shape(c, () => rrect(c, x - 10, 130, 320, 330, 16), WHITE, 6);
    c.save(); c.beginPath(); rrect(c, x, 140, 300, 250, 6); c.clip(); c.fillStyle = COL.sky; c.fillRect(x, 140, 300, 250);
    c.fillStyle = COL.greenLt; c.fillRect(x, 330, 300, 60); c.restore();
    sun(c, x + 240, 200, 24); treeT(c, x + 120, 360, 0.7, st);
    shape(c, () => rrect(c, x, 140, 300, 250, 6), "rgba(0,0,0,0)", 4);
  };
  photo(55, "leaves"); photo(385, "flower"); photo(715, "fruit");
  ["1", "2", "3"].forEach((t, i) => write(c, t, 195 + i * 330, 395, 50, INK, 7));
  line(c, [[0, 700], [D2, 700]], 6);
  c.fillStyle = "#e9d9b8"; c.fillRect(0, 703, D2, 400);
  line(c, [[480, 960], [600, 1050]], 22, COL.red); line(c, [[600, 960], [480, 1050]], 22, COL.red);
  person(c, 540, 1020, 400, { armR: [Math.PI * 0.3, -Math.PI * 0.4] });
  const [px, py] = armEnd(540, 1020, 400, 1, [Math.PI * 0.3, -Math.PI * 0.4]);
  shape(c, () => rrect(c, px - 5, py - 90, 70, 110, 12), COL.black, 5); shape(c, () => rrect(c, px + 3, py - 78, 54, 76, 5), COL.sky, 3);
};

// p2: a tree from my window
const p2 = (c: Ctx) => {
  ground(c);
  winFrame(c, 280, 70, 520, 400, () => {
    c.fillStyle = COL.greenLt; c.fillRect(280, 400, 520, 70);
    treeT(c, 540, 440, 1.05, "leaves");
  });
  const sts: ("bare" | "leaves" | "flower" | "fruit")[] = ["bare", "leaves", "flower", "fruit"];
  sts.forEach((s, i) => {
    page(c, 40 + i * 255, 580, 225, 330, 0);
    treeT(c, 160 + i * 255, 780, 0.6, s);
    write(c, String(i + 1), 135 + i * 255, 840, 50, INK, 7);
  });
  arrow(c, [[120, 980], [940, 980]], RED, 10);
};

// c1: catch the sunny patch
const c1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#f5e9cf"; c.fillRect(0, 0, D2, 420);
  c.fillStyle = "#e6c88e"; c.fillRect(0, 420, D2, 700);
  line(c, [[0, 420], [D2, 420]], 6);
  shape(c, () => rrect(c, 380, 60, 320, 280, 8), COL.sky, 7);
  line(c, [[540, 60], [540, 340]], 6); line(c, [[380, 200], [700, 200]], 6);
  sun(c, 600, 120, 26);
  const patch = (cx: number, cy: number, lbl: string) => {
    shape(c, () => polyP(c, [[cx - 110, cy - 55], [cx + 130, cy - 55], [cx + 90, cy + 55], [cx - 150, cy + 55]]), "#fff3b0", 6);
    write(c, lbl, cx - 36, cy - 26, 52, INK, 7);
  };
  c.globalAlpha = 0.35; shape(c, () => polyP(c, [[400, 330], [680, 330], [460, 560], [160, 560]]), "#fff3b0", 0); c.globalAlpha = 1;
  patch(260, 640, "10"); patch(560, 770, "11"); patch(850, 900, "12");
  arrow(c, [[380, 660], [440, 740]], RED, 10); arrow(c, [[680, 790], [730, 870]], RED, 10);
};

// c2: the plan swap
const c2 = (c: Ctx) => {
  ground(c);
  person(c, 190, 960, 560);
  person(c, 890, 960, 640, { adult: true });
  page(c, 380, 250, 320, 460, 0);
  slice(c, 540, 330, 56, FL[2], 0.9);
  [0, 1, 2].forEach((i) => line(c, [[430, 460 + i * 80], [660, 460 + i * 80]], 8, "#9aa5b8"));
  arrow(c, [[300, 780], [380, 740]], RED, 10); arrow(c, [[700, 740], [780, 780]], RED, 10);
  slice(c, 540, 900, 70, FL[2], 0.8);
  tick(c, 700, 900, 70);
};

// term 0
const t0 = (c: Ctx) => {
  ground(c);
  person(c, 540, 1010, 480);
  bubble(c, 60, 70, 440, 380, 400, 580);
  cloudB(c, 280, 255, 270, 200, "#eef0f6"); qmark(c, 280, 255, 100, COL.greyDk);
  bubble(c, 580, 70, 440, 380, 680, 580);
  slice(c, 720, 260, 80, FL[2], 0.9); clock(c, 880, 220, 60, 120, 0); tick(c, 880, 360, 60);
};
// term 1
const t1 = (c: Ctx) => {
  ground(c);
  person(c, 540, 960, 600, { armR: [Math.PI * 0.3, -Math.PI * 0.25], armL: [Math.PI * 0.55, Math.PI * 0.5] });
  const [hx, hy] = armEnd(540, 960, 600, 1, [Math.PI * 0.3, -Math.PI * 0.25]);
  desk(c, 780);
  platE(c, 620, 830, 220, 54); slice(c, 620, 810, 100, FL[1], 0.7);
  magnifier(c, hx + 90, hy + 60, 90, -2.4 + Math.PI);
  [[130, 150, 0], [130, 380, 1], [130, 610, 2]].forEach(([x, y, k]) => {
    shape(c, () => ell(c, x, y, 85, 85), WHITE, 6);
    if (k === 0) eye(c, x, y, 50);
    if (k === 1) { c.beginPath(); c.arc(x, y, 38, Math.PI * 0.6, Math.PI * 1.9); c.strokeStyle = INK; c.lineWidth = 10; c.lineCap = "round"; c.stroke(); c.beginPath(); c.arc(x + 4, y + 4, 16, Math.PI * 0.8, Math.PI * 1.7); c.stroke(); }
    if (k === 2) { [-26, 0, 26].forEach((d) => { c.beginPath(); c.moveTo(x + d, y + 40); c.bezierCurveTo(x + d - 22, y + 18, x + d + 22, y - 2, x + d, y - 24); c.bezierCurveTo(x + d - 8, y - 34, x + d, y - 40, x + d, y - 44); c.strokeStyle = INK; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }); }
  });
};
// term 2
const t2 = (c: Ctx) => {
  ground(c);
  page(c, 130, 90, 820, 880, 0);
  [0, 1, 2, 3].forEach((i) => {
    const y = 220 + i * 190;
    line(c, [[200, y - 95], [900, y - 95]], 4);
    clock(c, 270, y, 60, i * 60, 0); write(c, String(i), 400, y - 30, 56, INK, 8);
    shape(c, () => rrect(c, 500, y - 55, 80, 110, 8), FL[i], 5);
    slice(c, 740, y, 70, FL[i], 0.9);
  });
  pencil(c, 980, 100, 880, 190, 22);
};
// term 3
const t3 = (c: Ctx) => {
  ground(c);
  person(c, 330, 980, 580);
  desk(c, 700);
  page(c, 160, 650, 260, 120, 0);
  line(c, [[200, 695], [370, 695]], 7, "#9aa5b8"); line(c, [[200, 735], [330, 735]], 7, "#9aa5b8");
  appleSide(c, 760, 585, 120);
  shape(c, () => polyP(c, [[580, 780], [720, 770], [740, 850], [600, 860]]), PAPER, 6);
  line(c, [[580, 780], [660, 815], [720, 770]], 4);
  cloudB(c, 640, 330, 240, 150); qmark(c, 640, 330, 80);
};
// term 4
const t4 = (c: Ctx) => {
  ground(c);
  page(c, 190, 60, 700, 960, 0);
  const rows = 5;
  for (let i = 0; i < rows; i++) {
    const y = 190 + i * 175;
    shape(c, () => rrect(c, 250, y - 50, 600, 100, 18), "#f2eee0", 4);
    line(c, [[420, y], [790, y]], 8, "#9aa5b8");
    if (i === 0) qmark(c, 335, y - 4, 60);
    if (i === 1) appleSide(c, 335, y, 36);
    if (i === 2) clock(c, 335, y, 38, 60, 0);
    if (i === 3) pencil(c, 290, y + 28, 372, y - 24, 16);
    if (i === 4) { shape(c, () => rrect(c, 300, y - 32, 72, 64, 5), WHITE, 4); line(c, [[300, y], [372, y]], 3); line(c, [[336, y - 32], [336, y + 32]], 3); }
  }
};
// term 5
const t5 = (c: Ctx) => {
  ground(c);
  platE(c, 540, 560, 470, 200);
  slice(c, 320, 550, 150, FL[0], 0.8); slice(c, 760, 550, 150, FL[3], 0.8);
  hand(c, 540, 1010, -Math.PI / 2, 2.6, SKIN.child, CLOTH.child, true);
};
// term 6
const t6 = (c: Ctx) => {
  ground(c);
  // same: apple, knife, room
  appleSide(c, 170, 190, 80);
  shape(c, () => polyP(c, [[400, 250], [560, 160], [585, 190], [440, 270]]), COL.steel, 5); line(c, [[560, 160], [640, 120]], 24, INK); line(c, [[560, 160], [640, 120]], 14, COL.wood);
  winFrame(c, 800, 110, 150, 150, () => sun(c, 910, 160, 20));
  line(c, [[170, 300], [170, 380], [540, 380], [540, 450]], 7); line(c, [[490, 270], [490, 380]], 7); line(c, [[875, 290], [875, 380], [540, 380]], 7);
  arrow(c, [[540, 380], [540, 470]], RED, 9);
  [210, 540, 870].forEach((x) => slice(c, x, 640, 105, FL[0], 0.85));
  lemonHalf(c, 540, 880, 70, 52); drop(c, 870, 880, 52);
  line(c, [[160, 880], [260, 880]], 12, COL.greyDk);
  void c;
};
// term 7
const t7 = (c: Ctx) => {
  ground(c);
  const cols = ["#d8d85a", "#ffe066", "#ffd34d", "#e0aa38", "#b9792f"];
  cols.forEach((col, i) => {
    const x = 35 + i * 205;
    shape(c, () => rrect(c, x, 190, 190, 520, 18), WHITE, 6);
    banana(c, x + 95, 450, 0.85, Math.PI / 2 - 0.25, col, i * 2);
    write(c, String(i + 1), x + 70, 760, 70, INK, 9);
  });
  arrow(c, [[100, 930], [980, 930]], RED, 12);
};
// term 8
const t8 = (c: Ctx) => {
  ground(c);
  const x = 540, y = 430, r = 300;
  clock(c, x, y, r, 60, 0);
  line(c, [[x, y], [x, y - r * 0.75]], 14, "#b9b4ab");
  line(c, [[x, y], [x + Math.sin(Math.PI / 3) * r * 0.75, y - Math.cos(Math.PI / 3) * r * 0.75]], 14);
  shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), INK, 0);
  c.beginPath(); c.arc(x, y, r * 0.6, -Math.PI / 2 + 0.12, -Math.PI / 6 - 0.06); c.strokeStyle = RED; c.lineWidth = 14; c.lineCap = "round"; c.stroke();
  line(c, [[x + Math.cos(-Math.PI / 6 - 0.45) * r * 0.6, y + Math.sin(-Math.PI / 6 - 0.45) * r * 0.6], [x + Math.cos(-Math.PI / 6 - 0.06) * r * 0.6, y + Math.sin(-Math.PI / 6 - 0.06) * r * 0.6], [x + Math.cos(-Math.PI / 6 - 0.06) * r * 0.6 - 30, y + Math.sin(-Math.PI / 6 - 0.06) * r * 0.6 - 32]], 14, RED);
  slice(c, 220, 930, 90, FL[0], 0.9); slice(c, 860, 930, 90, FL[1], 0.9);
  write(c, "10", 460, 880, 100, INK, 12);
  arrow(c, [[340, 930], [440, 930]], RED, 9); arrow(c, [[620, 930], [740, 930]], RED, 9);
  void write;
};
// term 9
const t9 = (c: Ctx) => {
  ground(c);
  page(c, 50, 120, 380, 840, 0);
  shape(c, () => rrect(c, 520, 120, 510, 840, 28), COL.steel, 6);
  shape(c, () => rrect(c, 540, 140, 470, 800, 20), COL.steelIn, 4);
  [1, 2, 3].forEach((n, i) => {
    const y = 270 + i * 270;
    shape(c, () => rrect(c, 130, y - 70, 130, 140, 10), FL[n], 5);
    write(c, String(n), 300, y - 40, 80, INK, 10);
    slice(c, 780, y, 100, FL[n], 0.9);
    write(c, String(n), 930, y - 40, 80, INK, 10);
    line(c, [[420, y], [510, y]], 8, RED);
  });
};
// term 10
const t10 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 520, 520, 440, 440), "#f6ecc4", 10);
  magnifier(c, 520, 520, 0.0001, 0.8);
  line(c, [[820, 830], [980, 990]], 40, INK); line(c, [[820, 830], [980, 990]], 26, COL.brown);
  // enzyme: big purple round with a notch
  const en = () => { c.moveTo(430, 330); c.bezierCurveTo(300, 330, 290, 700, 440, 700); c.bezierCurveTo(580, 700, 640, 560, 540, 520); c.bezierCurveTo(600, 470, 570, 330, 430, 330); c.closePath(); };
  shape(c, en, COL.purple, 7); shade(c, en, "#5f43a0", 20, 20, 0.4);
  shape(c, () => ell(c, 230, 430, 50, 50), WHITE, 6);
  shape(c, () => ell(c, 220, 620, 38, 38), COL.blue, 6); shape(c, () => ell(c, 280, 650, 38, 38), COL.blue, 6);
  shape(c, () => ell(c, 770, 520, 56, 56), "#7a4a24", 7);
  arrow(c, [[250, 480], [330, 500]], RED, 9); arrow(c, [[300, 610], [360, 580]], RED, 9); arrow(c, [[630, 520], [700, 520]], RED, 9);
};
// term 11
const t11 = (c: Ctx) => {
  ground(c);
  platE(c, 270, 750, 230, 80); slice(c, 270, 735, 140, FL[2], 0.6);
  const o2 = (x: number, y: number) => { shape(c, () => ell(c, x, y, 20, 20), COL.blue, 5); shape(c, () => ell(c, x + 30, y + 8, 20, 20), COL.blue, 5); };
  [[170, 250], [290, 190], [210, 360]].forEach(([x, y]) => { o2(x, y); arrow(c, [[x + 12, y + 50], [x + 40 + (270 - x) * 0.1, y + 120]], RED, 8); });
  glass(c, 800, 850, 300, 460, 0.8);
  slice(c, 800, 815, 100, FL[0], 0.38);
  o2(740, 640); arrow(c, [[780, 690], [790, 750]], RED, 8);
};
// expl 0
const e0 = (c: Ctx) => {
  ground(c);
  page(c, 60, 70, 960, 940, 0);
  cloudB(c, 540, 270, 760, 340, "#eef0f6");
  [[330, 220], [450, 330], [560, 200], [680, 320], [760, 220]].forEach(([x, y]) => qmark(c, x, y, 54, COL.greyDk));
  [200, 540, 880].forEach((x) => arrow(c, [[x, 480], [x, 600]]));
  [200, 540, 880].forEach((x) => shape(c, () => rrect(c, x - 150, 620, 300, 330, 22), WHITE, 6));
  slice(c, 160, 760, 55, FL[2], 0.9); drop(c, 240, 760, 38); tick(c, 200, 890, 56);
  banana(c, 520, 770, 0.6, -0.2, "#ffd34d", 3); eye(c, 590, 710, 36); tick(c, 540, 890, 56);
  leafBig(c, 850, 850, 160, true); clock(c, 900, 710, 44, 120, 0); tick(c, 880, 910, 40);
  void tick;
};
// expl 1
const e1 = (c: Ctx) => {
  ground(c);
  page(c, 170, 50, 740, 990, 0);
  for (let i = 0; i < 7; i++) {
    const y = 130 + i * 130, x = 260;
    line(c, [[x + 130, y], [830, y]], 8, "#9aa5b8");
    if (i === 0) qmark(c, x + 40, y - 4, 64);
    if (i === 1) { cloudB(c, x + 40, y, 120, 80); }
    if (i === 2) eye(c, x + 45, y, 46);
    if (i === 3) { line(c, [[x + 5, y + 36], [x + 85, y + 36]], 7); line(c, [[x + 45, y + 36], [x + 45, y - 30]], 7); line(c, [[x - 5, y - 30], [x + 95, y - 30]], 7); shape(c, () => ell(c, x - 2, y - 8, 18, 12), COL.steel, 4); shape(c, () => ell(c, x + 92, y - 8, 18, 12), COL.steel, 4); }
    if (i === 4) clock(c, x + 45, y, 42, 60, 0);
    if (i === 5) pencil(c, x - 5, y + 30, x + 90, y - 30, 18);
    if (i === 6) shape(c, () => { c.moveTo(x + 15, y + 40); c.lineTo(x + 5, y - 15); c.quadraticCurveTo(x + 20, y - 40, x + 45, y - 22); c.lineTo(x + 70, y - 38); c.lineTo(x + 78, y + 40); c.closePath(); }, COL.yellow, 5);
  }
};
// expl 2
const e2 = (c: Ctx) => {
  ground(c);
  FL6.forEach((f, i) => {
    const x = 40 + (i % 3) * 335, y = 150 + Math.floor(i / 3) * 440;
    shape(c, () => rrect(c, x, y, 310, 330, 16), WHITE, 6);
    c.save(); c.beginPath(); rrect(c, x + 12, y + 12, 286, 220, 8); c.clip(); c.fillStyle = "#e6c88e"; c.fillRect(x, y, 310, 330); c.restore();
    platE(c, x + 155, y + 130, 110, 48); slice(c, x + 155, y + 122, 62, f, 0.7);
    write(c, String(i * 10), x + 155 - String(i * 10).length * 24, y + 255, 50, INK, 8);
  });
};
// expl 3
const e3 = (c: Ctx) => {
  ground(c);
  [0, 1, 2].forEach((i) => {
    const y = 190 + i * 330;
    shape(c, () => rrect(c, 40, y - 140, 1000, 290, 24), "#f9f3e3", 5);
    if (i === 0) slice(c, 190, y, 90, FL[1], 0.9);
    if (i === 1) banana(c, 190, y, 0.8, -0.2, "#ffd34d", 3);
    if (i === 2) { shape(c, () => polyP(c, [[130, y + 100], [250, y + 100], [235, y + 40], [145, y + 40]]), COL.soil, 5); line(c, [[190, y + 40], [190, y - 60]], 9, COL.leafDk); leaf(c, 190, y - 40, 90, -0.5); leaf(c, 190, y - 20, 90, -2.6); leaf(c, 190, y - 70, 80, -1.57); }
    arrow(c, [[320, y], [430, y]], RED, 10);
    if (i === 0) { clock(c, 620, y, 105, 60, 0); write(c, "10", 820, y - 40, 80, INK, 10); }
    if (i === 1) { grid(c, 500, y - 80, 220, 160, 1, 1); write(c, "1", 800, y - 40, 80, INK, 10); }
    if (i === 2) { grid(c, 500, y - 80, 400, 160, 7, 7); write(c, "7", 940, y - 40, 80, INK, 10); }
  });
};
// expl 4
const e4 = (c: Ctx) => {
  ground(c);
  person(c, 200, 990, 520);
  flip(c, () => person(c, 200, 990, 520));
  desk(c, 780);
  cloudB(c, 220, 190, 360, 250, "#fffbe0"); slice(c, 220, 190, 90, FL[0], 0.9);
  cloudB(c, 860, 190, 360, 250, "#ffe3dc"); slice(c, 860, 190, 90, FL[3], 0.9);
  [[260, 340, 14], [250, 400, 20], [280, 450, 8]].forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r), WHITE, 4));
  [[820, 340, 14], [830, 400, 20], [800, 450, 8]].forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r), WHITE, 4));
  page(c, 400, 560, 280, 330, 0);
  slice(c, 540, 700, 80, FL[2], 0.9); write(c, "2", 520, 780, 70, INK, 9);
  tick(c, 600, 840, 40);
};
// expl 5
const e5 = (c: Ctx) => {
  ground(c);
  const o2 = (x: number, y: number) => { shape(c, () => ell(c, x, y, 16, 16), COL.blue, 5); shape(c, () => ell(c, x + 24, y + 6, 16, 16), COL.blue, 5); };
  [[200, 90], [450, 60], [700, 90], [920, 60]].forEach(([x, y]) => { o2(x, y); arrow(c, [[x + 10, y + 50], [x + 14, y + 130]], RED, 8); });
  c.fillStyle = "#f6ecc4"; c.fillRect(0, 300, D2, 800);
  line(c, [[0, 300], [D2, 300]], 8);
  const broken = (x: number, y: number, r: number) => {
    const a0 = -Math.PI / 2 + 0.7, a1 = -Math.PI / 2 - 0.7 + Math.PI * 2;
    shape(c, () => { c.arc(x, y, r, a0, a1); c.closePath(); }, "#e2b97c", 0);
    c.beginPath(); c.arc(x, y, r, a0, a1); c.strokeStyle = INK; c.lineWidth = 6; c.lineCap = "round"; c.stroke();
    [[-30, 10], [25, 25], [0, 50]].forEach(([a, b]) => shape(c, () => ell(c, x + a, y + b, 15, 15), "#7a4a24", 0));
    shape(c, () => ell(c, x - 35, y - 25, 14, 14), COL.purple, 3); shape(c, () => ell(c, x + 35, y - 20, 12, 12), WHITE, 3);
  };
  [130, 330, 530, 730, 930].forEach((x) => broken(x, 460, 100));
  const whole = (x: number, y: number, r: number) => {
    shape(c, () => ell(c, x, y, r, r), "#fffbe8", 6);
    line(c, [[x, y - r + 12], [x, y + r - 12]], 4, "#d8cfae");
    shape(c, () => ell(c, x - 40, y, 20, 20), COL.purple, 3);
    shape(c, () => ell(c, x + 36, y - 22, 13, 13), WHITE, 3); shape(c, () => ell(c, x + 36, y + 22, 13, 13), WHITE, 3);
  };
  [230, 430, 630, 830].forEach((x) => whole(x, 700, 100));
  [130, 330, 530, 730, 930].forEach((x) => whole(x, 900, 100));
};
// expl 6
const e6 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 130], [450, 160], [900, 110], [1080, 150]], 40, INK); line(c, [[0, 130], [450, 160], [900, 110], [1080, 150]], 28, COL.brown);
  leaf(c, 200, 140, 150, 0.6); leaf(c, 300, 150, 140, 2.5); leaf(c, 800, 130, 160, 2.6); leaf(c, 880, 120, 150, 0.4);
  line(c, [[500, 160], [510, 330]], 12);
  const x = 500, y = 600, r = 270;
  appleSide(c, x, y, r);
  // the bite: a scoop out of the apple, its edge gone brown
  const bx = x + 250, by = y - 20, br = 130;
  c.save(); c.beginPath(); c.arc(x, y, r * 1.2, 0, Math.PI * 2); c.clip();
  c.beginPath(); ell(c, bx, by, br + 44, br + 44); c.fillStyle = "#fff1c8"; c.fill();
  c.beginPath(); ell(c, bx, by, br + 12, br + 12); c.strokeStyle = "#8a5a2a"; c.lineWidth = 26; c.stroke();
  c.restore();
  c.beginPath(); ell(c, bx, by, br, br); c.fillStyle = BG; c.fill();
  c.save(); c.beginPath(); ell(c, x, y + 20, r * 0.97, r * 0.95); c.clip(); c.beginPath(); ell(c, bx, by, br, br); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); c.restore();
  // fly
  shape(c, () => ell(c, 900, 330, 34, 22), COL.black, 5); shape(c, () => ell(c, 880, 300, 24, 12, -0.5), COL.glass, 4); shape(c, () => ell(c, 925, 300, 24, 12, 0.5), COL.glass, 4);
  arrow(c, [[860, 440], [940, 380]], RED, 9);
  // mould speck
  shape(c, () => ell(c, 960, 700, 34, 28), "#7d9a6a", 5);
  [[-28, -6], [28, 6], [0, -30]].forEach(([a, b]) => line(c, [[960, 700], [960 + a * 1.3, 700 + b * 1.3]], 4, "#7d9a6a"));
  arrow(c, [[900, 680], [820, 700]], RED, 9);
};

export const ic_howWeKnowAskingQuestionsL3 = cards("sci.how-we-know.asking-questions.L3 cards", [
  intro, summary, a1, a2, a3, a4, a5, p2, c1, c2,
  t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11,
  e0, e1, e2, e3, e4, e5, e6,
]);
