import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, write, rnd, cards } from "./flatKit";

// sci.body.body-parts.L3 · set-up cards. Same bread, bags, eggs, glasses and child's arm on every card of an experiment.

// ---------------------------------------------------------------- shared things
// a slice of bread seen face-on: brown crust, cream inside; mould = number of green/black spots, dust = dirty hand marks
const bread = (c: Ctx, x: number, y: number, w: number, h: number, mould = 0, seedN = 1, dust = false) => {
  c.save(); c.translate(x, y);
  const outer = (k: number) => () => {
    const a = w * 0.45 * k, b = h * 0.5 * k;
    c.moveTo(-a, b); c.lineTo(-a, -h * 0.1 * k); c.bezierCurveTo(-w * 0.62 * k, -h * 0.15 * k, -w * 0.6 * k, -b, -w * 0.3 * k, -b);
    c.lineTo(w * 0.3 * k, -b); c.bezierCurveTo(w * 0.6 * k, -b, w * 0.62 * k, -h * 0.15 * k, a, -h * 0.1 * k); c.lineTo(a, b); c.closePath();
  };
  shape(c, outer(1), "#b9773c", 6);
  shade(c, outer(1), "#8d5528", w * 0.06, h * 0.04, 0.5);
  shape(c, outer(0.86), "#f6dfb0", 3);
  const r = rnd(seedN * 31 + 5);
  c.save(); c.beginPath(); outer(0.84)(); c.clip();
  for (let i = 0; i < mould; i++) {
    const sx = (r() - 0.5) * w * 0.7, sy = (r() - 0.45) * h * 0.75, sr = (mould > 8 ? 13 + r() * 14 : 10 + r() * 6) * (w / 170);
    c.beginPath(); ell(c, sx, sy, sr, sr * 0.85); c.fillStyle = r() < 0.5 ? "#5a9a3c" : "#3f6f2c"; c.fill(); c.lineWidth = 2.5; c.strokeStyle = INK; c.stroke();
    c.beginPath(); ell(c, sx + 1, sy, sr * 0.4, sr * 0.35); c.fillStyle = "#2b2b2b"; c.fill();
  }
  if (dust) for (let i = 0; i < 90; i++) { c.beginPath(); ell(c, (r() - 0.5) * w * 0.74, (r() - 0.45) * h * 0.8, 3.5 + r() * 3, 3 + r() * 2.5); c.fillStyle = r() < 0.5 ? "#7a6a55" : "#4d4237"; c.fill(); }
  c.restore(); c.restore();
};
// a clear zip bag standing on its bottom edge at (x, y), bread face-on inside, a numbered sticker
const bag = (c: Ctx, x: number, y: number, w: number, h: number, mould: number, n: string, seedN: number, open = false) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.6, w * 0.08);
  bread(c, x, y - h * 0.5, w * 0.84, w * 0.84, mould, seedN);
  const body = () => rrect(c, x - w / 2, y - h, w, h, 14);
  shape(c, body, "rgba(214,236,250,0.45)", 6);
  shine(c, [[x - w * 0.38, y - h * 0.78], [x - w * 0.38, y - h * 0.2]], 8);
  if (!open) {
    shape(c, () => rrect(c, x - w / 2, y - h, w, h * 0.09, 6), COL.blue, 5);
    shape(c, () => rrect(c, x + w * 0.2, y - h * 1.02, w * 0.16, h * 0.13, 5), COL.blueDk, 4);
  }
  shape(c, () => rrect(c, x - w * 0.3, y - h * 0.22, w * 0.6, h * 0.14, 6), WHITE, 4);
  write(c, n, x - 12, y - h * 0.215, h * 0.1, INK, 5);
};
const egg = (c: Ctx, x: number, y: number, rx: number, ry: number, rot: number, col: string, dk: string) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => { c.moveTo(0, -ry); c.bezierCurveTo(rx * 0.95, -ry, rx * 1.15, ry * 0.9, 0, ry); c.bezierCurveTo(-rx * 1.15, ry * 0.9, -rx * 0.95, -ry, 0, -ry); c.closePath(); };
  shape(c, p, col, 6); shade(c, p, dk, rx * 0.3, ry * 0.05, 0.5);
  c.restore();
};
const EGG = "#ead3a8", EGGDK = "#c9a574";

