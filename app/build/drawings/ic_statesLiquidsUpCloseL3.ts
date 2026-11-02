import type { Ctx } from "./core";
import { COL, INK, WHITE, RED, SH, D, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, hand, write, cards, SKIN, CLOTH, rnd } from "./flatKit";

// LIQUIDS UP CLOSE (L3) · picture cards for the unit's intro, cover, activities, terms and explanations.
const HONEY = "#e0901f", HONEYDk = "#b86d10", HONEYLt = "#f6b94a", OIL = "#f2c230", OILDk = "#c99a10", SHAMP = "#e66fa8", SHAMPDk = "#c24c86";
const MILK = "#f4f1ea", MILKDk = "#d9d3c6", BLACKP = "#2d2833";

const thread = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 8, INK); line(c, pts, w, col); };
const dropP = (c: Ctx, x: number, y: number, s: number) => { c.moveTo(x, y - s * 1.6); c.quadraticCurveTo(x + s * 0.25, y - s * 0.6, x + s, y + s * 0.3); c.arc(x, y + s * 0.3, s, 0, Math.PI); c.quadraticCurveTo(x - s * 0.25, y - s * 0.6, x, y - s * 1.6); c.closePath(); };
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) => { shape(c, () => dropP(c, x, y, s), col, Math.max(3, s * 0.14)); shine(c, [[x - s * 0.5, y + s * 0.1], [x - s * 0.4, y + s * 0.5]], Math.max(3, s * 0.18)); };
const wisp = (c: Ctx, x: number, y: number, h: number) => { const pts: number[][] = []; for (let i = 0; i <= 10; i++) pts.push([x + Math.sin(i * 0.9) * h * 0.12, y - (i / 10) * h]); line(c, pts, 18, INK); line(c, pts, 9, WHITE); };
// a spoon, bowl centre (x, y), handle running out at angle a
const spoon = (c: Ctx, x: number, y: number, a: number, liquid: string = COL.steelIn) => {
  c.save(); c.translate(x, y); c.rotate(a);
  line(c, [[30, 0], [250, -8]], 24, INK); line(c, [[30, 0], [250, -8]], 13, COL.steel);
  shape(c, () => ell(c, 0, 0, 62, 40), COL.steel, 6);
  shape(c, () => ell(c, 0, 0, 48, 28), liquid, 4);
  c.restore();
};
// a hand gripping the spoon handle
const gripSpoon = (c: Ctx, x: number, y: number, a: number, sign: number) => {
  const px = x + Math.cos(a) * 175 - Math.sin(a) * -6, py = y + Math.sin(a) * 175 + Math.cos(a) * -6, an = a + sign * Math.PI / 2;
  hand(c, px - Math.cos(an) * 70, py - Math.sin(an) * 70, an, 1);
};
// a lane head: a trail from y0 down to a round head at y1
const lane = (c: Ctx, x: number, y0: number, y1: number, w: number, col: string, dk: string) => {
  shape(c, () => polyP(c, [[x - w * 0.5, y0], [x - w * 0.85, y1], [x + w * 0.85, y1], [x + w * 0.5, y0]]), col, 4);
  shape(c, () => ell(c, x, y1, w, w * 0.7), col, 5);
  shade(c, () => ell(c, x, y1, w, w * 0.7), dk, w * 0.3, w * 0.2, 0.5);
  shine(c, [[x - w * 0.55, y1 - w * 0.15], [x - w * 0.15, y1 - w * 0.4]], 7);
};
const trayFlat = (c: Ctx, x: number, y: number, w: number, h: number) => {
  c.beginPath(); rrect(c, x + 22, y + 30, w, h, 24); c.fillStyle = SH; c.fill();
  shape(c, () => rrect(c, x, y, w, h, 24), COL.steel, 6);
  shape(c, () => rrect(c, x + 26, y + 26, w - 52, h - 52, 14), COL.steelIn, 5);
};
const stopwatch = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + 12, y + r + 6, r * 0.9, 16);
  shape(c, () => rrect(c, x - 18, y - r - 44, 36, 36, 8), COL.steelDk, 5);
  shape(c, () => ell(c, x, y, r, r), WHITE, 7);
  c.beginPath(); c.moveTo(x, y); c.arc(x, y, r * 0.8, -Math.PI / 2, -Math.PI / 2 + 1.7); c.closePath(); c.fillStyle = RED; c.fill();
  for (let i = 0; i < 12; i++) { const an = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(an) * r * 0.86, y + Math.sin(an) * r * 0.86], [x + Math.cos(an) * r * 0.97, y + Math.sin(an) * r * 0.97]], 4); }
  line(c, [[x, y], [x, y - r * 0.7]], 6);
};
const kBowl = (c: Ctx, x: number, y: number, r: number, liq: string, hi: string) => {
  bowl(c, x, y, r, liq);
  c.beginPath(); ell(c, x - r * 0.25, y - 2, r * 0.4, r * 0.06); c.fillStyle = hi; c.fill();
};
// a particle ball
const ball = (c: Ctx, x: number, y: number, r: number, col: string = COL.water, dk: string = COL.waterDk) => {
  shape(c, () => ell(c, x, y, r, r), col, Math.max(3, r * 0.1));
  shade(c, () => ell(c, x, y, r, r), dk, r * 0.35, r * 0.3, 0.55);
  shine(c, [[x - r * 0.5, y - r * 0.1], [x - r * 0.25, y - r * 0.5]], Math.max(3, r * 0.14));
};

