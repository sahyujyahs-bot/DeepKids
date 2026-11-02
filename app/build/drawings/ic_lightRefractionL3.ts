import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, glass, write, cards } from "./flatKit";

// sci.light.refraction.L3 · picture cards. Light is drawn as yellow lines with a red arrow for what changes.

const ray = (c: Ctx, pts: number[][], w = 9) => { line(c, pts, w + 6, INK); line(c, pts, w, COL.yellow); };
const eye = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.62), WHITE, 5);
  shape(c, () => ell(c, x + r * 0.15, y, r * 0.36, r * 0.36), COL.brown, 3);
  shape(c, () => ell(c, x + r * 0.15, y, r * 0.17, r * 0.17), INK, 0);
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.65, y + Math.sin(a) * r * 1.65]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
// a pencil from a to b; tip at b if tip, rubber at a if rub (flat cut otherwise)
const pencil = (c: Ctx, ax: number, ay: number, bx: number, by: number, w: number, tip: boolean, rub: boolean) => {
  const L = Math.hypot(bx - ax, by - ay), an = Math.atan2(by - ay, bx - ax), t = tip ? w * 1.3 : 0, e = rub ? w * 0.8 : 0;
  c.save(); c.translate(ax, ay); c.rotate(an);
  shape(c, () => rrect(c, 0, -w / 2, L - t + 2, w, 3), COL.yellow, 6);
  if (tip) { shape(c, () => { c.moveTo(L - t, -w / 2); c.lineTo(L, 0); c.lineTo(L - t, w / 2); c.closePath(); }, "#f7d9a8", 6); shape(c, () => { c.moveTo(L - t * 0.38, -w * 0.17); c.lineTo(L, 0); c.lineTo(L - t * 0.38, w * 0.17); c.closePath(); }, INK, 2); }
  if (rub) shape(c, () => rrect(c, -4, -w / 2, e + 4, w, 4), COL.pink, 6);
  c.restore();
};
// a magnifying glass: lens centre (x, y), radius r, handle to the lower right; inside() draws what is seen through it
const magnifier = (c: Ctx, x: number, y: number, r: number, inside: () => void, an = 0.8) => {
  const hx = x + Math.cos(an) * r, hy = y + Math.sin(an) * r;
  line(c, [[hx, hy], [x + Math.cos(an) * r * 2, y + Math.sin(an) * r * 2]], 36, INK); line(c, [[hx, hy], [x + Math.cos(an) * r * 2, y + Math.sin(an) * r * 2]], 24, COL.woodDk);
  shape(c, () => ell(c, x, y, r, r), "#f4faff", 0);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); inside(); c.restore();
  c.beginPath(); ell(c, x, y, r, r); c.lineWidth = 30; c.strokeStyle = INK; c.stroke(); c.lineWidth = 18; c.strokeStyle = COL.steel; c.stroke();
  shine(c, [[x - r * 0.6, y - r * 0.3], [x - r * 0.3, y - r * 0.62]], 10);
};
const blockArrow = (c: Ctx, x: number, y: number, len: number, h: number, dir: 1 | -1, col: string) => {
  const s = dir, hw = h / 2;
  shape(c, () => polyP(c, [[x, y - hw * 0.4], [x + s * len * 0.6, y - hw * 0.4], [x + s * len * 0.6, y - hw], [x + s * len, y], [x + s * len * 0.6, y + hw], [x + s * len * 0.6, y + hw * 0.4], [x, y + hw * 0.4]]), col, 6);
};
const drop = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.8), COL.drop, 5); line(c, [[x - r * 0.55, y - r * 0.15], [x - r * 0.3, y - r * 0.45]], r * 0.14, WHITE); };

// the broken pencil in a glass of water
const WL = 540;
const pencilGlass = (c: Ctx, cx: number, by: number, w: number, h: number, x1: number, y1: number, px: number, py: number) => {
  glass(c, cx, by, w, h, 0.65);
  const ly = by - h * 0.65, k = (ly - y1) / (py - y1), ex = x1 + (px - x1) * k;
  // lower part first (looks shifted and shallower), then the upper part
  pencil(c, ex - 38, ly + 4, ex - 70, ly + 4 + (by - ly) * 0.62, 34, true, false);
  pencil(c, x1, y1, ex, ly, 34, false, true);
  return ly;
};

const intro = (c: Ctx) => { ground(c); pencilGlass(c, 540, 930, 440, 620, 330, 170, 470, 530); };

