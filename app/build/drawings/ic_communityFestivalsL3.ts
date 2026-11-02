import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, rrect, polyP, shadow, shade, line, shine, arrow, plate, bowl, hand, person, write, leaf, cards } from "./flatKit";

// sci.community.festivals.L3 · picture cards (cover, activities, terms, explanations).
const TUR = "#f2b61f", REDL = "#d63a2c", SAFF = "#f39a3c", GREEN = "#3f9a4a", NAVY = "#2f4b9a", BRASS = "#d8a436", BRASSDK = "#a87a1e";
const table = (c: Ctx, y: number) => { shape(c, () => rrect(c, -20, y, 1120, 70, 4), COL.wood, 6); c.fillStyle = COL.woodDk; c.fillRect(-14, y + 44, 1108, 20); line(c, [[-14, y + 64], [1094, y + 64]], 6); };
const drop = (c: Ctx, x: number, y: number, s: number, col: string) => shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 1.1, y - s * 0.2, x + s * 0.8, y + s * 0.3); c.quadraticCurveTo(x, y + s * 1.1, x - s * 0.8, y + s * 0.3); c.quadraticCurveTo(x - s * 1.1, y - s * 0.2, x, y - s * 1.5); c.closePath(); }, col, 4);
const flame = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => { c.moveTo(x, y - s * 1.6); c.quadraticCurveTo(x + s, y - s * 0.4, x, y + s * 0.4); c.quadraticCurveTo(x - s, y - s * 0.4, x, y - s * 1.6); c.closePath(); }, COL.orange, 5); shape(c, () => { c.moveTo(x, y - s * 0.8); c.quadraticCurveTo(x + s * 0.4, y - s * 0.2, x, y + s * 0.2); c.quadraticCurveTo(x - s * 0.4, y - s * 0.2, x, y - s * 0.8); c.closePath(); }, COL.yellow, 0); };
// a brass lamp (diya) with its flame, centre of the base at (x, y), width w
const diya = (c: Ctx, x: number, y: number, w: number) => {
  shadow(c, x + w * 0.1, y + w * 0.12, w * 0.55, w * 0.1);
  const p = () => { c.moveTo(x - w / 2, y - w * 0.22); c.quadraticCurveTo(x - w * 0.45, y + w * 0.14, x, y + w * 0.14); c.quadraticCurveTo(x + w * 0.45, y + w * 0.14, x + w / 2, y - w * 0.22); c.closePath(); };
  shape(c, p, BRASS); shade(c, p, BRASSDK, w * 0.15, 0, 0.6);
  shape(c, () => ell(c, x, y - w * 0.22, w / 2, w * 0.1), "#7a5415", 5);
  flame(c, x, y - w * 0.3, w * 0.2);
};
const wheel = (c: Ctx, x: number, y: number, r: number, ground0 = y + r + 90) => {
  line(c, [[x, y], [x - r * 0.55, ground0]], 14, INK); line(c, [[x, y], [x + r * 0.55, ground0]], 14, INK);
  line(c, [[x, y], [x - r * 0.55, ground0]], 7, COL.steel); line(c, [[x, y], [x + r * 0.55, ground0]], 7, COL.steel);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; line(c, [[x, y], [x + Math.cos(a) * r, y + Math.sin(a) * r]], 5, INK); }
  c.beginPath(); ell(c, x, y, r, r); c.lineWidth = 12; c.strokeStyle = INK; c.stroke(); c.lineWidth = 6; c.strokeStyle = COL.red; c.stroke();
  const cols = [COL.yellow, COL.teal, COL.pink, COL.blue, COL.orange, COL.greenLt, COL.purple, COL.sky];
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + 0.39, cx = x + Math.cos(a) * r, cy = y + Math.sin(a) * r; shape(c, () => rrect(c, cx - r * 0.13, cy - r * 0.05, r * 0.26, r * 0.22, r * 0.05), cols[i], 5); }
  shape(c, () => ell(c, x, y, r * 0.1, r * 0.1), COL.yellow, 5);
};
// a bamboo stall: two posts, a striped cloth roof, a counter; (x, y) = the ground in the middle, w wide
const stall = (c: Ctx, x: number, y: number, w: number, h: number, c1: string = COL.red, c2: string = WHITE) => {
  shadow(c, x + w * 0.05, y + 10, w * 0.6, w * 0.08);
  for (const s of [-1, 1]) { line(c, [[x + s * w * 0.46, y], [x + s * w * 0.46, y - h]], 18, INK); line(c, [[x + s * w * 0.46, y], [x + s * w * 0.46, y - h]], 9, COL.wood); }
  shape(c, () => rrect(c, x - w * 0.48, y - h * 0.42, w * 0.96, h * 0.42, 6), COL.woodDk, 6);
  const n = 6, top = y - h, rh = h * 0.28;
  for (let i = 0; i < n; i++) { const x0 = x - w * 0.56 + (w * 1.12 * i) / n, x1 = x0 + (w * 1.12) / n; shape(c, () => polyP(c, [[x0 + 8 * (i - 2.5) * 0, top], [x1, top], [x1 + (i - 2.5) * 2, top + rh], [x0 + (i - 2.5) * 2, top + rh]]), i % 2 ? c2 : c1, 5); }
};
const calendar = (c: Ctx, x: number, y: number, w: number, h: number, cell: number, circle: string = RED, mark = true) => {
  shadow(c, x + w * 0.5 + 10, y + h + 8, w * 0.55, 12);
  shape(c, () => rrect(c, x, y, w, h, 14), WHITE, 6); shape(c, () => rrect(c, x, y, w, h * 0.2, 14), COL.red, 6); c.fillStyle = COL.red; c.fillRect(x + 3, y + h * 0.12, w - 6, h * 0.08);
  const gw = (w - 30) / 7, gh = (h * 0.8 - 24) / 5;
  for (let r = 0; r < 5; r++) for (let k = 0; k < 7; k++) shape(c, () => rrect(c, x + 15 + k * gw + 4, y + h * 0.2 + 12 + r * gh + 4, gw - 8, gh - 8, 4), "#e4dccb", 0);
  if (mark) { const r = Math.floor(cell / 7), k = cell % 7; c.beginPath(); ell(c, x + 15 + k * gw + gw / 2, y + h * 0.2 + 12 + r * gh + gh / 2, gw * 0.62, gh * 0.58); c.lineWidth = 8; c.strokeStyle = circle; c.stroke(); }
};
const flag = (c: Ctx, x: number, y: number, w: number) => {
  const h = w * 0.66, b = h / 3;
  shape(c, () => rrect(c, x, y, w, h, 3), WHITE, 6); shape(c, () => rect4(c, x, y, w, b), SAFF, 5); shape(c, () => rect4(c, x, y + 2 * b, w, b), GREEN, 5); shape(c, () => rect4(c, x, y, w, h), "rgba(0,0,0,0)", 6);
  const cx = x + w / 2, cy = y + h / 2, r = b * 0.4;
  c.beginPath(); ell(c, cx, cy, r, r); c.lineWidth = 4; c.strokeStyle = NAVY; c.stroke();
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[cx, cy], [cx + Math.cos(a) * r, cy + Math.sin(a) * r]], 3, NAVY); }
};
const rect4 = (c: Ctx, x: number, y: number, w: number, h: number) => { c.rect(x, y, w, h); };
// a clay pot of pongal boiling over: (x, y) = the base in the middle
const pongalPot = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + s * 12, y + 6, s * 120, s * 18);
  const p = () => { c.moveTo(x - s * 70, y); c.bezierCurveTo(x - s * 150, y - s * 20, x - s * 150, y - s * 190, x - s * 80, y - s * 205); c.lineTo(x + s * 80, y - s * 205); c.bezierCurveTo(x + s * 150, y - s * 190, x + s * 150, y - s * 20, x + s * 70, y); c.closePath(); };
  shape(c, p, "#c8643a"); shade(c, p, "#9a4524", s * 40, 0, 0.5);
  line(c, [[x - s * 118, y - s * 90], [x + s * 118, y - s * 90]], 8, "#fff3d8");
  shape(c, () => { c.moveTo(x - s * 95, y - s * 200); c.bezierCurveTo(x - s * 125, y - s * 260, x - s * 60, y - s * 290, x - s * 25, y - s * 255); c.bezierCurveTo(x, y - s * 300, x + s * 70, y - s * 290, x + s * 90, y - s * 245); c.bezierCurveTo(x + s * 130, y - s * 240, x + s * 120, y - s * 195, x + s * 95, y - s * 195); c.closePath(); }, WHITE, 5);
  shape(c, () => ell(c, x + s * 120, y - s * 150, s * 18, s * 34), WHITE, 4);
  shape(c, () => ell(c, x - s * 125, y - s * 120, s * 16, s * 28), WHITE, 4);
};
const book = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 14, y + h / 2 + 18, w * 0.52, 30);
  shape(c, () => polyP(c, [[x - w / 2 - 14, y - h / 2 + 14], [x + w / 2 + 14, y - h / 2 + 14], [x + w / 2 + 14, y + h / 2 + 14], [x - w / 2 - 14, y + h / 2 + 14]]), COL.red, 6);
  shape(c, () => polyP(c, [[x - w / 2, y - h / 2], [x, y - h / 2 + 24], [x, y + h / 2 + 24], [x - w / 2, y + h / 2]]), "#fff3d8", 6);
  shape(c, () => polyP(c, [[x + w / 2, y - h / 2], [x, y - h / 2 + 24], [x, y + h / 2 + 24], [x + w / 2, y + h / 2]]), "#fff3d8", 6);
  line(c, [[x, y - h / 2 + 24], [x, y + h / 2 + 24]], 6);
};
const pencil = (c: Ctx, x0: number, y0: number, x1: number, y1: number) => {
  const an = Math.atan2(y1 - y0, x1 - x0); line(c, [[x0, y0], [x1, y1]], 30, INK); line(c, [[x0, y0], [x1, y1]], 18, COL.yellow);
  const tx = x1 + Math.cos(an) * 34, ty = y1 + Math.sin(an) * 34; shape(c, () => polyP(c, [[x1 - Math.sin(an) * 15, y1 + Math.cos(an) * 15], [tx, ty], [x1 + Math.sin(an) * 15, y1 - Math.cos(an) * 15]]), "#f2d9b0", 5);
  shape(c, () => ell(c, x1 + Math.cos(an) * 27, y1 + Math.sin(an) * 27, 5, 5), INK, 0);
};
const kolam = (c: Ctx, x: number, y: number, s: number, col: string = WHITE) => {
  c.strokeStyle = col; c.lineWidth = Math.max(5, s * 0.05);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; c.beginPath(); ell(c, x + Math.cos(a) * s * 0.5, y + Math.sin(a) * s * 0.5, s * 0.5, s * 0.5); c.stroke(); }
  c.beginPath(); ell(c, x, y, s * 0.16, s * 0.16); c.stroke();
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; c.beginPath(); ell(c, x + Math.cos(a) * s * 1.25, y + Math.sin(a) * s * 1.25, s * 0.04, s * 0.04); c.fillStyle = col; c.fill(); }
};
const ant = (c: Ctx, x: number, y: number, s: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  for (const k of [-1, 0, 1]) for (const sd of [-1, 1]) line(c, [[k * 26, 0], [k * 26 + 10, sd * 26], [k * 26 - 6, sd * 44]], 5, INK);
  line(c, [[48, -4], [66, -26], [84, -22]], 4, INK); line(c, [[48, 4], [66, 26], [84, 22]], 4, INK);
  shape(c, () => ell(c, -50, 0, 34, 24), "#5a2d1c", 5); shape(c, () => ell(c, 0, 0, 22, 17), "#5a2d1c", 5); shape(c, () => ell(c, 44, 0, 20, 17), "#5a2d1c", 5);
  shape(c, () => ell(c, 52, -6, 4, 4), WHITE, 0);
  c.restore();
};
const fan = (c: Ctx, x: number, y: number) => {
  shadow(c, x, y + 10, 100, 16);
  line(c, [[x - 30, y], [x - 30, y - 130]], 30, INK); line(c, [[x - 30, y], [x - 30, y - 130]], 18, COL.steel);
  shape(c, () => rrect(c, x - 100, y - 20, 140, 24, 8), COL.steelDk, 5);
  shape(c, () => rrect(c, x - 90, y - 250, 120, 100, 20), COL.teal, 6);
  shape(c, () => ell(c, x + 50, y - 200, 36, 150), COL.glass, 6);
  for (const a of [-1.2, 0, 1.2]) shape(c, () => ell(c, x + 50, y - 200 + a * 60, 14, 46), COL.paper, 4);
};

