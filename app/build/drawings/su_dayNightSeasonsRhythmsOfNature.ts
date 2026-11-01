import type { Ctx } from "./core";
import { D, COL, INK, RED, WHITE, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, person, write, rnd, plate, leaf, cards } from "./flatKit";

// sci.day-night-seasons.rhythms-of-nature.L3 · set-up cards. Same paper cup, steel plate, bean seedling, shoebox and jasmine buds on every card of an experiment.

// ---------------------------------------------------------------- shared things
// a window: wood frame, sky or night sky, a cross bar; sun low-left by day, moon and stars by night
const windowPane = (c: Ctx, x: number, y: number, w: number, h: number, night: boolean) => {
  shape(c, () => rrect(c, x - 22, y - 22, w + 44, h + 22, 14), COL.wood, 6);
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  c.fillStyle = night ? "#2a2f6b" : COL.sky; c.fillRect(x, y, w, h);
  if (night) {
    const r = rnd(5);
    for (let i = 0; i < 14; i++) { const sx = x + 20 + r() * (w - 40), sy = y + 20 + r() * (h * 0.6); line(c, [[sx - 8, sy], [sx + 8, sy]], 4, "#fff6cf"); line(c, [[sx, sy - 8], [sx, sy + 8]], 4, "#fff6cf"); }
    const mx = x + w * 0.7, my = y + h * 0.3, mr = Math.min(w, h) * 0.17;
    c.globalAlpha = 0.18; c.beginPath(); ell(c, mx, my, mr * 1.7, mr * 1.7); c.fillStyle = "#fff6cf"; c.fill(); c.globalAlpha = 1;
    shape(c, () => ell(c, mx, my, mr, mr), "#fff3c4", 5);
    c.beginPath(); ell(c, mx + mr * 0.5, my - mr * 0.25, mr * 0.85, mr * 0.9); c.fillStyle = "#2a2f6b"; c.fill();
  } else {
    const sx = x + w * 0.25, sy = y + h * 0.28, sr = Math.min(w, h) * 0.12;
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[sx + Math.cos(a) * sr * 1.3, sy + Math.sin(a) * sr * 1.3], [sx + Math.cos(a) * sr * 1.8, sy + Math.sin(a) * sr * 1.8]], 8, COL.orange); }
    shape(c, () => ell(c, sx, sy, sr, sr), COL.yellow, 6);
  }
  c.restore();
  c.beginPath(); c.rect(x, y, w, h); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  line(c, [[x + w / 2, y], [x + w / 2, y + h]], 12, INK); line(c, [[x + w / 2, y], [x + w / 2, y + h]], 6, COL.wood);
};
// the sill: a wooden shelf top and front, left to right
const sill = (c: Ctx, x0: number, x1: number, y: number) => {
  shape(c, () => polyP(c, [[x0, y], [x1, y], [x1 + 20, y + 40], [x0 - 20, y + 40]]), COL.wood, 6);
  shape(c, () => polyP(c, [[x0 - 20, y + 40], [x1 + 20, y + 40], [x1 + 20, y + 100], [x0 - 20, y + 100]]), COL.woodDk, 6);
};
// a paper cup of soil, base centre (x, y), top rim radius w/2
const cup = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.38, y); c.lineTo(x - w * 0.38, y); c.closePath(); };
  shadow(c, x + w * 0.1, y + 8, w * 0.55, w * 0.1);
  shape(c, body, COL.paper); shade(c, body, COL.grey, w * 0.2, 0, 0.5);
  shape(c, () => polyP(c, [[x - w * 0.47, y - h * 0.62], [x + w * 0.47, y - h * 0.62], [x + w * 0.44, y - h * 0.4], [x - w * 0.44, y - h * 0.4]]), COL.teal, 4);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), COL.soil, 5);
  c.beginPath(); ell(c, x + w * 0.12, y - h + 2, w * 0.3, w * 0.05); c.fillStyle = COL.soilDk; c.fill();
};
// a bean seedling from soil point (x, y): stem and two leaves. flat = held out, half = half down, down = hanging
const seedling = (c: Ctx, x: number, y: number, h: number, pose: "flat" | "half" | "down", lean = 0) => {
  const tx = x + lean, ty = y - h, len = h * 0.46;
  line(c, [[x, y], [tx, ty]], 16, INK); line(c, [[x, y], [tx, ty]], 8, COL.greenLt);
  const a = pose === "flat" ? -0.2 : pose === "half" ? 0.7 : 1.15;
  leaf(c, tx, ty, len, a); leaf(c, tx, ty, len, Math.PI - a);
  leaf(c, tx, ty, len * 0.4, -Math.PI / 2, COL.greenLt);
};
// a shoebox with a lid, front-bottom-left corner at (x, y)
const shoebox = (c: Ctx, x: number, y: number, w: number, h: number, d = 90) => {
  const t = d * 0.5;
  shape(c, () => polyP(c, [[x + w, y - h], [x + w + d, y - h - t], [x + w + d, y - t], [x + w, y]]), COL.brown, 6);
  shape(c, () => polyP(c, [[x, y - h], [x + w, y - h], [x + w + d, y - h - t], [x + d, y - h - t]]), COL.wood, 6);
  shape(c, () => rrect(c, x, y - h, w, h, 4), COL.orange, 6);
  shape(c, () => rrect(c, x - 8, y - h, w + 16, h * 0.18, 4), COL.woodDk, 6);
  shape(c, () => polyP(c, [[x + w + 8, y - h], [x + w + d + 8, y - h - t], [x + w + d + 8, y - h - t + h * 0.18], [x + w + 8, y - h + h * 0.18]]), COL.brown, 5);
};
const clock = (c: Ctx, x: number, y: number, r: number, hr: number) => {
  shape(c, () => ell(c, x, y, r, r), WHITE, 7);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8], [x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9]], 5); }
  const ah = (hr / 12) * Math.PI * 2 - Math.PI / 2;
  line(c, [[x, y], [x, y - r * 0.75]], 6); line(c, [[x, y], [x + Math.cos(ah) * r * 0.5, y + Math.sin(ah) * r * 0.5]], 10);
};
// a thermometer (digital): body with a screen, metal tip at the left
const thermo = (c: Ctx, x: number, y: number, len: number, an = 0, show = "") => {
  c.save(); c.translate(x, y); c.rotate(an);
  const t = len / 100;
  shape(c, () => rrect(c, 0, -12 * t, 82 * t, 24 * t, 12 * t), COL.teal, 6);
  shape(c, () => polyP(c, [[0, -7 * t], [-20 * t, -2 * t], [-20 * t, 2 * t], [0, 7 * t]]), COL.steel, 5);
  shape(c, () => rrect(c, 22 * t, -8 * t, 36 * t, 16 * t, 3 * t), "#22303a", 4);
  if (show) write(c, show, 25 * t, -6 * t, 12 * t, "#c9f06b", 3);
  c.restore();
};
// a jasmine bud: white tube, green cap
const bud = (c: Ctx, x: number, y: number, len: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => { c.moveTo(-len * 0.4, 0); c.quadraticCurveTo(0, -len * 0.26, len * 0.5, 0); c.quadraticCurveTo(0, len * 0.26, -len * 0.4, 0); c.closePath(); }, "#fffdf3", 4);
  shape(c, () => ell(c, -len * 0.38, 0, len * 0.13, len * 0.13), COL.green, 3.5);
  c.restore();
};
// an open jasmine flower: five round petals, yellow middle
const bloom = (c: Ctx, x: number, y: number, r: number, rot = 0) => {
  for (let i = 0; i < 5; i++) { const a = rot + (i / 5) * Math.PI * 2; shape(c, () => ell(c, x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, r * 0.5, r * 0.34, a), "#fffdf3", 4); }
  shape(c, () => ell(c, x, y, r * 0.2, r * 0.2), COL.yellow, 3.5);
};
// a steel dabba (round box) seen from above: base centre (x, y), body radius rx, wall height h, rim ry
const dabba = (c: Ctx, x: number, y: number, rx: number, h: number, ry: number) => {
  shadow(c, x + rx * 0.12, y + 8, rx * 1.05, ry * 0.55);
  const body = () => { c.moveTo(x - rx, y - h); c.lineTo(x - rx, y); c.quadraticCurveTo(x, y + ry * 1.2, x + rx, y); c.lineTo(x + rx, y - h); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, rx * 0.55, 0, 0.6);
  line(c, [[x - rx * 0.75, y - h * 0.8], [x - rx * 0.75, y - h * 0.15]], 8, WHITE);
  shape(c, () => ell(c, x, y - h, rx, ry), COL.steelIn, 6);
};
const tag = (c: Ctx, x: number, y: number, n: string) => {
  shape(c, () => rrect(c, x - 110, y - 48, 220, 96, 18), WHITE, 5);
  bud(c, x - 55, y, 70, -0.5); write(c, n, x + 5, y - 30, 60, INK, 8);
};

