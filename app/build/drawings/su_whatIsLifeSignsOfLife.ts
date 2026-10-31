import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, rnd, cards } from "./flatKit";

// sci.what-is-life.signs-of-life.L3 · set-up cards. Same bottles (A B C), bowls (A B C D), child, grown-up, rug on every card of an experiment.

const thick = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };
// a smooth thick curve through points (ink outline, then the colour)
const curve = (c: Ctx, pts: number[][], w: number, col: string) => {
  const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
  c.lineCap = "round"; c.lineJoin = "round"; path(); c.strokeStyle = INK; c.lineWidth = w + 9; c.stroke(); path(); c.strokeStyle = col; c.lineWidth = w; c.stroke();
};
const COUNTER = "#e6cf9f", YEAST = "#d9b878", YEASTDK = "#b8955a", PINKDK = "#d6718f";
const counter = (c: Ctx) => { ground(c); c.fillStyle = COUNTER; c.fillRect(0, 860, 1080, 220); line(c, [[0, 860], [1080, 860]], 5); };

// capital letters A B C D as strokes
const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.12, 0.62], [0.48, 0.62]]],
  B: [[[0, 1], [0, 0], [0.4, 0.02], [0.5, 0.25], [0.38, 0.47], [0, 0.5]], [[0.38, 0.47], [0.55, 0.72], [0.45, 0.96], [0, 1]]],
  C: [[[0.55, 0.15], [0.3, 0], [0.05, 0.2], [0, 0.5], [0.05, 0.8], [0.3, 1], [0.55, 0.85]]],
  D: [[[0, 0], [0, 1], [0.3, 0.98], [0.55, 0.7], [0.55, 0.3], [0.3, 0.02], [0, 0]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col: string = INK, w = 6) => {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round";
  LET[ch].forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(x - h * 0.3 + u * h, y - h / 2 + v * h) : c.moveTo(x - h * 0.3 + u * h, y - h / 2 + v * h))); c.stroke(); });
};
const tag = (c: Ctx, ch: string, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 8), WHITE, 4);
  letter(c, ch, x, y, h * 0.62, INK, 6);
};

// a hand whose grip is at (gx, gy), fingers pointing along world angle fa, with the arm running off the card behind it
const handAt = (c: Ctx, gx: number, gy: number, fa: number, s = 1.7, adult = false) => {
  const skin = adult ? SKIN.adult : SKIN.child, sleeve = adult ? CLOTH.adult : CLOTH.child;
  const fx = Math.cos(fa), fy = Math.sin(fa), wx = gx - fx * 70 * s, wy = gy - fy * 70 * s, flip = fx < 0, an = flip ? Math.PI - fa : fa;
  thick(c, [[wx - fx * 50 * s, wy - fy * 50 * s], [wx - fx * 1400, wy - fy * 1400]], 66 * s, sleeve);
  if (flip) { c.save(); c.translate(wx, wy); c.scale(-1, 1); hand(c, 0, 0, an, s, skin, sleeve); c.restore(); } else hand(c, wx, wy, an, s, skin, sleeve);
};