// 0 intro: water and honey tipped over a plate together
const intro = (c: Ctx) => {
  ground(c);
  plate(c, 540, 850, 420, 120);
  // water: thin fast stream, spread flat
  shape(c, () => ell(c, 345, 860, 215, 56), COL.water, 4);
  c.beginPath(); ell(c, 300, 850, 90, 14); c.fillStyle = COL.drop; c.fill();
  thread(c, [[352, 400], [350, 600], [346, 840]], 22, COL.water);
  for (const [x, y, s] of [[250, 800, 9], [455, 790, 8], [410, 740, 7]]) drop(c, x, y, s);
  // honey: a long slow rope and a little hill
  shape(c, () => { c.moveTo(670, 860); c.bezierCurveTo(675, 750, 785, 750, 790, 860); c.quadraticCurveTo(730, 890, 670, 860); c.closePath(); }, HONEY, 5);
  shine(c, [[700, 835], [715, 795]], 8);
  thread(c, [[728, 400], [736, 520], [726, 640], [730, 790]], 14, HONEY);
  spoon(c, 330, 360, -2.2, COL.water); gripSpoon(c, 330, 360, -2.2, 1);
  spoon(c, 760, 360, -0.94, HONEY);
  gripSpoon(c, 760, 360, -0.94, -1);
};

// 1 summary: the same race down a tray, water far ahead, honey barely moved
const summary = (c: Ctx) => {
  ground(c);
  trayFlat(c, 190, 110, 700, 840);
  line(c, [[230, 220], [850, 220]], 8, "#ffd34d");
  lane(c, 360, 230, 830, 56, COL.water, COL.waterDk);
  lane(c, 700, 230, 380, 56, HONEY, HONEYDk);
  arrow(c, [[960, 250], [960, 780]]);
};

// 2 e1: four kitchen liquids raced, a stopwatch, a bowl of warm honey
const e1 = (c: Ctx) => {
  ground(c);
  trayFlat(c, 70, 110, 640, 840);
  line(c, [[110, 215], [670, 215]], 8, "#ffd34d");
  lane(c, 190, 225, 820, 42, COL.water, COL.waterDk);
  lane(c, 310, 225, 690, 42, OIL, OILDk);
  lane(c, 430, 225, 560, 42, SHAMP, SHAMPDk);
  lane(c, 550, 225, 420, 42, HONEY, HONEYDk);
  stopwatch(c, 880, 250, 100);
  const kx = 880, ky = 720;
  shadow(c, kx + 10, ky + 130, 140, 24);
  const kb = () => { c.moveTo(kx - 150, ky); c.bezierCurveTo(kx - 140, ky + 150, kx + 140, ky + 150, kx + 150, ky); c.closePath(); };
  shape(c, kb, COL.steel); shade(c, kb, COL.steelDk, 50, -8);
  shape(c, () => ell(c, kx, ky, 150, 34), HONEY, 5);
  wisp(c, kx - 70, ky - 30, 160); wisp(c, kx + 70, ky - 30, 180);
};

