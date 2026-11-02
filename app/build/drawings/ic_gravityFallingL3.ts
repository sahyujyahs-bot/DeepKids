import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, person, cards, rnd, leaf } from "./flatKit";

// sci.gravity.falling.L3 picture cards (intro, activities, terms). Same child and grown-up as the set-up cards.
const FLOOR = "#e6d5b3", POTATO = "#c9a064", POTATODK = "#a47c43";
const floorBand = (c: Ctx, y: number) => { c.fillStyle = FLOOR; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 6); };
const ball = (c: Ctx, x: number, y: number, r: number, col: string, dk: string) => {
  const p = () => ell(c, x, y, r, r);
  shape(c, p, col, 6); shade(c, p, dk, -r * 0.3, -r * 0.25, 0.55); line(c, [[x - r * 0.55, y - r * 0.15], [x - r * 0.3, y - r * 0.55]], Math.max(4, r * 0.1), WHITE);
};
// a plastic bottle, bottom centre (x, y), fill 0..1 of water
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, fill: number) => {
  const bh = h * 0.72, body = () => rrect(c, x - w / 2, y - bh, w, bh, w * 0.22), neck = () => rrect(c, x - w * 0.21, y - h * 0.9, w * 0.42, h * 0.19, 6), cap = () => rrect(c, x - w * 0.25, y - h, w * 0.5, h * 0.12, 6);
  if (fill > 0) { c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = "#62a9e3"; c.fillRect(x - w, y - bh * fill, w * 2, bh); c.fillStyle = COL.drop; c.fillRect(x - w, y - bh * fill, w * 2, 8); c.restore(); }
  shape(c, body, COL.glass, 5); shape(c, neck, COL.glass, 5); shape(c, cap, COL.teal, 5);
  line(c, [[x - w * 0.3, y - bh * 0.88], [x - w * 0.3, y - bh * 0.25]], Math.max(4, w * 0.06), WHITE);
};
const sheet = (c: Ctx, x: number, y: number, w: number, h: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => polyP(c, [[-w / 2 + 40, -h / 2], [w / 2 + 40, -h / 2], [w / 2 - 40, h / 2], [-w / 2 - 40, h / 2]]);
  shape(c, p, COL.paper, 6); shade(c, p, COL.grey, -14, -10, 0.45);
  for (let k = -1; k <= 1; k++) line(c, [[-w * 0.3 + k * 10, k * h * 0.25], [w * 0.3 + k * 10, k * h * 0.25]], 3, COL.grey);
  c.restore();
};
const crumple = (c: Ctx, x: number, y: number, r: number) => {
  const rd = rnd(5), pts: number[][] = [];
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, rr = r * (0.82 + rd() * 0.24); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  shape(c, () => polyP(c, pts), COL.paper, 6); shade(c, () => polyP(c, pts), COL.grey, -r * 0.25, -r * 0.2, 0.5);
  for (let i = 0; i < 5; i++) line(c, [[x + (rd() - 0.5) * r, y + (rd() - 0.5) * r], [x + (rd() - 0.5) * r * 1.4, y + (rd() - 0.5) * r * 1.4]], 3, COL.greyDk);
};
// a dome parachute: canopy base centre (x, y), width w, strings down to (x, toyY)
const chute = (c: Ctx, x: number, y: number, w: number, toyY: number, col: string = COL.glass, dk: string = COL.glassEdge) => {
  const dome = () => { c.moveTo(x - w / 2, y); c.bezierCurveTo(x - w * 0.5, y - w * 0.62, x + w * 0.5, y - w * 0.62, x + w / 2, y); c.quadraticCurveTo(x + w * 0.25, y + w * 0.06, x, y); c.quadraticCurveTo(x - w * 0.25, y + w * 0.06, x - w / 2, y); c.closePath(); };
  for (const k of [-0.5, -0.17, 0.17, 0.5]) line(c, [[x + k * w, y], [x, toyY]], 4);
  shape(c, dome, col, 6); shade(c, dome, dk, -w * 0.06, -w * 0.05, 0.4);
  line(c, [[x - w * 0.17, y - w * 0.4], [x - w * 0.05, y - w * 0.1]], 3, INK); line(c, [[x + w * 0.17, y - w * 0.4], [x + w * 0.05, y - w * 0.1]], 3, INK);
};
const toy = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - 30 * s, y, 60 * s, 52 * s, 10 * s), COL.orange, 5); shape(c, () => ell(c, x, y - 4 * s, 22 * s, 22 * s), COL.yellow, 5);
};
const mango = (c: Ctx, x: number, y: number, s: number, rot = 0.3) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => ell(c, 0, 0, 60 * s, 76 * s); shape(c, p, COL.yellow); shade(c, p, COL.orange, -22 * s, -18 * s, 0.6);
  leaf(c, 0, -74 * s, 70 * s, -2.2, COL.leaf); line(c, [[0, -70 * s], [0, -88 * s]], 6);
  c.restore();
};
const clock = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), WHITE, 6);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78], [x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9]], 4); }
  line(c, [[x, y], [x + r * 0.45, y - r * 0.15]], 6); line(c, [[x, y], [x - r * 0.1, y - r * 0.65]], 5);
};
const earth = (c: Ctx, x: number, y: number, r: number) => {
  const p = () => ell(c, x, y, r, r);
  shape(c, p, COL.blue); c.save(); c.beginPath(); p(); c.clip();
  shape(c, () => { c.moveTo(x - r * 0.6, y - r * 0.5); c.quadraticCurveTo(x - r * 0.1, y - r * 0.85, x + r * 0.2, y - r * 0.4); c.quadraticCurveTo(x - r * 0.1, y - r * 0.1, x - r * 0.35, y + r * 0.2); c.quadraticCurveTo(x - r * 0.75, y - r * 0.1, x - r * 0.6, y - r * 0.5); c.closePath(); }, COL.green, 5);
  shape(c, () => { c.moveTo(x + r * 0.35, y + r * 0.1); c.quadraticCurveTo(x + r * 0.8, y + r * 0.05, x + r * 0.7, y + r * 0.5); c.quadraticCurveTo(x + r * 0.45, y + r * 0.8, x + r * 0.3, y + r * 0.45); c.closePath(); }, COL.green, 5);
  c.restore(); shade(c, p, COL.blueDk, -r * 0.2, -r * 0.2, 0.45); c.beginPath(); p(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
const hammer = (c: Ctx, x: number, y: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -15, -20, 30, 150, 8), COL.wood); shape(c, () => rrect(c, -70, -62, 140, 62, 12), COL.steel); shade(c, () => rrect(c, -70, -62, 140, 62, 12), COL.steelDk, -14, -12, 0.6);
  c.restore();
};
const feather = (c: Ctx, x: number, y: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => { c.moveTo(0, -120); c.bezierCurveTo(80, -70, 60, 70, 0, 120); c.bezierCurveTo(-34, 55, -70, -55, 0, -120); c.closePath(); }, COL.paper);
  line(c, [[0, -100], [0, 150]], 6); for (let k = -2; k <= 2; k++) { line(c, [[0, k * 30], [34, k * 30 - 22]], 3); line(c, [[0, k * 30], [-30, k * 30 - 22]], 3); }
  c.restore();
};
const flatDash = (c: Ctx, x1: number, x2: number, y: number) => { for (let x = x1; x < x2; x += 36) line(c, [[x, y], [Math.min(x + 20, x2), y]], 4, COL.greyDk); };
const brick = (c: Ctx, x: number, y: number) => { shape(c, () => rrect(c, x - 90, y - 110, 180, 110, 8), COL.red); line(c, [[x - 90, y - 55], [x + 90, y - 55]], 4); line(c, [[x - 30, y - 110], [x - 30, y - 55]], 4); line(c, [[x + 30, y - 55], [x + 30, y]], 4); };
const sponge = (c: Ctx, x: number, y: number) => { shape(c, () => rrect(c, x - 90, y - 110, 180, 110, 18), COL.yellow); shape(c, () => rrect(c, x - 90, y - 110, 180, 30, 14), COL.leaf, 4); for (const [u, v, r] of [[-45, -75, 14], [20, -60, 10], [55, -85, 12], [-10, -30, 11], [60, -30, 9], [-60, -25, 8]]) shape(c, () => ell(c, x + u, y + v, r, r * 0.8), COL.orange, 3); };
const rocket = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => polyP(c, [[-70, 40], [-130, 150], [-60, 120]]), COL.red); shape(c, () => polyP(c, [[70, 40], [130, 150], [60, 120]]), COL.red);
  shape(c, () => { c.moveTo(-70, 140); c.lineTo(-70, -60); c.quadraticCurveTo(-60, -170, 0, -230); c.quadraticCurveTo(60, -170, 70, -60); c.lineTo(70, 140); c.closePath(); }, WHITE);
  shade(c, () => { c.moveTo(-70, 140); c.lineTo(-70, -60); c.quadraticCurveTo(-60, -170, 0, -230); c.quadraticCurveTo(60, -170, 70, -60); c.lineTo(70, 140); c.closePath(); }, COL.steel, -24, -10, 0.7);
  shape(c, () => ell(c, 0, -50, 32, 32), COL.sky, 6);
  shape(c, () => polyP(c, [[-45, 150], [45, 150], [0, 290]]), COL.orange); shape(c, () => polyP(c, [[-24, 150], [24, 150], [0, 230]]), COL.yellow, 3);
  c.restore();
};
const clouds = (c: Ctx, x: number, y: number, s: number) => { c.fillStyle = WHITE; for (const [u, v, r] of [[0, 0, 60], [70, -20, 75], [150, 0, 55], [75, 20, 55]]) { c.beginPath(); ell(c, x + u * s, y + v * s, r * s, r * s * 0.8); c.fill(); } };

