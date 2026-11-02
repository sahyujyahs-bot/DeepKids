import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, SKIN, WHITE, D, arrow, cards, ell, ground, leaf, line, polyP, person, rnd, rrect, shade, shadow, shape, write } from "./flatKit";

// sci.plants.plant-variety.L3 · picture cards. Flat DeepKids look; red arrows = movement or change.

const PI = Math.PI, BARK = "#a8723f", BARKDK = "#7d5230", POTC = "#d9a86a", FIBRE = "#d8b878";
const stem = (c: Ctx, pts: number[][], w: number, col: string = COL.green) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };
const soil = (c: Ctx, y: number) => {
  shape(c, () => c.rect(-10, y, D + 20, D - y + 10), COL.soil, 0);
  const r = rnd(5); for (let i = 0; i < 26; i++) { c.beginPath(); ell(c, r() * D, y + 25 + r() * (D - y - 40), 7 + r() * 7, 5 + r() * 4); c.fillStyle = r() > 0.5 ? COL.soilDk : "#a06d4a"; c.fill(); }
  line(c, [[-10, y], [D + 10, y]], 7);
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * PI) / 6; line(c, [[x + Math.cos(a) * (r + 14), y + Math.sin(a) * (r + 14)], [x + Math.cos(a) * (r + 44), y + Math.sin(a) * (r + 44)]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
// a tree: one thick woody trunk, a round crown; foot at (x, y), total height h
const tree = (c: Ctx, x: number, y: number, h: number) => {
  const w = h * 0.16, t = () => { c.moveTo(x - w * 0.65, y); c.lineTo(x - w * 0.4, y - h * 0.6); c.lineTo(x + w * 0.4, y - h * 0.6); c.lineTo(x + w * 0.65, y); c.closePath(); };
  shape(c, t, BARK); shade(c, t, BARKDK, w * 0.3, 0);
  const cr = h * 0.3, cy = y - h * 0.68;
  for (const [dx, dy, r] of [[-0.55, 0.15, 0.7], [0.55, 0.15, 0.7], [0, -0.15, 1], [-0.2, 0.3, 0.7], [0.3, 0.3, 0.7]]) { const p = () => ell(c, x + dx * cr, cy + dy * cr, cr * r, cr * r * 0.9); shape(c, p, COL.leaf); }
  shade(c, () => ell(c, x, cy, cr * 1.5, cr * 1.05), COL.leafDk, cr * 0.25, cr * 0.2, 0.0);
};
// a shrub: several woody stems from the soil; foot at (x, y), height h
const bush = (c: Ctx, x: number, y: number, h: number) => {
  const sp = [-0.62, -0.3, 0, 0.3, 0.62];
  sp.forEach((a, i) => { const len = h * (i % 2 ? 0.7 : 0.92); stem(c, [[x + a * h * 0.06, y], [x + a * len * 0.7, y - len]], h * 0.05, BARK); });
  sp.forEach((a, i) => { const len = h * (i % 2 ? 0.7 : 0.92); const tx = x + a * len * 0.7, ty = y - len; for (const [dx, dy] of [[-0.12, 0.25], [0.12, 0.25], [0, -0.05]]) shape(c, () => ell(c, tx + dx * h, ty + dy * h * 0.4, h * 0.13, h * 0.1), COL.leaf, 5); });
};
// a herb: a few soft green stems with leaves; foot at (x, y)
const herb = (c: Ctx, x: number, y: number, h: number, col: string = COL.green) => {
  for (const a of [-0.45, 0, 0.45]) { const tx = x + a * h * 0.5, ty = y - h * (a === 0 ? 1 : 0.8); stem(c, [[x, y], [tx, ty]], h * 0.05, col); for (const k of [0.45, 0.8]) { const px = x + (tx - x) * k, py = y + (ty - y) * k; leaf(c, px, py, h * 0.28, -2.5 + a * 0.4, COL.leaf); leaf(c, px, py, h * 0.28, -0.65 + a * 0.4, COL.leaf); } }
};
const pot = (c: Ctx, x: number, y: number, w: number, h: number) => { const p = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.38, y); c.lineTo(x - w * 0.38, y); c.closePath(); }; shape(c, p, POTC); shade(c, p, "#b8844a", w * 0.2, 0); };
const pole = (c: Ctx, x: number, y0: number, y1: number, w = 24) => { line(c, [[x, y0], [x, y1]], w + 8, INK); line(c, [[x, y0], [x, y1]], w, COL.woodDk); };
// a climber winding up a pole at x
const climber = (c: Ctx, x: number, y0: number, y1: number, amp: number) => {
  const pts: number[][] = []; for (let i = 0; i <= 40; i++) { const t = i / 40; pts.push([x + Math.sin(t * PI * 6) * amp, y0 + (y1 - y0) * t]); }
  stem(c, pts, 10);
  for (let i = 3; i <= 38; i += 5) { const [px, py] = pts[i]; leaf(c, px, py, 70, i % 10 === 3 ? PI + 0.5 : -0.5, COL.leaf); }
};
// a creeper spreading along the ground at y
const creeper = (c: Ctx, x0: number, x1: number, y: number) => {
  const pts: number[][] = []; for (let i = 0; i <= 30; i++) { const t = i / 30; pts.push([x0 + (x1 - x0) * t, y + Math.sin(t * PI * 3) * 14]); }
  stem(c, pts, 11);
  for (let i = 3; i <= 28; i += 5) { const [px, py] = pts[i]; leaf(c, px, py, 80, -PI / 2 - 0.5, COL.leaf); leaf(c, px, py, 60, -PI / 2 + 0.6, COL.leaf); }
};
const thermo = (c: Ctx, x: number, y: number, h: number, level: number) => {
  shape(c, () => rrect(c, x - 18, y - h, 36, h, 18), WHITE, 6);
  const ly = y - 22 - (h - 60) * level;
  shape(c, () => rrect(c, x - 9, ly, 18, y - 22 - ly, 0), RED, 0);
  shape(c, () => ell(c, x, y + 8, 30, 30), RED, 6);
  shape(c, () => rrect(c, x - 9, ly, 18, 8, 4), RED, 0);
};
const trunkTop = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shape(c, () => ell(c, x, y, rx, ry), "#f6d9a0", 6);
  for (const k of [0.75, 0.5, 0.25]) { c.beginPath(); ell(c, x, y, rx * k, ry * k); c.strokeStyle = BARK; c.lineWidth = 5; c.stroke(); }
  c.beginPath(); ell(c, x, y, 5, 4); c.fillStyle = BARKDK; c.fill();
};

