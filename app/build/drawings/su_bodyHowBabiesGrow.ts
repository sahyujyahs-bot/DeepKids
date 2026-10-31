import type { Ctx } from "./core";
import { COL, CLOTH, SKIN, INK, WHITE, RED, BG, shape, ell, rrect, polyP, shadow, shade, line, shine, arrow, hand, write, ground, cards } from "./flatKit";

// sci.body.how-babies-grow.L3 set-up cards: egg jars (e1), water bag and hum (e2), warm bottles (e3).

// ---------------------------------------------------------------- shared pieces
// the table the things rest on: a wooden top seen at a slight angle
const table = (c: Ctx, y = 880) => {
  shape(c, () => polyP(c, [[0, y], [1080, y], [1080, 1080], [0, 1080]]), COL.wood, 0);
  shape(c, () => polyP(c, [[0, y], [1080, y], [1080, y + 22], [0, y + 22]]), COL.woodDk, 0);
  line(c, [[0, y], [1080, y]], 6);
};
// the tray the jars stand on
const tray = (c: Ctx) => {
  shadow(c, 560, 925, 470, 40);
  shape(c, () => polyP(c, [[150, 790], [930, 790], [1020, 880], [60, 880]]), COL.steelIn);
  shape(c, () => polyP(c, [[60, 880], [1020, 880], [1020, 930], [60, 930]]), COL.steel);
  shade(c, () => polyP(c, [[60, 880], [1020, 880], [1020, 930], [60, 930]]), COL.steelDk, 0, 22, 0.6);
};
// a clear plastic jar: bottom centre (x, y); water = filled to the top; lid = screwed on; inner draws what is inside
const jar = (c: Ctx, x: number, y: number, w: number, h: number, water: boolean, lid: boolean, inner: () => void) => {
  const L = x - w / 2, T = y - h;
  const body = () => rrect(c, L, T, w, h, 34);
  shape(c, body, "rgba(235,246,252,0.7)", 0);
  if (water) { c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(L, T + 16, w, h); c.fillStyle = COL.drop; c.fillRect(L, T + 16, w, 12); c.fillStyle = COL.waterDk; c.globalAlpha = 0.5; c.fillRect(L + w * 0.78, T, w, h); c.restore(); c.globalAlpha = 1; }
  inner();
  shape(c, body, "rgba(255,255,255,0.08)", 6);
  shine(c, [[L + 28, T + 70], [L + 28, y - 60]], 10);
  if (lid) {
    shape(c, () => rrect(c, L - 8, T - 46, w + 16, 58, 14), COL.teal);
    shade(c, () => rrect(c, L - 8, T - 46, w + 16, 58, 14), COL.tealDk, 26, 0, 0.6);
    for (let k = 1; k < 7; k++) line(c, [[L - 8 + k * ((w + 16) / 7), T - 36], [L - 8 + k * ((w + 16) / 7), T - 8]], 4, COL.tealDk);
  } else {
    shape(c, () => rrect(c, L - 6, T - 14, w + 12, 22, 10), COL.steelIn);
  }
};
// a raw brown egg lying at (x, y)
const egg = (c: Ctx, x: number, y: number, rx: number, ry: number, rot: number) => {
  const p = () => ell(c, x, y, rx, ry, rot);
  shape(c, p, "#f1d7b0", 6);
  shade(c, p, "#d0a974", rx * 0.4, ry * 0.3, 0.7);
  shine(c, [[x - rx * 0.55 * Math.cos(rot) - ry * 0.4 * Math.sin(rot), y - ry * 0.4 * Math.cos(rot)], [x - rx * 0.4, y - ry * 0.1]], 8);
};
// a broken egg: flat white puddle, round yolk, two jagged shell halves
const brokenEgg = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => ell(c, x, y + 4 * s, 120 * s, 34 * s), "#fffdf2", 5);
  shape(c, () => ell(c, x + 8 * s, y - 6 * s, 42 * s, 30 * s), COL.yellow, 5);
  shape(c, () => ell(c, x - 2 * s, y - 16 * s, 12 * s, 7 * s), "#fff1a8", 0);
  const half = (hx: number, hy: number, dir: number) => shape(c, () => polyP(c, [[hx, hy], [hx + dir * 36 * s, hy - 60 * s], [hx + dir * 52 * s, hy - 40 * s], [hx + dir * 70 * s, hy - 58 * s], [hx + dir * 82 * s, hy - 20 * s], [hx + dir * 92 * s, hy]]), "#f1d7b0", 5);
  half(x - 80 * s, y + 10 * s, -1); half(x + 80 * s, y + 14 * s, 1);
};
// a jar with an egg, in the three states the egg card needs
const emptyJarEgg = (c: Ctx, x: number, y: number, w: number, h: number, lid: boolean, broken: boolean) =>
  jar(c, x, y, w, h, false, lid, () => (broken ? brokenEgg(c, x, y - 40, 0.92) : egg(c, x, y - 100, 72, 98, 0.25)));
