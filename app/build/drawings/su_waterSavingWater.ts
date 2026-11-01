import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, leaf, hand, write, cards } from "./flatKit";

// sci.water.saving-water.L3 set-up cards: three experiments, three cards each.
const MUD = "#a5603f", MUDDK = "#7f4529", DESK = "#e8d6b0", TERRA = "#d9693f", TERRADK = "#b4492a";

const desk = (c: Ctx, y: number) => { ground(c); c.fillStyle = DESK; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };
const dot = (c: Ctx, x: number, y: number, r: number, col: string) => shape(c, () => ell(c, x, y, r, r), col, 5);
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) => shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 1.1, y, x + s * 0.8, y + s * 0.4); c.arc(x, y + s * 0.4, s * 0.8, 0, Math.PI); c.quadraticCurveTo(x - s * 1.1, y, x, y - s * 1.5); c.closePath(); }, col, 4);
// a hand reaching in from the right, fingers pointing along an (world angle), thumb up
const handL = (c: Ctx, x: number, y: number, an: number, s: number, open = false) => { c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, Math.PI - an, s, SKIN.child, CLOTH.child, open); c.restore(); };
const spoon = (c: Ctx, x1: number, y1: number, x2: number, y2: number, bowlCol: string = COL.steelDk) => {
  line(c, [[x1, y1], [x2, y2]], 22, INK); line(c, [[x1, y1], [x2, y2]], 11, COL.steel);
  shape(c, () => ell(c, x1, y1, 30, 20, Math.atan2(y2 - y1, x2 - x1)), bowlCol, 5);
};
// a steel jug, bottom centre (x, y); handle on the left; liquid showing in the open top
const jug = (c: Ctx, x: number, y: number, w: number, h: number, inside: string = MUD) => {
  const t = w / 2, b = w * 0.42, body = () => { c.moveTo(x - t, y - h); c.lineTo(x + t, y - h); c.lineTo(x + b, y); c.lineTo(x - b, y); c.closePath(); };
  shadow(c, x + w * 0.1, y + 8, w * 0.58, w * 0.1);
  const hd = [[x - t + 14, y - h + 50], [x - t - 80, y - h + 80], [x - t - 70, y - h * 0.38], [x - b + 14, y - h * 0.26]];
  line(c, hd, 38, INK); line(c, hd, 22, COL.steel);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.2, 0);
  shape(c, () => ell(c, x, y - h, t, w * 0.1), COL.steelIn, 5);
  shape(c, () => ell(c, x, y - h + 4, t - 16, w * 0.075), inside, 4);
  shine(c, [[x - t * 0.7, y - h * 0.8], [x - b * 0.7, y - h * 0.15]], 10);
};
const star = (c: Ctx, x: number, y: number, R: number) => shape(c, () => polyP(c, Array.from({ length: 10 }, (_, i) => [x + Math.cos(-Math.PI / 2 + (i * Math.PI) / 5) * (i % 2 ? R * 0.45 : R), y + Math.sin(-Math.PI / 2 + (i * Math.PI) / 5) * (i % 2 ? R * 0.45 : R)])), INK, 0);
// a lump of phitkari: pale angular crystal
const lump = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => polyP(c, [[x - 40 * s, y - 10 * s], [x - 14 * s, y - 42 * s], [x + 30 * s, y - 34 * s], [x + 44 * s, y + 6 * s], [x + 18 * s, y + 40 * s], [x - 28 * s, y + 32 * s]]);
  shape(c, p, "#f3f6fa", 6); shade(c, p, "#b9c4d4", 14 * s, 8 * s, 0.7);
  line(c, [[x - 14 * s, y - 42 * s], [x - 4 * s, y + 2 * s], [x + 18 * s, y + 40 * s]], 3, "#8fa0b8");
};
const mud = (c: Ctx, x: number, y: number, w: number, h: number, hh: number) => { // settled mud layer at the bottom of a glass
  const top = w / 2, bot = w * 0.4, lw = bot + (top - bot) * (hh / h);
  shape(c, () => { c.moveTo(x - lw, y - hh); c.quadraticCurveTo(x, y - hh - 14, x + lw, y - hh); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, MUD, 0);
  shade(c, () => { c.moveTo(x - lw, y - hh); c.lineTo(x + lw, y - hh); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, MUDDK, 30, 0, 0.5);
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  desk(c, 800);
  jug(c, 330, 800, 330, 360);
  spoon(c, 340, 455, 625, 232);
  handL(c, 680, 170, 2.3, 1.6);
  glass(c, 720, 800, 150, 330, 0); glass(c, 900, 800, 150, 330, 0);
  dot(c, 720, 690, 26, RED); dot(c, 900, 690, 26, COL.blue);
  arrow(c, [[150, 385], [215, 350], [300, 340]], RED, 10);
  arrow(c, [[515, 640], [620, 610]], RED, 10);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  desk(c, 860);
  glass(c, 280, 860, 260, 420, 0.7, MUD); glass(c, 800, 860, 260, 420, 0.7, MUD);
  dot(c, 280, 790, 30, RED); dot(c, 800, 790, 30, COL.blue);
  // glass A: a spoon stirs
  c.save(); c.beginPath(); c.rect(0, 0, D, D); c.clip();
  spoon(c, 262, 690, 362, 290);
  c.restore();
  shape(c, () => rrect(c, 320, 0, 110, 200, 10), CLOTH.child, 6);
  hand(c, 385, 215, 1.75, 1.4);
  arrow(c, [[150, 640], [185, 590], [250, 580]], RED, 10);
  // glass B: a hand swirls a phitkari lump
  shape(c, () => rrect(c, 830, 170, 110, 290, 10), CLOTH.child, 6);
  hand(c, 885, 470, 1.75, 1.4);
  lump(c, 855, 650, 1.5);
  arrow(c, [[960, 700], [985, 650], [940, 610]], RED, 10);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  desk(c, 860);
  shape(c, () => rrect(c, 60, 200, 960, 660, 14), COL.paper, 6);
  star(c, 285, 620, 110); star(c, 795, 620, 110);
  glass(c, 285, 860, 260, 420, 0.88, MUD);
  glass(c, 795, 860, 260, 420, 0.88, "rgba(170,212,242,0.4)");
  mud(c, 795, 860, 260, 420, 80);
  dot(c, 285, 800, 28, RED); dot(c, 795, 800, 28, COL.blue);
  // A: still full of brown cloud; B: clear above, mud below
  for (let i = 0; i < 6; i++) { const x = 225 + (i % 3) * 60, y = 560 + Math.floor(i / 3) * 90; c.globalAlpha = 0.35; shape(c, () => ell(c, x, y, 20, 12), MUDDK, 0); c.globalAlpha = 1; }
};

// setup.e2.0
const mound = (c: Ctx, x: number, y: number, r: number) => {
  const p = () => { c.moveTo(x - r, y + r * 0.2); c.bezierCurveTo(x - r, y - r * 0.9, x + r, y - r * 0.9, x + r, y + r * 0.2); c.quadraticCurveTo(x, y + r * 0.5, x - r, y + r * 0.2); c.closePath(); };
  shape(c, p, COL.paper, 6); shade(c, p, "#e4dccb", r * 0.3, r * 0.1, 0.8);
  for (let i = 0; i < 9; i++) { const a = i * 2.4, rx = x + Math.cos(a) * r * 0.55, ry = y - r * 0.15 + Math.sin(a) * r * 0.25; shape(c, () => ell(c, rx, ry, 8, 5, a), WHITE, 2.5); }
  c.globalAlpha = 0.5; line(c, [[x + r * 1.1, y + r * 0.4], [x + r * 1.6, y + r * 0.35]], 12, "#e8d9a8"); line(c, [[x - r * 1.5, y + r * 0.5], [x - r * 1.0, y + r * 0.4]], 12, "#e8d9a8"); c.globalAlpha = 1;
};
const e2_0 = (c: Ctx) => {
  ground(c);
  // the sink with a steel basin in it
  shape(c, () => rrect(c, 60, 40, 960, 330, 24), COL.steel); shade(c, () => rrect(c, 60, 40, 960, 330, 24), COL.steelDk, 20, 10, 0.4);
  shape(c, () => rrect(c, 170, 150, 740, 190, 40), COL.steelDk);
  shape(c, () => rrect(c, 505, 40, 70, 70, 12), COL.steel); shape(c, () => rrect(c, 440, 95, 140, 36, 18), COL.steel);
  bowl(c, 540, 235, 150, COL.water);
  const xs = [190, 540, 890];
  xs.forEach((x) => { plate(c, x, 770, 170, 115); mound(c, x, 765, 95); });
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 330, 14, 270, 50, 25), COL.steel); shape(c, () => rrect(c, 420, 56, 60, 76, 12), COL.steel);
  shape(c, () => rrect(c, 430, 130, 40, 290, 10), COL.water, 5); shine(c, [[442, 150], [442, 400]], 7);
  plate(c, 540, 470, 235, 92);
  mound(c, 620, 450, 30);
  for (let i = 0; i < 5; i++) drop(c, 330 + i * 40 + (i % 2) * 20, 395 + (i % 3) * 14, 10, COL.drop);
  handL(c, 232, 505, 0, 1.5);
  // scrubber on the plate
  const sp = () => rrect(c, 640, 410, 150, 80, 22);
  shape(c, sp, COL.leafDk, 6); shade(c, sp, "#2c5a26", 10, 8, 0.5);
  for (let i = 0; i < 8; i++) dot(c, 665 + (i % 4) * 32, 435 + Math.floor(i / 4) * 30, 5, COL.greenLt);
  handL(c, 930, 330, 2.5, 1.5);
  [[610, 395, 16], [680, 380, 12], [600, 520, 13], [760, 515, 15]].forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r), WHITE, 3));
  arrow(c, [[740, 330], [660, 340], [590, 330]], RED, 10);
  // drips and the basin underneath
  [[470, 590], [540, 620], [610, 595]].forEach(([x, y]) => drop(c, x, y, 13));
  bowl(c, 540, 770, 290, COL.water);
  c.beginPath(); ell(c, 540, 772, 150, 18); c.strokeStyle = WHITE; c.lineWidth = 4; c.globalAlpha = 0.7; c.stroke(); c.globalAlpha = 1;
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  bowl(c, 380, 740, 330, COL.water);
  c.beginPath(); ell(c, 380, 745, 190, 20); c.strokeStyle = WHITE; c.lineWidth = 4; c.globalAlpha = 0.7; c.stroke(); c.globalAlpha = 1;
  // the mug dipping in, full of water
  const ring = [[490, 470], [585, 475], [585, 610], [490, 620]];
  line(c, ring, 40, INK); line(c, ring, 24, COL.steel);
  const mb = () => { c.moveTo(290, 430); c.lineTo(490, 430); c.lineTo(480, 700); c.lineTo(300, 700); c.closePath(); };
  shape(c, mb, COL.steel); shade(c, mb, COL.steelDk, 55, 0);
  shape(c, () => ell(c, 390, 430, 100, 24), COL.water, 5);
  shine(c, [[322, 480], [330, 660]], 9);
  handL(c, 715, 545, Math.PI, 1.5);
  arrow(c, [[225, 690], [215, 560], [225, 470]], RED, 10);
  // tally marks on paper
  shape(c, () => rrect(c, 700, 80, 300, 330, 12), COL.paper, 6);
  const tally = (x: number, y: number, five: boolean) => { for (let i = 0; i < 4; i++) line(c, [[x + i * 28, y], [x + i * 28, y + 70]], 7); if (five) line(c, [[x - 12, y + 58], [x + 96, y + 12]], 7); };
  tally(740, 110, true); tally(740, 220, false); drop(c, 920, 330, 14);
};

