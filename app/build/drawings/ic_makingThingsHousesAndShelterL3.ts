import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, SKIN, WHITE, SH, arrow, cards, ell, ground, hand, line, person, polyP, rrect, shade, shadow, shape, shine } from "./flatKit";

// HOUSES AND SHELTER L3 · picture cards: card-strip frames, roofs, rain, tiles, homes of India, builders.
// Flat DeepKids look; same child (orange) and grown-up (blue) as the set-up cards; red arrows = push / flow.

const TABLE = "#ecd3a1", TABLE_DK = "#d9b87c", CARD = "#d9b27c", CARDDK = "#b98f55", PIN = "#e0b030", PAPER = "#f3efe4";
const SKYC = "#d6ebf7", GRASS = "#8cc063", THATCH = "#c99a4a", THATCHDK = "#9a6f2c", TILE = "#c4532f", TILEDK = "#8f3a20";
const RAIN = "#4f8fd8";

const sky = (c: Ctx, hz = 760) => {
  ground(c, SKYC);
  c.fillStyle = GRASS; c.fillRect(0, hz, 1080, 1080 - hz);
  line(c, [[0, hz], [1080, hz]], 6);
};
const tableTop = (c: Ctx, y: number) => {
  ground(c);
  c.fillStyle = TABLE; c.fillRect(0, y, 1080, 1080 - y);
  c.fillStyle = TABLE_DK; c.fillRect(0, y, 1080, 10);
  line(c, [[0, y], [1080, y]], 5);
};
const drop = (c: Ctx, x: number, y: number, s = 1) =>
  shape(c, () => { c.moveTo(x, y - 20 * s); c.quadraticCurveTo(x + 16 * s, y + 2 * s, x, y + 14 * s); c.quadraticCurveTo(x - 16 * s, y + 2 * s, x, y - 20 * s); c.closePath(); }, RAIN, 3.5);
const rainLines = (c: Ctx, x0: number, x1: number, y0: number, y1: number, n: number, seed = 3) => {
  for (let i = 0; i < n; i++) { const t = ((i * 0.618 + seed * 0.13) % 1), u = ((i * 0.37 + seed * 0.29) % 1), x = x0 + t * (x1 - x0), y = y0 + u * (y1 - y0); line(c, [[x, y], [x - 14, y + 40]], 6, RAIN); }
};

// ---- card strips, pins, frames
const strip = (c: Ctx, a: number[], b: number[], w = 32, col = CARD) => { line(c, [a, b], w + 10, INK); line(c, [a, b], w, col); line(c, [[a[0] - 1, a[1] - 1], [b[0] - 1, b[1] - 1]], w * 0.16, "#ecca94"); };
const pin = (c: Ctx, x: number, y: number, r = 15) => { shape(c, () => ell(c, x, y, r, r), PIN, 5); line(c, [[x - r * 0.5, y], [x + r * 0.5, y]], 3.5); };
const frame = (c: Ctx, pts: number[][], edges: number[][], w = 32) => { edges.forEach(([a, b]) => strip(c, pts[a], pts[b], w)); pts.forEach(([x, y]) => pin(c, x, y, w * 0.46)); };
const SQ = [[0, 1], [1, 2], [2, 3], [3, 0]];
// square of side s, bottom-left corner (x, y); the top slides sideways by lean
const squarePts = (x: number, y: number, s: number, lean = 0) => { const h = Math.sqrt(s * s - lean * lean); return [[x, y], [x + s, y], [x + s + lean, y - h], [x + lean, y - h]]; };
const trianglePts = (x: number, y: number, b: number) => [[x, y], [x + b, y], [x + b / 2, y - b * 0.866]];
const ghost = (c: Ctx, pts: number[][]) => { c.save(); c.setLineDash([16, 16]); line(c, [...pts, pts[0]], 5, "#8a8398"); c.restore(); };

// a pair on the table: a square that has leaned flat, a triangle that has not; hands = which hands push
const pushPair = (c: Ctx, hands: "both" | "tri") => {
  tableTop(c, 715);
  c.save(); c.translate(540, 500); c.scale(1.04, 1.04); c.translate(-480, -610);
  shadow(c, 300, 806, 300, 18); shadow(c, 790, 806, 200, 18);
  const sq = squarePts(110, 780, 270, 130); if (hands === "tri") ghost(c, squarePts(110, 780, 270, 0));
  frame(c, sq, SQ);
  const tr = trianglePts(640, 780, 300); frame(c, tr, [[0, 1], [1, 2], [2, 0]]);
  if (hands === "both") { hand(c, 118, sq[3][1], 0, 1.15); arrow(c, [[300, 450], [450, 450]]); }
  arrow(c, [[700, 400], [850, 400]]);
  if (hands === "both") hand(c, 668, tr[2][1], 0, 1.15); else hand(c, 668, tr[2][1], 0, 1.15, SKIN.adult, CLOTH.adult);
  c.restore();
};

