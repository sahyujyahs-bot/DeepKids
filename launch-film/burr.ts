import { displace, fractal, Gfx, rng, type Ctx, type Env, type Medium, type P } from "./core";
import type { Film } from "./film";
import { clamp, lerp, mix, smooth } from "./gallery";
import { streakClip, streaks } from "./koiDrawKit";

// DREAM GLAZE · the burr. DeepKids Gurukul launch film, test shot 1 (the Velcro dream).
//
// IDEA: Amma and Kavya stand small on an endless golden plain before a burdock burr taller than a
// house; one of its hooks has caught Kavya's frock, and she laughs. (The burr hook is how Velcro
// was found: George de Mestral, 1941.)
// MEDIUM, physically: oil glazes laid with a soft sable on a smooth white gesso panel, the way the
// surrealist dream panels were painted. No brushmark survives inside a shape: each glaze dries
// ENAMEL-FLAT and the next sits on it with a HARD edge. Form is a stack of 3-4 flat glazes, shadow
// tone first, each lighter one a smaller crescent on the side toward the sun. Gradation happens
// only where the painter wanted it, in the sky, by laying it in ROWS, each a shade lighter, the
// joins left as faint seams.
// MARK: a flat glaze with a crisp edge; a sable row across the panel; a tapering blade.
// EDGE: hard everywhere. No line drawing: an edge is where one glaze stops and another begins.
// ORDER: sky in rows top to bottom (ultramarine to lemon), the sun left as a disc, the plain in
// rows from the horizon toward us (thin far, wide near), cast shadows, then each form far to near,
// laid in its shadow tone and worked up to the light (mid glaze, light glaze, highlight).
// PAPER: smooth gesso, a faint tooth at low opacity, nothing else.
// PALETTE: ultramarine, cobalt, pale cerulean, lemon; golden ochre to raw sienna for the plain; a
// cool violet glaze for every cast shadow; burnt umber to straw for the burr; rani pink and zari
// gold for the frock, mustard and grey for Amma, warm brown skin, blue-black hair, jasmine white.
// LIGHT: ONE low sun at the left, 4 degrees above the horizon, behind the figures: every lit edge
// faces left-up, every shadow runs toward us and right, fanning out from the sun's foot.
// SPACE: a pinhole camera 1.35 m above the plain (f = 1000 px), so every size and shadow follows
// from a world position; the burrs repeat to the horizon along two rows.
// REFERENCE (from knowledge): Arctium lappa seed head: a globe of narrow involucral bracts, each a
// stiff awl tapering to a fine hook curled back toward the head; dry heads are brown and straw,
// often with the withered purple florets still in a tuft on top. People: Kavya, 8, six heads tall;
// Amma, 38, 7.5 heads. Kavya wears a knee-length A-line frock (rani pink, gold border), two plaits
// with a string of jasmine buds, chappals. Amma: mustard T-shirt, loose grey home pants, one low
// braid, chappals. South Indian, medium-brown skin.
// NOT ITS NEIGHBOURS: midCentury (no dry brush, no off-register ink line, no board), lowPoly (curved
// forms, not facets), flatVector (rows and glaze stacks laid by hand, no vector grain).

const W = 1080, H = 1920, N = 240;
const HZ = 1380, CX = 540, F = 1000, HC = 1.35;
const SUN: P = [232, 1298], SUNR = 40;
const S3 = (() => { const v = [-0.74, -0.4, -0.38], l = Math.hypot(...v); return v.map((x) => x / l); })(); // toward the sun, screen axes, z toward us
const SXY: P = (() => { const l = Math.hypot(S3[0], S3[1]); return [S3[0] / l, S3[1] / l]; })();
// the timeline: one cue table, frames
const T = {
  sky: [2, 42], sun: [42, 50], plain: [50, 80], cast: [80, 94], far: [94, 116],
  heroDark: [116, 138], heroMid: [138, 148], heroLight: [148, 156], heroHi: [156, 162],
  figDark: [162, 174], figLight: [174, 182], figHi: [182, 188], life: [188, N],
} as const;
const C = {
  gesso: "#f4efe2", sun: "#fff8d6", sunRim: "#fbe98c",
  sky: ["#16227a", "#1c2d8c", "#25399c", "#3149aa", "#4360b8", "#5a7bc4", "#7896cb", "#9bb0cc", "#bcc6c4", "#d8d7b2", "#ece39c", "#f6e886", "#f8e37a"],
  plain: ["#efcf6c", "#e8bf55", "#dfac44", "#d49a39", "#c78631", "#b8752b", "#a86627"],
  cast: "#a08fcc",
  burr: ["#3a2316", "#6b4021", "#b47a35", "#efcb72"], floret: ["#4a2440", "#7a4068", "#a8678e"],
  skinD: "#5e3422", skinL: "#a8663e", skinH: "#d08a5a", hair: "#15100f", hairL: "#3a2c28",
  frockD: "#7c1848", frockL: "#d83e82", frockH: "#f07aa8", zari: "#e8b13a", zariD: "#9a6a1c",
  jas: "#f4f0e0", jasD: "#b9b3a0",
  teeD: "#7e5713", teeL: "#d39b26", teeH: "#f0c450", panD: "#45464f", panL: "#83848e", panH: "#a9aab2",
  chap: "#3b2418", mouth: "#2a120c",
};
const HARD: Medium = { nib: 1, taper: 0, pressure: 0, retrace: false, wobble: 0, rough: 0 };

