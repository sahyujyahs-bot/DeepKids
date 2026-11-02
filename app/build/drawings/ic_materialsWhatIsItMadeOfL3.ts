import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, glass, bowl, plate, leaf, write, cards } from "./flatKit";

// sci.materials.what-is-it-made-of.L3 · picture cards (cover, activities, terms, explanations).
// Flat DeepKids style: real objects big and central, red arrows for change, no words.

const sd = (c: Ctx, path: () => void, col: string, k: number) => shade(c, path, col, -k, -k);
const ob = (c: Ctx, path: () => void, fill: string, dk: string, k: number, lw = 6) => { shape(c, path, fill, lw); sd(c, path, dk, k); };
const tile = (c: Ctx, x: number, y: number, w: number, h = w, col: string = WHITE) => shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 28), col, 5);
// a union of circles with one outline round the lot
const blob = (c: Ctx, cs: number[][], fill: string, dk?: string) => {
  cs.forEach(([x, y, r]) => { c.beginPath(); ell(c, x, y, r, r); c.lineWidth = 12; c.strokeStyle = INK; c.lineJoin = "round"; c.stroke(); });
  cs.forEach(([x, y, r]) => { c.beginPath(); ell(c, x, y, r, r); c.fillStyle = fill; c.fill(); });
  if (dk) cs.forEach(([x, y, r]) => sd(c, () => ell(c, x, y, r, r), dk, r * 0.28));
};
const WOOLC = "#f4efe3", WOOLD = "#d9d0bb", CRED = "#c9573a", CREDD = "#a2402a";

const tree = (c: Ctx, x: number, y: number, h: number, col: string = COL.leaf, dk: string = COL.leafDk) => {
  shadow(c, x + h * 0.12, y + 6, h * 0.34, h * 0.05);
  ob(c, () => polyP(c, [[x - h * 0.07, y], [x - h * 0.05, y - h * 0.55], [x + h * 0.05, y - h * 0.55], [x + h * 0.07, y]]), COL.brown, COL.soilDk, h * 0.03);
  blob(c, [[x, y - h * 0.78, h * 0.22], [x - h * 0.2, y - h * 0.62, h * 0.18], [x + h * 0.2, y - h * 0.62, h * 0.18], [x - h * 0.1, y - h * 0.9, h * 0.17], [x + h * 0.12, y - h * 0.88, h * 0.17]], col, dk);
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 9, COL.orange); }
  ob(c, () => ell(c, x, y, r, r), COL.yellow, COL.orange, r * 0.25);
};
const cloud = (c: Ctx, x: number, y: number, s: number, col = "#f4f8fc") => blob(c, [[x - s * 0.5, y + s * 0.1, s * 0.3], [x, y - s * 0.1, s * 0.42], [x + s * 0.5, y + s * 0.1, s * 0.3], [x + s * 0.15, y + s * 0.22, s * 0.3], [x - s * 0.2, y + s * 0.22, s * 0.28]], col, "#c9d8e6");
const star = (c: Ctx, x: number, y: number, r: number, col: string = COL.yellow) => {
  const pts: number[][] = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  shape(c, () => polyP(c, pts), col, 6);
};
const sparkle = (c: Ctx, x: number, y: number, r: number, col: string = COL.yellow) => shape(c, () => { c.moveTo(x, y - r); c.quadraticCurveTo(x, y, x + r, y); c.quadraticCurveTo(x, y, x, y + r); c.quadraticCurveTo(x, y, x - r, y); c.quadraticCurveTo(x, y, x, y - r); c.closePath(); }, col, 4);

