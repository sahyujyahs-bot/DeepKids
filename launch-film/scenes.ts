import { rng, type Ctx, type Env, type P } from "./core";
import { clamp, lerp, mix } from "./gallery";
import { ammaBust, kavyaBust } from "./bust";
import { camSet, drawPlate, ell, limb, plate, sm, type Cam } from "./gouache";

// THE DREAM, redrawn so each scene TELLS its activity (storyboards: the founder's Canva frames for
// the kingfisher and the compass; the same recipe for the rest). Each is a close two-shot:
// Amma and Kavya big, their hands doing the experiment a family can do at home, the result in the
// middle of the frame, both of them wowed; one line of caption says what it is.
// Each scene draws BACK (world and people) then FRONT (the table or ground and the props), so no
// ink line of a body shows through the table in front of it.

type Pl = ReturnType<typeof plate>;
export type Circle = [number, number, number];
export type DScene = { id: string; len: number; entry: Circle; exit: Circle; bg: string; caption: [string, string?]; build: (t: number) => { back: Pl; front?: Pl } };
const W = 1080, H = 1920;
const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const ph = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const bar = (a: P, b: P, w: number, w2 = w) => limb([a, b], [w, w2], 2).poly;
const rect = (x0: number, y0: number, x1: number, y1: number): P[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const C = {
  ink: "#1d1a17", cream: "#f6ecd2", paper: "#f4ead0", skin: "#b8774a",
  oxide: "#9a3b25", oxideL: "#b0503a", wallW: "#efe2c4", pillar: "#e8dcc0", shawl: "#8f2f2a", shawlL: "#b04a3a", wool: "#f1e3c6",
  burr: "#7a4a24", burrD: "#57331a", burrL: "#a8743c", hook: "#e2c48a", velcro: "#3d6c9c",
  sky: "#cfe6e6", skyW: "#f7e3b6", water: "#3f8f8a", waterL: "#7cc0b4", palm: "#5d8a3c", palmD: "#3f6a2c", trunk: "#6b4a32", bank: "#7a5a3a",
  kfBlue: "#1f8fc4", kfBlueL: "#57c2e6", kfBrown: "#8a3f1c", kfWhite: "#f7f1e4", kfRed: "#d2351f", train: "#f2f1ec", trainB: "#2c5aa0", night2: "#2c2058",
  table: "#7c3d21", tableL: "#94502d", steel: "#b7bbbf", steelD: "#8d9297", steelL: "#e3e5e6", waterB: "#a9c3c8", leaf: "#6f9a3c", magnet: "#d2351f", gold: "#e8b13a", wall: "#e0ad4c",
  lime: "#f1ead8", tile: "#b5502c", earth: "#b9553a", fig: "#c0392b", figIn: "#f0c9a0", banyan: "#4f7f3a", banyanD: "#3a6230", bark: "#7b6250", barkD: "#5a4636",
  room: "#3b2f5c", mirror: "#a9cfd0", mirrorD: "#7fb0b4", brass: "#c9932e", flame: "#ffd46a",
  night: "#1e1436", dusk: "#6a4a7a", star: "#fdf6d8", terrace: "#b9a89a", ocean: "#245a8c", land: "#7fae4a", lion: "#c99a5a", mane: "#a8743c", maneD: "#5a3a1c", indigo: "#2d2a6e", sage: "#8fae8a",
};
const hook = (L: Pl["L"], e: P, a: number, side: number, hr: number, w: number, col: string) => { const pts: P[] = []; for (let k = 0; k <= 7; k++) { const q = a + side * (Math.PI / 2) + side * (k / 7) * Math.PI * 1.25; pts.push([e[0] + Math.cos(a + side * Math.PI / 2) * hr + Math.cos(q + Math.PI) * hr, e[1] + Math.sin(a + side * Math.PI / 2) * hr + Math.sin(q + Math.PI) * hr]); } L(pts, w, col); };
const burrBall = (S: Pl["S"], L: Pl["L"], c: P, R: number, n: number, seed: number) => { const r = rng(seed); for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + r() * 0.05, l = R * (0.32 + r() * 0.08), b0: P = [c[0] + Math.cos(a) * R * 0.78, c[1] + Math.sin(a) * R * 0.78], e: P = [c[0] + Math.cos(a) * (R * 0.82 + l), c[1] + Math.sin(a) * (R * 0.82 + l)], lit = Math.cos(a + 2.3) > 0.2; S(bar(b0, e, R * 0.05, R * 0.016), lit ? C.burrL : C.burrD); hook(L, e, a, r() < 0.5 ? -1 : 1, R * 0.045, Math.max(1.2, R * 0.016), lit ? C.hook : "#c79a5a"); } S(ell(c[0], c[1], R * 0.86, R * 0.86, 0, 48), C.burr); S(sm([[c[0] - R * 0.8, c[1] - R * 0.2], [c[0] - R * 0.4, c[1] - R * 0.74], [c[0] - R * 0.1, c[1] - R * 0.84], [c[0] - R * 0.5, c[1] - R * 0.4]]), C.burrL); };

