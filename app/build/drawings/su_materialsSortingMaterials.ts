import type { Ctx } from "./core";
import { INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, bowl, cards } from "./flatKit";

// SORTING MATERIALS · L3 set-up cards (sci.materials.sorting-materials.L3)

// a flat shape with a shade strip on its lower right, outlined last
const solid = (c: Ctx, path: () => void, fill: string, dk: string, sx = 12, sy = 12, lw = 6) => {
  shape(c, path, fill, 0); shade(c, path, dk, -sx, -sy, 0.6);
  c.beginPath(); path(); c.lineWidth = lw; c.strokeStyle = INK; c.lineJoin = "round"; c.stroke();
};
const at = (c: Ctx, x: number, y: number, rot: number, s: number, fn: () => void) => { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); fn(); c.restore(); };
const rect = (c: Ctx, x: number, y: number, w: number, h: number) => () => { c.moveTo(x, y); c.lineTo(x + w, y); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.closePath(); };
// a hand reaching in from the right, fingers to the left, thumb up
const handL = (c: Ctx, x: number, y: number, s: number, skin: string = SKIN.child, sleeve: string = CLOTH.child, open = false) => {
  c.save(); c.translate(0, 2 * y); c.scale(1, -1); hand(c, x, y, Math.PI, s, skin, sleeve, open); c.restore();
};
const qmark = (c: Ctx, x: number, y: number, h: number, col: string = INK, w = 7) => {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round";
  c.beginPath(); c.arc(x, y - h * 0.2, h * 0.27, Math.PI * 1.05, Math.PI * 2.4); c.lineTo(x, y + h * 0.18); c.stroke();
  c.beginPath(); c.arc(x, y + h * 0.4, w * 0.55, 0, 7); c.fillStyle = col; c.fill();
};
const tick = (c: Ctx, x: number, y: number, s: number) => line(c, [[x - 10 * s, y], [x - 3 * s, y + 9 * s], [x + 12 * s, y - 11 * s]], 7, COL.greenDk);
const cross = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - 10 * s, y - 10 * s], [x + 10 * s, y + 10 * s]], 7, RED); line(c, [[x + 10 * s, y - 10 * s], [x - 10 * s, y + 10 * s]], 7, RED); };
const star = (c: Ctx, x: number, y: number, r: number) => shape(c, () => { for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4 - Math.PI / 2, rr = i % 2 ? r * 0.32 : r; c[i ? "lineTo" : "moveTo"](x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); }, COL.yellow, 5);