// 0 intro: the astronaut let go of a hammer and a feather, side by side
const intro = (c: Ctx) => {
  c.fillStyle = "#2a2f5e"; c.fillRect(0, 0, 1080, 1080);
  const r = rnd(3); c.fillStyle = WHITE; for (let i = 0; i < 40; i++) { c.beginPath(); c.arc(r() * 1080, r() * 700, 2 + r() * 3, 0, 7); c.fill(); }
  earth(c, 930, 150, 70);
  c.fillStyle = COL.grey; c.fillRect(0, 780, 1080, 300); line(c, [[0, 780], [1080, 780]], 6);
  for (const [u, v] of [[180, 960], [700, 900], [940, 1000]]) shape(c, () => ell(c, u, v, 110, 26), COL.greyDk, 4);
  shadow(c, 340, 900, 190, 28);
  // astronaut
  shape(c, () => rrect(c, 235, 420, 70, 190, 18), COL.steel);
  shape(c, () => rrect(c, 265, 560, 70, 320, 20), WHITE); shape(c, () => rrect(c, 335, 560, 70, 320, 20), WHITE);
  shape(c, () => rrect(c, 255, 850, 90, 50, 14), COL.grey); shape(c, () => rrect(c, 335, 850, 90, 50, 14), COL.grey);
  shape(c, () => rrect(c, 265, 410, 150, 220, 40), WHITE); shade(c, () => rrect(c, 265, 410, 150, 220, 40), COL.steel, -24, -10, 0.8);
  shape(c, () => rrect(c, 305, 480, 70, 50, 8), COL.orange, 4);
  line(c, [[395, 460], [570, 505]], 76, INK); line(c, [[395, 460], [570, 505]], 62, WHITE); shape(c, () => ell(c, 585, 510, 36, 36), COL.grey, 6);
  shape(c, () => ell(c, 345, 330, 92, 92), WHITE); shape(c, () => ell(c, 372, 335, 62, 62), COL.yellow, 5); line(c, [[355, 310], [385, 300]], 8, WHITE);
  hammer(c, 700, 470, 0.25); feather(c, 890, 470, 0.2);
  arrow(c, [[700, 640], [700, 790]]); arrow(c, [[890, 640], [890, 790]]);
};

