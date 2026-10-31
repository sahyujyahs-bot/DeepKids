import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, rnd, bowl, cards } from "./flatKit";

// sci.gravity.weight-and-mass.L3 · set-up cards. Same forcemeter, rice bag, stone, tub, bottle and bucket on every card of an experiment.

const thick = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };
const RICE = "#f6f0df";

// a forcemeter hanging by its ring at (x, top - 22 s); the rod pulls out as the pointer goes down the scale. Returns where the hook ends.
type FM = { s?: number; max?: number; step?: number; lab?: number; ghost?: number };
const fm = (c: Ctx, x: number, top: number, val: number, o: FM = {}) => {
  const s = o.s ?? 1, max = o.max ?? 5, step = o.step ?? 40, lab = o.lab ?? 1;
  const H = 50 + max * step + 28, ext = val * step * 0.3, py = 50 + val * step;
  c.save(); c.translate(x, top); c.scale(s, s);
  c.beginPath(); ell(c, 0, -22, 16, 20); c.strokeStyle = INK; c.lineWidth = 14; c.stroke();
  c.beginPath(); ell(c, 0, -22, 16, 20); c.strokeStyle = COL.steel; c.lineWidth = 6; c.stroke();
  const rodEnd = H + 24 + ext;
  thick(c, [[0, H - 6], [0, rodEnd]], 8, COL.steelDk);
  c.beginPath(); ell(c, 0, rodEnd + 16, 13, 16); c.strokeStyle = INK; c.lineWidth = 12; c.stroke();
  c.beginPath(); ell(c, 0, rodEnd + 16, 13, 16); c.strokeStyle = COL.steel; c.lineWidth = 5; c.stroke();
  const body = () => rrect(c, -48, 0, 96, H, 16);
  shadow(c, 44, H + 6, 46, 10);
  shape(c, body, COL.paper);
  shade(c, body, "#cfc3a6", -22, 0, 0.6);
  shape(c, () => rrect(c, -48, 0, 96, 30, 14), COL.teal);
  shape(c, () => rrect(c, 8, 40, 28, max * step + 20, 9), "#3a3540", 4);
  for (let i = 0; i <= max; i++) {
    const y = 50 + i * step; line(c, [[-8, y], [2, y]], 4);
    if (i % lab === 0) write(c, String(i), -46, y - 12, 24, INK, 4);
  }
  if (o.ghost !== undefined) {
    const gy = 50 + o.ghost * step; c.setLineDash([10, 8]); line(c, [[0, gy], [90, gy]], 4, RED); c.setLineDash([]);
  }
  shape(c, () => rrect(c, 2, py - 8, 40, 16, 4), RED, 4);
  if (o.ghost !== undefined) line(c, [[40, py], [90, py]], 4, RED);
  c.restore();
  return { hx: x, hy: top + (rodEnd + 32) * s };
};

// a clear plastic bag; y = top of the body, the handles go up to the hook at (x, y - 60)
const bag = (c: Ctx, x: number, y: number, w: number, h: number, rice: boolean) => {
  const tw = 34;
  const bp = () => { c.moveTo(x - tw, y); c.lineTo(x + tw, y); c.bezierCurveTo(x + tw * 1.2, y + h * 0.3, x + w / 2, y + h * 0.4, x + w / 2, y + h * 0.7); c.bezierCurveTo(x + w / 2, y + h, x - w / 2, y + h, x - w / 2, y + h * 0.7); c.bezierCurveTo(x - w / 2, y + h * 0.4, x - tw * 1.2, y + h * 0.3, x - tw, y); c.closePath(); };
  line(c, [[x - tw * 0.8, y + 4], [x, y - 58]], 6); line(c, [[x + tw * 0.8, y + 4], [x, y - 58]], 6);
  shape(c, bp, rice ? RICE : "#e6f1f8", 0);
  if (rice) {
    c.save(); c.beginPath(); bp(); c.clip(); c.fillStyle = "#ffffff"; c.fillRect(x - w, y + h * 0.28, w * 2, h); c.restore();
    const r = rnd(5);
    for (let i = 0; i < 28; i++) { const gx = x + (r() - 0.5) * w * 0.8, gy = y + h * 0.4 + r() * h * 0.5; line(c, [[gx, gy], [gx + 12, gy + 4 * (r() - 0.5)]], 3, "#cdbf9a"); }
  }
  shade(c, bp, rice ? "#d9d0b8" : "#b9cfdc", -w * 0.2, 0, 0.5);
  shape(c, bp, "rgba(214,236,250,0.35)", 6);
  shine(c, [[x - w * 0.34, y + h * 0.5], [x - w * 0.36, y + h * 0.78]], 8);
  if (!rice) line(c, [[x - 20, y + h * 0.35], [x + 8, y + h * 0.6]], 3, "#8aa3b3");
};
// the scale reading
const door = (c: Ctx) => {
  ground(c, "#e6d7b8");
  const dp = () => rrect(c, 90, -40, 900, 1200, 10);
  shape(c, dp, COL.wood, 8); shade(c, dp, COL.woodDk, -70, 0, 0.5);
  shape(c, () => rrect(c, 160, 40, 760, 440, 10), "#e5ae4e", 4);
  shape(c, () => rrect(c, 160, 560, 760, 440, 10), "#e5ae4e", 4);
  shape(c, () => ell(c, 860, LEVERY, 44, 44), COL.steel, 6);
  thick(c, [[860, LEVERY], [520, LEVERY]], 28, COL.steel);
  shape(c, () => ell(c, 520, LEVERY, 15, 15), COL.steel, 5);
};
const FMX = 620, FMTOP = 229, LEVERY = 200, FS1: FM = { s: 1.3 };

