import { rng, type P } from "./core";
import { clamp, lerp, mix } from "./gallery";
import { amma, kavya, TO_MOUTH, type Arm } from "./cast";
import { ell, limb, plate, sm } from "./gouache";

// THE DREAM SCENES of the DeepKids Gurukul film. Each builds one gouache plate for a local frame
// t (0..len). Every scene is a real lesson in the app, done by a mother and her daughter, both
// amazed. Settings lean South (Tamil fields, a Kerala backwater, a Tamil village banyan, a Chennai
// terrace); the bullet train is the Mumbai-Ahmedabad line, the West's share.
// Each scene names the round thing it opens on (`entry`) and the round thing it leaves through
// (`exit`): the film's seams are match cuts on those circles (see gurukul.ts).

export type Pl = ReturnType<typeof plate>;
export type Circle = [number, number, number];
const W = 1080, H = 1920;
const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const ph = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const bar = (a: P, b: P, w: number, w2 = w) => limb([a, b], [w, w2], 2).poly;
const C = {
  ink: "#1d1a17", cream: "#f6ecd2", sun: "#f8ebbd",
  sky1: "#8dbfd0", sky2: "#bcd8cf", sky3: "#f3dfa6", paddy: "#7fae4a", paddyD: "#5f8f38", bund: "#b98a55",
  burr: "#7a4a24", burrD: "#57331a", burrL: "#a8743c",
  water: "#3f8f8a", waterL: "#6cb3a8", palm: "#5d8a3c", palmD: "#3f6a2c", trunk: "#6b4a32", boat: "#6a3a22",
  kfBlue: "#1f8fc4", kfBlueL: "#57c2e6", kfBrown: "#8a3f1c", kfWhite: "#f7f1e4", kfRed: "#d2351f",
  train: "#f2f1ec", trainB: "#2c5aa0", trainD: "#b9bcc2", steel: "#b7bbbf", steelD: "#8d9297", steelL: "#e3e5e6", leaf: "#6f9a3c", table: "#7c3d21",
  earth: "#b9553a", lime: "#f1ead8", oxide: "#9a3b25", tile: "#b5502c", banyan: "#4f7f3a", banyanD: "#3a6230", bark: "#7b6250", barkD: "#5a4636",
  mirror: "#a9cfd0", mirrorD: "#7fb0b4", frame: "#6a3a22", night: "#1e1436", night2: "#2c2058", star: "#fdf6d8",
  sea: "#2f6f9a", sand: "#e8cf9a", city: "#d9c7a4", india: "#7fae4a", ocean: "#245a8c", mane: "#a8743c", maneD: "#5a3a1c", lion: "#c99a5a", indigo: "#2d2a6e", sage: "#8fae8a",
};
const sun = (S: Pl["S"], x: number, y: number, r: number) => { S(ell(x, y, r * 1.18, r * 1.18, 0, 40), mix(C.sun, C.sky3, 0.5)); S(ell(x, y, r, r, 0, 40), C.sun); };
const palmyra = (S: Pl["S"], L: Pl["L"], x: number, base: number, h: number) => { S(bar([x, base], [x + h * 0.03, base - h], h * 0.022, h * 0.016), C.trunk); const c: P = [x + h * 0.03, base - h]; for (let i = 0; i < 13; i++) { const a = Math.PI + (i / 12) * Math.PI, l = h * 0.22; S([c, [c[0] + Math.cos(a - 0.06) * l, c[1] + Math.sin(a - 0.06) * l * 0.8], [c[0] + Math.cos(a + 0.06) * l, c[1] + Math.sin(a + 0.06) * l * 0.8]], C.palmD); } L([[c[0] - h * 0.02, c[1] + 2], [c[0] + h * 0.02, c[1] + 2]], 1.2); };
const coconut = (S: Pl["S"], L: Pl["L"], base: P, top: P, h: number, sway: number) => { const mid: P = [(base[0] + top[0]) / 2 + h * 0.08, (base[1] + top[1]) / 2]; S(limb([base, mid, top], [h * 0.03, h * 0.026, h * 0.02], 6).poly, C.trunk); for (let i = 0; i < 9; i++) { const a = -Math.PI * 0.95 + (i / 8) * Math.PI * 1.9 + sway * 0.05, l = h * (0.32 + (i % 3) * 0.05), pts: P[] = [], back: P[] = []; for (let k = 0; k <= 8; k++) { const q = k / 8, x = top[0] + Math.cos(a) * l * q, y = top[1] + Math.sin(a) * l * q * 0.7 + q * q * l * 0.35, w = Math.sin(Math.PI * q) * h * 0.035; pts.push([x - Math.sin(a) * w, y + Math.cos(a) * w]); back.push([x + Math.sin(a) * w * 0.3, y - Math.cos(a) * w * 0.3]); } S([...pts, ...back.reverse()], i % 2 ? C.palm : C.palmD); L(pts.slice(1, 7), 1, C.palmD); } };

