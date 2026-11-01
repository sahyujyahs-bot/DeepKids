import type { Ctx } from "./core";
import { D, INK, BG, SH, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, seed, hand, write, cards } from "./flatKit";

// ------------------------------------------------------------ shared things for this unit
// a comb seen from above: spine along the top, teeth pointing down; (x, y) is the top-left corner
const combPath = (c: Ctx, x: number, y: number, w: number, n: number, tw: number, len: number, sp: number) => {
  const pitch = (w - tw) / (n - 1);
  c.moveTo(x, y); c.lineTo(x + w, y);
  for (let i = n - 1; i >= 0; i--) { const xi = x + i * pitch; c.lineTo(xi + tw, y + sp); c.lineTo(xi + tw, y + sp + len); c.lineTo(xi, y + sp + len); c.lineTo(xi, y + sp); }
  c.closePath();
};
const comb = (c: Ctx, x: number, y: number, w: number, n: number, tw: number, len: number, sp: number, col: string, dk: string, lw = 5) => {
  c.save(); c.translate(14, 16); c.beginPath(); combPath(c, x, y, w, n, tw, len, sp); c.fillStyle = SH; c.fill(); c.restore();
  const p = () => combPath(c, x, y, w, n, tw, len, sp);
  shape(c, p, col, lw);
  c.save(); c.beginPath(); p(); c.clip(); c.fillStyle = dk; c.globalAlpha = 0.55; c.fillRect(x, y + sp * 0.55, w, sp); c.restore(); c.globalAlpha = 1;
  c.beginPath(); p(); c.strokeStyle = INK; c.lineWidth = lw; c.lineJoin = "round"; c.stroke();
};
// a pencil: eraser end at (x, y), tip along angle ang; sh = which side is the shade side (1 or -1)
const pencil = (c: Ctx, x: number, y: number, len: number, ang: number, sh = 1, taped = false) => {
  const hw = 24;
  c.save(); c.translate(x, y); c.rotate(ang);
  shape(c, () => rrect(c, 0, -hw, 46, hw * 2, 10), COL.pink, 5);
  shape(c, () => { c.rect(46, -hw, 26, hw * 2); }, COL.steel, 5);
  line(c, [[56, -hw + 4], [56, hw - 4]], 3, COL.steelDk); line(c, [[64, -hw + 4], [64, hw - 4]], 3, COL.steelDk);
  const body = () => c.rect(72, -hw, len - 162, hw * 2);
  shape(c, body, COL.yellow, 5);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.orange; c.globalAlpha = 0.55; c.fillRect(72, sh > 0 ? 6 : -hw, len - 162, hw); c.restore(); c.globalAlpha = 1;
  c.beginPath(); body(); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  shape(c, () => polyP(c, [[len - 90, -hw], [len - 24, -7], [len - 24, 7], [len - 90, hw]]), COL.wood, 5);
  shape(c, () => polyP(c, [[len - 26, -8], [len, 0], [len - 26, 8]]), COL.black, 4);
  if (taped) {
    shape(c, () => polyP(c, [[-30, -hw - 16], [52, -hw - 16], [52, hw + 16], [-30, hw + 16]]), "rgba(255,226,120,0.78)", 4);
    line(c, [[-16, -hw - 4], [-16, hw + 4]], 5, "rgba(255,255,255,0.7)");
  }
  c.restore();
};
// a ribbon of tissue paper along the path f(t), t from 0 to 1, w wide
const ribbon = (c: Ctx, f: (t: number) => number[], w: number) => {
  const pts: number[][] = [], L: number[][] = [], R: number[][] = [];
  for (let i = 0; i <= 40; i++) pts.push(f(i / 40));
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(40, i + 1)], an = Math.atan2(b[1] - a[1], b[0] - a[0]), k = w / 2 * (0.9 + 0.1 * Math.sin(i * 0.5));
    L.push([p[0] - Math.sin(an) * k, p[1] + Math.cos(an) * k]); R.push([p[0] + Math.sin(an) * k, p[1] - Math.cos(an) * k]);
  });
  const poly = [...L, ...R.reverse()];
  c.save(); c.translate(10, 14); c.beginPath(); polyP(c, poly); c.fillStyle = SH; c.fill(); c.restore();
  shape(c, () => polyP(c, poly), "#f8c4d4", 5);
  const mid = pts.map((p, i) => [(L[i][0] + R[40 - i][0]) / 2, (L[i][1] + R[40 - i][1]) / 2]);
  line(c, mid.slice(2, 36), 3, COL.pink);
};

