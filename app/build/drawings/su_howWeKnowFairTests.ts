import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, hand, person, write, cards } from "./flatKit";

// FAIR TESTS · sci.how-we-know.fair-tests.L3 set-up cards (apple, throws, brinjal), flat DeepKids kit.

const FLESH = "#fbf1cf", BROWN = "#a8743a", LEMON = "#f6d53d", LEMON_PALE = "#f7e27a";
const PURPLE = "#6a3d8f", PURPLE_DK = "#4a2a68", BFLESH = "#eef0c4", BBROWN = "#8a5a2e";
const hx = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => { const p = hx(a), q = hx(b); return "#" + p.map((v, i) => Math.round(v + (q[i] - v) * t).toString(16).padStart(2, "0")).join(""); };

// ---------------------------------------------------------------- shared pieces
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) => {
  shape(c, () => { c.moveTo(x, y - 1.3 * s); c.bezierCurveTo(x + 0.15 * s, y - 0.7 * s, x + s, y - 0.2 * s, x + s, y + 0.4 * s); c.bezierCurveTo(x + s, y + 1.0 * s, x - s, y + 1.0 * s, x - s, y + 0.4 * s); c.bezierCurveTo(x - s, y - 0.2 * s, x - 0.15 * s, y - 0.7 * s, x, y - 1.3 * s); c.closePath(); }, col, Math.max(3, s * 0.12));
  line(c, [[x - s * 0.5, y + 0.2 * s], [x - s * 0.4, y + 0.6 * s]], Math.max(3, s * 0.12), WHITE);
};
const lemonSlice = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), LEMON, Math.max(3, r * 0.08));
  shape(c, () => ell(c, x, y, r * 0.78, r * 0.78), LEMON_PALE, 0);
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; line(c, [[x + Math.cos(a) * r * 0.12, y + Math.sin(a) * r * 0.12], [x + Math.cos(a) * r * 0.74, y + Math.sin(a) * r * 0.74]], Math.max(2, r * 0.06), "#fff6bd"); }
};
const saltBits = (c: Ctx, x: number, y: number, s: number, n = 3) => {
  const P = [[0, 0.2], [1.1, -0.5], [0.5, -1.2], [-0.6, -0.9]];
  for (let i = 0; i < n; i++) { const px = x + P[i][0] * s, py = y + P[i][1] * s; shape(c, () => polyP(c, [[px - s * 0.4, py - s * 0.4], [px + s * 0.4, py - s * 0.4], [px + s * 0.4, py + s * 0.4], [px - s * 0.4, py + s * 0.4]]), WHITE, Math.max(2.5, s * 0.1)); }
};
// a little paper tag with a picture of what is in the bowl: 0 nothing (no water), 1 water, 2 salt water, 3 lemon juice
const tagIcon = (c: Ctx, x: number, y: number, kind: number) => {
  shape(c, () => rrect(c, x - 85, y - 60, 170, 120, 16), WHITE, 5);
  if (kind === 0) { drop(c, x, y + 8, 26, COL.waterDk); line(c, [[x - 44, y + 44], [x + 44, y - 38]], 9, RED); }
  if (kind === 1) drop(c, x, y + 6, 34);
  if (kind === 2) { drop(c, x - 24, y + 6, 30); saltBits(c, x + 34, y + 24, 16); }
  if (kind === 3) lemonSlice(c, x, y, 42);
};
// an apple slice (half moon), flat edge on the baseline at (x, y); browning 0..1
const appleSlice = (c: Ctx, x: number, y: number, r: number, rot = 0, b = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const body = () => { c.moveTo(-r, 0); c.arc(0, 0, r, Math.PI, Math.PI * 2); c.closePath(); };
  const fl = mix(FLESH, BROWN, b);
  shape(c, body, fl, 0);
  c.save(); c.beginPath(); body(); c.clip();
  c.beginPath(); c.arc(0, 0, r - r * 0.04, Math.PI, Math.PI * 2); c.strokeStyle = COL.red; c.lineWidth = r * 0.2; c.stroke();
  c.beginPath(); c.arc(0, 0, r * 0.88, Math.PI, Math.PI * 2); c.strokeStyle = mix(FLESH, BROWN, Math.min(1, b + 0.25) * 0.9); c.lineWidth = b > 0 ? r * 0.12 : 0; c.stroke();
  c.restore();
  shade(c, body, mix(fl, "#7a5a30", 0.6), -r * 0.16, -r * 0.1, 0.3);
  shape(c, () => ell(c, 0, -r * 0.3, r * 0.07, r * 0.13), "#5a3a22", 0);
  shape(c, body, "rgba(0,0,0,0)", Math.max(4, r * 0.06));
  c.restore();
};
const appleWhole = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.95, r * 0.9, r * 0.17);
  const body = () => { c.moveTo(x, y - r * 0.72); c.bezierCurveTo(x + r * 0.5, y - r * 1.02, x + r * 1.1, y - r * 0.5, x + r * 0.95, y + r * 0.15); c.bezierCurveTo(x + r * 0.85, y + r * 0.75, x + r * 0.4, y + r * 1.0, x, y + r * 0.88); c.bezierCurveTo(x - r * 0.4, y + r * 1.0, x - r * 0.85, y + r * 0.75, x - r * 0.95, y + r * 0.15); c.bezierCurveTo(x - r * 1.1, y - r * 0.5, x - r * 0.5, y - r * 1.02, x, y - r * 0.72); c.closePath(); };
  shape(c, body, COL.red, 6);
  shade(c, body, "#a82f22", -r * 0.22, -r * 0.12, 0.55);
  shape(c, body, "rgba(0,0,0,0)", 6);
  line(c, [[x, y - r * 0.7], [x + r * 0.08, y - r * 1.05]], 9, INK); line(c, [[x, y - r * 0.7], [x + r * 0.08, y - r * 1.05]], 4, COL.brown);
  shape(c, () => { c.moveTo(x + r * 0.1, y - r * 0.92); c.quadraticCurveTo(x + r * 0.4, y - r * 1.2, x + r * 0.7, y - r * 1.0); c.quadraticCurveTo(x + r * 0.45, y - r * 0.8, x + r * 0.1, y - r * 0.92); c.closePath(); }, COL.leaf, 5);
  shine(c, [[x - r * 0.62, y - r * 0.25], [x - r * 0.5, y - r * 0.5]], 10);
};
// a knife, origin at the middle of the grip, blade pointing down
const knife = (c: Ctx, x: number, y: number, rot = 0, blade = 230) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => polyP(c, [[-15, 40], [17, 40], [17, blade - 50], [-6, blade], [-15, blade - 30]]), COL.steel, 6);
  shade(c, () => polyP(c, [[-15, 40], [17, 40], [17, blade - 50], [-6, blade], [-15, blade - 30]]), COL.steelDk, -9, 0, 0.7);
  shape(c, () => rrect(c, -17, -100, 34, 150, 12), "#7a4a2a", 6);
  line(c, [[0, -62], [0, -60]], 10, "#e8c88a"); line(c, [[0, 0], [0, 2]], 10, "#e8c88a");
  c.restore();
};
// a sleeve running from the edge of the card to a hand at (x, y) pointing an
const armTo = (c: Ctx, x: number, y: number, an: number, s: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -1700, -36, 1700 - 40, 72, 6), CLOTH.adult, 6);
  c.restore();
};
const adultHand = (c: Ctx, x: number, y: number, an: number, s: number, open = false) => { armTo(c, x, y, an, s); hand(c, x, y, an, s, SKIN.adult, CLOTH.adult, open); };
// the same hand coming in from the right (pointing left, thumb up)
const adultHandR = (c: Ctx, x: number, y: number, s: number, open = false) => {
  c.save(); c.translate(x, y); c.scale(-1, 1); armTo(c, 0, 0, 0, s); hand(c, 0, 0, 0, s, SKIN.adult, CLOTH.adult, open); c.restore();
};
const board = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.52, y + h + 16, w * 0.52, 26);
  shape(c, () => rrect(c, x, y + 22, w, h, 40), COL.woodDk, 6);
  shape(c, () => rrect(c, x, y, w, h, 40), COL.wood, 6);
  shade(c, () => rrect(c, x, y, w, h, 40), COL.woodDk, -18, -14, 0.5);
  shape(c, () => rrect(c, x, y, w, h, 40), "rgba(0,0,0,0)", 6);
};
const bucket = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.12, y + 8, w * 0.62, w * 0.1);
  c.beginPath(); c.ellipse(x, y - h * 0.98, w * 0.5, h * 0.5, 0, Math.PI, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 16; c.stroke();
  c.beginPath(); c.ellipse(x, y - h * 0.98, w * 0.5, h * 0.5, 0, Math.PI, Math.PI * 2); c.strokeStyle = COL.grey; c.lineWidth = 7; c.stroke();
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.36, y - 10); c.quadraticCurveTo(x, y + 14, x - w * 0.36, y - 10); c.closePath(); };
  shape(c, body, COL.blue, 6);
  shade(c, body, COL.blueDk, -w * 0.16, 0, 0.8);
  shape(c, () => polyP(c, [[x - w * 0.46, y - h * 0.6], [x + w * 0.46, y - h * 0.6], [x + w * 0.43, y - h * 0.44], [x - w * 0.43, y - h * 0.44]]), COL.yellow, 5);
  shape(c, body, "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), "#2b3f66", 6);
  shine(c, [[x - w * 0.36, y - h * 0.85], [x - w * 0.27, y - h * 0.68]], 8);
};
const brinjalSlice = (c: Ctx, x: number, y: number, rx: number, ry: number, flesh: string = BFLESH) => {
  const t = ry * 0.4;
  shape(c, () => ell(c, x, y + t, rx, ry), PURPLE_DK, 6);
  shape(c, () => polyP(c, [[x - rx, y], [x + rx, y], [x + rx, y + t], [x - rx, y + t]]), PURPLE_DK, 0);
  line(c, [[x - rx, y], [x - rx, y + t]], 6); line(c, [[x + rx, y], [x + rx, y + t]], 6);
  shape(c, () => ell(c, x, y + t, rx, ry), PURPLE_DK, 0);
  c.beginPath(); c.ellipse(x, y + t, rx, ry, 0, 0, Math.PI); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  shape(c, () => ell(c, x, y, rx, ry), PURPLE, 6);
  shape(c, () => ell(c, x, y, rx - 13, ry - 10), flesh, 0);
  for (let k = 0; k < 9; k++) { const a = k * 0.7, d = 0.45 + (k % 3) * 0.12; shape(c, () => ell(c, x + Math.cos(a) * (rx - 13) * d * 0.9, y + Math.sin(a) * (ry - 10) * d, rx * 0.05, ry * 0.07), mix(flesh, "#6a4a20", 0.5), 0); }
};
const surface = (c: Ctx, y: number, col: string) => { c.fillStyle = col; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };

// ---------------------------------------------------------------- e1: the brown apple test
const BOWLS: [string, string][] = [[COL.steelIn, "e"], [COL.water, "w"], [COL.water, "s"], [LEMON_PALE, "l"]];
const BX = [165, 395, 625, 855];
// one of the four bowls of the apple test, its rim centre at (x, y)
const testBowl = (c: Ctx, i: number, x: number, y: number, r = 105) => {
  bowl(c, x, y, r, BOWLS[i][0]);
  if (i === 2) saltBits(c, x, y, r * 0.11, 3);
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  BX.forEach((x, i) => { testBowl(c, i, x, 300); tagIcon(c, x, 520, i); });
  appleWhole(c, 300, 810, 150);
  shadow(c, 760, 925, 230, 22);
  knife(c, 830, 860, Math.PI / 2, 300);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(0, -90);
  board(c, 70, 400, 940, 560);
  appleWhole(c, 470, 700, 160);
  [[690, 890, -0.1], [800, 860, 0.1], [910, 890, 0.0]].forEach(([x, y, r]) => appleSlice(c, x, y, 88, r, 0));
  knife(c, 630, 470, 0.0, 330);
  adultHandR(c, 630 + 133, 470, 1.9);
  adultHand(c, 80, 660, 0.12, 1.9, true);
  c.restore();
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  const y = 290;
  BX.forEach((x, i) => {
    testBowl(c, i, x, y);
    c.save(); c.beginPath(); c.rect(0, 0, D, y); ell(c, x, y, 105, 21); c.clip();
    appleSlice(c, x - 4, y + 12, 66, (i - 1.5) * 0.12, 0);
    c.restore();
    c.beginPath(); c.ellipse(x, y, 105, 21, 0, 0, Math.PI); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  });
  // the phone with a one-minute timer
  shadow(c, 560, 1010, 190, 24);
  shape(c, () => rrect(c, 390, 500, 300, 500, 44), COL.black, 7);
  shape(c, () => rrect(c, 412, 540, 256, 420, 22), "#e9f3ff", 4);
  c.beginPath(); c.arc(540, 660, 100, 0, Math.PI * 2); c.strokeStyle = "#cfe0f2"; c.lineWidth = 22; c.stroke();
  c.beginPath(); c.arc(540, 660, 100, -Math.PI / 2, Math.PI * 1.1); c.strokeStyle = COL.teal; c.lineWidth = 22; c.lineCap = "round"; c.stroke();
  write(c, "01", 466, 640, 42, INK, 8); shape(c, () => ell(c, 546, 652, 5, 5), INK, 0); shape(c, () => ell(c, 546, 670, 5, 5), INK, 0); write(c, "00", 558, 640, 42, INK, 8);
  shape(c, () => rrect(c, 460, 820, 160, 60, 30), COL.teal, 5);
  shape(c, () => polyP(c, [[525, 835], [525, 865], [553, 850]]), WHITE, 3);
};

// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 470, 510, 250);
  const B = [1, 0.62, 0.3, 0];
  BX.forEach((x, i) => { appleSlice(c, x, 550, 100, 0, B[i]); tagIcon(c, x, 850, i); });
};

// ---------------------------------------------------------------- e2: ten throws
const room = (c: Ctx, base: number) => {
  ground(c, "#f6efe0");
  shape(c, () => polyP(c, [[0, base - 40], [D, base - 40], [D, base], [0, base]]), COL.cloth, 0);
  c.fillStyle = "#e2c598"; c.fillRect(0, base, D, D - base);
  line(c, [[0, base - 40], [D, base - 40]], 5); line(c, [[0, base], [D, base]], 6);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  room(c, 630);
  for (let i = 0; i <= 12; i++) line(c, [[540 + (i - 6) * 70, 630], [540 + (i - 6) * 190, D]], 3, "#cfae7c");
  bucket(c, 540, 700, 320, 340);
  const foot = (x: number, y: number, s: number) => {
    shape(c, () => { c.moveTo(x, y - 80 * s); c.bezierCurveTo(x + 46 * s, y - 80 * s, x + 44 * s, y - 10 * s, x + 24 * s, y + 20 * s); c.bezierCurveTo(x + 20 * s, y + 66 * s, x - 20 * s, y + 66 * s, x - 24 * s, y + 20 * s); c.bezierCurveTo(x - 44 * s, y - 10 * s, x - 46 * s, y - 80 * s, x, y - 80 * s); c.closePath(); }, "#b9906a", 5);
  };
  foot(460, 840, 1.25); foot(620, 765, 1.05);
  c.fillStyle = RED;
  shape(c, () => polyP(c, [[180, 920], [900, 920], [950, 995], [130, 995]]), RED, 6);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  room(c, 780);
  bucket(c, 860, 830, 240, 260);
  shape(c, () => polyP(c, [[170, 880], [440, 880], [470, 930], [140, 930]]), RED, 6);
  person(c, 300, 905, 640, { armR: [1.2, 0.2], armL: [Math.PI * 0.6, Math.PI * 0.55] });
  const bx = 515, by = 580;
  shadow(c, bx + 12, 912, 36, 8);
  shape(c, () => ell(c, bx, by, 40, 40), "#ece6d6", 6);
  [[-14, -10, 18], [-12, 4, 22], [6, -18, 22], [8, 12, 20]].forEach(([dx, dy, w]) => line(c, [[bx + dx - w / 2, by + dy], [bx + dx + w / 2, by + dy]], 4, COL.greyDk));
  const P: number[][] = []; for (let k = 0; k <= 8; k++) { const t = k / 8; P.push([570 + t * 220, 540 - Math.sin(t * Math.PI) * 190 + t * 40]); }
  arrow(c, P);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 90, 90, 880, 920, 40), COL.teal, 6);
  shadow(c, 540, 1015, 400, 22);
  shape(c, () => rrect(c, 120, 70, 850, 920, 30), COL.paper, 6);
  for (let i = 0; i < 9; i++) { shape(c, () => ell(c, 120, 140 + i * 100, 24, 18), COL.steelDk, 5); }
  const L = 200, T = 150, R = 920, M = 440, rowH = 270;
  shape(c, () => rrect(c, L, T, R - L, rowH * 2, 6), "#fffdf6", 7);
  line(c, [[L, T + rowH], [R, T + rowH]], 7); line(c, [[M, T], [M, T + rowH * 2]], 7);
  // the picture column: a child throwing under, a child throwing over
  person(c, 320, T + rowH - 20, 215, { armR: [1.2, 0.2] });
  shape(c, () => ell(c, 320 + 13 + 40 + 20, T + rowH - 20 - 215 * 0.74 + 20 + 50, 16, 16), "#ece6d6", 4);
  person(c, 320, T + rowH * 2 - 20, 215, { armR: [-1.1, -1.5] });
  shape(c, () => ell(c, 320 + 215 * 0.11 + Math.cos(-1.1) * 36.5 + Math.cos(-1.5) * 34.4, T + rowH * 2 - 20 - 215 * 0.74 + 6.5 + Math.sin(-1.1) * 36.5 + Math.sin(-1.5) * 34.4 - 24, 16, 16), "#ece6d6", 4);
  // tally marks: 7 (a crossed bundle of five, then two) and 4, drawn big, with the count written beside
  const tally = (n: number, y: number) => {
    let x = M + 36;
    for (let g = 0; g < n; g += 5) {
      const k = Math.min(5, n - g), v = Math.min(4, k);
      for (let i = 0; i < v; i++) line(c, [[x + i * 36, y - 80], [x + i * 36, y + 80]], 14, COL.blueDk);
      if (k === 5) line(c, [[x - 22, y + 60], [x + 3 * 36 + 22, y - 60]], 14, COL.blueDk);
      x += (k === 5 ? 3 * 36 : (v - 1) * 36) + 56;
    }
  };
  tally(7, T + rowH / 2); tally(4, T + rowH * 1.5);
  write(c, "7", 835, T + rowH / 2 - 55, 110, INK, 12); write(c, "4", 835, T + rowH * 1.5 - 55, 110, INK, 12);
  // pencil
  c.save(); c.translate(540, 860); c.rotate(-0.1);
  shape(c, () => rrect(c, -230, -22, 380, 44, 6), COL.yellow, 6);
  shape(c, () => polyP(c, [[150, -22], [220, 0], [150, 22]]), "#f2d2a0", 6);
  shape(c, () => polyP(c, [[200, -7], [220, 0], [200, 7]]), INK, 2);
  shape(c, () => rrect(c, -230, -22, 50, 44, 6), COL.pink, 6);
  c.restore();
};

