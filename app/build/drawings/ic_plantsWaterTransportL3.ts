import type { Ctx } from "./core";
import { COL, SKIN, INK, WHITE, RED, D, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, person, leaf, ground, write, cards, rnd } from "./flatKit";

// sci.plants.water-transport.L3 picture cards: one idea each, big and central, red arrows for movement.
const BLUE = "#2f5fc0", BLUEMID = "#5b86d8", RED2 = "#d9443a", THREAD = COL.purple, OIL = "#f6c928", CLAY = "#c8693a", CLAYDK = "#a24f28", DULL = "#9fae5e";

const dropP = (c: Ctx, x: number, y: number, r: number, col: string = COL.water) => shape(c, () => { c.moveTo(x, y - r * 1.5); c.quadraticCurveTo(x + r * 0.2, y - r * 0.6, x + r, y + r * 0.2); c.arc(x, y + r * 0.2, r, 0, Math.PI); c.quadraticCurveTo(x - r * 0.2, y - r * 0.6, x, y - r * 1.5); c.closePath(); }, col, 3);
const stemLine = (c: Ctx, pts: number[][], w = 18, col: string = COL.green) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };
const qpts = (a: number[], b: number[], e: number[], n = 14) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u * u * a[0] + 2 * u * t * b[0] + t * t * e[0], u * u * a[1] + 2 * u * t * b[1] + t * t * e[1]]; });
const cpts = (a: number[], b: number[], d: number[], e: number[], n = 20) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * d[0] + t * t * t * e[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * d[1] + t * t * t * e[1]]; });
// a wavy red arrow from (x0,y0) to (x1,y1): vapour or water on the move
const wavy = (c: Ctx, x0: number, y0: number, x1: number, y1: number, amp = 12, w = 8, col: string = RED) => {
  const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, p: number[][] = [];
  for (let i = 0; i <= 12; i++) { const t = i / 12, o = i === 12 ? Math.sin(11 * 1.1) * amp : Math.sin(i * 1.1) * amp; p.push([x0 + ux * L * t - uy * o, y0 + uy * L * t + ux * o]); }
  arrow(c, p, col, w);
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 1.35, y + Math.sin(a) * r * 1.35], [x + Math.cos(a) * r * 2, y + Math.sin(a) * r * 2]], r * 0.16, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
const cloud = (c: Ctx, x: number, y: number, s: number, col: string = WHITE) => shape(c, () => { c.moveTo(x - 120 * s, y + 40 * s); c.arc(x - 90 * s, y, 40 * s, Math.PI * 0.5, Math.PI * 1.5); c.arc(x - 20 * s, y - 40 * s, 55 * s, Math.PI, Math.PI * 1.9); c.arc(x + 70 * s, y - 5 * s, 45 * s, Math.PI * 1.4, Math.PI * 2.5); c.lineTo(x - 120 * s, y + 40 * s); c.closePath(); }, col, 5);
const pot = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, y + 6, w * 0.6, w * 0.1);
  const p = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.34, y); c.lineTo(x - w * 0.34, y); c.closePath(); };
  shape(c, p, CLAY); shade(c, p, CLAYDK, w * 0.2, 0, 0.5);
  shape(c, () => rrect(c, x - w * 0.56, y - h - h * 0.22, w * 1.12, h * 0.26, h * 0.1), CLAY, 6);
  shape(c, () => ell(c, x, y - h - h * 0.08, w * 0.5, h * 0.07), COL.soil, 4);
};
// a potted plant, pot bottom centre at (x, y); droop 0 = upright, 1 = limp and bent over; returns the stem points
const potted = (c: Ctx, x: number, y: number, s: number, droop = 0, halo = false) => {
  const top = y - 120 * s;
  pot(c, x, y, 150 * s, 120 * s);
  const tip = [x + droop * 150 * s, top - 250 * s + droop * 190 * s], pts = qpts([x, top + 8], [x, top - 190 * s], tip);
  if (halo) { c.globalAlpha = 0.7; line(c, pts, 16 * s + 44, COL.yellow); c.globalAlpha = 1; }
  stemLine(c, pts, 13 * s, droop ? DULL : COL.green);
  const lc = droop ? DULL : COL.leaf, len = 70 * s;
  [3, 6, 9, 12].forEach((i, k) => { const [px, py] = pts[i]; if (droop) { leaf(c, px, py, len, Math.PI - 0.5, lc); leaf(c, px, py, len, 0.5, lc); } else { leaf(c, px, py, len, -Math.PI / 2 - 0.9 + k * 0.05, lc); leaf(c, px, py, len, -Math.PI / 2 + 0.9 - k * 0.05, lc); } });
  leaf(c, tip[0], tip[1], len * 0.9, droop ? 1.3 : -Math.PI / 2, lc);
  return pts;
};
const veins = (c: Ctx, x: number, y: number, len: number, an: number) => { for (const t of [0.3, 0.5, 0.7]) for (const sg of [-1, 1]) { const bx = x + Math.cos(an) * len * t, by = y + Math.sin(an) * len * t; line(c, [[bx, by], [bx + Math.cos(an + sg * 0.8) * len * 0.22, by + Math.sin(an + sg * 0.8) * len * 0.22]], 3, COL.leafDk); } };
const soilRect = (c: Ctx, y0: number) => { c.fillStyle = COL.soil; c.fillRect(0, y0, D, D - y0); const r = rnd(4); for (let i = 0; i < 40; i++) { c.beginPath(); ell(c, r() * D, y0 + 30 + r() * (D - y0 - 40), 7 + r() * 8, 5 + r() * 5); c.fillStyle = COL.soilDk; c.fill(); } line(c, [[0, y0], [D, y0]], 7); };
const root = (c: Ctx, pts: number[][], w: number) => { line(c, pts, w + 8, INK); line(c, pts, w, "#fffaf0"); };
const flowerHead = (c: Ctx, x: number, y: number, R: number, pet: string = WHITE, inner = "#eef4ff", vein = "") => {
  const n = 9;
  for (let i = 0; i < n; i++) {
    const a = (i * Math.PI * 2) / n + 0.3, px = x + Math.cos(a) * R * 0.58, py = y + Math.sin(a) * R * 0.58;
    shape(c, () => ell(c, px, py, R * 0.46, R * 0.27, a), pet, 5);
    if (vein) { shape(c, () => ell(c, x + Math.cos(a) * R * 0.52, y + Math.sin(a) * R * 0.52, R * 0.3, R * 0.14, a), inner, 0); line(c, [[x + Math.cos(a) * R * 0.3, y + Math.sin(a) * R * 0.3], [x + Math.cos(a) * R * 0.95, y + Math.sin(a) * R * 0.95]], 3, vein); }
    else shade(c, () => ell(c, px, py, R * 0.46, R * 0.27, a), "#cfc8b8", R * 0.1, R * 0.1, 0.5);
  }
  shape(c, () => ell(c, x, y, R * 0.22, R * 0.22), COL.yellow, 5);
};
const blueFlower = (c: Ctx, x: number, y: number, R: number) => flowerHead(c, x, y, R, BLUEMID, "#eef4ff", BLUE);
const redFlower = (c: Ctx, x: number, y: number, R: number) => flowerHead(c, x, y, R, "#e8756b", "#ffeceb", RED2);
const dashes = (c: Ctx, x0: number, y0: number, x1: number, y1: number, w = 5, col: string = INK) => { const L = Math.hypot(x1 - x0, y1 - y0), n = Math.floor(L / 30); for (let i = 0; i < n; i++) { const a = (i * 30) / L, b = (i * 30 + 16) / L; line(c, [[x0 + (x1 - x0) * a, y0 + (y1 - y0) * a], [x0 + (x1 - x0) * b, y0 + (y1 - y0) * b]], w, col); } };
const numDot = (c: Ctx, x: number, y: number, n: string) => { shape(c, () => ell(c, x, y, 40, 40), WHITE, 6); write(c, n, x - 12, y - 22, 44, INK, 7); };
const molecule = (c: Ctx, x: number, y: number, r: number, rot: number) => {
  for (const s of [-1, 1]) shape(c, () => ell(c, x + Math.cos(rot + s * 0.95) * r * 1.05, y + Math.sin(rot + s * 0.95) * r * 1.05, r * 0.46, r * 0.46), COL.drop, 4);
  shape(c, () => ell(c, x, y, r, r), COL.blue, 5); shine(c, [[x - r * 0.6, y - r * 0.2], [x - r * 0.3, y - r * 0.6]], 6);
};
const magnifier = (c: Ctx, lx: number, ly: number, R: number, inside: () => void, hx: number, hy: number) => {
  line(c, [[lx + R * 0.71, ly + R * 0.71], [hx, hy]], 56, INK); line(c, [[lx + R * 0.71, ly + R * 0.71], [hx, hy]], 44, COL.wood);
  shape(c, () => ell(c, lx, ly, R, R), "#f4f1d8", 0);
  c.save(); c.beginPath(); ell(c, lx, ly, R - 8, R - 8); c.clip(); inside(); c.restore();
  c.beginPath(); ell(c, lx, ly, R, R); c.lineWidth = 26; c.strokeStyle = INK; c.stroke(); c.lineWidth = 14; c.strokeStyle = COL.steel; c.stroke();
  shine(c, [[lx - R * 0.6, ly - R * 0.5], [lx - R * 0.35, ly - R * 0.72]], 10);
};

