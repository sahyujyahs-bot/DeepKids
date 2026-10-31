import type { Ctx } from "./core";
import { INK, RED, WHITE, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, hand, write, cards } from "./flatKit";

// WATER SOURCES AND USES · L3 set-up cards. Shared pieces first: the clear measuring mug, plastic tubs of
// ground, a slab (tile, tray), the phone timer, the layered jar, a steel spoon, a drop, a clay matka.

const SAND = "#e6c885", SANDDK = "#c9a55c", CLAY = "#c9683a", CLAYDK = "#a24f2a", MUDW = "#a7794f";

// a hand pointing left (the mirror of hand())
const handL = (c: Ctx, x: number, y: number, an: number, s: number, open = false) => { c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, an, s, SKIN.child, CLOTH.child, open); c.restore(); };

// a teardrop, point up, centre of its round part at (x, y)
const drop = (c: Ctx, x: number, y: number, r: number, col: string = COL.drop) => shape(c, () => { c.moveTo(x, y - r * 2); c.quadraticCurveTo(x - r * 1.2, y - r * 0.4, x - r, y + r * 0.2); c.arc(x, y + r * 0.2, r, Math.PI, 0, true); c.quadraticCurveTo(x + r * 1.2, y - r * 0.4, x, y - r * 2); c.closePath(); }, col, 3);

// the clear measuring mug (handle left, lip right), bottom centre (x, y); fill and mark are 0..1 of its height;
// rot tilts it clockwise about its bottom centre, and the water stays level in the world
const mug = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, mark = 0, rot = 0) => {
  if (!rot) shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.1);
  c.save(); c.translate(x, y); c.rotate(rot);
  const hy1 = -h * 0.82, hy2 = -h * 0.3, hp = () => { c.beginPath(); c.moveTo(-w / 2 + 6, hy1); c.bezierCurveTo(-w / 2 - 80, hy1 - 12, -w / 2 - 80, hy2 + 12, -w / 2 + 6, hy2); };
  hp(); c.strokeStyle = INK; c.lineWidth = 38; c.lineCap = "round"; c.stroke(); hp(); c.strokeStyle = COL.teal; c.lineWidth = 24; c.stroke();
  const body = () => rrect(c, -w / 2, -h, w, h, 18);
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = "rgba(255,255,255,0.5)"; c.fillRect(-w, -h * 2, w * 2, h * 2);
  if (fill > 0) { c.save(); c.translate(0, -h * fill); c.rotate(-rot); c.fillStyle = COL.water; c.fillRect(-1000, 0, 2000, 2000); c.beginPath(); c.moveTo(-1000, 0); c.lineTo(1000, 0); c.strokeStyle = COL.drop; c.lineWidth = 8; c.stroke(); c.restore(); }
  c.restore();
  shape(c, body, "rgba(214,236,250,0.25)", 6);
  shape(c, () => ell(c, 0, -h, w / 2, w * 0.07), "rgba(255,255,255,0.3)", 5);
  if (mark) { line(c, [[-w / 2 + 3, -h * mark], [w / 2 - 3, -h * mark]], 9, INK); line(c, [[-w / 2 + 3, -h * mark - 30], [-w / 2 + 3, -h * mark]], 9, INK); }
  shine(c, [[-w * 0.36, -h * 0.85], [-w * 0.36, -h * 0.25]], 8);
  c.restore();
};
// where the lip of a tilted mug is in the world
const lip = (x: number, y: number, w: number, h: number, rot: number): [number, number] => [x + (w / 2) * Math.cos(rot) + h * Math.sin(rot), y + (w / 2) * Math.sin(rot) - h * Math.cos(rot)];
// a thin stream of water falling from (x1, y1) to (x2, y2)
const stream = (c: Ctx, x1: number, y1: number, x2: number, y2: number) => { const p = [[x1, y1], [x1 + (x2 - x1) * 0.55, y1 + (y2 - y1) * 0.35], [x2, y2]]; line(c, p, 26, INK); line(c, p, 15, COL.water); };

