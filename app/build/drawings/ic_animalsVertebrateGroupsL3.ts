import type { Ctx } from "./core";
import { COL, INK, RED, SKIN, CLOTH, WHITE, arrow, bowl, cards, ell, glass, ground, hand, line, person, plate, polyP, rrect, shade, shadow, shape, shine, write } from "./flatKit";

// VERTEBRATE GROUPS L3 · picture cards. Flat DeepKids look. Animals are seen from the side, nose to the right.
// Red = arrows and rings; blue = cold, orange = warm; numbers only with write(); no words.

const FISH = "#f08a4b", FISH_DK = "#d96a2f", FROG = "#6aa53f", FROG_DK = "#46752a", LIZ = "#c9a36b", LIZ_DK = "#9c7a45";
const BIRD = "#a9805a", BIRD_DK = "#7d5c3c", BELLY = "#ead9bb", COW = "#f4efe4", COW_DK = "#d8cfba", BEAK = "#f3b13c";
const BONE = "#f6efdc", BONE_DK = "#d9cdb0", PINK = "#f29ab4", PINK_DK = "#d9748f", SAND = "#e8cf9a", SAND_DK = "#cfb072";
const COLD = "#cfe4f6", WARMBG = "#ffe9a8", WALL = "#f6efe0";

const eye = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), WHITE, 3); shape(c, () => ell(c, x + r * 0.2, y, r * 0.5, r * 0.5), INK, 0); };
const ring = (c: Ctx, x: number, y: number, r: number) => { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.strokeStyle = RED; c.lineWidth = 7; c.stroke(); };
const lg = (c: Ctx, pts: number[][], col: string, w = 14) => { line(c, pts, w + 6, INK); line(c, pts, w, col); };
const wave = (c: Ctx, x: number, y: number, len: number, col = RED, w = 9) => { // a wavy heat line going up from (x, y)
  const pts: number[][] = []; for (let i = 0; i <= 12; i++) pts.push([x + Math.sin(i * 0.9) * 12, y - (len * i) / 12]); line(c, pts, w, col);
};
type A = { flip?: boolean; spine?: boolean; glow?: boolean };
const spineDots = (c: Ctx, pts: number[][]) => { // a chain of small bones along a curve of points
  line(c, pts, 6, RED);
  for (const [x, y] of pts) shape(c, () => ell(c, x, y, 11, 11), WHITE, 4);
};