// ------------------------------------------------------------------ summary (the unit cover): a tree drinks through its roots
const pSummary = (c: Ctx) => {
  ground(c);
  sun(c, 920, 130, 50);
  soilRect(c, 830);
  const trunk = () => { c.moveTo(385, 840); c.quadraticCurveTo(425, 640, 420, 430); c.lineTo(495, 430); c.quadraticCurveTo(490, 640, 535, 840); c.closePath(); };
  shape(c, trunk, COL.brown); shade(c, trunk, "#7d5230", 30, 0, 0.5);
  for (const [x, y, rx, ry, col] of [[455, 370, 200, 120, COL.leaf], [335, 430, 135, 95, COL.leafDk], [575, 430, 135, 95, COL.leafDk], [455, 280, 140, 95, COL.greenLt]] as [number, number, number, number, string][]) shape(c, () => ell(c, x, y, rx, ry), col, 6);
  for (const [x, p] of [[455, [[455, 840], [440, 960], [445, 1040]]], [455, [[450, 850], [330, 920], [250, 1030]]], [455, [[460, 850], [590, 930], [680, 1030]]], [455, [[455, 845], [380, 960], [330, 1050]]], [455, [[455, 845], [540, 970], [560, 1050]]]] as [number, number[][]][]) root(c, [[x, 835], ...p], 14);
  dropP(c, 210, 930, 16); dropP(c, 720, 960, 16);
  arrow(c, [[230, 960], [300, 910]], RED, 9); arrow(c, [[700, 985], [640, 940]], RED, 9);
  arrow(c, [[455, 760], [455, 470]], RED, 14);
  wavy(c, 345, 270, 345, 150); wavy(c, 455, 190, 455, 60); wavy(c, 565, 270, 565, 150);
  person(c, 860, 830, 340, { armR: [-0.9, -0.8] });
};

// ------------------------------------------------------------------ e1: the Blue Climb
const pBlueClimb = (c: Ctx) => {
  ground(c);
  const gx = [300, 780], gy = 990, gw = 270, gh = 330;
  gx.forEach((x, k) => { stemLine(c, [[x, 440], [x, gy - 90]], 20); leaf(c, x, 600, 130, -0.45); leaf(c, x, 540, 130, Math.PI + 0.45); void k; });
  glass(c, gx[0], gy, gw, gh, 0.62, COL.sky); glass(c, gx[1], gy, gw, gh, 0.62, BLUE);
  gx.forEach((x) => { c.save(); c.globalAlpha = 0.6; line(c, [[x, gy - 90], [x, gy - 205]], 18, COL.green); c.restore(); });
  line(c, [[780, 900], [780, 450]], 5, BLUE); line(c, [[770, 900], [770, 520]], 3, "#8fb3ff");
  flowerHead(c, 300, 330, 140); blueFlower(c, 780, 330, 140);
  arrow(c, [[960, 800], [960, 470]], RED, 14);
};

// ------------------------------------------------------------------ e2: leafy or bare
const bottlePath = (c: Ctx, x: number) => { c.moveTo(x - 105, 950); c.lineTo(x + 105, 950); c.lineTo(x + 105, 590); c.quadraticCurveTo(x + 105, 520, x + 48, 490); c.lineTo(x + 48, 400); c.lineTo(x - 48, 400); c.lineTo(x - 48, 490); c.quadraticCurveTo(x - 105, 520, x - 105, 590); c.closePath(); };
const bottle = (c: Ctx, x: number, level: number, leafy: boolean) => {
  shadow(c, x + 20, 955, 130, 22);
  stemLine(c, [[x, 910], [x + 6, 130]], 14);
  if (leafy) { for (let i = 0; i < 3; i++) { const y = 360 - i * 90; leaf(c, x + 4, y, 130, -Math.PI / 2 - 0.9); leaf(c, x + 4, y, 130, -Math.PI / 2 + 0.9); } leaf(c, x + 6, 130, 90, -1.57); } else for (let i = 0; i < 5; i++) for (const sg of [-1, 1]) shape(c, () => ell(c, x + 4 + sg * 12, 350 - i * 55, 7, 11), COL.greenDk, 4);
  c.save(); c.beginPath(); bottlePath(c, x); c.clip();
  c.fillStyle = COL.water; c.globalAlpha = 0.75; c.fillRect(x - 120, level, 240, 400); c.globalAlpha = 1;
  c.fillStyle = OIL; c.fillRect(x - 120, level - 24, 240, 24);
  c.restore();
  shape(c, () => bottlePath(c, x), COL.glass, 5);
  shine(c, [[x - 80, 660], [x - 80, 880]], 8);
};
const pLeafyBare = (c: Ctx) => {
  ground(c);
  bottle(c, 270, 780, true); bottle(c, 810, 660, false);
  for (const x of [270, 810]) line(c, [[x - 112, 600], [x + 112, 600]], 7, THREAD);
  arrow(c, [[420, 600], [420, 770]], RED, 14); arrow(c, [[960, 600], [960, 650]], RED, 14);
  line(c, [[382, 600], [440, 600]], 5, THREAD); line(c, [[922, 600], [980, 600]], 5, THREAD);
};