// a red plastic bucket, bottom centre (x, y)
const bucket = (c: Ctx, x: number, y: number, tw: number, h: number) => {
  const bw = tw * 0.72, ry = tw * 0.13;
  shadow(c, x + tw * 0.1, y + 8, tw * 0.55, tw * 0.1);
  line(c, [[x - tw / 2, y - h], [x - tw * 0.55, y - h - 120], [x + tw * 0.55, y - h - 120], [x + tw / 2, y - h]], 18, INK); line(c, [[x - tw / 2, y - h], [x - tw * 0.55, y - h - 120], [x + tw * 0.55, y - h - 120], [x + tw / 2, y - h]], 8, COL.greyDk);
  const body = () => { c.moveTo(x - tw / 2, y - h); c.lineTo(x - bw / 2, y); c.quadraticCurveTo(x, y + ry, x + bw / 2, y); c.lineTo(x + tw / 2, y - h); c.closePath(); };
  shape(c, body, COL.red); shade(c, body, "#a8321f", tw * 0.16, 0, 0.5);
  shape(c, () => ell(c, x, y - h, tw / 2, ry), "#a8321f", 6);
  shape(c, () => ell(c, x, y - h + 4, tw / 2 - 14, ry - 8), COL.water, 0);
  line(c, [[x - tw * 0.3, y - h * 0.7], [x - tw * 0.26, y - h * 0.25]], 8, "rgba(255,255,255,0.6)");
};

// a plastic tub of ground, bottom centre (x, y): soil, sand or gravel on top
const tub = (c: Ctx, x: number, y: number, w: number, h: number, kind: "soil" | "sand" | "gravel", wetSpot = false) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.55, w * 0.1);
  const tw = w / 2, bw = w * 0.4, ry = w * 0.15;
  const body = () => { c.moveTo(x - tw, y - h); c.lineTo(x - bw, y); c.quadraticCurveTo(x, y + ry * 0.7, x + bw, y); c.lineTo(x + tw, y - h); c.closePath(); };
  shape(c, body, COL.teal); shade(c, body, COL.tealDk, w * 0.14, 0, 0.6);
  const base = kind === "soil" ? COL.soil : kind === "sand" ? SAND : COL.grey;
  shape(c, () => ell(c, x, y - h, tw, ry), base, 6);
  c.save(); c.beginPath(); ell(c, x, y - h, tw - 3, ry - 3); c.clip();
  const r = rnd(kind === "soil" ? 3 : kind === "sand" ? 5 : 8);
  if (kind === "gravel") for (let i = 0; i < 70; i++) { const gx = x + (r() * 2 - 1) * tw, gy = y - h + (r() * 2 - 1) * ry; shape(c, () => ell(c, gx, gy, 14 + r() * 8, 9 + r() * 5, r() * 3), ["#a8a39a", "#c9b79a", "#8d8a85", "#d8d0c0"][Math.floor(r() * 4)], 3); }
  else { for (let i = 0; i < 90; i++) { c.beginPath(); ell(c, x + (r() * 2 - 1) * tw, y - h + (r() * 2 - 1) * ry, kind === "soil" ? 7 + r() * 8 : 3, kind === "soil" ? 5 + r() * 4 : 2.5, r() * 3); c.fillStyle = kind === "soil" ? (r() < 0.5 ? COL.soilDk : "#a87650") : SANDDK; c.fill(); } }
  if (wetSpot) { c.beginPath(); ell(c, x - tw * 0.1, y - h + ry * 0.1, tw * 0.5, ry * 0.65); c.fillStyle = "rgba(122,86,40,0.75)"; c.fill(); }
  c.restore();
  c.beginPath(); ell(c, x, y - h, tw, ry); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};

// a flat slab seen from the front-left above: top-face centre (cx, cy), width w, thickness t
const slab = (c: Ctx, cx: number, cy: number, w: number, t: number, top: string, side: string, sideDk: string) => {
  const dx = w * 0.16, dy = w * 0.22, fl = [cx - w / 2 - dx / 2, cy + dy / 2], fr = [cx + w / 2 - dx / 2, cy + dy / 2], br = [cx + w / 2 + dx / 2, cy - dy / 2], bl = [cx - w / 2 + dx / 2, cy - dy / 2];
  shadow(c, cx + 14, cy + dy / 2 + t + 4, w * 0.62, dy * 0.45);
  shape(c, () => polyP(c, [fl, fr, [fr[0], fr[1] + t], [fl[0], fl[1] + t]]), side);
  shape(c, () => polyP(c, [fr, br, [br[0], br[1] + t], [fr[0], fr[1] + t]]), sideDk);
  shape(c, () => polyP(c, [fl, fr, br, bl]), top);
};

