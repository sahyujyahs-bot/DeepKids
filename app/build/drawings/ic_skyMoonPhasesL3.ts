import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, person, write, cards } from "./flatKit";

// sci.sky.moon-phases.L3 · picture cards (flows, terms, explanations). Moon lit side is on the right
// when waxing and on the left when waning, as seen from India.
const NIGHT = "#34407e", NIGHT2 = "#27305e", MLIT = "#fff3c4", MDARK = "#4a4f80", MDARK_N = "#161b3d", PALE = "#aab4e6";
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => { const A = hex(a), B = hex(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
const stars = (c: Ctx, x0: number, y0: number, x1: number, y1: number, n: number, sd = 5) => {
  const r = rnd(sd);
  for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), s = 2.5 + r() * 3.5; c.beginPath(); ell(c, x, y, s, s); c.fillStyle = "#fff6c8"; c.fill(); }
};
const ring = (c: Ctx, x: number, y: number, r: number, col: string, w = 6) => { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.strokeStyle = col; c.lineWidth = w; c.stroke(); };
const dashedRing = (c: Ctx, x: number, y: number, r: number, col: string, w = 6, n = 48) => {
  for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2; c.beginPath(); c.arc(x, y, r, a, a + (Math.PI * 2) / n * 0.55); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke(); }
};
const dashed = (c: Ctx, x0: number, y0: number, x1: number, y1: number, col: string, w = 6, n = 20) => {
  for (let k = 0; k < n; k++) { const a = k / n, b = a + 0.6 / n; line(c, [[x0 + (x1 - x0) * a, y0 + (y1 - y0) * a], [x0 + (x1 - x0) * b, y0 + (y1 - y0) * b]], w, col); }
};
// the Moon seen from Earth: f = lit fraction (0 new .. 1 full); wax = lit on the right, else on the left
type MoonOpt = { dark?: string; lit?: string; rim?: string; lw?: number };
const moon = (c: Ctx, x: number, y: number, r: number, f: number, wax = true, o: MoonOpt = {}) => {
  const dark = o.dark ?? MDARK, lit = o.lit ?? MLIT;
  c.beginPath(); ell(c, x, y, r, r); c.fillStyle = dark; c.fill();
  c.save(); c.translate(x, y); if (!wax) c.scale(-1, 1); c.translate(-x, -y);
  if (f >= 0.999) { c.beginPath(); ell(c, x, y, r, r); c.fillStyle = lit; c.fill(); }
  else if (f > 0.001) {
    c.beginPath(); c.moveTo(x, y - r); c.arc(x, y, r, -Math.PI / 2, Math.PI / 2, false);
    const rx = r * Math.abs(1 - 2 * f);
    if (f < 0.5) c.ellipse(x, y, rx, r, 0, Math.PI / 2, -Math.PI / 2, true); else c.ellipse(x, y, rx, r, 0, Math.PI / 2, Math.PI * 1.5, false);
    c.closePath(); c.fillStyle = lit; c.fill();
  }
  c.restore();
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip();
  for (const [dx, dy, k] of [[-0.35, -0.3, 0.2], [0.3, 0.1, 0.26], [-0.1, 0.5, 0.15], [0.45, -0.45, 0.12]]) { c.beginPath(); ell(c, x + dx * r, y + dy * r, k * r, k * r); c.fillStyle = "rgba(90,85,120,0.16)"; c.fill(); }
  c.restore();
  ring(c, x, y, r, o.rim ?? INK, o.lw ?? Math.max(3, r * 0.05));
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6, p = (m: number, d: number) => [x + Math.cos(a + d) * r * m, y + Math.sin(a + d) * r * m]; shape(c, () => polyP(c, [p(1.05, -0.13), p(1.6, 0), p(1.05, 0.13)]), COL.orange, 4); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
const earth = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.blue, 0);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip();
  for (const [dx, dy, a, b, rot] of [[-0.3, -0.25, 0.4, 0.26, 0.5], [0.35, 0.2, 0.28, 0.42, 0.2], [-0.2, 0.6, 0.3, 0.16, 0]]) shape(c, () => ell(c, x + dx * r, y + dy * r, a * r, b * r, rot), COL.green, 0);
  c.restore();
  shade(c, () => ell(c, x, y, r, r), COL.blueDk, r * 0.28, r * 0.2, 0.45);
  shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", 6);
};
const ball = (c: Ctx, x: number, y: number, r: number, col: string, dk: string) => {
  shape(c, () => ell(c, x, y, r, r), col, 0); shade(c, () => ell(c, x, y, r, r), dk, r * 0.3, r * 0.2, 0.6); shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", 6);
};
const lamp = (c: Ctx, x: number, yt: number, h = 300) => {
  shadow(c, x + 20, yt + 4, 90, 14);
  shape(c, () => ell(c, x, yt - 10, 70, 16), COL.brown, 5);
  shape(c, () => rrect(c, x - 9, yt - h, 18, h - 6, 6), COL.brown, 5);
  c.beginPath(); ell(c, x, yt - h + 55, 120, 120); c.fillStyle = "rgba(255,230,120,0.4)"; c.fill();
  shape(c, () => ell(c, x, yt - h + 55, 40, 40), COL.yellow, 5);
  shape(c, () => polyP(c, [[x - 40, yt - h + 6], [x + 40, yt - h + 6], [x + 90, yt - h - 70], [x - 90, yt - h - 70]]), COL.red, 6);
};
const night = (c: Ctx, col = NIGHT, sd = 5, n = 40) => { ground(c, col); stars(c, 30, 30, 1050, 1050, n, sd); };
const hill = (c: Ctx, y: number, col: string) => { shape(c, () => { c.moveTo(0, y); c.quadraticCurveTo(540, y - 120, 1080, y); c.lineTo(1080, 1080); c.lineTo(0, 1080); c.closePath(); }, col, 0); };
const pageBox = (c: Ctx, x: number, y: number, w: number, h: number, col: string = COL.paper) => { shadow(c, x + w / 2 + 12, y + h + 8, w / 2, 16); shape(c, () => rrect(c, x, y, w, h, 18), col, 6); };
const tree = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => rrect(c, x - 12 * s, y - 90 * s, 24 * s, 90 * s, 6), COL.brown, 5); shape(c, () => ell(c, x, y - 140 * s, 70 * s, 62 * s), COL.leaf, 5); shape(c, () => ell(c, x + 40 * s, y - 100 * s, 45 * s, 40 * s), COL.leafDk, 5); };

