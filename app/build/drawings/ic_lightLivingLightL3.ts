import type { Ctx } from "./core";
import { D, BG, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, line, shine, arrow, hand, person, glass, write, cards } from "./flatKit";

// sci.light.living-light.L3 · picture cards. Dark scenes for living light; the glow is flat rings.
// Child and grown-up are the same as on the set-up cards.

const NIGHT = "#1c2447", NIGHT2 = "#121a3a", GLOW = "#d9f56a", GLOWL = "#f4ffb0", STICK = "#c6f542", STICKOFF = "#a3ae86";

const dark = (c: Ctx, col = NIGHT) => ground(c, col);
const halo = (c: Ctx, x: number, y: number, r: number, col = GLOW) => {
  for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(x, y, r * (1 - i * 0.18), 0, Math.PI * 2); c.globalAlpha = 0.14; c.fillStyle = col; c.fill(); }
  c.globalAlpha = 1;
};
const panel = (c: Ctx, x: number, y: number, w: number, h: number, col: string, draw: () => void) => {
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 30); c.clip(); c.fillStyle = col; c.fillRect(x, y, w, h); draw(); c.restore();
  c.beginPath(); rrect(c, x, y, w, h, 30); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
};
const starP = (c: Ctx, x: number, y: number, R: number, r: number) => {
  const pts: number[][] = [];
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r : R; pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  polyP(c, pts);
};
const moon = (c: Ctx, x: number, y: number, r: number, bg = NIGHT) => {
  shape(c, () => ell(c, x, y, r, r), "#ffe9a0", 5);
  c.beginPath(); ell(c, x + r * 0.45, y - r * 0.2, r * 0.9, r * 0.9); c.fillStyle = bg; c.fill();
};

// a firefly seen from above, head up, about 130 long at s = 1; the tail end glows when on
const firefly = (c: Ctx, x: number, y: number, s: number, rot = 0, on = true) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  if (on) halo(c, 0, 52, 120);
  for (const k of [-1, 1]) {
    for (const [ly, ex, ey] of [[-22, 50, -34], [-4, 56, 4], [14, 48, 40]]) line(c, [[k * 14, ly], [k * ex, ey]], 8, INK);
    line(c, [[k * 5, -54], [k * 22, -88]], 6, INK);
  }
  shape(c, () => ell(c, 0, 48, 19, 17), on ? GLOW : "#d8c97a", 5);
  if (on) shape(c, () => ell(c, 0, 50, 10, 8), GLOWL, 0);
  shape(c, () => ell(c, 0, 8, 26, 44), "#6b4630", 5);
  line(c, [[0, -30], [0, 50]], 4, INK);
  shape(c, () => ell(c, 0, -30, 24, 15), "#f0a35c", 5);
  shape(c, () => ell(c, 0, -52, 11, 10), "#3a2a2a", 5);
  c.restore();
};
// a glow stick lying along rot (0 = horizontal), centre (x, y)
const stick = (c: Ctx, x: number, y: number, len: number, w: number, rot: number, on = true, col = STICK) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  if (on) halo(c, 0, 0, len * 0.62, col);
  shape(c, () => rrect(c, -len / 2, -w / 2, len, w, w * 0.4), on ? col : STICKOFF, 6);
  shape(c, () => rrect(c, -len / 2, -w / 2, w * 0.7, w, w * 0.3), on ? "#9fd02a" : "#8a9470", 5);
  shape(c, () => rrect(c, len / 2 - w * 0.7, -w / 2, w * 0.7, w, w * 0.3), on ? "#9fd02a" : "#8a9470", 5);
  line(c, [[-len * 0.3, -w * 0.22], [len * 0.3, -w * 0.22]], Math.max(4, w * 0.16), on ? WHITE : "#c9d1b0");
  c.restore();
};
const wrist = (x: number, y: number, h: number, side: number, [a1, a2]: [number, number]): number[] => {
  const sx = x + side * h * 0.11, sy = y - h * 0.74 + h * 0.03, ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};
