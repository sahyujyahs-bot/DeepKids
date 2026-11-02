import type { Ctx } from "./core";
import { COL, INK, RED, SKIN, CLOTH, WHITE, arrow, cards, ell, ground, line, person, polyP, rrect, shade, shadow, shape, write, seed, hand, bowl } from "./flatKit";

// COMMUNITY AND HELPERS L3 · picture cards. Flat DeepKids look, light from the upper left.
// Same child (orange kurta) and grown-up (blue shirt) as the set-up cards; helpers are told apart by what they carry.
// Red arrows = movement or change. Numbers only with write(); no words.

type Pt = [number, number];
const WALL = "#f2d6a2", WALL_DK = "#dcb67a", ROOF = "#c9674a", ROOF_DK = "#a24b36", ROAD = "#a5abb6", ROAD_DK = "#858c99", SKYC = "#cfe8f6", GRASS = "#9ccf62", GRASS_DK = "#6aa53f";
const rr = (c: Ctx, x: number, y: number, w: number, h: number, fill: string, ln = 6, r = 10) => shape(c, () => rrect(c, x, y, w, h, Math.min(r, w / 2, h / 2)), fill, ln);
const rrs = (c: Ctx, x: number, y: number, w: number, h: number, fill: string, dk: string, ln = 6, r = 10) => {
  const p = () => rrect(c, x, y, w, h, Math.min(r, w / 2, h / 2)); shape(c, p, fill, ln); shade(c, p, dk, -w * 0.06, 0, 0.6);
};
const disc = (c: Ctx, x: number, y: number, r: number, fill: string, ln = 5) => shape(c, () => ell(c, x, y, r, r), fill, ln);
const cloud = (c: Ctx, x: number, y: number, s: number) => { c.beginPath(); ell(c, x, y, 90 * s, 36 * s); ell(c, x - 40 * s, y - 24 * s, 44 * s, 36 * s); ell(c, x + 30 * s, y - 34 * s, 50 * s, 40 * s); c.fillStyle = WHITE; c.fill(); };
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water, ln = 5) => {
  shape(c, () => { c.moveTo(x, y - 1.5 * s); c.bezierCurveTo(x + 0.4 * s, y - 0.8 * s, x + s, y - 0.4 * s, x + s, y + 0.2 * s); c.bezierCurveTo(x + s, y + 0.9 * s, x - s, y + 0.9 * s, x - s, y + 0.2 * s); c.bezierCurveTo(x - s, y - 0.4 * s, x - 0.4 * s, y - 0.8 * s, x, y - 1.5 * s); c.closePath(); }, col, ln);
  line(c, [[x - s * 0.5, y + 0.1 * s], [x - s * 0.35, y + 0.5 * s]], Math.max(3, s * 0.14), WHITE);
};
const noSign = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - s, y - s], [x + s, y + s]], 12, RED); line(c, [[x + s, y - s], [x - s, y + s]], 12, RED); };
const dots = (c: Ctx, a: Pt, b: Pt, n: number, r = 7, col: string = RED) => { for (let i = 0; i <= n; i++) { const t = i / n; disc(c, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, r, col, 0); } };
const floor = (c: Ctx, y: number, col = "#e0cfa8") => { c.fillStyle = col; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 6); };
const pipe = (c: Ctx, pts: number[][], w = 20) => { line(c, pts, w + 10, INK); line(c, pts, w, COL.steel); };
const tick = (c: Ctx, x: number, y: number, s: number) => line(c, [[x - s, y], [x - s * 0.3, y + s * 0.7], [x + s, y - s * 0.8]], 14, COL.greenDk);

// a person with arms reaching for points; returns where the wrists are so a prop can be drawn there
const ppl = (c: Ctx, x: number, y: number, h: number, o: { adult?: boolean; sit?: boolean; L?: Pt; R?: Pt } = {}): { L: Pt; R: Pt } => {
  const sh = (o.sit ? y - h * 0.38 : y - h * 0.74) + h * 0.03, l1 = h * 0.17, l2 = h * 0.16;
  const arm = (side: number, t: Pt | undefined, def: [number, number]): { a: [number, number]; w: Pt } => {
    const sx = x + side * h * 0.11;
    if (!t) { const ex = sx + Math.cos(def[0]) * l1, ey = sh + Math.sin(def[0]) * l1; return { a: def, w: [ex + Math.cos(def[1]) * l2, ey + Math.sin(def[1]) * l2] }; }
    const dx = t[0] - sx, dy = t[1] - sh, d = Math.min(l1 + l2 - 2, Math.max(20, Math.hypot(dx, dy))), th = Math.atan2(dy, dx);
    const ca = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))), c1 = th + ca, c2 = th - ca, a1 = Math.sin(c1) >= Math.sin(c2) ? c1 : c2;
    const ex = sx + Math.cos(a1) * l1, ey = sh + Math.sin(a1) * l1, tx = sx + Math.cos(th) * d, ty = sh + Math.sin(th) * d, a2 = Math.atan2(ty - ey, tx - ex);
    return { a: [a1, a2], w: [ex + Math.cos(a2) * l2, ey + Math.sin(a2) * l2] };
  };
  const L = arm(-1, o.L, [Math.PI * 0.55, Math.PI * 0.5]), R = arm(1, o.R, [Math.PI * 0.45, Math.PI * 0.5]);
  person(c, x, y, h, { armL: L.a, armR: R.a, sit: o.sit, adult: o.adult });
  return { L: L.w, R: R.w };
};
// small details for helpers
const cap = (c: Ctx, x: number, y: number, h: number, col: string) => { const hd = h * 0.13, hy = y - h * 0.74 - hd * 1.05; shape(c, () => { c.moveTo(x - hd * 1.05, hy - hd * 0.1); c.bezierCurveTo(x - hd, hy - hd * 1.6, x + hd, hy - hd * 1.6, x + hd * 1.05, hy - hd * 0.1); c.closePath(); }, col, 5); line(c, [[x - hd * 1.05, hy - hd * 0.1], [x + hd * 1.5, hy - hd * 0.1]], 8, INK); };
const stripes = (c: Ctx, x: number, y: number, h: number, col = COL.orange) => { for (const s of [-1, 1]) line(c, [[x + s * h * 0.05, y - h * 0.74 - h * 0.01], [x + s * h * 0.05, y - h * 0.4]], h * 0.03, col); };
const coat = (c: Ctx, x: number, y: number, h: number) => { shape(c, () => rrect(c, x - h * 0.17, y - h * 0.76, h * 0.34, h * 0.46, h * 0.05), WHITE, 6); };
const broom = (c: Ctx, w: Pt, len: number) => { line(c, [[w[0] + 6, w[1] - len * 0.4], [w[0] - 20, w[1] + len * 0.6]], 12, INK); line(c, [[w[0] + 6, w[1] - len * 0.4], [w[0] - 20, w[1] + len * 0.6]], 6, COL.wood); shape(c, () => polyP(c, [[w[0] - 50, w[1] + len * 0.6 - 6], [w[0] + 10, w[1] + len * 0.6 - 6], [w[0] + 30, w[1] + len * 0.6 + 52], [w[0] - 70, w[1] + len * 0.6 + 52]]), COL.yellow, 5); };
const milkPacket = (c: Ctx, x: number, y: number, s: number) => { rr(c, x - 24 * s, y - 36 * s, 48 * s, 72 * s, WHITE, 5, 6); rr(c, x - 24 * s, y - 6 * s, 48 * s, 26 * s, COL.blue, 4, 4); };
const gasCylinder = (c: Ctx, x: number, y: number, s: number) => { rrs(c, x - 45 * s, y - 110 * s, 90 * s, 110 * s, RED, "#a82d22", 6, 36 * s); rr(c, x - 22 * s, y - 130 * s, 44 * s, 24 * s, COL.steel, 5, 6); };
const bagSatchel = (c: Ctx, x: number, y: number, s: number) => { rrs(c, x - 60 * s, y - 40 * s, 120 * s, 80 * s, "#9c7a3c", "#7b5d28", 6, 14); rr(c, x - 60 * s, y - 40 * s, 120 * s, 28 * s, "#7b5d28", 5, 10); };
const letter = (c: Ctx, x: number, y: number, w: number, rot = 0) => { c.save(); c.translate(x, y); c.rotate(rot); rr(c, -w / 2, -w * 0.34, w, w * 0.68, WHITE, 5, 4); line(c, [[-w / 2, -w * 0.34], [0, 0], [w / 2, -w * 0.34]], 4); c.restore(); };