// ------------------------------------------------------------------ e3: the sweating branch (sun and shade)
const AX = Math.PI / 4, BP = (t: number) => [t * Math.SQRT1_2, 250 + t * Math.SQRT1_2];
const bagPath = (c: Ctx) => { c.moveTo(0, -85); c.bezierCurveTo(60, -130, 180, -135, 280, -125); c.bezierCurveTo(330, -120, 345, -60, 345, 0); c.bezierCurveTo(345, 60, 330, 120, 280, 125); c.bezierCurveTo(180, 135, 60, 130, 0, 85); c.closePath(); };
const panelBack = (c: Ctx, sunny: boolean) => {
  c.fillStyle = sunny ? "#fff0b5" : "#aebfd4"; c.fillRect(0, 0, 540, D);
  if (sunny) sun(c, 95, 95, 52); else for (let x = -20; x < 600; x += 90) { shape(c, () => ell(c, x, 30, 80, 80), COL.leafDk, 5); shape(c, () => ell(c, x + 45, 10, 60, 60), COL.leaf, 5); }
  if (!sunny) { c.fillStyle = "rgba(43,35,64,0.12)"; c.fillRect(0, 120, 540, D); }
};
const branchBag = (c: Ctx, mist: number, drops: number) => {
  line(c, [BP(-30), BP(570)], 31, INK); line(c, [BP(-30), BP(570)], 22, COL.brown);
  for (const t of [90, 170, 300, 380, 460]) { const [x, y] = BP(t); leaf(c, x, y, 105, AX - 1.0); leaf(c, x, y, 105, AX + 1.0); }
  { const [x, y] = BP(550); leaf(c, x, y, 85, AX); }
  const [px, py] = BP(250);
  c.save(); c.translate(px, py); c.rotate(AX);
  shape(c, () => bagPath(c), "rgba(222,240,252,0.4)", 5);
  c.save(); c.beginPath(); bagPath(c); c.clip(); c.fillStyle = WHITE; c.globalAlpha = mist; c.fillRect(-10, -150, 380, 300); c.restore();
  line(c, [[40, -100], [210, -118]], 8, WHITE);
  c.restore();
  const r = rnd(9);
  c.save(); c.translate(px, py); c.rotate(AX); c.beginPath(); bagPath(c); c.clip(); c.rotate(-AX); c.translate(-px, -py);
  shape(c, () => ell(c, 322, 698, drops > 20 ? 78 : 30, drops > 20 ? 22 : 9), COL.water, 4);
  c.restore();
  for (let i = 0; i < drops; i++) { const u = 30 + r() * 290, v = (r() - 0.5) * 220; dropP(c, px + (u - v) * Math.SQRT1_2, py + (u + v) * Math.SQRT1_2, 7 + r() * 6, COL.drop); }
};
const pSweat = (c: Ctx) => {
  ground(c);
  for (const sunny of [true, false]) { c.save(); c.translate(sunny ? 0 : 540, 0); c.beginPath(); c.rect(0, 0, 540, D); c.clip(); panelBack(c, sunny); branchBag(c, sunny ? 0.6 : 0.12, sunny ? 34 : 5); c.restore(); }
  line(c, [[540, 0], [540, D]], 10);
};

// ------------------------------------------------------------------ a1: the two-colour flower
const pTwoColour = (c: Ctx) => {
  ground(c);
  const gx = [320, 760], gy = 1000, gw = 270, gh = 330;
  stemLine(c, [[540, 440], [540, 700]], 22);
  leaf(c, 540, 560, 150, -0.4); leaf(c, 540, 520, 150, Math.PI + 0.4);
  const legs = [qpts([540, 700], [530, 850], [gx[0], 930]), qpts([540, 700], [550, 850], [gx[1], 930])];
  legs.forEach((p) => stemLine(c, p, 16));
  shape(c, () => rrect(c, 505, 640, 70, 34, 8), "#f7f3e8", 5);
  glass(c, gx[0], gy, gw, gh, 0.6, BLUE); glass(c, gx[1], gy, gw, gh, 0.6, RED2);
  gx.forEach((x, k) => { c.save(); c.globalAlpha = 0.55; line(c, qpts([x + (k ? -40 : 40), 870], [x, 900], [x, 930], 6), 14, COL.green); c.restore(); });
  c.save(); c.beginPath(); c.rect(0, 0, 540, D); c.clip(); blueFlower(c, 540, 300, 150); c.restore();
  c.save(); c.beginPath(); c.rect(540, 0, 540, D); c.clip(); redFlower(c, 540, 300, 150); c.restore();
  shape(c, () => ell(c, 540, 300, 33, 33), COL.yellow, 5);
};

// ------------------------------------------------------------------ a2: the water chain on the stairs
const pChain = (c: Ctx) => {
  ground(c);
  const xs = [150, 400, 650, 900], ys = [940, 830, 720, 610];
  xs.forEach((x, i) => shape(c, () => rrect(c, x - 125, ys[i], 250, 1060 - ys[i], 8), i % 2 ? "#d9cdb4" : "#cdbfa5", 6));
  [3, 2, 1, 0].forEach((i) => person(c, xs[i], ys[i], i === 1 ? 350 : 300, i === 3 ? { adult: false, armR: [-1.2, -1.45], armL: [1.9, 1.7] } : { adult: i === 1, armR: [-0.5, -0.3], armL: [2.1, 1.9] }));
  cloud(c, 900, 160, 0.9, WHITE);
  wavy(c, 900, 285, 900, 215, 8, 9);
};

