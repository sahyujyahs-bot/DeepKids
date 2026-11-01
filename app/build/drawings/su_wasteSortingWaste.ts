import type { Ctx } from "./core";
import { INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, bowl, plate, leaf, cards, write, rnd } from "./flatKit";

// SORTING WASTE · set-up cards for the three experiments (jars, sorting bowls, peel in two dabbas).
const NEWS = "#f4f1e8", INKLINE = "#8d877e", STAIN = "#f0a24a", STAINDK = "#d4802a", BOXC = "#f6e6b8", BOXSTAIN = "#e8741f";
const SAMBAR = "#c9782e", SAMBARDK = "#9c561c", RICE = "#fffaf0", PEEL = "#ffd34d", PEELDK = "#d9a21f", TIP = "#6a4128", MILK = "#dff0fb", TEA = "#6b4528";
const COUNTER = "#e3d2ae", GLOVE = "#7a63c9", GLOVEDK = "#5a47a3";

// a flat strip lying (rot 0) or hanging (rot pi/2): newspaper, biscuit-box piece, milk packet, soaked newspaper
const strip = (c: Ctx, x: number, y: number, w: number, h: number, rot: number, kind: "news" | "box" | "milk" | "soaked" | "boxstain") => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const body = () => rrect(c, -w / 2, -h / 2, w, h, 6);
  shape(c, body, { news: NEWS, box: BOXC, boxstain: BOXC, milk: MILK, soaked: STAIN }[kind], 5);
  if (kind === "news" || kind === "soaked") {
    if (kind === "news") shape(c, () => rrect(c, -w / 2 + 10, -h / 2 + 8, w * 0.3, h * 0.34, 3), INKLINE, 0);
    const n = Math.max(3, Math.round(h / 17));
    for (let i = 0; i < n; i++) { const yy = -h / 2 + h * ((i + 0.7) / (n + 0.4)); line(c, [[-w / 2 + 14, yy], [w / 2 - 14, yy]], Math.max(3, h * 0.06), kind === "soaked" ? STAINDK : INKLINE); }
  }
  if (kind === "box" || kind === "boxstain") { shape(c, () => rrect(c, -w * 0.32, -h * 0.3, w * 0.64, h * 0.6, 6), RED, 4); shape(c, () => ell(c, 0, 0, h * 0.2, h * 0.2), COL.yellow, 3); }
  if (kind === "milk") line(c, [[-w / 2 + 12, 0], [-w * 0.22, -h * 0.2], [w * 0.05, h * 0.2], [w * 0.3, -h * 0.2], [w / 2 - 12, 0]], Math.max(4, h * 0.14), COL.blue);
  if (kind === "boxstain") { shape(c, () => { c.moveTo(-w * 0.28, -h * 0.34); c.quadraticCurveTo(-w * 0.05, -h * 0.55, w * 0.22, -h * 0.3); c.quadraticCurveTo(w * 0.42, 0, w * 0.2, h * 0.34); c.quadraticCurveTo(-w * 0.1, h * 0.52, -w * 0.3, h * 0.22); c.quadraticCurveTo(-w * 0.42, -h * 0.05, -w * 0.28, -h * 0.34); c.closePath(); }, BOXSTAIN, 0); }
  shade(c, body, "#7d7870", 0, -h * 0.14, 0.22);
  c.restore();
};
// a banana peel: a thick yellow crescent with brown tips
const peel = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => { c.moveTo(-70, 10); c.quadraticCurveTo(0, -62, 70, 10); c.quadraticCurveTo(0, -4, -70, 10); c.closePath(); }, PEEL, 5);
  shade(c, () => { c.moveTo(-70, 10); c.quadraticCurveTo(0, -62, 70, 10); c.quadraticCurveTo(0, -4, -70, 10); c.closePath(); }, PEELDK, 0, -8, 0.6);
  shape(c, () => ell(c, -68, 10, 9, 7), TIP, 3); shape(c, () => ell(c, 68, 10, 9, 7), TIP, 3);
  c.restore();
};
const dropShape = (c: Ctx, x: number, y: number, s: number, col: string = COL.drop) => shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 1.1, y - s * 0.1, x, y + s * 0.7); c.quadraticCurveTo(x - s * 1.1, y - s * 0.1, x, y - s * 1.5); c.closePath(); }, col, 3);

