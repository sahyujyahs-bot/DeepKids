import type { Ctx } from "./core";
import {
  INK, BG, WHITE, RED, COL, SKIN, CLOTH, D, SH, shape, ell, rrect, polyP, shadow, shade, line, shine, arrow, hand, write, cards, ground,
} from "./flatKit";

// PUSH AND PULL · set-up cards for the three experiments (towel push, balloon rocket, ball and straws)

const FLOOR = "#e6d5b3", FLOORDK = "#cdb88f", PINK = "#f06f9a", PINKDK = "#c9507b", TAPE = "#f5e7a6", TOWEL = COL.blue;
const floorBand = (c: Ctx, y: number) => {
  c.fillStyle = FLOOR; c.fillRect(0, y, D, D - y);
  c.strokeStyle = FLOORDK; c.lineWidth = 3;
  for (let x = -40; x < D + 200; x += 170) { c.beginPath(); c.moveTo(x, y); c.lineTo(x - 90, D); c.stroke(); }
  line(c, [[0, y], [D, y]], 6);
};
// a drinking straw from (x1,y1) to (x2,y2), blue and white stripes
const straw = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w: number) => {
  const len = Math.hypot(x2 - x1, y2 - y1), an = Math.atan2(y2 - y1, x2 - x1);
  c.save(); c.translate(x1, y1); c.rotate(an);
  const p = () => rrect(c, 0, -w / 2, len, w, w / 2.4);
  shape(c, p, WHITE, 0);
  c.save(); c.beginPath(); p(); c.clip(); c.fillStyle = COL.blue;
  for (let x = -w; x < len; x += w * 1.5) { c.beginPath(); polyP(c, [[x, -w], [x + w * 0.6, -w], [x + w * 0.6 + w, w], [x + w, w]]); c.fill(); }
  c.fillStyle = "rgba(43,35,64,0.22)"; c.fillRect(0, w * 0.15, len, w); c.restore();
  shape(c, p, "rgba(0,0,0,0)", 5);
  c.restore();
};
// thread: ink edge with a pale core so it shows on any ground
const thread = (c: Ctx, pts: number[][], w = 7) => { line(c, pts, w + 6, INK); line(c, pts, w, COL.cloth); };
// a wooden chair seen from the side, back post at x, standing on y; dir 1 = seat towards the right
const chair = (c: Ctx, x: number, fy: number, s: number, dir: number) => {
  c.save(); c.translate(x, fy); c.scale(dir * s, s);
  shadow(c, 100, 8, 150, 14);
  const leg = (lx: number) => { shape(c, () => rrect(c, lx, -190, 26, 190, 6), COL.woodDk, 6); };
  leg(160);
  shape(c, () => rrect(c, 0, -430, 28, 430, 8), COL.wood, 6);
  shade(c, () => rrect(c, 0, -430, 28, 430, 8), COL.woodDk, 9, 0, 0.7);
  shape(c, () => rrect(c, -4, -230, 196, 40, 10), COL.wood, 6);
  shade(c, () => rrect(c, -4, -230, 196, 40, 10), COL.woodDk, 0, 14, 0.7);
  shape(c, () => rrect(c, -6, -440, 40, 36, 10), COL.wood, 6);
  c.restore();
};
// a long balloon lying along x, body from (x, y) to (x+len, y), neck on the right (side = 1) or left (-1)
const balloon = (c: Ctx, x: number, y: number, len: number, h: number, side = 1) => {
  c.save(); c.translate(x + len / 2, y); c.scale(side, 1);
  const hl = len / 2, p = () => { c.moveTo(-hl + h / 2, -h / 2); c.lineTo(hl - h / 2, -h / 2); c.arc(hl - h / 2, 0, h / 2, -Math.PI / 2, Math.PI / 2); c.lineTo(-hl + h / 2, h / 2); c.arc(-hl + h / 2, 0, h / 2, Math.PI / 2, Math.PI * 1.5); c.closePath(); };
  const neck = () => { c.moveTo(-hl + 6, -h * 0.13); c.lineTo(-hl - h * 0.4, -h * 0.13); c.lineTo(-hl - h * 0.4, h * 0.13); c.lineTo(-hl + 6, h * 0.13); c.closePath(); };
  shape(c, neck, PINKDK, 5);
  shape(c, () => rrect(c, -hl - h * 0.55, -h * 0.2, h * 0.2, h * 0.4, h * 0.1), PINK, 5);
  shape(c, p, PINK, 6); shade(c, p, PINKDK, 0, h * 0.28, 0.6);
  shine(c, [[hl - h * 0.35, -h * 0.28], [-hl + h * 0.9, -h * 0.28]], 9);
  c.restore();
};
// a top-down child's head blowing through a straw: face towards angle an, shoulders behind
const blower = (c: Ctx, x: number, y: number, r: number, an: number, cloth: string, clothDk: string) => {
  c.save(); c.translate(x, y); c.rotate(an);
  const sh = () => ell(c, -r * 1.25, 0, r * 0.85, r * 1.7);
  shape(c, sh, cloth, 6); shade(c, sh, clothDk, -r * 0.2, r * 0.35, 0.6);
  shape(c, () => ell(c, -r * 0.05, -r * 0.98, r * 0.2, r * 0.3), SKIN.child, 5); shape(c, () => ell(c, -r * 0.05, r * 0.98, r * 0.2, r * 0.3), SKIN.child, 5);
  shape(c, () => ell(c, 0, 0, r, r), SKIN.child, 6);
  c.save(); c.beginPath(); ell(c, 0, 0, r, r); c.clip(); shape(c, () => ell(c, -r * 0.78, 0, r * 0.85, r * 1.1), CLOTH.hair, 0); c.restore();
  c.beginPath(); ell(c, 0, 0, r, r); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  shape(c, () => ell(c, r * 0.68, -r * 0.5, r * 0.28, r * 0.28), "#e48a7c", 0); shape(c, () => ell(c, r * 0.68, r * 0.5, r * 0.28, r * 0.28), "#e48a7c", 0);
  for (const sy of [-1, 1]) { shape(c, () => ell(c, r * 0.24, sy * r * 0.36, r * 0.17, r * 0.17), WHITE, 3); shape(c, () => ell(c, r * 0.28, sy * r * 0.36, r * 0.08, r * 0.08), INK, 0); }
  shape(c, () => ell(c, r * 0.9, 0, r * 0.1, r * 0.13), INK, 0);
  c.restore();
};
// a yellow measuring tape strip along x from x0 at y; 0 at x0, every `step` units is one `gap` px
const tapeStrip = (c: Ctx, x0: number, x1: number, y: number, hgt: number, gap: number, step: number, lab: number) => {
  shape(c, () => rrect(c, x0 - 14, y, x1 - x0 + 14, hgt, 6), COL.yellow, 6);
  for (let i = 0; x0 + i * gap / step <= x1 - 4; i++) {
    const x = x0 + (i * gap) / step, big = i % step === 0;
    line(c, [[x, y], [x, y + (big ? hgt * 0.5 : hgt * 0.28)]], big ? 4 : 2.5);
    if (big) write(c, String(i / step * 10), x - (i / step >= 1 ? lab * 0.4 : lab * 0.2) * (String(i / step * 10).length), y + hgt * 0.5 + 3, lab, INK, 4);
  }
};

