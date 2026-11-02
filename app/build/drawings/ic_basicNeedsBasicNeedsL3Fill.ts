import type { Ctx } from "./core";
import { BG, CLOTH, COL, D, INK, RED, SKIN, WHITE, arrow, cards, ell, glass, ground, hand, line, person, plate, polyP, rrect, shade, shadow, shape } from "./flatKit";

// OUR BASIC NEEDS (L3) · fill-in cards: cover, main idea, the hidden-water bag test, the home-care poster.

// a water drop, tip up, round end centred at (x, y+0.3r)
const drop = (c: Ctx, x: number, y: number, r: number, col: string = COL.water, w = 4) =>
  shape(c, () => { c.moveTo(x, y - r * 1.6); c.bezierCurveTo(x + r * 0.1, y - r * 0.6, x + r, y - r * 0.3, x + r, y + r * 0.3); c.arc(x, y + r * 0.3, r, 0, Math.PI); c.bezierCurveTo(x - r, y - r * 0.3, x - r * 0.1, y - r * 0.6, x, y - r * 1.6); c.closePath(); }, col, w);
// a curl of moving air, in blue with an ink outline, tail on the left, curl on the right
const curl = (c: Ctx, x: number, y: number, s: number, w = 9) => {
  const path = () => { c.beginPath(); c.moveTo(x - s * 2, y); c.bezierCurveTo(x - s, y - s * 0.5, x, y - s * 0.4, x + s, y - s * 0.6); c.arc(x + s, y, s * 0.6, -Math.PI / 2, Math.PI, false); };
  c.lineCap = "round"; c.lineJoin = "round";
  path(); c.strokeStyle = INK; c.lineWidth = w + 6; c.stroke();
  path(); c.strokeStyle = COL.blue; c.lineWidth = w; c.stroke();
};
// a plate of idli, plate centre (x, y)
const idliPlate = (c: Ctx, x: number, y: number, rx: number) => {
  plate(c, x, y, rx, rx * 0.4);
  for (const [dx, dy] of [[-0.42, 0.02], [0.4, 0.0], [0, -0.12]]) {
    const ix = x + dx * rx, iy = y + dy * rx * 0.6;
    shape(c, () => ell(c, ix, iy + rx * 0.05, rx * 0.34, rx * 0.14), "#e8e2d2", 5);
    shape(c, () => ell(c, ix, iy - rx * 0.05, rx * 0.34, rx * 0.14), COL.paper, 5);
  }
};
// a cotton shirt hanging flat, centre (x, y), width w
const shirt = (c: Ctx, x: number, y: number, w: number, col: string = COL.teal, dk: string = COL.tealDk) => {
  const h = w * 1.1;
  const p = () => polyP(c, [[x - w * 0.5, y - h * 0.45], [x - w * 0.2, y - h * 0.5], [x, y - h * 0.4], [x + w * 0.2, y - h * 0.5], [x + w * 0.5, y - h * 0.45], [x + w * 0.64, y - h * 0.12], [x + w * 0.38, y - h * 0.02], [x + w * 0.38, y + h * 0.5], [x - w * 0.38, y + h * 0.5], [x - w * 0.38, y - h * 0.02], [x - w * 0.64, y - h * 0.12]]);
  shape(c, p, col);
  shade(c, p, dk, w * 0.14, 0);
};
// a small house: walls, roof, door; bottom-centre (x, y)
const house = (c: Ctx, x: number, y: number, w: number) => {
  const h = w * 0.7;
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 6), COL.yellow);
  shade(c, () => rrect(c, x - w / 2, y - h, w, h, 6), COL.woodDk, w * 0.2, 0, 0.4);
  shape(c, () => polyP(c, [[x - w * 0.6, y - h], [x, y - h - w * 0.45], [x + w * 0.6, y - h]]), COL.red);
  shape(c, () => rrect(c, x - w * 0.12, y - h * 0.55, w * 0.24, h * 0.55, 6), COL.brown, 5);
  shape(c, () => rrect(c, x + w * 0.18, y - h * 0.8, w * 0.2, h * 0.3, 4), COL.sky, 5);
};

// card 0 (intro): the five needs round one child at home: air curls, a tumbler of water, a plate of idli, a shirt, and the house itself
const intro = (c: Ctx) => {
  ground(c);
  // the home: walls and a roof framing the card
  shape(c, () => rrect(c, 140, 330, 800, 590, 10), COL.paper);
  shape(c, () => polyP(c, [[90, 332], [540, 90], [990, 332]]), COL.red);
  line(c, [[140, 918], [940, 918]], 8);
  // window on the left, with air curling in
  shape(c, () => rrect(c, 190, 400, 170, 170, 8), COL.sky, 6);
  line(c, [[275, 404], [275, 566]], 5); line(c, [[194, 485], [356, 485]], 5);
  curl(c, 330, 620, 34); curl(c, 300, 690, 28);
  // the child, holding the tumbler
  const x = 540, y = 900, h = 520;
  person(c, x, y, h, { armR: [Math.PI * 0.35, -Math.PI * 0.2] });
  glass(c, x + 174, y - 290, 80, 140, 0.7);
  // plate of idli on the floor to the left, shirt hanging on the right
  idliPlate(c, 300, 850, 140);
  line(c, [[860, 410], [860, 470]], 6); shape(c, () => ell(c, 860, 400, 14, 14), COL.grey, 5);
  shirt(c, 860, 570, 150);
};

