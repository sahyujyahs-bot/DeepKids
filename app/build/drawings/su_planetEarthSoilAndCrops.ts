import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, write, rnd, cards } from "./flatKit";

// sci.planet-earth.soil-and-crops.L3 · set-up cards. Same child hands and sleeve, same jar, teal cups, steel tumbler and tiffin box on every card of an experiment.

const thick = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };
// shade side of a shape: light from the upper left, so the dark tone sits right and low
const sh = (c: Ctx, p: () => void, col: string, d = 30, a = 0.55) => shade(c, p, col, -d, -d * 0.35, a);
// a long sleeve running back from the wrist to the edge of the card, so the hand has an arm
const sleeveArm = (c: Ctx, x: number, y: number, an: number, s: number, len = 460) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  const p = () => rrect(c, -78 - len, -31, len + 56, 62, 10);
  shape(c, p, CLOTH.child, 6); sh(c, p, CLOTH.childDk, 18, 0.7);
  c.restore();
};
const armHand = (c: Ctx, x: number, y: number, an: number, s: number, open = false) => { sleeveArm(c, x, y, an, s); hand(c, x, y, an, s, SKIN.child, CLOTH.child, open); };
// both hands gripping something from the two sides (a jar, a box), fingertips at the object's edges
const twoHands = (c: Ctx, left: number, right: number, y: number, s: number) => {
  armHand(c, left - 78 * s, y, 0, s);
  armHand(c, right + 78 * s, y, Math.PI, s);
};
const specks = (c: Ctx, cx: number, cy: number, rx: number, ry: number, n: number, seedN: number, cols: string[], rMin = 3, rMax = 7) => {
  const r = rnd(seedN);
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()), x = cx + Math.cos(a) * d * rx, y = cy + Math.sin(a) * d * ry;
    c.beginPath(); ell(c, x, y, rMin + r() * (rMax - rMin), (rMin + r() * (rMax - rMin)) * 0.75, r() * 3); c.fillStyle = cols[Math.floor(r() * cols.length)]; c.fill();
  }
};
const SOILS = ["#6a4128", "#a87a56", "#5a3822", "#c9a679", "#8a5a3c"];

