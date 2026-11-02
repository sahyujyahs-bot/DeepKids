import type { Ctx } from "./core";
import { D, INK, BG, RED, WHITE, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, line, arrow, glass, person, write, cards, hand } from "./flatKit";
import type { Pose } from "./flatKit";

// FEELINGS · set-up cards and card pictures for sci.health.feelings-and-wellbeing.L1.
// Same child (orange top) and grown-up (blue top) everywhere; a friend / younger child wears teal.

type Mood = "happy" | "sad" | "cross" | "calm" | "sleepy" | "scared" | "surprised";
const TEAL_KID = { cloth: COL.teal, dk: COL.tealDk };

// where person() puts the head centre
const headOf = (y: number, h: number, sit: boolean) => { const head = h * 0.13, sh = sit ? y - h * 0.06 - h * 0.32 : y - h * 0.74; return { hy: sh - head * 1.05, head }; };

// paint a mood over the standard smiling face of person(): eyes, brows and mouth
const mood = (c: Ctx, x: number, hy: number, head: number, kind: Mood, skin: string) => {
  shape(c, () => ell(c, x, hy + head * 0.42, head * 0.52, head * 0.3), skin, 0);
  const mx = x, my = hy + head * 0.42, w = Math.max(4, head * 0.08);
  if (kind === "calm" || kind === "sleepy") {
    shape(c, () => ell(c, x, hy + head * 0.12, head * 0.6, head * 0.22), skin, 0);
    for (const s of [-1, 1]) { c.beginPath(); c.arc(x + s * head * 0.35, hy + head * 0.08, head * 0.12, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = w; c.lineCap = "round"; c.stroke(); }
  }
  if (kind === "scared" || kind === "surprised") for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * head * 0.35, hy + head * 0.12, head * 0.14, head * 0.17), WHITE, 3); shape(c, () => ell(c, x + s * head * 0.35, hy + head * 0.14, head * 0.07, head * 0.09), INK, 0); }
  c.strokeStyle = INK; c.lineWidth = w; c.lineCap = "round"; c.beginPath();
  if (kind === "happy") c.arc(mx, my - head * 0.06, head * 0.3, 0.2, Math.PI - 0.2);
  else if (kind === "sad") c.arc(mx, my + head * 0.22, head * 0.26, Math.PI + 0.3, Math.PI * 2 - 0.3);
  else if (kind === "cross") { c.moveTo(mx - head * 0.28, my + head * 0.02); c.lineTo(mx + head * 0.28, my + head * 0.02); }
  else if (kind === "calm") { c.moveTo(mx - head * 0.2, my); c.quadraticCurveTo(mx, my + head * 0.12, mx + head * 0.2, my); }
  else if (kind === "sleepy") { c.moveTo(mx - head * 0.12, my + head * 0.02); c.lineTo(mx + head * 0.12, my + head * 0.02); }
  c.stroke();
  if (kind === "scared" || kind === "surprised") shape(c, () => ell(c, mx, my, head * 0.16, head * 0.2), INK, 0);
  // brows
  const by = hy - head * 0.12;
  if (kind === "cross") for (const s of [-1, 1]) line(c, [[x + s * head * 0.55, by - head * 0.1], [x + s * head * 0.15, by + head * 0.06]], w);
  if (kind === "sad") for (const s of [-1, 1]) line(c, [[x + s * head * 0.55, by + head * 0.04], [x + s * head * 0.15, by - head * 0.08]], w);
  if (kind === "scared" || kind === "surprised") for (const s of [-1, 1]) line(c, [[x + s * head * 0.55, by - head * 0.08], [x + s * head * 0.15, by - head * 0.18]], w);
};
const kid = (c: Ctx, x: number, y: number, h: number, p: Pose, kind: Mood) => { person(c, x, y, h, p); const { hy, head } = headOf(y, h, !!p.sit); mood(c, x, hy, head, kind, p.adult ? SKIN.adult : SKIN.child); };
// a second child in a teal top: same drawing, recoloured
const friend = (c: Ctx, x: number, y: number, h: number, p: Pose, kind: Mood) => {
  const o = (CLOTH as any).child, od = (CLOTH as any).childDk; (CLOTH as any).child = TEAL_KID.cloth; (CLOTH as any).childDk = TEAL_KID.dk;
  kid(c, x, y, h, p, kind); (CLOTH as any).child = o; (CLOTH as any).childDk = od;
};