// 3 e2: drops piling up as a dome on a coin
const e2 = (c: Ctx) => {
  ground(c);
  shadow(c, 590, 830, 330, 50);
  shape(c, () => { c.moveTo(240, 740); c.lineTo(240, 770); c.quadraticCurveTo(540, 900, 840, 770); c.lineTo(840, 740); c.closePath(); }, COL.steelDk, 6);
  shape(c, () => ell(c, 540, 740, 300, 110), COL.steel, 6);
  shape(c, () => ell(c, 540, 740, 250, 85), COL.steelIn, 4);
  const dome = () => { c.moveTo(310, 742); c.bezierCurveTo(330, 540, 750, 540, 770, 742); c.quadraticCurveTo(540, 830, 310, 742); c.closePath(); };
  shape(c, dome, COL.water, 6);
  shade(c, dome, COL.waterDk, 60, 0, 0.5);
  shine(c, [[400, 700], [440, 620], [520, 590]], 11);
  // the dropper
  shape(c, () => ell(c, 540, 130, 62, 85), COL.red, 6);
  shape(c, () => rrect(c, 505, 195, 70, 40, 8), COL.steelDk, 5);
  shape(c, () => polyP(c, [[512, 235], [568, 235], [552, 400], [540, 440], [528, 400]]), COL.glass, 5);
  shape(c, () => polyP(c, [[522, 330], [558, 330], [551, 400], [540, 435], [529, 400]]), COL.water, 0);
  drop(c, 540, 500, 20);
  arrow(c, [[640, 440], [640, 520]]);
};

// 4 a1: water spreads out flat, honey stays in a heap
const a1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 680, 460, 190);
  shape(c, () => ell(c, 330, 690, 235, 80), COL.water, 5);
  shine(c, [[200, 670], [290, 650]], 10);
  const hill = () => { c.moveTo(680, 720); c.bezierCurveTo(680, 540, 880, 540, 880, 720); c.quadraticCurveTo(780, 770, 680, 720); c.closePath(); };
  shape(c, hill, HONEY, 6); shade(c, hill, HONEYDk, 40, 0, 0.5);
  shine(c, [[715, 670], [735, 600], [780, 575]], 10);
  arrow(c, [[320, 700], [170, 700]]); arrow(c, [[340, 700], [490, 700]]);
};

// 5 a2: a thread loop is pulled round when soap touches the water inside it
const a2 = (c: Ctx) => {
  ground(c);
  const dish = (x: number) => { shadow(c, x + 14, 600, 235, 40); shape(c, () => ell(c, x, 540, 225, 225), COL.steel, 6); shape(c, () => ell(c, x, 540, 190, 190), COL.water, 5); shine(c, [[x - 130, 470], [x - 90, 410]], 9); };
  dish(270); dish(810);
  const THR = "#f4e9d0";
  // before: a floppy loop; soap on a toothpick in the middle
  const blob: number[][] = []; for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2, r = 105 + Math.sin(t * 3) * 22 + Math.cos(t * 2 + 1) * 18; blob.push([270 + Math.cos(t) * r * 1.0, 540 + Math.sin(t) * r * 0.85]); }
  blob.push(blob[0]); thread(c, blob, 9, THR);
  line(c, [[420, 740], [300, 560]], 14, INK); line(c, [[420, 740], [300, 560]], 6, COL.wood);
  shape(c, () => ell(c, 292, 548, 16, 12), WHITE, 4);
  // after: a round loop, red arrows pulling out
  const circ: number[][] = []; for (let i = 0; i <= 28; i++) { const t = (i / 28) * Math.PI * 2; circ.push([810 + Math.cos(t) * 135, 540 + Math.sin(t) * 135]); }
  thread(c, circ, 9, THR);
  shape(c, () => ell(c, 810, 540, 20, 15), WHITE, 4);
  for (let i = 0; i < 6; i++) { const t = i * Math.PI / 3 + 0.5; arrow(c, [[810 + Math.cos(t) * 60, 540 + Math.sin(t) * 60], [810 + Math.cos(t) * 100, 540 + Math.sin(t) * 100]], RED, 7); }
  arrow(c, [[500, 540], [585, 540]]);
};

