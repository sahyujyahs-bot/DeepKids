import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, rrect, polyP, shadow, shade, line, shine, arrow, glass, bowl, plate, person, hand, write, cards, rnd } from "./flatKit";

const PI = Math.PI;
const arcPts = (cx: number, cy: number, r: number, a0: number, a1: number, n = 14) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * PI) / 6; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 14, INK); line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 8, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
};
const flake = (c: Ctx, x: number, y: number, r: number) => {
  for (const w of [[14, INK], [7, COL.blue]] as [number, string][]) for (let i = 0; i < 3; i++) { const a = (i * PI) / 3 + PI / 6; line(c, [[x - Math.cos(a) * r, y - Math.sin(a) * r], [x + Math.cos(a) * r, y + Math.sin(a) * r]], w[0], w[1]); }
};
const dropP = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) => shape(c, () => { c.moveTo(x, y - 1.7 * s); c.quadraticCurveTo(x + 0.2 * s, y - 0.8 * s, x + s, y + 0.1 * s); c.arc(x, y + 0.1 * s, s, 0, PI); c.quadraticCurveTo(x - 0.2 * s, y - 0.8 * s, x, y - 1.7 * s); c.closePath(); }, col, 5);
const wavy = (c: Ctx, x: number, y: number, h: number, col: string = WHITE, w = 10) => { const pts: number[][] = []; for (let i = 0; i <= 16; i++) pts.push([x + Math.sin(i * 0.9) * 14, y - (h * i) / 16]); line(c, pts, w + 6, INK); line(c, pts, w, col); };
const badge = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.yellow, 5); write(c, "37", x - r * 0.62, y - r * 0.5, r, INK, 6); };
// a vertical thermometer: tube top..bottom, bulb at the bottom, red level 0..1
const thermo = (c: Ctx, x: number, top: number, bottom: number, w: number, level: number) => {
  const tb = bottom - w * 1.1;
  shape(c, () => rrect(c, x - w / 2, top, w, tb - top + w, w / 2), WHITE, 6);
  const ly = tb - (tb - top - w) * level;
  shape(c, () => rrect(c, x - w * 0.22, ly, w * 0.44, tb - ly + w * 0.5, w * 0.2), RED, 0);
  shape(c, () => ell(c, x, bottom - w * 0.1, w * 0.95, w * 0.95), RED, 6);
  for (let i = 0; i < 6; i++) line(c, [[x + w / 2 + 6, top + w + i * ((tb - top - w) / 5)], [x + w / 2 + (i % 5 === 0 ? 34 : 20), top + w + i * ((tb - top - w) / 5)]], 4);
};
const head = (c: Ctx, x: number, y: number, r: number, cheeks = false, mouth = 0.38) => {
  shape(c, () => ell(c, x, y, r, r * 1.05), SKIN.child);
  shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.02, y); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x - r * 0.38, y + r * 0.1, r * 0.1, r * 0.14), INK, 0); shape(c, () => ell(c, x + r * 0.38, y + r * 0.1, r * 0.1, r * 0.14), INK, 0);
  if (cheeks) { c.globalAlpha = 0.7; for (const s of [-1, 1]) { c.beginPath(); ell(c, x + s * r * 0.62, y + r * 0.42, r * 0.22, r * 0.17); c.fillStyle = COL.red; c.fill(); } c.globalAlpha = 1; }
  c.beginPath(); c.arc(x, y + r * mouth, r * 0.3, 0.2, PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
};
const headPos = (x: number, y: number, h: number) => ({ x, y: y - h * 0.74 - h * 0.13 * 1.05, r: h * 0.13 });
const brain = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shape(c, () => ell(c, x, y, rx, ry), COL.pink, 6);
  for (const [a, b, d] of [[-0.5, -0.2, 0.6], [0.1, -0.5, 0.5], [0.45, 0.1, 0.55], [-0.2, 0.3, 0.5]]) line(c, arcPts(x + a * rx, y + b * ry, ry * 0.35, d, d + 3.2, 8), 5, "#c0607f");
};
const bubble = (c: Ctx, x: number, y: number, r: number, col: string) => shape(c, () => ell(c, x, y, r, r), col, 6);

const SKY_HOT = "#ffe3a8", SKY_COLD = "#cfe6f7", FLOOR = "#e3d4b4";