// ---- homes of India. base centre (x, y) on the ground, scale s (about 300 px wide at 1)
type Home = (c: Ctx, x: number, y: number, s: number) => void;
const box = (c: Ctx, x0: number, y0: number, x1: number, y1: number, fill: string, w = 6) => shape(c, () => polyP(c, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]), fill, w);
const kerala: Home = (c, x, y, s) => {
  shadow(c, x + 20 * s, y + 4, 150 * s, 14 * s);
  box(c, x - 105 * s, y - 105 * s, x + 105 * s, y, "#f4e2b0", 6);
  box(c, x - 22 * s, y - 72 * s, x + 22 * s, y, COL.soilDk, 5);
  box(c, x + 52 * s, y - 85 * s, x + 88 * s, y - 45 * s, COL.glass, 5);
  const roof = () => polyP(c, [[x - 150 * s, y - 95 * s], [x - 40 * s, y - 235 * s], [x + 40 * s, y - 235 * s], [x + 150 * s, y - 95 * s]]);
  shape(c, roof, TILE, 6); shade(c, roof, TILEDK, 25 * s, 0, 0.5);
  for (let i = 1; i < 4; i++) { const t = i / 4; line(c, [[x - 150 * s + t * 110 * s, y - 95 * s - t * 140 * s], [x + 150 * s - t * 110 * s, y - 95 * s - t * 140 * s]], 4, TILEDK); }
};
const assam: Home = (c, x, y, s) => {
  shadow(c, x + 20 * s, y + 4, 130 * s, 12 * s);
  for (const dx of [-90, -30, 30, 90]) { box(c, x + dx * s - 8 * s, y - 100 * s, x + dx * s + 8 * s, y, COL.brown, 5); }
  box(c, x - 112 * s, y - 118 * s, x + 112 * s, y - 98 * s, COL.woodDk, 5);
  box(c, x - 100 * s, y - 205 * s, x + 100 * s, y - 118 * s, "#cfc36d", 6);
  for (let i = -4; i <= 4; i++) line(c, [[x + i * 20 * s, y - 205 * s], [x + i * 20 * s, y - 118 * s]], 3, "#a89a45");
  box(c, x - 18 * s, y - 175 * s, x + 18 * s, y - 118 * s, COL.soilDk, 5);
  const roof = () => polyP(c, [[x - 135 * s, y - 195 * s], [x - 10 * s, y - 275 * s], [x + 10 * s, y - 275 * s], [x + 135 * s, y - 195 * s]]);
  shape(c, roof, THATCH, 6); shade(c, roof, THATCHDK, 20 * s, 0, 0.5);
  line(c, [[x + 125 * s, y - 100 * s], [x + 158 * s, y]], 6); line(c, [[x + 140 * s, y - 100 * s], [x + 173 * s, y]], 6);
  for (let i = 1; i < 4; i++) line(c, [[x + (125 + i * 8) * s, y - 100 * s + i * 25 * s], [x + (140 + i * 8) * s, y - 100 * s + i * 25 * s]], 5);
};
const ladakh: Home = (c, x, y, s) => {
  shadow(c, x + 20 * s, y + 4, 140 * s, 12 * s);
  box(c, x - 115 * s, y - 150 * s, x + 115 * s, y, "#efe3cc", 6);
  box(c, x - 126 * s, y - 168 * s, x + 126 * s, y - 146 * s, "#8a6a4a", 5);
  for (const dx of [-70, 45]) { box(c, x + dx * s, y - 112 * s, x + (dx + 36) * s, y - 62 * s, "#4a3a30", 5); line(c, [[x + dx * s - 5 * s, y - 118 * s], [x + (dx + 41) * s, y - 118 * s]], 6, "#8a6a4a"); }
  box(c, x - 18 * s, y - 70 * s, x + 18 * s, y, "#4a3a30", 5);
  line(c, [[x - 100 * s, y - 168 * s], [x - 100 * s, y - 235 * s]], 6); line(c, [[x + 100 * s, y - 168 * s], [x + 100 * s, y - 225 * s]], 6);
  line(c, [[x - 100 * s, y - 232 * s], [x + 100 * s, y - 222 * s]], 3);
  ["#d7372b", "#ffd34d", "#3fb1a8", "#f3efe4", "#6aa53f"].forEach((col, i) => shape(c, () => polyP(c, [[x - 80 * s + i * 40 * s, y - 230 * s + i * 2 * s], [x - 50 * s + i * 40 * s, y - 229 * s + i * 2 * s], [x - 50 * s + i * 40 * s, y - 205 * s + i * 2 * s], [x - 80 * s + i * 40 * s, y - 206 * s + i * 2 * s]]), col, 3));
};
const bhunga: Home = (c, x, y, s) => {
  shadow(c, x + 15 * s, y + 4, 120 * s, 12 * s);
  shape(c, () => rrect(c, x - 85 * s, y - 105 * s, 170 * s, 105 * s, 14 * s), "#d8b48a", 6);
  shade(c, () => rrect(c, x - 85 * s, y - 105 * s, 170 * s, 105 * s, 14 * s), "#b98f68", 22 * s, 0, 0.5);
  for (let i = -3; i <= 3; i++) if (i !== 0) shape(c, () => ell(c, x + i * 24 * s, y - 70 * s, 6 * s, 6 * s), WHITE, 3);
  shape(c, () => { c.moveTo(x - 20 * s, y); c.lineTo(x - 20 * s, y - 40 * s); c.quadraticCurveTo(x, y - 66 * s, x + 20 * s, y - 40 * s); c.lineTo(x + 20 * s, y); c.closePath(); }, "#4a3a30", 5);
  const roof = () => polyP(c, [[x - 115 * s, y - 95 * s], [x - 6 * s, y - 225 * s], [x + 6 * s, y - 225 * s], [x + 115 * s, y - 95 * s]]);
  shape(c, roof, THATCH, 6); shade(c, roof, THATCHDK, 25 * s, 0, 0.5);
  for (const t of [-0.5, 0, 0.5]) line(c, [[x + t * 100 * s, y - 100 * s], [x + t * 12 * s, y - 215 * s]], 3.5, THATCHDK);
};
const toda: Home = (c, x, y, s) => {
  shadow(c, x + 15 * s, y + 4, 130 * s, 12 * s);
  const hut = () => { c.moveTo(x - 115 * s, y); c.bezierCurveTo(x - 115 * s, y - 200 * s, x + 115 * s, y - 200 * s, x + 115 * s, y); c.closePath(); };
  shape(c, hut, THATCH, 6); shade(c, hut, THATCHDK, 28 * s, 0, 0.5);
  for (let i = 1; i < 4; i++) { const hh = y - i * 36 * s, w = 105 * s * Math.sqrt(Math.max(0.05, 1 - Math.pow(i * 36 / 148, 2))); line(c, [[x - w, hh], [x + w, hh]], 3.5, THATCHDK); }
  shape(c, () => { c.moveTo(x - 24 * s, y); c.lineTo(x - 24 * s, y - 38 * s); c.quadraticCurveTo(x, y - 62 * s, x + 24 * s, y - 38 * s); c.lineTo(x + 24 * s, y); c.closePath(); }, "#4a3a30", 5);
};
const flats = (c: Ctx, x: number, y: number, s: number, col = "#dcc3a8", rows = 6) => {
  shadow(c, x + 15 * s, y + 4, 90 * s, 10 * s);
  box(c, x - 75 * s, y - (rows * 54 + 12) * s, x + 75 * s, y, col, 6);
  for (let r = 0; r < rows; r++) for (let k = 0; k < 3; k++) box(c, x - 54 * s + k * 44 * s, y - (rows * 54 + 2) * s + r * 54 * s + 6 * s, x - 30 * s + k * 44 * s, y - (rows * 54 + 2) * s + r * 54 * s + 40 * s, COL.sky, 4);
  box(c, x - 18 * s, y - 40 * s, x + 18 * s, y, COL.soilDk, 4);
};
const flatsHome: Home = (c, x, y, s) => flats(c, x, y, s * 0.85, "#dcc3a8", 5);

