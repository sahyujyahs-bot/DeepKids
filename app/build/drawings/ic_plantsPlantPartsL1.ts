import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, seed, leaf, hand, person, cards } from "./flatKit";

// PARTS OF A PLANT (L1) · set-up cards for the sprout test, then card pictures.
// Flat kit look: bold ink outline, flat colours, shade on the lower right, soft shadow.

const ROOT = "#fffaf0", SOIL_WET = "#5a3620", STONE = "#a9a39a", STONE_DK = "#7d7870";

// a smooth polyline through pts (quadratic through midpoints), sampled to many points
const smooth = (pts: number[][], per = 8): number[][] => {
  if (pts.length < 3) return pts;
  const out: number[][] = [pts[0]];
  let prev = pts[0];
  for (let i = 1; i < pts.length - 1; i++) {
    const ctrl = pts[i], next = i === pts.length - 2 ? pts[i + 1] : [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2];
    for (let k = 1; k <= per; k++) { const t = k / per, u = 1 - t; out.push([u * u * prev[0] + 2 * u * t * ctrl[0] + t * t * next[0], u * u * prev[1] + 2 * u * t * ctrl[1] + t * t * next[1]]); }
    prev = next;
  }
  return out;
};
// a root: white, tapering from w0 at the start to w1 at the tip, ink outline
const root = (c: Ctx, pts: number[][], w0: number, w1 = w0 * 0.3, col = ROOT) => {
  const p = smooth(pts), L: number[][] = [], R: number[][] = [];
  for (let i = 0; i < p.length; i++) {
    const a = p[Math.max(0, i - 1)], b = p[Math.min(p.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * (i / (p.length - 1))) / 2, nx = (-dy / n) * w, ny = (dx / n) * w;
    L.push([p[i][0] + nx, p[i][1] + ny]); R.push([p[i][0] - nx, p[i][1] - ny]);
  }
  shape(c, () => polyP(c, [...L, ...R.reverse()]), col, 4);
};
// a sprouted moong: a split pale seed with its root starting at the seed's edge
const sprout = (c: Ctx, x: number, y: number, r: number, rot: number, rootPts: number[][], w = r * 0.45) => { root(c, [[x, y], ...rootPts], w); seed(c, x, y, r, rot, true); };
// a newspaper lying flat: a sheet with grey lines of print
const newspaper = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 12, y + h + 8, w * 0.52, 14);
  shape(c, () => rrect(c, x, y, w, h, 6), COL.paper, 6);
  c.fillStyle = COL.grey;
  for (let r = 0; r < Math.floor((h - 50) / 26); r++) for (let k = 0; k < 3; k++) { const cw = (w - 80) / 3; c.fillRect(x + 30 + k * (cw + 10), y + 34 + r * 26, cw - 10 - (r % 3 === 2 ? cw * 0.3 : 0), 10); }
};
// a window with four bright panes, outer frame (x, y, w, h)
const windowPane = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 8), COL.wood, 7);
  const ix = x + 34, iy = y + 34, iw = w - 68, ih = h - 68;
  shape(c, () => c.rect(ix, iy, iw, ih), "#fff6cf", 6);
  c.globalAlpha = 0.5; c.fillStyle = COL.sky; c.fillRect(ix, iy, iw, ih * 0.55); c.globalAlpha = 1;
  line(c, [[ix + iw / 2, iy], [ix + iw / 2, iy + ih]], 14, COL.woodDk); line(c, [[ix, iy + ih / 2], [ix + iw, iy + ih / 2]], 14, COL.woodDk);
  line(c, [[ix + iw / 2, iy], [ix + iw / 2, iy + ih]], 5, INK); line(c, [[ix, iy + ih / 2], [ix + iw, iy + ih / 2]], 5, INK);
};
// a hand mirrored left to right (so a hand pointing left still has its thumb on top)
const handMirror = (c: Ctx, x: number, y: number, s: number, skin: string, sleeve: string) => { c.save(); c.translate(D, 0); c.scale(-1, 1); hand(c, D - x, y, 0, s, skin, sleeve); c.restore(); };
// a cloth seen from the side, hanging under or lying on a plate: a wavy-edged band
const clothBand = (c: Ctx, x0: number, x1: number, y0: number, y1: number) => {
  shape(c, () => { c.moveTo(x0, y0); c.lineTo(x1, y0); c.lineTo(x1 + 4, y1 - 14); for (let x = x1; x >= x0; x -= 40) c.quadraticCurveTo(x - 20, y1 + 12, x - 40, y1 - 6); c.lineTo(x0 - 4, y1 - 14); c.closePath(); }, COL.cloth, 5);
  c.strokeStyle = "#ddd3bf"; c.lineWidth = 2;
  for (let y = y0 + 12; y < y1 - 10; y += 12) { c.beginPath(); c.moveTo(x0 + 8, y); c.lineTo(x1 - 8, y); c.stroke(); }
};