// ---------------------------------------------------------------- experiment 1: how hard does a kilogram pull
// setup.e1.0
const e1_0 = (c: Ctx) => {
  door(c);
  const k = fm(c, FMX, FMTOP, 0, FS1);
  bag(c, k.hx, k.hy + 58, 150, 250, false);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 980, 470, 40);
  shape(c, () => polyP(c, [[200, 700], [880, 700], [960, 860], [120, 860]]), COL.teal);
  shape(c, () => polyP(c, [[120, 860], [960, 860], [960, 950], [120, 950]]), COL.tealDk);
  shape(c, () => rrect(c, 380, 872, 300, 66, 8), "#22303a", 5);
  write(c, "100 g", 408, 884, 40, "#c9f06b", 7);
  // the bag of rice standing on the scale
  const x = 560, base = 800, w = 290, h = 270;
  shadow(c, x + 40, base + 4, 170, 30);
  const bp = () => { c.moveTo(x - w * 0.46, base - h); c.lineTo(x + w * 0.46, base - h); c.lineTo(x + w / 2, base - 20); c.quadraticCurveTo(x + w / 2, base, x + w / 2 - 22, base); c.lineTo(x - w / 2 + 22, base); c.quadraticCurveTo(x - w / 2, base, x - w / 2, base - 20); c.closePath(); };
  shape(c, bp, RICE, 6); shade(c, bp, "#cfc6aa", -50, 0, 0.55);
  shape(c, () => ell(c, x, base - h, w * 0.46, 34), "#ffffff", 6);
  shape(c, () => { c.moveTo(x - w * 0.4, base - h); c.quadraticCurveTo(x, base - h - 110, x + w * 0.4, base - h); c.closePath(); }, "#ffffff", 5);
  shape(c, bp, "rgba(214,236,250,0.3)", 0);
  // the rice falling out of the katori, which the child's hand tips
  line(c, [[624, 372], [596, 470]], 24, INK); line(c, [[624, 372], [596, 470]], 14, "#ffffff");
  for (let i = 0; i < 8; i++) { const r = rnd(3 + i); shape(c, () => ell(c, 640 - i * 6 + r() * 16, 400 + i * 12, 9, 5, r() * 3), "#ffffff", 3); }
  c.save(); c.translate(700, 270); c.rotate(-0.9);
  bowl(c, 0, 0, 125, RICE);
  c.restore();
  hand(c, 850, 285, Math.PI, 1.3, SKIN.child, CLOTH.child);
  arrow(c, [[520, 150], [450, 230], [470, 330]], RED, 12);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  door(c);
  const k = fm(c, FMX + 40, FMTOP, 1, FS1);
  bag(c, k.hx, k.hy + 58, 230, 250, true);
  person(c, 230, 965, 720);
  c.setLineDash([14, 12]); line(c, [[300, 347], [FMX + 40 + 6, 347]], 5, RED); c.setLineDash([]);
};