// ---- intro: the same child on a hot day and a cold day, a steel plate beside them
const intro = (c: Ctx) => {
  ground(c, SKY_HOT);
  c.fillStyle = SKY_COLD; c.fillRect(540, 0, 540, 1080);
  c.fillStyle = FLOOR; c.fillRect(0, 880, 1080, 200); line(c, [[540, 0], [540, 1080]], 8);
  sun(c, 120, 150, 62); flake(c, 960, 150, 70);
  for (const [px, hot, cx] of [[170, true, 400], [710, false, 930]] as [number, boolean, number][]) {
    shadow(c, px + 20, 900, 110, 18);
    shape(c, () => rrect(c, px - 80, 560, 160, 340, 14), hot ? "#ee7b45" : COL.steelIn);
    shade(c, () => rrect(c, px - 80, 560, 160, 340, 14), hot ? "#c8532a" : COL.steelDk, 40, 0);
    if (hot) { for (const o of [-40, 0, 40]) wavy(c, px + o, 550, 110, "#ffb347", 8); }
    else { const r = rnd(5); for (let i = 0; i < 14; i++) { c.beginPath(); ell(c, px - 65 + r() * 130, 575 + r() * 310, 7, 5); c.fillStyle = WHITE; c.fill(); } }
    shadow(c, cx + 20, 900, 120, 18);
    person(c, cx, 900, 440, hot ? {} : { armL: [PI * 0.5, 0], armR: [PI * 0.5, PI] });
    const h = headPos(cx, 900, 440);
    if (hot) { dropP(c, h.x - h.r * 1.5, h.y, 14); dropP(c, h.x + h.r * 1.5, h.y + 30, 14); }
    else { for (const s of [-1, 1]) line(c, [[h.x + s * h.r * 1.5, h.y - 25], [h.x + s * h.r * 1.75, h.y - 5], [h.x + s * h.r * 1.5, h.y + 15], [h.x + s * h.r * 1.75, h.y + 35]], 6, COL.blueDk); }
    badge(c, cx, 660, 36);
  }
};

