import type { Ctx } from "./core";
import { D, INK, BG, RED, WHITE, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, seed, leaf, hand, write, cards } from "./flatKit";

// OUR ENVIRONMENT (L3) · fill-in cards: the cover, the main idea, the drain test, the bottle garden,
// the family care week.

// a clear box (tub) seen from the front: its contents are drawn by `inside`, then the glass outline over them
const clearBox = (c: Ctx, x: number, y: number, w: number, h: number, inside: () => void) => {
  shadow(c, x + w / 2 + 14, y + h + 8, w * 0.55, 18);
  shape(c, () => rrect(c, x, y, w, h, 24), COL.sky, 0);
  inside();
  shape(c, () => rrect(c, x, y, w, h, 24), "rgba(214,236,250,0.3)", 7);
  shine(c, [[x + 30, y + 60], [x + 30, y + h - 60]], 9);
};
// a moong seedling: white root down into the cotton, a green stem up with two leaves
const seedling = (c: Ctx, x: number, y: number, stemH: number, col: string = COL.leaf, alive = true) => {
  line(c, [[x, y], [x + 6, y + 30], [x - 4, y + 55]], 14, INK);
  line(c, [[x, y], [x + 6, y + 30], [x - 4, y + 55]], 7, COL.paper);
  const top = alive ? y - stemH : y - stemH * 0.6, mx = alive ? x : x + stemH * 0.5;
  line(c, [[x, y], [mx * 0.3 + x * 0.7, (y + top) / 2], [mx, top]], 14, INK);
  line(c, [[x, y], [mx * 0.3 + x * 0.7, (y + top) / 2], [mx, top]], 7, col);
  leaf(c, mx, top, stemH * 0.5 + 20, alive ? -2.4 : -0.3, col);
  leaf(c, mx, top, stemH * 0.5 + 20, alive ? -0.7 : 0.6, col);
  seed(c, x, y, 20, 0.4, true);
};
const cotton = (c: Ctx, x: number, y: number, rx: number, ry: number, wet: boolean) => {
  shape(c, () => ell(c, x, y, rx, ry), wet ? COL.water : COL.cloth, 5);
  if (wet) for (let i = 0; i < 4; i++) shape(c, () => ell(c, x - rx * 0.6 + i * rx * 0.4, y - ry * 0.2, 9, 6), COL.drop, 2.5);
};
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) =>
  shape(c, () => { c.moveTo(x, y - s * 1.6); c.quadraticCurveTo(x + s * 1.05, y - s * 0.2, x + s, y + s * 0.3); c.arc(x, y + s * 0.3, s, 0, Math.PI); c.quadraticCurveTo(x - s * 1.05, y - s * 0.2, x, y - s * 1.6); c.closePath(); }, col, 5);
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
};

// card 0 · cover: the Earth held up by a child's hand and a grown-up's hand, a plant growing on top
const cover = (c: Ctx) => {
  ground(c);
  sun(c, 150, 150, 70);
  const gx = 540, gy = 500, gr = 300;
  shadow(c, gx + 30, gy + gr + 40, gr * 0.9, 40);
  shape(c, () => ell(c, gx, gy, gr, gr), COL.blue);
  c.save(); c.beginPath(); ell(c, gx, gy, gr, gr); c.clip();
  const land = (pts: number[][]) => { shape(c, () => { c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; c.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); } c.closePath(); }, COL.green, 5); };
  land([[330, 330], [440, 280], [520, 350], [470, 460], [380, 520], [290, 470], [270, 380]]);
  land([[600, 240], [720, 230], [800, 320], [760, 430], [660, 410], [590, 330]]);
  land([[560, 560], [660, 530], [720, 620], [680, 740], [580, 760], [520, 660]]);
  land([[300, 620], [380, 600], [400, 690], [340, 740], [280, 700]]);
  c.restore();
  shade(c, () => ell(c, gx, gy, gr, gr), COL.blueDk, -70, -60, 0.3);
  shape(c, () => ell(c, gx, gy, gr, gr), "rgba(0,0,0,0)", 7);
  // the plant on top of the world
  line(c, [[540, 215], [545, 150], [538, 80]], 16, INK); line(c, [[540, 215], [545, 150], [538, 80]], 9, COL.leafDk);
  leaf(c, 541, 150, 110, -2.6); leaf(c, 540, 120, 105, -0.5); leaf(c, 538, 80, 90, -1.9);
  // the two hands holding it from below
  hand(c, 250, 830, -0.75, 1.7, SKIN.child, CLOTH.child, true);
  c.save(); c.translate(D, 0); c.scale(-1, 1); hand(c, 230, 860, -0.7, 1.9, SKIN.adult, CLOTH.adult, true); c.restore();
};

