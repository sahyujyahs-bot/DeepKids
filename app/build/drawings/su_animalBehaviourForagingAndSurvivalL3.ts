import type { Ctx } from "./core";
import { INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, bowl, hand, write, cards, rnd } from "./flatKit";

// Paper caterpillars set-up cards: newspaper (grey print lines) and plain white strips, a steel bowl, a thread.
const NEWS = "#e9e0c9", NEWSDK = "#cfc4a8", PRINT = "#aaa293";

// a newspaper sheet (quad), print lines clipped inside
const sheet = (c: Ctx, q: number[][], seedN = 3) => {
  const ys = q.map((p) => p[1]), top = Math.min(...ys), bot = Math.max(...ys);
  shadow(c, (q[0][0] + q[1][0]) / 2 + 20, bot + 12, (q[1][0] - q[0][0]) / 2 + 40, 26);
  shape(c, () => polyP(c, q), NEWS, 6);
  c.save(); c.beginPath(); polyP(c, q); c.clip();
  const r = rnd(seedN);
  for (let y = top + 22; y < bot; y += 18) { for (let x = 0; x < D1; x += 30 + r() * 60) { if (r() < 0.3) continue; line(c, [[x, y], [x + 20 + r() * 40, y]], 3.5, PRINT); } }
  c.restore();
  shape(c, () => polyP(c, q), "rgba(0,0,0,0)", 6);
};
const D1 = 1080;
// a paper strip centred at (x,y), length L, thickness t, rotated; news = printed
const strip = (c: Ctx, x: number, y: number, L: number, t: number, rot: number, news: boolean, faint = false) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  c.beginPath(); rrect(c, -L / 2, -t / 2, L, t, 3); c.fillStyle = news ? NEWS : COL.paper; c.fill();
  c.lineWidth = faint ? 3 : Math.max(4, t * 0.12); c.strokeStyle = faint ? "#cfc9bb" : INK; c.lineJoin = "round"; c.stroke();
  if (news) { c.save(); c.clip(); for (let k = 0; k < Math.max(2, Math.floor(t / 11)); k++) line(c, [[-L / 2 + 6, -t / 2 + 7 + k * 10], [L / 2 - 6, -t / 2 + 7 + k * 10]], 3.5, PRINT); c.restore(); }
  c.restore();
};
const pile = (c: Ctx, x: number, y: number, news: boolean, n: number) => {
  shadow(c, x + 15, y + 55, 150, 30);
  for (let i = 0; i < n; i++) strip(c, x + (i % 2 ? 8 : -8), y - i * 30 + 30, 210, 48, (i % 2 ? 0.03 : -0.03), news);
};
const thread = "#d7372b";
// something held in a hand: drawn in the hand's own frame (x forward from the wrist), then the hand over it
const held = (c: Ctx, x: number, y: number, an: number, s: number, draw: () => void) => { c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s); draw(); c.restore(); };

