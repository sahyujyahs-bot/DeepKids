import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, glass, bowl, seed, write, cards } from "./flatKit";

// sci.air.air-around-us.L3 · picture cards (intro, cover, activities, terms, explanations).
// Child and grown-up are the same as on the set-up cards. Air and gas are shown as blue dots.

const AIR = "#9ccbef", AIRDK = "#5b8fd6", GAS = "#b9b4ab";
const CLEAR = "rgba(224,240,250,0.7)", NONE = "rgba(0,0,0,0)";

const dot = (c: Ctx, x: number, y: number, r: number, col: string = AIR) => shape(c, () => ell(c, x, y, r, r), col, Math.max(2.5, r * 0.22));
const table = (c: Ctx, y: number) => {
  shape(c, () => rrect(c, -20, y, 1120, 70, 4), COL.wood, 6);
  c.fillStyle = COL.woodDk; c.fillRect(-14, y + 44, 1108, 20);
  line(c, [[-14, y + 64], [1094, y + 64]], 6);
};
// a girl's head and shoulders seen from the side, facing right; puff = cheeks full of air
const bust = (c: Ctx, x: number, y: number, r: number, bottom: number, puff = false, mouthO = false) => {
  shape(c, () => rrect(c, x - r * 1.25, y + r * 0.95, r * 2.5, bottom - y - r * 0.95 + 30, r * 0.7), CLOTH.child);
  shade(c, () => rrect(c, x - r * 1.25, y + r * 0.95, r * 2.5, bottom - y - r * 0.95 + 30, r * 0.7), CLOTH.childDk, r * 0.5, 0);
  shape(c, () => rrect(c, x - r * 0.25, y + r * 0.7, r * 0.7, r * 0.5, 6), SKIN.child, 5);
  shape(c, () => ell(c, x - r * 0.95, y - r * 0.55, r * 0.45, r * 0.45), CLOTH.hair, 5);
  const head = () => ell(c, x, y, r, r * 1.05);
  shape(c, head, SKIN.child);
  if (puff) shape(c, () => ell(c, x + r * 0.8, y + r * 0.42, r * 0.36, r * 0.36), SKIN.child, 5);
  shape(c, () => ell(c, x + r * 1.0, y + r * 0.02, r * 0.17, r * 0.17), SKIN.child, 5);
  c.save(); c.beginPath(); head(); c.clip(); c.beginPath(); ell(c, x - r * 0.45, y - r * 0.5, r * 1.15, r * 0.95); c.fillStyle = CLOTH.hair; c.fill(); c.restore();
  c.beginPath(); head(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  shape(c, () => ell(c, x - r * 0.1, y + r * 0.2, r * 0.12, r * 0.2), SKIN.childDk, 4);
  shape(c, () => ell(c, x + r * 0.5, y - r * 0.05, r * 0.09, r * 0.13), INK, 0);
  shape(c, () => ell(c, x + r * 1.06, y + r * (puff ? 0.58 : 0.5), r * 0.1, r * 0.1), mouthO || puff ? "#c8564a" : INK, 3);
};
const balloon = (c: Ctx, x: number, y: number, rx: number, ry: number, col: string = COL.pink, dk = "#d9708e") => {
  const b = () => { c.moveTo(x, y + ry); c.bezierCurveTo(x - rx * 1.05, y + ry * 0.75, x - rx * 1.15, y - ry * 1.0, x, y - ry); c.bezierCurveTo(x + rx * 1.15, y - ry * 1.0, x + rx * 1.05, y + ry * 0.75, x, y + ry); c.closePath(); };
  shape(c, b, col); shade(c, b, dk, rx * 0.3, ry * 0.1);
  shape(c, () => polyP(c, [[x, y + ry - 4], [x - rx * 0.12, y + ry + ry * 0.14], [x + rx * 0.12, y + ry + ry * 0.14]]), dk, 4);
  line(c, [[x - rx * 0.5, y - ry * 0.35], [x - rx * 0.3, y - ry * 0.7]], Math.max(4, rx * 0.1), WHITE);
};
// a clear plastic bottle standing on y, neck up. lvl = water level 0..1 of the height
const bottlePath = (c: Ctx, x: number, y: number, w: number, h: number, nw: number) => {
  const r = w / 2, n = nw / 2, sy = y - h * 0.66, ny = y - h * 0.82, sp = sy - ny;
  c.moveTo(x - r + 16, y); c.lineTo(x + r - 16, y); c.quadraticCurveTo(x + r, y, x + r, y - 16); c.lineTo(x + r, sy);
  c.bezierCurveTo(x + r, sy - sp * 0.55, x + n, ny + sp * 0.45, x + n, ny); c.lineTo(x + n, y - h); c.lineTo(x - n, y - h); c.lineTo(x - n, ny);
  c.bezierCurveTo(x - n, ny + sp * 0.45, x - r, sy - sp * 0.55, x - r, sy); c.lineTo(x - r, y - 16); c.quadraticCurveTo(x - r, y, x - r + 16, y); c.closePath();
};
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, nw: number, inside?: () => void, lvl = 0, liquid: string = COL.water) => {
  const p = () => bottlePath(c, x, y, w, h, nw);
  shape(c, p, CLEAR, 0);
  c.save(); c.beginPath(); p(); c.clip();
  if (lvl > 0) { c.fillStyle = liquid; c.fillRect(x - w, y - h * lvl, w * 2, h * lvl + 5); }
  if (inside) inside();
  c.restore();
  shape(c, p, NONE, 6);
  shine(c, [[x - w * 0.36, y - h * 0.5], [x - w * 0.36, y - h * 0.12]], 8);
};
const lip = (c: Ctx, x: number, y: number, h: number, nw: number) => shape(c, () => rrect(c, x - nw / 2 - 9, y - h - 6, nw + 18, 20, 7), CLEAR, 5);
const arm = (c: Ctx, x: number, y: number, an: number, s: number, open = false) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s); shape(c, () => rrect(c, -78 - 900, -33, 900 + 56, 66, 10), CLOTH.child, 6); c.restore();
  hand(c, x, y, an, s, SKIN.child, CLOTH.child, open);
};
const kscale = (c: Ctx, cx: number, ty: number, hw: number, txt: string) => {
  shadow(c, cx + 10, ty + 230, hw * 1.05, 28);
  shape(c, () => polyP(c, [[cx - hw * 0.8, ty], [cx + hw * 0.8, ty], [cx + hw, ty + 150], [cx - hw, ty + 150]]), COL.teal);
  shape(c, () => polyP(c, [[cx - hw, ty + 150], [cx + hw, ty + 150], [cx + hw, ty + 225], [cx - hw, ty + 225]]), COL.tealDk);
  shape(c, () => rrect(c, cx - hw * 0.4, ty + 164, hw * 0.8, 52, 6), "#22303a", 5);
  const h = 34, wd = txt.length * h * 0.8; write(c, txt, cx - wd / 2 + 4, ty + 172, h, "#c9f06b", 6);
};
// a room drawn as a clear box
const room = (c: Ctx, cx: number, cy: number, s: number, dots = true) => {
  const T1 = [cx - s, cy - s * 0.5], T2 = [cx, cy - s], T3 = [cx + s, cy - s * 0.5], T4 = [cx, cy], B1 = [cx - s, cy + s * 0.5], B4 = [cx, cy + s], B3 = [cx + s, cy + s * 0.5];
  shadow(c, cx + s * 0.2, cy + s * 1.05, s * 1.15, s * 0.16);
  shape(c, () => polyP(c, [T1, T4, B4, B1]), "#dcecf7", 6); shape(c, () => polyP(c, [T4, T3, B3, B4]), "#c4dcee", 6); shape(c, () => polyP(c, [T1, T2, T3, T4]), "#eef6fb", 6);
  if (dots) { const r = rnd(4); for (let i = 0; i < 14; i++) { const u = r(), v = r(); dot(c, cx - s * 0.85 + u * s * 0.75, cy - s * 0.1 + v * s * 0.55 + u * s * 0.2, 8); } for (let i = 0; i < 12; i++) { const u = r(), v = r(); dot(c, cx + s * 0.12 + u * s * 0.75, cy + s * 0.05 + v * s * 0.5 - u * s * 0.2, 8); } }
  return { T1, T2, T3, T4, B1, B3, B4 };
};
const lungs = (c: Ctx, x: number, y: number, s: number) => {
  line(c, [[x, y - s * 0.9], [x, y - s * 0.2]], s * 0.14, INK); line(c, [[x, y - s * 0.9], [x, y - s * 0.2]], s * 0.14 - 8, "#f3c6c0");
  for (const d of [-1, 1]) {
    const p = () => { c.moveTo(x + d * s * 0.1, y - s * 0.3); c.bezierCurveTo(x + d * s * 0.2, y - s * 0.5, x + d * s * 0.75, y - s * 0.45, x + d * s * 0.7, y + s * 0.3); c.bezierCurveTo(x + d * s * 0.68, y + s * 0.75, x + d * s * 0.15, y + s * 0.75, x + d * s * 0.1, y + s * 0.3); c.closePath(); };
    shape(c, p, "#ef8f9e", 5); shade(c, p, "#d9657c", s * 0.12 * d, s * 0.05);
  }
};
const wave = (c: Ctx, x: number, y: number, len: number, amp: number, col: string = AIRDK, w = 7) => { const pts: number[][] = []; for (let i = 0; i <= 24; i++) pts.push([x + (len * i) / 24, y + Math.sin((i / 24) * Math.PI * 3) * amp]); line(c, pts, w, col); };
const leafBig = (c: Ctx, x: number, y: number, len: number, an: number, col: string = COL.leaf) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len, nx = -Math.sin(an) * len * 0.34, ny = Math.cos(an) * len * 0.34, mx = (x + tx) / 2, my = (y + ty) / 2;
  shape(c, () => { c.moveTo(x, y); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, x, y); c.closePath(); }, col, 6);
  line(c, [[x, y], [mx + (tx - mx) * 0.7, my + (ty - my) * 0.7]], 4, COL.leafDk);
};

