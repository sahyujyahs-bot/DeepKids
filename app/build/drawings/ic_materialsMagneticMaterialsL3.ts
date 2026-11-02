import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, SKIN, WHITE, arrow, bowl, cards, ell, glass, ground, hand, line, person, plate, polyP, rnd, rrect, seed, shade, shadow, shape, shine, write } from "./flatKit";

const TABLE = "#ecd3a1", BRASS = "#e0b43c", BRASSDK = "#b98a22", COPPER = "#c97a4a", IRON = "#4a4550";
const at = (c: Ctx, x: number, y: number, rot: number, s: number, fn: () => void) => { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); fn(); c.restore(); };

// ---- things
// a bar magnet lying flat: blue half on the left, red half on the right; centre (cx, cy)
const hbar = (c: Ctx, cx: number, cy: number, len: number, th: number) => {
  const x = cx - len / 2, y = cy - th / 2, whole = () => rrect(c, x, y, len, th, 12);
  shadow(c, cx + 14, cy + th / 2 + 12, len * 0.5, 14);
  shape(c, whole, COL.blue, 0);
  c.save(); c.beginPath(); whole(); c.clip(); c.fillStyle = COL.red; c.fillRect(cx, y - 5, len / 2 + 5, th + 10); c.restore();
  shade(c, whole, "#2b2340", 0, th * 0.62, 0.18);
  shape(c, whole, "rgba(0,0,0,0)", 6);
  line(c, [[x + 24, y + th * 0.22], [cx - 16, y + th * 0.22]], 7, WHITE);
};
const vbar = (c: Ctx, x: number, y: number, w: number, len: number) => {
  const whole = () => rrect(c, x, y, w, len, 12);
  shape(c, whole, COL.blue, 0);
  c.save(); c.beginPath(); whole(); c.clip(); c.fillStyle = COL.red; c.fillRect(x - 5, y - 5, w + 10, len / 2 + 5); c.restore();
  shade(c, whole, "#2b2340", w * 0.62, 0, 0.18);
  shape(c, whole, "rgba(0,0,0,0)", 6);
  line(c, [[x + w * 0.2, y + 22], [x + w * 0.2, y + len / 2 - 16]], 7, WHITE);
};
// a paper clip centred at (x, y), upright, scale s, turned by rot
const pclip = (c: Ctx, x: number, y: number, s: number, rot = 0) => at(c, x, y, rot, s, () => {
  const loops = () => { c.beginPath(); rrect(c, -42, -85, 84, 170, 38); rrect(c, -22, -49, 44, 146, 22); };
  loops(); c.strokeStyle = INK; c.lineWidth = 24; c.lineJoin = "round"; c.stroke();
  loops(); c.strokeStyle = COL.steel; c.lineWidth = 11; c.stroke();
});
const nail = (c: Ctx, x: number, y: number, len: number, rot: number) => at(c, x, y, rot, 1, () => {
  line(c, [[-len / 2, 0], [len / 2, 0]], 20, INK); line(c, [[-len / 2, 0], [len / 2, 0]], 9, COL.steel);
  shape(c, () => ell(c, -len / 2, 0, 11, 24), COL.steelDk, 5);
});
const pin = (c: Ctx, x: number, y: number, len: number, rot: number) => at(c, x, y, rot, 1, () => {
  line(c, [[-len / 2, 0], [len / 2, 0]], 12, INK); line(c, [[-len / 2, 0], [len / 2, 0]], 5, COL.steel);
  shape(c, () => ell(c, -len / 2, 0, 12, 12), RED, 4);
});
const key = (c: Ctx, x: number, y: number, rot: number) => at(c, x, y, rot, 1, () => {
  line(c, [[-30, 0], [120, 0]], 22, INK); line(c, [[-30, 0], [120, 0]], 12, BRASS);
  line(c, [[90, 0], [90, 28]], 18, INK); line(c, [[90, 0], [90, 28]], 8, BRASS);
  line(c, [[120, 0], [120, 34]], 18, INK); line(c, [[120, 0], [120, 34]], 8, BRASS);
  shape(c, () => ell(c, -52, 0, 40, 40), BRASS, 7); shape(c, () => ell(c, -52, 0, 16, 16), TABLE, 5);
});
const pencil = (c: Ctx, x: number, y: number, rot: number) => at(c, x, y, rot, 1, () => {
  shape(c, () => polyP(c, [[130, -20], [190, 0], [130, 20]]), COL.wood, 5);
  shape(c, () => polyP(c, [[170, -6], [190, 0], [170, 6]]), IRON, 3);
  shape(c, () => rrect(c, -130, -20, 260, 40, 6), COL.yellow);
  shade(c, () => rrect(c, -130, -20, 260, 40, 6), COL.orange, 0, 12, 0.5);
  shape(c, () => rrect(c, -160, -20, 34, 40, 6), COL.pink); shape(c, () => rrect(c, -126, -20, 22, 40, 2), COL.steel, 4);
});
const coin = (c: Ctx, x: number, y: number, r: number) => { shadow(c, x + 8, y + r * 0.8, r, r * 0.25); shape(c, () => ell(c, x, y, r, r), COPPER, 6); shape(c, () => ell(c, x, y, r * 0.65, r * 0.65), "#dc9468", 3); };
const foil = (c: Ctx, x: number, y: number) => { shadow(c, x + 10, y + 50, 90, 16); shape(c, () => polyP(c, [[x - 80, y - 10], [x - 40, y - 50], [x + 10, y - 36], [x + 60, y - 52], [x + 86, y - 5], [x + 60, y + 38], [x - 10, y + 48], [x - 70, y + 36]]), "#e8edf3"); line(c, [[x - 40, y - 50], [x - 10, y + 10], [x + 60, y - 52]], 3, COL.steelDk); line(c, [[x - 10, y + 10], [x - 10, y + 48]], 3, COL.steelDk); };
const lodestone = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => polyP(c, [[x - 120 * s, y + 10 * s], [x - 80 * s, y - 70 * s], [x - 10 * s, y - 100 * s], [x + 70 * s, y - 70 * s], [x + 125 * s, y - 5 * s], [x + 100 * s, y + 70 * s], [x + 20 * s, y + 90 * s], [x - 80 * s, y + 75 * s]]);
  shadow(c, x + 20 * s, y + 98 * s, 120 * s, 18 * s);
  shape(c, p, "#5b5663"); shade(c, p, "#2b2340", 40 * s, 40 * s, 0.4);
  shine(c, [[x - 80 * s, y - 40 * s], [x - 30 * s, y - 72 * s]], 8);
};
const compassNeedle = (c: Ctx, x: number, y: number, ang: number, len: number, wid: number) => at(c, x, y, ang, 1, () => {
  shape(c, () => polyP(c, [[-len, 0], [0, -wid], [0, wid]]), "#f3f0ea", 5);
  shape(c, () => polyP(c, [[len, 0], [0, -wid], [0, wid]]), RED, 5);
  shape(c, () => ell(c, 0, 0, wid * 0.45, wid * 0.45), COL.steelDk, 3);
});
const UP = -Math.PI / 2;
const compass = (c: Ctx, x: number, y: number, r: number, ang = UP) => {
  shadow(c, x + r * 0.12, y + r * 0.92, r * 0.95, r * 0.14);
  shape(c, () => ell(c, x, y, r, r), COL.steel); shape(c, () => ell(c, x, y, r * 0.84, r * 0.84), WHITE, 5);
  for (let k = 0; k < 4; k++) { const a = UP + k * Math.PI / 2; line(c, [[x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62], [x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78]], 5); }
  shape(c, () => polyP(c, [[x, y - r * 0.9], [x - r * 0.07, y - r * 0.98], [x + r * 0.07, y - r * 0.98]]), RED, 3);
  compassNeedle(c, x, y, ang, r * 0.55, r * 0.12);
};
const steelCup = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const p = () => polyP(c, [[x - w / 2, y - h], [x + w / 2, y - h], [x + w * 0.4, y], [x - w * 0.4, y]]);
  shadow(c, x + w * 0.15, y + 6, w * 0.55, w * 0.1);
  shape(c, p, COL.steel); shade(c, p, COL.steelDk, w * 0.3, 0, 0.6);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.08), COL.steelIn, 5);
  shine(c, [[x - w * 0.32, y - h * 0.85], [x - w * 0.26, y - h * 0.15]], 8);
};
const bowlTop = (c: Ctx, x: number, y: number, r: number) => { shadow(c, x + 14, y + r * 0.96, r, r * 0.14); shape(c, () => ell(c, x, y, r, r), COL.teal); shape(c, () => ell(c, x, y, r * 0.84, r * 0.84), COL.water, 5); shine(c, [[x - r * 0.6, y - r * 0.35], [x - r * 0.35, y - r * 0.62]], 8); };