const fish = (c: Ctx, x: number, y: number, s: number, o: A = {}) => {
  c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
  shape(c, () => polyP(c, [[-90, 0], [-175, -58], [-150, 0], [-175, 58]]), FISH_DK);
  shape(c, () => polyP(c, [[-30, -55], [10, -105], [70, -50]]), FISH_DK);
  shape(c, () => polyP(c, [[-10, 55], [20, 95], [60, 52]]), FISH_DK);
  const body = () => { c.moveTo(-110, 0); c.bezierCurveTo(-60, -85, 90, -70, 140, 0); c.bezierCurveTo(90, 70, -60, 85, -110, 0); c.closePath(); };
  shape(c, body, FISH); shade(c, body, FISH_DK, 14, 16);
  for (let i = 0; i < 3; i++) for (let j = -1; j <= 1; j++) { c.beginPath(); c.arc(-40 + i * 28, j * 28 + (i % 2) * 8, 14, -0.9, 0.9); c.strokeStyle = FISH_DK; c.lineWidth = 3; c.stroke(); }
  eye(c, 100, -12, 13);
  line(c, [[138, 4], [118, 10]], 5);
  shape(c, () => { c.moveTo(62, -48); c.quadraticCurveTo(30, 0, 62, 48); c.quadraticCurveTo(84, 0, 62, -48); c.closePath(); }, o.glow ? "#e4523b" : FISH, 5);
  c.restore();
};
const bird = (c: Ctx, x: number, y: number, s: number, o: A = {}) => {
  c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
  for (const dx of [-12, 24]) { line(c, [[dx, 55], [dx, 108]], 9); line(c, [[dx, 108], [dx + 22, 112]], 8); line(c, [[dx, 108], [dx - 12, 116]], 8); }
  shape(c, () => polyP(c, [[-80, -5], [-170, 22], [-165, 50], [-75, 36]]), BIRD_DK);
  const body = () => ell(c, 0, 0, 98, 72, -0.12);
  shape(c, body, BIRD); shade(c, body, BIRD_DK, 14, 14);
  shape(c, () => ell(c, 28, 28, 56, 36, -0.1), BELLY, 0);
  if (o.glow) { shape(c, () => ell(c, 10, 10, 52, 40), RED, 0); c.globalAlpha = 0.9; shape(c, () => ell(c, 10, 10, 30, 22), COL.yellow, 0); c.globalAlpha = 1; }
  shape(c, () => ell(c, -22, -4, 62, 38, 0.35), BIRD_DK, 5);
  shape(c, () => ell(c, 88, -62, 40, 38), BIRD); shade(c, () => ell(c, 88, -62, 40, 38), BIRD_DK, 9, 9);
  shape(c, () => polyP(c, [[120, -66], [158, -54], [120, -44]]), BEAK, 5);
  eye(c, 98, -70, 9);
  c.restore();
};
type Q = { flip?: boolean; horns?: "short" | "long"; spots?: boolean; tongue?: boolean; udder?: boolean; col?: string; dk?: string; legs?: number };
const quad = (c: Ctx, x: number, y: number, s: number, o: Q = {}) => { // x,y = centre of the body
  c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
  const col = o.col ?? COW, dk = o.dk ?? COW_DK, L = o.legs ?? 140;
  for (const lx of [-95, 85]) { shape(c, () => rrect(c, lx, 20, 34, L, 12), dk); shape(c, () => rrect(c, lx, 20 + L - 18, 34, 18, 6), INK, 0); }
  line(c, [[-130, -20], [-165, 10], [-160, 70]], 10); shape(c, () => ell(c, -160, 76, 11, 18), INK, 0);
  const body = () => rrect(c, -135, -70, 270, 115, 52);
  if (o.udder) shape(c, () => ell(c, -62, 52, 30, 22), PINK, 5);
  shape(c, body, col); shade(c, body, dk, 16, 16, 0.8);
  if (o.spots) { c.save(); c.beginPath(); body(); c.clip(); for (const [sx, sy, r] of [[-70, -30, 34], [20, 0, 40], [95, -40, 28]]) shape(c, () => ell(c, sx, sy, r, r * 0.8), "#5a4636", 0); c.restore(); }
  for (const lx of [-60, 120]) { shape(c, () => rrect(c, lx, 20, 36, L, 12), col); shape(c, () => rrect(c, lx, 20 + L - 18, 36, 18, 6), INK, 0); }
  shape(c, () => polyP(c, [[100, -60], [190, -40], [175, 40], [105, 5]]), col, 0);
  shape(c, () => ell(c, 175, -22, 54, 44, 0.35), col); shape(c, () => ell(c, 220, -2, 28, 24, 0.35), PINK, 5);
  shape(c, () => ell(c, 150, -70, 20, 12, -0.5), dk, 5);
  if (o.horns) { const hl = o.horns === "long" ? 1 : 0.5; line(c, [[158, -58], [140, -95 * hl - 20], [100, -105 * hl - 20]], 12); line(c, [[158, -58], [140, -95 * hl - 20], [100, -105 * hl - 20]], 6, BONE); }
  eye(c, 185, -36, 8);
  if (o.tongue) shape(c, () => { c.moveTo(210, 8); c.quadraticCurveTo(216, 50, 232, 62); c.quadraticCurveTo(250, 46, 240, 12); c.closePath(); }, "#e4586b", 5);
  c.restore();
};
const lizard = (c: Ctx, x: number, y: number, s: number, o: A = {}) => { // house lizard, nose right; (x, y) = middle of the body
  c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
  const leg = (bx: number, by: number, kx: number, ky: number, fx: number, fy: number) => { lg(c, [[bx, by], [kx, ky], [fx, fy]], LIZ_DK, 13); for (const d of [-12, 0, 12]) line(c, [[fx, fy], [fx + d * 1.2, fy + 12]], 6); };
  leg(-70, 12, -100, 50, -78, 62); leg(70, 12, 105, 48, 128, 62);
  const tail: number[][] = []; for (let i = 0; i <= 14; i++) { const t = i / 14; tail.push([-110 - t * 190, -4 + Math.sin(t * 3.2) * 24 + t * 20, 24 * (1 - t) + 4]); }
  for (const [tx, ty, r] of tail) shape(c, () => ell(c, tx, ty, r + 6, r + 6), INK, 0);
  for (const [tx, ty, r] of tail) shape(c, () => ell(c, tx, ty, r, r), LIZ, 0);
  shape(c, () => ell(c, 0, 0, 125, 36), LIZ); shade(c, () => ell(c, 0, 0, 125, 36), LIZ_DK, 8, 12);
  leg(-40, 14, -62, 52, -30, 64); leg(100, 14, 80, 54, 104, 64);
  shape(c, () => ell(c, 140, -4, 56, 30, 0.08), LIZ); shade(c, () => ell(c, 140, -4, 56, 30, 0.08), LIZ_DK, 8, 8);
  eye(c, 152, -16, 9); line(c, [[188, 6], [160, 12]], 4);
  for (let i = 0; i < 6; i++) shape(c, () => ell(c, -60 + i * 28, -12, 6, 5), LIZ_DK, 0);
  c.restore();
};
const frog = (c: Ctx, x: number, y: number, s: number, o: A = {}) => {
  c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
  lg(c, [[40, 20], [95, 62], [120, 78]], FROG, 18); line(c, [[120, 80], [150, 84]], 8);
  const body = () => ell(c, 0, 0, 105, 72, -0.1);
  shape(c, body, FROG); shade(c, body, FROG_DK, 14, 14);
  shape(c, () => ell(c, -42, 28, 62, 36, -0.5), FROG, 6); line(c, [[-70, 56], [-30, 74], [40, 78]], 12); line(c, [[-70, 56], [-30, 74], [40, 78]], 6, FROG); line(c, [[40, 78], [75, 82]], 8);
  shape(c, () => ell(c, 80, -22, 56, 42, -0.15), FROG); shade(c, () => ell(c, 80, -22, 56, 42, -0.15), FROG_DK, 8, 8);
  shape(c, () => ell(c, 92, -58, 22, 22), FROG); eye(c, 96, -60, 13);
  line(c, [[130, -12], [96, -4]], 4);
  shape(c, () => ell(c, 40, 20, 40, 40), "rgba(0,0,0,0)", 0);
  c.restore();
};

