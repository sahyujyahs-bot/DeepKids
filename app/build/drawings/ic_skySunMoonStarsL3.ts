import type { Ctx } from "./core";
import { INK, BG, COL, WHITE, RED, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, hand, write, cards } from "./flatKit";

// sci.sky.sun-moon-stars.L3 cards
const NIGHT = "#26224f";
const stars = (c: Ctx, seed: number, n: number, keep: (x: number, y: number) => boolean = () => true) => {
  const r = rnd(seed);
  for (let i = 0; i < n; i++) { const x = 30 + r() * 1020, y = 30 + r() * 1020, s = 2 + r() * 3; if (!keep(x, y)) continue; c.beginPath(); ell(c, x, y, s, s); c.fillStyle = "#fff6d6"; c.fill(); }
};
const night = (c: Ctx, seed = 3, n = 60, keep?: (x: number, y: number) => boolean) => { ground(c, NIGHT); stars(c, seed, n, keep); };
const rect = (c: Ctx, x: number, y: number, w: number, h: number) => { c.moveTo(x, y); c.lineTo(x + w, y); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.closePath(); };
const dash = (c: Ctx, pts: number[][], w = 5, col = "rgba(255,246,214,0.55)") => { c.save(); c.setLineDash([16, 14]); line(c, pts, w, col); c.restore(); };
const ring = (c: Ctx, x: number, y: number, r: number, col = "rgba(255,246,214,0.5)", w = 4) => { c.save(); c.setLineDash([14, 12]); c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = col; c.lineWidth = w; c.stroke(); c.restore(); };

const sun = (c: Ctx, x: number, y: number, r: number, col: string = COL.yellow, ray: string = COL.orange) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, b = 0.13; shape(c, () => polyP(c, [[x + Math.cos(a - b) * r * 1.05, y + Math.sin(a - b) * r * 1.05], [x + Math.cos(a) * r * 1.5, y + Math.sin(a) * r * 1.5], [x + Math.cos(a + b) * r * 1.05, y + Math.sin(a + b) * r * 1.05]]), ray, Math.max(3, r * 0.05)); }
  shape(c, () => ell(c, x, y, r, r), col, Math.max(4, r * 0.06));
  shade(c, () => ell(c, x, y, r, r), ray, r * 0.25, r * 0.25, 0.45);
  shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", Math.max(4, r * 0.06));
};

