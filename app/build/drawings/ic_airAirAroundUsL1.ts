import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, plate, cards } from "./flatKit";

// sci.air.air-around-us.L1 · picture cards (intro, cover, activities, experiments, terms, explanations).
// Child and grown-up are the same as on the set-up cards. Air is shown as blue dots and wavy blue lines.

const AIR = "#9ccbef", AIRDK = "#5b8fd6", CLEAR = "rgba(224,240,250,0.7)", PAPER = "#fffaf0";

const dot = (c: Ctx, x: number, y: number, r: number) => shape(c, () => ell(c, x, y, r, r), AIR, Math.max(2.5, r * 0.22));
// a wavy blue wind line from (x, y) going right
const wind = (c: Ctx, x: number, y: number, len: number, amp = 14, head = true, col = AIRDK) => {
  const pts: number[][] = [];
  for (let i = 0; i <= 24; i++) pts.push([x + (len * i) / 24, y + Math.sin((i / 24) * Math.PI * 3) * amp]);
  line(c, pts, 9, col);
  if (head) { const b = pts[24], a = pts[22], an = Math.atan2(b[1] - a[1], b[0] - a[0]); line(c, [[b[0] - Math.cos(an - 0.55) * 30, b[1] - Math.sin(an - 0.55) * 30], b, [b[0] - Math.cos(an + 0.55) * 30, b[1] - Math.sin(an + 0.55) * 30]], 9, col); }
};
const closedEyes = (c: Ctx, x: number, y: number, h: number, sit = false) => {
  const head = h * 0.13, hy = (sit ? y - h * 0.38 : y - h * 0.74) - head * 1.05;
  for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * head * 0.35, hy + head * 0.12, head * 0.2, head * 0.22), SKIN.child, 0); c.beginPath(); c.arc(x + s * head * 0.35, hy + head * 0.08, head * 0.16, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
};
const floor = (c: Ctx, y: number) => { c.fillStyle = "#e3d3b4"; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };

// a plastic bag full of air, centre (x, y), width w, height h, handles on top; dots = blue air bits inside
const bagFull = (c: Ctx, x: number, y: number, w: number, h: number, dots = true) => {
  const body = () => { c.moveTo(x - w * 0.18, y - h * 0.4); c.bezierCurveTo(x - w * 0.6, y - h * 0.5, x - w * 0.62, y + h * 0.4, x - w * 0.3, y + h * 0.5); c.quadraticCurveTo(x, y + h * 0.56, x + w * 0.3, y + h * 0.5); c.bezierCurveTo(x + w * 0.62, y + h * 0.4, x + w * 0.6, y - h * 0.5, x + w * 0.18, y - h * 0.4); c.closePath(); };
  shadow(c, x + w * 0.1, y + h * 0.55, w * 0.42, h * 0.06);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * w * 0.12, y - h * 0.5, w * 0.1, h * 0.17), "rgba(0,0,0,0)", 7);
  shape(c, body, "#f4eed9"); shade(c, body, "#d6cdb0", w * 0.12, h * 0.04);
  if (dots) [[-0.25, -0.15], [0.05, -0.25], [0.28, -0.05], [-0.12, 0.15], [0.12, 0.28], [-0.3, 0.3], [0.3, 0.3]].forEach(([u, v]) => dot(c, x + u * w, y + v * h, w * 0.045));
  line(c, [[x - w * 0.34, y - h * 0.22], [x - w * 0.38, y + h * 0.12]], 9, WHITE);
  shape(c, () => rrect(c, x - w * 0.2, y - h * 0.44, w * 0.4, h * 0.06, 6), "#d6cdb0", 5);
};
// a flat empty bag lying on its back
const bagFlat = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const body = () => polyP(c, [[x - w / 2, y - h / 2], [x - w * 0.15, y - h / 2 - 4], [x + w * 0.15, y - h / 2], [x + w / 2, y - h / 2 + 6], [x + w * 0.46, y + h * 0.1], [x + w / 2, y + h / 2], [x + w * 0.1, y + h / 2 + 6], [x - w * 0.2, y + h / 2 - 2], [x - w / 2, y + h / 2 + 4], [x - w * 0.46, y]]);
  shadow(c, x + w * 0.1, y + h / 2 + 18, w * 0.5, h * 0.05);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * w * 0.22, y - h / 2 - 28, w * 0.1, h * 0.12), "rgba(0,0,0,0)", 7);
  shape(c, body, "#f4eed9"); shade(c, body, "#d6cdb0", w * 0.1, h * 0.04);
  for (const k of [-0.25, 0.05, 0.3]) line(c, [[x + k * w, y - h * 0.4], [x + (k + 0.08) * w, y + h * 0.4]], 3, "#b9ad8f");
};
const bed = (c: Ctx, x: number, y: number, w: number, dots = false) => {
  // y = floor line; bed of width w, left end at x
  const lh = w * 0.14;
  for (const bx of [x + w * 0.04, x + w * 0.9]) shape(c, () => rrect(c, bx, y - lh, w * 0.06, lh, 3), COL.woodDk, 5);
  shape(c, () => rrect(c, x, y - lh - w * 0.1, w, w * 0.1, 8), COL.wood);
  shape(c, () => rrect(c, x + 4, y - lh - w * 0.24, w - 8, w * 0.16, 14), COL.teal);
  shade(c, () => rrect(c, x + 4, y - lh - w * 0.24, w - 8, w * 0.16, 14), COL.tealDk, w * 0.03, w * 0.03);
  shape(c, () => rrect(c, x + w * 0.06, y - lh - w * 0.33, w * 0.26, w * 0.12, 18), PAPER);
  if (dots) { dot(c, x + w * 0.3, y - lh * 0.55, w * 0.035); dot(c, x + w * 0.55, y - lh * 0.4, w * 0.03); dot(c, x + w * 0.75, y - lh * 0.6, w * 0.035); }
};
const bucket = (c: Ctx, x: number, y: number, r: number, h: number, dots = false) => {
  shadow(c, x + r * 0.15, y + 6, r * 1.05, r * 0.2);
  const b = () => { c.moveTo(x - r, y - h); c.lineTo(x + r, y - h); c.lineTo(x + r * 0.75, y); c.lineTo(x - r * 0.75, y); c.closePath(); };
  line(c, [[x - r * 0.9, y - h], [x, y - h - r * 0.7], [x + r * 0.9, y - h]], 7);
  shape(c, b, COL.blue); shade(c, b, COL.blueDk, r * 0.3, 0);
  shape(c, () => ell(c, x, y - h, r, r * 0.22), COL.blueDk, 6);
  shape(c, () => ell(c, x, y - h, r * 0.9, r * 0.17), "#2d4f86", 0);
  if (dots) [[-0.45, 0], [0, 0.03], [0.45, 0]].forEach(([u, v]) => dot(c, x + u * r, y - h + v * r, r * 0.11));
};
const tree = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - 14 * s, y - 120 * s, 28 * s, 130 * s, 4), COL.brown);
  shape(c, () => ell(c, x, y - 190 * s, 110 * s, 95 * s), COL.leaf); shape(c, () => ell(c, x - 70 * s, y - 140 * s, 70 * s, 60 * s), COL.leafDk); shape(c, () => ell(c, x + 70 * s, y - 150 * s, 70 * s, 60 * s), COL.green);
};