// 1 e1 the drop race: a potato and a lemon let go at the same height
const dropRace = (c: Ctx) => {
  ground(c); floorBand(c, 880);
  person(c, 160, 880, 560);
  flatDash(c, 330, 960, 440);
  const pt = () => ell(c, 560, 440, 100, 76, 0.2); shape(c, pt, POTATO); shade(c, pt, POTATODK, -20, -16, 0.6);
  for (const [u, v] of [[520, 420], [600, 460], [570, 405]]) shape(c, () => ell(c, u, v, 7, 5), POTATODK, 3);
  const lm = () => ell(c, 840, 440, 56, 40, 0.1); shape(c, lm, COL.yellow); shade(c, lm, COL.orange, -12, -10, 0.55);
  shape(c, () => ell(c, 894, 442, 10, 8), COL.yellow, 4); shape(c, () => ell(c, 786, 438, 10, 8), COL.yellow, 4);
  arrow(c, [[560, 570], [560, 800]]); arrow(c, [[840, 570], [840, 800]]);
};

// 2 e2 flat paper drifts, crumpled paper drops
const paperFall = (c: Ctx) => {
  ground(c); floorBand(c, 900);
  sheet(c, 300, 400, 300, 130, -0.15); crumple(c, 780, 400, 90);
  arrow(c, [[300, 520], [220, 620], [380, 700], [280, 800]]); arrow(c, [[780, 530], [780, 820]]);
};