// setup.e1.0.0
const e1Room = (c: Ctx, fy: number, Wx: number) => {
  floorBand(c, fy);
  c.fillStyle = COL.sky; c.fillRect(Wx, 0, D - Wx, fy);
  c.strokeStyle = COL.glassEdge; c.lineWidth = 3; for (let y = 0; y < fy; y += 100) { c.beginPath(); c.moveTo(Wx, y); c.lineTo(D, y); c.stroke(); } for (let x = Wx + 100; x < D; x += 100) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, fy); c.stroke(); }
  line(c, [[Wx, 0], [Wx, fy]], 8);
};
const e1Scene = (c: Ctx, draw: (fy: number) => void) => {
  ground(c, BG); c.save(); c.translate(1080, 1000); c.scale(1.15, 1.15); c.translate(-1080, -1000 + 0);
  const fy = 820; e1Room(c, fy, 800); draw(fy); c.restore();
};
const e1_0 = (c: Ctx) => e1Scene(c, (fy) => sitter(c, 500, fy, false));
const towel = (c: Ctx, x0: number, x1: number, fy: number) => {
  shadow(c, (x0 + x1) / 2 + 20, fy + 8, (x1 - x0) / 2 + 20, 14);
  const p = () => rrect(c, x0, fy - 34, x1 - x0, 34, 8);
  shape(c, p, TOWEL, 6); shade(c, p, COL.blueDk, 0, 14, 0.7);
  c.save(); c.beginPath(); p(); c.clip(); for (const sx of [x0 + 26, x1 - 44]) { c.fillStyle = WHITE; c.fillRect(sx, fy - 40, 14, 50); } c.restore();
  shape(c, p, "rgba(0,0,0,0)", 6);
};
// a child sitting on the towel, side view, hip at hx; straight = legs out flat, else knees bent
const sitter = (c: Ctx, hx: number, fy: number, straight: boolean) => {
  const y0 = fy - 34, hip: number[] = [hx + 10, y0 - 50], ank = straight ? [hx + 290, y0 - 62] : [hx + 262, y0 - 52], knee = straight ? [hx + 150, y0 - 58] : [hx + 150, y0 - 190];
  towel(c, hx - 170, hx + 100, fy);
  const legs = [hip, knee, ank];
  line(c, legs, 76, INK); line(c, legs, 62, "#6b5a8c");
  // foot: sole flat on the wall side
  shape(c, () => rrect(c, ank[0] - 16, ank[1] - 52, 52, 104, 22), SKIN.child, 6);
  const tor = () => rrect(c, hx - 70, y0 - 340, 140, 310, 46);
  shape(c, tor, CLOTH.child); shade(c, tor, CLOTH.childDk, 26, 0);
  const hy = y0 - 430;
  shape(c, () => ell(c, hx + 10, hy, 82, 86), SKIN.child);
  shape(c, () => { c.moveTo(hx - 70, hy + 10); c.bezierCurveTo(hx - 80, hy - 120, hx + 95, hy - 120, hx + 90, hy - 20); c.quadraticCurveTo(hx + 20, hy - 40, hx - 70, hy + 10); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, hx + 80, hy + 16, 16, 12), SKIN.child, 4);
  shape(c, () => ell(c, hx + 50, hy + 4, 9, 13), INK, 0);
  c.beginPath(); c.arc(hx + 52, hy + 36, 18, 0.2, Math.PI - 0.6); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  // arm down to the hand on the towel
  const arm = [[hx + 8, y0 - 285], [hx + 60, y0 - 160], [hx + 120, y0 - 50]];
  line(c, arm, 56, INK); line(c, arm, 44, CLOTH.child);
  shape(c, () => ell(c, arm[2][0], arm[2][1] - 4, 28, 26), SKIN.child, 5);
};

