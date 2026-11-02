import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, glass, hand, person, write, cards } from "./flatKit";

// ELEMENTS L2 · set-up cards: dark silver that shines again on foil, dull brass rubbed with tamarind,
// an element hunt on a tray, dot pictures, the pencil mystery, an ornament survey, an element book.

const SILV = { dk: "#5f5a66", dkDk: "#3f3a48", br: "#e8edf3", brDk: "#aeb8c6" };
const BRASS = { dull: "#9a6a3a", dullDk: "#6e4a24", br: "#f2c14a", brDk: "#cf9a2e" };
const COPPER = "#c47a3a", GRAPH = "#6e6f78";

// an anklet lying flat: a ring of beads, pick(angle) gives [colour, dark] for each bead
const anklet = (c: Ctx, x: number, y: number, rx: number, ry: number, pick: (a: number) => [string, string], n = 24) => {
  shadow(c, x + 10, y + 12, rx * 1.05, ry * 1.15);
  c.beginPath(); ell(c, x, y, rx, ry); c.strokeStyle = INK; c.lineWidth = 16; c.stroke();
  c.beginPath(); ell(c, x, y, rx, ry); c.strokeStyle = pick(0)[0]; c.lineWidth = 7; c.stroke();
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, bx = x + Math.cos(a) * rx, by = y + Math.sin(a) * ry, [col, dk] = pick(a); shape(c, () => ell(c, bx, by, rx * 0.075, rx * 0.075), i % 2 ? col : dk, 4); }
  const [col] = pick(Math.PI / 2); shape(c, () => ell(c, x, y + ry + 18, rx * 0.11, rx * 0.11), col, 5);
};
const darkPick = (): [string, string] => [SILV.dk, SILV.dkDk];
const brightPick = (): [string, string] => [SILV.br, SILV.brDk];

