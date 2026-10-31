import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, hand, write, cards } from "./flatKit";

// FOOD: BALANCED DIET L3 · experiment set-up cards (flat kit). Light from the upper left, shadows right and down.

const PAPER = "#d4a86e", PAPERDK = "#a98046", PINK = COL.pink, PINKDK = "#d4688c", TAN = "#e6d3a3", YEAST = "#d9b06e";
const adultHand = (c: Ctx, x: number, y: number, an: number, s: number, open = false) => hand(c, x, y, an, s, SKIN.adult, CLOTH.adult, open);
// the same hand coming in from the right (mirrored, so the thumb stays on top)
const handR = (c: Ctx, x: number, y: number, an: number, s: number, adult = false) => {
  c.save(); c.translate(x, y); c.scale(-1, 1); if (adult) adultHand(c, 0, 0, an, s); else hand(c, 0, 0, an, s); c.restore();
};
// an outline only on the outside: strokes then fills, so overlapping parts merge into one blob
const blob = (c: Ctx, path: () => void, fill: string, w = 6) => { c.beginPath(); path(); c.lineJoin = "round"; c.lineWidth = w * 2; c.strokeStyle = INK; c.stroke(); c.fillStyle = fill; c.fill(); };
const drop = (c: Ctx, x: number, y: number, r: number, col: string) => {
  shape(c, () => { c.moveTo(x, y - r * 1.9); c.quadraticCurveTo(x + r * 0.95, y - r * 0.6, x + r, y); c.arc(x, y, r, 0, Math.PI); c.quadraticCurveTo(x - r * 0.95, y - r * 0.6, x, y - r * 1.9); c.closePath(); }, col, Math.max(3, r * 0.2));
  line(c, [[x - r * 0.5, y - r * 0.1], [x - r * 0.45, y + r * 0.4]], Math.max(3, r * 0.2), WHITE);
};
// a steel katori seen from slightly above: rim centre (x, y), rim radius r, liquid inside
const katori = (c: Ctx, x: number, y: number, r: number, liq: string, k = 0.3) => {
  shadow(c, x + r * 0.12, y + r * 0.8, r * 0.95, r * 0.15);
  const body = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.95, y + r * 0.95, x + r * 0.95, y + r * 0.95, x + r, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -r * 0.3, -r * 0.05);
  shape(c, () => ell(c, x, y, r, r * k), COL.steel);
  shape(c, () => ell(c, x, y + 2, r * 0.86, r * k * 0.78), liq, 4);
};
// a clear plastic bottle standing at (x, yb); liquid up to a fraction of the body
const bottleTop = (yb: number, h: number, nh: number) => yb - h - nh;
const bottle = (c: Ctx, x: number, yb: number, h = 330, nh = 90, liquid = 0, col: string = TAN, w = 200) => {
  const top = bottleTop(yb, h, nh), nw = w * 0.2, hw = w / 2, sy = top + nh;
  const body = () => { c.moveTo(x - nw, top); c.lineTo(x - nw, sy); c.bezierCurveTo(x - nw, sy + 28, x - hw, sy + 18, x - hw, sy + 80); c.lineTo(x - hw, yb - 26); c.quadraticCurveTo(x - hw, yb, x - hw + 26, yb); c.lineTo(x + hw - 26, yb); c.quadraticCurveTo(x + hw, yb, x + hw, yb - 26); c.lineTo(x + hw, sy + 80); c.bezierCurveTo(x + hw, sy + 18, x + nw, sy + 28, x + nw, sy); c.lineTo(x + nw, top); c.closePath(); };
  shadow(c, x + w * 0.12, yb + 8, w * 0.62, 18);
  if (liquid > 0) {
    const ly = yb - (h - 80) * liquid;
    c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = col; c.fillRect(x - hw, ly, w, yb - ly + 4); c.fillStyle = "rgba(255,255,255,0.45)"; c.fillRect(x - hw, ly, w, 7); c.restore();
  }
  shape(c, body, COL.glass, 5);
  shade(c, body, COL.glassEdge, -w * 0.1, 0, 0.3);
  shape(c, () => rrect(c, x - nw - 7, top - 8, nw * 2 + 14, 20, 8), "rgba(255,255,255,0.7)", 5);
  shine(c, [[x - hw * 0.72, yb - h * 0.55], [x - hw * 0.72, yb - h * 0.15]], 8);
};
// a sticker on a bottle: sugar cubes, a wheat ear, or a drop of water
const sticker = (c: Ctx, x: number, y: number, kind: "sugar" | "atta" | "water") => {
  shape(c, () => rrect(c, x - 52, y - 52, 104, 104, 12), "#fff6dd", 4);
  if (kind === "sugar") for (const [dx, dy] of [[-22, 20], [22, 20], [0, -20]]) { shape(c, () => rrect(c, x + dx - 20, y + dy - 20, 40, 40, 5), WHITE, 3.5); line(c, [[x + dx + 6, y + dy - 12], [x + dx + 6, y + dy + 12]], 5, "#d8d2c6"); }
  if (kind === "atta") {
    line(c, [[x, y + 42], [x, y - 14]], 5, COL.greenDk);
    for (let i = 0; i < 4; i++) for (const s of [-1, 1]) shape(c, () => ell(c, x + s * 13, y + 18 - i * 20, 8, 15, s * 0.5), COL.wood, 3);
    shape(c, () => ell(c, x, y - 34, 8, 15), COL.wood, 3);
  }
  if (kind === "water") drop(c, x, y + 18, 28, COL.water);
};
// a dropper held upright (bulb on top, tube down to a tip at yTip), with juice in the tube
const dropper = (c: Ctx, x: number, yTop: number, k: number, juice: string | null) => {
  c.save(); c.translate(x, yTop); c.scale(k, k); dropperUp(c, 0, 0, 145, 400, juice); c.restore();
};
const dropperUp = (c: Ctx, x: number, yTop: number, yBulb: number, yTip: number, juice: string | null) => {
  const hwAt = (y: number) => 20 - 15 * ((y - yBulb) / (yTip - yBulb));
  blob(c, () => ell(c, x, (yTop + yBulb) / 2, 40, (yBulb - yTop) / 2), COL.red);
  shine(c, [[x - 18, yTop + 24], [x - 18, yBulb - 30]], 8);
  if (juice) shape(c, () => polyP(c, [[x - hwAt(yBulb + 120) + 4, yBulb + 120], [x + hwAt(yBulb + 120) - 4, yBulb + 120], [x + 3, yTip - 2], [x - 3, yTip - 2]]), juice, 0);
  shape(c, () => polyP(c, [[x - 20, yBulb - 6], [x + 20, yBulb - 6], [x + 5, yTip], [x - 5, yTip]]), "rgba(214,236,250,0.5)", 5);
  shape(c, () => rrect(c, x - 30, yBulb - 14, 60, 22, 7), "#f4f1e4", 5);
};
// a stretched balloon mouth on a bottle neck, body full of air or limp
const ring = (c: Ctx, x: number, y: number) => shape(c, () => ell(c, x, y, 54, 17), PINKDK, 5);

