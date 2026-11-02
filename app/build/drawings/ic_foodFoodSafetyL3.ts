import type { Ctx } from "./core";
import { D, INK, RED, WHITE, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, leaf, person, write, cards } from "./flatKit";

// FOOD SAFETY (L3) · picture cards for the intro, cover, experiments, activities, project, challenges, terms and explanations.

const FLOOR = "#e3cfa6", MIC = "#a77bd4", MICDK = "#7f55b0", DAL = "#e9bd45", DALDK = "#c99a2e", CURD = "#fffaf0", DUST = "#8d7f6a";
const counter = (c: Ctx, yTop: number) => { c.fillStyle = FLOOR; c.fillRect(0, yTop, D, D - yTop); c.fillStyle = "#edddb9"; c.fillRect(0, yTop, D, 16); line(c, [[0, yTop], [D, yTop]], 6); };
const dot = (c: Ctx, x: number, y: number, r: number, col: string, w = 4) => shape(c, () => ell(c, x, y, r, r), col, w);
const rod = (c: Ctx, x: number, y: number, L: number, W: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => rrect(c, -L / 2, -W / 2, L, W, W / 2);
  shape(c, p, MIC, Math.max(3, W * 0.14)); shade(c, p, MICDK, W * 0.2, W * 0.2, 0.5); c.restore();
};
const ball = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), MIC, Math.max(3, r * 0.16)); shade(c, () => ell(c, x, y, r, r), MICDK, r * 0.3, r * 0.3, 0.5); };
const eyes = (c: Ctx, x: number, y: number, s: number) => { for (const dx of [-1, 1]) { dot(c, x + dx * s * 0.55, y, s * 0.42, WHITE, 3); dot(c, x + dx * s * 0.55 + s * 0.08, y + s * 0.05, s * 0.2, INK, 0); } };
const zoom = (c: Ctx, x: number, y: number, r: number, inner: () => void, bg = "#fdf1f4") => {
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.fillStyle = bg; c.fill(); c.clip(); inner(); c.restore();
  c.beginPath(); ell(c, x, y, r, r); c.lineWidth = 12; c.strokeStyle = INK; c.stroke();
};
const magnifier = (c: Ctx, x: number, y: number, r: number, an: number, inner: () => void) => {
  line(c, [[x + Math.cos(an) * r, y + Math.sin(an) * r], [x + Math.cos(an) * (r + 190), y + Math.sin(an) * (r + 190)]], 34, INK);
  line(c, [[x + Math.cos(an) * r, y + Math.sin(an) * r], [x + Math.cos(an) * (r + 190), y + Math.sin(an) * (r + 190)]], 20, COL.woodDk);
  zoom(c, x, y, r, inner);
};
const fly = (c: Ctx, x: number, y: number, s: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  for (const k of [-1, 0, 1]) for (const g of [-1, 1]) line(c, [[k * 12, g * 8], [k * 12 + 8, g * 30], [k * 12 + 20, g * 40]], 5);
  for (const g of [-1, 1]) shape(c, () => ell(c, -16, g * 24, 38, 15, g * 0.55), "rgba(214,236,250,0.85)", 4);
  shape(c, () => ell(c, 0, 0, 40, 19), "#4a4352", 5);
  shape(c, () => ell(c, 42, 0, 15, 15), "#4a4352", 5);
  for (const g of [-1, 1]) shape(c, () => ell(c, 48, g * 9, 7, 7), RED, 2.5);
  c.restore();
};
const idli = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.62), "#fffdf5", 5); shade(c, () => ell(c, x, y, r, r * 0.62), "#e4dccb", r * 0.25, r * 0.15, 0.6); };
const stripFlame = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x, y); c.bezierCurveTo(x - s * 0.7, y - s * 0.3, x - s * 0.4, y - s * 0.9, x, y - s * 1.3); c.bezierCurveTo(x + s * 0.4, y - s * 0.9, x + s * 0.7, y - s * 0.3, x, y); c.closePath(); }, COL.orange, 5);
  shape(c, () => { c.moveTo(x, y - s * 0.05); c.bezierCurveTo(x - s * 0.3, y - s * 0.2, x - s * 0.15, y - s * 0.5, x, y - s * 0.65); c.bezierCurveTo(x + s * 0.15, y - s * 0.5, x + s * 0.3, y - s * 0.2, x, y - s * 0.05); c.closePath(); }, COL.yellow, 0);
};
const steam = (c: Ctx, x: number, y: number, h: number, col = "#ffffff") => { for (const dx of [-30, 0, 30]) { c.globalAlpha = 0.9; line(c, [[x + dx, y], [x + dx + 14, y - h * 0.35], [x + dx - 14, y - h * 0.7], [x + dx, y - h]], 9, col); c.globalAlpha = 1; } };
const wavy = (c: Ctx, x: number, y: number, h: number, col: string, w = 9) => line(c, [[x, y], [x + 18, y - h * 0.25], [x - 18, y - h * 0.5], [x + 18, y - h * 0.75], [x, y - h]], w, col);
// a steel dabba or pot: bottom centre (x, y); lid on/off; liquid colour when open
const dabba = (c: Ctx, x: number, y: number, w: number, h: number, lid: boolean, liquid: string | null = null) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.62, w * 0.1);
  const body = () => rrect(c, x - w / 2, y - h, w, h, 16);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.28, 0, 0.55);
  if (lid) { shape(c, () => rrect(c, x - w / 2 - 8, y - h - 22, w + 16, 30, 12), COL.steelIn); shape(c, () => rrect(c, x - 20, y - h - 42, 40, 24, 10), COL.steelDk); }
  else { shape(c, () => ell(c, x, y - h, w / 2, w * 0.13), liquid ?? COL.steelIn, 5); if (liquid) shine(c, [[x - w * 0.3, y - h - 6], [x - w * 0.1, y - h + 4]], 6); }
};
const coriander = (c: Ctx, x: number, y: number, s: number) => {
  for (const [dx, an] of [[-26, -2.2], [-10, -1.9], [8, -1.5], [24, -1.15], [38, -0.9]] as [number, number][]) { line(c, [[x + dx * 0.4 * s, y], [x + dx * s, y - s * 60]], 6, COL.leafDk); leaf(c, x + dx * s, y - s * 60, s * 60, an, COL.leaf); leaf(c, x + dx * s, y - s * 60, s * 48, an + 0.8, COL.leafDk); }
  line(c, [[x - 14 * s, y - 4], [x + 14 * s, y - 4]], 12, RED);
};
const lemon = (c: Ctx, x: number, y: number, r: number, rot = 0) => { c.save(); c.translate(x, y); c.rotate(rot); const p = () => { c.moveTo(-r * 1.15, 0); c.quadraticCurveTo(-r * 0.7, -r * 0.85, 0, -r * 0.85); c.quadraticCurveTo(r * 0.7, -r * 0.85, r * 1.15, 0); c.quadraticCurveTo(r * 0.7, r * 0.85, 0, r * 0.85); c.quadraticCurveTo(-r * 0.7, r * 0.85, -r * 1.15, 0); c.closePath(); }; shape(c, p, COL.yellow, 5); shade(c, p, COL.orange, r * 0.25, r * 0.2, 0.5); shine(c, [[-r * 0.5, -r * 0.4], [-r * 0.1, -r * 0.55]], 6); c.restore(); };
const salt = (c: Ctx, x: number, y: number, rx: number, ry: number, n = 40, seed = 3) => { shape(c, () => ell(c, x, y, rx, ry), WHITE, 4); const r = rnd(seed); for (let i = 0; i < n; i++) { const a = r() * 6.28, d = Math.sqrt(r()); dot(c, x + Math.cos(a) * rx * 0.85 * d, y + Math.sin(a) * ry * 0.8 * d, 4, "#dfe5ec", 0); } };
const sun = (c: Ctx, x: number, y: number, r: number) => { for (let k = 0; k < 12; k++) { const a = k * 0.5236; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.65, y + Math.sin(a) * r * 1.65]], 9, COL.orange); } dot(c, x, y, r, COL.yellow, 6); };
const tomato = (c: Ctx, x: number, y: number, r: number) => { dot(c, x, y, r, COL.red, 5); shade(c, () => ell(c, x, y, r, r), "#b83a28", r * 0.3, r * 0.25, 0.5); leaf(c, x, y - r * 0.85, r * 0.6, -2.4, COL.leaf); leaf(c, x, y - r * 0.85, r * 0.6, -0.7, COL.leaf); };
const frownFace = (c: Ctx, x: number, y: number, h: number) => { const head = h * 0.13, hy = y - h * 0.74 - head * 1.05; shape(c, () => ell(c, x, hy + head * 0.58, head * 0.5, head * 0.3), SKIN.child, 0); c.beginPath(); c.arc(x, hy + head * 0.72, head * 0.28, Math.PI + 0.3, Math.PI * 2 - 0.3); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); };
const tick = (c: Ctx, x: number, y: number, s: number) => line(c, [[x - s, y], [x - s * 0.25, y + s * 0.7], [x + s, y - s * 0.8]], 16, COL.leafDk);
const cross = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - s, y - s], [x + s, y + s]], 16, RED); line(c, [[x + s, y - s], [x - s, y + s]], 16, RED); };
const shelf = (c: Ctx, x0: number, x1: number, y: number) => { shape(c, () => rrect(c, x0, y, x1 - x0, 34, 8), COL.woodDk); for (const x of [x0 + 40, x1 - 40]) shape(c, () => rrect(c, x - 14, y + 34, 28, 250), COL.woodDk); };