// ---------------------------------------------------------------- things
type BO = { fill?: number; liquid?: string; label?: string; shadow?: boolean; tint?: string; yeast?: boolean; bubbles?: number };
// a plastic bottle standing on (x, y), clear plastic, an open neck; fill 0..1 of liquid
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, o: BO = {}) => {
  const nw = w * 0.17, ty = y - h * 0.74, ny = y - h, hw = w / 2;
  const body = () => {
    c.moveTo(x - hw, y - 14); c.lineTo(x - hw, ty + 24); c.quadraticCurveTo(x - hw, ty, x - nw, ty - h * 0.1); c.lineTo(x - nw, ny); c.lineTo(x + nw, ny); c.lineTo(x + nw, ty - h * 0.1);
    c.quadraticCurveTo(x + hw, ty, x + hw, ty + 24); c.lineTo(x + hw, y - 14); c.quadraticCurveTo(x + hw, y, x + hw - 14, y); c.lineTo(x - hw + 14, y); c.quadraticCurveTo(x - hw, y, x - hw, y - 14); c.closePath();
  };
  if (o.shadow !== false) shadow(c, x + w * 0.1, y + 8, w * 0.6, w * 0.12);
  shape(c, body, o.tint ?? COL.glass, 0);
  c.save(); c.beginPath(); body(); c.clip();
  if (o.fill) { const ly = y - h * o.fill; c.fillStyle = o.liquid ?? COL.water; c.fillRect(x - w, ly, 2 * w, y - ly + 4); c.fillStyle = COL.drop; c.fillRect(x - w, ly, 2 * w, 7); }
  if (o.yeast) { c.fillStyle = YEAST; c.fillRect(x - w, y - 26, 2 * w, 30); const r = rnd(5); for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(x - hw + 20 + r() * (w - 40), y - 20 + r() * 12, 4, 0, 7); c.fillStyle = YEASTDK; c.fill(); } }
  if (o.bubbles && o.fill) { const r = rnd(9 + o.bubbles); for (let i = 0; i < o.bubbles; i++) { const bx = x - hw + 24 + r() * (w - 48), by = y - h * o.fill + 22 + r() * (h * o.fill - 50), br = 6 + r() * 8; shape(c, () => ell(c, bx, by, br, br), "rgba(255,255,255,0.55)", 3); } }
  c.restore();
  shade(c, body, COL.glassEdge, w * 0.1, 0, 0.18);
  shape(c, body, "rgba(0,0,0,0)", 6);
  shape(c, () => rrect(c, x - nw - 7, ny - 7, 2 * nw + 14, 14, 6), WHITE, 5);
  shine(c, [[x - hw * 0.72, ty + 40], [x - hw * 0.72, y - h * 0.2]], 8);
  if (o.label) { const lw = w * 0.56; tag(c, o.label, x, y - h * 0.4, lw, h * 0.2); }
};
// a steel tumbler: base centre (x, y), tipped so its mouth points along (dx, dy)
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, dx: number, dy: number) => {
  c.save(); c.translate(x, y); c.rotate(Math.atan2(dx, -dy));
  const body = () => { c.moveTo(-w * 0.5, -h); c.lineTo(w * 0.5, -h); c.lineTo(w * 0.38, 0); c.lineTo(-w * 0.38, 0); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.3, 0);
  line(c, [[-w * 0.3, -h * 0.85], [-w * 0.24, -h * 0.15]], 8, WHITE);
  shape(c, () => ell(c, 0, -h, w * 0.5, w * 0.1), COL.steelIn, 5);
  c.restore();
};
const stream = (c: Ctx, x: number, y0: number, y1: number) => { line(c, [[x, y0], [x, y1]], 24, INK); line(c, [[x, y0], [x, y1]], 14, COL.water); };
const steam = (c: Ctx, x: number, y: number, s = 1) => { for (const dx of [-34, 0, 34]) line(c, [[x + dx * s, y], [x + (dx - 16) * s, y - 40 * s], [x + (dx + 16) * s, y - 85 * s], [x + dx * s, y - 130 * s]], 12, "#9a948a"); };
const snow = (c: Ctx, x: number, y: number, r: number) => { for (let k = 0; k < 3; k++) { const a = (k / 3) * Math.PI; line(c, [[x - Math.cos(a) * r, y - Math.sin(a) * r], [x + Math.cos(a) * r, y + Math.sin(a) * r]], 8, COL.blueDk); } };
// an ice cube
const ice = (c: Ctx, x: number, y: number, s: number, rot: number) => { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -s / 2, -s / 2, s, s, s * 0.18), "#e3f3ff", 5); shade(c, () => rrect(c, -s / 2, -s / 2, s, s, s * 0.18), COL.waterDk, s * 0.25, s * 0.25, 0.4); line(c, [[-s * 0.3, -s * 0.15], [-s * 0.3, s * 0.2]], 5, WHITE); c.restore(); };

