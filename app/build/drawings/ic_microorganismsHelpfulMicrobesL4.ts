import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, hand, person, write, cards } from "./flatKit";

// HELPFUL MICROBES (L4) · set-up cards for the yeast balloon and the curd test, then the cards.
// Same kit as every unit: flat colours, ink outline, light from the upper left.

const MILK = "#fbfaf5", YEASTY = "#e9d7b0", BATTER = "#f3e6c4", CURD = "#ffffff", MOULD = "#5f9b85", MOULD_DK = "#3f7a6b";

// ---------------------------------------------------------------- letters for the bottle and cup labels
const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.13, 0.62], [0.47, 0.62]]],
  B: [[[0, 1], [0, 0], [0.4, 0], [0.56, 0.12], [0.56, 0.38], [0.4, 0.5], [0, 0.5]], [[0.4, 0.5], [0.6, 0.62], [0.6, 0.88], [0.42, 1], [0, 1]]],
  C: [[[0.58, 0.14], [0.42, 0], [0.16, 0], [0, 0.16], [0, 0.84], [0.16, 1], [0.42, 1], [0.58, 0.86]]],
  D: [[[0, 1], [0, 0], [0.34, 0], [0.58, 0.2], [0.58, 0.8], [0.34, 1], [0, 1]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col = INK, w = 7) => {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round";
  (LET[ch] ?? []).forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(x + u * h, y + v * h) : c.moveTo(x + u * h, y + v * h))); c.stroke(); });
};
// a white paper label with one big letter, centred at (x, y)
const tag = (c: Ctx, x: number, y: number, ch: string, s = 1) => {
  shape(c, () => rrect(c, x - 34 * s, y - 40 * s, 68 * s, 80 * s, 10 * s), WHITE, 5);
  letter(c, ch, x - 18 * s, y - 27 * s, 54 * s, INK, 7 * s);
};

// ---------------------------------------------------------------- surfaces and furniture
const floorAt = (c: Ctx, y: number) => { c.fillStyle = "#e2d3b7"; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };
const table = (c: Ctx, x1: number, x2: number, yTop: number, yFloor: number) => {
  for (const lx of [x1 + 30, x2 - 30]) shape(c, () => rrect(c, lx - 12, yTop + 20, 24, yFloor - yTop - 20, 4), COL.woodDk, 5);
  shadow(c, (x1 + x2) / 2 + 12, yTop + 30, (x2 - x1) / 2, 12);
  shape(c, () => rrect(c, x1, yTop, x2 - x1, 24, 6), COL.wood, 5);
};
const tray = (c: Ctx, x1: number, x2: number, yFront: number, depth: number) => {
  shadow(c, (x1 + x2) / 2 + 10, yFront + 10, (x2 - x1) / 2, 16);
  shape(c, () => polyP(c, [[x1 + 30, yFront - depth], [x2 - 30, yFront - depth], [x2, yFront], [x1, yFront]]), COL.wood);
  shape(c, () => polyP(c, [[x1, yFront], [x2, yFront], [x2, yFront + 16], [x1, yFront + 16]]), COL.woodDk);
};
// a fridge with its door swung open to the right; shelves at the given heights
const fridge = (c: Ctx, x: number, y: number, w: number, h: number, shelves: number[]) => {
  shadow(c, x + w / 2 + 20, y + h + 8, w / 2, 16);
  shape(c, () => polyP(c, [[x + w, y], [x + w + 36, y - 28], [x + w + 36, y + h - 28], [x + w, y + h]]), "#dfe3e8");
  shape(c, () => rrect(c, x, y, w, h, 18), "#eef0f3");
  shape(c, () => rrect(c, x + 18, y + 18, w - 36, h - 36, 10), COL.sky, 5);
  shelves.forEach((sy) => shape(c, () => rrect(c, x + 18, sy, w - 36, 12, 4), COL.steelIn, 4));
  shape(c, () => rrect(c, x + w + 8, y + h * 0.35, 12, 120, 6), COL.steelDk, 3);
};
const snowflake = (c: Ctx, x: number, y: number, r: number, col: string = COL.blueDk) => {
  for (let k = 0; k < 3; k++) {
    const a = (k * Math.PI) / 3, dx = Math.cos(a) * r, dy = Math.sin(a) * r;
    line(c, [[x - dx, y - dy], [x + dx, y + dy]], 7, col);
    for (const s of [-1, 1]) { const px = x + s * dx * 0.55, py = y + s * dy * 0.55; for (const t of [-1, 1]) line(c, [[px, py], [px + s * Math.cos(a + t * 0.6) * r * 0.32, py + s * Math.sin(a + t * 0.6) * r * 0.32]], 6, col); }
  }
};
// a lit bulb: the warm place
const bulb = (c: Ctx, x: number, y: number, r: number) => {
  c.globalAlpha = 0.35; shape(c, () => ell(c, x, y, r * 2.2, r * 2.2), COL.yellow, 0); c.globalAlpha = 1;
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; line(c, [[x + Math.cos(a) * r * 1.5, y + Math.sin(a) * r * 1.5], [x + Math.cos(a) * r * 2.1, y + Math.sin(a) * r * 2.1]], 5, COL.orange); }
  shape(c, () => rrect(c, x - r * 0.45, y + r * 0.7, r * 0.9, r * 0.7, 4), COL.greyDk, 4);
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 5);
};
// a red "not this" sign over something
const noSign = (c: Ctx, x: number, y: number, r: number) => {
  c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = RED; c.lineWidth = 14; c.stroke();
  line(c, [[x - r * 0.7, y - r * 0.7], [x + r * 0.7, y + r * 0.7]], 14, RED);
};
const note = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 10, y + h + 6, w / 2, 14);
  shape(c, () => rrect(c, x, y, w, h, 8), COL.paper, 5);
  shape(c, () => rrect(c, x + w / 2 - 50, y - 12, 100, 26, 6), "#ffd34d", 3);
};
const grid = (c: Ctx, x: number, y: number, cols: number[], rows: number[]) => {
  const w = cols.reduce((a, b) => a + b, 0), h = rows.reduce((a, b) => a + b, 0);
  shape(c, () => rrect(c, x, y, w, h, 2), WHITE, 5);
  let cx = x; cols.slice(0, -1).forEach((cw) => { cx += cw; line(c, [[cx, y], [cx, y + h]], 4); });
  let cy = y; rows.slice(0, -1).forEach((rh) => { cy += rh; line(c, [[x, cy], [x + w, cy]], 4); });
};

