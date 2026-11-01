import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, bowl, plate, hand, write, cards } from "./flatKit";

// SPINNING · set-up cards for sci.motion.spinning.L3 (the card top with coins, the spinning coin, the rolling race)

const CARD = "#cf9f62", CARDDK = "#a97b45", TAPE = "rgba(255,228,120,0.62)";
const NONE = "rgba(255,255,255,0)";

// a coin seen from above: steel disc, ring, a "1"
const coinTop = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.18, r, r);
  shape(c, () => ell(c, x, y, r, r), COL.steel, 6);
  shade(c, () => ell(c, x, y, r, r), COL.steelDk, -r * 0.22, -r * 0.22, 0.6);
  shape(c, () => ell(c, x, y, r, r), NONE, 6);
  shape(c, () => ell(c, x, y, r * 0.74, r * 0.74), NONE, 3.5);
  write(c, "1", x - r * 0.4 * 0.5 - r * 0.08, y - r * 0.33, r * 0.66, INK, 5);
};
// a coin lying flat seen from the front and above
const coinLying = (c: Ctx, x: number, y: number, rx: number) => {
  const ry = rx * 0.42, t = rx * 0.14;
  shadow(c, x + rx * 0.2, y + t + ry * 0.35, rx * 1.05, ry * 0.8);
  shape(c, () => { c.moveTo(x - rx, y); c.lineTo(x - rx, y + t); c.ellipse(x, y + t, rx, ry, 0, Math.PI, 0, true); c.lineTo(x + rx, y); c.closePath(); }, COL.steelDk, 5);
  shape(c, () => ell(c, x, y, rx, ry), COL.steel, 5);
  shape(c, () => ell(c, x, y, rx * 0.72, ry * 0.72), NONE, 3);
};
// the card disc seen from above with four coins taped on, same on both top-view cards
const discTop = (c: Ctx, dist: number, coinR: number) => {
  const cx = 540, cy = 540, R = 340;
  shadow(c, cx + 24, cy + 34, R, R * 0.98);
  shape(c, () => ell(c, cx, cy, R, R), CARD, 7);
  shade(c, () => ell(c, cx, cy, R, R), CARDDK, -R * 0.1, -R * 0.1, 0.5);
  shape(c, () => ell(c, cx, cy, R, R), NONE, 7);
  const angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
  angles.forEach((a) => coinTop(c, cx + Math.cos(a) * dist, cy + Math.sin(a) * dist, coinR));
  angles.forEach((a) => {
    c.save(); c.translate(cx + Math.cos(a) * dist, cy + Math.sin(a) * dist); c.rotate(a);
    shape(c, () => rrect(c, -8, -24, coinR + 38, 48, 4), TAPE, 3.5);
    c.restore();
  });
  // the pencil, end on: pink rubber in a steel band
  shape(c, () => ell(c, cx, cy, 30, 30), COL.steel, 5);
  shape(c, () => ell(c, cx, cy, 20, 20), COL.pink, 4);
};
// a yellow pencil, upright: body from y0 to y1, rubber on top when withRubber
const pencilBody = (c: Ctx, x: number, y0: number, y1: number, withRubber: boolean) => {
  if (withRubber) {
    shape(c, () => rrect(c, x - 20, y0, 40, 40, 12), COL.pink, 6);
    shape(c, () => rect(c, x - 20, y0 + 36, 40, 26), COL.steel, 5);
  }
  const top = withRubber ? y0 + 62 : y0;
  shape(c, () => rect(c, x - 20, top, 40, y1 - top), COL.yellow, 6);
  shade(c, () => rect(c, x - 20, top, 40, y1 - top), COL.orange, -13, 0, 0.65);
  shape(c, () => rect(c, x - 20, top, 40, y1 - top), NONE, 6);
};
const pencilTip = (c: Ctx, x: number, y0: number, y1: number) => {
  shape(c, () => polyP(c, [[x - 20, y0], [x + 20, y0], [x, y1]]), "#f4dcae", 6);
  shape(c, () => polyP(c, [[x - 7, y1 - 24], [x + 7, y1 - 24], [x, y1]]), COL.black, 4);
};
const rect = (c: Ctx, x: number, y: number, w: number, h: number) => { c.rect(x, y, w, h); };

