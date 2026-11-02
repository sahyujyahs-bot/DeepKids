import type { Ctx } from "./core";
import { D, INK, RED, WHITE, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, hand, person, seed, cards } from "./flatKit";

// BODY: heart, blood, breath (L3) · picture cards for the intro, summary, activities and terms.

const COUNTER = "#e3cfa6", LUNG = "#f29ab4", LUNGDK = "#d9738f", HEARTC = "#e4523b", HEARTDK = "#b83a28";

const counter = (c: Ctx, yTop: number) => {
  c.fillStyle = COUNTER; c.fillRect(0, yTop, D, D - yTop);
  c.fillStyle = "#edddb9"; c.fillRect(0, yTop, D, 16);
  line(c, [[0, yTop], [D, yTop]], 6);
};
const clock = (c: Ctx, x: number, y: number, r: number, sec: number) => {
  shadow(c, x + r * 0.12, y + r * 1.02, r * 0.9, r * 0.14);
  line(c, [[x - r * 0.55, y + r * 0.85], [x - r * 0.72, y + r * 1.02]], 14); line(c, [[x + r * 0.55, y + r * 0.85], [x + r * 0.72, y + r * 1.02]], 14);
  shape(c, () => ell(c, x, y, r, r), COL.teal, 7);
  shade(c, () => ell(c, x, y, r, r), COL.tealDk, -r * 0.12, -r * 0.12, 0.7);
  shape(c, () => ell(c, x, y, r * 0.82, r * 0.82), COL.paper, 5);
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6, k = i % 3 === 0 ? 0.6 : 0.68; line(c, [[x + Math.cos(a) * r * k, y + Math.sin(a) * r * k], [x + Math.cos(a) * r * 0.76, y + Math.sin(a) * r * 0.76]], i % 3 === 0 ? 8 : 5); }
  line(c, [[x, y], [x + Math.cos(-2.2) * r * 0.42, y + Math.sin(-2.2) * r * 0.42]], 11); line(c, [[x, y], [x + Math.cos(0.1) * r * 0.62, y + Math.sin(0.1) * r * 0.62]], 8);
  line(c, [[x - Math.cos(sec) * r * 0.16, y - Math.sin(sec) * r * 0.16], [x + Math.cos(sec) * r * 0.72, y + Math.sin(sec) * r * 0.72]], 6, RED);
  shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), RED, 4);
};
const smooth = (c: Ctx, pts: number[][]) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
const straw = (c: Ctx, pts: number[][]) => { line(c, pts, 20, INK); line(c, pts, 11, COL.pink); };
const tube = (c: Ctx, pts: number[][]) => {
  c.lineCap = "round"; c.lineJoin = "round";
  smooth(c, pts); c.strokeStyle = INK; c.lineWidth = 30; c.stroke();
  smooth(c, pts); c.strokeStyle = COL.paper; c.lineWidth = 20; c.stroke();
  c.setLineDash([4, 9]); smooth(c, pts); c.strokeStyle = COL.grey; c.lineWidth = 18; c.stroke(); c.setLineDash([]);
};
const bubble = (c: Ctx, x: number, y: number, r: number) => { c.globalAlpha = 0.9; shape(c, () => ell(c, x, y, r, r), COL.drop, 3.5); c.globalAlpha = 1; };

