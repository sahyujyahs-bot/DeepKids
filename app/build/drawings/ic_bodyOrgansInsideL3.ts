import type { Ctx } from "./core";
import { D, INK, RED, WHITE, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, hand, write, cards } from "./flatKit";

// BODY: organs inside (L3) · picture cards for the intro, summary, experiments, activities, project, challenges and terms.

const LUNG = "#f29ab4", LUNGDK = "#d9738f", HEARTC = "#e4523b", HEARTDK = "#b83a28", BRAIN = "#f6a9bd", BRAINDK = "#c4647f";
const STOM = "#f0a08a", GUT = "#f4b86a", GUTDK = "#d98a54", BONE = "#f5f0e4", BONEDK = "#cfc6b0", SKINT = "#fbe6d0", FLOOR = "#e3cfa6";

const smooth = (c: Ctx, pts: number[][]) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
const tube = (c: Ctx, pts: number[][], w: number, col: string) => { c.lineCap = "round"; c.lineJoin = "round"; smooth(c, pts); c.strokeStyle = INK; c.lineWidth = w + 10; c.stroke(); smooth(c, pts); c.strokeStyle = col; c.lineWidth = w; c.stroke(); };
const counter = (c: Ctx, yTop: number) => { c.fillStyle = FLOOR; c.fillRect(0, yTop, D, D - yTop); c.fillStyle = "#edddb9"; c.fillRect(0, yTop, D, 16); line(c, [[0, yTop], [D, yTop]], 6); };
const blob = (c: Ctx, cs: number[][], fill: string) => { for (const [x, y, r] of cs) shape(c, () => ell(c, x, y, r, r), fill, 12); for (const [x, y, r] of cs) shape(c, () => ell(c, x, y, r, r), fill, 0); };