// ---------------------------------------------------------------- experiment 1: bean leaves day and night
// setup.e1.0
const e1s0 = (c: Ctx) => {
  ground(c); c.save(); c.translate(0, 150); windowPane(c, 110, 90, 860, 560, false); sill(c, 90, 990, 660);
  for (const px of [330, 750]) {
    plate(c, px, 700, 170, 34); cup(c, px, 695, 230, 215);
    seedling(c, px - 55, 485, 150, "flat", -6); seedling(c, px, 485, 200, "flat", 4); seedling(c, px + 55, 485, 135, "flat", 6);
  }
  c.restore();
};
// setup.e1.1
const e1s1 = (c: Ctx) => {
  ground(c); sill(c, 470, 1040, 880);
  plate(c, 770, 920, 180, 34); cup(c, 770, 910, 250, 230); seedling(c, 770, 680, 330, "flat");
  c.save(); c.translate(260, 630); c.rotate(-0.05);
  shadow(c, 20, 330, 200, 22);
  shape(c, () => rrect(c, -210, -300, 420, 600, 14), COL.paper, 7);
  (["flat", "half", "down"] as const).forEach((p, k) => {
    const yb = -215 + k * 170 + 70, a = p === "flat" ? -0.2 : p === "half" ? 0.7 : 1.35;
    line(c, [[0, yb], [0, yb - 60]], 12, INK); line(c, [[0, yb], [0, yb - 60]], 6, COL.greenLt);
    leaf(c, 0, yb - 60, 110, a); leaf(c, 0, yb - 60, 110, Math.PI - a);
  });
  c.restore();
  hand(c, 250, 1110, -Math.PI / 2 - 0.05, 2.2);
};
// setup.e1.2
const e1s2 = (c: Ctx) => {
  ground(c, "#e6dcc8"); c.save(); c.translate(0, 160); windowPane(c, 230, 90, 620, 520, true); sill(c, 150, 930, 620);
  plate(c, 540, 690, 200, 38); cup(c, 540, 682, 270, 250); seedling(c, 540, 432, 270, "down");
  c.restore();
};
// setup.e1.3
const e1s3 = (c: Ctx) => {
  ground(c); c.save(); c.translate(0, 190); windowPane(c, 580, 100, 420, 540, true); sill(c, 40, 1040, 660);
  plate(c, 800, 700, 130, 28); cup(c, 800, 695, 190, 170); seedling(c, 800, 525, 190, "down");
  plate(c, 270, 700, 150, 28); cup(c, 270, 695, 190, 170); seedling(c, 270, 525, 190, "flat");
  shoebox(c, 90, 705, 340, 480, 90);
  arrow(c, [[260, 70], [260, 180]], RED, 14);
  c.restore();
};
// setup.e1.4
const e1s4 = (c: Ctx) => {
  ground(c); windowPane(c, 50, 70, 420, 440, false); sill(c, 40, 1040, 780);
  plate(c, 400, 830, 190, 36); cup(c, 400, 822, 260, 230); seedling(c, 400, 592, 290, "flat");
  c.save(); c.translate(770, 440); c.rotate(-0.35); shoebox(c, -170, 160, 300, 330, 80); c.restore();
  hand(c, 890, 800, -2.0, 1.9, SKIN.child, CLOTH.child);
  arrow(c, [[640, 640], [640, 500]], RED, 12);
};

