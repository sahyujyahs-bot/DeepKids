import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, leaf, write, cards } from "./flatKit";

// ANIMALS AROUND US · set-up cards for sci.animals.animals-around-us.L3 (birds at a water bowl, soil
// temperature, ants and a trail). Same bowl, notebook, probe thermometer and ants on every card.

const SUN = "#ffc83a", SUNDK = "#f39a3c", CLAY = "#cf6b3d", CLAYDK = "#a64f28", PEN = COL.blueDk;

// ---------------------------------------------------------------- shared pieces
// a sun: disc with short rays
const sun = (c: Ctx, x: number, y: number, r: number, col = SUN, rays = true) => {
  if (rays) for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6, p = [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.7, y + Math.sin(a) * r * 1.7]]; line(c, p, r * 0.2, INK); line(c, p, r * 0.1, col); }
  shape(c, () => ell(c, x, y, r, r), col, 6);
  shade(c, () => ell(c, x, y, r, r), SUNDK, r * 0.25, r * 0.25, 0.5);
};
// a clay bowl of water, rim centre (x, y), rim radius r
const clayBowl = (c: Ctx, x: number, y: number, r: number) => {
  const body = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.9, y + r * 0.75, x + r * 0.9, y + r * 0.75, x + r, y); c.closePath(); };
  shadow(c, x + r * 0.15, y + r * 0.56, r * 0.85, r * 0.1);
  shape(c, body, CLAY);
  shade(c, body, CLAYDK, r * 0.35, -r * 0.05, 0.6);
  shape(c, () => ell(c, x, y, r, r * 0.21), CLAYDK, 6);
  shape(c, () => ell(c, x, y + 3, r * 0.9, r * 0.16), COL.water, 4);
  c.beginPath(); ell(c, x - r * 0.3, y, r * 0.3, r * 0.04); c.fillStyle = COL.drop; c.fill();
};
// a notebook page lying flat; draw on it inside the callback in the page's own coordinates (centre 0,0)
const notebook = (c: Ctx, x: number, y: number, w: number, h: number, rot: number, inside?: () => void) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  c.beginPath(); rrect(c, -w / 2 + 14, -h / 2 + 18, w, h, 16); c.fillStyle = "rgba(43,35,64,0.16)"; c.fill();
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 16), COL.paper);
  for (let yy = -h / 2 + 90; yy < h / 2 - 20; yy += 46) line(c, [[-w / 2 + 20, yy], [w / 2 - 20, yy]], 3, COL.sky);
  for (let xx = -w / 2 + 40; xx < w / 2 - 20; xx += 56) { shape(c, () => rrect(c, xx - 7, -h / 2 - 14, 14, 40, 7), COL.steelDk, 4); }
  if (inside) inside();
  c.restore();
};
// tally marks: n strokes, every fifth crossing the four before it. Returns the width used.
const tally = (c: Ctx, x: number, y: number, n: number, h: number) => {
  const sp = h * 0.36; let cx = x, left = n;
  while (left > 0) {
    const k = Math.min(left, 5), v = Math.min(k, 4);
    for (let i = 0; i < v; i++) line(c, [[cx + i * sp, y], [cx + i * sp, y + h]], 9, PEN);
    if (k === 5) line(c, [[cx - sp * 0.5, y + h * 0.8], [cx + 3 * sp + sp * 0.5, y + h * 0.2]], 9, PEN);
    cx += 3 * sp + sp * 1.2; left -= k;
  }
  return cx - x;
};
// a bird in side view facing right (dir -1 faces left), feet at (x, y)
const bird = (c: Ctx, x: number, y: number, s: number, kind: "myna" | "bulbul", dir: number) => {
  const M = kind === "myna", body = M ? "#7a5236" : "#9a8366", bodyDk = M ? "#573823" : "#74604a";
  c.save(); c.translate(x, y); c.scale(s * dir, s);
  for (const lx of [-14, 12]) { line(c, [[lx, -34], [lx - 2, 0]], 9, INK); line(c, [[lx, -34], [lx - 2, 0]], 4, "#e8a53a"); line(c, [[lx - 14, 0], [lx + 8, 0]], 9, INK); line(c, [[lx - 14, 0], [lx + 8, 0]], 4, "#e8a53a"); }
  shape(c, () => polyP(c, [[-50, -84], [-150, -38], [-138, -76], [-58, -112]]), bodyDk, 5);
  const bd = () => ell(c, 0, -92, 68, 46, -0.25);
  shape(c, bd, body, 6);
  if (!M) { c.save(); c.beginPath(); bd(); c.clip(); c.beginPath(); ell(c, 22, -62, 56, 26, -0.25); c.fillStyle = "#f5efe2"; c.fill(); c.restore(); }
  shade(c, bd, bodyDk, 10, 12, 0.45);
  shape(c, () => ell(c, -10, -98, 44, 22, -0.3), bodyDk, 5);
  if (M) shape(c, () => ell(c, 10, -104, 16, 7, -0.3), WHITE, 3);
  shape(c, () => ell(c, 52, -142, 34, 32), INK, 6);
  if (M) shape(c, () => ell(c, 50, -140, 20, 16), "#ffd34d", 0);
  else { shape(c, () => polyP(c, [[30, -166], [40, -208], [64, -168]]), INK, 5); shape(c, () => ell(c, 46, -132, 10, 8), COL.red, 3); }
  shape(c, () => polyP(c, [[78, -150], [116, -138], [78, -132]]), M ? "#f2b630" : INK, 5);
  shape(c, () => ell(c, 62, -148, 8, 8), WHITE, 3); shape(c, () => ell(c, 64, -148, 3.5, 3.5), INK, 0);
  c.restore();
};
// a table clock showing 7 o'clock
const clock = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.12, y + r * 1.02, r * 0.9, r * 0.12);
  for (const s of [-1, 1]) { line(c, [[x + s * r * 0.6, y + r * 0.8], [x + s * r * 0.8, y + r * 1.02]], 16, INK); line(c, [[x + s * r * 0.6, y + r * 0.8], [x + s * r * 0.8, y + r * 1.02]], 7, COL.tealDk); shape(c, () => ell(c, x + s * r * 0.62, y - r * 0.92, r * 0.22, r * 0.2), COL.yellow, 5); }
  shape(c, () => ell(c, x, y, r, r), COL.teal);
  shade(c, () => ell(c, x, y, r, r), COL.tealDk, r * 0.12, r * 0.12, 0.6);
  shape(c, () => ell(c, x, y, r * 0.82, r * 0.82), WHITE, 5);
  for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 0.64, y + Math.sin(a) * r * 0.64], [x + Math.cos(a) * r * 0.74, y + Math.sin(a) * r * 0.74]], k % 3 === 0 ? 9 : 5); }
  const ha = (Math.PI * 210) / 180 - Math.PI / 2;
  line(c, [[x, y], [x + Math.cos(ha) * r * 0.45, y + Math.sin(ha) * r * 0.45]], 15);
  line(c, [[x, y], [x, y - r * 0.68]], 10);
  shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), RED, 4);
};
// a pencil lying at an angle, tip at (x, y)
const pencil = (c: Ctx, x: number, y: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => polyP(c, [[0, 0], [50, -14], [50, 14]]), "#f1d3a4", 5);
  shape(c, () => polyP(c, [[0, 0], [14, -4], [14, 4]]), INK, 2);
  shape(c, () => rrect(c, 50, -14, 200, 28, 4), COL.yellow, 5);
  shape(c, () => rrect(c, 250, -14, 26, 28, 4), COL.pink, 5);
  c.restore();
};