// ---- more things
const GOLD = "#f2c63d", GOLDDK = "#c99a1f", PAPERBAG = "#e9d9c2";
const ang = (c: Ctx, x: number, y: number, a: number, len = 46, col = INK) => {
  const ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len, h = len * 0.38;
  line(c, [[x, y], [ex, ey]], 8, col);
  line(c, [[ex - Math.cos(a - 0.5) * h, ey - Math.sin(a - 0.5) * h], [ex, ey], [ex - Math.cos(a + 0.5) * h, ey - Math.sin(a + 0.5) * h]], 8, col);
};
const tick = (c: Ctx, x: number, y: number, s = 1) => { const p = [[x - 34 * s, y + 2 * s], [x - 10 * s, y + 28 * s], [x + 36 * s, y - 30 * s]]; line(c, p, 26 * s, INK); line(c, p, 15 * s, COL.green); };
const cross = (c: Ctx, x: number, y: number, s = 1) => {
  const a = [[x - 28 * s, y - 28 * s], [x + 28 * s, y + 28 * s]], b = [[x + 28 * s, y - 28 * s], [x - 28 * s, y + 28 * s]];
  line(c, a, 26 * s, INK); line(c, b, 26 * s, INK); line(c, a, 15 * s, RED); line(c, b, 15 * s, RED);
};
const spoon = (c: Ctx, x: number, y: number, rot: number, col: string = COL.steel, dk: string = COL.steelDk) => at(c, x, y, rot, 1, () => {
  line(c, [[20, 0], [190, 0]], 22, INK); line(c, [[20, 0], [190, 0]], 10, col);
  shape(c, () => ell(c, -20, 0, 62, 38), col); shade(c, () => ell(c, -20, 0, 62, 38), dk, 14, 12, 0.55); shine(c, [[-55, -12], [-30, -24]], 6);
});
const comb = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 10, y + 50, 120, 12);
  for (let k = 0; k < 9; k++) shape(c, () => rrect(c, x - 100 + k * 23, y + 10, 12, 44, 5), COL.pink, 4);
  shape(c, () => rrect(c, x - 112, y - 26, 224, 42, 10), COL.pink);
};
const bangle = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + 8, y + r + 6, r, r * 0.16);
  c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = INK; c.lineWidth = 30; c.stroke();
  c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = COL.purple; c.lineWidth = 18; c.stroke();
  line(c, [[x - r * 0.7, y - r * 0.5], [x - r * 0.4, y - r * 0.82]], 6, WHITE);
};
const woodBlock = (c: Ctx, x: number, y: number, w: number, h: number) => { shape(c, () => rrect(c, x, y, w, h, 10), COL.wood); line(c, [[x + 24, y + h * 0.35], [x + w - 40, y + h * 0.35]], 4, COL.woodDk); line(c, [[x + 50, y + h * 0.7], [x + w - 24, y + h * 0.7]], 4, COL.woodDk); };
const cap = (c: Ctx, x: number, y: number, r: number) => { shadow(c, x + 6, y + r * 0.8, r, r * 0.2); shape(c, () => ell(c, x, y, r, r), COL.red); shape(c, () => ell(c, x, y, r * 0.72, r * 0.72), "#c23e2a", 4); };
const nut = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + 6, y + r * 0.9, r, r * 0.2);
  const p: number[][] = []; for (let k = 0; k < 6; k++) p.push([x + Math.cos(k * Math.PI / 3) * r, y + Math.sin(k * Math.PI / 3) * r]);
  shape(c, () => polyP(c, p), COL.steel); shape(c, () => ell(c, x, y, r * 0.42, r * 0.42), "#6f6a62", 5);
};
const heldMag = (c: Ctx, cx: number, topY: number, w = 100, len = 250) => {
  vbar(c, cx - w / 2, topY, w, len);
  hand(c, cx, topY + 30, Math.PI / 2, 1.5, SKIN.child, CLOTH.child);
};
const tableBand = (c: Ctx, y: number) => { c.fillStyle = TABLE; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 5); };
const roundMag = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.9, r, r * 0.2);
  shape(c, () => ell(c, x, y, r, r), COL.red); shade(c, () => ell(c, x, y, r, r), "#a8321f", r * 0.3, r * 0.3, 0.45);
  shape(c, () => ell(c, x, y, r * 0.42, r * 0.42), COL.yellow, 5);
};
const bag = (c: Ctx, x: number, y: number, w: number, h: number) => { shape(c, () => rrect(c, x, y, w, h, 24), "rgba(255,255,255,0.4)", 4); line(c, [[x + w * 0.15, y + 14], [x + w * 0.15, y + h * 0.5]], 5, WHITE); };
const speck = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), "#2f2b36", 2); };
const almirah = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.55, y + h + 8, w * 0.6, 22);
  const b = () => rrect(c, x, y, w, h, 14);
  shape(c, b, COL.steel); shade(c, b, COL.steelDk, 40, 0, 0.45);
  line(c, [[x + w / 2, y + 20], [x + w / 2, y + h - 20]], 7);
  shape(c, () => rrect(c, x + w / 2 - 40, y + h * 0.45, 20, 90, 8), COL.steelDk, 5); shape(c, () => rrect(c, x + w / 2 + 20, y + h * 0.45, 20, 90, 8), COL.steelDk, 5);
};