// 0 · intro: a puzzled child, one hand open by her face, the other waving near her cheek, hair lifting
const intro = (c: Ctx) => {
  ground(c); shadow(c, 540, 990, 260, 34);
  person(c, 540, 980, 860, { armL: [Math.PI * 0.8, -Math.PI * 0.4], armR: [0, -Math.PI * 0.55] });
  hand(c, 540 - 0.19 * 860, 980 - 0.74 * 860 + 20, -Math.PI * 0.5, 1.0, SKIN.child, CLOTH.child, true);
  const h = 860, head = h * 0.13, hy = 980 - h * 0.74 - head * 1.05;
  line(c, [[540 + head * 0.15, hy - head * 0.55], [540 + head * 0.55, hy - head * 0.62]], 7);
  line(c, [[540 - head * 0.55, hy - head * 0.5], [540 - head * 0.15, hy - head * 0.55]], 7);
  for (const k of [0, 1, 2]) line(c, [[540 + head * 1.0, hy - head * 0.9 + k * 30], [540 + head * 1.5, hy - head * 1.15 + k * 30]], 8, CLOTH.hair);
  wind(c, 790, 215, 170, 13); wind(c, 800, 290, 150, 13); wind(c, 780, 365, 130, 13);
};

// 1 · cover: a bag pulled out from under the bed, puffed up
const summary = (c: Ctx) => {
  ground(c); floor(c, 880);
  bed(c, 30, 880, 400);
  shadow(c, 810, 990, 220, 30);
  person(c, 810, 980, 720, { armL: [Math.PI * 0.8, Math.PI * 0.95] });
  bagFull(c, 520, 760, 300, 270);
};

// 2 · experiment e1: a flat bag, swept through the air, becomes a full bag
const e1 = (c: Ctx) => {
  ground(c); floor(c, 860);
  bagFlat(c, 230, 600, 280, 380);
  arrow(c, [[400, 560], [520, 560], [600, 560]]);
  bagFull(c, 810, 580, 400, 470);
  wind(c, 400, 760, 120, 12);
};

// 3 · experiment e2: a grown-up makes a small puff of air near the cheek of a child with eyes shut
const e2 = (c: Ctx) => {
  ground(c); shadow(c, 270, 990, 200, 28); shadow(c, 850, 990, 180, 26);
  person(c, 270, 980, 800, { adult: true, armR: [-0.2, -0.4] });
  person(c, 850, 980, 700);
  closedEyes(c, 850, 980, 700);
  wind(c, 660, 340, 60, 10, false); wind(c, 660, 395, 70, 10);
};

// 4 · activity a1: sitting still with the fan stopped, then moving fast
const a1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 24, 24, 500, 1032, 24), "#f6efe0", 6); shape(c, () => rrect(c, 556, 24, 500, 1032, 24), "#f6efe0", 6);
  // the stopped ceiling fan
  line(c, [[274, 24], [274, 150]], 9);
  shape(c, () => rrect(c, 234, 142, 80, 34, 12), COL.steel);
  shape(c, () => polyP(c, [[234, 160], [90, 188], [90, 212], [234, 184]]), COL.yellow, 5); shape(c, () => polyP(c, [[314, 160], [458, 188], [458, 212], [314, 184]]), COL.yellow, 5);
  shadow(c, 274, 965, 200, 28); shadow(c, 810, 965, 190, 26);
  person(c, 255, 950, 800, { sit: true }); closedEyes(c, 255, 950, 800, true);
  person(c, 810, 960, 700, { armL: [Math.PI * 0.62, Math.PI * 0.4], armR: [Math.PI * 0.3, Math.PI * 0.5] });
  const hh = 960 - 700 * 0.74 - 91;
  for (const k of [0, 1, 2]) wind(c, 590, hh - 50 + k * 56, 110 + k * 4, 11, false);
  arrow(c, [[640, 1020], [860, 1020], [960, 1020]]);
};