// the digital probe thermometer: tip at (tx, ty), tilted ang from straight up, steel stem length L, then the handle with its screen
const probe = (c: Ctx, tx: number, ty: number, ang: number, L: number, reading: string) => {
  c.save(); c.translate(tx, ty); c.rotate(ang);
  shape(c, () => polyP(c, [[-10, -L], [10, -L], [10, -16], [0, 0], [-10, -16]]), COL.steel, 5);
  line(c, [[4, -L + 8], [4, -18]], 6, COL.steelDk);
  const hd = () => rrect(c, -56, -L - 240, 112, 240, 28);
  shape(c, hd, COL.teal, 6); shade(c, hd, COL.tealDk, 20, 0, 0.6);
  shape(c, () => rrect(c, -44, -L - 222, 88, 74, 10), "#22303a", 5);
  write(c, reading, -36, -L - 208, 40, "#c9f06b", 7);
  shape(c, () => ell(c, 0, -L - 100, 16, 16), COL.orange, 5);
  c.restore();
};
// a phone lying flat showing the timer 5:00
const phone = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 14, y + 90, 150, 24);
  shape(c, () => rrect(c, x - 150, y - 80, 300, 160, 26), COL.black, 6);
  shape(c, () => rrect(c, x - 134, y - 64, 268, 128, 14), "#22303a", 4);
  write(c, "5", x - 92, y - 34, 64, "#c9f06b", 9);
  for (const dy of [0.3, 0.7]) shape(c, () => ell(c, x - 22, y - 34 + 64 * dy, 7, 7), "#c9f06b", 0);
  write(c, "00", x + 4, y - 34, 64, "#c9f06b", 9);
};