// ---------------------------------------------------------------- experiment 2: the stone in water
const stone = (c: Ctx, x: number, y: number, r: number) => {
  const pts = [[-1, -0.2], [-0.7, -0.75], [-0.1, -0.95], [0.6, -0.8], [1, -0.1], [0.8, 0.6], [0.1, 0.9], [-0.7, 0.75]];
  const p = () => { const q = pts.map(([a, b]) => [x + a * r, y + b * r]); const m = (i: number) => [(q[i][0] + q[(i + 1) % q.length][0]) / 2, (q[i][1] + q[(i + 1) % q.length][1]) / 2]; c.moveTo(m(7)[0], m(7)[1]); for (let i = 0; i < q.length; i++) c.quadraticCurveTo(q[i][0], q[i][1], m(i)[0], m(i)[1]); c.closePath(); };
  shape(c, p, COL.grey, 6); shade(c, p, COL.greyDk, -r * 0.4, -r * 0.1, 0.55);
  line(c, [[x - r * 0.2, y - r * 0.5], [x + r * 0.1, y - r * 0.1], [x - r * 0.1, y + r * 0.2]], 3, COL.greyDk);
  shine(c, [[x - r * 0.6, y - r * 0.3], [x - r * 0.35, y - r * 0.6]], 7);
};
// a clear tub of water; inner() draws what is inside it
const TUBX = 540, TUBRIM = 740, TUBH = 250, TUBW = 270, TUBB = 220, WATERY = 780;
const tub = (c: Ctx, inner: () => void) => {
  const bot = TUBRIM + TUBH, ry = 38, ww = TUBW - (TUBW - TUBB) * ((WATERY - TUBRIM) / TUBH), wry = ry * ww / TUBW;
  shadow(c, TUBX + 40, bot + 18, TUBW * 0.9, 26);
  const body = () => { c.moveTo(TUBX - TUBW, TUBRIM); c.lineTo(TUBX + TUBW, TUBRIM); c.lineTo(TUBX + TUBB, bot); c.quadraticCurveTo(TUBX, bot + 36, TUBX - TUBB, bot); c.closePath(); };
  shape(c, () => ell(c, TUBX, TUBRIM, TUBW, ry), "#d9e6ee", 5);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(TUBX - TUBW, WATERY, TUBW * 2, 400); c.restore();
  shape(c, () => ell(c, TUBX, WATERY, ww, wry), COL.drop, 4);
  inner();
  c.save(); c.beginPath(); body(); c.clip(); c.globalAlpha = 0.45; c.fillStyle = COL.water; c.fillRect(TUBX - TUBW, WATERY + wry * 0.2, TUBW * 2, 400); c.restore(); c.globalAlpha = 1;
  shape(c, body, "rgba(214,236,250,0.18)", 6);
  c.beginPath(); c.ellipse(TUBX, WATERY, ww, wry, 0, 0, Math.PI); c.strokeStyle = COL.waterDk; c.lineWidth = 5; c.stroke();
  c.beginPath(); c.ellipse(TUBX, TUBRIM, TUBW, ry, 0, 0, Math.PI); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
  shine(c, [[TUBX - TUBW + 36, TUBRIM + 30], [TUBX - TUBB + 30, bot - 20]], 9);
};
const STR = 150, SR = 50, SMP: FM = { s: 1, max: 5, step: 30, lab: 1 };
// the child's hand holding the forcemeter by its ring, with the stone at the end of the string
const holdFm = (c: Ctx, stoneY: number, val: number, slack = 0) => {
  const hy = stoneY - SR - STR + slack;
  const top = hy - (50 + SMP.max! * SMP.step! + 28 + val * SMP.step! * 0.3 + 56) * SMP.s!;
  const hold = () => { fm(c, TUBX, top, val, SMP); hand(c, TUBX, top - 88, Math.PI / 2, 1, SKIN.child, CLOTH.child); };
  const string = () => {
    if (slack > 0) { c.beginPath(); c.moveTo(TUBX, hy); c.bezierCurveTo(TUBX + 90, hy + 30, TUBX - 90, stoneY - SR - 30, TUBX, stoneY - SR); c.strokeStyle = "#8a6f4a"; c.lineWidth = 5; c.stroke(); }
    else thick(c, [[TUBX, hy], [TUBX, stoneY - SR]], 4, "#8a6f4a");
    stone(c, TUBX, stoneY, SR);
  };
  return { hold, string };
};
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  const h = holdFm(c, 690, 3);
  tub(c, () => {});
  h.string();
  h.hold();
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  const h = holdFm(c, 885, 2);
  tub(c, () => h.string());
  h.hold();
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  const h = holdFm(c, 935, 0.3, 40);
  tub(c, () => { shadow(c, TUBX + 14, 982, 66, 12); h.string(); });
  h.hold();
};