// ---------------------------------------------------------------- set-up cards, experiment e1
// 1. twenty moong seeds in a small steel bowl of water, at night
const setupE1_0 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#2c3760"; c.fillRect(0, 0, D, 600);
  shape(c, () => ell(c, 860, 170, 70, 70), "#fff3b0", 6);
  shape(c, () => ell(c, 885, 150, 54, 54), "#2c3760", 0);
  [[180, 120], [300, 230], [560, 90], [700, 260], [130, 380], [980, 330]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 6, 6), "#fff3b0", 0));
  line(c, [[0, 600], [D, 600]], 6);
  bowl(c, 540, 690, 290, COL.water);
  const pos: number[][] = [];
  [[-30, 4], [-10, 6], [10, 6], [30, 4]].forEach(([dy, n]) => { const half = 290 * Math.sqrt(1 - (dy / 58) ** 2) - 40; for (let i = 0; i < n; i++) pos.push([540 - half + (i / (n - 1)) * 2 * half, 690 + dy]); });
  pos.forEach(([x, y], i) => seed(c, x, y, 21, 0.3 + i * 0.9, false));
  c.globalAlpha = 0.3; shape(c, () => ell(c, 540, 690, 290, 58), COL.water, 0); c.globalAlpha = 1;
  shape(c, () => ell(c, 400, 672, 50, 9), COL.drop, 0);
};
// 2. two plates: a wet white cloth with ten seeds, and a bare wet plate with ten seeds
const setupE1_1 = (c: Ctx) => {
  ground(c);
  const tenSeeds = (cx: number, cy: number, s: number) => { const r = rnd(s); for (let i = 0; i < 10; i++) seed(c, cx - 120 + (i % 5) * 60 + r() * 8, cy - 32 + Math.floor(i / 5) * 64 + r() * 6, 20, r() * 3, true); };
  plate(c, 290, 560, 250, 130);
  shape(c, () => { c.moveTo(130, 505); c.quadraticCurveTo(290, 455, 452, 508); c.quadraticCurveTo(488, 560, 448, 612); c.quadraticCurveTo(290, 665, 134, 614); c.quadraticCurveTo(94, 560, 130, 505); c.closePath(); }, COL.cloth, 5);
  c.strokeStyle = "#ddd3bf"; c.lineWidth = 2; for (let y = 480; y < 650; y += 14) { c.beginPath(); c.moveTo(150, y); c.lineTo(430, y); c.stroke(); }
  [[180, 525], [400, 540], [250, 630], [360, 600]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 11, 7), COL.water, 2.5));
  tenSeeds(290, 560, 3);
  plate(c, 790, 560, 250, 130);
  c.globalAlpha = 0.85; shape(c, () => ell(c, 790, 560, 190, 94), COL.water, 0); c.globalAlpha = 1;
  shape(c, () => ell(c, 700, 520, 36, 8), COL.drop, 0);
  tenSeeds(790, 560, 5);
};
// 3. two days later: the cloth held upside down over a bowl with sprouts hanging on; the bare plate
//    upside down with its sprouts lying in the bowl below
const setupE1_2 = (c: Ctx) => {
  ground(c);
  const upsidePlate = (cx: number) => { shape(c, () => { c.moveTo(cx - 170, 360); c.lineTo(cx + 170, 360); c.lineTo(cx + 180, 376); c.lineTo(cx + 150, 392); c.lineTo(cx - 150, 392); c.lineTo(cx - 180, 376); c.closePath(); }, COL.steel, 6); shape(c, () => ell(c, cx, 360, 170, 20), COL.steelIn, 5); };
  // left: plate with the cloth, held from the left, cloth hanging under it, sprouts hanging on
  bowl(c, 330, 790, 205);
  upsidePlate(330);
  clothBand(c, 180, 480, 392, 462);
  const r = rnd(21);
  for (let i = 0; i < 9; i++) { const x = 200 + i * 35; root(c, [[x, 454], [x + 4, 476], [x - 2, 496]], 10, 4); seed(c, x, 510, 19, 1.2 + r() * 0.6, true); }
  hand(c, 90, 376, 0, 1, SKIN.child, CLOTH.child);
  sprout(c, 370, 802, 19, 0.4, [[400, 808], [424, 802]]);
  // right: the bare plate, held from the right, every sprout lying in the bowl
  bowl(c, 750, 790, 205);
  upsidePlate(750);
  handMirror(c, 990, 376, 1, SKIN.child, CLOTH.child);
  const q = rnd(8);
  for (let i = 0; i < 10; i++) { const x = 620 + (i % 5) * 62 + q() * 10, y = 772 + Math.floor(i / 5) * 34; sprout(c, x, y, 18, q() * 3, [[x + 24, y + 6], [x + 44, y + 2]]); }
  // the turn: a red arrow starting at each plate's far edge and curling over to its new, downward side
  arrow(c, [[500, 300], [420, 240], [330, 232], [250, 262]], RED, 8);
  arrow(c, [[580, 300], [660, 240], [750, 232], [830, 262]], RED, 8);
};
// 4. the underside of the cloth, close up: white root tips poking through between the threads
const setupE1_3 = (c: Ctx) => {
  // behind the cloth is the steel plate, seen through the gaps of the weave
  ground(c, COL.steelDk);
  const T = 58, G = 32, step = T + G;
  // threads over and under each other: vertical threads, then horizontal ones, then the vertical
  // ones again where they cross on the "over" squares
  const vth = (x: number) => { shape(c, () => rrect(c, x, -10, T, D + 20, 12), "#f3ede0", 4); shade(c, () => rrect(c, x, -10, T, D + 20, 12), "#d9cfb9", 18, 0, 0.4); };
  for (let x = 10; x < D; x += step) vth(x);
  for (let y = 10; y < D; y += step) { shape(c, () => rrect(c, -10, y, D + 20, T, 12), "#f6f1e6", 4); shade(c, () => rrect(c, -10, y, D + 20, T, 12), "#d9cfb9", 0, 18, 0.4); }
  let k = 0;
  for (let x = 10; x < D; x += step, k++) for (let y = 10 + (k % 2) * step; y < D; y += 2 * step) { c.save(); c.beginPath(); c.rect(x - 4, y - 4, T + 8, T + 8); c.clip(); vth(x); c.restore(); }
  // root tips poking out of the gaps and bending over the threads, with a soft shadow
  const tips: number[][][] = [
    [[294, 294], [320, 350], [380, 400]], [[654, 204], [700, 240], [760, 240]], [[384, 654], [410, 720], [470, 760]],
    [[834, 564], [810, 640], [760, 690]], [[204, 834], [250, 880], [320, 880]], [[654, 924], [700, 990], [770, 1010]], [[924, 294], [980, 320], [1030, 380]],
  ];
  tips.forEach((p) => { const g = [p[0][0] + 16, p[0][1] + 16]; shadow(c, g[0] + 26, g[1] + 30, 44, 16); root(c, [g, ...p.slice(1)], 30, 10); shape(c, () => ell(c, p[2][0], p[2][1], 5.5, 5.5), ROOT, 4); });
};