// card 1 · the main idea: an open box lets its water go off into the air; a closed box keeps the same water going round
const mainIdea = (c: Ctx) => {
  ground(c);
  sun(c, 540, 120, 60);
  // open box: dry cotton, a wilted seedling, water leaving upward
  clearBox(c, 70, 420, 400, 440, () => {
    cotton(c, 270, 800, 170, 40, false);
    seedling(c, 270, 790, 150, COL.woodDk, false);
  });
  for (let i = 0; i < 5; i++) drop(c, 170 + i * 50, 380 - (i % 2) * 60 - i * 12, 14 + (i % 3) * 3, COL.water);
  arrow(c, [[270, 420], [270, 250]]);
  // closed box: lid on, drops under the lid, a green seedling, the water going round
  clearBox(c, 610, 420, 400, 440, () => {
    cotton(c, 810, 800, 170, 40, true);
    seedling(c, 810, 790, 190, COL.leaf, true);
    for (let i = 0; i < 6; i++) drop(c, 660 + i * 60, 470 + (i % 2) * 14, 11, COL.drop);
  });
  shape(c, () => rrect(c, 590, 380, 440, 60, 18), COL.teal);
  shade(c, () => rrect(c, 590, 380, 440, 60, 18), COL.tealDk, 0, 22);
  arrow(c, [[940, 760], [960, 600], [900, 520]]);
  arrow(c, [[690, 520], [650, 620], [680, 760]]);
};

// card 2 · the drain test: plain water, a little washing powder, a lot: the sprouts get shorter, the foam thicker
const drainTest = (c: Ctx) => {
  ground(c);
  const xs = [200, 540, 880], heights = [170, 90, 30], foam = [0, 7, 16];
  shadow(c, 560, 925, 470, 30);
  xs.forEach((x, i) => {
    glass(c, x, 900, 240, 420, 0.42, i ? "#c5daf0" : COL.water);
    cotton(c, x, 740, 92, 26, true);
    const r = rnd(31 + i);
    for (let k = 0; k < 4; k++) {
      const sx = x - 60 + k * 40, h = heights[i] * (0.7 + r() * 0.5);
      if (h > 25) { line(c, [[sx, 735], [sx + 4, 735 - h]], 12, INK); line(c, [[sx, 735], [sx + 4, 735 - h]], 6, i === 2 ? COL.woodDk : COL.leaf); leaf(c, sx + 4, 735 - h, 28 + h * 0.2, -2.3, i === 2 ? COL.woodDk : COL.leaf); leaf(c, sx + 4, 735 - h, 28 + h * 0.2, -0.8, i === 2 ? COL.woodDk : COL.leaf); }
      seed(c, sx, 738, 15, r() * 3, true);
    }
    for (let k = 0; k < foam[i]; k++) { const fx = x - 95 + r() * 190, fy = 745 - r() * 40 - (k > 8 ? 30 : 0); shape(c, () => ell(c, fx, fy, 14 + r() * 10, 12 + r() * 8), WHITE, 4); }
  });
  // the washing powder box, tipped over the third glass; powder falls in
  c.save(); c.translate(880, 330); c.rotate(0.6);
  shape(c, () => rrect(c, -70, -110, 140, 190, 14), COL.blue);
  shade(c, () => rrect(c, -70, -110, 140, 190, 14), COL.blueDk, 40, 0);
  shape(c, () => ell(c, 0, -20, 42, 42), WHITE, 5); shape(c, () => ell(c, -12, -30, 12, 12), COL.sky, 3);
  c.restore();
  const r = rnd(5);
  for (let k = 0; k < 14; k++) shape(c, () => ell(c, 800 + r() * 70, 380 + k * 15 + r() * 12, 5, 5), WHITE, 2.5);
  // a small heap of powder for the little-soap glass, none for the plain one
  shape(c, () => ell(c, 540, 300, 40, 18), WHITE, 5);
  for (let k = 0; k < 7; k++) shape(c, () => ell(c, 515 + k * 8, 292 + (k % 2) * 6, 4, 4), COL.sky, 0);
  write(c, "0", 180, 240, 60); write(c, "1", 450, 240, 60); write(c, "3", 700, 240, 60);
};