// ---------------------------------------------------------------- experiment 3: the lift
const BOTTLEW = 100;
// a plastic bottle standing with its bottom centre at (x, yb)
const pbottle = (c: Ctx, x: number, yb: number, w: number, h: number, fill: number, holes: number[] = []) => {
  const capH = h * 0.07, nw = w * 0.2, top = yb - h, shy = yb - h * 0.7;
  const bp = () => { c.moveTo(x - nw, top + capH); c.lineTo(x - nw, top + capH + h * 0.08); c.bezierCurveTo(x - nw, shy - h * 0.08, x - w / 2, shy - h * 0.06, x - w / 2, shy + h * 0.04); c.lineTo(x - w / 2, yb - w * 0.16); c.quadraticCurveTo(x - w / 2, yb, x - w / 2 + w * 0.16, yb); c.lineTo(x + w / 2 - w * 0.16, yb); c.quadraticCurveTo(x + w / 2, yb, x + w / 2, yb - w * 0.16); c.lineTo(x + w / 2, shy + h * 0.04); c.bezierCurveTo(x + w / 2, shy - h * 0.06, x + nw, shy - h * 0.08, x + nw, top + capH + h * 0.08); c.lineTo(x + nw, top + capH); c.closePath(); };
  shadow(c, x + w * 0.15, yb + 6, w * 0.6, w * 0.1);
  shape(c, bp, "rgba(225,240,250,0.55)", 0);
  if (fill > 0) { const wy = yb - (h * 0.8) * fill; c.save(); c.beginPath(); bp(); c.clip(); c.fillStyle = COL.water; c.fillRect(x - w, wy, w * 2, h); c.fillStyle = COL.drop; c.fillRect(x - w, wy, w * 2, 8); c.restore(); shade(c, bp, COL.waterDk, -w * 0.16, 0, 0.0); }
  shade(c, bp, "#9fc0da", -w * 0.16, 0, 0.35);
  shape(c, bp, "rgba(0,0,0,0)", 6);
  for (const g of [0.55, 0.6]) line(c, [[x - w / 2 + 4, yb - h * g], [x + w / 2 - 4, yb - h * g]], 3, COL.glassEdge);
  shape(c, () => rrect(c, x - nw - 4, top, nw * 2 + 8, capH, 5), COL.blue, 5);
  shine(c, [[x - w * 0.32, yb - h * 0.5], [x - w * 0.32, yb - h * 0.12]], Math.max(5, w * 0.07));
  holes.forEach((hy) => shape(c, () => ell(c, x - w / 2 + 2, hy, 8, 11), INK, 0));
};
// the bottle hanging from a hook point, on a short string loop round its neck
const hangBottle = (c: Ctx, hx: number, hy: number, w: number, h: number) => {
  const top = hy + 34;
  line(c, [[hx, hy], [hx - w * 0.2, top + h * 0.08]], 4); line(c, [[hx, hy], [hx + w * 0.2, top + h * 0.08]], 4);
  pbottle(c, hx, top + h, w, h, 0.85);
};
const liftRoom = (c: Ctx) => {
  ground(c, "#cfd6de");
  c.fillStyle = "#b6bfca"; c.fillRect(0, 960, 1080, 120);
  line(c, [[0, 960], [1080, 960]], 6);
  shape(c, () => rrect(c, 130, 160, 800, 800, 6), COL.steelIn, 6);
  line(c, [[530, 160], [530, 960]], 6);
  shape(c, () => rrect(c, 330, 40, 400, 90, 10), "#22303a", 5);
  write(c, "4", 500, 54, 62, "#c9f06b", 8);
  shape(c, () => rrect(c, 940, 300, 110, 300, 12), COL.steelDk, 5);
  for (let i = 0; i < 4; i++) shape(c, () => ell(c, 995, 350 + i * 65, 22, 22), i === 1 ? COL.yellow : COL.steel, 5);
  thick(c, [[130, 640], [930, 640]], 14, COL.steel);
};
const wristOf = (x: number, y: number, h: number, a: [number, number]) => {
  const sx = x + h * 0.11, sy = y - h * 0.74 + h * 0.03, ex = sx + Math.cos(a[0]) * h * 0.17, ey = sy + Math.sin(a[0]) * h * 0.17;
  return [ex + Math.cos(a[1]) * h * 0.16, ey + Math.sin(a[1]) * h * 0.16];
};
const LF: FM = { s: 0.62, max: 12, step: 22, lab: 2 };
// a close-up of a hand holding the forcemeter with the bottle: pointer at val
const liftHold = (c: Ctx, x: number, top: number, val: number, s: number, o: FM = {}) => {
  const FS: FM = { s, max: 12, step: 24, lab: 2, ...o };
  const k = fm(c, x, top, val, FS);
  hand(c, x, top - 100 * s, Math.PI / 2, s, SKIN.child, CLOTH.child);
  hangBottle(c, k.hx, k.hy, 100 * s, 150 * s);
};
// a lift floor display: a number, and up arrows when the lift is going up
const floorSign = (c: Ctx, x: number, y: number, w: number, n: string, ups: number) => {
  shape(c, () => rrect(c, x, y, w, w * 0.6, 14), "#22303a", 6);
  write(c, n, x + w * 0.22, y + w * 0.1, w * 0.4, "#c9f06b", 10);
  for (let i = 0; i < ups; i++) shape(c, () => polyP(c, [[x + w * 0.66, y + w * 0.5 - i * w * 0.24], [x + w * 0.9, y + w * 0.5 - i * w * 0.24], [x + w * 0.78, y + w * 0.3 - i * w * 0.24]]), RED, 4);
};
// setup.e3.0
const e3_0 = (c: Ctx) => {
  liftRoom(c);
  liftHold(c, 330, 255, 6, 0.95);
};
// setup.e3.1: at rest on the left, the lift speeding up on the right: the pointer is lower
const e3_1 = (c: Ctx) => {
  ground(c, "#cfd6de");
  liftHold(c, 270, 190, 6, 0.9);
  liftHold(c, 770, 190, 11, 0.9);
  floorSign(c, 170, 860, 200, "4", 0);
  floorSign(c, 670, 860, 200, "5", 2);
  line(c, [[540, 150], [540, 1000]], 5, COL.grey);
  arrow(c, [[920, 600], [920, 740]], RED, 12);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  const s = 1.1, FS: FM = { s, max: 12, step: 28, lab: 2, ghost: 6 };
  const k = fm(c, 480, 201, 11, FS);
  hand(c, 480, 100, Math.PI / 2, s, SKIN.child, CLOTH.child);
  hangBottle(c, k.hx, k.hy, 90, 140);
  arrow(c, [[860, 760], [860, 330]], RED, 14);
  for (const [dx, a, b] of [[-190, 520, 760], [-130, 600, 820], [210, 540, 780], [150, 620, 840]]) line(c, [[480 + dx, a], [480 + dx, b]], 7, COL.grey);
};