// 6 a4: bottles flipped, the bubble rises fast in water, slowly in honey
const a4 = (c: Ctx) => {
  ground(c);
  const bottle = (x: number, liq: string, dk: string, by: number, tint: string) => {
    shadow(c, x + 14, 880, 120, 22);
    shape(c, () => rrect(c, x - 30, 700, 60, 60, 6), tint, 5);
    shape(c, () => rrect(c, x - 40, 755, 80, 55, 12), COL.teal, 5);
    const body = () => rrect(c, x - 95, 180, 190, 540, 46);
    shape(c, body, liq, 6); shade(c, body, dk, 36, 0, 0.5);
    shape(c, () => ell(c, x, by, 40, 40), COL.glass, 5);
    shine(c, [[x - 72, 260], [x - 72, 600]], 9);
  };
  bottle(200, COL.water, COL.waterDk, 260, COL.sky);
  bottle(540, OIL, OILDk, 440, COL.sky);
  bottle(880, HONEY, HONEYDk, 640, COL.sky);
  arrow(c, [[200, 600], [200, 360]]); arrow(c, [[540, 600], [540, 520]]);
};

// 7 a5: ketchup and curd get runnier when shaken or stirred
const a5 = (c: Ctx) => {
  ground(c);
  plate(c, 280, 880, 220, 66);
  const body = () => rrect(c, 190, 150, 180, 380, 56);
  shape(c, () => rrect(c, 240, 520, 80, 60, 8), WHITE, 5);
  shape(c, () => polyP(c, [[250, 580], [310, 580], [290, 610], [270, 610]]), WHITE, 5);
  shape(c, body, COL.red, 6); shade(c, body, "#b83a26", 36, 0, 0.5);
  shape(c, () => rrect(c, 220, 260, 120, 160, 14), COL.paper, 4);
  shape(c, () => ell(c, 280, 340, 30, 30), COL.red, 3);
  shine(c, [[215, 190], [215, 480]], 9);
  thread(c, [[280, 612], [280, 700], [280, 830]], 14, COL.red);
  shape(c, () => ell(c, 280, 860, 85, 28), COL.red, 5);
  arrow(c, [[120, 230], [120, 400]]); arrow(c, [[440, 400], [440, 230]]);
  kBowl(c, 760, 640, 230, WHITE, MILKDk);
  c.beginPath(); ell(c, 760, 640, 190, 20); c.fillStyle = MILK; c.fill();
  line(c, [[780, 620], [900, 330]], 24, INK); line(c, [[780, 620], [900, 330]], 12, COL.steel);
  { const arc: number[][] = []; for (let i = 0; i <= 10; i++) { const t = Math.PI * (1.05 + i * 0.09); arc.push([770 + Math.cos(t) * 150, 560 + Math.sin(t) * 55]); } arrow(c, arc, RED, 10); }
};

// 8 p1: the thickness ladder, runny at the bottom, thick at the top
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 520, 950, 280, 24);
  for (const x of [250, 790]) { line(c, [[x, 60], [x, 930]], 36, INK); line(c, [[x, 60], [x, 930]], 22, COL.wood); }
  const rungs: [number, string, string, number][] = [[800, COL.water, COL.waterDk, 24], [650, MILK, MILKDk, 36], [500, OIL, OILDk, 48], [350, "#e8c27a", "#c99a50", 62], [200, HONEY, HONEYDk, 84]];
  rungs.forEach(([y, col, dk, h]) => {
    line(c, [[250, y], [790, y]], 30, INK); line(c, [[250, y], [790, y]], 16, COL.wood);
    const m = () => { c.moveTo(400, y - 12); c.bezierCurveTo(400, y - 12 - h * 1.6, 640, y - 12 - h * 1.6, 640, y - 12); c.closePath(); };
    shape(c, m, col, 5); shade(c, m, dk, 30, 0, 0.5);
  });
  arrow(c, [[930, 880], [930, 180]]);
};

