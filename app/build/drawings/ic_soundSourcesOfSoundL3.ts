import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, glass, write, cards } from "./flatKit";

// sci.sound.sources-of-sound.L3 · picture cards (intro, cover, activities, terms).
// Sound is drawn as blue rings and waves; the vibrating thing is shown with pale ghost copies.

const WAVE = "#5b8fd6", WAVELT = "#9ccbef";
const rings = (c: Ctx, x: number, y: number, rs: number[], a0: number, a1: number, w = 9) => {
  rs.forEach((r, i) => { c.globalAlpha = 1 - i * 0.18; c.beginPath(); c.arc(x, y, r, a0, a1); c.strokeStyle = WAVE; c.lineWidth = w; c.lineCap = "round"; c.stroke(); });
  c.globalAlpha = 1;
};
const wavy = (c: Ctx, x0: number, x1: number, y: number, cycles: number, amp: number, col: string = WAVE, w = 9) => {
  const pts: number[][] = []; for (let i = 0; i <= 120; i++) { const t = i / 120; pts.push([x0 + (x1 - x0) * t, y + Math.sin(t * cycles * Math.PI * 2) * amp]); } line(c, pts, w, col);
};
// a forearm coming in from off the card to a hand at (x, y) pointing at angle an
const reach = (c: Ctx, x: number, y: number, an: number, s: number, sleeve: string, open = false, adult = false) => {
  c.save(); c.translate(x, y); c.rotate(an); shape(c, () => rrect(c, -1100, -33 * s, 1100 - 50 * s, 66 * s, 10), sleeve, 6); c.restore();
  hand(c, x, y, an, s, adult ? SKIN.adult : SKIN.child, sleeve, open);
};
// a head and shoulders seen from the side, facing left, with its ear towards us
const headSide = (c: Ctx, x: number, y: number, r: number) => {
  c.save(); c.translate(x, y); c.scale(-1, 1);
  shape(c, () => rrect(c, -r * 1.25, r * 0.95, r * 2.5, r * 1.6, r * 0.7), CLOTH.child);
  shape(c, () => rrect(c, -r * 0.25, r * 0.7, r * 0.7, r * 0.5, 6), SKIN.child, 5);
  shape(c, () => ell(c, -r * 0.95, -r * 0.55, r * 0.45, r * 0.45), CLOTH.hair, 5);
  const head = () => ell(c, 0, 0, r, r * 1.05);
  shape(c, head, SKIN.child); shape(c, () => ell(c, r * 1.0, r * 0.02, r * 0.17, r * 0.17), SKIN.child, 5);
  c.save(); c.beginPath(); head(); c.clip(); c.beginPath(); ell(c, -r * 0.45, -r * 0.5, r * 1.15, r * 0.95); c.fillStyle = CLOTH.hair; c.fill(); c.restore();
  c.beginPath(); head(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  shape(c, () => ell(c, -r * 0.1, r * 0.2, r * 0.2, r * 0.3), SKIN.childDk, 5);
  shape(c, () => ell(c, r * 0.5, -r * 0.05, r * 0.09, r * 0.13), INK, 0);
  c.beginPath(); c.arc(r * 0.8, r * 0.4, r * 0.18, 0.3, 1.9); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  c.restore();
};
const steelCyl = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.12, y + 8, w * 0.6, w * 0.1);
  const b = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.44, y); c.lineTo(x - w * 0.44, y); c.closePath(); };
  shape(c, b, COL.steel); shade(c, b, COL.steelDk, w * 0.22, 0); shine(c, [[x - w * 0.36, y - h * 0.85], [x - w * 0.32, y - h * 0.15]], 8);
};
const tableTop = (c: Ctx, y: number, x0 = -20, x1 = 1100) => {
  shape(c, () => rrect(c, x0, y, x1 - x0, 60, 4), COL.wood, 6);
  c.fillStyle = COL.woodDk; c.fillRect(x0 + 6, y + 36, x1 - x0 - 12, 18); line(c, [[x0 + 6, y + 56], [x1 - 6, y + 56]], 6);
};
// a tabla-style drum: body, skin on top with black syahi, lacing
const tabla = (c: Ctx, x: number, y: number, w: number, h: number, body: string = COL.brown, bodyDk: string = "#7c5230") => {
  shadow(c, x + w * 0.1, y + 8, w * 0.6, w * 0.1);
  const b = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.38, y); c.quadraticCurveTo(x, y + w * 0.1, x - w * 0.38, y); c.closePath(); };
  shape(c, b, body); shade(c, b, bodyDk, w * 0.2, 0);
  for (let i = 0; i < 6; i++) { const u = -0.4 + i * 0.16; line(c, [[x + w * u, y - h + 4], [x + w * u * 0.85, y - 10]], 5, COL.cloth); }
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.15), COL.cloth, 6);
  shape(c, () => ell(c, x, y - h, w * 0.2, w * 0.065), COL.black, 4);
};
const dot = (c: Ctx, x: number, y: number, r: number, col: string = WAVELT) => shape(c, () => ell(c, x, y, r, r), col, Math.max(2.5, r * 0.22));
// a ruler's free end swinging from a pivot on a table edge
const rulerFree = (c: Ctx, px: number, py: number, L: number, a: number, alpha = 1) => {
  c.save(); c.globalAlpha = alpha; c.translate(px, py); c.rotate(a);
  shape(c, () => rrect(c, 0, -34, L, 34, 4), COL.sky, 6);
  for (let i = 1; i < L / 22; i++) line(c, [[i * 22, -34], [i * 22, i % 5 ? -22 : -14]], 3);
  c.restore(); c.globalAlpha = 1;
};
const bell = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - 60 * s, y); c.quadraticCurveTo(x - 62 * s, y - 80 * s, x, y - 90 * s); c.quadraticCurveTo(x + 62 * s, y - 80 * s, x + 60 * s, y); c.closePath(); }, COL.yellow, 6);
  shade(c, () => { c.moveTo(x - 60 * s, y); c.quadraticCurveTo(x - 62 * s, y - 80 * s, x, y - 90 * s); c.quadraticCurveTo(x + 62 * s, y - 80 * s, x + 60 * s, y); c.closePath(); }, COL.orange, 24 * s, 0);
  shape(c, () => ell(c, x, y + 10 * s, 15 * s, 15 * s), COL.orange, 5);
};

