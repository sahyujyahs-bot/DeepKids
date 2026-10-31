import type { Ctx } from "./core";
import { D, INK, BG, RED, WHITE, COL, CLOTH, SH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, write, cards, rnd } from "./flatKit";

// SET-UP CARDS · sci.day-night-seasons.day-and-night.L3 · three experiments: torch and orange, shadow stick, pendulum on a stool.

// an arm coming in from the card edge ending in a hand; wrist at (x, y), pointing at angle an; mirror = comes from the right
const armHand = (c: Ctx, x: number, y: number, an: number, s: number, mirror = false, open = false) => {
  c.save(); c.translate(x, y); if (mirror) c.scale(-1, 1); c.rotate(an);
  c.save(); c.scale(s, s); shape(c, () => rrect(c, -1000, -32, 970, 64, 12), CLOTH.child, 6); c.restore();
  hand(c, 0, 0, 0, s, undefined, undefined, open);
  c.restore();
};

// ------------------------------------------------------------------ e1: the orange, the pencil, the torch
const OR = "#f58a1f", ORDK = "#c9650f";
// the orange with dots in a row along its middle; dotsAt = angles (degrees) round the orange, 0 = facing us; lit = light from the right only
const fruit = (c: Ctx, cx: number, cy: number, R: number, dotsAt: number[], lit = false) => {
  const body = () => ell(c, cx, cy, R, R);
  shape(c, body, OR, 0);
  shade(c, body, ORDK, R * 0.2, R * 0.16, 0.5);
  const r = rnd(5); c.fillStyle = "rgba(150,70,10,0.35)";
  for (let i = 0; i < 46; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * R * 0.9; c.beginPath(); ell(c, cx + Math.cos(a) * d, cy + Math.sin(a) * d, 3.5, 2.5); c.fill(); }
  shine(c, [[cx - R * 0.66, cy - R * 0.3], [cx - R * 0.5, cy - R * 0.58]], 12);
  dotsAt.forEach((deg) => { const t = (deg * Math.PI) / 180; shape(c, () => ell(c, cx + R * Math.sin(t) * 0.97, cy + R * 0.12, R * 0.13 * Math.max(0.3, Math.cos(t)), R * 0.13), RED, 5); });
  if (lit) { c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = "rgba(18,20,52,0.6)"; c.fillRect(cx - R - 5, cy - R - 5, R + 5, R * 2 + 10); c.restore(); }
  c.beginPath(); body(); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
};
// the pencil above the orange (sharp end up) and below it (rubber end down); x = its line
const pencilUp = (c: Ctx, x: number, y1: number, y2: number) => {
  shape(c, () => polyP(c, [[x - 18, y1 + 80], [x, y1], [x + 18, y1 + 80]]), "#f1d3a0", 5);
  shape(c, () => polyP(c, [[x - 6.5, y1 + 26], [x, y1], [x + 6.5, y1 + 26]]), INK, 3);
  shape(c, () => rrect(c, x - 18, y1 + 80, 36, y2 - y1 - 80, 3), COL.yellow, 5);
  shade(c, () => rrect(c, x - 18, y1 + 80, 36, y2 - y1 - 80, 3), "#e0a820", 11, 0, 0.7);
};
const pencilDown = (c: Ctx, x: number, y1: number, y2: number) => {
  shape(c, () => rrect(c, x - 18, y1, 36, y2 - y1 - 44, 3), COL.yellow, 5);
  shade(c, () => rrect(c, x - 18, y1, 36, y2 - y1 - 44, 3), "#e0a820", 11, 0, 0.7);
  shape(c, () => rrect(c, x - 18, y2 - 50, 36, 18, 3), COL.steel, 5);
  shape(c, () => rrect(c, x - 18, y2 - 34, 36, 34, 12), COL.pink, 5);
};
const holes = (c: Ctx, cx: number, cy: number, R: number) => { shape(c, () => ell(c, cx, cy - R + 3, 26, 9), "#5a3a1c", 4); shape(c, () => ell(c, cx, cy + R - 3, 26, 9), "#5a3a1c", 4); };
// the whole orange on its pencil
const skewered = (c: Ctx, cx: number, cy: number, R: number, dotsAt: number[], lit: boolean, tipY: number, endY: number) => {
  fruit(c, cx, cy, R, dotsAt, lit); holes(c, cx, cy, R);
  pencilUp(c, cx, tipY, cy - R + 12); pencilDown(c, cx, cy + R - 12, endY);
};

