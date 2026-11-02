import type { Ctx } from "./core";
import { COL, INK, WHITE, RED, SKIN, CLOTH, cards, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, rnd } from "./flatKit";

// sci.materials.properties.L3 picture cards (flat style)
const SOAP = "#f4b6c8", SOAPDK = "#d98fa8", BRICK = "#c4553a", BRICKDK = "#9c3f2a", GRASS = "#7fb85a", PAPER = "#fffaf0", SUN = "#ffd34d";

const lift = (c: Ctx, a: number) => { c.globalAlpha = a; };
// a spoon, handle end at (x, y), pointing up when rot = 0
const spoon = (c: Ctx, x: number, y: number, len: number, rot: number, col: string, dk: string) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const hw = len * 0.035, h = () => polyP(c, [[-hw * 1.3, 0], [hw * 1.3, 0], [hw * 0.7, -len * 0.72], [-hw * 0.7, -len * 0.72]]);
  shape(c, h, col, 5); shade(c, h, dk, hw * 0.8, 0, 0.8);
  const b = () => ell(c, 0, -len * 0.86, len * 0.13, len * 0.17);
  shape(c, b, col, 5); shade(c, b, dk, len * 0.04, len * 0.04, 0.8);
  shape(c, () => ell(c, 0, -len * 0.86, len * 0.08, len * 0.11), dk, 0);
  shine(c, [[-len * 0.07, -len * 0.92], [-len * 0.05, -len * 0.8]], 6);
  c.restore();
};
const thermo = (c: Ctx, x: number, y: number, h: number, lvl: number) => {
  shape(c, () => rrect(c, x - 22, y - h, 44, h - 30, 22), PAPER, 6);
  const top = y - 40 - (h - 90) * lvl;
  shape(c, () => rrect(c, x - 9, top, 18, y - 40 - top, 9), RED, 0);
  shape(c, () => ell(c, x, y - 28, 38, 38), RED, 6);
  shine(c, [[x - 14, y - 40], [x - 12, y - 16]], 6);
  for (let i = 0; i < 6; i++) line(c, [[x + 22, y - h + 50 + i * ((h - 150) / 5)], [x + 40, y - h + 50 + i * ((h - 150) / 5)]], 4);
};
const torch = (c: Ctx, x: number, y: number, s = 1) => { // pointing right, lens centre at (x, y)
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => rrect(c, -230, -30, 200, 60, 12), COL.blue, 6);
  shape(c, () => polyP(c, [[-40, -30], [0, -62], [0, 62], [-40, 30]]), COL.steel, 6);
  shape(c, () => rrect(c, -150, -38, 26, 76, 6), COL.blueDk, 5);
  shape(c, () => ell(c, 0, 0, 12, 56), COL.yellow, 5);
  c.restore();
};
const beam = (c: Ctx, x1: number, y1: number, h1: number, x2: number, h2: number, col = "rgba(255,226,120,0.55)") => {
  c.beginPath(); polyP(c, [[x1, y1 - h1], [x2, y1 - h2], [x2, y1 + h2], [x1, y1 + h1]]); c.fillStyle = col; c.fill();
};
const bag = (c: Ctx, x: number, y: number, w: number, h: number, col: string, dk: string) => { // paper bag / sack, bottom centre (x, y)
  shadow(c, x + w * 0.1, y + 8, w * 0.6, w * 0.1);
  const b = () => polyP(c, [[x - w / 2, y - h], [x + w / 2, y - h], [x + w / 2 + 6, y], [x - w / 2 - 6, y]]);
  shape(c, b, col, 6); shade(c, b, dk, w * 0.18, 0, 0.9);
  shape(c, () => polyP(c, [[x - w / 2, y - h], [x + w / 2, y - h], [x + w / 2 - 14, y - h - 36], [x - w / 2 + 14, y - h - 36]]), col, 6);
};
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, col = COL.steel, dk = COL.steelDk) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.11);
  const b = () => polyP(c, [[x - w / 2, y - h], [x + w / 2, y - h], [x + w * 0.4, y], [x - w * 0.4, y]]);
  shape(c, b, col, 6); shade(c, b, dk, w * 0.2, 0, 0.8);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.08), COL.steelIn, 5);
  shine(c, [[x - w * 0.3, y - h * 0.85], [x - w * 0.25, y - h * 0.15]], 10);
};
const water = (c: Ctx, x: number, y: number, w: number, h: number, lvl: number) => { // a see-through tank, bottom-left (x, y)
  shadow(c, x + w / 2 + 14, y + 8, w / 2 + 10, 20);
  const wy = y - h * lvl;
  shape(c, () => rrect(c, x, wy, w, y - wy, 8), COL.water, 0);
  shape(c, () => rrect(c, x, y - h, w, h, 14), "rgba(214,236,250,0.35)", 7);
  line(c, [[x + 6, wy], [x + w - 6, wy]], 5, COL.waterDk);
  shine(c, [[x + 24, y - h + 30], [x + 24, y - 40]], 9);
};
const sheet = (c: Ctx, x: number, y: number, w: number, h: number, col: string, a = 0.5) => {
  c.globalAlpha = a; c.fillStyle = col; c.fillRect(x, y, w, h); c.globalAlpha = 1;
  c.strokeStyle = INK; c.lineWidth = 6; c.lineJoin = "round"; c.strokeRect(x, y, w, h);
};
const ball = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), RED, 6); shade(c, () => ell(c, x, y, r, r), "#a4231a", r * 0.3, r * 0.3, 0.6); shine(c, [[x - r * 0.5, y - r * 0.2], [x - r * 0.2, y - r * 0.55]], 8);
};
const blurBall = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 6; i++) { c.beginPath(); ell(c, x, y, r + i * 14, r + i * 14); c.fillStyle = "rgba(215,55,43,0.16)"; c.fill(); }
};
const bar = (c: Ctx, x: number, y: number, w: number, col: string) => { shape(c, () => rrect(c, x, y, w, 26, 13), col, 4); };
const drop = (c: Ctx, x: number, y: number, s: number, col = COL.waterDk) => shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 1.1, y - s * 0.1, x + s * 0.9, y + s * 0.3); c.arc(x, y + s * 0.3, s * 0.9, 0, Math.PI); c.quadraticCurveTo(x - s * 1.1, y - s * 0.1, x, y - s * 1.5); c.closePath(); }, col, 4);

