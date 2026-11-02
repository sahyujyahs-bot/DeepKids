import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, write, glass, cards } from "./flatKit";

// sci.habitats.water-habitats.L3 cards. Same flat set-up look. Every animal faces right unless told.
const SKY = "#cfe8f7", POND = "#8fc3ea", POND_DK = "#5f9fd3", DEEP = "#3f78bd", DEEP_DK = "#2b5a96";
const FISH = "#f39a3c", FISH_DK = "#c9741f", FROG = "#6aa53f", FROG_DK = "#46752a", TAD = "#4a3f3a";
const ROCK = "#a9a39a", ROCK_DK = "#85807a", SAND = "#f1d28a", STONE = "#c2bcb0";

const bub = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.8)", Math.max(2, r * 0.2)); };
const wave = (c: Ctx, x0: number, x1: number, y: number, amp: number, col: string, w = 6, per = 28) => {
  const pts: number[][] = []; for (let x = x0; x <= x1; x += 12) pts.push([x, y + Math.sin((x - x0) / per) * amp]); line(c, pts, w, col);
};
const panel = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => shape(c, () => rrect(c, x, y, w, h, 28), col, 6);
const fish = (c: Ctx, x: number, y: number, L: number, dir = 1, rot = 0, col = FISH, dk = FISH_DK) => {
  const rx = L * 0.38, ry = L * 0.22;
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(dir, 1);
  shape(c, () => polyP(c, [[-rx * 0.7, 0], [-rx * 1.5, -ry * 1.0], [-rx * 1.3, 0], [-rx * 1.5, ry * 1.0]]), col, 5);
  shape(c, () => polyP(c, [[-rx * 0.3, -ry * 0.8], [rx * 0.0, -ry * 1.6], [rx * 0.45, -ry * 0.85]]), dk, 5);
  shape(c, () => ell(c, 0, 0, rx, ry), col);
  shade(c, () => ell(c, 0, 0, rx, ry), dk, rx * 0.12, ry * 0.4, 0.5);
  line(c, [[rx * 0.42, -ry * 0.7], [rx * 0.55, 0], [rx * 0.42, ry * 0.7]], 4);
  shape(c, () => ell(c, rx * 0.68, -ry * 0.22, ry * 0.2, ry * 0.2), WHITE, 3); shape(c, () => ell(c, rx * 0.72, -ry * 0.22, ry * 0.09, ry * 0.09), INK, 0);
  line(c, [[rx * 0.98, ry * 0.12], [rx * 0.82, ry * 0.15]], 3);
  c.restore();
};
const frog = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => ell(c, x - 52 * s, y + 12 * s, 40 * s, 22 * s, -0.3), FROG);
  shape(c, () => ell(c, x, y, 66 * s, 44 * s), FROG);
  shade(c, () => ell(c, x, y, 66 * s, 44 * s), FROG_DK, 18 * s, 18 * s, 0.5);
  shape(c, () => ell(c, x + 54 * s, y + 24 * s, 22 * s, 14 * s, 0.4), FROG);
  shape(c, () => ell(c, x + 28 * s, y - 40 * s, 17 * s, 17 * s), FROG); shape(c, () => ell(c, x + 64 * s, y - 36 * s, 17 * s, 17 * s), FROG);
  shape(c, () => ell(c, x + 28 * s, y - 42 * s, 9 * s, 9 * s), WHITE, 3); shape(c, () => ell(c, x + 64 * s, y - 38 * s, 9 * s, 9 * s), WHITE, 3);
  shape(c, () => ell(c, x + 30 * s, y - 42 * s, 4 * s, 4 * s), INK, 0); shape(c, () => ell(c, x + 66 * s, y - 38 * s, 4 * s, 4 * s), INK, 0);
  line(c, [[x + 30 * s, y - 6 * s], [x + 62 * s, y - 4 * s], [x + 76 * s, y - 14 * s]], 4);
};
const lotusLeaf = (c: Ctx, x: number, y: number, rx: number) => {
  shape(c, () => ell(c, x, y, rx, rx * 0.22), COL.leaf, 5);
  shade(c, () => ell(c, x, y, rx, rx * 0.22), COL.leafDk, rx * 0.15, rx * 0.06, 0.5);
  for (const k of [-0.6, -0.2, 0.2, 0.6]) line(c, [[x, y], [x + k * rx * 0.9, y + (1 - Math.abs(k)) * rx * 0.08]], 3, COL.leafDk);
};
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) => {
  shape(c, () => { c.moveTo(x, y - s * 1.5); c.bezierCurveTo(x + s * 0.2, y - s * 0.8, x + s, y - s * 0.3, x + s, y + s * 0.35); c.bezierCurveTo(x + s, y + s * 1.05, x - s, y + s * 1.05, x - s, y + s * 0.35); c.bezierCurveTo(x - s, y - s * 0.3, x - s * 0.2, y - s * 0.8, x, y - s * 1.5); c.closePath(); }, col, 5);
  shine(c, [[x - s * 0.5, y + s * 0.1], [x - s * 0.45, y + s * 0.6]], 5);
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.65, y + Math.sin(a) * r * 1.65]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow); shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.2, r * 0.2, 0.5);
};
const tadpole = (c: Ctx, x: number, y: number, s: number, gills = false) => {
  shape(c, () => { c.moveTo(x - 40 * s, y - 24 * s); c.quadraticCurveTo(x - 140 * s, y - 56 * s, x - 240 * s, y); c.quadraticCurveTo(x - 140 * s, y + 56 * s, x - 40 * s, y + 24 * s); c.closePath(); }, "#6b5a50", 5);
  shape(c, () => ell(c, x, y, 62 * s, 46 * s), TAD);
  shade(c, () => ell(c, x, y, 62 * s, 46 * s), "#2c2420", 14 * s, 14 * s, 0.5);
  shape(c, () => ell(c, x + 30 * s, y - 14 * s, 11 * s, 11 * s), WHITE, 3); shape(c, () => ell(c, x + 33 * s, y - 14 * s, 5 * s, 5 * s), INK, 0);
  if (gills) for (const k of [-1, 0, 1]) { const bx = x + 4 * s, by = y - 40 * s + k * 12 * s; line(c, [[bx, by], [bx - 26 * s, by - 40 * s + k * 8 * s]], 14, RED); line(c, [[bx - 14 * s, by - 24 * s + k * 4 * s], [bx + 4 * s, by - 42 * s]], 10, RED); line(c, [[bx - 14 * s, by - 24 * s + k * 4 * s], [bx - 34 * s, by - 18 * s]], 10, RED); }
};
const rock = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shape(c, () => ell(c, x, y, rx, ry), ROCK); shade(c, () => ell(c, x, y, rx, ry), ROCK_DK, rx * 0.2, ry * 0.3, 0.55);
};
const snail = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - 60 * s, y + 20 * s); c.quadraticCurveTo(x - 60 * s, y + 2 * s, x - 34 * s, y + 2 * s); c.lineTo(x + 46 * s, y + 2 * s); c.quadraticCurveTo(x + 66 * s, y - 16 * s, x + 70 * s, y - 34 * s); c.lineTo(x + 82 * s, y - 34 * s); c.quadraticCurveTo(x + 84 * s, y, x + 74 * s, y + 20 * s); c.closePath(); }, "#e0b98a", 5);
  line(c, [[x + 68 * s, y - 30 * s], [x + 64 * s, y - 50 * s]], 4); line(c, [[x + 80 * s, y - 30 * s], [x + 86 * s, y - 50 * s]], 4);
  shape(c, () => ell(c, x - 6 * s, y - 18 * s, 36 * s, 36 * s), COL.orange); shade(c, () => ell(c, x - 6 * s, y - 18 * s, 36 * s, 36 * s), "#b86a1a", 10 * s, 10 * s, 0.4);
  c.beginPath(); c.arc(x - 6 * s, y - 18 * s, 18 * s, 0, Math.PI * 1.6); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