// ------------------------------------------------------------------ a4: bubbles from a leaf
const pBubbles = (c: Ctx) => {
  ground(c);
  const bowlP = () => { c.moveTo(130, 420); c.bezierCurveTo(130, 920, 950, 920, 950, 420); c.closePath(); };
  shadow(c, 560, 955, 400, 30);
  shape(c, bowlP, COL.glass, 0);
  c.save(); c.beginPath(); bowlP(); c.clip(); c.fillStyle = COL.water; c.globalAlpha = 0.65; c.fillRect(100, 480, 900, 500); c.globalAlpha = 1;
  leaf(c, 250, 760, 480, -0.12);
  const r = rnd(21);
  for (let i = 0; i < 16; i++) { const x = 330 + r() * 400, y = 560 + r() * 200; shape(c, () => ell(c, x, y, 9 + r() * 10, 9 + r() * 10), "rgba(255,255,255,0.75)", 3); }
  c.restore();
  shape(c, () => ell(c, 540, 480, 410, 38), "rgba(214,236,250,0.7)", 5);
  shape(c, bowlP, "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, 540, 420, 410, 40), "rgba(255,255,255,0.25)", 6);
  shine(c, [[190, 560], [230, 760]], 10);
  line(c, [[900, 140], [560, 650]], 34, INK); line(c, [[900, 140], [560, 650]], 22, COL.steel);
  shape(c, () => ell(c, 540, 680, 70, 40, -0.4), COL.steel, 6);
  arrow(c, [[800, 700], [800, 540]], RED, 14);
};

// ------------------------------------------------------------------ a5: climbing tea and the great straw test
const pStraw = (c: Ctx) => {
  ground(c);
  // left: a paper strip hung from a pencil, its bottom in coloured water
  const gx = 280, gy = 990, gw = 260, gh = 270;
  shape(c, () => rrect(c, 240, 700, 80, 200, 4), "#fffdf5", 5);
  shape(c, () => rrect(c, 240, 820, 80, 80, 4), COL.sky, 0);
  c.save(); c.beginPath(); rrect(c, 240, 700, 80, 200, 4); c.clip(); c.fillStyle = BLUE; c.globalAlpha = 0.8; c.beginPath(); c.moveTo(240, 800); c.quadraticCurveTo(280, 770, 320, 810); c.lineTo(320, 900); c.lineTo(240, 900); c.fill(); c.restore();
  glass(c, gx, gy, gw, gh, 0.6, COL.sky);
  c.save(); c.beginPath(); c.rect(0, 0, D, 810); c.clip(); shape(c, () => rrect(c, 240, 700, 80, 200, 4), "rgba(255,253,245,0.0)", 5); c.restore();
  shape(c, () => rrect(c, 90, 690, 380, 26, 12), COL.yellow, 6); shape(c, () => rrect(c, 90, 690, 70, 26, 12), THREAD, 5);
  shape(c, () => rrect(c, 235, 680, 90, 30, 6), "#f7f3e8", 4);
  arrow(c, [[380, 920], [380, 790]], RED, 12);
  // right: straws taped end to end; the water stops low
  const sx = 800;
  shadow(c, 830, 995, 160, 20);
  for (let i = 0; i < 3; i++) { const y0 = 960 - i * 280 - 10, y1 = y0 - 290; line(c, [[sx, y0], [sx, y1]], 34, INK); line(c, [[sx, y0], [sx, y1]], 22, i % 2 ? WHITE : "#f4a0b0"); }
  line(c, [[sx, 960], [sx, 700]], 12, BLUE);
  for (const y of [670, 390]) shape(c, () => rrect(c, sx - 24, y - 14, 48, 28, 6), "#f7f3e8", 4);
  glass(c, sx, 1000, 240, 200, 0.55, COL.sky);
  c.save(); c.globalAlpha = 0.6; line(c, [[sx, 900], [sx, 980]], 22, "#f4a0b0"); c.restore();
  dashes(c, 600, 700, 1040, 700, 5, INK);
  arrow(c, [[930, 900], [930, 740]], RED, 12);
};

// ------------------------------------------------------------------ a6: the dawn drop hunt
const pDawn = (c: Ctx) => {
  ground(c, "#ffe9b0");
  sun(c, 170, 200, 70);
  c.fillStyle = COL.leafDk; c.fillRect(0, 700, D, 380); line(c, [[0, 700], [D, 700]], 6);
  const blades: [number, number, number][] = [[80, 140, 500], [230, 330, 400], [380, 300, 330], [520, 560, 360], [660, 520, 470], [800, 700, 420], [940, 880, 520]];
  blades.forEach(([bx, tx, ty], i) => {
    shape(c, () => { c.moveTo(bx - 34, 1090); c.quadraticCurveTo(bx - 20, (1090 + ty) / 2, tx, ty); c.quadraticCurveTo(bx + 50, (1090 + ty) / 2 + 40, bx + 34, 1090); c.closePath(); }, i % 2 ? COL.green : COL.leaf, 6);
    line(c, [[bx, 1080], [bx + (tx - bx) * 0.35, (1090 + ty) / 2 + 10]], 3, COL.leafDk);
    shape(c, () => ell(c, tx, ty + 18, 26, 30), COL.drop, 4); shine(c, [[tx - 10, ty + 8], [tx - 6, ty + 2]], 6);
  });
};

// ------------------------------------------------------------------ c1: how high can you lift water
const pLift = (c: Ctx) => {
  ground(c);
  const gx = 300, gy = 990, gw = 280, gh = 300, wl = gy - gh * 0.6;
  // a ruler with the strip taped beside it
  shape(c, () => rrect(c, 215, 230, 80, 740, 6), COL.wood, 6);
  for (let k = 0; k < 24; k++) line(c, [[295, 250 + k * 30], [295 - (k % 2 ? 26 : 44), 250 + k * 30]], k % 2 ? 3 : 5);
  shape(c, () => rrect(c, 302, 240, 70, 700, 4), "#fffdf5", 5);
  c.save(); c.beginPath(); rrect(c, 302, 240, 70, 700, 4); c.clip(); c.fillStyle = BLUE; c.globalAlpha = 0.8; c.beginPath(); c.moveTo(300, 940); c.lineTo(300, 440); c.quadraticCurveTo(320, 400, 337, 430); c.quadraticCurveTo(355, 410, 374, 450); c.lineTo(374, 940); c.fill(); c.restore();
  glass(c, gx, gy, gw, gh, 0.6, COL.sky);
  for (const y of [300, 700]) shape(c, () => rrect(c, 205, y, 175, 34, 6), "rgba(247,243,232,0.9)", 4);
  line(c, [[430, wl], [620, wl]], 5, THREAD); line(c, [[380, 430], [620, 430]], 5, THREAD);
  arrow(c, [[560, 610], [560, 438]], RED, 14); arrow(c, [[560, 610], [560, wl - 6]], RED, 14);
};

// ------------------------------------------------------------------ c2: the holiday plant sitter (a wick from a jar)
const pSitter = (c: Ctx) => {
  ground(c);
  shadow(c, 200, 905, 160, 20);
  shape(c, () => rrect(c, 60, 900, 280, 50, 6), COL.teal, 6); shape(c, () => rrect(c, 80, 850, 250, 50, 6), COL.orange, 6);
  glass(c, 205, 850, 220, 290, 0.7, BLUE);
  potted(c, 790, 950, 1.5);
  const wick = cpts([200, 790], [190, 470], [480, 480], [790, 740]);
  line(c, wick, 24, INK); line(c, wick, 14, "#f2ead6");
  wavy(c, 440, 520, 560, 590, 0, 11);
};

// ------------------------------------------------------------------ terms
// term.0 Root: a weed lifted from the soil, white roots hanging down
const tRoot = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 985, 220, 24);
  stemLine(c, [[540, 200], [540, 560]], 18);
  for (const [y, a] of [[300, 0.6], [380, 0.5], [460, 0.45]] as number[][]) { leaf(c, 540, y, 190, -a - 0.2); leaf(c, 540, y, 190, Math.PI + a + 0.2); }
  leaf(c, 540, 200, 140, -1.57);
  shape(c, () => { c.moveTo(410, 600); c.bezierCurveTo(400, 500, 680, 500, 670, 600); c.bezierCurveTo(660, 670, 430, 670, 410, 600); c.closePath(); }, COL.soil, 6);
  const r = rnd(8); for (let i = 0; i < 10; i++) shape(c, () => ell(c, 440 + r() * 200, 560 + r() * 90, 7 + r() * 7, 5 + r() * 4), COL.soilDk, 0);
  const R: [number[][], number][] = [[[[540, 640], [545, 760], [540, 940]], 18], [[[500, 645], [420, 740], [340, 900]], 13], [[[580, 645], [660, 740], [740, 890]], 13], [[[530, 720], [470, 800], [450, 900]], 10], [[[555, 740], [620, 810], [640, 900]], 10], [[[460, 680], [380, 700], [300, 780]], 9], [[[620, 680], [700, 690], [790, 740]], 9]];
  R.forEach(([p, w]) => root(c, [[p[0][0], p[0][1] - 10], ...p], w));
};
// term.1 Root hair: a moong root through a magnifying glass, covered in white fuzz
const tRootHair = (c: Ctx) => {
  ground(c);
  const x0 = 400, y0 = 350, x1 = 740, y1 = 650, L0 = Math.hypot(x1 - x0, y1 - y0), nx = -(y1 - y0) / L0, ny = (x1 - x0) / L0;
  magnifier(c, 530, 470, 330, () => {
    c.fillStyle = "#8fb3dc"; c.fillRect(0, 0, D, D);
    const hairs: number[][][] = [];
    const rr = rnd(5);
    for (let i = 0; i < 13; i++) { const t = 0.28 + (i / 13) * 0.72, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; for (const sg of [-1, 1]) { const a = Math.atan2(sg * ny, sg * nx) + (rr() - 0.5) * 0.5, L = 75 + rr() * 45; hairs.push([[x, y], [x + Math.cos(a) * L * 0.55 + (rr() - 0.5) * 12, y + Math.sin(a) * L * 0.55], [x + Math.cos(a) * L, y + Math.sin(a) * L]]); } }
    hairs.forEach((h) => line(c, h, 16, INK)); hairs.forEach((h) => line(c, h, 8, WHITE));
    line(c, [[x0, y0], [x1, y1]], 70, INK); line(c, [[x0, y0], [x1, y1]], 58, "#fffaf0");
    seed(c, 370, 320, 75);
  }, 800, 770);
};
const seed = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.7, 0.7), COL.greenLt, 6); line(c, [[x - r * 0.4, y - r * 0.3], [x + r * 0.4, y + r * 0.25]], 6, "#f4f1e4"); };

