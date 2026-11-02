import type { Ctx } from "./core";
import { INK, BG, COL, SKIN, CLOTH, WHITE, RED, D, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, person, hand, write, cards, ground, rnd, leaf } from "./flatKit";

const SKYC = "#cfe9f7", DUST = "#c79a63", DUSTDK = "#a87a45";

// ---- shared bits
const drop = (c: Ctx, x: number, y: number, s: number, fill: string = COL.water) =>
  shape(c, () => { c.moveTo(x, y - s * 1.3); c.quadraticCurveTo(x + s * 0.95, y + s * 0.1, x, y + s); c.quadraticCurveTo(x - s * 0.95, y + s * 0.1, x, y - s * 1.3); c.closePath(); }, fill, Math.max(3, s * 0.18));
const heart = (c: Ctx, x: number, y: number, s: number) =>
  shape(c, () => { c.moveTo(x, y + s * 0.9); c.bezierCurveTo(x - s * 1.6, y - s * 0.2, x - s * 0.7, y - s * 1.1, x, y - s * 0.4); c.bezierCurveTo(x + s * 0.7, y - s * 1.1, x + s * 1.6, y - s * 0.2, x, y + s * 0.9); c.closePath(); }, COL.pink, 6);
const blade = (c: Ctx, x: number, y: number, len: number, lean: number, col: string = COL.green) =>
  shape(c, () => { c.moveTo(x - 18, y); c.quadraticCurveTo(x - 10 + lean * 0.5, y - len * 0.5, x + lean, y - len); c.quadraticCurveTo(x + 10 + lean * 0.5, y - len * 0.5, x + 18, y); c.closePath(); }, col, 5);