// ---- flows
// e1 the great magnet test: things that stick, things that skip
const fe1 = (c: Ctx) => {
  ground(c);
  tableBand(c, 800);
  shadow(c, 290, 960, 250, 20); shadow(c, 810, 960, 250, 20);
  shape(c, () => rrect(c, 40, 470, 500, 490, 18), WHITE); shape(c, () => rrect(c, 560, 470, 480, 490, 18), WHITE);
  heldMag(c, 290, 10);
  nail(c, 290, 410, 230, Math.PI / 2);
  pin(c, 150, 640, 150, -0.3); pclip(c, 400, 640, 0.5, 0.4); spoon(c, 140, 800, 0, COL.steel, COL.steelDk); nail(c, 420, 880, 130, 0.1);
  tick(c, 290, 540, 1.1);
  foil(c, 700, 690); coin(c, 930, 690, 55); pencil(c, 790, 850, -0.04); cross(c, 810, 540, 1.1);
};
// e2 through the paper: a magnet under a stack of paper still holds a clip on top
const fe2 = (c: Ctx) => {
  ground(c);
  tableBand(c, 860);
  for (let k = 0; k < 7; k++) shape(c, () => rrect(c, 330 + (k % 2) * 12, 560 + k * 12, 440, 14, 3), WHITE, 3);
  pclip(c, 550, 510, 0.5, 0);
  shadow(c, 570, 860, 220, 14);
  hbar(c, 560, 700, 360, 100);
  hand(c, 250, 700, 0, 1.6, SKIN.child, CLOTH.child);
  arrow(c, [[550, 300], [550, 410]]);
  write(c, "30", 810, 240, 120, INK, 13);
  for (let k = 0; k < 3; k++) shape(c, () => rrect(c, 835 + k * 8, 390 + k * 10, 120, 80, 4), WHITE, 4);
};
// e3 make a nail a magnet: the nail hangs a chain of clips; copper does not
const fe3 = (c: Ctx) => {
  ground(c);
  tableBand(c, 880);
  heldMag(c, 270, 20);
  nail(c, 270, 420, 230, Math.PI / 2);
  pclip(c, 270, 590, 0.5, 0); pclip(c, 270, 660, 0.5, 0); pclip(c, 270, 730, 0.5, 0);
  tick(c, 270, 990, 1);
  heldMag(c, 800, 20);
  at(c, 850, 440, 0.45, 1, () => { line(c, [[-115, 0], [115, 0]], 20, INK); line(c, [[-115, 0], [115, 0]], 10, COPPER); });
  arrow(c, [[980, 330], [1000, 460]]);
  pclip(c, 770, 915, 0.5, 1.5); pclip(c, 900, 930, 0.5, 1.6);
  cross(c, 840, 1020, 0.8);
};
// a1 magnet hunt at home: sticks to the steel almirah, not to the wooden table
const fa1 = (c: Ctx) => {
  ground(c);
  tableBand(c, 930);
  almirah(c, 40, 200, 300, 730);
  hbar(c, 410, 560, 170, 70);
  hand(c, 540, 560, Math.PI, 1.5, SKIN.child, CLOTH.child);
  tick(c, 190, 110, 1.2);
  shadow(c, 830, 940, 190, 16);
  shape(c, () => rrect(c, 660, 520, 340, 50, 10), COL.wood); shape(c, () => rrect(c, 690, 570, 40, 360, 8), COL.woodDk); shape(c, () => rrect(c, 930, 570, 40, 360, 8), COL.woodDk);
  shape(c, () => rrect(c, 690, 570, 40, 360, 8), COL.woodDk);
  hbar(c, 830, 483, 170, 70);
  cross(c, 830, 330, 1.2);
};
// a2 be the atoms: arms pointing every which way in wood, all one way in iron
const fa2 = (c: Ctx) => {
  ground(c);
  tableBand(c, 900);
  woodBlock(c, 150, 90, 260, 90); cross(c, 280, 280, 1);
  shape(c, () => rrect(c, 700, 100, 40, 90, 8), COL.steelIn); nail(c, 800, 150, 230, 0);
  tick(c, 800, 280, 1);
  line(c, [[540, 60], [540, 1040]], 6, COL.greyDk);
  const L: [number, number][] = [[120, -2.5], [290, 0.6], [450, -1.0]];
  L.forEach(([x, a]) => person(c, x, 940, 330, { armR: [a, a], armL: [Math.PI * 0.55, Math.PI * 0.5], adult: false }));
  [600, 740, 880].forEach((x) => person(c, x, 940, 330, { armR: [-0.05, -0.05], armL: [Math.PI * 0.55, Math.PI * 0.5] }));
};
// a3 the kabadiwala's heap: a bagged magnet lifts the clips and pins out of the mixed heap
const fa3 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 1010, 460, 24);
  shape(c, () => rrect(c, 70, 560, 940, 430, 40), COL.steelIn); shade(c, () => rrect(c, 70, 560, 940, 430, 40), COL.steelDk, 0, 30, 0.35);
  cap(c, 200, 760, 55); cap(c, 760, 900, 50); foil(c, 470, 800); foil(c, 880, 700);
  const r = rnd(5); for (let i = 0; i < 40; i++) shape(c, () => ell(c, 120 + r() * 800, 620 + r() * 330, 8, 5, r() * 3), "#fffaf0", 2);
  shape(c, () => ell(c, 330, 880, 70, 22, 0.2), "#7bb0d9", 5);
  pclip(c, 640, 760, 0.45, 0.8); pclip(c, 330, 700, 0.45, 2.2); pin(c, 560, 920, 130, 0.3); pin(c, 160, 900, 120, -0.4);
  hbar(c, 350, 120, 300, 100);
  bag(c, 190, 50, 340, 160);
  pclip(c, 280, 290, 0.45, 0); pclip(c, 400, 290, 0.45, 0); pin(c, 340, 400, 110, Math.PI / 2);
  hand(c, 180, 130, 0, 1.5, SKIN.child, CLOTH.child);
  arrow(c, [[640, 640], [640, 440]]);
};
// a4 star dust: a bagged magnet drags black specks out of window dust; the lens shows tiny balls
const fa4 = (c: Ctx) => {
  ground(c);
  shadow(c, 480, 1000, 420, 20);
  shape(c, () => rrect(c, 60, 560, 840, 440, 16), WHITE);
  const r = rnd(9); for (let i = 0; i < 120; i++) shape(c, () => ell(c, 90 + r() * 780, 590 + r() * 380, 4 + r() * 3, 3, 0), r() < 0.5 ? "#c8b79b" : "#a89b86", 0);
  hbar(c, 330, 300, 320, 110);
  bag(c, 150, 220, 360, 170);
  for (let i = 0; i < 14; i++) speck(c, 220 + r() * 220, 400 + r() * 36, 5 + r() * 3);
  arrow(c, [[300, 530], [300, 450]]);
  // the lens
  line(c, [[800, 640], [940, 900]], 36, INK); line(c, [[800, 640], [940, 900]], 22, COL.brown);
  shape(c, () => ell(c, 740, 400, 230, 230), COL.glassEdge, 6);
  shape(c, () => ell(c, 740, 400, 200, 200), "#f6f3ec", 5);
  for (const [x, y, q] of [[690, 340, 38], [800, 380, 30], [720, 470, 34], [820, 480, 26], [650, 440, 22]] as number[][]) { shape(c, () => ell(c, x, y, q, q), "#2f2b36", 3); shine(c, [[x - q * 0.5, y - q * 0.3], [x - q * 0.25, y - q * 0.6]], 5); }
};
// a5 hidden iron in soil: a bagged magnet dragged through soil on a white plate gets black specks
const fa5 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 760, 440, 200);
  shape(c, () => ell(c, 330, 770, 170, 70), COL.soil); shade(c, () => ell(c, 330, 770, 170, 70), COL.soilDk, 30, 24, 0.55);
  const r = rnd(4); for (let i = 0; i < 9; i++) speck(c, 520 + i * 36 + r() * 8, 800 - i * 8 + r() * 8, 7);
  hbar(c, 760, 560, 250, 90);
  bag(c, 635, 490, 300, 140);
  for (let i = 0; i < 8; i++) speck(c, 660 + r() * 60, 640 + r() * 14, 6);
  hand(c, 640, 410, Math.PI / 2, 1.3, SKIN.child, CLOTH.child);
  arrow(c, [[560, 520], [470, 600]]);
};
// a6 the mystery bag: a magnet on a string comes out of the bag with steel things
const fa6 = (c: Ctx) => {
  ground(c);
  tableBand(c, 860);
  shadow(c, 300, 930, 230, 24);
  shape(c, () => { c.moveTo(130, 880); c.bezierCurveTo(60, 700, 120, 560, 210, 470); c.lineTo(390, 470); c.bezierCurveTo(480, 560, 540, 700, 470, 880); c.closePath(); }, "#c2a6e0");
  shade(c, () => { c.moveTo(130, 880); c.bezierCurveTo(60, 700, 120, 560, 210, 470); c.lineTo(390, 470); c.bezierCurveTo(480, 560, 540, 700, 470, 880); c.closePath(); }, "#9a7cc0", 50, 0, 0.5);
  shape(c, () => ell(c, 300, 470, 95, 22), "#4a3a64", 5);
  hand(c, 620, 90, 0.6, 1.2, SKIN.child, CLOTH.child);
  vbar(c, 690, 330, 90, 190);
  line(c, [[640, 150], [735, 330]], 6, INK);
  pclip(c, 735, 570, 0.5, 0); nut(c, 668, 535, 34); nail(c, 790, 582, 120, Math.PI / 2);
  cap(c, 880, 930, 44); shape(c, () => rrect(c, 700, 920, 110, 30, 10), COL.wood); cross(c, 840, 790, 0.8);
  tick(c, 740, 770, 0.8);
};
// a7 magnet tag: the tagger's magnet picks up the nail card; the wooden spoon card is left
const fa7 = (c: Ctx) => {
  ground(c);
  tableBand(c, 950);
  person(c, 220, 960, 640, { armR: [0, 0], armL: [Math.PI * 0.55, Math.PI * 0.5] });
  hbar(c, 640, 530, 180, 70);
  const card = (x: number, y: number, rot: number, icon: (cc: Ctx) => void) => at(c, x, y, rot, 1, () => { shadow(c, 8, 10, 60, 70); shape(c, () => rrect(c, -60, -70, 120, 140, 10), WHITE); icon(c); });
  card(780, 450, -0.1, (cc) => { nail(cc, 0, 0, 100, Math.PI / 2); });
  card(790, 610, 0.1, (cc) => { pclip(cc, 0, 0, 0.45, 0); });
  tick(c, 560, 380, 0.9);
  person(c, 930, 960, 520, { adult: true, armL: [Math.PI * 0.6, Math.PI * 0.55] });
  card(930, 780, 0.05, (cc) => { spoon(cc, -20, 0, 0, COL.wood, COL.woodDk); });
  cross(c, 930, 420, 0.9);
};
// a8 magnet painting: a paint-covered clip is dragged across the paper by a magnet beneath
const fa8 = (c: Ctx) => {
  ground(c);
  hand(c, 540, 896, -Math.PI / 2, 1.8, SKIN.child, CLOTH.child);
  hbar(c, 540, 770, 220, 80);
  shadow(c, 560, 740, 400, 40);
  shape(c, () => ell(c, 540, 470, 420, 270), WHITE); shape(c, () => ell(c, 540, 470, 330, 200), "#f6f1e6", 4);
  const path = [[260, 560], [330, 420], [450, 380], [520, 470], [600, 560], [700, 520], [740, 420]];
  c.beginPath(); path.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.strokeStyle = COL.pink; c.lineWidth = 20; c.lineCap = "round"; c.lineJoin = "round"; c.stroke();
  c.beginPath(); [[300, 600], [420, 640], [560, 650], [660, 610]].forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.strokeStyle = COL.blue; c.lineWidth = 18; c.stroke();
  pclip(c, 740, 400, 0.4, 0.4);
  arrow(c, [[780, 560], [900, 480]]);
};
// p1 the sorting ramp: clips stay on the ramp over the magnet, rice rolls off into the bowl
const fp1 = (c: Ctx) => {
  ground(c);
  tableBand(c, 950);
  const a = Math.atan2(0.324, 1), p = (x: number) => [x, 516 + (x - 100) * 0.324];
  for (let k = 0; k < 4; k++) shape(c, () => rrect(c, 50 + (k % 2) * 14, 860 - k * 90, 290, 90, 8), [COL.blue, COL.red, COL.green, COL.orange][k]);
  at(c, 100, 516, a, 1, () => { shape(c, () => rrect(c, 0, 0, 780, 36, 4), "#d9b27c"); });
  const m = p(520); at(c, m[0] - 15, m[1] + 46, a, 1, () => hbar(c, 0, 0, 220, 64));
  for (const x of [470, 540, 600]) { const q = p(x); pclip(c, q[0] + 14, q[1] - 40, 0.42, a); }
  for (const x of [700, 760, 810]) { const q = p(x); seed(c, q[0] + 4, q[1] - 11, 11, a, false, "#fffaf0", COL.cloth); }
  arrow(c, [[300, 470], [400, 500]]);
  bowl(c, 900, 850, 150);
  const r = rnd(2); for (let i = 0; i < 8; i++) seed(c, 830 + r() * 140, 846 + r() * 20, 11, r() * 3, false, "#fffaf0", COL.cloth);
  arrow(c, [[900, 700], [900, 790]]);
};
// c1 rescue the pin: a bagged magnet on a string lifts the pin out of the rice
const fc1 = (c: Ctx) => {
  ground(c);
  bowl(c, 540, 760, 350);
  shape(c, () => ell(c, 540, 760, 335, 52), "#fbf4e3", 4);
  const r = rnd(3); for (let i = 0; i < 90; i++) { const t = r() * Math.PI * 2, d = Math.sqrt(r()); seed(c, 540 + Math.cos(t) * d * 300, 765 + Math.sin(t) * d * 36, 12, r() * 3, false, "#fffaf0", COL.cloth); }
  vbar(c, 495, 330, 90, 200);
  bag(c, 470, 305, 140, 260);
  line(c, [[540, 170], [540, 310]], 6, INK);
  hand(c, 540, 60, Math.PI / 2, 1.3, SKIN.child, CLOTH.child);
  pin(c, 540, 665, 190, Math.PI / 2);
  arrow(c, [[720, 700], [720, 520]]);
};
// c2 the cupboard door puzzle: on plain wood the magnet falls; with a taped steel lid it stays
const fc2 = (c: Ctx) => {
  ground(c);
  tableBand(c, 950);
  shadow(c, 260, 960, 220, 16); shadow(c, 800, 960, 220, 16);
  shape(c, () => rrect(c, 60, 130, 400, 800, 14), COL.wood); line(c, [[100, 330], [420, 330]], 4, COL.woodDk); line(c, [[100, 600], [420, 600]], 4, COL.woodDk);
  arrow(c, [[260, 340], [260, 540]]); roundMag(c, 260, 890, 60); cross(c, 260, 80, 0.9);
  shape(c, () => rrect(c, 600, 130, 400, 800, 14), COL.wood); line(c, [[640, 330], [960, 330]], 4, COL.woodDk); line(c, [[640, 600], [960, 600]], 4, COL.woodDk);
  shape(c, () => ell(c, 800, 460, 125, 125), COL.steel); shade(c, () => ell(c, 800, 460, 125, 125), COL.steelDk, 30, 30, 0.5);
  at(c, 800, 460, 0.5, 1, () => { shape(c, () => rrect(c, -170, -22, 340, 44, 4), "rgba(255,226,120,0.75)", 3); });
  at(c, 800, 460, -0.5, 1, () => { shape(c, () => rrect(c, -170, -22, 340, 44, 4), "rgba(255,226,120,0.75)", 3); });
  roundMag(c, 800, 460, 70);
  tick(c, 800, 80, 0.9);
};

