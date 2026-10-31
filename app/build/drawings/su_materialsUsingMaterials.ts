import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, BG, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, line, shine, arrow, hand, write, cards } from "./flatKit";

// sci.materials.using-materials.L3 · set-up cards. Same spoons, mug, ice, saucers, sock, clay pot and bottles on every card of an experiment.

// ---------------------------------------------------------------- shared things
const TERRA = "#c9744a", TERRA_DK = "#9c4f2e", BUTTER = "#ffe58a", FOIL = "#dfe4ea", FOIL_DK = "#aeb6c2", WOOL = "#e4523b", WOOL_DK = "#b73a28";
type Fn = (c: Ctx) => void;
// run a drawer that works from (0, 0) at a place and size
const at = (c: Ctx, x: number, y: number, s: number, fn: Fn) => { c.save(); c.translate(x, y); c.scale(s, s); fn(c); c.restore(); };
// a darker band clipped inside a shape: the shade side
const side = (c: Ctx, path: () => void, x: number, y: number, w: number, h: number, col: string, a = 0.5) => { c.save(); c.beginPath(); path(); c.clip(); c.globalAlpha = a; c.fillStyle = col; c.fillRect(x, y, w, h); c.restore(); c.globalAlpha = 1; };
const pea = (c: Ctx, x: number, y: number, r = 17) => { shape(c, () => ell(c, x, y, r, r), COL.green, 4); shape(c, () => ell(c, x - r * 0.3, y - r * 0.3, r * 0.3, r * 0.3), COL.greenLt, 0); };
const butter = (c: Ctx, x: number, y: number, rx = 34, ry = 23, rot = 0) => shape(c, () => ell(c, x, y, rx, ry, rot), BUTTER, 4);

type SpoonKind = "steel" | "plastic" | "wood";
const SPOON: Record<SpoonKind, string[]> = { steel: [COL.steel, COL.steelDk, COL.steelIn], plastic: [COL.blue, COL.blueDk, COL.sky], wood: [COL.wood, COL.woodDk, "#f8dc9a"] };
// a spoon from its handle end (x, y), pointing along ang; handle length L, bowl beyond it; t = thickness
const spoon = (c: Ctx, x: number, y: number, ang: number, L: number, kind: SpoonKind, t = 1) => {
  const [f, dk, inn] = SPOON[kind], hw = 12 * t;
  c.save(); c.translate(x, y); c.rotate(ang);
  const hp = () => { c.moveTo(0, -hw * 0.7); c.lineTo(L - 20, -hw * 1.1); c.lineTo(L - 20, hw * 1.1); c.lineTo(0, hw * 0.7); c.closePath(); };
  shape(c, hp, f, 6); side(c, hp, 0, hw * 0.15, L, hw * 2, dk, 0.55);
  const bp = () => ell(c, L + 30 * t, 0, 58 * t, 41 * t);
  shape(c, bp, f, 6); side(c, bp, L - 30 * t, 8 * t, 140 * t, 60 * t, dk, 0.55);
  shape(c, () => ell(c, L + 28 * t, -4 * t, 40 * t, 26 * t), inn, 4);
  c.restore();
};
const alongX = (x: number, ang: number, d: number) => x + Math.cos(ang) * d;
const alongY = (y: number, ang: number, d: number) => y + Math.sin(ang) * d;