const BX = [190, 540, 890], BW = 190, BH = 420, BY = 880, NY = BY - BH;

// ---------------------------------------------------------------- experiment 1: yeast in bottles
// setup.e1.0
const e1s0 = (c: Ctx) => {
  counter(c);
  bottle(c, BX[1], BY, BW, BH, { label: "B", yeast: true });
  bottle(c, BX[2], BY, BW, BH, { label: "C", yeast: true });
  bottle(c, BX[0], BY, BW, BH, { label: "A" });
  const x = BX[0];
  // paper funnel in A's neck
  const fun = () => polyP(c, [[x - 78, NY - 120], [x + 78, NY - 120], [x + 14, NY - 14], [x - 14, NY - 14]]);
  shape(c, fun, COL.paper); shade(c, fun, COL.cloth, 40, 0, 1);
  shape(c, () => rrect(c, x - 13, NY - 20, 26, 40, 5), COL.paper, 5);
  shape(c, () => ell(c, x, NY - 120, 78, 14), COL.steelIn, 5);
  // the spoon, held by a child's hand, tipping yeast into the funnel
  thick(c, [[x + 40, NY - 148], [x + 330, NY - 330]], 16, COL.steel);
  c.save(); c.translate(x + 8, NY - 150); c.rotate(0.5);
  shape(c, () => ell(c, 0, 0, 52, 32), COL.steel); shape(c, () => ell(c, 0, -4, 38, 20), YEAST, 4);
  c.restore();
  for (const [dx, dy] of [[0, 20], [8, 50], [-6, 80]]) shape(c, () => ell(c, x + dx, NY - 100 + dy, 6, 6), YEAST, 2.5);
  handAt(c, x + 250, NY - 273, Math.PI - 0.5);
  arrow(c, [[x + 140, NY - 200], [x + 140, NY - 20]]);
};
// setup.e1.1
const e1s1 = (c: Ctx) => {
  counter(c);
  // grown-up pours warm water into A (stream first, so the bottle's plastic sits over it)
  const lipA = [BX[0] + 4, NY - 100], dA = [0.45, 0.89], lipC = [BX[2] - 4, NY - 100], dC = [-0.45, 0.89];
  stream(c, lipA[0], lipA[1], BY - BH * 0.3); stream(c, lipC[0], lipC[1], BY - BH * 0.3);
  bottle(c, BX[0], BY, BW, BH, { label: "A", fill: 0.3 });
  bottle(c, BX[1], BY, BW, BH, { label: "B", fill: 0.4 });
  bottle(c, BX[2], BY, BW, BH, { label: "C", fill: 0.3 });
  steam(c, BX[1], NY - 24, 1.3); steam(c, BX[0] + 140, NY + 10, 1.3);
  tumbler(c, lipA[0] - dA[0] * 200, lipA[1] - dA[1] * 200, 150, 200, dA[0], dA[1]);
  handAt(c, lipA[0] - dA[0] * 90, lipA[1] - dA[1] * 90, Math.atan2(-0.45, 0.89), 1.7, true);
  // child pours fridge-cold water into C
  const cb = [lipC[0] - dC[0] * 250, lipC[1] - dC[1] * 250];
  c.save(); c.translate(cb[0], cb[1]); c.rotate(Math.atan2(dC[0], -dC[1]));
  bottle(c, 0, 0, 120, 250, { tint: "#a9d2f0", shadow: false });
  const fr = rnd(3); for (let i = 0; i < 7; i++) shape(c, () => ell(c, -40 + fr() * 80, -40 - fr() * 110, 5, 7), WHITE, 0);
  c.restore();
  ice(c, BX[2] - 48, BY - BH * 0.3 + 28, 56, 0.2); ice(c, BX[2] + 42, BY - BH * 0.3 + 40, 50, -0.3);
  snow(c, 740, 150, 36); snow(c, 790, 350, 30); snow(c, 1000, 560, 34); snow(c, 760, 560, 28);
  handAt(c, cb[0] + dC[0] * 110, cb[1] + dC[1] * 110, Math.atan2(-0.45, -0.89), 1.7);
};
// setup.e1.2
const balloon = (c: Ctx, x: number, kind: "fat" | "floppy" | "flat") => {
  const nw = BW * 0.17, by = NY - 6;
  const band = () => rrect(c, x - nw - 6, by - 26, 2 * nw + 12, 34, 8);
  if (kind === "fat") {
    const b = () => ell(c, x, by - 190, 126, 160);
    shape(c, band, COL.pink); shape(c, b, COL.pink); shade(c, b, PINKDK, 40, 20, 0.7); shape(c, b, "rgba(0,0,0,0)", 6);
    shine(c, [[x - 80, by - 260], [x - 100, by - 190]], 10);
  } else if (kind === "floppy") {
    const p = [[x, by - 20], [x, by - 120], [x + 50, by - 215], [x + 150, by - 215]];
    shape(c, band, COL.pink); thick(c, p, 100, COL.pink);
    line(c, [[x - 20, by - 110], [x + 30, by - 195]], 8, "rgba(255,255,255,0.6)");
  } else {
    shape(c, band, COL.pink); thick(c, [[x, by - 20], [x + 6, by - 60], [x + 50, by - 62], [x + 62, by + 14]], 44, COL.pink);
  }
};
const e1s2 = (c: Ctx) => {
  counter(c);
  const L = [{ k: "A", n: 14 }, { k: "B", n: 5 }, { k: "C", n: 0 }];
  L.forEach((b, i) => bottle(c, BX[i], BY, BW, BH, { label: b.k, fill: 0.4, liquid: "#e8d39b", bubbles: b.n }));
  balloon(c, BX[0], "fat"); balloon(c, BX[1], "floppy"); balloon(c, BX[2], "flat");
};

