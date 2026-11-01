import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, SH, cards, ground, shape, ell, polyP, rrect, shadow, line, shine, arrow, plate, seed, hand, person, write, rnd } from "./flatKit";

// sci.how-we-know.questioning-evidence.L3 set-up cards: the questions table, the clock, and the chana-moong jar.
const CHANA = "#e8cf94", CHANA_DK = "#c4a15a", WALL = "#f3e6c9", FLOOR = "#d9b98a";
const chana = (c: Ctx, x: number, y: number, r: number, rot: number) => seed(c, x, y, r, rot, false, CHANA, CHANA_DK);
const moong = (c: Ctx, x: number, y: number, r: number, rot: number) => seed(c, x, y, r, rot, false);

const counter = (c: Ctx) => { ground(c); c.fillStyle = "#e6d6b6"; c.fillRect(0, 880, 1080, 200); line(c, [[0, 880], [1080, 880]], 5); };

// ------------------------------------------------------------ the notebook table
const paperPage = (c: Ctx) => {
  ground(c);
  c.beginPath(); rrect(c, 110, 110, 900, 900, 24); c.fillStyle = SH; c.fill();
  shape(c, () => rrect(c, 80, 70, 900, 900, 24), COL.paper, 7);
  for (let i = 0; i < 6; i++) shape(c, () => ell(c, 80, 150 + i * 150, 14, 14), "#d9cdb4", 4);
};
// the question-sorting table: three colour heads (green, yellow, red) and three rows; marks: rows of "t"(tick) "x"(cross) or ""
const sortTable = (c: Ctx, x: number, y: number, cw: number, rh: number, marks: string[][]) => {
  const cols = [COL.green, COL.yellow, COL.red];
  cols.forEach((col, i) => shape(c, () => rect(c, x + i * cw, y, cw, rh), col, 6));
  for (let r = 0; r < 3; r++) for (let i = 0; i < 3; i++) {
    const cx = x + i * cw, cy = y + rh + r * rh;
    shape(c, () => rect(c, cx, cy, cw, rh), WHITE, 6);
    const m = marks[i]?.[r];
    if (m === "t") line(c, [[cx + cw * 0.28, cy + rh * 0.5], [cx + cw * 0.44, cy + rh * 0.72], [cx + cw * 0.74, cy + rh * 0.28]], 16, COL.greenDk);
    if (m === "x") { line(c, [[cx + cw * 0.3, cy + rh * 0.28], [cx + cw * 0.7, cy + rh * 0.72]], 16, RED); line(c, [[cx + cw * 0.7, cy + rh * 0.28], [cx + cw * 0.3, cy + rh * 0.72]], 16, RED); }
  }
};
const rect = (c: Ctx, x: number, y: number, w: number, h: number) => polyP(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);

const qmark = (c: Ctx, x: number, y: number, k: number) => {
  c.beginPath(); c.arc(x, y, 38 * k, Math.PI * 1.05, Math.PI * 2.4); c.lineWidth = 16 * k; c.strokeStyle = INK; c.lineCap = "round"; c.stroke();
  line(c, [[x + 17 * k, y + 28 * k], [x, y + 62 * k]], 16 * k); shape(c, () => ell(c, x, y + 100 * k, 10 * k, 10 * k), INK, 0);
};

// setup.e1.0
const card_e1_0 = (c: Ctx) => {
  paperPage(c);
  for (let i = 0; i < 8; i++) {
    const y = 135 + i * 100;
    write(c, String(i + 1), 140, y, 44, INK, 7);
    qmark(c, 235, y + 22, 0.5);
    line(c, [[300, y + 44], [400, y + 44]], 6, COL.greyDk);
  }
  sortTable(c, 450, 150, 160, 150, []);
  // the pencil
  const pencil = () => { c.save(); c.translate(620, 840); c.rotate(-0.25); shape(c, () => rrect(c, -150, -24, 270, 48, 8), COL.yellow, 6); shape(c, () => polyP(c, [[120, -24], [190, 0], [120, 24]]), "#f2d6a8", 6); shape(c, () => polyP(c, [[168, -8], [190, 0], [168, 8]]), INK, 3); shape(c, () => rrect(c, -150, -24, 40, 48, 8), COL.pink, 6); c.restore(); };
  pencil();
};