const jelly = (c: Ctx, x: number, y: number, s: number, on = true) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (on) halo(c, 0, -30, 130, "#ff9fe0");
  for (const k of [-40, -20, 0, 20, 40]) { line(c, [[k, 0], [k + 12, 35], [k - 10, 70], [k + 10, 105]], 11, INK); line(c, [[k, 0], [k + 12, 35], [k - 10, 70], [k + 10, 105]], 5, "#f4b6e6"); }
  shape(c, () => { c.moveTo(-70, 5); c.bezierCurveTo(-75, -100, 75, -100, 70, 5); c.quadraticCurveTo(35, -12, 0, 5); c.quadraticCurveTo(-35, -12, -70, 5); c.closePath(); }, "#ec8fd6", 6);
  if (on) for (let i = 0; i < 5; i++) shape(c, () => ell(c, -44 + i * 22, -14 - Math.sin((i / 4) * Math.PI) * 22, 7, 7), GLOWL, 3);
  c.restore();
};
const squid = (c: Ctx, x: number, y: number, s: number, on = false) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (on) halo(c, 0, -20, 110, "#9fe8ff");
  for (const k of [-24, -17, -10, -3, 3, 10, 17, 24]) { const p = [[k * 0.8, 40], [k * 1.4, 80], [k * 0.6, 115]]; line(c, p, 11, INK); line(c, p, 5, "#f08a78"); }
  shape(c, () => { c.moveTo(0, -120); c.bezierCurveTo(50, -70, 38, 10, 28, 40); c.lineTo(-28, 40); c.bezierCurveTo(-38, 10, -50, -70, 0, -120); c.closePath(); }, "#f08a78", 6);
  shape(c, () => polyP(c, [[0, -122], [-52, -62], [-24, -70]]), "#d9695a", 5); shape(c, () => polyP(c, [[0, -122], [52, -62], [24, -70]]), "#d9695a", 5);
  for (const k of [-1, 1]) { shape(c, () => ell(c, k * 22, 26, 13, 13), WHITE, 5); shape(c, () => ell(c, k * 22, 27, 6, 6), INK, 0); }
  if (on) for (let i = 0; i < 4; i++) shape(c, () => ell(c, -18 + i * 12, -40 + (i % 2) * 14, 6, 6), "#bff3ff", 3);
  c.restore();
};
// a small fish facing right; lights = row of dots along the belly
const fish = (c: Ctx, x: number, y: number, s: number, col = "#9aa9bd", lights = false, dir = 1) => {
  c.save(); c.translate(x, y); c.scale(s * dir, s);
  shape(c, () => polyP(c, [[-45, 0], [-95, -34], [-95, 34]]), col, 6);
  shape(c, () => ell(c, 0, 0, 62, 36), col, 6);
  shape(c, () => polyP(c, [[-10, -34], [20, -62], [28, -30]]), col, 5);
  shape(c, () => ell(c, 34, -8, 9, 9), WHITE, 4); shape(c, () => ell(c, 36, -8, 4, 4), INK, 0);
  if (lights) for (let i = 0; i < 6; i++) { halo(c, -34 + i * 14, 24, 14, GLOWL); shape(c, () => ell(c, -34 + i * 14, 24, 5, 5), GLOWL, 2); }
  c.restore();
};
// an anglerfish facing right; the lure hangs at about (150, -20) at s = 1
const angler = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  halo(c, 150, -20, 90, GLOW);
  const stalk = [[10, -60], [60, -130], [140, -90], [150, -40]];
  c.beginPath(); c.moveTo(10, -60); c.bezierCurveTo(60, -140, 150, -120, 150, -45); c.strokeStyle = INK; c.lineWidth = 11; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.moveTo(10, -60); c.bezierCurveTo(60, -140, 150, -120, 150, -45); c.strokeStyle = "#5a4a70"; c.lineWidth = 5; c.stroke();
  void stalk;
  shape(c, () => polyP(c, [[-70, 0], [-135, -45], [-135, 45]]), "#4a3b5e", 6);
  shape(c, () => ell(c, 0, 0, 92, 70), "#5a4a70", 6);
  shape(c, () => { c.moveTo(60, -22); c.lineTo(100, -34); c.lineTo(104, 40); c.lineTo(50, 52); c.closePath(); }, "#2a1424", 5);
  for (let i = 0; i < 4; i++) { shape(c, () => polyP(c, [[66 + i * 9, -20 + i * 18], [76 + i * 9, -4 + i * 18], [82 + i * 9, -22 + i * 18]]), WHITE, 3); }
  shape(c, () => ell(c, 36, -26, 14, 14), WHITE, 4); shape(c, () => ell(c, 39, -25, 6, 6), INK, 0);
  shape(c, () => ell(c, 150, -40, 17, 17), GLOWL, 5);
  c.restore();
};
const mushroom = (c: Ctx, x: number, y: number, s: number, glow = true) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (glow) halo(c, 0, -30, 100, "#8cff9a");
  shape(c, () => rrect(c, -16, -70, 32, 80, 12), glow ? "#b6ffb0" : "#e8e1c8", 5);
  shape(c, () => { c.moveTo(-55, -62); c.bezierCurveTo(-50, -120, 50, -120, 55, -62); c.quadraticCurveTo(0, -48, -55, -62); c.closePath(); }, "#a8723f", 5);
  c.restore();
};
const bulb = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => rrect(c, x - r * 0.4, y + r * 0.85, r * 0.8, r * 0.6, 8), COL.steelDk, 6);
  shape(c, () => { c.moveTo(x - r * 0.4, y + r * 0.9); c.bezierCurveTo(x - r * 1.5, y - r * 0.3, x - r * 0.6, y - r * 1.5, x, y - r * 1.2); c.bezierCurveTo(x + r * 0.6, y - r * 1.5, x + r * 1.5, y - r * 0.3, x + r * 0.4, y + r * 0.9); c.closePath(); }, "#fff2b0", 6);
  line(c, [[x - r * 0.25, y + r * 0.85], [x - r * 0.3, y - r * 0.1], [x - r * 0.1, y - r * 0.3], [x + r * 0.1, y - r * 0.1], [x + r * 0.3, y - r * 0.3], [x + r * 0.25, y + r * 0.85]], 5, "#d9792b");
};
const heat = (c: Ctx, x: number, y: number, n: number, gap: number, h: number) => {
  for (let i = 0; i < n; i++) line(c, [[x + i * gap, y], [x + i * gap + 14, y - h * 0.3], [x + i * gap - 14, y - h * 0.6], [x + i * gap, y - h]], 9, RED);
};
const flask = (c: Ctx, x: number, y: number, r: number, liquid: string, on = false) => {
  if (on) halo(c, x, y, r * 2.4, STICK);
  shape(c, () => rrect(c, x - r * 0.3, y - r * 1.5, r * 0.6, r * 0.9, 8), COL.glass, 5);
  shape(c, () => ell(c, x, y, r, r), COL.glass, 5);
  shape(c, () => { c.moveTo(x - r * 0.95, y + r * 0.1); c.quadraticCurveTo(x, y - r * 0.2, x + r * 0.95, y + r * 0.1); c.arc(x, y, r * 0.96, 0.3, Math.PI - 0.3); c.closePath(); }, liquid, 0);
  shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.18)", 5);
  shine(c, [[x - r * 0.65, y - r * 0.3], [x - r * 0.5, y + r * 0.35]], 8);
};
const grass = (c: Ctx, y: number, col = "#2d5a3a") => {
  c.fillStyle = col; c.fillRect(0, y, D, D - y);
  const r = rnd(5);
  for (let i = 0; i < 40; i++) { const x = r() * D, h = 40 + r() * 60; shape(c, () => polyP(c, [[x - 10, y + 6], [x + 4, y - h], [x + 14, y + 6]]), col, 4); }
};
const sunRound = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.yellow, 5); };