// a steel mug seen from a little above: rim centre at (cx, rimY)
const mug = (c: Ctx, cx: number, rimY: number) => {
  const w = 300, h = 330;
  shadow(c, cx + 30, rimY + h + 8, 210, 30);
  line(c, [[cx + w / 2 - 10, rimY + 80], [cx + w / 2 + 80, rimY + 100], [cx + w / 2 + 80, rimY + h - 100], [cx + w / 2 - 10, rimY + h - 80]], 40, INK);
  line(c, [[cx + w / 2 - 10, rimY + 80], [cx + w / 2 + 80, rimY + 100], [cx + w / 2 + 80, rimY + h - 100], [cx + w / 2 - 10, rimY + h - 80]], 24, COL.steel);
  const body = () => { c.moveTo(cx - w / 2, rimY); c.lineTo(cx + w / 2, rimY); c.lineTo(cx + w / 2, rimY + h - 40); c.quadraticCurveTo(cx + w / 2, rimY + h, cx + w / 2 - 40, rimY + h); c.lineTo(cx - w / 2 + 40, rimY + h); c.quadraticCurveTo(cx - w / 2, rimY + h, cx - w / 2, rimY + h - 40); c.closePath(); };
  shape(c, body, COL.steel); side(c, body, cx + 70, rimY, 100, h + 10, COL.steelDk, 0.55);
  shine(c, [[cx - 105, rimY + 70], [cx - 105, rimY + h - 80]], 10);
  shape(c, () => ell(c, cx, rimY, w / 2, 44), COL.steelIn, 6);
  shape(c, () => ell(c, cx, rimY + 4, w / 2 - 16, 32), COL.water, 0);
  c.beginPath(); ell(c, cx - 50, rimY + 2, 50, 8); c.fillStyle = COL.drop; c.fill();
};
// the three spoons standing in the mug, bowls up, butter and pea on each handle just above the rim
const SPOONS: [SpoonKind, number, number][] = [["wood", -90, 0.5], ["plastic", -45, 0.27], ["steel", 0, 0.04]];
const spoonsInMug = (c: Ctx, cx: number, rimY: number, slid = false) => {
  SPOONS.forEach(([kind, dx, lean]) => {
    const x = cx + dx, y = rimY + 16, ang = -Math.PI / 2 - lean, L = 440;
    spoon(c, x, y, ang, L, kind);
    const falls = slid && kind === "steel", d = slid ? 190 / Math.cos(lean) : 175;
    if (falls) {
      // the butter has melted: a yellow streak down the handle, the pea slid down with it, a drip falling
      const e = 60 / Math.cos(lean);
      line(c, [[alongX(x, ang, d), alongY(y, ang, d)], [alongX(x, ang, e + 20), alongY(y, ang, e + 20)]], 36, INK);
      line(c, [[alongX(x, ang, d), alongY(y, ang, d)], [alongX(x, ang, e + 20), alongY(y, ang, e + 20)]], 22, BUTTER);
      pea(c, alongX(x, ang, e + 30), alongY(y, ang, e + 30), 20);
      const px = alongX(x, ang, e + 30) + 36, py = alongY(y, ang, e + 30) - 30;
      shape(c, () => { c.moveTo(px, py - 24); c.quadraticCurveTo(px + 18, py + 4, px, py + 14); c.quadraticCurveTo(px - 18, py + 4, px, py - 24); c.closePath(); }, BUTTER, 4);
      arrow(c, [[alongX(x, ang, d) + 70, alongY(y, ang, d) - 20], [alongX(x, ang, e + 30) + 70, alongY(y, ang, e + 30) - 40]], RED, 12);
    } else if (slid) {
      butter(c, alongX(x, ang, d), alongY(y, ang, d), 40, 28, ang + Math.PI / 2);
      pea(c, alongX(x, ang, d), alongY(y, ang, d) - 26, 20);
    } else {
      butter(c, alongX(x, ang, d), alongY(y, ang, d));
      pea(c, alongX(x, ang, d), alongY(y, ang, d) - 18);
    }
  });
};

// a phone with a round timer and the minutes written under it; the red wedge is mins out of 60
const phone = (c: Ctx, x: number, y: number, w: number, h: number, mins: number) => {
  shadow(c, x + w * 0.55, y + h + 12, w * 0.6, 18);
  shape(c, () => rrect(c, x, y, w, h, 32), COL.black, 6);
  shape(c, () => rrect(c, x + 14, y + 18, w - 28, h - 36, 18), "#f4f7fb", 3);
  const cx = x + w / 2, r = (w - 28) * 0.4, cy = y + 18 + r + 24;
  shape(c, () => ell(c, cx, cy, r, r), WHITE, 5);
  c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, r - 3, -Math.PI / 2, -Math.PI / 2 + (mins / 60) * Math.PI * 2); c.closePath(); c.fillStyle = RED; c.fill();
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[cx + Math.cos(a) * (r - 14), cy + Math.sin(a) * (r - 14)], [cx + Math.cos(a) * (r - 3), cy + Math.sin(a) * (r - 3)]], 4); }
  c.beginPath(); ell(c, cx, cy, r, r); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  const t = String(mins), th = r * 0.85, tw = th * 0.8 * t.length - th * 0.2;
  write(c, t, cx - tw / 2, cy + r + 30, th, INK, 9);
};

