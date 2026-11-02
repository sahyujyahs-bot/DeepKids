import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, plate, hand, person, write, cards } from "./flatKit";

// TEETH L2 · set-up cards for the eggshell test and the root test, then card pictures.
const DOUGH = "#e9d3a4", DOUGHDK = "#c9ad78", VIN = "#f3dfae", LEMON = "#f5de5c", MILK = "#fbf7ee", SUGAR = "#b4d9f2";
const ENAMEL = "#fbf8f0", DENTINE = "#f0c75e", PULP = "#e0564a", GUM = "#f29ab4", GUMDK = "#d97a97", SHELL = "#f6efe3";

// a piece of eggshell, flat (hard) or curled (soft)
const chip = (c: Ctx, x: number, y: number, s: number, rot = 0, bent = false) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  if (bent) shape(c, () => { c.moveTo(-s, -s * 0.5); c.quadraticCurveTo(0, s * 1.2, s, -s * 0.5); c.lineTo(s * 0.6, -s * 0.5); c.quadraticCurveTo(0, s * 0.45, -s * 0.6, -s * 0.5); c.closePath(); }, SHELL, 5);
  else shape(c, () => polyP(c, [[-s, -s * 0.3], [-s * 0.3, -s * 0.6], [s * 0.6, -s * 0.5], [s, s * 0.1], [s * 0.4, s * 0.6], [-s * 0.6, s * 0.45]]), SHELL, 5);
  c.restore();
};
const bubble = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.85)", 2.5); };
// a torch, its lens centre at (x, y) pointing at angle an, and a beam of light len long
const torch = (c: Ctx, x: number, y: number, an: number, s = 1, len = 0) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  if (len) { c.globalAlpha = 0.35; shape(c, () => polyP(c, [[0, -40], [len / s, -40 - len / s * 0.32], [len / s, 40 + len / s * 0.32], [0, 40]]), COL.yellow, 0); c.globalAlpha = 1; }
  shape(c, () => rrect(c, -210, -30, 160, 60, 14), COL.steel);
  shade(c, () => rrect(c, -210, -30, 160, 60, 14), COL.steelDk, 0, 20);
  shape(c, () => polyP(c, [[-60, -30], [0, -46], [0, 46], [-60, 30]]), COL.steel);
  shape(c, () => rrect(c, -12, -46, 14, 92, 4), COL.yellow, 5);
  shape(c, () => rrect(c, -170, -20, 24, 40, 6), COL.red, 4);
  c.restore();
};
// a pencil: its eraser end at (x, y), pointing at angle an, len long
const pencil = (c: Ctx, x: number, y: number, len: number, an: number, alpha = 1) => {
  c.save(); c.translate(x, y); c.rotate(an); c.globalAlpha = alpha;
  shape(c, () => rrect(c, 0, -18, len - 50, 36, 4), COL.yellow);
  shade(c, () => rrect(c, 0, -18, len - 50, 36, 4), COL.orange, 0, 14, 0.5);
  shape(c, () => rrect(c, 0, -18, 34, 36, 4), COL.pink);
  shape(c, () => polyP(c, [[len - 50, -18], [len, 0], [len - 50, 18]]), COL.wood);
  shape(c, () => polyP(c, [[len - 18, -6], [len, 0], [len - 18, 6]]), COL.black, 3);
  c.restore();
};
// a thick round block of dough on a steel plate; its top centre at (x, y), radius r, height h
const dough = (c: Ctx, x: number, y: number, r: number, h: number) => {
  plate(c, x, y + h + 40, r * 1.5, r * 0.5);
  shape(c, () => { c.moveTo(x - r, y); c.lineTo(x - r, y + h); c.bezierCurveTo(x - r, y + h + r * 0.45, x + r, y + h + r * 0.45, x + r, y + h); c.lineTo(x + r, y); c.closePath(); }, DOUGH);
  shade(c, () => { c.moveTo(x - r, y); c.lineTo(x - r, y + h); c.bezierCurveTo(x - r, y + h + r * 0.45, x + r, y + h + r * 0.45, x + r, y + h); c.lineTo(x + r, y); c.closePath(); }, DOUGHDK, r * 0.5, 0);
  shape(c, () => ell(c, x, y, r, r * 0.33), "#f1e0b8");
};
// a vertical ruler, 0 at the top (x, y), cm long, px per cm
const rulerV = (c: Ctx, x: number, y: number, cm: number, px: number) => {
  shape(c, () => rrect(c, x, y - 20, 90, cm * px + 40, 6), COL.wood);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let mm = 0; mm <= cm * 10; mm++) { const yy = y + mm * px / 10, w = mm % 10 === 0 ? 34 : mm % 5 === 0 ? 24 : 12; c.lineWidth = mm % 10 === 0 ? 4 : 2.5; c.beginPath(); c.moveTo(x, yy); c.lineTo(x + w, yy); c.stroke(); }
  for (let i = 0; i <= cm; i++) write(c, String(i), x + 48, y + i * px - 14, 28, INK, 4);
};
// a tooth seen from the front: (x, y) is the neck (where crown meets gum), w crown width, h crown height
const tooth = (c: Ctx, x: number, y: number, w: number, h: number, roots = 1, kind: "flat" | "point" | "bumps2" | "bumps4" = "flat", rootLen = h) => {
  const root = (rx: number, rw: number) => { c.moveTo(rx - rw / 2, y); c.quadraticCurveTo(rx - rw * 0.45, y + rootLen * 0.85, rx, y + rootLen); c.quadraticCurveTo(rx + rw * 0.45, y + rootLen * 0.85, rx + rw / 2, y); c.closePath(); };
  if (roots === 1) shape(c, () => root(x, w * 0.7), SHELL, 5); else { shape(c, () => root(x - w * 0.27, w * 0.4), SHELL, 5); shape(c, () => root(x + w * 0.27, w * 0.4), SHELL, 5); }
  const crown = () => {
    c.moveTo(x - w / 2, y); c.lineTo(x - w / 2, y - h * 0.7);
    if (kind === "point") { c.quadraticCurveTo(x - w / 2, y - h, x, y - h * 1.25); c.quadraticCurveTo(x + w / 2, y - h, x + w / 2, y - h * 0.7); }
    else if (kind === "flat") { c.quadraticCurveTo(x - w / 2, y - h, x - w * 0.3, y - h); c.lineTo(x + w * 0.3, y - h); c.quadraticCurveTo(x + w / 2, y - h, x + w / 2, y - h * 0.7); }
    else { const n = kind === "bumps2" ? 2 : 4, bw = (w * 0.7) / n; c.quadraticCurveTo(x - w / 2, y - h, x - w * 0.35, y - h); for (let i = 0; i < n; i++) { const b0 = x - w * 0.35 + bw * i; c.quadraticCurveTo(b0 + bw * 0.5, y - h * 0.8, b0 + bw, y - h); } c.quadraticCurveTo(x + w / 2, y - h, x + w / 2, y - h * 0.7); }
    c.lineTo(x + w / 2, y); c.closePath();
  };
  shape(c, crown, ENAMEL); shade(c, crown, "#d9d2c3", w * 0.2, 0, 0.5); shine(c, [[x - w * 0.3, y - h * 0.75], [x - w * 0.3, y - h * 0.35]], 7);
};
// a tooth cut in half: the three layers, two roots, in the gum. (x, y) neck centre, w crown width, h crown height
const section = (c: Ctx, x: number, y: number, w: number, h: number, outer: string, mid: string, core: string, nerve = true) => {
  const crown = (dw: number, dh: number) => () => { const ww = w - dw, hh = h - dh; c.moveTo(x - ww / 2, y); c.lineTo(x - ww / 2, y - hh * 0.72); c.quadraticCurveTo(x - ww / 2, y - hh, x - ww * 0.3, y - hh); c.quadraticCurveTo(x, y - hh * 0.8, x + ww * 0.3, y - hh); c.quadraticCurveTo(x + ww / 2, y - hh, x + ww / 2, y - hh * 0.72); c.lineTo(x + ww / 2, y); c.closePath(); };
  const root = (rx: number, rw: number, rl: number) => () => { c.moveTo(rx - rw / 2, y + 2); c.quadraticCurveTo(rx - rw * 0.45, y + rl * 0.85, rx, y + rl); c.quadraticCurveTo(rx + rw * 0.45, y + rl * 0.85, rx + rw / 2, y + 2); c.closePath(); };
  // gum
  shape(c, () => rrect(c, x - w * 1.3, y, w * 2.6, h * 1.5, 30), GUM);
  shade(c, () => rrect(c, x - w * 1.3, y, w * 2.6, h * 1.5, 30), GUMDK, 0, h * 0.4, 0.4);
  for (const s of [-1, 1]) shape(c, root(x + s * w * 0.27, w * 0.4, h * 1.05), mid, 5);
  shape(c, crown(0, 0), outer);
  shape(c, crown(w * 0.22, h * 0.22), mid, 4);
  shape(c, () => { const ww = w * 0.3, hh = h * 0.45; c.moveTo(x - ww / 2, y); c.lineTo(x - ww / 2, y - hh * 0.7); c.quadraticCurveTo(x - ww / 2, y - hh, x, y - hh); c.quadraticCurveTo(x + ww / 2, y - hh, x + ww / 2, y - hh * 0.7); c.lineTo(x + ww / 2, y); c.closePath(); }, core, 4);
  for (const s of [-1, 1]) { shape(c, root(x + s * w * 0.27, w * 0.12, h * 0.85), core, 3); if (nerve) line(c, [[x + s * w * 0.27, y + h * 0.85], [x + s * w * 0.3, y + h * 1.3]], 5, core); }
  shape(c, () => rrect(c, x - w * 1.3, y - 10, w * 2.6, 20, 8), GUM, 0); line(c, [[x - w * 1.3, y], [x - w / 2, y]], 6); line(c, [[x + w / 2, y], [x + w * 1.3, y]], 6);
};
// a big head (no mouth; add one with mouth()), face centre (x, y), radius r
const bigHead = (c: Ctx, x: number, y: number, r: number, adult = false) => {
  const skin = adult ? SKIN.adult : SKIN.child, cloth = adult ? CLOTH.adult : CLOTH.child;
  shape(c, () => rrect(c, x - r * 1.5, y + r * 1.1, r * 3, r * 2, r * 0.6), cloth);
  shape(c, () => rrect(c, x - r * 0.3, y + r * 0.7, r * 0.6, r * 0.6, r * 0.1), skin, 5);
  shape(c, () => ell(c, x, y, r, r * 1.05), skin);
  shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.02, y); c.closePath(); }, CLOTH.hair, 5);
  if (!adult) shape(c, () => ell(c, x + r * 0.95, y - r * 0.2, r * 0.32, r * 0.55), CLOTH.hair, 4);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.38, y + r * 0.05, r * 0.09, r * 0.12), INK, 0);
};
// an open mouth showing the upper teeth; gap = index of a missing tooth (0..5), with a new edge showing
const mouth = (c: Ctx, x: number, y: number, w: number, h: number, gap = -1) => {
  shape(c, () => ell(c, x, y, w / 2 + 16, h / 2 + 16), "#c9524a");
  shape(c, () => ell(c, x, y, w / 2, h / 2), "#6b2030", 0);
  c.save(); c.beginPath(); ell(c, x, y, w / 2, h / 2); c.clip();
  shape(c, () => ell(c, x, y + h * 0.55, w * 0.4, h * 0.3), COL.pink, 4);
  const n = 6, tw = (w * 0.9) / n;
  for (let i = 0; i < n; i++) { const tx = x - w * 0.45 + tw * i + 3, th = gap === i ? h * 0.14 : h * (i === 0 || i === 5 ? 0.36 : 0.46); shape(c, () => rrect(c, tx, y - h / 2 - 20, tw - 6, th + 20, 8), WHITE, 4); }
  c.restore();
};
// a tally: groups of five marks starting at (x, y)
const tally = (c: Ctx, x: number, y: number, n: number, col = INK) => {
  for (let i = 0; i < n; i++) { const g = Math.floor(i / 5), k = i % 5, gx = x + g * 90; if (k < 4) line(c, [[gx + k * 16, y], [gx + k * 16, y + 46]], 5, col); else line(c, [[gx - 6, y + 40], [gx + 56, y + 6]], 5, col); }
};

