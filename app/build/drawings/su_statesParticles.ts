import type { Ctx } from "./core";
import { COL, INK, BG, WHITE, RED, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, hand, write, cards } from "./flatKit";

// SCIENCE UNIT sci.states.particles.L3 · set-up cards (7)

const TABLE = "#e6d6b8";
const table = (c: Ctx, y: number) => { c.fillStyle = TABLE; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 6); };

// a plastic bottle of water standing with its bottom centre at (x, yb)
const bottle = (c: Ctx, x: number, yb: number, w: number, h: number, fill = 0.75, sh = true) => {
  const nw = w * 0.34, bh = h * 0.7, bt = yb - bh, sd = h * 0.12;
  if (sh) shadow(c, x + w * 0.12, yb + 6, w * 0.6, w * 0.12);
  const p = () => {
    c.moveTo(x - w / 2 + 14, yb); c.arcTo(x - w / 2, yb, x - w / 2, yb - 14, 14); c.lineTo(x - w / 2, bt + 20);
    c.quadraticCurveTo(x - w / 2, bt, x - nw / 2, bt - sd); c.lineTo(x - nw / 2, yb - h + 12); c.lineTo(x + nw / 2, yb - h + 12); c.lineTo(x + nw / 2, bt - sd);
    c.quadraticCurveTo(x + w / 2, bt, x + w / 2, bt + 20); c.lineTo(x + w / 2, yb - 14); c.arcTo(x + w / 2, yb, x + w / 2 - 14, yb, 14); c.closePath();
  };
  const ly = yb - bh * fill;
  c.save(); c.beginPath(); p(); c.clip(); c.fillStyle = COL.water; c.fillRect(x - w, ly, 2 * w, h); c.fillStyle = COL.drop; c.fillRect(x - w, ly, 2 * w, 8); c.restore();
  shape(c, p, COL.glass, 5);
  shine(c, [[x - w * 0.28, bt + 30], [x - w * 0.28, yb - 24]], 7);
  shape(c, () => rrect(c, x - nw / 2 - 5, yb - h, nw + 10, 28, 8), COL.teal, 5);
};

// a carrier bag hanging by its handles from (x, hy); things poke out of the top
const bag = (c: Ctx, x: number, hy: number, top: number, w: number, h: number, items: () => void) => {
  line(c, [[x - w * 0.3, top + 8], [x, hy], [x + w * 0.3, top + 8]], 16, INK); line(c, [[x - w * 0.3, top + 8], [x, hy], [x + w * 0.3, top + 8]], 6, COL.pink);
  shape(c, () => rrect(c, x - w / 2, top, w, h, 14), "#c8627f");
  shape(c, () => ell(c, x, top, w / 2, 14), "#8a3d56", 5);
  items();
  shape(c, () => rrect(c, x - w / 2, top + 50, w, h - 50, 14), COL.pink);
  shade(c, () => rrect(c, x - w / 2, top + 50, w, h - 50, 14), "#c8627f", w * 0.12, 0, 0.5);
};
// a small paper packet; sugar = grains showing at the open top
const packet = (c: Ctx, x: number, yb: number, w: number, h: number, sugar: boolean) => {
  shape(c, () => rrect(c, x - w / 2, yb - h, w, h, 8), WHITE);
  line(c, [[x - w / 2 + 6, yb - h + 22], [x + w / 2 - 6, yb - h + 22]], 4);
  if (sugar) for (let i = 0; i < 7; i++) shape(c, () => ell(c, x - w * 0.36 + i * (w * 0.12), yb - h - 4 - (i % 2) * 6, 6, 5), WHITE, 2.5);
  else shape(c, () => polyP(c, [[x - w / 2, yb - h], [x + w / 2, yb - h], [x + w / 2 - 6, yb - h - 12], [x - w / 2 + 6, yb - h - 12]]), "#ece4d0", 4);
};

