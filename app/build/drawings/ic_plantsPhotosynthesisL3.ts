import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, write, person, cards } from "./flatKit";

// PICTURES FOR THE CARDS · sci.plants.photosynthesis.L3 · flat kit
const BLK = "#4a4558", WET = "#8fc3ea";
const dropP = (c: Ctx, x: number, y: number, s: number) => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 0.3, y - s * 0.6, x + s, y + s * 0.2); c.arc(x, y + s * 0.2, s, 0, Math.PI); c.quadraticCurveTo(x - s * 0.3, y - s * 0.6, x, y - s * 1.5); c.closePath(); };
const drop = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => dropP(c, x, y, s), COL.water, Math.max(3, s * 0.12)); shine(c, [[x - s * 0.45, y - s * 0.1], [x - s * 0.4, y + s * 0.4]], Math.max(3, s * 0.18)); };
const ball = (c: Ctx, x: number, y: number, r: number, col: string) => { const p = () => ell(c, x, y, r, r); shape(c, p, col, Math.max(3, r * 0.1)); shade(c, p, "rgba(0,0,0,0.22)", -r * 0.3, -r * 0.3, 1); c.beginPath(); ell(c, x - r * 0.35, y - r * 0.35, r * 0.18, r * 0.12, -0.7); c.fillStyle = "rgba(255,255,255,0.7)"; c.fill(); };
const O2 = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - 30 * s, y], [x + 30 * s, y]], 14 * s, INK); ball(c, x - 30 * s, y, 30 * s, COL.red); ball(c, x + 30 * s, y, 30 * s, COL.red); };
const CO2 = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - 66 * s, y], [x + 66 * s, y]], 16 * s, INK); ball(c, x - 66 * s, y, 30 * s, COL.red); ball(c, x + 66 * s, y, 30 * s, COL.red); ball(c, x, y, 28 * s, BLK); };
const H2O = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - 46 * s, y - 34 * s], [x, y], [x + 46 * s, y - 34 * s]], 14 * s, INK); ball(c, x, y, 38 * s, COL.red); ball(c, x - 46 * s, y - 34 * s, 22 * s, WHITE); ball(c, x + 46 * s, y - 34 * s, 22 * s, WHITE); };
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6, p = [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]]; line(c, p, 18, INK); line(c, p, 9, COL.yellow); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6); shade(c, () => ell(c, x, y, r, r), COL.orange, -r * 0.2, -r * 0.2, 0.6);
};
// a leaf from base (x, y) pointing at an, with side veins
const lf = (c: Ctx, x: number, y: number, len: number, an: number, col: string = COL.leaf, wf = 0.3, dk: string = COL.leafDk) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len, nx = -Math.sin(an) * len * wf, ny = Math.cos(an) * len * wf, mx = (x + tx) / 2, my = (y + ty) / 2;
  const p = () => { c.moveTo(x, y); c.quadraticCurveTo(mx + nx * 1.3, my + ny * 1.3, tx, ty); c.quadraticCurveTo(mx - nx * 1.3, my - ny * 1.3, x, y); c.closePath(); };
  shape(c, p, col, 6); shade(c, p, "rgba(0,0,0,0.25)", -len * 0.03, -len * 0.04, 1);
  line(c, [[x, y], [tx - (tx - x) * 0.04, ty - (ty - y) * 0.04]], 5, dk);
  for (let i = 1; i < 6; i++) for (const s of [-1, 1]) { const t = i / 6.5, bx = x + (tx - x) * t, by = y + (ty - y) * t, w = Math.sin(Math.PI * (t * 0.9 + 0.05)) * wf * len * 0.55; line(c, [[bx, by], [bx + Math.cos(an + s * 1.0) * w, by + Math.sin(an + s * 1.0) * w]], 3, dk); }
};
const cube = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => polyP(c, [[x - s, y - s * 0.4], [x, y - s * 0.9], [x + s, y - s * 0.4], [x, y + s * 0.1]]), WHITE, 5); shape(c, () => polyP(c, [[x - s, y - s * 0.4], [x, y + s * 0.1], [x, y + s * 1.1], [x - s, y + s * 0.6]]), "#ece6d8", 5); shape(c, () => polyP(c, [[x + s, y - s * 0.4], [x, y + s * 0.1], [x, y + s * 1.1], [x + s, y + s * 0.6]]), "#d6cfbf", 5); };
const bubble = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), "rgba(235,246,255,0.8)", Math.max(3, r * 0.14)); c.beginPath(); ell(c, x - r * 0.35, y - r * 0.35, r * 0.2, r * 0.13, -0.7); c.fillStyle = WHITE; c.fill(); };
const tree = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + 40 * s, y + 8, 190 * s, 24 * s);
  shape(c, () => polyP(c, [[x - 34 * s, y], [x - 20 * s, y - 280 * s], [x + 20 * s, y - 280 * s], [x + 34 * s, y]]), COL.brown, 6);
  shade(c, () => polyP(c, [[x - 34 * s, y], [x - 20 * s, y - 280 * s], [x + 20 * s, y - 280 * s], [x + 34 * s, y]]), COL.soilDk, -14 * s, 0, 0.6);
  for (const [dx, dy, r] of [[-110, -330, 110], [100, -340, 120], [0, -440, 130], [-30, -340, 120]]) { const p = () => ell(c, x + dx * s, y + dy * s, r * s, r * 0.85 * s); shape(c, p, COL.leaf, 6); shade(c, p, COL.leafDk, -r * 0.12 * s, -r * 0.12 * s, 0.6); }
};
const ring = (c: Ctx, x: number, y: number, r: number, col: string) => { c.beginPath(); ell(c, x, y, r, r); c.lineWidth = 8; c.strokeStyle = col; c.stroke(); };
// a round window, as for a zoom: clipped fill inside, thick ink ring
const zoom = (c: Ctx, x: number, y: number, r: number, fill: string, inner: () => void) => { shape(c, () => ell(c, x, y, r, r), fill, 0); c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); inner(); c.restore(); c.beginPath(); ell(c, x, y, r, r); c.lineWidth = 9; c.strokeStyle = INK; c.stroke(); };
const mango = (c: Ctx, x: number, y: number, s: number) => { const p = () => { c.moveTo(x - 90 * s, y); c.bezierCurveTo(x - 90 * s, y - 100 * s, x + 30 * s, y - 120 * s, x + 90 * s, y - 30 * s); c.bezierCurveTo(x + 110 * s, y + 70 * s, x + 20 * s, y + 110 * s, x - 40 * s, y + 90 * s); c.bezierCurveTo(x - 80 * s, y + 70 * s, x - 90 * s, y + 30 * s, x - 90 * s, y); c.closePath(); }; shape(c, p, COL.yellow, 6); shade(c, p, COL.orange, -22 * s, -22 * s, 0.75); c.beginPath(); c.moveTo(x - 10 * s, y - 100 * s); c.fillStyle = "rgba(0,0,0,0)"; lf(c, x - 6 * s, y - 100 * s, 90 * s, -0.5, COL.leaf, 0.3); };
const cottonBoll = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => polyP(c, [[x - 70 * s, y + 20 * s], [x - 90 * s, y - 50 * s], [x - 40 * s, y - 10 * s], [x, y - 80 * s], [x + 40 * s, y - 10 * s], [x + 90 * s, y - 50 * s], [x + 70 * s, y + 20 * s], [x, y + 60 * s]]), COL.brown, 6); for (const [dx, dy, r] of [[-45, -50, 48], [45, -50, 48], [0, -85, 50], [0, -30, 55]]) { const p = () => ell(c, x + dx * s, y + dy * s, r * s, r * s); shape(c, p, WHITE, 5); shade(c, p, "#d8d2c4", -r * 0.2 * s, -r * 0.2 * s, 0.8); } };

