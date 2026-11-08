import type { Ctx } from "./core";
import { D, INK, BG, SH, WHITE, RED, COL, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, plate, bowl, seed, leaf, hand, person, write, cards } from "./flatKit";

// ANIMAL LIFE CYCLES L4 · set-up cards for the Survival Cup dice game, then flow cards and a few
// term pictures. Flat kit look: bold ink outline, flat colours, one shade tone, soft shadow.

const TAN = "#d9a86a", TAN_DK = "#b07f45", GREY = "#9aa0ad", GREY_DK = "#737a88", BROWN = "#b8743a", BROWN_DK = "#8f5526";
const SAND = "#e8cf96", SAND_DK = "#cfae6b", GREEN_OK = "#3f9a4a", STRING = "#b4473a";

// ---------------------------------------------------------------- small things
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 14, y + h + 6, w * 0.5, 14); shape(c, () => rrect(c, x, y, w, h, 10), COL.paper, 6); };
// a chana (chickpea): a round tan seed
const chana = (c: Ctx, x: number, y: number, r = 14, rot = 0) => seed(c, x, y, r, rot, false, TAN, TAN_DK);
const chanaHeap = (c: Ctx, x: number, y: number, rx: number, ry: number, n: number, sd: number) => { const r = rnd(sd); for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.8; chana(c, x + Math.cos(a) * rx * d, y + Math.sin(a) * ry * d, 15, r() * 3); } };
// a die face seen from above: white, black pips
const die = (c: Ctx, x: number, y: number, s: number, n: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -s / 2, -s / 2, s, s, s * 0.18), WHITE, Math.max(3, s * 0.07));
  const q = s * 0.27, P: Record<number, number[][]> = { 1: [[0, 0]], 2: [[-q, -q], [q, q]], 3: [[-q, -q], [0, 0], [q, q]], 4: [[-q, -q], [q, -q], [-q, q], [q, q]], 5: [[-q, -q], [q, -q], [0, 0], [-q, q], [q, q]], 6: [[-q, -q], [q, -q], [-q, 0], [q, 0], [-q, q], [q, q]] };
  P[n].forEach(([px, py]) => shape(c, () => ell(c, px, py, s * 0.09, s * 0.09), INK, 0));
  c.restore();
};
const tick = (c: Ctx, x: number, y: number, s: number) => line(c, [[x - s * 0.4, y], [x - s * 0.1, y + s * 0.3], [x + s * 0.45, y - s * 0.4]], s * 0.2, GREEN_OK);
const cross = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - s * 0.35, y - s * 0.35], [x + s * 0.35, y + s * 0.35]], s * 0.2, RED); line(c, [[x + s * 0.35, y - s * 0.35], [x - s * 0.35, y + s * 0.35]], s * 0.2, RED); };
const egg = (c: Ctx, x: number, y: number, r: number, rot = 0, col = WHITE) => shape(c, () => { c.save(); c.translate(x, y); c.rotate(rot); c.moveTo(0, -r * 1.25); c.bezierCurveTo(r * 1.05, -r * 1.1, r * 1.05, r * 0.9, 0, r); c.bezierCurveTo(-r * 1.05, r * 0.9, -r * 1.05, -r * 1.1, 0, -r * 1.25); c.restore(); }, col, Math.max(3, r * 0.16));
const eye = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), WHITE, Math.max(2, r * 0.25)); shape(c, () => ell(c, x + r * 0.15, y, r * 0.5, r * 0.5), INK, 0); };

