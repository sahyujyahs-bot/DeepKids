import type { Ctx } from "./core";
import { INK, COL, WHITE, RED, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, seed, leaf, plate, glass, write, rnd, cards } from "./flatKit";

// SEEDS AND GERMINATION L4 · flat set-up and card pictures. No people: objects, cutaways and graphs only.
const CLOTHW = "#f7f3e8", WETC = "#8fb3dc", WETD = "#6a92c2", SOILP = "#8a5a3c";
const CHANA = "#d9b46a", CHANA_DK = "#b88f46", MUST = "#7a4a22", MUST_DK = "#4a2c14", TAM = "#6b3a22", TAM_DK = "#472314";
const PALE = "#f1e9b8", PALE_LF = "#ece08a", SKY = "#bfe0f5";

const tag = (c: Ctx, x: number, y: number, w: number, h: number) => shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 16), WHITE, 5);
const letter = (c: Ctx, ch: string, x: number, y: number, h: number) => {
  const G: Record<string, number[][][]> = {
    A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.12, 0.65], [0.48, 0.65]]],
    B: [[[0, 1], [0, 0], [0.4, 0.02], [0.52, 0.25], [0.38, 0.48], [0, 0.5]], [[0.38, 0.48], [0.56, 0.72], [0.42, 0.98], [0, 1]]],
  };
  G[ch].forEach((st) => line(c, st.map(([u, v]) => [x + u * h, y + v * h]), 9, INK));
};
const dash = (c: Ctx, x1: number, y1: number, x2: number, y2: number, col = RED, w = 6, step = 22) => {
  const n = Math.floor(Math.hypot(x2 - x1, y2 - y1) / step);
  for (let i = 0; i < n; i += 2) line(c, [[x1 + ((x2 - x1) * i) / n, y1 + ((y2 - y1) * i) / n], [x1 + ((x2 - x1) * (i + 1)) / n, y1 + ((y2 - y1) * (i + 1)) / n]], w, col);
};
// a white root that tapers from width w0 to w1, along a curve S -> M -> E
const taper = (c: Ctx, S: number[], M: number[], E: number[], w0: number, w1 = 6, col: string = COL.paper) => {
  const pts: number[][] = [];
  for (let i = 0; i <= 16; i++) { const t = i / 16; pts.push([(1 - t) * (1 - t) * S[0] + 2 * (1 - t) * t * M[0] + t * t * E[0], (1 - t) * (1 - t) * S[1] + 2 * (1 - t) * t * M[1] + t * t * E[1]]); }
  for (const pass of [0, 1]) for (let i = 0; i < 16; i++) line(c, [pts[i], pts[i + 1]], w0 + ((w1 - w0) * i) / 16 + (pass ? 0 : 9), pass ? col : INK);
  return pts;
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.7, y + Math.sin(a) * r * 1.7]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
const clock = (c: Ctx, x: number, y: number, r: number, hour: number, min: number) => {
  shadow(c, x + r * 0.1, y + r * 1.02, r * 0.9, r * 0.1);
  shape(c, () => ell(c, x, y, r, r), WHITE, 6);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78], [x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9]], 4, INK); }
  const ha = (hour / 12) * Math.PI * 2 - Math.PI / 2, ma = (min / 60) * Math.PI * 2 - Math.PI / 2;
  line(c, [[x, y], [x + Math.cos(ha) * r * 0.5, y + Math.sin(ha) * r * 0.5]], 9, INK);
  line(c, [[x, y], [x + Math.cos(ma) * r * 0.75, y + Math.sin(ma) * r * 0.75]], 6, INK);
  shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), RED, 0);
};
const soilBlock = (c: Ctx, x: number, y: number, w: number, h: number, sd: number) => {
  c.fillStyle = SOILP; c.fillRect(x, y, w, h);
  const r = rnd(sd); c.fillStyle = COL.soilDk;
  for (let i = 0; i < w * h / 2600; i++) { c.beginPath(); ell(c, x + 10 + r() * (w - 20), y + 10 + r() * (h - 20), 5 + r() * 7, 3 + r() * 4, r() * 3); c.fill(); }
};

