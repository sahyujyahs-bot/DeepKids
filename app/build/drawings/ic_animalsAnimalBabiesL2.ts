import type { Ctx } from "./core";
import { INK, COL, SKIN, CLOTH, WHITE, RED, ground, shape, ell, rrect, polyP, shadow, line, arrow, hand, person, shade, write, cards } from "./flatKit";

const EGG = "#fff0b0", HEN = "#f7efe0", HENDK = "#d9cdb4", COW = "#f4ece0", COWDK = "#d8cab4", SPOT = "#8a5a3c", PINK = "#f29ab4";

// a chick, feet at (x, y), s = 1 is about 120 px tall; open = beak/mouth wide, facing right
const chick = (c: Ctx, x: number, y: number, s = 1, open = false) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 6, 4, 46, 9);
  line(c, [[-12, -22], [-14, 0]], 6); line(c, [[12, -22], [14, 0]], 6);
  shape(c, () => ell(c, 0, -52, 40, 34), COL.yellow);
  shade(c, () => ell(c, 0, -52, 40, 34), COL.orange, 10, 8, 0.35);
  shape(c, () => ell(c, 18, -92, 28, 26), COL.yellow);
  if (open) { shape(c, () => polyP(c, [[38, -104], [66, -122], [64, -92]]), COL.orange, 4); shape(c, () => polyP(c, [[38, -86], [64, -90], [60, -72]]), COL.orange, 4); }
  else shape(c, () => polyP(c, [[40, -94], [58, -88], [40, -82]]), COL.orange, 4);
  shape(c, () => ell(c, 22, -98, 4, 5), INK, 0);
  c.restore();
};
// a hen facing right, feet at (x, y); s = 1 is about 260 px tall; wings spread for brooding
const hen = (c: Ctx, x: number, y: number, s = 1, spread = false) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 10, 6, 130, 16);
  line(c, [[-14, -70], [-18, 0], [-4, 0]], 8, COL.orange); line(c, [[24, -70], [22, 0], [38, 0]], 8, COL.orange);
  shape(c, () => polyP(c, [[-110, -150], [-170, -230], [-140, -110]]), COL.brown, 6);
  shape(c, () => ell(c, 0, -120, 110, 80), HEN);
  shade(c, () => ell(c, 0, -120, 110, 80), HENDK, 14, 12, 0.6);
  shape(c, () => ell(c, 82, -200, 40, 44), HEN);
  shape(c, () => polyP(c, [[70, -240], [84, -272], [96, -240], [108, -268], [112, -232]]), RED, 5);
  shape(c, () => polyP(c, [[118, -204], [152, -194], [118, -186]]), COL.orange, 4);
  shape(c, () => ell(c, 84, -166, 12, 20), RED, 4);
  shape(c, () => ell(c, 92, -208, 5, 6), INK, 0);
  if (spread) shape(c, () => { c.moveTo(-70, -150); c.quadraticCurveTo(-140, -90, -120, -30); c.quadraticCurveTo(-40, -50, 30, -90); c.closePath(); }, COL.brown, 6);
  else shape(c, () => { c.moveTo(-60, -140); c.quadraticCurveTo(0, -170, 60, -120); c.quadraticCurveTo(10, -60, -70, -90); c.closePath(); }, "#e6d3ad", 5);
  c.restore();
};
// a nest: a woven bowl, centre of its rim at (x, y), rim half-width r; draw the back, then call front()
const nestBack = (c: Ctx, x: number, y: number, r: number) => { shadow(c, x + 10, y + r * 0.5, r * 1.05, r * 0.16); shape(c, () => ell(c, x, y, r, r * 0.28), COL.soilDk); };
const nestFront = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.9, y + r * 0.75, x + r * 0.9, y + r * 0.75, x + r, y); c.quadraticCurveTo(x, y + r * 0.3, x - r, y); c.closePath(); }, COL.brown, 6);
  for (let i = 0; i < 5; i++) line(c, [[x - r * 0.7 + i * r * 0.3, y + r * 0.3], [x - r * 0.5 + i * r * 0.3, y + r * 0.48]], 4, COL.soilDk);
};
// a chick head from the front with a wide open mouth, centre (x, y), r = head radius
const gapeHead = (c: Ctx, x: number, y: number, r: number, mouth: string = COL.red, edge: string = COL.yellow) => {
  shape(c, () => ell(c, x, y, r, r * 0.9), "#b9a27a");
  shape(c, () => ell(c, x, y + r * 0.25, r * 0.78, r * 0.62), edge, 5);
  shape(c, () => ell(c, x, y + r * 0.28, r * 0.6, r * 0.46), mouth, 4);
  shape(c, () => ell(c, x - r * 0.45, y - r * 0.3, r * 0.1, r * 0.13), INK, 0); shape(c, () => ell(c, x + r * 0.45, y - r * 0.3, r * 0.1, r * 0.13), INK, 0);
};
// a four-legged animal facing right, feet at (x, y); s = 1 is about 280 px long
const four = (c: Ctx, x: number, y: number, s: number, col: string, dk: string, o: { spots?: boolean; horns?: boolean; down?: boolean; ear?: string } = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 0, 6, 150, 18);
  for (const lx of [-90, -50, 50, 90]) shape(c, () => rrect(c, lx - 14, -110, 28, 112, 8), lx < 0 ? dk : col, 5);
  line(c, [[-125, -190], [-150, -130], [-142, -90]], 7);
  shape(c, () => rrect(c, -130, -210, 260, 110, 52), col);
  shade(c, () => rrect(c, -130, -210, 260, 110, 52), dk, 14, 14, 0.6);
  if (o.spots) { shape(c, () => ell(c, -50, -170, 28, 20, 0.3), SPOT, 0); shape(c, () => ell(c, 40, -135, 22, 16), SPOT, 0); }
  const hy = o.down ? -120 : -215;
  shape(c, () => ell(c, 135, hy, 50, 42, o.down ? 0.5 : 0), col);
  shape(c, () => ell(c, 168, hy + (o.down ? 20 : 12), 26, 22), PINK, 5);
  shape(c, () => ell(c, 112, hy - 40, 16, 26, -0.6), o.ear ?? dk, 5);
  if (o.horns) line(c, [[130, hy - 38], [124, hy - 70]], 9, WHITE);
  shape(c, () => ell(c, 140, hy - 8, 5, 6), INK, 0);
  c.restore();
};
const cat = (c: Ctx, x: number, y: number, s: number, open: boolean, grown = false) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 0, 4, 80, 12);
  line(c, [[-70, -30], [-110, -50], [-100, -90]], 12, COL.orange); 
  shape(c, () => ell(c, 0, -45, 70, 42), COL.orange); shade(c, () => ell(c, 0, -45, 70, 42), "#d27c25", 10, 8, 0.5);
  shape(c, () => ell(c, 62, -80, 38, 34), COL.orange);
  shape(c, () => polyP(c, [[38, -105], [44, -138], [64, -108]]), COL.orange, 5); shape(c, () => polyP(c, [[66, -108], [86, -134], [92, -100]]), COL.orange, 5);
  if (open) { shape(c, () => ell(c, 74, -84, 6, 8), INK, 0); shape(c, () => ell(c, 52, -84, 6, 8), INK, 0); } else { line(c, [[68, -84], [80, -84]], 4); line(c, [[46, -84], [58, -84]], 4); }
  shape(c, () => ell(c, 64, -70, 5, 4), PINK, 3);
  void grown; c.restore();
};
const mouse = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s); shadow(c, 0, 4, 60, 10);
  line(c, [[-50, -20], [-90, -30], [-100, -60]], 6, PINK);
  shape(c, () => ell(c, 0, -32, 52, 30), "#b9b4ab"); shape(c, () => ell(c, 50, -36, 26, 22), "#b9b4ab");
  shape(c, () => ell(c, 44, -58, 14, 14), PINK, 4); shape(c, () => ell(c, 62, -40, 3, 4), INK, 0); shape(c, () => ell(c, 76, -30, 5, 4), PINK, 3);
  c.restore();
};
// a human baby crawling, centre-bottom (x, y), facing right
const baby = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s); shadow(c, 0, 6, 100, 12);
  line(c, [[-50, -30], [-60, 0]], 18, INK); line(c, [[-50, -30], [-60, 0]], 8, SKIN.child);
  line(c, [[40, -34], [58, 0]], 18, INK); line(c, [[40, -34], [58, 0]], 8, SKIN.child);
  shape(c, () => ell(c, -5, -50, 62, 36), "#f29ab4");
  shape(c, () => ell(c, 64, -78, 34, 36), SKIN.child);
  shape(c, () => { c.moveTo(32, -80); c.bezierCurveTo(34, -122, 96, -122, 98, -82); c.quadraticCurveTo(66, -100, 32, -80); c.closePath(); }, CLOTH.hair, 4);
  shape(c, () => ell(c, 78, -80, 4, 5), INK, 0); c.beginPath(); c.arc(76, -68, 8, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
  c.restore();
};

