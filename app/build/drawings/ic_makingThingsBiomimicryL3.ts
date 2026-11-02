import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, SH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards } from "./flatKit";

// BIOMIMICRY L3 picture cards: flows, terms and explanations.
const TABLE = "#e6d3b0", DOUGH = "#efd29a", DOUGHDK = "#d2ae6a", NEWS = "#f3efe6", BURR = "#9a6b3a", BURRDK = "#6f4a24";
const ink = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 8, INK); line(c, pts, w, col); };
const floor = (c: Ctx, y: number, col = TABLE) => { c.fillStyle = col; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };

// ------------------------------------------------------------ shared things
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.6, y + Math.sin(a) * r * 1.6]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow); shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.25, r * 0.25, 0.5);
};
const bulb = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = -2; i <= 2; i++) { const a = -Math.PI / 2 + i * 0.5; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 8, COL.orange); }
  shape(c, () => rrect(c, x - r * 0.4, y + r * 0.85, r * 0.8, r * 0.55, r * 0.12), COL.steel);
  shape(c, () => { c.moveTo(x - r * 0.4, y + r * 0.9); c.bezierCurveTo(x - r * 1.5, y - r * 0.3, x - r * 0.9, y - r * 1.5, x, y - r * 1.2); c.bezierCurveTo(x + r * 0.9, y - r * 1.5, x + r * 1.5, y - r * 0.3, x + r * 0.4, y + r * 0.9); c.closePath(); }, COL.yellow);
  line(c, [[x - r * 0.3, y + r * 0.7], [x - r * 0.15, y], [x, y + r * 0.2], [x + r * 0.15, y], [x + r * 0.3, y + r * 0.7]], 5, COL.orange);
  shine(c, [[x - r * 0.65, y - r * 0.5], [x - r * 0.4, y - r * 0.85]], 8);
};
// a burr: round seed head, spines with a hooked tip. hook = 0 plain spike .. 1 full hook
const burr = (c: Ctx, x: number, y: number, r: number, n = 20, hook = 1) => {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, ux = Math.cos(a), uy = Math.sin(a), px = -uy, py = ux, L = r * 0.55;
    const p0 = [x + ux * r * 0.85, y + uy * r * 0.85], p1 = [x + ux * (r + L), y + uy * (r + L)];
    const pts = [p0, p1, [p1[0] + px * L * 0.28 * hook + ux * L * 0.1, p1[1] + py * L * 0.28 * hook + uy * L * 0.1], [p1[0] + px * L * 0.3 * hook - ux * L * 0.25 * hook, p1[1] + py * L * 0.3 * hook - uy * L * 0.25 * hook]];
    ink(c, pts, Math.max(3, r * 0.05), BURRDK);
  }
  shape(c, () => ell(c, x, y, r, r), BURR, 5); shade(c, () => ell(c, x, y, r, r), BURRDK, r * 0.25, r * 0.25, 0.6);
};
const hookP = (x: number, y: number, h: number, s: number) => [[x, y], [x, y - h], [x + 0.35 * s, y - h - 0.45 * s], [x + 0.9 * s, y - h - 0.5 * s], [x + 1.2 * s, y - h - 0.1 * s], [x + 0.95 * s, y - h + 0.3 * s]];
// a strip of stiff hooks standing on a base at y; n hooks from x0 with spacing sp
const hooksRow = (c: Ctx, x0: number, y: number, n: number, sp: number, h: number, col = COL.teal) => { for (let i = 0; i < n; i++) ink(c, hookP(x0 + i * sp, y, h, h * 0.45), h * 0.1, col); };
const loopsRow = (c: Ctx, x0: number, y: number, n: number, sp: number, h: number, col = COL.pink) => { for (let i = 0; i < n; i++) { const x = x0 + i * sp; ink(c, [[x, y], [x - sp * 0.1, y - h * 0.8], [x + sp * 0.5, y - h * 1.15], [x + sp * 1.1, y - h * 0.8], [x + sp, y]], h * 0.09, col); } };
const velcroStrap = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, w * 0.04, h * 0.65, w * 0.55, h * 0.12);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h * 0.5, 8), COL.blue); shape(c, () => rrect(c, -w / 2, 0, w, h * 0.5, 8), COL.teal);
  for (let i = 0; i < 12; i++) line(c, [[-w / 2 + 14 + i * (w - 28) / 11, -h * 0.35], [-w / 2 + 14 + i * (w - 28) / 11, -h * 0.1]], 3, COL.blueDk);
  for (let i = 0; i < 12; i++) line(c, [[-w / 2 + 14 + i * (w - 28) / 11, h * 0.12], [-w / 2 + 22 + i * (w - 28) / 11, h * 0.36]], 3, COL.tealDk);
  c.restore();
};
const bead = (c: Ctx, x: number, y: number, rx: number, h: number) => {
  shadow(c, x + rx * 0.35, y + 4, rx * 1.05, 8);
  const body = () => { c.moveTo(x - rx, y); c.bezierCurveTo(x - rx * 1.05, y - h * 1.3, x + rx * 1.05, y - h * 1.3, x + rx, y); c.closePath(); };
  shape(c, body, COL.water, 5); shade(c, body, COL.waterDk, rx * 0.35, -h * 0.05, 0.7); shine(c, [[x - rx * 0.55, y - h * 0.55], [x - rx * 0.3, y - h * 0.85]], Math.max(5, rx * 0.12));
};
const ballDrop = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.35, y + 4, r * 1.05, 8);
  shape(c, () => ell(c, x, y - r, r, r), COL.water, 5); shade(c, () => ell(c, x, y - r, r, r), COL.waterDk, r * 0.3, r * 0.3, 0.7); shine(c, [[x - r * 0.55, y - r * 1.2], [x - r * 0.3, y - r * 1.6]], Math.max(5, r * 0.12));
};
const dropShape = (c: Ctx, x: number, y: number, s: number) => shape(c, () => { c.moveTo(x, y - s * 1.3); c.quadraticCurveTo(x + s * 0.2, y - s * 0.6, x + s * 0.8, y); c.arc(x, y, s * 0.8, 0, Math.PI); c.quadraticCurveTo(x - s * 0.2, y - s * 0.6, x, y - s * 1.3); c.closePath(); }, COL.water, 5);
const lens = (c: Ctx, x: number, y: number, r: number, inside: () => void) => {
  shape(c, () => ell(c, x, y, r, r), COL.sky, 0);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); inside(); c.restore();
  ink(c, [[x + r * 0.72, y + r * 0.72], [x + r * 1.55, y + r * 1.55]], r * 0.17, COL.woodDk);
  c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = INK; c.lineWidth = r * 0.17 + 8; c.stroke(); c.strokeStyle = COL.steel; c.lineWidth = r * 0.17; c.stroke();
  shine(c, [[x - r * 0.6, y - r * 0.3], [x - r * 0.3, y - r * 0.62]], 9);
};
const leafTop = (c: Ctx, x: number, y: number, s: number, rot: number, col = COL.leaf) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const b = () => { c.moveTo(0, 70); c.bezierCurveTo(-85, 30, -70, -60, 0, -100); c.bezierCurveTo(70, -60, 85, 30, 0, 70); c.closePath(); };
  shape(c, b, col, 5 / s); shade(c, b, COL.leafDk, 14, 12, 0.5); line(c, [[0, 66], [0, -80]], 3 / s, COL.leafDk);
  for (const k of [-40, -5, 30]) { line(c, [[0, k], [-38, k - 20]], 2.5 / s, COL.leafDk); line(c, [[0, k], [38, k - 20]], 2.5 / s, COL.leafDk); }
  c.restore();
};
const zoomRing = (c: Ctx, x: number, y: number, r: number, bg: string, inside: () => void) => {
  shape(c, () => ell(c, x, y, r, r), bg, 0);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); inside(); c.restore();
  c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = INK; c.lineWidth = 9; c.stroke();
};
const coin = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.9), COL.yellow, 4); c.beginPath(); ell(c, x, y, r * 0.6, r * 0.52); c.strokeStyle = COL.orange; c.lineWidth = 3; c.stroke(); };
const cup = (c: Ctx, x: number, y: number, hw: number, h: number, col: string) => {
  const b = () => { c.moveTo(x - hw, y - h); c.lineTo(x + hw, y - h); c.lineTo(x + hw * 0.75, y); c.lineTo(x - hw * 0.75, y); c.closePath(); };
  shape(c, b, col); shade(c, b, COL.tealDk, hw * 0.3, 0, 0.35);
};
const iceCube = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - s / 2, y - s, s, s, s * 0.18), "#dff2fb", 5); shade(c, () => rrect(c, x - s / 2, y - s, s, s, s * 0.18), COL.sky, s * 0.2, s * 0.2, 0.8);
  shine(c, [[x - s * 0.3, y - s * 0.75], [x - s * 0.3, y - s * 0.4]], 7);
};
const brickWall = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 6), "#c9694a");
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 6); c.clip();
  for (let r = 0, yy = y; yy < y + h; r++, yy += 44) { line(c, [[x, yy], [x + w, yy]], 4, "#8f4630"); for (let xx = x + (r % 2 ? 40 : 0); xx < x + w; xx += 80) line(c, [[xx, yy], [xx, yy + 44]], 4, "#8f4630"); }
  c.restore(); c.beginPath(); rrect(c, x, y, w, h, 6); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};