// ---------------------------------------------------------------- flows
// e1: three glasses: light + baking soda (discs float up), dark box (discs stay down), light + plain (discs stay down)
const disc = (c: Ctx, x: number, y: number, r = 24) => { const p = () => ell(c, x, y, r, r * 0.6, 0.1); shape(c, p, COL.green, 4); shade(c, p, COL.greenDk, -r * 0.3, -r * 0.25, 0.7); };
const f_e1 = (c: Ctx) => {
  ground(c); const gx = [190, 540, 890];
  // the dark box for cup B
  shadow(c, 560, 925, 190, 24);
  shape(c, () => rrect(c, 410, 480, 260, 440, 10), "#4a3a2a", 6);
  shape(c, () => rrect(c, 430, 500, 220, 420, 6), "#1f1a22", 4);
  for (const i of [0, 1, 2]) { const x = gx[i], lit = i !== 1; if (lit) { sun(c, x, 180, 62); } glass(c, x, 900, i === 1 ? 190 : 250, i === 1 ? 330 : 400, 0.82, WET); }
  for (const [x, y] of [[165, 610], [200, 590], [235, 625], [205, 640]]) disc(c, x, y);
  for (const [x, y] of [[170, 700], [220, 660], [160, 780]]) bubble(c, x, y, 11);
  arrow(c, [[75, 780], [75, 600]]);
  for (const [x, y] of [[505, 862], [545, 870], [585, 860], [525, 850]]) disc(c, x, y, 20);
  for (const [x, y] of [[860, 868], [895, 876], [930, 866], [880, 852]]) disc(c, x, y, 24);
};
// e2: a leaf with a black paper star clipped on, then the same leaf after iodine: dark everywhere but the star
const star = (c: Ctx, x: number, y: number, R: number, r: number) => { const pts: number[][] = []; for (let i = 0; i < 10; i++) { const a = (i * Math.PI) / 5 - Math.PI / 2, k = i % 2 ? r : R; pts.push([x + Math.cos(a) * k, y + Math.sin(a) * k]); } polyP(c, pts); };
const f_e2 = (c: Ctx) => {
  ground(c);
  lf(c, 250, 930, 720, -Math.PI / 2, COL.leaf, 0.2); shadow(c, 290, 940, 120, 14);
  shape(c, () => star(c, 250, 560, 125, 52), "#1f1a22", 6);
  for (const y of [470, 650]) { shape(c, () => rrect(c, 160, y - 12, 180, 24, 12), COL.steel, 4); }
  lf(c, 830, 930, 720, -Math.PI / 2, "#3b3a78", 0.2, "#25244f");
  shape(c, () => star(c, 830, 560, 125, 52), "#efe3b0", 6);
  arrow(c, [[420, 560], [650, 560]]);
};
// a1: a mango stone, an arrow, a big tree
const f_a1 = (c: Ctx) => {
  ground(c);
  const p = () => { c.moveTo(160, 560); c.bezierCurveTo(130, 450, 250, 400, 330, 470); c.bezierCurveTo(400, 540, 360, 650, 260, 660); c.bezierCurveTo(200, 665, 170, 620, 160, 560); c.closePath(); };
  shadow(c, 270, 700, 150, 22); shape(c, p, "#c9b27a", 6); shade(c, p, "#9c8650", -24, -20, 0.7);
  line(c, [[200, 480], [260, 640]], 4, "#9c8650"); line(c, [[250, 450], [310, 610]], 4, "#9c8650");
  arrow(c, [[400, 560], [520, 560]]);
  tree(c, 770, 900, 1.15);
};
// a2: a child blows through a straw into a glass of limewater; it goes milky
const f_a2 = (c: Ctx) => {
  ground(c);
  person(c, 190, 1010, 800, {});
  glass(c, 770, 920, 330, 420, 0.62, "#ece9df");
  shape(c, () => ell(c, 770, 920 - 420 * 0.62, 150, 22), "#f7f5ee", 0);
  line(c, [[230, 330], [330, 345], [610, 400], [700, 470], [720, 760]], 28, INK); line(c, [[230, 330], [330, 345], [610, 400], [700, 470], [720, 760]], 16, "#f7f2de");
  for (const [x, y, r] of [[700, 790, 14], [735, 745, 11], [760, 690, 15], [700, 660, 9], [785, 620, 12]]) bubble(c, x, y, r);
};
// a3: chalk standing in green spirit, the colours climbing it in bands
const f_a3 = (c: Ctx) => {
  ground(c);
  lf(c, 90, 740, 280, -0.9, COL.leaf, 0.3); lf(c, 120, 800, 280, -0.5, COL.leafDk, 0.3, "#27531f");
  bowl(c, 600, 700, 330, "#2f6e2a");
  const bands: [number, number, string][] = [[210, 290, "#f2d03a"], [290, 380, "#c8d44a"], [380, 520, "#6aa53f"], [520, 700, "#2f6e2a"]];
  shadow(c, 660, 705, 70, 16);
  shape(c, () => rrect(c, 540, 210, 110, 500, 14), WHITE, 6);
  c.save(); c.beginPath(); rrect(c, 540, 210, 110, 500, 14); c.clip(); for (const [a, b, col] of bands) { c.fillStyle = col; c.fillRect(540, a, 110, b - a); } c.restore();
  shape(c, () => rrect(c, 540, 210, 110, 500, 14), "rgba(0,0,0,0)", 6);
  shade(c, () => rrect(c, 540, 210, 110, 500, 14), "rgba(0,0,0,0.3)", -22, 0, 1);
  arrow(c, [[790, 640], [790, 340]]);
};
// a4: 6 CO2 + 6 water in, one sugar ring + 6 O2 out
const f_a4 = (c: Ctx) => {
  ground(c);
  write(c, "6", 70, 220, 90); CO2(c, 330, 280, 1.3);
  write(c, "6", 70, 600, 90); H2O(c, 330, 680, 1.8);
  arrow(c, [[500, 470], [610, 470]]);
  const cx = 790, cy = 400, R = 120;
  const pts = [0, 1, 2, 3, 4, 5].map((i) => [cx + Math.cos((i * Math.PI) / 3 - Math.PI / 2) * R, cy + Math.sin((i * Math.PI) / 3 - Math.PI / 2) * R]);
  line(c, [...pts, pts[0]], 18, INK); line(c, [pts[0], [cx, cy - R * 1.8]], 18, INK);
  pts.forEach(([x, y], i) => ball(c, x, y, 38, i === 3 ? COL.red : BLK));
  ball(c, cx, cy - R * 1.8, 38, BLK);
  for (const [x, y] of [[cx - 90, cy - R * 1.8 - 30], [cx + 90, cy - R * 1.8 - 30]]) { line(c, [[cx, cy - R * 1.8], [x, y]], 12, INK); ball(c, x, y, 26, WHITE); }
  for (const [x, y] of [[cx - R * 1.05 - 40, cy - 60], [cx + R * 1.05 + 40, cy - 60], [cx + R * 1.05 + 40, cy + 100], [cx - R * 1.05 - 40, cy + 100]]) ball(c, x, y, 26, WHITE);
  write(c, "6", 640, 780, 90); O2(c, 840, 830, 1.4);
};
// a5: dry twigs on a scale, then a little ash and the rest gone into the air
const twigs = (c: Ctx, x: number, y: number) => { const r = rnd(3); for (let i = 0; i < 9; i++) { const a = -0.3 + r() * 0.6 + (i % 2 ? 1.2 : 0), l = 120 + r() * 40, ox = x + (r() - 0.5) * 120; line(c, [[ox - Math.cos(a) * l, y - Math.sin(a) * l * 0.4 - r() * 30], [ox + Math.cos(a) * l, y + Math.sin(a) * l * 0.4 - r() * 30]], 15, INK); line(c, [[ox - Math.cos(a) * l, y - Math.sin(a) * l * 0.4 - r() * 30 + 0], [ox + Math.cos(a) * l, y + Math.sin(a) * l * 0.4]], 0.1, COL.brown); } };
const scale = (c: Ctx, x: number, y: number, txt: string) => {
  shadow(c, x + 10, y + 100, 240, 24);
  shape(c, () => polyP(c, [[x - 200, y - 20], [x + 200, y - 20], [x + 250, y + 60], [x - 250, y + 60]]), COL.teal);
  shape(c, () => polyP(c, [[x - 250, y + 60], [x + 250, y + 60], [x + 250, y + 120], [x - 250, y + 120]]), COL.tealDk);
  shape(c, () => rrect(c, x - 110, y + 70, 220, 42, 6), "#22303a", 4); write(c, txt, x - 50, y + 76, 28, "#c9f06b", 5);
};
const f_a5 = (c: Ctx) => {
  ground(c);
  scale(c, 270, 700, "20 g");
  shape(c, () => { c.moveTo(130, 600); c.bezierCurveTo(150, 700, 390, 700, 410, 600); c.closePath(); }, COL.steel);
  twigs(c, 270, 540);
  shape(c, () => ell(c, 270, 600, 140, 20), COL.steelIn, 5);
  scale(c, 810, 700, "1 g");
  shape(c, () => { c.moveTo(670, 600); c.bezierCurveTo(690, 700, 930, 700, 950, 600); c.closePath(); }, COL.steel);
  shape(c, () => ell(c, 810, 600, 140, 20), COL.steelIn, 5);
  shape(c, () => { c.moveTo(740, 600); c.quadraticCurveTo(810, 550, 880, 600); c.closePath(); }, "#a9a49c", 4);
  arrow(c, [[780, 480], [740, 360], [800, 250], [770, 140]]);
  arrow(c, [[450, 560], [600, 560]]);
  for (const [x, y, r] of [[900, 400, 18], [940, 290, 24], [850, 190, 20]]) bubble(c, x, y, r);
};
// a6: a sunbeam dancer with a yellow cloth, a leaf dancer with green cloth opening up
const f_a6 = (c: Ctx) => {
  ground(c);
  person(c, 330, 1000, 760, { armL: [-1.1, -0.6], armR: [-0.9, -0.4] });
  c.save(); c.translate(330, 70); c.scale(0.5, 0.5);
  shape(c, () => { c.moveTo(150, 330); c.bezierCurveTo(60, 200, 260, 100, 320, 190); c.bezierCurveTo(380, 260, 330, 320, 460, 310); c.bezierCurveTo(380, 410, 200, 440, 150, 330); c.closePath(); }, COL.yellow, 10);
  shade(c, () => { c.moveTo(150, 330); c.bezierCurveTo(60, 200, 260, 100, 320, 190); c.bezierCurveTo(380, 260, 330, 320, 460, 310); c.bezierCurveTo(380, 410, 200, 440, 150, 330); c.closePath(); }, COL.orange, -30, -30, 0.7);
  c.restore();
  person(c, 780, 1000, 760, { adult: true, armL: [-2.3, -1.9], armR: [-0.8, -1.2] });
  c.save(); c.translate(-320, -2); c.scale(1.4, 0.6);
  shape(c, () => { c.moveTo(640, 330); c.bezierCurveTo(580, 220, 700, 120, 770, 190); c.bezierCurveTo(840, 120, 970, 200, 920, 320); c.bezierCurveTo(870, 400, 700, 420, 640, 330); c.closePath(); }, COL.leaf, 9);
  c.restore();
};
// c2: three glasses of discs, a stopwatch above
const f_c2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 450, 150, 20);
  shape(c, () => rrect(c, 520, 120, 40, 50, 8), COL.steel, 5);
  shape(c, () => ell(c, 540, 300, 150, 150), WHITE, 7); shade(c, () => ell(c, 540, 300, 150, 150), "rgba(0,0,0,0.12)", -20, -20, 1);
  shape(c, () => ell(c, 540, 300, 118, 118), COL.paper, 4);
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[540 + Math.cos(a) * 95, 300 + Math.sin(a) * 95], [540 + Math.cos(a) * 112, 300 + Math.sin(a) * 112]], 5); }
  line(c, [[540, 300], [610, 235]], 9, RED); shape(c, () => ell(c, 540, 300, 12, 12), INK, 0);
  const gl: [number, number][] = [[200, 0], [540, 1], [880, 2]];
  for (const [x] of gl) glass(c, x, 920, 250, 330, 0.8, WET);
  for (const [x, y] of [[170, 650], [210, 640], [250, 655], [150, 625], [195, 610]]) disc(c, x, y, 20);
  for (const [x, y] of [[510, 640], [550, 650], [590, 640], [530, 620], [575, 610]]) disc(c, x, y, 20);
  for (const [x, y] of [[850, 650], [890, 640], [930, 655], [870, 625], [915, 612]]) disc(c, x, y, 20);
  for (const x of [200, 540, 880]) arrow(c, [[x, 580], [x, 520]]);
};