// ---------------------------------------------------------------- 0 intro: fresh curd and old curd
const intro = (c: Ctx) => {
  ground(c);
  person(c, 230, 1010, 700, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [0.45, 0.2] });
  counter(c, 690);
  bowl(c, 600, 780, 140, CURD);
  shape(c, () => { c.moveTo(470, 778); c.quadraticCurveTo(600, 660, 730, 778); c.quadraticCurveTo(600, 800, 470, 778); c.closePath(); }, CURD, 5);
  bowl(c, 880, 780, 140, "#f1deb0");
  shape(c, () => ell(c, 880, 774, 118, 24), "#e8d08a", 0);
  for (const [dx, dy, r] of [[-50, 4, 10], [10, 14, 8], [48, -2, 12], [-10, -6, 7]]) dot(c, 880 + dx, 774 + dy, r, "#fff3c8", 3);
  wavy(c, 800, 600, 150, COL.greenLt); wavy(c, 880, 580, 170, COL.greenLt); wavy(c, 960, 600, 150, COL.greenLt);
  for (const x of [600, 880]) { line(c, [[x + 40, 760], [x + 110, 560]], 14, INK); line(c, [[x + 40, 760], [x + 110, 560]], 8, COL.steel); shape(c, () => ell(c, x + 114, 548, 22, 30, 0.35), COL.steel, 5); }
};

// ---------------------------------------------------------------- 1 cover: three dabbas, a fly, a girl with a notebook
const cover = (c: Ctx) => {
  ground(c);
  person(c, 910, 1020, 660, { armL: [1.9, -2.0], armR: [Math.PI * 0.45, Math.PI * 0.5] });
  shape(c, () => rrect(c, 690, 450, 110, 150, 8), WHITE, 6); for (const y of [490, 520, 550]) line(c, [[708, y], [782, y]], 4, COL.glassEdge);
  shelf(c, 50, 800, 700);
  dabba(c, 190, 700, 190, 220, true, null);
  dabba(c, 430, 700, 190, 220, false, "#ecd48a");
  fly(c, 500, 380, 1.5, 0.6);
  dabba(c, 670, 700, 190, 220, true, null);
  leaf(c, 690, 470, 90, -1.1, COL.leaf); leaf(c, 670, 474, 80, -2.2, COL.leaf);
};

// ---------------------------------------------------------------- 2 e1: pour the same dal water into three dabbas
const e1 = (c: Ctx) => {
  ground(c);
  counter(c, 640);
  // pan with dal water and a ladle
  shadow(c, 210, 780, 190, 24);
  shape(c, () => rrect(c, 60, 640, 300, 130, 24), COL.steel); shade(c, () => rrect(c, 60, 640, 300, 130, 24), COL.steelDk, 80, 0, 0.55);
  shape(c, () => ell(c, 210, 640, 150, 34), DAL, 5);
  line(c, [[360, 680], [470, 650]], 22, INK); line(c, [[360, 680], [470, 650]], 12, COL.steelDk);
  steam(c, 210, 600, 160);
  arrow(c, [[420, 520], [520, 470], [620, 470]]);
  for (const [x, lid, leafy] of [[560, true, false], [760, false, false], [960, true, true]] as [number, boolean, boolean][]) {
    dabba(c, x, 840, 170, 200, false, "#ecd48a");
    if (lid) { c.save(); c.translate(x - 20, 560); c.rotate(-0.2); shape(c, () => rrect(c, -90, -14, 180, 28, 12), COL.steelIn); shape(c, () => rrect(c, -20, -34, 40, 22, 8), COL.steelDk); c.restore(); }
    if (leafy) { leaf(c, x - 80, 960, 70, -0.3, COL.leaf); leaf(c, x - 80, 960, 60, -1.0, COL.leaf); }
  }
};

// ---------------------------------------------------------------- 3 e2: how many washes
const e2 = (c: Ctx) => {
  ground(c);
  counter(c, 700);
  const waters = ["#9d7a4c", "#c4b184", COL.water];
  waters.forEach((w, i) => {
    const x = 190 + i * 350;
    bowl(c, x, 640, 150, w);
    coriander(c, x, 620, 1.6);
    write(c, String(i + 1), x - 14, 850, 80, INK, 9);
  });
  arrow(c, [[350, 520], [440, 520]]); arrow(c, [[700, 520], [790, 520]]);
  for (const [x, y] of [[120, 700], [190, 730], [250, 690]]) dot(c, x, y, 7, "#6a4128", 0);
};

