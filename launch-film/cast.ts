import type { P } from "./core";
import { clamp, lerp, mix } from "./gallery";
import { ell, limb, sm, type plate } from "./gouache";

// THE CAST of the DeepKids Gurukul film, in the gouache hand: one module, every shot poses it.
// AMMA, 38: 7.4 heads (head 95 of 700 at s = 1). Teal cotton saree with a mustard-gold border, the
// pallu over her left shoulder, a teal blouse, a loose bun, a small maroon bindi, a gold stud,
// thin gold bangles. KAVYA, 8: six heads (head 92 of 552). A rani-pink A-line frock with a gold
// band at the hem, puff sleeves, two plaits with jasmine strings and pink ribbons, chappals.
// Both South Indian, medium-brown skin. Canon (Winter's segment table, as fractions of height):
// upper arm .186, forearm .146, hand .108, thigh .245, shank .246. Joints within their limits:
// the elbow bends 0..150 degrees and only one way.
// VIEW: three-quarter, facing +x (flip -1 faces -x). Light from the upper left of the pose.

export type Face = "calm" | "wow" | "laugh" | "smile" | "sleep";
export type Arm = { a: number; e: number; hand?: "open" | "point" | "mouth" | "fist" | "hold" }; // a: upper arm from straight down, + forward (rad); e: elbow flex 0..2.6
export type Pose = { x: number; y: number; s: number; flip?: 1 | -1; lean?: number; look?: number; face?: Face; near?: Arm; far?: Arm; hem?: P | null; step?: number; bob?: number };
type Pl = ReturnType<typeof plate>;

export const K = {
  skin: "#b8774a", skinD: "#8c5434", skinL: "#d39765", lip: "#7e3b31", mouth: "#3d1714", hair: "#1c1715", hairL: "#3b302b",
  blouse: "#22564f", saree: "#2e7a6c", sareeD: "#24635a", border: "#d8a73d", borderD: "#a37620", bindi: "#9f1f2a", gold: "#d7a53c",
  frock: "#cf3f7c", frockD: "#a32b60", ribbon: "#e85a95", jas: "#f6f1e0", jasD: "#c9c2ab", chap: "#5a3420", white: "#f4efe2", ink: "#1d1a17",
};

// an arm from the shoulder: upper arm, forearm, hand, all in the pose frame (units before scale)
const armPts = (sh: P, arm: Arm, up: number, fo: number): [P, P, P] => {
  const e = clamp(arm.e, 0, 2.6), el: P = [sh[0] + Math.sin(arm.a) * up, sh[1] + Math.cos(arm.a) * up], b = arm.a + e, wr: P = [el[0] + Math.sin(b) * fo, el[1] + Math.cos(b) * fo];
  return [sh, el, wr];
};
// a hand at the wrist pointing along `dir`: palm, four fingers, a thumb; open, pointing, a fist or over the mouth
const hand = (S: Pl["S"], L: Pl["L"], M: (x: number, y: number) => P, wr: P, dir: number, len: number, kind: Arm["hand"], col: string, k: number, w = 1.6) => {
  const F = (u: number, v: number): P => M(wr[0] + Math.cos(dir) * u - Math.sin(dir) * v, wr[1] + Math.sin(dir) * u + Math.cos(dir) * v);
  const pw = len * 0.42, pl = len * 0.48;
  S(sm([F(0, -pw * 0.45), F(pl, -pw * 0.5), F(pl, pw * 0.5), F(0, pw * 0.45)], true, 3), col);
  const fing = [-0.36, -0.12, 0.12, 0.34];
  fing.forEach((v, i) => {
    const l = len * [0.44, 0.5, 0.47, 0.38][i], curl = kind === "fist" || kind === "hold" ? 0.25 : kind === "point" && i > 0 ? 0.3 : 1, bend = kind === "fist" ? 1.2 : kind === "hold" ? 0.9 : kind === "point" && i > 0 ? 1.4 : 0.12;
    const a: P = [pl, v * pw], b: P = [pl + l * 0.55 * curl, v * pw * 1.05], c: P = [b[0] + Math.cos(bend) * l * 0.45 * curl, b[1] + Math.sin(bend) * l * 0.45 * curl + v * 2];
    S(limb([F(...a), F(...b), F(...c)], [len * 0.075 * k, len * 0.07 * k, len * 0.06 * k], 3).poly, col);
  });
  const th = limb([F(pl * 0.2, -pw * 0.5), F(pl * 0.6, -pw * 0.95), F(pl * 0.95, -pw * 1.1)], [len * 0.085 * k, len * 0.075 * k, len * 0.06 * k], 3).poly; S(th, col);
  L([F(pl, -pw * 0.5), F(pl * 1.02, 0), F(pl, pw * 0.5)], w * 0.7);
};