// ---------------------------------------------------------------- experiment 2: seeds in cups
// a steel katori on cotton wool with seeds (or beads) on top; kind says what lies on the cotton
type Kind = "soaked" | "dry" | "boiled" | "beads";
const cup = (c: Ctx, x: number, y: number, r: number, kind: Kind, label: string, wet: boolean) => {
  shadow(c, x + r * 0.1, y + r * 0.62, r * 0.75, r * 0.12);
  const bd = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.9, y + r * 0.75, x + r * 0.9, y + r * 0.75, x + r, y); c.closePath(); };
  shape(c, bd, COL.steel); shade(c, bd, COL.steelDk, r * 0.35, -r * 0.05);
  shape(c, () => ell(c, x, y, r, r * 0.2), COL.steelIn, 5);
  const cot = wet ? "#a9cdee" : COL.cloth, cotDk = wet ? "#7aaedd" : "#e4dccb";
  const mound = () => { c.moveTo(x - r * 0.9, y + 2); c.bezierCurveTo(x - r * 0.8, y - r * 0.55, x + r * 0.8, y - r * 0.55, x + r * 0.9, y + 2); c.ellipse(x, y + 2, r * 0.9, r * 0.17, 0, 0, Math.PI); c.closePath(); };
  shape(c, mound, cot, 5); shade(c, mound, cotDk, r * 0.25, r * 0.05, 0.8); shape(c, mound, "rgba(0,0,0,0)", 5);
  const rd = rnd(kind.length * 7 + label.charCodeAt(0));
  const sz = { soaked: 0.17, dry: 0.095, boiled: 0.16, beads: 0.1 }[kind];
  const n = kind === "dry" ? 9 : kind === "beads" ? 8 : 6;
  const pts: number[][] = [];
  for (let i = 0; i < n; i++) { const t = (i + 0.5) / n * 1.5 - 0.75 + (rd() - 0.5) * 0.08, top = y - r * 0.4 * (1 - t * t * 1.5), yy = top + r * 0.1 + (i % 2) * r * 0.16; pts.push([x + t * r, yy]); }
  pts.sort((a, b) => a[1] - b[1]);
  pts.forEach(([sx, sy], i) => {
    const rr = r * sz;
    if (kind === "beads") { const col = [COL.pink, COL.blue, COL.yellow, COL.orange][i % 4]; shape(c, () => ell(c, sx, sy, rr, rr), col, 4); line(c, [[sx - rr * 0.5, sy - rr * 0.3], [sx - rr * 0.2, sy - rr * 0.6]], 3, WHITE); }
    else if (kind === "boiled") { shape(c, () => ell(c, sx, sy, rr, rr * 0.72, i), "#d9d79a", 4); line(c, [[sx - rr * 0.5, sy], [sx + rr * 0.3, sy + rr * 0.35]], 3, "#8d8a52"); }
    else seed(c, sx, sy, rr, i * 0.7, kind === "soaked");
  });
  if (wet) { const wr = rnd(2); for (let i = 0; i < 9; i++) shape(c, () => ell(c, x - r * 0.7 + wr() * r * 1.4, y - r * 0.05 - wr() * r * 0.3, r * 0.05, r * 0.07), COL.drop, 2.5); shine(c, [[x - r * 0.6, y - r * 0.25], [x - r * 0.3, y - r * 0.38]], 7); }
  tag(c, label, x, y + r * 0.34, r * 0.5, r * 0.3);
};
const seed = (c: Ctx, x: number, y: number, r: number, rot: number, soaked: boolean) => {
  const col = soaked ? COL.greenLt : COL.green, dk = soaked ? COL.green : COL.greenDk;
  shape(c, () => ell(c, x, y, r, r * 0.7, rot), col, Math.max(2.5, r * 0.2));
  shade(c, () => ell(c, x, y, r, r * 0.7, rot), dk, r * 0.35, r * 0.3, 0.55);
  line(c, [[x - Math.cos(rot) * r * 0.45, y - Math.sin(rot) * r * 0.45 - r * 0.12], [x + Math.cos(rot) * r * 0.45, y + Math.sin(rot) * r * 0.45 - r * 0.12]], Math.max(2, r * 0.16), "#f4f1e4");
};
const CUPS: [number, number, Kind, string][] = [[285, 400, "soaked", "A"], [795, 400, "dry", "B"], [285, 800, "boiled", "C"], [795, 800, "beads", "D"]];
// setup.e2.0
const e2s0 = (c: Ctx) => {
  ground(c);
  CUPS.forEach(([x, y, k, l]) => cup(c, x, y, 205, k, l, false));
};
// setup.e2.1
const e2s1 = (c: Ctx) => {
  ground(c);
  CUPS.forEach(([x, y, k, l]) => cup(c, x, y, 205, k, l, l !== "B"));
  // a spoon of water dripping on A
  thick(c, [[250, 150], [600, 108]], 18, COL.steel);
  c.save(); c.translate(235, 158); c.rotate(-0.4); shape(c, () => ell(c, 0, 0, 62, 34), COL.steel); shape(c, () => ell(c, 0, -3, 46, 20), COL.water, 4); c.restore();
  for (const dy of [205, 245, 285]) shape(c, () => { c.moveTo(215, dy); c.quadraticCurveTo(199, dy + 20, 215, dy + 30); c.quadraticCurveTo(231, dy + 20, 215, dy); c.closePath(); }, COL.water, 4);
  handAt(c, 560, 112, Math.PI - 0.1, 1.5);
  arrow(c, [[380, 190], [380, 285]]);
};
// setup.e2.2
const e2s2 = (c: Ctx) => {
  ground(c);
  // the other cups, small, unchanged
  [[900, 150, "dry", "B"], [900, 330, "boiled", "C"], [900, 510, "beads", "D"]].forEach(([x, y, k, l]) => cup(c, x as number, y as number, 85, k as Kind, l as string, false));
  // cup A big, full of sprouts
  const x = 370, y = 470, r = 310;
  shadow(c, x + r * 0.1, y + r * 0.62, r * 0.75, r * 0.12);
  const bd = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.9, y + r * 0.75, x + r * 0.9, y + r * 0.75, x + r, y); c.closePath(); };
  shape(c, bd, COL.steel); shade(c, bd, COL.steelDk, r * 0.35, -r * 0.05);
  shape(c, () => ell(c, x, y, r, r * 0.2), COL.steelIn, 5);
  const mound = () => { c.moveTo(x - r * 0.9, y + 2); c.bezierCurveTo(x - r * 0.8, y - r * 0.55, x + r * 0.8, y - r * 0.55, x + r * 0.9, y + 2); c.ellipse(x, y + 2, r * 0.9, r * 0.17, 0, 0, Math.PI); c.closePath(); };
  shape(c, mound, "#cfe3f5", 5); shade(c, mound, "#9cc2e6", r * 0.25, r * 0.05, 0.8); shape(c, mound, "rgba(0,0,0,0)", 5);
  // moong sprouts: a seed with a long white root that curls down
  const SP: [number, number, number][] = [[170, 395, -1], [260, 350, -1], [370, 335, 1], [480, 350, 1], [570, 395, 1], [230, 450, -1], [370, 430, 1], [520, 455, 1]];
  SP.forEach(([sx, sy, d]) => curve(c, [[sx, sy], [sx + d * 20, sy + 50], [sx + d * 80, sy + 70], [sx + d * 120, sy + 40], [sx + d * 100, sy + 12]], 16, COL.paper));
  SP.forEach(([sx, sy], i) => seed(c, sx, sy, 36, 0.4 + i, true));
  tag(c, "A", x, y + r * 0.36, r * 0.4, r * 0.24);
  // one sprout measured on a ruler: its root is 5 cm
  const rx = 140, pc = 100;
  shadow(c, 560, 920, 440, 20);
  shape(c, () => polyP(c, [[rx - 50, 800], [rx + 8 * pc + 50, 800], [rx + 8 * pc + 50, 900], [rx - 50, 900]]), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(rx - 47, 880, 8 * pc + 94, 17);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let mm = 0; mm <= 80; mm++) { const xx = rx + mm * 10, h = mm % 10 === 0 ? 38 : mm % 5 === 0 ? 26 : 14; c.lineWidth = mm % 10 === 0 ? 4 : 2.5; c.beginPath(); c.moveTo(xx, 800); c.lineTo(xx, 800 + h); c.stroke(); }
  for (let cm = 0; cm <= 8; cm++) write(c, String(cm), rx + cm * pc - 10, 845, 34, INK, 5);
  thick(c, [[rx, 768], [rx + 150, 772], [rx + 330, 774], [rx + 500, 776]], 18, COL.paper);
  seed(c, rx - 6, 760, 40, 0.2, true);
  line(c, [[rx + 500, 730], [rx + 500, 806]], 7, RED);
  write(c, "5 cm", rx + 560, 700, 50, INK, 7);
};