// term.2 Absorb: a sponge standing in water, the water creeping up
const tAbsorb = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 975, 420, 28);
  shape(c, () => rrect(c, 140, 770, 800, 190, 34), COL.steel, 6);
  shape(c, () => ell(c, 540, 800, 380, 40), COL.water, 5);
  const sp = () => rrect(c, 390, 290, 300, 530, 30);
  shape(c, sp, COL.yellow, 6);
  c.save(); c.beginPath(); sp(); c.clip(); c.fillStyle = COL.water; c.globalAlpha = 0.6; c.beginPath(); c.moveTo(380, 820); c.lineTo(380, 540); c.quadraticCurveTo(430, 500, 480, 545); c.quadraticCurveTo(540, 580, 600, 530); c.quadraticCurveTo(650, 505, 700, 545); c.lineTo(700, 820); c.fill(); c.globalAlpha = 1;
  const r = rnd(2); for (let i = 0; i < 26; i++) { c.beginPath(); ell(c, 410 + r() * 260, 310 + r() * 480, 6 + r() * 9, 5 + r() * 6); c.fillStyle = "rgba(160,110,20,0.55)"; c.fill(); }
  c.restore(); shape(c, sp, "rgba(0,0,0,0)", 6);
  shape(c, () => { c.moveTo(140, 830); c.lineTo(940, 830); c.lineTo(940, 930); c.quadraticCurveTo(940, 960, 910, 960); c.lineTo(170, 960); c.quadraticCurveTo(140, 960, 140, 930); c.closePath(); }, COL.steel, 6);
  arrow(c, [[470, 760], [470, 580]], RED, 14); arrow(c, [[610, 760], [610, 560]], RED, 14);
  dropP(c, 250, 700, 16); dropP(c, 840, 690, 16);
};

// term.3 Stem: a balsam plant with its stem lit up
const tStem = (c: Ctx) => {
  ground(c);
  const pts = potted(c, 540, 1010, 1.8, 0, true);
  for (const i of [5, 8, 11]) { const [x, y] = pts[i]; for (const sg of [-1, 1]) { line(c, [[x, y], [x + sg * 50, y - 25]], 8); shape(c, () => ell(c, x + sg * 62, y - 30, 30, 22, sg * 0.5), COL.pink, 5); shape(c, () => ell(c, x + sg * 62, y - 30, 9, 9), COL.yellow, 3); } }
  arrow(c, [[690, 760], [690, 400]], RED, 14);
};

// term.4 Transport: a truck carries vegetables, a stem carries water
const tTransport = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.greyDk; c.fillRect(0, 850, 760, 110); line(c, [[0, 850], [760, 850]], 6);
  for (let x = 20; x < 760; x += 110) line(c, [[x, 905], [x + 55, 905]], 8, WHITE);
  shadow(c, 340, 860, 330, 20);
  shape(c, () => rrect(c, 70, 690, 400, 110, 10), COL.wood, 6);
  const veg: [number, number, string, number][] = [[110, 660, COL.red, 34], [185, 650, COL.red, 34], [260, 660, COL.purple, 34], [335, 650, COL.red, 34], [410, 660, COL.green, 34], [150, 610, COL.purple, 32], [225, 600, COL.green, 32], [300, 610, COL.red, 32], [375, 600, COL.red, 32]];
  veg.forEach(([x, y, col, r]) => shape(c, () => ell(c, x, y + 20, r, r * 0.88), col, 5));
  shape(c, () => rrect(c, 60, 700, 420, 100, 10), COL.wood, 6);
  shape(c, () => polyP(c, [[480, 800], [480, 640], [580, 640], [660, 730], [660, 800]]), COL.blue, 6);
  shape(c, () => polyP(c, [[505, 660], [570, 660], [622, 725], [505, 725]]), COL.sky, 5);
  for (const x of [190, 560]) { shape(c, () => ell(c, x, 810, 56, 56), INK, 0); shape(c, () => ell(c, x, 810, 24, 24), COL.steel, 4); }
  arrow(c, [[120, 1010], [520, 1010]], RED, 14);
  const pts = potted(c, 900, 1000, 1.3, 0);
  for (const i of [3, 7, 11]) dropP(c, pts[i][0], pts[i][1], 12);
  arrow(c, [[1010, 780], [1010, 460]], RED, 12);
};

