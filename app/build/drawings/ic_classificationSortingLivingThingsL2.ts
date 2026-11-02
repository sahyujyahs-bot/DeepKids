import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, plate, leaf, person, write, cards, rnd } from "./flatKit";

// SORTING LIVING THINGS L2 · set-up cards for the ant lunch, the three sorts, the hoops, the crow menu and the
// home animal grid, then the activity pictures. Same child (orange) and grown-up (blue) as the other units.

const FLOOR = "#e2cfb0", WALL = "#dfe8ee", TOP = "#d9c2a0", FRONT = "#b99a74";
const at = (c: Ctx, x: number, y: number, s: number, f: () => void) => { c.save(); c.translate(x, y); c.scale(s, s); f(); c.restore(); };
const room = (c: Ctx, split = 300) => { ground(c, WALL); c.fillStyle = FLOOR; c.fillRect(0, split, D, D - split); line(c, [[0, split], [D, split]], 5); };
const kitchen = (c: Ctx) => { ground(c, WALL); c.fillStyle = TOP; c.fillRect(0, 420, D, 340); c.fillStyle = FRONT; c.fillRect(0, 760, D, D - 760); line(c, [[0, 420], [D, 420]], 5); line(c, [[0, 760], [D, 760]], 5); };

// ---------------------------------------------------------------- animals (each about 120 px wide at s = 1, centred)
const eye = (c: Ctx, x: number, y: number, r = 5) => shape(c, () => ell(c, x, y, r, r), INK, 0);
const hen = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => {
  for (const k of [-14, 14]) line(c, [[k, 30], [k, 58], [k + 12, 62]], 5, COL.orange);
  shape(c, () => { c.moveTo(-46, 4); c.quadraticCurveTo(-82, -40, -62, -58); c.quadraticCurveTo(-44, -20, -26, -6); c.closePath(); }, COL.brown);
  shape(c, () => ell(c, 0, 10, 52, 36), "#f1e6d2");
  shape(c, () => ell(c, 40, -30, 20, 20), "#f1e6d2");
  shape(c, () => polyP(c, [[30, -48], [36, -64], [44, -50], [50, -64], [56, -46]]), RED, 4);
  shape(c, () => polyP(c, [[58, -30], [80, -24], [58, -18]]), COL.yellow, 4);
  shape(c, () => ell(c, 44, -8, 6, 10), RED, 3);
  eye(c, 44, -34, 4);
});
const blackbird = (c: Ctx, x: number, y: number, s: number, body: string, beak: string, dk: string) => at(c, x, y, s, () => {
  for (const k of [-10, 14]) line(c, [[k, 28], [k, 56], [k + 12, 60]], 5, dk);
  shape(c, () => { c.moveTo(-40, 6); c.lineTo(-86, 14); c.lineTo(-82, -8); c.lineTo(-40, -8); c.closePath(); }, body);
  shape(c, () => ell(c, 0, 8, 52, 32), body);
  shape(c, () => ell(c, 40, -28, 20, 19), body);
  shape(c, () => polyP(c, [[56, -34], [86, -24], [56, -16]]), beak, 4);
  shape(c, () => ell(c, 44, -32, 5, 5), WHITE, 2); eye(c, 45, -32, 3);
});
const crow = (c: Ctx, x: number, y: number, s: number) => blackbird(c, x, y, s, COL.black, "#6b6670", COL.greyDk);
const pigeon = (c: Ctx, x: number, y: number, s: number) => blackbird(c, x, y, s, COL.grey, "#7d7870", COL.pink);
const ant = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => {
  for (const k of [-16, 0, 16]) { line(c, [[k - 4, 0], [k - 10 + k * 0.6, 24], [k - 12 + k * 0.8, 38]], 4); line(c, [[k - 4, -8], [k - 6 + k * 0.6, -30], [k - 4 + k * 0.9, -42]], 4); }
  shape(c, () => ell(c, -34, 2, 28, 18), COL.black, 5);
  shape(c, () => ell(c, 0, -4, 15, 11), COL.black, 5);
  shape(c, () => ell(c, 24, -8, 14, 12), COL.black, 5);
  line(c, [[32, -18], [46, -40]], 4); line(c, [[24, -20], [30, -44]], 4);
  shape(c, () => ell(c, 30, -10, 3, 3), WHITE, 0);
});
const fish = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => {
  shape(c, () => polyP(c, [[-40, 0], [-80, -30], [-72, 0], [-80, 30]]), COL.blueDk);
  shape(c, () => ell(c, 0, 0, 52, 28), COL.blue);
  c.save(); c.beginPath(); ell(c, 0, 0, 52, 28); c.clip();
  for (const [sx, sy] of [[-20, -12], [-20, 12], [-2, 0], [16, -12], [16, 12]]) { c.beginPath(); c.arc(sx, sy, 12, 0, Math.PI * 2); c.strokeStyle = COL.blueDk; c.lineWidth = 4; c.stroke(); }
  c.restore();
  eye(c, 32, -6, 5);
});
const snail = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => {
  shape(c, () => { c.moveTo(-50, 34); c.quadraticCurveTo(-10, 16, 40, 20); c.quadraticCurveTo(66, 22, 60, -6); c.quadraticCurveTo(50, -14, 44, 8); c.lineTo(44, 34); c.closePath(); }, COL.greenLt);
  shape(c, () => ell(c, -4, -4, 38, 34), COL.wood);
  c.beginPath(); c.moveTo(-4, -4); for (let t = 0; t < 10; t += 0.1) c.lineTo(-4 + Math.cos(t) * t * 3.4, -4 + Math.sin(t) * t * 3.0); c.strokeStyle = COL.woodDk; c.lineWidth = 4; c.lineCap = "round"; c.stroke();
  line(c, [[50, -4], [56, -30]], 4); line(c, [[58, -2], [70, -24]], 4); eye(c, 56, -32, 4); eye(c, 71, -26, 4);
});
const frog = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => {
  for (const k of [-1, 1]) shape(c, () => ell(c, k * 48, 28, 22, 12), COL.green, 5);
  shape(c, () => ell(c, 0, 8, 50, 32), COL.green);
  shape(c, () => ell(c, 0, 16, 34, 16), COL.greenLt, 0);
  for (const k of [-1, 1]) { shape(c, () => ell(c, k * 24, -22, 14, 14), COL.green); shape(c, () => ell(c, k * 24, -22, 7, 7), WHITE, 3); eye(c, k * 24, -22, 3); }
  c.beginPath(); c.arc(0, 0, 22, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
});
const cat = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => {
  line(c, [[40, 20], [76, 10], [84, -24]], 14, INK); line(c, [[40, 20], [76, 10], [84, -24]], 7, COL.orange);
  shape(c, () => ell(c, 10, 18, 46, 30), COL.orange);
  shape(c, () => polyP(c, [[-56, -22], [-62, -58], [-34, -40]]), COL.orange, 5); shape(c, () => polyP(c, [[-14, -22], [-8, -58], [-36, -40]]), COL.orange, 5);
  shape(c, () => ell(c, -34, -16, 32, 28), COL.orange);
  eye(c, -46, -20, 4); eye(c, -22, -20, 4); shape(c, () => polyP(c, [[-38, -8], [-30, -8], [-34, -2]]), COL.pink, 2);
  for (const k of [-1, 1]) { line(c, [[-34 + k * 10, -4], [-34 + k * 44, -8]], 2.5); line(c, [[-34 + k * 10, 0], [-34 + k * 44, 4]], 2.5); }
});
const goat = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => {
  for (const k of [-24, -6, 20, 36]) line(c, [[k, 28], [k, 58]], 6);
  shape(c, () => rrect(c, -44, -6, 88, 42, 16), "#f1e6d2");
  shape(c, () => rrect(c, 30, -40, 36, 50, 12), "#f1e6d2");
  line(c, [[40, -40], [30, -66]], 5, COL.greyDk); line(c, [[56, -40], [66, -66]], 5, COL.greyDk);
  shape(c, () => ell(c, 62, 14, 7, 12), "#f1e6d2", 4);
  eye(c, 52, -24, 4);
});
const gecko = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => {
  line(c, [[-30, 0], [-60, 20], [-90, 10]], 14, INK); line(c, [[-30, 0], [-60, 20], [-90, 10]], 7, COL.greenLt);
  for (const [lx, ly] of [[-16, -10], [-16, 10], [26, -10], [26, 10]]) line(c, [[lx, 0], [lx - 8, ly * 2.4], [lx - 16, ly * 2.8]], 5);
  shape(c, () => ell(c, 4, 0, 40, 14), COL.greenLt);
  shape(c, () => ell(c, 50, 0, 20, 13), COL.greenLt);
  eye(c, 52, -5, 4); eye(c, 52, 5, 4);
});
const fly = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => {
  for (const k of [-1, 1]) line(c, [[-6, 10 * k], [-22, 26 * k], [-36, 24 * k]], 3);
  for (const k of [-1, 1]) shape(c, () => ell(c, -22, k * 24, 36, 14, k * 0.4), "rgba(214,236,250,0.7)", 3);
  shape(c, () => ell(c, -14, 0, 30, 15), COL.black);
  shape(c, () => ell(c, 20, 0, 14, 13), COL.black);
  shape(c, () => ell(c, 26, -6, 5, 6), RED, 2); shape(c, () => ell(c, 26, 6, 5, 6), RED, 2);
});
const kid = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => {
  shape(c, () => rrect(c, -30, 10, 60, 50, 14), CLOTH.child);
  shape(c, () => ell(c, 0, -20, 30, 32), SKIN.child);
  shape(c, () => { c.moveTo(-31, -20); c.bezierCurveTo(-30, -66, 30, -66, 31, -20); c.quadraticCurveTo(0, -36, -31, -20); c.closePath(); }, CLOTH.hair, 4);
  eye(c, -10, -16, 3); eye(c, 10, -16, 3);
  c.beginPath(); c.arc(0, -8, 9, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
});
type Icon = (c: Ctx, x: number, y: number, s: number) => void;

