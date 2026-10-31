import type { Ctx } from "./core";
import { INK, BG, WHITE, COL, CLOTH, ground, rnd, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, hand, write, leaf, cards } from "./flatKit";

// SU · sci.ecology.food-chains.L3 set-up cards: ants and food, leaf bites and the biters, the tube-light food chain.

// ---------------------------------------------------------------- shared pieces
const ANT = "#6b2f26", DUSK = "#5a5aa0", DUSKDK = "#47478a";
// shade on the lower-right side of a shape
const shadeLR = (c: Ctx, p: () => void, col: string, d: number, a = 0.55) => shade(c, p, col, -d, -d * 0.8, a);
const thick = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 10, INK); line(c, pts, w, col); };
const arcPts = (cx: number, cy: number, r: number, a0: number, a1: number, n = 14) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
// a right hand mirrored so it points left (thumb stays up); an = angle below the leftward direction
const handM = (c: Ctx, wx: number, wy: number, an: number, s: number) => { c.save(); c.translate(wx, 0); c.scale(-1, 1); hand(c, 0, wy, an, s); c.restore(); };
const floorTiles = (c: Ctx) => { ground(c, "#eadcc0"); c.strokeStyle = "rgba(43,35,64,0.13)"; c.lineWidth = 6; for (const v of [0, 360, 720, 1080]) { c.beginPath(); c.moveTo(v, 0); c.lineTo(v, 1080); c.stroke(); c.beginPath(); c.moveTo(0, v); c.lineTo(1080, v); c.stroke(); } };

// a small paper square lying on the floor, centre (x, y), width w
const paperSq = (c: Ctx, x: number, y: number, w: number) => {
  const h = w * 0.66, k = w * 0.08, p = () => polyP(c, [[x - w / 2 + k, y - h / 2], [x + w / 2 + k, y - h / 2], [x + w / 2 - k, y + h / 2], [x - w / 2 - k, y + h / 2]]);
  shadow(c, x + w * 0.06, y + h * 0.5, w * 0.55, h * 0.2);
  shape(c, p, WHITE, 6); shadeLR(c, p, "#d6cdb9", w * 0.07);
  c.beginPath(); polyP(c, [[x - w / 2 + k, y - h / 2], [x + w / 2 + k, y - h / 2], [x + w / 2 - k, y + h / 2], [x - w / 2 - k, y + h / 2]]); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
};
const sugarPile = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => { c.moveTo(x - 64 * s, y); c.bezierCurveTo(x - 50 * s, y - 72 * s, x + 50 * s, y - 72 * s, x + 64 * s, y); c.closePath(); };
  shape(c, p, "#fff3c4", 5); shadeLR(c, p, "#e6cf86", 14 * s);
  for (const [dx, dy, r] of [[-30, -14, 8], [-6, -34, 9], [22, -20, 8], [-12, -8, 7], [34, -6, 7], [8, -12, 8]]) shape(c, () => polyP(c, [[x + (dx - r) * s, y + dy * s], [x + dx * s, y + (dy - r) * s], [x + (dx + r) * s, y + dy * s], [x + dx * s, y + (dy + r) * s]]), WHITE, 2.5);
  line(c, [[x - 24 * s, y - 52 * s], [x - 24 * s, y - 36 * s]], 4, COL.yellow); line(c, [[x - 32 * s, y - 44 * s], [x - 16 * s, y - 44 * s]], 4, COL.yellow);
};
const saltPile = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => { c.moveTo(x - 62 * s, y); c.quadraticCurveTo(x - 20 * s, y - 10 * s, x, y - 62 * s); c.quadraticCurveTo(x + 20 * s, y - 10 * s, x + 62 * s, y); c.closePath(); };
  shape(c, p, "#e3e8ef", 5); shadeLR(c, p, "#aab4c3", 14 * s);
  const r = rnd(5); for (let i = 0; i < 14; i++) { const t = r(), u = r(); shape(c, () => ell(c, x + (t - 0.5) * 80 * s * (1 - u * 0.8), y - 6 * s - u * 40 * s, 3.2 * s, 3.2 * s), "#6f7a8c", 0); }
};
const chapati = (c: Ctx, x: number, y: number, s: number) => {
  const p = (dy: number) => () => { c.moveTo(x - 60 * s, y + 22 * s + dy); c.quadraticCurveTo(x - 70 * s, y - 30 * s + dy, x - 10 * s, y - 48 * s + dy); c.quadraticCurveTo(x + 50 * s, y - 44 * s + dy, x + 66 * s, y + 10 * s + dy); c.quadraticCurveTo(x + 10 * s, y + 36 * s + dy, x - 60 * s, y + 22 * s + dy); c.closePath(); };
  shape(c, p(10 * s), COL.woodDk, 5); shape(c, p(0), "#efc07a", 5); shadeLR(c, p(0), "#d9a15a", 12 * s);
  for (const [dx, dy, r] of [[-30, -10, 8], [8, -24, 7], [26, 2, 9], [-8, 8, 6]]) shape(c, () => ell(c, x + dx * s, y + dy * s, r * s, r * s * 0.7), COL.brown, 0);
};
const ant = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  for (const k of [-1, 1]) for (const lx of [-8, 2, 12]) line(c, [[lx, 0], [lx + (lx < 0 ? -9 : lx > 5 ? 9 : 1), k * 17], [lx + (lx < 0 ? -18 : lx > 5 ? 20 : 2), k * 27]], 4);
  shape(c, () => ell(c, -26, 0, 24, 16), ANT, 4); shape(c, () => ell(c, 0, 0, 15, 11), ANT, 4); shape(c, () => ell(c, 24, 0, 13, 11), ANT, 4);
  line(c, [[30, -6], [44, -18], [56, -15]], 3); line(c, [[30, 6], [44, 18], [56, 15]], 3);
  shape(c, () => ell(c, -30, -5, 9, 4), "#a85a4a", 0);
  c.restore();
};
const antsAround = (c: Ctx, x: number, y: number, n: number, rx: number, ry: number, seed: number, s = 0.9) => { const r = rnd(seed); for (let i = 0; i < n; i++) ant(c, x + (r() - 0.5) * 2 * rx, y + (r() - 0.5) * 2 * ry, s, r() * 6.28); };

