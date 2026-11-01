import type { Ctx } from "./core";
import { INK, BG, SH, WHITE, RED, COL, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, write, cards } from "./flatKit";

// sci.weather.weather.L3 set-up cards: a thermometer on a balcony (sun, shade, paper roof),
// rain caught in a wide and a narrow container, and a day's temperatures written and charted.
// Same thermometer, same grill, same dabba and glass on every card of one experiment.

const GLASSF = "#f1f8fc", PAPER = "#fffaf0", PAPERDK = "#e9dfca", GRILL = "#6d6a80";

// a hand drawn mirrored, so the thumb stays on top when the arm comes from the right; an = real direction in the picture
const handFlip = (c: Ctx, x: number, y: number, an: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, Math.PI - an, s); c.restore();
};
// a pencil whose tip is at (tx, ty), lying back along direction an for len px
const pencil = (c: Ctx, tx: number, ty: number, an: number, len: number) => {
  const u = [Math.cos(an), Math.sin(an)], v = [-u[1], u[0]], P = (t: number, o: number) => [tx - u[0] * t + v[0] * o, ty - u[1] * t + v[1] * o];
  shape(c, () => polyP(c, [P(len, -17), P(60, -17), P(60, 17), P(len, 17)]), COL.yellow, 6);
  shape(c, () => polyP(c, [P(len, 3), P(60, 3), P(60, 17), P(len, 17)]), COL.orange, 0);
  shape(c, () => polyP(c, [P(len, -17), P(60, -17), P(60, 17), P(len, 17)]), "rgba(0,0,0,0)", 6);
  shape(c, () => polyP(c, [P(60, -17), P(0, 0), P(60, 17)]), "#f0d2a4", 6);
  shape(c, () => polyP(c, [P(16, -5), P(0, 0), P(16, 5)]), INK, 3);
  shape(c, () => polyP(c, [P(len, -17), P(len - 26, -17), P(len - 26, 17), P(len, 17)]), COL.pink, 6);
};

// ---------------------------------------------------------------- the thermometer
// glass tube with a red column, a bulb at the bottom; hangs on a thread when thread >= 0
const thermo = (c: Ctx, x: number, top: number, len: number, level: number, tw = 56, thread = -1) => {
  const tr = tw / 2, br = tw * 1.2, by = top + len;
  c.save(); c.translate(tw * 0.6, tw * 0.45); c.fillStyle = SH; c.beginPath(); rrect(c, x - tr, top, tw, len, tr); c.fill(); c.beginPath(); ell(c, x, by, br, br); c.fill(); c.restore();
  if (thread >= 0) { line(c, [[x, thread], [x, top - tw * 0.45]], Math.max(4, tw * 0.09)); shape(c, () => ell(c, x, top - tw * 0.2, tw * 0.22, tw * 0.22), "rgba(0,0,0,0)", Math.max(4, tw * 0.1)); }
  shape(c, () => rrect(c, x - tr, top, tw, len + 10, tr), GLASSF, 6);
  shape(c, () => ell(c, x, by, br, br), GLASSF, 6);
  c.fillStyle = GLASSF; c.fillRect(x - tr + 3, by - br * 0.95, tw - 6, br * 0.95 + 24);
  shade(c, () => rrect(c, x - tr, top, tw, len + 10, tr), "#b9cbd8", -tw * 0.3, 0, 0.45);
  const yL = top + tw * 0.5 + (1 - level) * (len - tw * 1.2), lw = tw * 0.17;
  shape(c, () => rrect(c, x - lw, yL, lw * 2, by - yL + 4, lw), RED, 0);
  shape(c, () => ell(c, x, by, br - tw * 0.2, br - tw * 0.2), RED, 0);
  shape(c, () => ell(c, x, by, br - 2, br - 2), "rgba(0,0,0,0)", 6);
  shine(c, [[x - tr + tw * 0.22, top + tw * 0.6], [x - tr + tw * 0.22, by - br - 6]], Math.max(4, tw * 0.12));
  for (let i = 0; i <= 10; i++) { const ty = top + tw * 0.7 + (i * (len - tw * 1.6 - br * 0.9)) / 10; line(c, [[x + lw + tw * 0.08, ty], [x + tr - tw * 0.08, ty]], Math.max(2, tw * 0.05), i % 5 === 0 ? INK : COL.greyDk); }
};

