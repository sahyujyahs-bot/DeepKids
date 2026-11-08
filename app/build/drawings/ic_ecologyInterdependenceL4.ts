import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, glass, bowl, plate, seed, leaf, hand, person, write, cards } from "./flatKit";

// A FOREST FLOOR HOLDS THE RAIN (sci.ecology.interdependence.L4) · set-up cards and card pictures in the flat kit.
// Side-view rigs (a plate tilted on books with a glass under the low edge) are drawn by rig(); people by person()
// with hand targets, and what they hold is drawn at the hand point person() returns.

const TAU = Math.PI * 2;
const MUD = "#a0714b", MUDDK = "#7d5234", CLEAR = "#d4e9f6", PALE = "#d9b98f", DAMP = "#5e3d27", HUSK = "#b07a46", SKY = "#bfe0f5";

// ---------------------------------------------------------------- labels
// capital letters A, B, C (the kit writes only numbers and units)
const CAP: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.13, 0.64], [0.47, 0.64]]],
  B: [[[0.02, 0], [0.02, 1]], [[0.02, 0], [0.38, 0], [0.55, 0.13], [0.55, 0.37], [0.38, 0.5], [0.02, 0.5]], [[0.38, 0.5], [0.58, 0.63], [0.58, 0.87], [0.38, 1], [0.02, 1]]],
  C: [[[0.58, 0.16], [0.36, 0], [0.1, 0.18], [0, 0.5], [0.1, 0.82], [0.36, 1], [0.58, 0.84]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col = INK, w = 7) => CAP[ch].forEach((st) => line(c, st.map(([u, v]) => [x + u * h, y + v * h]), w, col));
// a paper label with one letter, centred at (x, y)
const tag = (c: Ctx, x: number, y: number, ch: string) => { shape(c, () => rrect(c, x - 44, y - 34, 88, 68, 10), WHITE, 5); letter(c, ch, x - 15, y - 25, 50); };

// ---------------------------------------------------------------- dry leaves, soil, cups
// one dry leaf piece, centred at (x, y), turned by rot; k scales it
const leafBit = (c: Ctx, x: number, y: number, rot: number, k: number, col: string) => { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -17 * k, -9 * k, 34 * k, 18 * k, 7 * k), col, 3.5); line(c, [[-11 * k, 0], [11 * k, 0]], 2.5, MUDDK); c.restore(); };
// n leaf pieces scattered inside an ellipse
const leafBits = (c: Ctx, x: number, y: number, rx: number, ry: number, n: number, sd: number, k = 1) => {
  const r = rnd(sd), cols = [COL.brown, COL.woodDk, "#c48a4a", COL.orange];
  for (let i = 0; i < n; i++) { const a = r() * TAU, d = Math.sqrt(r()); leafBit(c, x + Math.cos(a) * d * rx, y + Math.sin(a) * d * ry, r() * TAU, k, cols[Math.floor(r() * 4)]); }
};
// a plate seen from above with a layer of soil and/or dry leaves on it
const soilPlate = (c: Ctx, x: number, y: number, rx: number, ry: number, soil: boolean, leaves: boolean, sd: number) => {
  plate(c, x, y, rx, ry);
  if (soil) { const p = () => ell(c, x, y - ry * 0.06, rx * 0.72, ry * 0.66); shape(c, p, COL.soil, 5); shade(c, p, COL.soilDk, rx * 0.12, ry * 0.12); }
  if (leaves) leafBits(c, x, y - ry * 0.06, rx * 0.64, ry * 0.56, 26, sd, 0.75);
};
// a clear cup with soil in it (fill 0..1); leaves = 0 none, 1 a thin layer, 2 a thick layer on top; crust = a pale dry top
const cupSoil = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, leaves: 0 | 1 | 2, crust = 0) => {
  glass(c, x, y, w, h, fill, COL.soil);
  const ly = y - h * fill, lw = w * 0.4 + (w / 2 - w * 0.4) * fill;
  if (crust) {
    const cy = ly + h * crust, cw = w * 0.4 + (w / 2 - w * 0.4) * (fill - crust);
    shape(c, () => { c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + cw, cy); c.lineTo(x - cw, cy); c.closePath(); }, PALE, 0);
  }
  shape(c, () => ell(c, x, ly, lw, w * 0.07), crust ? PALE : COL.soilDk, 3);
  if (crust) { line(c, [[x - lw * 0.6, ly + 2], [x - lw * 0.2, ly - 3], [x + lw * 0.1, ly + 4]], 3, MUDDK); line(c, [[x + lw * 0.2, ly - 4], [x + lw * 0.55, ly + 2]], 3, MUDDK); }
  if (leaves) {
    const mh = leaves === 1 ? w * 0.1 : w * 0.3;
    shape(c, () => { c.moveTo(x - lw, ly); c.quadraticCurveTo(x, ly - mh * 2, x + lw, ly); c.closePath(); }, COL.brown, 4);
    leafBits(c, x, ly - mh * 0.5, lw * 0.8, mh * 0.45, leaves === 1 ? 7 : 16, 40 + Math.round(x), 0.55);
  }
};
// rain drops inside a box
const rain = (c: Ctx, x0: number, x1: number, y0: number, y1: number, n: number, sd: number) => { const r = rnd(sd); for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0); shape(c, () => { c.moveTo(x, y - 12); c.quadraticCurveTo(x + 9, y + 2, x, y + 8); c.quadraticCurveTo(x - 9, y + 2, x, y - 12); c.closePath(); }, COL.water, 3); } };