// ---------------------------------------------------------------- 1. THE BURR AND VELCRO
// On the red-oxide floor of a Chennai veranda. A burr has stuck to Amma's woollen shawl. Kavya
// brings the magnifying glass over it and, in the glass, the burr's hooks hold the wool's loops.
// Amma holds up a strip of Velcro: hooks and loops, the same idea. Kavya tugs: it holds. They laugh.
const velcro: DScene = {
  id: "velcro", len: 135, bg: C.wallW, entry: [520, 1180, 150], exit: [520, 1180, 150], caption: ["A burr's tiny hooks", "gave us Velcro."],
  build: (t) => {
    const back = plate(), front = plate(), { S, L, D } = back;
    S(rect(-10, -10, W + 10, H + 10), C.wallW); S(rect(-10, -10, 140, 1200), C.pillar); S(rect(940, -10, W + 10, 1200), C.pillar);
    for (let i = 0; i < 6; i++) D([[160, 140 + i * 160], [920, 120 + i * 160]], 20, mix(C.wallW, "#ffffff", 0.4));
    burrBall(S, back.L, [560, 330], 210, 54, 5);                                                // the dream: the burr, huge, in the air
    const pull = ph(t, 72, 92) * (1 - ph(t, 110, 130) * 0.5), laugh = t > 80;
    ammaBust(back, { x: 300, y: 900, s: 2.15, face: laugh ? "laugh" : t > 20 ? "wow" : "smile", look: 0.28, bob: laugh ? Math.abs(Math.sin(t * 0.5)) * 4 : 0, near: { to: [lerp(380, 300, ph(t, 30, 50)), lerp(1250, 1000, ph(t, 30, 50))], kind: "pinch", turn: -0.6 }, far: { to: [400, 1330], kind: "flat" } });
    // the Velcro strip in her raised hand: the hook side blue, the loop side fuzzy
    const vs = ph(t, 30, 50); if (vs > 0) { const a: P = [lerp(380, 300, vs) + 20, lerp(1250, 1000, vs) - 50]; S([[a[0], a[1]], [a[0] + 26, a[1]], [a[0] + 26, a[1] - 200], [a[0], a[1] - 200]], C.velcro); S([[a[0] + 26, a[1]], [a[0] + 40, a[1]], [a[0] + 40, a[1] - 200], [a[0] + 26, a[1] - 200]], "#5b86b4"); for (let i = 0; i < 9; i++) hook(back.L, [a[0] + 6, a[1] - 14 - i * 21], Math.PI, 1, 5, 1.6, "#a7c4e4"); }
    kavyaBust(back, { x: 790, y: 960, s: 2.15, flip: -1, face: laugh ? "laugh" : "wow", look: 0.25, tilt: -0.08 * pull, bob: laugh ? Math.abs(Math.sin(t * 0.55 + 1)) * 4 : 0, near: { to: [lerp(760, 610, ph(t, 0, 28)), lerp(1240, 1260, ph(t, 0, 28))], kind: "hold", turn: 0.4 }, far: { to: [lerp(700, 560 + 30 * pull, ph(t, 60, 72)), lerp(1380, 1330 - 10 * pull, ph(t, 60, 72))], kind: "pinch" } });
    // front: the floor, Amma's shawl in her lap with the burr stuck on it, the magnifying glass
    const F = front;
    F.S(rect(-10, 1300, W + 10, H + 10), C.oxide); for (let i = 0; i < 5; i++) F.L([[-10, 1360 + i * 110], [W + 10, 1350 + i * 110]], 1.2, C.oxideL);
    F.S(sm([[60, 1290], [540 + 40 * pull, 1300 - 20 * pull], [620, 1420], [460, 1520], [80, 1500]], true, 4), C.shawl);
    for (let i = 0; i < 7; i++) F.L([[90 + i * 60, 1310], [80 + i * 64, 1490]], 1.2, C.shawlL);
    const bc: P = [540 + 30 * pull, 1330 - 14 * pull]; burrBall(F.S, F.L, bc, 34, 26, 9);
    // the glass: a brass rim, a teak handle, and in it the hooks holding the loops, big
    const gq = ph(t, 0, 28), gc: P = [lerp(760, 540, gq), lerp(1180, 1180, gq)], gr = 150;
    F.S(bar([gc[0] + gr * 0.7, gc[1] + gr * 0.7], [gc[0] + gr * 1.5, gc[1] + gr * 1.3], 18, 14), "#6a3a22");
    F.S(ell(gc[0], gc[1], gr + 14, gr + 14, 0, 60), C.brass); F.S(ell(gc[0], gc[1], gr, gr, 0, 60), mix(C.shawl, "#ffffff", 0.15));
    if (gq > 0.6) {
      const z = ph(t, 18, 40);
      for (let i = 0; i < 6; i++) { const y = gc[1] - 100 + i * 40; for (let j = 0; j < 7; j++) { const x = gc[0] - 130 + j * 44 + (i % 2) * 22; if (Math.hypot(x - gc[0], y - gc[1]) < gr - 16) F.L(ell(x, y + 10, 16, 12, 0.3, 14), 3, C.wool, true); } }
      for (let i = 0; i < 5; i++) { const x = gc[0] - 90 + i * 45, top = gc[1] - 120 + Math.abs(i - 2) * 14, bot = lerp(top + 20, gc[1] + 20 + (i % 2) * 20, z); F.S(bar([x, top], [x, bot], 9, 6), C.burrD); hook(F.L, [x, bot], Math.PI / 2, i % 2 ? 1 : -1, 13, 6, C.hook); }
    }
    F.L(ell(gc[0], gc[1], gr + 14, gr + 14, 0, 60), 2.4, C.ink, true);
    return { back, front };
  },
};