// setup.e1.1
const card_e1_1 = (c: Ctx) => {
  ground(c, WALL);
  c.fillStyle = FLOOR; c.fillRect(0, 900, 1080, 180); line(c, [[0, 900], [1080, 900]], 5);
  // the closed door
  shape(c, () => rect(c, 40, 120, 230, 780), COL.brown, 7);
  shape(c, () => rect(c, 70, 160, 170, 300), COL.woodDk, 5); shape(c, () => rect(c, 70, 500, 170, 340), COL.woodDk, 5);
  shape(c, () => ell(c, 235, 520, 16, 16), COL.yellow, 5);
  const girl = person, h1 = 560, h2 = 660;
  shadow(c, 450, 905, 130, 22); shadow(c, 830, 905, 150, 24);
  girl(c, 430, 900, h1, { armR: [0.25, -0.1] });
  hand(c, 673, 517, 0, 0.55, SKIN.child, CLOTH.child, true);
  person(c, 800, 900, h2, { adult: true, armL: [Math.PI * 0.55, Math.PI * 0.5] });
  // girl asks: question mark bubble
  const bub = (x: number, y: number, w: number, hh: number, tx: number) => { shape(c, () => rrect(c, x, y, w, hh, 40), WHITE, 6); shape(c, () => polyP(c, [[tx - 20, y + hh - 3], [tx + 20, y + hh - 3], [tx, y + hh + 40]]), WHITE, 6); line(c, [[tx - 14, y + hh - 3], [tx + 14, y + hh - 3]], 8, WHITE); };
  bub(330, 70, 230, 190, 430);
  c.beginPath(); c.arc(445, 128, 38, Math.PI * 1.05, Math.PI * 2.4); c.lineWidth = 16; c.strokeStyle = INK; c.lineCap = "round"; c.stroke();
  line(c, [[462, 156], [445, 190]], 16); shape(c, () => ell(c, 445, 228, 10, 10), INK, 0);
  // relative answers: how sure, as three colour dots, one ringed
  bub(690, 30, 280, 160, 800);
  [COL.green, COL.yellow, COL.red].forEach((col, i) => shape(c, () => ell(c, 745 + i * 90, 100, 32, 32), col, i === 1 ? 10 : 5));
};

// setup.e1.2
const card_e1_2 = (c: Ctx) => {
  ground(c, WALL);
  const cx = 480, cy = 450, R = 360;
  c.beginPath(); ell(c, cx + 20, cy + 26, R, R); c.fillStyle = SH; c.fill();
  shape(c, () => ell(c, cx, cy, R, R), COL.brown, 8);
  shape(c, () => ell(c, cx, cy, R - 34, R - 34), WHITE, 6);
  for (let n = 1; n <= 12; n++) {
    const a = (n / 12) * Math.PI * 2 - Math.PI / 2, hh = 76, len = String(n).length, wd = hh * (0.8 * (len - 1) + 0.6);
    write(c, String(n), cx + Math.cos(a) * 245 - wd / 2, cy + Math.sin(a) * 245 - hh / 2, hh, INK, 10);
  }
  line(c, [[cx, cy], [cx + 120, cy - 100]], 20); line(c, [[cx, cy], [cx - 20, cy + 170]], 14);
  shape(c, () => ell(c, cx, cy, 20, 20), RED, 5);
  // the child's hand, one finger on the numbers, counting them (it rests on the 4)
  hand(c, 880, 620, -2.9, 1.7, SKIN.child, CLOTH.child, true);
};

// setup.e1.3
const card_e1_3 = (c: Ctx) => {
  paperPage(c);
  sortTable(c, 140, 120, 240, 130, [["t", "t", "x"], ["t", "x", "x"], ["x", "x", ""]]);
  [1, 2, 2].forEach((n, i) => {
    const x = 140 + i * 240;
    arrow(c, [[x + 120, 665], [x + 120, 750]], i === 0 ? COL.greenDk : i === 1 ? "#d9a300" : RED, 12);
    shape(c, () => rect(c, x, 770, 240, 150), "#fff1c7", 6);
    line(c, [[x + 28, 812], [x + 88, 878]], 16, RED); line(c, [[x + 88, 812], [x + 28, 878]], 16, RED);
    write(c, String(n), x + 130, 800, 90, INK, 12);
  });
};

// ------------------------------------------------------------ the jar of chana and moong
const jarBody = (c: Ctx, cx: number, by: number, w: number, h: number) => rrect(c, cx - w / 2, by - h, w, h, 40);
// mode: layers = moong at the bottom, chana on top; mix = the two mixed. fillTo: how full (0..1)
const jar = (c: Ctx, cx: number, by: number, w: number, h: number, mode: "layers" | "mix", fillTo = 0.66) => {
  shadow(c, cx + 30, by + 14, w * 0.6, 26);
  shape(c, () => jarBody(c, cx, by, w, h), "rgba(214,236,250,0.35)", 0);
  c.save(); c.beginPath(); jarBody(c, cx, by, w, h); c.clip();
  const top = by - h * fillTo, split = by - h * fillTo * 0.5, r = rnd(5);
  c.fillStyle = mode === "layers" ? COL.greenDk : "#a8955a"; c.fillRect(cx - w, split, w * 2, by - split + 10);
  if (mode === "layers") { c.fillStyle = CHANA_DK; c.fillRect(cx - w, top, w * 2, split - top); } else { c.fillStyle = "#a8955a"; c.fillRect(cx - w, top, w * 2, split - top); }
  const st = w / 9;
  for (let y = by - st * 0.5; y > top - st * 0.4; y -= st * 0.78) for (let x = cx - w / 2 + st * 0.3 + ((Math.round(by - y) / st) % 2) * 0; x < cx + w / 2; x += st) {
    const px = x + r() * st * 0.4, py = y + r() * st * 0.3, rot = r() * 3, isChana = mode === "layers" ? py < split : r() < 0.5;
    if (py < top) continue;
    if (isChana) chana(c, px, py, st * 0.62, rot); else moong(c, px, py, st * 0.46, rot);
  }
  c.restore();
  shape(c, () => jarBody(c, cx, by, w, h), "rgba(214,236,250,0.22)", 7);
  shine(c, [[cx - w / 2 + 28, by - h + 70], [cx - w / 2 + 28, by - h * 0.45]], 11);
  shape(c, () => rrect(c, cx - w / 2 - 8, by - h - 34, w + 16, 46, 12), COL.steel, 7);
};
// a cloth round the left half of the jar
const clothOn = (c: Ctx, cx: number, by: number, w: number, h: number) => {
  const x0 = cx - w / 2 - 14, x1 = cx + 4;
  shape(c, () => { c.moveTo(x0, by - h + 40); c.quadraticCurveTo(x1 + 30, by - h + 90, x1, by - h * 0.6); c.quadraticCurveTo(x1 - 30, by - h * 0.3, x1 + 10, by - 20); c.lineTo(x1 - 20, by + 8); c.lineTo(x0, by + 8); c.closePath(); }, COL.cloth, 7);
  for (let i = 1; i < 4; i++) line(c, [[x0 + i * (x1 - x0) / 4, by - h + 70], [x0 + i * (x1 - x0) / 4 + 10, by - 10]], 5, "#d8cdb4");
};

