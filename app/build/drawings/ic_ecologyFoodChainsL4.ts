import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, bowl, seed, leaf, write, cards } from "./flatKit";

// sci.ecology.food-chains.L4 · set-up cards for the peanut burner (e1) and the warm seeds (e2), then picture
// cards. The same child (orange top) and grown-up (blue top) stand behind a wooden counter on every card with people.

const TAN = "#d8a46a", TANDK = "#b7854c", CLAY = "#a8723f", PLASTIC = "#d9e9f3", PLASTICDK = "#a9c4d8", CARD = "#d5a86a", CARDDK = "#b8894f";
const BOILED = "#cdb95e", BOILEDDK = "#a8923e", FLAME = "#f39a3c", FLAMEIN = "#ffd34d";

// ---------------------------------------------------------------- letters A B C for labels
const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.12, 0.64], [0.48, 0.64]]],
  B: [[[0.02, 0], [0.02, 1]], [[0.02, 0], [0.38, 0], [0.54, 0.12], [0.54, 0.38], [0.38, 0.5], [0.02, 0.5]], [[0.38, 0.5], [0.58, 0.62], [0.58, 0.88], [0.4, 1], [0.02, 1]]],
  C: [[[0.58, 0.15], [0.42, 0], [0.16, 0.04], [0.02, 0.3], [0.02, 0.7], [0.16, 0.96], [0.42, 1], [0.58, 0.85]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col = INK, w = 7) => {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round";
  (LET[ch] ?? []).forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(x + u * h, y + v * h) : c.moveTo(x + u * h, y + v * h))); c.stroke(); });
};
// a white paper label with one big letter, centred at (x, y)
const tag = (c: Ctx, ch: string, x: number, y: number, s = 1) => {
  shape(c, () => rrect(c, x - 42 * s, y - 36 * s, 84 * s, 72 * s, 8 * s), WHITE, 5);
  letter(c, ch, x - 20 * s, y - 24 * s, 48 * s, INK, 7 * s);
};