// the door, handle, hanger, straw and paper line, then the two bags (A on the left, B on the right)
const hanger = (c: Ctx, itemsA: () => void, itemsB: () => void) => {
  ground(c);
  shape(c, () => rrect(c, 350, -20, 380, 1120, 6), COL.wood, 6);
  shade(c, () => rrect(c, 350, -20, 380, 1120, 6), COL.woodDk, 60, 0, 0.45);
  shape(c, () => ell(c, 460, 135, 38, 38), COL.steel); shape(c, () => rrect(c, 460, 118, 230, 34, 16), COL.steel);
  // the paper with its line, taped to the door
  shape(c, () => rrect(c, 410, 740, 260, 240, 6), WHITE);
  line(c, [[540, 765], [540, 955]], 8);
  // hanger: hook, triangle, bar
  line(c, [[540, 215], [540, 110], [556, 90], [586, 98], [590, 128]], 16, INK); line(c, [[540, 215], [540, 110], [556, 90], [586, 98], [590, 128]], 6, COL.steelDk);
  line(c, [[540, 215], [170, 410], [910, 410], [540, 215]], 30, INK); line(c, [[540, 215], [170, 410], [910, 410], [540, 215]], 18, COL.blue);
  // straw taped to the middle of the bar, pointing straight down at the line
  shape(c, () => rrect(c, 531, 405, 18, 395, 6), COL.yellow, 5);
  shape(c, () => rrect(c, 510, 392, 60, 40, 6), "rgba(255,255,255,0.8)", 4);
  bag(c, 230, 410, 590, 200, 170, itemsA);
  bag(c, 850, 410, 590, 200, 170, itemsB);
};

// setup.e1.0
const e1_0 = (c: Ctx) => hanger(c, () => {}, () => {});
// setup.e1.1
const e1_1 = (c: Ctx) => hanger(c, () => { bottle(c, 190, 755, 92, 300, 0.75, false); packet(c, 280, 755, 66, 170, true); }, () => bottle(c, 850, 755, 92, 300, 0.75, false));
// setup.e1.3
const e1_3 = (c: Ctx) => hanger(c, () => { bottle(c, 190, 755, 92, 300, 0.75, false); packet(c, 280, 755, 66, 170, false); }, () => bottle(c, 850, 755, 92, 300, 0.75, false));

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c); table(c, 800);
  // paper funnel lying on the table
  shadow(c, 800, 905, 190, 28);
  c.save(); c.translate(790, 850); c.rotate(-0.08);
  shape(c, () => rrect(c, 40, -16, 120, 32, 10), "#ece4d0", 5);
  shape(c, () => polyP(c, [[-100, -80], [50, -16], [50, 16], [-100, 80]]), WHITE);
  shade(c, () => polyP(c, [[-100, -80], [50, -16], [50, 16], [-100, 80]]), "#ece4d0", 0, 30, 0.7);
  shape(c, () => ell(c, -100, 0, 26, 80), "#c9c0aa");
  c.restore();
  // the shaken bottle in a hand
  const G: [number, number] = [520, 440], an = 0.3;
  c.save(); c.translate(G[0], G[1]); c.rotate(an);
  bottle(c, 0, 210, 170, 420, 0.7, false);
  const rr = (n: number) => ((n * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 16; i++) { const a = i * 2.4, r = 20 + i * 4; shape(c, () => ell(c, Math.cos(a) * r * 0.9, 60 + Math.sin(a) * r * 0.9 + (rr(i) - 0.5) * 40, 8, 7), WHITE, 2.5); }
  c.restore();
  hand(c, G[0] - 126 * Math.cos(an), G[1] - 126 * Math.sin(an), an, 1.8);
  for (const s of [-1, 1]) { line(c, [[G[0] + s * 170 - 20, 190], [G[0] + s * 190 - 20, 240]], 7); line(c, [[G[0] + s * 170 - 10, 640], [G[0] + s * 190 - 10, 690]], 7); }
};