// ---------------------------------------------------------------- 1. VELCRO: the burr's hooks
export const velcro = { len: 150, entry: [690, 900, 330] as Circle, exit: [190, 330, 70] as Circle };
export const buildVelcro = (t: number): Pl => {
  const pl = plate(), { S, L, D } = pl, r = rng(41);
  S([[-10, -10], [W + 10, -10], [W + 10, 560], [-10, 560]], C.sky1); S([[-10, 500], [W + 10, 520], [W + 10, 900], [-10, 880]], C.sky2); S([[-10, 860], [W + 10, 880], [W + 10, 1200], [-10, 1200]], C.sky3);
  sun(S, 190, 330, 70);
  [[40, 1160, 260], [130, 1170, 200], [930, 1150, 280], [1030, 1166, 210], [470, 1170, 150]].forEach(([x, b, h]) => palmyra(S, L, x, b, h));
  S([[-10, 1160], [W + 10, 1150], [W + 10, H + 10], [-10, H + 10]], C.paddy);
  for (let i = 0; i < 18; i++) { const y = 1180 + i * i * 2.6 + i * 18; D([[-20, y], [W + 20, y - 10]], 8 + i * 0.8, i % 2 ? C.paddyD : mix(C.paddy, "#e6edb0", 0.35)); }
  S(sm([[180, H + 10], [420, 1300], [470, 1180], [500, 1180], [520, 1300], [400, H + 10]]), C.bund);
  // the burr: a globe of bracts, each a stiff awl ending in a hook curled back (Arctium lappa)
  const c: P = [690, 900], R = 380, grow = ph(t, 0, 20);
  const tip = (a: number, l: number): P => [c[0] + Math.cos(a) * (R * 0.82 + l), c[1] + Math.sin(a) * (R * 0.82 + l)];
  const hook = (e: P, a: number, side: number, hr: number, w: number, col: string) => { const pts: P[] = []; for (let k = 0; k <= 7; k++) { const q = a + side * (Math.PI / 2) + side * (k / 7) * Math.PI * 1.25; pts.push([e[0] + Math.cos(a + side * Math.PI / 2) * hr + Math.cos(q + Math.PI) * hr, e[1] + Math.sin(a + side * Math.PI / 2) * hr + Math.sin(q + Math.PI) * hr]); } L(pts, w, col); };
  const spines = Array.from({ length: 64 }, (_, i) => ({ a: (i / 64) * Math.PI * 2 + r() * 0.05, l: R * (0.3 + r() * 0.08), side: r() < 0.5 ? -1 : 1 }));
  spines.forEach(({ a, l, side }) => { const b0: P = [c[0] + Math.cos(a) * R * 0.78, c[1] + Math.sin(a) * R * 0.78], e = tip(a, l * grow), lit = Math.cos(a + 2.3) > 0.2; S(bar(b0, e, 20, 6), lit ? C.burrL : C.burrD); if (grow > 0.9) hook(e, a, side, 17, 6, lit ? "#e2c48a" : "#c79a5a"); });
  S(ell(c[0], c[1], R * 0.86, R * 0.86, 0, 60), C.burr);
  S(sm([[c[0] - R * 0.84, c[1] - R * 0.2], [c[0] - R * 0.5, c[1] - R * 0.72], [c[0] - R * 0.1, c[1] - R * 0.85], [c[0] - R * 0.4, c[1] - R * 0.55], [c[0] - R * 0.62, c[1] - R * 0.1]]), C.burrL);
  S(sm([[c[0] + R * 0.84, c[1] + R * 0.1], [c[0] + R * 0.5, c[1] + R * 0.7], [c[0], c[1] + R * 0.86], [c[0] + R * 0.45, c[1] + R * 0.5], [c[0] + R * 0.66, c[1]]]), C.burrD);
  // the face of the globe: rows of bract tips coming at us, each a little hook
  for (let i = 0; i < 70; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * R * 0.74, p: P = [c[0] + Math.cos(a) * d, c[1] + Math.sin(a) * d], sd = r() < 0.5 ? -1 : 1; S(bar([p[0], p[1] + 14], [p[0], p[1] - 6], 7, 3), C.burrD); hook([p[0], p[1] - 6], -Math.PI / 2, sd, 7, 3.2, i % 3 ? "#c79a5a" : "#e2c48a"); }
  // the hook that catches the frock
  const hem0: P = [600 + 86 * 1.2, 1770 - 150 * 1.2], catchT = ph(t, 50, 60), pull = ph(t, 60, 95) * (1 + 0.25 * Math.sin(t * 0.35) * ph(t, 70, 90));
  const kLean = -0.13 * pull, hookTip: P = [hem0[0] + 14, hem0[1] - 10];
  const hb: P = [c[0] + Math.cos(2.1) * R * 0.8, c[1] + Math.sin(2.1) * R * 0.8], ht: P = [lerp(hb[0], hookTip[0], grow), lerp(hb[1], hookTip[1], grow)];
  S(bar(hb, ht, 22, 7), C.burrD);
  // Amma and Kavya: she reaches up to touch it, the hook takes her hem, she pulls, both laugh
  const reach = ph(t, 12, 45) * (1 - ph(t, 60, 80)), laughing = t > 64;
  amma(pl, { x: 250, y: 1770, s: 1.2, face: laughing ? "laugh" : t > 18 ? "wow" : "calm", look: laughing ? -0.12 : -0.18, near: laughing ? TO_MOUTH : { a: lerp(0.15, 0.95, ph(t, 20, 40)), e: lerp(0.3, 0.9, ph(t, 20, 40)), hand: "point" }, far: { a: -0.08, e: 0.35, hand: "open" }, bob: laughing ? Math.abs(Math.sin(t * 0.5)) * 6 : 0 });
  kavya(pl, { x: 600, y: 1770, s: 1.2, face: laughing ? "laugh" : t > 10 ? "wow" : "calm", look: laughing ? 0.05 : -0.3, lean: kLean, near: { a: lerp(0.3, 2.0, reach), e: lerp(0.3, 0.5, reach), hand: "open" }, far: { a: -0.1 - pull * 0.4, e: 0.4, hand: "open" }, hem: catchT > 0 ? [lerp(hem0[0], hookTip[0], catchT), lerp(hem0[1], hookTip[1], catchT)] : null, bob: laughing ? Math.abs(Math.sin(t * 0.55 + 1)) * 5 : 0 });
  // the hook lies over the cloth it has caught
  const ha = Math.atan2(ht[1] - hb[1], ht[0] - hb[0]); hook(ht, ha, 1, 20, 7, "#e2c48a");
  return pl;
};