// ---------------------------------------------------------------- terms
// term.0 photosynthesis: light, air, water in; sugar stays, oxygen leaves
const t_photo = (c: Ctx) => {
  ground(c);
  lf(c, 330, 680, 620, -0.28, COL.leaf, 0.28);
  sun(c, 150, 160, 70); arrow(c, [[240, 250], [400, 500]]);
  CO2(c, 150, 520, 0.9); arrow(c, [[260, 560], [340, 620]]);
  drop(c, 150, 860, 52); arrow(c, [[220, 830], [330, 730]]);
  cube(c, 640, 560, 48);
  arrow(c, [[740, 470], [800, 330]]); O2(c, 840, 230, 1.2);
  for (const [x, y, r] of [[930, 330, 20], [960, 220, 15], [750, 180, 17]]) bubble(c, x, y, r);
};
// term.2 carbon dioxide: a child breathes out, puffs drift to a leaf
const t_co2 = (c: Ctx) => {
  ground(c);
  person(c, 200, 1020, 800);
  for (const [x, y, r] of [[420, 370, 50], [560, 340, 62], [700, 330, 54]]) { shape(c, () => ell(c, x, y, r, r * 0.8), "rgba(255,255,255,0.85)", 4); CO2(c, x, y, 0.38); }
  arrow(c, [[780, 400], [850, 460]]);
  line(c, [[900, 1000], [900, 640]], 14, COL.greenDk); lf(c, 900, 700, 260, -2.3, COL.leaf, 0.3); lf(c, 900, 650, 270, -0.9, COL.leaf, 0.3);
};
// term.3 oxygen: a water plant in a glass, silver bubbles rising
const t_o2 = (c: Ctx) => {
  ground(c);
  glass(c, 540, 930, 440, 620, 0.85, WET);
  for (const x of [440, 540, 640]) { const top = 560 + (x % 3) * 40; line(c, [[x, 920], [x + 10, (920 + top) / 2], [x - 5, top]], 10, INK); line(c, [[x, 920], [x + 10, (920 + top) / 2], [x - 5, top]], 5, COL.greenDk); for (let k = 0; k < 5; k++) { const y = 880 - k * 80; if (y > top) { lf(c, x + 3, y, 55, -0.6, COL.leaf, 0.3); lf(c, x + 3, y, 55, Math.PI + 0.6, COL.leaf, 0.3); } } }
  for (const [x, y, r] of [[470, 520, 16], [610, 480, 14], [520, 440, 20], [580, 600, 12], [650, 540, 15], [500, 360, 17], [560, 300, 13]]) bubble(c, x, y, r);
  arrow(c, [[540, 300], [540, 150]]);
};
// term.4 sugar: sugarcane and a glass of its juice
const cane = (c: Ctx, x: number, y: number, h: number, tilt: number) => {
  const top = [x + tilt * h, y - h];
  shape(c, () => { c.moveTo(x - 22, y); c.lineTo(top[0] - 18, top[1]); c.lineTo(top[0] + 18, top[1]); c.lineTo(x + 22, y); c.closePath(); }, "#7b5aa6", 6);
  shade(c, () => { c.moveTo(x - 22, y); c.lineTo(top[0] - 18, top[1]); c.lineTo(top[0] + 18, top[1]); c.lineTo(x + 22, y); c.closePath(); }, "#4f3877", -10, 0, 0.6);
  for (let k = 1; k < 5; k++) { const t = k / 5, px = x + tilt * h * t, py = y - h * t; line(c, [[px - 24, py], [px + 24, py]], 6, "#d9c07a"); }
  for (const a of [-2.3, -0.8]) lf(c, top[0], top[1], 190, a, COL.leaf, 0.12);
};
const t_sugar = (c: Ctx) => {
  ground(c);
  shadow(c, 300, 930, 230, 22);
  cane(c, 160, 920, 640, 0.04); cane(c, 290, 920, 700, -0.02); cane(c, 420, 920, 600, -0.08);
  arrow(c, [[520, 640], [640, 640]]);
  glass(c, 820, 920, 280, 380, 0.78, "#c9d96a");
  cube(c, 820, 360, 50);
};
// term.5 starch: rice, potato, roti, and a zoom into chains of sugar beads
const beadChain = (c: Ctx, pts: number[][], r: number, col: string) => { line(c, pts, 8); pts.forEach(([x, y]) => ball(c, x, y, r, col)); };
const t_starch = (c: Ctx) => {
  ground(c);
  plate(c, 440, 760, 400, 200);
  shape(c, () => ell(c, 540, 770, 130, 110), "#e4c98a", 6); shade(c, () => ell(c, 540, 770, 130, 110), "#b9945a", -20, -16, 0.6);
  shape(c, () => { c.moveTo(210, 770); c.bezierCurveTo(230, 680, 400, 690, 420, 760); c.bezierCurveTo(430, 840, 240, 860, 210, 770); c.closePath(); }, "#e8c25a", 6);
  const r = rnd(5); shape(c, () => { c.moveTo(280, 700); c.quadraticCurveTo(350, 600, 420, 700); c.closePath(); }, WHITE, 0);
  for (let i = 0; i < 40; i++) { const a = r() * Math.PI, d = r(), x = 350 + Math.cos(a) * 80 * d * 1.2 + (r() - 0.5) * 20, y = 690 - Math.sin(a) * 70 * d; shape(c, () => ell(c, x, y, 13, 5, r() * 3), WHITE, 3); }
  shape(c, () => ell(c, 540, 770, 4, 4), "#b9945a", 0);
  shape(c, () => ell(c, 680, 790, 90, 62, 0.2), "#d6a05a", 6); shade(c, () => ell(c, 680, 790, 90, 62, 0.2), "#a97538", -16, -12, 0.6);
  zoom(c, 780, 270, 220, COL.paper, () => { beadChain(c, [[620, 210], [680, 250], [740, 220], [800, 260], [860, 230], [920, 270]], 24, COL.yellow); beadChain(c, [[620, 310], [680, 340], [740, 305], [800, 345], [860, 315], [920, 350]], 24, COL.yellow); beadChain(c, [[680, 160], [740, 130], [800, 160], [860, 135]], 22, COL.yellow); });
  line(c, [[700, 460], [680, 700]], 6); line(c, [[870, 460], [720, 700]], 6);
};
// term.6 iodine test: starch goes blue-black, sugar stays brown
const t_iodine = (c: Ctx) => {
  ground(c);
  shadow(c, 320, 800, 230, 50);
  shape(c, () => ell(c, 300, 760, 240, 160), "#e8d6a0", 7); shape(c, () => ell(c, 300, 760, 200, 125), "#f4ead0", 4);
  shape(c, () => ell(c, 300, 760, 70, 52), "#25244f", 0);
  shadow(c, 810, 800, 190, 36);
  line(c, [[960, 700], [840, 790], [720, 770]], 34, INK); line(c, [[960, 700], [840, 790], [720, 770]], 20, COL.steel);
  shape(c, () => ell(c, 720, 770, 130, 84, -0.2), COL.steel, 6); shape(c, () => ell(c, 720, 768, 108, 62, -0.2), WHITE, 3);
  const r = rnd(2); for (let i = 0; i < 22; i++) { const a = r() * 6.28, d = Math.sqrt(r()); shape(c, () => ell(c, 720 + Math.cos(a) * d * 90, 768 + Math.sin(a) * d * 44, 8, 8), "#f7f7f7", 2.5); }
  shape(c, () => ell(c, 730, 770, 44, 26, -0.2), "#9b5a24", 0);
  // dropper over the potato
  shape(c, () => rrect(c, 280, 130, 44, 120, 20), COL.black); shape(c, () => rrect(c, 268, 240, 68, 30, 6), COL.steel, 5);
  shape(c, () => polyP(c, [[280, 270], [324, 270], [308, 440], [296, 440]]), "rgba(214,236,250,0.7)", 5);
  shape(c, () => dropP(c, 302, 530, 22), "#8a4a1c", 4); shape(c, () => dropP(c, 800, 380, 22), "#8a4a1c", 4);
};
// term.7 chlorophyll: sunbeam split by a prism; red and blue go into the leaf, green bounces to an eye
const t_chloro = (c: Ctx) => {
  ground(c);
  sun(c, 130, 190, 65);
  line(c, [[210, 230], [380, 290]], 26, INK); line(c, [[210, 230], [380, 290]], 14, WHITE);
  shape(c, () => polyP(c, [[380, 190], [500, 400], [320, 400]]), "rgba(214,236,250,0.8)", 6);
  const rays: [string, number][] = [[RED, 500], [COL.orange, 560], [COL.yellow, 620], [COL.green, 690], [COL.blue, 760], [COL.purple, 820]];
  rays.forEach(([col, ty]) => { line(c, [[480, 330], [620 + (ty - 500) * 0.25, ty + 120]], 22, INK); line(c, [[480, 330], [620 + (ty - 500) * 0.25, ty + 120]], 12, col); });
  lf(c, 340, 930, 700, -0.12, COL.leaf, 0.2);
  line(c, [[700, 800], [790, 560], [870, 330]], 22, INK); line(c, [[700, 800], [790, 560], [870, 330]], 12, "#6bd34a"); // bouncing green
  shape(c, () => ell(c, 880, 230, 90, 56), WHITE, 6); ball(c, 880, 230, 38, COL.teal); shape(c, () => ell(c, 880, 230, 15, 15), INK, 0);
};
// term.8 chloroplast: a microscope view, leaf cells like rooms packed with green ovals
const t_chlorop = (c: Ctx) => {
  ground(c);
  zoom(c, 540, 540, 440, "#cfe8b8", () => {
    const r = rnd(8);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const x = 150 + i * 290, y = 150 + j * 290; shape(c, () => rrect(c, x, y, 270, 270, 36), "#eaf6dc", 7); for (let k = 0; k < 7; k++) { const px = x + 50 + r() * 170, py = y + 50 + r() * 170; shape(c, () => ell(c, px, py, 30, 20, r() * 3), COL.green, 4); shade(c, () => ell(c, px, py, 30, 20, 0), COL.greenDk, -8, -6, 0.5); } }
  });
};
// term.9 stomata: the leaf underside, two mouths each with two curved guard cells
const stoma = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => ell(c, x, y, 150 * s, 100 * s), "#2a3f2b", 7);
  for (const d of [-1, 1]) { const p = () => ell(c, x, y + d * 56 * s, 150 * s, 50 * s); shape(c, p, COL.greenLt, 7); shade(c, p, COL.green, -10, -8, 0.6); shape(c, () => ell(c, x - d * 20 * s, y + d * 56 * s, 22 * s, 16 * s), COL.leafDk, 4); }
};
const t_stomata = (c: Ctx) => {
  ground(c);
  zoom(c, 540, 540, 450, "#dcefc4", () => {
    const r = rnd(4);
    for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) { const x = 60 + i * 150 + (j % 2) * 70, y = 60 + j * 140; shape(c, () => rrect(c, x, y, 140 + r() * 14, 126, 40), "#c4e3a2", 4); }
    stoma(c, 540, 540, 1.1);
  });
  arrow(c, [[540, 120], [540, 330]]);
};
// term.10 atom: zoom from a leaf into a cluster of tiny coloured balls
const t_atom = (c: Ctx) => {
  ground(c);
  lf(c, 70, 960, 520, -0.9, COL.leaf, 0.3);
  line(c, [[300, 640], [450, 420]], 6); line(c, [[320, 740], [530, 790]], 6);
  shape(c, () => ell(c, 320, 690, 34, 34), "rgba(255,255,255,0.35)", 6);
  zoom(c, 700, 540, 330, COL.paper, () => { ball(c, 640, 460, 80, BLK); ball(c, 780, 600, 70, COL.red); ball(c, 600, 640, 50, WHITE); ball(c, 800, 440, 50, WHITE); ball(c, 700, 720, 60, COL.red); });
};
// term.11 molecule: a water molecule, a big red ball with two small white balls like ears
const t_mol = (c: Ctx) => {
  ground(c);
  drop(c, 190, 800, 80); line(c, [[260, 700], [350, 590]], 6);
  zoom(c, 650, 520, 380, COL.paper, () => { H2O(c, 650, 590, 3.2); });
};
// term.12 carbon: a burnt dosa edge, a lump of charcoal, a little black ball
const t_carbon = (c: Ctx) => {
  ground(c);
  shadow(c, 330, 800, 250, 34);
  shape(c, () => ell(c, 320, 650, 260, 150), "#e2b868", 7); shade(c, () => ell(c, 320, 650, 260, 150), "#bb8a40", -20, -14, 0.5);
  c.save(); c.beginPath(); ell(c, 320, 650, 260, 150); c.clip(); c.beginPath(); ell(c, 320, 650, 260, 150); ell(c, 280, 630, 200, 108); c.fillStyle = "#34282a"; c.fill("evenodd"); c.restore();
  shape(c, () => ell(c, 320, 650, 260, 150), "rgba(0,0,0,0)", 7);
  shadow(c, 800, 800, 190, 28);
  const lump = () => { c.moveTo(640, 760); c.lineTo(670, 640); c.lineTo(760, 600); c.lineTo(850, 640); c.lineTo(950, 620); c.lineTo(980, 720); c.lineTo(930, 790); c.closePath(); };
  shape(c, lump, "#3a3540", 7); shade(c, lump, "#1f1a22", -20, -16, 0.7); shine(c, [[700, 650], [760, 625]], 8);
  ball(c, 540, 280, 140, BLK);
  arrow(c, [[500, 450], [520, 440]], RED, 0.1);
};
// term.13 energy: the Sun, a mango, a child running
const t_energy = (c: Ctx) => {
  ground(c);
  sun(c, 130, 500, 80); arrow(c, [[250, 500], [310, 500]]);
  mango(c, 450, 520, 1.4); arrow(c, [[580, 520], [630, 520]]);
  person(c, 810, 900, 560, { armL: [2.3, 1.6], armR: [-0.5, 0.2] });
};
// term.14 photon: a sunbeam as a stream of glowing dots raining on a leaf
const t_photon = (c: Ctx) => {
  ground(c);
  sun(c, 260, 160, 80);
  for (let k = 0; k < 3; k++) for (let i = 0; i < 6; i++) { const t = i / 5, x = 240 + k * 80 + t * 340, y = 360 + t * 400; shape(c, () => ell(c, x, y, 22, 22), "rgba(255,230,120,0.95)", 3); shape(c, () => ell(c, x, y, 9, 9), WHITE, 0); }
  lf(c, 200, 960, 760, -0.35, COL.leaf, 0.22);
};
// term.15 respiration: a plant and a child both take oxygen in and give carbon dioxide out
const pot = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => polyP(c, [[x - 90 * s, y - 100 * s], [x + 90 * s, y - 100 * s], [x + 66 * s, y], [x - 66 * s, y]]), "#c26b3a", 6); shape(c, () => rrect(c, x - 100 * s, y - 120 * s, 200 * s, 34 * s, 8), "#d27c4a", 6); line(c, [[x, y - 120 * s], [x, y - 360 * s]], 12, COL.greenDk); lf(c, x, y - 220 * s, 190 * s, -2.4, COL.leaf, 0.3); lf(c, x, y - 220 * s, 190 * s, -0.7, COL.leaf, 0.3); lf(c, x, y - 360 * s, 170 * s, -2.0, COL.leaf, 0.3); lf(c, x, y - 360 * s, 170 * s, -1.1, COL.leaf, 0.3); };
const t_resp = (c: Ctx) => {
  ground(c);
  pot(c, 250, 950, 1.5); person(c, 800, 960, 700);
  O2(c, 90, 330, 0.8); arrow(c, [[180, 380], [220, 470]]);
  CO2(c, 450, 330, 0.7); arrow(c, [[400, 480], [440, 400]]);
  O2(c, 950, 230, 0.8); arrow(c, [[900, 280], [860, 340]]);
  CO2(c, 560, 640, 0.7); arrow(c, [[690, 640], [620, 640]]);
};
// term.16 cellulose: cotton, paper, a wooden spoon; zoom to straight chains of sugar beads
const t_cellulose = (c: Ctx) => {
  ground(c);
  zoom(c, 540, 290, 230, COL.paper, () => { for (let k = 0; k < 4; k++) beadChain(c, [[320, 190 + k * 70], [400, 190 + k * 70], [480, 190 + k * 70], [560, 190 + k * 70], [640, 190 + k * 70], [720, 190 + k * 70]], 24, COL.yellow); });
  line(c, [[420, 500], [250, 640]], 6); line(c, [[540, 520], [540, 640]], 6); line(c, [[660, 500], [830, 640]], 6);
  cottonBoll(c, 230, 800, 1.3);
  shadow(c, 560, 940, 120, 14);
  shape(c, () => polyP(c, [[440, 720], [650, 690], [680, 900], [470, 930]]), WHITE, 6); shade(c, () => polyP(c, [[440, 720], [650, 690], [680, 900], [470, 930]]), "#d8d2c4", -14, -10, 0.8);
  for (let k = 0; k < 4; k++) line(c, [[480 + k * 3, 760 + k * 40], [630 + k * 3, 745 + k * 40]], 3, COL.steelDk);
  shape(c, () => ell(c, 820, 800, 70, 100, 0.3), COL.wood, 6); line(c, [[870, 880], [960, 1000]], 36, INK); line(c, [[870, 880], [960, 1000]], 24, COL.wood);
  shade(c, () => ell(c, 820, 800, 70, 100, 0.3), COL.woodDk, -14, -10, 0.7);
};
// term.17 food chain: sunlight, grass, goat, leopard, joined by arrows
const grass = (c: Ctx, x: number, y: number, s: number) => { shadow(c, x, y + 4, 90 * s, 14 * s); for (const [dx, a, l] of [[-50, -1.9, 190], [-20, -1.7, 240], [10, -1.55, 270], [40, -1.4, 220], [65, -1.25, 170]]) lf(c, x + dx * s, y, l * s, a, COL.green, 0.07, COL.greenDk); };
const goat = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x, y + 4, 110 * s, 16 * s);
  for (const dx of [-60, -35, 40, 65]) { line(c, [[x + dx * s, y - 70 * s], [x + dx * s, y]], 18 * s, INK); line(c, [[x + dx * s, y - 70 * s], [x + dx * s, y]], 9 * s, "#b99b78"); }
  const b = () => ell(c, x, y - 100 * s, 100 * s, 58 * s); shape(c, b, "#b99b78", 6); shade(c, b, "#8f7352", -14 * s, -12 * s, 0.7);
  shape(c, () => ell(c, x + 120 * s, y - 150 * s, 36 * s, 30 * s, 0.3), "#b99b78", 6);
  line(c, [[x + 105 * s, y - 100 * s], [x + 135 * s, y - 150 * s]], 40 * s, INK); line(c, [[x + 105 * s, y - 100 * s], [x + 135 * s, y - 150 * s]], 30 * s, "#b99b78");
  shape(c, () => ell(c, x + 135 * s, y - 163 * s, 34 * s, 28 * s, 0.2), "#b99b78", 6);
  line(c, [[x + 125 * s, y - 188 * s], [x + 100 * s, y - 235 * s], [x + 78 * s, y - 220 * s]], 9 * s, INK);
  shape(c, () => ell(c, x + 144 * s, y - 168 * s, 5 * s, 5 * s), INK, 0); shape(c, () => ell(c, x + 165 * s, y - 150 * s, 5 * s, 4 * s), INK, 0);
  line(c, [[x + 150 * s, y - 135 * s], [x + 155 * s, y - 112 * s]], 7 * s, INK);
  line(c, [[x - 95 * s, y - 110 * s], [x - 118 * s, y - 135 * s]], 12 * s, INK);
};
const leopard = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x, y + 4, 130 * s, 16 * s);
  line(c, [[x - 100 * s, y - 100 * s], [x - 150 * s, y - 80 * s], [x - 160 * s, y - 20 * s], [x - 130 * s, y - 10 * s]], 24 * s, INK); line(c, [[x - 100 * s, y - 100 * s], [x - 150 * s, y - 80 * s], [x - 160 * s, y - 20 * s], [x - 130 * s, y - 10 * s]], 14 * s, COL.yellow);
  for (const dx of [-70, -40, 45, 75]) { line(c, [[x + dx * s, y - 70 * s], [x + dx * s, y]], 24 * s, INK); line(c, [[x + dx * s, y - 70 * s], [x + dx * s, y]], 14 * s, COL.yellow); }
  const b = () => ell(c, x, y - 95 * s, 115 * s, 55 * s); shape(c, b, COL.yellow, 6); shade(c, b, COL.orange, -14 * s, -12 * s, 0.7);
  const r = rnd(9); c.save(); c.beginPath(); b(); c.clip(); for (let i = 0; i < 12; i++) shape(c, () => ell(c, x - 90 * s + r() * 180 * s, y - 130 * s + r() * 70 * s, 11 * s, 9 * s), "#6a4128", 3); c.restore();
  shape(c, () => ell(c, x + 125 * s, y - 130 * s, 42 * s, 36 * s), COL.yellow, 6);
  shape(c, () => ell(c, x + 112 * s, y - 165 * s, 12 * s, 12 * s), COL.yellow, 5); shape(c, () => ell(c, x + 148 * s, y - 163 * s, 12 * s, 12 * s), COL.yellow, 5);
  shape(c, () => ell(c, x + 135 * s, y - 135 * s, 6 * s, 6 * s), INK, 0); shape(c, () => ell(c, x + 110 * s, y - 140 * s, 6 * s, 6 * s), INK, 0); shape(c, () => ell(c, x + 160 * s, y - 120 * s, 6 * s, 5 * s), INK, 0);
};
const t_chain = (c: Ctx) => {
  ground(c);
  sun(c, 200, 230, 75); arrow(c, [[300, 300], [430, 420]]);
  grass(c, 640, 600, 1.15); arrow(c, [[540, 640], [450, 710]]);
  goat(c, 250, 960, 1.05); arrow(c, [[420, 860], [580, 860]]);
  leopard(c, 800, 960, 1.0);
};
// term.20 minerals: a root hair taking in water with tiny coloured specks
const t_minerals = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.soil; c.fillRect(0, 300, 1080, 780); c.fillStyle = COL.soilDk; const r = rnd(6); for (let i = 0; i < 60; i++) { c.beginPath(); ell(c, r() * 1080, 300 + r() * 780, 10 + r() * 14, 8 + r() * 8, r() * 3); c.fill(); }
  line(c, [[0, 300], [1080, 300]], 7);
  const stem = [[540, 260], [560, 500], [520, 760]]; line(c, [[540, 130], ...stem], 70, INK); line(c, [[540, 130], ...stem], 56, "#f3e6c6");
  for (const [y, s] of [[420, 1], [460, -1], [540, 1], [600, -1], [680, 1], [730, -1]]) { const x = 545 + s * 28; line(c, [[x, y], [x + s * 150, y + 40]], 20, INK); line(c, [[x, y], [x + s * 150, y + 40]], 10, "#f3e6c6"); }
  const sp = [COL.pink, COL.yellow, COL.purple, COL.orange, COL.teal];
  for (let i = 0; i < 16; i++) { const x = 100 + r() * 880, y = 480 + r() * 400; if (Math.abs(x - 545) < 100) continue; shape(c, () => ell(c, x, y, 11, 11), sp[i % 5], 3); }
  for (const [x, y] of [[210, 560], [300, 760], [800, 640], [860, 800], [900, 470], [180, 820]]) drop(c, x, y, 26);
  arrow(c, [[250, 600], [350, 620]]); arrow(c, [[860, 520], [750, 475]]);
};