// ---------------------------------------------------------------- 2. NO SPLASH: THE KINGFISHER
// At the edge of a Kerala backwater. Kavya drops a pebble: a big splash. The kingfisher dives: hardly a
// ripple. Then the two shapes side by side in the sky: the bird's head and beak, the bullet train's nose.
const kf = (S: Pl["S"], L: Pl["L"], o: P, s: number, a: number, wing: number) => {
  const M = (x: number, y: number): P => [o[0] + (x * Math.cos(a) - y * Math.sin(a)) * s, o[1] + (x * Math.sin(a) + y * Math.cos(a)) * s];
  S(sm([M(40, -6), M(70, 0), M(96, 14), M(70, 14), M(40, 10)], true, 3), C.kfBlue);
  S(sm([M(-30, -20), M(10, -26), M(46, -12), M(50, 8), M(10, 22), M(-26, 16)]), C.kfBrown);
  S(sm([M(-6, -24), M(30, -20 - wing * 30), M(62, -8 - wing * 10), M(40, 6), M(0, 2)]), C.kfBlue); S(sm([M(6, -18), M(30, -16 - wing * 22), M(48, -8), M(24, -4)]), C.kfBlueL);
  S(sm([M(-30, -20), M(-40, 2), M(-22, 14), M(-14, -4)]), C.kfWhite); S(ell(...M(-34, -26), 20 * s, 18 * s), C.kfBrown);
  S([M(-50, -30), M(-104, -20), M(-50, -18)], C.kfRed); S(ell(...M(-40, -30), 4 * s, 4 * s), C.ink); L([M(-50, -24), M(-100, -21)], 1);
};
const splashCrown = (S: Pl["S"], L: Pl["L"], c: P, k: number, big: number) => { if (k <= 0 || k >= 1) return; const h = Math.sin(k * Math.PI) * 160 * big, w = 50 + 120 * k * big; for (let i = 0; i < 9; i++) { const a = -Math.PI * (0.1 + (i / 8) * 0.8), x = c[0] + Math.cos(a) * w, y = c[1] + Math.sin(a) * h * (0.6 + 0.4 * Math.sin(i)); S(bar([c[0] + Math.cos(a) * w * 0.4, c[1]], [x, y], 9 * big, 3), C.waterL); S(ell(x, y - 10, 9 * big, 11 * big), "#d9efe9"); } L(ell(c[0], c[1], w * 1.2, 18 + 30 * k * big, 0, 30), 2.4, C.waterL, true); };
const king: DScene = {
  id: "king", len: 135, bg: C.sky, entry: [760, 300, 110], exit: [760, 300, 110], caption: ["No splash! The kingfisher's beak", "shaped the bullet train's nose."],
  build: (t) => {
    const back = plate(), front = plate(), { S, L } = back;
    S(rect(-10, -10, W + 10, 760), C.sky); S(rect(-10, 600, W + 10, 900), C.skyW);
    S(rect(-10, 860, W + 10, 930), C.palmD); for (let i = 0; i < 12; i++) { const x = 40 + i * 92; S(bar([x, 900], [x + 14, 760 - (i % 3) * 30], 7, 5), C.trunk); S(ell(x + 14, 760 - (i % 3) * 30, 44, 18, (i % 2 ? 0.3 : -0.3)), C.palm); }
    S(rect(-10, 920, W + 10, H + 10), C.water); for (let i = 0; i < 10; i++) back.D([[-20, 980 + i * 80], [W + 20, 974 + i * 80]], 8 + i, C.waterL);
    // the sky: the bird's head beside the train's nose, the same long point (from t 75)
    const cmp = ph(t, 72, 100);
    if (cmp > 0) { kf(S, L, [260, 300], 2.6, 0, 0); const nx = lerp(1400, 980, cmp), y = 300, k = 1.6; S([[nx, y + 20 * k], [nx - 90 * k, y - 12 * k], [nx - 220 * k, y - 30 * k], [nx + 400, y - 34 * k], [nx + 400, y + 46 * k], [nx - 200 * k, y + 46 * k]].map(([x, yy]) => [x - 0, yy] as P), C.train); S([[nx + 400, y + 24 * k], [nx - 140 * k, y + 26 * k], [nx - 40 * k, y + 30 * k], [nx + 400, y + 34 * k]], C.trainB); S([[nx - 150 * k, y - 22 * k], [nx - 70 * k, y - 4 * k], [nx - 120 * k, y - 4 * k], [nx - 200 * k, y - 22 * k]], C.night2);
      if (cmp > 0.95) { for (let i = 0; i < 9; i++) L([[300 + i * 40, 250], [320 + i * 40, 250]], 2, C.ink); L([[300, 268], [640, 268]], 1.2, C.ink); } }
    // the dive, left: a kingfisher from the sky into the water, almost no splash
    const dv = ph(t, 30, 58), kp: P = [lerp(240, 300, dv), lerp(460, 1240, dv * dv)];
    if (t < 60) kf(S, L, kp, 1.9, lerp(0, -1.3, ph(t, 30, 38)), t < 30 ? 0.2 + 0.2 * Math.sin(t * 0.7) : 0);
    if (t > 58 && t < 90) L(ell(300, 1250, 20 + 40 * ph(t, 58, 90), 6 + 10 * ph(t, 58, 90), 0, 24), 2, C.waterL, true);
    // Amma pointing up at the bird, Kavya at the water's edge dropping her pebble
    ammaBust(back, { x: 250, y: 1060, s: 2.0, face: t > 34 ? (t > 100 ? "laugh" : "wow") : "smile", look: t > 70 ? -0.35 : 0.1, near: { to: t > 70 ? [500, 820] : [430, 1240], kind: t > 70 ? "point" : "open", turn: t > 70 ? -0.2 : 0 }, far: { to: [300, 1420], kind: "flat" } });
    kavyaBust(back, { x: 820, y: 1100, s: 2.0, flip: -1, face: t > 14 && t < 34 ? "laugh" : t > 34 ? "wow" : "calm", look: t > 70 ? -0.4 : 0.35, near: { to: [lerp(690, 660, ph(t, 2, 8)), lerp(1240, 1260, ph(t, 2, 8))], kind: t < 4 ? "pinch" : "open" }, far: { to: [800, 1440], kind: "flat" } });
    // front: the stone steps of the ghat; the pebble falls and splashes, big
    const F = front; F.S(sm([[-10, 1560], [W + 10, 1590], [W + 10, H + 10], [-10, H + 10]], true, 2), "#8a7c6e"); F.S(sm([[-10, 1560], [W + 10, 1590], [W + 10, 1616], [-10, 1584]], true, 2), "#a99a8a"); F.L([[-10, 1660], [W + 10, 1690]], 1.4, "#6e6255");
    const pk = ph(t, 4, 16); if (t < 16) F.S(ell(lerp(660, 650, pk), lerp(1270, 1340, pk * pk), 12, 10), "#6b6258");
    splashCrown(F.S, F.L, [650, 1350], clamp((t - 16) / 30), 1);
    return { back, front };
  },
};

