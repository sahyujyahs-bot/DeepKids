import type { Ctx } from "./core";
import { COL, INK, RED, SKIN, CLOTH, WHITE, arrow, cards, ell, ground, hand, line, plate, polyP, rrect, shade, shadow, shape, shine } from "./flatKit";

// ANIMAL BODIES L2 · picture cards. Flat DeepKids look. Animals and the child seen from the side, facing right.
// Red = arrows and rings. No words.

const FROG = "#6aa53f", FROG_DK = "#46752a", BEAKC = "#f3b13c", TROUSER = "#6b5a8c", FLOOR = "#e3cfa6", WALL = "#f6efe0";
const BONE = "#f6efdc", TOOTH = "#fffdf4", TOOTHDK = "#e3dcc4", TOOTHBLUE = "#9cc7ff", GUM = "#f08aa0", MOUTH = "#8c2f3f";

const eye = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), WHITE, 3); shape(c, () => ell(c, x + r * 0.2, y, r * 0.5, r * 0.5), INK, 0); };
const ring = (c: Ctx, x: number, y: number, r: number) => { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.strokeStyle = RED; c.lineWidth = 9; c.stroke(); };
const lg = (c: Ctx, pts: number[][], col: string, w = 14) => { line(c, pts, w + 8, INK); line(c, pts, w, col); };
const floor = (c: Ctx, y: number) => { ground(c, WALL); c.fillStyle = FLOOR; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 6); };

// the child from the side, facing right, feet at (x, y). sa = how far the shin leans forward, ta = how far the thigh
// leans back from the knee (0 = standing straight), lean = how far the body leans forward. bend: arms swing back.
const kid = (c: Ctx, x: number, y: number, h: number, sa: number, ta: number, lean: number, armBack = true) => {
  const S = h * 0.26, T = h * 0.27, Tr = h * 0.3, ank = [x, y - 12];
  const knee = [ank[0] + Math.sin(sa) * S, ank[1] - Math.cos(sa) * S];
  const hip = [knee[0] - Math.sin(ta) * T, knee[1] - Math.cos(ta) * T];
  const sh = [hip[0] + Math.sin(lean) * Tr, hip[1] - Math.cos(lean) * Tr];
  shadow(c, x + 10, y + 2, h * 0.28, 9);
  lg(c, [ank, [x + 40, y - 10]], INK, 16); shape(c, () => rrect(c, x - 16, y - 24, 66, 24, 12), WHITE, 5);
  lg(c, [ank, knee, hip], TROUSER, h * 0.075);
  const back = armBack ? [sh[0] - h * 0.2, sh[1] + h * 0.12] : [sh[0] + h * 0.18, sh[1] + h * 0.14];
  lg(c, [hip, sh], CLOTH.child, h * 0.17);
  lg(c, [[sh[0], sh[1] + 8], back], CLOTH.child, h * 0.06); shape(c, () => ell(c, back[0], back[1], h * 0.04, h * 0.04), SKIN.child, 4);
  const hd = [sh[0] + Math.sin(lean) * h * 0.1, sh[1] - Math.cos(lean) * h * 0.13], r = h * 0.1;
  shape(c, () => ell(c, hd[0], hd[1], r, r * 1.05), SKIN.child);
  shape(c, () => { c.moveTo(hd[0] - r, hd[1] + 2); c.bezierCurveTo(hd[0] - r, hd[1] - r * 1.7, hd[0] + r * 0.9, hd[1] - r * 1.6, hd[0] + r * 0.9, hd[1] - r * 0.3); c.quadraticCurveTo(hd[0], hd[1] - r * 0.5, hd[0] - r, hd[1] + 2); c.closePath(); }, CLOTH.hair, 4);
  shape(c, () => ell(c, hd[0] - r * 0.95, hd[1] + r * 0.2, r * 0.4, r * 0.55), CLOTH.hair, 4);
  shape(c, () => ell(c, hd[0] + r * 0.5, hd[1] + 0.1 * r, r * 0.13, r * 0.17), INK, 0);
  line(c, [[hd[0] + r * 0.2, hd[1] + r * 0.55], [hd[0] + r * 0.6, hd[1] + r * 0.5]], 4);
  return { ank, knee, hip, sh };
};


