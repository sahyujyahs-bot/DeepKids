import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, bowl, write, cards } from "./flatKit";

// sci.materials.sorting-materials.L3 · picture cards (intro, cover, activities, terms).
// Same child and grown-up as the set-up cards. Everyday things: steel spoon, wooden spoon, glass bangle,
// rubber band, comb, candle, woollen sock, hanky, clay diya, pebble, foil ball, paper cup, paper clip.

const GREY = "#6b6f7a", CREAM = "#fffaf0", NAVY = "#1f2a4d";

// ---------------------------------------------------------------- the things
const spoon = (c: Ctx, s: number, col: string, inn: string) => {
  shape(c, () => rrect(c, -s * 0.2, -s * 0.09, s * 1.2, s * 0.18, s * 0.09), col, 5);
  shape(c, () => ell(c, -s * 0.55, 0, s * 0.5, s * 0.34), col, 5);
  shape(c, () => ell(c, -s * 0.58, -s * 0.02, s * 0.32, s * 0.2), inn, 0);
};
const fork = (c: Ctx, s: number) => {
  shape(c, () => rrect(c, -s * 0.1, -s * 0.09, s * 1.1, s * 0.18, s * 0.09), COL.steel, 5);
  shape(c, () => rrect(c, -s * 0.6, -s * 0.3, s * 0.55, s * 0.6, s * 0.1), COL.steel, 5);
  for (const k of [-0.28, -0.07, 0.14]) shape(c, () => rrect(c, -s * 1.0, s * k, s * 0.5, s * 0.14, s * 0.07), COL.steel, 4);
};
type Kind = "steel" | "wood" | "bangle" | "band" | "comb" | "candle" | "sock" | "hanky" | "diya" | "pebble" | "foil" | "cup" | "clip";
const thing = (c: Ctx, k: Kind, x: number, y: number, s: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const lw = Math.max(3, s * 0.12);
  if (k === "steel") spoon(c, s, COL.steel, COL.steelIn);
  else if (k === "wood") spoon(c, s, COL.wood, COL.woodDk);
  else if (k === "bangle") {
    c.beginPath(); ell(c, 0, 0, s * 0.75, s * 0.75); c.lineWidth = s * 0.3 + 10; c.strokeStyle = INK; c.stroke();
    c.beginPath(); ell(c, 0, 0, s * 0.75, s * 0.75); c.lineWidth = s * 0.3; c.strokeStyle = COL.teal; c.stroke();
    c.beginPath(); c.arc(0, 0, s * 0.75, Math.PI * 1.1, Math.PI * 1.45); c.lineWidth = s * 0.08; c.strokeStyle = WHITE; c.stroke();
  } else if (k === "band") {
    c.beginPath(); ell(c, 0, 0, s * 0.85, s * 0.5, 0.3); c.lineWidth = s * 0.2 + 9; c.strokeStyle = INK; c.stroke();
    c.beginPath(); ell(c, 0, 0, s * 0.85, s * 0.5, 0.3); c.lineWidth = s * 0.2; c.strokeStyle = COL.orange; c.stroke();
  } else if (k === "comb") {
    for (let i = 0; i < 8; i++) shape(c, () => rrect(c, -s * 0.9 + i * s * 0.235, -s * 0.1, s * 0.13, s * 0.5, 3), COL.purple, lw * 0.6);
    shape(c, () => rrect(c, -s * 0.95, -s * 0.4, s * 1.9, s * 0.38, s * 0.1), COL.purple, lw * 0.8);
  } else if (k === "candle") {
    const b = () => rrect(c, -s * 0.28, -s * 0.6, s * 0.56, s * 1.35, s * 0.1);
    shape(c, b, CREAM, lw * 0.8); shade(c, b, "#e4dccb", s * 0.18, 0);
    line(c, [[0, -s * 0.6], [0, -s * 0.8]], lw * 0.6);
    shape(c, () => { c.moveTo(0, -s * 1.35); c.quadraticCurveTo(s * 0.3, -s * 0.95, 0, -s * 0.78); c.quadraticCurveTo(-s * 0.3, -s * 0.95, 0, -s * 1.35); c.closePath(); }, COL.orange, lw * 0.6);
  } else if (k === "sock") {
    shape(c, () => { c.moveTo(-s * 0.35, -s); c.lineTo(s * 0.35, -s); c.lineTo(s * 0.35, s * 0.1); c.bezierCurveTo(s * 0.9, s * 0.15, s * 1.0, s * 0.85, s * 0.6, s * 0.88); c.lineTo(-s * 0.35, s * 0.88); c.closePath(); }, COL.pink, lw * 0.8);
    c.fillStyle = COL.red; c.fillRect(-s * 0.33, -s * 0.97, s * 0.66, s * 0.22);
    shape(c, () => rrect(c, -s * 0.35, -s, s * 0.7, s * 0.25, 3), "rgba(0,0,0,0)", lw * 0.8);
  } else if (k === "hanky") {
    shape(c, () => polyP(c, [[-s * 0.8, -s * 0.7], [s * 0.8, -s * 0.7], [s * 0.8, s * 0.7], [-s * 0.8, s * 0.7]]), "#e8f0ff", lw);
    line(c, [[-s * 0.6, -s * 0.5], [s * 0.6, -s * 0.5], [s * 0.6, s * 0.5], [-s * 0.6, s * 0.5], [-s * 0.6, -s * 0.5]], lw * 0.6, COL.blue);
  } else if (k === "diya") {
    shape(c, () => { c.moveTo(-s, -s * 0.1); c.bezierCurveTo(-s * 0.9, s * 0.75, s * 0.9, s * 0.75, s, -s * 0.1); c.closePath(); }, "#c9743c", lw);
    shape(c, () => ell(c, 0, -s * 0.1, s, s * 0.24), "#8a4a28", lw);
  } else if (k === "pebble") {
    shape(c, () => ell(c, 0, 0, s * 0.8, s * 0.55, 0.3), COL.grey, lw);
    shade(c, () => ell(c, 0, 0, s * 0.8, s * 0.55, 0.3), COL.greyDk, s * 0.25, s * 0.2);
  } else if (k === "foil") {
    shape(c, () => ell(c, 0, 0, s * 0.72, s * 0.72), COL.steelIn, lw);
    line(c, [[-s * 0.4, -s * 0.3], [0, -s * 0.05], [s * 0.35, -s * 0.4]], lw * 0.6, COL.steelDk);
    line(c, [[-s * 0.2, s * 0.5], [s * 0.1, s * 0.15], [s * 0.45, s * 0.3]], lw * 0.6, COL.steelDk);
  } else if (k === "cup") {
    shape(c, () => polyP(c, [[-s * 0.6, -s * 0.7], [s * 0.6, -s * 0.7], [s * 0.45, s * 0.7], [-s * 0.45, s * 0.7]]), WHITE, lw * 0.8);
    shape(c, () => polyP(c, [[-s * 0.55, -s * 0.2], [s * 0.55, -s * 0.2], [s * 0.5, s * 0.25], [-s * 0.5, s * 0.25]]), COL.red, 0);
  } else if (k === "clip") {
    const p = [[-0.3, 0.7], [-0.3, -0.4], [0.1, -0.75], [0.5, -0.4], [0.5, 0.5], [0.1, 0.85], [-0.1, 0.5], [-0.1, -0.2]].map(([u, v]) => [u * s, v * s]);
    line(c, p, lw * 1.2 + 6, INK); line(c, p, lw * 1.2, COL.steelDk);
  }
  c.restore();
};