// ---------------------------------------------------------------- experiment 3: breathing
const FY = 880;
const room = (c: Ctx) => {
  ground(c);
  c.fillStyle = COUNTER; c.fillRect(0, 800, 1080, 280);
  line(c, [[0, 800], [1080, 800]], 5);
  shape(c, () => polyP(c, [[110, 850], [970, 850], [1040, 1050], [40, 1050]]), COL.orange, 6);
  shape(c, () => polyP(c, [[160, 880], [920, 880], [975, 1020], [105, 1020]]), COL.blue, 4);
  line(c, [[190, 930], [890, 930]], 5, COL.yellow);
};
const stopwatch = (c: Ctx, x: number, y: number, r: number, frac: number) => {
  shape(c, () => rrect(c, x - r * 0.16, y - r * 1.3, r * 0.32, r * 0.34, 4), COL.steelDk, 5);
  shape(c, () => ell(c, x, y, r, r), COL.steel, 6);
  shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), WHITE, 4);
  c.beginPath(); c.moveTo(x, y); c.arc(x, y, r * 0.78, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); c.closePath(); c.fillStyle = RED; c.fill();
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.64, y + Math.sin(a) * r * 0.64], [x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78]], 4); }
  shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), "rgba(0,0,0,0)", 4);
  line(c, [[x, y], [x, y - r * 0.7]], 6);
  shape(c, () => ell(c, x, y, r * 0.09, r * 0.09), INK, 0);
};
const phone = (c: Ctx, x: number, y: number, w: number, h: number, frac: number) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, w * 0.14), "#3a3540", 6);
  shape(c, () => rrect(c, x - w * 0.42, y - h * 0.44, w * 0.84, h * 0.88, w * 0.08), "#fffaf0", 3);
  stopwatch(c, x, y + h * 0.04, w * 0.3, frac);
};
const wristOf = (x: number, y: number, h: number, side: number, [a1, a2]: [number, number]): [number, number] => {
  const sh = y - h * 0.74, sx = x + side * h * 0.11, sy = sh + h * 0.03, ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};
