import type { Ctx } from "./core";
import { INK, WHITE, COL, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, glass, leaf, write, cards } from "./flatKit";

// sci.states.evaporation-and-condensation.L3 · picture cards (intro, cover, activities, terms, explanations).
// Water particles are blue dots; a red arrow is movement. Same cloth, clear box, steel bottle across the set.

const PD = "#5b8fd6", PL = "#bfe0f5", PINK = "#e57f93", PINKDK = "#c75d75", PINKLT = "#f6b8c4";
const CLEAR = "rgba(214,236,250,0.5)", NONE = "rgba(0,0,0,0)";

const dot = (c: Ctx, x: number, y: number, r = 14, col = PD) => shape(c, () => ell(c, x, y, r, r), col, Math.max(3, r * 0.24));
const dropP = (c: Ctx, x: number, y: number, s: number, col: string = COL.drop) => shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 1.1, y - s * 0.2, x + s * 0.8, y + s * 0.4); c.arc(x, y + s * 0.3, s * 0.8, 0, Math.PI); c.quadraticCurveTo(x - s * 1.1, y - s * 0.2, x, y - s * 1.5); c.closePath(); }, col, Math.max(2.5, s * 0.2));
const panel = (c: Ctx, x: number, y: number, w: number, h: number, fill: string) => shape(c, () => rrect(c, x, y, w, h, 28), fill, 6);
const floor = (c: Ctx, y: number, col = "#e6cf9f") => { c.fillStyle = col; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 5); };
// a wavy red arrow from (x1,y1) to (x2,y2): movement of vapour
const wavy = (c: Ctx, x1: number, y1: number, x2: number, y2: number, amp = 14, col = RED, w = 10) => {
  const pts: number[][] = [], dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  for (let i = 0; i <= 20; i++) { const t = i / 20, o = Math.sin(t * Math.PI * 3) * amp * (1 - t); pts.push([x1 + dx * t + nx * o, y1 + dy * t + ny * o]); }
  arrow(c, pts, col, w);
};
const cloud = (c: Ctx, x: number, y: number, s: number, col = "#c9d1dc") => {
  const parts: number[][] = [[-60, 10, 50], [0, -20, 65], [62, 8, 52], [0, 22, 50]];
  for (const w of [14, 0]) for (const [dx, dy, r] of parts) { c.beginPath(); c.arc(x + dx * s, y + dy * s, r * s, 0, 7); if (w) { c.lineWidth = w; c.strokeStyle = INK; c.stroke(); } else { c.fillStyle = col; c.fill(); } }
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 9); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
// the pink check cloth, hanging flat: top-left corner (x, y)
const cloth = (c: Ctx, x: number, y: number, w: number, h: number, wet = true) => {
  const p = () => rrect(c, x, y, w, h, 10);
  shape(c, p, wet ? PINK : PINKLT);
  if (wet) shade(c, p, PINKDK, w * 0.12, 0, 0.6);
  c.save(); c.beginPath(); p(); c.clip();
  for (let u = 1; u < 4; u++) line(c, [[x + (w * u) / 4, y], [x + (w * u) / 4, y + h]], Math.max(3, w * 0.02), wet ? PINKLT : PINK);
  for (let v = 1; v < 3; v++) line(c, [[x, y + (h * v) / 3], [x + w, y + (h * v) / 3]], Math.max(3, w * 0.02), wet ? PINKLT : PINK);
  c.restore();
  shape(c, p, NONE, 6);
};
// a school shirt hung from a line at (cx, top); wet = dark and dripping
const shirt = (c: Ctx, cx: number, top: number, s: number, wet: boolean) => {
  const P = [[-50, 0], [-20, 14], [20, 14], [50, 0], [112, 44], [86, 90], [56, 68], [56, 180], [-56, 180], [-56, 68], [-86, 90], [-112, 44]].map(([a, b]) => [cx + a * s, top + b * s]);
  shape(c, () => polyP(c, P), wet ? "#8aa3c4" : WHITE, 6);
  shade(c, () => polyP(c, P), wet ? "#6a82a6" : "#dfe5ec", 22 * s, 0, 0.7);
  shape(c, () => polyP(c, [[cx - 20 * s, top + 14 * s], [cx, top + 52 * s], [cx + 20 * s, top + 14 * s], [cx + 36 * s, top + 4 * s], [cx, top + 30 * s], [cx - 36 * s, top + 4 * s]]), wet ? "#a9bddb" : "#f4f1e4", 4);
  for (const k of [-1, 1]) shape(c, () => rrect(c, cx + k * 44 * s - 9 * s, top - 24 * s, 18 * s, 34 * s, 4), COL.orange, 4);
  if (wet) { dropP(c, cx - 30 * s, top + 205 * s, 11 * s, "#cfe4f8"); dropP(c, cx + 24 * s, top + 222 * s, 9 * s, "#cfe4f8"); }
};
const rope = (c: Ctx, x1: number, x2: number, y: number) => line(c, [[x1, y], [x2, y]], 8, COL.brown);
// a clear box: x centre, yb bottom, width/height; lid = teal lid on
const clearBox = (c: Ctx, x: number, yb: number, w: number, h: number, lid: boolean) => {
  shadow(c, x + 24, yb + 8, w * 0.6, 22);
  shape(c, () => polyP(c, [[x - w / 2, yb - h], [x + w / 2, yb - h], [x + w * 0.46, yb], [x - w * 0.46, yb]]), CLEAR, 6);
  if (!lid) shape(c, () => ell(c, x, yb - h, w / 2, 18), "rgba(255,255,255,0.3)", 5);
};
const boxLid = (c: Ctx, x: number, top: number, w: number) => { shape(c, () => rrect(c, x - w / 2 - 12, top - 28, w + 24, 32, 10), COL.teal, 6); shade(c, () => rrect(c, x - w / 2 - 12, top - 28, w + 24, 32, 10), COL.tealDk, 0, 14, 0.7); };
// a steel bottle standing on y; misty = tiny drops over it
const bottleS = (c: Ctx, x: number, y: number, w: number, h: number, drops = 0, seedN = 3) => {
  shadow(c, x + w * 0.15, y + 6, w * 0.65, w * 0.1);
  const body = () => { c.moveTo(x - w / 2, y); c.lineTo(x - w / 2, y - h * 0.62); c.quadraticCurveTo(x - w / 2, y - h * 0.8, x - w * 0.18, y - h * 0.86); c.lineTo(x - w * 0.18, y - h); c.lineTo(x + w * 0.18, y - h); c.lineTo(x + w * 0.18, y - h * 0.86); c.quadraticCurveTo(x + w / 2, y - h * 0.8, x + w / 2, y - h * 0.62); c.lineTo(x + w / 2, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.3, 0, 0.7);
  if (drops) { const r = rnd(seedN); c.save(); c.beginPath(); body(); c.clip(); for (let i = 0; i < drops; i++) dropP(c, x - w * 0.4 + r() * w * 0.8, y - h * 0.08 - r() * h * 0.7, 6 + r() * 6); c.restore(); shape(c, body, NONE, 6); }
  else shine(c, [[x - w * 0.3, y - h * 0.6], [x - w * 0.3, y - h * 0.12]], 10);
  shape(c, () => rrect(c, x - w * 0.22, y - h - 24, w * 0.44, 30, 8), COL.teal, 5);
};
// steel pan seen from the side, centre x, base y
const pan = (c: Ctx, x: number, yb: number, w: number, h: number) => {
  shadow(c, x + 20, yb + 6, w * 0.6, 18);
  shape(c, () => rrect(c, x + w / 2 - 6, yb - h * 0.78, w * 0.38, h * 0.16, 8), COL.black, 5);
  shape(c, () => polyP(c, [[x - w / 2, yb - h], [x + w / 2, yb - h], [x + w * 0.46, yb], [x - w * 0.46, yb]]), COL.steel);
};
const tumblerS = (c: Ctx, x: number, yb: number, w: number, h: number, drops: number, seedN: number) => {
  shadow(c, x + w * 0.1, yb + 5, w * 0.6, w * 0.09);
  const body = () => polyP(c, [[x - w / 2, yb - h], [x + w / 2, yb - h], [x + w * 0.38, yb], [x - w * 0.38, yb]]);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.3, 0, 0.7);
  if (drops) { const r = rnd(seedN); c.save(); c.beginPath(); body(); c.clip(); for (let i = 0; i < drops; i++) dropP(c, x - w * 0.38 + r() * w * 0.76, yb - h * 0.9 + r() * h * 0.8, 5 + r() * 4); c.restore(); shape(c, body, NONE, 6); }
  else shine(c, [[x - w * 0.32, yb - h * 0.85], [x - w * 0.27, yb - h * 0.15]], 9);
  shape(c, () => ell(c, x, yb - h, w / 2, w * 0.1), COL.steelIn, 6);
};
const mirror = (c: Ctx, x: number, y: number, r: number, mistFrac: number, seedN = 5) => {
  shape(c, () => ell(c, x, y, r + 22, r + 22), COL.steelDk, 6);
  shape(c, () => ell(c, x, y, r, r), "#e8f3fa", 5);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip();
  c.fillStyle = "#c9d6de"; c.fillRect(x - r, y - r, r * 2 * mistFrac, r * 2);
  const rd = rnd(seedN); for (let i = 0; i < 30; i++) { const px = x - r + rd() * r * 2 * mistFrac, py = y - r + rd() * r * 2; c.beginPath(); c.arc(px, py, 4 + rd() * 5, 0, 7); c.fillStyle = WHITE; c.fill(); }
  c.restore();
  if (mistFrac < 1) shine(c, [[x + r * 0.2, y - r * 0.6], [x + r * 0.55, y - r * 0.1]], 12);
  shape(c, () => ell(c, x, y, r, r), NONE, 5);
};

