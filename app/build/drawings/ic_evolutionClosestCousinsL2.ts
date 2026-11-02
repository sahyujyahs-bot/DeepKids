import type { Ctx } from "./core";
import type { Pose } from "./flatKit";
import { INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, bowl, person, cards, rnd } from "./flatKit";

// APES, OUR CLOSEST COUSINS (L2) · set-up cards and card pictures in the flat kit look.
// Same girl (SKIN.child, CLOTH.child) and grown-up (SKIN.adult, CLOTH.adult) on every card.

// ---------------------------------------------------------------- apes
const FUR = {
  chimp: ["#3a3540", "#2b2340", "#c99a74"], gorilla: ["#3a3540", "#2b2340", "#5a5262"], orang: ["#c4612c", "#9a4820", "#8d5a3b"],
  gibbonM: ["#2f2a38", "#1f1a28", "#2f2a38"], gibbonF: ["#e3c27a", "#c9a35b", "#4a4452"],
} as const;
type ApeKind = keyof typeof FUR;
type Mouth = "smile" | "open" | "sing";
type ApePose = { armL?: [number, number]; armR?: [number, number]; sit?: boolean; mouth?: Mouth; saddle?: boolean; slim?: boolean };
const limb = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 10, INK); line(c, pts, w, col); };
const mouthOf = (c: Ctx, x: number, y: number, r: number, m: Mouth) => {
  if (m === "smile") { c.beginPath(); c.arc(x, y - r * 0.1, r * 0.22, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
  else if (m === "open") { shape(c, () => ell(c, x, y, r * 0.32, r * 0.22), "#5a2430", 5); shape(c, () => rrect(c, x - r * 0.24, y + r * 0.08, r * 0.48, r * 0.1, r * 0.03), WHITE, 3); }
  else shape(c, () => ell(c, x, y, r * 0.15, r * 0.19), "#5a2430", 5);
};
// an ape's head, centre (x, hy), radius head
const apeHead = (c: Ctx, x: number, hy: number, head: number, k: ApeKind, m: Mouth = "smile") => {
  const [fur, , face] = FUR[k];
  if (k !== "orang") for (const s of [-1, 1]) shape(c, () => ell(c, x + s * head * 0.95, hy, head * 0.22, head * 0.28), face, 5);
  shape(c, () => ell(c, x, hy, head, head * 0.98), fur);
  shape(c, () => { c.moveTo(x - head * 0.72, hy - head * 0.1); c.quadraticCurveTo(x, hy - head * 0.4, x + head * 0.72, hy - head * 0.1); c.quadraticCurveTo(x + head * 0.78, hy + head * 0.6, x, hy + head * 0.85); c.quadraticCurveTo(x - head * 0.78, hy + head * 0.6, x - head * 0.72, hy - head * 0.1); c.closePath(); }, face, 5);
  if (k === "gibbonM") { line(c, [[x - head * 0.55, hy - head * 0.1], [x - head * 0.12, hy - head * 0.16]], 7, WHITE); line(c, [[x + head * 0.12, hy - head * 0.16], [x + head * 0.55, hy - head * 0.1]], 7, WHITE); }
  else line(c, [[x - head * 0.55, hy - head * 0.08], [x, hy - head * 0.15], [x + head * 0.55, hy - head * 0.08]], 5, INK);
  for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * head * 0.3, hy + head * 0.08, head * 0.12, head * 0.13), WHITE, 3); shape(c, () => ell(c, x + s * head * 0.3, hy + head * 0.1, head * 0.065, head * 0.075), INK, 0); }
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * head * 0.1, hy + head * 0.4, head * 0.04, head * 0.03), INK, 0);
  mouthOf(c, x, hy + head * 0.6, head, m);
};
// an ape standing or sitting, feet at (x, y), height h
const ape = (c: Ctx, x: number, y: number, h: number, k: ApeKind, p: ApePose = {}) => {
  const [fur, furDk, face] = FUR[k];
  const head = h * 0.16, hip = p.sit ? y - h * 0.12 : y - h * 0.4, sh = p.sit ? hip - h * 0.3 : y - h * 0.68, bw = h * (p.slim ? 0.17 : 0.21), lw = h * 0.085;
  shadow(c, x + h * 0.05, y + 6, h * 0.3, h * 0.05);
  for (const s of [-1, 1]) {
    const pts = p.sit ? [[x + s * h * 0.08, hip], [x + s * h * 0.26, hip - h * 0.02], [x + s * h * 0.3, y - h * 0.03]] : [[x + s * h * 0.09, hip], [x + s * h * 0.11, y - h * 0.03]];
    limb(c, pts, lw, fur);
    const [fx, fy] = pts[pts.length - 1]; shape(c, () => ell(c, fx + s * h * 0.02, fy + h * 0.01, h * 0.07, h * 0.035), face, 5);
  }
  const body = () => ell(c, x, (sh + hip) / 2, bw, (hip - sh) / 2 + h * 0.06);
  shape(c, body, fur); shade(c, body, furDk, h * 0.07, 0);
  if (p.saddle) shape(c, () => { c.moveTo(x - bw * 0.95, sh + h * 0.1); c.quadraticCurveTo(x, sh - h * 0.02, x + bw * 0.95, sh + h * 0.1); c.quadraticCurveTo(x, sh + h * 0.22, x - bw * 0.95, sh + h * 0.1); c.closePath(); }, "#aeb3bd", 5);
  if (k === "orang") shape(c, () => ell(c, x, hip - h * 0.1, bw * 0.5, h * 0.12), "#d98a5a", 0);
  const arm = (sx: number, [a1, a2]: [number, number]) => {
    const l1 = h * 0.22, l2 = h * 0.22, ex = sx + Math.cos(a1) * l1, ey = sh + h * 0.04 + Math.sin(a1) * l1, wx = ex + Math.cos(a2) * l2, wy = ey + Math.sin(a2) * l2;
    limb(c, [[sx, sh + h * 0.04], [ex, ey], [wx, wy]], lw, fur);
    shape(c, () => ell(c, wx, wy, lw * 0.6, lw * 0.6), face, 5);
  };
  arm(x - bw * 0.85, p.armL ?? [Math.PI * 0.6, Math.PI * 0.5]); arm(x + bw * 0.85, p.armR ?? [Math.PI * 0.4, Math.PI * 0.5]);
  apeHead(c, x, sh - head * 0.75, head, k, p.mouth ?? "smile");
};