// ---------------------------------------------------------------- the head, three-quarter to +x
export const head = (S: Pl["S"], L: Pl["L"], M: (x: number, y: number) => P, c: P, h0: number, face: Face, who: "amma" | "kavya", look: number, k: number) => {
  const hs = h0;
  const H = (u: number, v: number): P => { const a = look; return M(c[0] + (u * Math.cos(a) - v * Math.sin(a)) * hs, c[1] + (u * Math.sin(a) + v * Math.cos(a)) * hs); }, rs = hs * k;
  // hair behind
  if (who === "amma") { S(sm([H(-0.52, -0.1), H(-0.5, -0.5), H(-0.1, -0.66), H(0.3, -0.6), H(0.5, -0.3), H(0.2, -0.2), H(-0.3, 0.2), H(-0.5, 0.25)]), K.hair); S(ell(...H(-0.56, -0.36), 0.24 * rs, 0.21 * rs, 0.3), K.hair); }
  else { S(sm([H(-0.5, -0.05), H(-0.48, -0.5), H(-0.05, -0.64), H(0.32, -0.56), H(0.48, -0.3), H(0.2, -0.2), H(-0.3, 0.15), H(-0.48, 0.2)]), K.hair); }
  // the face: a jaw that turns at the far cheek, the nose on the profile edge
  const fs = sm([H(-0.36, -0.36), H(0.04, -0.46), H(0.36, -0.36), H(0.46, -0.14), H(0.5, 0.0), H(0.56, 0.08), H(0.5, 0.14), H(0.46, 0.26), H(0.4, 0.38), H(0.2, 0.5), H(0.02, 0.52), H(-0.2, 0.44), H(-0.36, 0.2)]);
  S(fs, K.skin);
  S(sm([H(-0.36, -0.2), H(-0.14, -0.1), H(-0.1, 0.2), H(-0.2, 0.44), H(-0.36, 0.2)]), K.skinD);              // the cheek away from the light
  S(ell(...H(-0.34, 0.06), 0.07 * rs, 0.12 * rs), K.skinD);                                                // the ear
  if (who === "amma") S(ell(...H(-0.34, 0.2), 0.035 * rs, 0.035 * rs), K.gold);
  // the hairline over the forehead
  S(sm([H(-0.46, 0.0), H(-0.44, -0.38), H(0.0, -0.52), H(0.4, -0.4), H(0.38, -0.3), H(0.1, -0.36), H(-0.2, -0.3), H(-0.36, -0.1)]), K.hair);
  // features: brows, eyes, nose, mouth
  const wow = face === "wow", laugh = face === "laugh", by = wow ? -0.24 : -0.19;
  S(sm([H(0.04, by), H(0.16, by - 0.03), H(0.3, by), H(0.3, by + 0.025), H(0.16, by - 0.005), H(0.04, by + 0.025)], true, 2), K.hair);
  S(sm([H(0.38, by + 0.005), H(0.45, by - 0.01), H(0.48, by + 0.02), H(0.44, by + 0.03)], true, 2), K.hair);
  const eA = H(0.17, -0.08), eB = H(0.43, -0.07);
  if (face === "sleep" || laugh) { L([H(0.09, -0.08), H(0.17, laugh ? -0.12 : -0.05), H(0.25, -0.08)], 1.8); L([H(0.4, -0.08), H(0.44, laugh ? -0.11 : -0.05), H(0.47, -0.08)], 1.6); }
  else { S(ell(eA[0], eA[1], 0.055 * rs, (wow ? 0.06 : 0.045) * rs), K.white); S(ell(eA[0] + 0.012 * rs, eA[1], 0.03 * rs, 0.034 * rs), K.ink); S(ell(eB[0], eB[1], 0.026 * rs, (wow ? 0.05 : 0.04) * rs), K.white); S(ell(eB[0] + 0.006 * rs, eB[1], 0.017 * rs, 0.028 * rs), K.ink); L([H(0.1, -0.12), H(0.17, -0.14), H(0.24, -0.11)], 1.4); }
  L([H(0.44, -0.04), H(0.53, 0.07), H(0.49, 0.13), H(0.44, 0.12)], 1.5);
  if (wow) { S(ell(...H(0.36, 0.3), 0.05 * rs, 0.065 * rs), K.lip); S(ell(...H(0.36, 0.3), 0.032 * rs, 0.045 * rs), K.mouth); }
  else if (laugh) { S(sm([H(0.22, 0.24), H(0.46, 0.22), H(0.42, 0.34), H(0.3, 0.38), H(0.22, 0.3)], true, 3), K.mouth); S(sm([H(0.24, 0.245), H(0.44, 0.228), H(0.43, 0.26), H(0.25, 0.27)], true, 2), K.white); }
  else if (face === "smile") L([H(0.24, 0.27), H(0.34, 0.31), H(0.45, 0.26)], 1.6);
  else L([H(0.27, 0.29), H(0.36, 0.3), H(0.44, 0.28)], 1.4);
  if (who === "amma") S(ell(...H(0.25, -0.27), 0.025 * rs, 0.025 * rs), K.bindi);
  L([H(0.46, 0.26), H(0.4, 0.38), H(0.2, 0.5), H(0.02, 0.52), H(-0.2, 0.44)], 1.6);
  return H;
};