// ---------------------------------------------------------------- 3. A NEEDLE THAT FINDS NORTH
// At the dining table. Kavya strokes a sewing needle with a red bar magnet, one way, again and
// again; Amma lays it on a leaf floating in a steel bowl of water; it swings and settles pointing
// north; a compass rose opens on the table around the bowl, with the N where the needle points.
const compass: DScene = {
  id: "compass", len: 135, bg: C.wall, entry: [540, 1420, 230], exit: [540, 1420, 60], caption: ["A magnetised needle", "on water always points north."],
  build: (t) => {
    const back = plate(), front = plate(), { S } = back;
    S(rect(-10, -10, W + 10, H + 10), C.wall); S(rect(640, 80, W + 10, 760), "#fbf1d2"); [700, 790, 880, 970, 1060].forEach((x) => S(bar([x, 80], [x, 760], 4), "#5f9a8b")); S(rect(620, 60, 660, 780), "#6a3a22");
    const stroke = t < 44 ? (Math.sin((t / 44) * Math.PI * 4 - Math.PI / 2) + 1) / 2 : 1, lay = ph(t, 46, 62), held: P = [lerp(470, 540, lay), lerp(1180, 1395, lay)];
    ammaBust(back, { x: 280, y: 880, s: 2.15, face: t > 70 ? "wow" : "smile", look: 0.3, near: { to: t < 62 ? [held[0] - 30, held[1] + 6] : [400, 1330], kind: t < 62 ? "pinch" : "flat", turn: -0.2 }, far: { to: [330, 1360], kind: "flat" } });
    kavyaBust(back, { x: 810, y: 920, s: 2.15, flip: -1, face: t > 70 ? (t > 105 ? "laugh" : "wow") : "calm", look: 0.3, near: { to: t < 44 ? [lerp(500, 640, stroke), 1150] : [700, 1330], kind: t < 44 ? "hold" : "flat" }, far: { to: [800, 1380], kind: "flat" } });
    if (t < 44) { const mx = lerp(500, 640, stroke); back.S(rect(mx - 14, 1120, mx + 70, 1150), C.magnet); back.S(rect(mx + 50, 1120, mx + 70, 1150), C.steelL); }
    if (t < 62) back.S(bar([held[0], held[1]], [held[0] + 150, held[1] - 6], 3, 1.5), C.steelL);
    // front: the teak table, the compass rose opening on it, the bowl, the leaf, the needle
    const F = front; F.S(rect(-10, 1260, W + 10, H + 10), C.table); for (let i = 0; i < 9; i++) F.D([[-20, 1290 + i * 70], [W + 20, 1296 + i * 70]], 10, i % 2 ? "#663117" : C.tableL);
    const rose = ph(t, 84, 118);
    if (rose > 0) { const c: P = [540, 1420], R = 470 * rose; for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2 - Math.PI / 2, l = i % 4 ? R * 0.55 : R, w = i % 4 ? 0.07 : 0.12; F.S([c, [c[0] + Math.cos(a - w) * l * 0.3, c[1] + Math.sin(a - w) * l * 0.3 * 0.42], [c[0] + Math.cos(a) * l, c[1] + Math.sin(a) * l * 0.42], [c[0] + Math.cos(a + w) * l * 0.3, c[1] + Math.sin(a + w) * l * 0.3 * 0.42]], i % 2 ? mix(C.gold, C.table, 0.4) : C.gold); } F.L(ell(c[0], c[1], R * 0.75, R * 0.75 * 0.42, 0, 60), 2.4, C.gold, true); if (rose > 0.7) F.L([[512, 1420 - R * 0.42 - 70], [512, 1420 - R * 0.42 - 20], [568, 1420 - R * 0.42 - 70], [568, 1420 - R * 0.42 - 20]], 6, C.gold); }
    F.S(ell(540, 1430, 240, 92, 0, 60), C.steelD); F.S(ell(540, 1420, 232, 84, 0, 60), C.steel); F.S(ell(540, 1426, 206, 70, 0, 60), C.waterB); F.S(sm([[380, 1380], [470, 1364], [420, 1392]]), C.steelL);
    if (t >= 62) {
      const turn = ph(t, 62, 108), ang = lerp(1.1, 0, turn) + Math.sin(turn * Math.PI * 3) * 0.35 * (1 - turn), raft = ang * 0.7;
      const Rf = (x: number, y: number, a: number): P => [540 + (x * Math.cos(a) - y * Math.sin(a)), 1420 + (x * Math.sin(a) + y * Math.cos(a)) * 0.42];
      F.S(sm([Rf(0, -110, raft), Rf(50, -40, raft), Rf(52, 40, raft), Rf(0, 110, raft), Rf(-52, 40, raft), Rf(-50, -40, raft)]), C.leaf); F.L([Rf(0, -100, raft), Rf(0, 100, raft)], 1.6, "#4f7a2a");
      F.S(bar(Rf(0, -150, ang), Rf(0, 150, ang), 3.5, 1.5), C.steelL); F.S(ell(...Rf(0, -150, ang), 7, 7), C.magnet); F.L([Rf(0, -150, ang), Rf(0, 150, ang)], 1.2);
    }
    return { back, front };
  },
};