// the grown-up standing, holding the phone timer out towards the child
const adultTimer = (c: Ctx, x: number, h: number, frac: number) => {
  shadow(c, x + 20, FY + 6, h * 0.22, 16);
  const arm: [number, number] = [2.2, 3.6];
  person(c, x, FY, h, { adult: true, armL: arm });
  const [wx, wy] = wristOf(x, FY, h, -1, arm);
  phone(c, wx - 12, wy - 100, 150, 250, frac);
  shape(c, () => ell(c, wx + 2, wy - 4, 26, 24), SKIN.adult, 5);
  line(c, [[wx - 14, wy - 22], [wx + 10, wy - 12]], 4, SKIN.adultDk);
};
const KX = 280, KH = 700, SEAT = FY - 210;
// the child on a small chair, one hand on the tummy
const sitKid = (c: Ctx) => {
  shadow(c, KX + 60, FY + 6, 200, 18);
  const h = KH;
  thick(c, [[KX - h * 0.18, SEAT + 8], [KX - h * 0.19, FY]], 18, COL.brown);
  thick(c, [[KX + h * 0.17, SEAT + 8], [KX + h * 0.18, FY]], 18, COL.brown);
  shape(c, () => rrect(c, KX - h * 0.24, SEAT - h * 0.5, h * 0.045, h * 0.52, 8), COL.wood, 5);
  shape(c, () => rrect(c, KX - h * 0.24, SEAT, h * 0.46, h * 0.045, 8), COL.wood, 5);
  person(c, KX, SEAT, h, { sit: true, armR: [1.45, 3.2] });
  for (const s of [-1, 1]) {
    const sx = KX + h * 0.3 + s * h * 0.03;
    thick(c, [[sx, SEAT], [sx, FY - 14]], h * 0.065, "#6b5a8c");
    shape(c, () => ell(c, sx + 14, FY - 8, 36, 16), COL.brown, 5);
  }
};
// setup.e3.0
const e3s0 = (c: Ctx) => {
  room(c);
  adultTimer(c, 820, 720, 0.75);
  sitKid(c);
  // the child's flat hand on the tummy, and a breath going in and out at the nose
  c.save(); c.translate(338, 542); c.scale(-1, 1); hand(c, 0, 0, 0, 0.8, SKIN.child, CLOTH.child, true); c.restore();
  arrow(c, [[455, 300], [385, 300]]); arrow(c, [[385, 350], [455, 350]]);
};
// setup.e3.1
const e3s1 = (c: Ctx) => {
  room(c);
  adultTimer(c, 910, 720, 0.5);
  const x = 330, h = 640, up = 120, y = FY - up;
  shadow(c, x + 14, FY + 10, 150, 18);
  person(c, x, y, h, { armL: [-2.2, -1.9], armR: [-0.95, -1.25] });
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * h * 0.06 + 12, y + 6, 34, 15), COL.brown, 5);
  const head = h * 0.13, hy = y - h * 0.74 - head * 1.05;
  for (const s of [-1, 1]) { c.globalAlpha = 0.55; shape(c, () => ell(c, x + s * head * 0.62, hy + head * 0.5, head * 0.24, head * 0.18), RED, 0); c.globalAlpha = 1; }
  for (const [dx, dy, r] of [[1.5, 0.5, 20], [1.95, 0.15, 14], [1.65, 0.95, 12]]) shape(c, () => ell(c, x + head * dx, hy + head * dy, r, r), WHITE, 4);
  arrow(c, [[130, 700], [130, 500]]);
};
// setup.e3.2
const e3s2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COUNTER; c.fillRect(0, 0, 1080, 1080);
  // the table on paper: three columns, what the child was doing on top, a dot for every breath counted, then the number
  shadow(c, 430, 930, 390, 30);
  shape(c, () => rrect(c, 40, 150, 780, 760, 14), WHITE);
  const cx = [170, 430, 690], counts = [5, 9, 6];
  for (const x of [300, 560]) line(c, [[x, 150], [x, 910]], 6);
  line(c, [[40, 530], [820, 530]], 6);
  const stool = (x: number) => { thick(c, [[x - 50, 496], [x - 54, 524]], 10, COL.brown); thick(c, [[x + 50, 496], [x + 54, 524]], 10, COL.brown); shape(c, () => rrect(c, x - 70, 478, 140, 18, 6), COL.wood, 5); };
  stool(cx[0] + 40); stool(cx[2] + 40);
  person(c, cx[0], 480, 300, { sit: true }); person(c, cx[2], 480, 300, { sit: true });
  shadow(c, cx[1], 522, 70, 9);
  person(c, cx[1], 470, 300, { armL: [-2.2, -1.9], armR: [-0.95, -1.25] });
  counts.forEach((n, i) => {
    const cols = n > 6 ? 3 : n > 3 ? 3 : n, rows = Math.ceil(n / cols), gx = cx[i] - ((cols - 1) * 62) / 2;
    for (let k = 0; k < n; k++) { const px = gx + (k % cols) * 62, py = 590 + Math.floor(k / cols) * 60 + (rows === 2 ? 20 : 0); shape(c, () => ell(c, px, py, 24, 24), COL.sky, 5); shine(c, [[px - 10, py - 6], [px - 6, py - 12]], 5); }
  });
  write(c, "5", cx[0] - 25, 760, 120, INK, 11); write(c, "9", cx[1] - 25, 760, 120, INK, 11);
  write(c, "6", cx[2] - 25, 760, 120, INK, 11);
  // a pencil writing the last number
  const tip = [cx[2] + 80, 800], dir = [0.5, -0.87];
  thick(c, [[tip[0] + dir[0] * 40, tip[1] + dir[1] * 40], [tip[0] + dir[0] * 440, tip[1] + dir[1] * 440]], 28, COL.yellow);
  shape(c, () => polyP(c, [[tip[0] + dir[0] * 46 + 14 * dir[1], tip[1] + dir[1] * 46 - 14 * dir[0]], [tip[0], tip[1]], [tip[0] + dir[0] * 46 - 14 * dir[1], tip[1] + dir[1] * 46 + 14 * dir[0]]]), "#e8c9a0", 4);
  shape(c, () => ell(c, tip[0] + dir[0] * 450, tip[1] + dir[1] * 450, 16, 16), COL.pink, 5);
  handAt(c, tip[0] + dir[0] * 190, tip[1] + dir[1] * 190, Math.PI + 0.55, 1.5);
};

export const su_whatIsLifeSignsOfLife = cards("sci.what-is-life.signs-of-life.L3 set-up", [e1s0, e1s1, e1s2, e2s0, e2s1, e2s2, e3s0, e3s1, e3s2]);
