import type { Ctx } from "./core";
import { ground, shape, ell, rrect, polyP, shadow, shade, line, shine, arrow, hand, write, cards, rnd, INK, WHITE, RED, COL, SKIN, CLOTH } from "./flatKit";

// ---------------------------------------------------------------- shared pieces
const WOOL = COL.purple;
const woolLine = (c: Ctx, pts: number[][], w = 12) => { line(c, pts, w + 8, INK); line(c, pts, w, WOOL); };
const ring = (cx: number, cy: number, r: number, a0: number, a1: number, n = 16) => Array.from({ length: n + 1 }, (_, i) => { const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
// a paper straw (white with teal stripes) centred at (x, y), length len, thickness th, rotated rot
const straw = (c: Ctx, x: number, y: number, len: number, th: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => rrect(c, -len / 2, -th / 2, len, th, th / 2.4);
  shape(c, p, WHITE, 6);
  c.save(); c.beginPath(); p(); c.clip();
  for (let sx = -len / 2 - th; sx < len / 2 + th; sx += th * 0.95) line(c, [[sx, th / 2 + 4], [sx + th * 0.6, -th / 2 - 4]], th * 0.3, COL.teal);
  c.restore();
  shape(c, p, "rgba(0,0,0,0)", 6);
  c.restore();
};
// a steel tumbler from the side, bottom centre (x, y)
const tumblerSide = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.14, y + 8, w * 0.6, w * 0.1);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.42, y); c.lineTo(x - w * 0.42, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -w * 0.3, 0, 0.6);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), COL.steelIn, 5);
  shine(c, [[x - w * 0.33, y - h * 0.85], [x - w * 0.28, y - h * 0.2]], 8);
};
// a steel tumbler seen from above
const tumblerTop = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + 20, y + 24, r, r);
  shape(c, () => ell(c, x, y, r, r), COL.steel);
  shape(c, () => ell(c, x, y, r * 0.84, r * 0.84), COL.steelIn, 4);
};
// children's scissors, pivot at (x, y), pointing along rot
const scissors = (c: Ctx, x: number, y: number, rot: number, s = 1) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => polyP(c, [[0, 8], [190, -34], [196, -24], [10, 28]]), COL.steel, 5);
  for (const [hy, col] of [[-1, COL.red], [1, COL.teal]] as [number, string][]) {
    line(c, [[0, 0], [-60, hy * 40]], 18, INK); line(c, [[0, 0], [-60, hy * 40]], 8, col);
    shape(c, () => ell(c, -96, hy * 48, 38, 30), col, 6); shape(c, () => ell(c, -96, hy * 48, 20, 14), COL.cloth, 5);
  }
  shape(c, () => polyP(c, [[0, -8], [190, 30], [196, 20], [10, -28]]), COL.steelIn, 5);
  shape(c, () => ell(c, 0, 0, 10, 10), COL.steelDk, 4);
  c.restore();
};
// small animal pictures for cards, centred at (x, y), about 100 px wide at s = 1
type Kind = "fish" | "bird" | "mammal" | "snake" | "frog";
const animal = (c: Ctx, k: Kind, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const dot = (ex: number, ey: number) => shape(c, () => ell(c, ex, ey, 4, 4), INK, 0);
  if (k === "fish") {
    shape(c, () => polyP(c, [[-24, 0], [-52, -24], [-52, 24]]), COL.orange, 5);
    shape(c, () => ell(c, 4, 0, 40, 25), COL.blue, 5); shape(c, () => polyP(c, [[-6, -22], [10, -42], [24, -18]]), COL.blueDk, 4); dot(26, -6);
  } else if (k === "bird") {
    shape(c, () => ell(c, -4, 8, 38, 26, -0.25), COL.red, 5); shape(c, () => ell(c, 26, -20, 18, 18), COL.red, 5);
    shape(c, () => polyP(c, [[42, -24], [62, -18], [42, -12]]), COL.yellow, 4); dot(30, -24);
    shape(c, () => ell(c, -8, 8, 22, 13, -0.4), COL.pink, 4); shape(c, () => polyP(c, [[-38, 6], [-66, 22], [-60, -2]]), COL.red, 4);
  } else if (k === "mammal") {
    for (const lx of [-26, 24]) shape(c, () => rrect(c, lx - 7, 8, 14, 36, 6), COL.brown, 5);
    shape(c, () => ell(c, 0, 0, 42, 26), COL.brown, 5); shape(c, () => ell(c, 40, -16, 20, 18), COL.brown, 5);
    shape(c, () => polyP(c, [[34, -30], [38, -48], [48, -30]]), COL.brown, 4); dot(46, -18);
    line(c, [[-40, -4], [-60, -26]], 8, INK); line(c, [[-40, -4], [-60, -26]], 3, COL.brown);
  } else if (k === "snake") {
    const pts = Array.from({ length: 21 }, (_, i) => [-50 + i * 5, 14 * Math.sin(i * 0.65)]);
    line(c, pts, 24, INK); line(c, pts, 14, COL.green); shape(c, () => ell(c, 56, pts[20][1], 14, 11), COL.green, 5); dot(60, pts[20][1] - 3);
  } else {
    shape(c, () => ell(c, 0, 8, 40, 28), COL.leaf, 5); shape(c, () => ell(c, -22, -20, 14, 14), COL.leaf, 5); shape(c, () => ell(c, 22, -20, 14, 14), COL.leaf, 5); dot(-22, -22); dot(22, -22);
    shape(c, () => ell(c, -34, 36, 14, 8), COL.leafDk, 4); shape(c, () => ell(c, 34, 36, 14, 8), COL.leafDk, 4);
  }
  c.restore();
};
const cardFront = (c: Ctx, x: number, y: number, w: number, h: number, k: Kind, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, w * 0.1, h * 0.52, w * 0.5, h * 0.07);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 10), COL.paper, 5);
  animal(c, k, 0, 0, w / 130);
  c.restore();
};
const DOT = { blue: COL.blue, brown: COL.soil, red: COL.red, yellow: COL.yellow };
type Dot = keyof typeof DOT;
const cardBack = (c: Ctx, x: number, y: number, w: number, h: number, d: Dot, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, w * 0.1, h * 0.52, w * 0.5, h * 0.07);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 10), COL.cloth, 5);
  shape(c, () => ell(c, 0, 0, w * 0.24, w * 0.24), DOT[d], 5);
  c.restore();
};
// a sheet of paper
const sheet = (c: Ctx, x: number, y: number, w: number, h: number, col: string = WHITE) => { shadow(c, x + w * 0.04, y + h / 2 + 8, w * 0.52, h * 0.03); shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 8), col, 6); };
// icons for water, land, air
const iconWater = (c: Ctx, x: number, y: number) => { for (let i = 0; i < 3; i++) { const yy = y - 28 + i * 28, pts = Array.from({ length: 13 }, (_, k) => [x - 60 + k * 10, yy + 9 * Math.sin(k * 1.1)]); line(c, pts, 14, INK); line(c, pts, 7, COL.blue); } };
const iconLand = (c: Ctx, x: number, y: number) => {
  shape(c, () => { c.moveTo(x - 70, y + 36); c.quadraticCurveTo(x, y - 40, x + 70, y + 36); c.closePath(); }, COL.green, 6);
  line(c, [[x + 40, y + 10], [x + 40, y - 30]], 8, COL.woodDk); shape(c, () => ell(c, x + 40, y - 40, 22, 20), COL.leaf, 5);
};
const iconAir = (c: Ctx, x: number, y: number) => {
  shape(c, () => ell(c, x - 6, y + 8, 42, 22), COL.sky, 5); shape(c, () => ell(c, x - 30, y - 8, 24, 22), COL.sky, 5); shape(c, () => ell(c, x + 20, y - 12, 28, 26), COL.sky, 5);
  shape(c, () => ell(c, x - 6, y + 8, 40, 20), COL.sky, 0);
};
// body-covering icons
const iconScales = (c: Ctx, x: number, y: number) => {
  for (let r = 0; r < 3; r++) for (let k = 0; k < 4 - (r % 2); k++) { const sx = x - 51 + k * 34 + (r % 2) * 17, sy = y - 24 + r * 24; shape(c, () => { c.moveTo(sx - 17, sy - 14); c.arc(sx, sy - 14, 17, Math.PI, 0, true); c.lineTo(sx + 17, sy - 14); c.arc(sx, sy - 14, 17, 0, Math.PI); c.closePath(); }, r % 2 ? COL.blue : COL.teal, 4); }
};
const iconFeather = (c: Ctx, x: number, y: number) => {
  shape(c, () => { c.moveTo(x - 36, y + 50); c.quadraticCurveTo(x - 70, y - 20, x + 30, y - 52); c.quadraticCurveTo(x + 60, y + 20, x - 36, y + 50); c.closePath(); }, COL.yellow, 5);
  line(c, [[x - 44, y + 58], [x + 24, y - 44]], 6, INK);
  for (let k = 0; k < 4; k++) line(c, [[x - 28 + k * 12, y + 28 - k * 18], [x - 4 + k * 12, y + 28 - k * 18 + 6]], 3, COL.orange);
};
const iconFur = (c: Ctx, x: number, y: number) => {
  const pts: number[][] = []; for (let k = 0; k <= 8; k++) pts.push([x - 64 + k * 16, y - 28 + (k % 2 ? -12 : 14)]);
  for (let k = 8; k >= 0; k--) pts.push([x - 64 + k * 16, y + 30 + (k % 2 ? 14 : -12)]);
  shape(c, () => polyP(c, pts), COL.brown, 5);
  for (let k = 0; k < 4; k++) line(c, [[x - 40 + k * 26, y - 10], [x - 34 + k * 26, y + 14]], 4, COL.soilDk);
};
const iconSkin = (c: Ctx, x: number, y: number) => {
  shape(c, () => { c.moveTo(x - 62, y); c.quadraticCurveTo(x - 30, y - 50, x + 4, y - 14); c.quadraticCurveTo(x + 40, y + 24, x + 66, y - 8); c.lineTo(x + 66, y + 40); c.lineTo(x - 62, y + 40); c.closePath(); }, COL.leaf, 5);
  for (const [dx, dy] of [[-30, 18], [10, 10], [40, 26]]) shape(c, () => ell(c, x + dx, y + dy, 8, 11), COL.drop, 3);
};
const iconPlates = (c: Ctx, x: number, y: number) => {
  for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) { const px = x - 48 + k * 48, py = y - 40 + r * 40; shape(c, () => polyP(c, [[px, py - 22], [px + 24, py], [px, py + 22], [px - 24, py]]), (r + k) % 2 ? COL.greenDk : COL.green, 4); }
};

