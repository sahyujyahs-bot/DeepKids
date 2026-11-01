import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, hand, write, cards } from "./flatKit";

// sci.energy.heat.L3 · set-up cards. Same steel tumbler, thermometer, bowl and katori on every card of an experiment:
// hot water is warm-tinted and steams, cold water is blue and the tumbler sweats.

// ---------------------------------------------------------------- shared things
const HOT = "#f4b183", HOTDK = "#e08e5a", COLD = "#8fc3ea";
// a table top: a wood-coloured band from y down
const table = (c: Ctx, y: number) => { c.fillStyle = "#ead5a6"; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 5); };
// a smooth line through points (quadratic through mid-points), with an ink outline
const curve = (c: Ctx, pts: number[][], w: number, col: string, outline = 8) => {
  const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
  c.lineCap = "round"; c.lineJoin = "round";
  if (outline) { path(); c.strokeStyle = INK; c.lineWidth = w + outline; c.stroke(); }
  path(); c.strokeStyle = col; c.lineWidth = w; c.stroke();
};
// steam: wavy white curls with an ink edge, rising from (x, y) up by h
const steam = (c: Ctx, x: number, y: number, h: number, n = 3) => {
  for (let i = 0; i < n; i++) {
    const xx = x + (i - (n - 1) / 2) * h * 0.28, s = i % 2 ? 1 : -1, hh = h * (i === 1 ? 1 : 0.8);
    curve(c, [[xx, y], [xx + s * h * 0.1, y - hh * 0.25], [xx - s * h * 0.1, y - hh * 0.5], [xx + s * h * 0.1, y - hh * 0.75], [xx, y - hh]], h * 0.07, WHITE, 6);
  }
};
const dropP = (c: Ctx, x: number, y: number, r: number) => { c.moveTo(x, y - r * 1.7); c.quadraticCurveTo(x + r * 1.15, y - r * 0.2, x, y + r * 0.85); c.quadraticCurveTo(x - r * 1.15, y - r * 0.2, x, y - r * 1.7); c.closePath(); };
// a steel tumbler standing at (x, y) on its base; water shows at the rim; steam = hot, drops = cold and sweating
type Tum = { water?: string; steam?: boolean; drops?: boolean; steamH?: number };
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, o: Tum = {}) => {
  const t = w / 2, b = w * 0.4, ry = w * 0.11, top = y - h;
  shadow(c, x + w * 0.14, y + 8, w * 0.62, w * 0.1);
  const body = () => { c.moveTo(x - t, top); c.lineTo(x + t, top); c.lineTo(x + b, y - w * 0.03); c.quadraticCurveTo(x, y + w * 0.15, x - b, y - w * 0.03); c.closePath(); };
  shape(c, body, COL.steel);
  shade(c, body, COL.steelDk, -t * 0.5, 0, 0.6);
  shine(c, [[x - t * 0.72, top + h * 0.12], [x - b * 0.72, y - h * 0.16]], 8);
  line(c, [[x - t * 0.93, top + h * 0.3], [x, top + h * 0.3 + ry * 1.1], [x + t * 0.93, top + h * 0.3]], 3.5, COL.steelDk);
  if (o.drops) {
    const pos = [[-0.55, 0.45], [-0.15, 0.62], [0.35, 0.5], [0.6, 0.72], [-0.4, 0.82], [0.1, 0.86], [0.55, 0.32], [-0.62, 0.65]];
    pos.forEach(([u, v], i) => { const dx = x + u * (b + (t - b) * (1 - v)) * 1.15, dy = top + h * v, r = w * (i % 3 ? 0.035 : 0.048); shape(c, () => dropP(c, dx, dy, r), COL.drop, 2.5); });
  }
  shape(c, () => ell(c, x, top, t, ry), "#e6ebf1", 5);
  shape(c, () => ell(c, x, top + 2, t * 0.84, ry * 0.76), o.water ?? "#4b4658", 3);
  if (o.steam) steam(c, x, top - ry, o.steamH ?? h * 0.55);
};
// a lab thermometer with its bulb at (x, yb), length len, red line up to frac of the length; tilt turns it
const thermo = (c: Ctx, x: number, yb: number, len: number, frac: number, tilt = 0, tw = 26) => {
  c.save(); c.translate(x, yb); c.rotate(tilt);
  shape(c, () => rrect(c, -tw / 2, -len, tw, len - 6, tw / 2), "#f4f9ff", 5);
  for (let i = 1; i <= 10; i++) { const ty = -len * (0.1 + 0.085 * i); line(c, [[tw / 2, ty], [tw / 2 + (i % 5 ? tw * 0.4 : tw * 0.75), ty]], 3); }
  shape(c, () => ell(c, 0, -2, tw * 0.9, tw * 0.9), RED, 5);
  c.beginPath(); rrect(c, -tw * 0.17, -len * frac, tw * 0.34, len * frac - 4, tw * 0.17); c.fillStyle = RED; c.fill();
  line(c, [[-tw * 0.32, -len * 0.92], [-tw * 0.32, -len * 0.35]], 4, WHITE);
  c.restore();
};
// a long sleeve running off the card, ending in the hand's own cuff
const forearm = (c: Ctx, x: number, y: number, an: number, s: number, sleeve: string) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -1500, -34, 1450, 68, 12), sleeve, 6);
  c.restore();
};
const ADULT = { skin: SKIN.adult, sleeve: CLOTH.adult };