const waterJarEgg = (c: Ctx, x: number, y: number, w: number, h: number, lid: boolean, ry = 0.25) => jar(c, x, y, w, h, true, lid, () => egg(c, x, y - 100, 72, 98, ry));

// a bottle of warm water; (x, y) is its middle, rot tilts it, wl is the water level measured from the middle (world down)
const bottle = (c: Ctx, x: number, y: number, rot: number, w: number, h: number, wl: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const bodyP = () => rrect(c, -w / 2, -h / 2 + h * 0.2, w, h * 0.8, w * 0.26), neckP = () => rrect(c, -w * 0.2, -h / 2 + h * 0.07, w * 0.4, h * 0.2, 6);
  shape(c, bodyP, COL.glass, 0); shape(c, neckP, COL.glass, 0);
  c.save(); c.beginPath(); bodyP(); neckP(); c.clip(); c.rotate(-rot);
  c.fillStyle = COL.water; c.fillRect(-600, wl, 1200, 1200); c.fillStyle = COL.drop; c.fillRect(-600, wl, 1200, 10);
  c.restore();
  c.save(); c.beginPath(); bodyP(); c.clip(); c.fillStyle = COL.waterDk; c.globalAlpha = 0.45; c.fillRect(w * 0.2, -h, w, h * 2); c.restore(); c.globalAlpha = 1;
  shape(c, bodyP, "rgba(255,255,255,0.05)", 6); shape(c, neckP, "rgba(255,255,255,0.05)", 6);
  shine(c, [[-w * 0.3, -h / 2 + h * 0.36], [-w * 0.3, h / 2 - h * 0.1]], 9);
  shape(c, () => rrect(c, -w * 0.25, -h / 2, w * 0.5, h * 0.1, 8), COL.red, 6);
  c.restore();
};
const standBottle = (c: Ctx, x: number, base: number, w: number, h: number) => {
  shadow(c, x + w * 0.15, base + 6, w * 0.7, w * 0.12);
  bottle(c, x, base - h / 2, 0, w, h, -h / 2 + h * 0.28);
};
// wavy steam lines over a warm bottle
const steam = (c: Ctx, x: number, y: number, s = 1) => {
  for (const dx of [-28, 12]) { const pts: number[][] = []; for (let t = 0; t <= 1.001; t += 0.1) pts.push([x + dx * s + Math.sin(t * 7 + dx) * 12 * s, y - t * 70 * s]); line(c, pts, 7, COL.grey); }
};
// a towel with two stripes, wrapped round the lower part of a standing bottle
const towelWrap = (c: Ctx, x: number, base: number, w: number, h: number) => {
  const T = base - h * 0.74, p = () => rrect(c, x - w * 0.68, T, w * 1.36, h * 0.74, 22);
  shape(c, p, COL.cloth); shade(c, p, "#d9d0bb", w * 0.28, 0, 0.7);
  c.save(); c.beginPath(); p(); c.clip(); c.fillStyle = COL.teal; c.fillRect(x - w, T + h * 0.18, w * 2, 26); c.fillRect(x - w, T + h * 0.44, w * 2, 26); c.restore();
  shape(c, p, "rgba(0,0,0,0)", 6);
  line(c, [[x - w * 0.5, T + 20], [x - w * 0.2, T + h * 0.7]], 4, "#d9d0bb");
};