// ---------------------------------------------------------------- 2. KINGFISHER -> BULLET TRAIN
export const king = { len: 135, entry: [190, 330, 70] as Circle, exit: [898, 994, 20] as Circle };
// a white-throated kingfisher (Halcyon smyrnensis), profile to the left: chestnut head and belly,
// a white bib, turquoise back and wings, a long red dagger bill
const kingfisher = (S: Pl["S"], L: Pl["L"], o: P, s: number, a: number, wing: number) => {
  const M = (x: number, y: number): P => [o[0] + (x * Math.cos(a) - y * Math.sin(a)) * s, o[1] + (x * Math.sin(a) + y * Math.cos(a)) * s];
  S(sm([M(40, -6), M(70, 0), M(96, 14), M(70, 14), M(40, 10)], true, 3), C.kfBlue);                       // the tail
  S(sm([M(-30, -20), M(10, -26), M(46, -12), M(50, 8), M(10, 22), M(-26, 16)]), C.kfBrown);               // body
  S(sm([M(-6, -24), M(30, -20 - wing * 30), M(62, -8 - wing * 10), M(40, 6), M(0, 2)]), C.kfBlue);        // the wing
  S(sm([M(6, -18), M(30, -16 - wing * 22), M(48, -8), M(24, -4)]), C.kfBlueL);
  S(sm([M(-30, -20), M(-40, 2), M(-22, 14), M(-14, -4)]), C.kfWhite);                                     // the white bib
  S(ell(...M(-34, -26), 20 * s, 18 * s), C.kfBrown);                                                       // head
  S([M(-50, -30), M(-104, -20), M(-50, -18)], C.kfRed);                                                    // the bill
  S(ell(...M(-40, -30), 4 * s, 4 * s), C.ink); L([M(-50, -24), M(-100, -21)], 1);
};
export const buildKing = (t: number): Pl => {
  const pl = plate(), { S, L, D } = pl;
  S([[-10, -10], [W + 10, -10], [W + 10, 560], [-10, 560]], "#f2c99a"); S([[-10, 520], [W + 10, 530], [W + 10, 880], [-10, 880]], "#f7e3b6");
  sun(S, 190, 330, 70);
  // the far bank, a long low line of palms; the railway bridge across the backwater
  S([[-10, 820], [W + 10, 810], [W + 10, 880], [-10, 890]], C.palmD);
  for (let i = 0; i < 14; i++) { const x = i * 82 + 20, h = 90 + (i % 3) * 30; coconut(S, L, [x, 830], [x + 10, 830 - h], h, Math.sin(t * 0.1 + i)); }
  S([[-10, 880], [W + 10, 870], [W + 10, H + 10], [-10, H + 10]], C.water);
  for (let i = 0; i < 14; i++) { const y = 920 + i * 70; D([[-20, y], [W + 20, y - 6]], 6 + i, C.waterL); }
  // the railway bridge across the water, close
  S([[-10, 1040], [W + 10, 1024], [W + 10, 1072], [-10, 1088]], "#8a7c6e"); for (let i = 0; i < 6; i++) { const x = 60 + i * 200; S([[x, 1070], [x + 34, 1068], [x + 40, 1230], [x - 6, 1234]], "#7a6c5e"); }
  // the kingfisher on a dead branch, then the dive: it enters the water with barely a ripple
  S(bar([1090, 600], [740, 700], 14, 7), C.trunk);
  const dive = ph(t, 15, 48), sp: P = [lerp(820, 720, dive), lerp(640, 1500, dive * dive)], ang = lerp(0, -1.25, ph(t, 15, 25));
  if (t < 50) kingfisher(S, L, sp, 2.6, ang, t < 15 ? 0 : 0.2 + 0.2 * Math.sin(t));
  if (t > 46 && t < 75) { const k = ph(t, 46, 75); L(ell(720, 1500, 40 + 90 * k, 10 + 22 * k, 0, 30), 2.4, C.waterL); }
  // and out of the same idea, the same beak made long: the bullet train's nose, along the bridge
  const run = ph(t, 50, 118), nx = lerp(-300, 940, 1 - (1 - run) * (1 - run));
  if (t > 50) {
    const y = 960, k = 2.1, X = (x: number) => nx + x * k, Y = (v: number) => y + v * k;
    S([[X(0), Y(20)], [X(-90), Y(-12)], [X(-220), Y(-30)], [X(-900), Y(-34)], [X(-900), Y(46)], [X(-200), Y(46)]], C.train);
    S([[X(-900), Y(24)], [X(-140), Y(26)], [X(-40), Y(30)], [X(-900), Y(34)]], C.trainB); S([[X(-150), Y(-22)], [X(-70), Y(-4)], [X(-120), Y(-4)], [X(-200), Y(-22)]], C.night2);
    for (let i = 0; i < 6; i++) { const wx = -280 - i * 110; S([[X(wx), Y(-18)], [X(wx + 64), Y(-18)], [X(wx + 64), Y(2)], [X(wx), Y(2)]], C.night2); }
    if (run < 0.95) for (let i = 0; i < 6; i++) L([[X(-920 - i * 30), Y(-20 + i * 12)], [X(-1000 - i * 70), Y(-20 + i * 12)]], 1.6);
    S(ell(X(-20), Y(16), 10 * k, 7 * k), "#fff6c8");
  }
  // Amma and Kavya in a vallam on the near water, pointing
  const boatY = 1700;
  amma(pl, { x: 330, y: boatY + 120, s: 1.0, face: t > 20 ? "wow" : "calm", look: -0.25, near: { a: lerp(0.4, 1.9, ph(t, 55, 75)), e: 0.3, hand: "point" }, far: { a: -0.05, e: 0.4 } });
  kavya(pl, { x: 600, y: boatY + 110, s: 1.0, face: t > 70 ? "laugh" : t > 18 ? "wow" : "calm", look: -0.35, near: { a: lerp(1.2, 2.3, ph(t, 20, 40)), e: 0.2, hand: "point" }, far: { a: -0.1, e: 0.5 }, bob: Math.abs(Math.sin(t * 0.3)) * 3 });
  S(sm([[60, boatY + 20], [980, boatY], [900, boatY + 130], [160, boatY + 140]], true, 4), C.boat); S([[80, boatY + 30], [970, boatY + 10], [960, boatY + 26], [90, boatY + 46]], C.burrL);
  L([[60, boatY + 20], [980, boatY]], 1.8);
  return pl;
};

