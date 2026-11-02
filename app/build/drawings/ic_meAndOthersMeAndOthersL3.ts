import type { Ctx } from "./core";
import { cards, COL, INK, BG, WHITE, RED, SKIN, CLOTH, D, shape, ell, rrect, polyP, shadow, shade, line, shine, arrow, person, glass, write } from "./flatKit";

const WALL = "#cfe6df";
const TABLE = COL.wood;
const GREY = "#8b8696";
const arc = (c: Ctx, x0: number, y0: number, mx: number, my: number, x1: number, y1: number, w = 10) => { const p: number[][] = []; for (let i = 0; i <= 14; i++) { const t = i / 14; p.push([(1 - t) * (1 - t) * x0 + 2 * t * (1 - t) * mx + t * t * x1, (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * my + t * t * y1]); } arrow(c, p, RED, w); };
const dash = (c: Ctx, pts: number[][], w = 7, col = GREY) => { c.save(); c.setLineDash([18, 16]); line(c, pts, w, col); c.restore(); };
const flip = (c: Ctx, x: number, fn: () => void) => { c.save(); c.translate(x, 0); c.scale(-1, 1); c.translate(-x, 0); fn(); c.restore(); };
const wall = (c: Ctx, y: number) => { c.fillStyle = WALL; c.fillRect(0, 0, D, D); c.fillStyle = TABLE; c.fillRect(0, y, D, D - y); c.fillStyle = COL.woodDk; c.fillRect(0, y, D, 14); line(c, [[0, y], [D, y]], 6); };
const plain = (c: Ctx, col = BG) => { c.fillStyle = col; c.fillRect(0, 0, D, D); };

// ---- objects
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.15, y + 6, w * 0.62, w * 0.12);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
  shape(c, body, COL.steel, 6); shade(c, body, COL.steelDk, w * 0.3, 0);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.09), COL.steelIn, 5);
  shine(c, [[x - w * 0.3, y - h * 0.85], [x - w * 0.24, y - h * 0.15]], 9);
};
const lime = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.2, y + 4, r * 0.9, r * 0.16);
  const b = () => ell(c, x, y - r, r * 1.05, r);
  shape(c, b, COL.green, 6); shade(c, b, COL.greenDk, r * 0.3, r * 0.2);
  shine(c, [[x - r * 0.6, y - r * 1.5], [x - r * 0.3, y - r * 1.8]], 8);
};
const banana = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 0.55, r * 0.95, r * 0.14);
  const b = () => { c.moveTo(x - r, y - r * 0.35); c.quadraticCurveTo(x, y + r * 1.0, x + r, y - r * 0.4); c.quadraticCurveTo(x, y + r * 0.05, x - r, y - r * 0.35); c.closePath(); };
  shape(c, b, COL.yellow, 6); shade(c, b, COL.orange, 0, r * 0.12, 0.45);
  shape(c, () => ell(c, x - r, y - r * 0.38, r * 0.06, r * 0.06), COL.soilDk, 4); shape(c, () => ell(c, x + r, y - r * 0.42, r * 0.07, r * 0.07), COL.soilDk, 4);
};
// a table seen from the side: top slab and two legs
const tableSide = (c: Ctx, x0: number, x1: number, y: number, floor: number) => {
  for (const lx of [x0 + 40, x1 - 60]) shape(c, () => rrect(c, lx, y, 24, floor - y, 6), COL.woodDk, 6);
  shape(c, () => rrect(c, x0, y - 4, x1 - x0, 42, 10), COL.wood, 6);
};
const bubble = (c: Ctx, x: number, y: number, rx: number, ry: number, tx: number, ty: number) => {
  const dx = tx - x, dy = ty - y, l = Math.hypot(dx, dy);
  shape(c, () => ell(c, x + (dx / l) * (ry + 30), y + (dy / l) * (ry + 30), 18, 18), WHITE, 5);
  shape(c, () => ell(c, x + (dx / l) * (ry + 80), y + (dy / l) * (ry + 80), 11, 11), WHITE, 5);
  shape(c, () => ell(c, x, y, rx, ry), WHITE, 6);
};
const eyeOpen = (c: Ctx, x: number, y: number, w: number, look = 0) => {
  shape(c, () => { c.moveTo(x - w, y); c.quadraticCurveTo(x, y - w * 0.8, x + w, y); c.quadraticCurveTo(x, y + w * 0.8, x - w, y); c.closePath(); }, WHITE, 6);
  shape(c, () => ell(c, x + look, y, w * 0.34, w * 0.34), COL.blueDk, 4); shape(c, () => ell(c, x + look, y, w * 0.15, w * 0.15), INK, 0);
};
const eyeShut = (c: Ctx, x: number, y: number, w: number) => {
  c.beginPath(); c.moveTo(x - w, y); c.quadraticCurveTo(x, y + w * 0.7, x + w, y); c.strokeStyle = INK; c.lineWidth = 7; c.lineCap = "round"; c.stroke();
};
const biscuit = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), "#e0a85a", 5);
  for (const [a, b] of [[-0.35, -0.25], [0.3, -0.3], [0, 0.35], [-0.3, 0.2], [0.35, 0.2]]) shape(c, () => ell(c, x + a * r, y + b * r, r * 0.1, r * 0.1), COL.soilDk, 0);
};
// a head seen from above, looking toward dir (-1 up, +1 down, -2 left, 2 right)
const topHead = (c: Ctx, x: number, y: number, r: number, dir: number, cloth: string = CLOTH.child, skin: string = SKIN.child) => {
  const vx = dir === 2 ? 1 : dir === -2 ? -1 : 0, vy = dir === 1 ? 1 : dir === -1 ? -1 : 0;
  c.save(); c.translate(x, y); c.rotate(Math.atan2(vy, vx) + Math.PI / 2);
  shape(c, () => ell(c, 0, r * 1.5, r * 2, r * 0.95), cloth, 6);
  shape(c, () => ell(c, 0, 0, r, r), CLOTH.hair, 6);
  shape(c, () => ell(c, 0, -r * 0.3, r * 0.82, r * 0.78), skin, 0);
  shape(c, () => ell(c, -r * 0.3, -r * 0.4, r * 0.1, r * 0.12), INK, 0); shape(c, () => ell(c, r * 0.3, -r * 0.4, r * 0.1, r * 0.12), INK, 0);
  c.restore();
};
const sheet = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); shadow(c, w * 0.04, h * 0.5, w * 0.5, h * 0.06); shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 6), COL.paper, 6); c.restore();
};
const clock = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), WHITE, r * 0.1);
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78], [x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9]], r * 0.06); }
  line(c, [[x, y], [x + r * 0.35, y - r * 0.45]], r * 0.1); line(c, [[x, y], [x - r * 0.05, y - r * 0.72]], r * 0.07); shape(c, () => ell(c, x, y, r * 0.08, r * 0.08), RED, 0);
};
const tick = (c: Ctx, x: number, y: number, s: number) => line(c, [[x - s, y], [x - s * 0.3, y + s * 0.7], [x + s, y - s * 0.8]], 14, COL.green);
const cross = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - s, y - s], [x + s, y + s]], 14, RED); line(c, [[x - s, y + s], [x + s, y - s]], 14, RED); };
const crayon = (c: Ctx, x: number, y: number, len: number, col: string, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -len / 2, -15, len, 30, 5), col, 5); shape(c, () => polyP(c, [[len / 2, -15], [len / 2 + 26, 0], [len / 2, 15]]), col, 5); shape(c, () => rrect(c, -len / 2 + 14, -15, 18, 30, 0), WHITE, 3);
  c.restore();
};
// where a person's wrist ends up for an arm given by joint angles
const wrist = (x: number, y: number, h: number, side: 1 | -1, [a1, a2]: [number, number], sit = false) => {
  const sh = sit ? y - h * 0.06 - h * 0.32 : y - h * 0.74, sx = x + side * h * 0.11, ex = sx + Math.cos(a1) * h * 0.17, ey = sh + h * 0.03 + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};
