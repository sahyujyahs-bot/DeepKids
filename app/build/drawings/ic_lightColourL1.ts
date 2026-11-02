import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, plate, leaf, hand, person, write, cards } from "./flatKit";

// MIXING PAINTS (sci.light.colour.L1) · flat set-up cards and card pictures.
// Paint blobs are lumpy rounds with a darker shade side; the same child's hand (orange sleeve) and
// the same mother (blue kurta) appear on every card with people.

const P = {
  red: COL.red, redDk: "#b53a27", yellow: COL.yellow, yellowDk: "#e0ae1f", blue: COL.blue, blueDk: COL.blueDk,
  green: "#5fa83c", greenDk: "#3f7a2a", orange: COL.orange, orangeDk: "#cf7a1e", purple: COL.purple, purpleDk: "#6a4ea3",
  brown: "#6b4a2b", brownDk: "#4a3119", magenta: "#e0399a", cyan: "#2bb5e0",
};
const W = { yellow: "#f7d84a", lightGreen: "#bcd95c", green: "#78b64a", darkGreen: "#3f8a3a", pale: "#d4e8ad" };

// a lumpy blob of paint, centre (x, y), size r
const blob = (c: Ctx, x: number, y: number, r: number, col: string, dk: string, seed = 1) => {
  const g = rnd(seed), n = 9, pts: number[][] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, rr = r * (0.88 + g() * 0.24); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.8]); }
  const path = () => { c.moveTo((pts[n - 1][0] + pts[0][0]) / 2, (pts[n - 1][1] + pts[0][1]) / 2); for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n]; c.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); } c.closePath(); };
  shape(c, path, col, 5); shade(c, path, dk, r * 0.3, r * 0.22, 0.45);
  shine(c, [[x - r * 0.45, y - r * 0.3], [x - r * 0.2, y - r * 0.45]], 6);
};
// a paintbrush: tip at (tx, ty), pointing along an; the handle runs back from the tip
const brush = (c: Ctx, tx: number, ty: number, an: number, len = 380, tip: string = P.yellow) => {
  c.save(); c.translate(tx, ty); c.rotate(an);
  const h = () => rrect(c, -len, -13, len - 110, 26, 12);
  shape(c, h, COL.wood, 5); shade(c, h, COL.woodDk, 0, 9, 0.5);
  shape(c, () => rrect(c, -120, -16, 62, 32, 6), COL.steel, 5);
  shape(c, () => { c.moveTo(-60, -16); c.quadraticCurveTo(-20, -14, 0, 0); c.quadraticCurveTo(-20, 14, -60, 16); c.closePath(); }, "#d9c9a0", 5);
  shape(c, () => { c.moveTo(-30, -9); c.quadraticCurveTo(-10, -8, 0, 0); c.quadraticCurveTo(-10, 8, -30, 9); c.closePath(); }, tip, 0);
  c.restore();
};
// the child's hand gripping a brush whose tip is at (tx, ty), hand coming from direction an (toward the tip)
const handBrush = (c: Ctx, tx: number, ty: number, an: number, tip: string) => {
  brush(c, tx, ty, an, 400, tip);
  hand(c, tx - Math.cos(an) * 300, ty - Math.sin(an) * 300, an, 1.3);
};
const whitePlate = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shadow(c, x + rx * 0.08, y + ry * 0.25, rx, ry);
  shape(c, () => ell(c, x, y, rx, ry), WHITE);
  shape(c, () => ell(c, x, y - ry * 0.04, rx * 0.82, ry * 0.78), "#f4f1e9", 4);
};
const newspaper = (c: Ctx) => {
  c.fillStyle = "#e8e3d8"; c.fillRect(0, 0, D, D);
  c.strokeStyle = "#c4bdb0"; c.lineWidth = 3;
  for (let y = 60; y < D; y += 34) { c.beginPath(); c.moveTo(40, y); c.lineTo(D - 40, y); c.stroke(); }
  c.fillStyle = "#cfc8bb"; c.fillRect(60, 80, 300, 200); c.fillRect(760, 760, 260, 220);
};
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 14, y + h / 2 + 18, w / 2, h / 2); shape(c, () => rrect(c, x, y, w, h, 8), COL.paper, 6); };
const plus = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - s, y], [x + s, y]], 9); line(c, [[x, y - s], [x, y + s]], 9); };
const equals = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - s, y - s * 0.4], [x + s, y - s * 0.4]], 9); line(c, [[x - s, y + s * 0.4], [x + s, y + s * 0.4]], 9); };
// a colour sum: blob a + blob b = blob res, from x leftwards to the right, blob size r
const colourSum = (c: Ctx, x: number, y: number, r: number, a: [string, string], b: [string, string], res: [string, string], seed: number) => {
  blob(c, x, y, r, a[0], a[1], seed); plus(c, x + r * 2.1, y, r * 0.5); blob(c, x + r * 4.2, y, r, b[0], b[1], seed + 1); equals(c, x + r * 6.3, y, r * 0.5); blob(c, x + r * 8.4, y, r * 1.05, res[0], res[1], seed + 2);
};
const drop = (c: Ctx, x: number, y: number, r: number, col: string = P.blue) => shape(c, () => { c.moveTo(x, y - r * 1.6); c.quadraticCurveTo(x + r * 1.1, y - r * 0.2, x + r * 0.95, y + r * 0.25); c.arc(x, y + r * 0.25, r * 0.95, 0, Math.PI); c.quadraticCurveTo(x - r * 1.1, y - r * 0.2, x, y - r * 1.6); c.closePath(); }, col, 4);
// a dropper of blue colour, tip at (x, y), a drop falling below it
const dropper = (c: Ctx, x: number, y: number) => {
  shape(c, () => rrect(c, x - 30, y - 290, 60, 110, 26), COL.tealDk, 5);
  shape(c, () => { c.moveTo(x - 13, y - 185); c.lineTo(x + 13, y - 185); c.lineTo(x + 6, y); c.lineTo(x - 6, y); c.closePath(); }, COL.glass, 5);
  shape(c, () => { c.moveTo(x - 10, y - 120); c.lineTo(x + 10, y - 120); c.lineTo(x + 4, y - 8); c.lineTo(x - 4, y - 8); c.closePath(); }, P.blue, 0);
  drop(c, x, y + 50, 18);
};
// the yellow-and-blue-into-green plate: blobs, trails, a green swirl and the child's hand stirring
const mixPlate = (c: Ctx, steel: boolean, withRed: boolean, stirring: boolean) => {
  if (steel) plate(c, 520, 600, 350, 215); else whitePlate(c, 520, 600, 350, 215);
  if (withRed) blob(c, 320, 560, 42, P.red, P.redDk, 3);
  blob(c, 640, 470, 42, P.yellow, P.yellowDk, 4);
  blob(c, 700, 700, 42, P.blue, P.blueDk, 5);
  if (stirring) {
    line(c, [[625, 500], [560, 580], [520, 630]], 26, INK); line(c, [[625, 500], [560, 580], [520, 630]], 16, P.yellow);
    line(c, [[680, 690], [600, 670], [530, 650]], 26, INK); line(c, [[680, 690], [600, 670], [530, 650]], 16, P.blue);
    blob(c, 500, 645, 64, P.green, P.greenDk, 6);
    c.beginPath(); c.moveTo(500, 645); for (let t = 0; t < 4.5; t += 0.1) { const r = 6 + t * 9; c.lineTo(500 + Math.cos(t * 1.6) * r, 645 + Math.sin(t * 1.6) * r * 0.8); } c.strokeStyle = P.greenDk; c.lineWidth = 5; c.lineCap = "round"; c.stroke();
    handBrush(c, 500, 645, -2.46, P.green);
    const loop: number[][] = []; for (let t = 1.9; t <= 5.9; t += 0.25) loop.push([500 + Math.cos(t) * 105, 645 + Math.sin(t) * 82]); arrow(c, loop);
  } else {
    blob(c, 560, 600, 50, P.green, P.greenDk, 6);
    line(c, [[620, 500], [585, 560]], 20, INK); line(c, [[620, 500], [585, 560]], 11, P.yellow);
    line(c, [[680, 680], [610, 625]], 20, INK); line(c, [[680, 680], [610, 625]], 11, P.blue);
    handBrush(c, 470, 470, -2.3, P.yellow);
  }
};