// ---- 0 intro: spinning fine cotton thread at dawn, a very fine cloth beside
const intro = (c: Ctx) => {
  ground(c, "#fde3c4");
  shape(c, () => ell(c, 800, 330, 120, 120), SUN, 0); c.globalAlpha = 0.5; shape(c, () => ell(c, 800, 330, 175, 175), SUN, 0); c.globalAlpha = 1;
  c.fillStyle = COL.water; c.fillRect(0, 430, 1080, 150); line(c, [[0, 430], [1080, 430]], 6);
  c.fillStyle = "rgba(255,255,255,0.4)"; c.fillRect(0, 430, 1080, 40);
  c.fillStyle = GRASS; c.fillRect(0, 580, 1080, 500); line(c, [[0, 580], [1080, 580]], 6);
  for (let i = 0; i < 40; i++) line(c, [[20 + i * 27, 700 + (i % 5) * 60], [26 + i * 27, 676 + (i % 5) * 60]], 4, COL.greenDk);
  // cloth on the grass: grass shows through
  const cl = () => polyP(c, [[570, 790], [1020, 770], [1040, 940], [560, 960]]);
  c.save(); c.beginPath(); cl(); c.clip();
  c.fillStyle = "rgba(255,250,240,0.55)"; c.fillRect(540, 740, 540, 260); c.restore();
  c.beginPath(); cl(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  for (let i = 0; i < 6; i++) line(c, [[600 + i * 70, 800 + i * -2], [600 + i * 70, 950 - i * 2]], 2, "rgba(43,35,64,0.25)");
  person(c, 270, 930, 480, { adult: true, sit: true, armR: [-0.5, -0.9], armL: [1.2, 0.3] });
  person(c, 460, 940, 360, { sit: true, armR: [0.7, 0.9], armL: [1.0, 0.8] });
  line(c, [[345, 640], [345, 760]], 3, INK); shape(c, () => ell(c, 345, 770, 16, 22), COL.wood, 4);
};
// ---- 1 summary: steel spoon, wooden spoon, a thermometer
const summary = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 950, 400, 36);
  spoon(c, 230, 930, 760, 0.12, COL.steel, COL.steelDk);
  spoon(c, 850, 930, 760, -0.12, COL.wood, COL.woodDk);
  thermo(c, 540, 930, 700, 0.45);
  arrow(c, [[330, 300], [440, 300]], RED, 9); arrow(c, [[750, 300], [640, 300]], RED, 9);
};
// ---- e1 snap, bend or spring back
const e1 = (c: Ctx) => {
  ground(c);
  // snapped chalk
  shadow(c, 190, 780, 140, 26);
  shape(c, () => polyP(c, [[70, 560], [130, 540], [160, 730], [100, 745]]), PAPER, 6);
  shape(c, () => polyP(c, [[210, 590], [270, 612], [220, 770], [160, 750]]), PAPER, 6);
  line(c, [[130, 545], [160, 575], [150, 605], [165, 640], [158, 730]], 3, INK);
  // bent ruler, then sprung back
  shape(c, () => { c.moveTo(430, 760); c.bezierCurveTo(430, 480, 720, 440, 790, 560); c.lineTo(740, 590); c.bezierCurveTo(690, 530, 500, 540, 500, 760); c.closePath(); }, COL.sky, 6);
  arrow(c, [[640, 380], [740, 430]], RED, 9);
  shape(c, () => rrect(c, 860, 480, 70, 300, 10), COL.sky, 6); arrow(c, [[960, 700], [960, 520]], RED, 9);
  shadow(c, 640, 810, 350, 26);
};
// ---- e2 droop test
const e2 = (c: Ctx) => {
  ground(c);
  shadow(c, 400, 900, 380, 30);
  shape(c, () => rrect(c, 90, 600, 500, 60, 8), COL.wood, 6);
  shape(c, () => rrect(c, 150, 660, 60, 240, 6), COL.woodDk, 6); shape(c, () => rrect(c, 470, 660, 60, 240, 6), COL.woodDk, 6);
  shape(c, () => rrect(c, 130, 520, 220, 80, 8), COL.blue, 6);
  const s = () => { c.moveTo(250, 590); c.lineTo(600, 586); c.bezierCurveTo(780, 590, 860, 640, 900, 740); c.lineTo(860, 760); c.bezierCurveTo(820, 680, 760, 650, 600, 646); c.lineTo(250, 650); c.closePath(); };
  shape(c, s, COL.paper, 6);
  shape(c, () => ell(c, 880, 705, 36, 36), COL.yellow, 6);
  arrow(c, [[960, 620], [960, 790]], RED, 9);
  line(c, [[1000, 586], [1000, 760]], 4); line(c, [[985, 586], [1015, 586]], 4); line(c, [[985, 760], [1015, 760]], 4);
};
// ---- e3 dry or damp strip
const e3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 120, 140, 840, 40, 8), COL.wood, 6);
  // dry strip with a cup
  shape(c, () => rrect(c, 240, 180, 70, 330, 4), PAPER, 6);
  shape(c, () => polyP(c, [[180, 510], [370, 510], [350, 690], [200, 690]]), COL.teal, 6);
  for (let i = 0; i < 4; i++) shape(c, () => ell(c, 250 + i * 32, 678, 14, 14), COL.yellow, 4);
  // wet strip torn, cup on the table
  shape(c, () => polyP(c, [[750, 180], [820, 180], [820, 330], [800, 350], [820, 370], [790, 400], [750, 350]]), COL.sky, 6);
  [[760, 260], [800, 300], [775, 340]].forEach(([x, y]) => drop(c, x, y, 10));
  arrow(c, [[860, 400], [860, 540]], RED, 9);
  shadow(c, 770, 910, 200, 26);
  shape(c, () => polyP(c, [[670, 760], [870, 760], [850, 900], [690, 900]]), COL.teal, 6);
  for (let i = 0; i < 4; i++) shape(c, () => ell(c, 730 + i * 30, 880, 14, 14), COL.yellow, 4);
  shape(c, () => polyP(c, [[740, 600], [820, 600], [800, 700], [740, 690]]), COL.sky, 6);
  drop(c, 520, 560, 14); drop(c, 560, 620, 12);
};
// ---- e4 vanishing drop
const e4 = (c: Ctx) => {
  ground(c);
  shadow(c, 270, 800, 230, 30); shadow(c, 800, 800, 230, 30);
  shape(c, () => polyP(c, [[70, 800], [470, 800], [420, 620], [120, 620]]), PAPER, 6);
  shape(c, () => ell(c, 270, 710, 90, 36), "#bcd8ee", 0);
  shape(c, () => polyP(c, [[600, 800], [1000, 800], [950, 620], [650, 620]]), "#e9f3f0", 6);
  shape(c, () => ell(c, 800, 700, 42, 34), COL.water, 5); shine(c, [[782, 688], [796, 680]], 7);
  [270, 800].forEach((x) => { shape(c, () => rrect(c, x - 10, 240, 20, 100, 8), COL.steel, 6); shape(c, () => polyP(c, [[x - 10, 340], [x + 10, 340], [x, 400]]), COL.steel, 5); });
  drop(c, 270, 470, 26); drop(c, 800, 470, 26);
  arrow(c, [[270, 500], [270, 590]], RED, 9); arrow(c, [[800, 500], [800, 590]], RED, 9);
};
// ---- e5 layers to darkness
const e5 = (c: Ctx) => {
  ground(c);
  torch(c, 270, 540, 1);
  beam(c, 270, 540, 56, 560, 70);
  for (let i = 0; i < 7; i++) { c.save(); c.translate(560 + i * 12, 440); shape(c, () => polyP(c, [[0, 0], [30, -10], [30, 190], [0, 200]]), "rgba(255,250,240,0.8)", 4); c.restore(); }
  beam(c, 640, 540, 60, 830, 90, "rgba(255,226,120,0.3)");
  shape(c, () => rrect(c, 850, 280, 190, 520, 8), "#dcd2bd", 6);
  c.globalAlpha = 0.35; shape(c, () => ell(c, 945, 540, 70, 90), COL.yellow, 0); c.globalAlpha = 1;
  shadow(c, 600, 800, 350, 24);
};
// ---- a1 feely bag
const a1 = (c: Ctx) => {
  ground(c);
  bag(c, 460, 880, 420, 480, COL.cloth, "#e4dccb");
  shape(c, () => rrect(c, 330, 340, 260, 60, 30), "#e4dccb", 6);
  line(c, [[340, 400], [580, 400]], 6, RED);
  hand(c, 700, 310, Math.PI * 0.97, 2.2, SKIN.child, CLOTH.child);
  spoon(c, 90, 1000, 300, 1.2, COL.steel, COL.steelDk);
  spoon(c, 90, 920, 300, 1.2, COL.wood, COL.woodDk);
  shape(c, () => ell(c, 800, 960, 56, 46), "#f7f3e8", 6);
  shape(c, () => ell(c, 930, 970, 46, 34, 0.3), COL.grey, 6);
  shape(c, () => ell(c, 690, 975, 40, 40), COL.red, 6);
  shape(c, () => ell(c, 690, 975, 20, 20), BG0, 5);
};
const BG0 = "#efe4cf";
// ---- a2 passport: tumbler, tawa with wooden handle, booklet
const a2 = (c: Ctx) => {
  ground(c);
  tumbler(c, 230, 760, 280, 400);
  shadow(c, 560, 640, 170, 40);
  shape(c, () => ell(c, 560, 540, 160, 100), COL.black, 6);
  shape(c, () => ell(c, 560, 540, 120, 70), "#4a4450", 4);
  shape(c, () => polyP(c, [[690, 570], [950, 640], [935, 690], [680, 620]]), COL.wood, 6);
  shape(c, () => polyP(c, [[130, 840], [520, 810], [540, 1000], [150, 1030]]), PAPER, 6);
  shape(c, () => polyP(c, [[520, 810], [900, 840], [880, 1030], [540, 1000]]), "#f3ecd8", 6);
  for (let i = 0; i < 4; i++) { line(c, [[570, 860 + i * 30], [840, 872 + i * 30]], 4, COL.greyDk); line(c, [[160, 862 + i * 30], [490, 840 + i * 30]], 4, COL.greyDk); }
  shape(c, () => rrect(c, 770, 700, 30, 190, 4), COL.yellow, 5);
};
// ---- a3 property ladder: six things on a string
const a3 = (c: Ctx) => {
  ground(c);
  line(c, [[40, 240], [1040, 262]], 7);
  const items: ((x: number, y: number) => void)[] = [
    (x, y) => shape(c, () => rrect(c, x - 26, y, 52, 250, 8), PAPER, 6),
    (x, y) => spoon(c, x, y + 300, 300, 0, COL.wood, COL.woodDk),
    (x, y) => spoon(c, x, y + 300, 300, 0, COL.steel, COL.steelDk),
    (x, y) => shape(c, () => rrect(c, x - 30, y, 60, 330, 8), COL.sky, 6),
    (x, y) => shape(c, () => polyP(c, [[x - 60, y], [x + 60, y], [x + 70, y + 260], [x - 70, y + 260]]), COL.cloth, 6),
    (x, y) => shape(c, () => rrect(c, x - 55, y, 110, 110, 22), COL.pink, 6),
  ];
  items.forEach((f, i) => { const x = 110 + i * 170, y = 240 + i * 4; f(x, y + 20); shape(c, () => rrect(c, x - 14, y - 22, 28, 60, 6), COL.orange, 5); });
  arrow(c, [[120, 900], [960, 900]], RED, 11);
};
// ---- a4 through coloured plastic
const a4 = (c: Ctx) => {
  ground(c);
  torch(c, 280, 430, 0.9);
  beam(c, 280, 430, 50, 480, 130, "rgba(255,226,120,0.5)");
  sheet(c, 460, 280, 90, 300, "#e4523b", 0.6);
  beam(c, 550, 430, 130, 800, 150, "rgba(228,82,59,0.35)");
  shape(c, () => rrect(c, 800, 260, 230, 340, 8), WHITE, 6);
  c.globalAlpha = 0.6; shape(c, () => ell(c, 915, 430, 80, 120), "#e4523b", 0); c.globalAlpha = 1;
  sheet(c, 160, 720, 240, 260, "#6aa53f", 0.6);
  sheet(c, 440, 720, 240, 260, "#5b8fd6", 0.6);
  sheet(c, 720, 720, 240, 260, "#e4523b", 0.6);
};
// ---- a5 three veils
const a5 = (c: Ctx) => {
  ground(c);
  line(c, [[40, 200], [1040, 200]], 8);
  [0, 1, 2].forEach((i) => {
    const x = 190 + i * 350;
    person(c, x, 940, 520, { armL: [-0.9, -1.5], armR: [-0.9, -1.5] });
    const col = i === 0 ? "rgba(214,236,250,0.35)" : i === 1 ? "rgba(255,250,240,0.8)" : "#c9895b";
    c.fillStyle = col; c.fillRect(x - 160, 210, 320, 770);
    c.strokeStyle = INK; c.lineWidth = 6; c.strokeRect(x - 160, 210, 320, 770);
    [-130, 0, 130].forEach((dx) => shape(c, () => ell(c, x + dx, 206, 14, 14), COL.orange, 5));
    if (i === 2) { line(c, [[x - 100, 300], [x - 100, 960]], 3, "#8a5a3c"); line(c, [[x + 100, 300], [x + 100, 960]], 3, "#8a5a3c"); }
  });
};
// ---- a6 float lab: foil boat floats, foil ball sinks
const a6 = (c: Ctx) => {
  ground(c);
  water(c, 120, 900, 840, 620, 0.62);
  shape(c, () => polyP(c, [[330, 480], [660, 480], [610, 560], [380, 560]]), COL.steel, 6);
  shine(c, [[400, 505], [600, 505]], 8);
  shape(c, () => ell(c, 560, 820, 70, 62), COL.steel, 6); shade(c, () => ell(c, 560, 820, 70, 62), COL.steelDk, 20, 20, 0.7);
  shine(c, [[525, 800], [545, 785]], 7);
};
// ---- p1 property trumps
const p1 = (c: Ctx) => {
  ground(c);
  const cardAt = (x: number, y: number, rot: number, n: number, icon: () => void) => {
    c.save(); c.translate(x, y); c.rotate(rot);
    shadow(c, 14, 270, 150, 20);
    shape(c, () => rrect(c, -150, -230, 300, 460, 24), PAPER, 7);
    shape(c, () => rrect(c, -120, -200, 240, 190, 14), COL.sky, 5);
    icon();
    [0, 1, 2].forEach((k) => { bar(c, -110, 20 + k * 62, 80 + ((n * 53 + k * 71) % 150), [COL.teal, COL.orange, COL.purple][k]); });
    c.restore();
  };
  cardAt(280, 560, -0.22, 1, () => spoon(c, -10, -20, 190, 0, COL.steel, COL.steelDk));
  cardAt(800, 560, 0.2, 2, () => shape(c, () => rrect(c, -60, -170, 120, 130, 14), SOAP, 5));
  cardAt(540, 520, 0, 3, () => spoon(c, -10, -20, 190, 0, COL.wood, COL.woodDk));
};
// ---- c1 mystery material
const c1 = (c: Ctx) => {
  ground(c);
  [[200, "1"], [540, "2"], [880, "3"]].forEach(([x, n]) => {
    bag(c, x as number, 700, 240, 340, "#c9a06a", "#a8723f");
    write(c, n as string, (x as number) - 22, 520, 120, INK, 12);
  });
  torch(c, 220, 880, 0.55);
  tumbler(c, 560, 1010, 110, 130, COL.glass, COL.glassEdge);
  shape(c, () => rrect(c, 830, 880, 140, 80, 14), COL.red, 6); shape(c, () => rrect(c, 830, 930, 140, 30, 6), COL.steel, 5);
};
// ---- c2 privacy window
const c2 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 170, 170, 90, 90), SUN, 6);
  [[200, 340, 360, 480], [120, 360, 300, 560]].forEach(([a, b, d, e]) => arrow(c, [[a, b], [d, e]], COL.orange, 9));
  shape(c, () => rrect(c, 330, 330, 520, 520, 20), COL.brown, 6);
  c.fillStyle = BG0; c.fillRect(370, 370, 440, 440);
  c.save(); c.beginPath(); c.rect(370, 370, 440, 440); c.clip(); person(c, 590, 1000, 620, { armR: [-0.9, -1.4] }); c.restore();
  c.fillStyle = "rgba(255,255,255,0.9)"; c.fillRect(370, 370, 440, 440);
  c.strokeStyle = INK; c.lineWidth = 6; c.strokeRect(370, 370, 440, 440);
  arrow(c, [[130, 560], [330, 600]], COL.orange, 9); arrow(c, [[900, 700], [830, 640]], COL.orange, 9);
};
// ---- terms
const tHard = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 870, 380, 30);
  shape(c, () => rrect(c, 160, 600, 640, 250, 40), SOAP, 6); shade(c, () => rrect(c, 160, 600, 640, 250, 40), SOAPDK, 40, 20, 0.7);
  line(c, [[250, 640], [520, 640]], 14, SOAPDK);
  c.save(); c.translate(530, 640); c.rotate(-0.9);
  shape(c, () => polyP(c, [[-8, 0], [8, 0], [8, 400], [-8, 400]]), COL.steel, 6); shape(c, () => rrect(c, -34, 400, 68, 20, 6), COL.steel, 6);
  shape(c, () => polyP(c, [[-8, 0], [8, 0], [0, -34]]), COL.steelDk, 5);
  c.restore();
  arrow(c, [[800, 420], [660, 520]], RED, 10);
};
const tFlex = (c: Ctx) => {
  ground(c);
  const r = () => { c.moveTo(250, 520); c.bezierCurveTo(420, 780, 660, 780, 830, 520); c.lineTo(790, 490); c.bezierCurveTo(640, 700, 440, 700, 290, 490); c.closePath(); };
  shape(c, r, COL.sky, 6);
  hand(c, 150, 560, -0.25, 1.1, SKIN.child, CLOTH.child);
  c.save(); c.translate(930, 560); c.scale(-1, 1); hand(c, 0, 0, -0.25, 1.1, SKIN.child, CLOTH.child); c.restore();
  arrow(c, [[540, 280], [540, 400]], RED, 10);
};
const tElastic = (c: Ctx) => {
  ground(c);
  const band = (x1: number, x2: number, y: number, w: number) => { shape(c, () => rrect(c, x1, y - w / 2, x2 - x1, w, w / 2), COL.orange, 6); shape(c, () => rrect(c, x1 + 22, y - w / 2 + 14, x2 - x1 - 44, w - 28, (w - 28) / 2), BG0, 5); };
  band(400, 680, 330, 160);
  shape(c, () => rrect(c, 140, 640, 40, 200, 10), COL.steel, 6); shape(c, () => rrect(c, 900, 640, 40, 200, 10), COL.steel, 6);
  band(160, 920, 740, 70);
  arrow(c, [[140, 600], [60, 600]], RED, 9); arrow(c, [[940, 600], [1020, 600]], RED, 9);
};
const tBrittle = (c: Ctx) => {
  ground(c);
  const ring = (x: number, y: number, rx: number, ry: number, a0 = 0, a1 = Math.PI * 2) => { c.beginPath(); c.ellipse(x, y, rx, ry, 0, a0, a1); c.strokeStyle = INK; c.lineWidth = 38; c.stroke(); c.strokeStyle = COL.teal; c.lineWidth = 24; c.stroke(); };
  ring(540, 300, 170, 80);
  arrow(c, [[860, 260], [860, 520]], RED, 10);
  c.fillStyle = "#cfc7b6"; c.fillRect(0, 780, 1080, 300); line(c, [[0, 780], [1080, 780]], 6);
  [[3.5, 4.6, 260, 860], [4.6, 5.7, 430, 880], [0.3, 1.3, 600, 900], [1.4, 2.4, 760, 870], [2.5, 3.4, 900, 900]].forEach(([a, b, x, y]) => ring(x, y, 90, 50, a, b));
};
const tTexture = (c: Ctx) => {
  ground(c);
  shadow(c, 300, 850, 230, 30); shadow(c, 790, 850, 230, 30);
  shape(c, () => rrect(c, 80, 300, 440, 520, 14), "#d8b27a", 6);
  const r = rnd(5); for (let i = 0; i < 380; i++) { const x = 90 + r() * 420, y = 310 + r() * 500; shape(c, () => ell(c, x, y, 3 + r() * 3, 3 + r() * 2), r() < 0.5 ? "#8a5a3c" : "#f2dfb4", 0); }
  shape(c, () => rrect(c, 570, 300, 430, 520, 14), "#f3f0ea", 6);
  line(c, [[620, 700], [720, 560], [800, 640], [930, 380]], 5, "#c9c4bb"); shine(c, [[610, 360], [640, 340]], 10);
  shine(c, [[600, 760], [880, 560]], 14);
};
const tShiny = (c: Ctx) => {
  ground(c);
  tumbler(c, 290, 880, 340, 500);
  [[110, 280, 160, 330], [450, 270, 410, 330], [100, 460, 150, 450]].forEach(([a, b, d, e]) => line(c, [[a, b], [d, e]], 9, COL.yellow));
  shadow(c, 790, 890, 220, 30);
  shape(c, () => rrect(c, 600, 640, 380, 220, 10), BRICK, 6); shade(c, () => rrect(c, 600, 640, 380, 220, 10), BRICKDK, 40, 30, 0.7);
  line(c, [[600, 750], [980, 750]], 5, "#7d3322"); line(c, [[790, 640], [790, 750]], 5, "#7d3322"); line(c, [[700, 750], [700, 860]], 5, "#7d3322"); line(c, [[880, 750], [880, 860]], 5, "#7d3322");
};
const tTransparent = (c: Ctx) => {
  ground(c);
  ball(c, 540, 560, 150);
  sheet(c, 270, 280, 540, 600, "#cbe6f7", 0.12);
  shine(c, [[320, 330], [320, 560]], 12);
};
const tTranslucent = (c: Ctx) => {
  ground(c);
  blurBall(c, 540, 560, 90);
  sheet(c, 270, 280, 540, 600, "#ffffff", 0.7);
};
const tOpaque = (c: Ctx) => {
  ground(c);
  torch(c, 260, 540, 1);
  beam(c, 260, 540, 56, 560, 150);
  shape(c, () => rrect(c, 560, 370, 60, 340, 10), COL.steel, 6);
  shape(c, () => rrect(c, 820, 240, 210, 600, 8), "#f6e8b8", 6);
  shape(c, () => rrect(c, 820, 400, 210, 280, 0), "#3a3540", 0);
  line(c, [[820, 240], [1030, 240], [1030, 840], [820, 840], [820, 240]], 6);
};
const tWaterproof = (c: Ctx) => {
  ground(c);
  const s = () => polyP(c, [[150, 520], [760, 380], [940, 680], [330, 820]]);
  shape(c, s, COL.yellow, 6); shade(c, s, COL.orange, 40, 40, 0.5);
  [[360, 560], [520, 520], [660, 500], [470, 650], [700, 590]].forEach(([x, y]) => drop(c, x, y, 18));
  arrow(c, [[820, 640], [900, 790]], RED, 9);
  [[180, 160], [380, 120], [600, 170], [820, 120], [960, 220], [280, 300]].forEach(([x, y]) => drop(c, x, y, 20));
  drop(c, 930, 840, 20);
};
const tAbsorbent = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 400, 860, 340, 70), COL.water, 5); shine(c, [[200, 850], [330, 840]], 9);
  shadow(c, 720, 800, 200, 30);
  const sp = () => rrect(c, 560, 560, 340, 240, 30);
  shape(c, sp, COL.yellow, 6);
  const r = rnd(9); for (let i = 0; i < 20; i++) shape(c, () => ell(c, 590 + r() * 280, 590 + r() * 180, 12, 9), COL.orange, 3);
  c.save(); c.beginPath(); sp(); c.clip(); c.globalAlpha = 0.5; c.fillStyle = COL.waterDk; c.fillRect(540, 690, 400, 130); c.restore(); c.globalAlpha = 1;
  arrow(c, [[500, 760], [580, 690]], RED, 10);
  drop(c, 360, 560, 22);
};
const tConductor = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 930, 270, 36);
  shape(c, () => polyP(c, [[250, 640], [830, 640], [780, 920], [300, 920]]), WHITE, 6);
  shape(c, () => ell(c, 540, 640, 290, 50), "#a8723f", 5);
  shape(c, () => rrect(c, 800, 690, 140, 130, 60), WHITE, 6);
  spoon(c, 620, 700, 620, 0.22, COL.steel, COL.steelDk);
  [380, 500, 590].forEach((y, i) => arrow(c, [[740 + i * -50 + 70, y + 50], [760 + i * -50 + 70, y - 40]], RED, 9));
  [[360, 560], [430, 540]].forEach(([x, y]) => line(c, [[x, y], [x + 20, y - 40], [x - 10, y - 80]], 7, COL.greyDk));
};
const tFloat = (c: Ctx) => {
  ground(c);
  water(c, 150, 940, 780, 640, 0.62);
  shape(c, () => rrect(c, 380, 480, 160, 130, 30), "#c99a5e", 6);
  shine(c, [[400, 510], [400, 570]], 7);
  shape(c, () => rrect(c, 630, 790, 24, 140, 8), COL.steel, 6);
  shape(c, () => rrect(c, 604, 790, 76, 18, 6), COL.steel, 6);
  arrow(c, [[860, 560], [860, 700]], RED, 9);
};
const tScale = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 340, 200, 40, 780, 8), COL.wood, 6); shape(c, () => rrect(c, 700, 200, 40, 780, 8), COL.wood, 6);
  for (let i = 0; i < 10; i++) shape(c, () => rrect(c, 380, 240 + i * 74, 320, 22, 6), COL.woodDk, 5);
  shape(c, () => polyP(c, [[150, 960], [270, 960], [270, 880], [210, 840], [150, 880]]), PAPER, 6);
  shape(c, () => polyP(c, [[830, 290], [950, 290], [980, 220], [890, 150], [800, 220]]), COL.sky, 6);
  line(c, [[800, 220], [980, 220]], 4); line(c, [[850, 290], [890, 150], [930, 290]], 3);
  arrow(c, [[190, 720], [190, 380]], RED, 11);
};

export const ic_materialsPropertiesL3 = cards("sci.materials.properties.L3 cards", [
  intro, summary, e1, e2, e3, e4, e5, a1, a2, a3, a4, a5, a6, p1, c1, c2,
  tHard, tFlex, tElastic, tBrittle, tTexture, tShiny, tTransparent, tTranslucent, tOpaque, tWaterproof, tAbsorbent, tConductor, tFloat, tScale,
]);
