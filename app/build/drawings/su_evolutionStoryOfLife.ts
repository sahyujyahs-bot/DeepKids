import type { Ctx } from "./core";
import { INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, rrect, shadow, shade, line, shine, arrow, hand, write, cards, rnd } from "./flatKit";

// SET-UP CARDS · sci.evolution.story-of-life.L3 · rusting nails (jars A open, B under oil, C salty) and banana DNA

const OIL = "#f2c230", SALTW = "#b4d9ee", RUST = "#b5632b", RUSTDK = "#7f3f1c", RUSTLT = "#d9822e";
const YEL = "#f0b830", SPIRIT = "#d3eef8";

// a glass jar standing at (x, yb): layers are [from, to, colour] as fractions of its height
const jar = (c: Ctx, x: number, yb: number, w: number, h: number, layers: [number, number, string][], lid = false) => {
  shadow(c, x + w * 0.12, yb + 8, w * 0.62, w * 0.1);
  const body = () => rrect(c, x - w / 2, yb - h, w, h, w * 0.12);
  c.save(); c.beginPath(); body(); c.clip();
  for (const [a, b, col] of layers) { c.fillStyle = col; c.fillRect(x - w / 2, yb - h * b, w, h * (b - a)); }
  c.restore();
  for (const [, b, col] of layers) if (b < 0.99) shape(c, () => ell(c, x, yb - h * b, w / 2 - 4, w * 0.06), col === OIL ? "#f9dd7a" : COL.drop, 0);
  shape(c, body, COL.glass, 5);
  shade(c, body, COL.glassEdge, -w * 0.1, 0, 0.3);
  shine(c, [[x - w * 0.36, yb - h * 0.9], [x - w * 0.36, yb - h * 0.2]], 9);
  shape(c, () => rrect(c, x - w / 2 - 6, yb - h - 14, w + 12, 18, 8), "rgba(255,255,255,0.5)", 5);
  if (lid) {
    shape(c, () => rrect(c, x - w / 2 - 12, yb - h - 52, w + 24, 46, 12), COL.orange);
    shade(c, () => rrect(c, x - w / 2 - 12, yb - h - 52, w + 24, 46, 12), "#c9761f", -w * 0.2, 0, 0.6);
    for (let k = 1; k < 8; k++) line(c, [[x - w / 2 - 12 + (k * (w + 24)) / 8, yb - h - 44], [x - w / 2 - 12 + (k * (w + 24)) / 8, yb - h - 14]], 3, "#b5651a");
  }
};

// an iron nail from its head (x1, y1) to its point (x2, y2); look: grey, patches, rusty
const nail = (c: Ctx, x1: number, y1: number, x2: number, y2: number, t: number, look: "grey" | "patch" | "rust") => {
  const L = Math.hypot(x2 - x1, y2 - y1), an = Math.atan2(y2 - y1, x2 - x1);
  c.save(); c.translate(x1, y1); c.rotate(an);
  const body = () => { c.moveTo(0, -t); c.lineTo(L - t * 3, -t); c.lineTo(L, 0); c.lineTo(L - t * 3, t); c.lineTo(0, t); c.closePath(); };
  const head = () => rrect(c, -t * 0.7, -t * 2.3, t * 1.4, t * 4.6, t * 0.5);
  const base = look === "rust" ? RUST : "#aab3bf";
  shape(c, body, base, Math.max(4, t * 0.35)); shape(c, head, look === "rust" ? RUSTDK : look === "patch" ? RUSTLT : "#8f9aa9", Math.max(4, t * 0.35));
  c.save(); c.beginPath(); body(); c.clip();
  if (look === "rust") { const r = rnd(5); for (let i = 0; i < 14; i++) { shape(c, () => ell(c, r() * L, (r() - 0.5) * t * 1.6, t * (0.7 + r()), t * 0.6), r() > 0.5 ? RUSTDK : RUSTLT, 0); } }
  if (look === "patch") { for (const [u, s] of [[0.2, 1.1], [0.45, 1.5], [0.72, 0.9]]) shape(c, () => ell(c, L * u, (u - 0.4) * t, t * 2.2 * s, t * 0.75), RUSTLT, 0); }
  c.restore();
  if (look !== "rust") line(c, [[t * 1.5, -t * 0.45], [L - t * 3.5, -t * 0.45]], Math.max(3, t * 0.25), "rgba(255,255,255,0.7)");
  c.restore();
};
const saltDots = (c: Ctx, x: number, yb: number, w: number) => {
  const r = rnd(3);
  for (let i = 0; i < 26; i++) shape(c, () => ell(c, x - w * 0.42 + r() * w * 0.84, yb - 12 - r() * 28, 6, 4.5), WHITE, 2);
  for (let i = 0; i < 12; i++) shape(c, () => ell(c, x - w * 0.4 + r() * w * 0.8, yb - 60 - r() * 200, 3.5, 3.5), "rgba(255,255,255,0.85)", 0);
};
const tag = (c: Ctx, n: string, x: number, y: number) => { shape(c, () => rrect(c, x - 54, y, 108, 92, 20), WHITE, 5); write(c, n, x - 16, y + 14, 62, INK, 8); };

