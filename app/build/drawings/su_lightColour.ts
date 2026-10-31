import type { Ctx } from "./core";
import { D, INK, BG, SH, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, hand, person, write, cards } from "./flatKit";

// sci.light.colour.L3 set-up cards: splitting light (glass of water, mirror in water, prism),
// the rainbow in a spray, and the spinning colour disc.
const SP = ["#e4382b", "#f39a3c", "#ffd34d", "#5aa84a", "#4d86d6", "#8b4cc9"];
const SUN = "#ffd34d", BEAM = "rgba(255,226,120,0.5)";

const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * (r + 14), y + Math.sin(a) * (r + 14)], [x + Math.cos(a) * (r + 44), y + Math.sin(a) * (r + 44)]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), SUN, 7);
  shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.25, r * 0.25, 0.45);
};
const poly = (c: Ctx, pts: number[][], fill: string) => { c.beginPath(); polyP(c, pts); c.fillStyle = fill; c.fill(); };
// a fan of the six colours from one point on to six stacked bands; each band is [x1,y1,x2,y2] edge start/end
const fan = (c: Ctx, o: number[], a: number[], b: number[], alpha = 0.55) => {
  c.globalAlpha = alpha;
  for (let i = 0; i < 6; i++) {
    const t0 = i / 6, t1 = (i + 1) / 6, p0 = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0], p1 = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1];
    poly(c, [o, p0, p1], SP[i]);
  }
  c.globalAlpha = 1;
};
// the strip itself: six solid bands from a to b
const strip = (c: Ctx, a: number[], b: number[], thick: number[], ink = 4) => {
  for (let i = 0; i < 6; i++) {
    const t0 = i / 6, t1 = (i + 1) / 6, p = (t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const p0 = p(t0), p1 = p(t1);
    shape(c, () => polyP(c, [p0, p1, [p1[0] + thick[0], p1[1] + thick[1]], [p0[0] + thick[0], p0[1] + thick[1]]]), SP[i], 0);
  }
  shape(c, () => polyP(c, [a, b, [b[0] + thick[0], b[1] + thick[1]], [a[0] + thick[0], a[1] + thick[1]]]), "rgba(0,0,0,0)", ink);
};
const whiteCard = (c: Ctx, pts: number[][]) => { shape(c, () => polyP(c, pts), WHITE, 6); };

// ---------------------------------------------------------------- 0 glass of water on a sill, colours on paper below
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  // floor
  c.fillStyle = "#e4d2ac"; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 6);
  // wall under the sill and the sill itself
  shape(c, () => polyP(c, [[0, 540], [110, 540], [110, 880], [0, 880]]), "#e9dcc0", 6);
  shape(c, () => polyP(c, [[0, 470], [660, 470], [660, 545], [0, 545]]), COL.wood, 6);
  shade(c, () => polyP(c, [[0, 470], [660, 470], [660, 545], [0, 545]]), COL.woodDk, 0, 30, 0.6);
  // sun and the beam into the glass
  sun(c, 150, 140, 70);
  poly(c, [[210, 150], [520, 285], [520, 440], [190, 215]], BEAM);
  // colour fan out of the glass onto the paper
  shadow(c, 800, 985, 220, 24);
  fan(c, [640, 410], [660, 925], [900, 925]);
  whiteCard(c, [[600, 905], [930, 905], [980, 990], [560, 990]]);
  strip(c, [650, 920], [880, 920], [22, 56]);
  glass(c, 585, 470, 160, 240, 1);
  poly(c, [[210, 150], [525, 285], [525, 440], [190, 215]], "rgba(255,226,120,0.35)");
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  // white wall on the right with the colours on it
  shape(c, () => polyP(c, [[830, 130], [1040, 130], [1040, 640], [830, 640]]), WHITE, 6);
  shade(c, () => polyP(c, [[830, 130], [1040, 130], [1040, 640], [830, 640]]), "#d9d2c4", 30, 0, 0.5);
  sun(c, 170, 130, 70);
  // beam into the mirror
  poly(c, [[230, 150], [390, 540], [500, 560], [250, 200]], BEAM);
  // tray
  shadow(c, 520, 830, 380, 40);
  shape(c, () => polyP(c, [[150, 640], [890, 640], [820, 800], [220, 800]]), COL.steel, 6);
  shade(c, () => polyP(c, [[150, 640], [890, 640], [820, 800], [220, 800]]), COL.steelDk, 80, 0, 0.5);
  shape(c, () => ell(c, 520, 640, 370, 62), COL.steelIn, 6);
  shape(c, () => ell(c, 520, 646, 340, 48), COL.water, 0);
  // mirror leaning in the water
  const m = [[360, 720], [520, 720], [470, 440], [330, 440]];
  shape(c, () => polyP(c, m), "#dcecf6", 6);
  shine(c, [[375, 690], [350, 480]], 9);
  poly(c, [[364, 700], [520, 700], [524, 722], [360, 722]], "rgba(95,159,211,0.0)");
  // reflected colours going to the wall
  fan(c, [455, 560], [830, 300], [830, 420], 0.6);
  strip(c, [850, 300], [850, 420], [160, 0]);
  // water over the foot of the mirror
  c.save(); c.beginPath(); polyP(c, m); c.clip(); c.beginPath(); ell(c, 520, 646, 340, 48); c.fillStyle = "rgba(95,159,211,0.55)"; c.fill(); c.beginPath(); c.rect(0, 646, D, 200); c.fill(); c.restore();
  line(c, [[365, 700], [525, 720]], 5);
  shape(c, () => polyP(c, [[185, 700], [855, 700], [820, 800], [220, 800]]), "rgba(143,195,234,0.0)", 0);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e4d2ac"; c.fillRect(0, 800, D, 280); line(c, [[0, 800], [D, 800]], 6);
  sun(c, 120, 130, 70);
  poly(c, [[190, 160], [430, 620], [400, 700], [150, 220]], BEAM);
  // white card on the table
  shadow(c, 930, 815, 130, 24);
  shape(c, () => polyP(c, [[820, 420], [1000, 420], [1000, 800], [820, 800]]), WHITE, 6);
  shade(c, () => polyP(c, [[820, 420], [1000, 420], [1000, 800], [820, 800]]), "#d9d2c4", 40, 0, 0.5);
  fan(c, [585, 660], [820, 640], [820, 760], 0.6);
  strip(c, [826, 640], [826, 760], [168, 0]);
  // prism, end view
  shadow(c, 520, 805, 190, 24);
  const tri = () => polyP(c, [[330, 800], [650, 800], [490, 520]]);
  shape(c, tri, "rgba(190,226,248,0.85)", 7);
  shade(c, tri, COL.glassEdge, 40, 20, 0.35);
  shine(c, [[400, 760], [480, 600]], 9);
  poly(c, [[190, 160], [410, 620], [410, 700], [150, 220]], "rgba(255,226,120,0.35)");
  line(c, [[410, 660], [575, 660]], 6, "rgba(255,255,255,0.8)");
};

