import type { Ctx } from "./core";
import { COL, INK, BG, WHITE, RED, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, seed, hand, write, rnd, plate, bowl, cards } from "./flatKit";

// sci.what-is-life.edge-of-life.L3 · set-up cards. Same plates, bottles and jars on every card of an experiment.

const WARM = "#f3c98b";
const dropP = (c: Ctx, x: number, y: number, r: number) => { c.moveTo(x, y - r * 1.7); c.quadraticCurveTo(x + r * 0.5, y - r * 0.7, x + r, y + r * 0.2); c.arc(x, y + r * 0.2, r, 0, Math.PI); c.quadraticCurveTo(x - r * 0.5, y - r * 0.7, x, y - r * 1.7); c.closePath(); };
const drop = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => dropP(c, x, y, r), COL.water, Math.max(3, r * 0.2)); line(c, [[x - r * 0.45, y + r * 0.05], [x - r * 0.45, y + r * 0.45]], Math.max(2, r * 0.2), WHITE); };
const thick = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };
const curve = (c: Ctx, pts: number[][], w: number, col: string) => {
  const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
  c.lineCap = "round"; c.lineJoin = "round"; path(); c.strokeStyle = INK; c.lineWidth = w + 8; c.stroke(); path(); c.strokeStyle = col; c.lineWidth = w; c.stroke();
};
const pebble = (c: Ctx, x: number, y: number, r: number, rot: number) => { shape(c, () => ell(c, x, y, r, r * 0.75, rot), COL.grey, 4); shade(c, () => ell(c, x, y, r, r * 0.75, rot), COL.greyDk, r * 0.3, r * 0.25, 0.5); };
// a pad of cotton on a plate; wet = soaked blue-white
const cotton = (c: Ctx, x: number, y: number, rx: number, ry: number, wet: boolean) => {
  const col = wet ? "#c9def2" : COL.cloth;
  for (let k = 0; k < 14; k++) { const a = (k / 14) * Math.PI * 2; shape(c, () => ell(c, x + Math.cos(a) * rx * 0.9, y + Math.sin(a) * ry * 0.9, rx * 0.17, ry * 0.3), col, 4); }
  shape(c, () => ell(c, x, y, rx * 0.92, ry * 0.92), col, 0);
  shade(c, () => ell(c, x, y, rx, ry), wet ? COL.waterDk : COL.greyDk, rx * 0.14, ry * 0.2, 0.3);
};
const wetDrops = (c: Ctx, x: number, y: number, rx: number, ry: number, seedN: number, n = 9) => { const r = rnd(seedN); for (let i = 0; i < n; i++) shape(c, () => ell(c, x - rx * 0.85 + r() * rx * 1.7, y - ry * 0.8 + r() * ry * 1.6, 9, 6), COL.drop, 2.5); };
// a plate with cotton and six seeds or six pebbles
const plateOf = (c: Ctx, x: number, y: number, rx: number, ry: number, wet: boolean, kind: "seed" | "pebble") => {
  plate(c, x, y, rx, ry); cotton(c, x, y - ry * 0.03, rx * 0.8, ry * 0.68, wet);
  if (wet) wetDrops(c, x, y, rx * 0.7, ry * 0.5, x);
  for (let k = 0; k < 6; k++) { const ix = x + ((k % 3) - 1) * rx * 0.42 + (k < 3 ? -8 : 10), iy = y + (k < 3 ? -0.2 : 0.3) * ry * 0.9, r = rx * 0.15; if (kind === "seed") seed(c, ix, iy, r, 0.4 + k * 1.1, wet); else pebble(c, ix, iy, r, k * 0.9); }
};
const tag = (c: Ctx, x: number, y: number, n: string, wet: boolean) => {
  shape(c, () => rrect(c, x - 75, y, 150, 90, 14), WHITE, 5);
  const dx = x - 38, dy = y + 50; shape(c, () => dropP(c, dx, dy, 18), COL.water, 3.5);
  if (!wet) line(c, [[dx - 30, dy + 28], [dx + 30, dy - 36]], 8, RED);
  write(c, n, x + 12, y + 20, 50, INK, 7);
};