// ---------------------------------------------------------------- experiment 4: drop it
const GROUND = 950;
const outside = (c: Ctx) => {
  ground(c, "#dff0f8");
  c.fillStyle = COL.green; c.fillRect(0, GROUND, 1080, 140);
  line(c, [[0, GROUND], [1080, GROUND]], 6);
  const r = rnd(9);
  for (let i = 0; i < 14; i++) { const x = r() * 1080, y = GROUND + 20 + r() * 100; line(c, [[x, y], [x - 6, y - 18]], 5, COL.greenDk); line(c, [[x, y], [x + 8, y - 16]], 5, COL.greenDk); }
};
// a plastic bucket on the ground, centre x, rim centre y
const bucket = (c: Ctx, x: number) => {
  const rim = 800, w = 160, bw = 125, bot = GROUND - 6;
  shadow(c, x + 30, GROUND + 14, 180, 22);
  const bp = () => { c.moveTo(x - w, rim); c.lineTo(x + w, rim); c.lineTo(x + bw, bot); c.lineTo(x - bw, bot); c.closePath(); };
  shape(c, () => ell(c, x, rim, w, 30), "#2f5f9e", 6);
  shape(c, bp, COL.blue); shade(c, bp, COL.blueDk, -55, 0, 0.6);
  shape(c, () => ell(c, x, rim, w, 30), COL.waterDk, 6);
  shape(c, () => ell(c, x, rim + 2, w - 26, 20), COL.water, 0);
  c.beginPath(); c.ellipse(x, rim, w, 30, 0, 0, Math.PI); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
  line(c, [[x - w + 10, rim + 70], [x + w - 12, rim + 70]], 4, COL.blueDk);
};
const BW = 230, BH = 560;
// setup.e4.0
const e4_0 = (c: Ctx) => {
  outside(c);
  bucket(c, 300);
  const bx = 700, yb = 720, hx = bx - BW / 2 + 2, holes = [yb - 190, yb - 90];
  const jet = (hy: number, dx: number) => {
    const pts: number[][] = []; for (let i = 0; i <= 24; i++) { const t = i / 24; pts.push([hx - dx * t, hy + (812 - hy) * t * t]); }
    line(c, pts, 18, INK); line(c, pts, 9, COL.water);
  };
  jet(holes[0], 230); jet(holes[1], 330);
  pbottle(c, bx, yb, BW, BH, 0.8, holes);
  hand(c, 870, 380, Math.PI, 1.5, SKIN.adult, CLOTH.adult);
};
// setup.e4.1
const e4_1 = (c: Ctx) => {
  outside(c);
  bucket(c, 540);
  const bx = 540, yb = 700;
  for (const dx of [-70, 0, 70]) line(c, [[bx + dx, 20], [bx + dx, 90]], 7, COL.grey);
  pbottle(c, bx, yb, BW, BH, 0.8, [yb - 190, yb - 90]);
  arrow(c, [[860, 220], [860, 560]], RED, 14);
};
// a pillow
const pillow = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const p = () => { c.moveTo(x - w / 2, y - h / 2); c.quadraticCurveTo(x, y - h / 2 + h * 0.14, x + w / 2, y - h / 2); c.quadraticCurveTo(x + w / 2 - h * 0.12, y, x + w / 2, y + h / 2); c.quadraticCurveTo(x, y + h / 2 - h * 0.14, x - w / 2, y + h / 2); c.quadraticCurveTo(x - w / 2 + h * 0.12, y, x - w / 2, y - h / 2); c.closePath(); };
  shadow(c, x + 30, y + h / 2 + 8, w * 0.55, 20);
  shape(c, p, COL.pink, 7); shade(c, p, "#d97597", -w * 0.2, 0, 0.55);
  shape(c, () => ell(c, x, y, 12, 9), "#d97597", 4);
  line(c, [[x - w * 0.32, y - 6], [x - 18, y]], 4, "#d97597"); line(c, [[x + w * 0.32, y - 6], [x + 18, y]], 4, "#d97597");
};
// the rubber band holding a stack of taped coins, hanging inside a bottle from its cap at (x, topY).
// len = how far the coins hang below the cap: long = the band is stretched thin, short = it is slack
const bandCoins = (c: Ctx, x: number, topY: number, len: number) => {
  const rx = len > 150 ? 24 : 52;
  c.beginPath(); ell(c, x, topY + len / 2, rx, len / 2); c.strokeStyle = INK; c.lineWidth = 26; c.stroke();
  c.beginPath(); ell(c, x, topY + len / 2, rx, len / 2); c.strokeStyle = COL.orange; c.lineWidth = 14; c.stroke();
  const y0 = topY + len - 6;
  for (let i = 0; i < 5; i++) { const y = y0 + 6 + i * 20; shape(c, () => rrect(c, x - 50, y, 100, 24, 12), COL.steel, 5); line(c, [[x - 28, y + 12], [x + 28, y + 12]], 3, COL.steelDk); }
  shape(c, () => rrect(c, x - 54, y0 + 40, 108, 34, 6), "#ffe27a", 5);
  shape(c, () => ell(c, x, y0 + 6, 50, 12), COL.steelIn, 5);
};
// setup.e4.2
const e4_2 = (c: Ctx) => {
  outside(c);
  const W = 240, Hh = 600;
  // held: the grown-up's hand at the cap
  const x1 = 280, yb1 = 800, capTop1 = yb1 - Hh;
  pbottle(c, x1, yb1, W, Hh, 0);
  bandCoins(c, x1, capTop1 + Hh * 0.07 + 6, 280);
  hand(c, x1, capTop1 - 56, Math.PI / 2, 1.3, SKIN.adult, CLOTH.adult);
  // falling onto the pillow
  const x2 = 760, yb2 = 690, capTop2 = yb2 - Hh;
  pillow(c, 760, 905, 360, 110);
  pbottle(c, x2, yb2, W, Hh, 0);
  bandCoins(c, x2, capTop2 + Hh * 0.07 + 6, 90);
  for (const dx of [-170, 170]) line(c, [[x2 + dx, 130], [x2 + dx, 230]], 7, COL.grey);
  arrow(c, [[990, 160], [990, 520]], RED, 14);
};

export const su_gravityWeightAndMass = cards("sci.gravity.weight-and-mass.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2, e4_0, e4_1, e4_2]);