const qmark = (c: Ctx, x: number, y: number, h: number, col: string = RED) => {
  const p = [[-0.3, 0.25], [-0.25, 0.04], [0, 0], [0.25, 0.04], [0.3, 0.25], [0, 0.55], [0, 0.7]].map(([u, v]) => [x + u * h, y + v * h]);
  line(c, p, h * 0.14, col); c.beginPath(); c.arc(x, y + h * 0.95, h * 0.08, 0, Math.PI * 2); c.fillStyle = col; c.fill();
};
const tick = (c: Ctx, x: number, y: number, s: number) => line(c, [[x - s, y], [x - s * 0.3, y + s * 0.7], [x + s, y - s * 0.8]], s * 0.3, COL.greenDk);
const cross = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - s * 0.8, y - s * 0.8], [x + s * 0.8, y + s * 0.8]], s * 0.3, RED); line(c, [[x + s * 0.8, y - s * 0.8], [x - s * 0.8, y + s * 0.2 - s * 1.0 + s * 1.6]], s * 0.3, RED); };
const tray = (c: Ctx, x: number, y: number, w: number, h: number, col: string = COL.wood) => {
  shadow(c, x + w * 0.04, y + h / 2 + 8, w * 0.52, 14);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 18), col, 6);
  shape(c, () => rrect(c, x - w / 2 + 14, y - h / 2 + 14, w - 28, h - 28, 12), "rgba(255,250,240,0.7)", 4);
};
const floorLine = (c: Ctx, y: number) => { c.fillStyle = "#e6d6b6"; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };

