import type { Ctx } from "./core";
import { INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, write, cards } from "./flatKit";

// INHERITANCE L1 · pea pods, families, pretend creatures. Same child (curly hair, orange top) and
// same grown-up (mother: long hair, blue top; dimple) on every card.

const PEA = "#7cc24a", PEA_DK = "#4f8f2d", POD = "#5fae3c", POD_IN = "#c8e89a", PAPER = COL.paper, HAIR_GREY = "#c9c4bd", PENCIL = "#7b7b7b";

// ---------------------------------------------------------------- bits
const pea = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), PEA, Math.max(3, r * 0.14));
  shade(c, () => ell(c, x, y, r, r), PEA_DK, r * 0.3, r * 0.25, 0.5);
  shape(c, () => ell(c, x - r * 0.35, y - r * 0.38, r * 0.2, r * 0.13), "rgba(255,255,255,0.7)", 0);
};
const speck = (c: Ctx, x: number, y: number) => shape(c, () => ell(c, x, y, 14, 8), POD_IN, 3);
// a pea pod lying along the x axis, centre (x, y), half length L, half width W; open shows the peas
const pod = (c: Ctx, x: number, y: number, L: number, W: number, rot: number, open: boolean, n = 6) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, 16, W * 0.9, L * 0.95, W * 0.3);
  const lens = (l: number, w: number) => { c.moveTo(-l, 0); c.quadraticCurveTo(0, -w * 2, l, 0); c.quadraticCurveTo(0, w * 2, -l, 0); c.closePath(); };
  shape(c, () => lens(L, W), POD, 7);
  shade(c, () => lens(L, W), COL.greenDk, 0, W * 0.5, 0.35);
  line(c, [[-L, 0], [-L - 40, -30]], 9, COL.greenDk); line(c, [[-L, 0], [-L - 40, -30]], 5, POD);
  if (open) {
    shape(c, () => lens(L * 0.9, W * 0.55), POD_IN, 5);
    const r = W * 0.42, step = (L * 1.6) / n;
    for (let i = 0; i < n; i++) pea(c, -L * 0.8 + step * (i + 0.5), 0, r * (0.8 + 0.2 * Math.sin(i * 2.1)));
  } else { line(c, [[-L * 0.95, 0], [L * 0.95, 0]], 4, COL.greenDk); for (let i = 0; i < n; i++) shape(c, () => ell(c, -L * 0.75 + (L * 1.5 / (n - 1)) * i, 0, W * 0.3, W * 0.3), "rgba(255,255,255,0.18)", 0); }
  c.restore();
};
const sheet = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 14, y + h + 4, w / 2, 16); shape(c, () => rrect(c, x, y, w, h, 14), PAPER, 6); };
const coin = (c: Ctx, x: number, y: number, r: number) => { shadow(c, x + 6, y + r * 0.9, r, r * 0.25); shape(c, () => ell(c, x, y, r, r), COL.yellow, 5); shape(c, () => ell(c, x, y, r * 0.75, r * 0.75), COL.woodDk, 3); write(c, "1", x - r * 0.3, y - r * 0.4, r * 0.8, INK, 7); };