// term.5 Xylem: a stalk cut across, a ring of blue dots in its end
const tXylem = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 930, 420, 24);
  shape(c, () => { c.moveTo(130, 380); c.lineTo(740, 330); c.lineTo(740, 840); c.lineTo(130, 780); c.closePath(); }, COL.greenLt, 6);
  for (const k of [0.2, 0.4, 0.6, 0.8]) line(c, [[130, 380 + 400 * k], [740, 330 + 510 * k]], 5, COL.green);
  for (const k of [0.3, 0.5, 0.7]) line(c, [[150, 380 + 400 * k], [740, 330 + 510 * k]], 4, BLUE);
  shape(c, () => ell(c, 740, 585, 150, 255), "#eef6d0", 7);
  shape(c, () => ell(c, 740, 585, 100, 175), "#e5edc0", 4);
  for (let i = 0; i < 10; i++) { const a = (i * Math.PI * 2) / 10 + 0.3; shape(c, () => ell(c, 740 + Math.cos(a) * 82, 585 + Math.sin(a) * 148, 20, 20), BLUE, 4); }
};

// term.7 Evaporate: wet clothes in the sun, vapour rising
const tEvaporate = (c: Ctx) => {
  ground(c);
  sun(c, 130, 130, 55);
  c.fillStyle = COL.green; c.fillRect(0, 950, D, 130); line(c, [[0, 950], [D, 950]], 6);
  for (const x of [60, 1000]) shape(c, () => rrect(c, x - 14, 440, 28, 520, 6), COL.wood, 6);
  line(c, [[60, 455], [540, 485], [1000, 455]], 8);
  const peg = (x: number, y: number) => shape(c, () => rrect(c, x - 9, y - 22, 18, 52, 5), COL.wood, 4);
  const tee = () => c.moveTo(0, 0);
  void tee;
  const shirt = () => polyP(c, [[190, 470], [350, 470], [440, 540], [400, 600], [360, 570], [360, 800], [180, 800], [180, 570], [140, 600], [100, 540]]);
  shape(c, shirt, COL.blue); shade(c, shirt, COL.blueDk, 40, 0, 0.5);
  shape(c, () => rrect(c, 470, 488, 210, 380, 8), COL.orange); for (const y of [560, 700]) line(c, [[475, y], [675, y]], 14, WHITE);
  shape(c, () => rrect(c, 730, 480, 190, 440, 8), COL.pink, 5);
  peg(215, 472); peg(330, 476); peg(500, 488); peg(650, 486); peg(760, 476); peg(890, 466);
  wavy(c, 270, 440, 270, 240, 14, 9); wavy(c, 580, 460, 580, 250, 14, 9); wavy(c, 830, 450, 830, 250, 14, 9);
};

// term.8 Water vapour: invisible vapour in the air turns to drops on a cold tumbler
const tVapour = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 905, 300, 24);
  shape(c, () => ell(c, 540, 905, 180, 18), COL.water, 4);
  const tb = () => { c.moveTo(390, 380); c.lineTo(690, 380); c.lineTo(640, 880); c.lineTo(440, 880); c.closePath(); };
  shape(c, tb, COL.steel); shade(c, tb, COL.steelDk, 50, 0, 0.55);
  shape(c, () => ell(c, 540, 380, 150, 26), COL.steelIn, 5);
  const r = rnd(14); for (let i = 0; i < 16; i++) dropP(c, 440 + r() * 200, 460 + r() * 380, 11 + r() * 5, COL.drop);
  for (const y of [420, 560, 700]) { wavy(c, 90, y, 340, y + 20, 12, 8); wavy(c, 990, y, 740, y + 20, 12, 8); }
};

// term.9 Transpiration: a bag over a leafy branch, misty, with drops inside
const tTranspire = (c: Ctx) => {
  ground(c);
  sun(c, 140, 150, 55);
  const y = 560;
  line(c, [[-20, y], [960, y]], 31, INK); line(c, [[-20, y], [960, y]], 22, COL.brown);
  leaf(c, 120, y, 120, -0.9); leaf(c, 120, y, 120, 0.9);
  for (const x of [520, 640, 760]) { leaf(c, x, y, 120, -0.9); leaf(c, x, y, 120, 0.9); }
  leaf(c, 880, y, 100, 0);
  const bag = () => { c.moveTo(410, y - 45); c.bezierCurveTo(450, y - 220, 700, y - 250, 900, y - 200); c.bezierCurveTo(1040, y - 150, 1050, y + 180, 900, y + 225); c.bezierCurveTo(700, y + 270, 450, y + 220, 410, y + 45); c.closePath(); };
  shape(c, bag, "rgba(222,240,252,0.55)", 5);
  c.save(); c.beginPath(); bag(); c.clip(); c.fillStyle = WHITE; c.globalAlpha = 0.35; c.fillRect(400, 300, 700, 500); c.globalAlpha = 1; c.restore();
  const r = rnd(33); for (let i = 0; i < 16; i++) dropP(c, 520 + r() * 420, y - 120 + r() * 300, 8 + r() * 6, COL.drop);
  shape(c, () => ell(c, 760, y + 200, 90, 18), COL.water, 4);
  shape(c, () => { c.moveTo(300, y - 36); for (let i = 0; i < 6; i++) c.lineTo(300 + (i + 1) * 20, y - 36 - (i % 2 ? 4 : 18) - i * 3); c.lineTo(430, y - 40); c.lineTo(430, y + 40); for (let i = 5; i >= 0; i--) c.lineTo(300 + (i + 1) * 20, y + 36 + (i % 2 ? 4 : 18) + i * 3); c.lineTo(300, y + 36); c.closePath(); }, "#dcecf7", 5);
  for (let i = 0; i < 3; i++) { const x = 330 + i * 22; line(c, [[x, y - 58], [x + 12, y + 58]], 15, INK); line(c, [[x, y - 58], [x + 12, y + 58]], 8, THREAD); }
  wavy(c, 600, y - 120, 600, y - 200, 8, 8); wavy(c, 720, y - 120, 720, y - 200, 8, 8); wavy(c, 840, y - 110, 840, y - 190, 8, 8);
};

