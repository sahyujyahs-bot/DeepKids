import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, leaf, hand, write, rnd, cards } from "./flatKit";

// ANIMAL LIFE CYCLES L3 · set-up cards: egg in hot and cold water, egg in vinegar, tadpole tub.
// Same egg, same glass, same tub on every card of an experiment.

const EGG = "#fbf1dc", EGG_DK = "#e0c99c", HOT = "#f4b183", VINEGAR = "#efe3b8";

// an egg: round end down (rot 0), pointed end up; rot turns it
const eggP = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0) => () => {
  const co = Math.cos(rot), si = Math.sin(rot);
  const P = (u: number, v: number) => [x + u * co - v * si, y + u * si + v * co];
  const q = (a: number, b: number, d: number, e: number, f: number, g: number) => { const p1 = P(a, b), p2 = P(d, e), p3 = P(f, g); c.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]); };
  const s = P(0, -ry); c.moveTo(s[0], s[1]);
  q(rx * 0.42, -ry, rx, -ry * 0.3, rx, ry * 0.2); q(rx, ry * 0.68, rx * 0.55, ry, 0, ry);
  q(-rx * 0.55, ry, -rx, ry * 0.68, -rx, ry * 0.2); q(-rx, -ry * 0.3, -rx * 0.42, -ry, 0, -ry); c.closePath();
};
const egg = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0, col = EGG, dk = EGG_DK) => {
  const p = eggP(c, x, y, rx, ry, rot);
  shape(c, p, col, 6); shade(c, p, dk, -rx * 0.3, -ry * 0.16, 0.8);
  const co = Math.cos(rot), si = Math.sin(rot), P = (u: number, v: number) => [x + u * co - v * si, y + u * si + v * co];
  shine(c, [P(-rx * 0.6, -ry * 0.05), P(-rx * 0.5, -ry * 0.4)], 9);
};

// a clear glass or jar with liquid; `inside` draws what is in the liquid, before the glass front
const glassIn = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, liquid: string, inside: () => void, botK = 0.4) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const top = w / 2, bot = w * botK, ly = y - h * fill, lw = bot + (top - bot) * fill;
  shape(c, () => { c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, liquid, 0);
  shape(c, () => ell(c, x, ly, lw, w * 0.07), COL.drop, 0);
  inside();
  shape(c, () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, "rgba(214,236,250,0.22)", 5);
  shape(c, () => ell(c, x, y - h, top, w * 0.08), "rgba(255,255,255,0.3)", 5);
  shine(c, [[x - top * 0.8, y - h * 0.85], [x - bot * 0.85, y - h * 0.2]], 8);
};
const steam = (c: Ctx, x: number, y: number, h: number) => {
  const pts: number[][] = []; for (let i = 0; i <= 16; i++) pts.push([x + Math.sin(i * 0.8) * 22, y - (h * i) / 16]);
  line(c, pts, 22, INK); line(c, pts, 12, WHITE);
};
const ice = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  const pts = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [x + (u * Math.cos(rot) - v * Math.sin(rot)) * s, y + (u * Math.sin(rot) + v * Math.cos(rot)) * s]);
  shape(c, () => polyP(c, pts), "#e6f4fb", 5); line(c, [[x - s * 0.5, y - s * 0.2], [x - s * 0.2, y - s * 0.5]], 5, WHITE);
};
const bubble = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.7)", Math.max(2.5, r * 0.18)); line(c, [[x - r * 0.4, y - r * 0.1], [x - r * 0.2, y - r * 0.45]], Math.max(2, r * 0.2), WHITE); };
const eggInGlass = (c: Ctx, x: number, y: number, k = 1) => egg(c, x, y - 96 * k, 72 * k, 92 * k);

