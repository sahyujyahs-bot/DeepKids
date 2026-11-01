import type { Ctx } from "./core";
import { INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, plate, hand, person, write, rnd, cards } from "./flatKit";

// sci.motion.physics-of-sport.L3 set-up cards: bouncing balls, a marble off a table, standing jumps.

const FLOOR = "#dccdaa", FLOORDK = "#c7b58e", TAPE = "rgba(255,211,77,0.85)", WOODTOP = "#f8d88a";

// ---------------------------------------------------------------- shared pieces
const floorBand = (c: Ctx, y: number) => {
  c.fillStyle = FLOOR; c.fillRect(0, y, 1080, 1080 - y);
  line(c, [[0, y], [1080, y]], 6);
  for (let k = -6; k <= 16; k++) line(c, [[k * 120 + 60, y], [k * 120 + 60 + (k * 120 + 60 - 540) * 0.35, 1080]], 3, FLOORDK);
  for (const d of [60, 150]) if (y + d < 1080) line(c, [[0, y + d], [1080, y + d]], 3, FLOORDK);
};
const tapePiece = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 3), TAPE, 4); c.restore();
};
// a tennis ball: yellow-green, a white curved seam, shade side
const ball = (c: Ctx, x: number, y: number, r: number, onFloor = false) => {
  if (onFloor) shadow(c, x + r * 0.2, y + r + 4, r * 0.9, r * 0.2);
  const p = () => ell(c, x, y, r, r);
  shape(c, p, "#d9e24f", 6);
  shade(c, p, "#a9b52c", r * 0.35, r * 0.3, 0.6);
  c.save(); c.beginPath(); p(); c.clip();
  line(c, [[x - r * 0.95, y - r * 0.35], [x - r * 0.3, y - r * 0.05], [x - r * 0.1, y + r * 0.5], [x - r * 0.4, y + r * 1.1]], r * 0.11, WHITE);
  line(c, [[x + r * 0.95, y + r * 0.35], [x + r * 0.3, y + r * 0.05], [x + r * 0.1, y - r * 0.5], [x + r * 0.4, y - r * 1.1]], r * 0.11, WHITE);
  c.restore();
  c.beginPath(); p(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
};
// a paper ruler strip on the wall, ticks every 10 cm: 0 at floorY, one step per 10 cm
const wallRuler = (c: Ctx, x: number, w: number, floorY: number, step: number, labelH: number) => {
  const top = floorY - step * 10 - labelH - 40;
  c.beginPath(); c.rect(x + 12, top + 10, w, floorY - top); c.fillStyle = "rgba(43,35,64,0.16)"; c.fill();
  shape(c, () => c.rect(x, top, w, floorY - top), COL.paper, 6);
  for (let k = 0; k <= 10; k++) {
    const y = floorY - step * k;
    line(c, [[x, y], [x + w * 0.32, y]], 6);
    write(c, String(k * 10), x + w * 0.4, y - labelH - 6, labelH, INK, 5);
  }
  tapePiece(c, x + w * 0.1, top + 8, 70, 34, -0.2); tapePiece(c, x + w * 0.9, top + 8, 70, 34, 0.2);
  tapePiece(c, x + w * 0.1, floorY - 14, 70, 34, 0.2); tapePiece(c, x + w * 0.9, floorY - 14, 70, 34, -0.2);
};
// the left-pointing hand (fingers to the left, thumb up, sleeve on the right)
const handLeft = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, 0, s); c.restore();
};
const dashed = (c: Ctx, pts: number[][], col: string, w: number, d: number[]) => { c.setLineDash(d); line(c, pts, w, col); c.setLineDash([]); };

