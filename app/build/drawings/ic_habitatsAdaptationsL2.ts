import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, glass, hand, person, write, cards } from "./flatKit";

// ADAPTATION: FISH AND CAMEL (sci.habitats.adaptations.L2) · set-up cards for the bottle fish and the
// wrinkly-finger test, then card pictures: the bottle fish, the paintbrush gill, the waste models, a pond and
// dunes, a camel's foot, gills, the swim bladder, float and sink, three generations of camels.

const SAND = "#f0c979", SAND_DK = "#d9a44f", CAMEL = "#d9a65c", CAMEL_DK = "#b9833e", FISH = "#b7c6d6", FISH_DK = "#8a9db3", FIN = "#f0a35a";
const PLASTIC = "rgba(120,170,225,0.35)", BRISTLE = "#a8824f", CARD = "#c9a06a", CARD_DK = "#a67d4c", NEWS = "#d8d4cc";

// ---------------------------------------------------------------- shared things
const coin = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0) => {
  shape(c, () => ell(c, x, y, rx, ry, rot), COL.steelDk, 4);
  shape(c, () => ell(c, x, y, rx * 0.7, ry * 0.7, rot), COL.steelIn, 2.5);
};
const bubble = (c: Ctx, x: number, y: number, r: number) => shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.75)", 3);
const MARB: [string, string][] = [[COL.blue, COL.blueDk], [COL.green, COL.greenDk], [COL.orange, "#c97a22"], [COL.red, "#b23a28"], [COL.purple, "#6a4fa3"]];
const marble = (c: Ctx, x: number, y: number, r: number, k: number) => {
  const [a, b] = MARB[k % 5];
  shape(c, () => ell(c, x, y, r, r), a, 4);
  shade(c, () => ell(c, x, y, r, r), b, -r * 0.35, -r * 0.35, 0.6);
  shape(c, () => ell(c, x - r * 0.35, y - r * 0.38, r * 0.22, r * 0.15, -0.6), WHITE, 0);
};
// a steel spoon: handle end at (x, y), bowl len away along an
const spoon = (c: Ctx, x: number, y: number, an: number, len: number) => {
  const ca = Math.cos(an), sa = Math.sin(an), bx = x + ca * len * 0.78, by = y + sa * len * 0.78, hx = x + ca * len * 0.6, hy = y + sa * len * 0.6;
  line(c, [[x, y], [hx, hy]], 24, INK); line(c, [[x, y], [hx, hy]], 13, COL.steel);
  shape(c, () => ell(c, bx, by, len * 0.22, len * 0.14, an), COL.steel, 5);
  shape(c, () => ell(c, bx, by, len * 0.16, len * 0.09, an), COL.steelIn, 3);
};
// a clear plastic bottle: bottom centre at (x, y), height h, turned by rot (0 = standing up). Water inside up to a
// fraction of the height (fill), or up to a horizontal line on the card (level) when the bottle is tilted.
// Coins are [x, y, rx, ry] in the bottle's own frame (its bottom centre is 0,0, up is -y).
type BottleOpts = { fill?: number; level?: number; coins?: number[][]; cap?: boolean };
const bottle = (c: Ctx, x: number, y: number, h: number, rot: number, o: BottleOpts = {}) => {
  const w = h * 0.36, bh = h * 0.68, nw = w * 0.42, ny = -h * 0.84, capH = h * 0.1, r = w * 0.15, top = -h + (o.cap ? capH : 0);
  const body = () => {
    c.moveTo(-w / 2, -r); c.lineTo(-w / 2, -bh); c.quadraticCurveTo(-w / 2, ny, -nw / 2, ny); c.lineTo(-nw / 2, top); c.lineTo(nw / 2, top); c.lineTo(nw / 2, ny);
    c.quadraticCurveTo(w / 2, ny, w / 2, -bh); c.lineTo(w / 2, -r); c.quadraticCurveTo(w / 2, 0, w / 2 - r, 0); c.lineTo(-w / 2 + r, 0); c.quadraticCurveTo(-w / 2, 0, -w / 2, -r); c.closePath();
  };
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, body, COL.glass, 0);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water;
  if (o.level !== undefined) { c.rotate(-rot); c.translate(-x, -y); c.fillRect(0, o.level, D, D); }
  else if (o.fill) c.fillRect(-w, -h * o.fill, 2 * w, h * o.fill);
  c.restore();
  (o.coins ?? []).forEach(([cx, cy, rx, ry]) => coin(c, cx, cy, rx, ry));
  shape(c, body, "rgba(255,255,255,0)", 6);
  if (o.cap) shape(c, () => rrect(c, -nw / 2 - 6, -h, nw + 12, capH, 6), COL.blue, 5);
  else shape(c, () => ell(c, 0, -h, nw / 2 + 3, nw * 0.14), "rgba(255,255,255,0.3)", 5);
  shine(c, [[-w * 0.36, -bh * 0.85], [-w * 0.36, -bh * 0.3]], 7);
  c.restore();
};
// a see-through bucket of water, bottom centre (x, y), rim width w, height h, water up to fill of h; contents are
// drawn under the water surface
const bucket = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, contents?: () => void, handle = true) => {
  const bw = w * 0.82, top = y - h, ly = y - h * fill, lw = (bw + (w - bw) * fill) / 2;
  const body = () => { c.moveTo(x - w / 2, top); c.lineTo(x + w / 2, top); c.lineTo(x + bw / 2, y); c.lineTo(x - bw / 2, y); c.closePath(); };
  shadow(c, x + w * 0.1, y + 8, w * 0.55, w * 0.08);
  if (handle) { c.beginPath(); c.moveTo(x - w / 2 + 10, top); c.quadraticCurveTo(x, top - w * 0.5, x + w / 2 - 10, top); c.strokeStyle = INK; c.lineWidth = 22; c.lineCap = "round"; c.stroke(); c.strokeStyle = COL.steel; c.lineWidth = 12; c.stroke(); }
  shape(c, body, PLASTIC, 0);
  if (fill > 0) shape(c, () => { c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + bw / 2, y); c.lineTo(x - bw / 2, y); c.closePath(); }, COL.water, 0);
  contents?.();
  if (fill > 0) shape(c, () => ell(c, x, ly, lw, w * 0.05), "rgba(233,243,255,0.45)", 4);
  shape(c, body, "rgba(255,255,255,0)", 6);
  shape(c, () => ell(c, x, top, w / 2, w * 0.07), "rgba(255,255,255,0.25)", 6);
  shine(c, [[x - w * 0.42, top + h * 0.14], [x - bw * 0.45, y - h * 0.2]], 8);
};
// the kit hand, with wrinkled fingertips when asked
const handW = (c: Ctx, x: number, y: number, an: number, s: number, open = false, wrinkly = false) => {
  hand(c, x, y, an, s, SKIN.child, CLOTH.child, open);
  if (!wrinkly) return;
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  for (let k = 0; k < 4; k++) {
    const fy = -30 + k * 17 + 8.5, fx = open ? 84 - Math.abs(k - 1.3) * 8 : 66;
    line(c, [[fx - 7, fy - 4], [fx - 2, fy + 2], [fx + 3, fy - 4], [fx + 8, fy + 2]], 2.5, SKIN.childDk);
  }
  line(c, [[40, -48], [45, -43], [50, -48], [55, -43]], 2.5, SKIN.childDk);
  c.restore();
};
// a side view of a fish facing left, centre (x, y), length L
type FishOpts = { see?: boolean; gillOpen?: boolean; bladder?: boolean };
const fish = (c: Ctx, x: number, y: number, L: number, o: FishOpts = {}) => {
  const H = L * 0.36, col = o.see ? "rgba(255,250,240,0.8)" : FISH, nx = x - L * 0.5, tr = x + L * 0.3, gx = x - L * 0.27;
  const body = () => { c.moveTo(nx, y); c.bezierCurveTo(x - L * 0.4, y - H * 0.7, x, y - H * 0.66, tr, y - H * 0.12); c.lineTo(tr, y + H * 0.12); c.bezierCurveTo(x, y + H * 0.66, x - L * 0.4, y + H * 0.7, nx, y); c.closePath(); };
  shape(c, () => { c.moveTo(tr - L * 0.02, y - H * 0.12); c.lineTo(x + L * 0.5, y - H * 0.55); c.quadraticCurveTo(x + L * 0.42, y, x + L * 0.5, y + H * 0.55); c.lineTo(tr - L * 0.02, y + H * 0.12); c.closePath(); }, FIN);
  shape(c, () => { c.moveTo(x - L * 0.16, y - H * 0.55); c.quadraticCurveTo(x - L * 0.02, y - H * 1.05, x + L * 0.16, y - H * 0.95); c.lineTo(x + L * 0.19, y - H * 0.4); c.closePath(); }, FIN);
  shape(c, () => { c.moveTo(x + L * 0.05, y + H * 0.45); c.lineTo(x + L * 0.12, y + H * 0.85); c.lineTo(x + L * 0.22, y + H * 0.3); c.closePath(); }, FIN);
  shape(c, () => { c.moveTo(x - L * 0.2, y + H * 0.5); c.lineTo(x - L * 0.14, y + H * 0.85); c.lineTo(x - L * 0.04, y + H * 0.42); c.closePath(); }, FIN);
  shape(c, body, col);
  if (!o.see) shade(c, body, FISH_DK, -L * 0.03, -H * 0.3, 0.45);
  if (o.bladder) {
    const bx = x + L * 0.02, by = y - H * 0.12;
    shape(c, () => { c.moveTo(bx - L * 0.2, by); c.bezierCurveTo(bx - L * 0.2, by - H * 0.3, bx + L * 0.05, by - H * 0.32, bx + L * 0.2, by - H * 0.1); c.bezierCurveTo(bx + L * 0.26, by + H * 0.15, bx - L * 0.2, by + H * 0.3, bx - L * 0.2, by); c.closePath(); }, "#f3e7cf", 5);
    shine(c, [[bx - L * 0.14, by - H * 0.12], [bx - L * 0.02, by - H * 0.2]], 8);
  }
  if (o.gillOpen) {
    // the gill cover held open: red feathery gills show behind the head, the cover is a narrow flap at its hinge
    const cx = gx - L * 0.02;
    for (let i = 0; i < 4; i++) {
      const rr = H * (0.4 - i * 0.075);
      c.beginPath(); c.arc(cx, y, rr, -Math.PI * 0.38, Math.PI * 0.38); c.strokeStyle = INK; c.lineWidth = H * 0.07 + 6; c.lineCap = "round"; c.stroke();
      c.beginPath(); c.arc(cx, y, rr, -Math.PI * 0.38, Math.PI * 0.38); c.strokeStyle = COL.red; c.lineWidth = H * 0.07; c.stroke();
      for (let k = -3; k <= 3; k++) { const a = k * 0.17; line(c, [[cx + Math.cos(a) * rr, y + Math.sin(a) * rr], [cx + Math.cos(a) * (rr + H * 0.055), y + Math.sin(a) * (rr + H * 0.055)]], 3, RED); }
    }
    // the cover, swung open on its front hinge, so it is seen edge-on as a narrow D
    const hx = gx - L * 0.07;
    shape(c, () => { c.moveTo(hx, y - H * 0.46); c.quadraticCurveTo(gx + L * 0.01, y - H * 0.2, gx + L * 0.005, y); c.quadraticCurveTo(gx + L * 0.01, y + H * 0.2, hx, y + H * 0.46); c.closePath(); }, FISH_DK, 5);
    shine(c, [[hx + L * 0.02, y - H * 0.3], [hx + L * 0.035, y + H * 0.2]], 6);
  } else {
    c.beginPath(); c.arc(gx - L * 0.02, y, H * 0.42, -Math.PI * 0.4, Math.PI * 0.4); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
    shape(c, () => { c.moveTo(gx + L * 0.03, y + H * 0.08); c.quadraticCurveTo(gx + L * 0.16, y + H * 0.02, gx + L * 0.22, y + H * 0.42); c.quadraticCurveTo(gx + L * 0.1, y + H * 0.42, gx + L * 0.03, y + H * 0.08); c.closePath(); }, FIN, 5);
  }
  shape(c, () => ell(c, x - L * 0.38, y - H * 0.15, H * 0.11, H * 0.11), WHITE, 4);
  shape(c, () => ell(c, x - L * 0.39, y - H * 0.15, H * 0.055, H * 0.055), INK, 0);
  line(c, [[nx + L * 0.01, y + H * 0.03], [nx + L * 0.08, y + H * 0.1]], 4);
};
// a camel facing left, feet on the ground line y, body length L
const camel = (c: Ctx, x: number, y: number, L: number) => {
  const P = (u: number, v: number): [number, number] => [x + u * L, y + v * L];
  const leg = (u: number, far: boolean, lean = 0) => {
    const pts = [P(u, -0.5), P(u + lean * 0.5, -0.24), P(u + lean, -0.03)], w = L * 0.085;
    line(c, pts, w + 10, INK); line(c, pts, w, far ? CAMEL_DK : CAMEL);
    shape(c, () => ell(c, pts[2][0], pts[2][1] + L * 0.005, L * 0.09, L * 0.03), far ? CAMEL_DK : CAMEL, 4);
  };
  shadow(c, x + L * 0.05, y + L * 0.01, L * 0.6, L * 0.05);
  leg(-0.22, true, -0.05); leg(0.36, true, 0.04);
  const B = (a: number, b: number, d: number, e: number, f: number, g: number) => { const p1 = P(a, b), p2 = P(d, e), p3 = P(f, g); c.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]); };
  const body = () => {
    const s = P(-0.58, -1.18); c.moveTo(s[0], s[1]);
    B(-0.45, -1.0, -0.3, -0.9, -0.2, -0.9); B(-0.12, -1.08, 0.12, -1.06, 0.18, -0.88); B(0.22, -0.85, 0.3, -0.84, 0.36, -0.82);
    B(0.48, -0.75, 0.5, -0.55, 0.42, -0.45); B(0.2, -0.33, -0.1, -0.33, -0.35, -0.42); B(-0.5, -0.5, -0.5, -0.65, -0.44, -0.75); B(-0.55, -0.9, -0.66, -1.0, -0.72, -1.12); c.closePath();
  };
  shape(c, body, CAMEL); shade(c, body, CAMEL_DK, -L * 0.05, -L * 0.06, 0.45);
  leg(-0.3, false); leg(0.28, false);
  const tail = [P(0.44, -0.72), P(0.52, -0.58), P(0.5, -0.44)];
  line(c, tail, L * 0.03 + 8, INK); line(c, tail, L * 0.03, CAMEL_DK);
  const hd = P(-0.7, -1.22);
  shape(c, () => ell(c, hd[0], hd[1], L * 0.16, L * 0.095, -0.25), CAMEL, 5);
  shape(c, () => polyP(c, [P(-0.6, -1.28), P(-0.57, -1.4), P(-0.65, -1.35)]), CAMEL, 4);
  const nz = P(-0.84, -1.26); shape(c, () => ell(c, nz[0], nz[1], L * 0.02, L * 0.012, -0.3), INK, 0);
  const ey = P(-0.69, -1.26); shape(c, () => ell(c, ey[0], ey[1], L * 0.024, L * 0.024), INK, 0);
  for (let i = 0; i < 3; i++) { const a = -Math.PI * 0.55 - i * 0.35, r0 = L * 0.03, r1 = L * 0.065; line(c, [[ey[0] + Math.cos(a) * r0, ey[1] + Math.sin(a) * r0], [ey[0] + Math.cos(a) * r1, ey[1] + Math.sin(a) * r1]], 3); }
};
// sky and sand dunes filling a box
const dunes = (c: Ctx, x0: number, y0: number, w: number, h: number) => {
  c.fillStyle = COL.sky; c.fillRect(x0, y0, w, h);
  shape(c, () => ell(c, x0 + w * 0.8, y0 + h * 0.2, w * 0.07, w * 0.07), COL.yellow, 5);
  shape(c, () => { c.moveTo(x0, y0 + h * 0.58); c.quadraticCurveTo(x0 + w * 0.3, y0 + h * 0.3, x0 + w * 0.62, y0 + h * 0.5); c.quadraticCurveTo(x0 + w * 0.85, y0 + h * 0.62, x0 + w, y0 + h * 0.42); c.lineTo(x0 + w, y0 + h); c.lineTo(x0, y0 + h); c.closePath(); }, SAND_DK, 5);
  shape(c, () => { c.moveTo(x0, y0 + h * 0.7); c.quadraticCurveTo(x0 + w * 0.4, y0 + h * 0.85, x0 + w * 0.7, y0 + h * 0.66); c.quadraticCurveTo(x0 + w * 0.9, y0 + h * 0.58, x0 + w, y0 + h * 0.7); c.lineTo(x0 + w, y0 + h); c.lineTo(x0, y0 + h); c.closePath(); }, SAND, 5);
};
// a small paper label with two lines of "writing", tied by a thread to (tx, ty)
const tag = (c: Ctx, x: number, y: number, tx: number, ty: number) => {
  line(c, [[x + 10, y + 10], [tx, ty]], 3, COL.greyDk);
  shape(c, () => rrect(c, x - 50, y - 24, 100, 48, 6), COL.paper, 4);
  line(c, [[x - 36, y - 6], [x + 30, y - 6]], 4, COL.greyDk); line(c, [[x - 36, y + 10], [x + 14, y + 10]], 4, COL.greyDk);
};
// a paintbrush: bristle base at (x, y), bristles pointing along an; spread = wet and fanned out
const brush = (c: Ctx, x: number, y: number, an: number, len: number, spread: boolean) => {
  const ca = Math.cos(an), sa = Math.sin(an), fl = len * 0.1, hl = len * 0.68, bl = len * 0.22;
  const f: [number, number] = [x - ca * fl, y - sa * fl], e: [number, number] = [x - ca * (fl + hl), y - sa * (fl + hl)];
  line(c, [f, e], len * 0.07 + 10, INK); line(c, [f, e], len * 0.07, COL.wood);
  line(c, [[x, y], f], len * 0.08 + 10, INK); line(c, [[x, y], f], len * 0.08, COL.steel);
  if (spread) {
    const tips = [-3, -2, -1, 0, 1, 2, 3].map((i) => [x + Math.cos(an + i * 0.13) * bl, y + Math.sin(an + i * 0.13) * bl]);
    tips.forEach((t) => line(c, [[x, y], t], len * 0.018 + 6, INK));
    tips.forEach((t) => line(c, [[x, y], t], len * 0.018, BRISTLE));
  } else shape(c, () => { c.moveTo(x - sa * len * 0.04, y + ca * len * 0.04); c.lineTo(x + ca * bl, y + sa * bl); c.lineTo(x + sa * len * 0.04, y - ca * len * 0.04); c.closePath(); }, BRISTLE, 5);
};
const table = (c: Ctx, y: number) => { c.fillStyle = COL.wood; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };

// ---------------------------------------------------------------- set-up cards: the bottle fish
// 1. a hand drops one-rupee coins into the empty bottle
const e1s0 = (c: Ctx) => {
  ground(c);
  table(c, 960);
  shadow(c, 560, 962, 130, 20);
  bottle(c, 540, 960, 560, 0, { coins: [[-30, -18, 28, 10], [26, -14, 28, 10], [-4, -30, 28, 10]] });
  hand(c, 540, 120, Math.PI / 2, 1.5);
  coin(c, 566, 238, 12, 32);
  coin(c, 548, 335, 13, 30, 0.2);
  arrow(c, [[660, 250], [660, 400]]);
};
// 2. the bottle fills under water (bubbles out of its mouth), then lies full on the bottom
const e1s1 = (c: Ctx) => {
  ground(c);
  table(c, 1000);
  bucket(c, 540, 1000, 900, 620, 0.9, () => {
    bottle(c, 330, 727, 260, 0, { fill: 0.55, coins: [[-20, -14, 20, 8], [16, -12, 20, 8]] });
    hand(c, 330, 520, Math.PI / 2, 1.1);
    [[318, 445, 9], [345, 430, 7], [334, 405, 11], [322, 372, 8], [350, 350, 6]].forEach(([x, y, r]) => bubble(c, x, y, r));
    bottle(c, 560, 946, 260, Math.PI / 2, { fill: 1, cap: true, coins: [[30, -60, 8, 20], [30, -110, 8, 20], [30, -160, 8, 20]] });
    arrow(c, [[430, 600], [520, 780], [560, 860]]);
  });
};
// 3. the girl pours one spoon of water out of the bottle; inset: the bottle now floats
const e1s2 = (c: Ctx) => {
  ground(c);
  table(c, 1030);
  const hands = person(c, 400, 1010, 620, { reachL: [262, 590], reachR: [545, 735] });
  const hl = hands.handL, hr = hands.handR;
  // the bottle, gripped near its middle, mouth down to the right; the water inside is level with its mouth
  const rot = (150 * Math.PI) / 180, bh = 210, g = bh * 0.5, bx = hl[0] - g * Math.sin(rot), by = hl[1] + g * Math.cos(rot);
  const mouth: [number, number] = [bx + Math.sin(rot) * bh, by - Math.cos(rot) * bh];
  bottle(c, bx, by, bh, rot, { level: mouth[1] - 8, coins: [[-20, -14, 18, 7], [16, -12, 18, 7]] });
  // a spoon in the right hand, its bowl under the mouth; water runs from the mouth into the bowl
  const sa = Math.atan2(mouth[1] + 78 - hr[1], mouth[0] + 10 - hr[0]), sl = Math.hypot(mouth[0] + 10 - hr[0], mouth[1] + 78 - hr[1]) / 0.78;
  spoon(c, hr[0], hr[1], sa, sl);
  line(c, [[mouth[0], mouth[1]], [mouth[0] + 8, mouth[1] + 40], [mouth[0] + 12, mouth[1] + 62]], 18, INK);
  line(c, [[mouth[0], mouth[1]], [mouth[0] + 8, mouth[1] + 40], [mouth[0] + 12, mouth[1] + 62]], 10, COL.water);
  bucket(c, 420, 1050, 520, 270, 0.85, undefined, false);
  // inset: the test again, the bottle floating at the top of the water
  shape(c, () => rrect(c, 690, 100, 340, 350), COL.paper, 6);
  bucket(c, 860, 430, 220, 200, 0.8, () => bottle(c, 860, 382, 140, 0, { fill: 0.72, cap: true, coins: [[-12, -9, 12, 5], [10, -8, 12, 5]] }));
};

