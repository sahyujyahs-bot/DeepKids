import { displace, fractal, Gfx, rng, type Ctx, type Env, type Medium, type P } from "./core";
import { clamp, smooth } from "./gallery";

// GOUACHE KIT for the DeepKids Gurukul launch film, in the Mid-century gouache hand
// (midCentury.ts): flat opaque shapes with a brushed edge, dry brush dragged over the flats, and a
// loose ink line printed on its own plate, OFF REGISTER. The film's one addition is the DREAM: the
// line plate slips its registration and boils, the flats breathe, as if the picture is not sure it
// is awake. `dream` 0 = the real flat (still as a printed page), 1 = full dream.

export type Sh = { pts: P[]; col: string; z?: number; ink?: number }; // ink: outline weight in the watercolour renderer (0 = no outline)
export type Dry = { path: P[]; w: number; col: string; seed: number };
export type Ln = { pts: P[]; w: number; col: string; seed: number; closed?: boolean };
export type Plate = { shapes: Sh[]; dry: Dry[]; lines: Ln[]; ops: ("s" | "d")[] };
export const BRUSH: Medium = { nib: 1.15, taper: 1, pressure: 0.85, retrace: false, wobble: 1.4, rough: 0.35 };

const dens = (s: P[], closed = true): P[] => { const o = (closed ? s : s.slice(0, -1)).flatMap((a, i) => { const b = s[(i + 1) % s.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 4)); return Array.from({ length: n }, (_, k) => [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n] as P); }); if (!closed) o.push(s[s.length - 1]); return o; };
export const plate = () => {
  const shapes: Sh[] = [], dry: Dry[] = [], lines: Ln[] = [], ops: ("s" | "d")[] = [];
  return {
    shapes, dry, lines, ops,
    S: (pts: P[], col: string, ink?: number) => { shapes.push({ pts, col, ink }); ops.push("s"); },
    // a closed outline is densified and closed by hand, so the pen's spline never overshoots a corner
    L: (pts: P[], w = 2, col = "#1d1a17", closed = false) => { const q = closed ? dens([...pts, pts[0]], false) : pts; lines.push({ pts: q, w, col, seed: 300 + lines.length }); },
    D: (path: P[], w: number, col: string) => { dry.push({ path, w, col, seed: 700 + dry.length }); ops.push("d"); },
  };
};

export const sm = (a: P[], closed = true, per = 6) => smooth(a, closed, per);
export const area = (s: P[]) => Math.abs(s.reduce((a, p, i) => { const q = s[(i + 1) % s.length]; return a + p[0] * q[1] - q[0] * p[1]; }, 0) / 2);
export const ell = (cx: number, cy: number, rx: number, ry: number, rot = 0, n = 24): P[] => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2, x = Math.cos(a) * rx, y = Math.sin(a) * ry; return [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)] as P; });
export const quad = (a: P, b: P, c: P, d: P): P[] => [a, b, c, d];
export const lerpP = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
// a limb on a jointed centreline: radius per joint
export const limb = (c: P[], r: number[], per = 10): { poly: P[]; a: P[]; b: P[] } => {
  const s = sm(c, false, per), n = s.length, A: P[] = [], B: P[] = [];
  s.forEach((p, i) => { const t = i / (n - 1), seg = Math.min(r.length - 2, Math.floor(t * (r.length - 1))), f = t * (r.length - 1) - seg, rr = r[seg] + (r[seg + 1] - r[seg]) * f, q = s[Math.min(n - 1, i + 1)], o = s[Math.max(0, i - 1)], dx = q[0] - o[0], dy = q[1] - o[1], l = Math.hypot(dx, dy) || 1; A.push([p[0] - (dy / l) * rr, p[1] + (dx / l) * rr]); B.push([p[0] + (dy / l) * rr, p[1] - (dx / l) * rr]); });
  return { poly: [...A, ...[...B].reverse()], a: A, b: B };
};
// a local frame: origin, rotation, scale; maps (u, v) to the page
export const frame = (o: P, a: number, s = 1) => (u: number, v: number): P => [o[0] + (u * Math.cos(a) - v * Math.sin(a)) * s, o[1] + (u * Math.sin(a) + v * Math.cos(a)) * s];