// ---- wooden table side view
const tableSide = (c: Ctx, x0: number, x1: number, topY: number, legs: number[], legBottom: number) => {
  shadow(c, (x0 + x1) / 2 + 30, legBottom + 12, (x1 - x0) / 2, 22);
  for (const lx of legs) { shape(c, () => rrect(c, lx, topY + 40, 50, legBottom - topY - 40, 6), COL.wood); shade(c, () => rrect(c, lx, topY + 40, 50, legBottom - topY - 40, 6), COL.woodDk, 18, 0, 0.7); }
  shape(c, () => rrect(c, x0, topY, x1 - x0, 28, 6), WOODTOP);
  shape(c, () => rrect(c, x0, topY + 26, x1 - x0, 46, 6), COL.wood);
  shade(c, () => rrect(c, x0, topY + 26, x1 - x0, 46, 6), COL.woodDk, 0, 22, 0.6);
};
const book = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const th = h * 0.16;
  shape(c, () => rrect(c, x + 8, y + th - 2, w - 10, h - 2 * th + 4, 2), COL.paper, 5);
  for (let k = 1; k < 4; k++) line(c, [[x + 16, y + th + (k * (h - 2 * th)) / 4], [x + w - 6, y + th + (k * (h - 2 * th)) / 4]], 2.5, COL.grey);
  shape(c, () => rrect(c, x, y, w, th, 4), COL.blue); shape(c, () => rrect(c, x, y + h - th, w, th, 4), COL.blue);
  shape(c, () => rrect(c, x, y, 22, h, 5), COL.blueDk);
};
// a see-through plastic ruler with a groove down the middle, its lower edge starting at (ox, oy) and tilted by a
const ruler = (c: Ctx, ox: number, oy: number, a: number, from: number, to: number, t = 44) => {
  c.save(); c.translate(ox, oy); c.rotate(a);
  const k = t / 44;
  shape(c, () => rrect(c, from, -t, to - from, t, 5), COL.sky, 6);
  shape(c, () => rrect(c, from + 14, -t * 0.7, to - from - 28, t * 0.4, 4), COL.blue, 4);
  for (let i = 0, x = from + 30; x < to - 10; i++, x += 21 * k) line(c, [[x, -t], [x, -t + (i % 10 === 0 ? 14 : i % 5 === 0 ? 10 : 6) * k]], 2.5);
  c.restore();
};
const marble = (c: Ctx, x: number, y: number, r: number, onFloor = false) => {
  if (onFloor) shadow(c, x + r * 0.3, y + r + 2, r, r * 0.2);
  const p = () => ell(c, x, y, r, r);
  shape(c, p, COL.blue, 5); shade(c, p, COL.blueDk, r * 0.4, r * 0.35, 0.8);
  c.save(); c.beginPath(); p(); c.clip();
  line(c, [[x - r * 0.6, y + r * 0.35], [x + r * 0.05, y + r * 0.1], [x + r * 0.55, y + r * 0.5]], r * 0.22, COL.sky);
  c.restore();
  c.beginPath(); p(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  shine(c, [[x - r * 0.55, y - r * 0.4], [x - r * 0.2, y - r * 0.7]], r * 0.22);
};
// a bare foot seen from above, heel at (hx, hy), toes pointing along rot (0 = up the page); mirror -1 for the right foot
const foot = (c: Ctx, hx: number, hy: number, rot: number, s: number, mirror: number) => {
  c.save(); c.translate(hx, hy); c.rotate(rot); c.scale(s * mirror, s);
  const sole = () => { c.moveTo(-40, -310); c.bezierCurveTo(-85, -280, -82, -200, -60, -120); c.bezierCurveTo(-52, -60, -58, 0, 0, 0); c.bezierCurveTo(58, 0, 62, -60, 56, -130); c.bezierCurveTo(52, -200, 88, -250, 78, -310); c.bezierCurveTo(70, -350, -30, -350, -40, -310); c.closePath(); };
  const toes: number[][] = [[55, -340, 27], [20, -355, 20], [-8, -350, 18], [-32, -338, 16], [-52, -318, 14]];
  toes.forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r * 1.05), SKIN.child, 6));
  shape(c, sole, SKIN.child, 6);
  shade(c, sole, SKIN.childDk, 26, 0, 0.55);
  toes.forEach(([x, y, r]) => shape(c, () => ell(c, x + r * 0.05, y - r * 0.4, r * 0.5, r * 0.32), "#e8c9a8", 2.5));
  c.restore();
};
// the orange trouser leg coming up out of the page at the ankle: a ring round the heel
const cuff = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.9), CLOTH.child, 6);
  shade(c, () => ell(c, x, y, r, r * 0.9), CLOTH.childDk, r * 0.3, r * 0.2, 0.7);
  shape(c, () => ell(c, x, y, r * 0.62, r * 0.55), SKIN.childDk, 5);
};
const tapeLine = (c: Ctx, x0: number, y0: number, x1: number, y1: number, w: number) => {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = (-dy / L) * w / 2, ny = (dx / L) * w / 2;
  shape(c, () => polyP(c, [[x0 + nx, y0 + ny], [x1 + nx, y1 + ny], [x1 - nx, y1 - ny], [x0 - nx, y0 - ny]]), COL.blue, 6);
  line(c, [[x0 - nx * 0.35, y0 - ny * 0.35], [x1 - nx * 0.35, y1 - ny * 0.35]], 4, COL.sky);
};