const tuft = (c: Ctx, x: number, y: number, s: number, col: string = COL.green) => { blade(c, x - 22 * s, y, 90 * s, -22 * s, COL.greenDk); blade(c, x + 22 * s, y, 100 * s, 24 * s, col); blade(c, x, y, 120 * s, 0, COL.greenLt); };
const cloud = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => { ell(c, x, y, 110 * s, 50 * s); c.moveTo(x - 20 * s, y - 20 * s); ell(c, x - 20 * s, y - 40 * s, 60 * s, 50 * s); c.moveTo(x + 90 * s, y - 20 * s); ell(c, x + 50 * s, y - 50 * s, 50 * s, 45 * s); };
  shape(c, p, WHITE, 5);
  shape(c, () => ell(c, x, y, 110 * s, 50 * s), WHITE, 0);
};
const cow = (c: Ctx, x: number, y: number, s: number, dir = 1) => {
  c.save(); c.translate(x, y); c.scale(s * dir, s);
  shadow(c, 10, 4, 120, 16);
  line(c, [[-95, -135], [-120, -110], [-112, -72]], 8, INK);
  shape(c, () => ell(c, -112, -62, 10, 16), INK, 0);
  for (const lx of [-72, 62]) shape(c, () => rrect(c, lx - 11, -75, 22, 75, 7), COL.cloth);
  for (const lx of [-72, 62]) shape(c, () => rrect(c, lx - 11, -16, 22, 16, 5), INK, 0);
  shape(c, () => ell(c, 20, -56, 18, 13), COL.pink, 5);
  const body = () => rrect(c, -105, -155, 210, 100, 42);
  shape(c, body, COL.cloth);
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = COL.brown; c.beginPath(); ell(c, -50, -128, 44, 30, 0.3); c.fill(); c.beginPath(); ell(c, 55, -85, 32, 26); c.fill(); c.restore();
  shade(c, body, COL.greyDk, 14, 10, 0.25);
  for (const lx of [-40, 98 - 20]) shape(c, () => rrect(c, lx - 11, -75, 22, 75, 7), COL.cloth);
  for (const lx of [-40, 78]) shape(c, () => rrect(c, lx - 11, -16, 22, 16, 5), INK, 0);
  shape(c, () => ell(c, 112, -118, 44, 38), COL.cloth);
  shape(c, () => ell(c, 148, -102, 26, 22), COL.pink, 5);
  shape(c, () => ell(c, 156, -106, 4, 5), INK, 0);
  shape(c, () => ell(c, 120, -132, 6, 7), INK, 0);
  shape(c, () => polyP(c, [[96, -150], [90, -178], [112, -156]]), COL.cloth, 4);
  shape(c, () => ell(c, 84, -128, 20, 10, 0.5), COL.brown, 5);
  c.restore();
};
// a faucet whose spout ends above (nx, ny + 20)
const faucet = (c: Ctx, nx: number, ny: number) => {
  shape(c, () => rrect(c, nx - 300, ny - 125, 38, 160, 10), COL.steelDk);
  shape(c, () => rrect(c, nx - 280, ny - 90, 320, 64, 14), COL.steel);
  shape(c, () => rrect(c, nx - 26, ny - 90, 52, 112, 14), COL.steel);
  shade(c, () => rrect(c, nx - 280, ny - 90, 320, 64, 14), COL.steelDk, 0, 14, 0.4);
  shape(c, () => rrect(c, nx - 140, ny - 120, 28, 34, 6), COL.steelDk);
  shape(c, () => ell(c, nx - 126, ny - 132, 38, 14), COL.red, 5);
};
// a tilted tub of soil (higher on the left); draw(c) paints on the soil in the tub's own tilted space
const tub = (c: Ctx, cx: number, cy: number, w: number, draw: () => void, soil: string = COL.soil) => {
  c.save(); c.translate(cx, cy); c.rotate(0.2);
  shape(c, () => rrect(c, -w / 2, -40, w, 110, 16), COL.teal);
  shape(c, () => rrect(c, -w / 2 + 14, -34, w - 28, 44, 10), soil, 5);
  draw();
  c.restore();
};
const books = (c: Ctx, x: number, y: number) => { shape(c, () => rrect(c, x, y + 36, 130, 36, 6), COL.blue); shape(c, () => rrect(c, x + 8, y, 118, 36, 6), COL.orange); };
const bucket = (c: Ctx, x: number, y: number, w: number, h: number, fillCol: string = COL.water) => {
  shadow(c, x + 12, y + 6, w * 0.6, 16);
  shape(c, () => polyP(c, [[x - w / 2, y - h], [x + w / 2, y - h], [x + w * 0.38, y], [x - w * 0.38, y]]), COL.steel);
  shade(c, () => polyP(c, [[x - w / 2, y - h], [x + w / 2, y - h], [x + w * 0.38, y], [x - w * 0.38, y]]), COL.steelDk, w * 0.14, 0, 0.5);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), fillCol, 5);
  line(c, [[x - w * 0.5, y - h + 4], [x, y - h - w * 0.5], [x + w * 0.5, y - h + 4]], 7);
};

// ---- the pictures
const e3 = (c: Ctx) => {
  ground(c);
  for (const [cx, covered] of [[250, false], [720, true]] as [number, boolean][]) {
    books(c, cx - 235, 460);
    tub(c, cx, 470, 380, () => {
      if (covered) { for (let i = 0; i < 6; i++) tuft(c, -145 + i * 58, -30, 0.45); }
      else { line(c, [[-120, -14], [-40, -8]], 4, COL.soilDk); line(c, [[20, -22], [110, -14]], 4, COL.soilDk); }
    });
    const col = covered ? COL.water : "#9a6a42";
    line(c, [[cx + 196, 520], [cx + 210, 735]], 16, col);
    bowl(c, cx + 205, 745, 85, covered ? COL.drop : "#9a6a42");
    for (let i = 0; i < 4; i++) drop(c, cx - 150 + i * 105, 150 + (i % 2) * 40, 16);
    arrow(c, [[cx - 20, 215], [cx - 20, 330]]);
  }
};