const panel = (c: Ctx, x: number, y: number, w: number, h: number, col = "#fbf4e2") => { shape(c, () => rrect(c, x, y, w, h, 34), col, 5); };

// ---------------------------------------------------------------- shared pieces
const WOOL = "#f0d9a6", WOOLDK = "#d9bd82", ICE = "#d6eefa", ICEDK = "#a9d3ec", COOLB = "#3f6fb3";
const table = (c: Ctx, y: number) => { c.fillStyle = COL.wood; c.fillRect(0, y, 1080, 1080 - y); c.fillStyle = COL.woodDk; c.fillRect(0, y, 1080, 14); line(c, [[0, y], [1080, y]], 6); };
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.65, y + Math.sin(a) * r * 1.65]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
const flake = (c: Ctx, x: number, y: number, r: number) => { for (let i = 0; i < 3; i++) { const a = (i * Math.PI) / 3; line(c, [[x + Math.cos(a) * r, y + Math.sin(a) * r], [x - Math.cos(a) * r, y - Math.sin(a) * r]], 6, WHITE); } };
const forearm = (c: Ctx, x: number, y: number, an: number, s: number) => { c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s); shape(c, () => rrect(c, -700, -37, 640, 74, 14), CLOTH.child, 6); c.restore(); };
const hand2 = (c: Ctx, x: number, y: number, an: number, s: number, open = false) => { forearm(c, x, y, an, s); hand(c, x, y, an, s, SKIN.child, CLOTH.child, open); };
// a plastic bottle standing at (x, y) bottom centre with warm water; sock = a woollen cover over the lower part
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, sock = false) => {
  const body = () => rrect(c, x - w / 2, y - h, w, h, w * 0.22);
  shadow(c, x + w * 0.1, y + 6, w * 0.65, w * 0.12);
  shape(c, () => rrect(c, x - w * 0.18, y - h - w * 0.3, w * 0.36, w * 0.4, 6), COL.glass, 5);
  shape(c, body, COL.glass, 5);
  c.save(); c.beginPath(); body(); c.clip(); const wy = y - h * 0.88; c.fillStyle = "#f4b183"; c.fillRect(x - w, wy, w * 2, h); c.fillStyle = "#e08a5a"; c.globalAlpha = 0.45; c.fillRect(x + w * 0.2, wy, w, h); c.globalAlpha = 1; c.restore();
  shape(c, body, "rgba(0,0,0,0)", 5);
  if (sock) { const top = y - h * 0.8, sk = () => rrect(c, x - w / 2 - 8, top, w + 16, y - top + 4, 22); shape(c, sk, WOOL, 5); shade(c, sk, WOOLDK, w * 0.16, 0, 0.6); for (let i = 1; i < 6; i++) line(c, [[x - w / 2 - 8 + (i * (w + 16)) / 6, top + 36], [x - w / 2 - 8 + (i * (w + 16)) / 6, y - 12]], 3, WOOLDK); shape(c, () => rrect(c, x - w / 2 - 8, top, w + 16, h * 0.1, 8), COL.red, 5); }
  shine(c, [[x - w * 0.36, y - h * 0.95], [x - w * 0.36, y - h * 0.8]], 7);
  shape(c, () => rrect(c, x - w * 0.23, y - h - w * 0.48, w * 0.46, w * 0.2, 6), COL.red, 5);
};
const jellyBall = (c: Ctx, x: number, y: number, r: number, wrinkled = false) => {
  if (wrinkled) { shape(c, () => ell(c, x, y, r * 0.55, r * 0.5, 0.4), "#4a4048", 3); line(c, [[x - r * 0.3, y - r * 0.1], [x + r * 0.3, y + r * 0.1]], 2, "#8a7f88"); return; }
  shape(c, () => ell(c, x, y, r, r), "rgba(218,240,250,0.95)", Math.max(3, r * 0.1)); shade(c, () => ell(c, x, y, r, r), COL.glassEdge, r * 0.3, r * 0.3, 0.35);
  shape(c, () => ell(c, x + r * 0.03, y + r * 0.04, r * 0.34, r * 0.28), "#2a2630", 0); line(c, [[x - r * 0.6, y - r * 0.2], [x - r * 0.4, y - r * 0.55]], Math.max(3, r * 0.1), WHITE);
};
const drop = (c: Ctx, x: number, y: number, r: number, col: string = COL.water) => shape(c, () => { c.moveTo(x, y - r * 1.5); c.quadraticCurveTo(x + r * 1.1, y, x, y + r); c.quadraticCurveTo(x - r * 1.1, y, x, y - r * 1.5); c.closePath(); }, col, 4);
const spoon = (c: Ctx, x: number, y: number, len: number, an: number) => { // bowl at (x, y), handle runs along angle an
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 20, -9, len, 18, 9), COL.steel, 5);
  shape(c, () => ell(c, 0, 0, 52, 38), COL.steel); shade(c, () => ell(c, 0, 0, 52, 38), COL.steelDk, 10, 10, 0.7); shape(c, () => ell(c, -4, -4, 34, 24), COL.steelIn, 3);
  c.restore();
};
const thermoV = (c: Ctx, x: number, yb: number, h: number, level: number, tilt = 0) => { // glass thermometer: bulb centre at (x, yb), tube going up
  c.save(); c.translate(x, yb); c.rotate(tilt);
  shape(c, () => rrect(c, -15, -h, 30, h, 15), WHITE, 5);
  for (let i = 1; i < 10; i++) line(c, [[-15, -h * 0.12 - (i * h * 0.78) / 10], [i % 5 ? -3 : 6, -h * 0.12 - (i * h * 0.78) / 10]], 3);
  line(c, [[0, 0], [0, -h * level]], 10, RED); shape(c, () => ell(c, 0, 0, 24, 24), RED, 5);
  c.restore();
};
const chain = (c: Ctx, v: number[][], n: number) => { // dots along a polyline
  line(c, v, 7, RED); const seg: number[] = []; let tot = 0; for (let i = 1; i < v.length; i++) { const d = Math.hypot(v[i][0] - v[i - 1][0], v[i][1] - v[i - 1][1]); seg.push(d); tot += d; }
  for (let k = 0; k < n; k++) { let t = (tot * k) / (n - 1), i = 0; while (i < seg.length - 1 && t > seg[i]) { t -= seg[i]; i++; } const f = Math.min(1, t / seg[i]); shape(c, () => ell(c, v[i][0] + (v[i + 1][0] - v[i][0]) * f, v[i][1] + (v[i + 1][1] - v[i][1]) * f, 13, 13), WHITE, 4); }
};