// ---------------------------------------------------------------- e1: bounce heights
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c); floorBand(c, 900);
  wallRuler(c, 330, 330, 900, 76, 34);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c); floorBand(c, 960);
  wallRuler(c, 70, 240, 960, 73, 28);
  const hy = 960 - 73 * 5;
  // the child crouching with eyes level with the 50 mark
  const ch = 730;
  shadow(c, 700, 962, 200, 22);
  person(c, 650, 960, ch, { sit: true, armL: [Math.PI * 0.5, Math.PI * 0.5], armR: [Math.PI * 0.5, Math.PI * 0.5] });
  dashed(c, [[540, hy - 2], [326, hy - 2]], RED, 7, [18, 14]);
  // the hand holding the ball with its bottom at the 100 mark
  const by = 960 - 730 - 0;
  dashed(c, [[326, by], [410, by]], RED, 7, [18, 14]);
  ball(c, 470, by - 62, 62);
  handLeft(c, 470 + 95, by - 62, 1.35);
  arrow(c, [[470, by + 60], [470, by + 190]]);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c, BG);
  floorBand(c, 560);
  const cy = 740, xs = [118, 330, 542, 754, 966];
  xs.forEach((x) => { ball(c, x, 270, 40); arrow(c, [[x, 340], [x, 480]], RED, 9); });
  // 1 bare tile
  shadow(c, xs[0] + 14, cy + 66, 100, 20);
  shape(c, () => polyP(c, [[xs[0] - 80, cy - 50], [xs[0] + 80, cy - 50], [xs[0] + 96, cy + 46], [xs[0] - 96, cy + 46]]), "#f4ecd8");
  shape(c, () => polyP(c, [[xs[0] - 96, cy + 46], [xs[0] + 96, cy + 46], [xs[0] + 96, cy + 62], [xs[0] - 96, cy + 62]]), COL.greyDk);
  line(c, [[xs[0], cy - 50], [xs[0], cy + 46]], 4, COL.grey); line(c, [[xs[0] - 88, cy - 2], [xs[0] + 88, cy - 2]], 4, COL.grey);
  // 2 doormat
  const mx = xs[1];
  shadow(c, mx + 14, cy + 66, 100, 20);
  shape(c, () => polyP(c, [[mx - 80, cy - 50], [mx + 80, cy - 50], [mx + 96, cy + 46], [mx - 96, cy + 46]]), COL.brown);
  for (let k = 0; k < 6; k++) line(c, [[mx - 74 + k * 4 - 6, cy - 36 + k * 16], [mx + 74 - k * 4 + 6, cy - 36 + k * 16]], 5, COL.soilDk);
  shape(c, () => polyP(c, [[mx - 96, cy + 46], [mx + 96, cy + 46], [mx + 96, cy + 64], [mx - 96, cy + 64]]), COL.soilDk);
  for (let k = 0; k < 11; k++) line(c, [[mx - 90 + k * 18, cy + 64], [mx - 90 + k * 18, cy + 80]], 5, COL.soil);
  // 3 folded bedsheet
  const bx = xs[2];
  shadow(c, bx + 14, cy + 80, 100, 20);
  shape(c, () => polyP(c, [[bx - 80, cy - 62], [bx + 80, cy - 62], [bx + 94, cy + 4], [bx - 94, cy + 4]]), COL.blue);
  line(c, [[bx - 60, cy - 36], [bx + 60, cy - 36]], 3, COL.sky); line(c, [[bx - 76, cy - 14], [bx + 76, cy - 14]], 3, COL.sky);
  for (let k = 0; k < 3; k++) shape(c, () => rrect(c, bx - 94, cy + 4 + k * 24, 188, 24, 6), k % 2 ? COL.blueDk : COL.blue);
  // 4 pillow
  const px = xs[3];
  shadow(c, px + 14, cy + 66, 100, 20);
  const pil = () => { c.moveTo(px - 92, cy - 30); c.quadraticCurveTo(px, cy - 80, px + 92, cy - 30); c.quadraticCurveTo(px + 108, cy + 10, px + 92, cy + 50); c.quadraticCurveTo(px, cy + 80, px - 92, cy + 50); c.quadraticCurveTo(px - 108, cy + 10, px - 92, cy - 30); c.closePath(); };
  shape(c, pil, WHITE); shade(c, pil, COL.steelDk, 30, 20, 0.4);
  line(c, [[px - 70, cy - 30], [px - 50, cy], [px - 70, cy + 40]], 3, COL.steelDk); line(c, [[px + 70, cy - 30], [px + 50, cy], [px + 70, cy + 40]], 3, COL.steelDk);
  // 5 steel plate of rice
  const qx = xs[4];
  plate(c, qx, cy + 10, 98, 62);
  const rice = () => { c.moveTo(qx - 66, cy + 24); c.quadraticCurveTo(qx, cy - 70, qx + 66, cy + 24); c.quadraticCurveTo(qx, cy + 48, qx - 66, cy + 24); c.closePath(); };
  shape(c, rice, WHITE, 5); shade(c, rice, COL.steelIn, 18, 12, 0.9);
  const r = rnd(5); for (let k = 0; k < 14; k++) { const gx = qx - 40 + r() * 80, gy = cy - 10 + r() * 40; line(c, [[gx, gy], [gx + 8, gy - 3]], 3, COL.grey); }
};