// a heart: centre (x, y), half-width about s; vessels = true draws the tubes on top
const heartPath = (c: Ctx, x: number, y: number, s: number) => () => {
  c.moveTo(x, y + 0.95 * s); c.bezierCurveTo(x - 1.1 * s, y + 0.2 * s, x - 1.15 * s, y - 0.75 * s, x - 0.5 * s, y - 0.8 * s);
  c.bezierCurveTo(x - 0.2 * s, y - 0.82 * s, x - 0.05 * s, y - 0.65 * s, x, y - 0.45 * s);
  c.bezierCurveTo(x + 0.05 * s, y - 0.65 * s, x + 0.2 * s, y - 0.82 * s, x + 0.5 * s, y - 0.8 * s);
  c.bezierCurveTo(x + 1.15 * s, y - 0.75 * s, x + 1.1 * s, y + 0.2 * s, x, y + 0.95 * s); c.closePath();
};
const heart = (c: Ctx, x: number, y: number, s: number, vessels = false, col = HEARTC, dk = HEARTDK) => {
  if (vessels) {
    line(c, [[x - 0.3 * s, y - 0.6 * s], [x - 0.35 * s, y - 1.2 * s]], s * 0.36, INK); line(c, [[x - 0.3 * s, y - 0.6 * s], [x - 0.35 * s, y - 1.2 * s]], s * 0.36 - 10, COL.blue);
    const a = [[x + 0.2 * s, y - 0.6 * s], [x + 0.25 * s, y - 1.15 * s], [x + 0.8 * s, y - 1.2 * s], [x + 0.95 * s, y - 0.8 * s]];
    line(c, a, s * 0.36, INK); line(c, a, s * 0.36 - 10, col);
  }
  shape(c, heartPath(c, x, y, s), col, 6);
  shade(c, heartPath(c, x, y, s), dk, s * 0.2, s * 0.05, 0.55);
  shine(c, [[x - 0.7 * s, y - 0.35 * s], [x - 0.55 * s, y - 0.6 * s]], Math.max(5, s * 0.07));
};
// lungs with windpipe: centre-top of windpipe at (x, y), scale s (1 = about 480 px tall)
const lungs = (c: Ctx, x: number, y: number, s: number, big = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const lobe = (m: number) => () => { c.moveTo(m * 30, 110); c.bezierCurveTo(m * 170, 60, m * 215, 300 * big, m * 150, 390 * big); c.bezierCurveTo(m * 100, 440 * big, m * 40, 410 * big, m * 30, 350 * big); c.closePath(); };
  for (const m of [-1, 1]) { shape(c, lobe(m), LUNG, 7); shade(c, lobe(m), LUNGDK, m * -20, 0, 0.6); }
  line(c, [[0, 0], [0, 150]], 44, INK); line(c, [[0, 0], [0, 150]], 28, COL.steelIn);
  for (const m of [-1, 1]) { const b = [[0, 150], [m * 50, 200], [m * 95, 270 * big]]; line(c, b, 30, INK); line(c, b, 16, COL.steelIn); const d = [[m * 50, 200], [m * 110, 190]]; line(c, d, 22, INK); line(c, d, 10, COL.steelIn); }
  c.restore();
};
const cloud = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => { c.moveTo(x - 1.4 * s, y + 0.5 * s); c.bezierCurveTo(x - 2 * s, y + 0.4 * s, x - 1.9 * s, y - 0.5 * s, x - 1.1 * s, y - 0.4 * s); c.bezierCurveTo(x - 1.1 * s, y - 1.2 * s, x - 0.1 * s, y - 1.3 * s, x + 0.1 * s, y - 0.7 * s); c.bezierCurveTo(x + 0.5 * s, y - 1.3 * s, x + 1.5 * s, y - 1.0 * s, x + 1.3 * s, y - 0.2 * s); c.bezierCurveTo(x + 2 * s, y - 0.1 * s, x + 1.9 * s, y + 0.5 * s, x + 1.4 * s, y + 0.5 * s); c.closePath(); };
  shadow(c, x + 0.1 * s, y + 0.75 * s, 1.4 * s, 0.14 * s);
  shape(c, p, WHITE, 6); shade(c, p, "#c6d6e6", 0.2 * s, 0.25 * s, 0.7);
};
// a child's head and shoulders facing us, eyes closed; centre of head at (x, y), head radius r
const bust = (c: Ctx, x: number, y: number, r: number, open = false) => {
  const tor = () => rrect(c, x - r * 1.45, y + r * 1.25, r * 2.9, r * 2.4, r * 0.7);
  shape(c, tor, CLOTH.child); shade(c, tor, CLOTH.childDk, r * 0.3, 0, 0.6);
  shape(c, () => rrect(c, x - r * 0.25, y + r * 0.8, r * 0.5, r * 0.7, 10), SKIN.childDk, 5);
  shape(c, () => ell(c, x, y, r, r * 1.05), SKIN.child);
  shape(c, () => { c.moveTo(x - r * 1.03, y); c.bezierCurveTo(x - r, y - r * 1.55, x + r, y - r * 1.55, x + r * 1.03, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.03, y); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x + r * 0.95, y - r * 0.2, r * 0.3, r * 0.5), CLOTH.hair, 4);
  for (const s of [-1, 1]) { c.beginPath(); c.arc(x + s * r * 0.38, y + r * 0.1, r * 0.14, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
  c.globalAlpha = 0.5; for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.6, y + r * 0.4, r * 0.17, r * 0.12), COL.pink, 0); c.globalAlpha = 1;
  if (open) shape(c, () => ell(c, x, y + r * 0.55, r * 0.12, r * 0.15), INK, 0);
  else { c.beginPath(); c.arc(x, y + r * 0.42, r * 0.17, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
};

// ---------------------------------------------------------------- intro
const intro = (c: Ctx) => {
  ground(c);
  bust(c, 500, 380, 190);
  // the flat hand on the chest, a little to the left of the middle; the arm comes in from the right
  line(c, [[740, 690], [880, 790]], 120, INK); line(c, [[740, 690], [880, 790]], 106, CLOTH.child);
  hand(c, 760, 820, Math.PI, 2.3, SKIN.child, CLOTH.child, true);
  for (const r of [120, 175, 230]) { c.beginPath(); c.arc(560, 840, r, Math.PI - 0.75, Math.PI + 0.75); c.strokeStyle = RED; c.lineWidth = 9; c.lineCap = "round"; c.stroke(); }
};

// ---------------------------------------------------------------- summary
const summary = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 960, 360, 40);
  shape(c, () => rrect(c, 200, 120, 680, 820, 150), COL.paper, 7);
  lungs(c, 540, 190, 1.45);
  heart(c, 520, 640, 150);
  arrow(c, [[540, 60], [540, 170]]);
  arrow(c, [[380, 860], [300, 890]], RED, 10);
  arrow(c, [[660, 860], [740, 890]], RED, 10);
};