// 3 e3 three parachutes, one toy each
const threeChutes = (c: Ctx) => {
  ground(c); floorBand(c, 960);
  const sz: [number, number, number][] = [[190, 150, 120], [540, 230, 184], [890, 330, 264]];
  for (const [x, w, l] of sz) { chute(c, x, 720 - l, w, 720); toy(c, x, 720, 1); arrow(c, [[x, 820], [x, 920]], RED, 9); }
};

// 4 e4 falling ruler
const fallingRuler = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 485, 120, 110, 660, 8), COL.wood); c.fillStyle = COL.woodDk; c.fillRect(488, 123, 14, 654);
  for (let k = 0; k <= 30; k++) { const y = 770 - k * 21; line(c, [[595, y], [595 - (k % 5 === 0 ? 40 : 22), y]], k % 5 === 0 ? 4 : 2.5); }
  hand(c, 540, 40, Math.PI / 2, 1.3, SKIN.adult, CLOTH.adult);
  hand(c, 760, 700, Math.PI, 1.8, SKIN.child, CLOTH.child, true);
  arrow(c, [[400, 300], [400, 560]]);
};

// 5 a1 jump beside a paper strip on the wall
const jump = (c: Ctx) => {
  ground(c); c.fillStyle = "#e9c6a8"; c.fillRect(480, 0, 600, 880); line(c, [[480, 0], [480, 880]], 6); floorBand(c, 880);
  shape(c, () => rrect(c, 640, 90, 130, 780, 4), WHITE);
  for (let k = 0; k <= 26; k++) { const y = 860 - k * 29; line(c, [[640, y], [640 + (k % 5 === 0 ? 55 : 30), y]], k % 5 === 0 ? 4 : 2.5); }
  shape(c, () => polyP(c, [[625, 70], [785, 70], [785, 110], [625, 110]]), COL.yellow, 3);
  shadow(c, 250, 900, 150, 26);
  person(c, 250, 740, 560, { armL: [-1.95, -1.95], armR: [-1.2, -1.2] });
  arrow(c, [[90, 680], [90, 420]]);
};

// 6 a2 the space blanket: a heavy ball dents a stretched cloth, a marble curves in
const spaceBlanket = (c: Ctx) => {
  ground(c);
  const cloth = () => { c.beginPath(); c.moveTo(60, 380); c.quadraticCurveTo(540, 800, 1020, 380); };
  cloth(); c.strokeStyle = INK; c.lineWidth = 40; c.lineCap = "round"; c.stroke(); cloth(); c.strokeStyle = COL.pink; c.lineWidth = 26; c.stroke();
  ball(c, 540, 482, 98, COL.steel, COL.steelDk);
  ball(c, 296, 510, 28, COL.teal, COL.tealDk);
  arrow(c, [[250, 440], [330, 470], [400, 520]], RED, 8);
  hand(c, 20, 380, 0, 1.2, SKIN.adult, CLOTH.adult);
  c.save(); c.translate(1060, 380); c.scale(-1, 1); hand(c, 0, 0, 0, 1.2, SKIN.adult, CLOTH.adult); c.restore();
};

