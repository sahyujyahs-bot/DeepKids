import type { Ctx } from "./core";
import { D, INK, RED, WHITE, COL, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, leaf, write, cards } from "./flatKit";

// FOOD: balanced diet (L3) · picture cards for the experiments, activities, project, challenge, terms and explanations.

const FLOOR = "#e3cfa6", TAN = "#e9c98c", TANDK = "#c99a58", BLOOD = "#d94a3d", BLOODDK = "#a8322a", PINKC = "#f6c3cf", PINKDK = "#e39bb0";
const smooth = (c: Ctx, pts: number[][]) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
const tube = (c: Ctx, pts: number[][], w: number, col: string) => { c.lineCap = "round"; c.lineJoin = "round"; smooth(c, pts); c.strokeStyle = INK; c.lineWidth = w + 12; c.stroke(); smooth(c, pts); c.strokeStyle = col; c.lineWidth = w; c.stroke(); };
const counter = (c: Ctx, yTop: number) => { c.fillStyle = FLOOR; c.fillRect(0, yTop, D, D - yTop); c.fillStyle = "#edddb9"; c.fillRect(0, yTop, D, 16); line(c, [[0, yTop], [D, yTop]], 6); };
const dot = (c: Ctx, x: number, y: number, r: number, col: string, w = 4) => shape(c, () => ell(c, x, y, r, r), col, w);

// ---------------------------------------------------------------- small foods
const peanut = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => { ell(c, x - s * 0.42, y, s * 0.55, s * 0.42); c.moveTo(x + s * 0.97, y); ell(c, x + s * 0.42, y, s * 0.55, s * 0.42); };
  c.beginPath(); p(); c.lineWidth = 12; c.strokeStyle = INK; c.lineJoin = "round"; c.stroke(); c.fillStyle = TAN; c.fill();
  for (const [dx, dy] of [[-0.6, -0.1], [-0.3, 0.15], [0.3, -0.12], [0.6, 0.12]]) dot(c, x + dx * s, y + dy * s, s * 0.05, TANDK, 0);
};
const coconut = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - s, y - s * 0.3); c.quadraticCurveTo(x, y + s * 1.1, x + s, y - s * 0.3); c.closePath(); }, "#7a4a2a", 6);
  shape(c, () => { c.moveTo(x - s * 0.88, y - s * 0.28); c.quadraticCurveTo(x, y + s * 0.82, x + s * 0.88, y - s * 0.28); c.closePath(); }, WHITE, 4);
  shape(c, () => ell(c, x, y - s * 0.3, s, s * 0.25), "#f5efe0", 6);
};
const appleSlice = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - s, y - s * 0.4); c.quadraticCurveTo(x, y + s * 1.1, x + s, y - s * 0.4); c.quadraticCurveTo(x, y - s * 0.7, x - s, y - s * 0.4); c.closePath(); }, COL.red, 6);
  shape(c, () => { c.moveTo(x - s * 0.82, y - s * 0.35); c.quadraticCurveTo(x, y + s * 0.8, x + s * 0.82, y - s * 0.35); c.quadraticCurveTo(x, y - s * 0.6, x - s * 0.82, y - s * 0.35); c.closePath(); }, "#fffbe8", 4);
  for (const dx of [-0.2, 0.2]) shape(c, () => ell(c, x + dx * s, y - s * 0.2, s * 0.05, s * 0.09), "#6a4128", 0);
};
const chapati = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), TAN, 6); shade(c, () => ell(c, x, y, r, r), TANDK, r * 0.2, r * 0.2, 0.45);
  for (const [dx, dy] of [[-0.4, -0.3], [0.2, 0.35], [0.45, -0.25], [-0.15, 0.1]]) dot(c, x + dx * r, y + dy * r, r * 0.12, "#a8723f", 0);
};
const tomatoSlice = (c: Ctx, x: number, y: number, r: number) => {
  dot(c, x, y, r, COL.red, 5); dot(c, x, y, r * 0.78, "#f28b74", 0);
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.78; shape(c, () => ell(c, x + Math.cos(a) * r * 0.42, y + Math.sin(a) * r * 0.42, r * 0.17, r * 0.12, a), "#ffe9a8", 0); }
};
const cucumberSlice = (c: Ctx, x: number, y: number, r: number) => { dot(c, x, y, r, "#46752a", 5); dot(c, x, y, r * 0.82, "#c8e08a", 0); dot(c, x, y, r * 0.3, "#e9f3b8", 0); };
const katoriTop = (c: Ctx, x: number, y: number, r: number, col: string) => { shadow(c, x + r * 0.1, y + r * 0.12, r, r * 0.95); dot(c, x, y, r, COL.steel, 5); dot(c, x, y, r * 0.78, col, 4); };
const droplet = (c: Ctx, x: number, y: number, r: number, col: string) => {
  shape(c, () => { c.moveTo(x, y - r * 1.9); c.quadraticCurveTo(x + r * 0.95, y - r * 0.6, x + r, y); c.arc(x, y, r, 0, Math.PI); c.quadraticCurveTo(x - r * 0.95, y - r * 0.6, x, y - r * 1.9); c.closePath(); }, col, Math.max(3, r * 0.2));
  line(c, [[x - r * 0.5, y - r * 0.1], [x - r * 0.45, y + r * 0.4]], Math.max(3, r * 0.2), WHITE);
};
const bolt = (c: Ctx, x: number, y: number, s: number) => shape(c, () => polyP(c, [[x + s * 0.1, y - s], [x - s * 0.6, y + s * 0.1], [x - s * 0.05, y + s * 0.1], [x - s * 0.2, y + s], [x + s * 0.6, y - s * 0.2], [x + s * 0.05, y - s * 0.2]]), COL.yellow, 6);