// ---------------------------------------------------------------- e1 : jumping heart
const e1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e3cfa6"; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 6);
  shadow(c, 270, 900, 130, 22); shadow(c, 800, 960, 110, 18);
  person(c, 270, 890, 520, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [Math.PI * 0.45, Math.PI * 0.5] });
  person(c, 800, 820, 520, { armL: [-2.3, -1.6], armR: [-0.85, -1.5] });
  heart(c, 270, 330, 60); heart(c, 800, 215, 100);
  for (const s of [-1, 1]) { line(c, [[800 + s * 120, 235], [800 + s * 160, 205]], 8, RED); line(c, [[800 + s * 128, 290], [800 + s * 175, 295]], 8, RED); }
  arrow(c, [[420, 660], [560, 660], [640, 660]]);
};

// ---------------------------------------------------------------- e2 : milky breath
const e2 = (c: Ctx) => {
  ground(c); counter(c, 760);
  glass(c, 290, 880, 270, 460, 0.72, "#a9d4f2");
  glass(c, 790, 880, 270, 460, 0.72, "#fffbe8");
  straw(c, [[400, 360], [320, 480], [300, 800]]);
  straw(c, [[900, 360], [820, 480], [800, 800]]);
  for (const [x, y, r] of [[770, 640, 22], [820, 560, 16], [790, 500, 12], [850, 700, 14], [750, 720, 10]]) bubble(c, x, y, r);
  arrow(c, [[400, 210], [400, 320]]);
  arrow(c, [[930, 190], [915, 320]]);
  arrow(c, [[455, 560], [630, 560]]);
};