// ------------------------------------------------------------ experiment 1: sieving seeds with combs
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  comb(c, 160, 100, 760, 7, 46, 150, 58, COL.wood, COL.woodDk);
  comb(c, 160, 350, 760, 16, 24, 150, 58, COL.teal, COL.tealDk);
  comb(c, 160, 600, 760, 38, 9, 150, 58, COL.steel, COL.steelDk, 3);
  // ruler lying along the bottom
  c.save(); c.translate(12, 14); c.beginPath(); c.rect(150, 860, 790, 90); c.fillStyle = SH; c.fill(); c.restore();
  shape(c, () => c.rect(150, 860, 790, 90), COL.wood, 5);
  c.save(); c.beginPath(); c.rect(150, 860, 790, 90); c.clip(); c.fillStyle = COL.woodDk; c.globalAlpha = 0.55; c.fillRect(150, 925, 790, 30); c.restore(); c.globalAlpha = 1;
  for (let k = 0; k <= 10; k++) { const x = 190 + k * 70; line(c, [[x, 860], [x, 896]], 4); if (k < 10) line(c, [[x + 35, 860], [x + 35, 880]], 3); if (k % 5 === 0) write(c, String(k), x - 10, 902, 32, INK, 5); }
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  const sheet = () => rrect(c, 100, 190, 880, 640, 12);
  c.save(); c.translate(14, 16); c.beginPath(); sheet(); c.fillStyle = SH; c.fill(); c.restore();
  shape(c, sheet, COL.paper, 6);
  line(c, [[240, 250], [240, 770]], 6, COL.greyDk); line(c, [[840, 250], [840, 770]], 6, COL.greyDk);
  for (let i = 0; i < 10; i++) {
    const y = 285 + i * 52;
    seed(c, 218, y, 21, 0.5 + (i % 3) * 0.4, false, COL.black, "#1d1a26");
    seed(c, 264, y + 14, 13, 0.3 + (i % 3) * 0.5, false, "#f3e6c4", "#d6c294");
  }
  // 10 cm between the lines
  line(c, [[240, 885], [840, 885]], 6); line(c, [[240, 865], [240, 905]], 6); line(c, [[840, 865], [840, 905]], 6);
  write(c, "10 cm", 455, 925, 52, INK, 7);
  // the pencil that drew the lines
  c.save(); c.translate(12, 14); pencil(c, 300, 85, 480, 0.0); c.restore();
  pencil(c, 300, 85, 480, 0, 1);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  // the paper, seen low and from the side, with the finish line
  c.save(); c.translate(12, 14); c.beginPath(); polyP(c, [[40, 600], [1050, 600], [1050, 990], [40, 990]]); c.fillStyle = SH; c.fill(); c.restore();
  shape(c, () => polyP(c, [[30, 590], [1040, 590], [1040, 980], [30, 980]]), COL.paper, 6);
  line(c, [[985, 600], [985, 970]], 6, COL.greyDk);
  // small pale khus khus left in the gaps and behind the comb
  const gap = (i: number) => 200 + i * ((600 - 20) / 15) + 20 + 15;
  [1, 4, 7, 10, 12].forEach((i, k) => seed(c, gap(i) - 2, 655 + (k % 2) * 4, 9, 0.4 + k, false, "#f3e6c4", "#d6c294"));
  [[130, 780], [175, 700], [150, 880], [250, 840], [330, 760], [210, 930]].forEach(([x, y], k) => seed(c, x, y, 12, 0.7 * k, false, "#f3e6c4", "#d6c294"));
  // the comb, teeth down on the paper, moving right
  c.save(); c.translate(0, 0);
  comb(c, 200, 330, 600, 16, 20, 255, 70, COL.teal, COL.tealDk);
  c.restore();
  // black sesame pushed along in front of the comb
  [[835, 650], [862, 700], [830, 720], [900, 660], [880, 750], [925, 705], [845, 780], [910, 790], [820, 840], [880, 850]].forEach(([x, y], k) => seed(c, x, y, 21, 0.5 + k * 0.7, false, COL.black, "#1d1a26"));
  hand(c, 130, 365, 0, 1.7);
  arrow(c, [[380, 230], [780, 230]]);
};