// ---------------------------------------------------------------- reaching arms (two-link IK)
const ik = (sx: number, sy: number, tx: number, ty: number, l1: number, l2: number, bend: number): [number, number] => {
  let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy); const m = l1 + l2 - 1; if (d > m) { dx *= m / d; dy *= m / d; d = m; }
  const th = Math.atan2(dy, dx), a = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))), a1 = th + bend * a;
  const ex = sx + Math.cos(a1) * l1, ey = sy + Math.sin(a1) * l1;
  return [a1, Math.atan2(sy + dy - ey, sx + dx - ex)];
};
type Target = [number, number, number?];
// a person's pose with the hands reaching the given points (bend: 1 elbow down, -1 up)
const reach = (x: number, y: number, h: number, o: { sit?: boolean; adult?: boolean }, L?: Target, R?: Target): Pose => {
  const sy = (o.sit ? y - h * 0.38 : y - h * 0.74) + h * 0.03, p: Pose = { ...o };
  if (L) p.armL = ik(x - h * 0.11, sy, L[0], L[1], h * 0.17, h * 0.16, L[2] ?? (L[0] >= x - h * 0.11 ? 1 : -1));
  if (R) p.armR = ik(x + h * 0.11, sy, R[0], R[1], h * 0.17, h * 0.16, R[2] ?? (R[0] >= x + h * 0.11 ? 1 : -1));
  return p;
};
const apeReach = (x: number, y: number, h: number, sit: boolean, L?: Target, R?: Target): ApePose => {
  const sy = (sit ? y - h * 0.42 : y - h * 0.68) + h * 0.04, bw = h * 0.21, p: ApePose = { sit };
  if (L) p.armL = ik(x - bw * 0.85, sy, L[0], L[1], h * 0.22, h * 0.22, L[2] ?? 1);
  if (R) p.armR = ik(x + bw * 0.85, sy, R[0], R[1], h * 0.22, h * 0.22, R[2] ?? -1);
  return p;
};
const headOf = (x: number, y: number, h: number, sit = false) => { const r = h * 0.13, sh = sit ? y - h * 0.38 : y - h * 0.74; return { hx: x, hy: sh - r * 1.05, r }; };
// an open laughing mouth over a person's drawn smile
const laugh = (c: Ctx, x: number, y: number, h: number, sit = false, m: Mouth = "open") => { const { hx, hy, r } = headOf(x, y, h, sit); mouthOf(c, hx, hy + r * 0.47, r * 1.1, m); };
// a hand drawn again on top of what it holds
const hand = (c: Ctx, x: number, y: number, h: number, adult = false) => shape(c, () => ell(c, x, y, h * 0.037, h * 0.037), adult ? SKIN.adult : SKIN.child, 5);