// setup.e1.0
const su1 = (c: Ctx) => {
  ground(c);
  plateOf(c, 190, 450, 155, 110, true, "seed"); plateOf(c, 540, 450, 155, 110, true, "pebble"); plateOf(c, 890, 450, 155, 110, false, "seed");
  tag(c, 190, 650, "1", true); tag(c, 540, 650, "2", true); tag(c, 890, 650, "3", false);
};

// setup.e1.1
const su2 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 830, 420, 150); cotton(c, 540, 822, 340, 104, true); wetDrops(c, 540, 822, 300, 70, 5, 12);
  [[-190, 0, 0.3], [-100, 22, 2.4], [-10, -8, 1.2], [90, 18, 0.1], [180, -4, 2.0], [250, 20, 0.8]].forEach(([dx, dy, r]) => seed(c, 540 + dx, 822 + dy, 28, r, true));
  // the spoon, held by the handle, tipping water out
  const sp = 0.2;
  thick(c, [[250, 322], [660, 400]], 20, COL.steel);
  shape(c, () => ell(c, 710, 408, 92, 58, sp), COL.steel, 6);
  shape(c, () => ell(c, 712, 410, 68, 38, sp), COL.water, 4);
  hand(c, 150, 295, sp, 1.75);
  [[782, 460], [786, 540], [782, 620]].forEach(([x, y], i) => drop(c, x, y, 18 - i * 1.5));
  arrow(c, [[880, 450], [880, 640]]);
};

// setup.e1.2
const su3 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 450, 480, 270); cotton(c, 540, 440, 400, 215, true); wetDrops(c, 540, 440, 340, 170, 8, 12);
  // shorter roots on the upper seeds
  const R: [number, number, number[][]][] = [
    [350, 310, [[330, 350], [300, 395], [320, 430]]], [560, 290, [[600, 330], [640, 360], [630, 410]]],
    [760, 330, [[790, 370], [830, 380], [850, 340]]], [450, 370, [[470, 410], [520, 420]]],
  ];
  R.forEach(([x, y, p]) => curve(c, [[x, y], ...p], 13, WHITE));
  R.forEach(([x, y], i) => seed(c, x, y, 32, 0.5 + i * 0.9, true));
  // the ruler lies beside the longest root
  shadow(c, 560, 600, 400, 22);
  shape(c, () => polyP(c, [[130, 505], [950, 505], [950, 595], [130, 595]]), COL.wood, 6);
  c.fillStyle = COL.woodDk; c.fillRect(133, 575, 814, 17);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let mm = 0; mm <= 70; mm++) { const x = 200 + mm * 10, h = mm % 10 === 0 ? 38 : mm % 5 === 0 ? 27 : 15; c.lineWidth = mm % 10 === 0 ? 4 : 2.5; c.beginPath(); c.moveTo(x, 508); c.lineTo(x, 508 + h); c.stroke(); }
  for (let cm = 0; cm <= 7; cm++) write(c, String(cm), 200 + cm * 100 - 10, 548, 30, INK, 5);
  curve(c, [[200, 470], [300, 478], [400, 484], [500, 486], [600, 480]], 15, WHITE);
  seed(c, 192, 468, 36, 0.2, true);
  line(c, [[600, 492], [600, 506]], 7, RED);
};