// ---------------------------------------------------------------- cells
const rbc = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.88), BLOOD, 6); shade(c, () => ell(c, x, y, r, r * 0.88), BLOODDK, r * 0.2, r * 0.15, 0.5);
  shape(c, () => ell(c, x, y, r * 0.5, r * 0.42), BLOODDK, 0); shape(c, () => ell(c, x - r * 0.04, y - r * 0.04, r * 0.44, r * 0.36), "#e8695a", 0);
};
const nucleus = (c: Ctx, x: number, y: number, r: number) => { dot(c, x, y, r, COL.purple, Math.max(3, r * 0.14)); dot(c, x - r * 0.25, y - r * 0.25, r * 0.28, "#b49ae0", 0); };
const roundCell = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.92), PINKC, 6); shade(c, () => ell(c, x, y, r, r * 0.92), PINKDK, r * 0.15, r * 0.12, 0.5); nucleus(c, x - r * 0.1, y - r * 0.05, r * 0.32); };
const mito = (c: Ctx, x: number, y: number, w: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -w, -w * 0.5, w * 2, w, w * 0.5), COL.orange, 6);
  shade(c, () => rrect(c, -w, -w * 0.5, w * 2, w, w * 0.5), "#d27c25", w * 0.1, w * 0.1, 0.5);
  line(c, [[-w * 0.6, -w * 0.28], [-w * 0.45, w * 0.22], [-w * 0.2, -w * 0.28], [-w * 0.05, w * 0.22], [w * 0.2, -w * 0.28], [w * 0.35, w * 0.22], [w * 0.6, -w * 0.28]], 5, "#a85a1c");
  c.restore();
};
const microbe = (c: Ctx, x: number, y: number, kind: number, rot: number, col: string, s = 1) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  if (kind === 0) shape(c, () => rrect(c, -55, -26, 110, 52, 26), col, 5); else if (kind === 1) shape(c, () => ell(c, 0, 0, 38, 38), col, 5); else shape(c, () => ell(c, 0, 0, 52, 30), col, 5);
  dot(c, -12, -4, 5, INK, 0); dot(c, 12, -4, 5, INK, 0); c.beginPath(); c.arc(0, 4, 10, 0.25, Math.PI - 0.25); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  c.restore();
};

// ================================================================ the cards
// e1 · which foods carry fat: oil makes a see-through spot in paper
const e1 = (c: Ctx) => {
  ground(c);
  const xs = [220, 540, 860];
  peanut(c, xs[0], 240, 115); coconut(c, xs[1], 190, 115); appleSlice(c, xs[2], 190, 115);
  for (const x of xs) arrow(c, [[x, 360], [x, 440]]);
  xs.forEach((x, i) => {
    shadow(c, x + 14, 760, 130, 22);
    shape(c, () => rrect(c, x - 130, 470, 260, 280, 14), WHITE, 6);
    if (i < 2) { const r = i === 0 ? 92 : 62; for (const k of [1.35, 1.0]) { c.globalAlpha = k === 1.35 ? 0.4 : 1; shape(c, () => ell(c, x, 610, r * k, r * k * 0.9), "#ffe27a", 0); } c.globalAlpha = 1; shape(c, () => ell(c, x, 610, r, r * 0.9), "#fff3b0", 5); shine(c, [[x - r * 0.5, 590], [x - r * 0.3, 570]], 8); }
  });
};