// ---------------------------------------------------------------- things
const pencil = (c: Ctx, x: number, y: number, len: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -len / 2 - 10, -14, 30, 28, 5), COL.pink);
  shape(c, () => rrect(c, -len / 2 + 10, -14, len - 50, 28, 3), COL.yellow);
  line(c, [[-len / 2 + 14, 2], [len / 2 - 44, 2]], 5, COL.orange);
  shape(c, () => polyP(c, [[len / 2 - 40, -14], [len / 2, 0], [len / 2 - 40, 14]]), COL.wood);
  shape(c, () => polyP(c, [[len / 2 - 12, -4], [len / 2, 0], [len / 2 - 12, 4]]), INK, 0);
  c.restore();
};
// a tissue strip hanging from (x, y); blow -1..1 swings its bottom sideways
const strip = (c: Ctx, x: number, y: number, len: number, blow: number, w = 52) => {
  const bx = x + blow * len * 0.8, by = y + len * (1 - Math.abs(blow) * 0.3), cx = x + blow * len * 0.15, cy = y + len * 0.55;
  const path = () => { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(cx, cy, bx, by); };
  c.lineCap = "butt"; path(); c.strokeStyle = INK; c.lineWidth = w + 12; c.stroke(); path(); c.strokeStyle = WHITE; c.lineWidth = w; c.stroke(); c.lineCap = "round";
  shape(c, () => rrect(c, x - w * 0.65, y - 12, w * 1.3, 30, 4), "rgba(255,225,110,0.92)", 3);
};
// the tissue flag: a pencil with the strip taped to its left end
const flag = (c: Ctx, x: number, y: number, blow: number) => { pencil(c, x + 90, y, 220, 0); strip(c, x - 10, y + 4, 230, blow); };
// a 1 kg atta packet wrapped in a towel like a baby
const bundle = (c: Ctx, x: number, y: number, s: number, an = 0) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => ell(c, 0, 0, 70, 110), COL.cloth); shade(c, () => ell(c, 0, 0, 70, 110), "#dcd3bf", 20, 0, 0.8);
  shape(c, () => rrect(c, -34, -92, 68, 54, 8), COL.brown, 5); shape(c, () => rrect(c, -24, -78, 48, 18, 4), COL.yellow, 3);
  line(c, [[-62, -10], [0, 30], [62, -10]], 4, "#b9b4ab");
  c.restore();
};
const peg = (c: Ctx, x: number, y: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -20, -50, 18, 100, 5), COL.wood); shape(c, () => rrect(c, 2, -50, 18, 100, 5), COL.wood);
  shape(c, () => ell(c, 0, -6, 17, 12), COL.steel, 4);
  c.restore();
};
const foldedCloth = (c: Ctx, x: number, y: number) => { shadow(c, x + 20, y + 20, 140, 20); for (let i = 0; i < 4; i++) shape(c, () => rrect(c, x - 130 + i * 6, y - 20 - i * 24, 260 - i * 12, 32, 9), i % 2 ? "#e88ba6" : COL.pink); };
// a dupatta sling across a person's body, from the left shoulder to the right hip
const sash = (c: Ctx, x: number, y: number, h: number) => { const sh = y - h * 0.74, hip = y - h * 0.42; limb(c, [[x - h * 0.1, sh + h * 0.02], [x + h * 0.12, hip + h * 0.02]], h * 0.05, COL.pink); shape(c, () => ell(c, x - h * 0.1, sh + h * 0.01, h * 0.035, h * 0.035), "#e88ba6", 4); };
const hanky = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - 90 * s, y); c.quadraticCurveTo(x - 70 * s, y - 55 * s, x - 10 * s, y - 32 * s); c.quadraticCurveTo(x + 30 * s, y - 70 * s, x + 90 * s, y - 12 * s); c.quadraticCurveTo(x + 50 * s, y + 30 * s, x - 90 * s, y); c.closePath(); }, WHITE, 5);
  line(c, [[x - 70 * s, y - 2 * s], [x - 10 * s, y - 20 * s], [x + 60 * s, y - 10 * s]], 4, COL.blue);
};
// a bare foot seen from the side, heel at (x, y), pointing right; curl 0..1 bends the toes down round something
const foot = (c: Ctx, x: number, y: number, s: number, curl: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => rrect(c, 2, -210, 80, 90, 10), "#6b5a8c");
  shape(c, () => rrect(c, 10, -140, 64, 90, 22), SKIN.child);
  const toeY = curl * 40;
  shape(c, () => { c.moveTo(-10, -20); c.quadraticCurveTo(-28, 12, 12, 12); c.lineTo(130, 12 + toeY * 0.3); c.quadraticCurveTo(152, -12, 132, -42); c.lineTo(78, -72); c.lineTo(10, -72); c.quadraticCurveTo(-10, -62, -10, -20); c.closePath(); }, SKIN.child);
  for (let k = 0; k < 5; k++) shape(c, () => ell(c, 134 + k * 13, -12 + k * 7 + toeY, 17 - k * 2.2, 17 - k * 2.2), SKIN.child, 4);
  c.restore();
};
const note = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => ell(c, x, y, 16 * s, 12 * s, -0.4), INK, 0); line(c, [[x + 13 * s, y - 4 * s], [x + 13 * s, y - 60 * s], [x + 40 * s, y - 45 * s]], 6 * s, INK); };
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 14, y + h + 6, w / 2, 16); shape(c, () => rrect(c, x, y, w, h, 14), COL.paper); };
const fit = (pts: number[][], x: number, y: number, w: number, h: number) => pts.map(([u, v]) => [x + u * w, y + v * h]);
const INDIA = [[0.42, 0], [0.55, 0.03], [0.58, 0.1], [0.52, 0.14], [0.6, 0.2], [0.7, 0.22], [0.78, 0.18], [0.9, 0.2], [1, 0.22], [0.98, 0.32], [0.88, 0.36], [0.8, 0.3], [0.72, 0.33], [0.68, 0.4], [0.6, 0.48], [0.55, 0.6], [0.48, 0.75], [0.42, 0.9], [0.38, 1], [0.33, 0.9], [0.26, 0.75], [0.2, 0.62], [0.12, 0.5], [0.02, 0.42], [0, 0.35], [0.1, 0.3], [0.2, 0.3], [0.28, 0.2], [0.3, 0.1], [0.36, 0.02]];
const NE = [[0.72, 0.22], [0.78, 0.18], [0.9, 0.2], [1, 0.22], [0.98, 0.32], [0.88, 0.36], [0.8, 0.3], [0.72, 0.33]];
const AFRICA = [[0.15, 0.05], [0.55, 0], [0.7, 0.08], [0.72, 0.2], [0.6, 0.3], [0.72, 0.35], [0.95, 0.33], [0.98, 0.4], [0.85, 0.5], [0.75, 0.62], [0.62, 0.78], [0.5, 0.95], [0.42, 1], [0.35, 0.9], [0.33, 0.75], [0.38, 0.6], [0.3, 0.5], [0.2, 0.42], [0.05, 0.35], [0, 0.22], [0.05, 0.1]];
const ASIA = [[0, 0], [1, 0], [1, 0.3], [0.85, 0.4], [0.75, 0.55], [0.7, 0.72], [0.64, 0.6], [0.55, 0.5], [0.45, 0.55], [0.38, 0.78], [0.3, 0.55], [0.2, 0.45], [0.1, 0.35], [0, 0.3]];
const land = (c: Ctx, pts: number[][], col = "#e8dcb8") => shape(c, () => polyP(c, pts), col, 5);
// the two continents with the ape forests, inside the box (x, y, w, h)
const apeMap = (c: Ctx, x: number, y: number, w: number, h: number, apes: boolean, dot: boolean) => {
  const aw = w * 0.44, ah = h * 0.9, ax = x, ay = y + h * 0.08, sw = w * 0.5, shh = h * 0.6, sx = x + w * 0.5, sy = y;
  land(c, fit(AFRICA, ax, ay, aw, ah)); land(c, fit(ASIA, sx, sy, sw, shh));
  land(c, fit([[0.3, 0], [0.5, 0.1], [1, 0.9], [0.8, 1], [0.5, 0.7], [0, 0.15]], sx + sw * 0.62, sy + shh * 0.72, sw * 0.22, shh * 0.45)); // Sumatra
  land(c, fit([[0.3, 0], [0.8, 0.1], [1, 0.5], [0.7, 1], [0.2, 0.9], [0, 0.4]], sx + sw * 0.8, sy + shh * 0.75, sw * 0.22, shh * 0.4)); // Borneo
  const forest = (fx: number, fy: number, fr: number) => shape(c, () => ell(c, fx, fy, fr, fr * 0.75), COL.green, 4);
  forest(ax + aw * 0.5, ay + ah * 0.45, aw * 0.17); forest(ax + aw * 0.18, ay + ah * 0.36, aw * 0.1);
  forest(sx + sw * 0.75, sy + shh * 0.95, sw * 0.07); forest(sx + sw * 0.9, sy + shh * 0.95, sw * 0.08); forest(sx + sw * 0.6, sy + shh * 0.42, sw * 0.06);
  if (apes) { const hh = w * 0.11; ape(c, ax + aw * 0.5, ay + ah * 0.5, hh, "chimp"); ape(c, ax + aw * 0.18, ay + ah * 0.42, hh * 0.9, "gorilla", { saddle: true }); ape(c, sx + sw * 0.9, sy + shh * 1, hh * 0.85, "orang"); ape(c, sx + sw * 0.6, sy + shh * 0.47, hh * 0.7, "gibbonM"); }
  if (dot) shape(c, () => ell(c, sx + sw * 0.47, sy + shh * 0.62, w * 0.018, w * 0.018), RED, 4);
};
// two chimpanzees, one grooming the other's back
const chimpGroom = (c: Ctx, x: number, y: number, k: number) => {
  const bx = x - 110 * k, by = y - 50 * k, bh = 560 * k, fx = x + 80 * k, fy = y, fh = 480 * k;
  const L: Target = [fx - 65 * k, fy - 230 * k], R: Target = [fx + 70 * k, fy - 215 * k];
  ape(c, bx, by, bh, "chimp", apeReach(bx, by, bh, true, L, R));
  ape(c, fx, fy, fh, "chimp", { sit: true });
  const [, , face] = FUR.chimp; for (const t of [L, R]) shape(c, () => ell(c, t[0], t[1], bh * 0.05, bh * 0.05), face, 5);
};