// setup.e3.0
const pot = (c: Ctx, x: number, y: number, w: number, h: number, soil: string, soilDk: string) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.6, w * 0.07);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.35, y); c.lineTo(x - w * 0.35, y); c.closePath(); };
  shape(c, body, TERRA); shade(c, body, TERRADK, w * 0.2, 0, 0.6);
  shape(c, () => ell(c, x, y - h - 4, w / 2 - 8, 36), soilDk, 5);
  shape(c, () => ell(c, x, y - h - 10, w / 2 - 22, 28), soil, 0);
  return y - h - 8;
};
const e3_0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 30, 1000, 740, 18), WHITE, 6);
  shape(c, () => rrect(c, 70, 60, 940, 680, 10), COL.sky, 5);
  line(c, [[540, 60], [540, 740]], 8); line(c, [[70, 400], [1010, 400]], 8);
  const sx = 840, sy = 210;
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[sx + Math.cos(a) * 118, sy + Math.sin(a) * 118], [sx + Math.cos(a) * 165, sy + Math.sin(a) * 165]], 12, COL.orange); }
  shape(c, () => ell(c, sx, sy, 98, 98), COL.yellow, 6);
  c.fillStyle = "#e8cf9a"; c.fillRect(0, 760, D, 130); c.fillStyle = "#c9a266"; c.fillRect(0, 890, D, 190); line(c, [[0, 760], [D, 760]], 6); line(c, [[0, 890], [D, 890]], 6);
  const t1 = pot(c, 290, 860, 340, 300, "#5a3a26", "#3f2818");
  const t2 = pot(c, 780, 860, 340, 300, "#5a3a26", "#3f2818");
  // water drops on the bare soil of the left pot
  for (let i = 0; i < 4; i++) drop(c, 210 + i * 55, t1 - 12 + (i % 2) * 14, 9, COL.drop);
  // the right pot under a blanket of dry leaves
  const cols = [COL.orange, COL.brown, COL.woodDk, "#c9823a", COL.brown];
  for (let i = 0; i < 16; i++) { const a = -0.4 + (i % 4) * 0.55 + (i > 7 ? 2.2 : 0), x = 665 + (i % 8) * 32, y = t2 - 4 + ((i * 7) % 3) * 8 - (i > 7 ? 6 : 0); leaf(c, x, y, 120, a + (i % 2 ? 0.3 : -0.3), cols[i % 5]); }
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  desk(c, 920);
  const finger = (x: number, soilY: number) => {
    shape(c, () => rrect(c, x - 70, -10, 140, 450, 8), CLOTH.child, 6);
    hand(c, x, 440, Math.PI / 2, 1.7);
    shape(c, () => rrect(c, x - 28, 545, 56, soilY - 540, 26), SKIN.child, 5);
  };
  const cover = (x: number, y: number) => { c.beginPath(); c.ellipse(x, y, 170, 40, 0, 0.05, Math.PI - 0.05); c.fillStyle = "#6a4128"; c.fill(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke(); };
  const t1 = pot(c, 290, 960, 380, 280, "#6a4128", "#3f2818");
  const t2 = pot(c, 790, 960, 380, 280, "#5a3a26", "#3f2818");
  finger(290, t1 + 40); cover(290, t1 + 4);
  const cols = [COL.orange, COL.brown, COL.woodDk, "#c9823a", COL.brown];
  for (let i = 0; i < 14; i++) leaf(c, 680 + (i % 7) * 34, t2 + ((i * 5) % 3) * 8 - (i > 6 ? 8 : 0), 110, -0.5 + (i % 4) * 0.5 + (i > 6 ? 2.4 : 0), cols[i % 5]);
  finger(790, t2 + 40); cover(790, t2 + 4);
  write(c, "2 cm", 420, 420, 60, RED, 8);
};

