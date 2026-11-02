import type { Ctx } from "./core";
import { COL, INK, RED, SKIN, CLOTH, WHITE, arrow, cards, ell, ground, hand, line, person, polyP, rrect, shade, shadow, shape, shine, write, glass } from "./flatKit";

// IMMUNE SYSTEM L3 · picture cards. Flat DeepKids look. Germs: bacteria are purple rods, viruses are
// small red spiky balls; white blood cells are pale blobs with a purple nucleus; red blood cells are
// red discs. Red arrows = movement or change. No words.

const PUR = "#9a7ad1", PUR_DK = "#6f50ab", WB = "#f1ecfb", WB_DK = "#d3c8ec", NUC = "#a58bd6", VIR = "#e8584a", VIR_DK = "#b93a2d";
const SK = "#e9b48a", SK_DK = "#cf936a", PINK = "#f4a8a0", PINK_DK = "#e07f78";

// ---------------------------------------------------------------- pieces
const bact = (c: Ctx, x: number, y: number, len: number, wd: number, rot: number, a = 1) => {
  c.save(); c.globalAlpha = a; c.translate(x, y); c.rotate(rot);
  const p = () => rrect(c, -len / 2, -wd / 2, len, wd, wd / 2);
  shape(c, p, PUR, Math.max(3, wd * 0.1)); shade(c, p, PUR_DK, wd * 0.18, wd * 0.22, 0.5);
  for (const k of [-0.25, 0.1, 0.3]) { c.beginPath(); ell(c, len * k, -wd * 0.1, wd * 0.09, wd * 0.09); c.fillStyle = "#cdb9ee"; c.fill(); }
  c.restore();
};
const virus = (c: Ctx, x: number, y: number, r: number, a = 1) => {
  c.save(); c.globalAlpha = a;
  for (let k = 0; k < 12; k++) {
    const an = (k / 12) * Math.PI * 2, x1 = x + Math.cos(an) * r * 0.9, y1 = y + Math.sin(an) * r * 0.9, x2 = x + Math.cos(an) * r * 1.42, y2 = y + Math.sin(an) * r * 1.42;
    line(c, [[x1, y1], [x2, y2]], Math.max(3, r * 0.12), INK);
    shape(c, () => ell(c, x2, y2, r * 0.19, r * 0.19), VIR_DK, Math.max(2, r * 0.07));
  }
  const p = () => ell(c, x, y, r, r);
  shape(c, p, VIR, Math.max(3, r * 0.1)); shade(c, p, VIR_DK, r * 0.25, r * 0.28, 0.5);
  c.restore();
};
const wbc = (c: Ctx, x: number, y: number, r: number, a = 1) => {
  c.save(); c.globalAlpha = a;
  const p = () => ell(c, x, y, r, r * 0.94);
  shape(c, p, WB, Math.max(3.5, r * 0.07)); shade(c, p, WB_DK, r * 0.2, r * 0.22, 0.8);
  for (const [dx, dy] of [[-0.25, -0.1], [0.12, -0.18], [0.0, 0.2]]) shape(c, () => ell(c, x + dx * r, y + dy * r, r * 0.3, r * 0.27), NUC, Math.max(2.5, r * 0.05));
  c.restore();
};
const rbc = (c: Ctx, x: number, y: number, r: number, rot = 0) => {
  shape(c, () => ell(c, x, y, r, r * 0.8, rot), COL.red, Math.max(3, r * 0.1));
  c.beginPath(); ell(c, x, y, r * 0.5, r * 0.36, rot); c.fillStyle = "#c53f2a"; c.fill();
};
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water, ln = 5) => {
  shape(c, () => { c.moveTo(x, y - 1.5 * s); c.bezierCurveTo(x + 0.4 * s, y - 0.8 * s, x + s, y - 0.4 * s, x + s, y + 0.2 * s); c.bezierCurveTo(x + s, y + 0.9 * s, x - s, y + 0.9 * s, x - s, y + 0.2 * s); c.bezierCurveTo(x - s, y - 0.4 * s, x - 0.4 * s, y - 0.8 * s, x, y - 1.5 * s); c.closePath(); }, col, ln);
  line(c, [[x - s * 0.5, y + 0.1 * s], [x - s * 0.35, y + 0.5 * s]], Math.max(3, s * 0.14), WHITE);
};
const dot = (c: Ctx, x: number, y: number, r: number, col: string) => { shape(c, () => ell(c, x, y, r, r), col, Math.max(2, r * 0.3)); };
const cross = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - s, y - s], [x + s, y + s]], 12, RED); line(c, [[x + s, y - s], [x - s, y + s]], 12, RED); };
// a digital body thermometer standing upright: top-centre (x, y), width w; shows two digits
const thermo = (c: Ctx, x: number, y: number, w: number, val: string) => {
  const h = w * 5.2;
  shadow(c, x + w * 0.2, y + h + 6, w * 0.7, w * 0.12);
  const p = () => rrect(c, x - w / 2, y, w, h * 0.86, w * 0.4);
  shape(c, p, "#f4f7fa", 7); shade(c, p, "#c9d1dc", w * 0.14, 0, 0.7);
  shape(c, () => { c.moveTo(x - w * 0.28, y + h * 0.84); c.lineTo(x + w * 0.28, y + h * 0.84); c.lineTo(x + w * 0.12, y + h); c.lineTo(x - w * 0.12, y + h); c.closePath(); }, COL.steel, 6);
  shape(c, () => rrect(c, x - w * 0.38, y + h * 0.1, w * 0.76, h * 0.2, w * 0.1), "#22303a", 5);
  write(c, val, x - w * 0.34, y + h * 0.135, h * 0.095, "#c9f06b", 6); write(c, "°", x + w * 0.2, y + h * 0.125, h * 0.05, "#c9f06b", 5);
  dot(c, x, y + h * 0.5, w * 0.17, COL.teal);
};
const eyeShape = (c: Ctx, x: number, y: number, w: number, h: number) => { c.moveTo(x - w / 2, y); c.quadraticCurveTo(x, y - h * 1.7, x + w / 2, y); c.quadraticCurveTo(x, y + h * 1.7, x - w / 2, y); c.closePath(); };
const eye = (c: Ctx, x: number, y: number, w: number, h: number, ix = 0) => {
  shape(c, () => eyeShape(c, x, y, w, h), WHITE, 7);
  c.save(); c.beginPath(); eyeShape(c, x, y, w, h); c.clip();
  c.beginPath(); ell(c, x + ix, y, h * 0.62, h * 0.62); c.fillStyle = "#6b4426"; c.fill(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  c.beginPath(); ell(c, x + ix, y, h * 0.28, h * 0.28); c.fillStyle = INK; c.fill();
  c.beginPath(); ell(c, x + ix - h * 0.18, y - h * 0.2, h * 0.1, h * 0.1); c.fillStyle = WHITE; c.fill();
  c.restore();
  shape(c, () => eyeShape(c, x, y, w, h), "rgba(0,0,0,0)", 7);
};
// rows of skin tiles (flat dead cells), top-left (x, y), cols x rows
const tiles = (c: Ctx, x: number, y: number, cols: number, rows: number, tw: number, th: number, col = SK, dk = SK_DK) => {
  for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
    const tx = x + k * tw + (r % 2 ? tw / 2 : 0), ty = y + r * th, p = () => rrect(c, tx, ty, tw, th, th * 0.3);
    if (r % 2 && k === cols - 1) continue;
    shape(c, p, col, 4); shade(c, p, dk, tw * 0.06, th * 0.12, 0.6);
  }
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 10; k++) { const an = (k / 10) * Math.PI * 2; line(c, [[x + Math.cos(an) * r * 1.3, y + Math.sin(an) * r * 1.3], [x + Math.cos(an) * r * 1.75, y + Math.sin(an) * r * 1.75]], 8, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
const moon = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => { c.arc(x, y, r, Math.PI * 0.5, Math.PI * 1.5, true); c.quadraticCurveTo(x - r * 0.1, y, x, y + r); c.closePath(); }, "#f3e7a8", 6);
};
const paperBall = (c: Ctx, x: number, y: number, r: number) => {
  const p = () => polyP(c, Array.from({ length: 9 }, (_, k) => { const an = (k / 9) * Math.PI * 2, rr = r * (k % 2 ? 0.88 : 1); return [x + Math.cos(an) * rr, y + Math.sin(an) * rr]; }));
  shape(c, p, WHITE, 5); shade(c, p, "#d6d6e4", r * 0.22, r * 0.25, 0.9);
  line(c, [[x - r * 0.4, y - r * 0.3], [x + r * 0.1, y + r * 0.1], [x - r * 0.1, y + r * 0.5]], 3, COL.greyDk); line(c, [[x + r * 0.2, y - r * 0.5], [x + r * 0.5, y]], 3, COL.greyDk);
};
const cap = (c: Ctx, x: number, y: number, r: number, col: string = COL.blue) => {
  shape(c, () => polyP(c, Array.from({ length: 16 }, (_, k) => { const an = (k / 16) * Math.PI * 2, rr = r * (k % 2 ? 0.9 : 1); return [x + Math.cos(an) * rr, y + Math.sin(an) * rr]; })), col, 5);
  c.beginPath(); ell(c, x, y, r * 0.62, r * 0.62); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
};