// ---------------------------------------------------------------- the room
// a wooden counter: people stand behind it (draw them first), things stand on its top face at y + 42
const counter = (c: Ctx, y: number) => {
  shape(c, () => polyP(c, [[-10, y], [D + 10, y], [D + 10, y + 42], [-10, y + 42]]), COL.wood, 6);
  shape(c, () => polyP(c, [[-10, y + 42], [D + 10, y + 42], [D + 10, D + 10], [-10, D + 10]]), COL.woodDk, 6);
};
// a small mitten hand drawn over a held thing, like the one person() draws, at (x, y) pointing at an
const mitten = (c: Ctx, x: number, y: number, an: number, r: number, skin: string, side: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => ell(c, r * 0.5, 0, r * 1.05, r * 0.8), skin, 5);
  shape(c, () => ell(c, r * 0.3, -side * r * 0.8, r * 0.5, r * 0.32, -side * 0.5), skin, 4);
  c.restore();
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 8, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
};
// a flame standing on (x, y), about 90 * s tall
const flame = (c: Ctx, x: number, y: number, s: number, lean = 0) => {
  const tip: [number, number] = [x + lean * 90 * s, y - 90 * s];
  shape(c, () => { c.moveTo(x - 22 * s, y); c.quadraticCurveTo(x - 32 * s, y - 45 * s, tip[0], tip[1]); c.quadraticCurveTo(x + 32 * s, y - 45 * s, x + 22 * s, y); c.closePath(); }, FLAME, 4);
  shape(c, () => { c.moveTo(x - 10 * s, y); c.quadraticCurveTo(x - 14 * s, y - 22 * s, x + lean * 40 * s, y - 44 * s); c.quadraticCurveTo(x + 14 * s, y - 22 * s, x + 10 * s, y); c.closePath(); }, FLAMEIN, 0);
};
// red wavy heat lines rising from (x, y) to a height h
const heat = (c: Ctx, x: number, y: number, h: number, n = 3, gap = 40) => {
  for (let k = 0; k < n; k++) { const pts: number[][] = []; const bx = x + (k - (n - 1) / 2) * gap; for (let i = 0; i <= 12; i++) pts.push([bx + Math.sin((i / 12) * Math.PI * 2.5 + k) * 9, y - (h * i) / 12]); line(c, pts, 6, RED); }
};
// a glass thermometer from its top (x1, y1) to the bulb (x2, y2); red up to fill of the length
const thermometer = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w = 18, fill = 0.55) => {
  line(c, [[x1, y1], [x2, y2]], w + 8, INK); line(c, [[x1, y1], [x2, y2]], w, WHITE);
  line(c, [[x2 + (x1 - x2) * fill, y2 + (y1 - y2) * fill], [x2, y2]], w * 0.35, RED);
  for (let i = 1; i <= 4; i++) { const t = 0.3 + i * 0.14, px = x2 + (x1 - x2) * t, py = y2 + (y1 - y2) * t, an = Math.atan2(y1 - y2, x1 - x2); line(c, [[px, py], [px + Math.cos(an + Math.PI / 2) * w * 0.45, py + Math.sin(an + Math.PI / 2) * w * 0.45]], 3, INK); }
  shape(c, () => ell(c, x2, y2, w * 0.85, w * 0.85), RED, 5);
};
// a thin metal tin, bottom centre at (x, yb), open at the top with water in it
const tin = (c: Ctx, x: number, yb: number, w: number, h: number) => {
  const ry = w * 0.17, body = () => { c.moveTo(x - w / 2, yb - h); c.lineTo(x + w / 2, yb - h); c.lineTo(x + w / 2, yb); c.quadraticCurveTo(x, yb + ry * 1.6, x - w / 2, yb); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -w * 0.3, 0);
  shape(c, () => ell(c, x, yb - h, w / 2, ry), COL.steelIn, 5);
  shape(c, () => ell(c, x, yb - h, w * 0.42, ry * 0.8), COL.water, 4);
  shape(c, () => ell(c, x - w * 0.12, yb - h - ry * 0.1, w * 0.12, ry * 0.25), COL.drop, 0);
  shine(c, [[x - w * 0.36, yb - h * 0.85], [x - w * 0.36, yb - h * 0.25]], 7);
};
// kitchen tongs: a pivot at (px, py) and two steel arms to the jaws j1 and j2
const tongs = (c: Ctx, px: number, py: number, j1: number[], j2: number[]) => {
  for (const j of [j1, j2]) { line(c, [[px, py], j], 22, INK); line(c, [[px, py], j], 12, COL.steel); }
  shape(c, () => ell(c, px, py, 14, 14), COL.steelDk, 5);
};
// the peanut rig: a steel lid, a lump of clay, a nail standing in it, the peanut on the point; lid centre (x, y)
// scale s (1 = lid 400 wide). Returns the top of the peanut.
const peanutRig = (c: Ctx, x: number, y: number, s: number, burning: boolean) => {
  shadow(c, x + 20 * s, y + 10 * s, 210 * s, 40 * s);
  shape(c, () => ell(c, x, y, 200 * s, 50 * s), COL.steel);
  shape(c, () => ell(c, x, y - 4 * s, 168 * s, 36 * s), COL.steelIn, 4);
  const clay = () => { c.moveTo(x - 70 * s, y); c.bezierCurveTo(x - 75 * s, y - 60 * s, x - 20 * s, y - 80 * s, x, y - 75 * s); c.bezierCurveTo(x + 30 * s, y - 85 * s, x + 75 * s, y - 50 * s, x + 70 * s, y); c.closePath(); };
  shape(c, clay, CLAY); shade(c, clay, COL.soilDk, -22 * s, 0);
  line(c, [[x, y - 72 * s], [x, y - 190 * s]], 12 * s, INK); line(c, [[x, y - 72 * s], [x, y - 190 * s]], 5 * s, COL.steelIn);
  const nut = () => ell(c, x, y - 210 * s, 22 * s, 32 * s);
  shape(c, nut, TAN); shade(c, nut, TANDK, -10 * s, -4 * s);
  line(c, [[x - 4 * s, y - 236 * s], [x - 6 * s, y - 186 * s]], 3 * s, TANDK);
  if (burning) flame(c, x, y - 238 * s, 0.55 * s);
  return y - 242 * s;
};
// a plastic tub standing on (x, yb), open at the top: "live" soaked moong, "boiled" moong, or empty
const tub = (c: Ctx, x: number, yb: number, w: number, h: number, kind: "live" | "boiled" | "empty", label: string, seedBase: number) => {
  const ry = w * 0.16, body = () => polyP(c, [[x - w / 2, yb - h], [x + w / 2, yb - h], [x + w * 0.46, yb], [x - w * 0.46, yb]]);
  shadow(c, x + w * 0.1, yb + 6, w * 0.55, w * 0.1);
  shape(c, body, PLASTIC); shade(c, body, PLASTICDK, -w * 0.28, 0);
  shape(c, () => ell(c, x, yb - h, w / 2, ry), kind === "empty" ? PLASTICDK : kind === "live" ? COL.greenDk : BOILEDDK, 5);
  if (kind !== "empty") {
    c.save(); c.beginPath(); ell(c, x, yb - h, w * 0.46, ry * 0.86); c.clip();
    const r = rnd(seedBase);
    for (let i = 0; i < 70; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()); const sx = x + Math.cos(a) * d * w * 0.46, sy = yb - h + Math.sin(a) * d * ry * 0.86; if (kind === "live") seed(c, sx, sy, w * 0.045, r() * 3, true); else seed(c, sx, sy, w * 0.048, r() * 3, true, BOILED, BOILEDDK); }
    c.restore();
  } else shape(c, () => ell(c, x, yb - h + ry * 0.15, w * 0.38, ry * 0.6), PLASTIC, 3);
  tag(c, label, x, yb - h * 0.45, 0.8);
};
// a rice plant: stems fanning from the base (x, y), each ending in a drooping head of yellow grain
const ricePlant = (c: Ctx, x: number, y: number, s: number) => {
  const stems = [-0.32, -0.16, 0, 0.16, 0.32];
  stems.forEach((t, i) => {
    const tipX = x + t * 220 * s, tipY = y - (190 - Math.abs(t) * 120) * s, bend = t * 80 * s;
    line(c, [[x, y], [x + t * 60 * s, y - 90 * s], [tipX, tipY]], 9 * s, COL.leafDk);
    const pts: number[][] = []; for (let k = 0; k <= 6; k++) pts.push([tipX + (bend / 6) * k + t * 6 * s * k, tipY + 10 * s * k * k * 0.35 - 8 * s * k]);
    line(c, pts, 5 * s, COL.woodDk);
    pts.forEach((p, k) => { if (k) shape(c, () => ell(c, p[0], p[1] + 6 * s, 9 * s, 6 * s, 0.3 * t), COL.yellow, 3); });
    if (i % 2 === 0) leaf(c, x + t * 20 * s, y - 40 * s, 130 * s, -Math.PI / 2 + t * 2.4);
  });
};
// a grasshopper standing on (x, y), facing left, about 170 * s long
const grasshopper = (c: Ctx, x: number, y: number, s: number) => {
  const by = y - 42 * s;
  // back legs: a chevron, knee up and behind, foot on the ground
  for (const o of [10, -10]) { line(c, [[x + 30 * s, by + 8 * s], [x + 70 * s + o * s, by - 50 * s], [x + 92 * s + o * s, y]], 9 * s, INK); line(c, [[x + 30 * s, by + 8 * s], [x + 70 * s + o * s, by - 50 * s], [x + 92 * s + o * s, y]], 4 * s, COL.green); }
  for (const lx of [-30, 0]) line(c, [[x + lx * s, by + 14 * s], [x + lx * s - 10 * s, y]], 6 * s, INK);
  const body = () => ell(c, x + 10 * s, by, 72 * s, 22 * s);
  shape(c, body, COL.green); shade(c, body, COL.greenDk, -14 * s, -6 * s);
  line(c, [[x - 40 * s, by - 10 * s], [x + 70 * s, by - 16 * s]], 4 * s, COL.greenDk);
  shape(c, () => ell(c, x - 70 * s, by - 2 * s, 20 * s, 18 * s), COL.green, 5);
  shape(c, () => ell(c, x - 78 * s, by - 8 * s, 6 * s, 6 * s), INK, 0);
  line(c, [[x - 82 * s, by - 16 * s], [x - 130 * s, by - 60 * s]], 4 * s, INK); line(c, [[x - 76 * s, by - 18 * s], [x - 110 * s, by - 70 * s]], 4 * s, INK);
};
// a frog sitting on (x, y), facing the viewer, about 150 * s wide
const frog = (c: Ctx, x: number, y: number, s: number) => {
  for (const sd of [-1, 1]) shape(c, () => ell(c, x + sd * 62 * s, y - 16 * s, 30 * s, 18 * s, sd * 0.3), COL.leafDk, 5);
  const body = () => { c.moveTo(x - 70 * s, y - 10 * s); c.bezierCurveTo(x - 75 * s, y - 95 * s, x + 75 * s, y - 95 * s, x + 70 * s, y - 10 * s); c.quadraticCurveTo(x, y + 8 * s, x - 70 * s, y - 10 * s); c.closePath(); };
  shape(c, body, COL.leaf); shade(c, body, COL.leafDk, -14 * s, -8 * s);
  shape(c, () => ell(c, x, y - 22 * s, 40 * s, 18 * s), COL.greenLt, 0);
  for (const sd of [-1, 1]) { shape(c, () => ell(c, x + sd * 34 * s, y - 86 * s, 17 * s, 17 * s), COL.leaf, 5); shape(c, () => ell(c, x + sd * 34 * s, y - 86 * s, 10 * s, 10 * s), WHITE, 3); shape(c, () => ell(c, x + sd * 34 * s, y - 85 * s, 5 * s, 5 * s), INK, 0); }
  c.beginPath(); c.arc(x, y - 58 * s, 26 * s, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 4 * s; c.stroke();
  for (const sd of [-1, 1]) line(c, [[x + sd * 30 * s, y - 30 * s], [x + sd * 36 * s, y - 2 * s]], 7 * s, INK);
};
// a snake coiled on the ground at (x, y), head up on the left, about 200 * s wide
const snake = (c: Ctx, x: number, y: number, s: number) => {
  const pts = [[x + 90 * s, y - 10 * s], [x + 40 * s, y - 40 * s], [x - 20 * s, y - 12 * s], [x - 60 * s, y - 50 * s], [x - 75 * s, y - 100 * s]];
  const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[4][0], pts[4][1]); };
  c.lineCap = "round"; c.lineJoin = "round";
  path(); c.strokeStyle = INK; c.lineWidth = 36 * s; c.stroke(); path(); c.strokeStyle = COL.brown; c.lineWidth = 26 * s; c.stroke();
  const r = rnd(5); for (let i = 1; i < 9; i++) { const t = i / 9; const q = Math.floor(t * 4), f = t * 4 - q, a = pts[Math.min(q, 3)], b = pts[Math.min(q + 1, 4)]; shape(c, () => ell(c, a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, 6 * s, 6 * s), COL.soilDk, 0); r(); }
  shape(c, () => ell(c, x - 78 * s, y - 118 * s, 24 * s, 18 * s, -0.3), COL.brown, 5);
  shape(c, () => ell(c, x - 88 * s, y - 124 * s, 5 * s, 5 * s), INK, 0);
  line(c, [[x - 100 * s, y - 114 * s], [x - 122 * s, y - 108 * s], [x - 130 * s, y - 116 * s]], 3 * s, RED); line(c, [[x - 122 * s, y - 108 * s], [x - 132 * s, y - 102 * s]], 3 * s, RED);
};