// ---------------------------------------------------------------- card pictures
// flow.e1: the science, seen from the side: roots grow into the gaps of the cloth; on the bare
// steel they only lie on top
const flowE1 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(540, 640); c.scale(1.2, 1.2); c.translate(-540, -610);
  const sidePlate = (x0: number, x1: number, y: number) => { shadow(c, (x0 + x1) / 2 + 12, y + 26, (x1 - x0) / 2, 14); shape(c, () => { c.moveTo(x0, y - 26); c.lineTo(x0 + 24, y); c.lineTo(x1 - 24, y); c.lineTo(x1, y - 26); c.lineTo(x1, y - 12); c.lineTo(x1 - 20, y + 14); c.lineTo(x0 + 20, y + 14); c.lineTo(x0, y - 12); c.closePath(); }, COL.steel, 6); shine(c, [[x0 + 60, y + 2], [x0 + 160, y + 2]], 6); };
  // left: cloth on the plate, drawn as a thick woven band with gaps, roots growing down into the gaps
  sidePlate(110, 510, 700);
  shape(c, () => rrect(c, 130, 610, 350, 80, 10), COL.cloth, 5);
  for (let x = 146; x < 470; x += 36) shape(c, () => rrect(c, x, 622, 20, 56, 6), "#e6dcc6", 3);
  const roots: number[][][] = [[[150, 560], [160, 600], [152, 640], [160, 690]], [[250, 560], [240, 600], [250, 640], [244, 690]], [[350, 560], [360, 600], [352, 640], [362, 690]], [[440, 560], [432, 600], [440, 640], [436, 690]]];
  roots.forEach((p) => root(c, p, 14, 5));
  [[150, 542], [250, 542], [350, 542], [440, 542]].forEach(([x, y], i) => { seed(c, x, y, 30, 0.2 + i * 0.5, true); line(c, [[x, y - 20], [x + 6, y - 48]], 5, COL.greenDk); leaf(c, x + 6, y - 48, 30, -1.9, COL.greenLt); });
  // right: the bare plate, roots lying along the smooth steel
  sidePlate(570, 970, 700);
  [[630, 672], [740, 672], [850, 672]].forEach(([x, y], i) => { root(c, [[x + 20, y + 6], [x + 60, y + 14], [x + 100, y + 16]], 14, 5); seed(c, x, y, 30, 0.2 + i * 0.5, true); line(c, [[x, y - 20], [x + 6, y - 48]], 5, COL.greenDk); leaf(c, x + 6, y - 48, 30, -1.9, COL.greenLt); });
  c.restore();
};
// flow.a1: a child's hand holds the coriander by its leaves and shakes the roots over newspaper
const flowA1 = (c: Ctx) => {
  ground(c);
  newspaper(c, 160, 720, 760, 300);
  // leaves held in the hand, upside down: stems come down out of the hand
  const r = rnd(4);
  for (let i = 0; i < 9; i++) { const an = -0.3 + (i / 8) * 3.74; leaf(c, 540, 250, 95, an, i % 2 ? COL.leaf : COL.green); }
  for (let i = 0; i < 6; i++) { const an = 0.5 + (i / 5) * 2.2; leaf(c, 540, 250, 70, an, COL.greenLt); }
  hand(c, 540, 170, Math.PI / 2, 1.15, SKIN.child, CLOTH.child);
  // stems below the hand, going down to the roots
  line(c, [[520, 300], [510, 420], [530, 540]], 12, INK); line(c, [[520, 300], [510, 420], [530, 540]], 6, COL.greenLt);
  line(c, [[560, 300], [570, 420], [550, 540]], 12, INK); line(c, [[560, 300], [570, 420], [550, 540]], 6, COL.greenLt);
  line(c, [[540, 300], [540, 540]], 12, INK); line(c, [[540, 300], [540, 540]], 6, COL.green);
  // roots, with soil lumps stuck on
  root(c, [[540, 536], [530, 600], [545, 660], [530, 700]], 13, 4); root(c, [[540, 536], [500, 590], [470, 640]], 10, 3); root(c, [[540, 536], [580, 590], [610, 650]], 10, 3); root(c, [[530, 600], [490, 650]], 7, 3); root(c, [[580, 590], [600, 620], [640, 630]], 6, 3);
  [[512, 610], [585, 615], [540, 655]].forEach(([x, y]) => { shape(c, () => ell(c, x, y, 16, 12, 0.4), COL.soil, 4); });
  // soil falling, and shake lines
  const q = rnd(9); for (let i = 0; i < 14; i++) shape(c, () => ell(c, 470 + q() * 140, 680 + q() * 120, 6, 5), COL.soilDk, 0);
  arrow(c, [[420, 330], [360, 330]], RED, 7); arrow(c, [[660, 330], [720, 330]], RED, 7);
};
// flow.a2: a child holds a palak leaf flat against a bright window; the veins show through
const flowA2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e3d6bd"; c.fillRect(0, 0, D, 1000); c.fillStyle = BG; c.fillRect(0, 1000, D, 80); line(c, [[0, 1000], [D, 1000]], 6);
  windowPane(c, 300, 60, 700, 640);
  // the leaf, pressed flat on the pane; the hand will sit on its lower middle
  const lx = 690, ly = 270;
  shape(c, () => { c.moveTo(lx - 20, ly + 170); c.quadraticCurveTo(lx - 150, ly + 60, lx - 110, ly - 80); c.quadraticCurveTo(lx - 40, ly - 170, lx + 40, ly - 150); c.quadraticCurveTo(lx + 150, ly - 90, lx + 110, ly + 40); c.quadraticCurveTo(lx + 60, ly + 150, lx - 20, ly + 170); c.closePath(); }, COL.greenLt, 6);
  line(c, [[lx - 20, ly + 190], [lx - 20, ly + 170]], 8, COL.greenDk);
  line(c, [[lx - 20, ly + 170], [lx + 10, ly - 120]], 5, COL.leafDk);
  [[0.15, -1.9, 70], [0.3, -0.9, 95], [0.45, -2.1, 65], [0.6, -0.9, 85], [0.75, -2.2, 50], [0.85, -1.1, 55]].forEach(([t, an, len]) => { const sx = lx - 20 + 30 * t, sy = ly + 170 - 290 * t; line(c, [[sx, sy], [sx + Math.cos(an) * len, sy + Math.sin(an) * len]], 3.5, COL.leafDk); line(c, [[sx, sy], [sx - Math.cos(an + 0.6) * len * 0.9, sy + Math.sin(an + 0.6) * len * 0.9 - len * 0.6]], 3.5, COL.leafDk); });
  // the child: right arm up to the leaf (wrist lands at about (643, 303)), left arm down
  person(c, 420, 1000, 720, { armR: [-Math.PI / 4, -Math.PI / 3], armL: [Math.PI * 0.56, Math.PI * 0.5] });
};
// flow.p1: two clear cups of soil on a windowsill, one with moong seedlings and roots showing
const flowP1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e3d6bd"; c.fillRect(0, 0, D, 780);
  windowPane(c, 120, 40, 840, 640);
  shape(c, () => c.rect(0, 780, D, 60), COL.wood, 6); c.fillStyle = COL.woodDk; c.fillRect(0, 820, D, 20);
  const cup = (x: number, roots: boolean) => {
    shadow(c, x + 20, 790, 150, 16);
    shape(c, () => ell(c, x, 786, 150, 22), COL.steelIn, 5);
    const w = 240, h = 320, y = 782, top = w / 2, bot = w * 0.4;
    shape(c, () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, COL.glass, 5);
    const sy = y - h * 0.82, lw = bot + (top - bot) * 0.82;
    shape(c, () => { c.moveTo(x - lw, sy); c.lineTo(x + lw, sy); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, COL.soil, 0);
    const r = rnd(roots ? 5 : 6); for (let i = 0; i < 40; i++) { const t = r(), yy = sy + 10 + r() * (h * 0.82 - 20), hw = bot + (lw - bot) * ((y - yy) / (y - sy)) - 10; shape(c, () => ell(c, x - hw + t * 2 * hw, yy, 5, 4), COL.soilDk, 0); }
    if (roots) {
      root(c, [[x - 40, sy + 10], [x - 60, sy + 80], [x - 80, sy + 150], [x - 70, sy + 230]], 9, 3); root(c, [[x - 60, sy + 80], [x - 20, sy + 130], [x - 30, sy + 200]], 6, 2);
      root(c, [[x + 30, sy + 10], [x + 50, sy + 70], [x + 80, sy + 140], [x + 70, sy + 220]], 9, 3); root(c, [[x + 50, sy + 70], [x + 10, sy + 120], [x + 20, sy + 190]], 6, 2);
      root(c, [[x - 5, sy + 10], [x + 10, sy + 90], [x - 10, sy + 160]], 7, 2);
    }
    c.globalAlpha = 0.35; shape(c, () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, COL.glass, 0); c.globalAlpha = 1;
    shape(c, () => ell(c, x, y - h, top, 16), "rgba(255,255,255,0.35)", 5);
    shine(c, [[x - top * 0.72, y - h * 0.86], [x - bot * 0.8, y - h * 0.15]], 7);
    if (roots) [[x - 40, -0.25], [x + 30, 0.15], [x - 5, 0]].forEach(([sx, lean]) => { const topY = sy - 110; line(c, [[sx, sy + 4], [sx + lean * 40, topY]], 9, INK); line(c, [[sx, sy + 4], [sx + lean * 40, topY]], 5, COL.green); leaf(c, sx + lean * 40, topY, 52, -2.5 + lean, COL.leaf); leaf(c, sx + lean * 40, topY, 52, -0.6 + lean, COL.leaf); });
  };
  cup(330, true); cup(750, false);
};
// term.5: a mango, a tomato and a bhindi, each cut open to show the seeds
const term5 = (c: Ctx) => {
  ground(c);
  // mango half: yellow flesh, the big flat stone in the middle
  shadow(c, 300, 640, 200, 36);
  shape(c, () => { c.moveTo(130, 420); c.bezierCurveTo(140, 300, 330, 300, 420, 400); c.bezierCurveTo(500, 490, 470, 640, 330, 640); c.bezierCurveTo(170, 640, 110, 540, 130, 420); c.closePath(); }, COL.yellow, 6);
  shape(c, () => { c.moveTo(165, 430); c.bezierCurveTo(175, 340, 320, 340, 395, 420); c.bezierCurveTo(455, 490, 430, 605, 320, 605); c.bezierCurveTo(200, 605, 150, 520, 165, 430); c.closePath(); }, "#ffcf4a", 0);
  shape(c, () => ell(c, 290, 480, 110, 55, 0.6), "#f1e3b8", 5);
  for (let i = 0; i < 8; i++) line(c, [[200 + i * 24, 440 + i * 18], [212 + i * 24, 452 + i * 18]], 2.5, "#c9b98a");
  // tomato half: red, with pale chambers of small seeds in jelly
  shadow(c, 650, 640, 130, 30);
  shape(c, () => ell(c, 640, 520, 125, 118), COL.red, 6);
  shape(c, () => ell(c, 640, 520, 98, 92), "#f07a62", 0);
  for (let k = 0; k < 4; k++) { const an = Math.PI / 4 + (k * Math.PI) / 2, cx = 640 + Math.cos(an) * 48, cy = 520 + Math.sin(an) * 44; shape(c, () => ell(c, cx, cy, 36, 28, an), "#ffd9b3", 3); for (let s = -1; s <= 1; s++) seed(c, cx + Math.cos(an) * s * 16, cy + Math.sin(an) * s * 16, 7, an + Math.PI / 2, false, "#f7efc8", "#d9c98a"); }
  shape(c, () => ell(c, 640, 520, 16, 16), "#f7efc8", 3);
  // bhindi: a pod cut in two, the cut end showing a star of seed rows
  shadow(c, 880, 660, 120, 26);
  shape(c, () => { c.moveTo(940, 300); c.quadraticCurveTo(905, 420, 905, 540); c.lineTo(955, 540); c.quadraticCurveTo(985, 420, 960, 300); c.closePath(); }, COL.green, 6);
  shape(c, () => { c.moveTo(930, 312); c.lineTo(955, 290); c.lineTo(965, 302); c.closePath(); }, COL.greenDk, 4);
  line(c, [[920, 330], [915, 520]], 3, COL.greenDk); line(c, [[948, 330], [950, 520]], 3, COL.greenDk);
  const bx = 900, by = 600, br = 60;
  shape(c, () => ell(c, bx, by, br, br), COL.green, 6);
  shape(c, () => { for (let k = 0; k < 10; k++) { const an = -Math.PI / 2 + (k * Math.PI) / 5, rr = k % 2 ? br * 0.35 : br * 0.78; k ? c.lineTo(bx + Math.cos(an) * rr, by + Math.sin(an) * rr) : c.moveTo(bx + Math.cos(an) * rr, by + Math.sin(an) * rr); } c.closePath(); }, "#dff0b5", 4);
  for (let k = 0; k < 5; k++) { const an = -Math.PI / 2 + (k * 2 * Math.PI) / 5; for (let s = 1; s <= 2; s++) shape(c, () => ell(c, bx + Math.cos(an) * s * 20, by + Math.sin(an) * s * 20, 7, 7), WHITE, 2.5); }
};
// term.6: a heap of green moong, red rajma and white rice on a steel plate
const term6 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 600, 430, 220);
  const heap = (cx: number, cy: number, rx: number, ry: number, base: string, draw: (x: number, y: number, k: number) => void, n: number, s: number) => {
    shape(c, () => { c.moveTo(cx - rx, cy); c.bezierCurveTo(cx - rx * 0.6, cy - ry * 1.5, cx + rx * 0.6, cy - ry * 1.5, cx + rx, cy); c.bezierCurveTo(cx + rx * 0.8, cy + ry * 0.5, cx - rx * 0.8, cy + ry * 0.5, cx - rx, cy); c.closePath(); }, base, 5);
    const r = rnd(s); for (let i = 0; i < n; i++) { const t = r(), x = cx - rx * 0.9 + t * rx * 1.8, top = cy - Math.sin(t * Math.PI) * ry * 1.05; draw(x, top + r() * (cy + ry * 0.3 - top), i); }
  };
  heap(390, 560, 130, 70, COL.greenDk, (x, y, k) => seed(c, x, y, 13, k * 0.7, false), 90, 31);
  heap(690, 560, 130, 70, "#7a2626", (x, y, k) => { shape(c, () => { c.save(); c.translate(x, y); c.rotate(k * 0.9); c.moveTo(-16, -4); c.quadraticCurveTo(-10, -14, 4, -12); c.quadraticCurveTo(18, -8, 16, 4); c.quadraticCurveTo(10, 12, -2, 10); c.quadraticCurveTo(-8, 4, -16, -4); c.closePath(); c.restore(); }, "#a8362f", 3); }, 60, 32);
  heap(540, 670, 140, 55, "#d8d2c4", (x, y, k) => shape(c, () => ell(c, x, y, 11, 4.5, k * 0.8), "#fbf8ef", 2.5), 110, 33);
};
// expl.5: one plant: blue arrow of water going up from the roots to the leaves, orange arrow of
// food going down from the leaves to the roots
const expl5 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#dceaf5"; c.fillRect(0, 0, D, 740);
  shape(c, () => c.rect(-10, 740, D + 20, 400), COL.soil, 6);
  const r = rnd(12); for (let i = 0; i < 60; i++) shape(c, () => ell(c, r() * D, 760 + r() * 300, 6, 5), COL.soilDk, 0);
  // roots
  root(c, [[540, 745], [545, 860], [530, 960], [545, 1040]], 22, 6); root(c, [[540, 760], [460, 820], [390, 900], [360, 980]], 14, 4); root(c, [[540, 760], [630, 820], [700, 900], [720, 980]], 14, 4);
  root(c, [[460, 820], [420, 850], [380, 850]], 7, 3); root(c, [[630, 820], [680, 840], [720, 830]], 7, 3); root(c, [[545, 860], [600, 900], [640, 950]], 8, 3); root(c, [[530, 960], [480, 990], [450, 1030]], 7, 3);
  // stem and leaves
  line(c, [[540, 750], [540, 250]], 26, INK); line(c, [[540, 750], [540, 250]], 16, COL.green);
  [[620, -0.4], [460, 3.6], [640, -0.7], [440, 3.9], [560, -1.1], [500, 4.3]].forEach(([y, an], i) => leaf(c, 540, y, 120 - i * 6, an, i % 2 ? COL.leaf : COL.green));
  leaf(c, 540, 260, 110, -1.57, COL.leafDk); leaf(c, 540, 260, 95, -2.2, COL.leaf); leaf(c, 540, 260, 95, -0.95, COL.leaf);
  // water up (blue, left of the stem), food down (orange, right of the stem)
  arrow(c, [[400, 900], [400, 300]], COL.blue, 14);
  arrow(c, [[680, 300], [680, 900]], COL.orange, 14);
  shape(c, () => { c.moveTo(400, 940); c.quadraticCurveTo(372, 980, 380, 1000); c.arc(400, 1000, 24, Math.PI, 0, true); c.quadraticCurveTo(428, 980, 400, 940); c.closePath(); }, COL.water, 5);
  shape(c, () => ell(c, 680, 260, 26, 26), COL.yellow, 5);
};
// expl.6: a root tip under the soil turns round a small stone and grows towards a wet patch
const expl6 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#dceaf5"; c.fillRect(0, 0, D, 200);
  shape(c, () => c.rect(-10, 200, D + 20, 900), COL.soil, 6);
  const r = rnd(14); for (let i = 0; i < 90; i++) shape(c, () => ell(c, r() * D, 220 + r() * 850, 7, 5), COL.soilDk, 0);
  // the wet patch, lower right
  shape(c, () => { c.moveTo(700, 820); c.bezierCurveTo(740, 700, 960, 700, 1000, 800); c.bezierCurveTo(1040, 900, 960, 1020, 840, 1010); c.bezierCurveTo(720, 1000, 660, 920, 700, 820); c.closePath(); }, SOIL_WET, 0);
  [[800, 800], [900, 840], [850, 930], [950, 920]].forEach(([x, y]) => shape(c, () => { c.moveTo(x, y - 22); c.quadraticCurveTo(x + 18, y, x, y + 10); c.quadraticCurveTo(x - 18, y, x, y - 22); c.closePath(); }, COL.water, 3));
  // the stone
  shadow(c, 520, 590, 110, 30);
  shape(c, () => { c.moveTo(380, 560); c.bezierCurveTo(400, 460, 560, 440, 620, 500); c.bezierCurveTo(680, 560, 630, 640, 520, 650); c.bezierCurveTo(430, 655, 360, 620, 380, 560); c.closePath(); }, STONE, 6);
  shade(c, () => { c.moveTo(380, 560); c.bezierCurveTo(400, 460, 560, 440, 620, 500); c.bezierCurveTo(680, 560, 630, 640, 520, 650); c.bezierCurveTo(430, 655, 360, 620, 380, 560); c.closePath(); }, STONE_DK, 30, 18);
  // the seedling above, its root coming down, bending round the stone's left side, then on towards the wet patch
  root(c, [[500, 205], [480, 330], [430, 440], [340, 540], [360, 650], [460, 720], [580, 780], [680, 830]], 22, 7);
  root(c, [[480, 330], [540, 380], [580, 400]], 8, 3); root(c, [[430, 440], [380, 420]], 7, 3); root(c, [[460, 720], [470, 790]], 7, 3);
  line(c, [[500, 205], [500, 120]], 14, INK); line(c, [[500, 205], [500, 120]], 8, COL.green);
  leaf(c, 500, 120, 80, -2.5, COL.leaf); leaf(c, 500, 120, 80, -0.65, COL.leaf);
  // the tip is heading for the wet patch
  arrow(c, [[700, 845], [790, 890]], RED, 8);
};

export const ic_plantsPlantPartsL1 = cards("sci.plants.plant-parts.L1", [
  setupE1_0, setupE1_1, setupE1_2, setupE1_3,
  flowE1, flowA1, flowA2, flowP1, term5, term6, expl5, expl6,
]);