// ---- newspaper sticks and bamboo poles
const stick = (c: Ctx, a: number[], b: number[], w = 14, col = PAPER, edge = 8) => { line(c, [a, b], w + edge, INK); line(c, [a, b], w, col); };
const paperStick = (c: Ctx, a: number[], b: number[], w = 16) => { stick(c, a, b, w); line(c, [a, b], 2.5, "#b9b4ab"); };
const bamboo = (c: Ctx, a: number[], b: number[], w = 16) => {
  stick(c, a, b, w, "#a9c24f");
  const n = 4, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  for (let i = 1; i < n; i++) { const t = i / n, px = a[0] + dx * t, py = a[1] + dy * t; line(c, [[px - nx * w * 0.6, py - ny * w * 0.6], [px + nx * w * 0.6, py + ny * w * 0.6]], 3.5, "#6e8a2a"); }
};
const rope = (c: Ctx, x: number, y: number, r = 14) => { shape(c, () => ell(c, x, y, r, r * 0.8), RED, 4); };

// ---- people helpers
const builder = (c: Ctx, x: number, y: number, h: number, bricks = false, armL?: [number, number], armR?: [number, number]) => {
  const head = h * 0.13, sh = y - h * 0.74, hip = y - h * 0.42, hy = sh - head * 1.05;
  person(c, x, y, h, { adult: true, armL: bricks ? [Math.PI * 0.5, 0.1] : armL, armR: bricks ? [Math.PI * 0.5, Math.PI - 0.1] : armR });
  for (const s of [-1, 1]) shape(c, () => rrect(c, x + s * h * 0.06 - h * 0.05, y - h * 0.05, h * 0.1, h * 0.06, 8), COL.soilDk, 5);
  const vest = () => rrect(c, x - h * 0.13, sh - h * 0.02, h * 0.26, hip - sh + h * 0.06, h * 0.06);
  shape(c, vest, "#ff8a1f", 5);
  c.save(); c.beginPath(); vest(); c.clip(); for (const f of [0.35, 0.65]) line(c, [[x - h * 0.2, sh + (hip - sh) * f], [x + h * 0.2, sh + (hip - sh) * f]], h * 0.022, "#f4f1b8"); c.restore();
  shape(c, () => { c.moveTo(x - head * 1.12, hy - head * 0.05); c.bezierCurveTo(x - head * 1.12, hy - head * 1.9, x + head * 1.12, hy - head * 1.9, x + head * 1.12, hy - head * 0.05); c.closePath(); }, COL.yellow, 5);
  line(c, [[x - head * 1.3, hy - head * 0.05], [x + head * 1.3, hy - head * 0.05]], 8);
  line(c, [[x, hy - head * 1.45], [x, hy - head * 0.1]], 4);
  shape(c, () => ell(c, x - head * 1.18, hy + head * 0.9, head * 0.28, head * 1.0, 0.1), CLOTH.hair, 4);
  if (bricks) for (let r = 0; r < 3; r++) for (let k = 0; k < 2; k++) shape(c, () => rrect(c, x - h * 0.15 + k * h * 0.15, sh + h * 0.16 - r * h * 0.06, h * 0.15, h * 0.06, 3), r % 2 ? "#c4532f" : "#b8472a", 4);
};

// ---- the cards
const cIntro = (c: Ctx) => pushPair(c, "both");

const cSummary = (c: Ctx) => {
  sky(c, 520);
  kerala(c, 180, 500, 0.9); assam(c, 540, 500, 0.9); ladakh(c, 900, 500, 0.9);
  bhunga(c, 180, 880, 0.95); flats(c, 900, 880, 0.78, "#dcc3a8", 5);
  shadow(c, 545, 890, 190, 16);
  frame(c, trianglePts(390, 880, 310), [[0, 1], [1, 2], [2, 0]], 28);
};

const cE1 = (c: Ctx) => {
  tableTop(c, 690);
  c.save(); c.translate(0, -70);
  shadow(c, 190, 770, 150, 16); shadow(c, 560, 770, 170, 16); shadow(c, 900, 770, 150, 16);
  frame(c, squarePts(70, 740, 240), SQ);
  frame(c, trianglePts(400, 740, 300), [[0, 1], [1, 2], [2, 0]]);
  const b = squarePts(780, 740, 240); frame(c, b, [...SQ, [0, 2]]);
  c.restore();
};

const cE2 = (c: Ctx) => {
  ground(c);
  const rows = [{ ang: 0.0, books: 0 }, { ang: 0.1, books: 1 }, { ang: 0.3, books: 3 }];
  rows.forEach((o, i) => {
    const base = 320 + i * 350, L = 620, x = 110, lowX = x + Math.cos(o.ang) * L;
    c.fillStyle = TABLE; c.fillRect(0, base, 1080, 24); line(c, [[0, base], [1080, base]], 5);
    shadow(c, 450, base + 16, 340, 8);
    for (let k = 0; k < o.books; k++) shape(c, () => rrect(c, x - 20, base - 24 * (k + 1), 170, 24, 3), ["#d7372b", "#5b8fd6", "#6aa53f"][k], 5);
    c.save(); c.translate(lowX, base); c.rotate(o.ang);
    shape(c, () => polyP(c, [[-L, -22], [0, -22], [0, 0], [-L, 0]]), COL.teal, 6);
    shape(c, () => polyP(c, [[-L, -22], [-L + 10, -46], [-10, -46], [0, -22]]), COL.tealDk, 5);
    c.restore();
    const mx = x + L * 0.5, my = base - 40 - Math.sin(o.ang) * L * 0.5;
    shape(c, () => ell(c, mx, my, 70, 12, o.ang), COL.water, 4);
    drop(c, mx, my - 60, 1.1); drop(c, mx, my - 110, 1);
    shape(c, () => ell(c, mx - 4, my - 160, 34, 20, -0.2), COL.steel, 5); line(c, [[mx + 30, my - 168], [mx + 100, my - 200]], 14, INK); line(c, [[mx + 30, my - 168], [mx + 100, my - 200]], 7, COL.steel);
    if (o.books) arrow(c, [[mx + 80, my - 5 + o.ang * 80], [lowX - 20, base - 60 + o.ang * 40]], RED, 9);
    shape(c, () => { c.moveTo(lowX + 20, base - 70); c.bezierCurveTo(lowX + 30, base + 10, lowX + 190, base + 10, lowX + 200, base - 70); c.closePath(); }, COL.steel, 6);
    shape(c, () => ell(c, lowX + 110, base - 70, 90, 16), COL.steelIn, 5);
  });
};

