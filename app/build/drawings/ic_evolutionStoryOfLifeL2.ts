import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, seed, person, write, cards } from "./flatKit";

// LIFE BEGAN IN WATER (L2) · set-up cards for the dry-mix test and the sea-water sprouts, then card pictures.
// Labels are drawn, never written: a drop with a red cross = dry, a yellow drop = oil, a blue drop = water,
// white grains in the drop = salt (one grain = a little salty, three = as salty as the sea).

const FLOOR = "#d9c9a8", HAIR = "#3a2a1a", SAND = "#e6cf9a", OIL = "#f5c842", POWDER = "#fffdf7", CRYSTAL = "#dff0fa";

// ---------------------------------------------------------------- small things used on several cards
const drop = (c: Ctx, x: number, y: number, s: number, col: string) =>
  shape(c, () => { c.moveTo(x, y - s); c.quadraticCurveTo(x + s * 0.95, y + s * 0.1, x + s * 0.6, y + s * 0.5); c.arc(x, y + s * 0.5, s * 0.6, 0, Math.PI); c.quadraticCurveTo(x - s * 0.95, y + s * 0.1, x, y - s); c.closePath(); }, col, 4);
// a paper label slip, centre (x, y): dry | oil | water | little | sea
const slip = (c: Ctx, x: number, y: number, kind: string) => {
  shadow(c, x + 8, y + 50, 80, 10);
  shape(c, () => rrect(c, x - 85, y - 45, 170, 90, 8), COL.paper, 5);
  if (kind === "oil") drop(c, x, y - 4, 30, OIL);
  else drop(c, x, y - 4, 30, COL.water);
  if (kind === "dry") line(c, [[x - 32, y + 30], [x + 32, y - 34]], 7, RED);
  const grains = kind === "little" ? [[0, 8]] : kind === "sea" ? [[-9, 2], [9, 2], [0, 16]] : [];
  grains.forEach(([gx, gy]) => shape(c, () => rrect(c, x + gx - 5, y + gy - 5, 10, 10, 2), WHITE, 2));
};
// a teaspoon: handle starts at (x, y) and runs along an for len, the bowl at the far end (tilt turns the bowl)
const spoon = (c: Ctx, x: number, y: number, an: number, len: number, tilt = 0) => {
  const ex = x + Math.cos(an) * len, ey = y + Math.sin(an) * len;
  line(c, [[x, y], [ex, ey]], 20, INK); line(c, [[x, y], [ex, ey]], 11, COL.steel);
  const bx = ex + Math.cos(an) * 30, by = ey + Math.sin(an) * 30;
  shape(c, () => ell(c, bx, by, 38, 25, an + tilt), COL.steel, 5);
  shape(c, () => ell(c, bx, by, 26, 15, an + tilt), COL.steelIn, 0);
  return [bx, by];
};
// a grip patch over a handle at the hand point so the thing looks held
const grip = (c: Ctx, hx: number, hy: number, skin: string = SKIN.child) => shape(c, () => ell(c, hx, hy, 24, 19), skin, 4);
// a kitchen table: top slab at y, legs to the floor
const table = (c: Ctx, x: number, w: number, y: number) => {
  for (const lx of [x + 34, x + w - 34]) { line(c, [[lx, y + 30], [lx, 1000]], 36, INK); line(c, [[lx, y + 30], [lx, 1000]], 24, COL.woodDk); }
  shadow(c, x + w / 2 + 14, y + 52, w / 2, 14);
  shape(c, () => rrect(c, x, y, w, 38, 8), COL.wood); shade(c, () => rrect(c, x, y, w, 38, 8), COL.woodDk, 0, 20);
};
const floor = (c: Ctx) => { c.fillStyle = FLOOR; c.fillRect(0, 1000, D, 80); line(c, [[0, 1000], [D, 1000]], 6); };
// two small heaps side by side inside a katori whose rim centre is (x, y): white baking soda, glassy citric acid
const heaps = (c: Ctx, x: number, y: number, r: number, tint?: string) => {
  const sodaP = () => { c.moveTo(x - r * 0.72, y + 6); c.quadraticCurveTo(x - r * 0.4, y - r * 0.5, x - r * 0.03, y + 6); c.closePath(); };
  const acidP = () => { c.moveTo(x + r * 0.03, y + 6); c.quadraticCurveTo(x + r * 0.4, y - r * 0.46, x + r * 0.74, y + 6); c.closePath(); };
  shape(c, sodaP, tint ?? POWDER, 4);
  shape(c, acidP, tint ?? CRYSTAL, 4);
  if (!tint) { c.save(); c.beginPath(); acidP(); c.clip(); const g = rnd(5); for (let i = 0; i < 14; i++) { const cx = x + r * 0.1 + g() * r * 0.6, cy = y - r * 0.3 + g() * r * 0.3; shape(c, () => rrect(c, cx - 6, cy - 6, 12, 12, 2), WHITE, 2); } c.restore(); }
};
// white fizz: a foam mound over the rim and bubbles climbing out of it
const fizz = (c: Ctx, x: number, y: number, rx: number, s: number) => {
  shape(c, () => { c.moveTo(x - rx, y + 4); c.bezierCurveTo(x - rx * 0.9, y - rx * 0.55, x + rx * 0.9, y - rx * 0.55, x + rx, y + 4); c.closePath(); }, WHITE, 5);
  const g = rnd(s);
  for (let i = 0; i < 12; i++) { const bx = x - rx * 0.8 + g() * rx * 1.6, by = y - rx * 0.05 - g() * rx * 0.3; shape(c, () => ell(c, bx, by, 9 + g() * 6, 9 + g() * 6), WHITE, 3); }
  for (let i = 0; i < 7; i++) { const bx = x - rx * 0.7 + g() * rx * 1.4, by = y - rx * 0.5 - g() * rx * 0.5; const br = 6 + g() * 8; shape(c, () => ell(c, bx, by, br, br), WHITE, 3); }
};
// a white root growing out of a seed at (x, y) toward angle an
const root = (c: Ctx, pts: number[][], w: number) => { line(c, pts, w + 8, INK); line(c, pts, w, COL.paper); };
// moong seeds lying in the bottom of a tumbler whose bottom centre is (x, y)
const seedsInCup = (c: Ctx, x: number, y: number, r: number, s: number) => { const g = rnd(s); for (let i = 0; i < 10; i++) seed(c, x - r * 6.3 + (i % 5) * r * 3.15, y - r * 3.2 + Math.floor(i / 5) * r * 2.4, r, g() * 3); };