// the same hand-held view, mirrored so the hand comes in from the right
const handL = (c: Ctx, x: number, y: number, an: number, s: number, skin: string, sleeve: string, open = false) => {
  c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, Math.PI - an, s, skin, sleeve, open); c.restore();
};

// a small glass bottle centred (x, y), turned th (0 = upright, neck up); level = world y of the liquid surface
const bottle = (c: Ctx, x: number, y: number, th: number, s: number, level: number, liquid: string, edge = 4) => {
  const body = () => { c.moveTo(-55, -90); c.lineTo(55, -90); c.lineTo(55, 90); c.lineTo(-55, 90); c.closePath(); c.moveTo(-22, -92); c.lineTo(-22, -160); c.lineTo(22, -160); c.lineTo(22, -92); c.closePath(); };
  const path = () => { c.save(); c.translate(x, y); c.rotate(th); c.scale(s, s); c.beginPath(); body(); c.restore(); };
  path(); c.save(); c.clip(); c.fillStyle = liquid; c.fillRect(0, level, D0, D0); c.restore();
  path(); c.fillStyle = "rgba(214,236,250,0.35)"; c.fill(); c.lineWidth = edge; c.strokeStyle = INK; c.lineJoin = "round"; c.stroke();
  c.save(); c.translate(x, y); c.rotate(th); c.scale(s, s);
  shape(c, () => rrect(c, -58, -30, 116, 70, 8), WHITE, 4);
  shape(c, () => ell(c, 0, 5, 18, 18), liquid === OIL ? OIL : SPIRIT, 4);
  c.restore();
};
const D0 = 1080;

// a tilted or upright tumbler with two liquid layers; bottom centre (x, yb), turned th; levels are world y values
const tumbler = (c: Ctx, x: number, yb: number, w: number, h: number, th: number, layers: [number, string][], hl = true) => {
  shadow(c, x + w * 0.2 + Math.sin(th) * h * 0.3, yb + 6, w * 0.6, w * 0.1);
  const path = () => { c.save(); c.translate(x, yb); c.rotate(th); c.beginPath(); c.moveTo(-w / 2, -h); c.lineTo(w / 2, -h); c.lineTo(w * 0.4, 0); c.lineTo(-w * 0.4, 0); c.closePath(); c.restore(); };
  path(); c.save(); c.clip();
  for (const [ly, col] of layers) { c.fillStyle = col; c.fillRect(-100, ly, D0 + 200, D0); }
  c.restore();
  path(); c.fillStyle = COL.glass; c.fill(); c.lineWidth = 5; c.strokeStyle = INK; c.lineJoin = "round"; c.stroke();
  c.save(); c.translate(x, yb); c.rotate(th);
  shape(c, () => ell(c, 0, -h, w / 2, w * 0.08), "rgba(255,255,255,0.35)", 5);
  if (hl) shine(c, [[-w * 0.36, -h * 0.85], [-w * 0.28, -h * 0.15]], 8);
  c.restore();
};

