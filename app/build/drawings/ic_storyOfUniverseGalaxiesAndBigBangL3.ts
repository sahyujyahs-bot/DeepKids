import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, write, plate, cards } from "./flatKit";

// sci.story-of-universe.galaxies-and-big-bang.L3 · picture cards (flows, terms, explanations).
const SPACE = "#1d2140", SPACE2 = "#2c3262", ARM = "#a9c4ff", ARMDK = "#6f8fd8", DISC = "#3b4a8f", STAR = "#fff6c8";
const DOUGH = "#f2d8a0", DOUGHDK = "#d9b878", RAISIN = "#5a3a2e";

const space = (c: Ctx, n = 40, seedN = 5) => {
  c.fillStyle = SPACE; c.fillRect(0, 0, D, D);
  stars(c, 20, 20, D - 20, D - 20, n, seedN);
};
const stars = (c: Ctx, x0: number, y0: number, x1: number, y1: number, n: number, seedN: number) => {
  const r = rnd(seedN);
  for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), s = 2.5 + r() * 3.5; c.beginPath(); ell(c, x, y, s, s); c.fillStyle = STAR; c.fill(); }
};
// a red arrow with a white edge so it shows on dark space
const warrow = (c: Ctx, pts: number[][], w = 12) => { arrow(c, pts, WHITE, w + 10); arrow(c, pts, RED, w); };
const ray = (c: Ctx, pts: number[][], w = 12) => { arrow(c, pts, INK, w + 8); arrow(c, pts, COL.yellow, w); };
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.65, y + Math.sin(a) * r * 1.65]], Math.max(5, r * 0.14), COL.yellow); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, Math.max(4, r * 0.08));
  shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.3, r * 0.3, 0.5);
};
const earth = (c: Ctx, x: number, y: number, r: number) => {
  const body = () => ell(c, x, y, r, r);
  shape(c, body, COL.blue, Math.max(4, r * 0.06));
  c.save(); c.beginPath(); body(); c.clip();
  shape(c, () => { c.moveTo(x - r * 0.6, y - r * 0.35); c.bezierCurveTo(x - r * 0.3, y - r * 0.8, x + r * 0.1, y - r * 0.5, x - r * 0.05, y - r * 0.15); c.bezierCurveTo(x - r * 0.2, y + r * 0.05, x - r * 0.5, y + r * 0.1, x - r * 0.6, y - r * 0.35); c.closePath(); }, COL.green, 4);
  shape(c, () => { c.moveTo(x + r * 0.2, y + r * 0.1); c.bezierCurveTo(x + r * 0.6, y - r * 0.1, x + r * 0.8, y + r * 0.3, x + r * 0.45, y + r * 0.7); c.bezierCurveTo(x + r * 0.2, y + r * 0.6, x + r * 0.1, y + r * 0.3, x + r * 0.2, y + r * 0.1); c.closePath(); }, COL.green, 4);
  c.restore();
  shade(c, body, COL.blueDk, r * 0.35, r * 0.3, 0.5);
  c.beginPath(); body(); c.strokeStyle = INK; c.lineWidth = Math.max(4, r * 0.06); c.stroke();
};
// a point on a spiral arm: t 0..1 out from the centre (or the bar tip), s = +1 / -1 for the two arms
const armPt = (r: number, t: number, s: number, barred: boolean): number[] => {
  const ang = barred ? t * 3.4 : 0.4 + t * 7.0, rad = barred ? r * (0.45 + 0.5 * t) : r * (0.16 + 0.82 * t);
  return [s * rad * Math.cos(ang), s * rad * Math.sin(ang)];
};
// a galaxy seen face on: kind = spiral | barred | elliptical | irregular
type Kind = "spiral" | "barred" | "elliptical" | "irregular";
const galaxy = (c: Ctx, x: number, y: number, r: number, kind: Kind, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  if (kind === "elliptical") {
    shape(c, () => ell(c, 0, 0, r, r * 0.72, 0.3), "#d9b36f", Math.max(3, r * 0.04));
    shape(c, () => ell(c, 0, 0, r * 0.7, r * 0.5, 0.3), "#efd08d", 0);
    shape(c, () => ell(c, 0, 0, r * 0.38, r * 0.27, 0.3), "#fff0c0", 0);
  } else if (kind === "irregular") {
    const blobs: number[][] = [[-0.4, -0.15, 0.45], [0.1, 0.2, 0.5], [0.5, -0.2, 0.34], [-0.1, -0.5, 0.3], [0.35, 0.55, 0.26]];
    blobs.forEach(([u, v, k]) => shape(c, () => ell(c, u * r, v * r, k * r, k * r * 0.8), ARMDK, Math.max(3, r * 0.04)));
    blobs.forEach(([u, v, k]) => shape(c, () => ell(c, u * r, v * r, k * r * 0.5, k * r * 0.4), ARM, 0));
    for (const [u, v] of [[-0.45, -0.1], [0.15, 0.25], [0.5, -0.25], [-0.1, -0.5]]) { c.beginPath(); ell(c, u * r, v * r, r * 0.06, r * 0.06); c.fillStyle = WHITE; c.fill(); }
  } else {
    const barred = kind === "barred";
    shape(c, () => ell(c, 0, 0, r, r), DISC, Math.max(3, r * 0.03));
    for (const s of [1, -1]) {
      const pts: number[][] = []; for (let i = 0; i <= 24; i++) pts.push(armPt(r * 0.95, i / 24, s, barred));
      line(c, pts, r * 0.2, DISC); line(c, pts, r * 0.14, ARM);
    }
    if (barred) { shape(c, () => rrect(c, -r * 0.5, -r * 0.1, r, r * 0.2, r * 0.1), "#f2d99a", Math.max(3, r * 0.03)); }
    shape(c, () => ell(c, 0, 0, r * 0.2, r * 0.2), COL.yellow, Math.max(3, r * 0.03));
  }
  c.restore();
};
const bindi = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), RED, 3.5); c.beginPath(); ell(c, x - r * 0.3, y - r * 0.3, r * 0.3, r * 0.3); c.fillStyle = WHITE; c.globalAlpha = 0.7; c.fill(); c.globalAlpha = 1; };
const balloon = (c: Ctx, x: number, y: number, r: number, dots: number[][], dotR: number) => {
  shadow(c, x + r * 0.15, y + r * 1.35, r * 0.9, r * 0.12);
  line(c, [[x, y + r * 1.02], [x - r * 0.1, y + r * 1.2], [x + r * 0.08, y + r * 1.32]], 4, INK);
  shape(c, () => polyP(c, [[x - r * 0.1, y + r * 0.98], [x + r * 0.1, y + r * 0.98], [x + r * 0.06, y + r * 1.1], [x - r * 0.06, y + r * 1.1]]), COL.blueDk, 4);
  shape(c, () => ell(c, x, y, r, r * 1.05), COL.sky);
  shade(c, () => ell(c, x, y, r, r * 1.05), COL.blue, r * 0.3, r * 0.3, 0.45);
  dots.forEach(([u, v]) => bindi(c, x + u * r, y + v * r, dotR));
  shine(c, [[x - r * 0.7, y - r * 0.3], [x - r * 0.4, y - r * 0.7]], Math.max(7, r * 0.05));
};
const dough = (c: Ctx, x: number, y: number, r: number, dots: number[][], dotR: number) => {
  plate(c, x, y + r * 0.85, r * 1.25, r * 0.3);
  shape(c, () => ell(c, x, y, r, r * 0.9), DOUGH, 5);
  shade(c, () => ell(c, x, y, r, r * 0.9), DOUGHDK, r * 0.35, r * 0.3, 0.6);
  dots.forEach(([u, v]) => { shape(c, () => ell(c, x + u * r, y + v * r * 0.9, dotR, dotR * 0.7, 0.5), RAISIN, 3.5); });
  shine(c, [[x - r * 0.7, y - r * 0.2], [x - r * 0.4, y - r * 0.6]], 8);
};
const SPOTS: number[][] = [[-0.45, -0.3], [0.1, -0.5], [0.5, -0.2], [-0.2, 0.1], [0.3, 0.25], [-0.55, 0.35], [0.05, 0.55]];

