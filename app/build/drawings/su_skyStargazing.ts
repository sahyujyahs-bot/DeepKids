import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, line, arrow, hand, person, write, cards } from "./flatKit";
import type { Ctx } from "./core";

// SKY / STARGAZING L3 · set-up cards: the Seven-star ladle on a wall, threads, dark adaptation, fists.
const NIGHT = "#1d2250", NIGHT2 = "#2f3a6b", MOON = "#ffe9a0", STAR = "#ffd34d";

// five-pointed star path
const starP = (c: Ctx, x: number, y: number, R: number) => { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? R * 0.45 : R; i ? c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : c.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.closePath(); };
const star = (c: Ctx, x: number, y: number, R: number, fill = STAR, lw = 5) => shape(c, () => starP(c, x, y, R), fill, lw);
// a crescent moon opening to the right, centre (x, y), radius R
const moon = (c: Ctx, x: number, y: number, R: number) => shape(c, () => { c.moveTo(x, y - R); c.bezierCurveTo(x - R * 1.5, y - R * 0.6, x - R * 1.5, y + R * 0.6, x, y + R); c.bezierCurveTo(x - R * 0.55, y + R * 0.6, x - R * 0.55, y - R * 0.6, x, y - R); c.closePath(); }, MOON, 5);
// the forearm and sleeve behind a hand(), running back off the card edge
const arm = (c: Ctx, x: number, y: number, an: number, s: number, sleeve: string = CLOTH.child) => { c.save(); c.translate(x, y); c.rotate(an); shape(c, () => rrect(c, -1500, -34 * s, 1500 - 40 * s, 68 * s, 10), sleeve, 6); c.restore(); };
// a felt-tip marker from (x, y) to its tip at (tx, ty)
const marker = (c: Ctx, x: number, y: number, tx: number, ty: number) => {
  const an = Math.atan2(ty - y, tx - x), len = Math.hypot(tx - x, ty - y);
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -17, len - 40, 34, 8), COL.blue, 5);
  shape(c, () => polyP(c, [[len - 42, -14], [len, 0], [len - 42, 14]]), COL.blueDk, 5);
  shape(c, () => rrect(c, 0, -17, 60, 34, 8), COL.blueDk, 5);
  c.restore();
};
// a fist seen from the front, centre (x, y)
const fist = (c: Ctx, x: number, y: number, s: number) => {
  const body = () => rrect(c, x - 46 * s, y - 40 * s, 92 * s, 96 * s, 26 * s);
  shape(c, body, SKIN.child, 6);
  for (let k = 0; k < 4; k++) shape(c, () => rrect(c, x - 46 * s + k * 23 * s, y - 52 * s, 23 * s, 44 * s, 11 * s), SKIN.child, 5);
  shape(c, () => ell(c, x - 8 * s, y + 24 * s, 44 * s, 17 * s, -0.12), SKIN.child, 5);
  line(c, [[x - 46 * s + 23 * s, y - 36 * s], [x - 46 * s + 23 * s, y - 4 * s]], 3, SKIN.childDk);
  line(c, [[x + 23 * s, y - 36 * s], [x + 23 * s, y - 4 * s]], 3, SKIN.childDk);
};
const nightSky = (c: Ctx) => {
  c.fillStyle = NIGHT; c.fillRect(0, 0, D, D);
  for (const [x, y] of [[90, 80], [300, 150], [520, 60], [760, 120], [980, 70], [1000, 330], [60, 420], [880, 520]]) { c.beginPath(); c.arc(x, y, 5, 0, 7); c.fillStyle = WHITE; c.fill(); }
};
// the Seven Stars (the ladle) as a list of points in a 1080 design
const LADLE = [[380, 330], [330, 470], [500, 530], [540, 390], [650, 350], [770, 300], [880, 230]];
const tape = (c: Ctx, x: number, y: number, rot: number) => { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -45, -16, 90, 32, 4), "rgba(255,211,77,0.85)", 4); c.restore(); };
const paper = (c: Ctx, x0: number, y0: number, x1: number, y1: number) => {
  shadow(c, (x0 + x1) / 2 + 14, y1 + 8, (x1 - x0) / 2, 20);
  shape(c, () => rrect(c, x0, y0, x1 - x0, y1 - y0, 6), COL.paper, 6);
  tape(c, x0 + 8, y0 + 10, -0.7); tape(c, x1 - 8, y0 + 10, 0.7);
};
const wall = (c: Ctx) => { ground(c, "#e9dcc3"); c.fillStyle = "#cfa970"; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6); };

