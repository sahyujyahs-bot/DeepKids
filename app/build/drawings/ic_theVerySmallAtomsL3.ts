import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, glass, seed, write, cards } from "./flatKit";

// sci.the-very-small.atoms.L3 · picture cards (intro, cover, experiments, activities, project, challenges, terms, explanations).
// Atoms: a soft glowing cloud with a tiny cluster in the middle. Protons red, neutrons grey, electrons blue.

const PRO = "#e4523b", PROD = "#b93a27", NEU = "#b9b4ab", NEUD = "#7d7870", ELE = "#5b8fd6", GLOW = "255,211,77";

const ball = (c: Ctx, x: number, y: number, r: number, col: string, dk: string, lw = 4) => {
  shape(c, () => ell(c, x, y, r, r), col, lw);
  shade(c, () => ell(c, x, y, r, r), dk, r * 0.35, r * 0.35);
  c.beginPath(); ell(c, x, y, r, r); c.lineWidth = lw; c.strokeStyle = INK; c.stroke();
  c.beginPath(); c.arc(x - r * 0.35, y - r * 0.35, r * 0.18, 0, Math.PI * 2); c.fillStyle = "rgba(255,255,255,0.7)"; c.fill();
};
// a soft glowing electron cloud, centre (x, y), radius r; rgb = colour of the glow
const fuzz = (c: Ctx, x: number, y: number, r: number, rgb = GLOW, a = 0.85) => {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(0.45, `rgba(${rgb},${a * 0.55})`); g.addColorStop(1, `rgba(${rgb},0)`);
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
};
const nucleus = (c: Ctx, x: number, y: number, r: number) => {
  const s = [[-0.5, -0.4, 0], [0.5, -0.35, 1], [0, 0.1, 1], [-0.55, 0.5, 1], [0.45, 0.55, 0], [-0.05, -0.75, 0]];
  s.forEach(([u, v, n]) => ball(c, x + u * r, y + v * r, r * 0.62, n ? NEU : PRO, n ? NEUD : PROD, Math.max(2.5, r * 0.12)));
};
const atom = (c: Ctx, x: number, y: number, r: number, nr = r * 0.16) => { fuzz(c, x, y, r); nucleus(c, x, y, nr); };
const dash = (c: Ctx, pts: number[][], w = 5, col = INK) => { c.setLineDash([14, 14]); line(c, pts, w, col); c.setLineDash([]); };
const table = (c: Ctx, y: number) => {
  shape(c, () => rrect(c, -20, y, 1120, 70, 4), COL.wood, 6);
  c.fillStyle = COL.woodDk; c.fillRect(-14, y + 44, 1108, 20);
  line(c, [[-14, y + 64], [1094, y + 64]], 6);
};
const paperSheet = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 20, y + h + 8, w / 2 + 10, 22);
  shape(c, () => rrect(c, x, y, w, h, 6), COL.paper, 6);
};
const pencil = (c: Ctx, x: number, y: number, an: number, len = 300) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => polyP(c, [[0, 0], [60, -16], [60, 16]]), "#f2d7b0", 5);
  shape(c, () => polyP(c, [[0, 0], [16, -4.5], [16, 4.5]]), INK, 0);
  shape(c, () => rrect(c, 60, -16, len - 80, 32, 4), COL.yellow, 5);
  shade(c, () => rrect(c, 60, -16, len - 80, 32, 4), COL.orange, 0, 10, 0.5);
  shape(c, () => rrect(c, len - 20, -16, 20, 32, 6), COL.pink, 5);
  c.restore();
};
const mag = (c: Ctx, x: number, y: number, r: number, an: number) => {
  line(c, [[x + r * 0.7, y + r * 0.7], [x + r * 1.6, y + r * 1.6]], 22, INK); line(c, [[x + r * 0.7, y + r * 0.7], [x + r * 1.6, y + r * 1.6]], 10, COL.brown);
  shape(c, () => ell(c, x, y, r, r), COL.glass, 8); shine(c, [[x - r * 0.6, y - r * 0.2], [x - r * 0.2, y - r * 0.6]], 8);
};
const balloonT = (c: Ctx, x: number, y: number, r: number, col: string, dk: string) => {
  const b = () => { c.moveTo(x, y + r * 1.25); c.bezierCurveTo(x - r * 1.3, y + r * 0.6, x - r * 1.1, y - r * 1.2, x, y - r * 1.2); c.bezierCurveTo(x + r * 1.1, y - r * 1.2, x + r * 1.3, y + r * 0.6, x, y + r * 1.25); c.closePath(); };
  shape(c, b, col); shade(c, b, dk, r * 0.25, r * 0.1);
  c.beginPath(); b(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  shape(c, () => polyP(c, [[x, y + r * 1.25], [x - 12, y + r * 1.5], [x + 12, y + r * 1.5]]), dk, 4);
};
const star = (c: Ctx, x: number, y: number, r: number, n: number, col: string = COL.yellow) => {
  const pts: number[][] = []; for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r * 0.55 : r; pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  shape(c, () => polyP(c, pts), col, 6);
};
const wave = (c: Ctx, x: number, y: number, len: number, amp: number, col: string = COL.greyDk, w = 6) => {
  const p: number[][] = []; for (let i = 0; i <= 20; i++) p.push([x + (i / 20) * len, y + Math.sin(i / 20 * Math.PI * 3) * amp]); line(c, p, w, col);
};

// ---- intro: Kanada in a harvested rice field at sunset, a grain held to his eye
const intro = (c: Ctx) => {
  const g = c.createLinearGradient(0, 0, 0, 640); g.addColorStop(0, "#f7b267"); g.addColorStop(1, "#fbe3a6"); c.fillStyle = g; c.fillRect(0, 0, D, 640);
  c.beginPath(); c.arc(760, 520, 130, 0, Math.PI * 2); c.fillStyle = "#f39a3c"; c.fill();
  c.fillStyle = "#d9b45a"; c.fillRect(0, 640, D, 440);
  c.strokeStyle = "#b98d36"; c.lineWidth = 6; for (let i = 0; i < 9; i++) { line(c, [[-20, 700 + i * 48], [1100, 690 + i * 48]], 5, "#b98d36"); }
  const r = rnd(5); for (let i = 0; i < 24; i++) { const x = 40 + r() * 1000, y = 680 + r() * 340; line(c, [[x, y], [x + 8, y - 34]], 5, "#8a6a22"); }
  c.save(); c.translate(380, 0);
  shadow(c, 20, 980, 190, 34);
  person(c, -20, 980, 760, { adult: true, sit: true, armR: [-0.3, -1.45], armL: [Math.PI * 0.6, Math.PI * 0.35] });
  c.restore();
  // the grain, big, in a callout
  shape(c, () => ell(c, 220, 280, 150, 150), "rgba(255,250,240,0.92)", 8);
  shape(c, () => ell(c, 220, 280, 78, 34, -0.7), "#fff3d6", 7);
  line(c, [[190, 300], [250, 260]], 5, "#e7c98a");
  shape(c, () => ell(c, 598, 532, 22, 10, -0.7), "#fff3d6", 5);
  arrow(c, [[320, 350], [530, 520]], RED, 10);
};

// ---- cover: zoom in five circles
const cover = (c: Ctx) => {
  ground(c);
  const P = [[190, 300], [540, 300], [890, 300], [365, 740], [715, 740]], R = 150, k = R / 88;
  const ring = (i: number, fn: () => void) => {
    const [x, y] = P[i]; c.save(); c.translate(x, y); c.scale(k, k); c.beginPath(); c.arc(0, 0, 88, 0, Math.PI * 2); c.clip(); fn(); c.restore();
    shape(c, () => ell(c, x, y, R, R), "rgba(0,0,0,0)", 9);
  };
  ring(0, () => { c.fillStyle = COL.wood; c.fillRect(-100, -100, 200, 200); for (let j = 0; j < 6; j++) line(c, [[-90, -70 + j * 28], [90, -62 + j * 28]], 3, COL.woodDk); hand(c, -85, -10, 0, 0.8, SKIN.child, CLOTH.child, true); });
  ring(1, () => { c.fillStyle = "#f0cf86"; c.fillRect(-100, -100, 200, 200); for (let j = 0; j < 9; j++) { const o = (j - 4) * 19; line(c, [[-100, o + 12], [0, o - 10], [100, o + 14]], 9, COL.woodDk); line(c, [[-100, o + 12], [0, o - 10], [100, o + 14]], 3, "#a8723f"); } });
  ring(2, () => { c.fillStyle = "#fff3d6"; c.fillRect(-100, -100, 200, 200); [[-40, -30], [40, -20], [-5, 40]].forEach(([u, v], j) => { ball(c, u, v, 24, j === 1 ? PRO : "#8a8f98", j === 1 ? PROD : "#5d626b", 4); ball(c, u + 30, v + 22, 14, WHITE, "#c9d1dc", 3); }); });
  ring(3, () => { c.fillStyle = "#2b2340"; c.fillRect(-100, -100, 200, 200); fuzz(c, 0, 0, 86); });
  ring(4, () => { c.fillStyle = "#2b2340"; c.fillRect(-100, -100, 200, 200); fuzz(c, 0, 0, 44, "255,255,255", 1); ball(c, 0, 0, 12, WHITE, "#ffe9a8", 3); });
  arrow(c, [[190 + R + 14, 300], [540 - R - 14, 300]], RED, 10); arrow(c, [[540 + R + 14, 300], [890 - R - 14, 300]], RED, 10);
  arrow(c, [[820, 450], [760, 580]], RED, 10); arrow(c, [[365 + R + 14, 740], [715 - R - 14, 740]], RED, 10);
};

// ---- e1: a strip of paper halved again and again
const scissors = (c: Ctx, x: number, y: number, s: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  for (const k of [-1, 1]) {
    shape(c, () => polyP(c, [[0, 0], [150, k * 14], [150, k * 4]]), COL.steel, 5);
    line(c, [[0, 0], [-34, k * 26]], 14, INK); line(c, [[0, 0], [-34, k * 26]], 7, COL.orange);
    shape(c, () => ell(c, -58, k * 34, 30, 20, k * 0.5), COL.orange, 7);
    shape(c, () => ell(c, -58, k * 34, 14, 8, k * 0.5), "#efe4cf", 4);
  }
  c.beginPath(); c.arc(8, 0, 9, 0, Math.PI * 2); c.fillStyle = COL.steelDk; c.fill(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  c.restore();
};
const strip = (c: Ctx, x: number, y: number, w: number, h = 54) => {
  shadow(c, x + w / 2 + 10, y + h + 10, w / 2, 12);
  shape(c, () => rrect(c, x, y, w, h, 4), COL.paper, 6);
};
const e1 = (c: Ctx) => {
  ground(c);
  strip(c, 110, 190, 860); write(c, "24 cm", 110, 112, 54, INK, 6);
  strip(c, 110, 400, 430); write(c, "12", 110, 322, 54, INK, 6);
  strip(c, 110, 610, 215); write(c, "6", 110, 532, 54, INK, 6);
  strip(c, 110, 820, 107); write(c, "3", 110, 742, 54, INK, 6);
  arrow(c, [[1010, 250], [1010, 380]], RED, 10);
  arrow(c, [[640, 440], [640, 570]], RED, 10);
  arrow(c, [[420, 650], [420, 780]], RED, 10);
  scissors(c, 790, 520, 1.5, -0.15);
};

// ---- e2: marbles rolled at a hidden thing under a raised card
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => polyP(c, [[x - w / 2, y - h], [x + w / 2, y - h], [x + w * 0.4, y], [x - w * 0.4, y]]), COL.steel, 6);
  shade(c, () => polyP(c, [[x - w / 2, y - h], [x + w / 2, y - h], [x + w * 0.4, y], [x - w * 0.4, y]]), COL.steelDk, w * 0.2, 0);
  shape(c, () => ell(c, x, y - h, w / 2, 14), COL.steelIn, 5);
};
const marble = (c: Ctx, x: number, y: number, r: number, col: string = COL.blue) => {
  ball(c, x, y, r, col, COL.blueDk, 5);
};
const e2 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 900, 450, 50);
  const cardTop = [[190, 470], [740, 440], [930, 600], [330, 640]];
  tumbler(c, 330, 880, 150, 250); tumbler(c, 800, 850, 150, 230);
  // a hidden battery under the card, drawn faint through the card edge
  shape(c, () => rrect(c, 520, 660, 90, 160, 12), "#c9d1dc", 5);
  shape(c, () => polyP(c, cardTop), COL.brown, 7);
  shade(c, () => polyP(c, cardTop), COL.soilDk, 0, 30, 0.35);
  shape(c, () => polyP(c, [[330, 640], [930, 600], [930, 630], [330, 672]]), COL.soilDk, 6);
  tumbler(c, 215, 740, 150, 250); tumbler(c, 900, 720, 150, 230);
  // card redrawn over the back tumblers
  shape(c, () => polyP(c, cardTop), COL.brown, 7);
  // marble rolling in, bouncing off
  marble(c, 260, 530, 28);
  arrow(c, [[320, 540], [470, 548], [600, 545]], RED, 9);
  marble(c, 640, 540, 20, COL.blueDk);
  arrow(c, [[640, 505], [690, 430]], RED, 9);
  marble(c, 520, 580, 22, COL.yellow);
};