// ---------------------------------------------------------------- shared objects
// a glass jar with a steel lid, bottom centre (cx, by); inside() paints the contents, clipped to the jar
const jar = (c: Ctx, cx: number, by: number, w: number, h: number, inside: (x0: number, y0: number, x1: number, y1: number) => void) => {
  const x0 = cx - w / 2, y0 = by - h, body = () => rrect(c, x0, y0, w, h, 40);
  shadow(c, cx + w * 0.1, by + 8, w * 0.58, 22);
  shape(c, body, "rgba(255,255,255,0.5)", 0);
  c.save(); c.beginPath(); body(); c.clip(); inside(x0, y0, x0 + w, by); c.restore();
  shape(c, body, "rgba(214,236,250,0.2)", 6);
  shine(c, [[x0 + 24, y0 + 90], [x0 + 24, by - 70]], 10);
  const lid = () => rrect(c, x0 + w * 0.03, y0 - 50, w * 0.94, 64, 14);
  shape(c, lid, COL.steel); sh(c, lid, COL.steelDk, 60, 0.7);
  for (let k = 1; k < 6; k++) line(c, [[x0 + w * 0.03 + (w * 0.94 * k) / 6, y0 - 40], [x0 + w * 0.03 + (w * 0.94 * k) / 6, y0 + 4]], 4, COL.steelDk);
};
// a teal cup: rim centre (cx, y); soil top is the inner ellipse. Returns the soil ellipse [x, y, rx, ry]
const cup = (c: Ctx, cx: number, y: number, rx: number, ry: number, h: number): number[] => {
  const bw = rx * 0.74, body = () => { c.moveTo(cx - rx, y); c.lineTo(cx - bw, y + h); c.ellipse(cx, y + h, bw, ry * 0.85, 0, Math.PI, 0, true); c.lineTo(cx + rx, y); c.closePath(); };
  shadow(c, cx + rx * 0.2, y + h + ry * 0.6, rx * 0.95, ry * 0.5);
  shape(c, body, COL.teal); sh(c, body, COL.tealDk, rx * 0.5, 0.8);
  shine(c, [[cx - rx * 0.8, y + h * 0.2], [cx - rx * 0.62, y + h * 0.85]], 10);
  shape(c, () => ell(c, cx, y, rx, ry), "#6fd0c7", 6);
  shape(c, () => ell(c, cx, y + 8, rx * 0.93, ry * 0.8), COL.soil, 4);
  specks(c, cx, y + 8, rx * 0.85, ry * 0.7, 40, 5 + Math.round(cx), SOILS, 3, 6);
  return [cx, y + 8, rx * 0.93, ry * 0.8];
};
const hole = (c: Ctx, x: number, y: number, rx: number, ry: number) => { shape(c, () => ell(c, x, y, rx, ry), "#2f1d12", 3); shape(c, () => ell(c, x, y + ry * 0.3, rx * 0.6, ry * 0.5), "#170d07", 0); };
// ten holes in a cup's soil, offsets scaled to the cup
const HOLES: number[][] = [[-120, -8], [-78, -25], [-24, -29], [30, -27], [84, -21], [126, -3], [-90, 15], [-36, 13], [21, 15], [114, 17]];
const tunnels = (c: Ctx, cx: number, cy: number, k: number, skip = -1) => HOLES.forEach(([dx, dy], i) => { if (i !== skip) hole(c, cx + dx * k, cy + dy * k, 12 * k, 6 * k); });
// a steel tumbler standing at (x, yBase), wider at the mouth; water 0..1 shows in the mouth
const tumbler = (c: Ctx, x: number, yBase: number, wb: number, wt: number, h: number, water = 0) => {
  const body = () => { c.moveTo(x - wt, yBase - h); c.lineTo(x - wb, yBase); c.ellipse(x, yBase, wb, wb * 0.22, 0, Math.PI, 0, true); c.lineTo(x + wt, yBase - h); c.closePath(); };
  shape(c, body, COL.steel); sh(c, body, COL.steelDk, wt * 0.8, 0.7);
  shine(c, [[x - wt * 0.72, yBase - h * 0.85], [x - wb * 0.7, yBase - h * 0.15]], 9);
  shape(c, () => ell(c, x, yBase - h, wt, wt * 0.22), COL.steelIn, 6);
  shape(c, () => ell(c, x, yBase - h + 2, wt * 0.86, wt * 0.17), water ? COL.water : COL.steelDk, 3);
};
// a chalk bit: a short white stick, the round end face showing; a broken bit has one jagged end, a worn one is rounded both ends
const chalk = (c: Ctx, x: number, y: number, r: number, rot: number, worn = false) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const h = r * 0.95, body = () => {
    if (worn) { rrect(c, -r, -h / 2, r * 2, h, h * 0.45); return; }
    c.moveTo(-r + 2, -h * 0.5); c.lineTo(r, -h * 0.5); c.ellipse(r, 0, r * 0.26, h * 0.5, 0, -Math.PI / 2, Math.PI / 2); c.lineTo(-r + 2, h * 0.5); c.lineTo(-r - 3, h * 0.1); c.lineTo(-r + 3, -h * 0.15); c.closePath();
  };
  shape(c, body, "#fffdf5", 5); shade(c, body, "#cfc8b6", -r * 0.1, -h * 0.3, 0.75);
  shape(c, () => ell(c, r, 0, r * 0.26, h * 0.5), "#ece6d4", 4);
  c.restore();
};
// a steel tiffin box, rim centre (x, y), rim radii (rx, ry), height h. open: the inside shows (a floor); closed: a lid
const tiffin = (c: Ctx, x: number, y: number, rx: number, ry: number, h: number, open: boolean) => {
  shadow(c, x + rx * 0.12, y + h + ry * 0.55, rx * 1.02, ry * 0.6);
  const body = () => { c.moveTo(x - rx, y); c.lineTo(x - rx, y + h); c.ellipse(x, y + h, rx, ry, 0, Math.PI, 0, true); c.lineTo(x + rx, y); c.closePath(); };
  shape(c, body, COL.steel); sh(c, body, COL.steelDk, rx * 0.5, 0.7);
  c.beginPath(); c.ellipse(x, y + h * 0.6, rx, ry, 0, 0.05, Math.PI - 0.05); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  shine(c, [[x - rx * 0.8, y + h * 0.2], [x - rx * 0.8, y + h * 0.75]], 10);
  if (open) {
    shape(c, () => ell(c, x, y, rx, ry), COL.steel, 6);
    shape(c, () => ell(c, x, y + 4, rx * 0.93, ry * 0.88), COL.steelDk, 4);
    shape(c, () => ell(c, x, y + 22, rx * 0.84, ry * 0.7), COL.steelIn, 3);
  } else {
    const band = () => { c.moveTo(x - rx - 10, y); c.lineTo(x - rx - 10, y + 26); c.ellipse(x, y + 26, rx + 10, ry + 4, 0, Math.PI, 0, true); c.lineTo(x + rx + 10, y); c.closePath(); };
    shape(c, band, COL.steel); sh(c, band, COL.steelDk, rx * 0.5, 0.7);
    shape(c, () => ell(c, x, y, rx + 10, ry + 4), COL.steel, 6);
    shape(c, () => ell(c, x, y, rx * 0.84, ry * 0.78), COL.steelIn, 4);
    shape(c, () => rrect(c, x - 34, y - ry * 0.3 - 30, 68, 34, 12), COL.steelDk, 5);
  }
};
const shaking = (c: Ctx, x: number, y: number, rot: number, draw: () => void) => { c.save(); c.translate(x, y); c.rotate(rot); c.translate(-x, -y); draw(); c.restore(); };