const onion = (c: Ctx, x: number, newLen: number) => {
  for (const dx of [-22, 22, 0]) {
    const top = 650 - 80 - newLen;
    blade(c, x + dx, 650, 80 + newLen, dx * 0.3, COL.green);
    if (newLen > 0) { c.save(); c.beginPath(); c.rect(x - 90, 650 - newLen, 180, newLen + 20); c.clip(); blade(c, x + dx, 650, 80 + newLen, dx * 0.3, COL.greenLt); c.restore(); }
    shape(c, () => ell(c, x + dx + dx * 0.3 * 0, top + 6, 11, 5), "#f4f1e4", 3);
  }
  for (let i = -2; i <= 2; i++) line(c, [[x + i * 14, 720], [x + i * 22, 790]], 6, INK);
  for (let i = -2; i <= 2; i++) line(c, [[x + i * 14, 720], [x + i * 22, 790]], 3, WHITE);
  shape(c, () => ell(c, x, 690, 46, 56), "#f4e9ee");
  shade(c, () => ell(c, x, 690, 46, 56), "#caa6b6", 14, 6, 0.5);
};
const a1 = (c: Ctx) => {
  ground(c);
  for (const [x, n] of [[290, 0], [790, 120]] as [number, number][]) {
    glass(c, x, 880, 230, 300, 0.45);
    onion(c, x, n);
  }
  arrow(c, [[470, 520], [610, 520]]);
  shape(c, () => ell(c, 540, 420, 0, 0), WHITE, 0);
};

const a2 = (c: Ctx) => {
  ground(c);
  faucet(c, 400, 280);
  drop(c, 400, 390, 22);
  drop(c, 400, 520, 22);
  glass(c, 400, 900, 250, 290, 0.3);
  drop(c, 400, 690, 18);
  shape(c, () => rrect(c, 710, 560, 210, 340, 34), COL.black);
  shape(c, () => rrect(c, 730, 600, 170, 230, 12), "#22303a", 4);
  write(c, "10", 765, 660, 90, "#c9f06b", 12);
  arrow(c, [[640, 450], [700, 530]]);
};

const a4 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 745, 450, 18);
  shape(c, () => rrect(c, 70, 700, 940, 46, 10), COL.wood);
  glass(c, 200, 700, 170, 260, 0.8, "#fffaf0");
  shape(c, () => rrect(c, 400, 520, 180, 180, 30), COL.yellow);
  shade(c, () => rrect(c, 400, 520, 180, 180, 30), COL.orange, 30, 0, 0.5);
  shape(c, () => rrect(c, 410, 480, 160, 50, 12), COL.brown);
  shape(c, () => polyP(c, [[490, 580], [520, 598], [520, 632], [490, 650], [460, 632], [460, 598]]), WHITE, 5);
  shape(c, () => rrect(c, 630, 640, 230, 60, 14), COL.greyDk);
  for (const ex of [680, 745, 810]) shape(c, () => ell(c, ex, 628, 32, 42), "#fff3dc");
  shape(c, () => rrect(c, 630, 650, 230, 52, 14), COL.grey);
  for (let i = 0; i < 3; i++) { shape(c, () => rrect(c, 880, 650 - i * 42, 130, 50, 12), i === 1 ? COL.pink : COL.purple); line(c, [[900, 674 - i * 42], [990, 674 - i * 42]], 6, COL.yellow); }
  heart(c, 540, 270, 90);
};

const c1 = (c: Ctx) => {
  ground(c);
  books(c, 85, 460);
  tub(c, 400, 470, 560, () => {
    for (const x of [-170, 0, 170]) { shape(c, () => rrect(c, x - 9, -78, 18, 60, 6), COL.wood); }
    const r = rnd(5);
    for (let i = 0; i < 9; i++) leaf(c, -230 + i * 56, -26 + r() * 6, 52, -0.4 + r() * 0.8, i % 2 ? COL.orange : COL.brown);
  });
  line(c, [[597, 520], [611, 735]], 16, COL.water);
  bowl(c, 606, 745, 85, COL.drop);
  for (let i = 0; i < 5; i++) drop(c, 230 + i * 100, 140 + (i % 2) * 40, 16);
  arrow(c, [[400, 215], [400, 320]]);
};

const t0 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 940, 470, 60), COL.greenLt, 5);
  person(c, 250, 930, 620, { armR: [-0.15, 0.1], armL: [Math.PI * 0.5, Math.PI * 0.45] });
  shape(c, () => rrect(c, 500, 440, 130, 120, 22), COL.teal);
  shape(c, () => polyP(c, [[625, 470], [730, 520], [725, 545], [625, 505]]), COL.tealDk, 5);
  line(c, [[520, 440], [560, 395], [610, 440]], 8);
  drop(c, 760, 600, 14); drop(c, 790, 690, 14); drop(c, 805, 780, 14);
  line(c, [[830, 940], [830, 760]], 12);
  leaf(c, 830, 800, 90, -0.5); leaf(c, 830, 800, 90, Math.PI + 0.5, COL.leafDk); leaf(c, 830, 745, 80, -1.0); leaf(c, 830, 760, 80, Math.PI + 1.0);
};