// ---------------------------------------------------------------- animal icons, centre (x, y), size s (1 = about 110 px wide), facing right
const frogIcon = (c: Ctx, x: number, y: number, s: number) => {
  for (const k of [-1, 1]) shape(c, () => ell(c, x + k * 46 * s, y + 14 * s, 22 * s, 15 * s), COL.greenDk, 4 * s);
  shape(c, () => ell(c, x, y, 50 * s, 34 * s), COL.green, 5 * s);
  shape(c, () => ell(c, x, y + 10 * s, 30 * s, 16 * s), COL.greenLt, 0);
  for (const k of [-1, 1]) { shape(c, () => ell(c, x + k * 24 * s, y + 32 * s, 13 * s, 7 * s), COL.greenDk, 3.5 * s); shape(c, () => ell(c, x + k * 22 * s, y - 30 * s, 14 * s, 14 * s), COL.green, 4 * s); eye(c, x + k * 22 * s, y - 30 * s, 8 * s); }
  c.beginPath(); c.arc(x, y - 6 * s, 20 * s, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 3.5 * s; c.stroke();
};
const henIcon = (c: Ctx, x: number, y: number, s: number, legs = true) => {
  if (legs) for (const k of [-1, 1]) { line(c, [[x + k * 10 * s, y + 30 * s], [x + k * 12 * s, y + 58 * s]], 5 * s, INK); line(c, [[x + k * 10 * s, y + 30 * s], [x + k * 12 * s, y + 58 * s]], 2.5 * s, COL.orange); for (const t of [-1, 0, 1]) line(c, [[x + k * 12 * s, y + 58 * s], [x + k * 12 * s + t * 10 * s + 6 * s, y + 66 * s]], 3 * s, COL.orange); }
  shape(c, () => polyP(c, [[x - 30 * s, y - 10 * s], [x - 70 * s, y - 50 * s], [x - 52 * s, y - 8 * s], [x - 82 * s, y - 24 * s], [x - 46 * s, y + 10 * s]]), BROWN_DK, 4 * s);
  shape(c, () => ell(c, x, y, 50 * s, 36 * s), BROWN, 5 * s);
  shape(c, () => ell(c, x - 4 * s, y + 2 * s, 30 * s, 20 * s, 0.3), BROWN_DK, 0);
  shape(c, () => ell(c, x + 40 * s, y - 40 * s, 21 * s, 21 * s), BROWN, 5 * s);
  for (const k of [-1, 0, 1]) shape(c, () => ell(c, x + 40 * s + k * 9 * s, y - 62 * s, 7 * s, 9 * s), RED, 3 * s);
  shape(c, () => polyP(c, [[x + 58 * s, y - 46 * s], [x + 80 * s, y - 38 * s], [x + 58 * s, y - 30 * s]]), COL.yellow, 3.5 * s);
  shape(c, () => ell(c, x + 54 * s, y - 22 * s, 6 * s, 9 * s), RED, 3 * s);
  eye(c, x + 46 * s, y - 46 * s, 5 * s);
};
const elephantIcon = (c: Ctx, x: number, y: number, s: number) => {
  for (const lx of [-38, -14, 10, 32]) shape(c, () => rrect(c, x + lx * s, y + 16 * s, 20 * s, 44 * s, 6 * s), GREY, 4 * s);
  line(c, [[x - 56 * s, y - 10 * s], [x - 74 * s, y + 20 * s]], 4 * s, INK);
  shape(c, () => ell(c, x, y, 60 * s, 42 * s), GREY, 5 * s);
  shape(c, () => ell(c, x + 50 * s, y - 20 * s, 30 * s, 28 * s), GREY, 5 * s);
  shape(c, () => ell(c, x + 36 * s, y - 16 * s, 16 * s, 24 * s), GREY_DK, 4 * s);
  line(c, [[x + 72 * s, y - 6 * s], [x + 86 * s, y + 20 * s], [x + 78 * s, y + 48 * s]], 16 * s, INK); line(c, [[x + 72 * s, y - 6 * s], [x + 86 * s, y + 20 * s], [x + 78 * s, y + 48 * s]], 10 * s, GREY);
  line(c, [[x + 66 * s, y + 4 * s], [x + 78 * s, y + 14 * s]], 5 * s, WHITE);
  eye(c, x + 58 * s, y - 28 * s, 5 * s);
};
const mouseIcon = (c: Ctx, x: number, y: number, s: number) => {
  line(c, [[x - 32 * s, y + 4 * s], [x - 62 * s, y + 10 * s], [x - 84 * s, y - 14 * s]], 5 * s, INK); line(c, [[x - 32 * s, y + 4 * s], [x - 62 * s, y + 10 * s], [x - 84 * s, y - 14 * s]], 2.5 * s, COL.pink);
  shape(c, () => ell(c, x, y, 36 * s, 24 * s), COL.grey, 5 * s);
  shape(c, () => ell(c, x + 14 * s, y - 20 * s, 12 * s, 12 * s), COL.grey, 4 * s); shape(c, () => ell(c, x + 14 * s, y - 20 * s, 6 * s, 6 * s), COL.pink, 0);
  shape(c, () => ell(c, x + 36 * s, y - 2 * s, 5 * s, 4 * s), COL.pink, 2.5 * s);
  eye(c, x + 22 * s, y - 6 * s, 4.5 * s);
  for (const lx of [-16, 12]) shape(c, () => ell(c, x + lx * s, y + 24 * s, 8 * s, 4 * s), COL.pink, 2.5 * s);
};
const dogIcon = (c: Ctx, x: number, y: number, s: number) => {
  for (const lx of [-36, -18, 12, 30]) shape(c, () => rrect(c, x + lx * s, y + 14 * s, 14 * s, 40 * s, 5 * s), TAN, 4 * s);
  line(c, [[x - 50 * s, y - 6 * s], [x - 72 * s, y - 36 * s]], 9 * s, INK); line(c, [[x - 50 * s, y - 6 * s], [x - 72 * s, y - 36 * s]], 5 * s, TAN);
  shape(c, () => ell(c, x, y, 52 * s, 30 * s), TAN, 5 * s);
  shape(c, () => ell(c, x - 10 * s, y - 4 * s, 22 * s, 16 * s, 0.4), TAN_DK, 0);
  shape(c, () => ell(c, x + 46 * s, y - 26 * s, 24 * s, 22 * s), TAN, 5 * s);
  shape(c, () => ell(c, x + 66 * s, y - 16 * s, 14 * s, 10 * s), TAN, 4 * s);
  shape(c, () => ell(c, x + 32 * s, y - 24 * s, 9 * s, 20 * s, 0.2), TAN_DK, 4 * s);
  shape(c, () => ell(c, x + 78 * s, y - 18 * s, 5 * s, 4 * s), INK, 0);
  eye(c, x + 54 * s, y - 32 * s, 4.5 * s);
};
const tortoiseIcon = (c: Ctx, x: number, y: number, s: number) => {
  for (const lx of [-34, 28]) shape(c, () => rrect(c, x + lx * s, y + 10 * s, 18 * s, 30 * s, 6 * s), "#8a9a5a", 4 * s);
  shape(c, () => ell(c, x + 58 * s, y + 4 * s, 18 * s, 13 * s), "#8a9a5a", 4 * s); eye(c, x + 64 * s, y, 4 * s);
  shape(c, () => { c.moveTo(x - 56 * s, y + 12 * s); c.bezierCurveTo(x - 56 * s, y - 50 * s, x + 56 * s, y - 50 * s, x + 56 * s, y + 12 * s); c.closePath(); }, "#6f8f3e", 5 * s);
  for (const [px, py, r] of [[-22, -8, 11], [4, -22, 12], [28, -6, 10], [0, 0, 9]]) shape(c, () => ell(c, x + px * s, y + py * s, r * s, r * s * 0.8), "#4f6b2a", 3 * s);
  shape(c, () => rrect(c, x - 60 * s, y + 8 * s, 120 * s, 12 * s, 5 * s), "#c9a85a", 4 * s);
};
const cowIcon = (c: Ctx, x: number, y: number, s: number) => {
  for (const lx of [-40, -20, 14, 34]) shape(c, () => rrect(c, x + lx * s, y + 18 * s, 16 * s, 42 * s, 5 * s), WHITE, 4 * s);
  line(c, [[x - 56 * s, y - 8 * s], [x - 74 * s, y + 26 * s]], 5 * s, INK);
  shape(c, () => ell(c, x, y, 58 * s, 36 * s), WHITE, 5 * s);
  shape(c, () => ell(c, x - 16 * s, y - 6 * s, 20 * s, 16 * s, 0.5), INK, 0); shape(c, () => ell(c, x + 24 * s, y + 12 * s, 14 * s, 10 * s, -0.4), INK, 0);
  shape(c, () => ell(c, x + 14 * s, y + 34 * s, 14 * s, 8 * s), COL.pink, 3 * s);
  shape(c, () => ell(c, x + 50 * s, y - 24 * s, 24 * s, 22 * s), WHITE, 5 * s);
  for (const k of [-1, 1]) shape(c, () => ell(c, x + 50 * s + k * 24 * s, y - 36 * s, 10 * s, 6 * s, k * 0.4), WHITE, 4 * s);
  for (const k of [-1, 1]) line(c, [[x + 50 * s + k * 10 * s, y - 44 * s], [x + 50 * s + k * 16 * s, y - 58 * s]], 5 * s, INK);
  shape(c, () => ell(c, x + 66 * s, y - 12 * s, 14 * s, 10 * s), COL.pink, 4 * s);
  eye(c, x + 56 * s, y - 28 * s, 4.5 * s);
};
const butterflyIcon = (c: Ctx, x: number, y: number, s: number) => {
  for (const k of [-1, 1]) { shape(c, () => ell(c, x + k * 30 * s, y - 14 * s, 30 * s, 24 * s, k * 0.5), COL.orange, 4 * s); shape(c, () => ell(c, x + k * 24 * s, y + 20 * s, 20 * s, 16 * s, -k * 0.4), COL.yellow, 4 * s); shape(c, () => ell(c, x + k * 34 * s, y - 16 * s, 8 * s, 8 * s), WHITE, 0); }
  shape(c, () => ell(c, x, y, 8 * s, 34 * s), INK, 0);
  for (const k of [-1, 1]) line(c, [[x, y - 30 * s], [x + k * 14 * s, y - 50 * s]], 3 * s, INK);
};
const flyIcon = (c: Ctx, x: number, y: number, s: number) => {
  for (const k of [-1, 1]) shape(c, () => ell(c, x + k * 14 * s, y - 8 * s, 16 * s, 8 * s, k * 0.4), "rgba(255,255,255,0.8)", 3 * s);
  shape(c, () => ell(c, x, y, 9 * s, 14 * s), INK, 0); shape(c, () => ell(c, x, y - 14 * s, 7 * s, 7 * s), INK, 0);
  for (const k of [-1, 1]) { shape(c, () => ell(c, x + k * 5 * s, y - 15 * s, 3 * s, 3 * s), RED, 0); for (const ly of [-4, 2, 8]) line(c, [[x + k * 6 * s, y + ly * s], [x + k * 16 * s, y + ly * s + 6 * s]], 2 * s, INK); }
};
// a paper tag with an animal on it (the plates' labels), centre (x, y)
const tag = (c: Ctx, x: number, y: number, draw: (c: Ctx, x: number, y: number, s: number) => void, s = 0.55) => { shape(c, () => rrect(c, x - 75, y - 48, 150, 96, 8), WHITE, 5); draw(c, x, y + 6, s); };
const lostTag = (c: Ctx, x: number, y: number) => { shape(c, () => rrect(c, x - 75, y - 48, 150, 96, 8), WHITE, 5); cross(c, x, y, 70); };
const bolt = (c: Ctx, x: number, y: number, s: number) => shape(c, () => polyP(c, [[x - 6 * s, y - 30 * s], [x + 14 * s, y - 30 * s], [x + 2 * s, y - 6 * s], [x + 16 * s, y - 6 * s], [x - 10 * s, y + 30 * s], [x - 2 * s, y + 2 * s], [x - 16 * s, y + 2 * s]]), COL.yellow, 3.5 * s);

// ---------------------------------------------------------------- set-up cards: the Survival Cup (e1)
// 1. three plates, 18 / 5 / 3 chana, and an empty Lost plate
const setup0 = (c: Ctx) => {
  ground(c);
  const P: [number, number, number, (c: Ctx, x: number, y: number, s: number) => void, number][] = [[190, 330, 18, frogIcon, 1], [540, 330, 5, henIcon, 2], [890, 330, 3, elephantIcon, 3]];
  P.forEach(([x, y, n, ic, sd]) => { plate(c, x, y, 150, 70); chanaHeap(c, x, y - 4, 110, 44, n, sd); tag(c, x, y + 170, ic); write(c, String(n), x - (n > 9 ? 40 : 20), y + 250, 60, INK, 8); });
  plate(c, 540, 820, 190, 88);
  lostTag(c, 540, 975);
};
// 2. the dice rules: for each family the faces that live (tick) and the faces that do not (cross)
const setup1 = (c: Ctx) => {
  ground(c);
  paper(c, 110, 120, 860, 840);
  const rows: [(c: Ctx, x: number, y: number, s: number) => void, number][] = [[frogIcon, 5], [henIcon, 3], [elephantIcon, 2]];
  rows.forEach(([ic, live], i) => {
    const y = 300 + i * 250;
    ic(c, 230, y, 0.9);
    for (let n = 1; n <= 6; n++) { const x = 400 + (n - 1) * 100; die(c, x, y, 72, n); if (n >= live) tick(c, x, y + 72, 40); else cross(c, x, y + 72, 40); }
    if (i < 2) line(c, [[150, y + 125], [930, y + 125]], 3, COL.grey);
  });
};
// 3. a hand rolls the die over the Frog plate; one chana has gone to the Lost plate
const setup2 = (c: Ctx) => {
  ground(c);
  plate(c, 420, 720, 200, 92); chanaHeap(c, 420, 716, 150, 58, 17, 4); tag(c, 420, 920, frogIcon);
  plate(c, 870, 600, 130, 60); chana(c, 870, 596, 15, 0.4); lostTag(c, 870, 740);
  arrow(c, [[600, 640], [700, 605], [780, 592]]);
  // the hand: open, fingers toward the die it has just let go
  hand(c, 380, 230, 1.15, 1.3, undefined, undefined, true);
  die(c, 470, 470, 90, 5, 0.4);
  for (const k of [-1, 0, 1]) line(c, [[470 + k * 60 - 10, 400 - Math.abs(k) * 10 - 20], [470 + k * 60 - 14, 360 - Math.abs(k) * 10 - 20]], 5, COL.greyDk);
};
// 4. the results table: round, young at the start, left after danger 1, left after danger 2
const setup3 = (c: Ctx) => {
  ground(c);
  paper(c, 100, 150, 880, 780);
  const cx = [160, 330, 560, 790, 960], ry = [220, 360, 520, 680, 840];
  for (let i = 0; i < 5; i++) line(c, [[cx[i], 220], [cx[i], 840]], 4, COL.greyDk);
  for (let j = 0; j < 5; j++) line(c, [[160, ry[j]], [960, ry[j]]], j === 1 ? 6 : 4, j === 1 ? INK : COL.greyDk);
  // header: round / frog young / danger 1 / danger 2
  die(c, 245, 290, 54, 6, 0.3);
  frogIcon(c, 445, 292, 0.55);
  bolt(c, 650, 290, 1.1); write(c, "1", 690, 262, 56, INK, 7);
  bolt(c, 880, 290, 1.1); write(c, "2", 920, 262, 56, INK, 7);
  const rows = [["1", "18", "6", "2"], ["2", "18", "7", "3"], ["3", "18", "5", "1"]];
  rows.forEach((r, j) => r.forEach((t, i) => write(c, t, (cx[i] + cx[i + 1]) / 2 - (t.length > 1 ? 44 : 20), ry[j + 1] + 50, 60, INK, 8)));
};
// 5. a bar chart in crayon: survivors of three rounds, frog, hen, elephant
const setup4 = (c: Ctx) => {
  ground(c);
  paper(c, 100, 120, 880, 840);
  const x0 = 250, y0 = 760, unit = 54;
  line(c, [[x0, 240], [x0, y0], [920, y0]], 6, INK);
  for (const v of [0, 5, 10]) { line(c, [[x0 - 14, y0 - v * unit], [x0, y0 - v * unit]], 5, INK); write(c, String(v), x0 - 50 - (v > 9 ? 28 : 0), y0 - v * unit - 20, 40, INK, 6); }
  const bars: [number, string, (c: Ctx, x: number, y: number, s: number) => void][] = [[6, COL.green, frogIcon], [7, COL.orange, henIcon], [6, "#9aa0ad", elephantIcon]];
  bars.forEach(([v, col, ic], i) => {
    const bx = 360 + i * 210, w = 120, top = y0 - v * unit;
    shape(c, () => polyP(c, [[bx - w / 2, y0], [bx - w / 2 + 4, top + 6], [bx + w / 2 - 3, top], [bx + w / 2, y0]]), col, 6);
    for (let k = 0; k < 7; k++) line(c, [[bx - w / 2 + 14 + k * 14, y0 - 8], [bx - w / 2 + 22 + k * 14, top + 14]], 3, "rgba(255,255,255,0.35)");
    ic(c, bx, y0 + 60, 0.5);
    write(c, String(v), bx - 16, top - 50, 40, INK, 6);
  });
  // three crayons lying at the bottom of the paper
  [[COL.green, 150, 900], [COL.orange, 340, 915], ["#9aa0ad", 530, 905]].forEach(([col, x, y]) => { shape(c, () => rrect(c, x as number, (y as number) - 14, 120, 28, 6), col as string, 5); shape(c, () => polyP(c, [[(x as number) + 120, (y as number) - 14], [(x as number) + 148, y as number], [(x as number) + 120, (y as number) + 14]]), col as string, 5); shape(c, () => rrect(c, (x as number) + 30, (y as number) - 14, 60, 28, 2), COL.paper, 4); });
};

// ---------------------------------------------------------------- flow cards
// the Survival Cup: a child at the table, die in hand over the Frog plate
const flowE1 = (c: Ctx) => {
  ground(c);
  const hands = person(c, 400, 980, 600, { reachR: [600, 585] });
  // table: top surface, front edge, legs
  shape(c, () => rrect(c, 60, 640, 960, 270, 14), COL.wood, 6);
  shape(c, () => polyP(c, [[60, 896], [1020, 896], [1020, 940], [60, 940]]), COL.woodDk, 6);
  for (const lx of [110, 930]) shape(c, () => rrect(c, lx, 940, 40, 110, 6), COL.woodDk, 5);
  plate(c, 230, 740, 115, 52); chanaHeap(c, 230, 736, 80, 34, 5, 12); tag(c, 230, 850, henIcon, 0.45);
  plate(c, 600, 790, 140, 64); chanaHeap(c, 600, 786, 100, 42, 18, 13); tag(c, 600, 880, frogIcon, 0.45);
  plate(c, 900, 740, 115, 52); chanaHeap(c, 900, 736, 80, 34, 3, 14); tag(c, 900, 850, elephantIcon, 0.45);
  die(c, hands.handR[0] + 10, hands.handR[1] + 8, 70, 4, 0.3);
};
// the Lifespan Line: string pieces taped in a row, a slip at each end, the child cutting the next piece
const flowA1 = (c: Ctx) => {
  ground(c);
  const rows: [number, (c: Ctx, x: number, y: number, s: number) => void, string][] = [[0, flyIcon, "1"], [14, mouseIcon, "2"], [56, henIcon, "8"], [84, dogIcon, "12"], [420, elephantIcon, "60"], [700, tortoiseIcon, "100"]];
  const tape = (x: number, y: number) => { c.globalAlpha = 0.7; shape(c, () => rrect(c, x - 16, y - 24, 32, 48, 4), COL.yellow, 3); c.globalAlpha = 1; };
  rows.forEach(([len, ic, t], i) => {
    const y = 120 + i * 96, x0 = 120;
    if (len > 0) { line(c, [[x0, y], [x0 + len * 0.3, y + 4], [x0 + len * 0.7, y - 4], [x0 + len, y]], 8, STRING); tape(x0, y); if (len > 50) tape(x0 + len, y); } else shape(c, () => ell(c, x0, y, 7, 7), STRING, 0);
    const sx = x0 + Math.max(len, 0) + 90;
    shape(c, () => rrect(c, sx - 60, y - 36, 120 + t.length * 30, 72, 6), WHITE, 5); ic(c, sx - 12, y + 4, 0.38); write(c, t, sx + 40, y - 18, 36, INK, 5);
  });
  // the child sits on the floor: string in the left hand, scissors in the right, cutting
  const h = person(c, 330, 1000, 470, { sit: true, dir: 1, reachL: [215, 880], reachR: [455, 870] });
  line(c, [[h.handL[0], h.handL[1]], [h.handR[0] - 20, h.handR[1] - 4], [h.handR[0] + 70, h.handR[1] - 18]], 8, STRING);
  // scissors: two blades crossing at a pivot just past the hand, rings at the hand
  const [sx, sy] = h.handR;
  for (const k of [-1, 1]) { line(c, [[sx, sy + k * 10], [sx + 52, sy - k * 6], [sx + 115, sy - k * 22]], 10, COL.steel); line(c, [[sx, sy + k * 10], [sx + 52, sy - k * 6], [sx + 115, sy - k * 22]], 4, COL.steelDk); }
  shape(c, () => ell(c, sx + 52, sy - 2, 7, 7), INK, 0);
  // the ruler on the floor
  shape(c, () => rrect(c, 600, 820, 420, 70, 6), COL.wood, 5);
  for (let i = 0; i <= 40; i++) line(c, [[612 + i * 10, 820], [612 + i * 10, 820 + (i % 10 === 0 ? 30 : i % 5 === 0 ? 20 : 11)]], i % 10 === 0 ? 4 : 2.5, INK);
  for (let cm = 0; cm <= 4; cm++) write(c, String(cm), 604 + cm * 100, 854, 26, INK, 4);
};
// Four life cycles in a table: a big sheet, four columns, a hand placing the last card in the insects column
const flowA2 = (c: Ctx) => {
  ground(c);
  paper(c, 60, 60, 960, 960);
  const cols = [195, 425, 655, 885], heads = [cowIcon, henIcon, butterflyIcon, frogIcon];
  for (let i = 1; i < 4; i++) line(c, [[80 + i * 230, 80], [80 + i * 230, 1000]], 4, COL.greyDk);
  line(c, [[80, 230], [1000, 230]], 6, INK);
  heads.forEach((ic, i) => ic(c, cols[i], 160, 0.62));
  const card = (x: number, y: number, rot: number) => { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -80, -46, 160, 92, 6), WHITE, 5); line(c, [[-50, 0], [-20, -6], [10, 4], [50, -2]], 5, COL.greyDk); c.restore(); };
  const r = rnd(21);
  cols.forEach((x, i) => { for (let j = 0; j < 4; j++) if (!(i === 2 && j === 3)) card(x, 330 + j * 170, (r() - 0.5) * 0.12); });
  // the card being put down, and the hand gripping its near edge
  card(655, 840, -0.1);
  hand(c, 760, 905, -2.45, 1.25);
};
// Rice-grain eggs: a teaspoon of rice tipped on a plate, grains pushed into tens, a katori of rice
const flowA3 = (c: Ctx) => {
  ground(c);
  const grain = (x: number, y: number, rot: number) => shape(c, () => ell(c, x, y, 13, 6, rot), COL.paper, 2.5);
  plate(c, 480, 560, 260, 135);
  const r = rnd(5);
  // five groups of ten, in neat rows of five
  [[330, 490], [470, 470], [610, 500], [360, 600], [520, 610]].forEach(([gx, gy]) => { for (let k = 0; k < 10; k++) grain(gx + (k % 5) * 26 - 52, gy + Math.floor(k / 5) * 18 - 9, (r() - 0.5) * 0.5); });
  // the loose grains still to be sorted, by the fingers
  for (let k = 0; k < 7; k++) grain(600 + r() * 60, 600 + r() * 40, r() * 3);
  hand(c, 740, 740, -2.05, 1.4, undefined, undefined, true);
  // a teaspoon with a little rice and the katori of rice
  shape(c, () => rrect(c, 760, 300, 240, 26, 12), COL.steel, 5);
  shape(c, () => ell(c, 745, 313, 60, 36), COL.steel, 5); shape(c, () => ell(c, 745, 316, 44, 24), COL.steelDk, 0);
  for (let k = 0; k < 8; k++) grain(720 + r() * 50, 304 + r() * 22, r() * 3);
  bowl(c, 900, 520, 110);
  shape(c, () => { c.moveTo(792, 520); c.bezierCurveTo(820, 440, 980, 440, 1008, 520); c.closePath(); }, COL.paper, 5);
  for (let k = 0; k < 24; k++) grain(815 + r() * 170, 470 + r() * 40, r() * 3);
};
// Moult and shell hunt: a child by a pond points at a dragonfly's empty skin on a reed
const flowA4 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#bfe0f5"; c.fillRect(0, 0, D, 620);
  shape(c, () => rrect(c, -20, 600, 1120, 500, 40), COL.green, 6);
  shape(c, () => ell(c, 800, 870, 290, 110), COL.water, 6);
  for (const [wx, wy] of [[700, 860], [850, 900], [920, 840]]) line(c, [[wx - 30, wy], [wx, wy - 6], [wx + 30, wy]], 4, COL.waterDk);
  // reeds growing from the pond, one carries the brown empty nymph skin, split along the back
  for (const [rx, top] of [[640, 330], [700, 250], [760, 360]]) { line(c, [[rx, 870], [rx + 6, top]], 10, INK); line(c, [[rx, 870], [rx + 6, top]], 5, COL.leafDk); shape(c, () => ell(c, rx + 6, top - 24, 10, 30), BROWN_DK, 4); }
  const skin = (x: number, y: number) => {
    for (const lx of [-1, 1]) for (const ly of [-22, 0, 22]) line(c, [[x, y + ly], [x + lx * 38, y + ly + 18]], 5, BROWN_DK);
    shape(c, () => ell(c, x, y + 10, 20, 46), "#c69a63", 5); shape(c, () => ell(c, x, y - 44, 18, 16), "#c69a63", 5);
    line(c, [[x, y - 24], [x, y + 40]], 4, BROWN_DK); for (const k of [-1, 1]) shape(c, () => ell(c, x + k * 10, y - 46, 6, 6), BROWN_DK, 0);
  };
  skin(704, 500);
  const h = person(c, 330, 960, 600, { reachR: [560, 520], reachL: [222, 640] });
  // the notebook in the left hand
  c.save(); c.translate(h.handL[0], h.handL[1] + 24); c.rotate(0.15); shape(c, () => rrect(c, -62, -46, 124, 92, 6), COL.blue, 5); line(c, [[-62, -30], [62, -30]], 4, COL.blueDk); c.restore();
  // a snail shell and a broken eggshell on the grass
  shape(c, () => ell(c, 900, 700, 44, 36), TAN, 5); c.beginPath(); c.arc(905, 700, 26, 0, Math.PI * 1.7); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); c.beginPath(); c.arc(908, 702, 12, 0, Math.PI * 1.5); c.stroke();
  shape(c, () => polyP(c, [[450, 700], [480, 660], [500, 685], [525, 655], [545, 690], [570, 665], [580, 710], [460, 720]]), COL.sky, 4);
};
// Banana jar nursery: a jar, a banana slice, flies inside, a cloth lid with a rubber band, a lens on the maggot
const flowP1 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 900], [D, 900]], 6, INK);
  const jx = 480, jb = 900, jw = 400, jh = 540;
  shadow(c, jx + 30, jb + 6, jw * 0.55, 24);
  shape(c, () => rrect(c, jx - jw / 2, jb - jh, jw, jh, 40), COL.glass, 6);
  // banana slice lying inside, a little of the peel-less flesh darker where it is over-ripe
  shape(c, () => ell(c, jx, jb - 60, 150, 44), COL.yellow, 5); shape(c, () => ell(c, jx, jb - 64, 108, 28), "#fff1b0", 4);
  for (const [bx, by] of [[jx - 40, jb - 70], [jx + 30, jb - 56], [jx + 70, jb - 72]]) shape(c, () => ell(c, bx, by, 10, 6), BROWN_DK, 0);
  for (const [fx, fy, s] of [[jx - 90, jb - 300, 1], [jx + 60, jb - 240, 0.9], [jx - 20, jb - 400, 0.8], [jx + 110, jb - 420, 0.9]]) flyIcon(c, fx, fy, s);
  // the cloth over the mouth, held by a red rubber band
  shape(c, () => { c.moveTo(jx - 250, jb - jh + 60); c.quadraticCurveTo(jx - 240, jb - jh - 30, jx - 120, jb - jh - 40); c.lineTo(jx + 120, jb - jh - 40); c.quadraticCurveTo(jx + 240, jb - jh - 30, jx + 250, jb - jh + 60); c.quadraticCurveTo(jx, jb - jh + 20, jx - 250, jb - jh + 60); c.closePath(); }, COL.cloth, 6);
  for (const k of [-1, 1]) for (let i = 0; i < 3; i++) line(c, [[jx + k * (150 + i * 30), jb - jh - 28 + i * 4], [jx + k * (190 + i * 24), jb - jh + 50]], 3, "#d9d0bd");
  shape(c, () => rrect(c, jx - jw / 2 - 14, jb - jh - 4, jw + 28, 22, 10), RED, 5);
  // the lens over the jar wall: a maggot and a brown pupa case, large
  const lx = 820, ly = 700;
  line(c, [[lx + 90, ly + 90], [lx + 200, ly + 200]], 34, INK); line(c, [[lx + 90, ly + 90], [lx + 200, ly + 200]], 22, COL.woodDk);
  shape(c, () => ell(c, lx, ly, 130, 130), "#eaf5fb", 12);
  shape(c, () => ell(c, lx - 10, ly - 30, 70, 22, -0.2), COL.paper, 5); for (let i = -3; i <= 3; i++) line(c, [[lx - 10 + i * 18, ly - 50], [lx - 12 + i * 18, ly - 12]], 3, COL.grey);
  shape(c, () => ell(c, lx + 10, ly + 50, 56, 22, 0.1), BROWN, 5); for (let i = -2; i <= 2; i++) line(c, [[lx + 10 + i * 18, ly + 30], [lx + 8 + i * 18, ly + 70]], 3, BROWN_DK);
};