// ---------------------------------------------------------------- buildings and big things
const tank = (c: Ctx, cx: number, by: number, w: number, h: number, open = false) => {
  const top = by - h, body = () => { c.moveTo(cx - w / 2, top); c.lineTo(cx - w / 2, by); c.quadraticCurveTo(cx, by + w * 0.2, cx + w / 2, by); c.lineTo(cx + w / 2, top); c.closePath(); };
  shape(c, body, COL.blue, 6); shade(c, body, COL.blueDk, -w * 0.1, 0, 0.7);
  for (const f of [0.35, 0.7]) { c.beginPath(); c.moveTo(cx - w / 2, top + h * f); c.quadraticCurveTo(cx, top + h * f + w * 0.18, cx + w / 2, top + h * f); c.strokeStyle = COL.blueDk; c.lineWidth = 5; c.stroke(); }
  shape(c, () => ell(c, cx, top, w / 2, w * 0.12), open ? "#2f5f94" : COL.blue, 6);
  if (open) { shape(c, () => ell(c, cx, top + 4, w * 0.4, w * 0.085), COL.water, 4); } else { shape(c, () => ell(c, cx, top - 6, w * 0.16, w * 0.04), COL.blueDk, 5); }
};
const windowBox = (c: Ctx, x: number, y: number, w: number, h: number, col = COL.sky) => { rr(c, x, y, w, h, col, 5, 4); line(c, [[x + w / 2, y], [x + w / 2, y + h]], 4); line(c, [[x, y + h * 0.5], [x + w, y + h * 0.5]], 4); };
const flatsBlock = (c: Ctx, x: number, y: number, w: number, h: number, rows: number, cols: number): Pt[] => {
  const p = () => rrect(c, x, y, w, h, 8); shape(c, p, WALL, 6); shade(c, p, WALL_DK, -w * 0.05, 0, 0.7);
  const out: Pt[] = [], gx = w / cols, gy = (h - 60) / rows;
  for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) { const ww = gx * 0.52, hh = gy * 0.56, wx = x + k * gx + (gx - ww) / 2, wy = y + 24 + r * gy + (gy - hh) / 2; windowBox(c, wx, wy, ww, hh); out.push([wx + ww / 2, wy + hh / 2]); }
  rr(c, x + w / 2 - 36, y + h - 74, 72, 74, COL.brown, 6, 6);
  return out;
};
const school = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  rrs(c, -150, -170, 300, 170, "#f6d77a", "#dcae3c", 6, 8);
  shape(c, () => polyP(c, [[-170, -170], [0, -250], [170, -170]]), ROOF, 6);
  rr(c, -34, -90, 68, 90, COL.brown, 6, 6); for (const dx of [-110, 76]) windowBox(c, dx, -140, 42, 56);
  line(c, [[0, -250], [0, -310]], 6); shape(c, () => polyP(c, [[0, -310], [56, -290], [0, -270]]), COL.orange, 5);
  c.restore();
};
const clinic = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  rrs(c, -150, -190, 300, 190, WHITE, "#d6dde6", 6, 8);
  rr(c, -150, -190, 300, 26, "#e9eef3", 6, 8);
  shape(c, () => polyP(c, [[-18, -150], [18, -150], [18, -118], [50, -118], [50, -82], [18, -82], [18, -50], [-18, -50], [-18, -82], [-50, -82], [-50, -118], [-18, -118]]), RED, 5);
  rr(c, 70, -90, 56, 90, COL.water, 6, 6); rr(c, -126, -90, 56, 90, COL.water, 6, 6);
  c.restore();
};
const postbox = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s); shadow(c, 20, 6, 80, 14);
  rrs(c, -55, -230, 110, 230, RED, "#a82d22", 6, 30); shape(c, () => ell(c, 0, -230, 62, 22), "#b92f23", 6);
  rr(c, -36, -170, 72, 16, INK, 3, 6); rr(c, -55, -60, 110, 12, "#a82d22", 4, 4);
  c.restore();
};
const lorry = (c: Ctx, x: number, y: number, s: number, body: string, bodyDk: string, tankShape: boolean) => {
  c.save(); c.translate(x, y); c.scale(s, s); shadow(c, 20, 4, 240, 14);
  rr(c, -230, -70, 460, 34, "#4a4558", 6, 6);
  if (tankShape) { rrs(c, -225, -190, 290, 125, body, bodyDk, 6, 60); } else { rrs(c, -225, -200, 290, 135, body, bodyDk, 6, 12); rr(c, -225, -200, 290, 22, bodyDk, 5, 8); }
  shape(c, () => polyP(c, [[85, -190], [170, -190], [225, -110], [225, -65], [85, -65]]), COL.yellow, 6);
  shape(c, () => polyP(c, [[110, -170], [162, -170], [196, -118], [110, -118]]), COL.sky, 5);
  for (const wx of [-140, 130]) { disc(c, wx, -42, 42, INK, 0); disc(c, wx, -42, 18, COL.steel, 4); }
  c.restore();
};
const shopAwning = (c: Ctx, x: number, y: number, w: number) => {
  rr(c, x, y, w, 190, "#fff3d6", 6, 6); rr(c, x + 20, y + 80, w - 40, 110, "#d9b27a", 5, 6);
  for (let i = 0; i < 6; i++) shape(c, () => polyP(c, [[x + (i * w) / 6, y - 40], [x + ((i + 1) * w) / 6, y - 40], [x + ((i + 1) * w) / 6, y + 30], [x + (i * w) / 6, y + 30]]), i % 2 ? WHITE : RED, 5);
};
const hut = (c: Ctx, x: number, y: number, w: number) => {
  rr(c, x - w / 2, y - w * 0.5, w, w * 0.5, "#e8c496", 6, 6); shape(c, () => polyP(c, [[x - w * 0.62, y - w * 0.5], [x, y - w * 0.95], [x + w * 0.62, y - w * 0.5]]), "#c8a24a", 6);
  rr(c, x - w * 0.12, y - w * 0.3, w * 0.24, w * 0.3, COL.brown, 5, 4);
};
const tree = (c: Ctx, x: number, y: number, s: number) => {
  rr(c, x - 24 * s, y - 220 * s, 48 * s, 220 * s, COL.brown, 6, 10);
  for (const [dx, dy, r] of [[-110, -250, 100], [100, -260, 105], [0, -340, 120], [-20, -230, 100]]) disc(c, x + dx * s, y + dy * s, r * s, COL.leaf, 6);
  for (const [dx, dy, r] of [[-110, -250, 100], [100, -260, 105], [0, -340, 120]]) { c.save(); c.beginPath(); ell(c, x + dx * s, y + dy * s, r * s - 3, r * s - 3); c.clip(); disc(c, x + dx * s + r * s * 0.5, y + dy * s + r * s * 0.5, r * s, COL.leafDk, 0); c.restore(); }
};
const cross = (c: Ctx, x: number, y: number, s: number) => shape(c, () => polyP(c, [[x - s * 0.3, y - s], [x + s * 0.3, y - s], [x + s * 0.3, y - s * 0.3], [x + s, y - s * 0.3], [x + s, y + s * 0.3], [x + s * 0.3, y + s * 0.3], [x + s * 0.3, y + s], [x - s * 0.3, y + s], [x - s * 0.3, y + s * 0.3], [x - s, y + s * 0.3], [x - s, y - s * 0.3], [x - s * 0.3, y - s * 0.3]]), RED, 5);
const paper = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => { c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(rot); shadow(c, 12, h / 2 + 10, w * 0.5, 14); rr(c, -w / 2, -h / 2, w, h, WHITE, 6, 6); c.restore(); };
const pencil = (c: Ctx, x: number, y: number, len: number, an: number) => { c.save(); c.translate(x, y); c.rotate(an); rr(c, 0, -14, len, 28, COL.yellow, 5, 4); shape(c, () => polyP(c, [[len, -14], [len + 40, 0], [len, 14]]), "#f2d2a0", 5); rr(c, -26, -14, 26, 28, COL.pink, 5, 4); c.restore(); };
const coin = (c: Ctx, x: number, y: number, r: number) => { disc(c, x, y, r, COL.yellow, 6); disc(c, x, y, r * 0.72, "#ffe58a", 4); line(c, [[x - r * 0.3, y - r * 0.3], [x + r * 0.2, y - r * 0.3], [x - r * 0.2, y + r * 0.05], [x + r * 0.3, y + r * 0.05]], 6, "#d39a3a"); line(c, [[x - r * 0.3, y + r * 0.05], [x + r * 0.1, y + r * 0.45]], 6, "#d39a3a"); };