// ---------------------------------------------------------------- 4. A WHOLE BANYAN IN ONE SEED
// A Tamil village street. Amma breaks open a red banyan fig: it is full of tiny seeds. Kavya holds
// one on her fingertip. Behind them, from that seed, the banyan grows: trunk, branches, canopy,
// and the aerial roots let down to the ground. They look up.
const banyan: DScene = {
  id: "banyan", len: 135, bg: "#cfe6e6", entry: [560, 1210, 40], exit: [540, 360, 120], caption: ["A whole banyan grows from a seed", "smaller than a mustard grain."],
  build: (t) => {
    const back = plate(), front = plate(), { S, L } = back, r = rng(77);
    S(rect(-10, -10, W + 10, H + 10), "#cfe6e6"); S(rect(-10, 820, W + 10, 1260), C.lime);
    [[-30, 380], [690, 420]].forEach(([x, w]) => { S([[x - 30, 840], [x + w * 0.5, 760], [x + w + 30, 840]], C.tile); S(rect(x, 840, x + w, 1260), C.lime); for (let i = 0; i < 4; i++) { const px = x + 40 + i * (w - 80) / 3; S(rect(px, 870, px + 18, 1240), C.oxide); } });
    // the tree grows from the seed's place, behind them
    const g = ph(t, 40, 128), base: P = [540, 1260];
    if (g > 0) {
      const th = 20 + 130 * g, top = lerp(1240, 420, ph(t, 40, 100));
      S(sm([[base[0] - th, base[1]], [base[0] - th * 0.5, lerp(base[1], top, 0.5)], [base[0] - th * 0.35, top], [base[0] + th * 0.35, top], [base[0] + th * 0.5, lerp(base[1], top, 0.5)], [base[0] + th, base[1]]], true, 4), C.bark);
      const br = ph(t, 60, 120); [[-1, 0.7], [1, 0.62], [-1, 0.45], [1, 0.36]].forEach(([d, yk], i) => { const y0 = lerp(base[1], top, yk); S(bar([base[0] + d * th * 0.3, y0], [base[0] + d * 560 * br * (1 - i * 0.08), y0 - 200 * br], 30 * br + 4, 8), C.bark); });
      const cr = ph(t, 66, 128); for (let i = 0; i < 40; i++) { const a = r() * Math.PI, d = r() * 600 * cr, x = base[0] + Math.cos(a) * d * 1.05, y = top - Math.sin(a) * d * 0.5 + 60; S(ell(x, y, (80 + r() * 60) * cr, (50 + r() * 34) * cr, r() * 0.6), i % 3 ? C.banyan : C.banyanD); for (let k = 0; k < 4; k++) { const lx = x + (r() - 0.5) * 100 * cr, ly = y + (r() - 0.5) * 60 * cr; S(ell(lx, ly, 14 * cr, 9 * cr, r() * 3), "#6d9a4c"); } }
      const rt = ph(t, 90, 132); for (let i = 0; i < 18; i++) { const x = base[0] + (i - 8.5) * 64 + r() * 20, y0 = top + 30 + Math.abs(i - 8.5) * 16, y1 = lerp(y0, base[1], clamp(rt * 1.4 - (i % 4) * 0.12)); if (y1 > y0 + 4 && Math.abs(x - base[0]) > th) L([[x, y0], [x + 4, (y0 + y1) / 2], [x - 2, y1]], i % 4 ? 2.4 : 5, C.barkD); }
    }
    const up = ph(t, 56, 90);
    ammaBust(back, { x: 290, y: 1000, s: 2.1, face: up > 0.5 ? "wow" : "smile", look: lerp(0.3, -0.45, up), near: { to: [lerp(500, 470, up), lerp(1240, 1300, up)], kind: "cup", turn: -0.4 }, far: { to: [420, 1290], kind: "cup", turn: 0.4 } });
    kavyaBust(back, { x: 820, y: 1040, s: 2.1, flip: -1, face: up > 0.5 ? "wow" : t > 14 ? "smile" : "calm", look: lerp(0.35, -0.5, up), near: { to: [lerp(660, 640, up), lerp(1190, 1300, up)], kind: "point", turn: -0.9 }, far: { to: [800, 1420], kind: "flat" } });
    // front: the earth of the street; the split fig in Amma's hands, its seeds; the one seed on Kavya's finger
    const F = front; F.S(rect(-10, 1360, W + 10, H + 10), C.earth); for (let i = 0; i < 6; i++) F.D([[-20, 1400 + i * 80], [W + 20, 1396 + i * 80]], 12, mix(C.earth, "#e7b48a", 0.3));
    const fc: P = [lerp(480, 470, up), lerp(1230, 1290, up)];
    F.S(ell(fc[0] - 26, fc[1], 34, 40, -0.3), C.fig); F.S(ell(fc[0] + 26, fc[1], 34, 40, 0.3), C.fig); F.S(ell(fc[0] - 22, fc[1], 24, 30, -0.3), C.figIn); F.S(ell(fc[0] + 22, fc[1], 24, 30, 0.3), C.figIn);
    for (let i = 0; i < 26; i++) { const sx = fc[0] + (i % 2 ? 22 : -22) + (r() - 0.5) * 34, sy = fc[1] + (r() - 0.5) * 44; F.S(ell(sx, sy, 3, 2.4), "#8a5a2a"); }
    const sp: P = [lerp(660, 640, up) + 30, lerp(1190, 1300, up) - 34]; F.S(ell(sp[0], sp[1], 5, 4), "#5a3a26");
    if (t > 10 && t < 60) { const z = ph(t, 10, 22); F.S(ell(860, 1600, 110 * z, 110 * z, 0, 40), C.cream); F.L(ell(860, 1600, 110 * z, 110 * z, 0, 40), 2, C.ink, true); F.S(ell(860, 1600, 40 * z, 30 * z), "#5a3a26"); F.L([[sp[0], sp[1]], [800, 1520]], 1.2, C.ink); }
    return { back, front };
  },
};