// ---------------------------------------------------------------- e1 · hot tumbler, cold tumbler
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c, "#efe4cf");
  c.fillStyle = "#cdbfa6"; c.fillRect(760, 0, 320, 840);
  c.fillStyle = "#e3c99a"; c.fillRect(0, 840, 1080, 240);
  line(c, [[760, 0], [760, 840]], 5); line(c, [[0, 840], [1080, 840]], 5);
  thermo(c, 470, 960, 800, 0.55, 0, 60);
  forearm(c, 280, 330, 0, 3, CLOTH.child);
  hand(c, 280, 330, 0, 3);
  // the reading, in a white tag
  shape(c, () => rrect(c, 640, 480, 300, 160, 28), WHITE, 6);
  write(c, "30°", 690, 515, 84, INK, 12);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c); table(c, 800);
  tumbler(c, 320, 940, 330, 380, { water: HOT, steam: true, steamH: 190 });
  thermo(c, 395, 580, 380, 0.7, 0, 30);
  tumbler(c, 770, 940, 330, 380, { water: COLD, drops: true });
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c); table(c, 400);
  tumbler(c, 250, 520, 220, 280, { water: HOT, steam: true, steamH: 120 });
  tumbler(c, 800, 520, 220, 280, { water: COLD, drops: true });
  // the notebook with a table of times and temperatures
  shadow(c, 420, 1010, 330, 28);
  shape(c, () => rrect(c, 100, 420, 600, 590, 18), COL.paper, 6);
  for (let i = 0; i < 6; i++) { const rx = 160 + i * 100; shape(c, () => rrect(c, rx - 14, 396, 28, 54, 12), COL.steelDk, 4); }
  const cols = [140, 300, 500, 660], rows = [490, 590, 680, 770, 860, 950];
  rows.forEach((ry) => line(c, [[cols[0], ry], [cols[3], ry]], 4));
  cols.forEach((cx) => line(c, [[cx, rows[0]], [cx, rows[5]]], 4));
  // header: a clock, a hot tumbler, a cold tumbler
  shape(c, () => ell(c, 220, 540, 34, 34), WHITE, 5); line(c, [[220, 540], [220, 518]], 5); line(c, [[220, 540], [238, 548]], 5);
  tumbler(c, 400, 570, 56, 64, { water: HOT, steam: true, steamH: 36 });
  tumbler(c, 580, 570, 56, 64, { water: COLD, drops: true });
  const T = ["0", "5", "10", "15"], H = ["60", "55", "51", "48"], K = ["10", "13", "15", "17"];
  for (let i = 0; i < 4; i++) {
    const y = 590 + i * 90 + 3;
    write(c, T[i], 180, y + 20, 44, INK, 7); write(c, H[i], 330, y + 20, 44, RED, 7); write(c, K[i], 530, y + 20, 44, COL.blueDk, 7);
  }
  // the phone timer: a red wedge for 5 minutes
  c.save(); c.translate(870, 800); c.rotate(0.12);
  shadow(c, 20, 215, 130, 24);
  shape(c, () => rrect(c, -125, -210, 250, 420, 30), COL.black, 6);
  shape(c, () => rrect(c, -105, -180, 210, 360, 14), "#f6fbff", 3);
  shape(c, () => ell(c, 0, -50, 84, 84), WHITE, 5);
  c.beginPath(); c.moveTo(0, -50); c.arc(0, -50, 80, -Math.PI / 2, -Math.PI / 2 + Math.PI / 6); c.closePath(); c.fillStyle = RED; c.fill();
  line(c, [[0, -50], [0, -128]], 5);
  write(c, "5", -20, 70, 80, INK, 12);
  c.restore();
};