// ---------------------------------------------------------------- foods and feature signs
const banana = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => {
  shape(c, () => rrect(c, -40, -30, 80, 60, 20), COL.yellow);
  shade(c, () => rrect(c, -40, -30, 80, 60, 20), COL.woodDk, -14, 0, 0.35);
  shape(c, () => ell(c, 40, 0, 10, 30), "#fff4c9", 5);
});
const rice = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => { for (const [gx, gy, r] of [[-40, 0, 0.4], [-10, -16, 1.2], [14, 8, 0.1], [40, -6, 0.9], [4, 30, 2.2]]) shape(c, () => ell(c, gx, gy, 16, 7, r), WHITE, 4); });
const mosquito = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => {
  for (const k of [-1, 1]) for (const lx of [-10, 0, 10]) line(c, [[lx, 0], [lx - 10, 18 * k], [lx - 26, 30 * k]], 2.5);
  for (const k of [-1, 1]) shape(c, () => ell(c, -14, k * 14, 30, 8, k * 0.5), "rgba(214,236,250,0.7)", 2.5);
  shape(c, () => ell(c, -10, 0, 26, 6), COL.greyDk, 3); shape(c, () => ell(c, 20, 0, 8, 7), COL.greyDk, 3);
  line(c, [[28, 0], [52, 2]], 2.5);
});
const moth = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => {
  for (const k of [-1, 1]) shape(c, () => polyP(c, [[0, -10], [k * 56, -30], [k * 50, 20], [0, 16]]), COL.brown, 4);
  shape(c, () => ell(c, 0, 4, 9, 24), COL.soilDk, 3); line(c, [[-4, -18], [-16, -36]], 3); line(c, [[4, -18], [16, -36]], 3);
});
const bread = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => {
  shape(c, () => { c.moveTo(-36, 36); c.lineTo(-36, -10); c.bezierCurveTo(-40, -44, -4, -40, 0, -24); c.bezierCurveTo(4, -40, 40, -44, 36, -10); c.lineTo(36, 36); c.closePath(); }, COL.brown);
  shape(c, () => { c.moveTo(-26, 28); c.lineTo(-26, -8); c.bezierCurveTo(-28, -30, -4, -28, 0, -16); c.bezierCurveTo(4, -28, 28, -30, 26, -8); c.lineTo(26, 28); c.closePath(); }, "#fff4c9", 3);
});
const drumstick = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => {
  line(c, [[14, -10], [50, -40]], 18, INK); line(c, [[14, -10], [50, -40]], 10, WHITE);
  shape(c, () => ell(c, 54, -44, 10, 10), WHITE, 4); shape(c, () => ell(c, 60, -34, 10, 10), WHITE, 4);
  shape(c, () => ell(c, -10, 10, 40, 30, -0.6), COL.brown);
});
const leafIc = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => leaf(c, -36, 28, 80, -0.7));
const both = (c: Ctx, x: number, y: number, s: number) => { leafIc(c, x - 26, y, s * 0.7); drumstick(c, x + 30, y + 4, s * 0.7); };
const fur = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => { for (let i = 0; i < 5; i++) line(c, [[-40 + i * 20, 30], [-44 + i * 20, 0], [-34 + i * 20, -30]], 7, COL.brown); });
const feather = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => { shape(c, () => ell(c, 0, 0, 18, 44, 0.5), COL.sky, 4); line(c, [[-22, 38], [22, -38]], 3); });
const scales = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => { for (const [sx, sy] of [[-24, -12], [0, -12], [24, -12], [-12, 10], [12, 10]]) shape(c, () => { c.arc(sx, sy, 14, 0, Math.PI); c.closePath(); }, COL.blue, 4); });
const shell = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => { shape(c, () => ell(c, 0, 0, 34, 30), COL.wood); c.beginPath(); for (let t = 0; t < 10; t += 0.1) c.lineTo(Math.cos(t) * t * 3, Math.sin(t) * t * 2.7); c.strokeStyle = COL.woodDk; c.lineWidth = 4; c.stroke(); });
const skinIc = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => shape(c, () => ell(c, 0, 0, 36, 28), SKIN.child));
const legsIc = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => { for (const k of [-12, 12]) line(c, [[k, -30], [k, 24], [k + 14, 28]], 7); });
const beakIc = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => { shape(c, () => polyP(c, [[-30, -16], [34, 0], [-30, 4]]), COL.yellow, 4); shape(c, () => polyP(c, [[-30, 4], [34, 0], [-30, 20]]), COL.orange, 4); });
const wingFar = (c: Ctx, x: number, y: number, s: number) => at(c, x, y, s, () => { shape(c, () => { c.moveTo(-40, 10); c.quadraticCurveTo(-20, -30, 20, -16); c.quadraticCurveTo(0, 6, -40, 10); c.closePath(); }, COL.black, 4); arrow(c, [[-10, 24], [44, 24]], RED, 5); });