// ---------------------------------------------------------------- kitchen things
// a clear plastic bottle, bottom centre (x, y); fill 0..1 of liquid; gives back the neck top and half-width
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, liquid: string = COL.water) => {
  const bw = w / 2, nw = w * 0.2, sy = y - h * 0.7, ny = sy - w * 0.3, top = y - h;
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const body = () => { c.moveTo(x - bw + 10, y); c.lineTo(x - bw, y - 10); c.lineTo(x - bw, sy); c.quadraticCurveTo(x - bw, ny, x - nw, ny); c.lineTo(x - nw, top); c.lineTo(x + nw, top); c.lineTo(x + nw, ny); c.quadraticCurveTo(x + bw, ny, x + bw, sy); c.lineTo(x + bw, y - 10); c.lineTo(x + bw - 10, y); c.closePath(); };
  if (fill > 0) { const ly = y - (y - sy) * fill; c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = liquid; c.fillRect(x - bw, ly, w, y - ly); c.restore(); shape(c, () => ell(c, x, ly, bw - 3, w * 0.07), COL.drop, 0); }
  shape(c, body, COL.glass, 5);
  shape(c, () => rrect(c, x - nw - 6, top, nw * 2 + 12, 16, 4), COL.glassEdge, 4);
  shine(c, [[x - bw * 0.72, y - h * 0.6], [x - bw * 0.72, y - h * 0.2]], 7);
  return { top, nw };
};
// a balloon fitted on a bottle neck: r = 0 is limp (hangs beside the neck), else blown up to radius r
const balloon = (c: Ctx, x: number, neckY: number, nw: number, r: number, col: string) => {
  if (r > 0) { shape(c, () => ell(c, x, neckY - r * 1.05 - 10, r * 0.92, r), col); shine(c, [[x - r * 0.5, neckY - r * 1.35], [x - r * 0.3, neckY - r * 1.75]], 8); }
  else { const pts = [[x + nw + 10, neckY + 14], [x + nw + 48, neckY + 40], [x + nw + 52, neckY + 98]]; line(c, pts, 42, INK); line(c, pts, 32, col); }
  shape(c, () => rrect(c, x - nw - 9, neckY - 2, nw * 2 + 18, 30, 9), col, 5);
};
// a steel tumbler, bottom centre (x, y); top = what shows at the rim
const steelCup = (c: Ctx, x: number, y: number, w: number, h: number, top: string = COL.steelIn, ry = w * 0.14) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.55, w * 0.1);
  const tw = w / 2, bw = w * 0.42;
  const body = () => { c.moveTo(x - tw, y - h); c.lineTo(x + tw, y - h); c.lineTo(x + bw, y); c.lineTo(x - bw, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -w * 0.38, 0);
  shape(c, () => ell(c, x, y - h, tw, ry), top, 5);
  shine(c, [[x - tw * 0.7, y - h * 0.85], [x - bw * 0.75, y - h * 0.2]], 7);
};
// a steel pot with two handles, centre (x, y), turned by rot (a tilt pours from the right rim)
const pot = (c: Ctx, x: number, y: number, w: number, h: number, rot: number, rim: string = COL.steelIn) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const body = () => rrect(c, -w / 2, -h / 2, w, h, 14);
  for (const s of [-1, 1]) shape(c, () => rrect(c, s > 0 ? w / 2 - 4 : -w / 2 - 40, -h / 2 + 10, 44, 24, 10), COL.steelDk, 5);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -w * 0.35, 0);
  shape(c, () => ell(c, 0, -h / 2, w / 2, w * 0.13), rim, 5);
  shine(c, [[-w * 0.36, -h * 0.25], [-w * 0.36, h * 0.25]], 7);
  c.restore();
};
// a teaspoon: handle end at (x, y), pointing at angle an; a heap of `heap` on the bowl
const spoon = (c: Ctx, x: number, y: number, an: number, len: number, heap?: string) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -len * 0.03, len * 0.72, len * 0.06, len * 0.03), COL.steel, 5);
  shape(c, () => ell(c, len * 0.85, 0, len * 0.17, len * 0.11), COL.steel, 5);
  shade(c, () => ell(c, len * 0.85, 0, len * 0.17, len * 0.11), COL.steelDk, -len * 0.05, -len * 0.04);
  if (heap) shape(c, () => ell(c, len * 0.85, -len * 0.04, len * 0.14, len * 0.085), heap, 4);
  c.restore();
};
// a clear jar, bottom centre (x, y)
const jar = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, content: string) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const body = () => rrect(c, x - w / 2, y - h, w, h, 18);
  if (fill > 0) { const ly = y - h * fill; c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = content; c.fillRect(x - w / 2, ly, w, y - ly); c.restore(); }
  shape(c, body, COL.glass, 5);
  shape(c, () => rrect(c, x - w / 2 - 8, y - h - 6, w + 16, 30, 8), COL.glassEdge, 4);
  shine(c, [[x - w * 0.36, y - h * 0.8], [x - w * 0.36, y - h * 0.2]], 8);
};
const bubble = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.7)", 3); };
// mould: a fuzzy blue-green patch with a white edge
const mould = (c: Ctx, x: number, y: number, r: number, seed: number) => {
  const rd = rnd(seed);
  for (let k = 0; k < 9; k++) { const a = rd() * Math.PI * 2, d = r * (0.6 + rd() * 0.5); shape(c, () => ell(c, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.7, r * 0.45, r * 0.4), WHITE, 3); }
  shape(c, () => ell(c, x, y, r, r * 0.75), MOULD, 4);
  for (let k = 0; k < 7; k++) { const a = rd() * Math.PI * 2, d = r * rd() * 0.6; shape(c, () => ell(c, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.7, r * 0.14, r * 0.12), MOULD_DK, 0); }
};
const sugarGrain = (c: Ctx, x: number, y: number) => shape(c, () => rrect(c, x - 6, y - 6, 12, 12, 2), WHITE, 2.5);
const yeastGrain = (c: Ctx, x: number, y: number) => shape(c, () => ell(c, x, y, 8, 5, 0.6), "#d9b27f", 2.5);
const pencil = (c: Ctx, x: number, y: number) => { line(c, [[x + 22, y - 50], [x - 10, y + 30]], 18, INK); line(c, [[x + 22, y - 50], [x - 8, y + 24]], 10, COL.yellow); line(c, [[x - 8, y + 24], [x - 12, y + 34]], 8, INK); };