// ---------------------------------------------------------------- the dry mix: set-up cards
const E1 = [[300, 300, "dry"], [780, 300, "oil"], [300, 700, "water"], [780, 700, "sea"]] as const;
const e1Card = (c: Ctx, fill: (x: number, y: number, kind: string) => void) => {
  ground(c);
  E1.forEach(([x, y, k]) => { bowl(c, x, y, 150); fill(x, y, k); slip(c, x, y + 180, k); });
};
// 1. four dry katoris with their slips
const setupE1_0 = (c: Ctx) => e1Card(c, () => {});
// 3. half a spoon of each powder in every bowl
const setupE1_2 = (c: Ctx) => e1Card(c, (x, y) => heaps(c, x, y, 150));
// 4. oil poured: no bubbles; water and sea water: fizzing white; dry bowl as it was
const setupE1_3 = (c: Ctx) => e1Card(c, (x, y, k) => {
  if (k === "dry") heaps(c, x, y, 150);
  else if (k === "oil") { shape(c, () => ell(c, x, y, 150, 30), OIL, 5); heaps(c, x, y, 150, "#e9b534"); shine(c, [[x - 90, y - 8], [x - 30, y - 14]], 7); }
  else { shape(c, () => ell(c, x, y, 150, 30), COL.water, 5); fizz(c, x, y, 130, k === "sea" ? 3 : 4); }
});
// 2. stirring a spoon of salt into half a tumbler of water
const setupE1_1 = (c: Ctx) => {
  ground(c); floor(c);
  table(c, 520, 480, 640);
  glass(c, 660, 640, 160, 240, 0.5);
  bowl(c, 880, 560, 62); shape(c, () => { c.moveTo(880 - 44, 564); c.quadraticCurveTo(880, 520, 880 + 44, 564); c.closePath(); }, WHITE, 4);
  const h = person(c, 330, 1000, 640, { reachR: [550, 475] });
  const [bx, by] = spoon(c, h.handR[0], h.handR[1], 0.76, 110, 0.3);
  grip(c, h.handR[0] + 8, h.handR[1] + 6);
  // a few grains still falling off the spoon into the water, and the stirring turn
  for (const [gx, gy] of [[bx + 16, by + 28], [bx - 10, by + 34], [bx + 30, by + 44]]) shape(c, () => rrect(c, gx - 5, gy - 5, 10, 10, 2), WHITE, 2);
  arrow(c, [[590, 380], [630, 358], [690, 358], [730, 380]]);
};
// 5. water drips into the oil bowl: a cut-away of the katori
const setupE1_4 = (c: Ctx) => {
  ground(c);
  const outer = () => { c.moveTo(170, 400); c.lineTo(190, 640); c.bezierCurveTo(200, 800, 880, 800, 890, 640); c.lineTo(910, 400); c.closePath(); };
  const inner = () => { c.moveTo(205, 420); c.lineTo(222, 640); c.bezierCurveTo(232, 762, 848, 762, 858, 640); c.lineTo(875, 420); c.closePath(); };
  shadow(c, 560, 790, 360, 30);
  shape(c, outer, COL.steel); shade(c, outer, COL.steelDk, 40, 0);
  shape(c, inner, COL.steelDk, 0);
  c.save(); c.beginPath(); inner(); c.clip();
  c.fillStyle = POWDER; c.fillRect(150, 690, 800, 200);
  c.fillStyle = OIL; c.fillRect(150, 470, 800, 220);
  line(c, [[150, 690], [950, 690]], 4); line(c, [[150, 470], [950, 470]], 4);
  // bubbles climbing from the powder up through the oil
  for (const [bx, i0] of [[400, 0], [640, 1]]) for (let i = 0; i < 5; i++) { const r = 8 + i * 4, by = 672 - i * 46; shape(c, () => ell(c, bx + (i % 2 ? 14 : -10) + i0 * 8, by, r, r), WHITE, 3); }
  // two drops already sinking through the oil
  drop(c, 520, 545, 26, COL.water); drop(c, 548, 630, 26, COL.water);
  c.restore();
  shape(c, inner, "rgba(0,0,0,0)", 6);
  // foam where the bubbles reach the oil surface
  for (const [fx, fy] of [[380, 462], [412, 452], [444, 464], [620, 458], [652, 450], [684, 462]]) shape(c, () => ell(c, fx, fy, 14, 14), WHITE, 3);
  // the spoon tipping water in from above
  const [bx, by] = spoon(c, 870, 180, Math.PI * 0.82, 230, -0.55);
  drop(c, bx - 20, by + 60, 24, COL.water); drop(c, 540, 390, 24, COL.water);
  arrow(c, [[600, 520], [600, 650]]); arrow(c, [[300, 660], [300, 520]]);
};