// ---------------------------------------------------------------- set-up cards
// e1.0 five labelled glasses: water, sugar water, milk, lemon juice, vinegar
const e1s0 = (c: Ctx) => {
  ground(c);
  const liq = [COL.water, SUGAR, MILK, LEMON, VIN];
  for (let i = 0; i < 5; i++) {
    const x = 150 + i * 195; glass(c, x, 700, 150, 240, 0.32, liq[i]);
    shape(c, () => rrect(c, x - 62, 760, 124, 100, 10), COL.paper, 5);
    if (i === 0) shape(c, () => { c.moveTo(x, 778); c.quadraticCurveTo(x + 22, 812, x + 22, 826); c.arc(x, 826, 22, 0, Math.PI); c.quadraticCurveTo(x - 22, 812, x, 778); c.closePath(); }, COL.water, 4);
    if (i === 1) { shape(c, () => rrect(c, x - 26, 790, 52, 48, 6), WHITE, 4); for (let k = 0; k < 6; k++) shape(c, () => ell(c, x - 16 + (k % 3) * 16, 806 + Math.floor(k / 3) * 18, 3, 3), COL.grey, 0); }
    if (i === 2) { shape(c, () => polyP(c, [[x - 20, 846], [x - 20, 796], [x - 10, 782], [x + 10, 782], [x + 20, 796], [x + 20, 846]]), MILK, 4); shape(c, () => rrect(c, x - 10, 774, 20, 10, 2), COL.blue, 3); }
    if (i === 3) { shape(c, () => ell(c, x, 814, 30, 30), LEMON, 4); for (let k = 0; k < 6; k++) line(c, [[x, 814], [x + Math.cos(k * 1.047) * 24, 814 + Math.sin(k * 1.047) * 24]], 3, COL.orange); }
    if (i === 4) { shape(c, () => polyP(c, [[x - 18, 846], [x - 18, 800], [x - 8, 786], [x - 8, 776], [x + 8, 776], [x + 8, 786], [x + 18, 800], [x + 18, 846]]), COL.brown, 4); shape(c, () => rrect(c, x - 12, 810, 24, 22, 3), COL.paper, 2); }
  }
};
// e1.1 fingers dropping a piece of shell into a glass
const e1s1 = (c: Ctx) => {
  ground(c);
  glass(c, 620, 880, 340, 500, 0.35, VIN);
  hand(c, 300, 230, 0.75, 1.7);
  chip(c, 470, 330, 40, 0.5);
  arrow(c, [[520, 420], [600, 620]]);
  chip(c, 650, 760, 36, 0.3);
};
// e1.2 a torch from the side: bubbles on the shell in the vinegar
const e1s2 = (c: Ctx) => {
  ground(c);
  torch(c, 300, 560, 0, 1.1, 180);
  glass(c, 660, 840, 320, 480, 0.62, VIN);
  chip(c, 660, 790, 52, 0.2);
  const pts = [[610, 770], [640, 740], [690, 745], [720, 775], [600, 690], [660, 640], [700, 600], [630, 560], [680, 500], [650, 460], [700, 420]];
  pts.forEach(([x, y], i) => bubble(c, x, y, 7 + (i % 3) * 3));
  shine(c, [[480, 450], [560, 560]], 7);
};
// e1.3 next day: a soft bendy shell from the vinegar, a hard one from the water
const e1s3 = (c: Ctx) => {
  ground(c);
  glass(c, 180, 420, 130, 200, 0.3, COL.water); glass(c, 900, 420, 130, 200, 0.3, VIN);
  shadow(c, 250, 760, 180, 30);
  chip(c, 230, 720, 130, 0.1);
  hand(c, 560, 740, 0.15, 2, SKIN.child, CLOTH.child, true);
  chip(c, 840, 700, 130, 0.1, true);
  arrow(c, [[720, 600], [800, 660]]);
};
// e2.0 a thick dough block on a steel plate
const e2s0 = (c: Ctx) => { ground(c); dough(c, 540, 420, 300, 260); };
// e2.1 two pencils in the dough, 4 cm and 1 cm deep, a ruler beside
const e2s1 = (c: Ctx) => {
  ground(c);
  dough(c, 440, 440, 280, 250);
  pencil(c, 330, 440 + 200, 440, -Math.PI / 2, 0.4);
  pencil(c, 560, 440 + 50, 440, -Math.PI / 2, 0.4);
  c.save(); c.beginPath(); c.rect(0, 0, D, 440); c.clip();
  pencil(c, 330, 440 + 200, 440, -Math.PI / 2); pencil(c, 560, 440 + 50, 440, -Math.PI / 2);
  c.restore();
  rulerV(c, 830, 440, 5, 50);
  write(c, "4 cm", 170, 540, 44, RED, 7); arrow(c, [[300, 560], [300, 640]], RED, 7);
  write(c, "1 cm", 600, 300, 44, RED, 7); arrow(c, [[560, 290], [560, 230]], RED, 7);
};
// the root test: a finger taps the short pencil and it tips over (also flow.e2)
const tap = (c: Ctx, withHand: boolean) => {
  ground(c);
  dough(c, 540, 480, 300, 240);
  pencil(c, 380, 480 + 200, 440, -Math.PI / 2, 0.4);
  c.save(); c.beginPath(); c.rect(0, 0, D, 480); c.clip(); pencil(c, 380, 480 + 200, 440, -Math.PI / 2); c.restore();
  pencil(c, 700, 480 + 40, 440, -Math.PI / 2 + 0.75);
  if (withHand) hand(c, 1000, 360, Math.PI + 0.15, 1.4, SKIN.child, CLOTH.child, true);
  arrow(c, [[720, 160], [860, 220], [930, 330]]);
};
const e2s2 = (c: Ctx) => tap(c, true);

