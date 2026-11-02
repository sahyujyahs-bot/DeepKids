import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, SKIN, WHITE, arrow, cards, ell, glass, ground, hand, line, person, plate, polyP, rrect, shadow, shape, shine, write } from "./flatKit";

// sci.senses.more-senses.L3 picture cards. Frame order: 0 intro, 1 summary, 2-9 e1 e2 e3 a1 a2 a4 p1 c1,
// 10-21 terms 0-11, 22-29 explanations 0-6 and 8.

// ---------------------------------------------------------------- shared pieces
const panel = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => shape(c, () => rrect(c, x, y, w, h, 36), col, 6);
const ellArc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 14) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
const armPts = (x: number, y: number, h: number, left: boolean, [a1, a2]: [number, number]) => {
  const sx = x + (left ? -1 : 1) * h * 0.11, sy = y - h * 0.74 + h * 0.03, ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17;
  return [[sx, sy], [ex, ey], [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16]];
};
const headAt = (x: number, y: number, h: number) => [x, y - h * 0.74 - h * 0.13 * 1.05, h * 0.13];
// close the person's eyes
const shut = (c: Ctx, x: number, y: number, h: number) => {
  const [, hy, hd] = headAt(x, y, h);
  for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * hd * 0.35, hy + hd * 0.12, hd * 0.2, hd * 0.22), SKIN.child, 0); c.beginPath(); c.arc(x + s * hd * 0.35, hy + hd * 0.08, hd * 0.15, 0.1, Math.PI - 0.1); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
};
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
const flame = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x, y); c.bezierCurveTo(x - s * 0.9, y - s * 0.2, x - s * 0.6, y - s * 1.1, x - s * 0.1, y - s * 1.6); c.bezierCurveTo(x + s * 0.1, y - s * 1.1, x + s * 0.9, y - s * 0.9, x + s * 0.8, y - s * 0.3); c.bezierCurveTo(x + s * 0.7, y, x + s * 0.3, y, x, y); c.closePath(); }, COL.orange, 5);
  shape(c, () => { c.moveTo(x, y - s * 0.05); c.bezierCurveTo(x - s * 0.45, y - s * 0.1, x - s * 0.3, y - s * 0.6, x, y - s * 0.85); c.bezierCurveTo(x + s * 0.4, y - s * 0.5, x + s * 0.4, y - s * 0.1, x, y - s * 0.05); c.closePath(); }, COL.yellow, 0);
};
const tube = (c: Ctx, fn: () => void, w: number) => {
  for (const [lw, col] of [[w + 12, INK], [w, COL.blue], [w * 0.28, COL.sky]] as [number, string][]) { c.beginPath(); fn(); c.strokeStyle = col; c.lineWidth = lw; c.lineCap = "round"; c.stroke(); }
};
// the three liquid loops of the inner ear, at right angles
const loops = (c: Ctx, x: number, y: number, s: number, w = 30) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  tube(c, () => ell(c, 0, 50, 230, 70), w);
  tube(c, () => ell(c, -50, -10, 75, 210), w);
  tube(c, () => ell(c, 70, 0, 70, 200, 0.9), w);
  shape(c, () => ell(c, 0, 20, 48, 48), COL.pink, 6);
  c.restore();
};
const foot = (c: Ctx, x: number, y: number, s: number, thick = 0) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const sole = 24 + thick;
  shape(c, () => rrect(c, -175, 0, 395, sole, 12), COL.yellow, 6);
  shape(c, () => { c.moveTo(-150, 0); c.lineTo(170, 0); c.quadraticCurveTo(212, 0, 205, -42); c.quadraticCurveTo(190, -80, 120, -92); c.quadraticCurveTo(40, -110, -50, -135); c.lineTo(-55, -300); c.lineTo(-170, -300); c.lineTo(-165, -150); c.quadraticCurveTo(-170, -50, -150, 0); c.closePath(); }, SKIN.child);
  line(c, [[172, -6], [178, -52]], 5); line(c, [[140, -6], [146, -40]], 5);
  shape(c, () => rrect(c, -182, -330, 140, 140, 10), "#6b5a8c", 6);
  c.restore();
};
const pencil = (c: Ctx, x: number, y: number, an: number, len: number) => {
  c.save(); c.translate(x, y); c.rotate(an); const h = len / 2, w = 15;
  shape(c, () => rrect(c, -h, -w, len * 0.12, w * 2, 6), COL.pink, 5);
  shape(c, () => polyP(c, [[-h + len * 0.12, -w], [h * 0.65, -w], [h * 0.65, w], [-h + len * 0.12, w]]), COL.yellow, 5);
  shape(c, () => polyP(c, [[h * 0.65, -w], [h, 0], [h * 0.65, w]]), COL.wood, 5);
  shape(c, () => polyP(c, [[h * 0.9, -w * 0.25], [h, 0], [h * 0.9, w * 0.25]]), INK, 0);
  c.restore();
};
const badge = (c: Ctx, x: number, y: number, r: number, icon: (c: Ctx, x: number, y: number, r: number) => void, col: string = WHITE) => { shape(c, () => ell(c, x, y, r, r), col, 6); icon(c, x, y, r); };
const iEye = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => { c.moveTo(x - r * 0.7, y); c.quadraticCurveTo(x, y - r * 0.8, x + r * 0.7, y); c.quadraticCurveTo(x, y + r * 0.8, x - r * 0.7, y); c.closePath(); }, WHITE, 5); shape(c, () => ell(c, x, y, r * 0.3, r * 0.3), COL.brown, 4); shape(c, () => ell(c, x, y, r * 0.12, r * 0.12), INK, 0); };
const iEar = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r * 0.45, r * 0.65), SKIN.child, 5); line(c, ellArc(x, y, r * 0.22, r * 0.38, -2.2, 1.6, 8), 5); };
const iNose = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => { c.moveTo(x, y - r * 0.6); c.quadraticCurveTo(x + r * 0.2, y + r * 0.2, x + r * 0.5, y + r * 0.4); c.quadraticCurveTo(x, y + r * 0.6, x - r * 0.5, y + r * 0.4); c.quadraticCurveTo(x - r * 0.2, y + r * 0.2, x, y - r * 0.6); c.closePath(); }, SKIN.child, 5); for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.2, y + r * 0.38, r * 0.07, r * 0.05), INK, 0); };
const iMouth = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => { c.moveTo(x - r * 0.6, y); c.quadraticCurveTo(x, y - r * 0.5, x + r * 0.6, y); c.quadraticCurveTo(x, y + r * 0.6, x - r * 0.6, y); c.closePath(); }, COL.red, 5); line(c, [[x - r * 0.55, y], [x + r * 0.55, y]], 4); };
const iHand = (c: Ctx, x: number, y: number, r: number) => hand(c, x - r * 0.45, y, 0, r / 190, SKIN.child, CLOTH.child, true);
const iIce = (c: Ctx, x: number, y: number, r: number) => ice(c, x, y + r * 0.35, r * 0.42);
const iLoops = (c: Ctx, x: number, y: number, r: number) => loops(c, x, y, r / 300, 26);
const iFlame = (c: Ctx, x: number, y: number, r: number) => flame(c, x, y + r * 0.55, r * 0.5);
const iTummy = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => rrect(c, x - r * 0.45, y - r * 0.6, r * 0.9, r * 1.2, r * 0.3), CLOTH.child, 5); for (const s of [-1, 1]) { line(c, [[x + s * r * 0.62, y - r * 0.25], [x + s * r * 0.75, y - r * 0.05], [x + s * r * 0.62, y + r * 0.15]], 6, RED); } };
const iGlass = (c: Ctx, x: number, y: number, r: number) => glass(c, x, y + r * 0.6, r * 0.8, r * 1.2, 0.7);

