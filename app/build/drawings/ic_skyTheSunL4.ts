import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, rnd, ground, shape, ell, rrect, shadow, shade, line, shine, arrow, glass, person, write, cards } from "./flatKit";

// THE SUN UP CLOSE (sci.sky.the-sun.L4) · set-up cards for the three experiments, then the card
// pictures: the experiments, activities and project at a glance, a sunspot, a bar magnet, the aurora.

const DARK = "#2f3261", MILK = "#e9eef1", GLOW = "#fff6d8", ORANGE = "#f7a93c";
const rect = (c: Ctx, x: number, y: number, w: number, h: number) => { c.moveTo(x, y); c.lineTo(x + w, y); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.closePath(); };
const counter = (c: Ctx, y: number, col = "#e2d3b5") => { c.fillStyle = col; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 5); };

// a tall straight-sided clear jar, bottom centre (x, y), liquid up to fill of h. inside(body) draws what is in it
// (body is the jar's path, for clipping). front = how much the glass in front veils the liquid.
const jar = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, liquid: string, inside?: (body: () => void) => void, front = 0.18, surface = COL.drop) => {
  const body = () => rrect(c, x - w / 2, y - h, w, h, 36);
  shadow(c, x + w * 0.1, y + 8, w * 0.6, w * 0.1);
  shape(c, body, COL.glass, 0);
  const ly = y - h * fill;
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = liquid; c.fillRect(x - w / 2, ly, w, h * fill); c.restore();
  shape(c, () => ell(c, x, ly, w / 2 - 4, w * 0.07), surface, 0);
  if (inside) inside(body);
  c.save(); c.beginPath(); body(); c.clip(); c.globalAlpha = front; c.fillStyle = COL.sky; c.fillRect(x - w / 2, ly, w, h * fill); c.globalAlpha = 1; c.restore();
  shape(c, body, "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.09), "rgba(255,255,255,0.35)", 5);
  shine(c, [[x - w * 0.38, y - h * 0.85], [x - w * 0.36, y - h * 0.25]], 8);
};
// the white test card: a strip with centimetre marks and a black square at its bottom end, on a stick above
const cardStrip = (c: Ctx, x: number, top: number, bottom: number, w = 70, stick = 0) => {
  if (stick) shape(c, () => rrect(c, x - 9, top - stick, 18, stick + 50, 6), COL.wood, 5);
  shape(c, () => rect(c, x - w / 2, top, w, bottom - top), WHITE, 5);
  let k = 0;
  for (let yy = top + 24; yy < bottom - w - 10; yy += 22, k++) line(c, [[x - w / 2, yy], [x - w / 2 + (k % 5 === 0 ? 28 : 15), yy]], 3);
  shape(c, () => rect(c, x - w / 2 + 6, bottom - w + 6, w - 12, w - 12), COL.black, 4);
};
// milky water veiling what is below it: bands of white, denser with depth, clipped to the jar
const milkBands = (c: Ctx, body: () => void, x: number, w: number, from: number, bands: [number, number][]) => {
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = MILK;
  let y0 = from;
  for (const [y1, a] of bands) { c.globalAlpha = a; c.fillRect(x - w / 2, y0, w, y1 - y0); y0 = y1; }
  c.globalAlpha = 1; c.restore();
};
// a steel teaspoon: wrist end at (x0, y0), bowl at (x1, y1)
const spoon = (c: Ctx, x0: number, y0: number, x1: number, y1: number) => {
  const an = Math.atan2(y1 - y0, x1 - x0);
  line(c, [[x0, y0], [x1 - Math.cos(an) * 30, y1 - Math.sin(an) * 30]], 26, INK); line(c, [[x0, y0], [x1 - Math.cos(an) * 30, y1 - Math.sin(an) * 30]], 15, COL.steel);
  shape(c, () => ell(c, x1, y1, 44, 28, an), COL.steel, 5); shape(c, () => ell(c, x1, y1, 30, 16, an), COL.steelDk, 0);
};
// a torch seen from the side, lens face at (x, y), pointing along an; slit = two black cards taped over the lens
const torchSide = (c: Ctx, x: number, y: number, len: number, an: number, slit = false, lens = COL.yellow) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -len, -34, len - 60, 68, 20), COL.greyDk); shade(c, () => rrect(c, -len, -34, len - 60, 68, 20), COL.black, 0, 18, 0.35);
  shape(c, () => rrect(c, -40, -18, 30, 36, 8), RED, 4);
  shape(c, () => rrect(c, -72, -50, 72, 100, 14), COL.steel); shade(c, () => rrect(c, -72, -50, 72, 100, 14), COL.steelDk, 0, 22, 0.5);
  shape(c, () => rect(c, -8, -42, 10, 84), lens, 3);
  if (slit) { shape(c, () => rrect(c, 2, -62, 12, 54, 3), COL.black, 3); shape(c, () => rrect(c, 2, 8, 12, 54, 3), COL.black, 3); }
  c.restore();
};
// a torch standing on its tail, lens face up at (x, top)
const torchUp = (c: Ctx, x: number, top: number, w: number, h: number) => {
  shape(c, () => rrect(c, x - w * 0.3, top + 40, w * 0.6, h - 40, 22), COL.greyDk); shade(c, () => rrect(c, x - w * 0.3, top + 40, w * 0.6, h - 40, 22), COL.black, 20, 0, 0.35);
  shape(c, () => rrect(c, x - 16, top + 110, 32, 50, 8), RED, 4);
  shape(c, () => rrect(c, x - w / 2, top, w, 66, 14), COL.steel); shade(c, () => rrect(c, x - w / 2, top, w, 66, 14), COL.steelDk, 24, 0, 0.5);
};
// a stopwatch held facing the viewer, centre (x, y)
const stopwatch = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => rrect(c, x - r * 0.2, y - r - 20, r * 0.4, 26, 6), COL.greyDk, 4);
  shape(c, () => ell(c, x, y, r, r), COL.steel); shape(c, () => ell(c, x, y, r * 0.76, r * 0.76), WHITE, 4);
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62], [x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7]], 3); }
  line(c, [[x, y], [x + Math.cos(-0.7) * r * 0.6, y + Math.sin(-0.7) * r * 0.6]], 5, RED); shape(c, () => ell(c, x, y, 6, 6), INK, 0);
};
// small blue gas flames standing on points pts, height s
const flames = (c: Ctx, pts: number[][], s: number) => pts.forEach(([x, y]) => {
  shape(c, () => { c.moveTo(x - s * 0.45, y); c.quadraticCurveTo(x - s * 0.15, y - s * 0.6, x, y - s); c.quadraticCurveTo(x + s * 0.15, y - s * 0.6, x + s * 0.45, y); c.closePath(); }, "#5fa8ff", 3);
  shape(c, () => { c.moveTo(x - s * 0.2, y); c.quadraticCurveTo(x - s * 0.05, y - s * 0.3, x, y - s * 0.5); c.quadraticCurveTo(x + s * 0.05, y - s * 0.3, x + s * 0.2, y); c.closePath(); }, "#c8e8ff", 0);
});
// pepper specks spread evenly inside an ellipse
const pepper = (c: Ctx, x: number, y: number, rx: number, ry: number, step: number, seed: number) => {
  const r = rnd(seed);
  for (let gx = -rx; gx <= rx; gx += step) for (let gy = -ry; gy <= ry; gy += step) {
    const px = gx + (r() - 0.5) * step * 0.7, py = gy + (r() - 0.5) * step * 0.7;
    if ((px / rx) ** 2 + (py / ry) ** 2 < 0.9) shape(c, () => ell(c, x + px, y + py, 4.5, 3.5, r() * 3), INK, 0);
  }
};
const steam = (c: Ctx, x: number, y: number) => { c.globalAlpha = 0.6; for (const dx of [-50, 0, 50]) line(c, [[x + dx, y], [x + dx - 14, y - 40], [x + dx + 14, y - 80], [x + dx, y - 120]], 7, WHITE); c.globalAlpha = 1; };
// a pan seen from the front and a little above: rim ellipse centre (x, y), wall `wall` deep, water inside with pepper
const panFront = (c: Ctx, x: number, y: number, rx: number, ry: number, wall: number, seed: number) => {
  const wallP = () => { c.moveTo(x + rx, y); c.lineTo(x + rx, y + wall); c.ellipse(x, y + wall, rx, ry, 0, 0, Math.PI, false); c.lineTo(x - rx, y); c.ellipse(x, y, rx, ry, 0, Math.PI, 0, true); c.closePath(); };
  shape(c, wallP, COL.steelDk); shade(c, wallP, COL.greyDk, rx * 0.4, 0, 0.35);
  shape(c, () => ell(c, x, y, rx, ry), COL.steel);
  shape(c, () => ell(c, x, y + ry * 0.03, rx * 0.9, ry * 0.86), COL.steelIn, 4);
  shape(c, () => ell(c, x, y + ry * 0.05, rx * 0.87, ry * 0.8), COL.water, 0);
  pepper(c, x, y + ry * 0.05, rx * 0.84, ry * 0.76, 42, seed);
};
const handle = (c: Ctx, x: number, y: number, len: number, an: number) => { c.save(); c.translate(x, y); c.rotate(an); shape(c, () => rrect(c, 0, -22, len, 44, 14), COL.black); c.restore(); };
// a CD, centre (x, y), tilted: a silver disc with a rainbow fan on the side facing the light (at angle lightAn)
const cd = (c: Ctx, x: number, y: number, rx: number, ry: number, rot: number, lightAn: number) => {
  const disc = () => ell(c, x, y, rx, ry, rot);
  shape(c, disc, "#d9dde8");
  c.save(); c.beginPath(); disc(); c.clip(); c.translate(x, y); c.rotate(rot); c.scale(rx, ry);
  const cols = ["#e4523b", "#f39a3c", "#ffd34d", "#6aa53f", "#3fb1a8", "#5b8fd6", "#8b6cc9"];
  cols.forEach((col, i) => { const a0 = lightAn - rot - 0.75 + i * 0.215; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 1.1, a0, a0 + 0.23); c.closePath(); c.fillStyle = col; c.globalAlpha = 0.8; c.fill(); });
  c.restore(); c.globalAlpha = 1;
  shape(c, () => ell(c, x, y, rx * 0.36, ry * 0.36, rot), "#c3c9d6", 4); shape(c, () => ell(c, x, y, rx * 0.15, ry * 0.15, rot), BG, 4);
};
// the Sun as a spacecraft shows it: an orange disc with dark spots and bright loops at the rim
const sunDisc = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r * 1.12, r * 1.12), "rgba(255,200,90,0.3)", 0);
  shape(c, () => ell(c, x, y, r, r), ORANGE); shade(c, () => ell(c, x, y, r, r), "#e07f1f", r * 0.18, r * 0.14, 0.45);
  for (const [sx, sy, sr] of [[-0.35, -0.2, 0.11], [-0.18, -0.12, 0.07], [0.3, 0.25, 0.09], [0.42, 0.18, 0.05]]) { shape(c, () => ell(c, x + sx * r, y + sy * r, sr * r * 1.7, sr * r * 1.4), "#9a5a24", 0); shape(c, () => ell(c, x + sx * r, y + sy * r, sr * r, sr * r * 0.85), "#3a2418", 0); }
  for (const a of [-0.9, 2.4]) { const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r; c.beginPath(); c.ellipse(px, py, r * 0.2, r * 0.13, a + Math.PI / 2, Math.PI, Math.PI * 2); c.strokeStyle = "#ffb27a"; c.lineWidth = 7; c.stroke(); }
};
const phone = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 16, y + h / 2 + 10, w * 0.5, 18);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 40), COL.black);
  shape(c, () => rrect(c, x - w / 2 + 16, y - h / 2 + 50, w - 32, h - 100, 14), "#141a3c", 4);
  shape(c, () => ell(c, x, y - h / 2 + 26, 7, 7), COL.greyDk, 0); shape(c, () => rrect(c, x - 40, y + h / 2 - 30, 80, 8, 4), COL.greyDk, 0);
};
const pencil = (c: Ctx, x: number, y: number, len: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -14, len - 40, 28, 4), COL.yellow); shape(c, () => { c.moveTo(len - 40, -14); c.lineTo(len, 0); c.lineTo(len - 40, 14); c.closePath(); }, COL.wood, 4);
  shape(c, () => { c.moveTo(len - 14, -5); c.lineTo(len, 0); c.lineTo(len - 14, 5); c.closePath(); }, INK, 0);
  shape(c, () => rrect(c, -30, -14, 30, 28, 4), COL.pink, 4); shape(c, () => rect(c, -4, -14, 10, 28), COL.steelDk, 3);
  c.restore();
};
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 12, y + h + 6, w * 0.5, 14); shape(c, () => rect(c, x, y, w, h), COL.paper, 5); };
// a small blue Earth with green land, centre (x, y)
const earth = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.blue);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip();
  shape(c, () => ell(c, x - r * 0.3, y - r * 0.25, r * 0.42, r * 0.3, 0.6), COL.green, 0); shape(c, () => ell(c, x + r * 0.35, y + r * 0.3, r * 0.3, r * 0.42, -0.4), COL.green, 0);
  c.restore();
};