// a plate seen from above with a cloth and a grid of 3 rows x 10 moong; n of them have a white root
const seedPlate = (c: Ctx, x: number, y: number, rx: number, ry: number, o: { r: number; sx: number; sy: number; n: number; seed: number; wet: boolean }) => {
  plate(c, x, y, rx, ry);
  const cy = y - ry * 0.04;
  shape(c, () => rrect(c, x - rx * 0.64, cy - ry * 0.52, rx * 1.28, ry * 1.04, 36), o.wet ? WETC : CLOTHW, 5);
  const rd = rnd(o.seed), order = Array.from({ length: 30 }, (_, i) => i), keys = order.map(() => rd());
  order.sort((a, b) => keys[a] - keys[b]);
  const up = new Set(order.slice(0, o.n));
  for (let i = 0; i < 30; i++) {
    const px = x + ((i % 10) - 4.5) * o.sx, py = cy + (Math.floor(i / 10) - 1) * o.sy, rot = (rd() - 0.5) * 0.4;
    if (up.has(i)) { const S = [px + Math.cos(rot) * o.r * 0.8, py + Math.sin(rot) * o.r * 0.8]; taper(c, S, [S[0] + o.r * 0.9, S[1] + o.r * 0.5], [S[0] + o.r * 1.1, S[1] + o.r * 1.7], o.r * 0.55, o.r * 0.2); }
    seed(c, px, py, o.r, rot, false);
  }
};

// a clear cup lined with tissue, a little water at the bottom, soaked moong pressed against the glass
const SPOTS = [[-0.22, 0.62, 0.3], [0.2, 0.7, -0.4], [-0.03, 0.48, 0.1], [-0.24, 0.32, -0.2], [0.22, 0.38, 0.5]];
const cup = (c: Ctx, x: number, y: number, w: number, h: number, water: number) => {
  const top = w / 2, bot = w * 0.38, body = () => polyP(c, [[x - top, y - h], [x + top, y - h], [x + bot, y], [x - bot, y]]);
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.1);
  shape(c, body, "#f5f0e4", 0);
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = "#9cc5e8"; c.fillRect(x - top, y - water, w, water + 4);
  for (let k = -2; k <= 2; k++) line(c, [[x + k * w * 0.17, y - h * 0.95], [x + k * w * 0.14 + 10, y - h * 0.05]], 3, "#d9d2c2");
  c.restore();
  SPOTS.forEach(([dx, dy, rot]) => seed(c, x + dx * w, y - dy * h, w * 0.085, rot, true));
  shape(c, body, "rgba(214,236,250,0.28)", 5);
  shape(c, () => ell(c, x, y - h, top, w * 0.07), "#fffaf0", 5);
  shine(c, [[x - top * 0.8, y - h * 0.85], [x - bot * 0.75, y - h * 0.18]], 8);
};

// ---------------------------------------------------------------- set-up cards
const sE10 = (c: Ctx) => {
  ground(c);
  [[265, "A"], [815, "B"]].forEach(([x, ch]) => {
    seedPlate(c, x as number, 450, 245, 190, { r: 11.5, sx: 28, sy: 44, n: 0, seed: x as number, wet: true });
    tag(c, x as number, 830, 320, 150);
    letter(c, ch as string, (x as number) - 120, 790, 80);
    write(c, "30", (x as number) - 10, 795, 70, INK, 9);
  });
};