// the dark room: table, beam from the torch lying on a pile of books at the right, aimed at the orange at (360, 470)
const darkRoom = (c: Ctx) => {
  ground(c, "#1d2142");
  c.fillStyle = "#3b2e55"; c.fillRect(0, 950, D, 130); line(c, [[0, 950], [D, 950]], 6);
  shadow(c, 900, 955, 190, 16);
  c.beginPath(); polyP(c, [[806, 662], [806, 722], [360, 605], [360, 255]]); c.fillStyle = "rgba(255,236,140,0.3)"; c.fill();
  c.beginPath(); polyP(c, [[806, 676], [806, 708], [360, 540], [360, 320]]); c.fillStyle = "rgba(255,246,190,0.3)"; c.fill();
  const books: [number, number, number, string][] = [[770, 260, 895, "#d7372b"], [790, 240, 840, "#3f6fb3"], [770, 270, 785, "#46752a"], [785, 250, 730, "#8b6cc9"]];
  books.forEach(([x, w, y, col]) => {
    shape(c, () => rrect(c, x, y, w, 55, 6), col, 6);
    shape(c, () => rrect(c, x + 14, y + 9, w - 28, 37, 3), WHITE, 3);
    line(c, [[x + 24, y + 22], [x + w - 24, y + 22]], 2, COL.grey); line(c, [[x + 24, y + 34], [x + w - 24, y + 34]], 2, COL.grey);
  });
  shape(c, () => rrect(c, 850, 674, 150, 56, 14), COL.red, 6);
  shade(c, () => rrect(c, 850, 674, 150, 56, 14), "#a53320", 0, 14, 0.6);
  shape(c, () => rrect(c, 900, 662, 40, 14, 5), COL.steel, 4);
  shape(c, () => polyP(c, [[852, 676], [812, 654], [812, 728], [852, 728]]), COL.steelDk, 6);
  shape(c, () => ell(c, 810, 691, 11, 37), "#fff6c4", 5);
};

// card e1.0: one hand holds the orange, the other pushes the pencil down into it (arrow along the pencil)
const pencilIn = (c: Ctx, x: number, top: number, tip: number) => {
  shape(c, () => rrect(c, x - 18, top + 48, 36, tip - 80 - top - 48, 3), COL.yellow, 5);
  shade(c, () => rrect(c, x - 18, top + 48, 36, tip - 80 - top - 48, 3), "#e0a820", 11, 0, 0.7);
  shape(c, () => polyP(c, [[x - 18, tip - 80], [x, tip], [x + 18, tip - 80]]), "#f1d3a0", 5);
  shape(c, () => polyP(c, [[x - 6.5, tip - 26], [x, tip], [x + 6.5, tip - 26]]), INK, 3);
  shape(c, () => rrect(c, x - 18, top + 30, 36, 18, 3), COL.steel, 5);
  shape(c, () => rrect(c, x - 18, top, 36, 34, 12), COL.pink, 5);
};
const e1s0 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 820, 200, 22);
  fruit(c, 540, 560, 230, [-70, -40, -10], false); holes(c, 540, 560, 230);
  pencilIn(c, 540, 40, 380);
  armHand(c, 250, 800, -0.6, 1.8);
  armHand(c, 666, 200, 0, 1.8, true);
  arrow(c, [[400, 110], [400, 300]], RED, 16);
};
// card e1.1: the torch on the books shines at the orange, its right half bright
const e1s1 = (c: Ctx) => {
  darkRoom(c);
  skewered(c, 360, 430, 175, [-80, -50, -20], true, 70, 940);
  armHand(c, 360 - 126, 820, 0, 1.8);
};
// card e1.2: the hand turns the orange, arrow round the pencil towards the light, one dot just inside the light
const e1s2 = (c: Ctx) => {
  darkRoom(c);
  skewered(c, 360, 430, 175, [-48, -18, 12], true, 70, 940);
  armHand(c, 360 - 126, 820, 0, 1.8);
  const pts: number[][] = []; for (let i = 0; i <= 10; i++) { const t = (i / 10) * Math.PI; pts.push([360 - 130 * Math.cos(t), 652 + 30 * Math.sin(t)]); }
  arrow(c, pts, RED, 16);
};

