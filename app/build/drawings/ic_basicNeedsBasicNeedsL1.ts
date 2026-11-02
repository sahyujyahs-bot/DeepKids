import type { Ctx } from "./core";
import { D, INK, BG, WHITE, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, person, hand, cards } from "./flatKit";

// BASIC NEEDS L1 · set-up cards for the wind box, then cards for the activities, project and terms.

// a steel tumbler of rice with a pencil standing in it and a tissue flag taped to the top.
// bottom centre of the tumbler at (x, y); s = scale (1 = full card size); bend 0 = flag hangs still,
// 1 = flag streams flat in direction dir (1 right, -1 left)
const flagStand = (c: Ctx, x: number, y: number, s: number, bend: number, dir = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 20, 8, 150, 26);
  const body = () => { c.moveTo(-120, -270); c.lineTo(120, -270); c.lineTo(100, 0); c.lineTo(-100, 0); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, 70, 0);
  // the pencil: yellow, with a band near the top
  shape(c, () => rrect(c, -14, -660, 28, 420, 4), COL.yellow, 5);
  c.fillStyle = COL.pink; c.fillRect(-14, -660, 28, 26); c.fillStyle = COL.steelDk; c.fillRect(-14, -634, 28, 10);
  // rice heaped at the rim
  shape(c, () => ell(c, 0, -270, 120, 26), COL.paper, 5);
  const r = (i: number) => ((i * 7919) % 97) / 97;
  for (let i = 0; i < 40; i++) shape(c, () => ell(c, -100 + r(i) * 200, -274 + r(i + 3) * 24, 7, 4, r(i + 5) * 3), WHITE, 2);
  // tape round the pencil top, then the tissue strip
  shape(c, () => rrect(c, -22, -650, 44, 22, 4), "rgba(255,255,255,0.8)", 3);
  const L = 230, w = 44;
  if (bend < 0.5) {
    shape(c, () => { c.moveTo(14, -648); c.lineTo(14 + w, -648); c.quadraticCurveTo(14 + w + 14, -648 + L * 0.5, 14 + w - 8, -648 + L); c.lineTo(14 - 6, -648 + L); c.quadraticCurveTo(14 + 14, -648 + L * 0.5, 14, -648); c.closePath(); }, COL.cloth, 5);
  } else {
    shape(c, () => { c.moveTo(dir * 14, -650); c.quadraticCurveTo(dir * (14 + L * 0.5), -690, dir * (14 + L), -660); c.lineTo(dir * (14 + L), -660 + w); c.quadraticCurveTo(dir * (14 + L * 0.5), -690 + w + 8, dir * 14, -650 + w); c.closePath(); }, COL.cloth, 5);
  }
  c.restore();
};

// a table fan: its base centre at (x, y), grille radius r, blowing in direction dir (1 right, -1 left)
const fan = (c: Ctx, x: number, y: number, r: number, dir: number) => {
  shadow(c, x + r * 0.2, y + 6, r * 0.9, r * 0.18);
  shape(c, () => ell(c, x, y, r * 0.8, r * 0.16), COL.tealDk);
  shape(c, () => rrect(c, x - r * 0.12, y - r * 1.9, r * 0.24, r * 1.9, 8), COL.teal);
  // the motor behind the grille, on the side away from the wind
  shape(c, () => rrect(c, x - dir * r * 0.9 - r * 0.3, y - r * 2.6, r * 0.6, r * 0.5, 10), COL.tealDk);
  const cx = x, cy = y - r * 2.4;
  shape(c, () => ell(c, cx, cy, r, r), COL.sky);
  for (let k = 0; k < 3; k++) { const a = (k * Math.PI * 2) / 3 + 0.4; shape(c, () => ell(c, cx + Math.cos(a) * r * 0.5, cy + Math.sin(a) * r * 0.5, r * 0.48, r * 0.22, a), COL.steel, 4); }
  c.save(); c.beginPath(); ell(c, cx, cy, r, r); c.clip();
  c.strokeStyle = INK; c.lineWidth = 3; c.globalAlpha = 0.6;
  for (let k = 1; k < 5; k++) { c.beginPath(); ell(c, cx, cy, r * k * 0.22, r * k * 0.22); c.stroke(); }
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 8; c.beginPath(); c.moveTo(cx - Math.cos(a) * r, cy - Math.sin(a) * r); c.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); c.stroke(); }
  c.globalAlpha = 1; c.restore();
  shape(c, () => ell(c, cx, cy, r, r), "rgba(0,0,0,0)", 7);
  shape(c, () => ell(c, cx, cy, r * 0.16, r * 0.16), COL.teal, 5);
};