// ---- e1
const e1s0 = (c: Ctx) => {
  ground(c);
  sheet(c, [[250, 100], [830, 100], [860, 520], [220, 520]]);
  line(c, [[540, 520], [540, 380]], 8, BG);
  arrow(c, [[640, 440], [640, 230]], RED, 12);
  held(c, 540, 960, -Math.PI / 2, 1.5, () => {
    for (const d of [-1, 1]) shape(c, () => polyP(c, [[70, 0], [310, d * 14], [70, d * 40]]), COL.steel, 4);
    shape(c, () => ell(c, 85, 0, 14, 14), COL.steelDk, 4);
    shape(c, () => rrect(c, 20, -44, 60, 88, 20), COL.orange, 5);
  });
  hand(c, 540, 960, -Math.PI / 2, 1.5, SKIN.child, CLOTH.child, false);
  pile(c, 150, 720, true, 5); write(c, "20", 75, 850, 90, INK, 12);
  pile(c, 930, 720, false, 5); write(c, "20", 855, 850, 90, INK, 12);
};
const e1s1 = (c: Ctx) => {
  ground(c);
  sheet(c, [[220, 400], [860, 400], [1000, 980], [80, 980]], 5);
  const r = rnd(21);
  for (let i = 0; i < 14; i++) strip(c, 200 + r() * 680, 480 + r() * 440, 120, 28, r() * 3, i % 2 === 0, false);
  // the child, eyes closed
  const x = 800, hy = 180, hd = 110;
  shape(c, () => rrect(c, x - 150, 290, 300, 160, 60), CLOTH.child);
  shade(c, () => rrect(c, x - 150, 290, 300, 160, 60), CLOTH.childDk, 40, 0);
  shape(c, () => ell(c, x, hy, hd, hd * 1.05), SKIN.child);
  shape(c, () => { c.moveTo(x - hd * 1.02, hy); c.bezierCurveTo(x - hd, hy - hd * 1.5, x + hd, hy - hd * 1.5, x + hd * 1.02, hy); c.quadraticCurveTo(x, hy - hd * 0.5, x - hd * 1.02, hy); c.closePath(); }, CLOTH.hair, 5);
  for (const s of [-1, 1]) { c.beginPath(); c.arc(x + s * 38, hy + 14, 20, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); }
  c.beginPath(); c.arc(x, hy + 62, 26, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  // the grown-up's hand scattering strips, red arrow
  hand(c, 110, 190, 0.5, 1.2, SKIN.adult, CLOTH.adult, true);
  strip(c, 300, 300, 120, 28, 0.6, true); strip(c, 380, 350, 120, 28, -0.5, false);
  arrow(c, [[270, 340], [360, 440]], RED, 12);
};
const e1s2 = (c: Ctx) => {
  ground(c);
  sheet(c, [[100, 700], [980, 700], [1060, 1040], [20, 1040]], 8);
  const r = rnd(33);
  for (let i = 0; i < 9; i++) strip(c, 150 + r() * 760, 790 + r() * 200, 120, 28, r() * 3, i % 2 === 0);
  bowl(c, 780, 640, 190);
  strip(c, 740, 640, 130, 30, 0.2, false); strip(c, 810, 645, 130, 30, -0.3, false);
  held(c, 150, 620, -0.6, 1.8, () => strip(c, 130, 0, 150, 26, 0, false));
  hand(c, 150, 620, -0.6, 1.8, SKIN.child, CLOTH.child, false);
  arrow(c, [[520, 400], [650, 380], [730, 470]], RED, 12);
  shape(c, () => rrect(c, 70, 40, 230, 340, 36), COL.black);
  shape(c, () => rrect(c, 90, 70, 190, 280, 20), COL.sky, 4);
  shape(c, () => ell(c, 185, 190, 70, 70), WHITE, 5);
  line(c, [[185, 190], [185, 140]], 7, RED);
  line(c, [[185, 190], [225, 210]], 7, INK);
  write(c, "20", 140, 280, 38, INK, 7);
};
const e1s3 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 990, 460, 40);
  const q = [[150, 340], [930, 340], [1020, 960], [60, 960]];
  shape(c, () => polyP(c, q), COL.cloth, 6);
  shade(c, () => polyP(c, q), "#e4dccb", 30, 0, 0.5);
  const r = rnd(44);
  for (let i = 0; i < 18; i++) { const n = i % 2 === 0; strip(c, 520 + r() * 380, 420 + r() * 460, 120, 28, r() * 3, n, !n); }
  hand(c, 210, 640, 0.1, 1.8, SKIN.adult, CLOTH.adult, true);
  arrow(c, [[300, 240], [560, 240], [760, 270]], RED, 12);
};
// ---- e2
const holes = (c: Ctx, hs: number[][]) => hs.forEach(([x, y]) => { shape(c, () => ell(c, x, y, 26, 16), INK, 0); shape(c, () => ell(c, x - 3, y - 3, 20, 11), "#4a4258", 0); });
const e2s0 = (c: Ctx) => {
  ground(c);
  sheet(c, [[170, 80], [910, 80], [980, 620], [100, 620]], 12);
  holes(c, [[370, 240], [540, 320], [710, 240]]);
  c.save(); c.setLineDash([16, 14]); line(c, [[540, 330], [540, 620]], 7, "#e08a7f"); c.restore();
  strip(c, 540, 305, 200, 44, 0, true);
  line(c, [[540, 620], [540, 840]], 8, thread);
  hand(c, 540, 935, -Math.PI / 2, 1.5, SKIN.adult, CLOTH.adult, false);
  arrow(c, [[740, 690], [740, 850]], RED, 12);
};
const e2s1 = (c: Ctx) => {
  ground(c);
  sheet(c, [[400, 560], [1000, 560], [1050, 980], [340, 980]], 14);
  holes(c, [[560, 800], [720, 860], [880, 800]]);
  const x = 190, hy = 230, hd = 100;
  shadow(c, x + 20, 900, 120, 24);
  for (const s of [-1, 1]) { line(c, [[x + s * 40, 700], [x + s * 42, 890]], 70, INK); line(c, [[x + s * 40, 700], [x + s * 42, 890]], 56, "#6b5a8c"); }
  shape(c, () => rrect(c, x - 115, 330, 230, 400, 60), CLOTH.child);
  shade(c, () => rrect(c, x - 115, 330, 230, 400, 60), CLOTH.childDk, 40, 0);
  shape(c, () => ell(c, x - hd * 0.98, hy + 20, 20, 30), SKIN.child, 4); shape(c, () => ell(c, x + hd * 0.98, hy + 20, 20, 30), SKIN.child, 4);
  shape(c, () => ell(c, x, hy, hd, hd * 1.05), CLOTH.hair);
  shape(c, () => ell(c, x, hy + 90, 34, 22), SKIN.child, 0);
  held(c, 950, 380, Math.PI - 0.75, 1.6, () => strip(c, 130, 0, 160, 28, 0, true));
  hand(c, 950, 380, Math.PI - 0.75, 1.6, SKIN.adult, CLOTH.adult, false);
  arrow(c, [[560, 560], [610, 660], [690, 740]], RED, 12);
};
const e2s2 = (c: Ctx) => {
  ground(c);
  sheet(c, [[100, 680], [960, 680], [1040, 1040], [30, 1040]], 16);
  holes(c, [[300, 840], [480, 920], [660, 840]]);
  strip(c, 480, 905, 190, 42, 0.05, true);
  line(c, [[370, 880], [350, 915]], 7, RED); line(c, [[590, 880], [612, 915]], 7, RED);
  hand(c, 200, 330, 0.9, 1.8, SKIN.child, CLOTH.child, true);
  arrow(c, [[270, 560], [350, 650], [420, 740]], RED, 12);
  shape(c, () => rrect(c, 680, 150, 200, 330, 32), COL.black);
  shape(c, () => rrect(c, 698, 176, 164, 250, 18), COL.sky, 4);
  shape(c, () => ell(c, 780, 275, 56, 56), WHITE, 5);
  line(c, [[780, 275], [780, 235]], 6, RED); line(c, [[780, 275], [810, 292]], 6, INK);
  write(c, "03", 745, 350, 30, INK, 6);
  hand(c, 780, 600, -Math.PI / 2, 1.5, SKIN.adult, CLOTH.adult, false);
};
const D = 1080; void D; void BG; void WHITE;
export const su_animalBehaviourForagingAndSurvivalL3 = cards("sci.animal-behaviour.foraging-and-survival.L3 set-up", [e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2]);
