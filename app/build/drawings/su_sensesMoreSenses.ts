import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, SH, SKIN, WHITE, arrow, cards, ell, ground, hand, line, person, plate, polyP, rrect, shade, shadow, shape, shine, write } from "./flatKit";

// sci.senses.more-senses.L3 set-up cards. Same objects across one experiment: the steel plate and the
// wooden chopping board (e1), the table, paper, dot and pencil (e2), the child, mat and grown-up (e3).

// ---------------------------------------------------------------- shared pieces
// a wooden chopping board seen from above at an angle, middle (x, y), with a hole at one end
const board = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const top = () => polyP(c, [[x - w / 2 + 40, y - h / 2], [x + w / 2 + 40, y - h / 2], [x + w / 2 - 40, y + h / 2], [x - w / 2 - 40, y + h / 2]]);
  shadow(c, x + 30, y + h / 2 + 30, w / 2, 24);
  shape(c, () => polyP(c, [[x - w / 2 - 40, y + h / 2], [x + w / 2 - 40, y + h / 2], [x + w / 2 - 40, y + h / 2 + 34], [x - w / 2 - 40, y + h / 2 + 34]]), COL.woodDk);
  shape(c, top, COL.wood);
  shade(c, top, COL.woodDk, 60, 0, 0.35);
  for (const k of [-0.2, 0.15]) line(c, [[x - w * 0.34 + k * 60, y + k * h], [x + w * 0.2 + k * 60, y + k * h]], 4, COL.woodDk);
  shape(c, () => ell(c, x + w / 2 - 30, y - 6, 22, 10), BG, 4);
};
// an ice cube, bottom corner at (x, y), size s
const ice = (c: Ctx, x: number, y: number, s: number) => {
  const a = s, b = s * 0.5, v = s;
  shape(c, () => polyP(c, [[x - a, y - b], [x, y], [x, y - v], [x - a, y - b - v]]), "#cfe8f7");
  shape(c, () => polyP(c, [[x, y], [x + a, y - b], [x + a, y - b - v], [x, y - v]]), "#9fcbe8");
  shape(c, () => polyP(c, [[x, y - v], [x + a, y - b - v], [x, y - 2 * b - v], [x - a, y - b - v]]), "#eef8ff");
  shine(c, [[x - a * 0.7, y - b - v * 0.2], [x - a * 0.7, y - b - v * 0.7]], Math.max(4, s * 0.1));
};
const puddle = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shape(c, () => ell(c, x, y, rx, ry), COL.water, 4);
  shape(c, () => ell(c, x - rx * 0.35, y - ry * 0.3, rx * 0.25, ry * 0.15), COL.drop, 0);
};
// a pencil: middle at (x, y), pointing at angle an, length len
const pencil = (c: Ctx, x: number, y: number, an: number, len: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  const h = len / 2, w = 16;
  shape(c, () => rrect(c, -h, -w, len * 0.12, w * 2, 6), COL.pink, 5);
  shape(c, () => polyP(c, [[-h + len * 0.12, -w], [h * 0.62, -w], [h * 0.62, w], [-h + len * 0.12, w]]), COL.yellow, 5);
  shade(c, () => polyP(c, [[-h + len * 0.12, -w], [h * 0.62, -w], [h * 0.62, w], [-h + len * 0.12, w]]), COL.orange, 0, 12, 0.5);
  shape(c, () => polyP(c, [[h * 0.62, -w], [h, 0], [h * 0.62, w]]), COL.wood, 5);
  shape(c, () => polyP(c, [[h * 0.88, -w * 0.3], [h, 0], [h * 0.88, w * 0.3]]), COL.black, 3);
  c.restore();
};
// a phone lying flat, landscape, middle (x, y)
const phone = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 14, y + h / 2 + 10, w / 2, 18);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 26), COL.black);
  shape(c, () => rrect(c, x - w / 2 + 14, y - h / 2 + 14, w - 28, h - 28, 14), "#22303a", 3);
};
const dots = (c: Ctx, a: number[], b: number[], n: number, col = INK) => {
  for (let i = 0; i < n; i++) { const t = (i + 0.3) / n, u = (i + 0.7) / n; line(c, [[a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]], 5, col); }
};

