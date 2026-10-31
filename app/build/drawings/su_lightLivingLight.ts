import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards } from "./flatKit";

// sci.light.living-light.L3 set-up cards: glow sticks in steel tumblers, on a cloth, on a wrist, and glow-in-the-dark stars.
// One glow stick everywhere: a green tube with pale caps; dull when whole, bright with a halo once snapped.

const NIGHT = "#2b2866", NIGHT_DK = "#1d1a4a", STICK_DULL = "#7d9a3a", STICK_LIT = "#d4ff4a", GLOW = "#e6ff6a";
const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => { const A = rgb(a), B = rgb(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
const rgba = (h: string, a: number) => { const [r, g, b] = rgb(h); return `rgba(${r},${g},${b},${a})`; };
const halo = (c: Ctx, x: number, y: number, r: number, col: string, a: number) => {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(col, a)); g.addColorStop(0.45, rgba(col, a * 0.45)); g.addColorStop(1, rgba(col, 0));
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
};
// a glow stick centred at (x, y), length len, angle ang; glow 0 (whole, dull) .. 1 (snapped, bright)
const stick = (c: Ctx, x: number, y: number, len: number, ang: number, glow: number, w = 40, hs = 1) => {
  if (glow > 0) {
    const r = (w * 1.6 + glow * Math.min(len, 340) * 0.45) * hs, n = len > 400 ? 3 : 1;
    for (let k = 0; k < n; k++) { const o = n === 1 ? 0 : (k - 1) * len * 0.3; halo(c, x + Math.cos(ang) * o, y + Math.sin(ang) * o, r, GLOW, 0.12 + 0.5 * glow); }
  }
  const body = mix(STICK_DULL, STICK_LIT, glow), path = () => rrect(c, -len / 2, -w / 2, len, w, w / 2);
  c.save(); c.translate(x, y); c.rotate(ang);
  shape(c, path, body, 6);
  shade(c, path, mix(body, STICK_DULL, 0.5), 0, -w * 0.3, 0.55);
  line(c, [[-len / 2 + w * 0.9, -w * 0.2], [len / 2 - w * 0.9, -w * 0.2]], w * 0.16, glow > 0.5 ? "#fbffd0" : WHITE);
  shape(c, () => rrect(c, -len / 2, -w / 2, w * 0.75, w, w * 0.3), COL.cloth, 5);
  shape(c, () => rrect(c, len / 2 - w * 0.75, -w / 2, w * 0.75, w, w * 0.3), COL.cloth, 5);
  if (glow > 0 && len > 200) line(c, [[0, -w / 2], [0, w / 2]], 4);
  c.restore();
};
// a steel tumbler, bottom centre (x, y); inside() draws what is in it on the rim ellipse
type Inside = (c: Ctx, cx: number, cy: number, rx: number, ry: number) => void;
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, inside: Inside, dim = 0) => {
  shadow(c, x + w * 0.15, y + 8, w * 0.55, w * 0.1);
  const bot = w * 0.39, top = w / 2, ry = w * 0.13;
  const body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.quadraticCurveTo(x, y + ry * 1.2, x - bot, y); c.closePath(); };
  shape(c, body, COL.steel, 6);
  shade(c, body, COL.steelDk, -w * 0.22, 0, 0.6);
  shine(c, [[x - top * 0.7, y - h + ry * 1.6], [x - bot * 0.72, y - h * 0.2]], 8);
  shape(c, () => ell(c, x, y - h, top, ry), COL.steelIn, 5);
  shape(c, () => ell(c, x, y - h + 2, top * 0.86, ry * 0.78), COL.steelDk, 3);
  inside(c, x, y - h + 2, top * 0.86, ry * 0.78);
  if (dim) { c.beginPath(); body(); ell(c, x, y - h, top, ry); c.fillStyle = rgba(NIGHT_DK, dim); c.fill(); }
};
const cube = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -s, -s, s * 2, s * 2, s * 0.25), "#eaf6fd", 5);
  shade(c, () => rrect(c, -s, -s, s * 2, s * 2, s * 0.25), "#9cc6e3", -s * 0.5, -s * 0.5, 0.6);
  line(c, [[-s * 0.6, -s * 0.5], [-s * 0.1, -s * 0.5]], 5, WHITE);
  c.restore();
};
const iceIn: Inside = (c, cx, cy, rx, ry) => {
  shape(c, () => ell(c, cx, cy, rx, ry), "#cfe9f7", 0);
  cube(c, cx - rx * 0.45, cy - 8, 36, -0.25); cube(c, cx + rx * 0.4, cy - 4, 34, 0.3); cube(c, cx - rx * 0.02, cy - 26, 40, 0.1);
};
const waterIn = (col: string): Inside => (c, cx, cy, rx, ry) => {
  shape(c, () => ell(c, cx, cy, rx, ry), col, 0);
  c.beginPath(); ell(c, cx - rx * 0.35, cy - ry * 0.2, rx * 0.3, ry * 0.2); c.fillStyle = COL.drop; c.fill();
};
const WARM = "#f2b98a";
const steam = (c: Ctx, x: number, y: number) => {
  for (const k of [-1, 0, 1]) {
    const px = x + k * 52, pts = [[px, y], [px - 22, y - 45], [px + 22, y - 90], [px - 18, y - 135], [px + 16, y - 175]];
    line(c, pts, 24, INK); line(c, pts, 12, WHITE);
  }
};
// the three tumblers of experiment 1, always in the same places
const TX = [190, 540, 890], TY = 800, TW = 270, TH = 340;