// ---------------------------------------------------------------- syringe, drawn at scale s with its nozzle at (ox, oy)
const RL = 260, NZ = 220, B0 = 360, B1 = 680, PX = 30, SCY = 540, BH = 80;
const syringe = (c: Ctx, ox: number, oy: number, s: number, ml: number, water: boolean, draw?: (sx: number) => void) => {
  c.save(); c.translate(ox - NZ * s, oy - SCY * s); c.scale(s, s);
  const cy = SCY, sx = B0 + ml * PX, outline = () => polyP(c, [[NZ, cy - 16], [320, cy - 16], [B0, cy - BH], [B1, cy - BH], [B1, cy + BH], [B0, cy + BH], [320, cy + 16], [NZ, cy + 16]]);
  shadow(c, 620, cy + BH + 30, 440, 22);
  shape(c, outline, CLEAR, 0);
  if (water) { c.save(); c.beginPath(); outline(); c.clip(); c.fillStyle = COL.water; c.fillRect(NZ - 5, cy - BH - 5, sx - NZ + 5, BH * 2 + 10); c.restore(); }
  else { c.save(); c.beginPath(); outline(); c.clip(); const r = rnd(5); for (let i = 0; i < 6; i++) dot(c, 400 + r() * (sx - 450 + 1) , cy - 40 + r() * 80, 7); c.restore(); }
  shape(c, () => rrect(c, sx, cy - 16, RL, 32, 4), COL.blue, 5);
  c.fillStyle = COL.blueDk; c.fillRect(sx + 4, cy + 4, RL - 8, 9);
  shape(c, () => rrect(c, sx - 30, cy - BH + 5, 30, BH * 2 - 10, 6), COL.black, 5);
  shape(c, () => rrect(c, sx + RL, cy - 86, 24, 172, 10), COL.blue, 5);
  c.fillStyle = COL.blueDk; c.fillRect(sx + RL + 12, cy - 80, 8, 160);
  line(c, [[NZ, cy - 16], [320, cy - 16], [B0, cy - BH], [B1, cy - BH], [B1, cy + BH], [B0, cy + BH], [320, cy + 16], [NZ, cy + 16], [NZ, cy - 16]], 6);
  shape(c, () => rrect(c, B1 - 4, cy - 112, 22, 224, 8), COL.steelIn, 5);
  if (draw) draw(sx);
  c.restore();
  return sx;
};

// ---------------------------------------------------------------- 0 intro
const intro = (c: Ctx) => {
  ground(c);
  const bx = 640, by = 890, bw = 300, bh = 520, nw = 84;
  shadow(c, bx + 30, by + 8, 190, 22);
  bottle(c, bx, by, bw, bh, nw, () => { balloon(c, bx, by - bh + 120, 50, 66); }, 0);
  lip(c, bx, by, bh, nw);
  shape(c, () => rrect(c, bx - nw / 2 - 12, by - bh - 26, nw + 24, 44, 12), COL.pink, 5);
  shape(c, () => ell(c, bx, by - bh - 26, nw / 2 + 4, 8), "#d9708e", 4);
  table(c, by);
  bust(c, 300, 300, 125, by, true);
  arrow(c, [[455, 330], [535, 330]]);
};