// ---------------------------------------------------------------- 0 intro: germs landing on a hand, most bounce
const intro = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 880, 400, 36);
  hand(c, 480, 680, 0, 4, SKIN.child, CLOTH.child, true);
  bact(c, 420, 470, 90, 44, 0.3);
  virus(c, 640, 465, 28);
  bact(c, 740, 430, 80, 40, -0.4);
  bact(c, 330, 250, 100, 48, 0.9);
  virus(c, 580, 190, 34);
  arrow(c, [[330, 310], [380, 380]]);
  arrow(c, [[580, 260], [620, 360]]);
  arrow(c, [[745, 360], [800, 250]], COL.blueDk, 9);
  bact(c, 860, 190, 90, 44, 0.5);
};

// ---------------------------------------------------------------- 1 summary: a child inside a shield dome, germs outside
const summary = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 580, 430, 410), "rgba(191,224,245,0.55)", 10);
  shine(c, [[230, 380], [290, 270], [400, 200]], 14);
  shadow(c, 560, 930, 230, 30);
  person(c, 540, 920, 600);
  wbc(c, 250, 640, 62); wbc(c, 830, 600, 62); wbc(c, 330, 800, 50);
  bact(c, 100, 280, 110, 52, 0.7); virus(c, 130, 540, 36); virus(c, 990, 360, 36); bact(c, 980, 700, 110, 52, -0.6);
  arrow(c, [[150, 340], [200, 390]]); arrow(c, [[190, 540], [225, 545]]); arrow(c, [[940, 400], [905, 420]]); arrow(c, [[920, 690], [890, 670]]);
};