// 5 · activity a2: blowing paint with a straw
const streak = (c: Ctx, pts: number[][], col: string, w: number) => {
  const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
  c.lineCap = "round"; c.lineJoin = "round"; path(); c.strokeStyle = INK; c.lineWidth = w + 9; c.stroke(); path(); c.strokeStyle = col; c.lineWidth = w; c.stroke();
};
const a2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 930, 440, 40);
  shape(c, () => polyP(c, [[190, 470], [960, 450], [1010, 900], [130, 910]]), PAPER);
  streak(c, [[450, 700], [560, 640], [680, 600], [800, 540], [880, 520]], COL.red, 26);
  streak(c, [[450, 700], [580, 720], [720, 700], [840, 740], [930, 720]], COL.blue, 26);
  streak(c, [[450, 700], [540, 790], [640, 830], [740, 800], [800, 840]], COL.yellow, 24);
  shape(c, () => ell(c, 440, 700, 52, 44), COL.red, 6);
  // the straw, held in a hand, aimed at the drop
  c.save(); c.translate(150, 250); c.rotate(0.9);
  shape(c, () => rrect(c, 0, -13, 480, 26, 12), WHITE, 6);
  for (let i = 0; i < 8; i++) { c.fillStyle = COL.red; c.beginPath(); c.moveTo(20 + i * 56, -9); c.lineTo(46 + i * 56, -9); c.lineTo(32 + i * 56, 9); c.lineTo(6 + i * 56, 9); c.closePath(); c.fill(); }
  c.restore();
  hand(c, 120, 240, 0.9, 1.2);
  arrow(c, [[560, 590], [660, 530], [760, 480]], AIRDK);
};

// 6 · activity a3: soap bubbles with air inside
const bubble = (c: Ctx, x: number, y: number, r: number, dots = false) => {
  shape(c, () => ell(c, x, y, r, r), "rgba(214,236,250,0.4)", 6);
  c.beginPath(); c.arc(x, y, r * 0.86, 0.3, 1.5); c.strokeStyle = COL.pink; c.lineWidth = Math.max(4, r * 0.06); c.stroke();
  c.beginPath(); c.arc(x, y, r * 0.86, 3.5, 4.7); c.strokeStyle = COL.teal; c.stroke();
  shine(c, [[x - r * 0.6, y - r * 0.2], [x - r * 0.5, y - r * 0.5], [x - r * 0.25, y - r * 0.7]], Math.max(6, r * 0.07));
  if (dots) [[-0.1, 0.1], [0.3, -0.2], [0.2, 0.4], [-0.35, 0.35], [0.0, -0.35]].forEach(([u, v]) => dot(c, x + u * r, y + v * r, r * 0.08));
};
const a3 = (c: Ctx) => {
  ground(c);
  // the wand with a soapy ring
  line(c, [[200, 640], [140, 940]], 30, INK); line(c, [[200, 640], [140, 940]], 16, COL.woodDk);
  shape(c, () => ell(c, 222, 540, 92, 104, 0.1), "rgba(214,236,250,0.4)", 0); c.beginPath(); ell(c, 222, 540, 92, 104, 0.1); c.strokeStyle = INK; c.lineWidth = 26; c.stroke(); c.strokeStyle = COL.steel; c.lineWidth = 12; c.stroke();
  bubble(c, 620, 500, 220, true); bubble(c, 880, 250, 90); bubble(c, 880, 790, 120); bubble(c, 470, 175, 64); bubble(c, 400, 860, 70);
  arrow(c, [[330, 540], [380, 540]], RED);
  wind(c, 330, 700, 90, 12);
};

// 7 · project p1: an open little book, a page of places with air, crayons
const p1 = (c: Ctx) => {
  ground(c); shadow(c, 540, 860, 470, 40);
  shape(c, () => polyP(c, [[60, 250], [530, 280], [530, 830], [60, 800]]), PAPER);
  shape(c, () => polyP(c, [[550, 280], [1020, 250], [1020, 800], [550, 830]]), PAPER);
  line(c, [[540, 270], [540, 830]], 10, COL.woodDk);
  for (const y of [350, 500, 650]) shape(c, () => ell(c, 541, y, 9, 18), COL.steel, 3);
  bed(c, 100, 600, 380, true);
  for (let i = 0; i < 4; i++) dot(c, 150 + i * 90, 360 + (i % 2) * 40, 14);
  bucket(c, 800, 680, 120, 190, true);
  for (let i = 0; i < 4; i++) dot(c, 650 + i * 90, 340 + (i % 2) * 36, 14);
  // crayons
  [[COL.red, 120], [COL.blue, 190], [COL.yellow, 260]].forEach(([col, x]) => { c.save(); c.translate(x as number + 360, 920); c.rotate(-0.12); shape(c, () => rrect(c, 0, -17, 230, 34, 8), col as string, 6); shape(c, () => polyP(c, [[230, -17], [275, 0], [230, 17]]), col as string, 6); c.restore(); });
};

