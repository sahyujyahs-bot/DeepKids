import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards } from "./flatKit";

const BAL = "#4fa3d9", BALDK = "#2f7fb5";
// a bindi: small red dot; home gets a yellow ring round it
const bindi = (c: Ctx, x: number, y: number, r: number, home = false) => {
  if (home) shape(c, () => ell(c, x, y, r * 1.9, r * 1.9), COL.yellow, 5);
  shape(c, () => ell(c, x, y, r, r), RED, 4);
  c.beginPath(); ell(c, x - r * 0.3, y - r * 0.3, r * 0.25, r * 0.25); c.fillStyle = WHITE; c.fill();
};
// a balloon (body centre cx, cy), neck and cloth peg at the bottom when peg = true
const balloon = (c: Ctx, cx: number, cy: number, rx: number, ry: number, peg = true) => {
  shadow(c, cx + rx * 0.12, cy + ry + 14, rx * 0.8, 18);
  if (peg) {
    shape(c, () => polyP(c, [[cx - 26, cy + ry - 14], [cx + 26, cy + ry - 14], [cx + 18, cy + ry + 54], [cx - 18, cy + ry + 54]]), BAL, 5);
    shape(c, () => rrect(c, cx - 44, cy + ry + 22, 88, 34, 8), COL.wood, 5);
    line(c, [[cx - 30, cy + ry + 39], [cx + 30, cy + ry + 39]], 4, COL.woodDk);
  }
  const body = () => ell(c, cx, cy, rx, ry);
  shape(c, body, BAL, 7);
  shade(c, body, BALDK, rx * 0.22, ry * 0.2, 0.7);
  c.beginPath(); body(); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
  shine(c, [[cx - rx * 0.7, cy - ry * 0.3], [cx - rx * 0.55, cy - ry * 0.62], [cx - rx * 0.25, cy - ry * 0.82]], 12);
};
// thread between two points, lying on a balloon
const thread = (c: Ctx, a: number[], b: number[], sag = 24) => {
  const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag];
  const p = () => { c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo(m[0], m[1] + sag, b[0], b[1]); };
  p(); c.strokeStyle = INK; c.lineWidth = 13; c.lineCap = "round"; c.stroke();
  p(); c.strokeStyle = COL.yellow; c.lineWidth = 6; c.stroke();
};
const ruler = (c: Ctx, x: number, y: number, w: number, cmPx: number) => {
  shadow(c, x + w / 2 + 12, y + 108, w / 2, 16);
  shape(c, () => rrect(c, x, y, w, 100, 8), COL.wood, 6);
  c.fillStyle = COL.woodDk; c.globalAlpha = 0.5; c.fillRect(x + 4, y + 80, w - 8, 16); c.globalAlpha = 1;
  const n = Math.floor((w - 90) / cmPx);
  for (let i = 0; i <= n; i++) {
    const tx = x + 45 + i * cmPx;
    line(c, [[tx, y + 4], [tx, y + 32]], 4);
    if (i < n) line(c, [[tx + cmPx / 2, y + 4], [tx + cmPx / 2, y + 20]], 3);
    write(c, String(i), tx - 10, y + 40, 30, INK, 5);
  }
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  balloon(c, 500, 450, 330, 300);
  thread(c, [330, 470], [570, 420], 8);
  bindi(c, 330, 470, 17, true); bindi(c, 450, 445, 17); bindi(c, 570, 420, 17);
  bindi(c, 640, 600, 17); bindi(c, 380, 640, 17); bindi(c, 560, 270, 17);
  hand(c, 890, 345, Math.PI * 0.97, 1.15, SKIN.adult, CLOTH.adult, true);
  bindi(c, 760, 355, 17);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  balloon(c, 450, 290, 270, 230);
  thread(c, [320, 290], [580, 250], 14);
  bindi(c, 320, 290, 17, true); bindi(c, 580, 250, 17);
  bindi(c, 540, 400, 17); bindi(c, 380, 150, 17);
  ruler(c, 120, 720, 840, 80);
  line(c, [[165, 718], [565, 718]], 14, INK); line(c, [[165, 718], [565, 718]], 6, COL.yellow);
  shape(c, () => ell(c, 165, 718, 11, 11), RED, 4);
  hand(c, 675, 705, Math.PI, 1.1, SKIN.adult, CLOTH.adult, true);
};
// setup.e1.2
const dots = (c: Ctx, a: number[], b: number[]) => {
  const d = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.floor(d / 28), ux = (b[0] - a[0]) / d, uy = (b[1] - a[1]) / d;
  for (let i = 0; i < n - 1; i++) line(c, [[a[0] + ux * i * 28, a[1] + uy * i * 28], [a[0] + ux * (i * 28 + 14), a[1] + uy * (i * 28 + 14)]], 8, RED);
  arrow(c, [[b[0] - ux * 30, b[1] - uy * 30], b], RED, 8);
};
const e1_2 = (c: Ctx) => {
  ground(c);
  const B = [680, 450], RX = 320, RY = 285;
  // the small size, as a dotted ring
  for (let i = 0; i < 40; i++) { const t = (i / 40) * Math.PI * 2; line(c, [[B[0] + Math.cos(t) * RX * 0.55, B[1] + Math.sin(t) * RY * 0.55], [B[0] + Math.cos(t + 0.09) * RX * 0.55, B[1] + Math.sin(t + 0.09) * RY * 0.55]], 5, COL.greyDk); }
  shadow(c, B[0] + 40, B[1] + RY + 14, RX * 0.8, 18);
  // neck from the grown-up's mouth to the balloon
  line(c, [[220, 390], [B[0] - RX + 6, 430]], 50, INK); line(c, [[220, 390], [B[0] - RX + 6, 430]], 38, BAL);
  const body = () => ell(c, B[0], B[1], RX, RY);
  c.save(); c.globalAlpha = 0.93; shape(c, body, BAL, 7); c.restore();
  shade(c, body, BALDK, RX * 0.22, RY * 0.2, 0.7);
  c.beginPath(); body(); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
  shine(c, [[B[0] - RX * 0.7, B[1] - RY * 0.3], [B[0] - RX * 0.55, B[1] - RY * 0.62], [B[0] - RX * 0.25, B[1] - RY * 0.82]], 12);
  const rel: number[][] = [[-0.1, 0.05], [0.5, -0.4], [0.62, 0.3], [-0.55, -0.4], [-0.5, 0.45], [0.15, 0.62]];
  const pos = (k: number, r: number[]) => [B[0] + r[0] * RX * k * 1.5, B[1] + r[1] * RY * k * 1.5];
  rel.slice(1).forEach((r) => {
    const o = pos(0.55 * 0.9, r), n = pos(0.9, r);
    shape(c, () => ell(c, o[0], o[1], 11, 11), "rgba(215,55,43,0.35)", 3);
    dots(c, [o[0] + (n[0] - o[0]) * 0.1, o[1] + (n[1] - o[1]) * 0.1], [n[0] - (n[0] - o[0]) * 0.1, n[1] - (n[1] - o[1]) * 0.1]);
  });
  rel.forEach((r, i) => { const p = pos(0.9, r); bindi(c, p[0], p[1], 17, i === 0); });
  person(c, 150, 1030, 780, { adult: true });
  shape(c, () => ell(c, 185, 392, 16, 14), "#5a2b2b", 4);
};
// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  balloon(c, 300, 420, 270, 250);
  thread(c, [180, 420], [420, 380], 12);
  bindi(c, 180, 420, 17, true); bindi(c, 420, 380, 17); bindi(c, 330, 560, 17); bindi(c, 250, 250, 17);
  // the table: before (small balloon) and after (big balloon), three gaps
  shadow(c, 850, 880, 220, 24);
  shape(c, () => rrect(c, 640, 110, 400, 750, 16), WHITE, 6);
  line(c, [[840, 110], [840, 860]], 6);
  [0, 1, 2].forEach((i) => line(c, [[640, 330 + i * 177], [1040, 330 + i * 177]], 6));
  line(c, [[640, 330], [1040, 330]], 6);
  shape(c, () => ell(c, 740, 220, 52, 62), BAL, 5); bindi(c, 718, 220, 8, true); bindi(c, 764, 214, 8); line(c, [[718, 220], [764, 214]], 4, COL.yellow);
  [0, 1, 2].forEach((i) => {
    const y = 380 + i * 177;
    write(c, `${2 + i}cm`, 678, y + 20, 60, INK, 8);
    write(c, `${4 + i * 2}cm`, 872, y + 20, 60, RED, 8);
  });
  shape(c, () => ell(c, 940, 215, 80, 92), BAL, 5);
  bindi(c, 895, 215, 8, true); bindi(c, 985, 205, 8); line(c, [[895, 215], [985, 205]], 4, COL.yellow);
};

