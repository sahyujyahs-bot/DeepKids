import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, WHITE, SKIN, arrow, shine, cards, D, ell, ground, hand, line, person, polyP, rnd, rrect, shade, shadow, shape, write } from "./flatKit";

// FORCES OF FLIGHT L3 · picture cards for the lesson's activities, words and ideas.
// Bold ink outlines, flat colours, shade side, soft shadow. Same child and grown-up as the set-up cards.

const WOOD = "#ead2a0", WALL = "#f3e6c9", FLOOR = "#d9b98a", PAPER2 = "#e6dcc3", SKY = "#cfe9f7", WIND = "#8fc3ea", GRASS = "#8cc063", GRASSDK = "#6aa53f";

const tableTop = (c: Ctx) => { ground(c, WOOD); for (const y of [180, 470, 760, 980]) line(c, [[0, y], [D, y + 12]], 3, "rgba(160,110,50,0.25)"); };
const room = (c: Ctx, y0: number) => {
  ground(c, WALL); c.fillStyle = FLOOR; c.fillRect(0, y0, D, D - y0); c.fillStyle = "#b8935f"; c.fillRect(0, y0 - 18, D, 18);
  line(c, [[0, y0 - 18], [D, y0 - 18]], 4); line(c, [[0, y0], [D, y0]], 4);
};
const sky = (c: Ctx, gy = 0) => {
  ground(c, SKY);
  if (gy) { c.fillStyle = GRASS; c.fillRect(0, gy, D, D - gy); c.fillStyle = GRASSDK; c.fillRect(0, gy, D, 14); line(c, [[0, gy], [D, gy]], 5); }
};
const sleeve = (c: Ctx, x: number, y: number, an: number, s: number, col: string = CLOTH.child) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s); shape(c, () => rrect(c, -700, -36, 640, 72, 14), col, 6); c.restore();
};
const wind = (c: Ctx, pts: number[][], w = 9) => { c.globalAlpha = 0.9; line(c, pts, w, WIND); c.globalAlpha = 1; };
const windArrow = (c: Ctx, pts: number[][]) => { c.globalAlpha = 0.95; arrow(c, pts, WIND, 9); c.globalAlpha = 1; };
// wrist of a person() arm
const wristOf = (x: number, y: number, h: number, side: 1 | -1, [a1, a2]: [number, number]) => {
  const sx = x + side * h * 0.11, sy = y - h * 0.74 + h * 0.03, ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};