// ---------------------------------------------------------------- 5. TWO MIRRORS: FOR EVER
// At home, a brass diya lit between two hand mirrors held face to face. In each mirror the diya
// and the mirror repeat, smaller and smaller, curving away. Kavya counts on her fingers and gives
// up laughing; Amma laughs too.
const mirrors: DScene = {
  id: "mirrors", len: 150, bg: C.room, entry: [330, 1030, 150], exit: [372, 1018, 8], caption: ["Two mirrors facing each other", "make a 'forever'."],
  build: (t) => {
    const back = plate(), front = plate(), { S, L } = back;
    S(rect(-10, -10, W + 10, H + 10), C.room); for (let i = 0; i < 9; i++) S(ell(540, 700, 900 - i * 90, 700 - i * 70, 0, 50), i % 2 ? "#43366a" : C.room);
    const count = Math.min(5, Math.floor(clamp((t - 40) / 14) * 5 + (t > 40 ? 1 : 0))), laugh = t > 112;
    ammaBust(back, { x: 230, y: 1000, s: 2.0, face: laugh ? "laugh" : "wow", look: 0.2, near: { to: [330, 1200], kind: "hold", turn: -1.4 }, far: { to: [250, 1380], kind: "flat" } });
    kavyaBust(back, { x: 860, y: 1040, s: 2.0, flip: -1, face: laugh ? "laugh" : t > 40 ? "wow" : "smile", look: 0.2, near: { to: [760, 1200], kind: "hold", turn: 1.4 }, far: { to: [lerp(840, 700, ph(t, 30, 44)), lerp(1400, 1010, ph(t, 30, 44))], kind: count >= 4 ? "open" : count >= 1 ? "point" : "flat" } });
    // front: the table, the diya, and the two mirrors with their endless tunnels
    const F = front; F.S(rect(-10, 1300, W + 10, H + 10), C.table);
    F.S(sm([[480, 1330], [600, 1330], [580, 1372], [500, 1372]], true, 3), C.brass); F.S(ell(540, 1330, 62, 14), "#a87420"); const fl = Math.sin(t * 0.6) * 4; F.S(sm([[530, 1326], [540 + fl, 1270], [550, 1326]], true, 3), C.flame); F.S(ell(540, 1318, 5, 9), "#fff6c8");
    const mirror = (c: P, dirX: number) => {
      F.S(bar([c[0], c[1] + 150], [c[0] - dirX * 10, c[1] + 290], 16, 14), "#6a3a22");
      F.S(ell(c[0], c[1], 132, 164, 0, 60), C.brass); F.S(ell(c[0], c[1], 118, 150, 0, 60), C.mirror);
      // the tunnel: each bounce a little smaller, a little deeper, its diya flame at the foot
      const deep = 9 + Math.floor(ph(t, 0, 60) * 9); for (let k = 1; k <= deep; k++) { const s = Math.pow(0.8, k), x = c[0] + dirX * 42 * (1 - s), y = c[1] - 12 * (1 - s); F.S(ell(x, y, 118 * s, 150 * s, 0, 40), k % 2 ? C.mirrorD : C.mirror); F.L(ell(x, y, 118 * s, 150 * s, 0, 40), 1.4, C.brass, true); F.S(sm([[x - 6 * s, y + 120 * s], [x, y + 92 * s], [x + 6 * s, y + 120 * s]], true, 2), C.flame); }
      F.L(ell(c[0], c[1], 132, 164, 0, 60), 2, C.ink, true);
    };
    mirror([330, 1030], 1); mirror([760, 1030], -1);
    return { back, front };
  },
};

