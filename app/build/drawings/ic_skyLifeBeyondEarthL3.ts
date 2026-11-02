import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, glass, plate, write, cards } from "./flatKit";

// sci.sky.life-beyond-earth.L3 · picture cards (cover, activities, terms, explanations).
// Child and grown-up are the same as on the set-up cards.

const ICE = "#e9f6fc", ICEDK = "#a9cfe6", NIGHT = "#2c3a68", PINK = "#f29ab4", MICRO = "#e4523b", TAN = "#d8b48f", TANDK = "#b48c66";

const icecube = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => rrect(c, x - s / 2, y - s / 2, s, s, s * 0.14);
  shape(c, p, ICE); shade(c, p, ICEDK, s * 0.12, s * 0.12, 0.7);
  shine(c, [[x - s * 0.3, y - s * 0.12], [x - s * 0.3, y + s * 0.25]], Math.max(5, s * 0.06));
};
const flake = (c: Ctx, x: number, y: number, r: number, col: string = COL.blueDk, w = 7) => {
  for (let k = 0; k < 3; k++) { const a = (k * Math.PI) / 3, dx = Math.cos(a) * r, dy = Math.sin(a) * r; line(c, [[x - dx, y - dy], [x + dx, y + dy]], w, col); }
  for (let k = 0; k < 6; k++) { const a = (k * Math.PI) / 3, bx = x + Math.cos(a) * r * 0.65, by = y + Math.sin(a) * r * 0.65; line(c, [[bx + Math.cos(a + 0.9) * r * 0.25, by + Math.sin(a + 0.9) * r * 0.25], [bx, by], [bx + Math.cos(a - 0.9) * r * 0.25, by + Math.sin(a - 0.9) * r * 0.25]], w * 0.7, col); }
};
const steam = (c: Ctx, x: number, y: number, h: number, n = 3, gap = 55) => {
  for (let k = 0; k < n; k++) { const sx = x + (k - (n - 1) / 2) * gap, pts: number[][] = []; for (let i = 0; i <= 10; i++) pts.push([sx + Math.sin(i * 0.9 + k) * 16, y - (h * i) / 10]); line(c, pts, 16, INK); line(c, pts, 8, WHITE); }
};
const thermo = (c: Ctx, x: number, top: number, bot: number, level: number, w = 46) => {
  shape(c, () => ell(c, x, bot + 8, w * 0.85, w * 0.85), WHITE, 6);
  shape(c, () => rrect(c, x - w / 2, top, w, bot - top, w / 2), WHITE, 6);
  c.beginPath(); ell(c, x, bot + 8, w * 0.6, w * 0.6); c.fillStyle = RED; c.fill();
  c.fillStyle = RED; c.fillRect(x - w * 0.17, level, w * 0.34, bot + 8 - level);
  for (let y = top + 30; y < bot - 20; y += 40) line(c, [[x - w / 2 - 6, y], [x - w / 2 - 26, y]], 4);
};
const microbe = (c: Ctx, x: number, y: number, L: number, W: number, rot: number, col: string = MICRO) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -L / 2, -W / 2, L, W, W / 2), col, Math.max(3, W * 0.12));
  line(c, [[-L * 0.28, -W * 0.15], [-L * 0.06, -W * 0.15]], Math.max(3, W * 0.14), WHITE);
  c.restore();
};
const zoom = (c: Ctx, x: number, y: number, r: number, fill: string, inside: () => void) => {
  shape(c, () => ell(c, x, y, r, r), fill, 0);
  c.save(); c.beginPath(); ell(c, x, y, r - 4, r - 4); c.clip(); inside(); c.restore();
  c.beginPath(); ell(c, x, y, r, r); c.lineWidth = 9; c.strokeStyle = INK; c.stroke();
};
const moon = (c: Ctx, x: number, y: number, r: number) => {
  const p = () => ell(c, x, y, r, r);
  shape(c, p, "#f1f4f7"); shade(c, p, "#c3cfdc", r * 0.3, r * 0.3, 0.8);
  c.save(); c.beginPath(); p(); c.clip();
  const K: number[][][] = [[[-1, -0.3], [-0.4, -0.1], [0.1, -0.5], [0.8, -0.3]], [[-0.6, 0.6], [-0.2, 0.2], [0.3, 0.3], [0.9, 0.1]], [[0.2, -1], [0.1, -0.4], [0.4, 0.2], [0.2, 0.9]], [[-0.8, 0.1], [-0.5, 0.5], [-0.6, 0.9]]];
  K.forEach((k) => line(c, k.map(([u, v]) => [x + u * r, y + v * r]), Math.max(4, r * 0.05), "#b0764d"));
  c.restore(); c.beginPath(); p(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 10; k++) { const a = (k * Math.PI) / 5; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 9); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
};
const stars = (c: Ctx, seed: number, n: number, x0: number, y0: number, x1: number, y1: number) => {
  const r = rnd(seed);
  for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), s = 3 + r() * 5; c.beginPath(); ell(c, x, y, s, s); c.fillStyle = r() > 0.6 ? COL.yellow : WHITE; c.fill(); }
};
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) =>
  shape(c, () => { c.moveTo(x, y - s * 1.3); c.bezierCurveTo(x + s * 0.2, y - s * 0.6, x + s, y - s * 0.2, x + s, y + s * 0.3); c.arc(x, y + s * 0.3, s, 0, Math.PI); c.bezierCurveTo(x - s, y - s * 0.2, x - s * 0.2, y - s * 0.6, x, y - s * 1.3); c.closePath(); }, col, 6);
