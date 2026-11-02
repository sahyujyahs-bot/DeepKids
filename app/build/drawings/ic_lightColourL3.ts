import type { Ctx } from "./core";
import { BG, COL, INK, RED, WHITE, arrow, cards, D, ell, glass, ground, hand, line, person, polyP, rnd, rrect, shadow, shape, write, SKIN, CLOTH, leaf, shade } from "./flatKit";

// LIGHT AND COLOUR L3 · picture cards for the unit's activities, words and ideas.
// Flat DeepKids style: bold ink outlines, flat colours, light from the upper left.

const SPEC = ["#e4523b", "#f39a3c", "#ffd34d", "#6aa53f", "#5b8fd6", "#8b6cc9"];
const WALL = "#f3e6c9", FLOOR = "#d9b98a", SUNY = "#ffd34d", BEAM = "#fff3b0", WOODT = "#ead2a0";

const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.65, y + Math.sin(a) * r * 1.65]], 9, "#f39a3c"); }
  shape(c, () => ell(c, x, y, r, r), SUNY, 6);
};
// a band of light from (x1,y1) to (x2,y2), widths w1 -> w2
const band = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w1: number, w2: number, col: string, alpha = 0.9) => {
  const a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a), ny = Math.cos(a);
  c.globalAlpha = alpha; c.beginPath(); polyP(c, [[x1 + nx * w1 / 2, y1 + ny * w1 / 2], [x2 + nx * w2 / 2, y2 + ny * w2 / 2], [x2 - nx * w2 / 2, y2 - ny * w2 / 2], [x1 - nx * w1 / 2, y1 - ny * w1 / 2]]); c.fillStyle = col; c.fill(); c.globalAlpha = 1;
};
// six colour bands fanning out from a point toward a target, red least bent, violet most (spread = gap between bands)
const fan = (c: Ctx, ox: number, oy: number, tx: number, ty: number, gap: number, w0 = 12, w1 = 40) => {
  SPEC.forEach((col, i) => { const o = (i - 2.5) * gap; band(c, ox, oy, tx, ty + o, w0, w1, col, 0.92); });
};
// six stripes in a block: horizontal stripes if wide, outlined
const stripes = (c: Ctx, x: number, y: number, w: number, h: number, vertical = false) => {
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 14); c.clip();
  SPEC.forEach((col, i) => { c.fillStyle = col; if (vertical) c.fillRect(x + (w / 6) * i - 1, y, w / 6 + 2, h); else c.fillRect(x, y + (h / 6) * i - 1, w, h / 6 + 2); });
  c.restore(); c.beginPath(); rrect(c, x, y, w, h, 14); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
const gradStrip = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const g = c.createLinearGradient(x, 0, x + w, 0); SPEC.forEach((col, i) => g.addColorStop(i / 5, col));
  shape(c, () => rrect(c, x, y, w, h, 16), g as unknown as string, 6);
};
const torch = (c: Ctx, x: number, y: number, an: number, s = 1) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -110, -26, 110, 52, 12), COL.blue, 6);
  shape(c, () => polyP(c, [[0, -26], [44, -48], [44, 48], [0, 26]]), COL.steel, 6);
  shape(c, () => ell(c, 44, 0, 10, 40), BEAM, 5); c.restore();
};
const prism = (c: Ctx, x: number, y: number, s: number, flip = false) => {
  const h = s * 0.866, sg = flip ? -1 : 1;
  const p = () => polyP(c, [[x, y - sg * h * 0.55], [x + s / 2, y + sg * h * 0.45], [x - s / 2, y + sg * h * 0.45]]);
  shape(c, p, "rgba(214,236,250,0.78)", 7);
  c.beginPath(); c.moveTo(x - s * 0.18, y + sg * h * 0.2); c.lineTo(x - s * 0.02, y - sg * h * 0.2); c.strokeStyle = WHITE; c.lineWidth = 8; c.lineCap = "round"; c.globalAlpha = 0.8; c.stroke(); c.globalAlpha = 1;
};
const tableRow = (c: Ctx, y: number) => { c.fillStyle = WOODT; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); line(c, [[0, y + 120], [D, y + 126]], 3, "rgba(160,110,50,0.25)"); };
const eye = (c: Ctx, x: number, y: number, s = 1) => { shape(c, () => ell(c, x, y, 50 * s, 32 * s), WHITE, 6); shape(c, () => ell(c, x + 6 * s, y, 20 * s, 20 * s), COL.brown, 4); shape(c, () => ell(c, x + 8 * s, y, 9 * s, 9 * s), INK, 0); };
const thermo = (c: Ctx, x: number, y: number, h: number, level: number) => {
  shape(c, () => rrect(c, x - 18, y - h, 36, h, 16), WHITE, 6);
  line(c, [[x, y - 10], [x, y - h * level]], 12, RED);
  shape(c, () => ell(c, x, y + 4, 28, 28), RED, 6);
  for (let i = 1; i < 6; i++) line(c, [[x + 18, y - h * 0.12 - i * h * 0.13], [x + 32, y - h * 0.12 - i * h * 0.13]], 3);
};
const mirror = (c: Ctx, x: number, y: number, w: number, h: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -w / 2, -h, w, h, 8), COL.steelDk, 6); shape(c, () => rrect(c, -w / 2 + 10, -h + 10, w - 20, h - 20, 4), "#e4f1fb", 3);
  line(c, [[-w / 2 + 28, -h + 24], [-w / 2 + 70, -h + 24]], 6, WHITE); c.restore();
};