// ---------------------------------------------------------------- rainbow in a spray
const railing = (c: Ctx, y0: number, y1: number) => {
  for (let x = 40; x < D; x += 120) line(c, [[x, y0], [x, y1]], 14, INK), line(c, [[x, y0], [x, y1]], 6, COL.steel);
  line(c, [[0, y0], [D, y0]], 22, INK); line(c, [[0, y0], [D, y0]], 12, COL.steel);
};
const sprayBottle = (c: Ctx, x: number, y: number) => {
  shape(c, () => rrect(c, x - 40, y - 20, 80, 150, 22), COL.teal, 6);
  shade(c, () => rrect(c, x - 40, y - 20, 80, 150, 22), COL.tealDk, 22, 0, 0.6);
  shape(c, () => polyP(c, [[x - 28, y - 20], [x + 28, y - 20], [x + 28, y - 50], [x - 28, y - 50]]), COL.tealDk, 6);
  shape(c, () => rrect(c, x - 28, y - 80, 130, 38, 14), COL.teal, 6);
  shape(c, () => rrect(c, x + 94, y - 76, 24, 30, 8), COL.steelDk, 5);
  line(c, [[x + 6, y - 20], [x + 28, y + 30], [x + 10, y + 36]], 7);
};
const mist = (c: Ctx, x: number, y: number, len: number, spread: number, seed: number) => {
  const r = rnd(seed);
  for (let i = 0; i < 70; i++) { const t = r(), px = x + t * len, py = y + (r() - 0.5) * 2 * spread * t, s = 4 + r() * 8; c.beginPath(); ell(c, px, py, s, s * 0.85); c.fillStyle = r() > 0.5 ? "rgba(255,255,255,0.9)" : "rgba(180,215,240,0.9)"; c.fill(); c.lineWidth = 2.5; c.strokeStyle = COL.glassEdge; c.stroke(); }
};
const rainbowArc = (c: Ctx, cx: number, cy: number, R: number, bw: number, alpha = 1) => {
  c.globalAlpha = alpha; c.lineCap = "butt";
  line(c, [[0, 0]], 0);
  for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(cx, cy, R - i * bw, Math.PI, Math.PI * 2); c.strokeStyle = SP[i]; c.lineWidth = bw + 1; c.stroke(); }
  c.globalAlpha = 1;
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c, "#fde9b8");
  c.fillStyle = "#e4d2ac"; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 6);
  sun(c, 930, 340, 80);
  railing(c, 700, 880);
  shadow(c, 330, 890, 150, 24);
  person(c, 300, 880, 640, { armR: [-0.05, 0.0], armL: [Math.PI * 0.55, Math.PI * 0.5] });
  sprayBottle(c, 600, 400);
  hand(c, 520, 430, 0, 1.0);
  mist(c, 725, 335, 160, 70, 5);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c, "#fde9b8");
  c.fillStyle = "#e4d2ac"; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 6);
  sun(c, 100, 340, 80);
  railing(c, 700, 880);
  rainbowArc(c, 860, 700, 360, 28, 0.95);
  // long shadow on the floor
  c.fillStyle = "rgba(43,35,64,0.28)"; c.beginPath(); polyP(c, [[400, 900], [500, 900], [980, 975], [900, 1010]]); c.fill(); c.beginPath(); ell(c, 985, 995, 52, 42, 0.3); c.fill();
  shadow(c, 450, 892, 120, 20);
  person(c, 420, 880, 640, { armR: [-0.05, 0.0] });
  sprayBottle(c, 720, 400);
  hand(c, 640, 430, 0, 1.0);
  mist(c, 845, 335, 150, 70, 9);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c, "#fde9b8");
  c.fillStyle = "#e4d2ac"; c.fillRect(0, 720, D, 360); line(c, [[0, 720], [D, 720]], 6);
  sun(c, 90, 190, 60);
  const hx = 800, hy = 900;
  // rainbow and the circle round it, centred on the shadow's head
  rainbowArc(c, hx, hy, 340, 26, 0.95);
  c.setLineDash([22, 18]); c.beginPath(); c.arc(hx, hy, 372, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 7; c.stroke(); c.setLineDash([]);
  // shadows of the grown-up and the child, long, to the right
  c.fillStyle = "rgba(43,35,64,0.30)";
  c.beginPath(); polyP(c, [[360, 830], [440, 830], [hx - 10, hy + 18], [hx - 30, hy - 30]]); c.fill();
  c.beginPath(); ell(c, hx, hy, 52, 46, 0.2); c.fill();
  shape(c, () => ell(c, hx, hy, 11, 11), RED, 4);
  person(c, 150, 790, 560, { sit: true, adult: true, armR: [0.5, 0.2] });
  person(c, 340, 830, 420, { sit: true, armR: [0.55, 0.45] });
};