const bucket = (c: Ctx, x: number, y: number, w: number, h: number) => { // clear-sided: returns nothing, outline only drawn by caller
  void c; void x; void y; void w; void h;
};
void bucket;

// ------------------------------------------------------------ flows
// e1: three glasses in a warm bath: cold (many bubbles), boiled-and-chilled (none), tap (a few)
const e1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 70, 520, 940, 340, 50), "#9fd0ee", 6);
  const gx = [230, 540, 850], cnt = [18, 0, 6], r = rnd(5), W = 230, H = 360, Y = 800;
  gx.forEach((x, i) => {
    glass(c, x, Y, W, H, 0.85);
    for (let k = 0; k < cnt[i]; k++) {
      const t = 0.1 + r() * 0.7, side = k % 2 ? 1 : -1, edge = W * 0.4 + (W / 2 - W * 0.4) * t - 16;
      bub(c, x + side * edge * (0.85 + r() * 0.15), Y - H * t, 8 + r() * 4);
    }
  });
  shape(c, () => rrect(c, 70, 680, 940, 180, 40), "rgba(143,195,234,0.62)", 6);
  wave(c, 120, 960, 700, 5, WHITE, 5, 30);
};
// e3: three dough shapes on a plate and a mug pouring water
const e3 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 880, 460, 60);
  shape(c, () => ell(c, 540, 830, 450, 80), COL.steel); shape(c, () => ell(c, 540, 826, 380, 60), COL.steelIn, 4);
  const DOUGH = "#e8c98f", DOUGH_DK = "#c9a15f";
  const tall = () => rrect(c, 240, 560, 110, 260, 30), ball = () => ell(c, 520, 730, 100, 100), dome = () => { c.moveTo(640, 810); c.bezierCurveTo(660, 700, 860, 700, 880, 810); c.closePath(); };
  [tall, ball, dome].forEach((p) => { shape(c, p, DOUGH); shade(c, p, DOUGH_DK, 20, 14, 0.5); });
  // the mug pours from the left, above the plate
  c.save(); c.translate(180, 300); c.rotate(0.55);
  shape(c, () => rrect(c, -90, -80, 180, 170, 24), COL.teal); shade(c, () => rrect(c, -90, -80, 180, 170, 24), COL.tealDk, 24, 0, 0.5);
  c.beginPath(); c.arc(100, 5, 42, -1.5, 1.5); c.strokeStyle = INK; c.lineWidth = 22; c.stroke(); c.strokeStyle = COL.teal; c.lineWidth = 10; c.stroke();
  shape(c, () => ell(c, 0, -80, 90, 22), COL.water, 5);
  c.restore();
  shape(c, () => { c.moveTo(262, 420); c.bezierCurveTo(300, 470, 300, 520, 300, 560); c.lineTo(345, 560); c.bezierCurveTo(345, 500, 320, 440, 290, 400); c.closePath(); }, COL.water, 5);
  arrow(c, [[420, 520], [600, 520], [900, 600]]);
};
// a3: salty water below, coloured fresh water poured gently on top
const a3 = (c: Ctx) => {
  ground(c);
  const x = 540, Y = 930, W = 420, H = 560, top = W / 2, bot = W * 0.4, e = (t: number) => bot + (top - bot) * t;
  shadow(c, x + 50, Y + 8, 260, 36);
  const lvl = (t: number) => [[x - e(t), Y - H * t], [x + e(t), Y - H * t]];
  shape(c, () => polyP(c, [lvl(0)[0], lvl(0.5)[0], lvl(0.5)[1], lvl(0)[1]]), POND_DK, 0);
  shape(c, () => polyP(c, [lvl(0.5)[0], lvl(0.8)[0], lvl(0.8)[1], lvl(0.5)[1]]), "#f0b840", 0);
  const r = rnd(9); for (let i = 0; i < 26; i++) shape(c, () => ell(c, x - 120 + r() * 240, Y - 20 - r() * 40, 7, 5), WHITE, 2);
  line(c, [[lvl(0.5)[0][0], lvl(0.5)[0][1]], [lvl(0.5)[1][0], lvl(0.5)[1][1]]], 6, INK);
  shape(c, () => polyP(c, [[x - top, Y - H], [x + top, Y - H], [x + bot, Y], [x - bot, Y]]), "rgba(214,236,250,0.22)", 6);
  shape(c, () => ell(c, x, Y - H, top, 30), "rgba(255,255,255,0.3)", 6);
  shine(c, [[x - top * 0.8, Y - H * 0.9], [x - bot * 0.85, Y - H * 0.2]], 9);
  // spoon pouring the yellow water, back of the spoon down
  c.save(); c.translate(800, 250); c.rotate(-0.5);
  line(c, [[-30, 0], [300, 0]], 24, INK); line(c, [[-30, 0], [300, 0]], 12, COL.steel);
  shape(c, () => ell(c, -70, 0, 80, 50), COL.steel, 6); shape(c, () => ell(c, -78, 0, 60, 34), "#f0b840", 3);
  c.restore();
  shape(c, () => { c.moveTo(655, 290); c.bezierCurveTo(630, 330, 620, 360, 626, 400); c.lineTo(650, 400); c.bezierCurveTo(650, 360, 656, 330, 672, 300); c.closePath(); }, "#f0b840", 5);
  arrow(c, [[500, 180], [500, 250]], RED, 10);
  // labels as pictures: a wave (sea) on the salty layer, a river line on top
  wave(c, 440, 640, 760, 10, WHITE, 6, 26);
  wave(c, 440, 640, 500, 10, "#b97b10", 6, 26);
};
// p1: two jars, one in a sunny window turning green, one in a dark cupboard staying clear
const jar = (c: Ctx, x: number, y: number, w: number, h: number, water: string) => {
  shadow(c, x + 20, y + 8, w * 0.6, 18);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 36), water, 0);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 36), "rgba(214,236,250,0.18)", 6);
  shine(c, [[x - w * 0.36, y - h * 0.8], [x - w * 0.36, y - h * 0.3]], 9);
  // cloth tied with a rubber band
  shape(c, () => polyP(c, [[x - w / 2 - 14, y - h - 36], [x + w / 2 + 14, y - h - 36], [x + w / 2 - 6, y - h + 30], [x - w / 2 + 6, y - h + 30]]), COL.cloth, 5);
  line(c, [[x - w / 2 + 2, y - h + 14], [x + w / 2 - 2, y - h + 14]], 8, COL.red);
};
const p1 = (c: Ctx) => {
  ground(c);
  panel(c, 40, 120, 490, 840, SKY); panel(c, 550, 120, 490, 840, "#3a3350");
  // window frame and sun
  shape(c, () => rrect(c, 70, 150, 430, 280, 10), "#e9f6ff", 6); line(c, [[285, 150], [285, 430]], 8); line(c, [[70, 290], [500, 290]], 8);
  sun(c, 160, 232, 44);
  shape(c, () => rrect(c, 620, 150, 350, 280, 10), "#2a2540", 6); line(c, [[795, 150], [795, 430]], 6, "#5a5278");
  shape(c, () => rrect(c, 590, 500, 410, 20, 6), "#6b5a8c", 5); shape(c, () => rrect(c, 60, 700, 430, 20, 6), "#c9a15f", 5);
  jar(c, 285, 700, 250, 330, "#5fae4a");
  const r = rnd(4); for (let i = 0; i < 16; i++) shape(c, () => ell(c, 205 + r() * 160, 420 + r() * 250, 9, 6), COL.greenLt, 2);
  for (let i = 0; i < 4; i++) wave(c, 180 + i * 40, 230 + i * 40, 590 + i * 30, 12, COL.greenDk, 5, 12);
  jar(c, 795, 700, 250, 330, POND);
  for (let i = 0; i < 4; i++) shape(c, () => ell(c, 740 + r() * 110, 540 + r() * 150, 3, 3), WHITE, 0);
};
// c1: water poured from a height into a bucket: splash, rings and bubbles
const c1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 960, 340, 40);
  shape(c, () => polyP(c, [[250, 640], [830, 640], [770, 940], [310, 940]]), COL.red); shade(c, () => polyP(c, [[250, 640], [830, 640], [770, 940], [310, 940]]), "#b13a27", 90, 0, 0.5);
  shape(c, () => ell(c, 540, 640, 290, 70), POND_DK, 6);
  shape(c, () => ell(c, 540, 645, 250, 52), POND, 0);
  for (const k of [0.9, 0.6, 0.3]) { c.beginPath(); ell(c, 530, 650, 240 * k, 50 * k); c.strokeStyle = WHITE; c.lineWidth = 5; c.stroke(); }
  const r = rnd(3); for (let i = 0; i < 14; i++) bub(c, 380 + r() * 300, 630 + r() * 36, 6 + r() * 5);
  // mug high up, pouring
  c.save(); c.translate(660, 190); c.rotate(-0.5);
  shape(c, () => rrect(c, -90, -80, 180, 170, 24), COL.teal); shade(c, () => rrect(c, -90, -80, 180, 170, 24), COL.tealDk, -24, 0, 0.5);
  c.beginPath(); c.arc(-100, 5, 42, 1.64, 4.64); c.strokeStyle = INK; c.lineWidth = 22; c.stroke(); c.strokeStyle = COL.teal; c.lineWidth = 10; c.stroke();
  c.restore();
  shape(c, () => { c.moveTo(560, 270); c.bezierCurveTo(540, 330, 530, 390, 526, 640); c.lineTo(556, 640); c.bezierCurveTo(560, 400, 575, 330, 600, 290); c.closePath(); }, POND, 5);
  for (const [dx, dy] of [[-70, -40], [-110, -10], [70, -50], [120, -20], [30, -90], [-30, -80]]) drop(c, 540 + dx, 590 + dy, 14);
  arrow(c, [[430, 300], [430, 470]]);
};
// c2: the rising pond, before and after: the leaf stays on top, the thread goes taut
const tankClear = (c: Ctx, x: number, w: number, level: number) => {
  const Y = 880, H = 600;
  shape(c, () => rrect(c, x, Y - level, w, level, 8), POND, 0);
  wave(c, x + 6, x + w - 6, Y - level, 4, WHITE, 5, 22);
  shape(c, () => polyP(c, [[x - 16, Y - H], [x, Y - H], [x, Y], [x + w, Y], [x + w, Y - H], [x + w + 16, Y - H], [x + w + 16, Y + 16], [x - 16, Y + 16]]), STONE, 6);
  return Y - level;
};
const c2 = (c: Ctx) => {
  ground(c);
  const wide = 300;
  for (const [x, lv, loose] of [[110, 100, true], [640, 300, false]] as [number, number, boolean][]) {
    const top = tankClear(c, x, wide, lv), cx = x + wide / 2, Y = 880;
    // stone on the bottom and a thread up to the leaf
    if (loose) { const pts: number[][] = []; for (let t = 0; t <= 1; t += 0.05) pts.push([cx + Math.sin(t * 14) * 18 * (1 - t * 0.2), Y - 30 - t * (Y - 30 - top - 6)]); line(c, pts, 5, INK); }
    else line(c, [[cx, Y - 30], [cx, top + 6]], 5, INK);
    shape(c, () => ell(c, cx, Y - 20, 46, 28), ROCK); shade(c, () => ell(c, cx, Y - 20, 46, 28), ROCK_DK, 10, 8, 0.55);
    shape(c, () => ell(c, cx, top, 90, 16), COL.leaf, 5);
    write(c, loose ? "5 cm" : "15 cm", cx - (loose ? 70 : 100), 930, 56, INK, 8);
  }
  arrow(c, [[480, 600], [600, 600]], RED, 12);
  for (const x of [470, 520]) arrow(c, [[x, 500], [x, 440]], RED, 8);
};