// the gouache edge: a slightly ragged boundary sized to the shape; in the dream it breathes
export const edge = (pts: P[], i: number, dream = 0, f = 0): P[] => { const a = Math.sqrt(area(pts)), amp = clamp(a * 0.011, 0.3, 2.6); const e = displace(dens(pts), amp, 0.11, 2, 40 + i); if (dream <= 0) return e; const ph = f * 0.06, k = dream * clamp(a * 0.02, 1, 7); return e.map(([x, y]) => [x + (fractal(90 + i, x * 0.01 + ph, y * 0.01, 1, 1, 2) - 0.5) * k * 2, y + (fractal(91 + i, x * 0.01, y * 0.01 + ph, 1, 1, 2) - 0.5) * k * 2] as P); };
export const trace = (c: Ctx, pts: P[]) => { c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath(); };
// dry brush: bristles side by side, each broken where it skips the board's tooth
export const dryBrush = (c: Ctx, d: Dry, q = 1) => {
  const [a, b] = [d.path[0], d.path[d.path.length - 1]], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, nb = Math.max(5, Math.round(d.w / 2.2)), steps = Math.max(6, Math.round(l / 3)), r = rng(d.seed);
  c.strokeStyle = d.col; c.lineWidth = 1.7; c.lineCap = "round"; c.globalAlpha = 0.55; c.beginPath();
  for (let k = 0; k < nb; k++) {
    const v = (k / (nb - 1) - 0.5) * d.w + (r() - 0.5) * 1.2, start = r() * 0.08, dn = 0.2 + r() * 0.14; let on = false;
    for (let j = 0; j <= steps * q; j++) {
      const t = j / steps; if (t < start) continue;
      const skip = fractal(d.seed + k, t * l * 0.35, k * 3.1, 1, 1, 2) < dn + t * 0.35, x = a[0] + dx * t + nx * v, y = a[1] + dy * t + ny * v;
      if (skip) { on = false; continue; } if (!on) { c.moveTo(x, y); on = true; } else c.lineTo(x, y);
    }
  }
  c.stroke(); c.globalAlpha = 1;
};
// draw a plate: flats in order, dry brush, then the line plate off register (and adrift in a dream)
export type Cam = { x: number; y: number; s: number }; // page = (x, y) + p * s
export const camSet = (ctx: Ctx, env: Env, c: Cam) => ctx.setTransform(env.scale * c.s, 0, 0, env.scale * c.s, env.scale * c.x, env.scale * c.y);
export const drawPlate = (ctx: Ctx, env: Env, pl: Plate, key: string, o: { f?: number; dream?: number; reg?: P; between?: () => void; cam?: Cam } = {}) => {
  const f = o.f ?? 0, dream = o.dream ?? 0, cam = o.cam ?? { x: 0, y: 0, s: 1 };
  camSet(ctx, env, cam);
  let E: P[][];
  if (dream > 0) E = pl.shapes.map((s, i) => edge(s.pts, i, dream, f));
  else { let c = env.cache.get(key) as P[][] | undefined; if (!c) { c = pl.shapes.map((s, i) => edge(s.pts, i)); env.cache.set(key, c); } E = c; }
  let si = 0, di = 0;
  pl.ops.forEach((op) => { if (op === "s") { const i = si++; ctx.fillStyle = pl.shapes[i].col; trace(ctx, E[i]); ctx.fill(); } else dryBrush(ctx, pl.dry[di++]); });
  o.between?.(); camSet(ctx, env, cam);
  const reg = o.reg ?? [5, -4], slip = dream * 14, sx = reg[0] + Math.sin(f * 0.07) * slip, sy = reg[1] + Math.cos(f * 0.053) * slip * 0.7;
  const g = new Gfx(ctx, env, Math.round(f * dream), BRUSH);
  g.push(cam.x, cam.y, cam.s); g.push(sx, sy, 1); g.group("plain", () => pl.lines.forEach((l) => g.pen(l.pts, { w: l.w, color: l.col, seed: l.seed, wobble: 0.9 + dream * 2.5, boil: dream > 0 ? dream * 1.6 : 0, opacity: 0.92 }))); g.pop(); g.pop();
};