// ---------------------------------------------------------------- flows
const f_e1 = (c: Ctx) => {
  ground(c, WALL); table(c, 760);
  bottle(c, 290, 760, 190, 360, false); bottle(c, 790, 760, 190, 360, true);
  for (const [a, b] of [[[170, 520], [95, 470]], [[410, 520], [485, 470]], [[290, 330], [290, 250]], [[200, 330], [150, 270]], [[380, 330], [430, 270]]]) arrow(c, [a, b], RED, 12);
  arrow(c, [[670, 560], [630, 540]], RED, 8); arrow(c, [[910, 560], [950, 540]], RED, 8);
};
const f_e3 = (c: Ctx) => {
  ground(c, WALL); table(c, 760);
  // the shelled egg, cut open at the front to see in
  shadow(c, 330, 770, 190, 22);
  shape(c, () => ell(c, 300, 520, 170, 235), "#fff7e6", 6);
  shape(c, () => ell(c, 300, 520, 125, 190), "#f4ecd8", 4);
  [[250, 460], [350, 470], [300, 560], [230, 590], [370, 580], [300, 400]].forEach(([x, y]) => jellyBall(c, x, y, 38));
  line(c, [[130, 520], [470, 520]], 22, "#f3e4a8"); line(c, [[130, 520], [470, 520]], 4, "#d9c06a");
  // the open bowl with dried, shrunken seeds
  bowl(c, 760, 600, 190); [[700, 604], [770, 612], [830, 600], [740, 625], [800, 630]].forEach(([x, y]) => jellyBall(c, x, y - 10, 30, true));
  [[650, 400, 0], [760, 360, 1], [860, 410, 0]].forEach(([x, y]) => { arrow(c, [[x, y + 80], [x, y - 60]], RED, 10); drop(c, x, y - 100, 16); });
};
const f_a1 = (c: Ctx) => {
  ground(c, WALL); table(c, 800);
  spoon(c, 430, 330, 380, Math.PI / 2);
  hand2(c, 240, 560, 0, 2.2);
  for (const dx of [-70, 0, 70]) wave(c, 520 + dx, 420, 120);
  spoon(c, 760, 740, 270, 0.1);
};
const f_a2 = (c: Ctx) => {
  ground(c, WALL); table(c, 840);
  quad(c, 450, 640, 1.5, { col: "#d9a066", dk: "#b57d44" });
  for (const [x, y] of [[330, 540], [415, 532], [500, 532]]) { shape(c, () => ell(c, x, y, 18, 14), WHITE, 4); ring(c, x, y, 36); }
  hand2(c, 600, 365, Math.PI / 2, 1.6, true);
};
const f_a3 = (c: Ctx) => {
  ground(c, WALL); table(c, 840);
  bowl(c, 250, 760, 150, COL.water);
  hand2(c, 240, 760, -Math.PI / 2 - 0.4, 2.3, true);
  for (const [x, y] of [[190, 520], [250, 500], [300, 540], [150, 570], [330, 600]]) drop(c, x, y, 12);
  // a folded paper fan
  c.save(); c.translate(820, 720); c.rotate(-0.5);
  for (let i = 0; i < 7; i++) { const a0 = -Math.PI * 0.9 + i * 0.27, a1 = a0 + 0.27; shape(c, () => { c.moveTo(0, 0); c.arc(0, 0, 330, a0, a1); c.closePath(); }, i % 2 ? "#fff3c8" : "#f6d86f", 4); }
  shape(c, () => ell(c, 0, 0, 22, 22), COL.brown, 4); c.restore();
  for (const dy of [-70, 0, 70]) arrow(c, [[500, 600 + dy], [440, 610 + dy * 0.8], [370, 620 + dy * 0.6]], COOLB, 10);
};
const f_a4 = (c: Ctx) => {
  ground(c, WALL); table(c, 780);
  bottle(c, 330, 780, 230, 520); bottle(c, 760, 780, 120, 250);
  write(c, "40", 262, 470, 90, INK, 12); write(c, "40", 712, 595, 56, INK, 9);
  for (const [a, b] of [[[190, 620], [120, 580]], [[470, 620], [540, 580]]]) arrow(c, [a, b], RED, 10);
  for (const [a, b] of [[[670, 640], [610, 610]], [[850, 640], [910, 610]]]) arrow(c, [a, b], RED, 10);
};
const f_a5 = (c: Ctx) => {
  ground(c, WALL); table(c, 800);
  // a digital thermometer
  c.save(); c.translate(380, 360); c.rotate(-0.45);
  shape(c, () => rrect(c, -260, -45, 520, 90, 40), "#dfe8f3", 6); shape(c, () => rrect(c, 170, -40, 82, 80, 34), COL.blue, 5);
  shape(c, () => rrect(c, -160, -30, 190, 60, 10), "#22303a", 5);
  c.restore();
  c.save(); c.translate(380, 360); c.rotate(-0.45); write(c, "37", -145, -22, 44, "#c9f06b", 8); write(c, "°", -60, -26, 26, "#c9f06b", 6); c.beginPath(); c.arc(-27, 0, 15, 0.8, Math.PI * 2 - 0.8); c.strokeStyle = "#c9f06b"; c.lineWidth = 6; c.stroke(); c.restore();
  // a glass air thermometer
  thermoV(c, 760, 740, 480, 0.55);
  // the diary
  shape(c, () => rrect(c, 620, 130, 360, 300, 16), "#fffaf0", 6);
  for (let i = 0; i < 3; i++) { line(c, [[640, 210 + i * 70], [960, 210 + i * 70]], 3, COL.steelDk); write(c, ["26", "28", "25"][i], 680, 160 + i * 70, 44, INK, 7); write(c, "37", 820, 160 + i * 70, 44, RED, 7); }
};
const f_a6 = (c: Ctx) => {
  ground(c);
  [[190, "#dcecf7"], [540, "#fbf4e2"], [890, "#e9f4ef"]].forEach(([x, col]) => shape(c, () => ell(c, x as number, 540, 165, 165), col as string, 6));
  // many eggs left alone
  const rr = [[-70, -90], [-20, -100], [40, -85], [-100, -30], [-45, -40], [10, -35], [70, -30], [-80, 25], [-25, 30], [35, 25], [90, 20], [-60, 80], [0, 85], [60, 75]];
  rr.forEach(([dx, dy]) => jellyBall(c, 190 + dx * 1.2, 540 + dy * 1.15 + 5, 26));
  // a nest with two chicks and a parent bird
  shape(c, () => ell(c, 540, 640, 110, 40), COL.brown, 5);
  for (const dx of [-45, 45]) { shape(c, () => ell(c, 540 + dx, 595, 32, 34), COL.yellow, 5); shape(c, () => polyP(c, [[540 + dx - 18, 575], [540 + dx + 18, 575], [540 + dx, 540]]), COL.orange, 4); }
  bird(c, 450, 470, 0.5);
  shape(c, () => ell(c, 540, 640, 110, 22), "rgba(0,0,0,0)", 5);
  // mother and calf
  quad(c, 880, 520, 0.56, { spots: true, horns: "short", udder: true }); quad(c, 935, 585, 0.3, { flip: true, spots: true });
};
const f_c1 = (c: Ctx) => {
  ground(c, WALL); table(c, 800);
  sun(c, 540, 170, 70);
  arrow(c, [[460, 260], [350, 400]], RED, 10); arrow(c, [[620, 260], [740, 400]], RED, 10);
  // a bare ice cube melting into a puddle
  shadow(c, 300, 790, 170, 22); shape(c, () => ell(c, 300, 770, 190, 34), COL.water, 5);
  shape(c, () => rrect(c, 235, 620, 130, 130, 24), ICE, 6); shade(c, () => rrect(c, 235, 620, 130, 130, 24), ICEDK, 18, 18, 0.7); shine(c, [[255, 640], [255, 700]], 8);
  for (const [x, y] of [[385, 700], [225, 725]]) drop(c, x, y, 12);
  // an ice cube wrapped up in a woollen sock
  shadow(c, 770, 790, 150, 20);
  shape(c, () => ell(c, 770, 790, 150, 22), COL.steel, 5);
  shape(c, () => rrect(c, 710, 520, 120, 120, 22), ICE, 6); shine(c, [[728, 540], [728, 590]], 8);
  const sk = () => rrect(c, 665, 590, 210, 200, 70); shape(c, sk, WOOL, 6); shade(c, sk, WOOLDK, 28, 20, 0.6);
  for (let i = 1; i < 6; i++) line(c, [[665 + i * 35, 630], [665 + i * 35, 770]], 3, WOOLDK);
  shape(c, () => rrect(c, 665, 590, 210, 46, 20), COL.red, 5);
};

