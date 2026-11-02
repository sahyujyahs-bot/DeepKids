import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, WHITE, SKIN, arrow, shine, cards, D, ell, ground, hand, line, person, polyP, rnd, rrect, shade, shadow, shape, write } from "./flatKit";

// HOW WE SEE L3 · picture cards for the lesson's activities, words and ideas.
// Bold ink outlines, flat colours, shade side, soft shadow. Same child and grown-up as the set-up cards.

const NIGHT = "#1d1b3a", DARK = "#14111f", WALL = "#f3e6c9", FLOOR = "#d9b98a", BOXC = { top: "#d9a066", mid: "#c58a52", dk: "#a8723f" };
const GLOW = "rgba(255,226,120,0.40)";

// ---------------------------------------------------------------- shared pieces
const torch = (c: Ctx, x: number, y: number, an: number, s = 1) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -20, -30, 170, 60, 14), COL.teal);
  shape(c, () => polyP(c, [[150, -30], [205, -50], [205, 50], [150, 30]]), COL.steel);
  shape(c, () => ell(c, 207, 0, 10, 46), COL.yellow);
  c.restore();
};
// the front of a torch lens, given the torch pivot, angle and size
const lensOf = (x: number, y: number, an: number, s: number): [number, number] => [x + Math.cos(an) * 207 * s, y + Math.sin(an) * 207 * s];
const beam = (c: Ctx, pts: number[][], a = 0.4) => { c.beginPath(); polyP(c, pts); c.fillStyle = `rgba(255,226,120,${a})`; c.fill(); };
const star = (c: Ctx, x: number, y: number, r: number, col = "#fff6c8") => {
  c.beginPath(); c.moveTo(x, y - r); c.quadraticCurveTo(x, y, x + r, y); c.quadraticCurveTo(x, y, x, y + r); c.quadraticCurveTo(x, y, x - r, y); c.quadraticCurveTo(x, y, x, y - r); c.closePath(); c.fillStyle = col; c.fill();
};
const sunDisc = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 10, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
  shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.25, r * 0.2, 0.5);
};
const mango = (c: Ctx, x: number, y: number, s = 1, rot = -0.3) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shadow(c, 10, 100, 100, 14);
  const p = () => { c.moveTo(-95, 10); c.bezierCurveTo(-95, -70, 30, -90, 90, -30); c.bezierCurveTo(120, 20, 60, 80, -20, 80); c.bezierCurveTo(-70, 80, -95, 50, -95, 10); c.closePath(); };
  shape(c, p, COL.orange); shade(c, p, COL.red, 24, 16, 0.55);
  shape(c, () => ell(c, 10, -78, 14, 8), COL.greenDk, 4);
  shape(c, () => { c.moveTo(14, -80); c.quadraticCurveTo(60, -130, 110, -100); c.quadraticCurveTo(70, -76, 14, -80); c.closePath(); }, COL.leaf, 5);
  shine(c, [[-70, -20], [-50, -50]], 9);
  c.restore();
};
const lamp = (c: Ctx, x: number, y: number, s = 1, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => ell(c, 0, 120, 70, 16), COL.tealDk);
  shape(c, () => rrect(c, -9, -10, 18, 130, 6), COL.teal);
  shape(c, () => ell(c, 0, -30, 34, 34), COL.yellow);
  shape(c, () => polyP(c, [[-40, -30], [40, -30], [62, -100], [-62, -100]]), COL.teal);
  c.restore();
};
// a child's head in side view, facing right (flip with c.scale); the eye is at about (r*0.55, -r*0.05)
const miniHead = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => rrect(c, x - r * 0.28, y + r * 0.7, r * 0.56, r * 0.7, 8), SKIN.childDk);
  shape(c, () => ell(c, x, y, r, r * 1.08), SKIN.child);
  shade(c, () => ell(c, x, y, r, r * 1.08), SKIN.childDk, -r * 0.25, -r * 0.1, 0.55);
  shape(c, () => { c.moveTo(x - r, y + r * 0.1); c.bezierCurveTo(x - r * 1.05, y - r * 1.5, x + r * 0.9, y - r * 1.4, x + r * 0.7, y - r * 0.45); c.quadraticCurveTo(x - r * 0.1, y - r * 0.75, x - r * 0.45, y - r * 0.1); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x + r * 0.5, y - r * 0.02, r * 0.19, r * 0.22), WHITE, 4);
  shape(c, () => ell(c, x + r * 0.56, y - r * 0.02, r * 0.1, r * 0.12), DARK, 0);
  shape(c, () => { c.moveTo(x + r * 0.96, y + r * 0.1); c.lineTo(x + r * 1.2, y + r * 0.34); c.lineTo(x + r * 0.92, y + r * 0.38); c.closePath(); }, SKIN.child, 4);
  line(c, [[x + r * 0.45, y + r * 0.62], [x + r * 0.85, y + r * 0.6]], 4);
};
// an eye seen from the front: lid, iris, pupil
const eyeFront = (c: Ctx, x: number, y: number, w: number, pupil: number, irisCol: string = COL.brown) => {
  const lid = () => { c.moveTo(x - w / 2, y); c.quadraticCurveTo(x, y - w * 0.62, x + w / 2, y); c.quadraticCurveTo(x, y + w * 0.62, x - w / 2, y); c.closePath(); };
  shape(c, lid, WHITE, 7);
  c.save(); c.beginPath(); lid(); c.clip();
  shape(c, () => ell(c, x, y, w * 0.27, w * 0.27), irisCol, 0);
  shape(c, () => ell(c, x, y, pupil, pupil), DARK, 0);
  shape(c, () => ell(c, x - w * 0.08, y - w * 0.09, w * 0.04, w * 0.04), WHITE, 0);
  c.restore();
  shape(c, lid, "rgba(0,0,0,0)", 7);
  line(c, [[x - w * 0.4, y - w * 0.2], [x, y - w * 0.4], [x + w * 0.4, y - w * 0.2]], 9, CLOTH.hair);
};
// the eye cut open, seen from the side, front at the left. hl names the part to show strongly; "" shows all in colour.
const eyeSide = (c: Ctx, cx: number, cy: number, R: number, hl = "", blind = false) => {
  const v = (k: string, vivid: string, pale: string) => (hl === "" || hl === k ? vivid : pale);
  const lw = hl === "" ? 6 : 5;
  // optic nerve tube behind
  const nx = cx + Math.cos(0.45) * R, ny = cy + Math.sin(0.45) * R, ex = cx + R * 1.85, ey = cy + R * 0.95;
  line(c, [[nx - 10, ny - 4], [ex, ey]], R * 0.3, INK); line(c, [[nx - 10, ny - 4], [ex, ey]], R * 0.3 - 10, v("nerve", "#f3d27a", "#ece3cf"));
  if (hl === "nerve" || hl === "") for (const o of [-0.07, 0, 0.07]) line(c, [[nx + 10, ny + o * R], [ex - 20, ey + o * R]], 3, "#c9a24a");
  // the ball
  shape(c, () => ell(c, cx, cy, R, R), WHITE, lw);
  shape(c, () => ell(c, cx, cy, R * 0.92, R * 0.92), "#dff0fa", 0);
  // retina along the back wall
  c.beginPath(); c.arc(cx, cy, R * 0.93, -1.0, 1.0); c.strokeStyle = INK; c.lineWidth = R * 0.12 + 8; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.arc(cx, cy, R * 0.93, -1.0, 1.0); c.strokeStyle = v("retina", "#e0436b", "#f3cfd6"); c.lineWidth = R * 0.12; c.stroke();
  if (hl === "retina") { const r = rnd(5); for (let i = 0; i < 26; i++) { const a = -0.92 + (i / 25) * 1.84; shape(c, () => ell(c, cx + Math.cos(a) * R * 0.86, cy + Math.sin(a) * R * 0.86, 5 + r() * 2, 5 + r() * 2), "#ffe0e8", 0); } }
  // iris plates and the pupil gap
  const ir = v("iris", COL.brown, "#d9cfc0");
  shape(c, () => polyP(c, [[cx - R * 0.84, cy - R * 0.55], [cx - R * 0.7, cy - R * 0.55], [cx - R * 0.68, cy - R * 0.17], [cx - R * 0.77, cy - R * 0.17]]), ir, 5);
  shape(c, () => polyP(c, [[cx - R * 0.84, cy + R * 0.55], [cx - R * 0.7, cy + R * 0.55], [cx - R * 0.68, cy + R * 0.17], [cx - R * 0.77, cy + R * 0.17]]), ir, 5);
  // lens
  shape(c, () => ell(c, cx - R * 0.5, cy, R * 0.17, R * 0.4), v("lens", COL.yellow, "#f3ecd0"), lw);
  if (hl === "lens") shine(c, [[cx - R * 0.55, cy - R * 0.25], [cx - R * 0.55, cy - R * 0.08]], 7);
  // cornea dome
  const dome = () => { c.moveTo(cx - R * 0.835, cy - R * 0.55); c.quadraticCurveTo(cx - R * 1.45, cy, cx - R * 0.835, cy + R * 0.55); c.closePath(); };
  shape(c, dome, v("cornea", "rgba(110,200,240,0.85)", "rgba(200,225,240,0.55)"), lw);
  if (hl === "cornea") shine(c, [[cx - R * 1.05, cy - R * 0.3], [cx - R * 0.98, cy - R * 0.1]], 8);
  if (blind) {
    const px = cx + Math.cos(0.45) * R * 0.93, py = cy + Math.sin(0.45) * R * 0.93;
    arrow(c, [[cx - R * 1.55, cy - R * 0.15], [px - 24, py - 8]], COL.orange, 9);
    line(c, [[px - 24, py - 30], [px + 24, py + 18]], 11, RED); line(c, [[px + 24, py - 30], [px - 24, py + 18]], 11, RED);
  }
};
const clothesRow = (c: Ctx) => c;