// setup.e2.0
const card_e2_0 = (c: Ctx) => {
  counter(c);
  jar(c, 540, 930, 380, 720, "layers");
  clothOn(c, 540, 930, 380, 720);
  // pour chana in from a katori
  c.save(); c.translate(860, 150); c.rotate(0.9);
  shape(c, () => { c.moveTo(-90, 0); c.bezierCurveTo(-80, 70, 80, 70, 90, 0); c.closePath(); }, COL.steel);
  shape(c, () => ell(c, 0, 0, 90, 20), COL.steelIn, 5);
  c.restore();
  [[800, 250], [770, 300], [740, 350], [700, 400], [660, 450]].forEach(([x, y], i) => chana(c, x, y, 20, i));
  arrow(c, [[920, 330], [830, 400]]);
};

// setup.e2.1
const card_e2_1 = (c: Ctx) => {
  counter(c);
  plate(c, 540, 700, 420, 200);
  [[390, 700], [470, 690], [550, 700], [630, 690], [710, 700]].forEach(([x, y], i) => chana(c, x, y, 30, i * 0.7));
  // the spoon held tipped over the plate
  line(c, [[1030, 80], [640, 430]], 40); line(c, [[1030, 80], [640, 430]], 26, COL.steel);
  shape(c, () => ell(c, 600, 460, 100, 62, 0.75), COL.steel);
  shape(c, () => ell(c, 598, 458, 78, 44, 0.75), COL.steelIn, 4);
  [[560, 530], [520, 590]].forEach(([x, y], i) => chana(c, x, y, 26, i));
  hand(c, 960, 160, 2.3, 1.5, SKIN.child, CLOTH.child);
  // a finger counting the grains
  hand(c, 230, 850, -0.95, 1.7, SKIN.child, CLOTH.child, true);
};

// setup.e2.2
const card_e2_2 = (c: Ctx) => {
  counter(c);
  jar(c, 400, 930, 400, 760, "layers");
  // the cloth, lifted away to the right
  shadow(c, 870, 930, 190, 30);
  shape(c, () => { c.moveTo(690, 900); c.quadraticCurveTo(700, 700, 800, 650); c.quadraticCurveTo(900, 600, 980, 720); c.quadraticCurveTo(1040, 820, 1010, 915); c.closePath(); }, COL.cloth, 7);
  line(c, [[780, 720], [820, 880]], 5, "#d8cdb4"); line(c, [[880, 690], [900, 880]], 5, "#d8cdb4"); line(c, [[950, 750], [960, 890]], 5, "#d8cdb4");
  arrow(c, [[740, 590], [850, 510]]);
};

// setup.e2.3
const card_e2_3 = (c: Ctx) => {
  counter(c);
  jar(c, 270, 930, 340, 700, "mix", 0.62);
  plate(c, 770, 720, 300, 150);
  const heap = (x: number, y: number, s: number) => { const r = rnd(s); for (let i = 0; i < 9; i++) { const px = x + (r() - 0.5) * 130, py = y + (r() - 0.5) * 60; if (i % 2) chana(c, px, py, 36, r() * 3); else moong(c, px, py, 28, r() * 3); } };
  heap(640, 740, 3); heap(780, 680, 4); heap(900, 750, 8);
  arrow(c, [[470, 470], [640, 540]]);
};

export const su_howWeKnowQuestioningEvidence = cards("sci.how-we-know.questioning-evidence.L3 set-up", [
  card_e1_0, card_e1_1, card_e1_2, card_e1_3, card_e2_0, card_e2_1, card_e2_2, card_e2_3,
]);
