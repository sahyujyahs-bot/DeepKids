import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, SKIN, WHITE, arrow, cards, ell, glass, ground, line, polyP, rrect, shade, shadow, shape, shine, person, write } from "./flatKit";

// ANIMAL BODIES L3 · picture cards for breathing and finding food. Flat DeepKids look; the same child
// (orange shirt) on every card; blue dots = oxygen, grey dots = carbon dioxide, red arrows = movement.

const TABLE = "#ecd3a1", TABLE_DK = "#d9b87c", OXY = "#4b86d6", CO2 = "#9a949c", PINK = "#f29ab4", PINKDK = "#d9708f";

const scene = (c: Ctx, horizon = 330) => {
  ground(c);
  c.fillStyle = TABLE; c.fillRect(0, horizon, 1080, 1080 - horizon);
  c.fillStyle = TABLE_DK; c.fillRect(0, horizon, 1080, 10);
  line(c, [[0, horizon], [1080, horizon]], 5);
};
const dot = (c: Ctx, x: number, y: number, r: number, col = OXY) => shape(c, () => ell(c, x, y, r, r), col, Math.max(2.5, r * 0.18));
// a cloud of breath: overlapping blobs, one outline
const blob = (c: Ctx, x: number, y: number, s: number, fill: string = WHITE) => {
  const parts = [[-0.55, 0.05, 0.5, 0.42], [0, -0.2, 0.62, 0.52], [0.55, 0.05, 0.5, 0.42], [0, 0.18, 0.7, 0.36]];
  const path = () => parts.forEach(([dx, dy, rx, ry]) => { c.moveTo(x + (dx + rx) * s, y + dy * s); ell(c, x + dx * s, y + dy * s, rx * s, ry * s); });
  shape(c, path, fill, 12); c.beginPath(); path(); c.fillStyle = fill; c.fill();
};
// the child's face, front view; blow = round mouth, puff = round cheeks, band = blindfold
const face = (c: Ctx, x: number, y: number, r: number, o: { blow?: boolean; puff?: boolean; band?: boolean } = {}) => {
  shape(c, () => ell(c, x, y, r, r * 1.05), SKIN.child);
  if (o.puff) for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.72, y + r * 0.38, r * 0.32, r * 0.3), SKIN.child, 5);
  shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.02, y); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x + r * 0.95, y - r * 0.2, r * 0.32, r * 0.55), CLOTH.hair, 4);
  if (o.band) shape(c, () => rrect(c, x - r * 1.02, y - r * 0.2, r * 2.04, r * 0.5, 8), COL.red, 5);
  else for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.35, y + r * 0.02, r * 0.09, r * 0.12), INK, 0);
  line(c, [[x, y + r * 0.2], [x - r * 0.06, y + r * 0.35], [x + r * 0.06, y + r * 0.35]], 4, SKIN.childDk);
  if (o.blow) shape(c, () => ell(c, x, y + r * 0.58, r * 0.14, r * 0.17), INK, 0);
  else { c.beginPath(); c.arc(x, y + r * 0.45, r * 0.28, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
};
// the shirt under a head: neck, shoulders
const shoulders = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x - w / 2, y, w, h, w * 0.22), CLOTH.child);
  shade(c, () => rrect(c, x - w / 2, y, w, h, w * 0.22), CLOTH.childDk, w * 0.08, 0);
};
const stopwatch = (c: Ctx, x: number, y: number, r: number, handAng = -1.0) => {
  shadow(c, x + r * 0.15, y + r * 1.05, r * 0.9, r * 0.14);
  shape(c, () => rrect(c, x - r * 0.18, y - r * 1.3, r * 0.36, r * 0.3, 5), COL.steelDk, 5);
  shape(c, () => ell(c, x, y, r, r), COL.steel, 6);
  shape(c, () => ell(c, x, y, r * 0.82, r * 0.82), WHITE, 4);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.64, y + Math.sin(a) * r * 0.64], [x + Math.cos(a) * r * 0.76, y + Math.sin(a) * r * 0.76]], 4); }
  line(c, [[x, y], [x + Math.cos(handAng) * r * 0.6, y + Math.sin(handAng) * r * 0.6]], 7, RED);
  shape(c, () => ell(c, x, y, r * 0.09, r * 0.09), INK, 0);
};
// a fish seen from the side, nose to the right (dir = 1) or left; L = length; gill = a lifted gill cover with red threads
const fish = (c: Ctx, x: number, y: number, L: number, dir = 1, gill = false, body = "#b7c9d8", bodyDk = "#8aa3b8") => {
  c.save(); c.translate(x, y); c.scale(dir, 1);
  const w = Math.max(3, L * 0.012);
  shape(c, () => polyP(c, [[-L * 0.34, 0], [-L * 0.56, -L * 0.2], [-L * 0.5, 0], [-L * 0.56, L * 0.2]]), bodyDk, w);
  shape(c, () => polyP(c, [[-L * 0.1, -L * 0.2], [L * 0.1, -L * 0.34], [-L * 0.2, -L * 0.17]]), bodyDk, w);
  const bodyP = () => { c.moveTo(L * 0.5, 0); c.bezierCurveTo(L * 0.3, -L * 0.28, -L * 0.2, -L * 0.26, -L * 0.38, -L * 0.05); c.lineTo(-L * 0.38, L * 0.05); c.bezierCurveTo(-L * 0.2, L * 0.26, L * 0.3, L * 0.28, L * 0.5, 0); c.closePath(); };
  shape(c, bodyP, body, w);
  shade(c, bodyP, bodyDk, L * 0.04, L * 0.07, 0.55);
  shape(c, () => polyP(c, [[-L * 0.05, L * 0.2], [L * 0.04, L * 0.3], [L * 0.08, L * 0.2]]), bodyDk, w);
  if (gill) {
    // the opening, red threads, then the cover swung up and back
    shape(c, () => { c.moveTo(L * 0.22, -L * 0.2); c.quadraticCurveTo(L * 0.02, -L * 0.04, L * 0.2, L * 0.2); c.quadraticCurveTo(L * 0.3, 0, L * 0.22, -L * 0.2); c.closePath(); }, "#7a1d1d", w);
    for (let i = 0; i < 6; i++) { const t = i / 5, gx = L * (0.25 - t * 0.04), gy = -L * 0.15 + t * L * 0.3; line(c, [[gx, gy], [gx - L * 0.1, gy - L * 0.02 + t * L * 0.01]], L * 0.025 + w, INK); line(c, [[gx, gy], [gx - L * 0.1, gy - L * 0.02 + t * L * 0.01]], L * 0.025, COL.red); }
    shape(c, () => { c.moveTo(L * 0.25, -L * 0.2); c.quadraticCurveTo(L * 0.05, -L * 0.28, L * 0.0, -L * 0.36); c.quadraticCurveTo(L * 0.0, -L * 0.14, L * 0.12, L * 0.0); c.quadraticCurveTo(L * 0.2, -L * 0.1, L * 0.25, -L * 0.2); c.closePath(); }, body, w);
  } else line(c, [[L * 0.22, -L * 0.16], [L * 0.17, 0], [L * 0.22, L * 0.17]], w + 2, INK);
  shape(c, () => ell(c, L * 0.38, -L * 0.05, L * 0.04, L * 0.04), WHITE, w); shape(c, () => ell(c, L * 0.385, -L * 0.05, L * 0.02, L * 0.02), INK, 0);
  line(c, [[L * 0.5, L * 0.02], [L * 0.45, L * 0.03]], w + 1);
  c.restore();
};
const lungs = (c: Ctx, x: number, y: number, s: number) => {
  for (const d of [-1, 1]) {
    const P = () => { c.moveTo(x + d * s * 0.05, y - s * 0.55); c.bezierCurveTo(x + d * s * 0.2, y - s * 0.7, x + d * s * 0.6, y - s * 0.4, x + d * s * 0.62, y + s * 0.2); c.bezierCurveTo(x + d * s * 0.62, y + s * 0.62, x + d * s * 0.15, y + s * 0.62, x + d * s * 0.08, y + s * 0.3); c.closePath(); };
    shape(c, P, PINK, 6); shade(c, P, PINKDK, d * s * 0.05, s * 0.05, 0.5);
    line(c, [[x, y - s * 0.3], [x + d * s * 0.2, y - s * 0.05], [x + d * s * 0.34, y + s * 0.2]], 5, PINKDK);
    line(c, [[x + d * s * 0.2, y - s * 0.05], [x + d * s * 0.4, y - s * 0.12]], 4, PINKDK);
  }
  shape(c, () => rrect(c, x - s * 0.06, y - s * 0.95, s * 0.12, s * 0.75, s * 0.05), "#d7c9b0", 5);
  line(c, [[x, y - s * 0.3], [x - s * 0.2, y - s * 0.05]], 7); line(c, [[x, y - s * 0.3], [x + s * 0.2, y - s * 0.05]], 7);
};
// a table of the things a body is: an x-ray torso, shirt colour, lungs inside; head above
const torso = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - s * 0.62, y - s * 0.95, s * 1.24, s * 1.9, s * 0.3), "#f7e6d2", 6);
  shape(c, () => rrect(c, x - s * 0.1, y - s * 1.15, s * 0.2, s * 0.25, 6), SKIN.child, 5);
};

