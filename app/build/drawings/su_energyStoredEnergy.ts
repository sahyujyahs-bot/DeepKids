import type { Ctx } from "./core";
import { D, INK, COL, RED, SKIN, CLOTH, shape, ell, rrect, shadow, shade, line, shine, arrow, hand, write, cards } from "./flatKit";

// STORED ENERGY (L3) · set-up cards for the Roll-Back Jar and the Tired Cell.

// ---------------------------------------------------------------- shared pieces
const TILE = "#e7d9bd";
// a tiled floor, the whole card
const floor = (c: Ctx) => {
  c.fillStyle = TILE; c.fillRect(0, 0, D, D); c.strokeStyle = "rgba(43,35,64,0.16)"; c.lineWidth = 4;
  for (let v = 0; v <= D; v += 135) { c.beginPath(); c.moveTo(v, 0); c.lineTo(v, D); c.stroke(); c.beginPath(); c.moveTo(0, v); c.lineTo(D, v); c.stroke(); }
};
const BAND = COL.orange, BANDDK = "#d27c25";
// a rubber band lying as a ring
const bandRing = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  c.beginPath(); ell(c, 0, 0, rx, ry); c.strokeStyle = INK; c.lineWidth = 26; c.stroke();
  c.beginPath(); ell(c, 0, 0, rx, ry); c.strokeStyle = BAND; c.lineWidth = 14; c.stroke();
  c.restore();
};
// a steel padlock, body centre (x, y), scale s
const padlock = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const sh = () => { c.moveTo(-26, -30); c.lineTo(-26, -62); c.arc(0, -62, 26, Math.PI, 0); c.lineTo(26, -30); };
  c.beginPath(); sh(); c.strokeStyle = INK; c.lineWidth = 22; c.lineCap = "round"; c.lineJoin = "round"; c.stroke();
  c.beginPath(); sh(); c.strokeStyle = COL.steelDk; c.lineWidth = 10; c.stroke();
  shape(c, () => rrect(c, -48, -36, 96, 76, 14), COL.steel);
  shade(c, () => rrect(c, -48, -36, 96, 76, 14), COL.steelDk, 20, 0);
  shape(c, () => ell(c, 0, -4, 11, 11), INK, 0); shape(c, () => rrect(c, -5, -4, 10, 26, 4), INK, 0);
  c.restore();
};
// a half matchstick lying along angle an from (x, y): wood with a red head at its far end
const stick = (c: Ctx, x: number, y: number, len: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -9, len, 18, 7), COL.wood, 5);
  shape(c, () => ell(c, len, 0, 17, 14), COL.red, 5);
  c.restore();
};
// the clear round jar lying on its side, lid (blue, with a hole) towards the right. `inside` is drawn behind the
// glass, `over` in front of everything. cx, cy = middle of the body, R = radius of the body.
const jarSide = (c: Ctx, cx: number, cy: number, len: number, R: number, inside?: () => void, over?: () => void) => {
  const k = 0.28, x0 = cx - len / 2, x1 = cx + len / 2, L = R + 8;
  shadow(c, cx + 30, cy + R + 14, len * 0.58, 26);
  const body = () => { c.moveTo(x0, cy - R); c.lineTo(x1, cy - R); c.lineTo(x1, cy + R); c.lineTo(x0, cy + R); c.ellipse(x0, cy, R * k, R, 0, Math.PI / 2, Math.PI * 1.5); c.closePath(); };
  shape(c, body, COL.glass, 5);
  inside?.();
  shine(c, [[x0 + 20, cy - R * 0.72], [x1 - 100, cy - R * 0.72]], 9);
  const cap = () => { c.moveTo(x1 - 70, cy - L); c.lineTo(x1, cy - L); c.lineTo(x1, cy + L); c.lineTo(x1 - 70, cy + L); c.closePath(); };
  shape(c, cap, COL.blue, 5); shade(c, cap, COL.blueDk, 0, 40);
  shape(c, () => ell(c, x1, cy, L * k, L), COL.blue, 5);
  shape(c, () => ell(c, x1, cy, L * k * 0.3, L * 0.13), INK, 0);
  over?.();
};
// the strip of tape that marks the turns, wrapped round the jar
const tapeStrip = (c: Ctx, x: number, cy: number, R: number) => shape(c, () => rrect(c, x, cy - R, 46, R * 2, 4), RED, 4);
// the band stretched through the jar from base to lid; twisted = wound up tight
const bandInside = (c: Ctx, xa: number, xb: number, cy: number, twisted: boolean) => {
  const A: number[][] = [], B: number[][] = [];
  for (let i = 0; i <= 70; i++) {
    const t = i / 70, x = xa + (xb - xa) * t, a = twisted ? Math.sin(t * Math.PI * 6) * 30 * Math.min(1, t * 8, (1 - t) * 8) : 10;
    A.push([x, cy + a]); B.push([x, cy - a]);
  }
  line(c, A, 26, INK); line(c, B, 26, INK); line(c, A, 14, BAND); line(c, B, 14, BANDDK);
};
// a matchstick across the hole on the lid
const lidStick = (c: Ctx, x1: number, cy: number) => shape(c, () => rrect(c, x1 - 9, cy - 64, 18, 128, 7), COL.wood, 5);