// ---------------------------------------------------------------- experiment 2: body temperature through the day
// setup.e2.0
const e2s0 = (c: Ctx) => {
  ground(c, "#f1e6d4"); windowPane(c, 70, 90, 330, 330, false);
  // bed: frame, mattress, pillow, then child sitting up, then blanket over the legs
  shape(c, () => rrect(c, 60, 740, 760, 70, 14), COL.brown, 6); line(c, [[100, 810], [100, 930]], 18, INK); line(c, [[780, 810], [780, 930]], 18, INK);
  shape(c, () => rrect(c, 40, 450, 60, 360, 14), "#7e5530", 6);
  shape(c, () => rrect(c, 90, 600, 130, 120, 40), COL.paper, 6);
  person(c, 330, 730, 560, { sit: true, armR: [Math.PI * 0.5, Math.PI * 0.62] });
  thermo(c, 395, 556, 200, -0.15, "37");
  shape(c, () => rrect(c, 330, 640, 490, 130, 40), COL.purple, 6); shade(c, () => rrect(c, 330, 640, 490, 130, 40), "#5a418c", 0, 30, 0.45);
  // bedside table and notebook
  shape(c, () => rrect(c, 840, 680, 200, 40, 8), COL.wood, 6); shape(c, () => rrect(c, 860, 720, 160, 210, 8), COL.woodDk, 6);
  shape(c, () => polyP(c, [[860, 680], [1010, 680], [1000, 620], [880, 620]]), COL.paper, 5); line(c, [[900, 650], [980, 650]], 4);
};
// setup.e2.1
const e2s1 = (c: Ctx) => {
  ground(c, "#f6e8d0"); clock(c, 830, 190, 130, 5);
  person(c, 250, 940, 640, { sit: true, armR: [0.8, 0.1] });
  shape(c, () => polyP(c, [[360, 770], [1040, 770], [1075, 840], [330, 840]]), COL.wood, 6);
  shape(c, () => polyP(c, [[330, 840], [1075, 840], [1075, 900], [330, 900]]), COL.woodDk, 6);
  line(c, [[400, 900], [400, 1060]], 24, INK); line(c, [[1010, 900], [1010, 1060]], 24, INK);
  shape(c, () => polyP(c, [[440, 780], [760, 780], [790, 835], [410, 835]]), WHITE, 5);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; line(c, [[560 + Math.cos(a) * 30, 805 + Math.sin(a) * 14], [560 + Math.cos(a) * 46, 805 + Math.sin(a) * 22]], 4, COL.orange); }
  shape(c, () => ell(c, 560, 805, 22, 10), COL.yellow, 3.5); line(c, [[620, 800], [720, 810]], 5, COL.grey);
  line(c, [[500, 790], [560, 770]], 12, INK); line(c, [[500, 790], [560, 770]], 6, COL.yellow);
  thermo(c, 800, 810, 240, 0.0);
};
// setup.e2.2
const e2s2 = (c: Ctx) => {
  ground(c, "#e8dcc6");
  shadow(c, 540, 1000, 440, 30);
  shape(c, () => rrect(c, 90, 70, 900, 910, 20), COL.paper, 7);
  for (let i = 0; i < 8; i++) shape(c, () => ell(c, 125, 150 + i * 105, 14, 14), COL.greyDk, 4);
  // 3 days x 3 readings; morning (blue), noon (yellow), afternoon (orange) dots at the left
  const cols = [390, 600, 810], rows = [310, 560, 810], dots = [COL.blue, COL.yellow, COL.orange];
  const nums = [["36", "36", "37"], ["35", "36", "37"], ["35", "37", "36"]];
  const best = [2, 2, 1];
  for (let k = 0; k < 3; k++) { write(c, String(k + 1), cols[k] + 40, 130, 90, INK, 9); shape(c, () => ell(c, 230, rows[k] + 40, 38, 38), dots[k], 6); }
  line(c, [[190, 230], [940, 230]], 7); line(c, [[300, 120], [300, 930]], 7);
  line(c, [[190, 440], [940, 440]], 3, COL.grey); line(c, [[190, 690], [940, 690]], 3, COL.grey);
  for (let k = 0; k < 3; k++) for (let r = 0; r < 3; r++) write(c, nums[k][r], cols[k] - 15, rows[r], 90, INK, 9);
  for (let k = 0; k < 3; k++) { const cx = cols[k] + 57, cy = rows[best[k]] + 45; c.beginPath(); ell(c, cx, cy, 90, 76); c.strokeStyle = RED; c.lineWidth = 11; c.stroke(); }
};