// ---------------------------------------------------------------- things (origin = centre, lying) 
const steelSpoon = (c: Ctx) => { solid(c, rect(c, -125, -8, 150, 16), COL.steel, COL.steelDk, 0, 5, 5); solid(c, () => ell(c, 62, 0, 48, 30), COL.steel, COL.steelDk, 8, 8, 5); shape(c, () => ell(c, 58, -2, 34, 19), COL.steelIn, 4); shine(c, [[-110, -3], [-20, -3]], 4); };
const woodSpoon = (c: Ctx) => { solid(c, rect(c, -125, -9, 150, 18), COL.wood, COL.woodDk, 0, 6, 5); solid(c, () => ell(c, 66, 0, 52, 34), COL.wood, COL.woodDk, 9, 9, 5); line(c, [[-105, 0], [-10, 0]], 2.5, COL.woodDk); line(c, [[50, -4], [84, 2]], 2.5, COL.woodDk); };
const plasticSpoon = (c: Ctx) => { solid(c, rect(c, -125, -8, 150, 16), COL.red, "#b53a26", 0, 5, 5); solid(c, () => ell(c, 62, 0, 48, 30), COL.red, "#b53a26", 8, 8, 5); shine(c, [[-110, -3], [-20, -3]], 4); };
const comb = (c: Ctx, col: string = COL.teal, dk: string = COL.tealDk) => { for (let i = 0; i < 9; i++) solid(c, () => rrect(c, -66 + i * 15, 0, 9, 38, 3), col, dk, 3, 0, 4); solid(c, () => rrect(c, -72, -26, 144, 30, 8), col, dk, 0, 7); };
const candleLying = (c: Ctx) => { solid(c, () => rrect(c, -90, -22, 180, 44, 12), "#fff1c9", "#e6d098", 0, 9); line(c, [[90, 0], [112, -9]], 5); shine(c, [[-70, -10], [60, -10]], 6); };
const candleStand = (c: Ctx) => { solid(c, () => rrect(c, -26, -100, 52, 100, 8), "#fff1c9", "#e6d098", 9, 0); line(c, [[0, -100], [0, -118]], 5); shine(c, [[-14, -86], [-14, -20]], 6); };
const foilBall = (c: Ctx) => { solid(c, () => ell(c, 0, 0, 58, 56), COL.steel, COL.steelDk, 16, 14); line(c, [[-40, -20], [-18, -34], [-6, -14], [16, -38]], 4, WHITE); line(c, [[-30, 20], [-8, 6], [14, 24], [36, 4]], 4, COL.steelDk); line(c, [[10, -4], [30, -20], [40, -4]], 4, WHITE); };
const bangle = (c: Ctx) => { shape(c, () => ell(c, 0, 0, 72, 72), "rgba(242,154,180,0.8)", 6); shape(c, () => ell(c, 0, 0, 50, 50), BG, 5); shine(c, [[-52, -30], [-30, -52]], 8); };
const band = (c: Ctx) => { shape(c, () => ell(c, 0, 0, 84, 56), COL.orange, 6); shape(c, () => ell(c, 0, 0, 62, 36), BG, 5); };
const sock = (c: Ctx) => { solid(c, () => polyP(c, [[-36, -95], [36, -95], [36, 0], [84, 4], [100, 34], [82, 58], [-36, 58]]), COL.blue, COL.blueDk, 0, 12); shape(c, rect(c, -36, -95, 72, 22), WHITE, 5); line(c, [[-36, -64], [36, -64]], 5, COL.red); };
const hanky = (c: Ctx) => { solid(c, () => rrect(c, -72, -62, 144, 124, 6), "#fff4d6", "#e8d8a8", 0, 10); c.beginPath(); rrect(c, -56, -46, 112, 92, 3); c.strokeStyle = COL.pink; c.lineWidth = 6; c.stroke(); line(c, [[-56, 0], [56, 0]], 3, COL.pink); line(c, [[0, -46], [0, 46]], 3, COL.pink); };
const diya = (c: Ctx) => { solid(c, () => { c.moveTo(-62, -12); c.bezierCurveTo(-56, 56, 56, 56, 62, -12); c.closePath(); }, "#c9663a", "#9c4524", 14, 10); solid(c, () => polyP(c, [[56, -14], [92, -26], [70, 6]]), "#c9663a", "#9c4524", 4, 4, 5); shape(c, () => ell(c, 0, -12, 62, 14), "#7a3a20", 5); };
const pebble = (c: Ctx) => { solid(c, () => ell(c, 0, 0, 62, 44, -0.25), COL.grey, COL.greyDk, 16, 12); shine(c, [[-34, -18], [-12, -30]], 6); };
const paperCup = (c: Ctx) => { solid(c, () => polyP(c, [[-52, -66], [52, -66], [36, 60], [-36, 60]]), WHITE, "#d9d4c8", 12, 0); shape(c, rect(c, -45, -22, 90, 26), COL.red, 0); c.beginPath(); c.moveTo(-52, -66); c.lineTo(-36, 60); c.lineTo(36, 60); c.lineTo(52, -66); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); shape(c, () => ell(c, 0, -66, 52, 12), "#efe7d6", 5); };