// ---- e3: colour spreading in cold and hot water
const e3 = (c: Ctx) => {
  ground(c);
  table(c, 800);
  const gl = (x: number, hot: boolean) => {
    glass(c, x, 800, 300, 420, 0.8, hot ? "#b9dcf5" : COL.water);
    c.save(); c.beginPath(); c.moveTo(x - 140, 800 - 336); c.lineTo(x + 140, 800 - 336); c.lineTo(x + 120, 800); c.lineTo(x - 120, 800); c.closePath(); c.clip();
    if (hot) { fuzz(c, x, 620, 150, "230,60,70", 0.85); fuzz(c, x - 40, 700, 120, "230,60,70", 0.6); fuzz(c, x + 40, 480, 100, "230,60,70", 0.5); }
    else { fuzz(c, x, 780, 70, "230,60,70", 1); shape(c, () => ell(c, x, 770, 30, 22), "#d7372b", 4); }
    c.restore();
  };
  gl(300, false); gl(780, true);
  for (let k = 0; k < 3; k++) { const x = 720 + k * 60; line(c, [[x, 360], [x - 18, 310], [x + 18, 270], [x, 220]], 7, "#b9b4ab"); }
};

// ---- a1: pencil dots making a cloud round a bindi
const a1 = (c: Ctx) => {
  ground(c);
  paperSheet(c, 130, 150, 820, 780);
  const r = rnd(21), cx = 540, cy = 540;
  for (let i = 0; i < 130; i++) { const a = r() * 6.283, d = Math.abs((r() + r() + r() - 1.5)) * 520 * (0.35 + r() * 0.65); const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * 0.95; if (x > 160 && x < 920 && y > 180 && y < 900) { c.beginPath(); c.arc(x, y, 7, 0, 6.283); c.fillStyle = INK; c.fill(); } }
  shape(c, () => ell(c, cx, cy, 20, 20), RED, 5);
  pencil(c, 840, 930, -2.4, 340);
};