// ------------------------------------------------------------ terms
// 0 habitat: a temple tank
const t0 = (c: Ctx) => {
  ground(c, SKY);
  shape(c, () => rrect(c, 60, 330, 960, 40, 8), STONE, 6);
  shape(c, () => rrect(c, 60, 370, 960, 600, 40), POND, 6);
  // steps on the left
  for (let k = 0; k < 4; k++) shape(c, () => rrect(c, 60, 370 + k * 70, 170 - k * 40, 70, 4), STONE, 5);
  wave(c, 240, 1000, 380, 4, WHITE, 5);
  // lotus leaves, a frog, fish
  lotusLeaf(c, 520, 372, 120); lotusLeaf(c, 800, 380, 100);
  frog(c, 520, 322, 0.85);
  shape(c, () => ell(c, 900, 330, 20, 14), COL.pink, 4);
  fish(c, 460, 640, 200, 1); fish(c, 780, 780, 170, -1, 0, "#e4523b", "#a83a28");
  for (const [x, y] of [[620, 600], [640, 560], [330, 760], [340, 720], [900, 640]]) bub(c, x, y, 9);
  line(c, [[300, 960], [300, 880]], 6, COL.greenDk); line(c, [[330, 960], [335, 860]], 6, COL.greenDk);
};
// 2 fresh water: a river past paddy fields
const t2 = (c: Ctx) => {
  ground(c, "#9ccf62");
  for (let i = 0; i < 7; i++) {
    const y = 40 + i * 150;
    if (Math.abs(y + 60 - 540) < 200) continue;
    for (let x = 60; x < 1040; x += 52) { line(c, [[x, y + 80], [x - 10, y + 40]], 5, COL.greenDk); line(c, [[x, y + 80], [x + 10, y + 40]], 5, COL.greenDk); line(c, [[x, y + 80], [x, y + 30]], 5, COL.greenDk); }
  }
  const river = () => { c.beginPath(); c.moveTo(-20, 440); c.bezierCurveTo(300, 280, 500, 760, 1100, 620); };
  river(); c.lineWidth = 210; c.strokeStyle = INK; c.lineCap = "round"; c.stroke();
  river(); c.lineWidth = 196; c.strokeStyle = POND; c.stroke();
  wave(c, 140, 360, 440, 8, WHITE, 6); wave(c, 640, 880, 640, 8, WHITE, 6);
  drop(c, 540, 520, 70);
  arrow(c, [[160, 540], [300, 520]]);
};
// 3 salt water: a wave, and 35 g of salt in a litre
const t3 = (c: Ctx) => {
  ground(c, SKY);
  shape(c, () => rrect(c, 40, 60, 1000, 440, 36), DEEP, 6);
  shape(c, () => { c.moveTo(40, 440); c.quadraticCurveTo(300, 340, 540, 440); c.quadraticCurveTo(760, 530, 1040, 420); c.lineTo(1040, 500); c.lineTo(40, 500); c.closePath(); }, SAND, 6);
  for (let i = 0; i < 4; i++) wave(c, 80 + i * 20, 460 + i * 20, 160 + i * 70, 16, WHITE, 8, 34);
  wave(c, 560, 960, 200, 16, DEEP_DK, 8, 34); wave(c, 540, 940, 330, 16, WHITE, 8, 34);
  // a bottle of 1 litre and a heap of salt
  shadow(c, 310, 960, 120, 20);
  shape(c, () => rrect(c, 230, 720, 160, 240, 30), POND, 6); shape(c, () => rrect(c, 280, 650, 60, 80, 14), POND, 6); shape(c, () => rrect(c, 272, 620, 76, 36, 8), COL.red, 5);
  shine(c, [[250, 760], [250, 920]], 8); write(c, "1 l", 266, 790, 70, INK, 8);
  write(c, "+", 460, 780, 90, INK, 10);
  shadow(c, 720, 960, 190, 24);
  shape(c, () => ell(c, 720, 930, 190, 36), COL.steel);
  shape(c, () => { c.moveTo(580, 920); c.quadraticCurveTo(720, 700, 860, 920); c.closePath(); }, WHITE, 6);
  shade(c, () => { c.moveTo(580, 920); c.quadraticCurveTo(720, 700, 860, 920); c.closePath(); }, "#d8d3c8", 40, 10, 0.6);
  write(c, "35 g", 620, 620, 80, INK, 9);
};
// 4 brackish: a river meets the sea and the colours mix
const t4 = (c: Ctx) => {
  ground(c, "#9ccf62");
  for (let i = 0; i < 5; i++) { const x = 70 + i * 90; line(c, [[x, 150], [x - 8, 100]], 5, COL.greenDk); line(c, [[x, 150], [x + 8, 100]], 5, COL.greenDk); line(c, [[x, 960], [x - 8, 910]], 5, COL.greenDk); line(c, [[x, 960], [x + 8, 910]], 5, COL.greenDk); }
  shape(c, () => { c.moveTo(1100, -20); c.lineTo(740, -20); c.bezierCurveTo(700, 200, 620, 360, 560, 400); c.lineTo(560, 640); c.bezierCurveTo(640, 700, 720, 860, 760, 1100); c.lineTo(1100, 1100); c.closePath(); }, DEEP, 6);
  shape(c, () => rrect(c, -20, 410, 720, 230, 10), POND, 0); line(c, [[-20, 410], [570, 410]], 6); line(c, [[-20, 640], [570, 640]], 6);
  const g = c.createLinearGradient(380, 0, 760, 0); g.addColorStop(0, "rgba(63,120,189,0)"); g.addColorStop(0.5, "rgba(95,159,211,0.8)"); g.addColorStop(1, "rgba(63,120,189,0)");
  c.fillStyle = g; c.fillRect(420, 416, 340, 218);
  for (let i = 0; i < 3; i++) wave(c, 40 + i * 60, 220 + i * 60, 470 + i * 70, 8, WHITE, 6);
  for (let i = 0; i < 4; i++) wave(c, 800, 1000, 140 + i * 230, 14, WHITE, 6, 30);
  arrow(c, [[120, 525], [440, 525]]);
};
// 5 dissolve: sugar in tea, then gone
const t5 = (c: Ctx) => {
  ground(c);
  const TEA = "#d9a066";
  const g = (x: number, withSugar: boolean) => {
    glass(c, x, 800, 300, 420, 0.85, TEA);
    if (withSugar) { const r = rnd(8); for (let i = 0; i < 40; i++) shape(c, () => ell(c, x - 90 + r() * 180, 770 - r() * 30 - (i % 3) * 8, 9, 7), WHITE, 3); }
    else { wave(c, x - 80, x + 80, 560, 8, "#b97b3a", 6, 24); wave(c, x - 70, x + 70, 640, 8, "#b97b3a", 6, 24); }
  };
  g(250, true); g(830, false);
  // spoon in the first glass
  line(c, [[300, 320], [255, 740]], 22, INK); line(c, [[300, 320], [255, 740]], 11, COL.steel); shape(c, () => ell(c, 252, 760, 36, 24), COL.steel, 5);
  arrow(c, [[420, 560], [650, 560]], RED, 14);
};
// 6 dissolved oxygen: tiny bits of air spread between the water
const t6 = (c: Ctx) => {
  ground(c);
  glass(c, 200, 960, 230, 320, 0.85);
  line(c, [[300, 700], [520, 330]], 6, INK); line(c, [[300, 880], [740, 840]], 6, INK);
  const R = 330, cx = 700, cy = 520;
  shape(c, () => ell(c, cx, cy, R + 20, R + 20), "#8a6a3a", 6);
  c.save(); c.beginPath(); ell(c, cx, cy, R, R); c.clip(); c.fillStyle = POND; c.fillRect(cx - R, cy - R, R * 2, R * 2);
  const r = rnd(2);
  for (let i = 0; i < 26; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * (R - 50), x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d; shape(c, () => ell(c, x, y, 38, 38), "#b9dcf5", 3); }
  for (let i = 0; i < 9; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * (R - 60), x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d; shape(c, () => ell(c, x, y, 16, 16), RED, 3); }
  c.restore();
  shape(c, () => ell(c, cx, cy, R, R), "rgba(255,255,255,0.05)", 8);
  shine(c, [[cx - R * 0.7, cy - R * 0.3], [cx - R * 0.4, cy - R * 0.7]], 14);
};
// 10 tadpole
const t10 = (c: Ctx) => {
  ground(c, POND);
  wave(c, 40, 1040, 120, 10, WHITE, 6, 40);
  line(c, [[120, 1040], [110, 900]], 8, COL.greenDk); line(c, [[160, 1040], [175, 880]], 8, COL.greenDk);
  tadpole(c, 700, 540, 2.3, true);
  for (const [x, y] of [[880, 360], [920, 300], [240, 360]]) bub(c, x, y, 14);
};
// 12 air canals: a slice of lotus stem with a ring of holes
const t12 = (c: Ctx) => {
  ground(c);
  shadow(c, 570, 940, 400, 50);
  shape(c, () => ell(c, 540, 540, 390, 390), COL.leaf, 6);
  shape(c, () => ell(c, 540, 540, 360, 360), "#f3ecd0", 4);
  const r = rnd(6);
  for (let k = 0; k < 8; k++) { const a = (k / 8) * 6.283 + 0.2; shape(c, () => ell(c, 540 + Math.cos(a) * 240, 540 + Math.sin(a) * 240, 62, 62), "#bfae7d", 5); shade(c, () => ell(c, 540 + Math.cos(a) * 240, 540 + Math.sin(a) * 240, 62, 62), "#8a7a4a", 10, 12, 0.6); }
  for (let k = 0; k < 6; k++) { const a = (k / 6) * 6.283; shape(c, () => ell(c, 540 + Math.cos(a) * 100, 540 + Math.sin(a) * 100, 28, 28), "#bfae7d", 4); }
  shape(c, () => ell(c, 540, 540, 22, 22), "#bfae7d", 4);
  void r;
  shine(c, [[220, 400], [260, 320]], 12);
};
// 13 algal bloom: a lake with a thick green layer, a pipe pouring dirty water in
const t13 = (c: Ctx) => {
  ground(c, SKY);
  shape(c, () => rrect(c, 40, 460, 1000, 520, 36), "#4f7f8a", 6);
  shape(c, () => rrect(c, 40, 460, 1000, 120, 36), "#7fbf3d", 6);
  const r = rnd(12); for (let i = 0; i < 40; i++) shape(c, () => ell(c, 80 + r() * 920, 470 + r() * 100, 22 + r() * 18, 14), r() > 0.5 ? COL.green : "#a7d84a", 3);
  // the bank and the pipe
  shape(c, () => polyP(c, [[0, 300], [260, 300], [260, 460], [0, 460]]), COL.soil, 6);
  shape(c, () => rrect(c, 120, 330, 330, 80, 14), COL.steel, 6); shape(c, () => rrect(c, 420, 320, 40, 100, 8), COL.steelDk, 6);
  shape(c, () => { c.moveTo(450, 365); c.quadraticCurveTo(560, 380, 580, 470); c.lineTo(520, 470); c.quadraticCurveTo(500, 400, 450, 390); c.closePath(); }, "#8a5a2c", 5);
  shape(c, () => ell(c, 560, 540, 120, 38), "#8a5a2c", 4);
  arrow(c, [[500, 270], [640, 300]]);
  for (const x of [200, 800, 920]) wave(c, x - 50, x + 50, 720 + (x % 3) * 40, 8, "#3a6670", 6);
};