// ================================================================ set-up cards
// e1 step 1: the lid, clay and nail, the peanut on the point, the tin of water held by tongs 4 cm above
const e1s0 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 912], [D, 912]], 6, INK);
  const top = peanutRig(c, 540, 860, 1.1, false);
  tin(c, 540, top - 110, 210, 230);
  write(c, "100 ml", 450, 340, 40);
  // the 4 cm gap between nut and tin
  line(c, [[400, top - 110], [400, top]], 4); line(c, [[385, top - 110], [415, top - 110]], 4); line(c, [[385, top], [415, top]], 4);
  write(c, "4 cm", 272, top - 72, 34);
  // tongs gripping the rim from the upper right, held by the grown-up
  tongs(c, 990, 110, [648, 440], [600, 290]);
  hand(c, 891, 179, 2.53, 1.15, SKIN.adult, CLOTH.adult);
};
// e1 step 2: the grown-up lights the nut with a diya and holds the tin; the child takes the start temperature
const e1s1 = (c: Ctx) => {
  ground(c);
  const A = person(c, 520, 1040, 760, { adult: true, reachL: [345, 650], reachR: [640, 702] });
  const K = person(c, 850, 1040, 640, { reachL: [720, 450] });
  counter(c, 790);
  // the steel tray, the wet cloth on the left and the bowl of water on the right
  shape(c, () => rrect(c, 380, 808, 280, 40, 10), COL.steelDk, 5); shape(c, () => rrect(c, 392, 814, 256, 24, 8), COL.steelIn, 3);
  shape(c, () => { c.moveTo(80, 832); c.quadraticCurveTo(90, 790, 170, 798); c.quadraticCurveTo(230, 790, 250, 832); c.closePath(); }, COL.water, 5);
  for (const [dx, dy] of [[120, 814], [175, 808], [215, 820]]) shape(c, () => ell(c, dx, dy, 7, 5), COL.drop, 2);
  bowl(c, 960, 794, 62, COL.water);
  const top = peanutRig(c, 520, 822, 0.6, false);
  // the child's thermometer, from her hand down through the tin's mouth into the water (the tin hides its lower part)
  thermometer(c, 758, 434, 535, 527, 14, 0.4);
  tin(c, 520, top - 30, 110, 120);
  // the tongs, from the grown-up's hand on the left to the tin's rim
  tongs(c, 275, 690, [467, top - 95], [505, top - 145]);
  mitten(c, A.handL[0], A.handL[1], 0.3, 33, SKIN.adult, -1);
  // the diya in her other hand, its flame leaning onto the nut
  const dx = A.handR[0] - 40, dy = A.handR[1] + 8;
  shape(c, () => { c.moveTo(dx - 60, dy - 10); c.quadraticCurveTo(dx - 30, dy + 30, dx + 30, dy + 24); c.quadraticCurveTo(dx + 50, dy, dx + 44, dy - 10); c.closePath(); }, CLAY, 5);
  flame(c, dx - 52, dy - 8, 0.55, -0.45);
  mitten(c, A.handR[0], A.handR[1], -0.4, 33, SKIN.adult, 1);
  mitten(c, K.handL[0], K.handL[1], -0.5, 26, SKIN.child, -1);
};
// e1 step 3: the nut burns under the tin, the child counts seconds, the thermometer stands in the water
const e1s2 = (c: Ctx) => {
  ground(c);
  const A = person(c, 520, 1040, 760, { adult: true, reachL: [345, 650] });
  const K = person(c, 850, 1040, 640, { reachL: [735, 560] });
  counter(c, 790);
  shape(c, () => rrect(c, 380, 808, 280, 40, 10), COL.steelDk, 5); shape(c, () => rrect(c, 392, 814, 256, 24, 8), COL.steelIn, 3);
  bowl(c, 960, 794, 62, COL.water);
  const top = peanutRig(c, 520, 822, 0.6, true);
  thermometer(c, 650, 440, 530, 535, 14, 0.5);
  tin(c, 520, top - 30, 110, 120);
  tongs(c, 275, 690, [467, top - 95], [505, top - 145]);
  mitten(c, A.handL[0], A.handL[1], 0.3, 33, SKIN.adult, -1);
  // the timer in the child's hand, reading 32 seconds
  const px = K.handL[0] - 8, py = K.handL[1] - 60;
  shape(c, () => rrect(c, px - 36, py - 55, 72, 118, 10), COL.black, 5);
  shape(c, () => rrect(c, px - 28, py - 46, 56, 90, 5), WHITE, 0);
  write(c, "32", px - 22, py - 22, 34, INK, 5);
  mitten(c, K.handL[0], K.handL[1], -1.2, 26, SKIN.child, -1);
};
// e1 step 4: a foil ring stands round the flame with two notches at its foot; the tin rests on the ring
const e1s3 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 912], [D, 912]], 6, INK);
  const top = peanutRig(c, 540, 860, 1.1, true);
  // the foil, drawn see-through so the burning nut inside still shows
  const ry = 56, ringTop = top - 70, ringBot = 850;
  c.globalAlpha = 0.72;
  shape(c, () => { c.moveTo(330, ringTop); c.lineTo(330, ringBot); c.quadraticCurveTo(540, ringBot + ry * 1.7, 750, ringBot); c.lineTo(750, ringTop); c.quadraticCurveTo(540, ringTop + ry * 1.7, 330, ringTop); c.closePath(); }, COL.steel);
  c.globalAlpha = 1;
  // two notches at the bottom edge for air, with air going in
  for (const nx of [440, 640]) {
    const ny = ringBot + ry * 1.7 * (1 - Math.pow((nx - 540) / 210, 2)) - 2;
    shape(c, () => { c.moveTo(nx - 30, ny + 4); c.lineTo(nx - 30, ny - 36); c.quadraticCurveTo(nx, ny - 66, nx + 30, ny - 36); c.lineTo(nx + 30, ny + 4); c.closePath(); }, "#efe4cf", 5);
    arrow(c, [[nx + (nx < 540 ? -120 : 120), ny + 40], [nx + (nx < 540 ? -20 : 20), ny - 20]], COL.blue, 7);
  }
  shine(c, [[360, ringTop + 60], [360, ringBot - 40]], 9);
  shape(c, () => ell(c, 540, ringTop, 210, ry), COL.steelDk, 6);
  tin(c, 540, ringTop + 10, 200, 220);
};
// e2 step 1: two cups of moong soaking in a bowl of water overnight, labelled day 1
const e2s0 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 800], [D, 800]], 6, INK);
  // the night outside: a moon and stars
  shape(c, () => { c.arc(900, 170, 60, 0, Math.PI * 2); }, COL.yellow);
  shape(c, () => { c.arc(930, 150, 52, 0, Math.PI * 2); }, "#efe4cf", 0);
  c.beginPath(); c.arc(900, 170, 60, -1.0, 2.5); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  for (const [sx, sy] of [[770, 120], [820, 240], [1000, 260]]) { line(c, [[sx - 14, sy], [sx + 14, sy]], 5); line(c, [[sx, sy - 14], [sx, sy + 14]], 5); }
  // two empty steel cups, their moong already poured in
  for (const [cx, cy] of [[140, 790], [275, 800]]) {
    shadow(c, cx + 14, cy + 6, 70, 14);
    const body = () => polyP(c, [[cx - 56, cy - 130], [cx + 56, cy - 130], [cx + 46, cy], [cx - 46, cy]]);
    shape(c, body, COL.steel); shade(c, body, COL.steelDk, -30, 0);
    shape(c, () => ell(c, cx, cy - 130, 56, 14), COL.steelIn, 5);
  }
  // the bowl of water with the seeds under the surface
  const bx = 640, by = 560, r = 280;
  bowl(c, bx, by, r, COL.waterDk);
  c.save(); c.beginPath(); ell(c, bx, by, r * 0.97, r * 0.19); c.clip();
  const rd = rnd(21);
  for (let i = 0; i < 110; i++) { const a = rd() * Math.PI * 2, d = Math.sqrt(rd()); seed(c, bx + Math.cos(a) * d * r * 0.95, by + Math.sin(a) * d * r * 0.18, 16, rd() * 3, true); }
  c.fillStyle = COL.water; c.globalAlpha = 0.45; c.fillRect(0, 0, D, D); c.globalAlpha = 1;
  c.restore();
  shape(c, () => ell(c, bx - 90, by - 8, 40, 7), COL.drop, 0);
  // the label on the bowl: day 1
  shape(c, () => rrect(c, bx - 70, by + 80, 140, 90, 10), WHITE, 5);
  sun(c, bx - 30, by + 125, 18);
  write(c, "1", bx + 14, by + 100, 50, INK, 8);
};
// e2 step 2: three tubs in a row: A living soaked moong, B boiled and cooled moong, C empty
const e2s1 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 790], [D, 790]], 6, INK);
  tub(c, 200, 780, 270, 230, "live", "A", 3);
  tub(c, 540, 780, 270, 230, "boiled", "B", 4);
  tub(c, 880, 780, 270, 230, "empty", "C", 5);
};
// e2 step 3: the three tubs packed in a cardboard box wrapped in a towel, the thermometer lying on top
const e2s2 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 920], [D, 920]], 6, INK);
  shadow(c, 560, 925, 360, 30);
  // the box: inside back wall, the tubs' tops, then the front
  shape(c, () => polyP(c, [[300, 400], [780, 400], [840, 500], [240, 500]]), CARDDK, 6);
  shape(c, () => polyP(c, [[300, 400], [780, 400], [840, 500], [240, 500]]), "#6a4128", 0);
  for (const [tx, lab, kind] of [[360, "A", "live"], [540, "B", "boiled"], [720, "C", "empty"]] as [number, string, "live" | "boiled" | "empty"][]) {
    shape(c, () => ell(c, tx, 452, 80, 30), PLASTIC, 5);
    shape(c, () => ell(c, tx, 452, 66, 22), kind === "live" ? COL.greenDk : kind === "boiled" ? BOILEDDK : PLASTICDK, 4);
    if (kind !== "empty") { const rd = rnd(tx); for (let i = 0; i < 22; i++) { const a = rd() * Math.PI * 2, d = Math.sqrt(rd()); seed(c, tx + Math.cos(a) * d * 60, 452 + Math.sin(a) * d * 18, 9, rd() * 3, true, kind === "live" ? COL.greenLt : BOILED, kind === "live" ? COL.green : BOILEDDK); } }
    tag(c, lab, tx, 410, 0.55);
  }
  shape(c, () => polyP(c, [[240, 500], [840, 500], [840, 910], [240, 910]]), CARD, 6);
  line(c, [[240, 500], [840, 500]], 6);
  // the towel wrapped round the box, its folded end tucked at the front
  const towel = () => polyP(c, [[200, 600], [880, 600], [880, 800], [200, 800]]);
  shape(c, towel, COL.teal);
  c.save(); c.beginPath(); towel(); c.clip(); for (let y = 625; y < 800; y += 50) { c.fillStyle = WHITE; c.globalAlpha = 0.8; c.fillRect(200, y, 680, 18); } c.globalAlpha = 1; c.restore();
  shape(c, () => polyP(c, [[560, 600], [880, 600], [880, 800], [600, 800], [560, 700]]), COL.tealDk, 6);
  shape(c, () => polyP(c, [[200, 600], [880, 600], [880, 800], [200, 800]]), "rgba(0,0,0,0)", 6);
  // the thermometer lying on the front rim
  thermometer(c, 700, 488, 400, 492, 18, 0.5);
};
// e2 step 4: the child pushes the thermometer into the middle of tub A, the results table beside it
const e2s3 = (c: Ctx) => {
  ground(c);
  const K = person(c, 600, 1040, 640, { reachL: [435, 475] });
  counter(c, 700);
  thermometer(c, 432, 400, 432, 600, 16, 0.6);
  tub(c, 430, 742, 240, 170, "live", "A", 7);
  mitten(c, K.handL[0], K.handL[1], -1.3, 30, SKIN.child, -1);
  // the results table on a clipboard standing on the counter
  shape(c, () => rrect(c, 720, 470, 300, 272, 10), COL.woodDk, 6);
  shape(c, () => rrect(c, 740, 500, 260, 230, 4), WHITE, 4);
  shape(c, () => rrect(c, 840, 458, 60, 36, 8), COL.steelDk, 4);
  for (let i = 1; i < 4; i++) line(c, [[740, 500 + i * 57], [1000, 500 + i * 57]], 3, COL.greyDk);
  for (let i = 1; i < 4; i++) line(c, [[740 + i * 65, 500], [740 + i * 65, 730]], 3, COL.greyDk);
  ["A", "B", "C"].forEach((ch, i) => letter(c, ch, 826 + i * 65, 512, 34, INK, 5));
  [["29", "27", "26"], ["31", "27", "26"], ["33", "28", "26"]].forEach((row, r) => row.forEach((v, i) => write(c, v, 818 + i * 65, 572 + r * 57, 30, INK, 4)));
  [["1", 0], ["2", 1], ["3", 2]].forEach(([v, r]) => write(c, v as string, 760, 572 + (r as number) * 57, 30, INK, 4));
};