// ================================================================ set-up cards: the yeast balloon (e1)
// 1. four bottles A to D, a measuring cup of 200 ml beside each; the cup for C has cold water
const e1s0 = (c: Ctx) => {
  ground(c); floorAt(c, 830);
  write(c, "200 ml", 335, 80, 90);
  [100, 355, 610, 865].forEach((bx, i) => {
    const cold = i === 2, cx = bx + 120;
    bottle(c, bx, 830, 105, 330, 0.42, cold ? "#a6d4f2" : COL.water);
    tag(c, bx, 705, "ABCD"[i], 0.9);
    const top = 90 / 2, bot = 90 * 0.4, ly = 830 - 130 * 0.62, lw = bot + (top - bot) * 0.62;
    shadow(c, cx + 10, 836, 54, 11);
    shape(c, () => { c.moveTo(cx - lw, ly); c.lineTo(cx + lw, ly); c.lineTo(cx + bot, 830); c.lineTo(cx - bot, 830); c.closePath(); }, cold ? "#a6d4f2" : COL.water, 0);
    shape(c, () => { c.moveTo(cx - top, 700); c.lineTo(cx + top, 700); c.lineTo(cx + bot, 830); c.lineTo(cx - bot, 830); c.closePath(); }, COL.glass, 5);
    shape(c, () => ell(c, cx, 700, top, 7), "rgba(255,255,255,0.35)", 5);
    for (let k = 1; k <= 4; k++) { const ty = 830 - k * 26; line(c, [[cx + 28, ty], [cx + 40, ty]], 3); }
    line(c, [[cx - 50, ly], [cx + 50, ly]], 5, RED);
    if (cold) snowflake(c, cx, 640, 30);
  });
};
// 2 and 3. a spoon of sugar (or yeast) going into bottle A; a note says which bottle gets none
const addToBottle = (c: Ctx, heap: string, grain: (c: Ctx, x: number, y: number) => void, no: string) => {
  ground(c); floorAt(c, 900);
  bottle(c, 380, 900, 240, 600, 0.42);
  tag(c, 462, 640, "A", 1.1);
  arrow(c, [[300, 780], [340, 840], [420, 840], [460, 780]]);
  const r = rnd(3);
  for (let i = 0; i < 24; i++) { const t = r(); grain(c, 380 + (r() - 0.5) * (30 + t * 70), 290 + t * 440); }
  spoon(c, 575, 95, Math.PI * 0.75, 300, heap);
  note(c, 680, 230, 300, 430);
  letter(c, no, 795, 262, 110, INK, 9);
  spoon(c, 705, 560, -0.3, 250, heap);
  noSign(c, 830, 520, 95);
};
const e1s1 = (c: Ctx) => addToBottle(c, WHITE, sugarGrain, "B");
const e1s2 = (c: Ctx) => addToBottle(c, "#d9b27f", yeastGrain, "D");
// 4. two hands stretch a balloon over bottle A on the tray; B and D wait beside it; C stands in the fridge
const e1s3 = (c: Ctx) => {
  ground(c); floorAt(c, 1010);
  tray(c, 40, 640, 1010, 60);
  const bB = bottle(c, 430, 965, 120, 360, 0.45, YEASTY); balloon(c, 430, bB.top, bB.nw, 0, COL.blue); tag(c, 430, 880, "B", 0.9);
  const bD = bottle(c, 575, 965, 120, 360, 0.45, COL.water); balloon(c, 575, bD.top, bD.nw, 0, COL.green); tag(c, 575, 880, "D", 0.9);
  const bA = bottle(c, 230, 1000, 170, 470, 0.45, YEASTY); tag(c, 230, 880, "A", 1.1);
  // the balloon, limp, held above the neck by its lip while the lip is pulled down over the neck
  shape(c, () => { c.moveTo(188, bA.top + 6); c.quadraticCurveTo(195, 420, 235, 400); c.quadraticCurveTo(300, 380, 292, 470); c.quadraticCurveTo(288, 520, 272, bA.top + 6); c.closePath(); }, COL.red);
  shape(c, () => rrect(c, 180, bA.top - 4, 100, 32, 10), COL.red, 5);
  hand(c, 136, 578, -0.55, 0.9);
  c.save(); c.translate(324, 578); c.scale(-1, 1); hand(c, 0, 0, -0.55, 0.9); c.restore();
  fridge(c, 680, 180, 360, 830, [420, 700]);
  const bC = bottle(c, 860, 700, 110, 270, 0.45, YEASTY); balloon(c, 860, bC.top, bC.nw, 0, COL.orange); tag(c, 860, 620, "C", 0.9);
  snowflake(c, 990, 260, 26);
};
// 5. the child wraps a tape measure round the widest part of the balloon and writes the number in the table
const e1s4 = (c: Ctx) => {
  ground(c); floorAt(c, 1030);
  table(c, 60, 560, 740, 1030);
  const b = bottle(c, 400, 740, 130, 270, 0.45, YEASTY);
  balloon(c, 400, b.top, b.nw, 110, COL.red);
  tag(c, 400, 650, "A");
  const by = b.top - 110 * 1.05 - 10;
  c.beginPath(); ell(c, 400, by, 104, 22); c.strokeStyle = INK; c.lineWidth = 22; c.stroke(); c.beginPath(); ell(c, 400, by, 104, 22); c.strokeStyle = COL.yellow; c.lineWidth = 14; c.stroke();
  for (let k = 0; k < 9; k++) { const a = Math.PI * (0.1 + k * 0.1); line(c, [[400 + Math.cos(a) * 104, by + Math.sin(a) * 22 - 5], [400 + Math.cos(a) * 104, by + Math.sin(a) * 22 + 5]], 2.5); }
  // the table of numbers pinned on the wall
  grid(c, 830, 240, [50, 90, 90], [60, 60, 60, 60, 60]);
  write(c, "10", 892, 254, 34, INK, 5); write(c, "20", 982, 254, 34, INK, 5);
  ["A", "B", "C", "D"].forEach((ch, i) => letter(c, ch, 843, 312 + i * 60, 36, INK, 5));
  [["12", "18"], ["8", "9"], ["7", "8"], ["0", ""]].forEach(([u, v], i) => { write(c, u, 898, 312 + i * 60, 34, INK, 5); write(c, v, 988, 312 + i * 60, 34, INK, 5); });
  const p = person(c, 700, 1030, 760, { reachL: [520, 390], reachR: [880, 470] });
  line(c, [[503, by + 6], p.handL], 28, INK); line(c, [[503, by + 6], p.handL], 18, COL.yellow);
  pencil(c, p.handR[0], p.handR[1]);
};

