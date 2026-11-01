import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, plate, seed, leaf, hand, cards } from "./flatKit";

// sci.classification.sorting-living-things.L3 set-up cards: vegetables, herbs, mushrooms.

const at = (c: Ctx, x: number, y: number, rot: number, fn: () => void) => { c.save(); c.translate(x, y); c.rotate(rot); fn(); c.restore(); };
const calyx = (c: Ctx, x: number, y: number, r: number, n = 5, col: string = COL.green) => {
  const pts: number[][] = [];
  for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + (i * Math.PI) / n, k = i % 2 ? 0.38 : 1; pts.push([x + Math.cos(a) * r * k, y + Math.sin(a) * r * k * 0.62]); }
  shape(c, () => polyP(c, pts), col, 5);
  shape(c, () => ell(c, x, y, r * 0.2, r * 0.14), COL.greenDk, 4);
};

// ---- the five vegetables (origin = where the stalk joins; rot turns them, 0 = upright)
const tomato = (c: Ctx, x: number, y: number, r: number) => {
  const body = () => ell(c, x, y, r, r * 0.9);
  shape(c, body, COL.red);
  shade(c, body, "#b3321f", -r * 0.22, -r * 0.18, 0.5);
  shine(c, [[x - r * 0.62, y - r * 0.15], [x - r * 0.42, y - r * 0.5]], Math.max(4, r * 0.07));
  line(c, [[x, y - r * 0.8], [x + r * 0.06, y - r * 1.05]], Math.max(8, r * 0.14), INK);
  line(c, [[x, y - r * 0.8], [x + r * 0.06, y - r * 1.05]], Math.max(4, r * 0.08), COL.greenDk);
  calyx(c, x, y - r * 0.74, r * 0.52);
};
const brinjal = (c: Ctx, x: number, y: number, L: number, W: number, rot: number) => at(c, x, y, rot, () => {
  const body = () => { c.moveTo(-W * 0.3, 0); c.bezierCurveTo(-W * 0.45, L * 0.3, -W * 1.05, L * 0.45, -W * 0.95, L * 0.75); c.bezierCurveTo(-W * 0.85, L * 1.03, W * 0.85, L * 1.03, W * 0.95, L * 0.75); c.bezierCurveTo(W * 1.05, L * 0.45, W * 0.45, L * 0.3, W * 0.3, 0); c.closePath(); };
  shape(c, () => rrect(c, -W * 0.14, -L * 0.13, W * 0.28, L * 0.16, W * 0.08), COL.greenDk, 5);
  shape(c, body, "#6a4a9e");
  shade(c, body, "#47307a", -W * 0.3, -W * 0.1, 0.6);
  shine(c, [[-W * 0.58, L * 0.45], [-W * 0.66, L * 0.7]], Math.max(4, W * 0.1));
  shape(c, () => polyP(c, [[-W * 0.45, 0], [W * 0.45, 0], [W * 0.85, L * 0.1], [W * 0.4, L * 0.085], [W * 0.2, L * 0.17], [0, L * 0.09], [-W * 0.2, L * 0.17], [-W * 0.4, L * 0.085], [-W * 0.85, L * 0.1]]), COL.green, 5);
});
const chilli = (c: Ctx, x: number, y: number, L: number, T: number, rot: number, capCol: string = COL.greenDk) => at(c, x, y, rot, () => {
  const N = 16, cl: number[][] = [], lf: number[][] = [], rt: number[][] = [];
  for (let i = 0; i <= N; i++) { const t = i / N; cl.push([L * 0.22 * Math.sin(t * 2.4), L * t]); }
  for (let i = 0; i <= N; i++) {
    const a = cl[Math.max(0, i - 1)], b = cl[Math.min(N, i + 1)], an = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2, w = T * (1 - 0.9 * Math.pow(i / N, 1.6));
    lf.push([cl[i][0] + Math.cos(an) * w, cl[i][1] + Math.sin(an) * w]); rt.push([cl[i][0] - Math.cos(an) * w, cl[i][1] - Math.sin(an) * w]);
  }
  const outline = [...lf, ...rt.reverse()], body = () => polyP(c, outline);
  line(c, [[0, 0], [T * 0.5, -T * 1.3]], T * 0.55 + 9, INK); line(c, [[0, 0], [T * 0.5, -T * 1.3]], T * 0.55, COL.greenDk);
  shape(c, body, COL.green);
  shade(c, body, COL.greenDk, -T * 0.5, -T * 0.1, 0.6);
  shine(c, cl.slice(2, 9).map(([px, py]) => [px - T * 0.42, py]), Math.max(4, T * 0.14));
  calyx(c, 0, T * 0.1, T * 1.25, 5, capCol);
});
const capsicum = (c: Ctx, x: number, y: number, W: number, H: number, rot: number) => at(c, x, y, rot, () => {
  const body = () => { c.moveTo(-W * 0.5, 0); c.bezierCurveTo(-W, 0.02 * H, -W * 1.1, H * 0.55, -W * 0.85, H * 0.85); c.quadraticCurveTo(-W * 0.7, H * 1.02, -W * 0.35, H * 0.96); c.quadraticCurveTo(0, H * 1.08, W * 0.35, H * 0.96); c.quadraticCurveTo(W * 0.7, H * 1.02, W * 0.85, H * 0.85); c.bezierCurveTo(W * 1.1, H * 0.55, W, 0.02 * H, W * 0.5, 0); c.quadraticCurveTo(0, H * 0.14, -W * 0.5, 0); c.closePath(); };
  shape(c, body, COL.greenLt);
  shade(c, body, COL.green, -W * 0.3, -W * 0.15, 0.55);
  shine(c, [[-W * 0.7, H * 0.3], [-W * 0.78, H * 0.6]], Math.max(5, W * 0.09));
  line(c, [[-W * 0.2, H * 0.12], [-W * 0.3, H * 0.9]], 3, COL.greenDk); line(c, [[W * 0.22, H * 0.12], [W * 0.3, H * 0.9]], 3, COL.greenDk);
  line(c, [[0, 0], [W * 0.06, -H * 0.2]], W * 0.2 + 9, INK); line(c, [[0, 0], [W * 0.06, -H * 0.2]], W * 0.2, COL.greenDk);
});
const cucumber = (c: Ctx, x: number, y: number, L: number, W: number, rot: number) => at(c, x, y, rot, () => {
  const body = () => rrect(c, -W, 0, W * 2, L, W * 0.9);
  shape(c, () => rrect(c, -W * 0.2, -W * 0.4, W * 0.4, W * 0.7, W * 0.1), "#b7d38a", 5);
  shape(c, body, "#4f8f3a");
  c.save(); c.beginPath(); body(); c.clip();
  for (const sx of [-0.55, 0.05, 0.6]) line(c, [[W * sx, L * 0.04], [W * sx, L * 0.96]], W * 0.16, "#7fb55a");
  for (let i = 0; i < 9; i++) for (const sx of [-0.8, -0.25, 0.3, 0.8]) { c.beginPath(); c.arc(W * sx, L * (0.1 + i * 0.1) + (sx > 0 ? L * 0.04 : 0), 3, 0, 7); c.fillStyle = "#2f6a2a"; c.fill(); }
  c.restore();
  shade(c, body, "#2f6a2a", -W * 0.3, -W * 0.05, 0.5);
  shine(c, [[-W * 0.7, L * 0.12], [-W * 0.7, L * 0.8]], Math.max(4, W * 0.1));
  shape(c, () => ell(c, 0, L - W * 0.05, W * 0.14, W * 0.1), "#2f6a2a", 0);
});