// ---------------------------------------------------------------- the tilted-plate rig, seen from the side
// glass bottom centre at (gx, gy), scale s. The plate's low lip rests on the far rim of the glass, the high end on three books.
type Kind = "soil" | "soilLeaves" | "leaves" | "roots";
type Run = "mud" | "clear" | "none";
const rig = (c: Ctx, gx: number, gy: number, s: number, kind: Kind, run: Run) => {
  const gw = 80 * s, gh = 100 * s, bx = gx + 300 * s, bw = 170 * s, bh = 75 * s, t = 16 * s;
  glass(c, gx, gy, gw, gh, run === "mud" ? 0.42 : run === "clear" ? 0.2 : 0, run === "mud" ? MUD : CLEAR);
  // books, one on top of the other
  const bc = [COL.red, COL.blue, COL.yellow];
  for (let k = 0; k < 3; k++) {
    const by = gy - (k + 1) * bh, ox = k === 1 ? 10 * s : 0;
    shape(c, () => polyP(c, [[bx + ox, by], [bx + ox + bw, by], [bx + ox + bw, by + bh], [bx + ox, by + bh]]), bc[k]);
    shape(c, () => polyP(c, [[bx + ox + 14 * s, by + 12 * s], [bx + ox + bw - 6 * s, by + 12 * s], [bx + ox + bw - 6 * s, by + bh - 12 * s], [bx + ox + 14 * s, by + bh - 12 * s]]), COL.paper, 3);
  }
  const L = [gx + 4 * s, gy - gh - 2 * s], H = [bx + bw * 0.5, gy - 3 * bh];
  // the folded paper chute under the low lip, leading into the glass
  const ch0 = [L[0] + 2 * s, L[1] + t], ch1 = [gx - 8 * s, gy - gh + 40 * s];
  line(c, [ch0, ch1], 16 * s + 6, INK); line(c, [ch0, ch1], 16 * s, WHITE);
  // the plate
  const pl = () => polyP(c, [L, H, [H[0], H[1] + t], [L[0], L[1] + t]]);
  shape(c, pl, COL.steel); shade(c, pl, COL.steelDk, 0, t * 0.55);
  const dx = H[0] - L[0], dy = H[1] - L[1], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, nx = uy, ny = -ux;
  const pt = (f: number, up: number): number[] => [L[0] + ux * len * f + nx * up, L[1] + uy * len * f + ny * up];
  // what lies on the plate
  if (kind !== "leaves") {
    const band = () => polyP(c, [pt(0.03, 0), pt(0.97, 0), pt(0.97, 13 * s), pt(0.03, 13 * s)]);
    shape(c, band, COL.soil, 4); shade(c, band, COL.soilDk, 0, 6 * s);
  }
  if (kind === "roots") {
    const r = rnd(5);
    for (let f = 0.07; f < 0.95; f += 0.055) {
      const b = pt(f, 12 * s), top = pt(f + (r() - 0.5) * 0.02, 12 * s + (28 + r() * 14) * s);
      line(c, [pt(f + 0.01, 2 * s), pt(f + 0.005, 11 * s)], 2.5, WHITE);
      line(c, [b, top], 5, COL.greenDk);
      shape(c, () => ell(c, top[0] - 7 * s, top[1] - 2 * s, 8 * s, 5 * s, -0.5), COL.greenLt, 2.5); shape(c, () => ell(c, top[0] + 7 * s, top[1] - 2 * s, 8 * s, 5 * s, 0.5), COL.green, 2.5);
    }
  }
  if (kind === "leaves" || kind === "soilLeaves") {
    const r = rnd(kind === "leaves" ? 21 : 22), base = kind === "leaves" ? 7 * s : 19 * s, cols = [COL.brown, COL.woodDk, "#c48a4a", COL.orange];
    for (let i = 0; i < 22; i++) { const p = pt(0.06 + r() * 0.88, base + r() * 10 * s); leafBit(c, p[0], p[1], r() * 0.8 - 0.4 + Math.atan2(uy, ux), 0.45 * s, cols[i % 4]); }
  }
  // the runoff running off the low lip and down the chute
  if (run !== "none") { const w = run === "mud" ? 9 * s : 4 * s, col = run === "mud" ? MUD : COL.waterDk; line(c, [pt(0.12, 14 * s), pt(0.03, 14 * s), [L[0] + 2 * s, L[1]], ch0, ch1], w, col); }
  shape(c, () => ell(c, L[0], L[1] + 2 * s, 5 * s, 7 * s), COL.steelIn, 4); shape(c, () => ell(c, H[0], H[1] + 2 * s, 5 * s, 7 * s), COL.steelIn, 4);
};

