import type { Ctx } from "./core";
import { COL, CLOTH, INK, BG, WHITE, RED, SKIN, cards, ground, shape, ell, rrect, polyP, shadow, shade, line, shine, arrow, plate, seed, leaf, hand, write, rnd } from "./flatKit";

// sci.genetics.dna-and-rna.L3 set-up cards: three seeds on cotton (e1), big and small chana (e2).

// ---------- shared pieces
const MOONG = { col: COL.green, dk: COL.greenDk };
const METHI = { col: "#d2a640", dk: "#9a722a" };
const MUSTARD = { col: "#5a4636", dk: "#2e2219" };

// the cotton bed on a plate: a lumpy flat pad, wet = bluish with drops
const cotton = (c: Ctx, x: number, y: number, rx: number, ry: number, wet = true) => {
  const path = () => { for (let i = 0; i <= 48; i++) { const t = (i / 48) * Math.PI * 2, k = 1 + 0.035 * Math.sin(t * 7); const px = x + Math.cos(t) * rx * k, py = y + Math.sin(t) * ry * k; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); };
  shape(c, path, wet ? "#d6e6f3" : COL.cloth, 5);
  shade(c, path, wet ? "#8fb3d6" : "#cfc6b0", -rx * 0.07, -ry * 0.14, 0.5);
  if (wet) { const r = rnd(5); for (let i = 0; i < 9; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * 0.8; shape(c, () => ell(c, x + Math.cos(a) * rx * d, y + Math.sin(a) * ry * d, rx * 0.025, ry * 0.03), COL.drop, 2); } }
};
const chana = (c: Ctx, x: number, y: number, r: number, soaked = false) => {
  const col = soaked ? "#9a6e45" : "#5d3d29", dk = soaked ? "#6f4a2c" : "#35200f";
  shape(c, () => { ell(c, x, y, r, r * 0.88, 0.3); }, col, Math.max(3, r * 0.12));
  shape(c, () => polyP(c, [[x + r * 0.7, y - r * 0.55], [x + r * 1.2, y - r * 0.9], [x + r * 0.95, y - r * 0.2]]), col, Math.max(3, r * 0.1));
  c.save(); c.beginPath(); ell(c, x, y, r, r * 0.88, 0.3); c.clip(); c.beginPath(); ell(c, x - r * 0.35, y - r * 0.3, r, r * 0.88, 0.3); c.rect(-5000, -5000, 10000, 10000); c.fillStyle = dk; c.globalAlpha = 0.55; c.fill("evenodd"); c.restore(); c.globalAlpha = 1;
  line(c, [[x - r * 0.4, y - r * 0.35], [x - r * 0.1, y - r * 0.5]], Math.max(2, r * 0.1), soaked ? "#c9a37a" : "#8a6446");
};
const tag = (c: Ctx, x: number, y: number, w: number, h: number, pic: () => void) => {
  shadow(c, x + 8, y + h / 2 + 4, w * 0.5, h * 0.12);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 10), WHITE, 5);
  pic();
};
// a sleeve running in from the edge, then the gripping hand; g = where the held thing is, toward = angle the hand points
const holdHand = (c: Ctx, gx: number, gy: number, an: number, s: number, open = false) => {
  const dx = Math.cos(an), dy = Math.sin(an), wx = gx - dx * 70 * s, wy = gy - dy * 70 * s;
  line(c, [[wx - dx * 60 * s, wy - dy * 60 * s], [wx - dx * 700, wy - dy * 700]], 82 * s + 10, INK);
  line(c, [[wx - dx * 60 * s, wy - dy * 60 * s], [wx - dx * 700, wy - dy * 700]], 82 * s, CLOTH.child);
  hand(c, wx, wy, an, s, SKIN.child, CLOTH.child, open);
};
const drop = (c: Ctx, x: number, y: number, s: number) => shape(c, () => { c.moveTo(x, y - s * 1.6); c.quadraticCurveTo(x + s * 0.3, y - s * 0.6, x + s, y + s * 0.2); c.arc(x, y + s * 0.2, s, 0, Math.PI); c.quadraticCurveTo(x - s * 0.3, y - s * 0.6, x, y - s * 1.6); c.closePath(); }, COL.water, Math.max(3, s * 0.2));

// a window with sun, and the sill below it; the plate rests on the sill
const windowSill = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 170, 30, 740, 360, 14), WHITE, 8);
  shape(c, () => rect4(c, 200, 60, 680, 300), COL.sky, 6);
  shape(c, () => ell(c, 320, 160, 56, 56), COL.yellow, 6);
  for (let i = 0; i < 10; i++) { const a = (i / 10) * 6.283; line(c, [[320 + Math.cos(a) * 76, 160 + Math.sin(a) * 76], [320 + Math.cos(a) * 104, 160 + Math.sin(a) * 104]], 8, COL.orange); }
  line(c, [[540, 60], [540, 360]], 14, INK); line(c, [[540, 60], [540, 360]], 8, WHITE);
  line(c, [[200, 210], [880, 210]], 14, INK); line(c, [[200, 210], [880, 210]], 8, WHITE);
  shape(c, () => polyP(c, [[60, 390], [1020, 390], [1080, 900], [0, 900]]), COL.wood);
  shape(c, () => rect4(c, 0, 900, 1080, 120), COL.woodDk);
};
const rect4 = (c: Ctx, x: number, y: number, w: number, h: number) => polyP(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);

