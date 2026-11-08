import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, seed, person, hand, write, cards, rnd } from "./flatKit";

// MICROORGANISMS · GERMS L4 · set-up cards and card pictures in the flat DeepKids look.

const TABLE = "#e8cf9a", TABLE_DK = "#c9ab6e", PAPER = "#fffaf0", YEAST = "#e6cf98", FOAM = "#fbf1d6";
const table = (c: Ctx, y0: number) => { ground(c); c.fillStyle = TABLE; c.fillRect(0, y0, D, D - y0); line(c, [[0, y0], [D, y0]], 6); };
const circ = (c: Ctx, x: number, y: number, r: number, fill: string, w = 4) => shape(c, () => ell(c, x, y, r, r), fill, w);
const cross = (c: Ctx, x: number, y: number, r: number, w = 9) => { line(c, [[x - r, y - r], [x + r, y + r]], w, RED); line(c, [[x + r, y - r], [x - r, y + r]], w, RED); };
const nothing = (c: Ctx, x: number, y: number, r: number) => { circ(c, x, y, r, WHITE, 6); line(c, [[x - r * 0.7, y + r * 0.7], [x + r * 0.7, y - r * 0.7]], 9, RED); };

const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.12, 0.62], [0.48, 0.62]]],
  B: [[[0, 0], [0, 1]], [[0, 0], [0.4, 0], [0.55, 0.22], [0.4, 0.48], [0, 0.48]], [[0, 0.48], [0.45, 0.48], [0.6, 0.74], [0.45, 1], [0, 1]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col: string = INK, w = 9) => LET[ch].forEach((st) => line(c, st.map(([u, v]) => [x + u * h, y + v * h]), w, col));
const badge = (c: Ctx, ch: string, x: number, y: number, r: number) => { circ(c, x, y, r, WHITE, 6); letter(c, ch, x - r * 0.3, y - r * 0.45, r * 0.9, INK, 9); };
// a temperature such as 36.4 (the third digit follows a dot)
const temp = (c: Ctx, s: string, x: number, y: number, h: number, col: string = INK, w = 6) => {
  write(c, s.slice(0, 2), x, y, h, col, w); c.beginPath(); c.arc(x + h * 1.7, y + h * 0.95, w * 0.75, 0, 6.3); c.fillStyle = col; c.fill(); write(c, s.slice(2), x + h * 1.95, y, h, col, w);
};

const mound = (c: Ctx, x: number, y: number, rw: number, hh: number, fill: string, dk: string, ry = 0) => {
  const p = () => { c.moveTo(x - rw, y); c.bezierCurveTo(x - rw * 0.7, y - hh * 0.3, x - rw * 0.3, y - hh, x, y - hh); c.bezierCurveTo(x + rw * 0.3, y - hh, x + rw * 0.7, y - hh * 0.3, x + rw, y); if (ry) c.ellipse(x, y, rw, ry, 0, 0, Math.PI); c.closePath(); };
  shape(c, p, fill, 5); shade(c, p, dk, -rw * 0.22, -hh * 0.12, 0.5);
};
const spoon = (c: Ctx, x: number, y: number, rot: number, len: number, fill: string = COL.steel) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => { c.moveTo(0, -7); c.lineTo(len, -5); c.quadraticCurveTo(len + 10, 0, len, 5); c.lineTo(0, 7); c.closePath(); }, COL.steelDk, 5);
  shape(c, () => ell(c, 0, 0, len * 0.2, len * 0.14), fill, 5);
  c.restore();
};
const grip = (c: Ctx, x: number, y: number, w: number, skin: string = SKIN.child) => {
  shape(c, () => rrect(c, x - w / 2, y - 22, w, 44, 20), skin, 5);
  line(c, [[x - w * 0.15, y - 6], [x - w * 0.15, y + 8]], 3, SKIN.childDk);
  line(c, [[x + w * 0.1, y - 6], [x + w * 0.1, y + 8]], 3, SKIN.childDk);
};

type Kind = "salt" | "vinegar" | "garlic" | "turmeric";
const bulb = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => { c.moveTo(x, y - s); c.bezierCurveTo(x + s * 0.1, y - s * 0.75, x + s * 0.62, y - s * 0.75, x + s * 0.58, y - s * 0.35); c.bezierCurveTo(x + s * 0.55, y - s * 0.05, x + s * 0.2, y, x, y); c.bezierCurveTo(x - s * 0.2, y, x - s * 0.55, y - s * 0.05, x - s * 0.58, y - s * 0.35); c.bezierCurveTo(x - s * 0.62, y - s * 0.75, x - s * 0.1, y - s * 0.75, x, y - s); c.closePath(); };
  shape(c, p, "#f6efe3", 5); shade(c, p, COL.grey, -s * 0.1, -s * 0.05, 0.45);
  line(c, [[x, y - s * 0.85], [x - s * 0.18, y - s * 0.4], [x - s * 0.1, y - s * 0.05]], 3); line(c, [[x, y - s * 0.85], [x + s * 0.2, y - s * 0.4], [x + s * 0.1, y - s * 0.05]], 3);
};
const thing = (c: Ctx, k: Kind, x: number, y: number, s: number) => {
  shadow(c, x + s * 0.08, y + 3, s * 0.5, s * 0.08);
  if (k === "salt") { mound(c, x, y, s * 0.55, s * 0.55, "#fdfdfb", COL.steelDk); [[-0.2, -0.15], [0.1, -0.3], [0.22, -0.1], [-0.05, -0.08]].forEach(([u, v]) => circ(c, x + u * s, y + v * s, 2.5, COL.steel, 0)); }
  else if (k === "turmeric") mound(c, x, y, s * 0.55, s * 0.55, "#eaa81e", "#c9871a");
  else if (k === "garlic") bulb(c, x, y, s * 0.95);
  else {
    shape(c, () => rrect(c, x - s * 0.3, y - s * 0.72, s * 0.6, s * 0.72, 10), "#dfeaf0", 5); shape(c, () => rrect(c, x - s * 0.1, y - s * 0.98, s * 0.2, s * 0.3, 4), "#dfeaf0", 5);
    shape(c, () => rrect(c, x - s * 0.13, y - s * 1.08, s * 0.26, s * 0.13, 4), RED, 4); shape(c, () => rrect(c, x - s * 0.3, y - s * 0.5, s * 0.6, s * 0.22, 3), WHITE, 4);
    shine(c, [[x - s * 0.2, y - s * 0.65], [x - s * 0.2, y - s * 0.52]], 6);
  }
};
const tag = (c: Ctx, k: Kind | null | "blank", x: number, y: number, w: number, h: number) => {
  shadow(c, x + 8, y + h + 4, w * 0.5, 10);
  shape(c, () => rrect(c, x - w / 2, y, w, h, 16), WHITE, 6);
  if (k === "blank") return; if (k) thing(c, k, x, y + h - 26, w * 0.7); else nothing(c, x, y + h / 2, w * 0.28);
};