// ---------------------------------------------------------------- scenes for the intro
const bottle = (c: Ctx, x: number, yB: number, s: number, col = "#9fdcb8") => {
  shape(c, () => rrect(c, x - s * 0.14, yB - s * 1.7, s * 0.28, s * 0.6, 6), col);
  shape(c, () => rrect(c, x - s * 0.35, yB - s * 1.2, s * 0.7, s * 1.2, s * 0.14), col);
  shape(c, () => rrect(c, x - s * 0.17, yB - s * 1.82, s * 0.34, s * 0.16, 4), RED, 4);
  shine(c, [[x - s * 0.2, yB - s * 1.0], [x - s * 0.2, yB - s * 0.3]], 6);
};
const tin = (c: Ctx, x: number, yB: number, s: number) => {
  shape(c, () => rrect(c, x - s * 0.4, yB - s * 0.8, s * 0.8, s * 0.8, 8), COL.steel);
  shape(c, () => rrect(c, x - s * 0.4, yB - s * 0.55, s * 0.8, s * 0.3, 0), COL.red, 4);
  shape(c, () => ell(c, x, yB - s * 0.8, s * 0.4, s * 0.1), COL.steelIn, 5);
};
const newsStack = (c: Ctx, x: number, yB: number, w: number, h: number) => {
  for (let i = 0; i < 5; i++) {
    const yy = yB - (i + 1) * (h / 5);
    shape(c, () => rrect(c, x - w / 2 + (i % 2) * 6, yy, w, h / 5, 4), i % 2 ? "#ece6d6" : "#f6f1e2", 5);
    for (let k = 0; k < 4; k++) line(c, [[x - w / 2 + 14 + (i % 2) * 6 + k * (w / 5), yy + h / 10], [x - w / 2 + 14 + (i % 2) * 6 + k * (w / 5) + w / 8, yy + h / 10]], 4, COL.greyDk);
  }
};
const iron = (c: Ctx, x: number, yB: number, h: number) => {
  for (const [dx, a] of [[0, -0.18], [24, 0], [48, 0.2]] as number[][]) { const p = [[x + dx, yB], [x + dx + Math.sin(a) * h, yB - h * Math.cos(a)]]; line(c, p, 26, INK); line(c, p, 14, GREY); }
};
const tarazu = (c: Ctx, x: number, yB: number) => {
  const by = yB - 330;
  line(c, [[x, yB], [x, by]], 22, INK); line(c, [[x, yB], [x, by]], 10, COL.brown);
  const lx = x - 170, ly = by + 22, rx = x + 170, ry = by - 22;
  line(c, [[lx, ly], [rx, ry]], 18, INK); line(c, [[lx, ly], [rx, ry]], 8, COL.brown);
  shape(c, () => ell(c, x, by, 16, 16), COL.yellow, 5);
  const pan = (px: number, py: number) => {
    line(c, [[px, py], [px - 90, py + 150]], 4); line(c, [[px, py], [px + 90, py + 150]], 4);
    shape(c, () => ell(c, px, py + 156, 100, 18), COL.steel, 6);
  };
  pan(lx, ly); pan(rx, ry);
  newsStack(c, lx, ly + 150, 110, 60);
  tin(c, rx - 20, ry + 150, 46); tin(c, rx + 25, ry + 150, 46);
};
const intro = (c: Ctx) => {
  ground(c); floorLine(c, 830);
  newsStack(c, 95, 850, 130, 190); bottle(c, 190, 850, 56, "#9fd0e8"); bottle(c, 238, 850, 52, "#e9c47a");
  tarazu(c, 640, 850);
  person(c, 320, 850, 460, { sit: true, adult: true, armR: [0.35, 0.05] });
  person(c, 965, 880, 420, { armR: [-0.9, -1.4], armL: [0.55, 0.5] });
  bottle(c, 1062, 478, 70);
  iron(c, 20, 850, 150);
};

// ---------------------------------------------------------------- cover: one heap, three rules
const heap = (c: Ctx, x: number, y: number) => {
  thing(c, "steel", x - 40, y - 80, 70, -0.6); thing(c, "wood", x + 20, y - 15, 70, 0.5); thing(c, "bangle", x - 55, y + 45, 52);
  thing(c, "band", x + 60, y + 90, 50); thing(c, "candle", x + 85, y - 60, 52, 0.7);
};
const pair = (c: Ctx, y: number, a: Kind[], b: Kind[], tags: [number, number]) => {
  const place = (x: number, list: Kind[], col: string) => {
    tray(c, x, y, 290, 200, col);
    list.forEach((k, i) => { const cols = Math.min(list.length, 3), px = x - 88 * (cols - 1) / 2 + (i % 3) * 88, py = y + (list.length > 3 ? (i < 3 ? -38 : 42) : 0); thing(c, k, px, py, 44, k === "steel" || k === "wood" ? -0.7 : 0); });
  };
  place(560, a, tags[0] ? COL.sky : COL.wood); place(890, b, COL.wood);
};
const summary = (c: Ctx) => {
  ground(c);
  heap(c, 150, 540);
  for (const y of [200, 540, 880]) { arrow(c, [[270, 540 + (y - 540) * 0.35], [370, y]]); qmark(c, 392, y - 62, 52); }
  pair(c, 200, ["steel", "bangle"], ["wood", "band", "candle"], [1, 0]);
  pair(c, 540, ["steel", "wood", "bangle"], ["band", "candle"], [1, 0]);
  pair(c, 880, ["wood"], ["steel", "bangle", "band", "candle"], [1, 0]);
};