const t3 = (c: Ctx) => {
  c.fillStyle = SKYC; c.fillRect(0, 0, D, 520); c.fillStyle = DUST; c.fillRect(0, 520, D, 560);
  line(c, [[0, 520], [D, 520]], 6);
  const r = rnd(3);
  for (let i = 0; i < 10; i++) line(c, [[60 + r() * 940, 600 + r() * 440], [90 + r() * 940, 610 + r() * 440]], 5, DUSTDK);
  tuft(c, 130, 640, 0.35, COL.greenDk); tuft(c, 960, 590, 0.3, COL.greenDk);
  cow(c, 300, 700, 0.8); cow(c, 720, 660, 0.7, -1); cow(c, 540, 890, 0.95); cow(c, 880, 960, 0.9, -1); cow(c, 190, 960, 0.85);
};

const t4 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 180, 640, 720, 340, 20), COL.soil);
  shade(c, () => rrect(c, 180, 640, 720, 340, 20), COL.soilDk, 40, 20, 0.5);
  for (let i = 0; i < 6; i++) { line(c, [[360 + i * 70, 650], [350 + i * 70 + (i % 2 ? 20 : -20), 760]], 8); line(c, [[360 + i * 70, 650], [350 + i * 70 + (i % 2 ? 20 : -20), 760]], 4, WHITE); }
  [[-110, -30, 260], [-40, 14, 330], [30, 0, 360], [100, -14, 330], [170, 24, 260]].forEach(([dx, lean, len]) => blade(c, 540 + dx, 640, len, lean, COL.green));
  shape(c, () => ell(c, 540, 640, 130, 44), COL.yellow, 7);
  shape(c, () => ell(c, 540, 640, 60, 24), COL.orange, 5);
  arrow(c, [[860, 560], [860, 300]]);
  arrow(c, [[740, 560], [740, 400]]);
};

const t6 = (c: Ctx) => {
  ground(c);
  const L = (y: number, h: number, col: string) => { c.fillStyle = col; c.fillRect(100, y, 880, h); };
  L(310, 150, COL.soil); L(460, 140, "#e8cf8e"); L(600, 120, COL.grey);
  c.fillStyle = COL.water; c.beginPath(); c.moveTo(100, 760); for (let x = 100; x <= 980; x += 40) c.lineTo(x, 760 + ((x / 40) % 2 ? 14 : -4)); c.lineTo(980, 980); c.lineTo(100, 980); c.closePath(); c.fill();
  const r = rnd(9);
  for (let i = 0; i < 40; i++) { c.fillStyle = COL.yellow; c.beginPath(); ell(c, 120 + r() * 840, 475 + r() * 110, 5, 4); c.fill(); }
  for (let i = 0; i < 12; i++) shape(c, () => ell(c, 140 + r() * 800, 620 + r() * 90, 22, 15, r()), COL.greyDk, 3);
  c.strokeStyle = INK; c.lineWidth = 6; c.strokeRect(100, 310, 880, 670);
  c.fillStyle = COL.green; c.fillRect(100, 280, 880, 32); c.strokeRect(100, 280, 880, 32);
  for (let i = 0; i < 5; i++) drop(c, 200 + i * 120, 170, 16);
  arrow(c, [[300, 210], [300, 700]]);
  shape(c, () => rrect(c, 780, 150, 44, 700, 8), COL.steel);
  shape(c, () => polyP(c, [[780, 150], [680, 170], [680, 200], [780, 200]]), COL.steelDk);
  line(c, [[802, 160], [900, 110]], 14);
};