// ---------------------------------------------------------------- explanations
// expl.3 from sugar to everything
const rice = (c: Ctx, x: number, y: number) => { bowl(c, x, y, 110, "#f6f2e8"); const r = rnd(1); for (let i = 0; i < 24; i++) shape(c, () => ell(c, x - 70 + r() * 140, y - 5 + r() * 12, 14, 5, r() * 3), WHITE, 2.5); };
const e_sugar = (c: Ctx) => {
  ground(c);
  cube(c, 540, 520, 70);
  const it: [number, number][] = [[540, 140], [900, 360], [800, 800], [280, 800], [180, 360]];
  arrow(c, [[540, 440], [540, 300]]); arrow(c, [[640, 500], [770, 410]]); arrow(c, [[620, 640], [700, 730]]); arrow(c, [[460, 640], [380, 730]]); arrow(c, [[440, 500], [320, 410]]);
  rice(c, 540, 170);
  shadow(c, 900, 440, 100, 16); shape(c, () => polyP(c, [[800, 320], [980, 300], [1000, 360], [820, 390]]), COL.wood, 6); shape(c, () => polyP(c, [[820, 390], [1000, 360], [1000, 410], [820, 440]]), COL.woodDk, 6);
  cottonBoll(c, 800, 850, 1.2);
  shape(c, () => rrect(c, 230, 640, 110, 190, 24), COL.yellow, 6); shape(c, () => rrect(c, 262, 590, 46, 60, 8), COL.yellow, 6); shape(c, () => rrect(c, 252, 575, 66, 24, 6), COL.black, 5);
  bowl(c, 150, 400, 100, COL.yellow);
  for (const [x, y] of [[120, 405], [160, 412], [190, 400]]) shape(c, () => ell(c, x, y, 14, 7), "#d39a3a", 2);
  void it;
};
// expl.5 where the oxygen comes from: light splits water; hydrogen to the sugar, oxygen floats away
const e_split = (c: Ctx) => {
  ground(c);
  sun(c, 160, 160, 62);
  shape(c, () => polyP(c, [[330, 250], [420, 320], [380, 330], [470, 440], [330, 380], [370, 370]]), COL.yellow, 5);
  ball(c, 560, 560, 62, COL.red); ball(c, 360, 640, 36, WHITE); ball(c, 360, 480, 36, WHITE);
  arrow(c, [[470, 520], [420, 490]]); arrow(c, [[470, 600], [420, 630]]);
  const cx = 180, cy = 880;
  const pts = [0, 1, 2, 3, 4, 5].map((i) => [cx + Math.cos((i * Math.PI) / 3) * 70, cy + Math.sin((i * Math.PI) / 3) * 70]);
  line(c, [...pts, pts[0]], 12, INK); pts.forEach(([x, y]) => ball(c, x, y, 26, BLK));
  arrow(c, [[360, 700], [250, 820]]);
  arrow(c, [[640, 520], [760, 380]]); bubble(c, 820, 300, 70); O2(c, 820, 300, 0.8);
};
// expl.7 plants respire day and night
const e_resp = (c: Ctx) => {
  c.fillStyle = "#bfe0f5"; c.fillRect(0, 0, 1080, 540); c.fillStyle = "#2f2b63"; c.fillRect(0, 540, 1080, 540);
  line(c, [[0, 540], [1080, 540]], 8);
  sun(c, 920, 130, 50); pot(c, 260, 520, 0.9); person(c, 640, 520, 400);
  for (const [x, y, r] of [[400, 130, 40], [440, 240, 30], [150, 100, 28]]) { bubble(c, x, y, r); }
  O2(c, 430, 160, 0.6); arrow(c, [[330, 180], [380, 150]]);
  c.fillStyle = WHITE; for (const [x, y] of [[100, 600], [300, 640], [520, 590], [800, 610], [980, 680], [700, 700]]) { c.beginPath(); ell(c, x, y, 6, 6); c.fill(); }
  c.beginPath(); c.arc(920, 650, 55, 0.5, Math.PI * 1.5); c.fillStyle = "#f4ecc4"; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  pot(c, 260, 1060, 0.9); person(c, 640, 1060, 400);
  O2(c, 90, 720, 0.45); arrow(c, [[150, 760], [180, 800]]); CO2(c, 420, 760, 0.4); arrow(c, [[380, 800], [350, 840]]);
  O2(c, 780, 860, 0.45); arrow(c, [[740, 880], [700, 900]]);
};

export const ic_plantsPhotosynthesisL3 = cards("sci.plants.photosynthesis.L3 cards", [
  f_e1, f_e2, f_a1, f_a2, f_a3, f_a4, f_a5, f_a6, f_c2,
  t_photo, t_co2, t_o2, t_sugar, t_starch, t_iodine, t_chloro, t_chlorop, t_stomata, t_atom, t_mol, t_carbon, t_energy, t_photon, t_resp, t_cellulose, t_chain, t_minerals,
  e_sugar, e_split, e_resp,
]);