// roof tiles on a slope (local frame: x runs down the slope, y up is negative). Tiles tilt a little so
// the overlap shows: upperOver = each higher tile lies on top of the one below it
const tiles = (c: Ctx, n: number, len: number, step: number, upperOver: boolean, th = 26) => {
  const idx = [...Array(n).keys()];
  (upperOver ? idx.reverse() : idx).forEach((k) => {
    const x0 = k * step, a = upperOver ? 0 : -th, b = upperOver ? -th : 0;
    shape(c, () => polyP(c, [[x0, a], [x0 + len, b], [x0 + len, b - th], [x0, a - th]]), k % 2 ? "#d9684a" : TILE, 5);
  });
};
const roofModel = (c: Ctx, ox: number, oy: number, ang: number, upperOver: boolean, big = 1) => {
  c.save(); c.translate(ox, oy); c.rotate(ang); c.scale(big, big);
  shape(c, () => polyP(c, [[-30, 0], [520, 0], [520, 16], [-30, 16]]), CARD, 5);
  tiles(c, 4, 150, 115, upperOver);
  c.restore();
};
const cE3 = (c: Ctx) => {
  tableTop(c, 800);
  const roof = (cx: number, upperOver: boolean) => {
    const ox = cx - 240, oy = 560, ang = 0.3;
    shape(c, () => polyP(c, [[cx - 150, 800], [cx + 150, 800], [cx + 190, 850], [cx - 190, 850]]), WHITE, 5);
    for (let k = 0; k < 4; k++) shape(c, () => rrect(c, ox - 30, 800 - 34 * (k + 1), 120, 34, 3), ["#d7372b", "#5b8fd6", "#6aa53f", "#f39a3c"][k], 5);
    for (let k = 0; k < 2; k++) shape(c, () => rrect(c, ox + 390, 800 - 34 * (k + 1), 100, 34, 3), ["#5b8fd6", "#d7372b"][k], 5);
    roofModel(c, ox, oy, ang, upperOver);
  };
  roof(270, true); roof(790, false);
  for (const x of [200, 260, 320]) { drop(c, x, 360 + (x - 200) * 0.3, 1); drop(c, x + 520, 360 + (x - 200) * 0.3, 1); }
  arrow(c, [[140, 470], [300, 540]], RED, 8);
  // right: water finds the gaps and drops onto the tissue
  for (const [x, y] of [[760, 760], [850, 735]]) drop(c, x, y, 1);
  for (const [x, y] of [[740, 822], [800, 830], [870, 820]]) shape(c, () => ell(c, x, y, 28, 11), COL.water, 3);
};

// ---- more scenes
const windowPane = (c: Ctx, x: number, y: number, w: number, h: number) => {
  box(c, x - 8, y - 8, x + w + 8, y + h + 8, COL.woodDk, 6); box(c, x, y, x + w, y + h, COL.sky, 5);
  shine(c, [[x + 24, y + 30], [x + 70, y + 30]], 9);
};
const cA1 = (c: Ctx) => {
  ground(c, "#f2e6d0"); c.fillStyle = "#d8c9a6"; c.fillRect(0, 800, 1080, 280); line(c, [[0, 800], [1080, 800]], 6);
  for (let i = 1; i < 6; i++) line(c, [[i * 216, 800], [i * 216 - 100 + i * 20, 1080]], 3, "#b9a77f");
  windowPane(c, 700, 230, 300, 330);
  line(c, [[850, 230], [850, 560]], 6); line(c, [[700, 395], [1000, 395]], 6);
  shape(c, () => rrect(c, 40, 260, 140, 540, 6), COL.soil, 6); shape(c, () => ell(c, 150, 540, 9, 9), COL.yellow, 3);
  shadow(c, 330, 940, 150, 18); shadow(c, 560, 940, 120, 14);
  person(c, 350, 940, 640, { adult: true, armL: [2.0, 1.0], armR: [1.6, 3.1] });
  shape(c, () => polyP(c, [[375, 640], [470, 625], [480, 740], [385, 752]]), WHITE, 5); [655, 680, 705].forEach((y) => line(c, [[395, y - 8 + (y - 655) * 0.1], [455, y - 14 + (y - 655) * 0.1]], 3, COL.blueDk));
  person(c, 600, 940, 470, { armR: [-0.35, -0.2], armL: [1.7, 1.6] });
  arrow(c, [[690, 640], [760, 590]], RED, 9);
};

const lattice = (c: Ctx, cx: number, base: number, top: number, wB: number, wT: number, n: number, w = 16, col = PAPER) => {
  const L = (t: number) => cx - (wB + (wT - wB) * t) / 2, R = (t: number) => cx + (wB + (wT - wB) * t) / 2, Y = (t: number) => base + (top - base) * t;
  const st = (a: number[], b: number[]) => stick(c, a, b, w, col);
  st([L(0), Y(0)], [L(1), Y(1)]); st([R(0), Y(0)], [R(1), Y(1)]);
  for (let i = 0; i < n; i++) { const t0 = i / n, t1 = (i + 1) / n; st([L(t0), Y(t0)], [R(t0), Y(t0)]); if (i % 2) st([R(t0), Y(t0)], [L(t1), Y(t1)]); else st([L(t0), Y(t0)], [R(t1), Y(t1)]); }
  st([L(1), Y(1)], [R(1), Y(1)]);
};
const cA2 = (c: Ctx) => {
  ground(c, SKYC); c.fillStyle = "#c8c0b4"; c.fillRect(0, 640, 1080, 440);
  box(c, 430, 560, 1000, 700, "#dcc3a8", 6); for (let k = 0; k < 5; k++) box(c, 470 + k * 100, 600, 520 + k * 100, 650, COL.sky, 4);
  lattice(c, 715, 560, 130, 200, 40, 6, 14, COL.steelDk);
  [[715, 560, 130]].forEach(() => 0);
  line(c, [[715, 130], [715, 90]], 8); shape(c, () => ell(c, 715, 80, 12, 12), RED, 4);
  // window frame with a grille, the child inside
  c.fillStyle = COL.woodDk; for (const [x0, y0, x1, y1] of [[0, 0, 1080, 70], [0, 1010, 1080, 1080], [0, 0, 70, 1080], [1010, 0, 1080, 1080]]) c.fillRect(x0, y0, x1 - x0, y1 - y0);
  c.strokeStyle = INK; c.lineWidth = 6; c.strokeRect(70, 70, 940, 940);
  for (let x = 170; x < 1010; x += 130) line(c, [[x, 70], [x, 1010]], 14, INK), line(c, [[x, 70], [x, 1010]], 6, COL.steelDk);
  for (const y of [330, 700]) line(c, [[70, y], [1010, y]], 14, INK), line(c, [[70, y], [1010, y]], 6, COL.steelDk);
  shadow(c, 260, 1030, 150, 12);
  person(c, 260, 1030, 560, { armR: [-0.7, -0.5], armL: [1.7, 1.6] });
  arrow(c, [[420, 520], [520, 420]], RED, 9);
};