const strands = (c: Ctx, x: number, yb: number, w: number, hgt: number, seed: number) => {
  const r = rnd(seed);
  for (let i = 0; i < 9; i++) {
    const sx = x - w * 0.36 + (i / 8) * w * 0.72, top = yb - hgt * (0.55 + r() * 0.45), wob = (r() - 0.5) * 50;
    const p = () => { c.beginPath(); c.moveTo(sx, yb + 6); c.bezierCurveTo(sx + wob, yb - hgt * 0.3, sx - wob, yb - hgt * 0.6, sx + wob * 0.3, top); };
    p(); c.strokeStyle = "#8aa9bd"; c.lineWidth = 16; c.lineCap = "round"; c.stroke();
    p(); c.strokeStyle = WHITE; c.lineWidth = 9; c.stroke();
  }
  for (let k = 0; k < 6; k++) shape(c, () => ell(c, x - w * 0.3 + k * w * 0.12, yb + 2 + (k % 2) * 6, 26, 20), WHITE, 3);
};

// ---- setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  const yb = 830, w = 290, h = 520;
  jar(c, 175, yb, w, h, [[0, 0.8, COL.water]]);
  nail(c, 90, yb - 24, 255, yb - 52, 9, "grey");
  jar(c, 540, yb, w, h, [[0, 0.58, COL.water], [0.58, 0.8, OIL]], true);
  nail(c, 455, yb - 24, 620, yb - 52, 9, "grey");
  jar(c, 905, yb, w, h, [[0, 0.8, SALTW]]);
  saltDots(c, 905, yb, w);
  nail(c, 825, yb - 50, 990, yb - 78, 9, "grey");
  tag(c, "1", 175, 880); tag(c, "2", 540, 880); tag(c, "3", 905, 880);
};

// ---- setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  const x = 740, yb = 960, w = 400, h = 640, surf = yb - h * 0.8;
  jar(c, x, yb, w, h, [[0, 0.72, COL.water], [0.72, 0.8, OIL]]);
  nail(c, x - 130, yb - 26, x + 110, yb - 58, 12, "grey");
  // oil bottle tipped over the jar mouth, held by a grown-up's hand; the oil falls in a thin stream
  const bx = 330, by = 250, th = 1.95, s = 1.7;
  const mx = bx + Math.sin(th) * 160 * s, my = by - Math.cos(th) * 160 * s;
  line(c, [[mx + 6, my + 6], [mx + 6, surf]], 20, INK); line(c, [[mx + 6, my + 6], [mx + 6, surf]], 11, OIL);
  bottle(c, bx, by, th, s, by + 20, OIL);
  hand(c, bx - 120, by - 70, 0.55, 1.7, SKIN.adult, CLOTH.adult);
  arrow(c, [[mx + 90, my + 90], [mx + 90, my + 230]], RED, 14);
};

// ---- setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 900, 470, 40);
  shape(c, () => rrect(c, 70, 150, 940, 740, 16), WHITE);
  shade(c, () => rrect(c, 70, 150, 940, 740, 16), "#d9d3c4", -30, -30, 0.5);
  nail(c, 170, 310, 900, 310, 30, "patch");
  nail(c, 170, 520, 900, 520, 30, "grey");
  nail(c, 170, 730, 900, 730, 30, "rust");
  const mk = (n: string, y: number) => write(c, n, 100, y - 20, 44, INK, 7);
  mk("1", 310); mk("2", 520); mk("3", 730);
};