// ---------------------------------------------------------------- the Roll-Back Jar
// setup.e1.0
const e1s0 = (c: Ctx) => {
  floor(c);
  jarSide(c, 380, 370, 440, 140);
  // the padlock
  shadow(c, 880, 405, 80, 16); padlock(c, 860, 340, 1.25);
  // a chain of three rubber bands
  shadow(c, 830, 625, 190, 26);
  bandRing(c, 720, 600, 80, 40); bandRing(c, 830, 600, 80, 40); bandRing(c, 940, 600, 80, 40);
  // two half matchsticks
  shadow(c, 300, 800, 140, 18);
  stick(c, 150, 760, 150, 0.1); stick(c, 160, 830, 150, -0.08);
  // a roll of cello tape
  shadow(c, 560, 860, 110, 24);
  shape(c, () => ell(c, 560, 810, 100, 70), "rgba(150,190,225,0.9)", 5);
  shape(c, () => ell(c, 560, 785, 100, 70), "rgba(214,236,250,0.9)", 5);
  shape(c, () => ell(c, 560, 785, 48, 33), TILE, 5);
  shine(c, [[500, 740], [560, 722]], 8);
  // a reel of thread
  shadow(c, 835, 880, 90, 20);
  shape(c, () => rrect(c, 770, 745, 130, 26, 9), COL.woodDk, 5);
  shape(c, () => rrect(c, 790, 770, 90, 110, 6), COL.purple, 5);
  shade(c, () => rrect(c, 790, 770, 90, 110, 6), "#6a4fa8", 30, 0);
  for (let k = 0; k < 4; k++) line(c, [[792, 790 + k * 25], [878, 790 + k * 25]], 3, "#6a4fa8");
  shape(c, () => rrect(c, 770, 880, 130, 26, 9), COL.woodDk, 5);
  line(c, [[900, 836], [960, 850], [985, 810]], 5, COL.purple);
};

// setup.e1.1
const e1s1 = (c: Ctx) => {
  floor(c);
  const cx = 500, cy = 470, len = 600, R = 170, k = 0.28, x0 = cx - len / 2, x1 = cx + len / 2;
  const xl = x0 - R * k - 60, xr = x1 + (R + 8) * k + 60, xm = cx - 40, sag = (t: number) => 24 * 4 * t * (1 - t);
  jarSide(c, cx, cy, len, R, undefined, () => {
    // matchsticks outside, the band through both holes and round each stick, the padlock on a thread
    shadow(c, xl + 8, cy + 76, 30, 10); shadow(c, xr + 8, cy + 76, 30, 10);
    shape(c, () => rrect(c, xl - 9, cy - 70, 18, 140, 7), COL.wood, 5);
    shape(c, () => rrect(c, xr - 9, cy - 70, 18, 140, 7), COL.wood, 5);
    const P: number[][] = [];
    for (let i = 0; i <= 40; i++) { const t = i / 40; P.push([xl + (xr - xl) * t, cy + sag(t)]); }
    line(c, P, 26, INK); line(c, P, 14, BAND);
    bandRing(c, xl, cy, 22, 44); bandRing(c, xr, cy, 22, 44);
    line(c, [[xm, cy + 22], [xm, cy + 52]], 14, INK); line(c, [[xm, cy + 22], [xm, cy + 52]], 6, COL.purple);
    padlock(c, xm, cy + 122, 0.8);
  });
};