// a face-front person's head centre and radius
const headOf = (x: number, y: number, h: number, sit = false) => { const sh = sit ? y - h * 0.06 - h * 0.32 : y - h * 0.74, hd = h * 0.13; return { x, y: sh - hd * 1.05, r: hd }; };
const pencilAt = (c: Ctx, x: number, y: number, len = 120, an = -1.0) => {
  const ex = x + Math.cos(an) * len, ey = y + Math.sin(an) * len;
  line(c, [[x, y], [ex, ey]], 30, INK); line(c, [[x, y], [ex, ey]], 18, COL.yellow); line(c, [[x, y], [x + Math.cos(an) * 26, y + Math.sin(an) * 26]], 12, COL.black);
};

// ---------------------------------------------------------------- 0 intro: peeking round the tumbler
const intro = (c: Ctx) => {
  wall(c, 640);
  c.fillStyle = "#b99a6b"; c.fillRect(0, 900, D, 180);
  line(c, [[0, 900], [D, 900]], 6);
  const h = 460;
  person(c, 130, 700, h, { sit: true, armL: [Math.PI * 0.5, Math.PI * 0.45], armR: [Math.PI * 0.4, Math.PI * 0.4] });
  flip(c, 940, () => person(c, 940, 700, h, { sit: true, adult: true, armL: [Math.PI * 0.5, Math.PI * 0.45], armR: [Math.PI * 0.4, Math.PI * 0.4] }));
  tableSide(c, 250, 830, 640, 900);
  tumbler(c, 520, 640, 130, 300);
  lime(c, 640, 640, 40);
  const hc = headOf(130, 700, h, true), ha = headOf(940, 700, h, true);
  dash(c, [[hc.x + 60, hc.y], [410, 470]], 8);
  cross(c, 420, 470, 22);
  line(c, [[ha.x - 70, ha.y + 20], [670, 590]], 8, COL.teal);
};

// ---------------------------------------------------------------- 1 summary: the table seen from above
const summary = (c: Ctx) => {
  plain(c);
  shadow(c, 560, 800, 390, 40);
  shape(c, () => rrect(c, 190, 280, 700, 500, 30), TABLE, 7);
  shape(c, () => ell(c, 540, 560, 56, 56), COL.steel, 6); shape(c, () => ell(c, 540, 560, 36, 36), COL.steelIn, 4);
  shape(c, () => ell(c, 540, 450, 34, 34), COL.green, 6);
  c.save(); c.translate(380, 570); c.rotate(0.3); banana(c, 0, 0, 80); c.restore();
  topHead(c, 540, 905, 52, -1);
  topHead(c, 540, 175, 52, 1, CLOTH.adult, SKIN.adult);
  dash(c, [[540, 840], [540, 622]], 8);
  cross(c, 540, 605, 0);
  line(c, [[540, 234], [540, 412]], 8, COL.teal);
  line(c, [[500, 234], [400, 520]], 5, COL.teal);
  line(c, [[580, 234], [640, 400]], 5, COL.teal);
  dash(c, [[500, 840], [400, 600]], 6);
};

// ---------------------------------------------------------------- 2 term 0: point of view (two eyes, two sides of one thing)
const pov = (c: Ctx) => {
  plain(c);
  // a post seen from above: left face red, right face blue, top and bottom faces yellow and green
  shape(c, () => polyP(c, [[400, 400], [680, 400], [540, 540]]), COL.yellow);
  shape(c, () => polyP(c, [[400, 680], [680, 680], [540, 540]]), COL.green);
  shape(c, () => polyP(c, [[400, 400], [400, 680], [540, 540]]), COL.red);
  shape(c, () => polyP(c, [[680, 400], [680, 680], [540, 540]]), COL.blue);
  shape(c, () => rrect(c, 400, 400, 280, 280, 4), "rgba(0,0,0,0)", 7);
  eyeOpen(c, 120, 540, 85, 40);
  flip(c, 960, () => eyeOpen(c, 960, 540, 85, 40));
  line(c, [[215, 500], [385, 470]], 6, COL.red); line(c, [[215, 580], [385, 610]], 6, COL.red);
  line(c, [[865, 500], [695, 470]], 6, COL.blueDk); line(c, [[865, 580], [695, 610]], 6, COL.blueDk);
  shape(c, () => rrect(c, 70, 780, 100, 60, 10), COL.red, 6);
  shape(c, () => rrect(c, 910, 780, 100, 60, 10), COL.blue, 6);
};