// ================================================================ set-up cards: the curd test (e2)
// 1. a grown-up pours cooled milk into four cups, each to the same line
const e2s0 = (c: Ctx) => {
  ground(c); floorAt(c, 1040);
  table(c, 440, 1060, 820, 1040);
  [540, 680, 820, 960].forEach((x, i) => { steelCup(c, x, 820, 105, 150, MILK); line(c, [[x - 50, 720], [x + 50, 720]], 5, RED); tag(c, x, 765, "ABCD"[i], 0.75); });
  person(c, 240, 1040, 830, { adult: true, reachL: [230, 475], reachR: [474, 565] });
  pot(c, 330, 580, 220, 170, 0.35, MILK);
  line(c, [[462, 540], [500, 600], [535, 668]], 26, INK); line(c, [[462, 540], [500, 600], [535, 668]], 18, MILK);
};
// 2. a teaspoon of starter curd stirred into cup A; cup D gets none
const e2s1 = (c: Ctx) => {
  ground(c); floorAt(c, 900);
  steelCup(c, 380, 900, 300, 380, MILK, 42);
  spoon(c, 600, 330, Math.PI * 0.72, 300);
  shape(c, () => ell(c, 380, 520, 150, 42), MILK, 5);
  shape(c, () => ell(c, 410, 516, 55, 20), CURD, 4);
  arrow(c, [[290, 528], [320, 548], [400, 556], [470, 540]]);
  tag(c, 380, 760, "A", 1.3);
  note(c, 680, 230, 300, 430);
  letter(c, "D", 795, 262, 110, INK, 9);
  spoon(c, 705, 560, -0.3, 250, CURD);
  noSign(c, 830, 520, 95);
};
// a cup covered with a small plate, with its letter
const coveredCup = (c: Ctx, x: number, y: number, ch: string) => { steelCup(c, x, y, 90, 120); plate(c, x, y - 120, 60, 15); tag(c, x, y - 45, ch, 0.7); };
// 3. A in the oven with only its light on, B and D on the counter, C in the fridge
const e2s2 = (c: Ctx) => {
  ground(c); floorAt(c, 920);
  // the oven
  shape(c, () => rrect(c, 40, 540, 330, 380, 12), COL.grey);
  shape(c, () => rrect(c, 70, 600, 270, 260, 8), "#5a5063", 5);
  for (const kx of [120, 170, 220]) shape(c, () => ell(c, kx, 570, 14, 14), COL.greyDk, 4);
  bulb(c, 300, 640, 16);
  coveredCup(c, 205, 850, "A");
  shape(c, () => rrect(c, 70, 600, 270, 260, 8), "rgba(214,236,250,0.22)", 0);
  // the counter
  shape(c, () => rrect(c, 400, 640, 280, 280, 6), COL.wood);
  shape(c, () => rrect(c, 392, 630, 296, 24, 6), COL.woodDk, 5);
  coveredCup(c, 470, 630, "B"); coveredCup(c, 610, 630, "D");
  // the fridge
  fridge(c, 710, 250, 330, 670, [470, 700]);
  coveredCup(c, 875, 700, "C");
  snowflake(c, 985, 310, 24);
};
// a tilted cup for the 0 to 3 scale: what comes out of it
const scaleCup = (c: Ctx, x: number, y: number, grade: number) => {
  c.save(); c.translate(x, y); c.rotate(0.55);
  const w = 90, h = 110, tw = w / 2, bw = w * 0.42;
  const body = () => { c.moveTo(-tw, -h / 2); c.lineTo(tw, -h / 2); c.lineTo(bw, h / 2); c.lineTo(-bw, h / 2); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -w * 0.38, 0);
  shape(c, () => ell(c, 0, -h / 2, tw, w * 0.16), WHITE, 5);
  if (grade === 3) shape(c, () => rrect(c, -tw + 8, -h / 2 - 26, w - 16, 30, 8), CURD, 4);
  c.restore();
  const rx = x + Math.cos(0.55) * 45 + Math.sin(0.55) * 55, ry = y + Math.sin(0.55) * 45 - Math.cos(0.55) * 55;
  if (grade === 0) { line(c, [[rx, ry], [rx + 14, ry + 40], [rx + 20, ry + 95]], 18, INK); line(c, [[rx, ry], [rx + 14, ry + 40], [rx + 20, ry + 95]], 10, MILK); }
  if (grade === 1) shape(c, () => { c.moveTo(rx - 10, ry - 4); c.quadraticCurveTo(rx + 30, ry + 10, rx + 16, ry + 46); c.quadraticCurveTo(rx - 4, ry + 56, rx - 6, ry + 20); c.closePath(); }, MILK, 4);
};
// 4. the child tilts a cup gently; the scale from 0 (runny) to 3 (firm)
const e2s3 = (c: Ctx) => {
  ground(c); floorAt(c, 1040);
  note(c, 650, 170, 400, 740);
  for (let k = 0; k < 4; k++) { const ry = 240 + k * 175; write(c, String(k), 700, ry, 80, INK, 9); scaleCup(c, 880, ry + 40, k); }
  const p = person(c, 330, 1040, 700, { reachL: [200, 650], reachR: [490, 640] });
  plate(c, p.handL[0], p.handL[1] + 4, 70, 22);
  c.save(); c.translate(p.handR[0] + 52, p.handR[1] - 14); c.rotate(0.45);
  const body = () => { c.moveTo(-55, -70); c.lineTo(55, -70); c.lineTo(46, 70); c.lineTo(-46, 70); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -40, 0);
  shape(c, () => ell(c, 0, -70, 55, 18), CURD, 5);
  c.restore();
};
// 5. the results table for cups A to D; the child writes the numbers in
const e2s4 = (c: Ctx) => {
  ground(c); floorAt(c, 1040);
  grid(c, 100, 160, [110, 215, 215], [100, 115, 115, 115, 115]);
  // morning: a rising sun; evening: a moon
  shape(c, () => { c.arc(317, 232, 34, Math.PI, 0); c.closePath(); }, COL.yellow, 5); line(c, [[260, 232], [374, 232]], 5);
  for (const a of [-2.4, -1.9, -1.25, -0.75]) line(c, [[317 + Math.cos(a) * 44, 232 + Math.sin(a) * 44], [317 + Math.cos(a) * 58, 232 + Math.sin(a) * 58]], 5, COL.orange);
  shape(c, () => { c.arc(532, 212, 34, 0.6, Math.PI * 2 - 0.6); c.quadraticCurveTo(528, 212, 532 + Math.cos(0.6) * 34, 212 + Math.sin(0.6) * 34); c.closePath(); }, COL.yellow, 5);
  ["A", "B", "C", "D"].forEach((ch, i) => letter(c, ch, 135, 292 + i * 115, 56, INK, 7));
  [["2", "3"], ["1", "2"], ["0", "1"], ["0", ""]].forEach(([u, v], i) => { write(c, u, 295, 290 + i * 115, 60, INK, 7); write(c, v, 510, 290 + i * 115, 60, INK, 7); });
  const p = person(c, 800, 1040, 700, { reachL: [600, 650] });
  pencil(c, p.handL[0] - 10, p.handL[1] + 10);
};