// setup.e1.0
const e1_0 = (c: Ctx) => {
  wall(c);
  paper(c, 110, 120, 970, 780);
  const pts = LADLE.map(([x, y]) => [x, y + 30]);
  pts.forEach(([x, y], i) => {
    if (i === 5) { c.beginPath(); c.arc(x, y, 28, 0, 7); c.setLineDash([10, 10]); c.strokeStyle = COL.greyDk; c.lineWidth = 5; c.stroke(); c.setLineDash([]); return; }
    shape(c, () => ell(c, x, y, 25, 25), INK, 0);
    line(c, [[x - 40, y + 50], [x + 40, y + 50]], 7, COL.grey);
  });
  line(c, [[pts[0][0], pts[0][1]], [pts[1][0], pts[1][1]], [pts[2][0], pts[2][1]], [pts[3][0], pts[3][1]], [pts[0][0], pts[0][1]]], 3, COL.grey);
  const tip = [pts[5][0], pts[5][1]], wx = 840, wy = 840, an = Math.atan2(tip[1] - wy, tip[0] - wx);
  arm(c, wx, wy, an, 1.6);
  marker(c, wx + Math.cos(an) * 90, wy + Math.sin(an) * 90, tip[0], tip[1]);
  hand(c, wx, wy, an, 1.6);
};

// setup.e1.1
const THREAD_FROM = [215, 525];
const dotsOnPaper = LADLE.map(([x, y]) => [640 + (x - 330) * 0.52, 240 + (y - 230) * 0.95]);
const chair = (c: Ctx) => {
  shadow(c, 290, 890, 190, 22);
  for (const [x1, y1, x2, y2] of [[190, 740, 175, 890], [380, 760, 400, 890], [150, 700, 140, 890]]) line(c, [[x1, y1], [x2, y2]], 18, INK), line(c, [[x1, y1], [x2, y2]], 8, COL.brown);
  shape(c, () => polyP(c, [[150, 690], [270, 705], [430, 770], [300, 770]]), COL.woodDk, 6);
  shape(c, () => polyP(c, [[150, 390], [275, 415], [275, 705], [150, 690]]), COL.wood, 6);
};
const postcard = (c: Ctx) => {
  shape(c, () => polyP(c, [[172, 450], [248, 464], [248, 600], [172, 586]]), WHITE, 5);
  shape(c, () => ell(c, THREAD_FROM[0] - 2, THREAD_FROM[1], 10, 13), INK, 0);
  tape(c, 210, 450, 0.2); tape(c, 210, 596, 0.2);
};
const e1_1 = (c: Ctx) => {
  wall(c);
  paper(c, 600, 170, 1010, 760);
  chair(c); postcard(c);
  dotsOnPaper.forEach(([x, y]) => line(c, [THREAD_FROM, [x, y]], 4, COL.purple));
  dotsOnPaper.forEach(([x, y]) => shape(c, () => ell(c, x, y, 14, 14), INK, 0));
  shape(c, () => ell(c, THREAD_FROM[0], THREAD_FROM[1], 8, 10), INK, 0);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  wall(c);
  const hx = 160, hy = 540, wx = 950;
  shape(c, () => rrect(c, wx - 18, 50, 90, 900, 6), COL.paper, 6);
  const dots = LADLE.map(([x, y]) => [wx, 120 + (y - 230) * 2.2]);
  shape(c, () => rrect(c, 105, 430, 50, 220, 5), WHITE, 6);
  shape(c, () => ell(c, 155, hy, 6, 10), INK, 0);
  dots.forEach(([x, y]) => line(c, [[hx, hy], [x, y]], 4, COL.purple));
  const T = [0.9, 0.45, 0.33, 0.52, 0.4, 0.3, 0.9];
  dots.forEach(([x, y]) => shape(c, () => ell(c, x, y, 14, 14), INK, 0));
  dots.forEach(([x, y], i) => star(c, hx + (x - hx) * T[i], hy + (y - hy) * T[i], 42));
  shape(c, () => ell(c, hx, hy, 7, 10), INK, 0);
};