// the phone showing a timer: a round clock with a red wedge; bottom centre (x, y)
const phone = (c: Ctx, x: number, y: number, w: number, h: number, shadowOn = true) => {
  if (shadowOn) shadow(c, x + w * 0.1, y + 6, w * 0.6, w * 0.08);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 28), COL.black, 6);
  shape(c, () => rrect(c, x - w / 2 + 12, y - h + 18, w - 24, h - 36, 14), "#f4f7fa", 3);
  const cx = x, cy = y - h / 2, r = w * 0.34;
  shape(c, () => ell(c, cx, cy, r, r), WHITE, 5);
  c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, r - 3, -Math.PI / 2, 0.9); c.closePath(); c.fillStyle = RED; c.fill();
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[cx + Math.cos(a) * r * 0.82, cy + Math.sin(a) * r * 0.82], [cx + Math.cos(a) * r * 0.95, cy + Math.sin(a) * r * 0.95]], 4); }
  line(c, [[cx, cy], [cx, cy - r * 0.75]], 5); line(c, [[cx, cy], [cx + r * 0.6, cy + r * 0.3]], 5);
};

// ---------------------------------------------------------------- the layered jar (e2)
const JW = 380, JH = 560;
const strawPath = (c: Ctx, x: number, y1: number, y2: number, waterFrom = -1) => {
  line(c, [[x, y1], [x, y2]], 34, INK); line(c, [[x, y1], [x, y2]], 22, "#f6dfe6");
  for (let yy = y1 + 12; yy < y2 - 10; yy += 34) line(c, [[x - 9, yy + 10], [x + 9, yy - 10]], 4, COL.pink);
  if (waterFrom >= 0) line(c, [[x, waterFrom], [x, y2]], 14, COL.water);
};
// the jar, bottom centre (x, y): gravel below, sand, soil on top. water = px of water in the gravel; wet darkens the soil.
// inside() draws what stands in the jar (the straw) before the glass goes over it.
const jar = (c: Ctx, x: number, y: number, water: number, wet: boolean, inside?: () => void) => {
  shadow(c, x + JW * 0.1, y + 8, JW * 0.6, JW * 0.08);
  const body = () => rrect(c, x - JW / 2, y - JH, JW, JH, 26), gT = y - JH * 0.4, sT = y - JH * 0.65, oT = y - JH * 0.88;
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = "#f4f7fa"; c.fillRect(x - JW, y - JH * 2, JW * 2, JH * 2);
  c.fillStyle = COL.water; c.fillRect(x - JW / 2, y - water, JW, water);
  const r = rnd(21);
  for (let gy = y - 28; gy > gT - 20; gy -= 36) for (let gx = x - JW / 2 + 22; gx < x + JW / 2 + 20; gx += 40) { const px = gx + (r() * 14 - 7) + ((Math.round((y - gy) / 36)) % 2) * 18, py = gy + r() * 8 - 4; shape(c, () => ell(c, px, py, 24 + r() * 6, 18 + r() * 4, r() * 3), ["#a8a39a", "#c9b79a", "#8d8a85", "#d8d0c0"][Math.floor(r() * 4)], 4); }
  if (water > 0) { c.fillStyle = "rgba(95,159,211,0.38)"; c.fillRect(x - JW / 2, y - water, JW, water); line(c, [[x - JW / 2, y - water], [x + JW / 2, y - water]], 5, COL.waterDk); }
  c.fillStyle = SAND; c.fillRect(x - JW / 2, sT, JW, gT - sT); c.fillStyle = wet ? "#5a3820" : COL.soil; c.fillRect(x - JW / 2, oT, JW, sT - oT);
  for (let i = 0; i < 160; i++) { c.beginPath(); ell(c, x - JW / 2 + r() * JW, sT + r() * (gT - sT), 3, 2.5, r() * 3); c.fillStyle = SANDDK; c.fill(); }
  for (let i = 0; i < 80; i++) { c.beginPath(); ell(c, x - JW / 2 + r() * JW, oT + r() * (sT - oT), 8 + r() * 8, 5 + r() * 4, r() * 3); c.fillStyle = r() < 0.5 ? "#4a2e1a" : (wet ? "#6e4a30" : "#a87650"); c.fill(); }
  line(c, [[x - JW / 2, gT], [x + JW / 2, gT]], 4); line(c, [[x - JW / 2, sT], [x + JW / 2, sT]], 4);
  c.beginPath(); ell(c, x, oT, JW / 2, JW * 0.06); c.fillStyle = wet ? "#6e4a30" : "#a87650"; c.fill();
  inside?.();
  c.restore();
  shape(c, body, "rgba(214,236,250,0.22)", 7);
  shape(c, () => ell(c, x, y - JH, JW / 2, JW * 0.07), "rgba(255,255,255,0.3)", 5);
  shine(c, [[x - JW * 0.4, y - JH * 0.85], [x - JW * 0.4, y - JH * 0.45]], 9);
};