// ---------------------------------------------------------------- organs (all scaled from a point)
const heartPath = (c: Ctx, x: number, y: number, s: number) => () => {
  c.moveTo(x, y + 0.95 * s); c.bezierCurveTo(x - 1.1 * s, y + 0.2 * s, x - 1.15 * s, y - 0.75 * s, x - 0.5 * s, y - 0.8 * s);
  c.bezierCurveTo(x - 0.2 * s, y - 0.82 * s, x - 0.05 * s, y - 0.65 * s, x, y - 0.45 * s);
  c.bezierCurveTo(x + 0.05 * s, y - 0.65 * s, x + 0.2 * s, y - 0.82 * s, x + 0.5 * s, y - 0.8 * s);
  c.bezierCurveTo(x + 1.15 * s, y - 0.75 * s, x + 1.1 * s, y + 0.2 * s, x, y + 0.95 * s); c.closePath();
};
const heart = (c: Ctx, x: number, y: number, s: number, vessels = false) => {
  if (vessels) {
    line(c, [[x - 0.3 * s, y - 0.6 * s], [x - 0.35 * s, y - 1.2 * s]], s * 0.36, INK); line(c, [[x - 0.3 * s, y - 0.6 * s], [x - 0.35 * s, y - 1.2 * s]], s * 0.36 - 10, COL.blue);
    const a = [[x + 0.2 * s, y - 0.6 * s], [x + 0.25 * s, y - 1.15 * s], [x + 0.8 * s, y - 1.2 * s], [x + 0.95 * s, y - 0.8 * s]];
    line(c, a, s * 0.36, INK); line(c, a, s * 0.36 - 10, HEARTC);
  }
  shape(c, heartPath(c, x, y, s), HEARTC, Math.max(4, s * 0.05));
  shade(c, heartPath(c, x, y, s), HEARTDK, s * 0.2, s * 0.05, 0.55);
  shine(c, [[x - 0.7 * s, y - 0.35 * s], [x - 0.55 * s, y - 0.6 * s]], Math.max(4, s * 0.07));
};
const lungs = (c: Ctx, x: number, y: number, s: number, big = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const lobe = (m: number) => () => { c.moveTo(m * 30, 110); c.bezierCurveTo(m * 170, 60, m * 215, 300 * big, m * 150, 390 * big); c.bezierCurveTo(m * 100, 440 * big, m * 40, 410 * big, m * 30, 350 * big); c.closePath(); };
  for (const m of [-1, 1]) { shape(c, lobe(m), LUNG, 7); shade(c, lobe(m), LUNGDK, m * -20, 0, 0.6); }
  line(c, [[0, 0], [0, 150]], 44, INK); line(c, [[0, 0], [0, 150]], 28, COL.steelIn);
  for (const m of [-1, 1]) { const b = [[0, 150], [m * 50, 200], [m * 95, 270 * big]]; line(c, b, 30, INK); line(c, b, 16, COL.steelIn); }
  c.restore();
};
const brain = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => rrect(c, -20, 60, 40, 100, 18), COL.pink, 8);
  blob(c, [[-95, 5, 70], [-45, -40, 78], [25, -48, 78], [90, -5, 72], [-70, 50, 62], [0, 55, 72], [65, 50, 60]], BRAIN);
  const f = BRAINDK;
  for (const p of [[[-85, -5], [-50, 15], [-70, 45]], [[-35, -70], [-5, -35], [-30, -5], [15, 10]], [[40, -80], [65, -40], [30, -20]], [[95, -25], [65, 5], [95, 30]], [[0, 45], [30, 25], [55, 50]], [[-50, 70], [-20, 45]], [[-100, -30], [-75, -50]]]) { smooth(c, p); c.strokeStyle = f; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
  shine(c, [[-100, -30], [-75, -62]], 10);
  c.restore();
};
const stomach = (c: Ctx, x: number, y: number, s: number, pipe = true) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const body = () => { c.moveTo(-60, -130); c.bezierCurveTo(10, -150, 130, -100, 150, 10); c.bezierCurveTo(175, 120, 80, 185, -10, 175); c.bezierCurveTo(-110, 165, -150, 70, -120, -30); c.bezierCurveTo(-110, -80, -90, -110, -60, -130); c.closePath(); };
  if (pipe) { tube(c, [[-70, -250], [-70, -190], [-62, -120]], 44, "#e58f8f"); tube(c, [[110, 150], [190, 210], [250, 190]], 34, GUT); }
  shape(c, body, STOM, 8); shade(c, body, "#cf7a66", 30, 15, 0.6);
  for (const p of [[[-60, -40], [0, -10], [60, -50]], [[-70, 30], [0, 60], [80, 20]], [[-40, 100], [20, 120], [80, 90]]]) { smooth(c, p); c.strokeStyle = "#cf7a66"; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); }
  shine(c, [[-100, 20], [-85, -50]], 10);
  c.restore();
};
const guts = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  tube(c, [[-170, 190], [-170, -110], [-100, -175], [100, -175], [170, -110], [170, 190]], 56, GUTDK);
  tube(c, [[-110, -100], [110, -90], [-110, -50], [110, -40], [-110, 0], [110, 10], [-110, 55], [110, 65], [-110, 110], [0, 140]], 36, GUT);
  c.restore();
};
const skull = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => rrect(c, -90, 60, 180, 110, 36), BONE, 8);
  shape(c, () => ell(c, 0, -20, 155, 150), BONE, 8);
  shade(c, () => ell(c, 0, -20, 155, 150), BONEDK, 30, 15, 0.7);
  for (const m of [-1, 1]) shape(c, () => ell(c, m * 60, 0, 40, 46), INK, 0);
  shape(c, () => polyP(c, [[0, 45], [-18, 80], [18, 80]]), INK, 0);
  for (let k = -2; k <= 2; k++) line(c, [[k * 30, 110], [k * 30, 155]], 5);
  line(c, [[-75, 110], [75, 110]], 5);
  c.restore();
};
const ribs = (c: Ctx, x: number, y: number, s: number, bone = BONE, ink = INK, spine = true) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (let k = 0; k < 6; k++) for (const m of [-1, 1]) {
    const yy = k * 70, w = 215 - k * 12;
    const p = [[0, yy], [m * w * 0.9, yy - 30], [m * w, yy + 60], [m * (w - 25), yy + 120]];
    c.beginPath(); c.moveTo(p[0][0], p[0][1]); c.quadraticCurveTo(m * w * 1.05, yy - 50, p[2][0], p[2][1]); c.quadraticCurveTo(p[2][0], p[2][1] + 40, p[3][0], p[3][1]);
    c.lineCap = "round"; c.strokeStyle = ink; c.lineWidth = 30; c.stroke(); c.strokeStyle = bone; c.lineWidth = 17; c.stroke();
  }
  shape(c, () => rrect(c, -22, -10, 44, 360, 20), bone, 6);
  if (spine) line(c, [[-60, -40], [60, -40]], 0);
  c.restore();
};
const bust = (c: Ctx, x: number, y: number, r: number) => {
  const tor = () => rrect(c, x - r * 1.45, y + r * 1.25, r * 2.9, r * 2.4, r * 0.7);
  shape(c, tor, CLOTH.child); shade(c, tor, CLOTH.childDk, r * 0.3, 0, 0.6);
  shape(c, () => rrect(c, x - r * 0.25, y + r * 0.8, r * 0.5, r * 0.7, 10), SKIN.childDk, 5);
  shape(c, () => ell(c, x, y, r, r * 1.05), SKIN.child);
  shape(c, () => { c.moveTo(x - r * 1.03, y); c.bezierCurveTo(x - r, y - r * 1.55, x + r, y - r * 1.55, x + r * 1.03, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.03, y); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x + r * 0.95, y - r * 0.2, r * 0.3, r * 0.5), CLOTH.hair, 4);
  for (const s of [-1, 1]) { c.beginPath(); c.arc(x + s * r * 0.38, y + r * 0.1, r * 0.14, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
  c.beginPath(); c.arc(x, y + r * 0.42, r * 0.17, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
// the see-through child: top of head at topY, centre x, scale s (1 = about 670 px tall)
const body = (c: Ctx, cx: number, topY: number, s: number, fill = SKINT) => {
  shape(c, () => rrect(c, cx - 35 * s, topY + 160 * s, 70 * s, 60 * s, 10), fill, 6);
  shape(c, () => rrect(c, cx - 165 * s, topY + 190 * s, 330 * s, 480 * s, 120 * s), fill, 7);
  shape(c, () => ell(c, cx, topY + 90 * s, 90 * s, 94 * s), fill, 7);
};
const organsIn = (c: Ctx, cx: number, topY: number, s: number, o: { gut?: boolean; labelless?: boolean } = {}) => {
  brain(c, cx, topY + 78 * s, 0.4 * s);
  lungs(c, cx, topY + 170 * s, 0.62 * s);
  heart(c, cx + 30 * s, topY + 345 * s, 52 * s);
  stomach(c, cx + 52 * s, topY + 470 * s, 0.3 * s, false);
  if (o.gut) guts(c, cx - 5 * s, topY + 565 * s, 0.22 * s);
};
const seeThrough = (c: Ctx, cx: number, topY: number, s: number) => { body(c, cx, topY, s); organsIn(c, cx, topY, s); };
const faceOn = (c: Ctx, cx: number, topY: number, s: number) => {
  for (const m of [-1, 1]) { c.beginPath(); c.arc(cx + m * 32 * s, topY + 104 * s, 8 * s, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
};
const hairOn = (c: Ctx, cx: number, topY: number, s: number) => {
  shape(c, () => { const r = 90 * s, y = topY + 90 * s; c.moveTo(cx - r * 1.03, y - 10 * s); c.bezierCurveTo(cx - r, y - r * 1.55, cx + r, y - r * 1.55, cx + r * 1.03, y - 10 * s); c.quadraticCurveTo(cx, y - r * 0.8, cx - r * 1.03, y - 10 * s); c.closePath(); }, CLOTH.hair, 5);
};
const bag = (c: Ctx, x: number, y: number, w: number, h: number, water: number) => {
  shadow(c, x + 14, y + h + 6, w * 0.55, 16);
  const b = () => rrect(c, x - w / 2, y, w, h, 40);
  shape(c, b, COL.glass, 6);
  c.save(); c.beginPath(); b(); c.clip(); c.fillStyle = COL.water; c.globalAlpha = 0.8; c.fillRect(x - w / 2, y + h * (1 - water), w, h * water); c.restore(); c.globalAlpha = 1;
  shape(c, b, "rgba(0,0,0,0)", 6);
  line(c, [[x - w / 2 + 6, y + 22], [x + w / 2 - 6, y + 22]], 6, COL.glassEdge);
  shine(c, [[x - w / 2 + 28, y + 60], [x - w / 2 + 28, y + h * 0.5]], 8);
};
const biscuit = (c: Ctx, x: number, y: number, r: number, rot = 0) => {
  shape(c, () => ell(c, x, y, r, r * 0.8, rot), "#e2b872", 5);
  for (const [dx, dy] of [[-0.4, -0.2], [0.3, -0.3], [0, 0.3], [0.45, 0.2], [-0.35, 0.3]]) shape(c, () => ell(c, x + dx * r, y + dy * r * 0.8, 3.5, 3.5), "#b9854a", 0);
};
const jar = (c: Ctx, x: number, y: number, w: number, h: number, water: boolean) => {
  shadow(c, x + 12, y + 8, w * 0.6, 18);
  const b = () => rrect(c, x - w / 2, y - h, w, h, 36);
  if (water) { shape(c, () => rrect(c, x - w / 2 + 3, y - h * 0.9, w - 6, h * 0.9 - 3, 34), COL.water, 0); }
  shape(c, b, water ? "rgba(214,236,250,0.35)" : COL.glass, 6);
  shape(c, () => rrect(c, x - w / 2 - 6, y - h - 38, w + 12, 44, 12), COL.teal, 6);
  shine(c, [[x - w / 2 + 24, y - h * 0.8], [x - w / 2 + 24, y - h * 0.25]], 8);
};
const egg = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r * 0.78, r), "#fff4e0", 6);
  shade(c, () => ell(c, x, y, r * 0.78, r), "#e3d3b8", r * 0.3, r * 0.15, 0.7);
};
const orgSign = (c: Ctx, x: number, y: number, which: number, k = 1.25) => {
  shadow(c, x + 10, y + 125 * k, 110 * k, 14);
  shape(c, () => rrect(c, x - 115 * k, y - 115 * k, 230 * k, 230 * k, 24), COL.paper, 7);
  if (which === 0) brain(c, x, y - 5, 0.5 * k); else if (which === 1) heart(c, x, y, 62 * k); else if (which === 2) lungs(c, x, y - 90 * k, 0.45 * k); else stomach(c, x, y, 0.4 * k, false);
};
const fish = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const b = () => { c.moveTo(-250, 0); c.bezierCurveTo(-150, -150, 100, -150, 200, -20); c.lineTo(300, -110); c.lineTo(300, 110); c.lineTo(200, 20); c.bezierCurveTo(100, 150, -150, 150, -250, 0); c.closePath(); };
  shape(c, b, COL.blue, 8); shade(c, b, COL.blueDk, 15, 20, 0.6);
  shape(c, () => ell(c, -190, -20, 14, 14), WHITE, 5); shape(c, () => ell(c, -188, -20, 6, 6), INK, 0);
  brain(c, -130, -22, 0.2);
  shape(c, () => ell(c, 20, -78, 130, 22), COL.drop, 5);
  heart(c, -85, 32, 28);
  shape(c, () => ell(c, 20, 20, 52, 28, 0.2), STOM, 5);
  c.restore();
};
const lung = (c: Ctx, cx: number, cy: number, s: number, big: number) => { lungs(c, cx, cy, s, big); };

// ---------------------------------------------------------------- intro / summary
const intro = (c: Ctx) => {
  ground(c);
  bust(c, 500, 380, 190);
  c.setLineDash([16, 14]);
  c.save(); c.shadowColor = "#ffb3a5"; c.shadowBlur = 40; shape(c, heartPath(c, 560, 830, 110), "rgba(255,200,190,0.5)", 0); c.restore();
  shape(c, heartPath(c, 560, 830, 110), "rgba(0,0,0,0)", 0); c.beginPath(); heartPath(c, 560, 830, 110)(); c.strokeStyle = RED; c.lineWidth = 9; c.stroke(); c.setLineDash([]);
  hand(c, 760, 760, Math.PI, 1.9, SKIN.child, CLOTH.child, true);
};
const summary = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 985, 280, 24);
  body(c, 540, 70, 1.3);
  organsIn(c, 540, 70, 1.3);
};

