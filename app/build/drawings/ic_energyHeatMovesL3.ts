import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, bowl, plate, write, cards } from "./flatKit";

// sci.energy.heat-moves.L3 · picture cards (intro, cover, flows, terms, explanations).
// Same child and grown-up as the set-up cards. Heat is a red arrow; hot is red/orange, cool is blue.

const BUTTER = "#ffe27a", BUTTER_DK = "#e8b83a", PEPPER = "#33303a", ICE = "#d9f0fb", ICE_DK = "#9fd0ea";
const HOT = "#e4523b", WARM = "#f39a3c", MILD = "#ffd34d", COOL = "#9fc4e8", BLACKH = "#3a3540", TEA = "#c98a4b", TEA_DK = "#a66d35";

const pepper = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), PEPPER, Math.max(3, r * 0.22));
  shape(c, () => ell(c, x - r * 0.3, y - r * 0.32, r * 0.26, r * 0.2), "#9a97a6", 0);
};
const butter = (c: Ctx, x: number, y: number, r: number, pep = true) => {
  const p = () => ell(c, x, y, r, r * 0.88);
  shape(c, p, BUTTER, 5); shade(c, p, BUTTER_DK, -r * 0.3, -r * 0.3, 0.7);
  if (pep) pepper(c, x, y - r * 0.04, r * 0.42);
};
const handle = (c: Ctx, x0: number, x1: number, w: number, hole = true) => {
  const p = () => rrect(c, x0, -w / 2, x1 - x0, w, w / 2);
  shape(c, p, COL.steel); shade(c, p, COL.steelDk, 0, -w * 0.3, 0.75);
  shine(c, [[x0 + w * 0.7, -w * 0.2], [x1 - w * 0.7, -w * 0.2]], Math.max(3, w * 0.1));
  if (hole) shape(c, () => ell(c, x1 - w * 0.65, 0, w * 0.2, w * 0.2), COL.steelIn, 4);
};
const headTop = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  const p = () => ell(c, x, y, rx, ry);
  shape(c, p, COL.steel); shade(c, p, COL.steelDk, -rx * 0.18, -ry * 0.2, 0.7);
  shape(c, () => ell(c, x - rx * 0.05, y - ry * 0.05, rx * 0.8, ry * 0.76), COL.steelIn, 4);
};
const tumbler = (c: Ctx, cx: number, rimY: number, botY: number, rx: number, bx: number, water = COL.water) => {
  const ry = rx * 0.24;
  shadow(c, cx + rx * 0.15, botY + 4, rx * 1.15, ry * 0.7);
  const p = () => { c.moveTo(cx - rx, rimY); c.lineTo(cx + rx, rimY); c.lineTo(cx + bx, botY); c.quadraticCurveTo(cx, botY + bx * 0.35, cx - bx, botY); c.closePath(); };
  shape(c, p, COL.steel); shade(c, p, COL.steelDk, -rx * 0.55, 0, 0.8);
  shine(c, [[cx - rx * 0.78, rimY + 50], [cx - bx * 0.78, botY - 40]], 9);
  shape(c, () => ell(c, cx, rimY, rx, ry), COL.steelIn, 6);
  shape(c, () => ell(c, cx, rimY + 2, rx * 0.88, ry * 0.8), water, 0);
  shape(c, () => ell(c, cx - rx * 0.25, rimY - 2, rx * 0.3, ry * 0.2), COL.drop, 0);
};
const steam = (c: Ctx, x: number, y: number, h: number) => {
  const pts: number[][] = [];
  for (let i = 0; i <= 20; i++) pts.push([x + Math.sin(i * 0.55) * h * 0.06, y - (i * h) / 20]);
  line(c, pts, h * 0.07 + 6, INK); line(c, pts, h * 0.07, "#f4f7fb");
};
// something drawn only above the front rim of a tumbler (the part under the water is hidden)
const aboveRim = (c: Ctx, cx: number, rimY: number, rx: number, fn: () => void) => {
  c.save(); c.beginPath(); c.rect(0, 0, D, rimY); ell(c, cx, rimY, rx, rx * 0.24); c.clip(); fn(); c.restore();
};
// a steel handle standing in a tumbler: foot at (fx, fy) inside, rising at angle a (radians, -PI/2 = straight up)
const standing = (c: Ctx, cx: number, rimY: number, rx: number, fx: number, fy: number, a: number, len: number, w: number, extra?: () => void) =>
  aboveRim(c, cx, rimY, rx, () => { c.translate(fx, fy); c.rotate(a); handle(c, 0, len, w); if (extra) extra(); });