// a tall brass lamp standing with its base centre at (x, y), height about 520*s. left/right colours for the two halves
const lampPath = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  ell(c, 0, 0, 160, 42); c.moveTo(-28, -30); c.rect(-28, -300, 56, 272); c.moveTo(60, -300); ell(c, 0, -300, 60, 34);
  c.moveTo(-70, -330); c.lineTo(70, -330); c.lineTo(150, -430); c.lineTo(-150, -430); c.closePath();
  c.moveTo(14, -430); c.rect(-14, -500, 28, 70); c.moveTo(36, -520); ell(c, 0, -520, 36, 36);
  c.restore();
};
const lamp = (c: Ctx, x: number, y: number, s: number, left: [string, string], right: [string, string]) => {
  shadow(c, x + 30, y + 10, 190 * s, 50 * s);
  const p = () => lampPath(c, x, y, s);
  shape(c, p, left[0], 0);
  c.save(); c.beginPath(); c.rect(x, y - 600 * s, 400 * s, 700 * s); c.clip(); shape(c, p, right[0], 0); c.restore();
  shade(c, p, right[1], 28 * s, 0, 0.45);
  shape(c, p, "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, x, y - 430 * s, 150 * s, 30 * s), left[1], 5);
  c.save(); c.beginPath(); c.rect(x, y - 600 * s, 400 * s, 700 * s); c.clip(); shape(c, () => ell(c, x, y - 430 * s, 150 * s, 30 * s), right[1], 5); c.restore();
};
const dull: [string, string] = [BRASS.dull, BRASS.dullDk], bright: [string, string] = [BRASS.br, BRASS.brDk];

// a sheet of paper, top left (x, y); newspaper = grey with text lines
const sheet = (c: Ctx, x: number, y: number, w: number, h: number, col: string = COL.paper) => { shadow(c, x + w / 2 + 14, y + h + 6, w * 0.5, 14); shape(c, () => rrect(c, x, y, w, h, 10), col, 6); };
const newspaper = (c: Ctx, x: number, y: number, w: number, h: number) => {
  sheet(c, x, y, w, h, "#e9e6dc");
  c.globalAlpha = 0.35; for (let yy = y + 40; yy < y + h - 30; yy += 26) line(c, [[x + 30, yy], [x + w - 30 - (yy % 52 ? 0 : 60), yy]], 5, COL.greyDk); c.globalAlpha = 1;
};
const tally = (c: Ctx, x: number, y: number, n: number, h = 50) => {
  for (let i = 0; i < Math.min(n, 4); i++) line(c, [[x + i * 18, y], [x + i * 18, y + h]], 6);
  if (n >= 5) line(c, [[x - 10, y + h - 6], [x + 66, y + 6]], 6);
};
const coin = (c: Ctx, x: number, y: number, r: number, col: string, dk: string) => { shadow(c, x + 6, y + 8, r, r * 0.9); shape(c, () => ell(c, x, y, r, r), col); shape(c, () => ell(c, x, y, r * 0.72, r * 0.72), dk, 4); shine(c, [[x - r * 0.5, y - r * 0.45], [x - r * 0.15, y - r * 0.7]], 6); };
const earring = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x, y], [x, y + 30 * s]], 5 * s, INK); c.beginPath(); c.arc(x + 12 * s, y, 12 * s, Math.PI, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 6 * s; c.stroke(); shape(c, () => { c.moveTo(x, y + 28 * s); c.quadraticCurveTo(x + 34 * s, y + 70 * s, x, y + 100 * s); c.quadraticCurveTo(x - 34 * s, y + 70 * s, x, y + 28 * s); c.closePath(); }, COL.yellow, 5); };
const pencil = (c: Ctx, x: number, y: number, len: number, an: number, w = 36) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -w / 2, len, w, 4), COL.yellow); shade(c, () => rrect(c, 0, -w / 2, len, w, 4), COL.orange, 0, w * 0.4, 0.5);
  shape(c, () => polyP(c, [[len, -w / 2], [len + w * 1.4, 0], [len, w / 2]]), COL.wood, 5);
  shape(c, () => polyP(c, [[len + w * 0.9, -w * 0.18], [len + w * 1.4, 0], [len + w * 0.9, w * 0.18]]), INK, 3);
  shape(c, () => rrect(c, -w * 0.6, -w / 2, w * 0.6, w, 3), COL.steel, 5); shape(c, () => rrect(c, -w * 1.3, -w / 2, w * 0.7, w, 8), COL.pink, 5);
  c.restore();
};
const foilRoll = (c: Ctx, x: number, y: number, len: number, r: number) => {
  shadow(c, x + len / 2, y + r + 8, len / 2, 14);
  shape(c, () => rrect(c, x, y - r, len, r * 2, 6), COL.steelIn); shade(c, () => rrect(c, x, y - r, len, r * 2, 6), COL.steelDk, 0, r * 0.9, 0.5);
  shape(c, () => ell(c, x + len, y, r * 0.4, r), COL.steel); shape(c, () => ell(c, x + len, y, r * 0.14, r * 0.4), INK, 0);
  shine(c, [[x + 20, y - r * 0.5], [x + len - 30, y - r * 0.5]], 6);
};
const sodaBox = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 10, y + h + 6, w * 0.55, 14);
  shape(c, () => rrect(c, x, y, w, h, 8), COL.orange); shade(c, () => rrect(c, x, y, w, h, 8), "#c9742a", w * 0.3, 0, 0.5);
  shape(c, () => ell(c, x + w / 2, y + h * 0.45, w * 0.3, w * 0.3), WHITE, 5);
  const r = rnd(3); for (let i = 0; i < 7; i++) shape(c, () => ell(c, x + w / 2 - 30 + r() * 60, y + h * 0.45 - 30 + r() * 60, 7, 7), COL.sky, 3);
};
const fizz = (c: Ctx, x: number, y: number, n: number, seed: number, spread: number) => { const r = rnd(seed); for (let i = 0; i < n; i++) shape(c, () => ell(c, x - spread + r() * spread * 2, y - r() * 70, 6 + r() * 9, 6 + r() * 9), WHITE, 3); };
const foilLined = (c: Ctx, x: number, y: number, r: number) => { bowl(c, x, y, r, COL.steelIn); shape(c, () => ell(c, x, y, r * 0.86, r * 0.16), SILV.br, 4); for (let i = 0; i < 5; i++) line(c, [[x - r * 0.6 + i * r * 0.3, y - r * 0.05], [x - r * 0.5 + i * r * 0.3, y + r * 0.08]], 3, SILV.brDk); };
const phone = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 10, y + h + 6, w * 0.55, 14);
  shape(c, () => rrect(c, x, y, w, h, 22), COL.black); shape(c, () => rrect(c, x + 12, y + 30, w - 24, h - 60, 10), "#1d2b38", 3);
  const gh = 70, gx = x + w / 2 - gh * 1.35, gy = y + h / 2 - gh / 2;
  write(c, "5", gx, gy, gh, "#c9f06b", 9); shape(c, () => ell(c, gx + gh * 0.95, gy + gh * 0.3, 6, 6), "#c9f06b", 0); shape(c, () => ell(c, gx + gh * 0.95, gy + gh * 0.7, 6, 6), "#c9f06b", 0); write(c, "00", gx + gh * 1.2, gy, gh, "#c9f06b", 9);
};
const tray = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 20, y + h + 10, w * 0.52, 20); shape(c, () => rrect(c, x, y, w, h, 26), COL.wood); shape(c, () => rrect(c, x + 26, y + 26, w - 52, h - 52, 16), COL.woodDk, 5); };
const vessel = (c: Ctx, x: number, y: number, r: number) => { shadow(c, x + 8, y + r * 1.05, r * 0.9, 14); shape(c, () => { c.moveTo(x - r, y); c.lineTo(x - r * 0.85, y + r); c.lineTo(x + r * 0.85, y + r); c.lineTo(x + r, y); c.closePath(); }, COL.steel); shape(c, () => polyP(c, [[x - r * 0.9, y + r * 0.66], [x + r * 0.9, y + r * 0.66], [x + r * 0.85, y + r], [x - r * 0.85, y + r]]), COPPER, 5); shape(c, () => ell(c, x, y, r, r * 0.25), COL.steelIn, 5); };
const spoon = (c: Ctx, x: number, y: number, len: number, an: number) => { c.save(); c.translate(x, y); c.rotate(an); shape(c, () => rrect(c, 0, -9, len, 18, 9), COL.steel, 5); shape(c, () => ell(c, len + 36, 0, 46, 30), COL.steel); shape(c, () => ell(c, len + 36, 0, 30, 18), COL.steelIn, 3); c.restore(); };
const shaker = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 6, y + h + 4, w * 0.55, 10); shape(c, () => rrect(c, x, y, w, h, 10), COL.glass, 5); c.fillStyle = WHITE; c.fillRect(x + 5, y + h * 0.4, w - 10, h * 0.55); shape(c, () => rrect(c, x - 4, y - 24, w + 8, 30, 8), COL.steel, 5); for (let i = 0; i < 3; i++) shape(c, () => ell(c, x + w * 0.25 + i * w * 0.25, y - 9, 4, 4), INK, 0); };
const foilSheet = (c: Ctx, x: number, y: number, w: number, h: number) => { shape(c, () => polyP(c, [[x, y], [x + w, y + 8], [x + w - 6, y + h], [x + 4, y + h - 6]]), COL.steelIn, 5); shine(c, [[x + 20, y + h * 0.7], [x + w * 0.4, y + 20]], 5); line(c, [[x + w * 0.5, y + h - 10], [x + w * 0.8, y + 24]], 3, COL.steelDk); };
const tamarind = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => { c.moveTo(x - 50 * s, y); c.bezierCurveTo(x - 40 * s, y - 60 * s, x + 50 * s, y - 50 * s, x + 56 * s, y + 10 * s); c.bezierCurveTo(x + 40 * s, y + 50 * s, x - 50 * s, y + 46 * s, x - 50 * s, y); c.closePath(); }, "#6b3a1e", 5); shape(c, () => ell(c, x - 10 * s, y + 8 * s, 14 * s, 10 * s), "#8a5230", 0); };
const circleSheet = (c: Ctx) => { sheet(c, 90, 120, 900, 620); return [[280, 430], [540, 430], [800, 430]] as number[][]; };
const crayons = (c: Ctx, y: number) => { [COL.yellow, COL.red, COL.blue, COL.green, COL.purple, COL.orange].forEach((col, i) => { const x = 240 + i * 110; shape(c, () => rrect(c, x, y, 70, 150, 8), col); shape(c, () => polyP(c, [[x, y], [x + 35, y - 40], [x + 70, y]]), col, 5); c.fillStyle = INK; c.globalAlpha = 0.15; c.fillRect(x, y + 40, 70, 20); c.globalAlpha = 1; }); };
const squiggle = (c: Ctx, x: number, y: number, w: number) => line(c, [[x, y], [x + w * 0.25, y - 6], [x + w * 0.5, y + 4], [x + w * 0.75, y - 4], [x + w, y + 2]], 5, COL.blueDk);
const darkSquare = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => c.rect(x, y, s, s), GRAPH, 5); for (let i = 0; i < 8; i++) line(c, [[x + 6, y + 10 + i * (s / 8.5)], [x + s - 6, y + 14 + i * (s / 8.5)]], 4, "#4d4e57"); };