// 0 summary: the five kinds, side by side
const sSummary = (c: Ctx) => {
  ground(c); soil(c, 800);
  tree(c, 200, 800, 520);
  bush(c, 400, 800, 320);
  pot(c, 560, 800, 110, 90); herb(c, 560, 712, 200);
  pole(c, 760, 800, 330); climber(c, 760, 790, 360, 40);
  creeper(c, 830, 1040, 770);
  shape(c, () => ell(c, 960, 745, 40, 32), COL.orange, 6);
};
// 1 e1: a woody twig stands alone; soft stems flop
const sE1 = (c: Ctx) => {
  ground(c); soil(c, 780);
  shape(c, () => ell(c, 200, 790, 90, 28), COL.soilDk, 6);
  stem(c, [[200, 790], [204, 360]], 24, BARK); stem(c, [[203, 480], [270, 400]], 12, BARK); stem(c, [[203, 560], [140, 480]], 12, BARK);
  stem(c, [[560, 790], [560, 620], [640, 530], [760, 560]], 18, COL.greenLt); leaf(c, 600, 570, 90, -2.4, COL.leaf); leaf(c, 700, 540, 90, -1.0, COL.leaf);
  stem(c, [[860, 790], [860, 640], [930, 600], [990, 700]], 18, COL.greenLt); leaf(c, 900, 610, 90, -2.0, COL.leaf); leaf(c, 960, 640, 90, -0.4, COL.leaf);
  arrow(c, [[650, 440], [780, 470]], RED); arrow(c, [[940, 520], [1030, 560]], RED);
};
// 2 e2: sun, tree shade, umbrella: a thermometer under each, hottest in the sun
const sE2 = (c: Ctx) => {
  ground(c); sun(c, 150, 130, 70);
  shape(c, () => c.rect(-10, 800, D + 20, 300), "#c9b79a", 0); line(c, [[-10, 800], [D + 10, 800]], 7);
  tree(c, 560, 800, 520);
  shape(c, () => ell(c, 560, 830, 200, 34), "rgba(43,35,64,0.28)", 0);
  // umbrella
  line(c, [[880, 560], [880, 810]], 12, INK);
  shape(c, () => { c.moveTo(740, 600); c.quadraticCurveTo(880, 440, 1020, 600); c.quadraticCurveTo(950, 570, 880, 600); c.quadraticCurveTo(810, 570, 740, 600); c.closePath(); }, COL.red, 6);
  shape(c, () => ell(c, 880, 840, 120, 26), "rgba(43,35,64,0.28)", 0);
  thermo(c, 160, 960, 250, 0.9); thermo(c, 560, 960, 250, 0.45); thermo(c, 880, 960, 250, 0.5);
  line(c, [[160, 800], [160, 710]], 6, INK);
  arrow(c, [[230, 260], [290, 360]], RED);
};
// 3 a1: a tally sheet: one plant of each kind with tally strokes
const sA1 = (c: Ctx) => {
  ground(c); shadow(c, 560, 1010, 400, 30);
  shape(c, () => rrect(c, 150, 70, 780, 940, 24), COL.woodDk, 6);
  shape(c, () => rrect(c, 190, 130, 700, 840, 8), COL.paper, 5);
  shape(c, () => rrect(c, 420, 40, 240, 70, 16), COL.steel, 6);
  const rows = [5, 3, 7, 2, 1];
  rows.forEach((n, i) => {
    const y = 140 + i * 165; line(c, [[210, y + 160], [870, y + 160]], 4, COL.grey);
    c.save(); c.translate(280, y + 140); c.scale(0.28, 0.28);
    [(): void => tree(c, 0, 0, 480), (): void => bush(c, 0, 0, 340), (): void => herb(c, 0, 0, 340), (): void => { pole(c, 0, 0, -300, 30); climber(c, 0, -10, -300, 36); }, (): void => creeper(c, -120, 120, -40)][i]();
    c.restore();
    for (let k = 0; k < n; k++) { const gx = 480 + Math.floor(k / 5) * 0 + (k % 5) * 50; if (k % 5 < 4) line(c, [[gx, y + 40], [gx, y + 120]], 8, INK); else line(c, [[gx - 200, y + 110], [gx - 20, y + 50]], 8, INK); }
  });
};
// 4 a2: a sheet with six boxes, one thing from a plant in each
const sA2 = (c: Ctx) => {
  ground(c); shadow(c, 560, 1020, 420, 24);
  shape(c, () => rrect(c, 70, 50, 940, 960, 14), COL.paper, 6);
  for (const x of [383, 696]) line(c, [[x, 70], [x, 990]], 5, COL.grey);
  for (const y of [370, 690]) line(c, [[90, y], [990, y]], 5, COL.grey);
  // food: a bowl of fruit
  shape(c, () => ell(c, 226, 235, 62, 62), COL.orange, 5); leaf(c, 226, 175, 36, -0.8, COL.leaf);
  shape(c, () => ell(c, 290, 265, 44, 44), COL.red, 5); shape(c, () => ell(c, 170, 270, 40, 40), COL.yellow, 5);
  // medicine: a bottle and a leaf
  shape(c, () => rrect(c, 520, 170, 90, 130, 14), "#7fb5d8", 6); shape(c, () => rrect(c, 535, 130, 60, 44, 8), WHITE, 6);
  leaf(c, 640, 290, 100, -1.2, COL.leaf);
  // wood: planks
  shape(c, () => rrect(c, 760, 150, 200, 60, 8), COL.wood, 6); shape(c, () => rrect(c, 780, 220, 200, 60, 8), COL.woodDk, 6);
  // cloth: a shirt
  shape(c, () => polyP(c, [[190, 470], [250, 450], [310, 450], [370, 470], [350, 540], [315, 530], [315, 640], [185, 640], [185, 530], [150, 540]]), COL.cloth, 6);
  // rope: a coil
  for (const r of [70, 48, 26]) { c.beginPath(); ell(c, 540, 540, r, r * 0.8); c.strokeStyle = INK; c.lineWidth = 18; c.stroke(); c.strokeStyle = FIBRE; c.lineWidth = 10; c.stroke(); }
  // shade: a small tree
  c.save(); c.translate(860, 650); c.scale(0.42, 0.42); tree(c, 0, 0, 520); c.restore();
  shape(c, () => ell(c, 860, 660, 80, 18), "rgba(43,35,64,0.22)", 0);
  // pencil/tick: a small leaf in the last box for "other": a hand-sized pencil
  line(c, [[240, 800], [340, 920]], 26, INK); line(c, [[240, 800], [340, 920]], 14, COL.yellow);
  shape(c, () => polyP(c, [[345, 915], [370, 960], [320, 935]]), "#f6d9a0", 5);
  shape(c, () => rrect(c, 680, 790, 200, 150, 8), COL.paper, 5); for (const y of [830, 870, 910]) line(c, [[705, y], [855, y]], 5, COL.grey);
};
// 5 a3: a child hugs a trunk, a string round it, a tape beside
const sA3 = (c: Ctx) => {
  ground(c); soil(c, 860);
  const t = () => { c.moveTo(250, 860); c.lineTo(310, 240); c.lineTo(640, 240); c.lineTo(700, 860); c.closePath(); };
  shape(c, t, BARK); shade(c, t, BARKDK, 70, 0);
  for (const [x1, y1, x2, y2] of [[360, 300, 350, 520], [470, 260, 480, 440], [560, 330, 575, 600], [400, 600, 390, 800], [520, 640, 540, 820]]) line(c, [[x1, y1], [x2, y2]], 5, BARKDK);
  // string round the trunk (an ellipse seen from the side)
  c.beginPath(); c.ellipse(475, 560, 215, 36, 0, 0, PI * 2); c.strokeStyle = INK; c.lineWidth = 14; c.stroke(); c.strokeStyle = COL.yellow; c.lineWidth = 7; c.stroke();
  // tape on the ground with the string end
  shape(c, () => rrect(c, 740, 880, 280, 70, 8), COL.yellow, 6);
  for (let i = 0; i < 8; i++) line(c, [[770 + i * 32, 880], [770 + i * 32, 880 + (i % 2 ? 24 : 38)]], 4, INK);
  for (const [dx, dy, rr] of [[-120, 0, 120], [120, 0, 120], [0, -80, 150]]) shape(c, () => ell(c, 475 + dx, 230 + dy, rr, rr * 0.8), COL.leaf);
  arrow(c, [[250, 440], [250, 520]], RED);
  c.save(); c.translate(870, 520); person(c, 0, 340, 520, { armL: [PI * 0.95, PI * 0.9], armR: [PI * 0.55, PI * 0.5] }); c.restore();
  line(c, [[690, 560], [830, 560]], 7, INK); line(c, [[690, 560], [830, 560]], 3.5, COL.yellow);
};
// 6 a6: fibres are twisted into a rope that holds a bag
const sA6 = (c: Ctx) => {
  ground(c);
  const r = rnd(3);
  for (let i = 0; i < 14; i++) { const y = 300 + i * 14; line(c, [[60, y], [300 + r() * 40, y + (r() - 0.5) * 30]], 5, i % 2 ? FIBRE : "#b8955a"); }
  arrow(c, [[330, 380], [450, 380]], RED);
  shape(c, () => rrect(c, 420, 60, 300, 50, 12), COL.woodDk, 6);
  const x0 = 570, y0 = 110, y1 = 600;
  for (let i = 0; i < 24; i++) { const t0 = i / 24, t1 = (i + 1) / 24; const ya = y0 + (y1 - y0) * t0, yb = y0 + (y1 - y0) * t1; line(c, [[x0 - 16, ya], [x0 + 16, yb]], 34, INK); }
  for (let i = 0; i < 24; i++) { const t0 = i / 24, t1 = (i + 1) / 24; const ya = y0 + (y1 - y0) * t0, yb = y0 + (y1 - y0) * t1; line(c, [[x0 - 16, ya], [x0 + 16, yb]], 22, i % 2 ? FIBRE : "#b8955a"); }
  const bag = () => { c.moveTo(450, 740); c.lineTo(690, 740); c.quadraticCurveTo(740, 940, 640, 1000); c.lineTo(500, 1000); c.quadraticCurveTo(400, 940, 450, 740); c.closePath(); };
  line(c, [[x0, 600], [x0, 760]], 12, INK); line(c, [[x0, 600], [x0, 760]], 6, FIBRE);
  shape(c, bag, COL.blue); shade(c, bag, COL.blueDk, 40, 0);
  shape(c, () => ell(c, 570, 740, 120, 26), COL.blueDk, 6);
  for (const [x, y] of [[520, 880], [580, 910], [620, 860]]) { shape(c, () => ell(c, x, y, 28, 28), COL.yellow, 5); }
  arrow(c, [[830, 560], [830, 760]], RED);
};
// 7 p1: a plant friend grows across four weeks, with a diary page
const sP1 = (c: Ctx) => {
  ground(c); shadow(c, 560, 1000, 460, 28);
  shape(c, () => rrect(c, 60, 120, 960, 860, 20), COL.paper, 6); line(c, [[540, 120], [540, 980]], 6, COL.grey);
  [[170, 760, 150], [360, 760, 250], [650, 760, 350], [860, 760, 450]].forEach(([x, y, h], i) => {
    pot(c, x, y + 100, 120, 100); herb(c, x, y, h);
    for (let k = 0; k <= i; k++) line(c, [[x - 60 + k * 28, 930], [x - 60 + k * 28, 960]], 6, INK);
  });
  arrow(c, [[200, 220], [860, 220]], RED);
};
// 8 c2: a wall in the afternoon sun, shaded by a climber on a trellis
const sC2 = (c: Ctx) => {
  ground(c); sun(c, 160, 150, 80);
  shape(c, () => c.rect(-10, 860, D + 20, 300), COL.green, 0); line(c, [[-10, 860], [D + 10, 860]], 7);
  shape(c, () => polyP(c, [[480, 260], [1010, 260], [1010, 860], [480, 860]]), "#e8c9a0", 6);
  shape(c, () => polyP(c, [[440, 270], [745, 90], [1050, 270]]), COL.red, 6);
  shape(c, () => rrect(c, 760, 380, 160, 170, 10), COL.sky, 6); line(c, [[840, 380], [840, 550]], 5, INK);
  for (const x of [560, 640, 720, 800, 880, 960]) line(c, [[x, 300], [x, 850]], 8, COL.woodDk);
  for (const y of [400, 520, 640, 760]) line(c, [[500, y], [1000, y]], 8, COL.woodDk);
  for (const x of [600, 760, 920]) { const pts: number[][] = []; for (let i = 0; i <= 24; i++) pts.push([x + Math.sin(i * 0.9) * 40, 850 - i * 22]); stem(c, pts, 10); for (let i = 2; i < 24; i += 3) { leaf(c, pts[i][0], pts[i][1], 70, i % 2 ? -0.5 : -2.6, COL.leaf); } }
  arrow(c, [[250, 300], [440, 440]], RED);
  c.save(); c.translate(260, 860); person(c, 0, 0, 380, {}); c.restore();
};
// 9 term.0 plant: from a grass blade to a tree, small to huge
const sPlant = (c: Ctx) => {
  ground(c); soil(c, 860);
  for (const dx of [-14, 0, 14]) stem(c, [[110 + dx, 860], [110 + dx * 2.2, 700]], 10, COL.greenLt);
  pot(c, 290, 860, 110, 90); herb(c, 290, 770, 190);
  bush(c, 520, 860, 330);
  tree(c, 790, 860, 700);
};
// 10 term.1 stem: a coriander stalk beside a slice of trunk
const sStem = (c: Ctx) => {
  ground(c); soil(c, 860);
  stem(c, [[250, 860], [250, 440]], 22, COL.greenLt);
  for (const [dy, a, b] of [[500, -2.6, -0.5], [600, -2.7, -0.4], [380, -2.2, -0.9]]) { leaf(c, 250, dy, 130, a, COL.leaf); leaf(c, 250, dy, 130, b, COL.leaf); }
  shape(c, () => ell(c, 760, 860, 190, 36), SH_(c), 0);
  const body = () => { c.moveTo(580, 380); c.lineTo(580, 840); c.quadraticCurveTo(760, 920, 940, 840); c.lineTo(940, 380); c.closePath(); };
  shape(c, body, BARK); shade(c, body, BARKDK, 70, 0);
  trunkTop(c, 760, 380, 180, 70);
};
const SH_ = (_c: Ctx) => "rgba(43,35,64,0.16)";
// 11 term.2 woody: a hard twig snaps in two
const sWoody = (c: Ctx) => {
  ground(c);
  stem(c, [[100, 700], [330, 520], [480, 450]], 30, BARK);
  stem(c, [[620, 450], [780, 530], [980, 720]], 30, BARK);
  shape(c, () => polyP(c, [[470, 425], [500, 440], [490, 480], [460, 470]]), "#f6d9a0", 5);
  shape(c, () => polyP(c, [[600, 430], [635, 445], [625, 485], [590, 470]]), "#f6d9a0", 5);
  for (const [x1, y1, x2, y2] of [[540, 320], [540, 380], [540, 320]].length ? [[540, 300, 540, 370], [470, 330, 500, 380], [610, 330, 585, 380]] : []) line(c, [[x1, y1], [x2, y2]], 9, RED);
  arrow(c, [[250, 360], [320, 430]], RED); arrow(c, [[830, 360], [770, 430]], RED);
};
// 12 term.11 tendril: a curly tendril wrapped twice round a string
const sTendril = (c: Ctx) => {
  ground(c);
  line(c, [[540, 60], [540, 1020]], 18, INK); line(c, [[540, 60], [540, 1020]], 9, COL.cloth);
  stem(c, [[160, 960], [180, 760], [250, 640]], 18);
  leaf(c, 190, 800, 130, -2.5, COL.leaf); leaf(c, 195, 780, 130, -0.4, COL.leaf);
  const pts: number[][] = [[250, 640], [330, 560], [440, 520]];
  for (let i = 0; i <= 60; i++) { const t = i / 60; pts.push([540 + Math.sin(t * PI * 4 + PI) * 70, 520 - t * 260]); }
  pts.push([620, 230], [660, 180], [640, 140]);
  stem(c, pts, 12);
  line(c, [[540, 60], [540, 520]], 9, COL.cloth); line(c, [[540, 60], [540, 130]], 9, COL.cloth);
};
// 13 term.12 wood: a log with rings, a pencil and a cricket bat
const sWood = (c: Ctx) => {
  ground(c); shadow(c, 540, 930, 440, 40);
  const log = () => { c.moveTo(150, 520); c.lineTo(150, 840); c.quadraticCurveTo(350, 910, 550, 840); c.lineTo(550, 520); c.closePath(); };
  shape(c, log, BARK); shade(c, log, BARKDK, 60, 0); trunkTop(c, 350, 520, 200, 80);
  line(c, [[640, 880], [980, 640]], 38, INK); line(c, [[640, 880], [980, 640]], 24, COL.yellow);
  shape(c, () => polyP(c, [[985, 636], [1040, 600], [1010, 670]]), "#f6d9a0", 5);
  c.save(); c.translate(670, 140); c.rotate(0.3);
  shape(c, () => rrect(c, 0, 130, 150, 360, 20), COL.wood); shape(c, () => rrect(c, 55, -40, 40, 190, 10), COL.woodDk);
  line(c, [[75, 150], [75, 450]], 6, COL.woodDk); c.restore();
};
// 14 term.15 shade: cows and a cyclist rest in the cool shade of a big tree under a hot sun
const sShade = (c: Ctx) => {
  ground(c); sun(c, 900, 140, 80);
  shape(c, () => c.rect(-10, 820, D + 20, 300), "#c9b79a", 0); line(c, [[-10, 820], [D + 10, 820]], 7);
  shape(c, () => ell(c, 400, 880, 360, 60), "rgba(43,35,64,0.30)", 0);
  tree(c, 400, 830, 700);
  // a cow
  c.save(); c.translate(250, 900);
  shape(c, () => rrect(c, -110, -140, 220, 100, 28), WHITE);
  for (const x of [-80, -40, 50, 90]) shape(c, () => rrect(c, x - 9, -50, 18, 70, 6), WHITE, 5);
  shape(c, () => rrect(c, 85, -170, 70, 76, 20), WHITE); shape(c, () => ell(c, 130, -100, 28, 20), COL.pink, 4);
  shape(c, () => ell(c, 120, -142, 7, 7), INK, 0); line(c, [[100, -170], [92, -195]], 6); line(c, [[145, -170], [155, -195]], 6);
  shape(c, () => ell(c, -30, -110, 36, 24), INK, 0); c.restore();
  // a sun-hot thermometer outside the shade
  arrow(c, [[780, 270], [740, 400]], RED); arrow(c, [[860, 280], [880, 420]], RED);
  thermo(c, 920, 960, 260, 0.9); thermo(c, 400, 1030, 140, 0.4);
};
// 15 expl.6: leaves all want light: a tall tree, a climber on the trunk, a shrub, a creeper in the clearing
const sLight = (c: Ctx) => {
  ground(c); sun(c, 900, 130, 70); soil(c, 840);
  tree(c, 250, 840, 700);
  const pts: number[][] = []; for (let i = 0; i <= 26; i++) pts.push([250 + Math.sin(i * 0.8) * 34, 830 - i * 14]);
  stem(c, pts, 10); for (let i = 2; i < 26; i += 4) leaf(c, pts[i][0], pts[i][1], 56, i % 8 === 2 ? PI + 0.5 : -0.5, COL.greenLt);
  bush(c, 560, 840, 200);
  creeper(c, 660, 1040, 810);
  arrow(c, [[780, 250], [560, 400]], RED); arrow(c, [[800, 270], [330, 190]], RED); arrow(c, [[860, 280], [880, 740]], RED);
};
// 16 expl.8 wood: a log, then its rings, then tiny thick-walled tubes
const sWoodZoom = (c: Ctx) => {
  ground(c);
  const log = () => { c.moveTo(40, 120); c.lineTo(40, 330); c.quadraticCurveTo(140, 380, 240, 330); c.lineTo(240, 120); c.closePath(); };
  shape(c, log, BARK); shade(c, log, BARKDK, 40, 0); trunkTop(c, 140, 120, 100, 44);
  arrow(c, [[140, 400], [140, 520]], RED);
  trunkTop(c, 270, 700, 220, 220);
  arrow(c, [[520, 700], [610, 700]], RED);
  // tiny tubes with thick walls, seen end-on
  for (let row = 0; row < 5; row++) for (let col = 0; col < 4; col++) { const x = 700 + col * 90 + (row % 2) * 45, y = 570 + row * 80; shape(c, () => ell(c, x, y, 40, 40), BARK, 6); shape(c, () => ell(c, x, y, 18, 18), "#fff3dc", 4); }
};

export const ic_plantsPlantVarietyL3 = cards("sci.plants.plant-variety.L3 cards", [sSummary, sE1, sE2, sA1, sA2, sA3, sA6, sP1, sC2, sPlant, sStem, sWoody, sTendril, sWood, sShade, sLight, sWoodZoom]);