// a tumbler of yeast water with foam rising from level f0 to f1 (fractions of the height)
const foamGlass = (c: Ctx, x: number, y: number, w: number, h: number, f0: number, f1: number, seedN: number) => {
  glass(c, x, y, w, h, f0, YEAST);
  if (f1 <= f0 + 0.01) return;
  const top = w / 2, bot = w * 0.4, wd = (f: number) => bot + (top - bot) * f, yy = (f: number) => y - h * f;
  c.save(); c.beginPath(); c.moveTo(x - wd(f0), yy(f0)); c.lineTo(x + wd(f0), yy(f0)); c.lineTo(x + wd(f1), yy(f1)); c.lineTo(x - wd(f1), yy(f1)); c.closePath(); c.clip();
  c.fillStyle = FOAM; c.fillRect(x - w, yy(f1) - 10, w * 2, yy(f0) - yy(f1) + 20);
  const r = rnd(seedN);
  for (let i = 0; i < 38; i++) { const bx = x - wd(f1) * 0.9 + r() * wd(f1) * 1.8, by = yy(f1) + 6 + r() * (yy(f0) - yy(f1) - 6), br = 6 + r() * 9; c.beginPath(); c.arc(bx, by, br, 0, 6.3); c.fillStyle = "rgba(255,255,255,0.8)"; c.fill(); c.lineWidth = 3; c.strokeStyle = "#dcc38a"; c.stroke(); }
  c.restore();
  line(c, [[x - wd(f0), yy(f0)], [x - wd(f1), yy(f1)]], 5); line(c, [[x + wd(f0), yy(f0)], [x + wd(f1), yy(f1)]], 5);
  for (let i = 0; i < 6; i++) { const bx = x - wd(f1) + (i + 0.5) * (wd(f1) * 2) / 6; c.beginPath(); c.arc(bx, yy(f1) + 2, wd(f1) / 6.4, Math.PI, 0); c.fillStyle = FOAM; c.fill(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke(); }
};

// ---------------------------------------------------------------- set-up cards
// setup.e1.0 five glasses on a tray, a tag under each
const s_e1_0 = (c: Ctx) => {
  table(c, 470);
  shadow(c, 560, 700, 500, 22);
  shape(c, () => rrect(c, 40, 570, 1000, 120, 30), COL.steel, 6); shape(c, () => rrect(c, 70, 590, 940, 80, 22), COL.steelIn, 4);
  const kinds: (Kind | null)[] = [null, "salt", "vinegar", "garlic", "turmeric"];
  kinds.forEach((k, i) => { const x = 160 + i * 190; glass(c, x, 650, 170, 340, 0.55, COL.water); tag(c, k, x, 750, 160, 190); });
};
// setup.e1.2 the four test things in bowls, beside glasses 2 to 5
const bowlWith = (c: Ctx, k: Kind, x: number, y: number, r: number) => {
  bowl(c, x, y, r);
  if (k === "vinegar") { shape(c, () => ell(c, x, y, r * 0.9, r * 0.17), "#cfe3ee", 0); shine(c, [[x - r * 0.5, y - r * 0.03], [x - r * 0.15, y - r * 0.06]], 6); }
  else if (k === "garlic") { mound(c, x, y, r * 0.78, r * 0.4, "#f4e8cc", COL.grey, r * 0.17); [[-0.3, -0.12], [0.05, -0.22], [0.3, -0.1]].forEach(([u, v]) => line(c, [[x + u * r, y + v * r], [x + u * r + 12, y + v * r + 4]], 4, COL.greyDk)); }
  else mound(c, x, y, r * 0.78, r * 0.5, k === "salt" ? "#fdfdfb" : "#eaa81e", k === "salt" ? COL.steelDk : "#c9871a", r * 0.17);
  c.beginPath(); c.ellipse(x, y, r, r * 0.2, 0, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
};
const s_e1_2 = (c: Ctx) => {
  table(c, 330);
  const kinds: Kind[] = ["salt", "vinegar", "garlic", "turmeric"];
  for (let i = 0; i < 5; i++) glass(c, 150 + i * 195, 560, 150, 280, 0.55, YEAST);
  nothing(c, 150, 790, 52);
  kinds.forEach((k, i) => bowlWith(c, k, 345 + i * 195, 780, 82));
};
// setup.e1.3 a ruler held beside a glass, zero at the water, foam up to 20 mm
const s_e1_3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 0, 860, D, 220), TABLE, 0); line(c, [[0, 880], [D, 880]], 6);
  foamGlass(c, 380, 880, 300, 560, 0.4, 0.757, 5);
  const rx = 610;
  shadow(c, rx + 10, 886, 70, 12);
  shape(c, () => rrect(c, rx - 55, 330, 110, 560, 8), COL.wood, 6);
  c.lineCap = "butt";
  for (let mm = 0; mm <= 30; mm++) { const yy = 656 - mm * 10, big = mm % 10 === 0, mid = mm % 5 === 0; line(c, [[rx - 55, yy], [rx - 55 + (big ? 44 : mid ? 30 : 18), yy]], big ? 5 : 3); }
  [1, 2, 3].forEach((n) => write(c, String(n), rx - 4, 656 - n * 100 - 16, 32, INK, 5));
  line(c, [[rx - 55, 656], [rx + 55, 656]], 5, INK);
  // the forearm and the hand gripping the ruler low down
  const wx = rx + 91, wy = 770;
  shape(c, () => rrect(c, wx + 30, wy - 40, 460, 80, 20), CLOTH.child, 6);
  hand(c, wx, wy, Math.PI, 1.3);
  arrow(c, [[860, 456], [690, 456]]);
};
// setup.e2.0 two plates, A and B, each with 38 rice and 2 moong
const grains = (c: Ctx, cx: number, cy: number, rx: number, ry: number, nRice: number, nDal: number, seedN: number) => {
  const r = rnd(seedN), pts: number[][] = [];
  for (let tries = 0; pts.length < nRice + nDal && tries < 20000; tries++) {
    const a = r() * 6.283, d = Math.sqrt(r()), x = cx + Math.cos(a) * d * rx, y = cy + Math.sin(a) * d * ry, gap = tries < 8000 ? 32 : 26;
    if (pts.every(([px, py]) => Math.hypot(px - x, (py - y) * 1.25) > gap)) pts.push([x, y, r() * 3.14]);
  }
  const dal = new Set<number>(); for (let i = 0; dal.size < nDal; i++) dal.add(Math.floor(r() * pts.length));
  pts.sort((a, b) => a[1] - b[1]).forEach(([x, y, rot], i) => { if (dal.has(i)) seed(c, x, y, 12, rot); else shape(c, () => ell(c, x, y, 14, 6, rot), "#fffdf6", 3.5); });
};
const riceIcon = (c: Ctx, x: number, y: number) => shape(c, () => ell(c, x, y, 20, 9, -0.4), "#fffdf6", 4);
const countRow = (c: Ctx, x: number, y: number, nRice: string, nDal: string) => {
  riceIcon(c, x, y + 20); write(c, nRice, x + 40, y, 50, INK, 7);
  seed(c, x + 200, y + 20, 19, -0.4); write(c, nDal, x + 240, y, 50, INK, 7);
};
const s_e2_0 = (c: Ctx) => {
  table(c, 280);
  [[290, "A"], [790, "B"]].forEach(([x, ch]) => {
    plate(c, x as number, 470, 240, 130);
    grains(c, x as number, 470, 190, 90, 38, 2, 21);
    badge(c, ch as string, (x as number) - 130, 740, 62);
    countRow(c, (x as number) - 20, 720, "38", "2");
  });
};