// setup.e1.2
const e1s2 = (c: Ctx) => {
  floor(c);
  const cx = 520, cy = 600, len = 480, R = 150, x0 = cx - len / 2, x1 = cx + len / 2;
  jarSide(c, cx, cy, len, R, () => {
    bandInside(c, x0 - 40, x1 - 70, cy, true);
    line(c, [[cx, cy], [cx, cy + 36]], 6, COL.purple);
    padlock(c, cx, cy + 100, 0.75);
  }, () => { tapeStrip(c, x0 + 90, cy, R); lidStick(c, x1, cy); });
  hand(c, 270, 320, 0.7, 2.1, SKIN.child, CLOTH.child, true);
  arrow(c, [[300, 880], [800, 880]]);
};

// setup.e1.3
const e1s3 = (c: Ctx) => {
  floor(c);
  // chalk start line on the left
  line(c, [[150, 330], [150, 790]], 22, INK); line(c, [[150, 330], [150, 790]], 12, "#fffaf0");
  const cx = 560, cy = 520, len = 440, R = 140, x0 = cx - len / 2, x1 = cx + len / 2;
  jarSide(c, cx, cy, len, R, () => { bandInside(c, x0 - 40, x1 - 70, cy, false); line(c, [[cx, cy], [cx, cy + 36]], 6, COL.purple); padlock(c, cx, cy + 92, 0.7); }, () => { tapeStrip(c, x0 + 80, cy, R); lidStick(c, x1, cy); });
  arrow(c, [[480, 300], [230, 300]]);
  for (const dy of [-60, 0, 60]) line(c, [[x1 + 100, cy + dy], [x1 + 190, cy + dy]], 9, COL.greyDk);
  // the tailor's tape along the floor, 0 at the chalk line
  shadow(c, 560, 905, 440, 20);
  shape(c, () => rrect(c, 150, 810, 800, 80, 6), COL.yellow, 5);
  for (let i = 0; i <= 78; i++) { const x = 150 + i * 10, big = i % 10 === 0; line(c, [[x, 810], [x, 810 + (big ? 30 : i % 5 === 0 ? 22 : 14)]], big ? 5 : 3); }
  for (let i = 0; i <= 7; i++) write(c, String(i * 10), 150 + i * 100 - (i ? 22 : 8), 846, 30, INK, 5);
  line(c, [[x0 - 42, 790], [x0 - 42, 900]], 8, RED);
};

// ---------------------------------------------------------------- the Tired Cell
const star = (c: Ctx, x: number, y: number, r: number) =>
  shape(c, () => { c.moveTo(x, y - r); c.quadraticCurveTo(x, y, x + r, y); c.quadraticCurveTo(x, y, x, y + r); c.quadraticCurveTo(x, y, x - r, y); c.quadraticCurveTo(x, y, x, y - r); c.closePath(); }, COL.yellow, 4);