const sE11 = (c: Ctx) => {
  ground(c);
  const stack = (x: number, y: number) => {
    shadow(c, x + 18, y + 8, 200, 20);
    const lo = () => polyP(c, [[x - 170, y - 50], [x + 170, y - 50], [x + 118, y], [x - 118, y]]);
    shape(c, lo, COL.steel); shade(c, lo, COL.steelDk, 40, -10);
    shape(c, () => rrect(c, x - 160, y - 62, 320, 14, 6), WETC, 4);
    const up = () => polyP(c, [[x - 170, y - 58], [x + 170, y - 58], [x + 118, y - 112], [x - 118, y - 112]]);
    shape(c, up, COL.steel); shade(c, up, COL.steelDk, 40, -10);
    shine(c, [[x - 120, y - 98], [x - 60, y - 98]], 7);
    shape(c, () => rrect(c, x - 30, y - 128, 60, 16, 8), COL.steelDk, 4);
  };
  stack(190, 640); stack(580, 640);
  clock(c, 880, 430, 135, 9, 0);
  [[190, "A"], [580, "B"]].forEach(([x, ch]) => { tag(c, x as number, 820, 220, 140); letter(c, ch as string, (x as number) - 30, 780, 80); });
};

const sE13 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 70, 110, 940, 860, 30), WHITE, 6);
  const X0 = 190, Y0 = 820, px = (h: number) => X0 + h * 12.5, py = (n: number) => Y0 - n * 20;
  for (let n = 5; n <= 30; n += 5) line(c, [[X0, py(n)], [940, py(n)]], 2.5, "#e4dccb");
  line(c, [[X0, 200], [X0, Y0], [960, Y0]], 7, INK);
  const P = [[0, 0], [6, 1], [12, 4], [24, 15], [36, 24], [48, 28], [54, 29.5], [60, 30]].map(([h, n]) => [px(h), py(n)]);
  const curve = () => {
    c.beginPath(); c.moveTo(P[0][0], P[0][1]);
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] ?? P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] ?? P[i + 1];
      c.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
    }
  };
  curve(); c.strokeStyle = INK; c.lineWidth = 20; c.lineCap = "round"; c.stroke();
  curve(); c.strokeStyle = COL.green; c.lineWidth = 11; c.stroke();
  [[0, 0], [12, 4], [24, 15], [36, 24], [48, 28], [60, 30]].forEach(([h, n]) => shape(c, () => ell(c, px(h), py(n), 12, 12), COL.greenLt, 5));
  // the half-way mark
  dash(c, X0, py(15), px(24), py(15)); dash(c, px(24), py(15), px(24), Y0);
  shape(c, () => ell(c, px(24), py(15), 22, 22), "rgba(215,55,43,0.25)", 0);
  c.beginPath(); c.arc(px(24), py(15), 22, 0, Math.PI * 2); c.strokeStyle = RED; c.lineWidth = 8; c.stroke();
  shape(c, () => ell(c, px(24), Y0, 12, 12), RED, 0);
  [12, 24, 36, 48, 60].forEach((h) => { line(c, [[px(h), Y0], [px(h), Y0 + 14]], 5, INK); write(c, String(h), px(h) - h.toString().length * 14, Y0 + 28, 34, INK, 6); });
  write(c, "15", 100, py(15) - 17, 34, INK, 6); write(c, "30", 100, py(30) - 17, 34, INK, 6);
  // a moong seed with a root at the top of the up-axis
  taper(c, [168, 150], [186, 156], [196, 176], 9, 4); seed(c, 160, 140, 24, -0.4, false);
};