// ---------------------------------------------------------------- medicine things
const strip = (c: Ctx, x: number, y: number, rot: number, col: string) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -72, -34, 144, 68, 10), COL.steel, 5);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) shape(c, () => ell(c, -42 + i * 42, -15 + j * 30, 13, 10), col, 3.5);
  c.restore();
};
const medBottle = (c: Ctx, x: number, y: number, w: number, h: number, body: string = "#c98a3a", cap: string = WHITE) => {
  shadow(c, x + w * 0.1, y + 4, w * 0.6, 9);
  const nw = w * 0.42;
  shape(c, () => rrect(c, x - w / 2, y - h * 0.8, w, h * 0.8, 12), body, 5); shade(c, () => rrect(c, x - w / 2, y - h * 0.8, w, h * 0.8, 12), "#8e5b20", -w * 0.12, 0, 0.5);
  shape(c, () => rrect(c, x - nw / 2, y - h * 0.92, nw, h * 0.16, 4), body, 5); shape(c, () => rrect(c, x - nw * 0.65, y - h, nw * 1.3, h * 0.11, 5), cap, 5);
  shape(c, () => rrect(c, x - w * 0.4, y - h * 0.62, w * 0.8, h * 0.4, 5), WHITE, 4);
  line(c, [[x - w * 0.28, y - h * 0.5], [x + w * 0.28, y - h * 0.5]], 4); line(c, [[x - w * 0.28, y - h * 0.38], [x + w * 0.1, y - h * 0.38]], 4);
};
const tube = (c: Ctx, x: number, y: number, rot: number, col: string) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => { c.moveTo(-60, -30); c.lineTo(40, -20); c.lineTo(40, 20); c.lineTo(-60, 30); c.closePath(); }, col, 5);
  shape(c, () => rrect(c, -78, -34, 22, 68, 3), COL.steel, 4);
  shape(c, () => rrect(c, 38, -14, 38, 28, 6), WHITE, 5);
  c.restore();
};
const germ = (c: Ctx, x: number, y: number, r: number, col: string) => {
  for (let i = 0; i < 10; i++) { const a = (i / 10) * 6.283, px = x + Math.cos(a) * r * 1.4, py = y + Math.sin(a) * r * 1.4; line(c, [[x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8], [px, py]], 5); circ(c, px, py, r * 0.17, col, 3.5); }
  circ(c, x, y, r, col, 5); circ(c, x - r * 0.3, y - r * 0.25, r * 0.13, WHITE, 0); circ(c, x + r * 0.25, y - r * 0.25, r * 0.13, WHITE, 0);
  c.beginPath(); c.arc(x, y + r * 0.1, r * 0.35, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
const calendar = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - s / 2, y - s / 2, s, s, 8), WHITE, 5); shape(c, () => rrect(c, x - s / 2, y - s / 2, s, s * 0.28, 8), COL.red, 5);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) circ(c, x - s * 0.28 + i * s * 0.28, y + s * 0.02 + j * s * 0.22, 3.5, INK, 0);
};
const a1_1 = (c: Ctx) => {
  table(c, 0);
  const cells: [number, number, number][] = [[60, 60, 0], [570, 60, 1], [60, 570, 2], [570, 570, 3]];
  cells.forEach(([mx, my, k]) => {
    shape(c, () => rrect(c, mx, my, 450, 450, 36), k === 3 ? "#f8d9d2" : PAPER, 6);
    const bx = mx + 225, by = my + 80;
    circ(c, bx, by, 56, WHITE, 5);
    if (k === 0) germ(c, bx, by, 24, COL.green);
    if (k === 1) { shape(c, () => rrect(c, bx - 8, by - 36, 16, 54, 8), WHITE, 4); shape(c, () => ell(c, bx, by + 24, 15, 15), COL.red, 4); line(c, [[bx, by - 14], [bx, by + 16]], 7, COL.red); }
    if (k === 2) { c.save(); c.translate(bx, by); c.rotate(-0.5); shape(c, () => rrect(c, -34, -15, 68, 30, 9), "#f1c9a0", 4); shape(c, () => rrect(c, -13, -15, 26, 30, 2), WHITE, 3); c.restore(); }
    if (k === 3) { calendar(c, bx, by, 66); cross(c, bx, by + 6, 20, 8); }
    const L = mx + 70;
    if (k === 0) { strip(c, mx + 150, my + 220, 0, COL.red); strip(c, mx + 150, my + 330, 0, COL.yellow); medBottle(c, mx + 340, my + 400, 96, 180); }
    if (k === 1) { medBottle(c, L + 40, my + 410, 100, 190, "#e4a53a"); strip(c, mx + 320, my + 260, 0, COL.blue); strip(c, mx + 320, my + 360, 0, COL.pink); }
    if (k === 2) { tube(c, mx + 190, my + 260, -0.12, COL.teal); tube(c, mx + 200, my + 360, 0.08, COL.orange); shape(c, () => rrect(c, mx + 320, my + 300, 90, 90, 14), WHITE, 5); shape(c, () => rrect(c, mx + 320, my + 280, 90, 36, 10), COL.purple, 5); }
    if (k === 3) { strip(c, mx + 140, my + 270, 0, "#b9b4ab"); medBottle(c, mx + 330, my + 410, 100, 190, "#b98a55"); strip(c, mx + 140, my + 370, 0, "#b9b4ab"); }
  });
};