// ---- a2: a mustard seed in the middle of a big field, a far edge marked
const a2 = (c: Ctx) => {
  ground(c, "#cfe8b0");
  c.beginPath(); ell(c, 540, 560, 470, 330); c.fillStyle = COL.greenLt; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  c.setLineDash([22, 18]); c.beginPath(); ell(c, 540, 560, 400, 270); c.lineWidth = 7; c.strokeStyle = WHITE; c.stroke(); c.setLineDash([]);
  shadow(c, 546, 566, 30, 10);
  shape(c, () => ell(c, 540, 560, 16, 16), "#e8b923", 5);
  shape(c, () => ell(c, 540, 560, 16, 16), "#e8b923", 5);
  // magnified seed
  shape(c, () => ell(c, 540, 220, 110, 110), "rgba(255,250,240,0.95)", 7);
  shape(c, () => ell(c, 540, 220, 60, 60), "#e8b923", 7); shade(c, () => ell(c, 540, 220, 60, 60), "#b98d12", 20, 20);
  c.beginPath(); ell(c, 540, 220, 60, 60); c.lineWidth = 7; c.strokeStyle = INK; c.stroke(); shine(c, [[505, 190], [525, 175]], 9);
  line(c, [[520, 328], [540, 548]], 4); 
  // the child far away at the edge, marker cloth
  person(c, 160, 840, 260, {});
  shape(c, () => polyP(c, [[250, 640], [320, 625], [310, 690], [250, 700]]), COL.pink, 5);
  arrow(c, [[190, 700], [90, 650]], RED, 8);
  arrow(c, [[320, 770], [480, 640]], RED, 9);
};

