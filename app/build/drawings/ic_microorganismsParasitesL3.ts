import type { Ctx } from "./core";
import { D, INK, BG, SH, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, seed, hand, person, write, cards, rnd } from "./flatKit";

// ---------------------------------------------------------------- shared pieces
const LOUSE = "#d8c9a4", LOUSEDK = "#a8946b";
// a head louse seen from above, head to the left, six legs; (x, y) is the middle
const louse = (c: Ctx, x: number, y: number, s: number, a = 0) => {
  c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s);
  for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) {
    const bx = -70 + k * 28, pts = [[bx, sd * 14], [bx + 14 + k * 6, sd * 52], [bx + (k - 1) * 22, sd * 84]];
    line(c, pts, 13, INK); line(c, pts, 6, LOUSEDK);
    const e = pts[2]; line(c, [e, [e[0] + 14, e[1] - sd * 14]], 12, INK); line(c, [e, [e[0] + 14, e[1] - sd * 14]], 5, LOUSEDK);
  }
  shape(c, () => ell(c, 28, 0, 72, 44), LOUSE, 6);
  shade(c, () => ell(c, 28, 0, 72, 44), LOUSEDK, 12, 14);
  for (let k = 0; k < 4; k++) line(c, [[-10 + k * 26, -36 + Math.abs(k - 1.5) * 8], [-10 + k * 26, 36 - Math.abs(k - 1.5) * 8]], 3, LOUSEDK);
  shape(c, () => ell(c, -50, 0, 28, 28), LOUSE, 6);
  shape(c, () => ell(c, -92, 0, 22, 20), LOUSE, 6);
  line(c, [[-104, -14], [-130, -34]], 5); line(c, [[-104, 14], [-130, 34]], 5);
  shape(c, () => ell(c, -100, -5, 4, 4), INK, 0);
  c.restore();
};
// a female mosquito seen from the side, head to the right, long mouthpart; fed = body red
const mosq = (c: Ctx, x: number, y: number, s: number, a = 0, fed = false) => {
  c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s);
  for (let k = 0; k < 6; k++) {
    const bx = -10 + (k % 3) * 30, d = [1.4, 0.6, -0.4, 1.0, 0.1, -0.9][k], pts = [[bx, 10], [bx + d * 50, 70], [bx + d * 100, 150]];
    line(c, pts, 12, INK); line(c, pts, 5, "#7a6a5c");
  }
  shape(c, () => ell(c, -10, -44, 66, 20, -0.35), "rgba(235,245,255,0.8)", 5);
  shape(c, () => ell(c, 18, -52, 60, 18, -0.15), "rgba(235,245,255,0.8)", 5);
  shape(c, () => ell(c, -70, 4, 82, 22, 0.1), fed ? COL.red : "#6b5a4a", 6);
  for (let k = 0; k < 4; k++) line(c, [[-110 + k * 26, -12 + k], [-110 + k * 26, 20 + k]], 4, fed ? "#ffd3cc" : WHITE);
  shape(c, () => ell(c, 28, 0, 34, 28), "#5a4a40", 6);
  shape(c, () => ell(c, 68, 6, 20, 18), "#5a4a40", 6);
  line(c, [[84, 12], [185, 40]], 12, INK); line(c, [[84, 12], [185, 40]], 5, "#d9c9b8");
  line(c, [[76, -8], [100, -34]], 5);
  c.restore();
};
// a flea, side view, head to the left
const flea = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const k1 = [[20, 20], [90, 30], [60, 100]], k2 = [[0, 30], [-50, 70], [-30, 110]];
  line(c, k1, 18, INK); line(c, k1, 9, "#6a3417"); line(c, k2, 14, INK); line(c, k2, 6, "#6a3417");
  line(c, [[-30, 36], [-60, 100]], 12, INK); line(c, [[-30, 36], [-60, 100]], 5, "#6a3417");
  shape(c, () => ell(c, 20, -4, 56, 48, 0.2), "#8a4a24", 6);
  shade(c, () => ell(c, 20, -4, 56, 48, 0.2), "#5a2a10", 10, 12);
  shape(c, () => ell(c, -50, -12, 24, 22), "#8a4a24", 6);
  line(c, [[-62, -30], [-80, -60]], 5);
  c.restore();
};
// a child's head, front view, centre (x, y), radius r
const head = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x - r * 0.95, y + r * 0.1, r * 0.16, r * 0.24), SKIN.child, 5);
  shape(c, () => ell(c, x + r * 0.95, y + r * 0.1, r * 0.16, r * 0.24), SKIN.child, 5);
  shape(c, () => ell(c, x, y, r, r * 1.08), SKIN.child, 6);
  shade(c, () => ell(c, x, y, r, r * 1.08), SKIN.childDk, r * 0.14, 0);
  shape(c, () => { c.moveTo(x - r * 1.03, y); c.bezierCurveTo(x - r * 1.1, y - r * 1.6, x + r * 1.1, y - r * 1.6, x + r * 1.03, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.03, y); c.closePath(); }, CLOTH.hair, 6);
  shape(c, () => ell(c, x - r * 0.36, y + r * 0.12, r * 0.09, r * 0.12), INK, 0); shape(c, () => ell(c, x + r * 0.36, y + r * 0.12, r * 0.09, r * 0.12), INK, 0);
  c.beginPath(); c.arc(x, y + r * 0.38, r * 0.3, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
};
// a round window onto a close-up
const lens = (c: Ctx, x: number, y: number, r: number, inner: () => void) => {
  c.save(); c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = WHITE; c.fill(); c.clip(); inner(); c.restore();
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 10; c.stroke();
};
// a red blood cell, round with a dip; centre (x, y)
const rbc = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.92), "#e24a4a", 6);
  shade(c, () => ell(c, x, y, r, r * 0.92), "#a82424", r * 0.18, r * 0.2);
  shape(c, () => ell(c, x - r * 0.05, y - r * 0.05, r * 0.5, r * 0.42), "#f08a80", 0);
};
// the malaria parasite, a ring with a dot, inside a cell
const ring = (c: Ctx, x: number, y: number, r: number) => {
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = r * 0.42 + 8; c.stroke();
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.strokeStyle = COL.purple; c.lineWidth = r * 0.42; c.stroke();
  shape(c, () => ell(c, x + r * 0.9, y - r * 0.5, r * 0.3, r * 0.3), COL.purple, 5);
};
// a sleeping person under a blanket, head on a pillow; head centre (x, y)
const sleeper = (c: Ctx, x: number, y: number, s: number, blanket: string = COL.blue, blanketDk: string = COL.blueDk) => {
  shadow(c, x + 60 * s, y + 90 * s, 190 * s, 22 * s);
  shape(c, () => rrect(c, x - 80 * s, y - 30 * s, 150 * s, 90 * s, 22 * s), COL.cloth, 6);
  const bl = () => rrect(c, x + 10 * s, y - 10 * s, 260 * s, 100 * s, 22 * s);
  shape(c, () => ell(c, x, y, 52 * s, 50 * s), SKIN.child, 6);
  shape(c, () => { c.moveTo(x - 52 * s, y - 4 * s); c.bezierCurveTo(x - 54 * s, y - 70 * s, x + 54 * s, y - 70 * s, x + 52 * s, y - 14 * s); c.quadraticCurveTo(x, y - 30 * s, x - 52 * s, y - 4 * s); c.closePath(); }, CLOTH.hair, 5);
  c.beginPath(); c.arc(x + 4 * s, y + 4 * s, 7 * s, 0, Math.PI); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  shape(c, bl, blanket, 6); shade(c, bl, blanketDk, 0, 36 * s);
};
const spot = (c: Ctx, x: number, y: number, r: number, col: string = RED) => { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.strokeStyle = col; c.lineWidth = 10; c.stroke(); };
// a bare / shod foot, side view, toes to the right; sole line at y
const foot = (c: Ctx, x: number, y: number, shod: boolean) => {
  shape(c, () => rrect(c, x - 20, y - 330, 90, 240, 20), SKIN.child, 6);
  shape(c, () => { c.moveTo(x - 24, y - 150); c.lineTo(x + 76, y - 150); c.quadraticCurveTo(x + 110, y - 60, x + 200, y - 50); c.quadraticCurveTo(x + 235, y - 40, x + 225, y - (shod ? 24 : 0)); c.lineTo(x - 36, y - (shod ? 24 : 0)); c.quadraticCurveTo(x - 50, y - 70, x - 24, y - 150); c.closePath(); }, SKIN.child, 6);
  shade(c, () => rrect(c, x - 20, y - 330, 90, 240, 20), SKIN.childDk, 14, 0);
  for (let k = 0; k < 4; k++) line(c, [[x + 150 + k * 17, y - 40 + k * 5], [x + 156 + k * 17, y - (shod ? 28 : 6) ]], 3, SKIN.childDk);
  if (shod) {
    shape(c, () => rrect(c, x - 50, y - 26, 300, 36, 16), COL.teal, 6);
    line(c, [[x + 20, y - 150], [x + 130, y - 52]], 22, INK); line(c, [[x + 20, y - 150], [x + 130, y - 52]], 12, COL.teal);
  }
};
const dog = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 10, 168, 190, 22);
  for (const [lx, dk] of [[110, true], [-100, false], [-60, true], [70, false]] as [number, boolean][]) shape(c, () => rrect(c, lx - 22, 40, 44, 130, 18), dk ? "#c18c4c" : "#e0a560", 6);
  shape(c, () => { c.moveTo(150, -30); c.quadraticCurveTo(230, -50, 235, -120); c.quadraticCurveTo(190, -80, 140, -10); c.closePath(); }, "#e0a560", 6);
  shape(c, () => ell(c, 10, 0, 160, 84), "#e0a560", 6); shade(c, () => ell(c, 10, 0, 160, 84), "#b9803f", 10, 22);
  shape(c, () => ell(c, -170, -66, 66, 58), "#e0a560", 6);
  shape(c, () => ell(c, -232, -42, 40, 30), "#f3cf9a", 6); shape(c, () => ell(c, -262, -52, 12, 10), INK, 0);
  shape(c, () => ell(c, -150, -108, 26, 56, -0.4), "#8d5a2b", 6);
  shape(c, () => ell(c, -190, -80, 7, 8), INK, 0);
  c.restore();
};
// a comb from above, spine at top, teeth down; (x, y) top-left
const comb = (c: Ctx, x: number, y: number, w: number, n: number, tw: number, len: number, sp: number, col: string = COL.teal, dk: string = COL.tealDk) => {
  const p = () => { const pitch = (w - tw) / (n - 1); c.moveTo(x, y); c.lineTo(x + w, y); for (let i = n - 1; i >= 0; i--) { const xi = x + i * pitch; c.lineTo(xi + tw, y + sp); c.lineTo(xi + tw, y + sp + len); c.lineTo(xi, y + sp + len); c.lineTo(xi, y + sp); } c.closePath(); };
  c.save(); c.translate(12, 14); c.beginPath(); p(); c.fillStyle = SH; c.fill(); c.restore();
  shape(c, p, col, 5);
  c.save(); c.beginPath(); p(); c.clip(); c.fillStyle = dk; c.globalAlpha = 0.5; c.fillRect(x, y + sp * 0.55, w, sp); c.restore(); c.globalAlpha = 1;
  c.beginPath(); p(); c.strokeStyle = INK; c.lineWidth = 5; c.lineJoin = "round"; c.stroke();
};

