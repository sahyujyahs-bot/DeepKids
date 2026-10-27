import type { P } from "./core";
import { clamp, lerp } from "./gallery";
import { head, K, type Face } from "./cast";
import { ell, limb, sm, type plate } from "./gouache";

// CLOSE SHOTS of the cast: Amma and Kavya from the waist up, the same heads as cast.ts at any
// size, arms that REACH: give each hand a target and the elbow is solved (two-bone IK, the elbow
// bending only the way an elbow bends), and hands drawn with a palm, four fingers in length order
// (middle > ring >= index > little) on a knuckle arc, and a thumb from the wrist.
// Units are the cast's (Amma's head 95, Kavya's 92) times s; the origin is the base of the neck.

type Pl = ReturnType<typeof plate>;
export type HandKind = "open" | "pinch" | "hold" | "point" | "fist" | "flat" | "cup";
export type Reach = { to: P; kind?: HandKind; turn?: number; bend?: 1 | -1 };   // `to`: the wrist on the page; turn: the hand's angle offset
export type Bust = { x: number; y: number; s: number; flip?: 1 | -1; face?: Face; look?: number; tilt?: number; near?: Reach; far?: Reach; bob?: number };

// two-bone IK: shoulder S, wrist target T, bone lengths a and b; `side` picks which way the elbow goes
export const ik = (S: P, T: P, a: number, b: number, side: number): P => {
  const dx = T[0] - S[0], dy = T[1] - S[1], d = clamp(Math.hypot(dx, dy), Math.abs(a - b) + 1, a + b - 0.5), ang = Math.atan2(dy, dx);
  const c = clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1), off = Math.acos(c) * side;
  return [S[0] + Math.cos(ang + off) * a, S[1] + Math.sin(ang + off) * a];
};

// a hand on the page at the wrist w, pointing along `dir`, `len` long (wrist to middle fingertip)
export const drawHand = (pl: Pl, w: P, dir: number, len: number, kind: HandKind, col: string, colD: string, mirror = 1) => {
  const { S, L } = pl;
  const F = (u: number, v: number): P => [w[0] + Math.cos(dir) * u - Math.sin(dir) * v * mirror, w[1] + Math.sin(dir) * u + Math.cos(dir) * v * mirror];
  const pl0 = len * 0.46, pw = len * 0.42;
  // per finger: knuckle offset across the palm, length, curl (0 straight .. 1 tight)
  const curl = { open: [0.1, 0.1, 0.12, 0.15], flat: [0, 0, 0, 0], pinch: [0.35, 0.55, 0.65, 0.7], hold: [0.6, 0.6, 0.65, 0.7], point: [0, 0.85, 0.9, 0.9], fist: [0.95, 0.95, 0.95, 0.95], cup: [0.35, 0.35, 0.4, 0.45] }[kind];
  const fv = [-0.36, -0.12, 0.12, 0.35], fl = [0.42, 0.5, 0.46, 0.36], kx = [0.98, 1.02, 1.0, 0.93];
  S(sm([F(0, -pw * 0.42), F(pl0 * 0.6, -pw * 0.55), F(pl0, -pw * 0.5), F(pl0 * 1.02, 0), F(pl0, pw * 0.52), F(pl0 * 0.5, pw * 0.5), F(0, pw * 0.4)], true, 3), col);
  fv.forEach((v, i) => {
    const l = len * fl[i], c = curl[i], base: P = [pl0 * kx[i], v * pw];
    // three phalanges: each bends by the curl; seen from above a curled finger foreshortens
    const a1 = c * 0.9, a2 = c * 1.5, l1 = l * 0.45, l2 = l * 0.3, l3 = l * 0.25;
    const j1: P = [base[0] + Math.cos(a1) * l1 * (1 - c * 0.35), base[1] + v * 4], j2: P = [j1[0] + Math.cos(a1 + a2 * 0.5) * l2 * (1 - c * 0.5), j1[1] + Math.sin(a1 + a2 * 0.5) * l2 * 0.4], j3: P = [j2[0] + Math.cos(a1 + a2) * l3 * (1 - c * 0.6), j2[1] + Math.sin(a1 + a2) * l3 * 0.4];
    const r = len * 0.068 * (i === 3 ? 0.85 : 1);
    S(limb([F(...base), F(...j1), F(...j2), F(...j3)], [r * 1.05, r, r * 0.92, r * 0.8], 3).poly, i % 2 ? col : col);
    if (c < 0.5) S(ell(...F(j3[0] - l3 * 0.12, j3[1]), r * 0.55, r * 0.45, dir), "#e2b18f");          // the nail, where it shows
    L([F(...j1), F(j1[0] + 1, j1[1] + r * 0.6)], 0.9);
  });
  // the thumb from the wrist, with its fleshy root
  const tc = kind === "pinch" ? 0.75 : kind === "fist" || kind === "hold" ? 0.6 : kind === "point" ? 0.5 : 0.15;
  const t0: P = [len * 0.1, -pw * 0.4], t1: P = [len * 0.34, -pw * (0.7 - tc * 0.1)], t2: P = [len * (0.55 + tc * 0.1), -pw * (0.78 - tc * 0.45)];
  S(limb([F(...t0), F(...t1), F(...t2)], [len * 0.1, len * 0.08, len * 0.065], 4).poly, col);
  L([F(len * 0.12, -pw * 0.22), F(len * 0.3, -pw * 0.42)], 0.9, colD);
  L([F(pl0 * 0.98, -pw * 0.5), F(pl0 * 1.03, 0), F(pl0 * 0.98, pw * 0.5)], 1.1);
  return F;
};