// ---------------------------------------------------------------- 3 term 1: turning the drawing round for a friend
const turn = (c: Ctx) => {
  wall(c, 640);
  c.fillStyle = "#b99a6b"; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  person(c, 130, 700, 420, { sit: true, armL: [Math.PI * 0.5, Math.PI * 0.4], armR: [Math.PI * 0.4, Math.PI * 0.35] });
  flip(c, 950, () => person(c, 950, 700, 420, { sit: true, adult: true, armL: [Math.PI * 0.5, Math.PI * 0.4], armR: [Math.PI * 0.4, Math.PI * 0.35] }));
  tableSide(c, 250, 830, 640, 900);
  // the drawing: a house and sun, lifted and turned half way round
  c.save(); c.translate(540, 500); c.rotate(-0.3);
  shape(c, () => rrect(c, -170, -120, 340, 240, 8), COL.paper, 7);
  shape(c, () => rrect(c, -80, -10, 120, 90, 4), COL.orange, 5);
  shape(c, () => polyP(c, [[-100, -10], [-20, -80], [60, -10]]), RED, 5);
  shape(c, () => ell(c, 100, -70, 28, 28), COL.yellow, 5);
  c.restore();
  arc(c, 380, 330, 540, 190, 700, 330, 11);
};

// ---------------------------------------------------------------- 4 term 2: belief (grandmother and the closed tin)
const belief = (c: Ctx) => {
  wall(c, 760);
  person(c, 330, 960, 700, { adult: true, armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [Math.PI * 0.4, Math.PI * 0.25] });
  // grey hair over the adult's hair
  const hd = headOf(330, 960, 700);
  shape(c, () => { c.moveTo(hd.x - hd.r * 1.02, hd.y); c.bezierCurveTo(hd.x - hd.r, hd.y - hd.r * 1.5, hd.x + hd.r, hd.y - hd.r * 1.5, hd.x + hd.r * 1.02, hd.y); c.quadraticCurveTo(hd.x, hd.y - hd.r * 0.55, hd.x - hd.r * 1.02, hd.y); c.closePath(); }, "#d9d4dc", 5);
  // a closed round tin on the table
  shadow(c, 800, 905, 190, 30);
  shape(c, () => rrect(c, 640, 740, 320, 160, 24), COL.red, 7);
  shape(c, () => rrect(c, 625, 690, 350, 65, 24), "#b8382a", 7);
  shape(c, () => ell(c, 800, 820, 52, 52), WHITE, 5);
  bubble(c, 740, 270, 230, 150, 480, 520);
  biscuit(c, 680, 270, 60); biscuit(c, 790, 240, 58); biscuit(c, 790, 330, 55);
};
// ---------------------------------------------------------------- 5 term 3: false belief
const falseBelief = (c: Ctx) => {
  wall(c, 800);
  // cupboard on the left
  shape(c, () => rrect(c, 40, 330, 250, 470, 10), COL.brown, 7);
  line(c, [[165, 340], [165, 790]], 6); shape(c, () => ell(c, 140, 580, 9, 9), COL.yellow, 4); shape(c, () => ell(c, 190, 580, 9, 9), COL.yellow, 4);
  // bed on the right with a ball underneath
  shape(c, () => rrect(c, 640, 600, 390, 80, 10), COL.blue, 7);
  shape(c, () => rrect(c, 640, 500, 80, 180, 10), COL.blueDk, 7);
  shape(c, () => rrect(c, 650, 680, 24, 130, 5), COL.woodDk, 5); shape(c, () => rrect(c, 995, 680, 24, 130, 5), COL.woodDk, 5);
  shadow(c, 840, 800, 190, 14);
  shape(c, () => ell(c, 840, 765, 38, 38), RED, 6); shape(c, () => ell(c, 840, 765, 38, 38), "rgba(0,0,0,0)", 0);
  // the child in the middle pointing at the cupboard
  person(c, 440, 960, 560, { armL: [Math.PI * 1.05, Math.PI * 1.0], armR: [Math.PI * 0.45, Math.PI * 0.5] });
  bubble(c, 520, 150, 190, 105, 460, 360);
  shape(c, () => rrect(c, 450, 90, 90, 120, 6), COL.brown, 5); line(c, [[495, 92], [495, 208]], 4); shape(c, () => ell(c, 610, 175, 32, 32), RED, 6);
};
// ---------------------------------------------------------------- 6 term 4: theory of mind
const mind = (c: Ctx) => {
  plain(c, WALL);
  c.fillStyle = TABLE; c.fillRect(0, 930, D, 150); line(c, [[0, 930], [D, 930]], 6);
  person(c, 270, 990, 560, {});
  person(c, 810, 990, 560, { adult: true });
  bubble(c, 270, 230, 190, 120, 270, 430); crayon(c, 270, 230, 150, COL.red, -0.4);
  bubble(c, 810, 230, 190, 120, 810, 430); crayon(c, 810, 230, 150, COL.blue, 0.4);
};
// ---------------------------------------------------------------- 7 term 5: cooperation (holding the paper, drawing a kolam)
const kolam = (c: Ctx, x: number, y: number, s: number) => {
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) if (Math.abs(i - 2) + Math.abs(j - 2) <= 2 && (i + j) % 2 === 0) { shape(c, () => ell(c, x + (i - 2) * s, y + (j - 2) * s, 7, 7), INK, 0); }
  c.beginPath(); c.moveTo(x - s * 2, y); c.quadraticCurveTo(x - s * 1.4, y - s * 1.4, x, y - s * 2); c.quadraticCurveTo(x + s * 1.4, y - s * 1.4, x + s * 2, y); c.quadraticCurveTo(x + s * 1.4, y + s * 1.4, x, y + s * 2); c.quadraticCurveTo(x - s * 1.4, y + s * 1.4, x - s * 2, y); c.strokeStyle = COL.pink; c.lineWidth = 10; c.stroke();
  c.beginPath(); c.moveTo(x - s, y); c.quadraticCurveTo(x, y - s * 1.0, x + s, y); c.quadraticCurveTo(x, y + s * 1.0, x - s, y); c.strokeStyle = COL.pink; c.lineWidth = 10; c.stroke();
};
const together = (c: Ctx) => {
  plain(c, "#e8d3b0");
  line(c, [[0, 520], [D, 520]], 4, "#c9ae7e");
  person(c, 190, 740, 520, { sit: true, armL: [Math.PI * 0.55, Math.PI * 0.4], armR: [Math.PI * 0.45, Math.PI * 0.35] });
  flip(c, 890, () => person(c, 890, 740, 520, { sit: true, armL: [Math.PI * 0.55, Math.PI * 0.4], armR: [Math.PI * 0.45, Math.PI * 0.35] }));
  sheet(c, 540, 800, 520, 330, -0.02);
  kolam(c, 540, 800, 70);
  pencilAt(c, 640, 840, 150, -1.1);
};
// ---------------------------------------------------------------- 8 term 6: dominant eye
const domEye = (c: Ctx) => {
  plain(c, WALL);
  c.fillStyle = TABLE; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  clock(c, 880, 230, 120);
  const x = 270, y = 980, h = 760;
  person(c, x, y, h, { armL: [Math.PI * 0.45, Math.PI * 0.5], armR: [-0.1, -0.05] });
  const hd = headOf(x, y, h);
  // wink: cover the left eye (viewer's right) and draw it shut
  shape(c, () => ell(c, hd.x + hd.r * 0.35, hd.y + hd.r * 0.12, hd.r * 0.2, hd.r * 0.22), SKIN.child, 0);
  eyeShut(c, hd.x + hd.r * 0.35, hd.y + hd.r * 0.1, hd.r * 0.22);
  const [wx, wy] = wrist(x, y, h, 1, [-0.1, -0.05]);
  shape(c, () => rrect(c, wx - 14, wy - 150, 28, 300, 4), "rgba(0,0,0,0)", 0);
  c.save(); shape(c, () => rrect(c, wx + 20, wy - 130, 40, 260, 6), COL.paper, 6); shape(c, () => ell(c, wx + 40, wy - 15, 16, 16), WALL, 5); c.restore();
  dash(c, [[hd.x - hd.r * 0.35, hd.y + hd.r * 0.1], [wx + 40, wy - 15], [790, 250]], 7, GREY);
};
// ---------------------------------------------------------------- 9 term 8: left-handed
const lefty = (c: Ctx) => {
  plain(c, WALL);
  c.fillStyle = COL.wood; c.fillRect(0, 700, D, 380); c.fillStyle = COL.woodDk; c.fillRect(0, 700, D, 14); line(c, [[0, 700], [D, 700]], 6);
  const x = 540, y = 1000, h = 780;
  const armR: [number, number] = [Math.PI * 0.5, Math.PI * 0.62];
  person(c, x, y, h, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR });
  // notebook on the desk, over the lower body
  shape(c, () => polyP(c, [[250, 1000], [850, 1000], [800, 800], [300, 800]]), COL.blue, 7);
  shape(c, () => polyP(c, [[280, 985], [820, 985], [775, 820], [325, 820]]), COL.paper, 5);
  for (let i = 0; i < 4; i++) line(c, [[360 - i * 4, 860 + i * 38], [740 + i * 8, 860 + i * 38]], 3, COL.blueDk);
  const [wx, wy] = wrist(x, y, h, 1, armR);
  pencilAt(c, wx + 6, wy + 40, 120, -1.1);
  shape(c, () => ell(c, wx + 6, wy + 8, 26, 26), SKIN.child, 5);
};
// ---------------------------------------------------------------- 10 expl 0: front seat and back seat of an auto-rickshaw
const rickshaw = (c: Ctx) => {
  plain(c);
  shadow(c, 520, 900, 330, 22);
  shape(c, () => polyP(c, [[180, 620], [770, 620], [830, 780], [140, 780]]), COL.yellow, 7);
  shape(c, () => polyP(c, [[230, 420], [260, 620], [820, 620], [800, 440]]), "#e8f4fa", 6);
  shape(c, () => { c.moveTo(210, 420); c.quadraticCurveTo(520, 360, 830, 430); c.lineTo(830, 470); c.quadraticCurveTo(520, 410, 210, 470); c.closePath(); }, COL.black, 7);
  shape(c, () => rrect(c, 320, 540, 170, 80, 10), COL.orange, 6); shape(c, () => rrect(c, 580, 540, 190, 80, 10), COL.orange, 6);
  shape(c, () => ell(c, 255, 800, 62, 62), COL.black, 7); shape(c, () => ell(c, 255, 800, 24, 24), COL.steel, 4);
  shape(c, () => ell(c, 690, 800, 62, 62), COL.black, 7); shape(c, () => ell(c, 690, 800, 24, 24), COL.steel, 4);
  // two seats
  shape(c, () => ell(c, 400, 500, 18, 18), RED, 4); shape(c, () => ell(c, 680, 500, 18, 18), COL.teal, 4);
  // view boxes
  const box = (x: number, col: string) => { shape(c, () => rrect(c, x, 60, 400, 290, 20), WHITE, 7); c.save(); c.beginPath(); rrect(c, x + 10, 70, 380, 270, 14); c.clip(); return col; };
  // from the front seat: the road ahead
  box(60, RED); c.fillStyle = COL.sky; c.fillRect(60, 60, 400, 150); c.fillStyle = COL.grey; c.beginPath(); c.moveTo(180, 210); c.lineTo(340, 210); c.lineTo(460, 350); c.lineTo(60, 350); c.closePath(); c.fill();
  line(c, [[260, 215], [260, 350]], 6, WHITE); shape(c, () => rrect(c, 380, 140, 20, 70, 4), COL.soil, 4); shape(c, () => ell(c, 390, 130, 48, 42), COL.leaf, 5);
  c.restore();
  shape(c, () => rrect(c, 60, 60, 400, 290, 20), "rgba(0,0,0,0)", 7);
  // from the back seat: a driver's back
  box(620, COL.teal); c.fillStyle = "#e9eef2"; c.fillRect(620, 60, 400, 290);
  shape(c, () => ell(c, 820, 330, 150, 90), CLOTH.adult, 6); shape(c, () => ell(c, 820, 190, 62, 66), CLOTH.hair, 6);
  c.restore();
  shape(c, () => rrect(c, 620, 60, 400, 290, 20), "rgba(0,0,0,0)", 7);
  dash(c, [[400, 480], [300, 360]], 7, RED); dash(c, [[680, 480], [760, 360]], 7, COL.tealDk);
};
// ---------------------------------------------------------------- 11 expl 1: facing each other, right hands on opposite sides
const mirror = (c: Ctx) => {
  plain(c);
  shadow(c, 560, 810, 330, 36);
  shape(c, () => rrect(c, 250, 380, 560, 420, 24), TABLE, 7);
  topHead(c, 540, 925, 56, -1); topHead(c, 540, 185, 56, 1, CLOTH.adult, SKIN.adult);
  // right hands: the one at the bottom is on the right of the picture; the one at the top is on the left
  shape(c, () => ell(c, 665, 850, 34, 34), SKIN.child, 6); shape(c, () => ell(c, 415, 260, 34, 34), SKIN.adult, 6);
  shape(c, () => ell(c, 665, 850, 12, 12), RED, 0); shape(c, () => ell(c, 415, 260, 12, 12), RED, 0);
  arrow(c, [[665, 805], [665, 600]], RED, 11);
  arrow(c, [[415, 305], [415, 510]], RED, 11);
};
// ---------------------------------------------------------------- 12 expl 2: the marble moves while one doll looks away
const doll = (c: Ctx, x: number, y: number, h: number, away: boolean, dress: string) => {
  shadow(c, x + 14, y + 4, h * 0.28, h * 0.05);
  shape(c, () => polyP(c, [[x - h * 0.1, y - h * 0.55], [x + h * 0.1, y - h * 0.55], [x + h * 0.27, y], [x - h * 0.27, y]]), dress, 6);
  shape(c, () => ell(c, x, y - h * 0.72, h * 0.17, h * 0.17), SKIN.child, 6);
  if (away) shape(c, () => ell(c, x, y - h * 0.74, h * 0.17, h * 0.15), CLOTH.hair, 6);
  else { shape(c, () => { c.moveTo(x - h * 0.18, y - h * 0.74); c.bezierCurveTo(x - h * 0.17, y - h * 1.02, x + h * 0.17, y - h * 1.02, x + h * 0.18, y - h * 0.74); c.closePath(); }, CLOTH.hair, 5); shape(c, () => ell(c, x - h * 0.06, y - h * 0.7, h * 0.02, h * 0.025), INK, 0); shape(c, () => ell(c, x + h * 0.06, y - h * 0.7, h * 0.02, h * 0.025), INK, 0); }
};
const marble = (c: Ctx) => {
  wall(c, 720);
  doll(c, 150, 940, 420, true, COL.pink);
  doll(c, 930, 940, 420, false, COL.teal);
  // a basket (left) and a box (right)
  shadow(c, 350, 905, 130, 18);
  shape(c, () => { c.moveTo(250, 780); c.lineTo(450, 780); c.lineTo(420, 890); c.lineTo(280, 890); c.closePath(); }, COL.brown, 7);
  line(c, [[265, 830], [435, 830]], 4); line(c, [[350, 780], [350, 890]], 4);
  shadow(c, 740, 905, 130, 18);
  shape(c, () => rrect(c, 640, 770, 200, 130, 8), COL.purple, 7); shape(c, () => rrect(c, 630, 740, 220, 44, 8), "#6f52ab", 7);
  arc(c, 410, 700, 540, 420, 670, 690, 11);
  shape(c, () => ell(c, 350, 740, 30, 30), COL.blue, 6);
};
// ---------------------------------------------------------------- 13 expl 3: bodies differ in hidden ways
const hidden = (c: Ctx) => {
  plain(c, WALL);
  c.fillStyle = TABLE; c.fillRect(0, 960, D, 120); line(c, [[0, 960], [D, 960]], 6);
  const xs = [190, 540, 890];
  xs.forEach((x) => person(c, x, 1010, 440, { adult: x === 540 }));
  // hand
  bubble(c, 190, 250, 140, 110, 190, 440); pencilAt(c, 150, 310, 130, -0.6);
  // eye
  bubble(c, 540, 250, 140, 110, 540, 440); eyeOpen(c, 540, 250, 75, 10);
  // colours: red and green blobs both look brown
  bubble(c, 890, 250, 140, 110, 890, 440); shape(c, () => ell(c, 840, 250, 42, 42), COL.red, 6); shape(c, () => ell(c, 940, 250, 42, 42), COL.green, 6);
};
// ---------------------------------------------------------------- 14 expl 4: sharing an umbrella
const umbrella = (c: Ctx) => {
  c.fillStyle = "#9fb7c8"; c.fillRect(0, 0, D, D); c.fillStyle = "#6e8aa0"; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  const r = rndRain();
  r.forEach(([x, y]) => line(c, [[x, y], [x - 20, y + 60]], 6, COL.drop));
  person(c, 420, 980, 560, { armR: [Math.PI * 0.45, Math.PI * 0.6] });
  person(c, 650, 980, 560, { adult: false, armL: [Math.PI * 0.55, Math.PI * 0.5] });
  line(c, [[535, 190], [535, 470]], 12, INK);
  shape(c, () => { c.moveTo(150, 330); c.quadraticCurveTo(540, 20, 930, 330); c.quadraticCurveTo(840, 280, 735, 330); c.quadraticCurveTo(640, 280, 540, 330); c.quadraticCurveTo(440, 280, 345, 330); c.quadraticCurveTo(240, 280, 150, 330); c.closePath(); }, COL.pink, 7);
  shape(c, () => ell(c, 540, 175, 14, 14), INK, 0);
};
const rndRain = () => { const o: number[][] = []; let s = 5; for (let i = 0; i < 38; i++) { s = (s * 1664525 + 1013904223) >>> 0; const x = (s / 4294967296) * D; s = (s * 1664525 + 1013904223) >>> 0; const y = (s / 4294967296) * 880; if (x > 120 && x < 960 && y > 180 && y < 700) continue; o.push([x, y]); } return o; };
// ---------------------------------------------------------------- 15 expl 5: four jigsaw pieces fitting together
const jigsaw = (c: Ctx) => {
  plain(c);
  shadow(c, 560, 830, 300, 40);
  shape(c, () => ell(c, 540, 540, 300, 300), TABLE, 7);
  const cols = [COL.red, COL.blue, COL.green, COL.orange];
  const qs: [number, number][] = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  qs.forEach(([a, b], i) => {
    const x = 540 + a * 5, y = 540 + b * 5;
    shape(c, () => { c.moveTo(x, y); c.lineTo(x + a * 120, y); c.lineTo(x + a * 120, y + b * 120); c.lineTo(x, y + b * 120); c.closePath(); }, cols[i], 6);
    shape(c, () => ell(c, x + a * 60, y + b * 60, 16, 16), WHITE, 4);
  });
  topHead(c, 540, 140, 52, 1, CLOTH.adult, SKIN.adult);
  topHead(c, 540, 940, 52, -1);
  topHead(c, 170, 540, 52, 2);
  topHead(c, 910, 540, 52, -2, CLOTH.adult, SKIN.adult);
  arrow(c, [[540, 300], [540, 380]], RED, 9); arrow(c, [[540, 790], [540, 700]], RED, 9); arrow(c, [[300, 540], [380, 540]], RED, 9); arrow(c, [[780, 540], [700, 540]], RED, 9);
};
// ---------------------------------------------------------------- 16 flow e1: the drawing and the photo match
const otherChair = (c: Ctx) => {
  wall(c, 560);
  c.fillStyle = COL.paper;
  // left: the child's drawing of the other seat's view
  c.save(); c.translate(270, 620); c.rotate(-0.04);
  shape(c, () => rrect(c, -220, -330, 440, 620, 10), COL.paper, 7);
  const g = COL.black;
  c.beginPath(); ell(c, -10, -140, 56, 12); c.strokeStyle = g; c.lineWidth = 7; c.stroke();
  line(c, [[-66, -140], [-52, 50], [38, 50], [52, -140]], 7, g);
  c.beginPath(); ell(c, -20, 120, 55, 50); c.strokeStyle = g; c.lineWidth = 7; c.stroke();
  c.beginPath(); c.moveTo(80, -20); c.quadraticCurveTo(150, 100, 200, -20); c.quadraticCurveTo(150, 30, 80, -20); c.stroke();
  c.restore();
  // right: the photo from that seat
  shape(c, () => rrect(c, 580, 270, 440, 620, 10), "#ffffff", 7);
  c.save(); c.beginPath(); rrect(c, 600, 290, 400, 480, 8); c.clip(); c.fillStyle = WALL; c.fillRect(600, 290, 400, 480); c.fillStyle = TABLE; c.fillRect(600, 520, 400, 250);
  c.save(); c.translate(770, 740); c.scale(0.55, 0.55);
  banana(c, 260, -60, 150); tumbler(c, 0, -20, 200, 480); lime(c, -10, 60, 85);
  c.restore(); c.restore();
  shape(c, () => ell(c, 800, 830, 20, 20), COL.black, 0);
  tick(c, 540, 220, 50);
  arrow(c, [[480, 480], [560, 480]], RED, 9);
};
// ---------------------------------------------------------------- 17 flow e2: which eye keeps the clock in the hole
const eyeTest = (c: Ctx) => {
  plain(c, WALL);
  clock(c, 540, 170, 100);
  const panel = (x: number, clockIn: boolean, shutLeft: boolean) => {
    shape(c, () => rrect(c, x - 220, 380, 440, 460, 16), COL.paper, 7);
    shape(c, () => ell(c, x, 560, 105, 105), clockIn ? WALL : COL.wood, 7);
    if (clockIn) { c.save(); c.beginPath(); ell(c, x, 560, 98, 98); c.clip(); clock(c, x, 560, 76); c.restore(); }
    else { c.save(); c.beginPath(); ell(c, x, 560, 98, 98); c.clip(); c.fillStyle = WALL; c.fillRect(x - 100, 460, 200, 100); c.fillStyle = TABLE; c.fillRect(x - 100, 640, 200, 40); c.restore(); }
    if (shutLeft) { eyeShut(c, x - 80, 760, 55); eyeOpen(c, x + 80, 760, 55, 0); } else { eyeOpen(c, x - 80, 760, 55, 0); eyeShut(c, x + 80, 760, 55); }
    if (clockIn) tick(c, x, 880, 36); else cross(c, x, 880, 28);
  };
  panel(300, true, true);
  panel(780, false, false);
};
// ---------------------------------------------------------------- 18 flow a1: hiding from the watchmen
const watchman = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 10, y + 12, 52, 14);
  shape(c, () => ell(c, x, y, 50, 50), COL.steel, 6); shape(c, () => ell(c, x, y, 36, 36), SKIN.child, 4);
  shape(c, () => ell(c, x - 12, y - 6, 5, 7), INK, 0); shape(c, () => ell(c, x + 12, y - 6, 5, 7), INK, 0);
  c.beginPath(); c.arc(x, y + 8, 10, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
const watchmen = (c: Ctx) => {
  plain(c);
  shape(c, () => rrect(c, 120, 120, 840, 840, 20), "#f4e9d0", 6);
  // the two crossed books
  shadow(c, 545, 560, 440, 30);
  shape(c, () => rrect(c, 120, 505, 840, 70, 8), COL.blue, 7);
  shape(c, () => rrect(c, 505, 120, 70, 840, 8), COL.teal, 7);
  // watchman 1 at the left end, above the wall: sees only the top-left space
  watchman(c, 190, 440); watchman(c, 640, 190);
  c.save(); c.globalAlpha = 0.28; c.fillStyle = COL.yellow; c.beginPath(); c.moveTo(240, 440); c.lineTo(500, 140); c.lineTo(500, 500); c.closePath(); c.fill(); c.beginPath(); c.moveTo(640, 240); c.lineTo(1000, 500); c.lineTo(580, 500); c.closePath(); c.fill(); c.restore();
  dash(c, [[240, 470], [490, 470]], 6); 
  // the hider: a small coin in the bottom-right space, a tick beside it
  shape(c, () => ell(c, 760, 760, 36, 36), COL.yellow, 6); shape(c, () => ell(c, 760, 760, 18, 18), COL.orange, 4);
  tick(c, 860, 840, 36);
};
// ---------------------------------------------------------------- 19 flow a2: the biscuit box and what is really inside
const surprise = (c: Ctx) => {
  wall(c, 650);
  // closed box with a biscuit picture
  shadow(c, 300, 880, 220, 24);
  shape(c, () => rrect(c, 110, 560, 380, 300, 14), COL.red, 7);
  shape(c, () => rrect(c, 140, 600, 320, 220, 10), "#fbe7c6", 5); biscuit(c, 240, 710, 52); biscuit(c, 370, 700, 48);
  // an open box with pencils
  shadow(c, 790, 880, 220, 24);
  shape(c, () => rrect(c, 600, 640, 380, 220, 14), COL.red, 7);
  const cs = [COL.yellow, COL.blue, COL.green, COL.pink, COL.orange];
  cs.forEach((col, i) => { c.save(); c.translate(660 + i * 64, 610); c.rotate(-0.25 + i * 0.12); shape(c, () => rrect(c, -14, -250, 28, 270, 4), col, 5); shape(c, () => polyP(c, [[-14, -250], [14, -250], [0, -292]]), COL.wood, 4); c.restore(); });
  shape(c, () => rrect(c, 600, 700, 380, 160, 14), COL.red, 7);
  arrow(c, [[500, 400], [590, 330]], RED, 10);
  flip(c, 300, () => {});
  bubble(c, 250, 220, 150, 100, 280, 480); biscuit(c, 250, 220, 55);
};
// ---------------------------------------------------------------- 20 flow a3: four cards, one drink
const jigsawDrink = (c: Ctx) => {
  plain(c);
  const card = (x: number, y: number, n: string, icon: () => void) => {
    shape(c, () => rrect(c, x, y, 330, 330, 22), WHITE, 7); write(c, n, x + 22, y + 20, 48, INK, 7); icon();
  };
  card(40, 40, "1", () => { shape(c, () => ell(c, 215, 215, 90, 90), COL.greenLt, 6); for (let i = 0; i < 6; i++) { const a = (i * Math.PI) / 3; line(c, [[215, 215], [215 + Math.cos(a) * 78, 215 + Math.sin(a) * 78]], 5, WHITE); } });
  card(710, 40, "2", () => { shape(c, () => rrect(c, 800, 150, 130, 160, 20), COL.water, 6); shape(c, () => rrect(c, 915, 190, 50, 70, 20), "rgba(0,0,0,0)", 6); line(c, [[800, 200], [930, 200]], 5, COL.drop); });
  card(40, 710, "3", () => { shape(c, () => ell(c, 150, 930, 70, 28), WHITE, 6); shape(c, () => ell(c, 150, 905, 50, 30), "#f6f2ea", 4); line(c, [[200, 900], [290, 800]], 12, COL.steelDk); shape(c, () => ell(c, 306, 784, 26, 18, -0.8), COL.steel, 5); });
  card(710, 710, "4", () => { glass(c, 875, 960, 120, 190, 0.7, "#d9ef9a"); line(c, [[890, 850], [840, 760]], 12, COL.steelDk); });
  glass(c, 540, 720, 230, 380, 0.75, "#d9ef9a");
  shape(c, () => ell(c, 660, 460, 62, 62), COL.green, 6);
  arrow(c, [[375, 215], [460, 330]], RED, 10); arrow(c, [[705, 215], [620, 330]], RED, 10); arrow(c, [[375, 800], [450, 700]], RED, 10); arrow(c, [[705, 800], [630, 700]], RED, 10);
};
// ---------------------------------------------------------------- 21 flow a4: the monkey and the crocodile, told both ways
const crocodile = (c: Ctx) => {
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, D);
  c.fillStyle = COL.water; c.fillRect(0, 640, D, 440); line(c, [[0, 640], [D, 640]], 6);
  // the jamun tree on the left bank
  shape(c, () => polyP(c, [[60, 1080], [180, 1080], [160, 300], [90, 300]]), COL.soil, 7);
  line(c, [[130, 420], [470, 360]], 40, INK); line(c, [[130, 420], [470, 360]], 28, COL.soil);
  shape(c, () => ell(c, 170, 220, 190, 150), COL.leaf, 7);
  shape(c, () => ell(c, 80, 330, 90, 60), COL.leafDk, 7);
  // the monkey sitting on the branch
  shape(c, () => ell(c, 420, 290, 52, 62), COL.brown, 6); shape(c, () => ell(c, 420, 210, 46, 44), COL.brown, 6); shape(c, () => ell(c, 420, 222, 30, 28), "#f0cfa4", 4);
  shape(c, () => ell(c, 376, 205, 16, 16), COL.brown, 5); shape(c, () => ell(c, 466, 205, 16, 16), COL.brown, 5);
  shape(c, () => ell(c, 408, 212, 5, 6), INK, 0); shape(c, () => ell(c, 434, 212, 5, 6), INK, 0);
  c.beginPath(); c.moveTo(470, 310); c.quadraticCurveTo(560, 320, 540, 230); c.strokeStyle = INK; c.lineWidth = 22; c.lineCap = "round"; c.stroke(); c.strokeStyle = COL.brown; c.lineWidth = 12; c.stroke();
  for (const [x, y] of [[300, 400], [350, 430]]) shape(c, () => ell(c, x, y, 18, 22), COL.purple, 5);
  // the crocodile in the river
  shape(c, () => { c.moveTo(500, 760); c.quadraticCurveTo(640, 700, 760, 720); c.quadraticCurveTo(900, 700, 1040, 770); c.lineTo(1040, 830); c.quadraticCurveTo(900, 800, 760, 840); c.quadraticCurveTo(620, 830, 500, 820); c.closePath(); }, COL.green, 7);
  shape(c, () => ell(c, 550, 745, 22, 22), WHITE, 5); shape(c, () => ell(c, 556, 745, 9, 9), INK, 0);
  for (let i = 0; i < 5; i++) shape(c, () => polyP(c, [[600 + i * 16, 818], [612 + i * 16, 818], [606 + i * 16, 796]]), WHITE, 3);
  for (let i = 0; i < 4; i++) shape(c, () => polyP(c, [[740 + i * 70, 722], [770 + i * 70, 722], [756 + i * 70, 690]]), COL.greenDk, 5);
  // swap arrows
  arc(c, 610, 450, 720, 520, 700, 640, 11);
  arc(c, 640, 640, 560, 540, 580, 450, 11);
};
// ---------------------------------------------------------------- 22 flow a5: same and different
const venn = (c: Ctx) => {
  plain(c, WALL);
  c.fillStyle = TABLE; c.fillRect(0, 930, D, 150); line(c, [[0, 930], [D, 930]], 6);
  person(c, 150, 990, 560, {});
  person(c, 930, 990, 560, { adult: false });
  sheet(c, 540, 580, 500, 700, 0);
  shape(c, () => ell(c, 450, 580, 150, 150), "rgba(91,143,214,0.65)", 6);
  shape(c, () => ell(c, 630, 580, 150, 150), "rgba(243,154,60,0.65)", 6);
  c.save(); c.beginPath(); ell(c, 450, 580, 150, 150); c.clip(); c.beginPath(); ell(c, 630, 580, 150, 150); c.fillStyle = "rgba(106,165,63,0.75)"; c.fill(); c.restore();
  c.beginPath(); ell(c, 450, 580, 150, 150); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); c.beginPath(); ell(c, 630, 580, 150, 150); c.stroke();
  pencilAt(c, 620, 800, 140, -0.9);
};
// ---------------------------------------------------------------- 23 flow p1: the skit
const skit = (c: Ctx) => {
  plain(c, "#6d4a8a");
  c.fillStyle = "#e5c68e"; c.fillRect(0, 800, D, 280); line(c, [[0, 800], [D, 800]], 6);
  shape(c, () => polyP(c, [[0, 0], [260, 0], [200, 800], [0, 800]]), COL.red, 7);
  shape(c, () => polyP(c, [[D, 0], [820, 0], [880, 800], [D, 800]]), COL.red, 7);
  shape(c, () => polyP(c, [[0, 0], [D, 0], [D, 90], [0, 90]]), "#a52a20", 7);
  person(c, 400, 960, 600, {});
  const hd = headOf(400, 960, 600);
  shape(c, () => polyP(c, [[400 - 120, 960 - 444], [400 + 120, 960 - 444], [400 + 150, 960 - 190], [400 - 150, 960 - 190]]), "rgba(242,154,180,0.0)", 0);
  shape(c, () => { c.moveTo(400 - 100, 960 - 450); c.quadraticCurveTo(400, 960 - 560, 400 + 100, 960 - 450); c.lineTo(400 + 150, 960 - 150); c.lineTo(400 - 150, 960 - 150); c.closePath(); }, "rgba(242,154,180,0.0)", 0);
  // dupatta over the shoulders
  c.beginPath(); c.moveTo(400 - 80, 960 - 450); c.quadraticCurveTo(400, 960 - 410, 400 + 80, 960 - 450); c.lineTo(400 + 130, 960 - 250); c.quadraticCurveTo(400, 960 - 320, 400 - 130, 960 - 250); c.closePath(); c.fillStyle = COL.pink; c.fill(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  // the monster: a green cloth over a child, with two horns
  person(c, 720, 960, 600, { adult: true });
  const hm = headOf(720, 960, 600);
  shape(c, () => { c.moveTo(720 - 105, 960 - 150); c.lineTo(720 - 100, 960 - 480); c.quadraticCurveTo(720, 960 - 600, 720 + 100, 960 - 480); c.lineTo(720 + 105, 960 - 150); c.closePath(); }, COL.green, 7);
  shape(c, () => polyP(c, [[720 - 80, 960 - 520], [720 - 60, 960 - 590], [720 - 30, 960 - 535]]), WHITE, 5); shape(c, () => polyP(c, [[720 + 80, 960 - 520], [720 + 60, 960 - 590], [720 + 30, 960 - 535]]), WHITE, 5);
  shape(c, () => ell(c, 720 - 35, 960 - 460, 18, 22), WHITE, 5); shape(c, () => ell(c, 720 + 35, 960 - 460, 18, 22), WHITE, 5);
  shape(c, () => ell(c, 720 - 35, 960 - 458, 7, 9), INK, 0); shape(c, () => ell(c, 720 + 35, 960 - 458, 7, 9), INK, 0);
  c.beginPath(); c.arc(720, 960 - 390, 36, 0.1, Math.PI - 0.1); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  void hd; void hm;
  // the phone filming
  shape(c, () => rrect(c, 440, 880, 200, 160, 20), COL.black, 7); shape(c, () => rrect(c, 458, 896, 164, 120, 8), "#6b8fa8", 4); shape(c, () => ell(c, 540, 956, 18, 18), RED, 0);
};
// ---------------------------------------------------------------- 24 flow c1: a board game with pieces told apart by shape
const mark = (c: Ctx, x: number, y: number, k: number, r: number, col: string = INK) => {
  c.beginPath();
  if (k === 0) ell(c, x, y, r, r);
  if (k === 1) { c.moveTo(x, y - r); c.lineTo(x + r, y + r * 0.8); c.lineTo(x - r, y + r * 0.8); c.closePath(); }
  if (k === 2) c.rect(x - r, y - r, r * 2, r * 2);
  if (k === 3) { for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r * 1.15; i ? c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); }
  c.fillStyle = col; c.fill();
};
const raceGame = (c: Ctx) => {
  wall(c, 120);
  c.fillStyle = TABLE; c.fillRect(0, 120, D, D);
  shadow(c, 560, 940, 440, 40);
  shape(c, () => rrect(c, 70, 90, 940, 850, 24), COL.paper, 7);
  // a winding race track of squares, each marked with a shape
  const sq = [[150, 200], [320, 200], [490, 200], [660, 200], [830, 200], [830, 380], [660, 380], [490, 380], [320, 380], [150, 380], [150, 560], [320, 560], [490, 560]];
  sq.forEach(([x, y], i) => { shape(c, () => rrect(c, x, y, 130, 130, 14), i % 2 ? "#e9e4d6" : "#d4cdbb", 6); mark(c, x + 65, y + 65, i % 4, 30, "rgba(43,35,64,0.55)"); });
  // three pieces: same grey, told apart by shape
  [[0, 190, 810], [1, 370, 810], [2, 550, 810], [3, 730, 810]].forEach(([k, x, y]) => { shape(c, () => ell(c, x, y, 62, 62), COL.steel, 7); mark(c, x, y, k, 26, INK); });
  // a die
  c.save(); c.translate(880, 640); c.rotate(0.2); shape(c, () => rrect(c, -50, -50, 100, 100, 16), WHITE, 7);
  for (const [a, b] of [[-22, -22], [22, 22], [0, 0], [-22, 22], [22, -22]]) shape(c, () => ell(c, a, b, 8, 8), INK, 0);
  c.restore();
};
// ---------------------------------------------------------------- 25 flow c2: one swing, three children, equal turns
const swing = (c: Ctx) => {
  plain(c, COL.sky);
  c.fillStyle = COL.greenLt; c.fillRect(0, 840, D, 240); line(c, [[0, 840], [D, 840]], 6);
  // swing frame
  line(c, [[90, 840], [250, 220]], 28, INK); line(c, [[90, 840], [250, 220]], 16, COL.blueDk);
  line(c, [[410, 840], [250, 220]], 28, INK); line(c, [[410, 840], [250, 220]], 16, COL.blueDk);
  line(c, [[250, 220], [250, 220]], 28, INK);
  line(c, [[90, 840], [250, 220]], 16, COL.blueDk); line(c, [[410, 840], [250, 220]], 16, COL.blueDk);
  line(c, [[250, 220], [200, 640]], 6); line(c, [[250, 220], [300, 640]], 6);
  shape(c, () => rrect(c, 180, 630, 140, 26, 8), COL.wood, 6);
  // three children by height: 5, 8 and 10 years
  person(c, 560, 960, 300, {}); person(c, 740, 960, 380, { adult: false }); person(c, 930, 960, 440, {});
  // three equal parts of a timer
  const px = 800, py = 330, pr = 190;
  const cols = [COL.red, COL.blue, COL.green];
  cols.forEach((col, i) => { const a0 = -Math.PI / 2 + (i * 2 * Math.PI) / 3, a1 = a0 + (2 * Math.PI) / 3; shape(c, () => { c.moveTo(px, py); c.arc(px, py, pr, a0, a1); c.closePath(); }, col, 7); });
  shape(c, () => ell(c, px, py, 26, 26), WHITE, 6);
};

export const ic_meAndOthersMeAndOthersL3 = cards("sci.me-and-others.me-and-others.L3 cards", [
  intro, summary, pov, turn, belief, falseBelief, mind, together, domEye, lefty,
  rickshaw, mirror, marble, hidden, umbrella, jigsaw, otherChair, eyeTest, watchmen, surprise,
  jigsawDrink, crocodile, venn, skit, raceGame, swing,
]);
void [WHITE, D, polyP, COL];