// the pouch of the inner ear: cells with hairs, a jelly slab, and crystals on top; slide = jelly slipped sideways
const pouch = (c: Ctx, x: number, y: number, s: number, tilt: number, slide: number) => {
  c.save(); c.translate(x, y); c.rotate(tilt); c.scale(s, s);
  shape(c, () => rrect(c, -300, 110, 600, 90, 30), COL.purple, 6);
  for (let k = 0; k < 10; k++) { const x0 = -250 + k * 55; line(c, [[x0, 112], [x0 + slide * 0.5, 40], [x0 + slide, -20]], 7); }
  shape(c, () => rrect(c, -300 + slide, -110, 600, 130, 40), "#f6e3a8", 6);
  const sl = tilt ? 1 : 0;
  for (let k = 0; k < 12; k++) { const cx = -265 + k * 48 + slide + sl * (k * 6 - 40), cy = -110 - 20 - (k % 2) * 4; shape(c, () => ell(c, cx, cy, 21, 17, 0.3), WHITE, 5); }
  c.restore();
};

// ---------------------------------------------------------------- the pictures
const intro = (c: Ctx) => {
  ground(c); shadow(c, 560, 925, 280, 36);
  person(c, 540, 900, 640, { armL: [Math.PI, Math.PI], armR: [0, 0] });
  arrow(c, ellArc(540, 840, 420, 110, 3.2, 8.4, 24), RED, 12);
  line(c, ellArc(540, 190, 70, 40, 0, 12, 40).map(([a, b], i) => [540 + (a - 540) * (1 - i / 60), 190 + (b - 190) * (1 - i / 60)]), 8, COL.purple);
};
const summary = (c: Ctx) => {
  ground(c); shadow(c, 560, 940, 200, 30);
  person(c, 540, 960, 700);
  badge(c, 190, 170, 130, iIce, "#e4f2fb"); badge(c, 890, 170, 130, iLoops, "#e4f2fb"); badge(c, 150, 600, 125, iFlame, "#ffe7c6"); badge(c, 930, 600, 125, iTummy, "#ffe7c6");
};
const clock = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), WHITE, 7); line(c, [[x, y], [x, y - r * 0.65]], 7); line(c, [[x, y], [x + r * 0.45, y + r * 0.1]], 7); shape(c, () => ell(c, x, y, 8, 8), INK, 0); };
const e1 = (c: Ctx) => {
  ground(c); clock(c, 540, 230, 130);
  plate(c, 290, 700, 250, 115); puddle(c, 290, 715, 190, 66); ice(c, 290, 700, 52);
  const top = () => polyP(c, [[620, 650], [1000, 650], [960, 800], [580, 800]]);
  shadow(c, 800, 850, 220, 28);
  shape(c, () => polyP(c, [[580, 800], [960, 800], [960, 840], [580, 840]]), COL.woodDk); shape(c, top, COL.wood);
  line(c, [[640, 700], [900, 700]], 4, COL.woodDk); line(c, [[620, 750], [880, 750]], 4, COL.woodDk);
  puddle(c, 800, 745, 60, 20); ice(c, 800, 745, 90);
};
const e2 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[200, 560], [880, 560], [960, 880], [120, 880]]), WHITE);
  shape(c, () => ell(c, 590, 740, 20, 14), INK, 0);
  pencil(c, 722, 607, 2.2, 340);
  hand(c, 800, 470, 2.2, 1.3);
  line(c, [[606, 750], [630, 748]], 5, RED);
  shape(c, () => ell(c, 622, 744, 8, 8), RED, 0);
  badge(c, 160, 190, 105, (cc, x, y, r) => { line(cc, ellArc(x, y - r * 0.1, r * 0.55, r * 0.3, 0.1, Math.PI - 0.1, 10), 7); for (const a of [0.6, 1.57, 2.55]) line(cc, [[x + Math.cos(a) * r * 0.55, y - r * 0.1 + Math.sin(a) * r * 0.3 + 4], [x + Math.cos(a) * r * 0.72, y - r * 0.1 + Math.sin(a) * r * 0.42 + 14]], 5); }, "#fff4d6");
};
const spinner = (c: Ctx, x: number, y: number, h: number, n: string, twice: boolean) => {
  shadow(c, x + 20, y + 20, h * 0.4, 26);
  person(c, x, y, h, { armL: [Math.PI, Math.PI], armR: [0, 0] });
  arrow(c, ellArc(x, y - 50, h * 0.46, h * 0.11, 3.2, twice ? 11.2 : 8.4, 26), RED, 11);
  write(c, n, x - (n.length > 1 ? 70 : 30), 150, 130, INK, 14);
};
const e3 = (c: Ctx) => { ground(c); spinner(c, 270, 900, 480, "5", false); spinner(c, 810, 900, 480, "10", true); };
const bowlTop = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 20, y + 40, 235, 150);
  shape(c, () => ell(c, x, y, 230, 150), COL.steel); shape(c, () => ell(c, x, y, 195, 122), COL.water, 5);
  shape(c, () => ell(c, x - 60, y - 40, 50, 20, -0.4), COL.waterDk, 0);
};
const paperBit = (c: Ctx, x: number, y: number, r: number) => shape(c, () => polyP(c, [[x - 30, y - 18], [x + 30, y - 22], [x + 34, y + 18], [x - 26, y + 22]].map(([a, b]) => { const ca = Math.cos(r), sa = Math.sin(r); return [x + (a - x) * ca - (b - y) * sa, y + (a - x) * sa + (b - y) * ca]; })), COL.yellow, 5);
const a1 = (c: Ctx) => {
  ground(c);
  bowlTop(c, 290, 600); paperBit(c, 290, 600, 0.3);
  arrow(c, ellArc(290, 600, 265, 180, 3.5, 5.8, 14), RED, 12); hand(c, 120, 320, 0.8, 1.2);
  bowlTop(c, 790, 600); arrow(c, ellArc(790, 600, 130, 78, 0.3, 5.4, 22), COL.blueDk, 12); paperBit(c, 700, 640, 1.2);
};
const doorPost = (c: Ctx, x: number) => { shape(c, () => rrect(c, x, 140, 56, 800, 8), COL.brown, 6); shape(c, () => rrect(c, x + 56, 140, 14, 800, 4), COL.soilDk, 4); };
const a2 = (c: Ctx) => {
  ground(c); panel(c, 20, 80, 505, 920, "#f9f1de"); panel(c, 555, 80, 505, 920, "#f9f1de");
  doorPost(c, 440); shadow(c, 200, 940, 120, 20); person(c, 200, 930, 600, { armR: [0, 0] }); arrow(c, [[250, 420], [380, 420]], RED, 11);
  doorPost(c, 985); shadow(c, 730, 940, 120, 20); person(c, 730, 930, 600, { armR: [-0.7, -1.0] }); arrow(c, [[960, 560], [960, 330]], RED, 11);
  doorPost(c, 985);
};
const a4 = (c: Ctx) => {
  ground(c);
  for (let k = 0; k < 4; k++) shape(c, () => rrect(c, 10, 350 + k * 66, 170, 56, 28), SKIN.child);
  shape(c, () => rrect(c, 90, 330, 900, 330, 150), SKIN.child);
  shape(c, () => rrect(c, 860, 310, 150, 370, 28), CLOTH.child, 6);
  c.save(); c.setLineDash([22, 16]); c.lineWidth = 6; c.strokeStyle = INK; c.strokeRect(330, 400, 400, 190); c.restore();
  const r = [[390, 450], [470, 520], [560, 440], [640, 530], [690, 450], [430, 560], [600, 570], [520, 490]];
  r.forEach(([x, y]) => shape(c, () => ell(c, x, y, 17, 17), COL.blue, 5));
  c.save(); c.translate(560, 770); c.rotate(-0.9);
  shape(c, () => rrect(c, -150, -16, 230, 32, 10), COL.steel, 5); shape(c, () => ell(c, -190, 0, 42, 42), COL.steel, 5); shape(c, () => ell(c, -190, 0, 16, 16), BG, 4);
  shape(c, () => polyP(c, [[30, 16], [30, 36], [60, 36], [60, 16]]), COL.steelDk, 4);
  c.restore();
  shape(c, () => rrect(c, 700, 880, 260, 50, 22), COL.teal, 5); shape(c, () => rrect(c, 880, 880, 110, 50, 22), COL.tealDk, 5); shape(c, () => polyP(c, [[700, 890], [660, 905], [700, 920]]), INK, 4);
};
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 900, 440, 30);
  shape(c, () => polyP(c, [[90, 260], [530, 300], [530, 880], [90, 840]]), WHITE); shape(c, () => polyP(c, [[550, 300], [990, 260], [990, 840], [550, 880]]), WHITE);
  line(c, [[540, 300], [540, 880]], 8);
  iTummy(c, 310, 450, 150); iGlass(c, 310, 690, 150); iIce(c, 780, 470, 150); iFlame(c, 780, 690, 150);
  pencil(c, 880, 900, -0.3, 380);
};
const c1 = (c: Ctx) => {
  ground(c); shape(c, () => polyP(c, [[60, 900], [1020, 900], [1040, 960], [40, 960]]), COL.soil, 6);
  foot(c, 450, 690, 1.6, 40);
  shape(c, () => polyP(c, [[630, 900], [770, 900], [700, 800]]), COL.grey, 6);
  arrow(c, [[900, 560], [790, 780]], RED, 12);
};

