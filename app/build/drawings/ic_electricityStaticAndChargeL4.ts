import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards } from "./flatKit";

// STATIC AND CHARGE L4 · set-up cards for the charge ladder and the two-balloon experiments, then the
// activity, project and term cards. Flat kit look. The same child (orange top) is on every card.
// One hanging rig is used again and again: a table slab in the top left, a pencil taped on it sticking
// out past the end, a thread from the pencil tip. Balloons: red for the first, blue for the second.

type Ctx = Parameters<typeof shape>[0];
const WOOL = "#b94a3f", WOOL_DK = "#8c3129", BAL = "#e4523b", BAL_DK = "#b93a27", BAL2 = "#5b8fd6", BAL2_DK = "#3f6fb3";
const FLOOR = "#e2d3b6", TAPE = "rgba(255,255,255,0.62)";

// ---------------------------------------------------------------- things
// a hand gripping from the right side (mirrored flat-kit hand), wrist at (wx, wy), pointing left; the held thing's middle at wx - 70 s
const handFromRight = (c: Ctx, wx: number, wy: number, s = 1, open = false) => { c.save(); c.translate(wx, wy); c.scale(-1, 1); hand(c, 0, 0, 0, s, SKIN.child, CLOTH.child, open); c.restore(); };
const thread = (c: Ctx, a: number[], b: number[]) => line(c, [a, b], 3.5, INK);
// a balloon hanging from its knot at (kx, ky); t = swing angle from straight down (positive = body to the right)
const balloonHang = (c: Ctx, kx: number, ky: number, t: number, col = BAL, dk = BAL_DK, rx = 90, ry = 112) => {
  const dxu = Math.sin(t), dyu = Math.cos(t), cx = kx + dxu * (ry + 16), cy = ky + dyu * (ry + 16);
  shadow(c, cx + 14, cy + ry * 0.12, rx * 0.95, ry * 0.95);
  const body = () => ell(c, cx, cy, rx, ry, -t);
  shape(c, body, col); shade(c, body, dk, rx * 0.32, -rx * 0.1);
  // the knot: a small flared neck pointing at the thread
  const nx = -dyu, ny = dxu; // perpendicular
  shape(c, () => polyP(c, [[kx + nx * 9, ky + ny * 9], [kx - nx * 9, ky - ny * 9], [kx - nx * 15 + dxu * 24, ky - ny * 15 + dyu * 24], [kx + nx * 15 + dxu * 24, ky + ny * 15 + dyu * 24]]), col, 5);
  shine(c, [[cx - rx * 0.55 * Math.cos(t) - rx * 0.1, cy - ry * 0.55], [cx - rx * 0.4, cy - ry * 0.15]], 10);
};
// a balloon lying on its side, centre (cx, cy), knot pointing to the right
const balloonLying = (c: Ctx, cx: number, cy: number, col = BAL, dk = BAL_DK, rx = 112, ry = 86) => {
  shadow(c, cx + 10, cy + ry * 0.9, rx * 0.9, ry * 0.22);
  const body = () => ell(c, cx, cy, rx, ry);
  shape(c, body, col); shade(c, body, dk, rx * 0.25, ry * 0.3);
  shape(c, () => polyP(c, [[cx + rx - 4, cy - 9], [cx + rx - 4, cy + 9], [cx + rx + 22, cy + 15], [cx + rx + 22, cy - 15]]), col, 5);
  shine(c, [[cx - rx * 0.55, cy - ry * 0.45], [cx - rx * 0.15, cy - ry * 0.62]], 10);
};
// the table slab of the hanging rig: top surface and front edge from x = 0 to xEnd, a taped pencil sticking out to tipX.
// Returns the point the thread hangs from.
const rigSlab = (c: Ctx, xEnd: number, tipX: number): number[] => {
  shape(c, () => polyP(c, [[-10, 40], [xEnd, 40], [xEnd, 110], [-10, 110]]), COL.wood);
  shape(c, () => polyP(c, [[-10, 110], [xEnd, 110], [xEnd, 170], [-10, 170]]), COL.woodDk);
  pencil(c, tipX - 270, 82, 270);
  for (const tx of [tipX - 215, tipX - 140]) shape(c, () => polyP(c, [[tx - 16, 48], [tx + 20, 48], [tx + 16, 112], [tx - 20, 112]]), TAPE, 3);
  return [tipX - 22, 96];
};
// a pencil lying flat, left end at (x, y), length len, sharpened tip at the right
const pencil = (c: Ctx, x: number, y: number, len: number) => {
  shape(c, () => polyP(c, [[x, y - 13], [x + len - 48, y - 13], [x + len - 48, y + 13], [x, y + 13]]), COL.yellow);
  c.fillStyle = COL.orange; c.fillRect(x + 2, y + 2, len - 52, 9);
  shape(c, () => polyP(c, [[x + len - 48, y - 13], [x + len, y], [x + len - 48, y + 13]]), COL.wood, 5);
  shape(c, () => polyP(c, [[x + len - 14, y - 4], [x + len, y], [x + len - 14, y + 4]]), INK, 0);
  shape(c, () => polyP(c, [[x, y - 13], [x + 40, y - 13], [x + 40, y + 13], [x, y + 13]]), COL.pink, 5);
  shape(c, () => polyP(c, [[x + 40, y - 13], [x + 56, y - 13], [x + 56, y + 13], [x + 40, y + 13]]), COL.steel, 5);
};
// a wooden ruler, left end centre at (x, y), along angle an, with centimetre ticks along its top edge
const ruler = (c: Ctx, x: number, y: number, len: number, an = 0, numbers = false) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shadow(c, len / 2 + 8, 36, len / 2, 10);
  shape(c, () => rrect(c, 0, -27, len, 54, 6), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(3, 14, len - 6, 10);
  c.strokeStyle = INK; c.lineCap = "butt";
  const step = 12;
  for (let i = 0; i * step <= len - 16; i++) { const tx = 10 + i * step, h = i % 10 === 0 ? 26 : i % 5 === 0 ? 18 : 10; c.lineWidth = i % 10 === 0 ? 3.5 : 2.2; c.beginPath(); c.moveTo(tx, -27); c.lineTo(tx, -27 + h); c.stroke(); }
  if (numbers) for (let k = 0; k * step * 10 <= len - 30; k++) write(c, String(k * 10), 10 + k * step * 10 - 6, 2, 16, INK, 3);
  c.restore();
};
// a folded woollen shawl lying flat, its box (x, y, w, h); fringe at the right end
const shawl = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 10, y + h + 4, w / 2, 10);
  shape(c, () => rrect(c, x, y, w, h, 18), WOOL);
  shade(c, () => rrect(c, x, y, w, h, 18), WOOL_DK, w * 0.08, h * 0.25);
  line(c, [[x + w * 0.1, y + h * 0.55], [x + w * 0.9, y + h * 0.55]], 4, WOOL_DK);
  c.globalAlpha = 0.35; for (let i = 0; i < 7; i++) line(c, [[x + 30 + i * (w - 60) / 6, y + 14], [x + 30 + i * (w - 60) / 6, y + h * 0.5]], 3, "#f3d9a6"); c.globalAlpha = 1;
  for (let i = 0; i < 6; i++) line(c, [[x + w - 4, y + 10 + i * (h - 20) / 5], [x + w + 26, y + 6 + i * (h - 12) / 5]], 4, WOOL_DK);
};
// a flat clear plastic bag (polythene), its box (x, y, w, h), handles at the top
const bag = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 10), "rgba(214,236,250,0.75)", 4);
  shape(c, () => { c.moveTo(x + w * 0.18, y); c.quadraticCurveTo(x + w * 0.18, y - h * 0.5, x + w * 0.42, y - h * 0.5); c.quadraticCurveTo(x + w * 0.5, y - h * 0.5, x + w * 0.42, y); c.closePath(); }, "rgba(214,236,250,0.75)", 4);
  shape(c, () => { c.moveTo(x + w * 0.58, y); c.quadraticCurveTo(x + w * 0.5, y - h * 0.5, x + w * 0.58, y - h * 0.5); c.quadraticCurveTo(x + w * 0.82, y - h * 0.5, x + w * 0.82, y); c.closePath(); }, "rgba(214,236,250,0.75)", 4);
  c.globalAlpha = 0.5; line(c, [[x + w * 0.2, y + h * 0.8], [x + w * 0.55, y + h * 0.35]], 3, COL.glassEdge); c.globalAlpha = 1;
};
// a crumpled foil ball, centre (x, y), radius r
const foilBall = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + 10, y + r * 0.9, r * 0.9, r * 0.25);
  shape(c, () => ell(c, x, y, r, r), COL.steel, 5); shade(c, () => ell(c, x, y, r, r), COL.steelDk, r * 0.3, r * 0.25);
  line(c, [[x - r * 0.5, y - r * 0.2], [x - r * 0.1, y - r * 0.45], [x + r * 0.3, y - r * 0.15]], 3, COL.steelDk);
  line(c, [[x - r * 0.3, y + r * 0.3], [x + r * 0.15, y + r * 0.15], [x + r * 0.45, y + r * 0.45]], 3, COL.steelDk);
  shine(c, [[x - r * 0.55, y - r * 0.45], [x - r * 0.3, y - r * 0.6]], 6);
};
// a steel spoon lying along angle an: bowl centre at (x, y), handle running away along an for len
const spoon = (c: Ctx, x: number, y: number, len: number, an = 0) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shadow(c, len / 2 + 10, 30, len / 2 + 30, 12);
  shape(c, () => { c.moveTo(42, -10); c.lineTo(len, -14); c.lineTo(len, 14); c.lineTo(42, 10); c.closePath(); }, COL.steel, 5);
  shape(c, () => ell(c, 0, 0, 52, 34), COL.steel); shade(c, () => ell(c, 0, 0, 52, 34), COL.steelDk, 12, 10);
  shape(c, () => ell(c, -3, -3, 36, 22), COL.steelIn, 3);
  c.restore();
};
// a red letter drawn as strokes: "R" or "A", top-left at (x, y), height h
const letter = (c: Ctx, ch: "R" | "A", x: number, y: number, h: number) => {
  const w = h * 0.62;
  if (ch === "R") { line(c, [[x, y], [x, y + h]], 14, RED); c.beginPath(); c.moveTo(x, y); c.lineTo(x + w * 0.5, y); c.arc(x + w * 0.5, y + h * 0.25, h * 0.25, -Math.PI / 2, Math.PI / 2); c.lineTo(x, y + h * 0.5); c.strokeStyle = RED; c.lineWidth = 14; c.lineCap = "round"; c.lineJoin = "round"; c.stroke(); line(c, [[x + w * 0.35, y + h * 0.5], [x + w, y + h]], 14, RED); }
  else { line(c, [[x, y + h], [x + w / 2, y], [x + w, y + h]], 14, RED); line(c, [[x + w * 0.2, y + h * 0.66], [x + w * 0.8, y + h * 0.66]], 14, RED); }
};
// a room: floor line at y = 1000
const room = (c: Ctx) => { ground(c); c.fillStyle = FLOOR; c.fillRect(0, 1000, D, 80); line(c, [[0, 1000], [D, 1000]], 5, INK); };
// a table seen from the front, x0..x1, top surface at y = top, legs to the floor
const table = (c: Ctx, x0: number, x1: number, top: number) => {
  for (const lx of [x0 + 30, x1 - 66]) shape(c, () => polyP(c, [[lx, top + 60], [lx + 36, top + 60], [lx + 36, 1000], [lx, 1000]]), COL.woodDk);
  shape(c, () => polyP(c, [[x0, top - 28], [x1, top - 28], [x1, top], [x0, top]]), COL.wood);
  shape(c, () => polyP(c, [[x0, top], [x1, top], [x1, top + 60], [x0, top + 60]]), COL.woodDk);
};
// a small minus sign in ink, centred at (x, y)
const minus = (c: Ctx, x: number, y: number, w = 22, col = INK) => line(c, [[x - w / 2, y], [x + w / 2, y]], 6, col);
const plus = (c: Ctx, x: number, y: number, w = 22, col = INK) => { line(c, [[x - w / 2, y], [x + w / 2, y]], 6, col); line(c, [[x, y - w / 2], [x, y + w / 2]], 6, col); };