// ---- a3: a picture made of dots
const a3 = (c: Ctx) => {
  ground(c);
  paperSheet(c, 130, 130, 820, 820);
  const cx = 540, cy = 540;
  for (let gy = 0; gy < 14; gy++) for (let gx = 0; gx < 14; gx++) {
    const x = 195 + gx * 55, y = 195 + gy * 55, dx = x - cx, dy = y - cy; const d = Math.hypot(dx, dy);
    let v = d < 330 ? 0.25 : 0; // the face disc
    if (d < 330) v = 0.28;
    const eyeL = Math.hypot(x - 430, y - 450) < 60, eyeR = Math.hypot(x - 650, y - 450) < 60;
    const smile = Math.abs(Math.hypot(dx, dy - 20) - 190) < 30 && dy > 70;
    if (eyeL || eyeR || smile) v = 1; else if (d >= 330) v = 0;
    if (v > 0) { c.beginPath(); c.arc(x, y, 6 + v * 13, 0, 6.283); c.fillStyle = v === 1 ? INK : COL.orange; c.fill(); }
  }
  pencil(c, 960, 960, -2.5, 280);
};

// ---- a4: two magnets, same ends, pushing apart
const barMagnet = (c: Ctx, x: number, y: number, w: number, h: number, redLeft: boolean) => {
  shape(c, () => rrect(c, x, y, w / 2, h, 8), redLeft ? RED : COL.blue);
  shape(c, () => rrect(c, x + w / 2, y, w / 2, h, 8), redLeft ? COL.blue : RED);
  shade(c, () => rrect(c, x, y, w, h, 8), INK, 0, h * 0.6, 0.12);
};
const a4 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 700, 450, 40);
  barMagnet(c, 90, 400, 360, 130, true);
  barMagnet(c, 630, 400, 360, 130, false);
  arrow(c, [[470, 300], [330, 300]], RED, 12);
  arrow(c, [[610, 300], [750, 300]], RED, 12);
  // little lines showing the push in the gap
  for (let k = -2; k <= 2; k++) line(c, [[500, 465 + k * 26], [580, 465 + k * 26]], 4, COL.purple);
};

// ---- a5: smell travelling across a room
const peel = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => { c.arc(x, y, r, Math.PI, 0); c.closePath(); }, COL.orange);
  shape(c, () => { c.arc(x, y, r * 0.8, Math.PI, 0); c.closePath(); }, "#ffbf5e", 4);
  for (let k = 1; k < 6; k++) line(c, [[x, y - 4], [x + Math.cos(Math.PI + k * Math.PI / 6) * r * 0.78, y + Math.sin(Math.PI + k * Math.PI / 6) * r * 0.78]], 3, COL.orange);
};
const a5 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e4d3b3"; c.fillRect(0, 780, D, 300); line(c, [[0, 780], [D, 780]], 6);
  shadow(c, 150, 860, 90, 18); shape(c, () => ell(c, 150, 840, 90, 20), COL.steel, 5); peel(c, 150, 835, 70);
  const r = rnd(9);
  for (let i = 0; i < 26; i++) { const t = r(), x = 250 + t * 480, y = 640 - t * 40 + (r() - 0.5) * (80 + t * 260); c.beginPath(); c.arc(x, y, 9 + r() * 4, 0, 6.283); c.fillStyle = "rgba(243,154,60,0.75)"; c.fill(); c.lineWidth = 3; c.strokeStyle = INK; c.stroke(); }
  arrow(c, [[260, 520], [540, 460], [780, 470]], RED, 10);
  person(c, 900, 920, 640, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [Math.PI * 0.45, Math.PI * 0.5] });
  c.save(); c.translate(0, 0); c.restore();
};

// ---- a6: a pinch of salt on a gas flame turns it bright yellow
const a6 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 905, 380, 40);
  shape(c, () => rrect(c, 170, 760, 740, 140, 12), COL.steel); shade(c, () => rrect(c, 170, 760, 740, 140, 12), COL.steelDk, 0, 36, 0.4);
  shape(c, () => rrect(c, 440, 720, 200, 50, 10), COL.black);
  // the flame
  shape(c, () => { c.moveTo(540, 300); c.bezierCurveTo(430, 500, 440, 660, 540, 720); c.bezierCurveTo(640, 660, 650, 500, 540, 300); c.closePath(); }, COL.yellow, 6);
  shape(c, () => { c.moveTo(540, 520); c.bezierCurveTo(490, 600, 495, 680, 540, 715); c.bezierCurveTo(585, 680, 590, 600, 540, 520); c.closePath(); }, COL.blue, 4);
  for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * 0.4; line(c, [[540 + Math.cos(a) * 190, 460 + Math.sin(a) * 190 + 20], [540 + Math.cos(a) * 250, 460 + Math.sin(a) * 250 + 20]], 8, COL.orange); }
  // spoon with salt above
  line(c, [[900, 120], [640, 230]], 22, INK); line(c, [[900, 120], [640, 230]], 10, COL.steel);
  shape(c, () => ell(c, 610, 245, 56, 32, 0.4), COL.steel, 6);
  shape(c, () => ell(c, 610, 238, 38, 18, 0.4), WHITE, 3);
  const r = rnd(4); for (let i = 0; i < 5; i++) { shape(c, () => rrect(c, 595 + r() * 30, 270 + i * 22, 9, 9, 2), WHITE, 3); }
  arrow(c, [[300, 190], [380, 260]], RED, 10);
};

