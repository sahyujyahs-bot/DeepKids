import type { Ctx } from "./core";
import { INK, RED, COL, SKIN, CLOTH, WHITE, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards } from "./flatKit";

// SIMPLE MACHINES L3 · flat cards for terms, explanations and activities.
const FLOOR = "#e6d3ae", FUL = COL.purple, FULDK = "#6a4fa6", CRATE = "#c98c4e", CRATEDK = "#a2692f", STONE = "#b9b4ab", STONEDK = "#8f8a82";

const scene = (c: Ctx, y: number) => { ground(c); c.fillStyle = FLOOR; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 5); };
const dk = (c: Ctx, p: () => void, col: string, r: number) => shade(c, p, col, -r, -r);
const ring = (c: Ctx, x: number, y: number, r: number) => { c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = RED; c.lineWidth = 11; c.stroke(); };
const dot = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), RED, 4); };

// ---- things
const crate = (c: Ctx, cx: number, by: number, w: number, h: number) => {
  shadow(c, cx + w * 0.1, by + 4, w * 0.58, 10);
  const p = () => rrect(c, cx - w / 2, by - h, w, h, 8);
  shape(c, p, CRATE); dk(c, p, CRATEDK, 12);
  shape(c, () => rrect(c, cx - w / 2 + 12, by - h + 12, w - 24, h - 24, 4), "rgba(0,0,0,0)", 4);
  line(c, [[cx - w / 2 + 12, by - 12], [cx + w / 2 - 12, by - h + 12]], 5);
};
const sack = (c: Ctx, cx: number, by: number, w: number, h: number) => {
  shadow(c, cx + w * 0.1, by + 4, w * 0.6, 10);
  const p = () => { c.moveTo(cx - w * 0.12, by - h); c.bezierCurveTo(cx - w * 0.5, by - h * 0.82, cx - w * 0.62, by - h * 0.1, cx - w * 0.4, by); c.lineTo(cx + w * 0.4, by); c.bezierCurveTo(cx + w * 0.62, by - h * 0.1, cx + w * 0.5, by - h * 0.82, cx + w * 0.12, by - h); c.closePath(); };
  shape(c, p, "#f3ead2"); dk(c, p, "#d9ccaa", w * 0.12);
  shape(c, () => rrect(c, cx - w * 0.17, by - h - 6, w * 0.34, 22, 8), COL.orange, 5);
  const r = [0.2, 0.7, 0.4, 0.9, 0.55, 0.3];
  for (let i = 0; i < 6; i++) shape(c, () => ell(c, cx - w * 0.25 + r[i] * w * 0.5, by - h * 0.2 - (i % 3) * h * 0.18, 9, 4, i), WHITE, 2);
};
const wheelDraw = (c: Ctx, x: number, y: number, r: number, lw = 6) => {
  shape(c, () => ell(c, x, y, r, r), COL.black, lw);
  shape(c, () => ell(c, x, y, r * 0.78, r * 0.78), COL.steelIn, lw * 0.7);
  for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4 + 0.2; line(c, [[x, y], [x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78]], lw * 0.8, COL.steelDk); }
  shape(c, () => ell(c, x, y, r * 0.17, r * 0.17), COL.steel, lw * 0.8);
};
// a balanced-able lever: fulcrum triangle (apex at (px, gy - fh)) and a plank turned by an about the apex.
// plank runs L to the left and R to the right of the apex; pt(u, v) gives world points (v = -th is the top face).
const lever = (c: Ctx, px: number, gy: number, fh: number, an: number, L: number, R: number, th = 34, tri = true) => {
  const py = gy - fh, ca = Math.cos(an), sa = Math.sin(an);
  if (tri) { shadow(c, px + 20, gy + 6, fh * 1.0, 12); const p = () => polyP(c, [[px, py], [px + fh * 0.7, gy], [px - fh * 0.7, gy]]); shape(c, p, FUL); shade(c, p, FULDK, -14, 0, 0.55); }
  c.save(); c.translate(px, py); c.rotate(an);
  const p = () => rrect(c, -L, -th, L + R, th, 8); shape(c, p, COL.wood); shade(c, p, COL.woodDk, 0, -9, 0.55);
  c.restore();
  return (u: number, v = -th) => [px + u * ca - v * sa, py + u * sa + v * ca];
};
const pressHand = (c: Ctx, x: number, y: number, s = 1) => hand(c, x, y - 98 * s, Math.PI / 2, s, SKIN.child, CLOTH.child, true);