// a young seedling standing on the cotton: pale stem, seed leaves; base (x, y)
const sprout = (c: Ctx, x: number, y: number, h: number, lean: number, seedCol: { col: string; dk: string }, leafCol: string, leafLen: number, stem = "#e4efb0") => {
  const tx = x + lean, ty = y - h, path = [[x, y], [x + lean * 0.3, y - h * 0.5], [tx, ty]];
  const sp = () => { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(path[1][0] + lean * 0.5, path[1][1], tx, ty); };
  sp(); c.strokeStyle = INK; c.lineWidth = 28; c.lineCap = "round"; c.stroke();
  sp(); c.strokeStyle = stem; c.lineWidth = 17; c.stroke();
  seed(c, x, y + 2, 24, 0, false, seedCol.col, seedCol.dk);
  leaf(c, tx, ty, leafLen, -2.55, leafCol); leaf(c, tx, ty, leafLen, -0.6, leafCol);
};
// a chana seedling: stem with small paired leaflets, seed at the foot
const chanaSprout = (c: Ctx, x: number, y: number, h: number, lean: number) => {
  const tx = x + lean, ty = y - h, sp = () => { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + lean * 0.9, y - h * 0.5, tx, ty); };
  sp(); c.strokeStyle = INK; c.lineWidth = 26; c.lineCap = "round"; c.stroke(); sp(); c.strokeStyle = "#cfe58a"; c.lineWidth = 15; c.stroke();
  for (let k = 0; k < 3; k++) { const u = 0.45 + k * 0.22, px = x + lean * u * 1.1, py = y - h * u; leaf(c, px, py, 52 - k * 5, -2.7 + k * 0.1, COL.leaf); leaf(c, px, py, 52 - k * 5, -0.45 - k * 0.1, COL.leaf); }
  leaf(c, tx, ty, 44, -1.57, COL.leaf);
  chana(c, x, y + 4, 24, true);
};
const ruler = (c: Ctx, x: number, bottom: number, cm: number, per: number, ticksLeft: boolean) => {
  const top = bottom - cm * per - 24, w = 94;
  shadow(c, x + 8, bottom + 6, w * 0.5, 10);
  shape(c, () => rect4(c, x, top, w, bottom - top), COL.wood, 6);
  shade(c, () => rect4(c, x, top, w, bottom - top), COL.woodDk, -10, -4, 0.5);
  for (let i = 0; i <= cm; i++) { const y = bottom - i * per; line(c, ticksLeft ? [[x + w, y], [x + w - 34, y]] : [[x, y], [x + 34, y]], 5); if (i > 0) write(c, String(i), ticksLeft ? x + 12 : x + 44, y - 14, 28, INK, 5); }
  write(c, "0", ticksLeft ? x + 12 : x + 44, bottom - 14, 28, INK, 5);
};

