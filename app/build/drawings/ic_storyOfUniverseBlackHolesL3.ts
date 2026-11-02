import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, write, cards } from "./flatKit";

// sci.story-of-universe.black-holes.L3 · picture cards (flows, terms, explanations).
const SPACE = "#1d2140", SPACE2 = "#2c3262", HOLE = "#050308", PAPER = "#35313f", PAPERDK = "#25222e", TABLE = "#e8cf9c", TABLEDK = "#c9a96b";
const DOUGH = "#f2d8a0", DOUGHDK = "#d9b878";

const space = (c: Ctx, n = 40, seedN = 5) => {
  c.fillStyle = SPACE; c.fillRect(0, 0, D, D);
  const r = rnd(seedN);
  for (let i = 0; i < n; i++) { const x = 30 + r() * (D - 60), y = 30 + r() * (D - 60), s = 3 + r() * 4; c.beginPath(); ell(c, x, y, s, s); c.fillStyle = "#fff6c8"; c.fill(); }
};
const starsIn = (c: Ctx, x0: number, y0: number, x1: number, y1: number, n: number, seedN: number) => {
  const r = rnd(seedN);
  for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), s = 2.5 + r() * 3.5; c.beginPath(); ell(c, x, y, s, s); c.fillStyle = "#fff6c8"; c.fill(); }
};
// a ray of light: yellow arrow with a dark edge
const ray = (c: Ctx, pts: number[][], w = 12) => { arrow(c, pts, INK, w + 8); arrow(c, pts, COL.yellow, w); };
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.65, y + Math.sin(a) * r * 1.65]], Math.max(5, r * 0.14), COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, Math.max(4, r * 0.08));
  shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.3, r * 0.3, 0.5);
};
const earth = (c: Ctx, x: number, y: number, r: number) => {
  const body = () => ell(c, x, y, r, r);
  shape(c, body, COL.blue, Math.max(4, r * 0.06));
  c.save(); c.beginPath(); body(); c.clip();
  shape(c, () => { c.moveTo(x - r * 0.6, y - r * 0.35); c.bezierCurveTo(x - r * 0.3, y - r * 0.8, x + r * 0.1, y - r * 0.5, x - r * 0.05, y - r * 0.15); c.bezierCurveTo(x - r * 0.2, y + r * 0.05, x - r * 0.5, y + r * 0.1, x - r * 0.6, y - r * 0.35); c.closePath(); }, COL.green, Math.max(3, r * 0.04));
  shape(c, () => { c.moveTo(x + r * 0.2, y + r * 0.1); c.bezierCurveTo(x + r * 0.6, y - r * 0.1, x + r * 0.8, y + r * 0.3, x + r * 0.45, y + r * 0.7); c.bezierCurveTo(x + r * 0.2, y + r * 0.6, x + r * 0.1, y + r * 0.3, x + r * 0.2, y + r * 0.1); c.closePath(); }, COL.green, Math.max(3, r * 0.04));
  c.restore();
  shade(c, body, COL.blueDk, r * 0.35, r * 0.3, 0.5);
  c.beginPath(); body(); c.strokeStyle = INK; c.lineWidth = Math.max(4, r * 0.06); c.stroke();
};
// a black hole: black disc with a bright ring of hot gas round it
const bh = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r * 1.9, r * 1.9), COL.orange, Math.max(3, r * 0.1));
  shape(c, () => ell(c, x, y, r * 1.45, r * 1.45), COL.yellow, 0);
  shape(c, () => ell(c, x, y, r, r), HOLE, Math.max(3, r * 0.1));
};
const ball = (c: Ctx, x: number, y: number, r: number, col: string = COL.red) => {
  shape(c, () => ell(c, x, y, r, r), col, 5); shade(c, () => ell(c, x, y, r, r), "#a8321f", r * 0.4, r * 0.4, 0.5);
  shine(c, [[x - r * 0.6, y - r * 0.2], [x - r * 0.25, y - r * 0.6]], 7);
};
const eye = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => ell(c, x, y, 52 * s, 34 * s), WHITE, 5);
  shape(c, () => ell(c, x, y, 22 * s, 22 * s), COL.brown, 4);
  shape(c, () => ell(c, x, y, 10 * s, 10 * s), INK, 0);
};
const bread = (c: Ctx, x: number, y: number, s: number) => {
  const p = (k: number) => () => { const w = 150 * s * k, h = 150 * s * k; c.moveTo(x - w * 0.8, y + h); c.lineTo(x - w * 0.8, y - h * 0.1); c.bezierCurveTo(x - w * 1.25, y - h * 0.15, x - w * 1.1, y - h * 1.1, x - w * 0.5, y - h * 1.0); c.bezierCurveTo(x - w * 0.2, y - h * 1.1, x + w * 0.2, y - h * 1.1, x + w * 0.5, y - h * 1.0); c.bezierCurveTo(x + w * 1.1, y - h * 1.1, x + w * 1.25, y - h * 0.15, x + w * 0.8, y - h * 0.1); c.lineTo(x + w * 0.8, y + h); c.closePath(); };
  shape(c, p(1), "#c98d4e", 6); shape(c, p(0.84), "#f6e2b5", 4);
  for (const [dx, dy] of [[-0.3, -0.3], [0.25, 0.0], [-0.15, 0.35], [0.4, 0.45], [-0.45, 0.1]]) shape(c, () => ell(c, x + dx * 150 * s, y + dy * 150 * s, 9 * s * 2, 6 * s * 2), DOUGHDK, 0);
};
const doughBall = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), DOUGH, 5); shade(c, () => ell(c, x, y, r, r), DOUGHDK, r * 0.4, r * 0.4, 0.6);
  shine(c, [[x - r * 0.6, y - r * 0.2], [x - r * 0.3, y - r * 0.6]], 6);
};
// a shoebox seen from the front and above, its lid black paper (with a white strip and a hole if asked)
const box = (c: Ctx, cx: number, cy: number, w: number, h: number, t: number, bodyH: number, hole = 0, strip = true) => {
  const pt = (u: number, v: number): [number, number] => [cx + u * (w / 2 - 0.1 * w * (1 - v)), cy - h / 2 + v * h];
  shadow(c, cx + w * 0.06, cy + h / 2 + t + bodyH + 4, w * 0.58, 22);
  shape(c, () => rrect(c, cx - w / 2, cy + h / 2 + t - 4, w, bodyH + 4, 6), COL.brown);
  shade(c, () => rrect(c, cx - w / 2, cy + h / 2 + t - 4, w, bodyH + 4, 6), COL.soilDk, w * 0.3, 0, 0.35);
  shape(c, () => rrect(c, cx - w / 2 - 6, cy + h / 2, w + 12, t, 5), COL.woodDk);
  shape(c, () => polyP(c, [pt(-1, 0), pt(1, 0), pt(1, 1), pt(-1, 1)]), PAPER);
  shade(c, () => polyP(c, [pt(-1, 0), pt(1, 0), pt(1, 1), pt(-1, 1)]), PAPERDK, w * 0.4, h * 0.2, 0.7);
  if (strip) shape(c, () => polyP(c, [pt(0.5, 0.1), pt(0.8, 0.1), pt(0.8, 0.9), pt(0.5, 0.9)]), WHITE, 5);
  if (hole) { const [hx, hy] = pt(-0.1, 0.5); shape(c, () => ell(c, hx, hy, hole, hole * 0.5), HOLE, Math.max(3, hole * 0.12)); return [hx, hy]; }
  return [cx, cy];
};
const table = (c: Ctx, top: number) => { c.fillStyle = TABLE; c.fillRect(0, top, D, D - top); line(c, [[0, top], [D, top]], 6); };