// ---------------------------------------------------------------- 6. MY ADDRESS IN THE UNIVERSE
// On the terrace at dusk, with Kavya's booklet: house, Chennai, India, Earth, the Milky Way. From
// the booklet, rings rise into the sky, each a step further out; among the stars, IAm looks up
// from his book.
const universe: DScene = {
  id: "universe", len: 150, bg: C.night, entry: [540, 1600, 160], exit: [540, 360, 12], caption: ["My address: home, Chennai,", "India, Earth, the Milky Way."],
  build: (t) => {
    const back = plate(), front = plate(), { S, L } = back, r = rng(321);
    S(rect(-10, -10, W + 10, H + 10), C.night); S(rect(-10, 1060, W + 10, 1260), C.dusk);
    for (let i = 0; i < 120; i++) S(ell(r() * W, r() * 1050, 1.2 + r() * 2.4, 1.2 + r() * 2.4), C.star);
    // the rings rising from the booklet: each holds the next place out
    const steps: [string, (c: P, R: number) => void][] = [
      ["home", (c, R) => { S(rect(c[0] - R * 0.5, c[1] - R * 0.1, c[0] + R * 0.5, c[1] + R * 0.5), C.lime); S([[c[0] - R * 0.6, c[1] - R * 0.1], [c[0], c[1] - R * 0.55], [c[0] + R * 0.6, c[1] - R * 0.1]], C.tile); }],
      ["Chennai", (c, R) => { S(rect(c[0] - R, c[1] - R, c[0] + R * 0.2, c[1] + R), "#d9c7a4"); S(rect(c[0] + R * 0.2, c[1] - R, c[0] + R, c[1] + R), "#2f6f9a"); S(rect(c[0] + R * 0.12, c[1] - R, c[0] + R * 0.26, c[1] + R), "#e8cf9a"); }],
      ["India", (c, R) => { S(rect(c[0] - R, c[1] - R, c[0] + R, c[1] + R), C.ocean); S(sm([[c[0] - R * 0.5, c[1] - R * 0.7], [c[0] + R * 0.4, c[1] - R * 0.75], [c[0] + R * 0.6, c[1] - R * 0.3], [c[0] + R * 0.1, c[1] + R * 0.2], [c[0], c[1] + R * 0.8], [c[0] - R * 0.2, c[1] + R * 0.1], [c[0] - R * 0.6, c[1] - R * 0.3]], true, 3), C.land); }],
      ["Earth", (c, R) => { S(rect(c[0] - R, c[1] - R, c[0] + R, c[1] + R), C.night); S(ell(c[0], c[1], R * 0.8, R * 0.8, 0, 40), C.ocean); S(sm([[c[0] - R * 0.2, c[1] - R * 0.5], [c[0] + R * 0.3, c[1] - R * 0.4], [c[0] + R * 0.1, c[1] + R * 0.3], [c[0] - R * 0.3, c[1]]], true, 3), C.land); }],
      ["Milky Way", (c, R) => { S(rect(c[0] - R, c[1] - R, c[0] + R, c[1] + R), C.night); for (let k = 0; k < 3; k++) S(ell(c[0], c[1], R * (0.9 - k * 0.25), R * (0.3 - k * 0.07), -0.4, 40), k % 2 ? "#6a5aa0" : "#4a3c80"); S(ell(c[0], c[1], R * 0.14, R * 0.1, -0.4), C.star); }],
    ];
    steps.forEach(([, drawIn], i) => { const k = ph(t, 16 + i * 14, 34 + i * 14); if (k <= 0) return; const R = 70 + i * 16, c: P = [lerp(540, 150 + i * 195, k), lerp(1500, 1010 - Math.sin((i / 4) * Math.PI) * 70, k)]; S(ell(c[0], c[1], R + 10, R + 10, 0, 40), C.gold); S(ell(c[0], c[1], R, R, 0, 40), C.night); const save = back.shapes.length; drawIn(c, R * 0.92); void save; L(ell(c[0], c[1], R + 10, R + 10, 0, 40), 2, C.ink, true); });
    // IAm among the stars, on his stone step, reading; he looks up
    const up = ph(t, 100, 130), o: P = [540, 640], M = (x: number, y: number): P => [o[0] + x * 0.55, o[1] + y * 0.55];
    if (t > 70) {
      S([M(-300, 60), M(300, 60), M(320, 200), M(-320, 200)], "#8a8496"); S(sm([M(-230, 40), M(-120, -30), M(120, -30), M(230, 40), M(210, 110), M(-210, 110)], true, 4), C.indigo);
      S(sm([M(-110, -330), M(110, -330), M(130, -100), M(100, 0), M(-100, 0), M(-130, -100)], true, 4), C.lion); S(sm([M(-110, -330), M(-60, -340), M(130, -60), M(110, -20)], true, 3), C.sage);
      [[-125, -300, -215, -160, -200, 20], [125, -300, 215, -160, 200, 20], [-110, -250, -120, -120, -40, -70], [110, -250, 120, -120, 40, -70]].forEach(([a, b, c, d, e, f]) => { S(limb([M(a, b), M(c, d), M(e, f)], [17, 15, 12], 4).poly, C.lion); S(ell(...M(e, f + 10), 16, 12), "#d8ad6c"); });
      S([M(-90, -110), M(90, -110), M(100, -40), M(-100, -40)], C.cream);
      const hy = -440 - up * 20, Hd = (x: number, y: number): P => M(x, hy + y + (1 - up) * 20);
      for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2; S(ell(...Hd(Math.cos(a) * 168, Math.sin(a) * 178), 35, 42, a), C.maneD); }
      for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2 + 0.17; S(ell(...Hd(Math.cos(a) * 140, Math.sin(a) * 150), 32, 38, a), C.mane); }
      S(ell(...Hd(0, 0), 83, 90), C.mane); S(sm([Hd(-90, -70), Hd(90, -70), Hd(100, 40), Hd(60, 120), Hd(0, 140), Hd(-60, 120), Hd(-100, 40)], true, 4), C.lion); S(sm([Hd(-42, 30), Hd(42, 30), Hd(52, 100), Hd(0, 124), Hd(-52, 100)], true, 4), "#e3c894"); S(sm([Hd(-20, 64), Hd(20, 64), Hd(0, 84)], true, 2), C.maneD);
      [-48, 48].forEach((x) => { if (up > 0.5) { S(ell(...Hd(x, -10), 8, 5), "#f0d27a"); S(ell(...Hd(x, -10), 3, 4.5), C.ink); } else L([Hd(x - 14, -8), Hd(x, -2), Hd(x + 14, -8)], 2); }); S(ell(...Hd(0, -58), 4, 6), up > 0.5 ? "#f0d27a" : C.maneD);
    }
    ammaBust(back, { x: 300, y: 1360, s: 1.9, face: t > 30 ? "wow" : "smile", look: lerp(0.3, -0.5, ph(t, 20, 50)), near: { to: [470, 1600], kind: "hold" }, far: { to: [lerp(380, 520, ph(t, 20, 40)), lerp(1650, 1180, ph(t, 20, 40))], kind: "point", turn: -0.3 } });
    kavyaBust(back, { x: 800, y: 1420, s: 1.9, flip: -1, face: t > 26 ? (t > 120 ? "laugh" : "wow") : "smile", look: lerp(0.3, -0.5, ph(t, 20, 50)), near: { to: [620, 1610], kind: "hold" }, far: { to: [780, 1720], kind: "flat" } });
    // front: the terrace parapet and the booklet between their hands
    const F = front; F.S(rect(-10, 1640, W + 10, H + 10), C.terrace); F.S(rect(-10, 1640, W + 10, 1680), "#d8c9b8");
    F.S(sm([[380, 1540], [540, 1560], [700, 1540], [710, 1660], [540, 1680], [370, 1660]], true, 2), C.paper); F.L([[540, 1560], [540, 1680]], 1.6);
    F.S(ell(450, 1600, 26, 26), C.ocean); F.S(rect(600, 1580, 650, 1620), C.lime);
    return { back, front };
  },
};