const clock = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 1.1, r * 0.9, r * 0.14);
  for (const s of [-1, 1]) { line(c, [[x + s * r * 0.55, y + r * 0.8], [x + s * r * 0.72, y + r * 1.08]], 24, INK); shape(c, () => ell(c, x + s * r * 0.62, y - r * 0.88, r * 0.34, r * 0.22, s * 0.55), COL.steel, 5); }
  line(c, [[x, y - r * 1.0], [x, y - r * 1.2]], 14, INK); shape(c, () => ell(c, x, y - r * 1.2, r * 0.1, r * 0.1), COL.steelDk, 4);
  const o = () => ell(c, x, y, r, r);
  shape(c, o, COL.red, 7); shadeLR(c, o, "#b03d2c", r * 0.1);
  shape(c, () => ell(c, x, y, r * 0.82, r * 0.82), WHITE, 5);
  for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 0.66, y + Math.sin(a) * r * 0.66], [x + Math.cos(a) * r * 0.76, y + Math.sin(a) * r * 0.76]], i % 3 ? 5 : 9); }
  // ten minutes have gone: a red wedge from 12 to 2
  c.beginPath(); c.moveTo(x, y); c.arc(x, y, r * 0.6, -Math.PI / 2, -Math.PI / 6); c.closePath(); c.fillStyle = "rgba(215,55,43,0.3)"; c.fill();
  arrow(c, arcPts(x, y, r * 0.48, -Math.PI / 2 + 0.1, -Math.PI / 6 - 0.1, 10), undefined, 8);
  line(c, [[x, y], [x + Math.cos(-Math.PI / 6) * r * 0.62, y + Math.sin(-Math.PI / 6) * r * 0.62]], 10);
  line(c, [[x, y], [x + Math.cos(-1.48) * r * 0.4, y + Math.sin(-1.48) * r * 0.4]], 14);
  shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), INK, 0);
  write(c, "10", x - r * 0.16, y + r * 0.26, r * 0.22, INK, 6);
};