// 7 a3 a bag of bottles held at arm's length
const tiredArm = (c: Ctx) => {
  ground(c); floorBand(c, 900);
  person(c, 280, 900, 700, { armR: [0.0, 0.0] });
  const wx = 280 + 0.11 * 700 + 0.33 * 700, wy = 900 - 0.74 * 700 + 0.03 * 700;
  bottle(c, wx - 28, 640, 70, 190, 0.9); bottle(c, wx + 30, 640, 70, 190, 0.9);
  shape(c, () => rrect(c, wx - 90, 530, 180, 190, 24), COL.yellow); line(c, [[wx - 50, 530], [wx, wy], [wx + 50, 530]], 6);
  arrow(c, [[wx, 750], [wx, 870]]);
};

// 8 a4 a plumb line hangs straight down
const plumb = (c: Ctx) => {
  ground(c);
  floorBand(c, 900); shape(c, () => rrect(c, 760, 40, 90, 860, 4), COL.wood); shape(c, () => rrect(c, 980, 40, 90, 860, 4), COL.wood); shape(c, () => rrect(c, 760, 40, 310, 90, 4), COL.woodDk);
  line(c, [[420, 130], [420, 610]], 6);
  hand(c, 420, 20, Math.PI / 2, 1.2, SKIN.child, CLOTH.child);
  shape(c, () => polyP(c, [[370, 700], [395, 640], [445, 640], [470, 700], [445, 760], [395, 760]]), COL.steel); shape(c, () => ell(c, 420, 700, 20, 20), "#efe4cf", 5);
  shadow(c, 440, 790, 70, 14);
  arrow(c, [[250, 420], [250, 740]]);
};

// 9 a5 four sisters on four heights, a clock beside each
const sisters = (c: Ctx) => {
  ground(c);
  const ys = [830, 700, 570, 440];
  ys.forEach((y, i) => { const x0 = 40 + i * 250; shape(c, () => rrect(c, x0, y, 240, 1080 - y + 20, 6), i % 2 ? COL.teal : COL.tealDk); person(c, x0 + 100, y, 240); clock(c, x0 + 150, y - 300, 55); });
};

// 10 a6 things that fall from a tree
const seedsWalk = (c: Ctx) => {
  ground(c); floorBand(c, 900);
  shape(c, () => rrect(c, 215, 300, 90, 600, 12), COL.brown);
  shape(c, () => ell(c, 260, 230, 220, 190), COL.leaf); shade(c, () => ell(c, 260, 230, 220, 190), COL.leafDk, -30, -26, 0.55);
  mango(c, 600, 420, 0.9, 0.3);
  leaf(c, 720, 330, 170, 1.0, COL.greenLt);
  // a winged seed
  c.save(); c.translate(860, 600); c.rotate(0.9);
  shape(c, () => ell(c, 0, 0, 30, 24), COL.brown, 5); shape(c, () => { c.moveTo(20, -10); c.quadraticCurveTo(100, -90, 190, -20); c.quadraticCurveTo(110, 60, 20, 14); c.closePath(); }, COL.wood, 5);
  c.restore();
  arrow(c, [[600, 540], [600, 700]], RED, 8); arrow(c, [[780, 470], [720, 600]], RED, 8);
  shape(c, () => rrect(c, 380, 790, 200, 110, 20), COL.cloth); line(c, [[420, 790], [480, 730], [540, 790]], 6);
};