// ---- reusable objects, designed inside a 300 px box around (0,0) and drawn at scale k
const mk = (k: number) => ({
  S: (c: Ctx, p: () => void, f: string, l = 6) => shape(c, p, f, l / k),
  L: (c: Ctx, pts: number[][], w = 6, col: string = INK) => line(c, pts, w / k, col),
  A: (c: Ctx, pts: number[][], w = 10) => arrow(c, pts, RED, w / k),
});
const leverObj = (c: Ctx, k: number) => {
  const { S } = mk(k), an = -0.2;
  S(c, () => polyP(c, [[0, 20], [55, 100], [-55, 100]]), FUL);
  c.save(); c.translate(0, 20); c.rotate(an);
  S(c, () => rrect(c, -135, -22, 270, 22, 5), COL.wood);
  c.restore();
  S(c, () => rrect(c, 70, -92, 54, 42, 5), CRATE); // the load, riding the raised end
  mk(k).A(c, [[-115, -30], [-115, 40]]);
};
const rampObj = (c: Ctx, k: number) => {
  const { S, A } = mk(k);
  S(c, () => polyP(c, [[-135, 100], [135, 100], [135, -40]]), COL.wood);
  c.save(); c.translate(0, 30); c.rotate(-0.49); S(c, () => rrect(c, -30, -50, 60, 50, 5), CRATE); c.restore();
  A(c, [[-70, 10], [20, -30]]);
};
const wheelAxleObj = (c: Ctx, k: number) => {
  const { S, A } = mk(k);
  S(c, () => rrect(c, -20, -12, 140, 24), COL.steelDk);
  wheelDraw(c, -20, 0, 100, 6 / k);
  A(c, [[-20, -125], [40, -105]]);
};
const pulleyObj = (c: Ctx, k: number) => {
  const { S, L, A } = mk(k);
  S(c, () => rrect(c, -110, -140, 220, 24, 6), COL.wood);
  L(c, [[0, -116], [0, -92]], 10);
  L(c, [[-42, -50], [-42, 70]], 9); L(c, [[-42, -50], [-42, 70]], 4, "#efe3c4");
  L(c, [[42, -50], [42, 110]], 9); L(c, [[42, -50], [42, 110]], 4, "#efe3c4");
  S(c, () => ell(c, 0, -50, 46, 46), COL.steel);
  S(c, () => ell(c, 0, -50, 28, 28), COL.steelIn, 4); S(c, () => ell(c, 0, -50, 8, 8), COL.steelDk, 3);
  S(c, () => rrect(c, -70, 70, 56, 46, 5), CRATE);
  A(c, [[90, 20], [90, 100]]); A(c, [[-95, 50], [-95, -10]]);
};
const wedgeObj = (c: Ctx, k: number) => {
  const { S, A } = mk(k);
  const p = () => polyP(c, [[-80, -90], [80, -90], [0, 110]]);
  S(c, p, COL.steel); shade(c, p, COL.steelDk, -14 / k, -14 / k, 0.6);
  A(c, [[0, -140], [0, -100]]);
};
const screwObj = (c: Ctx, k: number) => {
  const { S, L, A } = mk(k);
  S(c, () => polyP(c, [[-24, -90], [24, -90], [24, 70], [0, 120], [-24, 70]]), COL.steel);
  for (let y = -70; y < 80; y += 26) { L(c, [[-24, y], [24, y + 14]], 9, COL.steelDk); L(c, [[-18, y - 3], [4, y + 6]], 3, WHITE); }
  S(c, () => rrect(c, -50, -118, 100, 30, 8), COL.steel);
  L(c, [[-24, -103], [24, -103]], 6);
  A(c, [[-70, -150], [10, -165], [80, -150]]);
};
const place = (c: Ctx, x: number, y: number, k: number, f: (c: Ctx, k: number) => void) => { c.save(); c.translate(x, y); c.scale(k, k); f(c, k); c.restore(); };