const t7 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 130, 440, 460, 340, 8), COL.paper);
  shape(c, () => polyP(c, [[70, 450], [360, 250], [650, 450]]), COL.red);
  shape(c, () => rrect(c, 300, 600, 110, 180, 8), COL.wood);
  shape(c, () => rrect(c, 170, 500, 90, 80, 8), COL.sky);
  shape(c, () => rrect(c, 460, 500, 90, 80, 8), COL.sky);
  const pipe: number[][] = [[640, 440], [690, 450], [690, 650], [790, 650]];
  line(c, pipe, 30); line(c, pipe, 18, COL.steel);
  shape(c, () => rrect(c, 790, 560, 220, 320, 30), COL.blue);
  shade(c, () => rrect(c, 790, 560, 220, 320, 30), COL.blueDk, 30, 0, 0.5);
  for (const y of [640, 760]) line(c, [[792, y], [1008, y]], 6);
  shape(c, () => rrect(c, 920, 830, 70, 30, 6), COL.steel);
  c.beginPath(); c.moveTo(60, 780); c.lineTo(1020, 780); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  for (let i = 0; i < 5; i++) drop(c, 190 + i * 110, 130 + (i % 2) * 50, 16);
  arrow(c, [[640, 190], [640, 300]]);
  arrow(c, [[720, 520], [720, 610]]);
};

const t9 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(540, 360); c.rotate(-0.35);
  line(c, [[-200, 0], [-330, 0]], 8, COL.steelDk);
  shape(c, () => rrect(c, -235, -24, 40, 48, 8), COL.steel);
  shape(c, () => rrect(c, 130, -12, 140, 24, 6), COL.steel);
  shape(c, () => rrect(c, 266, -52, 28, 104, 10), COL.steelDk);
  shape(c, () => rrect(c, -200, -46, 330, 92, 16), COL.glass);
  shape(c, () => rrect(c, -190, -36, 220, 72, 10), "#8fe0c0", 0);
  shape(c, () => rrect(c, 100, -70, 26, 140, 8), COL.steelDk);
  shine(c, [[-170, -26], [20, -26]], 7);
  c.restore();
  shape(c, () => rrect(c, 660, 650, 160, 230, 26), COL.glass);
  shape(c, () => rrect(c, 672, 740, 136, 128, 18), "#8fe0c0", 0);
  shape(c, () => rrect(c, 660, 620, 160, 44, 10), COL.steelDk);
  shine(c, [[686, 690], [686, 840]], 8);
  shape(c, () => { c.moveTo(300, 600); c.lineTo(440, 640); c.quadraticCurveTo(440, 800, 300, 900); c.quadraticCurveTo(160, 800, 160, 640); c.closePath(); }, COL.green);
  write(c, "+", 270, 680, 150, WHITE, 22);
};

const field = (c: Ctx, green: boolean, cows: [number, number, number, number][]) => {
  c.fillStyle = SKYC; c.fillRect(0, 0, D, 190); c.fillStyle = green ? COL.greenLt : DUST; c.fillRect(0, 190, D, 330);
  line(c, [[0, 190], [D, 190]], 6);
  const r = rnd(green ? 4 : 8);
  if (green) for (let i = 0; i < 7; i++) tuft(c, 80 + i * 150, 250 + r() * 40, 0.4, COL.green);
  else { for (let i = 0; i < 6; i++) line(c, [[60 + r() * 900, 240 + r() * 250], [100 + r() * 900, 250 + r() * 250]], 5, DUSTDK); tuft(c, 120, 240, 0.25, COL.greenDk); }
  cows.forEach(([x, y, s, d]) => cow(c, x, y, s, d));
};
const e2 = (c: Ctx) => {
  ground(c);
  c.save(); c.beginPath(); c.rect(0, 0, D, 520); c.clip(); field(c, true, [[300, 440, 0.7, 1], [740, 420, 0.65, -1]]); c.restore();
  c.save(); c.beginPath(); c.rect(0, 560, D, 520); c.clip(); c.translate(0, 560);
  field(c, false, [[150, 400, 0.55, 1], [380, 440, 0.6, -1], [600, 400, 0.55, 1], [830, 450, 0.6, -1], [500, 495, 0.5, 1], [940, 380, 0.45, -1]]); c.restore();
  arrow(c, [[540, 470], [540, 580]]);
};

const e3x = (c: Ctx) => {
  ground(c);
  cow(c, 320, 850, 1.6);
  glass(c, 770, 850, 170, 290, 0.8, "#fffaf0");
  shadow(c, 940, 850, 90, 14);
  for (const [ex, ey] of [[905, 815], [975, 815], [940, 760]]) shape(c, () => ell(c, ex, ey, 34, 46), "#fff3dc");
  heart(c, 540, 280, 100);
};