// ---------------------------------------------------------------- experiment 3: jasmine buds in the evening
// setup.e3.0
const e3s0 = (c: Ctx) => {
  ground(c); c.save(); c.translate(0, 40);
  plate(c, 290, 560, 290, 150);
  shape(c, () => ell(c, 290, 556, 240, 112), COL.cloth, 5);
  const r = rnd(3);
  for (let i = 0; i < 10; i++) bud(c, 125 + (i % 5) * 82 + r() * 6, 505 + Math.floor(i / 5) * 100 + r() * 8, 100, r() * 1.2 - 0.6);
  dabba(c, 800, 740, 175, 230, 85);
  shape(c, () => ell(c, 800, 510, 150, 70), COL.cloth, 4);
  for (let i = 0; i < 10; i++) bud(c, 720 + (i % 5) * 38 + r() * 4, 485 + Math.floor(i / 5) * 50 + r() * 4, 84, r() * 1.2 - 0.6 + (i % 2 ? 0.4 : -0.4));
  tag(c, 290, 860, "10"); tag(c, 800, 860, "10");
  c.restore();
};
// setup.e3.1
const e3s1 = (c: Ctx) => {
  ground(c, "#efdfc2");
  c.fillStyle = "rgba(255,214,110,0.20)"; c.beginPath(); c.moveTo(120, 190); c.lineTo(640, 1000); c.lineTo(-100, 1000); c.closePath(); c.fill();
  line(c, [[120, 0], [120, 100]], 6); shape(c, () => polyP(c, [[60, 180], [180, 180], [150, 100], [90, 100]]), COL.orange, 6); shape(c, () => ell(c, 120, 188, 36, 12), COL.yellow, 4);
  plate(c, 400, 630, 340, 180); shape(c, () => ell(c, 400, 626, 275, 130), COL.cloth, 5);
  [[250, 600, 0.4], [420, 560, 1.1], [330, 700, 0.7], [560, 610, 0.9], [510, 700, 0.2]].forEach(([x, y, a]) => bloom(c, x, y, 85, a));
  [[190, 670, 0.3], [330, 620, -0.5], [440, 650, 0.2], [610, 540, 0.8], [250, 520, 1.4]].forEach(([x, y, a]) => bud(c, x, y, 70, a));
  dabba(c, 930, 770, 120, 210, 56);
  shape(c, () => ell(c, 930, 560, 98, 42), COL.cloth, 4);
  c.save(); c.translate(940, 430); c.rotate(-0.4); shape(c, () => ell(c, 0, 0, 110, 32), COL.steel, 6); shape(c, () => ell(c, 0, -4, 85, 21), COL.steelIn, 4); c.restore();
  hand(c, 660, 920, -2.0, 1.8, SKIN.child, CLOTH.child, true);
};

export const su_dayNightSeasonsRhythmsOfNature = cards("sci.day-night-seasons.rhythms-of-nature.L3 set-up", [e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, e3s0, e3s1]);