// ---------------------------------------------------------------- sea-water sprouts: set-up cards
// 1. ten moong in each of three waters
const setupE2_0 = (c: Ctx) => {
  ground(c);
  [[200, "water"], [540, "little"], [880, "sea"]].forEach(([x, k], i) => { glass(c, x as number, 700, 220, 260, 0.3); seedsInCup(c, x as number, 700, 11, i + 1); slip(c, x as number, 830, k as string); });
};
// 2. covered with small steel plates on a shelf
const setupE2_1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 790, 480, 20);
  shape(c, () => rrect(c, 60, 720, 960, 44, 6), COL.wood); shade(c, () => rrect(c, 60, 720, 960, 44, 6), COL.woodDk, 0, 22);
  for (const bx of [220, 860]) shape(c, () => polyP(c, [[bx - 40, 764], [bx + 40, 764], [bx, 860]]), COL.woodDk, 5);
  [200, 540, 880].forEach((x, i) => { glass(c, x, 720, 220, 260, 0.3); seedsInCup(c, x, 720, 11, i + 1); plate(c, x + 4, 462, 140, 34); });
};
// 3. day 3: long white roots in the plain cup, closed seeds in the sea cup
const setupE2_2 = (c: Ctx) => {
  ground(c);
  glass(c, 290, 760, 340, 380, 0.25); glass(c, 790, 760, 340, 380, 0.25);
  const P: [number, number, number[][]][] = [
    [190, 700, [[210, 660], [250, 620], [290, 600]]], [260, 730, [[300, 700], [340, 680]]], [330, 690, [[360, 650], [380, 600]]],
    [220, 745, [[200, 700], [185, 660]]], [380, 735, [[400, 690], [430, 660]]], [300, 745, [[310, 700]]],
  ];
  P.forEach(([x, y, pts]) => root(c, [[x, y], ...pts], 9));
  P.forEach(([x, y], i) => seed(c, x, y, 22, 0.4 + i * 0.9, true));
  const g = rnd(9);
  for (let i = 0; i < 10; i++) seed(c, 690 + (i % 5) * 50, 705 + Math.floor(i / 5) * 40, 18, g() * 3);
  slip(c, 290, 890, "water"); slip(c, 790, 890, "sea");
};

