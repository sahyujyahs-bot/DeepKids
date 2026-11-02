import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, seed, write, cards } from "./flatKit";

// sci.senses.perception.L3 · picture cards (intro, cover, experiments, activities, project, challenges, terms, explanations).
// Child and grown-up are the same as on the set-up cards.

const limb = (c: Ctx, pts: number[][], w: number, fill: string) => { line(c, pts, w + 10, INK); line(c, pts, w, fill); };
const dash = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w = 7, col: string = INK, on = 22, off = 16) => {
  const L = Math.hypot(x2 - x1, y2 - y1), n = Math.floor(L / (on + off)), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
  for (let i = 0; i <= n; i++) { const s = i * (on + off), e = Math.min(L, s + on); line(c, [[x1 + ux * s, y1 + uy * s], [x1 + ux * e, y1 + uy * e]], w, col); }
};
const sheet = (c: Ctx, x: number, y: number, w: number, h: number, fill: string = COL.paper) => {
  shape(c, () => rrect(c, x + 14, y + 16, w, h, 18), "rgba(43,35,64,0.16)", 0);
  shape(c, () => rrect(c, x, y, w, h, 18), fill, 6);
};
// a line with arrowheads (<-->, looks shorter) or open fins (>--<, looks longer), from x1 to x2 at y
const finLine = (c: Ctx, x1: number, x2: number, y: number, open: boolean, w = 11, col: string = INK, fl = 56) => {
  const s = open ? -1 : 1;
  line(c, [[x1, y], [x2, y]], w, col);
  for (const [x, d] of [[x1, 1], [x2, -1]] as number[][]) { line(c, [[x + s * d * fl, y - fl * 0.7], [x, y], [x + s * d * fl, y + fl * 0.7]], w, col); }
};
const ruler = (c: Ctx, x: number, y: number, w: number) => {
  shape(c, () => rrect(c, x, y, w, 90, 8), COL.wood, 6);
  for (let i = 0; i <= 20; i++) { const tx = x + 20 + (i * (w - 40)) / 20; line(c, [[tx, y], [tx, y + (i % 5 === 0 ? 40 : 24)]], i % 5 === 0 ? 5 : 3); }
};
const eye = (c: Ctx, x: number, y: number, r: number, look = 0) => {
  shape(c, () => ell(c, x, y, r, r * 0.72), WHITE, 6);
  shape(c, () => ell(c, x + look, y, r * 0.42, r * 0.42), COL.blue, 5);
  shape(c, () => ell(c, x + look, y, r * 0.2, r * 0.2), INK, 0);
  shape(c, () => ell(c, x + look - r * 0.12, y - r * 0.12, r * 0.07, r * 0.07), WHITE, 0);
};
const brain = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - s, y + s * 0.1); c.bezierCurveTo(x - s * 1.1, y - s * 0.9, x - s * 0.2, y - s * 1.0, x, y - s * 0.75); c.bezierCurveTo(x + s * 0.2, y - s * 1.0, x + s * 1.15, y - s * 0.9, x + s, y + s * 0.1); c.bezierCurveTo(x + s * 0.95, y + s * 0.6, x + s * 0.3, y + s * 0.7, x + s * 0.1, y + s * 0.55); c.lineTo(x - s * 0.1, y + s * 0.55); c.bezierCurveTo(x - s * 0.5, y + s * 0.75, x - s * 1.0, y + s * 0.55, x - s, y + s * 0.1); c.closePath(); }, COL.pink, 6);
  for (const p of [[-0.55, -0.3, 0.3], [0.5, -0.35, 0.3], [-0.35, 0.15, 0.28], [0.4, 0.15, 0.28]]) { c.beginPath(); c.arc(x + p[0] * s, y + p[1] * s, p[2] * s, 0.5, 3.6); c.strokeStyle = "#d1658a"; c.lineWidth = 5; c.lineCap = "round"; c.stroke(); }
  line(c, [[x, y - s * 0.7], [x, y + s * 0.4]], 5, "#d1658a");
};
const bubble = (c: Ctx, x: number, y: number, rx: number, ry: number, tx: number, ty: number) => {
  for (const [t, r] of [[0.3, 22], [0.62, 34], [0.9, 18]] as number[][]) { shape(c, () => ell(c, tx + (x - tx) * (1 - t) * 0 + (x - tx) * (1 - t), ty + (y + ry - ty) * (1 - t), r, r), WHITE, 5); }
  shape(c, () => ell(c, x, y, rx, ry), WHITE, 6);
};
const mango = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + s * 0.1, y + s * 0.62, s * 0.7, s * 0.12);
  shape(c, () => ell(c, x, y, s * 0.72, s * 0.55, -0.5), COL.orange, 6);
  shade(c, () => ell(c, x, y, s * 0.72, s * 0.55, -0.5), "#d27c25", -s * 0.3, -s * 0.3, 0.5);
  shine(c, [[x - s * 0.3, y - s * 0.2], [x - s * 0.1, y - s * 0.38]], 7);
  c.beginPath(); ell(c, x, y, s * 0.72, s * 0.55, -0.5); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  line(c, [[x + s * 0.5, y - s * 0.35], [x + s * 0.62, y - s * 0.55]], 6);
  shape(c, () => { c.moveTo(x + s * 0.6, y - s * 0.52); c.quadraticCurveTo(x + s * 0.95, y - s * 0.8, x + s * 1.0, y - s * 0.45); c.quadraticCurveTo(x + s * 0.8, y - s * 0.35, x + s * 0.6, y - s * 0.52); c.closePath(); }, COL.leaf, 5);
};
const sideHead = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 1.1), SKIN.child);
  shape(c, () => { c.moveTo(x + r * 0.95, y - r * 0.15); c.quadraticCurveTo(x + r * 1.28, y + r * 0.15, x + r * 0.95, y + r * 0.3); c.closePath(); }, SKIN.child, 5);
  shape(c, () => { c.moveTo(x - r * 0.98, y + r * 0.1); c.bezierCurveTo(x - r * 1.1, y - r * 1.5, x + r * 0.85, y - r * 1.55, x + r * 0.95, y - r * 0.55); c.quadraticCurveTo(x + r * 0.2, y - r * 0.75, x - r * 0.3, y - r * 0.3); c.quadraticCurveTo(x - r * 0.65, y, x - r * 0.7, y + r * 0.5); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x - r * 0.15, y + r * 0.2, r * 0.16, r * 0.24), SKIN.childDk, 5);
  c.beginPath(); c.arc(x + r * 0.45, y + r * 0.5, r * 0.2, 0.2, 2.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
};
const ball = (c: Ctx, x: number, y: number, r: number, lightTop: boolean, col: string = COL.blue, dk: string = COL.blueDk) => {
  shape(c, () => ell(c, x, y, r, r), col, 6);
  shade(c, () => ell(c, x, y, r, r), dk, 0, lightTop ? -r * 0.55 : r * 0.55, 0.95);
  shade(c, () => ell(c, x, y, r, r), dk, 0, lightTop ? -r * 1.0 : r * 1.0, 0.9);
  c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
const fins2 = (c: Ctx, x: number, y: number, w: number) => { finLine(c, x, x + w, y, false); finLine(c, x, x + w, y + 190, true); };
const tank = (c: Ctx, x: number, y: number, w: number, h: number, legs: number) => {
  for (const s of [-1, 1]) line(c, [[x + s * w * 0.35, y + h], [x + s * w * 0.42, y + h + legs]], 12, INK);
  line(c, [[x - w * 0.35, y + h + 20], [x + w * 0.35, y + h + legs * 0.6]], 5);
  shape(c, () => rrect(c, x - w / 2, y, w, h, h * 0.2), COL.steel, 6);
  shade(c, () => rrect(c, x - w / 2, y, w, h, h * 0.2), COL.steelDk, -w * 0.25, 0, 0.7);
  line(c, [[x - w / 2, y + h * 0.35], [x + w / 2, y + h * 0.35]], 4); line(c, [[x - w / 2, y + h * 0.7], [x + w / 2, y + h * 0.7]], 4);
};
const bird = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => polyP(c, [[x - s * 0.6, y + s * 0.1], [x - s * 1.2, y - s * 0.1], [x - s * 1.1, y + s * 0.3]]), COL.blue, 5);
  shape(c, () => ell(c, x, y, s * 0.7, s * 0.5), COL.yellow, 6);
  shape(c, () => ell(c, x - s * 0.1, y + s * 0.05, s * 0.35, s * 0.22, -0.4), COL.orange, 5);
  shape(c, () => ell(c, x + s * 0.55, y - s * 0.45, s * 0.34, s * 0.34), COL.yellow, 6);
  shape(c, () => polyP(c, [[x + s * 0.85, y - s * 0.52], [x + s * 1.15, y - s * 0.42], [x + s * 0.85, y - s * 0.32]]), COL.orange, 5);
  shape(c, () => ell(c, x + s * 0.62, y - s * 0.5, s * 0.06, s * 0.06), INK, 0);
  line(c, [[x - s * 0.1, y + s * 0.5], [x - s * 0.1, y + s * 0.8]], 6); line(c, [[x + s * 0.2, y + s * 0.5], [x + s * 0.2, y + s * 0.8]], 6);
};
const cage = (c: Ctx, x: number, y: number, w: number, h: number) => {
  // x,y = centre; dome top, flat base
  const t = y - h / 2, b = y + h / 2;
  shape(c, () => { c.moveTo(x - w / 2, b); c.lineTo(x - w / 2, t + h * 0.35); c.quadraticCurveTo(x - w / 2, t, x, t); c.quadraticCurveTo(x + w / 2, t, x + w / 2, t + h * 0.35); c.lineTo(x + w / 2, b); c.closePath(); }, "rgba(255,255,255,0.3)", 6);
  for (const k of [-0.5, -0.25, 0, 0.25, 0.5]) line(c, [[x + k * w * 0.9, b], [x + k * w * 0.9, t + h * (k === 0 ? 0 : 0.12)]], 5);
  line(c, [[x, t], [x, t - h * 0.12]], 6);
  shape(c, () => rrect(c, x - w * 0.55, b - 8, w * 1.1, 30, 8), COL.woodDk, 6);
};
const dog = (c: Ctx, x: number, y: number, s: number, ph: number) => {
  const a = Math.sin(ph) * 0.7, leg = (lx: number, an: number, back = false) => limb(c, [[x + lx * s, y + s * 0.2], [x + lx * s + Math.sin(an) * s * 0.55, y + s * 0.2 + Math.cos(an) * s * 0.55]], s * 0.14, back ? COL.brown : COL.soil);
  leg(-0.6, -a, true); leg(0.5, -a, true);
  limb(c, [[x - s * 0.8, y - s * 0.1], [x - s * 1.2, y - s * 0.4 - Math.abs(a) * s * 0.2]], s * 0.1, COL.brown);
  shape(c, () => ell(c, x, y, s * 0.85, s * 0.38), COL.brown, 6);
  shape(c, () => ell(c, x + s * 0.8, y - s * 0.3, s * 0.32, s * 0.28), COL.brown, 6);
  shape(c, () => ell(c, x + s * 1.1, y - s * 0.22, s * 0.16, s * 0.12), COL.soilDk, 5);
  shape(c, () => ell(c, x + s * 0.7, y - s * 0.2, s * 0.1, s * 0.2, 0.3), COL.soilDk, 4);
  shape(c, () => ell(c, x + s * 0.88, y - s * 0.38, s * 0.05, s * 0.05), INK, 0);
  leg(-0.5, a); leg(0.6, a);
};
const ballFlat = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.red, 5); shine(c, [[x - r * 0.5, y - r * 0.2], [x - r * 0.2, y - r * 0.5]], 5); };
const panelBG = (c: Ctx, col: string = COL.sky) => { ground(c); shape(c, () => rrect(c, 40, 40, 1000, 1000, 28), col, 6); };