// ---- herbs
const stemLine = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };
const lobed = (c: Ctx, x: number, y: number, an: number, s: number) => {
  const ex = x + Math.cos(an) * s * 0.7, ey = y + Math.sin(an) * s * 0.7;
  stemLine(c, [[x, y], [ex, ey]], 7, COL.green);
  for (const d of [-0.75, 0, 0.75]) shape(c, () => ell(c, ex + Math.cos(an + d) * s * 0.3, ey + Math.sin(an + d) * s * 0.3, s * 0.27, s * 0.2, an + d), COL.greenLt, 4);
  line(c, [[ex, ey], [ex + Math.cos(an) * s * 0.5, ey + Math.sin(an) * s * 0.5]], 3, COL.greenDk);
};
const UL = -Math.PI + 0.5, UR = -0.5;
const mint = (c: Ctx, x: number, y: number, h: number, rot: number) => at(c, x, y, rot, () => {
  stemLine(c, [[0, 0], [0, -h]], 14, COL.green);
  [[0.22, 0.2], [0.42, 0.21], [0.62, 0.18], [0.8, 0.13]].forEach(([t, s]) => { leaf(c, 0, -h * t, h * s, UL, "#3f9a52"); leaf(c, 0, -h * t, h * s, UR, "#3f9a52"); });
  leaf(c, 0, -h, h * 0.1, -Math.PI / 2, "#3f9a52");
});
const coriander = (c: Ctx, x: number, y: number, h: number, rot: number) => at(c, x, y, rot, () => {
  stemLine(c, [[0, 0], [0, -h]], 12, COL.greenLt);
  [[0.2, UL], [0.4, UR], [0.6, UL], [0.78, UR]].forEach(([t, a]) => lobed(c, 0, -h * t, a, h * 0.2));
  lobed(c, 0, -h, -Math.PI / 2, h * 0.12);
});
const tulsi = (c: Ctx, x: number, y: number, h: number, rot: number) => at(c, x, y, rot, () => {
  stemLine(c, [[0, 0], [0, -h]], 12, "#8a6aa8");
  [[0.3, 0.3], [0.55, 0.26], [0.78, 0.2]].forEach(([t, s]) => { leaf(c, 0, -h * t, h * s, UL + 0.25, "#4f9a45"); leaf(c, 0, -h * t, h * s, UR - 0.25, "#4f9a45"); });
  leaf(c, 0, -h, h * 0.14, -Math.PI / 2, "#4f9a45");
});
const curry = (c: Ctx, x: number, y: number, h: number, rot: number) => at(c, x, y, rot, () => {
  stemLine(c, [[0, 0], [0, -h]], 8, COL.leafDk);
  for (let i = 0; i < 6; i++) leaf(c, 0, -h * (0.18 + i * 0.13), h * 0.17, i % 2 ? UR : UL, COL.leafDk);
  leaf(c, 0, -h, h * 0.12, -Math.PI / 2, COL.leafDk);
});
const lemongrass = (c: Ctx, x: number, y: number, h: number, rot: number) => at(c, x, y, rot, () => {
  for (const d of [-0.28, -0.1, 0.1, 0.28]) {
    const tx = Math.sin(d) * h, ty = -Math.cos(d) * h;
    shape(c, () => { c.moveTo(-9, 0); c.quadraticCurveTo(tx * 0.4 - 12, ty * 0.5, tx, ty); c.quadraticCurveTo(tx * 0.4 + 12, ty * 0.5, 9, 0); c.closePath(); }, "#b9d77a", 5);
  }
});