// the stopwatch face on a phone
const phone = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.55, y + h + 6, w * 0.65, 18);
  shape(c, () => rrect(c, x, y, w, h, 30), COL.black, 7);
  shape(c, () => rrect(c, x + 14, y + 22, w - 28, h - 44, 12), "#e9f3ff", 4);
  const sx = x + w / 2, sy = y + h * 0.5, r = w * 0.34;
  shape(c, () => rrect(c, sx - 14, sy - r - 26, 28, 20, 6), COL.red, 4);
  shape(c, () => ell(c, sx, sy, r, r), WHITE, 6);
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[sx + Math.cos(a) * r * 0.78, sy + Math.sin(a) * r * 0.78], [sx + Math.cos(a) * r * 0.92, sy + Math.sin(a) * r * 0.92]], 4); }
  line(c, [[sx, sy], [sx + r * 0.5, sy - r * 0.55]], 7, RED);
  shape(c, () => ell(c, sx, sy, 8, 8), INK, 0);
  shape(c, () => rrect(c, sx - r, sy + r + 28, r * 2, 40, 14), COL.green, 4);
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  const px = 540, dy = 600;
  // the pencil's sharp end below the card
  pencilBody(c, px, 590, 770, false); pencilTip(c, px, 770, 850);
  // the card circle, a thick round of cardboard seen from a little above
  shadow(c, px + 30, dy + 90, 290, 70);
  shape(c, () => { c.moveTo(px - 280, dy); c.lineTo(px - 280, dy + 24); c.ellipse(px, dy + 24, 280, 105, 0, Math.PI, 0, true); c.lineTo(px + 280, dy); c.closePath(); }, CARDDK, 6);
  shape(c, () => ell(c, px, dy, 280, 105), CARD, 6);
  shade(c, () => ell(c, px, dy, 280, 105), CARDDK, -40, -14, 0.45);
  shape(c, () => ell(c, px, dy, 280, 105), NONE, 6);
  shape(c, () => ell(c, px, dy, 30, 11), COL.black, 0);
  pencilBody(c, px, 250, dy, true);
  // katori and scissors beside
  bowl(c, 165, 880, 100);
  c.save(); c.translate(880, 890); c.rotate(-0.35);
  shadow(c, 20, 36, 160, 26);
  shape(c, () => polyP(c, [[0, 0], [180, -20], [188, -10], [10, 16]]), COL.steel, 5);
  shape(c, () => polyP(c, [[0, 0], [180, 20], [188, 10], [10, -16]]), COL.steelDk, 5);
  [-1, 1].forEach((s) => { line(c, [[-30, s * 26], [4, s * 6]], 12); line(c, [[-30, s * 26], [4, s * 6]], 6, COL.orange); shape(c, () => ell(c, -62, s * 36, 40, 30), COL.orange, 6); shape(c, () => ell(c, -62, s * 36, 20, 14), "#efe4cf", 5); });
  c.restore();
  // the child's hand holds the pencil and pushes it down through the middle
  hand(c, px - 105, 400, 0, 1.5);
  arrow(c, [[670, 250], [670, 460]]);
};