// ---- p1: carbon atom model: 6 red-ish + 6 white seeds in a lump on a plate, cotton wool cloud round it
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 570, 940, 420, 50);
  shape(c, () => ell(c, 540, 560, 440, 420), COL.paper, 7); shape(c, () => ell(c, 540, 560, 360, 340), "#f5ecd7", 4);
  // cotton wool cloud
  const r = rnd(33);
  for (let i = 0; i < 26; i++) { const a = r() * 6.283, d = 130 + r() * 130; const x = 540 + Math.cos(a) * d, y = 560 + Math.sin(a) * d * 0.95; c.beginPath(); c.arc(x, y, 50 + r() * 30, 0, 6.283); c.fillStyle = "rgba(255,255,255,0.88)"; c.fill(); }
  // 12 seeds: 6 tamarind (brown), 6 chana (cream)
  const pos = [[-60, -70], [30, -90], [-100, 0], [10, -20], [100, -10], [-50, 70], [50, 70], [-120, -60], [110, -90], [0, 140], [-90, 120], [100, 90]];
  pos.forEach(([u, v], i) => seed(c, 540 + u * 0.95, 560 + v * 0.95, 34, i * 0.7, false, i % 2 ? "#e9d3a4" : "#6b3f26", i % 2 ? "#c8ac74" : "#4a2a18"));
};

// ---- c1: an upside-down glass pushed into water: air keeps the tissue dry
const c1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 930, 360, 40);
  shape(c, () => polyP(c, [[200, 400], [880, 400], [820, 920], [260, 920]]), COL.glass, 6);
  shape(c, () => polyP(c, [[210, 520], [870, 520], [820, 920], [260, 920]]), COL.water, 0);
  shape(c, () => ell(c, 540, 520, 330, 28), COL.drop, 4);
  shape(c, () => polyP(c, [[200, 400], [880, 400], [820, 920], [260, 920]]), "rgba(0,0,0,0)", 6);
  // glass upside down, pushed in; air inside, dry tissue stuck at its bottom
  const gy = 330;
  shape(c, () => polyP(c, [[390, gy], [690, gy], [670, gy + 400], [410, gy + 400]]), COL.glass, 6);
  shape(c, () => polyP(c, [[400, 640], [680, 640], [672, 726], [408, 726]]), COL.water, 0);
  shape(c, () => ell(c, 540, 726, 132, 18), COL.drop, 4); // level inside is lower than outside
  shape(c, () => ell(c, 540, 365, 78, 50), COL.cloth, 5); // dry tissue
  for (let k = 0; k < 4; k++) { c.beginPath(); c.arc(470 + k * 50, 560 + (k % 2) * 30, 10, 0, 6.283); c.fillStyle = "rgba(255,255,255,0.8)"; c.fill(); c.lineWidth = 3; c.strokeStyle = INK; c.stroke(); }
  hand(c, 540, 175, Math.PI * 0.5, 0.95, SKIN.child, CLOTH.child);
  arrow(c, [[850, 260], [850, 420]], RED, 10);
};

// ---- c2: writing small with a magnifier
const c2 = (c: Ctx) => {
  ground(c);
  paperSheet(c, 110, 150, 860, 780);
  // big and small scribble rows, smaller each time
  const row = (y: number, s: number) => { for (let k = 0; k < 4; k++) { const x = 190 + k * 160 * s * 1.3; line(c, [[x, y + 40 * s], [x + 30 * s, y], [x + 60 * s, y + 40 * s], [x + 90 * s, y]], 8 * s + 1.5, INK); } };
  row(240, 1); row(380, 0.6); row(480, 0.35); row(550, 0.2);
  // the smallest: a dot
  c.beginPath(); c.arc(260, 640, 3, 0, 6.283); c.fillStyle = INK; c.fill();
  mag(c, 430, 560, 130, 0);
  line(c, [[390, 570], [420, 540], [450, 575], [480, 540], [510, 575]], 5, INK);
  pencil(c, 700, 330, 2.5, 300);
};

// ---- term 0 Matter: stone, glass of water, balloon; a shadow is not matter
const t0 = (c: Ctx) => {
  ground(c);
  table(c, 760);
  shadow(c, 200, 770, 110, 20);
  shape(c, () => { c.moveTo(100, 760); c.bezierCurveTo(90, 620, 180, 560, 260, 600); c.bezierCurveTo(320, 640, 310, 730, 290, 760); c.closePath(); }, "#a29b90");
  shade(c, () => { c.moveTo(100, 760); c.bezierCurveTo(90, 620, 180, 560, 260, 600); c.bezierCurveTo(320, 640, 310, 730, 290, 760); c.closePath(); }, "#6e675d", 40, 20);
  glass(c, 520, 760, 170, 250, 0.7);
  balloonT(c, 780, 560, 110, COL.pink, "#d9708e");
  line(c, [[780, 710], [790, 760]], 4);
  // a shadow on the ground, crossed out
  c.beginPath(); ell(c, 800, 920, 150, 24); c.fillStyle = "rgba(43,35,64,0.35)"; c.fill();
  line(c, [[700, 880], [900, 960]], 12, RED); line(c, [[900, 880], [700, 960]], 12, RED);
};