// ---------------------------------------------------------------- experiment 1: the soil jar
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  const paper = () => polyP(c, [[90, 230], [890, 215], [1000, 900], [40, 925]]);
  c.save(); c.translate(16, 18); c.beginPath(); paper(); c.fillStyle = "rgba(43,35,64,0.16)"; c.fill(); c.restore();
  shape(c, paper, WHITE); sh(c, paper, "#ded8c8", 50, 0.6);
  // the spoon, a little soil in it
  thick(c, [[880, 370], [1000, 290]], 22, COL.steel);
  shape(c, () => ell(c, 840, 400, 78, 50, 0.55), COL.steel); shape(c, () => ell(c, 840, 398, 60, 34, 0.55), COL.soil, 3);
  // the soil spread on the paper
  const heap = () => ell(c, 450, 690, 285, 140);
  shape(c, heap, COL.soil); sh(c, heap, COL.soilDk, 60, 0.7);
  specks(c, 450, 690, 262, 118, 200, 3, SOILS, 4, 8);
  for (const [x, y] of [[230, 730], [560, 790], [640, 700]]) { const q = [[x, y], [x + 28, y - 14], [x + 56, y + 2], [x + 80, y - 8]]; line(c, q, 9, INK); line(c, q, 4, "#f1e6c8"); }
  // the magnifying glass, held by a hand from the lower right
  const lx = 480, ly = 470, lr = 185, th = 0.78, ux = Math.cos(th), uy = Math.sin(th);
  thick(c, [[lx + ux * lr, ly + uy * lr], [lx + ux * 400, ly + uy * 400]], 32, COL.wood);
  c.save(); c.beginPath(); c.arc(lx, ly, lr - 6, 0, Math.PI * 2); c.clip();
  c.fillStyle = "#fffdf6"; c.fillRect(lx - lr, ly - lr, lr * 2, lr * 2);
  shape(c, () => ell(c, lx - 10, ly + 60, 235, 120), COL.soil, 0);
  specks(c, lx - 10, ly + 60, 215, 100, 40, 9, SOILS, 14, 26);
  for (const [x, y, a] of [[-150, 40, 0.2], [20, 100, -0.3], [60, 20, 0.5]]) { const p = [[lx + x, ly + y], [lx + x + 40, ly + y - 24 * Math.cos(a)], [lx + x + 80, ly + y + 8], [lx + x + 110, ly + y - 6]]; line(c, p, 18, INK); line(c, p, 10, "#f1e6c8"); }
  shape(c, () => ell(c, lx + 110, ly - 80, 22, 16, 0.5), "#8d8d86", 4);
  c.fillStyle = "rgba(214,236,250,0.25)"; c.fillRect(lx - lr, ly - lr, lr * 2, lr * 2);
  c.restore();
  c.beginPath(); c.arc(lx, ly, lr, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 36; c.stroke();
  c.beginPath(); c.arc(lx, ly, lr, 0, Math.PI * 2); c.strokeStyle = COL.steelDk; c.lineWidth = 24; c.stroke();
  c.beginPath(); c.arc(lx - 8, ly - 8, lr - 36, Math.PI * 1.1, Math.PI * 1.45); c.strokeStyle = WHITE; c.lineWidth = 12; c.lineCap = "round"; c.globalAlpha = 0.8; c.stroke(); c.globalAlpha = 1;
  armHand(c, lx + ux * 430, ly + uy * 430, th + Math.PI, 1.8);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  const cx = 540, by = 840, w = 330, h = 520, ty = by - h;
  shaking(c, cx, by - h / 2, -0.12, () => jar(c, cx, by, w, h, (x0, y0, x1, y1) => {
    c.fillStyle = "#b9966a"; c.fillRect(x0, y0 + 50, w, h);
    const p = () => { c.moveTo(x0, y1 - 190); for (let i = 0; i <= 10; i++) c.lineTo(x0 + (w * i) / 10, y1 - 190 + (i % 2 ? -22 : 14)); c.lineTo(x1, y1); c.lineTo(x0, y1); c.closePath(); };
    shape(c, p, COL.soil, 0); sh(c, p, COL.soilDk, 60, 0.7);
    specks(c, cx, y0 + 270, w * 0.45, 150, 70, 21, ["#8a5a3c", "#6a4128", "#d4b78a", "#c9a679"], 5, 11);
    specks(c, cx, y1 - 90, w * 0.45, 60, 30, 22, SOILS, 5, 10);
    shape(c, () => ell(c, cx - 50, y0 + 330, 70, 26, 0.5), "rgba(138,90,60,0.7)", 0);
    shape(c, () => ell(c, cx + 60, y0 + 230, 60, 22, -0.4), "rgba(138,90,60,0.7)", 0);
  }));
  twoHands(c, cx - w / 2 + 6, cx + w / 2 - 6, 560, 1.6);
  arrow(c, [[300, 450], [300, 250]]);
  arrow(c, [[780, 250], [780, 450]]);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  // the shelf
  const top = () => polyP(c, [[10, 905], [60, 850], [1020, 850], [1070, 905]]);
  shape(c, top, "#f7d588"); shape(c, () => rrect(c, 10, 905, 1060, 80, 6), COL.wood, 6);
  const cx = 500, by = 880, w = 380, h = 620;
  jar(c, cx, by, w, h, (x0, y0, x1, y1) => {
    c.fillStyle = "#d3e8f2"; c.fillRect(x0, y0 + 50, w, h);
    const layer = (ya: number, yb: number, col: string, dk: string) => { const p = () => { c.rect(x0, ya, w, yb - ya); }; shape(c, p, col, 0); sh(c, p, dk, 60, 0.45); };
    layer(y1 - 120, y1, "#d9b878", "#b8935a"); layer(y1 - 210, y1 - 120, "#a07a52", "#7d5a38"); layer(y1 - 245, y1 - 210, "#7d5a48", "#5e4034");
    specks(c, cx, y1 - 60, w * 0.46, 52, 70, 31, ["#fff3d2", "#b08a50", "#8a6a3c", "#f0d9a0"], 5, 9);
    specks(c, cx, y1 - 165, w * 0.46, 38, 90, 32, ["#8a6a48", "#b08c64", "#6e4e32"], 2.5, 4.5);
    // dark bits floating at the top of the water
    specks(c, cx, y0 + 86, w * 0.44, 26, 22, 33, ["#3b2418", "#4a3226", "#2f1d12"], 5, 11);
  });
  // red marks where each layer ends
  for (const y of [by - 120, by - 210, by - 245]) line(c, [[cx - w / 2 + 2, y], [cx + w / 2 - 2, y]], 5, RED);
  // a ruler standing beside it, centimetres up from the shelf
  const rx = 770, rw = 120;
  shadow(c, rx + rw / 2 + 20, by + 8, 70, 14);
  shape(c, () => rrect(c, rx, by - 660, rw, 660, 6), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(rx + rw - 14, by - 657, 11, 654);
  for (let cm = 0; cm <= 16; cm++) { const y = by - cm * 40, len = cm % 5 === 0 ? 44 : 24; line(c, [[rx, y - (cm === 0 ? 3 : 0)], [rx + len, y - (cm === 0 ? 3 : 0)]], cm % 5 === 0 ? 5 : 3); }
  for (const cm of [5, 10, 15]) write(c, String(cm), rx + 50, by - cm * 40 - 17, 34, INK, 5);
};

// ---------------------------------------------------------------- experiment 2: worm tunnels
const CUP_L = 300, CUP_R = 790, RIM = 640, CRX = 185, CRY = 52, CH = 250;
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  cup(c, CUP_L, RIM, CRX, CRY, CH);
  // the second cup still has loose, heaped soil
  const [mx, my, mrx, mry] = cup(c, CUP_R, RIM, CRX, CRY, CH);
  const mound = () => { c.moveTo(mx - mrx * 0.95, my); c.bezierCurveTo(mx - mrx * 0.6, my - 150, mx + mrx * 0.6, my - 150, mx + mrx * 0.95, my); c.ellipse(mx, my, mrx * 0.95, mry, 0, 0, Math.PI); c.closePath(); };
  shape(c, mound, COL.soil, 5); sh(c, mound, COL.soilDk, 60, 0.7);
  specks(c, mx, my - 30, mrx * 0.7, 40, 40, 14, SOILS, 4, 8);
  // the steel tumbler pressing the soil flat with its bottom
  tumbler(c, CUP_L, RIM + 26, 78, 98, 310);
  armHand(c, CUP_L, 280, Math.PI / 2, 1.7);
  arrow(c, [[540, 330], [540, 540]]);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  const [cx, cy, , ] = cup(c, 540, 650, 310, 85, 250);
  tunnels(c, cx, cy, 1.7, 6);
  const px = 640, tipY = cy + 22;
  // the pencil, point down into the soil
  const body = () => rrect(c, px - 22, tipY - 470, 44, 400, 4);
  shape(c, () => polyP(c, [[px - 22, tipY - 72], [px + 22, tipY - 72], [px, tipY]]), "#f2c690", 5);
  shape(c, () => polyP(c, [[px - 7, tipY - 22], [px + 7, tipY - 22], [px, tipY]]), COL.black, 3);
  shape(c, body, COL.yellow, 5); sh(c, body, COL.orange, 22, 0.6);
  shape(c, () => rrect(c, px - 22, tipY - 520, 44, 50, 6), COL.pink, 5);
  shape(c, () => rrect(c, px - 22, tipY - 475, 44, 28, 2), COL.steel, 5);
  shine(c, [[px - 10, tipY - 430], [px - 10, tipY - 100]], 6);
  armHand(c, px + 105, 420, Math.PI, 1.5);
  arrow(c, [[500, 250], [500, 440]]);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  // left: packed soil, the water has stayed on top as a puddle
  const [lx, ly, lrx, lry] = cup(c, CUP_L, RIM, CRX, CRY, CH);
  const pud = () => ell(c, lx, ly + 2, lrx + 2, lry + 2);
  shape(c, pud, COL.water, 5); sh(c, pud, COL.waterDk, 50, 0.7);
  shine(c, [[lx - 110, ly - 12], [lx - 50, ly - 22]], 9);
  for (const k of [1, 1.9, 2.8]) { c.beginPath(); c.ellipse(396, ly + 4, 22 * k, 7 * k, 0, 0, Math.PI * 2); c.strokeStyle = WHITE; c.lineWidth = 4; c.stroke(); }
  // right: ten tunnels, the water has gone down them: the top is dry and each hole shows a little water at its bottom
  const [rx, ry] = cup(c, CUP_R, RIM, CRX, CRY, CH);
  tunnels(c, rx, ry, 1.2);
  HOLES.forEach(([dx, dy]) => shape(c, () => ell(c, rx + dx * 1.2, ry + dy * 1.2 + 4, 10, 4), COL.water, 0));
  // the tumbler pouring into the left cup
  c.save(); c.translate(260, 290); c.rotate(1.9); c.translate(-260, -(290 + 130));
  tumbler(c, 260, 290 + 130 + 130, 76, 96, 260, 1);
  c.restore();
  const wp = () => { c.moveTo(380, 376); c.quadraticCurveTo(404, 390, 408, 430); c.lineTo(408, ly - 4); c.lineTo(384, ly - 4); c.lineTo(384, 440); c.quadraticCurveTo(382, 402, 374, 388); c.closePath(); };
  shape(c, wp, COL.water, 4);
  armHand(c, 150, 272, 0, 1.6);
};

