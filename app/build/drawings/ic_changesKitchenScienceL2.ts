import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, shade, shadow, line, shine, arrow, bowl, plate, hand, person, write, rrect, cards } from "./flatKit";

// KITCHEN SCIENCE L2 · what cooking does to rice, butter, milk. Flat set-up cards and card pictures.

const RICE = { dry: "#f3eee0", dryDk: "#cfc7b2", soaked: "#f8f5ea", boiled: WHITE, boiledDk: "#dcd8cc" };
const BUTTER = "#f7df7a", BUTTER_DK = "#e0bf4a", GHEE = "#f0b428", GHEE_DK = "#c88a14", CURD = "#fbf8f0", FLAME = "#6aa9ff";
type Kind = "dry" | "soaked" | "boiled";
const grain = (c: Ctx, x: number, y: number, r: number, rot: number, k: Kind = "dry") => {
  const len = k === "dry" ? r : k === "soaked" ? r * 1.2 : r * 1.6, wid = k === "dry" ? r * 0.4 : k === "soaked" ? r * 0.5 : r * 0.62;
  shape(c, () => ell(c, x, y, len, wid, rot), RICE[k], Math.max(2.5, r * 0.1));
  shade(c, () => ell(c, x, y, len, wid, rot), k === "boiled" ? RICE.boiledDk : RICE.dryDk, len * 0.3, wid * 0.4, 0.45);
};
// a steel saucepan, bottom centre (x, y); the rim shows what is inside; handle to the right (or left)
const pan = (c: Ctx, x: number, y: number, w: number, h: number, inside: string = COL.steelIn, lid = false, left = false) => {
  shadow(c, x + w * 0.1, y + 6, w * 0.6, w * 0.1);
  const body = () => rrect(c, x - w / 2, y - h, w, h, 22);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.3, 0);
  shine(c, [[x - w * 0.36, y - h * 0.8], [x - w * 0.36, y - h * 0.3]], 8);
  const hx = left ? x - w / 2 - w * 0.55 : x + w / 2;
  shape(c, () => rrect(c, hx, y - h + w * 0.05, w * 0.55, 28, 14), COL.black, 5);
  if (lid) { shape(c, () => { c.moveTo(x - w / 2 - 8, y - h); c.quadraticCurveTo(x, y - h - w * 0.36, x + w / 2 + 8, y - h); c.closePath(); }, COL.steel); shape(c, () => ell(c, x, y - h - w * 0.2, 20, 13), COL.black, 5); }
  else shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), inside, 5);
};
const stove = (c: Ctx, y: number, x0 = 0, x1 = D) => { shape(c, () => rrect(c, x0 - 30, y, x1 - x0 + 60, 90, 20), COL.greyDk); shape(c, () => rrect(c, x0 - 30, y, x1 - x0 + 60, 24, 10), COL.grey, 4); };
const burner = (c: Ctx, x: number, y: number, w: number) => {
  shape(c, () => ell(c, x, y, w / 2, w * 0.1), COL.black);
  for (let k = -2; k <= 2; k++) { const fx = x + k * w * 0.19; shape(c, () => { c.moveTo(fx - 14, y - 2); c.quadraticCurveTo(fx, y - 64, fx + 14, y - 2); c.closePath(); }, FLAME, 4); }
};
const steam = (c: Ctx, x: number, y: number, h: number) => {
  for (const k of [-1, 0, 1]) { const sx = x + k * 46; const p = () => { c.beginPath(); c.moveTo(sx, y); c.bezierCurveTo(sx - 30, y - h * 0.35, sx + 30, y - h * 0.65, sx, y - h); }; p(); c.strokeStyle = COL.grey; c.lineWidth = 14; c.lineCap = "round"; c.stroke(); p(); c.strokeStyle = WHITE; c.lineWidth = 7; c.stroke(); }
};
const spoon = (c: Ctx, x: number, y: number, an: number, s = 1, content?: string) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, 0, -8, 120, 16, 8), COL.steel, 5);
  shape(c, () => ell(c, 150, 0, 40, 26), COL.steel, 5);
  if (content) shape(c, () => ell(c, 150, -2, 30, 16), content, 3);
  c.restore();
};
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 14, y + h + 8, w / 2, 14); shape(c, () => rrect(c, x, y, w, h, 10), COL.paper, 6); };
const tally = (c: Ctx, n: number, x: number, y: number, h: number) => {
  let gx = x;
  for (let i = 0; i < n; i++) { const g = i % 5; if (g === 4) { line(c, [[gx - 8, y + h * 0.8], [gx + 8 - 4 * 18, y + h * 0.2]], 6); } else line(c, [[gx + g * 18, y], [gx + g * 18, y + h]], 6); if (g === 4) gx += 100; }
};
const bubbles = (c: Ctx, x: number, y: number, rx: number, ry: number, seed: number) => { const r = rnd(seed); for (let i = 0; i < 9; i++) { const bx = x - rx * 0.8 + r() * rx * 1.6, by = y - ry * 0.6 + r() * ry * 1.2; shape(c, () => ell(c, bx, by, 9 + r() * 7, 7 + r() * 5), WHITE, 3); } };
const riceOnRim = (c: Ctx, x: number, y: number, rx: number, ry: number, n: number, k: Kind, seed: number, r0 = 14) => { const r = rnd(seed); for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.8; grain(c, x + Math.cos(a) * rx * d, y + Math.sin(a) * ry * d, r0, r() * 3, k); } };
const heap = (c: Ctx, x: number, y: number, w: number, n: number, seed: number, r0 = 20) => { const r = rnd(seed); for (let i = 0; i < n; i++) { const t = r(), u = r(); const gx = x - w / 2 + t * w, top = y - Math.sin(t * Math.PI) * w * 0.3; grain(c, gx, top + u * (y - top) + 6, r0, r() * 3); } };
const kadai = (c: Ctx, x: number, y: number, r: number, inside: string) => { bowl(c, x, y, r, inside); for (const s of [-1, 1]) { shape(c, () => { c.arc(x + s * (r + 10), y + 8, 34, Math.PI * 0.5, Math.PI * 1.5, s < 0); }, COL.black, 6); } };
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, top?: Kind, seed = 1) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const tw = w / 2, bw = w * 0.42, body = () => { c.moveTo(x - tw, y - h); c.lineTo(x + tw, y - h); c.lineTo(x + bw, y); c.lineTo(x - bw, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.3, 0); shine(c, [[x - tw * 0.7, y - h * 0.85], [x - bw * 0.75, y - h * 0.2]], 7);
  shape(c, () => ell(c, x, y - h, tw, w * 0.1), top ? (top === "dry" ? RICE.dry : RICE.boiled) : COL.steelIn, 5);
  if (top) riceOnRim(c, x, y - h, tw, w * 0.1, 14, top, seed, top === "dry" ? 10 : 11);
};