// ---------------------------------------------------------------- spoon (e4.0)
const spoonHeld = (c: Ctx, bx: number, by: number, a: number, heap: string) => {
  const dx = Math.cos(a), dy = Math.sin(a), s = 1.5;
  line(c, [[bx - dx * 360, by - dy * 360], [bx - dx * 30, by - dy * 30]], 36, INK); line(c, [[bx - dx * 360, by - dy * 360], [bx - dx * 30, by - dy * 30]], 22, COL.steel);
  shape(c, () => ell(c, bx, by, 84, 56, a), COL.steel, 6);
  shape(c, () => ell(c, bx, by, 64, 42, a), COL.steelIn, 3);
  shape(c, () => ell(c, bx + dx * 4, by + dy * 4, 54, 32, a), heap, 3);
  const hx = bx - dx * 230, hy = by - dy * 230;
  hand(c, hx - dx * 70 * s, hy - dy * 70 * s, a, s);
};
const grains = (c: Ctx, x: number, y: number, col: string, n: number, seed: number) => { const r = rnd(seed); for (let i = 0; i < n; i++) shape(c, () => ell(c, x + (r() - 0.5) * 70, y + r() * 90, 8, 6.5, r() * 3), col, 3); };

// ---------------------------------------------------------------- bottles and the matka (e3)
const matka = (c: Ctx, x: number, y: number, r: number, mouth = 0.55, water = false) => {
  shadow(c, x + r * 0.15, y + 8, r * 0.95, r * 0.14);
  const body = () => { c.moveTo(x - r * mouth, y - r * 1.75); c.bezierCurveTo(x - r * 0.55, y - r * 1.45, x - r * 1.05, y - r * 1.25, x - r * 1.05, y - r * 0.7); c.bezierCurveTo(x - r * 1.05, y - r * 0.15, x - r * 0.6, y, x, y); c.bezierCurveTo(x + r * 0.6, y, x + r * 1.05, y - r * 0.15, x + r * 1.05, y - r * 0.7); c.bezierCurveTo(x + r * 1.05, y - r * 1.25, x + r * 0.55, y - r * 1.45, x + r * mouth, y - r * 1.75); c.closePath(); };
  shape(c, body, CLAY); shade(c, body, CLAYDK, r * 0.3, -r * 0.05, 0.6);
  line(c, [[x - r * 0.9, y - r * 0.95], [x - r * 0.62, y - r * 0.4]], 9, "rgba(255,255,255,0.4)");
  shape(c, () => ell(c, x, y - r * 1.75, r * mouth, r * 0.17), water ? COL.water : "#5a2f1a", 6);
  if (water) { c.beginPath(); ell(c, x - r * 0.15, y - r * 1.76, r * 0.25, r * 0.05); c.fillStyle = COL.drop; c.fill(); }
};
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, wrapped: boolean) => {
  shadow(c, x + w * 0.2, y + 8, w * 0.7, w * 0.12);
  const body = () => { c.moveTo(x - w / 2, y - h * 0.82); c.lineTo(x - w / 2, y - 16); c.quadraticCurveTo(x - w / 2, y, x - w / 2 + 16, y); c.lineTo(x + w / 2 - 16, y); c.quadraticCurveTo(x + w / 2, y, x + w / 2, y - 16); c.lineTo(x + w / 2, y - h * 0.82); c.quadraticCurveTo(x + w / 2, y - h * 0.9, x + w * 0.2, y - h * 0.92); c.lineTo(x + w * 0.2, y - h); c.lineTo(x - w * 0.2, y - h); c.lineTo(x - w * 0.2, y - h * 0.92); c.quadraticCurveTo(x - w / 2, y - h * 0.9, x - w / 2, y - h * 0.82); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.3, 0, 0.6);
  shape(c, () => rrect(c, x - w * 0.24, y - h - 30, w * 0.48, 36, 10), COL.teal, 6);
  shine(c, [[x - w * 0.32, y - h * 0.78], [x - w * 0.32, y - h * 0.3]], 9);
  if (wrapped) {
    const ct = y - h * 0.8, L = x - w / 2 - 14, R = x + w / 2 + 14, bt = y + 10;
    const cloth = () => { c.moveTo(L, ct + 8); c.bezierCurveTo(L + 40, ct - 14, L + 90, ct + 26, x, ct + 8); c.bezierCurveTo(x + 40, ct - 10, R - 50, ct + 24, R, ct + 8); c.bezierCurveTo(R + 14, ct + (bt - ct) * 0.5, R + 10, bt - 30, R - 2, bt - 6); c.bezierCurveTo(R - 40, bt + 14, x + 60, bt - 14, x, bt + 4); c.bezierCurveTo(x - 60, bt + 18, L + 40, bt - 12, L + 2, bt - 6); c.bezierCurveTo(L - 12, bt - 30, L - 14, ct + (bt - ct) * 0.5, L, ct + 8); c.closePath(); };
    shape(c, cloth, "#fbf4df", 6); shade(c, cloth, "#d9c9a0", w * 0.28, 0, 0.6);
    c.save(); c.beginPath(); cloth(); c.clip();
    c.fillStyle = "rgba(95,159,211,0.38)"; c.fillRect(L - 20, ct + (bt - ct) * 0.4, R - L + 40, bt - ct);
    for (const fx of [-0.3, 0.0, 0.3]) { c.beginPath(); c.moveTo(x + w * fx, ct + 20); c.bezierCurveTo(x + w * fx + 18, ct + (bt - ct) * 0.35, x + w * fx - 18, ct + (bt - ct) * 0.65, x + w * fx + 4, bt - 10); c.strokeStyle = "rgba(43,35,64,0.45)"; c.lineWidth = 5; c.lineCap = "round"; c.stroke(); }
    line(c, [[L, bt - 60], [R, bt - 60]], 9, COL.blue);
    c.restore();
    shape(c, () => { c.moveTo(R - 6, ct + 30); c.bezierCurveTo(R + 50, ct + 20, R + 80, ct + 90, R + 56, ct + 150); c.lineTo(R + 30, ct + 130); c.lineTo(R + 14, ct + 160); c.bezierCurveTo(R - 4, ct + 110, R - 10, ct + 70, R - 6, ct + 30); c.closePath(); }, "#fbf4df", 5);
    for (const [dx, dy] of [[-0.3, 0.3], [0.2, 0.5], [0, 0.78]]) drop(c, x + w * dx, ct + (bt - ct) * dy, 9);
    drop(c, R + 40, ct + 215, 9); drop(c, x - w * 0.2, bt + 40, 9); drop(c, x + w * 0.25, bt + 62, 9);
  }
};