// a lizard from above with wide skin flaps along its sides, nose right; paper = a paper cut-out, else the real colours
const lizardTop = (c: Ctx, x: number, y: number, s: number, rot: number, paper: boolean) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const body = paper ? "#fffaf0" : "#c9a36b", flap = paper ? "#e6dcc3" : "#e8a64a", rib = paper ? "#b9b4ab" : "#a8723f";
  for (const k of [-1, 1]) { shape(c, () => ell(c, 10, k * 105, 105, 85, k * 0.25), flap, 6); for (const a of [-0.9, -0.3, 0.3, 0.9]) line(c, [[10, k * 40], [10 + a * 100, k * 150]], 4, rib); }
  shape(c, () => { c.moveTo(-60, -26); c.quadraticCurveTo(-200, -20, -330, 30); c.quadraticCurveTo(-200, 14, -60, 26); c.closePath(); }, body, 6);
  shape(c, () => ell(c, 20, 0, 120, 30), body, 6);
  shape(c, () => ell(c, 170, 0, 56, 30), body, 6);
  shape(c, () => ell(c, 190, -12, 8, 8), INK, 0); shape(c, () => ell(c, 190, 12, 8, 8), INK, 0);
  c.restore();
};

// ---------------------------------------------------------------- frog and grasshopper
// frog on the ground, folded legs, facing right; feet at ground level y
const frogSit = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 10, 0, 170, 14);
  const body = () => ell(c, 0, -62, 110, 62, -0.12);
  lg(c, [[110, -20], [140, -4]], FROG, 16); line(c, [[140, -4], [175, -4]], 10);
  shape(c, body, FROG); shade(c, body, FROG_DK, 14, 14);
  // folded back leg: thigh forward, shin back, long foot flat
  lg(c, [[-40, -78], [-10, -22], [-120, -14]], FROG, 40); line(c, [[-120, -10], [-200, -6]], 12); line(c, [[-120, -10], [-190, 8]], 10);
  shape(c, () => ell(c, 82, -96, 56, 42, -0.15), FROG); shade(c, () => ell(c, 82, -96, 56, 42, -0.15), FROG_DK, 8, 8);
  shape(c, () => ell(c, 92, -130, 22, 22), FROG); eye(c, 96, -132, 13);
  line(c, [[132, -84], [98, -76]], 4);
  c.restore();
};
// frog in the air, long back legs straight out behind, front legs forward; rot tilts it nose-up
const frogAir = (c: Ctx, x: number, y: number, s: number, rot = -0.45) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  lg(c, [[-60, 10], [-170, 50], [-290, 80]], FROG, 40); line(c, [[-290, 80], [-350, 70]], 12); line(c, [[-290, 80], [-345, 100]], 12); line(c, [[-290, 80], [-340, 130]], 12);
  const body = () => ell(c, 0, 0, 105, 54);
  shape(c, body, FROG); shade(c, body, FROG_DK, 12, 12);
  lg(c, [[70, 25], [125, 45], [150, 70]], FROG, 22);
  shape(c, () => ell(c, 98, -22, 50, 38), FROG); shade(c, () => ell(c, 98, -22, 50, 38), FROG_DK, 8, 8);
  shape(c, () => ell(c, 108, -54, 20, 20), FROG); eye(c, 112, -56, 12);
  line(c, [[142, -14], [110, -6]], 4);
  c.restore();
};
const grasshopper = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const G = "#7cb342", GD = "#558b2f";
  line(c, [[-60, 40], [-120, 120], [-100, 200]], 10, GD); line(c, [[80, 40], [150, 120], [150, 200]], 10, GD);
  line(c, [[-170, 60], [-250, -40], [-330, 150]], 28, INK); line(c, [[-170, 60], [-250, -40], [-330, 150]], 18, G);
  line(c, [[-330, 150], [-360, 200]], 12, INK);
  shape(c, () => { c.moveTo(-330, 20); c.bezierCurveTo(-300, -40, -80, -50, 120, -30); c.lineTo(120, 70); c.bezierCurveTo(-80, 90, -300, 90, -330, 20); c.closePath(); }, G, 6);
  for (let i = 0; i < 5; i++) line(c, [[-290 + i * 55, -35 + i * 4], [-290 + i * 55, 80 - i * 3]], 4, GD);
  shape(c, () => ell(c, 180, -10, 85, 70), G, 6);
  shape(c, () => ell(c, 205, -30, 24, 24), WHITE, 5); shape(c, () => ell(c, 210, -30, 10, 10), INK, 0);
  line(c, [[240, -70], [310, -180], [380, -230]], 5); line(c, [[200, -75], [230, -190], [280, -250]], 5);
  line(c, [[40, 80], [100, 150], [130, 220]], 10, INK); line(c, [[40, 80], [100, 150], [130, 220]], 5, G);
  c.restore();
};