// 8 · challenge c1: move the paper boat across the tray with moving air only
const c1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 780, 470, 170);
  shape(c, () => ell(c, 540, 780, 400, 120), COL.water, 0);
  shape(c, () => ell(c, 540, 780, 400, 120), "rgba(0,0,0,0)", 5);
  // paper boat
  shadow(c, 450, 790, 150, 22);
  shape(c, () => polyP(c, [[290, 700], [610, 700], [550, 770], [350, 770]]), PAPER); shade(c, () => polyP(c, [[290, 700], [610, 700], [550, 770], [350, 770]]), "#e4dccb", 20, 0);
  shape(c, () => polyP(c, [[450, 700], [310, 700], [450, 520]]), PAPER); shape(c, () => polyP(c, [[450, 700], [590, 700], [450, 520]]), "#e4dccb");
  line(c, [[300, 818], [330, 826], [370, 818]], 6, COL.waterDk);
  // straw and hand blowing
  c.save(); c.translate(190, 450); c.rotate(0.28);
  shape(c, () => rrect(c, 0, -12, 230, 24, 11), WHITE, 6); for (let i = 0; i < 4; i++) { c.fillStyle = COL.red; c.beginPath(); c.moveTo(14 + i * 56, -8); c.lineTo(40 + i * 56, -8); c.lineTo(26 + i * 56, 8); c.lineTo(0 + i * 56, 8); c.closePath(); c.fill(); }
  c.restore();
  hand(c, 140, 395, 0.28, 0.9);
  arrow(c, [[640, 640], [820, 640], [900, 640]]);
};

// 9 · term "Air": a room with air in every corner, even where it looks empty
const air = (c: Ctx) => {
  ground(c, "#f6efe0");
  shape(c, () => rrect(c, 70, 90, 940, 700, 10), "#f9e9c6", 6);
  floor(c, 790);
  bed(c, 100, 790, 380);
  bucket(c, 640, 790, 80, 130, true);
  // a cupboard with its door open
  shape(c, () => rrect(c, 770, 360, 190, 430, 8), COL.brown); shape(c, () => rrect(c, 790, 380, 150, 390, 4), "#5a3a22", 0);
  [[0.3, 0.1], [0.7, 0.1], [0.3, 0.4], [0.7, 0.4], [0.3, 0.7], [0.7, 0.7]].forEach(([u, v]) => dot(c, 790 + u * 150, 400 + v * 340, 11));
  shape(c, () => polyP(c, [[770, 360], [700, 395], [700, 760], [770, 790]]), COL.wood);
  // air bits in every corner
  [[110, 130], [250, 120], [420, 140], [600, 130], [780, 125], [960, 135], [110, 330], [130, 520], [300, 330], [520, 300], [540, 520], [980, 300], [330, 740], [470, 680], [560, 700]].forEach(([x, y]) => dot(c, x, y, 13));
  for (let i = 0; i < 5; i++) dot(c, 610 + i * 20, 663, 9);
};

