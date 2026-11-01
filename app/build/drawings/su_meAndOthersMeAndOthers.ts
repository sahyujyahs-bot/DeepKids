import type { Ctx } from "./core";
import { cards, COL, INK, BG, WHITE, RED, SKIN, CLOTH, D, shape, ell, rrect, polyP, shadow, shade, line, shine, arrow, hand } from "./flatKit";

const WALL = "#cfe6df";
const TABLE = COL.wood;

// a steel tumbler standing at (x, y), half-width w/2 at the top
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.15, y + 6, w * 0.62, w * 0.12);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
  shape(c, body, COL.steel, 6);
  shade(c, body, COL.steelDk, w * 0.3, 0);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.09), COL.steelIn, 5);
  shine(c, [[x - w * 0.3, y - h * 0.85], [x - w * 0.24, y - h * 0.15]], 9);
};
// a banana lying at (x, y), length about 2*r
const banana = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 0.55, r * 0.95, r * 0.14);
  const b = () => { c.moveTo(x - r, y - r * 0.35); c.quadraticCurveTo(x, y + r * 1.0, x + r, y - r * 0.4); c.quadraticCurveTo(x, y + r * 0.05, x - r, y - r * 0.35); c.closePath(); };
  shape(c, b, COL.yellow, 6);
  shade(c, b, COL.orange, 0, r * 0.12, 0.45);
  shape(c, () => ell(c, x - r, y - r * 0.38, r * 0.06, r * 0.06), COL.soilDk, 4);
  shape(c, () => ell(c, x + r, y - r * 0.42, r * 0.07, r * 0.07), COL.soilDk, 4);
};
// a lime sitting at (x, y) (its bottom)
const lime = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.2, y + 4, r * 0.9, r * 0.16);
  const b = () => ell(c, x, y - r, r * 1.05, r);
  shape(c, b, COL.green, 6);
  shade(c, b, COL.greenDk, r * 0.3, r * 0.2);
  shape(c, () => ell(c, x, y - r * 2, r * 0.12, r * 0.08), COL.greenDk, 4);
  shine(c, [[x - r * 0.6, y - r * 1.5], [x - r * 0.3, y - r * 1.8]], 8);
};
// the view from the child's chair: the lime hidden behind the tumbler. (x, y) is the middle of the table front
const viewChild = (c: Ctx, x: number, y: number, k: number) => {
  c.save(); c.translate(x, y); c.scale(k, k);
  lime(c, 85, -30, 85);
  tumbler(c, 0, 0, 200, 480);
  banana(c, -250, 50, 150);
  c.restore();
};
// the view from the opposite chair: the lime in front, the tumbler behind it, the banana at the back
const viewOpposite = (c: Ctx, x: number, y: number, k: number) => {
  c.save(); c.translate(x, y); c.scale(k, k);
  banana(c, 260, -60, 150);
  tumbler(c, 0, -20, 200, 480);
  lime(c, -10, 60, 85);
  c.restore();
};
// the same view as a pencil sketch on paper
const sketch = (c: Ctx, x: number, y: number, k: number) => {
  c.save(); c.translate(x, y); c.scale(k, k);
  const g = COL.black, w = 14;
  line(c, [[-100, -480], [-80, -20], [80, -20], [100, -480]], w, g);
  c.beginPath(); ell(c, 0, -480, 100, 18); c.strokeStyle = g; c.lineWidth = w; c.stroke();
  c.beginPath(); ell(c, 0, 0, 95, 85); c.fillStyle = COL.paper; c.fill(); c.strokeStyle = g; c.stroke();
  c.beginPath(); c.moveTo(130, -190); c.quadraticCurveTo(260, -10, 390, -190); c.quadraticCurveTo(260, -110, 130, -190); c.stroke();
  c.restore();
};
const tableTop = (c: Ctx, y: number) => {
  c.fillStyle = WALL; c.fillRect(0, 0, D, D);
  c.fillStyle = TABLE; c.fillRect(0, y, D, D - y);
  c.fillStyle = COL.woodDk; c.fillRect(0, y, D, 14);
  line(c, [[0, y], [D, y]], 6);
};
const pencil = (c: Ctx, tipx: number, tipy: number, tailx: number, taily: number) => {
  line(c, [[tipx, tipy], [tailx, taily]], 34, INK); line(c, [[tipx, tipy], [tailx, taily]], 22, COL.yellow);
  const dx = tailx - tipx, dy = taily - tipy, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l;
  line(c, [[tipx, tipy], [tipx + ux * 55, tipy + uy * 55]], 34, INK); line(c, [[tipx, tipy], [tipx + ux * 55, tipy + uy * 55]], 22, COL.wood);
  line(c, [[tipx, tipy], [tipx + ux * 14, tipy + uy * 14]], 14, COL.black);
};
const sleeve = (c: Ctx, x: number, y0: number, y1: number, w: number, col: string = CLOTH.child) => {
  shape(c, () => rrect(c, x - w / 2, y0, w, y1 - y0, 14), col, 6);
};
const clock = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), WHITE, r * 0.1);
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78], [x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9]], r * 0.06); }
  line(c, [[x, y], [x + r * 0.35, y - r * 0.45]], r * 0.1); line(c, [[x, y], [x - r * 0.05, y - r * 0.72]], r * 0.07); shape(c, () => ell(c, x, y, r * 0.08, r * 0.08), RED, 0);
};
// a postcard with a coin-sized hole at (hx, hy); centre (x, y), size w x h
const postcard = (c: Ctx, x: number, y: number, w: number, h: number, hx: number, hy: number, hr: number) => {
  const holed = () => { rrect(c, x - w / 2, y - h / 2, w, h, 12); c.moveTo(hx + hr, hy); ell(c, hx, hy, hr, hr); };
  c.save(); c.translate(w * 0.03, h * 0.04); c.globalAlpha = 0.16; c.fillStyle = INK; c.beginPath(); holed(); c.fill("evenodd"); c.restore(); c.globalAlpha = 1;
  c.beginPath(); holed();
  c.fillStyle = COL.paper; c.fill("evenodd"); c.lineWidth = 6; c.strokeStyle = INK; c.lineJoin = "round"; c.stroke();
  shape(c, () => rrect(c, x + w / 2 - w * 0.17, y - h / 2 + h * 0.07, w * 0.1, h * 0.14, 4), COL.orange, 4);
  line(c, [[x - w / 2 + w * 0.05, y + h / 2 - h * 0.1], [x - w / 2 + w * 0.3, y + h / 2 - h * 0.1]], 5, COL.grey);
  line(c, [[x + w / 2 - w * 0.3, y + h / 2 - h * 0.1], [x + w / 2 - w * 0.05, y + h / 2 - h * 0.1]], 5, COL.grey);
};
const eyeOpen = (c: Ctx, x: number, y: number, w: number) => {
  shape(c, () => { c.moveTo(x - w / 2, y); c.quadraticCurveTo(x, y - w * 0.5, x + w / 2, y); c.quadraticCurveTo(x, y + w * 0.5, x - w / 2, y); c.closePath(); }, WHITE, 6);
  shape(c, () => ell(c, x, y, w * 0.2, w * 0.2), COL.blueDk, 5);
  shape(c, () => ell(c, x, y, w * 0.09, w * 0.09), INK, 0);
};
const eyeShut = (c: Ctx, x: number, y: number, w: number) => {
  c.beginPath(); c.moveTo(x - w / 2, y - w * 0.05); c.quadraticCurveTo(x, y + w * 0.35, x + w / 2, y - w * 0.05); c.strokeStyle = INK; c.lineWidth = 9; c.lineCap = "round"; c.stroke();
  for (const u of [-0.3, 0, 0.3]) line(c, [[x + u * w, y + w * (0.08 - Math.abs(u) * 0.2)], [x + u * w * 1.1, y + w * 0.3]], 6);
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  tableTop(c, 560);
  viewChild(c, 540, 880, 1);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  tableTop(c, 400);
  viewChild(c, 540, 585, 0.65);
  c.save(); c.translate(560, 800); c.rotate(-0.04);
  shape(c, () => polyP(c, [[-380, -130], [380, -130], [330, 250], [-330, 250]].map(([a, b]) => [a, b])), WHITE, 6);
  c.restore();
  sketch(c, 380, 1010, 0.6);
  pencil(c, 700, 950, 800, 660);
  hand(c, 920, 790, Math.PI, 2.2, SKIN.child, CLOTH.child);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  c.fillStyle = WALL; c.fillRect(0, 0, D, D);
  // the phone, held up, its screen showing the table seen from the opposite chair
  shape(c, () => rrect(c, 70, 60, 440, 800, 40), INK, 6);
  shape(c, () => rrect(c, 90, 90, 400, 740, 24), COL.paper, 0);
  c.save(); c.beginPath(); rrect(c, 90, 90, 400, 740, 24); c.clip();
  c.fillStyle = TABLE; c.fillRect(90, 520, 400, 320); c.fillStyle = WALL; c.fillRect(90, 90, 400, 430);
  viewOpposite(c, 270, 700, 0.5);
  c.restore();
  sleeve(c, 290, 1000, 1100, 158, CLOTH.adult);
  hand(c, 290, 1000, -Math.PI / 2, 2.2, SKIN.adult, CLOTH.adult);
  // the child's drawing next to it
  shape(c, () => polyP(c, [[580, 250], [1030, 250], [1030, 830], [580, 830]]), WHITE, 6);
  sketch(c, 800, 700, 0.5);
  // equals: the drawing should match the photo
  line(c, [[530, 440], [570, 440]], 12, RED); line(c, [[530, 490], [570, 490]], 12, RED);
};
// setup.e2.0
const e2_0 = (c: Ctx) => {
  c.fillStyle = WALL; c.fillRect(0, 0, D, D);
  eyeOpen(c, 440, 110, 150); eyeOpen(c, 640, 110, 150);
  c.setLineDash([16, 16]); line(c, [[440, 160], [510, 355]], 5, COL.greyDk); line(c, [[640, 160], [570, 355]], 5, COL.greyDk); c.setLineDash([]);
  clock(c, 540, 470, 95);
  sleeve(c, 540, 840, 1100, 158);
  postcard(c, 540, 480, 700, 480, 540, 470, 135);
  hand(c, 540, 840, -Math.PI / 2, 2.2, SKIN.child, CLOTH.child);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  c.fillStyle = BG; c.fillRect(0, 0, D, D);
  const panel = (px: number, jump: boolean, shutLeft: boolean) => {
    c.save(); c.beginPath(); rrect(c, px - 250, 250, 500, 800, 24); c.clip();
    c.fillStyle = WALL; c.fillRect(px - 250, 250, 500, 800);
    clock(c, px + (jump ? 120 : 0), 520, 62);
    sleeve(c, px, 850, 1100, 115);
    postcard(c, px, 560, 430, 300, px, 520, 90);
    hand(c, px, 850, -Math.PI / 2, 1.6, SKIN.child, CLOTH.child);
    c.restore();
    c.beginPath(); rrect(c, px - 250, 250, 500, 800, 24); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
    (shutLeft ? eyeShut : eyeOpen)(c, px - 85, 150, 130); (shutLeft ? eyeOpen : eyeShut)(c, px + 85, 150, 130);
  };
  panel(285, false, true);
  panel(795, true, false);
  c.save(); c.beginPath(); rrect(c, 545, 250, 500, 800, 24); c.clip(); arrow(c, [[735, 625], [875, 625]]); c.restore();
};

export const su_meAndOthersMeAndOthers = cards("sci.me-and-others.me-and-others.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1]);