// a tool hung on the table: bowl with a cover
const katori = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 0.62, r * 0.75, r * 0.12);
  const B = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.9, y + r * 0.75, x + r * 0.9, y + r * 0.75, x + r, y); c.closePath(); };
  shape(c, B, COL.steel); shade(c, B, COL.steelDk, r * 0.35, -r * 0.05);
};

// ---------------------------------------------------------------- flows
// flow.e1: a child standing calm, a child jumping, more breath after jumping, a stopwatch
const flowE1 = (c: Ctx) => {
  scene(c, 560);
  shadow(c, 290, 940, 150, 26); shadow(c, 790, 940, 120, 20);
  person(c, 290, 930, 640, {});
  blob(c, 130, 330, 60);
  shadow(c, 800, 960, 100, 18);
  person(c, 790, 780, 640, { armL: [-1.9, -1.4], armR: [-1.2, -1.7] });
  blob(c, 600, 330, 80); blob(c, 960, 340, 80);
  arrow(c, [[420, 470], [560, 470]]);
  stopwatch(c, 540, 140, 80, -0.6);
};
// flow.e2: breath through a straw into clear water and into limewater that turns milky
const flowE2 = (c: Ctx) => {
  scene(c, 520);
  const g = (x: number, fill: string, milky: boolean) => {
    glass(c, x, 830, 300, 420, 0.7, fill);
    if (milky) { c.save(); c.beginPath(); c.moveTo(x - 150, 830 - 420 * 0.7); c.lineTo(x + 150 - 20, 830 - 420 * 0.7); c.lineTo(x + 120, 830); c.lineTo(x - 120, 830); c.closePath(); c.clip(); c.restore(); }
  };
  g(290, "#bfe3f8", false);
  g(790, "#fbf7f0", true);
  for (const x of [290, 790]) { line(c, [[x + 60, 330], [x + 40, 700]], 22, INK); line(c, [[x + 60, 330], [x + 40, 700]], 12, COL.red); }
  for (const [x, y, r] of [[770, 600, 14], [800, 660, 11], [780, 540, 9]]) dot(c, x, y, r, CO2);
  blob(c, 860, 240, 75, "#e8e4ea"); dot(c, 840, 300, 12, CO2);
  arrow(c, [[430, 650], [640, 650]]);
};
// flow.a1: breath makes a cloud of mist on a cold steel tumbler
const flowA1 = (c: Ctx) => {
  scene(c, 640);
  shadow(c, 620, 905, 200, 36);
  const T = () => { c.moveTo(430, 330); c.lineTo(810, 330); c.lineTo(770, 900); c.lineTo(470, 900); c.closePath(); };
  shape(c, T, COL.steel, 6); shade(c, T, COL.steelDk, 60, 0, 0.5);
  shape(c, () => ell(c, 620, 330, 190, 34), COL.steelIn, 6);
  c.save(); c.beginPath(); T(); c.clip(); shape(c, () => ell(c, 560, 560, 120, 150), "rgba(255,255,255,0.8)", 0); c.restore();
  for (const [x, y] of [[520, 520], [570, 470], [600, 600], [540, 640], [620, 540], [500, 590]]) shape(c, () => ell(c, x, y, 9, 13), COL.drop, 3);
  shine(c, [[470, 400], [500, 850]], 9);
  shoulders(c, 130, 800, 230, 250); face(c, 130, 640, 110, { blow: true });
  blob(c, 320, 600, 50); arrow(c, [[375, 610], [440, 590]]);
};
// flow.a2: the bottle lung, before and after pulling the balloon sheet down
const bottle = (c: Ctx, x: number, top: number, pulled: boolean) => {
  const bw = 120, bot = top + 560;
  shadow(c, x + 30, bot + 150, 190, 24);
  const bal = pulled ? 95 : 55;
  // inner balloon, hanging from the neck
  shape(c, () => ell(c, x, top + 130 + bal * 0.9, bal, bal * 1.2), COL.pink, 6);
  shine(c, [[x - bal * 0.5, top + 120 + bal * 0.5], [x - bal * 0.6, top + 120 + bal * 0.9]], 8);
  const B = () => { c.moveTo(x - 38, top - 70); c.lineTo(x - 38, top + 40); c.bezierCurveTo(x - 38, top + 110, x - bw, top + 110, x - bw, top + 190); c.lineTo(x - bw, bot); c.lineTo(x + bw, bot); c.lineTo(x + bw, top + 190); c.bezierCurveTo(x + bw, top + 110, x + 38, top + 110, x + 38, top + 40); c.lineTo(x + 38, top - 70); c.closePath(); };
  shape(c, B, "rgba(214,236,250,0.35)", 6);
  shape(c, () => rrect(c, x - 50, top - 96, 100, 30, 8), COL.pink, 5);
  shine(c, [[x - bw * 0.7, top + 240], [x - bw * 0.7, bot - 60]], 9);
  // the stretched balloon sheet over the open bottom
  const dy = pulled ? 120 : 20;
  shape(c, () => { c.moveTo(x - bw - 10, bot); c.quadraticCurveTo(x, bot + dy * 2, x + bw + 10, bot); c.quadraticCurveTo(x, bot + 18, x - bw - 10, bot); c.closePath(); }, "#f3b8c8", 6);
  shape(c, () => ell(c, x, bot + dy + 6, 16, 16), COL.pink, 5);
};
const flowA2 = (c: Ctx) => {
  scene(c, 300);
  bottle(c, 290, 230, false);
  bottle(c, 790, 230, true);
  arrow(c, [[820, 880], [820, 980]]);
  arrow(c, [[790, 40], [790, 110]]);
  arrow(c, [[450, 520], [600, 520]]);
};
// flow.a4: a crumpled towel and a towel cut in strips, both wet, hanging on a string
const flowA4 = (c: Ctx) => {
  ground(c);
  line(c, [[40, 200], [1040, 220]], 8);
  // crumpled ball
  shadow(c, 300, 900, 110, 18);
  shape(c, () => rrect(c, 280, 200, 40, 110, 8), COL.wood, 5);
  shape(c, () => ell(c, 300, 450, 150, 150), "#f3eee4", 6);
  for (const d of [[-60, -40, 40, 10], [20, -80, -30, 50], [-80, 30, 60, 30], [10, 20, 70, -40], [-30, 90, 40, -20]]) line(c, [[300 + d[0], 450 + d[1]], [300 + d[0] + d[2], 450 + d[1] + d[3]]], 4, COL.grey);
  shade(c, () => ell(c, 300, 450, 150, 150), COL.steelDk, 40, 40, 0.3);
  // strips
  shape(c, () => rrect(c, 760, 200, 40, 70, 8), COL.wood, 5);
  shape(c, () => rrect(c, 640, 260, 280, 40, 6), "#f3eee4", 5);
  for (let i = 0; i < 5; i++) shape(c, () => rrect(c, 646 + i * 56, 300, 44, 480, 12), "#f3eee4", 5);
  for (const x of [668, 780, 892]) shape(c, () => ell(c, x, 860, 12, 18), COL.drop, 3);
  for (const x of [250, 330]) shape(c, () => ell(c, x, 680 + (x > 300 ? 70 : 0), 13, 19), COL.drop, 3);
};
// flow.a5: blindfolded child sniffing five covered bowls; smell rises from one
const flowA5 = (c: Ctx) => {
  scene(c, 520);
  shoulders(c, 540, 385, 300, 270); face(c, 540, 270, 130, { band: true });
  for (let i = 0; i < 5; i++) {
    const x = 150 + i * 195, y = 760;
    shadow(c, x + 10, y + 70, 85, 14);
    shape(c, () => { c.moveTo(x - 90, y); c.bezierCurveTo(x - 80, y + 90, x + 80, y + 90, x + 90, y); c.closePath(); }, COL.steel, 6);
    shape(c, () => ell(c, x, y, 90, 20), COL.paper, 5);
    for (const dx of [-35, 0, 35]) shape(c, () => ell(c, x + dx, y, 6, 4), INK, 0);
  }
  for (const dx of [-22, 22]) { c.beginPath(); c.moveTo(735 + dx * 0.9, 700); c.bezierCurveTo(735 + dx * 0.9 + 30, 650, 735 + dx * 0.9 - 30, 610, 735 + dx * 0.9, 560); c.strokeStyle = COL.green; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
  arrow(c, [[710, 420], [800, 480], [800, 540]]);
};
// flow.a6: a held breath: puffed cheeks and a stopwatch
const flowA6 = (c: Ctx) => {
  scene(c, 760);
  shoulders(c, 320, 650, 360, 360); face(c, 320, 420, 190, { puff: true });
  stopwatch(c, 760, 520, 190, -0.2);
  shadow(c, 770, 740, 160, 18);
};
// flow.a7: four mouth tools, each matched with its food
const flowA7 = (c: Ctx) => {
  scene(c, 560);
  const X = [150, 390, 630, 870];
  // straw + water
  line(c, [[X[0] - 40, 150], [X[0] + 40, 470]], 26, INK); line(c, [[X[0] - 40, 150], [X[0] + 40, 470]], 14, COL.red); line(c, [[X[0] - 25, 210], [X[0] - 18, 240]], 14, WHITE);
  // strainer + puffed rice
  shape(c, () => ell(c, X[1], 360, 80, 80), COL.steelIn, 6); line(c, [[X[1] + 60, 420], [X[1] + 120, 500]], 22, INK); line(c, [[X[1] + 60, 420], [X[1] + 120, 500]], 12, COL.steel);
  for (let i = -2; i <= 2; i++) { line(c, [[X[1] + i * 28, 290], [X[1] + i * 28, 430]], 3, COL.steelDk); line(c, [[X[1] - 70, 360 + i * 28], [X[1] + 70, 360 + i * 28]], 3, COL.steelDk); }
  // peg
  shape(c, () => rrect(c, X[2] - 28, 190, 26, 270, 8), COL.wood, 5); shape(c, () => rrect(c, X[2] + 2, 190, 26, 270, 8), COL.woodDk, 5); shape(c, () => ell(c, X[2], 330, 18, 18), COL.steel, 4);
  // tweezers
  line(c, [[X[3] - 8, 180], [X[3] - 30, 470]], 14, INK); line(c, [[X[3] + 8, 180], [X[3] + 30, 470]], 14, INK);
  line(c, [[X[3] - 8, 180], [X[3] - 30, 470]], 6, COL.steel); line(c, [[X[3] + 8, 180], [X[3] + 30, 470]], 6, COL.steel);
  // bowls
  const y = 800, bowlAt = (x: number) => { shadow(c, x + 10, y + 70, 100, 15); shape(c, () => { c.moveTo(x - 105, y); c.bezierCurveTo(x - 95, y + 95, x + 95, y + 95, x + 105, y); c.closePath(); }, COL.steel, 6); };
  bowlAt(X[0]); shape(c, () => ell(c, X[0], y, 105, 24), COL.water, 5);
  bowlAt(X[1]); shape(c, () => ell(c, X[1], y, 105, 24), COL.water, 5); for (const dx of [-60, -20, 25, 65]) shape(c, () => ell(c, X[1] + dx, y - 4, 16, 11), "#fff7e0", 3);
  bowlAt(X[2]); shape(c, () => ell(c, X[2], y, 105, 24), "#d6a971", 5); for (const dx of [-60, -15, 30, 65]) shape(c, () => ell(c, X[2] + dx, y - 6, 16, 10), COL.brown, 3);
  bowlAt(X[3]); shape(c, () => ell(c, X[3], y, 105, 24), "#f7ecd0", 5); for (const dx of [-55, 0, 50]) line(c, [[X[3] + dx - 20, y - 4], [X[3] + dx, y + 6], [X[3] + dx + 22, y - 2]], 9, "#f4d98c");
};
// flow.p1: the breath diary: notebook table, sun and moon rows, a stopwatch and a pencil
const flowP1 = (c: Ctx) => {
  scene(c, 160);
  shadow(c, 480, 940, 400, 30);
  shape(c, () => polyP(c, [[90, 230], [490, 215], [490, 900], [90, 915]]), "#fffaf0", 6);
  shape(c, () => polyP(c, [[490, 215], [890, 230], [890, 915], [490, 900]]), "#fffaf0", 6);
  for (let i = 0; i < 6; i++) { const y = 330 + i * 100; line(c, [[110, y + 4], [490, y]], 4, COL.steelDk); line(c, [[490, y], [870, y + 4]], 4, COL.steelDk); }
  for (const x of [270, 680]) line(c, [[x, 225], [x, 905]], 4, COL.steelDk);
  // sun and moon in the first column
  const sun = (x: number, y: number) => { for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; line(c, [[x + Math.cos(a) * 34, y + Math.sin(a) * 34], [x + Math.cos(a) * 50, y + Math.sin(a) * 50]], 6, COL.orange); } shape(c, () => ell(c, x, y, 26, 26), COL.yellow, 5); };
  const moon = (x: number, y: number) => shape(c, () => { c.moveTo(x + 10, y - 40); c.bezierCurveTo(x - 50, y - 30, x - 50, y + 30, x + 10, y + 40); c.bezierCurveTo(x - 20, y + 20, x - 20, y - 20, x + 10, y - 40); c.closePath(); }, COL.yellow, 5);
  for (let i = 0; i < 3; i++) { sun(190, 380 + i * 200); moon(190, 480 + i * 200); }
  for (let i = 0; i < 6; i++) write(c, ["18", "14", "19", "15", "17", "13"][i], 540, 345 + i * 100, 50, INK, 5);
  stopwatch(c, 960, 480, 80, -2.4);
  shape(c, () => polyP(c, [[910, 640], [940, 660], [1030, 850], [1010, 870]]), COL.yellow, 5);
  shape(c, () => polyP(c, [[1010, 870], [1030, 850], [1045, 905]]), SKIN.child, 4);
};
// flow.c1: an invented river-bottom hunter: feelers, big gills, a gulp of air at the top
const flowC1 = (c: Ctx) => {
  ground(c, "#cfe7f5");
  c.fillStyle = "#a07a50"; c.fillRect(0, 150, 1080, 800); c.fillStyle = "#8e6a45"; c.fillRect(0, 700, 1080, 380);
  line(c, [[0, 700], [200, 690], [400, 710], [700, 690], [1080, 705]], 6, "#6a4a2f");
  line(c, [[0, 150], [150, 135], [300, 150], [450, 135], [600, 150], [750, 135], [900, 150], [1080, 135]], 8, WHITE);
  shape(c, () => ell(c, 880, 120, 34, 22), WHITE, 5);
  // the creature: long flat body, feelers round the mouth, gills open
  fish(c, 470, 560, 560, 1, true, "#8d8f86", "#6b6d66");
  for (const [dx, dy] of [[0, 0], [0, 26]]) { line(c, [[745, 575 + dy], [820, 640 + dy], [850, 700 + dy * 0.2]], 8); }
  line(c, [[745, 560], [830, 600], [880, 660]], 8);
  blob(c, 740, 70, 40, WHITE);
  dot(c, 690, 330, 14, OXY); dot(c, 730, 260, 11, OXY);
  arrow(c, [[640, 410], [700, 300], [740, 230]]);
  // a little worm to hunt
  line(c, [[850, 860], [890, 830], [930, 870], [970, 840]], 18, INK); line(c, [[850, 860], [890, 830], [930, 870], [970, 840]], 10, COL.pink);
};

