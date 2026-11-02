import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, SKIN, WHITE, arrow, cards, ell, ground, hand, line, person, polyP, rnd, rrect, shade, shadow, shape, shine, write } from "./flatKit";
import type { Pose } from "./flatKit";

const WALL = "#f6e9cf", FLOOR = "#e6d3ab", TABLE = "#d9a866", TABLEDK = "#b98648", PAPERDK = "#e6dcc3", GRASS = "#cfe3a8", NIGHT = "#2f3b4a";

const room = (c: Ctx, fy = 800) => { ground(c, WALL); c.fillStyle = FLOOR; c.fillRect(0, fy, 1080, 1080 - fy); line(c, [[0, fy], [1080, fy]], 5); };
// numbers centred on (cx, cy)
const num = (c: Ctx, t: string, cx: number, cy: number, h: number, col: string = INK, w = 6) => {
  let tw = 0; for (let i = 0; i < t.length; i++) tw += t[i] === " " ? h * 0.35 : i === t.length - 1 ? h * 0.6 : h * 0.8;
  write(c, t, cx - tw / 2, cy - h / 2, h, col, w);
};
const wrist = (x: number, y: number, h: number, side: -1 | 1, [a1, a2]: [number, number]) => {
  const sx = x + side * h * 0.11, sy = y - h * 0.74 + h * 0.03, ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};
const tick = (c: Ctx, x: number, y: number, s: number, col = COL.green) => line(c, [[x - s * 0.5, y], [x - s * 0.12, y + s * 0.42], [x + s * 0.55, y - s * 0.45]], s * 0.2, col);
const cross = (c: Ctx, x: number, y: number, s: number, col = RED) => { line(c, [[x - s * 0.4, y - s * 0.4], [x + s * 0.4, y + s * 0.4]], s * 0.2, col); line(c, [[x + s * 0.4, y - s * 0.4], [x - s * 0.4, y + s * 0.4]], s * 0.2, col); };