// ---------------------------------------------------------------- flows
// flow.e1: light goes into the hole and does not come back
const e1 = (c: Ctx) => {
  ground(c); table(c, 250);
  const [hx, hy] = box(c, 540, 560, 800, 400, 40, 180, 66, true);
  ray(c, [[170, 270], [hx - 70, hy - 20]], 16);
  ray(c, [[330, 190], [hx - 25, hy - 12]], 16);
  ray(c, [[560, 150], [hx + 5, hy - 8]], 16);
};
// flow.a1: a slice of bread squeezed into a ball the size of a marble
const a1 = (c: Ctx) => {
  ground(c); table(c, 640);
  shadow(c, 320, 800, 230, 28); bread(c, 320, 600, 1.05);
  arrow(c, [[520, 520], [650, 520], [690, 520]], RED, 14);
  shadow(c, 830, 790, 100, 18); doughBall(c, 830, 690, 90);
  // a marble of the same size beside it
  shadow(c, 960, 770, 50, 12); shape(c, () => ell(c, 960, 725, 42, 42), COL.blue, 5);
  shape(c, () => { c.moveTo(930, 725); c.quadraticCurveTo(960, 690, 990, 725); c.quadraticCurveTo(960, 760, 930, 725); c.closePath(); }, COL.sky, 3);
  shine(c, [[935, 700], [950, 685]], 6);
};
// flow.a3: from above, the child with the torch goes round a hidden partner in dark clothes
const a3 = (c: Ctx) => {
  c.fillStyle = "#14122a"; c.fillRect(0, 0, D, D);
  const cx = 540, cy = 540, R = 290;
  // the circle the light makes
  const arc = (a0: number, a1: number, n = 40) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * (i / n); return [cx + Math.cos(a) * R, cy + Math.sin(a) * R]; });
  line(c, arc(0, Math.PI * 2, 60), 8, "#4b4a7a");
  ray(c, arc(-0.9, 0.5, 14), 12);
  ray(c, arc(2.2, 3.6, 14), 12);
  // the hidden partner in the middle: only a dim outline
  const hp = (x: number, y: number) => { c.beginPath(); ell(c, x, y, 78, 78); c.fillStyle = "#1c1a36"; c.fill(); c.strokeStyle = "#5a5890"; c.lineWidth = 6; c.stroke(); c.beginPath(); ell(c, x, y, 34, 34); c.fillStyle = "#26244a"; c.fill(); };
  hp(cx, cy);
  // the child's lit torch, a bright glow on the circle, and the joined hands
  const tx = cx + Math.cos(-0.2) * R, ty = cy + Math.sin(-0.2) * R;
  line(c, [[cx + 70, cy - 12], [tx - 55, ty]], 22, "#5a5890");
  c.beginPath(); ell(c, tx, ty, 120, 120); c.fillStyle = "rgba(255,211,77,0.28)"; c.fill();
  c.beginPath(); ell(c, tx, ty, 80, 80); c.fillStyle = "rgba(255,211,77,0.4)"; c.fill();
  shape(c, () => ell(c, tx, ty, 54, 54), SKIN.child, 5);
  shape(c, () => ell(c, tx, ty, 42, 42), CLOTH.hair, 0);
  shape(c, () => ell(c, tx + 62, ty - 10, 30, 30), COL.yellow, 5);
  shape(c, () => ell(c, tx + 62, ty - 10, 14, 14), WHITE, 0);
};
// flow.p1: a fold-out book of a giant star's life, six pages
const p1 = (c: Ctx) => {
  ground(c); table(c, 780);
  const pw = 162, x0 = 54, top = 250, ph = 360;
  shadow(c, 540, 790, 470, 26);
  const page = (i: number) => {
    const x = x0 + i * pw, dy = i % 2 ? 22 : 0;
    shape(c, () => rrect(c, x, top + dy, pw, ph, 4), SPACE, 6);
    if (i % 2) shade(c, () => rrect(c, x, top + dy, pw, ph, 4), "#000000", 14, 0, 0.18);
    return [x + pw / 2, top + dy + ph / 2] as const;
  };
  starsIn(c, x0 + 6, top + 6, x0 + 6 * pw - 6, top + ph, 0, 1);
  const pics: ((x: number, y: number) => void)[] = [
    (x, y) => { for (const [dx, dy, r, col] of [[-30, -20, 36, COL.purple], [28, -26, 40, COL.pink], [-8, 24, 42, COL.pink], [36, 30, 32, COL.purple]] as [number, number, number, string][]) shape(c, () => ell(c, x + dx, y + dy, r, r), col, 4); },
    (x, y) => { for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; line(c, [[x + Math.cos(a) * 46, y + Math.sin(a) * 46], [x + Math.cos(a) * 66, y + Math.sin(a) * 66]], 7, COL.sky); } shape(c, () => ell(c, x, y, 38, 38), "#cfe6ff", 4); shape(c, () => ell(c, x, y, 20, 20), WHITE, 0); },
    (x, y) => { shape(c, () => ell(c, x, y, 62, 62), COL.red, 4); shade(c, () => ell(c, x, y, 62, 62), "#a8321f", 20, 20, 0.5); },
    (x, y) => { const pts: number[][] = []; for (let k = 0; k < 16; k++) { const a = (k / 16) * Math.PI * 2, r = k % 2 ? 36 : 68; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); } shape(c, () => polyP(c, pts), COL.yellow, 4); shape(c, () => ell(c, x, y, 26, 26), WHITE, 0); },
    (x, y) => bh(c, x, y, 24),
    (x, y) => { bh(c, x, y + 6, 18); line(c, Array.from({ length: 41 }, (_, i) => [x + Math.cos((i / 40) * 6.283) * 56, y + 6 + Math.sin((i / 40) * 6.283) * 40]), 3, "#8a8fc0"); shape(c, () => ell(c, x + 40, y - 28, 11, 11), COL.yellow, 3); },
  ];
  for (let i = 0; i < 6; i++) { const [x, y] = page(i); pics[i](x, y); }
  arrow(c, [[120, 880], [900, 880]], RED, 16);
};
// flow.c1: a plain hole in a box, and a bundle of black straws seen from the end
const c1 = (c: Ctx) => {
  ground(c); table(c, 300);
  box(c, 270, 520, 420, 220, 30, 140, 34, true);
  arrow(c, [[500, 560], [620, 560]], RED, 14);
  const cx = 800, cy = 560;
  shadow(c, cx + 12, cy + 300, 250, 24);
  let n = 0;
  [3, 4, 5, 4, 3].forEach((cnt, row) => {
    for (let k = 0; k < cnt; k++) {
      const x = cx + (k - (cnt - 1) / 2) * 74, y = cy + (row - 2) * 64;
      shape(c, () => ell(c, x, y, 36, 36), PAPER, 4); shape(c, () => ell(c, x, y, 24, 24), HOLE, 0); n++;
    }
  });
};