// an ice cube sitting on its bottom face, centre of the bottom at the origin
const ice = (c: Ctx, s = 110) => {
  const k = s * 0.25;
  shape(c, () => rrect(c, -s / 2, -s, s, s, 10), COL.sky, 6);
  shape(c, () => polyP(c, [[-s / 2, -s], [s / 2, -s], [s / 2 + k, -s - k], [-s / 2 + k, -s - k]]), "#eaf6fd", 6);
  shape(c, () => polyP(c, [[s / 2, -s], [s / 2 + k, -s - k], [s / 2 + k, -k], [s / 2, 0]]), "#8fbfe0", 6);
  shine(c, [[-s * 0.3, -s * 0.8], [-s * 0.3, -s * 0.3]], s * 0.07);
};
// crumpled foil round an ice cube
const foil = (c: Ctx) => {
  const p: number[][] = [[-100, 0], [-112, -55], [-70, -105], [-35, -150], [10, -118], [55, -148], [95, -90], [118, -30], [80, 0]];
  shape(c, () => polyP(c, p), FOIL, 6);
  side(c, () => polyP(c, p), 20, -170, 120, 180, FOIL_DK, 0.6);
  line(c, [[-70, -105], [-10, -70], [-30, -20]], 4, FOIL_DK); line(c, [[10, -118], [30, -60], [80, -30]], 4, FOIL_DK); line(c, [[55, -148], [40, -100]], 4, FOIL_DK);
  shine(c, [[-85, -60], [-60, -95]], 8);
};
// a small steel tumbler with the ice cube peeping out of the top
const tumbler = (c: Ctx) => {
  const b = () => polyP(c, [[-90, -190], [90, -190], [72, 0], [-72, 0]]);
  shape(c, () => ell(c, 0, -190, 90, 26), COL.steelIn, 6);
  at(c, 0, -176, 0.8, (cc) => ice(cc, 100));
  shape(c, b, COL.steel, 6); side(c, b, 25, -200, 90, 210, COL.steelDk, 0.55);
  shape(c, () => ell(c, 0, -190, 90, 26), "rgba(255,255,255,0.0)", 0);
  c.save(); c.beginPath(); c.rect(-100, -190, 200, 40); c.clip(); c.beginPath(); ell(c, 0, -190, 90, 26); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); c.restore();
  shine(c, [[-62, -165], [-50, -30]], 10);
};
// a woollen sock standing on its heel, cuff open at the top with an ice cube peeping out; origin = floor under the leg
const sock = (c: Ctx, withIce = true, iceS = 90) => {
  const p = () => { c.moveTo(-80, -130); c.lineTo(-80, -30); c.quadraticCurveTo(-80, 0, -50, 0); c.lineTo(85, 0); c.quadraticCurveTo(125, 0, 125, -38); c.quadraticCurveTo(125, -78, 85, -80); c.lineTo(80, -80); c.lineTo(80, -130); c.closePath(); };
  shadow(c, 20, 8, 120, 14);
  shape(c, () => ell(c, 0, -170, 84, 26), "#6e1f17", 6);
  if (withIce) at(c, 0, -156, 0.62, (cc) => ice(cc, iceS));
  shape(c, p, WOOL, 6); side(c, p, 30, -180, 120, 190, WOOL_DK, 0.55);
  const cuff = () => { c.moveTo(-84, -170); c.ellipse(0, -170, 84, 26, 0, Math.PI, 0, true); c.lineTo(84, -118); c.lineTo(-84, -118); c.closePath(); };
  shape(c, cuff, WHITE, 6);
  for (let k = 0; k < 4; k++) shape(c, () => rrect(c, -80 + k * 41 + 6, -150, 20, 30, 5), WOOL, 0);
  shape(c, () => ell(c, 112, -40, 22, 34), COL.yellow, 5);
  shape(c, () => ell(c, -58, -26, 24, 24), COL.yellow, 5);
  c.save(); c.beginPath(); p(); c.clip();
  for (let r = 0; r < 5; r++) for (let q = 0; q < 5; q++) { const x = -62 + q * 36 + (r % 2) * 18, y = -105 + r * 18; if (y > -112) line(c, [[x, y], [x + 8, y + 10], [x + 16, y]], 3, WOOL_DK); }
  c.restore();
};
// a white saucer, centre at (x, y)
const saucer = (c: Ctx, x: number, y: number, rx = 210) => {
  const ry = rx * 0.4;
  shadow(c, x + 18, y + ry * 0.5, rx, ry);
  shape(c, () => ell(c, x, y, rx, ry), WHITE, 6);
  side(c, () => ell(c, x, y, rx, ry), x + rx * 0.5, y - ry, rx, ry * 2, "#b9c3d0", 0.4);
  shape(c, () => ell(c, x, y - 4, rx * 0.68, ry * 0.6), "#eef2f6", 3);
};