// 10 · term "Invisible": a clear window and a clear glass, the tree seen right through both
const invisible = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 90, 90, 680, 640, 10), "#bfe0f5", 0);
  shape(c, () => polyP(c, [[90, 560], [300, 480], [500, 560], [770, 480], [770, 730], [90, 730]]), COL.greenLt, 0);
  tree(c, 560, 690, 2.0);
  shape(c, () => rrect(c, 90, 90, 680, 640, 10), "rgba(214,236,250,0.22)", 0);
  shine(c, [[150, 150], [300, 150]], 12); shine(c, [[150, 210], [220, 210]], 12);
  c.beginPath(); rrect(c, 90, 90, 680, 640, 10); c.strokeStyle = COL.woodDk; c.lineWidth = 34; c.stroke(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  line(c, [[430, 90], [430, 730]], 20, COL.woodDk); line(c, [[90, 410], [770, 410]], 20, COL.woodDk);
  shape(c, () => rrect(c, 60, 730, 740, 40, 8), COL.wood);
  // a glass of water on the sill, the tree trunk seen through it
  const gx = 560, gy = 730;
  shadow(c, gx + 20, gy + 5, 80, 14);
  shape(c, () => polyP(c, [[gx - 70, gy - 190], [gx + 70, gy - 190], [gx + 55, gy], [gx - 55, gy]]), "rgba(214,236,250,0.3)", 5);
  shape(c, () => polyP(c, [[gx - 66, gy - 110], [gx + 66, gy - 110], [gx + 55, gy], [gx - 55, gy]]), "rgba(143,195,234,0.35)", 0);
  shine(c, [[gx - 48, gy - 160], [gx - 40, gy - 30]], 8);
  person(c, 920, 1020, 500);
  // she looks through
  arrow(c, [[860, 600], [790, 500]], RED);
};

// 11 · term "Wind": built in card 14. term "Breathe": a hand on the chest, air going in at the nose
const breathe = (c: Ctx) => {
  ground(c); shadow(c, 540, 995, 240, 30);
  person(c, 540, 985, 880, { armR: [Math.PI * 0.35, Math.PI * 0.95] });
  const h = 880, head = h * 0.13, hy = 985 - h * 0.74 - head * 1.05;
  arrow(c, [[240, hy + 150], [380, hy + 110], [510, hy + head * 0.42]], AIRDK, 11);
  for (const [x, y] of [[150, hy + 130], [190, hy + 210], [270, hy + 190]]) dot(c, x, y, 13);
};

// 12 · explanation: why we cannot see air; the sky is blue because lots of air sends blue light back
const sky = (c: Ctx) => {
  c.fillStyle = "#8ec3ee"; c.fillRect(0, 0, D, D); c.fillStyle = "#b5dbf6"; c.fillRect(0, 380, D, 700);
  floor(c, 960);
  // the sun
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[130 + Math.cos(a) * 85, 130 + Math.sin(a) * 85], [130 + Math.cos(a) * 125, 130 + Math.sin(a) * 125]], 10, COL.yellow); }
  shape(c, () => ell(c, 130, 130, 70, 70), COL.yellow);
  // air bits high up, each sending blue light down to the eyes
  const tx = 640, ty = 640;
  [[330, 250], [520, 160], [720, 230], [900, 150], [850, 360], [470, 380]].forEach(([x, y]) => { line(c, [[x, y], [tx + (x - tx) * 0.12, ty - 80 + (y - ty) * 0.12]], 8, "#2f6fbf"); dot(c, x, y, 20); });
  line(c, [[200, 170], [330, 250]], 9, COL.yellow); line(c, [[200, 195], [470, 380]], 9, COL.yellow);
  shadow(c, tx, 1000, 190, 26);
  person(c, tx, 990, 640);
};

// 13 · explanation: we feel air when it moves; hairs on the arm bend, a palm-leaf fan beside it
const feel = (c: Ctx) => {
  ground(c);
  // a palm-leaf fan, round, with ribs and a handle
  line(c, [[170, 560], [120, 900]], 36, INK); line(c, [[170, 560], [120, 900]], 20, COL.woodDk);
  shape(c, () => ell(c, 190, 400, 150, 150), COL.greenLt);
  shade(c, () => ell(c, 190, 400, 150, 150), COL.green, 40, 30);
  for (let i = 0; i < 9; i++) { const a = -Math.PI + (i / 8) * Math.PI * 1.0 + Math.PI * 0.5; line(c, [[190, 460], [190 + Math.cos(a) * 140, 460 + Math.sin(a) * 140]], 3, COL.greenDk); }
  // wind lines
  wind(c, 380, 360, 560, 20); wind(c, 380, 440, 520, 20);
  // the arm with bending hairs
  shape(c, () => rrect(c, 360, 540, 700, 220, 100), SKIN.child); shade(c, () => rrect(c, 360, 540, 700, 220, 100), SKIN.childDk, 0, 40);
  shape(c, () => rrect(c, 900, 520, 200, 260, 50), CLOTH.child);
  for (let i = 0; i < 17; i++) for (let j = 0; j < 4; j++) { const x = 420 + i * 28 + (j % 2) * 12, y = 575 + j * 40 + (i % 3) * 5; if (x > 880) continue; line(c, [[x, y + 14], [x + 18, y - 10]], 5, "#4a2c1a"); }
};