// ---------------------------------------------------------------- terms
const t0 = (c: Ctx) => { // vertebrate: a fish, a bird and a dog, each with its backbone showing
  ground(c);
  const sp = (x: number, y: number, s: number, v: number[][], n: number) => chain(c, v.map(([a, b]) => [x + a * s, y + b * s]), n);
  fish(c, 270, 310, 1.2); sp(270, 310, 1.2, [[-100, 0], [0, -6], [110, -2]], 8);
  bird(c, 790, 330, 1.2); sp(790, 330, 1.2, [[-80, 0], [-20, -30], [40, -50], [85, -62]], 7);
  quad(c, 480, 790, 1.35, { col: "#d9a066", dk: "#b57d44" }); sp(480, 790, 1.35, [[-125, -30], [0, -40], [110, -40], [175, -28]], 10);
};
const t1 = (c: Ctx) => { // backbone: a chain of small bones with the nerve inside
  ground(c);
  const P = (t: number) => [540 + Math.sin(t * Math.PI * 1.3 + 0.4) * 80, 270 + t * 700];
  const pts: number[][] = []; for (let i = 0; i <= 40; i++) pts.push(P(i / 40));
  line(c, pts, 34, INK); line(c, pts, 20, COL.yellow);
  shape(c, () => ell(c, 540 + Math.sin(0.4) * 80, 190, 100, 90), BONE, 6); shape(c, () => ell(c, 500, 175, 24, 30), INK, 0); shape(c, () => ell(c, 580, 175, 24, 30), INK, 0);
  for (let i = 0; i < 11; i++) { const t = i / 10, [x, y] = P(t * 0.97 + 0.03), w = 80 + t * 50; shape(c, () => rrect(c, x - w / 2, y - 28, w, 56, 26), BONE, 6); shade(c, () => rrect(c, x - w / 2, y - 28, w, 56, 26), BONE_DK, 8, 8, 0.8); shape(c, () => ell(c, x, y, 13, 13), COL.yellow, 4); }
};
const t7 = (c: Ctx) => { // gills: water in at the mouth, out behind the gill cover
  ground(c, "#dcecf7");
  fish(c, 470, 540, 1.9, { glow: true });
  c.save(); c.translate(470, 540); c.scale(1.9, 1.9); for (let i = -4; i <= 4; i++) line(c, [[62 + Math.abs(i) * 2 - 6, i * 10], [78 + Math.abs(i) * 2, i * 10 + 2]], 4, "#a02a1e"); c.restore();
  arrow(c, [[960, 540], [850, 540], [770, 540]], COOLB, 14); arrow(c, [[560, 700], [470, 790], [360, 810]], COOLB, 14);
  for (const [x, y, r] of [[200, 300, 22], [250, 220, 14], [880, 340, 18], [150, 780, 16]]) shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.7)", 4);
};
const t8 = (c: Ctx) => { // lungs: air in at the nose and mouth, two soft lungs in the chest
  ground(c);
  person(c, 560, 1010, 780, {});
  const lung = (x: number, sg: number) => { shape(c, () => { c.moveTo(x - sg * 8, 450); c.bezierCurveTo(x + sg * 60, 435, x + sg * 70, 525, x + sg * 55, 615); c.quadraticCurveTo(x, 645, x - sg * 20, 595); c.bezierCurveTo(x - sg * 30, 535, x - sg * 20, 475, x - sg * 8, 450); c.closePath(); }, PINK, 6); shade(c, () => { c.moveTo(x - sg * 8, 450); c.bezierCurveTo(x + sg * 60, 435, x + sg * 70, 525, x + sg * 55, 615); c.quadraticCurveTo(x, 645, x - sg * 20, 595); c.bezierCurveTo(x - sg * 30, 535, x - sg * 20, 475, x - sg * 8, 450); c.closePath(); }, PINK_DK, 10, 10, 0.5); };
  line(c, [[560, 375], [560, 470]], 12, INK); line(c, [[560, 375], [560, 470]], 6, "#f7d6df");
  lung(530, -1); lung(590, 1);
  line(c, [[560, 470], [535, 505]], 10, INK); line(c, [[560, 470], [585, 505]], 10, INK); line(c, [[560, 470], [535, 505]], 5, "#f7d6df"); line(c, [[560, 470], [585, 505]], 5, "#f7d6df");
  arrow(c, [[230, 280], [340, 330], [470, 360]], COOLB, 14);
};
const t10 = (c: Ctx) => { // body heat: food gives the body its warmth
  ground(c, WARMBG);
  person(c, 300, 1000, 700, {});
  for (const dx of [-90, -30, 30, 90]) wave(c, 300 + dx, 330, 90, RED, 9);
  plate(c, 780, 800, 230, 80);
  for (const [x, y] of [[740, 790], [830, 780]]) { shape(c, () => ell(c, x, y, 110, 40), "#e8b66a", 5); for (const [dx, dy] of [[-40, -6], [20, 8], [50, -10]]) shape(c, () => ell(c, x + dx, y + dy, 9, 5), "#a8723f", 0); }
  arrow(c, [[690, 690], [590, 640], [490, 640]], RED, 14);
};
const t11 = (c: Ctx) => { // makes its own heat: a small bird warm inside on a cold day
  ground(c, COLD);
  for (const [x, y, r] of [[150, 160, 36], [900, 200, 40], [250, 880, 30], [860, 860, 36], [520, 110, 28], [90, 560, 28], [980, 600, 32]]) flake(c, x, y, r);
  c.save(); c.translate(0, 0); bird(c, 520, 520, 2.0, { glow: true }); c.restore();
  for (const dx of [-150, -60, 40, 130]) wave(c, 520 + dx, 380, 80, RED, 9);
};
const t12 = (c: Ctx) => { // takes heat from outside: a lizard warming in the sun on a rock
  ground(c, WARMBG);
  sun(c, 880, 170, 100);
  shape(c, () => { c.moveTo(40, 980); c.bezierCurveTo(130, 760, 900, 760, 1040, 980); c.closePath(); }, COL.grey, 6);
  shade(c, () => { c.moveTo(40, 980); c.bezierCurveTo(130, 760, 900, 760, 1040, 980); c.closePath(); }, COL.greyDk, 40, 40, 0.5);
  lizard(c, 600, 622, 1.6);
  arrow(c, [[790, 290], [740, 380], [690, 450]], RED, 14);
};
const t14 = (c: Ctx) => { // thermometer in a glass of water
  ground(c, WALL); table(c, 860);
  glass(c, 540, 880, 380, 480, 0.7);
  thermoV(c, 600, 800, 640, 0.5, 0.12);
};
const t15 = (c: Ctx) => { // insulation: a thick coat slows heat from leaving (and cold from coming in)
  ground(c, COLD);
  for (const [x, y, r] of [[130, 180, 34], [940, 170, 38], [150, 880, 32], [930, 860, 34]]) flake(c, x, y, r);
  const cx = 520, cy = 520;
  for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2; shape(c, () => ell(c, cx + Math.cos(a) * 200, cy + Math.sin(a) * 160, 56, 56), BELLY, 6); }
  bird(c, cx, cy, 1.4, { glow: true });
  for (const a of [Math.PI * 0.55, Math.PI * 0.95, Math.PI * 1.45, Math.PI * 0.05]) {
    const sx = cx + Math.cos(a) * 120, sy = cy + Math.sin(a) * 100, ex = cx + Math.cos(a) * 250, ey = cy + Math.sin(a) * 215;
    arrow(c, [[sx, sy], [(sx + ex) / 2, (sy + ey) / 2]], RED, 9);
    arrow(c, [[cx + Math.cos(a) * 440, cy + Math.sin(a) * 400], [ex + Math.cos(a) * 20, ey + Math.sin(a) * 20]], COOLB, 9);
  }
};
const t17 = (c: Ctx) => { // panting: mouth open, tongue out, in the heat
  ground(c, WARMBG);
  sun(c, 170, 170, 85);
  quad(c, 360, 540, 1.6, { col: "#d9a066", dk: "#b57d44", tongue: true });
  for (const [x, y] of [[820, 640], [880, 600], [940, 640]]) arrow(c, [[x - 30, y + 20], [x, y - 10], [x + 30, y + 20]], COOLB, 9);
};
const t18 = (c: Ctx) => { // egg: a package with food and a growing baby
  ground(c, WALL);
  shadow(c, 560, 940, 260, 34);
  shape(c, () => ell(c, 540, 520, 270, 380), "#fff7e6", 7);
  shape(c, () => ell(c, 540, 520, 215, 320), "#fffdf5", 5);
  shape(c, () => ell(c, 540, 600, 130, 130), COL.yellow, 6); shade(c, () => ell(c, 540, 600, 130, 130), COL.orange, 20, 20, 0.5);
  shape(c, () => ell(c, 540, 460, 80, 75), "#f0b8c0", 5); // the chick curled on top of the yolk
  shape(c, () => ell(c, 500, 410, 42, 40), "#f0b8c0", 5); eye(c, 490, 405, 9); shape(c, () => polyP(c, [[470, 420], [440, 432], [472, 440]]), BEAK, 4);
  shape(c, () => ell(c, 560, 470, 40, 28, 0.4), "#e89aa4", 4);
};
const t19 = (c: Ctx) => { // shelled egg: hard or leathery shell for eggs laid on dry land
  ground(c, WARMBG);
  sun(c, 880, 160, 80);
  shape(c, () => { c.moveTo(0, 700); c.quadraticCurveTo(540, 640, 1080, 700); c.lineTo(1080, 1080); c.lineTo(0, 1080); c.closePath(); }, SAND, 6);
  shade(c, () => { c.moveTo(0, 700); c.quadraticCurveTo(540, 640, 1080, 700); c.lineTo(1080, 1080); c.lineTo(0, 1080); c.closePath(); }, SAND_DK, 0, 40, 0.5);
  shadow(c, 300, 850, 200, 26); shadow(c, 770, 850, 200, 26);
  shape(c, () => ell(c, 280, 650, 170, 220), "#fffaf0", 7);
  for (const [x, y] of [[230, 560], [320, 600], [260, 700], [350, 720], [220, 640]]) shape(c, () => ell(c, x, y, 9, 6), "#a8723f", 0);
  shape(c, () => ell(c, 770, 700, 200, 150, 0.1), "#efe3c2", 7);
  for (const [x, y] of [[700, 660], [800, 640], [760, 730], [850, 710]]) { c.beginPath(); c.arc(x, y, 18, 0.3, 2.6); c.strokeStyle = "#b9a577"; c.lineWidth = 5; c.stroke(); }
};
const t20 = (c: Ctx) => { // milk: a mother makes it, her baby drinks it
  ground(c, WALL); table(c, 800);
  quad(c, 430, 470, 1.3, { spots: true, horns: "short", udder: true });
  quad(c, 499, 565, 0.68, { flip: true, spots: true });
  shape(c, () => rrect(c, 830, 580, 150, 220, 20), COL.steel, 6); shape(c, () => rrect(c, 836, 625, 138, 168, 14), WHITE, 0); shine(c, [[852, 600], [852, 780]], 6);
};