const arm = (pl: Pl, M: (x: number, y: number) => P, sh: P, r: Reach | undefined, ua: number, fa: number, hl: number, s: number, fl: number, col: string, colD: string, rad: [number, number, number], rest: P) => {
  const S0 = M(...sh), T = r ? r.to : M(...rest), el = ik(S0, T, ua * s, fa * s, (r?.bend ?? 1) * fl), dir = Math.atan2(T[1] - el[1], T[0] - el[0]) + (r?.turn ?? 0);
  pl.S(limb([S0, el, T], [rad[0] * s, rad[1] * s, rad[2] * s], 6).poly, col);
  drawHand(pl, T, dir, hl * s, r?.kind ?? "open", col, colD, fl);
  return { el, T };
};

export const ammaBust = (pl: Pl, b: Bust) => {
  const { S, L } = pl, fl = b.flip ?? 1, s = b.s, bob = b.bob ?? 0, tilt = b.tilt ?? 0;
  const M = (x: number, y: number): P => { const c = Math.cos(tilt), sn = Math.sin(tilt), xx = x * c - y * sn, yy = x * sn + y * c; return [b.x + fl * xx * s, b.y + (yy - bob) * s]; };
  // the far arm first, behind the body
  arm(pl, M, [-56, 18], b.far, 130, 102, 75, s, fl, K.skinD, "#74432a", [19, 16, 13], [-70, 240]);
  // torso: blouse, the waist, the saree skirt top, the pallu across the chest with its border
  S(sm([M(-66, 4), M(-30, -6), M(30, -8), M(70, 6), M(78, 80), M(70, 150), M(-70, 150), M(-78, 80)], true, 4), K.blouse);
  S(sm([M(-62, 150), M(64, 150), M(66, 176), M(-64, 176)], true, 2), K.skin);
  S(sm([M(-80, 176), M(80, 176), M(90, 360), M(-90, 360)], true, 3), K.saree);
  S(sm([M(30, -8), M(70, 6), M(84, 90), M(70, 200), M(-20, 250), M(-60, 210), M(-10, 120)], true, 4), K.saree);
  S(sm([M(30, -8), M(48, -6), M(4, 128), M(-56, 214), M(-66, 200), M(-10, 118)], true, 3), K.border);
  [[46, 30, 64, 150], [20, 60, 30, 200]].forEach(([a, c, d, e]) => L([M(a, c), M(d, e)], 1.3));
  // the neck and the head; then the near arm over the body
  S(sm([M(-14, -40), M(18, -42), M(22, 0), M(-16, 2)], true, 2), K.skinD);
  head(S, L, M, [6, -78], 95, b.face ?? "calm", "amma", (b.look ?? 0) * fl, s);
  const a = arm(pl, M, [52, 16], b.near, 130, 102, 75, s, fl, K.skin, K.skinD, [20, 17, 13.5], [70, 250]);
  S(sm([M(34, 2), M(74, 4), M(86, 46), M(66, 62), M(40, 50)], true, 3), K.blouse);                           // the sleeve
  [0.1, 0.18].forEach((t) => { const q: P = [lerp(a.T[0], a.el[0], t), lerp(a.T[1], a.el[1], t)], d = Math.atan2(a.el[1] - a.T[1], a.el[0] - a.T[0]) + Math.PI / 2; L([[q[0] - Math.cos(d) * 14 * s, q[1] - Math.sin(d) * 14 * s], [q[0] + Math.cos(d) * 14 * s, q[1] + Math.sin(d) * 14 * s]], 2.4, K.gold); });
  return M;
};