// ---------------------------------------------------------------- flows
// flow.e1 The Dark Box, seen from above with the lid off: a crack of light falls on the paper, the eye at the peephole
const ic_e1 = (c: Ctx) => {
  ground(c);
  shadow(c, 620, 800, 380, 36);
  shape(c, () => rrect(c, 330, 350, 610, 420, 8), BOXC.mid);
  shape(c, () => rrect(c, 358, 378, 556, 364, 4), "#2f2740");
  // the peephole: a gap in the left wall
  shape(c, () => rrect(c, 322, 538, 44, 64, 4), "#2f2740", 0);
  // things on the floor of the box, seen from above
  shape(c, () => ell(c, 520, 470, 50, 50), COL.red); shade(c, () => ell(c, 520, 470, 50, 50), "#a8301f", 12, 8, 0.55);
  line(c, [[480, 690], [640, 690]], 22, INK); line(c, [[480, 690], [640, 690]], 12, COL.steel);
  shape(c, () => ell(c, 690, 690, 44, 26), COL.steel); shape(c, () => ell(c, 690, 690, 28, 14), COL.steelIn, 3);
  // light from a crack at the top, falling onto the white paper
  c.beginPath(); polyP(c, [[740, 378], [800, 378], [820, 560], [700, 560]]); c.fillStyle = "rgba(255,232,120,0.55)"; c.fill();
  shape(c, () => rrect(c, 700, 520, 120, 90, 6), WHITE);
  // the lid, lifted a little at the top
  shape(c, () => polyP(c, [[330, 350], [740, 350], [740, 336], [330, 300]]), BOXC.top);
  shape(c, () => polyP(c, [[800, 350], [940, 350], [940, 304], [800, 336]]), BOXC.top);
  // the eye outside the box, looking in at the peephole
  shape(c, () => ell(c, 190, 570, 92, 92), WHITE, 7);
  shape(c, () => ell(c, 224, 570, 44, 44), COL.brown, 0); shape(c, () => ell(c, 232, 570, 20, 20), DARK, 0);
  shape(c, () => ell(c, 190, 570, 92, 92), "rgba(0,0,0,0)", 7);
  arrow(c, [[690, 590], [530, 590], [420, 575]], RED, 11);
};

// flow.e3 Break the Light's Journey: torch -> toy -> card -> eye
const toyElephant = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const t = { body: "#9db2d8", dk: "#6f86b8", ear: "#8aa0cc" };
  shadow(c, 22, 4, 150, 14);
  for (const lx of [-80, -30]) shape(c, () => rrect(c, lx - 18, -72, 36, 72, 10), t.dk);
  shape(c, () => ell(c, 0, -130, 112, 82), t.body); shade(c, () => ell(c, 0, -130, 112, 82), t.dk, -26, -16, 0.7);
  for (const lx of [30, 80]) shape(c, () => rrect(c, lx - 18, -72, 36, 72, 10), t.body);
  line(c, [[150, -130], [192, -85], [170, -38]], 48, INK); line(c, [[150, -130], [192, -85], [170, -38]], 36, t.body);
  shape(c, () => ell(c, 112, -150, 62, 62), t.body); shape(c, () => ell(c, 80, -140, 40, 58, 0.2), t.ear);
  shape(c, () => ell(c, 135, -165, 7, 7), INK, 0);
  c.restore();
};
const ic_e3 = (c: Ctx) => {
  ground(c, NIGHT);
  shape(c, () => rrect(c, 60, 850, 640, 44, 10), COL.wood);
  const T: [number, number] = [90, 240], an = 0.78, L = lensOf(T[0], T[1], an, 1.1);
  beam(c, [L, [440, 700], [650, 790]]);
  torch(c, T[0], T[1], an, 1.1);
  toyElephant(c, 460, 850, 1.1);
  // the card in the way, and the eye behind it
  shape(c, () => polyP(c, [[800, 480], [880, 450], [880, 810], [800, 840]]), WHITE);
  shade(c, () => polyP(c, [[800, 480], [880, 450], [880, 810], [800, 840]]), COL.grey, -8, -6, 0.5);
  arrow(c, [[640, 700], [770, 640]], RED, 11);
  line(c, [[815, 590], [865, 660]], 13, RED); line(c, [[865, 590], [815, 660]], 13, RED);
  eyeFront(c, 960, 300, 200, 22);
};