// ---------------------------------------------------------------- people
type FaceOpts = { adult?: boolean; curly?: boolean; longHair?: boolean; grey?: boolean; thickBrows?: boolean; dimple?: boolean; laugh?: boolean; skin?: string };
const face = (c: Ctx, x: number, y: number, r: number, o: FaceOpts = {}) => {
  const skin = o.skin ?? (o.adult ? SKIN.adult : SKIN.child), hair = o.grey ? HAIR_GREY : CLOTH.hair;
  if (o.longHair) shape(c, () => rrect(c, x - r * 1.08, y - r * 0.6, r * 2.16, r * 2.3, r * 0.6), hair, 5);
  shape(c, () => ell(c, x, y, r, r * 1.05), skin);
  shape(c, () => { c.moveTo(x - r * 1.0, y - r * 0.02); c.bezierCurveTo(x - r * 0.98, y - r * 1.45, x + r * 0.98, y - r * 1.45, x + r * 1.0, y - r * 0.02); c.quadraticCurveTo(x, y - r * 0.5, x - r * 1.0, y - r * 0.02); c.closePath(); }, hair, 5);
  if (o.curly) { const n = 8; for (let i = 0; i <= n; i++) { const a = Math.PI + (i / n) * Math.PI; shape(c, () => ell(c, x + Math.cos(a) * r * 0.92, y - r * 0.08 + Math.sin(a) * r * 0.98, r * 0.3, r * 0.3), hair, 4); } }
  for (const s of [-1, 1]) {
    shape(c, () => ell(c, x + s * r * 0.35, y + r * 0.12, r * 0.09, r * 0.12), INK, 0);
    line(c, [[x + s * r * 0.52, y - r * 0.12], [x + s * r * 0.18, y - r * 0.16]], o.thickBrows ? r * 0.13 : r * 0.045, INK);
  }
  if (o.laugh) shape(c, () => { c.arc(x, y + r * 0.42, r * 0.3, 0, Math.PI); c.closePath(); }, "#7a2a2a", 4);
  else { c.beginPath(); c.arc(x, y + r * 0.38, r * 0.3, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
  if (o.dimple) { c.beginPath(); c.arc(x + r * 0.5, y + r * 0.48, r * 0.1, Math.PI * 1.2, Math.PI * 1.9); c.strokeStyle = INK; c.lineWidth = 3.5; c.stroke(); }
  return { hx: x, hy: y, r };
};
type Fig = FaceOpts & { cloth?: string; clothDk?: string; armL?: [number, number]; armR?: [number, number]; spread?: number };
// standing person, feet at (x, y), height h
const figure = (c: Ctx, x: number, y: number, h: number, o: Fig = {}) => {
  const ad = !!o.adult, skin = o.skin ?? (ad ? SKIN.adult : SKIN.child), cloth = o.cloth ?? (ad ? CLOTH.adult : CLOTH.child), clothDk = o.clothDk ?? (ad ? CLOTH.adultDk : CLOTH.childDk);
  const head = h * 0.13, hip = y - h * 0.42, sh = y - h * 0.74, uw = h * 0.06, sp = o.spread ?? 0.06;
  for (const s of [-1, 1]) { const k = [[x + s * h * 0.05, hip], [x + s * h * sp, y]]; line(c, k, h * 0.075, INK); line(c, k, h * 0.075 - 10, "#6b5a8c"); }
  shape(c, () => rrect(c, x - h * 0.13, sh - h * 0.02, h * 0.26, hip - sh + h * 0.06, h * 0.06), cloth);
  shade(c, () => rrect(c, x - h * 0.13, sh - h * 0.02, h * 0.26, hip - sh + h * 0.06, h * 0.06), clothDk, h * 0.07, 0);
  const arm = (sx: number, [a1, a2]: [number, number]) => {
    const l1 = h * 0.17, l2 = h * 0.16, ex = sx + Math.cos(a1) * l1, ey = sh + h * 0.03 + Math.sin(a1) * l1, wx = ex + Math.cos(a2) * l2, wy = ey + Math.sin(a2) * l2;
    line(c, [[sx, sh + h * 0.03], [ex, ey], [wx, wy]], uw + 10, INK); line(c, [[sx, sh + h * 0.03], [ex, ey], [wx, wy]], uw, cloth);
    shape(c, () => ell(c, wx, wy, uw * 0.62, uw * 0.62), skin, 5);
  };
  arm(x - h * 0.11, o.armL ?? [Math.PI * 0.55, Math.PI * 0.5]); arm(x + h * 0.11, o.armR ?? [Math.PI * 0.45, Math.PI * 0.5]);
  return face(c, x, sh - head * 1.05, head, { ...o, skin });
};
// a head and shoulders only, big: head centre (x, y), radius r
const bust = (c: Ctx, x: number, y: number, r: number, o: FaceOpts & { cloth: string }) => {
  shape(c, () => rrect(c, x - r * 1.5, y + r * 1.0, r * 3, r * 1.6, r * 0.6), o.cloth);
  shape(c, () => rrect(c, x - r * 0.3, y + r * 0.7, r * 0.6, r * 0.6, r * 0.1), o.skin ?? (o.adult ? SKIN.adult : SKIN.child), 5);
  return face(c, x, y, r, o);
};

// ---------------------------------------------------------------- pretend creatures
type Gumbi = { col: string; dk: string; spots: boolean; roundEars: boolean; eyes: number; curlyTail: boolean };
const gumbi = (c: Ctx, x: number, y: number, r: number, g: Gumbi) => {
  const body = () => ell(c, x, y, r, r * 0.9);
  if (g.curlyTail) { c.beginPath(); c.arc(x + r * 1.25, y + r * 0.1, r * 0.3, Math.PI, Math.PI * 2.7); c.strokeStyle = INK; c.lineWidth = 14; c.lineCap = "round"; c.stroke(); c.strokeStyle = g.col; c.lineWidth = 7; c.stroke(); }
  else { line(c, [[x + r * 0.9, y + r * 0.1], [x + r * 1.7, y - r * 0.3]], 14, INK); line(c, [[x + r * 0.9, y + r * 0.1], [x + r * 1.7, y - r * 0.3]], 7, g.col); }
  for (const s of [-1, 1]) { line(c, [[x + s * r * 0.4, y + r * 0.8], [x + s * r * 0.45, y + r * 1.2]], 16, INK); line(c, [[x + s * r * 0.4, y + r * 0.8], [x + s * r * 0.45, y + r * 1.2]], 8, g.col); }
  for (const s of [-1, 1]) { if (g.roundEars) shape(c, () => ell(c, x + s * r * 0.6, y - r * 0.8, r * 0.28, r * 0.28), g.col, 5); else shape(c, () => polyP(c, [[x + s * r * 0.3, y - r * 0.7], [x + s * r * 0.75, y - r * 1.35], [x + s * r * 0.85, y - r * 0.55]]), g.col, 5); }
  shape(c, body, g.col, 6);
  c.save(); c.beginPath(); body(); c.clip();
  if (g.spots) [[-0.5, -0.3], [0.2, -0.5], [0.55, 0.2], [-0.2, 0.45], [-0.65, 0.3]].forEach(([u, v]) => shape(c, () => ell(c, x + u * r, y + v * r, r * 0.14, r * 0.14), g.dk, 0));
  else for (let i = -2; i <= 2; i++) line(c, [[x + i * r * 0.4 - r * 0.1, y - r], [x + i * r * 0.4 + r * 0.1, y + r]], r * 0.11, g.dk);
  c.restore();
  const n = g.eyes; for (let i = 0; i < n; i++) { const ex = x + (i - (n - 1) / 2) * r * 0.42, ey = y - r * 0.2; shape(c, () => ell(c, ex, ey, r * 0.16, r * 0.16), WHITE, 4); shape(c, () => ell(c, ex + r * 0.03, ey, r * 0.07, r * 0.07), INK, 0); }
  c.beginPath(); c.arc(x, y + r * 0.3, r * 0.25, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
};
type Bird = { star: boolean; col: string; crest: boolean; longLegs: boolean; wings: boolean };
const bird = (c: Ctx, x: number, y: number, s: number, b: Bird) => {
  const legL = b.longLegs ? s * 1.3 : s * 0.5;
  for (const k of [-1, 1]) { line(c, [[x + k * s * 0.3, y + s * 0.8], [x + k * s * 0.35, y + s * 0.8 + legL]], 12, INK); line(c, [[x + k * s * 0.35, y + s * 0.8 + legL], [x + k * s * 0.35 + k * s * 0.3, y + s * 0.8 + legL]], 12, INK); line(c, [[x + k * s * 0.3, y + s * 0.8], [x + k * s * 0.35, y + s * 0.8 + legL]], 5, COL.orange); }
  if (b.wings) for (const k of [-1, 1]) shape(c, () => ell(c, x + k * s * 1.1, y + s * 0.1, s * 0.7, s * 0.35, k * 0.5), b.col, 5);
  if (b.crest) for (let i = -1; i <= 1; i++) shape(c, () => polyP(c, [[x + i * s * 0.3 - s * 0.12, y - s * 0.8], [x + i * s * 0.35, y - s * 1.45], [x + i * s * 0.3 + s * 0.12, y - s * 0.8]]), COL.red, 4);
  if (b.star) shape(c, () => { const pts: number[][] = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? s * 0.5 : s; pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } polyP(c, pts); }, b.col, 6);
  else shape(c, () => ell(c, x, y, s * 0.9, s * 0.9), b.col, 6);
  shape(c, () => ell(c, x - s * 0.2, y - s * 0.15, s * 0.14, s * 0.14), WHITE, 4); shape(c, () => ell(c, x - s * 0.17, y - s * 0.15, s * 0.06, s * 0.06), INK, 0);
  shape(c, () => polyP(c, [[x + s * 0.05, y - s * 0.02], [x + s * 0.45, y + s * 0.1], [x + s * 0.05, y + s * 0.22]]), COL.yellow, 4);
};
const dotted = (c: Ctx, pts: number[][], col: string) => { c.setLineDash([14, 12]); line(c, pts, 6, col); c.setLineDash([]); };

// ---------------------------------------------------------------- set-up cards
// e1.0: thumbs press the edge of a pod, it pops open
const setupE1_0 = (c: Ctx) => {
  ground(c);
  pod(c, 540, 560, 330, 90, -0.12, true, 6);
  hand(c, 200, 640, -0.25, 1.3);
  c.save(); c.translate(880, 540); c.scale(-1, 1); hand(c, 0, 0, 0.1, 1.3); c.restore();
  arrow(c, [[540, 230], [540, 400]]);
};
// e1.1: peas in a row on paper, a pencil ring round each
const setupE1_1 = (c: Ctx) => {
  ground(c);
  sheet(c, 100, 180, 880, 760);
  const rs = [44, 54, 38, 58, 46, 40];
  rs.forEach((r, i) => { const x = 215 + i * 132, y = 560; c.beginPath(); ell(c, x + 3, y + 4, r + 14, r + 18); c.strokeStyle = PENCIL; c.lineWidth = 5; c.stroke(); pea(c, x, y, r); });
  arrow(c, [[215, 480], [255, 455], [300, 500], [290, 560]]);
  c.save(); c.translate(760, 790); c.rotate(-0.5);
  shape(c, () => rrect(c, -150, -16, 300, 32, 4), COL.yellow, 5);
  shape(c, () => polyP(c, [[150, -16], [205, 0], [150, 16]]), COL.wood, 5); shape(c, () => polyP(c, [[190, -5], [205, 0], [190, 5]]), INK, 0);
  shape(c, () => rrect(c, -170, -16, 24, 32, 4), COL.pink, 5);
  c.restore();
};
// e1.2: five rows, one per pod, a number at the end of each
const setupE1_2 = (c: Ctx) => {
  ground(c);
  sheet(c, 90, 110, 900, 860);
  const counts = [6, 8, 5, 8, 7];
  counts.forEach((n, i) => {
    const y = 230 + i * 155;
    for (let k = 0; k < n; k++) pea(c, 180 + k * 70, y, 26 + 5 * Math.sin(k * 1.7 + i));
    if (i === 2) speck(c, 180 + n * 70, y);
    write(c, String(n), 820, y - 38, 76, INK, 8);
  });
};

// ---------------------------------------------------------------- card pictures
const AMMA_G: Gumbi = { col: COL.blue, dk: COL.blueDk, spots: true, roundEars: true, eyes: 3, curlyTail: true };
const APPA_G: Gumbi = { col: COL.yellow, dk: COL.woodDk, spots: false, roundEars: false, eyes: 2, curlyTail: false };
// g1: the two Gumbi parents on a sheet, a coin, one baby drawn below
const flowG1 = (c: Ctx) => {
  ground(c);
  sheet(c, 110, 60, 860, 960);
  gumbi(c, 320, 300, 105, AMMA_G); gumbi(c, 740, 300, 105, APPA_G);
  gumbi(c, 430, 760, 85, { col: COL.blue, dk: COL.blueDk, spots: false, roundEars: false, eyes: 3, curlyTail: false });
  dotted(c, [[320, 440], [400, 640]], INK); dotted(c, [[740, 440], [470, 640]], INK);
  coin(c, 800, 740, 60);
};
// g2: the grown-up reads a card, the child jumps with both feet off the floor
const flowG2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#d9c9a8"; c.fillRect(0, 900, 1080, 180); line(c, [[0, 900], [1080, 900]], 6);
  shape(c, () => rrect(c, 465, 455, 110, 80, 8), WHITE, 5);
  figure(c, 300, 900, 580, { adult: true, longHair: true, dimple: true, armR: [0.9, -0.9], armL: [1.9, 1.5] });
  shadow(c, 770, 895, 110, 20);
  figure(c, 760, 770, 480, { curly: true, laugh: true, armL: [-2.2, -1.9], armR: [-0.9, -1.2], spread: 0.12 });
  arrow(c, [[940, 880], [940, 700]]);
};
// a1: mother and child look at an open album of family photos
const flowA1 = (c: Ctx) => {
  ground(c);
  figure(c, 380, 1000, 560, { curly: true, armL: [2.0, 1.2], armR: [1.2, 1.9] });
  figure(c, 720, 1000, 680, { adult: true, longHair: true, dimple: true, armL: [2.3, 1.4], armR: [1.4, 2.0] });
  shadow(c, 560, 890, 360, 26);
  shape(c, () => polyP(c, [[200, 600], [540, 570], [540, 880], [200, 870]]), PAPER, 6);
  shape(c, () => polyP(c, [[540, 570], [880, 600], [880, 870], [540, 880]]), PAPER, 6);
  const photo = (x: number, y: number, o: FaceOpts) => { shape(c, () => rrect(c, x - 70, y - 85, 140, 170, 8), "#e9d9b8", 5); face(c, x, y - 5, 38, o); };
  photo(280, 730, { adult: true, longHair: true, dimple: true }); photo(450, 730, { adult: true, thickBrows: true });
  photo(630, 730, { adult: true, curly: true, grey: true }); photo(800, 730, { curly: true });
};
// a2: a video call: grandmother on the phone, the girl points at her own curls
const flowA2 = (c: Ctx) => {
  ground(c);
  shadow(c, 450, 900, 220, 24);
  shape(c, () => rrect(c, 250, 140, 380, 750, 40), INK, 6);
  shape(c, () => rrect(c, 272, 190, 336, 650, 18), "#dff0f7", 0);
  c.save(); c.beginPath(); rrect(c, 272, 190, 336, 650, 18); c.clip();
  shape(c, () => rrect(c, 300, 600, 280, 300, 60), COL.purple, 6);
  face(c, 440, 440, 110, { adult: true, grey: true, curly: true, laugh: true });
  c.restore();
  shape(c, () => ell(c, 440, 865, 8, 8), COL.grey, 0);
  figure(c, 820, 980, 600, { curly: true, laugh: true, armR: [-1.0, -2.3], armL: [2.0, 1.6] });
  arrow(c, [[560, 320], [660, 280], [760, 360]]);
};
// c1: two Starfish-Bird parents, three babies with lines to the parents
const flowC1 = (c: Ctx) => {
  ground(c);
  sheet(c, 100, 50, 880, 980);
  bird(c, 330, 290, 110, { star: true, col: COL.orange, crest: true, longLegs: true, wings: false });
  bird(c, 750, 290, 110, { star: false, col: COL.purple, crest: false, longLegs: false, wings: true });
  const B: Bird[] = [{ star: true, col: COL.orange, crest: true, longLegs: false, wings: true }, { star: false, col: COL.purple, crest: true, longLegs: true, wings: false }, { star: false, col: COL.orange, crest: false, longLegs: true, wings: true }];
  B.forEach((b, i) => { const x = 250 + i * 290; bird(c, x, 760, 70, b); dotted(c, [[330, 460], [x, 650]], COL.orange); dotted(c, [[750, 400], [x, 650]], COL.purple); });
};
// term 0 similar: two children, both with curly hair
const term0 = (c: Ctx) => {
  ground(c);
  shadow(c, 400, 960, 150, 22); shadow(c, 700, 960, 140, 22);
  figure(c, 390, 960, 660, { curly: true, armR: [0.9, 0.4] });
  figure(c, 700, 960, 600, { curly: true, cloth: COL.purple, clothDk: "#6a4fa3", skin: "#d9a070", armL: [2.3, 2.7] });
};
// term 2 inherit: mother and daughter laughing, the same dimple
const term2 = (c: Ctx) => {
  ground(c);
  bust(c, 320, 460, 150, { adult: true, longHair: true, dimple: true, laugh: true, cloth: CLOTH.adult });
  bust(c, 760, 520, 130, { curly: true, dimple: true, laugh: true, cloth: CLOTH.child });
  arrow(c, [[400, 600], [560, 700], [800, 610]]);
};
// expl 0: five children in a row, holding hands
const expl0 = (c: Ctx) => {
  ground(c);
  const hs = [520, 620, 470, 570, 500], skins = ["#d9a070", SKIN.child, "#6e4630", "#c58a5a", "#9c6240"], cl = [COL.teal, CLOTH.child, COL.purple, COL.green, COL.pink];
  const hair: FaceOpts[] = [{ longHair: true }, { curly: true }, {}, { curly: true }, { longHair: true }];
  hs.forEach((h, i) => { const x = 150 + i * 195; shadow(c, x + 10, 955, h * 0.2, 16); figure(c, x, 950, h, { ...hair[i], skin: skins[i], cloth: cl[i], clothDk: "rgba(0,0,0,0.25)", laugh: true, armL: [2.7, 3.0], armR: [0.4, 0.1] }); });
};
// expl 1: mother, father, daughter; the dimple from Amma, the eyebrows from Appa
const expl1 = (c: Ctx) => {
  ground(c);
  shadow(c, 220, 965, 110, 18); shadow(c, 540, 965, 120, 18); shadow(c, 860, 965, 95, 18);
  const m = figure(c, 220, 960, 640, { adult: true, longHair: true, dimple: true });
  const f = figure(c, 540, 960, 700, { adult: true, thickBrows: true, cloth: COL.teal, clothDk: COL.tealDk });
  const g = figure(c, 860, 960, 520, { curly: true, dimple: true, thickBrows: true });
  dotted(c, [[m.hx + m.r * 0.5, m.hy + m.r * 0.5], [540, 160], [g.hx + g.r * 0.5, g.hy + g.r * 0.5]], RED);
  dotted(c, [[f.hx, f.hy - f.r * 0.14], [700, 420], [g.hx, g.hy - g.r * 0.14]], COL.blueDk);
};
// expl 3: a pea plant climbing a stick in a pot; a split pea shows the baby plant
const expl3 = (c: Ctx) => {
  ground(c);
  shadow(c, 650, 900, 190, 28); shadow(c, 260, 880, 190, 24);
  line(c, [[640, 820], [655, 150]], 16, INK); line(c, [[640, 820], [655, 150]], 9, COL.brown);
  const stem: number[][] = []; for (let i = 0; i <= 20; i++) { const t = i / 20; stem.push([645 + Math.sin(t * Math.PI * 3) * 55, 820 - t * 640]); }
  line(c, stem, 12, INK); line(c, stem, 7, COL.leaf);
  const leafAt = (i: number, s: number) => { const [x, y] = stem[i]; const an = s < 0 ? Math.PI * 0.85 : Math.PI * 0.15; const tx = x + Math.cos(an) * 90, ty = y + Math.sin(an) * 90 - 30; shape(c, () => { c.moveTo(x, y); c.quadraticCurveTo((x + tx) / 2 + s * 10, ty - 40, tx, ty); c.quadraticCurveTo((x + tx) / 2 - s * 10, ty + 30, x, y); c.closePath(); }, COL.leaf, 5); };
  [2, 5, 8, 11, 14, 17].forEach((i, k) => leafAt(i, k % 2 ? 1 : -1));
  const flower = (x: number, y: number) => { for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2; shape(c, () => ell(c, x + Math.cos(a) * 16, y + Math.sin(a) * 16, 14, 14), WHITE, 4); } shape(c, () => ell(c, x, y, 9, 9), COL.yellow, 3); };
  flower(stem[18][0] - 60, stem[18][1] + 10); flower(stem[13][0] + 70, stem[13][1]); flower(stem[20][0] + 50, stem[20][1] + 20);
  pod(c, stem[9][0] + 80, stem[9][1] + 60, 60, 16, 1.2, false, 5); pod(c, stem[15][0] - 90, stem[15][1] + 50, 55, 15, 1.4, false, 4);
  shape(c, () => polyP(c, [[490, 820], [810, 820], [780, 1000], [520, 1000]]), "#c8744a", 6);
  shade(c, () => polyP(c, [[490, 820], [810, 820], [780, 1000], [520, 1000]]), "#9a5232", 60, 0, 0.45);
  shape(c, () => rrect(c, 470, 790, 360, 50, 10), "#d98a5e", 6);
  // the split pea: two halves, the baby plant inside one
  pea(c, 180, 800, 100);
  shape(c, () => ell(c, 345, 800, 100, 100), "#a8d57a", 6);
  shape(c, () => ell(c, 345, 800, 72, 72), "#c9e6a0", 3);
  line(c, [[350, 860], [340, 820], [320, 770]], 18, INK); line(c, [[350, 860], [340, 820], [320, 770]], 10, "#fff6d6");
  shape(c, () => ell(c, 300, 752, 24, 14, -0.6), "#dcefb0", 4); shape(c, () => ell(c, 335, 745, 24, 14, 0.4), "#dcefb0", 4);
  line(c, [[350, 860], [365, 885]], 10, INK); line(c, [[350, 860], [365, 885]], 5, "#fff6d6");
};

export const ic_evolutionInheritanceL1 = cards("sci.evolution.inheritance.L1", [
  setupE1_0, setupE1_1, setupE1_2,
  flowG1, flowG2, flowA1, flowA2, flowC1, term0, term2, expl0, expl1, expl3,
]);