// ------------------------------------------------------------ flows
// 0 flow.e3: three cup houses with ice, one bare, one in newspaper, one in wet cloth, in the sun
const f_e3 = (c: Ctx) => {
  ground(c, "#f1e6cf"); floor(c, 820);
  sun(c, 540, 130, 70);
  const xs = [200, 540, 880];
  for (const x of xs) shadow(c, x + 30, 830, 160, 22);
  // bare cup
  cup(c, xs[0], 800, 85, 250, COL.teal); shape(c, () => ell(c, xs[0], 550, 85, 18), COL.tealDk, 5);
  // newspaper-wrapped
  const wrapP = (x: number) => () => { c.moveTo(x - 125, 540); c.lineTo(x + 125, 540); c.lineTo(x + 105, 800); c.lineTo(x - 105, 800); c.closePath(); };
  cup(c, xs[1], 800, 85, 250, COL.teal);
  shape(c, wrapP(xs[1]), NEWS, 6); for (let k = 0; k < 7; k++) line(c, [[xs[1] - 100 + k * 6, 570 + k * 32], [xs[1] + 95 - k * 6, 570 + k * 32]], 4, COL.grey);
  shade(c, wrapP(xs[1]), COL.grey, 25, 0, 0.3);
  // wet cloth
  cup(c, xs[2], 800, 85, 250, COL.teal);
  shape(c, wrapP(xs[2]), "#b7d3ee", 6); shade(c, wrapP(xs[2]), COL.blueDk, 25, 0, 0.3);
  for (const [dx, dy] of [[-60, 40], [30, 100], [-20, 170], [60, 220], [-70, 230]]) dropShape(c, xs[2] + dx, 600 + dy, 14);
  // ice cubes on top of every cup
  for (const x of xs) iceCube(c, x, 545, 88);
  // sun heat arrows
  for (const x of xs) arrow(c, [[x + (x - 540) * 0.08, 270], [x, 400]]);
};

// 1 flow.a2: looking closely at Velcro through a magnifying glass; a leaf and a feather beside
const f_a2 = (c: Ctx) => {
  ground(c, TABLE);
  velcroStrap(c, 330, 800, 340, 150, -0.1);
  leafTop(c, 820, 800, 1.1, 1.2);
  // feather
  c.save(); c.translate(620, 930); c.rotate(-0.25);
  const fp = () => { c.moveTo(-190, 0); c.bezierCurveTo(-120, -50, 60, -55, 190, -4); c.bezierCurveTo(60, 50, -120, 45, -190, 0); c.closePath(); };
  shape(c, fp, COL.pink); shade(c, fp, "#d4708f", 0, 12, 0.5); line(c, [[-210, 4], [190, -4]], 5, INK);
  c.restore();
  lens(c, 480, 380, 270, () => {
    c.fillStyle = COL.tealDk; c.fillRect(0, 380, D, 400); c.fillStyle = COL.pink; c.globalAlpha = 0.25; c.fillRect(0, 0, D, 380); c.globalAlpha = 1;
    line(c, [[100, 410], [900, 410]], 8, INK);
    hooksRow(c, 290, 410, 5, 62, 90, COL.teal); loopsRow(c, 250, 410, 6, 60, 70, COL.pink);
  });
};

// 2 flow.a4: cling film on a smooth steel plate (sticks) and on a rough brick wall (does not)
const f_a4 = (c: Ctx) => {
  ground(c, TABLE);
  // smooth steel slab, film flat on it
  shadow(c, 290, 900, 220, 28);
  shape(c, () => rrect(c, 90, 330, 400, 540, 18), COL.steel); shade(c, () => rrect(c, 90, 330, 400, 540, 18), COL.steelDk, 14, 14, 0.35);
  shape(c, () => polyP(c, [[130, 380], [450, 380], [450, 820], [130, 820]]), "rgba(214,236,250,0.5)", 4);
  shine(c, [[170, 420], [170, 560]], 10);
  // lifted corner is just a curl; the film clings
  // rough brick wall, film hanging off
  brickWall(c, 590, 330, 400, 540);
  const loose = () => { c.moveTo(640, 380); c.lineTo(940, 380); c.quadraticCurveTo(990, 520, 930, 640); c.quadraticCurveTo(900, 760, 960, 880); c.lineTo(700, 800); c.quadraticCurveTo(650, 600, 640, 380); c.closePath(); };
  shape(c, loose, "rgba(214,236,250,0.62)", 4);
  arrow(c, [[960, 700], [1030, 800]]);
  // the roll
  shape(c, () => rrect(c, 380, 80, 320, 110, 30), COL.cloth); shape(c, () => ell(c, 700, 135, 30, 55), COL.steelIn, 5); shape(c, () => ell(c, 380, 135, 30, 55), "rgba(214,236,250,0.7)", 5);
};