// a glass jar standing at (x, y) (bottom centre), tipped by rot; fill draws what is inside, in jar coordinates
type JarOpts = { rot?: number; lid?: boolean; tag?: "dry" | "wet"; fill?: (c: Ctx, w: number, h: number) => void };
const jar = (c: Ctx, x: number, y: number, w: number, h: number, o: JarOpts = {}) => {
  if (!o.rot) shadow(c, x + w * 0.1, y + 8, w * 0.62, w * 0.11);
  c.save(); c.translate(x, y); c.rotate(o.rot ?? 0);
  const body = () => rrect(c, -w / 2, -h, w, h, 26);
  shape(c, body, "#eaf5fb", 0);
  c.save(); c.beginPath(); body(); c.clip(); o.fill?.(c, w, h); c.restore();
  shape(c, body, "rgba(214,236,250,0.3)", 6);
  shade(c, body, COL.glassEdge, -w * 0.06, 0, 0.3);
  shine(c, [[-w * 0.36, -h * 0.85], [-w * 0.36, -h * 0.35]], 9);
  if (o.lid) { const lid = () => rrect(c, -w / 2 - 6, -h - 36, w + 12, 44, 10); shape(c, lid, COL.steel); shade(c, lid, COL.steelDk, -w * 0.08, 0, 0.6); line(c, [[-w * 0.3, -h - 20], [-w * 0.3, -h - 6]], 5, WHITE); }
  if (o.tag) {
    const ty = -h * 0.55; shape(c, () => ell(c, 0, ty, 46, 46), WHITE, 5);
    if (o.tag === "dry") { shape(c, () => ell(c, 0, ty, 18, 18), COL.yellow, 4); for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; line(c, [[Math.cos(a) * 26, ty + Math.sin(a) * 26], [Math.cos(a) * 34, ty + Math.sin(a) * 34]], 5, COL.orange); } }
    else dropShape(c, 0, ty + 4, 22, COL.water);
  }
  c.restore();
};
// what the jars hold: a layer of dry strips, then wet waste on top
const dryLayer = (c: Ctx, w: number, h: number) => {
  strip(c, -w * 0.02, -22, w * 0.78, 40, 0.03, "milk"); strip(c, w * 0.02, -58, w * 0.74, 40, -0.04, "box"); strip(c, -w * 0.03, -95, w * 0.76, 40, 0.03, "news");
};
const wetLayer = (c: Ctx, w: number, h: number) => {
  const top = -h * 0.4;
  shape(c, () => { c.moveTo(-w / 2 - 4, top); c.quadraticCurveTo(-w * 0.25, top - 26, 0, top + 6); c.quadraticCurveTo(w * 0.25, top - 22, w / 2 + 4, top); c.lineTo(w / 2 + 4, 4); c.lineTo(-w / 2 - 4, 4); c.closePath(); }, SAMBAR, 0);
  shade(c, () => { c.moveTo(-w / 2 - 4, top); c.lineTo(w / 2 + 4, top); c.lineTo(w / 2 + 4, 4); c.lineTo(-w / 2 - 4, 4); c.closePath(); }, SAMBARDK, -w * 0.07, 0, 0.5);
  for (let i = 0; i < 9; i++) shape(c, () => ell(c, -w * 0.36 + i * w * 0.09, top - 8 + (i % 3) * 9, 11, 7, i), RICE, 2.5);
  peel(c, -w * 0.12, top + 30, 0.9, -0.15); shape(c, () => ell(c, w * 0.28, top + 40, 18, 14), COL.red, 3);
};