// ---------------------------------------------------------------- e3 : upside-down bottle
const e3 = (c: Ctx) => {
  ground(c); counter(c, 700);
  // a basin of water
  shadow(c, 640, 960, 330, 36);
  shape(c, () => { c.moveTo(310, 640); c.lineTo(970, 640); c.lineTo(920, 940); c.lineTo(360, 940); c.closePath(); }, COL.steel, 6);
  shape(c, () => { c.moveTo(325, 700); c.lineTo(955, 700); c.lineTo(918, 925); c.lineTo(362, 925); c.closePath(); }, COL.water, 0);
  shape(c, () => ell(c, 640, 700, 315, 34), COL.waterDk, 5);
  // the bottle upside down: water at the bottom (the neck end is low)
  const bx = 700, body = () => { c.moveTo(bx - 130, 150); c.lineTo(bx + 130, 150); c.lineTo(bx + 130, 600); c.lineTo(bx + 50, 700); c.lineTo(bx + 50, 760); c.lineTo(bx - 50, 760); c.lineTo(bx - 50, 700); c.lineTo(bx - 130, 600); c.closePath(); };
  shape(c, body, COL.glass, 0);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(bx - 140, 330, 280, 460); c.restore();
  shape(c, () => ell(c, bx, 330, 130, 20), COL.drop, 4);
  shape(c, body, "rgba(0,0,0,0)", 6);
  shine(c, [[bx - 100, 190], [bx - 100, 540]], 9);
  // tube from the mouth under the bottle, up out of the basin to the child
  tube(c, [[bx, 800], [bx - 100, 860], [440, 780], [360, 580], [262, 545]]);
  for (const [x, y, r] of [[bx, 650, 18], [bx + 10, 560, 14], [bx - 10, 470, 22]]) bubble(c, x, y, r);
  arrow(c, [[bx, 600], [bx, 380]]);
  // a child blowing into the tube
  shape(c, () => rrect(c, 10, 660, 250, 420, 60), CLOTH.child);
  shape(c, () => ell(c, 140, 490, 115, 120), SKIN.child);
  shape(c, () => { c.moveTo(25, 490); c.bezierCurveTo(25, 340, 255, 340, 255, 490); c.quadraticCurveTo(140, 420, 25, 490); c.closePath(); }, CLOTH.hair, 5);
  for (const s of [-1, 1]) { c.beginPath(); c.arc(140 + s * 42, 490, 16, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
  shape(c, () => ell(c, 238, 548, 20, 20), INK, 0);
};

// ---------------------------------------------------------------- a2 : bottle lung
const a2 = (c: Ctx) => {
  ground(c);
  shadow(c, 520, 1040, 200, 22);
  const bx = 520, body = () => { c.moveTo(bx - 70, 130); c.lineTo(bx + 70, 130); c.lineTo(bx + 70, 230); c.bezierCurveTo(bx + 190, 270, bx + 190, 300, bx + 190, 340); c.lineTo(bx + 190, 820); c.lineTo(bx - 190, 820); c.lineTo(bx - 190, 340); c.bezierCurveTo(bx - 190, 300, bx - 190, 270, bx - 70, 230); c.closePath(); };
  shape(c, body, COL.glass, 6);
  shine(c, [[bx - 150, 380], [bx - 150, 740]], 10);
  // the lung balloon hangs inside from the neck, full of air
  line(c, [[bx, 60], [bx, 300]], 46, INK); line(c, [[bx, 60], [bx, 300]], 32, LUNG);
  shape(c, () => ell(c, bx, 520, 120, 190), LUNG, 6); shade(c, () => ell(c, bx, 520, 120, 190), LUNGDK, 30, 10, 0.6);
  shape(c, () => rrect(c, bx - 82, 118, 164, 30, 10), COL.yellow, 6);
  // the stretched balloon over the open bottom, pulled down by its knob
  shape(c, () => { c.moveTo(bx - 190, 800); c.lineTo(bx + 190, 800); c.lineTo(bx + 30, 900); c.lineTo(bx - 30, 900); c.closePath(); }, COL.blue, 6);
  shape(c, () => ell(c, bx, 915, 36, 30), COL.blue, 6);
  hand(c, bx - 150, 925, 0, 1.4, SKIN.child, CLOTH.child);
  arrow(c, [[bx + 270, 700], [bx + 270, 960]]);
  arrow(c, [[bx + 130, 30], [bx + 130, 110]]);
};

// ---------------------------------------------------------------- a3 : squeeze like a heart
const ball = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 1.05, r * 0.9, r * 0.12);
  shape(c, () => ell(c, x, y, r, r), "#d6e84a", 6);
  shade(c, () => ell(c, x, y, r, r), "#a8be2a", r * 0.3, r * 0.2, 0.6);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip();
  for (const s of [-1, 1]) { c.beginPath(); c.arc(x + s * r * 1.35, y, r * 1.0, 0, Math.PI * 2); c.strokeStyle = WHITE; c.lineWidth = 8; c.stroke(); }
  c.restore(); c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
const a3 = (c: Ctx) => {
  ground(c);
  clock(c, 820, 260, 150, 0.4);
  ball(c, 440, 600, 150);
  hand(c, 180, 600, 0, 2.3, SKIN.child, CLOTH.child);
  arrow(c, [[440, 380], [440, 440]]);
  arrow(c, [[440, 830], [440, 770]]);
  heart(c, 820, 780, 100);
  for (const s of [-1, 1]) { line(c, [[820 + s * 130, 740], [820 + s * 175, 715]], 8, RED); line(c, [[820 + s * 130, 800], [820 + s * 175, 810]], 8, RED); }
};

// ---------------------------------------------------------------- a4 : pulse watcher
const a4 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 900, 440, 30);
  shape(c, () => rrect(c, 20, 560, 220, 300, 40), CLOTH.child); shade(c, () => rrect(c, 20, 560, 220, 300, 40), CLOTH.childDk, -30, 0, 0.6);
  // forearm palm up, wrist then a relaxed hand
  const arm = () => { c.moveTo(200, 580); c.lineTo(560, 610); c.bezierCurveTo(680, 590, 930, 570, 1000, 650); c.bezierCurveTo(1030, 720, 960, 780, 880, 790); c.bezierCurveTo(780, 820, 650, 830, 560, 800); c.lineTo(200, 850); c.closePath(); };
  shape(c, arm, SKIN.child, 6); shade(c, arm, SKIN.childDk, 10, 30, 0.5);
  line(c, [[690, 640], [940, 640]], 4, SKIN.childDk); line(c, [[700, 720], [930, 700]], 4, SKIN.childDk);
  shape(c, () => ell(c, 540, 640, 90, 26), SKIN.childDk, 0);
  shape(c, () => ell(c, 760, 585, 110, 38, -0.25), SKIN.child, 6);
  // dough and toothpick on the wrist
  shape(c, () => ell(c, 460, 700, 58, 48), "#e9c58f", 6);
  shade(c, () => ell(c, 460, 700, 58, 48), "#c49a62", 14, 14, 0.6);
  line(c, [[460, 690], [455, 220]], 20, INK); line(c, [[460, 690], [455, 220]], 10, COL.wood);
  line(c, [[455, 235], [455, 190]], 10, INK);
  for (const s of [-1, 1]) { c.beginPath(); c.arc(455, 215, 85, -Math.PI / 2 + s * 0.45, -Math.PI / 2 + s * 1.0, s < 0); c.strokeStyle = RED; c.lineWidth = 9; c.lineCap = "round"; c.stroke(); }
  heart(c, 840, 310, 90);
};