// term.10 Stoma: the underside of a leaf under a microscope, little mouths
const tStomata = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 540, R = 420;
  shape(c, () => ell(c, cx, cy, R + 24, R + 24), COL.steel, 8);
  c.save(); c.beginPath(); ell(c, cx, cy, R, R); c.clip();
  c.fillStyle = "#bfe3a0"; c.fillRect(0, 0, D, D);
  for (let row = 0; row < 8; row++) for (let col = 0; col < 8; col++) shape(c, () => ell(c, 40 + col * 150 + (row % 2) * 75, 60 + row * 125, 72, 60), row % 3 ? "#cdeab0" : "#c2e3a4", 4);
  const r = rnd(3); for (let i = 0; i < 40; i++) { c.beginPath(); ell(c, 120 + r() * 840, 120 + r() * 840, 8, 6); c.fillStyle = COL.leaf; c.fill(); }
  for (const [x, y, a] of [[400, 360, 0.5], [700, 420, -0.4], [540, 560, 1.2], [360, 680, -0.2], [720, 700, 0.9], [560, 280, 0]] as number[][]) {
    c.save(); c.translate(x, y); c.rotate(a);
    shape(c, () => ell(c, 0, 0, 78, 50), COL.leafDk, 6);
    shape(c, () => ell(c, 0, 0, 52, 11), "#26323a", 3);
    c.restore();
  }
  c.restore();
  c.beginPath(); ell(c, cx, cy, R, R); c.lineWidth = 12; c.strokeStyle = INK; c.stroke();
  shine(c, [[250, 270], [330, 190]], 12);
};

// term.12 Wilt: a bunch of coriander drooping over a counter edge
const tWilt = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, -30, 640, 700, 70, 8), COL.wood, 6);
  shape(c, () => rrect(c, -30, 710, 660, 400, 4), "#d9c9a8", 6);
  const ends: number[][] = [[780, 820], [760, 900], [820, 760], [720, 960], [840, 880]];
  ends.forEach(([ex, ey], k) => {
    const pts = qpts([140, 628 - k * 4], [560 + k * 10, 620 - k * 6], [ex, ey], 18);
    stemLine(c, pts, 10, DULL);
    leaf(c, ex, ey, 100, 1.2 + (k % 2) * 0.5, DULL); leaf(c, ex, ey, 100, 2.2 - (k % 2) * 0.5, DULL); leaf(c, ex, ey, 90, 1.7, DULL);
    const m = pts[12]; leaf(c, m[0], m[1], 80, 0.9, DULL); leaf(c, m[0], m[1], 80, 2.4, DULL);
  });
  for (const x of [180, 300, 420]) { leaf(c, x, 620, 90, -0.2, DULL); leaf(c, x + 40, 625, 80, 0.25, DULL); }
  shape(c, () => rrect(c, 200, 600, 26, 34, 6), RED, 5);
  arrow(c, [[930, 760], [930, 930]], RED, 14);
};

// term.15 Cohesion: water molecules in a chain, holding on, climbing a thin tube
const tCohesion = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1030, 200, 20);
  shape(c, () => rrect(c, 410, 120, 260, 900, 50), COL.glass, 6);
  const m: number[][] = [[490, 930], [590, 820], [490, 710], [590, 600], [490, 490], [590, 380], [490, 270]];
  for (let i = 0; i < m.length - 1; i++) { line(c, [m[i], m[i + 1]], 20, INK); line(c, [m[i], m[i + 1]], 11, COL.yellow); }
  m.forEach(([x, y], i) => molecule(c, x, y, 46, i % 2 ? 2.2 : -0.9));
  shine(c, [[435, 220], [435, 940]], 8);
  arrow(c, [[760, 950], [760, 280]], RED, 16);
};

// term.16 Capillary action: tea creeping up a tissue
const tCapillary = (c: Ctx) => {
  ground(c);
  const gx = 420, gy = 990, gw = 320, gh = 340, TEA = "#a8613a";
  const tis = () => polyP(c, [[395, 330], [525, 340], [560, 910], [430, 910]]);
  shape(c, tis, "#fffdf5", 5);
  c.save(); c.beginPath(); tis(); c.clip(); c.fillStyle = TEA; c.globalAlpha = 0.8; c.beginPath(); c.moveTo(380, 910); c.lineTo(400, 560); c.quadraticCurveTo(440, 510, 470, 560); c.quadraticCurveTo(500, 520, 540, 565); c.lineTo(580, 910); c.fill(); c.restore();
  glass(c, gx, gy, gw, gh, 0.58, TEA);
  arrow(c, [[480, 830], [480, 560]], RED, 14);
};

// ------------------------------------------------------------------ explanations
// expl.0 The path of water: root hairs, stem tubes, leaf veins, mist into the air
const xPath = (c: Ctx) => {
  ground(c);
  soilRect(c, 660);
  stemLine(c, [[420, 668], [420, 330]], 24);
  leaf(c, 425, 430, 340, -0.55); veins(c, 425, 430, 340, -0.55);
  leaf(c, 415, 520, 300, Math.PI + 0.5); veins(c, 415, 520, 300, Math.PI + 0.5);
  leaf(c, 420, 330, 110, -1.5);
  const rts: number[][][] = [[[420, 660], [420, 800], [415, 960]], [[420, 680], [310, 780], [230, 900]], [[420, 680], [530, 780], [610, 890]], [[420, 740], [350, 850], [330, 980]], [[420, 740], [480, 850], [510, 980]]];
  rts.forEach((p) => root(c, p, 12));
  const r = rnd(6); for (const [x, y] of [[250, 900], [610, 890], [330, 980], [510, 980], [230, 800], [620, 790]]) for (let k = 0; k < 5; k++) { const a = r() * 6.28; line(c, [[x, y], [x + Math.cos(a) * 28, y + Math.sin(a) * 28]], 4, WHITE); }
  arrow(c, [[420, 600], [420, 400]], RED, 14);
  dropP(c, 700, 800, 16); arrow(c, [[690, 810], [620, 850]], RED, 9);
  wavy(c, 530, 300, 540, 160); wavy(c, 640, 260, 650, 120); wavy(c, 190, 340, 190, 210);
  numDot(c, 700, 940, "1"); numDot(c, 520, 560, "2"); numDot(c, 590, 440, "3"); numDot(c, 780, 140, "4");
};

// expl.1 The tubes inside a stem: xylem, in three zooms
const xTubes = (c: Ctx) => {
  ground(c);
  const xs = [190, 540, 890], cy = 540, R = 145;
  xs.forEach((x) => shape(c, () => ell(c, x, cy, R, R), "#fffaf0", 8));
  c.save(); c.beginPath(); ell(c, xs[0], cy, R - 4, R - 4); c.clip();
  stemLine(c, [[190, 420], [190, 650]], 26); leaf(c, 190, 560, 90, -0.5);
  flowerHead(c, 190, 400, 60);
  shape(c, () => ell(c, 190, 668, 24, 12), "#e8f3c8", 4);
  c.restore();
  shape(c, () => ell(c, xs[1], cy, 105, 105), COL.greenLt, 6); shape(c, () => ell(c, xs[1], cy, 88, 88), "#f4f1d8", 4);
  for (let i = 0; i < 9; i++) { const a = (i * Math.PI * 2) / 9 + 0.2; shape(c, () => ell(c, xs[1] + Math.cos(a) * 60, cy + Math.sin(a) * 60, 15, 15), BLUE, 4); }
  c.save(); c.beginPath(); ell(c, xs[2], cy, R - 4, R - 4); c.clip();
  for (let k = 2; k >= 0; k--) { const y0 = 470 + k * 90; shape(c, () => rrect(c, 852, y0, 76, 84, 4), "#dff0fa", 5); }
  for (let k = 0; k < 3; k++) { const y0 = 470 + k * 90; shape(c, () => ell(c, 890, y0, 38, 12), COL.water, 5); }
  c.restore();
  arrow(c, [[890, 660], [890, 420]], RED, 12);
  arrow(c, [[340, 540], [388, 540]], RED, 10); arrow(c, [[692, 540], [740, 540]], RED, 10);
};

