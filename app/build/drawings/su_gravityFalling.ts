import type { Ctx } from "./core";
import { INK, SH, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, plate, hand, person, write, cards, rnd } from "./flatKit";

// sci.gravity.falling.L3 set-up cards. Shared things: the same two plastic bottles, the same purple
// hardback book, the same steel thali, the same wooden ruler, the same peg and parachute on every card.

const FLOOR = "#e6d5b3", LCD = "#c9f06b", BOOK = "#8b6cc9", BOOKDK = "#6c4fae";
const floorBand = (c: Ctx, y: number) => { c.fillStyle = FLOOR; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 6); };
const dashed = (c: Ctx, x1: number, x2: number, y: number) => { for (let x = x1; x < x2; x += 36) line(c, [[x, y], [Math.min(x + 20, x2), y]], 4, COL.grey); };

// a hand and sleeve coming in from the card edge (mirror: from the right); s = size
const hnd = (c: Ctx, x: number, y: number, s: number, o: { mirror?: boolean; open?: boolean; adult?: boolean } = {}) => {
  const skin = o.adult ? SKIN.adult : SKIN.child, cl = o.adult ? CLOTH.adult : CLOTH.child;
  c.save(); c.translate(x, y); if (o.mirror) c.scale(-1, 1);
  shape(c, () => rrect(c, -1100, -36 * s, 1100 - 50 * s, 72 * s, 14), cl, 6 * s);
  hand(c, 0, 0, 0, s, skin, cl, o.open);
  c.restore();
};

// a plastic bottle, bottom centre (x, y), width w, height h, turned by rot; water up to world height waterY (null = empty)
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0, waterY: number | null = null, lw = 5) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const bh = h * 0.72;
  const body = () => rrect(c, -w / 2, -bh, w, bh, w * 0.22), neck = () => rrect(c, -w * 0.21, -h * 0.9, w * 0.42, h * 0.19, 6), cap = () => rrect(c, -w * 0.25, -h, w * 0.5, h * 0.12, 6);
  if (waterY !== null) {
    c.save(); c.beginPath(); body(); neck(); c.clip();
    c.rotate(-rot); c.translate(-x, -y);
    c.fillStyle = "#62a9e3"; c.fillRect(-2000, waterY, 4000, 4000);
    c.fillStyle = COL.drop; c.fillRect(-2000, waterY, 4000, Math.max(5, w * 0.05));
    c.restore();
  }
  shape(c, body, COL.glass, lw); shape(c, neck, COL.glass, lw); shape(c, cap, COL.teal, lw);
  line(c, [[-w * 0.3, -bh * 0.88], [-w * 0.3, -bh * 0.25]], Math.max(4, w * 0.06), WHITE);
  c.restore();
};
const standBottle = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, lw = 5) => {
  shadow(c, x + w * 0.15, y + 6, w * 0.65, w * 0.12);
  bottle(c, x, y, w, h, 0, y - h * 0.72 * fill - (fill >= 1 ? h * 0.1 : 0), lw);
};
// a bottle lying on its side, cap to the right, centre (x, y), thickness w, length h
const lyingBottle = (c: Ctx, x: number, y: number, w: number, h: number, full: boolean) => {
  shadow(c, x + 14, y + w / 2 + 4, h / 2, 11);
  bottle(c, x - h / 2, y, w, h, Math.PI / 2, full ? y - w / 2 + 5 : y + w / 2 - w * 0.2);
};

// a hardback book lying flat, seen from the front and above: front edge at y = fy, centre x, top face depth d, thickness t
const book = (c: Ctx, cx: number, fy: number, w: number, d: number, t: number, label = true) => {
  const top = () => polyP(c, [[cx - w * 0.42, fy - d], [cx + w * 0.42, fy - d], [cx + w / 2, fy], [cx - w / 2, fy]]);
  shape(c, top, BOOK, 6);
  shade(c, top, BOOKDK, -w * 0.05, -d * 0.12, 0.45);
  if (label) shape(c, () => polyP(c, [[cx - w * 0.2, fy - d * 0.72], [cx + w * 0.2, fy - d * 0.72], [cx + w * 0.24, fy - d * 0.52], [cx - w * 0.24, fy - d * 0.52]]), COL.yellow, 5);
  shape(c, () => rrect(c, cx - w / 2, fy, w, t, 6), BOOKDK, 6);
  shape(c, () => rrect(c, cx - w / 2 + 12, fy + t * 0.2, w - 24, t * 0.6, 4), COL.paper, 4);
  for (let k = 1; k < 4; k++) line(c, [[cx - w / 2 + 16, fy + t * (0.2 + 0.15 * k)], [cx + w / 2 - 16, fy + t * (0.2 + 0.15 * k)]], 2, COL.grey);
};