// ---- flows
const e1 = (c: Ctx) => { // dark nest of four colours of mouth, a hand with a bean
  ground(c, "#4a4259");
  nestBack(c, 440, 700, 330);
  const cols = [COL.yellow, COL.orange, COL.brown, "#2b2340"];
  cols.forEach((col, i) => { const x = 230 + i * 150, y = 640 + (i % 2) * 20; shape(c, () => ell(c, x, y, 62, 74), col, 6); shape(c, () => ell(c, x, y + 4, 36, 44), "#3a1d1d", 0); });
  nestFront(c, 440, 700, 330);
  hand(c, 960, 230, Math.PI * 0.75, 2);
  shape(c, () => ell(c, 775, 400, 26, 18), COL.greenDk, 5);
  arrow(c, [[740, 430], [640, 520], [470, 600]]);
};
const a1 = (c: Ctx) => { // a line on the floor, calf at 'just born', chick, baby crawling far along
  ground(c);
  line(c, [[80, 760], [1000, 760]], 12, COL.greyDk);
  for (const x of [120, 380, 640, 900]) line(c, [[x, 730], [x, 790]], 8);
  four(c, 190, 740, 0.62, COW, COWDK, { spots: true, horns: false });
  chick(c, 520, 740, 1.2);
  baby(c, 810, 740, 1.2);
  arrow(c, [[120, 880], [900, 880]]);
  shape(c, () => ell(c, 120, 880, 14, 14), COL.green, 5);
};
const a2 = (c: Ctx) => { // a baby bottle of milk then a plate of rice: food changes
  ground(c);
  shadow(c, 300, 760, 120, 18);
  shape(c, () => rrect(c, 230, 440, 140, 320, 30), COL.glass.replace("0.55", "0.9"), 6);
  shape(c, () => rrect(c, 236, 560, 128, 196, 26), WHITE, 0);
  shape(c, () => rrect(c, 236, 440, 128, 0.1, 1), WHITE, 0);
  shape(c, () => { c.moveTo(250, 440); c.quadraticCurveTo(300, 330, 350, 440); c.closePath(); }, COL.pink, 6);
  shape(c, () => rrect(c, 240, 430, 120, 40, 12), COL.pink, 6);
  line(c, [[240, 560], [360, 560]], 5);
  arrow(c, [[430, 600], [610, 600]]);
  shadow(c, 820, 760, 190, 28);
  shape(c, () => { c.moveTo(640, 600); c.bezierCurveTo(660, 800, 980, 800, 1000, 600); c.closePath(); }, COL.steel);
  shape(c, () => ell(c, 820, 600, 180, 40), COL.steelIn, 5);
  shape(c, () => { c.moveTo(670, 600); c.quadraticCurveTo(820, 480, 970, 600); c.quadraticCurveTo(820, 640, 670, 600); c.closePath(); }, WHITE, 5);
  for (let i = 0; i < 12; i++) shape(c, () => ell(c, 710 + (i % 6) * 48, 585 + Math.floor(i / 6) * 14 - Math.sin((i % 6) / 5 * 3.1) * 40, 12, 6, 0.4), "#f4f1e4", 2);
};
const a3 = (c: Ctx) => { // child watching a nest where a parent bird brings food
  ground(c);
  line(c, [[1080, 300], [560, 400]], 26, COL.soilDk); line(c, [[1080, 300], [560, 400]], 14, COL.brown);
  nestBack(c, 760, 420, 180);
  [[690, 410], [760, 400], [830, 410]].forEach(([x, y]) => gapeHead(c, x, y, 38));
  nestFront(c, 760, 420, 180);
  // parent bird above with a worm
  shape(c, () => ell(c, 900, 190, 70, 44), COL.brown); shape(c, () => ell(c, 840, 160, 34, 30), COL.brown);
  shape(c, () => polyP(c, [[810, 150], [760, 172], [812, 178]]), COL.orange, 4);
  shape(c, () => ell(c, 836, 152, 5, 6), INK, 0);
  line(c, [[770, 176], [760, 230], [785, 260]], 8, COL.pink);
  shape(c, () => polyP(c, [[940, 170], [1040, 110], [1000, 200]]), "#7d5a3a", 5);
  person(c, 260, 900, 560, {});
  arrow(c, [[420, 560], [520, 480]]);
};
const a4 = (c: Ctx) => { // mouse, hen, cow, child in order, arrow along
  ground(c);
  mouse(c, 140, 640, 1.2);
  chick(c, 330, 640, 1.5);
  four(c, 610, 640, 0.65, COW, COWDK, { spots: true, horns: true });
  person(c, 930, 640, 360, {});
  arrow(c, [[100, 800], [980, 800]]);
  shape(c, () => ell(c, 100, 800, 14, 14), COL.green, 5);
};
const p1 = (c: Ctx) => { // tally marks, two colours, a pencil
  ground(c);
  shadow(c, 560, 880, 400, 30);
  shape(c, () => rrect(c, 160, 160, 760, 700, 20), COL.paper);
  const tally = (x: number, y: number, n: number, col: string) => { for (let i = 0; i < n; i++) { const g = Math.floor(i / 5), k = i % 5; if (k < 4) line(c, [[x + g * 190 + k * 34, y], [x + g * 190 + k * 34, y + 90]], 9, col); else line(c, [[x + g * 190 - 10, y + 80], [x + g * 190 + 126, y + 10]], 9, col); } };
  tally(300, 250, 9, INK); tally(300, 470, 6, COL.blue);
  shape(c, () => ell(c, 230, 295, 34, 34), SKIN.adult); shape(c, () => ell(c, 230, 500, 30, 30), SKIN.child);
  shape(c, () => { c.moveTo(196, 262); c.bezierCurveTo(200, 230, 260, 230, 264, 262); c.quadraticCurveTo(230, 250, 196, 262); c.closePath(); }, CLOTH.hair, 4);
  shape(c, () => { c.moveTo(202, 472); c.bezierCurveTo(206, 446, 254, 446, 258, 472); c.quadraticCurveTo(230, 462, 202, 472); c.closePath(); }, CLOTH.hair, 4);
  arrow(c, [[300, 380], [300, 440]], INK, 7);
  line(c, [[640, 780], [900, 660]], 28, INK); line(c, [[640, 780], [900, 660]], 16, COL.yellow);
  shape(c, () => polyP(c, [[640, 780], [610, 796], [630, 750]]), "#f2c063", 4);
};
const c1 = (c: Ctx) => { // a dark nest, a glowing wide mouth easy to see
  ground(c); shape(c, () => rrect(c, 120, 200, 840, 680, 50), "#3b3350");
  shape(c, () => ell(c, 300, 600, 90, 100), "#2b2340", 5); shape(c, () => ell(c, 780, 600, 90, 100), COL.brown, 5);
  shape(c, () => ell(c, 540, 560, 170, 190), COL.yellow, 6); shape(c, () => ell(c, 540, 580, 110, 130), "#c9372b", 5);
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + 0.2; line(c, [[540 + Math.cos(a) * 215, 560 + Math.sin(a) * 235], [540 + Math.cos(a) * 275, 560 + Math.sin(a) * 300]], 9, COL.yellow); }
};