// ---------------------------------------------------------------- teeth
// a tooth: kind "in" flat chisel, "ca" pointed, "mo" wide and bumpy. top (x,y) = the gum edge, hangs down if dir = 1, up if -1
const tooth = (c: Ctx, x: number, y: number, w: number, h: number, kind: string, dir: number, col: string = TOOTH) => {
  const p = () => {
    if (kind === "in") rrect(c, x - w / 2, dir > 0 ? y : y - h, w, h, w * 0.18);
    else if (kind === "ca") polyP(c, [[x - w / 2, y], [x + w / 2, y], [x, y + dir * h]]);
    else { c.moveTo(x - w / 2, y); c.lineTo(x + w / 2, y); c.lineTo(x + w / 2, y + dir * h * 0.7); c.lineTo(x + w * 0.2, y + dir * h * 0.9); c.lineTo(x, y + dir * h * 0.7); c.lineTo(x - w * 0.2, y + dir * h); c.lineTo(x - w / 2, y + dir * h * 0.75); c.closePath(); }
  };
  shape(c, p, col, 5);
};
// the mouth seen from the front, centre (x, y), width w: upper and lower row of 10 teeth
const mouth = (c: Ctx, x: number, y: number, w: number, hi: string | null) => {
  const h = w * 0.5;
  shape(c, () => { c.moveTo(x - w / 2, y - h * 0.12); c.bezierCurveTo(x - w * 0.3, y - h * 0.62, x + w * 0.3, y - h * 0.62, x + w / 2, y - h * 0.12); c.bezierCurveTo(x + w * 0.35, y + h * 0.6, x - w * 0.35, y + h * 0.6, x - w / 2, y - h * 0.12); c.closePath(); }, MOUTH, 8);
  const kinds = ["mo", "mo", "ca", "in", "in", "in", "in", "ca", "mo", "mo"];
  const tw = w / 12;
  for (let r = 0; r < 2; r++) kinds.forEach((k, i) => {
    const xx = x + (i - 4.5) * tw * 1.12, up = r === 0, edge = (up ? y - h * 0.42 : y + h * 0.38) + Math.abs(i - 4.5) * (up ? 7 : -7) + (up ? 12 : -12) * 0;
    const wd = k === "mo" ? tw * 1.2 : k === "in" ? tw * 1.05 : tw * 0.95, hh = (k === "ca" ? h * 0.3 : k === "in" ? h * 0.3 : h * 0.22) * (up ? 1 : 0.9);
    const isHi = hi === k || (hi === "front" && k === "in");
    tooth(c, xx, edge, wd, hh, k, up ? 1 : -1, isHi ? TOOTHBLUE : TOOTH);
  });
};