// a crumpled paper ball
const crumple = (c: Ctx, x: number, y: number, r: number, sd: number) => {
  const R = rnd(sd), pts: number[][] = [];
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, rr = r * (0.8 + R() * 0.3); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.95]); }
  shape(c, () => polyP(c, pts), COL.paper, 6);
  shade(c, () => polyP(c, pts), COL.greyDk, -r * 0.3, -r * 0.3, 0.35);
  for (let i = 0; i < 7; i++) { const a = R() * 6.28, d = R() * r * 0.5, l = r * (0.25 + R() * 0.3), b = R() * 6.28; line(c, [[x + Math.cos(a) * d, y + Math.sin(a) * d], [x + Math.cos(a) * d + Math.cos(b) * l, y + Math.sin(a) * d + Math.sin(b) * l]], 3, COL.greyDk); }
};

// a flat sheet of paper, drawn in the current transform around (0, 0)
const sheetPath = (c: Ctx, w: number, h: number, flat: boolean) => polyP(c, flat ? [[-w * 0.38, -h / 2], [w * 0.38, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]] : [[-w / 2, -h * 0.32], [w * 0.46, -h / 2], [w / 2, h * 0.32], [-w * 0.46, h / 2]]);
const sheet = (c: Ctx, w: number, h: number, flat = false) => {
  shape(c, () => sheetPath(c, w, h, flat), COL.paper, 6);
  shade(c, () => sheetPath(c, w, h, flat), COL.greyDk, -w * 0.05, -h * 0.1, 0.25);
};

// a wooden clothes peg lying along x, jaws to the right
const peg = (c: Ctx, x: number, y: number, len: number) => {
  const t = len * 0.34, body = () => rrect(c, x - len / 2, y - t / 2, len, t, t * 0.3);
  shape(c, body, COL.wood, 5); shade(c, body, COL.woodDk, -3, -t * 0.25, 0.8);
  line(c, [[x - len * 0.02, y], [x + len / 2 - 5, y]], 4);
  shape(c, () => ell(c, x - len * 0.12, y, t * 0.42, t * 0.42), COL.steelDk, 4);
};

// a plastic parachute: dome with its hem across at cy, width w, dome height h; threads run to (kx, ky)
const canopy = (c: Ctx, cx: number, cy: number, w: number, h: number, kx: number, ky: number) => {
  const L = cx - w / 2, R = cx + w / 2, xs = [R, R - w / 3, L + w / 3, L];
  const path = () => {
    c.moveTo(L, cy); c.bezierCurveTo(L - w * 0.04, cy - h * 1.35, R + w * 0.04, cy - h * 1.35, R, cy);
    for (let i = 0; i < 3; i++) c.quadraticCurveTo(xs[i] - w / 6, cy - h * 0.3, xs[i + 1], cy);
    c.closePath();
  };
  xs.forEach((x) => line(c, [[x, cy], [kx, ky]], 3.5, INK));
  shape(c, path, "#dff0fb", 6);
  shade(c, path, COL.blueDk, -w * 0.1, -h * 0.2, 0.3);
  xs.forEach((x) => line(c, [[cx, cy - h * 0.92], [x, cy - 4]], 3, COL.glassEdge));
  xs.forEach((x) => shape(c, () => rrect(c, x - 12, cy - 14, 24, 24, 3), COL.yellow, 3.5));
  line(c, [[cx - w * 0.3, cy - h * 0.55], [cx - w * 0.1, cy - h * 0.85]], 7, WHITE);
};

// a phone showing a stopwatch: centre (x, y), button colour
const phone = (c: Ctx, x: number, y: number, w: number, h: number, txt: string, btn: string) => {
  shadow(c, x + w * 0.1, y + h / 2 + 10, w * 0.55, 12);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, w * 0.14), COL.black, 6);
  const sy = y - h / 2 + h * 0.07, sh = h * 0.5;
  shape(c, () => rrect(c, x - w / 2 + w * 0.08, sy, w * 0.84, sh, w * 0.06), "#22303a", 4);
  const dh = h * 0.2, tw = txt.length * 0.8 * dh - 0.2 * dh;
  write(c, txt, x - tw / 2, sy + sh / 2 - dh / 2, dh, LCD, 7);
  shape(c, () => ell(c, x, y + h * 0.3, w * 0.2, w * 0.2), btn, 5);
};