// ---------------------------------------------------------------- set-up cards
// e1.0 a tissue flag: the strip taped to one end of a pencil
const e1s0 = (c: Ctx) => { ground(c); pencil(c, 560, 260, 580, 0); strip(c, 300, 266, 560, 0.06, 120); };
// e1.1 the girl holds the flag near her mouth and blows: the strip swings away
const e1s1 = (c: Ctx) => {
  ground(c); const x = 400, y = 1000, h = 760;
  person(c, x, y, h, reach(x, y, h, {}, undefined, [700, 330]));
  flag(c, 560, 330, 0.55); hand(c, 700, 330, h);
  laugh(c, x, y, h, false, "sing"); arrow(c, [[520, 370], [640, 390]]);
};
// e1.2 a grown-up tickles the girl; a second child holds the flag by her laughing mouth
const e1s2 = (c: Ctx) => {
  ground(c);
  person(c, 290, 1000, 760, reach(290, 1000, 760, { adult: true }, undefined, [470, 690]));
  person(c, 560, 1000, 620, { armL: [Math.PI * 0.75, Math.PI * 1.4], armR: [Math.PI * 0.25, Math.PI * 1.6] });
  laugh(c, 560, 1000, 620);
  hand(c, 470, 690, 760, true); for (let i = 0; i < 3; i++) line(c, [[500 + i * 14, 640 - i * 8], [510 + i * 14, 620 - i * 8]], 4, INK);
  person(c, 880, 1000, 540, reach(880, 1000, 540, {}, [800, 470]));
  flag(c, 690, 470, 0.45); hand(c, 800, 470, 540);
};
// e1.3 the girl pants like a chimpanzee: the strip swings out and back
const e1s3 = (c: Ctx) => {
  ground(c); const x = 400, y = 1000, h = 760;
  person(c, x, y, h, reach(x, y, h, {}, undefined, [700, 330]));
  flag(c, 560, 330, 0.3); hand(c, 700, 330, h); laugh(c, x, y, h);
  arrow(c, [[560, 400], [700, 420]]); arrow(c, [[700, 480], [560, 470]]);
};
// e2.0 the pretend baby: an atta packet in a towel, a folded dupatta beside it
const e2s0 = (c: Ctx) => { ground(c); shadow(c, 420, 860, 200, 34); bundle(c, 400, 560, 2.5); foldedCloth(c, 800, 780); };
// e2.1 carrying the baby in one arm, moving pegs with the other hand
const e2s1 = (c: Ctx) => {
  ground(c); const x = 400, y = 1000, h = 760;
  person(c, x, y, h, reach(x, y, h, {}, [250, 650], [700, 520]));
  bundle(c, 290, 600, 1.1, 0.5); hand(c, 250, 650, h);
  for (let i = 0; i < 3; i++) peg(c, 560 + i * 60, 960, 1.2 + i * 0.3);
  bowl(c, 780, 780, 110); peg(c, 720, 600, 0.3); hand(c, 700, 520, h); arrow(c, [[730, 670], [750, 740]]);
};
// e2.2 the grown-up ties the dupatta sling, the baby snug on the girl's back
const e2s2 = (c: Ctx) => {
  ground(c); const x = 560, y = 1000, h = 760;
  bundle(c, 690, 530, 1.1, 0.35);
  person(c, x, y, h); sash(c, x, y, h);
  person(c, 220, 1000, 800, reach(220, 1000, 800, { adult: true }, [470, 450], [480, 420]));
  hand(c, 470, 450, 800, true); hand(c, 480, 420, 800, true);
};
// e2.3 both hands free: two pegs at once, the baby on her back
const e2s3 = (c: Ctx) => {
  ground(c); const x = 540, y = 1000, h = 760;
  bundle(c, 670, 530, 1.1, 0.35);
  person(c, x, y, h, reach(x, y, h, {}, [330, 560], [750, 560])); sash(c, x, y, h);
  peg(c, 330, 600, -0.2); peg(c, 750, 600, 0.2); hand(c, 330, 560, h); hand(c, 750, 560, h);
  bowl(c, 290, 820, 95); bowl(c, 790, 820, 95); arrow(c, [[310, 670], [300, 760]]); arrow(c, [[770, 670], [780, 760]]);
};
// a1.0 the grown-up sits behind the girl and parts her hair
const a1s0 = (c: Ctx) => {
  ground(c);
  person(c, 430, 900, 680, reach(430, 900, 680, { sit: true, adult: true }, [560, 650], [650, 640]));
  person(c, 600, 950, 480, { sit: true }); hand(c, 560, 650, 680, true); hand(c, 650, 640, 680, true);
};
// a1.1 swap: the girl grooms the grown-up
const a1s1 = (c: Ctx) => {
  ground(c);
  person(c, 440, 840, 600, reach(440, 840, 600, { sit: true }, [560, 575], [650, 570]));
  person(c, 600, 960, 620, { sit: true, adult: true }); hand(c, 560, 575, 600); hand(c, 650, 570, 600);
};
// a1.2 two chimpanzees grooming the same way
const a1s2 = (c: Ctx) => { ground(c); chimpGroom(c, 540, 940, 1); };
// a2.0 a bare foot curls round a handkerchief and lifts it
const a2s0 = (c: Ctx) => {
  ground(c); person(c, 330, 880, 560, { sit: true, armL: [Math.PI * 0.6, Math.PI * 0.45], armR: [Math.PI * 0.3, Math.PI * 0.6] });
  hanky(c, 650, 910, 1.1); foot(c, 480, 880, 1.1, 1); arrow(c, [[800, 920], [800, 780]]);
};
// a2.1 the toes try a pencil: it slips
const a2s1 = (c: Ctx) => {
  ground(c); person(c, 330, 880, 560, { sit: true, armL: [Math.PI * 0.6, Math.PI * 0.45], armR: [Math.PI * 0.3, Math.PI * 0.6] });
  foot(c, 480, 880, 1.1, 0.7); pencil(c, 660, 940, 240, 0.35); arrow(c, [[800, 860], [830, 980]]);
};
// a2.2 a chimpanzee's foot gripping a branch, the big toe round the other side
const a2s2 = (c: Ctx) => {
  ground(c); const [fur, , face] = FUR.chimp;
  limb(c, [[760, 60], [600, 400]], 90, fur);
  limb(c, [[520, 470], [440, 530], [450, 620]], 48, face);
  shadow(c, 560, 650, 420, 30);
  shape(c, () => rrect(c, 90, 490, 900, 120, 60), COL.brown); shade(c, () => rrect(c, 90, 490, 900, 120, 60), COL.soilDk, 0, 50, 0.5);
  shape(c, () => ell(c, 580, 460, 110, 80), face);
  for (let k = 0; k < 4; k++) { const tx = 530 + k * 44; limb(c, [[tx, 490], [tx + 12, 560], [tx + 6, 600]], 36 - k * 4, face); }
};
// a3.0 India, the North-east in green, a gibbon in Assam
const a3s0 = (c: Ctx) => {
  ground(c); paper(c, 80, 60, 920, 960);
  land(c, fit(INDIA, 190, 120, 700, 860)); shape(c, () => polyP(c, fit(NE, 190, 120, 700, 860)), COL.green, 5);
  ape(c, 820, 410, 150, "gibbonM");
};
// a3.1 a hoolock gibbon pair singing on a high branch at sunrise
const a3s1 = (c: Ctx) => {
  ground(c, COL.sky); shape(c, () => ell(c, 540, 760, 170, 170), COL.yellow);
  shape(c, () => { c.moveTo(0, 760); c.quadraticCurveTo(540, 700, 1080, 760); c.lineTo(1080, 1080); c.lineTo(0, 1080); c.closePath(); }, COL.leafDk, 5);
  limb(c, [[-20, 320], [1100, 300]], 40, COL.brown); limb(c, [[-20, 640], [1100, 620]], 56, COL.brown);
  const M = apeReach(330, 640, 520, true, [230, 330], [430, 325]), F = apeReach(730, 640, 480, true, [640, 330], [820, 325]);
  ape(c, 330, 640, 520, "gibbonM", { ...M, mouth: "sing" }); ape(c, 730, 640, 480, "gibbonF", { ...F, mouth: "sing" });
  note(c, 470, 180, 1.2); note(c, 560, 120, 1.4); note(c, 640, 200, 1.1);
};
// a3.2 call and answer: grown-up and child sing to each other
const a3s2 = (c: Ctx) => {
  ground(c); person(c, 290, 1000, 800, { adult: true }); person(c, 790, 1000, 620);
  laugh(c, 290, 1000, 800, false, "sing"); laugh(c, 790, 1000, 620, false, "sing");
  note(c, 480, 300, 1.4); note(c, 560, 220, 1.2); note(c, 640, 320, 1.4);
};
// p1.0 copying Africa and Asia from an open atlas onto a big sheet
const p1s0 = (c: Ctx) => {
  ground(c); paper(c, 100, 100, 660, 640);
  land(c, fit(AFRICA, 150, 220, 260, 480)); line(c, fit(ASIA, 430, 160, 300, 300).slice(0, 9), 5, INK);
  person(c, 880, 1000, 700, reach(880, 1000, 700, {}, [690, 370]));
  pencil(c, 700, 330, 180, -1.2); hand(c, 690, 370, 700);
  shadow(c, 420, 990, 300, 24); shape(c, () => rrect(c, 130, 780, 300, 210, 10), COL.blue); shape(c, () => rrect(c, 430, 780, 300, 210, 10), COL.blueDk);
  shape(c, () => rrect(c, 145, 792, 272, 185, 6), COL.paper, 4); shape(c, () => rrect(c, 443, 792, 272, 185, 6), COL.paper, 4);
  land(c, fit(AFRICA, 190, 810, 150, 150)); land(c, fit(ASIA, 470, 810, 220, 120));
};
// p1.1 the finished map: green forests, an ape on each, a red dot for home
const p1s1 = (c: Ctx) => { ground(c); paper(c, 60, 100, 960, 860); apeMap(c, 100, 160, 880, 740, true, true); };