// 3 flow.a5: soot on the back of a spoon, then water balls roll on it
const spoon = (c: Ctx, x: number, y: number, rot: number, soot: boolean) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  ink(c, [[0, 0], [280, 0]], 30, COL.steel);
  const bowlP = () => { c.moveTo(-170, -10); c.bezierCurveTo(-170, 130, 20, 130, 20, -10); c.bezierCurveTo(20, -90, -170, -90, -170, -10); c.closePath(); };
  shape(c, bowlP, soot ? "#4a4350" : COL.steel); if (!soot) shade(c, bowlP, COL.steelDk, 18, 12, 0.5);
  c.restore();
};
const f_a5 = (c: Ctx) => {
  ground(c, TABLE);
  // left: candle with flame, spoon back above it getting black
  floor(c, 820);
  shadow(c, 260, 830, 120, 20);
  shape(c, () => rrect(c, 200, 600, 100, 220, 10), "#fbf1d0"); shade(c, () => rrect(c, 200, 600, 100, 220, 10), "#e6d6a0", 24, 0, 0.5);
  line(c, [[250, 600], [250, 570]], 6);
  shape(c, () => { c.moveTo(250, 450); c.quadraticCurveTo(300, 530, 250, 575); c.quadraticCurveTo(200, 530, 250, 450); }, COL.orange, 5);
  shape(c, () => { c.moveTo(250, 500); c.quadraticCurveTo(275, 545, 250, 570); c.quadraticCurveTo(225, 545, 250, 500); }, COL.yellow, 0);
  spoon(c, 230, 330, 0.0, true);
  c.save(); c.translate(230, 330); shape(c, () => ell(c, -75, 40, 70, 22), "#2a2530", 0); c.restore();
  // peg + hand holding the handle
  hand(c, 640, 330, Math.PI, 0.9, SKIN.adult, CLOTH.adult);
  arrow(c, [[430, 250], [360, 250]]);
  // right: the black spoon back with round water balls, a dropper
  spoon(c, 640, 760, 0, true);
  for (const [bx, by, r] of [[520, 760, 26], [585, 790, 20], [550, 690, 18]]) { shadow(c, bx + 6, by + r, r, 6); shape(c, () => ell(c, bx, by, r, r), COL.steelIn, 4); shine(c, [[bx - r * 0.5, by - r * 0.3], [bx - r * 0.2, by - r * 0.6]], 5); }
  arrow(c, [[560, 640], [440, 700]]);
};

// 4 flow.a6: hand moved through water, flat versus shaped like a beak
const basin = (c: Ctx, y: number) => {
  shape(c, () => { c.moveTo(60, y); c.lineTo(1020, y); c.lineTo(960, y + 250); c.lineTo(120, y + 250); c.closePath(); }, COL.steel);
  shape(c, () => polyP(c, [[75, y + 60], [1005, y + 60], [965, y + 238], [115, y + 238]]), COL.water, 0);
  for (const x of [180, 420, 700, 900]) line(c, [[x, y + 100], [x + 70, y + 100]], 5, COL.waterDk);
  line(c, [[75, y + 60], [1005, y + 60]], 5, COL.waterDk);
  shape(c, () => rrect(c, 40, y - 20, 1000, 40, 10), COL.steelIn);
};
const f_a6 = (c: Ctx) => {
  ground(c, "#f1e6cf");
  basin(c, 200); basin(c, 640);
  // flat hand: wide plate pushing right in the water, big back-arrows
  shape(c, () => rrect(c, 120, 280, 120, 90, 14), CLOTH.child);
  shape(c, () => rrect(c, 240, 260, 36, 150, 14), SKIN.child);
  arrow(c, [[300, 350], [440, 350]]);
  for (const y of [290, 350, 410]) { arrow(c, [[560, y], [470, y]], RED, 9); }
  // beak hand: fingers together in a point
  shape(c, () => rrect(c, 120, 730, 120, 90, 14), CLOTH.child);
  shape(c, () => { c.moveTo(240, 700); c.lineTo(240, 850); c.quadraticCurveTo(300, 790, 380, 775); c.quadraticCurveTo(300, 760, 240, 700); c.closePath(); }, SKIN.child);
  arrow(c, [[420, 775], [560, 775]]);
  arrow(c, [[590, 790], [520, 840]], RED, 7);
  line(c, [[300, 700], [300, 700]], 1);
};

// 5 flow.p1: a living thing, then a drawing, then an invention
const f_p1 = (c: Ctx) => {
  ground(c, TABLE);
  bulb(c, 540, 170, 85);
  // leaf with a water bead
  leafTop(c, 190, 560, 1.7, 0.4); ballDrop(c, 200, 620, 34);
  arrow(c, [[330, 560], [400, 560]]);
  // design on paper with pencil
  c.save(); c.translate(540, 570); c.rotate(-0.04);
  shadow(c, 14, 190, 150, 18);
  shape(c, () => rrect(c, -140, -180, 280, 360, 8), WHITE);
  shape(c, () => rrect(c, -80, -100, 160, 110, 26), "none", 5); c.beginPath(); rrect(c, -80, -100, 160, 110, 26); c.strokeStyle = COL.greyDk; c.lineWidth = 6; c.stroke();
  line(c, [[-70, 60], [60, 60]], 5, COL.grey); line(c, [[-70, 100], [30, 100]], 5, COL.grey); line(c, [[-70, 140], [60, 140]], 5, COL.grey);
  c.restore();
  ink(c, [[560, 720], [700, 560]], 22, COL.wood); shape(c, () => polyP(c, [[694, 548], [714, 568], [724, 538]]), COL.pink, 4);
  arrow(c, [[720, 580], [790, 580]]);
  // cardboard invention: a paper-cup rain hood with a card roof
  shadow(c, 900, 760, 120, 18);
  cup(c, 900, 750, 70, 160, COL.brown); shape(c, () => polyP(c, [[780, 580], [1020, 580], [960, 520], [840, 520]]), COL.woodDk, 5);
  shape(c, () => ell(c, 900, 590, 70, 14), COL.brown, 5);
};

