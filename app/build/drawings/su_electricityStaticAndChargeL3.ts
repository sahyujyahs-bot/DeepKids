import type { Ctx } from "./core";
import { COL, INK, BG, RED, WHITE, SKIN, CLOTH, ground, shape, shade, shadow, line, shine, arrow, write, hand, ell, rrect, polyP, rnd, cards } from "./flatKit";

// ELECTRICITY · STATIC AND CHARGE L3 · set-up cards: paper bits under a balloon, rubbing a balloon,
// the thin water stream and a comb / spoon beside it.

// a balloon; knot on the bottom (dir 1) or on the top (dir -1)
const balloon = (c: Ctx, x: number, y: number, rx: number, ry: number, col: string, dk: string, dir = 1) => {
  const body = () => ell(c, x, y, rx, ry);
  const kn = () => polyP(c, [[x, y + dir * ry - dir * 4], [x - 24, y + dir * (ry + 34)], [x + 24, y + dir * (ry + 34)]]);
  shape(c, kn, dk, 5);
  shape(c, body, col, 6);
  shade(c, body, dk, rx * 0.18, ry * 0.12, 0.5);
  shape(c, () => ell(c, x, y + dir * (ry + 36), 28, 9), dk, 5);
  shine(c, [[x - rx * 0.6, y - ry * 0.35], [x - rx * 0.4, y - ry * 0.65]], 12);
};

// ---- e1.0: paper bits on a dark plate, a balloon held just above, nothing moving
const e1_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 905, 400, 60);
  shape(c, () => ell(c, 540, 840, 400, 120), "#4a4458");
  shape(c, () => ell(c, 540, 830, 340, 92), "#322d42", 4);
  const r = rnd(7);
  for (let i = 0; i < 26; i++) {
    const a = r() * 6.28, d = Math.sqrt(r()), x = 540 + Math.cos(a) * d * 220, y = 840 + Math.sin(a) * d * 48, s = 15 + r() * 8, t = r() * 3;
    shape(c, () => polyP(c, [[x - s + Math.cos(t) * 4, y - s * 0.6], [x + s, y - s * 0.7 + Math.sin(t) * 5], [x + s * 0.8, y + s * 0.6], [x - s * 0.9, y + s * 0.8]]), WHITE, 3.5);
  }
  balloon(c, 540, 330, 190, 235, COL.pink, "#d4607f");
  hand(c, 540 + 70 * 1.5, 640, Math.PI, 1.5);
  arrow(c, [[190, 330], [190, 600]]);
};

// ---- e1.1: rubbing one side of a balloon on a woollen sweater; towel, newspaper, spare balloon beside
const e1_1 = (c: Ctx) => {
  ground(c);
  // sweater: red wool with ribbed neck, cuffs and knit lines
  shadow(c, 330, 925, 300, 36);
  const body = () => rrect(c, 60, 470, 520, 440, 36);
  shape(c, body, COL.red, 6);
  c.save(); c.beginPath(); body(); c.clip();
  for (let x = 74; x < 580; x += 26) line(c, [[x, 480], [x, 900]], 4, "#c23d2a");
  c.restore();
  shape(c, () => rrect(c, 60, 470, 520, 56, 28), "#c23d2a", 6);
  shape(c, () => rrect(c, 60, 860, 520, 50, 25), "#c23d2a", 6);
  // the balloon pressed on the sweater, held by the knot from above
  balloon(c, 320, 630, 120, 150, COL.blue, COL.blueDk, -1);
  hand(c, 320, 345, Math.PI / 2, 1.3);
  arrow(c, [[300, 990], [120, 990]]);
  arrow(c, [[340, 990], [520, 990]]);
  write(c, "10", 285, 802, 50, WHITE, 9);
  // towel, newspaper, second balloon in a row
  const tw = () => rrect(c, 650, 150, 340, 210, 16);
  shadow(c, 830, 380, 180, 18);
  shape(c, tw, COL.teal, 6);
  shape(c, () => rrect(c, 650, 205, 340, 36, 0), COL.cloth, 0); shape(c, () => rrect(c, 650, 280, 340, 36, 0), COL.cloth, 0);
  shape(c, tw, "rgba(0,0,0,0)", 6);
  for (let x = 666; x < 985; x += 16) { line(c, [[x, 150], [x, 128]], 4); line(c, [[x, 360], [x, 382]], 4); }
  c.save(); c.translate(820, 520); c.rotate(-0.04);
  shape(c, () => rrect(c, -170, -70, 340, 160, 8), "#f3efe4", 6);
  shape(c, () => rrect(c, -150, -52, 300, 30, 4), COL.greyDk, 0);
  [-8, 18, 44, 70].forEach((y) => line(c, [[-150, y], [-10, y]], 6, COL.grey));
  shape(c, () => rrect(c, 20, -8, 130, 84, 4), COL.grey, 4);
  c.restore();
  shadow(c, 830, 925, 150, 22);
  balloon(c, 830, 790, 105, 130, COL.pink, "#d4607f");
};