// 9 c1: water made thick: a pinch of flour, then it clings to the spoon
const c1 = (c: Ctx) => {
  ground(c);
  glass(c, 200, 850, 300, 460, 0.8, COL.water);
  arrow(c, [[380, 640], [680, 640]]);
  const heap = () => { c.moveTo(450, 400); c.bezierCurveTo(470, 300, 610, 300, 630, 400); c.closePath(); };
  bowl(c, 540, 400, 130, WHITE);
  shape(c, heap, WHITE, 6); shade(c, heap, MILKDk, 30, 0, 0.6);
  glass(c, 860, 850, 300, 460, 0.8, "#e8c27a");
  spoon(c, 800, 250, -0.2, "#e8c27a");
  thread(c, [[790, 292], [795, 400], [790, 520]], 14, "#e8c27a");
  c.beginPath(); ell(c, 790, 545, 30, 12); c.fillStyle = "#c99a50"; c.fill();
};

// 10 c2: a card boat pushed along by a drop of soap
const c2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 400, 30);
  shape(c, () => ell(c, 540, 540, 410, 380), COL.steel, 6);
  shape(c, () => ell(c, 540, 540, 365, 335), COL.water, 5);
  shine(c, [[250, 360], [320, 300]], 10);
  shadow(c, 470, 570, 130, 30);
  shape(c, () => polyP(c, [[330, 490], [470, 490], [590, 540], [470, 590], [330, 590]]), COL.orange, 6);
  shape(c, () => polyP(c, [[350, 508], [460, 508], [545, 540], [460, 572], [350, 572]]), COL.yellow, 3);
  line(c, [[240, 760], [320, 590]], 14, INK); line(c, [[240, 760], [320, 590]], 6, COL.wood);
  shape(c, () => ell(c, 322, 590, 17, 13), WHITE, 4);
  for (const [x, y] of [[300, 500], [296, 540]] as number[][]) shape(c, () => ell(c, x, y, 8, 8), WHITE, 3);
  arrow(c, [[660, 540], [840, 540]]);
};

// 11 term.0 liquid: the same water in a glass, a bowl and a tall glass
const liquid = (c: Ctx) => {
  ground(c);
  glass(c, 200, 800, 250, 380, 0.7);
  bowl(c, 560, 600, 190, COL.water);
  c.beginPath(); ell(c, 500, 598, 60, 8); c.fillStyle = COL.drop; c.fill();
  glass(c, 900, 800, 150, 560, 0.7);
};

// 12 term.3 viscous: thick honey, a slow rope into the jar
const viscous = (c: Ctx) => {
  ground(c);
  glass(c, 540, 930, 420, 380, 0.7, HONEY);
  const ly = 930 - 380 * 0.7;
  thread(c, [[500, 300], [512, 400], [504, 500], [508, ly + 10]], 14, HONEY);
  spoon(c, 470, 250, -0.3, HONEY); gripSpoon(c, 470, 250, -0.3, -1);
  const hill = () => { c.moveTo(450, ly + 10); c.bezierCurveTo(470, ly - 60, 560, ly - 60, 580, ly + 10); c.closePath(); };
  shape(c, hill, HONEY, 5);
};

// 13 term.4 runny: thin water pours fast and splashes
const runny = (c: Ctx) => {
  ground(c);
  glass(c, 700, 900, 300, 420, 0.5);
  c.save(); c.translate(330, 260); c.rotate(0.6);
  shape(c, () => rrect(c, -110, -130, 220, 260, 40), COL.teal, 6);
  shade(c, () => rrect(c, -110, -130, 220, 260, 40), COL.tealDk, 40, 0, 0.5);
  shape(c, () => polyP(c, [[100, -130], [160, -150], [130, -100], [110, -90]]), COL.teal, 6);
  line(c, [[-110, -80], [-190, -60], [-190, 60], [-110, 80]], 28, INK); line(c, [[-110, -80], [-190, -60], [-190, 60], [-110, 80]], 14, COL.teal);
  c.restore();
  thread(c, [[490, 222], [600, 280], [680, 480], [690, 600]], 16, COL.water);
  for (const [x, y, s] of [[580, 640, 10], [830, 600, 9], [760, 540, 8], [620, 540, 7]]) drop(c, x, y, s);
  arrow(c, [[860, 300], [860, 450]]);
};