// ---- bottles for the yeast experiment
const BW = 85;
type Bt = { lv?: number; foam?: boolean; yeast?: boolean; sugar?: boolean; ice?: boolean; label?: number };
const bottlePath = (c: Ctx, x: number, yb: number) => {
  c.moveTo(x - BW + 16, yb); c.lineTo(x + BW - 16, yb); c.quadraticCurveTo(x + BW, yb, x + BW, yb - 16); c.lineTo(x + BW, yb - 290);
  c.bezierCurveTo(x + BW, yb - 340, x + 30, yb - 340, x + 30, yb - 390); c.lineTo(x + 30, yb - 440); c.lineTo(x - 30, yb - 440); c.lineTo(x - 30, yb - 390);
  c.bezierCurveTo(x - 30, yb - 340, x - BW, yb - 340, x - BW, yb - 290); c.lineTo(x - BW, yb - 16); c.quadraticCurveTo(x - BW, yb, x - BW + 16, yb); c.closePath();
};
const bottle = (c: Ctx, x: number, yb: number, o: Bt = {}) => {
  shadow(c, x + 22, yb + 8, BW * 0.95, 17);
  shape(c, () => bottlePath(c, x, yb), "rgba(214,236,250,0.4)", 0);
  c.save(); c.beginPath(); bottlePath(c, x, yb); c.clip();
  if (o.lv) {
    c.fillStyle = COL.water; c.fillRect(x - BW, yb - o.lv, BW * 2, o.lv);
    c.fillStyle = COL.waterDk; c.globalAlpha = 0.45; c.fillRect(x + BW * 0.45, yb - o.lv, BW, o.lv); c.globalAlpha = 1;
    line(c, [[x - BW, yb - o.lv], [x + BW, yb - o.lv]], 5, COL.drop);
  }
  if (o.yeast) { shape(c, () => rrect(c, x - BW, yb - 34, BW * 2, 40, 10), "#d8b077", 3); const r = rnd(4); for (let i = 0; i < 16; i++) shape(c, () => ell(c, x - BW + 14 + r() * (BW * 2 - 28), yb - 28 + r() * 22, 4, 3), "#b98d52", 0); }
  if (o.sugar) { shape(c, () => { c.moveTo(x - BW, yb); c.quadraticCurveTo(x, yb - 120, x + BW, yb); c.closePath(); }, WHITE, 4); const r = rnd(9); for (let i = 0; i < 14; i++) shape(c, () => ell(c, x - 55 + r() * 110, yb - 8 - r() * 28, 4, 3), "#dfe5ec", 0); }
  if (o.ice) [[-30, -34, 0.3], [34, -20, -0.4]].forEach(([dx, dy, r]) => { c.save(); c.translate(x + dx, yb - (o.lv ?? 0) + 45 + dy); c.rotate(r); shape(c, () => rrect(c, -26, -26, 52, 52, 8), "#f2fbff", 5); shine(c, [[-14, -12], [-14, 6]], 6); c.restore(); });
  if (o.foam) { const r = rnd(3); for (let i = 0; i < 12; i++) shape(c, () => ell(c, x - 70 + i * 13 + r() * 6, yb - (o.lv ?? 0) + 4 + r() * 10, 17, 14), "#f6fbff", 3.5); for (let i = 0; i < 8; i++) shape(c, () => ell(c, x - 55 + r() * 110, yb - (o.lv ?? 0) + 50 + r() * 80, 7, 7), "rgba(255,255,255,0.8)", 2.5); }
  c.restore();
  shape(c, () => bottlePath(c, x, yb), "rgba(0,0,0,0)", 6);
  shine(c, [[x - BW * 0.7, yb - 270], [x - BW * 0.7, yb - 60]], 7);
  shape(c, () => ell(c, x, yb - 440, 36, 9), "rgba(255,255,255,0.5)", 5);
  if (o.label) { shape(c, () => rrect(c, x - BW + 6, yb - 250, BW * 2 - 12, 92, 8), WHITE, 4); write(c, String(o.label), x - 16, yb - 232, 56, INK, 7); }
};
const steam = (c: Ctx, x: number, y: number) => [0, 34].forEach((dx, i) => { const p = [[x + dx, y], [x + dx + 14, y - 30], [x + dx - 8, y - 60], [x + dx + 10, y - 92]]; curve(c, p, 7, i ? "#ffffff" : "#f4f7fb"); });
const tumbler = (c: Ctx, x: number, y: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const body = () => { c.moveTo(-55, -85); c.lineTo(55, -85); c.lineTo(46, 85); c.lineTo(-46, 85); c.closePath(); };
  shape(c, body, COL.steel, 6); shade(c, body, COL.steelDk, 24, 0, 0.55);
  shape(c, () => ell(c, 0, -85, 55, 15), COL.steelIn, 5); shape(c, () => ell(c, 0, -80, 44, 9), COL.water, 0);
  c.restore();
};
const cone = (c: Ctx, tx: number, ty: number, an: number) => {
  const dx = Math.cos(an), dy = Math.sin(an), nx = -dy, ny = dx, bx = tx - dx * 130, by = ty - dy * 130;
  shape(c, () => polyP(c, [[bx + nx * 55, by + ny * 55], [bx - nx * 55, by - ny * 55], [tx, ty]]), COL.paper, 5);
  line(c, [[bx + nx * 55, by + ny * 55], [bx - nx * 55, by - ny * 55]], 6);
};

