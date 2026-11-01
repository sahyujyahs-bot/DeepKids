import type { Ctx } from "./core";
import { D, BG, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, rrect, polyP, shadow, shade, line, shine, arrow, glass, bowl, hand, write, leaf, cards } from "./flatKit";

// ---- shared pieces for the festival colour experiments
const TURMERIC = "#f2b61f", TURMERIC_DK = "#d89a10", RED_LIQ = "#d63a2c", HIB = "#b04a7a";
// a falling drop
const drop = (c: Ctx, x: number, y: number, s: number, col: string) => {
  shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 1.1, y - s * 0.2, x + s * 0.9, y + s * 0.3); c.arc(x, y + s * 0.3, s * 0.9, 0, Math.PI); c.quadraticCurveTo(x - s * 1.1, y - s * 0.2, x, y - s * 1.5); c.closePath(); }, col, 4);
};
// a whole lemon lying/standing, centre (x, y)
const lemon = (c: Ctx, x: number, y: number, r: number) => {
  const p = () => { c.moveTo(x - r * 1.25, y); c.quadraticCurveTo(x - r, y - r * 0.95, x, y - r * 0.95); c.quadraticCurveTo(x + r, y - r * 0.95, x + r * 1.25, y); c.quadraticCurveTo(x + r, y + r * 0.95, x, y + r * 0.95); c.quadraticCurveTo(x - r, y + r * 0.95, x - r * 1.25, y); c.closePath(); };
  shadow(c, x + r * 0.15, y + r * 0.95, r * 1.2, r * 0.18);
  shape(c, p, COL.yellow); shade(c, p, COL.orange, r * 0.3, r * 0.2, 0.45);
  shape(c, () => ell(c, x - r * 1.28, y, r * 0.14, r * 0.12), COL.yellow, 4); shape(c, () => ell(c, x + r * 1.28, y, r * 0.14, r * 0.12), COL.yellow, 4);
  shine(c, [[x - r * 0.6, y - r * 0.5], [x - r * 0.2, y - r * 0.68]], 8);
};
// half a lemon seen from the side: dome on top, flat cut face below with the juicy rim
const lemonHalf = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  const dome = () => { c.moveTo(x - rx, y); c.bezierCurveTo(x - rx, y - ry * 1.35, x + rx, y - ry * 1.35, x + rx, y); c.closePath(); };
  shape(c, dome, COL.yellow); shade(c, dome, COL.orange, rx * 0.25, ry * 0.15, 0.45);
  shape(c, () => ell(c, x, y, rx, ry * 0.22), "#fff3a8", 5);
  for (let k = -2; k <= 2; k++) line(c, [[x, y], [x + k * rx * 0.36, y + (k === 0 ? 0.12 : 0.06) * ry]], 3, COL.orange);
};
const spoonOn = (c: Ctx, x0: number, y0: number, x1: number, y1: number, liquid: string) => {
  const an = Math.atan2(y1 - y0, x1 - x0);
  line(c, [[x0, y0], [x1, y1]], 30, INK); line(c, [[x0, y0], [x1, y1]], 18, COL.steel);
  shape(c, () => ell(c, x1 + Math.cos(an) * 40, y1 + Math.sin(an) * 40, 62, 40, an), COL.steel, 6);
  shape(c, () => ell(c, x1 + Math.cos(an) * 40, y1 + Math.sin(an) * 40, 46, 27, an), liquid, 3);
};

