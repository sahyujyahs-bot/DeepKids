import type { Ctx } from "./core";
import { INK, WHITE, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, hand, write, cards } from "./flatKit";

// sci.waste.compost-and-disposal.L3 set-up cards: cut plastic bottles (jars A to D) with chopped peels,
// torn newspaper, cloth covers, a chopstick and a nose. Same jar, same peels, same child on every card.

const PEEL = [COL.orange, COL.yellow, COL.greenLt, COL.red, "#d9b36a"];
const DRY = ["#e7c98f", "#d9b36a", "#c9a063", "#e2b86b", "#f0d9a0"];
const SLIME = ["#8e9a7d", "#a3a58f", "#7f8a70", "#9b9684", "#6f7a62"];
const PAPER = "#fbf7ee";

// ---------------------------------------------------------------- letters on the jar labels
const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.1, 0.68], [0.5, 0.68]]],
  B: [[[0, 0], [0, 1], [0.4, 1], [0.55, 0.75], [0.4, 0.5], [0, 0.5]], [[0, 0], [0.35, 0], [0.5, 0.25], [0.35, 0.5]]],
  C: [[[0.58, 0.15], [0.3, 0], [0.05, 0.2], [0.05, 0.8], [0.3, 1], [0.58, 0.85]]],
  D: [[[0, 0], [0, 1], [0.35, 1], [0.58, 0.7], [0.58, 0.3], [0.35, 0], [0, 0]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col: string = INK, w = 6) => LET[ch].forEach((st) => line(c, st.map(([u, v]) => [x + u * h, y + v * h]), w, col));
const tag = (c: Ctx, ch: string, x: number, y: number) => { shape(c, () => rrect(c, x - 40, y - 46, 80, 92, 10), WHITE, 5); letter(c, ch, x - 17, y - 28, 56, INK, 8); };

// ---------------------------------------------------------------- peels, paper, jars
const chip = (c: Ctx, x: number, y: number, r: number, rot: number, col: string) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -r, -r * 0.5, r * 2, r, r * 0.45), col, 3.5);
  line(c, [[-r * 0.5, -r * 0.1], [r * 0.4, -r * 0.1]], 2.5, "rgba(43,35,64,0.35)");
  c.restore();
};
const bit = (c: Ctx, x: number, y: number, r: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -r, -r * 0.4, r * 2, r * 0.8, 3), PAPER, 3);
  line(c, [[-r * 0.6, -r * 0.1], [r * 0.6, -r * 0.1]], 2.5, "#9a948a"); line(c, [[-r * 0.6, r * 0.15], [r * 0.3, r * 0.15]], 2.5, "#9a948a");
  c.restore();
};
type Fill = { level: number; seed: number; pal?: string[]; paper?: boolean; soil?: boolean; liquid?: number; threads?: boolean; gloss?: boolean };
const hwAt = (w: number, f: number) => w * 0.43 + w * 0.07 * f;
const jarBody = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const t = w / 2, b = w * 0.43;
  c.moveTo(x - t, y - h); c.lineTo(x + t, y - h); c.lineTo(x + b, y - 12); c.quadraticCurveTo(x + b, y, x + b - 14, y); c.lineTo(x - b + 14, y); c.quadraticCurveTo(x - b, y, x - b, y - 12); c.closePath();
};
const contents = (c: Ctx, x: number, y: number, w: number, h: number, o: Fill) => {
  const ty = y - h * o.level, hw = hwAt(w, o.level), ry = w * 0.07, r = rnd(o.seed), pal = o.pal ?? PEEL;
  c.fillStyle = o.gloss ? "#5c5a45" : "#8a6a45"; c.fillRect(x - w, ty, w * 2, y - ty + 12);
  c.beginPath(); ell(c, x, ty, hw, ry); c.fill();
  for (let yy = ty - ry * 0.7; yy < y; yy += 20) for (let xx = x - hw + 14; xx < x + hw; xx += 30) {
    const px = xx + (r() - 0.5) * 14, py = yy + (r() - 0.5) * 8, rot = (r() - 0.5) * 2.6;
    if (o.paper && r() < 0.3) bit(c, px, py, 20, rot); else chip(c, px, py, 19, rot, pal[Math.floor(r() * pal.length)]);
  }
  if (o.gloss) for (let k = 0; k < 14; k++) { const px = x - hw + 20 + r() * (hw * 2 - 40), py = ty + r() * (y - ty) * 0.8; line(c, [[px, py], [px + 14, py - 3]], 4, "rgba(255,255,255,0.8)"); }
  if (o.liquid) {
    const ly = y - o.liquid * h; c.fillStyle = "rgba(110,62,28,0.88)"; c.fillRect(x - w, ly, w * 2, y - ly + 12);
    line(c, [[x - hw, ly], [x + hw, ly]], 5, "#b07a45"); line(c, [[x - hw * 0.6, ly + 22], [x - hw * 0.2, ly + 22]], 5, "rgba(255,255,255,0.35)");
  }
  if (o.threads) {
    for (let k = 0; k < 30; k++) {
      const px = x - hw + 15 + r() * (hw * 2 - 30), py = ty + 4 + r() * (y - ty) * 0.75, dx = (r() - 0.5) * 56, dy = (r() - 0.5) * 30;
      line(c, [[px, py], [px + dx * 0.5, py + dy * 0.5 + 9], [px + dx, py + dy]], 7, WHITE);
      c.beginPath(); ell(c, px, py, 10, 7); c.fillStyle = WHITE; c.globalAlpha = 0.9; c.fill(); c.globalAlpha = 1;
    }
  }
  if (o.soil) {
    c.fillStyle = COL.soil; c.fillRect(x - w, ty - 12, w * 2, 24);
    c.beginPath(); ell(c, x, ty - 12, hw, ry); c.fillStyle = COL.soil; c.fill();
    for (let k = 0; k < 16; k++) { c.beginPath(); ell(c, x - hw + 12 + r() * (hw * 2 - 24), ty - 12 + (r() - 0.5) * ry, 5, 3.5); c.fillStyle = COL.soilDk; c.fill(); }
    line(c, [[x - hw, ty + 12], [x + hw, ty + 12]], 3, COL.soilDk);
  }
};
// a cut-off clear plastic bottle standing on its bottom centre (x, y); the label sits tagFrac up its height
const jar = (c: Ctx, x: number, y: number, w: number, h: number, fill?: Fill, tagCh?: string, tagFrac = 0.32) => {
  shadow(c, x + w * 0.14, y + 6, w * 0.58, w * 0.1);
  const body = () => jarBody(c, x, y, w, h);
  shape(c, body, "rgba(235,246,252,0.6)", 0);
  if (fill) { c.save(); c.beginPath(); body(); c.clip(); contents(c, x, y, w, h, fill); c.restore(); }
  shade(c, body, COL.glassEdge, -w * 0.16, 0, 0.25);
  shape(c, body, "rgba(214,236,250,0.12)", 6);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.07), "rgba(255,255,255,0.35)", 5);
  shine(c, [[x - w * 0.38, y - h * 0.9], [x - w * 0.34, y - h * 0.4]], 8);
  if (tagCh) tag(c, tagCh, x, y - h * tagFrac);
};
// a square of cloth over the mouth, held by a rubber band
const cloth = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const t = w / 2 + 12, top = y - h, sk = 80, n = 5, seg = (2 * t - 8) / n;
  const skirt = () => { c.moveTo(x - t, top); c.lineTo(x + t, top); c.lineTo(x + t - 4, top + sk); for (let i = 0; i < n; i++) c.quadraticCurveTo(x + t - 4 - (i + 0.5) * seg, top + sk + 18, x + t - 4 - (i + 1) * seg, top + sk); c.closePath(); };
  shape(c, skirt, "#fdf6e3", 6); shade(c, skirt, "#d8cdb2", -w * 0.2, 0, 0.5);
  for (let i = 0; i < 6; i++) { c.beginPath(); ell(c, x - t + 28 + i * ((2 * t - 56) / 5), top + 54 + (i % 2) * 8, 6, 6); c.fillStyle = COL.orange; c.fill(); }
  shape(c, () => ell(c, x, top, t, w * 0.09), "#fdf6e3", 6);
  shape(c, () => { c.moveTo(x - t + 2, top + 24); c.quadraticCurveTo(x, top + 24 + w * 0.1, x + t - 2, top + 24); c.lineTo(x + t - 2, top + 40); c.quadraticCurveTo(x, top + 40 + w * 0.1, x - t + 2, top + 40); c.closePath(); }, "#c8553d", 5);
};