// ------------------------------------------------------------ explanations
// 1 water holds dissolved air: cold, warm, boiled
const x1 = (c: Ctx) => {
  ground(c);
  const xs = [190, 540, 890], Y = 840, W = 290, H = 440;
  xs.forEach((x, i) => {
    glass(c, x, Y, W, H, 0.85);
    const r = rnd(20 + i), n = [16, 7, 1][i];
    for (let k = 0; k < n; k++) shape(c, () => ell(c, x - 90 + r() * 180, Y - 40 - r() * 300, 8, 8), "rgba(255,255,255,0.85)", 3);
    // temperature under each glass: cool blue, warm red, red with steam
  });
  // cold: ice cubes; warm: steam and bubbles leaving
  for (const [dx, dy] of [[-40, -380], [30, -370]]) { shape(c, () => rrect(c, xs[0] + dx - 34, Y + dy - 34, 68, 68, 12), "rgba(220,240,255,0.9)", 5); }
  for (const dx of [-50, 0, 50]) wave(c, xs[1] + dx, xs[1] + dx + 1, 360, 0, WHITE, 0);
  for (const [dx, dy] of [[-50, 0], [10, -40], [60, 10]]) { bub(c, xs[1] + dx, 390 + dy, 18); arrow(c, [[xs[1] + dx, 345 + dy], [xs[1] + dx, 285 + dy]], RED, 8); }
};
// 3 a pond at night and at noon
const x3 = (c: Ctx) => {
  ground(c);
  const pond = (y: number, night: boolean) => {
    panel(c, 40, y, 1000, 480, night ? "#2b2a5a" : SKY);
    shape(c, () => rrect(c, 40, y + 190, 1000, 290, 28), night ? "#2f4a7c" : POND, 6);
    c.save(); c.beginPath(); c.rect(40, y, 1000, 480); c.clip();
    line(c, [[40, y + 190], [1040, y + 190]], 6);
    c.restore();
    if (night) {
      shape(c, () => ell(c, 880, y + 80, 44, 44), "#fff3b0", 4); shape(c, () => ell(c, 900, y + 70, 36, 36), "#2b2a5a", 0);
      for (const [sx, sy] of [[150, 50], [300, 100], [520, 60], [700, 110], [420, 130]]) { line(c, [[sx - 10, y + sy], [sx + 10, y + sy]], 5, "#fff3b0"); line(c, [[sx, y + sy - 10], [sx, y + sy + 10]], 5, "#fff3b0"); }
      // fish rising to the surface with open mouths
      fish(c, 300, y + 280, 170, 1, -0.5); fish(c, 560, y + 250, 170, 1, -0.5); fish(c, 800, y + 300, 170, 1, -0.4);
      for (const x of [380, 640]) bub(c, x, y + 205, 8);
    } else {
      sun(c, 880, y + 80, 44);
      // algae threads with many bubbles
      for (const x of [200, 340, 520, 700, 860]) { line(c, [[x, y + 480], [x + 12, y + 380], [x - 6, y + 290]], 10, COL.greenDk); for (let k = 0; k < 4; k++) bub(c, x - 20 + (k % 2) * 40, y + 240 - k * 15, 9); }
      fish(c, 620, y + 400, 150, -1, 0);
      for (const x of [200, 520, 860]) arrow(c, [[x, y + 270], [x, y + 215]], RED, 8);
    }
  };
  pond(30, true); pond(560, false);
};
// 7 sea fish and river fish
const x7 = (c: Ctx) => {
  ground(c);
  panel(c, 30, 140, 500, 800, DEEP); panel(c, 550, 140, 500, 800, POND);
  fish(c, 280, 540, 330, 1, 0, "#e4523b", "#a83a28");
  // sea fish: drinks sea water at the mouth, salt leaves at the gills
  arrow(c, [[540, 545], [430, 545]], RED, 10); for (const [x, y] of [[570, 490], [590, 590]]) drop(c, x, y, 12);
  const salt = (x: number, y: number) => shape(c, () => rrect(c, x - 11, y - 11, 22, 22, 4), WHITE, 3);
  salt(320, 790); salt(370, 810); salt(280, 820); arrow(c, [[340, 620], [335, 710]], RED, 10);
  // river fish: water soaks in through the skin
  fish(c, 800, 540, 330, 1);
  for (const [x, y] of [[740, 390], [840, 380], [740, 700], [850, 700]]) { drop(c, x, y - (y > 540 ? -30 : 30), 12); }
  arrow(c, [[740, 420], [750, 470]], RED, 10); arrow(c, [[850, 410], [850, 470]], RED, 10); arrow(c, [[745, 690], [750, 620]], RED, 10); arrow(c, [[855, 690], [855, 625]], RED, 10);
};
// 8 holding on in flowing water
const x8 = (c: Ctx) => {
  ground(c);
  panel(c, 30, 100, 1020, 880, POND);
  for (let i = 0; i < 4; i++) wave(c, 60, 1020, 200 + i * 60, 10, WHITE, 6, 36);
  for (const y of [190, 330]) arrow(c, [[160, y + 40], [860, y + 40]], RED, 10);
  // the stream bed
  shape(c, () => rrect(c, 30, 930, 1020, 50, 8), COL.soil, 0);
  rock(c, 200, 900, 150, 60); rock(c, 560, 910, 190, 55); rock(c, 880, 900, 150, 65);
  snail(c, 190, 835, 1.1);
  c.save(); c.translate(560, 858); c.scale(1, 0.4); fish(c, 0, 0, 300, 1, 0, "#8a7a60", "#5f523d"); c.restore();
  // a streamlined fish facing into the current
  fish(c, 780, 600, 260, -1, 0, "#7d9fb8", "#58788f");
  arrow(c, [[480, 600], [600, 600]], RED, 10);
};

export const ic_habitatsWaterHabitatsL3 = cards("sci.habitats.water-habitats.L3 cards", [
  e1, e3, a3, p1, c1, c2, t0, t2, t3, t4, t5, t6, t10, t12, t13, x1, x3, x7, x8,
]);
void D;