// ------------------------------------------------------------ set-up cards
const e1s0 = (c: Ctx) => { ground(c); plate(c, 330, 720, 250, 110); anklet(c, 330, 712, 150, 70, darkPick); bowl(c, 760, 600, 140); foilLined(c, 760, 870, 140); foilRoll(c, 560, 250, 300, 52); sodaBox(c, 150, 170, 180, 260); };
const e1s1 = (c: Ctx) => {
  ground(c); bowl(c, 330, 700, 200, COL.water); fizz(c, 330, 690, 24, 5, 170); foilLined(c, 820, 760, 150);
  c.save(); c.translate(640, 405); c.rotate(-0.55); shape(c, () => rrect(c, -120, -75, 240, 150, 16), COL.steel); shape(c, () => rrect(c, 100, -14, 200, 28, 12), COL.black, 5); c.restore();
  shape(c, () => { c.moveTo(540, 380); c.quadraticCurveTo(430, 440, 400, 640); c.lineTo(440, 650); c.quadraticCurveTo(470, 470, 560, 410); c.closePath(); }, COL.water, 4);
  hand(c, 936, 223, Math.PI - 0.55, 1.2, SKIN.adult, CLOTH.adult); arrow(c, [[700, 230], [560, 300]]);
};
const e1s2 = (c: Ctx) => { ground(c); bowl(c, 400, 640, 260, COL.water); anklet(c, 400, 650, 190, 60, darkPick); phone(c, 760, 220, 240, 440); arrow(c, [[400, 300], [400, 520]]); };
const e1s3 = (c: Ctx) => {
  ground(c); foilLined(c, 480, 620, 300); shape(c, () => ell(c, 480, 620, 258, 48), COL.water, 0);
  anklet(c, 480, 626, 200, 56, (a) => (Math.cos(a) < 0 ? darkPick() : brightPick()));
  shine(c, [[560, 590], [620, 585]], 8); arrow(c, [[900, 320], [960, 450], [860, 560]]);
};
const e2s0 = (c: Ctx) => { ground(c); newspaper(c, 90, 560, 900, 440); lamp(c, 540, 860, 1.2, dull, dull); shape(c, () => rrect(c, 490, 620, 100, 50, 6), WHITE, 5); line(c, [[590, 640], [640, 610]], 5); line(c, [[590, 650], [644, 668]], 5); };
const e2s1 = (c: Ctx) => {
  ground(c); newspaper(c, 90, 560, 900, 440); lamp(c, 540, 860, 1.2, dull, dull);
  tamarind(c, 300, 420, 1.1); hand(c, 170, 360, 0.45, 1.4); for (let i = 0; i < 4; i++) shape(c, () => ell(c, 330 + i * 10, 480 + i * 30, 9, 13), "#6b3a1e", 3);
  shape(c, () => { c.moveTo(620, 380); c.quadraticCurveTo(760, 320, 820, 440); c.quadraticCurveTo(700, 480, 640, 560); c.quadraticCurveTo(600, 460, 620, 380); c.closePath(); }, COL.sky, 6);
  for (let i = 0; i < 3; i++) shape(c, () => ell(c, 690 + i * 40, 440 + i * 20, 8, 12), COL.drop, 3);
  arrow(c, [[430, 230], [470, 290], [430, 350]]); arrow(c, [[760, 200], [800, 260], [760, 320]]);
};
const e2s2 = (c: Ctx) => { ground(c); newspaper(c, 90, 560, 900, 440); lamp(c, 540, 860, 1.2, bright, dull); shine(c, [[470, 560], [440, 380]], 9); shine(c, [[480, 340], [500, 320]], 8); };
const a1s0 = (c: Ctx) => {
  ground(c); tray(c, 60, 180, 960, 760); foilSheet(c, 110, 240, 280, 220); pencil(c, 450, 300, 300, 0.1); vessel(c, 820, 300, 110);
  coin(c, 220, 640, 80, COL.steelIn, COL.steel); earring(c, 420, 560, 1.6); spoon(c, 480, 760, 220, -0.2); shaker(c, 860, 620, 90, 170); coin(c, 820, 560, 28, COL.yellow, COL.orange);
};
const a1s1 = (c: Ctx) => {
  ground(c); sheet(c, 120, 90, 840, 900); line(c, [[540, 110], [540, 970]], 6); line(c, [[140, 210], [940, 210]], 6);
  shape(c, () => ell(c, 330, 160, 30, 30), COL.yellow, 5); shape(c, () => ell(c, 720, 160, 24, 24), COL.yellow, 5); shape(c, () => ell(c, 770, 160, 24, 24), COL.blue, 5);
  foilSheet(c, 200, 260, 170, 120); pencil(c, 190, 460, 180, 0.08, 26); coin(c, 300, 620, 50, COL.steelIn, COL.steel); earring(c, 300, 720, 1.1);
  vessel(c, 740, 280, 70); spoon(c, 600, 520, 160, -0.15); shaker(c, 720, 640, 70, 130);
  write(c, "4", 290, 860, 100, INK, 9); write(c, "3", 700, 860, 100, INK, 9);
};
const a2s0 = (c: Ctx) => { ground(c); const cs = circleSheet(c); cs.forEach(([x, y]) => shape(c, () => ell(c, x, y, 110, 110), WHITE, 6)); coin(c, 280, 220, 36, COL.yellow, COL.orange); shape(c, () => { c.moveTo(540, 190); c.quadraticCurveTo(575, 240, 540, 258); c.quadraticCurveTo(505, 240, 540, 190); c.closePath(); }, COL.water, 4); for (let i = 0; i < 6; i++) shape(c, () => ell(c, 780 + (i % 3) * 16, 215 + Math.floor(i / 3) * 16, 6, 6), WHITE, 3); crayons(c, 820); };
const a2s1 = (c: Ctx) => {
  ground(c); const cs = circleSheet(c); cs.forEach(([x, y]) => shape(c, () => ell(c, x, y, 110, 110), WHITE, 6));
  const r = rnd(11); for (let i = 0; i < 40; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 88; shape(c, () => ell(c, 280 + Math.cos(a) * d, 430 + Math.sin(a) * d, 11, 11), COL.yellow, 3); }
  for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2, d = i < 3 ? 0 : 62, x = 540 + Math.cos(a) * d + (i < 3 ? (i - 1) * 44 : 0), y = 430 + Math.sin(a) * d; shape(c, () => ell(c, x, y, 13, 13), COL.red, 3); shape(c, () => ell(c, x - 16, y + 18, 9, 9), COL.blue, 3); shape(c, () => ell(c, x + 16, y + 18, 9, 9), COL.blue, 3); }
  for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) { const x = 800 - 62 + i * 25, y = 430 - 62 + j * 25; if ((x - 800) ** 2 + (y - 430) ** 2 < 85 * 85) shape(c, () => ell(c, x, y, 9, 9), (i + j) % 2 ? COL.green : COL.purple, 2.5); }
  crayons(c, 820);
};
const a3s0 = (c: Ctx) => { ground(c); sheet(c, 120, 140, 840, 800); darkSquare(c, 330, 460, 200); pencil(c, 560, 300, 360, 2.3); hand(c, 577, 282, 2.3, 1.5); arrow(c, [[330, 420], [530, 420]]); arrow(c, [[530, 700], [330, 700]]); };
const a3s1 = (c: Ctx) => { ground(c); sheet(c, 120, 140, 840, 800); darkSquare(c, 330, 460, 200); hand(c, 670, 510, Math.PI * 1.1, 1.6, SKIN.child, CLOTH.child, true); shape(c, () => ell(c, 520, 462, 28, 20), GRAPH, 4); shine(c, [[505, 456], [518, 452]], 6); arrow(c, [[380, 400], [460, 360], [540, 400]]); };
const a4s0 = (c: Ctx) => {
  ground(c); person(c, 330, 980, 600, { armR: [-0.3, -1.4] }); shape(c, () => rrect(c, 380, 440, 170, 230, 10), COL.brown, 6); shape(c, () => rrect(c, 395, 470, 140, 185, 6), COL.paper, 4); shape(c, () => rrect(c, 430, 428, 70, 36, 8), COL.steel, 5); squiggle(c, 410, 520, 110); squiggle(c, 410, 560, 110); squiggle(c, 410, 600, 110);
  person(c, 790, 980, 760, { adult: true, armL: [Math.PI * 0.75, -1.2], armR: [Math.PI * 0.35, Math.PI * 0.55] }); shape(c, () => ell(c, 790, 430, 60, 40), "#bdb7b0", 5);
  earring(c, 650, 500, 1.3); anklet(c, 905, 790, 70, 32, darkPick, 16);
};
const a4s1 = (c: Ctx) => {
  ground(c); sheet(c, 120, 90, 840, 900); line(c, [[400, 110], [400, 970]], 6); line(c, [[680, 110], [680, 970]], 6); line(c, [[140, 210], [940, 210]], 6);
  coin(c, 540, 160, 30, COL.yellow, COL.orange); shine(c, [[500, 150], [520, 135]], 5); coin(c, 810, 160, 30, SILV.dk, SILV.dkDk);
  earring(c, 230, 280, 1.2); anklet(c, 260, 470, 70, 30, brightPick, 16); coin(c, 260, 620, 44, COL.yellow, COL.orange); anklet(c, 260, 800, 70, 30, darkPick, 16);
  tally(c, 480, 280, 5); tally(c, 600, 280, 2); tally(c, 770, 480, 3); tally(c, 490, 620, 5); tally(c, 600, 620, 1); tally(c, 770, 800, 4);
};
const p1s0 = (c: Ctx) => {
  ground(c); for (let i = 5; i >= 0; i--) shape(c, () => rrect(c, 230 - i * 6, 200 + i * 7, 620, 700, 12), i ? "#f3ecda" : COL.paper, 5);
  for (let i = 0; i < 3; i++) shape(c, () => rrect(c, 244, 300 + i * 220, 12, 50, 4), COL.steelDk, 4);
  coin(c, 540, 520, 150, COL.yellow, COL.orange); line(c, [[330, 760], [750, 760]], 7, COL.blueDk); line(c, [[380, 820], [700, 820]], 7, COL.blueDk);
};
const p1s1 = (c: Ctx) => {
  ground(c); shadow(c, 560, 900, 480, 30);
  shape(c, () => polyP(c, [[110, 230], [540, 270], [540, 900], [110, 870]]), COL.paper); shape(c, () => polyP(c, [[540, 270], [970, 230], [970, 870], [540, 900]]), COL.paper);
  line(c, [[540, 270], [540, 900]], 6); earring(c, 280, 380, 2.6); earring(c, 400, 380, 2.6);
  for (let i = 0; i < 4; i++) squiggle(c, 600, 420 + i * 90, 300); coin(c, 760, 760, 50, COL.yellow, COL.orange);
};