// setup.e1.1.1
const e1_1 = (c: Ctx) => e1Scene(c, (fy) => {
  line(c, [[350, fy + 14], [350, fy + 96]], 16, WHITE); line(c, [[350, fy + 14], [350, fy + 96]], 6, "#d9d2c0");
  sitter(c, 400, fy, true);
  arrow(c, [[325, fy + 150], [215, fy + 150]], RED, 13);
});

// setup.e1.2.2
const e1_2 = (c: Ctx) => {
  ground(c, "#e9dcc0");
  c.strokeStyle = FLOORDK; c.lineWidth = 4;
  for (let x = 0; x <= D; x += 180) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, D); c.stroke(); }
  for (let y = 0; y <= D; y += 180) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
  const y = 640, hgt = 84, x0 = 170, g = 90;
  for (const x of [x0, x0 + 6 * g]) { line(c, [[x, y - 130], [x, y + hgt + 130]], 22, WHITE); line(c, [[x, y - 130], [x, y + hgt + 130]], 8, "#d9d2c0"); }
  shadow(c, 700, y + hgt + 14, 520, 14);
  tapeStrip(c, x0, 905, y, hgt, g, 1, 34);
  // the tape case at the far end
  shape(c, () => rrect(c, 850, y - 34, 190, hgt + 68, 30), COL.steel); shade(c, () => rrect(c, 850, y - 34, 190, hgt + 68, 30), COL.steelDk, 24, 24, 0.6);
  shape(c, () => ell(c, 945, y + hgt / 2, 36, 36), COL.steelIn, 5);
  hand(c, x0 + 6, 470, Math.PI / 2, 1.9, SKIN.adult, CLOTH.adult, true);
  hand(c, x0 + 6 * g + 6, 470, Math.PI / 2, 1.9, SKIN.adult, CLOTH.adult, true);
};

const chairPair = (c: Ctx, fy: number, s: number) => {
  chair(c, 30, fy, s, 1); chair(c, D - 30, fy, s, -1);
};
const knot = (c: Ctx, x: number, y: number) => shape(c, () => ell(c, x, y, 16, 13), COL.cloth, 5);

// setup.e2.0.0
const e2_0 = (c: Ctx) => {
  ground(c, BG); const fy = 860, s = 1.25;
  floorBand(c, fy);
  chairPair(c, fy, s);
  const ty = fy - 400 * s, lx = 30 + 28 * s, rx = D - 30 - 28 * s;
  thread(c, [[lx, ty], [rx, ty + 8]], 9);
  knot(c, lx + 6, ty); knot(c, rx - 6, ty + 8);
  straw(c, 320, ty + 3, 760, ty + 3, 66);
};