// ---------------------------------------------------------------- set-up cards: experiment e1
// e1.0: the balloon on its thread from the pencil at the table end, the child rubbing it along the shawl
const setupE1_0 = (c: Ctx) => {
  room(c);
  table(c, 360, 960, 660);
  shawl(c, 380, 598, 420, 64);
  balloonLying(c, 530, 548, BAL, BAL_DK, 112, 76);
  pencil(c, 820, 622, 250);
  for (const tx of [860, 930]) shape(c, () => polyP(c, [[tx - 14, 596], [tx + 18, 596], [tx + 14, 648], [tx - 18, 648]]), TAPE, 3);
  c.beginPath(); c.moveTo(664, 548); c.quadraticCurveTo(820, 700, 1046, 640); c.strokeStyle = INK; c.lineWidth = 3.5; c.stroke();
  const h = person(c, 230, 1000, 600, { reachR: [440, 522] });
  // the hand presses the balloon: a small shadow of it on the balloon
  c.globalAlpha = 0.25; c.beginPath(); ell(c, h.handR[0] + 14, h.handR[1] + 12, 28, 14); c.fillStyle = INK; c.fill(); c.globalAlpha = 1;
  arrow(c, [[640, 440], [770, 440]]);
};
// e1.1: the ruler rubbed ten times along the shawl, one way, on the table top
const setupE1_1 = (c: Ctx) => {
  ground(c, COL.wood);
  c.globalAlpha = 0.35; for (let y = 60; y < D; y += 90) line(c, [[0, y], [D, y]], 3, COL.woodDk); c.globalAlpha = 1;
  shawl(c, 110, 400, 800, 300);
  ruler(c, 220, 560, 650, 0);
  handFromRight(c, 970, 560, 1.5);
  arrow(c, [[520, 470], [300, 470]]);
};
// e1.2: the rubbed ruler near the balloon: pushed away, R
const setupE1_2 = (c: Ctx) => {
  ground(c);
  const tip = rigSlab(c, 350, 470);
  const t = -0.33, L = 350, kx = tip[0] + Math.sin(t) * L, ky = tip[1] + Math.cos(t) * L;
  thread(c, tip, [kx, ky]);
  balloonHang(c, kx, ky, t);
  ruler(c, 445, 560, 250, 0);
  handFromRight(c, 765, 560, 1);
  arrow(c, [[300, 720], [150, 720]]);
  letter(c, "R", 820, 300, 150);
};
// e1.3: the ruler, rubbed on the polythene bag lying on the table, pulls the balloon closer: A
const setupE1_3 = (c: Ctx) => {
  ground(c);
  const tip = rigSlab(c, 350, 470);
  bag(c, 40, 56, 170, 48);
  const t = 0.33, L = 350, kx = tip[0] + Math.sin(t) * L, ky = tip[1] + Math.cos(t) * L;
  thread(c, tip, [kx, ky]);
  balloonHang(c, kx, ky, t);
  ruler(c, 760, 560, 215, 0);
  handFromRight(c, 1000, 560, 1);
  arrow(c, [[620, 720], [770, 720]]);
  letter(c, "A", 110, 300, 150);
};
// e1.4: seven cards in a column, a ladder: wool on top, polythene at the bottom, five blank rungs between
const setupE1_4 = (c: Ctx) => {
  ground(c);
  for (const rx of [250, 790]) { shape(c, () => rrect(c, rx, 50, 40, 980, 12), COL.wood); c.fillStyle = COL.woodDk; c.fillRect(rx + 26, 56, 10, 968); }
  for (let i = 0; i < 7; i++) {
    const cy = 130 + i * 130;
    shadow(c, 540 + 10, cy + 52, 230, 12);
    shape(c, () => rrect(c, 310, cy - 48, 460, 96, 10), COL.paper, 5);
    if (i === 0) shawl(c, 410, cy - 26, 220, 52);
    else if (i === 6) bag(c, 440, cy - 14, 200, 50);
    else { c.setLineDash([14, 12]); line(c, [[370, cy + 18], [710, cy + 18]], 4, COL.grey); c.setLineDash([]); }
  }
};
// ---------------------------------------------------------------- set-up cards: experiment e2
// e2.0: two balloons from one pencil, touching at rest, a ruler held at the knots
const setupE2_0 = (c: Ctx) => {
  ground(c);
  const tip = rigSlab(c, 430, 550);
  const a = [tip[0] - 28, tip[1]], b = [tip[0] + 10, tip[1]], ka = [445, 455], kb = [635, 455];
  ruler(c, 330, 455, 440, 0, true);
  handFromRight(c, 850, 455, 1);
  thread(c, a, ka); thread(c, b, kb);
  balloonHang(c, ka[0], ka[1], 0.02, BAL, BAL_DK, 95, 115); balloonHang(c, kb[0], kb[1], -0.02, BAL2, BAL2_DK, 95, 115);
};
// e2.1: the child rubbing one balloon along the shawl, counting, the other balloon waiting on the table
const setupE2_1 = (c: Ctx) => {
  room(c);
  table(c, 360, 1040, 660);
  shawl(c, 380, 598, 400, 64);
  balloonLying(c, 520, 548, BAL, BAL_DK, 112, 76);
  balloonLying(c, 900, 572, BAL2, BAL2_DK, 90, 62);
  c.beginPath(); c.moveTo(1010, 572); c.quadraticCurveTo(1040, 520, 1000, 480); c.quadraticCurveTo(960, 520, 1010, 572); c.strokeStyle = INK; c.lineWidth = 3.5; c.stroke();
  const h = person(c, 230, 1000, 600, { reachR: [430, 522] });
  c.globalAlpha = 0.25; c.beginPath(); ell(c, h.handR[0] + 14, h.handR[1] + 12, 28, 14); c.fillStyle = INK; c.fill(); c.globalAlpha = 1;
  arrow(c, [[650, 440], [770, 440]]);
  // counting aloud: a speech bubble with 1 2 3
  shape(c, () => { rrect(c, 300, 230, 260, 110, 30); }, WHITE, 5);
  shape(c, () => polyP(c, [[330, 335], [300, 400], [380, 338]]), WHITE, 5);
  c.fillStyle = WHITE; c.fillRect(322, 326, 54, 14);
  write(c, "1 2 3", 332, 255, 60, INK, 7);
};
// e2.2: the two balloons hang apart in a V; the ruler measures the gap between the knots
const setupE2_2 = (c: Ctx) => {
  ground(c);
  const tip = rigSlab(c, 430, 550);
  const a = [tip[0] - 28, tip[1]], b = [tip[0] + 10, tip[1]], ka = [360, 440], kb = [740, 440];
  ruler(c, 300, 440, 460, 0, true);
  handFromRight(c, 840, 440, 1);
  thread(c, a, ka); thread(c, b, kb);
  balloonHang(c, ka[0], ka[1], -0.42, BAL, BAL_DK, 95, 115); balloonHang(c, kb[0], kb[1], 0.42, BAL2, BAL2_DK, 95, 115);
  line(c, [[ka[0], 372], [ka[0], 408]], 8, RED); line(c, [[kb[0], 372], [kb[0], 408]], 8, RED); line(c, [[ka[0], 390], [kb[0], 390]], 8, RED);
};