// ---------------------------------------------------------------- 1 cover
const summary = (c: Ctx) => {
  ground(c);
  // a glass of chana with water poured in and bubbles
  const gx = 600, gy = 900, gw = 400, gh = 560, top = gw / 2, bot = gw * 0.4;
  const body = () => { c.moveTo(gx - top, gy - gh); c.lineTo(gx + top, gy - gh); c.lineTo(gx + bot, gy); c.lineTo(gx - bot, gy); c.closePath(); };
  shadow(c, gx + 40, gy + 8, 260, 26);
  shape(c, body, CLEAR, 0);
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = COL.water; c.fillRect(gx - top, gy - gh * 0.62, gw, gh);
  const r = rnd(9);
  for (let row = 0; row < 8; row++) for (let i = 0; i < 6; i++) { const px = gx - 150 + i * 60 + (row % 2) * 30 + r() * 8, py = gy - 38 - row * 52 + r() * 8; if (py > gy - gh * 0.8) shape(c, () => ell(c, px, py, 29, 25, r() * 3), "#d29a52", 4); }
  for (let i = 0; i < 9; i++) dot(c, gx - 150 + r() * 300, gy - gh * 0.62 + 20 + r() * 150, 9 + r() * 6, WHITE);
  c.restore();
  shape(c, body, NONE, 6);
  shine(c, [[gx - 150, gy - gh * 0.85], [gx - 120, gy - 80]], 8);
  // water poured in from a jug is left out; bubbles rise
  for (let i = 0; i < 4; i++) dot(c, gx - 90 + i * 70, gy - gh * 0.9 - (i % 2) * 50, 11 + i * 2, WHITE);
  arrow(c, [[gx - 20, gy - gh * 0.62 - 20], [gx - 20, gy - gh * 0.62 - 120]]);
  // a blown-up balloon and a leaf at the sides
  balloon(c, 220, 520, 105, 130);
  line(c, [[220, 650], [230, 760]], 6);
  leafBig(c, 900, 820, 190, -2.2, COL.leaf); leafBig(c, 900, 820, 170, -0.9, COL.greenLt);
  line(c, [[900, 820], [900, 900]], 10);
  wave(c, 120, 220, 220, 14); wave(c, 700, 160, 220, 14);
};

// ---------------------------------------------------------------- flows
const gl = (c: Ctx, x: number, y: number, w: number, h: number, fn: (xx: number) => void, lvl: number, liquid: string = COL.water) => {
  const top = w / 2, bot = w * 0.4, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  shape(c, body, CLEAR, 0);
  c.save(); c.beginPath(); body(); c.clip();
  if (lvl > 0) { c.fillStyle = liquid; c.fillRect(x - top, y - h * lvl, w, h * lvl + 5); }
  fn(x); c.restore();
  shape(c, body, NONE, 6); shape(c, () => ell(c, x, y - h, top, w * 0.08), "rgba(255,255,255,0.35)", 5);
  shine(c, [[x - top * 0.65, y - h * 0.85], [x - bot * 0.7, y - h * 0.2]], 7);
};
const chanaSeed = (c: Ctx, x: number, y: number, r: number, rot: number) => {
  const b = () => ell(c, x, y, r, r * 0.86, rot);
  shape(c, b, "#d29a52", Math.max(2.5, r * 0.16));
  c.save(); c.beginPath(); b(); c.clip(); c.beginPath(); ell(c, x + r * 0.3, y + r * 0.3, r, r * 0.86, rot); c.fillStyle = "#9a6528"; c.globalAlpha = 0.55; c.fill(); c.restore(); c.globalAlpha = 1;
  shape(c, () => ell(c, x - r * 0.35, y - r * 0.3, r * 0.28, r * 0.16, rot), "#f0cf8f", 0);
};
const chanaFill = (c: Ctx, x: number, y: number, w: number, h: number, to: number, seedN: number) => {
  const r = rnd(seedN), rr = w * 0.072;
  for (let row = 0, ry = y - rr; ry > y - h * to; row++, ry -= rr * 1.4) { const avail = w * 0.4 - rr * 1.1, n = Math.floor((avail * 2) / (rr * 1.6)) + 1; for (let i = 0; i < n; i++) chanaSeed(c, x - avail + (i * avail * 2) / (n - 1) + (row % 2) * 6 + (r() - 0.5) * 5, ry + (r() - 0.5) * 5, rr, r() * 3); }
};
const flowE1 = (c: Ctx) => {
  ground(c);
  const gy = 880, gw = 360, gh = 520, tf = 0.8;
  const tape = (x: number) => { const ty = gy - gh * tf; shape(c, () => polyP(c, [[x - gw * 0.46, ty - 14], [x + gw * 0.46, ty - 14], [x + gw * 0.46, ty + 14], [x - gw * 0.46, ty + 14]]), COL.yellow, 4); };
  gl(c, 290, gy, gw, gh, (x) => { chanaFill(c, x, gy, gw, gh, tf, 5); for (let i = 0; i < 7; i++) dot(c, x - 110 + (i % 4) * 70, gy - gh * 0.55 + (i % 3) * 40 - i * 6, 10, WHITE); }, 0.5);
  tape(290);
  gl(c, 790, gy, gw, gh, () => {}, 0.34);
  tape(790);
  const ty = gy - gh * tf, wy = gy - gh * 0.34;
  arrow(c, [[640, ty + 20], [640, wy - 20]]);
  line(c, [[610, wy], [670, wy]], 6, RED);
  arrow(c, [[500, 300], [590, 300]]); arrow(c, [[440, 300], [440, 300]], RED, 1);
  table(c, gy);
};
const flowE2 = (c: Ctx) => {
  ground(c);
  const ox = 140;
  const row = (y: number, ml: number, water: boolean) => {
    const sx = syringe(c, ox, y, 1, ml, water, (sx) => {
      const x0 = B0 + 10 * PX, by = SCY - BH - 28;
      line(c, [[x0, SCY - BH - 6], [x0, SCY + BH + 6]], 7, RED);
      line(c, [[x0, by], [sx, by]], 9, RED); line(c, [[sx, by - 14], [sx, by + 14]], 9, RED);
    });
    const disc = ox + (sx + RL + 24 - NZ);
    arrow(c, [[disc + 90, y - 20], [disc - 20, y - 20]]);
  };
  row(330, 5, false);
  row(750, 9.3, true);
};