// ---------------------------------------------------------------- e1: one heap, sorted
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + 8, y + h / 2 + 8, w / 2, 16); shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 8), WHITE, 6); };
const e1 = (c: Ctx) => {
  ground(c);
  const kinds: Kind[] = ["steel", "wood", "comb", "bangle", "band", "sock", "hanky", "candle", "diya", "pebble", "foil", "cup"];
  const r = rnd(5);
  kinds.forEach((k, i) => thing(c, k, 270 + (i % 6) * 108 + r() * 14, 150 + Math.floor(i / 6) * 120 + r() * 14, 52, k === "steel" || k === "wood" ? 0.6 : 0));
  arrow(c, [[540, 330], [540, 450]]);
  paper(c, 280, 700, 440, 380); paper(c, 800, 700, 440, 380);
  const A: Kind[] = ["steel", "wood", "comb", "bangle", "pebble", "diya"], B: Kind[] = ["band", "sock", "hanky", "candle", "cup", "foil"];
  A.forEach((k, i) => thing(c, k, 150 + (i % 3) * 130, 620 + Math.floor(i / 3) * 140, 52, k === "steel" || k === "wood" ? 0.6 : 0));
  B.forEach((k, i) => thing(c, k, 670 + (i % 3) * 130, 620 + Math.floor(i / 3) * 140, 52, 0));
  qmark(c, 540, 560, 70);
};

// ---------------------------------------------------------------- e2: the scratch ladder
const e2 = (c: Ctx) => {
  ground(c); floorLine(c, 900);
  const steps: Kind[] = ["hanky", "band", "candle", "wood", "bangle", "steel"];
  steps.forEach((k, i) => {
    const x = 130 + i * 164, h = 120 + i * 85, top = 900 - h;
    shadow(c, x + 14, 904, 84, 14);
    shape(c, () => rrect(c, x - 76, top, 152, h, 8), i % 2 ? "#cbb98f" : "#d9c9a0", 6);
    thing(c, k, x, top - 56, 50, k === "steel" || k === "wood" ? -0.5 : 0);
  });
  arrow(c, [[120, 360], [420, 280], [900, 120]], RED, 12);
};

// ---------------------------------------------------------------- e3: two keys
const node = (c: Ctx, x: number, y: number) => { shape(c, () => ell(c, x, y, 40, 40), WHITE, 6); qmark(c, x, y - 22, 40); };
const e3 = (c: Ctx) => {
  ground(c);
  // key A: balanced
  const A = [[270, 140], [140, 380], [400, 380]];
  line(c, [[270, 140], [140, 380]], 7); line(c, [[270, 140], [400, 380]], 7);
  const leavesA: Kind[] = ["steel", "wood", "band", "candle"], lx = [70, 210, 330, 470];
  [[140, 0, 1], [400, 2, 3]].forEach(([px, a, b]) => { line(c, [[px, 380], [lx[a], 640]], 7); line(c, [[px, 380], [lx[b], 640]], 7); });
  leavesA.forEach((k, i) => thing(c, k, lx[i], 700, 48, k === "steel" || k === "wood" ? -0.6 : 0));
  A.forEach(([x, y]) => node(c, x, y));
  line(c, [[540, 60], [540, 1020]], 5, COL.grey);
  // key B: a long chain
  const B = [[640, 140], [740, 330], [840, 520], [940, 710]];
  for (let i = 0; i < 3; i++) line(c, [B[i], B[i + 1]], 7);
  const leavesB: Kind[] = ["steel", "wood", "band", "candle"];
  B.forEach(([x, y], i) => { line(c, [[x, y], [x - 80, y + 70]], 7); thing(c, leavesB[i], x - 80, y + 115, 44, leavesB[i] === "steel" || leavesB[i] === "wood" ? -0.6 : 0); });
  line(c, [B[3], [1010, 800]], 7); thing(c, "sock", 1010, 850, 42);
  B.forEach(([x, y]) => node(c, x, y));
};

// ---------------------------------------------------------------- e4: sort by sound
const e4 = (c: Ctx) => {
  ground(c);
  hand(c, 520, 140, Math.PI / 2, 1.1, SKIN.child, CLOTH.child);
  line(c, [[520, 260], [520, 420]], 4);
  thing(c, "steel", 520, 610, 190, -Math.PI / 2);
  // pencil tapping from the left
  c.save(); c.translate(250, 560); c.rotate(-0.25);
  shape(c, () => rrect(c, -20, -14, 220, 28, 6), COL.yellow, 5); shape(c, () => polyP(c, [[200, -14], [250, 0], [200, 14]]), "#f3d9a8", 5);
  shape(c, () => rrect(c, -50, -14, 30, 28, 6), COL.pink, 5);
  c.restore();
  for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(640, 640, 70 + i * 55, -0.7, 0.7); c.strokeStyle = COL.blueDk; c.lineWidth = 9; c.lineCap = "round"; c.stroke(); }
  for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(400, 640, 70 + i * 55, Math.PI - 0.7, Math.PI + 0.7); c.strokeStyle = COL.blueDk; c.lineWidth = 9; c.stroke(); }
  // a katori and a tumbler rung on fingertips would crowd it; two more things wait on a tray
  tray(c, 880, 900, 320, 120);
  thing(c, "wood", 800, 900, 50, -0.2); thing(c, "cup", 900, 900, 40); thing(c, "foil", 970, 900, 36);
};