// ---------------------------------------------------------------- experiment 1
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  tumbler(c, TX[0], TY, TW, TH, iceIn);
  tumbler(c, TX[1], TY, TW, TH, waterIn(COL.water));
  tumbler(c, TX[2], TY, TW, TH, waterIn(WARM));
  steam(c, TX[2], TY - TH - 40);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  const x0 = 120, x1 = 960, base = 840, rise = 160;
  const curve = (dy: number) => { const p = () => { c.beginPath(); c.moveTo(x0, base + dy); c.quadraticCurveTo((x0 + x1) / 2, base + dy - 2 * rise, x1, base + dy); }; return p; };
  // three whole sticks bent into an arch, one over the other
  for (const dy of [-46, 0, 46]) {
    const p = curve(dy);
    p(); c.strokeStyle = INK; c.lineWidth = 50; c.lineCap = "round"; c.stroke();
    p(); c.strokeStyle = STICK_DULL; c.lineWidth = 38; c.stroke();
    c.save(); c.translate(0, -9); p(); c.strokeStyle = WHITE; c.globalAlpha = 0.6; c.lineWidth = 6; c.stroke(); c.restore(); c.globalAlpha = 1;
  }
  // the click at the top of the bend
  for (const a of [-1.9, -1.57, -1.24]) line(c, [[540 + Math.cos(a) * 70, 655 + Math.sin(a) * 70], [540 + Math.cos(a) * 130, 655 + Math.sin(a) * 130]], 9);
  // hands from below, one on each end, tilted in
  hand(c, 337, 912, -2.12, 2.4);
  hand(c, 743, 912, -1.02, 2.4);
  arrow(c, [[60, 560], [185, 615]], RED, 12); arrow(c, [[1020, 560], [895, 615]], RED, 12);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c, NIGHT);
  const glows = [0.1, 0.5, 1], ang = [-1.38, -1.62, -1.75];
  const ins: Inside[] = [iceIn, waterIn(COL.water), waterIn(WARM)];
  TX.forEach((x, i) => tumbler(c, x, TY, TW, TH, ins[i], 0.35));
  TX.forEach((x, i) => stick(c, x + Math.cos(ang[i]) * -150 * -1, TY - TH + Math.sin(ang[i]) * 150, 300, ang[i], glows[i], 40, 1.9));
};