// ---------------------------------------------------------------- 4 e3: dropped biscuit and watermelon
const e3 = (c: Ctx) => {
  ground(c, "#e8dcc3");
  c.fillStyle = "#d9c9a6"; c.fillRect(0, 560, D, 520);
  for (let x = -200; x < 1300; x += 260) line(c, [[x + 130, 560], [x - 130 + (x - 540) * 0.35, 1080]], 5, "#bda97e");
  for (const y of [700, 880]) line(c, [[0, y], [D, y]], 5, "#bda97e");
  // stopwatch
  dot(c, 540, 270, 160, WHITE, 8); dot(c, 540, 270, 130, "#f6efe0", 0);
  shape(c, () => rrect(c, 515, 80, 50, 40, 8), COL.steelDk); shape(c, () => rrect(c, 495, 60, 90, 26, 8), COL.steel);
  for (let k = 0; k < 12; k++) { const a = k * 0.5236; line(c, [[540 + Math.cos(a) * 112, 270 + Math.sin(a) * 112], [540 + Math.cos(a) * 128, 270 + Math.sin(a) * 128]], 6); }
  line(c, [[540, 270], [540, 170]], 8); line(c, [[540, 270], [610, 300]], 10, RED); dot(c, 540, 270, 14, INK, 0);
  // biscuit
  shadow(c, 290, 880, 150, 26);
  shape(c, () => ell(c, 280, 820, 140, 70), "#e0a85a"); shade(c, () => ell(c, 280, 820, 140, 70), "#b8803a", 30, 18, 0.5);
  for (const [dx, dy] of [[-60, -10], [0, -25], [60, -5], [-20, 20], [40, 25], [-90, 15]]) dot(c, 280 + dx, 820 + dy, 6, "#8a5a30", 0);
  const r = rnd(5); for (let i = 0; i < 5; i++) dot(c, 160 + r() * 240, 750 + r() * 140, 6, DUST, 0);
  // watermelon cube
  shadow(c, 790, 890, 160, 26);
  shape(c, () => polyP(c, [[660, 790], [900, 790], [930, 860], [690, 860]]), COL.red);
  shape(c, () => polyP(c, [[660, 790], [900, 790], [840, 740], [720, 740]]), "#f08a7a");
  shape(c, () => polyP(c, [[690, 860], [930, 860], [930, 900], [690, 900]]), COL.green);
  for (const [x, y] of [[740, 820], [800, 830], [860, 812]]) shape(c, () => ell(c, x, y, 6, 10, 0.4), INK, 0);
  const r2 = rnd(9); for (let i = 0; i < 16; i++) dot(c, 670 + r2() * 270, 760 + r2() * 150, 6, DUST, 0);
};

// ---------------------------------------------------------------- 5 a1: kitchen watch
const a1 = (c: Ctx) => {
  ground(c);
  person(c, 190, 1030, 640, { armL: [1.9, -1.9], armR: [Math.PI * 0.45, Math.PI * 0.5] });
  shape(c, () => rrect(c, 235, 520, 100, 130, 8), WHITE, 6); for (const y of [555, 585, 615]) line(c, [[252, y], [318, y]], 4, COL.glassEdge);
  // fridge
  shape(c, () => rrect(c, 800, 250, 220, 450, 20), WHITE); shade(c, () => rrect(c, 800, 250, 220, 450, 20), COL.steelDk, 40, 0, 0.35);
  line(c, [[800, 470], [1020, 470]], 6); line(c, [[830, 330], [830, 420]], 12); line(c, [[830, 500], [830, 600]], 12);
  counter(c, 700);
  // covered pot
  dabba(c, 470, 700, 190, 130, true, null);
  // tap, basin and soap
  line(c, [[640, 330], [640, 470], [700, 470]], 26, INK); line(c, [[640, 330], [640, 470], [700, 470]], 14, COL.steel);
  line(c, [[700, 490], [700, 600]], 8, COL.water);
  bowl(c, 700, 700, 100, COL.water);
  shape(c, () => rrect(c, 570, 650, 80, 48, 14), COL.pink, 5);
};

// ---------------------------------------------------------------- 6 a2: dust catcher
const a2 = (c: Ctx) => {
  ground(c);
  counter(c, 720);
  plate(c, 290, 760, 250, 100);
  for (const [x, y] of [[210, 730], [290, 710], [370, 740], [250, 770], [340, 780]]) { shape(c, () => rrect(c, x - 30, y - 30, 60, 56, 8), COL.red, 5); shape(c, () => ell(c, x - 8, y - 8, 6, 9, 0.4), INK, 0); }
  const r = rnd(4); for (let i = 0; i < 12; i++) dot(c, 120 + r() * 340, 400 + r() * 360, 7, DUST, 0);
  arrow(c, [[300, 320], [300, 420]], DUST, 12);
  // covered plate
  plate(c, 800, 760, 250, 100);
  for (const [x, y] of [[740, 730], [830, 710], [880, 760]]) shape(c, () => rrect(c, x - 30, y - 30, 60, 56, 8), COL.red, 5);
  shape(c, () => { c.moveTo(640, 760); c.bezierCurveTo(640, 500, 960, 500, 960, 760); c.closePath(); }, "rgba(214,236,250,0.6)", 6);
  shine(c, [[690, 700], [720, 600]], 9);
  for (const [x, y] of [[620, 420], [800, 380], [960, 450], [700, 330]]) dot(c, x, y, 7, DUST, 0);
  arrow(c, [[800, 280], [800, 400]], DUST, 12);
  // lens on the open plate
  zoom(c, 560, 270, 110, () => { const q = rnd(2); for (let i = 0; i < 8; i++) dot(c, 480 + q() * 160, 200 + q() * 140, 9, DUST, 0); rod(c, 540, 280, 60, 24, 0.5); rod(c, 590, 230, 56, 22, -0.4); }, "#fdf1f4");
};