// a pencil lying along (dx, dy) from (x, y), length len, tip at the end
const pencil = (c: Ctx, x: number, y: number, dx: number, dy: number, len: number) => {
  const tx = x + dx * len, ty = y + dy * len, bx = tx - dx * 40, by = ty - dy * 40, nx = -dy, ny = dx;
  line(c, [[x, y], [bx, by]], 28, INK); line(c, [[x, y], [bx, by]], 18, COL.yellow);
  shape(c, () => polyP(c, [[bx + nx * 14, by + ny * 14], [tx, ty], [bx - nx * 14, by - ny * 14]]), "#f2c9a0", 5);
  shape(c, () => polyP(c, [[tx - dx * 12 + nx * 5, ty - dy * 12 + ny * 5], [tx, ty], [tx - dx * 12 - nx * 5, ty - dy * 12 - ny * 5]]), INK, 2);
};

// a caterpillar: round segments from pts[0] (tail) to the last (head)
const caterpillar = (c: Ctx, pts: number[][], r: number) => {
  pts.forEach(([x, y], i) => { if (i < pts.length - 1) { line(c, [[x, y + r * 0.7], [x - 3, y + r * 1.25]], 6); } });
  pts.forEach(([x, y], i) => {
    const head = i === pts.length - 1, p = () => ell(c, x, y, r * (head ? 0.95 : 1), r * (head ? 0.95 : 1));
    shape(c, p, head ? COL.orange : i % 2 ? "#7cc24a" : COL.greenLt, 5); shadeLR(c, p, head ? "#c97520" : COL.greenDk, r * 0.25, 0.5);
    if (!head) line(c, [[x, y - r * 0.55], [x, y + r * 0.1]], 4, COL.greenDk);
  });
  const [hx, hy] = pts[pts.length - 1];
  shape(c, () => ell(c, hx - r * 0.2, hy - r * 0.2, r * 0.16, r * 0.2), INK, 0); shape(c, () => ell(c, hx + r * 0.35, hy - r * 0.2, r * 0.16, r * 0.2), INK, 0);
};

// ---------------------------------------------------------------- experiment e1: ants choose
// setup.e1.0
const su_e1_0 = (c: Ctx) => {
  floorTiles(c);
  // a line of ants walking in from the top left
  const trail: number[][] = [[90, 150], [230, 230], [330, 340], [400, 450], [440, 560]];
  trail.forEach(([x, y], i) => { const n = trail[Math.min(i + 1, trail.length - 1)], p = trail[Math.max(i - 1, 0)]; ant(c, x, y, 1.3, Math.atan2(n[1] - p[1], n[0] - p[0])); });
  const xs = [200, 440, 680, 920], y = 790;
  xs.forEach((x) => paperSq(c, x, y, 215));
  sugarPile(c, xs[0], y + 16, 1.3); saltPile(c, xs[1], y + 16, 1.3); chapati(c, xs[2], y + 8, 1.15);
};

// setup.e1.1
const su_e1_1 = (c: Ctx) => {
  floorTiles(c);
  clock(c, 660, 320, 205);
  // ants hurry along to the sugar
  const trail: number[][] = [[985, 690], [885, 722], [785, 733], [685, 740], [590, 765], [510, 805]];
  trail.forEach(([x, y], i) => { const n = trail[Math.min(i + 1, trail.length - 1)], p = trail[Math.max(i - 1, 0)]; ant(c, x, y, 0.95, Math.atan2(n[1] - p[1], n[0] - p[0]) + (i === trail.length - 1 ? 0.3 : 0)); });
  const xs = [420, 590, 760, 930], y = 920;
  xs.forEach((x) => paperSq(c, x, y, 150));
  sugarPile(c, xs[0], y + 8, 0.85); saltPile(c, xs[1], y + 8, 0.85); chapati(c, xs[2], y + 4, 0.78);
  antsAround(c, xs[0], y - 4, 4, 52, 20, 21, 0.75); antsAround(c, xs[2], y - 4, 1, 20, 8, 23, 0.75);
  person(c, 140, 1040, 470, { sit: true });
};