// ---------------------------------------------------------------- foods, seen from above
const peanut = (c: Ctx, x: number, y: number, k: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  blob(c, () => { ell(c, -k * 0.38, 0, k * 0.62, k * 0.46); c.moveTo(k * 0.95, 0); ell(c, k * 0.4, 0, k * 0.55, k * 0.42); }, "#e2b97c", 5);
  for (const [dx, dy] of [[-0.6, -0.1], [-0.3, 0.15], [0.4, -0.15], [0.7, 0.1], [0.1, -0.05]]) shape(c, () => ell(c, dx * k, dy * k, k * 0.06, k * 0.06), "#b98550", 0);
  c.restore();
};
const coconut = (c: Ctx, x: number, y: number, k: number) => {
  shape(c, () => ell(c, x, y, k, k * 0.82), "#7a4a2a"); shape(c, () => ell(c, x, y - 2, k * 0.78, k * 0.62), WHITE, 4); shape(c, () => ell(c, x, y - 2, k * 0.36, k * 0.27), "#dcd6c6", 3);
};
const paneer = (c: Ctx, x: number, y: number, k: number) => {
  shape(c, () => polyP(c, [[x - k * 0.8, y - k * 0.25], [x, y + k * 0.1], [x, y + k * 0.9], [x - k * 0.8, y + k * 0.55]]), "#efe3c0");
  shape(c, () => polyP(c, [[x + k * 0.8, y - k * 0.25], [x, y + k * 0.1], [x, y + k * 0.9], [x + k * 0.8, y + k * 0.55]]), "#d9c9a0");
  shape(c, () => polyP(c, [[x, y - k * 0.6], [x + k * 0.8, y - k * 0.25], [x, y + k * 0.1], [x - k * 0.8, y - k * 0.25]]), "#fffaf0");
};
const chip = (c: Ctx, x: number, y: number, k: number) => {
  const b = () => { for (let i = 0; i <= 56; i++) { const a = (i / 56) * Math.PI * 2, r = k * (1 + 0.07 * Math.sin(a * 7)); (i ? c.lineTo : c.moveTo).call(c, x + Math.cos(a) * r, y + Math.sin(a) * r * 0.85); } c.closePath(); };
  shape(c, b, COL.yellow); shade(c, b, COL.orange, -k * 0.25, -k * 0.2, 0.5);
  const r = rnd(5); for (let i = 0; i < 6; i++) shape(c, () => ell(c, x + (r() - 0.5) * k * 1.1, y + (r() - 0.5) * k * 0.8, k * 0.08, k * 0.06), COL.orange, 0);
};
const chapati = (c: Ctx, x: number, y: number, k: number) => {
  const b = () => ell(c, x, y, k * 1.05, k * 0.9);
  shape(c, b, "#ecc690"); shade(c, b, "#c99660", -k * 0.2, -k * 0.2, 0.5);
  const r = rnd(9); for (let i = 0; i < 7; i++) shape(c, () => ell(c, x + (r() - 0.5) * k * 1.3, y + (r() - 0.5) * k * 1.1, k * 0.14, k * 0.1, r() * 3), "#b9803c", 0);
};
const appleSlice = (c: Ctx, x: number, y: number, k: number) => {
  const half = (r: number) => () => { c.moveTo(x + r, y); c.arc(x, y, r, 0, Math.PI); c.closePath(); };
  shape(c, half(k), COL.red); shape(c, half(k * 0.8), "#fff8e0", 4); shape(c, () => ell(c, x, y + k * 0.3, k * 0.08, k * 0.13), "#6a4128", 0);
};
// a fruit for each juice
const fruit = (c: Ctx, kind: string, x: number, y: number, k: number) => {
  shadow(c, x + k * 0.1, y + k * 0.85, k * 0.9, k * 0.16);
  if (kind === "amla") { const b = () => ell(c, x, y, k * 0.85, k * 0.85); shape(c, b, "#b9d46a"); shade(c, b, "#7a9a3a", -k * 0.3, -k * 0.2, 0.5); for (const d of [-0.4, 0, 0.4]) line(c, [[x + d * k * 0.9, y - k * 0.6], [x + d * k * 1.1, y], [x + d * k * 0.9, y + k * 0.6]], 3.5, "#6b8a30"); }
  if (kind === "guava") { const b = () => ell(c, x, y, k, k * 0.9); shape(c, b, "#a8d35a"); shade(c, b, "#6aa53f", -k * 0.3, -k * 0.2, 0.5); shape(c, () => polyP(c, [[x - 14, y - k * 0.82], [x, y - k * 1.0], [x + 14, y - k * 0.82], [x, y - k * 0.72]]), COL.greenDk, 4); }
  if (kind === "lemon") { const b = () => ell(c, x, y, k * 1.05, k * 0.75, -0.25); shape(c, b, COL.yellow); shade(c, b, COL.orange, -k * 0.2, -k * 0.2, 0.45); shape(c, () => ell(c, x - k * 1.0, y + k * 0.22, k * 0.12, k * 0.1), COL.yellow, 4); shape(c, () => ell(c, x + k * 1.0, y - k * 0.22, k * 0.12, k * 0.1), COL.yellow, 4); }
  if (kind === "mosambi") { const b = () => ell(c, x, y, k * 1.0, k * 0.95); shape(c, b, "#d3df68"); shade(c, b, "#9db23c", -k * 0.3, -k * 0.2, 0.5); leaf(c, x, y - k * 0.9, k * 0.5, -0.9); shape(c, () => ell(c, x, y - k * 0.85, k * 0.14, k * 0.07), "#9db23c", 3); }
  if (kind === "pack") {
    shape(c, () => polyP(c, [[x + k * 0.5, y - k * 0.8], [x + k * 0.85, y - k * 0.6], [x + k * 0.85, y + k * 0.85], [x + k * 0.5, y + k * 0.95]]), "#c9712a");
    shape(c, () => polyP(c, [[x - k * 0.5, y - k * 0.8], [x + k * 0.5, y - k * 0.8], [x + k * 0.85, y - k * 0.6], [x - k * 0.15, y - k * 0.6]]), "#f9c78a");
    shape(c, () => rrect(c, x - k * 0.5, y - k * 0.8, k, k * 1.75, 6), COL.orange);
    shape(c, () => ell(c, x, y + k * 0.1, k * 0.3, k * 0.3), COL.yellow, 4);
    line(c, [[x + k * 0.2, y - k * 0.7], [x + k * 0.35, y - k * 1.2], [x + k * 0.8, y - k * 1.25]], 9, INK); line(c, [[x + k * 0.2, y - k * 0.7], [x + k * 0.35, y - k * 1.2], [x + k * 0.8, y - k * 1.25]], 4, WHITE);
  }
  if (kind === "water") glass(c, x, y + k * 0.8, k * 1.3, k * 1.7, 0.8, COL.water);
};
const leaf = (c: Ctx, x: number, y: number, len: number, an: number) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len;
  shape(c, () => { c.moveTo(x, y); c.quadraticCurveTo((x + tx) / 2 + len * 0.2, (y + ty) / 2 + len * 0.25, tx, ty); c.quadraticCurveTo((x + tx) / 2 - len * 0.25, (y + ty) / 2 - len * 0.2, x, y); c.closePath(); }, COL.leaf, 4);
};
const paperSquare = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(10, 12); c.beginPath(); c.rect(x, y, s, s); c.fillStyle = "rgba(43,35,64,0.16)"; c.fill(); c.restore();
  shape(c, () => rrect(c, x, y, s, s, 8), PAPER); shade(c, () => rrect(c, x, y, s, s, 8), PAPERDK, -s * 0.07, -s * 0.07, 0.6);
};