// ---------------------------------------------------------------- term and explanation pictures
// Incubation: a hen sitting on her nest, and beside her a sandy hole with round white turtle eggs
const term2 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 800], [D, 800]], 6, INK);
  // nest of straw
  shadow(c, 330, 806, 230, 22);
  shape(c, () => ell(c, 310, 760, 220, 70), COL.wood, 6);
  const r = rnd(3); for (let i = 0; i < 40; i++) { const a = r() * Math.PI * 2, d = 60 + r() * 150; line(c, [[310 + Math.cos(a) * d * 0.7, 760 + Math.sin(a) * d * 0.3], [310 + Math.cos(a) * (d + 50), 760 + Math.sin(a) * (d + 50) * 0.3]], 3, COL.woodDk); }
  egg(c, 230, 740, 26, 0.3); egg(c, 400, 745, 26, -0.3);
  henIcon(c, 300, 620, 3.2, false);
  // the sand hole, cut open: a mound with a chamber of eggs
  shape(c, () => { c.moveTo(620, 800); c.quadraticCurveTo(700, 560, 850, 560); c.quadraticCurveTo(1000, 560, 1080, 800); c.closePath(); }, SAND, 6);
  shape(c, () => { c.moveTo(810, 600); c.quadraticCurveTo(830, 660, 760, 700); c.quadraticCurveTo(740, 770, 850, 780); c.quadraticCurveTo(960, 770, 940, 700); c.quadraticCurveTo(870, 660, 890, 600); c.closePath(); }, SAND_DK, 5);
  [[800, 740], [850, 745], [900, 738], [825, 705], [875, 708], [850, 672]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 22, 22), WHITE, 4));
};
// Larva: a caterpillar on a leaf, and a tadpole in water
const term12 = (c: Ctx) => {
  ground(c);
  leaf(c, 50, 560, 720, -0.5, COL.leaf);
  const bx = 50, by = 560, tx = 50 + Math.cos(-0.5) * 720, ty = 560 + Math.sin(-0.5) * 720;
  // the caterpillar lies along the midrib: a row of round segments, legs beneath, a head with eyes and feelers
  const n = 8, pts: number[][] = []; for (let i = 0; i < n; i++) { const t = 0.2 + i * 0.08; pts.push([bx + (tx - bx) * t, by + (ty - by) * t]); }
  pts.forEach(([x, y], i) => { if (i < n - 1) for (const k of [-1, 1]) line(c, [[x, y + 16], [x + k * 8, y + 40]], 6, COL.greenDk); });
  for (let i = n - 1; i >= 0; i--) { const [x, y] = pts[i]; shape(c, () => ell(c, x, y, 38, 35), i === n - 1 ? "#7fb53a" : "#9ccf62", 5); if (i < n - 1) shape(c, () => ell(c, x, y - 8, 9, 9), COL.yellow, 3); }
  const [hx, hy] = pts[n - 1]; eye(c, hx + 6, hy - 8, 9); for (const k of [-1, 1]) line(c, [[hx + 12, hy - 26], [hx + 22 + k * 16, hy - 64]], 5, INK);
  // the pond, and the tadpole: a round dark head with a long wavy tail
  shape(c, () => ell(c, 720, 820, 340, 180), COL.water, 6);
  for (const [wx, wy] of [[520, 790], [920, 740], [640, 930]]) line(c, [[wx - 30, wy], [wx, wy - 6], [wx + 30, wy]], 4, COL.waterDk);
  shape(c, () => { c.moveTo(800, 810); c.bezierCurveTo(900, 740, 940, 880, 1030, 830); c.bezierCurveTo(940, 910, 900, 800, 800, 860); c.closePath(); }, "#7a6446", 5);
  shape(c, () => ell(c, 730, 830, 100, 76), "#5a4a2e", 6);
  eye(c, 690, 815, 14);
};
// Warm sand, cool sand: a turtle nest cut open, and a thermometer in the sand
const expl10 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 400);
  shape(c, () => polyP(c, [[-10, 400], [1090, 400], [1090, 1090], [-10, 1090]]), SAND, 6);
  // the nest: a narrow neck down from the surface to a round chamber about 45 cm deep, full of round eggs
  shape(c, () => { c.moveTo(380, 400); c.quadraticCurveTo(400, 520, 300, 600); c.quadraticCurveTo(250, 720, 420, 790); c.quadraticCurveTo(590, 720, 540, 600); c.quadraticCurveTo(440, 520, 460, 400); c.closePath(); }, SAND_DK, 6);
  const r = rnd(9); const E: number[][] = [[360, 740], [420, 750], [480, 740], [340, 690], [400, 695], [460, 698], [510, 690], [370, 648], [430, 650], [490, 645], [400, 608], [450, 610]];
  E.forEach(([x, y]) => shape(c, () => ell(c, x + r() * 4, y, 26, 26), WHITE, 4));
  // the thermometer standing in the sand to the right, its bulb at the depth of the eggs
  const tx = 820;
  shape(c, () => rrect(c, tx - 26, 180, 52, 540, 24), WHITE, 6);
  shape(c, () => rrect(c, tx - 9, 300, 18, 410, 8), RED, 0);
  shape(c, () => ell(c, tx, 740, 40, 40), RED, 6);
  for (let i = 0; i < 9; i++) line(c, [[tx - 24, 240 + i * 50], [tx - (i % 2 ? 6 : -4), 240 + i * 50]], 3.5, INK);
  write(c, "30°", tx + 50, 262, 60, INK, 8);
  c.beginPath(); c.arc(tx + 200, 292, 24, 0.5, Math.PI * 2 - 0.5); c.strokeStyle = INK; c.lineWidth = 8; c.lineCap = "round"; c.stroke();
  // a few sand grains and a line of the beach surface
  for (let i = 0; i < 14; i++) shape(c, () => ell(c, 60 + i * 76 + r() * 30, 430 + r() * 500, 5, 4), SAND_DK, 0);
};
// Litter: a dog lying down with six puppies against her side
const term3 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 820], [D, 820]], 6, INK);
  shadow(c, 560, 826, 420, 26);
  // hind leg folded under, body, tail
  shape(c, () => ell(c, 820, 700, 110, 70), TAN, 5);
  line(c, [[910, 660], [1000, 600], [1020, 520]], 22, INK); line(c, [[910, 660], [1000, 600], [1020, 520]], 14, TAN);
  shape(c, () => ell(c, 560, 640, 330, 130), TAN, 6);
  shade(c, () => ell(c, 560, 640, 330, 130), TAN_DK, 60, 20, 0.35);
  // front legs stretched forward, paws on the ground
  for (const [lx, ly] of [[300, 740], [360, 770]]) { line(c, [[lx + 60, 680], [lx, ly]], 46, INK); line(c, [[lx + 60, 680], [lx, ly]], 34, TAN); shape(c, () => ell(c, lx - 10, ly + 20, 34, 20), TAN, 5); }
  // head, turned to look at the pups
  shape(c, () => ell(c, 250, 520, 95, 85), TAN, 6);
  shape(c, () => ell(c, 170, 560, 56, 40), TAN, 5); shape(c, () => ell(c, 120, 556, 18, 14), INK, 0);
  shape(c, () => ell(c, 320, 540, 34, 70, -0.2), TAN_DK, 5);
  eye(c, 230, 505, 13);
  c.beginPath(); c.arc(185, 580, 22, 0.2, Math.PI - 0.6); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  // six puppies lying in a row against her belly, heads up to feed
  for (let i = 0; i < 6; i++) {
    const px = 330 + i * 86, col = i % 2 ? "#f1dfc2" : TAN, dk = i % 2 ? "#d6c2a0" : TAN_DK;
    shape(c, () => ell(c, px, 775, 30, 38), col, 5);
    shape(c, () => ell(c, px, 722, 30, 27), col, 5);
    shape(c, () => ell(c, px - 24, 718, 10, 16, 0.3), dk, 4);
    line(c, [[px - 6, 712], [px + 8, 712]], 4, INK);
    shape(c, () => ell(c, px + 14, 728, 6, 5), INK, 0);
  }
};

export const ic_animalsAnimalLifeCyclesL4 = cards("sci.animals.animal-life-cycles.L4", [setup0, setup1, setup2, setup3, setup4, flowE1, flowA1, flowA2, flowA3, flowA4, flowP1, term2, term12, expl10, term3]);