const clock = (c: Ctx, x: number, y: number, r: number, wrong = false, hands = true) => {
  shadow(c, x + r * 0.1, y + r * 1.02, r * 0.9, r * 0.1);
  shape(c, () => ell(c, x, y, r, r), WHITE, 7);
  shape(c, () => ell(c, x, y, r * 0.9, r * 0.9), "#fbf7ee", 3);
  for (let k = 1; k <= 12; k++) {
    let a = (k / 12) * Math.PI * 2 - Math.PI / 2, rr = r * 0.72, t = String(k);
    if (wrong) { if ([2, 5, 8, 11].includes(k)) continue; if (k === 7) t = "1"; if (k === 10) { a += 0.25; } }
    num(c, t, x + Math.cos(a) * rr, y + Math.sin(a) * rr, r * 0.17, INK, Math.max(2.5, r * 0.035));
  }
  if (hands) { line(c, [[x, y], [x + r * 0.05, y - r * 0.42]], r * 0.07); line(c, [[x, y], [x + r * 0.32, y + r * 0.1]], r * 0.07); shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), INK, 0); }
};
const bubble = (c: Ctx, x: number, y: number, w: number, h: number, tx: number, ty: number, fill: string = WHITE) => {
  const ey = ty > y ? y + h / 2 : y - h / 2, bx = Math.max(x - w / 2 + 40, Math.min(x + w / 2 - 40, x + (tx - x) * 0.4));
  shape(c, () => { c.moveTo(bx - 18, ey); c.lineTo(tx, ty); c.lineTo(bx + 18, ey); c.closePath(); }, fill, 6);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, Math.min(h * 0.32, 40)), fill, 6);
  shape(c, () => rrect(c, bx - 14, ey + (ty > y ? -9 : -1), 28, 10, 0), fill, 0);
};
const phone = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, w * 0.1, h / 2 + 8, w * 0.6, 12);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, w * 0.14), COL.black, 6);
  shape(c, () => rrect(c, -w / 2 + 9, -h / 2 + 22, w - 18, h - 44, 8), "#e9f3ff", 3);
  c.restore();
};
const slip = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0, col: string = WHITE) => { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 6), col, 5); c.restore(); };
const textLines = (c: Ctx, x: number, y: number, w: number, n: number, gap: number, col = COL.greyDk) => { for (let i = 0; i < n; i++) line(c, [[x, y + i * gap], [x + (i === n - 1 ? w * 0.6 : w), y + i * gap]], 6, col); };
const magnifier = (c: Ctx, x: number, y: number, r: number) => {
  line(c, [[x + r * 0.7, y + r * 0.7], [x + r * 1.6, y + r * 1.6]], r * 0.34, INK); line(c, [[x + r * 0.7, y + r * 0.7], [x + r * 1.6, y + r * 1.6]], r * 0.34 - 10, COL.woodDk);
  shape(c, () => ell(c, x, y, r, r), "rgba(214,236,250,0.7)", 8); shine(c, [[x - r * 0.6, y - r * 0.1], [x - r * 0.2, y - r * 0.6]], 8);
};
const ruler = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 6), COL.wood, 5);
  for (let i = 0; i <= 12; i++) line(c, [[-w / 2 + 14 + i * ((w - 28) / 12), -h / 2], [-w / 2 + 14 + i * ((w - 28) / 12), -h / 2 + (i % 5 === 0 ? 20 : 12)]], 3);
  c.restore();
};
const table = (c: Ctx, y: number) => { shape(c, () => rrect(c, -20, y, 1120, 40, 0), TABLE, 6); c.fillStyle = TABLEDK; c.fillRect(0, y + 40, 1080, 1080 - y); line(c, [[0, y + 40], [1080, y + 40]], 5); };
const pencil = (c: Ctx, x: number, y: number, len: number, rot: number, col: string) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, 0, -10, len, 20, 4), col, 4); shape(c, () => polyP(c, [[len, -10], [len + 26, 0], [len, 10]]), "#f2d9a8", 4); shape(c, () => polyP(c, [[len + 17, -3.5], [len + 26, 0], [len + 17, 3.5]]), INK, 2);
  c.restore();
};
const notebook = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, 14, h / 2 + 6, w / 2, 14);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 8), WHITE, 6);
  line(c, [[-w / 2 + 40, -h / 2 + 6], [-w / 2 + 40, h / 2 - 6]], 3, RED);
  c.restore();
};
const tallyMarks = (c: Ctx, x: number, y: number, n: number, h = 56, col = INK) => {
  let cx = x;
  for (let i = 0; i < n; i++) { if (i % 5 === 4) { line(c, [[cx - 4 * 14 - 4, y + h * 0.8], [cx - 6, y + h * 0.15]], 6, col); cx += 18; } else { line(c, [[cx, y], [cx, y + h]], 6, col); cx += 14; } }
};
const dal = (c: Ctx, x: number, y: number, r: number, kind: "chana" | "moong", rot = 0) => {
  if (kind === "chana") { shape(c, () => ell(c, x, y, r, r * 0.88, rot), "#ecd3a0", Math.max(2, r * 0.2)); line(c, [[x - r * 0.3, y - r * 0.2], [x + r * 0.2, y - r * 0.3]], Math.max(2, r * 0.14), "#c9a468"); }
  else { shape(c, () => ell(c, x, y, r, r * 0.7, rot), COL.green, Math.max(2, r * 0.2)); line(c, [[x - r * 0.4, y - r * 0.1], [x + r * 0.4, y - r * 0.1]], Math.max(1.5, r * 0.15), "#f4f1e4"); }
};
// a clear jar of dal in layers (bottom first); returns nothing
const jar = (c: Ctx, x: number, y: number, w: number, h: number, layers: ["chana" | "moong", number][], seedN = 3) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.62, 16);
  const body = () => { rrect(c, x - w / 2, y - h, w, h, 30); };
  shape(c, body, "#f3f8fb", 0);
  c.save(); c.beginPath(); body(); c.clip();
  const r = rnd(seedN); let by = y;
  for (const [k, f] of layers) {
    const ly = by - h * f; c.fillStyle = k === "chana" ? "#f1dcae" : "#8fbf5a"; c.fillRect(x - w / 2, ly, w, by - ly);
    const gr = k === "chana" ? 17 : 11;
    for (let yy = ly + gr; yy < by; yy += gr * 1.5) for (let xx = x - w / 2 + gr; xx < x + w / 2 - gr / 2; xx += gr * 2.1) dal(c, xx + r() * 8 - 4 + ((yy / gr) % 2) * 8, yy + r() * 6 - 3, gr, k, r() * 3);
    line(c, [[x - w / 2, ly], [x + w / 2, ly]], 4, INK); by = ly;
  }
  c.restore();
  shape(c, body, "rgba(214,236,250,0.28)", 7);
  shape(c, () => ell(c, x, y - h, w / 2, 20), "rgba(255,255,255,0.35)", 5);
  shine(c, [[x - w * 0.36, y - h * 0.85], [x - w * 0.36, y - h * 0.2]], 9);
};
const spoon = (c: Ctx, x: number, y: number, rot: number, s = 1, grains: "chana" | "moong" | null = null) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  line(c, [[0, 0], [260, 0]], 22, INK); line(c, [[0, 0], [260, 0]], 12, COL.steel);
  shape(c, () => ell(c, -34, 0, 54, 34), COL.steel, 6); shape(c, () => ell(c, -34, 0, 38, 22), COL.steelIn, 3);
  if (grains) for (let i = 0; i < 6; i++) dal(c, -58 + (i % 3) * 22, -10 + Math.floor(i / 3) * 18, 10, grains, i);
  c.restore();
};