// ------------------------------------------------------------ set-up cards
// e1.0: a white plate on newspaper, three small blobs far apart, brush and tumbler beside
const setupE1a = (c: Ctx) => {
  newspaper(c);
  glass(c, 940, 860, 130, 200, 0.55);
  shadow(c, 300, 930, 200, 18); brush(c, 440, 925, 0.05, 360, P.red);
  whitePlate(c, 520, 560, 350, 215);
  blob(c, 320, 520, 36, P.red, P.redDk, 3); blob(c, 640, 440, 36, P.yellow, P.yellowDk, 4); blob(c, 700, 660, 36, P.blue, P.blueDk, 5);
};
// e1.1: the brush pulls yellow and blue to the middle and stirs them green
const setupE1b = (c: Ctx) => { newspaper(c); mixPlate(c, false, true, true); };
// e1.2: a sheet of paper with three colour sums
const setupE1c = (c: Ctx) => {
  ground(c); paper(c, 90, 110, 900, 860);
  colourSum(c, 210, 300, 56, [P.yellow, P.yellowDk], [P.blue, P.blueDk], [P.green, P.greenDk], 11);
  colourSum(c, 210, 540, 56, [P.red, P.redDk], [P.yellow, P.yellowDk], [P.orange, P.orangeDk], 21);
  colourSum(c, 210, 780, 56, [P.red, P.redDk], [P.blue, P.blueDk], [P.purple, P.purpleDk], 31);
};
// e2.0: a glass of yellow water before a white sheet, a dropper of blue above it
const setupE2a = (c: Ctx) => {
  ground(c); paper(c, 180, 90, 720, 700);
  glass(c, 540, 840, 270, 400, 0.55, W.yellow);
  dropper(c, 540, 330);
};
// e2.1: three glasses, light green, green, dark green, 1, 3 and 6 drops under them
const setupE2b = (c: Ctx) => {
  ground(c); paper(c, 60, 80, 960, 560);
  const xs = [200, 540, 880], cols = [W.lightGreen, W.green, W.darkGreen], ns = [1, 3, 6];
  xs.forEach((x, i) => {
    glass(c, x, 600, 190, 300, 0.6, cols[i]);
    const n = ns[i], w = 44; for (let k = 0; k < n; k++) drop(c, x - ((n - 1) * w) / 2 + k * w, 700, 15);
    write(c, String(n), x - 24, 790, 110, INK, 10);
  });
};
// e2.2: the child pours water from a jug into the green water, which turns pale
const setupE2c = (c: Ctx) => {
  ground(c); paper(c, 100, 90, 560, 720);
  glass(c, 420, 880, 260, 400, 0.8, W.pale);
  // the jug, tilted, spout at its lower left
  c.save(); c.translate(780, 400); c.rotate(-1.0);
  const body = () => { c.moveTo(-100, -130); c.lineTo(100, -130); c.lineTo(80, 130); c.lineTo(-80, 130); c.closePath(); };
  shape(c, body, COL.sky, 6); shade(c, body, COL.waterDk, 30, 10, 0.3);
  shape(c, () => { c.moveTo(-100, -130); c.lineTo(-135, -150); c.lineTo(-90, -95); c.closePath(); }, COL.sky, 5);
  shape(c, () => { c.moveTo(100, -90); c.bezierCurveTo(190, -90, 190, 90, 90, 90); c.lineTo(90, 60); c.bezierCurveTo(160, 60, 160, -60, 100, -60); c.closePath(); }, COL.steel, 5);
  shape(c, () => ell(c, 0, -130, 100, 20), COL.water, 5);
  c.restore();
  line(c, [[585, 435], [480, 520], [430, 590]], 34, INK); line(c, [[585, 435], [480, 520], [430, 590]], 24, COL.water);
  hand(c, 920, 310, -2.5, 1.3);
  arrow(c, [[700, 580], [640, 720], [560, 800]]);
};