// setup.e1.2
const su_e1_2 = (c: Ctx) => {
  floorTiles(c);
  const xs = [190, 420, 650, 880], y = 245;
  xs.forEach((x) => paperSq(c, x, y, 225));
  sugarPile(c, xs[0], y + 12, 1.1); saltPile(c, xs[1], y + 12, 1.1); chapati(c, xs[2], y + 6, 1.0);
  antsAround(c, xs[0], y + 10, 13, 95, 38, 31, 0.8); antsAround(c, xs[2], y + 6, 3, 60, 25, 33, 0.8);
  // the page of the notebook: a table of counts
  const p = () => rrect(c, 110, 450, 860, 560, 20);
  shadow(c, 560, 1012, 440, 22);
  shape(c, p, COL.paper, 7);
  c.lineWidth = 6; c.strokeStyle = INK;
  for (const gx of [150, 345, 540, 735, 930]) { c.beginPath(); c.moveTo(gx, 500); c.lineTo(gx, 960); c.stroke(); }
  for (const gy of [500, 700, 960]) { c.beginPath(); c.moveTo(150, gy); c.lineTo(930, gy); c.stroke(); }
  const cx = [247, 442, 637, 832];
  sugarPile(c, cx[0], 670, 0.7); saltPile(c, cx[1], 670, 0.7); chapati(c, cx[2], 655, 0.65); paperSq(c, cx[3], 625, 110);
  ["12", "0", "3", "0"].forEach((t, i) => write(c, t, cx[i] - (t.length === 2 ? 0.7 : 0.3) * 110 * (t.length === 2 ? 1 : 1), 735, 110, INK, 11));
  // a hand writing with a pencil
  const s = 1.6, an = -0.927, dx = -Math.cos(an), dy = Math.sin(an), tx = 830, ty = 820, wx = tx - dx * (78 * s + 70), wy = ty - dy * (78 * s + 70);
  pencil(c, wx + dx * 20, wy + dy * 20, dx, dy, 78 * s + 70 - 20);
  handM(c, wx, wy, an, s);
};

// ---------------------------------------------------------------- experiment e2: leaf bite survey
const bigLeaf = (c: Ctx, x: number, y: number, len: number, an: number, fill: string, vein: string, wid = 0.3) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len, nx = -Math.sin(an) * len * wid, ny = Math.cos(an) * len * wid, mx = (x + tx) / 2, my = (y + ty) / 2;
  const p = () => { c.moveTo(x, y); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, x, y); c.closePath(); };
  shape(c, p, fill, 6); shadeLR(c, p, vein, len * 0.04, 0.35);
  line(c, [[x, y], [x + (tx - x) * 0.94, y + (ty - y) * 0.94]], 6, vein);
  for (const t of [0.2, 0.35, 0.5, 0.65, 0.8]) for (const k of [-1, 1]) {
    const px = x + (tx - x) * t, py = y + (ty - y) * t, w = Math.sin(Math.PI * Math.min(0.95, t + 0.08)) * len * wid * 0.55;
    line(c, [[px, py], [px + Math.cos(an) * w * 0.7 - Math.sin(an) * w * k, py + Math.sin(an) * w * 0.7 + Math.cos(an) * w * k]], 4, vein);
  }
  return { tx, ty };
};
const hole = (c: Ctx, x: number, y: number, r: number, bg: string) => shape(c, () => ell(c, x, y, r, r * 0.85, 0.4), bg, 5);