// ---------------------------------------------------------------- the balcony
const sunDisc = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2, b = r * 1.0; shape(c, () => polyP(c, [[x + Math.cos(a - 0.17) * b, y + Math.sin(a - 0.17) * b], [x + Math.cos(a) * r * 1.5, y + Math.sin(a) * r * 1.5], [x + Math.cos(a + 0.17) * b, y + Math.sin(a + 0.17) * b]]), COL.orange, 5); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
  shade(c, () => ell(c, x, y, r, r), COL.orange, -r * 0.3, -r * 0.3, 0.5);
};
const grillFrame = (c: Ctx, cx: number) => {
  for (const dx of [-400, -240, -80, 80, 240, 400]) shape(c, () => rect(c, cx + dx - 10, 136, 20, 844), GRILL, 5);
  shape(c, () => rect(c, 40, 100, 1000, 36), GRILL, 6); shape(c, () => rect(c, 40, 980, 1000, 32), GRILL, 6);
  shape(c, () => rect(c, 40, 100, 36, 912), GRILL, 6); shape(c, () => rect(c, 1004, 100, 36, 912), GRILL, 6);
};
const rect = (c: Ctx, x: number, y: number, w: number, h: number) => polyP(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
// a folded white paper roof taped to the top bar, centred on cx
const roof = (c: Ctx, cx: number) => {
  shape(c, () => polyP(c, [[cx - 190, 128], [cx, 128], [cx, 330], [cx - 270, 330]]), PAPER, 6);
  shape(c, () => polyP(c, [[cx, 128], [cx + 190, 128], [cx + 270, 330], [cx, 330]]), PAPERDK, 6);
  for (const dx of [-150, 100]) { c.save(); c.translate(cx + dx + 25, 150); c.rotate(dx < 0 ? -0.1 : 0.1); shape(c, () => rect(c, -45, -26, 90, 52), "rgba(255,211,77,0.9)", 4); c.restore(); }
};
type Bal = { sun?: boolean; roof?: boolean; cx?: number; level: number; phone?: boolean };
const balcony = (c: Ctx, o: Bal) => {
  const cx = o.cx ?? 540;
  c.fillStyle = o.sun ? "#fdeeb9" : "#b4c2dc"; c.fillRect(0, 0, 1080, 1080);
  if (o.sun) for (const a of [0.25, 0.5, 0.75, 1.0, 1.25]) { c.beginPath(); c.moveTo(210, 250); c.lineTo(210 + Math.cos(a - 0.07) * 1700, 250 + Math.sin(a - 0.07) * 1700); c.lineTo(210 + Math.cos(a + 0.07) * 1700, 250 + Math.sin(a + 0.07) * 1700); c.closePath(); c.fillStyle = "rgba(255,214,90,0.38)"; c.fill(); }
  grillFrame(c, cx);
  if (o.roof && o.sun) { c.beginPath(); polyP(c, [[cx - 215, 330], [cx + 245, 330], [cx + 345, 1000], [cx - 115, 1000]]); c.fillStyle = "rgba(70,90,150,0.38)"; c.fill(); }
  if (o.sun) sunDisc(c, 210, 250, 85);
  thermo(c, cx, 270, 560, o.level, 56, 136);
  if (o.roof) roof(c, cx);
  if (o.phone) {
    c.save(); c.translate(880, 980); c.rotate(-0.07); shadow(c, 30, 0, 110, 14);
    shape(c, () => rrect(c, -80, -300, 160, 300, 24), COL.black, 6);
    shape(c, () => rrect(c, -66, -280, 132, 250, 10), COL.sky, 4);
    shape(c, () => ell(c, 0, -155, 48, 48), WHITE, 5);
    c.beginPath(); c.moveTo(0, -155); c.arc(0, -155, 48, -Math.PI / 2, Math.PI * 0.6); c.closePath(); c.fillStyle = RED; c.fill();
    shape(c, () => ell(c, 0, -155, 48, 48), "rgba(0,0,0,0)", 5);
    c.restore();
  }
};

// ---------------------------------------------------------------- bathroom: containers
const bathroom = (c: Ctx) => {
  c.fillStyle = "#cfe7ea"; c.fillRect(0, 0, 1080, 1080);
  c.strokeStyle = "#a9cfd5"; c.lineWidth = 3;
  for (let x = 0; x <= 1080; x += 120) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 520); c.stroke(); }
  for (let y = 0; y <= 520; y += 120) { c.beginPath(); c.moveTo(0, y); c.lineTo(1080, y); c.stroke(); }
  c.fillStyle = "#e8dcc2"; c.fillRect(0, 520, 1080, 560);
  c.strokeStyle = "#cdbd9b";
  for (let y = 640; y < 1080; y += 140) { c.beginPath(); c.moveTo(0, y); c.lineTo(1080, y); c.stroke(); }
  for (let x = 60; x <= 1080; x += 180) { c.beginPath(); c.moveTo(x, 520); c.lineTo(x, 1080); c.stroke(); }
  line(c, [[0, 520], [1080, 520]], 6);
};
const body = (c: Ctx, x: number, y: number, rx: number, h: number) => { const ry = rx * 0.2; c.moveTo(x - rx, y - h); c.lineTo(x - rx, y); c.ellipse(x, y, rx, ry, 0, Math.PI, 0, true); c.lineTo(x + rx, y - h); c.closePath(); };
// a wide steel dabba, bottom centre (x, y)
const dabba = (c: Ctx, x: number, y: number, rx: number, h: number) => {
  const ry = rx * 0.2, b = () => body(c, x, y, rx, h);
  shadow(c, x + rx * 0.14, y + ry * 0.4, rx * 1.05, ry * 1.1);
  shape(c, b, COL.steel, 6); shade(c, b, COL.steelDk, -rx * 0.5, 0, 0.5);
  shape(c, () => ell(c, x, y - h, rx, ry), COL.steelIn, 6);
  shape(c, () => ell(c, x, y - h, rx - 16, ry - 4), "#aab4c2", 3);
  c.beginPath(); c.ellipse(x, y - h + 34, rx, ry, 0, 0.05, Math.PI - 0.05); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  shine(c, [[x - rx + 30, y - h + 70], [x - rx + 30, y - 40]], 9);
};
// a narrow straight glass; water 0..1 of height
const tumbler = (c: Ctx, x: number, y: number, rx: number, h: number, water = 0, wl = 0) => {
  const ry = rx * 0.2, b = () => body(c, x, y, rx, h);
  shadow(c, x + rx * 0.2, y + ry * 0.4, rx * 1.1, ry * 1.1);
  shape(c, b, "rgba(232,245,252,0.85)", 0);
  if (water > 0 || wl > 0) { const wy = y - (wl || water * h); c.save(); c.beginPath(); b(); c.clip(); c.fillStyle = COL.water; c.fillRect(x - rx, wy, rx * 2, y - wy + ry); c.beginPath(); ell(c, x, wy, rx, ry); c.fillStyle = COL.drop; c.fill(); c.restore(); }
  shape(c, b, "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, x, y - h, rx, ry), "rgba(255,255,255,0.35)", 6);
  shine(c, [[x - rx + 18, y - h + 50], [x - rx + 18, y - 60]], 8);
};
// a strainer (chalni): round mesh in a steel rim, a long handle to the right
const chalni = (c: Ctx, x: number, y: number, rx: number, ry: number, hl: number) => {
  shadow(c, x + 30, y + ry * 0.9, rx * 1.02, ry * 0.9);
  line(c, [[x + rx - 10, y], [x + rx + hl, y]], 34); line(c, [[x + rx - 10, y], [x + rx + hl, y]], 22, COL.steel);
  shape(c, () => ell(c, x, y, rx, ry), "#eef3f8", 0);
  c.save(); c.beginPath(); ell(c, x, y, rx, ry); c.clip(); c.strokeStyle = COL.steelDk; c.lineWidth = 2.5;
  for (let k = -rx; k <= rx; k += 20) { c.beginPath(); c.moveTo(x + k, y - ry); c.lineTo(x + k, y + ry); c.stroke(); }
  for (let k = -ry; k <= ry; k += 14) { c.beginPath(); c.moveTo(x - rx, y + k); c.lineTo(x + rx, y + k); c.stroke(); }
  c.restore();
  c.beginPath(); ell(c, x, y, rx, ry); c.strokeStyle = INK; c.lineWidth = 22; c.stroke(); c.strokeStyle = COL.steel; c.lineWidth = 11; c.stroke();
};
// a plastic mug with a handle on the right, centre (x, y), tilted by rot
const mug = (c: Ctx, x: number, y: number, w: number, h: number, rot: number, floor = true) => {
  if (floor) shadow(c, x + w * 0.1, y + h / 2 + 4, w * 0.62, w * 0.14);
  c.save(); c.translate(x, y); c.rotate(rot);
  c.beginPath(); c.arc(w / 2 - 6, 0, h * 0.27, -Math.PI / 2, Math.PI / 2); c.strokeStyle = INK; c.lineWidth = 32; c.stroke(); c.strokeStyle = COL.blueDk; c.lineWidth = 20; c.stroke();
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 18), COL.blue, 6);
  shade(c, () => rrect(c, -w / 2, -h / 2, w, h, 18), COL.blueDk, -w * 0.25, 0, 0.55);
  shine(c, [[-w / 2 + 16, -h / 2 + 40], [-w / 2 + 16, h / 2 - 30]], 8);
  shape(c, () => ell(c, 0, -h / 2, w / 2, w * 0.13), COL.waterDk, 6);
  shape(c, () => ell(c, -w * 0.1, -h / 2 - 2, w * 0.28, w * 0.05), COL.drop, 0);
  c.restore();
};