// a ceramic tea cup, centre of the base at (x, y)
const cup = (c: Ctx, x: number, y: number, w: number, h: number, liquid = TEA) => {
  shadow(c, x + w * 0.1, y + 6, w * 0.62, w * 0.1);
  const p = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.quadraticCurveTo(x + w * 0.45, y, x, y); c.quadraticCurveTo(x - w * 0.45, y, x - w / 2, y - h); c.closePath(); };
  c.save(); c.lineWidth = 6; shape(c, () => { c.arc(x + w / 2 - 6, y - h * 0.55, h * 0.26, -Math.PI / 2, Math.PI / 2); }, "rgba(0,0,0,0)", 0); c.restore();
  c.beginPath(); c.arc(x + w / 2 - 4, y - h * 0.55, h * 0.24, -Math.PI * 0.5, Math.PI * 0.5); c.strokeStyle = INK; c.lineWidth = 22; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.arc(x + w / 2 - 4, y - h * 0.55, h * 0.24, -Math.PI * 0.5, Math.PI * 0.5); c.strokeStyle = COL.paper; c.lineWidth = 10; c.stroke();
  shape(c, p, COL.paper); shade(c, p, "#e6dcc6", w * 0.18, 0, 0.8);
  line(c, [[x - w * 0.46, y - h * 0.55], [x + w * 0.46, y - h * 0.55]], 12, COL.teal);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), COL.paper, 6);
  shape(c, () => ell(c, x, y - h + 3, w * 0.43, w * 0.075), liquid, 0);
};
const ice = (c: Ctx, x: number, y: number, s: number, melt = 1) => {
  const p = () => polyP(c, [[x - s, y - s * 0.6 * melt], [x + s * 0.2, y - s * melt], [x + s, y - s * 0.55 * melt], [x + s * 0.9, y + s * 0.5 * melt], [x - s * 0.1, y + s * 0.7 * melt], [x - s * 0.95, y + s * 0.4 * melt]]);
  shape(c, p, ICE); shade(c, p, ICE_DK, s * 0.3, s * 0.2, 0.8);
  shine(c, [[x - s * 0.7, y - s * 0.3 * melt], [x - s * 0.2, y - s * 0.7 * melt]], s * 0.12);
};
const drop = (c: Ctx, x: number, y: number, s: number) =>
  shape(c, () => { c.moveTo(x, y - s); c.quadraticCurveTo(x + s * 0.9, y + s * 0.1, x, y + s * 0.7); c.quadraticCurveTo(x - s * 0.9, y + s * 0.1, x, y - s); c.closePath(); }, COL.water, 4);
const counter = (c: Ctx, y: number) => shape(c, () => rrect(c, -20, y, 1120, 400, 4), COL.wood, 6);
// a tiny ball (particle) with an optional shake mark
const ball = (c: Ctx, x: number, y: number, r: number, col: string, shake = 0) => {
  if (shake > 0) for (const s of [-1, 1]) { line(c, [[x + s * (r + 8), y - r * 0.5], [x + s * (r + 8 + shake * 14), y - r * 0.2]], 5); line(c, [[x + s * (r + 8), y + r * 0.5], [x + s * (r + 8 + shake * 14), y + r * 0.2]], 5); }
  shape(c, () => ell(c, x, y, r, r), col, 5);
  shade(c, () => ell(c, x, y, r, r), "rgba(43,35,64,0.5)", r * 0.3, r * 0.3, 0.35);
};
const wave = (c: Ctx, x: number, y: number, dx: number, dy: number, col = RED) => {
  const pts: number[][] = [];
  for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push([x + dx * t + Math.sin(t * 9) * 8 * -dy / Math.hypot(dx, dy), y + dy * t + Math.sin(t * 9) * 8 * dx / Math.hypot(dx, dy)]); }
  arrow(c, pts, col, 7);
};
const flame = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => { c.moveTo(x, y); c.bezierCurveTo(x - s * 0.9, y - s * 0.3, x - s * 0.5, y - s * 1.0, x, y - s * 1.5); c.bezierCurveTo(x + s * 0.5, y - s * 1.0, x + s * 0.9, y - s * 0.3, x, y); c.closePath(); };
  shape(c, p, WARM, 5);
  shape(c, () => { c.moveTo(x, y - 4); c.bezierCurveTo(x - s * 0.4, y - s * 0.3, x - s * 0.2, y - s * 0.6, x, y - s * 0.85); c.bezierCurveTo(x + s * 0.2, y - s * 0.6, x + s * 0.4, y - s * 0.3, x, y - 4); c.closePath(); }, MILD, 0);
};