// ---- the picture cards, in order
// intro: the same turmeric is yellow in one bowl and red in another
const intro = (c: Ctx) => {
  ground(c);
  plate(c, 540, 330, 220, 80);
  shape(c, () => { c.moveTo(430, 330); c.quadraticCurveTo(540, 150, 650, 330); c.quadraticCurveTo(540, 370, 430, 330); c.closePath(); }, TUR, 6);
  shade(c, () => { c.moveTo(430, 330); c.quadraticCurveTo(540, 150, 650, 330); c.quadraticCurveTo(540, 370, 430, 330); c.closePath(); }, "#d89a10", 40, 0, 0.5);
  bowl(c, 230, 720, 190, TUR); bowl(c, 850, 720, 190, REDL);
  arrow(c, [[440, 400], [300, 500]]); arrow(c, [[640, 400], [780, 500]]);
  drop(c, 850, 520, 22, WHITE);
};
// summary: aarathi plate in front of a busy mela
const summary = (c: Ctx) => {
  ground(c, "#cfe6f5");
  c.fillStyle = COL.greenLt; c.fillRect(0, 560, D, 520); line(c, [[0, 560], [D, 560]], 6);
  wheel(c, 540, 300, 190, 560);
  stall(c, 150, 600, 250, 190, COL.red, WHITE); stall(c, 930, 600, 250, 190, COL.teal, WHITE);
  plate(c, 540, 830, 360, 120);
  shape(c, () => ell(c, 500, 826, 250, 78), REDL, 5); c.beginPath(); ell(c, 420, 808, 90, 12); c.fillStyle = "rgba(255,255,255,0.4)"; c.fill();
  diya(c, 740, 800, 120);
};
// flow.e1: some bowls turn red, some stay yellow
const flowE1 = (c: Ctx) => {
  ground(c); table(c, 780);
  const xs = [170, 400, 640, 870], cl = [TUR, REDL, TUR, REDL];
  xs.forEach((x, i) => { bowl(c, x, 640, 105, cl[i]); });
  const x1 = 640; line(c, [[x1 - 120, 220], [x1 - 30, 340]], 26, INK); line(c, [[x1 - 120, 220], [x1 - 30, 340]], 14, COL.steel);
  shape(c, () => ell(c, x1 - 8, 372, 52, 34, 0.9), COL.steel, 6); shape(c, () => ell(c, x1 - 8, 372, 38, 22, 0.9), WHITE, 3);
  drop(c, x1 + 10, 470, 16, WHITE); drop(c, x1 + 14, 540, 16, WHITE);
  hand(c, x1 - 220, 150, 0.8, 1.6, SKIN.child, CLOTH.child);
};
// flow.e3: look up a festival's date on the phone calendar and on a printed one
const flowE3 = (c: Ctx) => {
  ground(c);
  calendar(c, 70, 180, 480, 520, 16);
  shape(c, () => rrect(c, 640, 150, 300, 560, 36), COL.black, 6);
  shape(c, () => rrect(c, 658, 190, 264, 480, 8), WHITE, 3);
  for (let r = 0; r < 6; r++) for (let k = 0; k < 7; k++) shape(c, () => rrect(c, 664 + k * 36, 260 + r * 56, 30, 44, 4), "#e4dccb", 0);
  shape(c, () => rrect(c, 658, 190, 264, 54, 8), COL.teal, 3);
  c.beginPath(); ell(c, 664 + 3 * 36 + 15, 260 + 2 * 56 + 22, 24, 30); c.lineWidth = 7; c.strokeStyle = RED; c.stroke();
};
// a1: turmeric yellow before, red after the soap
const a1 = (c: Ctx) => {
  ground(c); table(c, 800);
  bowl(c, 240, 650, 200, TUR); bowl(c, 820, 650, 200, REDL);
  arrow(c, [[460, 560], [600, 560]]);
  line(c, [[780, 150], [790, 300]], 26, INK); line(c, [[780, 150], [790, 300]], 14, COL.steel);
  shape(c, () => ell(c, 794, 332, 52, 34, 1.5), COL.steel, 6); shape(c, () => ell(c, 794, 332, 38, 22, 1.5), WHITE, 3);
  drop(c, 800, 440, 18, WHITE);
};
// a2: a paper map of a mela
const a2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 900, 440, 36);
  shape(c, () => rrect(c, 100, 110, 880, 780, 14), WHITE, 6);
  c.setLineDash([22, 18]); line(c, [[200, 520], [500, 470], [700, 560], [860, 450]], 8, COL.orange); c.setLineDash([]);
  c.beginPath(); ell(c, 300, 300, 100, 100); c.lineWidth = 8; c.strokeStyle = INK; c.stroke();
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; line(c, [[300, 300], [300 + Math.cos(a) * 100, 300 + Math.sin(a) * 100]], 5, INK); }
  const cl = [COL.red, COL.teal, COL.yellow, COL.pink, COL.blue, COL.orange];
  cl.forEach((col, i) => shape(c, () => rrect(c, 470 + (i % 3) * 140, 190 + Math.floor(i / 3) * 130, 100, 80, 8), col, 6));
  [[260, 680], [420, 700], [600, 700], [780, 690]].forEach(([x, y], i) => { shape(c, () => ell(c, x, y - 28, 22, 22), SKIN.child, 5); shape(c, () => rrect(c, x - 22, y, 44, 56, 14), [COL.blue, COL.pink, COL.teal, COL.orange][i], 5); });
  pencil(c, 980, 960, 760, 800);
};
// a3: a rice-flour kolam and the ants that come for it
const a3 = (c: Ctx) => {
  ground(c, "#8a7a6e");
  for (let i = 0; i < 40; i++) { const r = rnd(i + 3); const x = r() * D, y = r() * D; c.beginPath(); ell(c, x, y, 6 + r() * 12, 4 + r() * 8); c.fillStyle = "rgba(60,50,45,0.25)"; c.fill(); }
  kolam(c, 380, 520, 270);
  ant(c, 760, 330, 1.5, 2.9); ant(c, 840, 600, 1.5, 3.3); ant(c, 640, 810, 1.5, 3.9); ant(c, 500, 480, 1.3, 2.2);
  arrow(c, [[960, 220], [830, 280]]);
};
// a4: aarathi water: turmeric turns red where lime touches
const a4 = (c: Ctx) => {
  ground(c);
  plate(c, 280, 780, 220, 90); plate(c, 800, 780, 220, 90);
  shape(c, () => ell(c, 280, 776, 150, 52), TUR, 4); shape(c, () => ell(c, 800, 776, 150, 52), REDL, 4);
  hand(c, 190, 230, 1.0, 1.7, SKIN.adult, CLOTH.adult);
  line(c, [[250, 330], [275, 640]], 18, INK); line(c, [[250, 330], [275, 640]], 9, COL.wood);
  shape(c, () => ell(c, 277, 652, 20, 20), WHITE, 5);
  arrow(c, [[430, 560], [650, 560]]);
};
// a5: three marks on a timeline
const spinner = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - s * 0.6, y + s * 0.5, s * 1.2, s * 0.3, 8), COL.wood, 6);
  line(c, [[x, y + s * 0.5], [x, y]], 10, INK);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; line(c, [[x, y], [x + Math.cos(a) * s * 0.5, y + Math.sin(a) * s * 0.5]], 4, INK); }
  c.beginPath(); ell(c, x, y, s * 0.5, s * 0.5); c.lineWidth = 8; c.strokeStyle = INK; c.stroke(); c.lineWidth = 3; c.strokeStyle = COL.wood; c.stroke();
};
const a5 = (c: Ctx) => {
  ground(c);
  line(c, [[60, 640], [1020, 640]], 20, INK); line(c, [[60, 640], [1020, 640]], 10, COL.wood);
  [[190, "1869"], [540, "1947"], [890, "1950"]].forEach(([x, t], i) => {
    const xx = x as number; shape(c, () => ell(c, xx, 640, 24, 24), COL.red, 6); line(c, [[xx, 616], [xx, 520]], 6);
    if (i === 0) spinner(c, xx, 340, 170); if (i === 1) flag(c, xx - 110, 230, 220);
    if (i === 2) { book(c, xx, 340, 220, 190); }
    write(c, t as string, xx - 112, 730, 80, INK, 9);
  });
};
// p1: the family festival book
const p1 = (c: Ctx) => {
  ground(c);
  book(c, 480, 480, 800, 560);
  pongalPot(c, 290, 640, 1.2);
  kolam(c, 690, 500, 150, COL.red);
  pencil(c, 1000, 960, 800, 800);
};
// c1: a model stall and a fan blowing at it
const c1 = (c: Ctx) => {
  ground(c); table(c, 800);
  stall(c, 700, 790, 360, 420, COL.teal, WHITE);
  fan(c, 170, 790);
  arrow(c, [[300, 520], [440, 520]]); arrow(c, [[300, 640], [440, 640]]);
};
// c2: a secret greeting appears in red under turmeric water
const c2 = (c: Ctx) => {
  ground(c);
  shadow(c, 520, 760, 380, 30);
  shape(c, () => rrect(c, 140, 130, 760, 620, 12), "#fff6dc", 6);
  const pts: number[][] = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 100 : 230; pts.push([520 + Math.cos(a) * r, 440 + Math.sin(a) * r]); }
  c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath(); c.lineWidth = 24; c.lineJoin = "round"; c.strokeStyle = REDL; c.stroke();
  line(c, [[900, 980], [570, 560]], 36, INK); line(c, [[900, 980], [570, 560]], 22, COL.wood);
  shape(c, () => ell(c, 556, 538, 26, 44, 0.65), TUR, 6);
  bowl(c, 220, 880, 170, TUR);
};