const tardi = (c: Ctx, x: number, y: number, s: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  for (const sd of [-1, 1]) for (let k = 0; k < 4; k++) { const ly = -62 + k * 44; shape(c, () => ell(c, sd * 78, ly, 28, 17, sd * 0.35), TANDK, 5); line(c, [[sd * 98, ly + 6], [sd * 108, ly + 14]], 4); }
  const b = () => ell(c, 0, 0, 74, 115);
  shape(c, b, TAN); shade(c, b, TANDK, 28, 20, 0.6);
  for (let k = 0; k < 4; k++) line(c, [[-60, -55 + k * 40], [0, -45 + k * 40], [60, -55 + k * 40]], 3, TANDK);
  shape(c, () => ell(c, 0, -122, 36, 30), TAN, 5);
  shape(c, () => ell(c, -12, -128, 5, 6), INK, 0); shape(c, () => ell(c, 12, -128, 5, 6), INK, 0);
  c.restore();
};
const pot = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x - w / 2 - 55, y - h * 0.8, 70, 26, 10), COL.steelDk); shape(c, () => rrect(c, x + w / 2 - 15, y - h * 0.8, 70, 26, 10), COL.steelDk);
  const p = () => rrect(c, x - w / 2, y - h, w, h, 18);
  shape(c, p, COL.steel); shade(c, p, COL.steelDk, w * 0.12, 0, 0.6);
  shape(c, () => ell(c, x, y - h, w / 2, h * 0.14), COL.water, 6);
};
const flame = (c: Ctx, x: number, y: number, s: number) => shape(c, () => { c.moveTo(x, y - s); c.quadraticCurveTo(x + s * 0.8, y - s * 0.2, x + s * 0.4, y); c.quadraticCurveTo(x, y + s * 0.15, x - s * 0.4, y); c.quadraticCurveTo(x - s * 0.8, y - s * 0.2, x, y - s); c.closePath(); }, COL.orange, 5);
const alien = (c: Ctx, x: number, y: number, s: number, kind: number) => {
  const col = ["#7fcf6a", "#7fb4f0", "#d79af2"][kind % 3];
  if (kind === 1) { shape(c, () => ell(c, x, y, s * 0.55, s * 0.85), col); [-1, 1].forEach((d) => shape(c, () => ell(c, x + d * s * 0.2, y - s * 0.1, s * 0.16, s * 0.24), WHITE, 5)); shape(c, () => ell(c, x, y + s * 0.4, s * 0.12, s * 0.08), INK, 0); [-1, 1].forEach((d) => { line(c, [[x + d * s * 0.2, y - s * 0.85], [x + d * s * 0.4, y - s * 1.2]]); shape(c, () => ell(c, x + d * s * 0.4, y - s * 1.2, s * 0.09, s * 0.09), col, 4); }); return; }
  if (kind === 2) { for (let k = 0; k < 4; k++) line(c, [[x - s * 0.5 + k * s * 0.33, y + s * 0.3], [x - s * 0.6 + k * s * 0.4, y + s * 0.9]], 14, INK), line(c, [[x - s * 0.5 + k * s * 0.33, y + s * 0.3], [x - s * 0.6 + k * s * 0.4, y + s * 0.9]], 7, col); shape(c, () => ell(c, x, y, s * 0.7, s * 0.6), col); shape(c, () => ell(c, x, y - s * 0.05, s * 0.28, s * 0.28), WHITE, 5); shape(c, () => ell(c, x, y - s * 0.05, s * 0.11, s * 0.11), INK, 0); return; }
  shape(c, () => ell(c, x, y, s * 0.75, s * 0.65), col);
  [-1, 1].forEach((d) => { shape(c, () => ell(c, x + d * s * 0.28, y - s * 0.05, s * 0.2, s * 0.26, d * 0.4), INK, 0); line(c, [[x + d * s * 0.55, y - s * 0.55], [x + d * s * 0.65, y - s * 0.95]]); shape(c, () => ell(c, x + d * s * 0.65, y - s * 0.95, s * 0.09, s * 0.09), col, 4); });
  c.beginPath(); c.arc(x, y + s * 0.2, s * 0.2, 0.3, Math.PI - 0.3); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
};
const bubble = (c: Ctx, x: number, y: number, w: number, h: number, tx: number, ty: number) => {
  shape(c, () => polyP(c, [[x - 30, y + h / 2 - 8], [tx, ty], [x + 30, y + h / 2 - 8]]), WHITE, 6);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 60), WHITE, 6);
  c.fillStyle = WHITE; c.fillRect(x - 28, y + h / 2 - 12, 56, 10);
};
const ringsOf = (c: Ctx, x: number, y: number, k: number) => {
  const R: [number, string][] = [[1, "#9c6a43"], [0.82, COL.orange], [0.64, COL.yellow], [0.46, COL.greenLt], [0.3, COL.blue]];
  R.forEach(([f, col]) => shape(c, () => ell(c, x, y, 400 * k * f, 250 * k * f), col, 6));
  shape(c, () => ell(c, x, y, 400 * k * 0.15, 250 * k * 0.15), COL.blueDk, 5);
};

