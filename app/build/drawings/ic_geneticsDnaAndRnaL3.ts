import type { Ctx } from "./core";
import { COL, CLOTH, INK, RED, SKIN, WHITE, arrow, cards, ground, shape, ell, rrect, polyP, shadow, shade, line, plate, seed, leaf, write, glass } from "./flatKit";

// sci.genetics.dna-and-rna.L3 picture cards. DNA bars: A red, T yellow, C blue, G green (A pairs T, C pairs G); RNA uses pink for U.

const BASE: Record<string, string> = { A: "#e4523b", T: "#ffd34d", C: "#5b8fd6", G: "#6aa53f", U: "#f29ab4" };
const PAIR: Record<string, string> = { A: "T", T: "A", C: "G", G: "C" };
const BB = "#8b6cc9", RNAB = "#f39a3c", CELL = "#fbd3c0", CELLDK = "#e9a98f", NUC = "#c9b6ec", NUCDK = "#9b83d6";
const SEQ = "ATCGGCATTACGGATCCGTA";

type HelixOpt = { amp?: number; turns?: number; bw?: number; b1?: string; b2?: string };
const helix = (c: Ctx, x0: number, y0: number, x1: number, y1: number, seq: string, o: HelixOpt = {}) => {
  const amp = o.amp ?? 50, bw = o.bw ?? 16, b1 = o.b1 ?? BB, b2 = o.b2 ?? BB;
  const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux, n = seq.length, turns = o.turns ?? n / 5;
  const ph = (s: number) => (s / L) * turns * Math.PI * 2;
  const P = (s: number, side: number) => { const off = Math.sin(ph(s)) * amp * side; return [x0 + ux * s + nx * off, y0 + uy * s + ny * off]; };
  const steps = Math.round(turns * 20);
  const segs: { a: number[]; b: number[]; d: number; col: string }[] = [];
  for (const side of [1, -1]) for (let i = 0; i < steps; i++) { const s0 = (L * i) / steps, s1 = (L * (i + 1)) / steps; segs.push({ a: P(s0, side), b: P(s1, side), d: Math.cos(ph((s0 + s1) / 2)) * side, col: side > 0 ? b1 : b2 }); }
  const draw = (list: typeof segs) => { list.forEach((g) => line(c, [g.a, g.b], bw + 9, INK)); list.forEach((g) => line(c, [g.a, g.b], bw, g.col)); };
  draw(segs.filter((g) => g.d < 0));
  const rw = Math.min((L / n) * 0.6, 26);
  for (let i = 0; i < n; i++) {
    const s = (L * (i + 0.5)) / n, a = P(s, 1), b = P(s, -1), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], ch = seq[i];
    line(c, [a, b], rw + 8, INK); line(c, [a, m], rw, BASE[ch]); line(c, [m, b], rw, BASE[PAIR[ch]]);
  }
  draw(segs.filter((g) => g.d >= 0));
};
// a single strand with its letters sticking out on one side (RNA: orange backbone)
const strand = (c: Ctx, x0: number, y0: number, x1: number, y1: number, seq: string, amp = 22, stub = 44) => {
  const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux, n = seq.length;
  const P = (s: number) => { const off = Math.sin((s / L) * n * 1.4) * amp; return [x0 + ux * s + nx * off, y0 + uy * s + ny * off]; };
  for (let i = 0; i < n; i++) { const p = P((L * (i + 0.5)) / n), q = [p[0] + nx * stub, p[1] + ny * stub]; line(c, [p, q], 24, INK); line(c, [p, q], 14, BASE[seq[i]]); }
  const pts: number[][] = []; for (let k = 0; k <= n * 8; k++) pts.push(P((L * k) / (n * 8)));
  line(c, pts, 26, INK); line(c, pts, 16, RNAB);
};
const blobP = (c: Ctx, x: number, y: number, rx: number, ry: number, w: number, sd: number) => {
  for (let i = 0; i <= 72; i++) { const t = (i / 72) * Math.PI * 2, k = 1 + w * Math.sin(t * 3 + sd) + w * 0.6 * Math.sin(t * 5 + sd * 2); const px = x + Math.cos(t) * rx * k, py = y + Math.sin(t) * ry * k; i ? c.lineTo(px, py) : c.moveTo(px, py); }
  c.closePath();
};
const cellBody = (c: Ctx, x: number, y: number, rx: number, ry: number, col = CELL, dk = CELLDK, sd = 1) => {
  const p = () => blobP(c, x, y, rx, ry, 0.03, sd);
  shape(c, p, col, 8); shade(c, p, dk, rx * 0.06, ry * 0.08, 0.5);
};
const nucleus = (c: Ctx, x: number, y: number, r: number) => {
  const p = () => ell(c, x, y, r, r);
  shape(c, p, NUC, 7); shade(c, p, NUCDK, r * 0.1, r * 0.1, 0.5);
};
const bead = (c: Ctx, x: number, y: number, r: number, col: string) => { shape(c, () => ell(c, x, y, r, r), col, 5); line(c, [[x - r * 0.5, y - r * 0.45], [x - r * 0.2, y - r * 0.6]], 4, WHITE); };
const BEADS = [COL.orange, COL.teal, COL.pink, COL.blue, COL.yellow, COL.purple, COL.greenLt];
const chain = (c: Ctx, pts: number[][], r: number) => { line(c, pts, 10, INK); pts.forEach(([x, y], i) => bead(c, x, y, r, BEADS[i % BEADS.length])); };
const folded = (cx: number, cy: number, R: number, n: number) => Array.from({ length: n }, (_, i) => { const t = i * 0.62; return [cx + R * Math.sin(t * 1.9 + 0.4) * (0.65 + 0.35 * Math.cos(t * 0.8)), cy + R * 0.85 * Math.cos(t * 1.3) * (0.7 + 0.3 * Math.sin(t * 1.1))]; });
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 10; i++) { const a = (i / 10) * 6.283; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.8, y + Math.sin(a) * r * 1.8]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
const drop = (c: Ctx, x: number, y: number, s: number) => shape(c, () => { c.moveTo(x, y - s * 1.6); c.quadraticCurveTo(x + s * 0.3, y - s * 0.6, x + s, y + s * 0.2); c.arc(x, y + s * 0.2, s, 0, Math.PI); c.quadraticCurveTo(x - s * 0.3, y - s * 0.6, x, y - s * 1.6); c.closePath(); }, COL.water, 5);