// ---- terms
const leafMat = (c: Ctx, x: number, y: number, w: number, h: number) => { const p = () => rrect(c, x - w / 2, y - h / 2, w, h, h * 0.4); shape(c, p, "#58a14a"); shade(c, p, "#3b7a33", 0, h * 0.2, 0.5); line(c, [[x - w / 2 + 14, y], [x + w / 2 - 14, y]], 3, "#3b7a33"); };
const ricePile = (c: Ctx, x: number, y: number, r: number) => shape(c, () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r, y - r * 1.4, x + r, y - r * 1.4, x + r, y); c.quadraticCurveTo(x, y + r * 0.35, x - r, y); c.closePath(); }, WHITE, 5);
const dot = (c: Ctx, x: number, y: number, r: number, col: string) => shape(c, () => ell(c, x, y, r, r), col, 4);
const term0 = (c: Ctx) => {
  ground(c, "#e9d8b8");
  flame(c, 540, 150, 40); shape(c, () => ell(c, 540, 175, 60, 14), BRASS, 5);
  person(c, 300, 690, 560, { sit: true, adult: true, armL: [1.2, 1.4], armR: [0.9, 1.2] }); person(c, 780, 690, 460, { sit: true, armL: [1.2, 1.4], armR: [0.9, 1.2] });
  leafMat(c, 300, 790, 400, 130); leafMat(c, 780, 790, 400, 130);
  [300, 780].forEach((x) => { ricePile(c, x - 60, 790, 55); dot(c, x + 40, 780, 22, COL.orange); dot(c, x + 100, 800, 20, COL.greenLt); dot(c, x + 20, 815, 18, COL.yellow); dot(c, x + 135, 770, 18, COL.red); });
  leafMat(c, 540, 960, 700, 110); ricePile(c, 340, 960, 50); [450, 540, 630, 720].forEach((x, i) => dot(c, x, 962, 24, [COL.orange, COL.greenLt, COL.yellow, COL.red][i]));
};
const term1 = (c: Ctx) => {
  ground(c, "#26305a");
  const r = rnd(5); for (let i = 0; i < 40; i++) dot(c, r() * D, r() * 420, 3, "#fff3a8");
  c.fillStyle = "#3f3a5a"; c.fillRect(0, 700, D, 380); line(c, [[0, 700], [D, 700]], 6);
  for (let i = 0; i < 12; i++) { const x = i * 100; shape(c, () => polyP(c, [[x + 10, 70], [x + 90, 70], [x + 50, 150]]), [COL.red, COL.yellow, COL.teal, COL.pink][i % 4], 4); }
  line(c, [[0, 70], [D, 70]], 6);
  wheel(c, 540, 400, 230, 700);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; dot(c, 540 + Math.cos(a) * 230, 400 + Math.sin(a) * 230, 14, "#fff3a8"); }
  stall(c, 150, 760, 250, 190, COL.red, WHITE); stall(c, 930, 760, 250, 190, COL.teal, WHITE);
  const cl = [COL.orange, COL.pink, COL.blue, COL.greenLt, COL.yellow, COL.purple, COL.red];
  for (let i = 0; i < 7; i++) { const x = 90 + i * 150, y = 970; shape(c, () => rrect(c, x - 40, y - 20, 80, 130, 36), cl[i], 5); shape(c, () => ell(c, x, y - 55, 38, 40), i % 2 ? SKIN.adult : SKIN.child, 5); shape(c, () => ell(c, x, y - 75, 38, 24), CLOTH.hair, 4); }
};
const term2 = (c: Ctx) => {
  ground(c, "#cfe6f5");
  c.fillStyle = COL.greenLt; c.fillRect(0, 780, D, 300); line(c, [[0, 780], [D, 780]], 6);
  stall(c, 540, 820, 760, 620, COL.red, "#ffe8b0");
  const cl = [COL.pink, COL.teal, COL.yellow, COL.purple, COL.orange, COL.blue];
  for (let k = 0; k < 6; k++) { const x = 250 + k * 116; line(c, [[x, 330], [x, 330 + 4 * 62]], 4); for (let i = 0; i < 4; i++) { c.beginPath(); ell(c, x, 372 + i * 62, 38, 26); c.lineWidth = 12; c.strokeStyle = INK; c.stroke(); c.lineWidth = 6; c.strokeStyle = cl[(k + i) % 6]; c.stroke(); } }
};
const term3 = (c: Ctx) => {
  ground(c, "#8a7a6e");
  kolam(c, 400, 600, 200); kolam(c, 800, 780, 90);
  hand(c, 230, 220, 1.17, 1.9, SKIN.adult, CLOTH.adult); hand(c, 850, 440, 1.6, 1.5, SKIN.child, CLOTH.child);
};
const term5 = (c: Ctx) => {
  ground(c, "#cfe6f5");
  c.fillStyle = COL.greenLt; c.fillRect(0, 800, D, 280); line(c, [[0, 800], [D, 800]], 6);
  line(c, [[130, 70], [130, 960]], 22, INK); line(c, [[130, 70], [130, 960]], 11, COL.steel); dot(c, 130, 60, 22, BRASS);
  flag(c, 142, 100, 470);
  person(c, 560, 990, 480, { armR: [-0.7, -2.5] }); person(c, 800, 990, 430, { armR: [-0.7, -2.5], adult: true }); person(c, 980, 990, 380, { armR: [-0.7, -2.5] });
};
const term6 = (c: Ctx) => {
  ground(c);
  book(c, 540, 480, 840, 620);
  const pg = (x: number) => { shape(c, () => rrect(c, x, 230, 340, 440, 6), "rgba(0,0,0,0)", 0); c.lineWidth = 8; c.strokeStyle = BRASS; c.strokeRect(x, 250, 340, 420); c.lineWidth = 3; c.strokeStyle = REDL; c.strokeRect(x + 16, 266, 308, 388); for (let i = 0; i < 6; i++) line(c, [[x + 50, 360 + i * 46], [x + 290, 360 + i * 46]], 6, "#b9b4ab"); for (const [fx, fy] of [[x, 250], [x + 340, 250], [x, 670], [x + 340, 670]]) { dot(c, fx, fy, 18, REDL); dot(c, fx, fy, 8, BRASS); } dot(c, x + 170, 310, 16, SAFF); };
  pg(180); pg(560);
};
const term7 = (c: Ctx) => {
  ground(c, "#26305a");
  const r = rnd(2); for (let i = 0; i < 40; i++) dot(c, r() * D, r() * D, 3, "#fff3a8");
  c.beginPath(); c.ellipse(540, 540, 400, 330, 0, 0, Math.PI * 2); c.lineWidth = 10; c.setLineDash([6, 22]); c.strokeStyle = "#fff3a8"; c.stroke(); c.setLineDash([]);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2 + 0.2; dot(c, 540 + Math.cos(a) * 400, 540 + Math.sin(a) * 330, 16, i === 0 ? COL.orange : "#fff3a8"); }
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[540 + Math.cos(a) * 150, 540 + Math.sin(a) * 150], [540 + Math.cos(a) * 200, 540 + Math.sin(a) * 200]], 14, INK); line(c, [[540 + Math.cos(a) * 150, 540 + Math.sin(a) * 150], [540 + Math.cos(a) * 200, 540 + Math.sin(a) * 200]], 7, COL.orange); }
  dot(c, 540, 540, 130, COL.yellow); shade(c, () => ell(c, 540, 540, 130, 130), COL.orange, 30, 20, 0.5);
  earth(c, 940, 400, 72);
  arrow(c, [[860, 250], [960, 330]]);
};
const earth = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.blue); c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); shape(c, () => ell(c, x - r * 0.3, y - r * 0.2, r * 0.45, r * 0.38), COL.green, 4); shape(c, () => ell(c, x + r * 0.4, y + r * 0.35, r * 0.4, r * 0.28), COL.green, 4); c.restore(); c.beginPath(); ell(c, x, y, r, r); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); };
const moon = (c: Ctx, x: number, y: number, r: number, p: number, wane = false) => {
  c.save(); c.translate(x, y); if (wane) c.scale(-1, 1);
  shape(c, () => ell(c, 0, 0, r, r), "#4a5380", 0);
  const rx = Math.abs(Math.cos(p * Math.PI * 2)) * r; c.beginPath(); c.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false); c.ellipse(0, 0, rx, r, 0, Math.PI / 2, -Math.PI / 2, p < 0.25); c.closePath(); c.fillStyle = "#fff3a8"; c.fill();
  c.beginPath(); ell(c, 0, 0, r, r); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); c.restore();
};
const term8 = (c: Ctx) => {
  ground(c, "#26305a");
  const r = rnd(8); for (let i = 0; i < 50; i++) dot(c, r() * D, r() * D, 3, "#fff3a8");
  const ph = [0.08, 0.25, 0.4, 0.5, 0.4, 0.25, 0.08]; ph.forEach((p, i) => moon(c, 90 + i * 150, 540 + Math.abs(i - 3) * 55 - 60, 62, p, i > 3));
  arrow(c, [[150, 380], [540, 280], [930, 380]], "#fff3a8", 10);
};
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  shape(c, () => rrect(c, x - w * 0.16, y - h - 30, w * 0.32, 50, 6), COL.red, 5);
  shape(c, () => rrect(c, x - w * 0.16, y - h * 0.95, w * 0.32, h * 0.4, 6), "#e8f3ea", 5);
  const p = () => rrect(c, x - w * 0.5, y - h * 0.65, w, h * 0.65, w * 0.2); shape(c, p, "#e8f3ea", 6); shade(c, p, "rgba(43,35,64,0.5)", w * 0.15, 0, 0.25);
  shape(c, () => rrect(c, x - w * 0.34, y - h * 0.5, w * 0.68, h * 0.36, 6), col, 4);
};
const lemonFace = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6); shape(c, () => ell(c, x, y, r * 0.86, r * 0.86), "#fff3a8", 4);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.1, y + Math.sin(a) * r * 0.1], [x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8]], 4, COL.orange); }
};
const term9 = (c: Ctx) => {
  ground(c); table(c, 760);
  lemonFace(c, 210, 590, 140);
  bowl(c, 540, 640, 200, "#7a3f1f");
  for (const [x, y, an] of [[470, 640, 0.3], [560, 625, -0.4], [610, 655, 0.8]]) shape(c, () => ell(c, x, y, 52, 20, an), "#a8723f", 5);
  bottle(c, 870, 740, 190, 420, "#a8323a");
};
const soapBar = (c: Ctx, x: number, y: number, w: number) => { const h = w * 0.55, p = () => rrect(c, x - w / 2, y - h / 2, w, h, h * 0.35); shadow(c, x + w * 0.1, y + h * 0.5, w * 0.55, h * 0.16); shape(c, p, "#f6c3d4"); shade(c, p, "#e59ab5", w * 0.08, h * 0.12, 0.6); shine(c, [[x - w * 0.35, y - h * 0.15], [x - w * 0.1, y - h * 0.25]], 8); };
const term10 = (c: Ctx) => {
  ground(c); table(c, 760);
  soapBar(c, 220, 680, 300);
  const tin = () => rrect(c, 430, 440, 230, 310, 14); shadow(c, 560, 756, 140, 20); shape(c, tin, COL.sky); shade(c, tin, COL.blueDk, 40, 0, 0.35);
  shape(c, () => rrect(c, 420, 410, 250, 50, 12), WHITE, 6); shape(c, () => ell(c, 545, 580, 70, 70), WHITE, 5); line(c, [[510, 580], [580, 580]], 8, COL.blue);
  shadow(c, 860, 756, 130, 18);
  shape(c, () => rrect(c, 740, 640, 240, 110, 12), COL.wood, 6); shape(c, () => ell(c, 860, 640, 110, 22), "#5a3b22", 5); shape(c, () => { c.moveTo(780, 640); c.quadraticCurveTo(860, 570, 940, 640); c.quadraticCurveTo(860, 665, 780, 640); c.closePath(); }, WHITE, 5);
};
const term11 = (c: Ctx) => {
  ground(c);
  const sh = () => polyP(c, [[330, 120], [450, 150], [540, 190], [630, 150], [750, 120], [940, 330], [830, 400], [770, 330], [770, 960], [310, 960], [310, 330], [250, 400], [140, 330]]);
  shadow(c, 560, 970, 300, 22); shape(c, sh, "#f3efe6"); shade(c, sh, "#dcd5c5", 40, 0, 0.5);
  shape(c, () => ell(c, 540, 175, 90, 36), "#dcd5c5", 5);
  const st = () => { c.moveTo(380, 450); c.quadraticCurveTo(440, 380, 520, 430); c.quadraticCurveTo(620, 440, 640, 540); c.quadraticCurveTo(650, 650, 540, 650); c.quadraticCurveTo(430, 700, 380, 600); c.quadraticCurveTo(340, 520, 380, 450); c.closePath(); };
  shape(c, st, TUR, 5);
  c.save(); c.beginPath(); st(); c.clip(); shape(c, () => ell(c, 570, 540, 85, 100), REDL, 0); c.restore();
  c.beginPath(); st(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  for (const [x, y, r] of [[560, 520, 22], [600, 580, 18], [540, 590, 14], [585, 470, 16], [620, 520, 12]]) { shape(c, () => ell(c, x, y, r, r), WHITE, 3); }
};
const term12 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 830, 380, 40);
  shape(c, () => ell(c, 250, 380, 90, 250, 0.35), BRASS, 6); shape(c, () => ell(c, 250, 380, 60, 215, 0.35), BRASSDK, 0);
  const base = () => { c.moveTo(210, 520); c.lineTo(210, 720); c.quadraticCurveTo(560, 830, 910, 720); c.lineTo(910, 520); c.closePath(); };
  shape(c, base, BRASS); shade(c, base, BRASSDK, 80, 0, 0.5);
  shape(c, () => ell(c, 560, 520, 350, 95), "#5a3b22", 6);
  shape(c, () => { c.moveTo(390, 525); c.bezierCurveTo(420, 420, 700, 420, 730, 525); c.quadraticCurveTo(560, 570, 390, 525); c.closePath(); }, WHITE, 5);
  leaf(c, 930, 780, 150, -0.6, COL.leaf);
};
const term14 = (c: Ctx) => {
  ground(c, "#cfe6f5");
  c.fillStyle = COL.greenLt; c.fillRect(0, 800, D, 280); line(c, [[0, 800], [D, 800]], 6);
  stall(c, 760, 860, 520, 560, COL.blueDk, WHITE);
  shape(c, () => ell(c, 760, 560, 90, 90), WHITE, 6); shape(c, () => ell(c, 760, 535, 22, 22), COL.red, 4); shape(c, () => rrect(c, 735, 560, 50, 70, 20), COL.red, 4);
  person(c, 330, 990, 700, { adult: true, armR: [0.8, 0.4], armL: [1.4, 1.5] });
  dot(c, 350, 520, 34, RED); line(c, [[350, 500], [350, 540]], 6, WHITE); line(c, [[330, 520], [370, 520]], 6, WHITE);
  person(c, 560, 990, 360, { armL: [1.4, 1.5] });
};