// e2 · the blue goes away when vitamin C is added
const e2 = (c: Ctx) => {
  ground(c); counter(c, 840);
  bowl(c, 280, 650, 200, "#2f3fa0"); bowl(c, 810, 650, 200, "#e8f1f7");
  // the dropper over the blue bowl
  shape(c, () => rrect(c, 252, 150, 56, 90, 28), COL.red, 6);
  shape(c, () => rrect(c, 262, 232, 36, 190, 8), COL.glass, 5);
  line(c, [[270, 250], [270, 400]], 6, WHITE); line(c, [[280, 300], [280, 410]], 10, "#f3d55b");
  droplet(c, 280, 500, 16, "#f3d55b");
  arrow(c, [[500, 640], [600, 640]]);
  // amla beside the clear bowl
  for (const [x, y] of [[740, 370], [880, 370], [810, 290]]) { dot(c, x, y, 62, "#b6d96a", 6); shade(c, () => ell(c, x, y, 62, 62), "#8fb84a", 14, 12, 0.5); for (const a of [-0.8, 0, 0.8]) line(c, [[x + a * 40, y - 52], [x + a * 36, y + 50]], 3, "#6f9a35"); }
};

// e3 · yeast, a bottle and a balloon: which food makes more gas
const e3 = (c: Ctx) => {
  ground(c); counter(c, 860);
  const bottle = (x: number, big: number, bubbles: number) => {
    const bw = 200, top = 440, bot = 820, ly = 560;
    const body = () => { c.moveTo(x - 38, top - 20); c.lineTo(x - 38, top + 60); c.bezierCurveTo(x - 38, top + 100, x - bw / 2, top + 90, x - bw / 2, top + 160); c.lineTo(x - bw / 2, bot - 26); c.quadraticCurveTo(x - bw / 2, bot, x - bw / 2 + 26, bot); c.lineTo(x + bw / 2 - 26, bot); c.quadraticCurveTo(x + bw / 2, bot, x + bw / 2, bot - 26); c.lineTo(x + bw / 2, top + 160); c.bezierCurveTo(x + bw / 2, top + 90, x + 38, top + 100, x + 38, top + 60); c.lineTo(x + 38, top - 20); c.closePath(); };
    shadow(c, x + 20, bot + 10, 130, 20);
    c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = "#e8d3a0"; c.fillRect(x - 120, ly, 240, bot - ly + 4); c.fillStyle = "rgba(255,255,255,0.5)"; c.fillRect(x - 120, ly, 240, 8); c.restore();
    const r = rnd(x); for (let i = 0; i < bubbles; i++) dot(c, x - 70 + r() * 140, ly + 30 + r() * 200, 7 + r() * 8, "rgba(255,255,255,0.8)", 3);
    shape(c, body, COL.glass, 5);
    shine(c, [[x - 78, 620], [x - 78, 780]], 8);
    // the balloon stretched over the mouth
    shape(c, () => rrect(c, x - 44, top - 36, 88, 34, 8), "#c0392b", 5);
    if (big > 0) {
      const R = big, cy = top - 36 - R * 1.05;
      const sh = () => { c.moveTo(x - 30, top - 36); c.bezierCurveTo(x - 30, top - 36 - R * 0.6, x - R, top - 36 - R * 0.5, x - R, cy); c.bezierCurveTo(x - R, cy - R * 1.0, x + R, cy - R * 1.0, x + R, cy); c.bezierCurveTo(x + R, top - 36 - R * 0.5, x + 30, top - 36 - R * 0.6, x + 30, top - 36); c.closePath(); };
      shape(c, sh, "#e4523b", 6); shade(c, sh, "#b83a28", R * 0.2, R * 0.1, 0.5); shine(c, [[x - R * 0.6, cy - R * 0.2], [x - R * 0.45, cy - R * 0.55]], 10);
    } else {
      shape(c, () => { c.moveTo(x - 30, top - 36); c.quadraticCurveTo(x - 20, top - 80, x + 50, top - 70); c.quadraticCurveTo(x + 100, top - 55, x + 120, top - 10); c.quadraticCurveTo(x + 60, top - 20, x + 30, top - 36); c.closePath(); }, "#e4523b", 6);
    }
  };
  bottle(180, 0, 2); bottle(540, 170, 16); bottle(900, 100, 8);
  // what each was fed: nothing, sugar, flour
  bowl(c, 180, 935, 70, COL.steelIn);
  bowl(c, 540, 935, 70, WHITE);
  bowl(c, 900, 935, 70, TAN);
};

