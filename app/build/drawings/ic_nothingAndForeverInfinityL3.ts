import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, plate, hand, write, cards } from "./flatKit";

// sci.nothing-and-forever.infinity.L3 · picture cards (activities, experiment, project, challenge, terms, explanations).
// Same child and grown-up as the set-up cards.

const NONE = "rgba(0,0,0,0)";
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 14, y + h + 10, w * 0.52, 22);
  shape(c, () => rrect(c, x, y, w, h, 10), COL.paper);
  shade(c, () => rrect(c, x, y, w, h, 10), COL.cloth, 16, 0, 0.9);
  shape(c, () => rrect(c, x, y, w, h, 10), NONE);
};
// the infinity sign (a sideways 8) centred at (cx, cy), half-width a
const lemn = (c: Ctx, cx: number, cy: number, a: number, w: number, col: string = INK) => {
  const pts: number[][] = [];
  for (let i = 0; i <= 80; i++) { const t = (i / 80) * Math.PI * 2, d = 1 + Math.sin(t) ** 2; pts.push([cx + (a * Math.cos(t)) / d, cy + (a * 1.35 * Math.sin(t) * Math.cos(t)) / d]); }
  line(c, pts, w, col);
};
const qmark = (c: Ctx, x: number, y: number, h: number, col: string = INK, w = 8) => {
  c.beginPath(); c.arc(x, y + h * 0.25, h * 0.25, Math.PI * 1.1, Math.PI * 2.4); c.quadraticCurveTo(x + h * 0.28, y + h * 0.58, x, y + h * 0.68); c.lineTo(x, y + h * 0.78);
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.arc(x, y + h * 0.97, w * 0.7, 0, Math.PI * 2); c.fillStyle = col; c.fill();
};
// a number line from x0 to x1 at y with ticks; arrow head at the right end
const numLine = (c: Ctx, x0: number, x1: number, y: number, n: number, labels = true, hh = 42) => {
  line(c, [[x0, y], [x1, y]], 10);
  line(c, [[x1 - 34, y - 28], [x1, y], [x1 - 34, y + 28]], 10);
  for (let i = 0; i <= n; i++) {
    const x = x0 + 30 + (i * (x1 - x0 - 90)) / n;
    line(c, [[x, y - 16], [x, y + 16]], 6);
    if (labels) write(c, String(i), x - (i > 9 ? 28 : 12), y + 34, hh, INK, 5);
  }
};
const grain = (c: Ctx, x: number, y: number, rot: number, r = 14) => {
  shape(c, () => ell(c, x, y, r, r * 0.42, rot), WHITE, 3);
  c.save(); c.beginPath(); ell(c, x, y, r, r * 0.42, rot); c.clip(); c.beginPath(); ell(c, x + r * 0.3, y + r * 0.35, r, r * 0.4, rot); c.fillStyle = COL.grey; c.globalAlpha = 0.45; c.fill(); c.restore(); c.globalAlpha = 1;
};
const bubble = (c: Ctx, x: number, y: number, w: number, h: number, tx: number, ty: number) => {
  shape(c, () => rrect(c, x, y, w, h, 40), WHITE, 6);
  shape(c, () => polyP(c, [[x + w * 0.4, y + h - 4], [tx, ty], [x + w * 0.6, y + h - 4]]), WHITE, 6);
  shape(c, () => rrect(c, x + 8, y + h - 10, w - 16, 16, 4), WHITE, 0);
  shape(c, () => polyP(c, [[x + w * 0.41, y + h + 2], [tx, ty], [x + w * 0.59, y + h + 2]]), WHITE, 0);
};
const stopwatch = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + 10, y + r + 10, r * 0.9, r * 0.14);
  shape(c, () => rrect(c, x - 22, y - r - 36, 44, 36, 8), COL.steelDk);
  shape(c, () => ell(c, x, y, r, r), COL.steel);
  shade(c, () => ell(c, x, y, r, r), COL.steelDk, r * 0.12, r * 0.1);
  shape(c, () => ell(c, x, y, r * 0.82, r * 0.82), WHITE, 5);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7], [x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8]], 5); }
  line(c, [[x, y], [x + r * 0.45, y - r * 0.4]], 9, RED); line(c, [[x, y], [x, y - r * 0.5]], 7);
  shape(c, () => ell(c, x, y, 11, 11), INK, 0);
};
const idli = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r, y - r * 0.9, x + r, y - r * 0.9, x + r, y); c.quadraticCurveTo(x, y + r * 0.35, x - r, y); c.closePath(); }, "#fbf7ec");
  shade(c, () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r, y - r * 0.9, x + r, y - r * 0.9, x + r, y); c.quadraticCurveTo(x, y + r * 0.35, x - r, y); c.closePath(); }, "#e6dcc4", r * 0.35, r * 0.1);
  shine(c, [[x - r * 0.55, y - r * 0.2], [x - r * 0.3, y - r * 0.45]], 7);
};
const star = (c: Ctx, x: number, y: number, r: number, col: string = COL.yellow) => shape(c, () => { const p: number[][] = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; p.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } polyP(c, p); }, col, Math.max(2, r * 0.14));