// ---------------------------------------------------------------- a5 : cooling cloud
const a5 = (c: Ctx) => {
  ground(c);
  bust(c, 330, 430, 190, true);
  cloud(c, 760, 380, 130);
  arrow(c, [[480, 560], [560, 520], [610, 420]]);
  heart(c, 780, 760, 90);
};

// ---------------------------------------------------------------- a6 : a jar of blood
const a6 = (c: Ctx) => {
  ground(c); counter(c, 880);
  glass(c, 540, 960, 520, 700, 0.85, "#f8e08a");
  const r = (n: number) => { let s = n; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
  const rd = r(5);
  for (let i = 0; i < 46; i++) { const x = 340 + rd() * 400, y = 480 + rd() * 400; seed(c, x, y, 28, rd() * 3, false, "#b3261e", "#7d1812"); }
  seed(c, 560, 540, 46, 0.4, false, "#fffaf0", "#d8cfbd");
  for (let i = 0; i < 10; i++) { const x = 340 + rd() * 400, y = 520 + rd() * 360; shape(c, () => ell(c, x, y, 9, 5, rd() * 3), "#e8d9b0", 3); }
};

// ---------------------------------------------------------------- p1 : family heart map
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 950, 450, 30);
  shape(c, () => rrect(c, 90, 90, 900, 850, 24), COL.paper, 7);
  line(c, [[170, 620], [910, 620]], 8);
  const bars: [number, number, string][] = [[290, 380, COL.orange], [540, 300, COL.teal], [790, 220, COL.blue]];
  bars.forEach(([x, h, col]) => { shape(c, () => rrect(c, x - 70, 620 - h, 140, h, 10), col, 6); heart(c, x, 620 - h - 70, 50); });
  person(c, 290, 910, 190); person(c, 540, 910, 240); person(c, 790, 910, 290, { adult: true });
};