// ---- mushrooms
const CAP = "#b98a5e", CAPDK = "#8f6540", STEM = "#f1e4cc", STEMDK = "#d9c6a5", GILL = "#ecd3b8", GILLLN = "#a67c57", SPORE = "#7b4a2d";
const gillsOn = (c: Ctx, cx: number, cy: number, rx: number, ry: number, n = 56) => {
  for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2; line(c, [[cx + Math.cos(a) * rx * 0.1, cy + Math.sin(a) * ry * 0.1], [cx + Math.cos(a) * rx * 0.97, cy + Math.sin(a) * ry * 0.97]], 3, GILLLN); }
};
// a cap with its gills facing the viewer (mushroom lying on its top), stem rising from the middle
const mushroomUp = (c: Ctx, cx: number, cy: number, rx: number, ry: number, stemH: number) => {
  shadow(c, cx + rx * 0.1, cy + ry * 1.25, rx * 1.05, ry * 0.3);
  const under = () => { c.moveTo(cx - rx, cy); c.bezierCurveTo(cx - rx * 0.95, cy + ry * 1.25, cx + rx * 0.95, cy + ry * 1.25, cx + rx, cy); c.closePath(); };
  shape(c, under, CAP); shade(c, under, CAPDK, -rx * 0.2, -ry * 0.3, 0.6);
  shape(c, () => ell(c, cx, cy, rx, ry), GILL);
  gillsOn(c, cx, cy, rx, ry);
  const sw = rx * 0.12, stem = () => { c.moveTo(cx - sw, cy); c.lineTo(cx - sw, cy - stemH); c.lineTo(cx + sw, cy - stemH); c.lineTo(cx + sw, cy); c.bezierCurveTo(cx + sw, cy + sw * 0.55, cx - sw, cy + sw * 0.55, cx - sw, cy); c.closePath(); };
  shape(c, stem, STEM); shade(c, stem, STEMDK, -sw * 0.8, 0, 0.8);
  shape(c, () => ell(c, cx, cy - stemH, sw, sw * 0.42), "#fffaf0", 5);
};
// a cap dome standing on its gills (face down), small stem stub on top
const capDown = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shadow(c, x + rx * 0.12, y + ry * 0.1, rx * 1.05, ry * 0.2);
  shape(c, () => rrect(c, x - rx * 0.12, y - ry * 1.18, rx * 0.24, ry * 0.3, 8), STEM, 5);
  const dome = () => { c.moveTo(x - rx, y); c.bezierCurveTo(x - rx, y - ry * 1.5, x + rx, y - ry * 1.5, x + rx, y); c.bezierCurveTo(x + rx * 0.6, y + ry * 0.25, x - rx * 0.6, y + ry * 0.25, x - rx, y); c.closePath(); };
  shape(c, dome, CAP); shade(c, dome, CAPDK, -rx * 0.25, -ry * 0.25, 0.55);
  shine(c, [[x - rx * 0.7, y - ry * 0.45], [x - rx * 0.4, y - ry * 0.95]], 9);
  c.beginPath(); c.moveTo(x - rx, y); c.bezierCurveTo(x - rx * 0.6, y + ry * 0.25, x + rx * 0.6, y + ry * 0.25, x + rx, y); c.strokeStyle = GILL; c.lineWidth = 8; c.stroke();
  c.beginPath(); c.moveTo(x - rx, y); c.bezierCurveTo(x - rx * 0.6, y + ry * 0.25, x + rx * 0.6, y + ry * 0.25, x + rx, y); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
};
const katoriDown = (c: Ctx, x: number, y: number, r: number, onTable = true) => {
  if (onTable) shadow(c, x + r * 0.15, y + r * 0.1, r * 1.1, r * 0.22);
  const body = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.95, y - r * 1.2, x + r * 0.95, y - r * 1.2, x + r, y); c.bezierCurveTo(x + r * 0.6, y + r * 0.28, x - r * 0.6, y + r * 0.28, x - r, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -r * 0.35, -r * 0.1, 0.6);
  shine(c, [[x - r * 0.72, y - r * 0.2], [x - r * 0.5, y - r * 0.72]], 12);
  c.beginPath(); c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.6, y + r * 0.28, x + r * 0.6, y + r * 0.28, x + r, y); c.strokeStyle = COL.steelIn; c.lineWidth = 9; c.stroke();
  c.beginPath(); c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.6, y + r * 0.28, x + r * 0.6, y + r * 0.28, x + r, y); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
};
const paper = (c: Ctx, cx: number, cy: number, col: string, k = 1) => {
  shape(c, () => polyP(c, [[cx - 190 * k + 20, cy - 110 * k + 22], [cx + 190 * k + 20, cy - 110 * k + 22], [cx + 230 * k + 20, cy + 130 * k + 22], [cx - 230 * k + 20, cy + 130 * k + 22]]), "rgba(43,35,64,0.16)", 0);
  shape(c, () => polyP(c, [[cx - 190 * k, cy - 110 * k], [cx + 190 * k, cy - 110 * k], [cx + 230 * k, cy + 130 * k], [cx - 230 * k, cy + 130 * k]]), col, 6);
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  // three colour groups, each on its own mat: greens together, red alone, purple alone
  const mat = (x: number, y: number, w: number, h: number, col: string) => {
    shape(c, () => rrect(c, x + 14, y + 16, w, h, 36), "rgba(43,35,64,0.16)", 0);
    shape(c, () => rrect(c, x, y, w, h, 36), col, 7);
  };
  mat(40, 110, 590, 860, "#cfe6ad"); mat(670, 110, 370, 380, "#f7c7bb"); mat(670, 530, 370, 440, "#d9c9ee");
  shadow(c, 140, 800, 70, 14); cucumber(c, 140, 230, 560, 62, 0);
  shadow(c, 350, 760, 100, 16); capsicum(c, 340, 530, 105, 200, 0);
  shadow(c, 520, 740, 50, 12); chilli(c, 495, 280, 400, 46, 0);
  shadow(c, 870, 450, 110, 16); tomato(c, 855, 320, 125);
  shadow(c, 870, 940, 90, 14); brinjal(c, 855, 590, 330, 92, 0);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  // close-ups of the top of each vegetable: the three with a green cap are ticked, the cucumber has none
  const tile = (x: number, y: number, ok: boolean, draw: (x: number, y: number) => void) => {
    shape(c, () => rrect(c, x + 14, y + 16, 450, 450, 28), "rgba(43,35,64,0.16)", 0);
    shape(c, () => rrect(c, x, y, 450, 450, 28), COL.paper, 6);
    c.save(); c.beginPath(); rrect(c, x + 3, y + 3, 444, 444, 26); c.clip(); draw(x + 225, y); c.restore();
    shape(c, () => rrect(c, x, y, 450, 450, 28), "rgba(0,0,0,0)", 6);
    shape(c, () => ell(c, x + 395, y + 55, 34, 34), ok ? COL.leaf : RED, 5);
    if (ok) line(c, [[x + 378, y + 56], [x + 391, y + 70], [x + 415, y + 40]], 8, WHITE);
    else { line(c, [[x + 380, y + 40], [x + 410, y + 70]], 8, WHITE); line(c, [[x + 410, y + 40], [x + 380, y + 70]], 8, WHITE); }
  };
  tile(50, 55, true, (cx, y) => tomato(c, cx, y + 360, 250));
  tile(580, 55, true, (cx, y) => brinjal(c, cx, y + 190, 560, 150, 0));
  tile(50, 575, true, (cx, y) => chilli(c, cx - 60, y + 190, 600, 82, -0.1));
  tile(580, 575, false, (cx, y) => cucumber(c, cx, y + 150, 600, 120, 0));
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  const SEED = "#f2e2a8", SEEDDK = "#c9a95a";
  const sq = (cx: number, top: number, icon: (x: number, y: number) => void, r: number, long: boolean) => {
    shape(c, () => rrect(c, cx - 145 + 12, top + 14, 290, 430, 10), "rgba(43,35,64,0.16)", 0);
    shape(c, () => rrect(c, cx - 145, top, 290, 430, 10), WHITE, 5);
    icon(cx, top + 150);
    [[-85, 285], [0, 265], [85, 285], [-48, 375], [48, 375]].forEach(([dx, dy], i) => {
      const x = cx + dx, y = top + dy, rot = long ? -0.5 + i * 0.35 : 0, rx = long ? 50 : r, ry = long ? 19 : r;
      shape(c, () => ell(c, x, y, rx, ry, rot), SEED, long ? 4 : 3.5);
      c.save(); c.beginPath(); ell(c, x, y, rx, ry, rot); c.clip(); c.beginPath(); ell(c, x + rx * 0.3, y + ry * 0.3, rx, ry, rot); c.fillStyle = SEEDDK; c.globalAlpha = 0.5; c.fill(); c.restore(); c.globalAlpha = 1;
    });
  };
  sq(200, 60, (x, y) => tomato(c, x, y - 30, 72), 22, false);
  sq(540, 60, (x, y) => brinjal(c, x, y - 118, 165, 44, 0), 21, false);
  sq(880, 60, (x, y) => chilli(c, x - 30, y - 115, 165, 28, 0.0), 24, false);
  sq(370, 560, (x, y) => capsicum(c, x, y - 105, 62, 112, 0), 27, false);
  sq(710, 560, (x, y) => cucumber(c, x, y - 120, 175, 34, 0), 0, true);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  // the square stem, cut across, in a card
  shape(c, () => rrect(c, 714 + 12, 70 + 14, 300, 300, 28), "rgba(43,35,64,0.16)", 0);
  shape(c, () => rrect(c, 714, 70, 300, 300, 28), COL.paper, 6);
  shape(c, () => rrect(c, 774, 130, 180, 180, 24), "#8a6aa8", 7);
  shape(c, () => rrect(c, 810, 166, 108, 108, 16), "#d9c6e6", 5);
  for (const [px, py] of [[774, 130], [954, 130], [774, 310], [954, 310]]) shape(c, () => ell(c, px, py, 14, 14), "#6a4a88", 4);
  // the stem and its leaves
  shadow(c, 500, 960, 70, 14);
  stemLine(c, [[480, 150], [480, 950]], 34, "#8a6aa8");
  for (const [ty, s] of [[230, 220], [390, 190]]) { leaf(c, 480, ty, s, UL + 0.25, "#4f9a45"); leaf(c, 480, ty, s, UR - 0.25, "#4f9a45"); }
  leaf(c, 480, 150, 120, -Math.PI / 2, "#4f9a45");
  // the child feels it with eyes closed
  shape(c, () => ell(c, 170, 330, 120, 128), SKIN.child);
  shape(c, () => { c.moveTo(52, 315); c.bezierCurveTo(55, 160, 285, 160, 288, 315); c.quadraticCurveTo(170, 255, 52, 315); c.closePath(); }, CLOTH.hair, 5);
  for (const ex of [125, 215]) { c.beginPath(); c.arc(ex, 335, 16, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); }
  c.beginPath(); c.arc(170, 390, 26, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  hand(c, 690, 680, Math.PI, 3, SKIN.child, CLOTH.child);
  const ar: number[][] = []; for (let k = 0; k <= 8; k++) { const a = Math.PI * (0.15 + 0.7 * (1 - k / 8)); ar.push([480 + Math.cos(a) * 125, 440 + Math.sin(a) * 40]); }
  arrow(c, ar, RED, 12);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e8d7b6"; c.fillRect(0, 930, 1080, 150); line(c, [[0, 930], [1080, 930]], 6);
  shadow(c, 250, 952, 120, 16); shadow(c, 790, 952, 120, 16);
  // mint: two leaves face each other at every joint. coriander: one leaf at a joint, then the next one on the other side
  const joint = (x: number, y: number) => shape(c, () => ell(c, x, y, 17, 17), COL.yellow, 5);
  const H = 800, M = 250, K = 790;
  stemLine(c, [[M, 940], [M, 940 - H]], 16, COL.green);
  for (const t of [0.2, 0.42, 0.64, 0.86]) { leaf(c, M, 940 - H * t, 210, UL, "#3f9a52"); leaf(c, M, 940 - H * t, 210, UR, "#3f9a52"); }
  for (const t of [0.2, 0.42, 0.64, 0.86]) joint(M, 940 - H * t);
  stemLine(c, [[K, 940], [K, 940 - H]], 14, COL.greenLt);
  [[0.2, UL], [0.4, UR], [0.6, UL], [0.8, UR]].forEach(([t, a]) => lobed(c, K, 940 - H * t, a, 200));
  for (const t of [0.2, 0.4, 0.6, 0.8]) joint(K, 940 - H * t);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  // the child, eyes closed, smelling
  shape(c, () => ell(c, 800, 640, 250, 150), CLOTH.child);
  shade(c, () => ell(c, 800, 640, 250, 150), CLOTH.childDk, -60, -20, 0.6);
  shape(c, () => ell(c, 800, 300, 165, 175), SKIN.child);
  shape(c, () => { c.moveTo(633, 280); c.bezierCurveTo(640, 90, 960, 90, 967, 280); c.quadraticCurveTo(800, 200, 633, 280); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, 645, 345, 38, 30), SKIN.child, 5);
  for (const ex of [715, 820]) { c.beginPath(); c.arc(ex, 300, 22, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); }
  c.beginPath(); c.arc(790, 420, 36, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  // the leaf in the fingers, the smell drifting to the nose
  leaf(c, 350, 405, 270, -0.5, "#4f9a45");
  hand(c, 190, 430, 0.0, 2.2, SKIN.child, CLOTH.child);
  for (const k of [0, 1, 2]) { const pts: number[][] = []; for (let t = 0; t <= 14; t++) pts.push([470 + k * 45 + Math.sin(t * 0.8 + k) * 14, 270 - t * 11]); line(c, pts, 8, COL.teal); }
  arrow(c, [[300, 560], [440, 560]], RED, 12); arrow(c, [[440, 610], [300, 610]], RED, 12);
  // five herbs on the table
  c.fillStyle = "#e8d7b6"; c.fillRect(0, 760, 1080, 320); line(c, [[0, 760], [1080, 760]], 6);
  tulsi(c, 130, 1050, 270, -0.2); mint(c, 330, 1050, 270, 0.1); coriander(c, 540, 1050, 270, -0.1); curry(c, 760, 1050, 270, 0.15); lemongrass(c, 960, 1050, 270, -0.1);
};

// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  mushroomUp(c, 370, 710, 330, 170, 270);
  const lx = 740, ly = 640, r = 165;
  shadow(c, lx + 30, ly + r + 10, r, 24);
  const hp = [[lx + Math.cos(-0.75) * (r + 6), ly + Math.sin(-0.75) * (r + 6)], [lx + Math.cos(-0.75) * (r + 220), ly + Math.sin(-0.75) * (r + 220)]];
  line(c, hp, 44, INK); line(c, hp, 32, COL.woodDk);
  shape(c, () => ell(c, lx, ly, r, r), GILL, 0);
  c.save(); c.beginPath(); c.arc(lx, ly, r, 0, 7); c.clip();
  for (let k = -6; k < 12; k++) { const a = -1.9 + k * 0.1; line(c, [[lx - 260 + Math.cos(a) * 60, ly + 330 + Math.sin(a) * 60], [lx - 260 + Math.cos(a) * 700, ly + 330 + Math.sin(a) * 700]], 11, k % 2 ? GILLLN : "#f6e4d0"); }
  c.restore();
  shape(c, () => ell(c, lx, ly, r, r), "rgba(214,236,250,0.25)", 0);
  c.beginPath(); c.arc(lx, ly, r, 0, 7); c.strokeStyle = INK; c.lineWidth = 34; c.stroke();
  c.beginPath(); c.arc(lx, ly, r, 0, 7); c.strokeStyle = COL.steel; c.lineWidth = 22; c.stroke();
  shine(c, [[lx - r * 0.7, ly - r * 0.2], [lx - r * 0.4, ly - r * 0.65]], 9);
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  // left: white paper, cap already under its katori. right: black paper, cap face down, a katori coming down over it
  paper(c, 270, 800, WHITE, 0.9);
  katoriDown(c, 270, 830, 170);
  shape(c, () => rrect(c, 270 - 36, 830 - 170 * 0.98 - 10, 72, 26, 10), COL.steelDk, 5);
  paper(c, 770, 810, "#3a3540", 0.9);
  capDown(c, 770, 840, 120, 85);
  katoriDown(c, 770, 450, 170, false);
  shape(c, () => rrect(c, 770 - 36, 450 - 170 * 0.98 - 10, 72, 26, 10), COL.steelDk, 5);
  hand(c, 770 + 70 * 1.9 - 15, 290, Math.PI, 1.9, SKIN.adult, CLOTH.adult);
  arrow(c, [[770, 520], [770, 640]], RED, 14);
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[110 + 20, 380 + 22], [620 + 20, 380 + 22], [670 + 20, 950 + 22], [40 + 20, 950 + 22]]), "rgba(43,35,64,0.16)", 0);
  shape(c, () => polyP(c, [[110, 380], [620, 380], [670, 950], [40, 950]]), WHITE, 6);
  const pts: number[][] = [], n = 20, px = 350, py = 640;
  for (let i = 0; i < n * 2; i++) { const a = (i * Math.PI) / n, k = i % 2 ? 0.8 : 1; pts.push([px + Math.cos(a) * 240 * k, py + Math.sin(a) * 170 * k]); }
  shape(c, () => polyP(c, pts), SPORE, 5);
  for (let i = 0; i < n; i++) { const a = (i * 2 * Math.PI) / n; line(c, [[px + Math.cos(a) * 55, py + Math.sin(a) * 40], [px + Math.cos(a) * 180, py + Math.sin(a) * 128]], 4, "#5e3720"); }
  shape(c, () => ell(c, px, py, 38, 27), "#c9a07a", 4);
  seed(c, 540, 885, 62, 0.3);
  // the cap lifted away in a hand
  shape(c, () => rrect(c, 760, 230, 80, 190, 14), "#e6d0aa", 5);
  const dome = () => { c.moveTo(640, 250); c.bezierCurveTo(640, 60, 960, 60, 960, 250); c.bezierCurveTo(910, 295, 690, 295, 640, 250); c.closePath(); };
  shape(c, dome, CAP); shade(c, dome, CAPDK, -35, -25, 0.55);
  shine(c, [[690, 210], [730, 130]], 10);
  c.beginPath(); c.moveTo(640, 250); c.bezierCurveTo(690, 295, 910, 295, 960, 250); c.strokeStyle = GILL; c.lineWidth = 10; c.stroke();
  c.beginPath(); c.moveTo(640, 250); c.bezierCurveTo(690, 295, 910, 295, 960, 250); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
  hand(c, 800 + 70 * 1.7, 370, Math.PI, 1.7, SKIN.adult, CLOTH.adult);
  arrow(c, [[720, 520], [720, 390]], RED, 12);
};

export const su_classificationSortingLivingThings = cards("sci.classification.sorting-living-things.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