// expl.5 Why plants wilt and spring back: limp plant with flat cells, firm plant with plump cells
const xWilt = (c: Ctx) => {
  ground(c);
  for (const firm of [false, true]) {
    c.save(); c.translate(firm ? 540 : 0, 0); c.beginPath(); c.rect(0, 0, 540, D); c.clip();
    c.fillStyle = firm ? "#dcefd0" : "#e6dcc4"; c.fillRect(0, 0, 540, D);
    potted(c, 270, 1000, 1.3, firm ? 0 : 1);
    shape(c, () => ell(c, 270, 250, 190, 190), "#f4f1d8", 7);
    c.save(); c.beginPath(); ell(c, 270, 250, 186, 186); c.clip();
    if (firm) for (const [x, y] of [[215, 195], [330, 195], [215, 305], [330, 305]]) { shape(c, () => ell(c, x, y, 58, 58), COL.greenLt, 5); shape(c, () => ell(c, x, y, 38, 38), COL.water, 3); }
    else for (const [x, y] of [[270, 165], [200, 255], [340, 255], [270, 345]]) { shape(c, () => { c.moveTo(x - 70, y); c.quadraticCurveTo(x - 30, y - 24, x, y - 8); c.quadraticCurveTo(x + 30, y - 26, x + 70, y); c.quadraticCurveTo(x + 40, y + 24, x, y + 8); c.quadraticCurveTo(x - 30, y + 26, x - 70, y); c.closePath(); }, DULL, 5); }
    c.restore();
    c.restore();
  }
  line(c, [[540, 0], [540, D]], 10);
};

// expl.6 What makes a plant drink faster: hot sun and wind, shade, night, damp morning
const xFaster = (c: Ctx) => {
  ground(c);
  const panels: [number, number, string][] = [[0, 0, "#fff0b5"], [540, 0, "#c9d3df"], [0, 540, "#2b3a67"], [540, 540, "#dfe6ea"]];
  panels.forEach(([px, py, bg], k) => {
    c.save(); c.translate(px, py); c.beginPath(); c.rect(0, 0, 540, 540); c.clip();
    c.fillStyle = bg; c.fillRect(0, 0, 540, 540);
    if (k === 0) { sun(c, 90, 90, 44); for (const y of [250, 330, 410]) arrow(c, [[20, y], [150, y + 5]], COL.steelDk, 9); }
    if (k === 1) { cloud(c, 270, 70, 0.9, "#aeb8c6"); }
    if (k === 2) { shape(c, () => ell(c, 430, 90, 50, 50), "#f6e7a8", 5); shape(c, () => ell(c, 452, 78, 44, 44), bg, 0); for (const [x, y] of [[100, 70], [200, 140], [320, 60], [500, 200]]) shape(c, () => ell(c, x, y, 7, 7), "#f6e7a8", 0); }
    if (k === 3) { for (const [x, y, rx] of [[130, 380, 160], [400, 300, 150], [300, 470, 200], [90, 230, 110]]) { c.beginPath(); ell(c, x, y, rx, 36); c.fillStyle = "rgba(255,255,255,0.7)"; c.fill(); } }
    potted(c, 270, 515, 0.75, 0);
    if (k === 0) { wavy(c, 190, 300, 190, 130, 12, 10); wavy(c, 270, 280, 270, 100, 12, 10); wavy(c, 350, 300, 350, 130, 12, 10); }
    if (k === 1) wavy(c, 270, 300, 270, 240, 6, 7);
    if (k === 2) wavy(c, 270, 300, 270, 260, 4, 5);
    if (k === 3) { wavy(c, 270, 300, 270, 265, 4, 5); for (const [x, y] of [[190, 330], [350, 340]]) dropP(c, x, y, 8, COL.drop); }
    c.restore();
  });
  line(c, [[540, 0], [540, D]], 10); line(c, [[0, 540], [D, 540]], 10);
};

// expl.9 A straw cannot do what a tree does: water stops at 10 m in a straw, but climbs to the top of a tree
const xStraw = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.soil; c.fillRect(0, 985, D, 95); line(c, [[0, 985], [D, 985]], 6);
  const sx = 250;
  for (let i = 0; i < 3; i++) { const y0 = 960 - i * 290, y1 = y0 - 300; line(c, [[sx, y0], [sx, y1]], 34, INK); line(c, [[sx, y0], [sx, y1]], 22, i % 2 ? WHITE : "#f4a0b0"); }
  line(c, [[sx, 960], [sx, 700]], 12, BLUE);
  for (const y of [670, 380]) shape(c, () => rrect(c, sx - 24, y - 14, 48, 28, 6), "#f7f3e8", 4);
  glass(c, sx, 985, 220, 200, 0.55, COL.sky);
  c.save(); c.globalAlpha = 0.6; line(c, [[sx, 900], [sx, 970]], 22, "#f4a0b0"); c.restore();
  dashes(c, 300, 700, 1040, 700, 5, INK);
  write(c, "10 m", 20, 640, 40, INK, 7);
  arrow(c, [[340, 940], [340, 740]], RED, 12);
  const trunk = () => { c.moveTo(715, 990); c.quadraticCurveTo(745, 600, 740, 300); c.lineTo(810, 300); c.quadraticCurveTo(805, 600, 845, 990); c.closePath(); };
  shape(c, trunk, COL.brown); shade(c, trunk, "#7d5230", 25, 0, 0.5);
  for (const [x, y, rx, ry, col] of [[775, 200, 170, 120, COL.leaf], [660, 290, 110, 80, COL.leafDk], [900, 290, 110, 80, COL.leafDk]] as [number, number, number, number, string][]) shape(c, () => ell(c, x, y, rx, ry), col, 6);
  arrow(c, [[778, 940], [778, 230]], RED, 14);
};

export const ic_plantsWaterTransportL3 = cards("sci.plants.water-transport.L3 cards", [pSummary, pBlueClimb, pLeafyBare, pSweat, pTwoColour, pChain, pBubbles, pStraw, pDawn, pLift, pSitter, tRoot, tRootHair, tAbsorb, tStem, tTransport, tXylem, tEvaporate, tVapour, tTranspire, tStomata, tWilt, tCohesion, tCapillary, xPath, xTubes, xWilt, xFaster, xStraw]);