// a white card lying flat with one animal on it; a paper slip with a feature sign
const card = (c: Ctx, x: number, y: number, ic: Icon, s = 1, label?: number) => {
  shadow(c, x + 6 * s, y + 8 * s, 70 * s, 85 * s);
  shape(c, () => rrect(c, x - 70 * s, y - 90 * s, 140 * s, 180 * s, 12 * s), WHITE, 5);
  ic(c, x, y + 6 * s, s * 0.72);
  if (label !== undefined) write(c, String(label), x - 12 * s, y + 46 * s, 36 * s, INK, 4);
};
const slip = (c: Ctx, x: number, y: number, ic: Icon, s = 1) => { shadow(c, x + 5, y + 6, 70 * s, 36 * s); shape(c, () => rrect(c, x - 70 * s, y - 40 * s, 140 * s, 80 * s, 8), WHITE, 5); ic(c, x, y, s * 0.6); };
// a plate on the floor with a sign tag above it and cards on it
const sortPlate = (c: Ctx, x: number, y: number, rx: number, tag: Icon, items: Icon[], s = 0.56, tagNum?: number) => {
  plate(c, x, y, rx, rx * 0.46);
  const step = Math.min(150 * s * 1.1, (rx * 1.6) / items.length);
  items.forEach((ic, i) => card(c, x - ((items.length - 1) * step) / 2 + i * step, y, ic, s));
  shape(c, () => rrect(c, x - 56, y - rx * 0.46 - 96, 112, 72, 8), COL.paper, 5);
  if (tagNum !== undefined) write(c, String(tagNum), x - 14, y - rx * 0.46 - 84, 48, INK, 6); else tag(c, x, y - rx * 0.46 - 60, 0.6);
};
const hoops = (c: Ctx) => {
  const L = () => ell(c, 400, 580, 300, 250), R = () => ell(c, 680, 580, 300, 250);
  shape(c, L, COL.teal); shade(c, L, COL.tealDk, 24, 10, 0.35);
  shape(c, R, COL.pink); shade(c, R, "#d96f90", 24, 10, 0.35);
  c.save(); c.beginPath(); L(); c.clip(); shape(c, R, "#c89bc0", 0); c.restore();
  c.beginPath(); L(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); c.beginPath(); R(); c.stroke();
};
const grid = (c: Ctx, filled: boolean) => {
  // a chart sheet 900 x 900 with its top left at (0, 0): 4 columns, a header row and 6 rows
  shape(c, () => rrect(c, 0, 0, 900, 900, 10), COL.paper, 6);
  const cols = [0, 240, 480, 690, 900], rowH = 115, top = 95;
  for (const x of cols.slice(1, -1)) line(c, [[x, 0], [x, 900]], 4);
  for (let r = 0; r <= 6; r++) line(c, [[0, top + r * rowH], [900, top + r * rowH]], r ? 3 : 5);
  const mid = (i: number) => (cols[i] + cols[i + 1]) / 2;
  crow(c, mid(0), 50, 0.42); fur(c, mid(1), 48, 0.6); legsIc(c, mid(2), 48, 0.7);
  shape(c, () => rrect(c, mid(3) - 30, 20, 30, 56, 4), COL.green, 3); shape(c, () => rrect(c, mid(3), 20, 30, 56, 4), COL.red, 3);
  if (!filled) return;
  const rows: [Icon, Icon, number, string[]][] = [
    [kid, skinIc, 2, [COL.green, COL.red]], [crow, feather, 2, [COL.green, COL.red]], [ant, shell, 6, [COL.green, COL.red]],
    [gecko, scales, 4, [COL.red]], [pigeon, feather, 2, [COL.green]], [fly, shell, 6, [COL.green, COL.red]],
  ];
  rows.forEach(([an, cov, legs, food], r) => {
    const y = top + r * rowH + rowH / 2;
    an(c, mid(0), y, 0.6); cov(c, mid(1), y, 0.7); write(c, String(legs), mid(2) - 20, y - 26, 52, INK, 6);
    if (food.length === 1) shape(c, () => rrect(c, mid(3) - 42, y - 32, 84, 64, 6), food[0], 4);
    else { shape(c, () => rrect(c, mid(3) - 42, y - 32, 42, 64, 6), food[0], 4); shape(c, () => rrect(c, mid(3), y - 32, 42, 64, 6), food[1], 4); }
  });
};
const antLine = (c: Ctx, x0: number, y: number, n: number, s: number, gap: number) => { for (let i = 0; i < n; i++) ant(c, x0 + i * gap, y + Math.sin(i * 1.7) * 6, s); };
const clock = (c: Ctx, x: number, y: number, r: number, minute: number) => {
  shadow(c, x + 8, y + 10, r, r);
  shape(c, () => ell(c, x, y, r, r), WHITE, 7);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.82, y + Math.sin(a) * r * 0.82], [x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9]], 4); }
  write(c, "12", x - 20, y - r * 0.78, 30, INK, 4); write(c, "6", x - 10, y + r * 0.46, 30, INK, 4); write(c, "3", x + r * 0.5, y - 14, 30, INK, 4); write(c, "9", x - r * 0.72, y - 14, 30, INK, 4);
  const a = (minute / 60) * Math.PI * 2 - Math.PI / 2;
  line(c, [[x, y], [x + Math.cos(-Math.PI / 2 + 0.1) * r * 0.45, y + Math.sin(-Math.PI / 2 + 0.1) * r * 0.45]], 7);
  line(c, [[x, y], [x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7]], 6, RED);
  shape(c, () => ell(c, x, y, 7, 7), INK, 0);
};