// a cardboard carton lying on its side: front-bottom-left corner at (x, y), width w, height h, depth d.
// dir = -1 shows its left end, 1 its right end; that end is open. through = the far end is open too
// (light shows). inside = draws the flag inside the open end
const carton = (c: Ctx, x: number, y: number, w: number, h: number, d: number, dir: number, through: boolean, bend: number, taped: boolean) => {
  const vx = dir * d * 0.55, vy = -d * 0.55;
  shadow(c, x + w / 2 + 30, y + 10, w * 0.6, 30);
  const ex = dir < 0 ? x : x + w;
  const endFace = () => polyP(c, [[ex, y], [ex, y - h], [ex + vx, y - h + vy], [ex + vx, y + vy]]);
  shape(c, () => rrect(c, x, y - h, w, h, 3), COL.brown);
  shade(c, () => rrect(c, x, y - h, w, h, 3), COL.soilDk, 0, h * 0.5, 0.25);
  shape(c, () => polyP(c, [[x, y - h], [x + w, y - h], [x + w + vx, y - h + vy], [x + vx, y - h + vy]]), COL.wood);
  shade(c, () => polyP(c, [[x, y - h], [x + w, y - h], [x + w + vx, y - h + vy], [x + vx, y - h + vy]]), COL.woodDk, 0, 0, 0.0);
  // the open end: dark inside
  shape(c, endFace, COL.soilDk);
  c.save(); c.beginPath(); endFace(); c.clip();
  if (through) shape(c, () => polyP(c, [[ex + vx * 0.3, y - h * 0.15 + vy * 0.3], [ex + vx * 0.3, y - h * 0.85 + vy * 0.3], [ex + vx * 0.7, y - h * 0.85 + vy * 0.7], [ex + vx * 0.7, y - h * 0.15 + vy * 0.7]]), BG, 4);
  flagStand(c, ex + vx * 0.5, y + vy * 0.5 - 6, h / 1000, bend, -dir);
  c.restore();
  // tape across the top edge of the far end, where it is closed
  if (taped) { const tx = dir < 0 ? x + w : x; line(c, [[tx + vx * 0.1, y - h + vy * 0.1 + 10], [tx + vx * 0.95, y - h + vy * 0.95 + 10]], 16, COL.grey); line(c, [[tx + vx * 0.1, y - h + vy * 0.1 + 10], [tx + vx * 0.95, y - h + vy * 0.95 + 10]], 8, COL.paper); }
};

// a wavy wind arrow from (x0,y) to (x1,y)
const gust = (c: Ctx, x0: number, x1: number, y: number) => arrow(c, [[x0, y], [(x0 * 3 + x1) / 4, y - 18], [(x0 + x1) / 2, y], [(x0 + x1 * 3) / 4, y + 18], [x1, y]]);

// 0 · setup.e1.0: the tissue flag on a pencil in a tumbler of rice
const setup0 = (c: Ctx) => { ground(c); line(c, [[0, 900], [D, 900]], 5); flagStand(c, 500, 900, 1.15, 0); };

// 1 · setup.e1.1: the carton as a tunnel, both ends open, the fan blowing straight through
const setup1 = (c: Ctx) => {
  ground(c); line(c, [[0, 880], [D, 880]], 5);
  fan(c, 170, 870, 95, 1);
  carton(c, 470, 880, 500, 300, 320, -1, true, 1, false);
  for (const yy of [560, 640, 720]) gust(c, 280, 560, yy);
  gust(c, 1000, 1070, 640);
};