// the paper plate with a two-armed spiral
const spiral = (c: Ctx, R: number) => {
  [0, 1].forEach((a) => {
    const pts: number[][] = [];
    for (let t = 0; t <= 5.3; t += 0.1) { const r = R * (0.2 + t * 0.125); pts.push([Math.cos(t + a * Math.PI) * r, Math.sin(t + a * Math.PI) * r]); }
    line(c, pts, R * 0.095, INK); line(c, pts, R * 0.055, COL.purple);
  });
};
const dough = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  const p = () => ell(c, x, y, rx, ry);
  shape(c, p, "#f0d9a8", 6); shade(c, p, "#d0b277", rx * 0.25, ry * 0.25, 0.7);
  c.beginPath(); p(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
};
const paperPlate = (c: Ctx, x: number, y: number, R: number, k: number) => {
  shadow(c, x + R * 0.08, y + R * k * 0.14 + 8, R * 1.02, R * k * 1.0);
  if (k < 0.2) {
    dough(c, x, y - 34, R * 0.3, 48);
    shape(c, () => ell(c, x, y, R, 15), WHITE, 6);
    line(c, [[x - R * 0.9, y + 4], [x + R * 0.9, y + 4]], 4, COL.steelDk);
    return;
  }
  c.save(); c.translate(x, y); c.scale(1, k);
  shape(c, () => ell(c, 0, 0, R, R), WHITE, 6 / k > 12 ? 6 : 6);
  shape(c, () => ell(c, 0, 0, R * 0.82, R * 0.82), COL.paper, 4);
  spiral(c, R * 0.82);
  c.restore();
  dough(c, x, y - (1 - k) * 40, R * 0.2, R * 0.2 * (k + 0.25));
};
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  paperPlate(c, 540, 540, 420, 1);
  const r = [[-330, -110], [-250, 220], [180, -300], [300, 140], [-90, 330], [120, 300]];
  r.forEach(([dx, dy]) => shape(c, () => ell(c, 540 + dx * 0.78, 540 + dy * 0.78, 9, 9), COL.yellow, 3));
};
// the eye that looks, and a red arrow along the way it looks
const eye = (c: Ctx, x: number, y: number) => {
  shape(c, () => { c.moveTo(x - 50, y); c.quadraticCurveTo(x, y - 55, x + 50, y); c.quadraticCurveTo(x, y + 55, x - 50, y); c.closePath(); }, WHITE, 6);
  shape(c, () => ell(c, x, y, 20, 20), COL.blueDk, 4); shape(c, () => ell(c, x, y, 8, 8), INK, 0);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  paperPlate(c, 150, 690, 125, 1);
  paperPlate(c, 440, 690, 125, 0.5);
  paperPlate(c, 720, 690, 125, 0.08);
  eye(c, 150, 220); arrow(c, [[150, 290], [150, 500]]);
  eye(c, 360, 200); arrow(c, [[380, 270], [430, 500]]);
  eye(c, 1000, 690); arrow(c, [[945, 690], [850, 690]]);
};
// setup.e2.2
const orange = (c: Ctx, x: number, y: number, R: number, calyx: [number, number, number]) => {
  shadow(c, x + R * 0.1, y + R * 1.02, R * 0.9, R * 0.16);
  const p = () => ell(c, x, y, R, R);
  shape(c, p, COL.orange, 7); shade(c, p, COL.red, R * 0.25, R * 0.2, 0.5);
  c.beginPath(); p(); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
  shine(c, [[x - R * 0.6, y - R * 0.2], [x - R * 0.4, y - R * 0.6]], 9);
  shape(c, () => ell(c, x + calyx[0], y + calyx[1], calyx[2], calyx[2] * 0.6), COL.leafDk, 4);
};
const e2_2 = (c: Ctx) => {
  ground(c);
  orange(c, 170, 690, 125, [0, 0, 22]);
  orange(c, 500, 690, 125, [-5, -62, 20]);
  orange(c, 840, 690, 125, [0, -122, 14]);
  eye(c, 170, 220); arrow(c, [[170, 290], [170, 480]]);
  eye(c, 380, 200); arrow(c, [[400, 270], [470, 470]]);
  eye(c, 1010, 690); arrow(c, [[955, 690], [985 - 110, 690]]);
};

export const su_storyOfUniverseGalaxiesAndBigBang = cards("sci.story-of-universe.galaxies-and-big-bang.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2]);