// ---------------------------------------------------------------- flow cards
const tick = (c: Ctx, x1: number, x2: number, y: number) => { line(c, [[x1, y], [x2, y]], 5, COL.blueDk); line(c, [[x1, y - 12], [x1, y + 12]], 5, COL.blueDk); line(c, [[x2, y - 12], [x2, y + 12]], 5, COL.blueDk); };
const miniCart = (c: Ctx) => { // a toy cart, wheels on y = 0
  shape(c, () => rrect(c, -50, -62, 100, 36, 6), COL.teal);
  shape(c, () => rrect(c, -30, -90, 60, 30, 5), COL.yellow);
  for (const x of [-30, 30]) shape(c, () => ell(c, x, -20, 20, 20), COL.black, 5);
};
const onSlope = (c: Ctx, x0: number, y0: number, x1: number, y1: number, t: number, f: (c: Ctx) => void) => {
  const an = Math.atan2(y1 - y0, x1 - x0); c.save(); c.translate(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t); c.rotate(an); f(c); c.restore();
};
// flow.e2
const flow_e2 = (c: Ctx) => {
  scene(c, 790);
  const rampP = (x0: number, x1: number, top: number) => { const p = () => polyP(c, [[x0, 790], [x1, 790], [x1, top]]); shape(c, p, COL.wood); shade(c, p, COL.woodDk, 0, -12, 0.5); };
  rampP(60, 330, 530); rampP(410, 1020, 530);
  for (const [x0, x1, t] of [[60, 330, 0.55], [410, 1020, 0.5]] as number[][]) {
    onSlope(c, x0, 790, x1, 530, t, miniCart);
  }
  arrow(c, [[150, 650], [250, 560]]); arrow(c, [[640, 700], [800, 610]]);
  tick(c, 60, 330, 880); tick(c, 410, 1020, 880);
};
// flow.e3: a well with a winch
const flow_e3 = (c: Ctx) => {
  ground(c); c.fillStyle = COL.greenLt; c.fillRect(0, 860, 1080, 220); line(c, [[0, 860], [1080, 860]], 5);
  shadow(c, 560, 880, 280, 24);
  const wall = () => rrect(c, 330, 640, 440, 230, 12);
  shape(c, wall, STONE); dk(c, wall, STONEDK, 16);
  for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) line(c, [[345 + i * 105 + (r % 2) * 50, 660 + r * 70], [345 + i * 105 + (r % 2) * 50, 700 + r * 70]], 4);
  for (let r = 1; r < 3; r++) line(c, [[335, 640 + r * 70], [765, 640 + r * 70]], 4);
  shape(c, () => ell(c, 550, 640, 220, 50), STONE); shape(c, () => ell(c, 550, 642, 180, 36), COL.black, 5);
  shape(c, () => rrect(c, 350, 330, 34, 340, 6), COL.wood); shape(c, () => rrect(c, 716, 330, 34, 340, 6), COL.wood);
  shape(c, () => rrect(c, 330, 340, 470, 34, 8), COL.woodDk); // the axle
  shape(c, () => rrect(c, 470, 322, 160, 68, 10), COL.wood); // the drum
  for (let i = 0; i < 4; i++) line(c, [[490 + i * 36, 324], [490 + i * 36, 388]], 6, "#efe3c4");
  line(c, [[550, 388], [550, 520]], 11); line(c, [[550, 388], [550, 520]], 5, "#efe3c4");
  const bucket = () => polyP(c, [[500, 520], [600, 520], [585, 600], [515, 600]]); shape(c, bucket, COL.steel); shade(c, bucket, COL.steelDk, -14, -6, 0.6);
  shape(c, () => ell(c, 550, 520, 50, 10), COL.steelIn, 4);
  line(c, [[800, 357], [850, 440], [940, 440]], 20); line(c, [[800, 357], [850, 440], [940, 440]], 11, COL.red);
  shape(c, () => ell(c, 945, 440, 20, 20), COL.red, 5);
  arrow(c, [[640, 590], [640, 480]]);
  arrow(c, [[930, 360], [960, 400], [960, 470]]);
};
// flow.a1: lever hunt - scissors and a wheelbarrow, a dot at the fulcrum of each
const flow_a1 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(290, 520); c.rotate(-0.55);
  for (const s of [-1, 1]) {
    c.save(); c.rotate(s * 0.17);
    shape(c, () => polyP(c, [[-6, -18 * s], [250, 3 * s], [250, 12 * s], [-6, 18 * s]]), COL.steel);
    shape(c, () => rrect(c, -118, -9, 124, 18, 9), s > 0 ? COL.red : COL.blue);
    shape(c, () => ell(c, -150, 0, 52, 34), s > 0 ? COL.red : COL.blue, 7); shape(c, () => ell(c, -150, 0, 28, 17), "#efe4cf", 5);
    c.restore();
  }
  shape(c, () => ell(c, 0, 0, 16, 16), COL.steelDk, 5);
  c.restore();
  dot(c, 290, 520, 15);
  c.save(); c.translate(690, 0);
  shadow(c, 150, 900, 240, 20);
  line(c, [[-50, 700], [90, 650]], 26); line(c, [[-50, 700], [90, 650]], 14, COL.wood);
  line(c, [[-30, 710], [-45, 880]], 24); line(c, [[-30, 710], [-45, 880]], 12, COL.woodDk);
  const tray = () => polyP(c, [[70, 560], [330, 570], [290, 690], [110, 690]]);
  shape(c, tray, COL.teal); shade(c, tray, COL.tealDk, -14, -14, 0.55);
  shape(c, () => { c.moveTo(105, 566); c.bezierCurveTo(130, 480, 270, 480, 300, 574); c.closePath(); }, COL.soil, 5);
  wheelDraw(c, 300, 800, 78);
  line(c, [[300, 800], [220, 690]], 14); line(c, [[300, 800], [220, 690]], 7, COL.steelDk);
  c.restore();
  dot(c, 990, 800, 15);
};
// flow.a2: the grown-up near the middle, the child far out, the grown-up goes up
const flow_a2 = (c: Ctx) => {
  scene(c, 880);
  const pt = lever(c, 540, 880, 170, 0.1, 400, 470, 30);
  const [ax, ay] = pt(-190), [cx, cy] = pt(380);
  person(c, ax - 40, ay, 360, { sit: true, adult: true, armL: [1.2, 1.2], armR: [1.0, 1.3] });
  person(c, cx - 30, cy, 250, { sit: true, armL: [1.2, 1.2], armR: [1.0, 1.3] });
  arrow(c, [[ax - 150, ay - 330], [ax - 150, ay - 420]]);
  arrow(c, [[cx + 80, cy - 300], [cx + 80, cy - 210]]);
};
// flow.a3: the online see-saw game on a laptop
const flow_a3 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 930, 500, 28);
  shape(c, () => polyP(c, [[110, 830], [970, 830], [1020, 920], [60, 920]]), COL.steelDk);
  shape(c, () => rrect(c, 130, 130, 820, 700, 28), COL.black);
  shape(c, () => rrect(c, 165, 165, 750, 630, 12), COL.sky, 5);
  c.save(); c.beginPath(); rrect(c, 165, 165, 750, 630, 12); c.clip();
  c.fillStyle = COL.greenLt; c.fillRect(165, 700, 750, 100); line(c, [[165, 700], [915, 700]], 4);
  const pt = lever(c, 540, 700, 120, 0, 290, 290, 24);
  const [l, r] = [pt(-200, -24), pt(210, -24)];
  shape(c, () => rrect(c, l[0] - 50, l[1] - 100, 100, 100, 8), COL.steelDk, 5); write(c, "20", l[0] - 38, l[1] - 76, 50, WHITE, 7);
  shape(c, () => rrect(c, r[0] - 36, r[1] - 72, 72, 72, 8), COL.steel, 5); write(c, "10", r[0] - 28, r[1] - 56, 40, INK, 6);
  c.restore();
  shape(c, () => polyP(c, [[740, 520], [740, 620], [770, 595], [790, 640], [812, 630], [792, 586], [830, 584]]), WHITE, 5);
};
// flow.a4: a bent arm holding a bottle; the elbow is the fulcrum
const flow_a4 = (c: Ctx) => {
  scene(c, 960);
  const x = 420, y = 960, h = 640, sx = x + 0.11 * h, sy = y - 0.74 * h + 0.03 * h, ex = sx, ey = sy + 0.17 * h, wx = ex + 0.16 * h, wy = ey;
  person(c, x, y, h, { armR: [Math.PI / 2, 0] });
  const bw = 78, bh = 170;
  const body = () => rrect(c, wx - bw / 2 + 4, wy - bh + 60, bw, bh, 18);
  shape(c, body, COL.glass, 5);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(wx - 60, wy - bh + 100, 140, bh); c.restore();
  shape(c, body, "rgba(0,0,0,0)", 5);
  shape(c, () => rrect(c, wx - 22 + 4, wy - bh + 34, 44, 28, 7), COL.blue, 5);
  shape(c, () => ell(c, wx + 4, wy + 6, 26, 26), SKIN.child, 5);
  ring(c, ex, ey, 52);
  arrow(c, [[wx + 120, wy - 40], [wx + 120, wy - 150]]);
};
// flow.a5: the Earth and the Moon dance round one point
const flow_a5 = (c: Ctx) => {
  ground(c);
  const bx = 520, by = 540;
  c.setLineDash([22, 18]); c.beginPath(); ell(c, bx, by, 340, 340); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); c.beginPath(); ell(c, bx, by, 42, 42); c.stroke(); c.setLineDash([]);
  const ex = bx - 42, mx = bx + 340;
  shape(c, () => ell(c, ex, by, 150, 150), COL.blue); shade(c, () => ell(c, ex, by, 150, 150), COL.blueDk, -26, -26, 0.5);
  shape(c, () => { c.moveTo(ex - 90, by - 70); c.bezierCurveTo(ex - 40, by - 130, ex, by - 60, ex - 20, by - 10); c.bezierCurveTo(ex - 40, by + 40, ex - 100, by + 20, ex - 90, by - 70); c.closePath(); }, COL.green, 5);
  shape(c, () => { c.moveTo(ex + 40, by + 30); c.bezierCurveTo(ex + 100, by + 10, ex + 120, by + 80, ex + 70, by + 110); c.bezierCurveTo(ex + 30, by + 90, ex + 20, by + 60, ex + 40, by + 30); c.closePath(); }, COL.green, 5);
  shape(c, () => ell(c, mx, by, 58, 58), STONE); shade(c, () => ell(c, mx, by, 58, 58), STONEDK, -12, -12, 0.55);
  shape(c, () => ell(c, mx - 12, by - 14, 11, 11), STONEDK, 3); shape(c, () => ell(c, mx + 14, by + 16, 8, 8), STONEDK, 3);
  dot(c, bx, by, 15);
  const pts: number[][] = []; for (let i = 0; i <= 14; i++) { const a = -0.15 - i * 0.075; pts.push([bx + 340 * Math.cos(a), by + 340 * Math.sin(a)]); }
  arrow(c, pts);
};
// flow.a6: a door seen from above; a hand far from the hinge, a tiny push near it
const flow_a6 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 640, 260, 60, 8), STONE); shape(c, () => rrect(c, 800, 640, 240, 60, 8), STONE);
  const hx = 300, hy = 670, an = -0.9, len = 520;
  c.save(); c.translate(hx, hy); c.rotate(an);
  const d = () => rrect(c, 0, -16, len, 32, 8); shape(c, d, COL.woodDk); shade(c, d, "#a8723f", 0, -8, 0.5);
  shape(c, () => ell(c, len - 40, 0, 12, 12), COL.steel, 4);
  c.restore();
  shape(c, () => ell(c, hx, hy, 24, 24), COL.steel, 6);
  c.setLineDash([16, 14]); c.beginPath(); c.arc(hx, hy, len, an, 0); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); c.setLineDash([]);
  const nx = Math.sin(an) * 1, ny = -Math.cos(an) * 1; // push direction
  const fx = hx + Math.cos(an) * (len - 20), fy = hy + Math.sin(an) * (len - 20);
  hand(c, fx - nx * 105, fy - ny * 105, Math.atan2(ny, nx), 1, SKIN.child, CLOTH.child, true);
  const sxp = hx + Math.cos(an) * 90, syp = hy + Math.sin(an) * 90;
  arrow(c, [[sxp - nx * 80, syp - ny * 80], [sxp - nx * 20, syp - ny * 20]], RED, 8);
};
// flow.c1: a rice bag pulled up a board onto a chair
const flow_c1 = (c: Ctx) => {
  scene(c, 880);
  shadow(c, 830, 900, 200, 16);
  shape(c, () => rrect(c, 660, 500, 24, 380, 6), COL.woodDk); shape(c, () => rrect(c, 960, 500, 24, 380, 6), COL.woodDk);
  shape(c, () => rrect(c, 640, 470, 360, 38, 8), COL.wood);
  shape(c, () => rrect(c, 960, 190, 26, 290, 6), COL.woodDk);
  const rampP = () => polyP(c, [[110, 880], [650, 480], [650, 510], [140, 880]]);
  shape(c, rampP, COL.wood);
  onSlope(c, 110, 880, 650, 480, 0.55, () => { sack(c, 0, -2, 180, 150); });
  arrow(c, [[400, 480], [520, 395]]);
};
// flow.c2: a doorstep, a long gentle ramp beside it, a cart rolling up
const flow_c2 = (c: Ctx) => {
  scene(c, 840);
  shape(c, () => rrect(c, 700, 160, 380, 680, 6), "#e8c9a0");
  shape(c, () => rrect(c, 780, 300, 180, 410, 6), COL.woodDk); shape(c, () => rrect(c, 800, 320, 140, 380, 4), COL.wood, 0);
  const stepP = () => rrect(c, 700, 710, 380, 130, 4); shape(c, stepP, STONE); dk(c, stepP, STONEDK, 12);
  const rp = () => polyP(c, [[50, 840], [700, 840], [700, 710]]); shape(c, rp, COL.wood); shade(c, rp, COL.woodDk, 0, -14, 0.5);
  c.save(); c.translate(0, 0); onSlope(c, 50, 840, 700, 710, 0.5, () => { c.scale(1.5, 1.5); miniCart(c); }); c.restore();
  arrow(c, [[260, 640], [470, 585]]);
  tick(c, 50, 700, 920);
};