// 11 a7 an old thinker and two stones
const trial = (c: Ctx) => {
  ground(c); floorBand(c, 900);
  shadow(c, 250, 905, 130, 22);
  shape(c, () => polyP(c, [[130, 900], [370, 900], [330, 480], [170, 480]]), "#f1ece0"); shade(c, () => polyP(c, [[130, 900], [370, 900], [330, 480], [170, 480]]), COL.grey, -26, -10, 0.5);
  line(c, [[300, 540], [470, 480]], 60, INK); line(c, [[300, 540], [470, 480]], 46, "#f1ece0"); shape(c, () => ell(c, 480, 476, 28, 28), SKIN.adult, 5);
  shape(c, () => ell(c, 250, 380, 82, 86), SKIN.adult);
  shape(c, () => { c.moveTo(178, 425); c.quadraticCurveTo(250, 590, 322, 425); c.quadraticCurveTo(250, 450, 178, 425); c.closePath(); }, WHITE, 5);
  shape(c, () => { c.moveTo(168, 370); c.bezierCurveTo(168, 270, 332, 270, 332, 370); c.quadraticCurveTo(250, 300, 168, 370); c.closePath(); }, WHITE, 5);
  for (const dx of [-30, 30]) shape(c, () => ell(c, 250 + dx, 372, 8, 11), INK, 0);
  ball(c, 700, 440, 115, COL.grey, COL.greyDk); ball(c, 930, 440, 55, COL.grey, COL.greyDk);
  arrow(c, [[700, 600], [700, 800]]); arrow(c, [[930, 540], [930, 800]]);
};

// 12 a8 a magnet holds paper clips up
const magnet = (c: Ctx) => {
  ground(c);
  const mg = () => { c.beginPath(); c.moveTo(430, 430); c.lineTo(430, 300); c.arc(540, 300, 110, Math.PI, 0); c.lineTo(650, 430); };
  mg(); c.strokeStyle = INK; c.lineWidth = 86; c.lineCap = "round"; c.lineJoin = "round"; c.stroke(); mg(); c.strokeStyle = COL.red; c.lineWidth = 70; c.stroke();
  for (const x of [430, 650]) shape(c, () => rrect(c, x - 35, 395, 70, 55, 4), COL.steel, 5);
  const clip = (x: number, y: number) => { for (const [w, col] of [[22, INK], [9, COL.steelDk]] as [number, string][]) { c.beginPath(); rrect(c, x - 26, y, 52, 130, 26); c.strokeStyle = col; c.lineWidth = w; c.stroke(); } };
  for (const x of [430, 650]) { clip(x, 440); clip(x, 560); }
  arrow(c, [[260, 740], [260, 400]]);
};

// 13 p1 Galileo's ramp
const ramp = (c: Ctx) => {
  ground(c); floorBand(c, 840);
  const cols = [COL.purple, COL.yellow, COL.teal];
  cols.forEach((col, i) => shape(c, () => rrect(c, 105, 548 + i * 98, 180, 98, 8), col));
  shape(c, () => polyP(c, [[100, 500], [880, 790], [880, 834], [100, 544]]), COL.wood);
  for (const x of [330, 470, 650]) { const y = 500 + (x - 100) * 0.372; line(c, [[x, y], [x, y + 40]], 8, RED); }
  shape(c, () => rrect(c, 890, 690, 150, 150, 40), COL.pink);
  ball(c, 273, 522, 38, COL.teal, COL.tealDk);
  arrow(c, [[350, 430], [520, 495]]);
};

// 14 c1 the egg lander
const eggLander = (c: Ctx) => {
  ground(c); floorBand(c, 960);
  chute(c, 540, 380, 560, 600);
  for (const [x1, y1, x2, y2] of [[420, 620, 660, 620], [420, 800, 660, 800], [420, 620, 420, 800], [660, 620, 660, 800]]) { line(c, [[x1, y1], [x2, y2]], 24, INK); line(c, [[x1, y1], [x2, y2]], 12, COL.yellow); }
  const eg = () => ell(c, 540, 715, 52, 68); shape(c, eg, WHITE); shade(c, eg, COL.steel, -14, -10, 0.7);
  arrow(c, [[920, 400], [920, 700]]);
};

