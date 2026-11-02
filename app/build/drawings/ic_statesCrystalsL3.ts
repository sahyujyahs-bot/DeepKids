import type { Ctx } from "./core";
import { COL, INK, WHITE, RED, BG, cards, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, plate, hand, rnd } from "./flatKit";

// sci.states.crystals.L3 picture cards (idea and activity cards, flat style)
const SALT_L = "#eceff6", SALT_R = "#c4ccdd", PART = COL.blue, SALTP = COL.orange, GREEN = "#3f9b4a";
const DARK = "#5a5470";

// a salt cube: three flat faces, centre of the hexagon at (x, y), s = distance from centre to a corner
const cube = (c: Ctx, x: number, y: number, s: number, top: string = WHITE, lw = 5) => {
  const k = 0.87 * s;
  shape(c, () => polyP(c, [[x - k, y - s * 0.5], [x, y], [x, y + s], [x - k, y + s * 0.5]]), SALT_L, lw);
  shape(c, () => polyP(c, [[x, y], [x + k, y - s * 0.5], [x + k, y + s * 0.5], [x, y + s]]), SALT_R, lw);
  shape(c, () => polyP(c, [[x, y - s], [x + k, y - s * 0.5], [x, y], [x - k, y - s * 0.5]]), top, lw);
};
// phitkari: two pyramids joined at their base, centre (x, y)
const octa = (c: Ctx, x: number, y: number, s: number) => {
  const T = [x, y - s], B = [x, y + s], L = [x - 0.85 * s, y], R = [x + 0.85 * s, y], F = [x + 0.1 * s, y + 0.38 * s];
  shape(c, () => polyP(c, [L, B, F]), "#a8d0ee"); shape(c, () => polyP(c, [F, B, R]), "#8fbfe3");
  shape(c, () => polyP(c, [T, L, F]), "#e3f3fd"); shape(c, () => polyP(c, [T, F, R]), "#bfe0f5");
  shine(c, [[x - s * 0.3, y - s * 0.5], [x - s * 0.45, y - s * 0.12]], Math.max(4, s * 0.05));
};
// sugar (kalkandu): a slanted block, centre (x, y), k = scale
const sugar = (c: Ctx, x: number, y: number, k: number) => {
  const P = (a: number, b: number) => [x + a * k, y + b * k];
  shape(c, () => polyP(c, [P(-100, 80), P(60, 80), P(100, -70), P(-60, -70)]), "#fff3d2");
  shape(c, () => polyP(c, [P(60, 80), P(100, -70), P(150, -120), P(110, 30)]), "#e9d9aa");
  shape(c, () => polyP(c, [P(-60, -70), P(100, -70), P(150, -120), P(-10, -120)]), "#fffbea");
};
const spoon = (c: Ctx, bx: number, by: number, hx: number, hy: number, rx = 34, ry = 48) => {
  const rot = Math.atan2(hy - by, hx - bx) - Math.PI / 2;
  line(c, [[bx, by], [hx, hy]], 26, INK); line(c, [[bx, by], [hx, hy]], 14, COL.steel);
  shape(c, () => ell(c, bx, by, rx, ry, rot), COL.steel, 5);
  shape(c, () => ell(c, bx, by, rx * 0.65, ry * 0.65, rot), COL.steelIn, 0);
};
const part = (c: Ctx, x: number, y: number, r: number, col: string = PART) => shape(c, () => ell(c, x, y, r, r), col, Math.max(3, r * 0.16));
// a magnified view: a round window with the thing inside, joined by two lines to the real thing
const zoom = (c: Ctx, cx: number, cy: number, r: number, from: number[] | null, inner: () => void, bg = "#fbf6ea") => {
  if (from) {
    const d = Math.hypot(cx - from[0], cy - from[1]), a = Math.atan2(from[1] - cy, from[0] - cx), o = Math.acos(Math.min(1, r / d));
    for (const s of [-1, 1]) line(c, [from, [cx + Math.cos(a + s * o) * r, cy + Math.sin(a + s * o) * r]], 5);
  }
  shape(c, () => c.arc(cx, cy, r, 0, Math.PI * 2), bg, 0);
  c.save(); c.beginPath(); c.arc(cx, cy, r - 3, 0, Math.PI * 2); c.clip(); inner(); c.restore();
  shape(c, () => c.arc(cx, cy, r, 0, Math.PI * 2), "rgba(0,0,0,0)", 8);
};
const darkPlate = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shadow(c, x + rx * 0.08, y + ry * 0.3, rx, ry);
  shape(c, () => ell(c, x, y, rx, ry), COL.steel);
  shape(c, () => ell(c, x, y - ry * 0.04, rx * 0.84, ry * 0.8), DARK, 4);
};
const specks = (c: Ctx, cx: number, cy: number, rx: number, ry: number, n: number, sz: number, seed: number) => {
  const r = rnd(seed);
  for (let i = 0; i < n; i++) { const a = r() * 6.283, d = Math.sqrt(r()), x = cx + Math.cos(a) * d * rx, y = cy + Math.sin(a) * d * ry; shape(c, () => rrect(c, x - sz / 2, y - sz / 2, sz, sz, 2), WHITE, 2.5); }
};
const wave = (c: Ctx, x: number, y0: number, y1: number, amp: number, w = 10) => {
  const pts: number[][] = [];
  for (let i = 0; i <= 14; i++) { const t = i / 14; pts.push([x + Math.sin(t * 9) * amp, y0 + (y1 - y0) * t]); }
  arrow(c, pts, RED, w);
};
const badge = (c: Ctx, x: number, y: number, ok: boolean) => {
  shape(c, () => ell(c, x, y, 52, 52), WHITE, 6);
  if (ok) line(c, [[x - 26, y + 2], [x - 6, y + 24], [x + 28, y - 22]], 14, GREEN);
  else { line(c, [[x - 24, y - 24], [x + 24, y + 24]], 14, RED); line(c, [[x + 24, y - 24], [x - 24, y + 24]], 14, RED); }
};
const sparkle = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - s, y], [x + s, y]], 6, WHITE); line(c, [[x, y - s], [x, y + s]], 6, WHITE); };
// flat grid of particles joined by thin lines
const grid = (c: Ctx, x0: number, y0: number, n: number, g: number, r: number, col: string = PART) => {
  for (let i = 0; i < n; i++) { line(c, [[x0 + i * g, y0], [x0 + i * g, y0 + (n - 1) * g]], 7, "#8a93a8"); line(c, [[x0, y0 + i * g], [x0 + (n - 1) * g, y0 + i * g]], 7, "#8a93a8"); }
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) part(c, x0 + i * g, y0 + j * g, r, col);
};
const sweet = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + s * 0.1, y + s * 0.55, s * 0.9, s * 0.18);
  shape(c, () => ell(c, x, y, s, s * 0.62), "#f0a23a"); shade(c, () => ell(c, x, y, s, s * 0.62), "#c9741c", s * 0.3, s * 0.2);
  shape(c, () => ell(c, x, y, s, s * 0.62), "rgba(0,0,0,0)", 5);
  shine(c, [[x - s * 0.55, y - s * 0.1], [x - s * 0.25, y - s * 0.38]], 9);
};