// ---- the sunny sill (e4)
// ---------------------------------------------------------------- the sunny sill (e4)
const sill = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 120, 40, 840, 430, 10), COL.sky, 8);
  shape(c, () => ell(c, 340, 190, 84, 84), COL.yellow, 6);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[340 + Math.cos(a) * 108, 190 + Math.sin(a) * 108], [340 + Math.cos(a) * 150, 190 + Math.sin(a) * 150]], 9, COL.orange); }
  line(c, [[540, 40], [540, 470]], 8); line(c, [[120, 255], [960, 255]], 8);
  shape(c, () => polyP(c, [[0, 470], [1080, 470], [1080, 1080], [0, 1080]]), "#e3d6bd", 6);
  c.beginPath(); c.moveTo(130, 470); c.lineTo(550, 470); c.lineTo(900, 1080); c.lineTo(300, 1080); c.closePath(); c.fillStyle = "rgba(255,226,110,0.32)"; c.fill();
};
const darkPlate = (c: Ctx) => {
  shadow(c, 560, 925, 450, 190);
  shape(c, () => ell(c, 540, 830, 450, 200), "#6b7385");
  shape(c, () => ell(c, 540, 822, 380, 160), "#4f586a", 5);
  line(c, [[200, 880], [260, 930], [340, 960]], 8, "rgba(255,255,255,0.3)");
};
const SPOTS: [number, number][] = [[330, 800], [545, 850], [760, 800]];