// ---------------------------------------------------------------- flows
const e1 = (c: Ctx) => {
  dark(c);
  shape(c, () => rrect(c, -20, 800, 1120, 300, 4), "#5a3d2a", 6);
  const spec: [number, string, number, string][] = [[220, "#8fc3ea", 130, "cold"], [540, "#a9cdea", 190, "room"], [860, "#f2b27a", 270, "warm"]];
  spec.forEach(([x, liq, hr, kind], i) => {
    halo(c, x, 560, hr, STICK);
    glass(c, x, 800, 230, 330, 0.78, liq);
    stick(c, x + 10, 560, 300, 44, -1.25 + i * 0.04, true);
    if (kind === "cold") for (const [ix, iy] of [[-40, 520], [30, 550]]) shape(c, () => rrect(c, x + ix - 24, iy - 24, 48, 48, 8), "#f1f8ff", 5);
    if (kind === "warm") for (const k of [-50, 0, 50]) line(c, [[x + k, 600], [x + k + 16, 560], [x + k - 14, 520], [x + k + 4, 480]], 9, "#ffd9b0");
  });
};
const e2 = (c: Ctx) => {
  dark(c);
  stick(c, 290, 770, 320, 50, Math.PI / 2, true);
  hand(c, 290, 910, -Math.PI / 2, 1.5);
  stick(c, 790, 770, 320, 50, Math.PI / 2, false);
  hand(c, 790, 910, -Math.PI / 2, 1.5);
};
const e3 = (c: Ctx) => {
  dark(c, BG);
  panel(c, 30, 130, 480, 820, "#ffefb8", () => {
    c.beginPath(); polyP(c, [[190, 330], [330, 330], [440, 640], [80, 640]]); c.fillStyle = "rgba(255,230,120,0.55)"; c.fill();
    shape(c, () => rrect(c, 215, 180, 90, 110, 12), "#7d7870", 6);
    shape(c, () => polyP(c, [[200, 290], [320, 290], [345, 345], [175, 345]]), "#b9b4ab", 6);
    shape(c, () => ell(c, 260, 345, 70, 14), "#fff6c4", 4);
    shape(c, () => rrect(c, 110, 620, 300, 230, 14), "#8a5a3c", 6);
    shape(c, () => starP(c, 260, 710, 85, 38), "#d6efa0", 6);
  });
  panel(c, 570, 130, 480, 820, NIGHT2, () => {
    shape(c, () => rrect(c, 650, 620, 320, 230, 14), "#3a2e3f", 6);
    halo(c, 810, 710, 190, STICK);
    shape(c, () => starP(c, 810, 710, 85, 38), STICK, 6);
  });
  arrow(c, [[486, 540], [594, 540]], RED, 12);
};
const a2 = (c: Ctx) => {
  dark(c);
  moon(c, 880, 170, 80);
  grass(c, 820);
  person(c, 400, 960, 560);
  person(c, 650, 960, 700, { adult: true });
  for (const [x, y, s, r] of [[150, 380, 0.65, 0.6], [330, 210, 0.55, -0.5], [820, 300, 0.6, 2.4], [880, 520, 0.7, -0.9], [990, 360, 0.5, 0.2], [210, 640, 0.6, 3.5]]) firefly(c, x, y, s, r);
};
const a3 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 930, 460, 40);
  shape(c, () => rrect(c, 110, 220, 860, 680, 26), "#c98d4e", 7);
  shape(c, () => rrect(c, 170, 280, 740, 560, 14), NIGHT2, 6);
  c.fillStyle = "#6a4a30"; c.fillRect(173, 790, 734, 47);
  for (const [x, y] of [[330, 480], [760, 520]]) line(c, [[x, 283], [x, y - 60]], 5, WHITE);
  jelly(c, 330, 490, 0.8); jelly(c, 760, 560, 0.55);
  angler(c, 440, 640, 0.8);
  fish(c, 740, 740, 0.5, "#9aa9bd", true);
};
const a4 = (c: Ctx) => {
  ground(c);
  const water = (x: number) => {
    panel(c, x, 130, 480, 820, "#8fd0f0", () => {
      c.fillStyle = "#b9e6fa"; c.fillRect(x, 130, 480, 200);
      halo(c, x + 240, 150, 260, WHITE);
      sunRound(c, x + 240, 160, 60);
      c.fillStyle = "#3a7cb8"; c.fillRect(x, 800, 480, 150);
    });
  };
  water(30); water(570);
  fish(c, 270, 560, 1.7, "#2b3a55", false);
  c.save(); c.translate(810, 560); c.scale(1.7, 1.7);
  shape(c, () => polyP(c, [[-45, 0], [-95, -34], [-95, 34]]), "#a8dcf4", 3);
  shape(c, () => ell(c, 0, 0, 62, 36), "#a8dcf4", 3);
  for (let i = 0; i < 7; i++) { shape(c, () => ell(c, -40 + i * 14, 22, 5, 5), WHITE, 2); }
  c.restore();
  arrow(c, [[500, 840], [600, 840]], RED, 12);
};
const a5 = (c: Ctx) => {
  dark(c, "#232a4d");
  c.fillStyle = "#3a2e3f"; c.fillRect(0, 900, D, 180);
  const cw = wrist(330, 960, 520, 1, [-0.7, -1.3]);
  const aw = wrist(740, 960, 680, -1, [Math.PI + 0.7, Math.PI + 1.3]);
  person(c, 330, 960, 520, { armR: [-0.7, -1.3], armL: [Math.PI * 0.55, Math.PI * 0.5] });
  person(c, 740, 960, 680, { adult: true, armL: [Math.PI + 0.7, Math.PI + 1.3], armR: [Math.PI * 0.45, Math.PI * 0.5] });
  stick(c, cw[0], cw[1] - 60, 150, 30, -Math.PI / 2, true);
  halo(c, aw[0], aw[1] - 20, 200, "#fff2b0");
  shape(c, () => rrect(c, aw[0] - 22, aw[1] - 100, 44, 110, 10), COL.steelDk, 6);
  shape(c, () => ell(c, aw[0], aw[1] - 104, 36, 14), "#fff2b0", 5);
};
const p1 = (c: Ctx) => {
  ground(c);
  const counts = [4, 7, 5];
  counts.forEach((n, i) => {
    const x = 30 + i * 345, r = rnd(20 + i);
    panel(c, x, 130, 320, 640, NIGHT, () => {
      grass(c, 660, "#2d5a3a");
      moon(c, x + 250, 210, 40);
      const grid = [[100, 330], [230, 380], [150, 460], [260, 540], [90, 570], [200, 640], [270, 330]].sort(() => r() - 0.5).slice(0, n);
      const spots = grid.map(([gx, gy]) => [x + gx, gy]);
      spots.forEach(([px, py]) => firefly(c, px, py, 0.38, r() * 6, true));
    });
    write(c, String(n), x + 130, 810, 130, INK, 14);
  });
};
const c1 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(540, 520); c.rotate(-0.03);
  shape(c, () => rrect(c, -400, -400, 800, 780, 12), "#fffaf0", 7);
  c.fillStyle = "#16204a"; c.fillRect(-360, -360, 720, 700);
  halo(c, 150, -140, 110, GLOW);
  line(c, [[-60, -60], [0, -200], [100, -240], [150, -140]], 8, "#7a5fc4");
  shape(c, () => ell(c, 150, -140, 20, 20), GLOWL, 5);
  for (const k of [-110, -60, -10, 40, 90]) line(c, [[k, 80], [k + 20, 170], [k - 10, 240]], 14, "#7a5fc4");
  shape(c, () => ell(c, -10, 0, 160, 120), "#7a5fc4", 6);
  shape(c, () => ell(c, -70, -20, 34, 34), WHITE, 5); shape(c, () => ell(c, -60, -18, 14, 14), INK, 0);
  shape(c, () => ell(c, 30, -30, 26, 26), WHITE, 5); shape(c, () => ell(c, 38, -28, 11, 11), INK, 0);
  for (let i = 0; i < 6; i++) { halo(c, -90 + i * 36, 70, 24, GLOWL); shape(c, () => ell(c, -90 + i * 36, 70, 9, 9), GLOWL, 3); }
  c.restore();
  c.save(); c.translate(870, 880); c.rotate(-0.5);
  shape(c, () => rrect(c, -150, -20, 280, 40, 8), COL.yellow, 6);
  shape(c, () => polyP(c, [[130, -20], [185, 0], [130, 20]]), "#f2d7a8", 5);
  shape(c, () => polyP(c, [[165, -8], [185, 0], [165, 8]]), INK, 2);
  c.restore();
};
const c2 = (c: Ctx) => {
  dark(c);
  panel(c, 30, 130, 480, 820, NIGHT2, () => {
    halo(c, 270, 260, 520, "#fff2b0");
    shape(c, () => polyP(c, [[110, 950], [430, 950], [330, 640], [210, 640]]), "#9a948c", 6);
    shape(c, () => rrect(c, 252, 270, 36, 400, 6), COL.steelDk, 6);
    shape(c, () => ell(c, 270, 260, 52, 52), "#fff8d0", 6);
    firefly(c, 90, 520, 0.4, 0.4, false); firefly(c, 450, 600, 0.4, -0.5, false);
  });
  panel(c, 570, 130, 480, 820, NIGHT2, () => {
    c.beginPath(); polyP(c, [[780, 320], [900, 320], [980, 950], [700, 950]]); c.fillStyle = "rgba(255,242,176,0.5)"; c.fill();
    shape(c, () => polyP(c, [[740, 950], [980, 950], [900, 640], [820, 640]]), "#9a948c", 6);
    shape(c, () => rrect(c, 822, 290, 36, 380, 6), COL.steelDk, 6);
    shape(c, () => { c.moveTo(780, 300); c.quadraticCurveTo(840, 220, 900, 300); c.closePath(); }, COL.steelDk, 6);
    shape(c, () => ell(c, 840, 300, 55, 12), "#fff8d0", 5);
    grass(c, 880, "#2d5a3a");
    firefly(c, 625, 640, 0.45, 0.5, true); firefly(c, 985, 560, 0.45, -0.4, true); firefly(c, 640, 800, 0.4, 2.8, true);
  });
  arrow(c, [[486, 880], [594, 880]], RED, 12);
};