// flow.a1 Catch the Invisible Beam: mist makes the beam show
const ic_a1 = (c: Ctx) => {
  ground(c, NIGHT);
  c.fillStyle = "#2b2850"; c.fillRect(985, 0, 95, 1080);
  shape(c, () => rrect(c, 60, 800, 560, 44, 10), COL.wood);
  const T: [number, number] = [90, 705], L = lensOf(T[0], T[1], 0, 1.1);
  const b = [L, [985, 450], [985, 810]];
  beam(c, b, 0.13);
  c.save(); c.beginPath(); polyP(c, b); c.clip(); c.fillStyle = "rgba(255,236,150,0.5)"; c.fillRect(470, 0, 560, 1080);
  const r = rnd(4); for (let i = 0; i < 70; i++) { const x = 480 + r() * 500, y = 460 + r() * 340; c.beginPath(); ell(c, x, y, 3 + r() * 4, 3 + r() * 4); c.fillStyle = WHITE; c.fill(); }
  c.restore();
  shape(c, () => ell(c, 1030, 630, 30, 150), COL.yellow, 5);
  torch(c, T[0], T[1], 0, 1.1);
  // the spray bottle above, misting into the beam
  const bx = 680, by = 150;
  shape(c, () => rrect(c, bx, by + 40, 130, 210, 22), COL.blue); shade(c, () => rrect(c, bx, by + 40, 130, 210, 22), COL.blueDk, 20, 0, 0.55);
  shape(c, () => rrect(c, bx + 30, by, 70, 50, 8), COL.steel);
  shape(c, () => rrect(c, bx - 50, by - 22, 150, 44, 14), COL.steel);
  shape(c, () => rrect(c, bx - 70, by - 12, 30, 24, 6), COL.steelDk);
  shape(c, () => rrect(c, bx + 40, by + 120, 50, 70, 10), WHITE, 4);
  for (let i = 0; i < 26; i++) { const x = bx - 80 - r() * 140, y = by + 10 + r() * 400; c.beginPath(); ell(c, x + (y - by) * 0.2, y, 4 + r() * 3, 4 + r() * 3); c.fillStyle = "rgba(233,243,255,0.9)"; c.fill(); }
  arrow(c, [[500, 270], [540, 400]], RED, 10);
};

