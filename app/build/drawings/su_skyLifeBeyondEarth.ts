import type { Ctx } from "./core";
import { INK, WHITE, rnd, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, hand, write, cards } from "./flatKit";

// sci.sky.life-beyond-earth.L3 · salt water freezing: katoris, freezer, cup, ice. Same katori and same cup on every card.
const ICE = "#eaf6fd", ICEDK = "#bcd9ea", SALTW = "#c3def2", SEAW = "#4f86c6";

// a heap of salt sitting in a katori: base centre (x, y), half-width w, height h
const heap = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const p = () => { c.moveTo(x - w, y); c.quadraticCurveTo(x - w * 0.5, y - h * 1.1, x, y - h); c.quadraticCurveTo(x + w * 0.5, y - h * 1.1, x + w, y); c.quadraticCurveTo(x, y + h * 0.25, x - w, y); c.closePath(); };
  shape(c, p, WHITE, 5); shade(c, p, COL.steelDk, w * 0.35, 0, 0.35);
  for (let i = 0; i < 7; i++) { const gx = x - w * 0.6 + ((i * 37) % 10) * w * 0.12, gy = y - h * 0.15 - ((i * 53) % 7) * h * 0.1; c.beginPath(); c.arc(gx, gy, 3.5, 0, 7); c.fillStyle = COL.steelDk; c.fill(); }
};
// a steel teaspoon lying flat: bowl end at (x, y), handle going right
const spoon = (c: Ctx, x: number, y: number, len: number, an = 0) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shadow(c, len * 0.5 + 8, 26, len * 0.55, 9);
  line(c, [[40, 0], [len, 0]], 20, INK); line(c, [[40, 0], [len, 0]], 10, COL.steel);
  shape(c, () => ell(c, 0, 0, 52, 34), COL.steel, 6); shape(c, () => ell(c, -4, -3, 38, 22), COL.steelIn, 3);
  c.restore();
};
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  const xs = [190, 540, 890], ns = ["0", "1", "6"], hs = [0, 40, 120], ws = [0, 55, 105];
  xs.forEach((x, i) => { bowl(c, x, 400, 140, COL.water); if (i) heap(c, x, 404, ws[i], hs[i]); write(c, ns[i], x - 28, 600, 120, INK, 14); });
  spoon(c, 250, 905, 260, 0.05);
  bowl(c, 780, 860, 120, COL.steelIn); heap(c, 780, 866, 95, 90);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 70, 90, 940, 840, 30), "#dff1fb", 8);
  shade(c, () => rrect(c, 70, 90, 940, 840, 30), COL.sky, 40, 0, 0.35);
  shape(c, () => rrect(c, 40, 700, 1000, 50, 12), COL.steel, 8);
  shadow(c, 540, 770, 480, 14);
  [[160, 190], [900, 160], [120, 520], [960, 330]].forEach(([x, y]) => { line(c, [[x - 28, y], [x + 28, y]], 6, COL.blue); line(c, [[x, y - 28], [x, y + 28]], 6, COL.blue); line(c, [[x - 20, y - 20], [x + 20, y + 20]], 5, COL.blue); line(c, [[x - 20, y + 20], [x + 20, y - 20]], 5, COL.blue); });
  [200, 450, 700].forEach((x, i) => { bowl(c, x, 628, 105, COL.water); write(c, ["0", "1", "6"][i], x - 22, 330, 100, INK, 12); });
  shape(c, () => rrect(c, 790, 440, 180, 260, 14), COL.green, 7); shade(c, () => rrect(c, 790, 440, 180, 260, 14), COL.greenDk, 30, 0, 0.5);
  shape(c, () => rrect(c, 790, 420, 180, 36, 8), COL.greenLt, 6);
  [[850, 540], [900, 540], [875, 585], [925, 590], [830, 595]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 21, 21), COL.greenLt, 4));
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  const R = 115;
  // katori 0: frozen solid, a white ice dome standing up over the rim, cracked
  bowl(c, 150, 540, R, ICE);
  const dome = () => { c.moveTo(45, 540); c.bezierCurveTo(50, 400, 250, 400, 255, 540); c.bezierCurveTo(200, 570, 100, 570, 45, 540); c.closePath(); };
  shape(c, dome, WHITE, 6); shade(c, dome, ICEDK, 45, 0, 0.8);
  line(c, [[110, 440], [140, 480], [125, 520]], 5, COL.blue); line(c, [[190, 450], [170, 495]], 5, COL.blue);
  shine(c, [[80, 500], [100, 450], [135, 425]], 10);
  // katori 1: soft, ice chunks floating in water (slush)
  bowl(c, 450, 540, R, COL.waterDk);
  [[395, 538, 36, 18, -0.2], [455, 548, 32, 15, 0.3], [505, 536, 30, 14, 0.1], [425, 520, 22, 11, 0.4], [480, 524, 20, 10, -0.3]].forEach(([x, y, rx, ry, r]) => shape(c, () => ell(c, x, y, rx, ry, r), WHITE, 5));
  write(c, "0", 125, 200, 110, INK, 13); write(c, "1", 425, 200, 110, INK, 13); write(c, "6", 745, 120, 110, INK, 13);
  // katori 6: tilted by a hand, clear water streams out of the low lip into a puddle
  const L = [905, 545];
  shape(c, () => { c.moveTo(L[0] - 12, L[1] - 6); c.bezierCurveTo(L[0] + 60, L[1] - 6, L[0] + 90, L[1] + 150, L[0] + 85, 860); c.lineTo(L[0] + 62, 860); c.bezierCurveTo(L[0] + 62, L[1] + 150, L[0] + 20, L[1] + 40, L[0] - 24, L[1] + 24); c.closePath(); }, COL.water, 5);
  [[L[0] + 108, 700, 13], [L[0] + 100, 780, 11]].forEach(([x, y, r]) => shape(c, () => { c.moveTo(x, y - r * 1.8); c.quadraticCurveTo(x + r, y - r * 0.2, x, y + r); c.quadraticCurveTo(x - r, y - r * 0.2, x, y - r * 1.8); c.closePath(); }, COL.water, 4));
  c.save(); c.translate(800, 470); c.rotate(0.5); bowl(c, 0, 0, R, COL.water); c.restore();
  shape(c, () => ell(c, 985, 885, 70, 20), COL.water, 5); shine(c, [[945, 883], [985, 877]], 7);
  hand(c, 820, 650, -2.0, 1.7);
  arrow(c, [[875, 290], [950, 320], [985, 395]]);
};