// ---- term 1 Particle: sugar stirred into water, zoom shows dots spread through
const t1 = (c: Ctx) => {
  ground(c);
  table(c, 840);
  glass(c, 300, 840, 300, 440, 0.8);
  c.save(); c.translate(300, 600); c.rotate(-0.5);
  line(c, [[0, -300], [0, 200]], 18, INK); line(c, [[0, -300], [0, 200]], 8, COL.steel);
  shape(c, () => ell(c, 0, -330, 40, 52), COL.steel, 6); c.restore();
  // zoomed circle
  shape(c, () => ell(c, 740, 470, 270, 270), "#d8ecfa", 9);
  const r = rnd(14);
  c.save(); c.beginPath(); c.arc(740, 470, 262, 0, 6.283); c.clip();
  for (let i = 0; i < 36; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * 230; c.beginPath(); c.arc(740 + Math.cos(a) * d, 470 + Math.sin(a) * d, 13, 0, 6.283); c.fillStyle = WHITE; c.fill(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke(); }
  c.restore();
  line(c, [[430, 520], [480, 500]], 5); line(c, [[440, 620], [560, 650]], 5);
};

// ---- term 2 Atom: 1 mm gap on a ruler, with a row of about five million atoms squeezed in
const t2 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 900, 440, 24);
  shape(c, () => polyP(c, [[70, 780], [1010, 780], [1010, 900], [70, 900]]), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(73, 878, 934, 19);
  for (let mm = 0; mm <= 30; mm++) { const x = 130 + mm * 28, h = mm % 10 === 0 ? 50 : mm % 5 === 0 ? 36 : 22; line(c, [[x, 780], [x, 780 + h]], mm % 10 === 0 ? 5 : 3, INK); }
  write(c, "0", 118, 838, 36, INK, 5); write(c, "1", 398, 838, 36, INK, 5);
  // the 1 mm gap between two lines
  shape(c, () => polyP(c, [[158, 770], [186, 770], [186, 790], [158, 790]]), "rgba(255,211,77,0.8)", 3);
  line(c, [[172, 765], [172, 700]], 5);
  // zoom circle with a long row of atoms
  shape(c, () => ell(c, 540, 380, 340, 340), "#2b2340", 9);
  c.save(); c.beginPath(); c.arc(540, 380, 332, 0, 6.283); c.clip();
  for (let i = 0; i < 5; i++) { fuzz(c, 290 + i * 125, 380, 100); nucleus(c, 290 + i * 125, 380, 14); }
  c.restore();
  arrow(c, [[200, 690], [270, 640]], RED, 9);
};

// ---- term 4 Molecule: water, one big ball with two smaller ones joined at an angle
const t4 = (c: Ctx) => {
  ground(c);
  const o = [540, 520], h1 = [340, 760], h2 = [740, 760];
  shadow(c, 560, 920, 360, 40);
  line(c, [o, h1], 60, INK); line(c, o && [o, h1], 40, "#e9e0cf"); line(c, [o, h2], 60, INK); line(c, [o, h2], 40, "#e9e0cf");
  ball(c, h1[0], h1[1], 90, WHITE, "#c9d1dc", 7); ball(c, h2[0], h2[1], 90, WHITE, "#c9d1dc", 7);
  ball(c, o[0], o[1], 150, PRO, PROD, 8);
  shape(c, () => ell(c, 540, 170, 1, 1), "rgba(0,0,0,0)", 0);
};

// ---- term 5 Nucleus: a huge cricket ground seen from above, a peppercorn glowing at the middle
const t5 = (c: Ctx) => {
  ground(c, "#cfe8b0");
  shape(c, () => ell(c, 540, 540, 470, 440), COL.greenLt, 8);
  c.setLineDash([22, 16]); c.beginPath(); ell(c, 540, 540, 380, 350); c.lineWidth = 6; c.strokeStyle = WHITE; c.stroke(); c.setLineDash([]);
  shape(c, () => rrect(c, 505, 400, 70, 280, 6), "#e9d3a4", 5);
  // stumps
  for (const y of [400, 676]) for (let k = -1; k <= 1; k++) line(c, [[540 + k * 14, y - 12], [540 + k * 14, y + 12]], 5, INK);
  fuzz(c, 540, 540, 80, GLOW, 0.95);
  shape(c, () => ell(c, 540, 540, 14, 14), "#3a3540", 4);
  arrow(c, [[860, 250], [650, 480]], RED, 10);
};

// ---- term 8 Electron: a fuzzy cloud around a tiny centre, the cloud itself being the electron
const t8 = (c: Ctx) => {
  c.fillStyle = "#2b2340"; c.fillRect(0, 0, D, D);
  fuzz(c, 540, 540, 420, "91,143,214", 0.95); fuzz(c, 540, 540, 260, "160,200,255", 0.55);
  nucleus(c, 540, 540, 38);
  const r = rnd(12); for (let i = 0; i < 40; i++) { const a = r() * 6.283, d = 70 + Math.sqrt(r()) * 300; c.beginPath(); c.arc(540 + Math.cos(a) * d, 540 + Math.sin(a) * d, 6, 0, 6.283); c.fillStyle = "rgba(255,255,255,0.9)"; c.fill(); }
};