// ---------------------------------------------------------------- 3. THE FLOATING NEEDLE COMPASS
export const compass = { len: 135, entry: [540, 1060, 480] as Circle, exit: [540, 1060, 30] as Circle };
export const buildCompass = (t: number): Pl => {
  const pl = plate(), { S, L } = pl;
  // the table from the nap, seen from above, and the steel bowl from it, now a lake
  S([[-10, -10], [W + 10, -10], [W + 10, H + 10], [-10, H + 10]], C.table);
  S(ell(540, 1060, 520, 620, 0, 64), C.steelD); S(ell(540, 1050, 500, 600, 0, 64), C.steel); S(ell(540, 1060, 460, 560, 0, 64), C.water);
  S(sm([[200, 640], [420, 560], [320, 700]]), C.steelL);
  // the compass card painted in the water: N, E, S, W ticks, so the turn can be read
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2 - Math.PI / 2, r0 = i % 4 ? 400 : 370; L([[540 + Math.cos(a) * r0, 1060 + Math.sin(a) * r0 * 1.2], [540 + Math.cos(a) * 430, 1060 + Math.sin(a) * 430 * 1.2]], i % 4 ? 1.4 : 3, C.cream); }
  L([[510, 500], [510, 440], [570, 500], [570, 440]], 4, C.cream);                                         // the N, in pen
  // the leaf raft with the needle on it: it swings, overshoots, settles north-south
  const turn = ph(t, 15, 100), ang = lerp(1.2, 0, turn) + Math.sin(turn * Math.PI * 3) * 0.35 * (1 - turn), raft = ang * 0.6;
  const R = (x: number, y: number, a: number): P => [540 + x * Math.cos(a) - y * Math.sin(a), 1060 + x * Math.sin(a) + y * Math.cos(a)];
  S(sm([R(0, -300, raft), R(120, -140, raft), R(130, 80, raft), R(0, 300, raft), R(-130, 80, raft), R(-120, -140, raft)]), C.leaf);
  L([R(0, -290, raft), R(0, 290, raft)], 2, "#4f7a2a"); for (let i = -3; i <= 3; i++) L([R(0, i * 70, raft), R(100, i * 70 - 60, raft)], 1.2, "#4f7a2a");
  S(bar(R(0, -330, ang), R(0, 330, ang), 9, 4), C.steelL); S(ell(...R(0, -330, ang), 12, 12), "#d2462a"); L([R(0, -330, ang), R(0, 330, ang)], 1.4);
  // the two of them on the leaf, holding the needle's eye between them
  const fx = R(-60, 160, raft), fy = R(70, 170, raft);
  amma(pl, { x: fx[0], y: fx[1], s: 0.42, face: t > 30 ? "wow" : "calm", look: -0.2, near: { a: 1.2, e: 0.4, hand: "open" } });
  kavya(pl, { x: fy[0], y: fy[1], s: 0.42, flip: -1, face: t > 95 ? "laugh" : t > 25 ? "wow" : "calm", look: -0.2, near: { a: lerp(0.8, 2.6, ph(t, 95, 110)), e: 0.2, hand: "point" } });
  return pl;
};