// flow.a2 Find Your Blind Spot: card, then a child covering one eye
const kidFace = (c: Ctx, cx: number, cy: number, look: [number, number], coverRight: boolean) => {
  shape(c, () => rrect(c, cx - 60, cy + 230, 120, 90, 20), SKIN.childDk);
  shape(c, () => rrect(c, cx - 210, cy + 275, 420, 300, 60), CLOTH.child);
  shape(c, () => ell(c, cx - 250, cy + 20, 32, 52), SKIN.child, 5); shape(c, () => ell(c, cx + 250, cy + 20, 32, 52), SKIN.child, 5);
  const head = () => ell(c, cx, cy, 250, 290);
  shape(c, head, SKIN.child); shade(c, head, SKIN.childDk, -30, -14, 0.6);
  c.save(); c.beginPath(); head(); c.clip(); shape(c, () => ell(c, cx, cy - 265, 275, 150), CLOTH.hair, 0); c.restore();
  shape(c, head, "rgba(0,0,0,0)", 6);
  for (const s of [-1, 1]) {
    const x = cx + s * 92, y = cy - 30;
    const lid = () => { c.moveTo(x - 56, y); c.quadraticCurveTo(x, y - 84, x + 56, y); c.quadraticCurveTo(x, y + 84, x - 56, y); c.closePath(); };
    shape(c, lid, WHITE, 5);
    c.save(); c.beginPath(); lid(); c.clip();
    shape(c, () => ell(c, x + look[0], y + look[1], 36, 36), COL.brown, 0); shape(c, () => ell(c, x + look[0], y + look[1], 16, 16), DARK, 0);
    c.restore(); shape(c, lid, "rgba(0,0,0,0)", 5);
    line(c, [[x - 52, y - 68], [x, y - 82], [x + 52, y - 66]], 10, CLOTH.hair);
  }
  line(c, [[cx - 12, cy + 40], [cx + 4, cy + 62], [cx + 20, cy + 52]], 6, SKIN.childDk);
  c.beginPath(); c.arc(cx, cy + 150, 62, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 7; c.lineCap = "round"; c.stroke();
  void coverRight;
};
const ic_a2 = (c: Ctx) => {
  ground(c);
  // the card with a cross and a dot
  shadow(c, 560, 450, 440, 24);
  shape(c, () => rrect(c, 120, 90, 880, 330, 16), WHITE);
  line(c, [[240, 220], [320, 300]], 14); line(c, [[320, 220], [240, 300]], 14);
  shape(c, () => ell(c, 780, 260, 30, 30), INK, 0);
  write(c, "8 cm", 450, 300, 50, COL.greyDk, 7);
  line(c, [[300, 380], [790, 380]], 6, COL.greyDk);
  // the child, one eye covered by a flat hand
  c.save(); c.translate(0, 0); kidFace(c, 540, 700, [0, -16], true); c.restore();
  hand(c, 700, 745, -2.35, 1.8, SKIN.child, CLOTH.child, true);
  arrow(c, [[300, 445], [405, 590]], RED, 10);
};

// flow.a3 Night Eyes: the same patch of sky, more stars each time
const ic_a3 = (c: Ctx) => {
  ground(c);
  const xs = [190, 540, 890], counts = [2, 8, 22];
  xs.forEach((x, k) => {
    shape(c, () => ell(c, x, 330, 140, 140), NIGHT, 9);
    const r = rnd(11); c.save(); c.beginPath(); ell(c, x, 330, 132, 132); c.clip();
    const all: number[][] = []; for (let i = 0; i < 22; i++) all.push([x - 100 + r() * 200, 330 - 100 + r() * 200, 5 + r() * 9]);
    all.slice(0, counts[k]).forEach(([sx, sy, sr]) => star(c, sx, sy, sr + 4));
    c.restore();
    write(c, ["0", "10", "20"][k], x - (k ? 40 : 15), 520, 90, INK, 12);
  });
  arrow(c, [[345, 330], [385, 330]], RED, 10); arrow(c, [[695, 330], [735, 330]], RED, 10);
  // the child on a mat, looking up
  shadow(c, 540, 1020, 330, 24);
  shape(c, () => rrect(c, 250, 985, 580, 40, 12), COL.pink);
  person(c, 480, 990, 320, { sit: true, armL: [Math.PI * 0.4, -Math.PI * 0.05], armR: [Math.PI * 0.4, -Math.PI * 0.05] });
};

// flow.a4 Ibn al-Haytham's Lamps: three torches, a pinhole, three spots, upside down
const ic_a4 = (c: Ctx) => {
  ground(c);
  shadow(c, 660, 840, 360, 30);
  shape(c, () => rrect(c, 420, 300, 540, 480, 10), BOXC.mid);
  shape(c, () => rrect(c, 450, 328, 480, 424), "#fff3dc", 4);
  const ys = [330, 540, 750], pin: [number, number] = [435, 540], scr = 925, sy = [650, 540, 430];
  ys.forEach((y, i) => { line(c, [[210, y], [pin[0], pin[1]], [scr, sy[i]]], 6, COL.orange); });
  shape(c, () => rrect(c, 420, 300, 30, 480, 4), COL.steel);
  shape(c, () => ell(c, pin[0], pin[1], 9, 12), DARK, 0);
  shape(c, () => rrect(c, 925, 330, 22, 420, 4), WHITE, 4);
  sy.forEach((y) => shape(c, () => ell(c, 912, y, 20, 26), COL.yellow, 4));
  ys.forEach((y) => { c.save(); c.translate(70, y); c.scale(0.7, 0.7); torch(c, 0, 0, 0, 1); c.restore(); });
};

// flow.a5 Eyeshine and Red Eyes: a torch beside the face, glowing eyes in the dark
const ic_a5 = (c: Ctx) => {
  ground(c, NIGHT);
  c.fillStyle = "#16142e"; c.fillRect(0, 880, 1080, 200);
  person(c, 230, 1010, 700);
  torch(c, 270, 440, -0.06, 1.0);
  beam(c, [lensOf(270, 440, -0.06, 1), [760, 300], [760, 600]], 0.32);
  // two green glowing eyes far ahead, and the shape of the animal
  const cx = 830, cy = 450;
  shape(c, () => ell(c, cx, cy + 40, 115, 110), "#0f0c1e", 0);
  shape(c, () => polyP(c, [[cx - 105, cy - 20], [cx - 85, cy - 120], [cx - 20, cy - 50]]), "#0f0c1e", 0);
  shape(c, () => polyP(c, [[cx + 105, cy - 20], [cx + 85, cy - 120], [cx + 20, cy - 50]]), "#0f0c1e", 0);
  for (const s of [-1, 1]) {
    c.beginPath(); ell(c, cx + s * 48, cy + 10, 42, 36); c.fillStyle = "rgba(120,255,140,0.35)"; c.fill();
    shape(c, () => ell(c, cx + s * 48, cy + 10, 30, 26), "#8bff8f", 0);
    shape(c, () => ell(c, cx + s * 48, cy + 10, 6, 22), "#0f0c1e", 0);
  }
  arrow(c, [[740, 560], [560, 600], [420, 520]], RED, 10);
};

// flow.a6 Draw How You See: the old drawing and the new drawing, side by side
const sheet = (c: Ctx, x: number, y: number, rot: number, draw: () => void) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, 14, 300, 230, 22);
  shape(c, () => rrect(c, -225, -290, 450, 580, 10), WHITE);
  draw();
  shape(c, () => ell(c, 0, -270, 18, 18), RED, 4);
  c.restore();
};
const ball = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.blue); shade(c, () => ell(c, x, y, r, r), COL.blueDk, r * 0.3, r * 0.2, 0.55); shine(c, [[x - r * 0.5, y - r * 0.4], [x - r * 0.3, y - r * 0.6]], 7);
};
const ic_a6 = (c: Ctx) => {
  ground(c);
  sheet(c, 290, 540, -0.03, () => {
    miniHead(c, -120, 20, 55);
    ball(c, 120, 130, 38);
    line(c, [[-180, 200], [200, 200]], 5, COL.grey);
    arrow(c, [[-52, 30], [60, 100]], RED, 8);
  });
  sheet(c, 790, 540, 0.03, () => {
    lamp(c, -130, -90, 0.8);
    ball(c, 20, 140, 38);
    c.save(); c.translate(280, 0); c.scale(-1, 1); miniHead(c, 130, 40, 55); c.restore();
    line(c, [[-190, 220], [200, 220]], 5, COL.grey);
    arrow(c, [[-90, -50], [-10, 105]], RED, 8);
    arrow(c, [[75, 120], [105, 70]], RED, 8);
  });
};

// flow.p1 Eye in a Box: a lamp, a hole, an upside-down picture on the paper at the back, and the card strip
const ic_p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 600, 760, 380, 26);
  // box seen from the side, cut open
  shape(c, () => rrect(c, 330, 300, 560, 420, 8), BOXC.mid);
  shape(c, () => rrect(c, 352, 322, 504, 376), "#3b3354", 0);
  // the hole in the front wall
  shape(c, () => rrect(c, 326, 480, 32, 84), "#3b3354", 0);
  const hole: [number, number] = [340, 522];
  // rays from the lamp's top and bottom, crossing at the hole
  line(c, [[170, 440], hole, [820, 600]], 6, COL.yellow); line(c, [[170, 600], hole, [820, 440]], 6, COL.yellow);
  // the tracing paper at the back, glowing with an upside-down lamp
  shape(c, () => rrect(c, 856, 322, 28, 376, 4), "#fffdf0", 4);
  c.save(); c.translate(820, 520); c.scale(0.5, -0.5); c.globalAlpha = 0.95; lamp(c, 0, 0, 0.9); c.restore();
  lamp(c, 110, 510, 1.1);
  // the card strip with three holes of different sizes, ringed brown, green and blue
  shadow(c, 560, 1010, 400, 14);
  shape(c, () => rrect(c, 130, 820, 820, 170, 20), COL.paper);
  [[300, 22, COL.brown], [540, 36, COL.green], [780, 52, COL.blue]].forEach(([x, r, col]) => {
    shape(c, () => ell(c, x as number, 905, (r as number) + 26, (r as number) + 26), col as string, 5);
    shape(c, () => ell(c, x as number, 905, r as number, r as number), DARK, 5);
  });
};