// the paper plane (a dart) seen from above, nose right
const plane = (c: Ctx, x: number, y: number, s = 1, rot = 0, tilt = 1) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s * tilt);
  const far = [[150, 0], [-110, -85], [-110, -9], [-55, -9]], near = [[150, 0], [-110, 85], [-110, 9], [-55, 9]];
  shape(c, () => polyP(c, far), COL.paper); shape(c, () => polyP(c, near), COL.paper);
  shade(c, () => polyP(c, near), "#b9ae93", 12, 0, 0.45);
  shape(c, () => polyP(c, [[150, 0], [-55, -9], [-110, -9], [-110, 9], [-55, 9]]), "#ffffff");
  line(c, [[150, 0], [-110, 0]], 3, COL.greyDk);
  c.restore();
};
// the paper plane seen from the side, nose right
const planeSide = (c: Ctx, x: number, y: number, s = 1, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => polyP(c, [[150, 0], [-110, -50], [-110, 12], [-10, 14]]), "#ffffff");
  shape(c, () => polyP(c, [[150, 0], [-10, 14], [-110, 12], [-60, 34]]), PAPER2);
  c.restore();
};
// an aeroplane seen from the side, nose right; near wing toward us
const aero = (c: Ctx, x: number, y: number, s = 1, rot = 0, prop = false) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => polyP(c, [[-140, -8], [-205, -105], [-140, -105], [-80, -20]]), COL.teal);
  shape(c, () => polyP(c, [[-30, 0], [-130, 0], [-160, 95], [-95, 95]]), COL.tealDk);
  shape(c, () => ell(c, 0, 0, 185, 44), WHITE);
  shade(c, () => ell(c, 0, 0, 185, 44), "#b7c4d6", 0, 22, 0.5);
  shape(c, () => ell(c, 105, -14, 34, 18, -0.15), COL.sky, 5);
  for (const wx of [20, -35]) shape(c, () => ell(c, wx, -12, 11, 11), COL.sky, 4);
  shape(c, () => polyP(c, [[60, 10], [-45, 10], [-120, 120], [-40, 120]]), COL.teal);
  shade(c, () => polyP(c, [[60, 10], [-45, 10], [-120, 120], [-40, 120]]), COL.tealDk, 14, 8, 0.6);
  if (prop) {
    shape(c, () => ell(c, 188, 0, 12, 14), COL.steelDk, 5);
    c.globalAlpha = 0.5; shape(c, () => ell(c, 200, 0, 20, 92), COL.steelIn, 4); c.globalAlpha = 1;
    shape(c, () => ell(c, 200, 0, 12, 12), COL.steelDk, 4);
  }
  c.restore();
};
const spinner = (c: Ctx, x: number, y: number, s = 1, wl = 110) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => rrect(c, -50, -10, 100, 270, 4), COL.paper);
  shape(c, () => polyP(c, [[-50, -42], [-50 - wl, -60], [-50 - wl, -8], [-50, 10]]), "#ffffff");
  shape(c, () => polyP(c, [[50, -42], [50 + wl, -26], [50 + wl, 26], [50, 10]]), PAPER2);
  shape(c, () => rrect(c, -50, 150, 100, 110, 4), "#ffffff");
  line(c, [[-50, 10], [50, 10]], 3, COL.greyDk);
  c.lineWidth = 12; c.strokeStyle = INK; c.beginPath(); rrect(c, -34, 138, 68, 56, 14); c.stroke();
  c.lineWidth = 6; c.strokeStyle = COL.steel; c.beginPath(); rrect(c, -34, 138, 68, 56, 14); c.stroke();
  c.restore();
};
const clip = (c: Ctx, x: number, y: number, w: number, h: number) => {
  c.lineWidth = 12; c.strokeStyle = INK; c.beginPath(); rrect(c, x, y, w, h, w / 2.5); c.stroke();
  c.lineWidth = 6; c.strokeStyle = COL.steel; c.beginPath(); rrect(c, x, y, w, h, w / 2.5); c.stroke();
};
const samara = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => { c.moveTo(-10, -14); c.bezierCurveTo(-40, -70, -22, -150, 14, -165); c.bezierCurveTo(34, -130, 24, -60, 12, -14); c.closePath(); }, "#e3b66b");
  shade(c, () => { c.moveTo(-10, -14); c.bezierCurveTo(-40, -70, -22, -150, 14, -165); c.bezierCurveTo(34, -130, 24, -60, 12, -14); c.closePath(); }, "#c4903f", 10, 0, 0.5);
  line(c, [[-4, -24], [6, -140]], 3, "#b07a2e");
  shape(c, () => ell(c, 0, 4, 20, 26), COL.brown);
  c.restore();
};
const kite = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const T = [0, -170], R = [115, 0], B = [0, 230], L = [-115, 0], O = [0, 0];
  shape(c, () => polyP(c, [T, R, O]), COL.red); shape(c, () => polyP(c, [R, B, O]), COL.yellow);
  shape(c, () => polyP(c, [B, L, O]), COL.red); shape(c, () => polyP(c, [L, T, O]), COL.yellow);
  shape(c, () => polyP(c, [T, R, B, L]), "rgba(0,0,0,0)", 8);
  line(c, [T, B], 6, COL.woodDk); line(c, [L, R], 6, COL.woodDk);
  c.restore();
};
const bird = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => polyP(c, [[-24, 40], [-60, 125], [0, 105], [60, 125], [24, 40]]), COL.brown);
  for (const sd of [-1, 1]) {
    shape(c, () => { c.moveTo(sd * 18, -30); c.bezierCurveTo(sd * 120, -70, sd * 200, -50, sd * 250, -10); c.lineTo(sd * 226, 4); c.lineTo(sd * 228, 24); c.lineTo(sd * 196, 28); c.lineTo(sd * 190, 52); c.bezierCurveTo(sd * 120, 70, sd * 60, 62, sd * 20, 52); c.closePath(); }, "#9a6a3a");
    shade(c, () => { c.moveTo(sd * 18, -30); c.bezierCurveTo(sd * 120, -70, sd * 200, -50, sd * 250, -10); c.lineTo(sd * 190, 52); c.lineTo(sd * 20, 52); c.closePath(); }, "#6e4724", 0, 14, 0.4);
  }
  shape(c, () => ell(c, 0, 10, 30, 62), COL.brown);
  shape(c, () => ell(c, 0, -62, 20, 22), "#c99461");
  shape(c, () => polyP(c, [[-6, -76], [6, -76], [0, -96]]), COL.yellow, 4);
  c.restore();
};
const patangTail = (c: Ctx, pts: number[][]) => {
  line(c, pts, 6);
  pts.forEach(([px, py], i) => { if (i % 2 === 1) { shape(c, () => polyP(c, [[px, py], [px - 26, py - 20], [px - 26, py + 20]]), COL.pink, 5); shape(c, () => polyP(c, [[px, py], [px + 26, py - 20], [px + 26, py + 20]]), COL.pink, 5); } });
};

