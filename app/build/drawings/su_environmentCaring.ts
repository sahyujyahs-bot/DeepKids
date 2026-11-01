import type { Ctx } from "./core";
import { INK, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, hand, write, seed, leaf, cards } from "./flatKit";

// sci.environment.caring.L3 set-up cards. Light from the upper left, shade on the lower right.
// Same clear box, cotton, moong seeds, steel katori and paper tags on every card of an experiment.

const WETC = "#dbe9f6", WETC_DK = "#b3cde6", DRYC = "#efe3c2", DRYC_DK = "#cdb98b", CLEARW = "rgba(214,236,250,0.2)";
const lump = (c: Ctx, x: number, y: number, r: number, col: string) => { c.beginPath(); ell(c, x, y, r, r * 0.6); c.fillStyle = col; c.globalAlpha = 0.7; c.fill(); c.globalAlpha = 1; };

// an arm reaching in from off the card to a hand at (x, y) pointing at angle an
const arm = (c: Ctx, x: number, y: number, an: number, s: number, sleeve: string) => {
  const bx = x - Math.cos(an) * 600, by = y - Math.sin(an) * 600;
  line(c, [[bx, by], [x - Math.cos(an) * 60 * s, y - Math.sin(an) * 60 * s]], 72 * s + 12, INK);
  line(c, [[bx, by], [x - Math.cos(an) * 60 * s, y - Math.sin(an) * 60 * s]], 72 * s, sleeve);
};
// a steel spoon from (x, y) along angle an; the bowl is at the far end, holding water or white powder
const spoon = (c: Ctx, x: number, y: number, an: number, len: number, rb: number, load: string, heap = false) => {
  const ex = x + Math.cos(an) * len, ey = y + Math.sin(an) * len, bx = ex + Math.cos(an) * rb * 0.85, by = ey + Math.sin(an) * rb * 0.85;
  line(c, [[x, y], [ex, ey]], 20, INK); line(c, [[x, y], [ex, ey]], 11, COL.steel);
  shape(c, () => ell(c, bx, by, rb, rb * 0.68, an), COL.steel, 6);
  shape(c, () => ell(c, bx, by, rb * 0.8, rb * 0.5, an), load, 4);
  if (heap) shape(c, () => ell(c, bx, by - rb * 0.1, rb * 0.62, rb * 0.34, an), "#ffffff", 3);
  return [bx, by];
};
// a hand holding a spoon: arm, spoon, then the hand over the handle
const holdSpoon = (c: Ctx, wx: number, wy: number, an: number, s: number, adult: boolean, len: number, rb: number, load: string, heap = false) => {
  const skin = adult ? SKIN.adult : SKIN.child, sleeve = adult ? CLOTH.adult : CLOTH.child;
  arm(c, wx, wy, an, s, sleeve);
  const b = spoon(c, wx + Math.cos(an) * 50 * s, wy + Math.sin(an) * 50 * s, an, len, rb, load, heap);
  hand(c, wx, wy, an, s, skin, sleeve);
  return b;
};
// a clear plastic box seen from the front and a little above. cx = centre, by = bottom front edge.
// inner() draws what is inside (seedlings, a pour) after the cotton and before the front wall.
type TBox = { cot?: string; cotDk?: string; h?: number; ch?: number; w?: number; inner?: (sy: number) => void; lid?: boolean };
const BD = 90;
const tbox = (c: Ctx, cx: number, by: number, o: TBox = {}) => {
  const w = o.w ?? 400, h = o.h ?? 170, ch = o.ch ?? 70, x0 = cx - w / 2, x1 = cx + w / 2, k = 24, sy = by - ch;
  const cot = o.cot ?? WETC, cotDk = o.cotDk ?? WETC_DK;
  shadow(c, cx + 36, by + 8, w * 0.62, 24);
  shape(c, () => polyP(c, [[x0 + k, by - h - BD], [x1 - k, by - h - BD], [x1 - k, by - BD], [x0 + k, by - BD]]), CLEARW, 4);
  shape(c, () => polyP(c, [[x0, by - h], [x0 + k, by - h - BD], [x0 + k, by - BD], [x0, by]]), "rgba(190,215,235,0.45)", 4);
  shape(c, () => polyP(c, [[x1, by - h], [x1 - k, by - h - BD], [x1 - k, by - BD], [x1, by]]), "rgba(170,200,225,0.5)", 4);
  const surf = [[x0 + 10, sy], [x1 - 10, sy], [x1 - k - 6, sy - BD + 8], [x0 + k + 6, sy - BD + 8]];
  shape(c, () => polyP(c, surf), cot, 4);
  for (let i = 0; i < 7; i++) lump(c, x0 + 60 + i * 46, sy - 14 - (i % 3) * 22, 20, cotDk);
  shape(c, () => polyP(c, [[x0 + 10, sy], [x1 - 10, sy], [x1 - 18, by - 6], [x0 + 18, by - 6]]), cot, 4);
  shade(c, () => polyP(c, [[x0 + 10, sy], [x1 - 10, sy], [x1 - 18, by - 6], [x0 + 18, by - 6]]), cotDk, -26, 0, 0.5);
  o.inner?.(sy);
  shape(c, () => polyP(c, [[x0, by - h], [x1, by - h], [x1 - 14, by], [x0 + 14, by]]), CLEARW, 5);
  shape(c, () => polyP(c, [[x0, by - h], [x1, by - h], [x1 - 1, by - h + 14], [x0 + 1, by - h + 14]]), "rgba(255,255,255,0.55)", 4);
  shine(c, [[x0 + 30, by - h + 36], [x0 + 38, by - 20]], 8);
  if (o.lid) {
    const ly = by - h - 6;
    shape(c, () => polyP(c, [[x0 - 10, ly], [x1 + 10, ly], [x1 - k + 10, ly - BD], [x0 + k - 10, ly - BD]]), "rgba(255,255,255,0.6)", 5);
    shape(c, () => polyP(c, [[x0 - 10, ly], [x1 + 10, ly], [x1 + 10, ly + 22], [x0 - 10, ly + 22]]), "rgba(240,246,252,0.85)", 5);
    shine(c, [[x0 + 10, ly + 11], [x0 + 80, ly + 11]], 6);
  }
  return sy;
};
// 10 swollen moong seeds on the cotton surface (front edge at sy)
const tenSeeds = (c: Ctx, cx: number, sy: number) => {
  for (let i = 0; i < 10; i++) {
    const row = i < 5 ? 0 : 1, j = i % 5;
    seed(c, cx - 140 + j * 70 + (row ? 28 : 0), sy - 62 + row * 34 + (j % 2) * 4, 20, 0.3 + i * 0.7, true);
  }
};
// a seedling: stem along a cubic bezier, two leaves at the tip
const sprout = (c: Ctx, p: number[][], healthy: boolean) => {
  const pts: number[][] = [];
  for (let i = 0; i <= 14; i++) { const t = i / 14, u = 1 - t; pts.push([0, 1].map((d) => u * u * u * p[0][d] + 3 * u * u * t * p[1][d] + 3 * u * t * t * p[2][d] + t * t * t * p[3][d])); }
  line(c, pts, 20, INK); line(c, pts, 11, healthy ? "#d7ee9f" : "#e4e0a0");
  const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]], an = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const col = healthy ? COL.leaf : "#b4b25e";
  leaf(c, b[0], b[1], 44, an - 0.7, col); leaf(c, b[0], b[1], 44, an + 0.7, col);
};
// a drop of water (point up)
const drop = (c: Ctx, x: number, y: number, r: number, col: string = COL.water) => shape(c, () => { c.moveTo(x, y - r * 1.6); c.quadraticCurveTo(x - r * 0.2, y - r * 0.5, x - r, y); c.arc(x, y, r, Math.PI, 0, true); c.quadraticCurveTo(x + r * 0.2, y - r * 0.5, x, y - r * 1.6); c.closePath(); }, col, 3);
// a paper tag with a heap of washing powder (none, a pinch or a spoonful) and its weight
const tag = (c: Ctx, x: number, y: number, txt: string, heap: number) => {
  shadow(c, x + 12, y + 46, 100, 14);
  shape(c, () => rrect(c, x - 100, y - 45, 200, 90, 14), COL.paper, 5);
  if (heap > 0) shape(c, () => { c.moveTo(x - 90, y + 24); c.quadraticCurveTo(x - 62, y + 24 - 80 * heap, x - 34, y + 24); c.closePath(); }, "#ffffff", 4);
  else line(c, [[x - 88, y + 24], [x - 36, y + 24]], 5, COL.grey);
  write(c, txt, x - 14, y - 22, 44, INK, 6);
};
// a steel katori seen from the front and a little above; cy = rim centre. Cotton and 10 seeds inside;
// tails[i] is the white root length of seed i (0 = none)
const KS: number[][] = [[-0.62, -0.2], [-0.3, -0.55], [0.05, -0.35], [0.4, -0.55], [0.68, -0.15], [-0.5, 0.3], [-0.15, 0.1], [0.2, 0.25], [0.55, 0.35], [-0.05, 0.6]];
const katori = (c: Ctx, cx: number, cy: number, r: number, tails: number[]) => {
  const ry = r * 0.4, body = () => { c.moveTo(cx - r, cy); c.bezierCurveTo(cx - r * 0.95, cy + r * 1.05, cx + r * 0.95, cy + r * 1.05, cx + r, cy); c.closePath(); };
  shadow(c, cx + r * 0.14, cy + r * 0.82, r * 0.95, r * 0.15);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, r * 0.4, -r * 0.05);
  shine(c, [[cx - r * 0.7, cy + r * 0.22], [cx - r * 0.45, cy + r * 0.55]], 8);
  shape(c, () => ell(c, cx, cy, r, ry), COL.steelIn, 5);
  shape(c, () => ell(c, cx, cy + 3, r * 0.88, ry * 0.8), WETC, 4);
  KS.forEach(([u, v], i) => {
    const x = cx + u * r * 0.78, y = cy + 3 + v * ry * 0.62, L = tails[i] ?? 0;
    if (L > 0) { const an = 0.5 + i * 0.9, e = [x + Math.cos(an) * L, y + Math.sin(an) * L * 0.6]; line(c, [[x, y], e], 12, INK); line(c, [[x, y], e], 6, "#fffaf0"); }
    seed(c, x, y, r * 0.1, 0.3 + i * 0.7, true);
  });
};
const sky = (c: Ctx) => {
  shape(c, () => rrect(c, 130, 40, 820, 400, 14), COL.sky, 6);
  c.save(); c.beginPath(); rrect(c, 130, 40, 820, 400, 14); c.clip();
  shape(c, () => { ell(c, 300, 150, 70, 34); ell(c, 360, 130, 60, 40); ell(c, 420, 155, 64, 32); }, "#ffffff", 0);
  shape(c, () => { ell(c, 700, 250, 70, 32); ell(c, 760, 232, 56, 38); ell(c, 820, 255, 60, 30); }, "#ffffff", 0);
  c.restore();
  line(c, [[540, 40], [540, 440]], 12, INK); line(c, [[130, 240], [950, 240]], 12, INK);
  shape(c, () => rrect(c, 130, 40, 820, 400, 14), "rgba(0,0,0,0)", 12);
};