// ------------------------------------------------------------------ experiments, activities, projects, challenges
// e1: the Bindi Balloon, before and after
const flowE1 = (c: Ctx) => {
  ground(c);
  balloon(c, 250, 480, 140, SPOTS, 15);
  balloon(c, 770, 480, 250, SPOTS, 27);
  arrow(c, [[420, 480], [510, 480]]);
};
// a2: the Universe in One Year, a wall calendar
const flowA2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 910, 400, 36);
  shape(c, () => rrect(c, 140, 130, 800, 770, 26), WHITE, 7);
  shape(c, () => rrect(c, 140, 130, 800, 120, 26), RED, 7);
  shape(c, () => polyP(c, [[140, 200], [940, 200], [940, 250], [140, 250]]), RED, 0);
  for (const x of [300, 540, 780]) { shape(c, () => rrect(c, x - 14, 100, 28, 70, 12), COL.steel, 5); }
  const cw = 190, ch = 190;
  for (let i = 0; i < 12; i++) {
    const cx = 175 + (i % 4) * (cw + 5), cy = 285 + Math.floor(i / 4) * (ch + 5);
    shape(c, () => rrect(c, cx, cy, cw, ch, 10), "#fbf4e2", 4);
    write(c, String(i + 1), cx + 12, cy + 10, 30, INK, 5);
  }
  const cell = (i: number): [number, number] => [175 + (i % 4) * 195 + 95, 285 + Math.floor(i / 4) * 195 + 115];
  // 1 Jan: the Big Bang, a bright burst
  { const [x, y] = cell(0); for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * 36, y + Math.sin(a) * 36], [x + Math.cos(a) * (k % 2 ? 62 : 76)  , y + Math.sin(a) * (k % 2 ? 62 : 76)]], 11, RED); } shape(c, () => ell(c, x, y, 38, 38), "#fff6c8", 5); }
  // Sept: the Sun and Earth
  { const [x, y] = cell(8); sun(c, x - 25, y, 24); earth(c, x + 42, y + 20, 18); }
  // Dec: a tiny person at the very end of the last day
  { const [x, y] = cell(11); shape(c, () => ell(c, x, y - 28, 14, 14), COL.brown, 4); shape(c, () => rrect(c, x - 16, y - 12, 32, 50, 10), CLOTH_CH, 4); }
};
const CLOTH_CH = "#f39a3c";
// a3: stretch the elastic, marks move apart
const flowA3 = (c: Ctx) => {
  ground(c);
  const strip = (x0: number, x1: number, y: number) => {
    shape(c, () => rrect(c, x0, y - 38, x1 - x0, 76, 18), COL.pink, 6);
    shade(c, () => rrect(c, x0, y - 38, x1 - x0, 76, 18), "#d46f90", 0, 18, 0.5);
    for (let i = 0; i < 5; i++) { const x = x0 + 30 + (i * (x1 - x0 - 60)) / 4; line(c, [[x, y - 38], [x, y + 38]], 8, INK); }
  };
  strip(300, 780, 220);
  arrow(c, [[540, 330], [540, 450]]);
  strip(250, 830, 700);
  hand(c, 110, 700, 0, 1, undefined, undefined, false);
  hand(c, 970, 700, Math.PI, 1, "#8d5a3b", "#5b8fd6", false);
};
// a5: be a galaxy zoo sorter, a tablet showing a galaxy and a tally
const flowA5 = (c: Ctx) => {
  ground(c);
  shadow(c, 380, 850, 330, 30);
  shape(c, () => rrect(c, 50, 170, 640, 660, 40), COL.black, 7);
  shape(c, () => rrect(c, 90, 210, 560, 580, 18), SPACE, 4);
  stars(c, 110, 230, 630, 600, 14, 3);
  galaxy(c, 370, 420, 165, "spiral", 0.4);
  [["spiral", 1], ["barred", 1], ["elliptical", 1], ["irregular", 1]].forEach(([k], i) => {
    const x = 165 + i * 130; shape(c, () => rrect(c, x - 52, 650, 104, 104, 14), SPACE2, 5); galaxy(c, x, 702, 36, k as Kind);
  });
  shape(c, () => rrect(c, 730, 200, 290, 520, 12), WHITE, 6);
  for (let g = 0; g < 2; g++) for (let i = 0; i < 4; i++) line(c, [[770 + i * 36, 260 + g * 130], [770 + i * 36, 350 + g * 130]], 8, INK);
  line(c, [[758, 340], [910, 270]], 8, INK);
  line(c, [[770, 520], [770, 610]], 8, INK); line(c, [[806, 520], [806, 610]], 8, INK);
  write(c, "5", 910, 500, 80, INK, 8);
  shape(c, () => polyP(c, [[860, 800], [980, 640], [1010, 660], [890, 820]]), COL.yellow, 5);
};
// p1: my galaxy field guide, an open book of galaxy shapes
const flowP1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 860, 470, 40);
  shape(c, () => polyP(c, [[60, 210], [530, 250], [530, 840], [60, 800]]), WHITE, 7);
  shape(c, () => polyP(c, [[550, 250], [1020, 210], [1020, 800], [550, 840]]), "#f6efdc", 7);
  const tile = (x: number, y: number, w: number, h: number, k: Kind) => { shape(c, () => rrect(c, x, y, w, h, 14), SPACE, 5); stars(c, x + 15, y + 15, x + w - 15, y + h - 15, 5, x); galaxy(c, x + w / 2, y + h / 2, 76, k); };
  tile(100, 280, 200, 200, "spiral"); tile(300, 300, 200, 200, "barred");
  tile(110, 540, 200, 200, "elliptical"); tile(310, 560, 200, 200, "irregular");
  line(c, [[600, 300], [960, 280]], 8, "#cdbf9a"); line(c, [[600, 360], [960, 340]], 8, "#cdbf9a"); line(c, [[600, 420], [900, 405]], 8, "#cdbf9a");
  tile(640, 520, 300, 240, "spiral");
  shape(c, () => polyP(c, [[800, 905], [1010, 700], [1040, 725], [830, 930]]), COL.yellow, 5);
  shape(c, () => polyP(c, [[1010, 700], [1040, 725], [1062, 668]]), "#f0cfa0", 5);
};
// c1: a universe with no centre: raisin dough, before and after
const flowC1 = (c: Ctx) => {
  ground(c);
  dough(c, 250, 470, 140, SPOTS, 16);
  dough(c, 770, 480, 250, SPOTS, 28);
  arrow(c, [[420, 470], [510, 470]]);
};