// setup.e1.0
const cardE10 = (c: Ctx) => {
  ground(c);
  glassIn(c, 300, 880, 340, 480, 0.8, HOT, () => eggInGlass(c, 300, 880));
  glassIn(c, 780, 880, 340, 480, 0.8, COL.water, () => { eggInGlass(c, 780, 880); ice(c, 725, 516, 30, 0.3); ice(c, 800, 528, 28, -0.2); ice(c, 765, 482, 26, 0.7); });
  steam(c, 250, 365, 230); steam(c, 350, 365, 190);
};

// setup.e1.1
const cardE11 = (c: Ctx) => {
  ground(c);
  glassIn(c, 540, 990, 600, 780, 0.85, HOT, () => {
    egg(c, 540, 822, 125, 160);
    const trail = (sx: number, sy: number, n: number, drift: number, r0: number) => { let x = sx, y = sy; for (let i = 0; i < n; i++) { const r = r0 + i * 1.2; bubble(c, x, y, r); y -= 36 + r * 1.2; x += drift + (i % 2 ? 4 : -4); } };
    [[-118, 700, -3], [-100, 770, 0], [-55, 818, -2], [55, 820, 2], [100, 772, 0], [118, 702, 3]].forEach(([dx, y, d]) => trail(540 + dx, y + 25, 8, d, 8));
    trail(540, 650, 4, 2, 8);
  }, 0.4);
  steam(c, 450, 190, 120); steam(c, 630, 190, 100);
};

// setup.e1.2
const cardE12 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1010, 450, 22);
  shape(c, () => rrect(c, 60, 90, 960, 910, 18), WHITE, 6);
  line(c, [[60, 520], [1020, 520]], 4, COL.sky);
  // the hot glass shows its trails of bubbles; the cold glass has none, so its tally is 0
  const icon = (x: number, y: number, hot: boolean) => glassIn(c, x, y, 200, 260, 0.8, hot ? HOT : COL.water, () => {
    egg(c, x, y - 75, 50, 66);
    if (hot) { [-30, 0, 30].forEach((dx, k) => [155, 180, 203].forEach((d, i) => bubble(c, x + dx + (i % 2 ? 5 : -5), y - d - (k === 1 ? 0 : 4), 8))); bubble(c, x - 58, y - 100, 7); bubble(c, x + 60, y - 120, 7); }
    else { ice(c, x - 40, y - 205, 20, 0.3); ice(c, x + 35, y - 200, 18, -0.2); }
  }, 0.4);
  icon(200, 450, true); icon(200, 910, false); steam(c, 200, 175, 60);
  const mark = (x: number, y0: number) => line(c, [[x, y0], [x, y0 + 105]], 11);
  [380, 414, 448, 482].forEach((x) => mark(x, 270)); line(c, [[362, 365], [505, 280]], 11); mark(545, 270);
  write(c, "0", 400, 690, 150, INK, 13);
  // the pencil making the next mark, a child's hand holding it
  const tip = [579, 375], an = Math.PI - 0.5, dx = Math.cos(an), dy = Math.sin(an), wx = tip[0] - dx * 310, wy = tip[1] - dy * 310;
  line(c, [[579, 270], tip], 11);
  const pt = (d: number) => [wx + dx * d, wy + dy * d];
  line(c, [pt(40), pt(255)], 38, INK); line(c, [pt(40), pt(255)], 28, COL.yellow);
  shape(c, () => polyP(c, [[pt(250)[0] - dy * 18, pt(250)[1] + dx * 18], [pt(250)[0] + dy * 18, pt(250)[1] - dx * 18], tip]), COL.wood, 5);
  line(c, [pt(300), tip], 12, INK);
  hand(c, wx, wy, an, 1.4);
};

