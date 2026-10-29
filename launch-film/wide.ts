import { rng, type P } from "./core";
import { lerp, mix } from "./gallery";
import { amma, kavya } from "./cast";
import { ell, limb, plate, sm } from "./gouache";

// WIDE SCENES in the picture-book hand (wc.ts): the world first, rich and layered (sky, far, back,
// mid, fore, as the reference skill layers its pages), the people acting in it at a size where a
// whole body reads, and the activity in the middle of the frame. Look test: the kingfisher.
// SETTING (reference, from knowledge): a Kerala backwater in the morning. The Western Ghats blue
// on the horizon, coconut palms leaning over the far bank, a kettuvallam (rice-barge houseboat,
// woven bamboo roof) and the Chinese fishing nets of Kochi (cantilevered frames, a net hung from
// four poles), still teal water, laterite steps of a bathing ghat. A white-throated kingfisher
// (Halcyon smyrnensis): turquoise back, chestnut head and belly, white bib, long red bill.

type Pl = ReturnType<typeof plate>;
const W = 1080, H = 1920;
const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const ph = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const bar = (a: P, b: P, w: number, w2 = w) => limb([a, b], [w, w2], 2).poly;
const rect = (x0: number, y0: number, x1: number, y1: number): P[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
// a ridge line by midpoint displacement: real peaks, never a sine wave
const ridge = (x0: number, x1: number, y: number, rough: number, seed: number, levels = 6): P[] => { const r = rng(seed); let pts: P[] = [[x0, y], [x1, y]]; let amp = rough; for (let l = 0; l < levels; l++) { const n: P[] = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; n.push(a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + (r() - 0.6) * amp]); } n.push(pts[pts.length - 1]); pts = n; amp *= 0.52; } return pts; };
const palm = (S: Pl["S"], L: Pl["L"], base: P, h: number, lean: number, sway: number, col: string, colD: string, trunk: string) => {
  const top: P = [base[0] + lean * h, base[1] - h], mid: P = [base[0] + lean * h * 0.35 + h * 0.04, base[1] - h * 0.5];
  S(limb([base, mid, top], [h * 0.026, h * 0.022, h * 0.016], 6).poly, trunk);
  for (let i = 0; i < 4; i++) L([[lerp(base[0], top[0], 0.2 + i * 0.18) - h * 0.02, lerp(base[1], top[1], 0.2 + i * 0.18)], [lerp(base[0], top[0], 0.2 + i * 0.18) + h * 0.02, lerp(base[1], top[1], 0.2 + i * 0.18) + 2]], 0.9);
  for (let i = 0; i < 10; i++) { const a = -Math.PI * 0.98 + (i / 9) * Math.PI * 1.96 + Math.sin(sway + i) * 0.04, l = h * (0.3 + (i % 3) * 0.04), pts: P[] = [], back: P[] = []; for (let k = 0; k <= 8; k++) { const q = k / 8, x = top[0] + Math.cos(a) * l * q, y = top[1] + Math.sin(a) * l * q * 0.6 + q * q * l * 0.42, w = Math.sin(Math.PI * q) * h * 0.03; pts.push([x - Math.sin(a) * w, y + Math.cos(a) * w]); back.push([x + Math.sin(a) * w * 0.4, y - Math.cos(a) * w * 0.4]); } S([...pts, ...back.reverse()], i % 2 ? col : colD); }
  S(ell(top[0], top[1] + h * 0.02, h * 0.03, h * 0.025), "#7a5a2a");
};
const kingfisher = (S: Pl["S"], L: Pl["L"], o: P, s: number, a: number, wing: number) => {
  const M = (x: number, y: number): P => [o[0] + (x * Math.cos(a) - y * Math.sin(a)) * s, o[1] + (x * Math.sin(a) + y * Math.cos(a)) * s];
  S(sm([M(40, -6), M(70, 0), M(96, 14), M(70, 14), M(40, 10)], true, 3), "#1f8fc4");
  S(sm([M(-30, -20), M(10, -26), M(46, -12), M(50, 8), M(10, 22), M(-26, 16)]), "#8a3f1c");
  S(sm([M(-6, -24), M(30, -20 - wing * 30), M(62, -8 - wing * 10), M(40, 6), M(0, 2)]), "#1f8fc4"); S(sm([M(6, -18), M(30, -16 - wing * 22), M(48, -8), M(24, -4)]), "#57c2e6", 0);
  S(sm([M(-30, -20), M(-40, 2), M(-22, 14), M(-14, -4)]), "#f7f1e4"); S(ell(...M(-34, -26), 20 * s, 18 * s), "#8a3f1c");
  S([M(-50, -30), M(-104, -20), M(-50, -18)], "#d2351f"); S(ell(...M(-40, -30), 4 * s, 4 * s), "#1d1a17", 0);
};