// ---------------------------------------------------------------- 0 intro: same cloth, rainy day and sunny day
const intro = (c: Ctx) => {
  ground(c);
  panel(c, 30, 130, 495, 820, "#aebfce");
  panel(c, 555, 130, 495, 820, "#fbe7a1");
  cloud(c, 280, 250, 1.3, "#9aa6b4");
  for (const [x, y] of [[170, 360], [250, 380], [330, 350], [410, 385], [120, 430]]) line(c, [[x, y], [x - 14, y + 34]], 8, PD);
  sun(c, 840, 270, 70);
  rope(c, 50, 505, 520); rope(c, 575, 1030, 520);
  shirt(c, 280, 495, 1.35, true);
  shirt(c, 805, 495, 1.35, false);
  for (const x of [640, 960]) wavy(c, x, 800, x + 20, 640, 8, RED, 8);
};
// ---------------------------------------------------------------- 1 cover: puddle goes up, bottle gets drops
const summary = (c: Ctx) => {
  ground(c);
  floor(c, 800);
  sun(c, 160, 170, 70);
  shape(c, () => ell(c, 320, 880, 190, 38), "#8fc3ea", 6);
  shine(c, [[230, 872], [300, 862]], 9);
  for (const x of [250, 330, 410]) wavy(c, x, 820, x + 10, 470, 16, RED, 10);
  bottleS(c, 790, 860, 220, 400, 40, 4);
  for (const [x, y, tx, ty] of [[610, 330, 670, 440], [950, 330, 900, 440], [620, 640, 665, 660]]) { arrow(c, [[x, y], [tx, ty]]); dot(c, x - (tx - x) * 0.25, y - (ty - y) * 0.25, 12); }
  dot(c, 930, 600, 12); arrow(c, [[955, 590], [910, 620]]);
};
// ---------------------------------------------------------------- e1 closed box test
const e1 = (c: Ctx) => {
  ground(c); floor(c, 760);
  const bw = 360, bh = 400, yb = 860;
  for (const [x, lid] of [[290, true], [790, false]] as [number, boolean][]) {
    clearBox(c, x, yb, bw, bh, lid);
    cloth(c, x - 120, yb - 100, 240, 80, true);
    if (lid) {
      for (const dx of [-90, 0, 90]) wavy(c, x + dx, yb - 130, x + dx, yb - 280, 12, RED, 9);
      for (const dx of [-120, -50, 30, 100]) dropP(c, x + dx, yb - bh + 28, 14);
      boxLid(c, x, yb - bh, bw);
    } else for (const dx of [-90, 0, 90]) wavy(c, x + dx, yb - 130, x + dx, yb - 480, 16, RED, 9);
  }
};
// ---------------------------------------------------------------- e2 four tumblers, more drops = damper air
const e2 = (c: Ctx) => {
  ground(c); floor(c, 760);
  [0, 6, 16, 34].forEach((n, i) => tumblerS(c, 170 + i * 250, 800, 190, 300, n, 10 + i));
  arrow(c, [[120, 930], [960, 930]]);
};
// ---------------------------------------------------------------- a1 under the lid
const a1 = (c: Ctx) => {
  ground(c); floor(c, 800);
  pan(c, 420, 850, 400, 300);
  shape(c, () => ell(c, 420, 560, 190, 26), "#f7f3e8", 5);
  for (const dx of [-80, 20, 110]) wavy(c, 420 + dx, 520, 420 + dx, 380, 10, RED, 9);
  // the lid, tilted up, its underside toward us
  c.save(); c.translate(760, 330); c.rotate(-0.5);
  shape(c, () => ell(c, 0, 0, 200, 100), COL.steel, 6);
  shape(c, () => ell(c, 0, 0, 170, 78), COL.steelIn, 4);
  for (const [dx, dy] of [[-90, -20], [-30, 20], [30, -25], [80, 10], [-60, 40], [0, -5], [110, -30]]) dropP(c, dx, dy, 13);
  c.restore();
  arrow(c, [[640, 600], [640, 470]]);
};
// ---------------------------------------------------------------- a2 bottle: clean, misty, clean
const a2 = (c: Ctx) => {
  ground(c); floor(c, 860);
  bottleS(c, 170, 880, 190, 500, 0);
  bottleS(c, 540, 880, 190, 500, 70, 8);
  bottleS(c, 910, 880, 190, 500, 0);
  arrow(c, [[285, 560], [410, 560]]); arrow(c, [[655, 560], [780, 560]]);
  for (const x of [850, 910, 970]) wavy(c, x, 330, x, 190, 8, RED, 7);
};
// ---------------------------------------------------------------- a3 leave and land
const a3 = (c: Ctx) => {
  ground(c);
  panel(c, 30, 60, 1020, 440, "#fffaf0");
  panel(c, 30, 580, 1020, 440, "#fffaf0");
  // open space: many leave, few land
  cloth(c, 420, 340, 240, 120, true);
  for (const [x, y, a] of [[430, 300, -2.4], [540, 280, -1.57], [650, 300, -0.7], [380, 380, 3.14], [700, 400, 0]] as number[][]) { const dx = Math.cos(a) * 130, dy = Math.sin(a) * 130; arrow(c, [[x, y], [x + dx, y + dy]]); dot(c, x, y, 13); }
  dot(c, 540, 160, 13); arrow(c, [[540, 160], [540, 235]]);
  // closed room: as many land as leave
  panel(c, 120, 630, 840, 340, "#dcecf7");
  cloth(c, 420, 900, 240, 60, true);
  for (const x of [450, 540, 630]) { arrow(c, [[x - 20, 880], [x - 20, 790]]); dot(c, x - 20, 880, 13); arrow(c, [[x + 20, 720], [x + 20, 810]]); dot(c, x + 20, 720, 13); }
};
// ---------------------------------------------------------------- a4 AC pipe
const a4 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 100, 90, 800, 240, 30), WHITE, 6);
  shade(c, () => rrect(c, 100, 90, 800, 240, 30), "#dfe5ec", 0, 28, 0.7);
  for (let k = 0; k < 4; k++) line(c, [[170, 230 + k * 22], [830, 230 + k * 22]], 6, COL.steelDk);
  shape(c, () => ell(c, 800, 150, 14, 14), COL.teal, 4);
  for (const x of [250, 450, 650]) wavy(c, x, 350, x + 30, 500, 10, PD, 8);
  line(c, [[880, 250], [960, 250], [960, 700]], 26, INK); line(c, [[880, 250], [960, 250], [960, 700]], 14, COL.steelIn);
  dropP(c, 960, 760, 15);
  arrow(c, [[960, 800], [960, 850]]);
  glass(c, 840, 1000, 220, 250, 0.45);
};
// ---------------------------------------------------------------- a5 grandparent tells how clothes dried in the monsoon
const a5 = (c: Ctx) => {
  ground(c); floor(c, 900);
  person(c, 200, 930, 540, { adult: true, armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [Math.PI * 0.2, -0.3] });
  person(c, 480, 930, 400, {});
  shape(c, () => { c.moveTo(380, 180); c.bezierCurveTo(380, 30, 1040, 30, 1040, 260); c.bezierCurveTo(1040, 480, 380, 480, 380, 310); c.closePath(); }, WHITE, 6);
  shape(c, () => polyP(c, [[410, 420], [270, 480], [500, 440]]), WHITE, 6);
  
  shape(c, () => rrect(c, 470, 150, 480, 24, 6), COL.brown, 5);
  rope(c, 480, 940, 215);
  shirt(c, 600, 205, 0.7, true); shirt(c, 820, 205, 0.7, true);
  for (const [x, y] of [[440, 90], [980, 100]]) line(c, [[x, y], [x - 10, y + 30]], 7, PD);
};
// ---------------------------------------------------------------- a6 home hunt: four finds
const a6 = (c: Ctx) => {
  ground(c);
  const T: [number, number, string][] = [[30, 30, "#fbe7a1"], [550, 30, "#cfe4f8"], [30, 550, "#cfe4f8"], [550, 550, "#fbe7a1"]];
  T.forEach(([x, y, f]) => panel(c, x, y, 500, 500, f));
  // wet cloth drying
  rope(c, 60, 490, 150); shirt(c, 275, 140, 0.9, true);
  for (const x of [120, 430]) wavy(c, x, 320, x, 200, 8, RED, 7);
  // cold bottle with drops, vapour arriving
  bottleS(c, 800, 480, 130, 300, 24, 6); arrow(c, [[640, 250], [715, 330]]); arrow(c, [[960, 250], [895, 330]]);
  // misted mirror
  mirror(c, 280, 800, 140, 1, 9);
  // puddle drying
  shape(c, () => ell(c, 800, 920, 180, 36), "#8fc3ea", 6);
  for (const x of [740, 820, 890]) wavy(c, x, 880, x, 700, 12, RED, 8);
};
// ---------------------------------------------------------------- p1 drying diary: handkerchief and a line graph
const p1 = (c: Ctx) => {
  ground(c);
  rope(c, 40, 460, 120);
  cloth(c, 130, 120, 220, 220, true);
  for (const x of [170, 310]) shape(c, () => rrect(c, x - 11, 100, 22, 40, 4), COL.orange, 4);
  dropP(c, 240, 380, 12, "#cfe4f8");
  sun(c, 330, 520, 50);
  shape(c, () => rrect(c, 470, 90, 560, 880, 24), COL.paper, 6);
  line(c, [[540, 200], [540, 820], [980, 820]], 8);
  const pts: number[][] = [[600, 300], [680, 460], [760, 360], [830, 640], [900, 700], [960, 560]];
  line(c, pts, 8, RED); pts.forEach(([x, y]) => dot(c, x, y, 12, RED));
  [1, 2, 3, 4, 5, 6, 7].forEach((n, i) => write(c, String(n), 570 + i * 60 - 12, 850, 36, INK, 5));
};
// ---------------------------------------------------------------- c1 dry the towel in two hours: spread out, fan, window
const fan = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => rrect(c, x - 18, y + r * 0.6, 36, r * 1.2, 8), COL.teal, 5);
  shape(c, () => rrect(c, x - r * 0.7, y + r * 1.75, r * 1.4, 28, 8), COL.tealDk, 5);
  shape(c, () => ell(c, x, y, r, r), CLEAR, 6);
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.5; shape(c, () => { c.save(); c.translate(x, y); c.rotate(a); ell(c, r * 0.45, 0, r * 0.4, r * 0.18); c.restore(); }, COL.teal, 4); }
  shape(c, () => ell(c, x, y, 18, 18), COL.black, 4);
};
const c1 = (c: Ctx) => {
  ground(c); floor(c, 880);
  shape(c, () => rrect(c, 640, 80, 340, 330, 14), "#cfe4f8", 6);
  line(c, [[810, 80], [810, 410]], 6); line(c, [[640, 245], [980, 245]], 6);
  for (const [x, y] of [[700, 140], [880, 170], [740, 310], [920, 330]]) line(c, [[x, y], [x - 12, y + 30]], 7, PD);
  rope(c, 100, 620, 280);
  cloth(c, 130, 270, 460, 330, true);
  for (const x of [170, 540]) shape(c, () => rrect(c, x - 11, 250, 22, 40, 4), COL.orange, 4);
  fan(c, 220, 760, 110);
  arrow(c, [[350, 740], [480, 700]]); arrow(c, [[350, 800], [480, 800]]);
  for (const x of [250, 400, 540]) wavy(c, x, 250, x, 140, 8, RED, 7);
};
// ---------------------------------------------------------------- c2 keep the mirror clear: half misted, breath
const c2 = (c: Ctx) => {
  ground(c);
  mirror(c, 640, 480, 290, 0.5, 12);
  cloud(c, 140, 640, 1.0, WHITE);
  arrow(c, [[250, 600], [300, 560], [330, 520]]);
};
// ---------------------------------------------------------------- terms
const tEvap = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[40, 640], [1040, 640], [1040, 1040], [40, 1040]]), "#e6cf9f", 6);
  for (let k = 1; k < 5; k++) line(c, [[40 + k * 200, 640], [40 + k * 200, 1040]], 4, "#c9b07d");
  line(c, [[40, 840], [1040, 840]], 4, "#c9b07d");
  for (const [x, y, w] of [[260, 760, 150], [620, 900, 190], [880, 740, 130]]) { shape(c, () => ell(c, x, y, w, w * 0.2), "#8fc3ea", 5); shine(c, [[x - w * 0.5, y - 6], [x - w * 0.2, y - 10]], 8); wavy(c, x, y - 40, x + 10, y - 330, 14, RED, 9); }
};
const tVapour = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 80, 960, 700, 20), "#dcecf7", 6);
  shape(c, () => polyP(c, [[60, 780], [1020, 780], [1060, 960], [20, 960]]), "#e6cf9f", 6);
  shape(c, () => rrect(c, 700, 150, 240, 280, 10), "#fff7d6", 6);
  line(c, [[820, 150], [820, 430]], 6); line(c, [[700, 290], [940, 290]], 6);
  for (const [x, y] of [[180, 220], [420, 380], [330, 560], [580, 250], [560, 600], [240, 440], [800, 600], [460, 150]]) dot(c, x, y, 17);
};
const tGas = (c: Ctx) => {
  ground(c);
  const jar = () => rrect(c, 260, 220, 560, 700, 70);
  shadow(c, 560, 940, 300, 28);
  shape(c, jar, CLEAR, 6);
  shape(c, () => rrect(c, 290, 130, 500, 96, 16), COL.teal, 6);
  shine(c, [[300, 340], [300, 780]], 12);
  for (const [x, y, a] of [[400, 340, -2.4], [650, 330, -0.6], [520, 500, 1.4], [380, 700, 2.5], [690, 690, 0.5], [560, 360, -1.6]] as number[][]) { dot(c, x, y, 20); arrow(c, [[x + Math.cos(a) * 30, y + Math.sin(a) * 30], [x + Math.cos(a) * 110, y + Math.sin(a) * 110]], RED, 9); }
};
const tParticle = (c: Ctx) => {
  ground(c);
  dropP(c, 250, 700, 100);
  line(c, [[330, 620], [600, 280]], 6); line(c, [[320, 790], [600, 800]], 6);
  shape(c, () => ell(c, 720, 540, 290, 290), "#dcecf7", 8);
  c.save(); c.beginPath(); ell(c, 720, 540, 282, 282); c.clip();
  for (let row = 0; row < 9; row++) for (let i = 0; i < 9; i++) dot(c, 520 + i * 52 + (row % 2) * 26, 340 + row * 46, 21);
  c.restore();
  shape(c, () => ell(c, 720, 540, 290, 290), NONE, 12);
};
const tHumid = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 990, 280, 24);
  shape(c, () => rrect(c, 290, 70, 500, 920, 60), COL.black, 8);
  shape(c, () => rrect(c, 320, 120, 440, 820, 30), "#9ccbef", 5);
  cloud(c, 540, 330, 1.5, "#c9d1dc");
  for (const [x, y] of [[420, 470], [520, 490], [620, 460], [690, 500]]) line(c, [[x, y], [x - 12, y + 40]], 9, PD);
  write(c, "90", 380, 650, 150, WHITE, 18);
  dropP(c, 630, 680, 40, WHITE);
};
const tSaturated = (c: Ctx) => {
  ground(c);
  const x = 540, yb = 900, w = 700, h = 640;
  clearBox(c, x, yb, w, h, true);
  cloth(c, x - 230, yb - 150, 460, 130, true);
  boxLid(c, x, yb - h, w);
  for (const dx of [-170, 0, 170]) { arrow(c, [[x + dx - 25, yb - 190], [x + dx - 25, yb - 400]]); arrow(c, [[x + dx + 25, yb - 400], [x + dx + 25, yb - 190]]); }
};
const tBoil = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 120, 880, 840, 110, 20), COL.black, 6);
  for (let k = 0; k < 5; k++) shape(c, () => { c.moveTo(230 + k * 150, 880); c.quadraticCurveTo(205 + k * 150, 800, 230 + k * 150, 750); c.quadraticCurveTo(285 + k * 150, 800, 230 + k * 150, 880); c.closePath(); }, k % 2 ? COL.orange : COL.red, 5);
  pan(c, 540, 750, 640, 420);
  const fillW = () => polyP(c, [[240, 500], [840, 500], [820, 750], [260, 750]]);
  shape(c, () => polyP(c, [[240, 500], [840, 500], [820, 750], [260, 750]]), COL.water, 0);
  shape(c, fillW, NONE, 6);
  shape(c, () => polyP(c, [[240, 500], [840, 500], [840, 520], [240, 520]]), COL.drop, 0);
  for (const [x, y, r] of [[330, 680, 20], [420, 590, 30], [520, 690, 24], [610, 600, 36], [700, 700, 22], [770, 580, 28], [470, 530, 18]]) shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.7)", 5);
  arrow(c, [[540, 470], [540, 290]]);
};
const tFair = (c: Ctx) => {
  ground(c); floor(c, 760);
  const bw = 300, bh = 340, yb = 860;
  clearBox(c, 260, yb, bw, bh, true); cloth(c, 140, yb - 90, 240, 70, true); boxLid(c, 260, yb - bh, bw);
  clearBox(c, 700, yb, bw, bh, false); cloth(c, 580, yb - 90, 240, 70, true);
  shape(c, () => polyP(c, [[860, 750], [1040, 750], [1060, 790], [840, 790]]), COL.teal, 6);
  shape(c, () => polyP(c, [[840, 790], [1060, 790], [1060, 818], [840, 818]]), COL.tealDk, 6);
};
// ---------------------------------------------------------------- explanations
const eEvap = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 140, 1000, 380, 20), "#eef6fb", 6);
  shape(c, () => rrect(c, 40, 520, 1000, 480, 20), COL.water, 6);
  shape(c, () => polyP(c, [[40, 520], [1040, 520], [1040, 545], [40, 545]]), COL.drop, 0);
  const r = rnd(3);
  for (let row = 0; row < 7; row++) for (let i = 0; i < 12; i++) if (row > 0 || i % 3 !== 1) dot(c, 100 + i * 78 + (row % 2) * 38, 600 + row * 62, 24);
  for (const x of [250, 560, 870]) { dot(c, x, 380, 24); arrow(c, [[x, 330], [x, 190]]); }
  void r;
};
const eWhere = (c: Ctx) => {
  ground(c);
  panel(c, 30, 120, 480, 820, "#eef6fb"); panel(c, 570, 120, 480, 820, "#eef6fb");
  shape(c, () => ell(c, 270, 800, 190, 50), "#8fc3ea", 6);
  for (const [x, y] of [[170, 800], [240, 780], [320, 810], [380, 790], [210, 825], [290, 825]]) dot(c, x, y, 17);
  for (const [x, y] of [[660, 300], [760, 480], [900, 330], [700, 640], [860, 700], [960, 520]]) dot(c, x, y, 17);
  arrow(c, [[400, 520], [540, 520]]);
};
const eCond = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 640, 60, 360, 960, 24), "#cfe4f8", 6);
  shape(c, () => polyP(c, [[640, 60], [700, 60], [700, 1020], [640, 1020]]), "#a8d4ea", 0);
  shape(c, () => rrect(c, 640, 60, 360, 960, 24), NONE, 6);
  for (const y of [180, 300, 560, 700, 880]) dropP(c, 630, y, 16);
  dropP(c, 622, 460, 30); line(c, [[624, 500], [624, 600]], 10, COL.drop);
  for (const [x, y] of [[170, 220], [340, 470], [200, 640], [400, 840], [140, 900]]) { dot(c, x, y, 20); arrow(c, [[x + 35, y], [x + 140, y + (640 - x) * 0.0]], RED, 9); }
};
const eLeaveLand = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 720, 1000, 300, 20), PINK, 6);
  shape(c, () => rrect(c, 40, 720, 1000, 50, 14), "#8fb3dc", 6);
  panel(c, 40, 80, 1000, 600, "#eef6fb");
  dot(c, 300, 330, 24); arrow(c, [[300, 240], [300, 130]]);
  dot(c, 560, 130, 24); arrow(c, [[560, 200], [560, 290]]);
  dot(c, 780, 330, 24); arrow(c, [[780, 240], [780, 130]]);
  dot(c, 920, 130, 24); arrow(c, [[920, 200], [920, 290]]);
  dot(c, 430, 530, 24); arrow(c, [[430, 440], [430, 330]]);
  dot(c, 660, 380, 24); arrow(c, [[660, 450], [660, 530]]);
  for (let i = 0; i < 9; i++) dot(c, 110 + i * 110, 745, 22);
};
const eFaster = (c: Ctx) => {
  ground(c);
  const T: [number, number][] = [[30, 30], [550, 30], [30, 550], [550, 550]];
  T.forEach(([x, y], i) => panel(c, x, y, 500, 500, i === 0 ? "#fbe7a1" : i === 1 ? "#eef6fb" : i === 2 ? "#eef6fb" : "#fffaf0"));
  sun(c, 150, 130, 50); cloth(c, 200, 220, 220, 140, true); wavy(c, 260, 215, 260, 120, 8); wavy(c, 360, 215, 360, 120, 8);
  fan(c, 660, 250, 80); cloth(c, 800, 200, 190, 140, true); arrow(c, [[740, 270], [790, 270]]); arrow(c, [[740, 320], [790, 320]]);
  shape(c, () => rrect(c, 80, 880, 140, 90, 10), PINK, 5); arrow(c, [[250, 880], [320, 800]], RED, 9); cloth(c, 330, 680, 160, 130, true);
  cloth(c, 600, 740, 380, 180, true); wavy(c, 700, 730, 700, 620, 8); wavy(c, 880, 730, 880, 620, 8); dot(c, 800, 590, 14);
};
const eDew = (c: Ctx) => {
  c.fillStyle = "#2b3a5c"; c.fillRect(0, 0, 1080, 1080);
  shape(c, () => ell(c, 850, 170, 90, 90), "#fff3b0", 6); shape(c, () => ell(c, 890, 150, 78, 78), "#2b3a5c", 0);
  for (const [x, y] of [[140, 130], [330, 220], [520, 110], [700, 270], [240, 340]]) shape(c, () => ell(c, x, y, 11, 11), "#fff3b0", 3);
  c.fillStyle = "#3b7a33"; c.fillRect(0, 880, 1080, 200); line(c, [[0, 880], [1080, 880]], 6);
  for (const [x, a, len] of [[160, -1.9, 420], [330, -1.3, 460], [520, -1.7, 500], [700, -1.35, 440], [880, -1.8, 430]] as number[][]) {
    leaf(c, x, 900, len, a, COL.leaf);
    const tx = x + Math.cos(a) * len * 0.62, ty = 900 + Math.sin(a) * len * 0.62;
    dropP(c, tx - 12, ty, 14); dropP(c, tx + Math.cos(a) * 60 + 12, ty + Math.sin(a) * 60, 11);
  }
  for (const x of [250, 600, 800]) wavy(c, x, 450, x + 20, 240, 12, RED, 9);
};

const CARDS: [string, (c: Ctx) => void][] = [
  ["intro", intro], ["summary", summary], ["e1", e1], ["e2", e2], ["a1", a1], ["a2", a2], ["a3", a3], ["a4", a4], ["a5", a5], ["a6", a6], ["p1", p1], ["c1", c1], ["c2", c2],
  ["term.0", tEvap], ["term.1", tVapour], ["term.2", tGas], ["term.4", tParticle], ["term.5", tHumid], ["term.6", tSaturated], ["term.9", tBoil], ["term.10", tFair],
  ["expl.0", eEvap], ["expl.1", eWhere], ["expl.2", eCond], ["expl.3", eLeaveLand], ["expl.4", eFaster], ["expl.6", eDew],
];
export const ic_statesEvaporationAndCondensationL3 = cards("sci.states.evaporation-and-condensation.L3 cards", CARDS.map(([, f]) => f));