// ---------------------------------------------------------------- c1 : one-way pump
const bowlWater = (c: Ctx, x: number, y: number, r: number, water: boolean) => {
  shadow(c, x + 10, y + r * 0.75, r * 0.9, r * 0.14);
  const b = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.9, y + r * 0.85, x + r * 0.9, y + r * 0.85, x + r, y); c.closePath(); };
  shape(c, b, COL.steel); shade(c, b, COL.steelDk, r * 0.3, 0, 0.6);
  shape(c, () => ell(c, x, y, r, r * 0.22), water ? COL.water : COL.steelIn, 5);
  if (water) shine(c, [[x - r * 0.5, y - 4], [x - r * 0.2, y + 2]], 7);
};
const c1 = (c: Ctx) => {
  ground(c); counter(c, 760);
  bowlWater(c, 190, 740, 170, true);
  bowlWater(c, 890, 740, 170, false);
  tube(c, [[210, 760], [250, 560], [380, 500]]);
  tube(c, [[690, 420], [820, 480], [880, 700]]);
  const bt = () => rrect(c, 380, 380, 310, 380, 70);
  shadow(c, 540, 770, 190, 22);
  shape(c, bt, COL.teal); shade(c, bt, COL.tealDk, -50, 0, 0.6);
  hand(c, 540, 190, Math.PI / 2, 1.6, SKIN.adult, CLOTH.adult, false);
  arrow(c, [[130, 560], [165, 470], [290, 410]]);
  arrow(c, [[760, 380], [880, 430], [950, 560]]);
};

// ---------------------------------------------------------------- terms
const termLungs = (c: Ctx) => { ground(c); shadow(c, 540, 930, 330, 30); lungs(c, 540, 130, 1.6); };