// ---------------------------------------------------------------- the colour disc
const disc = (c: Ctx, x: number, y: number, r: number, cols: string[], rot = -Math.PI / 2) => {
  shadow(c, x + r * 0.06, y + r * 1.0, r * 0.95, r * 0.12);
  const n = cols.length;
  for (let i = 0; i < n; i++) { c.beginPath(); c.moveTo(x, y); c.arc(x, y, r, rot + (i * Math.PI * 2) / n, rot + ((i + 1) * Math.PI * 2) / n); c.closePath(); c.fillStyle = cols[i]; c.fill(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke(); }
  shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", 8);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); c.beginPath(); ell(c, x + r * 0.35, y + r * 0.35, r, r); c.fillStyle = "rgba(43,35,64,0.18)"; c.rect(-5000, -5000, 10000, 10000); c.fill("evenodd"); c.restore();
  shape(c, () => ell(c, x, y, r * 0.05, r * 0.05), INK, 0);
};
const pencil = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w = 34) => {
  const an = Math.atan2(y2 - y1, x2 - x1), ux = Math.cos(an), uy = Math.sin(an);
  line(c, [[x1, y1], [x2, y2]], w + 10, INK); line(c, [[x1, y1], [x2, y2]], w, COL.yellow);
  line(c, [[x1 - uy * w * 0.25, y1 + ux * w * 0.25], [x2 - uy * w * 0.25, y2 + ux * w * 0.25]], 6, COL.orange);
  const tx = x2 + ux * 70, ty = y2 + uy * 70;
  shape(c, () => polyP(c, [[x2 - uy * w / 2, y2 + ux * w / 2], [x2 + uy * w / 2, y2 - ux * w / 2], [tx, ty]]), COL.wood, 6);
  shape(c, () => polyP(c, [[x2 + ux * 46 - uy * 8, y2 + uy * 46 + ux * 8], [x2 + ux * 46 + uy * 8, y2 + uy * 46 - ux * 8], [tx, ty]]), INK, 4);
  const ex = x1 - ux * 40, ey = y1 - uy * 40;
  shape(c, () => polyP(c, [[x1 - uy * w / 2, y1 + ux * w / 2], [x1 + uy * w / 2, y1 - ux * w / 2], [ex + uy * w / 2, ey - ux * w / 2], [ex - uy * w / 2, ey + ux * w / 2]]), COL.pink, 6);
};

// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  disc(c, 500, 470, 320, SP);
  pencil(c, 916, 1049, 722, 783, 36);
  hand(c, 880, 1000, -2.2, 1.7);
};

// a spinning top: pencil with the disc on it, seen from the side; fill = how the blur looks
const top = (c: Ctx, x: number, y: number, rx: number, ry: number, ptop: number, ptip: number, fill: string, fillDk: string, ghost?: string[]) => {
  shadow(c, x + 14, ptip + 4, rx * 0.55, 16);
  // pencil
  const w = Math.max(24, rx * 0.12);
  shape(c, () => polyP(c, [[x - w / 2, ptop], [x + w / 2, ptop], [x + w / 2, ptip - 60], [x - w / 2, ptip - 60]]), COL.yellow, 6);
  shape(c, () => polyP(c, [[x - w / 2, ptip - 60], [x + w / 2, ptip - 60], [x, ptip]]), COL.wood, 6);
  shape(c, () => polyP(c, [[x - w * 0.18, ptip - 18], [x + w * 0.18, ptip - 18], [x, ptip]]), INK, 3);
  shape(c, () => rrect(c, x - w / 2, ptop - 34, w, 34, 8), COL.pink, 6);
  // disc
  const d = () => ell(c, x, y, rx, ry);
  shape(c, () => ell(c, x, y + 14, rx, ry), fillDk, 6);
  shape(c, d, fill, 6);
  if (ghost) { c.save(); c.beginPath(); d(); c.clip(); const n = ghost.length; for (let i = 0; i < n; i++) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(i * 6.283 / n) * rx * 2, y + Math.sin(i * 6.283 / n) * ry * 2); c.lineTo(x + Math.cos((i + 1) * 6.283 / n) * rx * 2, y + Math.sin((i + 1) * 6.283 / n) * ry * 2); c.closePath(); c.fillStyle = ghost[i]; c.globalAlpha = 0.1; c.fill(); } c.globalAlpha = 1; c.restore(); }
  c.beginPath(); c.ellipse(x, y, rx * 0.7, ry * 0.7, 0, Math.PI * 1.1, Math.PI * 1.7); c.strokeStyle = WHITE; c.lineWidth = Math.max(5, rx * 0.03); c.globalAlpha = 0.85; c.stroke(); c.globalAlpha = 1;
};
const spinArrow = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  c.beginPath(); c.ellipse(x, y, rx, ry, 0, Math.PI * 0.15, Math.PI * 0.85); c.strokeStyle = RED; c.lineWidth = 11; c.lineCap = "round"; c.stroke();
  const a = Math.PI * 0.85, px = x + Math.cos(a) * rx, py = y + Math.sin(a) * ry;
  line(c, [[px + 14, py + 32], [px, py], [px + 34, py - 10]], 11, RED);
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e4d2ac"; c.fillRect(0, 840, D, 240); line(c, [[0, 840], [D, 840]], 6);
  top(c, 540, 560, 330, 82, 330, 880, "#ecebee", "#bdbac2", SP);
  spinArrow(c, 540, 560, 395, 118);
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e4d2ac"; c.fillRect(0, 830, D, 250); line(c, [[0, 830], [D, 830]], 6);
  const RG = [SP[0], SP[3], SP[0], SP[3], SP[0], SP[3]], RR = [SP[0], SP[0], SP[0], SP[0], SP[0], SP[0]];
  disc(c, 190, 190, 105, SP); disc(c, 540, 190, 105, RG); disc(c, 890, 190, 105, RR);
  top(c, 190, 610, 150, 40, 410, 810, "#ecebee", "#bdbac2");
  top(c, 540, 610, 150, 40, 410, 810, "#b6a14c", "#8a7a36");
  top(c, 890, 610, 150, 40, 410, 810, "#d7372b", "#a02a20");
  for (const x of [190, 540, 890]) { arrow(c, [[x, 312], [x, 362]], RED, 10); }
};

export const su_lightColour = cards("sci.light.colour.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