// standing things (origin = bottom centre, about 110 tall)
const soapBar = (c: Ctx) => { solid(c, () => rrect(c, -50, -70, 100, 70, 18), COL.pink, "#d9738f", 0, 12); shape(c, () => rrect(c, -40, -62, 80, 20, 9), "#f8bfd0", 3); };
const chalk = (c: Ctx) => { solid(c, () => rrect(c, -22, -96, 44, 96, 8), WHITE, "#d9d4c8", 9, 0); line(c, [[-22, -10], [22, -10]], 3, "#d9d4c8"); };
const foilTray = (c: Ctx) => { solid(c, () => polyP(c, [[-58, -48], [58, -48], [46, 0], [-46, 0]]), "#d3d7dc", COL.steelDk, 0, 12); shape(c, () => ell(c, 0, -48, 58, 12), COL.steelIn, 5); for (let i = -2; i <= 2; i++) line(c, [[i * 17, -36], [i * 14, -6]], 3, COL.steelDk); };
const mug = (c: Ctx) => { c.beginPath(); c.arc(42, -44, 24, -1.3, 1.3); c.strokeStyle = INK; c.lineWidth = 20; c.lineCap = "round"; c.stroke(); c.strokeStyle = "#f4f1ea"; c.lineWidth = 8; c.stroke(); solid(c, () => rrect(c, -42, -84, 84, 84, 14), "#f4f1ea", "#cfc9bb", 12, 0); shape(c, rect(c, -42, -56, 84, 20), COL.teal, 0); c.beginPath(); rrect(c, -42, -84, 84, 84, 14); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); shape(c, () => ell(c, 0, -84, 42, 10), "#8a5a3c", 5); };
const jar = (c: Ctx) => { shape(c, () => rrect(c, -44, -98, 88, 98, 16), "rgba(214,236,250,0.7)", 6); shape(c, () => rrect(c, -48, -126, 96, 30, 6), COL.red, 6); shine(c, [[-30, -82], [-30, -16]], 7); };
const tumbler = (c: Ctx) => { solid(c, () => polyP(c, [[-42, -122], [42, -122], [34, 0], [-34, 0]]), COL.steel, COL.steelDk, 12, 0); shape(c, () => ell(c, 0, -122, 42, 9), COL.steelIn, 5); shine(c, [[-26, -108], [-20, -16]], 7); };
const woodStand = (c: Ctx) => { at(c, 0, -42, -Math.PI / 2, 0.62, () => woodSpoon(c)); };
const combStand = (c: Ctx) => { at(c, 0, -30, 0, 0.75, () => comb(c)); };
const SLOTS: ((c: Ctx) => void)[] = [soapBar, chalk, candleStand, foilTray, woodStand, combStand, mug, jar];
const thing = (c: Ctx, fn: (c: Ctx) => void, x: number, y: number, s: number, w = 60) => { shadow(c, x + 10 * s, y + 4, w * s, 10 * s); at(c, x, y, 0, s, () => fn(c)); };
const lay = (c: Ctx, fn: (c: Ctx) => void, x: number, y: number, rot: number, s: number, rx = 90, ry = 18) => { shadow(c, x + 8, y + ry * s + 6, rx * s, ry * s * 0.6); at(c, x, y, rot, s, () => fn(c)); };

// ---------------------------------------------------------------- e1
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  c.translate(0, 40);
  lay(c, steelSpoon, 190, 250, -0.35, 1.15, 110, 30); lay(c, woodSpoon, 450, 250, 0.3, 1.1, 110, 30); lay(c, comb, 700, 250, -0.1, 1.2, 80, 40); lay(c, bangle, 920, 250, 0, 1.0, 70, 70);
  lay(c, band, 190, 530, 0.2, 1.1, 80, 55); lay(c, sock, 450, 530, 0.2, 1.1, 70, 50); lay(c, hanky, 700, 530, -0.2, 1.1, 70, 60); lay(c, candleLying, 920, 530, 0.5, 0.95, 80, 22);
  lay(c, diya, 190, 810, 0, 1.2, 70, 30); lay(c, pebble, 450, 810, 0, 1.2, 60, 44); lay(c, foilBall, 700, 810, 0, 1.25, 55, 56); lay(c, paperCup, 920, 810, 0.25, 1.1, 50, 60);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  // the candle with a dent, a thumbnail-tipped finger pressing into it, a pebble with no mark
  lay(c, candleLying, 350, 760, 0, 2.6, 95, 22);
  shape(c, () => { c.moveTo(280, 703); c.quadraticCurveTo(350, 830, 420, 703); c.closePath(); }, "#bfa86c", 6);
  lay(c, pebble, 830, 760, 0, 2.2, 60, 44);
  cross(c, 830, 600, 4);
  shape(c, () => rrect(c, 250, 20, 200, 190, 24), CLOTH.child, 6);
  shape(c, () => rrect(c, 240, 200, 220, 170, 50), SKIN.child, 6);
  for (let k = 0; k < 3; k++) line(c, [[270 + k * 64, 330], [270 + k * 64, 365]], 5, SKIN.childDk);
  shape(c, () => rrect(c, 318, 340, 64, 380, 32), SKIN.child, 6);
  shade(c, () => rrect(c, 318, 340, 64, 380, 32), SKIN.childDk, 16, 0, 0.5);
  shape(c, () => rrect(c, 340, 660, 28, 60, 12), "#f6d9d0", 5);
  arrow(c, [[520, 400], [520, 610]]);
};