// ---------------------------------------------------------------- 4. A SEED BECOMES A BANYAN
export const banyan = { len: 135, entry: [560, 1430, 18] as Circle, exit: [540, 600, 60] as Circle };
export const buildBanyan = (t: number): Pl => {
  const pl = plate(), { S, L, D } = pl, r = rng(77);
  S([[-10, -10], [W + 10, -10], [W + 10, 1260], [-10, 1260]], "#bfe0dc"); S([[-10, 800], [W + 10, 800], [W + 10, 1260], [-10, 1260]], "#e9e0c2");
  // a Tamil village street: thinnai houses, lime-white walls, red-oxide pillars, tiled roofs
  [[-40, 330], [700, 420]].forEach(([x, w]) => { S([[x, 980], [x + w, 980], [x + w, 1270], [x, 1270]], C.lime); S([[x - 30, 990], [x + w * 0.5, 900], [x + w + 30, 990]], C.tile); S([[x, 1200], [x + w, 1200], [x + w, 1270], [x, 1270]], "#d9cfb8"); for (let i = 0; i < 4; i++) { const px = x + 40 + i * (w - 80) / 3; S([[px, 1010], [px + 16, 1010], [px + 16, 1200], [px, 1200]], C.oxide); } });
  S([[-10, 1260], [W + 10, 1250], [W + 10, H + 10], [-10, H + 10]], C.earth);
  for (let i = 0; i < 10; i++) { const y = 1300 + i * 62; D([[-20 + r() * 200, y], [600 + r() * 400, y - 6]], 12, mix(C.earth, "#e7b48a", 0.3)); }
  // the seed falls from her palm, splits, and the tree grows at a time-lapse pace
  const g = ph(t, 22, 118), seedY = lerp(1440, 1560, ph(t, 6, 22)), base: P = [560, 1560];
  if (t < 26) S(ell(560, seedY, 9, 7), "#5a3a26");
  if (g > 0) {
    const th = 6 + 120 * g, top = base[1] - 900 * ph(t, 22, 90);
    S(sm([[base[0] - th, base[1] + 6], [base[0] - th * 0.5, lerp(base[1], top, 0.5)], [base[0] - th * 0.35, top], [base[0] + th * 0.35, top], [base[0] + th * 0.5, lerp(base[1], top, 0.5)], [base[0] + th, base[1] + 6]], true, 4), C.bark);
    S(sm([[base[0] + th * 0.1, base[1] + 6], [base[0] + th * 0.2, lerp(base[1], top, 0.5)], [base[0] + th * 0.35, top], [base[0] + th * 0.5, lerp(base[1], top, 0.5)], [base[0] + th, base[1] + 6]], true, 4), C.barkD);
    const br = ph(t, 40, 110);
    [[-1, 0.62], [1, 0.58], [-1, 0.4], [1, 0.32]].forEach(([dir, yk], i) => { const y0 = lerp(base[1], top, yk), l = 480 * br * (1 - i * 0.1); S(bar([base[0] + dir * th * 0.3, y0], [base[0] + dir * l, y0 - 160 * br], 26 * br + 4, 8), C.bark); });
    const cr = ph(t, 50, 118);
    for (let i = 0; i < 26; i++) { const a = r() * Math.PI, d = r() * 520 * cr, x = base[0] + Math.cos(a) * d * 1.05, y = top - Math.sin(a) * d * 0.42 + 40; S(ell(x, y, (90 + r() * 70) * cr, (60 + r() * 40) * cr, r() * 0.6), i % 3 ? C.banyan : C.banyanD); }
    // the aerial roots let down from the branches, the oldest already thick as trunks
    const rt = ph(t, 70, 125);
    for (let i = 0; i < 14; i++) { const x = base[0] + (i - 6.5) * 72 + r() * 20, y0 = top - 10 + Math.abs(i - 6.5) * 22, y1 = lerp(y0, base[1] + 10, clamp(rt * 1.4 - (i % 4) * 0.12)); if (y1 > y0 + 4 && Math.abs(x - base[0]) > th) L([[x, y0], [x + 4, (y0 + y1) / 2], [x - 2, y1]], i % 4 ? 2 : 4.5, C.barkD); }
  }
  // Kavya holds out her palm, then both look up; Amma's arm round her
  const look = ph(t, 40, 80);
  amma(pl, { x: 330, y: 1820, s: 1.15, face: t > 50 ? "wow" : "smile", look: lerp(-0.05, -0.45, look), near: { a: lerp(0.2, 1.2, ph(t, 60, 90)), e: lerp(0.3, 1.5, ph(t, 60, 90)), hand: "open" }, far: { a: -0.1, e: 0.3 } });
  kavya(pl, { x: 640, y: 1830, s: 1.15, flip: -1, face: t > 46 ? "wow" : "smile", look: lerp(0.1, -0.5, look), near: { a: lerp(1.3, 0.3, ph(t, 10, 30)), e: lerp(0.8, 0.3, ph(t, 10, 30)), hand: "open" }, far: { a: -0.1, e: 0.4 } });
  return pl;
};

