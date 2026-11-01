import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, hand, person, write, cards } from "./flatKit";

// ---- shared pieces: ice, ruler, lemon comet, fan
const COUNTER = "#e3d3b3", COUNTERDK = "#cdb88f", ICE = "#dff1fb", ICEDK = "#aed3ea";
const TISSUE = ["#f29ab4", WHITE, COL.sky, COL.greenLt, "#ffe08a", "#c9b3ec"];

const cube = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, s * 0.15, s * 0.55, s * 0.6, s * 0.12);
  shape(c, () => rrect(c, -s / 2, -s / 2, s, s, s * 0.14), ICE, 5);
  shade(c, () => rrect(c, -s / 2, -s / 2, s, s, s * 0.14), ICEDK, s * 0.3, s * 0.3, 0.6);
  line(c, [[-s * 0.3, -s * 0.28], [-s * 0.3, s * 0.05]], 7, WHITE);
  c.restore();
};
const counterTop = (c: Ctx, y: number) => { ground(c); c.fillStyle = COUNTER; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };

// a wavy tissue strip: starts at (x, y), runs along unit direction (dx, dy), length len, width w
const strip = (c: Ctx, x: number, y: number, dx: number, dy: number, len: number, w: number, col: string, ph: number, amp: number) => {
  const n = 12, L: number[][] = [], R: number[][] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, off = Math.sin(t * 5 + ph) * amp * t, px = -dy, py = dx, hw = (w / 2) * (1 - t * 0.1);
    const cx = x + dx * len * t + px * off, cy = y + dy * len * t + py * off;
    L.push([cx + px * hw, cy + py * hw]); R.push([cx - px * hw, cy - py * hw]);
  }
  shape(c, () => polyP(c, [...L, ...R.reverse()]), col, 5);
};
const lemon = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  const body = () => { ell(c, x, y, rx, ry); };
  shape(c, () => ell(c, x - rx * 1.0, y + ry * 0.0, rx * 0.12, ry * 0.2), COL.yellow, 5);
  shape(c, () => ell(c, x + rx * 1.0, y, rx * 0.12, ry * 0.2), COL.yellow, 5);
  shape(c, body, COL.yellow, 6);
  shade(c, body, COL.woodDk, rx * 0.25, ry * 0.25, 0.5);
  shine(c, [[x - rx * 0.55, y - ry * 0.35], [x - rx * 0.2, y - ry * 0.6]], Math.max(6, rx * 0.05));
};
const pencil = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w: number) => {
  line(c, [[x1, y1], [x2, y2]], w + 10, INK); line(c, [[x1, y1], [x2, y2]], w, COL.orange);
  const an = Math.atan2(y2 - y1, x2 - x1);
  line(c, [[x1, y1], [x1 + Math.cos(an) * w * 0.9, y1 + Math.sin(an) * w * 0.9]], w + 10, INK);
  line(c, [[x1, y1], [x1 + Math.cos(an) * w * 0.9, y1 + Math.sin(an) * w * 0.9]], w, COL.pink);
};
// the tissue comet held by a pencil at the left: lemon at (x, y); tail hangs down or streams to the right
const handComet = (c: Ctx, x: number, y: number, penFrom: number, blown: boolean) => {
  pencil(c, penFrom, y, x - 40, y, 22);
  if (blown) for (let i = 0; i < 6; i++) strip(c, x + 40, y - 40 + i * 16, 1, 0.06 * (i - 2.5), 270, 17, TISSUE[i], i, 22);
  else for (let i = 0; i < 6; i++) strip(c, x - 60 + i * 24, y + 20, 0.03 * (i - 2.5), 1, 330, 24, TISSUE[i], i, 10);
  lemon(c, x, y, 78, 58);
};
const ruler = (c: Ctx, x: number, yBot: number, cm: number) => {
  const step = 56;
  shape(c, () => rrect(c, x, yBot - step * (cm + 0.6), 74, step * (cm + 0.6), 6), COL.wood, 5);
  c.lineCap = "butt";
  for (let i = 0; i <= cm; i++) { const y = yBot - 8 - i * step; line(c, [[x, y], [x + 36, y]], 4); if (i > 0) write(c, String(i), x + 42, y - 10, 24, INK, 4); }
};
const fan = (c: Ctx, x: number, on: boolean) => {
  shadow(c, x + 14, 898, 100, 18);
  shape(c, () => ell(c, x, 878, 90, 22), COL.grey, 5);
  shape(c, () => rrect(c, x - 11, 470, 22, 410, 6), COL.steel, 5);
  shape(c, () => ell(c, x, 800, 11, 11), on ? COL.greenLt : COL.red, 4);
  c.save(); c.translate(x, 380); c.scale(0.72, 1);
  shape(c, () => ell(c, 0, 0, 108, 108), "#eef2f7", 6);
  shade(c, () => ell(c, 0, 0, 108, 108), COL.steelDk, 24, 24, 0.35);
  for (let k = 0; k < 4; k++) {
    c.save(); c.rotate(k * Math.PI / 2 + 0.5);
    c.globalAlpha = on ? 0.45 : 1; shape(c, () => { c.moveTo(0, 0); c.bezierCurveTo(10, -50, 60, -84, 84, -50); c.bezierCurveTo(80, -20, 40, -4, 0, 0); c.closePath(); }, COL.blue, 5); c.globalAlpha = 1;
    c.restore();
  }
  if (on) { c.beginPath(); c.arc(0, 0, 70, 0.3, 5.2); c.strokeStyle = COL.blueDk; c.lineWidth = 7; c.globalAlpha = 0.5; c.stroke(); c.globalAlpha = 1; }
  shape(c, () => ell(c, 0, 0, 20, 20), COL.steelDk, 5);
  c.beginPath(); ell(c, 0, 0, 108, 108); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  c.restore();
};
const wind = (c: Ctx) => {
  [[300, 1040], [370, 1040], [440, 1040], [510, 1000]].forEach(([y, x2], i) => {
    c.beginPath(); c.moveTo(250, y); for (let x = 250; x <= x2; x += 20) c.lineTo(x, y + Math.sin(x / 40 + i) * 9);
    c.strokeStyle = COL.blueDk; c.lineWidth = 8; c.lineCap = "round"; c.globalAlpha = 0.55; c.stroke(); c.globalAlpha = 1;
  });
};

