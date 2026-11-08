import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, hand, person, write, cards, rnd } from "./flatKit";

// FRICTION L4 · set-up cards for the Press Harder and Wrap the Thread tests, then the card pictures
// (flow, terms). Flat kit look: see flatKit.ts. A cardboard shoebox, 500 g sugar packets, a wide tan
// rubber band with two marker dots, a yellow pencil, dark cotton thread, a small water bottle.
const CARD = "#d9a86c", CARD_LT = "#e8bd82", CARD_DK = "#b8864f", TAPE = "#efe2b4", BAND = "#e9b66a", TILE = "#ece6da", TILE_LN = "#cfc6b8";
const PENCIL = "#ffd34d", GRAPHITE = "#3a3540", THREAD = "#4a4160", HONEY = "#d9861c", OIL = "#f0cf5a", ROPE = "#c9a46a", STONE = "#a9a39a", STONE_LN = "#8a847c";

// ---------------------------------------------------------------- things used on several cards
// a strip of rubber band (or rope): ink edge, then the colour
const strip = (c: Ctx, pts: number[][], w: number, col = BAND) => { line(c, pts, w + 8, INK); line(c, pts, w, col); };
// a marker dot on the band
const dot = (c: Ctx, x: number, y: number, r = 8) => shape(c, () => ell(c, x, y, r, r), INK, 0);
// a tile floor from y down
const floor = (c: Ctx, y: number) => {
  c.fillStyle = TILE; c.fillRect(0, y, D, D - y); c.strokeStyle = TILE_LN; c.lineWidth = 3;
  for (let x = 90; x < D; x += 180) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, D); c.stroke(); }
  for (let ty = y + 110; ty < D; ty += 110) { c.beginPath(); c.moveTo(0, ty); c.lineTo(D, ty); c.stroke(); }
  line(c, [[0, y], [D, y]], 5);
};
// a shoebox with its lid taped shut: front-bottom-left corner at (x, y), front face w by h, the visible end face
// on side (-1 left, 1 right), receding dep. label: a number on a white sticker (how many packets are inside)
const box = (c: Ctx, x: number, y: number, w: number, h: number, dep: number, side: 1 | -1 = -1, label?: string) => {
  const dx = side * dep * 0.55, dy = dep * 0.4, lip = h * 0.16, ex = side < 0 ? x : x + w;
  shadow(c, x + w / 2 + dx * 0.5, y + 6, w * 0.6 + Math.abs(dx) * 0.5, 16);
  shape(c, () => polyP(c, [[ex, y - h], [ex + dx, y - h - dy], [ex + dx, y - dy], [ex, y]]), CARD_DK);
  shape(c, () => polyP(c, [[x, y - h], [x + w, y - h], [x + w, y], [x, y]]), CARD);
  shape(c, () => polyP(c, [[x, y - h], [x + w, y - h], [x + w + dx, y - h - dy], [x + dx, y - h - dy]]), CARD_LT);
  line(c, [[x, y - h + lip], [x + w, y - h + lip]], 4); line(c, [[ex, y - h + lip], [ex + dx, y - h + lip - dy]], 4);
  const tx = x + w * 0.5, tw = 40;
  shape(c, () => polyP(c, [[tx - tw / 2 + dx, y - h - dy], [tx + tw / 2 + dx, y - h - dy], [tx + tw / 2, y - h], [tx - tw / 2, y - h]]), TAPE, 4);
  shape(c, () => rrect(c, tx - tw / 2, y - h - 2, tw, lip + 34, 4), TAPE, 4);
  // the sticker sits above the band, which runs low on the box (see boxBand)
  if (label) { const lx = x + w * 0.76, ly = y - h * 0.3 - 56; shape(c, () => rrect(c, lx - 34, ly - 30, 68, 60, 8), WHITE, 4); write(c, label, lx - 13, ly - 21, 42); }
};
// the rubber band round the box: a belt across the front face at height ym (low, where a pull keeps the box flat),
// and the two strands from the left end's corners pulled out to the point p; dots = where along the front strand
// the two marker dots sit (0..1)
const boxBand = (c: Ctx, x: number, y: number, w: number, h: number, dep: number, p: number[], dots?: number[], ym = y - h * 0.3) => {
  const dx = -dep * 0.55, dy = dep * 0.4;
  strip(c, [[x, ym], [x + w, ym]], 16);
  strip(c, [[x + dx, ym - dy], p], 13); strip(c, [[x, ym], p], 13);
  if (dots) dots.forEach((t) => dot(c, x + (p[0] - x) * t, ym + (p[1] - ym) * t));
};
// a 500 g packet of sugar standing up, bottom centre (x, y)
const packet = (c: Ctx, x: number, y: number, w = 120, h = 170) => {
  shadow(c, x + 10, y + 4, w * 0.55, 10);
  const body = () => rrect(c, x - w / 2, y - h, w, h, 10);
  shape(c, body, COL.cloth); shade(c, body, "#d8d0c0", w * 0.3, 0, 0.5);
  shape(c, () => rrect(c, x - w / 2 + 8, y - h - 8, w - 16, 18, 4), COL.blueDk, 4);
  shape(c, () => polyP(c, [[x - w / 2, y - h * 0.62], [x + w / 2, y - h * 0.62], [x + w / 2, y - h * 0.3], [x - w / 2, y - h * 0.3]]), COL.blue, 4);
  if (h >= 150) write(c, "500 g", x - w * 0.42, y - h * 0.58, h * 0.17, WHITE, 5);
};
// a yellow pencil lying level, eraser at x1, point at x2, axis at y
const pencil = (c: Ctx, x1: number, x2: number, y: number, r = 18) => {
  const tip = r * 2.6;
  shape(c, () => { c.moveTo(x1, y - r); c.lineTo(x2 - tip, y - r); c.lineTo(x2, y); c.lineTo(x2 - tip, y + r); c.lineTo(x1, y + r); c.closePath(); }, PENCIL);
  shape(c, () => { c.moveTo(x2 - tip, y - r); c.lineTo(x2, y); c.lineTo(x2 - tip, y + r); c.closePath(); }, "#f2d9a6", 4);
  shape(c, () => { c.moveTo(x2 - tip * 0.35, y - r * 0.35); c.lineTo(x2, y); c.lineTo(x2 - tip * 0.35, y + r * 0.35); c.closePath(); }, GRAPHITE, 0);
  line(c, [[x1 + 6, y - r * 0.3], [x2 - tip - 6, y - r * 0.3]], 3, "#d9a826");
  shape(c, () => rrect(c, x1 - 2, y - r, 26, r * 2, 3), COL.steelDk, 4); shape(c, () => rrect(c, x1 - 28, y - r + 2, 28, r * 2 - 4, 8), COL.pink, 4);
};
// thread over a pencil of radius r at (px, py): a half turn over the top, then n full turns drawn as rings.
// Returns where the two hanging strands leave the pencil.
const wrap = (c: Ctx, px: number, py: number, r: number, n: number): { left: number[]; right: number[] } => {
  c.strokeStyle = THREAD; c.lineWidth = 5; c.lineCap = "round";
  c.beginPath(); c.ellipse(px, py, r + 3, r + 3, 0, Math.PI, Math.PI * 2); c.stroke();
  for (let k = 1; k <= n; k++) { c.beginPath(); c.ellipse(px + k * 16, py, 7, r + 3, 0, 0, Math.PI * 2); c.stroke(); }
  return { left: [px - r - 3, py], right: [n ? px + n * 16 + 7 : px + r + 3, py] };
};
const thread = (c: Ctx, pts: number[][]) => line(c, pts, 5, THREAD);
// a small water bottle, full and capped, hanging by a thread knotted under its cap; cap top centre (x, top)
const bottle = (c: Ctx, x: number, top: number, w = 90, h = 230) => {
  const cap = h * 0.11, neck = h * 0.1, sh = top + cap + neck;
  const body = () => { c.moveTo(x - w * 0.2, top + cap); c.lineTo(x + w * 0.2, top + cap); c.lineTo(x + w * 0.2, sh); c.lineTo(x + w / 2, sh + h * 0.12); c.lineTo(x + w / 2, top + h - w * 0.2); c.quadraticCurveTo(x + w / 2, top + h, x + w * 0.3, top + h); c.lineTo(x - w * 0.3, top + h); c.quadraticCurveTo(x - w / 2, top + h, x - w / 2, top + h - w * 0.2); c.lineTo(x - w / 2, sh + h * 0.12); c.lineTo(x - w * 0.2, sh); c.closePath(); };
  shape(c, body, COL.water, 5); shade(c, body, COL.waterDk, w * 0.25, 0, 0.45);
  shape(c, () => rrect(c, x - w * 0.24, top, w * 0.48, cap, 5), COL.blueDk);
  shape(c, () => rrect(c, x - w / 2 + 4, sh + h * 0.3, w - 8, h * 0.2, 4), COL.cloth, 4);
  shine(c, [[x - w * 0.34, sh + h * 0.16], [x - w * 0.34, top + h * 0.85]], 7);
  c.beginPath(); c.ellipse(x, top + cap + neck * 0.5, w * 0.24, 6, 0, 0, Math.PI * 2); c.strokeStyle = THREAD; c.lineWidth = 5; c.stroke();
};
// a paper clip
const clip = (c: Ctx, x: number, y: number, rot: number, s = 1) => { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.strokeStyle = COL.greyDk; c.lineWidth = 3.5; c.beginPath(); rrect(c, -7, -16, 14, 32, 7); c.stroke(); c.beginPath(); rrect(c, -3.5, -10, 7, 18, 3.5); c.stroke(); c.restore(); };
// a small clear plastic bag tied to the thread at (x, top), with n paper clips heaped in the bottom
const bag = (c: Ctx, x: number, top: number, w: number, h: number, n: number) => {
  const body = () => { c.moveTo(x - w * 0.12, top); c.lineTo(x + w * 0.12, top); c.lineTo(x + w / 2, top + h * 0.42); c.lineTo(x + w / 2, top + h - w * 0.25); c.quadraticCurveTo(x + w / 2, top + h, x + w * 0.25, top + h); c.lineTo(x - w * 0.25, top + h); c.quadraticCurveTo(x - w / 2, top + h, x - w / 2, top + h - w * 0.25); c.lineTo(x - w / 2, top + h * 0.42); c.closePath(); };
  shape(c, body, "#eef4f8", 0);
  const r = rnd(n * 7 + 3);
  for (let i = 0; i < n; i++) clip(c, x - w * 0.28 + r() * w * 0.56, top + h * 0.62 + r() * h * 0.22, r() * 3, w / 120);
  shape(c, body, "rgba(214,236,250,0.4)", 4);
  shine(c, [[x - w * 0.3, top + h * 0.5], [x - w * 0.3, top + h * 0.8]], 6);
  c.beginPath(); c.ellipse(x, top + 7, w * 0.15, 5, 0, 0, Math.PI * 2); c.strokeStyle = THREAD; c.lineWidth = 5; c.stroke();
};
// a closed book lying flat, seen from the side; bottom-left (x, y)
const book = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y - h, w, h, 5), COL.red);
  shape(c, () => rrect(c, x + 6, y - h + 11, w - 12, h - 22, 2), COL.paper, 3);
  for (let k = 1; k < 4; k++) line(c, [[x + 14, y - h + 11 + k * (h - 22) / 4], [x + w - 14, y - h + 11 + k * (h - 22) / 4]], 2, COL.grey);
};
// a wooden ruler, top-left (x, y), ticks every half centimetre along the top edge, cm px per centimetre
const ruler = (c: Ctx, x: number, y: number, len: number, h: number, cm: number) => {
  shape(c, () => rrect(c, x, y, len, h, 4), COL.wood); c.fillStyle = COL.woodDk; c.fillRect(x + 3, y + h - 8, len - 6, 6);
  c.strokeStyle = INK; c.lineCap = "butt"; const n = Math.floor((len - 20) / (cm / 2));
  for (let i = 0; i <= n; i++) { const tx = x + 10 + (i * cm) / 2, th = i % 10 === 0 ? h * 0.6 : i % 2 === 0 ? h * 0.42 : h * 0.25; c.lineWidth = i % 10 === 0 ? 4 : 2.5; c.beginPath(); c.moveTo(tx, y); c.lineTo(tx, y + th); c.stroke(); }
};
// a steel hex nut, centre (x, y)
const nut = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => { for (let k = 0; k < 6; k++) { const a = (k * Math.PI) / 3 + Math.PI / 6, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r; k ? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); }, COL.steel, 5);
  shape(c, () => ell(c, x, y, r * 0.4, r * 0.4), COL.steelDk, 4);
};
// a glass marble with a coloured swirl
const marble = (c: Ctx, x: number, y: number, r: number, col: string = COL.blue) => {
  shape(c, () => ell(c, x, y, r, r), "#d6ecfa", 4);
  shape(c, () => { c.moveTo(x - r * 0.65, y + r * 0.25); c.quadraticCurveTo(x, y - r * 0.75, x + r * 0.65, y + r * 0.1); c.quadraticCurveTo(x, y + r * 0.35, x - r * 0.65, y + r * 0.25); c.closePath(); }, col, 0);
  shape(c, () => ell(c, x - r * 0.42, y - r * 0.42, r * 0.2, r * 0.13, -0.7), WHITE, 0);
};
// A, B and = as strokes (tokens and cards of the game)
const LETTER: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.13, 0.62], [0.47, 0.62]]],
  B: [[[0, 1], [0, 0], [0.38, 0], [0.55, 0.12], [0.55, 0.38], [0.38, 0.5], [0, 0.5]], [[0.38, 0.5], [0.58, 0.62], [0.58, 0.88], [0.4, 1], [0, 1]]],
  "=": [[[0.03, 0.38], [0.57, 0.38]], [[0.03, 0.66], [0.57, 0.66]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col: string = INK, w = 8) => LETTER[ch].forEach((st) => line(c, st.map(([u, v]) => [x + u * h, y + v * h]), w, col));
// a table top seen from the side, from the left edge of the card to x = edge, surface at y
const tableEdge = (c: Ctx, edge: number, y: number, legTo: number) => {
  shape(c, () => rrect(c, 40, y + 34, 50, legTo - y - 34, 4), COL.woodDk, 5);
  shape(c, () => polyP(c, [[-10, y], [edge, y], [edge, y + 40], [-10, y + 40]]), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(-10, y + 28, edge + 7, 10);
};

// ---------------------------------------------------------------- set-up cards, Press Harder (e1)
// 1. the band lying flat with two dots 4 cm apart; the band looped round the end of the box
const e1s0 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 300, 380, 70);
  c.beginPath(); rrect(c, 180, 215, 720, 110, 55); c.lineWidth = 40; c.strokeStyle = INK; c.lineJoin = "round"; c.stroke(); c.lineWidth = 30; c.strokeStyle = BAND; c.stroke();
  dot(c, 470, 215, 9); dot(c, 610, 215, 9);
  line(c, [[470, 148], [470, 182]], 4); line(c, [[610, 148], [610, 182]], 4);
  arrow(c, [[540, 165], [480, 165]], RED, 5); arrow(c, [[540, 165], [600, 165]], RED, 5);
  write(c, "4 cm", 462, 62, 56);
  box(c, 430, 860, 420, 180, 150, -1);
  boxBand(c, 430, 860, 420, 180, 150, [230, 790]);
};
// 2. the taped-shut box with one, two and three packets standing beside it
const e1s1 = (c: Ctx) => {
  ground(c);
  box(c, 110, 760, 400, 190, 150, 1);
  packet(c, 700, 760); packet(c, 840, 760); packet(c, 980, 760);
};
// 3. the child pulls the band level along a tile floor; a grown-up holds a ruler beside the dots
const e1s2 = (c: Ctx) => {
  ground(c);
  // the scene is laid out small (people sitting on the floor, box, band), then drawn 1.35 times bigger
  c.save(); c.translate(40 - 290 * 1.35, 820 - 800 * 1.35); c.scale(1.35, 1.35);
  floor(c, 560);
  person(c, 660, 720, 470, { sit: true, dir: -1, adult: true, reachR: [765, 672], reachL: [560, 695] });
  box(c, 870, 800, 160, 130, 110, -1);
  const hands: [number, number][] = [[458, 735], [495, 735]], p = [(hands[0][0] + hands[1][0]) / 2, 735];
  boxBand(c, 870, 800, 160, 130, 110, p, [0.357, 0.587], 735);
  ruler(c, 600, 690, 190, 26, 15);
  person(c, 400, 800, 360, { sit: true, dir: 1, reachL: hands[0], reachR: hands[1] });
  c.restore();
};
// 4. the graph: stretch for 0, 1, 2 and 3 packets
const e1s3 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1000, 420, 20);
  shape(c, () => rrect(c, 110, 90, 860, 900, 14), COL.paper, 5);
  const ox = 260, oy = 820, xs = 170, ys = 85;
  arrow(c, [[ox, oy], [ox, 170]], INK, 6); arrow(c, [[ox, oy], [940, oy]], INK, 6);
  for (let i = 0; i < 4; i++) { const tx = ox + 70 + i * xs; line(c, [[tx, oy - 8], [tx, oy + 8]], 4); write(c, String(i), tx - 14, oy + 28, 46); }
  for (let k = 1; k <= 7; k++) { const ty = oy - k * ys; line(c, [[ox - 8, ty], [ox + 8, ty]], 4); write(c, String(k), ox - 62, ty - 18, 38); }
  write(c, "cm", ox - 26, 100, 40);
  packet(c, 930, 920, 44, 62);
  const pts = [1.2, 2.8, 4.4, 6].map((v, i) => [ox + 70 + i * xs, oy - v * ys]);
  line(c, pts, 7, COL.teal);
  pts.forEach(([x, y]) => shape(c, () => ell(c, x, y, 14, 14), COL.teal, 5));
};
// 5. the same box with two packets, lying on its big face and standing on its narrow end, each pulled by a band
const e1s4 = (c: Ctx) => {
  ground(c); floor(c, 200);
  box(c, 400, 470, 320, 150, 130, -1, "2");
  boxBand(c, 400, 470, 320, 150, 130, [200, 425]);
  arrow(c, [[190, 425], [100, 425]]);
  box(c, 400, 930, 150, 320, 130, -1, "2");
  boxBand(c, 400, 930, 150, 320, 130, [200, 834]);
  arrow(c, [[190, 834], [100, 834]]);
};