// ---------------------------------------------------------------- terms
// term.1 Gravity: a child throws a ball up; gravity brings it back down
const t1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#cfe9a8"; c.fillRect(0, 900, D, D - 900); line(c, [[0, 900], [D, 900]], 6);
  shadow(c, 300, 905, 200, 20);
  person(c, 260, 900, 700, { armR: [-1.15, -1.45], armL: [Math.PI * 0.55, Math.PI * 0.5] });
  ball(c, 470, 120, 52);
  arrow(c, [[400, 250], [440, 190]], RED, 12);
  arrow(c, Array.from({ length: 21 }, (_, i) => { const t = i / 20; return [560 + 280 * t, 150 + 650 * t * t + 60 * Math.sin(t * 3.14)]; }), RED, 14);
};
// term.2 Mass: a slice of bread and the ball made by squeezing it weigh the same
const t2 = (c: Ctx) => {
  ground(c);
  const by = 330;
  shadow(c, 540, 960, 330, 26);
  shape(c, () => polyP(c, [[470, 960], [610, 960], [585, by + 20], [495, by + 20]]), COL.steel);
  shape(c, () => rrect(c, 190, by - 22, 700, 36, 14), COL.steel);
  shape(c, () => ell(c, 540, by - 4, 40, 40), COL.red, 5);
  for (const [px, th] of [[250, 0], [830, 0]]) {
    line(c, [[px, by - 4], [px - 120, 640]], 6); line(c, [[px, by - 4], [px + 120, 640]], 6);
    shape(c, () => { c.moveTo(px - 140, 640); c.bezierCurveTo(px - 120, 710, px + 120, 710, px + 140, 640); c.closePath(); }, COL.steelDk, 6);
    void th;
  }
  bread(c, 250, 545, 0.56);
  doughBall(c, 830, 580, 58);
  shape(c, () => ell(c, 250, 640, 140, 14), COL.steel, 5); shape(c, () => ell(c, 830, 640, 140, 14), COL.steel, 5);
};
// term.3 Absorb: light goes into black paper and stays there
const rayDown = (c: Ctx, x: number, y: number, w = 12) => ray(c, [[x - 160, y - 300], [x, y]], w);
const paperFlat = (c: Ctx, col: string, dk: string) => {
  shadow(c, 560, 850, 400, 28);
  shape(c, () => polyP(c, [[180, 820], [900, 820], [1000, 700], [280, 700]]), col, 6);
  shade(c, () => polyP(c, [[180, 820], [900, 820], [1000, 700], [280, 700]]), dk, 70, 0, 0.5);
};
const t3 = (c: Ctx) => {
  ground(c); sun(c, 170, 150, 70);
  paperFlat(c, PAPER, PAPERDK);
  rayDown(c, 440, 730); rayDown(c, 600, 730); rayDown(c, 760, 730);
  ray(c, [[780, 720], [860, 650]], 6);
};
// term.4 Reflect: light bounces off white paper into an eye
const t4 = (c: Ctx) => {
  ground(c); sun(c, 150, 150, 70);
  paperFlat(c, WHITE, COL.steelIn);
  rayDown(c, 440, 730); rayDown(c, 580, 730);
  ray(c, [[440, 730], [640, 430]], 12); ray(c, [[580, 730], [780, 430]], 12);
  eye(c, 840, 330, 1.4);
};
// term.5 Escape speed: a rocket leaving the Earth at 11 km a second
const t5 = (c: Ctx) => {
  space(c, 36, 9);
  c.save(); c.beginPath(); ell(c, 540, 1380, 700, 700); c.clip(); c.restore();
  earth(c, 540, 1400, 660);
  const x = 460, yb = 600, w = 130, h = 300;
  const body = () => { c.moveTo(x - w / 2, yb); c.lineTo(x - w / 2, yb - h * 0.62); c.bezierCurveTo(x - w / 2, yb - h * 0.88, x - w * 0.18, yb - h * 0.97, x, yb - h); c.bezierCurveTo(x + w * 0.18, yb - h * 0.97, x + w / 2, yb - h * 0.88, x + w / 2, yb - h * 0.62); c.lineTo(x + w / 2, yb); c.closePath(); };
  const fl = (k: number) => () => { c.moveTo(x - 50 * k, yb); c.bezierCurveTo(x - 60 * k, yb + 60 * k, x - 10 * k, yb + 90 * k, x, yb + 130 * k); c.bezierCurveTo(x + 10 * k, yb + 90 * k, x + 60 * k, yb + 60 * k, x + 50 * k, yb); c.closePath(); };
  shape(c, fl(1), COL.orange, 6); shape(c, fl(0.55), COL.yellow, 0);
  shape(c, () => polyP(c, [[x - w / 2, yb - h * 0.3], [x - w * 0.95, yb + 4], [x - w / 2, yb - 8]]), COL.red, 6);
  shape(c, () => polyP(c, [[x + w / 2, yb - h * 0.3], [x + w * 0.95, yb + 4], [x + w / 2, yb - 8]]), COL.red, 6);
  shape(c, body, WHITE, 0);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.red; c.fillRect(x - w, yb - h * 1.05, w * 2, h * 0.38); c.fillStyle = "rgba(43,35,64,0.14)"; c.fillRect(x + 8, yb - h, w, h * 1.1); c.restore();
  c.beginPath(); body(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  shape(c, () => ell(c, x, yb - h * 0.42, 28, 28), COL.sky, 6);
  arrow(c, [[760, 700], [760, 220]], RED, 16);
  write(c, "11", 800, 380, 120, WHITE, 11);
};
// term.7 Speed of light: round the Earth seven times in one second
const t7 = (c: Ctx) => {
  space(c, 36, 11);
  earth(c, 450, 560, 150);
  const R = 270, pts = Array.from({ length: 71 }, (_, i) => { const a = -1.2 + (i / 70) * 6.0; return [450 + Math.cos(a) * R, 560 + Math.sin(a) * R]; });
  ray(c, pts, 16);
  // the stopwatch
  const sx = 840, sy = 250;
  shape(c, () => rrect(c, sx - 22, sy - 150, 44, 30, 6), COL.steelDk, 5);
  shape(c, () => ell(c, sx, sy, 112, 112), COL.steel, 6);
  shape(c, () => ell(c, sx, sy, 88, 88), WHITE, 4);
  line(c, [[sx, sy], [sx + 40, sy - 52]], 8, RED);
  write(c, "1", sx - 26, sy + 8, 60, INK, 7);
  write(c, "7", 760, 770, 190, WHITE, 18);
};
// term.8 Orbit: a star going round a black hole on an oval path
const t8 = (c: Ctx) => {
  space(c, 36, 13);
  const cx = 540, cy = 540, rx = 380, ry = 250, tilt = -0.25;
  const P = (a: number) => { const x = Math.cos(a) * rx, y = Math.sin(a) * ry; return [cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)]; };
  for (let k = 0; k < 24; k++) { const a0 = (k / 24) * Math.PI * 2, a1 = a0 + 0.17; line(c, [P(a0), P(a1)], 6, "#8a8fc0"); }
  bh(c, cx, cy, 52);
  arrow(c, [P(0.2), P(0.5), P(0.8), P(1.0)], RED, 14);
  arrow(c, [P(3.35), P(3.65), P(3.95), P(4.15)], RED, 14);
  const [sx, sy] = P(-0.9);
  sun(c, sx, sy, 38);
};
// term.9 Light-year: light travels a long way in one year
const t9 = (c: Ctx) => {
  space(c, 30, 17);
  // the calendar, a year of 12 months
  const cx = 330, cy = 140, w = 420, h = 330;
  shape(c, () => rrect(c, cx, cy, w, h, 16), WHITE, 6);
  shape(c, () => rrect(c, cx, cy, w, 64, 16), COL.red, 6);
  for (const x of [cx + 80, cx + w - 80]) shape(c, () => rrect(c, x - 10, cy - 24, 20, 48, 8), COL.steelDk, 5);
  for (let i = 0; i < 12; i++) shape(c, () => rrect(c, cx + 28 + (i % 4) * 93, cy + 94 + Math.floor(i / 4) * 74, 76, 58, 8), i % 3 === 0 ? COL.sky : COL.cloth, 4);
  write(c, "1", 190, 220, 120, WHITE, 14);
  // the light, a long beam from the Sun to a far star
  sun(c, 140, 700, 70);
  ray(c, [[260, 700], [840, 700]], 22);
  shape(c, () => ell(c, 960, 700, 34, 34), "#cfe6ff", 5);
  for (let k = 0; k < 8; k++) { const a = (k / 8) * 6.283; line(c, [[960 + Math.cos(a) * 44, 700 + Math.sin(a) * 44], [960 + Math.cos(a) * 62, 700 + Math.sin(a) * 62]], 5, WHITE); }
};

