import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, arrow, cards, ell, ground, line, polyP, rrect, shade, shadow, shape, shine, write } from "./flatKit";

// sci.making-things.design-and-build.L3 · picture cards. Flat DeepKids look, red arrows = change or movement.
const D = 1080, PI = Math.PI, GOLD = "#e8b84a", GOLDDK = "#b98a2a", TERRA = "#c9703f", TERRADK = "#a4552d";

const coin = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y + r * 0.22, r, r * 0.5), GOLDDK, 3);
  shape(c, () => ell(c, x, y, r, r * 0.5), GOLD, 3);
  shape(c, () => ell(c, x, y, r * 0.55, r * 0.26), "#f6d878", 0);
};
// a foil boat seen from the side and a little above: rim centre (cx, rimY), width w, hull height h
const boat = (c: Ctx, cx: number, rimY: number, w: number, h: number, coins: number[][] = [], rot = 0) => {
  c.save(); c.translate(cx, rimY + h / 2); c.rotate(rot); c.translate(-cx, -(rimY + h / 2));
  const ry = w * 0.1, r = w * 0.07;
  shape(c, () => ell(c, cx, rimY, w / 2, ry), COL.steelIn, 5);
  coins.forEach(([dx, dy]) => coin(c, cx + dx * w, rimY + dy * w, r));
  const hull = () => { c.moveTo(cx - w / 2, rimY); c.ellipse(cx, rimY, w / 2, ry, 0, PI, 0, true); c.lineTo(cx + w * 0.36, rimY + h); c.lineTo(cx - w * 0.36, rimY + h); c.closePath(); };
  shape(c, hull, COL.steel, 6);
  shade(c, hull, COL.steelDk, w * 0.3, 0);
  shine(c, [[cx - w * 0.38, rimY + h * 0.35], [cx - w * 0.3, rimY + h * 0.8]], 7);
  c.restore();
};
// a glass tank with water; draw(wy) paints what floats, wy = y of the water surface
const tank = (c: Ctx, x: number, y: number, w: number, h: number, lv: number, draw: (wy: number) => void) => {
  const wy = y + h - lv;
  shadow(c, x + w / 2 + 25, y + h + 12, w * 0.55, 18);
  shape(c, () => rrect(c, x, y, w, h, 18), "rgba(214,236,250,0.35)", 0);
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 18); c.clip();
  c.fillStyle = COL.water; c.fillRect(x, wy, w, lv);
  draw(wy);
  c.globalAlpha = 0.5; c.fillStyle = COL.water; c.fillRect(x, wy, w, lv); c.globalAlpha = 1;
  line(c, [[x, wy], [x + w, wy]], 5, COL.waterDk);
  c.restore();
  shape(c, () => rrect(c, x, y, w, h, 18), "rgba(0,0,0,0)", 7);
  shine(c, [[x + 28, y + 40], [x + 28, y + h * 0.55]], 8);
};
const foilSquare = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + s * 0.55, y + s * 0.62, s * 0.62, s * 0.1);
  const p = [[x - s / 2, y - s * 0.18], [x + s * 0.3, y - s * 0.32], [x + s / 2, y + s * 0.18], [x - s * 0.3, y + s * 0.32]];
  shape(c, () => polyP(c, p), COL.steelIn, 6);
  line(c, [p[0], p[2]], 3, COL.steelDk); line(c, [p[1], p[3]], 3, COL.steelDk);
  shine(c, [[x - s * 0.3, y - s * 0.05], [x - s * 0.1, y - s * 0.12]], 8);
};
const katori = (c: Ctx, x: number, y: number, r: number, fillCol: string) => {
  shadow(c, x + r * 0.1, y + r * 0.62, r * 0.75, r * 0.12);
  const b = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.9, y + r * 0.75, x + r * 0.9, y + r * 0.75, x + r, y); c.closePath(); };
  shape(c, b, COL.steel); shade(c, b, COL.steelDk, r * 0.35, -r * 0.05);
  shape(c, () => ell(c, x, y, r, r * 0.2), fillCol, 5);
};
const strip = (c: Ctx, x: number, y: number, w: number, h: number) => shape(c, () => rrect(c, x, y, w, h, 6), "#fff6dd", 5);
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.15, y + 6, w * 0.6, w * 0.12);
  const b = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
  shape(c, b, COL.steel); shade(c, b, COL.steelDk, w * 0.3, 0);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.08), COL.steelIn, 5);
  shine(c, [[x - w * 0.32, y - h * 0.8], [x - w * 0.27, y - h * 0.2]], 7);
};
const ant = (c: Ctx, x: number, y: number, s: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  for (const dx of [-8, 2, 12]) { line(c, [[dx, 0], [dx - 6, -20]], 4); line(c, [[dx, 0], [dx - 6, 20]], 4); }
  line(c, [[24, -4], [38, -16]], 3); line(c, [[24, 4], [38, 16]], 3);
  const D = "#4a2f27";
  shape(c, () => ell(c, -20, 0, 14, 9), D, 4); shape(c, () => ell(c, 0, 0, 9, 7), D, 4); shape(c, () => ell(c, 20, 0, 9, 8), D, 4);
  c.restore();
};