// the table scene for the dot test: the child sits behind a wooden table, a sheet of paper with a big dot
const DOT = [540, 890];
const deskPaper = (c: Ctx) => {
  shape(c, () => polyP(c, [[0, 650], [1080, 650], [1080, 1080], [0, 1080]]), COL.wood, 6);
  shape(c, () => polyP(c, [[0, 650], [1080, 650], [1080, 690], [0, 690]]), COL.woodDk, 6);
  for (const y of [760, 840, 1010]) line(c, [[40, y], [300, y]], 4, COL.woodDk);
  for (const y of [790, 960]) line(c, [[800, y], [1040, y]], 4, COL.woodDk);
  shadow(c, 570, 1010, 330, 36);
  shape(c, () => polyP(c, [[310, 760], [770, 760], [840, 990], [240, 990]]), COL.paper);
  shape(c, () => ell(c, DOT[0], DOT[1], 40, 30), INK, 0);
};
const sitChild = (c: Ctx, x: number, shut: boolean) => {
  person(c, x, 1040, 700, { armR: [1.7, 1.75] });
  const head = 700 * 0.13, hy = 1040 - 700 * 0.74 - head * 1.05;
  if (shut) for (const s of [-1, 1]) {
    shape(c, () => ell(c, x + s * head * 0.35, hy + head * 0.12, head * 0.2, head * 0.2), SKIN.child, 0);
    c.beginPath(); c.moveTo(x + s * head * 0.35 - head * 0.2, hy + head * 0.08); c.quadraticCurveTo(x + s * head * 0.35, hy + head * 0.3, x + s * head * 0.35 + head * 0.2, hy + head * 0.08); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  }
  return { ex: [x - head * 0.35, x + head * 0.35], ey: hy + head * 0.14 };
};

// ---------------------------------------------------------------- e1: cold steel, warm wood
// setup.e1.0
// a child's flat palm seen from above, pressed on a surface: sleeve and wrist coming in from the top, fingers spread, thumb out
const palm = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => rrect(c, -64, -330, 128, 150, 16), CLOTH.child);
  shade(c, () => rrect(c, -64, -330, 128, 150, 16), CLOTH.childDk, 36, 0, 0.5);
  shape(c, () => rrect(c, -50, -190, 100, 110, 14), SKIN.child);
  shape(c, () => { c.save(); c.translate(-62, -10); c.rotate(0.85); rrect(c, -19, -10, 38, 100, 19); c.restore(); }, SKIN.child);
  shape(c, () => rrect(c, -78, -95, 156, 150, 44), SKIN.child);
  shade(c, () => rrect(c, -78, -95, 156, 150, 44), SKIN.childDk, 30, 10, 0.45);
  [[-60, 100, 0.12], [-21, 122, 0.04], [18, 112, -0.04], [56, 86, -0.14]].forEach(([fx, fl, r]) => shape(c, () => { c.save(); c.translate(fx, 30); c.rotate(r); rrect(c, -19, 0, 38, fl + 20, 19); c.restore(); }, SKIN.child));
  line(c, [[-30, -30], [30, -30]], 4, SKIN.childDk);
  c.restore();
};
const e1_0 = (c: Ctx) => {
  ground(c);
  plate(c, 285, 720, 250, 130);
  board(c, 800, 710, 400, 230);
  for (const x of [285, 800]) { shadow(c, x + 24, 760, 120, 60); palm(c, x, 640, 1.35); }
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  plate(c, 285, 720, 250, 130);
  board(c, 800, 710, 400, 230);
  ice(c, 285, 760, 90); ice(c, 800, 750, 90);
  arrow(c, [[285, 220], [285, 430]]); arrow(c, [[800, 220], [800, 430]]);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  plate(c, 285, 340, 250, 130);
  puddle(c, 285, 350, 205, 95);
  ice(c, 300, 372, 22);
  board(c, 800, 330, 400, 230);
  puddle(c, 760, 400, 110, 26);
  ice(c, 810, 385, 72);
  phone(c, 540, 800, 440, 240);
  write(c, "10", 540, 740, 120, "#c9f06b", 13);
  shape(c, () => ell(c, 440, 800, 48, 48), "#22303a", 0);
  c.beginPath(); ell(c, 440, 800, 48, 48); c.strokeStyle = "#c9f06b"; c.lineWidth = 8; c.stroke();
  line(c, [[440, 800], [440, 768]], 7, "#c9f06b"); line(c, [[440, 800], [464, 812]], 7, "#c9f06b");
};

// ---------------------------------------------------------------- e2: the blind spot
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  const k = sitChild(c, 540, false);
  deskPaper(c);
  for (const ex of k.ex) dots(c, [ex, k.ey + 14], [DOT[0] + (ex - 540) * 0.2, DOT[1] - 34], 12, RED);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  sitChild(c, 540, true);
  deskPaper(c);
  pencil(c, 644, 790, 1.75, 340);
  hand(c, 660, 700, 1.75, 1.3, SKIN.child, CLOTH.child);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 880, 480, 30);
  shape(c, () => rrect(c, 50, 130, 980, 760, 10), COL.paper);
  shape(c, () => ell(c, 230, 420, 40, 40), INK, 0);
  c.strokeStyle = COL.black; c.lineWidth = 9; c.lineCap = "round";
  line(c, [[500, 390], [560, 450]], 9, COL.black); line(c, [[560, 390], [500, 450]], 9, COL.black);
  write(c, "1", 585, 380, 70, COL.black, 9);
  dots(c, [230, 460], [230, 500], 3, RED); dots(c, [530, 460], [530, 500], 3, RED);
  arrow(c, [[230, 330], [530, 330]]); arrow(c, [[530, 330], [230, 330]]);
  write(c, "2 cm", 330, 190, 80, INK, 11);
  shadow(c, 580, 650, 450, 24);
  shape(c, () => rrect(c, 130, 500, 880, 140, 10), COL.wood);
  for (let mm = 0; mm <= 50; mm++) { const x = 230 + mm * 15, h = mm % 10 === 0 ? 62 : mm % 5 === 0 ? 42 : 24; line(c, [[x, 500], [x, 500 + h]], mm % 10 === 0 ? 5 : 3); }
  for (let cm = 0; cm <= 5; cm++) write(c, String(cm), 230 + cm * 150 - 14, 568, 50, INK, 7);
};

