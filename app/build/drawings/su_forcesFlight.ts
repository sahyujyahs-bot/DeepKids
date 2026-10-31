import type { Ctx } from "./core";
import { COL, CLOTH, INK, RED, WHITE, SKIN, arrow, cards, D, ell, ground, hand, line, person, polyP, rrect, shade, shadow, shape, write } from "./flatKit";

// FORCES OF FLIGHT L3 · set-up cards. Bold ink outlines, flat colours, shade side, soft shadow.
// Same paper plane (nose right, seen from above) and same paper spinner on every card of an experiment.

const WOOD = "#ead2a0", WALL = "#f3e6c9", FLOOR = "#d9b98a", PAPER2 = "#e6dcc3";

// a wooden table seen from above
const tableTop = (c: Ctx) => {
  ground(c, WOOD);
  for (const y of [180, 470, 760, 980]) line(c, [[0, y], [D, y + 12]], 3, "rgba(160,110,50,0.25)");
};
// a wall with a floor below it, floor starting at y0
const room = (c: Ctx, y0: number) => {
  ground(c, WALL);
  c.fillStyle = FLOOR; c.fillRect(0, y0, D, D - y0);
  c.fillStyle = "#b8935f"; c.fillRect(0, y0 - 18, D, 18);
  line(c, [[0, y0 - 18], [D, y0 - 18]], 4);
  line(c, [[0, y0], [D, y0]], 4);
};
// a long sleeve from the edge up to a hand drawn with hand() at the same place
const sleeve = (c: Ctx, x: number, y: number, an: number, s: number, col: string = CLOTH.child) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -700, -36, 640, 72, 14), col, 6);
  c.restore();
};

// the paper plane (a dart), nose to the right, centre of the keel at (x, y); tilt squashes it to look flat on a surface
const plane = (c: Ctx, x: number, y: number, s = 1, rot = 0, tilt = 1, clips = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s * tilt);
  const far = [[150, 0], [-110, -85], [-110, -9], [-55, -9]], near = [[150, 0], [-110, 85], [-110, 9], [-55, 9]];
  shape(c, () => polyP(c, far), COL.paper);
  shape(c, () => polyP(c, near), COL.paper);
  shade(c, () => polyP(c, near), "#b9ae93", 12, 0, 0.45);
  shape(c, () => polyP(c, [[150, 0], [-55, -9], [-110, -9], [-110, 9], [-55, 9]]), "#ffffff");
  line(c, [[150, 0], [-110, 0]], 3, COL.greyDk);
  for (let k = 0; k < clips; k++) {
    const px = clips === 1 ? 100 : 120 - k * 38, hw = ((150 - px) / 260) * 85 * 0.5 + 12;
    shape(c, () => rrect(c, px - 9, -hw, 18, hw * 2, 9), "rgba(0,0,0,0)", 0);
    c.lineWidth = 11; c.strokeStyle = INK; c.beginPath(); rrect(c, px - 9, -hw, 18, hw * 2, 9); c.stroke();
    c.lineWidth = 6; c.strokeStyle = COL.steel; c.beginPath(); rrect(c, px - 9, -hw, 18, hw * 2, 9); c.stroke();
  }
  c.restore();
};

// the paper spinner as a T seen from the front: strip body, bottom folded up with a clip, left wing tilted
// toward us (light), right wing tilted away (dark); wing length wl; top of the wings at (x, y)
const spinner = (c: Ctx, x: number, y: number, s = 1, wl = 110, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => rrect(c, -50, -10, 100, 270, 4), COL.paper);
  shape(c, () => polyP(c, [[-50, -42], [-50 - wl, -60], [-50 - wl, -8], [-50, 10]]), "#ffffff");
  shape(c, () => polyP(c, [[50, -42], [50 + wl, -26], [50 + wl, 26], [50, 10]]), PAPER2);
  shape(c, () => rrect(c, -50, 150, 100, 110, 4), "#ffffff");
  line(c, [[-50, 10], [50, 10]], 3, COL.greyDk);
  c.lineWidth = 12; c.strokeStyle = INK; c.beginPath(); rrect(c, -34, 138, 68, 56, 14); c.stroke();
  c.lineWidth = 6; c.strokeStyle = COL.steel; c.beginPath(); rrect(c, -34, 138, 68, 56, 14); c.stroke();
  c.restore();
};