export const kavyaBust = (pl: Pl, b: Bust) => {
  const { S, L } = pl, fl = b.flip ?? 1, s = b.s, bob = b.bob ?? 0, tilt = b.tilt ?? 0;
  const M = (x: number, y: number): P => { const c = Math.cos(tilt), sn = Math.sin(tilt), xx = x * c - y * sn, yy = x * sn + y * c; return [b.x + fl * xx * s, b.y + (yy - bob) * s]; };
  // plaits behind the far shoulder
  const plait = (dx: number) => { const pts: P[] = [M(-34 + dx, -84), M(-50 + dx, -30), M(-54 + dx, 40), M(-50 + dx, 110)]; S(limb(pts, [11 * s, 10 * s, 8 * s, 6 * s], 4).poly, K.hair); for (let i = 0; i < 7; i++) { const q = M(-46 + dx - i, -60 + i * 24); L([[q[0] - 6 * s, q[1] - 2], [q[0], q[1] + 4 * s], [q[0] + 6 * s, q[1] - 2]], 1.1, K.hairL); } S(ell(...M(-50 + dx, 118), 9 * s, 7 * s), K.ribbon); };
  plait(-8);
  arm(pl, M, [-44, 16], b.far, 103, 81, 60, s, fl, K.skinD, "#74432a", [14, 12, 10], [-56, 200]);
  // the frock: bodice, a gathered skirt, puff sleeves, a gold band at the yoke
  S(sm([M(-52, 4), M(-20, -6), M(22, -6), M(54, 4), M(60, 120), M(84, 300), M(-84, 300), M(-60, 120)], true, 4), K.frock);
  S(sm([M(-52, 4), M(-20, -6), M(-6, 120), M(-40, 300), M(-84, 300), M(-60, 120)], true, 3), K.frockD);
  S(sm([M(-30, -4), M(30, -4), M(26, 14), M(-26, 14)], true, 2), K.border);
  [[-20, 140, -30, 290], [20, 140, 34, 290]].forEach(([a, c, d, e]) => L([M(a, c), M(d, e)], 1.3));
  S(sm([M(-12, -38), M(14, -38), M(16, -2), M(-14, -2)], true, 2), K.skinD);
  head(S, L, M, [6, -72], 92, b.face ?? "calm", "kavya", (b.look ?? 0) * fl, s);
  for (let i = 0; i < 6; i++) { const q = M(-40 - i * 2, -122 + i * 10); S(ell(q[0], q[1], 5 * s, 4 * s), i % 2 ? K.jas : K.jasD); }
  plait(8);
  arm(pl, M, [40, 16], b.near, 103, 81, 60, s, fl, K.skin, K.skinD, [15, 12.5, 10], [56, 200]);
  S(ell(...M(40, 16), 30 * s, 24 * s), K.frock); L([M(14, 34), M(40, 40), M(64, 32)], 1.3);       // the puff sleeve
  return M;
};