// ---------------------------------------------------------------- set-up cards: wrinkly fingers
// two bowls, a hand lifting a marble out of the wet one; moved = marbles already in the second bowl
const marbleBowls = (c: Ctx, wrinkly: boolean, moved: number) => {
  const r = rnd(3);
  bowl(c, 250, 680, 195, COL.water);
  c.save(); c.beginPath(); ell(c, 250, 680, 191, 38); c.clip();
  for (let i = 0; i < 9 - moved; i++) marble(c, 85 + i * 40 + r() * 10, 672 + r() * 22, 20, i);
  c.fillStyle = "rgba(143,195,234,0.4)"; c.fillRect(40, 620, 430, 120);
  c.restore();
  bowl(c, 680, 680, 195);
  for (let i = 0; i < moved; i++) marble(c, 620 + i * 50, 692 + (i % 2) * 8, 20, i + 2);
  handW(c, 400, 400, 2.0, 1.2, false, wrinkly);
  marble(c, 397, 489, 26, 1);
  arrow(c, [[450, 470], [570, 520], [640, 600]]);
};
const e2s0 = (c: Ctx) => { ground(c); table(c, 760); marbleBowls(c, false, 0); };
// the hand soaks in a basin of warm water; a magnifier shows the wrinkled fingertip
const e2s1 = (c: Ctx) => {
  ground(c);
  table(c, 880);
  shadow(c, 580, 900, 420, 40);
  shape(c, () => { c.moveTo(100, 600); c.bezierCurveTo(120, 900, 960, 900, 980, 600); c.closePath(); }, COL.teal);
  shade(c, () => { c.moveTo(100, 600); c.bezierCurveTo(120, 900, 960, 900, 980, 600); c.closePath(); }, COL.tealDk, -120, -40, 0.5);
  shape(c, () => ell(c, 540, 600, 440, 250), COL.teal, 6);
  shape(c, () => ell(c, 540, 610, 390, 205), COL.water, 5);
  c.save(); c.beginPath(); ell(c, 540, 610, 390, 205); c.clip();
  handW(c, 360, 620, 0.12, 1.7, true, true);
  c.fillStyle = "rgba(143,195,234,0.45)"; c.fillRect(0, 0, D, D);
  c.restore();
  c.globalAlpha = 0.6;
  [[300, 300], [460, 260], [640, 300]].forEach(([x, y]) => line(c, [[x, y + 80], [x - 14, y + 50], [x + 14, y + 20], [x, y - 10]], 7, COL.greyDk));
  c.globalAlpha = 1;
  // the magnifier: the fingertip close up, wrinkled
  line(c, [[770, 350], [700, 420]], 26, INK); line(c, [[770, 350], [700, 420]], 14, COL.wood);
  shape(c, () => ell(c, 870, 230, 165, 165), COL.paper, 10);
  c.save(); c.beginPath(); ell(c, 870, 230, 160, 160); c.clip();
  shape(c, () => rrect(c, 810, 130, 120, 300, 58), SKIN.child, 6);
  for (let k = 0; k < 5; k++) { const y = 175 + k * 28; line(c, [[826, y + 4], [848, y - 6], [870, y + 4], [892, y - 6], [914, y + 4]], 4, SKIN.childDk); }
  c.restore();
};
const e2s2 = (c: Ctx) => {
  ground(c); table(c, 760);
  marbleBowls(c, true, 3);
  // the phone stands propped on the table behind the bowls, its timer at 30 seconds
  shadow(c, 980, 764, 90, 14);
  shape(c, () => rrect(c, 900, 500, 150, 260, 16), COL.black, 6);
  shape(c, () => rrect(c, 914, 526, 122, 208, 8), "#22303a", 3);
  write(c, "30", 930, 598, 64, "#c9f06b", 8);
};