// ---------------------------------------------------------------- set-up cards
// e1.0: a line of ants along the back edge of the kitchen counter
const e1s0 = (c: Ctx) => { kitchen(c); antLine(c, 110, 520, 6, 1.7, 175); arrow(c, [[340, 660], [740, 660]]); };
// e1.1: a white paper with banana, rice and a dead mosquito a hand apart; the ants to the left
const e1s1 = (c: Ctx) => {
  kitchen(c);
  shadow(c, 640, 740, 380, 20);
  shape(c, () => polyP(c, [[300, 470], [940, 470], [1020, 730], [220, 730]]), WHITE, 5);
  banana(c, 420, 600, 1.7); rice(c, 640, 600, 1.7); mosquito(c, 870, 600, 1.7);
  antLine(c, 60, 560, 2, 1.1, 90); arrow(c, [[150, 640], [230, 640]], RED, 7);
};
// e1.2: the child counts the ants on each food with a magnifying glass; the clock shows 5 and 10 minutes
const e1s2 = (c: Ctx) => {
  kitchen(c);
  clock(c, 860, 200, 95, 10);
  write(c, "5", 640, 120, 60, RED, 7); write(c, "10", 640, 220, 60, RED, 7);
  shape(c, () => polyP(c, [[470, 470], [1040, 470], [1070, 730], [400, 730]]), WHITE, 5);
  banana(c, 600, 600, 1); for (const [ax, ay] of [[520, 640], [560, 540], [680, 640], [650, 530]]) ant(c, ax, ay, 0.55);
  mosquito(c, 900, 610, 1); for (const [ax, ay] of [[830, 660], [960, 660], [850, 560]]) ant(c, ax, ay, 0.55);
  person(c, 240, 1060, 640, { armR: [-0.15, -0.55], armL: [Math.PI * 0.6, Math.PI * 0.5] });
  line(c, [[480, 560], [545, 590]], 22, INK); line(c, [[480, 560], [545, 590]], 12, COL.brown);
  shape(c, () => ell(c, 620, 630, 118, 118), "rgba(214,236,250,0.5)", 12);
  at(c, 620, 630, 1.9, () => { ant(c, -30, 10, 0.6); ant(c, 36, -24, 0.6); });
  c.beginPath(); ell(c, 620, 630, 118, 118); c.strokeStyle = COL.glassEdge; c.lineWidth = 4; c.stroke();
};
// a1.0: cards sorted by covering onto five plates
const a1s0 = (c: Ctx) => {
  room(c);
  sortPlate(c, 185, 490, 175, fur, [cat, goat], 0.75); sortPlate(c, 540, 490, 175, feather, [hen, crow], 0.75); sortPlate(c, 895, 490, 175, scales, [fish, gecko], 0.75);
  sortPlate(c, 360, 870, 175, shell, [snail], 0.75); sortPlate(c, 720, 870, 175, skinIc, [frog, kid], 0.75);
};
// a1.1: by legs; the hen and the child both on the 2-legs plate
const a1s1 = (c: Ctx) => {
  room(c);
  sortPlate(c, 280, 480, 260, fur, [hen, kid, crow], 0.75, 2); sortPlate(c, 810, 480, 260, fur, [cat, gecko, frog, goat], 0.65, 4);
  sortPlate(c, 280, 860, 260, fur, [ant, fly], 0.75, 6); sortPlate(c, 810, 860, 260, fur, [fish, snail], 0.75, 0);
};
// a1.2: by food; leaf, drumstick, both
const a1s2 = (c: Ctx) => {
  room(c);
  sortPlate(c, 220, 470, 210, leafIc, [goat, snail], 0.75); sortPlate(c, 840, 470, 230, drumstick, [cat, gecko, frog], 0.7);
  sortPlate(c, 540, 860, 340, both, [hen, crow, ant, kid], 0.78);
};
// a2.0: two dupattas as overlapping hoops; crow card in one, hen card in the other
const a2s0 = (c: Ctx) => { room(c, 200); hoops(c); card(c, 250, 580, crow, 1); card(c, 830, 580, hen, 1); };
// a2.1: the slips placed: shared features in the middle, "flies far" on the crow side
const a2s1 = (c: Ctx) => {
  room(c, 200); hoops(c);
  card(c, 240, 480, crow, 0.8); card(c, 840, 480, hen, 0.8);
  slip(c, 540, 460, feather); slip(c, 540, 580, beakIc); slip(c, 540, 700, (cc, x, y, s) => { legsIc(cc, x + 28, y, s); write(cc, "2", x - 46, y - 24, 48, INK, 6); });
  slip(c, 260, 690, wingFar);
};
// a3.0: a crow on the balcony rail with a ball of rice; the child watches from behind the window
const a3s0 = (c: Ctx) => {
  ground(c, "#c9d6c4");
  c.fillStyle = COL.sky; c.fillRect(540, 0, 540, 1080);
  shape(c, () => rrect(c, 0, 60, 520, 1000, 12), COL.wood, 6);
  shape(c, () => rrect(c, 50, 110, 420, 900, 6), WALL, 5);
  person(c, 260, 980, 560, { armL: [Math.PI * 0.75, 0.2], armR: [Math.PI * 0.3, Math.PI * 0.85] });
  shape(c, () => rrect(c, 160, 800, 200, 130, 10), COL.paper, 5); line(c, [[190, 835], [330, 835]], 3); line(c, [[190, 865], [330, 865]], 3); line(c, [[190, 895], [290, 895]], 3);
  c.fillStyle = "rgba(214,236,250,0.35)"; c.fillRect(50, 110, 420, 900);
  line(c, [[50, 560], [470, 560]], 6); line(c, [[260, 110], [260, 1010]], 6);
  line(c, [[560, 640], [1080, 640]], 20, INK); line(c, [[560, 640], [1080, 640]], 10, COL.steel);
  for (const x of [620, 740, 860, 980]) { line(c, [[x, 650], [x, 1080]], 14, INK); line(c, [[x, 650], [x, 1080]], 6, COL.steel); }
  crow(c, 780, 560, 2);
  shadow(c, 1000, 630, 48, 12); shape(c, () => ell(c, 990, 596, 44, 38), WHITE, 5); rice(c, 990, 596, 0.5);
  arrow(c, [[880, 520], [950, 570]], RED, 8);
};
// a3.1: the notebook page: five days, the food seen, a leaf (plant food) or drumstick (animal food)
const a3s1 = (c: Ctx) => {
  room(c, 160);
  shadow(c, 560, 1000, 400, 24);
  shape(c, () => rrect(c, 140, 90, 800, 920, 14), COL.paper, 6);
  for (let i = 0; i < 9; i++) shape(c, () => ell(c, 190 + i * 88, 90, 14, 20), COL.steel, 4);
  const top = 180, rowH = 160; line(c, [[300, top], [300, top + 5 * rowH]], 4); line(c, [[660, top], [660, top + 5 * rowH]], 4);
  for (let r = 0; r <= 5; r++) line(c, [[160, top + r * rowH], [920, top + r * rowH]], 3);
  const days: [Icon, Icon][] = [[rice, leafIc], [banana, leafIc], [moth, drumstick], [bread, leafIc], [rice, leafIc]];
  days.forEach(([food, kind], r) => { const y = top + r * rowH + rowH / 2; write(c, String(r + 1), 205, y - 36, 72, INK, 7); food(c, 480, y, 1); kind(c, 790, y, 0.9); });
};
// p1.0: the empty grid with its 4 column signs
const p1s0 = (c: Ctx) => { room(c, 160); shadow(c, 560, 1010, 420, 24); at(c, 90, 90, 1, () => grid(c, false)); line(c, [[760, 1040], [1000, 860]], 22, INK); line(c, [[760, 1040], [1000, 860]], 12, COL.yellow); shape(c, () => polyP(c, [[752, 1048], [742, 1066], [766, 1058]]), INK, 0); };
// p1.1: the finished grid
const p1s1 = (c: Ctx) => { room(c, 160); shadow(c, 560, 1010, 420, 24); at(c, 90, 90, 1, () => grid(c, true)); };