// 0 cover: a hot spring and an ice sheet on Earth, Europa in the sky above
const summary = (c: Ctx) => {
  ground(c);
  c.fillStyle = NIGHT; c.fillRect(0, 0, D, 470); stars(c, 5, 40, 20, 20, 1060, 450);
  moon(c, 540, 240, 160);
  c.fillStyle = "#cdb89a"; c.fillRect(0, 470, 540, 610);
  c.fillStyle = "#dbeaf3"; c.fillRect(540, 470, 540, 610);
  ringsOf(c, 270, 800, 0.62); steam(c, 270, 720, 150, 3, 50);
  line(c, [[640, 560], [700, 640], [660, 720]], 7, ICEDK); line(c, [[820, 520], [790, 640], [880, 760]], 7, ICEDK); line(c, [[980, 600], [920, 700]], 7, ICEDK);
  shape(c, () => polyP(c, [[660, 800], [760, 780], [840, 840], [940, 800], [1000, 900], [800, 980], [640, 940]]), "#2d5f8a", 6);
  flake(c, 880, 600, 55, COL.blueDk, 8);
  c.beginPath(); c.moveTo(0, 470); c.lineTo(D, 470); c.strokeStyle = INK; c.lineWidth = 8; c.stroke();
  c.beginPath(); c.moveTo(540, 470); c.lineTo(540, D); c.stroke();
  microbe(c, 150, 960, 70, 34, 0.5, COL.green); microbe(c, 380, 990, 70, 34, -0.3, COL.green);
};

// 1 experiment e1: three tumblers in the freezer, 0, 1 and 6 spoons of salt
const expE1 = (c: Ctx) => {
  ground(c);
  flake(c, 540, 150, 90, COL.blueDk, 9); flake(c, 190, 190, 55, COL.blue, 7); flake(c, 890, 190, 55, COL.blue, 7);
  const X = [200, 540, 880];
  X.forEach((x, i) => {
    glass(c, x, 760, 230, 360, 0.8, i === 2 ? COL.water : i === 1 ? "#bfe0f5" : WHITE);
    if (i === 0) { line(c, [[x - 70, 560], [x - 20, 640], [x - 50, 720]], 5, ICEDK); line(c, [[x + 30, 540], [x + 60, 650]], 5, ICEDK); }
    if (i === 1) { icecube(c, x - 40, 530, 70); icecube(c, x + 35, 545, 56); icecube(c, x, 590, 50); }
  });
  [0, 1, 6].forEach((n, i) => {
    const x = X[i];
    write(c, String(n), x - 100, 830, 100, INK, 11);
    if (n > 0) { const h = n === 1 ? 40 : 90; shape(c, () => polyP(c, [[x + 10, 920], [x + 80, 920], [x + 45, 920 - h]]), WHITE, 5); }
  });
};

// 2 activity a1: an ice cube lifted on a thread
const actA1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 900, 380, 80);
  icecube(c, 290, 810, 120);
  shadow(c, 560, 925, 90, 22);
  hand(c, 540, 40, Math.PI / 2, 1.3, SKIN.child, CLOTH.child);
  line(c, [[540, 200], [540, 520]], 4, INK);
  icecube(c, 540, 610, 180);
  const r = rnd(4);
  for (let i = 0; i < 8; i++) shape(c, () => rrect(c, 480 + r() * 110, 520 + r() * 14, 12, 12, 2), WHITE, 3);
  arrow(c, [[780, 720], [780, 420]]);
};