// ---- explanations
const kadai = (c: Ctx, x: number, y: number, r: number) => {
  line(c, [[x - r * 0.6, y + r * 0.3], [x - r * 0.9, y + r * 0.8]], 8); line(c, [[x + r * 0.6, y + r * 0.3], [x + r * 0.9, y + r * 0.8]], 8);
  flame(c, x - r * 0.3, y + r * 0.45, r * 0.18); flame(c, x + r * 0.3, y + r * 0.45, r * 0.18);
  const p = () => { c.moveTo(x - r, y - r * 0.1); c.bezierCurveTo(x - r * 0.9, y + r * 0.6, x + r * 0.9, y + r * 0.6, x + r, y - r * 0.1); c.closePath(); };
  shape(c, p, COL.black); shape(c, () => ell(c, x, y - r * 0.1, r, r * 0.22), "#e0a020", 5);
  for (const k of [-0.5, 0, 0.5]) shape(c, () => ell(c, x + r * k, y - r * 0.1, r * 0.22, r * 0.1), "#c8832a", 3);
};
const expl0 = (c: Ctx) => {
  ground(c, "#cfe6f5");
  c.fillStyle = COL.greenLt; c.fillRect(0, 640, D, 440); line(c, [[0, 640], [D, 640]], 6);
  wheel(c, 200, 290, 150, 640);
  stall(c, 560, 690, 280, 230, COL.orange, WHITE);
  for (let i = 0; i < 3; i++) { const x = 480 + i * 80, y = 600; const p = () => { c.moveTo(x - 24, y - 30); c.bezierCurveTo(x - 50, y - 10, x - 40, y + 14, x - 20, y + 14); c.lineTo(x + 20, y + 14); c.bezierCurveTo(x + 40, y + 14, x + 50, y - 10, x + 24, y - 30); c.closePath(); }; shape(c, p, "#c8643a", 5); }
  stall(c, 880, 690, 260, 230, COL.teal, WHITE);
  shape(c, () => rrect(c, 70, 740, 250, 260, 10), COL.blue, 6); shape(c, () => rrect(c, 50, 710, 290, 50, 10), COL.blueDk, 6); shape(c, () => rrect(c, 120, 800, 150, 90, 6), COL.sky, 5); shape(c, () => ell(c, 195, 770, 18, 18), COL.yellow, 3);
  shape(c, () => rrect(c, 400, 780, 220, 220, 10), COL.paper, 6); shape(c, () => rrect(c, 380, 750, 260, 46, 10), COL.red, 6); shape(c, () => ell(c, 510, 880, 50, 50), COL.blue, 5); shape(c, () => ell(c, 510, 858, 14, 14), WHITE, 0); shape(c, () => rrect(c, 494, 872, 32, 40, 12), WHITE, 0);
  person(c, 830, 1000, 360, { adult: true, armL: [0.6, 0.3], armR: [0.5, 0.2] });
  kadai(c, 960, 900, 90);
};
const mini = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => shape(c, () => rrect(c, x, y, w, h, 24), col, 6);
const expl1 = (c: Ctx) => {
  ground(c);
  mini(c, 40, 40, 490, 490, "#ffe8c0"); mini(c, 550, 40, 490, 490, "#e4f2d8"); mini(c, 40, 550, 490, 490, "#fff0ba"); mini(c, 550, 550, 490, 490, "#f6dce4");
  pongalPot(c, 285, 470, 1.15);
  leafMat(c, 800, 330, 400, 190); ricePile(c, 730, 320, 70); [[850, 300, COL.orange], [900, 350, COL.greenLt], [840, 365, COL.yellow], [925, 290, COL.red]].forEach(([x, y, col]) => dot(c, x as number, y as number, 24, col as string));
  bowl(c, 285, 800, 170, "#fff3a8"); for (const [x, y, col] of [[230, 800, COL.greenLt], [300, 790, COL.red], [340, 820, "#8a5a3c"], [260, 835, WHITE], [310, 850, COL.yellow]]) dot(c, x as number, y as number, 14, col as string);
  bowl(c, 800, 790, 175, "#f7ead0"); const r = rnd(4); for (let i = 0; i < 22; i++) { const x = 700 + r() * 200, y = 770 + r() * 40; line(c, [[x, y], [x + 24, y + 8 - r() * 20]], 5, "#d8a436"); } for (const [x, y] of [[740, 800], [820, 780], [870, 805]]) dot(c, x, y, 12, "#8a4a2a");
};
const map = (c: Ctx, x0: number, y0: number, w: number, h: number) => {
  const P = [[30, 26], [36, 16], [42, 6], [50, 3], [56, 10], [54, 18], [62, 22], [70, 26], [78, 28], [88, 30], [97, 32], [94, 38], [86, 38], [80, 36], [74, 40], [66, 36], [60, 40], [66, 46], [60, 52], [56, 60], [52, 72], [48, 84], [44, 96], [40, 84], [36, 72], [30, 60], [24, 50], [16, 44], [18, 38], [24, 34], [20, 30]];
  shape(c, () => polyP(c, P.map(([u, v]) => [x0 + (u / 100) * w, y0 + (v / 100) * h])), "#ffe8b0", 7);
};
const expl2 = (c: Ctx) => {
  ground(c);
  map(c, 260, 130, 560, 760);
  const at = (u: number, v: number) => [260 + (u / 100) * 560, 130 + (v / 100) * 760];
  const spot = (u: number, v: number, ix: number, iy: number, draw: (x: number, y: number) => void) => { const [px, py] = at(u, v); line(c, [[px, py], [ix, iy]], 6); shape(c, () => ell(c, ix, iy, 100, 100), WHITE, 6); dot(c, px, py, 14, RED); draw(ix, iy); };
  spot(42, 14, 140, 210, (x, y) => { line(c, [[x - 50, y + 55], [x + 40, y + 20]], 14, "#8a5a3c"); line(c, [[x - 40, y + 20], [x + 50, y + 55]], 14, "#8a5a3c"); flame(c, x, y + 20, 34); });
  spot(22, 42, 140, 520, (x, y) => { shape(c, () => polyP(c, [[x, y - 70], [x + 50, y - 5], [x, y + 45], [x - 50, y - 5]]), COL.pink, 5); line(c, [[x - 50, y - 5], [x + 50, y - 5]], 4); line(c, [[x, y - 70], [x, y + 45]], 4); line(c, [[x, y + 45], [x + 25, y + 75], [x - 10, y + 90]], 5, INK); });
  spot(34, 66, 140, 830, (x, y) => { plate(c, x, y + 10, 80, 38); for (const [dx, dy] of [[-30, -4], [0, -14], [30, -2], [-12, 14], [18, 14]]) shape(c, () => rrect(c, x + dx - 14, y + dy - 6, 26, 24, 4), dx % 2 ? "#fff3d8" : "#8a5a3c", 4); });
  spot(88, 33, 940, 330, (x, y) => { plate(c, x, y + 20, 80, 36); shape(c, () => ell(c, x, y - 4, 56, 40), "#fff3d8", 5); line(c, [[x - 40, y - 4], [x + 40, y - 4]], 4, "#d8a436"); });
  spot(48, 82, 940, 760, (x, y) => pongalPot(c, x, y + 55, 0.3));
};
const expl3 = (c: Ctx) => {
  ground(c);
  dot(c, 540, 100, 55, COL.yellow); for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; line(c, [[540 + Math.cos(a) * 70, 100 + Math.sin(a) * 70], [540 + Math.cos(a) * 95, 100 + Math.sin(a) * 95]], 10, COL.orange); }
  [40, 400, 760].forEach((x) => calendar(c, x, 190, 280, 250, 13));
  moon(c, 540, 560, 55, 0.25);
  [[40, 4], [400, 17], [760, 23]].forEach(([x, k]) => calendar(c, x, 650, 280, 250, k));
};
const chariot = (c: Ctx, x: number, y: number) => {
  shadow(c, x, y + 10, 230, 20);
  shape(c, () => rrect(c, x - 200, y - 190, 400, 70, 8), COL.wood, 6);
  const canopy = () => polyP(c, [[x - 160, y - 190], [x + 160, y - 190], [x + 110, y - 330], [x, y - 480], [x - 110, y - 330]]);
  shape(c, canopy, COL.red); shade(c, canopy, "#a8321f", 60, 0, 0.5);
  for (let i = 0; i < 4; i++) line(c, [[x - 130 + i * 90, y - 190], [x - 130 + i * 90 + 8, y - 325]], 5, "#ffd34d");
  line(c, [[x, y - 480], [x, y - 560]], 8); shape(c, () => polyP(c, [[x, y - 560], [x + 70, y - 540], [x, y - 520]]), SAFF, 5);
  for (const wx of [x - 120, x + 120]) { c.beginPath(); ell(c, wx, y - 60, 80, 80); c.lineWidth = 14; c.strokeStyle = INK; c.stroke(); c.lineWidth = 6; c.strokeStyle = COL.woodDk; c.stroke(); for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; line(c, [[wx, y - 60], [wx + Math.cos(a) * 80, y - 60 + Math.sin(a) * 80]], 5, INK); } dot(c, wx, y - 60, 14, COL.woodDk); }
};
const expl7 = (c: Ctx) => {
  ground(c, "#cfe6f5");
  c.fillStyle = "#c9b99a"; c.fillRect(0, 760, D, 320); line(c, [[0, 760], [D, 760]], 6);
  chariot(c, 800, 840);
  line(c, [[690, 712], [40, 712]], 14, INK); line(c, [[690, 712], [40, 712]], 8, "#d8a436");
  [[80, 300, false], [230, 330, true], [380, 270, false], [530, 330, true]].forEach(([x, h, ad]) => person(c, x as number, 678 + 0.74 * (h as number), h as number, { armL: [0.3, 0.1], armR: [0.3, 0.1], adult: !!ad }));
};

const L = [intro, summary, flowE1, flowE3, a1, a2, a3, a4, a5, p1, c1, c2, term0, term1, term2, term3, term5, term6, term7, term8, term9, term10, term11, term12, term14, expl0, expl1, expl2, expl3, expl7];
export const ic_communityFestivalsL3 = cards("sci.community.festivals.L3 cards", L);