/** the hand to the mouth or chin: laughing, or a gasp */
export const TO_MOUTH: Arm = { a: 0.2, e: 2.6, hand: "mouth" };

/** Amma's head alone, for close shots: the same drawing at any size */
export const ammaHead = (pl: Pl, x: number, y: number, s: number, face: Face, look: number) => head(pl.S, pl.L, (u, v) => [x + u * s, y + v * s], [0, 0], 95, face, "amma", look, s);

export const amma = (pl: Pl, p: Pose) => {
  const { S, L } = pl, fl = p.flip ?? 1, s = p.s, lean = p.lean ?? 0, bob = p.bob ?? 0;
  const M = (x: number, y: number): P => { const yy = y - bob, xr = x * Math.cos(lean) - (yy + 380) * Math.sin(lean) * (yy < -380 ? 1 : 0), yr = yy; return [p.x + fl * xr * s, p.y + yr * s]; };
  const near = p.near ?? { a: 0.12, e: 0.25, hand: "open" }, far = p.far ?? { a: -0.05, e: 0.3, hand: "open" };
  // the far arm, behind the body
  const fa = armPts([-34, -566], far, 130, 102);
  S(limb([M(...fa[0]), M(...fa[1]), M(...fa[2])], [19 * s, 16 * s, 13 * s], 5).poly, K.skinD);
  hand(S, L, M, fa[2], Math.atan2(fa[2][1] - fa[1][1], fa[2][0] - fa[1][0]) * 1 + (fl < 0 ? 0 : 0), 75, far.hand, K.skinD, s);
  // the saree skirt: pleats in front, the border at the hem, chappals under
  const st = p.step ?? 0;
  S([M(-30 - st * 10, -10), M(-4, -8), M(-6, 0), M(-36 - st * 10, 2)], K.chap);
  S([M(20 + st * 14, -10), M(54 + st * 14, -8), M(56 + st * 14, 1), M(18 + st * 14, 2)], K.chap);
  const skirt = sm([M(-62, -420), M(60, -420), M(74, -260), M(86, -60), M(96, -14), M(-74, -14), M(-70, -120), M(-66, -260)], true, 5);
  S(skirt, K.saree);
  S(sm([M(-72, -50), M(92, -46), M(96, -14), M(-74, -14)], true, 3), K.border);
  S(sm([M(-66, -260), M(-62, -420), M(-20, -420), M(-30, -260), M(-46, -14), M(-74, -14), M(-70, -120)], true, 4), K.sareeD);
  [8, 26, 44, 62].forEach((x) => L([M(x * 0.7 + 4, -380), M(x * 0.9 + 8, -200), M(x + 6, -50)], 1.3));
  // the blouse and the torso
  S(sm([M(-50, -580), M(-6, -590), M(40, -582), M(56, -540), M(60, -480), M(52, -440), M(-52, -440), M(-58, -500)], true, 4), K.blouse);
  S(sm([M(-46, -446), M(50, -446), M(60, -420), M(-62, -420)], true, 3), K.skin);                         // the bare waist between blouse and skirt
  // the pallu: over the left shoulder, across the chest to the right hip, then hanging down the back
  S(sm([M(-50, -588), M(-10, -590), M(52, -470), M(70, -400), M(40, -380), M(-20, -470), M(-56, -520)], true, 4), K.saree);
  S(sm([M(-10, -590), M(4, -590), M(70, -414), M(70, -400), M(56, -404)], true, 3), K.border);
  S(sm([M(-50, -586), M(-80, -560), M(-92, -400), M(-84, -250), M(-66, -260), M(-62, -420)], true, 4), K.sareeD);
  S(sm([M(-92, -400), M(-84, -250), M(-72, -252), M(-80, -400)], true, 2), K.border);
  // the neck
  S(sm([M(-6, -620), M(18, -620), M(20, -586), M(-8, -584)], true, 2), K.skinD);
  // the near arm, over the body
  const na = armPts([24, -566], near, 130, 102);
  S(limb([M(...na[0]), M(...na[1]), M(...na[2])], [20 * s, 17 * s, 13.5 * s], 5).poly, K.skin);
  S(sm([M(6, -586), M(44, -584), M(52, -546), M(40, -528), M(10, -534)], true, 3), K.blouse);            // the short sleeve
  const nd = Math.atan2(na[2][1] - na[1][1], na[2][0] - na[1][0]);
  [0.06, 0.12].forEach((t) => { const q: P = [lerp(na[2][0], na[1][0], t), lerp(na[2][1], na[1][1], t)]; L([M(q[0] - 12, q[1] - 2), M(q[0] + 12, q[1] + 2)], 2.2, K.gold); });
  hand(S, L, M, na[2], nd, 75, near.hand, K.skin, s);
  // the head
  head(S, L, M, [16, -655], 95, p.face ?? "calm", "amma", (p.look ?? 0) * fl, s);
  // the line: body contours, the sleeve, the pallu edge, the skirt
  L([M(-62, -420), M(-66, -260), M(-74, -14)], 1.6); L([M(60, -420), M(74, -260), M(86, -60)], 1.6); L([M(-10, -590), M(52, -470), M(70, -400)], 1.5);
  L([M(10, -534), M(40, -528), M(52, -546)], 1.3);
  return { M, hip: M(0, -380), head: M(16, -655), hands: [M(...na[2]), M(...fa[2])] };
};