// 3 activity a2: a string from the freezer cold to the boiling heat
const actA2 = (c: Ctx) => {
  ground(c);
  line(c, [[40, 560], [1040, 560]], 20, INK); line(c, [[40, 560], [1040, 560]], 10, COL.wood);
  [190, 540, 890].forEach((x) => { line(c, [[x, 560], [x, 640]], 6); });
  shape(c, () => rrect(c, 90, 640, 200, 130, 14), WHITE, 6); write(c, "-20", 120, 670, 70, COL.blueDk, 9);
  shape(c, () => rrect(c, 470, 640, 140, 130, 14), WHITE, 6); write(c, "0", 515, 670, 70, COL.blueDk, 9);
  shape(c, () => rrect(c, 770, 640, 240, 130, 14), WHITE, 6); write(c, "100", 800, 670, 70, RED, 9);
  shape(c, () => rrect(c, 90, 280, 200, 220, 20), COL.sky, 6); flake(c, 190, 390, 70, COL.blueDk, 9);
  icecube(c, 540, 400, 160);
  pot(c, 890, 500, 190, 130); steam(c, 890, 330, 120, 3, 50);
  arrow(c, [[250, 880], [800, 880]]);
};

// 4 activity a3: draw a living thing for Europa
const actA3 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(430, 590); c.rotate(-0.05);
  shadow(c, 20, 40, 340, 400);
  shape(c, () => rrect(c, -330, -380, 660, 760, 8), COL.paper, 7);
  shape(c, () => rrect(c, -290, 80, 580, 240, 6), COL.water, 0);
  line(c, [[-290, 80], [-200, 60], [-100, 90], [0, 60], [100, 90], [200, 60], [290, 80]], 6, COL.blueDk);
  shape(c, () => { c.moveTo(-130, 60); c.bezierCurveTo(-140, -150, 140, -150, 130, 60); c.closePath(); }, COL.orange);
  for (let k = 0; k < 5; k++) { const x = -100 + k * 50; line(c, [[x, 60], [x - 20, 150], [x + 10, 230]], 12, INK); line(c, [[x, 60], [x - 20, 150], [x + 10, 230]], 6, COL.orange); }
  [-1, 1].forEach((d) => { shape(c, () => ell(c, d * 50, -35, 28, 34), WHITE, 5); shape(c, () => ell(c, d * 50, -30, 11, 13), INK, 0); });
  c.restore();
  moon(c, 860, 230, 130);
  c.save(); c.translate(850, 800); c.rotate(-0.9);
  shape(c, () => polyP(c, [[-170, -26], [90, -26], [90, 26], [-170, 26]]), COL.yellow, 6);
  shape(c, () => polyP(c, [[90, -26], [160, 0], [90, 26]]), "#f2d9b0", 6);
  shape(c, () => polyP(c, [[135, -10], [160, 0], [135, 10]]), INK, 0);
  shape(c, () => rrect(c, -210, -26, 40, 52, 8), COL.pink, 6);
  c.restore();
};

// 5 activity a4: ask five people what an alien looks like
const actA4 = (c: Ctx) => {
  ground(c);
  [[200, 280, 0], [540, 280, 1], [880, 280, 2]].forEach(([x, y, k]) => { bubble(c, x, y, 300, 330, x, y + 230); alien(c, x, y - 10, 100, k); });
  person(c, 270, 1010, 470, { armL: [1.6, 1.1], armR: [1.1, 0.5] });
  shape(c, () => rrect(c, 520, 640, 400, 340, 14), COL.paper, 6);
  line(c, [[560, 640], [560, 980]], 5, RED);
  for (let r = 0; r < 5; r++) { const y = 700 + r * 56; line(c, [[620, y - 8], [620, y + 24]], 7); if (r < 4) { line(c, [[650, y - 8], [650, y + 24]], 7); } }
  line(c, [[600, 720], [740, 720]], 0.1);
};

// 6 activity a5: paint a hot spring's rings
const actA5 = (c: Ctx) => {
  ground(c);
  shadow(c, 520, 900, 440, 40);
  shape(c, () => rrect(c, 100, 240, 840, 640, 10), COL.paper, 7);
  ringsOf(c, 520, 560, 0.95);
  c.save(); c.translate(890, 330); c.rotate(0.9);
  shape(c, () => polyP(c, [[-200, -22], [100, -22], [100, 22], [-200, 22]]), COL.wood, 6);
  shape(c, () => rrect(c, 100, -26, 90, 52, 6), COL.steel, 6);
  shape(c, () => { c.moveTo(190, -24); c.quadraticCurveTo(300, -20, 340, 0); c.quadraticCurveTo(300, 20, 190, 24); c.closePath(); }, COL.orange, 6);
  c.restore();
};