// ---------------------------------------------------------------- 7 a3: sort a meal into three jobs
const a3 = (c: Ctx) => {
  ground(c);
  const cols = [["#fbe6a8", 190], ["#f7c5bd", 540], ["#cfe8b4", 890]] as [string, number][];
  cols.forEach(([bg, x], i) => { shape(c, () => rrect(c, x - 160, 330, 320, 650, 36), bg, 6); });
  // energy bolt, building bricks, protecting shield
  shape(c, () => polyP(c, [[210, 80], [140, 220], [195, 220], [160, 310], [260, 170], [205, 170]]), COL.yellow, 6);
  for (const [dx, dy, w] of [[-70, 250, 80], [10, 250, 80], [-30, 205, 80], [-110, 205, 80], [50, 205, 80], [-70, 160, 80], [10, 160, 80]]) shape(c, () => rrect(c, 540 + dx, 80 + dy - 100, w, 42, 4), COL.red, 5);
  shape(c, () => { c.moveTo(890, 90); c.lineTo(970, 120); c.quadraticCurveTo(970, 250, 890, 310); c.quadraticCurveTo(810, 250, 810, 120); c.closePath(); }, COL.green, 6);
  // energy: rice and chapati
  shape(c, () => { c.moveTo(70, 560); c.quadraticCurveTo(190, 420, 310, 560); c.closePath(); }, WHITE, 6);
  for (const [x, y] of [[150, 520], [200, 500], [240, 530], [180, 550]]) shape(c, () => ell(c, x, y, 12, 5, 0.5), "#e4dccb", 0);
  shape(c, () => ell(c, 190, 760, 110, 110), "#e9c98c", 6); for (const [x, y] of [[150, 730], [220, 790], [230, 720]]) dot(c, x, y, 12, "#a8723f", 0);
  // building: dal and egg
  bowl(c, 540, 520, 110, DAL);
  shape(c, () => ell(c, 450, 760, 62, 85), WHITE, 6); dot(c, 450, 775, 30, COL.yellow, 4);
  shape(c, () => ell(c, 610, 760, 62, 85), WHITE, 6); dot(c, 610, 775, 30, COL.yellow, 4);
  // protecting: tomato and greens
  tomato(c, 840, 500, 70); tomato(c, 950, 580, 55);
  leaf(c, 840, 900, 160, -2.0, COL.leaf); leaf(c, 880, 900, 170, -1.3, COL.leaf); leaf(c, 920, 900, 150, -0.7, COL.leafDk);
  shape(c, () => rrect(c, 790, 770, 60, 120, 28), COL.orange, 6); shape(c, () => rrect(c, 880, 790, 60, 100, 28), COL.orange, 6);
};

// ---------------------------------------------------------------- 8 a4: read the packet
const a4 = (c: Ctx) => {
  ground(c);
  shadow(c, 520, 960, 330, 30);
  shape(c, () => polyP(c, [[250, 140], [330, 110], [410, 140], [490, 110], [570, 140], [650, 110], [730, 140], [740, 880], [660, 910], [580, 880], [500, 910], [420, 880], [340, 910], [260, 880]]), COL.orange);
  shade(c, () => polyP(c, [[250, 140], [740, 140], [740, 880], [250, 880]]), "#d27c25", 120, 0, 0.35);
  shape(c, () => ell(c, 495, 420, 150, 110), "#f6d28b", 6); for (const [x, y] of [[450, 400], [520, 380], [540, 450], [470, 450]]) dot(c, x, y, 9, "#a8723f", 0);
  // date stamp
  shape(c, () => rrect(c, 330, 640, 330, 110, 10), WHITE, 6); write(c, "15 06", 372, 662, 64, INK, 9);
  // veg mark
  shape(c, () => rrect(c, 330, 770, 70, 70, 6), WHITE, 6); dot(c, 365, 805, 22, COL.green, 5);
  magnifier(c, 780, 400, 120, 0.9, () => { c.fillStyle = WHITE; c.fillRect(600, 250, 400, 300); write(c, "15", 745, 350, 90, INK, 12); });
};

// ---------------------------------------------------------------- 9 a5: before fridges, a wet cloth on a matka
const a5 = (c: Ctx) => {
  ground(c);
  counter(c, 780);
  // matka
  shadow(c, 340, 900, 210, 30);
  const m = () => { c.moveTo(230, 520); c.bezierCurveTo(60, 620, 110, 880, 340, 880); c.bezierCurveTo(570, 880, 620, 620, 450, 520); c.closePath(); };
  shape(c, m, "#c8683f"); shade(c, m, "#9c4a2a", 70, 20, 0.5);
  shape(c, () => ell(c, 340, 520, 114, 28), "#a85332", 6);
  // wet cloth over the top, dripping
  shape(c, () => { c.moveTo(210, 500); c.lineTo(470, 500); c.lineTo(500, 680); c.lineTo(440, 700); c.lineTo(400, 640); c.lineTo(330, 700); c.lineTo(270, 650); c.lineTo(190, 690); c.closePath(); }, "#bfe0f5", 6);
  for (const [x, y] of [[300, 740], [420, 730], [360, 770]]) shape(c, () => { c.moveTo(x, y - 24); c.quadraticCurveTo(x + 18, y, x, y + 14); c.quadraticCurveTo(x - 18, y, x, y - 24); c.closePath(); }, COL.water, 3);
  // hanging basket (uri) with a pot, on a rope
  line(c, [[800, 0], [800, 300]], 8);
  shape(c, () => { c.moveTo(690, 560); c.bezierCurveTo(690, 760, 910, 760, 910, 560); c.closePath(); }, "#d9b277", 6);
  for (const x of [740, 800, 860]) line(c, [[x, 580], [x, 730]], 3, "#a8723f");
  line(c, [[760, 330], [690, 560]], 6); line(c, [[840, 330], [910, 560]], 6); line(c, [[800, 300], [760, 330]], 6); line(c, [[800, 300], [840, 330]], 6);
  shape(c, () => { c.moveTo(720, 470); c.bezierCurveTo(700, 600, 900, 600, 880, 470); c.closePath(); }, "#c8683f", 6);
  shape(c, () => ell(c, 800, 470, 80, 20), "#fffaf0", 6);
  // breeze
  for (const y of [360, 420]) line(c, [[560, y], [610, y - 14], [660, y + 14], [710, y]], 7, COL.glassEdge);
  sun(c, 920, 140, 60);
};

// ---------------------------------------------------------------- 10 a6: the dabba from a microbe's side
const a6 = (c: Ctx) => {
  ground(c, "#e4d6f2");
  // the huge dabba
  shape(c, () => rrect(c, 380, -100, 720, 900, 40), COL.steel);
  shade(c, () => rrect(c, 380, -100, 720, 900, 40), COL.steelDk, 180, 0, 0.5);
  shine(c, [[450, 40], [450, 600]], 24);
  counter(c, 800);
  // giant grains of rice and a giant drop
  for (const [x, y, rot] of [[560, 850, 0.2], [740, 900, -0.3], [880, 860, 0.1]]) shape(c, () => ell(c, x, y, 100, 36, rot), "#fffdf5", 6);
  shape(c, () => { c.moveTo(930, 560); c.bezierCurveTo(880, 660, 840, 700, 840, 740); c.arc(930, 740, 90, Math.PI, 0, true); c.bezierCurveTo(1020, 700, 970, 660, 930, 560); c.closePath(); }, COL.water, 6);
  // the microbe, small, looking up
  rod(c, 200, 780, 150, 110, 0);
  eyes(c, 200, 765, 52);
  for (const sx of [-1, 1]) line(c, [[200 + sx * 70, 790], [200 + sx * 108, 840]], 8);
  line(c, [[200 + 70, 760], [330, 700], [330, 700]], 8);
  line(c, [[160, 810], [200, 820], [240, 810]], 5);
  // child's pencil drawing hint: a pencil
  shape(c, () => polyP(c, [[60, 960], [320, 930], [330, 960], [70, 990]]), COL.yellow, 6); shape(c, () => polyP(c, [[320, 930], [380, 948], [330, 960]]), "#f2d2a0", 5);
};