// a2 · a balanced thali, seen from above
const a2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 580, 400, 380); dot(c, 540, 540, 400, COL.steel, 6); dot(c, 540, 540, 340, COL.steelIn, 4);
  katoriTop(c, 350, 330, 85, "#f0b33a"); katoriTop(c, 540, 280, 80, COL.leaf); katoriTop(c, 730, 330, 85, "#fff6e0");
  cucumberSlice(c, 470, 480, 48); tomatoSlice(c, 560, 500, 50); cucumberSlice(c, 650, 470, 44);
  chapati(c, 350, 680, 120); chapati(c, 390, 660, 110);
  shape(c, () => { c.moveTo(620, 760); c.bezierCurveTo(620, 560, 860, 560, 860, 760); c.closePath(); }, WHITE, 6);
  const r = rnd(5); for (let i = 0; i < 24; i++) { const x = 650 + r() * 190, y = 620 + r() * 120; line(c, [[x, y], [x + 12, y + 5]], 4, "#d9d2bd"); }
};

// a4 · how many spoons of sugar are in a packet
const a4 = (c: Ctx) => {
  ground(c); counter(c, 850);
  shadow(c, 300, 860, 190, 30);
  const front = () => polyP(c, [[110, 300], [370, 300], [370, 850], [110, 850]]), side = () => polyP(c, [[370, 300], [450, 270], [450, 820], [370, 850]]);
  shape(c, front, COL.orange, 6); shape(c, side, "#d27c25", 6);
  shape(c, () => polyP(c, [[110, 300], [190, 270], [450, 270], [370, 300]]), "#f6b366", 6);
  line(c, [[300, 280], [330, 150], [400, 120]], 8, INK); line(c, [[300, 280], [330, 150], [400, 120]], 4, WHITE);
  shape(c, () => rrect(c, 135, 380, 210, 420, 14), WHITE, 5);
  for (let k = 0; k < 6; k++) line(c, [[160, 430 + k * 60], [320, 430 + k * 60]], 6, k === 3 ? RED : COL.grey);
  shape(c, () => rrect(c, 150, 536, 180, 52, 8), "rgba(215,55,43,0.15)", 4);
  arrow(c, [[500, 600], [610, 600]]);
  // a saucer with the sugar heaped on it and a teaspoon
  shadow(c, 830, 760, 240, 52); shape(c, () => ell(c, 810, 730, 230, 62), COL.steel, 6); shape(c, () => ell(c, 810, 726, 190, 48), COL.steelIn, 4);
  shape(c, () => { c.moveTo(670, 735); c.quadraticCurveTo(810, 520, 950, 735); c.quadraticCurveTo(810, 775, 670, 735); c.closePath(); }, WHITE, 6);
  const r = rnd(9); for (let i = 0; i < 40; i++) { const t = r(), u = r(), x = 700 + t * 220, y = 735 - Math.sin(t * Math.PI) * 170 * u; dot(c, x, y, 3.5, "#dcd7c8", 0); }
  line(c, [[640, 880], [560, 800]], 12, INK); line(c, [[640, 880], [560, 800]], 5, COL.steelIn);
  shape(c, () => ell(c, 535, 775, 44, 28, 0.78), COL.steelIn, 6); shape(c, () => ell(c, 535, 768, 34, 16, 0.78), WHITE, 0);
};