// ---------------------------------------------------------------- experiment 1: mould on bread
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 580, 930, 450, 100);
  shape(c, () => ell(c, 540, 770, 480, 230), COL.steel);
  shape(c, () => ell(c, 540, 765, 410, 190), COL.steelIn, 4);
  const sl: [number, number, number][] = [[390, 700, 1], [690, 700, 2], [390, 850, 3], [690, 850, 4]];
  sl.forEach(([x, y, n]) => { bread(c, x, y, 200, 165, 0, n, n === 1); });
  // the grubby hand touching slice 1 all over
  hand(c, 255, 405, 1.1, 2.6, SKIN.child, CLOTH.child, true);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  // the open bag, the slice half way in, a clean spoon (in a grown-up hand) pushing it down
  const bx = 540, by = 1020, bw = 500, bh = 660;
  shadow(c, bx + 40, by + 8, bw * 0.6, 28);
  bread(c, bx, 420, 360, 360, 0, 4);
  c.save(); c.beginPath(); rrect(c, bx - bw / 2, by - bh, bw, bh, 16); c.clip(); c.fillStyle = "rgba(214,236,250,0.22)"; c.fillRect(0, 0, 1080, 1080); c.restore();
  shape(c, () => rrect(c, bx - bw / 2, by - bh, bw, bh, 16), "rgba(214,236,250,0.12)", 6);
  shine(c, [[bx - bw * 0.4, by - bh * 0.8], [bx - bw * 0.4, by - 90]], 10);
  line(c, [[bx - bw / 2, by - bh], [bx + bw / 2, by - bh]], 12, INK);
  line(c, [[100, 74], [480, 218]], 34, INK); line(c, [[100, 74], [480, 218]], 20, COL.steel);
  shape(c, () => ell(c, 520, 236, 85, 56, 0.38), COL.steel, 6);
  shape(c, () => ell(c, 524, 238, 58, 34, 0.38), COL.steelIn, 4);
  hand(c, 20, 40, 0.38, 2.3, SKIN.adult, CLOTH.adult, false);
  arrow(c, [[920, 230], [920, 470]], RED, 18);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c, "#3a3250");
  shape(c, () => rrect(c, 90, 90, 900, 900, 10), "#1d1830", 8);
  shape(c, () => polyP(c, [[60, 820], [1020, 820], [1020, 905], [60, 905]]), "#8a5a3c", 8);
  shape(c, () => polyP(c, [[60, 905], [1020, 905], [1020, 960], [60, 960]]), "#6a4128", 6);
  [250, 450, 650, 850].forEach((x, i) => bag(c, x, 830, 185, 440, 0, String(i + 1), i + 6));
  c.fillStyle = "rgba(29,24,48,0.35)"; c.fillRect(120, 120, 840, 700);
};
// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6cf9f"; c.fillRect(0, 880, 1080, 200); line(c, [[0, 880], [1080, 880]], 6);
  const m = [20, 6, 1, 0];
  m.forEach((k, i) => bag(c, 155 + i * 257, 900, 215, 560, k, String(i + 1), i + 2));
};