const flowA1 = (c: Ctx) => {
  ground(c);
  const bx = 600, by = 890, bw = 300, bh = 520, nw = 84;
  shadow(c, bx + 30, by + 8, 190, 22);
  bottle(c, bx, by, bw, bh, nw, () => { balloon(c, bx, by - bh * 0.5, 120, 190); }, 0);
  lip(c, bx, by, bh, nw);
  shape(c, () => rrect(c, bx - nw / 2 - 12, by - bh - 26, nw + 24, 44, 12), COL.pink, 5);
  shape(c, () => ell(c, bx, by - bh - 26, nw / 2 + 4, 8), "#d9708e", 4);
  // the small hole at the bottom, the finger on it
  shape(c, () => ell(c, bx + bw / 2 - 2, by - 60, 12, 12), INK, 0);
  table(c, by);
  bust(c, 280, 300, 125, by, true);
  arrow(c, [[435, 330], [510, 330]]);
  arm(c, bx + bw / 2 + 125, by - 70, Math.PI, 1.0);
  arrow(c, [[960, by - 230], [bx + bw / 2 + 20, by - 80]]);
};
const flowA2 = (c: Ctx) => {
  ground(c);
  const x = 520, gy = 900, gw = 340, gh = 420, lvl = 0.5;
  const ly = gy - gh * lvl, J = "#f6d35a";
  gl(c, x, gy, gw, gh, () => {}, lvl, J);
  // the straw, lifted out; yellow water held inside by the finger
  const sx = x + 30, st = 110, sb = 520;
  shape(c, () => rrect(c, sx - 24, st, 48, sb - st, 14), "rgba(240,248,255,0.8)", 6);
  shape(c, () => rrect(c, sx - 14, 300, 28, sb - 300, 10), J, 0);
  shape(c, () => rrect(c, sx - 24, st, 48, sb - st, 14), NONE, 6);
  line(c, [[sx - 12, 140], [sx - 12, 280]], 6, WHITE);
  // drops fall from the bottom? no: the water stays. a few drops mark the glass
  shape(c, () => ell(c, sx, ly - 2, 60, 12), "rgba(255,255,255,0.45)", 0);
  arm(c, 720, 175, Math.PI, 1.1, true);
  arrow(c, [[sx + 140, 560], [sx + 140, 380]]);
  table(c, gy);
};
const flowA3 = (c: Ctx) => {
  ground(c);
  const h = 560, y = 960, sh = y - h * 0.74;
  const one = (x: number, big: boolean) => {
    const rx = big ? h * 0.2 : h * 0.14;
    if (big) shape(c, () => ell(c, x, sh + h * 0.14, h * 0.2, h * 0.15), CLOTH.child);
    person(c, x, y, h, { armL: [2.7, 2.3], armR: [0.45, 0.8] });
    const sy = sh + h * 0.17;
    c.beginPath(); c.ellipse(x, sy, rx, h * 0.026, 0, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 16; c.stroke(); c.strokeStyle = "#fffaf0"; c.lineWidth = 8; c.stroke();
  };
  one(290, false); one(790, true);
  arrow(c, [[420, 560], [650, 560]]);
  // breath out and in
  arrow(c, [[170, sh - 130], [170, sh - 30]]); arrow(c, [[920, sh - 30], [920, sh - 130]]);
};
const bottleSoda = (c: Ctx, x: number, y: number, cap: boolean) => {
  bottle(c, x, y, 150, 340, 54, () => { const r = rnd(3); for (let i = 0; i < 8; i++) dot(c, x - 45 + r() * 90, y - 40 - r() * 170, 6 + r() * 3, WHITE); }, 0.58, "#cfe6f6");
  if (cap) shape(c, () => rrect(c, x - 33, y - 360, 66, 30, 8), COL.red, 5);
};
const flowA4 = (c: Ctx) => {
  ground(c);
  kscale(c, 290, 560, 230, "502");
  bottleSoda(c, 290, 660, true);
  kscale(c, 790, 560, 230, "500");
  bottleSoda(c, 790, 660, false);
  const r = rnd(8);
  for (let i = 0; i < 7; i++) dot(c, 790 - 30 + r() * 60, 270 - r() * 130, 8 + r() * 5, WHITE);
  shape(c, () => rrect(c, 900, 700, 66, 30, 8), COL.red, 5);
  arrow(c, [[420, 330], [600, 330]]);
};
const flowA5 = (c: Ctx) => {
  ground(c);
  // a slice of lotus stem: a ring of holes
  const cx = 300, cy = 320, R = 230;
  shadow(c, cx + 20, cy + R * 0.95, R, 22);
  shape(c, () => ell(c, cx, cy, R, R), "#f6e3c4");
  shade(c, () => ell(c, cx, cy, R, R), "#e1c79a", R * 0.2, R * 0.2);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + 0.2; shape(c, () => ell(c, cx + Math.cos(a) * R * 0.58, cy + Math.sin(a) * R * 0.58, 44, 44), "#5a3d3a", 5); }
  for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; shape(c, () => ell(c, cx + Math.cos(a) * R * 0.2, cy + Math.sin(a) * R * 0.2, 21, 21), "#5a3d3a", 4); }
  // bowl of water with a stem in it, bubbles coming out of the far end
  const wx = 420, wy = 640, ww = 610, wh = 320;
  shape(c, () => rrect(c, wx, wy, ww, wh, 26), "#8fc3ea", 6);
  line(c, [[wx + 10, wy + 40], [wx + ww - 10, wy + 40]], 6, WHITE);
  shape(c, () => rrect(c, wx + 90, wy + 140, 440, 90, 40), "#f6e3c4", 6);
  shape(c, () => ell(c, wx + 100, wy + 185, 26, 45), "#5a3d3a", 5);
  shape(c, () => ell(c, wx + 520, wy + 185, 26, 45), "#5a3d3a", 5);
  const r = rnd(2);
  for (let i = 0; i < 6; i++) dot(c, wx + 545 + r() * 40, wy + 150 - i * 20, 10 + r() * 8, WHITE);
  // the straw into the near end
  line(c, [[wx - 40, wy + 90], [wx + 62, wy + 185]], 24, INK); line(c, [[wx - 40, wy + 90], [wx + 62, wy + 185]], 14, COL.red);
  arrow(c, [[wx - 120, wy - 80], [wx - 40, wy + 40]]);
};
const flowA6 = (c: Ctx) => {
  ground(c);
  bowl(c, 540, 250, 260, "#8fc3ea");
  shape(c, () => rrect(c, 430, 225, 220, 100, 30), "#f3d24f", 6);
  const r = rnd(5);
  for (let i = 0; i < 9; i++) shape(c, () => ell(c, 456 + r() * 168, 245 + r() * 60, 8, 7), "#c9a528", 3);
  for (let i = 0; i < 6; i++) dot(c, 470 + i * 36, 190 - (i % 3) * 55, 13 + (i % 2) * 5, WHITE);
  arrow(c, [[740, 330], [655, 290]]);
  shape(c, () => rrect(c, 50, 500, 980, 450, 30), COL.steel, 6);
  shape(c, () => rrect(c, 80, 530, 920, 390, 20), COL.steelIn, 4);
  const at = (x: number, y: number, fn: () => void) => { c.save(); c.translate(x, y); c.scale(1.45, 1.45); fn(); c.restore(); };
  at(190, 650, () => { shape(c, () => rrect(c, -50, -40, 100, 80, 18), "#f3d24f", 5); for (let k = 0; k < 4; k++) shape(c, () => ell(c, -25 + (k % 2) * 40, -15 + Math.floor(k / 2) * 34, 7, 6), "#c9a528", 3); });
  at(425, 650, () => shape(c, () => { c.moveTo(-50, 36); c.lineTo(-50, -12); c.quadraticCurveTo(-55, -52, -15, -44); c.quadraticCurveTo(0, -62, 15, -44); c.quadraticCurveTo(55, -52, 50, -12); c.lineTo(50, 36); c.closePath(); }, "#e8b66d", 5));
  at(660, 650, () => shape(c, () => { c.moveTo(-52, 32); c.quadraticCurveTo(-56, -30, -10, -38); c.quadraticCurveTo(40, -50, 52, 32); c.closePath(); }, "#7a4a2e", 5));
  at(880, 650, () => { shape(c, () => rrect(c, -52, -30, 104, 62, 6), "#c4553a", 5); line(c, [[-20, -28], [-20, 30]], 4); line(c, [[20, -28], [20, 30]], 4); });
  at(290, 830, () => { shape(c, () => rrect(c, -50, -36, 100, 72, 10), COL.teal, 5); line(c, [[-50, -10], [50, -10]], 4, COL.tealDk); line(c, [[-50, 14], [50, 14]], 4, COL.tealDk); });
  at(540, 830, () => { shape(c, () => ell(c, -20, -15, 26, 36, -0.3), COL.steel, 5); line(c, [[-10, 10], [40, 52]], 14, INK); line(c, [[-10, 10], [40, 52]], 6, COL.steel); });
  at(790, 830, () => shape(c, () => { c.moveTo(-50, 20); c.quadraticCurveTo(-60, -30, -10, -40); c.quadraticCurveTo(45, -44, 52, 8); c.quadraticCurveTo(40, 38, -50, 20); c.closePath(); }, COL.grey, 5));
};