// ---------------------------------------------------------------- the child at the window
const childBust = (c: Ctx, x: number, y: number) => {
  const hd = 88;
  shape(c, () => rrect(c, x - 135, y + 95, 270, 450, 70), CLOTH.child);
  shade(c, () => rrect(c, x - 135, y + 95, 270, 450, 70), CLOTH.childDk, 26, 0, 0.55);
  shape(c, () => rrect(c, x - 26, y + 70, 52, 60, 12), SKIN.child, 5);
  shape(c, () => ell(c, x, y, hd, hd * 1.04), SKIN.child);
  shade(c, () => ell(c, x, y, hd, hd * 1.04), SKIN.childDk, 14, 10, 0.5);
  shape(c, () => { c.moveTo(x - hd * 1.02, y); c.bezierCurveTo(x - hd, y - hd * 1.5, x + hd, y - hd * 1.5, x + hd * 1.02, y); c.quadraticCurveTo(x, y - hd * 0.55, x - hd * 1.02, y); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x + hd * 0.95, y - hd * 0.2, hd * 0.32, hd * 0.55), CLOTH.hair, 4);
  // looking left, towards the bowl
  for (const ex of [-0.62, 0.08]) shape(c, () => ell(c, x + hd * ex, y + hd * 0.12, hd * 0.09, hd * 0.12), INK, 0);
  c.beginPath(); c.arc(x - hd * 0.25, y + hd * 0.4, hd * 0.26, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};

// ---------------------------------------------------------------- ants and the kitchen floor
const trailX = (y: number) => 540 + 34 * Math.sin(y / 90);
const trailAn = (y: number) => Math.atan2(1, (34 / 90) * Math.cos(y / 90));
// an ant pointing right (+x) at rotation rot
const ant = (c: Ctx, x: number, y: number, rot: number, s: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  for (const i of [-8, 4, 16]) for (const d of [-1, 1]) line(c, [[i, 0], [i + 12, d * 22], [i + 2, d * 36]], 6, INK);
  for (const d of [-1, 1]) line(c, [[34, d * 6], [58, d * 22], [74, d * 14]], 5, INK);
  const col = "#4b4458";
  shape(c, () => ell(c, -38, 0, 30, 20), col, 5); shape(c, () => ell(c, 0, 0, 17, 12), col, 5); shape(c, () => ell(c, 32, 0, 17, 15), col, 5);
  c.beginPath(); ell(c, -44, -7, 12, 5); c.fillStyle = "rgba(255,255,255,0.45)"; c.fill();
  c.restore();
};
// the kitchen floor: tiles, the cupboard at the top with a dark gap under it
const floor = (c: Ctx) => {
  ground(c, "#e0d4bb");
  for (let ty = 0; ty < 5; ty++) for (let tx = 0; tx < 5; tx++) { const x = -20 + tx * 260, y = 120 + ty * 260; shape(c, () => rrect(c, x + 6, y + 6, 248, 248, 8), (tx + ty) % 2 ? "#e8dcc4" : "#ddd0b4", 0); }
  shape(c, () => rrect(c, -20, -40, 1120, 210, 0), COL.brown, 6);
  shade(c, () => rrect(c, -20, -40, 1120, 210, 0), "#7d4f27", 0, 40, 0.5);
  shape(c, () => rrect(c, 380, 150, 320, 62, 20), INK, 5);
};
// a small paper square with a pinch of sugar on it
const sugarPaper = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 20, y + 100, 150, 24);
  shape(c, () => polyP(c, [[x - 125, y - 105], [x + 120, y - 112], [x + 128, y + 110], [x - 118, y + 105]]), COL.pink);
  const r = rnd(5);
  for (let i = 0; i < 34; i++) { const t = r() * Math.PI * 2, d = Math.sqrt(r()) * 78; shape(c, () => ell(c, x + Math.cos(t) * d, y + 20 + Math.sin(t) * d * 0.55 - (78 - d) * 0.35, 11, 11), WHITE, 3); }
};
// a pointing hand: wrist at (x, y), pointing at angle an, index finger straight out, others curled
const pointer = (c: Ctx, x: number, y: number, an: number, s: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -78, -36, 56, 72, 14), CLOTH.child, 6);
  shape(c, () => { c.moveTo(-26, -32); c.quadraticCurveTo(20, -42, 46, -30); c.lineTo(52, 30); c.quadraticCurveTo(10, 40, -26, 32); c.closePath(); }, SKIN.child, 6);
  for (let k = 1; k < 4; k++) shape(c, () => rrect(c, 38, -30 + k * 17, 40, 17, 8.5), SKIN.child, 5);
  shape(c, () => rrect(c, 34, -30, 150, 17, 8.5), SKIN.child, 5);
  shape(c, () => { c.moveTo(-4, -30); c.quadraticCurveTo(22, -60, 52, -50); c.quadraticCurveTo(64, -44, 50, -34); c.quadraticCurveTo(26, -32, 12, -18); c.closePath(); }, SKIN.child, 5);
  c.restore();
};
// the pointing hand placed so its fingertip is at (tx, ty)
const pointAt = (c: Ctx, tx: number, ty: number, an: number, s: number) => {
  const lx = 182 * s, ly = -22 * s;
  pointer(c, tx - (lx * Math.cos(an) - ly * Math.sin(an)), ty - (lx * Math.sin(an) + ly * Math.cos(an)), an, s);
};