// 14 term.5 particle: a spoon of water, zoomed in to the tiny pieces
const particleCard = (c: Ctx) => {
  ground(c);
  shadow(c, 660, 900, 330, 30);
  shape(c, () => ell(c, 660, 560, 340, 340), COL.sky, 7);
  c.save(); c.beginPath(); ell(c, 660, 560, 340, 340); c.clip();
  const r = rnd(4);
  for (let row = 0; row < 7; row++) for (let col = 0; col < 7; col++) { const x = 400 + col * 100 + (row % 2) * 50 + r() * 14, y = 330 + row * 88 + r() * 10; if ((x - 660) ** 2 + (y - 560) ** 2 < 300 ** 2) ball(c, x, y, 40); }
  c.restore();
  c.beginPath(); ell(c, 660, 560, 340, 340); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
  line(c, [[300, 320], [441, 300]], 5); line(c, [[290, 365], [350, 700]], 5);
  spoon(c, 260, 330, -1.9, COL.water);
  gripSpoon(c, 260, 330, -1.9, 1);
};

// 15 term.6 attract: tiny pieces pulling each other close
const attract = (c: Ctx) => {
  ground(c);
  const R = 235;
  for (let i = 0; i < 6; i++) { const t = i * Math.PI / 3 + Math.PI / 6, x = 540 + Math.cos(t) * R, y = 540 + Math.sin(t) * R; ball(c, x, y, 65); arrow(c, [[540 + Math.cos(t) * (R - 85), 540 + Math.sin(t) * (R - 85)], [540 + Math.cos(t) * 108, 540 + Math.sin(t) * 108]], RED, 9); }
  ball(c, 540, 540, 75);
};

// 16 term.7 surface: the top layer of water, where it meets the air
const surfaceCard = (c: Ctx) => {
  ground(c);
  glass(c, 500, 900, 480, 640, 0.75);
  const ly = 900 - 640 * 0.75, lw = 192 + 48 * 0.75;
  c.beginPath(); ell(c, 500, ly, lw, 480 * 0.07); c.lineWidth = 12; c.strokeStyle = RED; c.stroke();
  arrow(c, [[920, 250], [780, ly - 20]]);
};

// 17 term.10 pitch: a hard-looking black lump that sags and drips, very slowly
const shelf = (c: Ctx) => {
  shadow(c, 560, 940, 400, 28);
  shape(c, () => rrect(c, 140, 640, 560, 130, 14), COL.wood, 6); shade(c, () => rrect(c, 140, 640, 560, 130, 14), COL.woodDk, 0, 22, 0.5);
};
const pitchLump = (c: Ctx) => {
  ground(c);
  shelf(c);
  const lump = () => { c.moveTo(250, 640); c.bezierCurveTo(260, 480, 560, 480, 640, 620); c.quadraticCurveTo(710, 680, 690, 760); c.quadraticCurveTo(650, 790, 650, 720); c.lineTo(250, 640); c.closePath(); };
  shape(c, lump, BLACKP, 6);
  shine(c, [[310, 600], [350, 540], [430, 520]], 11);
  shape(c, () => { c.moveTo(660, 760); c.quadraticCurveTo(640, 840, 670, 850); c.quadraticCurveTo(710, 840, 690, 760); c.closePath(); }, BLACKP, 5);
  shine(c, [[665, 800], [668, 825]], 6);
  arrow(c, [[880, 560], [880, 800]]);
};