// a6 · five faces from very hungry to very full, with a tummy that fills
const a6 = (c: Ctx) => {
  ground(c);
  for (let i = 0; i < 5; i++) {
    const x = 140 + i * 200, y = 330;
    shape(c, () => ell(c, x, y, 85, 85), COL.yellow, 6); shade(c, () => ell(c, x, y, 85, 85), COL.orange, 14, 12, 0.35);
    dot(c, x - 28, y - 14, 8, INK, 0); dot(c, x + 28, y - 14, 8, INK, 0);
    c.beginPath(); c.strokeStyle = INK; c.lineWidth = 6; c.lineCap = "round";
    if (i === 0) { c.arc(x, y + 54, 26, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
    else if (i === 1) { c.arc(x, y + 50, 24, Math.PI * 1.2, Math.PI * 1.8); c.stroke(); }
    else if (i === 2) { c.moveTo(x - 24, y + 30); c.lineTo(x + 24, y + 30); c.stroke(); }
    else if (i === 3) { c.arc(x, y + 14, 28, 0.2, Math.PI - 0.2); c.stroke(); }
    else { c.arc(x, y + 6, 36, 0.1, Math.PI - 0.1); c.closePath(); c.fillStyle = "#8a3b2c"; c.fill(); c.stroke(); }
    // the tummy
    const ty = 620, tr = 70;
    c.save(); c.beginPath(); ell(c, x, ty, tr, tr); c.clip(); c.fillStyle = WHITE; c.fillRect(x - tr, ty - tr, tr * 2, tr * 2);
    const lv = i / 4; c.fillStyle = COL.orange; c.fillRect(x - tr, ty + tr - tr * 2 * lv, tr * 2, tr * 2 * lv + 2); c.restore();
    shape(c, () => ell(c, x, ty, tr, tr), "rgba(0,0,0,0)", 6);
    write(c, String(i + 1), x - 14, 740, 70, INK, 8);
  }
  arrow(c, [[140, 880], [900, 880]]);
};

// p1 · a pictograph of the plants eaten each day
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 980, 440, 30); shape(c, () => rrect(c, 90, 100, 900, 860, 20), WHITE, 6);
  const days = [4, 5, 3, 6, 4, 3, 5];
  days.forEach((n, i) => {
    const x = 180 + i * 120;
    if (i) line(c, [[x - 60, 330], [x - 60, 820]], 3, COL.grey);
    for (let k = 0; k < n; k++) leaf(c, x - 22, 800 - k * 82, 60, -Math.PI / 4 + (k % 2) * 0.5, k % 3 === 0 ? COL.green : COL.leaf);
    write(c, String(i + 1), x - 14, 870, 56, INK, 7);
  });
  line(c, [[120, 840], [960, 840]], 6);
  write(c, "30", 140, 150, 90, COL.greenDk, 12);
  leaf(c, 360, 250, 100, -Math.PI / 4, COL.green);
};

// c1 · a tiffin box with go, grow and glow foods in its sections
const c1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 800, 450, 60);
  shape(c, () => rrect(c, 110, 200, 860, 600, 50), COL.steel, 7); shade(c, () => rrect(c, 110, 200, 860, 600, 50), COL.steelDk, 18, 14, 0.4);
  shape(c, () => rrect(c, 150, 240, 380, 520, 28), COL.steelIn, 5);
  shape(c, () => rrect(c, 560, 240, 370, 250, 28), COL.steelIn, 5);
  shape(c, () => rrect(c, 560, 510, 370, 250, 28), COL.steelIn, 5);
  // go: rolled chapatis
  for (let k = 0; k < 3; k++) { const y = 330 + k * 140; shape(c, () => rrect(c, 190, y, 300, 100, 50), TAN, 6); shade(c, () => rrect(c, 190, y, 300, 100, 50), TANDK, 0, 18, 0.5); dot(c, 470, y + 50, 38, "#f6dfae", 4); shape(c, () => ell(c, 470, y + 50, 14, 14), TANDK, 0); }
  // grow: dal-paneer cubes, peanuts
  for (const [x, y] of [[640, 330], [760, 380], [850, 310], [700, 430]]) shape(c, () => rrect(c, x - 40, y - 40, 80, 80, 12), "#fff6e0", 5);
  peanut(c, 880, 440, 34); peanut(c, 600, 280, 30);
  // glow: fruit and veg
  appleSlice(c, 650, 590, 70); tomatoSlice(c, 800, 610, 52); cucumberSlice(c, 880, 700, 45); leaf(c, 600, 700, 80, -0.5); leaf(c, 640, 720, 80, -1.0, COL.green);
};

// ---------------------------------------------------------------- terms
// iron: a red blood cell carrying oxygen
const tIron = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 900, 320, 36);
  rbc(c, 540, 500, 270);
  const o2 = (x: number, y: number) => { dot(c, x - 24, y, 26, "#8fc3ea", 5); dot(c, x + 24, y, 26, "#8fc3ea", 5); };
  for (const [x, y] of [[250, 250], [830, 250], [170, 520], [910, 520], [330, 800], [750, 800]]) o2(x, y);
  arrow(c, [[250, 310], [330, 380]]); arrow(c, [[830, 310], [750, 380]]);
};