const cA3 = (c: Ctx) => {
  ground(c, TABLE);
  const hs: [Home, string][] = [[kerala, "#7ec8a8"], [assam, "#8fc3ea"], [ladakh, "#f2c063"], [bhunga, "#f29ab4"], [toda, "#b9a6e0"], [flatsHome, "#f39a3c"]];
  hs.forEach(([h, col], i) => {
    const x = 40 + (i % 3) * 340, y = 60 + Math.floor(i / 3) * 500;
    shadow(c, x + 160, y + 465, 150, 14);
    shape(c, () => rrect(c, x, y, 320, 450, 18), WHITE, 6);
    shape(c, () => rrect(c, x + 20, y + 20, 280, 70, 12), col, 5);
    shape(c, () => ell(c, x + 160, y + 55, 14, 14), WHITE, 4);
    h(c, x + 160, y + 400, h === flatsHome ? 0.95 : 0.78);
  });
};

const cA4 = (c: Ctx) => {
  ground(c, SKYC);
  const pipe = (a: number[], b: number[]) => stick(c, a, b, 20, COL.steel, 10);
  for (const x of [120, 420, 980]) pipe([x, 120], [x, 860]);
  for (const y of [300, 580]) pipe([60, y], [1030, y]);
  pipe([120, 580], [420, 300]); pipe([420, 580], [980, 300]);
  box(c, 0, 840, 1080, 880, COL.wood, 6); box(c, 0, 880, 1080, 1080, "#b8472a", 6);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 8; k++) line(c, [[k * 140 + (r % 2) * 70, 880 + r * 50], [k * 140 + (r % 2) * 70, 930 + r * 50]], 3, "#8f3a20");
  shadow(c, 700, 860, 150, 12);
  const h = 600, x = 700, y = 840, sh = y - h * 0.74, hip = y - h * 0.42;
  builder(c, x, y, h, false, [-2.2, -2.0], [Math.PI * 0.5, Math.PI * 0.5]);
  // harness straps and the rope clipped to the pole
  line(c, [[x - h * 0.1, sh + h * 0.02], [x + h * 0.1, hip]], 9, "#5a3a8a"); line(c, [[x + h * 0.1, sh + h * 0.02], [x - h * 0.1, hip]], 9, "#5a3a8a");
  line(c, [[x + h * 0.1, hip - 10], [980, 580]], 12, INK); line(c, [[x + h * 0.1, hip - 10], [980, 580]], 6, "#f4f1b8");
  shape(c, () => ell(c, 980, 580, 18, 18), RED, 5);
};

const cP1 = (c: Ctx) => {
  tableTop(c, 800); ground(c, "#e9dcc2"); c.fillStyle = "#c9a878"; c.fillRect(0, 800, 1080, 280); line(c, [[0, 800], [1080, 800]], 5);
  const f = [[150, 830], [650, 830], [400, 380]], b = [[400, 740], [900, 740], [650, 290]];
  shadow(c, 520, 850, 420, 22);
  // back frame
  paperStick(c, b[0], b[2]); paperStick(c, b[1], b[2]); paperStick(c, b[0], b[1]);
  paperStick(c, f[1], b[1]); paperStick(c, f[0], b[0]);
  // sheet over the right slope
  c.save(); c.globalAlpha = 0.93; shape(c, () => polyP(c, [f[2], f[1], b[1], b[2]]), "#8fc3ea", 6); c.globalAlpha = 1;
  line(c, [[520, 560], [770, 500]], 4, COL.blueDk); line(c, [[560, 700], [790, 640]], 4, COL.blueDk); c.restore();
  paperStick(c, f[2], b[2]);
  paperStick(c, f[0], f[2]);
  shadow(c, 390, 835, 110, 12);
  person(c, 390, 830, 330, { sit: true });
  paperStick(c, f[1], f[2]); paperStick(c, f[0], f[1]);
  [f[0], f[1], f[2]].forEach(([x, y]) => shape(c, () => rrect(c, x - 20, y - 14, 40, 28, 6), "#f2e6c0", 4));
};

const fan = (c: Ctx, x: number, y: number) => {
  shadow(c, x, y + 4, 90, 12);
  shape(c, () => polyP(c, [[x - 70, y], [x + 70, y], [x + 40, y - 40], [x - 40, y - 40]]), COL.blue, 6);
  line(c, [[x, y - 40], [x, y - 130]], 20, INK); line(c, [[x, y - 40], [x, y - 130]], 10, COL.blueDk);
  shape(c, () => ell(c, x, y - 250, 70, 130), COL.glass, 6);
  for (const k of [-0.6, -0.2, 0.2, 0.6]) line(c, [[x + k * 70, y - 250 - 125 * Math.sqrt(1 - k * k)], [x + k * 70, y - 250 + 125 * Math.sqrt(1 - k * k)]], 3, COL.steelDk);
  for (const a of [-0.7, 0.7]) shape(c, () => ell(c, x - 6, y - 250 + a * 55, 40, 14, a), COL.blueDk, 4);
  shape(c, () => ell(c, x - 6, y - 250, 16, 16), COL.steel, 5);
};
const cC1 = (c: Ctx) => {
  tableTop(c, 880);
  fan(c, 150, 870);
  for (const y of [560, 650, 740]) { c.beginPath(); c.moveTo(250, y); c.bezierCurveTo(300, y - 25, 350, y + 25, 400, y); c.strokeStyle = RED; c.lineWidth = 10; c.lineCap = "round"; c.stroke(); }
  arrow(c, [[420, 560], [520, 560]]); arrow(c, [[420, 650], [520, 650]]); arrow(c, [[420, 740], [520, 740]]);
  shadow(c, 760, 886, 190, 14);
  lattice(c, 760, 880, 190, 340, 120, 7);
};