// ---- terms
// term.1 attract: the clip leaps up to the magnet
const tAttract = (c: Ctx) => {
  ground(c);
  tableBand(c, 900);
  heldMag(c, 540, 20);
  shadow(c, 560, 910, 120, 14);
  pclip(c, 540, 680, 0.85, 0);
  arrow(c, [[350, 760], [350, 520]]); arrow(c, [[730, 760], [730, 520]]);
  for (const x of [470, 540, 610]) line(c, [[x, 440], [x, 480]], 6, COL.greyDk);
};
// term.2 repel: like ends facing, the two magnets push apart
const tRepel = (c: Ctx) => {
  ground(c);
  tableBand(c, 720);
  hbar(c, 290, 600, 380, 130);
  c.save(); c.translate(790, 0); c.scale(-1, 1); c.translate(-790, 0); hbar(c, 790, 600, 380, 130); c.restore();
  arrow(c, [[200, 400], [70, 400]]); arrow(c, [[880, 400], [1010, 400]]);
  for (const dy of [-40, 0, 40]) { line(c, [[510, 600 + dy], [540, 600 + dy - 14]], 7, COL.greyDk); line(c, [[570, 600 + dy], [540, 600 + dy - 14]], 7, COL.greyDk); }
};
// term.6 non-magnetic: nothing moves under the magnet
const tNon = (c: Ctx) => {
  ground(c);
  tableBand(c, 780);
  heldMag(c, 540, 20);
  spoon(c, 110, 700, 0, COL.wood, COL.woodDk);
  bangle(c, 540, 690, 80);
  foil(c, 880, 700);
  cross(c, 190, 900, 0.9); cross(c, 540, 930, 0.9); cross(c, 880, 900, 0.9);
};
// term.11 alloy: two metals poured into one mould come out as a new metal
const pot = (c: Ctx, col: string, dk: string) => {
  shape(c, () => polyP(c, [[-90, -70], [90, -70], [70, 80], [-70, 80]]), col); shade(c, () => polyP(c, [[-90, -70], [90, -70], [70, 80], [-70, 80]]), dk, 30, 0, 0.55);
  shape(c, () => ell(c, 0, -70, 90, 18), "#4a3f40", 5);
};
const tAlloy = (c: Ctx) => {
  ground(c);
  at(c, 330, 330, 0.8, 1, () => { line(c, [[-80, 0], [-230, 0]], 22, INK); line(c, [[-80, 0], [-230, 0]], 10, COL.steelDk); pot(c, COL.steel, COL.steelDk); });
  hand(c, 330 - 300 * Math.cos(0.8), 330 - 300 * Math.sin(0.8), 0.8, 1, SKIN.adult, CLOTH.adult);
  at(c, 750, 330, -0.8, 1, () => { line(c, [[80, 0], [230, 0]], 22, INK); line(c, [[80, 0], [230, 0]], 10, COPPER); pot(c, "#d98a5a", "#a8603a"); });
  hand(c, 750 + 300 * Math.cos(-0.8), 330 + 300 * Math.sin(-0.8), Math.PI - 0.8, 1, SKIN.adult, CLOTH.adult);
  const stream = (x0: number, y0: number, x1: number, col: string) => { c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(x1 - (x1 - x0) * 0.1, y0 + 80, x1, 730); c.strokeStyle = INK; c.lineWidth = 26; c.lineCap = "round"; c.stroke(); c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(x1 - (x1 - x0) * 0.1, y0 + 80, x1, 730); c.strokeStyle = col; c.lineWidth = 14; c.stroke(); };
  stream(443, 346, 500, COL.steel); stream(637, 346, 580, COPPER);
  shadow(c, 560, 910, 330, 22);
  shape(c, () => rrect(c, 300, 740, 480, 160, 20), COL.steelDk);
  shape(c, () => rrect(c, 330, 720, 420, 70, 14), GOLD); shine(c, [[370, 745], [520, 745]], 10);
  for (const [x, y] of [[690, 700], [800, 690], [260, 700]]) { line(c, [[x, y - 24], [x, y + 24]], 7, COL.yellow); line(c, [[x - 24, y], [x + 24, y]], 7, COL.yellow); }
};
// term.17 atom: nail, a speck of iron, then the tiny balls it is made of
const tAtom = (c: Ctx) => {
  ground(c);
  nail(c, 230, 190, 340, 0.45);
  arrow(c, [[330, 330], [430, 420]]);
  shape(c, () => polyP(c, [[470, 470], [560, 440], [650, 470], [670, 540], [610, 600], [520, 590], [460, 540]]), COL.steelDk); shine(c, [[500, 480], [560, 458]], 8);
  arrow(c, [[600, 615], [665, 660]]);
  const cx = 770, cy = 840, R = 200;
  shape(c, () => ell(c, cx, cy, R, R), COL.sky, 7);
  c.save(); c.beginPath(); ell(c, cx, cy, R - 4, R - 4); c.clip();
  for (let row = -3; row <= 3; row++) for (let col = -3; col <= 3; col++) {
    const x = cx + col * 104 + (row % 2) * 52, y = cy + row * 90;
    shape(c, () => ell(c, x, y, 46, 46), COL.steel); shade(c, () => ell(c, x, y, 46, 46), COL.steelDk, 14, 14, 0.55); shine(c, [[x - 24, y - 12], [x - 12, y - 28]], 6);
  }
  c.restore(); shape(c, () => ell(c, cx, cy, R, R), "rgba(0,0,0,0)", 7);
};
// term.19 domain: a zoomed nail splits into patches, each patch full of arrows pointing one way
const tDomain = (c: Ctx) => {
  ground(c);
  const cx = 600, cy = 440, R = 360, cols = [COL.sky, COL.greenLt, COL.pink, COL.yellow, "#d6c8f0", "#ffd9b0"], dirs = [0.3, 2.6, -1.1, 1.6, -2.4, 3.0];
  c.save(); c.beginPath(); ell(c, cx, cy, R, R); c.clip();
  for (let k = 0; k < 6; k++) {
    const a0 = -Math.PI / 2 + k * Math.PI / 3, a1 = a0 + Math.PI / 3, mx = cx + Math.cos((a0 + a1) / 2) * R * 0.55, my = cy + Math.sin((a0 + a1) / 2) * R * 0.55;
    shape(c, () => polyP(c, [[cx, cy], [cx + Math.cos(a0) * R * 1.2, cy + Math.sin(a0) * R * 1.2], [cx + Math.cos(a1) * R * 1.2, cy + Math.sin(a1) * R * 1.2]]), cols[k], 5);
    for (const [ox, oy] of [[0, 0], [-60, 50], [60, -50], [50, 60], [-50, -60]]) if (Math.hypot(mx + ox - cx, my + oy - cy) < R - 50) ang(c, mx + ox - Math.cos(dirs[k]) * 22, my + oy - Math.sin(dirs[k]) * 22, dirs[k], 44);
  }
  c.restore(); shape(c, () => ell(c, cx, cy, R, R), "rgba(0,0,0,0)", 8);
  nail(c, 230, 900, 340, -0.25);
  shape(c, () => ell(c, 330, 880, 54, 54), "rgba(255,255,255,0.35)", 5);
  arrow(c, [[400, 830], [470, 775]]);
};
// term.20 magnetise: stroke a nail with a magnet and the nail picks up clips by itself
const tMagnetise = (c: Ctx) => {
  ground(c);
  tableBand(c, 780);
  hbar(c, 290, 440, 240, 90);
  hand(c, 80, 440, 0, 1.5, SKIN.child, CLOTH.child);
  nail(c, 290, 740, 340, 0);
  arrow(c, [[130, 590], [460, 590]]);
  line(c, [[540, 130], [540, 1040]], 5, COL.greyDk);
  nail(c, 810, 745, 340, 0);
  pclip(c, 660, 680, 0.45, 0.5); pclip(c, 740, 690, 0.45, -0.5);
  tick(c, 810, 560, 1.2);
};
// term.21 curie point: a red-hot nail no longer sticks to the magnet
const tCurie = (c: Ctx) => {
  ground(c);
  tableBand(c, 820);
  shadow(c, 220, 840, 200, 16);
  hbar(c, 220, 760, 330, 120);
  shape(c, () => ell(c, 630, 760, 170, 60), "rgba(255,211,77,0.5)", 0);
  line(c, [[470, 760], [790, 760]], 28, INK); line(c, [[470, 760], [790, 760]], 16, COL.red); line(c, [[480, 760], [780, 760]], 6, COL.yellow);
  shape(c, () => ell(c, 790, 760, 26, 26), COL.red, 5);
  line(c, [[790, 760], [960, 640]], 22, INK); line(c, [[790, 760], [960, 640]], 11, COL.steelDk);
  line(c, [[790, 760], [960, 700]], 22, INK); line(c, [[790, 760], [960, 700]], 11, COL.steel);
  hand(c, 960, 660, -0.3, 1.4, SKIN.adult, CLOTH.adult);
  cross(c, 440, 520, 1.1);
};