// ---------------------------------------------------------------- intro
const intro = (c: Ctx) => {
  ground(c);
  person(c, 170, 900, 760, { adult: true, armL: [Math.PI * 0.5, Math.PI * 0.5], armR: [Math.PI * 0.5, Math.PI * 0.5] });
  person(c, 800, 900, 620, { armL: [Math.PI * 0.97, Math.PI * 1.02] });
  counter(c, 800);
  cup(c, 470, 800, 210, 170);
  aboveRim(c, 470, 630, 105, () => {});
  c.save(); c.beginPath(); c.rect(0, 0, D, 631); ell(c, 470, 631, 105, 21); c.clip();
  c.translate(450, 740); c.rotate(-1.3); handle(c, 0, 470, 34, false); c.restore();
  steam(c, 440, 600, 150);
  // the child's fingertip touching the handle tip
};

// ---------------------------------------------------------------- summary: the ladle line
const ladleScene = (c: Ctx, withGrip: boolean) => {
  ground(c);
  const cx = 440, rimY = 560, rx = 190;
  tumbler(c, cx, rimY, 940, rx, 150);
  steam(c, 300, 490, 240); steam(c, 380, 470, 290);
  aboveRim(c, cx, rimY, rx, () => {
    c.translate(360, 770); c.rotate(-1.05); handle(c, 0, 700, 46);
    if (withGrip) {
      const g = () => rrect(c, 250, -42, 250, 84, 18);
      shape(c, g, "#f7f3e8", 6);
      for (let k = 0; k < 5; k++) line(c, [[285 + k * 50, -40], [285 + k * 50, 40]], 5, COL.blue);
      line(c, [[250, -26], [250, 26]], 8, "#e4523b"); line(c, [[500, -26], [500, 26]], 8, "#e4523b");
      butter(c, 400, -52, 26);
      butter(c, 600, -8, 28);
    } else {
      butter(c, 330, -6, 30); butter(c, 430, -6, 30); butter(c, 530, -6, 30); butter(c, 630, -6, 30);
    }
  });
};
const summary = (c: Ctx) => {
  ladleScene(c, false);
  // redraw the lowest dot as a melting puddle with a peppercorn sliding off
  c.save(); c.translate(360, 770); c.rotate(-1.05);
  c.beginPath(); c.rect(250, -45, 150, 90); c.fillStyle = COL.steel; c.fill();
  handle(c, 0, 700, 46); c.restore();
  c.save(); c.beginPath(); c.rect(0, 0, D, 560); ell(c, 440, 560, 190, 45.6); c.clip();
  c.translate(360, 770); c.rotate(-1.05);
  shape(c, () => ell(c, 330, 0, 44, 15), BUTTER, 5);
  butter(c, 430, -6, 30); butter(c, 530, -6, 30); butter(c, 630, -6, 30);
  c.restore();
  pepper(c, 700, 632, 20);
  arrow(c, [[730, 560], [740, 640]]);
};

// ---------------------------------------------------------------- flows
const e2 = (c: Ctx) => {
  ground(c);
  // left: a spoon standing in a tumbler
  tumbler(c, 270, 520, 920, 150, 110);
  steam(c, 200, 450, 160); steam(c, 330, 450, 160);
  aboveRim(c, 270, 520, 150, () => { c.translate(255, 760); c.rotate(-1.52); handle(c, 0, 700, 38); butter(c, 330, -2, 24); butter(c, 450, -2, 24); butter(c, 570, -2, 24); });
  // right: a spoon lying flat, head in a bowl of hot water, handle on books
  shadow(c, 830, 925, 250, 24);
  shape(c, () => rrect(c, 900, 700, 180, 120, 6), COL.purple, 6);
  shape(c, () => rrect(c, 900, 820, 180, 100, 6), COL.teal, 6);
  bowl(c, 640, 640, 190, COL.water);
  steam(c, 580, 610, 120); steam(c, 660, 600, 140);
  c.save(); c.translate(720, 660); handle(c, -20, 360, 34, false); c.restore();
  headTop(c, 650, 668, 70, 26);
  butter(c, 830, 658, 22); butter(c, 940, 658, 22);
  c.save(); c.translate(0, 0); c.restore();
};