const sE20 = (c: Ctx) => {
  ground(c);
  for (let i = 0; i < 6; i++) {
    const x = 540 + (i - 2.5) * 170, chana = i >= 3;
    glass(c, x, 520, 150, 250, 0);
    tag(c, x, 650, 150, 100);
    if (chana) seed(c, x - 32, 650, 20, 0.3, false, CHANA, CHANA_DK); else [[-40, -6], [-28, 6], [-36, 10]].forEach(([dx, dy]) => seed(c, x + dx, 650 + dy, 8, 0.5, false, MUST, MUST_DK));
    write(c, String([1, 3, 6][i % 3]), x + 6, 628, 44, INK, 7);
  }
  // the bowl of soaking chana
  const bx = 540, by = 850;
  shadow(c, bx + 20, by + 130, 240, 28);
  shape(c, () => ell(c, bx, by + 34, 232, 122), COL.steelDk);
  shape(c, () => ell(c, bx, by, 232, 122), COL.steel);
  shape(c, () => ell(c, bx, by, 196, 94), COL.water, 5);
  [[-110, -10, 0.2], [-40, -35, 1], [40, -30, 2.4], [115, -5, 0.6], [-90, 30, 1.8], [-10, 25, 0.4], [70, 28, 2.8], [10, -4, 1.2]].forEach(([dx, dy, rot]) => seed(c, bx + dx, by + dy, 34, rot, true, CHANA, CHANA_DK));
  c.fillStyle = "rgba(143,195,234,0.35)"; c.beginPath(); ell(c, bx, by, 196, 94); c.fill();
  shine(c, [[bx - 150, by - 40], [bx - 100, by - 62]], 8);
};

const sE21 = (c: Ctx) => {
  ground(c);
  const X = 440, TOP = 300, BOT = 900, hw = (yy: number) => 152 + (190 - 152) * ((BOT - yy) / (BOT - TOP));
  const slab = (y1: number, y2: number, col: string) => shape(c, () => polyP(c, [[X - hw(y1), y1], [X + hw(y1), y1], [X + hw(y2), y2], [X - hw(y2), y2]]), col, 0);
  shadow(c, X + 40, BOT + 8, 230, 24);
  shape(c, () => polyP(c, [[X - 190, TOP], [X + 190, TOP], [X + 152, BOT], [X - 152, BOT]]), "#f5f9fc", 0);
  slab(780, 900, COL.soilDk); slab(420, 780, SOILP);
  c.save(); c.beginPath(); polyP(c, [[X - 190, TOP], [X + 190, TOP], [X + 152, BOT], [X - 152, BOT]]); c.clip();
  const r = rnd(5); c.fillStyle = COL.soilDk;
  for (let i = 0; i < 40; i++) { c.beginPath(); ell(c, X - 150 + r() * 300, 440 + r() * 330, 5 + r() * 6, 3 + r() * 3, r() * 3); c.fill(); }
  c.restore();
  for (let i = 0; i < 6; i++) seed(c, X - 125 + i * 50, 778, 22, i * 0.6 - 1, false, CHANA, CHANA_DK);
  shape(c, () => polyP(c, [[X - 190, TOP], [X + 190, TOP], [X + 152, BOT], [X - 152, BOT]]), "rgba(214,236,250,0.28)", 6);
  shape(c, () => ell(c, X, TOP, 190, 28), "rgba(255,255,255,0.45)", 5);
  shine(c, [[X - 165, 340], [X - 140, 880]], 8);
  // ruler: 0 at the seeds, 6 cm of soil above them (60 px per cm)
  shadow(c, 760, 818, 70, 14);
  shape(c, () => rrect(c, 700, 350, 90, 460, 8), COL.wood, 6);
  for (let k = 0; k <= 7; k++) { const yy = 780 - k * 60; line(c, [[700, yy], [736, yy]], 4, INK); if (k <= 6) write(c, String(k), 750, yy - 15, 30, INK, 5); }
  for (let k = 0; k < 7; k++) line(c, [[700, 780 - k * 60 - 30], [718, 780 - k * 60 - 30]], 3, INK);
  dash(c, X + hw(780), 780, 700, 780); dash(c, X + hw(420), 420, 700, 420);
};

const sE30 = (c: Ctx) => {
  ground(c);
  cup(c, 290, 800, 360, 480, 60); cup(c, 790, 800, 360, 480, 60);
};