// an AA cell centred at (x, y), the + end towards angle rot (0 = right). fresh = bright, tired = dull
const aaCell = (c: Ctx, x: number, y: number, len: number, r: number, rot: number, fresh: boolean) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const body = () => rrect(c, -len / 2, -r, len, r * 2, r * 0.3);
  shape(c, () => rrect(c, len / 2 - 4, -r * 0.32, 22, r * 0.64, 6), COL.steel, 5);
  shape(c, body, fresh ? COL.teal : COL.grey);
  shade(c, body, fresh ? COL.tealDk : COL.greyDk, 0, r * 0.45);
  shape(c, () => rrect(c, -len / 2, -r, len * 0.13, r * 2, r * 0.3), COL.steel, 5);
  shape(c, () => rrect(c, len * 0.26, -r, len * 0.24, r * 2, r * 0.3), COL.orange, 5);
  line(c, [[len * 0.38 - r * 0.28, 0], [len * 0.38 + r * 0.28, 0]], 8, INK); line(c, [[len * 0.38, -r * 0.28], [len * 0.38, r * 0.28]], 8, INK);
  line(c, [[-len * 0.2, -r * 0.45], [len * 0.15, -r * 0.45]], 7, fresh ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)");
  c.restore();
};
// a torch standing with its lens down; top of the handle at (x, y)
const torch = (c: Ctx, x: number, y: number, bright: boolean) => {
  const ly = y + 340, W = bright ? 235 : 105;
  c.beginPath(); c.moveTo(x - 90, ly); c.lineTo(x + 90, ly); c.lineTo(x + W, ly + 300); c.lineTo(x - W, ly + 300); c.closePath();
  c.fillStyle = bright ? "rgba(255,211,77,0.65)" : "rgba(255,240,190,0.3)"; c.fill();
  c.beginPath(); ell(c, x, ly + 300, W, 44); c.fillStyle = bright ? "rgba(255,226,120,0.95)" : "rgba(255,240,190,0.3)"; c.fill();
  shape(c, () => rrect(c, x - 55, y, 110, 270, 22), COL.teal);
  shade(c, () => rrect(c, x - 55, y, 110, 270, 22), COL.tealDk, 26, 0);
  shape(c, () => rrect(c, x - 20, y + 60, 40, 70, 16), COL.steel, 5);
  shape(c, () => { c.moveTo(x - 62, y + 262); c.lineTo(x + 62, y + 262); c.lineTo(x + 92, ly); c.lineTo(x - 92, ly); c.closePath(); }, COL.steel);
  shade(c, () => { c.moveTo(x - 62, y + 262); c.lineTo(x + 62, y + 262); c.lineTo(x + 92, ly); c.lineTo(x - 92, ly); c.closePath(); }, COL.steelDk, 30, 0);
  shape(c, () => ell(c, x, ly, 92, 22), bright ? COL.yellow : "#cfc9bb", 5);
  if (bright) for (const [dx, dy] of [[-120, 40], [0, 60], [120, 40]]) line(c, [[x + dx, ly + 20 + dy * 0.2], [x + dx * 1.35, ly + 20 + dy]], 7, COL.yellow);
};

// setup.e2.0
const e2s0 = (c: Ctx) => {
  c.fillStyle = "#efe4cf"; c.fillRect(0, 0, D, D);
  c.fillStyle = "#6a62a0"; c.fillRect(0, 440, D, 640);
  line(c, [[0, 440], [D, 440]], 6);
  line(c, [[540, 60], [540, D]], 5, "rgba(43,35,64,0.25)");
  // the two cells
  shadow(c, 290, 330, 70, 14); shadow(c, 830, 330, 70, 14);
  aaCell(c, 270, 190, 250, 56, -Math.PI / 2, true);
  aaCell(c, 810, 190, 250, 56, -Math.PI / 2, false);
  star(c, 160, 110, 34); star(c, 395, 160, 26); star(c, 150, 260, 20);
  // two torches, the same torch, lens down
  torch(c, 270, 330, true);
  torch(c, 810, 330, false);
};