// ---------------------------------------------------------------- notebook things
const sunFrame = (c: Ctx, x: number, y: number, w: number, h: number, t: number) => {
  shape(c, () => rect(c, x, y, w, h), COL.sky, 5);
  shape(c, () => rect(c, x, y + h * 0.78, w, h * 0.22), COL.greenLt, 5);
  const sx = x + 14 + t * (w - 28), sy = y + h * 0.78 - 12 - Math.sin(Math.PI * t) * (h * 0.6);
  shape(c, () => ell(c, sx, sy, 15, 15), COL.yellow, 4);
};
const clockFace = (c: Ctx, x: number, y: number, r: number, hr: number, mn: number) => {
  shadow(c, x + r * 0.15, y + r * 0.2, r, r);
  shape(c, () => ell(c, x, y, r, r), WHITE, 7);
  shade(c, () => ell(c, x, y, r, r), "#cfd5de", -r * 0.2, -r * 0.2, 0.5);
  shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", 7);
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[x + Math.sin(a) * r * 0.78, y - Math.cos(a) * r * 0.78], [x + Math.sin(a) * r * 0.9, y - Math.cos(a) * r * 0.9]], Math.max(3, r * 0.04)); }
  line(c, [[x, y], [x + Math.sin(hr) * r * 0.5, y - Math.cos(hr) * r * 0.5]], Math.max(6, r * 0.09));
  line(c, [[x, y], [x + Math.sin(mn) * r * 0.75, y - Math.cos(mn) * r * 0.75]], Math.max(4, r * 0.06));
  shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), INK, 0);
};