// ---------------------------------------------------------------- card pictures
// the dry mix: tipping water from a spoon into a katori, which fizzes at once
const flowE1 = (c: Ctx) => {
  ground(c); floor(c);
  table(c, 440, 600, 620);
  bowl(c, 640, 523, 130); shape(c, () => ell(c, 640, 523, 130, 26), COL.water, 5); fizz(c, 640, 523, 110, 6);
  glass(c, 900, 620, 120, 180, 0.5);
  const h = person(c, 250, 1000, 640, { reachR: [455, 455] });
  const [bx, by] = spoon(c, h.handR[0], h.handR[1], 0.4, 100, 0.45);
  grip(c, h.handR[0] + 8, h.handR[1] + 4);
  drop(c, bx + 6, by + 40, 16, COL.water);
  arrow(c, [[bx + 50, by - 10], [bx + 50, by + 60]]);
};
// sea-water sprouts: pointing at the cup where the moong sprouted
const flowE2 = (c: Ctx) => {
  ground(c); floor(c);
  table(c, 440, 600, 620);
  [590, 775, 960].forEach((x, i) => { glass(c, x, 620, 140, 180, 0.3); if (i < 2) { const r: number[][][] = i === 0 ? [[[560, 590], [575, 560], [600, 545]], [[610, 598], [630, 570], [650, 560]], [[585, 600], [580, 568]]] : [[[760, 592], [775, 565]]]; r.forEach((p) => root(c, p, 7)); } seedsInCup(c, x, 620, 8, i + 10); });
  person(c, 250, 1000, 640, { reachR: [464, 563] });
};
// the Year of Life: twelve boxes, tiny cells from April to October, everything big crowded into the end
const flowA1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1000, 460, 20);
  shape(c, () => rrect(c, 90, 80, 900, 920, 10), COL.paper, 5);
  for (let m = 0; m < 12; m++) {
    const col = m % 3, row = Math.floor(m / 3), x = 128 + col * 290, y = 118 + row * 218, w = 265, h = 196, cells = m >= 3 && m <= 9;
    shape(c, () => rrect(c, x, y, w, h, 6), cells ? COL.sky : WHITE, 4);
    write(c, String(m + 1), x + 14, y + 12, 34, INK, 5);
    if (cells) { const g = rnd(m); for (let i = 0; i < 7; i++) { const cx = x + 50 + g() * (w - 100), cy = y + 70 + g() * (h - 100); shape(c, () => ell(c, cx, cy, 7, 7), COL.teal, 2.5); } }
    if (m === 0) { shape(c, () => ell(c, x + w / 2 + 20, y + h / 2 + 10, 46, 46), COL.orange, 5); shade(c, () => ell(c, x + w / 2 + 20, y + h / 2 + 10, 46, 46), COL.red, 18, 12); for (let i = 0; i < 6; i++) { const a = i * 1.05 + 0.3; line(c, [[x + w / 2 + 20 + Math.cos(a) * 58, y + h / 2 + 10 + Math.sin(a) * 58], [x + w / 2 + 20 + Math.cos(a) * 76, y + h / 2 + 10 + Math.sin(a) * 76]], 5, COL.red); } }
    if (m === 2) { shape(c, () => ell(c, x + w / 2 + 20, y + h / 2 + 12, 90, 52), COL.water, 4); for (let i = 0; i < 5; i++) shape(c, () => ell(c, x + w / 2 - 30 + i * 25, y + h / 2 + 14 + (i % 2) * 14, 7, 7), COL.teal, 2.5); }
    if (m === 10) { shape(c, () => ell(c, x + w / 2 + 20, y + h / 2 + 14, 70, 32), COL.pink, 4); for (let i = -4; i <= 4; i++) line(c, [[x + w / 2 + 20 + i * 14, y + h / 2 - 12], [x + w / 2 + 20 + i * 14, y + h / 2 + 40]], 3, "#c9607f"); }
    if (m === 11) {
      // a dinosaur, a flower and a person squeezed into the last box
      const dx = x + 70, dy = y + 120;
      shape(c, () => { c.moveTo(dx - 40, dy); c.quadraticCurveTo(dx - 20, dy - 40, dx + 20, dy - 30); c.lineTo(dx + 40, dy - 75); c.lineTo(dx + 58, dy - 70); c.lineTo(dx + 48, dy - 40); c.quadraticCurveTo(dx + 50, dy, dx + 10, dy + 10); c.lineTo(dx - 20, dy + 10); c.lineTo(dx - 60, dy + 30); c.closePath(); }, COL.green, 4);
      for (const lx of [dx - 14, dx + 14]) line(c, [[lx, dy + 8], [lx, dy + 34]], 9, COL.greenDk);
      const fx = x + 160, fy = y + 120;
      line(c, [[fx, fy + 44], [fx, fy]], 5, COL.leafDk); for (let i = 0; i < 6; i++) shape(c, () => ell(c, fx + Math.cos(i * 1.047) * 16, fy + Math.sin(i * 1.047) * 16, 9, 9), COL.pink, 3); shape(c, () => ell(c, fx, fy, 8, 8), COL.yellow, 3);
      person(c, x + 230, y + 178, 78);
    }
  }
};
// how small the first life was: a hair drawn huge, fifty tiny cells across it, a lens to see them
const flowA2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1000, 460, 20);
  shape(c, () => rrect(c, 70, 90, 940, 900, 10), WHITE, 5);
  const hairP = () => { c.moveTo(70, 440); c.bezierCurveTo(400, 390, 700, 420, 1010, 380); c.lineTo(1010, 660); c.bezierCurveTo(700, 700, 400, 670, 70, 720); c.closePath(); };
  c.save(); c.beginPath(); rrect(c, 70, 90, 940, 900, 10); c.clip(); shape(c, hairP, HAIR, 6); shade(c, hairP, "#1e1208", 0, 40, 0.5); c.restore();
  // the row of 50 cells across the hair's width at x = 330
  const top = 430, bot = 701;
  for (let i = 0; i < 50; i++) { const y = top + 2.7 + ((bot - top - 5.4) * i) / 49; shape(c, () => ell(c, 330, y, 2.5, 2.5), COL.teal, 1); }
  // the lens over part of the row, showing seven of them big
  const lx = 700, ly = 545, lr = 190;
  shadow(c, lx + 20, ly + 20, lr, lr * 0.9);
  c.save(); c.beginPath(); ell(c, lx, ly, lr, lr); c.clip();
  c.fillStyle = HAIR; c.fillRect(lx - lr, ly - lr, lr * 2, lr * 2);
  for (let i = 0; i < 7; i++) shape(c, () => ell(c, lx, ly - 150 + i * 50, 22, 22), COL.teal, 4);
  c.restore();
  shape(c, () => ell(c, lx, ly, lr, lr), "rgba(0,0,0,0)", 16);
  line(c, [[lx + lr * 0.72, ly + lr * 0.72], [lx + lr * 1.25, ly + lr * 1.25]], 44, INK); line(c, [[lx + lr * 0.72, ly + lr * 0.72], [lx + lr * 1.25, ly + lr * 1.25]], 30, COL.wood);
  line(c, [[345, 500], [lx - lr - 6, 420]], 5, COL.greyDk); line(c, [[345, 640], [lx - lr - 6, 670]], 5, COL.greyDk);
  // the pencil dot beside the hair, for comparison
  shape(c, () => ell(c, 220, 860, 7, 7), INK, 0);
};
// a crab on a steel plate, top view; the child points at its legs to count them
const crab = (c: Ctx, x: number, y: number, s: number) => {
  const legs = (side: number) => { for (let i = 0; i < 4; i++) { const p = [[x + side * 70 * s, y - 25 * s + i * 20 * s], [x + side * 125 * s, y - 55 * s + i * 32 * s], [x + side * 160 * s, y - 20 * s + i * 34 * s]]; line(c, p, 16 * s, INK); line(c, p, 9 * s, "#e8703f"); } };
  legs(-1); legs(1);
  for (const side of [-1, 1]) {
    const p = [[x + side * 50 * s, y - 50 * s], [x + side * 90 * s, y - 100 * s]]; line(c, p, 18 * s, INK); line(c, p, 11 * s, "#e8703f");
    const px = x + side * 108 * s, py = y - 122 * s;
    shape(c, () => ell(c, px, py, 30 * s, 20 * s, side * 0.6), "#e8703f", 4);
    line(c, [[px + side * 22 * s, py - 16 * s], [px + side * 8 * s, py - 2 * s], [px + side * 26 * s, py + 6 * s]], 4 * s, INK);
  }
  const body = () => ell(c, x, y, 95 * s, 66 * s);
  shape(c, body, "#e8703f", 5); shade(c, body, "#c44f2a", 22 * s, 14 * s);
  for (const side of [-1, 1]) { line(c, [[x + side * 24 * s, y - 56 * s], [x + side * 30 * s, y - 86 * s]], 6 * s, INK); shape(c, () => ell(c, x + side * 30 * s, y - 90 * s, 11 * s, 11 * s), WHITE, 3); shape(c, () => ell(c, x + side * 30 * s, y - 90 * s, 5 * s, 5 * s), INK, 0); }
};
const flowA3 = (c: Ctx) => {
  ground(c); floor(c);
  table(c, 440, 600, 620);
  plate(c, 740, 560, 240, 72);
  crab(c, 740, 560, 1);
  person(c, 250, 1000, 640, { reachR: [486, 574] });
};
// the shoebox sea: a box on its side, blue inside, with seaweed, dough domes and the strange animals
const stromatolite = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const dome = () => { c.moveTo(x - w / 2, y); c.bezierCurveTo(x - w / 2, y - h * 1.35, x + w / 2, y - h * 1.35, x + w / 2, y); c.closePath(); };
  shape(c, dome, "#b8905c", 5);
  c.save(); c.beginPath(); dome(); c.clip(); for (let i = 1; i < 5; i++) { const t = i / 5; c.beginPath(); c.moveTo(x - w / 2, y - h * t * 0.1); c.bezierCurveTo(x - w / 2, y - h * (t + 0.35) * 0.9 - h * t * 0.1, x + w / 2, y - h * (t + 0.35) * 0.9 - h * t * 0.1, x + w / 2, y - h * t * 0.1); c.strokeStyle = "#8a6238"; c.lineWidth = 4; c.stroke(); } c.restore();
};
const flowP1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 870, 440, 24);
  shape(c, () => rrect(c, 110, 170, 860, 690, 10), COL.brown, 6);
  const inside = () => rrect(c, 160, 220, 760, 590, 6);
  shape(c, inside, COL.water, 5);
  c.save(); c.beginPath(); inside(); c.clip();
  c.fillStyle = SAND; c.fillRect(160, 720, 760, 100); line(c, [[160, 720], [920, 720]], 4);
  shine(c, [[200, 260], [420, 250]], 8); shine(c, [[600, 290], [760, 282]], 8);
  // seaweed ribbons
  for (const [sx, sh] of [[230, 300], [760, 260], [860, 200]]) { const p: number[][] = []; for (let i = 0; i <= 8; i++) p.push([sx + Math.sin(i * 1.1) * 18, 724 - (sh * i) / 8]); line(c, p, 18, INK); line(c, p, 11, COL.leaf); }
  // dough domes (stromatolites)
  stromatolite(c, 310, 724, 150, 70); stromatolite(c, 840, 724, 120, 55);
  // Dickinsonia: a flat oval with ridges, lying on the floor
  shape(c, () => ell(c, 560, 740, 110, 40), COL.pink, 5); line(c, [[450, 740], [670, 740]], 3, "#c9607f"); for (let i = -4; i <= 4; i++) line(c, [[560 + i * 22, 710 + Math.abs(i) * 3], [560 + i * 22, 770 - Math.abs(i) * 3]], 3, "#c9607f");
  // Charnia: a frond on a stalk
  line(c, [[430, 724], [430, 660]], 8, INK); line(c, [[430, 724], [430, 660]], 4, COL.greenDk);
  shape(c, () => ell(c, 430, 560, 42, 110), COL.greenLt, 5); line(c, [[430, 460], [430, 660]], 3, COL.greenDk); for (let i = 0; i < 8; i++) { const y = 480 + i * 22, w = 36 * Math.sin(((i + 1) / 9) * Math.PI); line(c, [[430 - w, y + 8], [430, y]], 3, COL.greenDk); line(c, [[430 + w, y + 8], [430, y]], 3, COL.greenDk); }
  // trilobite on the floor: a segmented oval with a round head
  shape(c, () => ell(c, 690, 700, 48, 70), COL.greyDk, 5); shape(c, () => ell(c, 690, 648, 46, 26), COL.greyDk, 4); line(c, [[690, 650], [690, 765]], 3, INK); for (let i = 0; i < 6; i++) line(c, [[650 + i * 2, 672 + i * 16], [730 - i * 2, 672 + i * 16]], 3, INK); for (const s of [-1, 1]) shape(c, () => ell(c, 690 + s * 22, 644, 7, 7), WHITE, 2.5);
  // Opabinia hanging on a thread from the lid: a lobed body, five eyes, a long trunk with a claw
  line(c, [[600, 220], [600, 400]], 3, INK);
  shape(c, () => ell(c, 600, 420, 90, 24), COL.purple, 5); for (let i = -3; i <= 3; i++) line(c, [[600 + i * 22, 404], [600 + i * 22, 436]], 3, "#6b4ea5");
  shape(c, () => ell(c, 520, 416, 34, 22), COL.purple, 4); for (let i = 0; i < 5; i++) shape(c, () => ell(c, 500 + i * 10, 398 - Math.abs(i - 2) * 4, 5, 5), WHITE, 2);
  line(c, [[492, 424], [460, 440], [444, 470]], 9, INK); line(c, [[492, 424], [460, 440], [444, 470]], 5, COL.purple); line(c, [[436, 460], [444, 470], [454, 466]], 4, INK);
  c.restore();
};
// dissolve: a spoon of sugar stirred into a tumbler, its grains fading away in the water
const term1 = (c: Ctx) => {
  ground(c);
  glass(c, 540, 860, 380, 500, 0.65);
  const [bx, by] = spoon(c, 770, 300, Math.PI * 0.72, 300, 0);
  const g = rnd(21);
  for (let i = 0; i < 40; i++) { const t = g(), r = 9 - t * 7, gx = bx - 40 + (g() - 0.3) * 200 * t + g() * 50, gy = by + 10 + t * 220 + g() * 30; if (r > 1.5) shape(c, () => rrect(c, gx - r, gy - r, r * 2, r * 2, 2), WHITE, 2); }
  arrow(c, [[410, 300], [470, 262], [600, 262], [660, 300]]);
};
// a cell: a thin skin round a watery inside, floating in blue water with a few others
const cellP = (c: Ctx, x: number, y: number, r: number) => {
  const body = () => ell(c, x, y, r, r * 0.92);
  shape(c, body, "#d8eefb", Math.max(3, r * 0.03));
  shape(c, () => ell(c, x, y, r - r * 0.07, r * 0.92 - r * 0.07), "rgba(0,0,0,0)", Math.max(2, r * 0.015));
  shine(c, [[x - r * 0.6, y - r * 0.45], [x - r * 0.3, y - r * 0.68]], r * 0.05);
  const g = rnd(Math.round(r)); for (let i = 0; i < 6; i++) { const a = g() * 6.28, d = g() * r * 0.6, br = r * (0.03 + g() * 0.04); shape(c, () => ell(c, x + Math.cos(a) * d, y + Math.sin(a) * d, br, br), "#a9d2ee", 2); }
};
const term2 = (c: Ctx) => {
  ground(c, COL.water);
  for (const [wx, wy] of [[120, 160], [760, 120], [160, 900], [820, 960]]) line(c, [[wx, wy], [wx + 60, wy - 14], [wx + 120, wy], [wx + 180, wy - 14]], 6, COL.waterDk);
  cellP(c, 160, 240, 60); cellP(c, 920, 200, 46); cellP(c, 900, 880, 56);
  cellP(c, 540, 560, 320);
};
// a fossil: a grey rock with a spiral shell pressed into it
const term3 = (c: Ctx) => {
  ground(c);
  shadow(c, 580, 900, 420, 40);
  const rock = () => polyP(c, [[150, 560], [250, 300], [460, 200], [720, 190], [900, 330], [960, 600], [820, 860], [520, 900], [250, 820]]);
  shape(c, rock, COL.grey, 6); shade(c, rock, COL.greyDk, 60, 40, 0.45);
  const cx = 540, cy = 545, pts: number[][] = [];
  for (let t = 0; t <= Math.PI * 5.6; t += 0.08) { const r = 14 + t * 14; pts.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r * 0.9]); }
  line(c, pts, 16, COL.greyDk); line(c, pts, 7, "#8d8880");
  for (let t = Math.PI * 2.2; t <= Math.PI * 5.5; t += 0.22) { const r1 = 14 + t * 14 - 8, r2 = 14 + (t + Math.PI * 2) * 14 - 24; if (r2 > 14 + Math.PI * 5.6 * 14) continue; line(c, [[cx + Math.cos(t) * r1, cy + Math.sin(t) * r1 * 0.9], [cx + Math.cos(t + 0.1) * r2, cy + Math.sin(t + 0.1) * r2 * 0.9]], 4, COL.greyDk); }
};
// life began in water: a shallow sea long ago, cell mats on the floor, a bare red shore
const expl1 = (c: Ctx) => {
  ground(c, "#f9dfb6");
  shape(c, () => ell(c, 200, 180, 80, 80), COL.yellow, 5);
  c.fillStyle = COL.water; c.fillRect(0, 400, D, 680);
  line(c, [[0, 400], [D, 400]], 5);
  c.fillStyle = SAND; c.fillRect(0, 820, D, 260); line(c, [[0, 820], [D, 820]], 5);
  for (const [x, w, h] of [[150, 230, 110], [400, 170, 80], [630, 260, 130]]) stromatolite(c, x, 820, w, h);
  const g = rnd(4); for (let i = 0; i < 14; i++) { const bx = 80 + g() * 780, by = 450 + g() * 300; shape(c, () => ell(c, bx, by, 5, 5), COL.drop, 2); }
  const shore = () => polyP(c, [[790, 820], [860, 700], [900, 560], [960, 440], [1000, 300], [1080, 240], [1080, 1080], [790, 1080]]);
  shape(c, shore, "#c0543a", 6); shade(c, shore, "#8e3a26", 30, 30, 0.45);
  for (const [rx, ry] of [[950, 520], [1010, 420], [880, 680], [1030, 640], [960, 760]]) shape(c, () => ell(c, rx, ry, 30, 18), "#c0543a", 5);
  shine(c, [[60, 430], [260, 430]], 8); shine(c, [[400, 440], [560, 440]], 8);
};

export const ic_evolutionStoryOfLifeL2 = cards("sci.evolution.story-of-life.L2", [
  setupE1_0, setupE1_1, setupE1_2, setupE1_3, setupE1_4, setupE2_0, setupE2_1, setupE2_2,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowP1, term1, term2, term3, expl1,
]);