const e4 = (c: Ctx) => {
  ground(c);
  person(c, 230, 920, 640, { armR: [0.35, 0.5], armL: [Math.PI * 0.5, Math.PI * 0.45] });
  bucket(c, 520, 920, 220, 190);
  cow(c, 830, 920, 1.3, -1);
  heart(c, 540, 330, 90);
};

const e5 = (c: Ctx) => {
  ground(c);
  cloud(c, 280, 130, 1.1); cloud(c, 800, 130, 1.1);
  for (const x of [90, 610]) {
    shape(c, () => rrect(c, x, 600, 380, 340, 18), COL.soil);
    shade(c, () => rrect(c, x, 600, 380, 340, 18), COL.soilDk, 30, 20, 0.5);
  }
  for (const x of [200, 280, 360]) drop(c, x, 300, 16);
  for (const x of [720, 800, 880]) drop(c, x, 300, 16);
  line(c, [[100, 598], [300, 592], [470, 600], [535, 680], [535, 880]], 22, "#9a6a42"); shape(c, () => ell(c, 535, 900, 55, 22), "#9a6a42", 5);
  arrow(c, [[200, 530], [400, 530]]);
  for (let i = 0; i < 6; i++) blade(c, 650 + i * 60, 600, 100, i % 2 ? 14 : -14, COL.green);
  for (let i = 0; i < 6; i++) { const x = 650 + i * 60; line(c, [[x, 604], [x - 12, 700], [x + 6, 800], [x - 8, 880]], 9); line(c, [[x, 604], [x - 12, 700], [x + 6, 800], [x - 8, 880]], 4, WHITE); }
};

const e6 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 940, 330, 22);
  shape(c, () => ell(c, 540, 220, 270, 190), COL.leaf);
  shape(c, () => ell(c, 400, 280, 150, 120), COL.leafDk, 0);
  shape(c, () => ell(c, 540, 220, 270, 190), "rgba(0,0,0,0)", 6);
  shape(c, () => polyP(c, [[455, 330], [625, 330], [645, 940], [435, 940]]), COL.brown);
  shade(c, () => polyP(c, [[455, 330], [625, 330], [645, 940], [435, 940]]), COL.soilDk, 40, 0, 0.5);
  line(c, [[520, 450], [525, 560]], 5, COL.soilDk); line(c, [[570, 640], [565, 780]], 5, COL.soilDk);
  person(c, 300, 940, 540, { adult: true, armL: [0.1, -0.2], armR: [-0.1, 0.1] });
  person(c, 790, 940, 470, { armL: [Math.PI + 0.1, Math.PI + 0.2], armR: [Math.PI - 0.1, Math.PI - 0.1] });
};

const e7 = (c: Ctx) => {
  ground(c);
  faucet(c, 330, 270);
  bucket(c, 330, 900, 270, 280);
  shape(c, () => rrect(c, 580, 830, 100, 80, 14), COL.steel);
  c.beginPath(); c.arc(690, 868, 24, -1.3, 1.3); c.strokeStyle = INK; c.lineWidth = 14; c.stroke(); c.strokeStyle = COL.steel; c.lineWidth = 6; c.stroke();
  shadow(c, 640, 912, 70, 12);
  shape(c, () => polyP(c, [[800, 760], [940, 760], [920, 900], [820, 900]]), COL.orange);
  shape(c, () => rrect(c, 790, 735, 160, 36, 8), COL.orange);
  line(c, [[870, 740], [870, 560]], 12);
  leaf(c, 870, 620, 110, -0.5); leaf(c, 870, 620, 110, Math.PI + 0.5, COL.leafDk); leaf(c, 870, 570, 90, -1.1);
  arrow(c, [[650, 790], [720, 700], [790, 690]]);
  drop(c, 690, 700, 14);
};

export const ic_environmentConservationL3 = cards("sci.environment.conservation.L3 cards", [e3, a1, a2, a4, c1, t0, t3, t4, t6, t7, t9, e2, e3x, e4, e5, e6, e7]);
