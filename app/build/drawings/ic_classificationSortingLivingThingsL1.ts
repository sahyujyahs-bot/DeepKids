import type { Ctx } from "./core";
import { D, INK, RED, WHITE, COL, SKIN, CLOTH, ground, shape, ell, rrect, shadow, shade, line, arrow, plate, hand, person, cards } from "./flatKit";

// SORTING LIVING THINGS L1 · leaves to compare and sort, a family standing on a towel, a book of groups,
// a crow with its features marked, and a crow and hen together in one group.

// a leaf with a stalk and a mid vein; wd = half-width as a fraction of length, rounder when round is set
const lf = (c: Ctx, x: number, y: number, len: number, an: number, col: string, wd = 0.3, dk = COL.leafDk, lw = 6) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len, nx = -Math.sin(an) * len * wd, ny = Math.cos(an) * len * wd, mx = (x + tx) / 2, my = (y + ty) / 2;
  const sx = x - Math.cos(an) * len * 0.18, sy = y - Math.sin(an) * len * 0.18;
  line(c, [[sx, sy], [x, y]], 9, INK); line(c, [[sx, sy], [x, y]], 4, dk);
  const path = () => { c.moveTo(x, y); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, x, y); c.closePath(); };
  shape(c, path, col, lw);
  shade(c, path, dk, len * 0.12, len * 0.08, 0.35);
  line(c, [[x, y], [mx + (tx - mx) * 0.7, my + (ty - my) * 0.7]], 4, dk);
};
// a money-plant leaf: heart shape hanging from its stalk at (x, y), pointing down, size s
const heart = (c: Ctx, x: number, y: number, s: number) => {
  line(c, [[x, y - s * 0.5], [x, y]], 9, INK); line(c, [[x, y - s * 0.5], [x, y]], 4, COL.leafDk);
  const path = () => { c.moveTo(x, y + s * 0.1); c.bezierCurveTo(x - s * 0.1, y - s * 0.35, x - s * 0.95, y - s * 0.2, x - s * 0.75, y + s * 0.35); c.bezierCurveTo(x - s * 0.55, y + s * 0.85, x - s * 0.1, y + s * 1.05, x, y + s * 1.3); c.bezierCurveTo(x + s * 0.1, y + s * 1.05, x + s * 0.55, y + s * 0.85, x + s * 0.75, y + s * 0.35); c.bezierCurveTo(x + s * 0.95, y - s * 0.2, x + s * 0.1, y - s * 0.35, x, y + s * 0.1); c.closePath(); };
  shape(c, path, COL.green, 6);
  shade(c, path, COL.greenDk, s * 0.15, s * 0.1, 0.35);
  line(c, [[x, y + s * 0.1], [x, y + s * 1.1]], 4, COL.greenDk);
};
// a white sheet of paper
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 14, y + h / 2 + 18, w / 2, h / 2); shape(c, () => rrect(c, x, y, w, h, 10), WHITE, 6); };
// a bird standing with its feet at (x, y), facing right; kind: crow (black), pigeon (grey), hen (brown with a comb)
const bird = (c: Ctx, x: number, y: number, s: number, kind: "crow" | "pigeon" | "hen") => {
  const col = kind === "crow" ? COL.black : kind === "pigeon" ? COL.grey : COL.brown, dk = kind === "crow" ? "#1f1b26" : kind === "pigeon" ? COL.greyDk : COL.soilDk, legc = kind === "hen" ? COL.orange : "#4a4350";
  shadow(c, x + 10 * s, y + 6 * s, 110 * s, 16 * s);
  for (const k of [-1, 1]) { line(c, [[x + k * 18 * s, y - 70 * s], [x + k * 22 * s, y]], 11 * s, INK); line(c, [[x + k * 18 * s, y - 70 * s], [x + k * 22 * s, y]], 5 * s, legc); line(c, [[x + k * 22 * s - 18 * s, y], [x + k * 22 * s + 18 * s, y]], 8 * s, INK); }
  // tail
  shape(c, () => { c.moveTo(x - 60 * s, y - 100 * s); c.lineTo(x - 150 * s, y - (kind === "hen" ? 190 : 125) * s); c.lineTo(x - 130 * s, y - 70 * s); c.closePath(); }, col, 6);
  // body
  const body = () => ell(c, x, y - 105 * s, 100 * s, 62 * s, -0.25);
  shape(c, body, col, 6);
  shade(c, body, dk, 22 * s, 14 * s, 0.45);
  // wing
  shape(c, () => { c.moveTo(x - 40 * s, y - 135 * s); c.quadraticCurveTo(x + 60 * s, y - 165 * s, x + 50 * s, y - 115 * s); c.quadraticCurveTo(x + 10 * s, y - 70 * s, x - 70 * s, y - 95 * s); c.closePath(); }, dk, 5);
  // neck and head
  shape(c, () => ell(c, x + 95 * s, y - 165 * s, 40 * s, 36 * s), col, 6);
  if (kind === "hen") { for (let i = 0; i < 3; i++) shape(c, () => ell(c, x + (78 + i * 16) * s, y - 205 * s, 11 * s, 14 * s), COL.red, 4); shape(c, () => ell(c, x + 118 * s, y - 135 * s, 8 * s, 14 * s), COL.red, 4); }
  shape(c, () => { c.moveTo(x + 128 * s, y - 175 * s); c.lineTo(x + 175 * s, y - 160 * s); c.lineTo(x + 128 * s, y - 150 * s); c.closePath(); }, kind === "crow" ? "#4a4350" : COL.yellow, 5);
  shape(c, () => ell(c, x + 105 * s, y - 175 * s, 8 * s, 8 * s), WHITE, 3);
  shape(c, () => ell(c, x + 107 * s, y - 175 * s, 3.5 * s, 3.5 * s), INK, 0);
};
// a butterfly, body centre (x, y)
const butterfly = (c: Ctx, x: number, y: number, s: number) => {
  for (const k of [-1, 1]) { shape(c, () => ell(c, x + k * 42 * s, y - 22 * s, 42 * s, 34 * s, k * 0.4), COL.orange, 5); shape(c, () => ell(c, x + k * 34 * s, y + 26 * s, 30 * s, 26 * s, -k * 0.3), COL.yellow, 5); shape(c, () => ell(c, x + k * 42 * s, y - 22 * s, 12 * s, 10 * s), INK, 0); }
  shape(c, () => rrect(c, x - 8 * s, y - 40 * s, 16 * s, 90 * s, 8 * s), INK, 0);
  line(c, [[x - 4 * s, y - 40 * s], [x - 22 * s, y - 70 * s]], 3, INK); line(c, [[x + 4 * s, y - 40 * s], [x + 22 * s, y - 70 * s]], 3, INK);
};
// a card with a drawing of an animal on it, centre (x, y)
const animalCard = (c: Ctx, x: number, y: number, w: number, kind: "crow" | "hen") => {
  const h = w * 1.25;
  shadow(c, x + 10, y + h / 2 + 8, w / 2, 10);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 10), WHITE, 6);
  bird(c, x - w * 0.02, y + h * 0.32, w / 420, kind);
};
// the curry sprig: a stalk with pairs of pointed leaflets
const sprig = (c: Ctx, x0: number, y0: number, x1: number, y1: number, n: number, len: number) => {
  line(c, [[x0, y0], [x1, y1]], 10, INK); line(c, [[x0, y0], [x1, y1]], 5, COL.leafDk);
  const an = Math.atan2(y1 - y0, x1 - x0);
  for (let i = 0; i < n; i++) { const t = (i + 0.7) / (n + 0.2), x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; for (const k of [-1, 1]) { const px = x - Math.cos(an) * len * 0.15, py = y - Math.sin(an) * len * 0.15; lf(c, px, py, len, an + k * 1.05, COL.leaf, 0.3, COL.leafDk, 5); } }
};