// 15 c2 the slowest fall: a paper spinner and a stopwatch
const spinner = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[510, 480], [250, 440], [240, 520], [510, 550]]), COL.paper); shape(c, () => polyP(c, [[570, 480], [830, 520], [840, 440], [570, 410]]), COL.paper);
  shape(c, () => rrect(c, 510, 410, 60, 360, 8), COL.paper);
  shape(c, () => rrect(c, 515, 740, 50, 80, 25), COL.steel, 5);
  arrow(c, [[260, 330], [540, 270], [820, 330]]);
  shape(c, () => rrect(c, 800, 640, 50, 40, 6), COL.steelDk); shape(c, () => ell(c, 825, 810, 105, 105), WHITE);
  line(c, [[825, 810], [825, 740]], 8); line(c, [[825, 810], [880, 830]], 8);
};

// 16 term Force: a kick and a falling mango
const forceCard = (c: Ctx) => {
  ground(c); floorBand(c, 850);
  person(c, 170, 850, 520);
  ball(c, 400, 780, 58, WHITE, COL.steel); shape(c, () => polyP(c, [[385, 765], [415, 765], [422, 795], [400, 810], [378, 795]]), INK, 0);
  arrow(c, [[490, 770], [600, 750]]);
  line(c, [[1080, 100], [790, 160]], 40, INK); line(c, [[1080, 100], [790, 160]], 26, COL.brown);
  line(c, [[800, 175], [800, 280]], 6); mango(c, 800, 360, 0.9, 0.2);
  arrow(c, [[800, 500], [800, 760]]);
};

// 17 term Fall: a hand lets go, a ball drops
const fallCard = (c: Ctx) => {
  ground(c); floorBand(c, 920);
  hand(c, 120, 180, 0, 1.7, SKIN.child, CLOTH.child, true);
  ball(c, 260, 560, 95, COL.red, "#b83a28");
  for (const x of [190, 260, 330]) line(c, [[x, 330], [x, 410]], 5, COL.greyDk);
  arrow(c, [[260, 690], [260, 860]]);
};

// 18 term Down: people all round the Earth, arrows to its middle
const downCard = (c: Ctx) => {
  ground(c); earth(c, 540, 540, 230);
  const at: [number, number, number][] = [[540, 310, 0], [770, 540, Math.PI / 2], [540, 770, Math.PI], [310, 540, -Math.PI / 2]];
  for (const [x, y, a] of at) { c.save(); c.translate(x, y); c.rotate(a); person(c, 0, 0, 200); c.restore(); }
  for (const [x, y, a] of at) arrow(c, [[x - Math.sin(a) * 40, y + Math.cos(a) * 40], [x - Math.sin(a) * 130, y + Math.cos(a) * 130]], RED, 9);
};

// 19 term Mass: a brick and a sponge on a see-saw
const seesaw = (c: Ctx) => {
  ground(c); floorBand(c, 860);
  shape(c, () => polyP(c, [[450, 860], [630, 860], [540, 640]]), COL.teal);
  c.save(); c.translate(540, 640); c.rotate(-0.17);
  shape(c, () => rrect(c, -420, -20, 840, 40, 10), COL.wood);
  brick(c, -290, -20); sponge(c, 290, -20);
  c.restore();
  arrow(c, [[130, 330], [130, 520]]);
};

// 20 term Weight: a full and an empty bottle, a big and a small arrow down
const weightCard = (c: Ctx) => {
  ground(c); floorBand(c, 950);
  bottle(c, 320, 600, 230, 460, 0.92); bottle(c, 770, 600, 230, 460, 0.12);
  arrow(c, [[320, 640], [320, 900]], RED, 20); arrow(c, [[770, 640], [770, 740]], RED, 9);
};

// 21 term Air resistance: air pushes up on flat paper, not on a crumpled ball
const airCard = (c: Ctx) => {
  ground(c); floorBand(c, 960);
  sheet(c, 290, 330, 310, 130, -0.12); crumple(c, 790, 330, 90);
  for (const x of [190, 290, 390]) arrow(c, [[x, 520], [x, 440]], COL.blueDk, 8);
  arrow(c, [[290, 580], [290, 680]]); arrow(c, [[790, 460], [790, 900]]);
};