// ---------------------------------------------------------------- faces
const tuft = (c: Ctx, x: number, y: number, r: number, adult: boolean) => {
  shape(c, () => ell(c, x, y - r * (adult ? 1.12 : 1.1), r * (adult ? 0.4 : 0.3), r * (adult ? 0.34 : 0.26)), CLOTH.hair, 5);
};
// a front-facing head with ears, hair, face: eyes open / shut, mouth smile / hum
const face = (c: Ctx, x: number, y: number, r: number, adult = false, eyes: "open" | "shut" = "open", mouth: "smile" | "hum" = "smile") => {
  const skin = adult ? SKIN.adult : SKIN.child, dk = adult ? SKIN.adultDk : SKIN.childDk;
  tuft(c, x, y, r, adult);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.97, y + r * 0.08, r * 0.13, r * 0.2), skin, 5);
  const head = () => ell(c, x, y, r, r * 1.05);
  shape(c, head, skin); shade(c, head, dk, r * 0.16, r * 0.1, 0.6);
  shape(c, () => { c.moveTo(x - r * 1.02, y - r * 0.05); c.bezierCurveTo(x - r, y - r * 1.55, x + r, y - r * 1.55, x + r * 1.02, y - r * 0.05); c.quadraticCurveTo(x, y - r * 0.62, x - r * 1.02, y - r * 0.05); c.closePath(); }, CLOTH.hair, 5);
  for (const s of [-1, 1]) {
    if (eyes === "open") shape(c, () => ell(c, x + s * r * 0.38, y + r * 0.12, r * 0.09, r * 0.13), INK, 0);
    else { c.beginPath(); c.arc(x + s * r * 0.38, y + r * 0.1, r * 0.12, 0.15 * Math.PI, 0.85 * Math.PI); c.strokeStyle = INK; c.lineWidth = 5; c.lineCap = "round"; c.stroke(); }
    c.save(); c.globalAlpha = 0.5; shape(c, () => ell(c, x + s * r * 0.6, y + r * 0.42, r * 0.14, r * 0.09), COL.pink, 0); c.restore();
  }
  if (adult) shape(c, () => ell(c, x, y - r * 0.3, r * 0.05, r * 0.06), RED, 0);
  if (mouth === "smile") { c.beginPath(); c.arc(x, y + r * 0.42, r * 0.2, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
  else { line(c, [[x - r * 0.2, y + r * 0.5], [x + r * 0.2, y + r * 0.5]], 6); }
};
// neck and shoulders under a head at (x, y) of radius r
const shoulders = (c: Ctx, x: number, y: number, r: number, w: number, adult = false) => {
  const skin = adult ? SKIN.adult : SKIN.child, cloth = adult ? CLOTH.adult : CLOTH.child, cdk = adult ? CLOTH.adultDk : CLOTH.childDk;
  shape(c, () => rrect(c, x - r * 0.3, y + r * 0.8, r * 0.6, r * 0.6, 14), skin);
  const p = () => rrect(c, x - w / 2, y + r * 1.15, w, 600, 90);
  shape(c, p, cloth); shade(c, p, cdk, w * 0.07, 0, 0.7);
  shape(c, () => { c.moveTo(x - r * 0.3, y + r * 1.15); c.quadraticCurveTo(x, y + r * 1.6, x + r * 0.3, y + r * 1.15); c.closePath(); }, skin, 5);
};
// the zip-lock bag full of water, middle (x, y)
const waterBag = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const p = () => rrect(c, x - w / 2, y - h / 2, w, h, 30);
  shape(c, p, "rgba(214,236,250,0.55)", 0);
  c.save(); c.beginPath(); p(); c.clip(); c.fillStyle = COL.water; c.fillRect(x - w / 2, y - h / 2 + 40, w, h); c.fillStyle = COL.waterDk; c.globalAlpha = 0.5; c.fillRect(x + w * 0.2, y - h / 2, w, h); c.restore(); c.globalAlpha = 1;
  shape(c, p, "rgba(255,255,255,0.1)", 6);
  line(c, [[x - w / 2 + 8, y - h / 2 + 34], [x + w / 2 - 8, y - h / 2 + 34]], 6);
  shape(c, () => rrect(c, x - 26, y - h / 2 + 18, 52, 30, 8), COL.teal, 5);
  shine(c, [[x - w / 2 + 28, y - h / 2 + 90], [x - w / 2 + 28, y + h / 2 - 50]], 9);
};
const note = (c: Ctx, x: number, y: number, s: number, col: string) => {
  line(c, [[x + 24 * s, y], [x + 24 * s, y - 90 * s]], 8 * s, INK);
  line(c, [[x + 24 * s, y - 90 * s], [x + 62 * s, y - 62 * s], [x + 50 * s, y - 36 * s]], 8 * s, INK);
  shape(c, () => ell(c, x, y, 28 * s, 20 * s, -0.4), col, 5);
};