// ---------------------------------------------------------------- 5. TWO MIRRORS, FOR EVER
export const mirrors = { len: 135, entry: [540, 600, 60] as Circle, exit: [540, 1000, 14] as Circle };
export const buildMirrors = (t: number): Pl => {
  const pl = plate(), { S, L } = pl;
  S([[-10, -10], [W + 10, -10], [W + 10, H + 10], [-10, H + 10]], "#3b2f5c");
  // the mirror ahead: a frame inside a frame inside a frame, each a little smaller, each image
  // one bounce later; the reflections wave a beat behind the one before (light takes time)
  const n = 9, vp: P = [540, 1000];
  for (let k = n; k >= 1; k--) {
    const s = Math.pow(0.68, k), w = 900 * s, h = 1500 * s, cy = lerp(vp[1], 1000, 0), x0 = vp[0] - w / 2, y0 = cy - h / 2;
    S([[x0 - 30 * s, y0 - 30 * s], [x0 + w + 30 * s, y0 - 30 * s], [x0 + w + 30 * s, y0 + h + 30 * s], [x0 - 30 * s, y0 + h + 30 * s]], C.frame);
    S([[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]], k % 2 ? C.mirror : C.mirrorD);
    const dt = t - k * 6, wave = dt > 20 ? Math.sin((dt - 20) * 0.3) : 0, fl = (k % 2 ? -1 : 1) as 1 | -1;
    amma(pl, { x: vp[0] - 160 * s * fl, y: y0 + h - 40 * s, s: 1.05 * s, flip: fl, face: dt > 30 ? "laugh" : "wow", look: -0.1, near: { a: 2.4 + wave * 0.3, e: 0.6, hand: "open" } });
    kavya(pl, { x: vp[0] + 150 * s * fl, y: y0 + h - 40 * s, s: 1.05 * s, flip: (-fl) as 1 | -1, face: dt > 25 ? "laugh" : "wow", look: -0.1, near: { a: 2.6 - wave * 0.3, e: 0.4, hand: "open" } });
  }
  // the near pair, real, seen from behind at the frame's foot, waving
  const wave = t > 20 ? Math.sin((t - 20) * 0.3) : 0;
  S([[-10, 1700], [W + 10, 1690], [W + 10, H + 10], [-10, H + 10]], "#2a2146");
  amma(pl, { x: 330, y: 2080, s: 1.4, flip: -1, face: "laugh", look: 0.1, near: { a: 2.4 + wave * 0.3, e: 0.6, hand: "open" } });
  kavya(pl, { x: 760, y: 2090, s: 1.4, face: "laugh", look: 0.1, near: { a: 2.6 - wave * 0.3, e: 0.4, hand: "open" } });
  L([[0, 1700], [W, 1690]], 1.5, C.cream);
  return pl;
};