// a clay pot (matka): bottom centre at the origin, 300 wide, 250 tall
const matka = (c: Ctx, damp = false) => {
  shadow(c, 30, 8, 170, 24);
  const body = () => ell(c, 0, -125, 150, 120);
  shape(c, () => polyP(c, [[-70, -230], [70, -230], [92, -190], [-92, -190]]), TERRA, 6);
  shape(c, body, TERRA, 6); side(c, body, 55, -260, 120, 270, TERRA_DK, 0.5);
  shape(c, () => polyP(c, [[-72, -232], [72, -232], [90, -192], [-90, -192]]), TERRA, 0);
  line(c, [[-72, -232], [-90, -192]], 6); line(c, [[72, -232], [90, -192]], 6);
  shape(c, () => ell(c, 0, -236, 96, 24), TERRA, 6);
  shape(c, () => ell(c, 0, -236, 74, 15), TERRA_DK, 4);
  shape(c, () => ell(c, 0, -234, 66, 11), COL.water, 0);
  line(c, [[-110, -70], [-95, -40]], 0, INK);
  shine(c, [[-118, -150], [-100, -95]], 9);
  if (damp) {
    c.save(); c.beginPath(); body(); c.clip(); c.globalAlpha = 0.55; c.fillStyle = "#7a3d22";
    [[-70, -60, 60, 40], [30, -90, 70, 50], [-10, -150, 50, 30], [80, -50, 40, 30], [-100, -120, 28, 36]].forEach(([x, y, rx, ry]) => { c.beginPath(); ell(c, x, y, rx, ry); c.fill(); });
    c.restore(); c.globalAlpha = 1;
    [[-60, -80], [20, -60], [60, -110], [-20, -140], [-95, -110], [90, -60]].forEach(([x, y]) => shape(c, () => { c.moveTo(x, y - 18); c.quadraticCurveTo(x + 14, y + 2, x, y + 10); c.quadraticCurveTo(x - 14, y + 2, x, y - 18); c.closePath(); }, COL.drop, 3));
  }
};
// a bottle, bottom centre at the origin, 130 wide, 340 tall: plastic is see-through with water in it, steel is steel
const bottle = (c: Ctx, kind: "plastic" | "steel", fill = 0.6) => {
  const w = 130, h = 340, nw = 28, bt = -h * 0.72;
  shadow(c, 28, 8, 90, 16);
  const p = () => {
    c.moveTo(-nw, -h + 30); c.lineTo(-nw, bt - 24); c.quadraticCurveTo(-w / 2, bt - 8, -w / 2, bt + 40); c.lineTo(-w / 2, -22); c.quadraticCurveTo(-w / 2, 0, -w / 2 + 22, 0);
    c.lineTo(w / 2 - 22, 0); c.quadraticCurveTo(w / 2, 0, w / 2, -22); c.lineTo(w / 2, bt + 40); c.quadraticCurveTo(w / 2, bt - 8, nw, bt - 24); c.lineTo(nw, -h + 30); c.closePath();
  };
  if (kind === "plastic") {
    side(c, p, -w, -h * fill, 2 * w, h, COL.water, 1);
    shape(c, p, COL.glass, 6);
    side(c, p, -w, -h * fill - 3, 2 * w, 6, COL.drop, 1);
    shape(c, () => rrect(c, -nw - 8, -h, 2 * nw + 16, 36, 8), COL.blue, 5);
    shine(c, [[-46, bt + 30], [-46, -30]], 9);
  } else {
    shape(c, p, COL.steel, 6); side(c, p, 18, -h, 60, h, COL.steelDk, 0.55);
    shape(c, () => rrect(c, -nw - 8, -h, 2 * nw + 16, 40, 8), COL.steelDk, 5);
    shine(c, [[-46, bt + 30], [-46, -30]], 9);
  }
};
// a falling stream of water from (x0, y0) to (x1, y1)
const stream = (c: Ctx, x0: number, y0: number, x1: number, y1: number, w = 20) => {
  const pts: number[][] = [];
  for (let i = 0; i <= 20; i++) { const t = i / 20; pts.push([x0 + (x1 - x0) * (1 - (1 - t) * (1 - t)), y0 + (y1 - y0) * t * t]); }
  line(c, pts, w + 10, INK); line(c, pts, w, COL.water);
};
const droplets = (c: Ctx, x: number, y: number) => [[-60, -20], [50, -30], [-20, -50], [75, 5], [-85, 10]].forEach(([dx, dy]) => shape(c, () => ell(c, x + dx, y + dy, 8, 6), COL.drop, 3));