// ---------------------------------------------------------------- experiments
const e1 = (c: Ctx) => {
  ground(c); counter(c, 800);
  jar(c, 290, 780, 300, 460, false); egg(c, 290, 700, 70);
  jar(c, 790, 780, 300, 460, true); egg(c, 790, 520, 70);
  arrow(c, [[130, 330], [190, 280], [130, 230]]); arrow(c, [[450, 330], [390, 280], [450, 230]]);
  arrow(c, [[630, 330], [690, 280], [630, 230]]); arrow(c, [[950, 330], [890, 280], [950, 230]]);
};
const e2 = (c: Ctx) => {
  ground(c); counter(c, 800);
  bag(c, 240, 280, 330, 500, 0.35); biscuit(c, 240, 690, 70, 0.2);
  bag(c, 760, 280, 330, 500, 0.35);
  for (const [dx, dy, r] of [[-70, 0, 20], [0, 10, 16], [60, -5, 22], [-30, -25, 14], [30, 20, 15], [90, 15, 12], [-90, 20, 12]]) biscuit(c, 760 + dx, 690 + dy, r, dx);
  hand(c, 480, 450, 0, 1.1, SKIN.adult, CLOTH.adult, true); hand(c, 1000, 450, Math.PI, 1.1, SKIN.adult, CLOTH.adult, true);
  arrow(c, [[560, 330], [640, 380]], RED, 10); arrow(c, [[960, 330], [880, 380]], RED, 10);
};
const mishri = (c: Ctx, x: number, y: number, r: number, rot: number) => { shape(c, () => polyP(c, [[x - r, y - r * 0.4], [x - r * 0.3, y - r * 0.9], [x + r * 0.8, y - r * 0.6], [x + r, y + r * 0.3], [x + r * 0.2, y + r * 0.9], [x - r * 0.8, y + r * 0.6]].map(([a, b]) => [a + Math.sin(rot) * 3, b])), "#f6ead2", 5); };
const e3 = (c: Ctx) => {
  ground(c); counter(c, 800);
  glass(c, 290, 820, 340, 480, 0.55); glass(c, 790, 820, 340, 480, 0.55);
  mishri(c, 290, 770, 70, 0);
  [[-80, 780], [-45, 795], [-5, 770], [35, 790], [75, 775], [-60, 755], [10, 755], [55, 755]].forEach(([dx, dy], i) => mishri(c, 790 + dx, dy, 17, i));
};