// setup.e2.0
const cardE20 = (c: Ctx) => {
  ground(c);
  shadow(c, 465, 668, 280, 30);
  egg(c, 440, 470, 185, 250, Math.PI / 2);
  const str = (pts: number[][]) => { line(c, pts, 22, INK); line(c, pts, 12, COL.blueDk); };
  str([[390, 292], [418, 340], [430, 400], [432, 470], [430, 540], [418, 600], [390, 650]]);
  str([[390, 292], [520, 215], [700, 190], [840, 205]]); str([[392, 294], [540, 262], [720, 236], [840, 212]]);
  hand(c, 930, 215, Math.PI + 0.1, 1.5);
  // the ruler: zero at the egg's round end, 5 cm to its tip
  shadow(c, 560, 925, 430, 18);
  shape(c, () => polyP(c, [[110, 790], [990, 790], [990, 900], [110, 900]]), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(113, 880, 874, 17);
  for (let mm = 0; mm <= 76; mm++) { const x = 190 + mm * 10, h = mm % 10 === 0 ? 44 : mm % 5 === 0 ? 30 : 17; line(c, [[x, 790], [x, 790 + h]], mm % 10 === 0 ? 5 : 3); }
  for (let cm = 0; cm <= 7; cm++) write(c, String(cm), 190 + cm * 100 - 10, 840, 36, INK, 6);
};

// setup.e2.1
const cardE21 = (c: Ctx) => {
  ground(c);
  glassIn(c, 540, 975, 640, 790, 0.85, VINEGAR, () => {
    egg(c, 540, 800, 135, 172);
    const r = rnd(5);
    for (let i = 0; i < 46; i++) { const a = r() * 6.28, d = Math.sqrt(r()); const bx = 540 + Math.cos(a) * d * 120, by = 810 + Math.sin(a) * d * 150; bubble(c, bx, by, 8 + r() * 4); }
    [[430, 650, 14], [655, 620, 16], [480, 560, 13], [600, 520, 12], [420, 470, 14], [680, 450, 12], [540, 400, 15]].forEach(([x, y, rr]) => bubble(c, x, y, rr));
  }, 0.46);
};

// setup.e2.2
const cardE22 = (c: Ctx) => {
  c.fillStyle = "#1f2547"; c.fillRect(0, 0, 1080, 1080);
  c.fillStyle = "#332c57"; c.fillRect(0, 880, 1080, 200);
  line(c, [[0, 880], [1080, 880]], 6);
  // the beam from the torch, through the egg
  c.fillStyle = "rgba(255,228,120,0.35)"; c.beginPath(); polyP(c, [[480, 615], [480, 665], [650, 800], [650, 480]]); c.fill();
  c.fillStyle = "rgba(247,170,70,0.3)"; c.beginPath(); polyP(c, [[860, 500], [860, 780], [1080, 900], [1080, 380]]); c.fill();
  [[300, 220, 0.12], [240, 190, 0.12], [180, 160, 0.14]].forEach(([rx, ry, a]) => { c.fillStyle = `rgba(255,200,90,${a})`; c.beginPath(); ell(c, 760, 640, rx, ry); c.fill(); });
  bowl(c, 760, 775, 135);
  const p = eggP(c, 760, 640, 125, 160);
  shape(c, p, "#f7a23c", 6); shape(c, () => ell(c, 748, 650, 82, 112), "#fbc56a", 0); shape(c, () => ell(c, 748, 668, 52, 52), "#e8761f", 4);
  shine(c, [[690, 600], [700, 540]], 9);
  c.beginPath(); c.ellipse(760, 775, 135, 27, 0, 0.05, Math.PI - 0.05); c.strokeStyle = INK; c.lineWidth = 24; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.ellipse(760, 775, 135, 27, 0, 0.05, Math.PI - 0.05); c.strokeStyle = COL.steel; c.lineWidth = 14; c.stroke();
  // the torch in a child's hand
  shape(c, () => rrect(c, 180, 590, 230, 100, 14), COL.teal); shade(c, () => rrect(c, 180, 590, 230, 100, 14), COL.tealDk, -20, -35, 0.8);
  shape(c, () => polyP(c, [[410, 575], [480, 535], [480, 745], [410, 705]]), COL.steel);
  shape(c, () => ell(c, 481, 640, 16, 106), COL.yellow, 5);
  hand(c, 140, 640, 0, 1.5);
};

// a tadpole: round dark body, head to the right, a thin tail behind
const tadpole = (c: Ctx, x: number, y: number, s: number, rot = 0, col = "#4a3f3a") => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => { c.moveTo(-16, -11); c.quadraticCurveTo(-60, -30, -100, 0); c.quadraticCurveTo(-60, 22, -16, 11); c.closePath(); }, col, 5);
  shape(c, () => ell(c, 0, 0, 27, 21), col, 5);
  shape(c, () => ell(c, 9, -7, 4, 4), WHITE, 0); line(c, [[-12, -10], [14, -14]], 4, "#8a7a70");
  c.restore();
};