// calcium: strong bones and teeth from milk and ragi
const tCalcium = (c: Ctx) => {
  ground(c); counter(c, 800);
  dot(c, 400, 420, 300, "rgba(255,244,190,0.7)", 0); dot(c, 400, 420, 220, "rgba(255,244,190,0.9)", 0);
  c.save(); c.translate(400, 420); c.rotate(-0.6);
  const bone = () => { c.moveTo(-210, -30); c.bezierCurveTo(-270, -90, -170, -120, -150, -70); c.lineTo(150, -70); c.bezierCurveTo(170, -120, 270, -90, 210, -30); c.bezierCurveTo(270, 30, 170, 120, 150, 70); c.lineTo(-150, 70); c.bezierCurveTo(-170, 120, -270, 30, -210, -30); c.closePath(); };
  shape(c, bone, "#fffaf0", 8); shade(c, bone, "#ddd3b8", 14, 18, 0.55); c.restore();
  // a tooth
  const tooth = () => { c.moveTo(690, 220); c.bezierCurveTo(740, 170, 850, 170, 900, 220); c.bezierCurveTo(930, 300, 880, 380, 870, 480); c.bezierCurveTo(860, 540, 820, 540, 810, 470); c.bezierCurveTo(800, 420, 790, 420, 780, 470); c.bezierCurveTo(770, 540, 730, 540, 720, 480); c.bezierCurveTo(710, 380, 660, 300, 690, 220); c.closePath(); };
  shape(c, tooth, WHITE, 8); shade(c, tooth, "#ddd3b8", 12, 10, 0.5);
  glass(c, 760, 800, 150, 220, 0.8, "#fffaf0");
  // a ragi ball
  shadow(c, 300, 806, 120, 22); dot(c, 280, 735, 90, "#7a4a2a", 6); shade(c, () => ell(c, 280, 735, 90, 90), "#523019", 20, 16, 0.55); shine(c, [[230, 700], [250, 675]], 9);
};

// digestion: a chapati gets smaller, then the tiny pieces pass into the blood
const tDigestion = (c: Ctx) => {
  ground(c);
  // mouth
  shape(c, () => ell(c, 190, 250, 140, 90), "#d9576b", 7); shape(c, () => ell(c, 190, 250, 105, 62), "#6a2338", 0);
  shape(c, () => rrect(c, 110, 190, 160, 34, 12), WHITE, 5);
  chapati(c, 190, 262, 46);
  arrow(c, [[350, 250], [430, 250]]);
  // stomach
  const stom = () => { c.moveTo(500, 150); c.bezierCurveTo(600, 130, 700, 160, 740, 250); c.bezierCurveTo(780, 360, 640, 400, 570, 350); c.bezierCurveTo(520, 310, 560, 290, 540, 240); c.bezierCurveTo(525, 205, 500, 190, 500, 150); c.closePath(); };
  shape(c, stom, COL.pink, 7); shade(c, stom, "#d4688c", 14, 10, 0.45);
  for (const [x, y, r] of [[610, 250, 24], [660, 300, 20], [590, 310, 18]]) dot(c, x, y, r, TAN, 4);
  arrow(c, [[620, 420], [520, 510]]);
  // small intestine, then a blood vessel
  tube(c, [[130, 640], [330, 600], [130, 700], [330, 760], [130, 820], [420, 850]], 52, "#f4b86a");
  for (const [x, y] of [[200, 625], [260, 625], [200, 725], [280, 740], [200, 830], [320, 840]]) dot(c, x, y, 7, TAN, 0);
  arrow(c, [[500, 780], [650, 780]]);
  tube(c, [[760, 600], [760, 880]], 70, BLOOD);
  for (const [x, y] of [[740, 660], [775, 730], [745, 800], [770, 850]]) dot(c, x, y, 7, TAN, 0);
};

// enzyme: tiny scissors cut a long chain into small pieces
const tEnzyme = (c: Ctx) => {
  ground(c);
  const bead = (x: number, y: number, i: number) => dot(c, x, y, 40, ["#f39a3c", "#5b8fd6", "#6aa53f", "#f29ab4"][i % 4], 6);
  for (let i = 0; i < 5; i++) bead(110 + i * 85, 800, i);
  for (let i = 0; i < 5; i++) bead(660 + i * 85, 800, i + 1);
  line(c, [[110, 800], [530, 800]], 4); line(c, [[660, 800], [1000, 800]], 4);
  // scissors, blades pointing down into the gap
  const blade = (sx: number) => {
    shape(c, () => polyP(c, [[540 + sx * 6, 440], [540 + sx * 40, 440], [540 - sx * 40, 760], [540 - sx * 52, 760]]), COL.steelIn, 6);
    line(c, [[540 + sx * 20, 440], [540 + sx * 110, 260]], 22, INK); line(c, [[540 + sx * 20, 440], [540 + sx * 110, 260]], 10, RED);
    shape(c, () => ell(c, 540 + sx * 135, 190, 64, 64), RED, 8); shape(c, () => ell(c, 540 + sx * 135, 190, 34, 34), BG0, 5);
  };
  blade(-1); blade(1);
  dot(c, 540, 440, 16, COL.steelDk, 5);
  arrow(c, [[540, 880], [540, 840]]);
};
const BG0 = "#efe4cf";

