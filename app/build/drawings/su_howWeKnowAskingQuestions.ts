import type { Ctx } from "./core";
import { INK, SH, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, rrect, polyP, shadow, shade, line, shine, arrow, bowl, plate, hand, write, cards } from "./flatKit";

// apple browning scale: cream to brown, the same on every card
const FL = ["#f6ecc4", "#e9cf94", "#cfa465", "#a56d3a"];
const PAPER = COL.paper;

// an apple slice seen from above: red skin ring, flesh, a core with two seeds; k squashes it when it lies on a plate
const slice = (c: Ctx, x: number, y: number, r: number, flesh: string, k = 0.92) => {
  shadow(c, x + r * 0.12, y + r * k * 0.95, r * 0.95, r * 0.18);
  shape(c, () => ell(c, x, y, r, r * k), COL.red, Math.max(3, r * 0.07));
  shape(c, () => ell(c, x, y, r * 0.82, r * k * 0.8), flesh, Math.max(2.5, r * 0.05));
  shape(c, () => ell(c, x, y, r * 0.24, r * k * 0.22), "rgba(120,80,40,0.3)", 0);
  shape(c, () => ell(c, x - r * 0.08, y, r * 0.045, r * k * 0.09, 0.5), "#5b3a22", 0);
  shape(c, () => ell(c, x + r * 0.08, y, r * 0.045, r * k * 0.09, -0.5), "#5b3a22", 0);
};
// a pencil, tip at (x2, y2)
const pencil = (c: Ctx, x1: number, y1: number, x2: number, y2: number) => {
  const an = Math.atan2(y2 - y1, x2 - x1), dx = Math.cos(an), dy = Math.sin(an), px = -dy, py = dx, bx = x2 - dx * 55, by = y2 - dy * 55;
  line(c, [[x1, y1], [bx, by]], 36, INK); line(c, [[x1, y1], [bx, by]], 24, COL.yellow);
  shape(c, () => polyP(c, [[bx + px * 18, by + py * 18], [x2, y2], [bx - px * 18, by - py * 18]]), COL.wood, 5);
  shape(c, () => polyP(c, [[x2 - dx * 16 + px * 6, y2 - dy * 16 + py * 6], [x2, y2], [x2 - dx * 16 - px * 6, y2 - dy * 16 - py * 6]]), INK, 3);
};
// a hand pointing left (the kit hand mirrored), wrist at (x, y)
const handLeft = (c: Ctx, x: number, y: number, an: number, s: number, skin: string = SKIN.child, sleeve: string = CLOTH.child) => {
  c.save(); c.translate(x, 0); c.scale(-1, 1); hand(c, 0, y, an, s, skin, sleeve); c.restore();
};
// a notebook page
const page = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x + 14, y + 16, w, h, 14), SH, 0);
  shape(c, () => rrect(c, x, y, w, h, 14), PAPER, 6);
  line(c, [[x + 70, y + 12], [x + 70, y + h - 12]], 3, COL.pink);
};
const colourCard = (c: Ctx, x: number, y: number, w: number, h: number, vertical: boolean, filled = 4) => {
  shape(c, () => rrect(c, x, y, w, h, 12), WHITE, 6);
  for (let k = 0; k < 4; k++) {
    const bx = vertical ? x + 18 : x + 20 + k * ((w - 20) / 4), by = vertical ? y + 18 + k * ((h - 18) / 4) : y + 22, bw = vertical ? w - 36 : (w - 20) / 4 - 10, bh = vertical ? (h - 18) / 4 - 10 : h - 100;
    shape(c, () => rect(c, bx, by, bw, bh), k < filled ? FL[k] : WHITE, 5);
  }
};
const rect = (c: Ctx, x: number, y: number, w: number, h: number) => c.rect(x, y, w, h);
const drop = (c: Ctx, x: number, y: number, s: number) => shape(c, () => { c.moveTo(x, y - s); c.quadraticCurveTo(x - s * 0.9, y + s * 0.2, x, y + s * 0.8); c.quadraticCurveTo(x + s * 0.9, y + s * 0.2, x, y - s); c.closePath(); }, COL.water, 5);
const lemonHalf = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shape(c, () => ell(c, x, y, rx, ry), COL.yellow, 6);
  shade(c, () => ell(c, x, y, rx, ry), COL.orange, rx * 0.25, ry * 0.2, 0.35);
  shape(c, () => ell(c, x, y + ry * 0.86, rx * 0.78, ry * 0.26), "#fff3b0", 5);
};
const fridgeIcon = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 10), COL.steelIn, 5);
  line(c, [[x, y + h * 0.35], [x + w, y + h * 0.35]], 4);
  line(c, [[x + w - 12, y + h * 0.12], [x + w - 12, y + h * 0.28]], 6); line(c, [[x + w - 12, y + h * 0.45], [x + w - 12, y + h * 0.75]], 6);
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  // the colour card, four boxes, 0 to 3, the last one being coloured in
  shadow(c, 380, 850, 340, 36);
  shape(c, () => rrect(c, 50, 520, 660, 310, 14), WHITE, 6);
  for (let k = 0; k < 4; k++) {
    const bx = 75 + k * 155;
    shape(c, () => rect(c, bx, 550, 140, 170), k < 3 ? FL[k] : WHITE, 5);
    write(c, String(k), bx + 45, 745, 60, INK, 8);
  }
  shape(c, () => rect(c, 540, 620, 140, 100), FL[3], 5);
  // the table in the notebook
  page(c, 750, 200, 280, 720);
  for (let r = 0; r <= 6; r++) line(c, [[800, 280 + r * 100], [1010, 280 + r * 100]], 4);
  for (const x of [800, 870, 940, 1010]) line(c, [[x, 280], [x, 880]], 4);
  for (let r = 0; r < 4; r++) shape(c, () => rect(c, 812, 296 + r * 100 + 100, 46, 72), FL[r], 4);
  // the hand holding a pencil, colouring the last box
  const cx = 635, cy = 430;
  pencil(c, cx + 70, cy - 200, cx - 35, cy + 260);
  hand(c, cx - 140, cy, 0, 2);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  plate(c, 180, 860, 175, 66); slice(c, 180, 855, 100, FL[0], 0.5);
  plate(c, 540, 860, 175, 66); slice(c, 540, 855, 100, FL[0], 0.5);
  lemonHalf(c, 575, 500, 130, 100);
  hand(c, 405, 500, 0, 2, SKIN.adult, CLOTH.adult);
  arrow(c, [[455, 680], [640, 680]]); arrow(c, [[640, 725], [455, 725]]);
  const bx = 890, by = 720, r = 160;
  shadow(c, bx + 20, by + 160, r * 0.9, 24);
  shape(c, () => { c.moveTo(bx - r, by); c.bezierCurveTo(bx - r, by + r * 1.05, bx + r, by + r * 1.05, bx + r, by); c.closePath(); }, COL.steel);
  shade(c, () => { c.moveTo(bx - r, by); c.bezierCurveTo(bx - r, by + r * 1.05, bx + r, by + r * 1.05, bx + r, by); c.closePath(); }, COL.steelDk, r * 0.3, -6);
  shape(c, () => ell(c, bx, by, r, r * 0.34), COL.steelIn, 5);
  shape(c, () => ell(c, bx, by + 2, r * 0.88, r * 0.27), COL.water, 4);
  c.globalAlpha = 0.6; slice(c, bx - 55, by + 5, 66, FL[0], 0.42); c.globalAlpha = 1;
  shape(c, () => ell(c, bx + 50, by - 2, 70, 28), COL.steel, 5);
  shape(c, () => ell(c, bx + 50, by - 5, 54, 20), COL.steelIn, 4);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#f6efe0"; c.fillRect(0, 0, 1080, 640); line(c, [[0, 640], [1080, 640]], 6);
  const kx = 800, ky = 250, kr = 125;
  shape(c, () => ell(c, kx, ky, kr, kr), WHITE, 7);
  for (let h = 0; h < 12; h++) { const a = (h / 12) * Math.PI * 2; line(c, [[kx + Math.cos(a) * kr * 0.8, ky + Math.sin(a) * kr * 0.8], [kx + Math.cos(a) * kr * 0.92, ky + Math.sin(a) * kr * 0.92]], 6); }
  line(c, [[kx, ky], [kx + 8, ky - 85]], 9); line(c, [[kx, ky], [kx + 55, ky + 30]], 11);
  shape(c, () => ell(c, kx, ky, 11, 11), INK, 0);
  plate(c, 700, 800, 330, 125);
  slice(c, 540, 800, 92, FL[2], 0.62); slice(c, 705, 800, 92, FL[0], 0.62); slice(c, 870, 800, 92, FL[0], 0.62);
  colourCard(c, 90, 440, 240, 400, true);
  hand(c, 210, 930, -Math.PI / 2, 1.8);
};

// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  page(c, 80, 110, 920, 860);
  const rows: [string[], (x: number, y: number) => void][] = [
    [[FL[0], FL[0], FL[1], FL[1], FL[2], FL[2], FL[3]], (x, y) => { shape(c, () => ell(c, x, y, 38, 38), COL.red, 5); leaf(c, x, y - 36); }],
    [[FL[0], FL[0], FL[0], FL[0], FL[0], FL[0], FL[0]], (x, y) => lemonHalf(c, x, y, 42, 32)],
    [[FL[0], FL[0], FL[0], FL[0], FL[0], FL[0], FL[1]], (x, y) => drop(c, x, y, 36)],
  ];
  rows.forEach(([cols, icon], i) => {
    const y = 330 + i * 240;
    icon(160, y);
    cols.forEach((f, k) => slice(c, 290 + k * 112, y, 46, f));
    if (i < 2) line(c, [[100, y + 120], [980, y + 120]], 3, COL.grey);
  });
};
const leaf = (c: Ctx, x: number, y: number) => {
  line(c, [[x, y], [x + 4, y - 16]], 5);
  shape(c, () => { c.moveTo(x + 4, y - 14); c.quadraticCurveTo(x + 30, y - 40, x + 44, y - 20); c.quadraticCurveTo(x + 24, y - 6, x + 4, y - 14); }, COL.leaf, 4);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 30, 70, 210, 560, 18), COL.steelIn, 6);
  shade(c, () => rrect(c, 30, 70, 210, 560, 18), COL.steelDk, 30, 0, 0.4);
  line(c, [[30, 270], [240, 270]], 6); line(c, [[205, 150], [205, 230]], 12); line(c, [[205, 320], [205, 440]], 12);
  bowl(c, 940, 200, 95);
  shadow(c, 945, 480, 70, 14);
  shape(c, () => ell(c, 945, 410, 72, 66), COL.red, 6); shade(c, () => ell(c, 945, 410, 72, 66), "#b8301f", 24, 12, 0.5);
  line(c, [[945, 350], [952, 320]], 6); leaf(c, 950, 332);
  page(c, 270, 90, 540, 880);
  for (let i = 0; i < 6; i++) {
    const y = 160 + i * 135;
    write(c, String(i + 1), 292, y - 20, 36, INK, 6);
    line(c, [[350, y], [350 + 100 + (i % 3) * 25, y]], 12, i === 5 ? RED : INK);
    line(c, [[350, y + 50], [770, y + 50]], 3, COL.grey);
  }
  const tx = 580, ty = 880;
  pencil(c, tx + 105, ty - 460, tx, ty);
  handLeft(c, tx + 35 + 140, ty - 260, 0, 2);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6cf9f"; c.fillRect(0, 760, 470, 320); line(c, [[0, 760], [470, 760]], 6);
  shape(c, () => rrect(c, 540, 60, 500, 960, 20), COL.steelIn, 6);
  shape(c, () => rrect(c, 575, 95, 430, 890, 10), "#e4f1f8", 5);
  for (const y of [350, 640, 930]) shape(c, () => rect(c, 575, y, 430, 24), COL.steel, 5);
  shape(c, () => polyP(c, [[540, 60], [455, 100], [455, 980], [540, 1020]]), COL.steel, 6);
  line(c, [[480, 380], [480, 700]], 14);
  plate(c, 215, 910, 190, 70); slice(c, 215, 905, 110, FL[0], 0.55);
  hand(c, 185, 650, 0, 2, SKIN.child, CLOTH.child, true);
  plate(c, 400, 610, 195, 58); slice(c, 410, 603, 90, FL[0], 0.42);
  arrow(c, [[230, 440], [440, 440]]);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  page(c, 70, 110, 940, 860);
  const rows: [string[], number][] = [[[FL[0], FL[1], FL[2], FL[3]], 340], [[FL[0], FL[0], FL[1], FL[2]], 680]];
  rows.forEach(([cols, y], i) => {
    if (i === 0) plate(c, 190, y + 10, 62, 26); else fridgeIcon(c, 155, y - 55, 70, 110);
    cols.forEach((f, k) => {
      const x = 380 + k * 195;
      slice(c, x, y, 82, f);
      write(c, String((k + 1) * 10), x - 28, y + 105, 40, INK, 6);
    });
  });
  line(c, [[100, 510], [980, 510]], 3, COL.grey);
};

export const su_howWeKnowAskingQuestions = cards("sci.how-we-know.asking-questions.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2]);
