import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, cards, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, rnd } from "./flatKit";

// FORECASTING THE WEATHER (L3) · five flat cards: the main idea (weather moves across the land, so
// tomorrow's rain is already somewhere else today), the forecast contest notebook, salt in the steamy
// bathroom, ground wind against cloud wind, and the finished book of tested sayings.

const SKY = "#bfe0f5", SKYDK = "#8fc3ea", GRASS = COL.green, RAIN = "#5b8fd6", DARKCLOUD = "#98a3b3", DARKCLOUDDK = "#6f7b8c";

const sky = (c: Ctx, horizon: number) => { ground(c, SKY); c.fillStyle = GRASS; c.fillRect(0, horizon, D, D - horizon); line(c, [[0, horizon], [D, horizon]], 6); };
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 7, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
};
// a puffy cloud, its bottom centre at (x, y), width w
const cloud = (c: Ctx, x: number, y: number, w: number, col = WHITE, dk = COL.steel) => {
  const p = () => { c.moveTo(x - w / 2, y); c.arc(x - w * 0.3, y - w * 0.12, w * 0.2, Math.PI * 0.9, Math.PI * 1.6); c.arc(x - w * 0.05, y - w * 0.3, w * 0.24, Math.PI * 1.1, Math.PI * 1.85); c.arc(x + w * 0.25, y - w * 0.15, w * 0.22, Math.PI * 1.3, Math.PI * 2.1); c.lineTo(x + w / 2, y); c.closePath(); };
  shape(c, p, col);
  shade(c, p, dk, -w * 0.06, -w * 0.08, 0.5);
};
const rain = (c: Ctx, x: number, y: number, w: number, n: number) => { for (let i = 0; i < n; i++) { const rx = x - w / 2 + (w * (i + 0.5)) / n; line(c, [[rx, y + 20], [rx - 14, y + 80]], 7, RAIN); } };
const tick = (c: Ctx, x: number, y: number, s: number) => line(c, [[x - s * 0.5, y], [x - s * 0.1, y + s * 0.4], [x + s * 0.6, y - s * 0.5]], s * 0.22, COL.green);
const cross = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - s * 0.45, y - s * 0.45], [x + s * 0.45, y + s * 0.45]], s * 0.22, RED); line(c, [[x + s * 0.45, y - s * 0.45], [x - s * 0.45, y + s * 0.45]], s * 0.22, RED); };
const house = (c: Ctx, x: number, y: number, w: number) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.7, w * 0.08);
  shape(c, () => rrect(c, x - w / 2, y - w * 0.7, w, w * 0.7, 6), COL.paper);
  shade(c, () => rrect(c, x - w / 2, y - w * 0.7, w, w * 0.7, 6), COL.grey, w * 0.3, 0, 0.35);
  shape(c, () => polyP(c, [[x - w * 0.6, y - w * 0.7], [x, y - w * 1.15], [x + w * 0.6, y - w * 0.7]]), COL.red);
  shape(c, () => rrect(c, x - w * 0.12, y - w * 0.4, w * 0.24, w * 0.4, 4), COL.woodDk);
  shape(c, () => rrect(c, x + w * 0.18, y - w * 0.58, w * 0.18, w * 0.18, 3), SKY);
};

// summary: weather moves. Sun over the house today; far away a rain cloud is already on its way (red arrow).
const summary = (c: Ctx) => {
  sky(c, 760);
  sun(c, 230, 220, 80);
  // a far hill and the sea on the right, where the cloud is
  shape(c, () => { c.moveTo(560, 760); c.quadraticCurveTo(760, 600, 1080, 700); c.lineTo(1080, 760); c.closePath(); }, COL.greenLt, 5);
  c.fillStyle = COL.water; c.fillRect(700, 720, 380, 40); line(c, [[700, 720], [1080, 720]], 5);
  house(c, 260, 760, 220);
  person(c, 420, 770, 230, { armR: [-0.3, -0.9] });
  cloud(c, 860, 420, 380, DARKCLOUD, DARKCLOUDDK);
  rain(c, 860, 430, 300, 6);
  arrow(c, [[650, 300], [500, 280], [370, 340]], RED, 14);
};