// card 3 · the bottle garden: a big corked jar, stones, soil, a money plant, drops on the glass, the water going round
const bottleGarden = (c: Ctx) => {
  ground(c);
  sun(c, 140, 140, 60);
  const x = 280, y = 260, w = 520, h = 660;
  shadow(c, 560, y + h + 10, 300, 30);
  shape(c, () => rrect(c, x, y, w, h, 70), COL.sky, 0);
  // stones, then soil
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 70); c.clip();
  shape(c, () => { c.rect(x, 810, w, 120); }, COL.steelIn, 0);
  const r = rnd(9);
  for (let k = 0; k < 22; k++) { const sx = x + 20 + r() * (w - 40), sy = 830 + r() * 70; shape(c, () => ell(c, sx, sy, 22 + r() * 10, 16 + r() * 6, r()), COL.grey, 4); }
  shape(c, () => { c.moveTo(x, 700); c.quadraticCurveTo(x + w / 2, 670, x + w, 700); c.lineTo(x + w, 830); c.lineTo(x, 830); c.closePath(); }, COL.soil, 5);
  shade(c, () => { c.moveTo(x, 700); c.quadraticCurveTo(x + w / 2, 670, x + w, 700); c.lineTo(x + w, 830); c.lineTo(x, 830); c.closePath(); }, COL.soilDk, 0, 50);
  c.restore();
  // the money plant: a curving stem with heart leaves
  const stem: number[][] = [[520, 690], [500, 600], [540, 500], [500, 400]];
  line(c, stem, 16, INK); line(c, stem, 8, COL.leafDk);
  const heart = (hx: number, hy: number, s: number, an: number) => {
    c.save(); c.translate(hx, hy); c.rotate(an);
    shape(c, () => { c.moveTo(0, s * 1.2); c.bezierCurveTo(-s * 1.3, s * 0.3, -s * 0.9, -s * 0.9, 0, -s * 0.3); c.bezierCurveTo(s * 0.9, -s * 0.9, s * 1.3, s * 0.3, 0, s * 1.2); c.closePath(); }, COL.leaf, 5);
    line(c, [[0, s * 1.1], [0, -s * 0.2]], 3, COL.leafDk);
    c.restore();
  };
  heart(455, 630, 42, 0.9); heart(590, 540, 46, -0.9); heart(455, 450, 44, 0.8); heart(560, 380, 40, -0.6);
  // drops on the inside of the glass
  for (let k = 0; k < 7; k++) drop(c, x + 50 + k * 70, y + 70 + (k % 2) * 30, 11, COL.drop);
  for (let k = 0; k < 4; k++) drop(c, x + 30, 420 + k * 70, 9, COL.drop);
  for (let k = 0; k < 4; k++) drop(c, x + w - 30, 440 + k * 70, 9, COL.drop);
  // the glass itself, and the cork
  shape(c, () => rrect(c, x, y, w, h, 70), "rgba(214,236,250,0.3)", 7);
  shine(c, [[x + 40, y + 120], [x + 40, y + h - 120]], 10);
  shape(c, () => rrect(c, 390, 170, 300, 110, 22), COL.wood);
  shade(c, () => rrect(c, 390, 170, 300, 110, 22), COL.woodDk, 0, 40);
  // the water going round: up from the soil, along the lid, back down the glass
  arrow(c, [[680, 680], [720, 520], [690, 340]]);
  arrow(c, [[390, 340], [350, 520], [380, 680]]);
};

// card 4 · the family care week: a tally chart over 7 days with fewer marks each day, a cloth bag in place of a plastic one
const careWeek = (c: Ctx) => {
  ground(c);
  // the notebook page
  shadow(c, 560, 630, 420, 24);
  shape(c, () => rrect(c, 100, 90, 880, 540, 18), COL.paper);
  for (let k = 0; k < 10; k++) shape(c, () => ell(c, 150 + k * 86, 90, 14, 14), COL.steel, 5);
  line(c, [[100, 190], [980, 190]], 5, COL.grey);
  const counts = [6, 5, 5, 4, 3, 2, 1];
  counts.forEach((n, d) => {
    const cx = 170 + d * 118;
    write(c, String(d + 1), cx - 20, 110, 56, INK, 7);
    for (let k = 0; k < n; k++) line(c, [[cx - 24, 230 + k * 58], [cx - 24, 275 + k * 58]], 7, INK), line(c, [[cx + 0, 230 + k * 58], [cx + 0, 275 + k * 58]], 7, INK), line(c, [[cx + 24, 230 + k * 58], [cx + 24, 275 + k * 58]], 7, INK);
  });
  arrow(c, [[230, 600], [880, 330]], RED, 9);
  // a plastic bag crossed out, a cloth bag chosen
  shape(c, () => polyP(c, [[150, 760], [300, 740], [360, 820], [330, 1000], [170, 1010], [120, 900]]), COL.grey);
  shape(c, () => polyP(c, [[200, 760], [250, 700], [280, 745]]), COL.grey, 5);
  line(c, [[130, 760], [350, 1000]], 14, RED); line(c, [[350, 760], [130, 1000]], 14, RED);
  arrow(c, [[420, 880], [560, 880]], RED, 10);
  shadow(c, 800, 1030, 170, 18);
  shape(c, () => { c.moveTo(690, 720); c.quadraticCurveTo(690, 640, 760, 640); c.quadraticCurveTo(830, 640, 830, 720); }, "rgba(0,0,0,0)", 14);
  shape(c, () => rrect(c, 620, 720, 300, 300, 26), COL.cloth);
  shade(c, () => rrect(c, 620, 720, 300, 300, 26), "#e4dccb", 60, 0);
  leaf(c, 770, 930, 90, -1.9); leaf(c, 770, 930, 80, -0.9);
  line(c, [[770, 930], [770, 990]], 8, COL.leafDk);
};

export const ic_environmentCaringL3Fill = cards("sci.environment.caring.L3 fill", [cover, mainIdea, drainTest, bottleGarden, careWeek]);