// ================================================================ cards
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 50, 50, 980, 980, 24), COL.brown);
  shape(c, () => rect(c, 105, 105, 870, 800), COL.sky, 6);
  shine(c, [[170, 190], [330, 120]], 12); shine(c, [[200, 260], [280, 215]], 12);
  // the ledge outside
  shape(c, () => rect(c, 105, 830, 870, 75), COL.grey, 5);
  c.fillStyle = COL.cloth; c.fillRect(108, 833, 864, 16);
  clayBowl(c, 460, 732, 170);
  childBust(c, 800, 330);
  // the notebook in his hand
  notebook(c, 790, 650, 190, 250, 0.05);
  hand(c, 700, 660, 0, 0.85);
  line(c, [[690, 520], [670, 650]], 66, INK); line(c, [[690, 520], [670, 650]], 52, CLOTH.child);
  // the curtain
  const cur = () => { c.moveTo(105, 105); c.lineTo(285, 105); c.bezierCurveTo(270, 300, 300, 600, 275, 905); c.lineTo(105, 905); c.closePath(); };
  shape(c, cur, COL.pink, 6);
  c.save(); c.beginPath(); cur(); c.clip();
  for (let x = 150; x < 300; x += 55) line(c, [[x, 105], [x + 8, 905]], 14, "#d9789a");
  c.restore();
  line(c, [[90, 118], [310, 118]], 14);
  // the sill inside
  shape(c, () => rrect(c, 30, 880, 1020, 120, 18), COL.wood);
  shade(c, () => rrect(c, 30, 880, 1020, 120, 18), COL.woodDk, 0, 40, 0.5);
};
const rect = (c: Ctx, x: number, y: number, w: number, h: number) => { c.moveTo(x, y); c.lineTo(x + w, y); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.closePath(); };

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  clayBowl(c, 340, 720, 270);
  bird(c, 215, 666, 1.0, "myna", 1);
  bird(c, 470, 672, 1.0, "bulbul", -1);
  clock(c, 810, 250, 150);
  notebook(c, 790, 760, 360, 420, -0.05, () => {
    tally(c, -120, -100, 5, 80);
    tally(c, -120, 40, 2, 80);
  });
  pencil(c, 640, 930, -0.35);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  notebook(c, 540, 550, 900, 940, 0, () => {
    const cols = [-280, 0, 280], rows = [[4, 3, 5], [2, 1, 3], [3, 4, 2]];
    cols.forEach((cx, ci) => {
      c.save(); c.beginPath(); rrect(c, cx - 125, -410, 250, 250, 20); c.clip();
      c.fillStyle = ["#ffd9b0", COL.sky, "#c9a5d6"][ci]; c.fillRect(cx - 130, -415, 260, 260);
      if (ci === 0) sun(c, cx - 60, -250, 52, "#ffb347");
      if (ci === 1) sun(c, cx, -330, 56, SUN);
      if (ci === 2) sun(c, cx + 60, -250, 52, "#ef6a3a");
      c.restore();
      shape(c, () => { c.moveTo(cx - 125, -250); c.quadraticCurveTo(cx, -280, cx + 125, -250); c.lineTo(cx + 125, -170); c.lineTo(cx - 125, -170); c.closePath(); }, COL.green, 0);
      c.save(); c.beginPath(); rrect(c, cx - 125, -410, 250, 250, 20); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); c.restore();
      rows.forEach((row, ri) => { const w = 150; tally(c, cx - w / 2 + 6, -90 + ri * 170, row[ci], 80); });
    });
    for (const x of [-140, 140]) line(c, [[x, -150], [x, 440]], 4, COL.steelDk);
  });
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c, "#fff0c2");
  sun(c, 190, 190, 90);
  shape(c, () => polyP(c, [[110, 700], [970, 700], [1030, 880], [50, 880]]), COL.soil);
  shape(c, () => polyP(c, [[50, 880], [1030, 880], [1030, 1030], [50, 1030]]), COL.soilDk);
  const r = rnd(3);
  for (let i = 0; i < 18; i++) shape(c, () => ell(c, 130 + r() * 800, 730 + r() * 130, 12 + r() * 10, 6 + r() * 5), COL.soilDk, 3);
  line(c, [[410, 808], [640, 838]], 26, "rgba(43,35,64,0.18)");
  phone(c, 810, 790);
  probe(c, 400, 812, 0, 150, "38°");
  shape(c, () => { c.moveTo(362, 800); c.quadraticCurveTo(400, 830, 440, 800); c.quadraticCurveTo(400, 812, 362, 800); c.closePath(); }, COL.soil, 4);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c, "#cfe0ea");
  c.fillStyle = "#c9b99a"; c.fillRect(0, 870, 1080, 210);
  c.beginPath(); ell(c, 500, 900, 470, 80); c.fillStyle = "rgba(43,35,64,0.22)"; c.fill();
  for (const [x, an, len] of [[60, 1.2, 250], [250, 1.5, 300], [440, 1.7, 250], [640, 1.45, 290], [850, 1.75, 260], [1010, 1.9, 240]] as number[][]) leaf(c, x, -20, len, an, COL.leafDk);
  for (const [x, an, len] of [[150, 1.35, 230], [350, 1.6, 240], [560, 1.55, 220], [760, 1.6, 230]] as number[][]) leaf(c, x, -20, len, an, COL.leaf);
  // the pot
  shape(c, () => { c.moveTo(280, 650); c.lineTo(720, 650); c.lineTo(670, 880); c.quadraticCurveTo(500, 905, 330, 880); c.closePath(); }, CLAY);
  shade(c, () => { c.moveTo(280, 650); c.lineTo(720, 650); c.lineTo(670, 880); c.quadraticCurveTo(500, 905, 330, 880); c.closePath(); }, CLAYDK, 70, 0, 0.55);
  shape(c, () => rrect(c, 258, 605, 484, 78, 16), CLAY);
  shade(c, () => rrect(c, 258, 605, 484, 78, 16), CLAYDK, 60, 0, 0.55);
  shape(c, () => ell(c, 500, 612, 222, 40), COL.soil, 5);
  // a seedling
  line(c, [[370, 612], [372, 530]], 12);
  line(c, [[370, 612], [372, 530]], 6, COL.green);
  leaf(c, 372, 540, 90, -2.5); leaf(c, 372, 540, 90, -0.6); leaf(c, 372, 575, 70, -2.9);
  phone(c, 850, 985);
  probe(c, 560, 630, 0, 120, "29°");
  shape(c, () => { c.moveTo(522, 618); c.quadraticCurveTo(560, 648, 600, 618); c.quadraticCurveTo(560, 630, 522, 618); c.closePath(); }, COL.soil, 4);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rect(c, 60, 450, 960, 560), COL.soil, 6);
  shade(c, () => rect(c, 60, 450, 960, 560), COL.soilDk, 0, 90, 0.5);
  const r = rnd(8);
  for (let i = 0; i < 16; i++) { const x = 90 + r() * 840; if (x > 420 && x < 650) continue; shape(c, () => ell(c, x, 520 + r() * 440, 12 + r() * 10, 7 + r() * 5), COL.soilDk, 3); }
  shape(c, () => rect(c, 60, 424, 960, 40), COL.green, 6);
  shape(c, () => polyP(c, [[450, 424], [620, 424], [610, 808], [460, 808]]), "#4a2c19", 6);
  // the leaf laid over the opening, covering it; the probe stands up beside it
  const lf = () => { c.moveTo(330, 428); c.quadraticCurveTo(440, 340, 560, 352); c.quadraticCurveTo(690, 360, 740, 432); c.quadraticCurveTo(540, 470, 330, 428); c.closePath(); };
  shape(c, lf, COL.leaf, 6);
  shade(c, lf, COL.leafDk, 0, 30, 0.45);
  line(c, [[350, 426], [560, 410], [725, 430]], 5, COL.leafDk);
  line(c, [[560, 410], [520, 372]], 4, COL.leafDk); line(c, [[560, 410], [630, 378]], 4, COL.leafDk);
  probe(c, 530, 790, 0.23, 400, "24°");
};