export const DREAM: DScene[] = [velcro, king, compass, banyan, mirrors, universe];

// the caption: one line or two on a torn strip of notebook paper, written in as a hand writes
export const caption = (ctx: Ctx, env: Env, cam: Cam, lines: [string, string?], t: number) => {
  const k = clamp((t - 14) / 24); if (k <= 0) return;
  const pl = plate(), y0 = 1712, y1 = lines[1] ? 1880 : 1810;
  pl.S(sm([[40, y0 + 6], [300, y0 - 4], [700, y0 + 4], [1040, y0 - 2], [1046, y1 + 4], [600, y1 - 4], [36, y1 + 6]], true, 2), "#FCFCF8");
  pl.L([[90, y0 + 6], [90, y1]], 2, "#D7372B");
  drawPlate(ctx, env, pl, "caption", { f: t, cam });
  ctx.save(); camSet(ctx, env, cam); ctx.beginPath(); ctx.rect(100, y0 - 20, 940 * k, y1 - y0 + 40); ctx.clip();
  ctx.fillStyle = "#1F2440"; ctx.font = `italic 600 50px "Liberation Serif", "DejaVu Serif", Georgia, serif`; ctx.textBaseline = "middle";
  ctx.fillText(lines[0], 120, y0 + 48); if (lines[1]) ctx.fillText(lines[1], 120, y0 + 122);
  ctx.restore();
};
export const drawDream = (ctx: Ctx, env: Env, sc: DScene, t: number, cam: Cam, dream: number) => {
  const { back, front } = sc.build(t);
  drawPlate(ctx, env, back, sc.id + "b", { f: t, dream, cam });
  if (front) drawPlate(ctx, env, front, sc.id + "f", { f: t, dream: dream * 0.6, cam });
  caption(ctx, env, cam, sc.caption, t);
};
void mix;