// ---- e1: eight bowls of turmeric water (one bowl gets soapy water, then lemon)
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 50, 120, 980, 840, 24), WHITE, 6);
  const xs = [195, 425, 655, 885];
  [[340, 0], [720, 4]].forEach(([y, o]) => xs.forEach((x, i) => {
    const r = 105, body = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.95, y + r * 0.95, x + r * 0.95, y + r * 0.95, x + r, y); c.closePath(); };
    shadow(c, x + 12, y + r * 0.78, r * 0.9, r * 0.14);
    shape(c, body, COL.steel); shade(c, body, COL.steelDk, r * 0.35, -r * 0.05);
    shape(c, () => ell(c, x, y, r, r * 0.4), COL.steelIn, 5);
    shape(c, () => ell(c, x, y + 4, r * 0.82, r * 0.3), TURMERIC, 4);
    c.beginPath(); ell(c, x - r * 0.3, y, r * 0.3, r * 0.06); c.fillStyle = "rgba(255,255,255,0.5)"; c.fill();
    shape(c, () => rrect(c, x - 45, y + 92, 90, 56, 8), COL.paper, 4);
    write(c, String(i + 1 + o), x - 14, y + 102, 36, INK, 5);
  }));
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  bowl(c, 600, 690, 330, RED_LIQ);
  c.beginPath(); ell(c, 600, 690, 170, 30); c.fillStyle = "#e85a45"; c.fill();
  c.beginPath(); ell(c, 470, 676, 70, 10); c.fillStyle = "rgba(255,255,255,0.35)"; c.fill();
  spoonOn(c, 250, 230, 500, 330, "#f4f8ff");
  for (const [bx, by, br] of [[525, 355, 8], [540, 332, 6]]) shape(c, () => ell(c, bx, by, br, br), WHITE, 3);
  drop(c, 580, 470, 15, "#f4f8ff"); drop(c, 590, 550, 15, "#f4f8ff"); drop(c, 598, 625, 15, "#e85a45");
  hand(c, 170, 190, 0.38, 1.9);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  bowl(c, 540, 760, 330, RED_LIQ);
  c.beginPath(); ell(c, 540, 760, 220, 40); c.fillStyle = "#e86a2e"; c.fill();
  c.beginPath(); ell(c, 540, 762, 120, 24); c.fillStyle = TURMERIC; c.fill();
  lemonHalf(c, 540, 400, 160, 130);
  drop(c, 490, 470, 16, COL.yellow); drop(c, 545, 560, 16, COL.yellow); drop(c, 595, 480, 16, COL.yellow); drop(c, 540, 665, 16, COL.yellow);
  hand(c, 540, 180, Math.PI / 2, 1.9);
};

// ---- e2: hibiscus juice and the three tumblers
// setup.e2.0
const petal = (c: Ctx, x: number, y: number, r: number, rot: number) => {
  const p = () => { c.save(); c.translate(x, y); c.rotate(rot); c.moveTo(-r, 0); c.quadraticCurveTo(-r * 0.5, -r * 0.8, r * 0.2, -r * 0.55); c.quadraticCurveTo(r, -r * 0.3, r * 0.9, r * 0.1); c.quadraticCurveTo(r * 0.3, r * 0.7, -r, 0); c.closePath(); c.restore(); };
  shape(c, p, "#c8283f", 4); shade(c, p, "#8f1c33", r * 0.2, r * 0.2, 0.4);
};
const e2_0 = (c: Ctx) => {
  ground(c);
  bowl(c, 600, 700, 340, HIB);
  c.beginPath(); ell(c, 600, 700, 250, 42); c.fillStyle = "#c4608f"; c.fill();
  c.beginPath(); ell(c, 585, 700, 150, 28); c.fillStyle = "#9a3d78"; c.fill();
  [[480, 705, 50, 0.3], [560, 722, 46, 2.4], [650, 700, 50, 4.0], [720, 715, 44, 1.2], [600, 685, 42, 5.2], [520, 685, 38, 3.3]].forEach(([x, y, r, a]) => petal(c, x, y, r, a));
  // one whole hibiscus flower, so the petals are known
  for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2 - 1.2; petal(c, 880 + Math.cos(a) * 62, 250 + Math.sin(a) * 62, 62, a); }
  shape(c, () => ell(c, 880, 250, 22, 22), "#6e1428", 4); line(c, [[880, 250], [930, 190]], 6, COL.yellow); shape(c, () => ell(c, 934, 186, 11, 11), COL.yellow, 4);
  // a hand rubbing the petals in the warm water
  hand(c, 374, 545, 0.62, 2.6, SKIN.child, CLOTH.child, true);
  arrow(c, [[690, 585], [840, 585]]); arrow(c, [[840, 630], [690, 630]]);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  const xs = [210, 535, 860], JUICE = COL.purple;
  xs.forEach((x) => glass(c, x, 940, 220, 340, 0.6, JUICE));
  // lemon squeezed into the first glass
  lemonHalf(c, xs[0], 330, 110, 120);
  hand(c, xs[0], 140, Math.PI / 2, 1.5);
  [400, 480, 560].forEach((y) => drop(c, xs[0], y, 15, COL.yellow));
  // soapy water (bubbles) and plain water poured from katoris into the other two
  const pour = (x: number, liquid: string, bubbles: boolean) => {
    c.save(); c.translate(x + 25, 250); c.rotate(-0.6); bowl(c, 0, 0, 78, liquid);
    if (bubbles) for (const [bx, by, br] of [[-30, -4, 13], [-5, 4, 16], [22, -3, 12], [-48, 6, 9]]) shape(c, () => ell(c, bx, by, br, br * 0.7), WHITE, 3);
    c.restore();
    hand(c, x + 90, 110, Math.PI / 2 + 0.5, 1.4);
    line(c, [[x - 39, 300], [x - 39, 690]], 14, liquid);
    arrow(c, [[x + 60, 430], [x + 60, 540]]);
  };
  pour(xs[1], "#d8eef7", true);
  pour(xs[2], COL.water, false);
};