const summary = (c: Ctx) => {
  ground(c);
  pencilGlass(c, 290, 900, 330, 500, 150, 220, 250, 480);
  magnifier(c, 760, 440, 200, () => {
    c.fillStyle = COL.paper; c.fillRect(500, 200, 560, 520);
    const r = rnd(5);
    for (let i = 0; i < 14; i++) seedDot(c, 600 + r() * 320, 340 + r() * 220, 24);
  });
  shadow(c, 900, 920, 120, 20);
};
const seedDot = (c: Ctx, x: number, y: number, r: number) => shape(c, () => ell(c, x, y, r, r * 0.72, 0.4), COL.greenLt, 5);

const e1 = (c: Ctx) => {
  ground(c);
  pencilGlass(c, 610, 930, 440, 620, 400, 190, 520, 530);
  // child's hand holds the top of the pencil
  hand(c, 382, 151, 1.23, 1.2);
  arrow(c, [[250, 250], [290, 420]]);
};

const e2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 300, 960, 480, 30), COL.paper, 6);
  const digits = (cx: number, s: number) => write(c, "42", cx - 40 * s, 520 - 25 * s, 50 * s, INK, 5 * s);
  digits(220, 1);
  c.save(); c.beginPath(); ell(c, 540, 540, 100, 100); c.clip(); c.fillStyle = COL.drop; c.fillRect(0, 0, D, D); digits(540, 1.9); c.restore();
  shape(c, () => ell(c, 540, 540, 100, 100), "rgba(143,195,234,0.25)", 6); line(c, [[470, 500], [490, 470]], 9, WHITE);
  c.save(); c.beginPath(); ell(c, 860, 540, 150, 150); c.clip(); c.fillStyle = COL.drop; c.fillRect(0, 0, D, D); digits(860, 2.9); c.restore();
  shape(c, () => ell(c, 860, 540, 150, 150), "rgba(143,195,234,0.25)", 6); line(c, [[765, 490], [795, 445]], 10, WHITE);
};

// three cups seen in section: coin hidden behind the rim, then seen after water is poured
const cup = (c: Ctx, x: number, water: boolean) => {
  const body = () => { c.moveTo(x, 400); c.lineTo(x + 280, 400); c.lineTo(x + 262, 780); c.lineTo(x + 18, 780); c.closePath(); };
  shadow(c, x + 160, 790, 170, 22);
  shape(c, body, COL.paper, 6);
  if (water) shape(c, () => { c.moveTo(x + 6, 560); c.lineTo(x + 274, 560); c.lineTo(x + 262, 780); c.lineTo(x + 18, 780); c.closePath(); }, COL.water, 6);
  shape(c, () => ell(c, x + 90, 768, 52, 12), COL.yellow, 5);
  shape(c, () => ell(c, x + 90, 760, 52, 12), "#ffe58a", 5);
  line(c, [[x, 400], [x + 280, 400]], 8);
};
const e3 = (c: Ctx) => {
  ground(c);
  cup(c, 200, false); cup(c, 700, true);
  eye(c, 90, 250, 46); eye(c, 590, 250, 46);
  arrow(c, [[135, 262], [200, 400], [470, 780]]);
  ray(c, [[630, 285], [700, 400], [849, 560]], 8); arrow(c, [[849, 560], [800, 745]], RED, 8);
};

const a1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 330, 1000, 330, 16), WHITE, 6);
  blockArrow(c, 330, 495, 240, 120, -1, COL.blue);
  blockArrow(c, 790, 495, 240, 120, -1, COL.blue);
  glass(c, 540, 760, 300, 520, 1);
  c.save(); c.beginPath(); c.rect(440, 300, 200, 400); c.clip(); blockArrow(c, 450, 495, 130, 90, 1, COL.red); c.restore();
  glass(c, 540, 760, 300, 520, 0);
};

const a2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 140, 960, 780, 30), COL.paper, 6);
  const r = rnd(3);
  for (let i = 0; i < 36; i++) { const x = 100 + r() * 880, y = 180 + r() * 700; if (Math.hypot(x - 700, y - 440) > 240) shape(c, () => ell(c, x, y, 9, 7), COL.grey, 2); }
  line(c, [[120, 840], [250, 780], [380, 840], [500, 770]], 7, COL.red);
  shape(c, () => ell(c, 220, 330, 90, 46, -0.5), COL.leaf, 5); line(c, [[150, 380], [290, 280]], 4, COL.leafDk);
  magnifier(c, 700, 440, 250, () => {
    c.fillStyle = COL.paper; c.fillRect(400, 150, 600, 600);
    c.save(); c.translate(700, 440); c.scale(2.6, 2.6); c.translate(-220, -330);
    shape(c, () => ell(c, 220, 330, 90, 46, -0.5), COL.leaf, 3); line(c, [[150, 380], [290, 280]], 2, COL.leafDk);
    for (let k = -2; k <= 2; k++) line(c, [[185 + k * 22, 355 - k * 5], [160 + k * 30, 320 + k * 10]], 1.8, COL.leafDk);
    c.restore();
  }, 0.75);
};