// setup.e1.0
function s_e1_0(c: Ctx) {
  ground(c);
  plate(c, 540, 650, 520, 240);
  jar(c, 290, 570, 300, 440, { tag: "dry" }); jar(c, 790, 570, 300, 440, { tag: "wet" });
  for (const x of [290, 790]) { strip(c, x, 680, 250, 52, 0.03, "news"); strip(c, x, 745, 250, 52, -0.03, "box"); strip(c, x, 810, 250, 52, 0.03, "milk"); }
}
// setup.e1.1
function s_e1_1(c: Ctx) {
  ground(c);
  jar(c, 400, 960, 400, 520, { tag: "wet", fill: (cc, w, h) => { dryLayer(cc, w, h); wetLayer(cc, w, h); } });
  // spoon tipping sambar and rice into the jar
  const hx = 905, hy = 200, an = Math.PI - 0.35;
  line(c, [[hx - 90, hy + 33], [575, 355]], 28, INK); line(c, [[hx - 90, hy + 33], [575, 355]], 17, COL.steel);
  shape(c, () => ell(c, 535, 372, 78, 46, 0.55), COL.steel, 6);
  shape(c, () => ell(c, 530, 376, 56, 28, 0.55), SAMBAR, 3);
  for (let i = 0; i < 4; i++) shape(c, () => ell(c, 520 + i * 14, 370 + i * 4, 9, 6, i), RICE, 2.5);
  line(c, [[478, 408], [462, 560]], 26, INK); line(c, [[478, 408], [462, 560]], 16, SAMBAR);
  dropShape(c, 440, 600, 12, SAMBAR);
  hand(c, hx, hy, an, 1.8);
  arrow(c, [[640, 470], [640, 590]]);
}
// setup.e1.2
function s_e1_2(c: Ctx) {
  ground(c);
  const dry = (cc: Ctx, w: number, h: number) => dryLayer(cc, w, h);
  jar(c, 250, 840, 230, 330, { rot: -0.3, lid: true, tag: "dry", fill: dry });
  jar(c, 540, 840, 230, 330, { rot: 0.3, lid: true, tag: "wet", fill: (cc, w, h) => { dryLayer(cc, w, h); wetLayer(cc, w, h); } });
  for (const cx of [155, 640]) { const pts: number[][] = []; for (let k = 0; k <= 10; k++) { const a = Math.PI * (1.12 + (k / 10) * 0.76); pts.push([cx + Math.cos(a) * 130, 440 + Math.sin(a) * 90]); } arrow(c, pts); arrow(c, [pts[1], pts[0]]); }
  // kitchen timer, a quarter of the dial red
  const tx = 920, ty = 660, tr = 125;
  shadow(c, tx + 14, ty + tr + 4, tr * 0.9, 24);
  shape(c, () => ell(c, tx, ty, tr, tr), COL.red, 6);
  shade(c, () => ell(c, tx, ty, tr, tr), "#a8331f", -22, -22, 0.4);
  shape(c, () => ell(c, tx, ty, tr * 0.78, tr * 0.78), WHITE, 5);
  shape(c, () => { c.moveTo(tx, ty); c.arc(tx, ty, tr * 0.74, -Math.PI / 2, 0); c.closePath(); }, "#f9b3a8", 0);
  for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; line(c, [[tx + Math.cos(a) * tr * 0.64, ty + Math.sin(a) * tr * 0.64], [tx + Math.cos(a) * tr * 0.74, ty + Math.sin(a) * tr * 0.74]], k % 3 ? 3 : 6); }
  line(c, [[tx, ty], [tx + tr * 0.5, ty - tr * 0.01]], 9, INK);
  write(c, "15", tx - 30, ty + 18, 50, INK, 8);
  shape(c, () => rrect(c, tx - 22, ty - tr - 22, 44, 26, 8), COL.steel, 5);
}
// setup.e1.3
function s_e1_3(c: Ctx) {
  ground(c);
  // soaked strip, torn, lifted by tongs
  strip(c, 290, 535, 230, 150, Math.PI / 2, "soaked");
  shape(c, () => polyP(c, [[215, 645], [245, 672], [275, 648], [300, 678], [330, 650], [360, 674], [365, 645]]), STAIN, 5);
  c.save(); c.translate(0, 0); strip(c, 322, 770, 150, 150, Math.PI / 2 + 0.1, "soaked"); c.restore();
  shape(c, () => polyP(c, [[258, 700], [282, 722], [310, 702], [336, 724], [362, 700], [388, 716], [386, 694]]), STAIN, 5);
  shape(c, () => ell(c, 292, 640, 40, 13), "rgba(212,128,42,0.45)", 0);
  [[250, 925, 11], [300, 940, 9], [352, 930, 12]].forEach(([x, y, s]) => dropShape(c, x, y, s, STAIN));
  const tongs = (dx: number) => { line(c, [[dx - 28, 240], [dx - 6, 440]], 24, INK); line(c, [[dx + 28, 240], [dx + 6, 440]], 24, INK); line(c, [[dx - 28, 240], [dx - 6, 440]], 13, COL.steel); line(c, [[dx + 28, 240], [dx + 6, 440]], 13, COL.steel); };
  tongs(290);
  hand(c, 290, 150, Math.PI / 2, 1.7);
  arrow(c, [[110, 520], [110, 360]]);
  // dry strip held whole
  strip(c, 780, 535, 560, 150, Math.PI / 2, "news");
  hand(c, 780, 150, Math.PI / 2, 1.7, SKIN.adult, CLOTH.adult);
}
// setup.e1.4
function s_e1_4(c: Ctx) {
  ground(c);
  // the tap and the stream onto the milk packet strip
  shape(c, () => polyP(c, [[0, 80], [335, 80], [335, 215], [270, 215], [270, 145], [0, 145]]), COL.steel);
  shade(c, () => polyP(c, [[0, 80], [335, 80], [335, 215], [270, 215], [270, 145], [0, 145]]), COL.steelDk, 0, -14, 0.5);
  shape(c, () => rrect(c, 120, 44, 60, 38, 8), COL.blue, 5);
  shape(c, () => polyP(c, [[272, 222], [332, 222], [326, 440], [278, 440]]), COL.water, 4);
  shine(c, [[292, 240], [296, 420]], 7);
  strip(c, 303, 640, 420, 130, Math.PI / 2, "milk");
  for (const [x, y, s] of [[225, 470, 11], [385, 480, 12], [240, 560, 9], [370, 600, 10]]) dropShape(c, x, y, s);
  hand(c, 303, 920, -Math.PI / 2, 1.7);
  // the biscuit-box piece with its orange stain
  strip(c, 790, 640, 420, 190, Math.PI / 2, "boxstain");
  hand(c, 790, 920, -Math.PI / 2, 1.7, SKIN.adult, CLOTH.adult);
}