// ================================================================ cards
// intro: a girl on the terrace looking into the open water tank; pipes run down the building
const intro = (c: Ctx) => {
  ground(c, SKYC); cloud(c, 190, 140, 1.1); cloud(c, 850, 110, 0.9);
  for (const [x, w, h] of [[0, 190, 160], [230, 150, 110], [880, 200, 150]]) rr(c, x, 700 - h, w, h, "#b7d4e6", 5, 4);
  c.fillStyle = WALL; c.fillRect(0, 720, 1080, 360); c.fillStyle = WALL_DK; c.fillRect(0, 700, 1080, 30); line(c, [[0, 700], [1080, 700]], 6); line(c, [[0, 730], [1080, 730]], 6);
  for (const x of [90, 330, 570, 810]) windowBox(c, x, 800, 150, 160);
  shadow(c, 740, 710, 230, 22); tank(c, 720, 700, 330, 380, true);
  pipe(c, [[880, 640], [990, 640], [990, 1080]]); pipe(c, [[560, 660], [440, 660]], 0);
  shape(c, () => ell(c, 150, 690, 90, 22), COL.blueDk, 6); shape(c, () => ell(c, 150, 676, 90, 22), COL.blue, 6); shape(c, () => ell(c, 150, 668, 20, 8), COL.blueDk, 5);
  shadow(c, 400, 706, 100, 18); ppl(c, 400, 700, 470, { R: [575, 345], L: [350, 520] });
};

// summary: the building with the helpers at the gate
const summary = (c: Ctx) => {
  ground(c, SKYC); cloud(c, 150, 120, 1); cloud(c, 900, 160, 0.8);
  floor(c, 820, "#cfd3da"); c.fillStyle = ROAD; c.fillRect(0, 880, 1080, 200); line(c, [[0, 880], [1080, 880]], 6);
  for (let x = 20; x < 1080; x += 160) rr(c, x, 970, 90, 14, WHITE, 0, 4);
  shadow(c, 450, 826, 320, 18); flatsBlock(c, 190, 290, 520, 530, 4, 3); tank(c, 450, 292, 190, 130);
  const m = ppl(c, 110, 960, 300, { adult: true, R: [150, 780] }); milkPacket(c, m.R[0] + 10, m.R[1], 0.9);
  const sw = ppl(c, 330, 960, 300, { adult: true, R: [350, 800] }); broom(c, sw.R, 260);
  stripes(c, 330, 960, 300);
  const p = ppl(c, 570, 960, 300, { adult: true, R: [600, 790] }); bagSatchel(c, 545, 840, 0.8); letter(c, p.R[0] + 14, p.R[1] - 4, 54, 0.3);
  cap(c, 570, 960, 300, COL.green);
  lorry(c, 850, 1010, 0.72, COL.blue, COL.blueDk, true);
};