// 6 flow.c1: paperclip hooks on a card strip, caught in a towel, a bag of coins hanging
const f_c1 = (c: Ctx) => {
  ground(c, "#f1e6cf");
  // towel with loops
  shape(c, () => rrect(c, 120, 100, 840, 330, 24), COL.blue); shade(c, () => rrect(c, 120, 100, 840, 330, 24), COL.blueDk, 20, 16, 0.4);
  const r = rnd(4); for (let i = 0; i < 70; i++) { const x = 150 + r() * 780, y = 130 + r() * 280; c.beginPath(); c.arc(x, y, 13, Math.PI, 0); c.strokeStyle = COL.sky; c.lineWidth = 5; c.stroke(); }
  // card strip hooked onto the towel's lower edge, with paperclip hooks
  shape(c, () => rrect(c, 260, 330, 560, 80, 8), COL.wood);
  for (let i = 0; i < 6; i++) { const x = 300 + i * 90; ink(c, [[x, 360], [x + 8, 330], [x + 34, 322], [x + 44, 350], [x + 26, 366]], 8, COL.steel); }
  shape(c, () => rrect(c, 260, 400, 560, 40, 8), COL.wood);
  // peg
  shape(c, () => rrect(c, 440, 440, 40, 130, 8), COL.woodDk); shape(c, () => rrect(c, 600, 440, 40, 130, 8), COL.woodDk);
  line(c, [[460, 570], [460, 640]], 5); line(c, [[620, 570], [620, 640]], 5);
  // bag of coins
  shadow(c, 560, 1020, 200, 18);
  shape(c, () => { c.moveTo(370, 640); c.lineTo(750, 640); c.quadraticCurveTo(820, 860, 700, 980); c.quadraticCurveTo(560, 1030, 420, 980); c.quadraticCurveTo(300, 860, 370, 640); c.closePath(); }, "rgba(214,236,250,0.65)", 5);
  for (const [x, y] of [[480, 920], [560, 940], [640, 920], [520, 880], [600, 880], [560, 830], [500, 790], [620, 790]]) coin(c, x, y, 38);
};

// 7 flow.c2: a dusty name tag with wax; a water ball rolls and leaves a clean path
const f_c2 = (c: Ctx) => {
  ground(c, TABLE);
  c.save(); c.translate(500, 540); c.rotate(-0.08);
  shadow(c, 20, 330, 330, 24);
  shape(c, () => rrect(c, -310, -250, 620, 500, 34), WHITE);
  shape(c, () => ell(c, -250, -190, 20, 20), TABLE, 5);
  const r = rnd(8);
  for (let i = 0; i < 360; i++) { const x = -290 + r() * 580, y = -230 + r() * 460; if (Math.abs(y - (-30 + (x + 100) * 0.35)) < 70 && x > -120) continue; c.fillStyle = r() > 0.5 ? "#b99a6a" : "#d8c49a"; c.fillRect(x, y, 6, 6); }
  for (const [x, y, col] of [[-140, -170, COL.red], [-60, -190, COL.blue], [20, -170, COL.green]] as [number, number, string][]) shape(c, () => ell(c, x, y, 28, 28), col, 4);
  ballDrop(c, 70, 90, 44);
  arrow(c, [[170, 160], [260, 210]]);
  c.restore();
  shape(c, () => rrect(c, 800, 620, 190, 330, 18), "#fbf1d0"); shade(c, () => rrect(c, 800, 620, 190, 330, 18), "#e6d6a0", 30, 0, 0.5);
  ink(c, [[890, 620], [890, 590]], 6, INK);
};