// setup.e3.0
const cardE30 = (c: Ctx) => {
  ground(c, "#cfe3a8");
  [[70, 90, 3.7], [110, 70, 4.1], [980, 100, 5.2], [1010, 140, 5.6]].forEach(([x, y, a]) => leaf(c, x, y, 110, a));
  // a shallow puddle in the mud, tadpoles swimming in it
  shape(c, () => ell(c, 540, 780, 520, 250), "#8c6a45", 6);
  const pud = () => ell(c, 540, 780, 465, 205);
  shape(c, pud, "#9ccbd8", 5); shade(c, pud, COL.waterDk, 40, 30, 0.45);
  // the steel tumbler, tilted, its mouth dipping under the water
  c.save(); c.translate(560, 580); c.rotate(3.665);
  const body = () => { c.moveTo(-85, -150); c.lineTo(85, -150); c.lineTo(68, 150); c.lineTo(-68, 150); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -30, -10, 0.8);
  shape(c, () => ell(c, 0, -150, 85, 24), "#6f7a8b", 6);
  line(c, [[-55, -110], [-45, 90]], 9, WHITE);
  c.restore();
  c.save(); c.beginPath(); pud(); c.clip(); c.fillStyle = "rgba(143,195,234,0.4)"; c.fillRect(0, 700, 1080, 400); c.restore();
  [[260, 790, 1.0, 0.3], [640, 850, 1.1, 2.9], [770, 760, 1.0, 0.4], [860, 830, 1.0, 5.6], [700, 910, 1.1, 0.1], [560, 800, 1.0, 3.2], [300, 880, 1.1, 5.5]].forEach(([x, y, s, r]) => tadpole(c, x, y, s, r));
  [[480, 720, 130, 36], [480, 720, 185, 54]].forEach(([x, y, rx, ry], i) => { c.beginPath(); ell(c, x, y + 12, rx, ry); c.strokeStyle = WHITE; c.lineWidth = i ? 5 : 8; c.globalAlpha = i ? 0.6 : 0.9; c.stroke(); c.globalAlpha = 1; });
  tadpole(c, 450, 810, 1.1, 5.9); tadpole(c, 395, 770, 1.0, 0.6);
  arrow(c, [[330, 990], [405, 870]], RED, 14);
  hand(c, 683, 455, 2.5, 1.3);
};