// 2 · setup.e1.2: back end taped shut, door turned away from the fan, the flag hangs still
const setup2 = (c: Ctx) => {
  ground(c); line(c, [[0, 880], [D, 880]], 5);
  fan(c, 150, 870, 95, 1);
  carton(c, 300, 880, 440, 300, 320, 1, false, 0, true);
  for (const yy of [600, 680, 760]) gust(c, 260, 330, yy);
  arrow(c, [[300, 540], [420, 440], [700, 400], [900, 440]]);
};

// 3 · flow.e1: the door facing the fan: the flag inside blows flat
const flowE1 = (c: Ctx) => {
  ground(c); line(c, [[0, 880], [D, 880]], 5);
  fan(c, 160, 870, 95, 1);
  carton(c, 470, 880, 460, 300, 320, -1, false, 1, true);
  for (const yy of [580, 660, 740]) gust(c, 270, 500, yy);
};

// 4 · flow.a1: the child sits cross-legged, one hand up with five fingers spread, a slow breath
const flowA1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 930, 320, 40);
  const h = 820, x = 480, y = 920;
  person(c, x, y, h, { sit: true, armL: [Math.PI * 0.6, Math.PI * 0.35], armR: [-Math.PI * 0.3, -Math.PI * 0.5] });
  // the raised hand, open, fingers up
  const hip = y - h * 0.06, sh = hip - h * 0.32, sx = x + h * 0.11, sy = sh + h * 0.03;
  const ex = sx + Math.cos(-Math.PI * 0.3) * h * 0.17, ey = sy + Math.sin(-Math.PI * 0.3) * h * 0.17, wx = ex, wy = ey - h * 0.16;
  hand(c, wx, wy + 10, -Math.PI / 2, 1.1, SKIN.child, CLOTH.child, true);
  // the breath: a soft arrow into the nose
  arrow(c, [[200, 330], [300, 300], [400, 330]], COL.blue, 9);
};

// 5 · flow.a2: walking round the room with the flag under the ceiling fan; behind the sofa it hangs still
const flowA2 = (c: Ctx) => {
  ground(c); c.fillStyle = COL.sky; c.fillRect(0, 0, D, 130); line(c, [[0, 130], [D, 130]], 5); line(c, [[0, 880], [D, 880]], 5);
  // ceiling fan
  shape(c, () => rrect(c, 520, 120, 40, 90, 6), COL.steelDk);
  for (const s of [-1, 1]) shape(c, () => ell(c, 540 + s * 190, 225, 180, 26), COL.brown, 5);
  shape(c, () => ell(c, 540, 225, 60, 34), COL.steel, 5);
  // sofa on the right
  shape(c, () => rrect(c, 700, 560, 360, 320, 30), COL.purple); shade(c, () => rrect(c, 700, 560, 360, 320, 30), "#5e4790", 0, 180, 0.35);
  shape(c, () => rrect(c, 680, 700, 60, 180, 20), COL.purple); shape(c, () => rrect(c, 1020, 700, 60, 180, 20), COL.purple);
  // the still flag behind the sofa, a paper star on the floor
  flagStand(c, 870, 560, 0.45, 0);
  shape(c, () => { for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, r = k % 2 ? 16 : 38; c.lineTo(820 + Math.cos(a) * r, 905 + Math.sin(a) * r * 0.5); } c.closePath(); }, COL.yellow, 4);
  // the child walks, flag held up and streaming in the fan's breeze
  shadow(c, 360, 890, 150, 24);
  person(c, 330, 880, 560, { armL: [Math.PI * 0.6, Math.PI * 0.5], armR: [-Math.PI * 0.35, -Math.PI * 0.5] });
  flagStand(c, 500, 575, 0.42, 1);
  arrow(c, [[540, 290], [560, 360], [540, 430]], COL.blue, 8);
  arrow(c, [[200, 940], [300, 940]]);
};