// setup.e1.2
const sheet = (c: Ctx, x: number, y: number, w: number, h: number, rot: number) => { c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(rot); shadow(c, 14, h / 2 + 4, w / 2, 20); shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 8), COL.paper, 6); c.restore(); };
const e1_2 = (c: Ctx) => {
  ground(c);
  sheet(c, 70, 520, 440, 440, -0.03); sheet(c, 570, 520, 440, 440, 0.03);
  // shiny sun
  star(c, 270, 810, 105);
  // dull: the same star, crossed out
  star(c, 790, 690, 80); cross(c, 790, 690, 4.5);
  lay(c, woodSpoon, 790, 840, 0, 1.2, 100, 20);
  at(c, 340, 520, 0.85, 1.6, () => steelSpoon(c));
  hand(c, 260, 430, 0.85, 1.7, SKIN.child, CLOTH.child, false);
  arrow(c, [[560, 400], [520, 540]]);
};

// ---------------------------------------------------------------- e2
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  c.translate(0, -110);
  shadow(c, 560, 880, 520, 28);
  shape(c, () => rrect(c, 20, 590, 1040, 280, 30), COL.steel, 6);
  shape(c, () => rrect(c, 44, 612, 992, 236, 22), COL.steelIn, 4);
  SLOTS.forEach((fn, i) => thing(c, fn, 100 + i * 125, 810, 1.0, 55));
  hand(c, 475 + 125, 500, Math.PI / 2, 1.7, SKIN.child, CLOTH.child, true);
  arrow(c, [[120, 950], [960, 950]]);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  c.translate(540, 540); c.scale(1.1, 1.1); c.translate(-515, -585);
  shadow(c, 400, 800, 340, 26);
  solid(c, () => polyP(c, [[60, 520], [600, 520], [670, 680], [130, 680]]), COL.pink, "#d9738f", 0, 0, 6);
  shape(c, () => polyP(c, [[60, 520], [600, 520], [670, 680], [130, 680]]), "#f8bfd0", 6);
  solid(c, () => polyP(c, [[130, 680], [670, 680], [670, 780], [130, 780]]), COL.pink, "#d9738f", 0, 18, 6);
  line(c, [[150, 603], [390, 600]], 9, "#b25a76");
  line(c, [[150, 599], [390, 596]], 3, WHITE);
  hand(c, 335, 454, 1.2, 1.6, SKIN.child, CLOTH.child, true);
  arrow(c, [[90, 450], [240, 450]]);
  // the phone
  shadow(c, 860, 830, 150, 24);
  solid(c, () => rrect(c, 710, 300, 290, 520, 40), COL.black, "#262230", 0, 0, 6);
  shape(c, () => rrect(c, 730, 330, 250, 460, 24), "#f8bfd0", 4);
  line(c, [[740, 590], [970, 560]], 34, "#b25a76"); line(c, [[740, 580], [970, 550]], 8, WHITE);
  for (const [x, y, dx, dy] of [[760, 360, 1, 1], [950, 360, -1, 1], [760, 760, 1, -1], [950, 760, -1, -1]]) line(c, [[x, y + dy * 40], [x, y], [x + dx * 40, y]], 7, WHITE);
  shape(c, () => ell(c, 855, 313, 8, 8), "#6b6577", 0);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  c.translate(540, 540); c.scale(1.2, 1.2); c.translate(-522, -500);
  lay(c, woodSpoon, 450, 740, 0, 1.8, 120, 20);
  line(c, [[245, 742], [445, 742]], 6, COL.woodDk); line(c, [[245, 742], [445, 742]], 2.5, INK);
  const an = 0.9, dx = Math.cos(an), dy = Math.sin(an);
  at(c, 450 - 255 * dx + 119 * dx, 735 - 255 * dy + 119 * dy, an, 1.25, () => {
    solid(c, () => polyP(c, [[-100, -8], [84, -8], [112, 0], [84, 8], [-100, 8]]), COL.steel, COL.steelDk, 0, 4, 5);
    solid(c, () => ell(c, -104, 0, 10, 24), COL.steel, COL.steelDk, 3, 3, 5);
  });
  hand(c, 450 - 255 * dx, 735 - 255 * dy, an, 1.7, SKIN.adult, CLOTH.adult, false);
  arrow(c, [[250, 880], [520, 880]]);
  // the child watching
  solid(c, () => rrect(c, 680, 320, 160, 120, 34), CLOTH.child, CLOTH.childDk, 14, 0);
  shape(c, () => rrect(c, 736, 290, 48, 50, 10), SKIN.child, 5);
  shape(c, () => ell(c, 760, 220, 74, 80), SKIN.child, 6);
  shape(c, () => { c.moveTo(686, 214); c.bezierCurveTo(684, 120, 836, 120, 834, 214); c.quadraticCurveTo(760, 168, 686, 214); c.closePath(); }, CLOTH.hair, 5);
  for (const ex of [730, 790]) { shape(c, () => ell(c, ex, 230, 17, 20), WHITE, 4); shape(c, () => ell(c, ex - 8, 240, 8, 9), INK, 0); }
  line(c, [[738, 276], [782, 276]], 5);
};