// the clear tub, seen from the front; `inside` draws what is in the water
const TUB = { x: 100, y: 190, w: 880, h: 700, water: 0.24 };
const tub = (c: Ctx, inside: () => void) => {
  const { x, y, w, h } = TUB, bx = 70, wy = y + h * TUB.water, cx = x + w / 2;
  const body = () => { c.moveTo(x, y); c.lineTo(x + w, y); c.lineTo(x + w - bx, y + h); c.quadraticCurveTo(cx, y + h + 40, x + bx, y + h); c.closePath(); };
  shadow(c, cx + 40, y + h + 25, w * 0.52, 30);
  shape(c, body, "rgba(255,255,255,0.4)", 0);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(0, wy, 1080, 1080); c.restore();
  shape(c, () => ell(c, cx, wy, w / 2 - 12, 30), COL.drop, 0);
  inside();
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = "rgba(143,195,234,0.3)"; c.fillRect(0, wy, 1080, 1080); c.restore();
  shape(c, body, "rgba(214,236,250,0.2)", 6);
  shape(c, () => ell(c, cx, y, w / 2, 36), "rgba(255,255,255,0.3)", 6);
  shine(c, [[x + 50, y + 130], [x + 90, y + h - 110]], 9);
};
// the same stone, weeds and stick on both tub cards
const tubStuff = (c: Ctx) => {
  const { x, y, w, h } = TUB, bot = y + h - 10;
  [[640, 0.2], [720, -0.15], [800, -0.45], [680, 0.5]].forEach(([bxx, a], i) => leaf(c, bxx, bot, 250 + i * 25, -Math.PI / 2 + a, i % 2 ? COL.leaf : COL.green));
  const sp = () => { c.moveTo(430, bot - 150); c.bezierCurveTo(430, bot - 170, 650, bot - 170, 660, bot - 60); c.quadraticCurveTo(540, bot + 10, 430, bot - 20); c.closePath(); };
  void sp;
  const stone = () => ell(c, 420, bot - 60, 150, 75);
  shape(c, stone, "#a39e94", 6); shade(c, stone, "#7d7870", -40, -25, 0.8);
  [[350, bot - 90, 28], [450, bot - 100, 22], [400, bot - 50, 26], [490, bot - 60, 18]].forEach(([sx, sy, r]) => shape(c, () => ell(c, sx, sy, r, r * 0.6), "#7fae5a", 3));
  line(c, [[345, bot - 20], [190, y + 20]], 34, INK); line(c, [[345, bot - 20], [190, y + 20]], 24, COL.brown); line(c, [[355, bot - 20], [200, y + 20]], 6, COL.woodDk);
  void x; void w;
};

// setup.e3.1
const cardE31 = (c: Ctx) => { ground(c); tub(c, () => tubStuff(c)); };

// setup.e3.2
const cardE32 = (c: Ctx) => {
  ground(c);
  tub(c, () => { tubStuff(c); tadpole(c, 281, 395, 1.9, Math.PI, "#241d1a"); });
  // the ruler held against the outside of the tub, zero at the tadpole's nose
  shadow(c, 400, 545, 220, 14);
  shape(c, () => rrect(c, 185, 455, 420, 75, 6), COL.wood);
  for (let mm = 0; mm <= 55; mm++) { const x = 230 + mm * 4.9, h = mm % 10 === 0 ? 30 : mm % 5 === 0 ? 21 : 12; line(c, [[x, 455], [x, 455 + h]], mm % 10 === 0 ? 4 : 2.5); }
  for (let cm = 0; cm <= 5; cm++) write(c, String(cm), 230 + cm * 49 - 8, 490, 28, INK, 5);
  hand(c, 665, 492, Math.PI, 1.5);
  // the notebook: two measurements, a pencil on it
  shadow(c, 800, 1030, 250, 22);
  shape(c, () => rrect(c, 570, 760, 440, 260, 14), WHITE, 6);
  for (let i = 0; i < 6; i++) line(c, [[600 + i * 70, 760], [600 + i * 70, 790]], 8, COL.steelDk);
  write(c, "2 cm", 640, 820, 60, INK, 8); write(c, "3 cm", 640, 920, 60, INK, 8);
  line(c, [[880, 980], [990, 800]], 26, INK); line(c, [[880, 980], [990, 800]], 16, COL.yellow);
  shape(c, () => polyP(c, [[870, 1000], [892, 990], [876, 960]]), COL.wood, 4);
};

export const su_animalsAnimalLifeCycles = cards("sci.animals.animal-life-cycles.L3 set-up", [cardE10, cardE11, cardE12, cardE20, cardE21, cardE22, cardE30, cardE31, cardE32]);