// ------------------------------------------------------------ experiment 2: the tissue flag
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 600, 640, 420, 26);
  c.save(); c.translate(525, 540); c.scale(1.3, 1.3); c.translate(-525, -540);
  ribbon(c, (t) => [400 - t * 250, 520 + Math.sin(t * 4.5) * 22 + t * 24], 140);
  pencil(c, 380, 520, 540, 0.0, 1, true);
  c.restore();
  // the other hand presses the tape down over the strip and the pencil
  hand(c, 351, 310, Math.PI / 2, 1.8, SKIN.child, CLOTH.child, true);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  // ceiling with a fan seen from below
  shape(c, () => c.rect(-10, -10, D + 20, 90), COL.grey, 6);
  shape(c, () => c.rect(516, 70, 48, 90), COL.greyDk, 5);
  const hub = [540, 190];
  [Math.PI * 1.1, Math.PI * 1.9, Math.PI * 0.5].forEach((a) => {
    const P = (r: number, s: number) => [hub[0] + Math.cos(a) * r - Math.sin(a) * s, hub[1] + 0.3 * (Math.sin(a) * r + Math.cos(a) * s)];
    shape(c, () => polyP(c, [P(50, -42), P(360, -48), P(360, 48), P(50, 42)]), COL.tealDk, 5);
    shape(c, () => polyP(c, [P(50, -42), P(360, -48), P(360, 0), P(50, 0)]), COL.teal, 0);
    c.beginPath(); polyP(c, [P(50, -42), P(360, -48), P(360, 48), P(50, 42)]); c.strokeStyle = INK; c.lineWidth = 5; c.lineJoin = "round"; c.stroke();
  });
  shape(c, () => ell(c, hub[0], hub[1] + 8, 78, 44), COL.steel, 6);
  shape(c, () => ell(c, hub[0], hub[1] + 20, 38, 20), COL.steelDk, 4);
  const turn: number[][] = []; for (let i = 0; i <= 16; i++) { const th = Math.PI * (0.12 + i * 0.045); turn.push([540 + Math.cos(th) * 440, 230 + Math.sin(th) * 130]); }
  arrow(c, turn);
  // the bed: headboard, mattress, blanket, pillow
  c.save(); c.translate(-60, -120);
  shape(c, () => rrect(c, 610, 930, 480, 120, 14), COL.brown);
  shape(c, () => rrect(c, 650, 850, 440, 100, 24), COL.cloth);
  shape(c, () => rrect(c, 780, 835, 320, 125, 28), COL.teal);
  shape(c, () => rrect(c, 595, 640, 54, 400, 16), COL.wood);
  shape(c, () => rrect(c, 670, 760, 230, 105, 48), WHITE);
  shade(c, () => rrect(c, 670, 760, 230, 105, 48), COL.cloth, -26, -20, 0.9);
  c.beginPath(); rrect(c, 670, 760, 230, 105, 48); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  c.restore();
  // the flag held up at pillow height by one hand, the strip blown sideways towards the bed
  ribbon(c, (t) => [275 + t * 215, 655 + Math.sin(t * 7) * 12 + t * 6], 76);
  pencil(c, 240, 630, 380, Math.PI / 2, -1, true);
  hand(c, 107, 850, 0, 1.9);
};

// setup.e2.2
// a small flag on a stick: 0 hangs straight down (still air), 1 flutters, 2 blows out flat
const miniFlag = (c: Ctx, x: number, y: number, state: number) => {
  const top = y - 30;
  if (state === 0) ribbon(c, (t) => [x + 20 + Math.sin(t * 6) * 2, top + 8 + t * 100], 32);
  else if (state === 1) ribbon(c, (t) => [x + 8 + t * 80, top + 16 + t * 55 + Math.sin(t * 9) * 8], 32);
  else ribbon(c, (t) => [x + 8 + t * 110, top + 18 + Math.sin(t * 9) * 6], 32);
  shape(c, () => rrect(c, x - 8, top, 16, 112, 5), COL.yellow, 5);
};
const e2_2 = (c: Ctx) => {
  ground(c);
  const sheet = () => rrect(c, 70, 70, 940, 940, 14);
  c.save(); c.translate(14, 16); c.beginPath(); sheet(); c.fillStyle = SH; c.fill(); c.restore();
  shape(c, sheet, COL.paper, 6);
  // room walls from above
  shape(c, () => rrect(c, 130, 130, 820, 820, 8), "rgba(0,0,0,0)", 14);
  // bed: blanket, pillows at the top
  shape(c, () => rrect(c, 300, 300, 340, 430, 18), COL.cloth);
  shape(c, () => rrect(c, 300, 450, 340, 280, 18), COL.teal);
  shade(c, () => rrect(c, 300, 450, 340, 280, 18), COL.tealDk, -22, -22, 0.6);
  c.beginPath(); rrect(c, 300, 450, 340, 280, 18); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  shape(c, () => rrect(c, 325, 320, 130, 80, 30), WHITE); shape(c, () => rrect(c, 485, 320, 130, 80, 30), WHITE);
  // fan over the bed: four blades round a hub
  [0, 1, 2, 3].forEach((k) => { const a = k * Math.PI / 2 + 0.5; c.save(); c.translate(470, 590); c.rotate(a); shape(c, () => rrect(c, 20, -22, 110, 44, 20), COL.blue, 5); c.restore(); });
  shape(c, () => ell(c, 470, 590, 26, 26), COL.steel, 5);
  // each place tested: its flag and its score, still places yellow, windy places blue
  const tone = [COL.yellow, COL.sky, COL.waterDk];
  const score = (x: number, y: number, n: number) => {
    miniFlag(c, x + 98, y + 6, n);
    shape(c, () => ell(c, x, y, 50, 50), tone[n], 6); write(c, String(n), x - 17, y - 28, 56, INK, 10);
  };
  score(335, 215, 1); score(700, 520, 2); score(215, 810, 0); score(740, 810, 0); score(420, 810, 2);
};

export const su_microorganismsParasites = cards("sci.microorganisms.parasites.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2]);
