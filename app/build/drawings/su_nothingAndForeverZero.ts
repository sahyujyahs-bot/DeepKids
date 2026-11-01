import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, rrect, shadow, shade, line, shine, arrow, hand, write, cards } from "./flatKit";

// SET-UP CARDS · sci.nothing-and-forever.zero.L3 · e1 the missing zero test, e2 where the ruler starts.

const PEN = "#3a3540", PAPER = "#fffdf6", PAPERDK = "#e6dcc4";
const TICK = "#3f9a3a";

// a paper chit centred at (cx, cy), tilted by rot; draws its own shadow and shade side, then runs `inside`
// in the chit's own coordinates (0,0 = centre)
const chit = (c: Ctx, cx: number, cy: number, w: number, h: number, rot: number, inside?: () => void) => {
  c.save(); c.translate(cx, cy); c.rotate(rot);
  shadow(c, w * 0.04, h * 0.5 + 6, w * 0.52, h * 0.1);
  const p = () => rrect(c, -w / 2, -h / 2, w, h, 10);
  shape(c, p, PAPER, 6); shade(c, p, PAPERDK, w * 0.04, h * 0.05, 0.7);
  c.save(); c.beginPath(); p(); c.clip(); c.beginPath(); c.rect(-w / 2, -h / 2, w, h); c.restore();
  shape(c, p, "rgba(0,0,0,0)", 6);
  if (inside) inside();
  c.restore();
};
// a number written with a gap of one digit where a "_" stands; x is the left edge, y the top
const numLine = (c: Ctx, s: string, x: number, y: number, h: number, col = INK, w = Math.max(5, h * 0.07)) => {
  [...s].forEach((ch, i) => { if (ch !== "_") write(c, ch, x + i * h * 0.8, y, h, col, w); });
};
const numWidth = (s: string, h: number) => (s.length - 1) * h * 0.8 + h * 0.6;
// a number centred on (0,0) in the chit's coordinates
const centred = (c: Ctx, s: string, h: number, col = INK) => numLine(c, s, -numWidth(s, h) / 2, -h / 2, h, col);

const chitNum = (c: Ctx, s: string, cx: number, cy: number, w: number, h: number, rot: number, dh: number) =>
  chit(c, cx, cy, w, h, rot, () => centred(c, s, dh));

// a pen lying on the table, tip to the left
const penFlat = (c: Ctx, x: number, y: number, len: number) => {
  shadow(c, x + len / 2 + 8, y + 26, len / 2, 10);
  const body = () => rrect(c, x + 36, y - 18, len - 36, 36, 16);
  shape(c, body, COL.blue, 6); shade(c, body, COL.blueDk, 0, 12, 0.6);
  shape(c, () => { c.moveTo(x + 36, y - 18); c.lineTo(x, y); c.lineTo(x + 36, y + 18); c.closePath(); }, PEN, 6);
  shape(c, () => rrect(c, x + len - 34, y - 14, 34, 28, 10), COL.steel, 5);
};