// setup.e2.0
const su_e2_0 = (c: Ctx) => {
  ground(c);
  const BGC = BG;
  thick(c, [[260, 1020], [330, 860], [420, 700], [520, 520], [600, 330]], 26, COL.brown);
  // six leaves; three of them have holes
  const lf = (x: number, y: number, len: number, an: number, t = 0, r = 0, off = 0) => {
    bigLeaf(c, x, y, len, an, COL.leaf, COL.leafDk);
    if (r) hole(c, x + Math.cos(an) * len * t - Math.sin(an) * off, y + Math.sin(an) * len * t + Math.cos(an) * off, r, BGC);
  };
  lf(330, 860, 250, -2.6, 0.6, 24, 6); lf(330, 860, 290, -0.3);
  lf(420, 700, 260, -2.5, 0.62, 30, 8); lf(420, 700, 300, -0.75, 0.75, 34, 4);
  lf(520, 520, 230, -2.4); lf(600, 330, 210, -1.5);
  // magnifying glass and hand
  const s = 1.7, an = -0.927, dx = -Math.cos(an), dy = Math.sin(an), lx = 640, ly = 470, hx = lx - dx * 380, hy = ly - dy * 380, wx = hx - dx * 119, wy = hy - dy * 119;
  line(c, [[lx - dx * 150, ly - dy * 150], [hx - dx * 20, hy - dy * 20]], 44, INK); line(c, [[lx - dx * 150, ly - dy * 150], [hx - dx * 20, hy - dy * 20]], 30, COL.woodDk);
  c.save(); c.beginPath(); ell(c, lx, ly, 160, 160); c.clip();
  c.fillStyle = COL.leaf; c.fillRect(lx - 170, ly - 170, 340, 340);
  line(c, [[lx - 40, ly + 170], [lx + 10, ly - 170]], 14, COL.leafDk); line(c, [[lx - 20, ly + 60], [lx + 120, ly - 20]], 9, COL.leafDk); line(c, [[lx - 10, ly + 10], [lx - 130, ly - 60]], 9, COL.leafDk);
  shape(c, () => ell(c, lx - 70, ly - 50, 62, 52, 0.4), BGC, 8); shape(c, () => ell(c, lx + 80, ly + 70, 34, 28, -0.3), BGC, 8);
  c.restore();
  c.beginPath(); ell(c, lx, ly, 160, 160); c.lineWidth = 34; c.strokeStyle = INK; c.stroke(); c.beginPath(); ell(c, lx, ly, 160, 160); c.lineWidth = 22; c.strokeStyle = COL.steel; c.stroke();
  shine(c, [[lx - 120, ly + 30], [lx - 90, ly - 90]], 10);
  handM(c, wx, wy, an, s);
};

// setup.e2.1
const su_e2_1 = (c: Ctx) => {
  ground(c);
  thick(c, [[40, 880], [110, 840], [190, 810]], 26, COL.brown);
  const an = -0.5, ox = 150, oy = 780, len = 740, tipx = ox + Math.cos(an) * len, tipy = oy + Math.sin(an) * len;
  bigLeaf(c, ox, oy, len, an, "#b5d98a", "#5f9a3a", 0.3);
  // droppings on the leaf
  for (const [x, y] of [[310, 730], [360, 770], [230, 690], [480, 790], [410, 810], [540, 740]]) { shape(c, () => ell(c, x, y, 17, 12, 0.5), "#3a3540", 3); }
  // the caterpillar crawling along the vein
  const cp: number[][] = []; for (let i = 0; i < 8; i++) { const t = 0.33 + i * 0.05; cp.push([ox + Math.cos(an) * len * t, oy + Math.sin(an) * len * t - Math.sin(i * 0.45) * 26 - 20]); }
  caterpillar(c, cp, 36);
  // a hand turning the leaf over by its tip
  const s = 1.7, hd = 0.7, dx = -Math.cos(hd), dy = Math.sin(hd);
  const hx = tipx - 30, hy = tipy + 20, wx = hx - dx * 119, wy = hy - dy * 119;
  handM(c, wx, wy, hd, s);
  arrow(c, arcPts(tipx - 200, tipy + 90, 210, -2.1, -0.6, 12));
};