// ---------------------------------------------------------------- e3: the brinjal bowl
const brinjalBody = (c: Ctx, x: number, y: number, len: number, th: number) => {
  const body = () => { c.moveTo(x + len, y - th * 0.5); c.bezierCurveTo(x + len * 0.6, y - th * 0.62, x + len * 0.15, y - th * 0.55, x, y - th * 0.2); c.bezierCurveTo(x - th * 0.1, y, x - th * 0.05, y + th * 0.2, x + len * 0.1, y + th * 0.4); c.bezierCurveTo(x + len * 0.3, y + th * 0.52, x + len * 0.7, y + th * 0.55, x + len, y + th * 0.5); c.closePath(); };
  shape(c, body, PURPLE, 6);
  shade(c, body, PURPLE_DK, -th * 0.12, -th * 0.1, 0.7);
  shape(c, body, "rgba(0,0,0,0)", 6);
  shine(c, [[x + len * 0.3, y - th * 0.38], [x + len * 0.65, y - th * 0.43]], 10);
  shape(c, () => ell(c, x + len, y, 26, th * 0.5), BFLESH, 6);
  shape(c, () => polyP(c, [[x + 6, y - th * 0.35], [x + 40, y - th * 0.15], [x + 36, y + th * 0.2], [x + 4, y + th * 0.35], [x - 14, y + th * 0.05]]), COL.leaf, 5);
  line(c, [[x - 8, y - th * 0.1], [x - 60, y - th * 0.35]], 20, INK); line(c, [[x - 8, y - th * 0.1], [x - 60, y - th * 0.35]], 9, COL.leafDk);
};
const waterBowl = (c: Ctx, x: number, y: number, r: number) => { bowl(c, x, y, r, COL.water); c.beginPath(); ell(c, x - r * 0.3, y - 2, r * 0.25, r * 0.04); c.fillStyle = COL.drop; c.fill(); };

// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  plate(c, 190, 200, 170, 70);
  waterBowl(c, 530, 190, 100);
  waterBowl(c, 850, 190, 100);
  board(c, 60, 350, 960, 640);
  brinjalBody(c, 190, 700, 340, 200);
  [[730, 870], [890, 760], [910, 880]].forEach(([x, y]) => brinjalSlice(c, x, y, 80, 62));
  knife(c, 610, 500, 0, 320);
  adultHandR(c, 610 + 133, 500, 1.9);
};

// a see-through bowl from the side: rim centre x at height y, water level wy; draw() puts things in the water
const glassBowl = (c: Ctx, x: number, y: number, w: number, wy: number, inside: () => void) => {
  const dep = w * 0.55, body = () => { c.moveTo(x - w / 2, y); c.bezierCurveTo(x - w * 0.5, y + dep * 0.9, x - w * 0.25, y + dep, x, y + dep); c.bezierCurveTo(x + w * 0.25, y + dep, x + w * 0.5, y + dep * 0.9, x + w / 2, y); c.closePath(); };
  shadow(c, x + w * 0.05, y + dep + 8, w * 0.38, 18);
  shape(c, body, "rgba(214,236,250,0.5)", 0);
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = COL.water; c.fillRect(x - w, wy, w * 2, 600);
  c.fillStyle = COL.waterDk; c.globalAlpha = 0.35; c.fillRect(x - w, wy, w * 2, 8); c.globalAlpha = 1;
  inside();
  c.restore();
  shape(c, body, "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, x, y, w / 2, w * 0.05), "rgba(255,255,255,0.3)", 6);
  shine(c, [[x - w * 0.4, y + dep * 0.25], [x - w * 0.3, y + dep * 0.55]], 8);
};
// a brinjal slice seen from the side and a little above: purple skin round the edge, pale cut face on top
const discPiece = (c: Ctx, x: number, y: number, rx: number, t: number) => {
  const ry = rx * 0.22;
  shape(c, () => ell(c, x, y + t, rx, ry), PURPLE_DK, 6);
  shape(c, () => polyP(c, [[x - rx, y], [x + rx, y], [x + rx, y + t], [x - rx, y + t]]), PURPLE_DK, 0);
  line(c, [[x - rx, y], [x - rx, y + t]], 6); line(c, [[x + rx, y], [x + rx, y + t]], 6);
  shape(c, () => ell(c, x, y + t, rx, ry), PURPLE_DK, 0);
  c.beginPath(); c.ellipse(x, y + t, rx, ry, 0, 0, Math.PI); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  shape(c, () => ell(c, x, y, rx, ry), PURPLE, 6);
  shape(c, () => ell(c, x, y, rx - 12, ry - 6), BFLESH, 0);
  for (let k = 0; k < 5; k++) shape(c, () => ell(c, x + (k - 2) * rx * 0.3, y + (k % 2 ? 3 : -3), 5, 3), mix(BFLESH, "#6a4a20", 0.5), 0);
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(0, 80);
  const wy = 640, w = 430;
  // left: the slice floats, its top face up in the air
  glassBowl(c, 270, 560, w, wy, () => {
    discPiece(c, 270, wy - 34, 100, 54);
    c.fillStyle = COL.water; c.globalAlpha = 0.5; c.fillRect(100, wy, 340, 120); c.globalAlpha = 1;
  });
  // right: a steel lid pressed down holds the slice under the water
  glassBowl(c, 780, 560, w, wy, () => {
    discPiece(c, 780, wy + 62, 100, 54);
    shape(c, () => rrect(c, 640, wy + 8, 280, 32, 12), COL.steel, 6);
    c.fillStyle = COL.water; c.globalAlpha = 0.28; c.fillRect(600, wy, 360, 200); c.globalAlpha = 1;
  });
  // the lid's knob stands out of the water; a hand grips it and pushes down
  shape(c, () => rrect(c, 740, wy - 62, 80, 66, 16), COL.steelDk, 6);
  adultHand(c, 780, 470, Math.PI / 2, 1.9);
  arrow(c, [[940, 300], [940, 520]]);
  c.restore();
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 450, 510, 270);
  const X = [220, 540, 860];
  brinjalSlice(c, X[0], 440, 135, 105, BBROWN);
  brinjalSlice(c, X[1], 440, 135, 105);
  brinjalSlice(c, X[2], 440, 135, 105);
  [0, 1, 2].forEach((k, i) => tagIcon(c, X[i], 850, k));
};

export const su_howWeKnowFairTests = cards("sci.how-we-know.fair-tests.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