// ---------------------------------------------------------------- e1 The Hot Spoon Race
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  (["steel", "plastic", "wood"] as SpoonKind[]).forEach((kind, i) => {
    const y = 230 + i * 310, x = 80;
    shadow(c, 520, y + 52, 440, 20);
    spoon(c, x, y, 0, 640, kind, 2);
    butter(c, x + 200, y, 54, 36); pea(c, x + 200, y - 24, 26);
  });
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  const cx = 450, rim = 700;
  mug(c, cx, rim); spoonsInMug(c, cx, rim);
  const kx = 735, ky = 440, rot = -0.85;
  c.save(); c.translate(kx, ky); c.rotate(rot);
  shape(c, () => polyP(c, [[-110, 60], [-120, -20], [-228, -112], [-196, -136], [-90, -60]]), COL.steel, 6);
  line(c, [[95, -95], [190, -105], [205, 10], [120, 60]], 44, INK); line(c, [[95, -95], [190, -105], [205, 10], [120, 60]], 28, COL.black);
  const body = () => rrect(c, -140, -80, 280, 190, 60);
  shape(c, body, COL.steel, 6); side(c, body, 40, -100, 120, 260, COL.steelDk, 0.5);
  shape(c, () => ell(c, 0, -84, 84, 24), COL.steelIn, 6); shape(c, () => ell(c, 0, -112, 20, 14), COL.black, 5);
  shine(c, [[-105, -20], [-105, 55]], 10);
  c.restore();
  stream(c, kx - 224, ky + 80, 512, rim + 6, 22);
  arrow(c, [[600, 540], [600, 640]]);
  hand(c, kx + 165, ky - 170, Math.PI, 1.5, SKIN.adult, CLOTH.adult);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  const cx = 400, rim = 700;
  mug(c, cx, rim); spoonsInMug(c, cx, rim, true);
  phone(c, 720, 300, 270, 500, 4);
};