const crow = (c: Ctx, x: number, y: number, s: number, flip = false) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  shadow(c, 10, 4, 90, 12);
  line(c, [[-10, -40], [-14, -4]], 8); line(c, [[20, -40], [24, -4]], 8);
  shape(c, () => polyP(c, [[-50, -70], [-150, -40], [-140, -20], [-40, -50]]), COL.black, 6);
  shape(c, () => ell(c, 0, -80, 78, 48, -0.25), COL.black, 6);
  shade(c, () => ell(c, 0, -80, 78, 48, -0.25), "#1f1a26", 20, 22, 0.6);
  shape(c, () => ell(c, 20, -78, 42, 24, -0.2), "#524a5c", 0);
  shape(c, () => ell(c, 62, -128, 34, 32), COL.black, 6);
  shape(c, () => polyP(c, [[88, -138], [148, -118], [90, -108]]), "#5a5260", 5);
  shape(c, () => ell(c, 66, -134, 8, 8), WHITE, 3); shape(c, () => ell(c, 68, -134, 3.5, 3.5), INK, 0);
  c.restore();
};
const snail = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 20, 4, 150, 12);
  shape(c, () => { c.moveTo(-130, 0); c.quadraticCurveTo(-140, -40, -90, -50); c.lineTo(80, -50); c.quadraticCurveTo(140, -90, 150, -150); c.quadraticCurveTo(150, -165, 135, -150); c.quadraticCurveTo(130, -100, 100, -80); c.quadraticCurveTo(170, -50, 170, 0); c.closePath(); }, "#d8c19a", 6);
  line(c, [[145, -150], [158, -190]], 7); line(c, [[132, -145], [124, -190]], 7);
  shape(c, () => ell(c, 158, -196, 9, 9), INK, 0); shape(c, () => ell(c, 124, -196, 9, 9), INK, 0);
  shape(c, () => ell(c, -20, -110, 90, 85), COL.brown, 7); shade(c, () => ell(c, -20, -110, 90, 85), COL.soilDk, 24, 24, 0.55);
  c.beginPath(); c.arc(-20, -110, 20, 0, Math.PI * 1.5); c.arc(-20, -110, 48, Math.PI * 1.5, Math.PI * 3.2); c.strokeStyle = COL.soilDk; c.lineWidth = 7; c.lineCap = "round"; c.stroke();
  c.restore();
};
const goldfish = (c: Ctx, x: number, y: number, s: number, flip = false) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  shape(c, () => polyP(c, [[-50, 0], [-110, -42], [-100, 0], [-110, 42]]), COL.orange, 5);
  shape(c, () => ell(c, 0, 0, 62, 42), COL.orange, 6); shade(c, () => ell(c, 0, 0, 62, 42), COL.red, 14, 16, 0.45);
  shape(c, () => polyP(c, [[-10, -38], [18, -70], [30, -34]]), COL.yellow, 4);
  shape(c, () => ell(c, 34, -8, 10, 10), WHITE, 3); shape(c, () => ell(c, 36, -8, 4, 4), INK, 0);
  line(c, [[56, 10], [48, 14]], 4);
  c.restore();
};
const horse = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 0, 6, 200, 16);
  const leg = (lx: number, bend = false) => { const p: number[][] = bend ? [[lx, -150], [lx + 20, -85], [lx + 100, -75]] : [[lx, -150], [lx, -4]]; line(c, p, 38, INK); line(c, p, 26, COL.brown); const e = p[p.length - 1]; shape(c, () => ell(c, e[0] + (bend ? 6 : 4), e[1] + (bend ? 0 : -4), 20, 12), COL.soilDk, 4); };
  leg(-110); leg(-60);
  shape(c, () => polyP(c, [[-150, -230], [-210, -130], [-190, -60], [-170, -200]]), COL.soilDk, 6);
  shape(c, () => ell(c, 0, -210, 160, 80), COL.brown, 7); shade(c, () => ell(c, 0, -210, 160, 80), COL.soil, 22, 30, 0.45);
  leg(70); leg(120, true);
  shape(c, () => polyP(c, [[90, -260], [150, -380], [225, -360], [170, -230]]), COL.brown, 7);
  shape(c, () => polyP(c, [[90, -260], [140, -380], [165, -375], [125, -250]]), COL.soilDk, 5);
  shape(c, () => ell(c, 230, -350, 70, 38, 0.55), COL.brown, 7);
  shape(c, () => polyP(c, [[158, -385], [168, -430], [190, -385]]), COL.brown, 5);
  shape(c, () => ell(c, 262, -330, 12, 8, 0.5), COL.soilDk, 0);
  shape(c, () => ell(c, 210, -362, 8, 8), INK, 0);
  c.restore();
};

