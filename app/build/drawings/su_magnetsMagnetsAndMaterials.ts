import type { Ctx } from "./core";
import { COL, INK, BG, WHITE, ground, shape, shade, shadow, rrect, line, arrow, hand, cards } from "./flatKit";

// a bar magnet standing upright: red half on top, blue half below; top-left corner (x, y), width w, length len
const barMagnet = (c: Ctx, x: number, y: number, w: number, len: number) => {
  const half = len / 2;
  shape(c, () => rrect(c, x, y, w, half + 10, 14), COL.red);
  shape(c, () => rrect(c, x, y + half - 10, w, half + 10, 14), COL.blue);
  shape(c, () => rrect(c, x, y, w, half, 14), COL.red);
  shade(c, () => rrect(c, x, y, w, half, 14), "#a8321f", w * 0.3, 0, 0.45);
  shape(c, () => rrect(c, x, y + half, w, half, 14), COL.blue);
  shade(c, () => rrect(c, x, y + half, w, half, 14), COL.blueDk, w * 0.3, 0, 0.5);
  line(c, [[x + w * 0.2, y + 22], [x + w * 0.2, y + half - 22]], 8, WHITE);
};

// a paper clip hanging with its top at (x, y)
const paperClip = (c: Ctx, x: number, y: number) => {
  const loops = () => {
    c.beginPath(); rrect(c, x - 42, y, 84, 170, 38);
    rrect(c, x - 22, y + 36, 44, 146, 22);
  };
  loops(); c.strokeStyle = INK; c.lineWidth = 24; c.lineJoin = "round"; c.stroke();
  loops(); c.strokeStyle = COL.steel; c.lineWidth = 11; c.stroke();
};

// e2 step 1: a hand holds the magnet up, one clip hangs from the bottom end
const e2s0 = (c: Ctx) => {
  ground(c);
  barMagnet(c, 450, 210, 180, 470);
  paperClip(c, 540, 665);
  hand(c, 540, 250, Math.PI / 2, 2.3);
};

// e3 step 1: the magnet slides down into a clear zip bag
const e3s0 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 930, 270, 34);
  const bag = () => { c.moveTo(310, 360); c.lineTo(810, 360); c.lineTo(830, 900); c.quadraticCurveTo(560, 930, 290, 900); c.closePath(); };
  shape(c, bag, "rgba(214,236,250,0.5)", 0);
  barMagnet(c, 480, 150, 160, 500);
  shape(c, () => { bag(); }, "rgba(214,236,250,0.4)", 6);
  shape(c, () => rrect(c, 300, 340, 520, 40, 12), COL.teal);
  shade(c, () => rrect(c, 300, 340, 520, 40, 12), COL.tealDk, 0, 12, 0.5);
  line(c, [[345, 350], [440, 350]], 7, WHITE);
  line(c, [[300, 840], [300, 450]], 0, WHITE);
  line(c, [[340, 470], [350, 780]], 10, WHITE);
  arrow(c, [[800, 130], [800, 290]]);
};

export const su_magnetsMagnetsAndMaterials = cards("sci.magnets.magnets-and-materials.L3 set-up", [e2s0, e3s0]);