// ---------------------------------------------------------------- other things
// a tea strainer, rim centre (x, y), bowl radius r, handle to the left
const strainer = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => rrect(c, x - r - 150, y - 10, 160, 20, 9), COL.steel, 5);
  shape(c, () => { c.arc(x, y, r, 0, Math.PI); c.closePath(); }, COL.steel, 5);
  c.save(); c.beginPath(); c.arc(x, y, r, 0, Math.PI); c.clip(); c.globalAlpha = 0.45;
  for (let k = -r; k <= r; k += 14) line(c, [[x + k, y], [x + k, y + r]], 2, INK);
  for (let k = 0; k <= r; k += 14) line(c, [[x - r, y + k], [x + r, y + k]], 2, INK);
  c.restore(); c.globalAlpha = 1;
  shape(c, () => ell(c, x, y, r, r * 0.22), COL.steelIn, 5);
};
// where the lowest point of a tilted glass's mouth is (centre (x, y), tipped by rot)
const lipOf = (x: number, y: number, w: number, h: number, rot: number): number[] => {
  const cs = Math.cos(rot), sn = Math.sin(rot), pts = [[-w / 2, -h / 2], [w / 2, -h / 2]].map(([lx, ly]) => [x + lx * cs - ly * sn, y + lx * sn + ly * cs]);
  return pts[0][1] > pts[1][1] ? pts[0] : pts[1];
};
// a tumbler tipped by rot (positive tips the mouth to the right), water level at the lip so it pours; returns the lip
const tiltedGlass = (c: Ctx, x: number, y: number, w: number, h: number, rot: number, liquid: string = COL.water) => {
  const body = () => { c.moveTo(-w / 2, -h / 2); c.lineTo(w / 2, -h / 2); c.lineTo(w * 0.4, h / 2); c.lineTo(-w * 0.4, h / 2); c.closePath(); };
  const lip = lipOf(x, y, w, h, rot);
  c.save(); c.translate(x, y); c.rotate(rot); c.beginPath(); body(); c.clip(); c.rotate(-rot); c.translate(-x, -y);
  c.fillStyle = liquid; c.fillRect(x - h, lip[1] - 3, 2 * h, 2 * h); c.restore();
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, body, COL.glass, 5); shape(c, () => ell(c, 0, -h / 2, w / 2, w * 0.08), "rgba(255,255,255,0.35)", 5);
  c.globalAlpha = 0.75; line(c, [[-w * 0.33, -h * 0.35], [-w * 0.3, h * 0.3]], 7, WHITE); c.globalAlpha = 1;
  c.restore();
  return lip;
};
// a tilted glass gripped at (hx, hy): the grip is on the body a little toward the base
const heldGlass = (c: Ctx, hx: number, hy: number, w: number, h: number, rot: number, liquid: string = COL.water) => tiltedGlass(c, hx + 0.15 * h * Math.sin(rot), hy - 0.15 * h * Math.cos(rot), w, h, rot, liquid);
// a water stream from a to b
const stream = (c: Ctx, a: number[], b: number[], w = 10, col: string = COL.water) => { c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo(a[0] + (b[0] - a[0]) * 0.2, b[1] - (b[1] - a[1]) * 0.2, b[0], b[1]); c.strokeStyle = INK; c.lineWidth = w + 5; c.lineCap = "round"; c.stroke(); c.strokeStyle = col; c.lineWidth = w; c.stroke(); };
// a measuring jug with a spout, a handle and ml marks; bottom centre (x, y)
const jug = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, liquid: string) => {
  shadow(c, x + 12, y + 6, w * 0.6, w * 0.12);
  line(c, [[x + w / 2, y - h + 34], [x + w / 2 + 46, y - h + 46], [x + w / 2 + 46, y - h * 0.45], [x + w / 2, y - h * 0.4]], 22, INK); line(c, [[x + w / 2, y - h + 34], [x + w / 2 + 46, y - h + 46], [x + w / 2 + 46, y - h * 0.45], [x + w / 2, y - h * 0.4]], 12, COL.blue);
  if (fill) shape(c, () => rrect(c, x - w / 2, y - h * fill, w, h * fill, 14), liquid, 0);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 14), COL.glass, 5);
  shape(c, () => { c.moveTo(x - w / 2, y - h + 34); c.lineTo(x - w / 2 - 26, y - h - 6); c.lineTo(x - w / 2 + 24, y - h); c.closePath(); }, COL.glass, 5);
  for (let k = 1; k <= 3; k++) { const my = y - h * 0.22 * k; line(c, [[x - w / 2 + 6, my], [x - w / 2 + 30, my]], 3, INK); write(c, String(100 * k), x - w / 2 + 38, my - 11, 22, INK, 3.5); }
  shape(c, () => ell(c, x, y - h, w / 2 - 2, w * 0.08), "rgba(255,255,255,0.35)", 4);
};
// a wooden table: the top band starts at y, the front below it
const table = (c: Ctx, y: number) => { shape(c, () => polyP(c, [[-10, y], [D + 10, y], [D + 10, y + 120], [-10, y + 120]]), COL.wood); shape(c, () => polyP(c, [[-10, y + 120], [D + 10, y + 120], [D + 10, D + 10], [-10, D + 10]]), COL.woodDk); };
// an open notebook lying flat, centre (x, y)
const notebook = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 10, y + h / 2 + 4, w / 2, 8);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 6), COL.paper, 5);
  line(c, [[x, y - h / 2 + 4], [x, y + h / 2 - 4]], 4, INK);
  for (let k = 1; k <= 3; k++) { const ly = y - h / 2 + (h / 4) * k; line(c, [[x - w / 2 + 14, ly], [x - 12, ly]], 2, "#bfc8d8"); line(c, [[x + 12, ly], [x + w / 2 - 14, ly]], 2, "#bfc8d8"); }
};
// a pencil held at (x, y), its tip 42 px along an
const pencil = (c: Ctx, x: number, y: number, an: number) => {
  const P = (d: number): number[] => [x + Math.cos(an) * d, y + Math.sin(an) * d];
  line(c, [P(-80), P(42)], 18, INK); line(c, [P(-80), P(24)], 11, COL.yellow); line(c, [P(24), P(40)], 7, "#e8d2a8"); line(c, [P(-80), P(-64)], 11, COL.pink);
};
// a hand lens whose handle is held at (x, y), the ring further along an
const lens = (c: Ctx, x: number, y: number, an: number, r = 40) => {
  const cx = x + Math.cos(an) * (70 + r), cy = y + Math.sin(an) * (70 + r);
  line(c, [[x, y], [x + Math.cos(an) * 74, y + Math.sin(an) * 74]], 22, INK); line(c, [[x, y], [x + Math.cos(an) * 74, y + Math.sin(an) * 74]], 13, COL.woodDk);
  shape(c, () => ell(c, cx, cy, r + 8, r + 8), COL.greyDk, 5); shape(c, () => ell(c, cx, cy, r, r), "rgba(191,224,245,0.7)", 4);
  c.globalAlpha = 0.8; line(c, [[cx - r * 0.5, cy - r * 0.3], [cx - r * 0.2, cy - r * 0.6]], 6, WHITE); c.globalAlpha = 1;
};
// a house crow standing on a wire, feet at (x, y), facing left
const crow = (c: Ctx, x: number, y: number) => {
  line(c, [[x - 12, y - 22], [x - 16, y]], 4, INK); line(c, [[x + 12, y - 22], [x + 16, y]], 4, INK);
  shape(c, () => polyP(c, [[x + 30, y - 52], [x + 96, y - 72], [x + 92, y - 40], [x + 36, y - 30]]), COL.black, 5);
  shape(c, () => ell(c, x, y - 48, 54, 30), COL.black, 5);
  shape(c, () => ell(c, x - 36, y - 62, 24, 18), COL.grey, 0);
  shape(c, () => ell(c, x - 50, y - 80, 25, 22), COL.black, 5);
  shape(c, () => polyP(c, [[x - 70, y - 86], [x - 104, y - 76], [x - 70, y - 70]]), COL.black, 4);
  shape(c, () => ell(c, x - 56, y - 84, 5, 5), WHITE, 2);
};
// a potted plant, pot bottom centre (x, y)
const pottedPlant = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + 10 * s, y + 4, 50 * s, 10 * s);
  shape(c, () => polyP(c, [[x - 55 * s, y - 110 * s], [x + 55 * s, y - 110 * s], [x + 42 * s, y], [x - 42 * s, y]]), "#c9693f");
  shape(c, () => polyP(c, [[x - 62 * s, y - 128 * s], [x + 62 * s, y - 128 * s], [x + 62 * s, y - 106 * s], [x - 62 * s, y - 106 * s]]), "#d87a4b");
  for (const [an, ln] of [[-1.9, 150], [-1.2, 130], [-1.5, 180], [-2.3, 120], [-0.9, 100]] as number[][]) leaf(c, x, y - 118 * s, ln * s, an);
};
// a sun with rays
const sun = (c: Ctx, x: number, y: number, r: number) => { for (let k = 0; k < 10; k++) { const a = (k / 10) * TAU; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.7, y + Math.sin(a) * r * 1.7]], 7, COL.orange); } shape(c, () => ell(c, x, y, r, r), COL.yellow, 5); };
// a sunny window with a sill; the three cups of the Blanket Test stand on it. result = day 5: A's soil has a dry pale crust, C's is damp
const windowSill = (c: Ctx, result: boolean) => {
  ground(c);
  shape(c, () => rrect(c, 140, 60, 800, 570, 10), COL.wood, 6);
  shape(c, () => polyP(c, [[178, 98], [902, 98], [902, 592], [178, 592]]), SKY, 5);
  sun(c, 330, 230, 70);
  line(c, [[540, 98], [540, 592]], 14, COL.wood); line(c, [[178, 345], [902, 345]], 14, COL.wood);
  shape(c, () => polyP(c, [[100, 630], [980, 630], [1000, 700], [80, 700]]), COL.wood); shape(c, () => polyP(c, [[80, 700], [1000, 700], [1000, 732], [80, 732]]), COL.woodDk);
  cupSoil(c, 300, 668, 170, 270, 0.55, 0, result ? 0.14 : 0);
  cupSoil(c, 540, 668, 170, 270, 0.55, 1, result ? 0.05 : 0);
  cupSoil(c, 780, 668, 170, 270, 0.55, 2, 0);
  if (result) for (let k = 0; k < 3; k++) { const x = 260 + k * 40, y0 = 480; line(c, [[x, y0], [x - 8, y0 - 25], [x + 8, y0 - 50], [x - 8, y0 - 75], [x, y0 - 95]], 5, COL.waterDk); }
  tag(c, 300, 800, "A"); tag(c, 540, 800, "B"); tag(c, 780, 800, "C");
};