// setup.e1.3
const viewer = (c: Ctx, px: number, scattered: boolean, flip: boolean) => {
  const wx = px, wy = 230, R = 175;
  for (const [dx, dy, r] of [[0, 235, 12], [0, 275, 18]]) shape(c, () => ell(c, wx, wy + dy + 60 - 30, r, r), NIGHT2, 4);
  shape(c, () => ell(c, wx, wy, R, R), NIGHT, 7);
  const L = [[-58, -16], [-74, 29], [-19, 48], [-6, 3], [29, -10], [67, -26], [102, -48]];
  const S = [[-110, -80], [60, -100], [-90, 40], [105, 85], [-20, 100], [20, -20], [-30, -30]];
  const P = (scattered ? S : L).map(([x, y]) => [wx + x * (flip ? -1 : 1), wy + y]);
  if (!scattered) line(c, [P[0], P[1], P[2], P[3], P[0]], 3, "rgba(255,255,255,0.5)"), line(c, [P[3], P[4], P[5], P[6]], 3, "rgba(255,255,255,0.5)");
  P.forEach(([x, y]) => star(c, x, y, 22, STAR, 3));
  // the child, with one eye shut and the card with its hole held over the open eye
  const h = 520, y = 1010, head = h * 0.13, sh = y - h * 0.74, hy = sh - head * 1.05;
  person(c, px, y, h, { armR: [-1.0, -1.6] });
  shape(c, () => ell(c, px - head * 0.35, hy + head * 0.12, head * 0.2, head * 0.2), SKIN.child, 0);
  c.beginPath(); c.arc(px - head * 0.35, hy + head * 0.1, head * 0.16, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  const cx = px + head * 0.35, cy = hy + head * 0.12;
  c.save(); c.beginPath(); rrect(c, cx - 70, cy - 105, 150, 210, 8); c.moveTo(cx + 16, cy); c.arc(cx, cy, 16, 0, 7, true); c.fillStyle = WHITE; c.fill("evenodd"); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); c.restore();
  c.beginPath(); c.arc(cx, cy, 16, 0, 7); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  shape(c, () => rrect(c, cx + 52, cy + 50, 58, 82, 20), SKIN.child, 5);
  line(c, [[cx + 72, cy + 82], [cx + 100, cy + 82]], 4, SKIN.childDk); line(c, [[cx + 72, cy + 104], [cx + 100, cy + 104]], 4, SKIN.childDk);
};
const e1_3 = (c: Ctx) => {
  ground(c, BG);
  line(c, [[540, 40], [540, 1040]], 6, COL.grey);
  viewer(c, 270, false, false);
  viewer(c, 810, true, false);
  arrow(c, [[400, 930], [680, 930]]);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  wall(c);
  paper(c, 100, 80, 880, 840);
  for (let i = 0; i < 12; i++) {
    const x = 240 + (i % 4) * 180, y = 250 + Math.floor(i / 4) * 210, a = 1 - i * 0.082;
    c.globalAlpha = a; star(c, x, y, 70, i < 6 ? INK : "#c9c4ba", i < 6 ? 5 : 2); c.globalAlpha = 1;
  }
  const wx = 1010, wy = 1020, tx = 820, ty = 760, an = Math.atan2(ty - wy, tx - wx);
  arm(c, wx, wy, an, 1.4);
  marker(c, wx + Math.cos(an) * 80, wy + Math.sin(an) * 80, tx, ty);
  hand(c, wx, wy, an, 1.4);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  c.fillStyle = NIGHT2; c.fillRect(0, 0, D, 700);
  c.fillStyle = NIGHT; c.fillRect(0, 700, D, 380); line(c, [[0, 700], [D, 700]], 6);
  // the door and the thin line of light under it
  shape(c, () => rrect(c, 770, 110, 220, 590, 6), "#46528a", 6);
  shape(c, () => ell(c, 800 + 160, 420, 12, 12), COL.steel, 4);
  c.fillStyle = "rgba(255,230,140,0.9)"; c.fillRect(772, 690, 216, 10);
  c.beginPath(); c.moveTo(772, 700); c.lineTo(988, 700); c.lineTo(1060, 760); c.lineTo(700, 760); c.closePath(); c.fillStyle = "rgba(255,230,140,0.18)"; c.fill();
  // the sheet on the wall: only the dark stars show
  shape(c, () => rrect(c, 120, 140, 500, 480, 6), "#bcc3dc", 6);
  [[210, 250], [370, 230], [520, 280], [260, 400], [440, 420], [540, 540]].forEach(([x, y], i) => { if (i < 3) star(c, x, y, 36, INK, 3); else { c.globalAlpha = 0.18; star(c, x, y, 36, INK, 2); c.globalAlpha = 1; } });
  // the child sitting two metres away, with a red measure
  person(c, 360, 1010, 480, { sit: true });
  arrow(c, [[690, 820], [690, 730]], RED, 9); arrow(c, [[690, 880], [690, 960]], RED, 9);
  line(c, [[690, 820], [690, 880]], 9, RED);
  write(c, "2 m", 740, 800, 70, WHITE, 8);
};

// setup.e3.0
const e3_0 = (c: Ctx) => {
  nightSky(c);
  star(c, 690, 215, 46, STAR, 6);
  moon(c, 250, 310, 90);
  // the balcony rail behind the child
  c.fillStyle = NIGHT2; c.fillRect(0, 840, D, 110);
  for (let x = 40; x < D; x += 110) shape(c, () => rrect(c, x, 860, 26, 250, 4), COL.grey, 5);
  shape(c, () => rrect(c, 0, 830, D, 40, 8), COL.greyDk, 6);
  c.fillStyle = "#4a4466"; c.fillRect(0, 1000, D, 80); line(c, [[0, 1000], [D, 1000]], 6);
  person(c, 800, 1010, 700, { armL: [Math.PI + 0.9, Math.PI + 0.6] });
  fist(c, 557, 327, 1.4);
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c, BG);
  for (let i = 0; i < 3; i++) {
    const y = 60 + i * 335, gap = 150 + i * 150;
    shape(c, () => rrect(c, 70, y, 940, 290, 24), NIGHT, 7);
    star(c, 880, y + 145, 48, STAR, 6);
    moon(c, 820 - gap, y + 145, 85);
    write(c, String(i + 1), 120, y + 95, 100, WHITE, 11);
  }
};

export const su_skyStargazing = cards("sci.sky.stargazing.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e3_0, e3_1]);