// ---------------------------------------------------------------- 2 e2: temperature through the day
const e2 = (c: Ctx) => {
  ground(c);
  const xs = [220, 540, 860];
  sun(c, xs[0], 190, 40);
  sun(c, xs[1], 190, 62);
  moon(c, xs[2], 190, 62);
  xs.forEach((x, i) => { thermo(c, x, 380, 130, ["36", "37", "37"][i]); });
  arrow(c, [[300, 960], [780, 960]]);
};

// ---------------------------------------------------------------- 3 e3: sticky tape and smooth tape catching dust
const e3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 130, 50, 820, 270, 14), "#bfe0f5", 8);
  line(c, [[540, 50], [540, 320]], 8); line(c, [[130, 185], [950, 185]], 8);
  shine(c, [[190, 110], [250, 90]], 12);
  const card = (x: number, specks: number, sticky: boolean) => {
    shadow(c, x + 170, 880, 190, 24);
    shape(c, () => rrect(c, x, 410, 340, 450, 14), "#fffaf0", 7);
    shape(c, () => rrect(c, x + 20, 480, 300, 300, 10), sticky ? "rgba(255,211,77,0.55)" : "rgba(214,236,250,0.6)", 6);
    if (sticky) for (let k = 0; k < 5; k++) line(c, [[x + 40, 510 + k * 60], [x + 90, 530 + k * 60], [x + 140, 510 + k * 60]], 4, "rgba(211,154,58,0.7)");
    else shine(c, [[x + 50, 520], [x + 120, 700]], 12);
    for (let k = 0; k < specks; k++) dot(c, x + 50 + ((k * 97) % 250), 505 + ((k * 61) % 250), 7 + (k % 3), COL.soilDk);
  };
  card(120, 34, true); card(620, 4, false);
  for (const [x, y] of [[280, 340], [420, 360], [700, 345], [820, 365]]) dot(c, x, y, 7, COL.soilDk);
  arrow(c, [[300, 370], [300, 400]]); arrow(c, [[800, 380], [800, 405]]);
};

// ---------------------------------------------------------------- 4 a1: onion tears
const a1 = (c: Ctx) => {
  ground(c);
  shadow(c, 290, 800, 220, 28);
  const on = () => { c.moveTo(290, 410); c.bezierCurveTo(60, 470, 60, 780, 290, 790); c.bezierCurveTo(520, 780, 520, 470, 290, 410); c.closePath(); };
  shape(c, on, "#fbe9ef", 8);
  c.save(); c.beginPath(); on(); c.clip();
  for (let k = 0; k < 4; k++) { c.beginPath(); ell(c, 290, 625, 190 - k * 45, 170 - k * 38); c.strokeStyle = "#c98aa6"; c.lineWidth = 7; c.stroke(); }
  c.restore();
  shape(c, on, "rgba(0,0,0,0)", 8);
  shape(c, () => polyP(c, [[270, 420], [310, 420], [320, 340], [290, 300], [260, 340]]), "#d9c9a0", 6);
  for (const [x, y, d] of [[470, 560, 0], [490, 620, 1], [470, 680, 2]]) line(c, [[x, y], [x + 40, y - 20 + d * 4], [x + 80, y + 14], [x + 120, y - 14]], 8, COL.greenLt);
  eye(c, 790, 490, 300, 80);
  for (let k = 0; k < 6; k++) line(c, [[650 + k * 56, 460 - Math.abs(k - 2.5) * 6], [640 + k * 58, 405 - Math.abs(k - 2.5) * 10]], 7);
  drop(c, 745, 640, 26); drop(c, 835, 720, 32); drop(c, 700, 790, 22);
};

// ---------------------------------------------------------------- 5 a2: look at your skin with a magnifier, tape flakes
const a2 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 900, 440, 30);
  shape(c, () => { c.moveTo(80, 560); c.quadraticCurveTo(540, 500, 1000, 560); c.lineTo(1000, 880); c.quadraticCurveTo(540, 900, 80, 880); c.closePath(); }, SKIN.child, 7);
  shade(c, () => { c.moveTo(80, 560); c.quadraticCurveTo(540, 500, 1000, 560); c.lineTo(1000, 880); c.quadraticCurveTo(540, 900, 80, 880); c.closePath(); }, SKIN.childDk, 0, 90, 0.5);
  line(c, [[640, 640], [800, 770]], 22, INK); line(c, [[640, 640], [800, 770]], 10, COL.wood);
  line(c, [[640, 640], [760, 750]], 40, INK); line(c, [[640, 640], [760, 750]], 26, "#7d5a3a");
  shape(c, () => ell(c, 420, 400, 270, 270), "#f6e2d0", 12);
  c.save(); c.beginPath(); ell(c, 420, 400, 262, 262); c.clip();
  tiles(c, 130, 140, 6, 8, 100, 60, "#f1c6a4", "#d9a47d");
  c.restore();
  shape(c, () => ell(c, 420, 400, 270, 270), "rgba(214,236,250,0.22)", 12);
  shine(c, [[230, 250], [290, 190]], 14);
  shape(c, () => polyP(c, [[760, 270], [940, 330], [920, 440], [740, 380]]), "rgba(214,236,250,0.8)", 5);
  for (const [x, y] of [[790, 320], [840, 340], [880, 370], [820, 380], [870, 410]]) shape(c, () => ell(c, x, y, 13, 8, 0.5), WHITE, 3);
};