// ---------------------------------------------------------------- activities
const a1 = (c: Ctx) => {
  ground(c);
  bust(c, 440, 330, 170);
  hand(c, 700, 740, Math.PI, 1.8, SKIN.child, CLOTH.child, true);
  for (const r of [60, 100]) { c.beginPath(); c.arc(430, 700, r, Math.PI + 0.7, Math.PI * 2 - 0.7); c.strokeStyle = RED; c.lineWidth = 9; c.lineCap = "round"; c.stroke(); }
  glass(c, 900, 1000, 170, 270, 0.8);
};
const a2 = (c: Ctx) => {
  ground(c, FLOOR);
  shadow(c, 560, 1010, 380, 24);
  shape(c, () => rrect(c, 230, 40, 640, 980, 14), COL.paper, 7);
  body(c, 550, 100, 1.1, "#fffdf6");
  c.save(); c.setLineDash([]); c.restore();
  brain(c, 550, 100 + 78 * 1.1, 0.4 * 1.1);
  lungs(c, 550, 100 + 170 * 1.1, 0.62 * 1.1);
  heart(c, 550 + 33, 100 + 345 * 1.1, 52 * 1.1);
  stomach(c, 550 + 57, 100 + 470 * 1.1, 0.3 * 1.1, false);
  line(c, [[900, 260], [1010, 150]], 36, INK); line(c, [[900, 260], [1010, 150]], 24, COL.teal);
};
const a3 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 905, 400, 50);
  shape(c, () => polyP(c, [[230, 610], [850, 610], [940, 790], [140, 790]]), COL.teal);
  shape(c, () => polyP(c, [[140, 790], [940, 790], [940, 880], [140, 880]]), COL.tealDk);
  shape(c, () => polyP(c, [[390, 806], [690, 806], [690, 866], [390, 866]]), "#22303a", 5);
  write(c, "300 g", 410, 814, 40, "#c9f06b", 7);
  const m = () => { c.moveTo(540, 330); c.bezierCurveTo(740, 290, 800, 560, 650, 640); c.bezierCurveTo(540, 700, 380, 640, 360, 500); c.bezierCurveTo(350, 400, 440, 340, 540, 330); c.closePath(); };
  shadow(c, 560, 650, 190, 22);
  shape(c, m, COL.yellow, 7); shade(c, m, COL.orange, 40, 30, 0.6);
  shine(c, [[420, 440], [450, 390]], 12);
  line(c, [[540, 335], [545, 300]], 10, COL.soilDk);
  heart(c, 130, 480, 80);
  line(c, [[240, 450], [320, 450]], 14, INK); line(c, [[240, 495], [320, 495]], 14, INK);
};
const a4 = (c: Ctx) => {
  ground(c);
  orgSign(c, 540, 170, 0); orgSign(c, 170, 540, 1); orgSign(c, 910, 540, 2); orgSign(c, 540, 910, 3);
  arrow(c, [[450, 290], [300, 400]]); arrow(c, [[630, 290], [780, 400]]); arrow(c, [[540, 310], [540, 740]]);
  arrow(c, [[260, 690], [420, 800]], COL.blue);
  arrow(c, [[820, 690], [660, 800]], COL.blue);
};
const a5 = (c: Ctx) => {
  ground(c);
  body(c, 270, 150, 0.95, SKINT); organsIn(c, 270, 150, 0.95);
  fish(c, 750, 520, 0.9);
  line(c, [[470, 480], [530, 480]], 14); line(c, [[470, 525], [530, 525]], 14);
};
const a6 = (c: Ctx) => {
  ground(c);
  body(c, 540, 70, 1.3); organsIn(c, 540, 70, 1.3, { gut: false });
  hairOn(c, 540, 70, 1.3); faceOn(c, 540, 70, 1.3);
  arrow(c, [[500, 130], [500, 230], [450, 350]], COL.blue, 14);
  arrow(c, [[600, 215], [640, 330], [640, 520], [610, 580]], COL.orange, 14);
};
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 985, 360, 24);
  shape(c, () => rrect(c, 190, 50, 700, 930, 20), COL.paper, 7);
  body(c, 540, 130, 1.05, "#fffdf6"); organsIn(c, 540, 130, 1.05);
  // the shirt flap, opened like a door on the left
  shape(c, () => polyP(c, [[370, 340], [250, 300], [250, 800], [370, 790]]), CLOTH.child, 6);
  shade(c, () => polyP(c, [[370, 340], [250, 300], [250, 800], [370, 790]]), CLOTH.childDk, 30, 0, 0.6);
  arrow(c, [[420, 260], [300, 240]], RED, 8);
};
const c1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 330, 300, 30, 6), COL.wood, 6);
  line(c, [[80, 360], [80, 990]], 30); line(c, [[300, 360], [300, 990]], 30);
  line(c, [[80, 360], [80, 990]], 18, COL.woodDk); line(c, [[300, 360], [300, 990]], 18, COL.woodDk);
  c.fillStyle = FLOOR; c.fillRect(0, 990, D, 90); line(c, [[0, 990], [D, 990]], 6);
  const helm = (x: number, y: number) => { egg(c, x, y, 90); shape(c, () => { c.moveTo(x - 90, y - 15); c.bezierCurveTo(x - 90, y - 160, x + 90, y - 160, x + 90, y - 15); c.closePath(); }, COL.teal, 6); shape(c, () => rrect(c, x - 98, y - 28, 196, 24, 8), COL.tealDk, 5); };
  helm(190, 236); arrow(c, [[400, 320], [600, 560], [690, 760]]);
  helm(840, 880);
  shadow(c, 850, 985, 140, 14);
};
const c2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 990, 400, 24);
  shape(c, () => rrect(c, 120, 90, 840, 870, 40), COL.wood, 8);
  shape(c, () => rrect(c, 170, 140, 740, 770, 24), COL.woodDk, 6);
  lungs(c, 540, 170, 1.35, 1);
  heart(c, 450, 640, 130);
  arrow(c, [[780, 700], [610, 700]], RED, 10);
};