// setup.e2.0
const su4 = (c: Ctx) => {
  ground(c);
  [200, 530, 860].forEach((x, i) => bottle(c, x, 930, { label: i + 1, sugar: i !== 1 }));
  thick(c, [[245, 268], [500, 355]], 18, COL.steel);
  const sp = 0.35;
  shape(c, () => ell(c, 545, 372, 82, 50, sp), COL.steel, 6);
  shape(c, () => { c.moveTo(480, 370); c.quadraticCurveTo(545, 308, 615, 372); c.closePath(); }, WHITE, 4);
  hand(c, 130, 235, sp, 1.6);
  const r = rnd(2); [[586, 420], [578, 450], [586, 478], [574, 440], [592, 462]].forEach(([x, y]) => shape(c, () => rrect(c, x + (r() - 0.5) * 6, y, 9, 9, 2), WHITE, 3));
  arrow(c, [[680, 400], [680, 490]]);
};

// setup.e2.1
const su5 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(540 * 0.18, 930 * 0.18); c.scale(0.82, 0.82);
  bottle(c, 200, 930, { label: 1, lv: 190 }); bottle(c, 530, 930, { label: 2, lv: 190, yeast: true, ice: true }); bottle(c, 860, 930, { label: 3, lv: 110 });
  steam(c, 250, 470); steam(c, 790, 470);
  // grown-up pours warm water from a steel tumbler into bottle 3
  tumbler(c, 930, 330, -2.09);
  curve(c, [[850, 390], [853, 440], [858, 492]], 14, COL.water);
  hand(c, 997, 280, 2.5, 1.2, SKIN.adult, CLOTH.adult);
  // child tips yeast from a paper cone into bottle 1
  const r = rnd(6); [[200, 440], [208, 462], [196, 482]].forEach(([x, y]) => shape(c, () => ell(c, x + (r() - 0.5) * 6, y, 6, 5), "#d8b077", 2.5));
  cone(c, 200, 420, 0.9);
  hand(c, 70, 270, 0.9, 1.35);
  c.restore();
};

// balloon on a bottle neck: full = standing and half full, else limp
const balloon = (c: Ctx, x: number, yb: number, full: boolean) => {
  const ty = yb - 440;
  if (full) {
    const p = () => { c.moveTo(x - 30, ty); c.bezierCurveTo(x - 130, ty - 70, x - 100, ty - 250, x, ty - 255); c.bezierCurveTo(x + 100, ty - 250, x + 130, ty - 70, x + 30, ty); c.closePath(); };
    shape(c, p, COL.pink, 6); shade(c, p, COL.red, 30, 0, 0.35); shine(c, [[x - 66, ty - 100], [x - 55, ty - 190]], 9);
  } else {
    const p = () => { c.moveTo(x - 30, ty); c.quadraticCurveTo(x - 36, ty - 70, x + 25, ty - 85); c.quadraticCurveTo(x + 115, ty - 95, x + 115, ty - 20); c.quadraticCurveTo(x + 108, ty + 40, x + 80, ty + 10); c.quadraticCurveTo(x + 55, ty - 30, x + 30, ty - 12); c.lineTo(x + 30, ty); c.closePath(); };
    shape(c, p, COL.pink, 6); shade(c, p, COL.red, 20, 8, 0.35);
  }
  shape(c, () => rrect(c, x - 36, ty - 14, 72, 24, 8), COL.red, 5);
};