// ---------------------------------------------------------------- a1: the kitchen drawer
const katori = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.steel); shape(c, () => ell(c, x, y, r * 0.75, r * 0.75), COL.steelIn, 4); };
const a1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 910, 480, 30);
  shape(c, () => rrect(c, 70, 150, 940, 740, 26), COL.brown, 7);
  shape(c, () => rrect(c, 110, 190, 860, 660, 14), "#6a4128", 6);
  const col = [[130, 440], [580, 530], [770, 200]];
  void col;
  // four compartments
  const box = (x: number, y: number, w: number, h: number) => shape(c, () => rrect(c, x, y, w, h, 10), "#f0e1bd", 5);
  box(130, 210, 360, 300); box(510, 210, 440, 300); box(130, 530, 360, 300); box(510, 530, 440, 300);
  for (let i = 0; i < 4; i++) { c.save(); c.translate(180 + i * 85, 370); c.rotate(Math.PI / 2); spoon(c, 150, COL.steel, COL.steelIn); c.restore(); }
  for (let i = 0; i < 4; i++) { c.save(); c.translate(560 + i * 90, 370); c.rotate(Math.PI / 2); fork(c, 150); c.restore(); }
  for (let i = 0; i < 3; i++) katori(c, 200 + i * 110, 690, 48 + (i === 1 ? 6 : 0));
  katori(c, 330, 760, 36);
  for (let i = 0; i < 3; i++) { c.save(); c.translate(600 + i * 100, 680); c.rotate(Math.PI / 2); thing(c, "wood", 0, 0, 150); c.restore(); }
};

// ---------------------------------------------------------------- venn circles (a2, term venn)
const rings = (c: Ctx, cy: number, rx: number, ry: number, dx: number, fillA = true) => {
  const l = () => ell(c, 540 - dx, cy, rx, ry), r = () => ell(c, 540 + dx, cy, rx, ry);
  c.beginPath(); l(); c.fillStyle = "rgba(63,177,168,0.35)"; c.fill(); c.beginPath(); r(); c.fillStyle = "rgba(243,154,60,0.40)"; c.fill();
  void fillA;
  c.beginPath(); l(); c.lineWidth = 9; c.strokeStyle = COL.tealDk; c.stroke(); c.beginPath(); r(); c.lineWidth = 9; c.strokeStyle = COL.orange; c.stroke();
};
const a2 = (c: Ctx) => {
  ground(c);
  rings(c, 560, 290, 340, 170);
  thing(c, "foil", 330, 560, 56);
  thing(c, "wood", 760, 470, 62, 0.5); thing(c, "pebble", 790, 680, 52);
  thing(c, "steel", 540, 400, 62, -0.6); thing(c, "bangle", 540, 640, 52);
  thing(c, "sock", 105, 150, 50); thing(c, "band", 980, 140, 50);
  thing(c, "hanky", 110, 920, 46); thing(c, "candle", 970, 910, 50, 0.4);
};

// ---------------------------------------------------------------- a3: dal, stones, flakes
const dalBit = (c: Ctx, x: number, y: number, r: number) => shape(c, () => ell(c, x, y, r, r * 0.8, x), "#f0b830", 3);
const a3 = (c: Ctx) => {
  ground(c);
  // newspaper under the tray
  shadow(c, 470, 700, 380, 40);
  shape(c, () => ell(c, 430, 640, 360, 130), COL.steel);
  shape(c, () => ell(c, 430, 630, 320, 105), COL.steelIn, 4);
  const r = rnd(3);
  for (let i = 0; i < 90; i++) { const a = r() * 6.28, d = Math.sqrt(r()); dalBit(c, 430 + Math.cos(a) * d * 250, 636 + Math.sin(a) * d * 70, 11); }
  for (const [x, y] of [[250, 690], [330, 705], [200, 650]]) shape(c, () => ell(c, x, y, 16, 12), COL.grey, 4);
  // dal tossed up, light flakes drifting away
  for (let i = 0; i < 14; i++) dalBit(c, 360 + r() * 160, 380 + r() * 170, 11);
  arrow(c, [[300, 560], [300, 380]]);
  const flake = (x: number, y: number, a: number) => shape(c, () => ell(c, x, y, 20, 8, a), COL.green, 3);
  for (let i = 0; i < 9; i++) flake(620 + i * 40 + r() * 20, 300 + r() * 120, r() * 3);
  arrow(c, [[600, 230], [960, 240]], RED, 10);
  // the three piles: dal, stones, flakes
  shape(c, () => ell(c, 250, 930, 100, 34), COL.steel, 5); for (let i = 0; i < 7; i++) dalBit(c, 200 + i * 17, 925 + (i % 2) * 8, 11);
  shape(c, () => ell(c, 550, 930, 100, 34), COL.steel, 5); for (const [x, y] of [[510, 925], [550, 935], [585, 922]]) shape(c, () => ell(c, x, y, 20, 14), COL.grey, 4);
  shape(c, () => ell(c, 850, 930, 100, 34), COL.steel, 5); flake(810, 925, 0.3); flake(850, 935, 2); flake(885, 922, 0.8);
};