// ---------------------------------------------------------------- flow cards
// e1: the child, sitting on the floor, holds the rubbed ruler near the hanging balloon, which swings away; wool and bag on the table
const flowE1 = (c: Ctx) => {
  room(c);
  table(c, -40, 380, 480);
  shawl(c, 0, 420, 190, 60); bag(c, 210, 436, 130, 44);
  pencil(c, 215, 442, 250);
  for (const tx of [260, 330]) shape(c, () => polyP(c, [[tx - 14, 416], [tx + 18, 416], [tx + 14, 468], [tx - 18, 468]]), TAPE, 3);
  const tip = [443, 456], t = -0.3, L = 245, kx = tip[0] + Math.sin(t) * L, ky = tip[1] + Math.cos(t) * L;
  thread(c, tip, [kx, ky]);
  balloonHang(c, kx, ky, t);
  ruler(c, 470, 842, 230, 0);
  person(c, 880, 1000, 560, { sit: true, dir: -1, reachL: [690, 842], armR: [Math.PI * 0.62, Math.PI * 0.42] });
  arrow(c, [[240, 800], [120, 800]]);
};
// e2: two pairs: rubbed 10 times, a small gap; rubbed 20 times, a bigger gap
const flowE2 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[-10, 30], [D + 10, 30], [D + 10, 90], [-10, 90]]), COL.wood);
  shape(c, () => polyP(c, [[-10, 90], [D + 10, 90], [D + 10, 140], [-10, 140]]), COL.woodDk);
  const pair = (x: number, t: number, kdx: number, n: string) => {
    for (const tx of [x - 12, x + 12]) shape(c, () => polyP(c, [[tx - 10, 128], [tx + 10, 128], [tx + 10, 170], [tx - 10, 170]]), TAPE, 3);
    const ka = [x - kdx, 450], kb = [x + kdx, 450];
    thread(c, [x - 12, 150], ka); thread(c, [x + 12, 150], kb);
    balloonHang(c, ka[0], ka[1], -t, BAL, BAL_DK, 88, 108); balloonHang(c, kb[0], kb[1], t, BAL2, BAL2_DK, 88, 108);
    line(c, [[ka[0], 395], [ka[0], 425]], 7, RED); line(c, [[kb[0], 395], [kb[0], 425]], 7, RED); line(c, [[ka[0], 410], [kb[0], 410]], 7, RED);
    write(c, n, x - 70, 820, 150, INK, 14);
  };
  pair(240, 0.14, 80, "10");
  pair(760, 0.38, 150, "20");
};
// a1: the foil ball that was pulled to the balloon now hangs pushed away from it
const flowA1 = (c: Ctx) => {
  ground(c);
  const tip = rigSlab(c, 330, 450);
  const t = -0.3, L = 390, bx = tip[0] + Math.sin(t) * L, by = tip[1] + Math.cos(t) * L;
  thread(c, tip, [bx, by]);
  foilBall(c, bx, by, 48);
  minus(c, bx - 2, by + 2, 20, INK);
  // the balloon, held by its knot, body pointing at the ball
  const cx = 600, cy = 470;
  shadow(c, cx + 14, cy + 90, 110, 24);
  shape(c, () => ell(c, cx, cy, 118, 92), BAL); shade(c, () => ell(c, cx, cy, 118, 92), BAL_DK, 30, 22);
  shape(c, () => polyP(c, [[cx + 114, cy - 10], [cx + 114, cy + 10], [cx + 140, cy + 16], [cx + 140, cy - 16]]), BAL, 5);
  shine(c, [[cx - 70, cy - 40], [cx - 20, cy - 60]], 10);
  for (const [mx, my] of [[cx - 50, cy - 10], [cx, cy + 30], [cx + 50, cy - 10]]) minus(c, mx, my, 24, WHITE);
  handFromRight(c, 830, cy, 1.3);
  arrow(c, [[bx - 60, by], [bx - 170, by]]);
};
// a2: a steel spoon, held in the hand, touches the charged foil ball; the charge runs along it into the hand
const flowA2 = (c: Ctx) => {
  ground(c);
  const tip = rigSlab(c, 330, 450);
  const bx = tip[0], by = tip[1] + 380;
  thread(c, tip, [bx, by]);
  foilBall(c, bx, by, 50);
  spoon(c, bx + 102, by, 350, 0);
  handFromRight(c, 920, by, 1.2);
  for (let i = 0; i < 4; i++) minus(c, bx + 170 + i * 48, by - 40, 18, INK);
  arrow(c, [[bx + 150, by - 80], [bx + 400, by - 80]], RED, 8);
};
// a3: the tape twins hang from the table edge and lean towards each other: one plus, one minus
const flowA3 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[-10, 30], [D + 10, 30], [D + 10, 110], [-10, 110]]), COL.wood);
  shape(c, () => polyP(c, [[-10, 110], [D + 10, 110], [D + 10, 170], [-10, 170]]), COL.woodDk);
  const strip = (x: number, lean: number, folded: number) => {
    const p = () => { c.moveTo(x - 32, 120); c.lineTo(x + 32, 120); c.quadraticCurveTo(x + 32 + lean * 0.3, 450, x + 32 + lean, 640); c.lineTo(x - 32 + lean, 640); c.quadraticCurveTo(x - 32 + lean * 0.3, 450, x - 32, 120); c.closePath(); };
    shape(c, p, "rgba(214,236,250,0.78)", 4);
    // the folded-over end makes a handle
    shape(c, () => polyP(c, [[x - 32 + lean, 640], [x + 32 + lean, 640], [x + 32 + lean + folded, 690], [x - 32 + lean + folded, 690]]), "rgba(190,220,245,0.9)", 4);
    shine(c, [[x - 14, 160], [x - 14 + lean * 0.3, 430]], 5);
  };
  strip(400, 70, 10); strip(680, -70, -10);
  plus(c, 400 + 12, 300, 34, INK); minus(c, 680 - 12, 300, 34, INK);
  arrow(c, [[462, 430], [512, 430]], RED, 9); arrow(c, [[618, 430], [568, 430]], RED, 9);
};
// p1: four new things in a row, beside the shawl and the bag: a plastic bangle, a cloth wad on a bottle, a thermocol plate, a rubber slipper
const flowP1 = (c: Ctx) => {
  ground(c, COL.wood);
  c.globalAlpha = 0.35; for (let y = 60; y < D; y += 90) line(c, [[0, y], [D, y]], 3, COL.woodDk); c.globalAlpha = 1;
  shawl(c, 120, 200, 360, 140); bag(c, 600, 230, 320, 110);
  // bangle
  shadow(c, 170, 760, 95, 22); shape(c, () => ell(c, 160, 720, 92, 92), COL.purple); shape(c, () => ell(c, 160, 720, 62, 62), COL.wood); shine(c, [[108, 672], [96, 710]], 8);
  // cloth wad on a bottle
  shadow(c, 390, 830, 50, 12);
  shape(c, () => rrect(c, 350, 640, 80, 190, 16), COL.glass, 5); shape(c, () => rrect(c, 368, 600, 44, 50, 6), COL.glass, 5);
  shape(c, () => { c.moveTo(340, 610); c.bezierCurveTo(330, 530, 400, 520, 420, 560); c.bezierCurveTo(470, 540, 470, 610, 430, 620); c.quadraticCurveTo(390, 640, 340, 610); c.closePath(); }, COL.cloth, 5);
  // thermocol plate
  shadow(c, 620, 790, 120, 26); shape(c, () => ell(c, 610, 740, 125, 70), WHITE, 5); shape(c, () => ell(c, 610, 735, 90, 46), "#f1efe8", 4);
  // rubber slipper (hawai chappal)
  shadow(c, 900, 840, 110, 18);
  shape(c, () => { c.moveTo(830, 620); c.bezierCurveTo(900, 590, 980, 600, 975, 680); c.bezierCurveTo(985, 760, 940, 840, 880, 840); c.bezierCurveTo(820, 840, 800, 760, 815, 700); c.bezierCurveTo(815, 660, 820, 640, 830, 620); c.closePath(); }, COL.blue);
  line(c, [[880, 660], [850, 740]], 12, WHITE); line(c, [[880, 660], [930, 740]], 12, WHITE); shape(c, () => ell(c, 880, 660, 12, 12), COL.blueDk, 4);
};