// a ball with a shade side; detail drawn inside it by `inner`
const ball = (c: Ctx, x: number, y: number, r: number, col: string, dk: string, inner?: () => void) => {
  const lw = Math.max(3, r * 0.07), body = () => ell(c, x, y, r, r);
  shape(c, body, col, lw);
  c.save(); c.beginPath(); body(); c.clip();
  if (inner) inner();
  c.restore();
  shade(c, body, dk, r * 0.3, r * 0.25, 0.55);
  shape(c, body, "rgba(0,0,0,0)", lw);
};
const crater = (c: Ctx, x: number, y: number, r: number, dk: string) => shape(c, () => ell(c, x, y, r, r * 0.75), dk, Math.max(2, r * 0.18));
type PName = "mercury" | "venus" | "earth" | "mars" | "jupiter" | "saturn" | "uranus" | "neptune";
const planet = (c: Ctx, name: PName, x: number, y: number, r: number) => {
  const lw = Math.max(3, r * 0.07);
  if (name === "mercury") ball(c, x, y, r, "#b3aea6", "#7d7870", () => { crater(c, x - r * 0.35, y - r * 0.25, r * 0.22, "#8f8a82"); crater(c, x + r * 0.3, y + r * 0.2, r * 0.3, "#8f8a82"); crater(c, x - r * 0.1, y + r * 0.55, r * 0.15, "#8f8a82"); });
  if (name === "venus") ball(c, x, y, r, "#f2cf8a", "#d9a45a", () => { for (const k of [-0.5, -0.1, 0.3, 0.65]) { c.beginPath(); c.moveTo(x - r, y + r * k); c.quadraticCurveTo(x - r * 0.3, y + r * (k - 0.25), x + r * 0.2, y + r * k); c.quadraticCurveTo(x + r * 0.6, y + r * (k + 0.2), x + r, y + r * (k - 0.05)); c.strokeStyle = "rgba(255,248,225,0.8)"; c.lineWidth = Math.max(3, r * 0.1); c.stroke(); } });
  if (name === "earth") ball(c, x, y, r, COL.blue, COL.blueDk, () => {
    shape(c, () => { c.moveTo(x - r * 0.75, y - r * 0.2); c.quadraticCurveTo(x - r * 0.3, y - r * 0.85, x + r * 0.1, y - r * 0.3); c.quadraticCurveTo(x - r * 0.1, y + r * 0.2, x - r * 0.4, y + r * 0.45); c.closePath(); }, COL.green, lw * 0.7);
    shape(c, () => { c.moveTo(x + r * 0.3, y + r * 0.1); c.quadraticCurveTo(x + r * 0.95, y - r * 0.1, x + r * 0.7, y + r * 0.65); c.quadraticCurveTo(x + r * 0.4, y + r * 0.75, x + r * 0.3, y + r * 0.1); c.closePath(); }, COL.green, lw * 0.7);
    line(c, [[x - r * 0.2, y - r * 0.7], [x + r * 0.35, y - r * 0.55]], Math.max(3, r * 0.1), WHITE);
  });
  if (name === "mars") ball(c, x, y, r, "#d9623b", "#a8411f", () => { crater(c, x - r * 0.3, y + r * 0.1, r * 0.3, "#b04526"); crater(c, x + r * 0.35, y - r * 0.2, r * 0.22, "#b04526"); shape(c, () => ell(c, x, y - r * 0.9, r * 0.4, r * 0.2), WHITE, lw * 0.6); });
  if (name === "jupiter") ball(c, x, y, r, "#e9c9a0", "#c58f5b", () => { [[-0.7, 0.18, "#c58f5b"], [-0.25, 0.14, "#b87a4a"], [0.2, 0.18, "#c58f5b"], [0.62, 0.14, "#b87a4a"]].forEach(([k, h, col]) => { c.fillStyle = col as string; c.fillRect(x - r, y + r * (k as number), r * 2, r * (h as number)); }); shape(c, () => ell(c, x + r * 0.3, y + r * 0.42, r * 0.2, r * 0.11), COL.red, lw * 0.6); });
  if (name === "uranus") ball(c, x, y, r, "#a8e6e3", "#6fbfc4", () => { line(c, [[x - r, y + r * 0.1], [x + r, y + r * 0.1]], Math.max(2, r * 0.05), "rgba(255,255,255,0.5)"); });
  if (name === "neptune") ball(c, x, y, r, "#4a6fd6", "#3350a8", () => { line(c, [[x - r * 0.7, y - r * 0.25], [x + r * 0.3, y - r * 0.4]], Math.max(3, r * 0.07), "#8fb0ff"); line(c, [[x - r * 0.2, y + r * 0.35], [x + r * 0.8, y + r * 0.15]], Math.max(3, r * 0.07), "#8fb0ff"); });
  if (name === "saturn") {
    const rx = r * 1.95, ry = r * 0.5, rot = -0.22;
    const rg = (w: number, col: string, front: boolean) => { c.beginPath(); c.ellipse(x, y, rx, ry, rot, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "butt"; c.stroke(); };
    rg(r * 0.32 + lw * 2, INK, false); rg(r * 0.32, "#d9b878", false);
    ball(c, x, y, r, "#efd496", "#cfae62", () => { c.fillStyle = "#d9b878"; c.fillRect(x - r, y - r * 0.35, r * 2, r * 0.15); c.fillRect(x - r, y + r * 0.2, r * 2, r * 0.18); });
    rg(r * 0.32 + lw * 2, INK, true); rg(r * 0.32, "#e6c98c", true);
  }
};
const ORDER: PName[] = ["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"];
const solarSys = (c: Ctx) => {
  night(c, 21, 70);
  const cx = 540, cy = 540, radii = [105, 148, 190, 232, 300, 365, 425, 488], pr = [9, 13, 14, 11, 30, 26, 19, 19], an = [-0.6, 2.4, 0.5, -2.2, 3.6, -1.0, 1.9, -0.2];
  radii.forEach((r) => ring(c, cx, cy, r));
  sun(c, cx, cy, 62);
  radii.forEach((r, i) => planet(c, ORDER[i], cx + Math.cos(an[i]) * r, cy + Math.sin(an[i]) * r, pr[i]));
};


// ---------------------------------------------------------------- small shared pieces
const star5 = (c: Ctx, x: number, y: number, r: number, col: string = COL.yellow) => {
  const pts: number[][] = [];
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  shape(c, () => polyP(c, pts), col, Math.max(3, r * 0.07));
};
const moon = (c: Ctx, x: number, y: number, r: number) => ball(c, x, y, r, "#d9d5cc", "#a9a49a", () => { crater(c, x - r * 0.3, y - r * 0.25, r * 0.22, "#b3aea4"); crater(c, x + r * 0.3, y + r * 0.2, r * 0.28, "#b3aea4"); crater(c, x - r * 0.15, y + r * 0.5, r * 0.14, "#b3aea4"); });
const arcRing = (c: Ctx, x: number, y: number, r: number, a0: number, a1: number) => { c.save(); c.setLineDash([14, 12]); c.beginPath(); c.arc(x, y, r, a0, a1); c.strokeStyle = "rgba(255,246,214,0.5)"; c.lineWidth = 4; c.stroke(); c.restore(); };
const eye = (c: Ctx, x: number, y: number, s = 1) => {
  shape(c, () => { c.moveTo(x - 70 * s, y); c.quadraticCurveTo(x, y - 70 * s, x + 70 * s, y); c.quadraticCurveTo(x, y + 70 * s, x - 70 * s, y); c.closePath(); }, WHITE, 6);
  shape(c, () => ell(c, x, y, 28 * s, 28 * s), "#6a4128", 4); shape(c, () => ell(c, x, y, 12 * s, 12 * s), INK, 0);
};
const bulb = (c: Ctx, x: number, y: number, r: number, on: boolean) => {
  if (on) { c.beginPath(); ell(c, x, y, r * 1.9, r * 1.9); c.fillStyle = "rgba(255,226,90,0.35)"; c.fill(); for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2 + 0.2; line(c, [[x + Math.cos(a) * r * 1.35, y + Math.sin(a) * r * 1.35], [x + Math.cos(a) * r * 1.8, y + Math.sin(a) * r * 1.8]], Math.max(4, r * 0.08), COL.yellow); } }
  shape(c, () => rrect(c, x - r * 0.45, y + r * 0.8, r * 0.9, r * 0.6, r * 0.1), COL.steelDk, Math.max(3, r * 0.06));
  shape(c, () => ell(c, x, y, r, r), on ? COL.yellow : "#cfd8df", Math.max(4, r * 0.06));
  shade(c, () => ell(c, x, y, r, r), on ? COL.orange : COL.steelDk, r * 0.25, r * 0.25, 0.4);
  shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", Math.max(4, r * 0.06));
};
const torch = (c: Ctx, x: number, y: number, an: number, s = 1) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -150, -34, 150, 68, 16), COL.teal, 6); shade(c, () => rrect(c, -150, -34, 150, 68, 16), COL.tealDk, 0, 18, 0.55);
  shape(c, () => polyP(c, [[0, -34], [46, -56], [46, 56], [0, 34]]), COL.steel, 6);
  shape(c, () => ell(c, 46, 0, 12, 56), COL.yellow, 5);
  c.restore();
};
const beam = (c: Ctx, pts: number[][], alpha = 0.38) => { c.beginPath(); polyP(c, pts); c.fillStyle = `rgba(255,214,60,${alpha})`; c.fill(); };