// setup.e2.2
const su6 = (c: Ctx) => {
  ground(c);
  bottle(c, 200, 930, { label: 1, lv: 190, yeast: true, foam: true }); bottle(c, 530, 930, { label: 2, lv: 190, yeast: true }); bottle(c, 860, 930, { label: 3, lv: 190 });
  balloon(c, 200, 930, true); balloon(c, 530, 930, false); balloon(c, 860, 930, false);
};

// ---- jars for the salt experiment
const jar = (c: Ctx, x: number, yb: number, w: number, h: number, lv: number, inner?: () => void) => {
  const L = x - w / 2, R = x + w / 2, T = yb - h;
  const p = () => { c.moveTo(L, T); c.lineTo(L, yb - 30); c.quadraticCurveTo(L, yb, L + 30, yb); c.lineTo(R - 30, yb); c.quadraticCurveTo(R, yb, R, yb - 30); c.lineTo(R, T); c.closePath(); };
  shadow(c, x + w * 0.1, yb + 8, w * 0.56, w * 0.07);
  shape(c, p, "rgba(214,236,250,0.4)", 0);
  c.save(); c.beginPath(); p(); c.clip();
  c.fillStyle = COL.water; c.fillRect(L, yb - lv, w, lv); c.fillStyle = COL.waterDk; c.globalAlpha = 0.4; c.fillRect(R - w * 0.22, yb - lv, w * 0.22, lv); c.globalAlpha = 1;
  shape(c, () => ell(c, x, yb - lv, w / 2, w * 0.06), COL.drop, 3);
  inner?.();
  c.restore();
  shape(c, p, "rgba(0,0,0,0)", 6);
  shine(c, [[L + 30, T + 60], [L + 30, yb - 70]], 8);
  shape(c, () => ell(c, x, T, w / 2, w * 0.07), "rgba(255,255,255,0.4)", 6);
};
const saltHeap = (c: Ctx, x: number, y: number, w: number, hgt: number, seedN: number) => {
  shape(c, () => { c.moveTo(x - w, y); c.quadraticCurveTo(x, y - hgt * 1.9, x + w, y); c.closePath(); }, WHITE, 4);
  const r = rnd(seedN); for (let i = 0; i < 14; i++) shape(c, () => ell(c, x - w * 0.7 + r() * w * 1.4, y - 6 - r() * hgt * 0.5, 4.5, 3.5), COL.steelIn, 0);
};

// setup.e3.0
const su7 = (c: Ctx) => {
  ground(c);
  bowl(c, 170, 800, 110); saltHeap(c, 170, 800, 95, 60, 4); shape(c, () => { c.ellipse(170, 800, 110, 22, 0, 0, Math.PI); c.closePath(); }, COL.steelIn, 5);
  const sx = 520;
  jar(c, 560, 900, 400, 500, 390, () => {
    saltHeap(c, 540, 905, 150, 60, 7);
    thick(c, [[sx, 805], [715, 295]], 18, COL.steel);
    shape(c, () => ell(c, sx - 14, 815, 48, 30, -0.5), COL.steel, 5);
  });
  thick(c, [[675, 402], [715, 295]], 18, COL.steel);
  hand(c, 760, 195, 2.0, 1.5);
  const ring: number[][] = []; for (let a = 3.5; a <= 8.2; a += 0.2) ring.push([560 + Math.cos(a) * 140, 458 + Math.sin(a) * 26]);
  arrow(c, ring, RED, 9);
};