const a1 = (c: Ctx) => {
  ground(c);
  tumbler(c, 460, 600, 960, 220, 170, COL.water);
  steam(c, 340, 530, 280); steam(c, 440, 510, 330);
  aboveRim(c, 460, 600, 220, () => { c.translate(420, 800); c.rotate(-1.3); handle(c, 0, 640, 54); });
  // a child's finger touches the top of the handle
  line(c, [[1100, 250], [800, 250]], 76, INK); line(c, [[1100, 250], [800, 250]], 64, CLOTH.child);
  hand(c, 715, 250, Math.PI, 1.5, SKIN.child, CLOTH.child, true);
};

const a2 = (c: Ctx) => {
  ground(c);
  // left: ice held in a fist over a bowl; drips fall
  bowl(c, 300, 790, 170, COL.water);
  ice(c, 300, 450, 62, 0.8);
  line(c, [[300, -40], [300, 200]], 160, INK); line(c, [[300, -40], [300, 200]], 148, CLOTH.child);
  hand(c, 300, 270, Math.PI / 2, 2.1, SKIN.child, CLOTH.child, false);
  drop(c, 280, 620, 22); drop(c, 340, 680, 18);
  arrow(c, [[470, 330], [390, 420]], RED, 12);
  // right: ice on a plate
  plate(c, 790, 760, 230, 100);
  ice(c, 790, 700, 70, 1);
};

const a3 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(500, 540); c.rotate(-0.05);
  shadow(c, 20, 330, 420, 40);
  shape(c, () => rrect(c, -420, -330, 840, 640, 14), COL.paper, 6);
  // a ladle handle drawn big, coloured red -> yellow, with its tiny balls inside
  const g = c.createLinearGradient(-360, 0, 360, 0); g.addColorStop(0, HOT); g.addColorStop(0.45, WARM); g.addColorStop(1, MILD);
  shape(c, () => rrect(c, -360, -130, 720, 260, 40), g as unknown as string, 7);
  for (let i = 0; i < 6; i++) for (const y of [-60, 60]) ball(c, -290 + i * 120, y, 36, WARM, 0);
  arrow(c, [[-330, -190], [320, -190]], RED, 10);
  c.restore();
  // a pencil and the child's hand
  c.save(); c.translate(600, 450); c.rotate(0.9);
  shape(c, () => polyP(c, [[40, -12], [0, 0], [40, 12]]), "#f2c063", 4);
  shape(c, () => rrect(c, 40, -13, 420, 26, 4), COL.yellow, 5);
  c.restore();
  hand(c, 860, 778, Math.PI + 0.9, 1.5, SKIN.child, CLOTH.child, false);
};

const c1 = (c: Ctx) => ladleScene(c, true);

const c2 = (c: Ctx) => {
  ground(c);
  bowl(c, 540, 560, 400, COL.water);
  steam(c, 380, 520, 240); steam(c, 700, 520, 260);
  // a small katori floats in the hot water holding a cold butter cube
  bowl(c, 540, 560, 130, COL.steelIn);
  shape(c, () => rrect(c, 505, 505, 70, 60, 8), BUTTER, 5);
  arrow(c, [[260, 700], [360, 640]], RED, 10);
  arrow(c, [[820, 700], [720, 640]], RED, 10);
  // loose cubes on the counter for the other two tries
  shape(c, () => rrect(c, 170, 870, 150, 70, 6), "#ddd6ff", 5);
  shape(c, () => rrect(c, 215, 840, 60, 50, 6), BUTTER, 5);
  shape(c, () => rrect(c, 760, 870, 150, 70, 6), COL.paper, 5);
  shape(c, () => rrect(c, 805, 840, 60, 50, 6), BUTTER, 5);
  void CLOTH;
};