// ---------------------------------------------------------------- helpers
const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const prog = (f: number, w: readonly [number, number] | [number, number]) => (f >= w[1] ? 1 : f <= w[0] ? 0 : (f - w[0]) / (w[1] - w[0]));
const trace = (c: Ctx, pts: P[], move = true) => { pts.forEach(([x, y], i) => (i || !move ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath(); };
const fill = (c: Ctx, pts: P[], col: string) => { c.fillStyle = col; c.beginPath(); trace(c, pts); c.fill(); };
const ell = (cx: number, cy: number, rx: number, ry: number, rot = 0, n = 28): P[] => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2, x = Math.cos(a) * rx, y = Math.sin(a) * ry; return [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)] as P; });
const shift = (pts: P[], dx: number, dy: number): P[] => pts.map(([x, y]) => [x + dx, y + dy]);
const area = (s: P[]) => Math.abs(s.reduce((a, p, i) => { const q = s[(i + 1) % s.length]; return a + p[0] * q[1] - q[0] * p[1]; }, 0) / 2);
const sm = (a: P[], closed = true, per = 6) => smooth(a, closed, per);
const rot = (p: P, o: P, a: number): P => { const c = Math.cos(a), s = Math.sin(a), x = p[0] - o[0], y = p[1] - o[1]; return [o[0] + x * c - y * s, o[1] + x * s + y * c]; };
const proj = (X: number, Z: number, Y = 0): P => [CX + (F * X) / Z, HZ + (F * (HC - Y)) / Z];
// a limb along a jointed centreline, a radius per joint
const limb = (c: P[], r: number[]): P[] => {
  const s = sm(c, false, 8), n = s.length, A: P[] = [], B: P[] = [];
  s.forEach((p, i) => { const t = i / (n - 1), seg = Math.min(r.length - 2, Math.floor(t * (r.length - 1))), f = t * (r.length - 1) - seg, rr = lerp(r[seg], r[seg + 1], f), q = s[Math.min(n - 1, i + 1)], o = s[Math.max(0, i - 1)], dx = q[0] - o[0], dy = q[1] - o[1], l = Math.hypot(dx, dy) || 1; A.push([p[0] - (dy / l) * rr, p[1] + (dx / l) * rr]); B.push([p[0] + (dy / l) * rr, p[1] - (dx / l) * rr]); });
  const cap = (p: P, q: P, rr: number, out: number): P[] => { const a = Math.atan2(p[1] - q[1], p[0] - q[0]); return [-0.5, 0, 0.5].map((k) => [p[0] + Math.cos(a + k) * rr * out, p[1] + Math.sin(a + k) * rr * out] as P); };
  return [...cap(s[0], s[1], r[0], 0.9).reverse().slice(0, 0), ...A, ...cap(s[n - 1], s[n - 2], r[r.length - 1], 1), ...[...B].reverse()];
};
// a flat glaze laid by the sable: rows across the shape, drawn in as q goes 0..1
const lay = (c: Ctx, region: () => void, bound: P[], col: string, q: number, seed: number, ang = 0.12) => {
  if (q <= 0) return;
  c.save(); c.beginPath(); region(); c.clip();
  if (q < 1) { const a = Math.sqrt(Math.max(1, area(bound))); streakClip(c, streaks([bound], clamp(a / 4, 4, 70), ang, seed, clamp(a * 1.2, 40, 900)), q); }
  c.fillStyle = col; c.fillRect(-50, -50, W + 100, H + 100); c.restore();
};
// the glaze toward the sun: the part of shape S whose neighbour d px sunward lies outside S
const rim = (c: Ctx, S: P[], d: number, col: string, q: number, seed: number, dir: P = SXY) => {
  if (q <= 0) return;
  const back = shift(S, -dir[0] * d, -dir[1] * d);
  c.save(); c.beginPath(); trace(c, S); c.clip();
  c.beginPath(); c.rect(-50, -50, W + 100, H + 100); trace(c, back); c.clip("evenodd");
  if (q < 1) { const a = Math.sqrt(Math.max(1, area(S))); streakClip(c, streaks([S], clamp(a / 4, 3, 60), 1.2, seed, clamp(a * 1.2, 30, 800)), q); }
  c.fillStyle = col; c.fillRect(-50, -50, W + 100, H + 100); c.restore();
};
// a form: shadow tone, then glazes toward the light (hard crescents), each gated by its own clock
const form = (c: Ctx, S: P[], cols: string[], q: number[], ds: number[], seed: number) => {
  if (q[0] <= 0) return;
  lay(c, () => trace(c, S), S, cols[0], q[0], seed);
  for (let k = 1; k < cols.length; k++) rim(c, S, ds[k - 1], cols[k], q[k] ?? 0, seed + k * 7);
};