export const kavya = (pl: Pl, p: Pose) => {
  const { S, L, D } = pl, fl = p.flip ?? 1, s = p.s, lean = p.lean ?? 0, bob = p.bob ?? 0;
  const M = (x: number, y: number): P => { const yy = y - bob, piv = -250, xr = x - (yy < piv ? (yy - piv) * Math.sin(lean) : 0); return [p.x + fl * xr * s, p.y + yy * s]; };
  const near = p.near ?? { a: 0.15, e: 0.3, hand: "open" }, far = p.far ?? { a: -0.1, e: 0.3, hand: "open" };
  void D;
  const fa = armPts([-28, -440], far, 103, 81);
  S(limb([M(...fa[0]), M(...fa[1]), M(...fa[2])], [14 * s, 12 * s, 10 * s], 5).poly, K.skinD);
  hand(S, L, M, fa[2], Math.atan2(fa[2][1] - fa[1][1], fa[2][0] - fa[1][0]), 60, far.hand, K.skinD, s);
  // legs below the frock, chappals
  const st = p.step ?? 0;
  S(limb([M(-14, -240), M(-16 - st * 8, -120), M(-18 - st * 12, -18)], [15 * s, 12 * s, 10 * s], 4).poly, K.skinD);
  S(limb([M(14, -240), M(18 + st * 8, -120), M(20 + st * 14, -18)], [15 * s, 12 * s, 10 * s], 4).poly, K.skin);
  S([M(-34 - st * 12, -14), M(-6 - st * 12, -12), M(-4 - st * 12, 0), M(-36 - st * 12, 2)], K.chap); S([M(4 + st * 14, -14), M(40 + st * 14, -12), M(42 + st * 14, 0), M(2 + st * 14, 2)], K.chap);
  // the frock: bodice and an A-line skirt to the knee, a gold band, the hem pulled if caught
  const hemR: P = p.hem ? [(p.hem[0] - p.x) / (fl * s), (p.hem[1] - p.y) / s] : [86, -150];
  S(sm([M(-44, -450), M(44, -450), M(52, -330), M(hemR[0] * 0.7 + 20, (hemR[1] - 330) / 2), M(...hemR), M(40, -146), M(-20, -144), M(-80, -154), M(-56, -330)], true, 5), K.frock);
  S(sm([M(-80, -154), M(-20, -144), M(40, -146), M(...hemR), M(hemR[0] - 4, hemR[1] - 22), M(40, -170), M(-20, -166), M(-78, -176)], true, 3), K.border);
  S(sm([M(-56, -330), M(-44, -450), M(-10, -450), M(-26, -330), M(-46, -156), M(-80, -154)], true, 3), K.frockD);
  [[-20, -330, -34, -160], [14, -330, 20, -156]].forEach(([a, b, c, d]) => L([M(a, b), M(c, d)], 1.3));
  // puff sleeve, near arm
  const na = armPts([20, -440], near, 103, 81);
  S(limb([M(...na[0]), M(...na[1]), M(...na[2])], [15 * s, 12.5 * s, 10 * s], 5).poly, K.skin);
  S(ell(...M(18, -438), 30 * s, 24 * s), K.frock); L([M(-6, -420), M(18, -414), M(44, -424)], 1.3);
  hand(S, L, M, na[2], Math.atan2(na[2][1] - na[1][1], na[2][0] - na[1][0]), 60, near.hand, K.skin, s);
  S(sm([M(-4, -486), M(18, -486), M(18, -452), M(-4, -452)], true, 2), K.skinD);
  // the head, then the plaits with jasmine and ribbons hanging behind
  const hs = 92;
  head(S, L, M, [12, -520], hs, p.face ?? "calm", "kavya", (p.look ?? 0) * fl, s);
  const plait = (dx: number, sw: number) => { const pts: P[] = [M(-30 + dx, -520), M(-42 + dx + sw * 0.3, -470), M(-46 + dx + sw * 0.7, -420), M(-44 + dx + sw, -372)]; const k = limb(pts, [11 * s, 10 * s, 8 * s, 6 * s], 4); S(k.poly, K.hair); for (let i = 0; i < 5; i++) { const q = M(-40 + dx + sw * (i / 5), -500 + i * 24); L([[q[0] - 6 * s, q[1] - 2], [q[0], q[1] + 4 * s], [q[0] + 6 * s, q[1] - 2]], 1.1, K.hairL); } const e = pts[3]; S(ell(e[0], e[1] + 6 * s, 9 * s, 6 * s), K.ribbon); return pts; };
  plait(-6, (p.bob ?? 0) * 0.3); const pl1 = plait(6, (p.bob ?? 0) * 0.5);
  for (let i = 0; i < 6; i++) { const q = M(-32 - i * 2, -548 + i * 9); S(ell(q[0], q[1], 5 * s, 4 * s), i % 2 ? K.jas : K.jasD); }
  void pl1; void mix;
  return { M, head: M(12, -520), hands: [M(...na[2]), M(...fa[2])] };
};