// ---------------------------------------------------------------- e1: the closed box test
// setup.e1.0
const e1c0 = (c: Ctx) => {
  ground(c);
  tbox(c, 290, 850, { inner: (sy) => tenSeeds(c, 290, sy) });
  tbox(c, 790, 850, {
    cot: "#f6f2e6", cotDk: "#d9d2bd",
    inner: (s) => {
      shape(c, () => ell(c, 790, s - 36, 120, 34), WETC, 0);
      tenSeeds(c, 790, s);
      shape(c, () => polyP(c, [[777, 400], [793, 400], [797, s - 50], [783, s - 50]]), COL.water, 3);
      [[788, 470], [793, 540], [786, 610]].forEach(([x, y]) => drop(c, x, y, 7, COL.waterDk));
    },
  });
  holdSpoon(c, 380, 200, 0.45, 1.7, false, 250, 60, COL.water);
  arrow(c, [[900, 420], [900, 520]], RED, 10);
};
// setup.e1.1
const e1c1 = (c: Ctx) => {
  ground(c);
  sky(c);
  shape(c, () => polyP(c, [[60, 610], [1020, 610], [1060, 830], [20, 830]]), "#f8d98a", 5);
  shape(c, () => polyP(c, [[20, 830], [1060, 830], [1060, 890], [20, 890]]), COL.wood, 5);
  tbox(c, 790, 800, { inner: (sy) => tenSeeds(c, 790, sy) });
  tbox(c, 290, 800, { lid: true, inner: (sy) => tenSeeds(c, 290, sy) });
  arm(c, 290, 380, Math.PI / 2, 1.9, CLOTH.child);
  hand(c, 290, 380, Math.PI / 2, 1.9, SKIN.child, CLOTH.child, true);
  arrow(c, [[480, 330], [480, 470]], RED, 10);
};
// setup.e1.2
const e1c2 = (c: Ctx) => {
  ground(c);
  const H = 300, W = 450, cx1 = 265, cx2 = 815, by = 810;
  tbox(c, cx1, by, {
    h: H, ch: 60, lid: true, w: W,
    inner: (sy) => {
      [-165, -70, 25, 120].forEach((d, i) => { seed(c, cx1 + d, sy - 38 + (i % 2) * 10, 18, 0.3 + i, true); sprout(c, [[cx1 + d, sy - 38], [cx1 + d, sy - 170], [cx1 + d + 4, sy - 225], [cx1 + d + 50, sy - 232]], true); });
    },
  });
  c.fillStyle = "rgba(255,255,255,0.42)"; c.fillRect(cx1 - 214, by - H + 30, 428, 130);
  [[-190, -245], [-130, -270], [-70, -240], [0, -268], [70, -242], [140, -270], [190, -246], [-170, -200], [-40, -205], [110, -198], [180, -185], [-200, -150], [-110, -135], [60, -150], [195, -130]].forEach(([x, y]) => drop(c, cx1 + x, by + y, 9, COL.drop));
  tbox(c, cx2, by, {
    h: H, ch: 60, cot: DRYC, cotDk: DRYC_DK, w: W,
    inner: (sy) => {
      line(c, [[cx2 - 160, sy - 60], [cx2 - 120, sy - 40]], 3, DRYC_DK); line(c, [[cx2 + 90, sy - 70], [cx2 + 150, sy - 48]], 3, DRYC_DK);
      [-165, -70, 25, 120].forEach((d, i) => { const dir = 1; seed(c, cx2 + d, sy - 38 + (i % 2) * 10, 18, 0.3 + i, true); sprout(c, [[cx2 + d, sy - 38], [cx2 + d, sy - 120], [cx2 + d + dir * 36, sy - 175], [cx2 + d + dir * 62, sy - 90]], false); });
    },
  });
};