// ---------------------------------------------------------------- terms
const t0 = (c: Ctx) => {
  ground(c);
  cup(c, 480, 860, 460, 380);
  steam(c, 400, 400, 200); steam(c, 500, 380, 240);
  c.save(); c.beginPath(); c.rect(0, 0, D, 485); ell(c, 480, 485, 230, 46); c.clip();
  c.translate(560, 700); c.rotate(-1.15); handle(c, 0, 600, 42, false); c.restore();
  arrow(c, [[400, 520], [470, 560], [560, 540]], RED, 14);
  arrow(c, [[640, 440], [700, 360]], RED, 14);
};

const strip = (c: Ctx, x: number, y: number, w: number, h: number, vertical: boolean) => {
  c.save(); c.translate(x, y); if (vertical) c.rotate(-Math.PI / 2);
  const g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, "#f6a08e"); g.addColorStop(0.5, "#fbd9a0"); g.addColorStop(1, "#e4e8ee");
  shape(c, () => rrect(c, 0, -h / 2, w, h, h / 2), g as unknown as string, 7);
  c.restore();
};
const t2 = (c: Ctx) => {
  ground(c);
  // hot water at the left end
  shape(c, () => rrect(c, 40, 340, 190, 400, 14), COL.water, 6);
  steam(c, 110, 330, 120);
  strip(c, 200, 540, 840, 230, false);
  const cols = [HOT, "#ec6a3c", WARM, "#f7b748", MILD, "#f0dc8c"];
  for (let i = 0; i < 6; i++) ball(c, 285 + i * 148, 540, 50, cols[i], i < 3 ? 3 - i : 0);
  arrow(c, [[300, 840], [960, 840]], RED, 14);
};

const t3 = (c: Ctx) => {
  ground(c);
  // gas flame under an iron tawa; heat arrows go up through the metal into the dosa
  for (const x of [330, 430, 540, 650, 750]) flame(c, x, 880, 80);
  shape(c, () => rrect(c, 230, 880, 640, 40), COL.black, 6);
  shadow(c, 560, 700, 360, 40);
  const tp = () => { c.moveTo(150, 690); c.lineTo(970, 690); c.quadraticCurveTo(940, 790, 560, 800); c.quadraticCurveTo(180, 790, 150, 690); c.closePath(); };
  shape(c, tp, COL.black); shade(c, tp, "#241f2c", 40, -40, 0.6);
  shape(c, () => ell(c, 560, 690, 410, 84), "#575063", 6);
  shape(c, () => ell(c, 560, 686, 330, 62), MILD, 5);
  shape(c, () => ell(c, 560, 684, 270, 46), "#f0b94a", 0);
  shape(c, () => rrect(c, 960, 664, 100, 40, 12), COL.wood, 5);
  for (const x of [400, 560, 720]) arrow(c, [[x, 850], [x, 500]], RED, 14);
};

const t4 = (c: Ctx) => {
  ground(c);
  shadow(c, 620, 900, 330, 34);
  const body = () => rrect(c, 360, 480, 520, 400, 30);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, 80, 0, 0.7);
  shine(c, [[410, 530], [410, 820]], 10);
  shape(c, () => rrect(c, 340, 430, 560, 80, 24), COL.steelDk, 6);
  shape(c, () => rrect(c, 570, 360, 100, 80, 14), COL.steelIn, 6);
  shape(c, () => ell(c, 620, 340, 38, 22), COL.steelDk, 6);
  steam(c, 620, 320, 160);
  // black plastic handle, gripped by a hand
  shape(c, () => rrect(c, 160, 620, 220, 60, 26), BLACKH, 6);
  shine(c, [[220, 636], [350, 636]], 7);
  hand(c, 40, 650, 0, 2.1, SKIN.adult, CLOTH.adult, false);
};

const t5 = (c: Ctx) => {
  ground(c);
  // a spoon with a circle on its handle, and the magnified circle full of tiny balls in rows
  c.save(); c.translate(230, 940); c.rotate(-0.62); handle(c, 0, 470, 60, false); headTop(c, -50, 0, 100, 62); c.restore();
  line(c, [[440, 752], [550, 598]], 6); line(c, [[496, 774], [800, 628]], 6);
  shape(c, () => ell(c, 467, 789, 38, 38), "#fffaf0", 6);
  shape(c, () => ell(c, 700, 340, 300, 300), "#fffaf0", 10);
  c.save(); c.beginPath(); ell(c, 700, 340, 292, 292); c.clip();
  for (let r = 0; r < 6; r++) for (let q = 0; q < 6; q++) ball(c, 530 + q * 70 + (r % 2) * 35, 160 + r * 66, 27, COL.blue, 0);
  c.restore();
  shape(c, () => ell(c, 700, 340, 300, 300), "rgba(0,0,0,0)", 10);
};