// ---------------------------------------------------------------- experiment 3: rock to grains
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  const rx = 190, ry = 80, h = 150, ty = 720, spots = [[-95, -8], [0, -12], [95, -6], [-95, 30], [0, 34], [95, 30]];
  for (const [x, wet] of [[250, false], [720, true]] as [number, boolean][]) {
    tiffin(c, x, ty, rx, ry, h, true);
    if (wet) { c.globalAlpha = 0.6; shape(c, () => ell(c, x, ty + 20, rx * 0.84, ry * 0.7), COL.water, 0); c.globalAlpha = 1; }
    spots.forEach(([dx, dy], i) => chalk(c, x + dx, ty + 22 + dy, 40, i * 0.9 - 0.4));
    if (wet) { shine(c, [[x - 110, ty + 8], [x - 60, ty + 2]], 8); c.beginPath(); ell(c, x, ty, rx, ry); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); }
  }
  // a tumbler of water tipped over the right box
  c.save(); c.translate(830, 300); c.rotate(-1.9); c.translate(0, -130);
  tumbler(c, 0, 260, 76, 96, 260, 1);
  c.restore();
  const wp = () => { c.moveTo(716, 395); c.quadraticCurveTo(700, 410, 704, 450); c.lineTo(706, ty + 14); c.lineTo(742, ty + 14); c.lineTo(742, 450); c.quadraticCurveTo(738, 410, 730, 392); c.closePath(); };
  shape(c, wp, COL.water, 4);
  armHand(c, 960, 310, Math.PI, 1.5);
  arrow(c, [[610, 440], [610, 590]]);
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  const cx = 540, ty = 400, rx = 210, ry = 62, h = 300;
  shaking(c, cx, ty + h / 2, -0.1, () => tiffin(c, cx, ty, rx, ry, h, false));
  twoHands(c, cx - rx - 10, cx + rx + 10, ty + 170, 1.5);
  arrow(c, [[290, 360], [290, 180]]);
  arrow(c, [[790, 180], [790, 360]]);
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  // left: the dry box tipped out on a dark plate, rounded pieces and a heap of powder
  shadow(c, 250, 880, 205, 105);
  shape(c, () => ell(c, 235, 850, 200, 108), "#4a4658", 6);
  shape(c, () => ell(c, 235, 858, 165, 82), "#3a3540", 4);
  for (const [x, y, a] of [[150, 830, 0.2], [235, 805, 1.2], [320, 840, 0.7], [165, 895, 2], [320, 895, 0.4], [240, 880, 1.6]] as number[][]) chalk(c, x, y, 36, a, true);
  const pw = () => ell(c, 238, 862, 52, 22);
  shape(c, pw, "#f3efe4", 3); shade(c, pw, "#cfc8b6", 14, 5, 0.7);
  // right: the wet box poured through a strainer onto a dark plate; milky water on the plate
  shadow(c, 760, 950, 300, 80);
  shape(c, () => ell(c, 740, 880, 300, 112), "#4a4658", 6);
  shape(c, () => ell(c, 740, 888, 262, 88), "#3a3540", 4);
  shape(c, () => ell(c, 740, 905, 150, 44), "#f3efe4", 0);
  // the strainer: a steel rim, a mesh bowl, a handle
  const sx = 740, sy = 640, srx = 185, sry = 46, bowl = () => { c.moveTo(sx - srx, sy); c.quadraticCurveTo(sx - srx * 0.9, sy + 190, sx, sy + 190); c.quadraticCurveTo(sx + srx * 0.9, sy + 190, sx + srx, sy); c.closePath(); };
  thick(c, [[sx + srx - 8, sy + 6], [1030, sy - 70]], 22, COL.steel);
  shape(c, bowl, COL.steelIn);
  c.save(); c.beginPath(); bowl(); c.clip(); c.globalAlpha = 0.55;
  for (let i = -9; i <= 9; i++) line(c, [[sx + i * 22, sy], [sx + i * 22, sy + 200]], 2, COL.greyDk);
  for (let j = 1; j <= 8; j++) line(c, [[sx - srx, sy + j * 24], [sx + srx, sy + j * 24]], 2, COL.greyDk);
  c.globalAlpha = 1; c.restore();
  sh(c, bowl, COL.steelDk, 70, 0.55);
  shape(c, bowl, "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, sx, sy, srx, sry), "#e9edf2", 6);
  for (const [dx, dy, a] of [[-90, 4, 0.3], [0, -4, 1.1], [90, 6, 0.6]] as number[][]) chalk(c, sx + dx, sy + dy, 32, a, true);
  // drops falling from the mesh
  for (const dx of [-60, 10, 70]) { shape(c, () => ell(c, sx + dx, 838, 8, 12), "#f3efe4", 3); }
  // the wet box tipped over the strainer, milky water pouring
  c.save(); c.translate(790, 300); c.rotate(-1.9); c.translate(0, -85);
  tiffin(c, 0, -85 + 85, 130, 50, 170, true);
  c.restore();
  const wp = () => { c.moveTo(722, 442); c.quadraticCurveTo(700, 470, 704, 520); c.lineTo(706, sy - 8); c.lineTo(758, sy - 8); c.lineTo(756, 520); c.quadraticCurveTo(752, 470, 742, 440); c.closePath(); };
  shape(c, wp, "#f3efe4", 4);
  armHand(c, 960, 300, Math.PI, 1.5);
  arrow(c, [[560, 400], [560, 540]]);
};

export const su_planetEarthSoilAndCrops = cards("sci.planet-earth.soil-and-crops.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