// a child-drawn face in a crayon circle
const faceCircle = (c: Ctx, x: number, y: number, r: number, kind: Mood | null, col: string = COL.blue) => {
  c.strokeStyle = col; c.lineWidth = r * 0.1; c.lineCap = "round"; c.lineJoin = "round";
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke();
  if (!kind) return;
  const e = r * 0.33;
  if (kind === "calm" || kind === "sleepy") for (const s of [-1, 1]) { c.beginPath(); c.arc(x + s * e, y - r * 0.2, r * 0.14, 0.2, Math.PI - 0.2); c.stroke(); }
  else for (const s of [-1, 1]) { c.beginPath(); c.arc(x + s * e, y - r * 0.22, r * 0.09, 0, Math.PI * 2); c.fillStyle = col; c.fill(); }
  c.beginPath();
  if (kind === "happy") c.arc(x, y + r * 0.15, r * 0.4, 0.3, Math.PI - 0.3);
  else if (kind === "sad") c.arc(x, y + r * 0.6, r * 0.35, Math.PI + 0.4, Math.PI * 2 - 0.4);
  else if (kind === "cross") { c.moveTo(x - r * 0.35, y + r * 0.4); c.lineTo(x + r * 0.35, y + r * 0.4); }
  else if (kind === "calm") { c.moveTo(x - r * 0.3, y + r * 0.35); c.quadraticCurveTo(x, y + r * 0.5, x + r * 0.3, y + r * 0.35); }
  else if (kind === "sleepy") { c.moveTo(x - r * 0.15, y + r * 0.4); c.lineTo(x + r * 0.15, y + r * 0.4); }
  else c.arc(x, y + r * 0.4, r * 0.18, 0, Math.PI * 2);
  c.stroke();
  if (kind === "cross") for (const s of [-1, 1]) line(c, [[x + s * r * 0.55, y - r * 0.55], [x + s * r * 0.18, y - r * 0.4]], r * 0.1, col);
  if (kind === "sad") for (const s of [-1, 1]) line(c, [[x + s * r * 0.55, y - r * 0.4], [x + s * r * 0.18, y - r * 0.52]], r * 0.1, col);
};
// a tiny clock showing an hour (0..11)
const clock = (c: Ctx, x: number, y: number, r: number, hr: number) => {
  shape(c, () => ell(c, x, y, r, r), WHITE, 3);
  const a = (hr / 12) * Math.PI * 2 - Math.PI / 2;
  line(c, [[x, y], [x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55]], 3); line(c, [[x, y], [x, y - r * 0.8]], 3);
};
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 14, y + h / 2 + 16, w / 2, h / 2); shape(c, () => rrect(c, x, y, w, h, 10), COL.paper, 5); };
// the six-circle feelings chart on a sheet: top-left (x, y), width w
const chart = (c: Ctx, x: number, y: number, w: number, faces: (Mood | null)[], times = true) => {
  const h = w * 0.78, r = w * 0.12, cx = [x + w * 0.22, x + w * 0.5, x + w * 0.78], cy = [y + h * 0.3, y + h * 0.72];
  paper(c, x, y, w, h);
  const hrs = [7, 8, 10, 1, 4, 8];
  faces.forEach((f, i) => { const X = cx[i % 3], Y = cy[Math.floor(i / 3)]; faceCircle(c, X, Y, r, f); if (times) clock(c, X, Y + r * 1.45, r * 0.3, hrs[i]); });
  return { cx, cy, r };
};
const crayon = (c: Ctx, x: number, y: number, an: number, col: string, len = 110) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -13, len, 26, 6), col, 5); shape(c, () => polyP(c, [[len, -13], [len + 22, 0], [len, 13]]), col, 5);
  c.restore();
};
const mat = (c: Ctx) => { shape(c, () => rrect(c, 40, 300, 1000, 720, 40), "#d8b48c", 6); c.strokeStyle = "#b9905f"; c.lineWidth = 4; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(60, 340 + i * 110); c.lineTo(1020, 340 + i * 110); c.stroke(); } };
const questionMark = (c: Ctx, x: number, y: number, s: number, col = INK) => { c.strokeStyle = col; c.lineWidth = s * 0.14; c.lineCap = "round"; c.beginPath(); c.arc(x, y - s * 0.55, s * 0.3, Math.PI, Math.PI * 2.35); c.lineTo(x, y + s * 0.05); c.stroke(); shape(c, () => ell(c, x, y + s * 0.4, s * 0.09, s * 0.09), col, 0); };
const thought = (c: Ctx, x: number, y: number, r: number, fx: number, fy: number) => { shape(c, () => ell(c, fx, fy, r * 0.12, r * 0.12), WHITE, 4); shape(c, () => ell(c, (fx + x) / 2, (fy + y) / 2, r * 0.2, r * 0.2), WHITE, 4); shape(c, () => ell(c, x, y, r, r * 0.8), WHITE, 5); };