// ---------------------------------------------------------------- flows
const flowE1 = (c: Ctx) => {
  floor(c, 120);
  const rows: [number, number, number, number, number, number][] = [[340, 0, 0, 0.0, 150, 1], [670, 0.45, 0.8, 0.5, 330, 2], [1000, 0.75, 1.35, 0.95, 520, 3]];
  // a line on the floor to start from
  for (const [y, sa, ta, ln, len] of rows) {
    line(c, [[150, y - 150], [150, y + 6]], 8, RED);
    kid(c, 250, y, 270, sa, ta, ln);
    arrow(c, [[390, y - 40], [390 + len * 1.1, y - 40]], RED, 12);
  }
};
const flowA1 = (c: Ctx) => {
  floor(c, 700);
  frogSit(c, 330, 880, 1.6);
  frogAir(c, 840, 340, 1.0, -0.5);
  arrow(c, [[640, 820], [760, 660]], RED, 14);
};
const flowA2 = (c: Ctx) => {
  floor(c, 760);
  // a big notebook held flat by a child's hand, pushed down: the tissue bits on the floor fly sideways
  shape(c, () => polyP(c, [[330, 330], [900, 300], [960, 400], [390, 440]]), COL.blue, 6);
  shape(c, () => polyP(c, [[390, 440], [960, 400], [960, 424], [390, 466]]), WHITE, 5);
  shape(c, () => polyP(c, [[330, 330], [390, 440], [390, 466], [330, 356]]), COL.blueDk, 5);
  hand(c, 120, 420, 0.05, 1.9, SKIN.child, CLOTH.child, true);
  arrow(c, [[660, 520], [660, 700]], RED, 14);
  for (const [x, y, r] of [[300, 880, 0.3], [420, 900, -0.2], [540, 870, 0.5], [660, 905, 0.1], [760, 880, -0.4]]) shape(c, () => ell(c, x, y, 34, 14, r), WHITE, 4);
  arrow(c, [[420, 960], [200, 960]], COL.blue, 10); arrow(c, [[660, 960], [900, 960]], COL.blue, 10);
};
const flowA4 = (c: Ctx) => {
  ground(c, WALL);
  // a mirror showing the child's teeth, a paper with a map of tooth shapes, a pencil
  shape(c, () => ell(c, 540, 330, 290, 290), COL.steelDk, 8);
  shape(c, () => ell(c, 540, 330, 252, 252), COL.steelIn, 4);
  mouth(c, 540, 330, 400, null);
  shine(c, [[360, 190], [420, 140]], 12);
  lg(c, [[540, 620], [540, 700]], COL.steelDk, 44);
  shape(c, () => rrect(c, 120, 700, 640, 300, 20), WHITE, 6);
  const ks = ["mo", "mo", "ca", "in", "in", "in", "in", "ca", "mo", "mo"];
  ks.forEach((k, i) => { tooth(c, 190 + i * 55, 750, k === "mo" ? 52 : 46, 100, k, 1, WHITE); tooth(c, 190 + i * 55, 960, k === "mo" ? 52 : 46, 100, k, -1, WHITE); });
  line(c, [[780, 980], [960, 800]], 22, INK); line(c, [[780, 980], [960, 800]], 12, COL.yellow);
};
const flowC1 = (c: Ctx) => {
  ground(c, "#cfe9f7");
  c.fillStyle = "#8cc063"; c.fillRect(0, 900, 1080, 180); line(c, [[0, 900], [1080, 900]], 6);
  // two trunks and a paper lizard gliding slowly from one to the other
  for (const x of [60, 930]) { shape(c, () => rrect(c, x, 0, 100, 900, 12), COL.brown, 6); for (const y of [150, 420, 700]) line(c, [[x + 14, y], [x + 40, y + 50]], 5, COL.soilDk); }
  lizardTop(c, 540, 470, 1.15, 0.3, true);
  c.setLineDash([22, 22]); line(c, [[200, 140], [380, 300], [530, 430]], 8, "rgba(43,35,64,0.35)"); c.setLineDash([]);
  arrow(c, [[610, 540], [800, 700]], RED, 14);
};
const flowP1 = (c: Ctx) => {
  ground(c, "#ecd3a1");
  // an open notebook: left page a bird with a movement arrow, right page a beak with a seed
  shape(c, () => polyP(c, [[80, 250], [540, 280], [540, 880], [80, 850]]), WHITE, 6);
  shape(c, () => polyP(c, [[540, 280], [1000, 250], [1000, 850], [540, 880]]), WHITE, 6);
  line(c, [[540, 280], [540, 880]], 6);
  const body = () => ell(c, 0, 0, 98, 72, -0.12);
  c.save(); c.translate(280, 540); c.scale(1.05, 1.05);
  for (const dx of [-12, 24]) { line(c, [[dx, 55], [dx, 100]], 9); line(c, [[dx, 100], [dx + 22, 104]], 8); }
  shape(c, () => polyP(c, [[-80, -5], [-170, 22], [-165, 50], [-75, 36]]), "#7d5c3c");
  shape(c, body, "#a9805a"); shade(c, body, "#7d5c3c", 14, 14); shape(c, () => ell(c, 28, 28, 56, 36, -0.1), "#ead9bb", 0);
  shape(c, () => ell(c, -22, -4, 62, 38, 0.35), "#7d5c3c", 5);
  shape(c, () => ell(c, 88, -62, 40, 38), "#a9805a"); shape(c, () => polyP(c, [[120, -66], [158, -54], [120, -44]]), BEAKC, 5); eye(c, 98, -70, 9);
  c.restore();
  arrow(c, [[170, 700], [400, 760]], RED, 12);
  // a beak close up and a seed
  c.save(); c.translate(790, 560); c.scale(1.4, 1.4);
  shape(c, () => ell(c, 0, 0, 90, 80), "#a9805a"); shape(c, () => polyP(c, [[70, -20], [165, 10], [70, 40]]), BEAKC, 5); eye(c, 30, -20, 12);
  c.restore();
  shape(c, () => ell(c, 910, 700, 20, 13, 0.5), COL.greenLt, 5);
  line(c, [[790, 800], [860, 840]], 14, INK); line(c, [[790, 800], [860, 840]], 8, COL.yellow);
};