const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, kind: "steel" | "plastic" = "steel", col: string = COL.orange, dk: string = COL.red) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
  if (kind === "steel") { ob(c, body, COL.steel, COL.steelDk, w * 0.14); shape(c, () => ell(c, x, y - h, w / 2, w * 0.09), COL.steelIn, 5); shine(c, [[x - w * 0.34, y - h * 0.8], [x - w * 0.27, y - h * 0.2]], 8); }
  else { ob(c, body, col, dk, w * 0.14); shape(c, () => ell(c, x, y - h, w / 2, w * 0.09), dk, 5); line(c, [[x - w * 0.46, y - h * 0.62], [x + w * 0.46, y - h * 0.62]], 4, INK); line(c, [[x - w * 0.43, y - h * 0.3], [x + w * 0.43, y - h * 0.3]], 4, INK); shine(c, [[x - w * 0.34, y - h * 0.85], [x - w * 0.3, y - h * 0.7]], 8); }
};
const spoon = (c: Ctx, x: number, y: number, len: number, ang: number) => {
  c.save(); c.translate(x, y); c.rotate(ang);
  shape(c, () => polyP(c, [[-len / 2, -len * 0.035], [len * 0.12, -len * 0.05], [len * 0.12, len * 0.05], [-len / 2, len * 0.035]]), COL.steel, 6);
  shape(c, () => ell(c, len * 0.3, 0, len * 0.2, len * 0.13), COL.steel, 6);
  shape(c, () => ell(c, len * 0.31, 0, len * 0.14, len * 0.08), COL.steelIn, 4);
  shine(c, [[-len * 0.4, -len * 0.01], [0, -len * 0.01]], 6);
  c.restore();
};
const bucket = (c: Ctx, x: number, y: number, w: number, h: number, col: string = COL.red, dk = "#b53a28") => {
  shadow(c, x + w * 0.1, y + 6, w * 0.6, w * 0.1);
  c.beginPath(); c.arc(x, y - h, w * 0.46, Math.PI, 0); c.strokeStyle = INK; c.lineWidth = 16; c.stroke(); c.strokeStyle = COL.greyDk; c.lineWidth = 6; c.stroke();
  const b = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.38, y); c.lineTo(x - w * 0.38, y); c.closePath(); };
  ob(c, b, col, dk, w * 0.12); shape(c, () => ell(c, x, y - h, w / 2, w * 0.08), dk, 5); shine(c, [[x - w * 0.3, y - h * 0.8], [x - w * 0.24, y - h * 0.25]], 8);
};
const brick = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.08, y + h * 0.5, w * 0.55, h * 0.14);
  ob(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 8), CRED, CREDD, h * 0.12);
  [-0.22, 0.22].forEach((u) => shape(c, () => rrect(c, x + u * w - w * 0.09, y - h * 0.2, w * 0.18, h * 0.4, 6), CREDD, 3));
};
const pencil = (c: Ctx, x: number, y: number, len: number, ang: number) => {
  c.save(); c.translate(x, y); c.rotate(ang); const hw = len * 0.09;
  shape(c, () => rrect(c, len * 0.34, -hw, len * 0.16, hw * 2, 8), COL.pink, 6);
  shape(c, () => rect2(c, len * 0.28, -hw, len * 0.07, hw * 2), COL.steel, 5);
  shape(c, () => rect2(c, -len * 0.3, -hw, len * 0.58, hw * 2), COL.yellow, 6);
  c.fillStyle = COL.orange; c.fillRect(-len * 0.3, hw * 0.35, len * 0.58, hw * 0.65); line(c, [[-len * 0.3, hw], [len * 0.28, hw]], 6);
  shape(c, () => polyP(c, [[-len * 0.5, 0], [-len * 0.3, -hw], [-len * 0.3, hw]]), COL.wood, 6);
  shape(c, () => polyP(c, [[-len * 0.5, 0], [-len * 0.43, -hw * 0.4], [-len * 0.43, hw * 0.4]]), COL.black, 4);
  c.restore();
};
const rect2 = (c: Ctx, x: number, y: number, w: number, h: number) => { c.rect(x, y, w, h); };
const log = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.05, y + h * 0.55, w * 0.55, h * 0.14);
  ob(c, () => rrect(c, x - w / 2, y - h / 2, w, h, h * 0.18), COL.brown, COL.soilDk, h * 0.14);
  shape(c, () => ell(c, x + w / 2, y, h * 0.22, h / 2), COL.wood, 6);
  shape(c, () => ell(c, x + w / 2, y, h * 0.12, h * 0.3), COL.woodDk, 3);
  line(c, [[x - w * 0.3, y - h * 0.15], [x + w * 0.1, y - h * 0.15]], 4, COL.soilDk);
};
const hillMine = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.05, y + 4, w * 0.5, h * 0.06);
  const hill = () => { c.moveTo(x - w / 2, y); c.quadraticCurveTo(x - w * 0.25, y - h * 1.15, x, y - h); c.quadraticCurveTo(x + w * 0.3, y - h * 1.1, x + w / 2, y); c.closePath(); };
  ob(c, hill, "#a79c8c", "#857a6b", w * 0.1);
  shape(c, () => { c.moveTo(x - w * 0.12, y); c.lineTo(x - w * 0.12, y - h * 0.3); c.quadraticCurveTo(x, y - h * 0.5, x + w * 0.12, y - h * 0.3); c.lineTo(x + w * 0.12, y); c.closePath(); }, COL.black, 6);
  line(c, [[x - w * 0.14, y], [x - w * 0.14, y - h * 0.32]], 9, COL.brown); line(c, [[x + w * 0.14, y], [x + w * 0.14, y - h * 0.32]], 9, COL.brown);
  [[-0.28, -0.35], [0.26, -0.5], [-0.1, -0.7], [0.3, -0.2]].forEach(([u, v]) => shape(c, () => ell(c, x + u * w, y + v * h, w * 0.04, w * 0.03), CRED, 3));
};
const cottonBoll = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => polyP(c, [[x - r * 0.9, y + r * 0.2], [x - r * 0.4, y + r * 1.0], [x, y + r * 0.5], [x + r * 0.4, y + r * 1.0], [x + r * 0.9, y + r * 0.2]]), COL.soil, 5);
  blob(c, [[x - r * 0.5, y, r * 0.55], [x + r * 0.5, y, r * 0.55], [x, y - r * 0.5, r * 0.6], [x, y + r * 0.1, r * 0.55]], WOOLC, WOOLD);
};
const cottonPlant = (c: Ctx, x: number, y: number, h: number) => {
  shadow(c, x + 10, y + 6, h * 0.3, h * 0.04);
  line(c, [[x, y], [x, y - h * 0.8]], 14, INK); line(c, [[x, y], [x, y - h * 0.8]], 7, COL.green);
  line(c, [[x, y - h * 0.4], [x - h * 0.22, y - h * 0.58]], 12, INK); line(c, [[x, y - h * 0.4], [x - h * 0.22, y - h * 0.58]], 5, COL.green);
  line(c, [[x, y - h * 0.5], [x + h * 0.22, y - h * 0.68]], 12, INK); line(c, [[x, y - h * 0.5], [x + h * 0.22, y - h * 0.68]], 5, COL.green);
  leaf(c, x, y - h * 0.2, h * 0.28, -0.4); leaf(c, x, y - h * 0.15, h * 0.28, Math.PI + 0.4); leaf(c, x, y - h * 0.3, h * 0.24, -0.9);
  cottonBoll(c, x, y - h * 0.9, h * 0.1); cottonBoll(c, x - h * 0.24, y - h * 0.66, h * 0.09); cottonBoll(c, x + h * 0.24, y - h * 0.76, h * 0.09);
};
const sheep = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x, y + 6, s * 0.6, s * 0.07);
  for (const dx of [-0.3, -0.12, 0.2, 0.38]) shape(c, () => rrect(c, x + dx * s - s * 0.04, y - s * 0.3, s * 0.08, s * 0.3, 4), COL.black, 5);
  shape(c, () => ell(c, x - s * 0.52, y - s * 0.55, s * 0.15, s * 0.19), COL.black, 6);
  shape(c, () => ell(c, x - s * 0.52 - s * 0.12, y - s * 0.62, s * 0.07, s * 0.04, 0.5), COL.black, 4);
  blob(c, [[x - s * 0.28, y - s * 0.5, s * 0.25], [x, y - s * 0.6, s * 0.28], [x + s * 0.3, y - s * 0.52, s * 0.25], [x - s * 0.05, y - s * 0.38, s * 0.27], [x + s * 0.2, y - s * 0.38, s * 0.22], [x - s * 0.3, y - s * 0.35, s * 0.2]], WOOLC, WOOLD);
  shape(c, () => ell(c, x - s * 0.5, y - s * 0.6, s * 0.1, s * 0.07), WOOLC, 4);
};
const woolBall = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.95, r * 0.9, r * 0.14);
  ob(c, () => ell(c, x, y, r, r), COL.pink, "#d9708e", r * 0.28);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip();
  for (let i = -3; i <= 3; i++) line(c, [[x - r, y + i * r * 0.3 - r * 0.3], [x, y + i * r * 0.3 + r * 0.2], [x + r, y + i * r * 0.3 - r * 0.3]], 4, "#b5476a");
  c.restore(); c.beginPath(); ell(c, x, y, r, r); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
};
const waves = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const p = () => { c.moveTo(x - w / 2, y); for (let i = 0; i < 4; i++) { const x0 = x - w / 2 + (i * w) / 4; c.quadraticCurveTo(x0 + w / 16, y - h, x0 + w / 8, y - h * 0.35); c.quadraticCurveTo(x0 + w / 5, y - h * 0.1, x0 + w / 4, y); } c.lineTo(x + w / 2, y + h * 0.8); c.lineTo(x - w / 2, y + h * 0.8); c.closePath(); };
  ob(c, p, COL.water, COL.waterDk, h * 0.2); line(c, [[x - w * 0.3, y + h * 0.35], [x - w * 0.1, y + h * 0.35]], 5, WHITE); line(c, [[x + w * 0.1, y + h * 0.5], [x + w * 0.32, y + h * 0.5]], 5, WHITE);
};
const saltHeap = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.05, y + 4, w * 0.55, h * 0.1);
  ob(c, () => { c.moveTo(x - w / 2, y); c.quadraticCurveTo(x - w * 0.15, y - h * 0.3, x, y - h); c.quadraticCurveTo(x + w * 0.2, y - h * 0.3, x + w / 2, y); c.closePath(); }, WHITE, "#d6dde6", w * 0.1);
  sparkle(c, x - w * 0.25, y - h * 0.75, 18, COL.drop); sparkle(c, x + w * 0.3, y - h * 0.5, 14, COL.drop);
};
const factory = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.05, y + 4, w * 0.55, h * 0.06);
  ob(c, () => rrect(c, x + w * 0.2, y - h, w * 0.14, h * 0.8, 4), CRED, CREDD, w * 0.03);
  ob(c, () => polyP(c, [[x - w / 2, y], [x - w / 2, y - h * 0.55], [x - w * 0.17, y - h * 0.4], [x - w * 0.17, y - h * 0.55], [x + w * 0.17, y - h * 0.4], [x + w * 0.17, y - h * 0.55], [x + w / 2, y - h * 0.4], [x + w / 2, y]]), COL.blue, COL.blueDk, w * 0.05);
  [-0.3, 0, 0.3].forEach((u) => shape(c, () => rrect(c, x + u * w - w * 0.07, y - h * 0.3, w * 0.14, h * 0.16, 4), COL.yellow, 4));
  blob(c, [[x + w * 0.27, y - h * 1.1, w * 0.07], [x + w * 0.35, y - h * 1.22, w * 0.09]], "#e7e9ee", "#c3c8d2");
};
const potClay = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + s * 0.08, y + 6, s * 0.4, s * 0.07);
  ob(c, () => { c.moveTo(x - s * 0.18, y - s * 0.78); c.quadraticCurveTo(x - s * 0.18, y - s * 0.62, x - s * 0.34, y - s * 0.4); c.quadraticCurveTo(x - s * 0.42, y - s * 0.02, x - s * 0.18, y); c.lineTo(x + s * 0.18, y); c.quadraticCurveTo(x + s * 0.42, y - s * 0.02, x + s * 0.34, y - s * 0.4); c.quadraticCurveTo(x + s * 0.18, y - s * 0.62, x + s * 0.18, y - s * 0.78); c.closePath(); }, "#c9754a", "#a85a35", s * 0.09);
  shape(c, () => ell(c, x, y - s * 0.78, s * 0.2, s * 0.05), "#8a4a2c", 5);
  line(c, [[x - s * 0.33, y - s * 0.4], [x + s * 0.33, y - s * 0.4]], 4, "#8a4a2c");
};
const newsStack = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + s * 0.05, y + s * 0.34, s * 0.55, s * 0.07);
  [[0, 0.22, -0.04], [0, 0.1, 0.03], [0, 0, -0.02]].forEach(([_, dy, rot], i) => {
    c.save(); c.translate(x, y + dy * s - i * 4); c.rotate(rot);
    shape(c, () => rrect(c, -s * 0.38, -s * 0.12, s * 0.76, s * 0.24, 4), i === 2 ? "#eee6d6" : "#e4dbc8", 5);
    if (i === 2) { c.fillStyle = INK; c.fillRect(-s * 0.3, -s * 0.07, s * 0.35, s * 0.05); [0.01, 0.06].forEach((v) => line(c, [[-s * 0.3, v * s], [s * 0.3, v * s]], 3, COL.greyDk)); shape(c, () => rrect(c, s * 0.1, -s * 0.08, s * 0.2, s * 0.1, 3), COL.grey, 3); }
    c.restore();
  });
};
const pulpBowl = (c: Ctx, x: number, y: number, r: number) => {
  bowl(c, x, y, r, "#d9cdb5");
  const rd = rnd(5); for (let i = 0; i < 14; i++) { const a = rd() * 6.28, d = rd() * r * 0.75; line(c, [[x + Math.cos(a) * d - 12, y + Math.sin(a) * d * 0.15], [x + Math.cos(a) * d + 12, y + Math.sin(a) * d * 0.15 + 4]], 4, "#a89a80"); }
};
const sheetFrame = (c: Ctx, x: number, y: number, w: number, h: number, extra = true) => {
  shadow(c, x + 10, y + h * 0.55, w * 0.55, h * 0.08);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 8), COL.wood, 6);
  shape(c, () => rrect(c, x - w / 2 + 22, y - h / 2 + 22, w - 44, h - 44, 4), WHITE, 4);
  c.save(); c.beginPath(); c.rect(x - w / 2 + 22, y - h / 2 + 22, w - 44, h - 44); c.clip();
  for (let i = -8; i <= 8; i++) { line(c, [[x + i * 22, y - h], [x + i * 22, y + h]], 1.5, COL.grey); line(c, [[x - w, y + i * 22], [x + w, y + i * 22]], 1.5, COL.grey); }
  c.restore();
  if (extra) { line(c, [[x - 40, y - 20], [x - 10, y - 40]], 5, COL.leaf); line(c, [[x + 30, y + 30], [x + 55, y + 8]], 5, COL.leaf); shape(c, () => ell(c, x + 30, y - 30, 13, 8, 0.5), COL.orange, 3); shape(c, () => ell(c, x - 40, y + 40, 13, 8, -0.4), COL.pink, 3); }
};
const wideArrow = (c: Ctx, x1: number, y1: number, x2: number, y2: number) => arrow(c, [[x1, y1], [x2, y2]]);
const katori = (c: Ctx, x: number, y: number, r: number, liquid: string) => bowl(c, x, y, r, liquid);
const cloth = (c: Ctx, x: number, y: number, w: number, h: number, col: string = COL.cloth, dk = "#e4dccb") => {
  const p = () => { c.moveTo(x - w / 2, y - h / 2); c.lineTo(x + w / 2, y - h / 2); c.lineTo(x + w / 2, y + h / 2); c.quadraticCurveTo(x + w / 4, y + h / 2 + 14, x, y + h / 2); c.quadraticCurveTo(x - w / 4, y + h / 2 - 14, x - w / 2, y + h / 2); c.closePath(); };
  ob(c, p, col, dk, w * 0.07);
};
const diya = (c: Ctx, x: number, y: number, s: number, col = "#c9754a", dk = "#a85a35") => {
  shadow(c, x + s * 0.05, y + s * 0.2, s * 0.55, s * 0.1);
  ob(c, () => { c.moveTo(x - s * 0.5, y - s * 0.12); c.quadraticCurveTo(x - s * 0.5, y + s * 0.2, x, y + s * 0.2); c.quadraticCurveTo(x + s * 0.5, y + s * 0.2, x + s * 0.5, y - s * 0.12); c.quadraticCurveTo(x + s * 0.7, y - s * 0.3, x + s * 0.52, y - s * 0.25); c.closePath(); }, col, dk, s * 0.1);
  shape(c, () => ell(c, x - s * 0.05, y - s * 0.12, s * 0.42, s * 0.1), dk, 5);
};