// ---------------------------------------------------------------- e2 · tumbler in a bowl
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c); table(c, 860);
  shadow(c, 560, 868, 450, 30);
  const vx = 130, vx2 = 950, vt = 400, vb = 860, wall = 24;
  shape(c, () => rrect(c, vx, vt, vx2 - vx, vb - vt, 26), COL.steel, 6);
  // the cut-away: the inside of the vessel and its water
  shape(c, () => rrect(c, vx + wall, vt - 8, vx2 - vx - 2 * wall, vb - vt - wall + 8, 8), "#efe7d3", 4);
  shape(c, () => polyP(c, [[vx + wall, 470], [vx2 - wall, 470], [vx2 - wall, vb - wall], [vx + wall, vb - wall]]), COL.water, 4);
  line(c, [[vx + wall + 10, 484], [vx2 - wall - 10, 484]], 6, WHITE);
  // the hot tumbler inside, in section
  const tl = 400, tr = 680, tt = 284, tb = vb - wall;
  shape(c, () => rrect(c, tl, tt, tr - tl, tb - tt, 10), COL.steel, 6);
  shape(c, () => polyP(c, [[tl + 18, tt], [tr - 18, tt], [tr - 18, tb - 18], [tl + 18, tb - 18]]), "#efe7d3", 3);
  shape(c, () => polyP(c, [[tl + 18, 336], [tr - 18, 336], [tr - 18, tb - 18], [tl + 18, tb - 18]]), HOT, 3);
  line(c, [[tl + 30, 350], [tr - 30, 350]], 6, WHITE);
  steam(c, 540, tt - 8, 150);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c); table(c, 900);
  const cx = 540, cy = 590, rx = 410, ry = 150;
  shadow(c, cx + 30, 925, 420, 36);
  const body = () => { c.moveTo(cx - rx, cy); c.lineTo(cx - rx + 22, 840); c.quadraticCurveTo(cx, 940, cx + rx - 22, 840); c.lineTo(cx + rx, cy); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -rx * 0.35, 0, 0.55);
  shape(c, () => ell(c, cx, cy, rx, ry), "#e6ebf1", 6);
  shape(c, () => ell(c, cx, cy + 4, rx - 28, ry - 24), COL.water, 4);
  // the hot tumbler standing in the middle of the water
  const tx = 540, tb = 610, tw = 250, th = 290;
  c.beginPath(); ell(c, tx, tb, tw * 0.62, 34); c.strokeStyle = WHITE; c.lineWidth = 6; c.stroke();
  tumbler(c, tx, tb, tw, th, { water: HOT, steam: true, steamH: 150 });
  // a thermometer standing in the outer water, at the left
  thermo(c, 250, 625, 440, 0.5, 0, 32);
  // the spoon: handle through the child's fist, bowl in the front water; a red arrow for the stirring
  const an = 0.4, S = 1.7, fx = 880, fy = 200, d = [-Math.sin(an), Math.cos(an)];
  const wx = fx - 70 * S * Math.cos(an), wy = fy - 70 * S * Math.sin(an);
  forearm(c, wx, wy, an, S, CLOTH.child);
  const hx = fx + d[0] * 520, hy = fy + d[1] * 520, ex = fx - d[0] * 150, ey = fy - d[1] * 150;
  line(c, [[ex, ey], [hx, hy]], 24, INK); line(c, [[ex, ey], [hx, hy]], 13, COL.steel);
  shape(c, () => ell(c, hx, hy, 42, 20, 0.3), COL.steel, 5);
  hand(c, wx, wy, an, S);
  const ar: number[][] = [];
  for (let a = 0.3; a < 5.2; a += 0.25) ar.push([hx + Math.cos(a) * 85, hy - 14 + Math.sin(a) * 28]);
  arrow(c, ar, RED, 9);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 60, 960, 960, 30), COL.paper, 6);
  const ox = 170, oy = 890, X0 = 330, X1 = 920, yH = 290, yC = 800, yL = 540;
  // the axes
  arrow(c, [[ox, oy], [ox, 150]], INK, 8); arrow(c, [[ox, oy], [990, oy]], INK, 8);
  const res = (t: number) => Math.max(0, Math.exp(-4.5 * t) - Math.exp(-4.5 * 0.68)) / (1 - Math.exp(-4.5 * 0.68));
  const hotY = (t: number) => yL + (yH - yL) * res(t), coldY = (t: number) => yL + (yC - yL) * res(t);
  const P = (f: (t: number) => number) => Array.from({ length: 41 }, (_, i) => { const t = i / 40; return [X0 + t * (X1 - X0), f(t)]; });
  // where they meet: a yellow ring and a dashed drop to the axis
  const mx = X0 + 0.68 * (X1 - X0);
  c.setLineDash([16, 14]); line(c, [[mx, yL], [mx, oy]], 5, COL.greyDk); c.setLineDash([]);
  curve(c, P(coldY), 20, COL.blue, 8);
  curve(c, P(hotY), 10, RED, 0);
  for (let i = 0; i <= 12; i++) { const t = i / 12; for (const [f, col] of [[coldY, COL.blueDk], [hotY, RED]] as [(t: number) => number, string][]) shape(c, () => ell(c, X0 + t * (X1 - X0), f(t), 15, 15), col, 4); }
  c.beginPath(); ell(c, mx, yL, 46, 46); c.strokeStyle = COL.yellow; c.lineWidth = 12; c.stroke();
  // what each line is: the hot tumbler, the bowl of water
  tumbler(c, 262, 330, 100, 112, { water: HOT, steam: true, steamH: 60 });
  bowl(c, 262, 760, 70, COLD);
};