// ---------------------------------------------------------------- a4: three steps of the recycling line
const panel = (c: Ctx, x: number) => { shadow(c, x + 8, 960, 160, 18); shape(c, () => rrect(c, x - 165, 160, 330, 790, 26), "#fff6e2", 6); };
const magnet = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => { c.beginPath(); c.arc(x, y, s, Math.PI, 0); c.lineTo(x + s, y + s * 0.9); c.moveTo(x - s, y); c.lineTo(x - s, y + s * 0.9); };
  p(); c.lineWidth = s * 0.55 + 10; c.strokeStyle = INK; c.lineCap = "butt"; c.stroke(); p(); c.lineWidth = s * 0.55; c.strokeStyle = RED; c.stroke();
  for (const sx of [-1, 1]) { c.fillStyle = COL.steelIn; c.fillRect(x + sx * s - s * 0.275, y + s * 0.62, s * 0.55, s * 0.3); c.strokeStyle = INK; c.lineWidth = 4; c.strokeRect(x + sx * s - s * 0.275, y + s * 0.62, s * 0.55, s * 0.3); }
  c.lineCap = "round";
};
const a4 = (c: Ctx) => {
  ground(c);
  [190, 540, 890].forEach((x) => panel(c, x));
  // 1: blow the paper
  shape(c, () => ell(c, 190, 760, 130, 50), COL.steel); shape(c, () => ell(c, 190, 755, 108, 38), COL.steelIn, 4);
  const sc = (x: number, y: number, a: number) => shape(c, () => rrect(c, x - 22, y - 14, 44, 28, 4), WHITE, 4);
  sc(150, 740, 0); sc(190, 760, 0); thing(c, "clip", 225, 750, 22, 1); thing(c, "clip", 120, 760, 20, 0.5);
  sc(250, 620, 0); sc(300, 560, 0); sc(215, 520, 0);
  arrow(c, [[75, 430], [200, 380], [270, 330]], RED, 9);
  // 2: magnet picks the clips
  shape(c, () => ell(c, 540, 800, 130, 46), COL.steel); shape(c, () => ell(c, 540, 795, 108, 35), COL.steelIn, 4);
  thing(c, "clip", 500, 790, 22, 0.8); thing(c, "clip", 560, 800, 22, 2.5);
  magnet(c, 540, 380, 70);
  thing(c, "clip", 480, 560, 24, 0.3); thing(c, "clip", 600, 600, 24, 1.8); thing(c, "clip", 540, 540, 24, 1.2);
  arrow(c, [[540, 770], [540, 640]], RED, 9);
  // 3: a glass of water, the light bit floats, the heavy bit sinks
  shape(c, () => polyP(c, [[790, 440], [990, 440], [965, 800], [815, 800]]), "rgba(214,236,250,0.5)", 0);
  shape(c, () => polyP(c, [[796, 520], [984, 520], [965, 800], [815, 800]]), "rgba(143,195,234,0.85)", 0);
  shape(c, () => polyP(c, [[790, 440], [990, 440], [965, 800], [815, 800]]), "rgba(0,0,0,0)", 6);
  shape(c, () => rrect(c, 850, 505, 60, 18, 5), WHITE, 4);
  thing(c, "clip", 890, 760, 26, 0.6);
  arrow(c, [[890, 250], [890, 380]], RED, 9);
};

// ---------------------------------------------------------------- a5: stars from hot to cool
const a5 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 280, 1000, 460, 40), NAVY, 7);
  const cols = ["#6f9bff", "#a9c8ff", "#ffffff", "#fff2b0", "#ffd34d", "#f39a3c", "#e4523b"];
  const r = rnd(8);
  for (let i = 0; i < 40; i++) { c.beginPath(); c.arc(70 + r() * 940, 310 + r() * 400, 3, 0, 7); c.fillStyle = "rgba(255,255,255,0.6)"; c.fill(); }
  cols.forEach((col, i) => {
    const x = 120 + i * 140, y = 510;
    c.beginPath(); c.arc(x, y, 66, 0, 7); c.fillStyle = col; c.globalAlpha = 0.28; c.fill(); c.globalAlpha = 1;
    shape(c, () => ell(c, x, y, 46, 46), col, 5);
  });
  arrow(c, [[120, 870], [900, 870]], RED, 14);
  // hot at left: a flame; cool at right: a cooler ember glow
  shape(c, () => { c.moveTo(120, 800); c.quadraticCurveTo(160, 880, 120, 940); c.quadraticCurveTo(70, 880, 120, 800); c.closePath(); }, "#6f9bff", 5);
  shape(c, () => { c.moveTo(950, 830); c.quadraticCurveTo(1000, 890, 950, 950); c.quadraticCurveTo(900, 890, 950, 830); c.closePath(); }, COL.red, 5);
};