// ---------------------------------------------------------------- 11 p1: salt lemon pickle
const p1 = (c: Ctx) => {
  ground(c);
  counter(c, 840);
  // jar
  shadow(c, 560, 850, 250, 30);
  const jar = () => { c.moveTo(380, 330); c.lineTo(740, 330); c.quadraticCurveTo(790, 340, 790, 400); c.lineTo(790, 800); c.quadraticCurveTo(790, 850, 740, 850); c.lineTo(380, 850); c.quadraticCurveTo(330, 850, 330, 800); c.lineTo(330, 400); c.quadraticCurveTo(330, 340, 380, 330); c.closePath(); };
  shape(c, jar, "rgba(214,236,250,0.55)", 6);
  c.save(); c.beginPath(); jar(); c.clip();
  c.fillStyle = "rgba(255,255,255,0.8)"; c.fillRect(300, 760, 520, 100);
  for (const [x, y, rot] of [[450, 700, 0.3], [620, 690, -0.4], [540, 590, 0.1], [440, 510, -0.3], [640, 500, 0.4], [540, 420, 0.2]]) lemon(c, x, y, 70, rot);
  const r = rnd(6); for (let i = 0; i < 40; i++) dot(c, 350 + r() * 420, 430 + r() * 400, 5, WHITE, 0);
  c.restore();
  c.beginPath(); jar(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  shine(c, [[365, 420], [365, 760]], 12);
  shape(c, () => rrect(c, 360, 270, 400, 68, 14), COL.teal);
  // salt heap, lemon, spoon
  salt(c, 160, 820, 110, 40, 30); shape(c, () => { c.moveTo(60, 820); c.quadraticCurveTo(160, 700, 260, 820); c.closePath(); }, WHITE, 5);
  lemon(c, 910, 780, 70, 0.3); lemon(c, 960, 640, 60, -0.5);
};

// ---------------------------------------------------------------- 12 c1: milk without a fridge
const c1 = (c: Ctx) => {
  ground(c);
  counter(c, 800);
  // basin of water
  shadow(c, 540, 880, 420, 40);
  shape(c, () => { c.moveTo(120, 700); c.lineTo(960, 700); c.lineTo(900, 880); c.lineTo(180, 880); c.closePath(); }, COL.steel);
  shade(c, () => polyP(c, [[120, 700], [960, 700], [900, 880], [180, 880]]), COL.steelDk, 160, 0, 0.5);
  shape(c, () => ell(c, 540, 700, 420, 50), COL.water, 6);
  // milk pot with lid in the middle
  dabba(c, 540, 740, 260, 300, true, null);
  // wet cloth over the pot, hanging into the water
  shape(c, () => { c.moveTo(390, 440); c.lineTo(690, 440); c.lineTo(720, 700); c.lineTo(360, 700); c.closePath(); }, "rgba(191,224,245,0.9)", 6);
  for (const x of [440, 540, 640]) line(c, [[x, 470], [x - 6, 680]], 3, COL.waterDk);
  // breeze lines and a milk drop
  for (const y of [420, 520]) { line(c, [[80, y], [150, y - 16], [220, y + 16], [290, y]], 7, COL.glassEdge); line(c, [[790, y], [860, y - 16], [930, y + 16], [1000, y]], 7, COL.glassEdge); }
  shape(c, () => { c.moveTo(540, 250); c.bezierCurveTo(500, 320, 480, 350, 480, 380); c.arc(540, 380, 60, Math.PI, 0, true); c.bezierCurveTo(600, 350, 580, 320, 540, 250); c.closePath(); }, WHITE, 6);
};

// ---------------------------------------------------------------- 13 c2: wash vegetables and save the water
const c2 = (c: Ctx) => {
  ground(c);
  counter(c, 780);
  bowl(c, 290, 700, 230, COL.water);
  tomato(c, 220, 680, 55); tomato(c, 330, 670, 55); tomato(c, 270, 720, 55);
  arrow(c, [[540, 560], [660, 500]]);
  // plant pot
  shadow(c, 830, 900, 150, 24);
  shape(c, () => polyP(c, [[740, 720], [920, 720], [890, 900], [770, 900]]), "#c8683f"); shape(c, () => rrect(c, 725, 690, 210, 40, 10), "#a85332");
  leaf(c, 830, 700, 220, -1.57, COL.leaf); leaf(c, 830, 700, 190, -2.3, COL.leaf); leaf(c, 830, 700, 190, -0.85, COL.leaf);
  // mug pouring
  c.save(); c.translate(880, 330); c.rotate(0.6);
  shape(c, () => rrect(c, -70, -60, 140, 120, 14), COL.blue); shade(c, () => rrect(c, -70, -60, 140, 120, 14), COL.blueDk, 40, 0, 0.5);
  line(c, [[70, -20], [105, -20], [105, 25], [70, 25]], 14);
  c.restore();
  for (const [x, y] of [[760, 420], [775, 480], [790, 540], [770, 600]]) shape(c, () => { c.moveTo(x, y - 22); c.quadraticCurveTo(x + 16, y, x, y + 12); c.quadraticCurveTo(x - 16, y, x, y - 22); c.closePath(); }, COL.water, 3);
};

// ---------------------------------------------------------------- 14 term microbe: curd and its microbes
const tMicrobe = (c: Ctx) => {
  ground(c);
  counter(c, 760);
  bowl(c, 330, 800, 250, CURD);
  shape(c, () => { c.moveTo(130, 798); c.quadraticCurveTo(330, 640, 530, 798); c.quadraticCurveTo(330, 830, 130, 798); c.closePath(); }, CURD, 5);
  line(c, [[420, 720], [560, 520]], 7); line(c, [[450, 770], [700, 650]], 7);
  zoom(c, 720, 380, 270, () => { const r = rnd(3); for (let i = 0; i < 9; i++) rod(c, 520 + r() * 400, 190 + r() * 400, 100, 40, r() * 3.14); });
};

// ---------------------------------------------------------------- 15 term bacteria: a drop under a lens
const tBacteria = (c: Ctx) => {
  ground(c);
  counter(c, 840);
  shape(c, () => { c.moveTo(250, 730); c.bezierCurveTo(210, 800, 190, 820, 190, 850); c.arc(250, 850, 60, Math.PI, 0, true); c.bezierCurveTo(310, 820, 290, 800, 250, 730); c.closePath(); }, DAL, 5);
  line(c, [[300, 850], [380, 780]], 7);
  magnifier(c, 600, 430, 300, 0.7, () => {
    const r = rnd(8);
    for (let i = 0; i < 6; i++) rod(c, 380 + r() * 440, 250 + r() * 360, 120, 46, r() * 3.14);
    for (let i = 0; i < 7; i++) ball(c, 380 + r() * 440, 250 + r() * 360, 26);
  });
};

// ---------------------------------------------------------------- 16 term spore: tough seeds floating in the air
const tSpore = (c: Ctx) => {
  ground(c);
  counter(c, 840);
  shape(c, () => rrect(c, 140, 700, 420, 150, 50), "#e9c98c"); shape(c, () => rrect(c, 160, 660, 380, 100, 50), "#f2d9a6");
  const r = rnd(7); const SP = "#8aa07a";
  for (let i = 0; i < 14; i++) { const x = 100 + r() * 880, y = 100 + r() * 480; dot(c, x, y, 14, SP, 4); }
  arrow(c, [[150, 560], [150, 660]], COL.greenDk, 10);
  zoom(c, 760, 380, 250, () => {
    dot(c, 760, 380, 150, SP, 8); dot(c, 760, 380, 112, "#b8c9a8", 6); dot(c, 760, 380, 66, "#6f8a5e", 5);
  });
  line(c, [[600, 520], [380, 600]], 7);
};

// ---------------------------------------------------------------- 17 term multiply: one splits into two, then four
const tMultiply = (c: Ctx) => {
  ground(c);
  rod(c, 100, 420, 140, 70, 0);
  arrow(c, [[190, 420], [250, 420]]);
  shape(c, () => { c.moveTo(310, 385); c.quadraticCurveTo(360, 405, 410, 385); c.quadraticCurveTo(450, 420, 410, 455); c.quadraticCurveTo(360, 435, 310, 455); c.quadraticCurveTo(270, 420, 310, 385); c.closePath(); }, MIC, 5);
  arrow(c, [[470, 420], [530, 420]]);
  rod(c, 620, 385, 140, 60, 0); rod(c, 620, 455, 140, 60, 0);
  arrow(c, [[720, 420], [780, 420]]);
  for (const [x, y] of [[860, 380], [860, 450], [990, 380], [990, 450]]) rod(c, x, y, 110, 50, 0);
  write(c, "1", 80, 580, 110, INK, 11); write(c, "2", 600, 580, 110, INK, 11); write(c, "4", 905, 580, 110, INK, 11);
};

// ---------------------------------------------------------------- 18 term spoil: smelly sambar
const tSpoil = (c: Ctx) => {
  ground(c);
  person(c, 800, 1030, 700, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [-0.2, -2.6] });
  frownFace(c, 800, 1030, 700);
  counter(c, 770);
  bowl(c, 270, 810, 220, "#c8782a");
  for (const [x, y, r] of [[170, 806, 24], [250, 790, 18], [320, 820, 28], [230, 828, 14], [380, 800, 16], [290, 780, 12]]) dot(c, x, y, r, "#f0b873", 4);
  wavy(c, 200, 700, 190, COL.greenLt); wavy(c, 280, 690, 220, COL.greenLt); wavy(c, 360, 700, 190, COL.greenLt);
  arrow(c, [[440, 620], [570, 580]], RED);
};