// ---------------------------------------------------------------- term cards
const term_0 = (c: Ctx) => { // force: a push and a pull
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, 440, 1080, 20); line(c, [[0, 460], [1080, 460]], 5);
  c.fillRect(0, 900, 1080, 180); line(c, [[0, 900], [1080, 900]], 5);
  crate(c, 640, 440, 260, 200);
  hand(c, 392, 340, 0, 1, SKIN.child, CLOTH.child, true); arrow(c, [[560, 170], [790, 170]]);
  crate(c, 420, 900, 260, 200);
  line(c, [[550, 810], [680, 810]], 12); line(c, [[550, 810], [680, 810]], 6, "#efe3c4");
  hand(c, 770, 810, Math.PI, 1, SKIN.child, CLOTH.child); arrow(c, [[300, 660], [530, 660]]);
};
const term_2 = (c: Ctx) => { // the six simple machines
  ground(c);
  const cells: [(c: Ctx, k: number) => void, number][] = [[leverObj, 1.2], [rampObj, 1.2], [wheelAxleObj, 1.1], [pulleyObj, 1.1], [wedgeObj, 1.3], [screwObj, 1.3]];
  cells.forEach(([f, k], i) => {
    const x = 40 + (i % 3) * 340, y = 100 + Math.floor(i / 3) * 440;
    shape(c, () => rrect(c, x, y, 320, 400, 24), "#fffaf0", 5);
    place(c, x + 160, y + 205, k * 0.82, f);
  });
};
const loadEffort = (c: Ctx, what: "load" | "effort") => {
  scene(c, 880);
  const pt = lever(c, 470, 880, 170, 0.14, 380, 560, 34);
  const [lx, ly] = pt(-300), [rx, ry] = pt(450);
  crate(c, lx, ly, 190, 150);
  pressHand(c, rx, ry, 1.1); arrow(c, [[rx + 150, ry - 220], [rx + 150, ry - 90]]);
  if (what === "load") ring(c, lx, ly - 75, 135); else ring(c, rx, ry - 70, 125);
};
const term_3 = (c: Ctx) => loadEffort(c, "load");
const term_4 = (c: Ctx) => loadEffort(c, "effort");
const term_5 = (c: Ctx) => { // lever: a crowbar lifting a rock
  scene(c, 860);
  shape(c, () => ell(c, 520, 815, 70, 48), STONE);
  shape(c, () => ell(c, 250, 735, 160, 112, -0.1), STONE); shade(c, () => ell(c, 250, 735, 160, 112, -0.1), STONEDK, -26, -26, 0.5);
  line(c, [[290, 830], [960, 650]], 26); line(c, [[290, 830], [960, 650]], 14, COL.steel);
  pressHand(c, 905, 664, 1);
  arrow(c, [[1010, 520], [1010, 620]]); arrow(c, [[250, 580], [250, 480]]);
};
const term_6 = (c: Ctx) => { // fulcrum: the point a lever turns on
  scene(c, 870);
  lever(c, 540, 870, 190, 0.1, 400, 400, 36);
  ring(c, 540, 680, 85);
  arrow(c, [[200, 520], [160, 580]], RED, 9); arrow(c, [[880, 620], [920, 570]], RED, 9);
};
const term_7 = (c: Ctx) => { // see-saw: two children
  scene(c, 880);
  const pt = lever(c, 540, 880, 190, 0.17, 420, 420, 30);
  const [lx, ly] = pt(-320), [rx, ry] = pt(340);
  person(c, lx - 45, ly, 300, { sit: true, armL: [1.2, 1.2], armR: [1.0, 1.3] });
  person(c, rx - 45, ry, 300, { sit: true, armL: [1.2, 1.2], armR: [1.0, 1.3] });
};
const term_8 = (c: Ctx) => { // balance: a shop scale, both pans level
  ground(c);
  const bx = 540;
  shadow(c, bx + 20, 960, 220, 22);
  shape(c, () => polyP(c, [[bx - 190, 960], [bx + 190, 960], [bx + 120, 900], [bx - 120, 900]]), COL.brown);
  shape(c, () => rrect(c, bx - 20, 250, 40, 660, 8), COL.woodDk);
  shape(c, () => rrect(c, bx - 330, 230, 660, 30, 12), COL.wood);
  shape(c, () => ell(c, bx, 245, 24, 24), COL.steel, 6);
  for (const s of [-1, 1]) {
    const ex = bx + s * 300, py = 640;
    line(c, [[ex, 262], [ex - 110, py]], 5); line(c, [[ex, 262], [ex + 110, py]], 5); line(c, [[ex, 262], [ex, py]], 5);
    const pan = () => { c.moveTo(ex - 130, py); c.bezierCurveTo(ex - 110, py + 70, ex + 110, py + 70, ex + 130, py); c.closePath(); };
    shape(c, pan, COL.steel); shade(c, pan, COL.steelDk, -14, -6, 0.55);
    shape(c, () => ell(c, ex, py, 130, 18), COL.steelIn, 5);
    if (s < 0) sack(c, ex, py - 4, 120, 100); else { const wt = () => rrect(c, ex - 40, py - 100, 80, 90, 12); shape(c, wt, COL.yellow); dk(c, wt, COL.woodDk, 10); shape(c, () => rrect(c, ex - 18, py - 122, 36, 28, 8), COL.yellow, 5); }
  }
};
const term_11 = (c: Ctx) => { // wheel
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, 880, 1080, 200); line(c, [[0, 880], [1080, 880]], 5);
  shadow(c, 560, 892, 330, 22);
  wheelDraw(c, 540, 540, 340, 10);
  arrow(c, [[200, 130], [330, 70], [470, 60]]);
};
const term_12 = (c: Ctx) => { // axle: the rod through the middle of the wheels
  scene(c, 860);
  shadow(c, 560, 880, 360, 20);
  shape(c, () => rrect(c, 230, 515, 640, 50, 12), COL.steelDk);
  shape(c, () => rrect(c, 230, 515, 640, 20, 10), COL.steel, 0);
  for (const x of [250, 850]) { shape(c, () => rrect(c, x - 60, 380, 120, 330, 40), COL.black); shape(c, () => rrect(c, x - 28, 420, 56, 250, 22), COL.steelIn, 5); shape(c, () => ell(c, x, 540, 24, 24), COL.steelDk, 5); }
  ring(c, 540, 540, 70);
};
const term_13 = (c: Ctx) => { // wheel and axle: a screwdriver, a fat handle on a thin rod
  ground(c);
  c.save(); c.translate(540, 540); c.rotate(-0.25);
  const sh = () => rrect(c, -20, 150, 40, 250, 6); shape(c, sh, COL.steel); shade(c, sh, COL.steelDk, -8, 0, 0.55);
  const hd = () => { c.moveTo(-80, -40); c.bezierCurveTo(-95, -230, 95, -230, 80, -40); c.lineTo(60, 160); c.lineTo(-60, 160); c.closePath(); };
  shape(c, hd, COL.orange); shade(c, hd, "#d27c25", -18, -6, 0.5);
  for (let i = 0; i < 4; i++) line(c, [[-62 + i * 2, -60 + i * 50], [62 - i * 2, -60 + i * 50]], 5, "#d27c25");
  shine(c, [[-50, -100], [-40, 60]], 9);
  c.restore();
  arrow(c, [[300, 280], [440, 200], [610, 200]]);
};
const term_14 = (c: Ctx) => { // roller: a heavy block rolls on logs
  scene(c, 830);
  for (const x of [330, 530, 730]) { shadow(c, x + 10, 832, 55, 10); shape(c, () => ell(c, x, 780, 52, 52), COL.brown); shape(c, () => ell(c, x, 780, 30, 30), COL.wood, 4); shape(c, () => ell(c, x, 780, 10, 10), COL.brown, 3); }
  const b = () => rrect(c, 240, 560, 600, 170, 14); shape(c, b, STONE); dk(c, b, STONEDK, 18);
  line(c, [[300, 640], [450, 640]], 4, STONEDK); line(c, [[600, 600], [760, 600]], 4, STONEDK);
  hand(c, 100, 640, 0, 1, SKIN.child, CLOTH.child, true);
  arrow(c, [[420, 440], [680, 440]]);
};
const term_15 = (c: Ctx) => { // wedge: splitting a log
  scene(c, 880);
  shadow(c, 540, 892, 280, 18);
  const left = () => polyP(c, [[330, 880], [330, 540], [500, 540], [545, 700], [545, 880]]);
  const right = () => polyP(c, [[750, 880], [750, 540], [580, 540], [545, 700], [545, 880]]);
  c.save(); c.translate(-14, 0); shape(c, left, COL.brown); c.restore();
  c.save(); c.translate(14, 0); shape(c, right, COL.brown); dk(c, right, CRATEDK, 16); c.restore();
  const wd = () => polyP(c, [[455, 330], [625, 330], [545, 700]]); shape(c, wd, COL.steel); shade(c, wd, COL.steelDk, -16, -16, 0.6);
  arrow(c, [[540, 130], [540, 280]]);
  arrow(c, [[285, 640], [200, 640]]); arrow(c, [[800, 640], [885, 640]]);
};
const term_17 = (c: Ctx) => { ground(c); place(c, 540, 560, 2.6, pulleyObj); };
const term_20 = (c: Ctx) => { // balance point: a ruler balanced on one finger
  ground(c);
  shape(c, () => rrect(c, 495, 586, 90, 520, 45), SKIN.child);
  shade(c, () => rrect(c, 495, 586, 90, 520, 45), SKIN.childDk, -18, 0, 0.55);
  shadow(c, 560, 580, 360, 18);
  const r = () => rrect(c, 130, 500, 820, 86, 8); shape(c, r, COL.wood); shade(c, r, COL.woodDk, 0, -14, 0.55);
  for (let i = 0; i <= 30; i++) { const x = 155 + i * 25.8; line(c, [[x, 500], [x, 500 + (i % 5 === 0 ? 32 : 18)]], i % 5 === 0 ? 4 : 3); }
  arrow(c, [[540, 330], [540, 460]]);
};