// ---------------------------------------------------------------- experiment 2: skin flakes on tape
const arm = (c: Ctx) => {
  ground(c);
  for (const [fy, h] of [[340, 66], [412, 66], [484, 66], [556, 66]]) shape(c, () => rrect(c, 760, fy, 220, h, 33), SKIN.child, 6);
  shape(c, () => rrect(c, 170, 320, 700, 350, 90), SKIN.child, 6);
  shade(c, () => rrect(c, 170, 320, 700, 350, 90), SKIN.childDk, 0, 40, 0.55);
  shape(c, () => rrect(c, 40, 270, 250, 450, 40), CLOTH.child, 6);
  shade(c, () => rrect(c, 40, 270, 250, 450, 40), CLOTH.childDk, 40, 0, 0.55);
  line(c, [[240, 285], [240, 705]], 5, CLOTH.childDk);
};
const tapePiece = (c: Ctx, pts: number[][]) => {
  shape(c, () => polyP(c, pts), "rgba(235,246,255,0.6)", 5);
};
// setup.e2.0
const e2_0 = (c: Ctx) => {
  arm(c);
  tapePiece(c, [[455, 350], [605, 350], [605, 640], [455, 640]]);
  shine(c, [[480, 380], [480, 600]], 8);
  hand(c, 420, 190, 1.15, 2.4, SKIN.child, CLOTH.child, true);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  arm(c);
  tapePiece(c, [[455, 480], [605, 480], [605, 640], [455, 640]]);
  shine(c, [[480, 510], [480, 610]], 8);
  tapePiece(c, [[455, 480], [605, 480], [640, 400], [665, 340], [560, 320], [500, 390]]);
  hand(c, 610, 175, Math.PI / 2 + 0.25, 2.4, SKIN.child, CLOTH.child, false);
  arrow(c, [[840, 540], [840, 270]], RED, 16);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 50, 90, 980, 790, 18), "#2a2630", 8);
  const fl = rnd(9);
  [190, 390, 590].forEach((y, k) => {
    tapePiece(c, [[110, y], [640, y], [640, y + 130], [110, y + 130]]);
    for (let i = 0; i < 70; i++) { c.beginPath(); ell(c, 125 + fl() * 500, y + 12 + fl() * 106, 2 + fl() * 2.5, 2 + fl() * 2); c.fillStyle = "#f2f2f2"; c.fill(); }
    if (k === 1) { /* the strip under the lens */ }
  });
  // hand lens over the middle strip
  const lx = 520, ly = 440, lr = 205;
  line(c, [[lx + lr * 0.7, ly + lr * 0.7], [850, 760]], 42, INK); line(c, [[lx + lr * 0.7, ly + lr * 0.7], [850, 760]], 28, COL.wood);
  shape(c, () => ell(c, lx, ly, lr, lr), "#2a2630", 0);
  c.save(); c.beginPath(); ell(c, lx, ly, lr - 8, lr - 8); c.clip();
  c.fillStyle = "#2a2630"; c.fillRect(0, 0, 1080, 1080);
  shape(c, () => polyP(c, [[lx - 300, ly - 90], [lx + 300, ly - 90], [lx + 300, ly + 100], [lx - 300, ly + 100]]), "rgba(235,246,255,0.55)", 6);
  for (let i = 0; i < 20; i++) { const a = fl() * Math.PI * 2, d = fl() * 70 + 15; const fx = lx - 90 + Math.cos(a) * d * 2, fy = ly + Math.sin(a) * d * 0.9, s = 8 + fl() * 10; shape(c, () => polyP(c, [[fx - s, fy], [fx - s * 0.2, fy - s * 0.8], [fx + s, fy - s * 0.2], [fx + s * 0.3, fy + s * 0.8]]), "#ffffff", 3); }
  c.restore();
  shape(c, () => ell(c, lx, ly, lr, lr), "rgba(255,255,255,0.08)", 0);
  c.beginPath(); ell(c, lx, ly, lr, lr); c.lineWidth = 26; c.strokeStyle = INK; c.stroke();
  c.beginPath(); ell(c, lx, ly, lr, lr); c.lineWidth = 14; c.strokeStyle = COL.steel; c.stroke();
  shine(c, [[lx - lr * 0.6, ly - lr * 0.35], [lx - lr * 0.35, ly - lr * 0.6]], 10);
  hand(c, 885, 838, -2.15, 2.2, SKIN.child, CLOTH.child, false);
};