// ---------------------------------------------------------------- a6: which circles are you in
const a6 = (c: Ctx) => {
  ground(c); floorLine(c, 600);
  const hoop = (cx: number, col: string) => { c.beginPath(); ell(c, cx, 800, 270, 150); c.lineWidth = 16; c.strokeStyle = INK; c.stroke(); c.beginPath(); ell(c, cx, 800, 270, 150); c.lineWidth = 8; c.strokeStyle = col; c.stroke(); };
  hoop(420, COL.blue); hoop(700, COL.orange);
  person(c, 280, 830, 420, {});
  person(c, 560, 850, 440, { adult: true, armR: [-0.9, -1.4] });
  person(c, 830, 830, 420, {});
  person(c, 70, 960, 360, { adult: true });
};

// ---------------------------------------------------------------- a7: oobleck
const a7 = (c: Ctx) => {
  ground(c);
  const OB = "#e3e8c9";
  for (const x of [290, 790]) { bowl(c, x, 700, 210, OB); }
  hand(c, 290, 480, Math.PI / 2, 1.3, SKIN.child, CLOTH.child, true);
  arrow(c, [[130, 380], [130, 540]]);
  for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(290, 700, 40 + i * 28, 0, Math.PI); c.strokeStyle = "#b6bc92"; c.lineWidth = 5; c.stroke(); }
  hand(c, 790, 400, Math.PI / 2, 1.3, SKIN.child, CLOTH.child, false);
  arrow(c, [[940, 300], [940, 520]]);
  for (const a of [-0.9, -0.45, 0, 0.45, 0.9]) line(c, [[790 + Math.sin(a) * 100, 650 - Math.cos(a) * 40], [790 + Math.sin(a) * 150, 620 - Math.cos(a) * 60]], 6, COL.greyDk);
};

// ---------------------------------------------------------------- p1: our home materials museum
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 650, 500, 40);
  shape(c, () => rrect(c, 80, 190, 900, 450, 40), "#d8c7a3", 7);
  const kinds: Kind[][] = [["steel"], ["wood"], ["bangle"], ["band"], ["comb"], ["candle"], ["sock"], ["hanky"], ["diya"], ["pebble"], ["foil"], ["clip"]];
  kinds.forEach((k, i) => {
    const x = 170 + (i % 6) * 144, y = 300 + Math.floor(i / 6) * 200;
    shape(c, () => ell(c, x, y, 62, 62), "#a9966f", 5); shape(c, () => ell(c, x, y + 4, 50, 50), "#bfae88", 0);
    thing(c, k[0], x, y, 30, k[0] === "steel" || k[0] === "wood" ? -0.5 : 0);
  });
  // label cards in front
  [[220, 0], [540, 1], [860, 2]].forEach(([x, i]) => {
    shadow(c, x + 8, 880, 130, 18);
    shape(c, () => rrect(c, x - 130, 740, 260, 140, 12), WHITE, 6);
    thing(c, ["steel", "candle", "sock"][i] as Kind, x - 60, 810, 38, i === 0 ? -0.5 : 0);
    line(c, [[x + 10, 790], [x + 90, 790]], 7, COL.greyDk); line(c, [[x + 10, 830], [x + 70, 830]], 7, COL.greyDk);
  });
};

// ---------------------------------------------------------------- c1: clean the mixed-up jar
const rice = (c: Ctx, x: number, y: number) => shape(c, () => ell(c, x, y, 11, 5, x), WHITE, 2.5);
const chana = (c: Ctx, x: number, y: number) => shape(c, () => ell(c, x, y, 13, 11), "#d9a05a", 3);
const bead = (c: Ctx, x: number, y: number, k: number) => shape(c, () => ell(c, x, y, 12, 12), [COL.pink, COL.blue, COL.purple][k % 3], 3);
const lfBit = (c: Ctx, x: number, y: number, a: number) => shape(c, () => ell(c, x, y, 17, 7, a), COL.leaf, 2.5);
const c1 = (c: Ctx) => {
  ground(c);
  shadow(c, 250, 930, 150, 20);
  const j = () => rrect(c, 110, 380, 280, 540, 40);
  shape(c, j, "rgba(214,236,250,0.55)", 0);
  c.save(); c.beginPath(); j(); c.clip();
  const r = rnd(2);
  for (let i = 0; i < 90; i++) { const x = 130 + r() * 240, y = 560 + r() * 340, k = i % 5; if (k === 0) rice(c, x, y); else if (k === 1) thing(c, "clip", x, y, 14, r() * 3); else if (k === 2) chana(c, x, y); else if (k === 3) bead(c, x, y, i); else lfBit(c, x, y, r() * 3); }
  c.restore();
  shape(c, j, "rgba(0,0,0,0)", 7);
  shape(c, () => rrect(c, 150, 330, 200, 60, 10), "rgba(214,236,250,0.55)", 6);
  shape(c, () => rrect(c, 140, 300, 220, 40, 10), COL.red, 6);
  shine(c, [[145, 450], [145, 850]], 8);
  arrow(c, [[420, 640], [560, 640]], RED, 14);
  const plate = (x: number, y: number, fill: (x: number, y: number) => void) => {
    shadow(c, x + 10, y + 36, 125, 22); shape(c, () => ell(c, x, y, 120, 46), COL.steel); shape(c, () => ell(c, x, y - 2, 96, 36), COL.steelIn, 4);
    for (let i = 0; i < 9; i++) fill(x - 70 + (i % 5) * 34 + (i > 4 ? 16 : 0), y - 10 + Math.floor(i / 5) * 16);
  };
  plate(700, 260, (x, y) => rice(c, x, y)); plate(930, 260, (x, y) => thing(c, "clip", x, y, 11, x));
  plate(700, 560, (x, y) => chana(c, x, y)); plate(930, 560, (x, y) => bead(c, x, y, Math.round(x)));
  plate(815, 860, (x, y) => lfBit(c, x, y, x));
};