// ---------------------------------------------------------------- flows
// e1: two identical lamps, one near and one far on the floor: the far one looks small
const e1 = (c: Ctx) => {
  ground(c, "#e4d8c1");
  shape(c, () => polyP(c, [[0, 1080], [1080, 1080], [1080, 520], [0, 520]]), "#cdb994", 0);
  line(c, [[0, 520], [1080, 520]], 6);
  const lamp = (x: number, y: number, s: number) => {
    shadow(c, x + 20 * s, y + 8 * s, 90 * s, 20 * s);
    shape(c, () => ell(c, x, y, 70 * s, 18 * s), COL.steelDk, Math.max(3, 5 * s));
    shape(c, () => rrect(c, x - 10 * s, y - 230 * s, 20 * s, 230 * s, 4 * s), COL.steel, Math.max(3, 5 * s));
    bulb(c, x, y - 300 * s, 70 * s, true);
  };
  lamp(760, 560, 0.42);
  lamp(330, 1020, 1.25);
  line(c, [[420, 1060], [720, 600]], 4, "rgba(43,35,64,0.3)");
};
// e2: a torch makes its own light; the ball only shines where the torch light lands, and that bounces to the eye
const e2 = (c: Ctx) => {
  ground(c, "#2b2b55");
  torch(c, 270, 360, 0.15, 1);
  beam(c, [[320, 346], [680, 300], [700, 580], [320, 380]]);
  shadow(c, 810, 760, 130, 26);
  ball(c, 810, 500, 150, "#f7f3e8", "#b7b1a5");
  c.beginPath(); ell(c, 735, 440, 70, 90); c.fillStyle = "rgba(255,226,120,0.45)"; c.fill();
  shape(c, () => ell(c, 810, 500, 150, 150), "rgba(0,0,0,0)", 8);
  arrow(c, [[780, 680], [660, 790], [560, 850]], RED, 11);
  eye(c, 470, 900, 1.1);
};
// a1: slips sorted into own light and borrowed light
const a1 = (c: Ctx) => {
  ground(c, "#efe4cf");
  shape(c, () => rrect(c, 40, 60, 480, 960, 28), "#fbe8a8", 6); shape(c, () => rrect(c, 560, 60, 480, 960, 28), "#cfd9ea", 6);
  const slip = (x: number, y: number, rot: number, f: () => void) => { c.save(); c.translate(x, y); c.rotate(rot); shadow(c, 14, 20, 150, 130); shape(c, () => rrect(c, -150, -150, 300, 300, 18), WHITE, 6); f(); c.restore(); };
  slip(280, 230, -0.05, () => sun(c, 0, 0, 62));
  slip(280, 540, 0.04, () => star5(c, 0, 0, 90));
  slip(280, 840, -0.03, () => bulb(c, 0, -10, 62, true));
  slip(800, 230, 0.05, () => moon(c, 0, 0, 90));
  slip(800, 540, -0.04, () => planet(c, "earth", 0, 0, 90));
  slip(800, 840, 0.03, () => { shape(c, () => ell(c, 0, 0, 90, 90), COL.red, 6); shade(c, () => ell(c, 0, 0, 90, 90), "#b33a28", 24, 24, 0.5); shape(c, () => ell(c, 0, 0, 90, 90), "rgba(0,0,0,0)", 6); });
};
// a3: the planet dance: a yellow cloth for the Sun, a child walking round it, a grown-up following
const a3 = (c: Ctx) => {
  ground(c, "#e7cfa0");
  c.save(); c.setLineDash([22, 16]); c.beginPath(); ell(c, 540, 700, 420, 150); c.strokeStyle = "rgba(43,35,64,0.45)"; c.lineWidth = 7; c.stroke(); c.restore();
  person(c, 200, 740, 420, { adult: true, armL: [0.5, 0.2], armR: [0.3, 0] });
  shadow(c, 560, 715, 150, 44);
  shape(c, () => ell(c, 540, 700, 130, 56), COL.yellow, 7);
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; line(c, [[540 + Math.cos(a) * 150, 700 + Math.sin(a) * 66], [540 + Math.cos(a) * 205, 700 + Math.sin(a) * 90]], 8, COL.orange); }
  person(c, 800, 900, 440, { armL: [1.2, 1.9], armR: [0.2, -0.3] });
  arrow(c, [[770, 560], [650, 535], [520, 540]], RED, 12);
};
// p1: a shoebox with pin-holes: a lit box front shows the star pattern
const p1 = (c: Ctx) => {
  ground(c, "#e8dcc3");
  shadow(c, 560, 900, 420, 40);
  shape(c, () => rrect(c, 140, 200, 780, 640, 30), "#c9a46c", 7);
  shade(c, () => rrect(c, 140, 200, 780, 640, 30), "#a07c45", 0, 40, 0.5);
  shape(c, () => rrect(c, 200, 260, 660, 520, 14), "#14122e", 6);
  const pts: number[][] = [[300, 640], [380, 520], [500, 560], [560, 420], [680, 380], [740, 480], [780, 330]];
  line(c, pts, 4, "rgba(255,246,214,0.45)");
  pts.forEach(([x, y], i) => { c.beginPath(); ell(c, x, y, 20, 20); c.fillStyle = "rgba(255,226,120,0.4)"; c.fill(); shape(c, () => ell(c, x, y, 9 + (i % 3) * 2, 9 + (i % 3) * 2), "#fff6d6", 0); });
  const r = rnd(5); for (let i = 0; i < 14; i++) { const x = 230 + r() * 600, y = 290 + r() * 460; shape(c, () => ell(c, x, y, 5, 5), "#fff6d6", 0); }
  // a pin
  line(c, [[960, 960], [1010, 910]], 5); line(c, [[960, 960], [880, 1040]], 7, COL.steelDk);
  shape(c, () => ell(c, 1018, 902, 18, 18), RED, 5);
};
// c1: a long box aimed at the Sun: a pin-hole at the near end, a white screen with a round picture of the Sun at the far end
const c1 = (c: Ctx) => {
  ground(c, "#cfe6f2");
  sun(c, 160, 160, 80);
  const H = [380, 440], an = Math.atan2(H[1] - 160, H[0] - 160);
  beam(c, [[210, 110], [260, 220], [H[0], H[1]]], 0.35);
  line(c, [[160, 160], [H[0], H[1]]], 6, COL.yellow);
  c.save(); c.translate(H[0], H[1]); c.rotate(an);
  shadow(c, 300, 130, 340, 30);
  shape(c, () => rrect(c, 0, -90, 640, 180, 12), "#c9a46c", 7);
  shape(c, () => rrect(c, 12, -76, 616, 152, 6), "#4a3a2a", 4);
  line(c, [[0, 0], [600, 0]], 6, COL.yellow);
  shape(c, () => rrect(c, -6, -90, 20, 180, 4), COL.steel, 6); // foil with the pin-hole
  shape(c, () => ell(c, 4, 0, 4, 4), INK, 0);
  shape(c, () => rrect(c, 600, -70, 22, 140, 4), WHITE, 5);
  shape(c, () => ell(c, 600, 0, 8, 34), COL.yellow, 4);
  c.restore();
  shape(c, () => ell(c, 0, 0, 0, 0), "rgba(0,0,0,0)", 0);
};