// 7 project p1: the field guide booklet
const proP1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 880, 460, 40);
  shape(c, () => polyP(c, [[80, 250], [530, 280], [530, 860], [80, 830]]), WHITE, 7);
  shape(c, () => polyP(c, [[550, 280], [1000, 250], [1000, 830], [550, 860]]), COL.paper, 7);
  line(c, [[540, 280], [540, 860]], 8);
  [380, 560, 740].forEach((y) => shape(c, () => rrect(c, 524, y, 32, 12, 4), COL.steelDk, 3));
  tardi(c, 790, 560, 1.7, 0);
  ringsOf(c, 305, 560, 0.4);
  flake(c, 305, 740, 45, COL.blueDk, 7);
  microbe(c, 770, 800, 60, 28, 0.3, MICRO);
};

// 8 term Liquid: ice, water, steam in three tumblers
const termLiquid = (c: Ctx) => {
  ground(c);
  glass(c, 200, 800, 230, 380); icecube(c, 160, 680, 90); icecube(c, 250, 700, 80); icecube(c, 210, 760, 70);
  glass(c, 540, 800, 230, 380, 0.75);
  glass(c, 880, 800, 230, 380); steam(c, 880, 400, 280, 3, 60);
  flake(c, 200, 960, 40, COL.blueDk, 6); drop(c, 540, 960, 30); steam(c, 880, 1050, 0, 0);
};

// 9 term Freezing point
const termFreeze = (c: Ctx) => {
  ground(c);
  thermo(c, 300, 130, 780, 640);
  line(c, [[240, 640], [400, 640]], 10, COL.blue); write(c, "0", 430, 600, 90, COL.blueDk, 10);
  drop(c, 700, 330, 55); arrow(c, [[700, 420], [700, 560]]); icecube(c, 700, 680, 170);
  flake(c, 880, 330, 50, COL.blueDk, 7);
};

// 10 term Boiling point
const termBoil = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 80, 760, 640, 140, 20), COL.black, 6); [220, 400, 580].forEach((x) => flame(c, x, 760, 60));
  pot(c, 400, 750, 400, 330); steam(c, 400, 400, 200, 3, 80);
  const r = rnd(9); for (let i = 0; i < 7; i++) shape(c, () => ell(c, 250 + r() * 300, 520 + r() * 60, 14 + r() * 10, 14 + r() * 10), COL.drop, 4);
  thermo(c, 880, 130, 780, 175); write(c, "100", 790, 890, 80, RED, 10);
};

// 11 term Below zero
const termBelow = (c: Ctx) => {
  ground(c);
  thermo(c, 270, 130, 800, 690);
  line(c, [[200, 330], [350, 330]], 10, COL.blue); write(c, "0", 370, 290, 80, COL.blueDk, 10);
  write(c, "-20", 350, 650, 80, COL.blueDk, 10);
  arrow(c, [[160, 340], [160, 640]]);
  shadow(c, 760, 1000, 220, 30);
  shape(c, () => rrect(c, 560, 170, 400, 820, 24), "#e4ecf4", 7);
  shape(c, () => rrect(c, 560, 170, 400, 280, 24), COL.steelIn, 7);
  line(c, [[600, 330], [600, 400]], 18); line(c, [[600, 520], [600, 640]], 18);
  flake(c, 780, 310, 60, COL.blueDk, 8); flake(c, 780, 700, 90, COL.blueDk, 9);
};

// 12 term Brine
const termBrine = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 300, 40);
  const jar = () => rrect(c, 260, 330, 600, 590, 70);
  shape(c, jar, "rgba(214,236,250,0.55)", 0);
  c.save(); c.beginPath(); jar(); c.clip(); c.fillStyle = "#d6e6ee"; c.fillRect(250, 420, 620, 520); c.restore();
  const r = rnd(12);
  for (let i = 0; i < 9; i++) { const x = 340 + r() * 380, y = 500 + r() * 340, a = r() * 3; c.save(); c.translate(x, y); c.rotate(a); shape(c, () => { c.moveTo(-50, 0); c.quadraticCurveTo(0, -48, 50, 0); c.quadraticCurveTo(0, 20, -50, 0); c.closePath(); }, "#9ccf62", 5); c.restore(); }
  for (let i = 0; i < 14; i++) { const x = 300 + r() * 520, y = 450 + r() * 440; shape(c, () => rrect(c, x, y, 13, 13, 2), WHITE, 3); }
  shape(c, jar, "rgba(0,0,0,0)", 7); shine(c, [[310, 480], [310, 800]], 10);
  shape(c, () => rrect(c, 300, 270, 520, 80, 18), COL.red, 7);
  shape(c, () => polyP(c, [[900, 900], [1010, 900], [955, 790]]), WHITE, 6);
};