// ---------------------------------------------------------------- e2 Does a Sweater Make Heat?
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  const P: [number, number][] = [[290, 420], [790, 420], [290, 880], [790, 880]];
  P.forEach(([x, y]) => saucer(c, x, y));
  at(c, P[0][0], P[0][1] + 6, 1.5, (cc) => ice(cc, 100));
  at(c, P[1][0], P[1][1] + 10, 1.3, foil);
  at(c, P[2][0], P[2][1] + 14, 1.25, tumbler);
  at(c, P[3][0] - 30, P[3][1] + 16, 1.2, sock);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  saucer(c, 370, 905, 270);
  at(c, 330, 905, 1.8, (cc) => sock(cc, true, 130));
  hand(c, 580, 645, Math.PI, 1.4, SKIN.child, CLOTH.child);
  phone(c, 720, 60, 240, 380, 30);
  saucer(c, 830, 880, 190);
  shape(c, () => ell(c, 830, 880, 150, 52), COL.water, 4);
  c.beginPath(); ell(c, 790, 868, 55, 9); c.fillStyle = COL.drop; c.fill();
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  shadow(c, 470, 960, 400, 24);
  shape(c, () => rrect(c, 80, 90, 790, 860, 18), WHITE, 6);
  line(c, [[150, 190], [150, 790], [830, 790]], 8);
  const bars: [number, number, string, string][] = [[260, 90, COL.sky, "#8fbfe0"], [415, 200, FOIL, FOIL_DK], [570, 340, COL.steel, COL.steelDk], [725, 560, COL.red, WOOL_DK]];
  bars.forEach(([x, h, f, dk]) => { const p = () => rrect(c, x - 60, 790 - h, 120, h, 6); shape(c, p, f, 6); side(c, p, x + 15, 790 - h, 60, h, dk, 0.55); });
  at(c, 260, 925, 0.5, (cc) => ice(cc, 100));
  at(c, 415, 925, 0.5, foil);
  at(c, 570, 925, 0.45, tumbler);
  at(c, 725, 925, 0.4, (cc) => sock(cc, false));
  // pencil in a child's hand, drawing the tall bar
  const an = Math.PI - 0.5, dx = Math.cos(an), dy = Math.sin(an), T = [700, 236];
  c.save(); c.translate(T[0], T[1]); c.rotate(an + Math.PI);
  shape(c, () => polyP(c, [[0, 0], [60, -15], [60, 15]]), "#f5d9a8", 5); shape(c, () => polyP(c, [[0, 0], [20, -5], [20, 5]]), INK, 3);
  shape(c, () => rrect(c, 60, -15, 230, 30, 4), COL.yellow, 5); shape(c, () => rrect(c, 290, -15, 22, 30, 6), COL.pink, 5);
  c.restore();
  hand(c, T[0] - dx * 170 - dx * 70 * 1.3, T[1] - dy * 170 - dy * 70 * 1.3, an, 1.3, SKIN.child, CLOTH.child);
};