// ---------------------------------------------------------------- e3
const NODE = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), WHITE, 6); qmark(c, x, y, r * 1.2, COL.blueDk, r * 0.16); };
const elbow = (c: Ctx, px: number, py: number, cx: number, cy: number) => { const mx = (px + cx) / 2; line(c, [[px, py], [mx, py], [mx, cy], [cx, cy]], 6, COL.greyDk); return [mx, (py + cy) / 2]; };
const bigSheet = (c: Ctx) => { shadow(c, 560, 1030, 470, 24); shape(c, () => rrect(c, 40, 40, 1000, 990, 14), COL.paper, 6); };

// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c); bigSheet(c);
  const ys = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => 120 + i * 112);
  const l2 = [0, 1, 2, 3].map((i) => (ys[2 * i] + ys[2 * i + 1]) / 2), l1 = [0, 1].map((i) => (l2[2 * i] + l2[2 * i + 1]) / 2), root = (l1[0] + l1[1]) / 2;
  const marks: [number, number, boolean][] = [];
  l1.forEach((y, i) => { const m = elbow(c, 150, root, 340, y); marks.push([m[0], m[1], i === 1]); });
  l2.forEach((y, i) => { const m = elbow(c, 340, l1[i >> 1], 540, y); marks.push([m[0], m[1], i % 2 === 1]); });
  ys.forEach((y, i) => { const m = elbow(c, 540, l2[i >> 1], 720, y); marks.push([m[0], m[1], i % 2 === 1]); });
  marks.forEach(([x, y, yes]) => { shape(c, () => ell(c, x, y, 20, 20), WHITE, 0); yes ? tick(c, x, y, 1) : cross(c, x, y, 1); });
  NODE(c, 150, root, 58); l1.forEach((y) => NODE(c, 340, y, 42)); l2.forEach((y) => NODE(c, 540, y, 42));
  ys.forEach((y, i) => thing(c, SLOTS[i], 860, y + 48, 0.78, 55));
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c); bigSheet(c);
  const n = 7, nx = (i: number) => 150 + i * 85, ny = (i: number) => 130 + i * 112;
  for (let i = 0; i < n; i++) {
    if (i < n - 1) line(c, [[nx(i), ny(i)], [nx(i + 1), ny(i + 1)]], 6, COL.greyDk);
    line(c, [[nx(i), ny(i)], [880, ny(i)]], 6, COL.greyDk);
  }
  line(c, [[nx(n - 1), ny(n - 1)], [nx(n - 1) + 60, ny(n - 1) + 90]], 6, COL.greyDk);
  for (let i = 0; i < n; i++) { shape(c, () => ell(c, 520, ny(i), 20, 20), WHITE, 0); tick(c, 520, ny(i), 1); }
  for (let i = 0; i < n - 1; i++) { const x = (nx(i) + nx(i + 1)) / 2 - 8, y = (ny(i) + ny(i + 1)) / 2; shape(c, () => ell(c, x, y, 20, 20), WHITE, 0); cross(c, x, y, 1); }
  for (let i = 0; i < n; i++) NODE(c, nx(i), ny(i), 40);
  for (let i = 0; i < n; i++) thing(c, SLOTS[i], 950, ny(i) + 48, 0.78, 55);
  thing(c, SLOTS[7], nx(n - 1) + 60, ny(n - 1) + 165, 0.78, 55);
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  const H = 640, cx = 280, cy = 990, hh = 760, px = 760;
  const sh = cy - H * 0.74;
  // the grown-up first, with a spoon sticking out from behind the back
  at(c, px + 0.26 * hh, cy - 0.42 * hh, -0.9, 1.5, () => steelSpoon(c));
  person(c, px, cy, hh, { adult: true });
  shape(c, () => ell(c, px + 0.13 * hh, cy - 0.35 * hh, hh * 0.04, hh * 0.04), SKIN.adult, 5);
  // the child, holding the key sheet
  person(c, cx, cy, H, { armL: [Math.PI * 0.62, Math.PI * 0.35], armR: [Math.PI * 0.38, Math.PI * 0.65] });
  const sx = cx, sy = sh + H * 0.22;
  shape(c, () => rrect(c, sx - H * 0.2, sy - H * 0.13, H * 0.4, H * 0.3, 6), COL.paper, 6);
  line(c, [[sx - 70, sy + 2], [sx - 20, sy + 2], [sx - 20, sy - 35], [sx + 30, sy - 35]], 5, COL.greyDk); line(c, [[sx - 20, sy + 2], [sx - 20, sy + 40], [sx + 30, sy + 40]], 5, COL.greyDk);
  for (const [x, y] of [[sx - 70, sy + 2], [sx + 40, sy - 35], [sx + 40, sy + 40]]) shape(c, () => ell(c, x, y, 13, 13), COL.blue, 4);
  for (const s of [-1, 1]) shape(c, () => ell(c, cx + s * 0.099 * H, sh + 0.33 * H, H * 0.04, H * 0.04), SKIN.child, 5);
  // the question
  shape(c, () => { c.moveTo(250, 190); c.bezierCurveTo(250, 60, 520, 60, 520, 190); c.bezierCurveTo(520, 270, 330, 270, 300, 250); c.lineTo(270, 300); c.lineTo(285, 245); c.bezierCurveTo(262, 232, 250, 215, 250, 190); c.closePath(); }, WHITE, 6);
  qmark(c, 385, 160, 110, COL.blueDk, 12);
};