// ---------------------------------------------------------------- flows
// e1: a ball held in front of a lamp, the child turning round
const e1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 20, 830, 260, 36, 10), COL.wood, 6); shape(c, () => rrect(c, 50, 866, 30, 130, 6), COL.woodDk, 5); shape(c, () => rrect(c, 220, 866, 30, 130, 6), COL.woodDk, 5);
  lamp(c, 140, 830, 290);
  shadow(c, 780, 990, 170, 26);
  person(c, 760, 990, 760, { armL: [Math.PI, Math.PI] });
  for (const dy of [-50, 0, 50]) line(c, [[200, 540 + dy * 0.1], [270, 450 + dy]], 5, "#f5c518");
  moon(c, 355, 450, 78, 0.5, false, { dark: "#6d6a9a", lit: "#fff3c4" });
  const pts: number[][] = []; for (let k = 0; k <= 8; k++) { const a = Math.PI * (1.12 + 0.095 * k); pts.push([760 + Math.cos(a) * 215, 330 + Math.sin(a) * 215]); }
  arrow(c, pts);
};
// e2: a small ball and a big ball, each throwing a shadow on a sheet
const e2 = (c: Ctx) => {
  ground(c);
  const panel = (yc: number, br: number, sr: number) => {
    shape(c, () => polyP(c, [[190, yc], [880, yc - 190], [880, yc + 190]]), "rgba(255,226,120,0.45)", 0);
    shape(c, () => polyP(c, [[430, yc - br], [880, yc - sr], [880, yc + sr], [430, yc + br]]), "rgba(43,35,64,0.55)", 0);
    shape(c, () => rrect(c, 868, yc - 200, 28, 400, 8), WHITE, 6);
    line(c, [[882, yc - sr], [882, yc + sr]], 14, INK);
    ball(c, 430, yc, br, COL.sky, COL.blueDk);
    shape(c, () => ell(c, 150, yc, 38, 38), COL.yellow, 5);
    shape(c, () => rrect(c, 134, yc + 36, 32, 50, 6), COL.brown, 5);
  };
  panel(290, 42, 62);
  panel(790, 105, 152);
  line(c, [[40, 540], [1040, 540]], 4, COL.grey);
};
// e3: the rising Moon and the high Moon are the same size
const e3 = (c: Ctx) => {
  ground(c);
  const bands = (x: number, y: number, w: number, h: number, a: string, b: string) => { for (let k = 0; k < 6; k++) { c.fillStyle = mix(a, b, k / 5); c.fillRect(x, y + (h * k) / 6, w, h / 6 + 1); } };
  const pan = (x: number, a: string, b: string) => { c.save(); c.beginPath(); rrect(c, x, 150, 440, 760, 24); c.clip(); bands(x, 150, 440, 760, a, b); c.restore(); shape(c, () => rrect(c, x, 150, 440, 760, 24), "rgba(0,0,0,0)", 6); };
  pan(40, "#f2a56b", "#ffd9a0"); pan(600, "#26306a", "#3c4a96");
  c.save(); c.beginPath(); rrect(c, 40, 150, 440, 760, 24); c.clip();
  c.fillStyle = "#3b2f4a"; c.fillRect(40, 800, 440, 110);
  moon(c, 260, 700, 150, 1, true, { lit: "#ff9a3c", rim: INK });
  shape(c, () => polyP(c, [[60, 800], [60, 740], [120, 700], [180, 740], [180, 800]]), "#2a2238", 0);
  shape(c, () => rrect(c, 400, 710, 60, 90, 4), "#2a2238", 0);
  c.restore();
  c.save(); c.beginPath(); rrect(c, 600, 150, 440, 760, 24); c.clip(); stars(c, 610, 160, 1030, 900, 16, 9);
  moon(c, 820, 420, 150, 1, true, { lit: "#fffbe6" });
  c.restore();
  ring(c, 260, 700, 168, RED, 9); ring(c, 820, 420, 168, RED, 9);
  line(c, [[500, 500], [580, 500]], 14, RED); line(c, [[500, 560], [580, 560]], 14, RED);
};
// a1: top view, a child walking round a chair, always facing it
const topChild = (c: Ctx, x: number, y: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => ell(c, 0, 0, 26, 62), CLOTH.child, 6);
  shape(c, () => ell(c, 8, 0, 38, 38), SKIN.child, 6);
  shape(c, () => ell(c, -6, 0, 34, 36), CLOTH.hair, 5);
  shape(c, () => polyP(c, [[44, -8], [58, 0], [44, 8]]), SKIN.childDk, 4);
  c.restore();
};
const a1 = (c: Ctx) => {
  ground(c, "#f1e3c2");
  dashedRing(c, 540, 540, 330, COL.greyDk, 6, 60);
  shadow(c, 560, 580, 120, 100);
  shape(c, () => rrect(c, 470, 470, 140, 140, 18), COL.wood, 6);
  shape(c, () => rrect(c, 460, 440, 160, 34, 10), COL.woodDk, 6);
  shape(c, () => rrect(c, 505, 446, 70, 22, 4), COL.yellow, 4);
  shape(c, () => ell(c, 540, 530, 14, 14), RED, 4);
  const pos: [number, number][] = [[Math.PI, 0], [-Math.PI / 2, 0], [0, 0], [Math.PI / 2, 0]];
  pos.forEach(([th]) => topChild(c, 540 + Math.cos(th) * 330, 540 + Math.sin(th) * 330, th + Math.PI));
  const arc = (a0: number, a1_: number) => { const p: number[][] = []; for (let k = 0; k <= 6; k++) { const a = a0 + ((a1_ - a0) * k) / 6; p.push([540 + Math.cos(a) * 330, 540 + Math.sin(a) * 330]); } arrow(c, p); };
  arc(-Math.PI / 2 + 0.3, -0.3); arc(Math.PI / 2 + 0.3, Math.PI - 0.3);
};
// a2: the Moon diary, an open notebook with a row of Moon sketches
const a2 = (c: Ctx) => {
  ground(c);
  shadow(c, 545, 840, 480, 30);
  shape(c, () => rrect(c, 60, 180, 960, 650, 22), COL.teal, 6);
  shape(c, () => rrect(c, 90, 210, 440, 590, 14), COL.paper, 5);
  shape(c, () => rrect(c, 550, 210, 440, 590, 14), COL.paper, 5);
  const fs = [0.06, 0.2, 0.35, 0.5, 0.65, 0.82, 1, 0.82, 0.62, 0.5, 0.3, 0.1];
  fs.forEach((f, i) => { const col = i % 2, row = Math.floor((i % 6) / 2), left = i < 6, x = (left ? 190 : 650) + col * 230, y = 330 + row * 190; moon(c, x, y, 62, f, left, {}); line(c, [[x - 55, y + 80], [x + 55, y + 80]], 4, COL.grey); });
  line(c, [[540, 215], [540, 800]], 6, INK);
  c.save(); c.translate(560, 930); c.rotate(-0.12);
  shape(c, () => polyP(c, [[-290, -26], [160, -26], [160, 26], [-290, 26]]), COL.yellow, 6);
  shape(c, () => polyP(c, [[160, -26], [250, 0], [160, 26]]), COL.wood, 6);
  shape(c, () => polyP(c, [[222, -9], [250, 0], [222, 9]]), INK, 2);
  shape(c, () => rrect(c, -330, -26, 40, 52, 10), COL.pink, 6);
  line(c, [[-290, -10], [160, -10]], 5, COL.orange);
  c.restore();
};
// a3: sun festivals and moon festivals on the calendar
const calendar = (c: Ctx, x: number, y: number, w: number, h: number, hh: number, rows: number, icon: (i: number, cx: number, cy: number, s: number) => void, nums = false) => {
  pageBox(c, x, y, w, h);
  shape(c, () => rrect(c, x, y, w, hh, 18), COL.red, 6);
  for (const bx of [x + w * 0.25, x + w * 0.75]) shape(c, () => rrect(c, bx - 10, y - 24, 20, 56, 8), COL.steel, 5);
  const cw = w / 7, ch = (h - hh) / rows;
  for (let r = 0; r < rows; r++) for (let k = 0; k < 7; k++) {
    const i = r * 7 + k, cx = x + k * cw, cy = y + hh + r * ch;
    c.beginPath(); c.rect(cx, cy, cw, ch); c.strokeStyle = COL.grey; c.lineWidth = 2.5; c.stroke();
    if (nums && i >= 2 && i - 1 <= 31) write(c, String(i - 1), cx + 10, cy + 10, 32, INK, 4);
    icon(i, cx + cw / 2, cy + ch / 2, Math.min(cw, ch) * 0.34);
  }
};
const a3 = (c: Ctx) => {
  ground(c);
  const sunIcon = (cx: number, cy: number, s: number) => { for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; line(c, [[cx + Math.cos(a) * s * 1.1, cy + Math.sin(a) * s * 1.1], [cx + Math.cos(a) * s * 1.6, cy + Math.sin(a) * s * 1.6]], 5, COL.orange); } shape(c, () => ell(c, cx, cy, s, s), COL.yellow, 4); };
  calendar(c, 140, 70, 800, 520, 110, 4, (i, cx, cy, s) => { if ([4, 12, 20].includes(i)) moon(c, cx, cy, s * 1.2, i === 12 ? 1 : i === 4 ? 0.15 : 0, true); if ([9, 24].includes(i)) sunIcon(cx, cy, s * 0.9); });
  shape(c, () => rrect(c, 140, 700, 340, 270, 16), WHITE, 6); sunIcon(310, 835, 70);
  shape(c, () => rrect(c, 600, 700, 340, 270, 16), WHITE, 6); moon(c, 770, 835, 85, 1, true);
  arrow(c, [[400, 600], [330, 690]]); arrow(c, [[680, 600], [760, 690]]);
};
// a4: the daytime Moon and the night Moon with earthshine
const a4 = (c: Ctx) => {
  ground(c);
  const clip = (x: number, fn: () => void) => { c.save(); c.beginPath(); rrect(c, x, 90, 470, 820, 26); c.clip(); fn(); c.restore(); shape(c, () => rrect(c, x, 90, 470, 820, 26), "rgba(0,0,0,0)", 6); };
  clip(50, () => { c.fillStyle = "#9ccbef"; c.fillRect(0, 0, D, D); hill(c, 760, COL.green); tree(c, 140, 800, 1.2); moon(c, 300, 320, 120, 0.5, true, { dark: "#a9d4f2", lit: "#fbfaf2", rim: "#e8f2fa", lw: 5 }); });
  clip(560, () => { c.fillStyle = NIGHT2; c.fillRect(0, 0, D, D); stars(c, 570, 100, 1020, 900, 22, 4); moon(c, 795, 470, 190, 0.1, true, { dark: "#6f78ab", lit: "#fff3c4", rim: "#c9d0f2", lw: 5 }); });
  arrow(c, [[300, 920], [540, 985], [790, 920]]);
};
// a5: a small planet crashes into the young Earth
const a5 = (c: Ctx) => {
  ground(c, NIGHT2); stars(c, 30, 30, 1050, 1050, 35, 2);
  ball(c, 690, 560, 260, "#e0763c", "#a8431f");
  const r = rnd(8);
  for (let i = 0; i < 6; i++) shape(c, () => ell(c, 560 + r() * 120, 560 - 160 + r() * 320, 14 + r() * 10, 12 + r() * 8, r() * 3), "#a8431f", 4);
  shape(c, () => { const n = 12; for (let k = 0; k < n * 2; k++) { const a = (k * Math.PI) / n, rr = k % 2 ? 70 : 140, px = 455 + Math.cos(a) * rr, py = 560 + Math.sin(a) * rr; k ? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); }, COL.yellow, 6);
  shape(c, () => ell(c, 455, 560, 55, 55), WHITE, 0);
  shape(c, () => polyP(c, [[120, 470], [60, 420], [140, 400], [70, 330], [190, 360], [170, 520]]), COL.red, 5);
  ball(c, 190, 490, 88, "#c9cdd8", "#7d8296");
  arrow(c, [[200, 640], [330, 700]], COL.yellow, 12);
};
// p1: the Moon wheel
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 548, 560, 360, 350);
  shape(c, () => ell(c, 540, 540, 370, 370), COL.paper, 6);
  for (let k = 0; k < 8; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 4, f = (1 - Math.cos((k * Math.PI) / 4)) / 2; moon(c, 540 + Math.cos(a) * 275, 540 + Math.sin(a) * 275, 58, f, k < 4, {}); }
  shape(c, () => ell(c, 540, 540, 160, 160), COL.teal, 6);
  shape(c, () => { c.moveTo(455, 540); c.lineTo(455, 265); c.arc(540, 265, 85, Math.PI, 0); c.lineTo(625, 540); c.closePath(); }, COL.teal, 6);
  ring(c, 540, 265, 70, INK, 8);
  moon(c, 540, 265, 62, 0, true, {});
  shape(c, () => ell(c, 540, 540, 36, 36), COL.yellow, 6); shape(c, () => ell(c, 540, 540, 12, 12), COL.orange, 4);
  { const p: number[][] = []; for (let k = 0; k <= 7; k++) { const a = -0.15 + k * 0.1; p.push([540 + Math.cos(a) * 435, 540 + Math.sin(a) * 435]); } arrow(c, p); }
};
// c1: twelve Moon months fall short of the Sun's year
const c1 = (c: Ctx) => {
  ground(c);
  for (let k = 0; k < 12; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 6, f = (1 - Math.cos((k * Math.PI) / 6)) / 2; moon(c, 250 + Math.cos(a) * 170, 300 + Math.sin(a) * 170, 42, f, k < 6, {}); }
  write(c, "354", 130, 560, 130, INK, 13);
  sun(c, 810, 300, 120);
  write(c, "365", 690, 560, 130, INK, 13);
  line(c, [[480, 270], [590, 270]], 14, RED); line(c, [[480, 330], [590, 330]], 14, RED); line(c, [[510, 360], [560, 240]], 12, RED);
  moon(c, 350, 880, 80, 1, true, {});
  write(c, "+", 480, 830, 100, RED, 14); write(c, "11", 580, 830, 100, RED, 14);
};