const sE31 = (c: Ctx) => {
  ground(c);
  // cupboard on the left: dark inside, a shelf, a closed box with a cut-away front
  shadow(c, 300, 910, 280, 22);
  shape(c, () => rrect(c, 50, 150, 500, 760, 20), "#c98f4a", 6);
  shape(c, () => rrect(c, 85, 185, 430, 640, 10), "#2a2438", 5);
  shape(c, () => rrect(c, 70, 820, 460, 50, 8), COL.woodDk, 5);
  const bx = 130, by = 520, bw = 340, bh = 300;
  shape(c, () => polyP(c, [[bx, by], [bx + bw, by], [bx + bw + 40, by - 36], [bx + 40, by - 36]]), "#d9b27c", 5);
  line(c, [[bx + bw / 2, by], [bx + bw / 2 + 40, by - 36]], 4, INK);
  shape(c, () => polyP(c, [[bx + bw, by], [bx + bw + 40, by - 36], [bx + bw + 40, by + bh - 36], [bx + bw, by + bh]]), "#b88a56", 5);
  shape(c, () => rrect(c, bx, by, bw, bh, 4), "#c9a06b", 5);
  shape(c, () => rrect(c, bx + 45, by + 55, 250, 215, 14), "#171322", 5);
  c.save(); c.beginPath(); rrect(c, bx + 45, by + 55, 250, 215, 14); c.clip();
  cup(c, bx + 170, by + 250, 130, 165, 20);
  c.fillStyle = "rgba(23,19,34,0.55)"; c.fillRect(bx, by, bw, bh); c.restore();
  shape(c, () => rrect(c, bx + 45, by + 55, 250, 215, 14), "rgba(0,0,0,0)", 5);
  // window on the right: bright sun, a sill, a cup in the light
  shape(c, () => rrect(c, 590, 130, 440, 600, 14), WHITE, 6);
  shape(c, () => rrect(c, 615, 155, 390, 550, 6), SKY, 5);
  c.save(); c.beginPath(); rrect(c, 615, 155, 390, 550, 6); c.clip(); sun(c, 880, 290, 62); c.restore();
  line(c, [[810, 155], [810, 705]], 8, WHITE); line(c, [[615, 430], [1005, 430]], 8, WHITE);
  shape(c, () => rrect(c, 560, 720, 500, 56, 8), COL.woodDk, 6);
  cup(c, 770, 722, 140, 185, 22);
};

const tamSeed = (c: Ctx, x: number, y: number, r: number, rot: number, rubbed: boolean) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => rrect(c, -r, -r * 0.78, r * 2, r * 1.56, r * 0.6);
  shape(c, p, TAM, Math.max(3, r * 0.12));
  shade(c, p, TAM_DK, r * 0.35, r * 0.3, 0.55);
  if (rubbed) { c.beginPath(); ell(c, -r * 0.1, -r * 0.05, r * 0.55, r * 0.38, 0.2); c.fillStyle = "#c9a27c"; c.fill(); } else shine(c, [[-r * 0.6, -r * 0.35], [-r * 0.1, -r * 0.5]], Math.max(3, r * 0.14));
  c.restore();
};
const topBowl = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shadow(c, x + 20, y + ry * 1.05, rx, ry * 0.25);
  shape(c, () => ell(c, x, y + 34, rx, ry), COL.steelDk);
  shape(c, () => ell(c, x, y, rx, ry), COL.steel);
  shape(c, () => ell(c, x, y, rx * 0.84, ry * 0.78), COL.water, 5);
};
const sE42 = (c: Ctx) => {
  ground(c);
  const P = [[-85, -26], [0, -34], [85, -26], [-85, 28], [0, 32], [85, 28]];
  [[275, true], [805, false]].forEach(([x, rub]) => {
    topBowl(c, x as number, 400, 220, 125);
    P.forEach(([dx, dy], i) => tamSeed(c, (x as number) + dx, 400 + dy, 34, i * 0.7, rub as boolean));
    c.fillStyle = "rgba(143,195,234,0.2)"; c.beginPath(); ell(c, x as number, 400, 185, 97); c.fill();
    shine(c, [[(x as number) - 140, 362], [(x as number) - 100, 340]], 8);
  });
  // kitchen scale beside the bowls
  shadow(c, 560, 945, 330, 28);
  shape(c, () => polyP(c, [[300, 700], [780, 700], [850, 850], [230, 850]]), COL.teal);
  shape(c, () => polyP(c, [[230, 850], [850, 850], [850, 930], [230, 930]]), COL.tealDk);
  shape(c, () => polyP(c, [[430, 862], [650, 862], [650, 918], [430, 918]]), "#22303a", 5);
  write(c, "0 g", 475, 868, 40, "#c9f06b", 7);
};