// ---------------------------------------------------------------- 6. MY ADDRESS IN THE UNIVERSE
// Nested pictures, each 8x the one inside it: their terrace in Chennai, the Coromandel coast, India
// on the globe, the Earth and Moon, the stars, where IAm sits on a stone step reading.
export const cosmos = { len: 150, entry: [540, 1000, 14] as Circle, exit: [560, 900, 18] as Circle };
export const ZOOM = 8;
export const cosmosLayer = (k: number, t: number): Pl => {
  const pl = plate(), { S, L } = pl, r = rng(900 + k);
  if (k === 0) {        // the terrace at dusk: the two of them on a Chennai rooftop, looking up
    S([[-10, -10], [W + 10, -10], [W + 10, H + 10], [-10, H + 10]], C.night2); S([[-10, 900], [W + 10, 900], [W + 10, 1300], [-10, 1300]], "#6a4a7a");
    for (let i = 0; i < 40; i++) S(ell(r() * W, r() * 880, 2 + r() * 3, 2 + r() * 3), C.star);
    S([[-10, 1300], [W + 10, 1300], [W + 10, H + 10], [-10, H + 10]], "#b9a89a"); S([[-10, 1300], [W + 10, 1300], [W + 10, 1360], [-10, 1360]], "#d8c9b8");
    coconut(S, L, [980, 1300], [940, 820], 480, Math.sin(t * 0.1)); coconut(S, L, [80, 1300], [120, 900], 400, Math.cos(t * 0.1));
    amma(pl, { x: 400, y: 1820, s: 1.1, face: "wow", look: -0.5, near: { a: 2.5, e: 0.2, hand: "point" } });
    kavya(pl, { x: 680, y: 1830, s: 1.1, face: "wow", look: -0.55, near: { a: 2.3, e: 0.5, hand: "open" } });
  } else if (k === 1) { // the coast: city blocks, the long beach, the Bay of Bengal
    S([[-10, -10], [W + 10, -10], [W + 10, H + 10], [-10, H + 10]], C.city);
    for (let i = 0; i < 60; i++) { const x = r() * 700, y = r() * H; S([[x, y], [x + 30 + r() * 40, y], [x + 30 + r() * 40, y + 20 + r() * 40], [x, y + 20 + r() * 40]], r() < 0.5 ? "#c7b28c" : "#e6d6b8"); }
    S(sm([[700, -10], [780, 600], [760, 1200], [800, H + 10], [W + 10, H + 10], [W + 10, -10]], true, 3), C.sea); S(sm([[690, -10], [770, 600], [750, 1200], [790, H + 10], [810, H + 10], [780, 1200], [800, 600], [720, -10]], true, 3), C.sand);
  } else if (k === 2) { // India on the globe, Chennai on its south-east coast
    S([[-10, -10], [W + 10, -10], [W + 10, H + 10], [-10, H + 10]], C.ocean);
    S(sm([[300, 300], [520, 260], [700, 360], [820, 420], [760, 560], [660, 640], [620, 820], [560, 1060], [520, 1240], [470, 1080], [400, 820], [330, 620], [250, 560], [230, 420]], true, 4), C.india);
    S(ell(560, 1000, 10, 10), "#f6ecd2"); L(ell(560, 1000, 22, 22, 0, 24), 2, C.cream, true);
  } else if (k === 3) { // the Earth and the Moon, in space
    S([[-10, -10], [W + 10, -10], [W + 10, H + 10], [-10, H + 10]], C.night);
    for (let i = 0; i < 80; i++) S(ell(r() * W, r() * H, 1.5 + r() * 2.5, 1.5 + r() * 2.5), C.star);
    S(ell(540, 960, 300, 300, 0, 60), C.ocean); S(sm([[480, 760], [620, 740], [700, 860], [640, 1000], [580, 1120], [520, 1000], [430, 900]], true, 4), C.india); S(sm([[300, 900], [380, 820], [420, 960], [360, 1040]], true, 3), C.india);
    S(sm([[540, 660], [740, 720], [840, 960], [740, 1200], [540, 1260], [700, 1160], [790, 960], [700, 760]], true, 4), "#16346a");
    S(ell(880, 560, 70, 70), "#d9d4c4");
  } else {              // the stars, and IAm on his stone step, reading; he looks up
    S([[-10, -10], [W + 10, -10], [W + 10, H + 10], [-10, H + 10]], C.night);
    for (let i = 0; i < 160; i++) { const s = 1.2 + r() * 3; S(ell(r() * W, r() * H, s, s), C.star); }
    S(sm([[0, 1500], [400, 1380], [800, 1420], [W, 1560], [W, 1800], [0, 1800]], true, 4), "#2c2058");
    for (let i = 0; i < 30; i++) { const a = r() * Math.PI * 2, d = 200 + r() * 700; S(ell(560 + Math.cos(a) * d, 900 + Math.sin(a) * d * 0.4, 2, 2), "#e7d6ff"); }
    iam(S, L, t);
  }
  return pl;
};
// IAm (DESIGN.md): a lion-man as old as the oldest carving, majestic, never cute: four arms, a
// third eye, a black-ink lotus tattoo over his heart, a tawny mane with dark tips, deep indigo
// trousers, a sage green sash; he sits on a stone step reading a book, and looks up.
const iam = (S: Pl["S"], L: Pl["L"], t: number) => {
  const up = ph(t, 90, 125), o: P = [600, 1300];
  const M = (x: number, y: number): P => [o[0] + x, o[1] + y];
  S([M(-300, 60), M(300, 60), M(320, 200), M(-320, 200)], "#8a8496"); S([M(-300, 60), M(300, 60), M(300, 80), M(-300, 80)], "#a9a3b6");     // the stone step
  // legs, crossed at the ankle, indigo trousers
  S(sm([M(-230, 40), M(-120, -30), M(0, -10), M(120, -30), M(230, 40), M(210, 110), M(0, 90), M(-210, 110)], true, 4), C.indigo);
  S(sm([M(-120, 40), M(0, 20), M(120, 40), M(100, 80), M(-100, 80)], true, 3), "#232057");
  [-50, 50].forEach((x) => { S(ell(...M(x, 74), 46, 24), C.lion); for (let i = -1; i <= 1; i++) L([M(x + i * 16, 62), M(x + i * 16, 84)], 1.4); });
  // torso, the sage sash across it, the lotus over the heart
  S(sm([M(-110, -330), M(110, -330), M(130, -100), M(100, 0), M(-100, 0), M(-130, -100)], true, 4), C.lion);
  S(sm([M(-110, -330), M(-60, -340), M(130, -60), M(110, -20)], true, 3), C.sage);
  const lot = M(-30, -230); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * 0.45; L([lot, [lot[0] + Math.cos(a - 0.2) * 22, lot[1] + Math.sin(a - 0.2) * 34], [lot[0] + Math.cos(a) * 30, lot[1] + Math.sin(a) * 44], [lot[0] + Math.cos(a + 0.2) * 22, lot[1] + Math.sin(a + 0.2) * 34], lot], 2.2, C.ink); }
  // four arms: the lower front pair holds the book on his lap; the upper pair rests apart on his knees and the step
  const arm = (sh: P, el: P, wr: P, w: number) => { S(limb([M(...sh), M(...el), M(...wr)], [w, w * 0.85, w * 0.7], 4).poly, C.lion); S(ell(...M(wr[0], wr[1] + 10), w * 0.9, w * 0.7), "#d8ad6c"); };
  arm([-125, -300], [-215, -160], [-200, 20], 34); arm([125, -300], [215, -160], [200, 20], 34);
  arm([-110, -250], [-120, -120], [-40, -70], 28); arm([110, -250], [120, -120], [40, -70], 28);
  S([M(-90, -110), M(90, -110), M(100, -40), M(-100, -40)], C.cream); S([M(-4, -112), M(4, -112), M(4, -40), M(-4, -40)], C.indigo);
  for (let i = 0; i < 4; i++) L([M(-80, -96 + i * 14), M(-14, -96 + i * 14)], 1.2, "#8eaac0");
  // the head: a heavy mane with dark tips, a long strong muzzle, a heavy brow, a third eye; reading, then looking up
  const hy = -420 - up * 20, ha = lerp(0.35, 0, up);
  const Hd = (x: number, y: number): P => M(x * Math.cos(ha) - (y) * Math.sin(ha) * 0.3, hy + y + x * Math.sin(ha) * 0.2);
  S(sm([Hd(-160, 60), Hd(-100, 200), Hd(100, 200), Hd(160, 60)], true, 4), C.maneD);                              // the mane falls to his chest
  for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2; S(ell(...Hd(Math.cos(a) * 168, Math.sin(a) * 178), 64, 76, a), C.maneD); }
  for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2 + 0.17; S(ell(...Hd(Math.cos(a) * 140, Math.sin(a) * 150), 58, 70, a), C.mane); }
  S(ell(...Hd(0, 0), 150, 165), C.mane);
  S(sm([Hd(-90, -70), Hd(90, -70), Hd(100, 40), Hd(60, 120), Hd(0, 140), Hd(-60, 120), Hd(-100, 40)], true, 4), C.lion);
  S(sm([Hd(-42, 30), Hd(42, 30), Hd(52, 100), Hd(0, 124), Hd(-52, 100)], true, 4), "#e3c894");                    // the muzzle
  S(sm([Hd(-20, 64), Hd(20, 64), Hd(0, 84)], true, 2), C.maneD);                                                  // the nose
  S(sm([Hd(-80, -36), Hd(-20, -44), Hd(-20, -32), Hd(-80, -24)], true, 2), C.maneD); S(sm([Hd(80, -36), Hd(20, -44), Hd(20, -32), Hd(80, -24)], true, 2), C.maneD);  // the heavy brow
  const eo = up > 0.5; [-48, 48].forEach((x) => { if (eo) { S(ell(...Hd(x, -10), 14, 9), "#f0d27a"); S(ell(...Hd(x, -10), 5, 8), C.ink); } else L([Hd(x - 14, -8), Hd(x, -2), Hd(x + 14, -8)], 2.4); });
  S(ell(...Hd(0, -58), 7, 11), eo ? "#f0d27a" : C.maneD); if (eo) S(ell(...Hd(0, -58), 3, 7), C.ink);            // the third eye
  L([Hd(0, 84), Hd(0, 100), Hd(-22, 112)], 2); L([Hd(0, 100), Hd(22, 112)], 2);
};
export type Arms = Arm;