// ---- flow.e1: fast plate, slow glass
const e1 = (c: Ctx) => {
  ground(c);
  darkPlate(c, 300, 720, 270, 130);
  specks(c, 300, 724, 205, 84, 80, 11, 5);
  [200, 300, 400].forEach((x) => wave(c, x, 560, 330, 18));
  glass(c, 790, 900, 210, 440, 0.75);
  cube(c, 750, 850, 34); cube(c, 810, 856, 30); cube(c, 780, 800, 28);
  arrow(c, [[790, 450], [790, 340]], RED, 9);
};

// ---- flow.a1: crack a crystal
const a1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 800, 440, 120);
  cube(c, 270, 620, 130);
  line(c, [[188, 540], [240, 585], [215, 640], [270, 690]], 7, INK);
  hand(c, 270, 190, Math.PI / 2, 1.7, "#9c6240", COL.blueDk, true);
  arrow(c, [[270, 380], [270, 450]], RED, 10);
  arrow(c, [[450, 600], [570, 600]], RED, 10);
  cube(c, 680, 700, 66); cube(c, 860, 730, 52); cube(c, 800, 600, 46);
};

// ---- flow.a2: pack the coins
const a2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 470, 40);
  shape(c, () => rrect(c, 80, 130, 920, 810, 40), COL.steel, 6);
  shape(c, () => rrect(c, 120, 170, 840, 730, 24), COL.steelIn, 4);
  const rows = [3, 4, 5, 4, 3];
  rows.forEach((n, ri) => {
    const y = 560 + (ri - 2) * 105;
    for (let i = 0; i < n; i++) {
      const x = 540 + (i - (n - 1) / 2) * 120, mid = ri === 2 && i === 2;
      shadow(c, x + 8, y + 12, 56, 52);
      shape(c, () => ell(c, x, y, 56, 56), mid ? COL.orange : COL.yellow, 5);
      shape(c, () => ell(c, x, y, 38, 38), mid ? "#f7b866" : "#ffe58f", 3);
    }
  });
  shape(c, () => rrect(c, 180, 244, 720, 46, 6), COL.wood, 5);
  for (let i = 0; i <= 20; i++) line(c, [[200 + i * 34, 244], [200 + i * 34, 244 + (i % 5 === 0 ? 24 : 14)]], 3);
};