// ---- term 10 Electric charge: two rubbed balloons on threads leaning away from each other
const t10 = (c: Ctx) => {
  ground(c);
  line(c, [[300, 80], [780, 80]], 10, INK);
  const bal = (x1: number, y1: number, x2: number, y2: number, col: string, dk: string) => { line(c, [[x1, y1], [x2, y2]], 4, INK); balloonT(c, x2 + (x2 - x1) * 0.28, y2 + (y2 - y1) * 0.2 + 70, 130, col, dk); };
  bal(450, 80, 330, 470, COL.pink, "#d9708e"); bal(630, 80, 750, 470, COL.pink, "#d9708e");
  write(c, "-", 290, 600, 130, INK, 12); write(c, "-", 710, 600, 130, INK, 12);
  for (const x of [240, 350]) write(c, "-", x, 740, 80, INK, 9);
  arrow(c, [[470, 560], [400, 560]], RED, 10); arrow(c, [[610, 560], [680, 560]], RED, 10);
};

// ---- term 16 Probability: dice 3 and 4, a big 7 and a small 12
const die = (c: Ctx, x: number, y: number, s: number, n: number) => {
  shadow(c, x + s * 0.55, y + s + 8, s * 0.6, s * 0.1);
  shape(c, () => rrect(c, x, y, s, s, 24), WHITE, 7);
  const p: Record<number, number[][]> = { 3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]], 4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]] };
  p[n].forEach(([u, v]) => { c.beginPath(); c.arc(x + u * s, y + v * s, s * 0.09, 0, 6.283); c.fillStyle = INK; c.fill(); });
};
const t16 = (c: Ctx) => {
  ground(c);
  die(c, 140, 200, 260, 3); die(c, 460, 230, 260, 4);
  write(c, "+", 410, 300, 90, INK, 10);
  write(c, "7", 200, 700, 260, RED, 28);
  write(c, "12", 600, 780, 100, COL.greyDk, 12);
  arrow(c, [[740, 560], [740, 690]], COL.greyDk, 8);
};

// ---- term 17 Energy level: an electron jumps down a step and gives off a spark
const t17 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 440, 36);
  for (let k = 0; k < 4; k++) {
    const x = 120 + k * 200, y = 800 - k * 180;
    shape(c, () => rrect(c, x, y, 200, 940 - y, 4), k % 2 ? "#e9d3a4" : "#f2c063", 7);
  }
  // electron on the third step, jumping down to the second
  star(c, 560, 360, 56, 8, COL.yellow);
  ball(c, 760, 330, 36, ELE, COL.blueDk, 5);
  arrow(c, [[740, 400], [650, 520], [580, 600]], RED, 10);
  ball(c, 330, 640, 36, ELE, COL.blueDk, 5);
  c.setLineDash([10, 14]); line(c, [[760, 330], [760, 340]], 3); c.setLineDash([]);
};

// ---- expl 0 Everything is made of atoms: a house, a tree and a child built from the same few bead colours
const bead = (c: Ctx, x: number, y: number, col: string, dk: string) => ball(c, x, y, 21, col, dk, 4);
const B = [[PRO, PROD], [COL.blue, COL.blueDk], [COL.yellow, COL.orange], [COL.green, COL.greenDk]];
const e_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 930, 450, 30);
  c.save(); c.translate(540, 760); c.scale(1.15, 1.15); c.translate(-540, -760);
  const bd = (x: number, y: number, k: number) => bead(c, x, y, B[k % 4][0], B[k % 4][1]);
  // house: 4 x 3 block + roof
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) bd(100 + i * 44, 780 - j * 44, i + j);
  for (let i = 0; i < 3; i++) bd(122 + i * 44, 648 - 0, i + 1); for (let i = 0; i < 2; i++) bd(144 + i * 44, 604, i);
  bd(166, 560, 2);
  // tree
  for (let j = 0; j < 4; j++) { bead(c, 520, 800 - j * 44, "#a8723f", "#6a4128"); }
  const can = [[520, 560], [476, 560], [564, 560], [498, 516], [542, 516], [454, 604], [586, 604], [476, 604], [564, 604], [520, 604], [498, 472], [542, 472], [520, 428]];
  can.forEach(([x, y], i) => bead(c, x, y, i % 3 ? COL.green : COL.yellow, i % 3 ? COL.greenDk : COL.orange));
  // child
  const sk = [830, 400];
  for (let a = 0; a < 7; a++) { const p = [[sk[0], sk[1]], [sk[0] - 36, sk[1] + 18], [sk[0] + 36, sk[1] + 18], [sk[0], sk[1] + 40], [sk[0] - 18, sk[1] - 30], [sk[0] + 18, sk[1] - 30], [sk[0], sk[1] - 54]][a]; bd(p[0], p[1] + 70, a); }
  for (let j = 0; j < 4; j++) { bd(812, 600 + j * 44, j); bd(850, 600 + j * 44, j + 1); }
  for (let j = 0; j < 3; j++) { bd(750 - j * 5, 520 + j * 36, j); bd(910 + j * 5, 520 + j * 36, j + 2); }
  c.restore();
};

// ---- expl 4 What an atom is made of: electron cloud, a centre of protons and neutrons, one opened to show three quarks
const e_4 = (c: Ctx) => {
  c.fillStyle = "#2b2340"; c.fillRect(0, 0, D, D);
  fuzz(c, 330, 430, 300, "91,143,214", 0.9);
  nucleus(c, 330, 430, 70);
  shape(c, () => ell(c, 760, 700, 250, 250), "#fff3d6", 9);
  ball(c, 760, 700, 150, PRO, PROD, 8);
  [[730, 650, "#ffd34d"], [800, 670, "#5b8fd6"], [760, 750, "#6aa53f"]].forEach(([x, y, col]) => ball(c, x as number, y as number, 40, col as string, "#2b2340", 5));
  arrow(c, [[420, 460], [560, 580]], WHITE, 9);
};