// ---- pencil across a jar with a thread
const pencil = (c: Ctx, x: number, y: number, len: number) => {
  const L = x - len / 2, R = x + len / 2, h = 17;
  shape(c, () => rrect(c, L + 55, y - h, len - 110, h * 2, 4), COL.yellow, 5); shade(c, () => rrect(c, L + 55, y - h, len - 110, h * 2, 4), COL.orange, 0, 12, 0.55);
  shape(c, () => polyP(c, [[L + 56, y - h], [L, y], [L + 56, y + h]]), "#f2d3a0", 5); shape(c, () => polyP(c, [[L + 18, y - 5], [L, y], [L + 18, y + 5]]), INK, 2);
  shape(c, () => rrect(c, R - 80, y - h, 30, h * 2, 3), COL.steel, 5); shape(c, () => rrect(c, R - 52, y - h, 52, h * 2, 12), COL.pink, 5);
};
const hangThread = (c: Ctx, x: number, ty: number, bottom: number) => { thick(c, [[x, ty], [x - 4, (ty + bottom) / 2], [x + 3, bottom]], 9, COL.paper); };

// setup.e3.1
const su8 = (c: Ctx) => {
  ground(c);
  [[290, true], [790, false]].forEach(([x, salty]) => {
    const xx = x as number, T = 900 - 460;
    jar(c, xx, 900, 330, 460, 370, salty ? () => saltHeap(c, xx, 905, 120, 48, 11) : undefined);
    hangThread(c, xx, T - 12, 900 - 130);
    pencil(c, xx, T - 17, 480);
  });
};

// a salt crystal: a small cube
const cube = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => polyP(c, [[x, y], [x + s * 0.45, y - s * 0.32], [x + s * 1.45, y - s * 0.32], [x + s, y]]), WHITE, 4);
  shape(c, () => polyP(c, [[x + s, y], [x + s * 1.45, y - s * 0.32], [x + s * 1.45, y + s * 0.68], [x + s, y + s]]), "#c3cedb", 4);
  shape(c, () => rrect(c, x, y, s, s, 2), "#eef3f9", 4);
};

// setup.e3.2
const su9 = (c: Ctx) => {
  ground(c);
  const cx = 470, cy = 440, R = 300;
  shadow(c, cx + 30, cy + R + 40, R * 0.8, 30);
  // handle
  thick(c, [[cx + R * 0.7, cy + R * 0.7], [880, 860]], 40, COL.brown);
  shape(c, () => ell(c, cx, cy, R, R), "#eaf4fb", 0);
  c.save(); c.beginPath(); ell(c, cx, cy, R, R); c.clip();
  const tx = (y: number) => cx + Math.sin(y / 70) * 22;
  const pts: number[][] = []; for (let y = 120; y <= 780; y += 30) pts.push([tx(y), y]);
  curve(c, pts, 26, COL.paper);
  const r = rnd(5), cs: number[][] = [];
  for (let i = 0; i < 20; i++) { const y = 170 + (i / 19) * 520 + (r() - 0.5) * 30; cs.push([tx(y) + (i % 2 ? 1 : -1) * (20 + r() * 110), y, 46 + r() * 30]); }
  cs.sort((a, b) => a[1] - b[1]).forEach(([x, y, s]) => cube(c, x - s / 2, y, s));
  c.restore();
  c.beginPath(); ell(c, cx, cy, R, R); c.strokeStyle = COL.steelDk; c.lineWidth = 34; c.stroke();
  c.beginPath(); ell(c, cx, cy, R + 17, R + 17); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  c.beginPath(); ell(c, cx, cy, R - 17, R - 17); c.stroke();
  shine(c, [[cx - 200, cy - 130], [cx - 140, cy - 210]], 12);
  hand(c, 859, 839, -2.356, 1.7);
};

export const su_whatIsLifeEdgeOfLife = cards("sci.what-is-life.edge-of-life.L3 set-up", [su1, su2, su3, su4, su5, su6, su7, su8, su9]);