// 0 flow.e1: two lists of numbers, a stopwatch
const e1 = (c: Ctx) => {
  ground(c);
  paper(c, 70, 240, 270, 520); paper(c, 740, 240, 270, 520);
  for (let i = 0; i < 5; i++) write(c, String(i + 1), 120, 280 + i * 92, 60, INK, 7);
  const big = ["841", "2907", "6150", "3478", "9026"];
  big.forEach((t, i) => write(c, t, 765, 280 + i * 92, 60 * 0.9, INK, 6));
  stopwatch(c, 540, 500, 150);
  arrow(c, [[300, 840], [540, 880]], RED, 10); arrow(c, [[780, 840], [540, 880]], RED, 10);
};
// 1 flow.a1: say a number, the other says one more
const a1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 1000, 440, 26);
  person(c, 250, 980, 560, {});
  person(c, 830, 980, 600, { adult: true });
  bubble(c, 90, 90, 300, 150, 260, 350); write(c, "50", 160, 120, 90, INK, 9);
  bubble(c, 620, 80, 390, 150, 800, 320); write(c, "51", 680, 110, 90, INK, 9); write(c, "+ 1", 820, 130, 70, RED, 9);
  arrow(c, [[400, 160], [600, 160]], RED, 10);
};
// 2 flow.a2: a ladder of number names, always one more step
const a2 = (c: Ctx) => {
  ground(c);
  const x0 = 250, x1 = 830;
  line(c, [[x0, 140], [x0, 990]], 22); line(c, [[x1, 140], [x1, 990]], 22);
  line(c, [[x0, 140], [x0, 990]], 10, COL.wood); line(c, [[x1, 140], [x1, 990]], 10, COL.wood);
  const nums = ["1", "10", "100", "1000", "10000"];
  nums.forEach((t, i) => {
    const y = 900 - i * 150;
    shape(c, () => rrect(c, x0, y - 40, x1 - x0, 80, 12), COL.woodDk, 6);
    write(c, t, 540 - t.length * 24, y - 28, 56, INK, 7);
  });
  arrow(c, [[540, 180], [540, 70]], RED, 12);
  shadow(c, 540, 1010, 360, 20);
};
// 3 flow.a3: numbered papers along the floor, walk to the wall
const a3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 0, 0, D, 560, 0), "#f3dfc0", 0);
  shape(c, () => rrect(c, 870, 120, 210, 440, 0), COL.sky, 0);
  line(c, [[0, 560], [D, 560]], 8); line(c, [[870, 0], [870, 560]], 8);
  c.fillStyle = COL.wood; c.fillRect(0, 560, D, 520);
  for (let i = 0; i < 5; i++) {
    const x = 320 + i * 120;
    shape(c, () => polyP(c, [[x + 14, 820], [x + 124, 820], [x + 108, 920], [x - 10, 920]]), COL.paper, 5);
    write(c, String(i + 1), x + 36, 836, 56, INK, 6);
  }
  person(c, 160, 960, 520, {});
  arrow(c, [[300, 740], [860, 740]], RED, 12);
};
// 4 flow.a4: the infinity sign on paper and as a kolam of dots
const a4 = (c: Ctx) => {
  ground(c);
  paper(c, 50, 220, 450, 560);
  lemn(c, 275, 500, 160, 22, INK);
  arrow(c, [[200, 420], [260, 455]], RED, 10);
  shape(c, () => rrect(c, 570, 220, 460, 560, 14), "#3a3a66", 6);
  const dots = [[800, 380], [800, 620], [700, 500], [900, 500]];
  lemn(c, 800, 500, 150, 16, WHITE);
  dots.forEach(([x, y]) => shape(c, () => ell(c, x, y, 17, 17), COL.yellow, 4));
};
// 5 flow.a5: very many (finite) things vs never-ending
const a5 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 140, 490, 800, 26), COL.cloth, 6);
  shape(c, () => rrect(c, 550, 140, 490, 800, 26), COL.sky, 6);
  // a jar of rice
  shape(c, () => rrect(c, 130, 300, 300, 440, 40), COL.glass, 6);
  shape(c, () => rrect(c, 130, 420, 300, 320, 40), "#fffdf5", 0);
  const r = rnd(5); for (let i = 0; i < 55; i++) grain(c, 160 + r() * 240, 450 + r() * 270, r() * 3);
  shape(c, () => rrect(c, 130, 300, 300, 440, 40), NONE, 6);
  shape(c, () => rrect(c, 150, 250, 260, 56, 10), COL.red, 6);
  shine(c, [[160, 360], [160, 640]], 9);
  // never-ending: a number line with an arrow
  numLine(c, 585, 1010, 600, 4, true, 46);
  arrow(c, [[960, 470], [1010, 410]], RED, 8);
  write(c, "1", 590, 780, 0.1, INK, 1);
};
// 6 flow.p1: a page of 100 dots and a book of pages
const p1 = (c: Ctx) => {
  ground(c);
  paper(c, 60, 180, 520, 560);
  for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) shape(c, () => ell(c, 105 + j * 47, 225 + i * 49, 11, 11), INK, 0);
  // the stapled book of pages
  shadow(c, 800, 800, 230, 30);
  for (let k = 4; k >= 0; k--) shape(c, () => rrect(c, 640 + k * 14, 340 - k * 14 + 180, 300, 400, 8), k % 2 ? COL.cloth : COL.paper, 5);
  shape(c, () => rrect(c, 640, 520, 300, 400, 8), COL.paper, 6);
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) shape(c, () => ell(c, 690 + j * 52, 580 + i * 52, 9, 9), INK, 0);
  shape(c, () => rrect(c, 640, 560, 24, 60, 4), COL.steelDk, 4);
  shape(c, () => rrect(c, 640, 780, 24, 60, 4), COL.steelDk, 4);
  write(c, "1000", 220, 840, 100, INK, 11);
  arrow(c, [[540, 950], [720, 950]], RED, 10);
};
// 7 flow.c1: a postcard with a very big number
const c1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 820, 440, 36);
  shape(c, () => rrect(c, 90, 280, 900, 520, 20), COL.paper, 7);
  shade(c, () => rrect(c, 90, 280, 900, 520, 20), COL.cloth, 24, 12, 0.9);
  shape(c, () => rrect(c, 90, 280, 900, 520, 20), NONE, 7);
  write(c, "9999999", 170, 360, 120, INK, 11);
  write(c, "999999", 170, 560, 100, INK, 9);
    c.save(); c.translate(900, 880); c.rotate(-2.4);
  shape(c, () => rrect(c, 40, -15, 280, 30, 6), COL.yellow); shape(c, () => polyP(c, [[40, -15], [-20, 0], [40, 15]]), COL.wood, 5);
  c.restore();
};
// 8 term.0: four idlis with 1 to 4
const t0 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 600, 440, 270);
  const p = [[360, 540], [540, 500], [720, 540], [540, 650]];
  [[230, 600], [400, 600], [570, 600], [740, 600]].forEach(([x, y]) => idli(c, x, y, 80));
  const nl = [[230, 770], [400, 770], [570, 770], [740, 770]];
  void p;
  nl.forEach(([x, y], i) => write(c, String(i + 1), x - 14, y - 40, 80, INK, 9));
};
// 9 term.1: a road of milestones towards the horizon
const t1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 0, 0, D, 520, 0), COL.sky, 0);
  shape(c, () => polyP(c, [[0, 520], [D, 520], [D, D], [0, D]]), COL.greenLt, 0);
  line(c, [[0, 520], [D, 520]], 6);
  shape(c, () => polyP(c, [[500, 520], [580, 520], [900, 1080], [160, 1080]]), COL.greyDk, 6);
  for (let i = 0; i < 4; i++) { const t = i / 4, y = 560 + i * i * 36 + i * 30, h = 250 - i * 55 + 60, x = 540 + 300 * (1 - 0.0) * (0.15 + t * 0.9) + 40 - 60;
    void h; void x; void y; }
  const ms = [[760, 980, 1], [690, 760, 2], [640, 640, 3], [605, 575, 4]];
  ms.forEach(([x, y, n], i) => {
    const w = 140 - i * 32, h = 190 - i * 44;
    shadow(c, x + w * 0.2, y, w * 0.6, w * 0.12);
    shape(c, () => { c.moveTo(x - w / 2, y); c.lineTo(x - w / 2, y - h * 0.7); c.quadraticCurveTo(x, y - h * 1.2, x + w / 2, y - h * 0.7); c.lineTo(x + w / 2, y); c.closePath(); }, COL.paper, 6);
    write(c, String(n), x - w * 0.18, y - h * 0.7, w * 0.5, INK, Math.max(3, 8 - i * 1.5));
  });
  arrow(c, [[420, 940], [540, 600]], RED, 10);
  shape(c, () => ell(c, 560, 520, 6, 6), INK, 0);
};
// 10 term.2: very many (a heap of sand, finite) vs infinite (number line with an arrow)
const t2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 30, 170, 500, 740, 26), COL.cloth, 6);
  shape(c, () => rrect(c, 550, 170, 500, 740, 26), COL.sky, 6);
  // a heap of sand grains
  shape(c, () => { c.moveTo(80, 780); c.quadraticCurveTo(280, 330, 480, 780); c.closePath(); }, "#e8c98b", 6);
  const r = rnd(9); for (let i = 0; i < 70; i++) { const x = 110 + r() * 340, top = 780 - Math.max(0, 390 * (1 - Math.abs(x - 280) / 200) ); const y = Math.min(770, top + 30 + r() * 120); if (y < 780 && y > top + 12) shape(c, () => ell(c, x, y, 7, 5), "#c9a15f", 0); }
  line(c, [[60, 790], [500, 790]], 8);
  // a long line of numbers
  line(c, [[580, 540], [1020, 540]], 10); line(c, [[986, 512], [1020, 540], [986, 568]], 10);
  for (let i = 0; i < 4; i++) { line(c, [[620 + i * 110, 520], [620 + i * 110, 560]], 6); write(c, String(i + 1), 612 + i * 110, 580, 44, INK, 5); }
  star(c, 800, 330, 0.1);
};
// 11 term.3: a full bag of rice and a small counted heap
const t3 = (c: Ctx) => {
  ground(c);
  shadow(c, 340, 920, 260, 30);
  shape(c, () => { c.moveTo(150, 360); c.quadraticCurveTo(120, 640, 150, 900); c.lineTo(530, 900); c.quadraticCurveTo(560, 640, 530, 360); c.closePath(); }, "#f2dca6", 6);
  shade(c, () => { c.moveTo(150, 360); c.quadraticCurveTo(120, 640, 150, 900); c.lineTo(530, 900); c.quadraticCurveTo(560, 640, 530, 360); c.closePath(); }, "#d9bf84", 40, 0, 0.6);
  shape(c, () => polyP(c, [[140, 360], [540, 360], [520, 300], [160, 300]]), "#f2dca6", 6);
  shape(c, () => ell(c, 340, 330, 180, 28), "#fffdf5", 5);
  const r = rnd(3); for (let i = 0; i < 40; i++) grain(c, 190 + r() * 300, 322 + (r() - 0.5) * 30, r() * 3, 14);
  shape(c, () => rrect(c, 210, 520, 260, 200, 20), COL.paper, 5);
  write(c, "20", 262, 560, 110, COL.red, 11);
  // groups of ten grains
  for (let g = 0; g < 3; g++) { const gx = 700 + (g % 2) * 150, gy = 560 + g * 120 - (g === 1 ? 0 : 0); shape(c, () => ell(c, gx + 20 - (g === 2 ? 70 : 0), gy, 80, 46), "rgba(255,255,255,0.4)", 4); for (let i = 0; i < 10; i++) grain(c, gx - (g === 2 ? 70 : 0) + (i % 5) * 28 - 40 + 20, gy - 16 + Math.floor(i / 5) * 32, 0.3 + (i % 3) * 0.5, 13); }
};
// 12 term.4: the infinity sign, big, beside an 8 standing up
const t4 = (c: Ctx) => {
  ground(c);
  lemn(c, 400, 500, 300, 40, INK);
  lemn(c, 400, 500, 300, 16, COL.orange);
  const eight = (w: number, col: string) => { shape(c, () => ell(c, 900, 590, 70, 80), NONE, 0); c.beginPath(); ell(c, 900, 570, 62, 72); c.strokeStyle = col; c.lineWidth = w; c.stroke(); c.beginPath(); ell(c, 900, 740, 78, 88); c.stroke(); };
  eight(24, INK); eight(10, COL.paper);
};
// 13 term.5: a spoonful of rice tipped onto a plate, grains in groups of ten
const t5 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 700, 440, 230);
  const r = rnd(4);
  [[300, 660], [480, 630], [660, 660], [440, 760], [620, 780]].forEach(([x, y]) => {
    shape(c, () => ell(c, x, y, 80, 44), "rgba(255,255,255,0.35)", 4);
    for (let i = 0; i < 10; i++) grain(c, x - 56 + (i % 5) * 28, y - 14 + Math.floor(i / 5) * 28, r() * 3, 13);
  });
  c.save(); c.translate(740, 270); c.rotate(0.75);
  shape(c, () => rrect(c, -180, -11, 330, 22, 11), COL.steel); shape(c, () => ell(c, 190, 0, 70, 46), COL.steel); shape(c, () => ell(c, 190, 0, 56, 33), COL.steelIn, 4);
  c.restore();
  for (let i = 0; i < 6; i++) grain(c, 540 + i * 18 - 40, 420 + (i % 3) * 22 + i * 18, 1 + i * 0.4, 13);
  arrow(c, [[700, 300], [600, 420]], RED, 10);
  write(c, "10", 150, 220, 90, INK, 9);
};
// 14 term.6: a thousand, a lakh and a crore, written out
const t6 = (c: Ctx) => {
  ground(c);
  const rows: [string[], string, number][] = [[["1", "000"], COL.yellow, 0], [["1", "00", "000"], COL.orange, 1], [["1", "00", "00", "000"], COL.red, 2]] as unknown as [string[], string, number][];
  rows.forEach(([parts, col, k]) => {
    const y = 200 + k * 260, w = 380 + k * 240;
    shape(c, () => rrect(c, 80, y, w, 190, 24), col as string, 6);
    let x = 120;
    (parts as string[]).forEach((p, i) => { write(c, p, x, y + 45, 100, INK, 11); x += p.length * 80 + 8; if (i < parts.length - 1) { line(c, [[x - 6, y + 135], [x - 22, y + 165]], 8); x += 24; } });
  });
};
// 15 term.7: a number line 0 to 10, an arrow at the end, a question beyond
const t7 = (c: Ctx) => {
  ground(c);
  numLine(c, 60, 900, 500, 10, true, 56);
  qmark(c, 970, 400, 190, RED, 16);
};
// 16 expl0: a staircase of numbers, always another step
const x0 = (c: Ctx) => {
  ground(c);
  const steps = ["1", "10", "100", "1000"];
  steps.forEach((t, i) => {
    const x = 90 + i * 215, y = 860 - i * 170;
    shape(c, () => rrect(c, x, y, 215, 1100 - y, 4), COL.wood, 6);
    shade(c, () => rrect(c, x, y, 215, 1100 - y, 4), COL.woodDk, 0, 18, 0.7);
    write(c, t, x + 107 - t.length * 24, y + 30, 60, INK, 8);
  });
  const x4 = 90 + 4 * 215, y4 = 860 - 4 * 170;
  c.setLineDash([16, 14]); shape(c, () => rrect(c, x4 - 10, y4, 130, 140, 4), NONE, 6); c.setLineDash([]);
  person(c, 90 + 3 * 215 + 107, 860 - 3 * 170, 330, {});
  arrow(c, [[780, 220], [880, 130]], RED, 12);
};
// 17 expl1: the number line, and the infinity sign floating above it
const x1 = (c: Ctx) => {
  ground(c);
  numLine(c, 60, 1020, 740, 6, true, 52);
  line(c, [[860, 740], [900, 740]], 10);
  for (let i = 0; i < 4; i++) shape(c, () => ell(c, 880 + i * 30, 740, 5, 5), INK, 0);
  lemn(c, 540, 330, 250, 36, INK);
  lemn(c, 540, 330, 250, 14, COL.orange);
};
// 18 expl2: a heap of rice split into groups of ten, a big number on a slate
const x2 = (c: Ctx) => {
  ground(c);
  plate(c, 400, 760, 340, 190);
  const r = rnd(8);
  [[260, 740], [400, 700], [540, 740], [330, 810], [480, 820]].forEach(([x, y]) => {
    shape(c, () => ell(c, x, y, 62, 34), "rgba(255,255,255,0.35)", 4);
    for (let i = 0; i < 8; i++) grain(c, x - 40 + (i % 4) * 26, y - 10 + Math.floor(i / 4) * 24, r() * 3, 11);
  });
  // slate with a big number
  shadow(c, 810, 960, 220, 20);
  shape(c, () => rrect(c, 600, 220, 420, 360, 22), COL.wood, 8);
  shape(c, () => rrect(c, 626, 246, 368, 308, 12), "#2f3d3a", 5);
  write(c, "100000", 650, 350, 68, WHITE, 8);
  arrow(c, [[420, 580], [520, 520]], RED, 10);
  // dots to show a heap above
  const hr = rnd(2); shape(c, () => { c.moveTo(130, 540); c.quadraticCurveTo(400, 130, 660, 540); c.closePath(); }, NONE, 0);
  void hr;
};
// 19 expl3: an ant on a ball, and stars fading into the dark
const x3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 20, 140, 520, 800, 26), COL.sky, 6);
  shape(c, () => rrect(c, 560, 140, 500, 800, 26), "#26264a", 6);
  // football
  shape(c, () => ell(c, 280, 560, 200, 200), WHITE);
  shade(c, () => ell(c, 280, 560, 200, 200), COL.cloth, 50, 40, 1);
  shape(c, () => polyP(c, [[280, 480], [350, 530], [325, 610], [235, 610], [210, 530]]), INK, 5);
  [[280, 420], [140, 520], [150, 640], [420, 520], [410, 650]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 24, 20), INK, 0));
  // ant on top: 3 body parts, 6 legs
  const ax = 300, ay = 345;
  for (let i = 0; i < 3; i++) { const lx = ax - 14 + i * 22; line(c, [[lx, ay + 6], [lx - 12, ay + 28]], 5); line(c, [[lx, ay + 6], [lx + 12, ay + 28]], 5); }
  shape(c, () => ell(c, ax - 34, ay, 20, 14), INK, 4); shape(c, () => ell(c, ax, ay - 4, 16, 12), INK, 4); shape(c, () => ell(c, ax + 36, ay - 2, 12, 11), INK, 4);
  line(c, [[ax + 44, ay - 12], [ax + 58, ay - 30]], 4); line(c, [[ax + 40, ay - 12], [ax + 46, ay - 34]], 4);
  arrow(c, [[200, 230], [330, 230]], RED, 8);
  // stars fading
  const r = rnd(12);
  for (let i = 0; i < 26; i++) { const x = 600 + r() * 420, y = 190 + r() * 700, f = 1 - (x - 600) / 440; c.globalAlpha = Math.max(0.25, f); star(c, x, y, 8 + f * 16, WHITE); c.globalAlpha = 1; }
  qmark(c, 540, 480, 160, RED, 14);
};
// 20 expl4: one finger up and a line of numbers flowing out of it
const x4 = (c: Ctx) => {
  ground(c);
  person(c, 260, 1000, 640, { armR: [-Math.PI * 0.35, -Math.PI * 0.45] });
  line(c, [[560, 330], [1040, 330]], 10); line(c, [[1006, 302], [1040, 330], [1006, 358]], 10);
  const ns = ["1", "2", "3", "4"];
  ns.forEach((t, i) => { const x = 620 + i * 110; shape(c, () => rrect(c, x, 220, 80, 70, 14), COL.yellow, 5); write(c, t, x + 26, 232, 46, INK, 6); });
  arrow(c, [[420, 330], [540, 330]], RED, 10);
};
export const ic_nothingAndForeverInfinityL3 = cards("sci.nothing-and-forever.infinity.L3 cards", [e1, a1, a2, a3, a4, a5, p1, c1, t0, t1, t2, t3, t4, t5, t6, t7, x0, x1, x2, x3, x4]);