// ---------------------------------------------------------------- explanations
const x_five = (c: Ctx) => {
  ground(c);
  const P: [number, number][] = [[50, 130], [380, 130], [710, 130], [215, 570], [545, 570]];
  P.forEach(([px, py], i) => panel(c, px, py, 320, 340, i % 2 ? "#e9f4ef" : "#fbf4e2"));
  fish(c, 215, 300, 0.85); frog(c, 520, 310, 0.95); lizard(c, 872, 300, 0.56);
  bird(c, 395, 735, 0.9); quad(c, 680, 730, 0.7, { spots: true, horns: "short" });
};
const x_gill = (c: Ctx) => { // how fish breathe: oxygen passes from the water into the gills
  ground(c, "#dcecf7");
  fish(c, 500, 540, 1.5, { glow: true });
  arrow(c, [[930, 540], [850, 540], [750, 540]], COOLB, 12);
  arrow(c, [[540, 640], [470, 740], [350, 760]], COOLB, 12);
  for (const [x, y] of [[860, 470], [800, 600], [900, 610], [820, 430], [940, 450]]) { shape(c, () => ell(c, x, y, 16, 16), WHITE, 4); }
  for (const [x, y, r] of [[160, 280, 20], [210, 200, 13], [920, 250, 16]]) shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.7)", 4);
};
const x_warm2 = (c: Ctx) => { // two ways to keep warm: make heat inside, or take it from the sun
  ground(c);
  shape(c, () => rrect(c, 30, 200, 490, 680, 34), COLD, 5); shape(c, () => rrect(c, 560, 200, 490, 680, 34), WARMBG, 5);
  bird(c, 280, 560, 1.15, { glow: true }); for (const dx of [-70, 0, 70]) wave(c, 280 + dx, 410, 70, RED, 8);
  flake(c, 90, 270, 24); flake(c, 460, 280, 26);
  lizard(c, 800, 690, 0.72); sun(c, 940, 330, 62); arrow(c, [[890, 400], [840, 500], [800, 600]], RED, 12);
};
const x_huddle = (c: Ctx) => { // keeping warm: birds fluff their feathers and huddle together
  ground(c, COLD);
  for (const [x, y, r] of [[120, 200, 32], [960, 180, 36], [540, 130, 26], [100, 860, 30], [980, 880, 32]]) flake(c, x, y, r);
  shape(c, () => rrect(c, 40, 720, 1000, 36, 18), COL.brown, 6);
  for (const x of [250, 540, 830]) { for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; shape(c, () => ell(c, x + Math.cos(a) * 105, 530 + Math.sin(a) * 90, 42, 42), BELLY, 5); } }
  [250, 540, 830].forEach((x) => bird(c, x, 530, 0.8, { glow: true }));
  for (const x of [395, 685]) wave(c, x, 400, 90, RED, 9);
};
const x_cool = (c: Ctx) => { // keeping cool: a buffalo wallowing in mud
  ground(c, WARMBG);
  sun(c, 900, 160, 80);
  shape(c, () => ell(c, 540, 800, 480, 100), COL.soil, 6);
  quad(c, 460, 520, 1.5, { col: "#6f6a73", dk: "#4f4a53", horns: "long" });
  shape(c, () => ell(c, 540, 830, 480, 80), COL.soil, 6);
  for (const [x, y] of [[320, 450], [440, 440], [580, 460], [400, 500]]) shape(c, () => ell(c, x, y, 28, 18), COL.soil, 4);
};
const x_food = (c: Ctx) => { // making your own heat costs lots of food
  ground(c);
  panel(c, 30, 170, 490, 740, "#fbf4e2"); panel(c, 560, 170, 490, 740, "#e9f4ef");
  lizard(c, 300, 450, 0.85);
  for (const dx of [-24, 0, 24]) { line(c, [[400 + dx, 700], [400 + dx * 2, 730]], 5); line(c, [[400 + dx, 700], [400 + dx * 2, 670]], 5); }
  shape(c, () => ell(c, 400, 700, 34, 26), "#4a3a2a", 5);
  bird(c, 800, 420, 1.0);
  for (let i = 0; i < 45; i++) { const row = Math.floor(i / 9), x = 640 + (i % 9) * 46 + (row % 2) * 23, y = 840 - row * 34; shape(c, () => ell(c, x, y, 23, 15, (i % 5) * 0.4), i % 3 ? "#d9a34a" : "#b9812f", 3); }
};

export const KEYS: string[] = ["flow.e1", "flow.e3", "flow.a1", "flow.a2", "flow.a3", "flow.a4", "flow.a5", "flow.a6", "flow.c1", "term.0", "term.1", "term.7", "term.8", "term.10", "term.11", "term.12", "term.14", "term.15", "term.17", "term.18", "term.19", "term.20", "expl.0", "expl.1", "expl.3", "expl.5", "expl.6", "expl.7"];
export const ic_animalsVertebrateGroupsL3 = cards("sci.animals.vertebrate-groups.L3 cards", [f_e1, f_e3, f_a1, f_a2, f_a3, f_a4, f_a5, f_a6, f_c1, t0, t1, t7, t8, t10, t11, t12, t14, t15, t17, t18, t19, t20, x_five, x_gill, x_warm2, x_huddle, x_cool, x_food]);