// 6 · flow.a3: parent and child look at baby photos on a phone
const flowA3 = (c: Ctx) => {
  ground(c); line(c, [[0, 900], [D, 900]], 5);
  shadow(c, 560, 910, 400, 36);
  person(c, 380, 900, 740, { adult: true, armL: [Math.PI * 0.55, Math.PI * 0.4], armR: [Math.PI * 0.2, -Math.PI * 0.35] });
  person(c, 720, 900, 560, { armL: [Math.PI * 0.7, -Math.PI * 0.6], armR: [Math.PI * 0.5, Math.PI * 0.5] });
  // the phone, held between them, a baby photo on the screen
  shape(c, () => rrect(c, 470, 420, 190, 330, 24), COL.black);
  shape(c, () => rrect(c, 486, 450, 158, 270, 8), COL.sky, 3);
  shape(c, () => ell(c, 565, 580, 50, 54), SKIN.child, 4);
  shape(c, () => ell(c, 565, 535, 32, 14), CLOTH.hair, 0);
  shape(c, () => ell(c, 548, 580, 4, 5), INK, 0); shape(c, () => ell(c, 582, 580, 4, 5), INK, 0);
  c.beginPath(); c.arc(565, 596, 12, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
  shape(c, () => rrect(c, 505, 650, 120, 60, 20), COL.pink, 3);
};

// 7 · flow.p1: the bedsheet tent over two chairs, the child inside with water, snacks and a shawl
const flowP1 = (c: Ctx) => {
  ground(c); line(c, [[0, 900], [D, 900]], 5);
  shadow(c, 480, 915, 420, 36);
  // chair legs showing under the sheet
  for (const lx of [150, 230, 720, 800]) line(c, [[lx, 900], [lx, 760]], 14, COL.woodDk);
  // the sheet: a wide tent with the open side facing us
  const sheet = () => { c.moveTo(60, 900); c.lineTo(470, 300); c.lineTo(880, 900); c.closePath(); };
  shape(c, sheet, COL.cloth); shade(c, sheet, "#ded5c0", 220, 0, 0.5);
  shape(c, () => { c.moveTo(220, 900); c.lineTo(470, 440); c.lineTo(720, 900); c.closePath(); }, "#7a6a96", 5);
  // child sitting inside
  person(c, 470, 880, 440, { sit: true, armL: [Math.PI * 0.7, Math.PI * 0.3], armR: [Math.PI * 0.3, Math.PI * 0.7] });
  // water bottle, a plate of snacks, a folded shawl
  shape(c, () => rrect(c, 300, 760, 60, 140, 14), COL.water, 5); shape(c, () => rrect(c, 312, 740, 36, 30, 6), COL.blueDk, 4);
  shape(c, () => ell(c, 640, 880, 70, 22), COL.steel, 5); for (let k = 0; k < 4; k++) shape(c, () => ell(c, 610 + k * 20, 870, 16, 10), COL.orange, 3);
  shape(c, () => rrect(c, 540, 820, 110, 60, 12), COL.red, 5);
  // the fan is on the right, its wind passes the closed back
  fan(c, 980, 890, 70, -1);
  for (const yy of [640, 700]) gust(c, 900, 830, yy);
};

// 8 · term.1 Shelter: a house keeps out sun, rain and wind; the child stands dry in the doorway
const term1 = (c: Ctx) => {
  ground(c); c.fillStyle = COL.sky; c.fillRect(0, 0, D, 880); line(c, [[0, 880], [D, 880]], 5);
  shape(c, () => ell(c, 150, 150, 90, 90), COL.yellow);
  // rain cloud and rain
  shape(c, () => { c.moveTo(620, 200); c.arc(700, 190, 70, Math.PI, 0); c.arc(820, 180, 80, Math.PI, 0); c.arc(930, 200, 60, Math.PI, 0); c.lineTo(990, 240); c.lineTo(620, 240); c.closePath(); }, COL.steelIn);
  for (let k = 0; k < 7; k++) line(c, [[650 + k * 52, 280], [640 + k * 52, 330]], 7, COL.blueDk);
  // the house
  shadow(c, 560, 895, 380, 30);
  shape(c, () => rrect(c, 260, 520, 600, 360, 6), COL.paper); shade(c, () => rrect(c, 260, 520, 600, 360, 6), COL.grey, 380, 0, 0.3);
  shape(c, () => polyP(c, [[200, 530], [560, 300], [920, 530]]), COL.red); shade(c, () => polyP(c, [[200, 530], [560, 300], [920, 530]]), "#b53c2a", 360, 0, 0.35);
  shape(c, () => rrect(c, 330, 600, 120, 120, 8), COL.sky, 5); line(c, [[390, 600], [390, 720]], 4); line(c, [[330, 660], [450, 660]], 4);
  shape(c, () => rrect(c, 640, 600, 120, 120, 8), COL.sky, 5); line(c, [[700, 600], [700, 720]], 4); line(c, [[640, 660], [760, 660]], 4);
  shape(c, () => rrect(c, 480, 640, 160, 240, 10), COL.soilDk, 6);
  person(c, 560, 870, 220, {});
  // wind arrows stopped by the wall
  for (const yy of [700, 780]) gust(c, 40, 230, yy);
};

// 9 · term.2 Wind: air that moves; the tree bends and leaves fly
const term2 = (c: Ctx) => {
  ground(c); c.fillStyle = COL.sky; c.fillRect(0, 0, D, 880); line(c, [[0, 880], [D, 880]], 5);
  shadow(c, 560, 895, 300, 30);
  const trunk = () => { c.moveTo(440, 880); c.quadraticCurveTo(470, 600, 640, 420); c.lineTo(700, 450); c.quadraticCurveTo(560, 640, 560, 880); c.closePath(); };
  shape(c, trunk, COL.brown); shade(c, trunk, COL.soilDk, 40, 0, 0.4);
  const crown = () => { c.moveTo(560, 470); c.bezierCurveTo(520, 300, 700, 180, 820, 260); c.bezierCurveTo(940, 220, 1000, 380, 920, 440); c.bezierCurveTo(960, 540, 780, 580, 700, 520); c.bezierCurveTo(620, 580, 520, 540, 560, 470); c.closePath(); };
  shape(c, crown, COL.green); shade(c, crown, COL.greenDk, 60, 40, 0.4);
  const lf = (x: number, y: number, a: number) => shape(c, () => ell(c, x, y, 26, 13, a), COL.greenLt, 4);
  lf(880, 560, 0.4); lf(960, 500, -0.3); lf(1010, 620, 0.9); lf(920, 680, 0.2); lf(1030, 740, -0.5);
  for (const yy of [300, 420, 540, 700]) gust(c, 60, 360, yy);
};

// 10 · expl.3: a wall makes calm air behind it; the flag in front blows, the flag behind hangs still
const expl3 = (c: Ctx) => {
  ground(c); line(c, [[0, 880], [D, 880]], 5);
  fan(c, 130, 870, 80, 1);
  // the brick wall
  shadow(c, 560, 895, 160, 26);
  shape(c, () => rrect(c, 480, 420, 120, 460, 4), COL.orange);
  c.strokeStyle = INK; c.lineWidth = 3; c.globalAlpha = 0.5;
  for (let yy = 470; yy < 880; yy += 50) { c.beginPath(); c.moveTo(480, yy); c.lineTo(600, yy); c.stroke(); }
  c.globalAlpha = 1;
  flagStand(c, 350, 880, 0.55, 1);
  flagStand(c, 780, 880, 0.55, 0);
  for (const yy of [560, 660, 760]) gust(c, 230, 310, yy);
  arrow(c, [[420, 480], [520, 340], [700, 330], [860, 420]]);
};

export const ic_basicNeedsBasicNeedsL1 = cards("sci.basic-needs.basic-needs.L1", [setup0, setup1, setup2, flowE1, flowA1, flowA2, flowA3, flowP1, term1, term2, expl3]);