// ---------------------------------------------------------------- e3 The Matka Mystery
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  at(c, 150, 960, 1.2, (cc) => bottle(cc, "plastic", 0.45));
  at(c, 540, 960, 1.3, (cc) => matka(cc));
  at(c, 930, 960, 1.2, (cc) => bottle(cc, "steel"));
  // thermometer standing in the jug
  const jx = 770, jy = 330, rot = -1.0;
  c.save(); c.translate(jx, jy); c.rotate(rot);
  line(c, [[115, -80], [175, -70], [185, 60], [115, 90]], 40, INK); line(c, [[115, -80], [175, -70], [185, 60], [115, 90]], 24, COL.teal);
  const body = () => polyP(c, [[-115, 135], [-130, -100], [-140, -150], [-95, -135], [-40, -135], [-30, -135], [115, -135], [125, 135]]);
  shape(c, body, COL.teal, 6); side(c, body, 40, -170, 120, 330, COL.tealDk, 0.55);
  shape(c, () => ell(c, 40, -135, 85, 20), COL.tealDk, 6);
  shine(c, [[-95, -90], [-90, 90]], 10);
  c.restore();
  line(c, [[672, 240], [706, 50]], 40, INK); line(c, [[672, 240], [706, 50]], 26, WHITE); line(c, [[672, 240], [690, 140]], 12, RED);
  stream(c, jx - 205, jy + 20, 548, 656, 24);
  arrow(c, [[430, 330], [430, 480]]);
  hand(c, 950, 175, Math.PI, 1.2, SKIN.adult, CLOTH.adult);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#f3dcb4"; c.fillRect(0, 0, 1080, 610);
  c.fillStyle = "#e2cc9f"; c.fillRect(0, 610, 1080, 470);
  line(c, [[0, 610], [1080, 610]], 6);
  // the window, sun outside, a curtain moving in the breeze
  shape(c, () => rrect(c, 430, 60, 560, 380, 12), COL.sky, 7);
  shape(c, () => ell(c, 880, 160, 52, 52), COL.yellow, 5);
  line(c, [[710, 60], [710, 440]], 6);
  const cur = () => { c.moveTo(430, 60); c.lineTo(700, 60); c.bezierCurveTo(690, 160, 790, 220, 720, 300); c.bezierCurveTo(660, 360, 760, 400, 690, 470); c.lineTo(430, 440); c.closePath(); };
  shape(c, cur, COL.pink, 6); side(c, cur, 600, 60, 200, 420, "#d9708f", 0.5);
  [[470, 120], [540, 120], [610, 120]].forEach(([x]) => line(c, [[x, 70], [x + 10, 430]], 3, "#d9708f"));
  line(c, [[420, 60], [720, 60]], 12);
  // wind
  [[[520, 330], [610, 310], [700, 345], [790, 330]], [[480, 395], [580, 375], [680, 410], [770, 395]]].forEach((w) => line(c, w, 7, WHITE));
  // time: 3 hours as a red quarter on a clock
  shape(c, () => ell(c, 170, 170, 90, 90), WHITE, 6);
  c.beginPath(); c.moveTo(170, 170); c.arc(170, 170, 87, -Math.PI / 2, 0); c.closePath(); c.fillStyle = RED; c.fill();
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[170 + Math.cos(a) * 74, 170 + Math.sin(a) * 74], [170 + Math.cos(a) * 87, 170 + Math.sin(a) * 87]], 4); }
  c.beginPath(); ell(c, 170, 170, 90, 90); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  write(c, "3", 150, 290, 80, INK, 9);
  at(c, 190, 960, 1.15, (cc) => bottle(cc, "plastic", 0.6));
  at(c, 540, 960, 1.3, (cc) => matka(cc, true));
  at(c, 890, 960, 1.15, (cc) => bottle(cc, "steel"));
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  const tx = 640;
  at(c, tx, 1010, 1.7, (cc) => matka(cc, true));
  // thermometer: glass tube, red column up to 24, scale marks, hand holding the top
  shape(c, () => rrect(c, tx - 28, 110, 56, 500, 28), "rgba(255,255,255,0.85)", 7);
  const y24 = 430;
  shape(c, () => rrect(c, tx - 10, y24, 20, 170, 10), RED, 0);
  for (let d = 18; d <= 32; d++) { const y = y24 - (d - 24) * 18, long = d % 5 === 0; if (y > 150 && y < 570) line(c, [[tx - 30 - (long ? 30 : 14), y], [tx - 30, y]], long ? 6 : 4); }
  write(c, "30", tx - 160, y24 - 6 * 18 - 18, 38, INK, 6);
  write(c, "20", tx - 160, y24 + 4 * 18 - 18, 38, INK, 6);
  // the big reading
  write(c, "24", 60, 350, 120, INK, 13);
  write(c, "°", 260, 335, 120, INK, 11);
  c.beginPath(); c.arc(375, 410, 62, 0.3 * Math.PI, 1.7 * Math.PI); c.lineWidth = 13; c.strokeStyle = INK; c.lineCap = "round"; c.stroke();
  line(c, [[470, y24], [tx - 66, y24]], 6);
  hand(c, tx + 98, 250, Math.PI, 1.4, SKIN.child, CLOTH.child);
};

export const su_materialsUsingMaterials = cards("sci.materials.using-materials.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