// ---------------------------------------------------------------- set-up cards, Wrap the Thread (e2)
// 1. the pencil taped to the table so it sticks out past the edge, a heavy book on the taped end, a cushion below
const e2s0 = (c: Ctx) => {
  ground(c); floor(c, 880);
  tableEdge(c, 600, 500, 880);
  pencil(c, 300, 850, 482);
  for (const tx of [380, 470]) shape(c, () => rrect(c, tx - 18, 458, 36, 52, 4), TAPE, 4);
  book(c, 320, 464, 240, 60);
  line(c, [[600, 560], [600, 620]], 4); line(c, [[850, 520], [850, 620]], 4);
  arrow(c, [[725, 600], [610, 600]], RED, 5); arrow(c, [[725, 600], [840, 600]], RED, 5);
  write(c, "8 cm", 652, 640, 50);
  shadow(c, 760, 884, 170, 14);
  const cush = () => rrect(c, 590, 790, 320, 90, 36);
  shape(c, cush, COL.purple); shade(c, cush, "#6e52a8", 30, 10, 0.4);
  shape(c, () => ell(c, 750, 835, 14, 14), "#6e52a8", 4);
};
// 2. the bottle on a thread over the pencil, a bag tied to the other end
const e2s1 = (c: Ctx) => {
  ground(c);
  tableEdge(c, 230, 330, 1100);
  pencil(c, 40, 760, 310, 20);
  shape(c, () => rrect(c, 132, 284, 36, 60, 4), TAPE, 4);
  const w = wrap(c, 620, 310, 20, 0);
  thread(c, [w.left, [540, 470]]); thread(c, [w.right, [730, 440]]);
  bottle(c, 540, 470, 100, 260);
  bag(c, 730, 440, 120, 150, 0);
};
// 3. one turn of thread round the pencil, a hand adding paper clips to the bag
const e2s2 = (c: Ctx) => {
  ground(c);
  tableEdge(c, 230, 330, 1100);
  pencil(c, 40, 700, 310, 20);
  shape(c, () => rrect(c, 132, 284, 36, 60, 4), TAPE, 4);
  const w = wrap(c, 600, 310, 20, 1);
  thread(c, [w.left, [520, 470]]); thread(c, [w.right, [730, 440]]);
  bottle(c, 520, 470, 100, 260);
  bag(c, 730, 440, 120, 150, 12);
  clip(c, 735, 408, 0.2, 1.2);
  arrow(c, [[772, 385], [772, 432]], RED, 5);
  hand(c, 800, 300, 2.0, 1.2, SKIN.child, CLOTH.child);
};
// 4. four pictures: half a turn, one, two and three turns, and how many clips each needed
const e2s3 = (c: Ctx) => {
  ground(c);
  const clips = ["80", "30", "5", "1"], n = [0, 1, 2, 3];
  c.strokeStyle = TILE_LN; c.lineWidth = 3;
  for (const sx of [280, 540, 800]) { c.beginPath(); c.moveTo(sx, 240); c.lineTo(sx, 800); c.stroke(); }
  for (let i = 0; i < 4; i++) {
    const cx = 150 + i * 260, px = cx - 14;
    pencil(c, cx - 110, cx + 110, 380, 16);
    const w = wrap(c, px, 380, 16, n[i]);
    thread(c, [w.left, [cx - 72, 450]]); thread(c, [w.right, [cx + 72, 440]]);
    bottle(c, cx - 72, 450, 60, 150);
    bag(c, cx + 72, 440, 80, 100, Math.min(n[i] ? 9 - n[i] * 2 : 12, 12));
    const t = clips[i], tw = t.length * 0.8 * 72 - 0.2 * 72;
    write(c, t, cx - tw / 2, 650, 72);
  }
};