// ---- the 26 pictures --------------------------------------------------------------------------------------------
// 0 summary: a girl with a clipboard checks the wall clock while her grandmother points at it
const summary = (c: Ctx) => {
  room(c, 830); clock(c, 540, 270, 150);
  person(c, 720, 960, 620, { adult: true, armL: [-2.3, -2.3], armR: [1.3, 1.4] });
  const g: Pose = { armR: [0.6, -0.7], armL: [0.5, 0.5] };
  person(c, 300, 960, 520, g);
  const [wx, wy] = wrist(300, 960, 520, 1, g.armR!);
  slip(c, wx + 30, wy - 10, 170, 210, 0.08, "#fff");
  shape(c, () => rrect(c, wx - 15, wy - 130, 90, 26, 6), COL.steelDk, 4);
  tick(c, wx + 6, wy - 40, 56); cross(c, wx + 6, wy + 40, 46);
  line(c, [[wx + 36, wy - 40], [wx + 90, wy - 40]], 6, COL.greyDk); line(c, [[wx + 36, wy + 40], [wx + 90, wy + 40]], 6, COL.greyDk);
};
// 1 e1: ask someone how sure they are, write it down with colours
const e1 = (c: Ctx) => {
  room(c, 780);
  person(c, 270, 940, 560, { adult: true, armR: [0.1, -1.2], armL: [0.5, 0.5] });
  bubble(c, 330, 250, 330, 200, 300, 400);
  clock(c, 330, 250, 78, false, true);
  const g: Pose = { armL: [0.7, -0.6], armR: [0.5, 0.5] };
  person(c, 760, 940, 500, g);
  const [wx, wy] = wrist(760, 940, 500, -1, g.armL!);
  notebook(c, wx - 40, wy - 20, 170, 200, -0.1);
  tick(c, wx - 55, wy - 60, 46); line(c, [[wx - 20, wy - 60], [wx + 10, wy - 60]], 6, COL.greyDk);
  pencil(c, 560, 980, 140, -0.1, COL.green); pencil(c, 560, 1030, 140, 0.0, COL.yellow); pencil(c, 780, 1030, 140, 0.05, RED);
};
// 2 e2: the jar of layered dal and a spoon dipping into the top
const e2 = (c: Ctx) => {
  room(c, 860);
  jar(c, 450, 900, 340, 560, [["moong", 0.5], ["chana", 0.5]], 5);
  spoon(c, 440, 350, -0.4, 1.1, "chana");
  c.save(); shape(c, () => ell(c, 880, 880, 150, 50), COL.steel, 6); shape(c, () => ell(c, 880, 876, 125, 38), COL.steelIn, 3); for (let i = 0; i < 5; i++) dal(c, 830 + i * 24, 876 + (i % 2) * 8, 14, "chana", i); c.restore();
  arrow(c, [[640, 300], [760, 480], [820, 700]]);
};
// 3 a1: a snail and a crow, and a length of string
const a1 = (c: Ctx) => {
  ground(c, "#e7f1d8"); c.fillStyle = GRASS; c.fillRect(0, 700, 1080, 380); line(c, [[0, 700], [1080, 700]], 5);
  snail(c, 290, 860, 1.25); crow(c, 770, 840, 1.9);
  // string coiled
  const sx = 540, sy = 990; for (let i = 0; i < 3; i++) { c.beginPath(); ell(c, sx, sy, 90 - i * 10, 24 - i * 3); c.strokeStyle = INK; c.lineWidth = 14; c.stroke(); c.strokeStyle = COL.yellow; c.lineWidth = 7; c.stroke(); }
};
// 4 a2: a message on a phone, and the three questions as pictures
const a2 = (c: Ctx) => {
  room(c, 1200);
  phone(c, 230, 400, 300, 560);
  bubble(c, 230, 330, 230, 130, 230, 360, "#d8f1d0"); textLines(c, 150, 310, 160, 2, 30);
  bubble(c, 230, 500, 200, 90, 230, 540, WHITE); textLines(c, 160, 490, 140, 1, 30);
  // says who: a person
  const ic = (x: number, y: number) => shape(c, () => rrect(c, x - 130, y - 130, 260, 260, 40), "#fff", 6);
  ic(700, 200); person(c, 700, 300, 220, { adult: true });
  arrow(c, [[420, 330], [520, 250], [560, 220]]);
  ic(700, 520); magnifier(c, 680, 500, 50);
  slip(c, 740, 540, 90, 70, 0.1, "#fff"); textLines(c, 710, 530, 60, 2, 22);
  arrow(c, [[400, 430], [520, 500], [560, 520]]);
  ic(700, 840); c.save(); c.globalAlpha = 0.8; c.setLineDash([16, 14]); c.beginPath(); ell(c, 700, 790, 40, 42); c.strokeStyle = COL.greyDk; c.lineWidth = 7; c.stroke();
  c.beginPath(); c.moveTo(640, 910); c.quadraticCurveTo(650, 840, 700, 840); c.quadraticCurveTo(750, 840, 760, 910); c.stroke(); c.restore();
  arrow(c, [[380, 560], [480, 700], [560, 800]]);
};
// 5 a3: Clever Hans taps his hoof while a man watches the number slip
const a3 = (c: Ctx) => {
  ground(c, "#e9e0cc"); c.fillStyle = "#d9c9a3"; c.fillRect(0, 800, 1080, 280); line(c, [[0, 800], [1080, 800]], 5);
  horse(c, 560, 940, 1.5);
  person(c, 160, 960, 560, { adult: true, armR: [0.3, -0.5], armL: [0.6, 0.6] });
  const [wx, wy] = wrist(160, 960, 560, 1, [0.3, -0.5]);
  slip(c, wx + 30, wy - 80, 120, 150, 0.1, "#fff"); num(c, "5", wx + 30, wy - 80, 70, INK, 8);
};
// 6 a4: three bowls of spice and a tally sheet
const a4 = (c: Ctx) => {
  room(c, 1200); ground(c, WALL); table(c, 640);
  const sp = (x: number, col: string, dk: string) => {
    shadow(c, x + 14, 640, 100, 14);
    shape(c, () => { c.moveTo(x - 100, 560); c.bezierCurveTo(x - 95, 660, x + 95, 660, x + 100, 560); c.closePath(); }, COL.steel, 6);
    shape(c, () => { c.moveTo(x - 92, 560); c.bezierCurveTo(x - 60, 470, x + 60, 470, x + 92, 560); c.closePath(); }, col, 5);
    shade(c, () => { c.moveTo(x - 92, 560); c.bezierCurveTo(x - 60, 470, x + 60, 470, x + 92, 560); c.closePath(); }, dk, 22, 8, 0.5);
    shape(c, () => ell(c, x, 560, 104, 18), "rgba(223,229,236,0.0)", 5);
  };
  sp(210, COL.yellow, COL.orange); sp(500, RED, "#a3281d"); sp(790, "#4a3a35", "#2a2020");
  // survey sheet
  slip(c, 540, 870, 560, 300, 0, "#fff");
  for (let r = 0; r < 3; r++) { const y = 790 + r * 80; shape(c, () => ell(c, 340, y, 28, 24), [COL.yellow, RED, "#4a3a35"][r], 4); tallyMarks(c, 410, y - 28, [3, 6, 1][r] + (r === 1 ? 0 : 0)); }
  line(c, [[390, 740], [390, 1010]], 4, COL.greyDk);
};
// 7 a5: a message whispered down a line: it changes on the way
const a5 = (c: Ctx) => {
  room(c, 840);
  const xs = [150, 410, 670, 930], msgs = ["12", "12", "17", "7"];
  xs.forEach((x, i) => { person(c, x, 920, 330, { adult: i % 2 === 1, armL: [Math.PI * 0.55, Math.PI * 0.5] }); bubble(c, x, 260 + (i % 2) * 40, 190, 130, x + 10, 520 + (i % 2) * 40); num(c, msgs[i], x, 260 + (i % 2) * 40, 64, i === 3 ? RED : INK, 8); });
  arrow(c, [[200, 140], [320, 140], [380, 140]], RED, 8); arrow(c, [[460, 140], [580, 140], [640, 140]], RED, 8); arrow(c, [[720, 140], [840, 140], [900, 140]], RED, 8);
};
// 8 p1: a crow at the window and a week of ticks
const p1 = (c: Ctx) => {
  ground(c, "#cfe6f5");
  shape(c, () => rrect(c, 70, 90, 440, 500, 14), WHITE, 8); shape(c, () => rrect(c, 100, 120, 380, 440, 6), "#bfe0f5", 5);
  line(c, [[290, 120], [290, 560]], 8); line(c, [[100, 340], [480, 340]], 8);
  shape(c, () => rrect(c, 40, 590, 500, 40, 8), COL.woodDk, 6);
  crow(c, 290, 592, 1.3, false);
  // week grid
  shape(c, () => rrect(c, 560, 200, 470, 600, 24), "#fff", 6);
  for (let i = 0; i < 7; i++) { const y = 240 + i * 78; shape(c, () => rrect(c, 590, y, 130, 58, 10), "#f6e9cf", 4); shape(c, () => rrect(c, 740, y, 130, 58, 10), "#f6e9cf", 4); shape(c, () => rrect(c, 890, y, 110, 58, 10), "#f6e9cf", 4); }
  const yes = [1, 0, 1, 0, 0, 1, 0], guest = [1, 0, 0, 1, 0, 1, 0];
  for (let i = 0; i < 7; i++) { const y = 269 + i * 78; if (yes[i]) tick(c, 655, y, 36); else cross(c, 655, y, 30, COL.greyDk); if (guest[i]) tick(c, 805, y, 36); else cross(c, 805, y, 30, COL.greyDk); num(c, String(i + 1), 945, y, 34, INK, 5); }
  // little crow and little door above the columns
  crow(c, 655, 190, 0.35, false);
  shape(c, () => rrect(c, 780, 120, 50, 70, 8), COL.wood, 5);
  // guest at the door below
  person(c, 300, 1040, 380, { adult: true });
};
// 9 c1: a shelf at one height that everybody can reach
const c1 = (c: Ctx) => {
  room(c, 900);
  person(c, 200, 900, 640, { adult: true, armL: [-1.9, -1.9], armR: [1.2, 1.5] });
  person(c, 470, 900, 400, { armL: [-1.9, -1.9], armR: [1.2, 1.5] });
  person(c, 760, 900, 330, { armL: [-1.9, -1.9], armR: [1.2, 1.5] });
  shape(c, () => rrect(c, 640, 556, 380, 24, 4), COL.wood, 6); shape(c, () => polyP(c, [[690, 580], [720, 580], [690, 625]]), COL.woodDk, 4); shape(c, () => polyP(c, [[970, 580], [940, 580], [970, 625]]), COL.woodDk, 4);
  for (let i = 0; i < 3; i++) shape(c, () => rrect(c, 760 + i * 80, 500, 56, 56, 8), [COL.red, COL.yellow, COL.green][i], 5);
};
// 10 c2: a check card stops a forwarded message
const c2 = (c: Ctx) => {
  room(c, 1200);
  phone(c, 260, 520, 320, 600);
  bubble(c, 260, 440, 240, 130, 260, 480, "#d8f1d0"); textLines(c, 175, 420, 170, 2, 30);
  // the card, held by a hand
  slip(c, 700, 480, 400, 520, -0.06, "#fff9e0");
  const rows = [0, 1, 2];
  rows.forEach((i) => { const y = 330 + i * 130; shape(c, () => ell(c, 560, y, 36, 36), "#fff", 5); line(c, [[630, y], [800, y]], 6, COL.greyDk); });
  tick(c, 560, 330, 40); tick(c, 560, 460, 40); tick(c, 560, 590, 40);
  // stop sign between
  shape(c, () => polyP(c, [[580, 860], [650, 830], [740, 830], [810, 860], [810, 950], [740, 980], [650, 980], [580, 950]]), RED, 6);
  line(c, [[620, 905], [770, 905]], 16, WHITE);
};
// terms
const t0 = (c: Ctx) => {
  room(c, 900);
  bubble(c, 300, 330, 400, 250, 380, 560); num(c, "12", 300, 330, 120, INK, 14);
  clock(c, 770, 560, 190);
};
const t1 = (c: Ctx) => {
  room(c, 1200);
  clock(c, 500, 460, 320);
  hand(c, 880, 760, -2.15, 2.4, SKIN.child, CLOTH.child, true);
};
const t2 = (c: Ctx) => {
  room(c, 1200);
  phone(c, 280, 540, 380, 700);
  bubble(c, 280, 470, 290, 190, 280, 520, "#d8f1d0"); textLines(c, 180, 435, 200, 3, 34);
  person(c, 800, 900, 600, { adult: true, armL: [0.5, 0.5], armR: [0.4, -0.4] });
  arrow(c, [[490, 480], [560, 400], [650, 360]], RED, 12);
};
const t3 = (c: Ctx) => {
  ground(c, "#e9dcc0"); c.fillStyle = "#f3e5c4"; c.fillRect(0, 0, 1080, 1080);
  const steps = 6, sx0 = 70, sw = 160, sh = 110, base = 1000;
  for (let i = 0; i < steps; i++) { const x = sx0 + i * sw, top = base - (i + 1) * sh; shape(c, () => polyP(c, [[x, top], [x + sw, top], [x + sw, base], [x, base]]), i % 2 ? "#cfc3a8" : "#d9ceb4", 6); shade(c, () => polyP(c, [[x, top], [x + sw, top], [x + sw, base], [x, base]]), "#a89c80", 0, 14, 0.4); }
  for (let i = 0; i < steps; i++) { const x = sx0 + i * sw + sw / 2, top = base - (i + 1) * sh; num(c, String(i + 1), x + 40, top - 50, 74, INK, 9); }
  const g: Pose = { armL: [0.9, 0.9], armR: [0.4, 0.8] };
  person(c, sx0 + 2 * sw + 45, base - 3 * sh, 400, g);
};
const t4 = (c: Ctx) => {
  room(c, 1200);
  person(c, 540, 860, 560, { adult: true, armL: [2.2, 1.9], armR: [0.4, -1.3] });
  // thumbs-up: a happy face is the base; stove in front
  shadow(c, 560, 1000, 400, 40);
  shape(c, () => polyP(c, [[250, 790], [830, 790], [950, 960], [130, 960]]), COL.steel, 6);
  shade(c, () => polyP(c, [[250, 790], [830, 790], [950, 960], [130, 960]]), COL.steelDk, 0, 30, 0.35);
  shape(c, () => polyP(c, [[130, 960], [950, 960], [950, 1040], [130, 1040]]), COL.steelDk, 6);
  [[360, 840], [720, 840], [320, 920], [760, 920]].forEach(([x, y], i) => { const s = i > 1 ? 1.1 : 0.8; shape(c, () => ell(c, x, y, 85 * s, 26 * s), COL.black, 6); shape(c, () => ell(c, x, y, 50 * s, 14 * s), "#6a6470", 4); shape(c, () => ell(c, x, y, 18 * s, 6 * s), COL.steelIn, 0); });
  [200, 400, 600, 800].forEach((x) => shape(c, () => ell(c, x + 20, 1000, 24, 24), COL.black, 5));
};
const t5 = (c: Ctx) => {
  room(c, 1200);
  jar(c, 400, 980, 520, 800, [["moong", 0.5], ["chana", 0.5]], 9);
  spoon(c, 380, 250, -0.5, 1.3, "chana");
};
const t6 = (c: Ctx) => {
  room(c, 1200);
  person(c, 130, 760, 560, { adult: true, armL: [0.5, 0.5], armR: [-1.4, -1.4] });
  person(c, 390, 760, 560, { adult: true, armL: [-1.4, -1.4], armR: [0.5, 0.5] });
  person(c, 650, 780, 400, { armL: [0.5, 0.5], armR: [0.5, 0.5] });
  person(c, 890, 780, 400, { armL: [0.5, 0.5], armR: [0.5, 0.5] });
  table(c, 760);
  [250, 540, 830].forEach((x, i) => { shape(c, () => ell(c, x, 800, 90, 20), COL.steel, 5); });
  bubble(c, 300, 120, 220, 110, 300, 180); num(c, "7", 300, 120, 58, INK, 8);
};
const t7 = (c: Ctx) => {
  ground(c, "#cfe6f5");
  shape(c, () => ell(c, 540, 600, 360, 340), "rgba(214,236,250,0.5)", 8); shape(c, () => ell(c, 540, 650, 346, 290), "rgba(143,195,234,0.55)", 0);
  shape(c, () => rrect(c, 330, 250, 420, 40, 12), "rgba(255,255,255,0.45)", 6);
  goldfish(c, 500, 620, 1.3, false);
  arrow(c, [[420, 740], [560, 760], [660, 740]], RED, 10);
  shape(c, () => rrect(c, 700, 130, 120, 130, 20), COL.teal, 6);
  [[770, 330], [740, 400], [790, 450], [760, 510]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 12, 8), COL.yellow, 3));
  shape(c, () => rrect(c, 370, 900, 340, 60, 20), "#d9c9a3", 6);
};
// explanations
const x0 = (c: Ctx) => {
  room(c, 880);
  bubble(c, 300, 180, 320, 170, 340, 330); num(c, "7", 300, 180, 90, INK, 11);
  for (let i = 0; i < 7; i++) { const x = 90 + (i % 4) * 140 + (i > 3 ? 70 : 0), y = i > 3 ? 560 : 400; shape(c, () => rrect(c, x, y, 110, 140, 10), "#bfe0f5", 6); line(c, [[x + 55, y], [x + 55, y + 140]], 4); }
  const g: Pose = { armL: [0.6, 0.0], armR: [0.5, -0.4] };
  person(c, 790, 960, 480, g);
  slip(c, 930, 520, 220, 320, 0.08, "#fff"); tallyMarks(c, 860, 440, 7, 70);
};
const x1 = (c: Ctx) => {
  room(c, 1200);
  // memory drawing on paper
  slip(c, 270, 440, 440, 520, -0.04, "#fff"); clock(c, 270, 440, 160, true, true);
  clock(c, 790, 440, 160);
  person(c, 540, 1070, 420, { armL: [0.6, 0.6], armR: [0.6, 0.6] });
  tick(c, 790, 790, 80);
  cross(c, 270, 790, 70, RED);
};
const x2 = (c: Ctx) => {
  room(c, 1200);
  const xs = [150, 400, 650, 900], msgs = ["12", "12", "17", "7"];
  xs.forEach((x, i) => { phone(c, x, 600, 190, 330, 0.08); num(c, msgs[i], x, 600, 56, i === 3 ? RED : INK, 7); });
  arrow(c, [[200, 400], [260, 360], [320, 360]], RED, 8); arrow(c, [[450, 400], [510, 360], [570, 360]], RED, 8); arrow(c, [[700, 400], [760, 360], [820, 360]], RED, 8);
  [150, 400, 650, 900].forEach((x, i) => person(c, x, 1070, 260, { adult: i % 2 === 1 }));
};
const x3 = (c: Ctx) => {
  ground(c, WALL);
  shape(c, () => rrect(c, 40, 240, 480, 640, 30), "#d8f1d0", 7);
  magnifier(c, 230, 460, 90); ruler(c, 300, 740, 360, 60, -0.1); tick(c, 420, 470, 90);
  shape(c, () => rrect(c, 560, 240, 480, 640, 30), "#e6e2de", 7);
  [[740, 400], [900, 360], [840, 540], [680, 620], [920, 680]].forEach(([x, y], i) => { shape(c, () => ell(c, x, y, 70, 50), "#fff", 5); shape(c, () => polyP(c, [[x - 20, y + 40], [x - 30, y + 80], [x + 10, y + 46]]), "#fff", 5); line(c, [[x - 30, y - 5], [x + 30, y - 5]], 5, COL.greyDk); line(c, [[x - 20, y + 15], [x + 20, y + 15]], 5, COL.greyDk); });
};
const x4 = (c: Ctx) => {
  room(c, 900);
  shape(c, () => rrect(c, 40, 140, 600, 700, 40), "#d9e8f2", 7);
  shape(c, () => rrect(c, 80, 780, 540, 60, 8), COL.black, 6);
  shape(c, () => rrect(c, 90, 330, 150, 460, 30), COL.red, 7);
  const dummy = (x: number, y: number, s: number, seated: boolean) => {
    const th = 230 * s, lw = 62 * s;
    if (seated) { const lp = [[x, y], [x + 200 * s, y - 6 * s], [x + 215 * s, y + 80 * s]]; line(c, lp, lw + 10, INK); line(c, lp, lw - 2, COL.yellow); }
    else { const lp = [[x, y], [x, y + 190 * s]]; line(c, lp, lw + 10, INK); line(c, lp, lw - 2, COL.yellow); }
    shape(c, () => rrect(c, x - 60 * s, y - th, 120 * s, th + 20 * s, 34 * s), COL.yellow, 7);
    line(c, [[x - 40 * s, y - th + 20 * s], [x + 50 * s, y - 10 * s]], 14 * s, COL.black);
    const hy = y - th - 62 * s, hr = 55 * s;
    shape(c, () => ell(c, x, hy, hr, hr), COL.yellow, 7);
    c.save(); c.beginPath(); ell(c, x, hy, hr, hr); c.clip(); c.fillStyle = INK; c.fillRect(x - hr, hy - hr, hr, hr); c.fillRect(x, hy, hr, hr); c.restore();
    c.beginPath(); ell(c, x, hy, hr, hr); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
  };
  dummy(210, 760, 1.2, true);
  dummy(850, 700, 0.9, false);
};
const x5 = (c: Ctx) => {
  room(c, 1200);
  shape(c, () => rrect(c, 100, 40, 880, 1000, 40), "#f4f7f8", 8); shade(c, () => rrect(c, 100, 40, 880, 1000, 40), "#c9d1dc", 40, 0, 0.5);
  shape(c, () => rrect(c, 140, 420, 36, 230, 18), COL.steelDk, 5);
  slip(c, 570, 520, 700, 760, 0.0, "#fff");
  line(c, [[220, 520], [920, 520]], 5, COL.greyDk);
  crow(c, 300, 480, 0.8, false); person(c, 470, 470, 260, { adult: true }); tallyMarks(c, 600, 350, 3, 100);
  crow(c, 300, 790, 0.8, false); shape(c, () => rrect(c, 420, 590, 100, 180, 10), COL.wood, 5); cross(c, 470, 680, 80, RED); tallyMarks(c, 580, 640, 13, 100);
};
const x6 = (c: Ctx) => {
  room(c, 1200);
  table(c, 700);
  person(c, 170, 700, 520, { adult: true, armL: [0.3, -1.2], armR: [0.8, 0.5] });
  person(c, 540, 690, 380, { armL: [0.6, 0.5], armR: [0.6, 0.3] });
  person(c, 900, 700, 520, { adult: true, armL: [0.8, 0.5], armR: [0.2, -1.4] });
  notebook(c, 540, 760, 380, 150, 0.0);
  tallyMarks(c, 420, 735, 7, 50);
  line(c, [[420, 790], [640, 790]], 5, COL.greyDk);
  bubble(c, 190, 150, 190, 110, 180, 220); num(c, "1", 190, 150, 54, INK, 8);
  bubble(c, 880, 150, 190, 110, 890, 220); num(c, "2", 880, 150, 54, RED, 8);
};
const x7 = (c: Ctx) => {
  ground(c, "#cfe6f5"); c.fillStyle = "#c8c3b8"; c.fillRect(0, 800, 1080, 280); line(c, [[0, 800], [1080, 800]], 5);
  // train on tracks
  shape(c, () => rrect(c, 0, 520, 1080, 160, 0), "#4a6fb0", 0);
  shape(c, () => rrect(c, 20, 480, 820, 260, 40), COL.blue, 7);
  shade(c, () => rrect(c, 20, 480, 820, 260, 40), COL.blueDk, 0, 60, 0.4);
  [80, 280, 480, 680].forEach((x) => shape(c, () => rrect(c, x, 520, 130, 100, 14), "#dcf0ff", 5));
  shape(c, () => rrect(c, 840, 560, 220, 180, 30), COL.yellow, 7);
  [150, 330, 560, 760, 950].forEach((x) => shape(c, () => ell(c, x, 750, 34, 34), COL.black, 6));
  // timetable
  shape(c, () => rrect(c, 30, 40, 560, 380, 24), NIGHT, 8);
  ["6 40", "7 15", "8 05"].forEach((t, i) => { const y = 120 + i * 100; num(c, t, 190, y, 52, "#fff3b8", 8); line(c, [[300, y], [380, y]], 8, "#fff"); shape(c, () => ell(c, 490, y, 22, 22), "#fff3b8", 0); });
  clock(c, 800, 200, 130);
  // girl
  person(c, 260, 1060, 460, { armL: [0.9, -0.9], armR: [0.5, 0.5] });
};

export const ic_howWeKnowQuestioningEvidenceL3 = cards("sci.how-we-know.questioning-evidence.L3 cards", [
  summary, e1, e2, a1, a2, a3, a4, a5, p1, c1, c2, t0, t1, t2, t3, t4, t5, t6, t7, x0, x1, x2, x3, x4, x5, x6, x7,
]);