// setup.e2.1.1
const e2_1 = (c: Ctx) => {
  ground(c, BG);
  const sy = 330;
  thread(c, [[0, sy], [D, sy]]);
  straw(c, 130, sy, 700, sy, 56);
  balloon(c, 70, 560, 680, 170, -1);
  for (const x of [230, 600]) { const p = () => rrect(c, x - 32, sy - 5, 64, 180, 6); shape(c, p, "rgba(245,231,166,0.9)", 4); line(c, [[x - 32, sy + 60], [x + 32, sy + 60]], 2, "rgba(43,35,64,0.25)"); }
  hand(c, 905, 598, Math.PI + 0.55, 1.7, SKIN.child, CLOTH.child, false);
};

// setup.e2.2.2
const e2_2 = (c: Ctx) => {
  ground(c, BG); const fy = 700, s = 0.9;
  floorBand(c, fy);
  chairPair(c, fy, s);
  const ty = fy - 400 * s, lx = 30 + 28 * s, rx = D - 30 - 28 * s;
  thread(c, [[lx, ty], [rx, ty]]);
  const bx = 540;
  straw(c, bx, ty, bx + 290, ty, 34);
  balloon(c, bx - 10, ty + 100, 340, 110, 1);
  // air rushing out of the neck, backwards
  for (const [dy, l] of [[-40, 190], [0, 250], [40, 190]]) { const x = bx - 70; line(c, [[x - 10, ty + 100 + dy], [x - l * 0.5, ty + 100 + dy * 1.7], [x - l, ty + 100 + dy * 2.2]], 16, COL.sky); line(c, [[x - 10, ty + 100 + dy], [x - l * 0.5, ty + 100 + dy * 1.7], [x - l, ty + 100 + dy * 2.2]], 6, WHITE); }
  arrow(c, [[bx + 40, ty - 80], [bx + 300, ty - 80]], RED, 12);
  const ey = 820;
  tapeStrip(c, 200, 1000, ey, 80, 100, 1, 30);
  line(c, [[bx + 330, ty + 160], [bx + 330, ey]], 5, INK);
  line(c, [[bx + 330, ey - 34], [bx + 330, ey + 30]], 10, RED);
};

// a flat tray from above and a white ball; the tray stays the same on all three cards
const tray = (c: Ctx) => {
  const p = () => rrect(c, 300, 180, 480, 580, 40);
  shadow(c, 555, 790, 250, 20);
  shape(c, p, COL.teal); shade(c, p, COL.tealDk, 14, 14, 0.6);
  shape(c, () => rrect(c, 335, 215, 410, 510, 26), "#8fd6cf", 5);
};
const pball = (c: Ctx, x: number, y: number, r = 56, ghost = false) => {
  if (ghost) { c.save(); c.setLineDash([14, 14]); c.beginPath(); ell(c, x, y, r, r); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); c.restore(); return; }
  shadow(c, x + r * 0.2, y + r * 0.35, r * 1.05, r * 0.95);
  const p = () => ell(c, x, y, r, r);
  shape(c, p, WHITE, 6); shade(c, p, "#c9c2d6", r * 0.35, r * 0.35, 0.8);
  shine(c, [[x - r * 0.55, y - r * 0.2], [x - r * 0.2, y - r * 0.6]], 8);
};

// setup.e3.0.0
const e3_0 = (c: Ctx) => {
  ground(c, BG); tray(c); pball(c, 540, 470, 75);
  straw(c, 540, 960, 540, 760, 40);
};

// setup.e3.1.1
const e3_1 = (c: Ctx) => {
  ground(c, BG); tray(c);
  straw(c, 275, 470, 450, 470, 26); straw(c, 805, 470, 630, 470, 26);
  blower(c, 190, 470, 85, 0, CLOTH.child, CLOTH.childDk);
  blower(c, 890, 470, 85, Math.PI, COL.pink, "#d2708c");
  pball(c, 540, 470, 75);
  arrow(c, [[320, 370], [450, 370]], RED, 10); arrow(c, [[760, 370], [630, 370]], RED, 10);
};

// setup.e3.2.2
const e3_2 = (c: Ctx) => {
  ground(c, BG); tray(c);
  straw(c, 275, 470, 440, 470, 26); straw(c, 540, 795, 540, 640, 26);
  blower(c, 190, 470, 85, 0, CLOTH.child, CLOTH.childDk);
  blower(c, 540, 880, 85, -Math.PI / 2, COL.pink, "#d2708c");
  pball(c, 540, 470, 75, true);
  pball(c, 690, 320, 75);
  arrow(c, [[585, 425], [640, 370]], RED, 11);
  arrow(c, [[320, 390], [440, 390]], RED, 10); arrow(c, [[640, 740], [640, 650]], RED, 10);
};

export const su_forcesPushAndPull = cards("sci.forces.push-and-pull.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