// ---------------------------------------------------------------- e1: the floating safe
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c); tray(c);
  emptyJarEgg(c, 300, 850, 340, 560, false, false);
  waterJarEgg(c, 780, 850, 340, 560, false);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 400, 40);
  shape(c, () => polyP(c, [[130, 860], [950, 860], [1020, 940], [60, 940]]), COL.steelIn);
  shape(c, () => polyP(c, [[60, 940], [1020, 940], [1020, 985], [60, 985]]), COL.steel);
  waterJarEgg(c, 600, 840, 380, 580, true, 0.9);
  hand(c, 300, 600, 0, 1.9, SKIN.child, CLOTH.child);
  arrow(c, [[380, 150], [210, 150]]); arrow(c, [[820, 150], [990, 150]]);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c); tray(c);
  emptyJarEgg(c, 300, 850, 340, 560, false, true);
  waterJarEgg(c, 780, 850, 340, 560, false);
};

// ---------------------------------------------------------------- e2: hearing through water
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  shoulders(c, 400, 480, 205, 560);
  // towel on the shoulder
  c.save(); c.translate(235, 740); c.rotate(-0.28);
  shape(c, () => rrect(c, -130, -50, 270, 150, 22), COL.cloth); shade(c, () => rrect(c, -130, -50, 270, 150, 22), "#d9d0bb", 20, 0, 0.7);
  c.save(); c.beginPath(); rrect(c, -130, -50, 270, 150, 22); c.clip(); c.fillStyle = COL.teal; c.fillRect(-140, -6, 290, 24); c.fillRect(-140, 40, 290, 24); c.restore();
  shape(c, () => rrect(c, -130, -50, 270, 150, 22), "rgba(0,0,0,0)", 6);
  c.restore();
  face(c, 400, 480, 205);
  waterBag(c, 705, 500, 230, 310);
  hand(c, 812, 600, Math.PI, 1.6, SKIN.child, CLOTH.child);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  shoulders(c, 790, 330, 140, 380, true);
  face(c, 790, 330, 140, true, "shut", "hum");
  note(c, 480, 380, 1.5, COL.blueDk); note(c, 600, 215, 0.8, COL.orange);
  shoulders(c, 310, 660, 190, 520);
  face(c, 310, 660, 190);
  waterBag(c, 620, 700, 200, 270);
  hand(c, 722, 780, Math.PI, 1.4, SKIN.child, CLOTH.child);
};
// setup.e2.2
const wave = (c: Ctx, x: number, y: number, len: number, amp: number, per: number, col: string) => {
  const pts: number[][] = []; for (let t = 0; t <= len; t += 4) pts.push([x + t, y + Math.sin((t / per) * Math.PI * 2) * amp]); line(c, pts, 10, col);
};
const e2_2 = (c: Ctx) => {
  ground(c);
  shoulders(c, 500, 520, 200, 560);
  face(c, 500, 520, 200, false, "shut");
  waterBag(c, 800, 560, 220, 300);
  hand(c, 912, 660, Math.PI, 1.55, SKIN.child, CLOTH.child);
  hand(c, 170, 540, 0, 1.8, SKIN.child, CLOTH.child, true);
  wave(c, 540, 90, 440, 34, 220, COL.blueDk);
  wave(c, 540, 200, 440, 18, 55, COL.orange);
};