// terms
const t0 = (c: Ctx) => {
  ground(c); shadow(c, 560, 955, 260, 36); person(c, 540, 940, 780, { armL: [Math.PI * 0.95, Math.PI * 0.9], armR: [0.1, 0.15] }); shut(c, 540, 940, 780);
  arrow(c, [[170, 720], [110, 640], [150, 560]], RED, 10); arrow(c, [[910, 720], [970, 640], [930, 560]], RED, 10);
};
const t1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 140, 500, 800, 90, 0), "#f0c3a3", 6); shape(c, () => rrect(c, 140, 590, 800, 160, 0), "#e0987a", 6); shape(c, () => rrect(c, 140, 750, 800, 130, 0), "#f9de9c", 6);
  ice(c, 400, 500, 90);
  for (const [x, lit] of [[400, 1], [600, 0], [780, 0]] as [number, number][]) {
    line(c, [[x, 560], [x, 800]], 12, INK); line(c, [[x, 560], [x, 800]], 5, lit ? COL.yellow : COL.grey);
    if (lit) { for (const [r, a] of [[78, 0.18], [52, 0.3]]) { c.globalAlpha = a; shape(c, () => ell(c, x, 560, r, r), COL.yellow, 0); c.globalAlpha = 1; } }
    shape(c, () => ell(c, x, 560, 24, 24), lit ? COL.yellow : COL.grey, 6);
  }
  line(c, [[400, 800], [900, 800]], 12, INK); line(c, [[400, 800], [900, 800]], 5, COL.yellow); arrow(c, [[420, 830], [880, 830]], RED, 11);
};
const t2 = (c: Ctx) => {
  ground(c); const x = 400, y = 1000, h = 680;
  shadow(c, x + 20, y + 5, 220, 28); person(c, x, y, h, { armR: [-0.1, 0.05] });
  const a = armPts(x, y, h, false, [-0.1, 0.05]), [, hy, hd] = headAt(x, y, h);
  ice(c, a[2][0] + 130, a[2][1] + 45, 56);
  const nerve = [a[2], a[1], a[0], [x, a[0][1]], [x, hy + hd * 0.9]];
  line(c, nerve, 20, INK); line(c, nerve, 9, COL.yellow);
  shape(c, () => ell(c, x, hy - hd * 2.4, 150, 100), COL.pink, 6); line(c, [[x - 90, hy - hd * 2.4], [x - 30, hy - hd * 2.9], [x + 30, hy - hd * 1.9], [x + 90, hy - hd * 2.4]], 6, COL.red);
  arrow(c, [[x, hy - hd * 0.5], [x, hy - hd * 1.3]], RED, 10);
};
const t3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 90, 560, 860, 20), COL.steelIn, 7); shape(c, () => rrect(c, 60, 880, 560, 70, 10), COL.steelDk, 7);
  shape(c, () => rrect(c, 540, 330, 54, 150, 12), COL.steel, 5); for (const yy of [360, 410, 450]) shape(c, () => ell(c, 567, yy, 11, 11), COL.yellow, 4);
  shape(c, () => rrect(c, 230, 120, 160, 28, 14), COL.yellow, 5);
  person(c, 330, 900, 600, { armL: [1.9, 1.5], armR: [1.2, 1.6] });
  arrow(c, [[690, 400], [690, 200]], RED, 12);
  shape(c, () => ell(c, 800, 740, 235, 235), WHITE, 7); loops(c, 800, 735, 0.72, 22);
  line(c, [[430, 400], [610, 580]], 5);
};
const t4 = (c: Ctx) => { ground(c); loops(c, 540, 520, 1.75, 34); };
const t5 = (c: Ctx) => {
  ground(c); pouch(c, 540, 600, 1.4, 0, 0);
  arrow(c, [[70, 200], [70, 470]], RED, 12);
};
const t6 = (c: Ctx) => {
  ground(c, "#2b2340"); const x = 540, y = 980, h = 780;
  shadow(c, x + 20, y + 5, 240, 30); person(c, x, y, h, { armR: [-0.1, -2.3] }); shut(c, x, y, h);
  const a = armPts(x, y, h, false, [-0.1, -2.3]);
  for (const [r, al] of [[70, 0.3], [45, 0.5]]) { c.globalAlpha = al; shape(c, () => ell(c, a[1][0], a[1][1], r, r), COL.yellow, 0); c.globalAlpha = 1; }
  line(c, a, 16, COL.yellow);
  line(c, [[a[0][0] - 20, a[0][1] + 40], [a[1][0] - 10, a[1][1] + 50], [a[2][0] + 20, a[2][1] + 40]], 8, COL.yellow);
  for (const [sx, sy] of [[120, 120], [900, 160], [820, 420], [180, 500]]) shape(c, () => ell(c, sx, sy, 10, 10), COL.yellow, 0);
};
const t7 = (c: Ctx) => {
  ground(c); c.fillStyle = "#ffe0ac"; c.fillRect(0, 0, 540, 1080); c.fillStyle = "#d6ecf8"; c.fillRect(540, 0, 540, 1080);
  c.fillStyle = "#c9a977"; c.fillRect(0, 930, 540, 150); c.fillStyle = COL.steelIn; c.fillRect(540, 930, 540, 150);
  shape(c, () => ell(c, 170, 190, 90, 90), COL.yellow, 6);
  for (let k = 0; k < 8; k++) { const a = k * 0.785; line(c, [[170 + Math.cos(a) * 115, 190 + Math.sin(a) * 115], [170 + Math.cos(a) * 160, 190 + Math.sin(a) * 160]], 9, COL.orange); }
  shape(c, () => rrect(c, 700, 90, 300, 100, 20), WHITE, 6); for (let k = 0; k < 4; k++) line(c, [[730, 130 + k * 12], [970, 130 + k * 12]], 4, COL.steelDk);
  for (const x of [740, 850, 960]) { line(c, [[x, 215], [x - 10, 290]], 8, COL.blue); line(c, [[x + 30, 225], [x + 22, 280]], 8, COL.blue); }
  line(c, [[540, 0], [540, 1080]], 8);
  const x = 540, y = 960, h = 720; shadow(c, x + 20, y + 5, 200, 26); person(c, x, y, h, { armL: [1.5, 1.5], armR: [1.6, 1.6] });
  for (const left of [true, false]) { const a = armPts(x, y, h, left, left ? [1.5, 1.5] : [1.6, 1.6]); for (const t of [0.35, 0.7]) shape(c, () => ell(c, a[1][0] + (a[2][0] - a[1][0]) * t, a[1][1] + (a[2][1] - a[1][1]) * t, 11, 11), COL.blue, 3); }
  arrow(c, [[250, 880], [440, 880]], RED, 12);
};
const t8 = (c: Ctx) => {
  ground(c);
  line(c, [[430, 650], [250, 150]], 44, INK); line(c, [[430, 650], [250, 150]], 30, COL.steel); shape(c, () => ell(c, 250, 140, 38, 52), COL.steel, 6);
  line(c, [[430, 650], [345, 415]], 30, "#e4523b");
  line(c, [[660, 650], [850, 150]], 44, INK); line(c, [[660, 650], [850, 150]], 30, COL.wood); shape(c, () => ell(c, 856, 140, 40, 40), COL.wood, 6);
  shadow(c, 560, 930, 330, 36);
  shape(c, () => rrect(c, 280, 640, 560, 280, 36), COL.steelDk, 6); shape(c, () => rrect(c, 280, 640, 90, 280, 36), COL.steel, 0); shape(c, () => ell(c, 560, 650, 280, 56), "#f6e3a8", 6);
  line(c, [[430, 655], [250 + 180 * 0.0 + 180, 150 + 500 * 0.0 + 505 - 0]], 0);
  shape(c, () => ell(c, 430, 650, 26, 12), COL.steelDk, 4); shape(c, () => ell(c, 660, 650, 26, 12), COL.woodDk, 4);
  arrow(c, [[500, 600], [415, 380]], RED, 10);
  for (const x of [470, 560, 650]) line(c, [[x, 580], [x - 20, 520], [x + 20, 460]], 7, WHITE);
};
const t9 = (c: Ctx) => {
  ground(c); shadow(c, 560, 1000, 380, 30);
  c.save(); c.translate(0, 150); foot(c, 480, 750, 1.8);
  shape(c, () => polyP(c, [[550, 610], [620, 560], [640, 700], [590, 755]]), COL.blue, 6); 
  c.restore();
  shape(c, () => ell(c, 700, 700, 30, 22), RED, 5);
  for (const a of [-0.9, -0.3, 0.3, 0.9, 1.5]) line(c, [[700 + Math.cos(a - 0.4) * 70, 700 + Math.sin(a - 0.4) * 60], [700 + Math.cos(a - 0.4) * 115, 700 + Math.sin(a - 0.4) * 100]], 9, RED);
};
const t10 = (c: Ctx) => {
  ground(c); shadow(c, 340, 930, 280, 36);
  shape(c, () => rrect(c, 80, 840, 520, 90, 20), COL.black, 6);
  for (const x of [200, 340, 480]) flame(c, x, 835, 36);
  shape(c, () => rrect(c, 130, 480, 420, 320, 40), COL.steel, 6); shape(c, () => rrect(c, 130, 480, 80, 320, 40), COL.steelIn, 0); shape(c, () => ell(c, 340, 482, 210, 30), COL.steelDk, 6);
  for (const x of [250, 340, 430]) line(c, [[x, 440], [x - 20, 380], [x + 20, 320]], 8, COL.sky);
  c.save(); c.translate(1080, 0); c.scale(-1, 1); hand(c, 400, 570, 0, 2.0); c.restore();
  arrow(c, [[780, 780], [960, 780]], RED, 14);
  for (const [x, y] of [[580, 520], [610, 590]]) line(c, [[x, y], [x + 50, y - 20]], 6, COL.yellow);
  line(c, [[740, 640], [850, 640]], 7, COL.greyDk); line(c, [[740, 700], [850, 700]], 7, COL.greyDk);
};
const t11 = (c: Ctx) => {
  ground(c); const x = 330, y = 990, h = 760;
  shadow(c, x + 20, y + 5, 210, 28); person(c, x, y, h, { armL: [1.9, 0.33], armR: [1.24, 2.81] });
  for (const s of [-1, 1]) line(c, ellArc(x + s * 120, y - h * 0.48, 24, 36, -1.2, 1.2, 6).map(([a, b]) => [s > 0 ? a : 2 * (x + s * 120) - a, b]), 7, RED);
  shape(c, () => rrect(c, 620, 770, 440, 40, 8), COL.brown, 6); shape(c, () => rrect(c, 650, 810, 40, 200, 6), COL.brown, 6); shape(c, () => rrect(c, 980, 810, 40, 200, 6), COL.brown, 6);
  plate(c, 830, 765, 190, 44);
  for (const [ix, iy] of [[740, 735], [830, 725], [920, 735]]) { shape(c, () => { c.moveTo(ix - 52, iy + 18); c.quadraticCurveTo(ix - 50, iy - 50, ix, iy - 52); c.quadraticCurveTo(ix + 50, iy - 50, ix + 52, iy + 18); c.closePath(); }, WHITE, 5); }
  for (const ix of [770, 860]) line(c, [[ix, 640], [ix - 20, 590], [ix + 20, 540]], 7, COL.greyDk);
};