// 13 term Extremophile
const termExtremo = (c: Ctx) => {
  ground(c);
  const P: [number, number, string][] = [[40, 40, "#cdb89a"], [560, 40, "#dbeaf3"], [40, 560, PINK], [560, 560, "#1c2a4a"]];
  P.forEach(([x, y, col]) => { shape(c, () => rrect(c, x, y, 480, 480, 36), col, 7); });
  const clipP = (x: number, y: number, f: () => void) => { c.save(); c.beginPath(); rrect(c, x, y, 480, 480, 36); c.clip(); f(); c.restore(); shape(c, () => rrect(c, x, y, 480, 480, 36), "rgba(0,0,0,0)", 7); };
  clipP(40, 40, () => { ringsOf(c, 280, 290, 0.5); steam(c, 280, 180, 100, 3, 45); });
  clipP(560, 40, () => { line(c, [[600, 200], [700, 260], [740, 340]], 7, ICEDK); line(c, [[900, 130], [860, 260], [960, 340]], 7, ICEDK); flake(c, 1000, 130, 40, COL.blueDk, 6); });
  clipP(40, 560, () => { shape(c, () => ell(c, 280, 800, 190, 100), "#ffc2d6", 6); const r = rnd(2); for (let i = 0; i < 8; i++) shape(c, () => rrect(c, 130 + r() * 300, 620 + r() * 40, 14, 14, 2), WHITE, 3); });
  clipP(560, 560, () => { shape(c, () => polyP(c, [[740, 1040], [770, 780], [830, 780], [860, 1040]]), "#5a4a56", 6); shape(c, () => ell(c, 800, 780, 30, 14), "#3a3040", 5); shape(c, () => ell(c, 790, 700, 18, 18), "#8a8aa0", 4); shape(c, () => ell(c, 820, 640, 14, 14), "#8a8aa0", 4); });
  microbe(c, 280, 380, 120, 56, 0.3); microbe(c, 800, 400, 120, 56, -0.3, COL.green); microbe(c, 290, 960, 120, 56, 0.2, COL.purple); microbe(c, 810, 960, 120, 56, -0.2, COL.orange);
};

// 14 term Alien life
const termAlien = (c: Ctx) => {
  ground(c);
  drop(c, 200, 800, 85);
  shape(c, () => ell(c, 200, 840, 22, 22), COL.green, 4);
  line(c, [[270, 760], [400, 600]], 5, INK); line(c, [[270, 900], [400, 900]], 5, INK);
  zoom(c, 690, 700, 300, "#d6ecfa", () => {
    shape(c, () => ell(c, 690, 710, 170, 150), COL.purple);
    for (let k = 0; k < 10; k++) { const a = (k * Math.PI * 2) / 10; line(c, [[690 + Math.cos(a) * 160, 710 + Math.sin(a) * 140], [690 + Math.cos(a) * 225, 710 + Math.sin(a) * 200]], 9); }
    shape(c, () => ell(c, 650, 700, 50, 40), "#c9b2f0", 5); shape(c, () => ell(c, 740, 740, 28, 28), COL.yellow, 5);
  });
  for (const [w, col] of [[28, INK], [15, RED]] as [number, string][]) { c.beginPath(); c.arc(690, 215, 70, Math.PI * 1.05, Math.PI * 2.45); c.lineTo(690, 330); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke(); }
  shape(c, () => ell(c, 690, 405, 20, 20), RED, 6);
};

// 15 term Astrobiology
const termAstro = (c: Ctx) => {
  ground(c);
  c.fillStyle = NIGHT; c.fillRect(0, 0, D, 540); stars(c, 8, 30, 20, 20, 1060, 500);
  shape(c, () => ell(c, 800, 230, 120, 120), COL.red, 6); shade(c, () => ell(c, 800, 230, 120, 120), "#a83a28", 40, 30);
  c.fillStyle = "#e8f2f8"; c.fillRect(0, 540, D, 540); line(c, [[0, 540], [D, 540]], 8);
  shape(c, () => ell(c, 770, 900, 150, 50), "#2d5f8a", 6);
  line(c, [[770, 640], [770, 900]], 5); shape(c, () => rrect(c, 745, 860, 50, 60, 12), COL.steelIn, 5);
  person(c, 300, 960, 560, { adult: true, armL: [1.4, 1.1], armR: [0.5, 0.1] });
  line(c, [[420, 720], [770, 640]], 5);
};

// 16 expl 0: what every living thing needs
const explNeeds = (c: Ctx) => {
  ground(c);
  const C3: [number, number, string][] = [[390, 410, "rgba(143,195,234,0.75)"], [690, 410, "rgba(255,211,77,0.75)"], [540, 680, "rgba(156,207,98,0.75)"]];
  C3.forEach(([x, y, col]) => { shape(c, () => ell(c, x, y, 250, 250), col, 7); });
  drop(c, 290, 330, 60);
  sun(c, 790, 310, 50);
  shape(c, () => rrect(c, 740, 400, 90, 60, 26), COL.grey, 5);
  [[430, 800, COL.red], [530, 800, COL.blue], [480, 730, COL.yellow], [630, 800, COL.purple], [580, 730, COL.orange]].forEach(([x, y, col]) => shape(c, () => rrect(c, x as number, y as number, 80, 70, 10), col as string, 6));
  shape(c, () => ell(c, 540, 470, 82, 82), WHITE, 7);
  shape(c, () => ell(c, 540, 470, 56, 56), COL.greenLt, 5); shape(c, () => ell(c, 530, 462, 20, 20), COL.greenDk, 4);
};