// ---------------------------------------------------------------- terms
const t0 = (c: Ctx) => {
  ground(c, NIGHT); stars(c, 30, 30, 1050, 1050, 30, 3);
  const fs: [number, boolean][] = [[0.12, true], [0.5, true], [0.8, true], [1, true], [0.8, false], [0.5, false], [0.12, false], [0, true]];
  fs.forEach(([f, w], i) => moon(c, 210 + (i % 4) * 220, i < 4 ? 340 : 740, 92, f, w, { dark: MDARK_N, rim: PALE, lw: 6 }));
  arrow(c, [[190, 530], [540, 530], [880, 530]], RED, 10);
};
const diya = (c: Ctx, x: number, y: number, s: number) => {
  c.beginPath(); ell(c, x, y - 8 * s, 16 * s, 24 * s); c.fillStyle = "rgba(255,200,80,0.45)"; c.fill();
  shape(c, () => { c.moveTo(x - 20 * s, y - 12 * s); c.quadraticCurveTo(x, y + 20 * s, x + 20 * s, y - 12 * s); c.closePath(); }, COL.orange, 4);
  shape(c, () => { c.moveTo(x - 7 * s, y - 14 * s); c.quadraticCurveTo(x, y - 46 * s, x + 7 * s, y - 14 * s); c.closePath(); }, COL.yellow, 3);
};
const t1 = (c: Ctx) => {
  ground(c, "#161b3a"); stars(c, 30, 30, 1050, 700, 45, 6);
  dashedRing(c, 540, 270, 118, "#6a739f", 6, 28);
  const roof = "#0d1026";
  shape(c, () => polyP(c, [[0, 640], [380, 640], [380, 1080], [0, 1080]]), roof, 0);
  shape(c, () => polyP(c, [[400, 560], [720, 560], [720, 1080], [400, 1080]]), "#12163a", 0);
  shape(c, () => polyP(c, [[740, 660], [1080, 660], [1080, 1080], [740, 1080]]), roof, 0);
  shape(c, () => { c.moveTo(500, 560); c.arc(560, 560, 60, Math.PI, 0); c.closePath(); }, "#12163a", 0);
  shape(c, () => rrect(c, 120, 520, 90, 120, 6), "#2b3a6a", 0);
  for (const x of [30, 100, 170, 240, 310]) diya(c, x + 20, 628, 1.1);
  for (const x of [420, 490, 560, 630]) diya(c, x + 40, 548, 1.1);
  for (const x of [770, 850, 930, 1010]) diya(c, x, 648, 1.1);
  for (const [x, y] of [[100, 800], [250, 860], [520, 780], [620, 900], [880, 820], [960, 950]]) shape(c, () => rrect(c, x - 20, y - 24, 40, 48, 6), "#ffd34d", 0);
};
const growRow = (c: Ctx, fs: number[], wax: boolean) => {
  ground(c, NIGHT); stars(c, 30, 30, 1050, 1050, 30, 12);
  fs.forEach((f, i) => moon(c, 140 + i * 200, 470, 90, f, wax, { dark: MDARK_N, rim: PALE, lw: 6 }));
  arrow(c, [[140, 740], [540, 740], [940, 740]], RED, 12);
};
const t6 = (c: Ctx) => growRow(c, [0.1, 0.3, 0.5, 0.78, 1], true);
const t7 = (c: Ctx) => growRow(c, [1, 0.78, 0.5, 0.3, 0.1], false);
const t8 = (c: Ctx) => {
  ground(c, NIGHT); stars(c, 30, 30, 1050, 1050, 25, 15);
  for (let i = 0; i < 29; i++) { const a = -Math.PI / 2 + (i * Math.PI * 2) / 29, f = (1 - Math.cos((i * Math.PI * 2) / 29)) / 2; moon(c, 540 + Math.cos(a) * 395, 540 + Math.sin(a) * 395, 34, f, i < 14.5, { dark: MDARK_N, rim: PALE, lw: 3 }); }
  write(c, "29", 400, 460, 170, MLIT, 16);
};
const t9 = (c: Ctx) => {
  ground(c);
  const marks: Record<number, number> = { 2: 0, 6: 0.18, 9: 0.5, 13: 0.8, 16: 1, 20: 0.8, 24: 0.5, 27: 0.18 };
  calendar(c, 100, 110, 880, 850, 130, 5, (i, cx, cy, s) => { if (i in marks) moon(c, cx + 14, cy + 22, s * 0.95, marks[i], i < 17, {}); }, true);
};
const t10 = (c: Ctx) => {
  ground(c);
  c.save(); c.beginPath(); ell(c, 540, 540, 420, 420); c.clip(); c.fillStyle = "#f6e7a8"; c.fillRect(540, 100, 500, 900); c.fillStyle = "#171c3c"; c.fillRect(100, 100, 440, 900); c.restore();
  shape(c, () => ell(c, 540, 540, 420, 420), "rgba(0,0,0,0)", 7);
  line(c, [[540, 120], [540, 960]], 4, INK);
  for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, f = (1 - Math.cos((k * Math.PI) / 5)) / 2, wax = k < 5; moon(c, 540 + Math.cos(a) * 310, 540 + Math.sin(a) * 310, 62, f, wax, wax ? {} : { dark: "#0c1030", rim: PALE }); }
  stars(c, 140, 300, 480, 780, 6, 21);
};
const t11 = (c: Ctx) => {
  ground(c, NIGHT); stars(c, 30, 30, 1050, 1050, 30, 17);
  earth(c, 540, 540, 125);
  dashedRing(c, 540, 540, 340, PALE, 6, 52);
  moon(c, 540 + Math.cos(-0.8) * 340, 540 + Math.sin(-0.8) * 340, 62, 1, true, { dark: MDARK_N });
  const p: number[][] = []; for (let k = 0; k <= 6; k++) { const a = -0.55 + k * 0.1; p.push([540 + Math.cos(a) * 340, 540 + Math.sin(a) * 340]); }
  arrow(c, p, RED, 12);
};
const t12 = (c: Ctx) => {
  ground(c, NIGHT); stars(c, 30, 30, 1050, 1050, 30, 19);
  dashedRing(c, 540, 540, 330, PALE, 6, 52);
  earth(c, 540, 540, 105);
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2, ux = Math.cos(a), uy = Math.sin(a), mx = 540 + ux * 330, my = 540 + uy * 330;
    const bx = mx - ux * 70, by = my - uy * 70, tx = mx - ux * 140, ty = my - uy * 140;
    moon(c, mx, my, 70, 1, true, { dark: MDARK_N });
    line(c, [[bx, by], [tx - ux * 80, ty - uy * 80]], 9, INK);
    const px = -uy, py = ux;
    shape(c, () => polyP(c, [[tx, ty], [tx + px * 60 - ux * 30, ty + py * 60 - uy * 30], [tx - ux * 80, ty - uy * 80]]), RED, 5);
  }
};
const t14 = (c: Ctx) => {
  ground(c, NIGHT2); stars(c, 30, 30, 1050, 1050, 30, 23);
  c.beginPath(); ell(c, 600, 480, 330, 330); c.fillStyle = "rgba(140,150,210,0.25)"; c.fill();
  moon(c, 600, 480, 290, 0.14, true, { dark: "#7b84b8", lit: "#fffbe6", rim: "#b9c1ee", lw: 5 });
  earth(c, 210, 820, 105);
  arrow(c, [[330, 770], [450, 700], [520, 640]], RED, 11);
};
const t18 = (c: Ctx) => {
  ground(c, "#cfe8f7");
  hill(c, 400, COL.greenLt);
  sun(c, 130, 120, 70);
  shape(c, () => polyP(c, [[470, 450], [545, 450], [930, 480], [860, 500]]), "rgba(43,35,64,0.5)", 0);
  shape(c, () => ell(c, 925, 480, 36, 26, 0.1), "rgba(43,35,64,0.5)", 0);
  person(c, 520, 470, 330);
  shape(c, () => rrect(c, 40, 600, 1000, 440, 26), NIGHT2, 6);
  stars(c, 60, 620, 1020, 1020, 20, 31);
  for (const dy of [-60, 0, 60]) line(c, [[170, 820 + dy], [360, 820 + dy * 0.5]], 7, COL.yellow);
  sun(c, 110, 820, 40);
  shape(c, () => polyP(c, [[470, 705], [980, 800], [470, 895]]), "#0a0d24", 0);
  earth(c, 470, 800, 98);
};
const t19 = (c: Ctx) => {
  ground(c, NIGHT); stars(c, 30, 30, 1050, 1050, 30, 41);
  const R = 400, ry = 130, sh = 110, ci = 0.95, cx = 540, cy = 540;
  const A = (t: number) => [cx + R * Math.cos(t), cy + ry * Math.sin(t)];
  const B = (t: number) => [cx + R * ci * Math.cos(t), cy + ry * Math.sin(t) - sh * Math.cos(t)];
  const path = (f: (t: number) => number[], t0_: number, t1_: number, col: string, w: number) => { const p: number[][] = []; for (let k = 0; k <= 40; k++) p.push(f(t0_ + ((t1_ - t0_) * k) / 40)); line(c, p, w + 12, INK); line(c, p, w, col); };
  path(B, Math.PI / 2, (3 * Math.PI) / 2, "#e6e3f2", 14);
  path(A, 0, Math.PI * 2, COL.yellow, 18);
  path(B, -Math.PI / 2, Math.PI / 2, "#e6e3f2", 14);
  earth(c, cx, cy, 68);
  const mp = B(-0.55); moon(c, mp[0], mp[1], 42, 1, true, { dark: MDARK_N });
  shape(c, () => ell(c, cx, cy - ry, 28, 28), COL.purple, 6); shape(c, () => ell(c, cx, cy + ry, 28, 28), COL.orange, 6);
};
const t20 = (c: Ctx) => {
  ground(c, NIGHT2); stars(c, 30, 30, 1050, 1050, 30, 13);
  ball(c, 760, 260, 170, "#e0763c", "#a8431f");
  ball(c, 200, 270, 70, "#f4c24c", COL.orange);
  shape(c, () => polyP(c, [[135, 240], [40, 230], [135, 290]]), COL.red, 4);
  arrow(c, [[300, 270], [420, 270], [570, 270]], WHITE, 12);
  line(c, [[40, 530], [1040, 530]], 4, PALE);
  ball(c, 330, 800, 140, "#e0763c", "#a8431f");
  const r = rnd(4);
  for (let i = 0; i < 16; i++) { const a = r() * Math.PI * 2, d = 195 + r() * 70; shape(c, () => ell(c, 330 + Math.cos(a) * d * 1.0, 800 + Math.sin(a) * d * 0.6, 9 + r() * 9, 8 + r() * 7, r() * 3), "#a8431f", 4); }
  ball(c, 850, 800, 68, "#c9cdd8", "#7d8296");
  arrow(c, [[600, 800], [700, 800], [770, 800]], WHITE, 12);
};
const t21 = (c: Ctx) => {
  ground(c);
  for (let k = 0; k < 3; k++) { pageBox(c, 130 + k * 22, 250 + k * 22, 640, 560); shape(c, () => rrect(c, 130 + k * 22, 250 + k * 22, 640, 90, 18), COL.red, 6); }
  c.save(); c.translate(720, 540); c.rotate(0.09);
  pageBox(c, -190, -260, 380, 520, "#e5f6f3"); shape(c, () => rrect(c, -190, -260, 380, 90, 18), COL.teal, 6);
  moon(c, 0, -20, 100, 0.2, true, {});
  write(c, "+", -48, 100, 100, RED, 14);
  c.restore();
  arrow(c, [[900, 250], [830, 300]], RED, 12);
};
const t22 = (c: Ctx) => {
  ground(c);
  c.save(); c.beginPath(); rrect(c, 40, 60, 1000, 960, 28); c.clip();
  for (let k = 0; k < 9; k++) { c.fillStyle = mix("#2a3270", "#f7b27a", k / 8); c.fillRect(0, 60 + k * 107, D, 108); }
  stars(c, 50, 70, 1030, 450, 18, 8);
  moon(c, 640, 690, 200, 1, true, { lit: "#ff9a3c" });
  moon(c, 880, 230, 58, 1, true, { lit: "#fffbe6", dark: "#fffbe6" });
  c.fillStyle = "#3b2f4a"; c.fillRect(0, 880, D, 200);
  for (const lx of [440, 470, 560, 590]) c.fillRect(lx, 710, 10, 180);
  shape(c, () => rrect(c, 410, 560, 210, 170, 14), "#6a7ea3", 6);
  shape(c, () => polyP(c, [[400, 565], [630, 565], [515, 520]]), COL.steelDk, 6);
  shape(c, () => polyP(c, [[60, 880], [60, 790], [190, 740], [320, 790], [320, 880]]), "#2a2238", 0);
  c.restore();
  shape(c, () => rrect(c, 40, 60, 1000, 960, 28), "rgba(0,0,0,0)", 6);
};