// ---------------------------------------------------------------- e4
const silverZone = (c: Ctx, x: number, y: number, w: number, h: number, no: boolean) => {
  shape(c, () => rrect(c, x, y, w, h, 26), no ? "#e3ddd0" : COL.sky, 6);
  star(c, x + 62, y + 64, 38); if (no) cross(c, x + 62, y + 64, 2.2);
};
// setup.e4.0
const e4_0 = (c: Ctx) => {
  ground(c);
  silverZone(c, 30, 400, 600, 600, false); silverZone(c, 660, 400, 390, 600, true);
  bowl(c, 220, 640, 100); thing(c, tumbler, 470, 730, 1.15, 50);
  lay(c, steelSpoon, 220, 900, -0.08, 1.0, 120, 30); thing(c, foilTray, 480, 940, 1.2, 70);
  lay(c, plasticSpoon, 860, 900, -0.15, 1.0, 120, 30);
  // the mug being carried to the "not silver" side
  thing(c, (g) => { g.scale(-1, 1); mug(g); }, 840, 330, 1.3, 55);
  handL(c, 950, 280, 1.5, SKIN.child, CLOTH.child, false);
  arrow(c, [[780, 400], [780, 570]]);
};

// setup.e4.1
const e4_1 = (c: Ctx) => {
  ground(c);
  hand(c, 210, 700, 0, 2.0, SKIN.child, CLOTH.child, true);
  bowl(c, 430, 530, 185);
  c.strokeStyle = INK; c.lineWidth = 8; c.lineCap = "round";
  for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(430, 530, 230 + i * 40, -2.75, -1.3); c.stroke(); }
  at(c, 834 - 0.796 * 91, 360 + 0.605 * 91, 2.49, 1.0, () => {
    solid(c, rect(c, -190, -11, 330, 22), COL.yellow, COL.orange, 0, 6, 5);
    solid(c, () => polyP(c, [[140, -11], [190, 0], [140, 11]]), COL.wood, COL.woodDk, 0, 3, 5);
    solid(c, () => polyP(c, [[175, -4], [190, 0], [175, 4]]), COL.black, COL.black, 0, 0, 3);
  });
  hand(c, 834, 360, 2.49, 1.3, SKIN.child, CLOTH.child, false);
  // phone with a running stopwatch
  shadow(c, 885, 965, 130, 20);
  solid(c, () => rrect(c, 770, 600, 230, 350, 34), COL.black, "#262230", 0, 0, 6);
  shape(c, () => rrect(c, 786, 630, 198, 290, 18), "#22303a", 4);
  c.beginPath(); c.arc(885, 730, 66, 0, 7); c.strokeStyle = "#c9f06b"; c.lineWidth = 9; c.stroke();
  line(c, [[885, 730], [885, 684]], 8, "#c9f06b"); line(c, [[885, 730], [920, 750]], 8, "#c9f06b");
  write(c, "05", 836, 830, 58, "#c9f06b", 9);
};