// ---- the tap, the sink and the stream (shared by the three water cards)
const tapScene = (c: Ctx, sx: (y: number) => number, land: number) => {
  ground(c, "#d6ebf0");
  c.fillStyle = BG; c.fillRect(0, 720, 1080, 360);
  line(c, [[0, 720], [1080, 720]], 6);
  // sink
  shadow(c, 560, 1000, 480, 50);
  shape(c, () => ell(c, 540, 890, 480, 120), COL.steelDk);
  shape(c, () => ell(c, 540, 880, 410, 90), COL.steelIn, 5);
  // tap from the wall
  shape(c, () => rrect(c, 60, 80, 50, 190, 14), COL.steelDk);
  shape(c, () => rrect(c, 100, 120, 340, 74, 30), COL.steel);
  shade(c, () => rrect(c, 100, 120, 340, 74, 30), COL.steelDk, 0, 18, 0.5);
  shape(c, () => rrect(c, 365, 170, 80, 62, 14), COL.steelDk);
  // the stream
  const pts: number[][] = []; for (let y = 232; y <= 868; y += 12) pts.push([sx(y), y]);
  line(c, pts, 22, INK); line(c, pts, 13, COL.water);
  shape(c, () => ell(c, land, 868, 62, 15), COL.drop, 4);
  shape(c, () => ell(c, land, 868, 28, 7), COL.water, 3);
};
const straight = () => 405;
const bent = (y: number) => { const d = Math.min(1, Math.max(0, (y - 340) / 480)); return 405 + 120 * d * d * (3 - 2 * d); };

// ---- e2.0: a thin smooth stream into the sink
const e2_0 = (c: Ctx) => { tapScene(c, straight, 405); };

// ---- e2.1: a comb held beside the stream, the stream curving to it
const e2_1 = (c: Ctx) => {
  tapScene(c, bent, 525);
  const xs = 640;
  shape(c, () => rrect(c, xs - 24, 330, 48, 300, 14), COL.blue);
  shade(c, () => rrect(c, xs - 24, 330, 48, 300, 14), COL.blueDk, 10, 0, 0.5);
  for (let y = 346; y < 625; y += 22) shape(c, () => rrect(c, xs - 96, y, 74, 12, 5), COL.blue, 4);
  hand(c, xs + 70 * 1.5, 480, Math.PI, 1.5);
  arrow(c, [[850, 300], [700, 300]]);
};

// ---- e2.2: a steel spoon held beside the stream, the stream falling straight
const e2_2 = (c: Ctx) => {
  tapScene(c, straight, 405);
  const xs = 620;
  shape(c, () => rrect(c, xs - 14, 300, 28, 270, 12), COL.steel);
  shape(c, () => ell(c, xs, 640, 70, 100), COL.steel);
  shape(c, () => ell(c, xs, 640, 48, 76), COL.steelIn, 4);
  shine(c, [[xs - 50, 600], [xs - 40, 680]], 8);
  hand(c, xs + 70 * 1.5, 440, Math.PI, 1.5);
  arrow(c, [[850, 300], [700, 300]]);
};

export const su_electricityStaticAndChargeL3 = cards("sci.electricity.static-and-charge.L3 set-up", [e1_0, e1_1, e2_0, e2_1, e2_2]);