// ================================================================ cards
// Yeast balloon: what the four bottles looked like after 40 minutes
const flowE1 = (c: Ctx) => {
  ground(c); floorAt(c, 990);
  tray(c, 60, 1020, 990, 70);
  const R = [115, 48, 42, 0], CL = [COL.red, COL.blue, COL.green, COL.orange];
  [190, 420, 650, 880].forEach((x, i) => {
    const b = bottle(c, x, 980, 130, 330, 0.45, i === 3 ? COL.water : YEASTY);
    balloon(c, x, b.top, b.nw, R[i], CL[i]);
    tag(c, x, 880, "ABCD"[i]);
    if (i === 2) snowflake(c, x + 95, 540, 26);
  });
};
// The curd test: what the four cups held the next evening
const flowE2 = (c: Ctx) => {
  ground(c); floorAt(c, 880);
  const X = [170, 415, 660, 905], IN = [CURD, CURD, "#f7f4ec", "#f4f6f8"];
  X.forEach((x, i) => { steelCup(c, x, 880, 160, 230, IN[i], 36); tag(c, x, 800, "ABCD"[i], 0.85); });
  // A: firm, a spoon stands in it; B: set; C: still thin; D: still milk
  line(c, [[195, 655], [240, 440]], 22, INK); line(c, [[195, 655], [240, 440]], 14, COL.steel); shape(c, () => ell(c, 170, 650, 80, 36), CURD, 5); line(c, [[150, 640], [180, 660]], 4);
  line(c, [[395, 652], [445, 652]], 4);
  shape(c, () => ell(c, 640, 648, 40, 10), "rgba(255,255,255,0.9)", 0);
  shape(c, () => ell(c, 885, 648, 40, 10), "rgba(255,255,255,0.9)", 0); shape(c, () => ell(c, 930, 652, 18, 5), "rgba(255,255,255,0.9)", 0);
  bulb(c, 170, 420, 22);
  snowflake(c, 660, 420, 30);
  spoon(c, 830, 440, -0.2, 150, CURD); noSign(c, 905, 420, 60);
};
// Batter Watch: the batter has risen past the rubber band
const flowA1 = (c: Ctx) => {
  ground(c); floorAt(c, 940);
  jar(c, 480, 940, 320, 620, 0.62, BATTER);
  const r = rnd(11), lv = 940 - 620 * 0.62;
  for (let i = 0; i < 26; i++) bubble(c, 340 + r() * 280, lv + 12 + r() * 320, 5 + r() * 9);
  for (let i = 0; i < 14; i++) bubble(c, 335 + r() * 290, lv + (r() - 0.5) * 12, 6 + r() * 10);
  // the rubber band at last night's level, the arrow showing the rise
  c.beginPath(); ell(c, 480, 705, 164, 20); c.strokeStyle = INK; c.lineWidth = 20; c.stroke(); c.beginPath(); ell(c, 480, 705, 164, 20); c.strokeStyle = COL.brown; c.lineWidth = 12; c.stroke();
  arrow(c, [[250, 705], [250, lv]]);
  // the ruler, 0 at the bottom
  shape(c, () => rrect(c, 790, 300, 90, 640, 4), COL.wood);
  for (let mm = 0; mm <= 20; mm++) { const y = 940 - mm * 32; line(c, [[790, y], [790 + (mm % 5 === 0 ? 34 : 18), y]], mm % 5 === 0 ? 4 : 2.5); }
  [0, 5, 10, 15].forEach((cm) => write(c, String(cm), 834, 940 - cm * 32 - 14, 26, INK, 4));
};
// Ask the Elders: the phone on speaker, the notebook on the table, grandmother at the other end
const flowA2 = (c: Ctx) => {
  ground(c); floorAt(c, 1040);
  table(c, 40, 420, 770, 1040);
  shape(c, () => polyP(c, [[110, 700], [360, 700], [400, 770], [70, 770]]), COL.paper, 5);
  line(c, [[235, 700], [235, 770]], 4); for (let k = 0; k < 3; k++) { const y = 716 + k * 18, dx = (y - 700) * 0.57; line(c, [[95 - dx + 25, y], [225 - dx + 8, y]], 3, COL.grey); }
  // grandmother in a speech bubble
  shape(c, () => { c.moveTo(755, 400); c.quadraticCurveTo(745, 440, 715, 480); c.quadraticCurveTo(790, 460, 810, 418); c.closePath(); }, WHITE, 5);
  shape(c, () => ell(c, 870, 300, 125, 125), WHITE, 5);
  shape(c, () => ell(c, 870, 320, 62, 66), "#8d5a3b", 5);
  shape(c, () => { c.moveTo(808, 310); c.bezierCurveTo(800, 220, 940, 220, 932, 310); c.quadraticCurveTo(870, 268, 808, 310); c.closePath(); }, "#cfd3d6", 5);
  shape(c, () => ell(c, 870, 232, 28, 22), "#cfd3d6", 5);
  for (const s of [-1, 1]) { c.beginPath(); ell(c, 870 + s * 26, 322, 20, 18); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); shape(c, () => ell(c, 870 + s * 26, 322, 6, 7), INK, 0); }
  line(c, [[850, 322], [890, 322]], 4);
  c.beginPath(); c.arc(870, 352, 20, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  const p = person(c, 520, 1040, 720, { reachL: [330, 740], reachR: [690, 520] });
  pencil(c, p.handL[0] - 8, p.handL[1] + 6);
  c.save(); c.translate(p.handR[0] + 10, p.handR[1] - 20); c.rotate(-0.2);
  shape(c, () => rrect(c, -28, -52, 56, 104, 10), COL.black, 5); shape(c, () => rrect(c, -22, -42, 44, 78, 4), COL.sky, 3);
  c.restore();
  for (let k = 1; k <= 3; k++) { c.beginPath(); c.arc(p.handR[0] + 30, p.handR[1] - 60, 22 * k, -1.4, -0.3); c.strokeStyle = COL.blueDk; c.lineWidth = 6; c.stroke(); }
};
// Kitchen Safari: the child points at the curd, paneer and pickle in the fridge
const flowA3 = (c: Ctx) => {
  ground(c); floorAt(c, 1040);
  // the fridge, door open to the left
  shadow(c, 320, 1048, 230, 16);
  shape(c, () => polyP(c, [[80, 150], [44, 122], [44, 1012], [80, 1040]]), "#dfe3e8");
  shape(c, () => rrect(c, 80, 150, 440, 890, 18), "#eef0f3");
  shape(c, () => rrect(c, 98, 168, 404, 854, 10), COL.sky, 5);
  for (const sy of [450, 750]) shape(c, () => rrect(c, 98, sy, 404, 12, 4), COL.steelIn, 4);
  pot(c, 200, 400, 120, 100, 0, CURD);
  shape(c, () => rrect(c, 295, 376, 110, 74, 8), WHITE, 5); shape(c, () => rrect(c, 295, 400, 110, 22, 0), COL.blue, 0); line(c, [[295, 400], [405, 400]], 3); line(c, [[295, 422], [405, 422]], 3);
  jar(c, 330, 750, 110, 150, 0.8, COL.orange); shape(c, () => rrect(c, 268, 596, 124, 28, 8), COL.red, 5);
  const rd = rnd(5); for (let k = 0; k < 7; k++) shape(c, () => ell(c, 300 + rd() * 60, 640 + rd() * 90, 10, 7), COL.red, 2);
  steelCup(c, 180, 750, 80, 110, MILK);
  person(c, 820, 1040, 720, { reachL: [554, 520] });
};
// Make idli: the steamer and a plate of soft idlis with chutney
const flowP1 = (c: Ctx) => {
  ground(c); floorAt(c, 900);
  for (let k = 0; k < 3; k++) { const x = 220 + k * 90; line(c, [[x, 540], [x - 20, 480], [x + 15, 420], [x - 10, 360]], 14, "rgba(255,255,255,0.85)"); }
  pot(c, 300, 740, 380, 320, 0, COL.steelIn);
  shape(c, () => ell(c, 300, 580, 190, 50), COL.steelIn, 5);
  shape(c, () => { c.moveTo(125, 585); c.quadraticCurveTo(300, 470, 475, 585); c.closePath(); }, COL.steel, 5);
  shape(c, () => ell(c, 300, 528, 26, 14), COL.steelDk, 5);
  plate(c, 760, 820, 250, 100);
  [[650, 815], [790, 850], [770, 775]].forEach(([x, y]) => { shape(c, () => ell(c, x, y, 85, 40), WHITE, 5); const rd = rnd(x); for (let k = 0; k < 8; k++) shape(c, () => ell(c, x - 50 + rd() * 100, y - 12 + rd() * 24, 4, 3), COL.steelIn, 0); });
  bowl(c, 920, 780, 58, COL.green);
};
// Microbe: a spoon of curd, and the rod-shaped bacteria inside one drop
const term0 = (c: Ctx) => {
  ground(c);
  spoon(c, 60, 940, -0.33, 600);
  shape(c, () => ell(c, 545, 760, 95, 52), CURD, 5);
  shape(c, () => ell(c, 560, 740, 30, 30), "rgba(243,238,252,0.9)", 6);
  line(c, [[540, 715], [485, 390]], 6); line(c, [[588, 730], [672, 592]], 6);
  shape(c, () => ell(c, 720, 360, 240, 240), "#f3eefc", 8);
  const rd = rnd(21);
  for (let i = 0; i < 16; i++) {
    const a = rd() * Math.PI * 2, d = rd() * 170, x = 720 + Math.cos(a) * d, y = 360 + Math.sin(a) * d, rot = rd() * Math.PI;
    c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -45, -15, 90, 30, 15), "#ef8fb5", 4); line(c, [[-10, -2], [12, 2]], 3, "#c24f82"); c.restore();
  }
};
// Antibiotic: a mould in the middle of a dish and a clear ring where the bacteria cannot grow
const term12 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 575, 410, 400);
  shape(c, () => ell(c, 540, 540, 410, 410), COL.steelIn, 8);
  shape(c, () => ell(c, 540, 540, 385, 385), "#f1e7b8", 5);
  const rd = rnd(8);
  for (let i = 0; i < 520; i++) { const a = rd() * Math.PI * 2, d = 200 + Math.sqrt(rd()) * 175; shape(c, () => ell(c, 540 + Math.cos(a) * d, 540 + Math.sin(a) * d, 9, 9), "#d9b24f", 2); }
  mould(c, 540, 540, 110, 2);
};
// Spoilage: a chapati kept damp in a closed box has grown mould
const term10 = (c: Ctx) => {
  ground(c); floorAt(c, 850);
  shadow(c, 560, 858, 380, 20);
  shape(c, () => rrect(c, 160, 420, 760, 430, 20), COL.steelIn, 6);
  shape(c, () => ell(c, 540, 660, 300, 115), "#e9cf98", 5);
  const rd = rnd(4); for (let k = 0; k < 10; k++) shape(c, () => ell(c, 290 + rd() * 500, 590 + rd() * 140, 12, 7), "#c9a060", 0);
  mould(c, 470, 640, 70, 3); mould(c, 650, 690, 55, 6); mould(c, 380, 700, 40, 9);
  shape(c, () => rrect(c, 160, 420, 760, 430, 20), "rgba(214,236,250,0.45)", 0);
  shine(c, [[200, 500], [200, 780]], 9);
  shape(c, () => rrect(c, 140, 380, 800, 54, 14), "#8fb8e0", 6);
};
// Fermented or spoiled: curd yes, mouldy bread no
const expl6 = (c: Ctx) => {
  ground(c); floorAt(c, 760);
  bowl(c, 290, 560, 200, CURD);
  bowl(c, 790, 560, 200);
  shape(c, () => { c.moveTo(690, 560); c.lineTo(690, 470); c.quadraticCurveTo(690, 400, 740, 410); c.quadraticCurveTo(790, 380, 840, 410); c.quadraticCurveTo(890, 400, 890, 470); c.lineTo(890, 560); c.closePath(); }, "#e3bb78", 5);
  shape(c, () => { c.moveTo(708, 560); c.lineTo(708, 475); c.quadraticCurveTo(708, 428, 745, 432); c.quadraticCurveTo(790, 408, 835, 432); c.quadraticCurveTo(872, 428, 872, 475); c.lineTo(872, 560); c.closePath(); }, "#f6e7c3", 0);
  mould(c, 760, 500, 40, 12); mould(c, 840, 530, 30, 14);
  line(c, [[215, 300], [275, 360], [370, 240]], 24, COL.green);
  line(c, [[730, 240], [850, 360]], 24, RED); line(c, [[850, 240], [730, 360]], 24, RED);
};

export const ic_microorganismsHelpfulMicrobesL4 = cards("sci.microorganisms.helpful-microbes.L4", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, e2s3, e2s4,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowP1, term0, term12, term10, expl6,
]);