// setup.e2.1
const e2s1 = (c: Ctx) => {
  c.fillStyle = "#efe4cf"; c.fillRect(0, 0, D, D);
  const cx = 460, cy = 450, r = 340;
  shadow(c, cx + 24, cy + r + 18, r * 0.9, 30);
  // the back of a round wall clock with its hook
  shape(c, () => { c.moveTo(cx - 40, cy - r + 10); c.lineTo(cx, cy - r - 50); c.lineTo(cx + 40, cy - r + 10); c.closePath(); }, COL.steel, 5);
  shape(c, () => ell(c, cx, cy, r, r), COL.grey);
  shade(c, () => ell(c, cx, cy, r, r), COL.greyDk, 40, 40);
  shape(c, () => ell(c, cx, cy, r - 40, r - 40), COL.grey, 4);
  // the open battery space: a spring at the - end, the + end at the right
  shape(c, () => rrect(c, 290, 370, 340, 120, 18), COL.black);
  const Z: number[][] = [[300, 430]];
  for (let i = 0; i < 6; i++) Z.push([314 + i * 12, i % 2 ? 400 : 460]);
  Z.push([388, 430]);
  line(c, Z, 15, INK); line(c, Z, 7, COL.steel);
  write(c, "-", 296, 300, 56, INK, 8); write(c, "+", 592, 300, 56, INK, 8);
  // the cell on its way in, flat (-) end first, in a child's hand
  aaCell(c, 545, 440, 280, 52, 0, true);
  c.save(); c.translate(790, 470); c.scale(1, -1);
  hand(c, 0, 0, Math.PI - 0.1, 1.8, SKIN.child, CLOTH.child);
  c.restore();
  arrow(c, [[560, 585], [440, 585]]);
};

// setup.e2.2
const e2s2 = (c: Ctx) => {
  c.fillStyle = "#efe4cf"; c.fillRect(0, 0, D, D);
  const cx = 320, cy = 540, r = 270, at = (a: number, l: number) => [cx + Math.sin(a) * l, cy - Math.cos(a) * l];
  shadow(c, cx + 20, cy + r + 24, r * 0.9, 30);
  shape(c, () => ell(c, cx, cy, r, r), COL.teal);
  shade(c, () => ell(c, cx, cy, r, r), COL.tealDk, 24, 24);
  shape(c, () => ell(c, cx, cy, r * 0.86, r * 0.86), COL.paper, 5);
  for (let h = 0; h < 12; h++) { const a = (h / 12) * Math.PI * 2, big = h % 3 === 0; line(c, [at(a, r * (big ? 0.68 : 0.72)), at(a, r * 0.8)], big ? 9 : 5); }
  write(c, "12", cx - 26, cy - r * 0.62 - 20, 40, INK, 6); write(c, "6", cx - 12, cy + r * 0.45, 40, INK, 6);
  write(c, "3", cx + r * 0.5, cy - 20, 40, INK, 6); write(c, "9", cx - r * 0.62, cy - 20, 40, INK, 6);
  const rad = Math.PI / 180;
  line(c, [[cx, cy], at(300 * rad, r * 0.45)], 18); // hour hand, near 10
  line(c, [[cx, cy], at(60 * rad, r * 0.66)], 12); // minute hand, near 2
  line(c, [at(190 * rad, -r * 0.14), at(190 * rad, r * 0.74)], 9, INK); line(c, [at(190 * rad, -r * 0.14), at(190 * rad, r * 0.74)], 4, RED);
  shape(c, () => ell(c, cx, cy, 16, 16), RED, 5);
  const arc: number[][] = [];
  for (let a = 215; a <= 262; a += 4) arc.push(at(a * rad, r * 0.5));
  arrow(c, arc);
  // the phone beside it, showing the same time
  line(c, [[610, 520], [676, 520]], 10); line(c, [[610, 570], [676, 570]], 10);
  shadow(c, 850, 830, 150, 24);
  shape(c, () => rrect(c, 700, 280, 290, 540, 40), COL.black);
  shape(c, () => rrect(c, 718, 318, 254, 464, 18), "#22303a", 4);
  const lime = "#c9f06b";
  write(c, "10", 735, 510, 64, lime, 9); write(c, "10", 850, 510, 64, lime, 9);
  shape(c, () => ell(c, 836, 528, 5, 5), lime, 0); shape(c, () => ell(c, 836, 556, 5, 5), lime, 0);
};

export const su_energyStoredEnergy = cards("sci.energy.stored-energy.L3 set-up", [e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2]);