// setup.e2.2
const su_e2_2 = (c: Ctx) => {
  ground(c);
  // the branch
  const br = [[30, 392], [300, 380], [700, 410], [1050, 400]];
  leaf(c, 940, 404, 190, -1.95);
  thick(c, br, 34, COL.brown);
  // the web and its two stems
  thick(c, [[190, 1060], [205, 780], [235, 580]], 20, COL.brown); thick(c, [[890, 1060], [870, 800], [840, 590]], 20, COL.brown);
  const wc = [540, 820], R = 230, wl = "#7a7390";
  line(c, [[wc[0] - R, wc[1] - 20], [222, 770]], 4, wl); line(c, [[wc[0] + R, wc[1] + 10], [862, 790]], 4, wl); line(c, [[wc[0] - 90, wc[1] - 210], [236, 600]], 4, wl); line(c, [[wc[0] + 90, wc[1] - 210], [840, 610]], 4, wl);
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [wc, [wc[0] + Math.cos(a) * R, wc[1] + Math.sin(a) * R]], 4, wl); }
  for (const r of [55, 105, 155, 205]) { const pts = Array.from({ length: 13 }, (_, i) => { const a = (i * Math.PI) / 6; return [wc[0] + Math.cos(a) * r, wc[1] + Math.sin(a) * r]; }); line(c, pts, 4, wl); }
  // the spider
  c.save(); c.translate(wc[0], wc[1]); c.scale(1.5, 1.5);
  for (const k of [-1, 1]) for (let i = 0; i < 4; i++) { const yy = -14 + i * 10; line(c, [[k * 12, yy], [k * 34, yy - 16 + i * 4], [k * 50, yy + 10 + i * 6]], 4); }
  shape(c, () => ell(c, 0, 14, 22, 28), "#4a3a5a", 4); shape(c, () => ell(c, 0, -18, 14, 13), "#4a3a5a", 4); shape(c, () => ell(c, 0, 14, 6, 10), COL.yellow, 0);
  c.restore();
  // the bulbul
  c.save(); c.translate(520, 400); c.scale(1.15, 1.15); c.translate(-520, -400);
  c.save(); c.translate(610, 330); c.rotate(0.62); shape(c, () => rrect(c, 0, -28, 290, 56, 26), "#7b5a43", 6); shape(c, () => rrect(c, 222, -28, 68, 56, 26), WHITE, 6); c.restore();
  const body = () => ell(c, 520, 295, 165, 100, 0.5);
  line(c, [[500, 360], [498, 402]], 12, INK); line(c, [[560, 360], [562, 402]], 12, INK);
  line(c, [[500, 360], [498, 402]], 6, COL.grey); line(c, [[560, 360], [562, 402]], 6, COL.grey);
  shape(c, body, "#8a6a52", 7);
  c.save(); c.beginPath(); body(); c.clip(); c.beginPath(); ell(c, 480, 355, 140, 62, 0.5); c.fillStyle = "#fffaf0"; c.fill(); c.restore();
  shape(c, () => ell(c, 560, 280, 105, 58, 0.55), "#6a4c3a", 5); line(c, [[500, 270], [610, 330]], 4, "#4a3426"); line(c, [[520, 245], [640, 305]], 4, "#4a3426");
  caterpillar(c, [[300, 244], [260, 254], [220, 270], [180, 290], [140, 312]], 22);
  shape(c, () => ell(c, 395, 215, 74, 72), "#3a3038", 6);
  shape(c, () => polyP(c, [[372, 160], [396, 72], [428, 152]]), "#3a3038", 5); shape(c, () => polyP(c, [[404, 152], [450, 86], [458, 164]]), "#3a3038", 5);
  shape(c, () => ell(c, 384, 245, 40, 26, -0.2), WHITE, 4); shape(c, () => ell(c, 440, 250, 13, 13), "#d7372b", 3);
  shape(c, () => polyP(c, [[328, 214], [262, 238], [330, 256]]), "#2b2340", 5);
  shape(c, () => ell(c, 376, 205, 11, 11), WHITE, 4); shape(c, () => ell(c, 374, 206, 5, 5), INK, 0);
  c.restore();
};

// ---------------------------------------------------------------- experiment e3: tube-light food chain
const tubeLight = (c: Ctx, x: number, y: number, w: number) => {
  shape(c, () => ell(c, x, y, w * 0.95, w * 0.55), "rgba(255,244,170,0.14)", 0);
  shape(c, () => ell(c, x, y, w * 0.7, w * 0.4), "rgba(255,244,170,0.16)", 0);
  shape(c, () => ell(c, x, y, w * 0.55, w * 0.27), "rgba(255,244,170,0.2)", 0);
  for (const s of [-1, 1]) shape(c, () => rrect(c, x + s * (w / 2 + 8) - 14, y - 40, 28, 80, 8), COL.steel, 5);
  const p = () => rrect(c, x - w / 2, y - 26, w, 52, 26);
  shape(c, p, "#fffbe0", 6); shadeLR(c, p, "#f0e19a", 8, 0.5);
  line(c, [[x - w * 0.4, y - 10], [x + w * 0.38, y - 10]], 8, WHITE);
};
const moth = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  for (const k of [-1, 1]) {
    shape(c, () => ell(c, k * 36, 26, 28, 20, k * -0.5), "#a87a4a", 4);
    shape(c, () => ell(c, k * 40, -10, 46, 26, k * 0.55), "#c89a5b", 4);
    shape(c, () => ell(c, k * 44, -12, 10, 8), "#f2c063", 3);
    line(c, [[k * 6, -42], [k * 18, -64], [k * 34, -66]], 3); line(c, [[k * 18, -64], [k * 24, -52]], 2.5); line(c, [[k * 28, -66], [k * 30, -54]], 2.5);
  }
  shape(c, () => ell(c, 0, 4, 11, 32), "#8a6a4a", 4); shape(c, () => ell(c, 0, -34, 11, 10), "#8a6a4a", 4);
  c.restore();
};
const midge = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => ell(c, -8, -12, 16, 8, -0.5), "rgba(255,255,255,0.85)", 2.5); shape(c, () => ell(c, 8, -12, 16, 8, 0.5), "rgba(255,255,255,0.85)", 2.5);
  for (const k of [-1, 1]) line(c, [[k * 4, 6], [k * 12, 16]], 2.5);
  shape(c, () => ell(c, 0, 0, 7, 14), "#3a3540", 2.5);
  c.restore();
};
const duskWall = (c: Ctx) => {
  ground(c, DUSK);
  const r = rnd(9); c.fillStyle = "rgba(43,35,64,0.1)"; for (let i = 0; i < 40; i++) { c.beginPath(); ell(c, r() * 1080, r() * 1080, 30 + r() * 60, 12 + r() * 20); c.fill(); }
  c.fillStyle = DUSKDK; c.fillRect(0, 1000, 1080, 80);
};