const flowP1 = (c: Ctx) => {
  ground(c);
  // notebook page with the room drawn as a box, and a tape measure
  shape(c, () => rrect(c, 80, 100, 560, 780, 18), COL.paper, 6);
  for (let y = 160; y < 860; y += 52) line(c, [[100, y], [620, y]], 2.5, "#c9d6e6");
  line(c, [[130, 110], [130, 870]], 3, "#e4a3a0");
  const R = room(c, 360, 380, 150, false);
  write(c, "3", R.T1[0] - 60, (R.T1[1] + R.B1[1]) / 2 - 20, 44, RED, 7);
  write(c, "3", R.B4[0] - 80, R.B4[1] + 10, 44, RED, 7);
  write(c, "3", R.B3[0] + 20, (R.T3[1] + R.B3[1]) / 2 - 10, 44, RED, 7);
  write(c, "27", 290, 720, 90, INK, 12);
  // the tape measure
  const tx = 840, ty = 360;
  shadow(c, tx + 14, ty + 160, 140, 24);
  shape(c, () => rrect(c, tx - 130, ty - 120, 260, 260, 50), COL.yellow, 6);
  shape(c, () => ell(c, tx, ty + 10, 70, 70), COL.woodDk, 6);
  shape(c, () => ell(c, tx, ty + 10, 26, 26), COL.paper, 5);
  shape(c, () => rrect(c, tx - 150, ty + 100, 70, 40, 6), COL.steel, 5);
  shape(c, () => rrect(c, tx - 150, ty + 140, 560 - 200, 60, 4), COL.yellow, 5);
  for (let i = 0; i < 12; i++) line(c, [[tx - 120 + i * 24, ty + 140], [tx - 120 + i * 24, ty + 140 + (i % 4 === 0 ? 30 : 16)]], i % 4 === 0 ? 4 : 2.5);
  // a pencil
  c.save(); c.translate(790, 760); c.rotate(-0.25); shape(c, () => rrect(c, -170, -18, 300, 36, 6), COL.yellow, 5); shape(c, () => polyP(c, [[130, -18], [190, 0], [130, 18]]), "#f0cf8f", 5); shape(c, () => polyP(c, [[170, -5], [190, 0], [170, 5]]), INK, 2); shape(c, () => rrect(c, -190, -18, 36, 36, 6), COL.pink, 5); c.restore();
};
const flowC1 = (c: Ctx) => {
  ground(c);
  const ty = 880;
  const cols = [COL.red, COL.blue, COL.green, COL.orange, COL.purple];
  // the puffed bag under the pile of books
  const bx = 690, by = ty - 20;
  shadow(c, bx + 20, ty + 4, 290, 22);
  shape(c, () => { c.moveTo(bx - 280, by); c.bezierCurveTo(bx - 290, by - 200, bx + 290, by - 200, bx + 280, by); c.closePath(); }, "rgba(240,248,255,0.92)", 6);
  shine(c, [[bx - 220, by - 40], [bx - 150, by - 80]], 8);
  for (let i = 0; i < 5; i++) { const w = 330 - (i % 2) * 24, y = by - 208 - 60 * i; shape(c, () => rrect(c, bx - w / 2 + (i % 2) * 14, y, w, 58, 6), cols[i], 5); line(c, [[bx - w / 2 + 20 + (i % 2) * 14, y + 29], [bx + w / 2 - 20, y + 29]], 4, WHITE); }
  // the straw taped into the bag
  line(c, [[430, by - 30], [305, 440]], 22, INK); line(c, [[430, by - 30], [305, 440]], 12, COL.teal);
  shape(c, () => rrect(c, 405, by - 62, 50, 36, 6), COL.yellow, 4);
  table(c, ty);
  bust(c, 180, 380, 105, ty, true);
  arrow(c, [[bx + 220, by - 240], [bx + 220, by - 460]]);
};
const flowC2 = (c: Ctx) => {
  ground(c);
  const bx = 600, top = 120, bw = 330, bh = 520, nw = 90, cy = top + bh / 2;
  shadow(c, 620, 975, 260, 24);
  shape(c, () => polyP(c, [[400, 770], [820, 770], [780, 955], [440, 955]]), COL.steel);
  shade(c, () => polyP(c, [[400, 770], [820, 770], [780, 955], [440, 955]]), COL.steelDk, 40, 0);
  shape(c, () => ell(c, 610, 770, 210, 30), COL.water, 5);
  // the bottle upside down: drawn flipped about its middle, water everywhere except a funnel of air
  c.save(); c.translate(0, 2 * cy); c.scale(1, -1);
  const yb = top + bh;
  bottle(c, bx, yb, bw, bh, nw, () => {
    shape(c, () => { c.moveTo(bx - 80, yb - 24); c.lineTo(bx + 80, yb - 24); c.quadraticCurveTo(bx + 30, yb - bh * 0.5, bx + 12, yb - bh * 0.93); c.lineTo(bx - 12, yb - bh * 0.93); c.quadraticCurveTo(bx - 30, yb - bh * 0.5, bx - 80, yb - 24); c.closePath(); }, "#f2f9ff", 5);
  }, 1);
  lip(c, bx, yb, bh, nw);
  c.restore();
  line(c, [[bx, top + bh + 14], [bx, 775]], 24, INK); line(c, [[bx, top + bh + 14], [bx, 775]], 14, COL.water);
  c.beginPath(); c.ellipse(bx, top + 250, 215, 60, 0, Math.PI * 0.08, Math.PI * 0.92); c.strokeStyle = RED; c.lineWidth = 10; c.lineCap = "round"; c.stroke();
  line(c, [[bx - 190, top + 290], [bx - 215, top + 250], [bx - 165, top + 252]], 10, RED);
  arm(c, 268, top + 340, 0, 1.4);
};