// ---------------------------------------------------------------- 19 term food poisoning: sick child, ORS
const tPoison = (c: Ctx) => {
  ground(c);
  // sofa
  shape(c, () => rrect(c, 40, 640, 760, 220, 60), COL.purple); shade(c, () => rrect(c, 40, 640, 760, 220, 60), "#6a4fa8", 50, 0, 0.5);
  shape(c, () => rrect(c, 40, 540, 130, 320, 50), "#7a5cb8");
  shape(c, () => rrect(c, 70, 570, 190, 90, 40), WHITE);
  // child lying
  dot(c, 190, 580, 78, SKIN.child, 6);
  shape(c, () => { c.moveTo(114, 570); c.bezierCurveTo(120, 480, 260, 480, 266, 570); c.quadraticCurveTo(190, 540, 114, 570); c.closePath(); }, CLOTH.hair, 5);
  for (const ex of [160, 218]) { c.beginPath(); c.arc(ex, 580, 12, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
  c.beginPath(); c.arc(192, 632, 20, Math.PI + 0.3, Math.PI * 2 - 0.3); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  shape(c, () => rrect(c, 250, 560, 480, 130, 50), COL.teal); shade(c, () => rrect(c, 250, 560, 480, 130, 50), COL.tealDk, 40, 20, 0.5);
  for (const [x, y] of [[250, 480], [280, 500]]) shape(c, () => { c.moveTo(x, y - 20); c.quadraticCurveTo(x + 14, y, x, y + 10); c.quadraticCurveTo(x - 14, y, x, y - 20); c.closePath(); }, COL.water, 3);
  // parent with a glass of ORS
  person(c, 910, 1040, 700, { adult: true, armL: [2.5, -1.8], armR: [Math.PI * 0.45, Math.PI * 0.5] });
  glass(c, 713, 500, 96, 120, 0.7, "#d9ecf5");
};

// ---------------------------------------------------------------- 20 term contaminate: fly from the bin to the idlis
const tContaminate = (c: Ctx) => {
  ground(c);
  counter(c, 800);
  // dustbin
  shadow(c, 210, 930, 150, 24);
  shape(c, () => polyP(c, [[90, 500], [330, 500], [300, 920], [120, 920]]), COL.greyDk); shade(c, () => polyP(c, [[90, 500], [330, 500], [300, 920], [120, 920]]), "#5a5650", 80, 0, 0.5);
  shape(c, () => rrect(c, 70, 450, 280, 56, 20), COL.grey);
  for (const x of [150, 210, 270]) line(c, [[x, 560], [x - 6, 880]], 5, COL.greyDk);
  // plate of idlis
  plate(c, 800, 820, 230, 80);
  idli(c, 720, 800, 90); idli(c, 880, 800, 90); idli(c, 800, 770, 90);
  arrow(c, [[250, 440], [340, 340]]);
  arrow(c, [[540, 330], [680, 430], [730, 600]]);
  fly(c, 440, 300, 1.5, 0.3);
  for (const [x, y] of [[400, 360], [470, 352]]) ball(c, x, y, 9);
  for (const [x, y] of [[860, 790], [760, 770]]) ball(c, x, y, 9);
};

// ---------------------------------------------------------------- 21 term pasteurise: heat, then cool fast, then packet
const tPasteurise = (c: Ctx) => {
  ground(c);
  counter(c, 800);
  // hot pot on flames
  shape(c, () => rrect(c, 70, 770, 280, 70, 12), INK, 0); for (const x of [130, 210, 290]) stripFlame(c, x, 770, 50);
  dabba(c, 210, 680, 220, 190, false, WHITE);
  steam(c, 210, 450, 150, COL.red);
  // ice bath
  shape(c, () => polyP(c, [[440, 660], [680, 660], [660, 800], [460, 800]]), COL.blue); shape(c, () => ell(c, 560, 660, 120, 24), COL.sky, 5);
  dabba(c, 560, 640, 180, 170, false, WHITE);
  for (const [x, y] of [[470, 700], [560, 730], [640, 700]]) shape(c, () => rrect(c, x - 28, y - 22, 56, 44, 8), "#e8f6ff", 4);
  for (const x of [520, 560, 600]) { line(c, [[x, 440], [x + 12, 470], [x, 500]], 7, COL.glassEdge); }
  arrow(c, [[350, 580], [430, 580]]);
  arrow(c, [[690, 580], [770, 580]]);
  // packet
  shape(c, () => polyP(c, [[800, 420], [850, 400], [900, 420], [950, 400], [1000, 420], [1000, 780], [950, 800], [900, 780], [850, 800], [800, 780]]), WHITE);
  shape(c, () => rrect(c, 800, 540, 200, 130, 4), COL.blue, 5);
  shape(c, () => { c.moveTo(900, 450); c.bezierCurveTo(870, 500, 860, 520, 860, 540); c.arc(900, 540, 40, Math.PI, 0, true); c.bezierCurveTo(940, 520, 930, 500, 900, 450); c.closePath(); }, COL.sky, 5);
};

// ---------------------------------------------------------------- 22 term preserve: pickle jar and drying vadams
const tPreserve = (c: Ctx) => {
  ground(c, "#f6e9c9");
  sun(c, 880, 160, 80);
  counter(c, 800);
  // jar
  shadow(c, 300, 820, 200, 28);
  const jar = () => { c.moveTo(190, 340); c.lineTo(410, 340); c.quadraticCurveTo(440, 350, 440, 400); c.lineTo(440, 740); c.quadraticCurveTo(440, 800, 390, 800); c.lineTo(210, 800); c.quadraticCurveTo(160, 800, 160, 740); c.lineTo(160, 400); c.quadraticCurveTo(160, 350, 190, 340); c.closePath(); };
  shape(c, jar, "rgba(214,236,250,0.55)", 6);
  c.save(); c.beginPath(); jar(); c.clip();
  for (const [x, y, rot] of [[250, 700, 0.3], [360, 690, -0.4], [290, 590, 0.1], [240, 490, -0.3], [350, 480, 0.4]]) lemon(c, x, y, 55, rot);
  c.restore(); c.beginPath(); jar(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  shape(c, () => rrect(c, 180, 290, 240, 56, 12), COL.teal);
  // plate of vadams
  plate(c, 730, 740, 250, 90);
  for (const [x, y] of [[640, 740], [720, 710], [810, 740], [730, 770], [830, 710]]) { shape(c, () => ell(c, x, y, 62, 24), "#f3dfae", 5); dot(c, x - 14, y - 2, 4, "#d6bf86", 0); dot(c, x + 16, y + 4, 4, "#d6bf86", 0); }
};

// ---------------------------------------------------------------- 23 expl microbe finds a meal
const xMeal = (c: Ctx) => {
  ground(c);
  counter(c, 800);
  bowl(c, 780, 760, 220, WHITE);
  shape(c, () => { c.moveTo(600, 756); c.quadraticCurveTo(780, 560, 960, 756); c.quadraticCurveTo(780, 790, 600, 756); c.closePath(); }, WHITE, 5);
  const r = rnd(2); for (let i = 0; i < 20; i++) shape(c, () => ell(c, 650 + r() * 260, 680 + r() * 60, 12, 5, r() * 3), "#e4dccb", 0);
  steam(c, 780, 560, 180, COL.red);
  for (const [x, y] of [[960, 540], [1000, 650], [580, 580]]) shape(c, () => { c.moveTo(x, y - 24); c.quadraticCurveTo(x + 18, y, x, y + 14); c.quadraticCurveTo(x - 18, y, x, y - 24); c.closePath(); }, COL.water, 3);
  // dust speck carrying the microbe
  shape(c, () => polyP(c, [[130, 520], [210, 480], [300, 510], [320, 590], [240, 630], [150, 600]]), DUST, 6);
  rod(c, 215, 440, 130, 90, 0.1); eyes(c, 215, 428, 46);
  c.beginPath(); c.arc(215, 456, 14, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  arrow(c, [[350, 460], [520, 400]]);
};

// ---------------------------------------------------------------- 24 expl time: one, sixty-four, a crowd
const xTime = (c: Ctx) => {
  ground(c);
  const clock = (x: number, hour: number) => {
    dot(c, x, 280, 140, WHITE, 8);
    for (let k = 0; k < 12; k++) { const a = k * 0.5236; line(c, [[x + Math.cos(a) * 108, 280 + Math.sin(a) * 108], [x + Math.cos(a) * 124, 280 + Math.sin(a) * 124]], 6); }
    const ha = (hour / 12) * 6.2832 - 1.5708;
    line(c, [[x, 280], [x + Math.cos(ha) * 78, 280 + Math.sin(ha) * 78]], 12); line(c, [[x, 280], [x, 280 - 110]], 7); dot(c, x, 280, 10, INK, 0);
  };
  clock(180, 12); clock(540, 2); clock(900, 7);
  arrow(c, [[320, 280], [390, 280]]); arrow(c, [[690, 280], [760, 280]]);
  // 1 microbe
  rod(c, 180, 600, 90, 40, 0.3); write(c, "1", 160, 700, 80, INK, 9);
  // 64 in an 8 x 8 grid
  for (let i = 0; i < 64; i++) ball(c, 440 + (i % 8) * 26, 530 + Math.floor(i / 8) * 26, 10);
  write(c, "64", 480, 780, 80, INK, 9);
  // a crowd
  const r = rnd(12); for (let i = 0; i < 260; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * 150; ball(c, 900 + Math.cos(a) * d, 640 + Math.sin(a) * d, 11); }
};

// ---------------------------------------------------------------- 25 expl washing and covering
const xWash = (c: Ctx) => {
  ground(c);
  person(c, 520, 1030, 640, { armL: [2.4, 2.7], armR: [Math.PI * 0.45, Math.PI * 0.5] });
  counter(c, 700);
  // tap and stream
  line(c, [[250, 140], [250, 260], [320, 260]], 28, INK); line(c, [[250, 140], [250, 260], [320, 260]], 16, COL.steel);
  for (const x of [320, 336]) line(c, [[x, 290], [x, 560]], 6, COL.water);
  bowl(c, 300, 700, 170, COL.water);
  coriander(c, 300, 640, 1.2);
  // covered vessel
  dabba(c, 840, 700, 240, 200, false, null);
  shape(c, () => ell(c, 840, 500, 190, 36), COL.steelIn, 6); shape(c, () => rrect(c, 800, 462, 80, 34, 10), COL.steelDk);
};

// ---------------------------------------------------------------- 26 expl cooking and cooling: temperature bands
const xHeat = (c: Ctx) => {
  ground(c);
  // bands
  shape(c, () => rrect(c, 300, 40, 740, 290, 30), "#f9c9a0", 6);
  shape(c, () => rrect(c, 300, 370, 740, 340, 30), "#f4b4ac", 6);
  shape(c, () => rrect(c, 300, 750, 740, 290, 30), "#bfe0f5", 6);
  // thermometer
  shape(c, () => rrect(c, 90, 60, 110, 820, 55), WHITE); dot(c, 145, 930, 90, WHITE, 6);
  shape(c, () => rrect(c, 125, 380, 40, 520, 20), RED, 0); dot(c, 145, 930, 62, RED, 0);
  shape(c, () => rrect(c, 125, 60, 40, 330, 20), WHITE, 0);
  write(c, "60", 215, 300, 60, INK, 8); write(c, "5", 235, 740, 60, INK, 8);
  line(c, [[200, 330], [300, 330]], 6); line(c, [[200, 730], [300, 730]], 6);
  // hot: pot on flame
  dabba(c, 560, 250, 200, 120, false, COL.water);
  steam(c, 560, 130, 80, WHITE);
  stripFlame(c, 480, 300, 40); stripFlame(c, 560, 300, 40); stripFlame(c, 640, 300, 40);
  // danger: dabba with microbes
  dabba(c, 560, 620, 200, 180, false, DAL);
  for (const [x, y] of [[500, 560], [610, 540], [700, 600], [450, 620]]) ball(c, x, y, 20);
  cross(c, 880, 540, 50);
  // cold: fridge
  shape(c, () => rrect(c, 470, 780, 200, 240, 18), WHITE); line(c, [[470, 870], [670, 870]], 6); line(c, [[500, 810], [500, 850]], 10);
  tick(c, 880, 900, 50);
};

// ---------------------------------------------------------------- 27 expl raw and cooked apart
const xBoards = (c: Ctx) => {
  ground(c);
  for (const x of [60, 600]) { shape(c, () => rrect(c, x, 280, 420, 560, 50), COL.wood); shade(c, () => rrect(c, x, 280, 420, 560, 50), COL.woodDk, 20, 20, 0.5); dot(c, x + 210, 330, 16, COL.woodDk, 4); }
  // raw fish
  shape(c, () => { c.moveTo(110, 560); c.quadraticCurveTo(250, 440, 380, 560); c.quadraticCurveTo(250, 680, 110, 560); c.closePath(); }, COL.steel);
  shape(c, () => polyP(c, [[380, 560], [440, 480], [440, 640]]), COL.steelDk);
  dot(c, 170, 548, 12, WHITE, 3); dot(c, 170, 548, 5, INK, 0);
  line(c, [[240, 500], [250, 620]], 4, COL.steelDk); line(c, [[290, 505], [300, 618]], 4, COL.steelDk);
  shape(c, () => rrect(c, 200, 700, 150, 18, 6), COL.red, 0);
  // cucumber slices
  for (const [x, y] of [[700, 480], [820, 520], [940, 480], [760, 640], [880, 660]]) { dot(c, x, y, 54, COL.greenDk, 5); dot(c, x, y, 40, "#dff0c0", 0); for (let k = 0; k < 6; k++) dot(c, x + Math.cos(k) * 18, y + Math.sin(k) * 18, 4, "#b6d88a", 0); }
  // the crossed arrow
  arrow(c, [[380, 190], [540, 120], [700, 190]], RED, 10);
  cross(c, 540, 125, 50);
};

// ---------------------------------------------------------------- 28 expl old ways: sun-dried, pickled, hung
const xOld = (c: Ctx) => {
  ground(c, "#f6e9c9");
  sun(c, 160, 150, 70);
  // string of chillies
  line(c, [[500, 0], [500, 120]], 7);
  line(c, [[500, 120], [800, 120], [1040, 120]], 6);
  for (const x of [560, 640, 720, 800, 880, 960]) shape(c, () => { c.moveTo(x - 20, 124); c.quadraticCurveTo(x - 24, 230, x + 4, 290); c.quadraticCurveTo(x + 30, 220, x + 20, 124); c.closePath(); }, COL.red, 5);
  // ledge
  shape(c, () => rrect(c, 0, 760, D, 80, 6), COL.woodDk);
  // cloth and vadams
  shape(c, () => polyP(c, [[60, 760], [560, 760], [600, 700], [100, 700]]), "#f7f3e8");
  for (const [x, y] of [[160, 730], [270, 730], [380, 730], [490, 730], [210, 700], [320, 700], [430, 700]]) { shape(c, () => ell(c, x, y, 52, 20), "#f3dfae", 5); dot(c, x - 10, y - 2, 4, "#d6bf86", 0); }
  // jar of pickle
  const jar = () => { c.moveTo(770, 480); c.lineTo(960, 480); c.quadraticCurveTo(990, 490, 990, 540); c.lineTo(990, 720); c.quadraticCurveTo(990, 760, 950, 760); c.lineTo(780, 760); c.quadraticCurveTo(740, 760, 740, 720); c.lineTo(740, 540); c.quadraticCurveTo(740, 490, 770, 480); c.closePath(); };
  shape(c, jar, "rgba(214,236,250,0.55)", 6);
  c.save(); c.beginPath(); jar(); c.clip(); for (const [x, y, rot] of [[820, 690, 0.3], [920, 680, -0.4], [860, 600, 0.1], [920, 560, 0.3]]) lemon(c, x, y, 50, rot); c.restore();
  c.beginPath(); jar(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  shape(c, () => rrect(c, 760, 440, 220, 52, 12), COL.teal);
  shine(c, [[765, 540], [765, 700]], 9);
};

// ---------------------------------------------------------------- 29 expl fermenting and spoiling batter
const xBatter = (c: Ctx) => {
  ground(c);
  counter(c, 820);
  // risen batter
  const vessel = (x: number) => { shape(c, () => rrect(c, x - 150, 520, 300, 300, 24), COL.steel); shade(c, () => rrect(c, x - 150, 520, 300, 300, 24), COL.steelDk, 80, 0, 0.55); };
  vessel(280);
  shape(c, () => { c.moveTo(130, 530); c.quadraticCurveTo(140, 360, 280, 380); c.quadraticCurveTo(420, 360, 430, 530); c.closePath(); }, "#fffdf5", 5);
  for (const [x, y, r] of [[220, 450, 16], [300, 420, 22], [350, 480, 14], [260, 500, 10], [190, 500, 12]]) dot(c, x, y, r, "#fff", 4);
  tick(c, 280, 250, 55);
  // spoiled batter
  vessel(800);
  shape(c, () => ell(c, 800, 520, 150, 34), "#a8b09a", 5);
  const r = rnd(4); for (let i = 0; i < 26; i++) dot(c, 680 + r() * 240, 505 + r() * 30, 10, i % 2 ? "#6f8a5e" : "#c7ccb8", 0);
  fly(c, 880, 400, 1.2, 2.4);
  cross(c, 800, 250, 50);
  write(c, "1", 262, 880, 90, INK, 10); write(c, "3", 780, 880, 90, INK, 10);
  sun(c, 400, 905, 28);
};

export const ic_foodFoodSafetyL3 = cards("sci.food.food-safety.L3 cards", [intro, cover, e1, e2, e3, a1, a2, a3, a4, a5, a6, p1, c1, c2, tMicrobe, tBacteria, tSpore, tMultiply, tSpoil, tPoison, tContaminate, tPasteurise, tPreserve, xMeal, xTime, xWash, xHeat, xBoards, xOld, xBatter]);