// ---- flow.a3: freezer frost
const snow = (c: Ctx, x: number, y: number, s: number) => {
  const arm = (w: number, col: string) => {
    for (let k = 0; k < 6; k++) {
      const a = (k * Math.PI) / 3 - Math.PI / 2, ux = Math.cos(a), uy = Math.sin(a);
      line(c, [[x, y], [x + ux * s, y + uy * s]], w, col);
      for (const f of [0.45, 0.72]) for (const sd of [-1, 1]) {
        const bx = x + ux * s * f, by = y + uy * s * f, b = a + sd * 0.9;
        line(c, [[bx, by], [bx + Math.cos(b) * s * 0.28, by + Math.sin(b) * s * 0.28]], w, col);
      }
    }
  };
  arm(30, INK); arm(16, WHITE);
};
const a3 = (c: Ctx) => {
  ground(c);
  shadow(c, 340, 900, 260, 40);
  spoon(c, 440, 640, 100, 890, 150, 105);
  c.save(); c.beginPath(); ell(c, 440, 640, 150 * 0.95, 105 * 0.95, Math.atan2(250, -340) - Math.PI / 2); c.clip();
  c.fillStyle = DARK; c.fillRect(0, 0, 1080, 1080); c.restore();
  const r = rnd(9);
  for (let i = 0; i < 55; i++) {
    const a = r() * 6.283, d = Math.sqrt(r()) * 0.85, rot = Math.atan2(250, -340) - Math.PI / 2, lx = Math.cos(a) * d * 140, ly = Math.sin(a) * d * 96;
    const x = 440 + lx * Math.cos(rot) - ly * Math.sin(rot), y = 640 + lx * Math.sin(rot) + ly * Math.cos(rot);
    shape(c, () => ell(c, x, y, 6 + r() * 5, 5 + r() * 4), WHITE, 0);
  }
  shape(c, () => ell(c, 440, 640, 150, 105, Math.atan2(250, -340) - Math.PI / 2), "rgba(0,0,0,0)", 5);
  zoom(c, 700, 330, 270, [520, 580], () => { c.fillStyle = "#bfe0f5"; c.fillRect(0, 0, 1080, 1080); snow(c, 700, 330, 190); });
};