// ---- explanations
// expl.0 what magnetic means
const eMeans = (c: Ctx) => {
  ground(c);
  for (const y of [190, 540, 890]) shape(c, () => rrect(c, 50, y - 140, 980, 280, 26), WHITE);
  hbar(c, 230, 190, 220, 80); pclip(c, 560, 190, 0.5, Math.PI / 2); arrow(c, [[480, 90], [380, 90]]); tick(c, 880, 190, 1.1);
  hbar(c, 230, 540, 220, 80); comb(c, 620, 540); cross(c, 880, 540, 1.1);
  shape(c, () => rrect(c, 150, 785, 480, 210, 14), COL.steelIn); shape(c, () => rrect(c, 280, 805, 190, 120, 4), WHITE, 4); shape(c, () => ell(c, 375, 840, 20, 20), COL.yellow, 4); shape(c, () => polyP(c, [[320, 905], [320, 870], [375, 850], [430, 870], [430, 905]]), COL.red, 4); roundMag(c, 375, 805, 36); tick(c, 880, 890, 1.1);
};
// expl.1 which materials a magnet attracts: iron things on the tick shelf, the rest on the cross shelf
const eWhich = (c: Ctx) => {
  ground(c);
  tick(c, 140, 300, 1.5);
  shape(c, () => rrect(c, 60, 440, 960, 36, 8), COL.wood);
  nail(c, 270, 424, 200, 0); pin(c, 500, 430, 150, 0); pclip(c, 640, 408, 0.5, Math.PI / 2); spoon(c, 790, 414, 0, COL.steel, COL.steelDk);
  cross(c, 140, 740, 1.5);
  shape(c, () => rrect(c, 60, 900, 960, 36, 8), COL.wood);
  shape(c, () => rrect(c, 230, 860, 140, 40, 8), COL.cloth, 5); line(c, [[250, 880], [350, 880]], 3, COL.grey);
  comb(c, 490, 840); spoon(c, 700, 872, 0, COL.wood, COL.woodDk); bangle(c, 960, 848, 46);
};
// expl.2 not every metal is magnetic
const eMetals = (c: Ctx) => {
  ground(c);
  tableBand(c, 700);
  nail(c, 130, 520, 300, Math.PI / 2);
  foil(c, 340, 600);
  shadow(c, 560, 690, 90, 14);
  shape(c, () => ell(c, 560, 580, 85, 85), COPPER); shade(c, () => ell(c, 560, 580, 85, 85), "#9c5530", 28, 28, 0.5);
  shape(c, () => rrect(c, 525, 475, 70, 60, 8), COPPER); shape(c, () => ell(c, 560, 475, 48, 12), "#7a4426", 4);
  shadow(c, 770, 690, 80, 12);
  shape(c, () => { c.moveTo(690, 640); c.bezierCurveTo(700, 690, 840, 690, 850, 640); c.lineTo(900, 600); c.lineTo(830, 590); c.lineTo(690, 590); c.closePath(); }, BRASS); shine(c, [[710, 612], [770, 612]], 7);
  shape(c, () => ell(c, 770, 590, 80, 16), BRASSDK, 5);
  ring(c, 960, 620);
  tick(c, 130, 830, 1); for (const x of [340, 560, 770, 960]) cross(c, x, 830, 1);
};
const ring = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 6, y + 58, 50, 10);
  c.beginPath(); ell(c, x, y, 46, 46); c.strokeStyle = INK; c.lineWidth = 30; c.stroke();
  c.beginPath(); ell(c, x, y, 46, 46); c.strokeStyle = GOLD; c.lineWidth = 18; c.stroke();
  shape(c, () => polyP(c, [[x, y - 70], [x + 18, y - 52], [x, y - 36], [x - 18, y - 52]]), COL.sky, 4);
};
// expl.7 frog floating above a very strong magnet
const eFrog = (c: Ctx) => {
  ground(c);
  shadow(c, 545, 960, 330, 26);
  const body = () => rrect(c, 260, 640, 570, 300, 30);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, 60, 0, 0.45);
  shape(c, () => ell(c, 545, 640, 285, 60), COL.steelIn, 6);
  shape(c, () => rrect(c, 260, 780, 570, 56, 6), COL.blue, 6);
  const fx = 545, fy = 330;
  for (const s of [-1, 1]) {
    shape(c, () => ell(c, fx + s * 160, fy + 70, 70, 45, s * 0.5), COL.leaf, 6);
    shape(c, () => ell(c, fx + s * 210, fy + 118, 55, 22), COL.greenLt, 5);
    shape(c, () => ell(c, fx + s * 90, fy + 120, 24, 50, s * -0.3), COL.leaf, 5);
  }
  shape(c, () => ell(c, fx, fy, 150, 105), COL.leaf); shade(c, () => ell(c, fx, fy, 150, 105), COL.leafDk, 40, 30, 0.45);
  shape(c, () => ell(c, fx, fy + 36, 90, 52), COL.greenLt, 0);
  for (const s of [-1, 1]) { shape(c, () => ell(c, fx + s * 65, fy - 88, 40, 40), COL.leaf, 6); shape(c, () => ell(c, fx + s * 65, fy - 90, 25, 25), WHITE, 4); shape(c, () => ell(c, fx + s * 65, fy - 88, 11, 14), INK, 0); }
  c.beginPath(); c.arc(fx, fy - 5, 62, 0.25, Math.PI - 0.25); c.strokeStyle = INK; c.lineWidth = 6; c.lineCap = "round"; c.stroke();
  arrow(c, [[860, 600], [860, 420]]); arrow(c, [[230, 600], [230, 420]]);
};
// expl.11 a magnet works through a table and through a glass of water
const eThrough = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 420, 460, 50, 8), COL.wood);
  shape(c, () => rrect(c, 80, 470, 40, 420, 8), COL.woodDk); shape(c, () => rrect(c, 420, 470, 40, 420, 8), COL.woodDk);
  pclip(c, 270, 360, 0.5, 0); arrow(c, [[330, 320], [450, 320]]);
  hbar(c, 270, 560, 250, 90); hand(c, 120, 560, 0, 1.5, SKIN.child, CLOTH.child);
  tableBand(c, 930);
  glass(c, 770, 930, 300, 560, 0.85);
  pclip(c, 850, 760, 0.45, 0); arrow(c, [[780, 800], [780, 620]]);
  vbar(c, 940, 680, 90, 250);
};
// expl.12 the Earth has an iron heart
const eEarth = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 540, R = 270;
  for (const k of [270, 440]) for (const s of [-1, 1]) {
    c.beginPath(); c.moveTo(cx, cy - R); c.bezierCurveTo(cx + s * k, cy - R * 1.45, cx + s * k, cy + R * 1.45, cx, cy + R);
    c.strokeStyle = COL.purple; c.lineWidth = 8; c.lineCap = "round"; c.stroke();
  }
  shape(c, () => ell(c, cx, cy, R, R), COL.brown, 7);
  shape(c, () => ell(c, cx, cy, R - 26, R - 26), COL.orange, 5);
  shape(c, () => ell(c, cx, cy, 150, 150), COL.yellow, 5);
  shape(c, () => ell(c, cx, cy, 72, 72), COL.red, 5);
  const sw: number[][] = []; for (let a = 0.3; a < 2.2; a += 0.15) sw.push([cx + Math.cos(a) * 112, cy + Math.sin(a) * 112]);
  line(c, sw, 8, COL.orange);
  const sw2: number[][] = []; for (let a = 3.5; a < 5.4; a += 0.15) sw2.push([cx + Math.cos(a) * 112, cy + Math.sin(a) * 112]);
  line(c, sw2, 8, COL.orange);
};
// expl.15 super-strong magnets: tiny discs lift a spanner, and must never go near the mouth
const spanner = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 30, y + 330, 70, 14);
  shape(c, () => polyP(c, [[x - 28, y + 80], [x + 28, y + 80], [x + 22, y + 320], [x - 22, y + 320]]), COL.steel);
  shape(c, () => { c.moveTo(x - 80, y + 90); c.lineTo(x - 80, y - 40); c.lineTo(x - 30, y - 40); c.lineTo(x - 30, y + 10); c.lineTo(x + 30, y + 10); c.lineTo(x + 30, y - 40); c.lineTo(x + 80, y - 40); c.lineTo(x + 80, y + 90); c.closePath(); }, COL.steel);
  shine(c, [[x - 60, y + 70], [x - 60, y - 20]], 8);
};
const eStrong = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 90, 70, 330, 70, 8), COL.steelDk);
  shape(c, () => rrect(c, 200, 140, 120, 36, 12), "#dfe5ec"); shine(c, [[215, 152], [260, 152]], 6);
  spanner(c, 260, 216);
  const hx = 780, hy = 470;
  shape(c, () => ell(c, hx, hy, 150, 160), SKIN.child); shape(c, () => ell(c, hx, hy - 90, 150, 100), CLOTH.hair, 0);
  shape(c, () => ell(c, hx - 55, hy - 20, 14, 18), INK, 0); shape(c, () => ell(c, hx + 55, hy - 20, 14, 18), INK, 0);
  shape(c, () => ell(c, hx, hy + 70, 46, 30), "#8c2a2a", 5);
  shape(c, () => ell(c, hx + 6, hy + 62, 15, 10), "#dfe5ec", 3);
  c.beginPath(); ell(c, hx, hy + 20, 250, 250); c.strokeStyle = RED; c.lineWidth = 26; c.stroke();
  line(c, [[hx - 176, hy - 156], [hx + 176, hy + 196]], 26, RED);
};

export const ic_materialsMagneticMaterialsL3 = cards("sci.materials.magnetic-materials.L3 cards", [
  fe1, fe2, fe3, fa1, fa2, fa3, fa4, fa5, fa6, fa7, fa8, fp1, fc1, fc2,
  tAttract, tRepel, tNon, tAlloy, tAtom, tDomain, tMagnetise, tCurie,
  eMeans, eWhich, eMetals, eFrog, eThrough, eEarth, eStrong,
]);
void BG; void write; void glass;