// card 1 (summary): the body keeps using the needs up: water goes in, breath comes out, water leaves the skin
const summary = (c: Ctx) => {
  ground(c);
  const x = 470, y = 960, h = 700;
  shadow(c, x + 20, y + 10, 180, 24);
  person(c, x, y, h, { armL: [Math.PI * 0.75, Math.PI * 0.6], armR: [Math.PI * 0.5, Math.PI * 0.5] });
  const hy = y - h * 0.74 - h * 0.13 * 1.05, mouth = hy + h * 0.13 * 0.38;
  // water in: a tumbler on the left and a red arrow up to the mouth
  glass(c, 150, 760, 120, 210, 0.75);
  arrow(c, [[170, 520], [250, 440], [x - 100, mouth + 36]]);
  // breath out: a red arrow from the mouth, and puffs of air
  arrow(c, [[x + 60, mouth], [x + 190, mouth - 10]]);
  for (const [dx, dy, r] of [[250, -20, 44], [330, 0, 56], [410, -14, 40]]) shape(c, () => ell(c, x + dx, mouth + dy, r, r * 0.8), COL.sky, 6);
  curl(c, x + 420, mouth + 90, 30);
  // water out of the skin: drops on the right arm, a red arrow away
  const wx = x + h * 0.11 + h * 0.17 * Math.cos(Math.PI * 0.5), wy = y - h * 0.74 + h * 0.03 + h * 0.17;
  for (const [dx, dy, r] of [[30, -60, 16], [44, 10, 18], [26, 80, 15]]) drop(c, wx + dx + 40, wy + dy, r);
  arrow(c, [[wx + 110, wy + 10], [wx + 230, wy + 10]]);
};

// card 2 (flow.e1): a dry hand inside a clear bag grows mist; an empty tumbler in a clear bag stays clear
const hiddenWater = (c: Ctx) => {
  ground(c);
  line(c, [[0, 940], [D, 940]], 6);
  // the hand, pointing up, sleeve below
  const hx = 300, hy = 770;
  shadow(c, hx + 20, 945, 150, 18);
  hand(c, hx, hy, -Math.PI / 2, 2.2, SKIN.child, CLOTH.child, true);
  const bag = (x: number, top: number, bottom: number, w: number) => shape(c, () => { c.moveTo(x - w * 0.5, bottom); c.lineTo(x - w * 0.58, top + 70); c.quadraticCurveTo(x, top - 40, x + w * 0.58, top + 70); c.lineTo(x + w * 0.5, bottom); c.closePath(); }, COL.glass, 5);
  bag(hx, 280, 790, 330);
  // mist: many small drops on the inside of the bag
  for (const [dx, dy, r] of [[-120, 60, 11], [-60, 10, 13], [20, 30, 12], [90, 70, 10], [-140, 170, 12], [-30, 140, 10], [60, 160, 14], [130, 190, 11], [-110, 290, 10], [10, 260, 13], [120, 300, 11], [-150, 400, 12], [-40, 380, 11], [60, 420, 12], [150, 440, 10], [-130, 520, 11], [130, 560, 12]])
    drop(c, hx + dx, 300 + dy, r, COL.drop, 3);
  // rubber band at the wrist
  shape(c, () => ell(c, hx, hy + 20, 96, 16), "rgba(0,0,0,0)", 0);
  line(c, [[hx - 96, hy + 20], [hx - 60, hy + 36], [hx, hy + 42], [hx + 60, hy + 36], [hx + 96, hy + 20]], 10, COL.brown);
  // red arrow: the water comes out of the skin
  arrow(c, [[hx + 170, 640], [hx + 170, 480]]);
  // the empty tumbler in its own bag: nothing inside
  const tx = 790;
  glass(c, tx, 900, 170, 290, 0);
  bag(tx, 420, 915, 330);
  line(c, [[tx - 165, 915], [tx - 100, 932], [tx, 938], [tx + 100, 932], [tx + 165, 915]], 10, COL.brown);
};

// card 3 (flow.p1): the finished poster of the five needs, the child pointing at it
const homeCare = (c: Ctx) => {
  ground(c);
  line(c, [[0, 1000], [D, 1000]], 6);
  // the chart paper on the wall, a tape at each top corner
  shadow(c, 420, 790, 330, 22);
  shape(c, () => rrect(c, 70, 90, 700, 690, 8), COL.paper);
  for (const tx of [110, 690]) shape(c, () => polyP(c, [[tx - 30, 76], [tx + 30, 76], [tx + 36, 110], [tx - 36, 110]]), COL.yellow, 4);
  // five pictures: air, water, food on top; clothes, home below
  curl(c, 190, 250, 40, 11); curl(c, 160, 330, 30, 9);
  glass(c, 420, 380, 110, 190, 0.7);
  idliPlate(c, 640, 320, 95);
  shirt(c, 260, 620, 150);
  house(c, 560, 700, 180);
  line(c, [[110, 460], [730, 460]], 4, COL.grey);
  // the child, pointing at the poster
  const x = 905, y = 1000, h = 440;
  shadow(c, x + 10, y + 6, 110, 16);
  person(c, x, y, h, { armL: [-Math.PI * 0.8, -Math.PI * 0.88] });
};

export const ic_basicNeedsBasicNeedsL3Fill = cards("sci.basic-needs.basic-needs.L3 fill", [intro, summary, hiddenWater, homeCare]);