// ---------------------------------------------------------------- card pictures
// flow.e1 the laugh test: the girl laughs and the flag swings away
const fE1 = (c: Ctx) => {
  ground(c); const x = 440, y = 1000, h = 800;
  person(c, x, y, h, reach(x, y, h, {}, undefined, [760, 330]));
  flag(c, 610, 330, 0.7); hand(c, 760, 330, h); laugh(c, x, y, h); arrow(c, [[590, 390], [740, 430]]);
};
// flow.e2 hands free: the baby rides in the sling, both hands up
const fE2 = (c: Ctx) => {
  ground(c); const x = 540, y = 1000, h = 800;
  bundle(c, 680, 500, 1.2, 0.35);
  person(c, x, y, h, { armL: [Math.PI * 0.85, Math.PI * 1.45], armR: [Math.PI * 0.15, Math.PI * 1.55] }); sash(c, x, y, h);
  laugh(c, x, y, h);
};
// flow.a1 grooming time: the pair of people and a pair of chimpanzees
const fA1 = (c: Ctx) => {
  ground(c); chimpGroom(c, 820, 560, 0.55);
  person(c, 330, 940, 640, reach(330, 940, 640, { sit: true, adult: true }, [450, 700], [540, 690]));
  person(c, 490, 990, 460, { sit: true }); hand(c, 450, 700, 640, true); hand(c, 540, 690, 640, true);
};
// flow.a2 toes gripping a handkerchief, close up
const fA2 = (c: Ctx) => { ground(c); shadow(c, 560, 990, 360, 28); hanky(c, 640, 930, 1.8); foot(c, 180, 900, 2, 1); arrow(c, [[940, 900], [940, 700]]); };
// flow.p1 the girl holds up her map of ape homes
const fP1 = (c: Ctx) => {
  ground(c); const x = 540, y = 1000, h = 760;
  person(c, x, y, h, reach(x, y, h, {}, [230, 470], [850, 470]));
  paper(c, 200, 440, 680, 460); apeMap(c, 230, 480, 620, 390, true, true); hand(c, 230, 470, h); hand(c, 850, 470, h);
};
// term.4 grooming: one chimpanzee parts the hair on another's back
const t4 = (c: Ctx) => { ground(c); chimpGroom(c, 540, 960, 1.15); };
// term.5 nest: an orangutan mother in her bed of bent branches, baby on her chest
const t5 = (c: Ctx) => {
  ground(c, COL.sky);
  shape(c, () => rrect(c, 470, 560, 140, 600, 30), COL.brown); shade(c, () => rrect(c, 470, 560, 140, 600, 30), COL.soilDk, 60, 0, 0.5);
  for (const [lx, ly, lr] of [[300, 300, 190], [760, 280, 200], [540, 180, 220], [180, 480, 140], [900, 470, 150]]) shape(c, () => ell(c, lx, ly, lr, lr * 0.8), COL.leaf, 6);
  shape(c, () => ell(c, 540, 600, 330, 120), COL.woodDk); shade(c, () => ell(c, 540, 600, 330, 120), COL.soilDk, 0, 50, 0.5);
  const r = rnd(3); for (let i = 0; i < 14; i++) { const ax = 240 + r() * 600, ay = 540 + r() * 110; line(c, [[ax - 60, ay + r() * 20 - 10], [ax, ay], [ax + 60, ay - r() * 20 + 10]], 7, COL.soilDk); }
  for (let i = 0; i < 10; i++) { const lx = 240 + r() * 600, ly = 520 + r() * 60; shape(c, () => ell(c, lx, ly, 34, 18, r() * 2), COL.leaf, 4); }
  const [fur, furDk, face] = FUR.orang;
  shape(c, () => ell(c, 560, 500, 230, 85), fur); shade(c, () => ell(c, 560, 500, 230, 85), furDk, 0, 35, 0.5);
  limb(c, [[700, 470], [800, 430], [850, 500]], 44, fur); limb(c, [[420, 470], [330, 520], [290, 580]], 44, fur);
  apeHead(c, 340, 455, 78, "orang");
  shape(c, () => ell(c, 600, 440, 70, 38), furDk); apeHead(c, 655, 420, 32, "orang");
};
// term.7 play face: a young chimpanzee's open, relaxed mouth
const t7 = (c: Ctx) => { ground(c); apeHead(c, 540, 520, 330, "chimp", "open"); };
// term.8 exhale: breathing out, then breathing in
const t8 = (c: Ctx) => {
  ground(c); line(c, [[540, 120], [540, 960]], 4, COL.grey);
  person(c, 290, 1000, 720); person(c, 790, 1000, 720);
  laugh(c, 290, 1000, 720, false, "sing"); laugh(c, 790, 1000, 720, false, "sing");
  const my = headOf(290, 1000, 720).hy + 94 * 0.47;
  arrow(c, [[400, my], [480, my - 30], [520, my - 90]]); arrow(c, [[400, my + 40], [500, my + 70]]);
  arrow(c, [[560, my - 90], [610, my - 30], [680, my]]); arrow(c, [[560, my + 70], [660, my + 40]]);
};
// term.1 great apes in a row: orangutan, gorilla, chimpanzee, bonobo and a woman
const t1 = (c: Ctx) => {
  ground(c); const y = 940;
  ape(c, 110, y, 420, "orang"); ape(c, 320, y, 520, "gorilla", { saddle: true }); ape(c, 530, y, 400, "chimp"); ape(c, 710, y, 370, "chimp", { slim: true });
  const x = 920, h = 600; person(c, x, y, h, { adult: true });
  shape(c, () => rrect(c, x - h * 0.16, y - h * 0.44, h * 0.32, h * 0.44, h * 0.03), COL.pink);
  shape(c, () => { c.moveTo(x + h * 0.12, y - h * 0.74); c.lineTo(x - h * 0.14, y - h * 0.48); c.lineTo(x - h * 0.14, y - h * 0.38); c.lineTo(x + h * 0.12, y - h * 0.66); c.closePath(); }, COL.pink);
};

export const ic_evolutionClosestCousinsL2 = cards("sci.evolution.closest-cousins.L2", [
  e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, e2s3, a1s0, a1s1, a1s2, a2s0, a2s1, a2s2, a3s0, a3s1, a3s2, p1s0, p1s1,
  fE1, fE2, fA1, fA2, fP1, t4, t5, t7, t8, t1,
]);