const objectRow = (c: Ctx, x: number, y: number) => { void x; void y; };
void objectRow;

// ---------------------------------------------------------------- flows
const intro = (c: Ctx) => {
  ground(c);
  tree(c, 160, 450, 320); wideArrow(c, 290, 300, 380, 300);
  log(c, 520, 300, 220, 100); arrow(c, [[640, 360], [720, 450]]);
  pencil(c, 800, 600, 400, -0.35);
  shadow(c, 260, 940, 200, 28);
  ob(c, () => { c.moveTo(80, 930); c.quadraticCurveTo(70, 780, 200, 760); c.quadraticCurveTo(300, 700, 400, 780); c.quadraticCurveTo(470, 880, 420, 930); c.closePath(); }, "#7d7870", "#5d5851", 30);
  ob(c, () => { c.moveTo(190, 870); c.quadraticCurveTo(200, 800, 270, 805); c.quadraticCurveTo(340, 810, 330, 870); c.closePath(); }, COL.black, "#25212a", 14);
  shine(c, [[230, 825], [270, 818]], 7);
  arrow(c, [[430, 830], [520, 780], [610, 700]]);
};
const summary = (c: Ctx) => {
  ground(c);
  tumbler(c, 540, 700, 280, 330, "steel");
  hillMine(c, 190, 360, 250, 220); wideArrow(c, 280, 420, 400, 520);
  cottonPlant(c, 540, 380, 280); arrow(c, [[540, 400], [540, 460]]);
  sheep(c, 880, 400, 250); wideArrow(c, 840, 450, 700, 540);
  waves(c, 180, 870, 260, 50); saltHeap(c, 180, 800, 160, 100);
  wideArrow(c, 330, 840, 400, 780);
  star(c, 890, 840, 70); sparkle(c, 810, 790, 18); sparkle(c, 960, 770, 14); wideArrow(c, 800, 850, 700, 810);
};
const e1 = (c: Ctx) => {
  ground(c);
  newsStack(c, 170, 560, 280); wideArrow(c, 320, 540, 400, 540);
  pulpBowl(c, 540, 540, 120); wideArrow(c, 690, 540, 760, 540);
  sheetFrame(c, 900, 540, 250, 320);
};
const e2 = (c: Ctx) => {
  ground(c);
  sun(c, 250, 270, 85);
  shadow(c, 270, 800, 230, 50);
  shape(c, () => ell(c, 250, 760, 210, 90), COL.steel); shape(c, () => ell(c, 250, 750, 175, 72), COL.steelIn, 4);
  shape(c, () => ell(c, 250, 752, 150, 58), COL.waterDk, 3); shine(c, [[150, 745], [220, 735]], 8);
  arrow(c, [[500, 700], [610, 700]]);
  shadow(c, 830, 800, 230, 50);
  shape(c, () => ell(c, 830, 760, 210, 90), COL.steel); shape(c, () => ell(c, 830, 750, 175, 72), "#5b5566", 4);
  const r = rnd(3); for (let i = 0; i < 16; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * 130; shape(c, () => { const px = 830 + Math.cos(a) * d, py = 752 + Math.sin(a) * d * 0.4; rrect(c, px - 10, py - 10, 20, 20, 4); }, WHITE, 3); }
  sparkle(c, 960, 640, 22, COL.drop); sparkle(c, 700, 620, 18, COL.drop);
};
const e3 = (c: Ctx) => {
  ground(c);
  const cols: [string, string, string, number][] = [["#f2b705", "#d19a00", "#ffd34d", 190], ["#c2306b", "#9a2253", "#e0527f", 540], ["#c8772e", "#a45c1d", "#e69a4f", 890]];
  cols.forEach(([liq, dk, cl, x]) => { cloth(c, x, 300, 200, 190, cl, dk); katori(c, x, 700, 130, liq); drop(c, x, 520, 22, liq); });
};
const drop = (c: Ctx, x: number, y: number, r: number, col: string) => shape(c, () => { c.moveTo(x, y - r * 1.7); c.quadraticCurveTo(x - r * 1.1, y, x, y + r * 0.9); c.quadraticCurveTo(x + r * 1.1, y, x, y - r * 1.7); c.closePath(); }, col, 4);
const e4 = (c: Ctx) => {
  ground(c);
  glass(c, 170, 760, 190, 300, 0.85, "#efe6cc");
  wideArrow(c, 290, 600, 380, 600);
  bowl(c, 540, 600, 130, "#f1ead8");
  [[500, 595, 34], [560, 600, 30], [530, 625, 28], [590, 590, 24]].forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r * 0.7), WHITE, 4));
  wideArrow(c, 700, 600, 770, 600);
  shadow(c, 900, 770, 150, 30);
  star(c, 900, 600, 130, WHITE);
};
const tileRow = (c: Ctx, xs: number[], y: number, s: number) => xs.forEach((x) => tile(c, x, y, s));
const a1 = (c: Ctx) => {
  ground(c);
  tileRow(c, [150, 540, 930], 540, 270);
  hillMine(c, 150, 630, 210, 200); factory(c, 540, 650, 210, 230); spoon(c, 930, 540, 230, -0.7);
  arrow(c, [[780, 540], [690, 540]]); arrow(c, [[390, 540], [300, 540]]);
};
const a2 = (c: Ctx) => {
  ground(c);
  [190, 540, 890].forEach((x) => { shadow(c, x, 700, 150, 70); shape(c, () => ell(c, x, 660, 150, 100), "#f7f3e8", 5); });
  leaf(c, 140, 650, 100, -0.6); leaf(c, 190, 690, 90, 0.2, COL.greenLt); shape(c, () => ell(c, 235, 640, 24, 24), COL.pink, 5);
  [[490, 650, 40], [560, 690, 32], [585, 640, 24]].forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r * 0.75, 0.3), COL.grey, 5));
  shape(c, () => ell(c, 520, 625, 26, 18, 0.6), "#f4d9c9", 4);
  shape(c, () => ell(c, 850, 650, 34, 34), COL.red, 5); shape(c, () => ell(c, 850, 650, 22, 22), "#b53a28", 3);
  shape(c, () => ell(c, 930, 690, 30, 30), COL.blue, 5); [-8, 8].forEach((d) => shape(c, () => ell(c, 930 + d, 690 + (d > 0 ? 8 : -8), 5, 5), INK, 0));
  brick(c, 900, 625, 90, 50);
  arrow(c, [[190, 460], [190, 540]]); arrow(c, [[540, 460], [540, 540]]); arrow(c, [[890, 460], [890, 540]]);
  tree(c, 190, 440, 190); shape(c, () => ell(c, 540, 350, 60, 40), COL.grey, 5); bucket(c, 890, 440, 150, 150);
};
const speech = (c: Ctx, x: number, y: number, w: number, h: number, tx: number, ty: number) => {
  shape(c, () => polyP(c, [[x - 30, y + h / 2 - 10], [tx, ty], [x + 30, y + h / 2 - 10]]), WHITE, 5);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 60), WHITE, 5);
  c.fillStyle = WHITE; c.fillRect(x - 28, y + h / 2 - 12, 56, 14);
};
const a3 = (c: Ctx) => {
  ground(c);
  speech(c, 280, 280, 380, 340, 270, 500); potClay(c, 280, 420, 300);
  speech(c, 810, 280, 380, 340, 800, 520); bucket(c, 810, 410, 200, 190);
  person(c, 260, 1010, 560, { adult: true }); person(c, 820, 1010, 440);
};
const bead = (c: Ctx, x: number, y: number, col: string) => { shape(c, () => ell(c, x, y, 22, 22), col, 4); };
const beadCol = (i: number) => [COL.black, WHITE, COL.red][i % 3];
const a6 = (c: Ctx) => {
  ground(c);
  const r = rnd(4); for (let i = 0; i < 18; i++) bead(c, 420 + r() * 240, 170 + r() * 110, beadCol(i + (r() > 0.5 ? 1 : 0)));
  arrow(c, [[440, 340], [300, 420]]); arrow(c, [[640, 340], [800, 420]]);
  // spoon from beads
  let n = 0; for (let i = 0; i < 9; i++) bead(c, 130 + i * 20, 940 - i * 52 + 0, beadCol(n++));
  for (let k = 0; k < 14; k++) { const a = (k / 14) * 6.283; bead(c, 360 + Math.cos(a) * 80 - 100, 560 + Math.sin(a) * 100, beadCol(n++)); }
  // bottle from beads
  const bp: number[][] = [[800, 960], [900, 960], [920, 880], [920, 760], [880, 700], [860, 620], [860, 560], [840, 560], [840, 620], [800, 700], [780, 760], [780, 880]];
  for (let i = 0; i < bp.length; i++) { const [x1, y1] = bp[i], [x2, y2] = bp[(i + 1) % bp.length], m = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / 46)); for (let j = 0; j < m; j++) bead(c, x1 + ((x2 - x1) * j) / m, y1 + ((y2 - y1) * j) / m, beadCol(n++)); }
};
const a7 = (c: Ctx) => {
  ground(c);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; line(c, [[180 + Math.cos(a) * 110, 480 + Math.sin(a) * 110], [180 + Math.cos(a) * 160, 480 + Math.sin(a) * 160]], 8, COL.orange); }
  star(c, 180, 480, 100); sparkle(c, 90, 360, 16, COL.orange); sparkle(c, 290, 370, 16, COL.orange);
  arrow(c, [[320, 480], [400, 480]]);
  ob(c, () => ell(c, 540, 480, 120, 120), COL.blue, COL.blueDk, 40);
  shape(c, () => { c.moveTo(480, 420); c.quadraticCurveTo(540, 380, 560, 440); c.quadraticCurveTo(520, 500, 470, 470); c.closePath(); }, COL.green, 4);
  shape(c, () => { c.moveTo(550, 520); c.quadraticCurveTo(610, 500, 630, 550); c.quadraticCurveTo(590, 590, 550, 570); c.closePath(); }, COL.green, 4);
  arrow(c, [[680, 480], [760, 480]]);
  spoon(c, 900, 480, 280, -0.7);
  sparkle(c, 330, 600, 14); sparkle(c, 700, 360, 14, COL.pink);
};
const p1 = (c: Ctx) => {
  ground(c);
  // jar with layers
  const jx = 190, top = 340, bot = 800, w = 190;
  shadow(c, jx + 14, bot + 10, w * 0.6, 18);
  c.save(); c.beginPath(); rrect(c, jx - w / 2, top, w, bot - top, 26); c.clip();
  const L: [number, number, string][] = [[top, 480, "#cfe6f5"], [480, 520, "#b07a52"], [520, 600, "#c9754a"], [600, 700, "#e0c58f"], [700, bot, "#9d958a"]];
  L.forEach(([a, b, col]) => { c.fillStyle = col; c.fillRect(jx - w / 2, a, w, b - a); });
  c.restore();
  shape(c, () => rrect(c, jx - w / 2, top, w, bot - top, 26), "rgba(255,255,255,0.12)", 6);
  shape(c, () => rrect(c, jx - 60, top - 30, 120, 36, 8), COL.steelDk, 5);
  shine(c, [[jx - w * 0.36, top + 40], [jx - w * 0.36, bot - 60]], 8);
  arrow(c, [[330, 600], [420, 600]]);
  shadow(c, 560, 730, 130, 26);
  ob(c, () => { c.moveTo(430, 650); c.quadraticCurveTo(430, 500, 560, 490); c.quadraticCurveTo(690, 500, 690, 650); c.quadraticCurveTo(560, 720, 430, 650); c.closePath(); }, "#b8693e", "#8a4a2c", 30);
  line(c, [[500, 560], [540, 545]], 6, "#d89369");
  arrow(c, [[720, 600], [790, 600]]);
  diya(c, 900, 590, 170);
};
const c1 = (c: Ctx) => {
  ground(c);
  shadow(c, 570, 830, 400, 60);
  const lf = () => { c.moveTo(130, 640); c.bezierCurveTo(200, 400, 880, 400, 950, 640); c.bezierCurveTo(880, 840, 200, 840, 130, 640); c.closePath(); };
  ob(c, lf, COL.leaf, COL.leafDk, 40);
  line(c, [[150, 640], [930, 640]], 8, COL.leafDk);
  for (let i = 0; i < 6; i++) { const x = 250 + i * 110; line(c, [[x, 640], [x + 40, 520 - Math.abs(i - 2.5) * 12]], 4, COL.leafDk); line(c, [[x, 640], [x + 40, 760 + Math.abs(i - 2.5) * 10]], 4, COL.leafDk); }
  [350, 520].forEach((x) => { ob(c, () => { c.moveTo(x - 80, 650); c.quadraticCurveTo(x, 520, x + 80, 650); c.quadraticCurveTo(x, 690, x - 80, 650); c.closePath(); }, WHITE, "#dcd8cc", 24); shape(c, () => ell(c, x - 18, 600, 20, 8, -0.5), "rgba(255,255,255,0)", 0); });
  // dona: leaf cup with sambar
  ob(c, () => { c.moveTo(670, 600); c.quadraticCurveTo(720, 760, 830, 740); c.quadraticCurveTo(900, 700, 880, 600); c.closePath(); }, COL.greenLt, COL.green, 24);
  shape(c, () => ell(c, 775, 610, 105, 30), "#b8601f", 5);
  line(c, [[690, 590], [850, 580]], 8, COL.brown); line(c, [[695, 590], [850, 580]], 3, COL.wood);
  shape(c, () => ell(c, 740, 610, 12, 6), "#e69a4f", 3);
};
const bag = (c: Ctx, x: number, y: number, w: number, h: number, col: string, dk: string, plastic: boolean) => {
  shadow(c, x + w * 0.08, y + 8, w * 0.55, w * 0.07);
  [-0.22, 0.22].forEach((u) => { c.beginPath(); c.arc(x + u * w, y - h, w * 0.14, Math.PI * 0.9, Math.PI * 2.1); c.strokeStyle = INK; c.lineWidth = plastic ? 18 : 24; c.stroke(); c.strokeStyle = plastic ? "#e4efe9" : "#d6b46a"; c.lineWidth = plastic ? 8 : 14; c.stroke(); });
  ob(c, () => polyP(c, plastic ? [[x - w * 0.5, y - h], [x + w * 0.5, y - h], [x + w * 0.45, y], [x - w * 0.45, y]] : [[x - w * 0.5, y - h], [x + w * 0.5, y - h], [x + w * 0.5, y], [x - w * 0.5, y]]), col, dk, w * 0.1);
  if (plastic) { line(c, [[x - w * 0.3, y - h * 0.9], [x - w * 0.2, y - h * 0.1]], 3, WHITE); line(c, [[x + w * 0.2, y - h * 0.9], [x + w * 0.28, y - h * 0.2]], 3, WHITE); shape(c, () => ell(c, x, y - h * 0.5, w * 0.18, w * 0.18), COL.red, 4); }
  else { [0.3, 0.55, 0.8].forEach((v) => line(c, [[x - w * 0.5, y - h * v], [x + w * 0.5, y - h * v]], 6, COL.red)); }
};
const c2 = (c: Ctx) => {
  ground(c);
  bag(c, 220, 820, 280, 400, "#cfe3f5", "#9ec0dc", true);
  arrow(c, [[420, 560], [640, 560]]);
  bag(c, 840, 820, 280, 400, "#f0e2c0", "#d1bd90", false);
};