// ---------------------------------------------------------------- the cards

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  for (let i = 0; i < 8; i++) {
    const x = 135 + (i % 4) * 270, y = i < 4 ? 110 : 560, fy = y + 310, k = 86;
    paperSquare(c, x - 100, y, 200);
    write(c, String(i + 1), x - 16, y + 62, 76, "#6a4a2a", 9);
    [() => peanut(c, x, fy, k, -0.3), () => coconut(c, x, fy, k), () => paneer(c, x, fy - 10, k), () => chip(c, x, fy, k), () => chapati(c, x, fy, k), () => appleSlice(c, x, fy - 20, k), () => drop(c, x, fy + 20, 38, COL.yellow), () => drop(c, x, fy + 20, 38, COL.water)][i]();
  }
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  const pp = () => polyP(c, [[170, 500], [700, 470], [730, 930], [200, 960]]);
  c.save(); c.translate(12, 14); c.beginPath(); pp(); c.fillStyle = "rgba(43,35,64,0.16)"; c.fill(); c.restore();
  shape(c, pp, PAPER); shade(c, pp, PAPERDK, -26, -26, 0.6);
  line(c, [[300, 745], [520, 735]], 74, "rgba(110,70,35,0.45)");
  arrow(c, [[520, 880], [310, 884]]); arrow(c, [[310, 925], [520, 921]]);
  peanut(c, 540, 700, 80, 0.25);
  handR(c, 751, 585, 0.5, 2.4);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c, "#fff3c4");
  // a sunny window: sky panes, sun and rays, wooden frame and bars
  const sun = [200, 190];
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; line(c, [[sun[0] + Math.cos(a) * 120, sun[1] + Math.sin(a) * 120], [sun[0] + Math.cos(a) * 190, sun[1] + Math.sin(a) * 190]], 12, COL.yellow); }
  shape(c, () => ell(c, sun[0], sun[1], 90, 90), COL.yellow);
  shape(c, () => rrect(c, 20, 20, 1040, 1040, 10), "rgba(0,0,0,0)", 22);
  c.fillStyle = COL.woodDk; c.fillRect(530, 20, 22, 1040); c.fillRect(20, 530, 1040, 22);
  line(c, [[20, 20], [1060, 20], [1060, 1060], [20, 1060], [20, 20]], 22, COL.woodDk); line(c, [[20, 20], [1060, 20], [1060, 1060], [20, 1060], [20, 20]], 5, INK);
  // the brown paper square held up in front of the light
  const px = 300, py = 150, s = 480;
  c.save(); c.translate(14, 16); c.beginPath(); c.rect(px, py, s, s); c.fillStyle = "rgba(43,35,64,0.18)"; c.fill(); c.restore();
  shape(c, () => rrect(c, px, py, s, s, 10), PAPER); shade(c, () => rrect(c, px, py, s, s, 10), PAPERDK, -30, -30, 0.55);
  // the oily spot lets the light through: a bright glowing round patch
  shape(c, () => ell(c, 500, 350, 150, 145), "rgba(255,246,190,0.5)", 0);
  shape(c, () => ell(c, 500, 350, 112, 106), "#fffbe0", 5);
  shape(c, () => ell(c, 640, 520, 46, 44), "#fff1b0", 4);
  hand(c, 540, 770, -Math.PI / 2, 2.3);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  // a glass jug with a handle, dark blue inside
  const jb = () => { c.moveTo(310, 650); c.lineTo(740, 650); c.lineTo(710, 950); c.quadraticCurveTo(708, 975, 680, 975); c.lineTo(340, 975); c.quadraticCurveTo(312, 975, 310, 950); c.closePath(); };
  shadow(c, 540, 985, 330, 28);
  line(c, [[735, 680], [850, 700], [850, 840], [715, 890]], 44, INK); line(c, [[735, 680], [850, 700], [850, 840], [715, 890]], 30, "#dbeaf5");
  c.save(); c.beginPath(); jb(); c.clip(); c.fillStyle = "#2c3d97"; c.fillRect(250, 700, 540, 300); c.fillStyle = "#5a6fd0"; c.globalAlpha = 0.5; ell(c, 480, 850, 120, 36); c.fill(); ell(c, 600, 780, 90, 26); c.fill(); c.globalAlpha = 1; c.restore();
  shape(c, jb, "rgba(214,236,250,0.35)", 6);
  shade(c, jb, "#1b2766", -40, 0, 0.35);
  shape(c, () => ell(c, 525, 650, 215, 36), "#1f2c78", 5);
  shine(c, [[330, 720], [345, 900]], 9);
  // the dropper over the jug, a brown drop falling in, the adult's hand holding it
  dropper(c, 560, 40, 1.15, "#8a4b1f");
  drop(c, 560, 575, 20, "#8a4b1f");
  adultHand(c, 406, 247, 0.0, 2.1);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(12, 14); c.beginPath(); rrect(c, 60, 90, 960, 900, 24); c.fillStyle = "rgba(43,35,64,0.16)"; c.fill(); c.restore();
  shape(c, () => rrect(c, 60, 90, 960, 900, 24), WHITE);
  const kinds = ["amla", "guava", "lemon", "mosambi", "pack", "water"];
  kinds.forEach((kd, i) => {
    const x = 210 + (i % 3) * 330, y = i < 3 ? 270 : 660;
    katori(c, x, y, 112, "#4a7fd0");
    fruit(c, kd, x, y + 200, 72);
  });
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  katori(c, 540, 750, 320, "#4a7fd0", 0.3);
  c.save(); c.beginPath(); ell(c, 540, 752, 275, 75); c.clip();
  shape(c, () => ell(c, 470, 740, 130, 36), "#f0e7a0", 0); shape(c, () => ell(c, 470, 740, 70, 18), "#fbf6cc", 0); c.restore();
  dropper(c, 470, 40, 1.2, "#7bbf3f");
  drop(c, 470, 610, 20, "#7bbf3f");
  hand(c, 306, 258, 0.0, 2.2);
};

// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  const yb = 1010, W = 230, H = 380, NH = 100;
  [["sugar", 190], ["atta", 540], ["water", 890]].forEach(([k, x]) => { bottle(c, x as number, yb, H, NH, 0, TAN, W); sticker(c, x as number, 860, k as "sugar"); });
  // a paper cone in the middle bottle's neck
  shape(c, () => polyP(c, [[445, 400], [635, 400], [580, 540], [500, 540]]), "#fffaf0", 5);
  shape(c, () => ell(c, 540, 400, 95, 20), "#efe6d2", 5);
  // the teaspoon tipping yeast into the cone
  const sp = [[327, 210], [495, 275]];
  line(c, sp, 20, INK); line(c, sp, 9, COL.steel);
  shape(c, () => ell(c, 525, 292, 54, 36, 0.45), COL.steel, 5); shape(c, () => ell(c, 529, 290, 38, 22, 0.45), YEAST, 0);
  const r = rnd(4); for (let i = 0; i < 14; i++) shape(c, () => ell(c, 555 + (r() - 0.3) * 36, 330 + i * 5.2, 5, 5), YEAST, 0);
  shape(c, () => ell(c, 540, 396, 56, 8), YEAST, 0);
  arrow(c, [[720, 300], [720, 400]]);
  hand(c, 197, 159, 0.37, 2.0);
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  const yb = 1010, H = 380, NH = 100, W = 230, top = bottleTop(yb, H, NH);
  bottle(c, 445, yb, H, NH, 0.2, COL.water, W); bottle(c, 810, yb, H, NH, 0, TAN, W);
  c.save(); c.translate(25, 0);
  // warm water falling from a steel tumbler tilted by the adult
  const sx = (t: number) => 372 + 48 * t * t, sy = (t: number) => 418 + t * (top + 20 - 418);
  const pts: number[][] = []; for (let i = 0; i <= 8; i++) pts.push([sx(i / 8), sy(i / 8)]);
  line(c, pts, 30, INK); line(c, pts, 20, COL.water);
  c.save(); c.translate(390, 330); c.rotate(1.8);
  const tb = () => polyP(c, [[-85, 0], [85, 0], [70, 235], [-70, 235]]);
  shape(c, tb, COL.steel, 6); shade(c, tb, COL.steelDk, -20, 0, 0.6);
  shape(c, () => ell(c, 0, 0, 85, 28), COL.steelIn, 6); shape(c, () => ell(c, 0, 2, 68, 18), COL.water, 0);
  c.restore();
  for (const x of [480, 530, 580]) line(c, [[x, 480], [x + 16, 440], [x - 12, 400], [x + 8, 360]], 10, "rgba(120,114,105,0.6)");
  adultHand(c, 146, 274, 0.23, 1.8);
  c.restore();
  // the child's hand stretching a balloon mouth over the other bottle
  c.save(); c.translate(10, top - 580);
  const bl = () => { c.moveTo(765, 560); c.quadraticCurveTo(690, 545, 650, 600); c.quadraticCurveTo(590, 690, 640, 770); c.quadraticCurveTo(700, 810, 730, 730); c.quadraticCurveTo(760, 650, 805, 570); c.closePath(); };
  shape(c, bl, PINK, 5); shade(c, bl, PINKDK, -30, -10, 0.5);
  ring(c, 800, 562);
  line(c, [[845, 566], [905, 540]], 22, INK); line(c, [[845, 566], [905, 540]], 12, PINK);
  handR(c, 925, 500, 0.5, 1.6);
  c.restore();
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  const yb = 1010, h = 290, nh = 80, W = 230, top = bottleTop(yb, h, nh), xs = [230, 560, 890];
  xs.forEach((x, i) => { bottle(c, x, yb, h, nh, 0.9, TAN, W); sticker(c, x, 940, (["sugar", "atta", "water"] as const)[i]); });
  // foam bubbles: lots on the sugar bottle, some on the atta one, none on the water one
  const foam = (x: number, n: number, seedN: number) => { const r = rnd(seedN), ly = yb - (h - 80) * 0.9; for (let i = 0; i < n; i++) shape(c, () => ell(c, x + (r() - 0.5) * 150, ly + 6 - r() * 46, 11 + r() * 8, 11 + r() * 8), "rgba(255,255,255,0.9)", 3); };
  foam(230, 16, 3); foam(560, 5, 8);
  // balloons: round and full, half full, limp
  const neck = top - 6;
  const big = () => { c.moveTo(210, neck); c.bezierCurveTo(50, neck - 40, 60, 300, 230, 300); c.bezierCurveTo(400, 300, 410, neck - 40, 250, neck); c.closePath(); };
  shape(c, big, PINK, 6); shade(c, big, PINKDK, -50, -20, 0.5); shine(c, [[120, 440], [145, 370]], 12);
  const half = () => { c.moveTo(540, neck); c.bezierCurveTo(470, neck - 10, 470, 500, 560, 500); c.bezierCurveTo(650, 500, 650, neck - 10, 580, neck); c.closePath(); };
  shape(c, half, PINK, 6); shade(c, half, PINKDK, -35, -15, 0.5);
  const limp = () => { c.moveTo(870, neck); c.quadraticCurveTo(790, neck - 6, 800, neck + 50); c.quadraticCurveTo(830, neck + 100, 950, neck + 50); c.quadraticCurveTo(990, neck - 6, 910, neck); c.closePath(); };
  shape(c, limp, PINK, 6);
  xs.forEach((x) => ring(c, x, neck + 2));
  // a string round the big balloon, held by the child's hand
  c.beginPath(); ell(c, 230, 440, 172, 28); c.strokeStyle = INK; c.lineWidth = 12; c.stroke(); c.strokeStyle = WHITE; c.lineWidth = 6; c.stroke();
  line(c, [[400, 436], [520, 380]], 12, INK); line(c, [[400, 436], [520, 380]], 6, WHITE);
  handR(c, 642, 328, 0.4, 1.9);
};

export const su_foodBalancedDiet = cards("sci.food.balanced-diet.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