const sA10 = (c: Ctx) => {
  ground(c);
  plate(c, 440, 600, 400, 270);
  c.save(); c.translate(-30, 0);
  // potato slice with the iodine drop turned blue-black
  shape(c, () => ell(c, 330, 600, 140, 118, 0.2), "#c79a5a");
  shape(c, () => ell(c, 330, 600, 124, 102, 0.2), "#f1dfa6", 4);
  c.beginPath(); ell(c, 330, 600, 78, 62, 0.3); c.fillStyle = "rgba(160,88,31,0.55)"; c.fill();
  shape(c, () => { c.moveTo(280, 600); c.bezierCurveTo(285, 548, 350, 540, 380, 575); c.bezierCurveTo(400, 620, 365, 655, 318, 650); c.bezierCurveTo(285, 645, 278, 625, 280, 600); c.closePath(); }, "#241e4a", 0);
  // cucumber slice: a drop that stays brown
  shape(c, () => ell(c, 650, 600, 128, 108, -0.1), COL.green);
  shape(c, () => ell(c, 650, 600, 108, 90, -0.1), "#d9efb5", 4);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; shape(c, () => ell(c, 650 + Math.cos(a) * 52, 600 + Math.sin(a) * 42, 9, 5, a), "#f3f9dc", 2.5); }
  c.beginPath(); ell(c, 650, 600, 52, 42); c.fillStyle = "rgba(160,88,31,0.7)"; c.fill();
  shape(c, () => ell(c, 650, 600, 24, 20), "#9a5a1e", 3);
  c.restore();
  // the dropper bottle
  shadow(c, 920, 560, 70, 16);
  shape(c, () => rrect(c, 850, 340, 150, 210, 22), "#c47a26", 6);
  shape(c, () => rrect(c, 905, 275, 40, 70, 8), "#c47a26", 6);
  shape(c, () => rrect(c, 892, 225, 66, 56, 26), "#3a3540", 6);
  shine(c, [[870, 380], [870, 500]], 9);
};

// ---------------------------------------------------------------- card pictures
const fE1 = (c: Ctx) => {
  ground(c);
  [[12, 4, 1], [24, 15, 2], [36, 24, 3]].forEach(([h, n, k], i) => {
    const y = 190 + i * 350;
    seedPlate(c, 390, y, 300, 135, { r: 14, sx: 36, sy: 44, n, seed: 40 + k, wet: true });
    tag(c, 880, y, 240, 150);
    clock(c, 810, y, 44, 3, 0);
    write(c, String(h), 870, y - 30, 60, INK, 8);
    if (i < 2) arrow(c, [[880, y + 90], [880, y + 250]]);
  });
};