// ---------------------------------------------------------------- e2: marble off the table
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c); floorBand(c, 930);
  tableSide(c, 30, 910, 640, [70, 840], 960);
  book(c, 60, 516, 198, 124);
  ruler(c, 258, 516, 0.2796, -50, 450, 44);
  // 10 cm between the ruler end and the table edge
  line(c, [[702, 548], [702, 596]], 4, RED); line(c, [[910, 548], [910, 640]], 4, RED);
  arrow(c, [[806, 570], [708, 570]]); arrow(c, [[806, 570], [904, 570]]);
  write(c, "10 cm", 725, 470, 50, INK, 7);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c); floorBand(c, 830);
  tableSide(c, 0, 720, 190, [90, 630], 880);
  tapePiece(c, 708, 192, 44, 34, 0);
  const kx = 708;
  line(c, [[kx, 205], [kx, 640]], 5, INK);
  shadow(c, kx + 14, 894, 50, 11);
  const key = () => { c.rect(kx - 14, 690, 28, 200); };
  const bow = () => { ell(c, kx, 652, 46, 46); c.moveTo(kx + 20, 652); ell(c, kx, 652, 20, 20); };
  const tooth = (y: number) => () => rrect(c, kx + 10, y, 34, 24, 4);
  shape(c, key, COL.yellow); shade(c, key, COL.orange, 10, 0, 0.6);
  shape(c, tooth(824), COL.yellow); shape(c, tooth(860), COL.yellow);
  c.beginPath(); bow(); c.fillStyle = COL.yellow; c.fill("evenodd"); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  shade(c, () => { ell(c, kx, 652, 46, 46); }, COL.orange, 10, 12, 0.5);
  c.beginPath(); ell(c, kx, 652, 20, 20); c.fillStyle = BG; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  line(c, [[kx, 640], [kx, 626]], 5, INK);
  // the pencil mark on the floor right under the key tip, and a pencil beside it
  line(c, [[kx - 22, 905], [kx + 22, 925]], 9, "#4a4458"); line(c, [[kx + 22, 905], [kx - 22, 925]], 9, "#4a4458");
  c.save(); c.translate(900, 985); c.rotate(-0.12);
  shape(c, () => rrect(c, -110, -14, 190, 28, 4), COL.yellow); shade(c, () => rrect(c, -110, -14, 190, 28, 4), COL.orange, 0, 8, 0.7);
  shape(c, () => polyP(c, [[80, -14], [80, 14], [122, 0]]), "#f0d9b5", 5); shape(c, () => polyP(c, [[108, -5], [108, 5], [122, 0]]), INK, 2);
  shape(c, () => rrect(c, -138, -14, 30, 28, 4), COL.pink); c.restore();
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c); floorBand(c, 830);
  tableSide(c, 0, 440, 300, [60, 380], 880);
  book(c, 40, 212, 110, 88);
  ruler(c, 150, 212, 0.455, -35, 200, 34);
  // the plate of rava on the floor with a dent
  plate(c, 760, 950, 240, 80);
  const mound = () => ell(c, 760, 948, 196, 58);
  shape(c, mound, "#f3dc8e", 5); shade(c, mound, "#d9bd62", 40, 22, 0.6);
  const r = rnd(9); for (let k = 0; k < 40; k++) { const a = r() * 6.28, d = Math.sqrt(r()); const gx = 760 + Math.cos(a) * 170 * d, gy = 948 + Math.sin(a) * 46 * d; c.beginPath(); c.arc(gx, gy, 3, 0, 6.3); c.fillStyle = "#d9bd62"; c.fill(); }
  shape(c, () => ell(c, 763, 940, 40, 15), "#caa44f", 4); shape(c, () => ell(c, 766, 943, 26, 8), "#a8873a", 0);
  // the flight
  const at = (u: number) => [440 + 330 * u, 304 + 640 * u * u];
  const pts: number[][] = []; for (let u = 0.1; u <= 0.58; u += 0.04) pts.push(at(u));
  arrow(c, pts);
  const tail: number[][] = []; for (let u = 0.84; u <= 0.97; u += 0.03) tail.push(at(u));
  dashed(c, tail, RED, 7, [2, 18]);
  marble(c, at(0.73)[0], at(0.73)[1], 40);
};