// ---------------------------------------------------------------- terms
const chair = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + s * 0.1, y + 6, s * 0.4, s * 0.06);
  [-0.28, 0.28].forEach((u) => shape(c, () => rrect(c, x + u * s - s * 0.04, y - s * 0.5, s * 0.08, s * 0.5, 4), COL.woodDk, 5));
  ob(c, () => rrect(c, x - s * 0.36, y - s * 0.58, s * 0.72, s * 0.12, 6), COL.wood, COL.woodDk, s * 0.04);
  shape(c, () => rrect(c, x - s * 0.34, y - s * 1.1, s * 0.07, s * 0.55, 4), COL.woodDk, 5);
  ob(c, () => rrect(c, x - s * 0.36, y - s * 1.1, s * 0.5, s * 0.34, 8), COL.wood, COL.woodDk, s * 0.04);
  [0.2, 0.34].forEach((u) => line(c, [[x - s * 0.3, y - s * (1.1 - u)], [x + s * 0.08, y - s * (1.1 - u)]], 4, COL.woodDk));
};
const kite = (c: Ctx, x: number, y: number, s: number) => {
  ob(c, () => polyP(c, [[x, y - s * 0.5], [x + s * 0.34, y - s * 0.1], [x, y + s * 0.5], [x - s * 0.34, y - s * 0.1]]), COL.red, "#b53a28", s * 0.08);
  shape(c, () => polyP(c, [[x, y - s * 0.5], [x + s * 0.34, y - s * 0.1], [x, y - s * 0.1]]), COL.yellow, 5);
  shape(c, () => polyP(c, [[x, y + s * 0.5], [x - s * 0.34, y - s * 0.1], [x, y - s * 0.1]]), COL.yellow, 5);
  line(c, [[x, y - s * 0.5], [x, y + s * 0.5]], 4); line(c, [[x - s * 0.34, y - s * 0.1], [x + s * 0.34, y - s * 0.1]], 4);
  line(c, [[x, y + s * 0.5], [x + s * 0.1, y + s * 0.65], [x - s * 0.1, y + s * 0.8], [x + s * 0.08, y + s * 0.95]], 5);
  [0.65, 0.82].forEach((v, i) => shape(c, () => polyP(c, [[x + (i ? -0.1 : 0.1) * s, y + s * v], [x + (i ? -0.1 : 0.1) * s + s * 0.1, y + s * v - s * 0.05], [x + (i ? -0.1 : 0.1) * s + s * 0.1, y + s * v + s * 0.05]]), COL.blue, 4));
};
const t0 = (c: Ctx) => { ground(c); tumbler(c, 190, 780, 200, 260, "steel"); chair(c, 540, 780, 380); kite(c, 890, 560, 380); };
const t1 = (c: Ctx) => { ground(c); tumbler(c, 190, 760, 240, 330, "steel"); glass(c, 540, 760, 240, 330, 0, COL.water); tumbler(c, 890, 760, 240, 330, "plastic", COL.teal, COL.tealDk); };
const neemTree = (c: Ctx, x: number, y: number, h: number) => tree(c, x, y, h, "#5a9a4a", "#3b7a33");
const raindrop = (c: Ctx, x: number, y: number, r: number) => drop(c, x, y, r, COL.drop);
const t2 = (c: Ctx) => {
  ground(c, "#e3f1fb");
  sun(c, 900, 170, 70);
  c.fillStyle = COL.greenLt; c.fillRect(0, 800, D, 280); line(c, [[0, 800], [D, 800]], 6);
  neemTree(c, 280, 830, 640);
  ob(c, () => ell(c, 560, 880, 80, 48), COL.grey, COL.greyDk, 24);
  cloud(c, 800, 380, 280);
  [[700, 520], [790, 560], [880, 520], [750, 640], [850, 650]].forEach(([x, y]) => raindrop(c, x, y, 20));
  shape(c, () => ell(c, 840, 880, 60, 14), COL.water, 4);
};
const shelf = (c: Ctx, y: number) => { shape(c, () => rrect(c, 60, y, 960, 40, 8), COL.wood, 6); c.fillStyle = COL.woodDk; c.fillRect(66, y + 24, 948, 10); };
const t3 = (c: Ctx) => {
  ground(c);
  shelf(c, 640); c.save(); c.restore();
  brick(c, 220, 590, 280, 110); bucket(c, 560, 640, 260, 280); spoon(c, 880, 540, 380, -0.9);
};
const claylump = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + s * 0.1, y + s * 0.3, s * 0.6, s * 0.1);
  ob(c, () => { c.moveTo(x - s * 0.5, y + s * 0.25); c.quadraticCurveTo(x - s * 0.6, y - s * 0.3, x - s * 0.1, y - s * 0.35); c.quadraticCurveTo(x + s * 0.5, y - s * 0.4, x + s * 0.55, y + s * 0.2); c.quadraticCurveTo(x, y + s * 0.4, x - s * 0.5, y + s * 0.25); c.closePath(); }, "#b8693e", "#8a4a2c", s * 0.1);
  line(c, [[x - s * 0.25, y - s * 0.15], [x, y - s * 0.22]], 7, "#d89369"); shape(c, () => ell(c, x + s * 0.2, y, s * 0.1, s * 0.07), "#8a4a2c", 3);
};
const t4 = (c: Ctx) => { ground(c); c.fillStyle = COL.soil; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 6); cottonPlant(c, 290, 880, 620); claylump(c, 780, 800, 360); };
const t5 = (c: Ctx) => {
  ground(c);
  sheep(c, 250, 430, 330); arrow(c, [[460, 330], [650, 330]]); woolBall(c, 830, 320, 120);
  waves(c, 250, 800, 330, 80); arrow(c, [[460, 760], [650, 760]]); saltHeap(c, 830, 860, 260, 190);
};
const t6 = (c: Ctx) => {
  ground(c);
  shadow(c, 290, 850, 220, 36);
  ob(c, () => { c.moveTo(100, 840); c.quadraticCurveTo(60, 640, 180, 540); c.quadraticCurveTo(300, 450, 400, 560); c.quadraticCurveTo(500, 700, 460, 840); c.closePath(); }, "#9a4a32", "#6d3222", 40);
  [[200, 640], [300, 580], [350, 720], [210, 760], [400, 650]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 20, 12, 0.5), "#6d3222", 3));
  [[250, 690], [330, 640]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 16, 10, 0.2), "#c0714f", 3));
  arrow(c, [[520, 700], [610, 700]]);
  c.save(); c.translate(830, 620); c.rotate(-0.6);
  shadow(c, 0, 120, 10, 10);
  shape(c, () => polyP(c, [[-30, -220], [30, -220], [40, -190], [-40, -190]]), COL.steel, 6);
  shape(c, () => polyP(c, [[-10, -190], [10, -190], [8, 190], [0, 250], [-8, 190]]), COL.steel, 6);
  shine(c, [[-3, -170], [-2, 150]], 5); c.restore();
};
const t8 = (c: Ctx) => {
  ground(c);
  hand(c, 140, 570, 0, 1.3, SKIN.child, CLOTH.child);
  blob(c, [[350, 570, 70], [400, 530, 60], [410, 600, 62], [340, 620, 50]], WOOLC, WOOLD);
  const pts: number[][] = [[460, 570], [620, 570], [800, 570]];
  line(c, pts, 28, INK); line(c, pts, 20, "#f7f3e8");
  for (let x = 490; x < 790; x += 26) line(c, [[x, 556], [x + 14, 584]], 3, COL.greyDk);
  hand(c, 940, 570, Math.PI, 1.3, SKIN.child, CLOTH.child);
  arrow(c, [[600, 470], [680, 450]]); arrow(c, [[640, 690], [560, 710]]);
};
const t9 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 130, 190, 820, 700, 16), COL.woodDk, 6);
  shape(c, () => rrect(c, 180, 240, 720, 600, 8), "#fff7e8", 4);
  const cell = 90;
  for (let col = 0; col < 7; col++) for (let row = 0; row < 6; row++) {
    const x = 225 + col * cell, y = 260 + row * cell, over = (row + col) % 2 === 0;
    const warp = () => shape(c, () => rrect(c, x + 14, y - 2, cell - 28, cell + 4, 8), COL.yellow, 4);
    const weft = () => shape(c, () => rrect(c, x - 2, y + 14, cell + 4, cell - 28, 8), COL.teal, 4);
    if (over) { warp(); weft(); } else { weft(); warp(); }
  }
  arrow(c, [[150, 920], [880, 920]]);
};
const toothbrush = (c: Ctx, x: number, y: number, len: number, ang: number) => {
  c.save(); c.translate(x, y); c.rotate(ang);
  shape(c, () => polyP(c, [[-len / 2, -16], [len * 0.2, -10], [len * 0.2, 10], [-len / 2, 16]]), COL.blue, 6);
  shape(c, () => rrect(c, len * 0.18, -22, len * 0.3, 44, 14), COL.blue, 6);
  for (let i = 0; i < 6; i++) line(c, [[len * 0.22 + i * len * 0.045, -22], [len * 0.22 + i * len * 0.045, -52]], 8, WHITE);
  c.restore();
};
const pen = (c: Ctx, x: number, y: number, len: number, ang: number) => {
  c.save(); c.translate(x, y); c.rotate(ang);
  shape(c, () => rrect(c, -len / 2, -20, len * 0.8, 40, 12), COL.purple, 6);
  shape(c, () => polyP(c, [[len * 0.3, -20], [len * 0.5, 0], [len * 0.3, 20]]), COL.steel, 6);
  shape(c, () => rrect(c, -len / 2, -20, len * 0.25, 40, 12), COL.yellow, 6);
  c.restore();
};
const t13 = (c: Ctx) => { ground(c); bucket(c, 270, 800, 360, 420); toothbrush(c, 760, 380, 520, 0.3); pen(c, 760, 790, 480, -0.25); };
const coil = (c: Ctx, x: number, y: number, r: number, col: string, hatch: string) => {
  for (let i = 0; i < 3; i++) {
    const yy = y + (2 - i) * 38 - 40;
    c.beginPath(); ell(c, x, yy, r, r * 0.4); c.lineWidth = 62; c.strokeStyle = INK; c.stroke();
    c.beginPath(); ell(c, x, yy, r, r * 0.4); c.lineWidth = 50; c.strokeStyle = col; c.stroke();
    for (let k = 0; k < 20; k++) { const a = (k / 20) * 6.283; const px = x + Math.cos(a) * r, py = yy + Math.sin(a) * r * 0.4; line(c, [[px - 10, py - 18], [px + 10, py + 18]], 4, hatch); }
  }
};
const t14 = (c: Ctx) => { ground(c); coil(c, 280, 640, 150, "#e8705a", "#a8372a"); coil(c, 800, 640, 150, "#f2e6c8", "#a89a78"); };
const t17 = (c: Ctx) => {
  ground(c);
  newsStack(c, 540, 270, 280);
  pulpBowl(c, 830, 760, 120);
  sheetFrame(c, 230, 740, 230, 300);
  arrow(c, [[700, 270], [830, 360], [830, 580]]);
  arrow(c, [[690, 800], [560, 820], [430, 800]]);
  arrow(c, [[230, 550], [260, 420], [380, 300]]);
};
const leafPiece = (c: Ctx, x: number, y: number, s: number, col: string, dk: string, holes: number) => {
  ob(c, () => { c.moveTo(x - s, y); c.quadraticCurveTo(x, y - s * 0.7, x + s, y); c.quadraticCurveTo(x, y + s * 0.7, x - s, y); c.closePath(); }, col, dk, s * 0.14);
  line(c, [[x - s, y], [x + s * 0.9, y]], 4, dk);
  for (let i = 0; i < holes; i++) shape(c, () => ell(c, x - s * 0.4 + i * s * 0.35, y + (i % 2 ? 14 : -14), 10, 8), "#efe4cf", 3);
};
const t22 = (c: Ctx) => {
  ground(c);
  [150, 410, 670, 930].forEach((x, i) => {
    tile(c, x, 520, 235, 420); c.save(); c.beginPath(); rrect(c, x - 117, 310, 235, 420, 28); c.clip(); c.fillStyle = COL.soil; c.fillRect(x - 120, 600, 240, 140); c.restore();
    shape(c, () => rrect(c, x - 117, 310, 235, 420, 28), "rgba(0,0,0,0)", 5);
    line(c, [[x - 117, 600], [x + 117, 600]], 5);
    if (i === 0) leafPiece(c, x, 560, 85, COL.leaf, COL.leafDk, 0);
    if (i === 1) leafPiece(c, x, 560, 80, "#c8a232", "#9a7a1a", 3);
    if (i === 2) { [[-40, 580, 28], [20, 575, 24], [50, 585, 18], [-10, 585, 16]].forEach(([dx, dy, s]) => shape(c, () => ell(c, x + dx, dy, s, s * 0.45, dx * 0.02), "#8a6b2a", 4)); }
    if (i === 3) { line(c, [[x, 600], [x, 540]], 8, INK); line(c, [[x, 600], [x, 540]], 3, COL.greenLt); leaf(c, x, 545, 38, -0.6, COL.greenLt); leaf(c, x, 545, 38, Math.PI + 0.6, COL.greenLt); }
  });
  arrow(c, [[120, 860], [960, 860]]);
};
const cooker = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 860, 360, 50);
  [-1, 1].forEach((s) => ob(c, () => rrect(c, s < 0 ? 100 : 790, 480, 190, 52, 20), COL.black, "#25212a", 14));
  ob(c, () => rrect(c, 230, 520, 620, 340, 40), COL.steel, COL.steelDk, 50);
  shine(c, [[270, 560], [270, 820]], 9);
  ob(c, () => rrect(c, 210, 450, 660, 70, 24), COL.steelIn, COL.steelDk, 24);
  shape(c, () => rrect(c, 215, 505, 650, 30, 12), COL.red, 5);
  ob(c, () => { c.moveTo(250, 450); c.quadraticCurveTo(540, 250, 830, 450); c.closePath(); }, COL.steel, COL.steelDk, 50);
  ob(c, () => rrect(c, 495, 280, 90, 60, 8), COL.black, "#25212a", 12);
  ob(c, () => rrect(c, 425, 380, 230, 40, 20), COL.black, "#25212a", 12);
};
const x5 = (c: Ctx) => {
  ground(c);
  [190, 540, 890].forEach((x) => tile(c, x, 540, 300, 520));
  // paper wasp nest on a twig
  line(c, [[80, 360], [300, 360]], 14, INK); line(c, [[80, 360], [300, 360]], 7, COL.brown);
  line(c, [[190, 360], [190, 410]], 12, INK); line(c, [[190, 360], [190, 410]], 6, COL.brown);
  ob(c, () => { c.moveTo(190, 400); c.bezierCurveTo(90, 430, 90, 640, 190, 700); c.bezierCurveTo(290, 640, 290, 430, 190, 400); c.closePath(); }, "#c9bfa7", "#a39878", 36);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) shape(c, () => ell(c, 150 + k * 40 + (r % 2) * 20 - 10, 680 - r * 5 + 0, 14, 12), "#5d5851", 3);
  [[150, 480], [230, 520], [180, 560]].forEach(([x, y]) => line(c, [[x - 20, y], [x + 20, y + 10]], 4, "#a39878"));
  // cocoon on a leaf
  leaf(c, 420, 760, 220, -0.7, COL.leaf); leaf(c, 660, 760, 220, Math.PI + 0.7, COL.leaf);
  ob(c, () => ell(c, 540, 560, 100, 150, 0.15), WHITE, "#dcd8cc", 40);
  for (let i = 0; i < 6; i++) line(c, [[460 + i * 4, 480 + i * 30], [620 - i * 4, 500 + i * 30]], 3, "#d4cfc0");
  // lac on a twig
  line(c, [[800, 780], [990, 380]], 36, INK); line(c, [[800, 780], [990, 380]], 24, COL.brown);
  [[820, 730], [850, 660], [880, 600], [910, 535], [940, 470], [965, 420]].forEach(([x, y], i) => shape(c, () => ell(c, x, y, 38 - i * 2, 28, -1.1), i % 2 ? "#a2402a" : "#c9573a", 5));
};
const t12 = (c: Ctx) => {
  ground(c, "#efe4cf");
  c.fillStyle = COL.greenLt; c.fillRect(0, 140, D, 70); line(c, [[0, 140], [D, 140]], 6);
  const lay: [number, number, string][] = [[210, 370, "#a98a66"], [370, 560, "#9d958a"], [560, 680, "#c7b58f"], [680, 1080, "#8a7f73"]];
  lay.forEach(([a, b, col]) => { c.fillStyle = col; c.fillRect(0, a, D, b - a); line(c, [[0, a], [D, a]], 5); });
  // dark oil lens
  ob(c, () => { c.moveTo(150, 830); c.quadraticCurveTo(220, 740, 540, 750); c.quadraticCurveTo(880, 740, 940, 830); c.quadraticCurveTo(880, 930, 540, 940); c.quadraticCurveTo(220, 930, 150, 830); c.closePath(); }, COL.black, "#25212a", 40);
  shine(c, [[300, 800], [500, 785]], 9);
  // tiny sea creatures in the rock above
  const fish = (x: number, y: number, s: number) => { shape(c, () => ell(c, x, y, s, s * 0.5), "#e8e0cd", 4); shape(c, () => polyP(c, [[x + s * 0.9, y], [x + s * 1.5, y - s * 0.5], [x + s * 1.5, y + s * 0.5]]), "#e8e0cd", 4); shape(c, () => ell(c, x - s * 0.5, y - s * 0.1, s * 0.1, s * 0.1), INK, 0); };
  const shell = (x: number, y: number, s: number) => { shape(c, () => { c.moveTo(x - s, y + s * 0.5); c.quadraticCurveTo(x, y - s * 1.3, x + s, y + s * 0.5); c.closePath(); }, "#e8e0cd", 4); };
  fish(220, 620, 34); shell(520, 630, 30); fish(800, 615, 30); shell(360, 410, 26); fish(660, 450, 26); shell(900, 430, 24);
  arrow(c, [[540, 700], [540, 760]]);
};

export const ic_materialsWhatIsItMadeOfL3 = cards("sci.materials.what-is-it-made-of.L3 cards", [
  intro, summary, e1, e2, e3, e4, a1, a2, a3, a6, a7, p1, c1, c2,
  t0, t1, t2, t3, t4, t5, t6, t8, t9, t13, t14, t17, t22, cooker, x5, t12,
]);
void D; void rect2;