// ---- flow.a4: crystal or not
const a4 = (c: Ctx) => {
  ground(c);
  darkPlate(c, 540, 650, 480, 300);
  octa(c, 270, 480, 85); cube(c, 205, 660, 70); sugar(c, 410, 640, 0.8);
  sweet(c, 700, 520, 110);
  shape(c, () => ell(c, 780, 730, 125, 78), "#c9d1dc", 5); shape(c, () => ell(c, 780, 730, 78, 44), DARK, 5);
  badge(c, 300, 150, true); badge(c, 740, 150, false);
};

// ---- flow.c2: salt or sugar, tell apart
const dabba = (c: Ctx, x: number, y: number) => {
  bowlish(c, x, y);
};
const bowlish = (c: Ctx, x: number, y: number) => {
  const r = 150;
  shadow(c, x + 14, y + 100, r * 0.8, 24);
  shape(c, () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.95, y + 150, x + r * 0.95, y + 150, x + r, y); c.closePath(); }, COL.steel);
  shade(c, () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.95, y + 150, x + r * 0.95, y + 150, x + r, y); c.closePath(); }, COL.steelDk, 50, -8);
  shape(c, () => ell(c, x, y, r, 32), WHITE, 5);
  shape(c, () => { c.moveTo(x - 110, y); c.quadraticCurveTo(x - 60, y - 70, x, y - 75); c.quadraticCurveTo(x + 60, y - 70, x + 110, y); c.closePath(); }, WHITE, 5);
};
const c2 = (c: Ctx) => {
  ground(c);
  zoom(c, 290, 300, 200, [260, 700], () => { const r = rnd(3); for (let i = 0; i < 6; i++) cube(c, 190 + (i % 3) * 100 + (r() - 0.5) * 20, 250 + Math.floor(i / 3) * 110 + (i % 2) * 10, 40); });
  zoom(c, 790, 300, 200, [810, 700], () => { for (let i = 0; i < 4; i++) sugar(c, 700 + (i % 2) * 160 + (i > 1 ? 20 : 0), 260 + Math.floor(i / 2) * 120, 0.42); });
  dabba(c, 270, 780); dabba(c, 800, 780);
};

// ---- term.0 crystal
const t0 = (c: Ctx) => {
  ground(c);
  shadow(c, 370, 870, 200, 38);
  cube(c, 350, 640, 210);
  zoom(c, 780, 340, 250, [533, 535], () => grid(c, 640, 200, 5, 70, 24));
};

// ---- term.1 face
const t1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 890, 280, 44);
  cube(c, 540, 600, 250, COL.yellow, 6);
  sparkle(c, 480, 470, 26); sparkle(c, 610, 400, 18);
  arrow(c, [[880, 200], [700, 340]], RED, 12);
};

// ---- term.2 solution
const t2 = (c: Ctx) => {
  ground(c);
  glass(c, 370, 900, 300, 500, 0.8);
  spoon(c, 330, 790, 440, 330, 32, 46);
  zoom(c, 790, 400, 250, [520, 640], () => {
    const r = rnd(21); let n = 0;
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
      const x = 560 + i * 62 + (r() - 0.5) * 18, y = 170 + j * 62 + (r() - 0.5) * 18; n++;
      if (n % 7 === 0) part(c, x, y, 21, SALTP); else part(c, x, y, 14, COL.water);
    }
  }, "#e6f2fc");
};

// ---- term.3 saturated solution
const t3 = (c: Ctx) => {
  ground(c);
  glass(c, 500, 900, 400, 580, 0.78);
  shape(c, () => { c.moveTo(340, 895); c.quadraticCurveTo(380, 800, 450, 830); c.quadraticCurveTo(500, 770, 560, 820); c.quadraticCurveTo(630, 800, 665, 895); c.closePath(); }, WHITE, 5);
  const r = rnd(4);
  for (let i = 0; i < 16; i++) shape(c, () => rrect(c, 365 + r() * 270 - 6, 860 + r() * 30 - 6, 12, 12, 2), "#dfe5ef", 2.5);
  spoon(c, 560, 700, 780, 300, 30, 44);
  const pts: number[][] = [];
  for (let i = 0; i <= 14; i++) { const a = Math.PI * 1.1 + (i / 14) * Math.PI * 1.55; pts.push([500 + Math.cos(a) * 150, 480 + Math.sin(a) * 36]); }
  arrow(c, pts, RED, 10);
};