// ---------------------------------------------------------------- terms
const t0 = (c: Ctx) => {
  night(c, 8, 50, (x, y) => Math.hypot(x - 540, y - 540) > 330);
  sun(c, 540, 540, 170, "#fff0b0", "#f7c35a");
  star5(c, 130, 150, 34); star5(c, 960, 190, 28); star5(c, 190, 900, 24); star5(c, 930, 900, 36);
};
const t2 = (c: Ctx) => {
  night(c, 14, 40, (x, y) => x > 360);
  arcRing(c, 190, 540, 520, -0.9, 0.9);
  sun(c, 190, 540, 125);
  planet(c, "earth", 710, 540, 120);
  arrow(c, [[870, 350], [900, 470], [885, 590]], RED, 12);
};
const t6 = (c: Ctx) => {
  ground(c, "#efe4cf");
  shape(c, () => rect(c, 900, 60, 120, 520), WHITE, 6);
  c.beginPath(); ell(c, 960, 280, 40, 70); c.fillStyle = "rgba(255,214,60,0.9)"; c.fill();
  shape(c, () => rect(c, 0, 760, 1080, 320), "#d9c49a", 6);
  torch(c, 250, 300, 1.05, 0.8);
  line(c, [[290, 370], [500, 740]], 14, COL.yellow); line(c, [[500, 740], [930, 285]], 14, COL.yellow);
  arrow(c, [[370, 490], [440, 620]], RED, 9); arrow(c, [[640, 590], [760, 470]], RED, 9);
  shadow(c, 520, 800, 250, 26);
  shape(c, () => polyP(c, [[330, 770], [700, 770], [740, 735], [370, 735]]), COL.steelIn, 6);
  shape(c, () => polyP(c, [[330, 770], [700, 770], [700, 790], [330, 790]]), COL.steelDk, 6);
  shine(c, [[420, 755], [560, 755]], 8);
};
const t7 = (c: Ctx) => {
  night(c, 17, 25, (x, y) => y < 260 || y > 800);
  sun(c, 190, 540, 85);
  bulb(c, 540, 500, 85, true);
  // a candle
  shape(c, () => rrect(c, 800, 560, 90, 230, 10), "#fff2cf", 6); shade(c, () => rrect(c, 800, 560, 90, 230, 10), "#e2c98c", 24, 0, 0.6);
  line(c, [[845, 560], [845, 530]], 5);
  c.beginPath(); ell(c, 845, 490, 70, 70); c.fillStyle = "rgba(255,226,90,0.35)"; c.fill();
  shape(c, () => { c.moveTo(845, 410); c.quadraticCurveTo(900, 480, 845, 535); c.quadraticCurveTo(790, 480, 845, 410); c.closePath(); }, COL.orange, 6);
  shape(c, () => { c.moveTo(845, 470); c.quadraticCurveTo(875, 505, 845, 532); c.quadraticCurveTo(815, 505, 845, 470); c.closePath(); }, COL.yellow, 3);
};
const t8 = (c: Ctx) => {
  ground(c, "#2b2b55");
  c.fillStyle = "#fff4d6"; c.fillRect(540, 0, 540, 1080);
  line(c, [[540, 0], [540, 1080]], 8);
  // dark side: lamp off, the ball cannot be seen
  bulb(c, 200, 300, 60, false);
  shape(c, () => ell(c, 360, 640, 100, 100), "#2c2c5c", 4);
  eye(c, 280, 930, 0.9);
  // bright side: lamp on, the ball can be seen
  bulb(c, 700, 300, 60, true);
  shadow(c, 930, 770, 110, 22);
  ball(c, 900, 640, 100, "#e4523b", "#a8341f");
  arrow(c, [[780, 360], [850, 500]], RED, 9); arrow(c, [[880, 760], [800, 860]], RED, 9);
  eye(c, 760, 940, 0.9);
};
const t10 = (c: Ctx) => {
  night(c, 23, 30, (x, y) => y < 260);
  sun(c, 540, 130, 46, "#fff0b0", "#f7c35a");
  // wobbling air
  for (let k = 0; k < 4; k++) { const y = 330 + k * 130; c.beginPath(); c.moveTo(0, y); for (let x = 0; x <= 1080; x += 40) c.lineTo(x, y + Math.sin(x / 40 + k * 2) * 24); c.strokeStyle = "rgba(143,195,234,0.55)"; c.lineWidth = 22; c.lineCap = "round"; c.stroke(); }
  line(c, [[540, 190], [500, 330], [590, 440], [490, 570], [580, 700], [520, 810], [540, 870]], 12, COL.yellow);
  eye(c, 540, 940, 1.1);
};
const t13 = (c: Ctx) => {
  night(c, 31, 30, (x, y) => y > 700 || y < 160);
  sun(c, 120, 520, 70, "#fff0b0", "#f7c35a");
  planet(c, "earth", 960, 520, 70);
  line(c, [[230, 520], [880, 520]], 16, COL.yellow);
  arrow(c, [[500, 520], [700, 520]], RED, 12);
  shape(c, () => rrect(c, 410, 140, 260, 280, 18), WHITE, 7);
  shape(c, () => polyP(c, [[410, 140], [670, 140], [670, 230], [410, 230]]), COL.red, 7);
  write(c, "1", 510, 255, 130, INK, 14);
  line(c, [[540, 440], [540, 500]], 6, WHITE);
};
const t15 = (c: Ctx) => {
  ground(c, "#e8dcc3");
  const cx = 540, cy = 540;
  for (const rot of [0, Math.PI / 3, -Math.PI / 3]) { c.beginPath(); c.ellipse(cx, cy, 380, 130, rot, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); }
  [[0, 0.3], [Math.PI / 3, 2.4], [-Math.PI / 3, 4.5]].forEach(([rot, t]) => { const x = cx + Math.cos(rot) * Math.cos(t) * 380 - Math.sin(rot) * Math.sin(t) * 130, y = cy + Math.sin(rot) * Math.cos(t) * 380 + Math.cos(rot) * Math.sin(t) * 130; shape(c, () => ell(c, x, y, 30, 30), COL.teal, 6); });
  [[-26, -20, 1], [24, -26, 0], [-30, 24, 0], [22, 24, 1], [0, 0, 1]].forEach(([dx, dy, p]) => { shape(c, () => ell(c, cx + dx, cy + dy, 28, 28), p ? RED : COL.blue, 5); });
};
const t16 = (c: Ctx) => {
  ground(c, "#e8dcc3");
  line(c, [[540, 80], [540, 1000]], 6, "rgba(43,35,64,0.3)");
  const atom = (x: number, y: number, nuc: [number, number, number][], ne: number) => {
    c.beginPath(); ell(c, x, y, 190, 190); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
    for (let k = 0; k < ne; k++) { const a = -0.7 + k * Math.PI; shape(c, () => ell(c, x + Math.cos(a) * 190, y + Math.sin(a) * 190, 28, 28), COL.teal, 6); }
    nuc.forEach(([dx, dy, p]) => shape(c, () => ell(c, x + dx, y + dy, 34, 34), p ? RED : COL.blue, 5));
  };
  atom(270, 540, [[0, 0, 1]], 1);
  atom(810, 540, [[-22, -22, 1], [22, -22, 0], [-22, 22, 0], [22, 22, 1]], 2);
};
const t17 = (c: Ctx) => {
  night(c, 41, 30, (x, y) => y < 200 || y > 880);
  [[110, 440], [230, 440], [110, 560], [230, 560]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 52, 52), RED, 6));
  arrow(c, [[330, 500], [480, 500], [560, 500]], WHITE, 12);
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; shape(c, () => polyP(c, [[800 + Math.cos(a - 0.12) * 120, 500 + Math.sin(a - 0.12) * 120], [800 + Math.cos(a) * 260, 500 + Math.sin(a) * 260], [800 + Math.cos(a + 0.12) * 120, 500 + Math.sin(a + 0.12) * 120]]), COL.yellow, 4); }
  [[-34, -34, 1], [34, -34, 0], [-34, 34, 0], [34, 34, 1]].forEach(([dx, dy, p]) => shape(c, () => ell(c, 800 + dx, 500 + dy, 56, 56), p ? RED : COL.blue, 6));
};
const t18 = (c: Ctx) => {
  ground(c, "#cfe6f2");
  sun(c, 170, 170, 80);
  beam(c, [[130, 100], [190, 250], [500, 500]], 0.35);
  beam(c, [[500, 500], [770, 860], [910, 860]], 0.35);
  line(c, [[170, 170], [500, 500]], 6, COL.yellow); line(c, [[500, 500], [840, 850]], 6, COL.yellow);
  shape(c, () => rect(c, 320, 485, 165, 30), COL.wood, 6); shape(c, () => rect(c, 515, 485, 165, 30), COL.wood, 6);
  shadow(c, 700, 880, 340, 30);
  shape(c, () => polyP(c, [[330, 850], [1000, 850], [1020, 910], [310, 910]]), WHITE, 6);
  shape(c, () => ell(c, 850, 868, 46, 16), COL.yellow, 5);
};