// ------------------------------------------------------------ card pictures
const flowE1 = (c: Ctx) => { ground(c); mixPlate(c, true, true, false); };
const flowE2 = (c: Ctx) => {
  ground(c); paper(c, 60, 80, 960, 700);
  glass(c, 300, 820, 240, 360, 0.55, W.yellow); dropper(c, 300, 350);
  glass(c, 800, 820, 240, 360, 0.55, W.darkGreen);
  arrow(c, [[470, 640], [640, 640]]);
};
// the things of each colour
const tomato = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.92), P.red); shade(c, () => ell(c, x, y, r, r * 0.92), P.redDk, r * 0.3, r * 0.22, 0.45); for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.7; leaf(c, x, y - r * 0.8, r * 0.45, a, COL.leaf); } shine(c, [[x - r * 0.45, y - r * 0.35], [x - r * 0.25, y - r * 0.5]], 7); };
const carrot = (c: Ctx, x: number, y: number, s: number) => { const b = () => { c.moveTo(x - s * 0.45, y - s * 0.6); c.quadraticCurveTo(x + s * 0.5, y - s * 0.7, x + s * 0.45, y - s * 0.5); c.quadraticCurveTo(x + s * 0.2, y + s * 0.4, x, y + s * 0.9); c.quadraticCurveTo(x - s * 0.3, y + s * 0.3, x - s * 0.45, y - s * 0.6); c.closePath(); }; shape(c, b, P.orange); shade(c, b, P.orangeDk, s * 0.2, s * 0.1, 0.45); for (let k = 0; k < 3; k++) leaf(c, x, y - s * 0.6, s * 0.5, -Math.PI / 2 + (k - 1) * 0.6); line(c, [[x - s * 0.2, y], [x + s * 0.15, y]], 4, P.orangeDk); line(c, [[x - s * 0.1, y + s * 0.3], [x + s * 0.1, y + s * 0.3]], 4, P.orangeDk); };
const lemon = (c: Ctx, x: number, y: number, r: number) => { const b = () => ell(c, x, y, r, r * 0.72, 0.2); shape(c, b, P.yellow); shade(c, b, P.yellowDk, r * 0.3, r * 0.2, 0.45); shape(c, () => ell(c, x + r * 0.95, y + r * 0.1, r * 0.16, r * 0.12), P.yellow, 4); shine(c, [[x - r * 0.5, y - r * 0.25], [x - r * 0.2, y - r * 0.4]], 6); };
const curryLeaf = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - s, y + s * 0.1], [x + s, y - s * 0.1]], 6, COL.leafDk); for (let k = -2; k <= 2; k++) { const px = x + k * s * 0.42, py = y - k * s * 0.04; leaf(c, px, py, s * 0.5, -1.1); leaf(c, px, py, s * 0.5, 1.9); } leaf(c, x + s, y - s * 0.1, s * 0.5, -0.1); };
const bucket = (c: Ctx, x: number, y: number, s: number) => { const b = () => { c.moveTo(x - s, y - s * 0.9); c.lineTo(x + s, y - s * 0.9); c.lineTo(x + s * 0.8, y + s * 0.9); c.lineTo(x - s * 0.8, y + s * 0.9); c.closePath(); }; shadow(c, x + s * 0.1, y + s * 0.95, s * 0.9, s * 0.14); shape(c, b, P.blue); shade(c, b, P.blueDk, s * 0.4, 0, 0.4); shape(c, () => ell(c, x, y - s * 0.9, s, s * 0.22), COL.sky, 5); c.beginPath(); c.arc(x, y - s * 0.9, s * 1.05, Math.PI * 1.08, Math.PI * 1.92); c.strokeStyle = INK; c.lineWidth = 12; c.stroke(); c.beginPath(); c.arc(x, y - s * 0.9, s * 1.05, Math.PI * 1.08, Math.PI * 1.92); c.strokeStyle = COL.steel; c.lineWidth = 5; c.stroke(); };
const brinjal = (c: Ctx, x: number, y: number, s: number) => { const b = () => { c.moveTo(x - s * 0.3, y - s * 0.9); c.bezierCurveTo(x + s * 0.4, y - s * 0.9, x + s * 0.9, y + s * 0.2, x + s * 0.5, y + s * 0.85); c.bezierCurveTo(x + s * 0.2, y + s * 1.1, x - s * 0.5, y + s * 0.9, x - s * 0.55, y + s * 0.2); c.bezierCurveTo(x - s * 0.6, y - s * 0.4, x - s * 0.6, y - s * 0.9, x - s * 0.3, y - s * 0.9); c.closePath(); }; shape(c, b, P.purple); shade(c, b, P.purpleDk, s * 0.25, s * 0.15, 0.5); for (let k = 0; k < 4; k++) leaf(c, x - s * 0.3, y - s * 0.85, s * 0.42, -0.2 + k * 0.75, COL.leaf); line(c, [[x - s * 0.3, y - s * 0.85], [x - s * 0.45, y - s * 1.2]], 7, COL.leafDk); };
const spoon = (c: Ctx, x: number, y: number, s: number) => { c.save(); c.translate(x, y); c.rotate(-0.5); shape(c, () => rrect(c, -s * 1.1, -s * 0.13, s * 1.6, s * 0.26, s * 0.13), COL.brown, 5); shape(c, () => ell(c, s * 0.75, 0, s * 0.42, s * 0.32), COL.brown); shape(c, () => ell(c, s * 0.75, 0, s * 0.28, s * 0.2), COL.soil, 3); c.restore(); };
const pot = (c: Ctx, x: number, y: number, s: number) => { const b = () => { c.moveTo(-s * 0.8, -s * 0.6); c.bezierCurveTo(-s * 1.2, s * 0.1, -s * 0.8, s * 0.9, 0, s * 0.9); c.bezierCurveTo(s * 0.8, s * 0.9, s * 1.2, s * 0.1, s * 0.8, -s * 0.6); c.closePath(); }; c.save(); c.translate(x, y); shadow(c, s * 0.1, s * 0.95, s * 0.8, s * 0.12); shape(c, b, COL.black); shade(c, b, "#1c1922", s * 0.3, 0, 0.6); shape(c, () => ell(c, 0, -s * 0.6, s * 0.85, s * 0.22), "#55505c", 5); shine(c, [[-s * 0.7, -s * 0.2], [-s * 0.6, s * 0.3]], 7); c.restore(); };
const mango = (c: Ctx, x: number, y: number, s: number) => { const b = () => { c.moveTo(x - s * 0.9, y - s * 0.3); c.bezierCurveTo(x - s * 0.9, y - s * 1.0, x + s * 0.2, y - s * 0.9, x + s * 0.6, y - s * 0.4); c.bezierCurveTo(x + s * 1.1, y + s * 0.2, x + s * 0.6, y + s * 0.9, x - s * 0.1, y + s * 0.8); c.bezierCurveTo(x - s * 0.8, y + s * 0.7, x - s * 0.95, y + s * 0.2, x - s * 0.9, y - s * 0.3); c.closePath(); }; shape(c, b, P.yellow); shade(c, b, P.orange, s * 0.35, s * 0.2, 0.7); line(c, [[x - s * 0.75, y - s * 0.55], [x - s * 0.9, y - s * 0.95]], 7, COL.leafDk); leaf(c, x - s * 0.85, y - s * 0.9, s * 0.5, -0.3); shine(c, [[x - s * 0.6, y - s * 0.3], [x - s * 0.4, y - s * 0.55]], 7); };
const slip = (c: Ctx, x: number, y: number, col: string) => { shape(c, () => rrect(c, x - 80, y - 34, 160, 68, 6), COL.paper, 5); c.fillStyle = col; c.fillRect(x - 66, y - 22, 132, 44); c.globalAlpha = 0.35; c.strokeStyle = WHITE; c.lineWidth = 3; for (let k = -60; k < 66; k += 12) { c.beginPath(); c.moveTo(x + k, y - 20); c.lineTo(x + k + 8, y + 20); c.stroke(); } c.globalAlpha = 1; };
const flowA1 = (c: Ctx) => {
  ground(c); shape(c, () => rrect(c, 30, 60, 1020, 960, 12), WHITE, 6);
  const xs = [180, 420, 660, 900];
  const row = (y: number, cols: string[], draw: ((x: number) => void)[]) => xs.forEach((x, i) => { draw[i](x); slip(c, x, y + 200, cols[i]); });
  row(250, [P.red, P.orange, P.yellow, P.green], [(x) => tomato(c, x, 260, 75), (x) => carrot(c, x, 250, 90), (x) => lemon(c, x, 265, 78), (x) => curryLeaf(c, x, 265, 95)]);
  row(680, [P.blue, P.purple, P.brown, COL.black], [(x) => bucket(c, x, 690, 78), (x) => brinjal(c, x, 680, 80), (x) => spoon(c, x, 690, 95), (x) => pot(c, x, 690, 80)]);
};
// the colour book, open: red + yellow = orange on the left page, a carrot and a marigold on the right
const marigold = (c: Ctx, x: number, y: number, r: number) => { for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; shape(c, () => ell(c, x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7, r * 0.38, r * 0.3, a), P.orange, 4); } shape(c, () => ell(c, x, y, r * 0.42, r * 0.42), P.orangeDk, 4); line(c, [[x, y + r], [x - r * 0.1, y + r * 1.8]], 6, COL.leafDk); leaf(c, x - r * 0.05, y + r * 1.4, r * 0.6, 0.4); };
const flowP1 = (c: Ctx) => {
  ground(c); shadow(c, 560, 900, 470, 40);
  const L = () => { c.moveTo(540, 200); c.lineTo(110, 240); c.lineTo(110, 870); c.lineTo(540, 830); c.closePath(); }, R = () => { c.moveTo(540, 200); c.lineTo(970, 240); c.lineTo(970, 870); c.lineTo(540, 830); c.closePath(); };
  shape(c, L, COL.paper); shape(c, R, COL.paper); shade(c, L, "#d9d1c0", 0, 0, 0); line(c, [[540, 200], [540, 830]], 6);
  for (const y of [330, 520, 710]) { shape(c, () => ell(c, 540, y, 9, 9), COL.red, 3); line(c, [[531, y + 6], [515, y + 40]], 4, COL.red); line(c, [[549, y + 6], [565, y + 40]], 4, COL.red); }
  blob(c, 190, 420, 46, P.red, P.redDk, 8); plus(c, 290, 420, 24); blob(c, 390, 420, 46, P.yellow, P.yellowDk, 9);
  equals(c, 290, 560, 26); blob(c, 400, 620, 60, P.orange, P.orangeDk, 10);
  carrot(c, 680, 520, 110); marigold(c, 850, 440, 70);
};
// the card game: mother holds up the yellow + blue card, the girl says "orange"? no: the girl says the answer
const paintCard = (c: Ctx, x: number, y: number, w: number, h: number, a: [string, string], b: [string, string]) => { shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 10), COL.paper, 6); const r = w * 0.17; blob(c, x - w * 0.27, y, r, a[0], a[1], 12); plus(c, x, y, r * 0.5); blob(c, x + w * 0.27, y, r, b[0], b[1], 13); };
const flowG1 = (c: Ctx) => {
  ground(c); c.fillStyle = "#e3d6bd"; c.fillRect(0, 980, D, 100); line(c, [[0, 980], [D, 980]], 5);
  person(c, 300, 980, 660, { adult: true, armR: [-0.5, -1.3], armL: [Math.PI * 0.55, Math.PI * 0.5] });
  paintCard(c, 600, 290, 240, 170, [P.red, P.redDk], [P.yellow, P.yellowDk]);
  shape(c, () => ell(c, 499, 356, 25, 25), SKIN.adult, 5);
  person(c, 790, 980, 460, { armL: [-2.3, -2.6], armR: [Math.PI * 0.45, Math.PI * 0.5] });
  shape(c, () => { ell(c, 880, 430, 120, 85); }, WHITE, 5); shape(c, () => polyP(c, [[840, 505], [820, 560], [880, 512]]), WHITE, 5); c.fillStyle = WHITE; c.fillRect(835, 500, 50, 14);
  blob(c, 880, 430, 46, P.orange, P.orangeDk, 14);
};
// mix and run: the girl holds up yellow and blue and runs to the green cushion
const flowG2 = (c: Ctx) => {
  ground(c); c.fillStyle = "#e3d6bd"; c.fillRect(0, 960, D, 120); line(c, [[0, 960], [D, 960]], 5);
  person(c, 420, 960, 520, { armL: [-2.2, -1.7], armR: [-0.94, -1.44] });
  const card = (x: number, col: string) => { shape(c, () => rrect(c, x - 70, 250, 140, 190, 8), COL.paper, 6); c.fillStyle = col; c.fillRect(x - 56, 266, 112, 158); };
  card(300, P.yellow); card(540, P.blue);
  shape(c, () => ell(c, 300, 437, 20, 20), SKIN.child, 5); shape(c, () => ell(c, 540, 437, 20, 20), SKIN.child, 5);
  shadow(c, 900, 950, 150, 22); const cu = () => rrect(c, 760, 760, 260, 190, 40); shape(c, cu, P.green); shade(c, cu, P.greenDk, 30, 24, 0.45);
  arrow(c, [[600, 800], [720, 840]]);
};
const termColour = (c: Ctx) => {
  ground(c); line(c, [[0, 760], [D, 760]], 6);
  shadow(c, 170, 755, 110, 16); mango(c, 160, 640, 110);
  curryLeaf(c, 420, 700, 110);
  shadow(c, 680, 755, 90, 16); tomato(c, 670, 660, 95);
  bucket(c, 930, 620, 100);
};
const termMix = (c: Ctx) => { ground(c); mixPlate(c, true, false, true); };
const paintPot = (c: Ctx, x: number, y: number, col: string, dk: string) => { shadow(c, x + 10, y + 140, 90, 18); const b = () => rrect(c, x - 80, y - 20, 160, 150, 14); shape(c, b, COL.steelIn); shade(c, b, COL.steelDk, 30, 0, 0.4); shape(c, () => rrect(c, x - 58, y + 30, 116, 70, 8), col, 4); shape(c, () => ell(c, x, y - 20, 80, 26), col, 5); shade(c, () => ell(c, x, y - 20, 80, 26), dk, 20, 8, 0.4); };
const termPrimary = (c: Ctx) => {
  ground(c);
  paintPot(c, 240, 240, P.red, P.redDk); paintPot(c, 540, 240, P.yellow, P.yellowDk); paintPot(c, 840, 240, P.blue, P.blueDk);
  arrow(c, [[270, 400], [360, 620]], INK, 7); arrow(c, [[510, 400], [420, 620]], INK, 7);
  arrow(c, [[570, 400], [660, 620]], INK, 7); arrow(c, [[810, 400], [720, 620]], INK, 7);
  arrow(c, [[190, 400], [120, 800], [450, 930]], INK, 7); arrow(c, [[890, 400], [960, 800], [630, 930]], INK, 7);
  blob(c, 390, 700, 70, P.orange, P.orangeDk, 15); blob(c, 690, 700, 70, P.green, P.greenDk, 17); blob(c, 540, 930, 70, P.purple, P.purpleDk, 16);
};
const explPrimary = (c: Ctx) => {
  ground(c); line(c, [[0, 880], [D, 880]], 6);
  shadow(c, 330, 885, 270, 20);
  const lid = () => rrect(c, 80, 250, 480, 300, 14); shape(c, lid, COL.teal); shade(c, lid, COL.tealDk, 24, 0, 0.5);
  shape(c, () => rrect(c, 60, 540, 520, 340, 14), COL.tealDk);
  shape(c, () => rrect(c, 90, 580, 460, 260, 10), COL.steelIn, 5);
  [[170, P.red, P.redDk], [320, P.yellow, P.yellowDk], [470, P.blue, P.blueDk]].forEach(([x, col, dk]) => { shape(c, () => ell(c, x as number, 710, 62, 62), col as string, 5); shade(c, () => ell(c, x as number, 710, 62, 62), dk as string, 18, 14, 0.45); });
  [[690, P.yellow], [820, P.magenta], [950, P.cyan]].forEach(([x, col]) => { shadow(c, (x as number) + 8, 885, 60, 12); const b = () => rrect(c, (x as number) - 52, 560, 104, 320, 12); shape(c, b, COL.steelIn); shade(c, b, COL.steelDk, 18, 0, 0.4); shape(c, () => rrect(c, (x as number) - 40, 580, 80, 110, 8), col as string, 4); shape(c, () => rrect(c, (x as number) - 30, 840, 60, 30, 4), COL.greyDk, 3); });
};

export const ic_lightColourL1 = cards("sci.light.colour.L1", [
  setupE1a, setupE1b, setupE1c, setupE2a, setupE2b, setupE2c,
  flowE1, flowE2, flowA1, flowP1, flowG1, flowG2, termColour, termMix, termPrimary, explPrimary,
]);