// ---------------------------------------------------------------- experiments and activities
// e1: the shared pond: a bowl of chana fish, hands taking, slips of paper with how many each took
const e1 = (c: Ctx) => {
  ground(c); floor(c, 540, "#e6d6b4");
  bowl(c, 540, 480, 300);
  c.save(); c.beginPath(); ell(c, 540, 480, 292, 56); c.clip();
  for (let i = 0; i < 34; i++) { const a = i * 2.4, x = 540 + Math.cos(a) * (40 + (i % 7) * 34), y = 480 + Math.sin(a) * (4 + (i % 5) * 9); seed(c, x, y, 26, a, false, "#e0b469", "#b98338"); }
  c.restore();
  hand(c, 40, 440, 0.4, 1.9, SKIN.child, CLOTH.child); hand(c, 1040, 430, Math.PI - 0.4, 1.9, SKIN.adult, CLOTH.adult);
  seed(c, 330, 540, 26, 0.6, false, "#e0b469", "#b98338"); seed(c, 760, 555, 26, 2.2, false, "#e0b469", "#b98338");
  [[170, 700, "2", -0.08], [440, 740, "3", 0.04], [710, 700, "1", -0.03]].forEach(([x, y, n, r]) => { paper(c, x as number, y as number, 230, 250, r as number); write(c, n as string, (x as number) + 84, (y as number) + 60, 120, INK, 14); });
  pencil(c, 870, 930, 160, -0.5);
};
// e2: a postcard goes into the red post box, and the days are counted
const e2 = (c: Ctx) => {
  ground(c); floor(c, 640, "#e6d6b4");
  c.save(); c.translate(300, 330); c.rotate(-0.07); shadow(c, 20, 200, 270, 18); rr(c, -250, -170, 500, 340, WHITE, 6, 10);
  line(c, [[40, -150], [40, 150]], 5); for (let i = 0; i < 4; i++) line(c, [[70, -20 + i * 44], [220, -20 + i * 44]], 7, COL.grey);
  for (let i = 0; i < 4; i++) line(c, [[-220, -100 + i * 50], [10, -100 + i * 50]], 7, COL.grey);
  rr(c, 150, -150, 80, 96, COL.pink, 5, 6); disc(c, 190, -108, 22, COL.yellow, 4); c.restore();
  arrow(c, [[570, 330], [740, 330]]); postbox(c, 870, 600, 1.6);
  for (let i = 0; i < 7; i++) { rr(c, 70 + i * 140, 740, 120, 200, i === 0 ? COL.yellow : WHITE, 6, 8); write(c, String(i + 1), 108 + i * 140, 790, 80, INK, 12); }
  arrow(c, [[130, 980], [980, 980]]);
};
// a1: a list of the helpers who keep a building going
const a1 = (c: Ctx) => {
  ground(c); paper(c, 90, 50, 900, 980);
  const rows = [200, 440, 680, 920];
  rows.forEach((y, i) => { if (i) line(c, [[150, y - 150], [930, y - 150]], 5, COL.grey); });
  const m = ppl(c, 260, 270, 200, { adult: true, R: [300, 190] }); milkPacket(c, m.R[0] + 8, m.R[1], 0.5);
  const sw = ppl(c, 260, 510, 200, { adult: true, R: [290, 450] }); broom(c, sw.R, 170); stripes(c, 260, 510, 200);
  const p = ppl(c, 260, 750, 200, { adult: true }); bagSatchel(c, 250, 650, 0.55); cap(c, 260, 750, 200, COL.green);
  ppl(c, 260, 990, 200, { adult: true, R: [330, 930] }); gasCylinder(c, 340, 990, 0.8);
  rows.forEach((y) => { line(c, [[480, y - 80], [830, y - 80]], 12, COL.grey); line(c, [[480, y - 30], [700, y - 30]], 12, COL.grey); });
  [0, 1, 2, 3].forEach((i) => tick(c, 870, 130 + i * 240 + 120, 36));
  pencil(c, 800, 1000, 170, -2.6);
};
// a2: a child interviews a helper who irons clothes
const a2 = (c: Ctx) => {
  ground(c); floor(c, 880, "#e6d6b4");
  shadow(c, 770, 886, 260, 20);
  const a = ppl(c, 800, 880, 520, { adult: true, L: [650, 560] });
  shape(c, () => polyP(c, [[560, 640], [980, 640], [1030, 680], [510, 680]]), COL.teal, 6); line(c, [[600, 680], [560, 880]], 10); line(c, [[940, 680], [980, 880]], 10);
  shape(c, () => polyP(c, [[640, 600], [740, 600], [770, 640], [620, 640]]), "#ffffff", 5);
  shape(c, () => polyP(c, [[600, 610], [720, 610], [760, 640], [600, 640]]), COL.steel, 5); rr(c, 630, 580, 80, 24, COL.red, 5, 8);
  shape(c, () => rrect(c, 820, 560, 150, 82, 10), COL.pink, 6);
  ppl(c, 270, 880, 460, { L: [250, 620], R: [330, 640] });
  rr(c, 200, 590, 120, 150, WHITE, 5, 6); for (let i = 0; i < 4; i++) line(c, [[218, 626 + i * 30], [302, 626 + i * 30]], 4, COL.grey);
  pencil(c, 330, 650, 70, -0.9);
  shape(c, () => { rrect(c, 90, 40, 300, 170, 50); c.moveTo(240, 210); c.lineTo(290, 270); c.lineTo(310, 210); }, WHITE, 6);
  line(c, [[210, 80], [230, 70], [250, 90], [230, 120], [230, 140]], 14, INK); disc(c, 230, 170, 9, INK, 0);
};
// a3: the emergency card with its four numbers, taped to the wall
const a3 = (c: Ctx) => {
  ground(c, "#e4e9ef"); shadow(c, 560, 1010, 400, 20);
  rr(c, 160, 70, 760, 900, "#d6a86b", 7, 16);
  const rows: [string, number][] = [["112", 0], ["108", 1], ["101", 2], ["1098", 3]];
  rows.forEach(([n, i]) => {
    const y = 190 + i * 210; rr(c, 200, y - 80, 680, 160, "#fff8e6", 5, 20); disc(c, 310, y, 62, WHITE, 6);
    if (i === 0) { disc(c, 310, y, 36, RED, 4); for (const a of [-2.4, -1.57, -0.74]) line(c, [[310 + Math.cos(a) * 46, y + Math.sin(a) * 46 - 4], [310 + Math.cos(a) * 62, y + Math.sin(a) * 62 - 4]], 6, RED); }
    if (i === 1) cross(c, 310, y, 42);
    if (i === 2) shape(c, () => { c.moveTo(310, y - 48); c.bezierCurveTo(350, y - 10, 356, y + 40, 310, y + 48); c.bezierCurveTo(264, y + 40, 270, y - 10, 310, y - 48); c.closePath(); }, COL.orange, 5);
    if (i === 3) { disc(c, 310, y - 20, 18, SKIN.child, 4); shape(c, () => rrect(c, 290, y, 40, 44, 12), CLOTH.child, 4); }
    write(c, n, 410, y - 52, 104, INK, 14);
  });
  for (const [x, an] of [[180, -0.7], [900, 0.7]]) { c.save(); c.translate(x, 80); c.rotate(an); c.globalAlpha = 0.8; rr(c, -60, -22, 120, 44, "#fff3a8", 4, 4); c.restore(); c.globalAlpha = 1; }
};
// a4: the water trail: tap, roof tank, pipe underground, lake
const a4 = (c: Ctx) => {
  ground(c, SKYC); cloud(c, 560, 130, 0.9);
  c.fillStyle = COL.soil; c.fillRect(0, 760, 1080, 320); c.fillStyle = GRASS; c.fillRect(0, 700, 1080, 62); line(c, [[0, 700], [1080, 700]], 6); line(c, [[0, 762], [1080, 762]], 6);
  // lake
  shape(c, () => { c.moveTo(700, 700); c.quadraticCurveTo(880, 860, 1080, 700); c.closePath(); }, COL.water, 6);
  shape(c, () => polyP(c, [[700, 700], [1080, 700], [1080, 540], [930, 620]]), "#8fb59a", 6);
  for (let i = 0; i < 3; i++) line(c, [[790 + i * 70, 725 + (i % 2) * 8], [830 + i * 70, 725 + (i % 2) * 8]], 6, WHITE);
  // house with tank
  rrs(c, 330, 480, 250, 220, WALL, WALL_DK, 6, 6); tank(c, 440, 482, 130, 100); windowBox(c, 360, 540, 80, 90); rr(c, 480, 600, 70, 100, COL.brown, 6, 6);
  // tap at a sink on the left
  rrs(c, 20, 600, 220, 100, COL.steel, COL.steelDk, 6, 12);
  line(c, [[60, 600], [60, 540], [140, 540], [140, 570]], 22, INK); line(c, [[60, 600], [60, 540], [140, 540], [140, 570]], 12, COL.steel);
  drop(c, 140, 616, 16);
  // pipes underground
  pipe(c, [[60, 700], [60, 850], [330, 850]], 22); pipe(c, [[330, 850], [440, 850], [440, 700]], 22); pipe(c, [[330, 850], [880, 850], [880, 760]], 22);
  arrow(c, [[300, 380], [550, 330], [800, 380]]);
  drop(c, 460, 850, 14); drop(c, 640, 850, 14);
};
// a5: a child with a magnifier hunting for the rules at the lift
const a5 = (c: Ctx) => {
  ground(c); floor(c, 900, "#e6d6b4");
  rr(c, 480, 120, 520, 780, "#cfd7e0", 7, 10); rr(c, 520, 170, 210, 720, COL.steel, 6, 4); rr(c, 750, 170, 210, 720, COL.steel, 6, 4); line(c, [[740, 170], [740, 890]], 8);
  rr(c, 700, 40, 80, 56, "#2b2340", 6, 8); shape(c, () => polyP(c, [[740, 52], [758, 80], [722, 80]]), COL.yellow, 3);
  rr(c, 560, 90, 0, 0, WHITE, 0);
  shape(c, () => ell(c, 1010, 520, 30, 30), COL.yellow, 5);
  rr(c, 840, 380, 110, 130, WHITE, 5, 8); disc(c, 895, 425, 18, SKIN.adult, 4); shape(c, () => rrect(c, 872, 445, 46, 50, 12), CLOTH.adult, 4);
  rr(c, 560, 380, 110, 130, WHITE, 5, 8); disc(c, 615, 440, 40, COL.red, 4); line(c, [[590, 410], [640, 470]], 10, WHITE);
  const k = ppl(c, 230, 900, 520, { R: [380, 470], L: [200, 640] });
  disc(c, 420, 470, 70, "rgba(214,236,250,0.5)", 8); line(c, [[372, 520], [320, 580]], 16, INK);
};
// a6: a map with the public services near home
const a6 = (c: Ctx) => {
  ground(c); paper(c, 70, 70, 940, 940);
  c.fillStyle = "#d8ecb8"; c.fillRect(100, 100, 880, 880);
  line(c, [[100, 560], [980, 560]], 56, ROAD_DK); line(c, [[100, 560], [980, 560]], 44, ROAD); line(c, [[540, 100], [540, 980]], 56, ROAD_DK); line(c, [[540, 100], [540, 980]], 44, ROAD);
  const house = (x: number, y: number) => { rr(c, x - 50, y - 50, 100, 70, WALL, 6, 4); shape(c, () => polyP(c, [[x - 66, y - 50], [x, y - 110], [x + 66, y - 50]]), ROOF, 6); rr(c, x - 12, y - 24, 24, 44, COL.brown, 4, 3); };
  house(540, 400);
  school(c, 250, 380, 0.52); clinic(c, 800, 400, 0.5); postbox(c, 260, 900, 0.62); disc(c, 800, 820, 0, WHITE, 0);
  rr(c, 735, 750, 130, 70, "#7d7870", 6, 6); rr(c, 745, 735, 110, 22, COL.green, 5, 6);
  dots(c, [470, 410], [360, 400], 5); dots(c, [610, 410], [700, 420], 5);
  dots(c, [540, 500], [540, 840], 9); dots(c, [540, 840], [330, 880], 5);
  dots(c, [540, 640], [720, 720], 5);
  for (const [x, y] of [[250, 450], [800, 470], [260, 830]]) { shape(c, () => { c.moveTo(x, y - 6); c.bezierCurveTo(x - 30, y - 50, x - 30, y - 90, x, y - 90); c.bezierCurveTo(x + 30, y - 90, x + 30, y - 50, x, y - 6); c.closePath(); }, RED, 4); }
  pencil(c, 880, 980, 160, -2.4);
};
// c1: twelve flats, one tank: a turn for each floor
const c1 = (c: Ctx) => {
  ground(c, SKYC); cloud(c, 160, 140, 1); floor(c, 960, "#cfd3da");
  const w = flatsBlock(c, 230, 330, 620, 630, 4, 3); tank(c, 540, 330, 240, 150);
    [0, 1, 2, 3].forEach((r) => {
    const y = w[r * 3][1];
    if (r < 2) { disc(c, 130, y, 38, COL.yellow, 5); for (let k = 0; k < 8; k++) { const a = (k / 8) * 6.283; line(c, [[130 + Math.cos(a) * 46, y + Math.sin(a) * 46], [130 + Math.cos(a) * 62, y + Math.sin(a) * 62]], 6, COL.orange); } }
    else shape(c, () => { c.arc(130, y, 46, -1.2, 1.2, false); c.arc(150, y, 40, 1.0, -1.0, true); c.closePath(); }, COL.yellow, 5);
    w.slice(r * 3, r * 3 + 3).forEach(([x, yy]) => drop(c, x, yy + 6, 16));
  });
  write(c, "12", 820, 130, 120, INK, 14);
};
// c2: hang a bag on the door hook so the milk person does not have to wait
const c2 = (c: Ctx) => {
  ground(c); floor(c, 900, "#e6d6b4");
  rr(c, 60, 130, 360, 770, COL.brown, 7, 14); rr(c, 100, 180, 280, 300, "#c8915a", 5, 8); rr(c, 100, 520, 280, 330, "#c8915a", 5, 8); disc(c, 340, 500, 18, COL.yellow, 5);
  shape(c, () => ell(c, 200, 380, 18, 18), COL.steelDk, 5); line(c, [[200, 380], [200, 400]], 10);
  line(c, [[200, 392], [190, 440]], 6);
  shape(c, () => { c.moveTo(130, 460); c.lineTo(270, 460); c.lineTo(290, 640); c.lineTo(110, 640); c.closePath(); }, COL.cloth, 6); line(c, [[160, 460], [150, 400], [220, 380]], 6);
  milkPacket(c, 200, 600, 0.7);
  const m = ppl(c, 770, 900, 520, { adult: true, L: [480, 560], R: [840, 640] });
  cap(c, 770, 900, 520, COL.green);
  milkPacket(c, m.L[0] - 18, m.L[1] - 4, 0.9);
  rr(c, 840, 600, 150, 120, COL.wood, 6, 8); milkPacket(c, 890, 590, 0.55); milkPacket(c, 940, 590, 0.55);
  arrow(c, [[520, 440], [440, 500]]);
};
// p1 already has a photo