// ---------------------------------------------------------------- the burr
type Spine = { b: P; t: P; w: number; nz: number; lit: number; side: number; hook: number; hr: number; seed: number };
type Burr = { c: P; r: number; spines: Spine[]; body: P[]; florets: { a: P; b: P; w: number; lit: number }[] };
const makeBurr = (c: P, r: number, seed: number, catchTo?: P): Burr => {
  const R = rng(seed), n = Math.round(clamp(r * 2.9, 50, 950)), spines: Spine[] = [];
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const z = 1 - (2 * (i + 0.5)) / n, rr = Math.sqrt(1 - z * z), th = i * ga + R() * 0.3;
    let nx = Math.cos(th) * rr, ny = Math.sin(th) * rr, nz = z;
    if (ny < -0.72 && nz > -0.3) continue; // the crown carries the florets, not hooks
    const jit = (R() - 0.5) * 0.16; nx += jit; ny += (R() - 0.5) * 0.16; const l3 = Math.hypot(nx, ny, nz); nx /= l3; ny /= l3; nz /= l3;
    const L = r * (0.22 + R() * 0.08), b: P = [c[0] + nx * r * 0.86, c[1] + ny * r * 0.86], t: P = [c[0] + nx * (r * 0.86 + L), c[1] + ny * (r * 0.86 + L)];
    const lit = nx * S3[0] + ny * S3[1] + nz * S3[2];
    spines.push({ b, t, w: r * (0.015 + R() * 0.005), nz, lit, side: R() < 0.5 ? -1 : 1, hook: 0, hr: r * (0.016 + R() * 0.006), seed: seed * 1000 + i });
  }
  if (catchTo) { // the one hook that has her frock: lower left, longer, reaching
    const dx = catchTo[0] - c[0], dy = catchTo[1] - c[1], l = Math.hypot(dx, dy), nx = dx / l, ny = dy / l;
    spines.push({ b: [c[0] + nx * r * 0.86, c[1] + ny * r * 0.86], t: catchTo, w: r * 0.022, nz: 0.35, lit: nx * S3[0] + ny * S3[1] + 0.35 * S3[2], side: 1, hook: 1, hr: r * 0.02, seed: seed * 1000 + 999 });
  }
  spines.sort((a, b) => a.nz - b.nz);
  const body = displace(ell(c[0], c[1], r * 0.9, r * 0.9, 0, 72), r * 0.05, 0.03, 2, seed + 5);
  const florets: Burr["florets"] = [];
  for (let i = 0; i < Math.round(clamp(r / 14, 3, 22)); i++) { const a = -Math.PI / 2 + (R() - 0.5) * 1.6, l = r * (0.07 + R() * 0.06), b0: P = [c[0] + Math.cos(a) * r * 0.78, c[1] + Math.sin(a) * r * 0.78]; florets.push({ a: b0, b: [b0[0] + Math.cos(a) * l, b0[1] + Math.sin(a) * l], w: r * 0.009, lit: Math.cos(a) * SXY[0] + Math.sin(a) * SXY[1] }); }
  return { c, r, spines, body, florets };
};
// a bract: a tapering blade ending in a hook curled back toward the head; q grows it base to tip
const blade = (s: Spine, q: number, tug: P = [0, 0]): { full: P[]; half: P[]; hook: P[] } => {
  const t: P = [s.t[0] + tug[0], s.t[1] + tug[1]], dx = t[0] - s.b[0], dy = t[1] - s.b[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l, nx = -uy, ny = ux;
  const L = l * q, tip: P = [s.b[0] + ux * L, s.b[1] + uy * L], w = s.w, wt = w * 0.28;
  const A: P = [s.b[0] + nx * w, s.b[1] + ny * w], B: P = [s.b[0] - nx * w, s.b[1] - ny * w], A1: P = [tip[0] + nx * wt, tip[1] + ny * wt], B1: P = [tip[0] - nx * wt, tip[1] - ny * wt];
  const sunSide = nx * SXY[0] + ny * SXY[1] > 0 ? 1 : -1;
  const half: P[] = sunSide > 0 ? [s.b, A, A1, tip] : [s.b, B, B1, tip];
  const hook: P[] = [];
  if (q >= 1) { const k = s.side, hr = s.hr, cxh = tip[0] + nx * hr * k, cyh = tip[1] + ny * hr * k, a0 = Math.atan2(tip[1] - cyh, tip[0] - cxh); for (let i = 0; i <= 8; i++) { const a = a0 + k * (i / 8) * Math.PI * 1.15, rr = hr * (1 - i * 0.03); hook.push([cxh + Math.cos(a) * rr, cyh + Math.sin(a) * rr]); } }
  return { full: [A, A1, tip, B1, B], half, hook };
};
const hookStroke = (c: Ctx, pts: P[], w: number, col: string) => { if (pts.length < 2) return; c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.stroke(); };
// draw a burr; clocks: dark (body + bracts in shadow tone, back to front), mid, light, hi
const drawBurr = (c: Ctx, B: Burr, q: { dark: number; mid: number; light: number; hi: number }, tug: P = [0, 0], glow = 1) => {
  if (q.dark <= 0) return;
  const n = B.spines.length, col = C.burr, minW = 0.7;
  const spineQ = (i: number, ph: number) => clamp(ph * 1.25 * n - i * 0.25 * 1 - (i / n) * 0.25 * n) ;
  const drawSpine = (s: Spine, i: number) => {
    const g = clamp(q.dark * 1.6 - (i / n) * 0.6) ; if (g <= 0) return;
    const bl = blade(s, ease(clamp(g * 1.3)), s.hook ? tug : [0, 0]), w = Math.max(minW, s.w);
    fill(c, bl.full, col[0]); hookStroke(c, bl.hook, Math.max(minW, w * 0.5), col[0]);
    const m = clamp(q.mid * 1.4 - (1 - (s.lit + 1) / 2) * 0.4), l = clamp(q.light * 1.4 - (1 - (s.lit + 1) / 2) * 0.4);
    if (m > 0) fill(c, bl.half, s.lit > -0.15 ? col[1] : mix(col[0], col[1], 0.42));
    if (s.lit > 0.3 && l > 0) { fill(c, bl.half, col[2]); hookStroke(c, bl.hook, Math.max(minW, w * 0.42), col[2]); }
    if (s.lit > 0.55 && q.hi > 0 && bl.hook.length) hookStroke(c, bl.hook.slice(0, Math.max(2, Math.round(9 * q.hi))), Math.max(0.6, w * 0.28), col[3]);
  };
  void spineQ;
  B.spines.forEach((s, i) => { if (s.nz < 0) drawSpine(s, i); });
  // the head of the burr: shadow tone, then three hard crescents toward the sun
  const bq = clamp(q.dark * 2.2);
  form(c, B.body, [col[0], col[1], col[2], col[3]], [bq, q.mid, q.light, q.hi], [B.r * 0.56 * glow, B.r * 0.27 * glow, B.r * 0.08 * glow], Math.round(B.r * 13));
  // the withered florets on the crown
  B.florets.forEach((f, i) => { const g = clamp(q.dark * 2 - 0.6 - i * 0.01); if (g <= 0) return; const e: P = [lerp(f.a[0], f.b[0], g), lerp(f.a[1], f.b[1], g)]; hookStroke(c, [f.a, e], Math.max(0.8, f.w), C.floret[0]); if (q.mid > 0 && f.lit > -0.2) hookStroke(c, [f.a, [lerp(f.a[0], e[0], q.mid), lerp(f.a[1], e[1], q.mid)]], Math.max(0.6, f.w * 0.55), C.floret[1]); if (q.light > 0 && f.lit > 0.4) hookStroke(c, [[lerp(f.a[0], e[0], 0.5), lerp(f.a[1], e[1], 0.5)], e], Math.max(0.5, f.w * 0.4), C.floret[2]); });
  B.spines.forEach((s, i) => { if (s.nz >= 0) drawSpine(s, i); });
};

// ---------------------------------------------------------------- the people
type Pose = { lean: number; pull: number; turn: number; laugh: number; reach: number; hem: P | null; sway: number };
type Part = { S: P[]; cols: string[]; ds: number[]; z: number };
// KAVYA, 8: six heads (head 35 px of 212). Feet at the origin, facing right toward the burr.
const kavya = (o: P, p: Pose): { parts: Part[]; lines: { pts: P[]; w: number; col: string }[]; dots: { c: P; r: number; col: string }[] } => {
  const parts: Part[] = [], lines: { pts: P[]; w: number; col: string }[] = [], dots: { c: P; r: number; col: string }[] = [];
  const X = (x: number, y: number): P => rot([o[0] + x, o[1] + y], o, p.pull * Math.min(1, -y / 60)); // she leans back from planted feet
  const hip = X(0, -104), U = (x: number, y: number): P => rot(X(x, y), hip, p.lean); // the upper body pivots at the hips
  const skin = [C.skinD, C.skinL, C.skinH], fr = [C.frockD, C.frockL, C.frockH];
  // legs (shins below the hem), the far one first
  parts.push({ S: limb([X(-4, -70), X(-6, -36), X(-7, -9)], [5.2, 3.9, 3.1]), cols: [mix(C.skinD, "#000000", 0.15), C.skinD], ds: [2], z: 0 });
  parts.push({ S: sm([X(-14, -10), X(-4, -11), X(2, -6), X(1, -2), X(-15, -2)]), cols: [C.chap, mix(C.chap, C.skinL, 0.4)], ds: [1.2], z: 0.1 });
  parts.push({ S: limb([X(4, -70), X(5, -36), X(4, -9)], [5.4, 4, 3.2]), cols: skin.slice(0, 2), ds: [2.2], z: 1 });
  parts.push({ S: sm([X(-3, -9), X(8, -10), X(17, -5), X(18, -1), X(-3, -1)]), cols: [C.chap, mix(C.chap, C.skinL, 0.4)], ds: [1.2], z: 1.1 });
  // the far arm, reaching toward the burr (reach 1) or drawn back to her chest (reach 0)
  const sh2 = U(9, -160), el2 = U(lerp(6, 22, p.reach), lerp(-140, -150, p.reach)), wr2 = U(lerp(14, 38, p.reach), lerp(-150, -160, p.reach));
  parts.push({ S: limb([sh2, el2, wr2], [3.6, 3, 2.5]), cols: [mix(C.skinD, "#000000", 0.1), C.skinD], ds: [1.6], z: 2 });
  const hd = Math.atan2(wr2[1] - el2[1], wr2[0] - el2[0]), hand = (w: P, a: number, s: number): P[] => [rot([w[0], w[1] - 2.6 * s], w, a), rot([w[0] + 7 * s, w[1] - 3.4 * s], w, a), rot([w[0] + 10 * s, w[1] - 1.6 * s], w, a), rot([w[0] + 10 * s, w[1] + 0.4 * s], w, a), rot([w[0] + 6 * s, w[1] + 2.4 * s], w, a), rot([w[0], w[1] + 2.6 * s], w, a)];
  parts.push({ S: sm(hand(wr2, hd, 1), true, 3), cols: [mix(C.skinD, "#000000", 0.1), C.skinD], ds: [1.2], z: 2.1 });
  // the frock: bodice and an A-line skirt to just above the knee; the right hem may be pulled out
  const waist = X(0, -127), hemR0 = X(30, -62);
  const hemR = p.hem ?? hemR0, ten = p.hem ? Math.hypot(hemR[0] - hemR0[0], hemR[1] - hemR0[1]) : 0;
  const skirt = sm([U(-12, -128), U(13, -128), [lerp(waist[0] + 18, hemR[0], 0.45), lerp(waist[1], hemR[1], 0.5) - ten * 0.08], hemR, X(18, -60), X(4, -58), X(-10, -60), X(-27, -63), X(-21, -96)], true, 5);
  parts.push({ S: skirt, cols: fr, ds: [5, 2], z: 3 });
  const band = sm([X(-27, -63), X(-10, -60), X(4, -58), X(18, -60), hemR, [hemR[0] - 2, hemR[1] - 6], X(18, -66), X(4, -64), X(-10, -66), X(-26, -69)], true, 3);
  parts.push({ S: band, cols: [C.zariD, C.zari], ds: [3], z: 3.1 });
  const bodice = sm([U(-11, -164), U(-2, -168), U(9, -167), U(14, -160), U(15, -140), U(13, -127), U(-12, -127), U(-14, -146)], true, 4);
  parts.push({ S: bodice, cols: fr, ds: [4, 1.6], z: 3.2 });
  // the plaits down her back, swinging, a string of jasmine at the root and along the near plait
  const hc = U(4, -192), hA = p.lean * 0.5 + p.turn * 0.1, nape = rot([hc[0] - 10, hc[1] + 9], hc, hA);
  const plait = (dx: number, len: number, sw: number): P[] => [nape, [nape[0] + dx - 3 + sw * 0.3, nape[1] + len * 0.35], [nape[0] + dx - 5 + sw * 0.7, nape[1] + len * 0.7], [nape[0] + dx - 4 + sw, nape[1] + len]];
  const pl1 = plait(4, 50, p.sway * 6), pl2 = plait(-2, 46, p.sway * 8);
  parts.push({ S: limb(pl2, [4.2, 3.6, 2.4]), cols: [C.hair, C.hairL], ds: [1.4], z: 3.3 });
  parts.push({ S: limb(pl1, [4.4, 3.8, 2.6]), cols: [C.hair, C.hairL], ds: [1.4], z: 3.4 });
  [pl1, pl2].forEach((pl) => { const s = sm(pl, false, 8); for (let i = 2; i < s.length - 3; i += 2) lines.push({ pts: [[s[i][0] - 2.6, s[i][1] - 1], [s[i][0], s[i][1] + 1.8], [s[i][0] + 2.6, s[i][1] - 1]], w: 0.9, col: C.hairL }); const e = s[s.length - 1]; dots.push({ c: [e[0], e[1] + 1], r: 2.4, col: C.frockL }); });
  // the near arm, hanging, a puff sleeve over the shoulder
  const sh = U(-3, -160), el = U(-5 - p.laugh * 2, -136), wr = U(-2 - p.laugh * 4, -113 - p.laugh * 6);
  parts.push({ S: limb([sh, el, wr], [3.8, 3.2, 2.6]), cols: skin, ds: [1.8, 0.8], z: 4 });
  const ha = Math.atan2(wr[1] - el[1], wr[0] - el[0]);
  parts.push({ S: sm(hand(wr, ha, 1), true, 3), cols: skin.slice(0, 2), ds: [1.3], z: 4.1 });
  parts.push({ S: sm([U(-12, -164), U(-4, -170), U(4, -165), U(4, -152), U(-3, -148), U(-11, -152)], true, 4), cols: fr, ds: [3.2, 1.4], z: 4.2 });
  // the head: neck, skull, face turned by p.turn (0: lost profile up at the burr, 1: back over her shoulder at Amma)
  parts.push({ S: limb([U(3, -164), U(4, -178)], [3.8, 3.6]), cols: [C.skinD, C.skinL], ds: [1.6], z: 5 });
  const tilt = lerp(-0.22, 0.12, p.turn) - p.laugh * 0.1, R = (x: number, y: number): P => rot(rot([hc[0] + x, hc[1] + y], hc, tilt), hc, hA);
  const skull = Array.from({ length: 32 }, (_, i) => { const a = (i / 32) * Math.PI * 2; return R(Math.cos(a) * 15, Math.sin(a) * 17.5); });
  const fx = lerp(1, -1, p.turn); // which way the face points along x
  const face = sm([R(fx * 3, -8), R(fx * 13, -5), R(fx * 15.5, 1), R(fx * 15, 5), R(fx * 13.5, 9), R(fx * 10, 15), R(fx * 3, 17.5), R(fx * -3, 15), R(fx * -2, 4), R(fx * -1, -6)], true, 5);
  parts.push({ S: skull, cols: [C.hair, C.hairL], ds: [2.2], z: 6 });
  parts.push({ S: face, cols: [C.skinD, C.skinL, C.skinH], ds: [3.2, 1.2], z: 6.1 });
  // the ear, just behind the face
  parts.push({ S: ell(...R(fx * -3, 3), 2.4, 3.6, 0, 12), cols: [C.skinD, C.skinL], ds: [1], z: 6.2 });
  // jasmine: a string of buds round the back of the head and down the near plait
  const jas: P[] = [R(-fx * 6, -14), R(-fx * 11, -9), R(-fx * 13, -2), R(-fx * 12.5, 5)];
  sm(jas, false, 4).forEach((q, i) => dots.push({ c: q, r: 2.1, col: i % 3 ? C.jas : C.jasD }));
  sm(pl1.slice(0, 2), false, 4).slice(1).forEach((q, i) => dots.push({ c: [q[0] + 2, q[1]], r: 1.8, col: i % 2 ? C.jas : C.jasD }));
  // the features, small and plain: brow, eye (open, or a laughing crescent), nose, mouth
  const eye = R(fx * 8.5, -1);
  if (p.laugh < 0.35) dots.push({ c: eye, r: 1.4, col: C.hair }); else lines.push({ pts: [[eye[0] - 2.4, eye[1]], [eye[0], eye[1] - 1.6], [eye[0] + 2.4, eye[1]]], w: 1.1, col: C.hair });
  lines.push({ pts: [R(fx * 6, -5.5), R(fx * 9, -6.8), R(fx * 12, -6)], w: 1, col: C.hair });
  const m = R(fx * 9, 9.5), mo = p.laugh;
  if (mo > 0.2) parts.push({ S: sm([[m[0] - 3.4, m[1] - 0.6], [m[0] + 3.4, m[1] - 0.6], [m[0] + 2.2, m[1] + 1 + mo * 2.6], [m[0] - 2.2, m[1] + 1 + mo * 2.6]], true, 3), cols: [C.mouth], ds: [], z: 6.3 });
  else lines.push({ pts: [[m[0] - 2.5, m[1]], [m[0], m[1] + 0.8], [m[0] + 2.5, m[1]]], w: 0.9, col: C.mouth });
  parts.push({ S: sm([R(fx * -2, -17.5), R(fx * 6, -16.5), R(fx * 13, -10), R(fx * 15, -6), R(fx * 8, -9), R(fx * 0, -9), R(fx * -4, -5)], true, 4), cols: [C.hair, C.hairL], ds: [1.6], z: 6.4 });
  return { parts, lines, dots };
};
// AMMA, 38: 7.5 heads (head 33 px of 250). Feet at the origin, facing right toward Kavya and the burr.
const amma = (o: P, p: Pose): ReturnType<typeof kavya> => {
  const parts: Part[] = [], lines: { pts: P[]; w: number; col: string }[] = [], dots: { c: P; r: number; col: string }[] = [];
  const X = (x: number, y: number): P => [o[0] + x, o[1] + y], hip = X(0, -122), U = (x: number, y: number): P => rot(X(x, y), hip, p.lean);
  const skin = [C.skinD, C.skinL, C.skinH], tee = [C.teeD, C.teeL, C.teeH], pan = [C.panD, C.panL, C.panH];
  // legs in loose grey pants, the far one first; chappals
  parts.push({ S: sm([X(-14, -124), X(2, -124), X(0, -60), X(-3, -8), X(-15, -8), X(-15, -62)], true, 4), cols: [mix(C.panD, "#000000", 0.2), C.panD], ds: [3], z: 0 });
  parts.push({ S: sm([X(-18, -9), X(-6, -10), X(1, -5), X(0, -1), X(-19, -1)]), cols: [C.chap, mix(C.chap, C.skinL, 0.4)], ds: [1.2], z: 0.1 });
  parts.push({ S: sm([X(-6, -124), X(13, -124), X(14, -64), X(16, -9), X(2, -9), X(0, -64)], true, 4), cols: pan, ds: [4, 1.5], z: 1 });
  parts.push({ S: sm([X(-1, -10), X(12, -11), X(22, -5), X(23, -1), X(-1, -1)]), cols: [C.chap, mix(C.chap, C.skinL, 0.4)], ds: [1.2], z: 1.1 });
  lines.push({ pts: [X(5, -118), X(6, -90), X(7, -60)], w: 0.9, col: C.panD });
  // the far arm hangs behind the body
  parts.push({ S: limb([U(9, -193), U(12, -160), U(14, -130)], [4.4, 3.6, 2.9]), cols: [mix(C.skinD, "#000000", 0.12), C.skinD], ds: [1.6], z: 1.5 });
  // the T-shirt, loose, short sleeves, hem at the hip
  const tshirt = sm([U(-12, -199), U(-3, -204), U(9, -203), U(15, -196), U(19, -178), U(17, -164), U(14, -148), U(17, -118), U(-15, -118), U(-13, -150), U(-15, -180)], true, 4);
  parts.push({ S: tshirt, cols: tee, ds: [5, 2], z: 2 });
  lines.push({ pts: [U(-15, -121), U(1, -120), U(17, -121)], w: 1, col: C.teeD });
  // the braid, low at the nape, down to the small of her back
  const hc = U(4, -233), hA = p.lean * 0.4 - p.laugh * 0.12, nape = rot([hc[0] - 9, hc[1] + 10], hc, hA);
  const br: P[] = [nape, [nape[0] - 5 + p.sway * 2, nape[1] + 30], [nape[0] - 6 + p.sway * 4, nape[1] + 62], [nape[0] - 5 + p.sway * 5, nape[1] + 86]];
  parts.push({ S: limb(br, [4.6, 4.2, 3.4, 2.2]), cols: [C.hair, C.hairL], ds: [1.5], z: 2.5 });
  { const s = sm(br, false, 8); for (let i = 2; i < s.length - 2; i += 2) lines.push({ pts: [[s[i][0] - 3, s[i][1] - 1.2], [s[i][0], s[i][1] + 2], [s[i][0] + 3, s[i][1] - 1.2]], w: 0.9, col: C.hairL }); }
  // the near arm: hanging (laugh 0) or the hand raised to her mouth (laugh 1)
  const k = ease(p.laugh), sh = U(3, -195), el = U(lerp(4, 10, k), lerp(-160, -166, k)), wr = U(lerp(7, 13, k), lerp(-128, -204, k));
  parts.push({ S: limb([U(2, -180), el, wr], [3.9, 3.3, 2.7]), cols: skin, ds: [1.8, 0.8], z: 3 });
  parts.push({ S: sm([U(-7, -200), U(2, -205), U(11, -199), U(12, -184), U(8, -172), U(-4, -173), U(-8, -186)], true, 4), cols: tee, ds: [3.4, 1.4], z: 3.1 });
  const ha = Math.atan2(wr[1] - el[1], wr[0] - el[0]), hand: P[] = [rot([wr[0], wr[1] - 3], wr, ha), rot([wr[0] + 8, wr[1] - 3.6], wr, ha), rot([wr[0] + 12, wr[1] - 1.4], wr, ha), rot([wr[0] + 11.5, wr[1] + 0.8], wr, ha), rot([wr[0] + 6, wr[1] + 3], wr, ha), rot([wr[0], wr[1] + 3], wr, ha)];
  // the head: neck, hair, face in three-quarter toward the right, tilting back as she laughs
  parts.push({ S: limb([U(2, -203), U(3, -217)], [4.2, 4]), cols: [C.skinD, C.skinL], ds: [1.6], z: 4 });
  const tilt = -0.12 - k * 0.12, R = (x: number, y: number): P => rot([hc[0] + x, hc[1] + y], hc, tilt + hA);
  parts.push({ S: Array.from({ length: 32 }, (_, i) => { const a = (i / 32) * Math.PI * 2; return R(Math.cos(a) * 13.5, Math.sin(a) * 16.5); }), cols: [C.hair, C.hairL], ds: [2], z: 5 });
  parts.push({ S: sm([R(3, -7), R(12, -4), R(14.5, 1), R(14, 5), R(12.5, 9), R(9, 14), R(3, 16.5), R(-2, 14), R(-1.5, 4), R(-1, -5)], true, 5), cols: skin, ds: [3, 1.1], z: 5.1 });
  parts.push({ S: ell(...R(-2.6, 3), 2.2, 3.4, 0, 12), cols: [C.skinD, C.skinL], ds: [1], z: 5.2 });
  parts.push({ S: sm([R(-3, -16.5), R(6, -15.5), R(12, -9), R(13.5, -5), R(6, -8.5), R(-1, -8), R(-4, -4)], true, 4), cols: [C.hair, C.hairL], ds: [1.6], z: 5.3 });
  const eye = R(8, -1);
  if (k < 0.4) dots.push({ c: eye, r: 1.3, col: C.hair }); else lines.push({ pts: [[eye[0] - 2.2, eye[1]], [eye[0], eye[1] - 1.4], [eye[0] + 2.2, eye[1]]], w: 1, col: C.hair });
  lines.push({ pts: [R(5.5, -5), R(8.5, -6.2), R(11.5, -5.4)], w: 1, col: C.hair });
  const m = R(9, 9);
  lines.push({ pts: [[m[0] - 2.4, m[1]], [m[0], m[1] + 0.6 + k * 0.8], [m[0] + 2.4, m[1]]], w: 0.9, col: C.mouth });
  dots.push({ c: R(10.5, -2.5), r: 0.9, col: "#b0302a" }); // the bindi between the brows, small
  parts.push({ S: sm(hand, true, 3), cols: skin.slice(0, 2), ds: [1.3], z: 6 }); // the hand comes in front of the chin when she laughs
  return { parts, lines, dots };
};
const drawFigure = (c: Ctx, fig: ReturnType<typeof kavya>, q: { dark: number; light: number; hi: number }, seed: number) => {
  if (q.dark <= 0) return;
  fig.parts.sort((a, b) => a.z - b.z).forEach((pt, i) => { const qs = [clamp(q.dark * 1.5 - i * 0.02), q.light, q.hi]; form(c, pt.S, pt.cols, qs, pt.ds, seed + i * 3); });
  if (q.hi > 0) { fig.lines.forEach((l) => hookStroke(c, l.pts, l.w, l.col)); fig.dots.forEach((d) => { fill(c, ell(d.c[0], d.c[1], d.r, d.r, 0, 10), d.col); }); }
};

// ---------------------------------------------------------------- the world
type Far = { b: Burr; X: number; Z: number };
type Scene = { hero: Burr; far: Far[]; hook: P; sky: P[][]; plain: { pts: P[]; col: string }[] };
const KAV: P = [522, 1605], AMM: P = [338, 1594];
const HERO = { X: 2.1, Z: 7.5, R: 2.4 };
const SHD = (() => { const a = Math.atan((SUN[0] - CX) / F); return [-Math.sin(a), -Math.cos(a)] as [number, number]; })(); // shadows run away from the sun's foot, toward us
const toWorld = (p: P): { X: number; Z: number } => { const Z = (F * HC) / (p[1] - HZ); return { X: ((p[0] - CX) * Z) / F, Z }; };
const buildScene = (): Scene => {
  const hookTip: P = [KAV[0] + 31, KAV[1] - 63];
  const hero = makeBurr(proj(HERO.X, HERO.Z, HERO.R), (F * HERO.R) / HERO.Z, 77, hookTip);
  // the burrs repeat to the horizon: a long row from the near left into the light, a short one between the people and the giant
  const far: Far[] = [], r = rng(31);
  // two rows into the sun: each burr ~1.85x as far as the last, on a line whose vanishing point is the sun's foot
  const row = (X0: number, Z0: number, n: number, seed: number) => { const k = (SUN[0] - CX) / F; let Z = Z0; for (let i = 0; i < n; i++) { const X = X0 + k * (Z - Z0), R = 2.4 * (0.9 + r() * 0.2); far.push({ X, Z, b: makeBurr(proj(X, Z, R), (F * R) / Z, seed + i) }); Z *= 1.85 + r() * 0.1; } };
  row(-10.5, 15, 9, 100);
  row(-24, 30, 9, 200);
  far.sort((a, b) => b.Z - a.Z);
  // the sky in rows, top to bottom; the plain in rows from the horizon to us (thin far, wide near)
  const rows = 40, sky: P[][] = [];
  for (let i = 0; i < rows; i++) { const y0 = (HZ * i) / rows - 1.5, y1 = (HZ * (i + 1)) / rows + 1.5; const e = (y: number, s: number): P[] => Array.from({ length: 13 }, (_, k) => [-20 + (k * (W + 40)) / 12, y + (fractal(s, k * 0.7, i, 1, 1, 2) - 0.5) * 2.4] as P); sky.push([...e(y0, 40 + i), ...e(y1, 41 + i).reverse()]); }
  const plain: Scene["plain"] = [], prow = 18;
  for (let i = 0; i < prow; i++) { const a = i / prow, b = (i + 1) / prow, y0 = HZ - 1 + (H - HZ + 40) * a * a, y1 = HZ + (H - HZ + 40) * b * b + 1, t = (i + 0.5) / prow; const ci = t * (C.plain.length - 1), col = mix(C.plain[Math.floor(ci)], C.plain[Math.min(C.plain.length - 1, Math.floor(ci) + 1)], ci - Math.floor(ci)); plain.push({ pts: [[-20, y0], [W + 20, y0 - 1], [W + 20, y1], [-20, y1 + 1]], col }); }
  return { hero, far, hook: hookTip, sky, plain };
};
// a cast shadow on the plain: the footprint swept away from the sun along the ground, toward us; q grows it
const castShadow = (X: number, Z: number, halfW: number, len: number, q: number): P[] => {
  const [dx, dz] = SHD, nx = -dz, nz = dx, pts: P[] = [], back: P[] = [], L = Math.min(len, (Z - 0.9) / -dz) * q;
  for (let i = 0; i <= 16; i++) { const t = (i / 16) * L, w = halfW * (1 + (t / len) * 0.25), cx = X + dx * t, cz = Z + dz * t; pts.push(proj(cx + nx * w, cz + nz * w)); back.push(proj(cx - nx * w, cz - nz * w)); }
  return [...pts, ...back.reverse()];
};
const mixRows = (stops: string[], t: number) => { const ci = t * (stops.length - 1), i = Math.floor(ci); return mix(stops[i], stops[Math.min(stops.length - 1, i + 1)], ci - i); };

export const drawBurrShot = (ctx: Ctx, f: number, env: Env) => {
  const key = "burr:scene"; let sc = env.cache.get(key) as Scene | undefined; if (!sc) { sc = buildScene(); env.cache.set(key, sc); }
  const g = new Gfx(ctx, env, 0, HARD);
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  ctx.fillStyle = C.gesso; ctx.fillRect(0, 0, W, H);                                   // the bare gesso panel
  // 1. the sky in rows, each a sable stroke across the panel, alternating direction
  const qs = prog(f, T.sky), nr = sc.sky.length;
  sc.sky.forEach((row, i) => { const q = clamp(qs * (nr + 2) - i * 1.05); if (q <= 0) return; const y0 = (HZ * i) / nr, y1 = (HZ * (i + 1)) / nr, gr = ctx.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, mixRows(C.sky, i / nr)); gr.addColorStop(1, mixRows(C.sky, (i + 1) / nr)); const col = gr as unknown as string, e = ease(q), x0 = i % 2 ? W + 30 - (W + 60) * e : -30, x1 = i % 2 ? W + 30 : -30 + (W + 60) * e; ctx.save(); ctx.beginPath(); ctx.rect(Math.min(x0, x1), 0, Math.abs(x1 - x0), H); ctx.clip(); fill(ctx, row, col); ctx.globalAlpha = 0.07; fill(ctx, [[-20, y1 - 1.2], [W + 20, y1 - 1.2], [W + 20, y1 + 1.2], [-20, y1 + 1.2]], C.sky[0]); ctx.restore(); });
  // 2. the sun, left as a disc of near-white inside a lemon ring, swept round
  const qn = prog(f, T.sun);
  if (qn > 0) { ctx.save(); ctx.beginPath(); ctx.moveTo(SUN[0], SUN[1]); ctx.arc(SUN[0], SUN[1], SUNR * 1.4, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ease(qn)); ctx.closePath(); ctx.clip(); fill(ctx, ell(SUN[0], SUN[1], SUNR, SUNR, 0, 48), C.sunRim); fill(ctx, ell(SUN[0] + 1.5, SUN[1] - 1, SUNR * 0.84, SUNR * 0.84, 0, 48), C.sun); ctx.restore(); }
  // 3. the plain, rows from the horizon toward us
  const qp = prog(f, T.plain), np = sc.plain.length;
  sc.plain.forEach((row, i) => { const q = clamp(qp * (np + 1) - i); if (q <= 0) return; const e = ease(q); ctx.save(); ctx.beginPath(); i % 2 ? ctx.rect(W + 30 - (W + 60) * e, 0, (W + 60) * e, H) : ctx.rect(-30, 0, (W + 60) * e, H); ctx.clip(); fill(ctx, row.pts, row.col); ctx.restore(); });
  // 4. cast shadows: ONE violet glaze (their overlaps do not darken), swept out from every foot toward us
  const qc = prog(f, T.cast);
  if (qc > 0) {
    const a = toWorld(AMM), k = toWorld(KAV), sh: P[][] = [];
    sc.far.forEach((b, i) => { const q = clamp(qc * 1.6 - (i / sc!.far.length) * 0.6); if (q > 0) sh.push(castShadow(b.X, b.Z, 2.0, 70, ease(q))); });
    sh.push(castShadow(HERO.X, HERO.Z, 2.1, 60, ease(clamp(qc * 1.6 - 0.3))));
    const fq = ease(clamp(qc * 1.6 - 0.5)); if (fq > 0) { sh.push(castShadow(a.X, a.Z, 0.13, 30, fq)); sh.push(castShadow(k.X, k.Z, 0.11, 30, fq)); }
    ctx.save(); ctx.beginPath(); ctx.rect(-10, HZ, W + 20, H - HZ + 10); ctx.clip(); ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = C.cast; ctx.beginPath(); sh.forEach((s) => { ctx.moveTo(s[0][0], s[0][1]); trace(ctx, s, false); }); ctx.fill("nonzero"); ctx.restore();
  }
  // 5. the far burrs, far to near, each laid dark and worked to the light
  const qf = prog(f, T.far);
  sc.far.forEach((b, i) => { const k = i / sc!.far.length, q = clamp(qf * 2 - k); if (q <= 0) return; drawBurr(ctx, b.b, { dark: clamp(q * 2), mid: clamp(q * 2 - 0.5), light: clamp(q * 2 - 0.8), hi: clamp(q * 2 - 1) }, [0, 0], 1.35); });
  // 6. the giant burr; in the last stretch its one hook tugs at the frock
  const ql = prog(f, T.life), tugK = ql > 0 ? ease(clamp(ql * 2.2)) * (1 + 0.3 * Math.sin(ql * Math.PI * 5)) : 0;
  const tug: P = [-3 * tugK, 1 * tugK], hq = { dark: prog(f, T.heroDark), mid: prog(f, T.heroMid), light: prog(f, T.heroLight), hi: prog(f, T.heroHi) };
  drawBurr(ctx, sc.hero, hq, tug);
  // 7. the people, laid dark and worked to the light; then a little life
  const lq = ease(clamp(ql * 1.8)), wob = Math.sin(ql * Math.PI * 5) * clamp(ql * 3);
  const kp: Pose = { lean: -0.14 * lq - 0.03 * wob, pull: -0.07 * lq - 0.02 * wob, turn: ease(clamp((ql - 0.1) * 2.5)), laugh: ease(clamp((ql - 0.2) * 3)) * (0.85 + 0.15 * Math.sin(ql * Math.PI * 9)), reach: 1 - ease(clamp(ql * 2.5)), hem: [sc.hook[0] + tug[0], sc.hook[1] + tug[1]], sway: -lq * 0.8 + wob * 0.6 };
  const ap: Pose = { pull: 0, lean: -0.04 * ease(clamp((ql - 0.35) * 3)), turn: 0, laugh: ease(clamp((ql - 0.3) * 2.6)), reach: 0, hem: null, sway: Math.sin(ql * Math.PI * 3) * clamp((ql - 0.3) * 3) };
  const fq = { dark: prog(f, T.figDark), light: prog(f, T.figLight), hi: prog(f, T.figHi) };
  drawFigure(ctx, amma(AMM, ap), fq, 500);
  drawFigure(ctx, kavya(KAV, kp), { dark: clamp(fq.dark * 1.3 - 0.1), light: fq.light, hi: fq.hi }, 600);
  // the hook lies OVER the cloth it has caught
  const cs = sc.hero.spines.find((s) => s.hook);
  if (cs && fq.dark > 0 && hq.dark >= 1) { const bl = blade(cs, 1, tug), wd = Math.max(0.7, cs.w); hookStroke(ctx, bl.hook, wd * 0.5, C.burr[0]); if (hq.light > 0) hookStroke(ctx, bl.hook.slice(0, 5), wd * 0.38, C.burr[2]); }
  g.paper("paper", 0.05);                                                                 // the gesso's faint tooth
};

export const STYLE = { id: "dreamGlaze", name: "Dream glaze", family: "surrealist dream panel", medium: "enamel-flat oil glazes on smooth gesso, hard edges, the sky in rows, forms stacked shadow tone to light under one low sun", nearest: "midCentury", hero: "a giant burdock burr on an endless plain, its hook catching a girl's frock" };

export const burr: Film = {
  meta: { title: "DeepKids Gurukul · the burr (Dream glaze)", W, H, fps: 30, bpm: 60, durationFrames: N, kind: "drawing", raster: "cpu", poster: N - 1 },
  assets: { images: {} },
  shots: [{ id: "burr", start: 0, end: N, draw: drawBurrShot }],
};