// a table fan seen from the front
const fanFront = (c: Ctx) => {
  shadow(c, 470, 855, 280, 34);
  shape(c, () => rrect(c, 400, 600, 60, 190, 14), COL.steel);
  shape(c, () => rrect(c, 230, 770, 400, 90, 40), COL.teal);
  shade(c, () => rrect(c, 230, 770, 400, 90, 40), COL.tealDk, 0, 22, 0.8);
  shape(c, () => ell(c, 430, 380, 235, 235), "rgba(255,255,255,0.35)");
  for (let k = 0; k < 3; k++) {
    const a = k * 2.094 + 0.5;
    shape(c, () => ell(c, 430 + Math.cos(a) * 105, 380 + Math.sin(a) * 105, 105, 45, a), COL.teal, 6);
  }
  for (const r of [175, 115, 55]) { c.beginPath(); c.arc(430, 380, r, 0, 7); c.lineWidth = 6; c.strokeStyle = COL.steelDk; c.stroke(); }
  for (let k = 0; k < 12; k++) { const a = k * 0.5236; line(c, [[430 + Math.cos(a) * 30, 380 + Math.sin(a) * 30], [430 + Math.cos(a) * 235, 380 + Math.sin(a) * 235]], 4, COL.steelDk); }
  c.beginPath(); c.arc(430, 380, 235, 0, 7); c.lineWidth = 9; c.strokeStyle = INK; c.stroke();
  shape(c, () => ell(c, 430, 380, 40, 40), COL.steel);
};
// the same fan from its side, facing left: guard as a tilted ellipse, centre (800, 470)
const fanSide = (c: Ctx) => {
  const gx = 800, gy = 470;
  shadow(c, 830, 905, 200, 28);
  shape(c, () => rrect(c, 772, 690, 56, 170, 12), COL.steel);
  shape(c, () => rrect(c, 650, 840, 300, 70, 32), COL.teal);
  shade(c, () => rrect(c, 650, 840, 300, 70, 32), COL.tealDk, 0, 18, 0.8);
  shape(c, () => ell(c, gx, gy, 115, 235), "rgba(255,255,255,0.4)");
  for (let k = 0; k < 3; k++) {
    const a = k * 2.094 + 1.2;
    shape(c, () => ell(c, gx + Math.cos(a) * 40, gy + Math.sin(a) * 105, 36, 50, a * 0.5), COL.teal, 6);
  }
  for (const f of [0.7, 0.4]) { c.beginPath(); ell(c, gx, gy, 115 * f, 235 * f); c.lineWidth = 6; c.strokeStyle = COL.steelDk; c.stroke(); }
  for (let k = 0; k < 10; k++) { const a = k * 0.6283; line(c, [[gx, gy], [gx + Math.cos(a) * 115, gy + Math.sin(a) * 235]], 4, COL.steelDk); }
  c.beginPath(); ell(c, gx, gy, 115, 235); c.lineWidth = 9; c.strokeStyle = INK; c.stroke();
  shape(c, () => ell(c, gx, gy, 26, 30), COL.steel);
};
const WIND = "#8fc3ea";
const windLine = (c: Ctx, pts: number[][]) => { c.globalAlpha = 0.9; line(c, pts, 9, WIND); c.globalAlpha = 1; };
const sideScene = (c: Ctx) => { room(c, 760); c.fillStyle = "#c79a62"; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 5); c.fillStyle = "#e0b57d"; c.fillRect(0, 760, D, 120); line(c, [[0, 760], [D, 760]], 5); };