// ---------------------------------------------------------------- experiment e1: a straw round a tumbler
// e1.0: a straw on wool, a tumbler, scissors
const e1s0 = (c: Ctx) => {
  ground(c);
  tumblerSide(c, 190, 400, 190, 230);
  scissors(c, 700, 900, -0.3, 1.25);
  const wool = Array.from({ length: 19 }, (_, i) => [50 + i * 55, 640 + 18 * Math.sin(i * 0.8)]);
  woolLine(c, wool, 14);
  shadow(c, 570, 696, 380, 20);
  straw(c, 540, 640, 700, 84);
  arrow(c, [[330, 500], [790, 500]]);
};
// e1.1: wrap it round the tumbler: the straight straw touches at one point
const e1s1 = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 540, r = 190, wr = r + 8;
  tumblerTop(c, cx, cy, r);
  const left = [[310, 322], ...ring(cx, cy, wr, 210, 110, 10), [400, 790]];
  const right = left.map(([x, y]) => [1080 - x, y]);
  woolLine(c, left); woolLine(c, right);
  straw(c, cx, cy - r - 31, 460, 62);
  hand(c, 362, 857, -1.05, 1.1);
  hand(c, 718, 857, -Math.PI + 1.05, 1.1, SKIN.child, CLOTH.child);
  arrow(c, ring(cx, cy, 262, -25, 55, 8));
};
// e1.2: the straw cut into 2, then 4, then 8 pieces on wool
const e1s2 = (c: Ctx) => {
  ground(c);
  const rows: [number, number][] = [[2, 280], [4, 540], [8, 800]];
  rows.forEach(([n, y]) => {
    woolLine(c, [[210, y], [1040, y]], 12);
    const gap = 14, len = (760 - (n - 1) * gap) / n;
    for (let i = 0; i < n; i++) { const x = 240 + len / 2 + i * (len + gap); shadow(c, x + 8, y + 32, len / 2, 8); straw(c, x, y, len, 56); }
    write(c, String(n), 62, y - 42, 84, INK, 12);
  });
  arrow(c, [[96, 372], [96, 454]]); arrow(c, [[96, 632], [96, 714]]);
};
// e1.3: eight pieces hug the tumbler
const e1s3 = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 540, r = 190, th = 56, rc = r + th / 2 + 4, side = 2 * rc * Math.tan(Math.PI / 8);
  tumblerTop(c, cx, cy, r);
  const vert = Array.from({ length: 9 }, (_, k) => { const a = (k * 45 - 90) * Math.PI / 180, rv = rc / Math.cos(Math.PI / 8); return [cx + rv * Math.cos(a), cy + rv * Math.sin(a)]; });
  woolLine(c, vert, 12);
  for (let k = 0; k < 8; k++) { const a = (k * 45 - 67.5) * Math.PI / 180; straw(c, cx + rc * Math.cos(a), cy + rc * Math.sin(a), side - 36, th, a + Math.PI / 2); }
  write(c, "8", cx - 36, cy - 62, 124, INK, 16);
};