const termAirSacs = (c: Ctx) => {
  ground(c);
  line(c, [[540, 80], [540, 380]], 52, INK); line(c, [[540, 80], [540, 380]], 36, COL.steelIn);
  const br: number[][][] = [[[540, 380], [380, 470]], [[540, 380], [700, 470]]];
  br.forEach((b) => { line(c, b, 40, INK); line(c, b, 24, COL.steelIn); });
  const sacs = (cx: number, cy: number) => {
    const pts: [number, number, number][] = [[0, 0, 70], [-85, 40, 56], [85, 40, 56], [-40, 105, 56], [45, 100, 60], [0, 30, 50]];
    pts.forEach(([dx, dy, r]) => { shape(c, () => ell(c, cx + dx, cy + dy, r, r), LUNG, 6); });
    pts.forEach(([dx, dy, r]) => { c.beginPath(); c.arc(cx + dx, cy + dy, r * 0.55, 0.5, 2.6); c.strokeStyle = RED; c.lineWidth = 5; c.stroke(); });
  };
  line(c, [[380, 470], [330, 560]], 30, INK); line(c, [[380, 470], [330, 560]], 16, COL.steelIn);
  line(c, [[380, 470], [450, 570]], 30, INK); line(c, [[380, 470], [450, 570]], 16, COL.steelIn);
  line(c, [[700, 470], [650, 570]], 30, INK); line(c, [[700, 470], [650, 570]], 16, COL.steelIn);
  line(c, [[700, 470], [770, 560]], 30, INK); line(c, [[700, 470], [770, 560]], 16, COL.steelIn);
  sacs(300, 600); sacs(460, 650); sacs(640, 650); sacs(800, 600);
  arrow(c, [[540, 130], [540, 330]], RED, 10);
};

const termDiaphragm = (c: Ctx) => {
  ground(c);
  const half = (cx: number, tight: boolean) => {
    shape(c, () => rrect(c, cx - 230, 120, 460, 780, 90), COL.paper, 6);
    const ry = tight ? 270 : 190, cy = 170 + ry;
    for (const m of [-1, 1]) shape(c, () => ell(c, cx + m * 100, cy, 90, ry), LUNG, 6);
    const dome = () => { c.beginPath(); if (tight) { c.moveTo(cx - 225, 700); c.quadraticCurveTo(cx, 725, cx + 225, 700); } else { c.moveTo(cx - 225, 700); c.quadraticCurveTo(cx, 420, cx + 225, 700); } };
    dome(); c.strokeStyle = INK; c.lineWidth = 40; c.lineCap = "round"; c.stroke();
    dome(); c.strokeStyle = HEARTC; c.lineWidth = 26; c.stroke();
  };
  half(290, false); half(790, true);
  arrow(c, [[790, 780], [790, 860]], RED, 10);
};

const termValve = (c: Ctx) => {
  ground(c);
  const pipe = (y: number) => { shape(c, () => rrect(c, 60, y, 960, 200, 40), COL.sky, 6); };
  const flap = (a: number[], b: number[]) => { line(c, [a, b], 30, INK); line(c, [a, b], 18, COL.yellow); };
  pipe(110);
  flap([520, 125], [650, 165]); flap([520, 295], [650, 255]);
  arrow(c, [[120, 210], [420, 210]], RED, 12);
  arrow(c, [[720, 210], [980, 210]], RED, 12);
  pipe(560);
  flap([520, 575], [620, 660]); flap([520, 745], [620, 664]);
  arrow(c, [[980, 660], [700, 660]], RED, 12);
  line(c, [[430, 610], [470, 710]], 12, RED); line(c, [[470, 610], [430, 710]], 12, RED);
};

const termCirculation = (c: Ctx) => {
  ground(c);
  heart(c, 540, 560, 120);
  lungs(c, 190, 130, 0.8);
  person(c, 890, 920, 560);
  arrow(c, [[440, 470], [360, 410]], RED, 10);
  arrow(c, [[350, 520], [430, 590]], RED, 10);
  arrow(c, [[650, 500], [740, 500]], RED, 10);
  arrow(c, [[740, 630], [650, 630]], RED, 10);
};

export const ic_bodyHeartBloodBreathL3 = cards("sci.body.heart-blood-breath.L3 cards", [
  intro, summary, e1, e2, e3, a2, a3, a4, a5, a6, p1, c1, termLungs, termAirSacs, termDiaphragm, termValve, termCirculation,
]);
void glass; void clock; void WHITE;