// cell: a crowd of different cells
const tCell = (c: Ctx) => {
  ground(c);
  dot(c, 540, 540, 450, "rgba(255,255,255,0.45)", 0);
  rbc(c, 290, 290, 120); rbc(c, 420, 420, 90);
  // nerve cell
  const nx = 780, ny = 300;
  for (const [dx, dy] of [[-140, -90], [-60, -160], [90, -150], [150, -40], [110, 110], [-120, 70]]) { line(c, [[nx, ny], [nx + dx * 0.5, ny + dy * 0.5], [nx + dx, ny + dy]], 24, INK); line(c, [[nx, ny], [nx + dx * 0.5, ny + dy * 0.5], [nx + dx, ny + dy]], 12, "#f4c34a"); }
  dot(c, nx, ny, 70, "#f4c34a", 7); nucleus(c, nx, ny, 32);
  // muscle cell
  const mx = 540, my = 700;
  shape(c, () => rrect(c, mx - 380, my - 60, 760, 120, 60), "#e4523b", 7); shade(c, () => rrect(c, mx - 380, my - 60, 760, 120, 60), "#b83a28", 0, 22, 0.5);
  for (let k = -5; k <= 5; k++) line(c, [[mx + k * 60, my - 40], [mx + k * 60, my + 40]], 6, "#f28b74");
  nucleus(c, mx - 120, my - 4, 30); nucleus(c, mx + 150, my - 4, 30);
  // skin cells
  const hex = (x: number, y: number, r: number) => { shape(c, () => polyP(c, [0, 1, 2, 3, 4, 5].map((k) => [x + Math.cos(k * Math.PI / 3 + 0.5) * r, y + Math.sin(k * Math.PI / 3 + 0.5) * r])), "#f1d2b0", 6); nucleus(c, x, y, r * 0.3); };
  hex(250, 900, 70); hex(380, 900, 70); hex(830, 900, 70); hex(700, 900, 70);
};

// mitochondria: a cell opened up, with glowing mitochondria
const tMito = (c: Ctx) => {
  ground(c);
  shadow(c, 570, 940, 400, 36);
  shape(c, () => ell(c, 540, 500, 440, 380), PINKC, 8); shade(c, () => ell(c, 540, 500, 440, 380), PINKDK, 30, 24, 0.5);
  nucleus(c, 400, 400, 110);
  for (const [x, y, w, r] of [[700, 360, 90, 0.5], [660, 640, 100, -0.4], [330, 660, 80, 0.2], [830, 520, 70, 1.3]] as number[][]) { dot(c, x, y, w * 1.45, "rgba(255,244,190,0.55)", 0); mito(c, x, y, w, r); }
};

// gut microbes: friendly bacteria in the gut, eating fibre
const tMicrobes = (c: Ctx) => {
  ground(c);
  const path = [[60, 250], [540, 250], [940, 250], [940, 540], [540, 540], [140, 540], [140, 830], [540, 830], [1020, 830]];
  tube(c, path, 190, "#f0a08a"); tube(c, path, 150, "#fbd9c9");
  for (const y of [250, 540, 830]) { const th = [[220, y - 10], [330, y - 40], [440, y + 10], [550, y - 40], [660, y + 10], [780, y - 30]]; smooth(c, th); c.strokeStyle = COL.greenDk; c.lineWidth = 14; c.stroke(); smooth(c, th); c.strokeStyle = COL.greenLt; c.lineWidth = 7; c.stroke(); }
  microbe(c, 280, 280, 0, 0.1, "#b6d96a", 0.75); microbe(c, 620, 285, 1, 0, "#9fd0f0", 0.8); microbe(c, 840, 230, 2, 0.2, "#f9c66b", 0.7);
  microbe(c, 700, 560, 0, -0.1, "#f29ab4", 0.75); microbe(c, 400, 575, 2, 0.1, "#b6d96a", 0.75); microbe(c, 240, 540, 1, 0, "#f9c66b", 0.7);
  microbe(c, 330, 850, 0, 0.1, "#9fd0f0", 0.75); microbe(c, 640, 855, 2, 0, "#f29ab4", 0.75); microbe(c, 870, 830, 1, 0, "#b6d96a", 0.7);
};

