import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, glass, rnd, cards } from "./flatKit";

// sci.planet-earth.soil-and-crops.L3 · picture cards for the unit's cover, experiments, activities, terms and explanations.

const thick = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };
const sh = (c: Ctx, p: () => void, col: string, d = 30, a = 0.55) => shade(c, p, col, -d, -d * 0.35, a);
const SOILS = ["#6a4128", "#a87a56", "#5a3822", "#c9a679", "#8a5a3c"];
const SKY = "#d9eefb";
const specks = (c: Ctx, cx: number, cy: number, rx: number, ry: number, n: number, seedN: number, cols: string[], rMin = 3, rMax = 7) => {
  const r = rnd(seedN);
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()), x = cx + Math.cos(a) * d * rx, y = cy + Math.sin(a) * d * ry;
    c.beginPath(); ell(c, x, y, rMin + r() * (rMax - rMin), (rMin + r() * (rMax - rMin)) * 0.75, r() * 3); c.fillStyle = cols[Math.floor(r() * cols.length)]; c.fill();
  }
};
// outlined grains, scattered in a box (for close-ups)
const grains = (c: Ctx, x0: number, y0: number, x1: number, y1: number, n: number, seedN: number, cols: string[], rMin: number, rMax: number, lw = 3) => {
  const r = rnd(seedN);
  for (let i = 0; i < n; i++) { const rr = rMin + r() * (rMax - rMin), x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0); shape(c, () => ell(c, x, y, rr, rr * (0.7 + r() * 0.3), r() * 3), cols[Math.floor(r() * cols.length)], lw); }
};
// a magnifier: content is drawn clipped inside the round glass
const lens = (c: Ctx, x: number, y: number, r: number, bg: string, content: () => void, handle = true) => {
  if (handle) { const a = Math.PI * 0.25; thick(c, [[x + Math.cos(a) * r * 0.95, y + Math.sin(a) * r * 0.95], [x + Math.cos(a) * (r + 150), y + Math.sin(a) * (r + 150)]], 30, COL.woodDk); }
  shape(c, () => ell(c, x, y, r, r), bg, 0);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); content(); c.restore();
  c.beginPath(); ell(c, x, y, r, r); c.lineWidth = 22; c.strokeStyle = INK; c.stroke(); c.lineWidth = 10; c.strokeStyle = COL.steel; c.stroke();
  shine(c, [[x - r * 0.65, y - r * 0.3], [x - r * 0.4, y - r * 0.62]], 10);
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
};
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) => shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 1.1, y + s * 0.2, x, y + s); c.quadraticCurveTo(x - s * 1.1, y + s * 0.2, x, y - s * 1.5); c.closePath(); }, col, 4);
// a soil slab seen from the side: top edge at y0, layers [colour, bottom y]; rounded bottom corners
const slab = (c: Ctx, x0: number, y0: number, x1: number, layers: [string, number][], inside?: () => void) => {
  const yb = layers[layers.length - 1][1], body = () => rrect(c, x0, y0, x1 - x0, yb - y0, 26);
  shadow(c, (x0 + x1) / 2 + 20, yb + 10, (x1 - x0) / 2, 20);
  c.save(); c.beginPath(); body(); c.clip();
  let top = y0; layers.forEach(([col, bot]) => { c.fillStyle = col; c.fillRect(x0 - 5, top, x1 - x0 + 10, bot - top + 1); top = bot; });
  inside?.();
  c.restore(); shape(c, body, "rgba(0,0,0,0)", 6);
};
const worm = (c: Ctx, pts: number[][], w: number) => {
  thick(c, pts, w, "#d98c82");
  for (let i = 2; i < pts.length - 1; i += 2) { const [a, b] = [pts[i - 1], pts[i + 1]], an = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2, [x, y] = pts[i]; line(c, [[x - Math.cos(an) * w * 0.42, y - Math.sin(an) * w * 0.42], [x + Math.cos(an) * w * 0.42, y + Math.sin(an) * w * 0.42]], 3, "#b8665c"); }
  const k = Math.floor(pts.length * 0.3); thick(c, pts.slice(k, k + 3), w, "#f0b6a8");
  const h = pts[pts.length - 1]; shape(c, () => ell(c, h[0], h[1], w * 0.52, w * 0.52), "#d98c82", 5);
};
const sprout = (c: Ctx, x: number, y: number, s: number) => {
  thick(c, [[x, y], [x, y - 90 * s]], 9 * s, COL.green);
  leaf(c, x, y - 80 * s, 80 * s, -Math.PI * 0.8); leaf(c, x, y - 80 * s, 80 * s, -Math.PI * 0.2);
};
const leaf = (c: Ctx, x: number, y: number, len: number, an: number, col: string = COL.leaf) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len, nx = -Math.sin(an) * len * 0.34, ny = Math.cos(an) * len * 0.34, mx = (x + tx) / 2, my = (y + ty) / 2;
  shape(c, () => { c.moveTo(x, y); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, x, y); c.closePath(); }, col, 5);
  line(c, [[x, y], [mx + (tx - mx) * 0.6, my + (ty - my) * 0.6]], 3, COL.leafDk);
};
const roots = (c: Ctx, x: number, y: number, spread: number, depth: number, col = "#f5ecd9") => {
  const R = [[0, 1, 0], [-0.5, 0.8, -0.5], [0.5, 0.85, 0.5], [-0.9, 0.5, -0.9], [0.9, 0.55, 0.9]];
  R.forEach(([dx, dy]) => { const p = [[x, y], [x + dx * spread * 0.4, y + dy * depth * 0.45], [x + dx * spread * 0.9, y + dy * depth * 0.9]]; line(c, p, 11, INK); line(c, p, 5, col); });
};
const pot = (c: Ctx, cx: number, by: number, w: number, h: number, soil: string, soilTop = true) => {
  const tw = w / 2, bw = w * 0.34, body = () => { c.moveTo(cx - tw, by - h); c.lineTo(cx - bw, by); c.lineTo(cx + bw, by); c.lineTo(cx + tw, by - h); c.closePath(); };
  shadow(c, cx + 20, by + 8, w * 0.5, 18);
  shape(c, body, "#c8673f"); sh(c, body, "#a24f2d", w * 0.3, 0.7);
  shape(c, () => rrect(c, cx - tw - 10, by - h - 36, w + 20, 46, 12), "#d6784c");
  if (soilTop) shape(c, () => ell(c, cx, by - h - 12, tw - 6, 14), soil, 4);
};
const cup = (c: Ctx, cx: number, y: number, rx: number, ry: number, h: number, soil: string = COL.soil): number[] => {
  const bw = rx * 0.74, body = () => { c.moveTo(cx - rx, y); c.lineTo(cx - bw, y + h); c.ellipse(cx, y + h, bw, ry * 0.85, 0, Math.PI, 0, true); c.lineTo(cx + rx, y); c.closePath(); };
  shadow(c, cx + rx * 0.2, y + h + ry * 0.6, rx * 0.95, ry * 0.5);
  shape(c, body, COL.teal); sh(c, body, COL.tealDk, rx * 0.5, 0.8);
  shine(c, [[cx - rx * 0.8, y + h * 0.2], [cx - rx * 0.62, y + h * 0.85]], 10);
  shape(c, () => ell(c, cx, y, rx, ry), "#6fd0c7", 6);
  shape(c, () => ell(c, cx, y + 8, rx * 0.93, ry * 0.8), soil, 4);
  return [cx, y + 8, rx * 0.93, ry * 0.8];
};
const hole = (c: Ctx, x: number, y: number, rx: number, ry: number) => { shape(c, () => ell(c, x, y, rx, ry), "#2f1d12", 3); shape(c, () => ell(c, x, y + ry * 0.3, rx * 0.6, ry * 0.5), "#170d07", 0); };
const jar = (c: Ctx, cx: number, by: number, w: number, h: number, inside: (x0: number, y0: number, x1: number, y1: number) => void) => {
  const x0 = cx - w / 2, y0 = by - h, body = () => rrect(c, x0, y0, w, h, 40);
  shadow(c, cx + w * 0.1, by + 8, w * 0.58, 22);
  shape(c, body, "rgba(255,255,255,0.5)", 0);
  c.save(); c.beginPath(); body(); c.clip(); inside(x0, y0, x0 + w, by); c.restore();
  shape(c, body, "rgba(214,236,250,0.2)", 6);
  shine(c, [[x0 + 24, y0 + 90], [x0 + 24, by - 70]], 10);
  const lid = () => rrect(c, x0 + w * 0.03, y0 - 50, w * 0.94, 64, 14);
  shape(c, lid, COL.steel); sh(c, lid, COL.steelDk, 60, 0.7);
};
const rock = (c: Ctx, cx: number, by: number, w: number, h: number, seedN: number, col = "#9a9aa3") => {
  const body = () => { c.moveTo(cx - w / 2, by); c.lineTo(cx - w * 0.5, by - h * 0.45); c.lineTo(cx - w * 0.28, by - h * 0.9); c.lineTo(cx + w * 0.08, by - h); c.lineTo(cx + w * 0.42, by - h * 0.7); c.lineTo(cx + w / 2, by - h * 0.25); c.lineTo(cx + w * 0.42, by); c.closePath(); };
  shadow(c, cx + w * 0.1, by + 6, w * 0.55, h * 0.1);
  shape(c, body, col, 7); sh(c, body, "#6e6e78", w * 0.28, 0.7);
  c.save(); c.beginPath(); body(); c.clip(); specks(c, cx, by - h * 0.5, w * 0.45, h * 0.45, 40, seedN, ["#f0c8c0", "#3a3540", "#ffffff", "#d9a69a"], 3, 7); c.restore();
};
const banana = (c: Ctx, cx: number, cy: number, s: number, col: string, spots: boolean) => {
  c.save(); c.translate(cx, cy); c.scale(s, s);
  const p = () => { c.moveTo(-120, -20); c.quadraticCurveTo(-20, 110, 120, -50); c.quadraticCurveTo(0, 50, -120, -20); c.closePath(); };
  shape(c, p, col, 7);
  if (spots) specks(c, 0, 20, 90, 14, 14, 3, ["#2b1d12"], 4, 8);
  shape(c, () => rrect(c, 112, -66, 22, 30, 5), spots ? "#4a3220" : "#7a6a2f", 5);
  c.restore();
};