// setup.e3.0
const e3_0 = (c: Ctx) => {
  floor(c);
  sugarPaper(c, 540, 840);
  [260, 350, 440, 530, 620, 705].forEach((y) => ant(c, trailX(y), y, trailAn(y), 0.78));
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  floor(c);
  sugarPaper(c, 540, 880);
  // the finger's shadow lies on the floor below and apart from the finger: the finger is up in the air, not touching
  const tip = [520, 420], an = 2.85, bx = -Math.cos(an), by = -Math.sin(an);
  c.save(); c.translate(tip[0] + 20, tip[1] + 110); c.rotate(Math.atan2(by, bx)); line(c, [[0, 0], [250, 0]], 44, "rgba(43,35,64,0.2)"); c.beginPath(); ell(c, 330, 0, 90, 70); c.fillStyle = "rgba(43,35,64,0.2)"; c.fill(); c.restore();
  [270, 360, 450, 540, 630, 715].forEach((y) => ant(c, trailX(y), y, trailAn(y), 0.78));
  pointAt(c, tip[0], tip[1], an, 1.6);
  for (let k = 0; k < 3; k++) line(c, [[tip[0] + 3 + k * 7, tip[1] + 22 + k * 30], [tip[0] + 5 + k * 7, tip[1] + 36 + k * 30]], 6, INK);
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  floor(c);
  sugarPaper(c, 540, 880);
  // the rubbed strip across the trail: floor wiped clean and pale, no edge of an object
  c.beginPath(); c.moveTo(330, 575); c.quadraticCurveTo(540, 548, 750, 570); c.lineTo(748, 636); c.quadraticCurveTo(540, 650, 332, 632); c.closePath(); c.fillStyle = "#faf6ea"; c.fill();
  for (const [x1, x2, y] of [[360, 560, 586], [420, 700, 603], [380, 650, 620]]) line(c, [[x1, y], [x2, y]], 6, "#e2d8bf");
  // ants arrive and stop at the strip, none beyond it
  [[trailX(260), 260, trailAn(260)], [trailX(350), 350, trailAn(350)], [440, 470, 2.6], [650, 470, -0.6], [545, 505, 4.4], [470, 540, 3.4]].forEach(([x, y, a]) => ant(c, x, y, a, 0.78));
  pointAt(c, 700, 600, 2.07, 1.8);
  arrow(c, [[420, 598], [620, 598]]); arrow(c, [[620, 598], [420, 598]]);
};

export const su_animalsAnimalsAroundUs = cards("sci.animals.animals-around-us.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