const a3 = (c: Ctx) => {
  ground(c);
  const scene = (x: number, y: number, w: number, h: number, flip: boolean) => {
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); if (flip) { c.translate(x + w / 2, y + h / 2); c.scale(1, -1); c.translate(-x - w / 2, -y - h / 2); }
    c.fillStyle = COL.sky; c.fillRect(x, y, w, h); shape(c, () => ell(c, x + w * 0.72, y + h * 0.2, w * 0.14, w * 0.14), COL.yellow, 4);
    shape(c, () => ell(c, x + w * 0.4, y + h * 1.05, w * 0.8, h * 0.28), COL.green, 4);
    line(c, [[x + w * 0.3, y + h * 0.8], [x + w * 0.3, y + h * 0.55]], 8, COL.brown); shape(c, () => ell(c, x + w * 0.3, y + h * 0.48, w * 0.17, w * 0.15), COL.leaf, 4);
    c.restore();
  };
  scene(40, 300, 220, 350, false); shape(c, () => { c.rect(40, 300, 220, 350); }, "rgba(0,0,0,0)", 12);
  shape(c, () => rrect(c, 790, 320, 240, 400, 14), WHITE, 6); scene(830, 380, 160, 270, true); c.strokeStyle = INK; c.lineWidth = 5; c.strokeRect(830, 380, 160, 270);
  ray(c, [[260, 300], [560, 500], [830, 680]], 8); ray(c, [[260, 650], [560, 500], [830, 380]], 8);
  shape(c, () => { c.moveTo(560, 330); c.quadraticCurveTo(620, 500, 560, 670); c.quadraticCurveTo(500, 500, 560, 330); c.closePath(); }, COL.glass, 6);
  line(c, [[560, 670], [560, 800]], 26, INK); line(c, [[560, 670], [560, 800]], 14, COL.woodDk);
};

const a4 = (c: Ctx) => {
  ground(c, "#f7f1e4");
  c.strokeStyle = COL.grey; c.lineWidth = 3;
  for (let x = 0; x < 540; x += 90) line(c, [[x, 0], [x, D]], 3, COL.grey);
  for (let y = 0; y < D; y += 90) line(c, [[0, y], [540, y]], 3, COL.grey);
  shape(c, () => rrect(c, 540, -20, 560, 1120, 0), COL.blue, 6);
  for (let y = 60; y < D; y += 120) for (let x = 620; x < D; x += 120) shape(c, () => ell(c, x, y, 7, 7), COL.blueDk, 0);
  const car = (x: number, y: number) => { c.save(); c.translate(x, y); c.rotate(0.675); shape(c, () => rrect(c, -55, -32, 110, 64, 14), COL.red, 6); shape(c, () => rrect(c, -10, -22, 40, 44, 8), COL.sky, 4); for (const s of [-1, 1]) for (const t of [-34, 34]) shape(c, () => rrect(c, t - 14, s * 40 - 8, 28, 16, 6), INK, 0); c.restore(); };
  line(c, [[453, 589], [627, 371]], 20, INK); line(c, [[453, 589], [627, 371]], 10, COL.wood);
  car(453, 589); car(627, 371);
  arrow(c, [[60, 120], [250, 290], [410, 410], [540, 480]]);
  arrow(c, [[540, 480], [700, 580], [900, 680]]);
};

const a5 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 50, 380, 270, 260, 16), WHITE, 6); write(c, "12", 110, 450, 130, INK, 14);
  shadow(c, 700, 930, 190, 24);
  const bottle = () => { c.moveTo(580, 960); c.lineTo(580, 420); c.quadraticCurveTo(580, 330, 650, 300); c.lineTo(650, 220); c.lineTo(750, 220); c.lineTo(750, 300); c.quadraticCurveTo(820, 330, 820, 420); c.lineTo(820, 960); c.closePath(); };
  shape(c, bottle, COL.water, 6);
  c.save(); c.beginPath(); bottle(); c.clip(); c.translate(700, 0); c.scale(-1, 1); c.translate(-700, 0); write(c, "12", 620, 520, 160, INK, 16); c.restore();
  shape(c, () => rrect(c, 640, 150, 120, 70, 12), COL.teal, 6);
  shine(c, [[610, 450], [610, 880]], 12);
};

