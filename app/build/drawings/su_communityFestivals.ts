import type { Ctx } from "./core";
import { D, BG, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, rrect, polyP, shadow, shade, line, shine, arrow, glass, bowl, hand, write, cards } from "./flatKit";

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
  const xs = [165, 395, 625, 855];
  [[360, 0], [700, 4]].forEach(([y, o]) => xs.forEach((x, i) => {
    bowl(c, x, y, 95, TURMERIC); c.beginPath(); ell(c, x - 22, y - 2, 28, 5); c.fillStyle = "rgba(255,255,255,0.45)"; c.fill();
    shape(c, () => rrect(c, x - 45, y + 82, 90, 56, 8), COL.paper, 4);
    write(c, String(i + 1 + o), x - 14, y + 92, 36, INK, 5);
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
  c.beginPath(); ell(c, 600, 700, 250, 40); c.fillStyle = "#c4608f"; c.fill();
  [[460, 690, 60, 0.3], [560, 720, 54, 2.4], [660, 690, 60, 4.0], [740, 725, 50, 1.2], [610, 668, 48, 5.2], [520, 668, 44, 3.3], [700, 650, 40, 0.8]].forEach(([x, y, r, a]) => petal(c, x, y, r, a));
  for (const [x, s] of [[470, 1], [590, 1.2], [720, 0.9]]) line(c, [[x, 520], [x - 18 * s, 470], [x + 14 * s, 420], [x - 8 * s, 365]], 9, "rgba(255,255,255,0.8)");
  hand(c, 250, 520, 0.62, 2.8, SKIN.child, CLOTH.child, true);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  const xs = [200, 540, 880];
  glass(c, xs[0], 620, 250, 360, 0.75, "#ef6a98"); glass(c, xs[1], 620, 250, 360, 0.75, "#6fbf55"); glass(c, xs[2], 620, 250, 360, 0.75, COL.purple);
  lemon(c, xs[0], 840, 90);
  // soap bar
  shadow(c, xs[1] + 14, 905, 110, 20);
  shape(c, () => rrect(c, xs[1] - 100, 790, 200, 110, 34), "#cfe8f6", 6); shade(c, () => rrect(c, xs[1] - 100, 790, 200, 110, 34), "#9cc3dd", 22, 8, 0.5);
  shape(c, () => ell(c, xs[1] + 55, 790, 28, 28), WHITE, 4); shape(c, () => ell(c, xs[1] + 100, 760, 16, 16), WHITE, 4);
  // plain water in a katori
  bowl(c, xs[2], 810, 100, COL.water);
  [xs[0], xs[1], xs[2]].forEach((x) => arrow(c, [[x, 730], [x, 690]]));
};

// ---- e3: festival dates over three years
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  // notebook on the left
  c.save(); c.translate(175, 340); c.rotate(-0.06);
  shadow(c, 12, 242, 150, 22);
  shape(c, () => rrect(c, -150, -230, 300, 460, 14), COL.paper, 6);
  for (let i = 0; i < 4; i++) line(c, [[-150, -90 + i * 80], [150, -90 + i * 80]], 4);
  line(c, [[-50, -230], [-50, 230]], 4); line(c, [[50, -230], [50, 230]], 4);
  write(c, "12", -138, -195, 48, INK, 6); write(c, "3", -22, -195, 48, INK, 6); write(c, "8", 78, -195, 48, INK, 6);
  c.restore();
  // the phone with a month calendar
  shadow(c, 600, 840, 230, 30);
  shape(c, () => rrect(c, 410, 120, 400, 720, 50), COL.black, 6);
  shape(c, () => rrect(c, 430, 150, 360, 660, 28), WHITE, 4);
  shape(c, () => polyP(c, [[430, 178], [458, 150], [762, 150], [790, 178], [790, 260], [430, 260]]), RED, 4);
  write(c, "2024", 530, 188, 52, WHITE, 7);
  for (let i = 0; i < 30; i++) { const cx = 450 + (i % 7) * 48, cy = 300 + Math.floor(i / 7) * 100; if (i === 11) shape(c, () => ell(c, cx + 20, cy + 13, 25, 25), COL.orange, 4); write(c, String(i + 1), cx + (i < 9 ? 10 : 2), cy, 24, INK, 4); }
  // the grown-up's hand holds the phone, the child's hand points at a day
  hand(c, 300, 720, 0, 1.4, SKIN.adult, CLOTH.adult);
  hand(c, 880, 470, Math.PI + 0.3, 1.6, SKIN.child, CLOTH.child, true);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 960, 430, 28);
  shape(c, () => rrect(c, 60, 70, 960, 880, 24), COL.paper, 6);
  for (let i = 0; i < 9; i++) shape(c, () => ell(c, 90, 140 + i * 90, 12, 12), BG, 4);
  const colx = [440, 620, 800];
  ["2024", "2025", "2026"].forEach((t, i) => write(c, t, colx[i] - 26, 100, 40, INK, 6));
  const rows: [string[], boolean][] = [[["26", "26", "26"], true], [["15", "15", "15"], true], [["2", "2", "2"], true], [["1", "20", "8"], false], [["25", "14", "4"], false], [["10", "31", "20"], false]];
  const icons = [
    (x: number, y: number) => { shape(c, () => rrect(c, x - 40, y - 24, 80, 18, 2), "#f39a3c", 4); shape(c, () => rrect(c, x - 40, y - 6, 80, 18, 2), WHITE, 4); shape(c, () => rrect(c, x - 40, y + 12, 80, 18, 2), COL.green, 4); },
    (x: number, y: number) => { line(c, [[x, y + 6], [x - 10, y + 30], [x + 12, y + 40]], 4); shape(c, () => polyP(c, [[x, y - 36], [x + 30, y - 4], [x, y + 8], [x - 30, y - 4]]), COL.pink, 5); },
    (x: number, y: number) => { shape(c, () => ell(c, x - 24, y, 20, 20), COL.glass, 5); shape(c, () => ell(c, x + 24, y, 20, 20), COL.glass, 5); line(c, [[x - 4, y], [x + 4, y]], 5); },
    (x: number, y: number) => { for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; shape(c, () => ell(c, x + Math.cos(a) * 24, y + Math.sin(a) * 24, 16, 16), k % 2 ? COL.orange : COL.pink, 4); } shape(c, () => ell(c, x, y, 13, 13), COL.yellow, 4); },
    (x: number, y: number) => { for (const [dx, dy, col] of [[-22, -12, COL.pink], [20, -14, COL.blue], [0, 18, COL.yellow], [26, 16, COL.green]] as [number, number, string][]) shape(c, () => ell(c, x + dx, y + dy, 18, 18), col, 4); },
    (x: number, y: number) => { shape(c, () => { c.arc(x, y, 34, 0.9, Math.PI * 2 - 0.9); c.arc(x + 14, y, 26, Math.PI * 2 - 1.1, 1.1, true); c.closePath(); }, COL.yellow, 5); },
  ];
  rows.forEach(([d, same], r) => {
    const y = 200 + r * 120;
    if (r) line(c, [[110, y - 45], [980, y - 45]], 3, COL.grey);
    icons[r](210, y + 30);
    d.forEach((t, i) => write(c, t, colx[i] - (t.length - 1) * 20, y, 56, INK, 8));
    shape(c, () => rrect(c, 360, y - 20, 560, 100, 50), "rgba(0,0,0,0)", 0);
    c.beginPath(); rrect(c, 355, y - 18, 560, 96, 48); c.strokeStyle = same ? COL.green : COL.orange; c.lineWidth = 10; c.stroke();
  });
  line(c, [[110, 200 + 3 * 120 - 45], [980, 200 + 3 * 120 - 45]], 8, INK);
};

export const su_communityFestivals = cards("sci.community.festivals.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e3_0, e3_1]);