// ---------------------------------------------------------------- card pictures
// flow.e1 a cracked egg and a glass of vinegar with a shell piece fizzing
const flowE1 = (c: Ctx) => {
  ground(c);
  shadow(c, 300, 850, 190, 40);
  shape(c, () => { c.moveTo(300, 420); c.bezierCurveTo(500, 420, 520, 720, 440, 790); c.bezierCurveTo(380, 850, 220, 850, 160, 790); c.bezierCurveTo(80, 720, 100, 420, 300, 420); c.closePath(); }, SHELL);
  shade(c, () => { c.moveTo(300, 420); c.bezierCurveTo(500, 420, 520, 720, 440, 790); c.bezierCurveTo(380, 850, 220, 850, 160, 790); c.bezierCurveTo(80, 720, 100, 420, 300, 420); c.closePath(); }, "#d9d2c3", 50, 20, 0.5);
  line(c, [[150, 640], [210, 600], [250, 650], [310, 600], [360, 650], [420, 610], [450, 660]], 6);
  glass(c, 760, 860, 340, 520, 0.6, VIN);
  chip(c, 760, 800, 56, 0.2);
  [[700, 760], [810, 770], [730, 680], [790, 620], [740, 560], [800, 500], [760, 440], [820, 400]].forEach(([x, y], i) => bubble(c, x, y, 7 + (i % 3) * 3));
};
const flowE2 = (c: Ctx) => tap(c, false);
// flow.a1 a grown-up shines a torch into the child's mouth
const flowA1 = (c: Ctx) => {
  ground(c);
  bigHead(c, 420, 470, 200);
  mouth(c, 420, 570, 190, 115);
  torch(c, 753, 583, Math.PI - 0.25, 1, 300);
  hand(c, 960, 530, Math.PI - 0.25, 1.4, SKIN.adult, CLOTH.adult);
};
// flow.a2 the dough tooth cut in half: red middle, yellow layer, thin white top
const flowA2 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 760, 420, 130);
  section(c, 540, 600, 360, 300, "#f4efe4", "#e6a52a", "#b7355b", false);
};
// flow.a3 a tally sheet on the fridge: sweet and sour
const flowA3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 120, -40, 840, 1180, 30), "#e8eef2");
  shape(c, () => rrect(c, 880, 300, 40, 420, 16), COL.steel);
  shadow(c, 520, 560, 300, 330);
  shape(c, () => rrect(c, 200, 200, 620, 700, 10), COL.paper, 5);
  shape(c, () => ell(c, 510, 210, 28, 28), COL.red, 4);
  line(c, [[510, 240], [510, 900]], 5); line(c, [[200, 380], [820, 380]], 5);
  shape(c, () => ell(c, 355, 300, 50, 50), COL.brown, 5); for (let k = 0; k < 7; k++) shape(c, () => ell(c, 335 + (k % 3) * 20, 282 + Math.floor(k / 3) * 20, 4, 4), COL.soilDk, 0);
  shape(c, () => ell(c, 665, 300, 56, 44, 0.3), LEMON, 5); shape(c, () => ell(c, 712, 282, 8, 6), COL.green, 3);
  tally(c, 250, 420, 13); tally(c, 250, 520, 3);
  tally(c, 560, 420, 9);
  line(c, [[800, 660], [850, 760], [880, 870]], 4);
  pencil(c, 870, 900, 240, -2.1);
};
// flow.a4 a gap: the new tooth's white edge showing
const flowA4 = (c: Ctx) => {
  ground(c);
  bigHead(c, 540, 480, 250);
  mouth(c, 540, 620, 260, 150, 2);
  hand(c, 230, 840, -0.6, 1.5);
};
// flow.p1 the child with the family tooth book; an older grown-up points at their own teeth
const flowP1 = (c: Ctx) => {
  ground(c);
  person(c, 330, 980, 540, { armL: [1.4, -0.2], armR: [Math.PI - 1.4, Math.PI + 0.2] });
  const bx = 330, by = 980 - 540 * 0.74 + 540 * 0.17;
  shape(c, () => rrect(c, bx - 95, by - 70, 190, 140, 8), COL.paper, 5);
  line(c, [[bx - 95, by - 70], [bx - 95, by + 70]], 10);
  tooth(c, bx - 10, by + 20, 56, 54, 1, "flat", 30); tooth(c, bx + 50, by + 20, 64, 54, 2, "bumps2", 30);
  for (const s of [-1, 1]) shape(c, () => ell(c, bx + s * 41, by + 20, 20, 20), SKIN.child, 5);
  person(c, 760, 980, 700, { adult: true, armL: [Math.PI * 0.6, Math.PI * 0.5], armR: [-0.85, Math.PI] });
  const hy = 980 - 700 * 0.74 - 700 * 0.13 * 1.05;
  shape(c, () => rrect(c, 760 - 36, hy + 700 * 0.13 * 0.3, 72, 20, 6), WHITE, 3);
  for (let k = 1; k < 4; k++) line(c, [[760 - 36 + k * 18, hy + 700 * 0.13 * 0.3], [760 - 36 + k * 18, hy + 700 * 0.13 * 0.3 + 20]], 2);
  line(c, [[700, hy - 90], [780, hy - 100]], 5, COL.grey); line(c, [[690, hy - 60], [700, hy - 30]], 5, COL.grey);
};
// expl.3 inside a tooth: enamel, dentine, pulp with its nerve, roots in the gum
const expl3 = (c: Ctx) => {
  ground(c);
  section(c, 540, 600, 400, 360, ENAMEL, DENTINE, PULP);
};
// expl.1 how a milk tooth falls out: the adult tooth pushes up, the milk root melts away
const expl1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 540, 960, 520, 30), GUM);
  shade(c, () => rrect(c, 60, 540, 960, 520, 30), GUMDK, 0, 160, 0.4);
  // the adult tooth below, still in the gum
  tooth(c, 540, 860, 300, 280, 2, "flat", 150);
  // the milk tooth above, its root worn short and ragged
  shape(c, () => { c.moveTo(455, 540); c.lineTo(470, 600); c.lineTo(500, 580); c.lineTo(530, 620); c.lineTo(560, 585); c.lineTo(600, 610); c.lineTo(625, 540); c.closePath(); }, "#eee6d6", 5);
  shape(c, () => { c.moveTo(430, 540); c.lineTo(430, 380); c.quadraticCurveTo(430, 300, 490, 300); c.lineTo(590, 300); c.quadraticCurveTo(650, 300, 650, 380); c.lineTo(650, 540); c.closePath(); }, ENAMEL);
  shine(c, [[470, 340], [470, 450]], 7);
  shape(c, () => rrect(c, 60, 530, 960, 20, 8), GUM, 0); line(c, [[60, 540], [430, 540]], 6); line(c, [[650, 540], [1020, 540]], 6);
  arrow(c, [[780, 820], [780, 420]]);
  arrow(c, [[300, 820], [300, 420]]);
};
// expl.2 four kinds of teeth: incisor, canine, premolar, molar
const expl2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 600, 1000, 420, 30), GUM);
  shade(c, () => rrect(c, 40, 600, 1000, 420, 30), GUMDK, 0, 150, 0.4);
  tooth(c, 150, 600, 150, 240, 1, "flat", 220);
  tooth(c, 360, 600, 150, 240, 1, "point", 260);
  tooth(c, 590, 600, 200, 220, 2, "bumps2", 220);
  tooth(c, 870, 600, 290, 210, 2, "bumps4", 210);
  shape(c, () => rrect(c, 40, 590, 1000, 20, 8), GUM, 0);
  line(c, [[40, 600], [75, 600]], 6); line(c, [[225, 600], [285, 600]], 6); line(c, [[435, 600], [490, 600]], 6); line(c, [[690, 600], [725, 600]], 6); line(c, [[1015, 600], [1040, 600]], 6);
};

export const ic_bodyTeethL2 = cards("sci.body.teeth.L2", [e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, flowE1, flowE2, flowA1, flowA2, flowA3, flowA4, flowP1, expl3, expl1, expl2]);