// ---------------------------------------------------------------- terms
// 0 community: neighbours waving from balconies, a shop at the gate
const t0 = (c: Ctx) => {
  ground(c, SKYC); floor(c, 930, "#cfd3da"); shadow(c, 540, 936, 500, 18);
  c.save(); c.translate(0, 90); rrs(c, 110, 70, 650, 740, WALL, WALL_DK, 6, 8);
  [[260, 160, true], [560, 160, false], [260, 470, false], [560, 470, true]].forEach(([x, y], i) => {
    const xx = x as number, yy = y as number; windowBox(c, xx - 10, yy - 20, 0, 0);
  });
  const bal = (x: number, y: number, adult: boolean, wave: boolean) => {
    rr(c, x - 60, y - 220, 280, 230, "#fdf0cf", 5, 8); const px = x + 80;
    ppl(c, px, y, 330, { adult, R: wave ? [px + 150, y - 330] : undefined });
    rr(c, x - 70, y - 100, 300, 110, COL.sky, 6, 8); for (let k = 0; k < 7; k++) line(c, [[x - 55 + k * 43, y - 100], [x - 55 + k * 43, y + 10]], 4);
  };
  bal(170, 360, false, true); bal(470, 360, true, true); bal(170, 700, true, true); bal(470, 700, false, true); c.restore();
  rr(c, 310, 80, 0, 0, WHITE, 0);
  shopAwning(c, 790, 730, 270);
  ppl(c, 925, 930, 270, { adult: true, R: [1010, 760] });
};
// 1 neighbourhood: a map of a few streets
const t1 = (c: Ctx) => {
  ground(c); paper(c, 60, 60, 960, 960);
  c.fillStyle = "#d8ecb8"; c.fillRect(90, 90, 900, 900);
  for (const pts of [[[90, 330], [990, 330]], [[90, 760], [990, 760]], [[360, 90], [360, 990]], [[760, 90], [760, 990]]]) { line(c, pts, 60, ROAD_DK); line(c, pts, 48, ROAD); }
  const house = (x: number, y: number, col: string) => { rr(c, x - 55, y - 60, 110, 80, col, 6, 4); shape(c, () => polyP(c, [[x - 72, y - 60], [x, y - 125], [x + 72, y - 60]]), ROOF, 6); rr(c, x - 14, y - 30, 28, 50, COL.brown, 4, 3); };
  house(210, 250, "#f2d6a2"); house(570, 640, "#f4b6a0"); house(880, 220, "#f2d6a2");
  school(c, 880, 700, 0.5);
  shopAwning(c, 160, 450, 150);
  disc(c, 560, 450, 0, WHITE, 0); rr(c, 628, 410, 14, 120, COL.steelDk, 5, 4); rr(c, 580, 395, 110, 60, COL.blue, 6, 8); disc(c, 612, 425, 10, WHITE, 3); disc(c, 658, 425, 10, WHITE, 3);
  rr(c, 130, 840, 220, 80, COL.green, 5, 8);
  dots(c, [210, 270], [210, 340], 4, 6); dots(c, [210, 340], [360, 340], 4, 6);
  shape(c, () => { c.moveTo(210, 215); c.bezierCurveTo(165, 150, 165, 100, 210, 100); c.bezierCurveTo(255, 100, 255, 150, 210, 215); c.closePath(); }, RED, 4);
};
// 2 profession: a nurse and a tailor
const t2 = (c: Ctx) => {
  ground(c); floor(c, 900, "#e6d6b4");
  shadow(c, 270, 906, 150, 18); coat(c, 270, 900, 600); const n = ppl(c, 270, 900, 600, { adult: true, R: [350, 560] });
  cap(c, 270, 900, 600, WHITE); cross(c, 270, 1000, 0); shape(c, () => ell(c, 270, 900 - 600 * 0.7, 0, 0), WHITE, 0);
  line(c, [[225, 900 - 600 * 0.74 + 0], [220, 900 - 600 * 0.55], [270, 900 - 600 * 0.5], [320, 900 - 600 * 0.55], [315, 900 - 600 * 0.74]], 9, COL.steelDk); disc(c, 270, 900 - 600 * 0.5, 15, COL.steel, 4);
  shape(c, () => rrect(c, 340, 520, 120, 150, 10), WHITE, 6); cross(c, 400, 590, 34);
  // tailor at a sewing machine
  rr(c, 560, 700, 440, 40, COL.wood, 6, 8); rr(c, 600, 740, 20, 160, COL.brown, 5, 4); rr(c, 940, 740, 20, 160, COL.brown, 5, 4);
  ppl(c, 830, 860, 520, { adult: true, sit: true, R: [800, 680], L: [880, 680] });
  rr(c, 600, 560, 56, 130, COL.green, 6, 12); rr(c, 600, 560, 170, 50, COL.green, 6, 12); rr(c, 600, 650, 190, 50, COL.steel, 6, 8); shape(c, () => polyP(c, [[780, 690], [900, 690], [940, 730], [740, 730]]), COL.pink, 5);
};
// 3 livelihood: a woman stringing jasmine at a stall to earn her living
const t3 = (c: Ctx) => {
  ground(c, "#f8e9c8"); floor(c, 930, "#e0cfa8");
  for (let i = 0; i < 6; i++) shape(c, () => polyP(c, [[100 + i * 147, 90], [100 + (i + 1) * 147, 90], [100 + (i + 1) * 147, 220], [100 + i * 147, 220]]), i % 2 ? WHITE : COL.orange, 5);
  rr(c, 100, 90, 880, 0, WHITE, 0);
  ppl(c, 540, 800, 560, { adult: true, sit: true, L: [440, 650], R: [620, 650] });
  rr(c, 100, 690, 880, 60, COL.wood, 6, 10); rr(c, 140, 750, 800, 180, "#d39a3a", 6, 8);
  for (const [x, y, r] of [[230, 660, 80], [850, 660, 80]]) { shape(c, () => { c.moveTo(x - r, y + 30); c.quadraticCurveTo(x, y - r * 1.1, x + r, y + 30); c.closePath(); }, WHITE, 6); }
  for (let i = 0; i < 10; i++) { const x = 330 + i * 40; disc(c, x, 640 + Math.sin(i) * 6, 17, WHITE, 4); disc(c, x, 640 + Math.sin(i) * 6, 5, COL.yellow, 0); }
  disc(c, 390, 800, 0, WHITE, 0); coin(c, 780, 830, 36); coin(c, 860, 850, 30); coin(c, 700, 860, 26);
};
// 5 public service: a health centre and mothers with babies
const t5 = (c: Ctx) => {
  ground(c, SKYC); floor(c, 900, "#cfd3da"); shadow(c, 540, 905, 440, 16);
  clinic(c, 540, 780, 2.5);
  for (const [x, adult] of [[250, false], [540, true], [830, true]] as [number, boolean][]) {
    const w = ppl(c, x, 1030, 300, { adult, R: [x + 30, 1030 - 0.5 * 300], L: [x - 10, 1030 - 0.5 * 300] });
    shape(c, () => rrect(c, x - 38, 1030 - 0.6 * 300, 84, 62, 22), "#fff8e6", 5); disc(c, x - 8, 1030 - 0.6 * 300 - 8, 24, SKIN.child, 4);
  }
};
// 6 tax: a bill, a coin, and the services it pays for
const t6 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(170, 520); c.rotate(-0.06); shadow(c, 14, 400, 150, 14); rr(c, -120, -380, 240, 780, WHITE, 6, 6);
  for (let i = 0; i < 4; i++) { line(c, [[-90, -310 + i * 70], [30, -310 + i * 70]], 8, COL.grey); line(c, [[56, -310 + i * 70], [90, -310 + i * 70]], 8, COL.grey); }
  line(c, [[-90, 0], [90, 0]], 5, COL.grey); rr(c, -100, 30, 200, 76, "#ffe2a8", 5, 6); line(c, [[-80, 68], [0, 68]], 9, INK); line(c, [[40, 68], [80, 68]], 9, RED);
  write(c, "1", -60, 160, 110, INK, 12); line(c, [[-90, 330], [90, 330]], 5, COL.grey); c.restore();
  arrow(c, [[330, 540], [420, 540]]); coin(c, 520, 540, 80);
  arrow(c, [[600, 500], [740, 280]]); arrow(c, [[610, 540], [760, 540]]); arrow(c, [[600, 590], [740, 800]]);
  line(c, [[780, 250], [1010, 250]], 80, ROAD_DK); line(c, [[780, 250], [1010, 250]], 66, ROAD); for (let i = 0; i < 4; i++) line(c, [[800 + i * 55, 250], [830 + i * 55, 250]], 6, WHITE);
  school(c, 880, 640, 0.62); clinic(c, 880, 960, 0.6);
};
// 7 municipality: the garbage van and workers collecting bags
const t7 = (c: Ctx) => {
  ground(c, SKYC); floor(c, 720, "#cfd3da"); c.fillStyle = ROAD; c.fillRect(0, 800, 1080, 280); line(c, [[0, 800], [1080, 800]], 6);
  for (let x = 30; x < 1080; x += 180) rr(c, x, 940, 100, 14, WHITE, 0, 4);
  lorry(c, 650, 880, 1.15, COL.green, COL.greenDk, false);
  for (const [x, y] of [[60, 800], [150, 810], [360, 830]]) { shape(c, () => { c.moveTo(x - 50, y); c.quadraticCurveTo(x - 60, y - 90, x - 20, y - 100); c.lineTo(x + 20, y - 100); c.quadraticCurveTo(x + 60, y - 90, x + 50, y); c.closePath(); }, "#7d7870", 6); line(c, [[x - 20, y - 100], [x, y - 120], [x + 20, y - 100]], 8); }
  const w = ppl(c, 250, 1020, 400, { adult: true, R: [300, 760] }); stripes(c, 250, 1020, 400);
  shape(c, () => { c.moveTo(w.R[0] - 45, w.R[1] + 20); c.quadraticCurveTo(w.R[0] - 55, w.R[1] - 70, w.R[0] - 20, w.R[1] - 80); c.lineTo(w.R[0] + 20, w.R[1] - 80); c.quadraticCurveTo(w.R[0] + 55, w.R[1] - 70, w.R[0] + 45, w.R[1] + 20); c.closePath(); }, "#7d7870", 6);
  arrow(c, [[360, 640], [440, 600]]);
};
// 8 gram panchayat: a village meeting under a tree, a hand pump near
const t8 = (c: Ctx) => {
  ground(c, SKYC); floor(c, 700, GRASS); cloud(c, 880, 120, 0.8);
  hut(c, 130, 690, 200); hut(c, 960, 690, 180);
  tree(c, 540, 760, 1.35);
  c.save(); c.beginPath(); ell(c, 540, 920, 430, 100); c.fillStyle = "#e8c496"; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); c.restore();
  ppl(c, 330, 960, 330, { adult: true, sit: true, R: [400, 750] }); ppl(c, 540, 1000, 320, { sit: true }); ppl(c, 760, 960, 330, { adult: true, sit: true, R: [830, 740] });
  rr(c, 800, 470, 26, 220, COL.steelDk, 6, 6); rr(c, 760, 450, 130, 40, COL.steel, 6, 10); line(c, [[810, 470], [740, 530]], 14);
  line(c, [[815, 620], [875, 620]], 14, COL.steelDk); drop(c, 875, 665, 12);
};
// 9 shared resource: a roof tank with pipes to twelve flats
const t9 = (c: Ctx) => {
  ground(c, SKYC); floor(c, 970, "#cfd3da");
  const w = flatsBlock(c, 160, 300, 760, 670, 3, 4); tank(c, 540, 300, 280, 170);
  const trunk = 150;
  pipe(c, [[540, 310], [540, 360]], 20);
  w.forEach(([x, y], i) => { void i; });
  line(c, [[160 + 30, 330], [900, 330]], 0);
  for (const row of [0, 1, 2]) pipe(c, [[190, w[row * 4][1] - 100], [890, w[row * 4][1] - 100]], 10);
  pipe(c, [[540, 330], [540, w[8][1] - 100]], 14);
  w.forEach(([x, y]) => { line(c, [[x, y - 100], [x, y - 40]], 8, INK); drop(c, x, y - 10, 14); });
};
// 10 rule: a notice board in the lobby with rules as pictures
const t10 = (c: Ctx) => {
  ground(c, "#f1e6c8"); floor(c, 930, "#d9cba8");
  rr(c, 100, 120, 880, 720, COL.brown, 8, 16); rr(c, 140, 160, 800, 640, "#e8cf9a", 5, 8);
  const note = (x: number, y: number, rot: number, f: () => void) => { c.save(); c.translate(x, y); c.rotate(rot); shadow(c, 8, 150, 120, 12); rr(c, -125, -150, 250, 300, WHITE, 5, 4); disc(c, 0, -135, 12, RED, 3); f(); c.restore(); };
  note(300, 330, -0.04, () => { disc(c, 0, 0, 60, COL.green, 5); noSign(c, 0, 0, 52); });
  note(560, 340, 0.03, () => { rr(c, -50, -70, 100, 120, COL.steel, 5, 6); write(c, "6", -14, -34, 60, INK, 9); disc(c, -60, 100, 0, WHITE, 0); noSign(c, 0, 0, 0); });
  note(820, 330, -0.02, () => { line(c, [[-40, -50], [-40, 20], [30, 20]], 20, INK); line(c, [[-40, -50], [-40, 20], [30, 20]], 10, COL.steel); drop(c, 46, 56, 14); });
  note(430, 640, 0.03, () => { disc(c, 0, 0, 56, COL.red, 5); line(c, [[-30, 0], [30, 0]], 16, WHITE); });
  note(700, 640, -0.04, () => { shape(c, () => ell(c, 0, 0, 56, 40), COL.pink, 5); noSign(c, 0, 0, 56); });
  shape(c, () => rrect(c, 380, 880, 0, 0, 0), WHITE, 0);
};
// 11 cooperate: neighbours clearing the drain before the rains
const t11 = (c: Ctx) => {
  ground(c, "#b9c4d0"); cloud(c, 200, 120, 1.1); cloud(c, 700, 90, 1.2); cloud(c, 950, 170, 0.8);
  for (let i = 0; i < 8; i++) line(c, [[120 + i * 120, 220 + (i % 3) * 30], [100 + i * 120, 270 + (i % 3) * 30]], 6, COL.waterDk);
  floor(c, 600, "#cfd3da"); c.fillStyle = ROAD; c.fillRect(0, 660, 1080, 420); line(c, [[0, 660], [1080, 660]], 6);
  rr(c, 0, 600, 1080, 60, "#6b6573", 6, 0); for (let x = 30; x < 1080; x += 120) rr(c, x, 612, 80, 36, "#4a4558", 3, 4);
  for (const [x, y] of [[300, 640], [560, 630], [850, 640]]) { shape(c, () => ell(c, x, y, 60, 26), "#8a5a3c", 4); shape(c, () => ell(c, x + 30, y - 12, 30, 14), COL.orange, 4); }
  const a = ppl(c, 220, 1020, 420, { adult: true, R: [330, 880] });
  const b = ppl(c, 540, 1020, 380, { R: [640, 840], L: [560, 880] });
  const d = ppl(c, 860, 1020, 420, { adult: true, R: [780, 880] });
  for (const w of [a.R, b.R, d.R]) broom(c, w, 200);
  shape(c, () => { c.moveTo(430, 1000); c.quadraticCurveTo(410, 910, 450, 900); c.lineTo(480, 900); c.quadraticCurveTo(510, 910, 500, 1000); c.closePath(); }, COL.leaf, 6);
};
// 12 dignity of labour: a sweeper and a doctor shaking hands
const t12 = (c: Ctx) => {
  ground(c, SKYC); floor(c, 880, "#cfd3da"); shadow(c, 540, 886, 460, 18); rr(c, 0, 880, 1080, 200, ROAD, 6, 0);
  const h = 520, ay = 920;
  // sweeper left, doctor right
  coat(c, 790, ay, h);
  const dr = ppl(c, 790, ay, h, { adult: true, L: [600, 520] });
  const sw = ppl(c, 290, ay, h, { R: [500, 520], L: [260, 700] });
  stripes(c, 290, ay, h, COL.orange);
  line(c, [[225, ay - h * 0.74], [220, ay - h * 0.52], [270, ay - h * 0.47], [320, ay - h * 0.52], [315, ay - h * 0.74]], 0);
  line(c, [[750, ay - h * 0.74], [745, ay - h * 0.5], [790, ay - h * 0.44], [835, ay - h * 0.5], [830, ay - h * 0.74]], 9, COL.steelDk);
  broom(c, [250, 710], 340); disc(c, 550, 520, 28, SKIN.adult, 5);
};
// 13 emergency: a phone showing 112
const t13 = (c: Ctx) => {
  ground(c, "#f6dcd6");
  for (const r of [420, 500]) { c.beginPath(); c.arc(540, 540, r, -2.5, -0.64); c.strokeStyle = RED; c.lineWidth = 12; c.lineCap = "round"; c.globalAlpha = 0.55; c.stroke(); c.globalAlpha = 1; }
  shadow(c, 570, 1020, 230, 20); rrs(c, 300, 90, 480, 920, "#3a3540", "#22303a", 8, 60);
  rr(c, 330, 150, 420, 800, "#fff8e6", 5, 20);
  disc(c, 540, 330, 84, RED, 6); cross(c, 540, 330, 44);
  shape(c, () => rrect(c, 380, 470, 320, 200, 20), WHITE, 5);
  write(c, "112", 410, 505, 130, INK, 18);
  disc(c, 540, 820, 70, COL.green, 6);
  c.beginPath(); c.arc(540, 835, 38, Math.PI * 1.15, Math.PI * 1.85); c.strokeStyle = WHITE; c.lineWidth = 16; c.lineCap = "round"; c.stroke();
  for (const [x, y, rot] of [[150, 220, -0.4], [930, 230, 0.4]]) { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -50, -30, 100, 70, 30), RED, 6); disc(c, 0, -34, 24, COL.yellow, 5); c.restore(); }
};
// ---------------------------------------------------------------- explanations
// x1: why we depend on each other: idli in the middle, the work that brings it
const x1 = (c: Ctx) => {
  ground(c); shadow(c, 560, 700, 300, 50); shape(c, () => ell(c, 540, 580, 290, 160), COL.steel, 6); shape(c, () => ell(c, 540, 574, 245, 130), COL.steelIn, 4);
  for (const [x, y] of [[440, 560], [560, 540], [650, 580], [490, 620], [600, 630]]) { shape(c, () => ell(c, x, y, 62, 38), WHITE, 5); shade(c, () => ell(c, x, y, 62, 38), "#e7e0cc", -10, -8, 0.7); }
  shape(c, () => { c.moveTo(60, 330); c.quadraticCurveTo(0, 190, 60, 90); c.lineTo(250, 90); c.quadraticCurveTo(310, 190, 250, 330); c.closePath(); }, "#e7d3a0", 6);
  for (let i = 0; i < 6; i++) seed(c, 105 + (i % 3) * 55, 160 + Math.floor(i / 3) * 60, 20, i, false, "#fffaf0", "#e0d8c0");
  arrow(c, [[250, 360], [360, 460]]);
  lorry(c, 790, 330, 0.8, COL.orange, "#d27c25", false); arrow(c, [[780, 360], [700, 450]]);
  gasCylinder(c, 150, 1000, 2); arrow(c, [[260, 800], [370, 720]]);
  line(c, [[800, 960], [800, 850], [930, 850], [930, 900]], 36, INK); line(c, [[800, 960], [800, 850], [930, 850], [930, 900]], 22, COL.steel); drop(c, 930, 960, 28); arrow(c, [[820, 800], [730, 710]]);
  shopAwning(c, 440, 820, 200); arrow(c, [[540, 800], [540, 740]]);
};
// x3: public services around a coin
const x3 = (c: Ctx) => {
  ground(c); coin(c, 540, 540, 145);
  school(c, 540, 340, 0.6); clinic(c, 850, 470, 0.62); postbox(c, 850, 920, 0.85);
  lorry(c, 540, 1010, 0.6, COL.green, COL.greenDk, false); lorry(c, 220, 480, 0.6, RED, "#a82d22", false);
  line(c, [[130, 840], [130, 760], [250, 760], [250, 810]], 44, INK); line(c, [[130, 840], [130, 760], [250, 760], [250, 810]], 28, COL.steel); rr(c, 100, 830, 60, 20, COL.steelDk, 5, 4); drop(c, 250, 880, 30);
};
// x6: two ponds: one dry and cracked, one full where people agreed a rule
const x6 = (c: Ctx) => {
  ground(c, SKYC); c.fillStyle = "#e8d6a8"; c.fillRect(0, 440, 540, 640); c.fillStyle = "#b9e0c0"; c.fillRect(540, 440, 540, 640); line(c, [[0, 440], [1080, 440]], 6); line(c, [[540, 440], [540, 1080]], 8);
  shape(c, () => ell(c, 270, 840, 245, 120), "#cdb88a", 6);
  line(c, [[110, 810], [190, 850], [230, 800], [320, 860]], 7); line(c, [[350, 800], [400, 850], [450, 810]], 7); line(c, [[190, 900], [270, 930], [330, 890]], 7);
  shape(c, () => ell(c, 810, 840, 245, 120), COL.water, 6); line(c, [[690, 830], [770, 830]], 7, WHITE); line(c, [[840, 870], [930, 870]], 7, WHITE);
  ppl(c, 120, 700, 400, { adult: true, R: [230, 380], L: [60, 400] }); ppl(c, 420, 700, 380, { R: [480, 380], L: [350, 400] });
  rr(c, 690, 100, 280, 190, WHITE, 6, 8); for (let i = 0; i < 3; i++) { disc(c, 735, 150 + i * 55, 10, COL.greenDk, 0); line(c, [[770, 150 + i * 55], [930, 150 + i * 55]], 9, COL.grey); } line(c, [[830, 290], [830, 440]], 14, COL.brown);
  ppl(c, 690, 700, 380, { sit: true, adult: true }); ppl(c, 1000, 700, 360, { sit: true });
  cloud(c, 270, 150, 0.9);
};
// x7: the old water keeper opens the sluice gate; farmers wait in turn
const x7 = (c: Ctx) => {
  ground(c, SKYC); cloud(c, 850, 110, 1); c.fillStyle = GRASS; c.fillRect(0, 700, 1080, 380); line(c, [[0, 700], [1080, 700]], 6);
  shape(c, () => ell(c, 250, 560, 330, 170), COL.water, 6); for (let i = 0; i < 3; i++) line(c, [[90 + i * 140, 560 + (i % 2) * 40], [150 + i * 140, 560 + (i % 2) * 40]], 7, WHITE);
  rrs(c, 540, 400, 220, 340, "#a8a18f", "#8c866f", 7, 10); rr(c, 600, 500, 100, 240, "#3a3540", 5, 4); rr(c, 610, 430, 80, 160, COL.brown, 6, 4); line(c, [[630, 430], [630, 350]], 10); line(c, [[670, 430], [670, 350]], 10); rr(c, 610, 330, 80, 30, COL.wood, 6, 6);
  shape(c, () => polyP(c, [[600, 740], [700, 740], [700, 790], [960, 790], [960, 880], [600, 880]]), COL.water, 6);
  arrow(c, [[900, 835], [700, 835]]);
  ppl(c, 880, 700, 400, { adult: true, L: [720, 380] });
  [150, 380, 610].forEach((x, i) => { ppl(c, x, 1060, 270, { adult: i === 1 }); });
};

export const ic_communityCommunityAndHelpersL3 = cards("sci.community.community-and-helpers.L3 cards", [
  intro, summary, e1, e2, a1, a2, a3, a4, a5, a6, c1, c2,
  t0, t1, t2, t3, t5, t6, t7, t8, t9, t10, t11, t12, t13, x1, x3, x6, x7,
]);
// slot order: intro summary flow.e1 flow.e2 flow.a1 flow.a2 flow.a3 flow.a4 flow.a5 flow.a6 flow.c1 flow.c2
//   term.0 term.1 term.2 term.3 term.5 term.6 term.7 term.8 term.9 term.10 term.11 term.12 term.13 expl.1 expl.3 expl.6 expl.7