const t6 = (c: Ctx) => {
  ground(c);
  const y = 480, x0 = 230, cm = 80;
  shadow(c, 560, y + 54, 440, 22);
  c.save(); c.translate(0, y); handle(c, 160, 1040, 100); c.restore();
  headTop(c, 130, y, 110, 76);
  for (const k of [2, 4, 6, 8]) butter(c, x0 + k * cm, y, 38, false);
  shape(c, () => rrect(c, 230, 650, 700, 100, 8), COL.wood, 6);
  c.fillStyle = COL.woodDk; c.fillRect(233, 730, 694, 17);
  for (let k = 0; k <= 8; k++) line(c, [[x0 + k * cm, 650], [x0 + k * cm, 650 + (k % 2 ? 24 : 40)]], k % 2 ? 3 : 5);
  for (const k of [2, 4, 6, 8]) write(c, String(k), x0 + k * cm - 11, 696, 32, INK, 5);
  for (const k of [2, 4, 6, 8]) line(c, [[x0 + k * cm, y + 60], [x0 + k * cm, 650]], 5, RED);
};

// ---------------------------------------------------------------- explanations
const x0 = (c: Ctx) => {
  ground(c);
  cup(c, 270, 780, 340, 280);
  steam(c, 220, 480, 200); steam(c, 310, 460, 240);
  arrow(c, [[480, 640], [620, 640]], RED, 14);
  plate(c, 820, 820, 190, 76);
  ice(c, 820, 730, 100, 1);
  arrow(c, [[640, 440], [740, 540]], RED, 14);
  void WHITE;
};

const x1 = (c: Ctx) => {
  ground(c);
  // a handle standing up from hot tea: balls in a column, shaking hard at the bottom, less higher up
  shape(c, () => rrect(c, 300, 700, 480, 300, 16), TEA, 6);
  shape(c, () => rrect(c, 420, 90, 240, 700, 120), "#eef1f6", 7);
  const cols = [HOT, "#ec6a3c", WARM, "#f7b748", MILD, "#f0dc8c"];
  for (let i = 0; i < 6; i++) ball(c, 540, 700 - i * 108, 44, cols[i], i < 4 ? 4 - i : 0);
  for (let i = 0; i < 5; i++) arrow(c, [[540, 640 - i * 108], [540, 590 - i * 108]], RED, 8);
  void INK;
};

const x2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 30, 410, 170, 260, 14), COL.water, 6);
  strip(c, 190, 540, 840, 170, false);
  for (let i = 0; i < 4; i++) { wave(c, 380 + i * 170, 440, 40, -150); wave(c, 410 + i * 170, 640, 40, 150); }
  arrow(c, [[260, 820], [900, 820]], RED, 14);
};

const x3 = (c: Ctx) => {
  ground(c);
  // a shelf: tawa, cooker, coconut-shell ladle; metal red, handles blue
  shape(c, () => rrect(c, 20, 800, 1040, 50, 8), COL.wood, 6);
  shadow(c, 300, 800, 200, 14);
  shape(c, () => ell(c, 190, 720, 170, 60), "#8a2e22", 6);
  shape(c, () => ell(c, 190, 706, 170, 56), HOT, 6);
  shape(c, () => rrect(c, 330, 686, 150, 40, 14), COL.blue, 6);
  shape(c, () => rrect(c, 500, 540, 300, 260, 26), HOT, 6);
  shape(c, () => rrect(c, 480, 500, 340, 70, 22), "#c63e2d", 6);
  shape(c, () => rrect(c, 610, 440, 80, 60, 12), "#c63e2d", 6);
  shape(c, () => rrect(c, 800, 590, 80, 44, 16), COL.blue, 6);
  shape(c, () => rrect(c, 420, 590, 80, 44, 16), COL.blue, 6);
  // coconut-shell ladle: a half shell with a long handle, all cool to hold
  c.save(); c.translate(900, 780); c.rotate(-1.1); shape(c, () => rrect(c, -20, -20, 270, 40, 20), COL.blue, 6); c.restore();
  shape(c, () => { c.moveTo(820, 780); c.bezierCurveTo(820, 850, 960, 850, 960, 780); c.closePath(); }, COL.soil, 6);
  void INK;
};