// ================================================================ set-up cards
// setup.e1.0 · plate A soil, plate B soil under crushed leaves, plate C crushed leaves only
const e1Plates = (c: Ctx) => {
  ground(c);
  soilPlate(c, 200, 540, 160, 78, true, false, 1); soilPlate(c, 540, 540, 160, 78, true, true, 2); soilPlate(c, 880, 540, 160, 78, false, true, 3);
  tag(c, 200, 700, "A"); tag(c, 540, 700, "B"); tag(c, 880, 700, "C");
};
// setup.e1.1 · one plate lifted on books, a glass under the low edge, a paper chute
const e1Lift = (c: Ctx) => { ground(c); rig(c, 270, 760, 1.3, "soil", "none"); };
// setup.e1.2 · a hand holds the strainer 10 cm over the plate while a tumbler pours through it
const e1Rain = (c: Ctx) => {
  ground(c);
  c.translate(110, 30);
  rig(c, 250, 880, 1, "soil", "mud");
  rain(c, 395, 500, 585, 690, 9, 3);
  // the 10 cm gap, marked beside the shower
  line(c, [[580, 578], [580, 652]], 4, RED); line(c, [[566, 578], [594, 578]], 4, RED); line(c, [[566, 652], [594, 652]], 4, RED);
  write(c, "10 cm", 602, 598, 32, RED, 5);
  strainer(c, 445, 500, 70);
  hand(c, 330, 430, Math.PI / 2, 1, SKIN.child, CLOTH.child);
  const lip = tiltedGlass(c, 560, 290, 90, 150, -1.9);
  stream(c, lip, [452, 496], 9);
  hand(c, 606, 356, -1.9, 1.1, SKIN.adult, CLOTH.adult);
  c.translate(-110, -30);
};
// setup.e1.3 · white paper held behind two glasses, muddy and nearly clear
const e1Compare = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[170, 187], [900, 187], [900, 760], [170, 760]]), WHITE, 5);
  hand(c, 820, 110, Math.PI / 2, 1.1, SKIN.adult, CLOTH.adult);
  glass(c, 380, 880, 180, 320, 0.5, MUD); glass(c, 700, 880, 180, 320, 0.5, CLEAR);
  tag(c, 380, 985, "A"); tag(c, 700, 985, "B");
};
// setup.e1.4 · the child pours the runoff into a measuring jug; the notebook holds the table and bars
const e1Measure = (c: Ctx) => {
  ground(c);
  c.save(); c.beginPath(); c.rect(0, 0, D, 742); c.clip();
  const { handR } = person(c, 300, 1050, 680, { reachR: [445, 560], reachL: [225, 735] });
  c.restore();
  table(c, 740);
  const lip = heldGlass(c, handR[0], handR[1], 70, 110, 1.9, MUD);
  jug(c, 530, 850, 150, 200, 0.3, MUD);
  stream(c, lip, [lip[0] + 10, 655], 7, MUD);
  notebook(c, 840, 800, 330, 110);
  // the results table on the left page, a bar for each plate on the right page
  for (let r = 0; r <= 3; r++) line(c, [[700, 762 + r * 25], [820, 762 + r * 25]], 2.5, INK);
  for (let k = 0; k <= 3; k++) line(c, [[700 + k * 40, 762], [700 + k * 40, 837]], 2.5, INK);
  line(c, [[868, 840], [985, 840]], 3, INK);
  for (const [k, hgt] of [[0, 62], [1, 20], [2, 44]]) shape(c, () => rrect(c, 876 + k * 38, 840 - hgt, 24, hgt, 3), COL.blue, 3);
};
// setup.e2.0 · three cups with 6 cm of soil, labelled A, B, C
const e2Cups = (c: Ctx) => {
  ground(c);
  cupSoil(c, 200, 760, 170, 300, 0.55, 0); cupSoil(c, 540, 760, 170, 300, 0.55, 0); cupSoil(c, 880, 760, 170, 300, 0.55, 0);
  // a ruler beside cup A: the soil comes up to 6 cm
  shape(c, () => polyP(c, [[330, 540], [376, 540], [376, 760], [330, 760]]), COL.wood, 5);
  for (let cm = 0; cm <= 8; cm++) { const y = 760 - cm * 27.5; line(c, [[330, y], [330 + (cm % 2 ? 10 : 18), y]], 3, INK); }
  line(c, [[322, 595], [384, 595]], 6, RED); write(c, "6 cm", 290, 495, 30, RED, 5);
  tag(c, 200, 850, "A"); tag(c, 540, 850, "B"); tag(c, 880, 850, "C");
};
// setup.e2.1 · the child spoons water into the bowl of soil; the cups wait
const e2Mix = (c: Ctx) => {
  ground(c);
  c.save(); c.beginPath(); c.rect(0, 0, D, 742); c.clip();
  const { handR } = person(c, 330, 1050, 680, { reachR: [470, 560], reachL: [255, 735] });
  c.restore();
  table(c, 740);
  glass(c, 150, 850, 90, 150, 0.6);
  bowl(c, 600, 775, 95, COL.soil);
  // the spoon, handle in the hand, its bowl tipped down toward the soil
  const an = 0.5, sx = handR[0] + Math.cos(an) * 115, sy = handR[1] + Math.sin(an) * 115;
  line(c, [[handR[0] - Math.cos(an) * 20, handR[1] - Math.sin(an) * 20], [sx - Math.cos(an) * 26, sy - Math.sin(an) * 26]], 16, INK);
  line(c, [[handR[0] - Math.cos(an) * 20, handR[1] - Math.sin(an) * 20], [sx - Math.cos(an) * 26, sy - Math.sin(an) * 26]], 8, COL.steel);
  shape(c, () => ell(c, sx, sy, 32, 19, an), COL.steel, 5); shape(c, () => ell(c, sx + 2, sy + 2, 22, 11, an), COL.water, 0);
  stream(c, [sx + 20, sy + 22], [600, 770], 6);
  glass(c, 790, 850, 85, 140); glass(c, 890, 850, 85, 140); glass(c, 990, 850, 85, 140);
};
// setup.e2.2 · A bare, B a thin layer of leaves, C a thick layer, on the sunny sill
const e2Sill = (c: Ctx) => windowSill(c, false);
// setup.e2.3 · the stick pulled out: pale and dry above, dark and damp below; the ruler measures the pale part
const e2Stick = (c: Ctx) => {
  ground(c);
  cupSoil(c, 800, 860, 200, 320, 0.55, 0);
  shape(c, () => ell(c, 790, 684, 16, 7), DAMP, 3);
  // the ruler, 0 at the top of the stick
  shape(c, () => polyP(c, [[400, 236], [470, 236], [470, 770], [400, 770]]), COL.wood, 5);
  for (let cm = 0; cm <= 11; cm++) { const y = 250 + cm * 46; line(c, [[400, y], [400 + (cm % 5 ? 14 : 24), y]], 3, INK); if (cm % 2 === 0) write(c, String(cm), 430, y - 9, 18, INK, 3); }
  // the stick
  line(c, [[330, 250], [330, 760]], 30, INK); line(c, [[330, 250], [330, 434]], 20, PALE); line(c, [[330, 434], [330, 760]], 20, DAMP);
  line(c, [[365, 250], [365, 434]], 5, RED); line(c, [[352, 250], [378, 250]], 5, RED); line(c, [[352, 434], [378, 434]], 5, RED);
  write(c, "4 cm", 490, 320, 36, RED, 6);
  hand(c, 260, 300, 0, 1, SKIN.child, CLOTH.child);
};