// ---- e3: festival dates over three years
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  // the notebook with an empty table: three year columns, rows to fill
  c.save(); c.translate(250, 480); c.rotate(-0.04);
  shadow(c, 14, 385, 220, 26);
  shape(c, () => rrect(c, -210, -370, 420, 740, 16), COL.paper, 6);
  for (let i = 0; i < 9; i++) shape(c, () => ell(c, -210, -320 + i * 80, 13, 13), BG, 4);
  for (let i = 0; i < 5; i++) line(c, [[-165, -250 + i * 130], [185, -250 + i * 130]], 5);
  for (let i = 0; i < 4; i++) line(c, [[-165 + i * 117, -330], [-165 + i * 117, 270]], 5);
  ["2024", "2025", "2026"].forEach((t, i) => write(c, t, -158 + i * 117, -318, 30, INK, 5));
  write(c, "14", -143, -222, 56, INK, 8);
  c.restore();
  // the phone with a month calendar, one day marked
  shadow(c, 710, 805, 190, 26);
  shape(c, () => rrect(c, 540, 90, 340, 700, 46), COL.black, 6);
  shape(c, () => rrect(c, 558, 118, 304, 644, 26), WHITE, 4);
  shape(c, () => polyP(c, [[558, 144], [584, 118], [836, 118], [862, 144], [862, 220], [558, 220]]), RED, 4);
  write(c, "2024", 640, 150, 44, WHITE, 6);
  for (let i = 0; i < 30; i++) {
    const cx = 572 + (i % 7) * 40, cy = 252 + Math.floor(i / 7) * 94;
    if (i === 13) shape(c, () => ell(c, cx + 18, cy + 11, 22, 22), COL.orange, 4);
    write(c, String(i + 1), cx + (i < 9 ? 12 : 3), cy, 20, INK, 4);
  }
  // the grown-up holds the phone; the child writes in the notebook
  hand(c, 975, 600, Math.PI, 1.3, SKIN.adult, CLOTH.adult);
  const ux = 0.315, uy = -0.949, wx = 86, wy = 677, at = (d: number): number[] => [wx + ux * d, wy + uy * d];
  const pencil = (d0: number, d1: number, w: number, col: string) => line(c, [at(d0), at(d1)], w, col);
  pencil(30, 205, 30, INK); pencil(30, 205, 20, COL.yellow);
  shape(c, () => polyP(c, [[at(205)[0] - uy * 15, at(205)[1] + ux * 15], [at(205)[0] + uy * 15, at(205)[1] - ux * 15], at(252)]), COL.wood, 5);
  pencil(240, 252, 7, INK);
  hand(c, wx, wy, Math.atan2(uy, ux), 1.5);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 960, 430, 28);
  shape(c, () => rrect(c, 60, 70, 960, 880, 24), COL.paper, 6);
  for (let i = 0; i < 9; i++) shape(c, () => ell(c, 90, 140 + i * 90, 12, 12), BG, 4);
  const colx = [440, 620, 800];
  ["2024", "2025", "2026"].forEach((t, i) => write(c, t, colx[i] - 26, 100, 40, INK, 6));
  const rows: [string[], boolean][] = [[["14", "14", "14"], true], [["15", "15", "15"], true], [["25", "25", "25"], true], [["1", "20", "8"], false], [["25", "14", "4"], false], [["10", "31", "20"], false]];
  const icons = [
    // Pongal: a clay pot boiling over, and sugarcane
    (x: number, y: number) => {
      line(c, [[x + 50, y + 44], [x + 56, y - 40]], 10, INK); line(c, [[x + 50, y + 44], [x + 56, y - 40]], 5, COL.green); leaf(c, x + 54, y - 20, 36, -2.4); leaf(c, x + 54, y - 36, 36, -0.7);
      shape(c, () => ell(c, x - 6, y + 12, 40, 32), "#c9683a", 5); shape(c, () => rrect(c, x - 28, y - 22, 44, 14, 5), "#a8512a", 5);
      for (const [dx, dy, r] of [[-26, -26, 11], [-8, -34, 14], [10, -28, 11], [-34, -12, 8]]) shape(c, () => ell(c, x + dx, y + dy, r, r), WHITE, 4);
    },
    // Independence Day: the flag on a pole
    (x: number, y: number) => {
      line(c, [[x - 44, y - 44], [x - 44, y + 50]], 8, INK);
      shape(c, () => rrect(c, x - 40, y - 40, 92, 22, 2), "#f39a3c", 4); shape(c, () => rrect(c, x - 40, y - 18, 92, 22, 2), WHITE, 4); shape(c, () => rrect(c, x - 40, y + 4, 92, 22, 2), COL.green, 4);
      c.beginPath(); ell(c, x + 6, y - 7, 9, 9); c.strokeStyle = COL.blueDk; c.lineWidth = 4; c.stroke();
    },
    // Christmas: a tree with a star
    (x: number, y: number) => {
      c.save(); c.translate(x, y - 12); c.scale(0.75, 0.75); c.translate(-x, -y);
      shape(c, () => rrect(c, x - 8, y + 30, 16, 22, 2), COL.brown, 4);
      for (const [w, t] of [[44, 4], [36, -20], [28, -42]]) shape(c, () => polyP(c, [[x, y + t - 22], [x + w, y + t + 26], [x - w, y + t + 26]]), COL.green, 5);
      shape(c, () => polyP(c, [[x, y - 74], [x + 7, y - 58], [x + 22, y - 58], [x + 10, y - 48], [x + 15, y - 34], [x, y - 44], [x - 15, y - 34], [x - 10, y - 48], [x - 22, y - 58], [x - 7, y - 58]]), COL.yellow, 4);
      shape(c, () => ell(c, x - 16, y + 12, 7, 7), RED, 3); shape(c, () => ell(c, x + 14, y - 12, 7, 7), RED, 3);
      c.restore();
    },
    // Diwali: a rangoli pattern
    (x: number, y: number) => {
      for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; shape(c, () => ell(c, x + Math.cos(a) * 34, y + Math.sin(a) * 34, 17, 10, a), k % 2 ? COL.orange : COL.pink, 4); }
      shape(c, () => ell(c, x, y, 14, 14), COL.yellow, 4);
      for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2 + 0.4; shape(c, () => ell(c, x + Math.cos(a) * 54, y + Math.sin(a) * 54, 5, 5), COL.purple, 3); }
    },
    // Holi: puffs of coloured powder
    (x: number, y: number) => { for (const [dx, dy, col] of [[-26, -14, COL.pink], [24, -16, COL.blue], [-4, 16, COL.yellow], [30, 18, COL.green], [-34, 22, COL.orange]] as [number, number, string][]) shape(c, () => ell(c, x + dx, y + dy - 6, 20, 20), col, 4); },
    // Eid: the crescent moon and a star
    (x: number, y: number) => {
      shape(c, () => { c.arc(x - 8, y, 36, 0.9, Math.PI * 2 - 0.9); c.arc(x + 6, y, 28, Math.PI * 2 - 1.1, 1.1, true); c.closePath(); }, COL.yellow, 5);
      shape(c, () => polyP(c, [[x + 40, y - 20], [x + 45, y - 8], [x + 58, y - 8], [x + 48, y], [x + 52, y + 12], [x + 40, y + 5], [x + 28, y + 12], [x + 32, y], [x + 22, y - 8], [x + 35, y - 8]]), COL.yellow, 4);
    },
  ];
  rows.forEach(([d, same], r) => {
    const y = 200 + r * 120;
    if (r) line(c, [[110, y - 45], [980, y - 45]], 3, COL.grey);
    icons[r](210, y + 30);
    d.forEach((t, i) => write(c, t, colx[i] - (t.length - 1) * 20, y, 56, INK, 8));
    c.beginPath(); rrect(c, 355, y - 18, 560, 96, 48); c.strokeStyle = same ? COL.green : COL.orange; c.lineWidth = 10; c.stroke();
  });
  line(c, [[110, 530], [980, 530]], 8, INK);
};

export const su_communityFestivals = cards("sci.community.festivals.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e3_0, e3_1]);