// ---------------------------------------------------------------- e3: standing jump
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c, FLOOR);
  for (let x = 0; x <= 1080; x += 180) line(c, [[x, 0], [x, 1080]], 3, FLOORDK);
  for (let y = 60; y <= 1080; y += 180) line(c, [[0, y], [1080, y]], 3, FLOORDK);
  c.fillStyle = "#b9a982"; c.fillRect(0, 0, 90, 1080); c.fillRect(990, 0, 90, 1080); line(c, [[90, 0], [90, 1080]], 6); line(c, [[990, 0], [990, 1080]], 6);
  tapeLine(c, 90, 300, 990, 300, 64);
  [[420, 1], [680, -1]].forEach(([x, m]) => { shadow(c, x + 20, 790, 70, 40); foot(c, x, 770, 0, 1, m); cuff(c, x, 770, 62); });
};

// setup.e3.1
const jumper = (c: Ctx, x: number, y: number, h: number, up: boolean) => {
  const P = (dx: number, dy: number): [number, number] => [x + dx * h, y - dy * h];
  const limb = (pts: [number, number][], w: number, col: string) => { line(c, pts, w * h + 10, INK); line(c, pts, w * h, col); };
  const hip = P(0, 0.38), knee = P(0.17, 0.22), ankle = P(0.02, 0.06), sho = P(0.04, 0.68);
  const trouser = "#6b5a8c";
  // far arm (darker)
  const armPts = up ? [sho, P(0.2, 0.79), P(0.33, 0.92)] : [sho, P(-0.1, 0.56), P(-0.08, 0.43)];
  limb(armPts.map(([a, b]) => [a - 8, b + 4] as [number, number]), 0.058, CLOTH.childDk);
  // legs, tucked
  limb([hip, knee, ankle], 0.085, trouser);
  shape(c, () => ell(c, ankle[0] + 0.04 * h, ankle[1] + 0.012 * h, 0.07 * h, 0.032 * h, 0.05), SKIN.child, 5);
  // torso
  limb([hip, sho], 0.17, CLOTH.child);
  line(c, [[hip[0] - 0.055 * h, hip[1] - 4], [sho[0] - 0.055 * h, sho[1] + 10]], 0.06 * h, CLOTH.childDk);
  // near arm
  limb(armPts, 0.06, CLOTH.child);
  const hand1 = armPts[2];
  shape(c, () => ell(c, hand1[0], hand1[1], 0.04 * h, 0.04 * h), SKIN.child, 5);
  if (!up) { shape(c, () => ell(c, hand1[0] - 0.03 * h, hand1[1] + 0.02 * h, 0.035 * h, 0.035 * h), SKIN.childDk, 5); line(c, [[hand1[0] - 0.02 * h, hand1[1] - 0.01 * h], [hand1[0] + 0.02 * h, hand1[1] + 0.03 * h]], 4); }
  // head
  const hx = x + 0.07 * h, hy = y - 0.8 * h, hr = 0.095 * h;
  shape(c, () => ell(c, hx, hy, hr, hr * 1.05), SKIN.child);
  shape(c, () => { c.moveTo(hx - hr * 0.1, hy - hr * 1.05); c.bezierCurveTo(hx - hr * 1.4, hy - hr * 1.2, hx - hr * 1.3, hy + hr * 0.9, hx - hr * 0.5, hy + hr * 0.9); c.lineTo(hx - hr * 0.5, hy - hr * 0.1); c.bezierCurveTo(hx - hr * 0.1, hy - hr * 0.2, hx + hr * 0.5, hy - hr * 0.3, hx + hr * 0.95, hy - hr * 0.35); c.bezierCurveTo(hx + hr * 0.9, hy - hr * 1.05, hx + hr * 0.4, hy - hr * 1.15, hx - hr * 0.1, hy - hr * 1.05); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, hx + hr * 0.5, hy + hr * 0.05, hr * 0.11, hr * 0.14), INK, 0);
  c.beginPath(); c.arc(hx + hr * 0.4, hy + hr * 0.4, hr * 0.3, 0.2, Math.PI * 0.8); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
const e3_1 = (c: Ctx) => {
  ground(c); floorBand(c, 900);
  line(c, [[540, 40], [540, 880]], 5, COL.grey);
  [260, 780].forEach((x) => { shadow(c, x + 10, 960, 130, 24); });
  jumper(c, 260, 800, 620, false);
  jumper(c, 780, 800, 620, true);
  arrow(c, [[1030, 560], [1042, 330]]);
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c, FLOOR);
  for (let x = 0; x <= 1080; x += 180) line(c, [[x, 0], [x, 1080]], 3, FLOORDK);
  for (let y = 60; y <= 1080; y += 180) line(c, [[0, y], [1080, y]], 3, FLOORDK);
  tapeLine(c, 110, 130, 110, 950, 56);
  // the measuring tape from the start line to the coin
  const ty = 640, x0 = 112, x1 = 690;
  shadow(c, 420, ty + 40, 290, 18);
  shape(c, () => rrect(c, x0, ty - 34, x1 - x0, 68, 4), COL.yellow, 6);
  shade(c, () => rrect(c, x0, ty - 34, x1 - x0, 68, 4), COL.orange, 0, 20, 0.5);
  for (let k = 0; k <= 100; k += 10) { const x = x0 + ((x1 - 20 - x0) * k) / 100; line(c, [[x, ty - 34], [x, ty - 34 + (k % 20 ? 16 : 26)]], 4); }
  for (let k = 20; k <= 80; k += 20) { const x = x0 + ((x1 - 20 - x0) * k) / 100; write(c, String(k), x - String(k).length * 11, ty - 4, 28, INK, 5); }
  write(c, "0", x0 + 12, ty - 4, 28, INK, 5);
  // feet after landing, toes forward; coin just behind the back heel
  [400, 640].forEach((y) => { shadow(c, 800, y + 20, 130, 40); });
  foot(c, 765, 400, Math.PI / 2, 0.78, 1); cuff(c, 765, 400, 46);
  foot(c, 765, ty, Math.PI / 2, 0.78, -1); cuff(c, 765, ty, 46);
  const cx = 718;
  shadow(c, cx + 8, ty + 18, 28, 8);
  shape(c, () => ell(c, cx, ty, 28, 28), "#e6e8ec", 6); shape(c, () => ell(c, cx, ty, 18, 18), COL.steel, 4);
  line(c, [[cx - 9, ty + 3], [cx + 9, ty + 3]], 4, COL.steelDk);
  line(c, [[cx, ty - 9], [cx, ty + 9]], 4, COL.steelDk);
};

export const su_motionPhysicsOfSport = cards("sci.motion.physics-of-sport.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