// ---- term.4 evaporate
const t4 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 880, 400, 70);
  shape(c, () => ell(c, 540, 800, 400, 150), COL.steel);
  shape(c, () => ell(c, 540, 790, 345, 122), "#f4f1ea", 4);
  shape(c, () => ell(c, 540, 795, 280, 90), COL.water, 4);
  shape(c, () => ell(c, 450, 770, 80, 18), COL.drop, 0);
  specks(c, 540, 790, 320, 108, 0, 0, 1);
  const r = rnd(8);
  for (let i = 0; i < 26; i++) { const a = r() * 6.283, x = 540 + Math.cos(a) * (305 + r() * 22), y = 792 + Math.sin(a) * (104 + r() * 10); shape(c, () => rrect(c, x - 8, y - 8, 16, 16, 3), WHITE, 3); }
  [330, 540, 750].forEach((x, i) => wave(c, x, 650 - (i % 2) * 40, 250 + (i % 2) * 40, 22));
};

// ---- term.5 crystallise
const t5 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 540, 430, 430), "#cfe6f7", 8);
  cube(c, 640, 600, 120);
  [[240, 380, 480, 480], [300, 720, 520, 650], [660, 250, 660, 400], [860, 420, 790, 500]].forEach(([x, y, tx, ty]) => {
    part(c, x, y, 28, SALTP); arrow(c, [[x + (tx - x) * 0.25, y + (ty - y) * 0.25], [x + (tx - x) * 0.85, y + (ty - y) * 0.85]], RED, 9);
  });
  part(c, 520, 430, 20, COL.water); part(c, 380, 560, 20, COL.water); part(c, 780, 800, 20, COL.water); part(c, 400, 860, 20, COL.water);
};

// ---- term.6 phitkari
const t6 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 800, 430, 130);
  const lump = () => { c.moveTo(210, 730); c.bezierCurveTo(190, 640, 260, 580, 340, 570); c.bezierCurveTo(430, 565, 490, 630, 470, 720); c.bezierCurveTo(440, 780, 280, 790, 210, 730); c.closePath(); };
  shape(c, lump, "#f6f2ea", 6); shade(c, lump, "#cfc8b8", 50, 30, 0.7); shape(c, lump, "rgba(0,0,0,0)", 6);
  shine(c, [[270, 620], [330, 600]], 9);
  octa(c, 760, 610, 170);
};

// ---- term.7 seed crystal
const t7 = (c: Ctx) => {
  ground(c);
  glass(c, 280, 860, 330, 440, 0.8, "#cfe6f7"); cube(c, 280, 828, 24);
  glass(c, 800, 860, 330, 440, 0.8, "#cfe6f7"); cube(c, 800, 790, 74);
  arrow(c, [[450, 640], [630, 640]], RED, 12);
};

// ---- expl.0 what a crystal is: three directions
const x0 = (c: Ctx) => {
  ground(c);
  const g = 160, dx = 90, dy = 80, ox = 190, oy = 560, P = (i: number, j: number, k: number) => [ox + i * g + k * dx, oy + j * g - k * dy];
  const col = (k: number) => (k === 0 ? PART : k === 1 ? COL.blueDk : "#2f548c");
  for (let k = 2; k >= 0; k--) {
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const [x, y] = P(i, j, k);
      if (i < 2) line(c, [[x, y], P(i + 1, j, k)], 7, "#8a93a8");
      if (j < 2) line(c, [[x, y], P(i, j + 1, k)], 7, "#8a93a8");
      if (k < 2) line(c, [[x, y], P(i, j, k + 1)], 7, "#8a93a8");
    }
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const [x, y] = P(i, j, k); part(c, x, y, 24, col(k)); }
  }
  part(c, 830, 900, 28, SALTP); arrow(c, [[960, 800], [890, 860]], RED, 10);
};