// ---------------------------------------------------------------- e3 · half and half
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c); table(c, 720);
  tumbler(c, 290, 770, 290, 320, { water: HOT, steam: true, steamH: 170 });
  tumbler(c, 790, 770, 290, 320, { water: COLD, drops: true });
  // one katori of water for each, and the thermometer lying between them
  bowl(c, 290, 880, 105, HOT);
  steam(c, 290, 872, 70, 2);
  bowl(c, 790, 880, 105, COLD);
  thermo(c, 430, 905, 290, 0.5, Math.PI / 2, 28);
};

// one pouring grown-up hand holding a tilted tumbler, as it looks on the left; rim lip near (x+136, y+63)
const pourer = (c: Ctx, hot: boolean) => {
  const fx = 240, fy = 560, s = 1.6, an = 0.3;
  c.save(); c.translate(fx, fy); c.rotate(2.0);
  tumbler(c, 0, 150, 230, 300, hot ? { water: HOT, steam: false } : { water: COLD, drops: true });
  c.restore();
  forearm(c, fx - 70 * s * Math.cos(an), fy - 70 * s * Math.sin(an), an, s, ADULT.sleeve);
  hand(c, fx - 70 * s * Math.cos(an), fy - 70 * s * Math.sin(an), an, s, ADULT.skin, ADULT.sleeve);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c); table(c, 1000);
  const cx = 540, ctop = 740, ch = 330;
  tumbler(c, cx, ctop + ch, 270, ch, { water: "#a9c9d8" });
  pourer(c, true);
  c.save(); c.translate(1080, 0); c.scale(-1, 1); pourer(c, false); c.restore();
  // the two streams into the third tumbler
  curve(c, [[395, 650], [450, 660], [480, 700], [492, 745]], 20, HOT, 8);
  curve(c, [[685, 650], [630, 660], [600, 700], [588, 745]], 20, COLD, 8);
  // the child's hand stirring with a spoon
  const an = 0.35, S = 1.6, fx = 690, fy = 270, d = [-Math.sin(an), Math.cos(an)];
  const wx = fx - 70 * S * Math.cos(an), wy = fy - 70 * S * Math.sin(an);
  forearm(c, wx, wy, an, S, CLOTH.child);
  const ex = fx - d[0] * 150, ey = fy - d[1] * 150, hx = fx + d[0] * 520, hy = fy + d[1] * 520;
  line(c, [[ex, ey], [hx, hy]], 24, INK); line(c, [[ex, ey], [hx, hy]], 13, COL.steel);
  hand(c, wx, wy, an, S);
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c); table(c, 900);
  tumbler(c, 280, 960, 340, 400, { water: "#a9c9d8" });
  thermo(c, 330, 590, 480, 0.5, 0, 32);
  // a magnifying circle on the thermometer: the red line sits halfway between 30 and 40
  const lx = 740, ly = 450, lr = 270;
  line(c, [[345, 245], [lx - 150, ly - 225]], 6); line(c, [[345, 330], [lx - 220, ly + 150]], 6);
  line(c, [[920, 640], [1010, 740]], 34, INK); line(c, [[920, 640], [1010, 740]], 20, COL.woodDk);
  c.save(); c.beginPath(); ell(c, lx, ly, lr, lr); c.clip();
  c.fillStyle = "#f6fbff"; c.fillRect(0, 0, 1080, 1080);
  const y40 = ly - 150, y30 = ly + 150, y35 = (y40 + y30) / 2, tx = lx - 60;
  shape(c, () => rrect(c, tx - 40, ly - 330, 80, 700, 40), "#e6f0f8", 6);
  c.beginPath(); c.rect(tx - 20, y35, 40, 400); c.fillStyle = RED; c.fill();
  for (let i = 0; i <= 10; i++) { const y = y40 + (y30 - y40) * (i / 10), big = i % 5 === 0; line(c, [[tx + 40, y], [tx + 40 + (big ? 70 : 40), y]], big ? 7 : 5); }
  write(c, "40", tx + 130, y40 - 28, 56, INK, 9); write(c, "30", tx + 130, y30 - 28, 56, INK, 9);
  c.setLineDash([14, 12]); line(c, [[tx - 20, y35], [tx + 120, y35]], 5, RED); c.setLineDash([]);
  c.restore();
  c.beginPath(); ell(c, lx, ly, lr, lr); c.strokeStyle = INK; c.lineWidth = 14; c.stroke();
  c.beginPath(); ell(c, lx, ly, lr - 12, lr - 12); c.strokeStyle = COL.steelDk; c.lineWidth = 8; c.stroke();
};

export const su_energyHeat = cards("sci.energy.heat.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