// 1. curry sprig on a plate, the child's finger on two look-alike leaves
const s0 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 580, 430, 230);
  sprig(c, 190, 690, 820, 480, 4, 150);
  c.beginPath(); ell(c, 548, 608, 125, 100); c.strokeStyle = RED; c.lineWidth = 9; c.stroke();
  hand(c, 840, 860, -2.35, 1.7, SKIN.child, CLOTH.child, true);
};
// 2. one leaf laid exactly on another, the bottom leaf's tip peeping out
const s1 = (c: Ctx) => {
  ground(c);
  paper(c, 170, 110, 740, 860);
  lf(c, 380, 820, 580, -1.15, COL.leafDk, 0.36, "#2f6329");
  lf(c, 380, 820, 500, -1.15, COL.leaf, 0.28);
  arrow(c, [[860, 230], [640, 300]]);
};
// 3. two pencil outlines, the tips circled
const s2 = (c: Ctx) => {
  ground(c);
  paper(c, 120, 110, 840, 860);
  const outline = (x: number, y: number, len: number, an: number) => { const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len, nx = -Math.sin(an) * len * 0.3, ny = Math.cos(an) * len * 0.3, mx = (x + tx) / 2, my = (y + ty) / 2; shape(c, () => { c.moveTo(x, y); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, x, y); c.closePath(); }, WHITE, 0); c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, x, y); c.closePath(); c.strokeStyle = COL.greyDk; c.lineWidth = 5; c.stroke(); line(c, [[x, y], [tx, ty]], 4, COL.greyDk); };
  outline(330, 820, 580, -Math.PI / 2);
  outline(690, 820, 520, -Math.PI / 2);
  c.beginPath(); ell(c, 510, 270, 300, 120); c.strokeStyle = RED; c.lineWidth = 9; c.stroke();
  // a pencil at the bottom
  c.save(); c.translate(0, -40);
  shadow(c, 560, 1010, 300, 14);
  shape(c, () => rrect(c, 300, 970, 520, 46, 8), COL.yellow, 6);
  shape(c, () => { c.moveTo(820, 970); c.lineTo(890, 993); c.lineTo(820, 1016); c.closePath(); }, COL.wood, 6);
  shape(c, () => { c.moveTo(866, 985); c.lineTo(890, 993); c.lineTo(866, 1001); c.closePath(); }, INK, 0);
  shape(c, () => rrect(c, 290, 968, 40, 50, 8), COL.pink, 6);
  c.restore();
};
// 4. a curry leaf, a palak leaf and a money plant leaf in a row: all have a stalk and a vein
const s3 = (c: Ctx) => {
  ground(c);
  lf(c, 170, 760, 420, -Math.PI / 2, COL.leaf, 0.26);
  lf(c, 540, 760, 460, -Math.PI / 2, COL.green, 0.42, COL.greenDk);
  heart(c, 900, 300, 220);
};
// flow.a2: the parent and the girl stand on a towel holding a crow card and a hen card
const fA2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6dbc4"; c.fillRect(0, 760, D, D - 760);
  line(c, [[0, 760], [D, 760]], 5, INK);
  shape(c, () => rrect(c, 90, 790, 900, 180, 20), COL.teal, 6);
  for (let i = 0; i < 5; i++) { c.fillStyle = COL.tealDk; c.fillRect(100, 820 + i * 34, 880, 10); }
  person(c, 360, 900, 640, { adult: true, armL: [Math.PI * 0.6, Math.PI * 0.5], armR: [Math.PI * 0.4, -0.3] });
  person(c, 750, 900, 460, { armL: [Math.PI * 0.6, Math.PI * 0.5], armR: [Math.PI * 0.4, -0.3] });
  animalCard(c, 605, 520, 170, "crow");
  animalCard(c, 920, 625, 140, "hen");
};
// flow.p1: the book of groups, open: a wing page with a crow, a pigeon and a butterfly; a legs page waiting
const fP1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 960, 470, 30);
  shape(c, () => rrect(c, 90, 150, 450, 790, 10), WHITE, 6);
  shape(c, () => rrect(c, 540, 150, 450, 790, 10), WHITE, 6);
  line(c, [[540, 150], [540, 940]], 6, INK);
  // wing at the top of the left page
  shape(c, () => { c.moveTo(170, 300); c.quadraticCurveTo(250, 170, 460, 200); c.quadraticCurveTo(400, 250, 350, 300); c.quadraticCurveTo(260, 330, 170, 300); c.closePath(); }, COL.sky, 6);
  line(c, [[240, 298], [330, 230]], 4, COL.blueDk); line(c, [[300, 302], [400, 240]], 4, COL.blueDk);
  line(c, [[140, 350], [490, 350]], 4, COL.greyDk);
  bird(c, 300, 560, 0.72, "crow");
  bird(c, 300, 740, 0.62, "pigeon");
  butterfly(c, 320, 860, 0.8);
  // two legs at the top of the right page
  for (const k of [-1, 1]) { line(c, [[770 + k * 45, 190], [770 + k * 50, 310]], 20, INK); line(c, [[770 + k * 45, 190], [770 + k * 50, 310]], 10, SKIN.child); line(c, [[770 + k * 50 - 22, 310], [770 + k * 50 + 22, 310]], 12, INK); }
  line(c, [[590, 350], [940, 350]], 4, COL.greyDk);
  for (let i = 0; i < 4; i++) line(c, [[600, 470 + i * 110], [930, 470 + i * 110]], 3, "#d9d3c7");
};
// term.2 Feature: one crow, with its wing, legs and beak marked
const tFeature = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6dbc4"; c.fillRect(0, 800, D, D - 800);
  line(c, [[0, 800], [D, 800]], 5, INK);
  bird(c, 480, 800, 2.3, "crow");
  arrow(c, [[150, 300], [330, 480]]);
  arrow(c, [[200, 960], [410, 790]]);
  arrow(c, [[960, 380], [860, 430]]);
};
// term.1 Group: a crow and a hen stand together inside one ring: things put together
const tGroup = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6dbc4"; c.fillRect(0, 760, D, D - 760);
  line(c, [[0, 760], [D, 760]], 5, INK);
  c.beginPath(); ell(c, 540, 700, 470, 190); c.strokeStyle = RED; c.lineWidth = 12; c.setLineDash([40, 26]); c.stroke(); c.setLineDash([]);
  bird(c, 270, 760, 1.4, "crow");
  bird(c, 770, 770, 1.4, "hen");
};

export const ic_classificationSortingLivingThingsL1 = cards("sci.classification.sorting-living-things.L1", [s0, s1, s2, s3, fA2, fP1, tFeature, tGroup]);