// flow.c1 Light the Reading Corner Without a Bulb: window light -> white sheet -> dark corner
const ic_c1 = (c: Ctx) => {
  ground(c, WALL);
  c.fillStyle = FLOOR; c.fillRect(0, 860, D, 220); c.fillStyle = "#b8935f"; c.fillRect(0, 842, D, 18);
  line(c, [[0, 842], [D, 842]], 4); line(c, [[0, 860], [D, 860]], 4);
  // the dim corner on the right
  c.fillStyle = "rgba(43,35,64,0.28)"; c.fillRect(700, 0, 380, 1080);
  // window on the left wall, with sunlight pouring in
  shape(c, () => rrect(c, 50, 130, 190, 400, 8), COL.sky, 8);
  line(c, [[145, 130], [145, 530]], 6); line(c, [[50, 330], [240, 330]], 6);
  sunDisc(c, 150, 62, 30);
  beam(c, [[240, 140], [240, 520], [450, 700], [450, 360]], 0.35);
  // the white sheet on a clothes horse
  shadow(c, 450, 880, 120, 16);
  shape(c, () => polyP(c, [[390, 330], [510, 310], [510, 800], [390, 820]]), WHITE);
  shade(c, () => polyP(c, [[390, 330], [510, 310], [510, 800], [390, 820]]), COL.grey, -8, -6, 0.5);
  line(c, [[380, 320], [380, 860]], 12, INK); line(c, [[380, 320], [380, 860]], 6, COL.woodDk); line(c, [[520, 305], [520, 860]], 12, INK); line(c, [[520, 305], [520, 860]], 6, COL.woodDk);
  line(c, [[375, 330], [525, 310]], 12, INK); line(c, [[375, 330], [525, 310]], 6, COL.woodDk);
  // bounced light into the corner, and the child reading
  arrow(c, [[540, 470], [680, 560]], RED, 10); arrow(c, [[540, 560], [690, 690]], RED, 10);
  person(c, 840, 990, 480, { sit: true, armL: [Math.PI * 0.5, Math.PI * 0.1], armR: [Math.PI * 0.5, Math.PI * 0.1] });
  shape(c, () => polyP(c, [[800, 790], [920, 790], [930, 850], [810, 850]]), COL.red);
  shape(c, () => polyP(c, [[812, 796], [916, 796], [922, 842], [818, 842]]), WHITE, 3);
};

// flow.c2 A Night Path to the Bathroom: pale tape on the step, a low night-light, a safe walk
const ic_c2 = (c: Ctx) => {
  ground(c, "#232044");
  c.fillStyle = "#171533"; c.fillRect(0, 840, D, 240); line(c, [[0, 840], [D, 840]], 5, "#0c0a1c");
  // the door at the far right, edged with pale tape
  shape(c, () => rrect(c, 850, 330, 190, 510, 6), "#2f2b57", 6);
  line(c, [[850, 330], [1040, 330], [1040, 840], [850, 840], [850, 330]], 12, "#f4f1e4");
  // the little night-light low on the wall, with a faint glow
  for (const [rx, a] of [[250, 0.1], [180, 0.14], [110, 0.2]] as [number, number][]) { c.beginPath(); ell(c, 420, 720, rx, rx * 0.7); c.fillStyle = `rgba(255,214,120,${a})`; c.fill(); }
  shape(c, () => rrect(c, 392, 690, 56, 70, 10), "#fff2c4", 5);
  shape(c, () => ell(c, 420, 725, 14, 14), COL.yellow, 0);
  // the step with a pale strip on its edge
  shape(c, () => rrect(c, 500, 760, 300, 80, 6), "#4a437c", 6);
  shape(c, () => rrect(c, 500, 760, 300, 22, 6), "#f4f1e4", 5);
  // the bed on the left
  shape(c, () => rrect(c, 0, 640, 240, 200, 10), "#3a3561", 6);
  shape(c, () => rrect(c, 0, 600, 240, 70, 30), "#5a527f", 6);
  // the child walking safely, lit softly
  person(c, 330, 840, 420);
  c.fillStyle = "rgba(35,32,68,0.25)"; c.fillRect(0, 0, 1080, 1080);
  shape(c, () => rrect(c, 500, 760, 300, 22, 6), "#f4f1e4", 5);
};

// ---------------------------------------------------------------- terms
// term.0 Light: a tubelight spreading light to every corner
const ic_t0 = (c: Ctx) => {
  ground(c, WALL);
  shape(c, () => rrect(c, 50, 90, 980, 900, 14), "#fff6dc", 10);
  for (const [rx, a] of [[560, 0.1], [430, 0.12], [300, 0.16]] as [number, number][]) { c.beginPath(); ell(c, 540, 170, rx, rx * 0.62); c.fillStyle = `rgba(255,226,120,${a})`; c.fill(); }
  const ends: number[][] = [[100, 940], [330, 950], [540, 950], [750, 950], [980, 940], [90, 560], [990, 560], [150, 250], [930, 250]];
  ends.forEach(([x, y]) => arrow(c, [[540 + (x - 540) * 0.14, 190 + (y - 190) * 0.16], [540 + (x - 540) * 0.85, 190 + (y - 190) * 0.85]], COL.orange, 8));
  shape(c, () => rrect(c, 280, 128, 520, 44, 22), WHITE, 7);
  line(c, [[540, 90], [540, 128]], 8);
};

// term.1 Light source: the Sun, a diya, a torch, a phone screen
const tile = (c: Ctx, x: number, y: number, col: string, draw: () => void) => {
  shape(c, () => rrect(c, x, y, 430, 430, 36), col, 7);
  c.save(); c.beginPath(); rrect(c, x, y, 430, 430, 36); c.clip(); draw(); c.restore();
};
const ic_t1 = (c: Ctx) => {
  ground(c);
  tile(c, 80, 80, "#bfe0f5", () => sunDisc(c, 295, 295, 80));
  tile(c, 570, 80, NIGHT, () => {
    const x = 785, y = 300;
    for (const [rx, a] of [[170, 0.1], [120, 0.15], [80, 0.2]] as [number, number][]) { c.beginPath(); ell(c, x, y - 20, rx, rx); c.fillStyle = `rgba(255,214,120,${a})`; c.fill(); }
    shape(c, () => { c.moveTo(x - 110, y + 10); c.quadraticCurveTo(x, y + 150, x + 110, y + 10); c.quadraticCurveTo(x, y + 40, x - 110, y + 10); c.closePath(); }, "#c46a3b");
    shape(c, () => { c.moveTo(x - 20, y - 100); c.quadraticCurveTo(x + 60, y - 20, x + 10, y + 10); c.quadraticCurveTo(x - 60, y - 20, x - 20, y - 100); c.closePath(); }, COL.yellow);
    shape(c, () => ell(c, x - 2, y - 20, 14, 26), COL.orange, 0);
  });
  tile(c, 80, 570, NIGHT, () => {
    beam(c, [[330, 785], [510, 650], [510, 920]], 0.45);
    torch(c, 130, 785, 0, 1.0);
  });
  tile(c, 570, 570, "#d4c9ec", () => {
    for (const [rx, a] of [[190, 0.1], [150, 0.15]] as [number, number][]) { c.beginPath(); ell(c, 785, 785, rx, rx); c.fillStyle = `rgba(255,255,255,${a})`; c.fill(); }
    shape(c, () => rrect(c, 690, 640, 190, 290, 28), "#2b2540");
    shape(c, () => rrect(c, 705, 665, 160, 240, 12), "#bfe9ff", 4);
    shape(c, () => ell(c, 785, 785, 36, 36), COL.yellow, 4);
  });
};

