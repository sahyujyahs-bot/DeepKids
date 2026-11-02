import type { Ctx } from "./core";
import { D, INK, BG, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, seed, write, cards } from "./flatKit";

// sci.community.transport-and-communication.L3 · picture cards. Same child and grown-up as the set-up cards.
const NIGHT = "#3b3566", BEAM = "rgba(255,226,120,0.5)";
const at = (c: Ctx, x: number, y: number, s: number, fn: () => void) => { c.save(); c.translate(x, y); c.scale(s, s); fn(); c.restore(); };
const wheel = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.black, 5); shape(c, () => ell(c, x, y, r * 0.5, r * 0.5), COL.steel, 4); shape(c, () => ell(c, x, y, r * 0.15, r * 0.15), COL.steelDk, 2); };
const beam = (c: Ctx, pts: number[][]) => { c.beginPath(); polyP(c, pts); c.fillStyle = BEAM; c.fill(); };
const ground2 = (c: Ctx, y: number, col = COL.greyDk) => { c.fillStyle = col; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };

// vehicles, facing right, left end at x 0, wheels touching y 0
const bus = (c: Ctx, heads = false) => {
  shadow(c, 200, 4, 200, 14);
  shape(c, () => rrect(c, 0, -190, 380, 150, 22), COL.blue);
  shade(c, () => rrect(c, 0, -190, 380, 150, 22), COL.blueDk, 20, 20);
  for (let i = 0; i < 5; i++) { shape(c, () => rrect(c, 20 + i * 64, -172, 50, 56, 8), COL.sky, 4); if (heads) shape(c, () => ell(c, 45 + i * 64, -135, 14, 14), SKIN.child, 3); }
  shape(c, () => rrect(c, 350, -80, 22, 22, 6), COL.yellow, 4);
  wheel(c, 85, -36, 36); wheel(c, 300, -36, 36);
};
const truck = (c: Ctx) => {
  shadow(c, 200, 4, 210, 14);
  shape(c, () => rrect(c, 0, -220, 260, 180, 10), COL.wood);
  for (const x of [65, 130, 195]) line(c, [[x, -214], [x, -46]], 4, COL.woodDk);
  shape(c, () => polyP(c, [[268, -40], [268, -190], [345, -190], [400, -120], [400, -40]]), COL.teal);
  shape(c, () => polyP(c, [[285, -175], [338, -175], [372, -125], [285, -125]]), COL.sky, 4);
  wheel(c, 70, -34, 34); wheel(c, 190, -34, 34); wheel(c, 330, -34, 34);
};
const train = (c: Ctx) => {
  shadow(c, 240, 4, 250, 12);
  shape(c, () => rrect(c, 250, -140, 230, 100, 8), COL.blue); shape(c, () => rrect(c, 266, -120, 60, 40, 6), COL.sky, 4); shape(c, () => rrect(c, 346, -120, 60, 40, 6), COL.sky, 4);
  shape(c, () => rrect(c, 0, -150, 240, 110, 14), COL.red); shape(c, () => rrect(c, 10, -205, 100, 60, 8), COL.red);
  shape(c, () => rrect(c, 28, -190, 40, 30, 5), COL.sky, 4); shape(c, () => rrect(c, 176, -195, 34, 48, 4), COL.black);
  shape(c, () => ell(c, 236, -105, 9, 9), COL.yellow, 3);
  for (const x of [40, 100, 170, 290, 440]) wheel(c, x, -24, 24);
  line(c, [[-30, 2], [510, 2]], 8);
};
const ship = (c: Ctx) => {
  shape(c, () => rrect(c, 20, -170, 90, 70, 6), COL.steel); shape(c, () => rrect(c, 40, -230, 28, 60, 4), COL.red);
  [[120, COL.orange], [210, COL.teal], [300, COL.yellow]].forEach(([x, col]) => shape(c, () => rrect(c, x as number, -150, 85, 50, 4), col as string));
  shape(c, () => polyP(c, [[0, -100], [420, -100], [360, -20], [50, -20]]), COL.blueDk);
  shape(c, () => ell(c, 210, -8, 230, 18), COL.water, 5);
};
const plane = (c: Ctx) => {
  shape(c, () => polyP(c, [[30, -108], [70, -170], [100, -170], [92, -100]]), COL.red);
  shape(c, () => ell(c, 200, -100, 190, 42), COL.cloth);
  shade(c, () => ell(c, 200, -100, 190, 42), COL.steelDk, 0, 20);
  shape(c, () => polyP(c, [[160, -96], [260, -96], [215, -10], [170, -10]]), COL.steel);
  for (let i = 0; i < 6; i++) shape(c, () => ell(c, 250 + i * 22, -108, 7, 8), COL.sky, 3);
  shape(c, () => ell(c, 340, -108, 18, 12), COL.sky, 3);
};
const cart = (c: Ctx) => {
  shape(c, () => rrect(c, 100, -180, 330, 28, 6), COL.wood);
  line(c, [[100, -160], [0, -120]], 12); line(c, [[100, -160], [0, -120]], 6, COL.brown);
  shape(c, () => rrect(c, 120, -250, 290, 70, 6), COL.woodDk, 5);
  shape(c, () => ell(c, 265, -90, 92, 92), COL.wood, 8);
  for (let k = 0; k < 4; k++) { const a = (k * Math.PI) / 4; line(c, [[265 - Math.cos(a) * 88, -90 - Math.sin(a) * 88], [265 + Math.cos(a) * 88, -90 + Math.sin(a) * 88]], 7); }
  shape(c, () => ell(c, 265, -90, 16, 16), COL.brown, 5);
};
const canoe = (c: Ctx) => {
  shape(c, () => { c.moveTo(0, -80); c.bezierCurveTo(60, 10, 320, 10, 390, -80); c.quadraticCurveTo(195, -55, 0, -80); c.closePath(); }, COL.brown);
  shape(c, () => ell(c, 195, -70, 195, 12), COL.soilDk, 4);
  line(c, [[270, -190], [210, -20]], 8, COL.woodDk); shape(c, () => ell(c, 205, -8, 14, 30, 0.3), COL.woodDk, 4);
  shape(c, () => ell(c, 200, 4, 220, 16), COL.water, 5);
};
const bike = (c: Ctx, rider = false) => {
  wheel(c, 60, -55, 50); wheel(c, 230, -55, 50);
  line(c, [[60, -55], [130, -55], [180, -130], [105, -130], [60, -55]], 7, COL.red); line(c, [[130, -55], [105, -130]], 7, COL.red); line(c, [[180, -130], [230, -55]], 7, COL.red);
  line(c, [[170, -140], [195, -150]], 8);
  if (rider) { shape(c, () => rrect(c, 85, -240, 48, 100, 18), CLOTH.child); shape(c, () => ell(c, 109, -268, 26, 26), SKIN.child); line(c, [[125, -200], [190, -148]], 12, CLOTH.child); }
};
const envelope = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 8), COL.paper); line(c, [[x + 6, y + 8], [x + w / 2, y + h * 0.58], [x + w - 6, y + 8]], 5);
};
const smartphone = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, w * 0.14), COL.black); shape(c, () => rrect(c, x + w * 0.1, y + h * 0.08, w * 0.8, h * 0.78, 8), COL.sky, 3);
  shape(c, () => ell(c, x + w / 2, y + h * 0.93, w * 0.06, w * 0.06), COL.steel, 2);
};
const bubble = (c: Ctx, x: number, y: number, rx: number, ry: number, tx: number, ty: number) => {
  shape(c, () => { ell(c, x, y, rx, ry); }, WHITE); shape(c, () => ell(c, x + (tx - x) * 0.55, y + (ty - y) * 0.7, 16, 14), WHITE, 5); shape(c, () => ell(c, tx, ty, 9, 8), WHITE, 4);
};
// signs
const pole = (c: Ctx, x: number, y0: number, y1: number) => { shape(c, () => rrect(c, x - 9, y0, 18, y1 - y0, 4), COL.steel, 5); };
const roundSign = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), RED); shape(c, () => ell(c, x, y, r * 0.78, r * 0.78), WHITE, 4); };
const triSign = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => polyP(c, [[x, y - r], [x + r * 0.95, y + r * 0.62], [x - r * 0.95, y + r * 0.62]]), RED, 6); shape(c, () => polyP(c, [[x, y - r * 0.56], [x + r * 0.58, y + r * 0.42], [x - r * 0.58, y + r * 0.42]]), WHITE, 3); };
const walker = (c: Ctx, x: number, y: number, s: number, skin = SKIN.child, cloth = CLOTH.child) => {
  shape(c, () => ell(c, x, y - 52 * s, 14 * s, 14 * s), skin, 4); shape(c, () => rrect(c, x - 13 * s, y - 36 * s, 26 * s, 40 * s, 8 * s), cloth, 4);
  line(c, [[x - 6 * s, y + 4 * s], [x - 10 * s, y + 38 * s]], 8 * s); line(c, [[x + 6 * s, y + 4 * s], [x + 12 * s, y + 38 * s]], 8 * s);
};
const torch = (c: Ctx, x: number, y: number, an: number) => { c.save(); c.translate(x, y); c.rotate(an); shape(c, () => rrect(c, 0, -22, 80, 44, 8), COL.red); shape(c, () => rrect(c, 80, -30, 28, 60, 6), COL.steel); c.restore(); };