// ---------------------------------------------------------------- places
const balcony = (c: Ctx, sun = false) => {
  c.fillStyle = "#c5c9dc"; c.fillRect(0, 0, 1080, 1080);
  if (sun) {
    shape(c, () => polyP(c, [[800, 0], [1080, 0], [1080, 770], [930, 770]]), "#f6e3a8", 0);
    for (let k = 0; k < 8; k++) { const a = k * 0.785 + 0.2; line(c, [[930 + Math.cos(a) * 92, 160 + Math.sin(a) * 92], [930 + Math.cos(a) * 128, 160 + Math.sin(a) * 128]], 10, COL.orange); }
    shape(c, () => ell(c, 930, 160, 66, 66), COL.yellow, 6);
  }
  shape(c, () => polyP(c, [[0, 770], [1080, 770], [1080, 890], [0, 890]]), "#cfc8bb", 6);
  shape(c, () => polyP(c, [[0, 890], [1080, 890], [1080, 1080], [0, 1080]]), "#b3ac9f", 6);
  line(c, [[270, 890], [270, 1080]], 4, "#8f897d"); line(c, [[640, 890], [640, 1080]], 4, "#8f897d"); line(c, [[900, 890], [900, 1080]], 4, "#8f897d");
};
const table = (c: Ctx) => {
  shape(c, () => polyP(c, [[0, 790], [1080, 790], [1080, 1080], [0, 1080]]), COL.wood, 6);
  line(c, [[0, 900], [1080, 900]], 4, COL.woodDk); line(c, [[0, 1000], [1080, 1000]], 4, COL.woodDk);
};
// a child seen from the side, facing left, sitting behind the table; the table hides the body
const head = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => rrect(c, x - r * 1.6, y + r * 1.35, r * 3.2, r * 3.4, r * 0.6), CLOTH.child);
  shade(c, () => rrect(c, x - r * 1.6, y + r * 1.35, r * 3.2, r * 3.4, r * 0.6), CLOTH.childDk, -r * 0.4, 0);
  shape(c, () => rrect(c, x - r * 0.4, y + r * 0.7, r * 0.8, r * 0.9, r * 0.2), SKIN.child);
  shape(c, () => polyP(c, [[x - r * 0.85, y - r * 0.25], [x - r * 1.65, y + r * 0.42], [x - r * 0.85, y + r * 0.5]]), SKIN.child, 5);
  shape(c, () => ell(c, x, y, r, r * 1.05), SKIN.child);
  shape(c, () => { c.moveTo(x - r * 0.8, y - r * 0.6); c.bezierCurveTo(x - r * 0.6, y - r * 1.5, x + r * 1.1, y - r * 1.4, x + r * 1.0, y + r * 0.3); c.lineTo(x + r * 0.55, y + r * 0.1); c.quadraticCurveTo(x + r * 0.1, y - r * 0.5, x - r * 0.8, y - r * 0.6); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x + r * 0.3, y + r * 0.15, r * 0.14, r * 0.26), SKIN.childDk, 4);
  shape(c, () => ell(c, x - r * 0.5, y - r * 0.08, r * 0.07, r * 0.11), INK, 0);
  line(c, [[x - r * 0.72, y + r * 0.62], [x - r * 0.5, y + r * 0.66]], 4);
};
// the hand gripping something: where the wrist goes so the held thing's far end (reach px along an) lands on (tx, ty)
const grip = (tx: number, ty: number, an: number, reach: number, s: number) => {
  const dx = Math.cos(an), dy = Math.sin(an), gx = tx - reach * dx, gy = ty - reach * dy;
  return { g: [gx, gy], w: [gx - 70 * s * dx, gy - 70 * s * dy] };
};
const arcPts = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 14) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
// a wavy smell line from (a) to (b), bending through control point (m)
const wavy = (c: Ctx, a: number[], m: number[], b: number[], amp: number, col: string, w = 8) => {
  const pts: number[][] = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40, x = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * m[0] + t * t * b[0], y = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * m[1] + t * t * b[1];
    const dx = 2 * (1 - t) * (m[0] - a[0]) + 2 * t * (b[0] - m[0]), dy = 2 * (1 - t) * (m[1] - a[1]) + 2 * t * (b[1] - m[1]), n = Math.hypot(dx, dy), o = Math.sin(t * Math.PI * 6) * amp * Math.sin(t * Math.PI);
    pts.push([x - (dy / n) * o, y + (dx / n) * o]);
  }
  line(c, pts, w, col);
};
// a torn strip of newspaper with ragged ends and two lines of print
const torn = (c: Ctx, x: number, y: number, len: number, wd: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => polyP(c, [[-len, -wd * 0.5], [-len * 0.4, -wd * 0.58], [len * 0.2, -wd * 0.45], [len, -wd * 0.55], [len * 0.9, -wd * 0.1], [len, wd * 0.5], [len * 0.3, wd * 0.58], [-len * 0.3, wd * 0.45], [-len, wd * 0.55], [-len * 0.9, 0]]), PAPER, 5);
  line(c, [[-len * 0.7, -wd * 0.12], [len * 0.6, -wd * 0.12]], 3, "#9a948a"); line(c, [[-len * 0.7, wd * 0.18], [len * 0.2, wd * 0.18]], 3, "#9a948a");
  c.restore();
};
// sniffing scene: head and a big nose on the right, an open hand sweeping the smell up from the jars, smell lines running to the nose
const waft = (c: Ctx, inJars: () => void, onTable?: () => void) => {
  ground(c); head(c, 835, 300, 115); table(c); onTable?.(); inJars();
  wavy(c, [330, 600], [470, 430], [655, 355], 22, "#7f8a70", 9);
  wavy(c, [200, 600], [330, 400], [650, 335], 18, "#7f8a70", 9);
  hand(c, 140, 500, -0.45, 1.6, SKIN.child, CLOTH.child, true);
  arrow(c, [[330, 540], [420, 520], [510, 490], [590, 450]]);
};