// ---------------------------------------------------------------- set-up cards (e1)
const setup0 = (c: Ctx) => {
  ground(c); mat(c);
  chart(c, 260, 380, 560, [null, null, null, null, null, null]);
  kid(c, 150, 870, 460, { sit: true, armR: [0, Math.PI * 0.2] }, "happy");
  crayon(c, 350, 745, -Math.PI * 0.65, COL.red, 80);
  kid(c, 940, 890, 520, { sit: true, adult: true, armL: [Math.PI * 0.75, Math.PI * 0.95], armR: [Math.PI * 0.6, Math.PI * 0.5] }, "happy");
  crayon(c, 720, 775, Math.PI * 1.05, COL.yellow, 70);
  crayon(c, 90, 960, -0.2, COL.green); crayon(c, 230, 985, 0.1, COL.blue); crayon(c, 860, 960, 0.3, COL.purple);
};
const setup1 = (c: Ctx) => {
  ground(c);
  // kitchen: shelf with a pot, counter with a drawer
  shape(c, () => rrect(c, 80, 150, 920, 30, 6), COL.wood); shape(c, () => rrect(c, 160, 70, 130, 84, 14), COL.steel); shape(c, () => rrect(c, 760, 90, 170, 64, 10), COL.steel);
  shape(c, () => rrect(c, 0, 790, D, 300, 0), COL.teal, 0); shape(c, () => rrect(c, -10, 760, D + 20, 50, 8), COL.steel); shape(c, () => rrect(c, 640, 850, 320, 150, 12), COL.tealDk); line(c, [[760, 925], [840, 925]], 10, COL.steelIn);
  kid(c, 400, 1040, 700, { armR: [Math.PI * 0.45, Math.PI * 0.85], armL: [Math.PI * 0.55, Math.PI * 0.5] }, "calm");
  thought(c, 760, 330, 150, 540, 480); questionMark(c, 760, 330, 150);
};
const setup2 = (c: Ctx) => {
  ground(c);
  // fridge door
  shadow(c, 470, 1040, 300, 30);
  shape(c, () => rrect(c, 160, 40, 560, 1040, 24), COL.steelIn); line(c, [[160, 330], [720, 330]], 6); shape(c, () => rrect(c, 650, 400, 30, 260, 12), COL.steel);
  const ch = chart(c, 220, 400, 420, ["happy", "calm", "cross", null, null, null]);
  for (const [tx, ty] of [[290, 400], [570, 400]]) shape(c, () => rrect(c, tx, ty - 14, 70, 28, 5), "rgba(255,220,120,0.85)", 3);
  kid(c, 900, 1040, 640, { armL: [Math.PI * 1.2, Math.PI * 1.05], armR: [Math.PI * 0.5, Math.PI * 0.5] }, "cross");
  crayon(c, 640, 560, Math.PI * 1.15, COL.red, 70);
  arrow(c, [[840, 250], [ch.cx[2] + 60, ch.cy[0] - 40]]);
};
const setup3 = (c: Ctx) => {
  ground(c); mat(c);
  chart(c, 260, 330, 560, ["happy", "cross", "calm", "sleepy", "sad", "happy"]);
  kid(c, 150, 880, 460, { sit: true, armR: [Math.PI * 1.6, Math.PI * 1.5] }, "happy");
  kid(c, 940, 900, 520, { sit: true, adult: true, armL: [Math.PI * 1.4, Math.PI * 1.5] }, "happy");
  hand(c, 760, 490, -Math.PI / 2, 0.9, SKIN.adult, CLOTH.adult, true);
  shape(c, () => ell(c, 560, 180, 80, 80), WHITE, 6); write(c, "5", 532, 130, 100, RED, 10);
};