export const kingWide = { len: 150, caption: ["No splash! The kingfisher's beak", "shaped the bullet train's nose."] as [string, string] };
export const buildKingWide = (t: number): { back: Pl; front: Pl } => {
  const back = plate(), front = plate(), { S, L } = back, r = rng(808);
  // SKY: three soft bands, a sun behind morning haze, two clouds
  const skyC = ["#8fbcd4", "#9ec6d8", "#b0d0da", "#c4dbd8", "#d8e2cf", "#e8e4c4", "#f3e2b4"];
  skyC.forEach((c, i) => { const y0 = -20 + i * 140, y1 = y0 + 190; S(sm([[-20, y0 + (i ? 10 : 0)], [W / 2, y0 - 8], [W + 20, y0 + 6], [W + 20, y1], [-20, y1]], true, 3), c, 0); });
  S(ell(790, 640, 150, 150, 0, 50), "#f6e8c2", 0); S(ell(790, 640, 66, 66, 0, 40), "#fdf3d2", 0);
  for (let i = 0; i < 4; i++) { const a = 2.0 + i * 0.16; S([[790, 640], [790 + Math.cos(a - 0.04) * 1400, 640 + Math.sin(a - 0.04) * 1400], [790 + Math.cos(a + 0.04) * 1400, 640 + Math.sin(a + 0.04) * 1400]], "rgba(255,246,214,0.16)", 0); }
  [[240, 260, 1], [760, 180, 0.8]].forEach(([x, y, k]) => S(sm([[x - 150 * k, y + 20], [x - 90 * k, y - 26 * k], [x - 20 * k, y - 50 * k], [x + 60 * k, y - 34 * k], [x + 140 * k, y], [x + 120 * k, y + 26], [x - 120 * k, y + 30]], true, 4), "#eef3ee", 1.2));
  // FAR: the Western Ghats, two ranges, the farther paler
  S([...ridge(-20, W + 20, 760, 380, 3), [W + 20, 1000], [-20, 1000]], "#b4c0d4", 1);
  S([...ridge(-20, W + 20, 840, 260, 9), [W + 20, 1000], [-20, 1000]], "#9aacc6", 1.1);
  S([...ridge(-20, W + 20, 900, 140, 7), [W + 20, 1000], [-20, 1000]], "#8399b6", 1.2);
  S(sm([[-20, 890], [W + 20, 880], [W + 20, 950], [-20, 960]], true, 2), "rgba(240,236,222,0.55)", 0);
  // BACK: the far bank with a long grove of palms, a houseboat, a Chinese fishing net
  S(sm([[-20, 930], [W + 20, 920], [W + 20, 990], [-20, 1000]], true, 2), "#5f8a4a", 0);
  for (let i = 0; i < 16; i++) { const x = -20 + i * 74 + r() * 30, h = 120 + r() * 90; palm(S, L, [x, 960], h, (r() - 0.5) * 0.35, t * 0.05 + i, "#6f9a4c", "#557d3c", "#7a6046"); }
  // the kettuvallam on the left: hull and the woven bamboo roof
  S(sm([[60, 1010], [330, 1004], [310, 1040], [90, 1044]], true, 3), "#5a3820"); S(sm([[110, 1006], [140, 960], [270, 958], [300, 1004]], true, 3), "#c9a66b");
  for (let i = 0; i < 6; i++) L([[130 + i * 28, 968], [124 + i * 30, 1004]], 0.9);
  // the Chinese fishing net on the right: a frame of poles cantilevered over the water, the net between
  const nb: P = [930, 1010]; S(bar(nb, [820, 860], 3.5), "#5a3820"); S(bar(nb, [1040, 870], 3.5), "#5a3820"); S(bar([820, 860], [1040, 870], 2.5), "#5a3820");
  S(sm([[820, 860], [930, 900], [1040, 870], [930, 960]], true, 3), "#e9dcc0", 1); for (let i = 1; i < 6; i++) L([[820 + i * 37, 862 + i * 2], [930, 960]], 0.6);
  // MID: the water, its long ripples, the bank's reflection
  S(rect(-20, 990, W + 20, H + 20), "#3f8f8a", 0); S(rect(-20, 990, W + 20, 1060), "#5a9f94", 0); S(sm([[-20, 1060], [W + 20, 1060], [W + 20, 1180], [-20, 1180]], true, 2), "#4a978d", 0);
  for (let i = 0; i < 16; i++) { const x = -20 + i * 74 + 30, h = 90 + r() * 60, pts: P[] = []; for (let k = 0; k <= 8; k++) { const y = 1000 + (k / 8) * h; pts.push([x + Math.sin(k * 1.3 + t * 0.12 + i) * 5, y]); } L(pts, 3, "#3c7c72"); }
  for (let i = 0; i < 24; i++) { const y = 1040 + i * 22 + r() * 10, x = r() * W; L([[x, y], [x + 60 + r() * 120, y]], 1.2, "#8cc8bc"); }
  // the dive: on the left the kingfisher folds its wings and enters the water with hardly a ripple
  const dv = ph(t, 40, 70), kp: P = [lerp(300, 380, dv), lerp(620, 1220, dv * dv)];
  if (t < 72) kingfisher(S, L, kp, 1.25, lerp(0.1, -1.35, ph(t, 40, 50)), t < 40 ? 0.25 + 0.25 * Math.sin(t * 0.8) : 0);
  if (t > 70) { const k = ph(t, 70, 110); L(ell(380, 1230, 16 + 40 * k, 5 + 9 * k, 0, 26), 1.6, "#d6efe9", true); if (k < 1) L(ell(380, 1230, 6 + 16 * k, 2 + 4 * k, 0, 18), 1.4, "#d6efe9", true); }
  // the pebble: Kavya's throw arcs out and lands with a big, loud splash
  const fly = ph(t, 12, 36), pb: P = [lerp(690, 640, fly), lerp(1210, 1330, fly) - Math.sin(fly * Math.PI) * 220];
  if (t >= 12 && t < 36) S(ell(pb[0], pb[1], 11, 9), "#6b6258");
  const sk = (t - 36) / 34;
  if (sk > 0 && sk < 1) {
    const c: P = [640, 1340], h = Math.sin(sk * Math.PI) * 170, w = 50 + 120 * sk, crown: P[] = [];
    for (let i = 0; i <= 14; i++) { const q = i / 14, x = c[0] - w + q * 2 * w, peak = i % 2 ? h * (0.55 + 0.45 * Math.abs(Math.sin(i * 2.1))) : h * 0.3; crown.push([x, c[1] - peak]); }
    S(sm([[c[0] - w * 1.05, c[1]], ...crown, [c[0] + w * 1.05, c[1]]], true, 4), "#d8efe9", 1.2);
    S([[c[0] - w * 0.6, c[1]], [c[0] - w * 0.3, c[1] - h * 0.35], [c[0] + w * 0.3, c[1] - h * 0.32], [c[0] + w * 0.6, c[1]]], "#a9dcd2", 0);
    for (let i = 0; i < 12; i++) { const a = -Math.PI * (0.1 + (i / 11) * 0.8), d = w * (1 + sk * 0.6), y = c[1] - h * 1.1 * Math.abs(Math.sin(a)) - 20 * Math.sin(sk * Math.PI); S(ell(c[0] + Math.cos(a) * d, y, 7, 9), "#e9f7f3", 1); }
    L(ell(c[0], c[1] + 6, w * 1.3, 14 + 20 * sk, 0, 30), 2, "#cdeae3", true);
  }
  // the pebble's flight, dashed, so the eye follows it from her hand to the splash
  if (t >= 12 && t < 70) for (let i = 0; i < 9; i++) { const q0 = i / 9, q1 = q0 + 0.05, P0: P = [lerp(690, 640, q0), lerp(1210, 1330, q0) - Math.sin(q0 * Math.PI) * 220], P1: P = [lerp(690, 640, q1), lerp(1210, 1330, q1) - Math.sin(q1 * Math.PI) * 220]; if (q0 < fly) L([P0, P1], 2, "#f4efe2"); }
  // water hyacinth drifting near the bank
  [[90, 1430], [180, 1470], [980, 1420]].forEach(([x, y], i) => { S(ell(x, y, 46, 16, 0.1 * i), "#4f7f3a"); S(ell(x + 6, y - 14, 8, 10), "#b48ad0", 0); });
  // the laterite steps of the ghat, under their feet
  [[1500, "#b8724e"], [1600, "#a86846"], [1710, "#965a3c"], [1820, "#86502f"]].forEach(([y, col], i) => { S(sm([[-20, y as number], [W + 20, (y as number) - 6], [W + 20, H + 20], [-20, H + 20]], true, 2), col as string, 1.2); S(sm([[-20, y as number], [W + 20, (y as number) - 6], [W + 20, (y as number) + 10], [-20, (y as number) + 16]], true, 2), mix(col as string, "#f3d7b8", 0.35), 0); for (let k = 0; k < 7; k++) L([[k * 160 + (i % 2) * 80, (y as number) + 16], [k * 160 + (i % 2) * 80 + 6, (y as number) + 96]], 1); });
  // PEOPLE: Amma on the step behind, pointing at the bird; Kavya at the edge, mid-throw, then both wowed
  const looked = t > 50, laugh = t > 112;
  amma(back, { x: 260, y: 1712, s: 0.82, face: laugh ? "laugh" : looked ? "wow" : "smile", look: looked ? -0.2 : 0.1, near: looked ? { a: 2.3, e: 0.2, hand: "point" } : { a: 0.4, e: 0.6, hand: "open" }, far: { a: -0.1, e: 0.4 } });
  const thr = ph(t, 0, 14);
  kavya(back, { x: 740, y: 1606, s: 0.86, flip: -1, lean: -0.12 * ph(t, 0, 14) + 0.12, face: t > 40 ? (laugh ? "laugh" : "wow") : "smile", look: t > 50 ? -0.15 : 0.15, near: { a: lerp(0.3, 1.75, thr), e: lerp(1.8, 0.15, thr), hand: thr < 0.9 ? "fist" : "open" }, far: { a: -0.5, e: 0.5, hand: "open" }, step: 0.6 });
  // FORE: the laterite steps of the ghat, a banana plant at the edge, grass
  const F = front;
  for (let i = 0; i < 6; i++) { const a = -2.4 + i * 0.45, l = 300; F.S(sm([[40, 1640], [40 + Math.cos(a) * l * 0.5, 1640 + Math.sin(a) * l * 0.5 - 40], [40 + Math.cos(a) * l, 1640 + Math.sin(a) * l], [40 + Math.cos(a + 0.08) * l * 0.5, 1640 + Math.sin(a + 0.08) * l * 0.5]], true, 3), i % 2 ? "#6f9a4c" : "#86b25a"); }
  F.S(bar([40, 1920], [40, 1640], 16, 12), "#9bb26a");
  for (let i = 0; i < 30; i++) { const x = r() * W, y = 1880 + r() * 40; F.L([[x, y], [x + (r() - 0.5) * 10, y - 26 - r() * 20]], 1.4, "#5f7a3a"); }
  // light: morning rays through the haze (drawn last in the back, under the people? no: over the far scene only)
  return { back, front };
};