// ------------------------------------------------------------------ terms
// 1 Milky Way: our galaxy, with the Sun marked
const term1 = (c: Ctx) => {
  space(c, 36, 11);
  galaxy(c, 540, 480, 370, "barred", 0.35);
  const [sx, sy] = armPt(370 * 0.95, 0.55, 1, true);
  const p = [540 + sx * Math.cos(0.35) - sy * Math.sin(0.35), 480 + sx * Math.sin(0.35) + sy * Math.cos(0.35)];
  shape(c, () => ell(c, p[0], p[1], 34, 34), WHITE, 0);
  sun(c, p[0], p[1], 16);
  warrow(c, [[p[0] + 160, p[1] + 150], [p[0] + 44, p[1] + 38]]);
};
// 6 light-year: a star, a long ray, Earth, and one year's calendar page
const term6 = (c: Ctx) => {
  space(c, 30, 21);
  sun(c, 140, 520, 56);
  earth(c, 930, 520, 70);
  ray(c, [[240, 520], [840, 520]], 18);
  shape(c, () => rrect(c, 410, 260, 260, 190, 14), WHITE, 6);
  shape(c, () => rrect(c, 410, 260, 260, 56, 14), RED, 6);
  write(c, "1", 520, 330, 90, INK, 9);
};
// 7 expanding universe: the same galaxies, spaced wider apart
const term7 = (c: Ctx) => {
  space(c, 30, 31);
  const kinds: Kind[] = ["spiral", "elliptical", "barred", "irregular"];
  kinds.forEach((k, i) => galaxy(c, 285 + i * 170, 270, 70, k, i));
  kinds.forEach((k, i) => galaxy(c, 120 + i * 280, 800, 70, k, i));
  warrow(c, [[540, 380], [540, 640]], 14);
};
// 8 Big Bang: a tiny hot ball, then a big sky of galaxies
const term8 = (c: Ctx) => {
  ground(c, "#1a1a2e");
  shape(c, () => ell(c, 220, 540, 170, 170), "#000000", 6);
  for (const [r, col, a] of [[120, COL.orange, 0.35], [80, COL.yellow, 0.55], [46, "#fff6c8", 1]] as [number, string, number][]) { c.globalAlpha = a; c.beginPath(); ell(c, 220, 540, r, r); c.fillStyle = col; c.fill(); }
  c.globalAlpha = 1;
  arrow(c, [[420, 540], [510, 540]], WHITE, 14);
  shape(c, () => ell(c, 770, 540, 280, 280), SPACE, 6);
  c.save(); c.beginPath(); ell(c, 770, 540, 280, 280); c.clip();
  stars(c, 500, 260, 1040, 820, 26, 8);
  galaxy(c, 700, 470, 62, "spiral", 0.5); galaxy(c, 880, 600, 56, "elliptical", 1); galaxy(c, 650, 680, 48, "barred", 2); galaxy(c, 860, 400, 44, "irregular", 1); galaxy(c, 770, 590, 34, "spiral", 3);
  c.restore();
  c.beginPath(); ell(c, 770, 540, 280, 280); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
// 9 cosmic microwave background: a faint speckled all-sky glow and the dish that found it
const term9 = (c: Ctx) => {
  space(c, 0, 1);
  shape(c, () => ell(c, 540, 380, 470, 270), "#e08a3c", 6);
  c.save(); c.beginPath(); ell(c, 540, 380, 470, 270); c.clip();
  const r = rnd(41), pal = ["#f2b04c", "#c9633a", "#8b6cc9", "#5b8fd6", "#f4d27a", "#b55a8a"];
  for (let i = 0; i < 90; i++) { c.beginPath(); ell(c, 80 + r() * 920, 110 + r() * 540, 20 + r() * 40, 16 + r() * 30, r() * 3); c.fillStyle = pal[Math.floor(r() * pal.length)]; c.globalAlpha = 0.85; c.fill(); }
  c.restore(); c.globalAlpha = 1;
  c.beginPath(); ell(c, 540, 380, 470, 270); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  // the dish: a stand, a bowl facing up and left, a feed arm
  shape(c, () => polyP(c, [[540, 900], [680, 900], [640, 780], [580, 780]]), COL.steelDk, 5);
  shape(c, () => ell(c, 610, 740, 150, 56, -0.7), COL.steel, 6);
  shape(c, () => ell(c, 598, 728, 118, 38, -0.7), COL.steelIn, 4);
  line(c, [[610, 740], [530, 620]], 7, INK); shape(c, () => ell(c, 528, 616, 12, 12), COL.red, 4);
};
// 10 redshift: short waves stretch into long red waves
const wave = (c: Ctx, x0: number, x1: number, y: number, amp: number, period: number, col: string) => {
  const pts: number[][] = []; for (let x = x0; x <= x1; x += 4) pts.push([x, y + Math.sin(((x - x0) / period) * Math.PI * 2) * amp]);
  line(c, pts, 26, INK); line(c, pts, 15, col);
};
const term10 = (c: Ctx) => {
  ground(c, "#1a1a2e");
  galaxy(c, 130, 270, 70, "spiral", 1);
  wave(c, 250, 960, 270, 52, 70, "#5b8fd6");
  warrow(c, [[540, 400], [540, 600]], 14);
  galaxy(c, 130, 800, 70, "spiral", 1);
  wave(c, 250, 960, 800, 52, 190, "#e4523b");
};

// ------------------------------------------------------------------ explanations
// 0 what a galaxy is: a huge group of stars, with empty space between galaxies
const expl0 = (c: Ctx) => {
  space(c, 0, 2);
  galaxy(c, 540, 520, 300, "spiral", 0.2);
  stars(c, 300, 300, 780, 740, 70, 71);
  galaxy(c, 130, 140, 70, "elliptical", 0.4); galaxy(c, 950, 160, 66, "barred", 0.5); galaxy(c, 960, 930, 70, "irregular", 1); galaxy(c, 120, 940, 62, "spiral", 2);
};
// 1 galaxies come in different shapes
const expl1 = (c: Ctx) => {
  ground(c, "#1a1a2e");
  const kinds: Kind[] = ["spiral", "barred", "elliptical", "irregular"];
  kinds.forEach((k, i) => {
    const x = 50 + (i % 2) * 510, y = 50 + Math.floor(i / 2) * 510;
    shape(c, () => rrect(c, x, y, 470, 470, 30), SPACE, 6); stars(c, x + 20, y + 20, x + 450, y + 450, 12, i + 50);
    galaxy(c, x + 235, y + 235, 170, k, 0.4);
  });
};
// 2 why spirals have arms: a spiral galaxy turning
const arcPts = (cx: number, cy: number, r: number, a0: number, a1: number) => { const p: number[][] = []; for (let i = 0; i <= 20; i++) { const a = a0 + ((a1 - a0) * i) / 20; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return p; };
const expl2 = (c: Ctx) => {
  space(c, 30, 61);
  galaxy(c, 540, 540, 300, "spiral", 0);
  warrow(c, arcPts(540, 540, 400, -2.6, -0.3), 14);
  warrow(c, arcPts(540, 540, 400, 0.5, 2.9), 14);
};
// 3 the universe is expanding: whichever galaxy you stand on, the others move away, the further the faster
const expl3 = (c: Ctx) => {
  space(c, 20, 81);
  const kinds: Kind[] = ["spiral", "elliptical", "barred", "irregular"];
  const row = (y: number, me: number) => {
    kinds.forEach((k, i) => galaxy(c, 170 + i * 250, y, 62, k, i));
    c.beginPath(); ell(c, 170 + me * 250, y, 98, 98); c.strokeStyle = WHITE; c.lineWidth = 8; c.stroke();
    kinds.forEach((_, i) => { if (i === me) return; const d = i - me, x = 170 + i * 250, s = Math.sign(d); warrow(c, [[x, y - 110], [x + s * 36 * Math.abs(d), y - 110]], 11); });
  };
  row(330, 0); row(800, 1);
};
// 4 the Big Bang: hot and packed, then galaxies, then Earth
const expl4 = (c: Ctx) => {
  ground(c, "#1a1a2e");
  const disc = (x: number) => { shape(c, () => ell(c, x, 540, 140, 140), SPACE, 6); };
  disc(170);
  for (const [r, col, a] of [[100, COL.orange, 0.35], [66, COL.yellow, 0.55], [34, "#fff6c8", 1]] as [number, string, number][]) { c.globalAlpha = a; c.beginPath(); ell(c, 170, 540, r, r); c.fillStyle = col; c.fill(); }
  c.globalAlpha = 1;
  disc(540); c.save(); c.beginPath(); ell(c, 540, 540, 140, 140); c.clip(); galaxy(c, 500, 500, 48, "spiral", 0.5); galaxy(c, 600, 580, 40, "elliptical", 1); galaxy(c, 520, 610, 30, "barred", 2); c.restore();
  c.beginPath(); ell(c, 540, 540, 140, 140); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  disc(910); c.save(); c.beginPath(); ell(c, 910, 540, 140, 140); c.clip(); stars(c, 780, 420, 1040, 660, 6, 9); sun(c, 860, 470, 30); earth(c, 930, 600, 52); c.restore();
  c.beginPath(); ell(c, 910, 540, 140, 140); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  arrow(c, [[325, 540], [385, 540]], WHITE, 12); arrow(c, [[695, 540], [755, 540]], WHITE, 12);
};
// 5 looking far is looking back: farther objects, longer light trips
const expl5 = (c: Ctx) => {
  space(c, 20, 91);
  const rows: [number, number][] = [[210, 520], [540, 760], [850, 960]];
  rows.forEach(([y, x], i) => {
    earth(c, 120, y, 64);
    ray(c, [[x - 70, y], [210, y]], 14);
    if (i === 0) { shape(c, () => ell(c, x, y, 34, 34), "#d9d4c7", 5); shade(c, () => ell(c, x, y, 34, 34), "#a8a396", 12, 10, 0.6); }
    if (i === 1) sun(c, x, y, 56);
    if (i === 2) galaxy(c, x, y, 66, "spiral", 0.6);
  });
};
// 6 how astronomers measure distance: the same lamp looks bright near and faint far away
const lamp = (c: Ctx, x: number, base: number, h: number, glow: number, lit: boolean) => {
  line(c, [[x, base], [x, base - h]], Math.max(6, h * 0.05), INK);
  line(c, [[x, base], [x, base - h]], Math.max(3, h * 0.05 - 5), COL.steelDk);
  const y = base - h;
  if (lit) for (const [k, a] of [[1, 0.18], [0.65, 0.3], [0.38, 0.6]] as [number, number][]) { c.globalAlpha = a; c.beginPath(); ell(c, x, y, glow * k, glow * k); c.fillStyle = COL.yellow; c.fill(); }
  c.globalAlpha = 1;
  shape(c, () => ell(c, x, y, glow * 0.2, glow * 0.2), lit ? "#fff6c8" : COL.steel, Math.max(3, glow * 0.04));
};
const expl6 = (c: Ctx) => {
  c.fillStyle = SPACE; c.fillRect(0, 0, D, D);
  stars(c, 20, 20, D - 20, 400, 26, 17);
  shape(c, () => polyP(c, [[500, 500], [600, 500], [1080, 1080], [60, 1080]]), "#4a4a5e", 0);
  line(c, [[550, 520], [550, 560]], 6, "#d9d4c7"); line(c, [[550, 620], [550, 700]], 10, "#d9d4c7"); line(c, [[550, 770], [550, 900]], 16, "#d9d4c7");
  lamp(c, 260, 1040, 720, 210, true);
  lamp(c, 505, 505, 80, 22, true);
};
// 7 what came before the Big Bang: nobody knows, a question
const expl7 = (c: Ctx) => {
  ground(c, "#1a1a2e");
  // the universe growing from a point, to the right
  shape(c, () => polyP(c, [[470, 540], [1040, 170], [1040, 910]]), SPACE, 6);
  stars(c, 700, 330, 1020, 750, 12, 33);
  galaxy(c, 820, 440, 48, "spiral", 0.5); galaxy(c, 900, 620, 50, "elliptical", 1); galaxy(c, 760, 680, 36, "barred", 2);
  for (const [r, col, a] of [[44, COL.orange, 0.4], [28, COL.yellow, 0.7], [14, "#fff6c8", 1]] as [number, string, number][]) { c.globalAlpha = a; c.beginPath(); ell(c, 470, 540, r, r); c.fillStyle = col; c.fill(); }
  c.globalAlpha = 1;
  // before: a grey fog and a question mark
  for (const [x, y, rx, ry] of [[170, 420, 130, 90], [260, 560, 160, 100], [120, 640, 110, 80], [250, 330, 100, 70]]) { c.beginPath(); ell(c, x, y, rx, ry); c.fillStyle = "#4a4a68"; c.globalAlpha = 0.8; c.fill(); }
  c.globalAlpha = 1;
  const q: number[][] = []; for (let i = 0; i <= 16; i++) { const a = Math.PI + (Math.PI * 1.4 * i) / 16; q.push([210 + Math.cos(a) * 70, 470 + Math.sin(a) * 70]); }
  q.push([210, 590], [210, 610]); line(c, q, 22, WHITE);
  c.beginPath(); ell(c, 210, 680, 15, 15); c.fillStyle = WHITE; c.fill();
};

export const ic_storyOfUniverseGalaxiesAndBigBangL3 = cards("sci.story-of-universe.galaxies-and-big-bang.L3 cards", [
  flowE1, flowA2, flowA3, flowA5, flowP1, flowC1, // 0-5
  term1, term6, term7, term8, term9, term10, // 6-11
  expl0, expl1, expl2, expl3, expl4, expl5, expl6, expl7, // 12-19
]);