// ------------------------------------------------------------ terms
const hardHat = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r, y - r * 1.4, x + r, y - r * 1.4, x + r, y); c.closePath(); }, COL.yellow, 5);
  shape(c, () => rrect(c, x - r * 1.2, y - 4, r * 2.4, r * 0.25, 6), COL.orange, 5);
};
// 8 term.0: burr and Velcro
const t0 = (c: Ctx) => {
  ground(c);
  burr(c, 260, 520, 130, 22, 1);
  arrow(c, [[470, 520], [610, 520]]);
  velcroStrap(c, 800, 520, 300, 200, 0.05);
};
// 9 term.1: new idea, and things people invented
const t1 = (c: Ctx) => {
  ground(c); floor(c, 880);
  bulb(c, 540, 170, 80);
  person(c, 540, 560, 360, { armL: [Math.PI * 0.6, Math.PI * 0.5], armR: [Math.PI * 0.4, Math.PI * 0.5] });
  // pressure cooker
  shadow(c, 190, 890, 130, 18);
  shape(c, () => rrect(c, 90, 700, 200, 180, 22), COL.steel); shade(c, () => rrect(c, 90, 700, 200, 180, 22), COL.steelDk, 20, 0, 0.4);
  shape(c, () => rrect(c, 80, 670, 220, 46, 14), COL.steelIn); shape(c, () => rrect(c, 170, 640, 40, 32, 6), COL.black); shape(c, () => rrect(c, 300, 740, 70, 30, 10), COL.black);
  // velcro
  velcroStrap(c, 880, 780, 220, 140, 0.1);
  // bicycle
  const wheel = (x: number) => { c.beginPath(); ell(c, x, 800, 60, 60); c.strokeStyle = INK; c.lineWidth = 14; c.stroke(); c.strokeStyle = COL.steel; c.lineWidth = 6; c.stroke(); };
  wheel(480); wheel(620);
  ink(c, [[480, 800], [535, 730], [590, 800], [620, 800]], 8, COL.red); ink(c, [[535, 730], [610, 730], [620, 800]], 8, COL.red); ink(c, [[605, 730], [595, 700], [630, 695]], 8, COL.red); ink(c, [[535, 730], [525, 705], [505, 705]], 8, COL.red);
};
// 10 term.2: engineer with a model bridge
const t2 = (c: Ctx) => {
  ground(c); floor(c, 860);
  shadow(c, 700, 880, 300, 20);
  shape(c, () => rrect(c, 420, 780, 560, 80, 6), COL.wood);
  shape(c, () => rrect(c, 470, 660, 60, 125, 4), COL.steel); shape(c, () => rrect(c, 870, 660, 60, 125, 4), COL.steel);
  shape(c, () => { c.moveTo(440, 660); c.lineTo(960, 660); c.lineTo(960, 690); c.lineTo(440, 690); c.closePath(); }, COL.grey);
  ink(c, [[500, 660], [560, 580], [700, 540], [840, 580], [900, 660]], 10, COL.red);
  for (const x of [560, 630, 700, 770, 840]) line(c, [[x, x === 700 ? 545 : 590], [x, 660]], 5, COL.red);
  person(c, 250, 860, 560, { adult: true, armL: [Math.PI * 0.5, Math.PI * 0.4], armR: [0.3, -0.3] });
  hardHat(c, 250, 860 - 560 * 0.74 - 560 * 0.13 * 1.05 - 18, 560 * 0.13 * 1.15);
};
// 11 term.3: labelled drawing of a backpack
const t3 = (c: Ctx) => {
  ground(c, TABLE);
  shadow(c, 480, 960, 400, 20);
  shape(c, () => rrect(c, 80, 90, 760, 860, 10), WHITE);
  // backpack drawing in pencil
  const pen = COL.greyDk;
  const pl = (p: number[][], w = 8) => line(c, p, w, pen);
  pl([[300, 300], [300, 700], [480, 740], [660, 700], [660, 300], [480, 250], [300, 300]]);
  pl([[340, 560], [620, 560], [620, 680], [340, 680], [340, 560]], 6);
  pl([[360, 280], [340, 160], [400, 150]]); pl([[600, 280], [620, 160], [560, 150]], 8);
  pl([[420, 120], [540, 120]], 8);
  for (const [x1, y1, x2, y2] of [[620, 160, 780, 160], [660, 400, 780, 400], [620, 620, 780, 620], [300, 400, 150, 400]]) { arrow(c, [[x1, y1], [x2, y2]], RED, 7); }
  for (const y of [180, 420, 640]) line(c, [[700, y], [790, y]], 4, COL.grey);
  ink(c, [[880, 920], [980, 400]], 26, COL.wood); shape(c, () => polyP(c, [[966, 390], [996, 400], [990, 340]]), COL.pink, 4);
  line(c, [[920, 480], [920, 480]], 1);
};
// 12 term.4: rough cardboard model, finished version
const carBody = (c: Ctx, x: number, y: number, col: string, dk: string, fancy: boolean) => {
  shadow(c, x + 20, y + 130, 230, 18);
  const b = () => { c.moveTo(x - 220, y + 80); c.lineTo(x - 220, y); c.lineTo(x - 120, y - 8); c.lineTo(x - 60, y - 90); c.lineTo(x + 100, y - 90); c.lineTo(x + 160, y - 6); c.lineTo(x + 220, y); c.lineTo(x + 220, y + 80); c.closePath(); };
  shape(c, b, col); shade(c, b, dk, 20, 14, 0.5);
  shape(c, () => polyP(c, [[x - 40, y - 70], [x + 90, y - 70], [x + 135, y - 10], [x - 90, y - 10]]), fancy ? COL.glass : "#c9aa80", 4);
  for (const wx of [x - 120, x + 120]) { shape(c, () => ell(c, wx, y + 90, 52, 52), COL.black); shape(c, () => ell(c, wx, y + 90, 22, 22), fancy ? COL.steel : COL.grey, 4); }
};
const t4 = (c: Ctx) => {
  ground(c); floor(c, 880);
  carBody(c, 270, 560, "#c9a06a", "#a67c47", false);
  line(c, [[130, 520], [250, 640]], 22, "#f7f3e8"); line(c, [[380, 480], [430, 600]], 20, "#f7f3e8");
  carBody(c, 810, 560, COL.red, "#b83a28", true);
  shine(c, [[700, 500], [880, 500]], 9);
  arrow(c, [[470, 360], [610, 360]]);
};
// 13 term.5: two same buckets, two shapes dropped from the same height
const t5 = (c: Ctx) => {
  ground(c); floor(c, 880);
  for (const x of [270, 810]) {
    shadow(c, x + 14, 890, 150, 16);
    const b = () => { c.moveTo(x - 130, 640); c.lineTo(x + 130, 640); c.lineTo(x + 100, 880); c.lineTo(x - 100, 880); c.closePath(); };
    shape(c, b, COL.blue); shade(c, b, COL.blueDk, 24, 0, 0.4); shape(c, () => ell(c, x, 640, 130, 24), COL.water, 5);
  }
  // dough ball held by a hand, dough cone held by a hand
  shape(c, () => ell(c, 270, 420, 70, 70), DOUGH); shade(c, () => ell(c, 270, 420, 70, 70), DOUGHDK, 26, 24, 0.6);
  shape(c, () => { c.moveTo(740, 350); c.lineTo(880, 350); c.lineTo(810, 500); c.closePath(); }, DOUGH); shade(c, () => polyP(c, [[740, 350], [880, 350], [810, 500]]), DOUGHDK, 26, 0, 0.6);
  hand(c, 270, 200, Math.PI / 2, 1.2); hand(c, 810, 200, Math.PI / 2, 1.2);
  c.setLineDash([22, 18]); line(c, [[140, 560], [940, 560]], 6, RED); c.setLineDash([]);
  arrow(c, [[420, 440], [420, 600]]); arrow(c, [[660, 440], [660, 600]]);
};
// 14 term.7: a plant sends its seeds away by animal, wind and water
const t7 = (c: Ctx) => {
  ground(c); floor(c, 800, "#a9d27a");
  // parent plant
  ink(c, [[540, 800], [540, 540]], 14, COL.green);
  leafTop(c, 540, 560, 1.1, 0); leafTop(c, 540, 660, 0.9, 1.7); leafTop(c, 540, 700, 0.9, -1.7);
  for (const [x, y] of [[500, 470], [580, 470], [540, 430]]) shape(c, () => ell(c, x, y, 24, 24), COL.red, 5);
  burr(c, 190, 220, 62, 14, 1); burr(c, 190, 220, 62, 14, 1);
  arrow(c, [[460, 440], [300, 260]]);
  // fluffy seed in the wind
  const fx = 880, fy = 230;
  for (let i = -3; i <= 3; i++) line(c, [[fx, fy], [fx + i * 22, fy - 60 + Math.abs(i) * 10]], 5, INK);
  for (let i = -3; i <= 3; i++) shape(c, () => ell(c, fx + i * 22, fy - 62 + Math.abs(i) * 10, 10, 10), WHITE, 3);
  shape(c, () => ell(c, fx, fy + 16, 14, 24), BURR, 4);
  arrow(c, [[610, 440], [780, 280]]);
  // coconut afloat on water
  shape(c, () => rrect(c, 700, 700, 340, 100, 8), COL.water, 0); line(c, [[720, 720], [800, 720]], 5, COL.waterDk); line(c, [[900, 760], [1000, 760]], 5, COL.waterDk);
  shape(c, () => ell(c, 880, 700, 80, 62), COL.soil); shade(c, () => ell(c, 880, 700, 80, 62), COL.soilDk, 24, 18, 0.6);
  for (const [dx, dy] of [[-22, -8], [10, -22], [10, 10]]) shape(c, () => ell(c, 880 + dx, 700 + dy, 9, 9), COL.soilDk, 3);
  arrow(c, [[620, 560], [740, 640]]);
};
// 15 term.8: zoom on Velcro, hooks catching loops
const t8 = (c: Ctx) => {
  ground(c);
  zoomRing(c, 540, 520, 440, "#f6f0dc", () => {
    c.fillStyle = COL.tealDk; c.fillRect(0, 600, D, 300); c.fillStyle = COL.blueDk; c.fillRect(0, 380, D, 80);
    line(c, [[0, 600], [D, 600]], 7, INK); line(c, [[0, 460], [D, 460]], 7, INK);
    hooksRow(c, 220, 600, 6, 120, 110, COL.teal); loopsRow(c, 190, 460, 6, 120, -100, COL.pink);
  });
  velcroStrap(c, 130, 980, 190, 100, -0.1);
};
// 16 term.10: candle on its side, cabbage leaf, both with water beads
const t10 = (c: Ctx) => {
  ground(c, TABLE);
  shape(c, () => rrect(c, 80, 600, 390, 130, 40), "#fbf1d0"); shade(c, () => rrect(c, 80, 600, 390, 130, 40), "#e6d6a0", 0, 36, 0.5);
  shadow(c, 280, 750, 220, 18);
  line(c, [[80, 665], [50, 665]], 6);
  bead(c, 170, 603, 38, 32); bead(c, 300, 604, 28, 24); bead(c, 400, 604, 34, 28);
  // cabbage leaf with veins
  const lf = () => { c.moveTo(540, 800); c.bezierCurveTo(430, 560, 600, 280, 780, 330); c.bezierCurveTo(1000, 380, 1000, 700, 540, 800); c.closePath(); };
  shape(c, lf, "#9fd18a"); shade(c, lf, COL.green, 24, 20, 0.45);
  line(c, [[560, 770], [790, 500]], 8, "#e6f3cf"); for (const [x, y, a, b] of [[640, 680, 700, 580], [700, 610, 800, 640], [720, 560, 740, 430]]) line(c, [[x, y], [a, b]], 5, "#e6f3cf");
  bead(c, 680, 660, 36, 34); bead(c, 830, 560, 30, 26); bead(c, 620, 520, 26, 22);
};
// 17 term.11: round beads on a raincoat, a drop soaking into paper towel
const t11 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 410, 280, 80, 60), COL.orange);
  const coat = () => { c.moveTo(150, 330); c.lineTo(320, 250); c.lineTo(380, 290); c.lineTo(440, 290); c.lineTo(500, 250); c.lineTo(660, 330); c.lineTo(600, 560); c.lineTo(560, 520); c.lineTo(560, 880); c.lineTo(240, 880); c.lineTo(240, 520); c.lineTo(200, 560); c.closePath(); };
  shadow(c, 420, 900, 240, 18);
  shape(c, coat, COL.yellow); shade(c, coat, COL.orange, 22, 18, 0.45);
  line(c, [[410, 300], [410, 880]], 6, COL.orange);
  for (const [x, y] of [[300, 400], [500, 450], [330, 640], [480, 730], [370, 790]]) ballDrop(c, x, y + 28, 26);
  // paper towel with a soaked blot
  shadow(c, 840, 900, 170, 16);
  shape(c, () => rrect(c, 680, 400, 320, 480, 10), WHITE);
  for (const y of [470, 560, 650, 740, 830]) line(c, [[700, y], [980, y]], 3, COL.steelIn);
  shape(c, () => { c.moveTo(780, 640); c.quadraticCurveTo(760, 560, 840, 560); c.quadraticCurveTo(940, 540, 920, 640); c.quadraticCurveTo(940, 720, 850, 710); c.quadraticCurveTo(770, 730, 780, 640); }, COL.water, 4);
  arrow(c, [[840, 300], [840, 420]]); dropShape(c, 840, 270, 34);
};
// 18 term.12: three streamlined shapes
const t12 = (c: Ctx) => {
  ground(c);
  // fish
  const fish = () => { c.moveTo(80, 250); c.bezierCurveTo(200, 140, 420, 140, 560, 250); c.bezierCurveTo(420, 360, 200, 360, 80, 250); c.closePath(); };
  shape(c, fish, COL.blue); shade(c, fish, COL.blueDk, 20, 22, 0.5);
  shape(c, () => polyP(c, [[560, 250], [680, 170], [660, 250], [680, 330]]), COL.blueDk, 5);
  shape(c, () => ell(c, 170, 235, 12, 12), WHITE, 4);
  // kingfisher: round head, long beak, blue back, orange chest
  shape(c, () => polyP(c, [[470, 545], [700, 565], [470, 590]]), COL.black, 5);
  const bird = () => { c.moveTo(60, 570); c.bezierCurveTo(100, 470, 300, 450, 400, 490); c.bezierCurveTo(500, 520, 500, 620, 400, 640); c.bezierCurveTo(260, 660, 120, 650, 60, 570); c.closePath(); };
  shape(c, bird, COL.blue); shade(c, bird, COL.blueDk, 20, 20, 0.5);
  shape(c, () => { c.moveTo(300, 640); c.bezierCurveTo(420, 650, 500, 620, 480, 560); c.bezierCurveTo(400, 560, 330, 590, 300, 640); }, COL.orange, 0);
  shape(c, () => ell(c, 430, 545, 12, 12), WHITE, 4);
  shape(c, () => polyP(c, [[70, 570], [25, 590], [70, 610]]), COL.blueDk, 5);
  // bullet train
  const tr = () => { c.moveTo(60, 860); c.lineTo(60, 780); c.bezierCurveTo(300, 760, 600, 790, 800, 860); c.bezierCurveTo(600, 920, 300, 900, 60, 860); c.closePath(); };
  shadow(c, 420, 925, 340, 14);
  shape(c, () => { c.moveTo(60, 920); c.lineTo(60, 760); c.bezierCurveTo(300, 740, 600, 790, 820, 880); c.bezierCurveTo(780, 920, 700, 920, 620, 920); c.closePath(); }, WHITE);
  shade(c, () => { c.moveTo(60, 920); c.lineTo(60, 760); c.bezierCurveTo(300, 740, 600, 790, 820, 880); c.bezierCurveTo(780, 920, 700, 920, 620, 920); c.closePath(); }, COL.steelDk, 0, 40, 0.5);
  line(c, [[60, 850], [740, 868]], 14, COL.blue);
  for (const x of [200, 330, 460]) shape(c, () => rrect(c, x, 790, 70, 40, 8), COL.glassEdge, 4);
  // air lines flowing smoothly
  for (const y of [180, 250, 330, 520, 600, 660, 780, 940]) { if (y === 780 || y === 940) continue; line(c, [[780, y], [980, y]], 6, COL.waterDk); }
  arrow(c, [[900, 250], [1010, 250]]); arrow(c, [[900, 560], [1010, 560]]); arrow(c, [[900, 860], [1010, 860]]);
};
// 19 term.13: a hand out of a bus window, air pushing it back
const t13 = (c: Ctx) => {
  ground(c, "#cfe6f5");
  floor(c, 900, "#8d8a94");
  shape(c, () => rrect(c, 380, 160, 690, 640, 30), COL.yellow); shade(c, () => rrect(c, 380, 160, 690, 640, 30), COL.orange, 24, 16, 0.4);
  shape(c, () => rrect(c, 440, 250, 560, 270, 24), "#dbeaf4");
  for (const x of [540, 900]) { shape(c, () => ell(c, x, 800, 90, 90), COL.black); shape(c, () => ell(c, x, 800, 36, 36), COL.steel, 4); }
  shape(c, () => ell(c, 760, 400, 90, 100), SKIN.child); shape(c, () => { c.moveTo(670, 400); c.bezierCurveTo(670, 290, 850, 290, 850, 400); c.quadraticCurveTo(760, 360, 670, 400); }, CLOTH.hair, 5);
  shape(c, () => ell(c, 730, 415, 11, 14), INK, 0); shape(c, () => ell(c, 800, 415, 11, 14), INK, 0);
  shape(c, () => rrect(c, 300, 470, 330, 70, 14), CLOTH.child);
  hand(c, 330, 500, -Math.PI / 2, 1.2, SKIN.child, CLOTH.child, true);
  for (const y of [300, 380, 460]) arrow(c, [[40, y], [210, y]]);
  arrow(c, [[640, 100], [440, 100]], RED, 12);
};
// 20 term.14: train squeezes air in a tunnel, bang at the far end
const t14 = (c: Ctx) => {
  ground(c, "#cfe6f5");
  const hill = () => { c.moveTo(-20, 900); c.bezierCurveTo(80, 300, 700, 260, 1100, 900); c.closePath(); };
  shape(c, hill, COL.green); shade(c, hill, COL.greenDk, 30, 30, 0.35);
  shape(c, () => rrect(c, -20, 560, 1100, 220, 10), "#4a4350", 5);
  floor(c, 780, "#8d8a94");
  // train nose heading right inside the tunnel
  shape(c, () => { c.moveTo(60, 770); c.lineTo(60, 600); c.lineTo(400, 600); c.bezierCurveTo(520, 630, 560, 720, 560, 770); c.closePath(); }, WHITE); line(c, [[60, 730], [560, 730]], 12, COL.blue);
  for (const k of [0, 1, 2]) c.beginPath(), c.arc(610 + k * 40, 690, 90 + k * 24, -0.9, 0.9), c.strokeStyle = COL.sky, c.lineWidth = 12, c.stroke();
  // bang at the far end
  const sx = 960, sy = 590;
  shape(c, () => { for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, r = i % 2 ? 60 : 120; c.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); } c.closePath(); }, COL.yellow, 6);
  arrow(c, [[640, 450], [850, 450]]);
};
// 21 term.16: gecko toe, rows of hairs, one hair splitting into a brush
const t16 = (c: Ctx) => {
  ground(c);
  // foot
  const fx = 190, fy = 280;
  for (const an of [-2.5, -2.05, -1.57, -1.1, -0.64]) { const tx = fx + Math.cos(an) * 105, ty = fy + Math.sin(an) * 105; ink(c, [[fx, fy], [tx, ty]], 26, COL.green); shape(c, () => ell(c, tx, ty, 17, 17), COL.greenLt, 4); }
  shape(c, () => ell(c, fx, fy + 10, 62, 52), COL.green);
  arrow(c, [[260, 330], [340, 400]]);
  // rows of hairs
  zoomRing(c, 360, 640, 250, "#f6f0dc", () => { c.fillStyle = COL.greenDk; c.fillRect(0, 560, D, 400); line(c, [[0, 560], [D, 560]], 6); for (let i = 0; i < 9; i++) ink(c, [[160 + i * 48, 560], [165 + i * 48, 430], [175 + i * 48, 395]], 10, COL.green); });
  arrow(c, [[630, 640], [700, 640]]);
  // one hair splits into a brush of tiny tips
  zoomRing(c, 850, 620, 200, "#f6f0dc", () => { ink(c, [[850, 760], [850, 640]], 24, COL.green); for (let i = -5; i <= 5; i++) { ink(c, [[850, 640], [850 + i * 12, 600], [850 + i * 28, 520]], 6, COL.green); shape(c, () => ell(c, 850 + i * 28, 514, 7, 5), COL.greenLt, 3); } });
};
// 22 term.18: thick mud walls keep the heat out
const t18 = (c: Ctx) => {
  ground(c, "#f6e6c2"); floor(c, 880, "#d7b680");
  sun(c, 150, 170, 70);
  shadow(c, 700, 890, 300, 20);
  shape(c, () => { c.moveTo(380, 880); c.lineTo(380, 470); c.lineTo(1020, 470); c.lineTo(1020, 880); c.closePath(); }, "#c39a6b"); shade(c, () => polyP(c, [[380, 880], [380, 470], [1020, 470], [1020, 880]]), COL.soil, 30, 0, 0.35);
  shape(c, () => polyP(c, [[440, 880], [440, 540], [960, 540], [960, 880]]), "#f4e8d0", 0);
  shape(c, () => polyP(c, [[340, 480], [700, 280], [1060, 480]]), COL.woodDk);
  shape(c, () => rrect(c, 650, 700, 100, 180, 8), COL.soilDk);
  for (const y of [530, 640, 750]) { arrow(c, [[250, y - 150 + 150], [370, y]], RED, 12); }
  arrow(c, [[460, 700], [520, 700]], RED, 5);
};
// 23 term.19: burrs over time, hooks get better
const t19 = (c: Ctx) => {
  ground(c);
  burr(c, 140, 400, 66, 12, 0); burr(c, 390, 400, 74, 16, 0.4); burr(c, 650, 400, 82, 20, 0.8); burr(c, 880, 400, 88, 22, 1.2);
  arrow(c, [[80, 700], [1000, 700]], RED, 14);
  for (const x of [200, 420, 640, 860]) line(c, [[x, 740], [x, 760]], 6, COL.greyDk);
};
// 24 term.20: leaf, bump, tiny balls
const t20 = (c: Ctx) => {
  ground(c);
  leafTop(c, 170, 300, 1.3, 0.5, COL.green); 
  arrow(c, [[250, 480], [330, 570]]);
  zoomRing(c, 450, 740, 210, "#e8f3dd", () => { c.fillStyle = COL.leaf; c.fillRect(0, 800, D, 300); line(c, [[0, 800], [D, 800]], 6); for (const x of [340, 450, 560]) { shape(c, () => { c.moveTo(x - 50, 800); c.quadraticCurveTo(x, 700, x + 50, 800); c.closePath(); }, "#bfe28a", 5); } });
  arrow(c, [[640, 700], [720, 640]]);
  zoomRing(c, 790, 330, 230, "#f6f0dc", () => { const r = rnd(3); for (let row = 0; row < 6; row++) for (let i = 0; i < 6; i++) { const x = 620 + i * 70 + (row % 2) * 35, y = 190 + row * 62; shape(c, () => ell(c, x, y, 32, 32), [COL.blue, COL.red, COL.teal][(row + i) % 3], 4); void r; } });
};
// 25 term.21: patent paper with a stamp and a drawing of hooks and loops
const t21 = (c: Ctx) => {
  ground(c, TABLE);
  shadow(c, 560, 960, 420, 20);
  c.save(); c.translate(540, 520); c.rotate(-0.03);
  shape(c, () => rrect(c, -330, -420, 660, 840, 10), "#fffaf0");
  line(c, [[-270, -340], [270, -340]], 8, COL.greyDk); line(c, [[-180, -290], [180, -290]], 6, COL.grey);
  zoomRing(c, 0, -50, 160, WHITE, () => { c.translate(0, 0); hooksRow(c, -100, 20, 4, 60, 70, COL.teal); loopsRow(c, -120, -40, 5, 56, -50, COL.pink); line(c, [[-200, 20], [200, 20]], 6, INK); line(c, [[-200, -40], [200, -40]], 6, INK); });
  for (const y of [210, 260, 310]) line(c, [[-270, y], [90, y]], 5, COL.grey);
  shape(c, () => ell(c, 190, 320, 80, 80), RED, 6); shape(c, () => { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i / 10) * Math.PI * 2, r = i % 2 ? 22 : 50; c.lineTo(190 + Math.cos(a) * r, 320 + Math.sin(a) * r); } c.closePath(); }, "#ffe7a8", 4);
  c.restore();
};