// ---- the cards
const intro = (c: Ctx) => {
  ground(c);
  tank(c, 150, 430, 780, 440, 300, (wy) => boat(c, 540, wy - 60, 400, 140, [[-0.12, -0.02], [0.02, -0.05], [0.13, -0.02], [-0.05, -0.1], [0.07, -0.11]]));
  coin(c, 540, 235, 38); arrow(c, [[540, 280], [540, 345]]);
};
const summary = (c: Ctx) => {
  ground(c);
  tank(c, 40, 440, 470, 400, 240, (wy) => boat(c, 275, wy - 30, 220, 110, [[0.1, -0.05], [-0.1, -0.03]], 0.12));
  tank(c, 570, 440, 470, 400, 240, (wy) => boat(c, 805, wy - 75, 360, 150, [[-0.15, -0.02], [0, -0.05], [0.15, -0.02], [-0.07, -0.1], [0.08, -0.1]]));
  arrow(c, [[420, 330], [660, 330]]);
};
const e1 = (c: Ctx) => {
  ground(c);
  foilSquare(c, 250, 560, 380);
  arrow(c, [[400, 360], [520, 330], [600, 380]]);
  tank(c, 520, 520, 520, 360, 230, (wy) => boat(c, 780, wy - 55, 300, 120, [[-0.12, -0.02], [0.05, -0.04], [0.15, -0.01]]));
};
const e2 = (c: Ctx) => {
  ground(c);
  const pastes = ["#ffffff", "#f1dd9c", "#c89a62"];
  pastes.forEach((col, i) => {
    const x = 190 + i * 350;
    katori(c, x, 800, 105, col);
    strip(c, x - 130, 340, 150, 60); strip(c, x - 20, 400, 150, 60);
    shape(c, () => rrect(c, x - 20, 400, 40, 0.1, 1), col, 0);
    shape(c, () => rrect(c, x - 20, 392, 40, 24, 6), col, 4);
    arrow(c, [[x, 600], [x, 520]]);
  });
};
const a1 = (c: Ctx) => {
  ground(c); c.save(); c.translate(0, -170);
  c.fillStyle = "#e6d8bd"; c.fillRect(0, 760, 1080, 600); line(c, [[0, 760], [1080, 760]], 6);
  tumbler(c, 200, 860, 150, 210);
  // ladle
  line(c, [[420, 860], [520, 560]], 20); line(c, [[420, 860], [520, 560]], 11, COL.steel);
  shape(c, () => { c.moveTo(500, 600); c.bezierCurveTo(470, 720, 640, 740, 640, 640); c.closePath(); }, COL.steel, 6);
  shape(c, () => ell(c, 570, 610, 70, 22), COL.steelIn, 5);
  // pressure cooker
  shadow(c, 800, 872, 190, 24);
  shape(c, () => rrect(c, 650, 700, 300, 170, 18), COL.steel, 6);
  shape(c, () => rrect(c, 640, 640, 320, 80, 24), COL.steelDk, 6);
  shape(c, () => rrect(c, 600, 750, 60, 26, 10), INK, 0); shape(c, () => rrect(c, 940, 750, 60, 26, 10), INK, 0);
  shape(c, () => rrect(c, 780, 590, 40, 56, 8), COL.black, 5);
  shine(c, [[680, 740], [680, 840]], 8);
  c.restore();
};
const a3 = (c: Ctx) => {
  ground(c); c.save(); c.translate(0, -150);
  c.fillStyle = "#e6d8bd"; c.fillRect(0, 800, 1080, 600); line(c, [[0, 800], [1080, 800]], 6);
  // matka
  shadow(c, 200, 880, 150, 22);
  const m = () => { c.moveTo(150, 430); c.lineTo(250, 430); c.lineTo(255, 500); c.bezierCurveTo(380, 560, 380, 840, 200, 860); c.bezierCurveTo(20, 840, 20, 560, 145, 500); c.closePath(); };
  shape(c, m, TERRA, 6); shade(c, m, TERRADK, 50, 0); shape(c, () => ell(c, 200, 430, 55, 14), TERRADK, 6);
  // bucket
  shadow(c, 540, 880, 170, 22);
  line(c, [[380, 520], [540, 380], [700, 520]], 14); line(c, [[380, 520], [540, 380], [700, 520]], 6, COL.steelDk);
  const bk = () => { c.moveTo(370, 520); c.lineTo(710, 520); c.lineTo(660, 860); c.lineTo(420, 860); c.closePath(); };
  shape(c, bk, COL.blue, 6); shade(c, bk, COL.blueDk, 60, 0); shape(c, () => ell(c, 540, 520, 170, 26), COL.water, 6);
  // bottle
  shadow(c, 880, 880, 90, 18);
  const bt = () => { c.moveTo(830, 480); c.lineTo(930, 480); c.lineTo(930, 540); c.quadraticCurveTo(980, 580, 980, 640); c.lineTo(980, 840); c.quadraticCurveTo(980, 862, 958, 862); c.lineTo(802, 862); c.quadraticCurveTo(780, 862, 780, 840); c.lineTo(780, 640); c.quadraticCurveTo(780, 580, 830, 540); c.closePath(); };
  shape(c, bt, COL.glass, 6);
  c.save(); c.beginPath(); bt(); c.clip(); c.fillStyle = COL.water; c.fillRect(770, 640, 220, 230); c.restore(); shape(c, bt, "rgba(0,0,0,0)", 6);
  shape(c, () => rrect(c, 835, 430, 90, 56, 10), COL.orange, 6);
  shine(c, [[810, 660], [810, 820]], 8);
  c.restore();
};
const a4 = (c: Ctx) => {
  ground(c);
  tank(c, 40, 450, 470, 400, 230, (wy) => boat(c, 270, wy - 40, 330, 120, [[-0.28, -0.03], [-0.15, -0.04], [-0.23, -0.11], [-0.1, -0.09], [-0.2, -0.18]], -0.17));
  tank(c, 570, 450, 470, 400, 230, (wy) => boat(c, 805, wy - 60, 330, 120, [[-0.25, -0.02], [-0.08, -0.04], [0.1, -0.03], [0.26, -0.01]]));
  arrow(c, [[420, 340], [660, 340]]);
};
const c1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6d8bd"; c.fillRect(0, 780, 1080, 300); line(c, [[0, 780], [1080, 780]], 6);
  shadow(c, 560, 800, 340, 20);
  const card = "#d9b27a";
  shape(c, () => polyP(c, [[330, 740], [780, 740], [780, 780], [330, 780]]), card, 6);
  shape(c, () => polyP(c, [[690, 740], [740, 740], [610, 400], [560, 400]]), card, 6);
  // phone leaning back on the strut, bottom held by the front lip
  c.save(); c.translate(470, 740); c.rotate(0.3);
  shape(c, () => rrect(c, -22, -430, 44, 430, 12), COL.black, 6);
  shape(c, () => rrect(c, -34, -410, 12, 390, 4), COL.sky, 3);
  c.restore();
  shape(c, () => rrect(c, 420, 690, 28, 50, 6), card, 6);
  shape(c, () => ell(c, 200, 400, 0.1, 0.1), card, 0);
};
const c2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6d8bd"; c.fillRect(0, 0, D, D);
  shadow(c, 600, 780, 360, 70);
  shape(c, () => ell(c, 560, 540, 340, 230), COL.steel, 6);
  shape(c, () => ell(c, 560, 540, 295, 195), COL.water, 5);
  shape(c, () => ell(c, 560, 540, 165, 110), COL.steelIn, 5);
  katori(c, 560, 540, 110, "#ffffff");
  shape(c, () => ell(c, 560, 510, 80, 36), "#ffffff", 4);
  for (const [dx, dy] of [[-30, 0], [10, -8], [40, 8], [-8, 14]]) shape(c, () => ell(c, 560 + dx, 510 + dy, 5, 4), "#e9e4d8", 0);
  ant(c, 80, 540, 1.6, 0); ant(c, 130, 700, 1.5, -0.4); ant(c, 130, 380, 1.5, 0.4);
  ant(c, 960, 560, 1.5, PI);
};
const termDesign = (c: Ctx) => {
  ground(c);
  shadow(c, 300, 880, 230, 24);
  shape(c, () => polyP(c, [[110, 240], [500, 240], [500, 840], [110, 840]]), "#fffaf0", 6);
  const plan = [[190, 520], [420, 520], [385, 640], [225, 640]];
  line(c, [...plan, plan[0]], 7, COL.blueDk);
  for (let i = 0; i < 5; i++) line(c, [[140, 300 + i * 0], [140, 300]], 1);
  line(c, [[190, 440], [190, 520]], 5, COL.blueDk); line(c, [[420, 440], [420, 520]], 5, COL.blueDk);
  write(c, "15", 250, 700, 70, COL.blueDk, 7);
  // pencil
  shape(c, () => polyP(c, [[430, 780], [520, 690], [545, 715], [455, 805]]), COL.yellow, 5);
  shape(c, () => polyP(c, [[430, 780], [420, 815], [455, 805]]), "#f1d6a8", 4);
  arrow(c, [[540, 520], [640, 520]]);
  boat(c, 840, 520, 340, 140);
  shadow(c, 860, 700, 170, 20);
};
const termConstraint = (c: Ctx) => {
  ground(c);
  foilSquare(c, 540, 480, 520);
  shadow(c, 560, 850, 430, 20);
  shape(c, () => polyP(c, [[200, 740], [880, 740], [880, 840], [200, 840]]), COL.wood, 6);
  c.strokeStyle = INK;
  for (let i = 0; i <= 15; i++) { const x = 220 + i * 44; c.lineWidth = 3.5; c.beginPath(); c.moveTo(x, 740); c.lineTo(x, 740 + (i % 5 === 0 ? 34 : 20)); c.stroke(); }
  write(c, "15 cm", 330, 780, 44, INK, 6);
};
const termImprove = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6d8bd"; c.fillRect(0, 740, 1080, 340); line(c, [[0, 740], [1080, 740]], 6);
  shadow(c, 160, 750, 110, 14); shadow(c, 520, 750, 150, 14); shadow(c, 900, 750, 190, 14);
  boat(c, 160, 600, 180, 140);
  boat(c, 520, 560, 260, 180);
  boat(c, 900, 500, 340, 240);
  arrow(c, [[150, 880], [900, 880]], RED, 12);
};
const termFloat = (c: Ctx) => {
  ground(c);
  tank(c, 130, 300, 820, 560, 400, (wy) => {
    // steel bowl floating
    const b = () => { c.moveTo(310, wy - 40); c.bezierCurveTo(330, wy + 70, 570, wy + 70, 590, wy - 40); c.closePath(); };
    shape(c, b, COL.steel, 6); shade(c, b, COL.steelDk, 60, 0); shape(c, () => ell(c, 450, wy - 40, 140, 26), COL.steelIn, 5);
    // spoon on the bottom
    line(c, [[620, 800], [800, 810]], 18); line(c, [[620, 800], [800, 810]], 8, COL.steel);
    shape(c, () => ell(c, 580, 800, 44, 26, 0.1), COL.steel, 6);
  });
};
const termAdhesive = (c: Ctx) => {
  ground(c);
  // glue bottle
  shadow(c, 300, 880, 130, 20);
  const g = () => { c.moveTo(220, 460); c.lineTo(380, 460); c.lineTo(400, 540); c.lineTo(400, 860); c.quadraticCurveTo(400, 880, 380, 880); c.lineTo(220, 880); c.quadraticCurveTo(200, 880, 200, 860); c.lineTo(200, 540); c.closePath(); };
  shape(c, g, WHITE, 6); shade(c, g, "#e4dccb", 40, 0);
  shape(c, () => polyP(c, [[255, 350], [345, 350], [380, 460], [220, 460]]), COL.orange, 6);
  shape(c, () => rrect(c, 230, 600, 140, 160, 14), COL.blue, 5);
  katori(c, 740, 700, 150, "#ffffff");
  // brush
  line(c, [[740, 690], [900, 420]], 16); line(c, [[740, 690], [900, 420]], 6, COL.wood);
  shape(c, () => polyP(c, [[895, 430], [925, 450], [940, 380], [915, 365]]), COL.black, 5);
};
const cycle = (c: Ctx) => {
  ground(c);
  const pts: [number, number][] = [[540, 210], [850, 540], [540, 870], [230, 540]];
  pts.forEach(([x, y]) => shape(c, () => ell(c, x, y, 140, 140), WHITE, 6));
  // plan: paper and a pencil line
  shape(c, () => polyP(c, [[490, 150], [590, 150], [590, 270], [490, 270]]), "#fffaf0", 5);
  line(c, [[505, 200], [575, 200]], 6, COL.blueDk); line(c, [[505, 230], [560, 230]], 6, COL.blueDk);
  // build: foil square
  foilSquare(c, 850, 545, 180);
  // test: boat with a coin on top
  boat(c, 540, 870, 170, 80, [[0, -0.02]]);
  // improve: a wider boat with a plus
  boat(c, 215, 570, 190, 90); write(c, "+", 170, 430, 70, RED, 9);
  arrow(c, [[690, 190], [780, 270], [800, 350]]);
  arrow(c, [[860, 700], [800, 790], [700, 840]]);
  arrow(c, [[390, 860], [300, 800], [260, 715]]);
  arrow(c, [[250, 370], [320, 280], [390, 215]]);
};
const floats = (c: Ctx) => {
  ground(c);
  tank(c, 150, 380, 780, 480, 300, (wy) => boat(c, 540, wy - 90, 400, 140, [[-0.1, -0.02], [0.08, -0.03]]));
  // weight pushes down, water pushes up
  arrow(c, [[540, 90], [540, 230]], COL.blueDk, 14);
  arrow(c, [[540, 840], [540, 730]], RED, 14);
};

export const ic_makingThingsDesignAndBuildL3 = cards("sci.making-things.design-and-build.L3 cards", [
  intro, summary, e1, e2, a1, a3, a4, c1, c2, termDesign, termConstraint, termImprove, termFloat, termAdhesive, cycle, floats,
]);