// e1: the contest notebook. Three columns (same-as-today, my own sky reading, the phone app),
// a week of ticks and crosses, totals under each. A hand with a pencil adds the last mark.
const e1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 360, 36);
  shape(c, () => rrect(c, 180, 110, 720, 820, 18), COL.paper);
  for (let i = 0; i < 8; i++) shape(c, () => ell(c, 230 + i * 92, 110, 14, 14), COL.steel, 4);
  line(c, [[180, 290], [900, 290]], 5); line(c, [[420, 150], [420, 900]], 4); line(c, [[660, 150], [660, 900]], 4);
  // headers: two same clouds · an eye looking up · a phone with a cloud
  cloud(c, 270, 235, 90); cloud(c, 340, 250, 90);
  shape(c, () => { c.moveTo(470, 215); c.quadraticCurveTo(540, 150, 610, 215); c.quadraticCurveTo(540, 280, 470, 215); c.closePath(); }, WHITE, 5);
  shape(c, () => ell(c, 540, 212, 24, 24), COL.blue, 4); shape(c, () => ell(c, 540, 212, 10, 10), INK, 0);
  shape(c, () => rrect(c, 740, 160, 80, 120, 10), COL.black, 5); shape(c, () => rrect(c, 748, 172, 64, 90, 6), SKY, 0); cloud(c, 780, 232, 50);
  // the week: same-as-today right 4 of 7, my sky 5 of 7, the app 6 of 7
  const marks: [number[], number[], number[]] = [[1, 1, 0, 1, 0, 1, 0], [1, 0, 1, 1, 1, 0, 1], [1, 1, 1, 0, 1, 1, 1]];
  marks.forEach((col, k) => col.forEach((m, i) => { const x = 300 + k * 240, y = 345 + i * 66; if (i === 6 && k === 2) return; m ? tick(c, x, y, 40) : cross(c, x, y, 40); }));
  line(c, [[180, 790], [900, 790]], 5);
  write(c, "4", 275, 820, 70); write(c, "5", 515, 820, 70); write(c, "6", 755, 820, 70);
  // pencil in the child's hand, tip on the last cell
  c.save(); c.translate(795, 735); c.rotate(-0.95);
  shape(c, () => rrect(c, -30, -16, 300, 32, 6), COL.yellow); shape(c, () => polyP(c, [[-30, -16], [-70, 0], [-30, 16]]), COL.wood, 5); shape(c, () => polyP(c, [[-70, 0], [-52, -7], [-52, 7]]), INK, 0);
  c.restore();
  hand(c, 871, 629, 2.19, 1.05, SKIN.child, CLOTH.child);
};

// e2: two plates of salt. Dry room on the left: a fine white heap. Steamy bathroom on the right:
// the shower runs, steam fills the air, the salt is in lumps.
const e2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = SKY; c.fillRect(540, 0, 540, D);
  c.strokeStyle = COL.glassEdge; c.lineWidth = 2; c.globalAlpha = 0.35;
  for (let x = 540; x <= D; x += 90) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, D); c.stroke(); }
  for (let y = 0; y < D; y += 90) { c.beginPath(); c.moveTo(540, y); c.lineTo(D, y); c.stroke(); }
  c.globalAlpha = 1;
  line(c, [[540, 0], [540, D]], 8);
  // sun at the window on the dry side
  shape(c, () => rrect(c, 110, 90, 300, 240, 10), COL.sky); line(c, [[260, 90], [260, 330]], 5); line(c, [[110, 210], [410, 210]], 5); shape(c, () => rrect(c, 110, 90, 300, 240, 10), "rgba(0,0,0,0)", 6);
  sun(c, 330, 160, 36);
  // shower head and steam
  line(c, [[1080, 60], [860, 60], [860, 150]], 16); shape(c, () => rrect(c, 780, 140, 160, 44, 12), COL.steel);
  for (let i = 0; i < 6; i++) line(c, [[800 + i * 28, 190], [790 + i * 28, 330]], 6, COL.waterDk);
  const r = rnd(3);
  for (let i = 0; i < 9; i++) { const x = 600 + r() * 420, y = 320 + r() * 300, s = 50 + r() * 50; shape(c, () => ell(c, x, y, s, s * 0.7), "rgba(255,255,255,0.75)", 0); }
  // table on both sides, the two plates
  c.fillStyle = COL.wood; c.fillRect(0, 760, D, 320); line(c, [[0, 760], [D, 760]], 6);
  const dish = (x: number) => { shadow(c, x + 10, 770, 230, 40); shape(c, () => ell(c, x, 740, 230, 70), COL.steel); shape(c, () => ell(c, x, 730, 190, 50), COL.steelIn, 4); };
  dish(270); dish(810);
  // fine salt heap
  shape(c, () => { c.moveTo(130, 730); c.quadraticCurveTo(270, 600, 410, 730); c.closePath(); }, WHITE, 5);
  shade(c, () => { c.moveTo(130, 730); c.quadraticCurveTo(270, 600, 410, 730); c.closePath(); }, COL.steel, 40, 0, 0.35);
  // lumpy salt: separate rounded clumps
  const r2 = rnd(11);
  for (let i = 0; i < 14; i++) { const x = 670 + (i % 5) * 70 + r2() * 20, y = 700 - Math.floor(i / 5) * 32 + r2() * 12, s = 26 + r2() * 14; shape(c, () => ell(c, x, y, s, s * 0.8), WHITE, 5); shade(c, () => ell(c, x, y, s, s * 0.8), COL.steel, s * 0.3, s * 0.2, 0.4); }
  arrow(c, [[720, 420], [790, 560]], RED, 12);
};