// ---- intro: a girl humming, fingers on her throat, rings of vibration
const intro = (c: Ctx) => {
  ground(c); const h = 1150, y = 1230, ty = y - 0.74 * h + 14;
  person(c, 540, y, h, { armR: [Math.PI * 0.7, -Math.PI * 0.5], armL: [Math.PI * 0.55, Math.PI * 0.5] });
  rings(c, 540, ty, [150, 215, 280, 345], Math.PI * 0.7, Math.PI * 1.3); rings(c, 540, ty, [150, 215, 280, 345], -Math.PI * 0.3, Math.PI * 0.3);
};
// ---- summary: a tabla ringing, the push travelling through the air to an ear
const summary = (c: Ctx) => {
  ground(c); tabla(c, 270, 800, 300, 330);
  rings(c, 270, 470, [210, 290, 370, 450], -Math.PI * 0.12, Math.PI * 0.12);
  rings(c, 270, 470, [160, 220], -Math.PI * 0.5, -Math.PI * 0.15);
  headSide(c, 850, 470, 150);
};
// ---- e1 the twanging ruler
const e1 = (c: Ctx) => {
  ground(c); const px = 520, py = 660;
  shape(c, () => rrect(c, 40, py + 60, 80, 330, 6), COL.woodDk, 6); tableTop(c, py, -20, px);
  shape(c, () => rrect(c, 170, py - 34, px - 170, 34, 4), COL.sky, 6);
  rulerFree(c, px, py, 380, 0.34, 0.3); rulerFree(c, px, py, 380, -0.3, 0.3); rulerFree(c, px, py, 380, 0);
  reach(c, 300, 395, Math.PI / 2, 1.15, CLOTH.child, true);
  arrow(c, [[px + 395, py - 150], [px + 440, py - 10]]); arrow(c, [[px + 440, py + 40], [px + 395, py + 170]]);
  rings(c, px + 380, py - 20, [120, 175, 230], -Math.PI * 0.15, Math.PI * 0.15, 8);
};
// ---- e2 catch the ring: a plate, a foil ball on a thread
const e2 = (c: Ctx) => {
  ground(c);
  reach(c, 560, 985, -Math.PI / 2, 1.2, CLOTH.adult, false, true);
  const pc = () => ell(c, 560, 540, 270, 270);
  shadow(c, 590, 835, 240, 26);
  shape(c, pc, COL.steel); shade(c, pc, COL.steelDk, 40, 40);
  shape(c, () => ell(c, 560, 540, 215, 215), COL.steelIn, 5);
  line(c, [[880, 60], [880, 520]], 5, INK); shape(c, () => rrect(c, 850, 40, 60, 24, 4), COL.paper, 4);
  shape(c, () => ell(c, 880, 548, 30, 30), COL.steelDk, 5); shine(c, [[868, 538], [872, 530]], 7);
  line(c, [[900, 50], [980, 520]], 5, "rgba(43,35,64,0.25)"); shape(c, () => ell(c, 984, 548, 30, 30), "rgba(152,163,179,0.4)", 3);
  arrow(c, [[1000, 380], [1030, 440]], RED, 9);
  // the spoon strikes the plate
  c.save(); c.translate(250, 700); c.rotate(-0.7);
  shape(c, () => rrect(c, -170, -9, 170, 18, 8), COL.steelDk, 5); shape(c, () => ell(c, 28, 0, 50, 32), COL.steel, 5); c.restore();
  rings(c, 560, 540, [310, 350], Math.PI * 1.1, Math.PI * 1.45, 8);
};
// ---- e3 the atta trick: a balloon drum, rice jumping, a blob of dough
const e3 = (c: Ctx) => {
  ground(c); steelCyl(c, 540, 930, 420, 450);
  shape(c, () => { c.moveTo(322, 480); c.lineTo(758, 480); c.lineTo(765, 560); c.quadraticCurveTo(540, 600, 315, 560); c.closePath(); }, COL.pink, 6);
  line(c, [[326, 536], [754, 536]], 12, COL.red);
  shape(c, () => ell(c, 540, 480, 218, 44), "#f7b9cb", 6);
  shape(c, () => { c.moveTo(600, 480); c.quadraticCurveTo(630, 430, 700, 450); c.quadraticCurveTo(740, 490, 690, 504); c.quadraticCurveTo(630, 516, 600, 480); c.closePath(); }, "#ead9b0", 5);
  for (const [rx, ry, rr] of [[430, 470, 0.3], [470, 492, 2.6], [395, 495, 1.2], [455, 450, 0.8]]) shape(c, () => ell(c, rx, ry, 13, 7, rr), WHITE, 3.5);
  for (const [rx, ry] of [[430, 360], [470, 310], [395, 390]]) shape(c, () => ell(c, rx, ry, 13, 7, 0.6), WHITE, 3.5);
  arrow(c, [[400, 290], [400, 190]], RED, 9); arrow(c, [[470, 270], [470, 170]], RED, 9);
  reach(c, 640, 200, Math.PI / 2, 1, CLOTH.adult, false, true);
};
// ---- a1 vibration hunt: hand on a humming speaker, paper and pencil
const a1 = (c: Ctx) => {
  ground(c);
  const body = () => rrect(c, 380, 190, 520, 640, 36);
  shadow(c, 660, 850, 290, 30); shape(c, body, COL.brown); shade(c, body, "#7c5230", 50, 0);
  shape(c, () => ell(c, 640, 360, 130, 130), COL.black, 6); shape(c, () => ell(c, 640, 360, 62, 62), COL.greyDk, 5);
  shape(c, () => ell(c, 640, 640, 170, 170), COL.black, 6); shape(c, () => ell(c, 640, 640, 100, 100), COL.greyDk, 5); shape(c, () => ell(c, 640, 640, 38, 38), COL.black, 4);
  hand(c, 70, 640, 0, 1.55, SKIN.child, CLOTH.child, true);
  rings(c, 640, 640, [200, 240], Math.PI * 0.85, Math.PI * 1.15, 8); rings(c, 640, 640, [200, 240], -Math.PI * 0.12, Math.PI * 0.12, 8);
  c.save(); c.translate(840, 930); c.rotate(-0.12);
  shape(c, () => rrect(c, -150, -150, 300, 190, 10), COL.paper, 6); [-100, -60, -20].forEach((ly) => line(c, [[-120, ly], [110, ly]], 4, COL.grey)); c.restore();
  c.save(); c.translate(760, 1020); c.rotate(-0.5); shape(c, () => polyP(c, [[0, -9], [180, -9], [210, 0], [180, 9], [0, 9]]), COL.yellow, 5); c.restore();
};
// ---- a2 coin line: seen from above on the table
const a2 = (c: Ctx) => {
  ground(c, COL.wood);
  for (let i = 0; i < 9; i++) line(c, [[0, 60 + i * 130], [1080, 60 + i * 130]], 3, COL.woodDk);
  const coin = (x: number, mv = false) => {
    shadow(c, x + 14, 560, 62, 62);
    shape(c, () => ell(c, x, 540, 62, 62), COL.steel); shade(c, () => ell(c, x, 540, 62, 62), COL.steelDk, 16, 16);
    shape(c, () => ell(c, x, 540, 44, 44), COL.steelIn, 3.5); write(c, "1", x - 12, 518, 44, INK, 7);
    if (mv) for (const dy of [-26, 0, 26]) line(c, [[x + 78, 540 + dy], [x + 120, 540 + dy]], 7, WAVE);
  };
  for (let i = 0; i < 4; i++) coin(330 + i * 124); coin(890, true);
  coin(110);
  arrow(c, [[60, 380], [270, 380]]);
};
// ---- a3 kitchen orchestra: tumblers with different water, a spoon
const a3 = (c: Ctx) => {
  ground(c); const fills = [0.15, 0.35, 0.55, 0.75, 0.95];
  tableTop(c, 800, -20, 1100);
  fills.forEach((f, i) => glass(c, 150 + i * 195, 800, 170, 400, f));
  c.save(); c.translate(560, 220); c.rotate(0.9);
  shape(c, () => rrect(c, 0, -9, 190, 18, 8), COL.steelDk, 5); shape(c, () => ell(c, -30, 0, 52, 32), COL.steel, 5); c.restore();
  rings(c, 540, 405, [100, 150, 200], -Math.PI * 0.95, -Math.PI * 0.6, 8);
};
// ---- a4 rubber-band veena
const a4 = (c: Ctx) => {
  ground(c);
  const box = () => rrect(c, 160, 380, 760, 420, 34);
  shadow(c, 560, 830, 400, 30); shape(c, box, COL.teal); shade(c, box, COL.tealDk, 40, 0);
  shape(c, () => rrect(c, 240, 450, 600, 280, 18), "#3a3540", 6);
  const bands: [number, number, string][] = [[490, 8, COL.yellow], [545, 12, COL.orange], [600, 17, COL.red], [665, 22, COL.pink]];
  bands.forEach(([y, w, col], i) => { if (i === 1) return; line(c, [[190, y], [890, y]], w + 8, INK); line(c, [[190, y], [890, y]], w, col); });
  line(c, [[190, 545], [540, 395], [890, 545]], 20, INK); line(c, [[190, 545], [540, 395], [890, 545]], 12, COL.orange);
  line(c, [[190, 545], [890, 545]], 12, "rgba(243,154,60,0.35)");
  reach(c, 540, 200, Math.PI / 2, 1, CLOTH.child, false);
  rings(c, 540, 600, [330, 380], -Math.PI * 0.2, -Math.PI * 0.05, 7);
};
// ---- a5 straw shehnai: a straw with a V cut end
const a5 = (c: Ctx) => {
  ground(c); c.save(); c.translate(540, 560); c.rotate(-0.2);
  shadow(c, 20, 90, 390, 22);
  shape(c, () => rrect(c, -80, -30, 520, 60, 28), COL.red); shade(c, () => rrect(c, -80, -30, 520, 60, 28), "#b83a28", 0, 12);
  for (let i = 0; i < 7; i++) { c.save(); c.beginPath(); rrect(c, -80, -30, 520, 60, 28); c.clip(); line(c, [[-40 + i * 74, -34], [-12 + i * 74, 34]], 16, WHITE); c.restore(); }
  c.beginPath(); rrect(c, -80, -30, 520, 60, 28); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  // the flattened V-cut end: two flaps
  shape(c, () => polyP(c, [[-80, -30], [-120, -48], [-210, -48], [-300, 0], [-210, 48], [-120, 48], [-80, 30]]), "#f0766a", 6);
  line(c, [[-120, -30], [-120, 30]], 4, INK); line(c, [[-190, -20], [-250, 0], [-190, 20]], 4, INK);
  c.restore();
  arrow(c, [[60, 700], [190, 590]]);
  rings(c, 920, 440, [90, 150, 210], -Math.PI * 0.3, Math.PI * 0.3, 8);
};
// ---- p1 my instrument concert: box guitar, tin drum, rice shaker
const p1 = (c: Ctx) => {
  ground(c); tableTop(c, 800, -20, 1100);
  // box guitar
  shape(c, () => rrect(c, 130, 140, 70, 260, 6), COL.wood, 6);
  shape(c, () => rrect(c, 70, 390, 190, 400, 24), COL.teal); shade(c, () => rrect(c, 70, 390, 190, 400, 24), COL.tealDk, 20, 0);
  shape(c, () => ell(c, 165, 560, 52, 52), "#3a3540", 5);
  [-36, -12, 12, 36].forEach((dx, i) => line(c, [[165 + dx, 150], [165 + dx, 740]], 5 + i, [COL.yellow, COL.orange, COL.red, COL.pink][i]));
  // tin drum
  steelCyl(c, 520, 800, 270, 300);
  shape(c, () => ell(c, 520, 500, 135, 32), "#f7b9cb", 6);
  c.save(); c.translate(430, 300); c.rotate(0.5); shape(c, () => rrect(c, 0, -7, 190, 14, 6), COL.wood, 5); c.restore();
  // rice shaker: a jar with a lid, rice inside
  const jar = () => rrect(c, 760, 460, 190, 340, 30);
  shadow(c, 870, 810, 110, 14); shape(c, jar, COL.glass, 5);
  c.save(); c.beginPath(); jar(); c.clip(); c.fillStyle = "#f4efe0"; c.fillRect(740, 660, 230, 150); c.restore();
  c.beginPath(); jar(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  shape(c, () => rrect(c, 770, 420, 170, 50, 10), COL.red, 5);
  rings(c, 520, 500, [190, 240], -Math.PI * 0.7, -Math.PI * 0.35, 8);
  arrow(c, [[740, 360], [860, 330], [980, 360]], RED, 9);
};
// ---- c1 one band, biggest sound: a band over a big bucket
const c1 = (c: Ctx) => {
  ground(c); const x = 540, y = 910, top = 440;
  shadow(c, x + 30, y + 10, 330, 28);
  const b = () => { c.moveTo(x - 260, top); c.lineTo(x + 260, top); c.lineTo(x + 205, y); c.lineTo(x - 205, y); c.closePath(); };
  shape(c, b, COL.blue); shade(c, b, COL.blueDk, 60, 0);
  shape(c, () => ell(c, x, top, 260, 56), COL.blueDk, 6); shape(c, () => ell(c, x, top, 234, 40), "#27466d", 4);
  line(c, [[x - 255, top], [x + 255, top]], 18, INK); line(c, [[x - 255, top], [x + 255, top]], 10, COL.yellow);
  line(c, [[x - 255, top], [x, top - 120], [x + 255, top]], 18, INK); line(c, [[x - 255, top], [x, top - 120], [x + 255, top]], 10, COL.yellow);
  reach(c, x, 215, Math.PI / 2, 0.9, CLOTH.child, false);
  rings(c, x, 660, [320, 390, 460], Math.PI * 0.85, Math.PI * 1.1, 10); rings(c, x, 660, [320, 390, 460], -Math.PI * 0.1, Math.PI * 0.15, 10);
};
// ---- c2 a doorbell for someone who cannot hear: a pulled string lights a lamp
const c2 = (c: Ctx) => {
  ground(c); shape(c, () => rrect(c, 20, 140, 260, 860, 6), COL.brown); shape(c, () => rrect(c, 55, 180, 190, 780, 4), "#c08a52", 5);
  shape(c, () => ell(c, 220, 590, 17, 17), COL.yellow, 5);
  line(c, [[280, 590], [540, 450]], 5); shape(c, () => ell(c, 280, 590, 12, 12), COL.red, 4);
  shadow(c, 560, 770, 140, 20);
  shape(c, () => rrect(c, 550, 600, 22, 150, 6), COL.steelDk, 5); shape(c, () => ell(c, 560, 765, 110, 22), COL.steel, 5);
  for (let i = 0; i < 10; i++) { const a = -Math.PI + (i + 0.5) * Math.PI / 10; line(c, [[560 + Math.cos(a) * 130, 480 + Math.sin(a) * 130], [560 + Math.cos(a) * 190, 480 + Math.sin(a) * 190]], 9, COL.orange); }
  shape(c, () => ell(c, 560, 480, 80, 80), COL.yellow, 6); shape(c, () => rrect(c, 528, 548, 64, 36, 6), COL.steel, 5);
  shape(c, () => rrect(c, 700, 900, 340, 110, 14), COL.woodDk, 6);
  person(c, 870, 1000, 700, { adult: true, sit: true });
};
// ---- term vibrate: a stretched string and its ghosts
const tVibrate = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 90, 400, 90, 360, 14), COL.wood, 6); shape(c, () => rrect(c, 900, 400, 90, 360, 14), COL.wood, 6);
  for (const k of [-110, 110]) { const pts: number[][] = [[180, 580]]; for (let i = 1; i < 30; i++) { const t = i / 30; pts.push([180 + 720 * t, 580 + k * Math.sin(t * Math.PI)]); } pts.push([900, 580]); line(c, pts, 12, "rgba(43,35,64,0.25)"); }
  line(c, [[180, 580], [900, 580]], 16, INK); line(c, [[180, 580], [900, 580]], 8, COL.yellow);
  arrow(c, [[540, 450], [540, 400]], RED, 10); arrow(c, [[540, 710], [540, 760]], RED, 10);
  line(c, [[540, 395], [540, 330]], 10, RED); line(c, [[540, 765], [540, 830]], 10, RED);
};
// ---- term molecule: a close-up circle full of air molecules
const tMolecule = (c: Ctx) => {
  ground(c);
  const lens = () => ell(c, 540, 500, 390, 390);
  shape(c, lens, "#eaf4fb", 14); c.save(); c.beginPath(); lens(); c.clip();
  const r = rnd(5), pts: number[][] = [];
  for (let tries = 0; pts.length < 10 && tries < 4000; tries++) { const x = 220 + r() * 640, y = 190 + r() * 620; if (pts.every(([a, b]) => Math.hypot(a - x, b - y) > 150) && Math.hypot(x - 540, y - 500) < 300) pts.push([x, y]); }
  pts.forEach(([x, y], i) => { const a = r() * 3; const dx = Math.cos(a) * 30, dy = Math.sin(a) * 30; line(c, [[x - dx, y - dy], [x + dx, y + dy]], 24, INK); dot(c, x - dx, y - dy, 30, i % 2 ? COL.blue : COL.red); dot(c, x + dx, y + dy, 30, i % 2 ? COL.blue : COL.red); });
  c.restore();
  shape(c, () => { c.save(); c.translate(540, 500); c.rotate(0.8); c.rect(-0, 380, 0, 0); c.restore(); }, "rgba(0,0,0,0)", 0);
  c.save(); c.translate(820, 780); c.rotate(-0.78); shape(c, () => rrect(c, 0, -26, 230, 52, 20), COL.wood, 6); c.restore();
};
// ---- term sound wave: rows of dots, bunched and spread, moving away from a drum
const tWave = (c: Ctx) => {
  ground(c); tabla(c, 130, 760, 200, 220);
  const xs: number[] = []; let x = 300; [80, 80, 32, 32, 32, 80, 80, 80, 32, 32, 32, 80].forEach((g) => { xs.push(x); x += g; }); xs.push(x);
  [260, 380, 500, 620, 740].forEach((y) => xs.forEach((xx) => dot(c, xx, y, 13)));
  arrow(c, [[330, 900], [980, 900]], RED, 11);
};
// ---- term vacuum: air jar rings reach the ear, empty jar silent
const tVacuum = (c: Ctx) => {
  ground(c);
  const jar = (x: number, withAir: boolean) => {
    shape(c, () => rrect(c, x - 90, 760, 180, 40, 10), COL.wood, 6);
    const dome = () => { c.moveTo(x - 190, 760); c.lineTo(x - 190, 400); c.quadraticCurveTo(x - 190, 220, x, 220); c.quadraticCurveTo(x + 190, 220, x + 190, 400); c.lineTo(x + 190, 760); c.closePath(); };
    shape(c, () => rrect(c, x - 230, 755, 460, 45, 8), COL.steel, 6);
    bell(c, x, 750, 1.15);
    shape(c, dome, "rgba(214,236,250,0.45)", 6);
    if (withAir) { const r = rnd(3); for (let i = 0; i < 22; i++) { const px = x - 150 + r() * 300, py = 290 + r() * 330; if (Math.hypot(px - x, py - 640) > 90) dot(c, px, py, 11); } }
  };
  jar(270, true); jar(810, false);
  rings(c, 270, 650, [260, 310, 360], Math.PI * 0.15, Math.PI * 0.4, 8);
  headSide(c, 270, 930, 62); headSide(c, 810, 930, 62);
  line(c, [[700, 850], [780, 930]], 12, RED); line(c, [[780, 850], [700, 930]], 12, RED);
};
// ---- term vocal folds: two flaps, seen from above, with air coming through
const tFolds = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 520, 380, 340), "#d98a8a", 8);
  shape(c, () => ell(c, 540, 520, 300, 260), "#7a2f3a", 6);
  shape(c, () => { c.moveTo(250, 520); c.quadraticCurveTo(300, 330, 500, 360); c.quadraticCurveTo(515, 520, 500, 690); c.quadraticCurveTo(300, 710, 250, 520); c.closePath(); }, COL.pink, 7);
  shape(c, () => { c.moveTo(830, 520); c.quadraticCurveTo(780, 330, 580, 360); c.quadraticCurveTo(565, 520, 580, 690); c.quadraticCurveTo(780, 710, 830, 520); c.closePath(); }, COL.pink, 7);
  arrow(c, [[540, 880], [540, 640]], RED, 12);
  arrow(c, [[455, 520], [430, 520]], RED, 9); arrow(c, [[625, 520], [650, 520]], RED, 9);
};
// ---- term string instrument: an ektara
const tString = (c: Ctx) => {
  ground(c);
  shadow(c, 600, 985, 220, 24);
  const gourd = () => { c.moveTo(540, 600); c.bezierCurveTo(300, 600, 280, 980, 540, 980); c.bezierCurveTo(800, 980, 780, 600, 540, 600); c.closePath(); };
  for (const dx of [-24, 24]) shape(c, () => rrect(c, 520 + dx - 14, 90, 28, 560, 10), COL.wood, 6);
  shape(c, gourd, COL.orange); shade(c, gourd, "#c67425", 70, 20); shine(c, [[380, 720], [400, 870]], 10);
  shape(c, () => rrect(c, 490, 780, 100, 22, 6), COL.woodDk, 5);
  line(c, [[540, 110], [540, 790]], 10, INK); line(c, [[540, 110], [540, 790]], 4, COL.yellow);
  shape(c, () => ell(c, 540, 90, 36, 20), COL.woodDk, 5);
  for (const k of [-34, 34]) { const pts: number[][] = []; for (let i = 0; i <= 20; i++) { const t = i / 20; pts.push([540 + k * Math.sin(t * Math.PI), 110 + 680 * t]); } line(c, pts, 5, "rgba(43,35,64,0.25)"); }
};
// ---- term drum: a pair of tabla
const tDrum = (c: Ctx) => {
  ground(c); tabla(c, 330, 840, 300, 360, COL.brown); tabla(c, 740, 840, 360, 440, COL.orange, "#c67425");
  rings(c, 740, 400, [250, 300], -Math.PI * 0.75, -Math.PI * 0.25, 8);
};
// ---- term wind instrument: a bansuri
const tWind = (c: Ctx) => {
  ground(c); c.save(); c.translate(540, 560); c.rotate(-0.28);
  shadow(c, 20, 80, 440, 20);
  const body = () => rrect(c, -440, -34, 880, 68, 32);
  shape(c, body, "#d7b86a"); shade(c, body, "#b8963f", 0, 18);
  for (const x of [-300, 20, 380]) shape(c, () => rrect(c, x - 8, -37, 16, 74, 5), "#8d6a28", 5);
  [60, 130, 200, 270, 340, 410].forEach((x) => shape(c, () => ell(c, x - 40, 0, 16, 11), INK, 0));
  shape(c, () => ell(c, -340, 0, 20, 12), INK, 0);
  c.restore();
  arrow(c, [[110, 470], [195, 620]], RED, 10);
  rings(c, 930, 440, [60, 115], -Math.PI * 0.35, Math.PI * 0.35, 8);
};
// ---- term reed: two thin flaps with air squeezing between them
const tReed = (c: Ctx) => {
  ground(c);
  for (const s of [-1, 1]) {
    const fl = (g: number, a: number) => { c.save(); c.globalAlpha = a; shape(c, () => { c.moveTo(280, 520 + s * (24 + g)); c.quadraticCurveTo(560, 520 + s * (24 + g + 30), 860, 520 + s * (24 + g + 150)); c.lineTo(860, 520 + s * (24 + g + 190)); c.quadraticCurveTo(560, 520 + s * (24 + g + 90), 280, 520 + s * (24 + g + 60)); c.closePath(); }, "#d7b86a", 6); c.restore(); };
    fl(0, 1);
  }
  for (const s of [-1, 1]) { c.save(); c.globalAlpha = 0.3; const g = -12; shape(c, () => { c.moveTo(280, 520 + s * 24); c.quadraticCurveTo(560, 520 + s * (24 + g), 860, 520 + s * (24 + g + 40)); c.lineTo(860, 520 + s * (24 + g + 80)); c.quadraticCurveTo(560, 520 + s * (24 + g + 20), 280, 520 + s * 80); c.closePath(); }, "#d7b86a", 4); c.restore(); }
  arrow(c, [[80, 520], [260, 520]], RED, 13);
  arrow(c, [[540, 380], [540, 430]], RED, 9); arrow(c, [[540, 660], [540, 610]], RED, 9);
  rings(c, 930, 520, [60, 120], -Math.PI * 0.3, Math.PI * 0.3, 8);
};
// ---- term syahi: the black circle on a tabla skin, seen from above
const tSyahi = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 400, 30);
  shape(c, () => ell(c, 540, 540, 410, 410), COL.brown);
  shape(c, () => ell(c, 540, 540, 370, 370), COL.cloth, 6);
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; line(c, [[540 + Math.cos(a) * 370, 540 + Math.sin(a) * 370], [540 + Math.cos(a + 0.2) * 410, 540 + Math.sin(a + 0.2) * 410]], 5); }
  shape(c, () => ell(c, 570, 540, 190, 190), COL.black, 6); shine(c, [[460, 430], [500, 400]], 12);
  shape(c, () => ell(c, 570, 540, 100, 100), "#4b4552", 4);
};
// ---- term resonator: the same tuning fork alone and on a hollow box
const tReson = (c: Ctx) => {
  ground(c);
  const fork = (x: number, y: number) => {
    line(c, [[x - 28, y - 330], [x - 28, y - 120], [x, y - 90], [x + 28, y - 120], [x + 28, y - 330]], 26, INK);
    line(c, [[x - 28, y - 330], [x - 28, y - 120], [x, y - 90], [x + 28, y - 120], [x + 28, y - 330]], 14, COL.steel);
    line(c, [[x, y - 90], [x, y]], 26, INK); line(c, [[x, y - 90], [x, y - 4]], 14, COL.steel);
  };
  tableTop(c, 760, -20, 440); fork(220, 760); rings(c, 220, 480, [90, 130], -Math.PI * 0.5, Math.PI * 0.5, 7);
  shape(c, () => rrect(c, 540, 640, 420, 260, 16), COL.wood); shape(c, () => ell(c, 750, 770, 70, 70), "#3a3540", 5);
  shape(c, () => rrect(c, 520, 900, 460, 20, 4), COL.woodDk, 5);
  fork(750, 640); rings(c, 750, 480, [110, 170, 230, 290], -Math.PI * 0.6, Math.PI * 0.6, 9);
};
// two rulers on a table edge, drawn big: a ruler of free length L swinging +-a, and the wave it makes
const rulerRow = (c: Ctx, yc: number, L: number, a: number, cycles: number, amp: number) => {
  c.save(); c.translate(0, yc); c.scale(1.5, 1.5);
  shape(c, () => rrect(c, 10, 0, 100, 50, 4), COL.wood, 5);
  shape(c, () => rrect(c, 30, -34, 80, 34, 4), COL.sky, 5);
  rulerFree(c, 110, 0, L, a, 0.3); rulerFree(c, 110, 0, L, -a, 0.3); rulerFree(c, 110, 0, L, 0);
  wavy(c, 130 + L, 700, -17, cycles, amp, WAVE, 6);
  c.restore();
};
// ---- term pitch: a short ruler (fast, high) and a long ruler (slow, low)
const tPitch = (c: Ctx) => { ground(c); rulerRow(c, 300, 110, 0.12, 9, 18); rulerRow(c, 800, 260, 0.12, 3, 18); };
// ---- term loudness: a small swing is soft, a big swing is loud
const tLoud = (c: Ctx) => { ground(c); rulerRow(c, 300, 200, 0.1, 4, 10); rulerRow(c, 800, 200, 0.35, 4, 55); };

export const ic_soundSourcesOfSoundL3 = cards("sci.sound.sources-of-sound.L3 cards", [
  intro, summary, e1, e2, e3, a1, a2, a3, a4, a5, p1, c1, c2,
  tVibrate, tMolecule, tWave, tVacuum, tFolds, tString, tDrum, tWind, tReed, tSyahi, tReson, tPitch, tLoud,
]);