// ---------------------------------------------------------------- explanations
// the balanced plate: half vegetables and fruit, a quarter grain, a quarter protein, and water
const xPlate = (c: Ctx) => {
  ground(c);
  shadow(c, 480, 560, 400, 400); dot(c, 450, 540, 390, COL.steel, 6); dot(c, 450, 540, 330, WHITE, 4);
  c.save(); c.beginPath(); ell(c, 450, 540, 330, 330); c.clip();
  c.fillStyle = "#cfe8a8"; c.fillRect(100, 200, 350, 700);
  c.fillStyle = "#fbe3a0"; c.fillRect(450, 200, 400, 340);
  c.fillStyle = "#f3b87a"; c.fillRect(450, 540, 400, 400); c.restore();
  line(c, [[450, 210], [450, 870]], 6); line(c, [[450, 540], [780, 540]], 6); shape(c, () => ell(c, 450, 540, 330, 330), "rgba(0,0,0,0)", 6);
  // vegetables and fruit
  tomatoSlice(c, 290, 350, 56); cucumberSlice(c, 190, 480, 50); tomatoSlice(c, 330, 560, 52); cucumberSlice(c, 220, 660, 54); leaf(c, 330, 800, 90, -1.2, COL.green); leaf(c, 280, 780, 90, -1.8, COL.leaf); appleSlice(c, 360, 700, 60);
  // grain: chapati and rice
  chapati(c, 600, 380, 85); chapati(c, 660, 440, 70);
  // protein: dal and an egg
  dot(c, 580, 700, 90, "#c97a20", 6); dot(c, 580, 700, 66, "#f0b33a", 0);
  shape(c, () => ell(c, 730, 780, 70, 50, -0.4), WHITE, 6); dot(c, 730, 780, 24, COL.yellow, 4);
  glass(c, 930, 780, 130, 240, 0.8);
};

// the blood carries the tiny food pieces to every cell
const xBlood = (c: Ctx) => {
  ground(c);
  tube(c, [[40, 540], [300, 540], [540, 540], [800, 540], [1040, 540]], 90, BLOOD);
  for (const x of [120, 240, 360, 600, 720, 900]) dot(c, x, 540, 9, TAN, 0);
  const cell = (x: number, y: number) => { roundCell(c, x, y, 110); dot(c, x + 40, y + 50, 9, TAN, 0); };
  cell(260, 190); cell(700, 190); cell(260, 890); cell(700, 890);
  arrow(c, [[260, 440], [260, 330]]); arrow(c, [[700, 440], [700, 330]]); arrow(c, [[260, 640], [260, 760]]); arrow(c, [[700, 640], [700, 760]]);
  void roundCell;
};

// inside the cell: food plus oxygen gives energy
const xEnergy = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 540, 420, 400), PINKC, 8); shade(c, () => ell(c, 540, 540, 420, 400), PINKDK, 30, 24, 0.5);
  dot(c, 540, 540, 220, "rgba(255,244,190,0.6)", 0); mito(c, 540, 540, 150, 0);
  // in: glucose (a hexagon) and oxygen
  shape(c, () => polyP(c, [0, 1, 2, 3, 4, 5].map((k) => [190 + Math.cos(k * Math.PI / 3) * 58, 420 + Math.sin(k * Math.PI / 3) * 58])), "#fff6e0", 6);
  dot(c, 160, 660, 30, "#8fc3ea", 5); dot(c, 220, 660, 30, "#8fc3ea", 5);
  arrow(c, [[260, 440], [370, 500]]); arrow(c, [[260, 650], [370, 590]]);
  // out: energy, water and gas
  bolt(c, 890, 360, 80); droplet(c, 880, 560, 30, "#8fc3ea"); dot(c, 900, 700, 36, COL.grey, 5); dot(c, 850, 730, 28, COL.grey, 5);
  arrow(c, [[710, 500], [800, 400]]); arrow(c, [[710, 540], [820, 560]]); arrow(c, [[710, 590], [810, 690]]);
};

export const ic_foodBalancedDietL3 = cards("sci.food.balanced-diet.L3 cards", [
  e1, e2, e3, a2, a4, a6, p1, c1, tIron, tCalcium, tDigestion, tEnzyme, tCell, tMito, tMicrobes, xPlate, xBlood, xEnergy,
]);
void D; void leaf; void glass;