// setup.e1.0
const e1_0 = (c: Ctx) => {
  tableTop(c);
  c.save(); c.translate(540, 520); c.scale(1.3, 1.3); c.translate(-540, -520);
  shadow(c, 570, 830, 230, 34);
  const base = [[350, 250], [540, 250], [730, 440], [730, 790], [350, 790]];
  shape(c, () => polyP(c, base), COL.paper);
  shade(c, () => polyP(c, base), "#b9ae93", 20, 0, 0.4);
  shape(c, () => polyP(c, [[540, 250], [730, 440], [540, 440]]), "#ffffff");
  shade(c, () => polyP(c, [[540, 250], [730, 440], [540, 440]]), "#b9ae93", 12, 12, 0.45);
  line(c, [[540, 440], [540, 790]], 3, COL.grey);
  arrow(c, [[380, 290], [440, 330], [500, 390]], RED, 14);
  sleeve(c, 800, 370, Math.PI - 0.2, 1.5, CLOTH.child);
  hand(c, 800, 370, Math.PI - 0.2, 1.5, SKIN.child, CLOTH.child, true);
  c.restore();
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  room(c, 640);
  const cx = 400, fy = 860, h = 640;
  shadow(c, cx + 20, fy + 8, 140, 22);
  person(c, cx, fy, h, { armL: [1.7, 1.5], armR: [0.35, -0.55] });
  const sx = cx + h * 0.11, sy = fy - h * 0.74 + h * 0.03, ex = sx + Math.cos(0.35) * h * 0.17, ey = sy + Math.sin(0.35) * h * 0.17, wx = ex + Math.cos(-0.55) * h * 0.16, wy = ey + Math.sin(-0.55) * h * 0.16;
  const gx = wx + Math.cos(-0.55) * 45, gy = wy + Math.sin(-0.55) * 45;
  plane(c, gx + 55, gy - 28, 0.85, -0.35, 0.9);
  hand(c, wx, wy, -0.55, 0.7, SKIN.child, CLOTH.child);
  c.fillStyle = COL.yellow; c.beginPath(); polyP(c, [[0, 915], [D, 905], [D, 975], [0, 985]]); c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  line(c, [[0, 950], [D, 940]], 3, COL.orange);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  sideScene(c);
  shadow(c, 640, 830, 160, 22);
  sleeve(c, 120, 560, -0.12, 2.1);
  hand(c, 120, 560, -0.12, 2.1, SKIN.child, CLOTH.child, true);
  for (const [a, b, l] of [[450, 430, 110], [410, 510, 150], [460, 590, 100]]) { c.globalAlpha = 0.8; line(c, [[a, b], [a + l, b - 8]], 7, WIND); c.globalAlpha = 1; }
  plane(c, 700, 470, 1.3, -0.04, 0.6);
  arrow(c, [[880, 430], [1010, 430]], RED, 14);
};
// setup.e1.3
const e1_3 = (c: Ctx) => {
  room(c, 440);
  c.save(); c.translate(0, -100);
  c.fillStyle = COL.yellow; c.beginPath(); polyP(c, [[130, 640], [215, 640], [195, 960], [100, 960]]); c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  shadow(c, 800, 870, 190, 22);
  plane(c, 800, 820, 1.15, Math.PI, 0.55);
  shape(c, () => rrect(c, 195, 780, 600, 56, 6), COL.yellow);
  for (let x = 215; x < 780; x += 20) line(c, [[x, 780], [x, x % 100 === 15 ? 815 : 800]], 3);
  write(c, "0", 225, 700, 54, INK, 8);
  write(c, "5 m", 660, 690, 60, INK, 8);
  sleeve(c, 80, 810, 0, 1.4, CLOTH.adult);
  hand(c, 80, 810, 0, 1.4, SKIN.adult, CLOTH.adult);
  sleeve(c, 920, 700, 2.0, 1.2, CLOTH.child);
  hand(c, 920, 700, 2.0, 1.2, SKIN.child, CLOTH.child);
  c.restore();
};
// setup.e1.4
const e1_4 = (c: Ctx) => {
  tableTop(c);
  shadow(c, 640, 500, 300, 30); shadow(c, 640, 920, 300, 30);
  plane(c, 620, 330, 2, 0, 0.9, 1);
  plane(c, 620, 750, 2, 0, 0.9, 3);
  write(c, "1", 100, 250, 150, INK, 16);
  write(c, "3", 100, 670, 150, INK, 16);
};
// setup.e2.0
const e2_0 = (c: Ctx) => {
  tableTop(c);
  const L = 440, R = 640, T = 130, B = 960, cutEnd = 430, px = 540, py = 640;
  shadow(c, 560, 975, 190, 28);
  shape(c, () => rrect(c, L, T, R - L, B - T, 4), COL.paper);
  shade(c, () => rrect(c, L, T, R - L, B - T, 4), "#b9ae93", 16, 0, 0.4);
  shape(c, () => rrect(c, L, 800, R - L, B - 800, 4), "#ffffff");
  c.lineWidth = 14; c.strokeStyle = INK; c.beginPath(); rrect(c, L + 36, 830, R - L - 72, 100, 22); c.stroke();
  c.lineWidth = 8; c.strokeStyle = COL.steel; c.beginPath(); rrect(c, L + 36, 830, R - L - 72, 100, 22); c.stroke();
  // the cut: a dark slit from the top down to cutEnd, the two halves a little apart
  shape(c, () => polyP(c, [[px - 7, T], [px + 7, T], [px + 7, cutEnd - 20], [px, cutEnd], [px - 7, cutEnd - 20]]), WOOD, 5);
  // scissors: two blades closing on the end of the cut, orange handle loops below
  c.save(); c.translate(px, py);
  for (const sd of [-1, 1]) {
    shape(c, () => polyP(c, [[0, 0], [sd * 26, 0], [sd * 8, -(py - cutEnd) - 10], [sd * 2, -(py - cutEnd) - 10]]), COL.steel, 6);
    shape(c, () => ell(c, sd * 40, 112, 36, 46, sd * 0.25), COL.orange, 6);
    shape(c, () => ell(c, sd * 40, 112, 18, 26, sd * 0.25), "#e0d2b2", 5);
    line(c, [[0, 0], [sd * 34, 70]], 18, INK); line(c, [[0, 0], [sd * 34, 70]], 8, COL.orange);
  }
  shape(c, () => ell(c, 0, 0, 14, 14), COL.steelDk, 5);
  c.restore();
  sleeve(c, 745, 770, Math.PI + 0.2, 1.8, CLOTH.child);
  hand(c, 745, 770, Math.PI + 0.2, 1.8, SKIN.child, CLOTH.child);
  arrow(c, [[350, 170], [350, 400]], RED, 14);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  tableTop(c);
  spinner(c, 540, 220, 1.9, 130);
  sleeve(c, 330, 650, 0, 1.8);
  hand(c, 330, 650, 0, 1.8, SKIN.child, CLOTH.child);
  arrow(c, [[190, 190], [160, 270], [200, 330]], RED, 14);
  arrow(c, [[930, 200], [960, 130], [920, 90]], RED, 14);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  room(c, 920);
  const x = 360, fy = 870, h = 640, a1 = -0.8, a2 = -1.45;
  const sx = x + h * 0.11, sy = fy - h * 0.74 + h * 0.03, ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17, wx = ex + Math.cos(a2) * h * 0.16, wy = ey + Math.sin(a2) * h * 0.16;
  const s = 0.65, top = wy + 20 - 250 * s;
  // the wall stick: floor to the mark, ticks every tenth
  shape(c, () => rrect(c, 840, top, 44, 960 - top, 6), COL.wood);
  for (let k = 1; k < 10; k++) { const y = 960 - ((960 - top) * k) / 10; line(c, [[840, y], [k === 5 ? 872 : 860, y]], 4); }
  line(c, [[wx - 20, top], [885, top]], 8, RED);
  write(c, "2 m", 900, top + 14, 56, INK, 8);
  shadow(c, x + 10, 965, 220, 24);
  shape(c, () => rrect(c, x - 180, fy, 360, 90, 10), COL.brown);
  shade(c, () => rrect(c, x - 180, fy, 360, 90, 10), COL.soilDk, 0, 45, 0.5);
  person(c, x, fy, h, { adult: true, armL: [1.8, 1.6], armR: [a1, a2] });
  spinner(c, wx, top + 20 * s, s, 100, 0);
  shape(c, () => ell(c, wx, wy, 28, 28), SKIN.adult, 6);
};
// setup.e2.3
const e2_3 = (c: Ctx) => {
  ground(c, WALL);
  spinner(c, 515, 90, 1.0, 110, 0.12);
  const arc: number[][] = [];
  for (let a = 3.6; a <= 5.9; a += 0.12) arc.push([515 + Math.cos(a) * 270, 220 + Math.sin(a) * 90]);
  arrow(c, arc, RED, 12);
  arrow(c, [[515, 470], [515, 590]], RED, 14);
  shadow(c, 515, 1010, 150, 22);
  shape(c, () => rrect(c, 390, 640, 250, 370, 34), COL.black);
  shape(c, () => rrect(c, 408, 670, 214, 310, 14), "#f3f7fb", 4);
  const ccx = 515, ccy = 820;
  shape(c, () => ell(c, ccx, ccy, 88, 88), WHITE, 6);
  for (let k = 0; k < 12; k++) { const a = k * 0.5236; line(c, [[ccx + Math.cos(a) * 72, ccy + Math.sin(a) * 72], [ccx + Math.cos(a) * 84, ccy + Math.sin(a) * 84]], 4); }
  line(c, [[ccx, ccy], [ccx + 40, ccy - 50]], 7, RED);
  shape(c, () => ell(c, ccx, ccy, 8, 8), INK, 0);
  shape(c, () => rrect(c, ccx - 14, ccy - 112, 28, 16, 4), COL.steelDk, 4);
  sleeve(c, 330, 830, 0, 1.3);
  hand(c, 330, 830, 0, 1.3, SKIN.child, CLOTH.child);
};
// setup.e2.4
const e2_4 = (c: Ctx) => {
  tableTop(c);
  for (const [x, wl] of [[165, 45], [505, 85], [850, 130]]) {
    shadow(c, x + 20, 675, 90 + wl * 1.0, 24);
    spinner(c, x, 400, 1.05, wl);
  }
};
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c, WALL);
  c.fillStyle = "#c79a62"; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 5);
  fanFront(c);
  shape(c, () => ell(c, 520, 805, 26, 18), COL.red, 5);
  for (const y of [300, 400, 500]) windLine(c, [[110, y + 30], [50, y]]);
  sleeve(c, 690, 700, Math.PI - 0.65, 1.4, CLOTH.adult);
  hand(c, 690, 700, Math.PI - 0.65, 1.4, SKIN.adult, CLOTH.adult, true);
  arrow(c, [[560, 690], [545, 750]], RED, 14);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  sideScene(c); fanSide(c);
  for (const y of [300, 370, 640, 710]) windLine(c, [[690, y], [420, y], [330, y]]);
  sleeve(c, 150, 520, 0, 1.8);
  hand(c, 150, 520, 0, 1.8, SKIN.child, CLOTH.child, true);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  sideScene(c); fanSide(c);
  for (const y of [300, 370]) windLine(c, [[690, y], [380, y], [300, y - 40]]);
  for (const y of [640, 710]) windLine(c, [[690, y], [440, y], [380, y]]);
  sleeve(c, 150, 580, -0.3, 1.8);
  hand(c, 150, 580, -0.3, 1.8, SKIN.child, CLOTH.child, true);
  arrow(c, [[360, 470], [360, 380]], RED, 14);
};
// setup.e3.3
const e3_3 = (c: Ctx) => {
  sideScene(c); fanSide(c);
  // wind meets the steep hand, piles up on its palm and tumbles over the top
  for (const y of [640, 700, 760]) windLine(c, [[690, y], [560, y]]);
  windLine(c, [[690, 580], [590, 580], [540, 500], [440, 500]]);
  windLine(c, [[690, 520], [600, 520], [560, 440], [500, 440]]);
  for (const [x, y] of [[360, 400], [270, 330]]) {
    c.beginPath(); c.arc(x, y, 34, 0.3, 5.2); c.lineWidth = 8; c.strokeStyle = WIND; c.globalAlpha = 0.9; c.stroke(); c.globalAlpha = 1;
  }
  sleeve(c, 400, 920, -1.25, 3, CLOTH.child);
  hand(c, 400, 920, -1.25, 3, SKIN.child, CLOTH.child, true);
  arrow(c, [[380, 560], [150, 560]], RED, 18);
};

export const su_forcesFlight = cards("sci.forces.flight.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e1_4, e2_0, e2_1, e2_2, e2_3, e2_4, e3_0, e3_1, e3_2, e3_3]);