// setup.e1.0
const card_e1_0 = (c: Ctx) => {
  counterTop(c, 400);
  [[300, 975, 0.2], [440, 990, -0.3], [580, 970, 0.5]].forEach(([x, y, r]) => cube(c, x, y, 80, r));
  [[760, 985], [830, 960], [900, 990], [980, 965]].forEach(([x, y]) => shape(c, () => polyP(c, [[x - 20, y], [x - 4, y - 22], [x + 18, y - 8], [x + 12, y + 14]]), ICE, 4));
  shadow(c, 560, 870, 400, 40);
  const tw = () => rrect(c, 170, 560, 740, 300, 36);
  shape(c, tw, COL.cloth, 6); shade(c, tw, "#cfc6b0", 30, 30, 0.5);
  c.save(); c.beginPath(); tw(); c.clip();
  for (let x = 230; x < 900; x += 90) line(c, [[x, 560], [x, 860]], 8, COL.blue);
  for (let y = 620; y < 860; y += 90) line(c, [[170, y], [910, y]], 8, COL.blue);
  c.restore();
  shape(c, tw, "rgba(0,0,0,0)", 6);
  const r = rnd(5); for (let i = 0; i < 8; i++) { c.beginPath(); ell(c, 250 + r() * 600, 640 + r() * 160, 40 + r() * 20, 22 + r() * 10); c.strokeStyle = INK; c.globalAlpha = 0.25; c.lineWidth = 4; c.stroke(); c.globalAlpha = 1; }
  // rolling pin
  shadow(c, 560, 600, 380, 26);
  shape(c, () => rrect(c, 210, 505, 110, 52, 20), COL.woodDk, 6); shape(c, () => rrect(c, 760, 505, 110, 52, 20), COL.woodDk, 6);
  const pin = () => rrect(c, 310, 470, 460, 120, 26);
  shape(c, pin, COL.wood, 6); shade(c, pin, COL.woodDk, 0, 38, 0.6);
  shine(c, [[350, 500], [700, 500]], 8);
  hand(c, 262, 380, Math.PI / 2, 1.3, SKIN.adult, CLOTH.adult, true);
  hand(c, 818, 380, Math.PI / 2, 1.3, SKIN.adult, CLOTH.adult, true);
  arrow(c, [[540, 250], [540, 420]]);
};

// setup.e1.1
const card_e1_1 = (c: Ctx) => {
  counterTop(c, 400);
  const x = 520, y = 770, r = 290;
  bowl(c, x, y, r, COL.soilDk);
  const rd = rnd(11);
  for (let i = 0; i < 16; i++) { const a = rd() * 6.28, d = Math.sqrt(rd()) * 0.8, px = x + Math.cos(a) * d * r, py = y + Math.sin(a) * d * r * 0.14; c.save(); c.translate(px, py); c.rotate(rd() * 3); c.scale(1.5, 1.5); shape(c, () => polyP(c, [[-24, 2], [-10, -20], [16, -14], [26, 6], [4, 18]]), ICE, 3); line(c, [[-12, -8], [4, -12]], 4, WHITE); c.restore(); }
  for (let i = 0; i < 14; i++) { const a = rd() * 6.28, d = Math.sqrt(rd()) * 0.85; shape(c, () => ell(c, x + Math.cos(a) * d * r, y + Math.sin(a) * d * r * 0.15, 12, 5, rd() * 3), COL.leafDk, 2.5); }
  // steel spoon pressing the mix down
  const hx = x, sp = () => ell(c, hx, y - 20, 110, 52), hd = () => rrect(c, hx - 18, 200, 36, y - 20 - 200, 14);
  shape(c, sp, COL.steel, 6); shade(c, sp, COL.steelDk, 36, 18, 0.6);
  shape(c, hd, COL.steel, 6); shade(c, hd, COL.steelDk, 12, 0, 0.6);
  hand(c, x - 105, 400, 0, 1.5, SKIN.child, CLOTH.child, false);
  arrow(c, [[740, 270], [740, 520]]);
  // snowflake: freeze overnight
  const sx = 900, sy = 190;
  for (let k = 0; k < 6; k++) {
    const a = k * Math.PI / 3, ex = sx + Math.cos(a) * 90, ey = sy + Math.sin(a) * 90;
    line(c, [[sx, sy], [ex, ey]], 18, INK); line(c, [[sx, sy], [ex, ey]], 9, COL.blue);
    for (const s of [-1, 1]) { const mx = sx + Math.cos(a) * 55, my = sy + Math.sin(a) * 55, bx = mx + Math.cos(a + s * 0.8) * 28, by = my + Math.sin(a + s * 0.8) * 28; line(c, [[mx, my], [bx, by]], 15, INK); line(c, [[mx, my], [bx, by]], 7, COL.blue); }
  }
};