// ------------------------------------------------------------ card pictures
const flowE1 = (c: Ctx) => { ground(c); anklet(c, 270, 500, 170, 70, darkPick); arrow(c, [[470, 500], [620, 500]]); foilLined(c, 820, 500, 200); anklet(c, 820, 505, 140, 46, brightPick); shine(c, [[870, 480], [930, 470]], 8); };
const flowE2 = (c: Ctx) => { ground(c); lamp(c, 540, 900, 1.3, bright, dull); tamarind(c, 170, 300, 1.4); shape(c, () => { c.moveTo(900, 240); c.quadraticCurveTo(900, 220, 920, 180); c.quadraticCurveTo(940, 220, 940, 240); c.arc(920, 240, 20, 0, Math.PI); c.closePath(); }, COL.water, 5); arrow(c, [[250, 400], [380, 560]]); arrow(c, [[860, 320], [730, 560]]); };
const termCarbon = (c: Ctx) => {
  ground(c); pencil(c, 120, 760, 560, -0.25, 70); shape(c, () => polyP(c, [[560, 330], [700, 180], [840, 330], [700, 620]]), COL.sky, 6); shape(c, () => polyP(c, [[560, 330], [840, 330], [700, 400]]), COL.drop, 4); line(c, [[630, 255], [770, 255]], 4); shine(c, [[700, 420], [700, 540]], 7);
  shape(c, () => rrect(c, 180, 860, 320, 60, 8), GRAPH, 5);
};

export const ic_chemistryElementsL2 = cards("sci.chemistry.elements.L2", [
  e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, a1s0, a1s1, a2s0, a2s1, a3s0, a3s1, a4s0, a4s1, p1s0, p1s1,
  flowE1, flowE2, termCarbon,
]);
export const KEYS = ["setup.e1.0", "setup.e1.1", "setup.e1.2", "setup.e1.3", "setup.e2.0", "setup.e2.1", "setup.e2.2", "setup.a1.0", "setup.a1.1", "setup.a2.0", "setup.a2.1", "setup.a3.0", "setup.a3.1", "setup.a4.0", "setup.a4.1", "setup.p1.0", "setup.p1.1", "flow.e1", "flow.e2", "term.4"];