// the kalkandu lump: angular, white-yellow
const lump = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  const P = [[-1, -0.4], [-0.4, -1], [0.6, -0.8], [1, 0], [0.5, 0.8], [-0.6, 0.7]].map(([u, v]) => [x + (u * Math.cos(rot) - v * Math.sin(rot)) * s, y + (u * Math.sin(rot) + v * Math.cos(rot)) * s]);
  shape(c, () => polyP(c, P), "#f6ead0", 5); shade(c, () => polyP(c, P), "#e0cfa4", s * 0.4, s * 0.3, 0.7);
};
const heapOf = (c: Ctx, x: number, y: number, r: number, kind: number) => {
  const m = () => { c.moveTo(x - r * 0.85, y + 4); c.quadraticCurveTo(x, y - r * 0.9, x + r * 0.85, y + 4); c.closePath(); };
  if (kind === 0) { shape(c, m, "#f6ead0", 0); lump(c, x - 40, y - 6, 30, 0.3); lump(c, x + 38, y - 4, 32, 1.1); lump(c, x, y - 36, 34, 0.7); }
  else if (kind === 1) { shape(c, m, WHITE, 5); for (let i = 0; i < 26; i++) { const t = (i % 9) / 8, u = Math.floor(i / 9); shape(c, () => ell(c, x - r * 0.6 + t * r * 1.2, y - 6 - Math.sin(t * Math.PI) * (r * 0.4 - u * 20) + u * 14, 7, 6), WHITE, 2.5); } }
  else { shape(c, m, WHITE, 5); shade(c, m, "#e3e0d8", r * 0.3, 0, 0.8); }
};
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  [0, 1, 2].forEach((k) => { const x = 215 + k * 325; bowl(c, x, 250, 125); heapOf(c, x, 250, 125, k); c.beginPath(); c.ellipse(x, 250, 125, 25, 0, 0.02, Math.PI - 0.02); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); });
  // paper folded over sugar, the rolling pin on it
  shadow(c, 510, 905, 290, 36);
  shape(c, () => rrect(c, 240, 620, 540, 270, 8), WHITE); line(c, [[240, 755], [780, 755]], 3, COL.grey);
  shadow(c, 520, 800, 220, 16);
  shape(c, () => rrect(c, 250, 725, 90, 34, 14), COL.woodDk); shape(c, () => rrect(c, 680, 725, 90, 34, 14), COL.woodDk);
  shape(c, () => rrect(c, 330, 690, 360, 100, 30), COL.wood); shade(c, () => rrect(c, 330, 690, 360, 100, 30), COL.woodDk, 0, 36, 0.8);
  const an = 1.9;
  hand(c, 520 + 0.323 * 90, 700 - 0.946 * 90, an, 1.5, SKIN.child, CLOTH.child, true);
  arrow(c, [[380, 835], [640, 835]], RED, 12);
};

const phone = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, y + h / 2 + 8, w * 0.6, 14);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 20), "#3a3540"); shape(c, () => rrect(c, x - w / 2 + 9, y - h / 2 + 14, w - 18, h - 28, 12), "#22303a", 3);
  const cy = y - 4, r = w * 0.3;
  c.beginPath(); c.arc(x, cy, r, 0, Math.PI * 2); c.strokeStyle = "#c9f06b"; c.lineWidth = 9; c.stroke();
  c.beginPath(); c.moveTo(x, cy); c.arc(x, cy, r - 6, -Math.PI / 2, 0.4); c.closePath(); c.fillStyle = RED; c.fill();
  line(c, [[x, cy], [x, cy - r + 10]], 5, WHITE);
};
const spoon = (c: Ctx, x1: number, y1: number, x2: number, y2: number) => {
  line(c, [[x1, y1], [x2, y2]], 20, INK); line(c, [[x1, y1], [x2, y2]], 9, COL.steel);
  const an = Math.atan2(y2 - y1, x2 - x1);
  shape(c, () => ell(c, x2 + Math.cos(an) * 38, y2 + Math.sin(an) * 38, 52, 34, an), COL.steel);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c); table(c, 560);
  [0, 1, 2].forEach((k) => {
    const x = 250 + k * 290;
    glass(c, x, 540, 200, 300, 0.8);
    shape(c, () => rrect(c, x - 60, 610, 120, 110, 12), WHITE); write(c, String(k + 1), x - 18, 630, 70, INK, 9);
  });
  spoon(c, 90, 880, 260, 850);
  shape(c, () => ell(c, 335, 840, 40, 12), WHITE, 0);
  phone(c, 830, 870, 150, 230);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c); table(c, 720);
  glass(c, 310, 720, 250, 400, 0.7);
  glass(c, 810, 720, 250, 400, 0.7);
  // the lump sits at the bottom of the right glass
  shape(c, () => rrect(c, 765, 668, 90, 46, 22), "#f6ead0", 5); shape(c, () => rrect(c, 845, 685, 40, 28, 12), "#f6ead0", 4);
  // the spoon, stirred by a hand
  spoon(c, 440, 190, 290, 660);
  const gx = 427, gy = 230, an = 0.31, s = 1.5;
  hand(c, gx - 70 * s * Math.cos(an), gy - 70 * s * Math.sin(an), an, s);
  const pts: number[][] = []; for (let a = 2.9; a > 0.3; a -= 0.15) pts.push([310 + 105 * Math.cos(a), 450 + 28 * Math.sin(a)]);
  arrow(c, pts, RED, 10);
  phone(c, 560, 900, 130, 200);
};

export const su_statesParticles = cards("sci.states.particles.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2]);