// ---------------------------------------------------------------- the cards
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  const nl = (y: number) => 110 - (70 * (y - 620)) / 410, nr = (y: number) => 970 + (70 * (y - 620)) / 410;
  shape(c, () => polyP(c, [[110, 620], [970, 620], [1040, 1030], [40, 1030]]), "#f4efe3", 6);
  for (let y = 700; y < 1010; y += 34) { const a = nl(y) + 30, b = nr(y) - 30, cw = (b - a - 40) / 3; for (let k = 0; k < 3; k++) line(c, [[a + k * (cw + 20), y], [a + k * (cw + 20) + cw * (k === 1 && y === 768 ? 0.5 : 0.95), y]], 4, "#b5aea0"); }
  line(c, [[nl(660) + 30, 660], [nr(660) - 30, 660]], 14, "#4a4458");
  jar(c, 250, 880, 210, 340, undefined, "A", 0.45);
  jar(c, 500, 880, 210, 340, undefined, "B", 0.45);
  bowl(c, 790, 700, 165);
  const r = rnd(5), cx = 790, cy = 700, R = 165;
  shape(c, () => { c.moveTo(cx - R * 0.88, cy + R * 0.095); c.bezierCurveTo(cx - R * 0.8, cy - R * 0.7, cx + R * 0.8, cy - R * 0.7, cx + R * 0.88, cy + R * 0.095); c.quadraticCurveTo(cx, cy + R * 0.3, cx - R * 0.88, cy + R * 0.095); c.closePath(); }, "#8a6a45", 4);
  for (let k = 0; k < 34; k++) { const u = r() * 1.5 - 0.75, hh = R * 0.5 * (1 - u * u / 0.5625); chip(c, cx + u * R, cy + 8 - r() * hh, 16, (r() - 0.5) * 2.6, PEEL[Math.floor(r() * 5)]); }
  shadow(c, 810, 960, 160, 30);
  [[760, 940, 0.2], [840, 935, -0.3], [800, 905, 0.9], [770, 960, -0.8], [850, 965, 0.1], [810, 930, -0.1]].forEach(([x, y, a]) => bit(c, x, y, 56, a));
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  jar(c, 250, 900, 300, 420, { level: 0.65, seed: 3 }, "A");
  jar(c, 700, 900, 300, 420, { level: 0.65, seed: 4, paper: true }, "B");
  [[640, 540, 0.5], [730, 600, -0.4], [690, 670, 1.1], [770, 520, -0.9]].forEach(([x, y, a]) => torn(c, x, y, 46, 26, a));
  const an = 2.3, { g, w } = grip(700, 330, an, 70, 1.8);
  c.save(); c.translate(g[0], g[1]); c.rotate(an);
  [[160, -0.35], [200, 0], [170, 0.35], [140, 0.7]].forEach(([l, a]) => { c.save(); c.rotate(a); torn(c, l * 0.6, 0, l * 0.5, 24, 0); c.restore(); });
  c.restore();
  hand(c, w[0], w[1], an, 1.8);
  arrow(c, [[600, 360], [620, 430], [640, 490]]);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  balcony(c);
  shape(c, () => polyP(c, [[0, 0], [1080, 0], [1080, 150], [0, 150]]), "#8f93ab", 6);
  shape(c, () => polyP(c, [[0, 150], [1080, 150], [1080, 770], [0, 770]]), "rgba(63,67,100,0.16)", 0);
  jar(c, 340, 860, 260, 400, { level: 0.55, seed: 3 }, "A", 0.2);
  jar(c, 700, 860, 260, 400, { level: 0.55, seed: 4, paper: true }, "B", 0.2);
  cloth(c, 340, 860, 260, 400); cloth(c, 700, 860, 260, 400);
};
// setup.e1.3
const e1_3 = (c: Ctx) => waft(c, () => {
  jar(c, 200, 960, 230, 340, { level: 0.5, seed: 8, pal: SLIME, liquid: 0.26, gloss: true }, "A", 0.8);
  jar(c, 470, 960, 230, 340, { level: 0.5, seed: 9, pal: DRY, paper: true, threads: true }, "B", 0.8);
});
// setup.e2.0
const e2_0 = (c: Ctx) => {
  balcony(c);
  jar(c, 270, 860, 240, 380, { level: 0.5, seed: 6, soil: true }, "D", 0.2);
  jar(c, 560, 860, 240, 380, { level: 0.5, seed: 6 }, "C", 0.2);
  const an = 2.4, { g, w } = grip(560, 390, an, 170, 1.7);
  c.save(); c.translate(g[0], g[1]); c.rotate(an);
  shape(c, () => rrect(c, -30, -9, 160, 18, 9), COL.steel, 5);
  shape(c, () => ell(c, 170, 0, 62, 44), COL.steel, 5);
  shape(c, () => ell(c, 168, -6, 50, 30), COL.soil, 4); shade(c, () => ell(c, 168, -6, 50, 30), COL.soilDk, -14, -6, 0.6);
  c.restore();
  const r = rnd(2); for (let k = 0; k < 9; k++) { c.beginPath(); ell(c, 520 + (r() - 0.3) * 40, 440 + k * 24 + r() * 10, 7, 5); c.fillStyle = COL.soil; c.fill(); c.lineWidth = 3; c.strokeStyle = INK; c.stroke(); }
  hand(c, w[0], w[1], an, 1.7);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  balcony(c);
  jar(c, 330, 860, 300, 420, { level: 0.55, seed: 6, soil: true }, "C", 0.2);
  jar(c, 800, 860, 300, 420, { level: 0.55, seed: 6, soil: true }, "D", 0.2);
  const an = 1.75, { g, w } = grip(350, 715, an, 400, 1.8);
  c.save(); c.translate(g[0], g[1]); c.rotate(an);
  line(c, [[-20, 0], [400, 0]], 24, INK); line(c, [[-20, 0], [400, 0]], 14, COL.wood);
  c.restore();
  hand(c, w[0], w[1], an, 1.8);
  arrow(c, arcPts(345, 632, 115, 24, 2.9, 7.0, 18));
};
// setup.e2.2
const e2_2 = (c: Ctx) => waft(c, () => {
  jar(c, 200, 960, 220, 340, { level: 0.5, seed: 6, soil: true }, "C", 0.8);
  jar(c, 450, 960, 220, 340, { level: 0.5, seed: 6, soil: true }, "D", 0.8);
}, () => {
  shadow(c, 835, 1050, 230, 20);
  shape(c, () => rrect(c, 610, 810, 410, 230, 8), WHITE, 5);
  [["C", 850], ["D", 950]].forEach(([ch, y]) => {
    letter(c, ch as string, 632, (y as number) + 8, 38, INK, 7);
    for (let k = 0; k < 6; k++) { const bx = 690 + k * 54; shape(c, () => rrect(c, bx, (y as number), 48, 56, 6), "#fbf7ee", 3.5); write(c, String(k), bx + 14, (y as number) + 12, 32, INK, 5); }
  });
  c.save(); c.translate(980, 1010); c.rotate(-0.12);
  shape(c, () => polyP(c, [[-300, -8], [-250, -8], [-232, 0], [-250, 8], [-300, 8]]), COL.wood, 0);
  line(c, [[-300, 0], [-220, 0]], 22, INK); line(c, [[-300, 0], [-235, 0]], 14, COL.yellow); line(c, [[-235, 0], [-215, 0]], 14, "#f2d9b0"); line(c, [[-220, 0], [-212, 0]], 8, INK);
  c.restore();
});

export const su_wasteCompostAndDisposal = cards("sci.waste.compost-and-disposal.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2]);