// ---- seedlings
const stemP = (c: Ctx, x: number, y: number, tx: number, ty: number, w = 16, col = "#e4efb0") => {
  const p = () => { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + (tx - x) * 0.1, (y + ty) / 2, tx, ty); };
  c.lineCap = "round"; p(); c.strokeStyle = INK; c.lineWidth = w + 10; c.stroke(); p(); c.strokeStyle = col; c.lineWidth = w; c.stroke();
};
const ovalLeaf = (c: Ctx, x: number, y: number, len: number, an: number, col: string, wid = 0.5) => {
  const mx = x + Math.cos(an) * len / 2, my = y + Math.sin(an) * len / 2;
  shape(c, () => ell(c, mx, my, len / 2, (len * wid) / 2, an), col, 5);
  line(c, [[x + Math.cos(an) * len * 0.1, y + Math.sin(an) * len * 0.1], [x + Math.cos(an) * len * 0.85, y + Math.sin(an) * len * 0.85]], 3, COL.leafDk);
};
const heartLeaf = (c: Ctx, x: number, y: number, len: number, an: number, col: string) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => { c.moveTo(0, 0); c.bezierCurveTo(len * 0.2, -len * 0.6, len * 0.9, -len * 0.62, len, -len * 0.25); c.quadraticCurveTo(len * 0.84, 0, len, len * 0.25); c.bezierCurveTo(len * 0.9, len * 0.62, len * 0.2, len * 0.6, 0, 0); c.closePath(); }, col, 5);
  line(c, [[len * 0.1, 0], [len * 0.8, 0]], 3, COL.leafDk);
  c.restore();
};
const moongS = (c: Ctx, x: number, y: number, h: number) => { stemP(c, x, y, x + 8, y - h); leaf(c, x + 8, y - h, 120, -2.45, COL.leaf); leaf(c, x + 8, y - h, 120, -0.7, COL.leaf); seed(c, x, y + 4, 22, 0, false); };
const methiS = (c: Ctx, x: number, y: number, h: number) => {
  stemP(c, x, y, x + 6, y - h, 13);
  ovalLeaf(c, x + 2, y - h * 0.45, h * 0.3, -3.0, COL.greenLt, 0.4); ovalLeaf(c, x + 2, y - h * 0.45, h * 0.3, -0.14, COL.greenLt, 0.4);
  ovalLeaf(c, x + 6, y - h, h * 0.2, -2.2, COL.leaf, 0.55); ovalLeaf(c, x + 6, y - h, h * 0.2, -0.95, COL.leaf, 0.55); ovalLeaf(c, x + 6, y - h, h * 0.22, -1.57, COL.leaf, 0.55);
  seed(c, x, y + 4, 14, 0, false, "#d2a640", "#9a722a");
};
const mustardS = (c: Ctx, x: number, y: number, h: number) => { stemP(c, x, y, x, y - h, 12); heartLeaf(c, x, y - h, h * 0.6, -2.7, COL.leafDk); heartLeaf(c, x, y - h, h * 0.6, -0.44, COL.leafDk); seed(c, x, y + 4, 10, 0, false, "#5a4636", "#2e2219"); };
const cotton = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  const p = () => { for (let i = 0; i <= 48; i++) { const t = (i / 48) * Math.PI * 2, k = 1 + 0.035 * Math.sin(t * 7); const px = x + Math.cos(t) * rx * k, py = y + Math.sin(t) * ry * k; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); };
  shape(c, p, "#d6e6f3", 5); shade(c, p, "#8fb3d6", -rx * 0.07, -ry * 0.14, 0.5);
};
const chana = (c: Ctx, x: number, y: number, r: number, soaked = false) => {
  const col = soaked ? "#9a6e45" : "#5d3d29", dk = soaked ? "#6f4a2c" : "#35200f";
  shape(c, () => ell(c, x, y, r, r * 0.88, 0.3), col, Math.max(3, r * 0.12));
  shape(c, () => polyP(c, [[x + r * 0.7, y - r * 0.55], [x + r * 1.2, y - r * 0.9], [x + r * 0.95, y - r * 0.2]]), col, Math.max(3, r * 0.1));
  c.save(); c.beginPath(); ell(c, x, y, r, r * 0.88, 0.3); c.clip(); c.beginPath(); ell(c, x - r * 0.35, y - r * 0.3, r, r * 0.88, 0.3); c.rect(-5000, -5000, 10000, 10000); c.fillStyle = dk; c.globalAlpha = 0.55; c.fill("evenodd"); c.restore(); c.globalAlpha = 1;
};
const face = (c: Ctx, x: number, y: number, r: number, adult = false) => {
  const skin = adult ? SKIN.adult : SKIN.child, cl = adult ? CLOTH.adult : CLOTH.child, cdk = adult ? CLOTH.adultDk : CLOTH.childDk;
  const sh = () => rrect(c, x - r * 1.25, y + r * 1.05, r * 2.5, r * 1.6, r * 0.5);
  shape(c, sh, cl); shade(c, sh, cdk, r * 0.15, 0, 0.55);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 1.0, y + r * 0.1, r * 0.17, r * 0.26), skin, 5);
  shape(c, () => ell(c, x, y, r, r * 1.05), skin);
  shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.02, y); c.closePath(); }, CLOTH.hair, 5);
  if (adult) shape(c, () => ell(c, x, y - r * 1.25, r * 0.36, r * 0.36), CLOTH.hair, 5); else shape(c, () => ell(c, x + r * 0.95, y - r * 0.2, r * 0.32, r * 0.55), CLOTH.hair, 4);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.35, y + r * 0.1, r * 0.09, r * 0.12), INK, 0);
  line(c, [[x, y + r * 0.22], [x - r * 0.06, y + r * 0.36], [x + r * 0.06, y + r * 0.36]], 4, adult ? SKIN.adultDk : SKIN.childDk);
  c.beginPath(); c.arc(x, y + r * 0.45, r * 0.28, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
const magnifier = (c: Ctx, x: number, y: number, r: number, an: number, inside: () => void) => {
  const dx = Math.cos(an), dy = Math.sin(an);
  line(c, [[x + dx * r, y + dy * r], [x + dx * r * 1.9, y + dy * r * 1.9]], 36, INK); line(c, [[x + dx * r, y + dy * r], [x + dx * r * 1.9, y + dy * r * 1.9]], 22, COL.brown);
  shape(c, () => ell(c, x, y, r, r), "#f4faff", 0);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); inside(); c.restore();
  c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = INK; c.lineWidth = 24; c.stroke(); c.strokeStyle = COL.steel; c.lineWidth = 12; c.stroke();
};
const GRID: Record<string, string> = {};
const paperGrid = (c: Ctx, x: number, y: number, s: number, rows: string[]) => {
  shadow(c, x + s * 2.1, y + s * rows.length + 12, s * 2.2, 14);
  shape(c, () => rrect(c, x - 18, y - 18, s * 4 + 36, s * rows.length + 36, 12), WHITE, 6);
  rows.forEach((r, j) => [...r].forEach((ch, i) => shape(c, () => rrect(c, x + i * s + 3, y + j * s + 3, s - 6, s - 6, 6), BASE[ch], 4)));
};
const pencil = (c: Ctx, x: number, y: number, len: number, an: number, col: string) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -17, len, 34, 6), col, 5);
  shape(c, () => polyP(c, [[len, -17], [len + 44, 0], [len, 17]]), "#f1d6a8", 5);
  shape(c, () => polyP(c, [[len + 30, -5], [len + 44, 0], [len + 30, 5]]), INK, 2);
  c.restore();
};
const book = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.04, y + h / 2 + 8, w * 0.55, 18);
  shape(c, () => polyP(c, [[x - w / 2 - 14, y - h / 2 - 12], [x + w / 2 + 14, y - h / 2 - 12], [x + w / 2 + 14, y + h / 2 + 12], [x - w / 2 - 14, y + h / 2 + 12]]), COL.red, 6);
  shape(c, () => polyP(c, [[x - w / 2, y - h / 2], [x, y - h / 2 + 12], [x, y + h / 2 + 8], [x - w / 2, y + h / 2 - 4]]), COL.paper, 5);
  shape(c, () => polyP(c, [[x + w / 2, y - h / 2], [x, y - h / 2 + 12], [x, y + h / 2 + 8], [x + w / 2, y + h / 2 - 4]]), COL.paper, 5);
};
const textLines = (c: Ctx, x: number, y: number, w: number, n: number, gap: number, hl = -1) => {
  for (let i = 0; i < n; i++) { if (i === hl) { shape(c, () => rrect(c, x - 8, y + i * gap - 14, w + 16, 28, 8), COL.yellow, 0); } line(c, [[x, y + i * gap], [x + w * (i % 3 === 2 ? 0.7 : 1), y + i * gap]], 6, i === hl ? INK : COL.greyDk); }
};
const spiralThread = (c: Ctx, cx: number, cy: number, R: number) => {
  const pts: number[][] = []; for (let k = 0; k <= 220; k++) { const t = k * 0.21; pts.push([cx + R * Math.sin(t * 1.0 + 0.4) * Math.cos(t * 0.37), cy + R * Math.cos(t * 1.13) * Math.sin(t * 0.29 + 1)]); }
  line(c, pts, 17, INK); line(c, pts, 9, COL.pink);
};