// ---------------------------------------------------------------- 6 a3: sock-hand phagocyte eats paper germs; caps are body cells
const a3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 440, 120, 200, 14), CLOTH.child, 6);
  const sock = () => { c.moveTo(150, 460); c.lineTo(520, 460); c.quadraticCurveTo(700, 470, 700, 560); c.quadraticCurveTo(700, 640, 520, 630); c.lineTo(150, 620); c.closePath(); };
  shape(c, sock, COL.teal, 7); shade(c, sock, COL.tealDk, 0, 50, 0.6);
  for (const x of [250, 360, 470]) line(c, [[x, 462], [x, 624]], 22, COL.yellow);
  shape(c, () => rrect(c, 130, 450, 50, 180, 14), COL.tealDk, 6);
  arrow(c, [[700, 400], [790, 330]]);
  paperBall(c, 840, 270, 70); paperBall(c, 930, 440, 62); paperBall(c, 780, 520, 55);
  [[160, 850], [330, 870], [500, 850], [670, 870], [840, 850]].forEach(([x, y], i) => cap(c, x, y, 62, [COL.blue, COL.orange, COL.pink, COL.greenLt, COL.purple][i]));
  shadow(c, 500, 940, 420, 20);
};

// ---------------------------------------------------------------- 7 a4: open eye, closed eye, a clock
const a4 = (c: Ctx) => {
  ground(c);
  eye(c, 270, 300, 340, 90);
  shape(c, () => { c.moveTo(610, 330); c.quadraticCurveTo(780, 450, 950, 330); }, "rgba(0,0,0,0)", 0);
  line(c, [[610, 310], [780, 400], [950, 310]], 22, INK);
  for (let k = 0; k < 5; k++) line(c, [[640 + k * 70, 340 + Math.sin((k / 4) * Math.PI) * 60], [620 + k * 78, 390 + Math.sin((k / 4) * Math.PI) * 60]], 7);
  arrow(c, [[420, 200], [700, 200]]);
  shadow(c, 540, 960, 190, 24);
  shape(c, () => rrect(c, 505, 560, 70, 60, 10), COL.steel, 6);
  shape(c, () => ell(c, 540, 780, 180, 180), WHITE, 10);
  for (let k = 0; k < 12; k++) { const an = (k / 12) * Math.PI * 2; line(c, [[540 + Math.cos(an) * 150, 780 + Math.sin(an) * 150], [540 + Math.cos(an) * 128, 780 + Math.sin(an) * 128]], 6); }
  line(c, [[540, 780], [540, 660]], 9, INK); line(c, [[540, 780], [640, 780]], 9, RED);
  shape(c, () => ell(c, 540, 780, 14, 14), INK, 0);
  for (let k = 0; k < 4; k++) line(c, [[790 + k * 36, 700], [790 + k * 36, 860]], 10);
  line(c, [[770, 840], [920, 720]], 10, RED);
};

// ---------------------------------------------------------------- 8 a6: a drawing of what hides under a scraped knee
const a6 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 960, 400, 24);
  shape(c, () => rrect(c, 120, 90, 800, 830, 16), WHITE, 8);
  tiles(c, 150, 380, 6, 2, 60, 40, SK, SK_DK);
  tiles(c, 530, 380, 6, 2, 60, 40, SK, SK_DK);
  shape(c, () => rrect(c, 150, 465, 750, 90, 10), PINK, 5);
  shape(c, () => rrect(c, 150, 620, 750, 90, 45), "#f6c9c4", 6);
  for (const x of [220, 330, 790]) rbc(c, x, 665, 30);
  bact(c, 470, 215, 100, 48, 0.4); bact(c, 620, 190, 90, 44, -0.5); virus(c, 740, 270, 30);
  arrow(c, [[500, 270], [510, 340]]); arrow(c, [[640, 250], [600, 350]]);
  wbc(c, 540, 600, 55); wbc(c, 430, 600, 48);
  arrow(c, [[540, 560], [545, 480]]);
  line(c, [[780, 960], [960, 790]], 30, INK); line(c, [[780, 960], [960, 790]], 18, COL.yellow);
  shape(c, () => polyP(c, [[960, 790], [985, 765], [995, 800]]), "#f3d6a7", 4); shape(c, () => polyP(c, [[780, 960], [740, 975], [755, 925]]), "#f3d6a7", 4);
};