// ------------------------------------------------------------------ e2: the shadow stick
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; line(c, [[x + Math.cos(a) * (r + 14), y + Math.sin(a) * (r + 14)], [x + Math.cos(a) * (r + 46), y + Math.sin(a) * (r + 46)]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
// the sunny terrace: sky, low wall, floor, a big sheet of paper with the stick in its pot; the shadow runs to (810, 800)
const stickScene = (c: Ctx) => {
  ground(c, "#e6d9bf");
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 330);
  shape(c, () => polyP(c, [[-10, 330], [D + 10, 330], [D + 10, 430], [-10, 430]]), "#d8c7a8", 6);
  line(c, [[-10, 350], [D + 10, 350]], 3, "#b9a687");
  sun(c, 160, 130, 64);
  shape(c, () => polyP(c, [[110, 640], [990, 620], [1040, 900], [60, 930]]), COL.paper, 6);
  c.beginPath(); polyP(c, [[292, 758], [816, 792], [806, 814], [308, 790]]); c.fillStyle = "rgba(43,35,64,0.5)"; c.fill();
  shadow(c, 335, 778, 115, 22);
  shape(c, () => rrect(c, 200, 598, 200, 44, 10), "#c8663a", 6);
  shape(c, () => polyP(c, [[215, 640], [385, 640], [360, 770], [240, 770]]), "#c8663a", 6);
  shade(c, () => polyP(c, [[215, 640], [385, 640], [360, 770], [240, 770]]), "#a24c26", 40, 0, 0.6);
  shape(c, () => ell(c, 300, 600, 94, 14), COL.soil, 5);
  shape(c, () => rrect(c, 288, 230, 24, 372, 6), COL.wood, 5);
  shade(c, () => rrect(c, 288, 230, 24, 372, 6), COL.woodDk, 9, 0, 0.7);
};
// a chalk cross
const cross = (c: Ctx, x: number, y: number, s: number) => {
  for (const col of [INK, COL.blue]) { const w = col === INK ? 20 : 11; line(c, [[x - s, y - s], [x + s, y + s]], w, col); line(c, [[x - s, y + s], [x + s, y - s]], w, col); }
};
// card e2.0: a stick standing straight up in a pot on the paper, in the sun
const e2s0 = (c: Ctx) => { stickScene(c); };
// card e2.1: a hand marks the tip of the long morning shadow with a chalk cross, 9:00 beside it
const e2s1 = (c: Ctx) => {
  stickScene(c);
  cross(c, 812, 802, 38);
  write(c, "9", 500, 680, 80, INK, 9); shape(c, () => ell(c, 575, 703, 6, 6), INK, 0); shape(c, () => ell(c, 575, 735, 6, 6), INK, 0); write(c, "00", 598, 680, 80, INK, 9);
  shape(c, () => rrect(c, 801, 470, 24, 330, 5), COL.blue, 5);
  shade(c, () => rrect(c, 801, 470, 24, 330, 5), "#3f6fb3", 8, 0, 0.7);
  armHand(c, 812 + 126, 620, 0, 1.8, true);
};
// card e2.2: the sheet at the end of the day, seen from above: a curved fan of crosses, shortest in the middle
const e2s2 = (c: Ctx) => {
  ground(c, "#e6d9bf");
  shape(c, () => rrect(c, 50, 130, 980, 870, 10), COL.paper, 6);
  const bx = 540, by = 840, xs = [-420, -315, -210, -105, 0, 105, 210, 315, 420], tip = (x: number): [number, number] => [bx + x, by - (255 + 0.0017 * x * x)];
  xs.forEach((x) => { const [tx, ty] = tip(x); line(c, [[bx, by], [tx, ty]], 15, x === 0 ? "rgba(43,35,64,0.6)" : "rgba(43,35,64,0.3)"); });
  xs.forEach((x) => { const [tx, ty] = tip(x); cross(c, tx, ty, 24); });
  const [mx, my] = tip(0); c.beginPath(); ell(c, mx, my, 50, 50); c.strokeStyle = RED; c.lineWidth = 9; c.stroke();
  shape(c, () => ell(c, bx, by, 62, 62), "#c8663a", 6); shape(c, () => ell(c, bx, by, 42, 42), COL.soil, 5);
  shape(c, () => ell(c, bx, by, 14, 14), COL.wood, 4);
};

// ------------------------------------------------------------------ e3: the pendulum on a stool
// the chairs, the stick across their backs, the stool with a chalk line, the nut on its string; swing = degrees from straight down
const SX = 540, PY = 190, SL = 376, STY = 640;
const mx = (x: number, left: boolean) => (left ? x : D - x);
const chairs = (c: Ctx) => {
  ground(c); c.fillStyle = "#e3d5b8"; c.fillRect(-100, 900, D + 200, 400); line(c, [[-100, 900], [D + 100, 900]], 4, "#b9a687");
  for (const left of [true, false]) {
    const R = (x1: number, y1: number, w: number, h: number, col: string, dk: string) => { const x = left ? x1 : D - x1 - w; shape(c, () => rrect(c, x, y1, w, h, 6), col, 6); shade(c, () => rrect(c, x, y1, w, h, 6), dk, 8, 0, 0.5); };
    shadow(c, mx(120, left), 905, 130, 16);
    R(100, 580, 36, 320, COL.teal, COL.tealDk);
    R(170, 240, 40, 660, COL.teal, COL.tealDk);
    R(90, 540, 120, 42, COL.teal, COL.tealDk);
    R(150, 190, 80, 56, COL.teal, COL.tealDk);
  }
  shape(c, () => rrect(c, 100, 166, 880, 24, 8), COL.wood, 6);
  shade(c, () => rrect(c, 100, 166, 880, 24, 8), COL.woodDk, 0, 9, 0.7);
  for (let i = 0; i < 5; i++) { const x = 122 + i * 9; line(c, [[x, 160], [x + 6, 196]], 9, INK); line(c, [[x, 160], [x + 6, 196]], 4, "#f4f1e4"); }
};
const stool = (c: Ctx, across: boolean) => {
  shadow(c, 560, 905, 200, 20);
  for (const [x1, x2] of [[430, 395], [650, 685]]) { line(c, [[x1, 720], [x2, 900]], 38, INK); line(c, [[x1, 720], [x2, 900]], 26, COL.brown); }
  line(c, [[540, 720], [540, 880]], 30, INK); line(c, [[540, 720], [540, 880]], 18, COL.woodDk);
  const side = () => { c.moveTo(365, STY); c.lineTo(365, STY + 44); c.ellipse(SX, STY + 44, 175, 66, 0, Math.PI, 0, true); c.lineTo(715, STY); c.closePath(); };
  shape(c, side, COL.woodDk, 6);
  shape(c, () => ell(c, SX, STY, 175, 66), COL.wood, 6);
  shade(c, () => ell(c, SX, STY, 175, 66), COL.woodDk, 24, 14, 0.5);
  const ch = across ? [[SX, STY - 52], [SX, STY + 52]] : [[385, STY], [695, STY]];
  line(c, ch, 18, INK); line(c, ch, 10, WHITE);
};
const hexNut = (c: Ctx, x: number, y: number, a: number, alpha = 1) => {
  c.globalAlpha = alpha;
  const hex = () => polyP(c, [0, 1, 2, 3, 4, 5].map((k) => [x + Math.cos(a + (k * Math.PI) / 3) * 42, y + Math.sin(a + (k * Math.PI) / 3) * 42]));
  shape(c, hex, COL.steel, 6); shade(c, hex, COL.steelDk, 8, 8, 0.7);
  shape(c, () => ell(c, x, y, 17, 17), COL.black, 4);
  c.globalAlpha = 1;
};
const pendulum = (c: Ctx, deg: number, alpha = 1) => {
  const t = (deg * Math.PI) / 180, x = SX + SL * Math.sin(t), y = PY + SL * Math.cos(t);
  c.globalAlpha = alpha; line(c, [[SX, PY], [x, y]], 9, INK); line(c, [[SX, PY], [x, y]], 4, "#f4f1e4"); c.globalAlpha = 1;
  hexNut(c, x, y, t, alpha);
  if (alpha === 1) line(c, [[x - Math.sin(t) * 30, y - Math.cos(t) * 30], [x, y]], 4, "#f4f1e4");
};
const swingMarks = (c: Ctx, deg: number) => {
  for (let a = -deg; a <= deg; a += 3.5) { const t = (a * Math.PI) / 180; shape(c, () => ell(c, SX + SL * Math.sin(t), PY + SL * Math.cos(t), 4.5, 4.5), INK, 0); }
  const pts: number[][] = []; for (let a = 17; a >= -17; a -= 3) { const t = (a * Math.PI) / 180; pts.push([SX + 250 * Math.sin(t), PY + 250 * Math.cos(t)]); }
  arrow(c, pts, RED, 12);
};
const zoomed = (c: Ctx, scene: () => void) => { c.save(); c.translate(540, 500); c.scale(1.15, 1.15); c.translate(-540, -500); scene(); c.restore(); };
const nutShadow = (c: Ctx, x: number) => shadow(c, x + 14, STY + 8, 40, 14);

// card e3.0: the nut hangs from the stick across two chairs, just clear of the stool; a chalk line across the stool
const e3s0 = (c: Ctx) => {
  zoomed(c, () => { chairs(c); stool(c, false); nutShadow(c, SX); pendulum(c, 0); });
};
// card e3.1: the nut swings to and fro along the chalk line
const e3s1 = (c: Ctx) => {
  zoomed(c, () => { chairs(c); stool(c, false); nutShadow(c, SX); pendulum(c, -22, 0.3); swingMarks(c, 22); pendulum(c, 22); });
};
// card e3.2: hands turn the stool a quarter turn; the nut keeps swinging the same way, the line now crossways
const e3s2 = (c: Ctx) => {
  zoomed(c, () => { chairs(c); stool(c, true); nutShadow(c, SX); pendulum(c, -22, 0.3); swingMarks(c, 22); pendulum(c, 22); });
  armHand(c, 190, 800, -0.5, 1.7, false, true);
  armHand(c, 890, 800, -0.5, 1.7, true, true);
  arrow(c, [[400, 880], [470, 912], [540, 920], [610, 912], [680, 880]], RED, 14);
};

export const su_dayNightSeasonsDayAndNight = cards("sci.day-night-seasons.day-and-night.L3 set-up", [e1s0, e1s1, e1s2, e2s0, e2s1, e2s2, e3s0, e3s1, e3s2]);