// 18 expl.1 honey's particles cling together, water's slip about
const whyThick = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 160, 480, 760, 30), "#fbe6b8", 6);
  shape(c, () => rrect(c, 560, 160, 480, 760, 30), "#d6ebfa", 6);
  const pts: number[][] = [];
  for (let row = 0; row < 5; row++) for (let col = 0; col < 3; col++) pts.push([145 + col * 115 + (row % 2) * 57, 260 + row * 130]);
  pts.forEach((a, i) => pts.forEach((b, j) => { if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < 140) line(c, [a, b], 14, INK); }));
  pts.forEach(([x, y]) => ball(c, x, y, 48, HONEY, HONEYDk));
  const r = rnd(9);
  const W: number[][] = [[660, 290], [830, 250], [950, 360], [700, 450], [880, 500], [980, 640], [650, 640], [790, 700], [940, 810], [700, 830]];
  W.forEach(([x, y]) => ball(c, x, y, 40));
  arrow(c, [[690, 340], [740, 380]], RED, 8); arrow(c, [[900, 430], [850, 400]], RED, 8); arrow(c, [[740, 560], [790, 620]], RED, 8); arrow(c, [[900, 700], [840, 740]], RED, 8); void r;
};

// 19 expl.2 warm honey runs further than cool honey
const warm = (c: Ctx) => {
  ground(c);
  trayFlat(c, 120, 150, 660, 780);
  line(c, [[160, 250], [740, 250]], 8, "#ffd34d");
  lane(c, 270, 260, 450, 60, HONEY, HONEYDk);
  lane(c, 620, 260, 790, 60, HONEY, HONEYDk);
  wisp(c, 580, 230, 120); wisp(c, 660, 230, 140);
  const kx = 910, ky = 700;
  shadow(c, kx + 8, ky + 100, 100, 18);
  const kb = () => { c.moveTo(kx - 100, ky); c.bezierCurveTo(kx - 95, ky + 110, kx + 95, ky + 110, kx + 100, ky); c.closePath(); };
  shape(c, kb, COL.steel); shade(c, kb, COL.steelDk, 34, -6);
  shape(c, () => ell(c, kx, ky, 100, 24), COL.water, 5);
  wisp(c, kx - 40, ky - 20, 120);
};

// 20 expl.4 a funnel of pitch, a drop gathering, years between drops
const funnel = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 300, 26);
  shape(c, () => rrect(c, 200, 880, 680, 50, 12), COL.wood, 6);
  shape(c, () => rrect(c, 410, 640, 260, 240, 30), COL.glass, 6);
  shape(c, () => polyP(c, [[250, 140], [830, 140], [580, 460], [500, 460]]), COL.glass, 6);
  shape(c, () => polyP(c, [[310, 230], [770, 230], [575, 450], [505, 450]]), BLACKP, 0);
  shape(c, () => rrect(c, 520, 455, 40, 60, 8), COL.glass, 5);
  shape(c, () => rrect(c, 524, 460, 32, 50, 6), BLACKP, 0);
  shape(c, () => { c.moveTo(528, 515); c.quadraticCurveTo(500, 590, 540, 600); c.quadraticCurveTo(580, 590, 552, 515); c.closePath(); }, BLACKP, 5);
  c.beginPath(); ell(c, 540, 870, 130, 24); c.fillStyle = BLACKP; c.fill();
  arrow(c, [[860, 520], [860, 780]]);
};

// 21 expl.5 surface tension: the top pieces pull sideways along the surface
const skin = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 100, 360, 880, 600, 20), "#d6ebfa", 6);
  const R = 52;
  for (let row = 0; row < 4; row++) for (let col = 0; col < 8; col++) { const x = 150 + col * 105 + (row % 2) * 50, y = 440 + row * 120; if (x < 950) ball(c, x, y, R); }
  for (let col = 0; col < 7; col++) { const x = 202 + col * 105; arrow(c, [[x + 4, 440], [x + 56, 440]], RED, 8); }
  // skin line over the top
  line(c, [[110, 380], [970, 380]], 9, WHITE);
  line(c, [[110, 380], [970, 380]], 3, INK);
};

export const ic_statesLiquidsUpCloseL3 = cards("sci.states.liquids-up-close.L3 cards", [
  intro, summary, e1, e2, a1, a2, a4, a5, p1, c1, c2, liquid, viscous, runny, particleCard, attract, surfaceCard, pitchLump, whyThick, warm, funnel, skin,
]);