// ---------------------------------------------------------------- terms
const t1 = (c: Ctx) => {
  dark(c);
  firefly(c, 540, 500, 4.2, 0.0, true);
  for (const [x, y] of [[170, 190], [900, 220], [940, 840], [150, 800]]) { halo(c, x, y, 40, GLOW); shape(c, () => ell(c, x, y, 12, 12), GLOWL, 2); }
};
const t2 = (c: Ctx) => {
  ground(c);
  flask(c, 220, 300, 100, "#6fb0f0");
  flask(c, 860, 300, 100, "#f2a24a");
  flask(c, 540, 760, 190, STICK, true);
  arrow(c, [[300, 400], [380, 520], [430, 570]], RED, 12);
  arrow(c, [[780, 400], [700, 520], [650, 570]], RED, 12);
};
const t6 = (c: Ctx) => {
  ground(c);
  shadow(c, 220, 800, 150, 30);
  c.save(); c.translate(0, 0);
  const lf = (x: number, y: number) => { shape(c, () => { c.moveTo(x - 120, y + 60); c.quadraticCurveTo(x - 60, y - 160, x + 130, y - 120); c.quadraticCurveTo(x + 100, y + 80, x - 120, y + 60); c.closePath(); }, COL.leaf, 6); line(c, [[x - 140, y + 90], [x + 70, y - 70]], 6, COL.leafDk); };
  lf(220, 600);
  c.restore();
  firefly(c, 540, 600, 2.2, 1.57, true);
  arrow(c, [[330, 600], [400, 600]], RED, 12);
  arrow(c, [[680, 600], [750, 600]], RED, 12);
  const sx = 900, sy = 600;
  shape(c, () => { const pts: number[][] = []; for (let i = 0; i < 16; i++) { const a = (i * Math.PI) / 8, r = i % 2 ? 60 : 125; pts.push([sx + Math.cos(a) * r, sy + Math.sin(a) * r]); } polyP(c, pts); }, COL.yellow, 6);
};
const t7 = (c: Ctx) => {
  dark(c, "#2a2f55");
  stick(c, 290, 740, 300, 50, Math.PI / 2, true);
  hand(c, 290, 880, -Math.PI / 2, 1.5);
  bulb(c, 770, 360, 120);
  heat(c, 680, 220, 3, 70, 80);
  hand(c, 900, 940, -2.05, 1.3, SKIN.child, CLOTH.child, true);
  arrow(c, [[1010, 760], [1040, 850]], RED, 12);
};
const t12 = (c: Ctx) => {
  const bands = ["#7ec8f0", "#4a9fd8", "#2b6ab0", "#18386e", "#0b1230"];
  bands.forEach((b, i) => { c.fillStyle = b; c.fillRect(0, i * 216, D, 218); });
  sunRound(c, 160, 90, 52);
  jelly(c, 640, 640, 0.7, true);
  squid(c, 280, 760, 0.8, true);
  fish(c, 800, 840, 0.8, "#9aa9bd", true);
  angler(c, 480, 960, 0.45);
  arrow(c, [[960, 120], [960, 360], [960, 560]], RED, 14);
};
const t13 = (c: Ctx) => {
  dark(c, NIGHT2);
  angler(c, 330, 600, 2.1);
  fish(c, 880, 470, 0.6, "#e4a56a", false, -1);
  arrow(c, [[820, 330], [730, 380]], RED, 10);
};
const t14 = (c: Ctx) => {
  const bands = ["#a9dcf4", "#6fb4e0", "#3a78b8", "#1d3d78"];
  bands.forEach((b, i) => { c.fillStyle = b; c.fillRect(0, i * 270, D, 272); });
  for (const x of [250, 540, 830]) arrow(c, [[x, 60], [x, 190]], "rgba(255,255,255,0.9)", 12);
  c.save(); c.translate(540, 600); c.scale(2.4, 2.4);
  shape(c, () => polyP(c, [[-45, 0], [-95, -34], [-95, 34]]), "#7f8fa6", 5);
  shape(c, () => ell(c, 0, 0, 62, 36), "#7f8fa6", 5);
  shape(c, () => ell(c, 34, -8, 9, 9), WHITE, 3); shape(c, () => ell(c, 36, -8, 4, 4), INK, 0);
  for (let i = 0; i < 6; i++) { halo(c, -34 + i * 14, 24, 14, GLOWL); shape(c, () => ell(c, -34 + i * 14, 24, 5, 5), GLOWL, 2); }
  c.restore();
};
const t18 = (c: Ctx) => {
  dark(c);
  halo(c, 540, 600, 520, STICK);
  c.save(); c.translate(540, 620); c.rotate(0.12);
  shape(c, () => rrect(c, -380, -80, 760, 160, 70), STICK, 7);
  shape(c, () => rrect(c, -260, -34, 520, 68, 34), "#eaffc0", 5);
  line(c, [[-20, -34], [-5, -10], [-30, 6], [-10, 34]], 7, INK);
  c.restore();
  arrow(c, [[170, 400], [190, 480]], RED, 12);
  arrow(c, [[910, 400], [890, 480]], RED, 12);
};
const t19 = (c: Ctx) => {
  dark(c, "#1a1f40");
  const sp: [number, number, number][] = [[200, 250, 1], [540, 200, 1], [880, 260, 1], [260, 560, 0.6], [560, 520, 0.6], [880, 600, 0.6], [200, 860, 0.25], [540, 840, 0.25], [880, 880, 0.25]];
  for (const [x, y, b] of sp) {
    if (b > 0.5) halo(c, x, y, b > 0.9 ? 190 : 110, STICK);
    shape(c, () => starP(c, x, y, 85, 38), b > 0.9 ? STICK : b > 0.5 ? "#9bb870" : "#5f6f5a", 6);
  }
};