// ---------------------------------------------------------------- experiment 2
const cap = (c: Ctx, x: number, y: number, r: number, col: string) => { shape(c, () => ell(c, x, y, r, r * 0.8), col, 4); shape(c, () => ell(c, x, y, r * 0.62, r * 0.48), WHITE, 0); c.beginPath(); ell(c, x, y, r * 0.62, r * 0.48); c.strokeStyle = INK; c.lineWidth = 3; c.stroke(); };
const scrap = (c: Ctx, x: number, y: number, r: number, rot: number) => { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => polyP(c, [[-r, -r * 0.6], [r * 0.3, -r * 0.8], [r, -r * 0.2], [r * 0.7, r * 0.7], [-r * 0.7, r * 0.6]]), NEWS, 4); line(c, [[-r * 0.5, -r * 0.2], [r * 0.5, -r * 0.3]], 3, INKLINE); line(c, [[-r * 0.5, r * 0.2], [r * 0.4, r * 0.1]], 3, INKLINE); c.restore(); };
const tealeaf = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.55, 0.4), TEA, 3); shade(c, () => ell(c, x, y, r, r * 0.55, 0.4), "#3d2614", -r * 0.3, -r * 0.2, 0.6); };
const wrapper = (c: Ctx, x: number, y: number, r: number, rot: number) => { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => polyP(c, [[-r, -r * 0.5], [-r * 0.3, -r * 0.7], [r * 0.4, -r * 0.5], [r, -r * 0.1], [r * 0.5, r * 0.6], [-r * 0.5, r * 0.5]]), COL.pink, 4); line(c, [[-r * 0.4, 0], [r * 0.5, -r * 0.1]], 4, WHITE); c.restore(); };
const bowls3 = (c: Ctx, y: number) => {
  bowl(c, 250, y, 140); bowl(c, 540, y, 140); bowl(c, 830, y, 140);
  leaf(c, 215, y - 4, 90, -0.3); leaf(c, 270, y, 80, -0.9, COL.greenLt);
  cap(c, 505, y - 6, 34, COL.blue); cap(c, 575, y - 10, 34, COL.red); cap(c, 540, y + 6, 34, COL.yellow);
  scrap(c, 800, y - 4, 52, -0.3); scrap(c, 860, y + 2, 46, 0.5);
};
const phone = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 10, y + h + 4, w * 0.6, 14);
  shape(c, () => rrect(c, x, y, w, h, 24), "#3a3540", 6);
  shape(c, () => rrect(c, x + 12, y + 16, w - 24, h - 32, 14), "#22303a", 3);
  const cx = x + w / 2, cy = y + h / 2;
  c.beginPath(); c.arc(cx, cy, w * 0.34, 0, Math.PI * 2); c.strokeStyle = "#3a4a55"; c.lineWidth = 12; c.stroke();
  c.beginPath(); c.arc(cx, cy, w * 0.34, -Math.PI / 2, Math.PI * 0.55); c.strokeStyle = COL.teal; c.lineWidth = 12; c.lineCap = "round"; c.stroke();
  write(c, "00", cx - 24, cy - 17, 36, "#c9f06b", 6);
};
// setup.e2.0
function s_e2_0(c: Ctx) {
  ground(c);
  phone(c, 455, 30, 170, 270);
  bowls3(c, 850);
  const wx = 185, wy = 300, an = 0.25, s = 2;
  cap(c, wx + Math.cos(an) * 100 * s, wy + Math.sin(an) * 100 * s, 58, COL.red);
  hand(c, wx, wy, an, s);
  cap(c, 900 - 100 * s * 0.99, 320, 58, COL.blue);
  hand(c, 900, 300, Math.PI - 0.15, s, SKIN.adult, CLOTH.adult);
  arrow(c, [[390, 450], [470, 570], [525, 700]]);
}
// setup.e2.1
function s_e2_1(c: Ctx) {
  ground(c);
  const cx = 520, cy = 600;
  bowl(c, cx, cy, 360);
  const r = rnd(5), items: [number, number, number][] = [];
  for (let i = 0; i < 34; i++) items.push([cx - 290 + r() * 580, cy - 55 + r() * 100, i]);
  items.sort((a, b) => a[1] - b[1]);
  items.forEach(([x, y, i]) => {
    const k = i % 6;
    if (k === 0) cap(c, x, y, 44, [COL.blue, COL.red, COL.yellow][i % 3]);
    else if (k === 1) scrap(c, x, y, 52, i * 0.7);
    else if (k === 2 || k === 5) tealeaf(c, x, y, 40);
    else if (k === 3) wrapper(c, x, y, 48, i * 0.5);
    else leaf(c, x - 30, y, 80, -0.4 + (i % 3) * 0.5);
  });
  for (let i = 0; i < 5; i++) dropShape(c, cx - 170 + i * 80, cy - 100 - (i % 2) * 60, 12, COL.water);
  const hx = 930, hy = 165, an = 2.47;
  const p0: number[] = [hx + Math.cos(an) * 60, hy + Math.sin(an) * 60];
  line(c, [p0, [530, 520]], 28, INK); line(c, [p0, [530, 520]], 17, COL.steel);
  shape(c, () => ell(c, 505, 535, 70, 44, an), COL.steel, 6);
  hand(c, hx, hy, an, 1.8);
  const pts: number[][] = []; for (let k = 0; k <= 12; k++) { const a = (k / 12) * Math.PI; pts.push([cx + 40 + Math.cos(a) * 240, cy - 20 + Math.sin(a) * 70]); }
  arrow(c, pts);
}
// setup.e2.2
function s_e2_2(c: Ctx) {
  ground(c);
  phone(c, 580, 30, 170, 270);
  bowls3(c, 850);
  const wx = 185, wy = 300, an = 0.25, s = 2;
  const px = wx + Math.cos(an) * 100 * s, py = wy + Math.sin(an) * 100 * s;
  scrap(c, px, py, 105, 0.2);
  [[-40, -14], [26, 18], [-6, 40], [46, -30]].forEach(([dx, dy]) => tealeaf(c, px + dx, py + dy, 24));
  hand(c, wx, wy, an, s, GLOVE, GLOVEDK);
  tealeaf(c, 262, 860, 22);
  arrow(c, [[350, 490], [300, 590], [265, 700]]);
}