// ---------------------------------------------------------------- 9 p1: the body castle of cardboard
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 900, 460, 36);
  const CB = "#c99a62", CB_DK = "#a97a45";
  const block = (x: number, y: number, w: number, h: number) => { const p = () => rrect(c, x, y, w, h, 6); shape(c, p, CB, 7); shade(c, p, CB_DK, w * 0.08, 0, 0.6); };
  const crown = (x: number, y: number, w: number, n: number) => { const tw = w / (n * 2 - 1); for (let k = 0; k < n; k++) block(x + k * 2 * tw, y - 40, tw, 46); };
  block(260, 540, 560, 340); crown(260, 540, 560, 8);
  block(110, 340, 220, 540); crown(110, 340, 220, 3);
  block(750, 340, 220, 540); crown(750, 340, 220, 3);
  shape(c, () => { c.moveTo(450, 880); c.lineTo(450, 740); c.quadraticCurveTo(540, 650, 630, 740); c.lineTo(630, 880); c.closePath(); }, "#4b3a52", 7);
  line(c, [[540, 700], [540, 880]], 5, INK);
  line(c, [[540, 540], [540, 380]], 8); shape(c, () => polyP(c, [[540, 380], [650, 415], [540, 450]]), RED, 6);
  shape(c, () => ell(c, 860, 520, 62, 62), WHITE, 7);
  for (let k = 0; k < 9; k++) { const an = Math.PI * (0.8 + k * 0.17); line(c, [[860 + Math.cos(an) * 46, 520 + Math.sin(an) * 46], [860 + Math.cos(an) * 56, 520 + Math.sin(an) * 56]], 4); }
  line(c, [[860, 520], [900, 480]], 9, RED); dot(c, 860, 520, 9, INK);
  wbc(c, 220, 280, 44); wbc(c, 870, 280, 44);
  wbc(c, 400, 500, 38); wbc(c, 680, 500, 38);
  bact(c, 70, 760, 80, 38, 0.2); virus(c, 1010, 760, 28);
  cross(c, 70, 640, 28);
};

// ---------------------------------------------------------------- 10 c1: spray bottle sneeze, a card catches it
const c1 = (c: Ctx) => {
  ground(c);
  shadow(c, 220, 900, 170, 24);
  const body = () => rrect(c, 110, 560, 210, 330, 40);
  shape(c, body, COL.blue, 7); shade(c, body, COL.blueDk, 40, 0, 0.6);
  shape(c, () => rrect(c, 160, 500, 110, 80, 10), COL.steelDk, 6);
  shape(c, () => rrect(c, 130, 430, 260, 80, 24), COL.steel, 6);
  shape(c, () => polyP(c, [[390, 450], [440, 440], [440, 500], [390, 500]]), COL.steelDk, 6);
  line(c, [[280, 520], [300, 600]], 18, INK); line(c, [[280, 520], [300, 600]], 8, COL.steel);
  shape(c, () => rrect(c, 140, 660, 150, 120, 12), WHITE, 5);
  shape(c, () => polyP(c, [[455, 470], [720, 330], [720, 640]]), "rgba(143,195,234,0.35)", 0);
  const r = [[500, 470, 8], [560, 440, 7], [600, 500, 9], [650, 420, 7], [640, 540, 8], [560, 520, 6], [690, 480, 7], [500, 500, 6]];
  r.forEach(([x, y, s]) => drop(c, x, y, s, COL.water, 3));
  shadow(c, 800, 900, 120, 22);
  shape(c, () => rrect(c, 745, 280, 60, 40, 8), COL.steel, 0);
  shape(c, () => rrect(c, 735, 300, 40, 560, 12), COL.wood, 7);
  line(c, [[745, 330], [745, 800]], 4, COL.woodDk);
  shape(c, () => rrect(c, 735, 300, 40, 560, 12), "rgba(0,0,0,0)", 7);
  shape(c, () => rrect(c, 880, 560, 170, 330, 24), "rgba(255,255,255,0)", 0);
  for (const [x, y] of [[715, 360], [715, 450], [715, 520], [715, 600], [715, 400]]) drop(c, x, y, 6, COL.water, 3);
  drop(c, 880, 740, 6, COL.waterDk, 3);
  cross(c, 880, 620, 24);
  arrow(c, [[455, 700], [700, 700]]);
};

// ---------------------------------------------------------------- 11 c2: a banana with a cut, a bandage cover, flour and coloured water outside
const c2 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 820, 420, 30);
  const path = () => { c.moveTo(130, 520); c.quadraticCurveTo(540, 880, 950, 440); };
  c.lineCap = "round"; path(); c.strokeStyle = INK; c.lineWidth = 210; c.stroke();
  path(); c.strokeStyle = "#ffd34d"; c.lineWidth = 190; c.stroke();
  shape(c, () => rrect(c, 80, 460, 60, 90, 14), COL.brown, 6);
  shape(c, () => polyP(c, [[925, 400], [990, 380], [980, 450]]), COL.soilDk, 5);
  c.save(); c.translate(540, 700); c.rotate(-0.1);
  shape(c, () => rrect(c, -80, -170, 160, 330, 28), "#f4c9a0", 7);
  shape(c, () => rrect(c, -50, -70, 100, 130, 8), WHITE, 4);
  c.restore();
  for (const [x, y, w] of [[250, 600, 0], [330, 700, 1], [420, 770, 0], [690, 760, 1], [790, 690, 0], [850, 580, 1], [690, 620, 0], [380, 620, 1]]) { if (w) drop(c, x, y, 14, COL.waterDk, 4); else dot(c, x, y, 12, WHITE); }
  dot(c, 210, 280, 14, WHITE); dot(c, 280, 220, 12, WHITE); drop(c, 760, 330, 18, COL.waterDk);
  arrow(c, [[540, 270], [540, 400]]);
};