// 17 expl 1: salt keeps water from locking into ice
const explSalt = (c: Ctx) => {
  ground(c);
  icecube(c, 290, 160, 140); drop(c, 790, 160, 60);
  zoom(c, 290, 560, 250, "#e9f6fc", () => {
    for (let r = 0; r < 5; r++) for (let q = 0; q < 5; q++) { const x = 170 + q * 62, y = 440 + r * 62; if (q < 4) line(c, [[x, y], [x + 62, y]], 5, COL.blueDk); if (r < 4) line(c, [[x, y], [x, y + 62]], 5, COL.blueDk); }
    for (let r = 0; r < 5; r++) for (let q = 0; q < 5; q++) shape(c, () => ell(c, 170 + q * 62, 440 + r * 62, 17, 17), COL.blue, 4);
  });
  zoom(c, 790, 560, 250, "#d4e9f8", () => {
    const r = rnd(7);
    for (let i = 0; i < 14; i++) shape(c, () => ell(c, 640 + r() * 300, 420 + r() * 280, 17, 17), COL.blue, 4);
    for (let i = 0; i < 7; i++) { const x = 650 + r() * 280, y = 430 + r() * 260; shape(c, () => rrect(c, x, y, 28, 28, 4), WHITE, 4); }
    arrow(c, [[700, 720], [770, 690]], RED, 6); arrow(c, [[900, 470], [850, 520]], RED, 6);
  });
  flake(c, 290, 900, 60, COL.blueDk, 8); write(c, "0", 520, 850, 100, INK, 11); write(c, "-21", 640, 850, 100, COL.blueDk, 11);
  arrow(c, [[560, 810], [760, 810]], RED, 8);
};

// 18 expl 2: a hot spring and its microbes
const explHot = (c: Ctx) => {
  ground(c);
  ringsOf(c, 440, 440, 0.9); steam(c, 440, 330, 170, 3, 70);
  line(c, [[500, 540], [680, 700]], 6, INK);
  zoom(c, 780, 800, 210, "#cfe6f4", () => { microbe(c, 740, 760, 150, 54, 0.5); microbe(c, 850, 860, 140, 50, -0.4); microbe(c, 700, 880, 120, 44, -0.8); microbe(c, 860, 740, 110, 40, 0.1); });
  write(c, "70", 70, 880, 110, RED, 12);
};

// 19 expl 4: a pink salt lake and a dry tardigrade
const explDry = (c: Ctx) => {
  ground(c);
  const r = rnd(3);
  for (let i = 0; i < 26; i++) { const a = (i / 26) * Math.PI * 2, x = 290 + Math.cos(a) * 250, y = 470 + Math.sin(a) * 190; shape(c, () => ell(c, x, y, 55 + r() * 12, 55 + r() * 12), i % 2 ? COL.green : COL.leaf, 5); }
  shape(c, () => ell(c, 290, 470, 205, 150), PINK, 6);
  line(c, [[190, 440], [260, 420]], 8, WHITE);
  microbe(c, 300, 500, 90, 38, 0.3, "#c0306a");
  c.save(); c.translate(790, 520); c.rotate(-0.3);
  shape(c, () => { c.moveTo(-250, 0); c.quadraticCurveTo(0, -200, 250, 0); c.quadraticCurveTo(0, 200, -250, 0); c.closePath(); }, "#c9a96a", 6);
  line(c, [[-250, 0], [250, 0]], 6, "#8a6a30");
  c.restore();
  shape(c, () => ell(c, 790, 480, 85, 85), TAN); shade(c, () => ell(c, 790, 480, 85, 85), TANDK, 30, 25, 0.6);
  for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(790, 480, 30 + k * 22, 0.4 + k, 2.2 + k); c.lineWidth = 4; c.strokeStyle = TANDK; c.stroke(); }
  drop(c, 540, 850, 50); line(c, [[470, 790], [610, 910]], 12, RED);
  arrow(c, [[640, 830], [760, 640]], RED, 8);
};