const cC2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = TABLE; c.fillRect(0, 860, 1080, 220); line(c, [[0, 860], [1080, 860]], 5);
  shadow(c, 540, 880, 440, 22);
  // the tub, water 3 cm deep, the house on pencil stilts
  const px = [330, 450, 630, 750];
  px.forEach((x) => { box(c, x - 14, 520, x + 14, 800, "#f2c84d", 5); shape(c, () => polyP(c, [[x - 14, 800], [x + 14, 800], [x, 826]]), "#e8c9a0", 4); });
  box(c, 270, 470, 810, 510, CARDDK, 5);
  box(c, 290, 280, 790, 470, "#f6efd8", 6);
  box(c, 310, 300, 770, 450, "#e7dcc0", 4);
  box(c, 440, 410, 640, 452, WHITE, 4);
  shape(c, () => polyP(c, [[250, 290], [540, 120], [830, 290]]), TILE, 6);
  shape(c, () => rrect(c, 120, 600, 840, 240, 20), "rgba(214,236,250,0.35)", 7);
  c.save(); c.globalAlpha = 0.85; shape(c, () => polyP(c, [[130, 720], [950, 720], [950, 820], [130, 820]]), COL.water, 0); c.restore();
  line(c, [[130, 720], [950, 720]], 5, COL.waterDk);
  arrow(c, [[170, 770], [320, 770]], RED, 9); arrow(c, [[920, 770], [770, 770]], RED, 9);
};