const p1 = (c: Ctx) => {
  ground(c);
  eye(c, 540, 190, 80);
  arrow(c, [[540, 290], [540, 410]]);
  shape(c, () => polyP(c, [[200, 480], [1020, 480], [1020, 590], [200, 590]]), COL.wood, 6);
  shape(c, () => rrect(c, 380, 470, 320, 130, 10), COL.steel, 6);
  shape(c, () => ell(c, 540, 535, 62, 62), "#8c97a6", 5);
  shape(c, () => ell(c, 540, 535, 58, 58), COL.drop, 5); line(c, [[505, 515], [520, 490]], 9, WHITE);
  hand(c, 140, 535, 0, 1.6);
  shadow(c, 540, 650, 400, 20);
};

const c2 = (c: Ctx) => {
  ground(c);
  const body = () => { c.moveTo(250, 420); c.lineTo(830, 420); c.lineTo(780, 900); c.lineTo(300, 900); c.closePath(); };
  shadow(c, 560, 910, 290, 26);
  shape(c, body, COL.steel, 6);
  shape(c, () => { c.moveTo(256, 520); c.lineTo(824, 520); c.lineTo(780, 900); c.lineTo(300, 900); c.closePath(); }, COL.water, 6);
  shape(c, () => ell(c, 640, 880, 52, 12), COL.yellow, 5);
  c.globalAlpha = 0.5; shape(c, () => ell(c, 640, 740, 52, 12), COL.yellow, 4, ); c.globalAlpha = 1;
  line(c, [[110, 130], [640, 745]], 22, INK); line(c, [[110, 130], [640, 745]], 12, COL.brown);
  arrow(c, [[740, 760], [660, 860]]);
  line(c, [[250, 420], [830, 420]], 8);
};

// -- terms and explanations
const t0 = (c: Ctx) => {
  ground(c);
  sun(c, 190, 220, 100);
  shape(c, () => ell(c, 540, 700, 130, 120), COL.orange, 6); shade(c, () => ell(c, 540, 700, 130, 120), COL.red, 40, 30, 0.35); leafAt(c);
  eye(c, 900, 560, 76);
  ray(c, [[300, 300], [440, 600]]); ray(c, [[640, 640], [820, 570]]);
};
const leafAt = (c: Ctx) => { shape(c, () => ell(c, 560, 565, 50, 22, -0.6), COL.leaf, 5); };

const t2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 120, 520, 840, 400, 20), COL.water, 6);
  line(c, [[120, 520], [960, 520]], 8);
  line(c, [[540, 180], [540, 880]], 5, COL.grey);
  ray(c, [[170, 190], [440, 520]], 11); ray(c, [[440, 520], [560, 840]], 11);
  line(c, [[440, 520], [660, 790]], 6, COL.greyDk);
  arrow(c, [[640, 760], [610, 830]], RED, 10);
};

const t4 = (c: Ctx) => {
  ground(c);
  glass(c, 480, 900, 440, 640, 0.7);
  arrow(c, [[900, 380], [790, 420], [700, 470]], RED, 12);
  line(c, [[300, 470], [660, 470]], 12, RED);
};

const t5 = (c: Ctx) => {
  ground(c);
  // spectacles
  shadow(c, 310, 540, 230, 20);
  shape(c, () => ell(c, 170, 400, 90, 90), COL.glass, 12); shape(c, () => ell(c, 400, 400, 90, 90), COL.glass, 12);
  line(c, [[260, 390], [310, 380]], 10); line(c, [[80, 390], [30, 340]], 10); line(c, [[490, 390], [540, 340]], 10);
  // magnifying glass
  magnifier(c, 780, 360, 130, () => { c.fillStyle = "#e6f3fb"; c.fillRect(600, 200, 400, 400); }, 0.9);
  // camera
  shape(c, () => rrect(c, 120, 640, 420, 270, 30), COL.teal, 6); shape(c, () => rrect(c, 180, 610, 100, 40, 8), COL.tealDk, 6);
  shape(c, () => ell(c, 330, 775, 100, 100), COL.steelDk, 6); shape(c, () => ell(c, 330, 775, 70, 70), "#4a5d78", 5); shape(c, () => ell(c, 330, 775, 34, 34), COL.glass, 4); shine(c, [[295, 745], [315, 725]], 8);
  // a lens, drawn big on the right
  const lensShape = () => { c.moveTo(780, 620); c.quadraticCurveTo(880, 760, 780, 900); c.quadraticCurveTo(680, 760, 780, 620); c.closePath(); };
  shadow(c, 800, 915, 120, 14); shape(c, lensShape, COL.glass, 6); shine(c, [[745, 700], [740, 820]], 9);
};