// ------------------------------------------------------------------ cards
const summary = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 430);
  at(c, 80, 330, 0.9, () => plane(c));
  at(c, 640, 150, 1, () => { smartphone(c, 120, 40, 120, 220); });
  for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(660, 160, 40 + i * 36, -0.9, 0.9); c.strokeStyle = RED; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
  ground2(c, 640, COL.greyDk);
  at(c, 40, 640, 0.95, () => train(c));
  c.fillStyle = COL.water; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 6);
  at(c, 600, 885, 0.8, () => ship(c));
  at(c, 40, 880, 0.82, () => truck(c));
};
const e1 = (c: Ctx) => {
  c.fillStyle = NIGHT; c.fillRect(0, 0, D, D); c.fillStyle = "#2f2a52"; c.fillRect(0, 820, D, 260);
  beam(c, [[270, 560], [1000, 330], [1000, 760], [270, 590]]);
  person(c, 150, 900, 480, { armR: [-0.2, -0.05] }); torch(c, 205, 640, -0.04);
  shape(c, () => rrect(c, 560, 450, 150, 220, 6), COL.black, 5);
  pole(c, 635, 670, 860);
  shape(c, () => rrect(c, 830, 380, 150, 220, 6), WHITE, 5);
  pole(c, 905, 600, 860);
  for (const x of [635, 905]) shadow(c, x, 864, 70, 10);
};
const e2 = (c: Ctx) => {
  ground(c, COL.paper);
  person(c, 200, 940, 520, { armR: [-0.5, -0.9] });
  person(c, 880, 940, 520, { adult: true, armL: [1.3, 1.0] });
  bubble(c, 380, 250, 190, 120, 300, 400);
  shape(c, () => rrect(c, 280, 215, 70, 70, 4), COL.blue, 5); shape(c, () => polyP(c, [[470, 285], [530, 215], [410, 215]]), COL.red, 5);
  shape(c, () => rrect(c, 700, 640, 200, 150, 6), WHITE, 5);
  shape(c, () => rrect(c, 730, 700, 50, 50, 3), COL.blue, 4);
  arrow(c, [[570, 330], [700, 400]]);
};
const a1 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[110, 300], [370, 300], [400, 860], [80, 860]]), COL.paper);
  shape(c, () => rrect(c, 130, 420, 220, 220, 8), COL.wood, 4);
  const r = rnd(5); for (let i = 0; i < 18; i++) shape(c, () => ell(c, 160 + r() * 160, 450 + r() * 160, 14, 6, r() * 3), WHITE, 3);
  shape(c, () => polyP(c, [[110, 300], [370, 300], [350, 340], [130, 340]]), COL.steel);
  ground2(c, 860);
  at(c, 520, 860, 0.85, () => truck(c));
  arrow(c, [[380, 600], [560, 600], [620, 640]]);
  shape(c, () => ell(c, 880, 330, 60, 60), COL.red, 6); shape(c, () => ell(c, 880, 330, 20, 20), WHITE, 4);
  line(c, [[880, 390], [880, 440]], 8);
};
const a2 = (c: Ctx) => {
  ground(c);
  line(c, [[30, 220], [1050, 230]], 6, COL.greyDk);
  const items: [number, (s: number) => void][] = [[0.52, () => canoe(c)], [0.62, () => cart(c)], [0.5, () => train(c)], [0.55, () => plane(c)]];
  const sc = [0.5, 0.48, 0.4, 0.5], dy = [210, 200, 210, 180], dx = [14, 12, 10, 14];
  items.forEach((it, i) => {
    const x = 40 + i * 255;
    shape(c, () => rrect(c, x, 340, 230, 270, 8), WHITE, 5); line(c, [[x + 115, 225 + i * 2], [x + 115, 340]], 5);
    at(c, x + dx[i], 340 + dy[i], sc[i], () => it[1](0));
  });
  arrow(c, [[80, 800], [980, 800]], RED, 14);
};
const a3 = (c: Ctx) => {
  ground(c); ground2(c, 880, COL.greyDk);
  pole(c, 190, 400, 880); pole(c, 540, 400, 880); pole(c, 890, 400, 880);
  roundSign(c, 190, 290, 150); write(c, "30", 120, 240, 100, INK, 14);
  triSign(c, 540, 290, 160); line(c, [[540, 240], [540, 310]], 14); shape(c, () => ell(c, 540, 350, 9, 9), INK, 0);
  shape(c, () => rrect(c, 760, 150, 260, 270, 18), COL.blue); shape(c, () => rrect(c, 775, 165, 230, 240, 12), COL.blue, 4);
  arrow(c, [[890, 380], [890, 200]], WHITE, 18);
};
const a4 = (c: Ctx) => {
  c.fillStyle = NIGHT; c.fillRect(0, 0, D, D); c.fillStyle = "#2f2a52"; c.fillRect(0, 840, D, 240);
  person(c, 170, 940, 500, { armR: [-0.3, -0.05] }); torch(c, 220, 680, -0.06);
  person(c, 910, 940, 500, { adult: true });
  beam(c, [[330, 670], [800, 520], [800, 780], [330, 700]]);
  const sq = [[420, 40], [520, 40], [640, 130], [440, 0]];
  shape(c, () => ell(c, 400, 400, 36, 36), COL.yellow, 5); shape(c, () => rrect(c, 480, 366, 150, 68, 34), COL.yellow, 5); shape(c, () => ell(c, 690, 400, 36, 36), COL.yellow, 5); void sq;
};
const a5 = (c: Ctx) => {
  ground(c, COL.sky); c.fillStyle = COL.greyDk; c.fillRect(0, 620, D, 460); line(c, [[0, 620], [D, 620]], 6);
  at(c, 80, 760, 1.2, () => bus(c, true));
  at(c, 640, 770, 0.8, () => bike(c, true));
  shape(c, () => rrect(c, 20, 20, 1040, 1040, 10), "rgba(0,0,0,0)", 0);
  c.lineWidth = 60; c.strokeStyle = COL.woodDk; c.strokeRect(30, 30, 1020, 1020); c.lineWidth = 6; c.strokeStyle = INK; c.strokeRect(0, 0, D, D); c.strokeRect(60, 60, 960, 960);
  line(c, [[540, 60], [540, 1020]], 24, COL.woodDk);
  for (let i = 0; i < 5; i++) line(c, [[880 + i * 22, 900], [880 + i * 22, 980]], 8);
  line(c, [[860, 960], [1000, 920]], 8);
};
const a6 = (c: Ctx) => {
  ground(c);
  person(c, 300, 960, 500); person(c, 760, 960, 500, { adult: true });
  bubble(c, 760, 230, 280, 160, 760, 430);
  at(c, 560, 330, 0.34, () => cart(c)); envelope(c, 820, 190, 130, 90);
};
const p1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 70, 70, 940, 940, 14), COL.paper, 6);
  const road = [[220, 820], [220, 540], [800, 540], [800, 270]];
  line(c, road, 90, COL.grey); line(c, road, 78, COL.steelIn);
  for (let i = 0; i < 5; i++) shape(c, () => rrect(c, 182, 650 + i * 24, 76, 12, 3), WHITE, 3);
  shape(c, () => rrect(c, 120, 800, 140, 110, 6), COL.blue); shape(c, () => polyP(c, [[110, 800], [190, 730], [270, 800]]), COL.red);
  shape(c, () => rrect(c, 740, 150, 140, 110, 6), COL.orange); shape(c, () => rrect(c, 740, 130, 140, 30, 4), COL.teal);
  triSign(c, 480, 380, 60); pole(c, 480, 430, 500);
  arrow(c, [[220, 780], [220, 540], [800, 540], [800, 310]], RED, 12);
};
const c1 = (c: Ctx) => {
  ground(c); ground2(c, 900, COL.green);
  pole(c, 540, 560, 900);
  triSign(c, 540, 360, 330);
  walker(c, 500, 395, 2.2, SKIN.adult, CLOTH.adult);
  walker(c, 590, 405, 1.5);
};
const c2 = (c: Ctx) => {
  ground(c);
  const bag = () => rrect(c, 280, 220, 520, 640, 60);
  shape(c, bag, COL.orange); shade(c, bag, COL.childDk, 30, 10);
  shape(c, () => rrect(c, 340, 520, 400, 280, 40), COL.yellow);
  shape(c, () => rrect(c, 280, 600, 520, 90, 6), COL.steel, 6);
  c.save(); c.beginPath(); rrect(c, 280, 600, 520, 90, 6); c.clip(); for (let x = 240; x < 840; x += 70) line(c, [[x, 700], [x + 70, 590]], 14, COL.steelIn); c.restore();
  line(c, [[420, 220], [420, 120], [660, 120], [660, 220]], 22); line(c, [[420, 220], [420, 120], [660, 120], [660, 220]], 10, COL.brown);
  shape(c, () => ell(c, 150, 800, 90, 90), COL.steel, 6); shape(c, () => ell(c, 150, 800, 40, 40), BG, 5);
  shape(c, () => rrect(c, 800, 770, 220, 60, 6), COL.steel, 5);
};
const t0 = (c: Ctx) => {
  ground(c); ground2(c, 520, COL.greyDk); at(c, 140, 520, 0.9, () => train(c));
  ground2(c, 880, COL.greyDk); at(c, 80, 880, 0.9, () => truck(c)); arrow(c, [[540, 720], [900, 720]], RED, 14);
};
const t1 = (c: Ctx) => {
  ground(c);
  person(c, 220, 900, 560, { armR: [-1.2, -1.5] }); person(c, 860, 900, 560, { adult: true, armL: [2.0, 1.4] });
  envelope(c, 440, 280, 200, 140); smartphone(c, 480, 500, 120, 220);
  for (let i = 0; i < 2; i++) { c.beginPath(); c.arc(540, 600, 100 + i * 40, 2.4, 3.9); c.strokeStyle = RED; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); c.beginPath(); c.arc(540, 600, 100 + i * 40, -0.7, 0.75); c.stroke(); }
};
const t3 = (c: Ctx) => {
  ground(c); shadow(c, 540, 900, 400, 24);
  line(c, [[220, 700], [860, 700]], 40); line(c, [[220, 700], [860, 700]], 24, COL.steel);
  shape(c, () => rrect(c, 330, 380, 420, 260, 10), COL.wood);
  for (const x of [230, 850]) { shape(c, () => ell(c, x, 700, 60, 220), COL.wood, 8); shape(c, () => ell(c, x, 700, 20, 56), COL.brown, 5); }
  arrow(c, [[400, 950], [700, 950]], RED, 14);
};
const t4 = (c: Ctx) => {
  ground(c); c.fillStyle = COL.sky; c.fillRect(0, 0, D, 560); c.fillStyle = COL.soil; c.fillRect(0, 560, D, 520); line(c, [[0, 560], [D, 560]], 6);
  shape(c, () => rrect(c, 40, 340, 170, 260, 24), COL.steel);
  line(c, [[200, 760], [780, 760], [780, 520]], 70); line(c, [[200, 760], [780, 760], [780, 520]], 52, COL.steelIn);
  shape(c, () => rrect(c, 640, 330, 280, 200, 10), COL.paper); shape(c, () => rrect(c, 670, 450, 220, 40, 8), COL.black);
  shape(c, () => { c.moveTo(780, 450); c.quadraticCurveTo(740, 390, 780, 340); c.quadraticCurveTo(830, 390, 780, 450); c.closePath(); }, COL.orange, 4);
  arrow(c, [[260, 760], [540, 760]], RED, 14);
};
const t5 = (c: Ctx) => {
  ground(c);
  const lit = [RED, COL.yellow, COL.greenLt], nm = [0, 1, 2];
  nm.forEach((k) => {
    const x = 180 + k * 360; pole(c, x, 640, 940);
    shape(c, () => rrect(c, x - 100, 120, 200, 520, 30), COL.black);
    [COL.red, COL.yellow, COL.green].forEach((col, j) => { shape(c, () => ell(c, x, 220 + j * 150, 55, 55), j === k ? lit[k] : "#5a5560", 5); });
  });
};
const t7 = (c: Ctx) => {
  ground(c, COL.sky); c.fillStyle = COL.grey; c.fillRect(0, 700, D, 380); line(c, [[0, 700], [D, 700]], 6);
  c.fillStyle = COL.greyDk; c.fillRect(0, 760, D, 320);
  for (let i = 0; i < 8; i++) shape(c, () => rrect(c, 20 + i * 135, 780, 90, 240, 4), WHITE, 4);
  person(c, 330, 960, 480); person(c, 700, 960, 480, { adult: true });
};
const t8 = (c: Ctx) => {
  c.fillStyle = NIGHT; c.fillRect(0, 0, D, D);
  torch(c, 100, 360, 0.1); beam(c, [[210, 372], [750, 250], [750, 570], [210, 400]]);
  shape(c, () => rrect(c, 760, 220, 120, 400, 6), WHITE, 5); pole(c, 820, 620, 900);
  arrow(c, [[740, 560], [500, 700], [240, 760]], RED, 12);
  shape(c, () => { c.moveTo(80, 800); c.quadraticCurveTo(200, 700, 320, 800); c.quadraticCurveTo(200, 900, 80, 800); c.closePath(); }, WHITE, 6);
  shape(c, () => ell(c, 200, 800, 40, 40), COL.blue, 5); shape(c, () => ell(c, 200, 800, 16, 16), INK, 0);
};
const t9 = (c: Ctx) => {
  c.fillStyle = NIGHT; c.fillRect(0, 0, D, D); c.fillStyle = "#2f2a52"; c.fillRect(0, 860, D, 220);
  shape(c, () => rrect(c, 40, 560, 220, 150, 40), COL.teal); shape(c, () => ell(c, 250, 620, 28, 28), COL.yellow, 5);
  beam(c, [[270, 600], [620, 540], [620, 740], [270, 640]]);
  const bag = () => rrect(c, 640, 330, 340, 500, 50);
  shape(c, bag, COL.orange); shade(c, bag, COL.childDk, 20, 10);
  shape(c, () => rrect(c, 640, 560, 340, 80, 6), COL.steel, 5);
  arrow(c, [[620, 590], [300, 590]], RED, 8); arrow(c, [[300, 640], [620, 640]], RED, 8);
};
const t10 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 80, 460, 300, 200, 20), COL.brown); shape(c, () => ell(c, 170, 560, 60, 60), COL.paper, 5); shape(c, () => ell(c, 170, 560, 20, 20), COL.black, 3);
  line(c, [[330, 460], [380, 220]], 8);
  for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(300, 560, 150 + i * 40, -0.7, 0.7); c.strokeStyle = COL.blueDk; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); }
  arrow(c, [[480, 560], [650, 560]], RED, 14);
  person(c, 840, 900, 480);
};
const t11 = (c: Ctx) => {
  ground(c);
  person(c, 200, 920, 520); person(c, 880, 920, 520, { adult: true });
  arrow(c, [[340, 420], [740, 420]], RED, 14); arrow(c, [[740, 520], [340, 520]], RED, 14);
};
const t12 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 330, 80, 420, 290, 24), COL.black); shape(c, () => rrect(c, 360, 108, 360, 234, 10), COL.sky, 4);
  shape(c, () => ell(c, 540, 225, 60, 60), COL.yellow, 5);
  const hs = [90, 280, 470, 660, 850];
  hs.forEach((x, i) => {
    const y = 760 + (i % 2) * 40; shape(c, () => rrect(c, x, y, 150, 120, 6), [COL.blue, COL.orange, COL.teal, COL.pink, COL.purple][i]); shape(c, () => polyP(c, [[x - 10, y], [x + 75, y - 70], [x + 160, y]]), COL.red);
    arrow(c, [[540, 400], [x + 75, y - 110]], RED, 8);
  });
};
const t14 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 90, 200, 900, 620, 14), COL.paper, 6);
  for (let i = 0; i < 6; i++) { shape(c, () => rrect(c, 400 + i * 90, 240, 76, 100, 6), WHITE, 5); }
  [..."600001"].forEach((d, i) => write(c, d, 420 + i * 90, 256, 70, INK, 8));
  for (const y of [470, 540, 610]) line(c, [[140, y], [560, y]], 8, COL.grey);
  shape(c, () => rrect(c, 800, 600, 130, 160, 6), COL.red, 4); shape(c, () => rrect(c, 820, 620, 90, 120, 4), COL.paper, 3);
  void seed;
};
const t16 = (c: Ctx) => {
  ground(c); ground2(c, 860);
  at(c, 480, 860, 1.0, () => bus(c));
  shape(c, () => rrect(c, 435, 790, 50, 18, 6), COL.steelDk, 4);
  for (const [x, y, r] of [[390, 800, 30], [320, 770, 44], [230, 730, 60], [110, 680, 76]]) shape(c, () => ell(c, x, y, r, r * 0.8), "#8a8590", 5);
  arrow(c, [[420, 960], [100, 960]], RED, 12);
};
const stairs = (c: Ctx, items: ((cx: number, top: number) => void)[]) => {
  ground(c);
  items.forEach((it, i) => {
    const x = 20 + i * 205, h = 120 + i * 110, y = 1000 - h;
    shape(c, () => rrect(c, x, y, 195, h + 80, 6), i % 2 ? COL.teal : COL.blue, 5);
    it(x + 97, y);
    if (i) arrow(c, [[x - 60, y + 150], [x - 14, y + 90]], RED, 8);
  });
};
const e1x = (c: Ctx) => stairs(c, [
  (cx, t) => walker(c, cx, t - 44, 2.4),
  (cx, t) => at(c, cx - 98, t, 0.5, () => canoe(c)),
  (cx, t) => at(c, cx - 105, t, 0.48, () => cart(c)),
  (cx, t) => at(c, cx - 100, t, 0.4, () => train(c)),
  (cx, t) => at(c, cx - 98, t - 30, 0.5, () => plane(c)),
]);
const expl2 = (c: Ctx) => {
  ground(c);
  const tile = (x: number, y: number) => shape(c, () => rrect(c, x, y, 320, 300, 20), WHITE, 5);
  [[40, 40], [380, 40], [720, 40], [210, 380], [550, 380]].forEach(([x, y]) => tile(x, y));
  at(c, 50, 300, 0.74, () => bus(c)); at(c, 405, 310, 0.55, () => train(c)); at(c, 725, 320, 0.7, () => ship(c));
  at(c, 235, 650, 0.75, () => plane(c));
  c.fillStyle = COL.soil; c.fillRect(556, 560, 308, 114);
  shape(c, () => rrect(c, 576, 590, 268, 56, 28), COL.steelIn, 5);
  arrow(c, [[610, 618], [800, 618]], RED, 8);
};
const comm = (c: Ctx) => stairs(c, [
  (cx, t) => person(c, cx, t, 340, { armR: [-1.2, -1.5] }),
  (cx, t) => { shape(c, () => rrect(c, cx - 50, t - 110, 100, 110, 8), COL.red); shape(c, () => ell(c, cx, t - 110, 50, 14), COL.paper, 4); line(c, [[cx + 40, t - 190], [cx - 5, t - 118]], 8, COL.wood); line(c, [[cx - 40, t - 190], [cx + 5, t - 118]], 8, COL.wood); },
  (cx, t) => envelope(c, cx - 70, t - 100, 140, 95),
  (cx, t) => { shape(c, () => rrect(c, cx - 70, t - 70, 140, 70, 14), COL.black); shape(c, () => rrect(c, cx - 70, t - 105, 140, 30, 12), COL.red); },
  (cx, t) => smartphone(c, cx - 45, t - 170, 90, 165),
]);
const expl6 = (c: Ctx) => {
  ground(c); ground2(c, 880);
  at(c, 40, 880, 0.9, () => bus(c));
  for (const [x, y, r] of [[30, 800, 36], [-5, 740, 44]]) void [x, y, r];
  for (const [x, y, r] of [[380, 790, 40], [470, 720, 56], [590, 650, 70]]) shape(c, () => ell(c, x, y, r, r * 0.8), "#8a8590", 5);
  arrow(c, [[620, 540], [760, 400]], RED, 12);
  const lobe = (sgn: number) => () => { c.moveTo(830, 200); c.bezierCurveTo(830 + sgn * 30, 100, 830 + sgn * 160, 130, 830 + sgn * 150, 330); c.bezierCurveTo(830 + sgn * 140, 400, 830 + sgn * 40, 400, 830, 340); c.closePath(); };
  line(c, [[830, 70], [830, 230]], 26); line(c, [[830, 70], [830, 230]], 12, COL.pink);
  shape(c, lobe(-1), "#a9a3ad"); shape(c, lobe(1), "#a9a3ad");
};
const expl7 = (c: Ctx) => {
  c.fillStyle = "#1d2140"; c.fillRect(0, 0, D, D);
  const r = rnd(3); for (let i = 0; i < 25; i++) { c.beginPath(); c.arc(r() * D, r() * 330, 3, 0, 7); c.fillStyle = WHITE; c.fill(); }
  c.beginPath(); c.arc(540, 1400, 960, Math.PI * 1.2, Math.PI * 1.8); c.strokeStyle = COL.purple; c.lineWidth = 60; c.globalAlpha = 0.6; c.stroke(); c.globalAlpha = 1;
  c.beginPath(); c.arc(540, 1400, 760, 0, Math.PI * 2); c.fillStyle = COL.blue; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  for (const x of [150, 930]) {
    const by = 1400 - Math.sqrt(760 * 760 - (x - 540) * (x - 540)) + 10;
    shape(c, () => polyP(c, [[x - 34, by], [x, by - 170], [x + 34, by]]), COL.steel, 6); line(c, [[x - 20, by - 60], [x + 20, by - 60]], 5); shape(c, () => ell(c, x, by - 178, 10, 10), RED, 4);
  }
  arrow(c, [[160, 590], [350, 520], [540, 445]], RED, 10); arrow(c, [[540, 445], [740, 520], [920, 590]], RED, 10);
};

export const ic_communityTransportAndCommunicationL3 = cards("sci.community.transport-and-communication.L3 cards", [
  summary, e1, e2, a1, a2, a3, a4, a5, a6, p1, c1, c2, t0, t1, t3, t4, t5, t7, t8, t9, t10, t11, t12, t14, t16, e1x, expl2, comm, expl6, expl7,
]);