// term.2 Lit object: a banana in a torch beam, light bouncing off
const ic_t2 = (c: Ctx) => {
  ground(c, NIGHT);
  shape(c, () => rrect(c, 40, 830, 1000, 50, 10), COL.wood);
  const T: [number, number] = [70, 410], an = 0.32, L = lensOf(T[0], T[1], an, 1.1);
  beam(c, [L, [560, 460], [660, 800]], 0.34);
  torch(c, T[0], T[1], an, 1.1);
  // the banana
  const pts: number[][] = []; for (let i = 0; i <= 20; i++) { const t = i / 20; pts.push([520 + t * 380, 650 - Math.sin(t * Math.PI) * 130 + (t - 0.5) * 60 * 0 + 40]); }
  shadow(c, 720, 840, 230, 20);
  line(c, pts, 100, INK); line(c, pts, 86, COL.yellow);
  line(c, pts.slice(3, 18).map(([x, y]) => [x - 10, y - 22]), 12, "#fff0a0");
  line(c, [pts[0], [pts[0][0] - 36, pts[0][1] + 18]], 30, INK); line(c, [pts[0], [pts[0][0] - 34, pts[0][1] + 16]], 20, COL.soilDk);
  // bounced arrows
  [[640, 520, 700, 400], [740, 500, 790, 370], [840, 540, 930, 450], [900, 620, 1000, 600], [800, 600, 880, 300]].forEach(([x1, y1, x2, y2]) => arrow(c, [[x1, y1], [x2, y2]], RED, 8));
};

// term.3 Dark: the same room with nothing lit, only outlines
const ic_t3 = (c: Ctx) => {
  ground(c, "#0c0a18");
  const o = "#3a3560";
  line(c, [[0, 840], [D, 840]], 5, o);
  c.beginPath(); rrect(c, 80, 600, 460, 240, 16); c.strokeStyle = o; c.lineWidth = 8; c.stroke();
  c.beginPath(); rrect(c, 80, 540, 140, 140, 30); c.stroke();
  c.beginPath(); rrect(c, 780, 280, 200, 560, 8); c.stroke();
  // the child sitting up in bed, outline only
  c.beginPath(); ell(c, 360, 480, 70, 76); c.stroke();
  c.beginPath(); c.moveTo(310, 540); c.lineTo(290, 640); c.moveTo(410, 540); c.lineTo(430, 640); c.moveTo(310, 540); c.quadraticCurveTo(360, 580, 410, 540); c.stroke();
  c.beginPath(); c.moveTo(300, 450); c.quadraticCurveTo(360, 380, 420, 450); c.stroke();
  for (const x of [338, 384]) { c.beginPath(); ell(c, x, 482, 7, 9); c.fillStyle = o; c.fill(); }
};

// term.4 Reflect: a beam on a white wall, light springing off in every direction
const ic_t4 = (c: Ctx) => {
  ground(c, "#d9cfc0");
  c.fillStyle = "#fffaf0"; c.fillRect(540, 0, 540, 1080); line(c, [[540, 0], [540, 1080]], 8);
  shape(c, () => rrect(c, 40, 110, 220, 260, 8), COL.sky, 8);
  line(c, [[150, 110], [150, 370]], 5); line(c, [[40, 240], [260, 240]], 5);
  beam(c, [[260, 140], [260, 360], [540, 640], [540, 480]], 0.5);
  c.beginPath(); ell(c, 540, 560, 36, 90); c.fillStyle = COL.yellow; c.fill();
  const heads: [number, number][] = [[270, 330], [330, 780], [270, 990], [420, 940], [220, 480], [380, 590], [250, 680]];
  [[-1.2, 340], [-0.7, 400], [-2.7, 400], [-3.1, 360], [-3.5, 330], [2.2, 350], [-1.9, 310]].forEach(([a, l]) => {
    arrow(c, [[540 + Math.cos(a) * 60, 560 + Math.sin(a) * 60], [540 + Math.cos(a) * l, 560 + Math.sin(a) * l]], RED, 9);
  });
  void heads;
};

// term.6 / 9 / 10: the eye cut open, one part shown strongly
const eyeCard = (hl: string, blind = false) => (c: Ctx) => {
  ground(c);
  shadow(c, 520, 880, 330, 22);
  eyeSide(c, 460, 520, 250, hl, blind);
};
// term.11 Optic nerve: two eyes, cables to the brain
const ic_t11 = (c: Ctx) => {
  ground(c);
  const nerve = (pts: number[][]) => { line(c, pts, 42, INK); line(c, pts, 30, "#f3d27a"); line(c, pts, 4, "#c9a24a"); };
  nerve([[340, 700], [380, 580], [520, 500], [540, 420]]); nerve([[740, 700], [700, 580], [560, 500], [540, 420]]);
  // brain
  const brain = () => { c.moveTo(250, 330); c.bezierCurveTo(200, 120, 460, 60, 540, 130); c.bezierCurveTo(620, 60, 880, 120, 830, 330); c.bezierCurveTo(800, 440, 280, 440, 250, 330); c.closePath(); };
  shape(c, brain, COL.pink); shade(c, brain, "#d9708f", 20, 16, 0.5);
  line(c, [[540, 135], [540, 400]], 5, "#c0587a");
  line(c, [[330, 250], [400, 210], [450, 270]], 5, "#c0587a"); line(c, [[750, 250], [680, 210], [630, 270]], 5, "#c0587a");
  line(c, [[350, 340], [420, 330]], 5, "#c0587a"); line(c, [[730, 340], [660, 330]], 5, "#c0587a");
  // two eyes seen from above, looking down the page
  for (const x of [340, 740]) {
    shape(c, () => ell(c, x, 790, 120, 120), WHITE, 7);
    shape(c, () => ell(c, x, 860, 56, 56), COL.brown, 5);
    shape(c, () => ell(c, x, 884, 24, 24), DARK, 0);
  }
  arrow(c, [[400, 600], [470, 540]], RED, 10);
};