// ---------------------------------------------------------------- e1 · The missing zero test
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  const small = ["3_4", "6_", "9_5", "7__", "4_8"];
  small.forEach((s, i) => chitNum(c, s, 130 + i * 205, 130, 190, 130, (i % 2 ? 0.03 : -0.03), 62));
  // the big chit: 52 then an empty gap
  chit(c, 480, 590, 640, 400, -0.02, () => {
    numLine(c, "52", -260, -10, 180);
  });
  // the hand writing, pen tip at the end of the 2
  const dir = [Math.cos(Math.PI * 0.62), Math.sin(Math.PI * 0.62)], tip = [475, 733], s = 1.4;
  const grip = [tip[0] - dir[0] * 150, tip[1] - dir[1] * 150];
  const back = [tip[0] - dir[0] * 470, tip[1] - dir[1] * 470];
  line(c, [back, tip], 34, INK); line(c, [back, tip], 22, COL.blue);
  shape(c, () => { c.moveTo(tip[0] + dir[1] * 11 + dir[0] * 28, tip[1] - dir[0] * 11 + dir[1] * 28); c.lineTo(tip[0], tip[1]); c.lineTo(tip[0] - dir[1] * 11 + dir[0] * 28, tip[1] + dir[0] * 11 + dir[1] * 28); c.closePath(); }, PEN, 4);
  hand(c, grip[0] - dir[0] * 70 * s, grip[1] - dir[1] * 70 * s, Math.PI * 0.62, s);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  const n = ["205", "610", "80", "803", "400", "607"], rot = [-0.03, 0.025, -0.02, 0.03, -0.025, 0.02];
  n.forEach((s, i) => chitNum(c, s, 200 + (i % 3) * 340, 300 + Math.floor(i / 3) * 330, 300, 230, rot[i], 120));
  penFlat(c, 300, 930, 480);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  // the reader: a big friendly face, mouth open, shoulders below, a chit held up by a hand
  const sh = () => rrect(c, 60, 400, 360, 220, 60);
  shape(c, sh, CLOTH.adult); shade(c, sh, CLOTH.adultDk, 40, 0, 0.55);
  shape(c, () => rrect(c, 205, 330, 70, 90, 20), SKIN.adult);
  shape(c, () => ell(c, 240, 230, 128, 138), SKIN.adult);
  shape(c, () => { c.moveTo(112, 220); c.bezierCurveTo(100, 60, 380, 60, 368, 220); c.quadraticCurveTo(240, 140, 112, 220); c.closePath(); }, CLOTH.hair, 6);
  shape(c, () => ell(c, 195, 245, 11, 16), INK, 0); shape(c, () => ell(c, 285, 245, 11, 16), INK, 0);
  shape(c, () => ell(c, 240, 318, 32, 24), INK, 5); shape(c, () => ell(c, 240, 328, 18, 10), COL.red, 0);
  // speech bubble saying what the reader sees on the chit
  shape(c, () => { c.moveTo(398, 270); c.lineTo(470, 235); c.lineTo(485, 290); c.closePath(); }, WHITE, 6);
  shape(c, () => ell(c, 700, 215, 215, 110), WHITE, 6);
  shape(c, () => { c.moveTo(405, 268); c.lineTo(470, 238); c.lineTo(482, 280); c.closePath(); }, WHITE, 0);
  write(c, "52", 618, 150, 130, INK, 12);
  // the chit in a hand
  chit(c, 360, 760, 330, 230, -0.04, () => numLine(c, "52_", -numWidth("52_", 100) / 2, -50, 100));
  hand(c, 110, 770, 0, 1.5, SKIN.adult, CLOTH.adult);
  // the girl writes in a table in her notebook
  chit(c, 790, 750, 440, 330, 0.02, () => {
    shape(c, () => rrect(c, -220, -165, 440, 70, 8), COL.sky, 5);
    line(c, [[-220, -20], [220, -20]], 5); line(c, [[-220, 70], [220, 70]], 5); line(c, [[-60, -165], [-60, 165]], 5);
    write(c, "52", -190, -75, 36, INK, 5);
  });
  const dir = [Math.cos(Math.PI * 0.62), Math.sin(Math.PI * 0.62)], tip = [770, 700], s = 1.5, grip = [tip[0] - dir[0] * 150, tip[1] - dir[1] * 150];
  const back = [tip[0] - dir[0] * 420, tip[1] - dir[1] * 420];
  line(c, [back, tip], 30, INK); line(c, [back, tip], 18, COL.yellow);
  shape(c, () => { c.moveTo(tip[0] + dir[1] * 10 + dir[0] * 28, tip[1] - dir[0] * 10 + dir[1] * 28); c.lineTo(tip[0], tip[1]); c.lineTo(tip[0] - dir[1] * 10 + dir[0] * 28, tip[1] + dir[0] * 10 + dir[1] * 28); c.closePath(); }, PEN, 4);
  hand(c, grip[0] - dir[0] * 70 * s, grip[1] - dir[1] * 70 * s, Math.PI * 0.62, s);
};

// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  const nums = ["304", "520", "60", "905", "700", "408"];
  nums.forEach((s, i) => {
    const cx = 175 + (i % 2) * 250, cy = 280 + Math.floor(i / 2) * 260;
    chit(c, cx, cy, 230, 170, ((i * 7) % 5 - 2) * 0.015, () => numLine(c, s, -numWidth(s, 46) / 2, -23, 46, COL.greyDk, 5));
  });
  // the notebook table
  shadow(c, 810, 905, 270, 28);
  shape(c, () => rrect(c, 560, 150, 480, 740, 14), PAPER, 6);
  shade(c, () => rrect(c, 560, 150, 480, 740, 14), PAPERDK, 14, 14, 0.7);
  shape(c, () => rrect(c, 560, 150, 480, 740, 14), "rgba(0,0,0,0)", 6);
  for (let k = 0; k < 7; k++) shape(c, () => ell(c, 560, 200 + k * 100, 14, 14), COL.steelDk, 4);
  shape(c, () => rrect(c, 600, 190, 410, 90, 4), COL.sky, 5);
  for (let r = 0; r < 7; r++) line(c, [[600, 190 + r * 95], [1010, 190 + r * 95]], 4);
  line(c, [[600, 190 + 7 * 95 - 95 + 95], [1010, 190 + 7 * 95 - 95 + 95]], 4);
  [600, 736, 872, 1010].forEach((x) => line(c, [[x, 190], [x, 190 + 7 * 95 - 0]], 4));
  const pat = ["101", "000", "001", "110", "010", "111"];
  pat.forEach((row, r) => [...row].forEach((v, k) => {
    const x = 668 + k * 136, y = 237 + (r + 1) * 95 + 0;
    if (v === "1") line(c, [[x - 28, y], [x - 6, y + 24], [x + 32, y - 28]], 12, TICK);
    else { line(c, [[x - 24, y - 24], [x + 24, y + 24]], 12, RED); line(c, [[x + 24, y - 24], [x - 24, y + 24]], 12, RED); }
  }));
  [0, 1, 2].forEach((k) => { const x = 668 + k * 136; shape(c, () => ell(c, x, 237, 26, 28), SKIN.child, 5); shape(c, () => { c.moveTo(x - 27, 232); c.bezierCurveTo(x - 27, 200, x + 27, 200, x + 27, 232); c.quadraticCurveTo(x, 218, x - 27, 232); c.closePath(); }, CLOTH.hair, 4); });
};