// ---- setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 900, 330, 34);
  const bag = () => { c.moveTo(250, 300); c.lineTo(830, 300); c.quadraticCurveTo(870, 600, 840, 850); c.quadraticCurveTo(540, 905, 240, 850); c.quadraticCurveTo(210, 600, 250, 300); c.closePath(); };
  shape(c, bag, "rgba(225,240,250,0.8)", 6);
  c.save(); c.beginPath(); bag(); c.clip();
  shape(c, () => { c.moveTo(200, 640); c.quadraticCurveTo(540, 600, 880, 645); c.lineTo(880, 920); c.lineTo(200, 920); c.closePath(); }, "#f3ecc4", 0);
  const r = rnd(9);
  for (let i = 0; i < 90; i++) shape(c, () => ell(c, 240 + r() * 600, 650 + r() * 200, 22 + r() * 26, 12 + r() * 14, r() * 3), ["#f2d46a", "#e6cb6e", "#f7e6a0", "#dcc05c"][i % 4], 0);
  for (let i = 0; i < 7; i++) shape(c, () => ell(c, 280 + r() * 520, 625 + r() * 20, 12 + r() * 10, 12 + r() * 10), "rgba(255,255,255,0.85)", 3);
  c.restore();
  shade(c, bag, COL.glassEdge, -50, 0, 0.25);
  shape(c, () => rrect(c, 244, 296, 592, 40, 12), COL.blue);
  shape(c, () => rrect(c, 640, 290, 60, 52, 12), COL.blueDk, 5);
  shine(c, [[290, 430], [275, 650]], 10);
  // two child hands press the mash from the sides
  hand(c, 340, 400, Math.PI / 2, 2.4, SKIN.child, CLOTH.child, true);
  c.save(); c.translate(1080, 0); c.scale(-1, 1); hand(c, 340, 400, Math.PI / 2, 2.4, SKIN.child, CLOTH.child, true); c.restore();
  arrow(c, [[540, 420], [540, 560]], RED, 14);
};

// ---- setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  const x = 365, yb = 930, w = 340, h = 560, th = 0.3, sn = Math.sin(th), cs = Math.cos(th);
  tumbler(c, x, yb, w, h, th, [[620, SPIRIT], [790, YEL]]);
  hand(c, x - 185, 790, 0.12, 1.6, SKIN.adult, CLOTH.adult);
  // the bottle of clear spirit, its mouth at the glass rim, held by the other hand
  const rx = x + (w / 2) * cs + h * sn, ry = yb + (w / 2) * sn - h * cs, s = 1.2, bth = -1.95;
  const mx = rx + 12, my = ry - 30, bx = mx + 0.93 * 160 * s, by = my - 0.37 * 160 * s;
  const wall = [[rx - 14, ry + 14], [rx - 14 - 0.17 * 150, ry + 14 + 150 * cs]];
  line(c, [[mx, my], ...wall], 18, INK); line(c, [[mx, my], ...wall], 10, "#a7dcef");
  bottle(c, bx, by, bth, s, by + 10, SPIRIT);
  handL(c, bx + 70, by - 45, Math.PI - 0.6, 1.3, SKIN.adult, CLOTH.adult);
  arrow(c, [[mx + 20, my - 170], [mx - 20, my - 100]], RED, 14);
};

// ---- setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  const yb = 860, w = 270, h = 540, lv = yb - h * 0.45, top = lv - 10;
  const one = (x: number, th: boolean, st: boolean) => {
    tumbler(c, x, yb, w, h, 0, [[yb - h * 0.8, SPIRIT], [lv, YEL]], false);
    if (st) strands(c, x, lv, w, 200, x);
    if (th) {
      const tip: number[] = [x + 5, top - 40];
      line(c, [[x + 120, 160], tip], 24, INK); line(c, [[x + 120, 160], tip], 13, COL.wood);
      for (const d of [-14, 0, 14]) { const p = () => { c.beginPath(); c.moveTo(tip[0] + d * 0.3, tip[1]); c.bezierCurveTo(tip[0] + d * 2, tip[1] + 50, tip[0] - d * 2, tip[1] + 100, tip[0] + d, lv); }; p(); c.strokeStyle = "#8aa9bd"; c.lineWidth = 15; c.lineCap = "round"; c.stroke(); p(); c.strokeStyle = WHITE; c.lineWidth = 8; c.stroke(); }
      shape(c, () => ell(c, tip[0], tip[1] + 16, 26, 36), WHITE, 4);
    }
    shine(c, [[x - w * 0.36, yb - h * 0.85], [x - w * 0.28, yb - h * 0.55]], 8);
  };
  one(190, false, true); one(540, true, true); one(890, false, false);
};

export const su_evolutionStoryOfLife = cards("sci.evolution.story-of-life.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2]);
void CLOTH; void BG;