// ---------------------------------------------------------------- experiment e2: sorting animal cards
const KINDS: Kind[] = ["fish", "bird", "mammal", "snake", "frog"];
// e2.0: eighteen cards, some turned over to show a colour dot
const e2s0 = (c: Ctx) => {
  ground(c);
  const backs: Record<number, Dot> = { 3: "blue", 8: "brown", 13: "red", 16: "yellow" };
  for (let i = 0; i < 18; i++) {
    const x = 115 + (i % 6) * 170, y = 380 + Math.floor(i / 6) * 230, rot = Math.sin(i * 2.3) * 0.05;
    if (backs[i]) cardBack(c, x, y, 150, 190, backs[i], rot); else cardFront(c, x, y, 150, 190, KINDS[(i * 2 + Math.floor(i / 6)) % 5], rot);
  }
  write(c, "18", 462, 50, 110, INK, 14);
};
// e2.1: three sheets, a hand puts a card on one
const e2s1 = (c: Ctx) => {
  ground(c);
  const xs = [190, 540, 890], icons = [iconWater, iconLand, iconAir], kinds: Kind[][] = [["fish", "frog"], ["mammal", "snake"], ["bird", "bird"]];
  xs.forEach((x, i) => {
    sheet(c, x, 650, 300, 620, i === 2 ? "#e8f4fb" : i === 0 ? "#e6f1fb" : "#f1f6e4");
    icons[i](c, x, 430);
    cardFront(c, x - 60, 640, 120, 150, kinds[i][0], -0.05); cardFront(c, x + 60, 810, 120, 150, kinds[i][1], 0.05);
  });
  cardFront(c, 540, 232, 120, 150, "mammal", 0.0);
  hand(c, 540, 50, Math.PI / 2, 1.4);
  arrow(c, [[720, 120], [720, 300]]);
};
// e2.2: cards turned over on a mat: the dots are all mixed
const e2s2 = (c: Ctx) => {
  ground(c);
  sheet(c, 540, 560, 930, 700, WHITE);
  const dots: Dot[] = ["blue", "red", "yellow", "brown", "brown", "blue", "yellow", "red"];
  dots.forEach((d, i) => { if (i === 7) return; cardBack(c, 250 + (i % 4) * 193, 420 + Math.floor(i / 4) * 230, 150, 184, d, Math.sin(i * 1.7) * 0.04); });
  cardBack(c, 829, 650, 150, 184, "red", -0.1);
  hand(c, 829, 880, -Math.PI / 2, 1.2);
  arrow(c, ring(829, 700, 150, -165, -15, 8));
};
// e2.3: five mats, each a body covering; backs are mostly one colour
const e2s3 = (c: Ctx) => {
  ground(c);
  const icons = [iconScales, iconFeather, iconFur, iconSkin, iconPlates];
  const dots: Dot[][] = [["blue", "blue", "brown"], ["yellow", "yellow", "yellow"], ["red", "red", "red"], ["brown", "brown", "brown"], ["brown", "brown", "yellow"]];
  icons.forEach((ic, i) => {
    const x = 120 + i * 210;
    sheet(c, x, 600, 188, 640, i % 2 ? "#f5f0e2" : WHITE);
    ic(c, x, 390);
    dots[i].forEach((d, j) => cardBack(c, x, 520 + j * 140, 130, 124, d, (j - 1) * 0.04));
  });
};

export const su_animalsVertebrateGroupsL2 = cards("sci.animals.vertebrate-groups.L2 set-up", [e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, e2s3]);