const tracks = (c: Ctx, strips: boolean, top = 180, ink = INK) => {
  const lx = (y: number) => 470 - (210 * (y - top)) / (930 - top) * (750 / 750) * 1, rx = (y: number) => 610 + (210 * (y - top)) / (930 - top);
  for (let y = 300; y < 930; y += 120) { const yy = y + (y - 300) * 0.0; line(c, [[lx(yy) - 40, yy], [rx(yy) + 40, yy]], 12 + (yy - 300) / 40, COL.soil); }
  line(c, [[lx(930), 930], [lx(top), top]], 18, ink); line(c, [[rx(930), 930], [rx(top), top]], 18, ink);
  if (strips) for (const y of [330, 780]) shape(c, () => rrect(c, 540 - 85, y - 22, 170, 44, 6), COL.yellow, 6);
  return { lx, rx };
};

// ---------------------------------------------------------------- the pictures
const intro = (c: Ctx) => {
  ground(c);
  person(c, 230, 1000, 650, { armR: [-0.5, -0.2] });
  shape(c, () => rrect(c, 450, 150, 580, 640, 20), COL.paper, 6);
  line(c, [[600, 790], [560, 1010]], 14); line(c, [[880, 790], [920, 1010]], 14);
  finLine(c, 590, 910, 330, false, 12); finLine(c, 590, 910, 560, true, 12);
};
const summary = (c: Ctx) => {
  ground(c);
  sheet(c, 470, 190, 560, 600);
  finLine(c, 600, 900, 360, false, 12); finLine(c, 600, 900, 620, true, 12);
  eye(c, 200, 490, 130, 40);
  for (const dy of [-1, 1]) dash(c, 460, 490 + dy * 200, 330, 490 + dy * 40, 8, COL.yellow);
  ruler(c, 470, 860, 560);
};
const e1 = (c: Ctx) => {
  ground(c);
  sheet(c, 80, 90, 920, 400); sheet(c, 80, 570, 920, 400);
  finLine(c, 240, 780, 210, false); finLine(c, 240, 760, 390, false, 9, RED);
  finLine(c, 240, 780, 690, true); finLine(c, 240, 810, 870, true, 9, RED);
};
const e2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 330, 880, 450, 200, 20), CLOTH.child, 6);
  const f = (x1: number, y1: number, x2: number, y2: number) => { limb(c, [[x1, y1], [x2, y2]], 120, SKIN.child); shape(c, () => ell(c, x2 + (x2 - x1) * 0.02, y2 + 14, 40, 22, Math.atan2(y2 - y1, x2 - x1) - Math.PI / 2 + 0.2), SKIN.childDk, 0); };
  f(700, 960, 465, 430);
  shape(c, () => ell(c, 540, 400, 62, 62), COL.green, 6); shine(c, [[505, 375], [525, 355]], 8);
  f(400, 960, 625, 430);
  shape(c, () => ell(c, 540, 400, 62, 62), COL.green, 0);
  c.save(); c.beginPath(); c.rect(480, 330, 120, 120); c.clip(); shape(c, () => ell(c, 540, 400, 62, 62), COL.green, 6); shine(c, [[505, 375], [525, 355]], 8); c.restore();
  bubble(c, 850, 190, 190, 130, 700, 400);
  shape(c, () => ell(c, 790, 190, 45, 45), COL.green, 6); shape(c, () => ell(c, 905, 190, 45, 45), COL.green, 6);
};
const a1 = (c: Ctx) => {
  ground(c);
  sheet(c, 130, 80, 820, 920);
  const lx = (y: number) => 470 - (210 * (y - 180)) / 750, rx = (y: number) => 610 + (210 * (y - 180)) / 750;
  line(c, [[lx(930), 930], [lx(190), 190]], 14); line(c, [[rx(930), 930], [rx(190), 190]], 14);
  for (const y of [330, 780]) shape(c, () => rrect(c, 455, y - 22, 170, 44, 6), COL.yellow, 6);
  dash(c, 455, 352, 455, 760, 6, RED); dash(c, 625, 352, 625, 760, 6, RED);
};
const a2 = (c: Ctx) => {
  ground(c);
  sheet(c, 70, 100, 940, 880);
  [280, 540, 800].forEach((x) => { ball(c, x, 340, 100, true); ball(c, x, 740, 100, false); });
};
const a3 = (c: Ctx) => {
  ground(c);
  for (const [y, side] of [[300, 0], [740, 1]]) {
    shape(c, () => ell(c, 250, y, 150, 150), COL.paper, 6);
    c.save(); c.beginPath(); ell(c, 250, y, 142, 142); c.clip();
    if (side === 0) bird(c, 235, y + 10, 80); else cage(c, 250, y, 190, 230);
    c.restore();
    for (const s of [-1, 1]) { line(c, [[250 + s * 150, y], [250 + s * 215, y]], 7, COL.brown); }
  }
  arrow(c, [[470, 520], [560, 520]]);
  cage(c, 800, 560, 360, 440);
  bird(c, 800, 610, 100);
  c.save(); c.globalAlpha = 0.35; for (const k of [-0.5, -0.25, 0, 0.25, 0.5]) line(c, [[800 + k * 324, 780], [800 + k * 324, 560 - 220 + (k === 0 ? 0 : 50)]], 5); c.restore();
};
const a4 = (c: Ctx) => {
  ground(c);
  sideHead(c, 240, 540, 190);
  eye(c, 240 + 190 * 0.5, 540 - 15, 28, 8);
  shape(c, () => rrect(c, 410, 460, 260, 120, 10), COL.paper, 6);
  line(c, [[430, 480], [650, 560]], 4); line(c, [[430, 500], [650, 580]], 4);
  shape(c, () => ell(c, 670, 520, 28, 60), COL.steelIn, 6);
  // the open hand, palm to us, with a round hole
  shape(c, () => rrect(c, 760, 450, 220, 300, 60), SKIN.child, 6);
  for (let i = 0; i < 4; i++) shape(c, () => rrect(c, 765 + i * 52, 300 - (i === 1 || i === 2 ? 40 : 0) + (i === 3 ? 30 : 0), 44, 220, 22), SKIN.child, 6);
  shape(c, () => ell(c, 870, 560, 70, 70), "#efe4cf", 6);
  shape(c, () => ell(c, 870, 560, 70, 70), "rgba(255,255,255,0)", 0);
  c.beginPath(); ell(c, 870, 560, 82, 82); c.strokeStyle = RED; c.lineWidth = 8; c.stroke();
  dash(c, 690, 520, 800, 560, 6, COL.yellow);
};
const a5 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 50, 160, 330, 500, 14), COL.grey, 6);
  for (const y of [210, 440]) { c.setLineDash([16, 12]); c.strokeStyle = INK; c.lineWidth = 5; c.strokeRect(100, y, 170, 170); c.setLineDash([]); }
  // scissors
  line(c, [[130, 800], [310, 940]], 12); line(c, [[310, 800], [130, 940]], 12);
  for (const x of [130, 310]) shape(c, () => ell(c, x, 960, 40, 30), RED, 6);
  arrow(c, [[420, 410], [520, 410]]);
  shape(c, () => rrect(c, 560, 90, 440, 420, 14), "#2b2340", 6); shape(c, () => rrect(c, 560, 560, 440, 420, 14), WHITE, 6);
  for (const y of [300, 770]) shape(c, () => rrect(c, 680, y - 85, 200, 170, 6), COL.grey, 6);
};
const a6 = (c: Ctx) => {
  ground(c);
  for (const [cx, R, r] of [[270, 165, 72], [810, 88, 28]]) {
    for (let i = 0; i < 6; i++) { const a = (i * Math.PI) / 3; shape(c, () => ell(c, cx + Math.cos(a) * R, 540 + Math.sin(a) * R, r, r), COL.blue, 6); }
    shape(c, () => ell(c, cx, 540, 46, 46), COL.orange, 6);
  }
  line(c, [[500, 515], [580, 515]], 10, RED); line(c, [[500, 565], [580, 565]], 10, RED);
};
const a7 = (c: Ctx) => {
  ground(c);
  sheet(c, 70, 80, 380, 440); sheet(c, 630, 80, 380, 440);
  shape(c, () => ell(c, 150, 300, 34, 34), COL.red, 6); shape(c, () => ell(c, 930, 300, 34, 34), COL.red, 6);
  arrow(c, [[480, 300], [600, 300]]);
  sheet(c, 70, 580, 940, 400);
  c.globalAlpha = 0.35; shape(c, () => ell(c, 880, 790, 40, 40), COL.red, 6); c.globalAlpha = 1;
  shape(c, () => ell(c, 200, 790, 40, 40), COL.red, 6);
  arrow(c, [[260, 740], [540, 650], [820, 740]]);
};
const p1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 20, 40, 1040, 520, 10), COL.cloth, 6);
  const fr = (i: number, draw: (x: number, y: number) => void) => { const x = 60 + i * 245; shape(c, () => rrect(c, x, 130, 215, 330, 12), COL.paper, 6); draw(x, 130); };
  fr(0, (x, y) => { finLine(c, x + 40, x + 175, y + 100, false, 8, INK, 30); finLine(c, x + 40, x + 175, y + 230, true, 8, INK, 30); });
  fr(1, (x, y) => { ball(c, x + 108, y + 100, 55, true); ball(c, x + 108, y + 235, 55, false); });
  fr(2, (x, y) => { shape(c, () => rrect(c, x + 15, y + 50, 90, 230, 4), INK, 4); shape(c, () => rrect(c, x + 105, y + 50, 90, 230, 4), WHITE, 4); for (const sx of [x + 40, x + 130]) shape(c, () => rrect(c, sx, y + 130, 40, 40, 3), COL.grey, 4); });
  fr(3, (x, y) => { line(c, [[x + 50, y + 300], [x + 90, y + 40]], 8); line(c, [[x + 165, y + 300], [x + 125, y + 40]], 8); for (const [yy, w] of [[110, 50], [250, 90]]) shape(c, () => rrect(c, x + 107 - w / 2, yy, w, 22, 4), COL.yellow, 4); });
  line(c, [[0, 1040], [1080, 1040]], 6);
  person(c, 360, 1040, 520, { adult: true, armR: [-0.6, -0.9] });
  person(c, 700, 1040, 420, { armR: [-0.3, -0.5] });
};
const c1 = (c: Ctx) => {
  ground(c);
  const ys = [0.2, 0.75, 1, 0.75, 0.2];
  ys.forEach((h, i) => { const x = 40 + i * 200; shape(c, () => rrect(c, x, 90, 180, 300, 12), COL.paper, 6); ballFlat(c, x + 40 + i * 25, 340 - h * 200, 28); });
  arrow(c, [[100, 30], [300, 20], [540, 20], [780, 20], [980, 30]], RED, 8);
  for (let i = 7; i >= 0; i--) shape(c, () => rrect(c, 200 + i * 6, 560 + i * 12, 600, 80, 8), i === 0 ? COL.paper : COL.cloth, 5);
  shape(c, () => rrect(c, 200, 700, 620, 70, 10), COL.teal, 6);
  ballFlat(c, 330, 600, 30);
  arrow(c, [[860, 780], [900, 640], [840, 560]]);
};
const c2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 40, 1000, 1000, 24), COL.sky, 6);
  c.save(); c.beginPath(); rrect(c, 40, 40, 1000, 1000, 24); c.clip(); c.fillStyle = COL.greenLt; c.fillRect(40, 760, 1000, 300); line(c, [[40, 760], [1040, 760]], 6); c.restore();
  for (const x of [800, 920]) { shape(c, () => ell(c, x, 700, 60, 70), COL.leaf, 6); line(c, [[x, 760], [x, 700]], 8); }
  tank(c, 540, 470, 200, 120, 110);
  c.save(); c.beginPath(); rrect(c, 40, 40, 1000, 1000, 24); c.clip();
  limb(c, [[-60, 300], [760, 300]], 130, SKIN.child); limb(c, [[-60, 770], [760, 770]], 130, SKIN.child);
  shape(c, () => rrect(c, -80, 240, 220, 590, 10), SKIN.child, 0);
  shape(c, () => rrect(c, -80, 240, 190, 590, 10), CLOTH.child, 6);
  c.restore();
  shape(c, () => rrect(c, 40, 40, 1000, 1000, 24), "rgba(0,0,0,0)", 6);
};
const t0 = (c: Ctx) => {
  ground(c);
  sheet(c, 120, 90, 840, 640);
  finLine(c, 270, 810, 270, false, 13); finLine(c, 270, 810, 560, true, 13);
  line(c, [[480, 380], [600, 380]], 14, RED); line(c, [[480, 450], [600, 450]], 14, RED);
  ruler(c, 120, 850, 840);
};
const t2 = (c: Ctx) => {
  ground(c);
  person(c, 830, 1010, 620, { adult: true });
  person(c, 230, 1010, 520);
  bubble(c, 250, 200, 190, 150, 230, 560);
  shape(c, () => ell(c, 250, 220, 80, 85), SKIN.adult, 6);
  shape(c, () => { c.moveTo(168, 220); c.bezierCurveTo(165, 120, 335, 120, 332, 220); c.quadraticCurveTo(250, 180, 168, 220); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, 222, 225, 8, 11), INK, 0); shape(c, () => ell(c, 278, 225, 8, 11), INK, 0);
  c.beginPath(); c.arc(250, 255, 22, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  for (const dy of [-18, 18]) dash(c, 750, 440 + dy, 320, 560 + dy * 0.2, 8, COL.yellow);
};
const t3 = (c: Ctx) => {
  ground(c);
  sideHead(c, 500, 560, 310);
  eye(c, 640, 540, 45, 10);
  shape(c, () => { c.moveTo(330, 480); c.bezierCurveTo(300, 280, 480, 240, 520, 300); c.bezierCurveTo(600, 250, 700, 320, 660, 440); c.bezierCurveTo(620, 500, 450, 520, 330, 480); c.closePath(); }, COL.pink, 6);
  for (const p of [[400, 380, 40], [520, 360, 40], [600, 410, 34], [450, 450, 30]]) { c.beginPath(); c.arc(p[0], p[1], p[2], 0.5, 3.6); c.strokeStyle = "#d1658a"; c.lineWidth = 5; c.lineCap = "round"; c.stroke(); }
  limb(c, [[630, 535], [560, 500], [430, 470], [345, 470]], 10, COL.yellow);
};
const t4 = (c: Ctx) => {
  ground(c);
  sheet(c, 90, 90, 900, 900);
  line(c, [[210, 920], [450, 190]], 14); line(c, [[870, 920], [630, 190]], 14);
  shape(c, () => ell(c, 540, 520, 180, 180), "rgba(214,236,250,0.6)", 12);
  line(c, [[660, 650], [850, 860]], 40, INK); line(c, [[660, 650], [850, 860]], 24, COL.brown);
  shine(c, [[420, 420], [480, 380]], 12);
};
const t5 = (c: Ctx) => {
  ground(c);
  const xl = (t: number) => 420 * t, xr = (t: number) => 1080 - 420 * t, yt = (t: number) => 40 + 360 * t, yb = (t: number) => 1040 - 400 * t;
  shape(c, () => polyP(c, [[0, 40], [1080, 40], [660, 400], [420, 400]]), COL.cloth, 6);
  shape(c, () => polyP(c, [[0, 1040], [1080, 1040], [660, 640], [420, 640]]), COL.wood, 6);
  shape(c, () => polyP(c, [[0, 40], [420, 400], [420, 640], [0, 1040]]), "#eadfc8", 6);
  shape(c, () => polyP(c, [[1080, 40], [660, 400], [660, 640], [1080, 1040]]), "#d9cdb4", 6);
  shape(c, () => rrect(c, 420, 400, 240, 240, 4), COL.sky, 6);
  const cols = [COL.teal, COL.orange, COL.purple, COL.pink];
  [[0.06, 0.27], [0.36, 0.52], [0.6, 0.7], [0.78, 0.86]].forEach(([a, b], i) => {
    for (const side of [0, 1]) {
      const X = (t: number) => (side ? xr(t) : xl(t)), top = (t: number) => yb(t) - 0.7 * (yb(t) - yt(t));
      shape(c, () => polyP(c, [[X(a), yb(a)], [X(a), top(a)], [X(b), top(b)], [X(b), yb(b)]]), cols[(i + side) % 4], 5);
    }
  });
  for (const k of [0.25, 0.5, 0.7]) line(c, [[xl(k) + 0, yb(k)], [xr(k), yb(k)]], 3);
};
const t6 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[0, 520], [1080, 520], [1080, 1080], [0, 1080]]), COL.greenLt, 0);
  line(c, [[0, 520], [1080, 520]], 6);
  shape(c, () => polyP(c, [[130, 1080], [720, 1080], [830, 520], [790, 520]]), COL.grey, 6);
  person(c, 400, 1030, 560, { adult: true });
  person(c, 640, 760, 300, { adult: true });
  person(c, 790, 620, 160, { adult: true });
  arrow(c, [[530, 1060], [700, 840], [820, 700]], RED, 9);
  person(c, 110, 1030, 300);
  bubble(c, 230, 230, 170, 150, 125, 760);
  person(c, 230, 360, 210, { adult: true });
};
const t7 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 140, 500, 800, 8), "#2b2340", 6); shape(c, () => rrect(c, 540, 140, 500, 800, 8), WHITE, 6);
  for (const x of [290, 790]) shape(c, () => rrect(c, x - 130, 430, 260, 220, 6), COL.grey, 6);
};
const t8 = (c: Ctx) => {
  ground(c);
  ball(c, 290, 540, 200, true); ball(c, 790, 540, 200, false);
};
const filmStrip = (c: Ctx, y: number, n: number, draw: (x: number, y: number, i: number) => void) => {
  shape(c, () => rrect(c, 20, y - 30, 1040, 380, 14), COL.black, 6);
  for (let i = 0; i < n; i++) { const x = 40 + i * (1000 / n); for (const yy of [y - 20, y + 332]) shape(c, () => rrect(c, x + 10, yy, 22, 8, 3), COL.paper, 0); shape(c, () => rrect(c, x, y + 20, 1000 / n - 20, 290, 6), COL.sky, 4); draw(x, y + 20, i); }
};
const t9 = (c: Ctx) => {
  ground(c);
  filmStrip(c, 480, 5, (x, y, i) => { const h = [0.1, 0.65, 1, 0.65, 0.1][i]; ballFlat(c, x + 90, y + 250 - h * 190, 28); });
  arrow(c, Array.from({ length: 13 }, (_, k) => { const a = Math.PI - (k / 12) * Math.PI; return [540 + Math.cos(a) * 420, 440 - Math.sin(a) * 300]; }), RED, 12);
};
const t10 = (c: Ctx) => {
  ground(c);
  for (let i = 0; i < 8; i++) { const x = 35 + (i % 4) * 255, y = 110 + Math.floor(i / 4) * 450; shape(c, () => rrect(c, x, y, 230, 340, 12), COL.paper, i === 0 ? 10 : 5); if (i === 0) { c.beginPath(); c.roundRect?.(x, y, 230, 340, 12); } dog(c, x + 100, y + 190, 80, i * 0.8); }
  c.beginPath(); rrect(c, 35, 110, 230, 340, 12); c.strokeStyle = RED; c.lineWidth = 12; c.stroke();
};
const t13 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[0, 560], [1080, 560], [1080, 1080], [0, 1080]]), COL.greenLt, 0); line(c, [[0, 560], [1080, 560]], 5);
  tank(c, 880, 393, 190, 130, 125);
  person(c, 150, 960, 440, { armR: [-0.6, -0.2] });
  limb(c, [[345, 520], [415, 472]], 28, SKIN.child); limb(c, [[345, 520], [415, 560]], 28, SKIN.child);
  dash(c, 150, 516, 880, 393, 6, RED); dash(c, 150, 516, 880, 639, 6, RED);
};
const e0 = (c: Ctx) => {
  ground(c);
  person(c, 220, 1030, 640);
  for (let i = 0; i < 5; i++) { const a = -2.6 + i * 0.35; line(c, [[220 + Math.cos(a) * 130, 330 + Math.sin(a) * 130], [220 + Math.cos(a) * 190, 330 + Math.sin(a) * 190]], 9, RED); }
  sheet(c, 480, 100, 540, 580);
  finLine(c, 580, 920, 260, false, 12); finLine(c, 580, 920, 480, true, 12);
  ruler(c, 480, 780, 540);
  dash(c, 580, 280, 580, 770, 5, RED); dash(c, 920, 280, 920, 770, 5, RED);
};
const e1x = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 0, 820, 1080, 260, 6), COL.wood, 6);
  mango(c, 150, 720, 150);
  eye(c, 520, 640, 100, 0);
  for (const dy of [-1, 1]) dash(c, 270, 700 + dy * 60, 430, 640 + dy * 40, 8, COL.yellow);
  brain(c, 880, 700, 110);
  limb(c, [[615, 650], [700, 690], [790, 700]], 14, COL.yellow);
  bubble(c, 840, 230, 190, 150, 880, 590);
  mango(c, 840, 250, 100);
  line(c, [[740, 330], [940, 330]], 8);
};
const e2x = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 40, 1000, 1000, 28), COL.sky, 6);
  c.save(); c.beginPath(); rrect(c, 40, 40, 1000, 1000, 28); c.clip(); c.fillStyle = COL.greenLt; c.fillRect(40, 380, 1000, 700); c.restore();
  line(c, [[40, 380], [1040, 380]], 6);
  const lx = (y: number) => 540 - (y - 380) * 0.34, rx = (y: number) => 540 + (y - 380) * 0.34;
  shape(c, () => polyP(c, [[lx(1040), 1040], [rx(1040), 1040], [545, 380], [535, 380]]), COL.grey, 6);
  line(c, [[lx(1040) + 40, 1040], [537, 380]], 14); line(c, [[rx(1040) - 40, 1040], [543, 380]], 14);
  for (const y of [980, 800, 660, 560, 490]) line(c, [[lx(y) + 30, y], [rx(y) - 30, y]], 6 + (y - 380) / 100, COL.soil);
  for (const y of [490, 900]) { const w = 170 * ((y - 380) / 520 * 1.0 + 0.0) * 0 + 170; shape(c, () => rrect(c, 540 - 85, y - 24, 170, 48, 6), COL.yellow, 6); }
  dash(c, 455, 520, 455, 880, 6, RED); dash(c, 625, 520, 625, 880, 6, RED);
};
const e4 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 220, 170, 90, 90), COL.yellow, 6);
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + 0.4; line(c, [[220 + Math.cos(a) * 120, 170 + Math.sin(a) * 120], [220 + Math.cos(a) * 165, 170 + Math.sin(a) * 165]], 9, COL.orange); }
  arrow(c, [[330, 240], [420, 340]], COL.orange, 8);
  line(c, [[40, 800], [1040, 800]], 8);
  // a bump (lit on top) and a dent (lit on the far side)
  c.save(); c.beginPath(); c.rect(80, 400, 420, 400); c.clip(); shape(c, () => ell(c, 290, 800, 200, 200), COL.blue, 6); shade(c, () => ell(c, 290, 800, 200, 200), COL.blueDk, -110, 0, 0.9); c.restore();
  shape(c, () => ell(c, 290, 800, 200, 200), "rgba(0,0,0,0)", 0);
  c.beginPath(); c.arc(290, 800, 200, Math.PI, 2 * Math.PI); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  c.save(); c.beginPath(); c.rect(580, 800, 420, 300); c.clip(); shape(c, () => ell(c, 790, 800, 200, 200), COL.blue, 6); shade(c, () => ell(c, 790, 800, 200, 200), COL.blueDk, 110, 0, 0.9); c.restore();
  c.beginPath(); c.arc(790, 800, 200, 0, Math.PI); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
const e5 = (c: Ctx) => {
  ground(c);
  [0, 1, 2].forEach((i) => { const y = 90 + i * 320; shape(c, () => rrect(c, 70, y, 280, 270, 12), COL.paper, 6); ballFlat(c, 130 + i * 70, y + 200 - [0, 90, 40][i], 32); });
  arrow(c, [[400, 520], [520, 520]]);
  shape(c, () => rrect(c, 570, 200, 440, 640, 16), COL.sky, 8);
  ballFlat(c, 830, 380, 50);
  for (const [x, y] of [[740, 480], [680, 570], [640, 650]]) { c.globalAlpha = 0.4; ballFlat(c, x, y, 50); c.globalAlpha = 1; }
  arrow(c, [[640, 760], [800, 700], [940, 560]], RED, 9);
};

export const ic_sensesPerceptionL3 = cards("sci.senses.perception.L3 cards", [
  intro, summary, e1, e2, a1, a2, a3, a4, a5, a6, a7, p1, c1, c2, t0, t2, t3, t4, t5, t6, t7, t8, t9, t10, t13, e0, e1x, e2x, e4, e5,
]);