// ---------------------------------------------------------------- e3: keep the baby warm
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  // the grown-up's wrist, with water running onto it from a warm bottle
  shape(c, () => rrect(c, 0, 534, 260, 72, 12), CLOTH.adult, 6);
  hand(c, 330, 570, 0, 1.3, SKIN.adult, CLOTH.adult, true);
  bottle(c, 500, 270, -2.0, 150, 340, 40);
  shape(c, () => rrect(c, 454, 0, 92, 70, 10), CLOTH.adult, 6);
  hand(c, 500, 150, Math.PI / 2, 1.3, SKIN.adult, CLOTH.adult);
  for (const [dx, dy] of [[0, 400], [4, 450], [-2, 495]]) shape(c, () => ell(c, 322 + dx, dy, 11, 15), COL.water, 4);
  standBottle(c, 700, 1010, 170, 400); standBottle(c, 920, 1010, 170, 400);
  steam(c, 700, 560); steam(c, 920, 560);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c); table(c, 900);
  standBottle(c, 150, 960, 170, 400); steam(c, 150, 500, 1);
  standBottle(c, 430, 960, 170, 400); towelWrap(c, 430, 960, 170, 400); steam(c, 430, 500, 1);
  // the third bottle held to a grown-up's chest under a dupatta
  const chest = () => rrect(c, 640, 300, 520, 900, 120);
  shape(c, chest, CLOTH.adult); shade(c, chest, CLOTH.adultDk, 40, 0, 0.7);
  shape(c, () => { c.moveTo(780, 300); c.quadraticCurveTo(880, 400, 980, 300); c.closePath(); }, SKIN.adult, 5);
  bottle(c, 830, 650, 0, 150, 360, -60);
  shape(c, () => { c.moveTo(680, 620); c.quadraticCurveTo(830, 560, 980, 640); c.lineTo(1000, 1000); c.lineTo(660, 1000); c.closePath(); }, COL.pink);
  shade(c, () => { c.moveTo(680, 620); c.quadraticCurveTo(830, 560, 980, 640); c.lineTo(1000, 1000); c.lineTo(660, 1000); c.closePath(); }, "#d97090", 30, 0, 0.6);
  line(c, [[672, 640], [662, 1000]], 12, COL.yellow); line(c, [[672, 640], [662, 1000]], 4, INK);
  hand(c, 985, 850, Math.PI * 1.15, 1.6, SKIN.adult, CLOTH.adult);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  shoulders(c, 400, 560, 230, 640);
  face(c, 400, 560, 230);
  // the bottle pressed on her cheek
  bottle(c, 690, 560, 0.05, 170, 430, -215 + 170);
  hand(c, 795, 640, Math.PI, 1.5, SKIN.child, CLOTH.child);
  // the timer, its pointer at the 10 mark
  const dial = () => ell(c, 880, 190, 130, 130);
  shape(c, dial, COL.teal); shape(c, () => ell(c, 880, 190, 104, 104), COL.paper, 5);
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2 - Math.PI / 2; line(c, [[880 + Math.cos(a) * 82, 190 + Math.sin(a) * 82], [880 + Math.cos(a) * 98, 190 + Math.sin(a) * 98]], 5); }
  line(c, [[880, 190], [880 + Math.cos(-0.5236) * 72, 190 + Math.sin(-0.5236) * 72]], 9, RED);
  shape(c, () => ell(c, 880, 190, 11, 11), INK, 0);
  write(c, "10", 846, 206, 30, INK, 5);
};

export const su_bodyHowBabiesGrow = cards("sci.body.how-babies-grow.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