// ---------------------------------------------------------------- explanations
const panel = (c: Ctx, x: number) => { shape(c, () => rrect(c, x, 120, 320, 840, 18), COL.sky, 6); c.fillStyle = TABLE; c.save(); c.beginPath(); rrect(c, x, 120, 320, 840, 18); c.clip(); c.fillRect(x, 800, 320, 200); c.restore(); line(c, [[x, 800], [x + 320, 800]], 5); c.beginPath(); rrect(c, x, 120, 320, 840, 18); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); };
// expl.1: white paper bounces light back, black paper soaks it up, a hole in a box keeps it
const x1 = (c: Ctx) => {
  ground(c);
  [20, 380, 740].forEach((x0, i) => {
    panel(c, x0);
    eye(c, x0 + 250, 240, 0.9);
    if (i < 2) {
      shape(c, () => polyP(c, [[x0 + 30, 790], [x0 + 270, 790], [x0 + 300, 840], [x0 + 20, 840]]), i === 0 ? WHITE : PAPER, 5);
      for (let k = 0; k < 2; k++) {
        const px = x0 + 100 + k * 110;
        ray(c, [[px - 60, 500], [px, 785]], 12);
        if (i === 0) ray(c, [[px, 785], [px + 50, 440]], 12);
        else if (k === 1) ray(c, [[px, 785], [px + 14, 700]], 5);
      }
    } else {
      shape(c, () => polyP(c, [[x0 + 30, 790], [x0 + 290, 790], [x0 + 306, 840], [x0 + 14, 840]]), PAPER, 5);
      shape(c, () => ell(c, x0 + 160, 812, 54, 14), HOLE, 4);
      for (let k = 0; k < 2; k++) { const px = x0 + 140 + k * 40; ray(c, [[px - 70 + k * 40, 500], [px, 805]], 12); }
    }
  });
};
// expl.2: three balls thrown up: slow falls back, faster goes higher, very fast leaves
const x2 = (c: Ctx) => {
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, D);
  c.fillStyle = "#6f8fc9"; c.fillRect(0, 0, D, 420);
  c.fillStyle = SPACE; c.fillRect(0, 0, D, 190);
  starsIn(c, 20, 10, 1060, 180, 14, 21);
  c.fillStyle = COL.green; c.fillRect(0, 900, D, D - 900); line(c, [[0, 900], [D, 900]], 6);
  const xs = [200, 540, 880], tops = [650, 380, 120];
  xs.forEach((x, i) => {
    shadow(c, x + 10, 905, 56, 12);
    ball(c, x, 860, 40);
    arrow(c, [[x - 30, 790], [x - 30, tops[i] + 20]], RED, 14);
    if (i < 2) { ball(c, x, tops[i] - 5, 40); arrow(c, [[x + 50, tops[i] + 20], [x + 50, 800]], "#2a6fb3", 14); }
  });
};
// expl.4: the Earth goes round the Sun, and round a tiny black hole, on the same path
const x4 = (c: Ctx) => {
  ground(c);
  [20, 560].forEach((x0, i) => {
    shape(c, () => rrect(c, x0, 140, 500, 800, 18), SPACE, 6);
    starsIn(c, x0 + 14, 154, x0 + 486, 926, 16, 30 + i);
    const cx = x0 + 250, cy = 540, R = 180;
    for (let k = 0; k < 20; k++) { const a0 = (k / 20) * 6.283, a1 = a0 + 0.2; line(c, [[cx + Math.cos(a0) * R, cy + Math.sin(a0) * R], [cx + Math.cos(a1) * R, cy + Math.sin(a1) * R]], 5, "#8a8fc0"); }
    if (i === 0) sun(c, cx, cy, 62); else { bh(c, cx, cy, 20); }
    earth(c, cx + Math.cos(-2.2) * R, cy + Math.sin(-2.2) * R, 46);
    arrow(c, Array.from({ length: 5 }, (_, k) => { const a = -1.5 + k * 0.17; return [cx + Math.cos(a) * R, cy + Math.sin(a) * R]; }), RED, 11);
  });
};

export const ic_storyOfUniverseBlackHolesL3 = cards("sci.story-of-universe.black-holes.L3 cards", [e1, a1, a3, p1, c1, t1, t2, t3, t4, t5, t7, t8, t9, x1, x2, x4]);