// ---------------------------------------------------------------- experiment 2
const cloth = (c: Ctx) => {
  shape(c, () => rrect(c, 70, 170, 940, 740, 50), COL.cloth, 6);
  shade(c, () => rrect(c, 70, 170, 940, 740, 50), "#e4dccb", -30, -30, 0.7);
  c.setLineDash([16, 14]); c.strokeStyle = COL.grey; c.lineWidth = 4; c.beginPath(); rrect(c, 106, 206, 868, 668, 30); c.stroke(); c.setLineDash([]);
};
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  cloth(c);
  shadow(c, 560, 880, 360, 34);
  stick(c, 540, 840, 720, 0, 0, 76);
  // one stick is bent until it clicks, and glows; the other lies whole beside it
  const P0 = [170, 560], C = [540, 400], P2 = [910, 560];
  const arc = () => { c.beginPath(); c.moveTo(P0[0], P0[1]); c.quadraticCurveTo(C[0], C[1], P2[0], P2[1]); };
  halo(c, 540, 520, 380, GLOW, 0.55);
  arc(); c.strokeStyle = INK; c.lineWidth = 88; c.lineCap = "round"; c.stroke();
  arc(); c.strokeStyle = STICK_LIT; c.lineWidth = 76; c.stroke();
  c.save(); c.translate(0, -16); arc(); c.strokeStyle = "#fbffd0"; c.lineWidth = 10; c.stroke(); c.restore();
  for (const a of [-1.95, -1.57, -1.19]) line(c, [[540 + Math.cos(a) * 80, 480 + Math.sin(a) * 80], [540 + Math.cos(a) * 150, 480 + Math.sin(a) * 150]], 10);
  hand(c, 215, 330, 1.0, 2.2);
  hand(c, 865, 330, Math.PI - 1.0, 2.2);
  arrow(c, [[40, 640], [140, 590]], RED, 12); arrow(c, [[1040, 640], [940, 590]], RED, 12);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  // a forearm, palm up, with an open hand; the glowing stick lies across the inside of the wrist
  const arm = () => rrect(c, 120, 360, 560, 190, 70);
  shape(c, () => rrect(c, -80, 330, 320, 250, 60), CLOTH.child, 6);
  shade(c, () => rrect(c, -80, 330, 320, 250, 60), CLOTH.childDk, 0, -40, 0.6);
  shadow(c, 520, 600, 380, 26);
  for (let k = 0; k < 4; k++) shape(c, () => rrect(c, 700, 360 + k * 46, 200 - Math.abs(k - 1.4) * 22, 40, 20), SKIN.child, 6);
  shape(c, arm, SKIN.child, 6);
  shade(c, arm, SKIN.childDk, 0, -40, 0.5);
  shape(c, () => ell(c, 690, 460, 100, 108), SKIN.child, 6);
  shape(c, () => ell(c, 690, 460, 82, 90), "#c98d63", 0);
  shape(c, () => { c.moveTo(640, 560); c.quadraticCurveTo(690, 620, 760, 540); c.quadraticCurveTo(720, 560, 700, 520); c.closePath(); }, SKIN.child, 6);
  line(c, [[300, 400], [300, 440]], 4, SKIN.childDk); line(c, [[300, 480], [300, 520]], 4, SKIN.childDk);
  halo(c, 470, 455, 150, GLOW, 0.55);
  stick(c, 470, 440, 520, Math.PI / 2, 1, 52, 0.4);
  hand(c, 470, 70, Math.PI / 2, 1.4);
  arrow(c, [[600, 160], [600, 300]], RED, 12);
  write(c, "20", 750, 130, 120, INK, 12);
  shadow(c, 560, 925, 330, 26);
  stick(c, 540, 860, 640, 0, 0, 52);
};
const thermo = (c: Ctx, y: number) => {
  shape(c, () => rrect(c, 529, y + 170, 22, 74, 8), COL.steel, 5);
  shape(c, () => rrect(c, 380, y, 320, 180, 36), COL.teal, 6);
  shade(c, () => rrect(c, 380, y, 320, 180, 36), COL.tealDk, -14, -14, 0.6);
  shape(c, () => rrect(c, 410, y + 22, 260, 120, 16), "#22303a", 5);
  write(c, "28°", 432, y + 38, 88, "#c9f06b", 9);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  thermo(c, 50);
  shadow(c, 560, 360, 380, 26);
  stick(c, 540, 330, 780, 0, 1, 64);
  thermo(c, 560);
  shadow(c, 560, 880, 380, 26);
  stick(c, 540, 850, 780, 0, 0, 64);
};