// ---------------------------------------------------------------- activity pictures
// a1: the child sits on the floor sorting cards onto plates
const a1flow = (c: Ctx) => {
  room(c, 240);
  person(c, 560, 700, 560, { sit: true, armL: [Math.PI * 0.7, Math.PI * 0.35], armR: [Math.PI * 0.25, Math.PI * 0.75] });
  card(c, 730, 560, hen, 0.6);
  sortPlate(c, 190, 900, 175, fur, [cat, goat], 0.65); sortPlate(c, 540, 930, 175, feather, [crow], 0.65); sortPlate(c, 890, 900, 175, scales, [fish, gecko], 0.65);
  arrow(c, [[720, 650], [600, 860]], RED, 8);
};
// a2: the child kneels at the hoops and puts a slip in the middle
const a2flow = (c: Ctx) => {
  room(c, 200);
  at(c, 180, 60, 0.85, () => hoops(c));
  card(c, 400, 480, crow, 0.75); card(c, 920, 480, hen, 0.75);
  slip(c, 640, 460, feather, 0.9); slip(c, 640, 580, beakIc, 0.9);
  person(c, 300, 1040, 540, { sit: true, armL: [Math.PI * 0.7, Math.PI * 0.45], armR: [-0.1, -0.3] });
  slip(c, 540, 820, legsIc, 0.9);
  arrow(c, [[560, 760], [630, 680]], RED, 8);
};
// p1: the grown-up and the child by the finished grid on the wall
const p1flow = (c: Ctx) => {
  room(c, 720);
  at(c, 300, 60, 0.6, () => grid(c, true));
  person(c, 170, 1040, 760, { adult: true, armR: [-0.3, -0.6], armL: [Math.PI * 0.6, Math.PI * 0.5] });
  person(c, 930, 1040, 580, { armL: [Math.PI * 1.2, Math.PI * 1.1], armR: [Math.PI * 0.45, Math.PI * 0.5] });
};

export const ic_classificationSortingLivingThingsL2 = cards("sci.classification.sorting-living-things.L2", [
  e1s0, e1s1, e1s2, a1s0, a1s1, a1s2, a2s0, a2s1, a3s0, a3s1, p1s0, p1s1, a1flow, a2flow, p1flow,
]);
