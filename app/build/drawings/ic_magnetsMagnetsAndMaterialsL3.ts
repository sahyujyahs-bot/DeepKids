import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, SKIN, WHITE, arrow, bowl, cards, ell, glass, ground, hand, line, polyP, rnd, rrect, shade, shadow, shape, shine, write } from "./flatKit";

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

// ---- cards
// summary: magnet holding clips, the Earth with its field, a compass
const summary = (c: Ctx) => {
  ground(c);
  hbar(c, 330, 210, 480, 140);
  pclip(c, 130, 335, 0.66, 0); pclip(c, 530, 335, 0.66, 0); pclip(c, 590, 290, 0.5, 1.3);
  // Earth with field loops
  const ex = 740, ey = 720, R = 190;
  for (const k of [200, 340]) for (const s of [-1, 1]) {
    c.beginPath(); c.moveTo(ex, ey - R); c.bezierCurveTo(ex + s * k, ey - R * 1.55, ex + s * k, ey + R * 1.55, ex, ey + R);
    c.strokeStyle = COL.purple; c.lineWidth = 8; c.lineCap = "round"; c.stroke();
  }
  shape(c, () => ell(c, ex, ey, R, R), COL.blue);
  c.save(); c.beginPath(); ell(c, ex, ey, R, R); c.clip();
  shape(c, () => polyP(c, [[ex - 130, ey - 100], [ex - 25, ey - 140], [ex + 12, ey - 40], [ex - 75, ey + 12], [ex - 140, ey - 25]]), COL.green, 5);
  shape(c, () => polyP(c, [[ex + 38, ey + 12], [ex + 150, ey - 25], [ex + 140, ey + 100], [ex + 62, ey + 150], [ex + 25, ey + 75]]), COL.green, 5);
  shade(c, () => ell(c, ex, ey, R, R), COL.blueDk, 50, 50, 0.45); c.restore();
  shape(c, () => ell(c, ex, ey, R, R), "rgba(0,0,0,0)", 7);
  compass(c, 210, 770, 150, UP);
};
// term.3 magnetic force: a fridge magnet holds a child's drawing on the fridge door
const termForce = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1010, 400, 30);
  shape(c, () => rrect(c, 160, 70, 740, 930, 40), COL.steelIn); shade(c, () => rrect(c, 160, 70, 740, 930, 40), COL.steelDk, 40, 0, 0.45);
  line(c, [[160, 360], [900, 360]], 6);
  shape(c, () => rrect(c, 800, 150, 34, 160, 14), COL.steelDk, 6);
  at(c, 530, 640, -0.06, 1, () => {
    shadow(c, 14, 14, 250, 200);
    shape(c, () => rrect(c, -250, -210, 500, 420, 8), WHITE);
    shape(c, () => ell(c, 130, -110, 50, 50), COL.yellow, 5);
    shape(c, () => polyP(c, [[-170, 80], [-170, -30], [-60, -100], [50, -30], [50, 80]]), COL.red, 5);
    shape(c, () => rrect(c, -90, 10, 60, 70, 4), COL.brown, 4);
    shape(c, () => rrect(c, -150, -20, 50, 44, 4), COL.sky, 4);
    line(c, [[-250, 130], [250, 130]], 6, COL.greenDk);
    shape(c, () => ell(c, 0, -205, 36, 36), COL.red, 6); shape(c, () => ell(c, 0, -205, 14, 14), COL.blue, 4);
  });
};
// term.6 steel: an almirah holds the magnet; a steel tumbler does not
const termSteel = (c: Ctx) => {
  ground(c);
  shadow(c, 290, 960, 240, 24);
  shape(c, () => rrect(c, 70, 110, 440, 850, 14), COL.steel); shade(c, () => rrect(c, 70, 110, 440, 850, 14), COL.steelDk, 40, 0, 0.45);
  line(c, [[290, 130], [290, 940]], 7);
  shape(c, () => rrect(c, 250, 480, 22, 90, 8), COL.steelDk, 5); shape(c, () => rrect(c, 308, 480, 22, 90, 8), COL.steelDk, 5);
  hbar(c, 390, 300, 130, 56);
  steelCup(c, 790, 860, 260, 380);
  at(c, 600, 480, 0.9, 1, () => hbar(c, 0, 0, 130, 56));
  arrow(c, [[560, 560], [560, 700]]);
};
// term.18 permanent magnet: a bar magnet, a fridge magnet and a lodestone, all holding iron
const termPermanent = (c: Ctx) => {
  ground(c);
  hbar(c, 540, 190, 520, 130);
  pclip(c, 330, 340, 0.6, 0); pclip(c, 750, 340, 0.6, 0);
  // fridge magnet: a round red magnet with a yellow flower, holding a clip
  shadow(c, 300, 825, 140, 22);
  shape(c, () => ell(c, 290, 700, 130, 130), COL.red); shade(c, () => ell(c, 290, 700, 130, 130), "#a8321f", 40, 40, 0.45);
  for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; shape(c, () => ell(c, 290 + Math.cos(a) * 52, 700 + Math.sin(a) * 52, 30, 30), COL.yellow, 5); }
  shape(c, () => ell(c, 290, 700, 28, 28), COL.orange, 5);
  pclip(c, 120, 640, 0.5, 1.3);
  // lodestone with nails
  lodestone(c, 790, 700, 1.15);
  nail(c, 930, 640, 120, -0.3); nail(c, 650, 600, 110, 2.5); nail(c, 790, 570, 100, -1.6);
};
// expl.4 spin: an electron is a tiny ball with a tiny magnet inside, spinning
const explSpin = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 920, 230, 30);
  shape(c, () => ell(c, 540, 540, 220, 220), COL.sky); shade(c, () => ell(c, 540, 540, 220, 220), COL.blue, 60, 60, 0.35);
  shine(c, [[400, 420], [450, 370]], 12);
  at(c, 540, 540, 0, 1, () => {
    shape(c, () => rrect(c, -50, -135, 100, 135, 12), COL.red); shape(c, () => rrect(c, -50, 0, 100, 135, 12), COL.blue);
    shade(c, () => rrect(c, -50, -135, 100, 270, 12), "#2b2340", 28, 0, 0.18);
    shape(c, () => rrect(c, -50, -135, 100, 270, 12), "rgba(0,0,0,0)", 6);
  });
  const pts: number[][] = [];
  for (let a = -2.7; a <= 0.6; a += 0.12) pts.push([540 + Math.cos(a) * 310, 540 + Math.sin(a) * 100 - 20]);
  arrow(c, pts);
  const pts2: number[][] = [];
  for (let a = 0.5; a <= 3.6; a += 0.12) pts2.push([540 + Math.cos(a) * 310, 540 + Math.sin(a) * 100 - 20 + 40]);
  arrow(c, pts2);
};
// expl.7 how lodestones became magnets: lightning hits a stone, and then it holds nails
const explLightning = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#d9c9a6"; c.fillRect(0, 760, 1080, 320); line(c, [[0, 760], [1080, 760]], 5);
  const cloud = (x: number, y: number, s: number) => shape(c, () => { c.moveTo(x - 140 * s, y + 50 * s); c.arc(x - 100 * s, y, 60 * s, Math.PI * 0.6, Math.PI * 1.5); c.arc(x - 20 * s, y - 40 * s, 80 * s, Math.PI * 1.1, Math.PI * 1.9); c.arc(x + 80 * s, y, 65 * s, Math.PI * 1.4, Math.PI * 0.45); c.closePath(); }, "#8c8a99", 6);
  cloud(250, 180, 1.2);
  shape(c, () => polyP(c, [[260, 270], [350, 270], [310, 420], [380, 420], [230, 650], [270, 480], [215, 480]]), COL.yellow, 6);
  lodestone(c, 250, 700, 0.9);
  arrow(c, [[480, 520], [600, 520]]);
  lodestone(c, 810, 700, 0.9);
  nail(c, 800, 560, 130, -1.55); nail(c, 920, 620, 120, -0.45); nail(c, 690, 620, 120, 3.6);
};
// expl.12 a live frog floats above a giant magnet
const explFrog = (c: Ctx) => {
  ground(c);
  shadow(c, 545, 960, 330, 26);
  const body = () => rrect(c, 260, 640, 570, 300, 30);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, 60, 0, 0.45);
  shape(c, () => ell(c, 545, 640, 285, 60), COL.steelIn, 6);
  shape(c, () => rrect(c, 260, 780, 570, 56, 6), COL.blue, 6);
  // frog, seen from the front
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
// e1 floating needle compass
const e1 = (c: Ctx) => {
  ground(c);
  bowlTop(c, 380, 540, 330);
  at(c, 380, 540, UP + 0.12, 1, () => {
    shadow(c, 8, 12, 80, 64);
    shape(c, () => rrect(c, -80, -60, 160, 120, 8), WHITE, 5);
    line(c, [[-110, 0], [110, 0]], 20, INK); line(c, [[-110, 0], [110, 0]], 9, COL.steel);
    shape(c, () => polyP(c, [[110, -9], [128, 0], [110, 9]]), COL.steel, 3);
  });
  arrow(c, [[270, 330], [400, 270], [500, 300]], RED, 9);
  compass(c, 880, 260, 118, UP + 0.12);
  // stroking a needle with a magnet
  line(c, [[740, 880], [1000, 880]], 20, INK); line(c, [[740, 880], [1000, 880]], 9, COL.steel);
  hbar(c, 880, 790, 220, 80);
  arrow(c, [[770, 960], [990, 960]]);
};
// e2 paper clip chains of different lengths
const e2 = (c: Ctx) => {
  ground(c);
  const mags: [number, number, number][] = [[200, 120, 5], [540, 84, 3], [880, 44, 1]];
  for (const [x, th, n] of mags) {
    hbar(c, x, 130, 250, th);
    for (let i = 0; i < n; i++) pclip(c, x, 130 + th / 2 + 40 + i * 78, 0.5, 0);
  }
  write(c, "5", 175, 860, 110, INK, 12); write(c, "3", 515, 860, 110, INK, 12); write(c, "1", 855, 860, 110, INK, 12);
};
// a1 guess then test: iron things cling to the magnet, others stay on the table
const a1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = TABLE; c.fillRect(0, 830, 1080, 250); line(c, [[0, 830], [1080, 830]], 5);
  vbar(c, 475, 190, 130, 330);
  hand(c, 540, 230, Math.PI / 2, 2.0, SKIN.child, CLOTH.child);
  nail(c, 548, 635, 230, Math.PI / 2); pin(c, 600, 615, 190, Math.PI / 2); pclip(c, 495, 575, 0.5, 0);
  key(c, 100, 930, 0.1); pencil(c, 450, 960, -0.05); foil(c, 740, 930); coin(c, 940, 930, 55);
};
// a3 timeline on a string
const a3 = (c: Ctx) => {
  ground(c);
  const sag = (x: number) => 250 + Math.sin((x / 1080) * Math.PI) * 50;
  c.beginPath(); c.moveTo(0, 250); for (let x = 0; x <= 1080; x += 30) c.lineTo(x, sag(x)); c.strokeStyle = COL.brown; c.lineWidth = 9; c.stroke();
  const cardAt = (x: number, rot: number, icon: (cc: Ctx) => void) => {
    const y = sag(x + 100);
    at(c, x + 100, y, rot, 1, () => {
      shadow(c, 12, 300, 100, 20);
      shape(c, () => rrect(c, -100, 14, 200, 310, 12), WHITE);
      shape(c, () => rrect(c, -16, -12, 32, 66, 6), COL.woodDk, 5);
      c.save(); c.translate(0, 170); icon(c); c.restore();
    });
  };
  cardAt(38, -0.05, (cc) => lodestone(cc, 0, 10, 0.55));
  cardAt(290, 0.04, (cc) => {
    shape(cc, () => ell(cc, 0, 60, 80, 36), COL.water, 5);
    shape(cc, () => { cc.moveTo(-50, 0); cc.quadraticCurveTo(0, -40, 55, 0); cc.quadraticCurveTo(0, 36, -50, 0); cc.closePath(); cc.moveTo(55, 0); cc.lineTo(80, -22); cc.lineTo(80, 22); cc.closePath(); }, COL.steel, 5);
  });
  cardAt(542, -0.03, (cc) => { shape(cc, () => ell(cc, 0, 10, 72, 72), IRON); shine(cc, [[-40, -20], [-10, -45]], 8); at(cc, 0, -62, 0.3, 1, () => { line(cc, [[-40, 0], [40, 0]], 12, INK); line(cc, [[-40, 0], [40, 0]], 5, COL.steel); }); });
  cardAt(794, 0.05, (cc) => compass(cc, 0, 10, 82, UP + 0.1));
};
// a4 Gilbert's little earth: a hanging needle beside a magnet, and where needles point around it
const a4 = (c: Ctx) => {
  ground(c);
  const mx = 480, my = 650;
  shadow(c, mx + 20, my + 330, 440, 24);
  shape(c, () => rrect(c, 70, 340, 820, 610, 10), WHITE);
  hbar(c, mx, my, 300, 90);
  const P: number[][] = [[-300, 0], [0, -190], [0, 190], [-180, -150], [180, -150], [-180, 150], [180, 150], [-330, -170], [-330, 170], [330, -190], [330, 190]];
  for (const [dx, dy] of P) {
    const r = Math.hypot(dx, dy), ux = dx / r, uy = dy / r, d = 3 * ux; // m = (1, 0)
    const bx = 3 * d * ux / 3 - 1, by = 3 * d * uy / 3;
    compassNeedle(c, mx + dx, my + dy, Math.atan2(by, bx), 42, 11);
  }
  // hanging needle on a thread, held by a hand
  line(c, [[860, 300], [860, 570]], 5, INK);
  hand(c, 860, 150, Math.PI / 2, 1.2, SKIN.child, CLOTH.child);
  compassNeedle(c, 860, 600, 0, 70, 14);
};
// a7 heat takes the magnet away
const a7 = (c: Ctx) => {
  ground(c);
  // burner and flame
  shadow(c, 270, 1000, 190, 22);
  shape(c, () => rrect(c, 120, 900, 300, 90, 16), IRON);
  shape(c, () => polyP(c, [[190, 900], [350, 900], [320, 860], [220, 860]]), COL.steelDk, 6);
  shape(c, () => { c.moveTo(270, 560); c.bezierCurveTo(210, 660, 190, 760, 230, 860); c.lineTo(310, 860); c.bezierCurveTo(350, 760, 330, 660, 270, 560); c.closePath(); }, COL.blue, 6);
  shape(c, () => { c.moveTo(270, 680); c.bezierCurveTo(240, 740, 240, 800, 255, 860); c.lineTo(285, 860); c.bezierCurveTo(300, 800, 300, 740, 270, 680); c.closePath(); }, COL.sky, 0);
  // glowing needle held by tongs
  shape(c, () => ell(c, 270, 530, 150, 38), "rgba(255,211,77,0.55)", 0);
  line(c, [[150, 530], [390, 530]], 22, INK); line(c, [[150, 530], [390, 530]], 11, COL.orange); line(c, [[170, 530], [370, 530]], 5, COL.yellow);
  line(c, [[390, 530], [680, 400]], 24, INK); line(c, [[390, 530], [680, 400]], 13, COL.steelDk);
  line(c, [[390, 530], [680, 460]], 24, INK); line(c, [[390, 530], [680, 460]], 13, COL.steel);
  hand(c, 660, 400, 0.3, 1.4, SKIN.adult, CLOTH.adult);
  // after: a cool needle that no longer lifts a pin
  arrow(c, [[440, 760], [590, 760]]);
  shadow(c, 850, 960, 200, 20);
  shape(c, () => rrect(c, 640, 880, 400, 70, 12), COL.steelIn);
  line(c, [[700, 850], [900, 850]], 20, INK); line(c, [[700, 850], [900, 850]], 9, COL.steel);
  pin(c, 960, 840, 150, 0.02);
  line(c, [[780, 620], [900, 740]], 18, RED); line(c, [[900, 620], [780, 740]], 18, RED);
};
// p1 my compass diary
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 930, 470, 30);
  shape(c, () => rrect(c, 60, 140, 480, 780, 20), "#fffaf0"); shape(c, () => rrect(c, 540, 140, 480, 780, 20), "#fffaf0");
  shade(c, () => rrect(c, 540, 140, 480, 780, 20), "#d8cfba", 0, 0, 0.0);
  line(c, [[540, 140], [540, 920]], 8);
  for (let y = 360; y < 880; y += 60) line(c, [[100, y], [500, y]], 3, COL.sky);
  for (let k = 0; k < 3; k++) { shape(c, () => ell(c, 150 + k * 140, 240, 50, 50), COL.yellow, 6); write(c, String(k + 1), 150 + k * 140 - 17, 214, 52, INK, 8); }
  // little house map
  shape(c, () => polyP(c, [[200, 760], [200, 600], [300, 530], [400, 600], [400, 760]]), COL.red, 6);
  shape(c, () => rrect(c, 270, 660, 60, 100, 6), COL.brown, 5);
  arrow(c, [[250, 480], [250, 400]]);
  compass(c, 780, 460, 190, UP + 0.15);
  at(c, 780, 800, -0.25, 1, () => { shape(c, () => rrect(c, -200, -16, 330, 32, 6), COL.yellow); shape(c, () => polyP(c, [[130, -16], [190, 0], [130, 16]]), COL.wood, 5); });
};
// c1 the steady compass: a needle hung on a thread inside a jar, carried in a hand
const c1 = (c: Ctx) => {
  ground(c);
  glass(c, 600, 960, 360, 560, 0);
  shape(c, () => rrect(c, 410, 370, 380, 60, 12), COL.teal);
  line(c, [[600, 430], [600, 640]], 5, INK);
  line(c, [[480, 660], [720, 660]], 22, INK); line(c, [[480, 660], [720, 660]], 11, COL.steel);
  shape(c, () => polyP(c, [[720, 650], [740, 660], [720, 670]]), RED, 3);
  hand(c, 330, 700, 0, 1.6, SKIN.child, CLOTH.child);
  arrow(c, [[250, 1040], [450, 1040]], RED, 9);
};
// c2 how far from iron? a compass, a measuring ruler and an iron pot
const c2 = (c: Ctx) => {
  ground(c);
  // iron kadai
  shadow(c, 810, 800, 230, 26);
  shape(c, () => { c.moveTo(580, 560); c.bezierCurveTo(600, 780, 1020, 780, 1040, 560); c.closePath(); }, IRON); shade(c, () => { c.moveTo(580, 560); c.bezierCurveTo(600, 780, 1020, 780, 1040, 560); c.closePath(); }, "#2b2340", 60, -10, 0.4);
  shape(c, () => ell(c, 810, 560, 230, 40), "#2f2b36", 6);
  shape(c, () => rrect(c, 520, 545, 70, 26, 10), IRON, 5); shape(c, () => rrect(c, 1030, 545, 50, 26, 10), IRON, 5);
  compass(c, 230, 580, 170, UP + 0.9);
  c.save(); c.setLineDash([16, 14]); line(c, [[230, 580], [230, 330]], 5, COL.greyDk); c.restore();
  arrow(c, [[230, 360], [330, 400]], RED, 9);
  // ruler between them
  shadow(c, 560, 940, 430, 20);
  shape(c, () => polyP(c, [[130, 850], [990, 850], [990, 930], [130, 930]]), COL.wood);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let k = 0; k <= 40; k++) { const x = 160 + k * 20, h = k % 10 === 0 ? 34 : k % 5 === 0 ? 24 : 13; c.lineWidth = k % 10 === 0 ? 4 : 2.5; c.beginPath(); c.moveTo(x, 850); c.lineTo(x, 850 + h); c.stroke(); }
  write(c, "0", 150, 892, 28, INK, 5); write(c, "10", 335, 892, 28, INK, 5); write(c, "20", 535, 892, 28, INK, 5); write(c, "30", 735, 892, 28, INK, 5);
};
void BG; void bowl; void rnd; void shine;

export const ic_magnetsMagnetsAndMaterialsL3 = cards("sci.magnets.magnets-and-materials.L3 cards", [summary, termForce, termSteel, termPermanent, explSpin, explLightning, explFrog, e1, e2, a1, a3, a4, a7, p1, c1, c2]);