// ---------------------------------------------------------------- e2 · Where does the ruler start?
// a clear plastic school ruler: left edge at x0, the 0 mark at zeroX, n whole cm, top edge at y
const ruler = (c: Ctx, x0: number, zeroX: number, y: number, h: number, cm: number, n: number, strip: boolean, numH: number) => {
  const x1 = zeroX + n * cm + 40, tk = cm / 100;
  shadow(c, (x0 + x1) / 2 + 10, y + h + 14, (x1 - x0) / 2, 18);
  const body = () => rrect(c, x0, y, x1 - x0, h, 18);
  shape(c, body, COL.sky, 6); shade(c, body, COL.glassEdge, 0, h * 0.2, 0.35);
  if (strip) shape(c, () => { c.moveTo(x0 + 18, y); c.lineTo(zeroX, y); c.lineTo(zeroX, y + h); c.lineTo(x0 + 18, y + h); c.arcTo(x0, y + h, x0, y + h - 18, 18); c.lineTo(x0, y + 18); c.arcTo(x0, y, x0 + 18, y, 18); c.closePath(); }, COL.yellow, 5);
  for (let mm = 0; mm <= n * 10; mm++) {
    const x = zeroX + mm * cm / 10, L = (mm % 10 === 0 ? 70 : mm % 5 === 0 ? 48 : 30) * tk * 1.2;
    line(c, [[x, y], [x, y + L]], mm % 10 === 0 ? 6 : 3.5);
  }
  for (let k = 0; k <= n; k++) write(c, String(k), zeroX + k * cm - numH * 0.3, y + 82 * tk * 1.2, numH, INK, Math.max(5, numH * 0.11));
  shine(c, [[x0 + 40, y + h - 14], [x1 - 60, y + h - 14]], 6);
};
// a pencil lying along x, rubber end at x, tip at x+len, centre line y
const pencil = (c: Ctx, x: number, y: number, len: number, t = 54) => {
  const bodyEnd = x + len - 90;
  shadow(c, x + len / 2 + 6, y + t / 2 + 8, len / 2, 8);
  shape(c, () => rrect(c, x, y - t / 2, 54, t, 12), COL.pink, 6);
  shape(c, () => rrect(c, x + 54, y - t / 2, 44, t, 3), COL.steel, 5);
  [-0.35, 0, 0.35].forEach((k) => line(c, [[x + 56, y + k * t], [x + 96, y + k * t]], 3, COL.steelDk));
  const b = () => rect4(c, x + 98, y - t / 2, bodyEnd - x - 98, t);
  shape(c, b, COL.yellow, 6); shade(c, b, COL.orange, 0, t * 0.22, 0.6);
  line(c, [[x + 100, y - t * 0.1], [bodyEnd, y - t * 0.1]], 3, COL.woodDk);
  shape(c, () => { c.moveTo(bodyEnd, y - t / 2); c.lineTo(x + len, y); c.lineTo(bodyEnd, y + t / 2); c.closePath(); }, COL.wood, 6);
  shape(c, () => { c.moveTo(x + len - 30, y - t * 0.17); c.lineTo(x + len, y); c.lineTo(x + len - 30, y + t * 0.17); c.closePath(); }, PEN, 4);
};
const rect4 = (c: Ctx, x: number, y: number, w: number, h: number) => { c.moveTo(x, y); c.lineTo(x + w, y); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.closePath(); };

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  ruler(c, 70, 190, 430, 320, 120, 7, true, 76);
  arrow(c, [[130, 190], [130, 400]], RED, 12);
};

// the pencil and ruler used on both measuring cards
const measureScene = (c: Ctx, px: number) => {
  ground(c);
  ruler(c, 90, 170, 540, 230, 100, 8, true, 52);
  pencil(c, px, 510, 650, 56);
  // a thin red line from the pencil's tip down through the ruler's marks
  const tipX = px + 650;
  line(c, [[tipX, 540], [tipX, 660]], 6, RED);
  hand(c, tipX + 90, 290, Math.PI * 0.64, 1.7, SKIN.child, CLOTH.child, true);
};
// setup.e2.1
const e2_1 = (c: Ctx) => { measureScene(c, 90); };
// setup.e2.2
const e2_2 = (c: Ctx) => { measureScene(c, 170); };

export const su_nothingAndForeverZero = cards("sci.nothing-and-forever.zero.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2]);