// setup.e3.2
const heap = (c: Ctx, x: number, y: number, w: number, h: number, fill: string, dk: string) => {
  shadow(c, x + w * 0.08, y + 6, w * 0.55, 26);
  const p = () => { c.moveTo(x - w / 2, y); c.bezierCurveTo(x - w * 0.42, y - h * 1.25, x + w * 0.42, y - h * 1.25, x + w / 2, y); c.quadraticCurveTo(x, y + 40, x - w / 2, y); c.closePath(); };
  shape(c, p, fill); shade(c, p, dk, w * 0.18, h * 0.05, 0.6);
};
const e3_2 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[50, 250], [1030, 250], [1030, 900], [50, 900]]), "#ece8dc", 6);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 2; k++) { const y = 290 + r * 40, x0 = 80 + k * 490; line(c, [[x0, y], [x0 + 440, y]], 8, "#cfcabc"); }
  heap(c, 270, 790, 400, 320, "#dcbf90", "#b99a68");
  heap(c, 690, 790, 400, 320, "#5a3a26", "#3f2818");
  const r = [[210, 600], [320, 560], [260, 700], [370, 670], [180, 720]];
  r.forEach(([x, y]) => shape(c, () => ell(c, x, y, 7, 5), "#b99a68", 0));
  const r2 = [[620, 600], [740, 570], [680, 690], [780, 680], [580, 720]];
  r2.forEach(([x, y]) => shape(c, () => ell(c, x, y, 9, 6), COL.drop, 2.5));
  const cols = [COL.orange, COL.brown, COL.woodDk];
  [[950, 850, 0.5], [930, 800, -0.7], [960, 790, 0.1]].forEach(([x, y, a], i) => leaf(c, x, y, 95, a, cols[i]));
};

export const su_waterSavingWater = cards("sci.water.saving-water.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