// ------------------------------------------------------------------ set-up cards
// e1.0 the black patch at the bottom of clear water, plain to see
const e1s0 = (c: Ctx) => {
  ground(c); counter(c, 930);
  jar(c, 540, 920, 380, 620, 0.9, "rgba(143,195,234,0.45)", () => cardStrip(c, 540, 230, 892, 70, 150), 0.12);
};
// e1.1 a spoon stirs in milk; the water clouds and the card fades out of sight
const e1s1 = (c: Ctx) => {
  ground(c); counter(c, 930);
  jar(c, 460, 920, 380, 620, 0.9, MILK, (body) => {
    cardStrip(c, 430, 230, 740, 70, 150);
    spoon(c, 790, 250, 540, 620);
    c.globalAlpha = 0.7; line(c, [[480, 560], [540, 540], [600, 560]], 6, WHITE); line(c, [[470, 680], [540, 700], [610, 680]], 6, WHITE); c.globalAlpha = 1;
    milkBands(c, body, 460, 380, 362, [[470, 0.3], [590, 0.62], [920, 0.92]]);
  }, 0.04, MILK);
  glass(c, 880, 920, 150, 190, 0.6, "#f3f1ea");
};
// e1.2 the dark room: the jar stands on a torch lying face up and glows, bright below, faint above
const e1s2 = (c: Ctx) => {
  ground(c, DARK); c.fillStyle = "#3a3d6e"; c.fillRect(0, 950, D, D - 950);
  shape(c, () => ell(c, 540, 700, 360, 150), "rgba(255,240,200,0.22)", 0);
  torchUp(c, 540, 650, 230, 300);
  jar(c, 540, 650, 340, 560, 0.9, "#cfd7dd", (body) => {
    c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = GLOW;
    [0.95, 0.78, 0.6, 0.42, 0.26, 0.12].forEach((a, i) => { c.globalAlpha = a; c.fillRect(370, 650 - (i + 1) * 90, 340, 90); });
    c.globalAlpha = 1; c.restore();
    shape(c, () => ell(c, 540, 630, 140, 36), WHITE, 0);
  }, 0.03, "#dde3e8");
};
// e2.0 the pan on a low flame, pepper sprinkled evenly, seen from above
const e2s0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 90, 600, 900, 320, 30), "#4d5461"); shade(c, () => rrect(c, 90, 600, 900, 320, 30), COL.black, 0, 40, 0.35);
  for (const kx of [230, 850]) shape(c, () => ell(c, kx, 880, 28, 20), COL.greyDk, 4);
  shape(c, () => ell(c, 540, 790, 345, 78), "#2f343c", 5);
  flames(c, Array.from({ length: 9 }, (_, i) => { const a = Math.PI * 0.12 + (i / 8) * Math.PI * 0.76; return [540 + Math.cos(a) * 320, 790 + Math.sin(a) * 66 + 14]; }), 48);
  panFront(c, 540, 520, 380, 230, 62, 3);
  handle(c, 905, 505, 140, -0.35);
};
// e2.1 the child watches from an arm's length away, stopwatch in hand; the grown-up's pan steams on the stove
const e2s1 = (c: Ctx) => {
  ground(c); counter(c, 940, "#d9c9a8");
  // the counter with the stove on it, at the right
  shape(c, () => rect(c, 610, 640, 470, 300), COL.wood, 5); shade(c, () => rect(c, 610, 640, 470, 300), COL.woodDk, 0, 60, 0.4);
  shape(c, () => rrect(c, 620, 596, 400, 50, 10), "#4d5461");
  flames(c, [[760, 596], [800, 596], [840, 596]], 30);
  panFront(c, 800, 490, 150, 30, 84, 5);
  handle(c, 946, 495, 100, -0.15);
  steam(c, 800, 440);
  // the child, feet on the floor, looking at the pan
  const h = person(c, 330, 940, 640, { reachR: [470, 655], dir: 1 });
  stopwatch(c, h.handR[0] + 10, h.handR[1] - 36, 44);
};
// e2.2 the pan from straight above with arrows: specks come up in the middle and travel out to the edge, where they sink
const e2s2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 600, 410, 400);
  shape(c, () => ell(c, 540, 560, 400, 400), COL.steel); shape(c, () => ell(c, 540, 560, 362, 362), COL.steelIn, 4); shape(c, () => ell(c, 540, 560, 348, 348), COL.water, 0);
  handle(c, 936, 560, 118, 0);
  pepper(c, 540, 560, 340, 340, 46, 8); pepper(c, 540, 560, 80, 80, 26, 9);
  shape(c, () => ell(c, 540, 560, 96, 96), "rgba(0,0,0,0)", 0);
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2 + Math.PI / 8; arrow(c, [[540 + Math.cos(a) * 118, 560 + Math.sin(a) * 118], [540 + Math.cos(a) * 296, 560 + Math.sin(a) * 296]], RED, 11); }
};
// e3.0 two black cards taped over the torch's face, a thin slit of light between them
const e3s0 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 300, 40);
  shape(c, () => rrect(c, 455, 560, 170, 370, 30), COL.greyDk); shade(c, () => rrect(c, 455, 560, 170, 370, 30), COL.black, 30, 0, 0.35);
  shape(c, () => ell(c, 540, 430, 250, 250), COL.steel); shade(c, () => ell(c, 540, 430, 250, 250), COL.steelDk, 40, 30, 0.45);
  shape(c, () => ell(c, 540, 430, 212, 212), COL.steelDk, 4); shape(c, () => ell(c, 540, 430, 190, 190), "#fff1b0", 4);
  shape(c, () => rect(c, 282, 220, 250, 420), COL.black); shape(c, () => rect(c, 548, 220, 250, 420), COL.black);
  c.fillStyle = "#fffbe0"; c.fillRect(532, 240, 16, 380); c.globalAlpha = 0.35; c.fillRect(524, 240, 32, 380); c.globalAlpha = 1;
  for (const [tx, ty, tw, th] of [[300, 236, 480, 44], [300, 580, 480, 44], [250, 400, 70, 44], [760, 400, 70, 44]]) shape(c, () => rrect(c, tx, ty, tw, th, 6), "rgba(255,230,160,0.75)", 3);
};
// e3.1 in the dark, the child holds the CD at a slant in the slit's beam and looks at the colours on it
const e3s1 = (c: Ctx) => {
  ground(c, DARK); c.fillStyle = "#3a3d6e"; c.fillRect(0, 960, D, D - 960);
  // a stool with the torch lying on it, two black cards over its face, pointing at the child
  shape(c, () => rrect(c, 70, 650, 320, 30, 8), COL.wood, 5); for (const lx of [100, 340]) shape(c, () => rect(c, lx, 680, 22, 280), COL.woodDk, 4);
  torchSide(c, 320, 616, 240, 0, true);
  const h = person(c, 740, 960, 640, { reachL: [560, 540], dir: -1 });
  const cx = h.handL[0] - 72, cy = h.handL[1] - 92;
  c.globalAlpha = 0.85; line(c, [[334, 616], [cx + 20, cy + 30]], 7, "#fffbe0"); c.globalAlpha = 1;
  cd(c, cx, cy, 108, 134, 0.35, Math.atan2(616 - cy, 334 - cx));
  c.globalAlpha = 0.5; shape(c, () => ell(c, cx + 20, cy + 30, 34, 44, 0.35), "#fffbe0", 0); c.globalAlpha = 1;
};
// e3.2 the three bands drawn side by side: the white torch, the candle, the red torch
const e3s2 = (c: Ctx) => {
  ground(c);
  const sheet = (x: number, bands: [string, number][]) => {
    paper(c, x - 140, 300, 280, 560);
    let y = 420; const bx = x - 60, bw = 120;
    shape(c, () => rect(c, bx, 420, bw, 380), "#2a2a33", 0);
    for (const [col, hh] of bands) { c.fillStyle = col; c.fillRect(bx, y, bw, hh); y += hh; }
    shape(c, () => rect(c, bx, 420, bw, 380), "rgba(0,0,0,0)", 5);
  };
  const rainbow: [string, number][] = [["#e4523b", 54], ["#f39a3c", 54], ["#ffd34d", 54], ["#6aa53f", 54], ["#3fb1a8", 54], ["#5b8fd6", 56], ["#8b6cc9", 54]];
  sheet(200, rainbow);
  sheet(540, [["#e4523b", 90], ["#f39a3c", 90], ["#ffd34d", 80], ["#8aa84a", 30]]);
  sheet(880, [["#e4523b", 70]]);
  // what made each band: a torch, a candle, a torch with red film
  torchSide(c, 200, 262, 170, -Math.PI / 2);
  shape(c, () => rrect(c, 515, 150, 50, 110, 8), COL.cloth, 5); shape(c, () => { c.moveTo(540, 150); c.lineTo(540, 100); }, WHITE, 3);
  shape(c, () => { c.moveTo(540, 60); c.quadraticCurveTo(575, 110, 540, 148); c.quadraticCurveTo(505, 110, 540, 60); c.closePath(); }, COL.orange, 4); shape(c, () => ell(c, 540, 125, 9, 16), COL.yellow, 0);
  torchSide(c, 880, 262, 170, -Math.PI / 2, false, RED);
};