// setup.e3.0
const su_e3_0 = (c: Ctx) => {
  ground(c, "#e3d3b5");
  const wx = 250, wy = 70, ww = 760, wh = 700;
  c.save(); c.beginPath(); c.rect(wx, wy, ww, wh); c.clip();
  c.fillStyle = "#30306a"; c.fillRect(wx, wy, ww, 330); c.fillStyle = "#524a8a"; c.fillRect(wx, wy + 210, ww, 120);
  c.fillStyle = DUSK; c.fillRect(wx, wy + 300, ww, 420); c.fillStyle = "#7c7cba"; c.fillRect(wx, wy + 300, ww, 22);
  for (const [x, y] of [[350, 140], [560, 200], [820, 130], [930, 250], [690, 110], [420, 260]]) { line(c, [[x - 12, y], [x + 12, y]], 5, WHITE); line(c, [[x, y - 12], [x, y + 12]], 5, WHITE); }
  tubeLight(c, 750, 560, 340);
  c.restore();
  // the closed window
  c.strokeStyle = INK; c.lineWidth = 6;
  const fr = [[wx, wy + 330, ww, 22], [480, wy, 22, wh]];
  fr.forEach(([x, y, w, h]) => shape(c, () => rrect(c, x, y, w, h, 4), COL.brown, 6));
  c.beginPath(); rrect(c, wx, wy, ww, wh, 6); c.lineWidth = 40; c.strokeStyle = INK; c.stroke(); c.lineWidth = 28; c.strokeStyle = COL.brown; c.stroke();
  shape(c, () => rrect(c, wx - 34, wy + wh + 10, ww + 68, 44, 8), COL.woodDk, 6);
  shine(c, [[300, 120], [380, 280]], 12); shine(c, [[330, 110], [400, 250]], 8);
  // the child, notebook in hand
  person(c, 130, 1050, 540, { armL: [1.9, 0.15], armR: [1.2, 3.0] });
  const nx = 130, ny = 830;
  shape(c, () => rrect(c, nx - 100, ny - 60, 200, 140, 12), COL.paper, 6);
  for (const k of [0, 1, 2, 3]) line(c, [[nx - 76, ny - 28 + k * 30], [nx + 76, ny - 28 + k * 30]], 4, COL.glassEdge);
  shape(c, () => ell(c, nx - 100, ny + 60, 20, 20), "#b9794f", 5); shape(c, () => ell(c, nx + 100, ny + 60, 20, 20), "#b9794f", 5);
};

// setup.e3.1
const su_e3_1 = (c: Ctx) => {
  duskWall(c);
  tubeLight(c, 540, 430, 640);
  const r = rnd(12);
  const M: number[][] = [[300, 260, 0.2], [760, 250, -0.3], [250, 540, 0.8], [830, 560, -0.7], [540, 660, 3.1], [540, 220, 0.1], [400, 730, 0.4], [700, 760, -0.4]];
  M.forEach(([x, y, a], i) => moth(c, x, y, i < 4 ? 1.35 : 1.1, a));
  for (let i = 0; i < 14; i++) { const x = 90 + r() * 900, y = 120 + r() * 800; if (Math.abs(y - 430) > 60 || Math.abs(x - 540) > 340) midge(c, x, y, 1.1, r() * 6.28); }
};