// ---------------------------------------------------------------- card pictures
// flow.e1: the bottle fish floats, a little air at the top, coins at the bottom
const flowE1 = (c: Ctx) => {
  ground(c); table(c, 1000);
  bucket(c, 540, 990, 620, 600, 0.82, () => bottle(c, 540, 760, 300, 0, { fill: 0.8, cap: true, coins: [[-24, -16, 24, 9], [20, -14, 24, 9], [-2, -32, 24, 9]] }));
};
// flow.e2: a wrinkly-fingered hand holding a wet marble
const flowE2 = (c: Ctx) => {
  ground(c);
  handW(c, 430, 580, -0.12, 2.2, false, true);
  marble(c, 586, 494, 50, 0);
  [[600, 600, 12], [585, 690, 9], [620, 760, 7]].forEach(([x, y, r]) => shape(c, () => { c.moveTo(x, y - r * 1.6); c.quadraticCurveTo(x + r, y - r * 0.3, x + r, y + r * 0.2); c.arc(x, y + r * 0.2, r, 0, Math.PI); c.quadraticCurveTo(x - r, y - r * 0.3, x, y - r * 1.6); c.closePath(); }, COL.water, 4));
};
// flow.a1: a dry brush beside a glass with a wet brush in it, hairs spread apart
const flowA1 = (c: Ctx) => {
  ground(c); table(c, 900);
  brush(c, 420, 950, 0, 460, false);
  glass(c, 740, 900, 260, 420, 0.72);
  brush(c, 730, 750, Math.atan2(270, -140), 560, true);
};
// flow.p1: the camel from a box and the fish from the bottle, each with labels
const flowP1 = (c: Ctx) => {
  ground(c); table(c, 900);
  // the camel: four stick legs with paper feet, a box body, a newspaper hump, a roll neck and box head
  for (const [lx, far] of [[200, true], [380, true], [170, false], [410, false]] as [number, boolean][]) {
    line(c, [[lx + (far ? 20 : 0), 720], [lx + (far ? 20 : 0), 890]], 22, INK); line(c, [[lx + (far ? 20 : 0), 720], [lx + (far ? 20 : 0), 890]], 12, far ? COL.woodDk : COL.wood);
    shape(c, () => ell(c, lx + (far ? 20 : 0), 893, 46, 12), COL.paper, 4);
  }
  shape(c, () => rrect(c, 130, 600, 330, 150, 10), CARD, 6); shade(c, () => rrect(c, 130, 600, 330, 150, 10), CARD_DK, -20, -20, 0.5);
  shape(c, () => ell(c, 300, 590, 95, 60), NEWS, 6);
  line(c, [[240, 580], [280, 572], [320, 586], [355, 574]], 3, COL.greyDk); line(c, [[250, 604], [300, 596], [345, 606]], 3, COL.greyDk);
  line(c, [[150, 620], [110, 490]], 44, INK); line(c, [[150, 620], [110, 490]], 32, CARD);
  shape(c, () => rrect(c, 50, 440, 110, 70, 8), CARD, 6);
  shape(c, () => ell(c, 95, 468, 7, 7), INK, 0);
  tag(c, 420, 470, 300, 545); tag(c, 490, 820, 405, 880);
  // the fish: the bottle on its side (cap = nose, to the right) with cardboard fins taped on: a tail at the flat
  // end, a dorsal fin on top, a side fin
  shape(c, () => polyP(c, [[566, 800], [482, 742], [482, 938], [566, 880]]), CARD, 6);
  shape(c, () => polyP(c, [[660, 792], [722, 700], [784, 792]]), CARD, 6);
  bottle(c, 560, 840, 290, Math.PI / 2, { fill: 0.6, cap: true, coins: [[36, -60, 8, 20], [36, -120, 8, 20]] });
  shape(c, () => polyP(c, [[700, 832], [770, 866], [704, 870]]), CARD, 6);
  c.globalAlpha = 0.6; shape(c, () => rrect(c, 690, 778, 66, 30, 4), COL.yellow, 3); shape(c, () => rrect(c, 548, 820, 36, 60, 4), COL.yellow, 3); c.globalAlpha = 1;
  tag(c, 760, 600, 722, 720);
};
// term.0: a pond with lotus leaves and a fish; a small picture of dunes with a camel
const term0 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 360);
  shape(c, () => ell(c, 170, 130, 70, 70), COL.yellow, 5);
  c.fillStyle = COL.waterDk; c.fillRect(0, 360, D, 560);
  c.fillStyle = COL.water; c.fillRect(0, 360, D, 60);
  line(c, [[0, 360], [D, 360]], 6);
  shape(c, () => { c.moveTo(0, 920); c.quadraticCurveTo(300, 880, 600, 915); c.quadraticCurveTo(850, 940, D, 900); c.lineTo(D, D); c.lineTo(0, D); c.closePath(); }, COL.soil, 6);
  fish(c, 380, 640, 300);
  for (const [x, w, k] of [[200, 110, 0.4], [470, 95, 2.4], [700, 120, 1.2]]) {
    line(c, [[x, 360], [x - 20, 600], [x + 10, 900]], 6, COL.leafDk);
    shape(c, () => { c.moveTo(x, 360); c.ellipse(x, 360, w, w * 0.3, 0, k, k + Math.PI * 1.75); c.closePath(); }, COL.leaf, 5);
  }
  shape(c, () => { c.moveTo(470, 350); c.lineTo(440, 280); c.lineTo(470, 300); c.lineTo(500, 280); c.closePath(); }, COL.pink, 4);
  shape(c, () => rrect(c, 650, 620, 390, 390, 16), COL.paper, 8);
  c.save(); c.beginPath(); rrect(c, 664, 634, 362, 362, 10); c.clip();
  dunes(c, 664, 634, 362, 362);
  camel(c, 880, 960, 140);
  c.restore();
};
// term.1: a camel's wide foot on the sand, and a small shoe sinking in beside it
const term1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 745);
  c.fillStyle = SAND; c.fillRect(0, 745, D, D - 745); line(c, [[0, 745], [D, 745]], 6);
  const leg = () => { c.moveTo(470, 60); c.lineTo(620, 60); c.lineTo(600, 600); c.quadraticCurveTo(760, 650, 760, 735); c.lineTo(340, 735); c.quadraticCurveTo(330, 650, 490, 600); c.closePath(); };
  shape(c, leg, CAMEL); shade(c, leg, CAMEL_DK, -40, -30, 0.45);
  shape(c, () => ell(c, 420, 722, 30, 14), CAMEL_DK, 4); shape(c, () => ell(c, 500, 722, 30, 14), CAMEL_DK, 4);
  // the shoe, its sole well below the sand
  const sx = 900, sy = 772, w = 250, h = 115;
  shape(c, () => { c.moveTo(sx - w / 2, sy); c.lineTo(sx + w / 2, sy); c.lineTo(sx + w / 2, sy - h * 0.9); c.quadraticCurveTo(sx + w / 2, sy - h * 1.25, sx + w * 0.2, sy - h * 1.2); c.quadraticCurveTo(sx - w * 0.1, sy - h * 1.05, sx - w * 0.3, sy - h * 0.55); c.quadraticCurveTo(sx - w / 2, sy - h * 0.4, sx - w / 2, sy); c.closePath(); }, COL.red, 5);
  line(c, [[sx - 10, sy - 80], [sx + 40, sy - 70]], 4, WHITE); line(c, [[sx - 2, sy - 100], [sx + 46, sy - 90]], 4, WHITE);
  // sand piled up round the sunk shoe
  shape(c, () => { c.moveTo(720, 745); c.quadraticCurveTo(770, 742, 790, 736); c.lineTo(1010, 736); c.quadraticCurveTo(1030, 742, 1080, 745); c.lineTo(1080, 1080); c.lineTo(720, 1080); c.closePath(); }, SAND, 0);
  line(c, [[720, 745], [770, 742], [790, 736], [1010, 736], [1030, 742], [1080, 745]], 6);
  arrow(c, [[900, 520], [900, 620]]);
};
// term.3: a fish with the gill cover held open: red feathery gills
const term3 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.water; c.fillRect(0, 0, D, D);
  fish(c, 520, 540, 900, { gillOpen: true });
};
// term.4: a see-through fish with the pale swim bladder inside
const term4 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.water; c.fillRect(0, 0, D, D);
  fish(c, 520, 540, 900, { see: true, bladder: true });
};
// term.8: an empty capped bottle floats at the top of the bucket, a steel spoon lies at the bottom
const term8 = (c: Ctx) => {
  ground(c); table(c, 1000);
  bucket(c, 540, 980, 620, 620, 0.8, () => {
    spoon(c, 360, 948, 0, 320);
    bottle(c, 330, 492, 260, Math.PI / 2 - 0.08, { cap: true });
  });
};
// term.9: a camel calf, her mother and her grandmother in a row on the sand
const term9 = (c: Ctx) => {
  ground(c);
  dunes(c, 0, 0, D, D);
  c.fillStyle = SAND; c.fillRect(0, 760, D, D - 760); line(c, [[0, 760], [D, 760]], 6);
  camel(c, 180, 820, 150); camel(c, 470, 820, 250); camel(c, 840, 820, 300);
};

export const ic_habitatsAdaptationsL2 = cards("sci.habitats.adaptations.L2", [e1s0, e1s1, e1s2, e2s0, e2s1, e2s2, flowE1, flowE2, flowA1, flowP1, term0, term1, term3, term4, term8, term9]);