// ---------------------------------------------------------------- experiment 3
const star = (c: Ctx, x: number, y: number, R: number, glow: number, on = true) => {
  const pts = (dy: number) => Array.from({ length: 10 }, (_, i) => { const r = i % 2 ? R * 0.45 : R, a = -Math.PI / 2 + (i * Math.PI) / 5; return [x + Math.cos(a) * r, y + dy + Math.sin(a) * r * 0.62]; });
  const col = on ? mix("#9aa27a", "#d6ff6a", glow) : "#b5bd93";
  if (glow > 0) halo(c, x, y, R * (1.4 + glow * 1.6), GLOW, 0.15 + 0.4 * glow);
  shape(c, () => polyP(c, pts(18)), mix(col, INK, 0.35), 6);
  shape(c, () => polyP(c, pts(0)), col, 6);
  if (glow > 0) shape(c, () => ell(c, x, y, R * 0.28, R * 0.18), "#fbffd0", 0);
};
const tableTop = (c: Ctx, y: number, col: string) => {
  shape(c, () => polyP(c, [[0, y], [D, y], [D, D], [0, D]]), col, 0);
  line(c, [[0, y], [D, y]], 6);
};
const phone = (c: Ctx, x: number, y: number, w: number, h: number, txt: string, sweep: number) => {
  shadow(c, x + w * 0.55, y + h + 4, w * 0.6, w * 0.08);
  shape(c, () => rrect(c, x, y, w, h, w * 0.14), COL.black, 6);
  shape(c, () => rrect(c, x + w * 0.07, y + h * 0.05, w * 0.86, h * 0.9, w * 0.1), COL.cloth, 4);
  const cx = x + w / 2, cy = y + h * 0.38, r = w * 0.34;
  shape(c, () => rrect(c, cx - w * 0.06, cy - r - w * 0.1, w * 0.12, w * 0.09, 4), COL.steelDk, 4);
  shape(c, () => ell(c, cx, cy, r, r), WHITE, 5);
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[cx + Math.sin(a) * r * 0.8, cy - Math.cos(a) * r * 0.8], [cx + Math.sin(a) * r * 0.92, cy - Math.cos(a) * r * 0.92]], 4); }
  line(c, [[cx, cy], [cx + Math.sin(sweep) * r * 0.72, cy - Math.cos(sweep) * r * 0.72]], 6, RED);
  shape(c, () => ell(c, cx, cy, 7, 7), INK, 0);
  const hh = w * 0.26; write(c, txt, cx - (0.8 * (txt.length - 1) + 0.6) * hh / 2, y + h * 0.7, hh, INK, 6);
};
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  tableTop(c, 690, COL.wood);
  const T = [560, 800], bx = 220, by = 850, br = 135;
  // star B lit by the torch
  star(c, T[0], T[1], 130, 0.35);
  // star A under the upturned steel bowl, one tip showing
  star(c, bx + 120, by - 20, 100, 0, false);
  shadow(c, bx + 25, by + 14, br * 0.95, br * 0.2);
  shape(c, () => ell(c, bx, by, br, br * 0.2), COL.steelDk, 5);
  const dome = () => { c.moveTo(bx - br, by); c.bezierCurveTo(bx - br, by - br * 1.2, bx + br, by - br * 1.2, bx + br, by); c.ellipse(bx, by, br, br * 0.2, 0, 0, Math.PI); c.closePath(); };
  shape(c, dome, COL.steel, 6);
  shade(c, dome, COL.steelDk, -br * 0.4, -br * 0.05, 0.6);
  shine(c, [[bx - br * 0.7, by - br * 0.5], [bx - br * 0.4, by - br * 0.8]], 10);
  // the torch, held in a hand, its beam on star B
  const G = [820, 300], ang = Math.atan2(T[1] - G[1], T[0] - G[0]), dir = [Math.cos(ang), Math.sin(ang)], p = [-dir[1], dir[0]], len = 280;
  const L = [G[0] + dir[0] * (len / 2 + 50), G[1] + dir[1] * (len / 2 + 50)];
  const e = Math.sign(p[0]) * 240;
  c.beginPath(); c.moveTo(L[0] + p[0] * 46, L[1] + p[1] * 46); c.lineTo(L[0] - p[0] * 46, L[1] - p[1] * 46); c.lineTo(T[0] - e, T[1] + 40); c.lineTo(T[0] + e, T[1] - 40); c.closePath(); c.fillStyle = "rgba(255,226,110,0.45)"; c.fill();
  star(c, T[0], T[1], 130, 0.9);
  c.save(); c.translate(G[0], G[1]); c.rotate(ang);
  shape(c, () => rrect(c, -len / 2, -26, len, 52, 14), COL.red, 6);
  shade(c, () => rrect(c, -len / 2, -26, len, 52, 14), "#a8372a", 0, -14, 0.55);
  shape(c, () => polyP(c, [[len / 2 - 10, -26], [len / 2 + 50, -48], [len / 2 + 50, 48], [len / 2 - 10, 26]]), COL.steel, 6);
  shape(c, () => ell(c, len / 2 + 50, 0, 14, 48), "#fff6c0", 5);
  c.restore();
  hand(c, G[0] - Math.cos(ang - Math.PI / 2) * 112, G[1] - Math.sin(ang - Math.PI / 2) * 112, ang - Math.PI / 2, 1.6);
  phone(c, 800, 590, 200, 340, "50", (50 / 60) * Math.PI * 2);
};
const darkRoom = (c: Ctx, childPoint?: [number, number]) => {
  ground(c, NIGHT);
  person(c, 190, 1010, 720, childPoint ? { armR: childPoint } : {});
  c.fillStyle = rgba(NIGHT, 0.5); c.fillRect(0, 0, D, D);
  tableTop(c, 730, "#4a3a50");
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c, NIGHT);
  tableTop(c, 730, "#4a3a50");
  star(c, 540, 880, 120, 1);
  star(c, 840, 880, 120, 0);
  phone(c, 100, 470, 240, 400, "0", 0);
  hand(c, 110, 290, 1.15, 2.4);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  darkRoom(c, [0.95, 0.95]);
  star(c, 540, 880, 120, 0.75);
  star(c, 840, 880, 120, 0, false);
  arrow(c, [[430, 735], [490, 790]], RED, 10);
};

export const su_lightLivingLight = cards("sci.light.living-light.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
void BG; void CLOTH;
