import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, plate, hand, write, cards, person } from "./flatKit";

// SCIENCE UNIT · sci.forces.changing-motion.L3 · set-up cards for the three experiments (clay drop, squash/spring/break, wet ball prints)

const CLAY = "#c97b4e", CLAYDK = "#9c5a36", FLOOR = "#e6d6b6";
// shade on the lower right (light from the upper left): the shifted copy is moved to the upper left
const sh = (c: Ctx, path: () => void, col: string, k = 14, alpha = 0.5) => shade(c, path, col, -k, -k, alpha);

// a hand with its arm running off the card edge; side "R" = the arm comes from the right (the hand mirrored)
const handArm = (c: Ctx, x: number, y: number, an: number, s: number, side: "L" | "R", open = false, armLen = 700) => {
  c.save(); c.translate(x, y); if (side === "R") c.scale(-1, 1); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -78 - armLen, -36, armLen + 30, 72, 14), CLOTH.child, 6);
  c.restore();
  c.save(); c.translate(x, 0); if (side === "R") c.scale(-1, 1); hand(c, 0, y, an, s, SKIN.child, CLOTH.child, open); c.restore();
};
const clayBall = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.95, r * 0.95, r * 0.22);
  shape(c, () => ell(c, x, y, r, r), CLAY, 6);
  sh(c, () => ell(c, x, y, r, r), CLAYDK, r * 0.28, 0.6);
  shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", 6);
  shine(c, [[x - r * 0.6, y - r * 0.25], [x - r * 0.35, y - r * 0.6]], 8);
};
// a squashed clay lump on the table: round top, flat bottom of width w, height h, base line at y
const clayDome = (c: Ctx, cx: number, base: number, w: number, h: number) => {
  const p = () => { c.moveTo(cx - w / 2, base); c.bezierCurveTo(cx - w * 0.62, base - h * 0.55, cx - w * 0.3, base - h, cx, base - h); c.bezierCurveTo(cx + w * 0.3, base - h, cx + w * 0.62, base - h * 0.55, cx + w / 2, base); c.closePath(); };
  shadow(c, cx + w * 0.08, base + 8, w * 0.62, 14);
  shape(c, p, CLAY, 6); sh(c, p, CLAYDK, h * 0.14, 0.6); shape(c, p, "rgba(0,0,0,0)", 6);
  shine(c, [[cx - w * 0.28, base - h * 0.55], [cx - w * 0.14, base - h * 0.82]], 7);
};
const dropBall = (c: Ctx, x: number, y: number, r: number, wet = false) => {
  shadow(c, x + r * 0.15, y + r * 1.0, r * 0.95, r * 0.2);
  shape(c, () => ell(c, x, y, r, r), COL.blue, 6);
  sh(c, () => ell(c, x, y, r, r), COL.blueDk, r * 0.28, 0.7);
  line(c, [[x - r * 0.95, y - r * 0.05], [x - r * 0.4, y + r * 0.1], [x + r * 0.4, y + r * 0.1], [x + r * 0.95, y - r * 0.05]], 5, WHITE);
  shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", 6);
  shine(c, [[x - r * 0.6, y - r * 0.3], [x - r * 0.35, y - r * 0.65]], 8);
  if (wet) for (const [dx, dy] of [[0.3, 0.45], [-0.35, 0.55], [0.0, 0.75], [0.55, 0.15]]) shape(c, () => ell(c, x + dx * r, y + dy * r, r * 0.09, r * 0.13), COL.drop, 3);
};
// a puck (biscuit, potato slice): top ellipse, thickness th
const puck = (c: Ctx, rx: number, ry: number, th: number, top: string, side: string) => {
  shape(c, () => ell(c, 0, -th * 0.2, rx, ry), side, 6);
  shape(c, () => { c.moveTo(-rx, -th * 0.2); c.lineTo(-rx, -th); c.lineTo(rx, -th); c.lineTo(rx, -th * 0.2); c.closePath(); }, side, 0);
  line(c, [[-rx, -th * 0.2], [-rx, -th]], 6); line(c, [[rx, -th * 0.2], [rx, -th]], 6);
  shape(c, () => ell(c, 0, -th, rx, ry), top, 6);
};
const BISC = "#e3b36a", BISCDK = "#c58e44";
type Kind = "biscuit" | "biscuitBroken" | "dough" | "doughSquashed" | "raw" | "rawCracked" | "boiled" | "boiledSquashed" | "sponge" | "stone";
// one of the six test things, resting at (x, y) on whatever is under it, scale s (1 = about 190 px wide)
const item = (c: Ctx, kind: Kind, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (kind === "biscuit") {
    shadow(c, 12, 4, 100, 26);
    puck(c, 90, 34, 18, BISC, BISCDK);
    for (const [dx, dy] of [[-45, 0], [0, -6], [45, 0], [-22, 14], [22, 14], [-22, -14], [22, -14]]) shape(c, () => ell(c, dx, -18 + dy, 6, 4), BISCDK, 0);
  } else if (kind === "biscuitBroken") {
    const piece = (pts: number[][], rot: number, dx: number, dy: number) => { c.save(); c.translate(dx, dy); c.rotate(rot); shape(c, () => polyP(c, pts), BISC, 6); shape(c, () => polyP(c, [pts[0], pts[1], [pts[1][0], pts[1][1] + 12], [pts[0][0], pts[0][1] + 12]]), BISCDK, 5); c.restore(); };
    piece([[-40, -30], [30, -34], [40, -6], [-46, -4]], -0.2, -52, 0); piece([[-34, -28], [34, -22], [28, 0], [-38, -2]], 0.35, 62, -4); piece([[-20, -22], [24, -26], [18, -4], [-24, -6]], 1.2, 4, -34);
    for (const [dx, dy] of [[-100, 2], [-90, 14], [100, 8], [20, 16], [-20, 18]]) shape(c, () => ell(c, dx, dy - 4, 6, 4), BISCDK, 3);
  } else if (kind === "dough" || kind === "doughSquashed") {
    const sq = kind === "doughSquashed";
    const p = () => { if (sq) { c.moveTo(-105, -2); c.bezierCurveTo(-112, -30, -55, -42, 0, -40); c.bezierCurveTo(60, -40, 112, -30, 105, -2); c.bezierCurveTo(50, 10, -50, 10, -105, -2); } else { c.moveTo(-82, -4); c.bezierCurveTo(-96, -60, -40, -108, 10, -100); c.bezierCurveTo(72, -96, 104, -50, 82, -4); c.bezierCurveTo(40, 8, -40, 8, -82, -4); } c.closePath(); };
    shadow(c, 12, 4, 108, 24); shape(c, p, "#f1dcae"); sh(c, p, "#c9ad74", 14, 0.55); shape(c, p, "rgba(0,0,0,0)", 6);
    if (sq) shape(c, () => ell(c, 0, -22, 62, 12), "#e0c78e", 3); else { shape(c, () => ell(c, -14, -62, 16, 10), "#d9bf86", 3); }
  } else if (kind === "raw" || kind === "rawCracked") {
    shadow(c, 12, 4, 104, 26);
    puck(c, 92, 36, 24, "#b07b45", "#8a5a2c");
    shape(c, () => ell(c, 0, -24, 80, 28), "#f3ecc9", 0);
    c.save(); c.beginPath(); ell(c, 0, -24, 52, 17); c.strokeStyle = "#e0d6a4"; c.lineWidth = 3; c.stroke(); c.restore();
    for (const [dx, dy] of [[-30, -28], [24, -20], [4, -34], [-8, -16]]) shape(c, () => ell(c, dx, dy, 4, 2.5), "#d8cc9a", 0);
    if (kind === "rawCracked") line(c, [[-44, -40], [-16, -26], [-30, -14], [10, -8], [0, 2]], 5);
  } else if (kind === "boiled" || kind === "boiledSquashed") {
    const sq = kind === "boiledSquashed";
    const p = () => { if (sq) { c.moveTo(-100, -2); c.bezierCurveTo(-108, -34, -50, -44, 0, -42); c.bezierCurveTo(60, -44, 108, -34, 100, -2); c.bezierCurveTo(50, 10, -50, 10, -100, -2); } else { c.moveTo(-78, -4); c.bezierCurveTo(-94, -50, -50, -92, 4, -90); c.bezierCurveTo(60, -92, 96, -50, 74, -4); c.bezierCurveTo(30, 8, -40, 6, -78, -4); } c.closePath(); };
    shadow(c, 12, 4, 108, 24); shape(c, p, "#e2bd6e"); sh(c, p, "#b8903f", 14, 0.5); shape(c, p, "rgba(0,0,0,0)", 6);
    shape(c, () => ell(c, -26, sq ? -24 : -50, sq ? 46 : 34, sq ? 12 : 24, sq ? 0 : -0.3), "#f7e9a8", 4);
    shape(c, () => ell(c, 40, sq ? -18 : -36, 6, 4), "#8a6a30", 0); shape(c, () => ell(c, 58, sq ? -14 : -24, 5, 3.5), "#8a6a30", 0);
    if (!sq) for (const sx of [-6, 34]) line(c, [[sx, -108], [sx + 10, -122], [sx, -136], [sx + 10, -150]], 6, COL.grey);
  } else if (kind === "sponge") {
    shadow(c, 14, 4, 112, 24);
    const front = () => rrect(c, -80, -64, 150, 64, 8);
    shape(c, () => polyP(c, [[-80, -64], [70, -64], [96, -90], [-54, -90]]), "#fbe27a", 6);
    shape(c, () => polyP(c, [[70, -64], [96, -90], [96, -26], [70, 0]]), "#d9b73a", 6);
    shape(c, front, "#f5d34a", 6);
    shape(c, () => { c.moveTo(-80, -16); c.lineTo(70, -16); c.lineTo(70, -8); c.arcTo(70, 0, 62, 0, 8); c.lineTo(-72, 0); c.arcTo(-80, 0, -80, -8, 8); c.closePath(); }, COL.green, 5);
    for (const [dx, dy, r] of [[-50, -44, 7], [-10, -36, 9], [30, -46, 6], [50, -30, 8], [-30, -26, 5], [10, -52, 5]]) shape(c, () => ell(c, dx, dy, r, r * 0.7), "#c9a02c", 3);
  } else {
    const p = () => polyP(c, [[-76, -4], [-86, -34], [-52, -72], [0, -86], [52, -68], [84, -32], [74, -4], [20, 6], [-40, 4]]);
    shadow(c, 12, 4, 100, 22); shape(c, p, COL.grey); sh(c, p, COL.greyDk, 14, 0.6);
    shape(c, () => polyP(c, [[-52, -72], [0, -86], [-8, -40], [-60, -34]]), "#d6d1c8", 0);
    line(c, [[-8, -40], [34, -30], [74, -4]], 4, INK); line(c, [[-8, -40], [-60, -34], [-86, -34]], 4, INK); line(c, [[-8, -40], [0, -86]], 4, INK);
    shape(c, p, "rgba(0,0,0,0)", 6);
  }
  c.restore();
};
// a newspaper tube standing at (cx, base), width w, height h
const paperTube = (c: Ctx, cx: number, base: number, w: number, h: number) => {
  const rx = w / 2, ry = w * 0.2, top = base - h;
  shadow(c, cx + 30, base + 8, rx * 1.3, ry * 0.8);
  const body = () => { c.moveTo(cx - rx, top); c.lineTo(cx - rx, base); c.ellipse(cx, base, rx, ry, 0, Math.PI, 0, true); c.lineTo(cx + rx, top); c.closePath(); };
  shape(c, body, "#f4f0e6", 6); sh(c, body, "#cfc8b4", rx * 0.5, 0.6);
  c.save(); c.beginPath(); body(); c.clip();
  for (let k = 0; k < 9; k++) { const y = top + 70 + k * 46; line(c, [[cx - rx + 20, y], [cx + rx - 24, y]], 5, COL.grey); line(c, [[cx - rx + 20, y + 14], [cx + rx - 50, y + 14]], 5, COL.grey); }
  shape(c, () => rrect(c, cx - rx + 18, top + 100, rx * 1.2, 30, 4), COL.greyDk, 0);
  c.restore();
  shape(c, body, "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, cx, top, rx, ry), "#2b2340", 6);
  shape(c, () => ell(c, cx, top + 2, rx - 10, ry - 7), "#4a4060", 0);
};

const NAVY = "#2e3a59", WETP = "#8fb8e4";

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  clayBall(c, 540, 300, 105);
  handArm(c, 540 - 105 + 6 - 96 * 2, 300, 0, 2, "L", true, 500);
  handArm(c, 540 + 105 - 6 + 96 * 2, 300, 0, 2, "R", true, 500);
  arrow(c, [[400, 120], [470, 80], [610, 80], [680, 120]], RED, 12);
  plate(c, 540, 780, 470, 150);
  clayBall(c, 290, 750, 105); clayBall(c, 540, 790, 105); clayBall(c, 790, 750, 105);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  plate(c, 560, 900, 440, 100);
  // the ruler stands upright on the plate, 50 px to each centimetre, 0 at the plate
  const x0 = 380, w = 110, y0 = 880, per = 50;
  shadow(c, x0 + 90, y0 + 6, 90, 16);
  shape(c, () => rrect(c, x0 + w, y0 - 600, 16, 600, 3), COL.woodDk, 6);
  shape(c, () => rrect(c, x0, y0 - 600, w, 600, 3), COL.wood, 6);
  for (let cm = 0; cm <= 12; cm++) { const y = y0 - cm * per, l = cm % 5 === 0 ? 46 : 28; line(c, [[x0 + w, y], [x0 + w - l, y]], cm % 5 === 0 ? 5 : 3.5); }
  write(c, "5", x0 + 20, y0 - 5 * per - 20, 34); write(c, "10 cm", x0 + 6, y0 - 10 * per - 46, 28);
  const markY = y0 - 10 * per, r = 78, bx = 620;
  line(c, [[x0 + w, markY], [bx + r, markY]], 5, RED);
  clayBall(c, bx, markY - r, r);
  handArm(c, bx + 95 * 2, markY - r, 0, 2, "R", false, 500);
  arrow(c, [[bx, markY + 30], [bx, 770]], RED, 12);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  // the squashed ball sits on the plate: its flat bottom is the patch, the ruler lies along it, 0 at the left edge (120 px to the cm)
  plate(c, 540, 745, 500, 130);
  clayDome(c, 500, 700, 480, 320);
  const rx0 = 260, rt = 730;
  shadow(c, 560, rt + 100, 360, 16);
  shape(c, () => rrect(c, rx0 - 50, rt, 620, 90, 6), COL.wood, 6);
  for (let k = 0; k <= 8; k++) { const x = rx0 + k * 60, whole = k % 2 === 0; line(c, [[x, rt], [x, rt + (whole ? 42 : 28)]], 4); if (whole) write(c, String(k / 2), x - 10, rt + 46, 30, INK, 5); }
  line(c, [[rx0, 330], [rx0, rt + 90]], 5, RED); line(c, [[rx0 + 480, 330], [rx0 + 480, rt + 90]], 5, RED);
  arrow(c, [[rx0 + 240, 330], [rx0 + 6, 330]], RED, 9); arrow(c, [[rx0 + 240, 330], [rx0 + 474, 330]], RED, 9);
  handArm(c, 930, rt + 45, 0, 1.4, "R", false, 300);
};

// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  const base = 700;
  shape(c, () => rrect(c, 40, base, 1000, 46, 10), COL.steel, 6);
  const W = [130, 170, 230, 300], H = [140, 112, 84, 60], X = [135, 320, 555, 855], T = ["10", "20", "40", "80"], AL = [40, 80, 160, 320];
  for (let i = 0; i < 4; i++) {
    clayDome(c, X[i], base, W[i], H[i]);
    const top = base - H[i] - 16;
    arrow(c, [[X[i], top - AL[i]], [X[i], top]], RED, 9);
    line(c, [[X[i] - W[i] / 2, base + 72], [X[i] + W[i] / 2, base + 72]], 6, RED);
    line(c, [[X[i] - W[i] / 2, base + 58], [X[i] - W[i] / 2, base + 86]], 6, RED); line(c, [[X[i] + W[i] / 2, base + 58], [X[i] + W[i] / 2, base + 86]], 6, RED);
    write(c, T[i] + " cm", X[i] - 74, base + 120, 40);
  }
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  const K: Kind[] = ["biscuit", "dough", "raw", "boiled", "sponge", "stone"];
  K.forEach((k, i) => {
    const x = 190 + (i % 3) * 350, y = 330 + Math.floor(i / 3) * 400;
    plate(c, x, y + 30, 170, 76);
    item(c, k, x, y + 44, 1.3);
  });
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 880, 360, 80);
  item(c, "biscuit", 540, 900, 1.5);
  paperTube(c, 540, 830, 200, 430);
  // the cricket ball, held above the tube
  const bx = 540, by = 190, r = 72;
  shape(c, () => ell(c, bx, by, r, r), "#c8382e", 6);
  sh(c, () => ell(c, bx, by, r, r), "#8e1f1a", 18, 0.6);
  line(c, [[bx - r * 0.7, by - r * 0.55], [bx - r * 0.1, by - r * 0.1], [bx - r * 0.1, by + r * 0.45], [bx - r * 0.55, by + r * 0.8]], 4, WHITE);
  shape(c, () => ell(c, bx, by, r, r), "rgba(0,0,0,0)", 6);
  handArm(c, bx + 95 * 2.1, by, 0, 2.1, "R", false, 500);
  arrow(c, [[bx, by + 100], [bx, 330]], RED, 12);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  const cols = [{ x: 40, bg: "#f8d9b8", badge: 0, items: ["doughSquashed", "boiledSquashed"] }, { x: 385, bg: "#cfe8c4", badge: 1, items: ["sponge", "stone"] }, { x: 730, bg: "#f7c9c2", badge: 2, items: ["biscuitBroken", "rawCracked"] }];
  cols.forEach((g) => {
    shape(c, () => rrect(c, g.x, 120, 310, 840, 30), g.bg, 6);
    const cx = g.x + 155;
    shape(c, () => ell(c, cx, 250, 92, 92), WHITE, 6);
    c.save(); c.translate(cx, 250);
    if (g.badge === 0) { shape(c, () => ell(c, 0, 24, 60, 20), CLAY, 5); arrow(c, [[0, -62], [0, -14]], RED, 8); }
    else if (g.badge === 1) { shape(c, () => rrect(c, -34, -4, 68, 42, 8), "#f5d34a", 5); arrow(c, [[-48, 16], [-48, -36], [-4, -50]], RED, 8); }
    else { line(c, [[-50, -50], [-10, -14], [-34, 4], [10, 26], [-8, 52]], 9, RED); line(c, [[50, -50], [20, -10], [40, 10]], 7, RED); }
    c.restore();
    plate(c, cx, 480, 140, 62);
    item(c, g.items[0] as Kind, cx, 490, 1.0);
    plate(c, cx, 800, 140, 62);
    item(c, g.items[1] as Kind, cx, 810, 1.0);
  });
};

// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  const rimY = 600, wl = 740, bx = 540, br = 105;
  // the steel bowl in cross-section, water inside up to wl
  shadow(c, 560, 940, 400, 34);
  const outer = () => { c.moveTo(130, rimY); c.lineTo(950, rimY); c.bezierCurveTo(940, 905, 740, 930, 540, 930); c.bezierCurveTo(340, 930, 140, 905, 130, rimY); c.closePath(); };
  shape(c, outer, COL.steel, 6); sh(c, outer, COL.steelDk, 40, 0.6); shape(c, outer, "rgba(0,0,0,0)", 6);
  const inner = () => { c.moveTo(170, rimY + 18); c.lineTo(910, rimY + 18); c.bezierCurveTo(900, 870, 730, 898, 540, 898); c.bezierCurveTo(350, 898, 180, 870, 170, rimY + 18); c.closePath(); };
  shape(c, inner, COL.steelIn, 5);
  // the ball, dipped halfway
  shape(c, () => ell(c, bx, wl, br, br), COL.blue, 6);
  sh(c, () => ell(c, bx, wl, br, br), COL.blueDk, 24, 0.6);
  line(c, [[bx - br * 0.95, wl - br * 0.4], [bx - br * 0.4, wl - br * 0.3], [bx + br * 0.4, wl - br * 0.3], [bx + br * 0.95, wl - br * 0.4]], 5, WHITE);
  shine(c, [[bx - br * 0.6, wl - br * 0.55], [bx - br * 0.4, wl - br * 0.85]], 8);
  // the water, over the lower half of the ball: that half is wet
  c.save(); c.beginPath(); inner(); c.clip();
  c.fillStyle = "rgba(143,195,234,0.7)"; c.fillRect(0, wl, D, 400);
  c.restore();
  line(c, [[170, wl], [bx - br - 6, wl]], 5, COL.waterDk); line(c, [[bx + br + 6, wl], [910, wl]], 5, COL.waterDk);
  line(c, [[bx - br - 50, wl + 20], [bx - br - 14, wl + 20]], 4, WHITE); line(c, [[bx + br + 14, wl + 20], [bx + br + 50, wl + 20]], 4, WHITE);
  shape(c, () => ell(c, bx, wl, br, br), "rgba(0,0,0,0)", 6);
  // a hand holds the ball from above and lowers it
  handArm(c, bx, 548, Math.PI / 2, 2, "L", false, 700);
  arrow(c, [[800, 580], [800, 690]], RED, 12);
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c, BG);
  c.fillStyle = FLOOR; c.fillRect(0, 880, D, 200);
  line(c, [[0, 880], [D, 880]], 6);
  shape(c, () => polyP(c, [[580, 905], [920, 905], [1020, 1030], [480, 1030]]), NAVY, 6);
  const hip = [400, 590], knee = [450, 750], foot = [410, 872];
  // back leg then front leg
  for (const [dx, col] of [[-38, "#54476f"], [0, "#6b5a8c"]] as [number, string][]) {
    line(c, [[hip[0] + dx, hip[1]], [knee[0] + dx, knee[1]], [foot[0] + dx, foot[1]]], 74, INK); line(c, [[hip[0] + dx, hip[1]], [knee[0] + dx, knee[1]], [foot[0] + dx, foot[1]]], 62, col);
    shape(c, () => ell(c, foot[0] + dx + 28, 872, 56, 20), INK, 0); shape(c, () => ell(c, foot[0] + dx + 28, 872, 50, 15), "#e4523b", 0);
  }
  // body leaning forward
  c.save(); c.translate(hip[0], hip[1]); c.rotate(0.95);
  const torso = () => rrect(c, -62, -255, 124, 290, 46);
  shape(c, torso, CLOTH.child); sh(c, torso, CLOTH.childDk, 22, 0.6); shape(c, torso, "rgba(0,0,0,0)", 6);
  c.restore();
  const shx = 583, shy = 469;
  // head
  const hx = 672, hy = 405;
  shape(c, () => ell(c, hx, hy, 72, 76), SKIN.child);
  shape(c, () => { c.moveTo(hx - 74, hy + 4); c.bezierCurveTo(hx - 80, hy - 110, hx + 70, hy - 110, hx + 74, hy - 24); c.quadraticCurveTo(hx + 10, hy - 50, hx - 74, hy + 4); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, hx - 56, hy - 4, 24, 36), CLOTH.hair, 4);
  shape(c, () => ell(c, hx + 14, hy + 8, 7, 10), INK, 0); shape(c, () => ell(c, hx + 48, hy + 8, 7, 10), INK, 0);
  c.beginPath(); c.arc(hx + 32, hy + 28, 16, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  // arm down to the hand, ball at knee height
  const wx = 700, wy = 640, ballY = wy + 101;
  line(c, [[shx, shy], [wx, wy - 62]], 64, INK); line(c, [[shx, shy], [wx, wy - 62]], 52, CLOTH.child);
  line(c, [[knee[0] + 40, ballY], [wx - 60, ballY]], 4, COL.grey);
  dropBall(c, wx, ballY, 55, true);
  hand(c, wx, wy, Math.PI / 2, 1.3);
  arrow(c, [[wx + 110, ballY - 10], [wx + 110, 860]], RED, 12);
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 50, 450, 980, 540, 14), NAVY, 6);
  const P = [[170, 700, 60, 1], [450, 720, 110, 2], [800, 730, 170, 3]];
  const heights = [0.2, 0.44, 0.72];
  P.forEach(([x, y, r, seedN], i) => {
    // the wet print with a wobbly edge, and the pencil ring drawn round it
    const wob = (rr: number) => () => { for (let a = 0; a <= 160; a++) { const t = (a / 160) * Math.PI * 2, q = rr * (1 + 0.025 * Math.sin(t * 5 + seedN) + 0.02 * Math.sin(t * 3 + seedN * 2)); a ? c.lineTo(x + Math.cos(t) * q, y + Math.sin(t) * q) : c.moveTo(x + Math.cos(t) * q, y + Math.sin(t) * q); } c.closePath(); };
    c.save(); c.setLineDash([14, 12]); c.beginPath(); wob(r + 22)(); c.strokeStyle = WHITE; c.lineWidth = 5; c.stroke(); c.restore();
    shape(c, wob(r), WETP, 0);
    c.save(); c.beginPath(); wob(r)(); c.clip(); c.beginPath(); ell(c, x + r * 0.3, y + r * 0.3, r, r); c.fillStyle = "#6a97c8"; c.globalAlpha = 0.5; c.fill(); c.restore(); c.globalAlpha = 1;
    shine(c, [[x - r * 0.55, y - r * 0.2], [x - r * 0.3, y - r * 0.55]], Math.max(6, r * 0.07));
    // a small child with the ball held at knee, waist, shoulder height, above the print
    const h = 320, fy = 410, px = x - 60;
    person(c, px, fy, h);
    const by = fy - h * heights[i] - (i === 2 ? 0 : 0);
    line(c, [[px + 14, by], [px + 90, by]], 4, COL.grey);
    dropBall(c, px + 120, by - 28, 28, false);
    arrow(c, [[px + 120, by + 12], [px + 120, 430]], RED, 7);
  });
};


export const su_forcesChangingMotion = cards("sci.forces.changing-motion.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