// a2: 30 cards with different codes
const codes = (n: number, seedN: number) => {
  const r = rnd(seedN), cs = "2345679gcl", out: string[] = [];
  while (out.length < n) { const t = cs[Math.floor(r() * 10)] + cs[Math.floor(r() * 10)] + cs[Math.floor(r() * 10)]; if (!out.includes(t)) out.push(t); }
  return out;
};
const codeCard = (c: Ctx, x: number, y: number, w: number, h: number, t: string, fill: string = PAPER, hh = 34) => {
  shadow(c, x + w / 2 + 6, y + h + 4, w * 0.5, 8);
  shape(c, () => rrect(c, x, y, w, h, 14), fill, 5); write(c, t, x + (w - hh * 2.4) / 2 + 4, y + (h - hh) / 2, hh, INK, 5);
};
const s_a2_0 = (c: Ctx) => {
  table(c, 0);
  const cs = codes(30, 4);
  write(c, "30", 450, 80, 120, INK, 12);
  for (let i = 0; i < 30; i++) codeCard(c, 80 + (i % 6) * 156, 280 + Math.floor(i / 6) * 120, 140, 100, cs[i]);
};

// a4 cups with a child sipping
const childBehindTable = (c: Ctx, x: number, h: number, edge: number, reachR: [number, number], draw: (hr: [number, number]) => void) => {
  const hands = person(c, x, 1060, h, { reachR, dir: -1 });
  draw(hands.handR);
  shape(c, () => rrect(c, -20, edge, D + 40, D, 0), TABLE, 6);
};
const dropIcon = (c: Ctx, x: number, y: number, s: number) => shape(c, () => { c.moveTo(x, y - s); c.quadraticCurveTo(x + s * 0.9, y + s * 0.1, x, y + s * 0.8); c.quadraticCurveTo(x - s * 0.9, y + s * 0.1, x, y - s); c.closePath(); }, COL.water, 4);
const sachet = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => polyP(c, [[x - w / 2, y - h / 2 + 8], [x - w / 4, y - h / 2], [x, y - h / 2 + 8], [x + w / 4, y - h / 2], [x + w / 2, y - h / 2 + 8], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2]]), COL.orange, 4);
  dropIcon(c, x, y + 4, w * 0.2);
};
const s_a4_1 = (c: Ctx) => {
  ground(c);
  const hands = person(c, 770, 1060, 800, { reachR: [935, 505], dir: -1 });
  // table in front of the child (hides the legs)
  shape(c, () => rrect(c, -20, 640, D + 40, 460, 0), TABLE, 6);
  // spoon held at the child's mouth: the bowl at the lips, the handle through the hand
  const [hx, hy] = hands.handR, bx = 798, by = 482, an = Math.atan2(hy - by, hx - bx);
  spoon(c, bx, by, an, Math.hypot(hx - bx, hy - by) + 60);
  grip(c, hx, hy, 52);
  [170, 350, 530].forEach((x, i) => {
    glass(c, x, 840, 130, 170, 0.5, COL.water);
    tag(c, "blank", x, 890, 150, 140);
    if (i === 0) dropIcon(c, x, 975, 34);
    if (i === 1) { mound(c, x - 14, 1005, 36, 34, "#fdfdfb", COL.steelDk); dropIcon(c, x + 36, 975, 24); }
    if (i === 2) { sachet(c, x - 18, 970, 52, 70); dropIcon(c, x + 34, 970, 24); }
  });
};