// setup.e1.1
const e1_1 = (c: Ctx) => { ground(c); discTop(c, 235, 68); };

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  const cx = 400, cy = 560;
  plate(c, cx, 790, 330, 120);
  pencilBody(c, cx, 570, 730, false); pencilTip(c, cx, 730, 790);
  shape(c, () => { c.moveTo(cx - 210, cy); c.lineTo(cx - 210, cy + 22); c.ellipse(cx, cy + 22, 210, 52, 0, Math.PI, 0, true); c.lineTo(cx + 210, cy); c.closePath(); }, CARDDK, 6);
  shape(c, () => ell(c, cx, cy, 210, 52), CARD, 6);
  const coinOn = (x: number, y: number) => { shape(c, () => { c.moveTo(x - 42, y); c.lineTo(x - 42, y + 8); c.ellipse(x, y + 8, 42, 14, 0, Math.PI, 0, true); c.lineTo(x + 42, y); c.closePath(); }, COL.steelDk, 4); shape(c, () => ell(c, x, y, 42, 14), COL.steel, 4); };
  coinOn(cx, cy - 36); coinOn(cx - 150, cy); coinOn(cx + 150, cy);
  pencilBody(c, cx, 330, cy, true);
  coinOn(cx, cy + 38);
  arrow(c, Array.from({ length: 12 }, (_, i) => { const t = (150 - i * 12) * Math.PI / 180; return [cx + Math.cos(t) * 270, 600 + Math.sin(t) * 85]; }));
  phone(c, 770, 280, 220, 440);
  shape(c, () => rrect(c, 750, 700, 260, 60, 16), COL.teal, 6);
};

// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  discTop(c, 92, 58);
  [-Math.PI / 2, 0, Math.PI / 2, Math.PI].forEach((a) => arrow(c, [[540 + Math.cos(a) * 310, 540 + Math.sin(a) * 310], [540 + Math.cos(a) * 205, 540 + Math.sin(a) * 205]]));
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  plate(c, 520, 700, 430, 110);
  // the coin standing on its edge
  shadow(c, 560, 700, 100, 24);
  shape(c, () => ell(c, 524, 520, 86, 170), COL.steelDk, 6);
  shape(c, () => ell(c, 500, 520, 86, 170), COL.steel, 6);
  shape(c, () => ell(c, 500, 520, 62, 128), NONE, 4);
  write(c, "1", 480, 460, 120, INK, 8);
  // the left hand holds it from the top with one finger
  hand(c, 380, 215, 0.78, 2.1, undefined, undefined, true);
  // the right hand flicks the side
  hand(c, 750, 540, Math.PI, 1.7);
  arrow(c, [[800, 420], [660, 420]]);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  // steel plate
  plate(c, 290, 300, 210, 100);
  coinLying(c, 290, 295, 66);
  // tiled floor
  const P = (u: number, v: number) => [610 + 375 * u - 35 * v + 0 * u * v + 35 * u * v - 0, 215 + 180 * v];
  const Q = (u: number, v: number): number[] => { const a = [610, 215], b = [985, 215], d = [575, 395], e = [1015, 395]; return [(a[0] * (1 - u) + b[0] * u) * (1 - v) + (d[0] * (1 - u) + e[0] * u) * v, a[1] * (1 - v) + d[1] * v]; };
  void P;
  shadow(c, 810, 410, 220, 28);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) shape(c, () => polyP(c, [Q(i / 4, j / 3), Q((i + 1) / 4, j / 3), Q((i + 1) / 4, (j + 1) / 3), Q(i / 4, (j + 1) / 3)]), (i + j) % 2 ? "#cfe0e0" : "#f1e8d2", 4);
  coinLying(c, 800, 305, 66);
  // newspaper
  c.save(); c.translate(290, 770); c.rotate(-0.07);
  shadow(c, 14, 150, 200, 24);
  shape(c, () => rect(c, -190, -140, 380, 280), WHITE, 6);
  shape(c, () => rect(c, -165, -118, 330, 34), "#4a4560", 0);
  shape(c, () => rect(c, -165, -68, 120, 90), COL.grey, 3);
  for (let k = 0; k < 4; k++) { line(c, [[-20, -58 + k * 24], [165, -58 + k * 24]], 6, COL.grey); line(c, [[-165, 46 + k * 24], [-30 + (k % 2) * 40, 46 + k * 24]], 6, COL.grey); line(c, [[10, 46 + k * 24], [165, 46 + k * 24]], 6, COL.grey); }
  c.restore();
  coinLying(c, 290, 770, 66);
  // folded towel
  shadow(c, 800, 840, 210, 26);
  shape(c, () => rrect(c, 610, 770, 380, 58, 20), COL.tealDk, 6);
  shape(c, () => rrect(c, 610, 660, 380, 140, 30), COL.teal, 6);
  line(c, [[640, 690], [960, 690]], 8, WHITE); line(c, [[640, 770], [960, 770]], 8, WHITE);
  for (let k = 0; k < 7; k++) line(c, [[975, 676 + k * 18], [1005, 676 + k * 18]], 5, COL.tealDk);
  coinLying(c, 790, 730, 66);
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e2d3b3"; c.fillRect(0, 690, 1080, 390);
  line(c, [[0, 690], [1080, 690]], 6);
  // books holding up the high end
  [["#5b8fd6", 460], ["#e4523b", 537], ["#6aa53f", 614]].forEach(([col, y]) => { shape(c, () => rrect(c, 120, y as number, 200, 77, 8), col as string, 6); line(c, [[132, (y as number) + 56], [308, (y as number) + 56]], 5, WHITE); });
  c.save(); c.translate(520, 540); c.rotate(0.26);
  // tray: top face and front lip
  shape(c, () => polyP(c, [[-420, 0], [420, 0], [490, -130], [-350, -130]]), COL.steelIn, 6);
  shape(c, () => polyP(c, [[-420, 0], [420, 0], [420, 44], [-420, 44]]), COL.steel, 6);
  shade(c, () => polyP(c, [[-420, 0], [420, 0], [420, 44], [-420, 44]]), COL.steelDk, 0, -14, 0.6);
  // a cylinder seen from the front and a little from the side: its end face is a circle
  const roll = (x: number, r: number, depth: number, body: string, bodyDk: string, front: () => void) => {
    const y = -r - 18, vx = depth * 0.5, vy = -depth * 0.3, ln = Math.hypot(vx, vy), nx = -vy / ln, ny = vx / ln;
    shadow(c, x + vx / 2 + 14, -14 + vy / 2, r + depth * 0.4, 14 + depth * 0.1);
    shape(c, () => ell(c, x + vx, y + vy, r, r), bodyDk, 6);
    shape(c, () => polyP(c, [[x + nx * r, y + ny * r], [x + vx + nx * r, y + vy + ny * r], [x + vx - nx * r, y + vy - ny * r], [x - nx * r, y - ny * r]]), body, 6);
    shape(c, () => ell(c, x, y, r, r), body, 6);
    front();
    return [x, y];
  };
  // tape roll: tan ring with an empty middle; battery (further down): longer, with the nub
  // finish line at the low end: a dark band across the tray
  shape(c, () => polyP(c, [[350, 0], [405, 0], [475, -130], [420, -130]]), INK, 0);
  shape(c, () => polyP(c, [[372, -28], [405, -28], [412, -42], [379, -42]]), WHITE, 0);
  shape(c, () => polyP(c, [[394, -70], [427, -70], [434, -84], [401, -84]]), WHITE, 0);
  // tape roll: tan ring with an empty middle, still high up the slope; battery (the same start, now far ahead): longer, with the nub
  roll(-170, 90, 80, COL.yellow, COL.orange, () => { shape(c, () => ell(c, -170, -108, 42, 42), "#efe4cf", 6); shape(c, () => ell(c, -170, -108, 50, 50), NONE, 3); });
  roll(215, 52, 170, COL.red, "#b8301f", () => { shape(c, () => ell(c, 215, -70, 52, 52), COL.steel, 6); shape(c, () => ell(c, 215, -70, 17, 17), COL.steelDk, 5); });
  // speed lines behind each, long behind the battery, and the arrow down the slope
  [[-360, -120], [-350, -80]].forEach(([x, y]) => line(c, [[x, y], [x + 70, y]], 6, COL.grey));
  [[-60, -100], [-30, -60], [0, -20]].forEach(([x, y]) => line(c, [[x, y], [x + 110, y]], 6, COL.grey));
  arrow(c, [[-200, -300], [240, -300]]);
  c.restore();
};

export const su_motionSpinning = cards("sci.motion.spinning.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e3_1]);