// ---------------------------------------------------------------- terms
// term.4 virus: a big bacterium and a much smaller virus
const t4 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 540, 440, 440), "#e5f2fb", 10);
  bact(c, 470, 470, 560, 230, -0.3);
  virus(c, 790, 790, 52);
  virus(c, 250, 780, 40);
  virus(c, 840, 300, 40);
};
// term.5 skin: roof-tile wall, germs on top cannot get in
const t5 = (c: Ctx) => {
  ground(c);
  tiles(c, 90, 400, 7, 3, 130, 82, SK, SK_DK);
  shape(c, () => rrect(c, 90, 646, 900, 230, 22), PINK, 6);
  rbc(c, 280, 770, 46); rbc(c, 540, 790, 46); rbc(c, 800, 760, 46);
  bact(c, 250, 320, 130, 60, 0.15); virus(c, 560, 330, 44); bact(c, 820, 320, 130, 60, -0.15);
  arrow(c, [[250, 220], [250, 280]]); arrow(c, [[560, 220], [560, 280]]); arrow(c, [[820, 220], [820, 280]]);
};
// term.7 tears: an eye with a shiny layer washing a speck to the corner
const t7 = (c: Ctx) => {
  ground(c);
  eye(c, 540, 480, 800, 210);
  c.save(); c.beginPath(); eyeShape(c, 540, 480, 800, 210); c.clip();
  shape(c, () => rrect(c, 120, 600, 840, 60, 30), "rgba(143,195,234,0.8)", 0); c.restore();
  line(c, [[200, 640], [880, 640]], 6, COL.waterDk);
  dot(c, 360, 560, 14, COL.soilDk);
  arrow(c, [[330, 580], [200, 590]]);
  for (let k = 0; k < 8; k++) { const x = 190 + k * 100, t = (x - 140) / 800, y = 480 - 714 * t * (1 - t) * 0.5 + 6; line(c, [[x, y], [x + (x - 540) * 0.08, y - 60]], 8); }
  drop(c, 170, 760, 36); drop(c, 250, 880, 26);
};
// term.10 white blood cell wraps a germ
const t10 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 930, 420, 30);
  const arm = (pts: number[][]) => { line(c, pts, 120, INK); line(c, pts, 100, WB); };
  arm([[360, 380], [560, 270], [770, 340]]); arm([[360, 700], [560, 810], [770, 740]]);
  wbc(c, 330, 540, 220);
  bact(c, 700, 540, 200, 96, Math.PI / 2);
  arrow(c, [[700, 150], [800, 190]]);
};
// term.14 scab cutaway
const t14 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 360, 960, 560, 20), "#f6c9c4", 7);
  shape(c, () => rrect(c, 60, 360, 330, 150, 14), SK, 7); shape(c, () => rrect(c, 690, 360, 330, 150, 14), SK, 7);
  shape(c, () => rrect(c, 390, 440, 300, 70, 14), PINK_DK, 6);
  shape(c, () => { c.moveTo(340, 420); c.bezierCurveTo(360, 230, 720, 230, 740, 420); c.lineTo(690, 450); c.lineTo(390, 450); c.closePath(); }, "#7a3b2a", 7);
  shade(c, () => { c.moveTo(340, 420); c.bezierCurveTo(360, 230, 720, 230, 740, 420); c.lineTo(690, 450); c.lineTo(390, 450); c.closePath(); }, "#4f2418", 30, 0, 0.5);
  for (const x of [480, 600]) arrow(c, [[x, 640], [x, 560]]);
  rbc(c, 220, 680, 40); rbc(c, 540, 800, 40); rbc(c, 860, 690, 40);
};
// term.16 thermometer
const t16 = (c: Ctx) => {
  ground(c);
  thermo(c, 540, 130, 150, "37");
};
// term.12 inflammation: a finger, a splinter, red swollen skin, blood flowing in
const t12 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 960, 280, 28);
  const fg = () => rrect(c, 340, 160, 400, 800, 190);
  shape(c, fg, SKIN.child, 8); shade(c, fg, SKIN.childDk, 40, 40, 0.5);
  shape(c, () => ell(c, 540, 520, 160, 140), "#e5584a", 7);
  c.save(); c.translate(540, 520); c.rotate(0.9);
  shape(c, () => rrect(c, -20, -230, 40, 280, 6), "#e8c78a", 5); c.restore();
  for (const [x, y, x2, y2] of [[230, 340, 360, 440], [850, 340, 720, 440], [230, 700, 380, 610], [850, 700, 700, 610]]) arrow(c, [[x, y], [x2, y2]]);
  for (const [x, y] of [[150, 300], [930, 300], [160, 740], [930, 740]]) drop(c, x, y, 24, COL.red);
};
// term.9 stomach acid
const t9 = (c: Ctx) => {
  ground(c);
  const st = () => { c.moveTo(380, 160); c.bezierCurveTo(480, 120, 520, 220, 640, 280); c.bezierCurveTo(900, 330, 1000, 600, 800, 820); c.bezierCurveTo(600, 980, 250, 880, 220, 620); c.bezierCurveTo(200, 440, 300, 380, 360, 300); c.closePath(); };
  shape(c, st, PINK, 9);
  c.save(); c.beginPath(); st(); c.clip();
  c.beginPath(); c.rect(0, 540, D(), 600); c.fillStyle = "#c9e86b"; c.fill(); c.restore();
  shape(c, st, "rgba(0,0,0,0)", 9);
  c.save(); c.beginPath(); st(); c.clip(); line(c, [[0, 540], [200, 520], [420, 560], [640, 520], [900, 550], [1080, 530]], 8, "#8fb83a"); c.restore();
  for (const [x, y, r] of [[420, 700, 30], [560, 640, 22], [680, 740, 34], [520, 800, 20], [770, 640, 20], [340, 780, 18]]) { c.beginPath(); ell(c, x, y, r, r); c.fillStyle = "rgba(255,255,255,0.7)"; c.fill(); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
  bact(c, 480, 600, 90, 42, 0.4, 0.45); virus(c, 650, 620, 26, 0.45); bact(c, 640, 780, 90, 42, -0.3, 0.45);
  cross(c, 480, 600, 20); cross(c, 650, 620, 18);
  arrow(c, [[350, 180], [400, 260]]);
};
const D = () => 1080;
// term.6 mucus: sticky layer trapping dust and a germ, hairs sweeping
const t6 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 700, 960, 260, 20), PINK, 7);
  for (let k = 0; k < 11; k++) { const x = 110 + k * 85; line(c, [[x, 700], [x + 10, 600], [x + 40, 540]], 14, INK); line(c, [[x, 700], [x + 10, 600], [x + 40, 540]], 6, PINK_DK); }
  shape(c, () => { c.moveTo(60, 620); c.quadraticCurveTo(540, 480, 1020, 620); c.lineTo(1020, 705); c.lineTo(60, 705); c.closePath(); }, "rgba(143,195,234,0.6)", 6);
  shine(c, [[180, 640], [330, 600]], 12);
  for (const [x, y] of [[300, 640], [470, 600], [680, 610], [850, 640]]) dot(c, x, y, 13, COL.soilDk);
  bact(c, 560, 650, 80, 38, 0.2);
  for (const [x, y] of [[230, 260], [500, 200], [770, 280]]) { dot(c, x, y, 13, COL.soilDk); arrow(c, [[x, y + 40], [x, y + 140]]); }
  virus(c, 900, 220, 34); arrow(c, [[900, 290], [900, 390]]);
  for (const x of [390, 790]) dot(c, x, 380, 14, COL.soilDk);
};
// term.15 fever: child in bed with a thermometer and water
const t15 = (c: Ctx) => {
  ground(c);
  shadow(c, 480, 900, 420, 28);
  shape(c, () => rrect(c, 70, 610, 800, 280, 20), COL.wood, 7);
  shape(c, () => rrect(c, 70, 440, 90, 450, 20), COL.woodDk, 7);
  shape(c, () => rrect(c, 160, 600, 220, 90, 40), WHITE, 6);
  const hx = 270, hy = 570;
  shape(c, () => ell(c, hx, hy, 105, 110), SKIN.child, 7);
  shape(c, () => { c.moveTo(hx - 106, hy - 5); c.bezierCurveTo(hx - 100, hy - 160, hx + 100, hy - 160, hx + 106, hy - 5); c.quadraticCurveTo(hx, hy - 60, hx - 106, hy - 5); c.closePath(); }, CLOTH.hair, 5);
  line(c, [[hx - 55, hy + 10], [hx - 30, hy + 5]], 6); line(c, [[hx + 30, hy + 5], [hx + 55, hy + 10]], 6);
  line(c, [[hx - 25, hy + 55], [hx, hy + 45], [hx + 25, hy + 55]], 5);
  shape(c, () => rrect(c, 300, 640, 570, 240, 36), COL.teal, 7); shade(c, () => rrect(c, 300, 640, 570, 240, 36), COL.tealDk, 0, 40, 0.6);
  for (const x of [380, 500, 620, 740]) line(c, [[x, 650], [x, 870]], 6, COL.tealDk);
  for (const x of [220, 270, 320]) line(c, [[x, 400], [x + 25, 360], [x, 320], [x + 25, 280]], 7, RED);
  thermo(c, 930, 220, 110, "38");
  glass(c, 700, 440, 110, 150, 0.7);
};