// a5 notebook with a table of temperatures
const sunIcon = (c: Ctx, x: number, y: number, r: number) => { for (let i = 0; i < 8; i++) { const a = (i / 8) * 6.283; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.7, y + Math.sin(a) * r * 1.7]], 6, COL.orange); } circ(c, x, y, r, COL.yellow, 5); };
const moonIcon = (c: Ctx, x: number, y: number, r: number) => shape(c, () => { c.moveTo(x + r * 0.3, y - r); c.bezierCurveTo(x - r * 1.3, y - r * 0.9, x - r * 1.3, y + r * 0.9, x + r * 0.3, y + r); c.bezierCurveTo(x - r * 0.45, y + r * 0.5, x - r * 0.45, y - r * 0.5, x + r * 0.3, y - r); c.closePath(); }, "#ffe9a0", 5);
const sunriseIcon = (c: Ctx, x: number, y: number, r: number) => { for (let i = 0; i < 5; i++) { const a = Math.PI + (i / 4) * Math.PI; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 6, COL.orange); } shape(c, () => { c.arc(x, y, r, Math.PI, 0); c.closePath(); }, COL.yellow, 5); line(c, [[x - r * 1.5, y], [x + r * 1.5, y]], 6); };
const faceIcon = (c: Ctx, x: number, y: number, r: number, adult: boolean) => {
  circ(c, x, y, r, adult ? SKIN.adult : SKIN.child, 5);
  shape(c, () => { c.arc(x, y, r, Math.PI * 1.05, Math.PI * 1.95); c.quadraticCurveTo(x, y - r * 0.5, x - r * 0.98, y - r * 0.15); c.closePath(); }, CLOTH.hair, 4);
  circ(c, x - r * 0.35, y + r * 0.1, r * 0.1, INK, 0); circ(c, x + r * 0.35, y + r * 0.1, r * 0.1, INK, 0);
  c.beginPath(); c.arc(x, y + r * 0.25, r * 0.35, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
const s_a5_1 = (c: Ctx) => {
  table(c, 0);
  shadow(c, 520, 930, 430, 24);
  shape(c, () => rrect(c, 110, 80, 840, 840, 30), PAPER, 7);
  for (let i = 0; i < 9; i++) shape(c, () => rrect(c, 80, 140 + i * 90, 66, 26, 13), COL.steel, 5);
  // grid: header row with two faces, three rows of times
  const x0 = 190, cw = [170, 270, 270], y0 = 140, rh = [160, 170, 170, 170];
  const xs = [x0, x0 + cw[0], x0 + cw[0] + cw[1], x0 + cw[0] + cw[1] + cw[2]];
  const ys = [y0, y0 + rh[0], y0 + rh[0] + rh[1], y0 + rh[0] + rh[1] + rh[2], y0 + rh[0] + rh[1] + rh[2] + rh[3]];
  xs.forEach((x) => line(c, [[x, ys[0]], [x, ys[4]]], 6)); ys.forEach((y) => line(c, [[xs[0], y], [xs[3], y]], 6));
  faceIcon(c, (xs[1] + xs[2]) / 2, (ys[0] + ys[1]) / 2, 62, false); faceIcon(c, (xs[2] + xs[3]) / 2, (ys[0] + ys[1]) / 2, 62, true);
  sunriseIcon(c, (xs[0] + xs[1]) / 2, ys[2] - 64, 36); sunIcon(c, (xs[0] + xs[1]) / 2, (ys[2] + ys[3]) / 2, 36); moonIcon(c, (xs[0] + xs[1]) / 2, (ys[3] + ys[4]) / 2, 40);
  const v = [["364", "365"], ["369", "370"], ["367", "368"]];
  v.forEach((row, r) => row.forEach((t, k) => temp(c, t.length === 3 && t[0] === "3" && t[1] === "7" ? "370" : t, xs[1 + k] + 40, ys[1 + r] + (rh[1 + r] - 56) / 2, 56, INK, 7)));
  // the pencil lies flat on the lower margin
  shadow(c, 560, 900, 300, 8);
  shape(c, () => polyP(c, [[300, 880], [740, 880], [740, 912], [300, 912], [262, 896]]), COL.yellow, 5);
  shape(c, () => polyP(c, [[300, 880], [262, 896], [300, 912]]), "#f1c9a0", 4);
  line(c, [[274, 891], [262, 896], [274, 901]], 5, INK);
  shape(c, () => rrect(c, 740, 880, 40, 32, 8), COL.pink, 5);
};

// ---------------------------------------------------------------- card pictures
// flow.e1 five glasses, different foam, the made-up example in mm: 18 1 7 10 16
const f_e1 = (c: Ctx) => {
  table(c, 440);
  const kinds: (Kind | null)[] = [null, "salt", "vinegar", "garlic", "turmeric"], mm = [18, 1, 7, 10, 16];
  kinds.forEach((k, i) => {
    const x = 150 + i * 195;
    foamGlass(c, x, 740, 160, 440, 0.4, 0.4 + mm[i] * 0.0205, 30 + i);
    tag(c, k, x, 790, 150, 150);
    write(c, String(mm[i]), x - (mm[i] > 9 ? 26 : 12), 960, 56, INK, 8);
  });
};
// flow.e2 plate A (medicine) and plate B (none) at the end of day 3: A has 0 rice, 8 moong; B has 38 rice, 2 moong
const capsule = (c: Ctx, x: number, y: number, rot: number) => { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -50, -22, 50, 44, 22), COL.red, 5); shape(c, () => rrect(c, 0, -22, 50, 44, 22), WHITE, 5); c.restore(); };
const f_e2 = (c: Ctx) => {
  table(c, 330);
  badge(c, "A", 130, 150, 62); capsule(c, 300, 150, -0.4);
  badge(c, "B", 630, 150, 62); capsule(c, 800, 150, -0.4); cross(c, 800, 150, 44, 10);
  plate(c, 290, 610, 240, 130); grains(c, 290, 610, 190, 90, 0, 8, 8);
  plate(c, 790, 610, 240, 130); grains(c, 790, 610, 190, 90, 38, 2, 21);
  countRow(c, 270, 830, "0", "8"); countRow(c, 770, 830, "38", "2");
};
// flow.a1 a child reads the label on a medicine bottle, the medicines laid out on the table
const f_a1 = (c: Ctx) => {
  ground(c);
  const hands = person(c, 300, 1060, 800, { reachR: [525, 480], dir: 1 });
  const [hx, hy] = hands.handR;
  medBottle(c, hx, hy + 56, 100, 190, "#c98a3a");
  grip(c, hx, hy, 56);
  shape(c, () => rrect(c, -20, 700, D + 40, 460, 0), TABLE, 6);
  strip(c, 620, 770, 0, COL.red); strip(c, 790, 770, 0, COL.blue); strip(c, 960, 770, 0, COL.yellow);
  tube(c, 640, 930, -0.1, COL.teal); medBottle(c, 830, 1010, 100, 170, "#e4a53a"); medBottle(c, 960, 1010, 90, 160, "#c98a3a");
};
// flow.a2 a germ card, thirty antibody cards, the match picked out, a stopwatch and the memory pile
const star = (c: Ctx, x: number, y: number, r: number) => shape(c, () => { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; i ? c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); }, COL.yellow, 5);
const f_a2 = (c: Ctx) => {
  table(c, 0);
  const cs = codes(30, 9), target = 8; // row 1, column 3
  const germCode = cs[target];
  codeCard(c, 60, 90, 240, 280, "", "#f8d9d2"); germ(c, 180, 190, 48, COL.green); write(c, germCode, 180 - 62, 290, 48, INK, 7);
  // stopwatch
  shadow(c, 190, 556, 80, 14);
  shape(c, () => rrect(c, 168, 400, 44, 26, 6), COL.steelDk, 5);
  circ(c, 190, 486, 76, WHITE, 6); circ(c, 190, 486, 62, "#eef3f8", 3);
  line(c, [[190, 486], [190, 440]], 6); line(c, [[190, 486], [226, 506]], 6, RED); circ(c, 190, 486, 7, INK, 0);
  // memory pile
  codeCard(c, 70, 760, 220, 130, "", PAPER); codeCard(c, 60, 740, 220, 130, germCode, PAPER, 44); star(c, 266, 748, 30);
  for (let i = 0; i < 30; i++) {
    const x = 340 + (i % 5) * 142, y = 90 + Math.floor(i / 5) * 140;
    codeCard(c, x, y, 128, 110, cs[i], i === target ? COL.yellow : PAPER);
    if (i === target) shape(c, () => rrect(c, x - 8, y - 8, 144, 126, 18), "rgba(0,0,0,0)", 8);
  }
};
// flow.a4 a jug of water, 6 teaspoons of sugar, half a teaspoon of salt
const f_a4 = (c: Ctx) => {
  table(c, 650);
  // glass jug with water, spout at the top left, handle on the right
  shadow(c, 560, 860, 190, 20);
  c.beginPath(); c.moveTo(670, 520); c.bezierCurveTo(800, 520, 800, 780, 660, 780); c.strokeStyle = INK; c.lineWidth = 36; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.moveTo(670, 520); c.bezierCurveTo(800, 520, 800, 780, 660, 780); c.strokeStyle = "#e3f0f8"; c.lineWidth = 20; c.stroke();
  const body = () => { c.moveTo(430, 840); c.lineTo(670, 840); c.lineTo(660, 470); c.lineTo(445, 470); c.lineTo(405, 440); c.lineTo(445, 500); c.closePath(); };
  shape(c, () => { c.moveTo(433, 600); c.lineTo(664, 600); c.lineTo(670, 840); c.lineTo(430, 840); c.closePath(); }, COL.water, 0);
  shape(c, () => ell(c, 548, 600, 116, 18), COL.drop, 0);
  shape(c, () => { c.moveTo(430, 840); c.lineTo(670, 840); c.lineTo(660, 470); c.lineTo(445, 470); c.lineTo(400, 436); c.lineTo(440, 510); c.closePath(); }, COL.glass, 6);
  void body;
  shine(c, [[462, 520], [455, 780]], 9);
  // sugar bowl with the spoon in, and the 6
  bowl(c, 190, 800, 120); mound(c, 190, 800, 100, 90, "#fdfdfb", COL.steelDk, 24); spoon(c, 200, 740, -0.9, 190);
  c.beginPath(); c.ellipse(190, 800, 120, 24, 0, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  write(c, "6", 160, 400, 110, INK, 11);
  // salt bowl with a small spoon, and one half
  bowl(c, 900, 810, 80); mound(c, 900, 810, 66, 54, "#fdfdfb", COL.steelDk, 15); spoon(c, 905, 775, -0.9, 120);
  c.beginPath(); c.ellipse(900, 810, 80, 16, 0, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  write(c, "1", 870, 400, 80, INK, 10); line(c, [[850, 510], [950, 510]], 9); write(c, "2", 870, 530, 80, INK, 10);
};
// flow.a5 a thermometer for each time of day: morning, afternoon, evening
const thermo = (c: Ctx, x: number, y: number, t: string) => {
  shadow(c, x + 400, y + 50, 380, 14);
  shape(c, () => polyP(c, [[x, y], [x + 90, y - 22], [x + 90, y + 22]]), COL.steel, 5);
  shape(c, () => rrect(c, x + 80, y - 44, 660, 88, 40), "#f3f6f8", 6);
  shape(c, () => rrect(c, x + 400, y - 30, 290, 60, 12), "#22303a", 5);
  circ(c, x + 180, y, 18, COL.teal, 5);
  temp(c, t, x + 440, y - 24, 46, "#c9f06b", 7);
};
const f_a5 = (c: Ctx) => {
  table(c, 0);
  const ys = [290, 560, 830];
  ys.forEach((y) => shape(c, () => rrect(c, 50, y - 125, 980, 250, 36), PAPER, 6));
  sunriseIcon(c, 150, ys[0] + 20, 46); sunIcon(c, 150, ys[1], 44); moonIcon(c, 150, ys[2], 52);
  thermo(c, 240, ys[0], "364"); thermo(c, 240, ys[1], "369"); thermo(c, 240, ys[2], "367");
};
// flow.a3 a vaccination card: stamp, vial, arrow, the germ it protects against
const vial = (c: Ctx, x: number, y: number, col: string) => {
  shape(c, () => rrect(c, x - 26, y - 20, 52, 66, 10), "#dfeaf0", 5); shape(c, () => rrect(c, x - 26, y + 10, 52, 36, 8), col, 4);
  shape(c, () => rrect(c, x - 18, y - 50, 36, 34, 6), COL.steelDk, 5); shine(c, [[x - 15, y - 10], [x - 15, y + 4]], 5);
};
const f_a3 = (c: Ctx) => {
  table(c, 0);
  shadow(c, 560, 1030, 440, 20);
  shape(c, () => rrect(c, 110, 60, 860, 950, 36), "#fff7e0", 7);
  shape(c, () => rrect(c, 110, 60, 860, 170, 36), COL.teal, 7);
  line(c, [[540, 110], [540, 180]], 22, WHITE); line(c, [[505, 145], [575, 145]], 22, WHITE);
  const cols = [COL.green, COL.orange, COL.purple, COL.red, COL.blue], dates = ["04", "11", "17", "23", "30"], germCols = [COL.green, COL.orange, COL.purple, COL.pink, COL.blue];
  cols.forEach((col, i) => {
    const y = 340 + i * 135;
    if (i) line(c, [[150, y - 68], [930, y - 68]], 4, COL.grey);
    circ(c, 220, y, 48, "#fff7e0", 6); shape(c, () => ell(c, 220, y, 48, 48), "rgba(0,0,0,0)", 0); c.beginPath(); c.arc(220, y, 48, 0, 6.3); c.strokeStyle = RED; c.lineWidth = 6; c.stroke(); write(c, dates[i], 220 - 25, y - 16, 34, RED, 6);
    vial(c, 400, y - 6, col); arrow(c, [[470, y], [690, y]]);
    germ(c, 800, y, 34, germCols[i]);
  });
};
// term.2 fever: a child in bed with a damp cloth, a thermometer reading 38.6 on the bedside table
const t_fever = (c: Ctx) => {
  ground(c);
  c.fillStyle = TABLE; c.fillRect(0, 750, D, 330); line(c, [[0, 750], [D, 750]], 6);
  c.save(); c.translate(0, -110);
  // bed
  shape(c, () => rrect(c, 40, 430, 60, 370, 16), COL.wood, 6);
  shape(c, () => rrect(c, 40, 700, 700, 90, 12), COL.wood, 6); shape(c, () => rrect(c, 700, 740, 40, 120, 6), COL.woodDk, 5); shape(c, () => rrect(c, 40, 780, 40, 80, 6), COL.woodDk, 5);
  shape(c, () => rrect(c, 80, 650, 650, 62, 14), "#f3ece0", 6);
  shape(c, () => rrect(c, 110, 570, 290, 100, 38), WHITE, 6);
  // head: hair, face, damp cloth
  const hx = 255, hy = 520, hr = 95;
  shape(c, () => ell(c, hx, hy - 6, hr + 6, hr + 4), CLOTH.hair, 5);
  shape(c, () => ell(c, hx, hy + 6, hr, hr), SKIN.child, 5);
  shape(c, () => ell(c, hx - hr * 0.5, hy + 42, 22, 14), "#e2765f", 0); shape(c, () => ell(c, hx + hr * 0.5, hy + 42, 22, 14), "#e2765f", 0);
  [-1, 1].forEach((s) => { c.beginPath(); c.arc(hx + s * 36, hy + 20, 14, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); });
  line(c, [[hx - 18, hy + 60], [hx + 18, hy + 60]], 5);
  shape(c, () => rrect(c, hx - 112, hy - 82, 224, 62, 16), "#cfe6f6", 6);
  line(c, [[hx - 80, hy - 56], [hx - 40, hy - 64], [hx, hy - 54], [hx + 40, hy - 64], [hx + 80, hy - 56]], 4, "#8fb3dc");
  [[hx + 70, hy - 4], [hx - 76, hy + 2]].forEach(([dx, dy]) => dropIcon(c, dx, dy, 11));
  // blanket
  const bl = () => { c.moveTo(335, 700); c.bezierCurveTo(335, 610, 360, 595, 420, 595); c.lineTo(640, 605); c.bezierCurveTo(700, 615, 720, 650, 720, 700); c.closePath(); };
  shape(c, bl, COL.teal, 6); shade(c, bl, COL.tealDk, -20, -16, 0.55);
  shape(c, () => rrect(c, 340, 596, 70, 106, 16), "#f7f3e8", 5);
  // bedside table with the thermometer
  shadow(c, 900, 870, 150, 14);
  shape(c, () => rrect(c, 780, 650, 250, 28, 8), COL.woodDk, 6); shape(c, () => rrect(c, 800, 678, 210, 180, 8), COL.wood, 6);
  shape(c, () => rrect(c, 830, 710, 150, 56, 8), COL.woodDk, 5); circ(c, 905, 738, 8, INK, 0);
  shape(c, () => polyP(c, [[790, 610], [830, 590], [830, 630]]), COL.steel, 5);
  shape(c, () => rrect(c, 826, 566, 200, 84, 36), "#f3f6f8", 6);
  shape(c, () => rrect(c, 868, 580, 148, 56, 10), "#22303a", 5);
  temp(c, "386", 884, 592, 32, "#ff8a6e", 6);
  c.restore();
};
// term.7 antiseptic: a grown-up's hand dabs the scrape on a child's knee with a cotton ball
const cotton = (c: Ctx, x: number, y: number, r: number) => {
  [[-0.5, 0.1], [0, -0.45], [0.5, 0.1], [0, 0.4], [0, 0]].forEach(([u, v]) => circ(c, x + u * r, y + v * r, r * 0.55, "#f6e3bf", 4));
  circ(c, x - r * 0.35, y, r * 0.3, "#dca55a", 0);
};
const t_antiseptic = (c: Ctx) => {
  ground(c);
  c.fillStyle = TABLE; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  shadow(c, 480, 906, 260, 14);
  // the child's leg: thigh from the left, round knee, shin down to a sock and shoe on the floor
  const leg = () => { c.moveTo(0, 320); c.lineTo(420, 320); c.bezierCurveTo(580, 320, 640, 440, 600, 540); c.lineTo(580, 800); c.lineTo(400, 800); c.lineTo(405, 570); c.lineTo(0, 570); c.closePath(); };
  shape(c, leg, SKIN.child, 6); shade(c, leg, SKIN.childDk, -26, -20, 0.5);
  shape(c, () => polyP(c, [[0, 280], [220, 280], [220, 610], [0, 610]]), "#6b5a8c", 6);
  shape(c, () => rrect(c, 398, 770, 190, 80, 10), WHITE, 6);
  shape(c, () => { c.moveTo(385, 840); c.lineTo(595, 840); c.quadraticCurveTo(720, 850, 730, 890); c.lineTo(730, 900); c.lineTo(385, 900); c.closePath(); }, "#3a3540", 6);
  line(c, [[385, 890], [730, 890]], 6, WHITE);
  // the scrape on the knee
  shape(c, () => { c.moveTo(520, 380); c.quadraticCurveTo(575, 355, 625, 395); c.quadraticCurveTo(655, 450, 615, 495); c.quadraticCurveTo(560, 520, 525, 480); c.quadraticCurveTo(495, 430, 520, 380); c.closePath(); }, "#d9543f", 5);
  line(c, [[545, 410], [610, 435]], 3, "#a8301f"); line(c, [[545, 455], [605, 465]], 3, "#a8301f");
  // grown-up's forearm from the right, the hand holds the cotton ball against the scrape
  const wx = 800, wy = 445;
  shape(c, () => rrect(c, wx + 40, wy - 44, 400, 88, 22), CLOTH.adult, 6);
  hand(c, wx, wy, Math.PI, 1.4, SKIN.adult, CLOTH.adult);
  cotton(c, wx - 128, wy, 46);
  // the antiseptic bottle on the floor
  medBottle(c, 900, 900, 130, 230, "#8e5b20", WHITE);
};
// term.9 dose: a bottle whose label shows the amount and the times, and a dosing spoon of syrup
const t_dose = (c: Ctx) => {
  table(c, 600);
  medBottle(c, 290, 880, 250, 540, "#e4a53a", WHITE);
  shape(c, () => rrect(c, 190, 450, 200, 280, 14), WHITE, 5);
  write(c, "5", 210, 480, 90, INK, 11); write(c, "m", 292, 514, 50, INK, 8); write(c, "l", 352, 500, 70, INK, 8);
  sunriseIcon(c, 238, 650, 21); sunIcon(c, 290, 650, 19); moonIcon(c, 344, 650, 21);
  line(c, [[210, 700], [370, 700]], 5);
  // the spoon lies on the table, bowl up, syrup in the bowl
  shadow(c, 800, 830, 230, 22);
  shape(c, () => polyP(c, [[800, 768], [1040, 782], [1040, 826], [800, 814]]), COL.steelDk, 5);
  shape(c, () => ell(c, 700, 790, 120, 56), COL.steel, 6);
  shape(c, () => ell(c, 700, 792, 98, 40), COL.orange, 5);
  shine(c, [[640, 782], [685, 774]], 8);
};

export const ic_microorganismsGermsL4 = cards("sci.microorganisms.germs.L4", [
  s_e1_0, s_e1_2, s_e1_3, s_e2_0, a1_1, s_a2_0, s_a4_1, s_a5_1,
  f_e1, f_e2, f_a1, f_a2, f_a4, f_a5, f_a3, t_fever, t_antiseptic, t_dose,
]);
void BG; void glass; void D;