// ---------------------------------------------------------------- e3: dizzy
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 320, 935, 330, 52);
  shape(c, () => polyP(c, [[110, 850], [550, 850], [640, 950], [20, 950]]), COL.teal);
  shape(c, () => polyP(c, [[150, 868], [510, 868], [570, 930], [90, 930]]), COL.yellow, 4);
  person(c, 330, 905, 620, { armL: [Math.PI, Math.PI], armR: [0, 0] });
  const pts: number[][] = [];
  for (let i = 0; i <= 22; i++) { const t = Math.PI * 0.9 + (i / 22) * Math.PI * 1.55; pts.push([330 + Math.cos(t) * 270, 620 + Math.sin(t) * 60]); }
  arrow(c, pts, RED, 12);
  person(c, 880, 950, 780, { adult: true, armL: [Math.PI * 0.97, Math.PI * 1.02], armR: [Math.PI * 0.8, Math.PI * 0.97] });
};
// setup.e3.1
// close-up: the child's face, eyes looking at the grown-up's face, flick arrows over the eyes, a stopwatch in a hand below
const faceBig = (c: Ctx, x: number, y: number, r: number, skin: string, cloth: string, clothDk: string, child: boolean, look: number) => {
  shape(c, () => rrect(c, x - r * 1.1, y + r * 1.15, r * 2.2, r * 1.2, r * 0.4), cloth);
  shade(c, () => rrect(c, x - r * 1.1, y + r * 1.15, r * 2.2, r * 1.2, r * 0.4), clothDk, r * 0.35, 0, 0.5);
  shape(c, () => rrect(c, x - r * 0.28, y + r * 0.85, r * 0.56, r * 0.5, 10), skin);
  shape(c, () => ell(c, x, y, r, r * 1.08), skin);
  shape(c, () => { c.moveTo(x - r * 1.02, y - r * 0.1); c.bezierCurveTo(x - r * 1.1, y - r * 1.7, x + r * 1.1, y - r * 1.7, x + r * 1.02, y - r * 0.1); c.quadraticCurveTo(x, y - r * 0.75, x - r * 1.02, y - r * 0.1); c.closePath(); }, CLOTH.hair, 5);
  if (child) shape(c, () => ell(c, x - look * r * 0.95, y - r * 0.55, r * 0.26, r * 0.45), CLOTH.hair, 4);
  for (const s of [-1, 1]) {
    const ex = x + s * r * 0.38, ey = y + r * 0.12;
    shape(c, () => ell(c, ex, ey, r * 0.22, r * 0.18), WHITE, 4);
    shape(c, () => ell(c, ex + look * r * 0.1, ey, r * 0.1, r * 0.1), INK, 0);
  }
  c.beginPath(); c.arc(x, y + r * 0.5, r * 0.3, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
const e3_1 = (c: Ctx) => {
  ground(c);
  faceBig(c, 290, 380, 200, SKIN.child, CLOTH.child, CLOTH.childDk, true, 1);
  faceBig(c, 810, 380, 170, SKIN.adult, CLOTH.adult, CLOTH.adultDk, false, -1);
  dots(c, [400, 405], [700, 405], 12, RED);
  for (const ex of [214, 366]) { arrow(c, [[ex - 40, 300], [ex + 40, 300]], RED, 9); arrow(c, [[ex + 40, 300], [ex - 40, 300]], RED, 9); }
  // a stopwatch held in a hand
  shape(c, () => rrect(c, 566, 740, 40, 40, 8), COL.steelDk, 5);
  shape(c, () => ell(c, 586, 880, 110, 110), WHITE, 7);
  for (let k = 0; k < 12; k++) { const t = (k / 12) * Math.PI * 2; line(c, [[586 + Math.cos(t) * 86, 880 + Math.sin(t) * 86], [586 + Math.cos(t) * 100, 880 + Math.sin(t) * 100]], 5); }
  line(c, [[586, 880], [586, 810]], 8, RED); line(c, [[586, 880], [640, 905]], 8);
  hand(c, 370, 890, 0, 1.8, SKIN.child, CLOTH.child);
};

export const su_sensesMoreSenses = cards("sci.senses.more-senses.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1]);