// ---- expl 5 An atom is almost all empty space: particles fly at atoms; most pass through, one bounces back
const e_5 = (c: Ctx) => {
  ground(c, "#2b2340");
  for (let k = 0; k < 4; k++) { const y = 190 + k * 235; fuzz(c, 640, y, 150, "255,211,77", 0.5); }
  const ax = [[640, 190], [640, 425], [640, 660], [640, 895]];
  ax.forEach(([x, y]) => nucleus(c, x, y, 12));
  const dot = (x: number, y: number) => ball(c, x, y, 20, "#ffd34d", "#e08a1e", 4);
  arrow(c, [[60, 190], [900, 190]], WHITE, 8); dot(90, 190);
  arrow(c, [[60, 295], [900, 295]], WHITE, 8); dot(90, 295);
  arrow(c, [[60, 425], [570, 425]], RED, 10); dot(90, 425);
  arrow(c, [[570, 440], [360, 560]], RED, 10);
  arrow(c, [[60, 760], [900, 760]], WHITE, 8); dot(90, 760);
  arrow(c, [[60, 940], [900, 940]], WHITE, 8); dot(90, 940);
};

// ---- expl 6 Why things feel solid: a hand on a table, zoom shows clouds pushing on each other, a thin gap
const e_6 = (c: Ctx) => {
  ground(c);
  table(c, 700);
  hand(c, 130, 630, 0.05, 1.6, SKIN.child, CLOTH.child, true);
  shape(c, () => ell(c, 760, 380, 290, 290), "#2b2340", 9);
  c.save(); c.beginPath(); c.arc(760, 380, 282, 0, 6.283); c.clip();
  fuzz(c, 760, 150, 190, "255,150,120", 0.95); fuzz(c, 760, 610, 190, "91,170,214", 0.95);
  nucleus(c, 760, 90, 24); nucleus(c, 760, 670, 24);
  c.restore();
  arrow(c, [[540, 210], [600, 300]], WHITE, 9); arrow(c, [[980, 560], [920, 470]], WHITE, 9);
  line(c, [[610, 380], [910, 380]], 4, "#fff3d6");
};

// ---- expl 7 Electrons are clouds, not tracks: old planet picture crossed out, cloud ticked
const e_7 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 160, 480, 760, 24), "#fff3d6", 6);
  shape(c, () => rrect(c, 560, 160, 480, 760, 24), "#2b2340", 6);
  // planet atom
  nucleus(c, 280, 540, 24);
  c.beginPath(); ell(c, 280, 540, 170, 70, 0.5); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  c.beginPath(); ell(c, 280, 540, 170, 70, -0.5); c.stroke();
  c.beginPath(); ell(c, 280, 540, 70, 170, 0.2); c.stroke();
  ball(c, 410, 480, 17, ELE, COL.blueDk, 4); ball(c, 175, 590, 17, ELE, COL.blueDk, 4); ball(c, 300, 372, 17, ELE, COL.blueDk, 4);
  line(c, [[110, 250], [450, 830]], 18, RED); line(c, [[450, 250], [110, 830]], 18, RED);
  // cloud atom
  fuzz(c, 800, 540, 230, "91,143,214", 0.95); nucleus(c, 800, 540, 26);
  line(c, [[640, 260], [690, 320], [800, 200]], 20, "#6aa53f");
  line(c, [[640, 260], [690, 320], [800, 200]], 8, "#9ccf62");
};

// ---- expl 12 Your atoms are old: a child breathes out, the breath curls up to a faraway exploding star
const e_12 = (c: Ctx) => {
  c.fillStyle = "#2b2340"; c.fillRect(0, 0, D, D);
  const r = rnd(2); for (let i = 0; i < 40; i++) { c.beginPath(); c.arc(r() * D, r() * 700, 3, 0, 6.283); c.fillStyle = "rgba(255,255,255,0.8)"; c.fill(); }
  fuzz(c, 820, 230, 220, "255,150,60", 0.9);
  star(c, 820, 230, 140, 12, COL.yellow); star(c, 820, 230, 70, 12, WHITE);
  c.fillStyle = "#4d6b3d"; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 6);
  person(c, 200, 1000, 640, {});
  for (let i = 0; i < 8; i++) { const t = i / 7; c.beginPath(); c.arc(330 + t * 340 + Math.sin(t * 6) * 28, 440 - t * 190, 14 + t * 8, 0, 6.283); c.fillStyle = "rgba(220,236,250,0.9)"; c.fill(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke(); }
  arrow(c, [[640, 250], [700, 230]], RED, 9);
};

// ---- expl 14 Is there a smallest thing: a pond with ripples, glowing dots where they peak
const e_14 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 540, 470, 330), COL.water, 8);
  for (let k = 1; k <= 4; k++) { c.beginPath(); ell(c, 540, 540, k * 100, k * 66); c.lineWidth = 6; c.strokeStyle = "#e9f3ff"; c.stroke(); }
  for (let k = 1; k <= 4; k++) for (let a = 0; a < 6 + k * 2; a++) { const t = (a / (6 + k * 2)) * 6.283; if (k % 2 === 0) { fuzz(c, 540 + Math.cos(t) * k * 100, 540 + Math.sin(t) * k * 66, 22, GLOW, 1); } }
  shape(c, () => ell(c, 540, 540, 16, 11), WHITE, 4);
};

export const ic_theVerySmallAtomsL3 = cards("sci.the-very-small.atoms.L3 cards", [
  intro, cover, e1, e2, e3, a1, a2, a3, a4, a5, a6, p1, c1, c2,
  t0, t1, t2, t4, t5, t8, t10, t16, t17,
  e_0, e_4, e_5, e_6, e_7, e_12, e_14,
]);