// setup.e4.2
const ring = (c: Ctx, x: number, y: number) => { shape(c, () => ell(c, x, y, 12, 12), COL.yellow, 5); for (const d of [-1, 1]) for (let i = 0; i < 2; i++) { c.beginPath(); c.arc(x, y, 30 + i * 18, d > 0 ? -0.7 : Math.PI - 0.7, d > 0 ? 0.7 : Math.PI + 0.7); c.strokeStyle = INK; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); } };
const panel = (c: Ctx, x0: number) => {
  shape(c, () => rrect(c, x0, 80, 470, 900, 28), COL.paper, 6);
  shape(c, () => rrect(c, x0 + 16, 140, 438, 390, 22), COL.sky, 5);
  shape(c, () => rrect(c, x0 + 16, 570, 438, 390, 22), "#e3ddd0", 5);
};
const e4_2 = (c: Ctx) => {
  ground(c);
  const L = 30, R = 580;
  panel(c, L); panel(c, R);
  star(c, L + 235, 188, 34); star(c, L + 235, 618, 34); cross(c, L + 235, 618, 2);
  ring(c, R + 235, 188); ring(c, R + 235, 618); cross(c, R + 235, 618, 2.2);
  const cell = (x0: number, k: number, row: number) => [x0 + (k % 2 ? 350 : 120), row];
  const put = (x0: number, k: number, baseY: number, fn: (c: Ctx) => void, wide = 55) => { const [x, y] = cell(x0, k, baseY); thing(c, fn, x, y, 0.88, wide); };
  const lie = (x0: number, k: number, baseY: number, fn: (c: Ctx) => void) => { const [x, y] = cell(x0, k, baseY); lay(c, fn, x, y - 18, 0, 0.9, 110, 20); };
  for (const x0 of [L, R]) {
    bowl(c, cell(x0, 0, 0)[0], 315, 52); put(x0, 1, 350, tumbler); lie(x0, 0, 500, steelSpoon);
  }
  put(L, 1, 520, foilTray, 70); put(L, 0, 800, mug); lie(L, 1, 800, plasticSpoon);
  put(R, 1, 520, mug); put(R, 0, 800, foilTray, 70); lie(R, 1, 800, plasticSpoon);
  arrow(c, [[455, 480], [540, 480], [540, 765], [612, 765]]);
};

export const su_materialsSortingMaterials = cards("sci.materials.sorting-materials.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2, e4_0, e4_1, e4_2]);