// ---------------------------------------------------------------- terms
const termTally = (c: Ctx) => {
  ground(c);
  for (let i = 0; i < 7; i++) { c.save(); c.translate(150 + (i % 4) * 130, i < 4 ? 330 : 600); c.rotate(Math.PI / 2 - 0.15); spoon(c, 150, COL.steel, COL.steelIn); c.restore(); }
  shape(c, () => rrect(c, 640, 190, 380, 640, 22), WHITE, 6);
  const mark = (x: number, y: number) => { for (let i = 0; i < 4; i++) line(c, [[x + i * 28, y], [x + i * 28, y + 130]], 9); line(c, [[x - 18, y + 115], [x + 105, y + 15]], 9, RED); };
  mark(690, 270); line(c, [[700, 560], [700, 690]], 9); line(c, [[740, 560], [740, 690]], 9);
};
const termWinnow = (c: Ctx) => {
  ground(c); floorLine(c, 860);
  person(c, 270, 880, 560, { adult: true, armL: [0.9, -0.2], armR: [0.9, -0.1] });
  const tx = 440, ty = 880 - 560 * 0.74 + 78;
  shape(c, () => ell(c, tx, ty, 130, 22), COL.wood, 6); shape(c, () => ell(c, tx, ty - 3, 108, 14), COL.woodDk, 0);
  const r = rnd(4);
  for (let i = 0; i < 12; i++) shape(c, () => ell(c, tx - 40 + r() * 80, ty - 90 + r() * 70, 9, 7), COL.yellow, 3);
  for (let i = 0; i < 9; i++) shape(c, () => ell(c, tx - 20 + r() * 40, ty + 60 + i * 30, 9, 7), COL.yellow, 3);
  shape(c, () => ell(c, tx, 850, 110, 36), COL.yellow, 6);
  const hx = [530, 640, 750, 860, 950];
  hx.forEach((x, i) => shape(c, () => ell(c, x + r() * 10, ty + 10 + (i % 2) * 60 + r() * 30, 19, 7, r() * 2), "#c9a56b", 3));
  arrow(c, [[560, ty - 60], [900, ty - 50]], RED, 10);
};
const termVenn = (c: Ctx) => {
  ground(c);
  rings(c, 540, 300, 330, 170);
  thing(c, "steel", 540, 540, 70, -0.6);
  thing(c, "sock", 130, 140, 60); thing(c, "band", 950, 150, 60);
  thing(c, "foil", 320, 560, 56); thing(c, "wood", 770, 560, 60, 0.5);
};
const termTricky = (c: Ctx) => {
  ground(c);
  tray(c, 300, 600, 520, 380, COL.sky); tray(c, 780, 600, 520, 380, COL.pink);
  thing(c, "pebble", 200, 560, 70); thing(c, "steel", 330, 700, 70, -0.5);
  thing(c, "sock", 700, 580, 70); thing(c, "hanky", 860, 700, 60);
  thing(c, "candle", 540, 560, 130, Math.PI / 2 + 0.3);
};
const termRule = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(540, 260); c.rotate(-0.06);
  shadow(c, 14, 190, 220, 22); shape(c, () => rrect(c, -190, -170, 380, 340, 24), WHITE, 7); c.restore();
  qmark(c, 540, 140, 200);
  tray(c, 290, 760, 380, 250, COL.sky); tray(c, 790, 760, 380, 250, COL.pink);
  tick(c, 290, 640, 50); cross(c, 790, 640, 48);
  thing(c, "steel", 220, 790, 52, -0.6); thing(c, "bangle", 350, 790, 44);
  thing(c, "wood", 720, 790, 52, 0.5); thing(c, "band", 850, 790, 44);
};

export const ic_materialsSortingMaterialsL3 = cards("sci.materials.sorting-materials.L3 cards", [
  intro, summary, e1, e2, e3, e4, a1, a2, a3, a4, a5, a6, a7, p1, c1, termTally, termWinnow, termVenn, termTricky, termRule,
]);