// term.13 Rods and cones
const ic_t13 = (c: Ctx) => {
  ground(c, "#fdeef0");
  shape(c, () => rrect(c, 60, 800, 960, 140, 16), "#f08a9b", 7);
  const seq = ["r", "c", "r", "r", "c", "r", "r", "c", "r"]; const cones = [COL.red, COL.green, COL.blue];
  let ci = 0;
  seq.forEach((k, i) => {
    const x = 120 + i * 105;
    if (k === "r") {
      shape(c, () => rrect(c, x - 22, 400, 44, 410, 22), "#9fb0d8"); shade(c, () => rrect(c, x - 22, 400, 44, 410, 22), "#6f86b8", 8, 0, 0.55);
    } else {
      const col = cones[ci++ % 3];
      shape(c, () => { c.moveTo(x - 40, 810); c.lineTo(x - 12, 560); c.quadraticCurveTo(x, 520, x + 12, 560); c.lineTo(x + 40, 810); c.closePath(); }, col);
    }
  });
  [250, 540, 830].forEach((x) => arrow(c, [[x, 80], [x, 330]], COL.orange, 10));
};

// term.14 Photon: a beam made of tiny glowing dots
const ic_t14 = (c: Ctx) => {
  ground(c, NIGHT);
  const T: [number, number] = [60, 540], L = lensOf(T[0], T[1], 0, 1.0);
  torch(c, T[0], T[1], 0, 1.0);
  const r = rnd(21);
  for (let i = 0; i < 90; i++) {
    const t = r(), x = L[0] + 20 + t * 720, half = 20 + t * 300, y = 540 + (r() * 2 - 1) * half;
    const rad = 7 + t * 8;
    c.beginPath(); ell(c, x, y, rad * 2.2, rad * 2.2); c.fillStyle = "rgba(255,226,120,0.22)"; c.fill();
    c.beginPath(); ell(c, x, y, rad, rad); c.fillStyle = "#fff6c8"; c.fill();
  }
};

// term.15 Brain: see-through head, signals from the eye to the back of the brain, a picture appears
const ic_t15 = (c: Ctx) => {
  ground(c);
  shadow(c, 520, 1010, 330, 22);
  shape(c, () => rrect(c, 300, 840, 440, 200, 60), CLOTH.child);
  shape(c, () => rrect(c, 440, 780, 150, 120, 20), SKIN.childDk);
  const head = () => ell(c, 520, 500, 290, 330);
  shape(c, head, "#e0b08f"); shade(c, head, SKIN.child, -36, -16, 0.5);
  shape(c, () => ell(c, 238, 548, 34, 44), SKIN.child, 6);
  line(c, [[300, 690], [360, 700]], 6);
  shape(c, head, "rgba(0,0,0,0)", 7);
  // hair at the back and top
  c.save(); c.beginPath(); head(); c.clip(); shape(c, () => ell(c, 640, 360, 260, 330), CLOTH.hair, 0); c.restore();
  shape(c, head, "rgba(0,0,0,0)", 7);
  // the brain, seen inside
  const brain = () => { c.moveTo(380, 360); c.bezierCurveTo(380, 190, 620, 150, 720, 270); c.bezierCurveTo(800, 380, 740, 560, 600, 560); c.bezierCurveTo(480, 560, 380, 480, 380, 360); c.closePath(); };
  shape(c, brain, COL.pink, 6);
  line(c, [[440, 300], [500, 260], [560, 320]], 5, "#c0587a"); line(c, [[470, 450], [540, 420], [600, 480]], 5, "#c0587a");
  // the picture in the back of the brain
  shape(c, () => rrect(c, 600, 300, 150, 150, 14), WHITE, 6);
  shape(c, () => ell(c, 675, 375, 46, 46), COL.yellow, 5);
  shape(c, () => ell(c, 658, 365, 5, 7), INK, 0); shape(c, () => ell(c, 692, 365, 5, 7), INK, 0);
  c.beginPath(); c.arc(675, 380, 24, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  // the eye and the signals running back
  eyeFront(c, 330, 505, 110, 12);
  arrow(c, [[395, 500], [450, 470], [530, 460], [590, 400]], RED, 9);
};

// term.16 Eyeshine: a cat's eyes glowing in a light at night
const ic_t16 = (c: Ctx) => {
  ground(c, NIGHT);
  const cx = 540, cy = 600;
  shape(c, () => ell(c, cx, cy + 20, 330, 300), "#0f0c1e", 0);
  shape(c, () => polyP(c, [[cx - 310, cy - 80], [cx - 260, cy - 380], [cx - 70, cy - 230]]), "#0f0c1e", 0);
  shape(c, () => polyP(c, [[cx + 310, cy - 80], [cx + 260, cy - 380], [cx + 70, cy - 230]]), "#0f0c1e", 0);
  for (const s of [-1, 1]) {
    c.beginPath(); ell(c, cx + s * 135, cy - 20, 120, 100); c.fillStyle = "rgba(120,255,140,0.28)"; c.fill();
    shape(c, () => ell(c, cx + s * 135, cy - 20, 88, 74), "#8bff8f", 0);
    shape(c, () => ell(c, cx + s * 135, cy - 20, 15, 66), "#0f0c1e", 0);
    star(c, cx + s * 135 - 25, cy - 45, 14, WHITE);
  }
  shape(c, () => polyP(c, [[cx - 24, cy + 80], [cx + 24, cy + 80], [cx, cy + 112]]), "#5b3a52", 0);
  for (const s of [-1, 1]) for (const dy of [-6, 28]) line(c, [[cx + s * 70, cy + 100 + dy], [cx + s * 280, cy + 70 + dy * 1.7]], 4, "#8a84a8");
  arrow(c, [[100, 900], [320, 760]], COL.orange, 11);
};

// ---------------------------------------------------------------- explanation cards
// expl.0 We need light to see: the same room in the dark, dim and bright
const roomScene = (c: Ctx, x: number, y: number, w: number, h: number, level: number) => {
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 20); c.clip();
  c.translate(x, y);
  if (level === 0) { c.fillStyle = "#05040a"; c.fillRect(0, 0, w, h); c.restore(); shape(c, () => rrect(c, x, y, w, h, 20), "rgba(0,0,0,0)", 7); return; }
  c.fillStyle = WALL; c.fillRect(0, 0, w, h); c.fillStyle = FLOOR; c.fillRect(0, h * 0.72, w, h * 0.3);
  shape(c, () => rrect(c, 60, 30, 150, 130, 6), COL.sky, 6);
  shape(c, () => rrect(c, w * 0.5 - 150, h * 0.5, 300, 24, 6), COL.wood);
  for (const lx of [w * 0.5 - 130, w * 0.5 + 110]) shape(c, () => rrect(c, lx, h * 0.5 + 20, 20, 90, 4), COL.woodDk);
  shape(c, () => ell(c, w * 0.5 - 60, h * 0.5 - 28, 40, 28), COL.orange); shape(c, () => ell(c, w * 0.5 + 10, h * 0.5 - 24, 34, 26), COL.red);
  shape(c, () => ell(c, w * 0.5 + 80, h * 0.5 - 22, 30, 24), COL.yellow);
  shape(c, () => rrect(c, w - 190, h * 0.5 + 30, 80, 70, 6), COL.terra ?? "#c46a3b"); shape(c, () => ell(c, w - 150, h * 0.5, 55, 50), COL.green);
  shape(c, () => ell(c, 130, h * 0.72 + 50, 38, 38), COL.blue);
  if (level === 1) { c.fillStyle = "rgba(10,10,28,0.7)"; c.fillRect(0, 0, w, h); }
  c.restore(); shape(c, () => rrect(c, x, y, w, h, 20), "rgba(0,0,0,0)", 7);
};
const ic_x0 = (c: Ctx) => {
  ground(c);
  [0, 1, 2].forEach((k) => roomScene(c, 70, 50 + k * 340, 940, 300, k));
};