// ================================================================ cards
// setup.e1.0
const su_e1_0 = (c: Ctx) => {
  ground(c);
  mug(c, 270, 540, 280, 370, 0.7, 0.7);
  bucket(c, 760, 540, 380, 330);
  tub(c, 135, 1010, 245, 175, "soil");
  tub(c, 390, 1010, 245, 175, "sand");
  tub(c, 645, 1010, 245, 175, "gravel");
  slab(c, 905, 930, 230, 26, "#7fb6c9", "#5f98ad", "#467e92");
  slab(c, 905, 904, 180, 24, "#e8eef2", "#cdd6dd", "#aab4bd");
};
// setup.e1.1
const su_e1_1 = (c: Ctx) => {
  ground(c);
  const rot = 0.85, mx = 260, my = 560, w = 200, h = 250, [lx, ly] = lip(mx, my, w, h, rot);
  tub(c, 560, 1000, 480, 230, "sand", true);
  stream(c, lx, ly, lx + 45, 790);
  for (const [dx, dy] of [[-20, 0], [60, -8], [95, 10]]) drop(c, lx + 45 + dx, 780 + dy, 6);
  mug(c, mx, my, w, h, 0.65, 0, rot);
  hand(c, 175, 311, 0.5, 1.5);
  phone(c, 740, 650, 190, 360, false);
  handL(c, 940, 520, 0.1, 1.3);
};
// setup.e1.2
const su_e1_2 = (c: Ctx) => {
  ground(c);
  phone(c, 540, 400, 210, 350);
  slab(c, 290, 830, 440, 28, "#7fb6c9", "#5f98ad", "#467e92");
  slab(c, 290, 800, 350, 26, "#e8eef2", "#cdd6dd", "#aab4bd");
  c.save(); c.translate(290, 800); c.scale(1.35, 1.35);
  shape(c, () => { c.moveTo(-90, -10); c.bezierCurveTo(-80, -70, 20, -80, 70, -50); c.bezierCurveTo(120, -20, 80, 40, 10, 50); c.bezierCurveTo(-60, 55, -100, 30, -90, -10); c.closePath(); }, COL.water, 4);
  line(c, [[-55, -30], [-10, -52]], 7, WHITE);
  c.restore();
  tub(c, 810, 1010, 400, 200, "sand");
};
// setup.e2.0
const su_e2_0 = (c: Ctx) => {
  ground(c);
  const x = 540, y = 990, sx = x - JW / 2 + 38;
  jar(c, x, y, 0, false, () => strawPath(c, sx, y - JH - 90, y - 24));
  strawPath(c, sx, y - JH - 150, y - JH - 4);
};
// setup.e2.1
const su_e2_1 = (c: Ctx) => {
  ground(c);
  const x = 760, y = 990, sx = x - JW / 2 + 38;
  jar(c, x, y, 130, true, () => strawPath(c, sx, y - JH - 40, y - 24));
  strawPath(c, sx, y - JH - 90, y - JH - 4);
  line(c, [[x - JW / 2 - 12, y - 130], [x + JW / 2 + 12, y - 130]], 9, INK);
  const rot = 0.85, mx = 300, my = 330, w = 200, h = 250, [lx, ly] = lip(mx, my, w, h, rot);
  stream(c, lx, ly, lx + 10, y - JH * 0.88 + 4);
  for (const [dx, dy] of [[-30, 0], [40, -4], [70, 8]]) drop(c, lx + 10 + dx, y - JH * 0.88 - 10 + dy, 6);
  mug(c, mx, my, w, h, 0.65, 0, rot);
  hand(c, 205, 80, 0.5, 1.5);
};
// setup.e2.2
const su_e2_2 = (c: Ctx) => {
  ground(c);
  const x = 620, y = 990, sx = x - JW / 2 + 38, top = y - JH, st = 354;
  jar(c, x, y, 70, false, () => strawPath(c, sx, st, y - 24, 400));
  strawPath(c, sx, st, top - 4, 400);
  // marker lines: where the water was and where it is now
  line(c, [[x - JW / 2 - 12, y - 160], [x + JW / 2 + 70, y - 160]], 9, INK);
  line(c, [[x - JW / 2 - 12, y - 70], [x + JW / 2 + 70, y - 70]], 9, INK);
  arrow(c, [[x + JW / 2 + 40, y - 150], [x + JW / 2 + 40, y - 85]]);
  // the syringe sits on the top end of the straw: nozzle over the straw, wide barrel, plunger pulled up
  const bt = 136, bb = 314, stop = 214;
  shape(c, () => polyP(c, [[sx - 15, st + 6], [sx + 15, st + 6], [sx + 42, bb], [sx - 42, bb]]), COL.steel, 6);
  c.save(); c.beginPath(); rrect(c, sx - 50, bt, 100, bb - bt, 10); c.clip(); c.fillStyle = "rgba(235,246,252,0.9)"; c.fillRect(sx - 60, bt, 120, bb - bt); c.fillStyle = COL.water; c.fillRect(sx - 60, stop, 120, bb - stop); c.restore();
  shape(c, () => rrect(c, sx - 10, 36, 20, stop - 36, 4), COL.steel, 5);
  shape(c, () => rrect(c, sx - 47, stop - 14, 94, 26, 6), COL.black, 5);
  shape(c, () => rrect(c, sx - 50, bt, 100, bb - bt, 10), "rgba(214,236,250,0.3)", 6);
  for (let i = 0; i < 4; i++) line(c, [[sx + 14, 242 + i * 18], [sx + 46, 242 + i * 18]], 4);
  shine(c, [[sx - 34, 154], [sx - 34, 194]], 7);
  shape(c, () => rrect(c, sx - 68, bt - 8, 136, 16, 6), COL.steel, 5);
  shape(c, () => rrect(c, sx - 44, 22, 88, 16, 7), COL.steel, 5);
  handL(c, sx + 84, 92, 0, 1.2);
  arrow(c, [[sx - 100, 200], [sx - 100, 100]]);
};
// setup.e3.0
const su_e3_0 = (c: Ctx) => {
  ground(c);
  matka(c, 250, 880, 215);
  bottle(c, 610, 880, 170, 540, false);
  bottle(c, 880, 880, 170, 540, true);
};
// setup.e3.1
const su_e3_1 = (c: Ctx) => {
  ground(c);
  const x = 500, y = 960, r = 250, my = y - r * 1.75;
  matka(c, x, y, r, 0.62, true);
  // the thermometer standing in the water, bulb under the surface
  const tx = x + 10;
  shape(c, () => rrect(c, tx - 30, 110, 60, my - 100, 28), "#f4f7fa", 6);
  line(c, [[tx, my + 6], [tx, 280]], 20, RED);
  shape(c, () => ell(c, tx, my + 8, 34, 34), RED, 6);
  c.save(); c.beginPath(); c.rect(0, my, D1, 200); c.clip(); c.beginPath(); ell(c, x, my, r * 0.62, r * 0.17); c.fillStyle = "rgba(143,195,234,0.6)"; c.fill(); c.restore();
  for (let i = 0; i < 9; i++) line(c, [[tx - 30, 150 + i * 36], [tx - (i % 2 ? 46 : 62), 150 + i * 36]], 5);
  write(c, "28°", 110, 230, 110, INK, 12);
  handL(c, tx + 98, 200, 0.0, 1.4);
};
const D1 = 1080;
// setup.e3.2
const su_e3_2 = (c: Ctx) => {
  ground(c);
  const x = 480, y = 960, r = 300;
  matka(c, x, y, r, 0.55);
  c.save(); c.beginPath(); c.moveTo(x + r * 0.2, y - r * 1.6); c.bezierCurveTo(x + r * 0.7, y - r * 1.4, x + r * 1.05, y - r * 1.2, x + r * 1.05, y - r * 0.7); c.bezierCurveTo(x + r * 1.05, y - r * 0.2, x + r * 0.6, y, x + r * 0.2, y); c.closePath(); c.fillStyle = "rgba(90,40,20,0.25)"; c.fill(); c.restore();
  const rr = rnd(9);
  for (let i = 0; i < 26; i++) { const a = rr() * 6.28, d = rr() * 0.9; const dx = x + Math.cos(a) * r * d * 0.9, dy = y - r * 0.75 + Math.sin(a) * r * d * 0.85; drop(c, dx, dy, 7 + rr() * 4); }
  handL(c, 950, 620, -0.05, 1.5, true);
};
// setup.e4.0
const su_e4_0 = (c: Ctx) => {
  ground(c);
  const gy = 960, gw = 270, gh = 360;
  glass(c, 200, gy, gw, gh, 0.7);
  glass(c, 540, gy, gw, gh, 0.7);
  glass(c, 880, gy, gw, gh, 0.7, MUDW);
  const r = rnd(4);
  for (let i = 0; i < 16; i++) shape(c, () => ell(c, 540 - 80 + r() * 160, gy - 14 - r() * 24, 9, 7, r() * 3), WHITE, 3);
  for (let i = 0; i < 14; i++) { c.beginPath(); ell(c, 880 - 80 + r() * 160, gy - 40 - r() * 180, 7, 5, r() * 3); c.fillStyle = COL.soilDk; c.fill(); }
  const a = Math.PI / 2 + 0.2;
  grains(c, 515, 580, WHITE, 5, 11); grains(c, 855, 580, COL.soil, 5, 12);
  spoonHeld(c, 540, 540, a, WHITE);
  spoonHeld(c, 880, 540, a, COL.soil);
};
// setup.e4.1
const su_e4_1 = (c: Ctx) => {
  sill(c); darkPlate(c);
  SPOTS.forEach(([x, y], i) => {
    shape(c, () => ell(c, x, y, 92, 58), i === 2 ? MUDW : "#9ccbee", 5);
    line(c, [[x - 50, y - 18], [x - 14, y - 32]], 8, "rgba(255,255,255,0.8)");
  });
};
// setup.e4.2
const su_e4_2 = (c: Ctx) => {
  sill(c); darkPlate(c);
  const [a, b, d] = SPOTS;
  c.beginPath(); ell(c, a[0], a[1], 90, 56); c.strokeStyle = "rgba(220,225,235,0.55)"; c.lineWidth = 7; c.stroke();
  c.beginPath(); ell(c, b[0], b[1], 88, 55); c.strokeStyle = WHITE; c.lineWidth = 26; c.stroke();
  c.beginPath(); ell(c, b[0], b[1], 74, 44); c.strokeStyle = "rgba(255,255,255,0.45)"; c.lineWidth = 5; c.stroke();
  shape(c, () => { c.moveTo(d[0] - 85, d[1]); c.bezierCurveTo(d[0] - 80, d[1] - 60, d[0] + 60, d[1] - 62, d[0] + 88, d[1] - 5); c.bezierCurveTo(d[0] + 80, d[1] + 55, d[0] - 60, d[1] + 60, d[0] - 85, d[1]); c.closePath(); }, "#c9a37a", 3);
};

export const su_waterWaterSourcesAndUses = cards("sci.water.water-sources-and-uses.L3 set-up", [su_e1_0, su_e1_1, su_e1_2, su_e2_0, su_e2_1, su_e2_2, su_e3_0, su_e3_1, su_e3_2, su_e4_0, su_e4_1, su_e4_2]);