// ---------------------------------------------------------------- terms
const term0 = (c: Ctx) => {
  ground(c); shadow(c, 480, 960, 300, 24);
  shape(c, () => rrect(c, 330, 800, 300, 190, 40), CLOTH.child, 6);
  head(c, 480, 540, 270);
  lens(c, 790, 280, 230, () => {
    c.fillStyle = "#f3e6cf"; c.fillRect(560, 50, 460, 460);
    line(c, [[540, 380], [1040, 150]], 40, INK); line(c, [[540, 380], [1040, 150]], 28, CLOTH.hair);
    louse(c, 800, 270, 1.0, -0.4);
  });
};
const term1 = (c: Ctx) => {
  ground(c); dog(c, 470, 640, 1.35);
  lens(c, 780, 270, 200, () => { c.fillStyle = "#f3e6cf"; c.fillRect(580, 70, 400, 400); flea(c, 790, 280, 1.2); });
  spot(c, 500, 480, 52, RED);
  line(c, [[540, 450], [610, 330]], 8, RED);
};
const term3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 80, 840, 920, 200, 30), SKIN.child, 6); shade(c, () => rrect(c, 80, 840, 920, 200, 30), SKIN.childDk, 0, 30);
  shape(c, () => { c.moveTo(440, 850); c.bezierCurveTo(470, 600, 360, 400, 400, 80); c.lineTo(470, 80); c.bezierCurveTo(430, 400, 540, 600, 520, 850); c.closePath(); }, CLOTH.hair, 6);
  const egg = () => { c.save(); c.translate(468, 700); c.rotate(-0.12); ell(c, 0, 0, 38, 62); c.restore(); };
  shape(c, () => { c.moveTo(450, 740); c.quadraticCurveTo(480, 760, 510, 735); c.lineTo(490, 680); c.lineTo(460, 690); c.closePath(); }, "#efe3c2", 5);
  c.save(); c.translate(500, 690); c.rotate(0.15); c.scale(1.6, 1.6); shape(c, () => ell(c, 0, 0, 38, 62), "#f7ecd0", 6); shade(c, () => ell(c, 0, 0, 38, 62), "#d9c79a", 10, 12); shape(c, () => ell(c, 0, -52, 18, 10), "#d9c79a", 4); c.restore();
  void egg;
  const fl = [[740, 380], [850, 350], [930, 440], [880, 540], [770, 520], [720, 450]];
  shape(c, () => polyP(c, fl), "#ffffff", 5); line(c, [[790, 420], [850, 460]], 3, COL.grey);
};
const term8 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 20, 640, 640, 300, 20), COL.wood, 6); shape(c, () => rrect(c, 20, 540, 44, 460, 10), COL.woodDk, 6);
  sleeper(c, 190, 720, 1.5, COL.purple, "#6a4fa3");
  for (const [dx, dy] of [[-90, -110], [95, -130], [140, -50]]) { c.beginPath(); c.moveTo(190 + dx, 720 + dy); c.quadraticCurveTo(190 + dx - 14, 720 + dy + 26, 190 + dx, 720 + dy + 34); c.quadraticCurveTo(190 + dx + 14, 720 + dy + 26, 190 + dx, 720 + dy); c.fillStyle = COL.water; c.fill(); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
  lens(c, 770, 330, 230, () => { c.fillStyle = "#f6cfc4"; c.fillRect(540, 100, 460, 460); rbc(c, 700, 330, 90); rbc(c, 880, 300, 90); rbc(c, 800, 480, 80); rbc(c, 650, 190, 60); ring(c, 878, 300, 32); });
};
const term9 = (c: Ctx) => {
  ground(c);
  rbc(c, 200, 230, 100); rbc(c, 880, 760, 120); rbc(c, 840, 190, 70); rbc(c, 190, 850, 90);
  shape(c, () => ell(c, 540, 540, 340, 313), "#e24a4a", 7); shade(c, () => ell(c, 540, 540, 340, 313), "#a82424", 50, 60);
  ring(c, 540, 520, 120);
};
const term10 = (c: Ctx) => {
  ground(c);
  sleeper(c, 170, 880, 1.4); sleeper(c, 650, 880, 1.4, COL.green, COL.greenDk);
  mosq(c, 330, 330, 1.5, 0, true);
  shape(c, () => ell(c, 630, 400, 24, 24), COL.purple, 5);
  arrow(c, [[200, 760], [230, 560], [300, 470]], RED, 12);
  arrow(c, [[640, 470], [700, 600], [720, 740]], RED, 12);
};
const term11 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 60, 300, 70, 30), COL.steel, 6); shape(c, () => rrect(c, 300, 60, 70, 220, 20), COL.steel, 6);
  shape(c, () => rrect(c, 300, 270, 70, 40, 10), COL.steelDk, 6);
  for (let k = 0; k < 4; k++) line(c, [[320 + k * 10, 330 + k * 8], [326 + k * 10, 660 - k * 6]], 8, COL.water);
  c.save(); c.translate(470, 760); c.rotate(-0.12);
  shape(c, () => polyP(c, [[-170, -50], [150, -26], [190, 0], [150, 26], [-170, 50]]), COL.orange, 6); shade(c, () => polyP(c, [[-170, -50], [150, -26], [190, 0], [150, 26], [-170, 50]]), "#c9741f", 0, 22);
  shape(c, () => polyP(c, [[-170, -50], [-250, -30], [-210, 0], [-270, 10], [-170, 50]]), COL.leaf, 5);
  c.restore();
  hand(c, 130, 790, -0.12, 1.5, SKIN.child, CLOTH.child);
  lens(c, 770, 450, 230, () => { c.fillStyle = COL.drop; c.fillRect(540, 220, 460, 460); const r = rnd(5); for (let k = 0; k < 9; k++) { const x = 620 + (k % 3) * 140 + r() * 30, y = 330 + Math.floor(k / 3) * 120 + r() * 20; shape(c, () => ell(c, x, y, 32, 24, r()), "#e8d6a8", 5); } });
  arrow(c, [[640, 740], [620, 840], [600, 930]], RED, 12);
};
const term12 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 20, 800, 1040, 280, 10), COL.soil, 0); shade(c, () => rrect(c, 20, 800, 1040, 280, 10), COL.soilDk, 0, 30);
  line(c, [[20, 800], [1060, 800]], 6);
  foot(c, 120, 810, false); foot(c, 600, 810, true);
  line(c, [[110, 380], [430, 720]], 28, RED); line(c, [[430, 380], [110, 720]], 28, RED);
  c.beginPath(); c.moveTo(690, 360); c.lineTo(750, 440); c.lineTo(900, 270); c.strokeStyle = COL.green; c.lineWidth = 30; c.lineCap = "round"; c.lineJoin = "round"; c.stroke();
};
const term13 = (c: Ctx) => {
  ground(c);
  person(c, 160, 960, 760, { adult: true, armR: [0.2, -0.2] });
  shape(c, () => ell(c, 400, 400, 30, 20), WHITE, 6);
  for (let k = 0; k < 3; k++) {
    const x = 540 + k * 170;
    person(c, x, 960, 480, { armR: [0.9, -0.9] });
  }
  arrow(c, [[420, 330], [520, 400]], RED, 10);
};