// ---------------------------------------------------------------- e2: the drain test
// setup.e2.0
const e2c0 = (c: Ctx) => {
  ground(c);
  const gx = [200, 540, 880], liq = [COL.water, "#c4dcea", "#e3edf2"], gy = 770, gh = 300, fill = 0.72, sfc = gy - gh * fill;
  gx.forEach((x, i) => glass(c, x, gy, 230, gh, fill, liq[i]));
  [-60, -30, 0, 30, 60, -15, 15, 45, -45].forEach((dx, k) => { c.beginPath(); ell(c, 880 + dx, sfc + 2 + (k % 2) * 8, 14, 10); c.fillStyle = "#ffffff"; c.fill(); c.lineWidth = 3; c.strokeStyle = INK; c.stroke(); });
  [-40, 25].forEach((dx) => { c.beginPath(); ell(c, 540 + dx, sfc + 2, 10, 7); c.fillStyle = "#ffffff"; c.fill(); c.lineWidth = 3; c.strokeStyle = INK; c.stroke(); });
  tag(c, 200, 885, "0 g", 0); tag(c, 540, 885, "1 g", 0.55); tag(c, 880, 885, "5 g", 1);
  const [bx, by] = holdSpoon(c, 540, 90, 0.5, 1.7, true, 250, 56, "#ffffff", true);
  [[bx + 16, by + 50], [bx + 26, by + 100], [bx + 10, by + 150]].forEach(([x, y]) => { c.beginPath(); ell(c, x, y, 8, 8); c.fillStyle = "#ffffff"; c.fill(); c.lineWidth = 3; c.strokeStyle = INK; c.stroke(); });
  arrow(c, [[bx + 90, by + 40], [bx + 90, by + 120]], RED, 10);
};
// setup.e2.1
const e2c1 = (c: Ctx) => {
  ground(c);
  [190, 540, 890].forEach((x) => katori(c, x, 440, 158, []));
  tag(c, 190, 750, "0 g", 0); tag(c, 540, 750, "1 g", 0.55); tag(c, 890, 750, "5 g", 1);
};
// setup.e2.2
const e2c2 = (c: Ctx) => {
  ground(c);
  const all = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  katori(c, 190, 190, 135, all.map(() => 58));
  katori(c, 540, 190, 135, all.map((i) => (i < 7 ? 34 : 0)));
  katori(c, 890, 190, 135, all.map((i) => (i < 2 ? 12 : 0)));
  tag(c, 190, 430, "0 g", 0); tag(c, 540, 430, "1 g", 0.55); tag(c, 890, 430, "5 g", 1);
  // the ruler, with the longest root lying along it
  shadow(c, 620, 800, 430, 20);
  shape(c, () => polyP(c, [[190, 660], [1050, 660], [1050, 760], [190, 760]]), COL.wood, 5);
  c.fillStyle = COL.woodDk; c.fillRect(193, 742, 854, 15);
  c.lineCap = "butt";
  for (let mm = 0; mm <= 80; mm++) { const x = 230 + mm * 9, hh = mm % 10 === 0 ? 40 : mm % 5 === 0 ? 28 : 16; line(c, [[x, 660], [x, 660 + hh]], mm % 10 === 0 ? 4 : 2.5); }
  for (let cm = 0; cm <= 8; cm++) write(c, String(cm), 230 + cm * 90 - 10, 706, 32, INK, 5);
  write(c, "cm", 976, 706, 32, INK, 5);
  const root = [[240, 642], [340, 646], [440, 640], [540, 646], [650, 642], [770, 644]];
  line(c, root, 24, INK); line(c, root, 14, "#fffaf0");
  seed(c, 230, 636, 30, 0.3, true);
  line(c, [[770, 620], [770, 684]], 7, RED);
  arm(c, 20, 636, 0, 1.8, CLOTH.child);
  hand(c, 20, 636, 0, 1.8, SKIN.child, CLOTH.child, true);
};

export const su_environmentCaring = cards("sci.environment.caring.L3 set-up", [e1c0, e1c1, e1c2, e2c0, e2c1, e2c2]);