// ---------------------------------------------------------------- explanations
const x0 = (c: Ctx) => {
  night(c, 51, 40, (x, y) => !(x < 300 && y > 150 && y < 450));
  sun(c, 160, 300, 90, "#fff0b0", "#f7c35a");
  arrow(c, [[300, 330], [450, 390], [540, 430]], COL.yellow, 12);
  arrow(c, [[300, 260], [600, 200], [800, 200]], COL.yellow, 12);
  ball(c, 760, 600, 170, "#c9b8e8", "#6f5aa6");
  moon(c, 870, 240, 60);
};
const x1 = (c: Ctx) => {
  night(c, 61, 8, () => false);
  sun(c, 230, 540, 160);
  line(c, [[480, 510], [650, 510]], 14, WHITE); line(c, [[480, 570], [650, 570]], 14, WHITE);
  const r = rnd(3); for (let i = 0; i < 30; i++) { const x = 760 + r() * 290, y = 80 + r() * 920; if (Math.hypot(x - 900, y - 540) < 90) continue; star5(c, x, y, 4 + r() * 3, "#fff6d6"); }
  sun(c, 900, 540, 30);
};
const x2 = (c: Ctx) => {
  ground(c, "#bfe0f5");
  shape(c, () => polyP(c, [[0, 430], [1080, 430], [1080, 1080], [0, 1080]]), "#8f8a9a", 0);
  shape(c, () => polyP(c, [[470, 430], [610, 430], [1000, 1080], [80, 1080]]), "#5f5a70", 0);
  const post = (x: number, y: number, h: number, s: number) => {
    shape(c, () => rrect(c, x - 14 * s, y - h, 28 * s, h, 6 * s), COL.steel, Math.max(3, 6 * s));
    shape(c, () => rrect(c, x - 14 * s, y - h - 14 * s, 150 * s, 26 * s, 8 * s), COL.steel, Math.max(3, 6 * s));
    bulb(c, x + 120 * s, y - h + 36 * s, 34 * s, true);
  };
  post(160, 1040, 780, 1.4);
  post(380, 700, 330, 0.62);
  post(480, 540, 150, 0.3);
};
const x4 = (c: Ctx) => {
  night(c, 71, 0);
  const st: number[][] = [[160, 200], [300, 330], [470, 230], [640, 330], [820, 200], [260, 640], [450, 760], [660, 700], [880, 820]];
  line(c, st.slice(0, 5), 4, "rgba(255,246,214,0.4)");
  st.forEach(([x, y]) => star5(c, x, y, 26, "#fff6d6"));
  const pos: number[][] = [[160, 520], [470, 470], [800, 420]];
  c.save(); c.setLineDash([16, 14]); line(c, pos, 5, "rgba(255,246,214,0.6)"); c.restore();
  pos.forEach(([x, y], i) => { shape(c, () => ell(c, x, y, 36, 36), COL.orange, 5); write(c, String(i + 1), x - 12, y + 62, 56, WHITE, 8); });
  arrow(c, [[560, 480], [680, 450], [720, 442]], RED, 11);
};
const x6 = (c: Ctx) => {
  night(c, 81, 40, (x, y) => x > 420 || Math.abs(y - 540) > 260);
  sun(c, 200, 540, 150);
  arcRing(c, 200, 540, 560, -0.55, 0.55);
  planet(c, "earth", 760, 540, 70);
  arrow(c, [[690, 540], [560, 540]], RED, 12);
  arrow(c, [[760, 450], [775, 330], [745, 250]], WHITE, 11);
};
const x8 = (c: Ctx) => {
  ground(c, "#26224f");
  sun(c, 110, 540, 62, "#fff0b0", "#f7c35a");
  line(c, [[190, 540], [380, 540]], 14, "#fff6d6");
  shape(c, () => polyP(c, [[400, 640], [500, 380], [600, 640]]), COL.glass, 7);
  shine(c, [[460, 570], [498, 450]], 8);
  const cols = ["#e4523b", "#f39a3c", "#ffd34d", "#6aa53f", "#5b8fd6", "#8b6cc9"];
  cols.forEach((col, i) => { c.fillStyle = col; c.fillRect(720, 280 + i * 85, 300, 85); });
  c.strokeStyle = INK; c.lineWidth = 7; c.strokeRect(720, 280, 300, 510);
  for (const [x, y] of [[775, 0], [850, 2], [905, 4], [965, 3], [815, 5], [930, 1]]) line(c, [[720 + (x - 720) % 300 + 0, 280 + y * 85 + 6], [720 + (x - 720) % 300, 280 + y * 85 + 79]], 6, INK);
  beam(c, [[600, 600], [720, 280], [720, 790]], 0.15);
};
const x11 = (c: Ctx) => {
  night(c, 91, 45, (x, y) => Math.hypot(x - 300, y - 540) > 330);
  arcRing(c, 300, 540, 400, -1.1, 1.1);
  sun(c, 300, 540, 120, "#ffb27a", "#e4523b");
  ball(c, 700, 330, 80, "#a3d8c4", "#4f9a85", () => { line(c, [[620, 330], [780, 360]], 8, "rgba(255,255,255,0.6)"); });
  arrow(c, [[780, 430], [800, 560], [750, 690]], RED, 12);
  star5(c, 960, 160, 20, "#fff6d6"); star5(c, 980, 880, 24, "#fff6d6");
};
const x12 = (c: Ctx) => {
  night(c, 101, 30, (x, y) => x > 150);
  // 1: a small world hits the young Earth
  write(c, "1", 60, 150, 80, WHITE, 10); planet(c, "earth", 360, 190, 100);
  ball(c, 760, 190, 50, "#b3aea6", "#7d7870"); arrow(c, [[690, 190], [560, 190], [490, 190]], WHITE, 12);
  arrow(c, [[110, 290], [110, 400]], RED, 11);
  // 2: rock and dust fly out
  write(c, "2", 60, 500, 80, WHITE, 10); planet(c, "earth", 540, 540, 100);
  const r = rnd(9); for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2 + r() * 0.4, d = 135 + r() * 60, s = 9 + r() * 9; shape(c, () => ell(c, 540 + Math.cos(a) * d, 540 + Math.sin(a) * d, s, s), "#b3aea6", 4); }
  arrow(c, [[110, 640], [110, 750]], RED, 11);
  // 3: the pieces gather into the Moon
  write(c, "3", 60, 850, 80, WHITE, 10); planet(c, "earth", 460, 890, 100);
  arcRing(c, 460, 890, 270, -2.4, 0.9); moon(c, 700, 790, 55);
};

export const ic_skySunMoonStarsL3 = cards("sci.sky.sun-moon-stars.L3 cards", [
  e1, e2, a1, a3, p1, c1,                 // 0-5   flows
  t0, t2, t6, t7, t8, solarSys, t10, t13, t15, t16, t17, t18, // 6-17 terms 0,2,6,7,8,9,10,13,15,16,17,18
  x0, x1, x2, x4, x6, x8, x11, x12,        // 18-25 expl 0,1,2,4,6,8,11,12
]);