// ---------------------------------------------------------------- terms
const term0 = (c: Ctx) => { // joint: a leg bent at the knee, knee and ankle ringed
  floor(c, 820);
  const p = kid(c, 380, 820, 520, 0.55, 1.15, 0.15, false);
  ring(c, p.knee[0], p.knee[1], 55); ring(c, p.ank[0], p.ank[1], 45); ring(c, p.hip[0], p.hip[1], 55);
};
const term1 = (c: Ctx) => { // muscle: the thigh muscle shown in red on a bent leg
  floor(c, 820);
  const p = kid(c, 380, 820, 520, 0.55, 1.15, 0.15, false);
  const [kx, ky] = p.knee, [hx, hy] = p.hip, mx = (kx + hx) / 2, my = (ky + hy) / 2, an = Math.atan2(ky - hy, kx - hx);
  c.save(); c.translate(mx - 6, my - 6); c.rotate(an); c.scale(1.3, 1.3);
  shape(c, () => { c.moveTo(-80, 0); c.bezierCurveTo(-40, -44, 40, -44, 80, 0); c.bezierCurveTo(40, 44, -40, 44, -80, 0); c.closePath(); }, "#e4523b", 6);
  line(c, [[-60, 0], [60, 0]], 4, "#b8392a");
  c.restore();
};
const term5 = (c: Ctx) => { // webbed foot: a duck's foot spread open, skin between the three front toes
  ground(c, "#bfe0f5");
  c.fillStyle = COL.water; c.fillRect(0, 700, 1080, 380); line(c, [[0, 700], [1080, 700]], 6);
  lg(c, [[540, 120], [540, 480]], COL.orange, 52);
  const web = () => { c.moveTo(540, 480); c.lineTo(190, 920); c.quadraticCurveTo(250, 960, 330, 900); c.quadraticCurveTo(440, 990, 540, 930); c.quadraticCurveTo(640, 990, 750, 900); c.quadraticCurveTo(830, 960, 890, 920); c.closePath(); };
  shape(c, web, "#f7b15a", 7); shade(c, web, COL.orange, 14, 14, 0.5);
  for (const [tx, ty] of [[190, 920], [540, 930], [890, 920]]) lg(c, [[540, 480], [tx, ty]], COL.orange, 32);
  for (const [tx, ty] of [[190, 920], [540, 930], [890, 920]]) shape(c, () => ell(c, tx, ty, 26, 20), COL.orange, 6);
};
const term9 = (c: Ctx) => { // incisors: the front cutting teeth coloured blue
  ground(c, WALL);
  mouth(c, 540, 470, 860, "front");
};
const headCow = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => ell(c, -105, -30, 52, 24, 0.5), "#d8cab4", 5); shape(c, () => ell(c, 105, -30, 52, 24, -0.5), "#d8cab4", 5);
  line(c, [[-60, -85], [-90, -135]], 12); line(c, [[60, -85], [90, -135]], 12);
  shape(c, () => rrect(c, -70, -90, 140, 190, 56), "#f4ece0"); shape(c, () => rrect(c, -62, 20, 124, 90, 40), "#f29ab4");
  shape(c, () => ell(c, -22, 66, 9, 12), INK, 0); shape(c, () => ell(c, 22, 66, 9, 12), INK, 0);
  eye(c, -34, -20, 11); eye(c, 34, -20, 11);
  c.restore();
};
const headTiger = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => ell(c, -78, -80, 28, 28), COL.orange); shape(c, () => ell(c, 78, -80, 28, 28), COL.orange);
  shape(c, () => ell(c, 0, 0, 100, 90), COL.orange); shade(c, () => ell(c, 0, 0, 100, 90), "#d27c25", 12, 12, 0.5);
  shape(c, () => ell(c, 0, 40, 50, 36), "#fffaf0", 5);
  for (const sx of [-1, 1]) for (const k of [0, 1, 2]) line(c, [[sx * 98, -30 + k * 26], [sx * 62, -22 + k * 26]], 8);
  line(c, [[0, -88], [0, -46]], 8);
  shape(c, () => polyP(c, [[-14, 18], [14, 18], [0, 36]]), "#e86a7a", 4);
  eye(c, -36, -12, 10); eye(c, 36, -12, 10);
  c.restore();
};
const headGirl = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => ell(c, 0, 0, 84, 90), SKIN.child);
  shape(c, () => { c.moveTo(-86, -10); c.bezierCurveTo(-100, -130, 100, -130, 86, -10); c.quadraticCurveTo(0, -50, -86, -10); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, 86, 20, 24, 44), CLOTH.hair, 5);
  eye(c, -30, 6, 10); eye(c, 30, 6, 10);
  c.beginPath(); c.arc(0, 40, 22, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  c.restore();
};
const term12 = (c: Ctx) => { // three plates: grass for the cow, meat for the tiger, rice, vegetables and fish for the girl
  ground(c, WALL);
  const xs = [190, 540, 890];
  headCow(c, xs[0], 220, 0.95); headTiger(c, xs[1], 230, 1.05); headGirl(c, xs[2], 230, 1.0);
  for (const x of xs) { plate(c, x, 700, 160, 100); }
  // grass
  for (let i = 0; i < 9; i++) { const gx = xs[0] - 90 + i * 22; line(c, [[gx, 730], [gx + (i % 3 - 1) * 14, 640 - (i % 4) * 14]], 9, COL.leafDk); line(c, [[gx, 730], [gx + (i % 3 - 1) * 14, 640 - (i % 4) * 14]], 4, COL.green); }
  // meat on a bone
  shape(c, () => ell(c, xs[1], 690, 80, 52, -0.2), "#c0504d", 6); line(c, [[xs[1] + 70, 650], [xs[1] + 130, 610]], 18, INK); line(c, [[xs[1] + 70, 650], [xs[1] + 130, 610]], 10, BONE);
  shape(c, () => ell(c, xs[1] + 135, 600, 16, 16), BONE, 5); shape(c, () => ell(c, xs[1] + 118, 622, 14, 14), BONE, 5);
  // rice, vegetables, fish
  shape(c, () => ell(c, xs[2] - 40, 710, 70, 40), WHITE, 5);
  for (let i = 0; i < 6; i++) shape(c, () => ell(c, xs[2] - 70 + i * 22, 700 + (i % 2) * 14, 8, 4, 0.5), "#f4f1e4", 2);
  shape(c, () => ell(c, xs[2] + 55, 690, 38, 26), COL.leaf, 5); shape(c, () => ell(c, xs[2] + 20, 665, 24, 18), COL.orange, 5);
  shape(c, () => { c.moveTo(xs[2] - 60, 770); c.quadraticCurveTo(xs[2], 720, xs[2] + 70, 770); c.quadraticCurveTo(xs[2], 800, xs[2] - 60, 770); c.closePath(); }, "#b7c9d8", 5);
  shape(c, () => polyP(c, [[xs[2] + 66, 770], [xs[2] + 100, 745], [xs[2] + 100, 795]]), "#8aa3b8", 5);
};