// ------------------------------------------------------------------ flows
// e1 The Water Prism: a glass of water splits the sunbeam into a rainbow on paper
const e1 = (c: Ctx) => {
  ground(c, WALL); tableRow(c, 640);
  sun(c, 110, 110, 56);
  band(c, 150, 170, 330, 480, 28, 28, BEAM, 0.95);
  glass(c, 380, 700, 240, 340, 0.9);
  fan(c, 360, 640, 760, 880, 28, 14, 44);
  shape(c, () => polyP(c, [[560, 850], [960, 850], [1010, 960], [510, 960]]), WHITE, 6);
  stripes(c, 600, 870, 330, 60, true);
};
// e2 Spray rainbow: child with spray bottle, sun behind, rainbow in the mist
const e2 = (c: Ctx) => {
  ground(c, "#cfe9f7"); c.fillStyle = "#8cc063"; c.fillRect(0, 840, D, 240); line(c, [[0, 840], [D, 840]], 6);
  sun(c, 110, 120, 62);
  const r = rnd(5);
  for (let i = 0; i < 70; i++) { const x = 520 + r() * 460, y = 520 + r() * 300; c.globalAlpha = 0.75; shape(c, () => ell(c, x, y, 7, 7), WHITE, 0); }
  c.globalAlpha = 0.9; c.lineCap = "butt";
  SPEC.forEach((col, i) => { c.beginPath(); c.arc(700, 880, 320 - i * 24, Math.PI * 1.1, Math.PI * 1.9); c.strokeStyle = col; c.lineWidth = 28; c.stroke(); });
  c.globalAlpha = 1;
  person(c, 230, 940, 500, { armR: [-0.15, 0.0] });
  // spray bottle at the hand
  shape(c, () => rrect(c, 395, 520, 70, 120, 14), COL.teal, 6);
  shape(c, () => rrect(c, 380, 490, 120, 48, 12), COL.tealDk, 6);
  shape(c, () => rrect(c, 495, 500, 40, 24, 8), COL.steel, 5);
  arrow(c, [[560, 520], [640, 560]], RED, 8);
};
// e3 Newton's wheel: coloured disc, then spun it looks pale
const disc = (c: Ctx, x: number, y: number, r: number, cols: string[]) => {
  cols.forEach((col, i) => { const a0 = (i / cols.length) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / cols.length) * Math.PI * 2 - Math.PI / 2; c.beginPath(); c.moveTo(x, y); c.arc(x, y, r, a0, a1); c.closePath(); c.fillStyle = col; c.fill(); });
  c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
  shape(c, () => ell(c, x, y, 14, 14), WHITE, 5);
};
// e3 Newton's wheel: coloured disc, then spun it looks pale
const e3 = (c: Ctx) => {
  ground(c); shadow(c, 270, 830, 210, 34); disc(c, 270, 560, 220, SPEC);
  shadow(c, 800, 830, 210, 34); disc(c, 800, 560, 220, ["#f4efe6"]);
  for (const k of [0, 1]) { c.beginPath(); c.arc(800, 560, 250 + k * 28, -0.5 + k * 0.3, 0.7 - k * 0.2); c.strokeStyle = COL.steelDk; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
  arrow(c, [[500, 560], [570, 560]], RED, 10);
};
// a1 Catch a rainbow on the floor: glass on a sill, rainbow patch on the floor, child watching
const a1 = (c: Ctx) => {
  ground(c, WALL); c.fillStyle = FLOOR; c.fillRect(0, 760, D, 320); line(c, [[0, 760], [D, 760]], 6);
  shape(c, () => rrect(c, 40, 420, 460, 40, 8), "#f2c063", 6);
  sun(c, 110, 100, 54);
  band(c, 150, 160, 270, 380, 24, 24, BEAM, 0.95);
  glass(c, 270, 420, 150, 220, 0.9);
  fan(c, 280, 390, 520, 840, 26, 12, 34);
  c.save(); c.translate(540, 855); c.scale(1, 0.36); c.beginPath(); c.rect(-200, -80, 400, 160); c.restore();
  shape(c, () => polyP(c, [[420, 830], [640, 830], [680, 900], [380, 900]]), WHITE, 5);
  stripes(c, 438, 840, 224, 50, true);
  person(c, 840, 1010, 520, { armL: [1.2, 1.5], sit: false });
};
// a2 Colour filters: three lanes, white in, one colour out
const a2 = (c: Ctx) => {
  ground(c);
  const lanes = [[260, "#e4523b", "rgba(228,82,59,0.6)"], [540, "#6aa53f", "rgba(106,165,63,0.6)"], [820, "#5b8fd6", "rgba(91,143,214,0.6)"]] as const;
  for (const [y, col, tr] of lanes) {
    band(c, 30, y, 330, y, 70, 70, BEAM, 0.95); band(c, 390, y, 770, y, 70, 70, col, 0.95);
    shape(c, () => rrect(c, 330, y - 100, 60, 200, 10), tr, 6);
    shape(c, () => ell(c, 880, y, 80, 80), col, 6);
  }
};
// a3 Bubble and CD rainbows
const a3 = (c: Ctx) => {
  ground(c);
  shadow(c, 320, 800, 180, 26);
  shape(c, () => ell(c, 300, 520, 210, 210), "rgba(214,236,250,0.5)", 7);
  c.lineCap = "round";
  [["#f29ab4", 3.3, 4.4], ["#6aa53f", 4.4, 5.3], ["#5b8fd6", 5.3, 6.2], ["#ffd34d", 0.2, 1.0], ["#8b6cc9", 1.0, 1.8]].forEach(([col, a0, a1], i) => { c.beginPath(); c.arc(300, 520, 178 - (i % 2) * 22, a0 as number, a1 as number); c.strokeStyle = col as string; c.lineWidth = 22; c.stroke(); });
  c.beginPath(); c.arc(300, 520, 212, 3.6, 4.4); c.strokeStyle = WHITE; c.lineWidth = 12; c.stroke();
  // CD
  const cx = 810, cy = 560, R = 210;
  shadow(c, cx + 20, cy + R * 0.95, R, 34);
  shape(c, () => ell(c, cx, cy, R, R), COL.steel, 7);
  for (const base of [-0.9, 2.24]) SPEC.forEach((col, i) => { c.beginPath(); c.arc(cx, cy, R - 8 - i * 0, base, base + 0.75); c.arc(cx, cy, 70, base + 0.75, base, true); c.closePath(); c.globalAlpha = 0.0; c.fill(); c.globalAlpha = 1; });
  for (const base of [-0.9, 2.24]) SPEC.forEach((col, i) => { const r0 = 72 + i * 22, r1 = r0 + 22; c.beginPath(); c.arc(cx, cy, r1, base, base + 0.9); c.arc(cx, cy, r0, base + 0.9, base, true); c.closePath(); c.fillStyle = col; c.globalAlpha = 0.9; c.fill(); c.globalAlpha = 1; });
  c.beginPath(); ell(c, cx, cy, R, R); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
  shape(c, () => ell(c, cx, cy, 52, 52), BG, 6); shape(c, () => ell(c, cx, cy, 24, 24), WHITE, 3);
};
// a4 Where does green end: a continuous strip and three different green brackets
const a4 = (c: Ctx) => {
  ground(c); gradStrip(c, 90, 220, 900, 240);
  const rows: [number, number, number, string][] = [[420, 640, 580, COL.pink], [480, 720, 700, COL.teal], [360, 590, 820, COL.purple]];
  rows.forEach(([x0, x1, y, col]) => { line(c, [[x0, y], [x1, y]], 18, col); line(c, [[x0, y - 36], [x0, y + 36]], 8, col); line(c, [[x1, y - 36], [x1, y + 36]], 8, col); });
};
// a5 Sky colour diary: noon sky and sunset sky, a notebook
const skyPanel = (c: Ctx, x: number, y: number, w: number, h: number, top: string, bot: string, sunY: number, sunCol: string, hills: boolean) => {
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 20); c.clip();
  const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, top); g.addColorStop(1, bot); c.fillStyle = g; c.fillRect(x, y, w, h);
  shape(c, () => ell(c, x + w / 2, sunY, 54, 54), sunCol, 5);
  if (hills) { c.fillStyle = "#4a4a6a"; c.beginPath(); c.moveTo(x, y + h); c.lineTo(x, y + h - 70); c.quadraticCurveTo(x + w * 0.3, y + h - 130, x + w * 0.55, y + h - 60); c.quadraticCurveTo(x + w * 0.8, y + h - 110, x + w, y + h - 50); c.lineTo(x + w, y + h); c.fill(); }
  c.restore(); c.beginPath(); rrect(c, x, y, w, h, 20); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
};
const a5 = (c: Ctx) => {
  ground(c);
  skyPanel(c, 70, 90, 440, 520, "#5b9ee0", "#bfe0f5", 190, "#fff6c2", false);
  skyPanel(c, 570, 90, 440, 520, "#8b6cc9", "#f39a3c", 470, "#ffd34d", true);
  shadow(c, 540, 975, 400, 30);
  shape(c, () => rrect(c, 140, 670, 800, 300, 18), COL.paper, 6);
  line(c, [[540, 670], [540, 970]], 5);
  [200, 260, 320].forEach((x, i) => { line(c, [[x - 20 + 0, 730 + i * 0], [x + 160, 730]], 0); });
  shape(c, () => rrect(c, 190, 720, 130, 100, 10), "#5b9ee0", 5); shape(c, () => rrect(c, 340, 720, 130, 100, 10), "#bfe0f5", 5);
  shape(c, () => rrect(c, 610, 720, 130, 100, 10), "#f39a3c", 5); shape(c, () => rrect(c, 760, 720, 130, 100, 10), "#8b6cc9", 5);
  for (const x of [190, 610]) for (const y of [860, 900]) line(c, [[x, y], [x + 280, y]], 5, COL.greyDk);
};
// p1 Shoebox spectroscope, seen from above, lid off
const p1 = (c: Ctx) => {
  ground(c); shadow(c, 540, 770, 420, 36);
  shape(c, () => polyP(c, [[200, 360], [880, 360], [880, 700], [200, 700]]), "#5d4f7a", 8);
  shape(c, () => polyP(c, [[250, 410], [830, 410], [830, 650], [250, 650]]), "#3b3150", 4);
  // slit on the right wall (gap in wall), lamp outside
  shape(c, () => polyP(c, [[870, 515], [890, 515], [890, 545], [870, 545]]), BEAM, 0);
  shape(c, () => ell(c, 985, 530, 54, 54), BEAM, 6); line(c, [[985, 584], [985, 640]], 14); 
  band(c, 925, 530, 700, 530, 24, 24, BEAM, 0.9);
  // CD piece
  c.save(); c.translate(540, 520); c.rotate(-0.6); shape(c, () => rrect(c, -14, -70, 28, 140, 6), COL.steel, 5); c.restore();
  fan(c, 520, 545, 270, 600, 18, 8, 30);
  // eye at the peephole in the left-bottom wall
  shape(c, () => rrect(c, 192, 585, 26, 52, 4), BG, 0);
  eye(c, 110, 670, 1.0);
  arrow(c, [[160, 560], [130, 600]], RED, 8);
};
// c1 Biggest rainbow indoors
const c1 = (c: Ctx) => {
  ground(c, WALL); c.fillStyle = FLOOR; c.fillRect(0, 800, D, 280); line(c, [[0, 800], [D, 800]], 6);
  stripes(c, 300, 120, 700, 260);
  sun(c, 100, 100, 50);
  band(c, 130, 150, 190, 770, 0, 0, BEAM, 0);
  shape(c, () => polyP(c, [[60, 880], [400, 880], [440, 960], [30, 960]]), COL.steel, 6);
  shape(c, () => polyP(c, [[85, 890], [380, 890], [405, 935], [60, 935]]), COL.water, 4);
  band(c, 140, 150, 200, 800, 26, 26, BEAM, 0.9);
  mirror(c, 220, 905, 150, 110, 0.3);
  fan(c, 230, 800, 300, 380, 28, 14, 20);
  person(c, 800, 1000, 480, { armL: [-1.1, -1.3], armR: [-1.1, -1.3] });
  arrow(c, [[300, 80], [1000, 80]], RED, 10); arrow(c, [[1000, 80], [300, 80]], RED, 10);
};
// c2 Rainbow forecaster: sun behind the child, rain ahead
const c2 = (c: Ctx) => {
  ground(c, "#cfe9f7"); c.fillStyle = "#8cc063"; c.fillRect(0, 860, D, 220); line(c, [[0, 860], [D, 860]], 6);
  sun(c, 90, 230, 58);
  shape(c, () => { c.moveTo(640, 220); c.bezierCurveTo(580, 220, 580, 320, 650, 320); c.bezierCurveTo(660, 380, 780, 390, 810, 330); c.bezierCurveTo(900, 350, 960, 280, 900, 230); c.bezierCurveTo(920, 150, 800, 150, 780, 200); c.bezierCurveTo(740, 150, 650, 160, 640, 220); c.closePath(); }, "#8f98a8", 6);
  c.globalAlpha = 0.9; c.lineCap = "butt";
  SPEC.forEach((col, i) => { c.beginPath(); c.arc(640, 880, 350 - i * 20, Math.PI * 1.05, Math.PI * 1.95); c.strokeStyle = col; c.lineWidth = 22; c.stroke(); });
  c.globalAlpha = 1;
  const r = rnd(9); for (let i = 0; i < 22; i++) { const x = 640 + r() * 280, y = 390 + r() * 400; line(c, [[x, y], [x - 8, y + 30]], 5, COL.blueDk); }
  [[520, 850], [840, 850], [960, 850]].forEach(([x, y]) => { shape(c, () => rrect(c, x - 40, y - 80, 80, 80, 4), "#f2c063", 5); shape(c, () => polyP(c, [[x - 50, y - 80], [x, y - 125], [x + 50, y - 80]]), COL.red, 5); });
  person(c, 270, 1020, 480, { armR: [-0.2, -0.1] });
};