// ------------------------------------------------------------ explanations
// 26 expl.3: water molecules pull on each other and make a ball
const e3x = (c: Ctx) => {
  ground(c);
  // bumpy waxy surface
  shape(c, () => { c.moveTo(-10, 1090); c.lineTo(-10, 780); for (let x = 0; x <= 1100; x += 110) { c.lineTo(x + 20, 780); c.quadraticCurveTo(x + 55, 700, x + 90, 780); } c.lineTo(1100, 1090); c.closePath(); }, "#e8d9a8");
  // drop of molecules
  const cx = 540, cy = 480, R = 250;
  shape(c, () => ell(c, cx, cy, R, R * 0.9), COL.water, 7);
  const r = rnd(9); const pts: number[][] = [];
  for (let i = 0; i < 40; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * (R - 50); pts.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.9]); }
  for (const [x, y] of pts) { shape(c, () => ell(c, x, y, 20, 20), COL.blue, 3); shape(c, () => ell(c, x + 15, y - 10, 8, 8), COL.drop, 2); shape(c, () => ell(c, x - 15, y - 10, 8, 8), COL.drop, 2); }
  for (const a of [0, 1, 2, 3, 4, 5, 6, 7]) { const t = (a / 8) * 6.28 + 0.3; arrow(c, [[cx + Math.cos(t) * (R + 120), cy + Math.sin(t) * (R + 80) * 0.9], [cx + Math.cos(t) * (R + 20), cy + Math.sin(t) * (R + 10) * 0.9]], RED, 9); }
};
// 27 expl.7: a gecko toe peels from the tip, like sticky tape
const e7 = (c: Ctx) => {
  ground(c);
  // wall
  shape(c, () => rrect(c, -20, 760, 1120, 340, 10), COL.grey);
  // toe, peeling up at the tip (right)
  const toe = () => { c.moveTo(60, 700); c.lineTo(520, 700); c.bezierCurveTo(700, 700, 800, 560, 820, 420); c.lineTo(870, 440); c.bezierCurveTo(850, 640, 720, 780, 520, 780); c.lineTo(60, 780); c.closePath(); };
  // hairs under the stuck part
  for (let i = 0; i < 22; i++) line(c, [[80 + i * 20, 780], [80 + i * 20 + 4, 762]], 4, INK);
  shape(c, () => rrect(c, 40, 640, 480, 130, 30), COL.green); shade(c, () => rrect(c, 40, 640, 480, 130, 30), COL.greenDk, 0, 26, 0.5);
  void toe;
  const lift = () => { c.moveTo(520, 640); c.bezierCurveTo(700, 640, 780, 520, 800, 330); c.lineTo(880, 360); c.bezierCurveTo(850, 600, 720, 770, 520, 770); c.closePath(); };
  shape(c, lift, COL.green); shade(c, lift, COL.greenDk, 20, 20, 0.5);
  arrow(c, [[960, 540], [950, 340]]);
  for (let i = 0; i < 7; i++) line(c, [[560 + i * 24, 770 - i * 4], [570 + i * 25, 760 - i * 20]], 4, INK);
};
// 28 expl.8: warm air rises in a termite mound, cool air comes in below
const e8 = (c: Ctx) => {
  ground(c, "#f6e6c2"); floor(c, 880, "#a9d27a");
  sun(c, 150, 150, 60);
  const mound = () => { c.moveTo(310, 880); c.bezierCurveTo(360, 700, 420, 500, 470, 220); c.lineTo(540, 130); c.lineTo(610, 220); c.bezierCurveTo(660, 500, 720, 700, 770, 880); c.closePath(); };
  shape(c, mound, "#c9805a"); shade(c, mound, COL.soilDk, 40, 0, 0.35);
  shape(c, () => ell(c, 540, 700, 130, 110), "#f4e8d0", 5);
  for (const x of [470, 540, 610]) line(c, [[x, 620], [x, 240]], 10, "#f4e8d0");
  arrow(c, [[540, 640], [540, 330]], RED, 12);
  arrow(c, [[200, 840], [330, 840]], RED, 10); arrow(c, [[880, 840], [750, 840]], RED, 10);
  arrow(c, [[200, 330], [370, 380]], RED, 8);
  // a few termites
  for (const [x, y] of [[500, 740], [580, 720], [540, 780]]) { shape(c, () => ell(c, x, y, 20, 12), COL.black, 3); }
};
// 29 expl.9: thick walls and air channels flush cool night air
const e9 = (c: Ctx) => {
  ground(c, "#2f3159"); floor(c, 900, "#5a4a3a");
  for (const [x, y] of [[760, 120], [900, 220], [620, 80], [980, 70]]) shape(c, () => ell(c, x, y, 7, 7), COL.yellow, 0);
  shape(c, () => ell(c, 190, 170, 70, 70), "#fff3c4", 5); shape(c, () => ell(c, 220, 150, 62, 62), "#2f3159", 0);
  const bld = () => { c.moveTo(220, 900); c.lineTo(220, 360); c.lineTo(860, 360); c.lineTo(860, 900); c.closePath(); };
  shape(c, bld, "#c9805a"); shade(c, bld, COL.soilDk, 30, 0, 0.35);
  shape(c, () => polyP(c, [[330, 900], [330, 470], [750, 470], [750, 900]]), "#fbe9c0", 4);
  for (const x of [430, 650]) { shape(c, () => rrect(c, x - 30, 220, 60, 160, 10), "#c9805a"); line(c, [[x, 380], [x, 520]], 10, "#fbe9c0"); }
  shape(c, () => rrect(c, 435, 640, 210, 20, 4), COL.woodDk);
  arrow(c, [[60, 760], [330, 760]], RED, 12); arrow(c, [[750, 760], [1030, 760]], RED, 12);
  arrow(c, [[540, 700], [540, 560]], RED, 10);
};

export const ic_makingThingsBiomimicryL3 = cards("sci.making-things.biomimicry.L3 cards", [
  f_e3, f_a2, f_a4, f_a5, f_a6, f_p1, f_c1, f_c2,
  t0, t1, t2, t3, t4, t5, t7, t8, t10, t11, t12, t13, t14, t16, t18, t19, t20, t21,
  e3x, e7, e8, e9,
]);