// ---------------------------------------------------------------- card pictures
const flowE1 = (c: Ctx) => {
  ground(c); mat(c);
  chart(c, 200, 300, 680, ["happy", "cross", "calm", "sleepy", "sad", "happy"]);
  crayon(c, 80, 920, -0.3, COL.red); crayon(c, 300, 960, 0.15, COL.blue); crayon(c, 700, 950, -0.1, COL.green); crayon(c, 880, 380, Math.PI * 0.45, COL.yellow);
};
const flowA1 = (c: Ctx) => {
  ground(c); mat(c);
  kid(c, 230, 960, 560, { sit: true, adult: true, armR: [Math.PI * 1.8, Math.PI * 1.9], armL: [Math.PI * 0.6, Math.PI * 0.5] }, "happy");
  kid(c, 720, 1000, 720, { armL: [Math.PI, Math.PI], armR: [0, 0] }, "cross");
  arrow(c, [[720, 300], [500, 300]]); arrow(c, [[720, 300], [940, 300]]);
};
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, state: "cloudy" | "clear") => {
  shadow(c, x + 12, y + 10, w * 0.6, w * 0.14);
  const body = () => { c.moveTo(x - w / 2, y); c.lineTo(x - w / 2, y - h * 0.72); c.quadraticCurveTo(x - w / 2, y - h * 0.84, x - w * 0.18, y - h * 0.88); c.lineTo(x - w * 0.18, y - h); c.lineTo(x + w * 0.18, y - h); c.lineTo(x + w * 0.18, y - h * 0.88); c.quadraticCurveTo(x + w / 2, y - h * 0.84, x + w / 2, y - h * 0.72); c.lineTo(x + w / 2, y); c.closePath(); };
  c.save(); c.beginPath(); body(); c.clip();
  if (state === "cloudy") { c.fillStyle = "#d9c7a4"; c.fillRect(x - w, y - h * 0.86, w * 2, h); let s = 3; const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); for (let i = 0; i < 140; i++) shape(c, () => ell(c, x - w / 2 + r() * w, y - h * 0.84 + r() * h * 0.82, 5, 4), "#b8995f", 0); }
  else { c.fillStyle = COL.water; c.fillRect(x - w, y - h * 0.86, w * 2, h); shape(c, () => rrect(c, x - w, y - h * 0.14, w * 2, h * 0.2, 0), "#c9a96a", 0); }
  c.restore();
  shape(c, body, COL.glass, 6);
  shape(c, () => rrect(c, x - w * 0.24, y - h * 1.1, w * 0.48, h * 0.12, 6), COL.teal, 5);
  line(c, [[x - w * 0.36, y - h * 0.6], [x - w * 0.36, y - h * 0.15]], 9, "rgba(255,255,255,0.7)");
};
const flowA2 = (c: Ctx) => {
  ground(c); shape(c, () => rrect(c, 0, 880, D, 220, 0), COL.wood, 0); line(c, [[0, 880], [D, 880]], 6);
  bottle(c, 280, 880, 260, 640, "cloudy");
  for (const [a, b] of [[[110, 300], [70, 340]], [[110, 420], [60, 420]], [[110, 540], [70, 500]], [[450, 300], [490, 340]], [[450, 420], [500, 420]], [[450, 540], [490, 500]]]) line(c, [a, b], 7);
  arrow(c, [[440, 180], [650, 180]]);
  bottle(c, 800, 880, 260, 640, "clear");
};
const flowA4 = (c: Ctx) => {
  ground(c); mat(c);
  paper(c, 190, 120, 700, 880);
  const px = 540, py = 780, PAPER = "#fff3d6";
  const finger = (an: number, len: number, w: number) => { c.save(); c.translate(px, py - 120); c.rotate(an); shape(c, () => rrect(c, -w / 2, -len, w, len + 80, w / 2), PAPER, 6); c.restore(); };
  const F: [number, number, number][] = [[-0.95, 300, 100], [-0.32, 420, 96], [-0.08, 460, 96], [0.16, 430, 92], [0.42, 340, 86]];
  F.forEach(([a, l, w]) => finger(a, l, w));
  shape(c, () => rrect(c, px - 170, py - 150, 340, 320, 80), PAPER, 6); shape(c, () => rrect(c, px - 166, py - 146, 332, 312, 76), PAPER, 0);
  for (const [a, w] of [[-0.32, 96], [-0.08, 96], [0.16, 92], [0.42, 86]]) { c.save(); c.translate(px, py - 120); c.rotate(a); shape(c, () => rrect(c, -w / 2 + 3, -60, w - 6, 70, 0), PAPER, 0); c.restore(); }
  const tip = (i: number, k: number) => { const [a, l] = F[i]; return [px + Math.sin(a) * (l - k), py - 120 - Math.cos(a) * (l - k)]; };
  // thumb: lungs
  { const [x, y] = tip(0, 90); for (const s of [-1, 1]) shape(c, () => ell(c, x + s * 22, y + 6, 20, 30), COL.pink, 4); line(c, [[x, y - 40], [x, y - 10]], 5); }
  // index: two people hugging
  { const [x, y] = tip(1, 110); for (const s of [-1, 1]) { shape(c, () => rrect(c, x + s * 20 - 16, y - 10, 32, 50, 12), s < 0 ? COL.orange : COL.blue, 4); shape(c, () => ell(c, x + s * 20, y - 24, 15, 15), SKIN.child, 4); } line(c, [[x - 30, y + 10], [x + 30, y + 10]], 6); }
  // middle: a talking mouth
  { const [x, y] = tip(2, 110); shape(c, () => ell(c, x, y, 34, 20), COL.red, 4); line(c, [[x - 24, y], [x + 24, y]], 4, WHITE); line(c, [[x + 44, y - 16], [x + 58, y - 24]], 4); line(c, [[x + 46, y + 2], [x + 64, y + 2]], 4); }
  // ring: a tumbler of water
  { const [x, y] = tip(3, 90); glass(c, x, y + 36, 50, 72, 0.6); }
  // little: a quiet corner cushion
  { const [x, y] = tip(4, 85); shape(c, () => rrect(c, x - 32, y - 20, 64, 44, 14), COL.purple, 4); line(c, [[x - 10, y - 2], [x + 10, y - 2]], 4, "#d9c8f0"); }
  crayon(c, 650, 940, -0.25, COL.blue, 90);
};
const flowP1 = (c: Ctx) => {
  c.fillStyle = "#3a3f73"; c.fillRect(0, 0, D, D);
  // window with a moon
  shape(c, () => rrect(c, 90, 90, 340, 300, 10), "#1c2050", 6); shape(c, () => ell(c, 300, 200, 48, 48), COL.yellow, 4); shape(c, () => ell(c, 322, 190, 40, 40), "#1c2050", 0);
  // bed
  shadow(c, 560, 1000, 460, 30);
  shape(c, () => rrect(c, 120, 760, 860, 190, 20), COL.wood); shape(c, () => rrect(c, 140, 700, 820, 90, 24), COL.cloth);
  shape(c, () => rrect(c, 150, 560, 230, 150, 40), WHITE, 6);
  kid(c, 560, 850, 500, { sit: true, armR: [Math.PI * 0.2, Math.PI * 0.55], armL: [Math.PI * 0.7, Math.PI * 0.55] }, "happy");
  shape(c, () => rrect(c, 140, 790, 700, 120, 26), COL.purple, 6);
  // notebook on the lap, a sad face drawn in it
  shadow(c, 700, 790, 80, 14); shape(c, () => rrect(c, 600, 690, 150, 100, 8), COL.paper, 5); line(c, [[675, 690], [675, 790]], 3); faceCircle(c, 638, 740, 26, "sad", COL.blue);
  crayon(c, 730, 720, -Math.PI * 0.7, COL.red, 60);
  // side table and lamp
  shape(c, () => rrect(c, 820, 640, 170, 120, 12), COL.brown); shape(c, () => polyP(c, [[850, 470], [960, 470], [990, 560], [820, 560]]), COL.yellow); shape(c, () => rrect(c, 896, 560, 18, 80, 6), COL.steel, 5);
  c.globalAlpha = 0.25; shape(c, () => polyP(c, [[820, 560], [990, 560], [1080, 1000], [700, 1000]]), COL.yellow, 0); c.globalAlpha = 1;
};
const term0 = (c: Ctx) => {
  ground(c); shape(c, () => rrect(c, 0, 900, D, 200, 0), COL.greenLt, 0); line(c, [[0, 900], [D, 900]], 6);
  kid(c, 300, 1000, 700, { armR: [Math.PI * 0.05, -Math.PI * 0.25], armL: [Math.PI * 0.55, Math.PI * 0.5] }, "happy");
  friend(c, 800, 1000, 660, { armL: [Math.PI * 0.95, Math.PI * 1.2], armR: [Math.PI * 0.45, Math.PI * 0.5] }, "happy");
  // the half mango, held between them
  shadow(c, 560, 650, 110, 20);
  shape(c, () => ell(c, 540, 560, 130, 95, -0.3), COL.orange, 6); shape(c, () => ell(c, 540, 560, 112, 76, -0.3), COL.yellow, 3); shape(c, () => ell(c, 540, 560, 58, 28, -0.3), COL.woodDk, 3);
  // the skin of the mango showing at the back edge
  c.beginPath(); c.ellipse(540, 560, 130, 95, -0.3, Math.PI * 0.9, Math.PI * 1.75); c.lineWidth = 16; c.strokeStyle = COL.orange; c.stroke();
};
const term1 = (c: Ctx) => {
  c.fillStyle = "#2c2f66"; c.fillRect(0, 0, D, D); shape(c, () => rrect(c, 0, 930, D, 160, 0), COL.greyDk, 0); line(c, [[0, 930], [D, 930]], 6);
  // the firecracker burst
  const bx = 820, by = 300;
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[bx + Math.cos(a) * 90, by + Math.sin(a) * 90], [bx + Math.cos(a) * (i % 2 ? 190 : 150), by + Math.sin(a) * (i % 2 ? 190 : 150)]], 9, i % 2 ? COL.yellow : COL.orange); }
  shape(c, () => { for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, r = i % 2 ? 120 : 70; i ? c.lineTo(bx + Math.cos(a) * r, by + Math.sin(a) * r) : c.moveTo(bx + Math.cos(a) * r, by + Math.sin(a) * r); } c.closePath(); }, COL.yellow, 6);
  shape(c, () => ell(c, bx, by, 40, 40), COL.red, 4);
  shadow(c, 400, 935, 150, 22);
  kid(c, 400, 860, 680, { armL: [Math.PI * 1.3, Math.PI * 1.5], armR: [Math.PI * 1.7, Math.PI * 1.5] }, "scared");
  // the heart beating fast on the chest
  const hx = 400, hy = 480;
  shape(c, () => { c.moveTo(hx, hy + 40); c.bezierCurveTo(hx - 60, hy - 5, hx - 30, hy - 50, hx, hy - 20); c.bezierCurveTo(hx + 30, hy - 50, hx + 60, hy - 5, hx, hy + 40); c.closePath(); }, COL.red, 5);
  for (const s of [-1, 1]) { line(c, [[hx + s * 70, hy - 40], [hx + s * 95, hy - 60]], 5, RED); line(c, [[hx + s * 80, hy], [hx + s * 110, hy]], 5, RED); line(c, [[hx + s * 70, hy + 40], [hx + s * 95, hy + 60]], 5, RED); }
};
const term2 = (c: Ctx) => {
  ground(c);
  // window with rain
  shape(c, () => rrect(c, 300, 80, 480, 360, 10), COL.sky, 6);
  c.save(); c.beginPath(); rrect(c, 300, 80, 480, 360, 10); c.clip(); shape(c, () => ell(c, 440, 150, 120, 50), COL.grey, 4); shape(c, () => ell(c, 650, 170, 110, 46), COL.grey, 4);
  for (let i = 0; i < 14; i++) for (let j = 0; j < 3; j++) line(c, [[320 + i * 36 + j * 12, 230 + j * 70], [312 + i * 36 + j * 12, 262 + j * 70]], 4, COL.blueDk); c.restore();
  line(c, [[540, 80], [540, 440]], 6); line(c, [[300, 260], [780, 260]], 6);
  // bed, lying child
  shadow(c, 560, 940, 440, 30);
  shape(c, () => rrect(c, 100, 760, 880, 170, 20), COL.wood); shape(c, () => rrect(c, 120, 700, 840, 80, 20), COL.cloth);
  shape(c, () => rrect(c, 760, 600, 200, 120, 36), WHITE, 6);
  c.save(); c.translate(300, 640); c.rotate(Math.PI / 2); kid(c, 0, 0, 540, { armL: [Math.PI * 0.55, Math.PI * 0.6], armR: [Math.PI * 0.45, Math.PI * 0.4] }, "calm"); c.restore();
  shape(c, () => rrect(c, 120, 560, 500, 150, 26), COL.purple, 6);
};
const term3 = (c: Ctx) => {
  ground(c); mat(c);
  friend(c, 680, 920, 400, { sit: true, armL: [Math.PI * 0.8, Math.PI * 0.9], armR: [Math.PI * 0.4, Math.PI * 0.6] }, "sad");
  shape(c, () => ell(c, 772, 844, 20, 14), COL.red, 3);
  for (const [dx, dy] of [[-40, -70], [40, -70]]) { line(c, [[680 + dx, 760 + dy], [680 + dx * 1.1, 790 + dy]], 5, COL.blue); }
  kid(c, 430, 900, 520, { sit: true, armR: [0, Math.PI * 0.3], armL: [Math.PI * 0.6, Math.PI * 0.5] }, "happy");
};
const expl4 = (c: Ctx) => {
  ground(c); mat(c);
  kid(c, 380, 940, 620, { sit: true, adult: true, armR: [0, Math.PI * 0.35], armL: [Math.PI * 0.6, Math.PI * 0.5] }, "happy");
  kid(c, 650, 940, 480, { sit: true, armL: [Math.PI * 0.55, Math.PI * 0.6], armR: [Math.PI * 0.45, Math.PI * 0.5] }, "calm");
  // a slow breath out
  const { hy, head } = headOf(940, 480, true);
  arrow(c, [[650 + head * 0.7, hy + head * 0.45], [650 + head * 2.2, hy + head * 0.2], [650 + head * 3.4, hy + head * 0.6]]);
  for (let i = 0; i < 3; i++) shape(c, () => ell(c, 650 + head * (1.4 + i * 0.8), hy - head * (0.2 + i * 0.25), 10 + i * 4, 10 + i * 4), WHITE, 3);
};

export const ic_healthFeelingsAndWellbeingL1 = cards("sci.health.feelings-and-wellbeing.L1", [
  setup0, setup1, setup2, setup3,
  flowE1, flowA1, flowA2, flowA4, flowP1, term0, term1, term2, term3, expl4,
]);