// ------------------------------------------------------------------ terms
// term.1 White light: a white beam with coloured threads twisted inside it
const t1 = (c: Ctx) => {
  ground(c, "#3b3150"); sun(c, 110, 540, 60);
  shape(c, () => rrect(c, 230, 400, 780, 280, 70), WHITE, 7);
  c.save(); c.beginPath(); rrect(c, 230, 400, 780, 280, 70); c.clip();
  SPEC.forEach((col, i) => { c.beginPath(); for (let x = 220; x <= 1020; x += 8) { const y = 540 + Math.sin((x - 230) / 70 + i * 1.05) * 80; x === 220 ? c.moveTo(x, y) : c.lineTo(x, y); } c.strokeStyle = col; c.lineWidth = 22; c.lineCap = "round"; c.stroke(); });
  c.restore(); c.beginPath(); rrect(c, 230, 400, 780, 280, 70); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
};
// term.2 Colour: mango, leaf, blue kite
const t2 = (c: Ctx) => {
  ground(c); shadow(c, 300, 850, 150, 26);
  shape(c, () => { c.moveTo(300, 480); c.bezierCurveTo(130, 520, 150, 840, 320, 840); c.bezierCurveTo(480, 840, 470, 520, 300, 480); c.closePath(); }, "#ffbf3c", 7);
  shade(c, () => { c.moveTo(300, 480); c.bezierCurveTo(130, 520, 150, 840, 320, 840); c.bezierCurveTo(480, 840, 470, 520, 300, 480); c.closePath(); }, "#e8892c", 50, 20, 0.4);
  leaf(c, 300, 490, 130, -0.7, COL.leaf);
  leaf(c, 560, 800, 380, -1.2, COL.leaf);
  line(c, [[560, 800], [545, 880]], 10, COL.leafDk);
  // kite
  shape(c, () => polyP(c, [[800, 120], [940, 270], [800, 470], [660, 270]]), COL.blue, 7);
  shade(c, () => polyP(c, [[800, 120], [940, 270], [800, 470], [660, 270]]), COL.blueDk, 90, 0, 0.6);
  line(c, [[800, 120], [800, 470]], 5); line(c, [[660, 270], [940, 270]], 5);
  c.beginPath(); c.moveTo(800, 470); c.bezierCurveTo(740, 560, 880, 620, 800, 740); c.bezierCurveTo(760, 790, 840, 830, 790, 880); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  [[790, 575, COL.red], [820, 680, COL.yellow]].forEach(([x, y, col]) => shape(c, () => polyP(c, [[x as number - 26, y as number - 20], [x as number + 26, y as number - 20], [x as number, y as number + 26]]), col as string, 5));
};
// term.4 Spectrum: a smooth strip with no gaps
const t4 = (c: Ctx) => { ground(c); gradStrip(c, 80, 330, 920, 420); };
// term.6 Bend: beam enters water and turns toward the vertical
const t6 = (c: Ctx) => {
  ground(c); const sy = 520;
  shape(c, () => rrect(c, 40, sy, 1000, 520, 24), COL.water, 7);
  c.fillStyle = COL.waterDk; c.globalAlpha = 0.35; c.fillRect(46, sy + 300, 988, 214); c.globalAlpha = 1;
  torch(c, 230, 220, 0.9, 1);
  const px = 560;
  band(c, 290, 255, px, sy, 26, 26, BEAM, 1);
  band(c, px, sy, 700, 1000, 26, 26, BEAM, 1);
  c.setLineDash([16, 14]); line(c, [[px, sy], [840, 820]], 5, COL.greyDk); c.setLineDash([]);
  arrow(c, [[720, 700], [690, 800]], RED, 10);
};
// term.7 Reflect: beam bounces off a mirror
const t7 = (c: Ctx) => {
  ground(c); tableRow(c, 800);
  torch(c, 220, 260, 0.62, 1);
  band(c, 270, 290, 540, 770, 26, 26, BEAM, 1);
  band(c, 540, 770, 870, 330, 26, 26, BEAM, 1);
  shape(c, () => polyP(c, [[300, 800], [800, 800], [880, 880], [220, 880]]), "#e4f1fb", 7);
  line(c, [[340, 826], [460, 826]], 7, WHITE);
  arrow(c, [[760, 470], [830, 380]], RED, 10);
};
// term.10 Filter: white beam through red sheet, comes out red
const t10 = (c: Ctx) => {
  ground(c, "#3b3150");
  torch(c, 200, 540, 0, 1);
  band(c, 250, 540, 520, 540, 70, 70, BEAM, 1);
  band(c, 580, 540, 800, 540, 70, 70, "#e4523b", 1);
  shape(c, () => rrect(c, 490, 400, 100, 280, 12), "rgba(228,82,59,0.65)", 7);
  shape(c, () => ell(c, 900, 540, 70, 70), "#e4523b", 6);
};
// term.11 Wavelength: long red waves, short violet waves
const wave = (c: Ctx, y: number, len: number, amp: number, col: string) => {
  c.beginPath(); for (let x = 90; x <= 990; x += 4) { const yy = y + Math.sin(((x - 90) / len) * Math.PI * 2) * amp; x === 90 ? c.moveTo(x, yy) : c.lineTo(x, yy); }
  c.strokeStyle = INK; c.lineWidth = 26; c.lineCap = "round"; c.stroke(); c.strokeStyle = col; c.lineWidth = 14; c.stroke();
};
const t11 = (c: Ctx) => {
  ground(c); wave(c, 300, 450, 90, SPEC[0]); wave(c, 780, 150, 90, SPEC[5]);
  line(c, [[90, 440], [540, 440]], 6); line(c, [[90, 420], [90, 460]], 6); line(c, [[540, 420], [540, 460]], 6);
  line(c, [[90, 920], [240, 920]], 6); line(c, [[90, 900], [90, 940]], 6); line(c, [[240, 900], [240, 940]], 6);
};
// term.13 Ultraviolet: a bee over a flower with a bullseye only bees see
const t13 = (c: Ctx) => {
  ground(c, "#cfe9f7");
  line(c, [[430, 1000], [430, 600]], 22, COL.greenDk); leaf(c, 430, 860, 200, -0.3, COL.leaf);
  for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; shape(c, () => ell(c, 430 + Math.cos(a) * 130, 480 + Math.sin(a) * 130, 85, 55, a), SUNY, 6); }
  shape(c, () => ell(c, 430, 480, 105, 105), "#8b6cc9", 6); shape(c, () => ell(c, 430, 480, 55, 55), "#2b2340", 5);
  // bee
  c.save(); c.translate(780, 230); c.rotate(0.35);
  for (const dx of [-30, 40]) { shape(c, () => ell(c, dx, -110, 55, 90, dx > 0 ? 0.4 : -0.4), "rgba(255,255,255,0.8)", 5); }
  for (const lx of [-50, 0, 50]) line(c, [[lx, 70], [lx - 10, 125]], 8);
  shape(c, () => ell(c, 0, 0, 140, 85), SUNY, 7);
  for (const x of [-30, 30, 80]) line(c, [[x, -78], [x, 78]], 22, INK);
  shape(c, () => ell(c, -140, 5, 62, 55), "#3a3540", 6);
  shape(c, () => ell(c, -158, -5, 10, 10), WHITE, 0);
  c.restore();
  arrow(c, [[690, 330], [580, 410]], RED, 10);
};
// lights on a dark wall: red, green, blue circles overlapping to white
const lights = (c: Ctx, cx: number, cy: number, r: number) => {
  c.save(); c.beginPath(); rrect(c, cx - r * 1.9, cy - r * 1.75, r * 3.8, r * 3.5, 24); c.fillStyle = "#16121f"; c.fill(); c.clip();
  c.globalCompositeOperation = "lighter";
  [["#ff0000", -0.55, -0.35], ["#00ff00", 0.55, -0.35], ["#0000ff", 0, 0.6]].forEach(([col, dx, dy]) => { c.beginPath(); ell(c, cx + (dx as number) * r, cy + (dy as number) * r, r, r); c.fillStyle = col as string; c.fill(); });
  c.restore(); c.beginPath(); rrect(c, cx - r * 1.9, cy - r * 1.75, r * 3.8, r * 3.5, 24); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
};
const t14 = (c: Ctx) => { ground(c); lights(c, 540, 470, 215); };
// term.18 Absorb: sunlight goes into a black tawa, heat comes out
const tawa = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + 20 * s, y + 70 * s, 300 * s, 36 * s);
  shape(c, () => rrect(c, x + 280 * s, y - 24 * s, 320 * s, 48 * s, 20 * s), COL.brown, 6);
  shape(c, () => ell(c, x, y, 320 * s, 90 * s), "#3a3540", 7);
  shape(c, () => ell(c, x, y - 6 * s, 270 * s, 62 * s), "#262230", 4);
  line(c, [[x - 190 * s, y - 28 * s], [x - 90 * s, y - 40 * s]], 7 * s, "#6a6478");
};
const t18 = (c: Ctx) => {
  ground(c); sun(c, 150, 130, 60); tawa(c, 470, 720, 1);
  [[250, 220, 330, 640], [330, 180, 470, 640], [420, 170, 620, 650]].forEach((p) => arrow(c, [[p[0], p[1]], [p[2], p[3]]], "#f39a3c", 12));
  [[640, 560], [740, 560], [840, 560]].forEach(([x, y]) => arrow(c, [[x, y], [x + 22, y - 40], [x - 18, y - 90], [x + 14, y - 150], [x - 2, y - 190]], RED, 9));
};
// term.20 Mixing paint: yellow, blue, green where they meet, muddy brown
const t20 = (c: Ctx) => {
  ground(c); shadow(c, 560, 860, 420, 40);
  const pal = () => { c.moveTo(150, 460); c.bezierCurveTo(150, 190, 600, 140, 860, 250); c.bezierCurveTo(1010, 330, 990, 540, 830, 700); c.bezierCurveTo(700, 840, 540, 800, 480, 720); c.bezierCurveTo(420, 650, 330, 680, 260, 720); c.bezierCurveTo(160, 740, 150, 560, 150, 460); c.closePath(); };
  shape(c, pal, "#f2c063", 8);
  shape(c, () => ell(c, 570, 590, 36, 36), BG, 6);
  shape(c, () => ell(c, 290, 350, 76, 62), "#ffd34d", 6);
  shape(c, () => ell(c, 500, 305, 76, 62), "#5b8fd6", 6);
  shape(c, () => { c.moveTo(420, 335); c.bezierCurveTo(420, 270, 540, 270, 570, 330); c.bezierCurveTo(560, 400, 450, 400, 420, 335); c.closePath(); }, "#6aa53f", 6);
  shape(c, () => ell(c, 770, 360, 85, 70), "#e4523b", 6);
  shape(c, () => ell(c, 720, 520, 95, 78), "#6d4a35", 6);
  shape(c, () => ell(c, 270, 520, 70, 55), "#8b6cc9", 6);
};