// setup.e1.2
const card_e1_2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#fbe9ae"; c.fillRect(0, 0, 540, D); c.fillStyle = "#b9c4d8"; c.fillRect(540, 0, 540, D);
  line(c, [[540, 0], [540, D]], 8);
  // sun and its light
  c.beginPath(); c.moveTo(150, 140); c.lineTo(420, 560); c.lineTo(100, 560); c.closePath(); c.fillStyle = "rgba(255,240,170,0.55)"; c.fill();
  for (let k = 0; k < 10; k++) { const a = k * Math.PI / 5; line(c, [[150 + Math.cos(a) * 90, 120 + Math.sin(a) * 90], [150 + Math.cos(a) * 125, 120 + Math.sin(a) * 125]], 12, COL.orange); }
  shape(c, () => ell(c, 150, 120, 68, 68), COL.yellow, 6);
  // a leafy shade on the right
  [[780, 130, 90], [880, 150, 80], [830, 80, 70], [950, 110, 60]].forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r * 0.8), COL.leaf, 5));
  // sill and table
  shape(c, () => rrect(c, 30, 700, 490, 110, 12), COL.wood, 6); shape(c, () => rrect(c, 560, 700, 490, 110, 12), COL.brown, 6);
  const ball = (x: number) => {
    plate(c, x, 690, 230, 80);
    const b = () => ell(c, x, 585, 108, 108);
    shape(c, b, "#eaf3f8", 6); shade(c, b, ICEDK, 36, 36, 0.7);
    const rd = rnd(7); for (let i = 0; i < 26; i++) { const a = rd() * 6.28, d = Math.sqrt(rd()) * 0.85; shape(c, () => ell(c, x + Math.cos(a) * d * 108, 585 + Math.sin(a) * d * 108, 5 + rd() * 7, 4 + rd() * 5, rd() * 3), i % 3 ? COL.soilDk : COL.black, 0); }
    shine(c, [[x - 70, 540], [x - 40, 505]], 9);
    ruler(c, x + 150, 705, 5);
  };
  ball(260); ball(800);
};

// setup.e2.0
const card_e2_0 = (c: Ctx) => {
  ground(c);
  for (let i = 0; i < 6; i++) strip(c, 392 + i * 62, 600, 0.03 * (i - 2.5), 1, 340 + (i % 3) * 20, 54, TISSUE[i], i, 12);
  shadow(c, 560, 1030, 260, 24);
  pencil(c, 540, 80, 540, 480, 46);
  lemon(c, 540, 520, 200, 140);
  for (let i = 0; i < 6; i++) { const x = 392 + i * 62; c.save(); c.translate(x, 612); shape(c, () => rrect(c, -34, -18, 68, 36, 6), "rgba(255,255,255,0.7)", 4); c.restore(); }
};

// setup.e2.1
const card_e2_1 = (c: Ctx) => {
  ground(c); c.fillStyle = COUNTER; c.fillRect(0, 900, D, D - 900); line(c, [[0, 900], [D, 900]], 6);
  fan(c, 120, false);
  person(c, 330, 900, 640, { armR: [-0.15, -0.1] });
  handComet(c, 760, 419, 609, false);
  arrow(c, [[420, 990], [660, 990]]);
};

// setup.e2.2
const card_e2_2 = (c: Ctx) => {
  ground(c); c.fillStyle = COUNTER; c.fillRect(0, 900, D, D - 900); line(c, [[0, 900], [D, 900]], 6);
  fan(c, 120, true);
  wind(c);
  person(c, 330, 900, 640, { armR: [-0.15, -0.1] });
  handComet(c, 760, 419, 609, true);
  arrow(c, [[420, 990], [660, 990]]);
};

export const su_skyMoonsAsteroidsComets = cards("sci.sky.moons-asteroids-comets.L3 set-up", [card_e1_0, card_e1_1, card_e1_2, card_e2_0, card_e2_1, card_e2_2]);