// ------------------------------------------------------------------ flows
// flow.e2 · three paper seed spinners, longer wings fall slower (shorter arrow)
const f_e2 = (c: Ctx) => {
  tableTop(c);
  spinner(c, 250, 200, 1.15, 130); spinner(c, 540, 200, 1.15, 95); spinner(c, 830, 200, 1.15, 60);
  arrow(c, [[250, 560], [250, 680]], RED, 14); arrow(c, [[540, 560], [540, 780]], RED, 14); arrow(c, [[830, 560], [830, 900]], RED, 14);
};
// flow.e3 · a card held tilted in the wind of a fan
const f_e3 = (c: Ctx) => {
  room(c, 900);
  const gx = 250, gy = 480;
  shadow(c, gx + 20, 925, 190, 26);
  shape(c, () => rrect(c, gx - 56 + 20, 700, 56, 200, 12), COL.steel);
  shape(c, () => rrect(c, gx - 140, 880, 300, 56, 26), COL.teal);
  shape(c, () => ell(c, gx, gy, 95, 235), "rgba(255,255,255,0.4)");
  for (let k = 0; k < 3; k++) { const a = k * 2.094 + 1.2; shape(c, () => ell(c, gx + Math.cos(a) * 36 + 20, gy + Math.sin(a) * 105, 36, 50, a * 0.5), COL.teal, 6); }
  for (let k = 0; k < 8; k++) { const a = k * 0.785; line(c, [[gx, gy], [gx + Math.cos(a) * 95, gy + Math.sin(a) * 235]], 4, COL.steelDk); }
  c.beginPath(); ell(c, gx, gy, 95, 235); c.lineWidth = 9; c.strokeStyle = INK; c.stroke();
  for (const [yy, l] of [[330, 200], [430, 260], [540, 240], [650, 260]]) windArrow(c, [[400, yy], [400 + l, yy]]);
  c.save(); c.translate(760, 520); c.rotate(0.3);
  shape(c, () => rrect(c, -170, -4, 340, 26, 4), PAPER2);
  shape(c, () => polyP(c, [[-170, -4], [170, -4], [205, -44], [-135, -44]]), WHITE);
  c.restore();
  sleeve(c, 860, 600, Math.PI - 0.3, 1.5);
  hand(c, 860, 600, Math.PI - 0.3, 1.5, SKIN.child, CLOTH.child);
  arrow(c, [[740, 380], [740, 220]], RED, 14);
};
// flow.a1 · a dry tissue stuffed in a glass pushed upside down into water
const f_a1 = (c: Ctx) => {
  room(c, 1000);
  ground(c, WALL);
  shadow(c, 540, 960, 400, 36);
  shape(c, () => polyP(c, [[130, 560], [950, 560], [880, 930], [200, 930]]), COL.steel);
  shape(c, () => polyP(c, [[150, 640], [930, 640], [872, 920], [208, 920]]), COL.water);
  shade(c, () => polyP(c, [[150, 640], [930, 640], [872, 920], [208, 920]]), COL.waterDk, 20, 0, 0.5);
  shape(c, () => ell(c, 540, 640, 390, 36), COL.drop);
  // the glass, mouth down in the water: water inside only rises a little
  const gl = 400, gr = 680;
  shape(c, () => polyP(c, [[gl, 250], [gr, 250], [gr - 20, 790], [gl + 20, 790]]), COL.glass);
  shape(c, () => ell(c, 540, 750, 118, 22), "rgba(143,195,234,0.9)", 0);
  shape(c, () => polyP(c, [[gl + 12, 750], [gr - 12, 750], [gr - 20, 790], [gl + 20, 790]]), COL.water, 0);
  shape(c, () => ell(c, 540, 252, 140, 22), "rgba(255,255,255,0.4)", 6);
  shape(c, () => { c.moveTo(450, 300); c.bezierCurveTo(430, 250, 480, 240, 520, 270); c.bezierCurveTo(580, 230, 640, 260, 625, 320); c.bezierCurveTo(640, 380, 590, 420, 540, 400); c.bezierCurveTo(470, 430, 430, 370, 450, 300); c.closePath(); }, WHITE, 6);
  line(c, [[480, 300], [510, 340]], 3, COL.grey); line(c, [[590, 290], [570, 350]], 3, COL.grey);
  shine(c, [[420, 300], [440, 700]]);
  sleeve(c, 540, 150, Math.PI / 2, 1.5, CLOTH.adult);
  hand(c, 540, 150, Math.PI / 2, 1.5, SKIN.adult, CLOTH.adult);
  arrow(c, [[790, 300], [790, 560]], RED, 14);
};
// flow.a2 · a hair dryer holds a ping-pong ball up in the air
const f_a2 = (c: Ctx) => {
  room(c, 1000);
  ground(c, SKY);
  for (const dx of [-1, 1]) for (const k of [0, 1]) {
    const x0 = 500 + dx * (30 + k * 45), x1 = 500 + dx * (130 + k * 60);
    c.globalAlpha = 0.9; line(c, [[x0, 700], [x0 + dx * 10, 600], [x1 - dx * 25, 500], [x1, 380], [x1 - dx * 10, 280]], 9, WIND); c.globalAlpha = 1;
  }
  c.save(); c.translate(500, 850); c.rotate(-Math.PI / 2); c.scale(1.05, 1.05);
  shape(c, () => rrect(c, -150, -50, 220, 100, 44), COL.purple);
  shade(c, () => rrect(c, -150, -50, 220, 100, 44), "#6a4ea8", 0, 24, 0.7);
  shape(c, () => polyP(c, [[60, -46], [140, -34], [140, 34], [60, 46]]), COL.steel);
  shape(c, () => rrect(c, -90, 40, 66, 170, 18), COL.purple);
  shape(c, () => ell(c, -20, 0, 12, 12), COL.yellow, 4);
  c.restore();
  shadow(c, 520, 560, 90, 14);
  shape(c, () => ell(c, 500, 370, 100, 100), WHITE);
  shade(c, () => ell(c, 500, 370, 100, 100), "#c9c4b8", 26, 22, 0.5);
  shine(c, [[450, 320], [470, 300]]);
  arrow(c, [[860, 800], [860, 600]], RED, 14);
};
// flow.a3 · looking for winged seeds under a tree
const f_a3 = (c: Ctx) => {
  sky(c, 780);
  shape(c, () => rrect(c, 780, 360, 80, 430, 14), COL.brown);
  shade(c, () => rrect(c, 780, 360, 80, 430, 14), COL.soilDk, 24, 0, 0.5);
  for (const [x, y, r] of [[820, 230, 170], [680, 300, 130], [950, 290, 120]]) shape(c, () => ell(c, x, y, r, r * 0.85), COL.leaf);
  shade(c, () => ell(c, 820, 230, 170, 145), COL.leafDk, 30, 30, 0.45);
  shadow(c, 260, 800, 120, 18);
  const h = 560, x = 250, y = 830;
  person(c, x, y, h, { armL: [1.7, 1.5], armR: [0.45, 0.5] });
  const [wx, wy] = wristOf(x, y, h, 1, [0.45, 0.5]);
  shape(c, () => rrect(c, wx - 50, wy - 10, 100, 120, 8), COL.wood); shape(c, () => polyP(c, [[wx - 50, wy - 10], [wx + 50, wy - 10], [wx + 50, wy + 14], [wx - 50, wy + 14]]), COL.woodDk, 5);
  samara(c, 690, 520, 1, 0.4); samara(c, 570, 700, 0.9, -0.5); samara(c, 690, 770, 0.7, 2.6);
  arrow(c, [[620, 380], [650, 430], [640, 480]], RED, 12);
};
// flow.c1 · a paper parachute seed carrying a clip
const f_c1 = (c: Ctx) => {
  room(c, 1000); ground(c, WALL);
  shape(c, () => rrect(c, 110, 100, 36, 860, 6), COL.yellow);
  for (let y = 120; y < 950; y += 43) line(c, [[110, y], [y % 2 ? 128 : 134, y]], 3);
  write(c, "2 m", 180, 120, 60, INK, 8);
  const cx = 560;
  shape(c, () => { c.moveTo(cx - 240, 400); c.bezierCurveTo(cx - 240, 170, cx + 240, 170, cx + 240, 400); c.closePath(); }, COL.paper);
  shade(c, () => { c.moveTo(cx - 240, 400); c.bezierCurveTo(cx - 240, 170, cx + 240, 170, cx + 240, 400); c.closePath(); }, "#b9ae93", 40, 0, 0.4);
  line(c, [[cx - 90, 330], [cx - 130, 390]], 3, COL.greyDk); line(c, [[cx + 90, 330], [cx + 130, 390]], 3, COL.greyDk);
  line(c, [[cx, 270], [cx, 390]], 3, COL.greyDk);
  for (const sx of [-240, -80, 80, 240]) line(c, [[cx + sx, 400], [cx, 720]], 4, INK);
  clip(c, cx - 22, 710, 44, 100);
  arrow(c, [[860, 300], [860, 620]], RED, 14);
};
// flow.c2 · a paper plane carrying a coin
const f_c2 = (c: Ctx) => {
  sky(c, 860);
  shadow(c, 480, 870, 260, 22);
  plane(c, 470, 560, 2, 0, 0.55);
  shape(c, () => ell(c, 470, 470, 88, 60), COL.steel);
  shade(c, () => ell(c, 470, 470, 88, 60), COL.steelDk, 18, 14, 0.5);
  shape(c, () => ell(c, 470, 460, 66, 42), COL.steelIn, 4);
  write(c, "1", 450, 436, 50, INK, 7);
  shape(c, () => polyP(c, [[400, 520], [550, 520], [550, 548], [400, 548]]), "rgba(255,240,170,0.85)", 4);
  arrow(c, [[800, 560], [1010, 560]], RED, 14);
};
// flow.a6 · dancing with a dupatta wings
const f_a6 = (c: Ctx) => {
  room(c, 780);
  const h = 640, x = 540, y = 930, aL: [number, number] = [Math.PI + 0.45, Math.PI + 0.1], aR: [number, number] = [-0.45, -0.1];
  shadow(c, x + 10, y + 6, 150, 22);
  const [lx, ly] = wristOf(x, y, h, -1, aL), [rx, ry] = wristOf(x, y, h, 1, aR);
  for (const [sx, sy, sd] of [[lx, ly, -1], [rx, ry, 1]]) {
    const p = [[sx, sy], [sx + sd * 80, sy + 20], [sx + sd * 160, sy - 20], [sx + sd * 230, sy + 30]];
    line(c, p, 56, INK); line(c, p, 44, COL.pink);
    line(c, [[sx + sd * 40, sy + 8], [sx + sd * 160, sy], [sx + sd * 260, sy + 12]], 6, "#fff");
  }
  person(c, x, y, h, { armL: aL, armR: aR });
};