// ================================================================ picture cards
// e1: a peanut burns like a tiny stove under a tin of water, and the thermometer climbs
const flowE1 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 912], [D, 912]], 6, INK);
  const top = peanutRig(c, 540, 860, 1.1, true);
  thermometer(c, 650, top - 560, 560, top - 300, 18, 0.7);
  tin(c, 540, top - 120, 210, 230);
  heat(c, 540, top - 60, 250, 2, 340);
};
// e2: living seeds warm their tub; boiled seeds and the empty tub stay at room temperature
const flowE2 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 820], [D, 820]], 6, INK);
  heat(c, 200, 560, 150, 3, 60);
  thermometer(c, 200, 380, 200, 640, 16, 0.85);
  thermometer(c, 540, 380, 540, 640, 16, 0.4);
  tub(c, 200, 810, 270, 230, "live", "A", 3);
  tub(c, 540, 810, 270, 230, "boiled", "B", 4);
  tub(c, 880, 810, 270, 230, "empty", "C", 5);
  thermometer(c, 880, 380, 880, 600, 16, 0.38);
};
// a1: four paper strips glued one above the other, their widths showing 1000, 100, 10 and 1
const flowA1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 980, 380, 30);
  shape(c, () => rrect(c, 150, 90, 780, 900, 12), COL.paper, 6);
  const rows: [number, string, string][] = [[760, "1000", COL.green], [480, "100", COL.yellow], [260, "10", COL.orange], [110, "1", COL.red]];
  rows.forEach(([w, t, col], i) => {
    const y = 820 - i * 170, h = 130;
    shape(c, () => polyP(c, [[540 - w / 2, y], [540 + w / 2, y], [540 + w / 2, y + h], [540 - w / 2, y + h]]), col, 6);
    write(c, t, 540 - t.length * 0.4 * 70 + 8, y + 32, 70, INK, 9);
  });
};
// a2: the funnel trap: leaf litter in the upturned bottle top, a lamp above, the jar below catching what falls
const flowA2 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 912], [D, 912]], 6, INK);
  // the lamp: a heavy base on the right, an arm up and over, the shade pointing down at the litter
  shadow(c, 900, 915, 130, 20);
  shape(c, () => ell(c, 880, 900, 120, 26), COL.teal);
  line(c, [[880, 890], [880, 420], [600, 250]], 30, INK); line(c, [[880, 890], [880, 420], [600, 250]], 18, COL.teal);
  shape(c, () => polyP(c, [[450, 250], [640, 250], [700, 350], [390, 350]]), COL.teal);
  shape(c, () => polyP(c, [[400, 350], [690, 350], [660, 312], [430, 312]]), COL.yellow, 0);
  for (const k of [-2, -1, 0, 1, 2]) line(c, [[545 + k * 50, 366], [545 + k * 70, 430]], 7, COL.yellow);
  // the jar, with damp tissue at the bottom and the animals that fell in
  const body = () => rrect(c, 420, 620, 240, 290, 22);
  shape(c, body, COL.glass, 5);
  shape(c, () => ell(c, 540, 880, 90, 20), WHITE, 4);
  const rd = rnd(9); for (let i = 0; i < 7; i++) shape(c, () => ell(c, 470 + rd() * 140, 820 + rd() * 50, 6, 4, rd() * 3), INK, 0);
  // the funnel: the cut bottle top upside down, its neck inside the jar
  const fun = () => polyP(c, [[320, 440], [760, 440], [575, 620], [505, 620], [505, 660], [575, 660]]);
  shape(c, () => polyP(c, [[320, 440], [760, 440], [575, 620], [505, 620]]), COL.glass, 5);
  shape(c, () => polyP(c, [[505, 620], [575, 620], [575, 665], [505, 665]]), COL.glass, 5);
  c.save(); c.beginPath(); polyP(c, [[320, 440], [760, 440], [575, 620], [505, 620]]); c.clip();
  shape(c, () => { c.moveTo(300, 500); c.quadraticCurveTo(540, 400, 780, 500); c.lineTo(780, 700); c.lineTo(300, 700); c.closePath(); }, COL.soil, 0);
  const r2 = rnd(4); for (let i = 0; i < 16; i++) leaf(c, 340 + r2() * 400, 470 + r2() * 90, 46, r2() * 6, i % 3 ? COL.brown : COL.woodDk);
  c.restore();
  line(c, [[420, 540], [660, 540]], 4, COL.greyDk);
  shape(c, fun, "rgba(0,0,0,0)", 5);
  shape(c, () => ell(c, 540, 440, 220, 26), COL.glass, 5);
  // the 10 cm gap between the bulb and the litter
  line(c, [[250, 352], [250, 452]], 4); line(c, [[235, 352], [265, 352]], 4); line(c, [[235, 452], [265, 452]], 4);
  write(c, "10 cm", 100, 385, 32);
  // one tiny animal on its way down into the jar
  arrow(c, [[540, 690], [540, 780]], RED, 6);
};
// a3: a thali of lunch: rice, sambar, a vegetable, curd and a fish fry
const flowA3 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 600, 440, 300);
  shape(c, () => ell(c, 540, 570, 440, 300), COL.steel);
  shape(c, () => ell(c, 540, 560, 400, 262), COL.steelIn, 4);
  // three katoris seen from above
  const katori = (x: number, y: number, inside: string) => { shape(c, () => ell(c, x, y, 95, 72), COL.steelDk, 5); shape(c, () => ell(c, x, y - 4, 78, 56), inside, 4); };
  katori(330, 440, COL.orange);
  for (const [dx, dy] of [[300, 430], [350, 455], [335, 420]]) shape(c, () => ell(c, dx, dy, 18, 10, 0.5), COL.yellow, 3);
  katori(560, 400, COL.greenDk);
  const rd = rnd(3); for (let i = 0; i < 9; i++) shape(c, () => ell(c, 520 + rd() * 80, 375 + rd() * 50, 13, 9, rd() * 3), COL.greenLt, 3);
  katori(790, 440, WHITE);
  shape(c, () => ell(c, 770, 420, 22, 10), COL.steelIn, 0);
  // the rice heap
  const rice = () => { c.moveTo(250, 690); c.bezierCurveTo(270, 560, 520, 540, 560, 690); c.quadraticCurveTo(400, 730, 250, 690); c.closePath(); };
  shape(c, rice, WHITE); const r3 = rnd(8); for (let i = 0; i < 60; i++) { const x = 280 + r3() * 250, y = 610 + r3() * 80; if (Math.hypot((x - 405) / 130, (y - 690) / 110) < 1) shape(c, () => ell(c, x, y, 8, 3.5, r3() * 3), COL.paper, 2); }
  // the fish fry, golden and crisp
  c.save(); c.translate(-70, -80);
  const fish = () => { c.moveTo(640, 700); c.quadraticCurveTo(720, 600, 850, 650); c.quadraticCurveTo(900, 620, 910, 600); c.quadraticCurveTo(905, 660, 900, 700); c.quadraticCurveTo(905, 740, 910, 790); c.quadraticCurveTo(880, 760, 850, 740); c.quadraticCurveTo(730, 790, 640, 700); c.closePath(); };
  shape(c, fish, COL.orange); shade(c, fish, TANDK, -16, -10);
  shape(c, () => ell(c, 690, 690, 8, 8), INK, 0);
  for (const k of [0, 1, 2]) line(c, [[740 + k * 40, 660], [760 + k * 40, 730]], 4, TANDK);
  c.restore();
};
// p1: a day of food traced back to the Sun: sunlight, a rice plant, a plate of rice and dal
const flowP1 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 940], [D, 940]], 6, INK);
  sun(c, 170, 190, 80);
  arrow(c, [[260, 290], [420, 640]], COL.orange, 10);
  shape(c, () => ell(c, 440, 930, 120, 24), COL.soil, 5);
  ricePlant(c, 440, 920, 1.25);
  arrow(c, [[600, 700], [740, 740]], INK, 10);
  shadow(c, 880, 910, 170, 34);
  shape(c, () => ell(c, 870, 880, 170, 60), COL.steel);
  shape(c, () => ell(c, 870, 876, 140, 44), COL.steelIn, 4);
  shape(c, () => { c.moveTo(760, 870); c.bezierCurveTo(780, 790, 900, 790, 920, 870); c.closePath(); }, WHITE, 5);
  bowl(c, 920, 800, 55, COL.yellow);
};
// term: trophic level: four steps up from the rice plant to the snake
const termLevels = (c: Ctx) => {
  ground(c);
  const steps = [[60, 800], [290, 650], [520, 500], [750, 350]];
  steps.forEach(([x, y], i) => { shape(c, () => polyP(c, [[x, y], [x + 230, y], [x + 230, 1000], [x, 1000]]), i % 2 ? COL.steelIn : COL.steel, 6); write(c, String(i + 1), x + 92, y + 40, 60, INK, 8); });
  line(c, [[60, 1000], [1020, 1000]], 6);
  ricePlant(c, 175, 800, 0.78);
  grasshopper(c, 400, 650, 0.9);
  frog(c, 635, 500, 0.85);
  snake(c, 870, 350, 0.95);
};
// term: producer: a rice plant with sunlight on its leaves and the sugar it makes, shown in a zoom circle
const termProducer = (c: Ctx) => {
  ground(c);
  line(c, [[0, 940], [D, 940]], 6, INK);
  sun(c, 170, 170, 80);
  for (const [a, b] of [[[270, 240], [430, 480]], [[300, 330], [470, 560]], [[230, 320], [390, 600]]]) arrow(c, [a, b], COL.orange, 9);
  shape(c, () => ell(c, 540, 930, 150, 26), COL.soil, 5);
  ricePlant(c, 540, 920, 1.5);
  // zoom circle on a leaf: tiny white sugar grains
  line(c, [[600, 640], [760, 560]], 4, INK);
  shape(c, () => ell(c, 840, 520, 130, 130), COL.greenLt, 6);
  const rd = rnd(2); for (let i = 0; i < 9; i++) { const a = rd() * Math.PI * 2, d = Math.sqrt(rd()) * 80; shape(c, () => rrect(c, 840 + Math.cos(a) * d - 16, 520 + Math.sin(a) * d - 16, 32, 32, 6), WHITE, 4); }
};
// term: biomass: on a balance, all the grass outweighs all the grasshoppers
const termBiomass = (c: Ctx) => {
  ground(c);
  line(c, [[0, 960], [D, 960]], 6, INK);
  shape(c, () => polyP(c, [[400, 960], [680, 960], [560, 900], [520, 900]]), COL.woodDk);
  line(c, [[540, 900], [540, 400]], 24, INK); line(c, [[540, 900], [540, 400]], 12, COL.wood);
  const L: [number, number] = [230, 480], R: [number, number] = [850, 320];
  line(c, [L, R], 24, INK); line(c, [L, R], 12, COL.wood);
  shape(c, () => ell(c, 540, 400, 20, 20), COL.steelDk, 5);
  const pan = (p: [number, number], py: number) => { for (const dx of [-110, 110]) line(c, [p, [p[0] + dx, py]], 4); shape(c, () => ell(c, p[0], py, 130, 26), COL.steel, 5); };
  pan(L, 830); pan(R, 600);
  // the big sack of grass, pulling its pan down
  const sack = () => { c.moveTo(130, 820); c.bezierCurveTo(100, 670, 150, 610, 230, 600); c.bezierCurveTo(310, 610, 360, 670, 330, 820); c.closePath(); };
  shape(c, sack, COL.green); shade(c, sack, COL.greenDk, -24, -10);
  for (let i = 0; i < 9; i++) leaf(c, 170 + i * 15, 610, 80 + (i % 3) * 16, -Math.PI / 2 + (i - 4) * 0.18, COL.greenLt);
  line(c, [[185, 630], [275, 630]], 10, INK);
  // the tiny pouch of grasshoppers
  shape(c, () => { c.moveTo(820, 592); c.quadraticCurveTo(800, 540, 850, 530); c.quadraticCurveTo(900, 540, 880, 592); c.closePath(); }, COL.green, 5);
  grasshopper(c, 930, 592, 0.3);
};
// term: detritus: a handful of dark crumbly leaf mud with leaf bits and white fungus threads
const termDetritus = (c: Ctx) => {
  ground(c);
  hand(c, 190, 640, -0.25, 3.1, SKIN.child, CLOTH.child, true);
  const heap = () => { c.moveTo(300, 560); c.bezierCurveTo(320, 380, 560, 330, 720, 400); c.bezierCurveTo(800, 440, 790, 540, 700, 580); c.quadraticCurveTo(500, 620, 300, 560); c.closePath(); };
  shape(c, heap, COL.soilDk); shade(c, heap, "#4a2c18", -30, -16);
  const rd = rnd(12);
  for (let i = 0; i < 14; i++) leaf(c, 360 + rd() * 320, 420 + rd() * 120, 40 + rd() * 20, rd() * 6, i % 2 ? COL.brown : COL.woodDk);
  for (let i = 0; i < 50; i++) shape(c, () => ell(c, 340 + rd() * 380, 400 + rd() * 150, 9, 7, rd() * 3), i % 3 ? "#6a4128" : COL.soil, 2);
  for (let i = 0; i < 6; i++) { const x = 380 + i * 60 + rd() * 20, y = 440 + rd() * 90; line(c, [[x, y], [x + 25, y - 30], [x + 55, y - 10], [x + 80, y - 40]], 4, WHITE); }
};

export const ic_ecologyFoodChainsL4 = cards("sci.ecology.food-chains.L4", [
  e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, e2s3,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowP1, termLevels, termProducer, termBiomass, termDetritus,
]);