// ---------------------------------------------------------------- set-up cards: e1
// 1. heap of rice on a plate, fingers sorting 10, 10, 20 whole grains into three heaps
const e1s0 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 580, 440, 240);
  heap(c, 320, 620, 260, 70, 3);
  const r = rnd(5);
  [[590, 470, 10], [590, 660, 10], [800, 560, 20]].forEach(([hx, hy, n], i) => { for (let k = 0; k < n; k++) grain(c, hx - 40 + (k % 5) * 20, hy - 20 + Math.floor(k / 5) * 22, 12, 0.2 + r() * 0.4); write(c, String(n), hx - 30, hy - 110 + (i === 2 ? 0 : 0), 54); });
  hand(c, 760, 880, -2.4, 1.6, SKIN.child, CLOTH.child, true);
};
// 2. a katori of cold water with grains at the bottom; a pan of bubbling water on the stove; timer 12:00
const e1s1 = (c: Ctx) => {
  ground(c);
  stove(c, 700, 560, 1080); burner(c, 810, 690, 300);
  pan(c, 810, 660, 300, 210, COL.water); bubbles(c, 810, 450, 140, 26, 8); steam(c, 790, 400, 150);
  bowl(c, 290, 680, 170, COL.water); riceOnRim(c, 290, 686, 150, 28, 10, "dry", 4, 16);
  shape(c, () => rrect(c, 150, 160, 300, 170, 22), COL.black, 6); shape(c, () => rrect(c, 170, 180, 260, 130, 12), "#22303a", 0);
  write(c, "12", 190, 215, 60, "#c9f06b", 8); write(c, "00", 314, 215, 60, "#c9f06b", 8);
  shape(c, () => ell(c, 299, 232, 6, 6), "#c9f06b", 0); shape(c, () => ell(c, 299, 260, 6, 6), "#c9f06b", 0);
};
// 3. ten dry grains end to end on a paper strip, a pencil mark at each end
const pencil = (c: Ctx, x: number, y: number, an: number) => { c.save(); c.translate(x, y); c.rotate(an); shape(c, () => rrect(c, 0, -14, 300, 28, 4), COL.yellow); shape(c, () => { c.moveTo(300, -14); c.lineTo(340, 0); c.lineTo(300, 14); c.closePath(); }, COL.wood, 5); shape(c, () => { c.moveTo(326, -5); c.lineTo(340, 0); c.lineTo(326, 5); c.closePath(); }, INK, 0); shape(c, () => rrect(c, -30, -14, 34, 28, 4), COL.pink, 5); c.restore(); };
const e1s2 = (c: Ctx) => {
  ground(c);
  paper(c, 90, 400, 900, 220);
  for (let i = 0; i < 10; i++) grain(c, 230 + i * 70, 510, 34, 0);
  line(c, [[192, 470], [192, 550]], 7); line(c, [[898, 470], [898, 550]], 7);
  pencil(c, 320, 760, -0.08);
};
// 4. three lines on the strip: dry, soaked, boiled; the boiled line is longest
const e1s3 = (c: Ctx) => {
  ground(c);
  paper(c, 70, 280, 940, 520);
  const rows: [number, Kind, number][] = [[380, "dry", 50], [540, "soaked", 60], [700, "boiled", 79]];
  rows.forEach(([y, k, sp]) => { for (let i = 0; i < 10; i++) grain(c, 230 + i * sp, y, 24, 0, k); const end = 230 + 9 * sp + (k === "dry" ? 24 : k === "soaked" ? 29 : 38) + 6; line(c, [[200, y - 36], [200, y + 36]], 6); line(c, [[end, y - 36], [end, y + 36]], 6); });
  arrow(c, [[980, 560], [980, 690]]);
};
// ---------------------------------------------------------------- set-up cards: e2
// 1. two pans; a child spoons water into one; a tally of 8 on paper
const e2s0 = (c: Ctx) => {
  ground(c);
  pan(c, 300, 820, 320, 220, COL.water); pan(c, 740, 820, 320, 220, COL.water); riceOnRim(c, 740, 600, 150, 30, 14, "dry", 6, 14);
  paper(c, 760, 150, 260, 170); tally(c, 8, 800, 200, 70);
  line(c, [[470, 430], [340, 585]], 14, COL.water); for (let i = 0; i < 4; i++) shape(c, () => ell(c, 440 - i * 30, 470 + i * 36, 8, 10), COL.drop, 3);
  arrow(c, [[560, 450], [430, 580]]);
  spoon(c, 600, 335, 2.55, 1.1, COL.water); hand(c, 670, 290, 2.55, 1.1);
};
// 2. both pans on two burners, lids on, steam escaping
const e2s1 = (c: Ctx) => {
  ground(c);
  stove(c, 760); burner(c, 300, 750, 300); burner(c, 780, 750, 300);
  pan(c, 300, 720, 320, 220, COL.steelIn, true); pan(c, 780, 720, 320, 220, COL.steelIn, true);
  steam(c, 150, 490, 170); steam(c, 640, 490, 170);
};
// 3. the grown-up pours the water left through a tea strainer into a katori; a spoon waits to count it
const strainer = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r, y + r * 1.1, x + r, y + r * 1.1, x + r, y); c.closePath(); }, COL.steel);
  c.save(); c.beginPath(); c.moveTo(x - r, y); c.bezierCurveTo(x - r, y + r * 1.1, x + r, y + r * 1.1, x + r, y); c.closePath(); c.clip();
  c.strokeStyle = COL.steelDk; c.lineWidth = 3; for (let k = -r; k <= r; k += 18) { c.beginPath(); c.moveTo(x + k, y); c.lineTo(x + k, y + r); c.stroke(); c.beginPath(); c.moveTo(x - r, y + k / 2 + r / 2); c.lineTo(x + r, y + k / 2 + r / 2); c.stroke(); }
  c.restore();
  shape(c, () => ell(c, x, y, r, r * 0.22), COL.glass, 5);
  shape(c, () => rrect(c, x + r - 4, y - 10, r * 1.1, 22, 11), COL.black, 5);
};
const e2s2 = (c: Ctx) => {
  ground(c);
  bowl(c, 640, 800, 160, COL.water); shape(c, () => ell(c, 640, 800, 160, 32), COL.water, 5);
  spoon(c, 860, 900, -0.25, 1.1);
  strainer(c, 640, 640, 110);
  line(c, [[535, 470], [600, 610]], 14, COL.water); for (let i = 0; i < 3; i++) shape(c, () => ell(c, 560 + i * 14, 520 + i * 40, 8, 10), COL.drop, 3);
  c.save(); c.translate(300, 500); c.rotate(0.75); pan(c, 0, 0, 280, 190, COL.water, false, true); c.restore();
  hand(c, 187, 162, 0.75, 1.2, SKIN.adult, CLOTH.adult);
  arrow(c, [[470, 300], [560, 420]]);
};