// ================================================================ cards

// setup.e1.0
const e1_0 = (c: Ctx) => { balcony(c, { level: 0.3 }); };
// setup.e1.1
const e1_1 = (c: Ctx) => { balcony(c, { sun: true, level: 0.85, phone: true }); };
// setup.e1.2
const e1_2 = (c: Ctx) => { balcony(c, { sun: true, roof: true, level: 0.5 }); };

// setup.e2.0
const e2_0 = (c: Ctx) => {
  bathroom(c);
  dabba(c, 240, 800, 160, 300);
  tumbler(c, 560, 800, 72, 420);
  chalni(c, 790, 620, 120, 36, 110);
  mug(c, 850, 880, 130, 150, 0);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  bathroom(c);
  dabba(c, 250, 1010, 160, 250);
  tumbler(c, 600, 1010, 72, 280);
  chalni(c, 430, 560, 340, 56, 90);
  // rain through the mesh, only over the two containers
  for (const [x0, x1, yEnd] of [[140, 360, 745], [540, 660, 705]] as number[][])
    for (let x = x0; x <= x1; x += 40) for (const dy of [0, 55]) { const y0 = 620 + dy + ((x * 7) % 25); if (y0 + 40 < yEnd) { line(c, [[x, y0], [x, y0 + 40]], 14, INK); line(c, [[x, y0], [x, y0 + 40]], 7, COL.water); } }
  mug(c, 530, 330, 150, 170, -1.3, false);
  // the pouring stream
  const st = () => { c.beginPath(); c.moveTo(432, 370); c.bezierCurveTo(432, 430, 428, 480, 426, 535); };
  st(); c.strokeStyle = INK; c.lineWidth = 36; c.lineCap = "round"; c.stroke(); st(); c.strokeStyle = COL.water; c.lineWidth = 24; c.stroke();
  shape(c, () => ell(c, 426, 548, 46, 12), COL.drop, 4);
  handFlip(c, 576, 128, 1.75, 1.5);
  handFlip(c, 940, 560, Math.PI, 1.5);
  arrow(c, [[345, 390], [335, 440], [345, 495]]);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  bathroom(c);
  const y = 940, floor = y - 34, cm = 70, ws = floor - 1.2 * cm;
  // the dabba, with a window so the water inside shows
  const dx = 270, drx = 200, dh = 420, dry = drx * 0.2;
  shadow(c, dx + 30, y + 8, drx * 1.05, dry * 1.1);
  const b = () => body(c, dx, y, drx, dh);
  shape(c, b, COL.steel, 6); shade(c, b, COL.steelDk, -drx * 0.5, 0, 0.5);
  shape(c, () => ell(c, dx, y - dh, drx, dry), COL.steelIn, 6);
  shape(c, () => rrect(c, dx - drx + 34, y - dh + 40, drx * 2 - 68, floor - (y - dh + 40), 14), "#e3edf4", 5);
  c.save(); c.beginPath(); rrect(c, dx - drx + 34, y - dh + 40, drx * 2 - 68, floor - (y - dh + 40), 14); c.clip(); c.fillStyle = COL.water; c.fillRect(0, ws, 1080, floor - ws); c.fillStyle = COL.drop; c.fillRect(0, ws, 1080, 8); c.restore();
  shape(c, () => rrect(c, dx - drx + 34, y - dh + 40, drx * 2 - 68, floor - (y - dh + 40), 14), "rgba(0,0,0,0)", 5);
  // the narrow glass, water at the same height
  tumbler(c, 800, y, 90, 560, 0, y - ws);
  const ruler = (x: number) => {
    shape(c, () => rect(c, x - 28, floor - 6.4 * cm, 56, 6.4 * cm + 4), COL.wood, 5);
    for (let k = 0; k <= 12; k++) { const ty = floor - (k * cm) / 2; line(c, [[x - 28, ty], [x - 28 + (k % 2 ? 14 : 24), ty]], 3); }
    for (let k = 1; k <= 6; k++) write(c, String(k), x - 2, floor - k * cm - 12, 24, INK, 4);
  };
  ruler(330); ruler(800);
  c.setLineDash([22, 14]); line(c, [[100, ws], [905, ws]], 6, RED); c.setLineDash([]);
  write(c, "12 mm", 495, ws - 70, 46, INK, 7);
};