const fE2 = (c: Ctx) => {
  ground(c);
  sun(c, 540, 105, 45);
  [[70, 0], [570, 1]].forEach(([x, k]) => {
    shape(c, () => rrect(c, x, 200, 440, 800, 14), SKY, 6);
    c.save(); c.beginPath(); rrect(c, x, 200, 440, 800, 14); c.clip();
    soilBlock(c, x, 440, 440, 560, 11 + k);
    c.restore();
    line(c, [[x, 440], [x + 440, 440]], 6, INK);
    shape(c, () => rrect(c, x, 200, 440, 800, 14), "rgba(0,0,0,0)", 6);
  });
  // tiny mustard, deep: thin pale shoot that stops short
  taper(c, [290, 830], [280, 900], [300, 960], 5, 2);
  seed(c, 290, 840, 9, 0.3, false, MUST, MUST_DK);
  const m = taper(c, [290, 832], [250, 740], [305, 640], 8, 8, PALE);
  shape(c, () => ell(c, m[16][0], m[16][1], 11, 8), PALE_LF, 3);
  // big chana, same depth: thick shoot reaches the light
  taper(c, [790, 870], [770, 940], [800, 990], 16, 5);
  seed(c, 790, 840, 38, 0.3, false, CHANA, CHANA_DK);
  const st = taper(c, [790, 810], [800, 600], [790, 320], 22, 22, COL.green);
  leaf(c, st[16][0], st[16][1], 90, -2.5); leaf(c, st[16][0], st[16][1], 90, -0.65);
  // same depth for both
  arrow(c, [[540, 640], [540, 450]]); arrow(c, [[540, 640], [540, 830]]);
};

const pale = (c: Ctx, x: number, y: number, hgt: number, lean: number) => {
  const s = taper(c, [x, y], [x - lean * 0.2, y - hgt * 0.6], [x + lean, y - hgt], 12, 12, PALE);
  const e = s[16]; leaf(c, e[0], e[1], 36, -2.4, PALE_LF); leaf(c, e[0], e[1], 36, -0.8, PALE_LF);
};
const green = (c: Ctx, x: number, y: number, hgt: number, lf = 100) => {
  const s = taper(c, [x, y], [x + 4, y - hgt * 0.5], [x, y - hgt], 22, 20, COL.green);
  const e = s[16]; leaf(c, e[0], e[1], lf, -2.7); leaf(c, e[0], e[1], lf, -0.45);
};
const fE3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 110, 480, 850, 28), "#2b2a4a", 6);
  shape(c, () => rrect(c, 560, 110, 480, 850, 28), SKY, 6);
  c.save(); c.beginPath(); rrect(c, 560, 110, 480, 850, 28); c.clip(); sun(c, 930, 220, 60); c.restore();
  cup(c, 280, 900, 280, 360, 50); cup(c, 800, 900, 280, 360, 50);
  [-85, 0, 85].forEach((dx, i) => pale(c, 280 + dx, 548, 330 - i * 20, (i - 1) * 40));
  [-85, 0, 85].forEach((dx) => green(c, 800 + dx, 548, 100, 46));
};

const fE4 = (c: Ctx) => {
  ground(c);
  // sandpaper under a tamarind seed, rubbed to a dull patch
  shadow(c, 270, 790, 270, 20);
  shape(c, () => polyP(c, [[110, 480], [430, 480], [520, 770], [20, 770]]), "#c9a878");
  const r = rnd(9); c.fillStyle = "#8a6a44";
  for (let i = 0; i < 90; i++) { const t = r(), u = r(); c.beginPath(); ell(c, 120 + t * 330 - u * 90, 500 + u * 260, 3, 2, 0); c.fill(); }
  tamSeed(c, 270, 620, 80, 0.1, true);
  arrow(c, [[270, 860], [140, 860]], RED, 9); arrow(c, [[270, 860], [400, 860]], RED, 9);
  arrow(c, [[535, 620], [610, 620]]);
  // the same seeds in water, bigger
  topBowl(c, 835, 640, 215, 130);
  [[-75, -18, 0.4], [40, -28, 1.2], [90, 26, 0.1], [-25, 36, 0.8]].forEach(([dx, dy, rot]) => tamSeed(c, 835 + dx, 640 + dy, 62, rot, true));
  c.fillStyle = "rgba(143,195,234,0.2)"; c.beginPath(); ell(c, 830, 640, 176, 94); c.fill();
};