// ------------------------------------------------------------------ explanations
// expl.1 What a prism does
const x1 = (c: Ctx) => {
  ground(c, "#3b3150"); band(c, 40, 520, 410, 560, 30, 30, WHITE, 1);
  fan(c, 560, 560, 1000, 640, 60, 14, 50);
  prism(c, 480, 540, 330);
  sun(c, 90, 400, 48);
};
// expl.2 A raindrop splits the sunbeam
const x2 = (c: Ctx) => {
  ground(c, "#cfe9f7"); sun(c, 90, 180, 52);
  const cx = 600, cy = 460, R = 280;
  const P1 = [370, 299], P2 = [867, 378], P3 = [500, 722];
  band(c, 150, 299, P1[0], P1[1], 24, 24, WHITE, 1);
  shape(c, () => ell(c, cx, cy, R, R), "rgba(143,195,234,0.55)", 8);
  line(c, [P1, P2, P3], 22, WHITE);
  band(c, P3[0], P3[1], 300, 900, 16, 50, SPEC[0], 0.95);
  band(c, P3[0], P3[1], 190, 880, 16, 50, SPEC[5], 0.95);
  arrow(c, [[560, 600], [520, 680]], RED, 8);
};
// expl.8 Past the ends: thermometers on a spectrum
const x8 = (c: Ctx) => {
  ground(c, "#e9dcc0"); tableRow(c, 700);
  shape(c, () => rrect(c, 90, 745, 330, 160, 16), "#3b3150", 6);
  gradStrip(c, 420, 745, 560, 160);
  thermo(c, 250, 735, 400, 0.65); thermo(c, 520, 735, 400, 0.42); thermo(c, 880, 735, 400, 0.22);
};
// expl.9 Why things have colours
const x9 = (c: Ctx) => {
  ground(c); sun(c, 100, 110, 56);
  leaf(c, 220, 800, 640, -0.14, COL.leaf);
  arrow(c, [[200, 200], [440, 610]], RED, 12);
  arrow(c, [[300, 160], [560, 640]], COL.blue, 12);
  arrow(c, [[400, 130], [690, 640]], COL.green, 12);
  arrow(c, [[700, 630], [830, 430], [930, 330]], COL.green, 12);
  eye(c, 960, 280, 0.9);
};
// expl.10 Two prisms put the colours back together
const x10 = (c: Ctx) => {
  ground(c, "#3b3150"); band(c, 20, 540, 200, 540, 28, 28, WHITE, 1);
  SPEC.forEach((col, i) => { const o = (i - 2.5) * 34; line(c, [[330, 540 + o * 0.15], [550, 540 + o]], 16, col); line(c, [[550, 540 + o], [630, 540 + o]], 16, col); line(c, [[630, 540 + o], [800, 540 + o * 0.15]], 16, col); });
  prism(c, 270, 540, 240); prism(c, 700, 540, 240, true);
  band(c, 800, 540, 1060, 540, 30, 30, WHITE, 1);
};
// expl.13 Sky blue at noon, red at sunset
const x13 = (c: Ctx) => {
  ground(c, "#2b2340");
  shape(c, () => ell(c, 540, 800, 262, 262), "#bfe0f5", 0);
  shape(c, () => ell(c, 540, 800, 230, 230), "#3f6fb3", 6);
  sun(c, 540, 110, 52);
  band(c, 540, 170, 540, 560, 40, 40, SUNY, 0.9);
  arrow(c, [[500, 400], [400, 380]], COL.blue, 8); arrow(c, [[580, 300], [680, 280]], COL.blue, 8);
  person(c, 540, 580, 120);
  sun(c, 970, 721, 50);
  band(c, 920, 721, 880, 721, 36, 36, "#f39a3c", 0.95); band(c, 880, 721, 800, 721, 36, 36, RED, 0.95);
  arrow(c, [[900, 700], [900, 610]], COL.blue, 8);
  person(c, 760, 726, 120);
};
// expl.14 Mixing light vs mixing paint
const x14 = (c: Ctx) => {
  ground(c);
  lights(c, 270, 390, 120);
  c.save(); c.translate(560, 190); c.scale(0.52, 0.52);
  const pal = () => { c.moveTo(150, 460); c.bezierCurveTo(150, 190, 600, 140, 860, 250); c.bezierCurveTo(1010, 330, 990, 540, 830, 700); c.bezierCurveTo(700, 840, 540, 800, 480, 720); c.bezierCurveTo(420, 650, 330, 680, 260, 720); c.bezierCurveTo(160, 740, 150, 560, 150, 460); c.closePath(); };
  shape(c, pal, "#f2c063", 10); shape(c, () => ell(c, 570, 590, 36, 36), BG, 6);
  shape(c, () => ell(c, 300, 360, 76, 62), "#ffd34d", 8); shape(c, () => ell(c, 500, 310, 76, 62), "#5b8fd6", 8);
  shape(c, () => ell(c, 770, 360, 85, 70), "#e4523b", 8); shape(c, () => ell(c, 640, 540, 110, 90), "#6d4a35", 8);
  c.restore();
  shape(c, () => ell(c, 270, 800, 70, 70), WHITE, 6);
  shape(c, () => ell(c, 770, 800, 70, 70), "#6d4a35", 6);
  line(c, [[500, 640], [540, 640]], 8); line(c, [[520, 620], [520, 660]], 8);
};
// expl.12 Rainbows of stars: a spectrum crossed by dark lines, looked at through a magnifying glass
const x12 = (c: Ctx) => {
  ground(c, "#2b2340"); sun(c, 100, 150, 52);
  gradStrip(c, 80, 300, 920, 300);
  c.save(); c.beginPath(); rrect(c, 80, 300, 920, 300, 16); c.clip();
  [[210, 10], [290, 22], [400, 8], [470, 26], [590, 10], [680, 16], [790, 8], [880, 20]].forEach(([x, w]) => { c.fillStyle = INK; c.fillRect(x, 300, w, 300); });
  c.restore();
  line(c, [[640, 740], [780, 900]], 26, COL.brown);
  shape(c, () => ell(c, 560, 660, 120, 120), "rgba(214,236,250,0.35)", 12);
};

export const ic_lightColourL3 = cards("sci.light.colour.L3 cards", [
  e1, e2, e3, a1, a2, a3, a4, a5, p1, c1, c2,
  t1, t2, t4, t6, t7, t10, t11, t13, t14, t18, t20,
  x1, x2, x12, x8, x9, x10, x13, x14,
]);