const t8 = (c: Ctx) => {
  ground(c);
  const lensShape = () => { c.moveTo(500, 220); c.quadraticCurveTo(700, 540, 500, 860); c.quadraticCurveTo(300, 540, 500, 220); c.closePath(); };
  for (const y of [300, 420, 540, 660, 780]) {
    const k = (y - 540) / 240; ray(c, [[40, y], [500 - Math.abs(k) * 14, y]], 8);
    ray(c, [[500, y], [850, 540 - 0.0 * k]], 8);
  }
  shape(c, lensShape, COL.glass, 8); shine(c, [[420, 420], [410, 650]], 10);
  shape(c, () => ell(c, 850, 540, 26, 26), COL.yellow, 5);
};

const t12 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 580, 540, 330, 330), WHITE, 7);
  shape(c, () => { c.moveTo(310, 400); c.quadraticCurveTo(190, 540, 310, 680); c.quadraticCurveTo(420, 540, 310, 400); c.closePath(); }, COL.drop, 6);
  shape(c, () => rrect(c, 330, 345, 40, 90, 16), COL.brown, 5); shape(c, () => rrect(c, 330, 645, 40, 90, 16), COL.brown, 5);
  shape(c, () => ell(c, 410, 540, 40, 100), COL.yellow, 6);
  ray(c, [[40, 360], [380, 420], [800, 540]], 8); ray(c, [[40, 700], [380, 660], [800, 540]], 8);
  shape(c, () => ell(c, 800, 540, 16, 16), COL.red, 4);
};

const t13 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 960, 340, 26);
  shape(c, () => rrect(c, 250, 880, 520, 70, 22), COL.steelDk, 6);
  shape(c, () => { c.moveTo(740, 880); c.lineTo(740, 660); c.quadraticCurveTo(760, 380, 560, 340); c.lineTo(500, 440); c.quadraticCurveTo(640, 480, 640, 700); c.lineTo(640, 880); c.closePath(); }, COL.steel, 6);
  c.save(); c.translate(430, 400); c.rotate(-0.28);
  shape(c, () => rrect(c, -70, -200, 140, 360, 14), COL.steelDk, 6); shape(c, () => rrect(c, -50, -270, 100, 90, 10), INK, 6);
  shape(c, () => rrect(c, -40, 160, 80, 70, 8), COL.black, 6);
  c.restore();
  shape(c, () => rrect(c, 290, 760, 280, 40, 8), COL.steel, 6);
  shape(c, () => rrect(c, 410, 820, 40, 60, 4), COL.steelDk, 0);
  eye(c, 300, 140, 50);
};

const e9 = (c: Ctx) => {
  c.fillStyle = "#1d1a3a"; c.fillRect(0, 0, D, D);
  const r = rnd(9); for (let i = 0; i < 70; i++) { c.fillStyle = "#fff"; c.globalAlpha = 0.5 + r() * 0.4; c.beginPath(); c.arc(r() * D, r() * D, 2 + r() * 2.5, 0, 7); c.fill(); } c.globalAlpha = 1;
  // a cluster of galaxies in the middle
  for (const [x, y, rx, a] of [[540, 520, 70, 0.3], [470, 450, 46, 1], [620, 600, 54, 2], [600, 440, 40, 0.5], [480, 610, 44, 1.5], [560, 530, 30, 0]]) shape(c, () => ell(c, x, y, rx, rx * 0.5, a), COL.yellow, 5);
  // far galaxy at right, Earth at left
  shape(c, () => ell(c, 960, 540, 54, 24, -0.4), COL.purple, 5);
  shape(c, () => ell(c, 100, 540, 56, 56), COL.blue, 6); shape(c, () => ell(c, 92, 530, 22, 18, 0.5), COL.green, 3);
  ray(c, [[920, 520], [800, 420], [660, 330], [480, 290], [300, 340], [160, 510]], 8);
  ray(c, [[920, 560], [800, 660], [660, 750], [480, 790], [300, 740], [160, 570]], 8);
  line(c, [[160, 510], [140, 480]], 0, COL.yellow);
  arrow(c, [[300, 340], [200, 410]], RED, 8); arrow(c, [[300, 740], [200, 670]], RED, 8);
};

export const ic_lightRefractionL3 = cards("sci.light.refraction.L3 cards", [intro, summary, e1, e2, e3, a1, a2, a3, a4, a5, p1, c2, t0, t2, t4, t5, t8, t12, t13, e9]);