// ---------------------------------------------------------------- terms
const termAir = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e0d3b8"; c.fillRect(0, 0, D, 70); line(c, [[0, 70], [D, 70]], 6);
  line(c, [[540, 70], [540, 150]], 18, INK); line(c, [[540, 70], [540, 150]], 8, COL.steel);
  for (const d of [-1, 1]) { c.save(); c.translate(540, 175); c.rotate(d * 0.14); shape(c, () => ell(c, d * 190, 0, 190, 26), COL.teal, 6); shade(c, () => ell(c, d * 190, 0, 190, 26), COL.tealDk, 0, 12); c.restore(); }
  shape(c, () => ell(c, 540, 170, 62, 34), COL.steel, 6);
  person(c, 540, 1010, 620);
  // the girl's hair blows to the side
  for (const [y, l] of [[560, 120], [630, 100], [700, 130]]) line(c, [[320, y], [320 - l, y - 20]], 7, AIRDK);
  for (const x of [370, 710]) arrow(c, [[x, 270], [x, 400]]);
  for (const [y, l] of [[530, 110], [600, 130]]) line(c, [[760, y], [760 + l, y + 20]], 7, AIRDK);
};
const stoneAt = (c: Ctx, x: number, y: number) => {
  const p = () => { c.moveTo(x - 140, y); c.quadraticCurveTo(x - 160, y - 100, x - 60, y - 140); c.quadraticCurveTo(x + 40, y - 190, x + 120, y - 100); c.quadraticCurveTo(x + 170, y - 30, x + 130, y); c.closePath(); };
  shape(c, p, COL.grey); shade(c, p, COL.greyDk, 50, 14);
  line(c, [[x - 80, y - 90], [x - 40, y - 120]], 8, WHITE);
};
const termMatter = (c: Ctx) => {
  ground(c);
  const y = 800;
  table(c, y);
  shadow(c, 190, y + 4, 150, 18); stoneAt(c, 190, y - 4);
  glass(c, 540, y - 4, 230, 330, 0.72);
  shadow(c, 880, y + 4, 130, 18);
  balloon(c, 880, y - 170, 120, 150); 
};
const termGas = (c: Ctx) => {
  ground(c);
  const y = 820;
  shape(c, () => rrect(c, -20, y, 1120, 260, 4), "#cdbfa5", 6);
  shadow(c, 280, y + 6, 190, 20);
  // flame and pot
  for (const dx of [-70, -20, 30, 80]) shape(c, () => { c.moveTo(280 + dx - 22, y); c.quadraticCurveTo(280 + dx - 26, y - 40, 280 + dx, y - 70); c.quadraticCurveTo(280 + dx + 26, y - 40, 280 + dx + 22, y); c.closePath(); }, COL.orange, 4);
  shape(c, () => rrect(c, 130, y - 330, 300, 250, 28), COL.steel); shade(c, () => rrect(c, 130, y - 330, 300, 250, 28), COL.steelDk, 50, 0);
  shape(c, () => rrect(c, 105, y - 360, 350, 52, 22), COL.steel, 6);
  shape(c, () => ell(c, 280, y - 380, 28, 18), COL.steelDk, 5);
  line(c, [[130, y - 260], [60, y - 270]], 14, INK); 
  // the smell drifts across the room to the child
  for (let i = 0; i < 3; i++) wave(c, 260 + i * 20, y - 470 - i * 0, 170, 18, COL.orange, 7);
  arrow(c, [[500, y - 560], [700, y - 560]]);
  for (let i = 0; i < 3; i++) wave(c, 500 + i * 0, y - 520 + i * 40, 150, 14, COL.orange, 7);
  person(c, 830, y + 160, 520);
};
const termSpace = (c: Ctx) => {
  ground(c);
  const tx = 540, top = 600, fy = 950;
  shadow(c, tx + 20, fy + 20, 440, 28);
  person(c, tx, fy - 60, 700, { armL: [2.3, 1.9], armR: [0.85, 1.2] });
  const tub = () => polyP(c, [[190, top], [890, top], [830, fy], [250, fy]]);
  shape(c, tub, "#8fc3ea"); shade(c, tub, COL.waterDk, 60, 0);
  shape(c, () => rrect(c, 160, top - 36, 760, 40, 20), COL.steel, 6);
  for (const d of [-1, 1]) {
    const x = tx + d * 410;
    shape(c, () => ell(c, x - d * 20, top - 14, 62, 30), COL.water, 5);
    shape(c, () => { c.moveTo(x + d * 10, top - 30); c.quadraticCurveTo(x + d * 90, top - 20, x + d * 70, top + 60); c.lineTo(x + d * 20, top + 40); c.closePath(); }, COL.water, 5);
    dot(c, x + d * 70, top + 110, 14, COL.water); dot(c, x + d * 76, top + 190, 12, COL.water);
    arrow(c, [[x + d * 20, top - 120], [x + d * 90, top - 40]]);
    shape(c, () => ell(c, x + d * 60, fy + 36, 55, 14), "#8fc3ea", 4);
  }
};
const termParticles = (c: Ctx) => {
  ground(c);
  const ring = (cx: number, cy: number, r: number, bg: string) => { shape(c, () => ell(c, cx, cy, r, r), bg, 10); };
  ring(290, 400, 215, "#f3f9fd"); ring(790, 400, 215, "#d6ecfa");
  const r = rnd(6);
  [[210, 330], [350, 300], [240, 470], [370, 450], [300, 380], [170, 410]].forEach(([x, y]) => dot(c, x, y, 17));
  for (let row = -4; row <= 4; row++) for (let col = -4; col <= 4; col++) { const x = 790 + col * 40 + (row % 2) * 20, y = 400 + row * 35; if (Math.hypot(x - 790, y - 400) < 190) dot(c, x, y, 17, AIRDK); }
  // what the circles look into
  balloon(c, 290, 820, 85, 105);
  glass(c, 790, 930, 190, 240, 0.75);
  for (const [x, y] of [[290, 640], [790, 640]]) arrow(c, [[x, y + 40], [x, y - 10]]);
  void r;
};
const termWeight = (c: Ctx) => {
  ground(c);
  kscale(c, 540, 640, 330, "1000 g");
  bottle(c, 540, 695, 210, 440, 70, () => {}, 0.88);
  shape(c, () => rrect(c, 540 - 32, 695 - 440 - 18, 64, 28, 8), COL.teal, 5);
};
const termOxygen = (c: Ctx) => {
  ground(c);
  bust(c, 230, 400, 130, 960, false);
  // air with oxygen goes in at the nose and down to the lungs
  for (const [x, y] of [[420, 330], [470, 390], [520, 350]]) dot(c, x, y, 15);
  arrow(c, [[560, 360], [440, 440]]);
  shape(c, () => ell(c, 770, 650, 250, 250), "#fff1f0", 10);
  lungs(c, 770, 660, 200);
  for (const [x, y] of [[700, 560], [830, 560], [700, 700], [840, 700], [740, 620], [800, 630]]) dot(c, x, y, 14);
  arrow(c, [[500, 470], [580, 540]]);
};
const pie = (c: Ctx, cx: number, cy: number, r: number, parts: [number, string, string, number?][]) => {
  let a = -Math.PI / 2;
  for (const [f, col, dk, off] of parts) {
    const a2 = a + f * Math.PI * 2, m = (a + a2) / 2, ox = Math.cos(m) * (off ?? 0), oy = Math.sin(m) * (off ?? 0);
    const p = () => { c.moveTo(cx + ox, cy + oy); c.arc(cx + ox, cy + oy, r, a, a2); c.closePath(); };
    shape(c, p, col, 6); shade(c, p, dk, 10, 10, 0.5); a = a2;
  }
};
const termNitrogen = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 830, 380, 30);
  pie(c, 540, 520, 330, [[0.8, "#7fb6e8", "#5b8fd6"], [0.2, "#9ccf62", "#6aa53f", 36]]);
  for (const a of [0.2, 0.9, 1.9, 2.8]) { const x = 540 + Math.cos(a - 1.2) * 190, y = 520 + Math.sin(a - 1.2) * 190; void x; void y; }
};
const termCO2 = (c: Ctx) => {
  ground(c);
  table(c, 880);
  bust(c, 190, 460, 120, 880, true, true);
  // the plant in a pot
  shadow(c, 830, 888, 150, 18);
  shape(c, () => polyP(c, [[740, 720], [920, 720], [890, 880], [770, 880]]), COL.orange); shade(c, () => polyP(c, [[740, 720], [920, 720], [890, 880], [770, 880]]), COL.red, 40, 0);
  shape(c, () => rrect(c, 725, 700, 210, 40, 12), COL.orange, 6);
  line(c, [[830, 710], [830, 520]], 12, COL.leafDk);
  leafBig(c, 830, 600, 210, -2.5); leafBig(c, 830, 560, 200, -0.65); leafBig(c, 830, 520, 150, -1.6, COL.greenLt);
  for (const [x, y] of [[430, 500], [490, 460], [550, 520]]) dot(c, x, y, 17, GAS);
  arrow(c, [[430, 560], [610, 480]]);
  dot(c, 610, 400, 17, GAS); dot(c, 660, 440, 15, GAS);
};