const burst = (c: Ctx, x: number, y: number, R: number, r: number, n: number) => {
  const pts: number[][] = [], q = rnd(9);
  for (let i = 0; i < n * 2; i++) { const a = (i * Math.PI) / n - Math.PI / 2, rr = i % 2 ? r * (0.9 + q() * 0.3) : R * (0.8 + q() * 0.4); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  shape(c, () => polyP(c, pts), COL.yellow, 7);
  for (const s of [-1, 1]) for (let k = 1; k <= 3; k++) { c.beginPath(); c.arc(x, y, R + 34 * k, s < 0 ? Math.PI - 0.5 : -0.5, s < 0 ? Math.PI + 0.5 : 0.5); c.strokeStyle = COL.orange; c.lineWidth = 10; c.lineCap = "round"; c.stroke(); }
};

// the wooden ruler, 0 at the bottom: bottom end at y0, px per cm, centre x, width w; ticks on the left, numbers in the middle
const ruler = (c: Ctx, x: number, y0: number, w: number, pxcm: number, nh: number, hi = -1) => {
  const top = y0 - 30 * pxcm - 12, left = x - w / 2;
  shadow(c, x + w * 0.5, y0 + 30, w * 0.4, 8);
  shape(c, () => rrect(c, left, top, w, y0 - top + 14, 6), COL.wood, 6);
  shade(c, () => rrect(c, left, top, w, y0 - top + 14, 6), COL.woodDk, -w * 0.12, 0, 0.7);
  for (let cm = 0; cm <= 30; cm++) { const y = y0 - cm * pxcm, l = cm % 5 === 0 ? w * 0.34 : w * 0.17; line(c, [[left + 2, y], [left + 2 + l, y]], cm % 5 === 0 ? 4 : 2.5); }
  for (let cm = 0; cm <= 30; cm += 5) write(c, String(cm), x + (hi < 0 ? -w * 0.1 : w * 0.06), y0 - cm * pxcm - nh / 2, nh, cm === hi ? RED : INK, Math.max(3.5, nh / 7) * (cm === hi ? 1.6 : 1));
};

// the child's arm lying on a table edge, hand over the edge. wy = hand height, closed = thumb and fingers shut on the ruler at rulerX
const tableArm = (c: Ctx, wy: number) => {
  shadow(c, 300, 1005, 220, 16);
  shape(c, () => rrect(c, -20, wy + 62, 480, 60, 8), "#c98f5a", 6);
  shape(c, () => rrect(c, 395, wy + 122, 60, 880 - wy, 6), "#b27a46", 6);
};
const armBack = (c: Ctx, wx: number, wy: number, rulerX: number, closed: boolean) => {
  shape(c, () => rrect(c, -80, wy - 60, wx - 20, 120, 16), CLOTH.child, 6);
  shade(c, () => rrect(c, -80, wy - 60, wx - 20, 120, 16), CLOTH.childDk, 0, -22, 0.8);
  shape(c, () => rrect(c, wx - 38, wy - 64, 34, 128, 10), CLOTH.childDk, 6);
  shape(c, () => polyP(c, [[wx - 6, wy - 52], [wx + 95, wy - 58], [wx + 130, wy - 40], [wx + 132, wy + 50], [wx + 90, wy + 62], [wx - 6, wy + 56]]), SKIN.child, 6);
  const fy = closed ? wy + 24 : wy + 40, tip = rulerX + 80;
  shape(c, () => rrect(c, wx + 100, fy - 31, tip - wx - 100, 62, 31), SKIN.child, 6);
  line(c, [[wx + 140, fy - 8], [tip - 28, fy - 8]], 3, SKIN.childDk); line(c, [[wx + 140, fy + 12], [tip - 28, fy + 12]], 3, SKIN.childDk);
};
const thumbFront = (c: Ctx, wx: number, wy: number, rulerX: number, closed: boolean) => {
  const pts = closed ? [[wx + 85, wy - 40], [wx + 200, wy - 50], [rulerX + 20, wy - 12]] : [[wx + 85, wy - 40], [wx + 200, wy - 105], [rulerX + 20, wy - 125]];
  line(c, pts, 58, INK); line(c, pts, 46, SKIN.child);
  const [tx, ty] = pts[2];
  shape(c, () => ell(c, tx - 6, ty - 8, 15, 11, 0), "#f3d6c4", 3.5);
};

// ---------------------------------------------------------------- experiment 1: heavy and light bottles

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  standBottle(c, 250, 800, 140, 380, 1);
  standBottle(c, 830, 800, 140, 380, 0.14);
  hnd(c, 124, 650, 1.8);
  hnd(c, 956, 650, 1.8, { mirror: true });
  // the guess on a sheet: two little bottles and a tick under the one guessed to land first
  c.save(); c.translate(540, 730); c.rotate(-0.05);
  shape(c, () => rrect(c, -135, -150, 270, 300, 8), COL.paper, 6);
  c.restore();
  standBottle(c, 480, 790, 56, 140, 1, 4); standBottle(c, 600, 790, 56, 140, 0.14, 4);
  line(c, [[455, 640], [480, 666], [530, 610]], 11, RED);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c); floorBand(c, 815);
  plate(c, 540, 925, 400, 90);
  book(c, 540, 440, 840, 240, 64, false);
  lyingBottle(c, 520, 285, 96, 400, true);
  lyingBottle(c, 565, 385, 96, 400, false);
  hnd(c, 70, 565, 2, { open: true });
  arrow(c, [[780, 590], [470, 590]], RED, 14);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 790, 440, 135);
  lyingBottle(c, 500, 670, 100, 360, true);
  lyingBottle(c, 580, 770, 100, 360, false);
  burst(c, 540, 270, 150, 90, 12);
};