// setup.e3.0
const e3_0 = (c: Ctx) => {
  balcony(c, { roof: true, cx: 380, level: 0.3 });
  clockFace(c, 820, 520, 150, (10 / 12) * Math.PI * 2, 0);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rect(c, 90, 56, 170, 30), GRILL, 5);
  thermo(c, 175, 190, 560, 0.7, 56, 86);
  shape(c, () => rrect(c, 330, 90, 700, 880, 22), PAPER, 7);
  shade(c, () => rrect(c, 330, 90, 700, 880, 22), PAPERDK, -26, 0, 0.6);
  for (let k = 0; k < 6; k++) { shape(c, () => ell(c, 330, 150 + k * 140, 12, 12), COL.greyDk, 4); }
  const T = ["27", "29", "33", "35", "32", "28"];
  for (let i = 0; i < 6; i++) {
    const y0 = 130 + i * 128;
    sunFrame(c, 380, y0, 190, 100, (i + 0.5) / 6);
    write(c, T[i], 640, y0 + 12, 74, INK, 8);
    line(c, [[620, y0 + 112], [980, y0 + 112]], 3, COL.sky);
  }
  pencil(c, 770, 775, Math.PI + 0.9, 250);
  handFlip(c, 770 - Math.cos(Math.PI + 0.9) * 200, 775 - Math.sin(Math.PI + 0.9) * 200, Math.PI + 0.9, 1.4);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 50, 60, 980, 960, 22), PAPER, 7);
  c.strokeStyle = COL.sky; c.lineWidth = 3;
  for (let x = 110; x < 1000; x += 60) { c.beginPath(); c.moveTo(x, 90); c.lineTo(x, 990); c.stroke(); }
  for (let y = 120; y < 1000; y += 60) { c.beginPath(); c.moveTo(80, y); c.lineTo(1000, y); c.stroke(); }
  arrow(c, [[170, 860], [170, 170]], INK, 8); arrow(c, [[170, 860], [920, 860]], INK, 8);
  const P = [[270, 696], [390, 592], [510, 385], [630, 281], [750, 437], [870, 644]];
  for (const [x] of P) line(c, [[x, 848], [x, 872]], 6);
  line(c, P, 26, INK); line(c, P, 14, COL.blueDk);
  P.forEach(([x, y]) => shape(c, () => ell(c, x, y, 17, 17), WHITE, 6));
  thermo(c, 108, 130, 130, 0.6, 26);
  clockFace(c, 975, 860, 34, 0, 0);
  c.beginPath(); ell(c, 630, 281, 66, 58); c.strokeStyle = RED; c.lineWidth = 11; c.stroke();
  pencil(c, 705, 290, 2.2, 250);
  handFlip(c, 705 - Math.cos(2.2) * 200, 290 - Math.sin(2.2) * 200, 2.2, 1.5);
};

export const su_weatherWeather = cards("sci.weather.weather.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