// ------------------------------------------------------------------ card pictures
// flow.e1 Glowing Fog: the milky jar with the card sinking out of sight, the milk and spoon, the torch ready
const fe1 = (c: Ctx) => {
  ground(c); counter(c, 930);
  jar(c, 400, 920, 360, 600, 0.9, MILK, (body) => { cardStrip(c, 400, 250, 760, 70, 140); milkBands(c, body, 400, 360, 380, [[500, 0.3], [620, 0.62], [920, 0.92]]); }, 0.04, MILK);
  glass(c, 800, 740, 150, 190, 0.6, "#f3f1ea"); spoon(c, 905, 520, 790, 650);
  torchSide(c, 1010, 880, 320, 0);
};
// flow.e2 the Boiling Pot: a cut-open pan, water loops up in the middle, out along the top, down at the sides
const fe2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 160, 760, 760, 90, 20), "#4d5461"); shape(c, () => ell(c, 540, 760, 230, 22), "#2f343c", 4);
  flames(c, [[400, 756], [470, 756], [540, 756], [610, 756], [680, 756]], 56);
  shape(c, () => { c.moveTo(230, 400); c.lineTo(850, 400); c.lineTo(850, 700); c.quadraticCurveTo(850, 724, 826, 724); c.lineTo(254, 724); c.quadraticCurveTo(230, 724, 230, 700); c.closePath(); }, COL.steelDk);
  shape(c, () => rect(c, 254, 420, 572, 290), COL.water, 0);
  shape(c, () => ell(c, 540, 420, 286, 14), COL.drop, 0);
  steam(c, 540, 380);
  arrow(c, [[540, 690], [540, 470]], RED, 11);
  arrow(c, [[500, 445], [310, 445]], RED, 11); arrow(c, [[580, 445], [770, 445]], RED, 11);
  arrow(c, [[290, 480], [290, 680]], RED, 11); arrow(c, [[790, 480], [790, 680]], RED, 11);
  arrow(c, [[330, 696], [490, 696]], RED, 11); arrow(c, [[750, 696], [590, 696]], RED, 11);
  const r = rnd(4); for (let i = 0; i < 40; i++) shape(c, () => ell(c, 270 + r() * 540, 430 + r() * 270, 4.5, 3.5, r() * 3), INK, 0);
  shape(c, () => rect(c, 230, 400, 620, 20), COL.steel, 5);
};
// flow.e3 the Sun's Barcode: the slit torch throws a thin line of light on a tilted CD, which fans it into colours
const fe3 = (c: Ctx) => {
  ground(c); counter(c, 900);
  shape(c, () => rrect(c, 60, 640, 300, 26, 8), COL.wood, 5);
  torchSide(c, 300, 606, 240, 0, true);
  c.globalAlpha = 0.85; line(c, [[314, 606], [690, 540]], 8, "#fff1b0"); c.globalAlpha = 1;
  cd(c, 700, 520, 230, 270, 0.3, Math.atan2(606 - 520, 314 - 700));
  shape(c, () => rrect(c, 560, 880, 300, 26, 8), COL.wood, 5); shape(c, () => rect(c, 680, 790, 44, 90), COL.steelDk, 4);
};
// flow.a1 the Sun in pictures: a phone shows the spacecraft Sun, paper and pencil wait beside it
const fa1 = (c: Ctx) => {
  ground(c);
  paper(c, 560, 260, 400, 560); pencil(c, 640, 760, 290, -0.9);
  phone(c, 400, 540, 440, 820);
  sunDisc(c, 400, 540, 160);
};
// flow.a2 Spin the Orange: three spots on an orange held on a pencil, a lamp lighting it, turning to the left
const fa2 = (c: Ctx) => {
  ground(c); counter(c, 940);
  // the lamp behind and to the right, pointing at the orange
  shape(c, () => ell(c, 880, 920, 110, 24), COL.steelDk); shape(c, () => rect(c, 866, 560, 28, 360), COL.steelDk, 5);
  c.save(); c.translate(880, 560); c.rotate(0.6);
  shape(c, () => { c.moveTo(-70, -60); c.lineTo(70, -60); c.lineTo(120, 90); c.lineTo(-120, 90); c.closePath(); }, COL.teal); shade(c, () => { c.moveTo(-70, -60); c.lineTo(70, -60); c.lineTo(120, 90); c.lineTo(-120, 90); c.closePath(); }, COL.tealDk, 40, 0, 0.4);
  shape(c, () => ell(c, 0, 90, 120, 26), COL.yellow, 5);
  c.restore();
  c.globalAlpha = 0.28; shape(c, () => { c.moveTo(800, 660); c.lineTo(260, 380); c.lineTo(260, 760); c.closePath(); }, COL.yellow, 0); c.globalAlpha = 1;
  // the orange on its pencil
  pencil(c, 470, 920, 560, -Math.PI / 2);
  shape(c, () => ell(c, 470, 560, 230, 230), COL.orange); shade(c, () => ell(c, 470, 560, 230, 230), "#d27c25", 40, 30, 0.4);
  const r = rnd(2); for (let i = 0; i < 60; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 200; shape(c, () => ell(c, 470 + Math.cos(a) * d, 560 + Math.sin(a) * d, 3, 3), "#d27c25", 0); }
  for (const [sx, sy, rx] of [[470, 560, 34], [600, 440, 26], [340, 680, 26]]) shape(c, () => ell(c, sx, sy, rx, rx * 0.95), RED, 4);
  arrow(c, [[690, 380], [540, 290], [360, 300]], RED, 10);
};
// flow.a3 a Stream Past a Stone: the tray tilted on a book, water with turmeric bends round the katori, calm behind it
const fa3 = (c: Ctx) => {
  ground(c); counter(c, 850, "#d9c9a8");
  shape(c, () => rect(c, 100, 772, 240, 78), COL.blueDk, 5); shape(c, () => rect(c, 100, 790, 240, 44), COL.paper, 3);
  c.save(); c.translate(540, 600); c.rotate(0.09);
  shape(c, () => rrect(c, -430, -210, 860, 420, 26), COL.steel); shape(c, () => rrect(c, -400, -180, 800, 360, 18), COL.water, 5);
  const stream = (pts: number[][]) => line(c, pts, 8, "#e9b534");
  stream([[-380, -120], [-100, -120], [60, -120], [380, -120]]); stream([[-380, 120], [-100, 120], [60, 120], [380, 120]]);
  stream([[-380, -45], [-150, -45], [-70, -110], [60, -115], [180, -80], [380, -60]]);
  stream([[-380, 45], [-150, 45], [-70, 110], [60, 115], [180, 80], [380, 60]]);
  stream([[-380, 0], [-170, 0], [-110, -70], [-30, -98]]); stream([[-380, 0], [-170, 0], [-110, 70], [-30, 98]]);
  // the katori upside down in the middle
  shadow(c, 14, 20, 84, 70); shape(c, () => ell(c, 0, 0, 78, 78), COL.steel); shade(c, () => ell(c, 0, 0, 78, 78), COL.steelDk, 24, 18, 0.5); shape(c, () => ell(c, 0, 0, 30, 30), COL.steelIn, 3);
  c.restore();
  // the jug tipped over above the high end, its spout the lowest point, water falling from it on to the tray
  c.save(); c.translate(330, 235); c.rotate(-1.1);
  const jugBody = () => rrect(c, -70, -90, 140, 190, 26);
  shape(c, jugBody, COL.teal); shade(c, jugBody, COL.tealDk, 30, 0, 0.4);
  shape(c, () => { c.moveTo(-70, -90); c.lineTo(-104, -112); c.lineTo(-62, -58); c.closePath(); }, COL.teal, 5);
  shape(c, () => { c.moveTo(70, -50); c.quadraticCurveTo(140, -40, 130, 40); c.quadraticCurveTo(122, 70, 70, 60); c.lineTo(70, 36); c.quadraticCurveTo(108, 44, 108, 20); c.quadraticCurveTo(110, -20, 70, -26); c.closePath(); }, COL.tealDk, 5);
  c.restore();
  line(c, [[190, 275], [196, 380], [206, 470]], 26, INK); line(c, [[190, 275], [196, 380], [206, 470]], 16, COL.waterDk);
  shape(c, () => ell(c, 212, 478, 34, 12), COL.drop, 3);
  // the bowl catching the water at the low end
  shape(c, () => { c.moveTo(900, 830); c.bezierCurveTo(910, 940, 1050, 940, 1060, 830); c.closePath(); }, COL.steel); shape(c, () => ell(c, 980, 830, 80, 18), COL.water, 5);
};
// flow.p1 the Sunspot Diary: five circles, one a day, the spot a little further across each time, a ruler to measure
const fp1 = (c: Ctx) => {
  ground(c);
  for (let i = 0; i < 5; i++) {
    const x = 110 + i * 215, y = 420;
    paper(c, x - 92, 250, 184, 330);
    shape(c, () => ell(c, x, y, 76, 76), WHITE, 5); line(c, [[x, y - 76], [x, y + 76]], 3, COL.greyDk);
    shape(c, () => ell(c, x - 56 + i * 28, y - 12, 10, 8), INK, 0);
    write(c, String(i + 1), x - 12, 505, 50, INK, 6);
  }
  shadow(c, 560, 830, 430, 20);
  shape(c, () => rect(c, 130, 700, 860, 100), COL.wood); c.fillStyle = COL.woodDk; c.fillRect(133, 780, 854, 17);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let mm = 0; mm <= 70; mm++) { const x = 220 + mm * 10.4, hh = mm % 10 === 0 ? 34 : mm % 5 === 0 ? 24 : 13; c.lineWidth = mm % 10 === 0 ? 4 : 2.5; c.beginPath(); c.moveTo(x, 700); c.lineTo(x, 700 + hh); c.stroke(); }
  for (let cm = 0; cm <= 7; cm++) write(c, String(cm), 220 + cm * 104 - 10, 742, 30, INK, 5);
  arrow(c, [[220, 650], [640, 650]], RED, 8);
};
// term.9 Sunspot: a dark spot on the grainy surface, a lighter ring round it, a small Earth beside it for size
const tSunspot = (c: Ctx) => {
  ground(c, "#d67d24");
  const r = rnd(5);
  for (let i = 0; i < 230; i++) { const x = r() * D, y = r() * D, rr = 26 + r() * 30; shape(c, () => ell(c, x, y, rr, rr * 0.8, r() * 3), i % 3 ? "#f6a83a" : "#ffc45c", 4); }
  shape(c, () => ell(c, 500, 500, 320, 265), "#a35f22", 5);
  c.save(); c.beginPath(); ell(c, 500, 500, 320, 265); c.clip();
  for (let k = 0; k < 40; k++) { const a = (k / 40) * Math.PI * 2; line(c, [[500 + Math.cos(a) * 180, 500 + Math.sin(a) * 150], [500 + Math.cos(a) * 325, 500 + Math.sin(a) * 270]], 5, "#7a4218"); }
  c.restore();
  shape(c, () => ell(c, 500, 500, 190, 155), "#3a2418", 5);
  earth(c, 880, 840, 62);
};
// term.10 Magnetic field: a bar magnet with curved lines running from one end round to the other
const tMagnet = (c: Ctx) => {
  ground(c);
  for (let k = 1; k <= 4; k++) {
    const dy = 95 * k + 40, dx = 70 * k + 40;
    for (const s of [-1, 1]) {
      c.beginPath(); c.moveTo(760, 560 - s * 30); c.bezierCurveTo(760 + dx, 560 - s * dy, 320 - dx, 560 - s * dy, 320, 560 - s * 30); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
      const mx = 540, my = 560 - s * (dy * 0.75 + 22);
      arrow(c, [[mx - 30, my], [mx + 30, my]], INK, 5);
    }
  }
  shadow(c, 560, 650, 240, 24);
  shape(c, () => rect(c, 320, 495, 220, 130), RED); shape(c, () => rect(c, 540, 495, 220, 130), COL.blue);
  shade(c, () => rect(c, 320, 495, 440, 130), INK, 0, 90, 0.25);
  line(c, [[400, 590], [400, 530], [460, 590], [460, 530]], 9, WHITE);
  c.beginPath(); c.moveTo(680, 536); c.bezierCurveTo(610, 510, 610, 560, 650, 560); c.bezierCurveTo(690, 560, 690, 610, 620, 584); c.strokeStyle = WHITE; c.lineWidth = 9; c.lineCap = "round"; c.stroke();
};
// term.15 Aurora: green and red curtains of light above snowy mountains at night
const tAurora = (c: Ctx) => {
  ground(c, "#141a3c");
  const r = rnd(6); for (let i = 0; i < 70; i++) shape(c, () => ell(c, r() * D, r() * 600, 2.5, 2.5), WHITE, 0);
  const curtain = (x0: number, w: number, top: number, bottom: number, col: string, a: number) => {
    c.globalAlpha = a; shape(c, () => { c.moveTo(x0, bottom); c.bezierCurveTo(x0 - 40, bottom - 200, x0 + 60, top + 150, x0 + 30, top); c.lineTo(x0 + 30 + w, top + 20); c.bezierCurveTo(x0 + 60 + w, top + 170, x0 - 40 + w, bottom - 180, x0 + w, bottom + 10); c.closePath(); }, col, 0); c.globalAlpha = 1;
  };
  for (let i = 0; i < 6; i++) { const x = 60 + i * 170; curtain(x, 110, 90 + (i % 2) * 40, 560 + (i % 3) * 30, "#e8647a", 0.55); curtain(x + 10, 90, 260 + (i % 2) * 30, 600 + (i % 3) * 30, "#5be38a", 0.7); }
  shape(c, () => { c.moveTo(0, 760); c.lineTo(180, 520); c.lineTo(330, 700); c.lineTo(520, 440); c.lineTo(720, 690); c.lineTo(880, 560); c.lineTo(1080, 740); c.lineTo(1080, 1080); c.lineTo(0, 1080); c.closePath(); }, "#eef4fb", 6);
  shade(c, () => { c.moveTo(0, 760); c.lineTo(180, 520); c.lineTo(330, 700); c.lineTo(520, 440); c.lineTo(720, 690); c.lineTo(880, 560); c.lineTo(1080, 740); c.lineTo(1080, 1080); c.lineTo(0, 1080); c.closePath(); }, "#9fb8d8", 60, 40, 0.5);
  shape(c, () => { c.moveTo(0, 880); c.quadraticCurveTo(540, 820, 1080, 880); c.lineTo(1080, 1080); c.lineTo(0, 1080); c.closePath(); }, "#f6f9fd", 5);
};

export const ic_skyTheSunL4 = cards("sci.sky.the-sun.L4", [e1s0, e1s1, e1s2, e2s0, e2s1, e2s2, e3s0, e3s1, e3s2, fe1, fe2, fe3, fa1, fa2, fa3, fp1, tSunspot, tMagnet, tAurora]);