// ---------------------------------------------------------------- experiment 2: paper and air

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  dashed(c, 520, 770, 560);
  c.save(); c.translate(360, 555); c.rotate(-0.04); sheet(c, 330, 230); c.restore();
  crumple(c, 854, 565, 100, 5);
  hnd(c, 100, 560, 1.8);
  hnd(c, 980, 560, 1.8, { mirror: true });
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c); floorBand(c, 900);
  shadow(c, 300, 945, 110, 16); shadow(c, 770, 945, 150, 16);
  for (const x of [235, 290, 345]) line(c, [[x, 330], [x, 450]], 6, COL.grey);
  crumple(c, 290, 600, 105, 5);
  arrow(c, [[120, 230], [120, 640]], RED, 14);
  line(c, [[770, 120], [700, 190], [840, 250], [715, 315]], 6, COL.grey);
  c.save(); c.translate(770, 450); c.rotate(-0.2); sheet(c, 330, 230); c.restore();
  for (const x of [680, 770, 860]) arrow(c, [[x, 700], [x, 590]], COL.blueDk, 10);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c); floorBand(c, 930);
  shadow(c, 540, 975, 340, 26);
  for (const x of [400, 540, 680]) line(c, [[x, 110], [x, 220]], 6, COL.grey);
  book(c, 540, 560, 700, 210, 70, false);
  c.save(); c.translate(540, 448); c.rotate(-0.07); c.save(); c.translate(12, 12); c.beginPath(); sheetPath(c, 470, 150, true); c.fillStyle = SH; c.fill(); c.restore(); sheet(c, 470, 150, true); c.restore();
  arrow(c, [[975, 300], [975, 650]], RED, 14);
};

// ---------------------------------------------------------------- experiment 3: parachutes

// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  const bag = (x: number, w: number) => {
    const y = 760 - w, sq = () => rrect(c, x, y, w, w, 8);
    shadow(c, x + w / 2 + 12, 765, w / 2 + 12, 14);
    shape(c, sq, "#dff0fb", 6); shade(c, sq, COL.blueDk, -w * 0.06, -w * 0.06, 0.28);
    line(c, [[x + w * 0.14, y + w * 0.3], [x + w * 0.3, y + w * 0.14]], 8, WHITE);
    const cx = x + w / 2, cy = y + w / 2;
    for (const [px, py] of [[x, y], [x + w, y], [x, y + w], [x + w, y + w]]) { line(c, [[px, py], [cx, cy]], 3.5); shape(c, () => rrect(c, px - 15 + (px > cx ? -10 : 10), py - 15 + (py > cy ? -10 : 10), 30, 30, 3), COL.yellow, 3.5); }
    peg(c, cx, cy, 110);
  };
  bag(50, 400); bag(490, 300); bag(830, 200);
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  // the building and balcony
  shape(c, () => rrect(c, -20, 615, 320, 360, 4), "#d98f6a", 6);
  shape(c, () => rrect(c, 40, 700, 150, 170, 6), COL.sky, 6); line(c, [[115, 700], [115, 870]], 5); line(c, [[40, 785], [190, 785]], 5);
  floorBand(c, 960);
  shape(c, () => rrect(c, -20, 560, 355, 55, 4), COL.steel, 6);
  person(c, 230, 560, 430, { adult: true, armR: [-0.1, -0.2] });
  line(c, [[-10, 450], [315, 450]], 10);
  for (let x = 20; x < 300; x += 42) line(c, [[x, 450], [x, 560]], 5);
  line(c, [[315, 440], [315, 560]], 12);
  // the parachute pinched in the grown-up's hand
  canopy(c, 440, 326, 260, 90, 440, 480);
  peg(c, 440, 490, 100);
  shape(c, () => ell(c, 419, 236, 27, 25), SKIN.adult, 5);
  arrow(c, [[440, 545], [440, 800]], RED, 14);
  // the child with the stopwatch
  person(c, 700, 960, 360, { armR: [0.2, -1.5] });
  phone(c, 862, 600, 130, 220, "00", COL.green);
  shape(c, () => ell(c, 806, 660, 24, 24), SKIN.child, 5);
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c); floorBand(c, 880);
  shadow(c, 375, 905, 150, 14);
  canopy(c, 360, 740, 340, 70, 360, 845);
  peg(c, 360, 858, 130);
  phone(c, 625, 280, 200, 380, "12", RED);
  hnd(c, 805, 330, 1.5, { mirror: true });
  hnd(c, 427, 433, 1.5);
  line(c, [[520, 401], [606, 404]], 50, INK); line(c, [[520, 401], [606, 404]], 38, SKIN.child);
};

// ---------------------------------------------------------------- experiment 4: ruler catch

const WX = 330, WY = 640, RX = 620, RW = 100, PX = 21.5;

// setup.e4.0
const e4_0 = (c: Ctx) => {
  ground(c);
  tableArm(c, WY);
  armBack(c, WX, WY, RX, false);
  ruler(c, RX, WY + 85, RW, PX, 26);
  thumbFront(c, WX, WY, RX, false);
  hnd(c, 725, 165, 1.5, { mirror: true, adult: true });
};

// setup.e4.1
const e4_1 = (c: Ctx) => {
  ground(c);
  tableArm(c, WY);
  armBack(c, WX, WY, RX, true);
  ruler(c, RX, WY + 85 + 170, RW, PX, 26);
  thumbFront(c, WX, WY, RX, true);
  hnd(c, 725, 140, 1.5, { mirror: true, adult: true, open: true });
  arrow(c, [[790, 300], [790, 600]], RED, 14);
  for (const [dx, dy] of [[50, -30], [62, -4], [50, 22]]) line(c, [[RX + dx + 20, WY + dy - 10], [RX + dx + 55, WY + dy - 10 + dy * 0.4]], 6);
};

// setup.e4.2
const e4_2 = (c: Ctx) => {
  ground(c);
  const y0 = 1000, pc = 32, y15 = y0 - 15 * pc, rx = 620, rw = 400;
  // fingertips behind the ruler
  [[y15 + 40, 905], [y15 + 100, 890], [y15 + 160, 860]].forEach(([y, e]) => shape(c, () => rrect(c, 700, y - 26, e - 700, 52, 26), SKIN.child, 6));
  ruler(c, rx, y0, rw, pc, 44, 15);
  // thumb in front, with the palm behind it
  shape(c, () => polyP(c, [[-30, y15 + 10], [250, y15 + 10], [340, y15 + 150], [310, y15 + 330], [190, y15 + 380], [-30, y15 + 380]]), SKIN.child, 7);
  line(c, [[40, y15 + 230], [210, y15 + 250]], 5, SKIN.childDk); line(c, [[40, y15 + 300], [190, y15 + 310]], 5, SKIN.childDk);
  shape(c, () => polyP(c, [[-30, y15 + 330], [200, y15 + 340], [230, y15 + 560], [-30, y15 + 560]]), CLOTH.child, 7);
  shape(c, () => rrect(c, 180, y15, 430, 140, 70), SKIN.child, 7);
  shade(c, () => rrect(c, 180, y15, 430, 140, 70), SKIN.childDk, 0, -36, 0.8);
  shape(c, () => rrect(c, 490, y15 + 26, 92, 74, 36), "#f3d6c4", 4);
  line(c, [[330, y15 + 30], [330, y15 + 110]], 4, SKIN.childDk);
  arrow(c, [[1030, y15], [790, y15]], RED, 14);
};

export const su_gravityFalling = cards("sci.gravity.falling.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2, e4_0, e4_1, e4_2]);
void SH;
