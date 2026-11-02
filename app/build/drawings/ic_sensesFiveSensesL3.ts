import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, BG, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, bowl, write, cards } from "./flatKit";

// sci.senses.five-senses.L3 · picture cards (intro, cover, experiments, activities, challenges, terms, explanations).
// Child and grown-up are the same as on the set-up cards.

const limb = (c: Ctx, pts: number[][], w: number, fill: string) => { line(c, pts, w + 10, INK); line(c, pts, w, fill); };
const table = (c: Ctx, y: number) => {
  shape(c, () => rrect(c, -20, y, 1120, 70, 4), COL.wood, 6);
  c.fillStyle = COL.woodDk; c.fillRect(-14, y + 44, 1108, 20);
  line(c, [[-14, y + 64], [1094, y + 64]], 6);
};
// a head and shoulders seen from the front
type FaceOpt = { shut?: boolean; adult?: boolean; open?: boolean; band?: boolean };
const face = (c: Ctx, x: number, y: number, r: number, o: FaceOpt = {}) => {
  const sk = o.adult ? SKIN.adult : SKIN.child, skd = o.adult ? SKIN.adultDk : SKIN.childDk, cl = o.adult ? CLOTH.adult : CLOTH.child, cld = o.adult ? CLOTH.adultDk : CLOTH.childDk;
  const body = () => rrect(c, x - r * 1.3, y + r * 1.1, r * 2.6, r * 1.7, r * 0.5);
  shape(c, body, cl); shade(c, body, cld, r * 0.3, 0);
  shape(c, () => rrect(c, x - r * 0.28, y + r * 0.8, r * 0.56, r * 0.5, 8), sk, 5);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.98, y + r * 0.12, r * 0.16, r * 0.25), sk, 5);
  if (!o.adult) shape(c, () => ell(c, x + r * 0.85, y - r * 0.95, r * 0.32, r * 0.32), CLOTH.hair, 5);
  shape(c, () => ell(c, x, y, r, r * 1.05), sk);
  shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.02, y); c.closePath(); }, CLOTH.hair, 5);
  for (const s of [-1, 1]) {
    if (o.shut) { c.beginPath(); c.arc(x + s * r * 0.38, y + r * 0.0, r * 0.13, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.lineCap = "round"; c.stroke(); }
    else shape(c, () => ell(c, x + s * r * 0.38, y + r * 0.08, r * 0.09, r * 0.12), INK, 0);
  }
  shape(c, () => ell(c, x, y + r * 0.3, r * 0.09, r * 0.12), skd, 4);
  if (o.open) shape(c, () => ell(c, x, y + r * 0.62, r * 0.15, r * 0.19), "#c8564a", 4);
  else { c.beginPath(); c.arc(x, y + r * 0.5, r * 0.25, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
  if (o.band) { shape(c, () => rrect(c, x - r * 1.04, y - r * 0.22, r * 2.08, r * 0.44, 6), WHITE, 5); }
};
// a girl's head and shoulders seen from the side, facing right; her nose is at (x + r, y)
const bust = (c: Ctx, x: number, y: number, r: number, bottom: number, shut = false, open = false) => {
  const body = () => rrect(c, x - r * 1.25, y + r * 0.95, r * 2.5, bottom - y - r * 0.95 + 30, r * 0.7);
  shape(c, body, CLOTH.child); shade(c, body, CLOTH.childDk, r * 0.5, 0);
  shape(c, () => rrect(c, x - r * 0.25, y + r * 0.7, r * 0.7, r * 0.5, 6), SKIN.child, 5);
  shape(c, () => ell(c, x - r * 0.95, y - r * 0.55, r * 0.45, r * 0.45), CLOTH.hair, 5);
  const head = () => ell(c, x, y, r, r * 1.05);
  shape(c, head, SKIN.child);
  shape(c, () => ell(c, x + r * 1.0, y + r * 0.02, r * 0.17, r * 0.17), SKIN.child, 5);
  c.save(); c.beginPath(); head(); c.clip(); c.beginPath(); ell(c, x - r * 0.5, y - r * 0.8, r * 1.15, r * 0.62); c.fillStyle = CLOTH.hair; c.fill(); c.restore();
  c.beginPath(); head(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  shape(c, () => ell(c, x - r * 0.1, y + r * 0.2, r * 0.12, r * 0.2), SKIN.childDk, 4);
  if (shut) line(c, [[x + r * 0.38, y - r * 0.02], [x + r * 0.62, y - r * 0.02]], 5);
  else shape(c, () => ell(c, x + r * 0.5, y - r * 0.05, r * 0.09, r * 0.13), INK, 0);
  shape(c, () => ell(c, x + r * 1.06, y + r * 0.5, r * 0.1, r * 0.1), open ? "#c8564a" : INK, 3);
};
const pencil = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w = 34, body: string = COL.yellow) => {
  const an = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1);
  c.save(); c.translate(x1, y1); c.rotate(an);
  shape(c, () => rrect(c, 0, -w / 2, L - w * 1.1, w, 4), body);
  shape(c, () => polyP(c, [[L - w * 1.1, -w / 2], [L, 0], [L - w * 1.1, w / 2]]), COL.wood, 5);
  shape(c, () => polyP(c, [[L - w * 0.42, -w * 0.17], [L, 0], [L - w * 0.42, w * 0.17]]), INK, 2);
  shape(c, () => rrect(c, -w * 0.1, -w / 2, w * 0.45, w, 4), COL.pink, 5);
  c.restore();
};
const watch = (c: Ctx, x: number, y: number, r: number, an: number) => {
  shadow(c, x + r * 0.15, y + r * 1.05, r * 0.9, r * 0.14);
  shape(c, () => rrect(c, x - r * 0.18, y - r * 1.3, r * 0.36, r * 0.35, 6), COL.steelDk);
  shape(c, () => ell(c, x, y, r, r), COL.steel);
  shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), WHITE, 4);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62], [x + Math.cos(a) * r * 0.72, y + Math.sin(a) * r * 0.72]], 4); }
  line(c, [[x, y], [x + Math.cos(an) * r * 0.58, y + Math.sin(an) * r * 0.58]], 8, RED);
  shape(c, () => ell(c, x, y, r * 0.09, r * 0.09), INK, 0);
};
// small icons of the five organs
const eyeI = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - s, y); c.quadraticCurveTo(x, y - s * 0.95, x + s, y); c.quadraticCurveTo(x, y + s * 0.95, x - s, y); c.closePath(); }, WHITE);
  shape(c, () => ell(c, x, y, s * 0.4, s * 0.4), COL.blue, 4); shape(c, () => ell(c, x, y, s * 0.19, s * 0.19), INK, 0);
  shape(c, () => ell(c, x - s * 0.1, y - s * 0.12, s * 0.07, s * 0.07), WHITE, 0);
};
const earI = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - s * 0.1, y - s); c.bezierCurveTo(x + s * 0.9, y - s * 1.05, x + s * 0.9, y + s * 0.2, x + s * 0.2, y + s * 0.5); c.bezierCurveTo(x + s * 0.1, y + s * 1.1, x - s * 0.7, y + s * 1.05, x - s * 0.6, y + s * 0.4); c.bezierCurveTo(x - s * 0.9, y - s * 0.1, x - s * 0.8, y - s, x - s * 0.1, y - s); c.closePath(); }, SKIN.child);
  line(c, [[x - s * 0.05, y - s * 0.55], [x + s * 0.35, y - s * 0.3], [x + s * 0.2, y + s * 0.1], [x - s * 0.15, y + s * 0.3]], 5, SKIN.childDk);
};
const noseI = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x, y - s); c.bezierCurveTo(x + s * 0.3, y - s * 0.3, x + s * 0.9, y + s * 0.1, x + s * 0.85, y + s * 0.55); c.quadraticCurveTo(x, y + s * 0.95, x - s * 0.85, y + s * 0.55); c.bezierCurveTo(x - s * 0.9, y + s * 0.1, x - s * 0.3, y - s * 0.3, x, y - s); c.closePath(); }, SKIN.child);
  for (const sg of [-1, 1]) shape(c, () => ell(c, x + sg * s * 0.33, y + s * 0.55, s * 0.17, s * 0.12), INK, 0);
};
const tongueI = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - s * 0.75, y - s * 0.8); c.lineTo(x + s * 0.75, y - s * 0.8); c.bezierCurveTo(x + s * 0.85, y + s * 0.4, x + s * 0.5, y + s, x, y + s); c.bezierCurveTo(x - s * 0.5, y + s, x - s * 0.85, y + s * 0.4, x - s * 0.75, y - s * 0.8); c.closePath(); }, "#e8788f");
  line(c, [[x, y - s * 0.6], [x, y + s * 0.5]], 5, "#b94b63");
};
const mango = (c: Ctx, x: number, y: number, s: number, col: string, dk: string, leafCol: string, dot = false) => {
  const m = () => { c.moveTo(x - s * 0.7, y); c.bezierCurveTo(x - s * 0.7, y - s * 0.8, x + s * 0.5, y - s * 0.9, x + s * 0.95, y - s * 0.25); c.bezierCurveTo(x + s * 0.85, y + s * 0.7, x - s * 0.2, y + s * 0.95, x - s * 0.7, y); c.closePath(); };
  shape(c, m, col); shade(c, m, dk, s * 0.2, s * 0.1);
  shape(c, () => { c.moveTo(x - s * 0.1, y - s * 0.82); c.quadraticCurveTo(x + s * 0.3, y - s * 1.35, x + s * 0.75, y - s * 1.05); c.quadraticCurveTo(x + s * 0.4, y - s * 0.7, x - s * 0.1, y - s * 0.82); c.closePath(); }, leafCol, 5);
  if (dot) shape(c, () => ell(c, x + s * 0.1, y, s * 0.06, s * 0.06), INK, 0);
};
const jar = (c: Ctx, x: number, y: number, w: number, h: number, fill: string) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.6, w * 0.1);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 18), COL.glass);
  shape(c, () => rrect(c, x - w / 2 + 6, y - h * 0.72, w - 12, h * 0.72 - 6, 14), fill, 0);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 18), "rgba(0,0,0,0)", 5);
  shape(c, () => rrect(c, x - w * 0.56, y - h - 34, w * 1.12, 40, 10), COL.steelDk);
  shine(c, [[x - w * 0.32, y - h * 0.8], [x - w * 0.32, y - h * 0.2]], 8);
};
const waves = (c: Ctx, x: number, y: number, r: number, from: number, to: number, n = 3, col: string = COL.blueDk) => {
  for (let i = 1; i <= n; i++) { c.beginPath(); c.arc(x, y, r * i, from, to); c.strokeStyle = col; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
};

// a hand pinching the nose of a front face: nose at (x, y + 0.3r)
const pinch = (c: Ctx, x: number, y: number, r: number) => {
  const ny = y + r * 0.3;
  limb(c, [[x + r * 2.1, y + r * 2.6], [x + r * 1.5, y + r * 1.5], [x + r * 0.75, ny + r * 0.1]], r * 0.34, CLOTH.child);
  shape(c, () => ell(c, x + r * 0.55, ny + r * 0.05, r * 0.3, r * 0.22, -0.3), SKIN.child, 5);
  limb(c, [[x + r * 0.5, ny - r * 0.1], [x - r * 0.15, ny - r * 0.08]], r * 0.17, SKIN.child);
  limb(c, [[x + r * 0.5, ny + r * 0.14], [x - r * 0.12, ny + r * 0.12]], r * 0.17, SKIN.child);
};
const spoon = (c: Ctx, x: number, y: number, extra: () => void) => {
  limb(c, [[x + 70, y + 6], [x + 300, y + 36], [x + 400, y + 44]], 18, COL.steel);
  shape(c, () => ell(c, x, y, 76, 42, 0.1), COL.steel);
  shape(c, () => ell(c, x, y - 10, 52, 22, 0.1), WHITE, 3);
  extra();
  hand(c, x + 500, y + 70, Math.PI + 0.12, 1.15, SKIN.adult, CLOTH.adult);
};
// 0 · intro: pinch your nose, sugar on the tongue
const intro = (c: Ctx) => {
  ground(c);
  face(c, 400, 420, 210, { shut: true, open: true });
  pinch(c, 400, 420, 210);
  spoon(c, 500, 640, () => { for (const [gx, gy] of [[480, 620], [514, 626], [540, 632]]) shape(c, () => ell(c, gx, gy, 4, 4), COL.steelIn, 0); });
};
// 1 · summary: five senses go to one brain
const summary = (c: Ctx) => {
  ground(c);
  const br = () => ell(c, 540, 540, 170, 135);
  shape(c, br, "#f2a3b8"); shade(c, br, "#d9708e", 30, 20);
  for (const d of [[-70, -40, -20, 20], [30, -70, 70, -10], [-80, 30, -30, 60], [10, 20, 80, 50]]) line(c, [[540 + d[0], 540 + d[1]], [540 + (d[0] + d[2]) / 2, 540 + (d[1] + d[3]) / 2 - 24], [540 + d[2], 540 + d[3]]], 6, "#b94b63");
  const spots: [number, number, (c: Ctx, x: number, y: number, s: number) => void][] = [[170, 170, eyeI], [910, 170, earI], [140, 560, noseI], [940, 560, tongueI]];
  for (const [x, y, fn] of spots) { shape(c, () => ell(c, x, y, 112, 112), WHITE, 6); fn(c, x, y, 62); }
  shape(c, () => ell(c, 540, 905, 112, 112), WHITE, 6); hand(c, 470, 905, 0, 0.9, SKIN.child, CLOTH.child, true);
  arrow(c, [[250, 240], [370, 400]]); arrow(c, [[830, 240], [710, 400]]); arrow(c, [[260, 560], [350, 550]]);
  arrow(c, [[830, 560], [730, 550]]); arrow(c, [[540, 790], [540, 700]]);
};
// 2 · e1: pinch nose, spoon of sugar with elaichi
const e1 = (c: Ctx) => {
  ground(c); table(c, 860);
  face(c, 380, 400, 190, { shut: true });
  pinch(c, 380, 400, 190);
  spoon(c, 480, 600, () => shape(c, () => ell(c, 505, 588, 12, 8, 0.4), COL.green, 3));
  for (const k of [-1, 1]) shape(c, () => ell(c, 940 + k * 30, 840, 30, 18, k * 0.3), COL.greenLt, 5);
  jar(c, 940, 860, 120, 140, WHITE);
};
// 3 · e2: two-point test, fingertip feels two, forearm feels one
const e2 = (c: Ctx) => {
  ground(c);
  line(c, [[540, 130], [540, 950]], 5, COL.grey);
  // fingertip
  shape(c, () => rrect(c, 190, 480, 120, 520, 60), SKIN.child);
  shape(c, () => rrect(c, 212, 496, 76, 60, 30), "#f6dcc7", 4);
  const clip = (cx: number, ty: number) => { line(c, [[cx - 22, ty - 170], [cx - 22, ty], [cx - 22, ty - 10]], 10, COL.steelDk); line(c, [[cx - 22, ty - 170], [cx - 22, ty - 12]], 14, INK); line(c, [[cx + 22, ty - 170], [cx + 22, ty - 12]], 14, INK); line(c, [[cx - 22, ty - 170], [cx - 22, ty - 270], [cx + 22, ty - 270], [cx + 22, ty - 170]], 14, INK); line(c, [[cx - 22, ty - 170], [cx - 22, ty - 270], [cx + 22, ty - 270], [cx + 22, ty - 170]], 7, COL.steel); line(c, [[cx - 22, ty - 168], [cx - 22, ty - 14]], 7, COL.steel); line(c, [[cx + 22, ty - 168], [cx + 22, ty - 14]], 7, COL.steel); };
  clip(250, 480);
  write(c, "2", 220, 30, 120, INK, 14);
  // forearm
  shape(c, () => rrect(c, 620, 640, 400, 190, 90), SKIN.child);
  shape(c, () => rrect(c, 620, 640, 400, 190, 90), "rgba(0,0,0,0)", 6);
  clip(820, 640);
  write(c, "1", 790, 30, 120, INK, 14);
};
// 4 · e3: eyes covered, pointing at a clap on the right
const e3 = (c: Ctx) => {
  ground(c);
  face(c, 380, 450, 190, { band: true, open: false });
  limb(c, [[420, 800], [600, 700], [760, 640]], 56, CLOTH.child);
  shape(c, () => ell(c, 800, 628, 48, 34, -0.4), SKIN.child, 5);
  limb(c, [[800, 620], [880, 580]], 24, SKIN.child);
  hand(c, 700, 300, 0, 1, SKIN.adult, CLOTH.adult, true);
  hand(c, 1000, 300, Math.PI, 1, SKIN.adult, CLOTH.adult, true);
  waves(c, 850, 300, 60, Math.PI * 1.1, Math.PI * 1.9, 3);
  arrow(c, [[740, 440], [610, 520]]);
};
// 5 · a1: one quiet minute
const a1 = (c: Ctx) => {
  ground(c); table(c, 880);
  face(c, 380, 440, 200, { shut: true });
  watch(c, 830, 560, 150, -1.2);
  waves(c, 600, 380, 60, -0.5, 0.5, 2);
  eyeI(c, 620, 130, 70); earI(c, 830, 180, 50);
  noseI(c, 980, 170, 45);
};
// 6 · a2: feel the sound: balloon on a phone, grains on cling film
const a2 = (c: Ctx) => {
  ground(c); table(c, 860);
  shadow(c, 300, 850, 190, 18);
  shape(c, () => rrect(c, 130, 830, 360, 42, 12), COL.black, 6);
  for (let i = 0; i < 6; i++) line(c, [[180 + i * 54, 850], [200 + i * 54, 850]], 6, COL.greyDk);
  const bx = 310, by = 600;
  const bb = () => { c.moveTo(bx, by + 230); c.bezierCurveTo(bx - 190, by + 190, bx - 210, by - 220, bx, by - 230); c.bezierCurveTo(bx + 210, by - 220, bx + 190, by + 190, bx, by + 230); c.closePath(); };
  shape(c, bb, COL.pink); shade(c, bb, "#d9708e", 50, 20);
  shape(c, () => polyP(c, [[bx, by + 228], [bx - 22, by + 262], [bx + 22, by + 262]]), "#d9708e", 4);
  line(c, [[bx - 90, by - 110], [bx - 60, by - 160]], 14, WHITE);
  for (const k of [-1, 1]) for (let i = 1; i <= 2; i++) { c.beginPath(); c.arc(bx, by, 215 + i * 34, k > 0 ? -0.4 : Math.PI - 0.4, k > 0 ? 0.4 : Math.PI + 0.4); c.strokeStyle = COL.blueDk; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
  bowl(c, 800, 640, 190, COL.steelIn);
  shape(c, () => ell(c, 800, 640, 182, 36), "rgba(235,246,252,0.7)", 5);
  const r = rnd(5);
  for (let i = 0; i < 9; i++) { const gx = 700 + r() * 200, gy = 560 + r() * 70; shape(c, () => ell(c, gx, gy, 9, 9), WHITE, 3); }
  for (const k of [0, 1, 2]) line(c, [[690 + k * 110, 520], [690 + k * 110, 480]], 6, RED);
};
// 7 · a3: mystery bag
const a3 = (c: Ctx) => {
  ground(c); table(c, 930);
  shadow(c, 520, 800, 260, 28);
  const bag = () => { c.moveTo(330, 270); c.bezierCurveTo(240, 400, 200, 600, 260, 780); c.quadraticCurveTo(520, 830, 780, 780); c.bezierCurveTo(840, 600, 800, 400, 710, 270); c.closePath(); };
  shape(c, bag, "#d9b98a"); shade(c, bag, "#b8935f", 60, 10);
  shape(c, () => ell(c, 520, 270, 195, 40), "#8a6a3a", 6);
  line(c, [[340, 300], [420, 330], [520, 340], [620, 330], [700, 300]], 14, COL.red);
  limb(c, [[900, 285], [1100, 250]], 56, CLOTH.child);
  hand(c, 830, 295, Math.PI, 1.2, SKIN.child, CLOTH.child);
  const items: [number, (x: number, y: number) => void][] = [
    [140, (x, y) => { shape(c, () => ell(c, x, y, 40, 40), COL.yellow, 5); shape(c, () => ell(c, x, y, 24, 24), COL.orange, 3); }],
    [290, (x, y) => { line(c, [[x - 40, y], [x + 30, y]], 14, INK); line(c, [[x - 40, y], [x + 30, y]], 8, COL.steelDk); shape(c, () => ell(c, x - 40, y, 22, 22), COL.steel, 5); }],
    [440, (x, y) => { shape(c, () => ell(c, x, y, 42, 24, 0.3), COL.greenLt, 5); }],
    [590, (x, y) => { shape(c, () => ell(c, x, y, 42, 42), COL.pink, 5); shape(c, () => ell(c, x, y, 18, 18), BG, 4); }],
    [740, (x, y) => { for (const [dx, dy] of [[-16, 8], [14, 10], [0, -12]]) shape(c, () => ell(c, x + dx, y + dy, 24, 24), WHITE, 4); }],
    [890, (x, y) => { line(c, [[x - 44, y + 12], [x + 44, y - 12]], 16, INK); line(c, [[x - 44, y + 12], [x + 44, y - 12]], 9, COL.steel); }],
    [1000, (x, y) => { shape(c, () => ell(c, x, y, 28, 20, 0.5), "#b2503a", 5); }],
  ];
  items.forEach(([, fn], i) => { c.save(); c.translate(90 + i * 150, 895); c.scale(1.3, 1.3); fn(0, 0); c.restore(); });
};
// 8 · a4: the fading coin, and a jar of elaichi
const a4 = (c: Ctx) => {
  ground(c); table(c, 860);
  shape(c, () => rrect(c, 40, 600, 520, 200, 100), SKIN.child);
  shape(c, () => rrect(c, 40, 600, 520, 200, 100), "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, 300, 696, 70, 70), COL.yellow);
  shape(c, () => ell(c, 300, 696, 46, 46), COL.orange, 4);
  waves(c, 300, 696, 100, -2.4, -0.7, 2, COL.red);
  jar(c, 800, 830, 220, 270, COL.greenLt);
  for (const [dx, dy] of [[-40, -70], [20, -120], [-10, -30], [50, -50], [-50, -140]]) shape(c, () => ell(c, 800 + dx, 830 + dy, 32, 18, dx / 40), COL.green, 4);
  for (const k of [-1, 0, 1]) { c.beginPath(); c.moveTo(800 + k * 70, 480); c.bezierCurveTo(800 + k * 70 + 40, 430, 800 + k * 70 - 40, 380, 800 + k * 70, 330); c.strokeStyle = COL.leafDk; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
};
// 9 · a5: blue mango, then the afterimage
const a5 = (c: Ctx) => {
  ground(c);
  for (const [px, tilt] of [[270, -0.05], [800, 0.04]] as const) { c.save(); c.translate(px, 520); c.rotate(tilt); shadow(c, 20, 330, 220, 22); shape(c, () => rrect(c, -210, -290, 420, 580, 6), WHITE); c.restore(); }
  mango(c, 270, 540, 150, "#3f6fd6", "#2c4f9c", "#f08ab0", true);
  mango(c, 800, 540, 150, "#fbe5a0", "#f2d070", "#c9e3a0");
  arrow(c, [[460, 900], [610, 900]]);
  eyeI(c, 535, 150, 70);
};
// 10 · a6: touch the pencil tips
const a6 = (c: Ctx) => {
  ground(c);
  eyeI(c, 480, 220, 80); eyeI(c, 640, 220, 80);
  pencil(c, 190, 640, 530, 640, 46, COL.red);
  hand(c, 110, 640, 0, 1.8, SKIN.child, CLOTH.child);
  pencil(c, 890, 640, 550, 640, 46, COL.blue);
  hand(c, 970, 640, Math.PI, 1.8, SKIN.adult, CLOTH.adult);
};
// 11 · a7: cold, warm, and the middle bowl
const a7 = (c: Ctx) => {
  ground(c);
  const defs: [number, string, string][] = [[190, "#bfe0f5", "cold"], [540, "#f3e5c9", "mid"], [890, "#f7b27c", "warm"]];
  for (const [x, col] of defs) bowl(c, x, 600, 150, col);
  for (const [dx, dy] of [[-40, -6], [20, 6], [-4, 12]]) { shape(c, () => rrect(c, 160 + dx, 590 + dy, 44, 40, 6), WHITE, 4); }
  for (const k of [-1, 0, 1]) { c.beginPath(); c.moveTo(890 + k * 60, 500); c.bezierCurveTo(890 + k * 60 + 30, 460, 890 + k * 60 - 30, 420, 890 + k * 60, 380); c.strokeStyle = COL.red; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
  hand(c, 190, 190, Math.PI / 2, 1.6, SKIN.child, CLOTH.child);
  hand(c, 890, 190, Math.PI / 2, 1.6, SKIN.child, CLOTH.child);
  arrow(c, [[230, 800], [420, 800]]); arrow(c, [[850, 800], [660, 800]]);
};
// 12 · c1: a paper cone to hear a whisper
const c1 = (c: Ctx) => {
  ground(c);
  face(c, 700, 450, 170, {});
  const cone = () => { c.moveTo(535, 480); c.lineTo(300, 300); c.quadraticCurveTo(220, 430, 330, 640); c.lineTo(535, 560); c.closePath(); };
  shape(c, cone, "#fffaf0"); shade(c, cone, "#e4dccb", 40, 30);
  shape(c, () => ell(c, 300, 470, 55, 175, -0.1), "#e4dccb", 6);
  line(c, [[420, 400], [430, 540]], 14, COL.yellow);
  face(c, 130, 880, 90, { adult: true, open: true });
  waves(c, 230, 860, 80, -0.9, 0.1, 3, COL.blueDk);
};
// 13 · c2: six jars with different bands for touch
const c2 = (c: Ctx) => {
  ground(c);
  const fills = [WHITE, "#e9e4d8", COL.yellow, COL.red, "#8a5a3c", "#f6edd5"];
  fills.forEach((fcol, i) => {
    const x = 210 + (i % 3) * 330, y = i < 3 ? 470 : 900;
    jar(c, x, y, 190, 270, fcol);
    for (let b = 0; b <= i; b++) line(c, [[x - 95, y - 40 - b * 30], [x + 95, y - 40 - b * 30]], 10, COL.black);
  });
};
// 14 · vibration: a ruler twanged on a table edge
const vib = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, -20, 500, 400, 440, 8), COL.wood, 6);
  c.save(); c.translate(300, 480);
  for (const a of [-0.22, 0.22, 0]) {
    c.save(); c.rotate(a); c.globalAlpha = a === 0 ? 1 : 0.4;
    shape(c, () => rrect(c, -200, -22, 700, 44, 4), "#f7e08a");
    c.restore(); c.globalAlpha = 1;
  }
  c.restore();
  hand(c, 150, 270, Math.PI / 2, 1.5, SKIN.child, CLOTH.child);
  arrow(c, [[860, 250], [860, 150]]); arrow(c, [[860, 680], [860, 790]]);
};
// 15 · eardrum: sound waves shake a tabla skin
const drum = (c: Ctx) => {
  ground(c); shadow(c, 600, 900, 280, 30);
  const body = () => { c.moveTo(380, 520); c.bezierCurveTo(360, 760, 400, 880, 450, 900); c.lineTo(750, 900); c.bezierCurveTo(800, 880, 840, 760, 820, 520); c.closePath(); };
  shape(c, body, "#b2503a"); shade(c, body, "#8f3b2a", 60, 0);
  for (let i = 0; i < 5; i++) line(c, [[430 + i * 80, 540], [450 + i * 70, 770]], 8, COL.woodDk);
  shape(c, () => ell(c, 600, 520, 230, 90), "#fffaf0");
  shape(c, () => ell(c, 610, 524, 90, 36), INK, 0);
  arrow(c, [[460, 440], [460, 360]]); arrow(c, [[740, 360], [740, 440]]);
  waves(c, 140, 440, 90, -0.8, 0.8, 3, COL.blueDk);
  arrow(c, [[300, 330], [420, 400]]);
};
// 16 · echolocation: bat sends a sound, moth sends it back
const echo = (c: Ctx) => {
  ground(c, "#2b2a5a");
  c.fillStyle = "#f6e9a8"; for (const [x, y] of [[900, 120], [200, 140], [600, 100], [990, 380]]) { c.beginPath(); c.arc(x, y, 5, 0, 7); c.fill(); }
  const wing = (s: number) => shape(c, () => { c.moveTo(250, 520); c.lineTo(250 - s * 40, 330); c.quadraticCurveTo(250 - s * 120, 380, 250 - s * 190, 330); c.quadraticCurveTo(250 - s * 190, 450, 250 - s * 150, 520); c.quadraticCurveTo(250 - s * 100, 560, 250, 600); c.closePath(); }, "#5b4a7a", 6);
  wing(1); wing(-1);
  shape(c, () => ell(c, 250, 560, 80, 120), "#6a5890");
  shape(c, () => ell(c, 260, 440, 70, 66), "#6a5890");
  shape(c, () => polyP(c, [[215, 400], [200, 320], [250, 385]]), "#6a5890", 5); shape(c, () => polyP(c, [[290, 395], [320, 320], [305, 410]]), "#6a5890", 5);
  shape(c, () => ell(c, 245, 436, 11, 11), WHITE, 3); shape(c, () => ell(c, 285, 436, 11, 11), WHITE, 3);
  shape(c, () => ell(c, 265, 470, 10, 7), "#e8788f", 3);
  waves(c, 300, 470, 90, -0.7, 0.7, 4, "#8fd0ff");
  const mx = 820, my = 470;
  shape(c, () => ell(c, mx, my, 16, 64), "#b79a6a");
  shape(c, () => polyP(c, [[mx, my - 30], [mx - 110, my - 80], [mx - 120, my + 10], [mx, my + 20]]), "#e3cf9c");
  shape(c, () => polyP(c, [[mx, my - 30], [mx + 110, my - 80], [mx + 120, my + 10], [mx, my + 20]]), "#e3cf9c");
  waves(c, 740, 470, 40, Math.PI - 0.8, Math.PI + 0.8, 3, "#ffd34d");
};
// 17 · balance sense: standing on one leg, arms out
const balance = (c: Ctx) => {
  ground(c);
  const x = 540, y = 960, h = 760, hip = y - h * 0.42;
  person(c, x, y, h, { armL: [Math.PI * 0.95, Math.PI], armR: [Math.PI * 0.05, 0] });
  c.fillStyle = BG; c.fillRect(x + h * 0.0, hip + 10, h * 0.14, h * 0.44);
  const leg = [[x + h * 0.05, hip], [x + h * 0.2, hip + h * 0.14], [x + h * 0.07, hip + h * 0.28]];
  line(c, leg, h * 0.075, INK); line(c, leg, h * 0.075 - 10, "#6b5a8c");
  shadow(c, x, y + 8, 120, 16);
  waves(c, 540, 270, 120, -2.8, -2.0, 2, COL.red);
  waves(c, 540, 270, 120, -1.1, -0.3, 2, COL.red);
};
// 18 · proprioception: eyes shut, finger finds the nose
const proprio = (c: Ctx) => {
  ground(c);
  face(c, 440, 440, 220, { shut: true });
  limb(c, [[700, 770], [900, 820], [800, 600], [500, 520]], 60, CLOTH.child);
  shape(c, () => ell(c, 450, 485, 36, 30), SKIN.child, 5);
};
// 19 · expl.4: two ears and a sound from the right
const twoEars = (c: Ctx) => {
  ground(c);
  for (const s of [-1, 1]) shape(c, () => ell(c, 400 + s * 200, 560, 40, 70), SKIN.child, 6);
  shape(c, () => ell(c, 400, 560, 200, 210), CLOTH.hair);
  shape(c, () => polyP(c, [[400, 300], [370, 360], [430, 360]]), SKIN.child, 6);
  shape(c, () => { c.moveTo(900, 440); c.bezierCurveTo(900, 350, 1020, 350, 1020, 440); c.lineTo(1040, 480); c.lineTo(880, 480); c.closePath(); }, COL.yellow);
  shape(c, () => ell(c, 960, 495, 20, 20), COL.orange, 5);
  waves(c, 960, 440, 90, Math.PI * 0.55, Math.PI * 1.05, 2, COL.blueDk);
  arrow(c, [[860, 560], [650, 560]]);
  arrow(c, [[860, 640], [640, 840], [400, 860], [190, 760], [160, 640]]);
};
// 20 · taste: every taste bud notices all five tastes
const taste = (c: Ctx) => {
  ground(c);
  shape(c, () => { c.moveTo(250, 160); c.lineTo(830, 160); c.bezierCurveTo(900, 500, 800, 960, 540, 960); c.bezierCurveTo(280, 960, 180, 500, 250, 160); c.closePath(); }, "#e8788f");
  line(c, [[540, 220], [540, 840]], 8, "#b94b63");
  const cols = [COL.yellow, COL.green, WHITE, COL.purple, COL.orange];
  for (const [x, y] of [[350, 330], [700, 330], [540, 520], [380, 720], [700, 720]]) {
    shape(c, () => ell(c, x, y, 95, 95), "#f6c9d3", 6);
    cols.forEach((col, i) => { const a = (i / 5) * Math.PI * 2 - 1.2; shape(c, () => ell(c, x + Math.cos(a) * 52, y + Math.sin(a) * 52, 20, 20), col, 4); });
  }
};
// 21 · smell: molecules drift from a laddoo to the nose
const smell = (c: Ctx) => {
  ground(c);
  bust(c, 290, 420, 190, 1020);
  shadow(c, 810, 870, 200, 26);
  shape(c, () => ell(c, 810, 840, 230, 56), COL.steel); shape(c, () => ell(c, 810, 832, 195, 42), COL.steelIn, 4);
  const lad = () => ell(c, 810, 740, 130, 120);
  shape(c, lad, COL.orange); shade(c, lad, "#d17d24", 40, 30);
  for (const [dx, dy] of [[-50, -40], [20, -70], [60, 10], [-30, 30], [10, -10]]) shape(c, () => ell(c, 810 + dx, 740 + dy, 12, 12), "#fbd27a", 3);
  const r = rnd(9);
  for (let i = 0; i < 9; i++) { const t = i / 8, px = 760 - t * 300 + (r() - 0.5) * 30, py = 590 - t * 120 - Math.sin(t * 3) * 60 + (r() - 0.5) * 30; shape(c, () => ell(c, px, py, 14, 14), "#9ccbef", 4); }
  arrow(c, [[640, 420], [500, 410]]);
};
// 22 · flavour: tongue + nose = mango
const flavour = (c: Ctx) => {
  ground(c);
  tongueI(c, 170, 520, 130); noseI(c, 480, 520, 120);
  write(c, "+", 270, 440, 140, INK, 14);
  line(c, [[610, 500], [710, 500]], 14); line(c, [[610, 560], [710, 560]], 14);
  mango(c, 880, 540, 140, COL.yellow, COL.orange, COL.leaf, false);
};

export const ic_sensesFiveSensesL3 = cards("sci.senses.five-senses.L3 cards", [
  intro, summary, e1, e2, e3, a1, a2, a3, a4, a5, a6, a7, c1, c2, vib, drum, echo, balance, proprio, twoEars, taste, smell, flavour,
]);