// ---------------------------------------------------------------- explanation cards
const expl_3 = (c: Ctx) => { // no free gifts: a small push moves a long way, the load moves a little
  scene(c, 900);
  const an = 0.2, pt = lever(c, 330, 900, 150, an, 190, 600, 34);
  const [lx, ly] = pt(-110), [rx, ry] = pt(560);
  crate(c, lx, ly, 150, 120);
  pressHand(c, rx, ry, 1);
  arrow(c, [[lx, ly - 170], [lx, ly - 215]], RED, 9);
  arrow(c, [[rx + 150, ry - 300], [rx + 150, ry - 90]], RED, 11);
};
const lev3 = (c: Ctx, y: number, kind: 1 | 2 | 3) => {
  const gy = y + 250, th = 24, L = 260, R = 340;
  const px = kind === 1 ? 540 : 280;
  line(c, [[0, gy], [1080, gy]], 4, "rgba(43,35,64,0.25)");
  const p = () => polyP(c, [[px, gy - 70], [px + 48, gy], [px - 48, gy]]); shape(c, p, FUL);
  const x0 = kind === 1 ? 240 : 250, x1 = 860;
  shape(c, () => rrect(c, x0, gy - 70 - th, x1 - x0, th, 8), COL.wood);
  const top = gy - 70 - th;
  if (kind === 1) { crate(c, 330, top, 110, 90); arrow(c, [[780, top - 110], [780, top - 20]]); }
  if (kind === 2) { crate(c, 560, top, 110, 90); arrow(c, [[840, top + 130], [840, top + 30]]); }
  if (kind === 3) { crate(c, 800, top, 110, 90); arrow(c, [[560, top - 110], [560, top - 20]]); }
  void L; void R;
};
const expl_4 = (c: Ctx) => {
  ground(c);
  lev3(c, 20, 1); lev3(c, 370, 2); lev3(c, 720, 3);
  write(c, "1", 80, 140, 100, INK, 10); write(c, "2", 80, 490, 100, INK, 10); write(c, "3", 80, 840, 100, INK, 10);
};
const expl_5 = (c: Ctx) => { // a steep lift versus a gentle ramp
  scene(c, 880);
  line(c, [[520, 60], [520, 1040]], 4, "rgba(43,35,64,0.3)");
  const platL = () => rrect(c, 330, 620, 160, 260, 6); shape(c, platL, STONE); dk(c, platL, STONEDK, 12);
  crate(c, 170, 880, 170, 140);
  arrow(c, [[250, 800], [250, 640]], RED, 14);
  const platR = () => rrect(c, 920, 620, 130, 260, 6); shape(c, platR, STONE); dk(c, platR, STONEDK, 12);
  const rp = () => polyP(c, [[570, 880], [920, 880], [920, 620]]); shape(c, rp, COL.wood); shade(c, rp, COL.woodDk, 0, -12, 0.5);
  onSlope(c, 570, 880, 920, 620, 0.42, () => { crate(c, 0, 0, 110, 90); });
  arrow(c, [[640, 700], [740, 625]], RED, 8);
};

const term_16 = (c: Ctx) => { ground(c); place(c, 540, 540, 3.2, screwObj); };
export const ic_forcesSimpleMachinesL3 = cards("sci.forces.simple-machines.L3 cards", [
  flow_e2, flow_e3, flow_a1, flow_a2, flow_a3, flow_a4, flow_a5, flow_a6, flow_c1, flow_c2,
  term_0, term_2, term_3, term_4, term_5, term_6, term_7, term_8, term_11, term_12, term_13, term_14, term_15, term_16, term_17, term_20,
  expl_3, expl_4, expl_5,
]);