// ---------------------------------------------------------------- experiment 3
const dabba = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.62, w * 0.1);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x - w / 2, y - 22); c.quadraticCurveTo(x - w / 2, y, x - w / 2 + 22, y); c.lineTo(x + w / 2 - 22, y); c.quadraticCurveTo(x + w / 2, y, x + w / 2, y - 22); c.lineTo(x + w / 2, y - h); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -w * 0.1, 0, 0.55);
  line(c, [[x - w * 0.36, y - h * 0.8], [x - w * 0.36, y - h * 0.3]], 9, WHITE);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.14), COL.steelIn, 5);
  shape(c, () => ell(c, x, y - h + 3, w * 0.43, w * 0.1), "#aab4c2", 0);
  peel(c, x - w * 0.12, y - h - 4, w / 220, -0.25); peel(c, x + w * 0.16, y - h - 20, w / 260, 0.3);
};
// setup.e3.0
function s_e3_0(c: Ctx) {
  ground(c);
  dabba(c, 290, 990, 380, 450); dabba(c, 790, 990, 380, 450);
  shape(c, () => rrect(c, 100, 300, 380, 56, 14), COL.steel); shade(c, () => rrect(c, 100, 300, 380, 56, 14), COL.steelDk, -50, 0, 0.55); shape(c, () => ell(c, 290, 294, 44, 20), COL.steelDk, 5);
  hand(c, 290, 165, Math.PI / 2, 1.6);
  arrow(c, [[525, 330], [525, 470]]);
}
const ant = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const lx of [-6, 8, 22]) { line(c, [[lx, 0], [lx - 6, -17]], 3.5); line(c, [[lx, 0], [lx - 6, 17]], 3.5); }
  shape(c, () => ell(c, -16, 0, 14, 10), "#3a2a2a", 3.5); shape(c, () => ell(c, 6, 0, 8, 8), "#3a2a2a", 3.5); shape(c, () => ell(c, 26, 0, 12, 10), "#3a2a2a", 3.5);
  line(c, [[30, -8], [42, -18]], 3); line(c, [[30, 8], [42, 18]], 3);
  c.restore();
};
const fly = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => ell(c, -6, -18, 20, 11, -0.6), "rgba(255,255,255,0.8)", 3); shape(c, () => ell(c, 14, -20, 20, 11, 0.3), "rgba(255,255,255,0.8)", 3);
  shape(c, () => ell(c, 0, 0, 22, 13), "#3a3540", 3.5); shape(c, () => ell(c, 22, 0, 10, 9), "#3a3540", 3.5); shape(c, () => ell(c, 26, -3, 4, 4), COL.red, 0);
  c.restore();
};
// setup.e3.1
function s_e3_1(c: Ctx) {
  ground(c);
  c.fillStyle = COUNTER; c.fillRect(0, 590, 1080, 200); line(c, [[0, 590], [1080, 590]], 5);
  dabba(c, 830, 730, 300, 340);
  for (let i = 0; i < 5; i++) ant(c, 70 + i * 122, 690 - i * 3 + Math.sin(i * 1.7) * 14, 1.5);
  fly(c, 640, 190, 2.4); fly(c, 880, 160, 2.4);
  // the notebook with tally marks and a hand writing
  shape(c, () => rrect(c, 70, 815, 650, 245, 12), WHITE); shape(c, () => rrect(c, 70, 815, 70, 245, 12), COL.blue, 5);
  for (let k = 0; k < 4; k++) line(c, [[165, 875 + k * 56], [690, 875 + k * 56]], 2.5, COL.sky);
  const tally = (x: number, y: number, n: number) => { for (let i = 0; i < n; i++) { const g = Math.floor(i / 5), k = i % 5; if (k < 4) line(c, [[x + g * 100 + k * 18, y], [x + g * 100 + k * 18, y + 38]], 6); else line(c, [[x + g * 100 - 8, y + 30], [x + g * 100 + 66, y + 6]], 6); } };
  tally(180, 840, 2); tally(180, 896, 5); tally(180, 952, 9);
  line(c, [[860, 920], [690, 1000]], 26, INK); line(c, [[860, 920], [690, 1000]], 15, COL.yellow);
  shape(c, () => polyP(c, [[700, 995], [672, 1010], [690, 1000]]), TIP, 4);
  hand(c, 940, 890, Math.PI - 0.3, 1.7);
}

export const su_wasteSortingWaste = cards("sci.waste.sorting-waste.L3 set-up", [s_e1_0, s_e1_1, s_e1_2, s_e1_3, s_e1_4, s_e2_0, s_e2_1, s_e2_2, s_e3_0, s_e3_1]);