// e3: on the balcony the ribbon streams right (ground wind), while the clouds high up move left.
const e3 = (c: Ctx) => {
  ground(c, SKY);
  c.fillStyle = SKYDK; c.fillRect(0, 0, D, 300);
  cloud(c, 300, 230, 300); cloud(c, 760, 200, 360); cloud(c, 1000, 280, 200);
  arrow(c, [[760, 330], [380, 330]], RED, 14);
  // the balcony: floor and railing
  c.fillStyle = COL.steelIn; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  for (let x = 90; x < D; x += 140) shape(c, () => rrect(c, x - 10, 640, 20, 270, 6), COL.steel, 5);
  shape(c, () => rrect(c, 0, 620, D, 36, 8), COL.wood);
  // the child holds the stick up; the ribbon streams to the right
  person(c, 330, 910, 420, { armR: [-0.9, -1.25], armL: [Math.PI * 0.6, Math.PI * 0.5] });
  line(c, [[460, 640], [520, 450]], 12, INK); line(c, [[460, 640], [520, 450]], 6, COL.brown);
  shape(c, () => { c.moveTo(520, 450); c.bezierCurveTo(640, 410, 700, 500, 820, 470); c.bezierCurveTo(880, 455, 920, 490, 960, 520); c.lineTo(950, 560); c.bezierCurveTo(900, 530, 870, 500, 820, 512); c.bezierCurveTo(700, 540, 640, 450, 526, 490); c.closePath(); }, COL.pink, 5);
  arrow(c, [[600, 600], [960, 600]], RED, 14);
};

// p1: the finished booklet, open: two sayings, each with its small picture, one tested true (tick),
// one tested false (cross), days of ticks under each; coloured pencils beside.
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 870, 420, 40);
  const page = (x: number) => { shape(c, () => rrect(c, x, 190, 400, 660, 14), COL.paper); };
  page(140); page(540);
  for (const y of [300, 520, 740]) shape(c, () => ell(c, 540, y, 10, 22), COL.steel, 4);
  // left page: red evening sky over the sea · tomorrow fine. Tick.
  shape(c, () => rrect(c, 190, 240, 300, 200, 10), COL.orange, 5);
  shape(c, () => ell(c, 340, 380, 60, 60), COL.red, 5); c.fillStyle = COL.waterDk; c.fillRect(193, 385, 294, 52); line(c, [[193, 385], [487, 385]], 5);
  sun(c, 400, 520, 30);
  tick(c, 300, 530, 70);
  // right page: a crow calling, rain expected · no rain came. Cross.
  shape(c, () => rrect(c, 590, 240, 300, 200, 10), COL.sky, 5);
  shape(c, () => { c.moveTo(690, 380); c.quadraticCurveTo(700, 300, 770, 310); c.quadraticCurveTo(790, 290, 805, 300); c.lineTo(830, 305); c.lineTo(805, 318); c.quadraticCurveTo(800, 360, 760, 380); c.closePath(); }, COL.black, 5);
  shape(c, () => ell(c, 790, 302, 4, 4), WHITE, 0);
  line(c, [[680, 395], [700, 395]], 6); line(c, [[750, 395], [770, 395]], 6);
  cloud(c, 800, 520, 110, DARKCLOUD, DARKCLOUDDK); rain(c, 800, 500, 60, 3);
  cross(c, 700, 530, 70);
  // the days tried: row of small ticks/crosses
  [1, 1, 1, 0, 1].forEach((m, i) => (m ? tick(c, 215 + i * 60, 680, 30) : cross(c, 215 + i * 60, 680, 30)));
  [0, 1, 0, 0, 0].forEach((m, i) => (m ? tick(c, 615 + i * 60, 680, 30) : cross(c, 615 + i * 60, 680, 30)));
  write(c, "4", 310, 740, 60); write(c, "1", 710, 740, 60);
  // coloured pencils below
  [COL.red, COL.green, COL.blue].forEach((col, i) => { const y = 915 + i * 40; shape(c, () => rrect(c, 300, y - 14, 420, 28, 6), col); shape(c, () => polyP(c, [[300, y - 14], [262, y], [300, y + 14]]), COL.wood, 5); shape(c, () => polyP(c, [[262, y], [278, y - 6], [278, y + 6]]), INK, 0); });
};

export const ic_weatherForecastingL3Fill = cards("sci.weather.forecasting.L3 fill", [summary, e1, e2, e3, p1]);