// expl.1 Light sources and lit objects: a diya that makes light, things that only bounce it
const ic_x1 = (c: Ctx) => {
  ground(c, NIGHT);
  shape(c, () => rrect(c, 40, 760, 1000, 60, 12), COL.wood);
  // the diya on the left
  const x = 300, y = 700;
  for (const [rx, a] of [[300, 0.07], [220, 0.1], [140, 0.15]] as [number, number][]) { c.beginPath(); ell(c, x, y - 70, rx, rx); c.fillStyle = `rgba(255,214,120,${a})`; c.fill(); }
  shape(c, () => { c.moveTo(x - 100, y - 20); c.quadraticCurveTo(x, y + 80, x + 100, y - 20); c.quadraticCurveTo(x, y, x - 100, y - 20); c.closePath(); }, "#c46a3b");
  shape(c, () => { c.moveTo(x - 20, y - 150); c.quadraticCurveTo(x + 55, y - 80, x + 10, y - 22); c.quadraticCurveTo(x - 55, y - 80, x - 20, y - 150); c.closePath(); }, COL.yellow);
  shape(c, () => ell(c, x - 2, y - 70, 12, 24), COL.orange, 0);
  // a brass plate, a book, a cup: lit, with small arrows bouncing off
  shape(c, () => ell(c, 520, 735, 100, 24), "#e0a93a"); shape(c, () => ell(c, 520, 733, 78, 15), "#f2c869", 3);
  shape(c, () => rrect(c, 650, 660, 180, 100, 8), COL.blue); shape(c, () => rrect(c, 660, 672, 160, 76, 4), WHITE, 3);
  shape(c, () => polyP(c, [[900, 650], [990, 650], [978, 760], [912, 760]]), COL.pink);
  shape(c, () => ell(c, 945, 650, 45, 12), "#fde6ee", 4);
  [[520, 640, 480, 540], [740, 600, 760, 480], [945, 600, 1000, 500]].forEach(([x1, y1, x2, y2]) => arrow(c, [[x1, y1], [x2, y2]], RED, 9));
  [[330, 520, 400, 600]].forEach(([x1, y1, x2, y2]) => void [x1, y1, x2, y2]);
  for (let i = 0; i < 8; i++) { const a = -Math.PI + (i / 7) * Math.PI; line(c, [[x + Math.cos(a) * 190, y - 70 + Math.sin(a) * 190], [x + Math.cos(a) * 250, y - 70 + Math.sin(a) * 250]], 8, COL.yellow); }
};

// expl.2 The chain: Sun -> mango -> eye
const ic_x2 = (c: Ctx) => {
  ground(c, "#bfe0f5");
  sunDisc(c, 170, 170, 80);
  c.fillStyle = "#8cc063"; c.fillRect(0, 820, D, 260); line(c, [[0, 820], [D, 820]], 6);
  mango(c, 470, 640, 1.5);
  arrow(c, [[250, 270], [350, 470]], COL.orange, 14);
  arrow(c, [[640, 600], [770, 560]], RED, 14);
  eyeFront(c, 900, 500, 240, 24);
};

// expl.3 The classroom from above: light from the board reaches every child's eyes
const ic_x3 = (c: Ctx) => {
  ground(c, "#e3d9c3");
  shape(c, () => rrect(c, 220, 60, 640, 90, 12), "#2f6b4f", 8);
  line(c, [[300, 105], [480, 95], [560, 112]], 6, WHITE); line(c, [[620, 100], [780, 110]], 6, WHITE);
  const O = [540, 150];
  const kids: [number, number][] = [[150, 450], [930, 450], [330, 640], [750, 640], [540, 880]];
  kids.forEach(([x, y]) => {
    const dx = x - O[0], dy = y - O[1], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
    arrow(c, [[O[0] + ux * 30, O[1] + uy * 30], [x - ux * 78, y - uy * 78]], COL.orange, 8);
    shadow(c, x + 8, y + 12, 62, 60);
    shape(c, () => ell(c, x, y, 62, 62), SKIN.child);
    c.save(); c.beginPath(); ell(c, x, y, 62, 62); c.clip(); c.translate(x, y); c.rotate(Math.atan2(dy, dx) + Math.PI / 2);
    shape(c, () => ell(c, 0, 20, 70, 50), CLOTH.hair, 0); c.restore();
    shape(c, () => ell(c, x, y, 62, 62), "rgba(0,0,0,0)", 6);
    c.save(); c.translate(x, y); c.rotate(Math.atan2(dy, dx) + Math.PI / 2);
    for (const s of [-1, 1]) shape(c, () => ell(c, s * 20, -34, 8, 6), WHITE, 3);
    c.restore();
  });
};

// expl.6 The pupil gets bigger and smaller by itself
const ic_x6 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 50, 960, 470, 30), "#bfe0f5", 8);
  sunDisc(c, 220, 200, 70);
  eyeFront(c, 640, 290, 520, 18);
  shape(c, () => rrect(c, 60, 560, 960, 470, 30), NIGHT, 8);
  star(c, 160, 700, 22); star(c, 260, 620, 14); star(c, 120, 820, 12); star(c, 280, 780, 16);
  shape(c, () => ell(c, 220, 880, 70, 70), "#fff6c8", 5);
  shape(c, () => ell(c, 250, 860, 62, 62), NIGHT, 0);
  eyeFront(c, 640, 795, 520, 72);
};

void clothesRow; void BG;
export const ic_lightHowWeSeeL3 = cards("sci.light.how-we-see.L3 cards", [
  ic_e1, ic_e3, ic_a1, ic_a2, ic_a3, ic_a4, ic_a5, ic_a6, ic_p1, ic_c1, ic_c2,
  ic_t0, ic_t1, ic_t2, ic_t3, ic_t4, eyeCard("cornea"), eyeCard("lens"), eyeCard("retina"), ic_t11, eyeCard("nerve", true), ic_t13, ic_t14, ic_t15, ic_t16,
  ic_x0, ic_x1, ic_x2, ic_x3, ic_x6,
]);