// 14 · explanation: moving air pushes things; a curtain, a kite, a windmill, a bubble
const push = (c: Ctx) => {
  ground(c);
  const tile = (x: number, y: number, draw: () => void) => { c.save(); c.translate(x, y); shape(c, () => rrect(c, 0, 0, 480, 480, 24), "#d9ecf8", 6); c.save(); c.beginPath(); rrect(c, 0, 0, 480, 480, 24); c.clip(); draw(); c.restore(); c.restore(); };
  tile(40, 40, () => {
    shape(c, () => rrect(c, 60, 40, 360, 400, 6), "#bfe0f5", 6); tree(c, 240, 400, 1.0);
    shape(c, () => rrect(c, 60, 40, 360, 400, 6), "rgba(0,0,0,0)", 12);
    const cur = () => { c.moveTo(60, 40); c.lineTo(250, 40); c.bezierCurveTo(300, 150, 340, 300, 400, 420); c.lineTo(60, 440); c.closePath(); };
    shape(c, cur, COL.pink); shade(c, cur, "#d9708e", 30, 0);
    for (const k of [100, 160, 220]) line(c, [[60 + (k - 100) * 0.1, 50], [k - 60, 430]], 4, "#d9708e");
    wind(c, 20, 130, 60, 8, false);
  });
  tile(560, 40, () => {
    const k = () => polyP(c, [[240, 50], [340, 170], [240, 330], [140, 170]]);
    line(c, [[240, 330], [220, 380], [270, 420], [230, 460]], 5);
    for (const [x, y] of [[220, 380], [270, 420]]) shape(c, () => polyP(c, [[x, y], [x - 24, y - 14], [x - 24, y + 14]]), COL.yellow, 4);
    shape(c, k, COL.red); shape(c, () => polyP(c, [[240, 50], [340, 170], [240, 170]]), COL.orange, 0); line(c, [[240, 50], [240, 330]], 5); line(c, [[140, 170], [340, 170]], 5);
    c.beginPath(); polyP(c, [[240, 50], [340, 170], [240, 330], [140, 170]]); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
    wind(c, 20, 320, 120, 10);
  });
  tile(40, 560, () => {
    shape(c, () => polyP(c, [[215, 440], [265, 440], [252, 200], [228, 200]]), PAPER);
    shape(c, () => ell(c, 240, 190, 24, 24), COL.steel);
    for (const a of [-1.9, 0.2, 2.3]) { c.save(); c.translate(240, 190); c.rotate(a); shape(c, () => polyP(c, [[0, 0], [150, -22], [155, 6]]), PAPER); c.restore(); }
    arrow(c, [[370, 100], [430, 150], [440, 220]]);
    wind(c, 20, 360, 70, 9, false);
  });
  tile(560, 560, () => {
    shape(c, () => rrect(c, 40, 200, 140, 24, 12), COL.steel); line(c, [[100, 224], [60, 360]], 22, INK);
    bubble(c, 290, 260, 100);
    arrow(c, [[120, 150], [210, 140]], RED);
    wind(c, 20, 330, 100, 10, false);
  });
};

export const ic_airAirAroundUsL1 = cards("sci.air.air-around-us.L1 cards", [intro, summary, e1, e2, a1, a2, a3, p1, c1, air, invisible, breathe, sky, feel, push]);