// setup.e3.2
const su_e3_2 = (c: Ctx) => {
  duskWall(c);
  tubeLight(c, 400, 210, 520);
  moth(c, 840, 300, 1.15, 0.3); moth(c, 120, 440, 0.9, -0.3);
  for (const [x, y] of [[700, 120], [920, 420], [260, 400], [640, 400]]) midge(c, x, y, 1.0, x);
  // a house gecko on the wall, creeping up towards the moth
  const sp: number[][] = [[110, 900], [200, 840], [300, 770], [390, 700], [470, 640], [540, 580], [600, 520], [650, 465]];
  const dens: number[][] = []; for (let i = 0; i < sp.length - 1; i++) for (let k = 0; k < 8; k++) dens.push([sp[i][0] + ((sp[i + 1][0] - sp[i][0]) * k) / 8, sp[i][1] + ((sp[i + 1][1] - sp[i][1]) * k) / 8]);
  dens.push(sp[sp.length - 1]);
  const rad = (i: number) => { const t = i / (dens.length - 1); return t < 0.45 ? 8 + (t / 0.45) * 44 : t < 0.8 ? 52 : 52 - ((t - 0.8) / 0.2) * 12; };
  const dx = 0.62, dy = -0.78, nxv = 0.78, nyv = 0.62;
  // legs first
  const leg = (i: number, k: number, fwd: number) => {
    const [px, py] = dens[i], sd = k, ex = px + nxv * sd * 70 + dx * fwd * 10, ey = py + nyv * sd * 70 + dy * fwd * 10, fx = ex + nxv * sd * 40 + dx * fwd * 55, fy = ey + nyv * sd * 40 + dy * fwd * 55;
    line(c, [[px, py], [ex, ey], [fx, fy]], 40, INK); line(c, [[px, py], [ex, ey], [fx, fy]], 26, "#e8c7a0");
    const ba = Math.atan2(nyv * sd * 0.7 + dy * fwd * 0.7, nxv * sd * 0.7 + dx * fwd * 0.7);
    for (let t = -1.5; t <= 1.5; t++) { const a = ba + t * 0.4, tx = fx + Math.cos(a) * 46, ty = fy + Math.sin(a) * 46; line(c, [[fx, fy], [tx, ty]], 17, INK); line(c, [[fx, fy], [tx, ty]], 9, "#e8c7a0"); shape(c, () => ell(c, tx, ty, 10, 10), "#d9a98a", 4); }
  };
  leg(46, 1, 1); leg(46, -1, 1); leg(24, 1, -1); leg(24, -1, -1);
  dens.forEach(([x, y], i) => shape(c, () => ell(c, x, y, rad(i) + 5, rad(i) + 5), INK, 0));
  dens.forEach(([x, y], i) => shape(c, () => ell(c, x, y, rad(i), rad(i)), "#e8c7a0", 0));
  dens.forEach(([x, y], i) => { if (i > 6 && i % 3 === 0 && i < 56) shape(c, () => ell(c, x + 8, y + 6, rad(i) * 0.3, rad(i) * 0.25), "#c79c75", 0); });
  const [hx, hy] = sp[sp.length - 1];
  shape(c, () => ell(c, hx + 12, hy - 18, 54, 42, -0.9), "#e8c7a0", 6);
  for (const k of [-1, 1]) { const ex = hx + 12 + nxv * k * 24 + dx * 8, ey = hy - 18 + nyv * k * 24 + dy * 8; shape(c, () => ell(c, ex, ey, 14, 14), "#f2d68a", 4); shape(c, () => ell(c, ex, ey, 4, 10, -0.9), INK, 0); }
  arrow(c, [[hx + 60, hy - 90], [hx + 120, hy - 150], [hx + 170, hy - 190]]);
};

export const su_ecologyFoodChains = cards("sci.ecology.food-chains.L3 set-up", [su_e1_0, su_e1_1, su_e1_2, su_e2_0, su_e2_1, su_e2_2, su_e3_0, su_e3_1, su_e3_2]);