// 20 expl 6: a child under a sky of stars with planets
const explAliens = (c: Ctx) => {
  c.fillStyle = NIGHT; c.fillRect(0, 0, D, D); stars(c, 21, 90, 10, 10, 1070, 700);
  const S: [number, number][] = [[250, 160], [620, 120], [880, 300], [430, 380], [760, 540]];
  S.forEach(([x, y], i) => {
    c.beginPath(); ell(c, x, y, 95, 38, -0.3); c.strokeStyle = "rgba(255,255,255,0.7)"; c.lineWidth = 3; c.stroke();
    shape(c, () => ell(c, x, y, 20, 20), COL.yellow, 4);
    shape(c, () => ell(c, x + 80, y - 14, 11, 11), [COL.blue, COL.red, COL.greenLt, COL.pink, COL.orange][i], 3);
  });
  shape(c, () => rrect(c, 0, 940, D, 140), COL.black, 0);
  shape(c, () => rrect(c, -10, 960, 1100, 60), "#5a5260", 6);
  for (let x = 40; x < D; x += 110) line(c, [[x, 790], [x, 960]], 12, INK);
  line(c, [[0, 790], [D, 790]], 14, INK);
  person(c, 300, 1020, 520, { armL: [1.7, 1.5], armR: [-1.0, -1.2] });
};

// 21 expl 7: rover, spacecraft in the jets, radio dish
const explSearch = (c: Ctx) => {
  ground(c);
  const X = [30, 380, 730], W = 320;
  const panel = (x: number, col: string, f: () => void) => { shape(c, () => rrect(c, x, 150, W, 780, 30), col, 7); c.save(); c.beginPath(); rrect(c, x, 150, W, 780, 30); c.clip(); f(); c.restore(); shape(c, () => rrect(c, x, 150, W, 780, 30), "rgba(0,0,0,0)", 7); };
  panel(X[0], "#f2c7a0", () => {
    c.fillStyle = "#c46a3c"; c.fillRect(X[0], 640, W, 300);
    shape(c, () => polyP(c, [[X[0] + 190, 700], [X[0] + 300, 650], [X[0] + 330, 760], [X[0] + 220, 790]]), "#8b4a2c", 6);
    shape(c, () => rrect(c, X[0] + 30, 500, 160, 80, 12), COL.steelIn, 6);
    [X[0] + 55, X[0] + 110, X[0] + 165].forEach((x) => shape(c, () => ell(c, x, 620, 28, 28), COL.black, 6));
    line(c, [[X[0] + 60, 500], [X[0] + 60, 360]], 10); shape(c, () => rrect(c, X[0] + 30, 320, 60, 40, 8), COL.steelIn, 5);
    line(c, [[X[0] + 190, 540], [X[0] + 250, 580], [X[0] + 250, 650]], 12); shape(c, () => rrect(c, X[0] + 232, 640, 36, 36, 6), COL.red, 5);
  });
  panel(X[1], "#1c2a4a", () => {
    stars(c, 11, 25, X[1], 150, X[1] + W, 800);
    shape(c, () => ell(c, X[1] + 160, 1000, 270, 200), "#f1f4f7", 6);
    [-60, 20, 90].forEach((dx) => { for (let k = 0; k < 4; k++) { const sx = X[1] + 160 + dx + (k - 1.5) * 7; line(c, [[sx, 810], [sx + (k - 1.5) * 12, 590]], 9, INK); line(c, [[sx, 810], [sx + (k - 1.5) * 12, 590]], 4, WHITE); } });
    shape(c, () => rrect(c, X[1] + 110, 330, 100, 80, 10), COL.yellow, 6);
    shape(c, () => rrect(c, X[1] + 10, 350, 90, 40, 4), COL.blue, 6); shape(c, () => rrect(c, X[1] + 220, 350, 90, 40, 4), COL.blue, 6);
    shape(c, () => ell(c, X[1] + 160, 300, 30, 18), COL.steelIn, 5);
  });
  panel(X[2], NIGHT, () => {
    stars(c, 14, 50, X[2], 150, X[2] + W, 930);
    c.fillStyle = "#3a4a2a"; c.fillRect(X[2], 840, W, 100);
    line(c, [[X[2] + 130, 840], [X[2] + 110, 640]], 20, INK); line(c, [[X[2] + 130, 840], [X[2] + 110, 640]], 10, COL.steelIn);
    c.save(); c.translate(X[2] + 120, 620); c.rotate(-0.6);
    shape(c, () => { c.moveTo(-120, 0); c.quadraticCurveTo(0, 130, 120, 0); c.closePath(); }, COL.steelIn, 7);
    shape(c, () => ell(c, 0, 0, 120, 26), COL.steel, 6);
    line(c, [[0, 0], [0, -90]], 8); shape(c, () => ell(c, 0, -95, 14, 14), COL.red, 4);
    c.restore();
    arrow(c, [[X[2] + 190, 580], [X[2] + 270, 420]], WHITE, 7);
  });
};

export const ic_skyLifeBeyondEarthL3 = cards("sci.sky.life-beyond-earth.L3 cards", [
  summary, expE1, actA1, actA2, actA3, actA4, actA5, proP1, termLiquid, termFreeze, termBoil, termBelow, termBrine, termExtremo, termAlien, termAstro, explNeeds, explSalt, explHot, explDry, explAliens, explSearch,
]);