// explanations
const e0 = (c: Ctx) => {
  ground(c);
  [iEye, iEar, iNose, iMouth, iHand].forEach((f, k) => badge(c, 135 + k * 202, 240, 92, f, "#fff4d6"));
  write(c, "+", 480, 380, 160, RED, 18);
  [iLoops, iIce, iFlame, iTummy].forEach((f, k) => badge(c, 190 + k * 233, 770, 105, f, "#e4f2fb"));
};
const e1b = (c: Ctx) => {
  ground(c);
  const one = (x: number, bent: boolean) => {
    panel(c, x - 245, 100, 490, 880, "#f9f1de");
    const loop = () => ell(c, x, 500, 170, 170);
    tube(c, loop, 56);
    const flapEnd: number[] = bent ? [x + 90, 395] : [x, 380];
    line(c, [[x, 650], bent ? [x + 40, 520] : [x, 520], flapEnd], 30, INK); line(c, [[x, 650], bent ? [x + 40, 520] : [x, 520], flapEnd], 18, COL.pink);
    if (bent) { arrow(c, ellArc(x, 500, 250, 250, 3.7, 5.6, 12), RED, 13); arrow(c, ellArc(x, 500, 120, 120, 5.5, 3.7, 12).slice(0), COL.blueDk, 10); }
  };
  one(270, false); one(810, true);
};
const e2b = (c: Ctx) => {
  ground(c);
  panel(c, 20, 100, 505, 880, "#f9f1de"); panel(c, 555, 100, 505, 880, "#f9f1de");
  pouch(c, 272, 600, 0.68, 0, 0); pouch(c, 808, 590, 0.6, 0.45, 50);
  arrow(c, [[60, 200], [60, 300]], RED, 11); arrow(c, [[1020, 200], [1020, 300]], RED, 11);
};
const e3b = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 90, 460, 900, 330, 120), SKIN.child);
  shape(c, () => rrect(c, 260, 520, 520, 210, 40), "#e9f3ff", 6);
  shape(c, () => ell(c, 520, 625, 230, 80), "#c9604f", 6);
  for (const k of [-1, 0, 1]) line(c, [[330, 625 + k * 40], [700, 625 + k * 40]], 4, "#a64a3c");
  shape(c, () => rrect(c, 760, 595, 130, 60, 12), "#fff4d6", 6);
  line(c, [[330, 560], [370, 520], [410, 600], [450, 520], [490, 600], [530, 520]], 8, COL.yellow);
  line(c, [[470, 520], [470, 330], [540, 280]], 20, INK); line(c, [[470, 520], [470, 330], [540, 280]], 9, COL.yellow);
  shape(c, () => ell(c, 540, 170, 140, 90), COL.pink, 6); line(c, [[440, 170], [500, 120], [560, 200], [630, 150]], 6, COL.red);
};
const block = (c: Ctx, x: number, col: string, dk: string) => {
  shadow(c, x + 30, 905, 200, 25);
  shape(c, () => polyP(c, [[x - 160, 640], [x + 160, 640], [x + 160, 880], [x - 160, 880]]), col);
  shape(c, () => polyP(c, [[x - 160, 640], [x + 160, 640], [x + 200, 590], [x - 120, 590]]), dk);
  shape(c, () => polyP(c, [[x + 160, 640], [x + 200, 590], [x + 200, 830], [x + 160, 880]]), dk);
};
const e4b = (c: Ctx) => {
  ground(c); block(c, 290, COL.steel, COL.steelDk); block(c, 790, COL.wood, COL.woodDk);
  hand(c, 290, 200, Math.PI / 2, 2.0); hand(c, 790, 200, Math.PI / 2, 2.0);
  for (const x of [220, 290, 360]) arrow(c, [[x, 480], [x, 580]], RED, 12);
  arrow(c, [[790, 520], [790, 570]], RED, 9);
};
const e5b = (c: Ctx) => {
  ground(c); const cx = 540, cy = 500, R = 360;
  shape(c, () => ell(c, cx, cy, R, R), SKIN.child, 10);
  const pts: [number, number, number][] = [[-210, -190, 0], [-60, -250, 0], [110, -190, 0], [230, -90, 0], [-250, -40, 0], [-120, -90, 0], [20, -80, 0], [150, 10, 0], [-200, 100, 0], [-60, 50, 1], [60, 130, 0], [220, 150, 0], [-120, 230, 0], [30, 250, 0], [150, 230, 1], [-250, 170, 1], [-20, -150, 0]];
  pts.forEach(([dx, dy, w]) => shape(c, () => ell(c, cx + dx, cy + dy, 24, 24), w ? COL.red : COL.blue, 5));
  line(c, [[cx + 255, cy + 255], [cx + 420, cy + 420]], 44, INK); line(c, [[cx + 255, cy + 255], [cx + 420, cy + 420]], 30, COL.wood);
};
const e6b = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 470, 530, 160, 80), SKIN.child, 6); shape(c, () => rrect(c, 20, 430, 130, 240, 10), CLOTH.child, 6);
  line(c, [[600, 550], [980, 550]], 14, INK); line(c, [[600, 550], [980, 550]], 7, COL.steel);
  shape(c, () => ell(c, 1000, 550, 22, 22), COL.red, 5); shape(c, () => polyP(c, [[560, 550], [610, 540], [610, 560]]), COL.steelDk, 4);
  const sx = 575, sy = 550;
  shape(c, () => polyP(c, [[sx, sy - 70], [sx + 20, sy - 25], [sx + 65, sy - 35], [sx + 35, sy], [sx + 65, sy + 35], [sx + 20, sy + 25], [sx, sy + 70], [sx - 10, sy + 25], [sx - 50, sy + 35], [sx - 25, sy], [sx - 50, sy - 35], [sx - 10, sy - 25]]), RED, 5);
  shape(c, () => { c.moveTo(380, 330); c.quadraticCurveTo(380, 130, 560, 130); c.quadraticCurveTo(740, 130, 740, 330); c.closePath(); }, COL.yellow, 6);
  shape(c, () => ell(c, 560, 350, 30, 30), COL.orange, 5); line(c, [[380, 330], [740, 330]], 8);
  for (const s of [-1, 1]) for (const k of [0, 1]) line(c, [[560 + s * (300 + k * 40), 150 + k * 40], [560 + s * (340 + k * 40), 220 + k * 40]], 8, RED);
  arrow(c, [[590, 500], [590, 400]], RED, 10);
};
const e8b = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 140, 960, 620, 40), "#bfe0f5", 7);
  const r = (n: number) => { let s = n; return () => ((s = (s * 16807) % 2147483647) / 2147483647); };
  const rd = r(7);
  c.save(); c.beginPath(); rrect(c, 60, 140, 960, 620, 40); c.clip();
  c.fillStyle = COL.leaf; c.fillRect(60, 600, 960, 160);
  for (let k = 0; k < 9; k++) { const x = 60 + k * 120 + rd() * 40; shape(c, () => ell(c, x, 520, 60, 110), COL.leafDk, 0); line(c, [[x - 60, 540 + rd() * 30], [x + 30, 540 + rd() * 30]], 10, WHITE); }
  for (let k = 0; k < 6; k++) line(c, [[60 + rd() * 800, 250 + k * 55], [200 + rd() * 800, 250 + k * 55]], 6, WHITE);
  c.restore();
  shape(c, () => rrect(c, 300, 360, 440, 480, 50), COL.teal, 6);
  person(c, 520, 850, 700, { sit: true, armL: [1.5, 0.7], armR: [1.5, 2.4] });
  shape(c, () => polyP(c, [[400, 600], [510, 630], [630, 600], [630, 740], [510, 770], [400, 740]]), WHITE, 6); line(c, [[512, 630], [512, 770]], 5);
  shape(c, () => rrect(c, 40, 760, 1000, 190, 40), COL.teal, 7); shape(c, () => rrect(c, 40, 760, 1000, 50, 20), COL.tealDk, 0);
  arrow(c, [[760, 880], [980, 880]], RED, 14);
  for (const s of [-1, 1]) line(c, [[520 + s * 170, 300], [520 + s * 200, 340], [520 + s * 170, 380]], 7, COL.purple);
};

export const ic_sensesMoreSensesL3 = cards("sci.senses.more-senses.L3 cards", [
  intro, summary, e1, e2, e3, a1, a2, a4, p1, c1, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, e0, e1b, e2b, e3b, e4b, e5b, e6b, e8b,
]);