// ---------------------------------------------------------------- explanations
// expl.0 the fort: outer wall, defenders, memory at the centre
const x0 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 540, 470, 470), "#a97a45", 8);
  for (let k = 0; k < 18; k++) { const an = (k / 18) * Math.PI * 2; shape(c, () => ell(c, 540 + Math.cos(an) * 480, 540 + Math.sin(an) * 480, 34, 34), "#c99a62", 6); }
  shape(c, () => ell(c, 540, 540, 410, 410), "#dff0fb", 8);
  for (let k = 0; k < 6; k++) { const an = (k / 6) * Math.PI * 2 + 0.3; wbc(c, 540 + Math.cos(an) * 300, 540 + Math.sin(an) * 300, 62); }
  shape(c, () => ell(c, 540, 540, 190, 190), "#fff3c4", 8);
  shape(c, () => rrect(c, 430, 450, 220, 180, 12), COL.blue, 7);
  line(c, [[540, 450], [540, 630]], 6);
  for (const y of [490, 530, 570]) { line(c, [[460, y], [520, y]], 5, WHITE); line(c, [[560, y], [620, y]], 5, WHITE); }
};
// expl.3 blood vessel: red cells, a white cell squeezing through the wall toward a germ
const x3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 30, 190, 1020, 330, 40), "#fadad5", 8);
  c.save(); c.beginPath(); rrect(c, 30, 190, 1020, 330, 40); c.clip();
  c.fillStyle = "#fadad5"; c.fillRect(560, 480, 160, 80); c.restore();
  shape(c, () => rrect(c, 30, 190, 1020, 330, 40), "rgba(0,0,0,0)", 0);
  line(c, [[30, 520], [560, 520]], 8); line(c, [[720, 520], [1050, 520]], 8);
  line(c, [[560, 520], [560, 540]], 8);
  for (const [x, y, r] of [[130, 300, 58], [300, 400, 58], [220, 260, 50], [830, 290, 58], [950, 400, 54], [420, 300, 54], [680, 270, 54]]) rbc(c, x, y, r, 0.3);
  wbc(c, 640, 400, 90);
  wbc(c, 640, 640, 75);
  shape(c, () => rrect(c, 570, 475, 140, 60, 10), "#fadad5", 0);
  bact(c, 640, 900, 160, 70, 0.2);
  arrow(c, [[640, 730], [640, 810]]);
};
// expl.5 heat knob turned up, a shivering child under a blanket
const x5 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 600, 250, 24);
  shape(c, () => ell(c, 540, 350, 250, 250), "#f4f7fa", 10);
  for (let k = 0; k <= 10; k++) { const an = Math.PI * (0.8 + k * 0.14), long = k === 2 || k === 6; line(c, [[540 + Math.cos(an) * 225, 350 + Math.sin(an) * 225], [540 + Math.cos(an) * (long ? 180 : 197), 350 + Math.sin(an) * (long ? 180 : 197)]], long ? 10 : 6); }
  write(c, "37", 310, 330, 56, INK, 8); write(c, "38", 640, 330, 56, INK, 8);
  const an = -Math.PI * 0.4;
  line(c, [[540, 350], [540 + Math.cos(an) * 170, 350 + Math.sin(an) * 170]], 20, INK); line(c, [[540, 350], [540 + Math.cos(an) * 170, 350 + Math.sin(an) * 170]], 10, RED);
  dot(c, 540, 350, 22, INK);
  arrow(c, [[400, 70], [540, 50], [670, 90]]);
  person(c, 540, 1040, 420);
  shape(c, () => rrect(c, 430, 770, 220, 190, 40), COL.teal, 7);
  for (const [x, y] of [[390, 720], [690, 720]]) line(c, [[x, y], [x - 15, y + 25], [x, y + 50], [x - 15, y + 75]], 7, RED);
};
// expl.12 sleep, food, play, washing: four small pictures
const x12 = (c: Ctx) => {
  ground(c);
  const panel = (x: number, y: number, col: string, f: () => void) => { c.save(); c.translate(x, y); shape(c, () => rrect(c, 0, 0, 480, 480, 28), col, 8); c.save(); c.beginPath(); rrect(c, 0, 0, 480, 480, 28); c.clip(); f(); c.restore(); c.restore(); };
  panel(50, 50, "#dfe3f7", () => {
    moon(c, 390, 100, 50);
    shape(c, () => rrect(c, 30, 280, 420, 170, 20), COL.blue, 7);
    shape(c, () => rrect(c, 40, 230, 180, 90, 40), WHITE, 6);
    shape(c, () => ell(c, 130, 255, 62, 66), SKIN.child, 6); shape(c, () => { c.moveTo(68, 250); c.bezierCurveTo(72, 170, 190, 170, 192, 250); c.quadraticCurveTo(130, 205, 68, 250); c.closePath(); }, CLOTH.hair, 5);
    line(c, [[100, 260], [118, 266]], 5); line(c, [[145, 266], [163, 260]], 5);
    shape(c, () => rrect(c, 130, 300, 320, 150, 20), COL.teal, 6);
  });
  panel(550, 50, "#fbecc8", () => {
    shape(c, () => ell(c, 240, 260, 200, 150), COL.steel, 8); shape(c, () => ell(c, 240, 258, 168, 120), COL.steelIn, 4);
    [[170, 230, COL.orange], [300, 220, COL.greenLt], [240, 310, COL.red], [175, 305, COL.yellow], [310, 300, COL.purple]].forEach(([x, y, k]) => dot(c, x as number, y as number, 40, k as string));
    shape(c, () => rrect(c, 60, 60, 80, 20, 10), "rgba(0,0,0,0)", 0);
  });
  panel(50, 550, "#d9efe0", () => {
    sun(c, 390, 90, 40);
    line(c, [[0, 430], [480, 430]], 8);
    person(c, 230, 430, 360, { armL: [Math.PI * 0.9, Math.PI * 1.1], armR: [Math.PI * 0.1, -Math.PI * 0.1] });
    arrow(c, [[60, 300], [-40 + 100, 300]]);
  });
  panel(550, 550, "#d9ecf8", () => {
    shape(c, () => rrect(c, 40, 380, 140, 70, 24), COL.pink, 6);
    hand(c, 20, 250, 0.15, 1.7, SKIN.child, CLOTH.child); hand(c, 460, 290, Math.PI - 0.15, 1.7, SKIN.adult, CLOTH.adult);
    for (const [x, y, r] of [[160, 160, 28], [250, 130, 22], [350, 170, 30], [200, 330, 18], [320, 340, 24], [400, 260, 16]]) { shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.85)", 5); }
    drop(c, 420, 400, 26); drop(c, 360, 440, 20);
  });
};

export const ic_bodyImmuneSystemL3 = cards("sci.body.immune-system.L3 cards", [
  intro, summary, e2, e3, a1, a2, a3, a4, a6, p1, c1, c2,
  t4, t5, t7, t10, t14, t16, t12, t9, t6, t15, x0, x3, x5, x12,
]);
// slot order: intro summary flow.e2 flow.e3 flow.a1 flow.a2 flow.a3 flow.a4 flow.a6 flow.p1 flow.c1 flow.c2
//   term.4 term.5 term.7 term.10 term.14 term.16 term.12 term.9 term.6 term.15 expl.0 expl.3 expl.5 expl.12