// ---------------------------------------------------------------- explanations
const x0 = (c: Ctx) => {
  dark(c);
  firefly(c, 200, 560, 2.2, 0.3, true);
  mushroom(c, 540, 700, 2.3);
  jelly(c, 880, 480, 1.5);
  grass(c, 900);
};
const x2 = (c: Ctx) => {
  dark(c);
  hand(c, 100, 800, -0.35, 3.0, SKIN.child, CLOTH.child, true);
  firefly(c, 410, 590, 1.0, 1.0, true);
  // candle
  shape(c, () => rrect(c, 745, 640, 110, 270, 14), "#fff4dc", 6);
  line(c, [[800, 640], [800, 610]], 5, INK);
  shape(c, () => { c.moveTo(800, 460); c.quadraticCurveTo(850, 540, 800, 612); c.quadraticCurveTo(750, 540, 800, 460); c.closePath(); }, COL.orange, 6);
  shape(c, () => { c.moveTo(800, 520); c.quadraticCurveTo(826, 565, 800, 600); c.quadraticCurveTo(774, 565, 800, 520); c.closePath(); }, COL.yellow, 0);
  heat(c, 740, 430, 3, 60, 100);
};
const x3 = (c: Ctx) => {
  dark(c);
  moon(c, 900, 150, 70);
  const pts = [[300, 330], [380, 270], [470, 340], [550, 280], [620, 360]];
  pts.forEach(([x, y], i) => { if (i % 2 === 0) { halo(c, x, y, 40, GLOW); shape(c, () => ell(c, x, y, 11, 11), GLOWL, 2); } });
  firefly(c, 190, 380, 1.1, -1.9, true);
  grass(c, 780);
  line(c, [[780, 900], [800, 700], [830, 620]], 14, INK); line(c, [[780, 900], [800, 700], [830, 620]], 8, "#3a7a4a");
  firefly(c, 830, 580, 1.0, 0.6, true);
  halo(c, 830, 640, 150, GLOW);
};
const x4 = (c: Ctx) => {
  dark(c);
  grass(c, 900);
  shape(c, () => { c.moveTo(80, 880); c.quadraticCurveTo(250, 640, 560, 800); c.quadraticCurveTo(300, 960, 80, 880); c.closePath(); }, COL.leaf, 6);
  // larva: soft segments
  const segs = [[190, 790], [250, 770], [310, 765], [370, 775], [425, 795]];
  segs.forEach(([x, y], i) => shape(c, () => ell(c, x, y, 32, 28), i >= 3 ? GLOW : "#5a4538", 5));
  halo(c, 410, 790, 120, GLOW);
  shape(c, () => ell(c, 150, 800, 22, 20), "#3a2a2a", 5);
  // toad facing away
  c.save(); c.translate(790, 760); c.scale(1.2, 1.2);
  shape(c, () => ell(c, 0, 0, 120, 80), "#8b7a4a", 6);
  shape(c, () => ell(c, 85, -10, 55, 45), "#8b7a4a", 6);
  shape(c, () => ell(c, 100, -40, 17, 17), "#e8d27a", 5); shape(c, () => ell(c, 106, -40, 7, 7), INK, 0);
  line(c, [[105, 5], [140, 12]], 5);
  for (const [bx, by] of [[-40, -45], [0, -55], [-70, -10]]) shape(c, () => ell(c, bx, by, 12, 9), "#6f6038", 3);
  shape(c, () => ell(c, -70, 60, 50, 24), "#8b7a4a", 6);
  shape(c, () => ell(c, 60, 78, 40, 16), "#8b7a4a", 6);
  c.restore();
};
const x7 = (c: Ctx) => {
  c.fillStyle = "#0b1230"; c.fillRect(0, 0, D, D);
  halo(c, 540, 40, 260, "#ffe9a0");
  shape(c, () => rrect(c, 450, 40, 180, 80, 36), "#e6c34a", 5);
  shape(c, () => ell(c, 540, 120, 32, 14), "#fff2b0", 4);
  jelly(c, 250, 420, 1.1);
  squid(c, 800, 460, 1.1, true);
  fish(c, 480, 820, 1.0, "#9aa9bd", true);
  angler(c, 90, 900, 0.55);
};
const x8 = (c: Ctx) => {
  ground(c, "#0b1230");
  const q = (x: number, y: number, draw: () => void) => panel(c, x, y, 495, 495, NIGHT2, draw);
  q(30, 30, () => angler(c, 150, 300, 1.05));
  q(555, 30, () => { c.fillStyle = "#3a78b8"; c.fillRect(555, 30, 495, 160); fish(c, 800, 330, 1.2, "#7f8fa6", true); });
  q(30, 555, () => jelly(c, 280, 750, 1.2));
  q(555, 555, () => { squid(c, 700, 820, 0.7, true); squid(c, 930, 840, 0.6, true); });
};
const x9 = (c: Ctx) => {
  dark(c, NIGHT2);
  squid(c, 330, 520, 1.5, false);
  halo(c, 330, 400, 110, "#9fe8ff");
  shape(c, () => ell(c, 330, 400, 36, 28), "#bff3ff", 4);
  c.beginPath(); c.moveTo(366, 380); c.lineTo(660, 140); c.moveTo(366, 430); c.lineTo(660, 880); c.strokeStyle = WHITE; c.lineWidth = 5; c.stroke();
  shape(c, () => ell(c, 770, 510, 270, 270), "#16294f", 7);
  const r = rnd(9);
  for (let i = 0; i < 16; i++) { const a = r() * 6.28, d = r() * 195; const bx = 770 + Math.cos(a) * d, by = 510 + Math.sin(a) * d; halo(c, bx, by, 34, "#9fe8ff"); shape(c, () => rrect(c, bx - 20, by - 8, 40, 16, 8), "#bff3ff", 3); }
};
const x13 = (c: Ctx) => {
  ground(c);
  // microscope
  shape(c, () => rrect(c, 90, 840, 360, 70, 16), COL.steelDk, 6);
  shape(c, () => rrect(c, 330, 280, 70, 570, 20), COL.steel, 6);
  shape(c, () => rrect(c, 160, 240, 90, 300, 14), COL.steelDk, 6);
  line(c, [[300, 300], [250, 300]], 20, INK);
  shape(c, () => rrect(c, 180, 530, 50, 70, 8), INK, 0);
  shape(c, () => rrect(c, 130, 660, 220, 28, 8), COL.steel, 6);
  shape(c, () => ell(c, 690, 450, 290, 290), "#16294f", 8);
  shape(c, () => ell(c, 690, 450, 200, 190), "#7fa890", 6);
  shape(c, () => ell(c, 690, 450, 80, 76), "#4a6a7a", 5);
  for (const [bx, by] of [[600, 380], [770, 340], [790, 510], [610, 540], [700, 580]]) { halo(c, bx, by, 38, "#7cff7a"); shape(c, () => ell(c, bx, by, 17, 17), "#b7ffb0", 3); }
};
const x14 = (c: Ctx) => {
  dark(c, "#0a0e22");
  shape(c, () => ell(c, 330, 520, 230, 280), "#1c2447", 6);
  const r = rnd(4);
  for (let i = 0; i < 70; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * 1; const px = 330 + Math.cos(a) * 215 * d, py = 520 + Math.sin(a) * 265 * d; c.fillStyle = "#c6f542"; c.globalAlpha = 0.6; c.fillRect(px, py, 5, 5); }
  c.globalAlpha = 1;
  shape(c, () => rrect(c, 640, 380, 360, 260, 28), "#3a3540", 7);
  shape(c, () => rrect(c, 700, 340, 120, 56, 10), "#3a3540", 6);
  shape(c, () => ell(c, 820, 510, 100, 100), COL.steelDk, 8);
  shape(c, () => ell(c, 820, 510, 66, 66), "#1a2a50", 5);
  shape(c, () => ell(c, 800, 490, 18, 18), "rgba(255,255,255,0.5)", 0);
  arrow(c, [[570, 510], [630, 510]], RED, 10);
};

export const ic_lightLivingLightL3 = cards("sci.light.living-light.L3 cards", [
  e1, e2, e3, a2, a3, a4, a5, p1, c1, c2,            // 0-9
  t1, t2, t6, t7, t12, t13, t14, t18, t19,            // 10-18
  x0, x2, x3, x4, x7, x8, x9, x13, x14,               // 19-27
]);