// ---- terms
const cT0 = (c: Ctx) => {
  sky(c, 800);
  rainLines(c, 20, 1060, 40, 640, 34);
  shadow(c, 540, 820, 380, 16);
  for (const x of [250, 830]) box(c, x - 14, 400, x + 14, 800, COL.steel, 5);
  box(c, 200, 780, 880, 800, COL.steelDk, 4);
  shape(c, () => polyP(c, [[170, 400], [910, 400], [880, 350], [200, 350]]), COL.teal, 6);
  box(c, 330, 700, 750, 730, CARD, 5);
  line(c, [[360, 730], [360, 780]], 8); line(c, [[720, 730], [720, 780]], 8);
  person(c, 450, 725, 330, { sit: true, adult: true }); person(c, 620, 725, 250, { sit: true });
  for (const x of [100, 960]) shape(c, () => ell(c, x, 800, 40, 8), COL.water, 3);
};
const cT1 = (c: Ctx) => {
  ground(c, "#d9cfc0"); c.fillStyle = TABLE_DK; c.fillRect(0, 880, 1080, 200); line(c, [[0, 880], [1080, 880]], 5);
  const door = (x: number, fill: string, dk: string, deco: () => void) => {
    shadow(c, x + 130, 890, 140, 14);
    box(c, x - 10, 230, x + 270, 880, "#7d7870", 6); box(c, x, 240, x + 260, 880, fill, 6); deco();
    shape(c, () => ell(c, x + 215, 580, 18, 18), COL.yellow, 5);
  };
  door(40, COL.wood, COL.woodDk, () => { for (let i = 1; i < 5; i++) line(c, [[40 + i * 52, 240], [40 + i * 52, 880]], 5, COL.woodDk); line(c, [[40, 400], [300, 400]], 5, COL.woodDk); });
  door(410, COL.steel, COL.steelDk, () => { for (let r = 0; r < 6; r++) for (let k = 0; k < 2; k++) shape(c, () => ell(c, 440 + k * 200, 280 + r * 110, 8, 8), COL.steelDk, 3); line(c, [[410, 560], [670, 560]], 5, COL.steelDk); shine(c, [[440, 300], [440, 520]]); });
  door(780, "#9ad0e8", "#6aa5c4", () => { shape(c, () => rrect(c, 800, 280, 220, 240, 10), "#b8e0f2", 5); shape(c, () => rrect(c, 800, 570, 220, 270, 10), "#b8e0f2", 5); });
};
const cT2 = (c: Ctx) => {
  ground(c, "#e9dcc2"); c.fillStyle = TABLE_DK; c.fillRect(0, 800, 1080, 280); line(c, [[0, 800], [1080, 800]], 5);
  shadow(c, 540, 930, 450, 40);
  shape(c, () => { c.moveTo(60, 900); c.bezierCurveTo(70, 700, 260, 640, 380, 900); c.closePath(); }, COL.soil, 6);
  for (const [x, y, r] of [[230, 800, 36], [330, 860, 26], [150, 860, 28]]) shape(c, () => ell(c, x, y, r, r * 0.8), COL.soilDk, 3);
  for (const [x, y, r] of [[460, 900, 70], [560, 880, 56], [650, 920, 60]]) { shape(c, () => ell(c, x, y, r, r * 0.8, 0.2), COL.grey, 5); shade(c, () => ell(c, x, y, r, r * 0.8, 0.2), COL.greyDk, r * 0.3, r * 0.2, 0.5); }
  bamboo(c, [450, 880], [700, 400], 30); bamboo(c, [520, 890], [800, 470], 30); bamboo(c, [400, 890], [620, 360], 30);
  for (let i = 0; i < 7; i++) { const x = 790 + i * 30; line(c, [[x, 900], [x - 30 + i * 14, 620]], 14, INK); line(c, [[x, 900], [x - 30 + i * 14, 620]], 7, i % 2 ? "#e6c75a" : "#d4b040"); }
  line(c, [[800, 780], [1010, 780]], 14, INK); line(c, [[800, 780], [1010, 780]], 8, RED);
};
const cT3 = (c: Ctx) => {
  sky(c, 800);
  shadow(c, 540, 810, 440, 16);
  const P: number[][] = [[160, 800, 160, 360], [420, 800, 420, 360], [660, 800, 660, 360], [920, 800, 920, 360]].map((a) => a);
  P.forEach(([x0, y0, x1, y1]) => bamboo(c, [x0, y0], [x1, y1], 28));
  bamboo(c, [140, 360], [940, 360], 26); bamboo(c, [140, 600], [940, 600], 24);
  bamboo(c, [160, 600], [420, 360], 22); bamboo(c, [420, 600], [660, 360], 22); bamboo(c, [660, 600], [920, 360], 22);
  bamboo(c, [160, 360], [540, 170], 24); bamboo(c, [920, 360], [540, 170], 24); bamboo(c, [420, 360], [540, 170], 20); bamboo(c, [660, 360], [540, 170], 20);
  for (const [x, y] of [[160, 360], [420, 360], [660, 360], [920, 360], [160, 600], [420, 600], [660, 600], [920, 600], [540, 170]]) rope(c, x, y, 16);
};
const cT4 = (c: Ctx) => {
  ground(c, TABLE);
  shadow(c, 560, 780, 400, 30);
  const A = [180, 650], B = [560, 330], C2 = [400, 420], D = [900, 700];
  strip(c, [200, 640], [640, 400], 120); strip(c, [440, 400], [900, 640], 120);
  shape(c, () => ell(c, 430, 520, 60, 60), PIN, 8); shape(c, () => ell(c, 430, 520, 36, 36), "#fff2b8", 5); line(c, [[395, 520], [465, 520]], 7);
  for (const [x, y, an] of [[300, 640, 0.0]]) { shape(c, () => ell(c, 280, 590, 30, 30), TABLE_DK, 5); shape(c, () => ell(c, 770, 610, 30, 30), TABLE_DK, 5); }
  arrow(c, [[300, 260], [380, 330]], RED, 10); arrow(c, [[900, 260], [820, 330]], RED, 10);
};
const cT5 = (c: Ctx) => pushPair(c, "tri");
const cT6 = (c: Ctx) => {
  sky(c, 800);
  shadow(c, 540, 810, 420, 16);
  box(c, 90, 280, 150, 800, COL.brown, 6); box(c, 930, 280, 990, 800, COL.brown, 6);
  const L = 150, R = 930, T = 330, Bt = 740;
  box(c, L, T - 20, R, T + 30, COL.wood, 5); box(c, L, Bt - 30, R, Bt + 20, COL.wood, 5); box(c, L, 505, R, 555, COL.wood, 5);
  strip(c, [L + 30, Bt], [R - 30, T], 54, COL.wood);
  for (const y of [T, Bt]) shape(c, () => ell(c, L - 18, y, 14, 14), COL.steelDk, 4);
};
const cT7 = (c: Ctx) => {
  ground(c, SKYC); c.fillStyle = COL.water; c.fillRect(0, 780, 1080, 300); line(c, [[0, 780], [1080, 780]], 6);
  for (const y of [860, 940, 1020]) line(c, [[60, y], [1020, y]], 5, COL.waterDk);
  for (const x of [160, 920]) box(c, x - 40, 500, x + 40, 800, COL.grey, 6);
  box(c, 0, 470, 1080, 520, COL.steelDk, 5);
  const top = 220, bot = 470, n = 6, x0 = 120, dx = 140;
  const st = (a: number[], b: number[]) => stick(c, a, b, 22, COL.blue, 10);
  for (let i = 0; i <= n; i++) { if (i < n) { st([x0 + i * dx, bot], [x0 + i * dx + dx / 2, top]); st([x0 + i * dx + dx / 2, top], [x0 + (i + 1) * dx, bot]); } }
  st([x0, bot], [x0 + n * dx, bot]); st([x0 + dx / 2, top], [x0 + n * dx - dx / 2, top]);
  line(c, [[0, 470], [1080, 470]], 4);
  for (let i = 0; i < 20; i++) line(c, [[i * 56, 520], [i * 56, 540]], 6);
  line(c, [[0, 456], [1080, 456]], 8, COL.greyDk);
};
const cT8 = (c: Ctx) => {
  sky(c, 900);
  shadow(c, 540, 910, 380, 18);
  box(c, 200, 400, 880, 900, "#e8d8b8", 6);
  for (const x of [300, 560, 770]) box(c, x - 40, 520, x + 40, 620, COL.sky, 5);
  box(c, 470, 780, 610, 900, COL.soilDk, 5);
  box(c, 180, 370, 900, 410, COL.greyDk, 5);
  shape(c, () => rrect(c, 380, 190, 320, 180, 40), "#3a3540", 6); shape(c, () => rrect(c, 520, 160, 40, 30, 8), "#3a3540", 5); shine(c, [[420, 230], [420, 330]]);
  arrow(c, [[300, 100], [300, 290]], RED, 12); arrow(c, [[540, 90], [540, 200]], RED, 12); arrow(c, [[780, 100], [780, 300]], RED, 12);
  arrow(c, [[120, 440], [120, 800]], RED, 12); arrow(c, [[960, 440], [960, 800]], RED, 12);
};
const cT9 = (c: Ctx) => {
  sky(c, 800);
  rainLines(c, 20, 1060, 20, 460, 24, 5);
  shadow(c, 540, 810, 440, 16);
  box(c, 60, 560, 480, 800, "#f4e2b0", 6); shape(c, () => polyP(c, [[30, 565], [270, 260], [510, 565]]), TILE, 6);
  box(c, 600, 560, 1020, 800, "#f4e2b0", 6); shape(c, () => polyP(c, [[580, 570], [1040, 570], [1040, 540], [580, 540]]), TILE, 6);
  box(c, 220, 680, 320, 800, COL.soilDk, 5); box(c, 760, 680, 860, 800, COL.soilDk, 5);
  arrow(c, [[160, 410], [100, 505]], RED, 9); arrow(c, [[380, 410], [440, 505]], RED, 9);
  shape(c, () => ell(c, 810, 536, 120, 14), COL.water, 4);
  for (const x of [700, 810, 920]) drop(c, x, 480, 1);
};
const cT10 = (c: Ctx) => {
  sky(c, 780);
  shadow(c, 540, 790, 420, 16);
  box(c, 250, 560, 830, 780, "#d8b48a", 6);
  box(c, 480, 640, 600, 780, COL.soilDk, 5);
  const roof = () => { c.moveTo(130, 590); c.lineTo(360, 230); c.lineTo(720, 230); c.lineTo(950, 590); for (let i = 0; i < 12; i++) { c.lineTo(950 - i * 76 - 38, 640 + (i % 2) * 8); c.lineTo(950 - (i + 1) * 76, 590); } c.closePath(); };
  shape(c, roof, THATCH, 6); shade(c, roof, THATCHDK, 40, 0, 0.5);
  for (let i = 0; i < 9; i++) line(c, [[250 + i * 70, 250 + (i % 2) * 40], [160 + i * 85, 600]], 4, THATCHDK);
  for (const x of [190, 260, 330]) shape(c, () => ell(c, x, 680, 12, 12), "#4a3a30", 0);
};
const cT11 = (c: Ctx) => {
  ground(c, SKYC); c.fillStyle = "#b09a7a"; c.fillRect(0, 680, 1080, 400); line(c, [[0, 680], [1080, 680]], 6);
  c.fillStyle = "#6a4128"; c.fillRect(0, 680, 1080, 40);
  line(c, [[480, 680], [520, 740], [490, 800], [540, 870], [520, 960], [560, 1080]], 14, INK);
  line(c, [[480, 680], [520, 740], [490, 800], [540, 870], [520, 960], [560, 1080]], 6, "#2b2340");
  shadow(c, 540, 690, 260, 14);
  box(c, 330, 460, 750, 690, "#f4e2b0", 6); shape(c, () => polyP(c, [[300, 470], [540, 270], [780, 470]]), TILE, 6); box(c, 490, 580, 590, 690, COL.soilDk, 5); box(c, 370, 520, 440, 590, COL.sky, 5);
  c.save(); c.setLineDash([14, 14]); for (const [x, y] of [[300, 520], [270, 600]]) line(c, [[x, y], [x - 40, y]], 6); for (const [x, y] of [[780, 520], [810, 600]]) line(c, [[x, y], [x + 40, y]], 6); c.restore();
  for (const y of [800, 900, 1000]) { c.beginPath(); c.moveTo(60, y); for (let x = 60; x <= 1020; x += 60) c.quadraticCurveTo(x + 15, y - 28, x + 30, y), c.quadraticCurveTo(x + 45, y + 28, x + 60, y); c.strokeStyle = "#6a4128"; c.lineWidth = 7; c.stroke(); }
  arrow(c, [[200, 730], [100, 730]], RED, 9); arrow(c, [[880, 730], [980, 730]], RED, 9);
};