// ---- expl.2 each substance its own shape
const x2 = (c: Ctx) => {
  ground(c);
  [190, 540, 880].forEach((x) => plate(c, x, 800, 160, 46));
  cube(c, 190, 650, 130);
  octa(c, 540, 600, 185);
  sugar(c, 850, 700, 1.1);
};

// ---- expl.3 slow growth makes bigger crystals
const x3 = (c: Ctx) => {
  ground(c);
  zoom(c, 290, 380, 215, [290, 760], () => { const r = rnd(12); for (let i = 0; i < 70; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * 190, x = 290 + Math.cos(a) * d, y = 380 + Math.sin(a) * d; shape(c, () => rrect(c, x - 9, y - 9, 18, 18, 3), WHITE, 3); } }, DARK);
  zoom(c, 790, 380, 215, [790, 780], () => { cube(c, 700, 420, 74); cube(c, 860, 440, 68); cube(c, 790, 290, 60); }, "#cfe6f7");
  darkPlate(c, 290, 850, 190, 80);
  glass(c, 790, 960, 190, 260, 0.8, "#cfe6f7");
};

// ---- expl.4 not every solid is a crystal
const x4 = (c: Ctx) => {
  ground(c);
  zoom(c, 290, 370, 215, [290, 730], () => grid(c, 150, 230, 5, 70, 22));
  zoom(c, 790, 370, 215, [790, 730], () => {
    const r = rnd(33), pts: number[][] = [];
    while (pts.length < 22) { const a = r() * 6.283, d = Math.sqrt(r()) * 180, x = 790 + Math.cos(a) * d, y = 370 + Math.sin(a) * d; if (pts.every(([u, v]) => Math.hypot(u - x, v - y) > 56)) pts.push([x, y]); }
    for (let i = 0; i < pts.length; i++) { const j = (i * 7 + 3) % pts.length; if (Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) < 160) line(c, [pts[i], pts[j]], 7, "#8a93a8"); }
    pts.forEach(([x, y]) => part(c, x, y, 22, COL.orange));
  });
  sugar(c, 250, 860, 0.62); sweet(c, 790, 850, 85);
  badge(c, 470, 880, true); badge(c, 975, 880, false);
};

// ---- expl.5 how the first tiny crystal starts
const x5 = (c: Ctx) => {
  ground(c);
  zoom(c, 540, 540, 440, null, () => {
    c.fillStyle = "#cfe6f7"; c.fillRect(0, 0, 1080, 1080);
    // the thread fibre, twisted
    c.save(); c.translate(0, 0);
    const fibre = [[60, 790], [540, 760], [1020, 690]];
    line(c, fibre, 110, INK); line(c, fibre, 92, "#f3e6c8");
    for (let i = 0; i < 16; i++) line(c, [[100 + i * 60, 740 + i * -3], [140 + i * 60, 830 - i * 3]], 6, "#c9b27c");
    c.restore();
    [[400, 690], [470, 670], [440, 612], [370, 640], [535, 680]].forEach(([x, y]) => part(c, x, y, 28, SALTP));
    arrow(c, [[580, 600], [690, 520]], RED, 10);
    cube(c, 780, 430, 56);
    [[280, 400], [820, 640], [300, 260], [700, 250]].forEach(([x, y]) => part(c, x, y, 18, COL.water));
  });
};

export const ic_statesCrystalsL3 = cards("sci.states.crystals.L3 cards", [e1, a1, a2, a3, a4, c2, t0, t1, t2, t3, t4, t5, t6, t7, x0, x2, x3, x4, x5]);