// ---------------------------------------------------------------- activities and tests
const e1 = (c: Ctx) => {
  ground(c);
  comb(c, 60, 130, 420, 5, 40, 240, 50);
  comb(c, 600, 130, 420, 24, 9, 240, 50, COL.steel, COL.steelDk);
  const r = rnd(3);
  for (let k = 0; k < 4; k++) seed(c, 105 + k * 93 + (k % 2) * 4, 270 + r() * 70, 12, r() * 3, false, "#f5ecd0", "#d6c79a");
  for (let k = 0; k < 4; k++) seed(c, 130 + k * 93, 560 + r() * 60, 12, r() * 3, false, "#f5ecd0", "#d6c79a");
  for (let k = 0; k < 14; k++) seed(c, 630 + k * 30 + r() * 4, 460 + r() * 30, 12, r() * 3, false, "#f5ecd0", "#d6c79a");
  for (let k = 0; k < 6; k++) seed(c, 710 + k * 40, 500 + (k % 2) * 25, 12, r() * 3, false, "#f5ecd0", "#d6c79a");
  arrow(c, [[270, 70], [270, 110]], RED, 12); arrow(c, [[810, 70], [810, 110]], RED, 12);
  arrow(c, [[300, 640], [300, 790]], RED, 10);
  line(c, [[540, 130], [540, 1000]], 5, COL.grey);
};
const flag = (c: Ctx, x: number, y: number, pts: number[][]) => {
  shape(c, () => rrect(c, x - 8, y, 16, 230, 6), COL.yellow, 5);
  line(c, pts, 28, "#f8c4d4"); line(c, pts, 28, INK); line(c, pts, 20, "#f8c4d4");
};
const e2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#f4e9d2"; c.fillRect(0, 0, D, 140); line(c, [[0, 140], [D, 140]], 6);
  line(c, [[540, 140], [540, 220]], 14);
  for (const a of [-0.5, 0.5, 2.6, 3.7]) { c.save(); c.translate(540, 230); c.rotate(a); shape(c, () => rrect(c, 20, -22, 240, 44, 20), COL.teal, 6); c.restore(); }
  shape(c, () => ell(c, 540, 230, 44, 30), COL.tealDk, 6);
  for (const dx of [-90, 0, 90]) arrow(c, [[540 + dx * 2.2, 320], [540 + dx * 2.2, 430]], RED, 10);
  flag(c, 390, 560, [[390, 560], [260, 590], [150, 640]]);
  flag(c, 150, 760, [[150, 760], [150, 890]]);
  c.fillStyle = "#e6d6b8"; c.fillRect(0, 960, D, 120); line(c, [[0, 960], [D, 960]], 6);
  line(c, [[20, 140], [20, 960]], 8); line(c, [[1060, 140], [1060, 960]], 8);
  mosq(c, 860, 760, 0.8, 0);
};
const a1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 380, 960, 300, 14), COL.paper, 6);
  const ry = 760;
  shape(c, () => rrect(c, 60, ry, 960, 100, 8), COL.wood, 6);
  for (let k = 0; k <= 24; k++) line(c, [[90 + k * 38, ry], [90 + k * 38, ry + (k % 5 === 0 ? 46 : 24)]], k % 5 === 0 ? 5 : 3);
  seed(c, 140, 530, 14, 0.4, false, "#f2e6c0", "#d4c28a");
  seed(c, 270, 530, 19, 0.2, false, "#3a3540", "#1d1a26");
  seed(c, 420, 530, 28, 0.3, false, "#efe3b8", "#c9b878");
  shape(c, () => ell(c, 610, 530, 46, 28, 0.2), "#efe3b8", 6);
  c.save(); c.translate(850, 530); shape(c, () => ell(c, 0, 0, 90, 34), "#fffaf0", 6); shade(c, () => ell(c, 0, 0, 90, 34), "#e1d6bd", 8, 10); c.restore();
  louse(c, 540, 200, 0.75, 0.0);
  arrow(c, [[120, 330], [320, 330], [520, 330]], RED, 10);
};
const a2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 780, 300, 80, 14), COL.orange, 6);
  sleeper(c, 140, 740, 0.9);
  shape(c, () => rrect(c, 700, 790, 330, 100, 24), COL.cloth, 6);
  shape(c, () => rrect(c, 760, 740, 270, 130, 30), COL.green, 6);
  shadow(c, 880, 900, 190, 20);
  person(c, 540, 840, 560, { armL: [0.5, -0.4], armR: [0.5, -0.4] });
  shape(c, () => ell(c, 600, 480, 38, 38), RED, 6);
  shine(c, [[586, 462], [596, 456]], 8);
  arrow(c, [[250, 700], [300, 600]], RED, 12); arrow(c, [[780, 600], [850, 690]], RED, 12);
};
const a4 = (c: Ctx) => {
  ground(c);
  const net = () => { c.moveTo(130, 120); c.lineTo(950, 120); c.lineTo(1000, 900); c.lineTo(80, 900); c.closePath(); };
  shape(c, net, "rgba(255,255,255,0.7)", 7);
  c.save(); c.beginPath(); net(); c.clip();
  for (let x = 60; x < 1040; x += 24) line(c, [[x, 100], [x, 920]], 1.6, COL.grey);
  for (let y = 100; y < 930; y += 24) line(c, [[60, y], [1040, y]], 1.6, COL.grey);
  shape(c, () => ell(c, 640, 520, 90, 70, 0.3), BG, 5);
  c.restore();
  spot(c, 640, 520, 125, RED);
  line(c, [[130, 120], [950, 120]], 12);
  hand(c, 220, 700, -0.5, 1.2, SKIN.child, CLOTH.child);
  shape(c, () => polyP(c, [[330, 560], [450, 520], [470, 590], [350, 640]]), COL.steel, 6);
  shape(c, () => polyP(c, [[455, 524], [520, 500], [540, 600], [470, 590]]), COL.yellow, 5);
};
const a5 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6d6b8"; c.fillRect(0, 860, D, 220); line(c, [[0, 860], [D, 860]], 6);
  shape(c, () => rrect(c, 160, 380, 660, 480, 10), "#f6d9a8", 7);
  shape(c, () => polyP(c, [[120, 390], [490, 150], [860, 390]]), COL.red, 7);
  shape(c, () => rrect(c, 230, 480, 190, 170, 8), COL.sky, 6); line(c, [[325, 480], [325, 650]], 6); line(c, [[230, 565], [420, 565]], 6);
  shape(c, () => rrect(c, 560, 510, 160, 350, 10), COL.wood, 6); shape(c, () => ell(c, 690, 700, 12, 12), INK, 0);
  line(c, [[570, 850], [710, 850]], 10, "#f4e9d2");
  shape(c, () => rrect(c, 840, 700, 150, 160, 16), COL.blue, 6); shape(c, () => ell(c, 915, 700, 75, 18), COL.water, 5);
  mosq(c, 120, 600, 0.55, 0);
  arrow(c, [[170, 560], [215, 545]], RED, 10);
};
const p1 = (c: Ctx) => {
  ground(c); shadow(c, 540, 930, 470, 28);
  shape(c, () => polyP(c, [[70, 220], [530, 250], [530, 880], [70, 850]]), COL.paper, 6);
  shape(c, () => polyP(c, [[550, 250], [1010, 220], [1010, 850], [550, 880]]), COL.paper, 6);
  line(c, [[540, 250], [540, 880]], 8);
  louse(c, 300, 470, 0.9, 0.05);
  mosq(c, 740, 500, 0.9, 0.1);
  for (let k = 0; k < 3; k++) { line(c, [[130, 720 + k * 36], [470, 740 + k * 36]], 5, COL.grey); line(c, [[600, 740 + k * 36], [940, 720 + k * 36]], 5, COL.grey); }
  c.save(); c.translate(780, 120); c.rotate(0.35); shape(c, () => rrect(c, 0, 0, 240, 40, 10), COL.yellow, 5); shape(c, () => polyP(c, [[240, 0], [290, 20], [240, 40]]), COL.wood, 5); c.restore();
};
const c1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 120, 150, 90, 780, 24), COL.wood, 6);
  for (let k = 0; k < 18; k++) shape(c, () => rrect(c, 200, 170 + k * 42, 190, 16, 8), COL.steel, 4);
  const r = rnd(9);
  for (let k = 0; k < 22; k++) seed(c, 430 + r() * 90, 190 + r() * 700, 14, r() * 3, false, "#f5ecd0", "#d6c79a");
  line(c, [[900, 120], [900, 960]], 8, RED); for (let k = 0; k < 10; k++) shape(c, () => rrect(c, 900 + (k % 2) * 40 - 40, 120 + k * 84, 40, 42, 0), k % 2 ? INK : WHITE, 0);
  arrow(c, [[170, 100], [520, 100], [800, 100]], RED, 12);
};
const c2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6d6b8"; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 6);
  shape(c, () => rrect(c, 100, 560, 340, 320, 30), COL.blue, 6); shape(c, () => ell(c, 270, 560, 170, 30), COL.water, 6);
  for (const [x, y] of [[210, 580], [290, 590], [350, 575]]) { line(c, [[x, y], [x + 18, y + 10], [x + 36, y]], 7, INK); shape(c, () => ell(c, x, y, 9, 9), COL.red, 3); }
  mosq(c, 340, 330, 0.7, 0.2);
  shape(c, () => { c.moveTo(600, 880); c.bezierCurveTo(560, 700, 600, 560, 680, 560); c.lineTo(860, 560); c.bezierCurveTo(940, 560, 980, 700, 940, 880); c.closePath(); }, COL.soil, 6);
  shape(c, () => ell(c, 770, 560, 100, 28), COL.cloth, 6);
  shape(c, () => rrect(c, 664, 560, 212, 50, 20), COL.cloth, 6);
  line(c, [[672, 610], [868, 610]], 10, COL.red);
  mosq(c, 860, 300, 0.7, 0.2);
  arrow(c, [[960, 340], [1010, 250]], RED, 10);
};
const expl2 = (c: Ctx) => {
  ground(c);
  head(c, 420, 620, 280);
  c.save(); c.translate(470, 360); c.rotate(0.1); comb(c, -160, -30, 320, 22, 8, 150, 40, COL.steel, COL.steelDk); c.restore();
  arrow(c, [[300, 180], [430, 230]], RED, 10);
  lens(c, 830, 760, 200, () => { c.fillStyle = "#f3e6cf"; c.fillRect(630, 560, 400, 400); for (let k = 0; k < 8; k++) line(c, [[650 + k * 50, 600], [650 + k * 50, 940]], 14, INK); louse(c, 830, 700, 0.5, 0.0); });
};
const expl7 = (c: Ctx) => {
  ground(c);
  person(c, 260, 1000, 620, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [Math.PI * 0.45, Math.PI * 0.5] });
  shape(c, () => ell(c, 258, 560, 26, 26), COL.purple, 5);
  mosq(c, 700, 600, 1.1, 0, false);
  shape(c, () => ell(c, 640, 600, 20, 20), COL.purple, 5);
  arrow(c, [[310, 420], [450, 300], [620, 300], [700, 420]], RED, 12);
  arrow(c, [[740, 820], [620, 920], [440, 900], [360, 840]], RED, 12);
};
const expl8 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6d6b8"; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 6);
  const net = () => { c.moveTo(70, 200); c.lineTo(330, 200); c.lineTo(350, 840); c.lineTo(50, 840); c.closePath(); };
  shape(c, net, "rgba(255,255,255,0.7)", 6);
  c.save(); c.beginPath(); net(); c.clip(); for (let x = 40; x < 360; x += 18) line(c, [[x, 190], [x, 850]], 1.5, COL.grey); for (let y = 190; y < 850; y += 18) line(c, [[40, y], [360, y]], 1.5, COL.grey); c.restore();
  line(c, [[70, 200], [330, 200]], 12);
  shape(c, () => rrect(c, 410, 560, 240, 240, 26), COL.blue, 6); shape(c, () => rrect(c, 395, 520, 270, 60, 16), COL.cloth, 6);
  foot(c, 720, 840, true);
};
export const ic_microorganismsParasitesL3 = cards("sci.microorganisms.parasites.L3 cards", [
  term0, term1, term3, term8, term9, term10, term11, term12, term13, e1, e2, a1, a2, a4, a5, p1, c1, c2, expl2, expl7, expl8,
]);