const rootSpread = (c: Ctx, x: number, y: number) => {
  taper(c, [x, y], [x - 20, y + 80], [x - 15, y + 170], 14, 4);
  taper(c, [x, y + 40], [x - 60, y + 70], [x - 130, y + 120], 8, 3);
  taper(c, [x, y + 70], [x + 60, y + 90], [x + 125, y + 140], 8, 3);
};
const tRadicle = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 120, 1000, 840, 40), WETC, 6);
  shadow(c, 490, 715, 300, 34);
  const big = () => ell(c, 440, 520, 245, 172, -0.2);
  shape(c, big, COL.greenLt, 8); shade(c, big, COL.green, 70, 60, 0.6);
  line(c, [[330, 540], [520, 490]], 22, "#f4f1e4");
  const t = taper(c, [650, 465], [775, 450], [900, 640], 62, 14);
  arrow(c, [[960, 360], [t[11][0] + 25, t[11][1] - 25]], RED, 12);
};

const tAbove = (c: Ctx) => {
  ground(c, SKY);
  sun(c, 900, 170, 60);
  soilBlock(c, 0, 640, 1080, 440, 21);
  line(c, [[0, 640], [1080, 640]], 7, INK);
  rootSpread(c, 540, 900);
  taper(c, [540, 900], [545, 700], [540, 450], 28, 28, COL.greenLt);
  [[-1, 0.35], [1, -0.35]].forEach(([s, rot]) => { shape(c, () => ell(c, 540 + s * 105, 450, 105, 62, rot), COL.greenLt, 6); line(c, [[540 + s * 20, 452], [540 + s * 185, 440]], 4, COL.green); });
  leaf(c, 540, 440, 100, -Math.PI / 2 - 0.35); leaf(c, 540, 440, 100, -Math.PI / 2 + 0.35);
};

const tBelow = (c: Ctx) => {
  ground(c, SKY);
  sun(c, 900, 170, 60);
  soilBlock(c, 0, 640, 1080, 440, 22);
  line(c, [[0, 640], [1080, 640]], 7, INK);
  rootSpread(c, 540, 880);
  const s = taper(c, [540, 850], [548, 640], [540, 360], 18, 16, COL.green);
  [[560, 3], [480, 4]].forEach(([yy]) => { const p = s[Math.round(((850 - yy) / 490) * 16)]; leaf(c, p[0], p[1], 85, -2.4); leaf(c, p[0], p[1], 85, -0.74); });
  leaf(c, 540, 365, 80, -Math.PI / 2);
  [[-1], [1]].forEach(([k]) => {
    const p = () => ell(c, 540 + k * 105, 860, 85, 62, k * 0.15);
    shape(c, p, CHANA, 6); shade(c, p, CHANA_DK, 12, 14, 0.55);
    line(c, [[540 + k * 50, 850], [540 + k * 150, 830]], 4, CHANA_DK);
  });
};

const pot = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 20, y + 6, 160, 18);
  shape(c, () => polyP(c, [[x - 105, y - 150], [x + 105, y - 150], [x + 80, y], [x - 80, y]]), "#c9693a", 6);
  shape(c, () => rrect(c, x - 120, y - 190, 240, 50, 14), "#d9804c", 6);
  shape(c, () => ell(c, x, y - 190, 100, 18), SOILP, 4);
};
const tPale = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 0, 900, 1080, 180, 0), COL.wood, 0);
  line(c, [[0, 900], [1080, 900]], 7, INK);
  pot(c, 300, 960); pot(c, 780, 960);
  pale(c, 300, 780, 470, -90);
  green(c, 780, 780, 200);
};

export const ic_seedsAndLifeCyclesSeedsAndGerminationL4 = cards("sci.seeds-and-life-cycles.seeds-and-germination.L4", [
  sE10, sE11, sE13, sE20, sE21, sE30, sE31, sE42, sA10,
  fE1, fE2, fE3, fE4, tRadicle, tAbove, tBelow, tPale,
]);