// ---- terms
const t0 = (c: Ctx) => { ground(c); hen(c, 360, 840, 1.55); chick(c, 740, 850, 1.3); chick(c, 880, 880, 1.1); chick(c, 640, 900, 1.05); };
const t1 = (c: Ctx) => { // a kitten grows into a cat
  ground(c);
  cat(c, 130, 700, 0.8, false); cat(c, 350, 700, 1.0, true); cat(c, 600, 720, 1.3, true); cat(c, 870, 760, 1.6, true);
  arrow(c, [[90, 880], [980, 880]]);
};
const t2 = (c: Ctx) => { // a cow licks her calf
  ground(c);
  four(c, 330, 820, 1.15, COW, COWDK, { spots: true, horns: true, down: true });
  four(c, 680, 840, 0.7, COW, COWDK, {});
};
const t3 = (c: Ctx) => { // three chicks beg, parent above
  ground(c);
  nestBack(c, 540, 760, 330);
  [[380, 720], [540, 690], [700, 720]].forEach(([x, y]) => gapeHead(c, x, y, 72));
  nestFront(c, 540, 760, 330);
  shape(c, () => ell(c, 560, 250, 120, 74), COL.brown); shape(c, () => ell(c, 450, 210, 52, 46), COL.brown);
  shape(c, () => polyP(c, [[408, 200], [335, 224], [410, 238]]), COL.orange, 4); shape(c, () => ell(c, 442, 200, 7, 8), INK, 0);
  line(c, [[345, 230], [340, 340], [370, 410]], 10, COL.pink);
  shape(c, () => polyP(c, [[650, 250], [820, 180], [740, 300]]), "#7d5a3a", 5);
};
const t4 = (c: Ctx) => { ground(c); gapeHead(c, 540, 520, 300, COL.red, COL.yellow); };
const t5 = (c: Ctx) => { // hen with chick heads under her wing
  ground(c);
  hen(c, 500, 800, 1.7, true);
  [[420, 700], [500, 720], [330, 720]].forEach(([x, y]) => { shape(c, () => ell(c, x, y, 28, 26), COL.yellow); shape(c, () => ell(c, x + 5, y - 2, 4, 5), INK, 0); shape(c, () => polyP(c, [[x + 24, y], [x + 38, y + 6], [x + 22, y + 10]]), COL.orange, 3); });
};
const t6 = (c: Ctx) => { // goat with kid, mother with baby: both mammals feeding young
  ground(c);
  four(c, 280, 560, 1.0, "#cdb48a", "#a8895c", { horns: true });
  four(c, 520, 600, 0.5, "#cdb48a", "#a8895c", {});
  person(c, 760, 960, 480, { adult: true, armL: [Math.PI * 0.5, 0], armR: [Math.PI * 0.4, Math.PI] });
  shape(c, () => ell(c, 770, 700, 46, 38), "#f29ab4"); shape(c, () => ell(c, 760, 650, 28, 28), SKIN.child);
};
// ---- explanations
const x0 = (c: Ctx) => { ground(c); chick(c, 200, 800, 2.2); hen(c, 800, 860, 1.7); arrow(c, [[400, 600], [460, 600]]); };
const x3 = (c: Ctx) => { ground(c); baby(c, 260, 800, 1.7); for (const r of [50, 80, 110]) { c.beginPath(); c.arc(330, 640, r, -1.2, -0.2); c.strokeStyle = RED; c.lineWidth = 9; c.lineCap = "round"; c.stroke(); } person(c, 800, 900, 600, { adult: true }); arrow(c, [[620, 640], [480, 700]]); };


export const ic_animalsAnimalBabiesL2 = cards("sci.animals.animal-babies.L2 cards", [e1, a1, a2, a3, a4, p1, c1, t0, t1, t2, t3, t4, t5, t6, x0, x3]);