// ---------------------------------------------------------------- card pictures
// flow e1: one grain dry, soaked, boiled
const flowE1 = (c: Ctx) => {
  ground(c);
  grain(c, 540, 200, 140, 0, "dry"); grain(c, 540, 480, 140, 0, "soaked"); grain(c, 540, 790, 140, 0, "boiled");
  for (let i = 0; i < 3; i++) shape(c, () => { const x = 800 + i * 50, y = 440 + (i % 2) * 40; c.moveTo(x, y + 30); c.quadraticCurveTo(x - 20, y + 4, x, y - 28); c.quadraticCurveTo(x + 20, y + 4, x, y + 30); c.closePath(); }, COL.water, 4);
  for (let k = -2; k <= 2; k++) { const fx = 540 + k * 90; shape(c, () => { c.moveTo(fx - 24, 1000); c.quadraticCurveTo(fx, 880, fx + 24, 1000); c.closePath(); }, FLAME, 4); }
  arrow(c, [[200, 280], [200, 400]]); arrow(c, [[200, 580], [200, 700]]);
};
// flow e2: the plain-water pan is still full; the rice pan has fat rice and little water
const flowE2 = (c: Ctx) => {
  ground(c);
  pan(c, 290, 800, 340, 240, COL.water); bubbles(c, 290, 560, 150, 28, 11);
  pan(c, 760, 800, 340, 240, COL.steelIn); shape(c, () => ell(c, 760, 560, 170, 34), RICE.boiled, 0); riceOnRim(c, 760, 560, 165, 32, 34, "boiled", 12, 16); shape(c, () => ell(c, 760, 560, 170, 34), "rgba(0,0,0,0)", 5);
  arrow(c, [[470, 420], [640, 420]]);
  spoon(c, 440, 300, 0, 1.0, COL.water);
};
// flow a1: butter in a katori; ghee in a kadai over a flame
const flowA1 = (c: Ctx) => {
  ground(c);
  bowl(c, 260, 620, 150, BUTTER); shape(c, () => { c.moveTo(170, 620); c.bezierCurveTo(180, 520, 340, 520, 350, 620); c.closePath(); }, BUTTER, 5); shade(c, () => { c.moveTo(170, 620); c.bezierCurveTo(180, 520, 340, 520, 350, 620); c.closePath(); }, BUTTER_DK, 40, 20);
  burner(c, 760, 840, 280); kadai(c, 760, 640, 210, GHEE);
  const r = rnd(21); for (let i = 0; i < 14; i++) shape(c, () => ell(c, 620 + r() * 280, 630 + r() * 24, 8, 5), COL.brown, 2);
  arrow(c, [[440, 560], [540, 560]]);
};
// flow a3: a child with paper and pencil watches a grown-up fry onions
const flowA3 = (c: Ctx) => {
  ground(c);
  stove(c, 700, 760, 1120); burner(c, 920, 690, 220);
  person(c, 660, 960, 620, { adult: true, armL: [Math.PI * 0.6, Math.PI * 0.5], armR: [Math.PI * 0.15, Math.PI * 0.05] });
  kadai(c, 920, 640, 150, COL.orange); const r = rnd(31); for (let i = 0; i < 7; i++) { const ox = 840 + r() * 160, oy = 630 + r() * 18; shape(c, () => ell(c, ox, oy, 24, 10), COL.yellow, 3); }
  steam(c, 900, 560, 140);
  person(c, 250, 960, 440, { armL: [Math.PI * 0.6, Math.PI * 0.05], armR: [Math.PI * 0.4, Math.PI * 0.95] });
  paper(c, 210, 700, 110, 140); line(c, [[230, 740], [290, 740]], 5); line(c, [[230, 770], [290, 770]], 5); line(c, [[230, 800], [270, 800]], 5);
};
// flow a4: one tumbler of dry rice becomes three of cooked rice
const flowA4 = (c: Ctx) => {
  ground(c);
  tumbler(c, 190, 720, 180, 230, "dry", 41);
  arrow(c, [[320, 600], [430, 600]]);
  tumbler(c, 560, 720, 180, 230, "boiled", 42); tumbler(c, 760, 720, 180, 230, "boiled", 43); tumbler(c, 960, 720, 180, 230, "boiled", 44);
  write(c, "1", 160, 300, 90); write(c, "3", 730, 300, 90);
};
// flow p1: a notebook page, batter before and dosa after
const flowP1 = (c: Ctx) => {
  ground(c);
  paper(c, 120, 140, 840, 800); for (let i = 0; i < 9; i++) shape(c, () => ell(c, 200 + i * 85, 140, 16, 16), COL.greyDk, 5);
  line(c, [[540, 230], [540, 880]], 4, COL.grey);
  bowl(c, 330, 600, 150, "#fbf3dc"); shape(c, () => ell(c, 330, 600, 150, 30), "#fbf3dc", 5);
  plate(c, 760, 640, 170, 90); shape(c, () => ell(c, 760, 620, 140, 66), COL.wood, 5); const r = rnd(51); for (let i = 0; i < 12; i++) shape(c, () => ell(c, 660 + r() * 200, 585 + r() * 70, 10, 6), COL.woodDk, 0);
  arrow(c, [[470, 420], [620, 420]]);
};
// term 3: butter melting on a hot dosa, a yellow trickle running off the edge
const term3 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 740, 440, 70);
  shape(c, () => ell(c, 540, 700, 440, 150), COL.black); shape(c, () => rrect(c, 960, 680, 120, 36, 18), COL.black, 5);
  shape(c, () => ell(c, 540, 660, 380, 120), COL.wood, 6); const r = rnd(61); for (let i = 0; i < 24; i++) shape(c, () => ell(c, 220 + r() * 640, 600 + r() * 110, 14, 8), COL.woodDk, 0);
  shape(c, () => { c.moveTo(540, 630); c.bezierCurveTo(600, 640, 680, 680, 720, 700); c.quadraticCurveTo(740, 760, 730, 820); c.quadraticCurveTo(700, 800, 690, 740); c.quadraticCurveTo(560, 700, 460, 640); c.closePath(); }, BUTTER, 5);
  shape(c, () => rrect(c, 420, 480, 190, 150, 20), BUTTER); shade(c, () => rrect(c, 420, 480, 190, 150, 20), BUTTER_DK, 50, 30);
  shape(c, () => { c.moveTo(430, 628); c.bezierCurveTo(400, 650, 460, 690, 560, 680); c.bezierCurveTo(660, 690, 700, 660, 600, 626); c.closePath(); }, BUTTER, 5);
  steam(c, 300, 500, 150);
};
// term 1: a dry sponge and a fat wet one; a dry grain and a fat cooked one
const sponge = (c: Ctx, x: number, y: number, w: number, h: number, wet: boolean, seed: number) => {
  shadow(c, x + w / 2 + 12, y + h + 8, w / 2, 16);
  shape(c, () => rrect(c, x, y, w, h, 24), wet ? "#e9d76a" : COL.yellow); shade(c, () => rrect(c, x, y, w, h, 24), COL.woodDk, w * 0.25, h * 0.3, 0.4);
  const r = rnd(seed); for (let i = 0; i < 9; i++) shape(c, () => ell(c, x + 30 + r() * (w - 60), y + 25 + r() * (h - 50), 12, 9), COL.woodDk, 0);
  if (wet) for (let i = 0; i < 5; i++) { const dx = x + 20 + r() * (w - 40), dy = y + h + 20 + r() * 30; shape(c, () => { c.moveTo(dx, dy + 14); c.quadraticCurveTo(dx - 12, dy, dx, dy - 16); c.quadraticCurveTo(dx + 12, dy, dx, dy + 14); c.closePath(); }, COL.water, 3); }
};
const term1 = (c: Ctx) => {
  ground(c);
  sponge(c, 110, 180, 240, 150, false, 71); arrow(c, [[400, 250], [500, 250]]); sponge(c, 560, 120, 380, 260, true, 72);
  grain(c, 230, 760, 80, 0, "dry"); arrow(c, [[400, 760], [500, 760]]); grain(c, 790, 760, 110, 0, "boiled");
};
// term 6: curd in a katori, and a zoom bubble full of tiny rod-shaped bacteria
const term6 = (c: Ctx) => {
  ground(c);
  bowl(c, 400, 680, 230, CURD); shape(c, () => ell(c, 400, 680, 230, 46), CURD, 5);
  line(c, [[520, 640], [640, 470]], 6); line(c, [[520, 700], [740, 530]], 6);
  shape(c, () => ell(c, 770, 320, 210, 210), WHITE, 7);
  const r = rnd(81); for (let i = 0; i < 16; i++) { const a = r() * Math.PI * 2, d = r() * 140, bx = 770 + Math.cos(a) * d, by = 320 + Math.sin(a) * d, rot = r() * Math.PI; c.save(); c.translate(bx, by); c.rotate(rot); shape(c, () => rrect(c, -40, -14, 80, 28, 14), COL.purple, 4); c.restore(); }
};

export const ic_changesKitchenScienceL2 = cards("sci.changes.kitchen-science.L2", [e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, flowE1, flowE2, flowA1, flowA3, flowA4, flowP1, term3, term1, term6]);