// ---------------------------------------------------------------- card pictures
// Press Harder: the loaded box, the band stretched, the pull
const fE1 = (c: Ctx) => {
  ground(c); floor(c, 520);
  packet(c, 160, 600, 100, 140); packet(c, 290, 600, 100, 140); packet(c, 420, 600, 100, 140);
  box(c, 560, 800, 360, 170, 150, -1);
  boxBand(c, 560, 800, 360, 170, 150, [250, 715], [0.4, 0.7]);
  arrow(c, [[240, 715], [120, 715]]);
};
// Wrap the Thread: three turns hold the bottle with a bag of a few clips
const fE2 = (c: Ctx) => {
  ground(c);
  tableEdge(c, 200, 300, 1100);
  pencil(c, 20, 800, 278, 22);
  shape(c, () => rrect(c, 102, 250, 36, 62, 4), TAPE, 4);
  const w = wrap(c, 560, 278, 22, 3);
  thread(c, [w.left, [440, 440]]); thread(c, [w.right, [770, 420]]);
  bottle(c, 440, 440, 120, 300);
  bag(c, 770, 420, 130, 170, 1);
};
// The Walking Ruler: a ruler resting on two index fingers, which slide together
const fA1 = (c: Ctx) => {
  ground(c);
  const fist = (x: number, y: number, side: number) => {
    shape(c, () => rrect(c, x - 62, y + 60, 124, 90, 16), CLOTH.child);
    const f = () => rrect(c, x - 56, y - 20, 112, 100, 28);
    shape(c, f, SKIN.child); shade(c, f, SKIN.childDk, 24, 0, 0.45);
    for (let k = 0; k < 3; k++) line(c, [[x - 30 + k * 26 - side * 12, y - 14], [x - 30 + k * 26 - side * 12, y - 2]], 3, SKIN.childDk);
    shape(c, () => rrect(c, x + side * 24 - 19, y - 126, 38, 126, 19), SKIN.child, 5);
    line(c, [[x + side * 24 - 10, y - 70], [x + side * 24 + 10, y - 70]], 3, SKIN.childDk);
  };
  shadow(c, 560, 500, 420, 18);
  ruler(c, 140, 430, 820, 52, 26);
  for (let k = 0; k <= 30; k += 5) write(c, String(k), 150 + k * 26 - (k ? 36 : 20), 452, 22, INK, 3);
  fist(300, 608, 1); fist(780, 608, -1);
  arrow(c, [[380, 560], [470, 560]]); arrow(c, [[700, 560], [610, 560]]);
};
// Rollers and Marbles: the same box on three pencils, the band hardly stretched
const fA2 = (c: Ctx) => {
  ground(c); floor(c, 520);
  for (const x0 of [620, 740, 860]) { line(c, [[x0 + 12, 804], [x0 - 110, 736]], 34, INK); line(c, [[x0 + 12, 804], [x0 - 110, 736]], 24, PENCIL); shape(c, () => ell(c, x0 + 12, 804, 13, 13), "#f2d9a6", 4); }
  box(c, 560, 780, 360, 170, 150, -1, "2");
  boxBand(c, 560, 780, 360, 170, 150, [250, 695], [0.4, 0.6]);
  arrow(c, [[240, 695], [180, 695]]);
};
// The Slow Drop: the same nut falling in water, oil and honey
const fA3 = (c: Ctx) => {
  ground(c);
  const gl: [number, string][] = [[230, COL.water], [540, OIL], [850, HONEY]];
  const ny = [660, 560, 480], al = [130, 70, 30];
  gl.forEach(([x, liq], i) => {
    glass(c, x, 820, 220, 440, 0.82, liq);
    nut(c, x, ny[i], 30);
    arrow(c, [[x + 70, ny[i] + 10], [x + 70, ny[i] + 10 + al[i]]], RED, 7);
  });
};
// Wrinkled Fingers: wet marbles picked out of a bowl of water, one at a time, into a cup
const fA4 = (c: Ctx) => {
  ground(c);
  bowl(c, 380, 640, 230, COL.water);
  const r = rnd(5);
  for (let i = 0; i < 7; i++) marble(c, 230 + i * 50 + r() * 10, 636 + Math.sin(i * 1.7) * 14, 22, [COL.blue, COL.green, COL.red, COL.purple][i % 4]);
  marble(c, 820, 790, 22, COL.green); marble(c, 860, 795, 22, COL.red);
  glass(c, 840, 820, 170, 230, 0);
  hand(c, 560, 330, 0.75, 1.1, SKIN.child, CLOTH.child);
  marble(c, 630, 386, 22, COL.blue); // pinched at the fingertips
  for (const [dx, dy] of [[600, 440], [630, 470]]) shape(c, () => { c.moveTo(dx, dy - 16); c.quadraticCurveTo(dx + 11, dy - 2, dx + 11, dy + 4); c.arc(dx, dy + 4, 11, 0, Math.PI); c.quadraticCurveTo(dx - 11, dy - 2, dx, dy - 16); c.closePath(); }, COL.water, 4);
  arrow(c, [[680, 420], [790, 530]]);
};
// Which Has More Friction?: the card pile and the three tokens
const fG1 = (c: Ctx) => {
  ground(c);
  shadow(c, 570, 560, 240, 40);
  for (let k = 5; k >= 0; k--) shape(c, () => rrect(c, 390 - k * 3, 300 + k * 10, 340, 230, 16), k ? COL.cloth : WHITE, 5);
  letter(c, "A", 440, 350, 110, COL.teal, 12); letter(c, "B", 600, 350, 110, COL.orange, 12);
  line(c, [[560, 340], [560, 470]], 4, COL.grey);
  const tok: [number, string, string][] = [[300, COL.teal, "A"], [560, COL.orange, "B"], [820, COL.purple, "="]];
  tok.forEach(([x, col, ch]) => { shadow(c, x + 10, 836, 80, 22); shape(c, () => ell(c, x, 820, 85, 85), col); shape(c, () => ell(c, x, 820, 68, 68), WHITE, 4); letter(c, ch, x - 24, 780, 80, INK, 10); });
};
// Friction: a chappal on a road, friction pulling back along the road
const term0 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#6d6a70"; c.fillRect(0, 640, D, D - 640); line(c, [[0, 640], [D, 640]], 6);
  c.fillStyle = "#4e4b52"; c.fillRect(0, 640, D, 26);
  for (let x = 40; x < D; x += 190) line(c, [[x, 780], [x + 100, 780]], 10, WHITE);
  shadow(c, 560, 648, 250, 10);
  const sole = () => { c.moveTo(300, 600); c.quadraticCurveTo(280, 640, 330, 640); c.lineTo(760, 640); c.quadraticCurveTo(830, 640, 810, 600); c.lineTo(300, 600); c.closePath(); };
  shape(c, sole, "#3a3540");
  shape(c, () => { c.moveTo(300, 600); c.lineTo(810, 600); c.quadraticCurveTo(820, 570, 780, 570); c.lineTo(330, 570); c.quadraticCurveTo(290, 570, 300, 600); c.closePath(); }, COL.blue);
  shape(c, () => { c.moveTo(430, 572); c.quadraticCurveTo(560, 380, 700, 572); c.lineTo(660, 572); c.quadraticCurveTo(560, 430, 470, 572); c.closePath(); }, COL.blueDk);
  shape(c, () => rrect(c, 420, 520, 26, 56, 10), COL.blueDk, 4);
  arrow(c, [[320, 622], [190, 622]], RED, 12);
};
// Rolling friction: a suitcase on wheels and the same suitcase dragged
const term9 = (c: Ctx) => {
  ground(c); floor(c, 240); line(c, [[0, 560], [D, 560]], 4, TILE_LN);
  const bodyS = (x: number, y: number, w: number, h: number) => { const b = () => rrect(c, x, y, w, h, 18); shape(c, b, COL.teal); shade(c, b, COL.tealDk, w * 0.25, 0, 0.45); shape(c, () => rrect(c, x + 16, y + 16, w - 32, h - 32, 10), COL.tealDk, 0); shape(c, () => rrect(c, x + 16, y + 16, w - 32, h - 32, 10), COL.teal, 3); };
  // wheeled, upright: handle up, two wheels
  shadow(c, 260, 548, 120, 10);
  shape(c, () => rrect(c, 198, 240, 18, 110, 4), COL.steelDk, 4); shape(c, () => rrect(c, 304, 240, 18, 110, 4), COL.steelDk, 4);
  shape(c, () => rrect(c, 186, 226, 148, 30, 12), COL.black, 5);
  bodyS(170, 320, 180, 200);
  shape(c, () => ell(c, 200, 532, 24, 24), COL.black, 5); shape(c, () => ell(c, 320, 532, 24, 24), COL.black, 5);
  arrow(c, [[350, 242], [470, 242]], RED, 10);
  // dragged, lying flat
  shadow(c, 320, 888, 170, 12);
  bodyS(150, 700, 320, 180);
  shape(c, () => rrect(c, 470, 775, 46, 30, 8), COL.black, 5);
  arrow(c, [[520, 790], [900, 790]], RED, 10);
};
// Bollard: an iron post on a stone quay with a rope wound three times round it
const term12 = (c: Ctx) => {
  ground(c);
  c.fillStyle = STONE; c.fillRect(0, 640, D, D - 640); line(c, [[0, 640], [D, 640]], 6);
  c.strokeStyle = STONE_LN; c.lineWidth = 3;
  for (let y = 740; y < D; y += 100) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
  for (let row = 0; row < 5; row++) for (let x = row % 2 ? 110 : 10; x < D; x += 200) { c.beginPath(); c.moveTo(x, 640 + row * 100); c.lineTo(x, 740 + row * 100); c.stroke(); }
  shadow(c, 600, 650, 150, 24);
  const turns = [430, 476, 522];
  turns.forEach((y) => { c.beginPath(); c.ellipse(540, y - 4, 70, 22, 0, Math.PI, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 30; c.stroke(); c.strokeStyle = ROPE; c.lineWidth = 22; c.stroke(); });
  const post = () => rrect(c, 480, 330, 120, 320, 10);
  shape(c, post, "#3a3540"); shade(c, post, "#1d1824", 30, 0, 0.5);
  shape(c, () => rrect(c, 450, 300, 180, 50, 22), "#3a3540"); shape(c, () => ell(c, 540, 300, 88, 22), "#524c5a", 5);
  strip(c, [[0, 610], [474, 440]], 22, ROPE);
  turns.forEach((y) => { c.beginPath(); c.ellipse(540, y, 70, 22, 0, 0, Math.PI); c.strokeStyle = INK; c.lineWidth = 30; c.stroke(); c.strokeStyle = ROPE; c.lineWidth = 22; c.stroke(); });
  strip(c, [[608, 530], [700, 640], [820, 690], [960, 680], [1010, 720], [940, 760], [860, 740]], 22, ROPE);
};

export const ic_forcesFrictionL4 = cards("sci.forces.friction.L4", [e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, e2s3, fE1, fE2, fA1, fA2, fA3, fA4, fG1, term0, term9, term12]);