// ================================================================ card pictures
// flow.e1 · the Forest Floor Test: bare soil sends brown water, soil under leaves a clear trickle
const e1Flow = (c: Ctx) => {
  ground(c);
  rain(c, 350, 640, 120, 250, 10, 11); rig(c, 280, 480, 1.1, "soil", "mud"); tag(c, 950, 380, "A");
  rain(c, 350, 640, 640, 770, 10, 12); rig(c, 280, 1000, 1.1, "soilLeaves", "clear"); tag(c, 950, 900, "B");
};
// flow.e2 · the Blanket Test on day 5: bare soil dried to a pale crust, water leaving it as vapour; the covered soil stays dark
const e2Flow = (c: Ctx) => windowSill(c, true);
// flow.a1 · Window Trail: the child sits by the balcony railing with a notebook, a pencil and a hand lens
const a1Flow = (c: Ctx) => {
  ground(c);
  c.fillStyle = SKY; c.fillRect(0, 0, D, 900);
  line(c, [[600, 150], [D + 10, 118]], 4, INK); crow(c, 880, 130);
  line(c, [[-10, 380], [D + 10, 380]], 16, COL.greyDk);
  for (let x = 40; x < D; x += 70) line(c, [[x, 388], [x, 900]], 12, COL.greyDk);
  c.fillStyle = BG; c.fillRect(0, 900, D, 180); line(c, [[-10, 900], [D + 10, 900]], 5, INK);
  pottedPlant(c, 170, 900, 1.1);
  const { handR } = person(c, 600, 900, 460, { sit: true, reachL: [520, 850], reachR: [655, 815] });
  notebook(c, 630, 870, 180, 70);
  pencil(c, handR[0], handR[1], 2.2);
  lens(c, 770, 885, -0.3, 34);
};
// flow.a2 · One Tree, Many Lives: the child looks at the bark through a lens, the grown-up beside
const a2Flow = (c: Ctx) => {
  ground(c);
  c.fillStyle = SKY; c.fillRect(0, 0, D, 960); c.fillStyle = COL.greenLt; c.fillRect(0, 960, D, 120); line(c, [[-10, 960], [D + 10, 960]], 5, INK);
  shape(c, () => polyP(c, [[245, 960], [415, 960], [400, 330], [260, 330]]), COL.brown); shade(c, () => polyP(c, [[245, 960], [415, 960], [400, 330], [260, 330]]), "#7d5234", 50, 0);
  for (const [x0, y0, y1] of [[300, 420, 700], [350, 520, 880], [320, 760, 930], [380, 380, 500]]) line(c, [[x0, y0], [x0 + 6, (y0 + y1) / 2], [x0, y1]], 4, "#7d5234");
  for (const [x, y, rx, ry, col] of [[330, 230, 330, 190, COL.greenDk], [200, 300, 190, 130, COL.green], [470, 300, 200, 130, COL.green], [330, 180, 230, 130, COL.leaf]] as (number | string)[][]) shape(c, () => ell(c, x as number, y as number, rx as number, ry as number), col as string);
  person(c, 930, 960, 700, { adult: true });
  const { handL, handR } = person(c, 640, 960, 520, { reachL: [545, 600], reachR: [740, 690] });
  lens(c, handL[0], handL[1], Math.PI, 40);
  shape(c, () => rrect(c, handR[0] - 10, handR[1] - 55, 80, 110, 6), COL.paper, 5); line(c, [[handR[0] + 8, handR[1] - 55], [handR[0] + 8, handR[1] + 55]], 4, INK);
};
// flow.a3 · Ask an Elder: the child and grandmother on the verandah, a notebook and a tumbler of tea between them
const a3Flow = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#f6ecd8"; c.fillRect(0, 0, D, 880); c.fillStyle = "#c97a55"; c.fillRect(0, 880, D, 200); line(c, [[-10, 880], [D + 10, 880]], 5, INK);
  shape(c, () => polyP(c, [[60, -10], [130, -10], [130, 880], [60, 880]]), COL.cloth);
  shape(c, () => rrect(c, 420, 120, 260, 300, 8), SKY, 6); line(c, [[550, 120], [550, 420]], 8, INK); line(c, [[420, 270], [680, 270]], 8, INK);
  person(c, 330, 880, 440, { sit: true, reachL: [230, 835], reachR: [430, 835] });
  const { handL } = person(c, 760, 880, 560, { adult: true, sit: true, reachL: [650, 780], reachR: [890, 810] });
  notebook(c, 545, 850, 130, 70); pencil(c, 575, 830, 0.1);
  shape(c, () => polyP(c, [[handL[0] - 30, handL[1] - 44], [handL[0] + 30, handL[1] - 44], [handL[0] + 24, handL[1] + 36], [handL[0] - 24, handL[1] + 36]]), COL.steel, 5);
  shape(c, () => ell(c, handL[0], handL[1] - 44, 30, 7), COL.brown, 4);
  for (let k = 0; k < 2; k++) line(c, [[handL[0] - 10 + k * 20, handL[1] - 60], [handL[0] - 4 + k * 20, handL[1] - 80], [handL[0] - 10 + k * 20, handL[1] - 100]], 4, COL.grey);
};
// flow.a4 · The Shared Pond: a bowl of beans, a spare cup of beans, two small cups, two secret numbers
const a4Flow = (c: Ctx) => {
  ground(c);
  const bean = (x: number, y: number, r: number, rot: number) => seed(c, x, y, r, rot, false, COL.brown, MUDDK);
  bowl(c, 540, 560, 210);
  const r = rnd(8); for (let i = 0; i < 20; i++) bean(380 + r() * 320, 548 + r() * 36, 15, r() * 3);
  glass(c, 900, 420, 140, 190); for (let i = 0; i < 20; i++) bean(860 + r() * 80, 300 + r() * 100, 13, r() * 3);
  bowl(c, 230, 820, 90); bean(205, 820, 14, 0.3); bean(250, 826, 14, 1.2); bean(228, 812, 14, 2.1);
  bowl(c, 850, 820, 90); bean(830, 822, 14, 0.8); bean(872, 818, 14, 2.4);
  shape(c, () => rrect(c, 175, 630, 110, 72, 8), WHITE, 5); write(c, "3", 212, 644, 44, INK, 6);
  shape(c, () => rrect(c, 795, 630, 110, 72, 8), WHITE, 5); write(c, "2", 832, 644, 44, INK, 6);
};
// flow.p1 · Grow a Root Mat: rain on the sprouted plate runs off clear; bare plate A ran off brown
const p1Flow = (c: Ctx) => {
  ground(c);
  rig(c, 60, 900, 0.9, "roots", "clear"); rig(c, 590, 900, 0.9, "soil", "mud");
  rain(c, 170, 300, 635, 720, 8, 13);
  strainer(c, 235, 560, 60);
  hand(c, 105, 490, Math.PI / 2, 1, SKIN.child, CLOTH.child);
  tag(c, 930, 600, "A");
};
// term.2 · Leaf litter: a handful lifted from the ground, with a beetle and a millipede on it
const leafLitter = (c: Ctx) => {
  ground(c);
  leafBits(c, 540, 980, 620, 70, 60, 31, 1.1);
  hand(c, 330, 600, 0, 2.2, SKIN.child, CLOTH.child, true);
  const heap = () => { c.moveTo(250, 520); c.quadraticCurveTo(300, 360, 450, 350); c.quadraticCurveTo(620, 340, 650, 500); c.quadraticCurveTo(600, 560, 450, 560); c.quadraticCurveTo(300, 565, 250, 520); c.closePath(); };
  shape(c, heap, COL.brown, 5);
  leafBits(c, 450, 455, 170, 75, 24, 32, 1.1);
  // a millipede: a chain of dark red segments with little legs
  for (let k = 0; k < 9; k++) { const x = 300 + k * 22, y = 410 - Math.sin(k * 0.5) * 12; line(c, [[x, y + 12], [x - 4, y + 24]], 3, INK); line(c, [[x + 6, y + 12], [x + 10, y + 24]], 3, INK); shape(c, () => ell(c, x, y, 13, 11), "#8b3a2f", 3.5); }
  // a beetle
  shape(c, () => ell(c, 560, 420, 30, 22), COL.black, 5); line(c, [[560, 400], [560, 442]], 3, COL.greyDk); shape(c, () => ell(c, 594, 420, 12, 11), COL.black, 4);
  for (const [a, b] of [[[540, 405], [520, 385]], [[545, 435], [525, 455]], [[580, 405], [600, 388]], [[580, 436], [600, 456]]]) line(c, [a, b], 4, INK);
};
// term.6 · Mulch: a banana plant with a thick ring of coconut husk round her base
const mulch = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.greenLt; c.fillRect(0, 760, D, 320); line(c, [[-10, 760], [D + 10, 760]], 5, INK);
  shape(c, () => ell(c, 540, 900, 330, 95), COL.soil, 5);
  shape(c, () => polyP(c, [[490, 900], [590, 900], [575, 380], [505, 380]]), "#c9d98a"); shade(c, () => polyP(c, [[490, 900], [590, 900], [575, 380], [505, 380]]), "#9bb35a", 30, 0);
  // a broad banana leaf from the top of the stem: a wide blade with a midrib and side veins that stay inside the blade
  const bl = (an: number, ln: number) => { const x = 540, y = 400, tx = x + Math.cos(an) * ln, ty = y + Math.sin(an) * ln, nx = -Math.sin(an) * ln * 0.42, ny = Math.cos(an) * ln * 0.42, mx = (x + tx) / 2, my = (y + ty) / 2; shape(c, () => { c.moveTo(x, y); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, x, y); c.closePath(); }, COL.leaf, 5); line(c, [[x, y], [tx, ty]], 5, COL.leafDk); for (let k = 0.25; k < 0.85; k += 0.12) { const px = x + (tx - x) * k, py = y + (ty - y) * k, hw = 0.5 * (1 - Math.abs(2 * k - 1) ** 2) * 0.8; line(c, [[px, py], [px + nx * hw + (tx - x) * 0.05, py + ny * hw + (ty - y) * 0.05]], 2, COL.leafDk); line(c, [[px, py], [px - nx * hw + (tx - x) * 0.05, py - ny * hw + (ty - y) * 0.05]], 2, COL.leafDk); } };
  bl(-2.6, 420); bl(-0.5, 420); bl(-2.1, 300); bl(-1.0, 300); bl(-1.57, 330);
  // the husk ring: fibrous brown chunks all round the stem
  const r = rnd(17);
  for (let i = 0; i < 46; i++) {
    const a = r() * TAU, d = 0.45 + r() * 0.5, x = 540 + Math.cos(a) * 300 * d, y = 905 + Math.sin(a) * 78 * d, rot = r() * TAU;
    c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -30, -16, 60, 32, 10), HUSK, 4); for (let k = -1; k <= 1; k++) line(c, [[-20, k * 8], [20, k * 8 + 2]], 2, MUDDK); c.restore();
  }
};

export const ic_ecologyInterdependenceL4 = cards("sci.ecology.interdependence.L4", [
  e1Plates, e1Lift, e1Rain, e1Compare, e1Measure, e2Cups, e2Mix, e2Sill, e2Stick,
  e1Flow, e2Flow, a1Flow, a2Flow, a3Flow, a4Flow, p1Flow, leafLitter, mulch,
]);