// ------------------------------------------------------------------ terms
const t_force = (c: Ctx) => {
  room(c, 780);
  shadow(c, 640, 800, 230, 24);
  shape(c, () => rrect(c, 430, 500, 300, 280, 10), COL.wood);
  shade(c, () => rrect(c, 430, 500, 300, 280, 10), COL.woodDk, 24, 0, 0.5);
  line(c, [[430, 560], [730, 560]], 5); line(c, [[430, 720], [730, 720]], 5);
  line(c, [[455, 520], [705, 760]], 5, COL.woodDk); line(c, [[705, 520], [455, 760]], 5, COL.woodDk);
  sleeve(c, 220, 640, 0, 1.6); hand(c, 220, 640, 0, 1.6, SKIN.child, CLOTH.child, true);
  arrow(c, [[500, 380], [820, 380]], RED, 16);
};
const t_lift = (c: Ctx) => { sky(c); aero(c, 540, 620, 1.35, -0.06, true); arrow(c, [[480, 450], [480, 160]], RED, 18); };
const t_weight = (c: Ctx) => {
  sky(c, 860);
  shape(c, () => rrect(c, 520, 70, 40, 130, 10), COL.brown);
  shape(c, () => rrect(c, 500, 150, 240, 36, 16), COL.brown);
  line(c, [[540, 190], [540, 250]], 6, COL.greenDk);
  shadow(c, 540, 870, 120, 18);
  shape(c, () => { c.moveTo(540, 300); c.bezierCurveTo(430, 240, 340, 310, 360, 450); c.bezierCurveTo(375, 570, 470, 620, 540, 590); c.bezierCurveTo(610, 620, 705, 570, 720, 450); c.bezierCurveTo(740, 310, 650, 240, 540, 300); c.closePath(); }, COL.red);
  shade(c, () => { c.moveTo(540, 300); c.bezierCurveTo(430, 240, 340, 310, 360, 450); c.bezierCurveTo(375, 570, 470, 620, 540, 590); c.bezierCurveTo(610, 620, 705, 570, 720, 450); c.bezierCurveTo(740, 310, 650, 240, 540, 300); c.closePath(); }, "#a8321f", 40, 30, 0.5);
  line(c, [[540, 300], [535, 240]], 8, COL.brown);
  shape(c, () => { c.moveTo(540, 250); c.quadraticCurveTo(600, 190, 650, 230); c.quadraticCurveTo(600, 280, 540, 250); c.closePath(); }, COL.leaf, 5);
  shine(c, [[400, 360], [410, 440]]);
  arrow(c, [[880, 400], [880, 800]], RED, 18);
};
const t_thrust = (c: Ctx) => { sky(c); aero(c, 380, 560, 1.15, 0, true); arrow(c, [[690, 560], [1010, 560]], RED, 18); };
const t_thermal = (c: Ctx) => {
  ground(c, SKY);
  shape(c, () => ell(c, 160, 150, 90, 90), COL.yellow);
  for (let k = 0; k < 8; k++) { const a = k * 0.785; line(c, [[160 + Math.cos(a) * 110, 150 + Math.sin(a) * 110], [160 + Math.cos(a) * 150, 150 + Math.sin(a) * 150]], 8, COL.orange); }
  c.fillStyle = "#d9a15c"; c.fillRect(0, 830, D, 250); c.fillStyle = "#b9803f"; c.fillRect(0, 830, D, 14); line(c, [[0, 830], [D, 830]], 5);
  for (const x of [300, 540, 780]) { c.globalAlpha = 0.85; line(c, [[x, 810], [x + 40, 730], [x - 20, 650], [x + 30, 570], [x - 10, 490]], 12, "#f5a062"); c.globalAlpha = 1; }
  arrow(c, [[540, 780], [540, 300]], RED, 18);
  bird(c, 760, 330, 0.8, 0.4); bird(c, 330, 560, 0.7, -0.5);
};
const t_tilt = (c: Ctx) => {
  sky(c);
  const px = 300, py = 560, an = 0.33;
  for (const yy of [400, 520, 640, 760]) windArrow(c, [[40, yy], [250, yy]]);
  c.save(); c.translate(px, py); c.rotate(an); shape(c, () => rrect(c, 0, -14, 520, 28, 4), WHITE); shade(c, () => rrect(c, 0, -14, 520, 28, 4), "#b9ae93", 0, 10, 0.5); c.restore();
  shape(c, () => ell(c, px, py, 16, 16), COL.steelDk, 5);
  c.setLineDash([16, 14]); line(c, [[px, py], [px + 560, py]], 5, INK); c.setLineDash([]);
  c.beginPath(); c.arc(px, py, 230, 0, an); c.strokeStyle = RED; c.lineWidth = 14; c.lineCap = "round"; c.stroke();
  arrow(c, [[700, 480], [700, 250]], RED, 16);
};
const t_stall = (c: Ctx) => {
  sky(c);
  const px = 280, py = 330, an = 0.95;
  for (const yy of [280, 400, 520]) windArrow(c, [[40, yy], [200, yy]]);
  c.save(); c.translate(px, py); c.rotate(an); shape(c, () => rrect(c, 0, -14, 520, 28, 4), WHITE); shade(c, () => rrect(c, 0, -14, 520, 28, 4), "#b9ae93", 0, 10, 0.5); c.restore();
  for (const [sx, sy, r] of [[640, 300, 70], [760, 420, 60], [650, 530, 50]]) { c.beginPath(); c.arc(sx, sy, r, 0.5, 4.8); c.strokeStyle = WIND; c.lineWidth = 11; c.lineCap = "round"; c.stroke(); }
  arrow(c, [[900, 520], [900, 880]], RED, 18);
};
const t_balance = (c: Ctx) => {
  room(c, 900); ground(c, WALL);
  c.fillStyle = FLOOR; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 4);
  const fx = 520;
  shadow(c, fx + 40, 910, 120, 16);
  shape(c, () => rrect(c, fx - 32, 600, 64, 300, 6), COL.yellow);
  shade(c, () => rrect(c, fx - 32, 600, 64, 300, 6), COL.orange, 20, 0, 0.5);
  line(c, [[fx, 600], [fx, 900]], 4, COL.orange);
  shape(c, () => polyP(c, [[fx - 32, 600], [fx + 32, 600], [fx, 530]]), "#f2d9b0");
  shape(c, () => polyP(c, [[fx - 11, 560], [fx + 11, 560], [fx, 530]]), COL.black, 4);
  plane(c, fx + 40, 510, 1.9, 0, 0.55);
};
const t_kite = (c: Ctx) => {
  sky(c);
  kite(c, 520, 380, 1.25, 0.12);
  patangTail(c, [[560, 680], [520, 740], [590, 800], [540, 860], [610, 920], [560, 980]]);
  c.beginPath(); c.moveTo(500, 560); c.quadraticCurveTo(620, 880, 330, 1040); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
const t_feather = (c: Ctx) => {
  ground(c, BG);
  shadow(c, 560, 960, 200, 18);
  c.save(); c.translate(540, 530); c.rotate(-0.5); c.scale(1.5, 1.5);
  const vane = () => {
    c.moveTo(0, 150); c.bezierCurveTo(-90, 100, -120, -80, -24, -250);
    c.lineTo(-16, -222); c.lineTo(-52, -200); c.lineTo(-40, -170); c.lineTo(-78, -140); c.lineTo(-62, -100);
    c.lineTo(-96, -50); c.lineTo(-80, 0);
    c.lineTo(0, 150);
    c.moveTo(0, 150); c.bezierCurveTo(80, 100, 90, -90, 20, -270); c.lineTo(0, -240); c.closePath();
  };
  const left = () => { c.moveTo(0, 150); c.bezierCurveTo(-90, 100, -120, -80, -24, -250); c.lineTo(0, -240); c.closePath(); };
  const right = () => { c.moveTo(0, 150); c.bezierCurveTo(80, 100, 90, -90, 20, -270); c.lineTo(0, -240); c.closePath(); };
  shape(c, left, "#8fa7c7"); shape(c, right, "#a9bfdc");
  shade(c, right, "#6f88ad", 18, 0, 0.45);
  c.save(); c.beginPath(); left(); right(); c.clip();
  for (let y = -230; y < 150; y += 14) { line(c, [[0, y], [-110, y - 70]], 3, "rgba(43,35,64,0.35)"); line(c, [[0, y], [100, y - 70]], 3, "rgba(43,35,64,0.35)"); }
  for (const y of [-150, -60, 30]) line(c, [[-90, y], [90, y - 20]], 18, "rgba(43,35,64,0.25)");
  c.restore();
  line(c, [[0, 330], [0, -245]], 12, INK); line(c, [[0, 330], [0, -245]], 5, "#fff6e0");
  c.restore();
};
const t_air = (c: Ctx) => {
  ground(c, BG);
  const cx = 470, cy = 450, R = 320;
  shape(c, () => polyP(c, [[640, 700], [680, 660], [940, 900], [900, 940]]), COL.brown, 8);
  shape(c, () => ell(c, cx, cy, R, R), SKY, 0);
  c.save(); c.beginPath(); ell(c, cx, cy, R, R); c.clip();
  const r = rnd(7);
  for (let k = 0; k < 26; k++) {
    const x = cx - R * 0.85 + r() * R * 1.7, y = cy - R * 0.85 + r() * R * 1.7, a = r() * 6.28;
    if (Math.hypot(x - cx, y - cy) > R - 40) continue;
    line(c, [[x, y], [x - Math.cos(a) * 55, y - Math.sin(a) * 55]], 6, WIND);
    shape(c, () => ell(c, x, y, 20, 20), k % 2 ? COL.blue : COL.teal, 4);
  }
  c.restore();
  c.beginPath(); ell(c, cx, cy, R, R); c.lineWidth = 26; c.strokeStyle = INK; c.stroke();
  c.beginPath(); ell(c, cx, cy, R, R); c.lineWidth = 14; c.strokeStyle = COL.steel; c.stroke();
};

// ------------------------------------------------------------------ explanations
const e_four = (c: Ctx) => {
  sky(c); aero(c, 540, 540, 1.0, 0, true);
  arrow(c, [[500, 420], [500, 150]], RED, 16); arrow(c, [[560, 650], [560, 930]], RED, 16);
  arrow(c, [[770, 540], [1010, 540]], RED, 16); arrow(c, [[290, 540], [60, 540]], RED, 16);
};
const e_wing = (c: Ctx) => {
  sky(c);
  windArrow(c, [[40, 400], [330, 400], [560, 410], [800, 480], [1010, 640]]);
  windArrow(c, [[40, 690], [330, 690], [640, 700], [800, 740], [1010, 880]]);
  const w = () => { c.moveTo(280, 560); c.bezierCurveTo(320, 470, 560, 470, 800, 590); c.bezierCurveTo(560, 590, 340, 640, 280, 560); c.closePath(); };
  shape(c, w, COL.teal); shade(c, w, COL.tealDk, 0, 22, 0.7);
  arrow(c, [[540, 440], [540, 220]], RED, 16);
};
const e_kite = (c: Ctx) => {
  sky(c, 860);
  const x = 230, y = 960, h = 620;
  person(c, x, y, h, { armL: [1.7, 1.5], armR: [-0.7, -0.9] });
  const [wx, wy] = wristOf(x, y, h, 1, [-0.7, -0.9]);
  kite(c, 720, 300, 0.8, 0.45);
  patangTail(c, [[640, 480], [610, 540], [660, 600], [620, 660]]);
  c.beginPath(); c.moveTo(680, 380); c.quadraticCurveTo(480, 650, wx + 12, wy - 6); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  windArrow(c, [[40, 200], [380, 200]]); windArrow(c, [[60, 330], [320, 330]]);
};
const e_glider = (c: Ctx) => {
  sky(c, 900);
  c.setLineDash([2, 28]); line(c, [[230, 280], [880, 780]], 12, INK); c.setLineDash([]);
  planeSide(c, 560, 520, 1.25, 0.62);
  sleeve(c, 140, 250, -0.3, 1.2); hand(c, 140, 250, -0.3, 1.2, SKIN.child, CLOTH.child, true);
  arrow(c, [[700, 580], [850, 700]], RED, 14);
};
const e_seeds = (c: Ctx) => {
  sky(c);
  samara(c, 220, 700, 2.4, 0.5);
  const dx = 540, dy = 380;
  for (let k = -5; k <= 5; k++) { const a = -Math.PI / 2 + k * 0.28, ex = dx + Math.cos(a) * 190, ey = dy + 220 + Math.sin(a) * 270; line(c, [[dx, dy + 220], [ex, ey]], 4, INK); shape(c, () => ell(c, ex, ey, 9, 9), WHITE, 3); }
  line(c, [[dx, dy + 220], [dx, dy + 480]], 6);
  shape(c, () => ell(c, dx, dy + 505, 18, 36), COL.brown);
  shape(c, () => ell(c, 870, 600, 180, 180), "rgba(255,255,255,0.7)"); shade(c, () => ell(c, 870, 600, 180, 180), "#c9d7e6", 24, 24, 0.35);
  shape(c, () => ell(c, 870, 600, 34, 26), COL.brown);
};

export const ic_forcesFlightL3 = cards("sci.forces.flight.L3 cards", [
  f_e2, f_e3, f_a1, f_a2, f_a3, f_c1, f_c2, f_a6,
  t_force, t_lift, t_weight, t_thrust, t_thermal, t_tilt, t_stall, t_balance, t_kite, t_feather, t_air,
  e_four, e_wing, e_kite, e_glider, e_seeds,
]);