// ---------------------------------------------------------------- explanations
const expl0 = (c: Ctx) => { // legs move a body: the foot pushes back and down, the body moves forward
  floor(c, 820);
  kid(c, 430, 820, 540, 0.25, 0.1, 0.1, false);
  arrow(c, [[400, 880], [250, 880]], RED, 14);
  arrow(c, [[560, 330], [800, 330]], RED, 14);
};
const expl1 = (c: Ctx) => { // jumpers: the frog's folded back legs, and a grasshopper ready to spring
  floor(c, 700);
  frogSit(c, 300, 840, 1.5);
  grasshopper(c, 760, 540, 0.66);
  arrow(c, [[330, 480], [440, 340]], RED, 14);
};
const expl3 = (c: Ctx) => { // glide: a flying lizard with spread skin flaps goes from one trunk to another
  ground(c, "#cfe9f7");
  c.fillStyle = "#8cc063"; c.fillRect(0, 930, 1080, 150); line(c, [[0, 930], [1080, 930]], 6);
  for (const x of [20, 960]) { shape(c, () => rrect(c, x, 0, 100, 930, 12), COL.brown, 6); for (const y of [180, 460, 760]) line(c, [[x + 14, y], [x + 40, y + 50]], 5, COL.soilDk); }
  lizardTop(c, 540, 470, 1.0, 0.22, false);
  arrow(c, [[300, 300], [440, 360]], RED, 14);
  arrow(c, [[690, 630], [880, 720]], RED, 14);
};
const expl4 = (c: Ctx) => { // swimming: a fish swings its tail and pushes water back
  ground(c, "#bfe0f5");
  c.fillStyle = COL.water; c.globalAlpha = 0.55; c.fillRect(0, 220, 1080, 860); c.globalAlpha = 1; line(c, [[0, 220], [1080, 220]], 6);
  c.save(); c.translate(520, 560); c.scale(2.0, 2.0);
  shape(c, () => polyP(c, [[-90, 0], [-175, -58], [-150, 0], [-175, 58]]), "#d96a2f");
  shape(c, () => polyP(c, [[-30, -55], [10, -105], [70, -50]]), "#d96a2f");
  shape(c, () => polyP(c, [[-10, 55], [20, 95], [60, 52]]), "#d96a2f");
  const body = () => { c.moveTo(-110, 0); c.bezierCurveTo(-60, -85, 90, -70, 140, 0); c.bezierCurveTo(90, 70, -60, 85, -110, 0); c.closePath(); };
  shape(c, body, "#f08a4b"); shade(c, body, "#d96a2f", 14, 16);
  eye(c, 100, -12, 13); line(c, [[138, 4], [118, 10]], 5);
  c.restore();
  arrow(c, [[200, 420], [90, 420]], COL.blue, 14); arrow(c, [[200, 700], [90, 700]], COL.blue, 14);
  arrow(c, [[830, 560], [1020, 560]], RED, 14);
};
const expl6 = (c: Ctx) => { // teeth fit the food: a cutting tooth with a banana, a pointed tooth with meat, a grinding tooth with grass
  ground(c, WALL);
  const xs = [190, 540, 890];
  shape(c, () => rrect(c, 80, 70, 220, 90, 30), GUM, 6); tooth(c, xs[0], 150, 130, 330, "in", 1);
  shape(c, () => rrect(c, 430, 70, 220, 90, 30), GUM, 6); tooth(c, xs[1], 150, 150, 330, "ca", 1);
  shape(c, () => rrect(c, 780, 70, 220, 90, 30), GUM, 6); tooth(c, xs[2], 150, 190, 300, "mo", 1);
  // banana with a bite out
  shape(c, () => { c.moveTo(70, 760); c.quadraticCurveTo(190, 940, 320, 730); c.quadraticCurveTo(330, 790, 190, 880); c.quadraticCurveTo(100, 880, 70, 760); c.closePath(); }, COL.yellow, 6);
  // meat on a bone
  shape(c, () => ell(c, xs[1] - 10, 760, 100, 66, -0.2), "#c0504d", 6); line(c, [[xs[1] + 80, 720], [xs[1] + 160, 670]], 20, INK); line(c, [[xs[1] + 80, 720], [xs[1] + 160, 670]], 12, BONE);
  // grass
  for (let i = 0; i < 11; i++) { const gx = xs[2] - 110 + i * 22; line(c, [[gx, 860], [gx + (i % 3 - 1) * 16, 700 - (i % 4) * 14]], 10, COL.leafDk); line(c, [[gx, 860], [gx + (i % 3 - 1) * 16, 700 - (i % 4) * 14]], 5, COL.green); }
  for (const x of xs) arrow(c, [[x, 520], [x, 620]], RED, 12);
};

export const KEYS: string[] = ["flow.e1", "flow.a1", "flow.a2", "flow.a4", "flow.c1", "flow.p1", "term.0", "term.1", "term.5", "term.9", "term.12", "expl.0", "expl.1", "expl.3", "expl.4", "expl.6"];
export const ic_animalsAnimalBodiesL2 = cards("sci.animals.animal-bodies.L2 cards", [flowE1, flowA1, flowA2, flowA4, flowC1, flowP1, term0, term1, term5, term9, term12, expl0, expl1, expl3, expl4, expl6]);