// 22 term Vacuum: a jar with the air pumped out, a ball and a feather on the bottom
const vacuumCard = (c: Ctx) => {
  ground(c);
  const jar = () => { c.moveTo(230, 800); c.lineTo(230, 420); c.bezierCurveTo(230, 150, 790, 150, 790, 420); c.lineTo(790, 800); c.closePath(); };
  shape(c, jar, COL.glass, 6); line(c, [[290, 700], [290, 440]], 9, WHITE);
  shape(c, () => rrect(c, 190, 800, 640, 70, 14), COL.steel); shade(c, () => rrect(c, 190, 800, 640, 70, 14), COL.steelDk, -14, -12, 0.6);
  ball(c, 400, 745, 55, COL.red, "#b83a28"); feather(c, 590, 770, 1.4);
  line(c, [[830, 835], [900, 835], [900, 930]], 18, INK); line(c, [[830, 835], [900, 835], [900, 930]], 8, COL.steelDk);
  shape(c, () => rrect(c, 840, 920, 160, 100, 14), COL.teal);
};

// 23 term Speed up: a ball at four moments, the gaps growing
const speedUp = (c: Ctx) => {
  ground(c); floorBand(c, 950);
  const ys = [100, 215, 445, 800];
  ys.forEach((y) => ball(c, 540, y, 50, COL.red, "#b83a28"));
  arrow(c, [[860, 150], [860, 800]]);
};

// 24 term Fair test: two same bottles held at the same height, one full, one nearly empty
const fairTest = (c: Ctx) => {
  ground(c);
  bottle(c, 330, 680, 190, 480, 0.9); bottle(c, 750, 680, 190, 480, 0.12);
  hand(c, 330, 90, Math.PI / 2, 1.2, SKIN.child, CLOTH.child); hand(c, 750, 90, Math.PI / 2, 1.2, SKIN.adult, CLOTH.adult);
  flatDash(c, 120, 960, 740);
};

// 25 term Parachute: a bag parachute with a toy
const chuteCard = (c: Ctx) => {
  ground(c);
  chute(c, 540, 480, 700, 700); toy(c, 540, 700, 1.4);
  arrow(c, [[540, 830], [540, 980]]);
};

// 26 term Orbit: the Moon round the Earth on a dotted path
const orbitCard = (c: Ctx) => {
  ground(c);
  c.setLineDash([22, 22]); c.beginPath(); c.arc(540, 540, 360, 0, Math.PI * 2); c.strokeStyle = COL.greyDk; c.lineWidth = 6; c.stroke(); c.setLineDash([]);
  earth(c, 540, 540, 150);
  ball(c, 540 + 360 * Math.cos(-0.7), 540 + 360 * Math.sin(-0.7), 58, COL.grey, COL.greyDk);
  arrow(c, [-0.5, -0.3, -0.1, 0.1].map((a) => [540 + 360 * Math.cos(a), 540 + 360 * Math.sin(a)]));
};

// 27 term Escape speed: a rocket far above, a child's small jump below
const escapeCard = (c: Ctx) => {
  ground(c, "#bfe0f5"); c.fillStyle = "#efe4cf"; c.fillRect(0, 900, 1080, 180); line(c, [[0, 900], [1080, 900]], 6);
  clouds(c, 90, 330, 1.1); clouds(c, 380, 760, 0.9);
  rocket(c, 740, 400, 1);
  arrow(c, [[920, 600], [920, 220]]);
  shadow(c, 220, 905, 70, 14);
  person(c, 220, 860, 300, { armL: [-1.9, -1.9], armR: [-1.2, -1.2] });
  arrow(c, [[110, 760], [110, 690]], RED, 8);
};

export const ic_gravityFallingL3 = cards("sci.gravity.falling.L3 cards", [intro, dropRace, paperFall, threeChutes, fallingRuler, jump, spaceBlanket, tiredArm, plumb, sisters, seedsWalk, trial, magnet, ramp, eggLander, spinner, forceCard, fallCard, downCard, seesaw, weightCard, airCard, vacuumCard, speedUp, fairTest, chuteCard, orbitCard, escapeCard]);