// ---------------------------------------------------------------- terms and explanations
// term.0 oxygen: air is many dots; a few are oxygen and go into the body
const term0 = (c: Ctx) => {
  ground(c, "#e3f1fa");
  const r = Math.random; void r;
  const seedv = [[130, 220], [220, 330], [330, 180], [440, 300], [150, 440], [300, 520], [420, 460], [210, 640], [360, 720], [120, 780], [470, 650], [260, 860], [430, 860], [100, 120]];
  for (const [x, y] of seedv) dot(c, x, y, 16, "#b9b4ab");
  for (const [x, y] of [[250, 250], [380, 380], [180, 540], [330, 630], [470, 780], [200, 760]]) dot(c, x, y, 26, OXY);
  arrow(c, [[500, 500], [650, 500]]);
  shoulders(c, 840, 700, 380, 380); face(c, 840, 460, 190);
};
// term.1 carbon dioxide: the child breathes out grey dots; the tulsi plant takes them in
const tulsi = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 20, y + 4, 140, 20);
  shape(c, () => polyP(c, [[x - 100, y - 160], [x + 100, y - 160], [x + 75, y], [x - 75, y]]), COL.orange, 6);
  shape(c, () => rrect(c, x - 112, y - 190, 224, 40, 10), "#e0782a", 6);
  line(c, [[x, y - 190], [x, y - 450]], 16);
  line(c, [[x, y - 190], [x, y - 450]], 8, COL.leafDk);
  for (const [dy, a] of [[-260, -0.5], [-260, Math.PI + 0.5], [-340, -0.8], [-340, Math.PI + 0.8], [-420, -1.2], [-420, Math.PI + 1.2], [-460, -Math.PI / 2]]) leafDraw(c, x, y + dy, 150, a);
};
const leafDraw = (c: Ctx, x: number, y: number, len: number, an: number) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len, nx = -Math.sin(an) * len * 0.32, ny = Math.cos(an) * len * 0.32, mx = (x + tx) / 2, my = (y + ty) / 2;
  shape(c, () => { c.moveTo(x, y); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, x, y); c.closePath(); }, COL.leaf, 5);
  line(c, [[x, y], [mx + (tx - mx) * 0.6, my + (ty - my) * 0.6]], 3, COL.leafDk);
};
const term1 = (c: Ctx) => {
  ground(c, "#e3f1fa");
  c.fillStyle = TABLE; c.fillRect(0, 880, 1080, 200); line(c, [[0, 880], [1080, 880]], 5);
  shoulders(c, 230, 740, 330, 340); face(c, 230, 510, 160, { blow: true });
  for (const [x, y, r] of [[450, 520, 18], [520, 480, 15], [600, 540, 17], [580, 450, 13]]) dot(c, x, y, r, CO2);
  arrow(c, [[400, 600], [560, 600], [660, 560]]);
  tulsi(c, 840, 880);
};
// term.2 breathing: the chest rises as we breathe in
const term2 = (c: Ctx) => {
  scene(c, 960);
  person(c, 540, 1010, 880, { armR: [Math.PI * 0.47, Math.PI * 1.02] });
  arrow(c, [[770, 520], [770, 380]]);
  dot(c, 340, 200, 14, OXY); dot(c, 300, 150, 11, OXY); arrow(c, [[370, 240], [440, 270]], COL.blue, 8);
};
// term.5 lungs: two pink lungs in the chest, windpipe above
const term5 = (c: Ctx) => {
  ground(c);
  shoulders(c, 540, 500, 760, 520); shape(c, () => rrect(c, 250, 520, 580, 440, 50), "#fbeee0", 5);
  face(c, 540, 270, 150);
  lungs(c, 540, 760, 430);
};
// term.6 air sacs: a little tube ending in a bunch of grape-like bubbles wrapped in red threads
const term6 = (c: Ctx) => {
  ground(c);
  shape(c, () => { c.moveTo(0, 460); c.lineTo(280, 480); c.lineTo(300, 600); c.lineTo(0, 620); c.closePath(); }, PINK, 6);
  const grapes = [[430, 380], [560, 330], [550, 470], [690, 420], [420, 560], [560, 600], [690, 560], [820, 480], [820, 350], [700, 280], [430, 720], [580, 730]];
  line(c, [[300, 540], [400, 470], [500, 400]], 22, INK); line(c, [[300, 540], [400, 470], [500, 400]], 12, PINKDK);
  for (const [x, y] of grapes) {
    shape(c, () => ell(c, x, y, 70, 70), "#fbd7e0", 6);
    c.save(); c.beginPath(); ell(c, x, y, 70, 70); c.clip(); line(c, [[x - 70, y - 20], [x - 25, y - 45], [x + 20, y - 5], [x + 70, y - 30]], 8, COL.red); line(c, [[x - 50, y + 50], [x, y + 20], [x + 45, y + 60]], 8, COL.red); c.restore();
    dot(c, x + 4, y + 6, 11, OXY);
  }
  arrow(c, [[60, 540], [220, 540]]);
};
// term.7 gills: a rohu with the gill cover lifted, red threads inside
const term7 = (c: Ctx) => {
  ground(c, "#cfe7f5");
  fish(c, 560, 560, 900, 1, true);
  arrow(c, [[860, 250], [760, 330]]);
  for (const [x, y] of [[870, 560], [920, 700]]) arrow(c, [[x, y], [x - 80, y - 10]], COL.blue, 8);
};
// term.10 spiracles: a grasshopper with a row of breathing holes along its side
const grasshopper = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const G = "#7cb342", GD = "#558b2f", w = 6;
  // far legs
  line(c, [[-60, 40], [-120, 120], [-100, 200]], 10, GD); line(c, [[80, 40], [150, 120], [150, 200]], 10, GD);
  line(c, [[-150, 50], [-230, -50], [-300, 150]], 24, INK); line(c, [[-150, 50], [-230, -50], [-300, 150]], 14, GD);
  // big hind leg
  line(c, [[-170, 60], [-250, -40], [-330, 150]], 28, INK); line(c, [[-170, 60], [-250, -40], [-330, 150]], 18, G);
  line(c, [[-330, 150], [-360, 200]], 12, INK);
  // body
  shape(c, () => { c.moveTo(-330, 20); c.bezierCurveTo(-300, -40, -80, -50, 120, -30); c.lineTo(120, 70); c.bezierCurveTo(-80, 90, -300, 90, -330, 20); c.closePath(); }, G, w);
  for (let i = 0; i < 5; i++) line(c, [[-290 + i * 55, -35 + i * 4], [-290 + i * 55, 80 - i * 3]], 4, GD);
  // wing
  shape(c, () => { c.moveTo(-250, -30); c.quadraticCurveTo(-100, -90, 150, -35); c.quadraticCurveTo(-60, -20, -250, -30); c.closePath(); }, "#d4e8a8", w);
  // head
  shape(c, () => ell(c, 180, -10, 85, 70), G, w);
  shape(c, () => ell(c, 205, -30, 24, 24), WHITE, 5); shape(c, () => ell(c, 210, -30, 10, 10), INK, 0);
  line(c, [[240, -70], [310, -180], [380, -230]], 5); line(c, [[200, -75], [230, -190], [280, -250]], 5);
  line(c, [[40, 80], [100, 150], [130, 220]], 10, INK); line(c, [[40, 80], [100, 150], [130, 220]], 5, G);
  line(c, [[-20, 80], [-40, 150], [-60, 220]], 10, INK); line(c, [[-20, 80], [-40, 150], [-60, 220]], 5, G);
  // spiracles
  for (let i = 0; i < 6; i++) shape(c, () => ell(c, -280 + i * 62, 30 + (i > 2 ? 0 : 0), 11, 9), "#fff3c4", 4);
  c.restore();
};
const term10 = (c: Ctx) => {
  ground(c);
  grasshopper(c, 520, 560, 1.35);
  for (const x of [220, 400, 620]) { dot(c, x, 270, 14, OXY); arrow(c, [[x, 300], [x, 440]], COL.blue, 7); }
};
// expl.0 a cell is a little factory: food and oxygen go in, energy comes out, carbon dioxide leaves
const expl0 = (c: Ctx) => {
  ground(c);
  const P = () => ell(c, 540, 540, 330, 300);
  shape(c, P, "#fbd7c4", 8);
  shape(c, () => ell(c, 540, 560, 100, 80), "#e8a070", 6);
  for (const [x, y] of [[420, 400], [650, 420], [440, 690], [660, 680]]) shape(c, () => ell(c, x, y, 32, 24, 0.5), "#f3c7a8", 4);
  // food in (a roti piece), oxygen in, energy sparks, carbon dioxide out
  shape(c, () => ell(c, 120, 330, 60, 60), "#f2c063", 6); line(c, [[85, 320], [155, 340]], 5, "#d39a3a");
  arrow(c, [[190, 340], [300, 400]]);
  dot(c, 100, 640, 28, OXY); dot(c, 170, 700, 22, OXY); arrow(c, [[230, 650], [310, 620]]);
  for (const [x, y, r] of [[540, 500, 32], [600, 570, 26], [490, 590, 26]]) { shape(c, () => polyP(c, [[x - r * 0.2, y - r], [x + r * 0.6, y - r * 0.1], [x + r * 0.1, y - r * 0.1], [x + r * 0.5, y + r], [x - r * 0.6, y + r * 0.1], [x - r * 0.1, y + r * 0.1]]), COL.yellow, 4); }
  dot(c, 990, 360, 22, CO2); dot(c, 960, 460, 18, CO2); arrow(c, [[810, 470], [900, 420]]);
};
// expl.2 how lungs work: breathe in (lungs big, belly muscle down) and breathe out (lungs small)
const lungPair = (c: Ctx, x: number, big: boolean) => {
  const s = big ? 330 : 250;
  shape(c, () => rrect(c, x - 200, 190, 400, 650, 70), "#fbeee0", 6);
  lungs(c, x, 520, s);
  const dy = big ? 70 : 0;
  shape(c, () => { c.moveTo(x - 200, 720 + dy); c.quadraticCurveTo(x, 640 + dy, x + 200, 720 + dy); c.lineTo(x + 200, 840); c.lineTo(x - 200, 840); c.closePath(); }, "#c8553d", 6);
};
const expl2 = (c: Ctx) => {
  ground(c);
  lungPair(c, 280, false); lungPair(c, 800, true);
  arrow(c, [[640, 700], [640, 790]]);
  dot(c, 770, 110, 16, OXY); dot(c, 820, 70, 12, OXY); arrow(c, [[800, 130], [800, 190]], COL.blue, 8);
};
// expl.3 gills: water in at the mouth, over red gill threads, out under the cover
const expl3 = (c: Ctx) => {
  ground(c, "#cfe7f5");
  fish(c, 540, 560, 880, 1, true);
  for (const [x, y] of [[980, 560], [940, 640]]) arrow(c, [[x + 30, y], [x - 60, y + 6]], COL.blue, 9);
  arrow(c, [[720, 660], [640, 740]], COL.blue, 9);
};
// expl.4 breathing through skin: an earthworm in damp soil, oxygen dots passing into the skin
const expl4 = (c: Ctx) => {
  ground(c, "#cfe7f5");
  c.fillStyle = COL.soil; c.fillRect(0, 380, 1080, 700);
  c.fillStyle = COL.soilDk; for (const [x, y] of [[100, 500], [300, 900], [800, 450], [900, 950], [450, 980], [180, 780]]) { c.beginPath(); ell(c, x, y, 40, 26); c.fill(); }
  line(c, [[0, 380], [1080, 380]], 6);
  const wp = [[80, 700], [250, 630], [420, 720], [600, 640], [780, 720], [960, 650]];
  c.lineCap = "round"; c.lineJoin = "round";
  c.beginPath(); c.moveTo(wp[0][0], wp[0][1]); for (let i = 1; i < wp.length; i++) c.quadraticCurveTo((wp[i - 1][0] + wp[i][0]) / 2, wp[i - 1][1] - 70 * (i % 2 ? 1 : -1), wp[i][0], wp[i][1]);
  c.strokeStyle = INK; c.lineWidth = 78; c.stroke(); c.strokeStyle = "#d98a8a"; c.lineWidth = 64; c.stroke();
  c.strokeStyle = "#e9aaaa"; c.lineWidth = 10; for (let k = 0; k < 14; k++) { c.beginPath(); c.moveTo(150 + k * 55, 600); c.lineTo(150 + k * 55, 640); }
  shape(c, () => ell(c, 960, 650, 40, 36), "#b86d6d", 5);
  for (const [x, y] of [[300, 480], [520, 450], [700, 500], [880, 470]]) { dot(c, x, y, 16, OXY); arrow(c, [[x, y + 30], [x, y + 90]], COL.blue, 7); }
};

export const ic_animalsAnimalBodiesL3 = cards("sci.animals.animal-bodies.L3 cards", [
  flowE1, flowE2, flowA1, flowA2, flowA4, flowA5, flowA6, flowA7, flowP1, flowC1,
  term0, term1, term2, term5, term6, term7, term10, expl0, expl2, expl3, expl4,
]);