// ---------------------------------------------------------------- terms
const tOrgan = (c: Ctx) => {
  ground(c);
  orgSign(c, 300, 300, 0, 1.6); orgSign(c, 780, 300, 1, 1.6); orgSign(c, 300, 780, 2, 1.6); orgSign(c, 780, 780, 3, 1.6);
};
const tHeart = (c: Ctx) => { ground(c); shadow(c, 540, 930, 300, 28); heart(c, 540, 520, 300, true); };
const tLungs = (c: Ctx) => { ground(c); shadow(c, 540, 930, 330, 30); lungs(c, 540, 130, 1.6); };
const tStomach = (c: Ctx) => { ground(c); shadow(c, 520, 960, 300, 26); stomach(c, 480, 580, 1.65, true); };
const tBrain = (c: Ctx) => { ground(c); shadow(c, 540, 930, 330, 28); brain(c, 540, 450, 2.0); };
const tCell = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 360, 30);
  const m = () => { c.moveTo(150, 520); c.bezierCurveTo(130, 200, 420, 90, 650, 140); c.bezierCurveTo(900, 200, 960, 430, 900, 640); c.bezierCurveTo(840, 880, 520, 920, 330, 850); c.bezierCurveTo(200, 800, 160, 660, 150, 520); c.closePath(); };
  shape(c, m, "#f9c9d6", 8); shade(c, m, "#e69fb4", 40, 30, 0.6);
  shape(c, () => ell(c, 520, 490, 170, 160), COL.purple, 8); shade(c, () => ell(c, 520, 490, 170, 160), "#6a4fa8", 40, 30, 0.6);
  shape(c, () => ell(c, 520, 490, 55, 55), "#cbb8f0", 5);
  for (const [x, y, rx, ry, rot] of [[280, 320, 55, 28, 0.4], [770, 330, 50, 26, -0.5], [310, 720, 50, 28, -0.3], [770, 720, 55, 28, 0.4]]) shape(c, () => ell(c, x, y, rx, ry, rot), COL.orange, 5);
};
const tBlood = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 280, 1000, 520, 150), "#ee7b6e", 8);
  shape(c, () => rrect(c, 40, 280, 1000, 100, 50), "#f29a8f", 0); c.beginPath(); rrect(c, 40, 280, 1000, 520, 150); c.strokeStyle = INK; c.lineWidth = 8; c.stroke();
  const rbc = (x: number, y: number, r: number, rot: number) => { shape(c, () => ell(c, x, y, r, r * 0.85, rot), "#c8281e", 6); shape(c, () => ell(c, x, y, r * 0.45, r * 0.35, rot), "#9c1a14", 0); };
  [[200, 460, 80, 0.2], [430, 620, 78, -0.3], [450, 410, 70, 0.5], [680, 540, 82, 0.1], [650, 380, 60, 0.4], [880, 450, 76, -0.2], [870, 650, 66, 0.3], [250, 670, 60, 0.2]].forEach(([x, y, r, t]) => rbc(x, y, r, t));
  arrow(c, [[200, 900], [880, 900]], RED, 14);
};
const tNerve = (c: Ctx) => {
  ground(c);
  brain(c, 270, 230, 1.0);
  tube(c, [[320, 330], [420, 480], [600, 560], [740, 680], [800, 760]], 30, COL.yellow);
  hand(c, 860, 830, -2.4, 1.5, SKIN.child, CLOTH.child, true);
  arrow(c, [[500, 500], [610, 590]], RED, 9);
  arrow(c, [[730, 640], [620, 570]], COL.blue, 9);
};
const tSpinal = (c: Ctx) => {
  ground(c);
  brain(c, 540, 170, 0.8);
  tube(c, [[540, 290], [540, 920]], 20, COL.yellow);
  for (let k = 0; k < 7; k++) { const y = 330 + k * 85; shape(c, () => rrect(c, 440, y, 200, 62, 28), BONE, 6); shade(c, () => rrect(c, 440, y, 200, 62, 28), BONEDK, 15, 10, 0.7); line(c, [[540, y - 12], [540, y + 74]], 22, COL.yellow); }
  for (let k = 0; k < 6; k++) { const y = 372 + k * 85; for (const m of [-1, 1]) line(c, [[540, y], [540 + m * 170, y - 30]], 8, COL.yellow); }
};
const tSkull = (c: Ctx) => { ground(c); shadow(c, 540, 930, 270, 26); skull(c, 540, 440, 2.3); };
const tRibs = (c: Ctx) => {
  ground(c);
  lungs(c, 540, 90, 1.55, 0.95);
  heart(c, 590, 560, 125);
  ribs(c, 540, 140, 1.6);
};
const tDiaphragm = (c: Ctx) => {
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
const tFoodPipe = (c: Ctx) => {
  ground(c);
  body(c, 470, 70, 1.3); hairOn(c, 470, 70, 1.3);
  for (const m of [-1, 1]) { c.beginPath(); c.arc(470 + m * 40, 70 + 120, 10, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
  shape(c, () => ell(c, 470, 70 + 165, 22, 16), INK, 0);
  tube(c, [[470, 245], [470, 450], [520, 500]], 30, "#e58f8f");
  stomach(c, 540, 650, 0.5, false);
  shape(c, () => ell(c, 880, 230, 70, 56), "#fff4e0", 6);
  for (const [x, y] of [[860, 215], [900, 220], [880, 250], [850, 245], [915, 252]]) shape(c, () => ell(c, x, y, 14, 9, 0.5), WHITE, 3);
  arrow(c, [[780, 230], [610, 230]], RED, 12);
};
const tIntestines = (c: Ctx) => { ground(c); shadow(c, 540, 950, 330, 26); guts(c, 540, 540, 2.0); };
const tSystem = (c: Ctx) => {
  ground(c);
  body(c, 540, 70, 1.3);
  tube(c, [[540, 215], [540, 440], [580, 490]], 26, "#e58f8f");
  stomach(c, 580, 545, 0.45, false);
  guts(c, 540, 790, 0.42);
  hairOn(c, 540, 70, 1.3); faceOn(c, 540, 70, 1.3);
  shape(c, () => ell(c, 540, 218, 24, 8), INK, 0);
  arrow(c, [[780, 300], [780, 560]], RED, 10);
};
const tXray = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 140, 70, 800, 940, 24), "#16213a", 8);
  const GLOW = "#cfe6ff";
  ribs(c, 540, 230, 1.35, GLOW, "#16213a");
  shape(c, () => rrect(c, 515, 600, 50, 340, 20), GLOW, 5);
};

export const ic_bodyOrgansInsideL3 = cards("sci.body.organs-inside.L3 cards", [
  intro, summary, e1, e2, e3, a1, a2, a3, a4, a5, a6, p1, c1, c2,
  tOrgan, tHeart, tLungs, tStomach, tBrain, tCell, tBlood, tNerve, tSpinal, tSkull, tRibs, tDiaphragm, tFoodPipe, tIntestines, tSystem, tXray,
]);
void lung; void RED; void shine;