const x4 = (c: Ctx) => {
  ground(c);
  const g = c.createLinearGradient(0, 0, D, 0); g.addColorStop(0, "#f8c5b8"); g.addColorStop(1, "#c9e0f5");
  c.fillStyle = g; c.fillRect(0, 230, D, 620);
  line(c, [[0, 230], [D, 230]], 6); line(c, [[0, 850], [D, 850]], 6);
  for (let r = 0; r < 4; r++) for (let q = 0; q < 5; q++) {
    const x = 120 + q * 210, y = 330 + r * 160;
    shape(c, () => ell(c, x, y, 60, 60), COL.steelDk, 6);
    write(c, "+", x - 22, y - 26, 44, WHITE, 7);
  }
  const E: number[][][] = [[[200, 410], [270, 380], [330, 440]], [[560, 520], [640, 560], [710, 500]], [[330, 680], [400, 650], [480, 710]], [[830, 360], [900, 400], [960, 340]], [[620, 760], [700, 720], [760, 790]], [[150, 560], [220, 600], [290, 550]]];
  for (const p of E) { arrow(c, p, COL.yellow, 8); shape(c, () => ell(c, p[0][0], p[0][1], 17, 17), COL.yellow, 5); }
  arrow(c, [[120, 940], [960, 940]], RED, 14);
};

const panel = (c: Ctx, x: number, y: number, fn: () => void) => {
  shape(c, () => rrect(c, x, y, 320, 560, 24), "#fffaf0", 7);
  c.save(); c.beginPath(); rrect(c, x + 3, y + 3, 314, 554, 22); c.clip(); c.translate(x, y); fn(); c.restore();
};
const x5 = (c: Ctx) => {
  ground(c);
  panel(c, 30, 260, () => {
    shape(c, () => rrect(c, 40, 340, 240, 240, 10), TEA, 6);
    c.save(); c.beginPath(); c.rect(0, 0, 320, 340); c.clip(); c.translate(160, 340); c.rotate(-1.3); handle(c, 0, 430, 34, false); c.restore();
    arrow(c, [[160, 440], [230, 270]], RED, 10);
  });
  panel(c, 380, 260, () => {
    const bd = () => rrect(c, 40, 280, 240, 240, 20);
    shape(c, bd, COL.steel); shape(c, () => rrect(c, 52, 300, 216, 200, 12), COL.water, 0);
    for (let i = 0; i < 3; i++) flame(c, 100 + i * 60, 560, 40);
    arrow(c, [[100, 460], [100, 340], [150, 300]], RED, 9); arrow(c, [[220, 310], [220, 420]], COL.blueDk, 9);
    arrow(c, [[160, 440], [160, 340]], RED, 9);
  });
  panel(c, 730, 260, () => {
    shape(c, () => ell(c, 200, 110, 54, 54), MILD, 6);
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; line(c, [[200 + Math.cos(a) * 74, 110 + Math.sin(a) * 74], [200 + Math.cos(a) * 100, 110 + Math.sin(a) * 100]], 8, WARM); }
    shape(c, () => ell(c, 130, 410, 80, 85), SKIN.child, 6);
    shape(c, () => { c.moveTo(50, 400); c.bezierCurveTo(60, 300, 200, 300, 210, 400); c.quadraticCurveTo(130, 350, 50, 400); c.closePath(); }, CLOTH.hair, 5);
    shape(c, () => ell(c, 100, 420, 8, 11), INK, 0); shape(c, () => ell(c, 160, 420, 8, 11), INK, 0);
    c.beginPath(); c.arc(130, 450, 22, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
    arrow(c, [[180, 190], [160, 300]], RED, 10);
  });
};

export const ic_energyHeatMovesL3 = cards("sci.energy.heat-moves.L3 cards", [
  intro, summary, e2, a1, a2, a3, c1, c2, t0, t2, t3, t4, t5, t6, x0, x1, x2, x3, x4, x5,
]);