// ===================================================================== pictures
const summary = (c: Ctx) => {
  ground(c);
  helix(c, 190, 220, 890, 220, "ATCGGCATTACG", { amp: 60, turns: 3 });
  plate(c, 540, 860, 460, 130);
  cotton(c, 540, 858, 375, 96);
  moongS(c, 270, 850, 380); methiS(c, 540, 850, 300); mustardS(c, 810, 850, 190);
  arrow(c, [[540, 350], [540, 440]], RED, 11);
};
const flowE1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 880, 480, 120); cotton(c, 540, 878, 395, 88);
  const cols: [number, (c: Ctx, x: number, y: number, h: number) => void, number, number][] = [[240, moongS, 360, 34], [540, methiS, 290, 22], [840, mustardS, 180, 13]];
  cols.forEach(([x, fn, h, r], i) => {
    shape(c, () => rrect(c, x - 80, 90, 160, 120, 14), WHITE, 5);
    seed(c, x, 150, r * 2.0, 0.3, false, i === 0 ? COL.green : i === 1 ? "#d2a640" : "#5a4636", i === 0 ? COL.greenDk : i === 1 ? "#9a722a" : "#2e2219");
    arrow(c, [[x, 235], [x, 330]], RED, 10);
    fn(c, x, 880, h);
  });
};
const flowE2 = (c: Ctx) => {
  ground(c);
  plate(c, 290, 700, 250, 140); cotton(c, 290, 698, 205, 105);
  chana(c, 200, 690, 62, true); chana(c, 380, 700, 36, true);
  arrow(c, [[290, 450], [290, 570]], RED, 10);
  chana(c, 200, 330, 78); chana(c, 380, 340, 45);
  arrow(c, [[480, 560], [610, 560]], RED, 11);
  const sprout = (x: number, y: number, h: number, big: number) => { stemP(c, x, y, x, y - h, 18); leaf(c, x, y - h * 0.55, 80 * big, -2.6); leaf(c, x, y - h * 0.55, 80 * big, -0.55); leaf(c, x, y - h, 70 * big, -1.57); chana(c, x, y + 6, 30 * big, true); };
  plate(c, 830, 900, 230, 80);
  sprout(740, 880, 420, 1.15); sprout(900, 880, 390, 0.8);
  const rx = 990, top = 400, per = 32;
  shape(c, () => polyP(c, [[rx - 60, top], [rx, top], [rx, 880], [rx - 60, 880]]), COL.wood, 5);
  for (let i = 0; i <= 14; i++) line(c, [[rx, 880 - i * 32.5], [rx - 28, 880 - i * 32.5]], 4);
};
const flowA1 = (c: Ctx) => {
  ground(c);
  chana(c, 190, 800, 70, false); arrow(c, [[260, 720], [330, 640]], RED, 11);
  magnifier(c, 600, 480, 330, Math.PI * 0.25, () => {
    // an opened bean: two halves with a baby plant on the left half
    const half = (x: number, y: number, s: number) => { shape(c, () => ell(c, x, y, 190, 250, 0), "#9a6e45", 8); shape(c, () => ell(c, x + s * 12, y, 160, 220, 0), "#f4e3b8", 5); };
    half(500, 480, -1); half(700, 480, 1);
    shape(c, () => { c.moveTo(500, 560); c.quadraticCurveTo(470, 480, 520, 430); c.quadraticCurveTo(535, 480, 530, 560); c.closePath(); }, "#fffaf0", 5);
    leaf(c, 520, 430, 80, -2.2, COL.leaf); leaf(c, 520, 430, 80, -0.9, COL.leaf);
    line(c, [[515, 570], [500, 620]], 12, INK); line(c, [[515, 570], [500, 620]], 6, "#fffaf0");
  });
};
const flowA2 = (c: Ctx) => {
  ground(c);
  paperGrid(c, 80, 190, 100, ["ATTA", "CGGC", "CGGC", "ATTA"]);
  paperGrid(c, 600, 190, 100, ["GCCG", "TAAT", "ATTA", "GCCG"]);
  line(c, [[500, 360], [570, 360]], 12, RED); line(c, [[500, 420], [570, 420]], 12, RED);
  ["A", "T", "C", "G"].forEach((ch, i) => pencil(c, 140 + i * 230, 760 + i * 12, 150, -0.12, BASE[ch]));
};
const flowA3 = (c: Ctx) => {
  ground(c);
  book(c, 250, 400, 400, 330);
  textLines(c, 80, 290, 150, 5, 50, 2); textLines(c, 278, 290, 150, 5, 50);
  arrow(c, [[250, 640], [250, 700], [420, 780]], RED, 11);
  shadow(c, 540, 905, 140, 14);
  c.save(); c.translate(560, 780); c.rotate(-0.06); shape(c, () => rrect(c, -130, -110, 260, 220, 10), WHITE, 6); textLines(c, -90, -40, 180, 1, 0, 0); line(c, [[-90, 20], [60, 20]], 6, COL.greyDk); c.restore();
  arrow(c, [[720, 730], [820, 700]], RED, 11);
  glass(c, 900, 760, 190, 330, 0.75, "#f6c1d0");
};
const flowA4 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 290, 470, 20);
  shape(c, () => polyP(c, [[70, 200], [1010, 200], [1010, 280], [70, 280]]), COL.yellow, 6);
  for (let i = 0; i <= 40; i++) line(c, [[90 + i * 22.5, 200], [90 + i * 22.5, 200 + (i % 10 === 0 ? 40 : 22)]], 4);
  const th: number[][] = []; for (let i = 0; i <= 40; i++) th.push([100 + i * 22.2, 340 + Math.sin(i * 0.9) * 14]);
  line(c, th, 17, INK); line(c, th, 9, COL.pink);
  write(c, "2 m", 440, 100, 70, INK, 9);
  arrow(c, [[540, 410], [540, 500]], RED, 12);
  shape(c, () => ell(c, 540, 780, 260, 260), CELL, 8);
  nucleus(c, 540, 780, 190);
  c.save(); c.beginPath(); ell(c, 540, 780, 180, 180); c.clip(); spiralThread(c, 540, 780, 170); c.restore();
  c.beginPath(); ell(c, 540, 780, 190, 190); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
};
const flowA5 = (c: Ctx) => {
  ground(c);
  face(c, 290, 440, 190, true); face(c, 790, 520, 150, false);
  for (const [x, y, r] of [[290 - 190, 440 + 19, 190], [290 + 190, 440 + 19, 190], [790 - 150, 520 + 15, 150], [790 + 150, 520 + 15, 150]]) { c.beginPath(); ell(c, x, y, r * 0.26, r * 0.36); c.strokeStyle = RED; c.lineWidth = 9; c.stroke(); }
  line(c, [[540, 470], [592, 470]], 13, RED); line(c, [[540, 540], [592, 540]], 13, RED);
};
const photo = (c: Ctx, x: number, y: number, w: number, h: number, ph: number) => {
  shadow(c, x + w / 2 + 6, y + h + 8, w * 0.5, 12);
  shape(c, () => rrect(c, x, y, w, h, 8), WHITE, 6);
  shape(c, () => rrect(c, x + 14, y + 14, w - 28, h - 28, 4), COL.sky, 3);
  shape(c, () => ell(c, x + w / 2, y + h - 40, w * 0.33, 20), "#d6e6f3", 3);
  if (ph > 0) { stemP(c, x + w / 2, y + h - 42, x + w / 2, y + h - 42 - ph, 8); if (ph > 30) { leaf(c, x + w / 2, y + h - 42 - ph, ph * 0.55, -2.4); leaf(c, x + w / 2, y + h - 42 - ph, ph * 0.55, -0.74); } }
  else seed(c, x + w / 2, y + h - 52, 14, 0.2, false);
};
const flowP1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 160, 1000, 700, 26), COL.brown, 8);
  shape(c, () => rrect(c, 70, 190, 940, 640, 14), COL.paper, 5);
    [[90, 0, 1], [400, 90, 5], [710, 200, 10]].forEach(([x, ph, d]) => { photo(c, x, 250, 270, 380, ph); write(c, String(d), x + (d === 10 ? 80 : 110), 670, 70, INK, 8); });
  arrow(c, [[120, 960], [900, 960]], RED, 13);
  pencil(c, 840, 120, 150, 0.2, COL.yellow);
};
const flowC1 = (c: Ctx) => {
  ground(c);
  paperGrid(c, 70, 270, 100, ["ACGT", "TGCA", "GATC", "CTAG"]);
  arrow(c, [[500, 470], [590, 470]], RED, 13);
  shape(c, () => rrect(c, 620, 160, 400, 620, 28), "#3c3350", 6);
  const dots: number[][] = []; [1, 3, 5, 3, 1].forEach((n, j) => { for (let i = 0; i < n; i++) dots.push([820 + (i - (n - 1) / 2) * 90, 470 + (j - 2) * 90]); });
  for (let a = 0; a < 4; a++) { c.save(); c.translate(820, 470); c.rotate(a * Math.PI / 2); c.beginPath(); c.ellipse(70, 0, 128, 52, 0, 0, Math.PI * 2); c.strokeStyle = WHITE; c.lineWidth = 9; c.stroke(); c.restore(); }
  dots.forEach(([x, y]) => { c.beginPath(); ell(c, x, y, 11, 11); c.fillStyle = "#ffe08a"; c.fill(); });
};
// ---- terms
const termGene = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 380, 340, 330, 340, 30), "rgba(255,211,77,0.55)", 6);
  helix(c, 60, 510, 1020, 510, SEQ, { amp: 70, turns: 4.5, bw: 18 });
  line(c, [[390, 740], [390, 790], [700, 790], [700, 740]], 12, RED);
  arrow(c, [[545, 800], [545, 900]], RED, 12);
  bead(c, 545, 960, 36, COL.orange);
};
const termRna = (c: Ctx) => {
  ground(c);
  helix(c, 60, 300, 1020, 300, SEQ, { amp: 70, turns: 4.5, bw: 18 });
  arrow(c, [[540, 420], [540, 570]], RED, 13);
  strand(c, 270, 760, 810, 760, "UAGCCGUAAUGC", 24, 56);
};
const termProtein = (c: Ctx) => {
  ground(c);
  const row = Array.from({ length: 12 }, (_, i) => [110 + i * 78, 250 + Math.sin(i * 0.8) * 20]);
  chain(c, row, 36);
  arrow(c, [[540, 360], [540, 470]], RED, 12);
  chain(c, folded(540, 760, 190, 16), 42);
};
const termCell = (c: Ctx) => {
  ground(c);
  cellBody(c, 540, 540, 450, 400);
  nucleus(c, 470, 480, 150);
  shape(c, () => ell(c, 470, 480, 50, 50), NUCDK, 5);
  [[760, 420, 80, 38, 0.5], [740, 690, 90, 40, -0.3], [260, 720, 80, 36, 0.4], [320, 290, 70, 32, -0.6]].forEach(([x, y, rx, ry, rot]) => { shape(c, () => ell(c, x, y, rx, ry, rot), COL.green, 5); line(c, [[x - rx * 0.5 * Math.cos(rot), y - rx * 0.5 * Math.sin(rot)], [x + rx * 0.5 * Math.cos(rot), y + rx * 0.5 * Math.sin(rot)]], 5, COL.greenDk); });
  [[620, 730], [640, 300], [820, 560], [250, 540], [560, 780]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 14, 14), COL.pink, 4));
};
const termNucleus = (c: Ctx) => {
  ground(c);
  cellBody(c, 270, 780, 240, 200);
  nucleus(c, 270, 780, 85);
  line(c, [[320, 725], [540, 380]], 8, RED); line(c, [[300, 700], [370, 190]], 8, RED);
  shape(c, () => ell(c, 640, 400, 350, 350), NUC, 0);
  c.save(); c.beginPath(); ell(c, 640, 400, 340, 340); c.clip(); spiralThread(c, 640, 400, 320); c.restore();
  c.beginPath(); ell(c, 640, 400, 345, 345); c.strokeStyle = INK; c.lineWidth = 14; c.stroke(); c.strokeStyle = NUCDK; c.lineWidth = 6; c.stroke();
};
const termInherit = (c: Ctx) => {
  ground(c);
  shadow(c, 250, 950, 180, 20); shadow(c, 830, 950, 140, 18);
  c.save(); c.translate(0, 0);
  import_person(c, 230, 960, 760, true); import_person(c, 840, 960, 520, false);
  c.restore();
  helix(c, 400, 480, 680, 480, "ATCGGCAT", { amp: 38, turns: 2, bw: 14 });
  arrow(c, [[420, 360], [660, 360]], RED, 14);
};
const termChromosome = (c: Ctx) => {
  ground(c);
  const arm = (x: number, y: number, an: number) => { c.save(); c.translate(x, y); c.rotate(an); shape(c, () => rrect(c, 0, -62, 330, 124, 62), "#b9a4e3", 7); shade(c, () => rrect(c, 0, -62, 330, 124, 62), NUCDK, 0, 18, 0.5); for (let i = 0; i < 6; i++) line(c, [[40 + i * 46, -56], [62 + i * 46, 56]], 7, NUCDK); c.restore(); };
  arm(420, 520, Math.PI * 1.25); arm(420, 520, Math.PI * 1.75); arm(420, 520, Math.PI * 0.25); arm(420, 520, Math.PI * 0.75);
  shape(c, () => ell(c, 420, 520, 60, 60), "#b9a4e3", 7);
  helix(c, 640, 330, 1030, 190, "ATCGGCATTACG", { amp: 36, turns: 2.4, bw: 12 });
  write(c, "46", 700, 760, 130, INK, 14);
};
const termSeedLeaf = (c: Ctx) => {
  ground(c);
  plate(c, 540, 930, 330, 80); cotton(c, 540, 928, 270, 55);
  stemP(c, 540, 910, 546, 380, 22);
  ovalLeaf(c, 542, 690, 260, -3.0, COL.greenLt, 0.42); ovalLeaf(c, 542, 690, 260, -0.14, COL.greenLt, 0.42);
  ovalLeaf(c, 546, 380, 130, -2.3, COL.leaf, 0.6); ovalLeaf(c, 546, 380, 130, -0.85, COL.leaf, 0.6); ovalLeaf(c, 546, 380, 150, -1.57, COL.leaf, 0.6);
  seed(c, 540, 925, 26, 0, false, "#d2a640", "#9a722a");
  arrow(c, [[150, 480], [200, 600], [260, 660]], RED, 12);
};
// ---- explanations
const bubble = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), "#f4faff", 0);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); helix(c, x - r * 1.1, y, x + r * 1.1, y, "ATCGGCATTACG", { amp: r * 0.38, turns: 2.4, bw: 12 }); c.restore();
  c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = INK; c.lineWidth = 14; c.stroke(); c.strokeStyle = COL.steel; c.lineWidth = 6; c.stroke();
};
const explLiving = (c: Ctx) => {
  ground(c);
  plate(c, 250, 940, 220, 50); cotton(c, 250, 938, 180, 34);
  methiS(c, 250, 930, 360);
  line(c, [[250, 330], [250, 560]], 8, INK);
  bubble(c, 250, 230, 150);
  shadow(c, 800, 960, 160, 18);
  import_person(c, 800, 960, 520, false);
  line(c, [[800, 400], [800, 520]], 8, INK);
  bubble(c, 800, 250, 150);
};
const explProteins = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 360, 90, 300, 260, 30), "rgba(255,211,77,0.55)", 6);
  helix(c, 60, 220, 1020, 220, SEQ, { amp: 60, turns: 4.5, bw: 16 });
  arrow(c, [[510, 380], [510, 470]], RED, 12);
  chain(c, Array.from({ length: 12 }, (_, i) => [140 + i * 72, 560 + Math.sin(i * 0.8) * 16]), 32);
  arrow(c, [[510, 660], [510, 740]], RED, 12);
  chain(c, folded(510, 890, 150, 14), 34);
};
const explRnaCopy = (c: Ctx) => {
  ground(c);
  cellBody(c, 540, 520, 480, 420, CELL, CELLDK, 2);
  nucleus(c, 340, 400, 200);
  helix(c, 190, 400, 490, 400, "ATCGGCAT", { amp: 45, turns: 1.8, bw: 14 });
  strand(c, 540, 470, 800, 640, "UAGCCGU", 18, 44);
  arrow(c, [[600, 410], [720, 470]], RED, 12);
  shape(c, () => ell(c, 800, 740, 80, 46), COL.teal, 6); shape(c, () => ell(c, 800, 700, 56, 34), COL.tealDk, 6);
  chain(c, [[800, 790], [830, 850], [790, 910], [840, 960]], 28);
};
const explPages = (c: Ctx) => {
  ground(c);
  const bands: [number, number, string][] = [[70, 320, "#f29ab4"], [380, 700, "#ffd34d"], [760, 1010, "#e4523b"]];
  bands.forEach(([a, b, col]) => shape(c, () => rrect(c, a, 100, b - a, 220, 22), col, 5));
  helix(c, 60, 210, 1020, 210, SEQ, { amp: 60, turns: 4.5, bw: 16 });
  const cells: [number, string][] = [[190, "#f29ab4"], [540, "#ffd34d"], [885, "#e4523b"]];
  cells.forEach(([x, col], i) => { arrow(c, [[x, 350], [x, 450]], RED, 11); void col; void i; });
  // skin tile
  shape(c, () => rrect(c, 70, 520, 240, 240, 30), "#f6c1c8", 8); nucleus(c, 190, 640, 60);
  // nerve cell with branches
  [[-1.2, 0], [-0.4, 0], [0.4, 0], [1.2, 0], [2.0, 0]].forEach(([a]) => { line(c, [[540, 640], [540 + Math.cos(a + 0.35) * 150, 640 + Math.sin(a + 0.35) * 150]], 16, INK); line(c, [[540, 640], [540 + Math.cos(a + 0.35) * 150, 640 + Math.sin(a + 0.35) * 150]], 8, "#f6d56b"); });
  line(c, [[540, 700], [540, 960]], 22, INK); line(c, [[540, 700], [540, 960]], 12, "#f6d56b");
  shape(c, () => ell(c, 540, 640, 85, 85), "#ffd34d", 8); nucleus(c, 540, 640, 45);
  // muscle fibre
  shape(c, () => rrect(c, 780, 520, 210, 420, 70), "#e9806a", 8); for (let k = 0; k < 6; k++) line(c, [[800, 580 + k * 55], [970, 580 + k * 55]], 5, "#c4513b");
  nucleus(c, 885, 640, 50);
};
const explHalf = (c: Ctx) => {
  ground(c);
  strand(c, 70, 190, 440, 190, "ATCGGCAT", 24, 46);
  strand(c, 640, 190, 1010, 190, "GCATTCGA", 24, 46);
  const ORG = "#f39a3c", BLU = "#5b8fd6";
  c.save(); void ORG; void BLU; c.restore();
  arrow(c, [[250, 290], [400, 410]], RED, 12); arrow(c, [[830, 290], [680, 410]], RED, 12);
  helix(c, 300, 500, 780, 500, "ATCGGCATTA", { amp: 55, turns: 2.2, bw: 16, b1: RNAB, b2: COL.blue });
  shadow(c, 540, 1030, 100, 14);
  import_person(c, 540, 1040, 400, false);
};
const explBalance = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 960, 280, 24);
  shape(c, () => polyP(c, [[470, 960], [610, 960], [560, 360], [520, 360]]), COL.woodDk, 6);
  shape(c, () => rrect(c, 330, 940, 420, 50, 14), COL.wood, 6);
  shape(c, () => rrect(c, 100, 330, 880, 40, 20), COL.wood, 6);
  shape(c, () => ell(c, 540, 350, 36, 36), COL.steel, 6);
  const pan = (x: number) => { line(c, [[x, 350], [x - 120, 580]], 6); line(c, [[x, 350], [x + 120, 580]], 6); shape(c, () => ell(c, x, 590, 160, 36), COL.steel, 6); shade(c, () => ell(c, x, 590, 160, 36), COL.steelDk, 10, 10, 0.5); };
  pan(190); pan(890);
  helix(c, 100, 500, 280, 500, "ATCGGC", { amp: 38, turns: 1.4, bw: 12 });
  sun(c, 800, 480, 42); drop(c, 940, 500, 28);
};
const toggle = (c: Ctx, x: number, y: number, on: boolean) => {
  shape(c, () => rrect(c, x - 55, y - 28, 110, 56, 28), on ? COL.green : COL.grey, 6);
  shape(c, () => ell(c, on ? x + 27 : x - 27, y, 22, 22), WHITE, 5);
};
const explSwitch = (c: Ctx) => {
  ground(c);
  cellBody(c, 540, 700, 480, 340, CELL, CELLDK, 3);
  nucleus(c, 540, 700, 240);
  [[430, 620, true], [650, 620, false], [430, 720, false], [650, 720, true], [430, 820, true], [650, 820, false]].forEach(([x, y, on]) => toggle(c, x as number, y as number, on as boolean));
  sun(c, 170, 170, 62); arrow(c, [[220, 260], [300, 430]], RED, 12);
  drop(c, 540, 170, 50); arrow(c, [[540, 260], [540, 380]], RED, 12);
  // warm: a thermometer
  shape(c, () => rrect(c, 880, 80, 46, 170, 23), WHITE, 6); shape(c, () => ell(c, 903, 270, 40, 40), RED, 6); shape(c, () => rrect(c, 892, 150, 22, 120, 10), RED, 0);
  arrow(c, [[860, 280], [790, 430]], RED, 12);
};

import { person } from "./flatKit";
function import_person(c: Ctx, x: number, y: number, h: number, adult: boolean) { person(c, x, y, h, { adult }); }

export const ic_geneticsDnaAndRnaL3 = cards("sci.genetics.dna-and-rna.L3 cards", [
  summary, flowE1, flowE2, flowA1, flowA2, flowA3, flowA4, flowA5, flowP1, flowC1,
  termGene, termRna, termProtein, termCell, termNucleus, termInherit, termChromosome, termSeedLeaf,
  explLiving, explProteins, explRnaCopy, explPages, explHalf, explBalance, explSwitch,
]);