// ---------- e1: three seeds, one cotton
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 670, 490, 300);
  cotton(c, 540, 670, 400, 225, true);
  const kinds = [
    { y: 550, r: 36, k: MOONG }, { y: 670, r: 24, k: METHI }, { y: 790, r: 13, k: MUSTARD },
  ];
  kinds.forEach(({ y, r, k }, row) => {
    tag(c, 250, y, 124, 96, () => seed(c, 250, y, r, 0.3, false, k.col, k.dk));
    for (let i = 0; i < 5; i++) { if (row === 0 && i === 4) continue; seed(c, 400 + i * 110, y + (i % 2) * 5, r, 0.4 + i * 0.7, false, k.col, k.dk); }
  });
  const an = Math.PI * 0.7, dx = Math.cos(an), dy = Math.sin(an), s = 2;
  holdHand(c, 840 - dx * 10 * s, 450 - dy * 10 * s, an, s);
  seed(c, 840, 450, 36, 0.9, false, MOONG.col, MOONG.dk);
  arrow(c, [[760, 480], [800, 530]], RED, 10);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  windowSill(c);
  plate(c, 540, 710, 480, 165);
  cotton(c, 540, 708, 390, 122, true);
  [[660, 20, MOONG], [708, 14, METHI], [752, 8, MUSTARD]].forEach(([y, r, k], j) => {
    for (let i = 0; i < 5; i++) seed(c, 330 + i * 95 + j * 10, (y as number) + (i % 2) * 3, r as number, i * 0.6, false, (k as typeof MOONG).col, (k as typeof MOONG).dk);
  });
  const an = Math.PI - 0.75, dx = Math.cos(an), dy = Math.sin(an), bx = 470, by = 400;
  line(c, [[bx - dx * 330, by - dy * 330], [bx, by]], 34, INK); line(c, [[bx - dx * 330, by - dy * 330], [bx, by]], 20, COL.steel);
  shape(c, () => ell(c, bx, by, 105, 64, an), COL.steel, 7);
  shape(c, () => ell(c, bx + dx * 5, by + dy * 5, 80, 44, an), COL.water, 5);
  holdHand(c, bx - dx * 270, by - dy * 270, an, 1.8);
  const tx = bx + dx * 105, ty = by + dy * 105;
  drop(c, tx - 6, ty + 48, 18); drop(c, tx - 10, ty + 102, 20);
  arrow(c, [[tx - 110, ty + 20], [tx - 110, ty + 130]], RED, 11);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  plate(c, 600, 800, 440, 140);
  cotton(c, 600, 798, 355, 104, true);
  const groups: [number, number, typeof MOONG, string, number][] = [[310, 330, MOONG, COL.leaf, 88], [610, 240, METHI, "#7fb84a", 68], [890, 150, MUSTARD, COL.leafDk, 48]];
  groups.forEach(([gx, h, k, lc, ll]) => { for (let i = 0; i < 4; i++) sprout(c, gx - 75 + i * 50, 815 - (i % 2) * 12, h * (0.9 + 0.05 * (i % 3)), (i - 1.5) * 6, k, lc, ll); });
  ruler(c, 20, 830, 8, 56, true);
  const lx = 630, ly = 290, lr = 165, gx = 870, gy = 450, ang = Math.atan2(ly - gy, lx - gx), ux = Math.cos(ang), uy = Math.sin(ang);
  line(c, [[lx - ux * lr * 0.9, ly - uy * lr * 0.9], [gx - ux * 90, gy - uy * 90]], 38, INK); line(c, [[lx - ux * lr * 0.9, ly - uy * lr * 0.9], [gx - ux * 90, gy - uy * 90]], 24, COL.brown);
  shape(c, () => ell(c, lx, ly, lr, lr), "rgba(214,236,250,0.8)", 0);
  c.save(); c.beginPath(); ell(c, lx, ly, lr - 4, lr - 4); c.clip();
  line(c, [[lx, ly + 150], [lx, ly]], 44, INK); line(c, [[lx, ly + 150], [lx, ly]], 30, "#e4efb0");
  leaf(c, lx, ly, 130, -2.55, COL.leaf); leaf(c, lx, ly, 130, -0.6, COL.leaf);
  c.restore();
  shape(c, () => ell(c, lx, ly, lr, lr), "rgba(0,0,0,0)", 18);
  line(c, (() => { const p: number[][] = []; for (let i = 0; i <= 14; i++) { const a = Math.PI * (1.05 + i * 0.045); p.push([lx + Math.cos(a) * (lr - 24), ly + Math.sin(a) * (lr - 24)]); } return p; })(), 10, WHITE);
  holdHand(c, gx, gy, ang, 1.8);
};

// ---------- e2: big seed, small seed
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 650, 500, 320);
  const r = rnd(21);
  for (let i = 0; i < 24; i++) { const a = r() * 6.28, d = Math.sqrt(r()); chana(c, 280 + Math.cos(a) * 140 * d, 670 + Math.sin(a) * 120 * d, 24 + r() * 16); }
  for (let i = 0; i < 5; i++) chana(c, 540 + i * 100, 560, 44);
  for (let i = 0; i < 5; i++) chana(c, 560 + i * 72, 740, 24);
  arrow(c, [[450, 610], [500, 580]], RED, 10);
  holdHand(c, 700, 330, Math.PI * 0.5, 2);
  chana(c, 700, 378, 44);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  windowSill(c);
  plate(c, 540, 690, 480, 190);
  cotton(c, 540, 688, 395, 145, true);
  tag(c, 215, 625, 110, 92, () => chana(c, 215, 625, 36, true));
  tag(c, 215, 755, 110, 92, () => chana(c, 215, 755, 20, true));
  for (let i = 0; i < 5; i++) chana(c, 370 + i * 105, 625, 44, true);
  for (let i = 0; i < 5; i++) chana(c, 390 + i * 85, 755, 25, true);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 850, 500, 150);
  cotton(c, 540, 848, 410, 112, true);
  const hs = [330, 345, 318, 338, 325], ss = [265, 250, 275, 258, 268];
  hs.forEach((h, i) => chanaSprout(c, 110 + i * 72, 850 - (i % 2) * 10, h, (i - 2) * 8));
  ss.forEach((h, i) => chanaSprout(c, 680 + i * 72, 850 - (i % 2) * 10, h, (i - 2) * 8));
  ruler(c, 490, 870, 8, 56, false);
  holdHand(c, 537, 400, Math.PI * 0.5, 2);
};

export const su_geneticsDnaAndRna = cards("sci.genetics.dna-and-rna.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2]);