// ---------------------------------------------------------------- explanations
const explBottles = (c: Ctx) => {
  ground(c);
  const y = 840, w = 190, h = 420, nw = 58;
  table(c, y);
  const one = (x: number, r: number, hole: boolean) => {
    shadow(c, x + 14, y + 6, 105, 14);
    bottle(c, x, y, w, h, nw, () => { balloon(c, x, y - h + 80 + r * 0.5, r * 0.55, r * 0.75); }, 0);
    lip(c, x, y, h, nw);
    shape(c, () => rrect(c, x - nw / 2 - 9, y - h - 20, nw + 18, 36, 10), COL.pink, 5);
    if (hole) { shape(c, () => ell(c, x, y - 4, 9, 6), INK, 0); line(c, [[x + 170, y - 200], [x + 8, y - 12]], 6); shape(c, () => ell(c, x + 176, y - 204, 12, 12), COL.red, 4); }
  };
  one(190, 60, false);
  one(540, 60, true);
  // third: balloon fills the bottle
  const x = 890;
  shadow(c, x + 14, y + 6, 105, 14);
  bottle(c, x, y, w, h, nw, () => { balloon(c, x, y - h * 0.5, 95, 190); }, 0);
  lip(c, x, y, h, nw);
  shape(c, () => rrect(c, x - nw / 2 - 9, y - h - 20, nw + 18, 36, 10), COL.pink, 5);
  arrow(c, [[300, 540], [420, 540]]); arrow(c, [[650, 540], [770, 540]]);
};
const explSquash = (c: Ctx) => {
  ground(c);
  const circ = (cx: number, cy: number, sp: number) => {
    shape(c, () => ell(c, cx, cy, 170, 170), "#f3f9fd", 9);
    [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, 0], [0, -1.3]].forEach(([u, v], i) => dot(c, cx + u * sp + (i === 5 ? 0 : 0), cy + v * sp * 0.8, 14));
  };
  syringe(c, 60, 270, 0.7, 10, false);
  circ(800, 270, 90);
  syringe(c, 60, 750, 0.7, 5, false);
  circ(800, 750, 48);
  arrow(c, [[200, 400], [200, 560]]);
  line(c, [[560, 270], [650, 215]], 5, COL.greyDk); line(c, [[560, 270], [650, 330]], 5, COL.greyDk);
  line(c, [[450, 750], [650, 695]], 5, COL.greyDk); line(c, [[450, 750], [650, 805]], 5, COL.greyDk);
};
const explWeight = (c: Ctx) => {
  ground(c);
  room(c, 270, 500, 215);
  line(c, [[500, 520], [580, 520]], 12, RED); line(c, [[500, 570], [580, 570]], 12, RED);
  shadow(c, 810, 905, 220, 22);
  shape(c, () => rrect(c, 640, 850, 340, 70, 20), COL.steel, 6);
  shape(c, () => rrect(c, 760, 872, 100, 34, 6), "#22303a", 4);
  write(c, "32", 778, 876, 26, "#c9f06b", 5);
  person(c, 810, 850, 640);
};