// ---- explanations
const cX1 = (c: Ctx) => {
  tableTop(c, 760);
  c.save(); c.translate(0, -20);
  shadow(c, 220, 770, 180, 16); shadow(c, 610, 770, 150, 16); shadow(c, 920, 770, 140, 16);
  const sq = squarePts(60, 740, 240, 110); ghost(c, squarePts(60, 740, 240, 0)); frame(c, sq, SQ);
  const b = squarePts(500, 740, 220); frame(c, b, [...SQ, [0, 2]]);
  frame(c, trianglePts(790, 740, 260), [[0, 1], [1, 2], [2, 0]]);
  arrow(c, [[60, 400], [200, 400]]); arrow(c, [[500, 400], [640, 400]]); arrow(c, [[790, 400], [930, 400]]);
  c.restore();
};
const cX2 = (c: Ctx) => {
  ground(c, "#d6ebf7");
  const india = [[330, 60], [430, 40], [520, 110], [610, 150], [760, 230], [880, 300], [980, 330], [900, 400], [800, 400], [700, 360], [620, 410], [600, 500], [560, 600], [520, 740], [470, 880], [420, 990], [380, 900], [330, 780], [270, 680], [220, 560], [120, 520], [160, 440], [250, 400], [230, 300], [270, 190]];
  shape(c, () => polyP(c, india), "#f2e6c0", 7);
  kerala(c, 380, 900, 0.5); toda(c, 520, 760, 0.45); ladakh(c, 400, 200, 0.5); assam(c, 830, 390, 0.5); bhunga(c, 200, 540, 0.5);
};
const cX3 = (c: Ctx) => {
  ground(c, SKYC); c.fillStyle = "#c8c0b4"; c.fillRect(0, 900, 1080, 180); line(c, [[0, 900], [1080, 900]], 6);
  roofModel(c, 70, 300, 0.36, true, 1.45);
  for (const [x, y] of [[160, 120], [330, 160], [250, 40], [470, 230], [560, 120]]) drop(c, x, y, 1.2);
  arrow(c, [[200, 500], [380, 570]], RED, 11); arrow(c, [[430, 600], [610, 670]], RED, 11); arrow(c, [[650, 700], [800, 770]], RED, 11);
  for (const [x, y] of [[900, 800], [960, 850]]) drop(c, x, y, 1.3);
};
const cX4 = (c: Ctx) => {
  tableTop(c, 800);
  shape(c, () => rrect(c, 120, 800, 840, 40, 8), CARDDK, 6);
  shadow(c, 540, 850, 420, 16);
  const hx0 = 260, hx1 = 820, top = 360;
  box(c, hx0, top + 40, hx1, 780, "#f6efd8", 6);
  shape(c, () => polyP(c, [[hx0 - 40, top + 50], [540, 190], [hx1 + 40, top + 50]]), TILE, 6);
  strip(c, [hx0 + 20, 770], [hx1 - 20, top + 60], 26, COL.wood); strip(c, [hx0 + 20, top + 60], [hx1 - 20, 770], 26, COL.wood);
  arrow(c, [[200, 880], [90, 880]], RED, 11); arrow(c, [[880, 880], [990, 880]], RED, 11);
  c.save(); c.setLineDash([14, 14]); line(c, [[hx0 - 70, 440], [hx0 - 70, 700]], 6); line(c, [[hx1 + 70, 440], [hx1 + 70, 700]], 6); c.restore();
};
const cX5 = (c: Ctx) => {
  ground(c, "#e6b88a");
  box(c, 0, 0, 1080, 640, "#c4532f", 6);
  for (let r = 0; r < 8; r++) line(c, [[0, r * 80], [1080, r * 80]], 5, "#8f3a20");
  for (let r = 0; r < 8; r++) for (let k = 0; k < 6; k++) line(c, [[k * 180 + (r % 2) * 90, r * 80], [k * 180 + (r % 2) * 90, r * 80 + 80]], 5, "#8f3a20");
  // the jaali: round holes showing sky and sun
  for (let r = 0; r < 3; r++) for (let k = 0; k < 5; k++) shape(c, () => ell(c, 260 + k * 140 + (r % 2) * 70, 150 + r * 130, 44, 44), "#fff2b8", 7);
  c.fillStyle = "#c8a070"; c.fillRect(0, 640, 1080, 440); line(c, [[0, 640], [1080, 640]], 6);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 5; k++) { c.save(); c.globalAlpha = 0.85; shape(c, () => ell(c, 300 + k * 130 + (r % 2) * 50, 760 + r * 100, 42, 26), "#fff2b8", 0); c.restore(); }
  for (const y of [700, 860]) { c.beginPath(); c.moveTo(60, y); for (let x = 60; x < 1000; x += 120) c.quadraticCurveTo(x + 30, y - 40, x + 60, y), c.quadraticCurveTo(x + 90, y + 40, x + 120, y); c.strokeStyle = "#fff"; c.lineWidth = 8; c.stroke(); }
};
const cX6 = (c: Ctx) => {
  ground(c, SKYC); c.fillStyle = "#c8c0b4"; c.fillRect(0, 880, 1080, 200); line(c, [[0, 880], [1080, 880]], 6);
  box(c, 640, 560, 1040, 880, "#c4532f", 6); for (let r = 0; r < 4; r++) line(c, [[640, 600 + r * 70], [1040, 600 + r * 70]], 5, "#8f3a20");
  shadow(c, 340, 900, 180, 14);
  builder(c, 340, 890, 700, true);
};

export const ic_makingThingsHousesAndShelterL3 = cards("sci.making-things.houses-and-shelter.L3 cards", [
  cIntro, cSummary, cE1, cE2, cE3, cA1, cA3, cA4, cP1, cC1, cC2, cA2,
  cT0, cT1, cT2, cT3, cT4, cT5, cT6, cT7, cT8, cT9, cT10, cT11, cX1, cX2, cX3, cX4, cX5, cX6,
]);