// ---- summary: the dial at "just right" between a hot child and a cold child
const summary = (c: Ctx) => {
  ground(c, "#f3ead6");
  c.fillStyle = SKY_HOT; c.fillRect(0, 380, 540, 700); c.fillStyle = SKY_COLD; c.fillRect(540, 380, 540, 700); c.fillStyle = FLOOR; c.fillRect(0, 900, 1080, 180);
  line(c, [[0, 380], [1080, 380]], 6);
  sun(c, 110, 480, 50); flake(c, 970, 480, 55);
  shape(c, () => { c.moveTo(280, 330); c.arc(540, 330, 260, PI, 0); c.closePath(); }, WHITE, 8);
  const zones: [number, number, string][] = [[PI, PI * 1.33, COL.orange], [PI * 1.33, PI * 1.67, COL.greenLt], [PI * 1.67, PI * 2, COL.blue]];
  for (const [a0, a1, col] of zones) { c.beginPath(); c.arc(540, 330, 220, a0, a1); c.arc(540, 330, 120, a1, a0, true); c.closePath(); c.fillStyle = col; c.fill(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke(); }
  line(c, [[540, 330], [540, 130]], 14); line(c, [[540, 330], [540, 130]], 7, RED); shape(c, () => ell(c, 540, 330, 26, 26), INK, 0);
  shadow(c, 300, 905, 120, 18); person(c, 290, 900, 420); const a = headPos(290, 900, 420);
  dropP(c, a.x - a.r * 1.5, a.y, 14); dropP(c, a.x + a.r * 1.6, a.y + 25, 14); dropP(c, a.x - a.r * 1.7, a.y + 60, 12);
  shadow(c, 800, 905, 120, 18); person(c, 790, 900, 420, { armL: [PI * 0.5, 0], armR: [PI * 0.5, PI] }); const b = headPos(790, 900, 420);
  for (const s of [-1, 1]) line(c, [[b.x + s * b.r * 1.5, b.y - 25], [b.x + s * b.r * 1.75, b.y - 5], [b.x + s * b.r * 1.5, b.y + 15], [b.x + s * b.r * 1.75, b.y + 35]], 6, COL.blueDk);
};

// ---- term 0 homeostasis: pushed back to the middle from both sides
const t_homeo = (c: Ctx) => {
  ground(c, "#f3ead6");
  thermo(c, 540, 130, 950, 80, 0.5);
  line(c, [[380, 540], [500, 540]], 6, RED);
  badge(c, 280, 540, 60);
  arrow(c, [[700, 280], [700, 480]]); arrow(c, [[700, 800], [700, 600]]);
  sun(c, 880, 170, 45); flake(c, 880, 900, 50);
};

// ---- term 1 body temperature: a child and a thermometer at 37
const t_bodytemp = (c: Ctx) => {
  ground(c, "#f3ead6");
  c.fillStyle = FLOOR; c.fillRect(0, 900, 1080, 180);
  shadow(c, 340, 905, 140, 20); person(c, 330, 900, 640, { armR: [PI * 0.4, PI * 0.25] });
  c.globalAlpha = 0.35; c.beginPath(); ell(c, 330, 600, 150, 300); c.fillStyle = COL.orange; c.fill(); c.globalAlpha = 1;
  thermo(c, 800, 200, 900, 90, 0.55);
  write(c, "37", 880, 460, 110, INK, 12);
};

// ---- term 4 sweat: a face with drops
const t_sweat = (c: Ctx) => {
  ground(c, SKY_HOT); sun(c, 150, 150, 70);
  head(c, 540, 560, 290, true, 0.45);
  for (const [x, y, s] of [[420, 400, 30], [650, 380, 34], [540, 340, 28], [330, 560, 32], [760, 600, 32], [430, 730, 26]] as [number, number, number][]) dropP(c, x, y, s);
};

// ---- term 5 sweat gland: skin in cross-section, a tube from a coil to the surface
const t_gland = (c: Ctx) => {
  ground(c, "#f3ead6");
  shape(c, () => rrect(c, 120, 360, 840, 90, 10), "#d9946b", 6);
  shape(c, () => rrect(c, 120, 450, 840, 560, 10), "#f2b8a0", 6);
  shade(c, () => rrect(c, 120, 450, 840, 560, 10), "#e08f78", 50, 0, 0.35);
  const duct = [[540, 840], [500, 740], [580, 640], [500, 540], [545, 450], [540, 340]];
  line(c, duct, 38, INK); line(c, duct, 22, COL.water);
  shape(c, () => ell(c, 540, 880, 130, 90), COL.waterDk, 6);
  for (const dy of [-40, 0, 40]) line(c, arcPts(540, 880 + dy, 70, PI * 0.15, PI * 1.85, 14), 14, INK);
  dropP(c, 540, 300, 36); dropP(c, 640, 290, 22); dropP(c, 440, 300, 22);
  for (const x of [250, 800]) { line(c, [[x, 360], [x + 20, 270]], 8); }
  shape(c, () => ell(c, 540, 365, 20, 8), COL.drop, 4);
};

// ---- term 6 evaporation: a wet puddle gets smaller, the water goes up into the air
const t_evap = (c: Ctx) => {
  ground(c, SKY_HOT); c.fillStyle = FLOOR; c.fillRect(0, 760, 1080, 320); sun(c, 540, 130, 55);
  shape(c, () => ell(c, 270, 880, 220, 70), COL.water, 6); c.beginPath(); ell(c, 200, 865, 70, 14); c.fillStyle = COL.drop; c.fill();
  shape(c, () => ell(c, 830, 880, 90, 28), COL.water, 6);
  for (const o of [-50, 0, 50]) wavy(c, 830 + o, 790, 330, WHITE, 10);
  arrow(c, [[480, 880], [630, 880]]);
};

// ---- term 7 shivering
const t_shiver = (c: Ctx) => {
  ground(c, SKY_COLD); c.fillStyle = "#f4f8fc"; c.fillRect(0, 900, 1080, 180); flake(c, 140, 150, 70); flake(c, 950, 230, 50);
  shadow(c, 540, 905, 190, 24); person(c, 540, 900, 760, { armL: [PI * 0.5, -0.1], armR: [PI * 0.5, PI + 0.1] });
  for (const s of [-1, 1]) for (const k of [0, 1, 2]) line(c, arcPts(540 + s * (190 + k * 60), 560, 75 - k * 10, s > 0 ? -1 : PI - 1, s > 0 ? 1 : PI + 1, 6), 9, COL.blueDk);
};

// ---- term 9 blood vessels: red tubes branching, blood moving
const t_vessels = (c: Ctx) => {
  ground(c, "#fbe4dc");
  const tube = (pts: number[][], w: number) => { line(c, pts, w + 14, INK); line(c, pts, w, "#f6b7a8"); };
  const main = [[80, 560], [300, 560], [470, 540]];
  const br: number[][][] = [[[470, 540], [650, 380], [900, 240], [1010, 230]], [[470, 540], [700, 560], [1010, 560]], [[470, 540], [650, 720], [900, 860], [1010, 860]]];
  tube(main, 110); br.forEach((p) => tube(p, 62));
  const r = rnd(3);
  const cells = (pts: number[][], n: number) => { for (let i = 0; i < n; i++) { const t = (i + 0.5) / n * (pts.length - 1), k = Math.floor(t), f = t - k, a = pts[k], b = pts[Math.min(k + 1, pts.length - 1)]; shape(c, () => ell(c, a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f + (r() - 0.5) * 30, 20, 13, r() * 3), RED, 4); } };
  cells(main, 5); br.forEach((p) => cells(p, 5));
  arrow(c, [[150, 440], [380, 440]]);
  arrow(c, [[740, 180], [900, 150]]);
};

// ---- term 11 hypothalamus: a small spot in the middle of the brain, the size of an almond
const t_hypo = (c: Ctx) => {
  ground(c, "#f3ead6");
  shape(c, () => { c.moveTo(210, 540); c.bezierCurveTo(200, 150, 780, 140, 800, 520); c.lineTo(870, 600); c.lineTo(790, 630); c.bezierCurveTo(800, 880, 640, 960, 470, 930); c.bezierCurveTo(280, 910, 220, 760, 210, 540); c.closePath(); }, SKIN.child);
  shape(c, () => { c.moveTo(200, 500); c.bezierCurveTo(190, 140, 780, 120, 800, 470); c.quadraticCurveTo(500, 330, 200, 500); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, 230, 600, 40, 70), SKIN.childDk, 5);
  shape(c, () => ell(c, 680, 530, 16, 22), INK, 0);
  brain(c, 490, 440, 230, 160);
  c.beginPath(); ell(c, 500, 520, 70, 50); c.fillStyle = "rgba(255,211,77,0.55)"; c.fill();
  shape(c, () => ell(c, 500, 520, 36, 22, 0.3), COL.yellow, 5);
  arrow(c, [[860, 800], [600, 580]]);
  shape(c, () => { c.moveTo(790, 900); c.quadraticCurveTo(880, 820, 990, 880); c.quadraticCurveTo(930, 990, 800, 930); c.closePath(); }, COL.brown, 6);
};

// ---- term 13 feedback loop: notice, decide, act, round again
const t_loop = (c: Ctx) => {
  ground(c, "#f3ead6");
  const R = 300, cx = 540, cy = 580, ang = [-PI / 2, PI / 6, PI * 5 / 6];
  ang.forEach((a, i) => { arrow(c, arcPts(cx, cy, R, a + 0.5, ang[(i + 1) % 3] + (i === 2 ? 2 * PI : 0) - 0.5, 12), RED, 12); });
  const pos = ang.map((a) => [cx + Math.cos(a) * R, cy + Math.sin(a) * R]);
  bubble(c, pos[0][0], pos[0][1], 130, COL.sky); thermo(c, pos[0][0], pos[0][1] - 100, pos[0][1] + 95, 36, 0.7);
  bubble(c, pos[1][0], pos[1][1], 130, "#fbe4dc"); brain(c, pos[1][0], pos[1][1], 90, 62);
  bubble(c, pos[2][0], pos[2][1], 130, COL.sky); dropP(c, pos[2][0] - 40, pos[2][1] + 10, 28); dropP(c, pos[2][0] + 40, pos[2][1] - 10, 28);
};

// ---- term 16 humidity: air full of water, the shirt will not dry
const t_humid = (c: Ctx) => {
  ground(c, "#cfdbe4");
  shape(c, () => { c.moveTo(150, 200); c.arc(260, 190, 90, PI, PI * 1.9); c.arc(420, 170, 110, PI * 1.1, PI * 1.9); c.arc(580, 200, 80, PI * 1.2, PI * 0.5); c.lineTo(150, 280); c.closePath(); }, WHITE, 6);
  line(c, [[80, 330], [1000, 330]], 8);
  shape(c, () => polyP(c, [[330, 330], [420, 330], [450, 380], [630, 380], [660, 330], [750, 330], [820, 480], [740, 520], [700, 470], [700, 800], [380, 800], [380, 470], [340, 520], [260, 480]]), COL.cloth);
  shade(c, () => polyP(c, [[330, 330], [420, 330], [450, 380], [630, 380], [660, 330], [750, 330], [820, 480], [740, 520], [700, 470], [700, 800], [380, 800], [380, 470], [340, 520], [260, 480]]), COL.waterDk, 0, 0, 0.0);
  const r = rnd(9);
  for (let i = 0; i < 22; i++) { const x = 90 + r() * 900, y = 360 + r() * 640; if (x > 340 && x < 740 && y < 820) continue; dropP(c, x, y, 16 + r() * 8, COL.water); }
  for (const x of [450, 540, 630]) dropP(c, x, 880, 18);
  for (const [x, y] of [[450, 600], [600, 700], [520, 500]]) dropP(c, x, y, 20, COL.waterDk);
};

// ---- term 18 ORS: water + a pinch of salt + sugar
const t_ors = (c: Ctx) => {
  ground(c, "#f3ead6");
  glass(c, 540, 860, 300, 440, 0.85);
  bowl(c, 170, 720, 110); shape(c, () => { c.moveTo(80, 716); c.quadraticCurveTo(170, 610, 260, 716); c.closePath(); }, WHITE, 5);
  bowl(c, 910, 720, 110);
  for (const [x, y] of [[860, 690], [930, 690], [895, 640]]) { shape(c, () => rrect(c, x - 32, y - 32, 64, 64, 8), WHITE, 5); shade(c, () => rrect(c, x - 32, y - 32, 64, 64, 8), COL.steelDk, 10, 0, 0.35); }
  write(c, "+", 270, 250, 100, INK, 12); write(c, "+", 700, 250, 100, INK, 12);
  arrow(c, [[170, 400], [380, 500]]); arrow(c, [[910, 400], [700, 500]]);
};

// ---- e1 sweaty tumbler test: two tumblers, one in a wet cloth, one in a dry cloth, a fan
const fan = (c: Ctx, x: number, y: number) => {
  shape(c, () => rrect(c, x - 15, y + 80, 30, 190, 8), COL.steel); shape(c, () => rrect(c, x - 90, y + 255, 180, 30, 10), COL.steelDk);
  shape(c, () => ell(c, x, y, 170, 170), WHITE, 7);
  for (let i = 0; i < 3; i++) { const a = (i * 2 * PI) / 3 - 0.5; shape(c, () => { c.save(); c.translate(x, y); c.rotate(a); c.ellipse(70, 0, 70, 30, 0, 0, 2 * PI); c.restore(); }, COL.teal, 5); }
  shape(c, () => ell(c, x, y, 24, 24), COL.black, 5);
};
const wrapped = (c: Ctx, x: number, wet: boolean) => {
  glass(c, x, 860, 220, 300, 0.85, COL.waterDk);
  shape(c, () => rrect(c, x - 110, 640, 220, 200, 14), wet ? COL.wet0 : COL.cloth, 6);
  if (wet) for (const [dx, dy] of [[-50, 700], [30, 760], [60, 690], [-20, 800]]) dropP(c, x + dx, dy, 14, COL.drop);
};
(COL as Record<string, string>).wet0 = "#8fb3dc";
const e1 = (c: Ctx) => {
  ground(c, "#f3ead6"); c.fillStyle = FLOOR; c.fillRect(0, 880, 1080, 200);
  fan(c, 190, 400);
  wrapped(c, 600, true); wrapped(c, 900, false);
  arrow(c, [[380, 400], [470, 400]]); arrow(c, [[380, 470], [470, 470]]);
  for (const o of [-1, 0, 1]) wavy(c, 600 + o * 50, 600, 120, WHITE, 8);
};

// ---- e2 running: a runner, sweat, and the steady 37
const e2 = (c: Ctx) => {
  ground(c, "#f3ead6"); c.fillStyle = FLOOR; c.fillRect(0, 900, 1080, 180);
  shadow(c, 330, 905, 150, 20);
  person(c, 330, 900, 620);
  const h = headPos(330, 900, 620);
  dropP(c, h.x - h.r * 1.5, h.y - 20, 18); dropP(c, h.x + h.r * 1.5, h.y + 20, 18);
  for (const y of [520, 600, 680]) line(c, [[80, y], [150, y]], 10, COL.grey);
  thermo(c, 800, 200, 900, 90, 0.55);
  write(c, "37", 880, 460, 110, INK, 12);
};

// ---- e3 matka: clay pot sweating, steel pot not
const e3 = (c: Ctx) => {
  ground(c, SKY_HOT); c.fillStyle = FLOOR; c.fillRect(0, 820, 1080, 260);
  const pot = () => { c.moveTo(250, 440); c.bezierCurveTo(60, 520, 70, 840, 280, 850); c.bezierCurveTo(480, 840, 490, 520, 310, 440); c.closePath(); };
  shadow(c, 300, 855, 220, 30);
  shape(c, () => rrect(c, 235, 380, 90, 70, 14), "#c9703f"); shape(c, pot, "#c9703f"); shade(c, pot, "#a2532a", 60, 0, 0.45);
  shape(c, () => ell(c, 280, 380, 62, 16), "#7a3d1f", 6);
  const r = rnd(2); for (let i = 0; i < 9; i++) dropP(c, 120 + r() * 340, 520 + r() * 270, 15, COL.drop);
  for (const x of [230, 300]) wavy(c, x, 330, 170, WHITE, 8);
  shadow(c, 800, 855, 210, 30);
  shape(c, () => rrect(c, 620, 520, 360, 330, 30), COL.steel); shade(c, () => rrect(c, 620, 520, 360, 330, 30), COL.steelDk, 70, 0, 0.5);
  shape(c, () => ell(c, 800, 520, 180, 36), COL.steelIn, 6); shape(c, () => ell(c, 800, 524, 140, 22), COL.water, 5);
  shine(c, [[660, 580], [660, 780]], 10);
  shape(c, () => ell(c, 610, 640, 24, 36), COL.steelDk, 5); shape(c, () => ell(c, 990, 640, 24, 36), COL.steelDk, 5);
  sun(c, 900, 150, 55);
};

// ---- a1 jump and notice
const a1 = (c: Ctx) => {
  ground(c, "#f3ead6"); c.fillStyle = FLOOR; c.fillRect(0, 900, 1080, 180);
  shadow(c, 540, 925, 150, 22);
  person(c, 540, 820, 640, { armL: [-PI * 0.55, -PI * 0.45], armR: [-PI * 0.45, -PI * 0.55] });
  const h = headPos(540, 820, 640);
  c.globalAlpha = 0.7; for (const s of [-1, 1]) { c.beginPath(); ell(c, h.x + s * h.r * 0.62, h.y + h.r * 0.5, h.r * 0.2, h.r * 0.15); c.fillStyle = COL.red; c.fill(); } c.globalAlpha = 1;
  for (const [dx, dy] of [[-1.6, 0], [1.7, 30], [-1.8, 80], [1.5, -40]]) dropP(c, h.x + dx * h.r, h.y + dy, 16);
  arrow(c, [[250, 700], [250, 540]]); arrow(c, [[830, 540], [830, 700]]);
};

// ---- a2 cold hands: a bowl of ice water, a hand dipped, a pale fingertip
const a2 = (c: Ctx) => {
  ground(c, "#f3ead6");
  c.save(); c.translate(0, -80);
  bowl(c, 400, 640, 300, COL.sky);
  for (const [x, y, r] of [[300, 650, 50], [420, 670, 56], [510, 640, 46], [370, 610, 40]]) { shape(c, () => rrect(c, x - r, y - r * 0.7, r * 2, r * 1.4, 10), "#e4f4fc", 5); shine(c, [[x - r * 0.6, y - r * 0.3], [x - r * 0.2, y - r * 0.4]], 6); }
  c.restore();
  hand(c, 400, 250, PI * 0.5, 2.3, SKIN.child, CLOTH.child, true);
  flake(c, 400, 880, 60);
  shape(c, () => rrect(c, 760, 330, 230, 440, 110), "#f2c9b0"); shape(c, () => ell(c, 875, 400, 60, 60), "#fdf6f0", 5);
  c.globalAlpha = 0.9; shape(c, () => ell(c, 875, 400, 60, 60), "#fdf6f0", 5); c.globalAlpha = 1;
  shade(c, () => rrect(c, 760, 330, 230, 440, 110), "#e8a98d", 0, 230, 0.9);
  shape(c, () => rrect(c, 760, 330, 230, 440, 110), "rgba(0,0,0,0)", 6);
  arrow(c, [[640, 880], [780, 880]]);
};

// ---- a3 thermostat hunt: a fridge and a dial
const a3 = (c: Ctx) => {
  ground(c, "#f3ead6"); c.fillStyle = FLOOR; c.fillRect(0, 900, 1080, 180);
  shadow(c, 300, 905, 220, 24);
  shape(c, () => rrect(c, 120, 140, 360, 760, 24), COL.sky); shade(c, () => rrect(c, 120, 140, 360, 760, 24), COL.blueDk, 60, 0, 0.3);
  line(c, [[120, 470], [480, 470]], 6); shape(c, () => rrect(c, 420, 220, 26, 160, 12), COL.steelDk, 5); shape(c, () => rrect(c, 420, 540, 26, 200, 12), COL.steelDk, 5);
  flake(c, 300, 320, 60);
  shape(c, () => ell(c, 770, 460, 230, 230), WHITE, 8);
  for (const [a0, a1_, col] of [[PI * 0.75, PI * 1.25, COL.blue], [PI * 1.25, PI * 1.75, COL.greenLt], [PI * 1.75, PI * 2.25, COL.orange]] as [number, number, string][]) { c.beginPath(); c.arc(770, 460, 190, a0, a1_); c.arc(770, 460, 140, a1_, a0, true); c.closePath(); c.fillStyle = col; c.fill(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke(); }
  line(c, [[770, 460], [770, 300]], 14); line(c, [[770, 460], [770, 300]], 7, RED); shape(c, () => ell(c, 770, 460, 26, 26), INK, 0);
  arrow(c, arcPts(770, 460, 275, -PI * 0.1, PI * 0.45, 8)); arrow(c, arcPts(770, 460, 275, PI * 1.1, PI * 0.55, 8));
};

// ---- a4 body council: child as Brain Mayor, three soft toys, grown-up as the teams
const toy = (c: Ctx, x: number, y: number, s: number, col: string) => {
  shadow(c, x + 10, y + 5, s * 0.9, s * 0.18);
  shape(c, () => ell(c, x, y - s * 0.55, s * 0.6, s * 0.6), col); shape(c, () => ell(c, x, y - s * 1.45, s * 0.5, s * 0.46), col);
  for (const k of [-1, 1]) shape(c, () => ell(c, x + k * s * 0.4, y - s * 1.85, s * 0.18, s * 0.18), col);
  shape(c, () => ell(c, x, y - s * 1.35, s * 0.2, s * 0.14), "#f3d9b8", 4);
  shape(c, () => ell(c, x - s * 0.18, y - s * 1.5, s * 0.05, s * 0.06), INK, 0); shape(c, () => ell(c, x + s * 0.18, y - s * 1.5, s * 0.05, s * 0.06), INK, 0);
};
const a4 = (c: Ctx) => {
  ground(c, "#f3ead6"); c.fillStyle = FLOOR; c.fillRect(0, 900, 1080, 180);
  shadow(c, 760, 905, 130, 20); person(c, 760, 900, 640, { adult: true, armL: [PI * 0.3, -0.2], armR: [PI * 0.7, PI + 0.2] });
  shadow(c, 340, 905, 120, 20); person(c, 340, 900, 520);
  const h = headPos(340, 900, 520);
  shape(c, () => polyP(c, [[h.x - h.r * 0.9, h.y - h.r * 0.95], [h.x - h.r * 0.9, h.y - h.r * 1.8], [h.x - h.r * 0.4, h.y - h.r * 1.4], [h.x, h.y - h.r * 2], [h.x + h.r * 0.4, h.y - h.r * 1.4], [h.x + h.r * 0.9, h.y - h.r * 1.8], [h.x + h.r * 0.9, h.y - h.r * 0.95]]), COL.yellow, 5);
  toy(c, 120, 1010, 110, COL.brown); toy(c, 560, 1010, 110, COL.pink); toy(c, 960, 1010, 110, COL.purple);
};

// ---- a5 goosebump watch: a magnifier over an arm, hairs standing on bumps
const a5 = (c: Ctx) => {
  ground(c, "#f3ead6");
  shape(c, () => rrect(c, 40, 640, 1000, 300, 150), SKIN.child); shade(c, () => rrect(c, 40, 640, 1000, 300, 150), SKIN.childDk, 0, 50, 0.45);
  line(c, [[640, 640], [900, 380]], 36, INK); line(c, [[640, 640], [900, 380]], 22, COL.brown);
  c.save(); c.beginPath(); ell(c, 440, 400, 340, 340); c.clip(); c.fillStyle = SKIN.child; c.fillRect(0, 0, 1080, 1080);
  c.fillStyle = "#f3ead6"; c.fillRect(100, 60, 700, 250);
  c.restore();
  c.save(); c.beginPath(); ell(c, 440, 400, 340, 340); c.clip(); c.fillStyle = "#f3ead6"; c.fillRect(0, 0, 1080, 1080);
  shape(c, () => rrect(c, 60, 430, 760, 400, 20), SKIN.child, 0);
  for (let i = 0; i < 5; i++) { const x = 130 + i * 150; shape(c, () => { c.moveTo(x - 62, 440); c.bezierCurveTo(x - 50, 330, x + 50, 330, x + 62, 440); c.closePath(); }, SKIN.child, 6); shade(c, () => { c.moveTo(x - 62, 440); c.bezierCurveTo(x - 50, 330, x + 50, 330, x + 62, 440); c.closePath(); }, SKIN.childDk, 18, 8, 0.4); line(c, [[x, 345], [x, 190]], 12, INK); }
  c.restore();
  c.beginPath(); ell(c, 440, 400, 340, 340); c.strokeStyle = INK; c.lineWidth = 34; c.stroke(); c.beginPath(); ell(c, 440, 400, 340, 340); c.strokeStyle = COL.steelDk; c.lineWidth = 18; c.stroke();
  flake(c, 930, 130, 60);
};

// ---- p1 water diary: glass of water, a diary page with drops, a pee colour strip
const p1 = (c: Ctx) => {
  ground(c, "#f3ead6");
  glass(c, 210, 700, 240, 340, 0.8);
  shadow(c, 700, 740, 340, 30);
  shape(c, () => rrect(c, 380, 140, 580, 620, 18), COL.paper); shade(c, () => rrect(c, 380, 140, 580, 620, 18), COL.grey, 22, 0, 0.3);
  shape(c, () => rrect(c, 380, 140, 70, 620, 18), COL.teal, 6);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) { if (r * 4 + k < 7) dropP(c, 520 + k * 110, 240 + r * 125, 26); else shape(c, () => ell(c, 520 + k * 110, 245 + r * 125, 24, 24), "rgba(0,0,0,0)", 4); }
  const cols = ["#fff3b0", "#ffe97a", "#f9d948", "#e8b622", "#c88a14", "#8f5a10"];
  cols.forEach((col, i) => shape(c, () => rrect(c, 130 + i * 140, 860, 130, 150, 12), col, 5));
};

// ---- c1 shoebox room: a box in the sun, wet cloth on top, a thermometer inside
const c1 = (c: Ctx) => {
  ground(c, SKY_HOT); c.fillStyle = FLOOR; c.fillRect(0, 800, 1080, 280); sun(c, 160, 170, 70);
  shadow(c, 600, 880, 360, 40);
  shape(c, () => polyP(c, [[230, 460], [800, 460], [940, 540], [940, 800], [370, 800], [230, 720]]), COL.wood);
  shape(c, () => polyP(c, [[230, 460], [370, 540], [940, 540], [800, 460]]), "#7a5a2c", 6);
  shape(c, () => polyP(c, [[230, 460], [370, 540], [370, 800], [230, 720]]), COL.woodDk);
  shape(c, () => polyP(c, [[370, 540], [940, 540], [940, 800], [370, 800]]), COL.wood);
  shape(c, () => polyP(c, [[200, 420], [840, 420], [980, 520], [340, 520]]), "#8fb3dc"); shade(c, () => polyP(c, [[200, 420], [840, 420], [980, 520], [340, 520]]), "#6a92c2", 40, 0, 0.35);
  dropP(c, 400, 570, 14, COL.drop); dropP(c, 700, 585, 14, COL.drop);
  for (const x of [480, 600, 720]) wavy(c, x, 400, 150, WHITE, 8);
  thermo(c, 640, 600, 780, 40, 0.3);
};

// ---- c2 a suit for another world: a figure in a suit between cold and heat, 37 on the chest
const c2 = (c: Ctx) => {
  ground(c, SKY_COLD); c.fillStyle = SKY_HOT; c.fillRect(540, 0, 540, 1080); line(c, [[540, 0], [540, 1080]], 6);
  c.fillStyle = FLOOR; c.fillRect(0, 900, 1080, 180);
  flake(c, 140, 160, 70); sun(c, 940, 160, 60);
  shadow(c, 540, 905, 190, 24);
  for (const s of [-1, 1]) { shape(c, () => rrect(c, 540 + s * 80 - 55, 700, 110, 200, 30), "#eef2f6"); }
  shape(c, () => rrect(c, 400, 400, 280, 360, 70), "#eef2f6"); shade(c, () => rrect(c, 400, 400, 280, 360, 70), COL.steelDk, 40, 0, 0.45);
  for (const s of [-1, 1]) line(c, [[540 + s * 150, 440], [540 + s * 230, 600]], 100, INK), line(c, [[540 + s * 150, 440], [540 + s * 230, 600]], 86, "#eef2f6");
  shape(c, () => ell(c, 540, 300, 150, 150), "#eef2f6"); shape(c, () => ell(c, 540, 300, 105, 95), COL.blueDk, 6);
  head(c, 540, 305, 62);
  c.globalAlpha = 0.28; c.beginPath(); ell(c, 540, 300, 105, 95); c.fillStyle = COL.sky; c.fill(); c.globalAlpha = 1;
  badge(c, 540, 580, 50);
};

// ---- expl 4 red cheeks and white fingers
const x_blood = (c: Ctx) => {
  ground(c, "#f3ead6");
  c.fillStyle = SKY_HOT; c.fillRect(0, 0, 540, 1080); c.fillStyle = SKY_COLD; c.fillRect(540, 0, 540, 1080); line(c, [[540, 0], [540, 1080]], 6);
  sun(c, 110, 120, 50); flake(c, 970, 120, 55);
  head(c, 290, 560, 190, true, 0.5);
  c.globalAlpha = 0.85; for (const s of [-1, 1]) { c.beginPath(); ell(c, 290 + s * 120, 650, 48, 36); c.fillStyle = COL.red; c.fill(); } c.globalAlpha = 1;
  hand(c, 700, 560, 0, 2, "#e8d3c5", CLOTH.child, true);
  for (const y of [500, 570, 640]) line(c, [[940, y], [960, y - 20]], 5, COL.blueDk);
};

// ---- expl 5 thirst: a child drinking, a glass of water
const x_thirst = (c: Ctx) => {
  ground(c, "#f3ead6"); c.fillStyle = FLOOR; c.fillRect(0, 900, 1080, 180);
  const x = 400, y = 900, h = 700, a1_ = -0.2, a2_ = -PI * 0.5 - 0.2;
  shadow(c, x, y + 5, 160, 22);
  person(c, x, y, h, { armR: [a1_, a2_] });
  const sx = x + h * 0.11, sy = y - h * 0.74 + h * 0.03, ex = sx + Math.cos(a1_) * h * 0.17, ey = sy + Math.sin(a1_) * h * 0.17, wx = ex + Math.cos(a2_) * h * 0.16, wy = ey + Math.sin(a2_) * h * 0.16;
  glass(c, wx + 15, wy + 80, 110, 170, 0.6);
  dropP(c, 820, 400, 60); dropP(c, 780, 600, 40); dropP(c, 900, 650, 30);
};

export const ic_bodyKeepingBalanceL3 = cards("sci.body.keeping-balance.L3 cards", [
  intro, summary, e1, e2, e3, a1, a2, a3, a4, a5, p1, c1, c2,
  t_homeo, t_bodytemp, t_sweat, t_gland, t_evap, t_shiver, t_vessels, t_hypo, t_loop, t_humid, t_ors, x_blood, x_thirst,
]);