const explMix = (c: Ctx) => {
  ground(c);
  // a jar of air with its tiny pieces, and a pie of what they are
  const jx = 270, jy = 880, jw = 360, jh = 520;
  shadow(c, jx + 20, jy + 6, 220, 22);
  const jp = () => { c.moveTo(jx - jw / 2, jy - jh); c.lineTo(jx + jw / 2, jy - jh); c.lineTo(jx + jw / 2, jy - 30); c.quadraticCurveTo(jx + jw / 2, jy, jx + jw / 2 - 30, jy); c.lineTo(jx - jw / 2 + 30, jy); c.quadraticCurveTo(jx - jw / 2, jy, jx - jw / 2, jy - 30); c.closePath(); };
  shape(c, jp, CLEAR, 0);
  const r = rnd(12);
  c.save(); c.beginPath(); jp(); c.clip();
  const cols = ["#7fb6e8", "#7fb6e8", "#7fb6e8", "#7fb6e8", "#9ccf62"];
  for (let i = 0; i < 20; i++) dot(c, jx - 140 + (i % 4) * 92 + (r() - 0.5) * 24, jy - 70 - Math.floor(i / 4) * 92 + (r() - 0.5) * 20, 22, cols[Math.floor(r() * 5) % 5]);
  c.restore();
  shape(c, jp, NONE, 6);
  shape(c, () => rrect(c, jx - jw / 2 - 12, jy - jh - 14, jw + 24, 26, 8), CLEAR, 6);
  arrow(c, [[460, 560], [570, 560]]);
  shadow(c, 840, 900, 230, 24);
  pie(c, 830, 560, 220, [[0.78, "#7fb6e8", "#5b8fd6"], [0.21, "#9ccf62", "#6aa53f"], [0.01, COL.yellow, COL.orange, 14]]);
};
const explBreathe = (c: Ctx) => {
  ground(c);
  const h = 700, x = 540, y = 970, sh = y - h * 0.74;
  person(c, x, y, h, { armL: [2.4, 2.2], armR: [0.74, 0.94] });
  // windpipe and lungs under the shirt
  shape(c, () => ell(c, x, sh + h * 0.13, h * 0.12, h * 0.115), "#fff6f4", 5);
  lungs(c, x, sh + h * 0.14, h * 0.095);
  // blood carrying oxygen from the lungs out to the hands and feet
  const A: Record<number, number[][]> = {
    [-1]: [[x - h * 0.05, sh + h * 0.14], [x - h * 0.11, sh + h * 0.03], [x - h * 0.235, sh + h * 0.145], [x - h * 0.33, sh + h * 0.275]],
    [1]: [[x + h * 0.05, sh + h * 0.14], [x + h * 0.11, sh + h * 0.03], [x + h * 0.235, sh + h * 0.145], [x + h * 0.33, sh + h * 0.275]],
  };
  for (const d of [-1, 1]) {
    line(c, A[d], 7, RED);
    line(c, [[x + d * h * 0.03, sh + h * 0.26], [x + d * h * 0.05, y - h * 0.42], [x + d * h * 0.06, y - h * 0.04]], 7, RED);
  }
  arrow(c, [[250, sh - 110], [370, sh - 50]]); arrow(c, [[690, sh - 50], [810, sh - 110]]);
};
const explOxygenStory = (c: Ctx) => {
  ground(c);
  const panel = (x: number, sky: string, sea: string, now: boolean) => {
    const w = 440, y = 190, h = 700;
    c.save(); c.beginPath(); rrect(c, x, y, w, h, 28); c.clip();
    c.fillStyle = sky; c.fillRect(x, y, w, h);
    c.fillStyle = sea; c.fillRect(x, y + h * 0.62, w, h);
    c.fillStyle = now ? "#cfe9f9" : "#e98a4a"; c.globalAlpha = 0.5; c.fillRect(x, y + h * 0.5, w, h * 0.12); c.globalAlpha = 1;
    if (now) {
      shape(c, () => ell(c, x + 90, y + 100, 52, 52), COL.yellow, 6);
      shape(c, () => ell(c, x + 320, y + 130, 60, 26), WHITE, 5);
      shape(c, () => polyP(c, [[x + 200, y + h * 0.62], [x + w + 20, y + h * 0.62 - 60], [x + w + 20, y + h * 0.62]]), "#8a6a3c", 5);
      for (let i = 0; i < 4; i++) { const tx = x + 250 + i * 55, ty = y + h * 0.62 - 20 - i * 14; line(c, [[tx, ty], [tx, ty - 50]], 12); line(c, [[tx, ty], [tx, ty - 50]], 6, COL.soilDk); dot(c, tx, ty - 75, 34, COL.green); }
      const r = rnd(3); for (let i = 0; i < 14; i++) dot(c, x + 30 + r() * 380, y + h * 0.7 + r() * 170, 8, COL.greenLt);
    } else {
      shape(c, () => ell(c, x + 330, y + 120, 44, 44), "#f9c15a", 6);
      shape(c, () => polyP(c, [[x + 40, y + h * 0.62], [x + 130, y + h * 0.62 - 130], [x + 170, y + h * 0.62 - 130], [x + 270, y + h * 0.62]]), "#6b4a40", 5);
      shape(c, () => ell(c, x + 150, y + h * 0.62 - 140, 34, 14), "#e6603a", 4);
      const r = rnd(7); for (let i = 0; i < 6; i++) shape(c, () => ell(c, x + 60 + r() * 320, y + h * 0.75 + r() * 140, 38, 12), COL.green, 4);
    }
    c.restore(); shape(c, () => rrect(c, x, y, w, h, 28), NONE, 8);
  };
  panel(50, "#f0a05e", "#3f6f78", false);
  panel(590, "#8cc8ee", "#5b9ed6", true);
  arrow(c, [[500, 540], [580, 540]]);
};

export const ic_airAirAroundUsL3 = cards("sci.air.air-around-us.L3 cards", [
  intro, summary, flowE1, flowE2, flowA1, flowA2, flowA3, flowA4, flowA5, flowA6, flowP1, flowC1, flowC2,
  termAir, termMatter, termGas, termSpace, termParticles, termWeight, termOxygen, termNitrogen, termCO2,
  explBottles, explSquash, explWeight, explMix, explBreathe, explOxygenStory,
]);