// ---------------------------------------------------------------- the cards
// 0 intro: a spoon of soil stirred into a glass of water
const intro = (c: Ctx) => {
  ground(c);
  glass(c, 520, 900, 420, 560, 0.82, "#c9a77e");
  const gy = 900;
  grains(c, 380, gy - 70, 640, gy - 20, 22, 4, ["#a87a56", "#c9a679", "#8a5a3c"], 9, 14, 3);
  specks(c, 520, gy - 120, 130, 40, 25, 6, ["#7a5a3a"], 3, 6);
  specks(c, 500, gy - 330, 160, 100, 40, 8, ["#8a5a3c", "#a87a56"], 3, 7);
  specks(c, 520, gy - 450, 150, 14, 12, 9, ["#2f1d12"], 7, 11);
  thick(c, [[560, 280], [720, 160]], 22, COL.steel);
  shape(c, () => ell(c, 540, 300, 62, 34, -0.6), COL.steel, 7);
  shape(c, () => ell(c, 535, 290, 40, 20, -0.6), COL.soil, 4);
  arrow(c, [[380, 430], [330, 380], [380, 330], [450, 345]]);
  grains(c, 560, 360, 620, 420, 3, 12, ["#8a5a3c"], 7, 10);
};
// 1 summary: a plant in soil with grains, humus, a worm and rocks
const summary = (c: Ctx) => {
  ground(c, SKY);
  slab(c, 70, 520, 1010, [["#6a4128", 680], ["#a87a56", 840], ["#b9b4ab", 960]], () => {
    specks(c, 540, 600, 450, 80, 90, 3, ["#3a2414", "#8a5a3c", "#c9a679"], 4, 9);
    specks(c, 540, 760, 450, 70, 60, 5, ["#c9a679", "#8a5a3c", "#e0c9a0"], 5, 11);
    [[150, 900, 90], [370, 920, 70], [780, 905, 100], [930, 925, 60]].forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r * 0.6), "#9a9aa3", 5));
    [[250, 730], [700, 700], [850, 770]].forEach(([x, y]) => drop(c, x, y, 16));
  });
  roots(c, 540, 535, 300, 220);
  sprout(c, 540, 520, 1.7);
  const pts: number[][] = []; for (let i = 0; i < 18; i++) pts.push([700 + i * 14, 620 + Math.sin(i * 0.8) * 22]);
  worm(c, pts, 34);
};
// 2 e1: soil jar shaken, then settled in layers
const e1 = (c: Ctx) => {
  ground(c);
  jar(c, 250, 900, 340, 640, (x0, y0, x1, y1) => {
    c.fillStyle = "#c9a77e"; c.fillRect(x0, y0 + 120, x1 - x0, y1 - y0);
    specks(c, 250, 650, 150, 220, 140, 4, ["#8a5a3c", "#a87a56", "#6a4128", "#c9a679"], 4, 9);
  });
  jar(c, 810, 900, 340, 640, (x0, y0, x1, y1) => {
    c.fillStyle = "#e2cfae"; c.fillRect(x0, y0 + 120, x1 - x0, y1 - y0);
    c.fillStyle = "#a07048"; c.fillRect(x0, y1 - 200, x1 - x0, 200); c.fillStyle = "#c8a070"; c.fillRect(x0, y1 - 280, x1 - x0, 85);
    c.fillStyle = "#6a4128"; c.fillRect(x0, y1 - 330, x1 - x0, 50);
    grains(c, x0 + 10, y1 - 190, x1 - 10, y1 - 15, 26, 7, ["#d9bb85", "#c9a679", "#e8cf9a"], 9, 14, 3);
    specks(c, 810, y1 - 240, 150, 30, 60, 9, ["#b08050", "#d8b88a"], 2, 4);
    specks(c, 810, y0 + 130, 140, 8, 14, 11, ["#2f1d12"], 6, 10);
  });
  arrow(c, [[440, 590], [540, 560], [620, 590]], RED, 14);
};
// 3 e2: water on packed soil vs soil with tunnels
const e2 = (c: Ctx) => {
  ground(c);
  const HOLES = [[-100, -8], [-40, -22], [30, -20], [90, -4], [-70, 14], [10, 16], [75, 18]];
  cup(c, 290, 560, 190, 80, 260);
  HOLES.forEach(([dx, dy]) => hole(c, 290 + dx * 1.05, 568 + dy, 14, 7));
  cup(c, 790, 560, 190, 80, 260);
  shape(c, () => ell(c, 790, 570, 150, 56), COL.water, 3); shape(c, () => ell(c, 760, 560, 50, 12), COL.drop, 0);
  [[200, 300], [290, 220], [390, 310]].forEach(([x, y]) => drop(c, x, y, 22));
  [[700, 300], [790, 220], [890, 310]].forEach(([x, y]) => drop(c, x, y, 22));
  arrow(c, [[290, 340], [290, 450]], RED, 12); arrow(c, [[790, 340], [790, 450]], RED, 12);
};
// 4 e3: chalk shaken in a dry box and a wet box
const chalk = (c: Ctx, x: number, y: number, r: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const h = r * 0.95, body = () => rrect(c, -r, -h / 2, r * 2, h, h * 0.4);
  shape(c, body, "#fffdf5", 5); sh(c, body, "#cfc8b6", r * 0.1, 0.75); c.restore();
};
const tiffin = (c: Ctx, x: number, y: number, rx: number, ry: number, h: number) => {
  shadow(c, x + rx * 0.12, y + h + ry * 0.55, rx * 1.02, ry * 0.6);
  const body = () => { c.moveTo(x - rx, y); c.lineTo(x - rx, y + h); c.ellipse(x, y + h, rx, ry, 0, Math.PI, 0, true); c.lineTo(x + rx, y); c.closePath(); };
  shape(c, body, COL.steel); sh(c, body, COL.steelDk, rx * 0.5, 0.7);
  shine(c, [[x - rx * 0.8, y + h * 0.2], [x - rx * 0.8, y + h * 0.75]], 10);
  shape(c, () => ell(c, x, y, rx, ry), COL.steel, 6);
  shape(c, () => ell(c, x, y + 4, rx * 0.93, ry * 0.88), COL.steelDk, 4);
};
const e3 = (c: Ctx) => {
  ground(c);
  tiffin(c, 280, 560, 200, 70, 300); shape(c, () => ell(c, 280, 570, 180, 58), COL.steelIn, 3);
  chalk(c, 250, 560, 36, 0.4); chalk(c, 320, 575, 28, -0.5); specks(c, 280, 575, 120, 30, 30, 4, ["#fffdf5", "#cfc8b6"], 3, 6);
  tiffin(c, 800, 560, 200, 70, 300); shape(c, () => ell(c, 800, 570, 180, 58), COL.water, 3);
  chalk(c, 770, 560, 36, 0.4); chalk(c, 840, 575, 28, -0.5); specks(c, 800, 575, 110, 28, 25, 6, ["#fffdf5", "#e9f3ff"], 3, 6);
  [[280, 260], [800, 260]].forEach(([x]) => { arrow(c, [[x - 120, 280], [x + 120, 280]], RED, 14); arrow(c, [[x + 120, 280], [x - 120, 280]], RED, 14); });
};
// 5 a1: look, feel and smell: soil on white paper under a lens
const a1 = (c: Ctx) => {
  ground(c);
  shadow(c, 520, 900, 440, 40);
  shape(c, () => polyP(c, [[130, 830], [330, 560], [930, 560], [900, 830]]), WHITE);
  const heap = () => { c.moveTo(280, 790); c.bezierCurveTo(300, 620, 700, 620, 720, 790); c.closePath(); };
  shape(c, heap, COL.soil); sh(c, heap, COL.soilDk, 60, 0.7);
  c.save(); c.beginPath(); heap(); c.clip(); specks(c, 500, 740, 210, 50, 60, 5, SOILS, 4, 8); c.restore();
  line(c, [[780, 780], [880, 650]], 7, "#d9a560"); line(c, [[780, 780], [790, 767]], 8, INK);
  drop(c, 830, 790, 14);
  lens(c, 600, 380, 200, "#6a4128", () => { grains(c, 380, 190, 820, 580, 40, 9, ["#c9a679", "#a87a56", "#8a5a3c", "#3a2414"], 16, 34, 4); });
};
// 6 a2: worm window bottle with layers and a worm
const a2 = (c: Ctx) => {
  ground(c);
  const x0 = 350, x1 = 730, y0 = 200, y1 = 940, body = () => rrect(c, x0, y0, x1 - x0, y1 - y0, 50);
  shadow(c, 560, y1 + 6, 240, 22);
  shape(c, body, "rgba(255,255,255,0.5)", 0);
  c.save(); c.beginPath(); body(); c.clip();
  [["#6a4128", 410], ["#e8cf9a", 570], ["#6a4128", 730], ["#e8cf9a", 960]].forEach(([col, bot], i, a) => { c.fillStyle = col as string; c.fillRect(x0, i ? (a[i - 1][1] as number) : 340, x1 - x0, (bot as number) - (i ? (a[i - 1][1] as number) : 340)); });
  specks(c, 540, 560, 170, 60, 50, 3, ["#c9a679", "#b08050"], 3, 6);
  specks(c, 540, 870, 170, 60, 50, 5, ["#c9a679", "#b08050"], 3, 6);
  specks(c, 540, 390, 160, 40, 40, 9, ["#8a5a3c", "#3a2414"], 3, 6);
  line(c, [[480, 400], [470, 480], [510, 540], [490, 620], [450, 680]], 22, "#3a2414");
  line(c, [[620, 420], [640, 500], [600, 580], [620, 640], [660, 720]], 22, "#6a4128");
  c.restore();
  leaf(c, 440, 340, 120, -0.2, "#b8863c"); leaf(c, 560, 342, 130, -2.9, "#9a6a2a"); shape(c, () => ell(c, 640, 330, 30, 18, 0.2), COL.orange, 5);
  shape(c, body, "rgba(214,236,250,0.15)", 7);
  shine(c, [[x0 + 28, y0 + 90], [x0 + 28, y1 - 90]], 10);
  const pts: number[][] = []; for (let i = 0; i < 14; i++) pts.push([440 + i * 9, 450 + i * 6 + Math.sin(i) * 8]);
  worm(c, pts, 28);
  arrow(c, [[800, 380], [800, 560]], RED, 14);
};
// 7 a3: three soils, each with the crop that grows in it
const a3 = (c: Ctx) => {
  ground(c);
  const heap = (x: number, col: string, dk: string, cols: string[], n: number) => {
    const p = () => { c.moveTo(x - 150, 900); c.bezierCurveTo(x - 120, 640, x + 120, 640, x + 150, 900); c.closePath(); };
    shadow(c, x + 15, 905, 160, 16); shape(c, p, col); sh(c, p, dk, 50, 0.7);
    c.save(); c.beginPath(); p(); c.clip(); specks(c, x, 830, 120, 50, n, x, cols, 3, 6); c.restore();
  };
  heap(190, "#3d3a42", "#26242a", ["#5a5760", "#26242a"], 50);
  heap(540, "#c85a3a", "#9a3f26", ["#e07a58", "#9a3f26"], 50);
  heap(890, "#e9c872", "#c9a54f", ["#f5e0a0", "#b08050"], 50);
  // cotton boll on the black soil
  [[165, 400, 54], [225, 380, 48], [195, 340, 50]].forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r * 0.9), WHITE, 5));
  shape(c, () => polyP(c, [[130, 460], [190, 410], [250, 460], [190, 500]]), "#6a4128", 5);
  thick(c, [[190, 500], [190, 640]], 10, COL.green);
  // groundnut on the red soil: a leafy plant and two pods on the heap
  thick(c, [[540, 700], [540, 470]], 10, COL.green);
  [[560, -0.5], [510, -2.6], [440, -0.4], [390, -2.7]].forEach(([y, an]) => leaf(c, 540, y, 80, an));
  const pod = (x: number, y: number, r: number) => { c.save(); c.translate(x, y); c.rotate(r);
    shape(c, () => { ell(c, -26, 0, 36, 24); ell(c, 26, 0, 36, 24); }, "#d9a560", 5);
    [[-30, -8], [-20, 6], [26, -6], [34, 8]].forEach(([dx, dy]) => line(c, [[dx - 4, dy], [dx + 4, dy]], 3, "#a8723f")); c.restore(); };
  pod(450, 820, -0.3); pod(640, 800, 0.3);
  // rice on the plain soil
  thick(c, [[890, 340], [890, 640]], 9, COL.greenDk);
  [0, 1, 2, 3, 4, 5].forEach((i) => { shape(c, () => ell(c, 872 + (i % 2) * 36, 300 + i * 30, 12, 20, i % 2 ? 0.5 : -0.5), COL.yellow, 4); });
  leaf(c, 890, 600, 120, -0.9); leaf(c, 890, 560, 120, -2.3);
};
// 8 a4: a worn step and a stone grinder
const a4 = (c: Ctx) => {
  ground(c);
  const steps = () => polyP(c, [[470, 520], [1030, 520], [1030, 940], [250, 940], [250, 800], [470, 800]]);
  shadow(c, 650, 950, 400, 22);
  shape(c, steps, "#aaa59d", 7); sh(c, steps, "#7d7870", 100, 0.6);
  line(c, [[470, 800], [1030, 800]], 6); line(c, [[470, 520], [470, 800]], 6);
  shape(c, () => ell(c, 750, 530, 160, 20), "#6f6a63", 4);
  shape(c, () => ell(c, 360, 805, 90, 14), "#6f6a63", 4);
  grains(c, 680, 548, 820, 600, 8, 3, ["#c9bfae"], 3, 5, 2);
  arrow(c, [[750, 640], [750, 700]], RED, 10);
  const bowl = () => { c.moveTo(80, 600); c.lineTo(80, 700); c.quadraticCurveTo(160, 780, 240, 700); c.lineTo(240, 600); c.closePath(); };
  shape(c, bowl, "#8d8a92"); sh(c, bowl, "#5e5a62", 40, 0.7);
  shape(c, () => ell(c, 160, 600, 80, 24), "#bdb9c0", 6); shape(c, () => ell(c, 160, 604, 52, 14), "#3f3b44", 3);
  shape(c, () => rrect(c, 130, 530, 100, 50, 22), "#8d8a92", 5);
  lens(c, 700, 250, 120, "#d8d2c6", () => { grains(c, 100, 100, 550, 420, 30, 4, ["#aaa59d", "#8d8a92", "#c9bfae"], 12, 22, 3); });
};
// 9 a5: pouring a mug of water onto a pot
const a5 = (c: Ctx) => {
  ground(c);
  pot(c, 400, 900, 380, 280, "#6a4128");
  specks(c, 400, 595, 150, 8, 14, 2, ["#3a2414"], 3, 6);
  shape(c, () => ell(c, 400, 596, 100, 8), COL.water, 0);
  thick(c, [[400, 590], [400, 400]], 12, COL.green); leaf(c, 400, 480, 110, -0.7); leaf(c, 400, 470, 110, -2.4); leaf(c, 400, 400, 90, -1.2);
  const mug = () => rrect(c, 640, 240, 180, 190, 22);
  c.save(); c.translate(750, 330); c.rotate(0.55); c.translate(-750, -330);
  shape(c, mug, COL.teal); sh(c, mug, COL.tealDk, 40, 0.8);
  shape(c, () => ell(c, 730, 240, 90, 18), "#6fd0c7", 5);
  c.restore();
  hand(c, 960, 330, Math.PI * 1.05, 1.3);
  line(c, [[580, 390], [510, 470], [440, 590]], 14, COL.water);
  line(c, [[580, 390], [510, 470], [440, 590]], 6, COL.drop);
};
// 10 p1: methi in sand and in soil
const p1 = (c: Ctx) => {
  ground(c);
  pot(c, 290, 900, 360, 280, "#e0c48a");
  specks(c, 290, 625, 150, 10, 30, 2, ["#c9a679", "#f0dcae"], 3, 6);
  [[230, 0.5], [300, 0.7], [350, 0.4]].forEach(([x, s]) => { thick(c, [[x, 622], [x, 622 - 70 * s]], 6, "#c9d170"); leaf(c, x, 622 - 70 * s, 40 * s, -2.3, "#b6c75a"); leaf(c, x, 622 - 70 * s, 40 * s, -0.8, "#b6c75a"); });
  pot(c, 790, 900, 360, 280, "#4a2a18");
  specks(c, 790, 625, 150, 10, 30, 3, ["#2f1d12", "#6a4128"], 3, 6);
  [[720, 1.7], [790, 2.2], [860, 1.8]].forEach(([x, s]) => { thick(c, [[x, 622], [x, 622 - 90 * s]], 9, COL.green); leaf(c, x, 622 - 90 * s, 80 * s * 0.8, -2.3); leaf(c, x, 622 - 90 * s, 80 * s * 0.8, -0.8); leaf(c, x, 622 - 55 * s, 60 * s * 0.8, -2.7); leaf(c, x, 622 - 55 * s, 60 * s * 0.8, -0.4); });
};
// 11 c1: soil washing off a slope
const c1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 100, 780, 300, 150, 10), COL.woodDk); shape(c, () => rrect(c, 110, 620, 290, 160, 10), COL.orange);
  const board = () => polyP(c, [[160, 560], [920, 680], [905, 730], [145, 610]]);
  shape(c, board, COL.wood);
  const soilTop = () => polyP(c, [[190, 538], [660, 612], [650, 654], [180, 578]]);
  shape(c, soilTop, COL.soil); c.save(); c.beginPath(); soilTop(); c.clip(); specks(c, 420, 590, 260, 30, 60, 3, SOILS, 3, 7); c.restore();
  // bowl at the low end
  const b = () => { c.moveTo(740, 800); c.bezierCurveTo(760, 960, 1010, 960, 1030, 800); c.closePath(); };
  shape(c, b, COL.steel); sh(c, b, COL.steelDk, 70, 0.7);
  shape(c, () => ell(c, 885, 800, 145, 26), "#a8825a", 5);
  line(c, [[700, 640], [820, 720], [880, 790]], 22, "#a8825a"); line(c, [[820, 690], [880, 740], [900, 790]], 14, "#a8825a");
  specks(c, 820, 710, 90, 30, 14, 2, ["#6a4128"], 3, 6);
  // tumbler pouring at the top
  c.save(); c.translate(250, 250); c.rotate(0.5);
  const tb = () => { c.moveTo(-60, -110); c.lineTo(-48, 100); c.lineTo(48, 100); c.lineTo(60, -110); c.closePath(); };
  shape(c, tb, COL.steel); sh(c, tb, COL.steelDk, 50, 0.7); shape(c, () => ell(c, 0, -110, 60, 14), COL.water, 5);
  c.restore();
  line(c, [[330, 190], [345, 330], [350, 540]], 14, COL.water); line(c, [[330, 190], [345, 330], [350, 540]], 5, COL.drop);
  [[470, 330], [560, 350], [620, 380]].forEach(([x, y]) => drop(c, x, y, 18));
  arrow(c, [[540, 560], [680, 600]], RED, 12);
};
// 12 c2: three mixes, three drains
const c2 = (c: Ctx) => {
  ground(c);
  const mixes: [number, string, number][] = [[200, "#e8cf9a", 0.7], [540, "#6a4128", 0.2], [880, "#4a3220", 0.45]];
  mixes.forEach(([x, soil, fill], i) => {
    glass(c, x, 930, 250, 330, fill, COL.water);
    cup(c, x, 330, 150, 60, 220, soil);
    specks(c, x, 338, 120, 40, 30, 3 + i, i === 0 ? ["#c9a679", "#f0dcae"] : i === 1 ? SOILS : ["#2f1d12", "#6a4128", "#e8cf9a"], 3, 6);
    [x - 26, x + 26].forEach((dx) => drop(c, dx, 640, 11));
    arrow(c, [[x, 440], [x, 590]], RED, 10);
  });
};
// 13 term.0: soil in a garden with a trowel
const t0 = (c: Ctx) => {
  ground(c, SKY);
  slab(c, 70, 640, 1010, [["#6a4128", 960]], () => specks(c, 540, 800, 450, 150, 160, 3, SOILS, 4, 9));
  shape(c, () => rrect(c, 70, 610, 940, 50, 22), COL.greenLt, 6);
  sprout(c, 800, 640, 1.8);
  const heap = () => { c.moveTo(180, 640); c.bezierCurveTo(200, 480, 480, 480, 500, 640); c.closePath(); };
  shape(c, heap, COL.soil); sh(c, heap, COL.soilDk, 60, 0.7);
  c.save(); c.beginPath(); heap(); c.clip(); specks(c, 340, 590, 150, 50, 50, 2, SOILS, 4, 8); c.restore();
  thick(c, [[560, 330], [660, 450]], 30, COL.woodDk);
  shape(c, () => polyP(c, [[640, 440], [740, 520], [690, 600], [560, 540]]), COL.steel, 6);
};
// 14 term.1: a granite boulder
const t1 = (c: Ctx) => { ground(c, SKY); rock(c, 540, 860, 760, 600, 5); };
// 15 term.2: weathering: a cracked rock becomes small pieces
const t2 = (c: Ctx) => {
  ground(c, SKY);
  sun(c, 190, 170, 70);
  rock(c, 300, 860, 400, 380, 5);
  thick(c, [[310, 500], [290, 580], [330, 650], [310, 740]], 8, INK);
  drop(c, 330, 420, 18);
  arrow(c, [[500, 700], [610, 700]], RED, 12);
  [[690, 850, 100], [830, 850, 80], [960, 850, 90], [760, 720, 70], [890, 730, 64]].forEach(([x, y, r], i) => rock(c, x, y + 12, r * 1.5, r * 1.1, i + 2));
  grains(c, 650, 880, 1020, 905, 22, 4, ["#c9bfae", "#9a9aa3"], 4, 8, 2);
};
// 16 term.3: sand
const t3 = (c: Ctx) => {
  ground(c);
  const heap = () => { c.moveTo(80, 900); c.bezierCurveTo(140, 600, 520, 560, 640, 900); c.closePath(); };
  shadow(c, 360, 905, 300, 22);
  shape(c, heap, "#e8cf9a"); sh(c, heap, "#c9a679", 90, 0.7);
  c.save(); c.beginPath(); heap(); c.clip(); specks(c, 360, 800, 250, 100, 120, 3, ["#c9a679", "#f5e5bd", "#b08050"], 3, 6); c.restore();
  lens(c, 720, 380, 250, "#e8cf9a", () => { grains(c, 470, 130, 970, 630, 55, 5, ["#e8cf9a", "#d9bb85", "#c9a679", "#f5e5bd", "#b08050"], 22, 38, 4); });
};
// 17 term.4: silt
const t4 = (c: Ctx) => {
  ground(c);
  const heap = () => { c.moveTo(60, 900); c.bezierCurveTo(120, 680, 440, 640, 640, 900); c.closePath(); };
  shadow(c, 350, 905, 300, 22);
  shape(c, heap, "#cdbfa9"); sh(c, heap, "#a8987f", 90, 0.7);
  line(c, [[200, 840], [300, 780], [420, 800]], 5, "#a8987f");
  lens(c, 720, 380, 250, "#cdbfa9", () => { grains(c, 470, 130, 970, 630, 400, 5, ["#cdbfa9", "#bda98f", "#d8cdb8", "#a8987f"], 6, 10, 2); });
};
// 18 term.5: clay: a lump and a diya
const t5 = (c: Ctx) => {
  ground(c);
  const lump = () => { c.moveTo(120, 850); c.bezierCurveTo(60, 700, 200, 560, 380, 580); c.bezierCurveTo(560, 600, 620, 780, 540, 850); c.closePath(); };
  shadow(c, 340, 860, 270, 24);
  shape(c, lump, "#b5694a"); sh(c, lump, "#8f4c32", 80, 0.7);
  [[240, 700], [330, 720], [400, 690]].forEach(([x, y]) => { shape(c, () => ell(c, x, y, 22, 12, 0.5), "#8f4c32", 4); });
  shine(c, [[170, 700], [220, 630]], 9);
  const dy = () => { c.moveTo(640, 780); c.quadraticCurveTo(700, 900, 800, 900); c.quadraticCurveTo(940, 900, 1000, 780); c.quadraticCurveTo(940, 820, 820, 820); c.quadraticCurveTo(700, 820, 640, 780); c.closePath(); };
  shadow(c, 820, 905, 190, 18);
  shape(c, dy, "#c8673f"); sh(c, dy, "#a24f2d", 60, 0.7);
  shape(c, () => ell(c, 820, 790, 180, 36), "#d6784c", 6); shape(c, () => ell(c, 820, 795, 130, 22), "#6a2e18", 3);
  shape(c, () => ell(c, 760, 780, 24, 16), COL.yellow, 4); thick(c, [[760, 780], [720, 700]], 6, COL.orange);
};
// 19 term.6: humus: dark crumbly soil with leaf bits
const t6 = (c: Ctx) => {
  ground(c);
  const heap = () => { c.moveTo(100, 900); c.bezierCurveTo(130, 540, 950, 540, 980, 900); c.closePath(); };
  shadow(c, 540, 905, 450, 24);
  shape(c, heap, "#3a2414"); sh(c, heap, "#24150b", 100, 0.7);
  c.save(); c.beginPath(); heap(); c.clip();
  grains(c, 150, 640, 930, 890, 70, 3, ["#4a3220", "#2b1a0e", "#5a3822"], 14, 28, 3);
  c.restore();
  const lf = (x: number, y: number, rot: number, s: number) => { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
    shape(c, () => { c.moveTo(-60, 0); c.quadraticCurveTo(0, -40, 60, 0); c.quadraticCurveTo(0, 40, -60, 0); c.closePath(); }, "#8a6a2a", 5);
    line(c, [[-60, 0], [50, 0]], 3, "#5a4318"); [-30, 0, 30].forEach((x2) => { line(c, [[x2, 0], [x2 + 12, -16]], 3, "#5a4318"); line(c, [[x2, 0], [x2 + 12, 16]], 3, "#5a4318"); }); c.restore(); };
  lf(380, 680, -0.4, 1); lf(660, 740, 0.5, 0.8); lf(520, 820, 0.1, 0.6);
};
// 20 term.7: a banana peel decomposing
const t7 = (c: Ctx) => {
  ground(c);
  banana(c, 170, 560, 1.0, COL.yellow, false);
  banana(c, 540, 560, 0.9, "#8a6a2a", true);
  const heap = () => { c.moveTo(770, 700); c.bezierCurveTo(800, 460, 1020, 460, 1050, 700); c.closePath(); };
  shadow(c, 910, 705, 150, 16); shape(c, heap, "#3a2414"); c.save(); c.beginPath(); heap(); c.clip(); specks(c, 910, 640, 120, 50, 40, 3, ["#2b1a0e", "#5a3822"], 4, 8); c.restore();
  arrow(c, [[310, 580], [410, 580]], RED, 14); arrow(c, [[670, 580], [760, 580]], RED, 14);
};
// 21 term.8: nutrients going from the soil into a root
const t8 = (c: Ctx) => {
  ground(c, SKY);
  slab(c, 70, 500, 1010, [["#6a4128", 960]], () => {
    specks(c, 540, 750, 450, 220, 100, 3, SOILS, 4, 9);
    [[330, 700], [750, 640], [330, 840], [740, 850]].forEach(([x, y]) => { shape(c, () => ell(c, x, y, 70, 40), "rgba(143,195,234,0.8)", 3); specks(c, x, y, 50, 22, 6, x, ["#ffd34d"], 6, 9); });
  });
  roots(c, 540, 520, 420, 380);
  sprout(c, 540, 500, 2);
  arrow(c, [[400, 700], [470, 640]], RED, 12); arrow(c, [[680, 650], [610, 600]], RED, 12); arrow(c, [[440, 830], [500, 760]], RED, 12); arrow(c, [[650, 830], [590, 760]], RED, 12);
};
// 22 term.10: a worm in its burrow
const t10 = (c: Ctx) => {
  ground(c, SKY);
  slab(c, 70, 300, 1010, [["#6a4128", 560], ["#8a5a3c", 960]], () => {
    specks(c, 540, 700, 450, 250, 120, 3, SOILS, 4, 9);
    const T = [[250, 300], [250, 480], [380, 560], [500, 620], [640, 700], [800, 760], [880, 860]];
    line(c, T, 80, "#2f1d12"); line(c, T, 62, "#170d07");
  });
  shape(c, () => rrect(c, 70, 270, 940, 50, 22), COL.greenLt, 6);
  const pts: number[][] = []; for (let i = 0; i < 15; i++) pts.push([420 + i * 22, 590 + i * 12 + Math.sin(i * 1.2) * 6]);
  worm(c, pts, 40);
  arrow(c, [[250, 220], [250, 350]], RED, 12);
};
// 23 term.11: worm castings beside a hole
const t11 = (c: Ctx) => {
  ground(c, "#8a5a3c");
  specks(c, 540, 540, 520, 520, 220, 3, SOILS, 4, 10);
  hole(c, 300, 500, 60, 28);
  const heap = (x: number, y: number, s: number) => {
    const p = () => { c.moveTo(x - 90 * s, y); c.bezierCurveTo(x - 80 * s, y - 110 * s, x + 80 * s, y - 110 * s, x + 90 * s, y); c.closePath(); };
    shadow(c, x + 15, y + 6, 90 * s, 14 * s); shape(c, p, "#3a2414"); sh(c, p, "#24150b", 50 * s, 0.7);
    [0.3, 0.55, 0.8].forEach((t) => line(c, [[x - 70 * s * (1 - t), y - 80 * s * t], [x + 70 * s * (1 - t), y - 80 * s * t]], 4, "#5a3822"));
  };
  heap(150, 760, 1.1); heap(470, 880, 1.3); heap(760, 700, 1); heap(800, 900, 0.8);
  const pts: number[][] = []; for (let i = 0; i < 8; i++) pts.push([230 + i * 13, 470 - i * 4 + Math.sin(i) * 6]);
  hole(c, 300, 500, 60, 28); worm(c, [[300, 500], [330, 480], [360, 470], [395, 462], [430, 450]], 28);
};
// 24 term.13: topsoil: the dark top layer, where the roots are
const t13 = (c: Ctx) => {
  ground(c, SKY);
  slab(c, 70, 330, 1010, [["#4a2a18", 580], ["#a87a56", 780], ["#9a9aa3", 960]], () => {
    specks(c, 540, 450, 450, 120, 110, 3, ["#2b1a0e", "#6a4128", "#5a3822"], 4, 9);
    specks(c, 540, 680, 450, 90, 70, 5, ["#c9a679", "#8a5a3c", "#e0c9a0"], 5, 11);
    [[200, 880, 70], [520, 900, 90], [850, 880, 70]].forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r * 0.5), "#b9b4ab", 5));
  });
  shape(c, () => rrect(c, 70, 300, 940, 50, 22), COL.greenLt, 6);
  roots(c, 540, 340, 380, 230); roots(c, 300, 340, 160, 170); roots(c, 780, 340, 160, 170);
  sprout(c, 540, 300, 1.8);
  arrow(c, [[960, 340], [960, 570]], RED, 12); arrow(c, [[960, 570], [960, 340]], RED, 12);
};
// 25 expl.0: what soil is made of, under a lens
const x0 = (c: Ctx) => {
  ground(c);
  const heap = () => { c.moveTo(60, 960); c.bezierCurveTo(90, 800, 360, 780, 400, 960); c.closePath(); };
  shape(c, heap, COL.soil); c.save(); c.beginPath(); heap(); c.clip(); specks(c, 230, 900, 170, 60, 40, 3, SOILS, 4, 8); c.restore();
  lens(c, 600, 430, 330, "#8a5a3c", () => {
    grains(c, 270, 100, 930, 760, 26, 3, ["#c9a679", "#e0c9a0", "#a87a56"], 26, 44, 4);
    grains(c, 270, 100, 930, 760, 16, 5, ["#2b1a0e", "#3a2414"], 18, 32, 4);
    [[480, 330], [700, 280], [560, 560], [760, 560]].forEach(([x, y]) => { shape(c, () => ell(c, x, y, 54, 30), "rgba(143,195,234,0.85)", 3); });
    [[420, 460], [640, 440], [820, 400], [520, 220]].forEach(([x, y]) => { shape(c, () => ell(c, x, y, 26, 26), "rgba(255,255,255,0.9)", 3); });
  }, false);
};
// 26 expl.1: a rock becomes pebbles, sand, then soil
const x1 = (c: Ctx) => {
  ground(c, SKY);
  rock(c, 270, 440, 340, 300, 5);
  [[690, 430, 70], [790, 410, 56], [880, 440, 64], [740, 360, 44]].forEach(([x, y, r], i) => rock(c, x, y, r * 1.6, r * 1.2, i + 3));
  const heap = () => { c.moveTo(640, 940); c.bezierCurveTo(680, 780, 900, 780, 940, 940); c.closePath(); };
  shape(c, heap, "#e8cf9a"); c.save(); c.beginPath(); heap(); c.clip(); specks(c, 790, 900, 140, 40, 60, 3, ["#c9a679", "#f5e5bd", "#b08050"], 3, 6); c.restore();
  slab(c, 70, 790, 470, [["#6a4128", 960]], () => specks(c, 270, 880, 200, 70, 60, 4, SOILS, 4, 8));
  sprout(c, 270, 790, 1.2);
  arrow(c, [[460, 360], [580, 360]], RED, 12); arrow(c, [[790, 520], [790, 640]], RED, 12); arrow(c, [[600, 860], [500, 860]], RED, 12);
};
// 27 expl.2: sand, silt and clay sinking at different speeds
const x2 = (c: Ctx) => {
  ground(c);
  glass(c, 450, 930, 460, 760, 0.92, "#d8c3a0");
  grains(c, 270, 800, 630, 905, 12, 3, ["#e8cf9a", "#c9a679"], 14, 20, 3);
  specks(c, 450, 720, 150, 40, 70, 5, ["#b08050", "#c9a679"], 3, 5);
  specks(c, 450, 520, 150, 150, 120, 7, ["#8a5a3c", "#a87a56"], 1.5, 2.5);
  grains(c, 300, 300, 600, 420, 6, 9, ["#e8cf9a"], 14, 18, 3);
  arrow(c, [[780, 320], [780, 880]], RED, 14);
  arrow(c, [[860, 520], [860, 780]], RED, 14);
  arrow(c, [[940, 640], [940, 700]], RED, 14);
  grains(c, 760, 220, 800, 260, 1, 4, ["#e8cf9a"], 24, 24, 4);
  grains(c, 850, 420, 870, 440, 1, 4, ["#c9a679"], 11, 11, 3);
  grains(c, 935, 560, 945, 570, 1, 4, ["#8a5a3c"], 5, 5, 2);
};
// 28 expl.3: fallen leaf, a woodlouse and a fungus eating it, humus
const x3 = (c: Ctx) => {
  ground(c);
  const lf = (x: number, y: number, rot: number, s: number, col: string) => { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
    shape(c, () => { c.moveTo(-100, 0); c.quadraticCurveTo(0, -80, 100, 0); c.quadraticCurveTo(0, 80, -100, 0); c.closePath(); }, col, 6);
    line(c, [[-100, 0], [90, 0]], 4, "#5a4318"); [-50, 0, 50].forEach((x2) => { line(c, [[x2, 0], [x2 + 20, -30]], 3, "#5a4318"); line(c, [[x2, 0], [x2 + 20, 30]], 3, "#5a4318"); }); c.restore(); };
  lf(190, 380, -0.3, 1.1, "#7aa83f");
  shape(c, () => ell(c, 190, 800, 120, 40), "#6a4128", 5); lf(190, 790, 0.1, 0.9, "#9a6a2a");
  arrow(c, [[190, 500], [190, 640]], RED, 12);
  // a woodlouse: grey oval in plates, seven pairs of legs
  const wx = 560, wy = 440;
  for (let i = 0; i < 7; i++) { const lx = wx - 110 + i * 36; line(c, [[lx, wy - 40], [lx - 6, wy - 66]], 6); line(c, [[lx, wy + 40], [lx - 6, wy + 66]], 6); }
  const body = () => { c.moveTo(wx - 150, wy); c.quadraticCurveTo(wx - 120, wy - 60, wx + 40, wy - 60); c.quadraticCurveTo(wx + 140, wy - 50, wx + 160, wy); c.quadraticCurveTo(wx + 140, wy + 50, wx + 40, wy + 60); c.quadraticCurveTo(wx - 120, wy + 60, wx - 150, wy); c.closePath(); };
  shape(c, body, "#8d8f9a", 6); sh(c, body, "#5e606b", 40, 0.7);
  for (let i = 0; i < 6; i++) line(c, [[wx - 100 + i * 42, wy - 52], [wx - 100 + i * 42, wy + 52]], 4, "#5e606b");
  line(c, [[wx + 150, wy - 14], [wx + 205, wy - 50]], 5); line(c, [[wx + 150, wy + 14], [wx + 205, wy + 50]], 5);
  shape(c, () => ell(c, 770, 860, 20, 20), "#f0dcae", 0);
  // a fungus (mushroom)
  thick(c, [[560, 880], [560, 790]], 36, "#f4efe0");
  shape(c, () => { c.moveTo(470, 790); c.quadraticCurveTo(560, 660, 650, 790); c.closePath(); }, "#d7a073", 6);
  arrow(c, [[320, 800], [430, 800]], RED, 12); arrow(c, [[690, 800], [750, 830]], RED, 12);
  const h = () => { c.moveTo(740, 920); c.bezierCurveTo(780, 760, 1000, 760, 1040, 920); c.closePath(); };
  shape(c, h, "#3a2414"); c.save(); c.beginPath(); h(); c.clip(); specks(c, 890, 870, 120, 40, 50, 3, ["#2b1a0e", "#5a3822"], 4, 8); c.restore();
};
// 29 expl.8: a root bends towards water, away from a stone
const x8 = (c: Ctx) => {
  ground(c, SKY);
  slab(c, 70, 260, 1010, [["#6a4128", 960]], () => {
    specks(c, 540, 600, 450, 330, 160, 3, SOILS, 4, 9);
    shape(c, () => ell(c, 770, 800, 130, 80), "rgba(143,195,234,0.9)", 4); shape(c, () => ell(c, 740, 780, 40, 14), COL.drop, 0);
    rock(c, 250, 760, 240, 190, 5);
  });
  shape(c, () => rrect(c, 70, 230, 940, 50, 22), COL.greenLt, 6);
  sprout(c, 520, 260, 1.6);
  const R = [[520, 270], [510, 380], [540, 470], [600, 560], [680, 640], [740, 720]];
  line(c, R, 20, INK); line(c, R, 11, "#f5ecd9");
  arrow(c, [[640, 590], [725, 690]], RED, 14);
};
export const ic_planetEarthSoilAndCropsL3 = cards("sci.planet-earth.soil-and-crops.L3 cards", [
  intro, summary, e1, e2, e3, a1, a2, a3, a4, a5, p1, c1, c2, t0, t1, t2, t3, t4, t5, t6, t7, t8, t10, t11, t13, x0, x1, x2, x3, x8,
]);