// a tall cup of water, the same size and place on cards 3 and 4: pale salty water, or an ice layer over dark water
const CX = 540, CY = 880, CW = 360, CH = 500, TOP = CW / 2, BOT = CW * 0.4;
const cup = (c: Ctx, iced: boolean) => {
  const hw = (g: number) => BOT + (TOP - BOT) * g, yAt = (g: number) => CY - CH * g;
  const slab = (g0: number, g1: number) => () => { c.moveTo(CX - hw(g1), yAt(g1)); c.lineTo(CX + hw(g1), yAt(g1)); c.lineTo(CX + hw(g0), yAt(g0)); c.lineTo(CX - hw(g0), yAt(g0)); c.closePath(); };
  shadow(c, CX + 40, CY + 6, CW * 0.6, 40);
  if (!iced) { shape(c, slab(0, 0.75), SALTW, 0); shape(c, () => ell(c, CX, yAt(0.75), hw(0.75), 26), "#dcedf9", 0); [[470, 640], [560, 700], [620, 600], [510, 780], [600, 800], [450, 730]].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 5, 0, 7); c.fillStyle = WHITE; c.fill(); }); }
  shape(c, () => { c.moveTo(CX - TOP, yAt(1)); c.lineTo(CX + TOP, yAt(1)); c.lineTo(CX + BOT, CY); c.lineTo(CX - BOT, CY); c.closePath(); }, COL.glass, 6);
  if (iced) {
  shape(c, slab(0, 0.52), SEAW, 0); shade(c, slab(0, 0.52), COL.blueDk, 40, 0, 0.5);
  // the ice layer: a thick white slab with a jagged underside poking down into the dark water
  const yt = yAt(0.86), yb = yAt(0.52), xl = CX - hw(0.86), xr = CX + hw(0.86);
  const slabIce = () => { c.moveTo(xl, yt); c.lineTo(xr, yt); c.lineTo(CX + hw(0.52), yb); [[1, 60], [2, 20], [3, 75], [4, 35], [5, 55]].forEach(([k, d]) => c.lineTo(CX + hw(0.52) - k * ((2 * hw(0.52)) / 6), yb + d)); c.lineTo(CX - hw(0.52), yb); c.closePath(); };
  shape(c, slabIce, "#e4f6fd", 6); shade(c, slabIce, ICEDK, 60, 0, 0.8);
  shape(c, () => ell(c, CX, yt, hw(0.86), 26), WHITE, 6);
  line(c, [[450, yt - 6], [510, yt + 10], [490, yt + 20], [560, yt + 20]], 5, COL.blue); line(c, [[610, yt - 4], [650, yt + 12]], 5, COL.blue);
  line(c, [[440, yt + 60], [490, yt + 120], [470, yt + 180]], 6, COL.blue); line(c, [[610, yt + 50], [640, yt + 110]], 6, COL.blue);
  shine(c, [[400, yt + 40], [410, yt + 150]], 10);
  [[520, yt + 120], [570, yt + 170]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 8, 8), ICE, 3));
    line(c, [[CX - TOP, yAt(1)], [CX - BOT, CY], [CX + BOT, CY], [CX + TOP, yAt(1)]], 6);
  }
  shape(c, () => ell(c, CX, yAt(1), TOP, 28), "rgba(255,255,255,0.35)", 6);
  shine(c, [[CX - TOP * 0.7, yAt(0.9)], [CX - BOT * 0.75, yAt(0.15)]], 9);
};
const flake = (c: Ctx, x: number, y: number, r: number) => [0, 1, 2].forEach((k) => { const a = (k * Math.PI) / 3; line(c, [[x - Math.cos(a) * r, y - Math.sin(a) * r], [x + Math.cos(a) * r, y + Math.sin(a) * r]], 6, COL.blue); });

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  // jar of salt
  shadow(c, 190, 885, 120, 22);
  shape(c, () => rrect(c, 70, 640, 230, 240, 26), COL.glass, 6);
  shape(c, () => rrect(c, 78, 700, 214, 172, 20), WHITE, 0);
  for (let i = 0; i < 18; i++) { c.beginPath(); c.arc(100 + ((i * 47) % 170), 720 + ((i * 31) % 130), 4, 0, 7); c.fillStyle = COL.steelDk; c.fill(); }
  shape(c, () => rrect(c, 70, 640, 230, 240, 26), "rgba(214,236,250,0.35)", 6);
  shape(c, () => rrect(c, 90, 590, 190, 58, 12), COL.steel, 6);
  shine(c, [[100, 720], [100, 840]], 8);
  // the cup, a spoon stirring it, a stir arrow
  const sp = () => { line(c, [[470, 760], [790, 330]], 22, INK); line(c, [[470, 760], [790, 330]], 11, COL.steel); shape(c, () => ell(c, 462, 772, 36, 24, -0.9), COL.steel, 6); };
  cup(c, false); sp();
  arrow(c, [[330, 330], [400, 270], [500, 270]]);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  cup(c, true);
  flake(c, 170, 360, 40); flake(c, 910, 280, 44); flake(c, 880, 700, 36); flake(c, 150, 740, 34);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  // the child, big: shoulders, head, open mouth
  shape(c, () => rrect(c, 60, 700, 520, 340, 90), CLOTH.child); shade(c, () => rrect(c, 60, 700, 520, 340, 90), CLOTH.childDk, 60, 0);
  shape(c, () => rrect(c, 250, 600, 110, 140, 30), SKIN.child);
  shape(c, () => ell(c, 320, 430, 190, 200), SKIN.child); shade(c, () => ell(c, 320, 430, 190, 200), SKIN.childDk, 40, 10, 0.5);
  shape(c, () => ell(c, 130, 450, 30, 50), SKIN.child);
  shape(c, () => { c.moveTo(130, 420); c.bezierCurveTo(120, 190, 520, 190, 508, 420); c.quadraticCurveTo(450, 300, 320, 330); c.quadraticCurveTo(200, 300, 130, 420); c.closePath(); }, CLOTH.hair, 6);
  shape(c, () => ell(c, 470, 300, 40, 60), CLOTH.hair, 5);
  [[240, 410], [380, 410]].forEach(([x, y]) => { shape(c, () => ell(c, x, y, 20, 26), WHITE, 4); shape(c, () => ell(c, x + 8, y + 2, 12, 16), INK, 0); });
  shape(c, () => ell(c, 440, 520, 42, 34), "#7a2f2f", 6);
  shape(c, () => ell(c, 436, 534, 22, 14), COL.pink, 0);
  // the spoon with a big piece of ice, held by her hand, right at her mouth
  line(c, [[590, 565], [900, 700]], 22, INK); line(c, [[590, 565], [900, 700]], 11, COL.steel);
  shape(c, () => ell(c, 555, 550, 62, 36, 0.35), COL.steel, 6);
  const S = 58, X = 555, Y = 502;
  shape(c, () => polyP(c, [[X - S, Y - S * 0.4], [X, Y - S * 0.9], [X + S, Y - S * 0.4], [X, Y + S * 0.1]]), WHITE, 5);
  shape(c, () => polyP(c, [[X - S, Y - S * 0.4], [X, Y + S * 0.1], [X, Y + S * 1.1], [X - S, Y + S * 0.6]]), "#d4ecf8", 5);
  shape(c, () => polyP(c, [[X, Y + S * 0.1], [X + S, Y - S * 0.4], [X + S, Y + S * 0.6], [X, Y + S * 1.1]]), "#a9cfe6", 5);
  line(c, [[X - S * 0.6, Y - S * 0.1], [X - S * 0.6, Y + S * 0.35]], 6, WHITE);
  line(c, [[X + 20, Y + S * 1.15], [X + 18, Y + S * 1.5]], 6, COL.water);
  hand(c, 926, 715, -2.77, 1.7);
  // the katori of dark leftover water
  bowl(c, 780, 925, 130, SEAW);
};

export const su_skyLifeBeyondEarth = cards("sci.sky.life-beyond-earth.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2]);