// ---------------------------------------------------------------- term cards
// term 6, repel: two balloons from one point, swung apart in a V
const termRepel = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 70, 22, 22), COL.steel, 5);
  const ka = [330, 480], kb = [750, 480];
  thread(c, [540, 90], ka); thread(c, [540, 90], kb);
  balloonHang(c, ka[0], ka[1], -0.5, BAL, BAL_DK, 100, 125); balloonHang(c, kb[0], kb[1], 0.5, BAL2, BAL2_DK, 100, 125);
  minus(c, 262, 610, 40, WHITE); minus(c, 818, 610, 40, WHITE);
  arrow(c, [[140, 600], [40, 600]]); arrow(c, [[940, 600], [1040, 600]]);
};
// term 8, conductor: a steel spoon, charge running along it into the hand that holds it
const termConductor = (c: Ctx) => {
  ground(c);
  c.save(); c.scale(1.6, 1.6); spoon(c, 150, 340, 365, 0); c.restore();
  handFromRight(c, 920, 544, 1.6);
  for (let i = 0; i < 5; i++) minus(c, 300 + i * 90, 500, 28, INK);
  arrow(c, [[330, 420], [760, 420]], RED, 10);
};
// term 10, earthing: a petrol tanker with a metal chain hanging down and touching the road
const termEarthing = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 820);
  shape(c, () => polyP(c, [[-10, 820], [D + 10, 820], [D + 10, 960], [-10, 960]]), COL.greyDk, 0);
  line(c, [[0, 820], [D, 820]], 5, INK);
  c.setLineDash([60, 40]); line(c, [[0, 890], [D, 890]], 8, COL.yellow); c.setLineDash([]);
  // chassis and wheels
  shape(c, () => polyP(c, [[120, 700], [980, 700], [980, 745], [120, 745]]), COL.black);
  for (const wx of [230, 400, 860]) { shape(c, () => ell(c, wx, 760, 62, 62), COL.black); shape(c, () => ell(c, wx, 760, 30, 30), COL.steel, 5); }
  // the tank
  shadow(c, 560, 712, 380, 20);
  shape(c, () => rrect(c, 110, 440, 620, 260, 110), COL.steel); shade(c, () => rrect(c, 110, 440, 620, 260, 110), COL.steelDk, 0, 110, 0.5);
  shape(c, () => rrect(c, 360, 404, 110, 44, 12), COL.steel, 5);
  shine(c, [[200, 490], [600, 490]], 10);
  // the cab
  shape(c, () => { c.moveTo(750, 700); c.lineTo(750, 460); c.quadraticCurveTo(750, 430, 780, 430); c.lineTo(900, 430); c.quadraticCurveTo(930, 430, 945, 470); c.lineTo(985, 580); c.quadraticCurveTo(990, 600, 990, 620); c.lineTo(990, 700); c.closePath(); }, COL.red);
  shape(c, () => polyP(c, [[905, 450], [935, 540], [885, 540], [885, 450]]), COL.sky, 5);
  shape(c, () => polyP(c, [[790, 450], [870, 450], [870, 540], [790, 540]]), COL.sky, 5);
  shape(c, () => rrect(c, 880, 610, 90, 40, 8), COL.steel, 4);
  // the chain, from the chassis rear down to the road, its last links lying on the road
  const links: number[][] = [];
  for (let i = 0; i < 4; i++) links.push([150 + i * 2, 762 + i * 22]);
  for (let i = 0; i < 3; i++) links.push([172 + i * 30, 836 - i * 3]);
  links.forEach(([lx, ly], i) => { c.beginPath(); ell(c, lx, ly, i < 4 ? 10 : 16, i < 4 ? 16 : 10); c.fillStyle = COL.steel; c.fill(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); });
  // the charge runs down the chain into the ground
  arrow(c, [[100, 640], [100, 840]], RED, 8);
};
// term 12, spark: a finger near a metal door handle, a bright zigzag between them
const termSpark = (c: Ctx) => {
  ground(c, COL.brown);
  shape(c, () => rrect(c, 80, 80, 920, 920, 16), "#b8803f", 6);
  shape(c, () => rrect(c, 150, 150, 780, 780, 10), COL.brown, 5);
  // the lever handle on a round rose, pointing left (the hinge is off to the left)
  shadow(c, 740, 600, 60, 16);
  shape(c, () => ell(c, 730, 540, 48, 48), COL.steel, 6); shade(c, () => ell(c, 730, 540, 48, 48), COL.steelDk, 14, 12);
  shape(c, () => rrect(c, 540, 516, 200, 48, 24), COL.steel, 6); shade(c, () => rrect(c, 540, 516, 200, 48, 24), COL.steelDk, 0, 18);
  shine(c, [[570, 528], [700, 528]], 7);
  // the hand with one finger out
  const wx = 230, wy = 560, s = 1.7;
  hand(c, wx, wy, 0, s);
  c.save(); c.translate(wx, wy); c.scale(s, s);
  shape(c, () => rrect(c, 34, -36, 92, 18, 9), SKIN.child, 5);
  c.restore();
  const fx = wx + 126 * s, fy = wy - 27 * s;
  // the spark, glow then zigzag
  c.globalAlpha = 0.35; shape(c, () => ell(c, (fx + 540) / 2, fy + 8, 90, 50), COL.yellow, 0); c.globalAlpha = 1;
  line(c, [[fx + 6, fy], [fx + 40, fy - 30], [fx + 70, fy + 24], [fx + 100, fy - 18], [540, 540]], 12, INK);
  line(c, [[fx + 6, fy], [fx + 40, fy - 30], [fx + 70, fy + 24], [fx + 100, fy - 18], [540, 540]], 6, COL.yellow);
};

export const ic_electricityStaticAndChargeL4 = cards("sci.electricity.static-and-charge.L4", [
  setupE1_0, setupE1_1, setupE1_2, setupE1_3, setupE1_4, setupE2_0, setupE2_1, setupE2_2,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowP1, termRepel, termConductor, termEarthing, termSpark,
]);