// ---------------------------------------------------------------- explanations
const x0 = (c: Ctx) => {
  ground(c, NIGHT); stars(c, 30, 30, 1050, 1050, 30, 51);
  sun(c, 140, 440, 80);
  for (const dy of [-110, 0, 110]) arrow(c, [[300, 440 + dy * 0.9], [380, 440 + dy * 0.9]], COL.yellow, 10);
  moon(c, 640, 440, 210, 0.5, false, { dark: MDARK_N, rim: PALE, lw: 8 });
  earth(c, 640, 960, 70);
  shape(c, () => { c.moveTo(572, 810); c.quadraticCurveTo(640, 760, 708, 810); c.quadraticCurveTo(640, 856, 572, 810); c.closePath(); }, WHITE, 5);
  shape(c, () => ell(c, 640, 810, 22, 22), COL.teal, 4); shape(c, () => ell(c, 640, 810, 9, 9), INK, 0);
  arrow(c, [[640, 760], [640, 680]], RED, 12);
};
const x1 = (c: Ctx) => {
  ground(c, NIGHT); stars(c, 30, 30, 1050, 1050, 25, 53);
  earth(c, 540, 540, 75);
  for (let i = 0; i < 8; i++) {
    const a = Math.PI - (i * Math.PI) / 4, f = (1 - Math.cos((i * Math.PI) / 4)) / 2, ux = Math.cos(a), uy = Math.sin(a);
    moon(c, 540 + ux * 235, 540 + uy * 235, 40, 0.5, false, { dark: MDARK_N, rim: PALE, lw: 4 });
    moon(c, 540 + ux * 390, 540 + uy * 390, 54, f, i < 4, { dark: MDARK_N, rim: PALE, lw: 4 });
  }
  dashedRing(c, 540, 540, 235, PALE, 3, 56);
  for (const dy of [-120, 0, 120]) arrow(c, [[26, 540 + dy], [100, 540 + dy]], COL.yellow, 8);
  const p: number[][] = []; for (let k = 0; k <= 5; k++) { const a = Math.PI - 0.5 - k * 0.2; p.push([540 + Math.cos(a) * 150, 540 + Math.sin(a) * 150]); }
  arrow(c, p, RED, 9);
};
const x2 = (c: Ctx) => {
  ground(c);
  shadow(c, 548, 560, 440, 440);
  c.save(); c.beginPath(); ell(c, 540, 540, 440, 440); c.clip(); c.fillStyle = "#26306a"; c.fillRect(0, 0, D, 540); c.fillStyle = "#fde08a"; c.fillRect(0, 540, D, 540); c.restore();
  shape(c, () => ell(c, 540, 540, 440, 440), "rgba(0,0,0,0)", 8);
  for (let h = 0; h < 24; h++) { const a = Math.PI / 2 + (h * Math.PI) / 12, r1 = 440 - (h % 6 ? 10 : 2); line(c, [[540 + Math.cos(a) * 412, 540 + Math.sin(a) * 412], [540 + Math.cos(a) * r1, 540 + Math.sin(a) * r1]], 4, h % 6 ? WHITE : INK); }
  const spot = (h: number, f: number, wax: boolean) => { const a = -Math.PI / 2 + (h * Math.PI) / 12; moon(c, 540 + Math.cos(a) * 320, 540 + Math.sin(a) * 320, 82, f, wax, { dark: MDARK_N, rim: INK, lw: 7 }); };
  spot(0, 0.5, false); spot(6, 0, true); spot(12, 0.5, true); spot(18, 1, true);
  sun(c, 540, 620, 38);
  shape(c, () => ell(c, 540, 450, 34, 34), "#fff3c4", 5); shape(c, () => ell(c, 556, 442, 30, 30), "#26306a", 0);
  const p: number[][] = []; for (let k = 0; k <= 6; k++) { const a = -Math.PI / 2 + 0.5 + k * 0.28; p.push([540 + Math.cos(a) * 170, 540 + Math.sin(a) * 170]); }
  arrow(c, p, RED, 10);
};
const x15 = (c: Ctx) => {
  ground(c);
  const row = (y: number, moonR: number, corona: boolean) => {
    shape(c, () => rrect(c, 50, y, 980, 300, 24), NIGHT2, 6);
    c.save(); c.beginPath(); rrect(c, 50, y, 980, 300, 24); c.clip();
    const cy = y + 150, cx = 540;
    if (corona) for (let k = 0; k < 16; k++) { const a = (k * Math.PI) / 8; shape(c, () => polyP(c, [[cx + Math.cos(a - 0.12) * 100, cy + Math.sin(a - 0.12) * 100], [cx + Math.cos(a) * 190, cy + Math.sin(a) * 190], [cx + Math.cos(a + 0.12) * 100, cy + Math.sin(a + 0.12) * 100]]), "rgba(255,255,255,0.8)", 0); }
    shape(c, () => ell(c, cx, cy, 100, 100), COL.yellow, 0);
    shape(c, () => ell(c, cx, cy, moonR, moonR), "#0a0d24", 0);
    if (moonR > 110) dashedRing(c, cx, cy, 100, COL.yellow, 6, 24);
    c.restore();
  };
  row(40, 128, false); row(390, 100, true); row(740, 62, false);
  arrow(c, [[300, 350], [300, 385]], RED, 9); arrow(c, [[300, 700], [300, 735]], RED, 9);
};
const x8 = (c: Ctx) => {
  ground(c, NIGHT); stars(c, 30, 30, 1050, 1050, 30, 57);
  sun(c, 120, 540, 75);
  dashed(c, 210, 540, 1040, 540, WHITE, 5, 28);
  line(c, [[240, 428], [800, 652]], 7, "#7fd8ff");
  shape(c, () => polyP(c, [[330, 462], [780, 330], [780, 410], [350, 500]]), "rgba(10,13,36,0.6)", 0);
  shape(c, () => polyP(c, [[520, 470], [920, 540], [520, 610]]), "rgba(10,13,36,0.7)", 0);
  earth(c, 520, 540, 72);
  moon(c, 320, 460, 40, 0.2, false, { dark: MDARK_N, rim: PALE });
  moon(c, 720, 620, 40, 1, true, {});
  arrow(c, [[230, 540], [330, 540]], COL.yellow, 8);
};

export const ic_skyMoonPhasesL3 = cards("sci.sky.moon-phases.L3 cards", [
  e1, e2, e3, a1, a2, a3, a4, a5, p1, c1,
  t0, t1, t6, t7, t8, t9, t10, t11, t12, t14, t18, t19, t20, t21, t22,
  x0, x1, x2, x15, x8,
]);