// ---------------------------------------------------------------- experiment 3: toothpaste on an egg
const paste = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.75, 0.4), "#f4fbff", 4); shade(c, () => ell(c, x, y, r, r * 0.75, 0.4), "#bcd8e8", r * 0.3, r * 0.25, 0.5); };
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 580, 960, 430, 90);
  shape(c, () => ell(c, 540, 840, 450, 150), "#f5f0e6", 6);
  shape(c, () => ell(c, 540, 836, 340, 100), "#e4ddcf", 4);
  // an egg standing on the saucer, toothpaste squeezed in ribbons over its top half
  const ex = 600, ey = 650, ern = 0.1;
  egg(c, ex, ey, 150, 210, ern, EGG, EGGDK);

  const rib = [[488, 402], [548, 478], [660, 468], [520, 520], [690, 530], [505, 580], [700, 590]];
  for (const [w, col] of [[56, INK], [40, "#f4fbff"]] as [number, string][]) { c.beginPath(); c.moveTo(rib[0][0], rib[0][1]); for (let k = 1; k < rib.length; k++) c.lineTo(rib[k][0], rib[k][1]); c.lineWidth = w; c.strokeStyle = col; c.lineCap = "round"; c.lineJoin = "round"; c.stroke(); }
  // the tube, nozzle just above the egg, in a hand
  c.save(); c.translate(480, 395); c.rotate(0.7);
  shape(c, () => polyP(c, [[0, -16], [-60, -26], [-60, 26], [0, 16]]), COL.steelDk, 5);
  shape(c, () => polyP(c, [[-60, -26], [-250, -56], [-250, 56], [-60, 26]]), "#f4fbff", 6);
  shape(c, () => polyP(c, [[-110, -36], [-180, -48], [-180, 48], [-110, 36]]), COL.teal, 4);
  shape(c, () => rrect(c, -330, -58, 80, 116, 10), COL.blue, 6);
  c.restore();
  hand(c, 232, 151, 0.7, 2.2, SKIN.adult, CLOTH.adult, false);
};
const vinegarGlass = (c: Ctx, x: number) => glass2(c, x);
const glass2 = (c: Ctx, x: number) => {
  const y = 900, w = 330, h = 440;
  shadow(c, x + 40, y + 6, w * 0.6, 24);
  const bot = w * 0.4, top = w / 2, ly = y - h * 0.82, lw = bot + (top - bot) * 0.82;
  shape(c, () => polyP(c, [[x - lw, ly], [x + lw, ly], [x + bot, y], [x - bot, y]]), "#cfe8f3", 0);
  shape(c, () => ell(c, x, ly, lw, w * 0.06), "#e8f5fb", 0);
};
const glassFront = (c: Ctx, x: number) => {
  const y = 900, w = 330, h = 440, top = w / 2, bot = w * 0.4;
  shape(c, () => polyP(c, [[x - top, y - h], [x + top, y - h], [x + bot, y], [x - bot, y]]), "rgba(214,236,250,0.35)", 6);
  shape(c, () => ell(c, x, y - h, top, w * 0.08), "rgba(255,255,255,0.3)", 5);
  shine(c, [[x - top * 0.65, y - h * 0.85], [x - bot * 0.7, y - h * 0.2]], 9);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(540, 560); c.scale(1.2, 1.2); c.translate(-540, -680);
  const bubble = (x: number, y: number, r: number) => { c.beginPath(); ell(c, x, y, r, r); c.fillStyle = "rgba(255,255,255,0.9)"; c.fill(); c.lineWidth = 3.5; c.strokeStyle = INK; c.stroke(); };
  vinegarGlass(c, 290); vinegarGlass(c, 790);
  egg(c, 290, 765, 95, 135, 0.1, EGG, EGGDK);
  egg(c, 790, 765, 95, 135, 0.1, EGG, EGGDK);
  // thin white film left on the wiped egg
  paste(c, 770, 700, 34); paste(c, 820, 790, 28); paste(c, 750, 830, 22);
  // many bubbles on and above the plain egg, hardly any on the wiped one
  const r = rnd(5);
  for (let i = 0; i < 20; i++) bubble(225 + r() * 130, 650 + r() * 230, 8 + r() * 10);
  for (let i = 0; i < 12; i++) bubble(190 + r() * 200, 560 + r() * 90, 10 + r() * 12);
  bubble(830, 650, 7);
  glassFront(c, 290); glassFront(c, 790);
  c.restore();
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[60, 420], [1020, 420], [1040, 1010], [40, 1010]]), COL.cloth, 6);
  c.save(); c.beginPath(); polyP(c, [[60, 420], [1020, 420], [1040, 1010], [40, 1010]]); c.clip();
  for (let x = 100; x < 1060; x += 90) line(c, [[x, 420], [x, 1010]], 5, COL.sky);
  for (let y = 470; y < 1010; y += 90) line(c, [[40, y], [1040, y]], 5, COL.sky);
  c.restore();
  shadow(c, 360, 930, 150, 34); shadow(c, 800, 930, 150, 34);
  // the plain egg: shell eaten away, dull, pitted and chalky
  egg(c, 340, 740, 135, 190, 0.08, "#e6dcc4", "#bfb294");
  const r = rnd(8);
  c.save(); c.translate(340, 740); c.rotate(0.08); c.beginPath(); c.moveTo(0, -190); c.bezierCurveTo(128, -190, 155, 171, 0, 190); c.bezierCurveTo(-155, 171, -128, -190, 0, -190); c.closePath(); c.clip();
  for (let i = 0; i < 45; i++) { c.beginPath(); ell(c, (r() - 0.5) * 240, (r() - 0.5) * 340, 5 + r() * 7, 4 + r() * 5); c.fillStyle = r() < 0.5 ? "#8c7f66" : "#a99c82"; c.fill(); }
  c.restore();
  // the toothpaste egg: smooth and shiny
  egg(c, 800, 740, 135, 190, 0.08, EGG, EGGDK);
  shine(c, [[722, 700], [722, 620], [760, 570]], 22);
  hand(c, 110, 395, 0.85, 2.8, SKIN.child, CLOTH.child, true);
};

export const su_bodyBodyParts = cards("sci.body.body-parts.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
