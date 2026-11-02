import type { Ctx } from "./core";
import { D, INK, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, rrect, shadow, line, arrow, bowl, plate, seed, hand, person, write, cards } from "./flatKit";

// BODY PARTS L1 · flat cards: hands, thumbs, joints, bowls of beans. Same child (orange) and
// grown-up (blue) as every DeepKids card. Wrist at (x, y), fingers pointing up unless rotated.

type Thumb = "out" | "taped" | "across";
// a hand seen flat (back of the right hand): palm, four fingers up, thumb to the left
const flatHand = (c: Ctx, x: number, y: number, s: number, thumb: Thumb = "out", rot = 0, outline?: string) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const skin = outline ? COL.paper : SKIN.child, dk = SKIN.childDk;
  const sh = (p: () => void, w = 5) => { c.beginPath(); p(); c.fillStyle = skin; c.fill(); c.lineWidth = outline ? 7 : w; c.strokeStyle = outline ?? INK; c.lineJoin = "round"; c.stroke(); };
  if (!outline) shape(c, () => rrect(c, -80, -4, 160, 74, 14), CLOTH.child, 6);
  if (thumb === "taped") sh(() => rrect(c, -128, -200, 48, 150, 24));
  if (thumb === "out") { c.save(); c.translate(-85, -110); c.rotate(-Math.PI * 0.3); sh(() => rrect(c, -23, -140, 46, 160, 23)); c.restore(); }
  sh(() => rrect(c, -95, -210, 190, 220, 50));
  const len = [130, 160, 145, 105];
  for (let k = 0; k < 4; k++) { const fx = -82 + k * 47; sh(() => rrect(c, fx, -190 - len[k], 40, len[k] + 20, 20)); if (!outline) line(c, [[fx + 8, -190 - len[k] * 0.5], [fx + 32, -190 - len[k] * 0.5]], 3, dk); }
  if (thumb === "across") { const p = [[-85, -110], [-165, -230], [-62, -318]]; line(c, p, 58, INK); line(c, p, 46, skin); }
  if (thumb === "taped") { shape(c, () => rrect(c, -150, -165, 185, 62, 6), "#f3e9d2", 4); for (const yy of [-150, -135, -120]) line(c, [[-140, yy], [25, yy]], 2, "#d8cbb0"); }
  c.restore();
};
const rice = (c: Ctx, x: number, y: number, n: number, rx: number, ry: number, sd: number) => { const r = rnd(sd); for (let i = 0; i < n; i++) { const a = r() * 6.3, d = Math.sqrt(r()); shape(c, () => ell(c, x + Math.cos(a) * d * rx, y + Math.sin(a) * d * ry, 11, 5, r() * 3), COL.paper, 2.5); } };
const grain = (c: Ctx, x: number, y: number, r: number, rot = 0) => shape(c, () => ell(c, x, y, r, r * 0.45, rot), COL.paper, 3);
const bean = (c: Ctx, x: number, y: number, r: number, rot: number) => seed(c, x, y, r, rot, false, COL.red, "#a8362a");
const beanBowl = (c: Ctx, x: number, y: number, r: number, full: boolean) => { bowl(c, x, y, r, full ? "#b8432f" : COL.steelIn); if (full) { const rd = rnd(3); for (let i = 0; i < 42; i++) { const a = rd() * 6.3, d = Math.sqrt(rd()) * 0.85; bean(c, x + Math.cos(a) * d * r, y + Math.sin(a) * d * r * 0.2 - 6, r * 0.1, rd() * 3); } } };
const coin = (c: Ctx, x: number, y: number, r: number) => { shadow(c, x + r * 0.1, y + r * 0.25, r, r * 0.6); shape(c, () => ell(c, x, y, r, r * 0.65), COL.yellow); shape(c, () => ell(c, x, y, r * 0.78, r * 0.5), COL.wood, 3); write(c, "5", x - r * 0.25, y - r * 0.32, r * 0.65, INK, 5); };
const phone = (c: Ctx, x: number, y: number, w: number, t: string) => { const h = w * 1.9; shadow(c, x + w * 0.1, y + h * 0.55, w * 0.6, w * 0.15); shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, w * 0.14), COL.black); shape(c, () => rrect(c, x - w * 0.42, y - h * 0.42, w * 0.84, h * 0.84, w * 0.06), "#22303a", 3); write(c, t, x - w * 0.3, y - w * 0.2, w * 0.38, "#c9f06b", 7); };
const sheet = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => { c.save(); c.translate(x, y); c.rotate(rot); shadow(c, 14, 16, w * 0.52, h * 0.52); shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 10), COL.paper, 5); c.restore(); };
const shirt = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s); shadow(c, 12, 150, 120, 20);
  shape(c, () => { c.moveTo(-70, -120); c.lineTo(-130, -90); c.lineTo(-110, -30); c.lineTo(-80, -40); c.lineTo(-80, 140); c.lineTo(80, 140); c.lineTo(80, -40); c.lineTo(110, -30); c.lineTo(130, -90); c.lineTo(70, -120); c.lineTo(0, -95); c.closePath(); }, COL.sky);
  line(c, [[-70, -120], [-30, -70], [0, -95], [30, -70], [70, -120]], 5);
  for (let k = 0; k < 4; k++) shape(c, () => ell(c, 0, -50 + k * 48, 12, 12), COL.paper, 3);
  c.restore();
};
const mirror = (c: Ctx) => { shadow(c, 560, 870, 300, 24); shape(c, () => rrect(c, 230, 80, 620, 790, 30), COL.wood); shape(c, () => rrect(c, 265, 115, 550, 720, 20), COL.sky, 5); line(c, [[320, 170], [320, 500]], 10, "#ffffff"); };

// ---------------------------------------------------------------- set-up cards
const sE1_0 = (c: Ctx) => { ground(c); plate(c, 260, 560, 210, 110); rice(c, 260, 548, 90, 150, 70, 5); bowl(c, 560, 540, 110); coin(c, 760, 600, 70); shirt(c, 930, 560, 0.9); };
const sE1_1 = (c: Ctx) => { ground(c); bowl(c, 560, 760, 280); hand(c, 740, 420, Math.PI * 0.7, 2.2); grain(c, 645, 560, 24, Math.PI * 0.2); arrow(c, [[380, 480], [380, 650]]); };
const sE1_2 = (c: Ctx) => { ground(c); shadow(c, 640, 1000, 300, 30); flatHand(c, 620, 930, 1.8, "taped"); };
const sE1_3 = (c: Ctx) => { ground(c); flatHand(c, 540, 240, 1.5, "taped", Math.PI); coin(c, 560, 880, 70); line(c, [[660, 900], [720, 930]], 6, RED); line(c, [[640, 960], [690, 1000]], 6, RED); };
const sE2_0 = (c: Ctx) => { ground(c); beanBowl(c, 300, 480, 220, true); beanBowl(c, 780, 480, 220, false); phone(c, 540, 850, 170, "30"); };
const sE2_1 = (c: Ctx) => { ground(c); beanBowl(c, 290, 720, 210, true); beanBowl(c, 790, 720, 210, false); hand(c, 410, 400, 0.12, 2); bean(c, 550, 418, 26, 0.3); arrow(c, [[300, 380], [540, 200], [790, 400]]); };

// ---------------------------------------------------------------- card pictures
const fE1 = (c: Ctx) => { ground(c); plate(c, 540, 820, 340, 140); rice(c, 540, 805, 160, 250, 90, 9); flatHand(c, 560, 150, 1.3, "taped", Math.PI); arrow(c, [[900, 450], [900, 640]]); };
const fE2 = (c: Ctx) => { ground(c); person(c, 250, 880, 560, { sit: true, armR: [-0.2, -0.6], armL: [Math.PI * 0.6, Math.PI * 0.3] }); beanBowl(c, 620, 820, 150, true); beanBowl(c, 910, 820, 150, false); arrow(c, [[620, 700], [770, 620], [910, 700]]); };
const fA1 = (c: Ctx) => { ground(c); mirror(c); person(c, 400, 990, 480, { armL: [Math.PI * 0.1, -Math.PI * 0.6] }); person(c, 720, 990, 650, { adult: true, armR: [Math.PI * 0.9, -Math.PI * 0.4] }); };
const fA2 = (c: Ctx) => {
  ground(c); person(c, 420, 1000, 640, { armR: [-Math.PI * 0.15, -Math.PI * 0.15], armL: [Math.PI * 0.6, Math.PI * 0.5] });
  line(c, [[520, 530], [665, 462]], 84, INK); line(c, [[520, 530], [665, 462]], 70, COL.grey);
  for (let k = 0; k < 5; k++) line(c, [[545 + k * 24, 525 - k * 11], [560 + k * 24, 518 - k * 11]], 3, COL.greyDk);
  c.beginPath(); for (let t = 0; t < 9.5; t += 0.1) { const r = 6 + t * 5.5; const px = 700 + Math.cos(t) * r, py = 435 + Math.sin(t) * r; t ? c.lineTo(px, py) : c.moveTo(px, py); } c.strokeStyle = INK; c.lineWidth = 20; c.stroke(); c.strokeStyle = COL.brown; c.lineWidth = 12; c.stroke();
  arrow(c, [[640, 380], [560, 330], [520, 400]]);
};
const fA3 = (c: Ctx) => { ground(c); sheet(c, 200, 540, 280, 360, -0.06); sheet(c, 540, 560, 280, 360, 0.03); sheet(c, 880, 540, 280, 360, 0.07); write(c, "1", 150, 420, 240, INK, 14); write(c, "2", 470, 440, 240, INK, 14); const r = rnd(4); for (let i = 0; i < 12; i++) shape(c, () => ell(c, 790 + (i % 3) * 90 + r() * 10, 420 + Math.floor(i / 3) * 80, 22, 22), COL.red, 4); };
const fA4 = (c: Ctx) => { ground(c); sheet(c, 540, 540, 940, 860); flatHand(c, 230, 560, 0.45, "out", 0, COL.red); flatHand(c, 400, 640, 0.7, "out", 0, COL.blue); flatHand(c, 620, 700, 0.9, "out", 0, COL.green); flatHand(c, 870, 760, 1.15, "out", 0, COL.purple); flatHand(c, 300, 930, 0.6, "out", 0, COL.orange); };
const fP1 = (c: Ctx) => {
  ground(c); shadow(c, 560, 720, 300, 40);
  for (const o of [16, 8, 0]) shape(c, () => rrect(c, 260 + o, 260 - o, 520, 420, 12), COL.paper, 5);
  line(c, [[300, 260], [300, 680]], 7, RED); shape(c, () => { c.moveTo(300, 300); c.quadraticCurveTo(250, 250, 300, 230); c.quadraticCurveTo(350, 250, 300, 300); }, RED, 4);
  // a crayon child on the cover
  shape(c, () => ell(c, 540, 380, 50, 50), SKIN.child, 6); line(c, [[540, 430], [540, 560], [500, 640]], 10, COL.orange); line(c, [[540, 560], [580, 640]], 10, COL.orange); line(c, [[470, 480], [610, 480]], 10, COL.orange);
  const cols = [COL.red, COL.blue, COL.green, COL.yellow]; cols.forEach((k, i) => { const x = 360 + i * 110; shape(c, () => { c.moveTo(x, 760); c.lineTo(x + 50, 760); c.lineTo(x + 50, 920); c.lineTo(x + 25, 950); c.lineTo(x, 920); c.closePath(); }, k, 5); });
};
const tThumb = (c: Ctx) => { ground(c); shadow(c, 640, 1000, 300, 30); flatHand(c, 620, 930, 1.8, "out"); arrow(c, [[150, 400], [300, 590]]); };
const tJoint = (c: Ctx) => {
  ground(c); const sh = [200, 300], el = [560, 640], wr = [900, 380];
  line(c, [sh, el, wr], 134, INK); line(c, [sh, el, wr], 118, SKIN.child);
  hand(c, wr[0], wr[1], -0.65, 1.7, SKIN.child, SKIN.child, true);
  c.beginPath(); c.arc(el[0], el[1], 120, 0, Math.PI * 2); c.strokeStyle = RED; c.lineWidth = 10; c.setLineDash([24, 18]); c.stroke(); c.setLineDash([]);
  arrow(c, [[1000, 560], [960, 760], [780, 860]]);
};
const xPinch = (c: Ctx) => { ground(c); shadow(c, 640, 1000, 300, 30); flatHand(c, 620, 930, 1.8, "across"); arrow(c, [[200, 300], [380, 260], [470, 340]]); };

export const ic_bodyBodyPartsL1 = cards("sci.body.body-parts.L1", [sE1_0, sE1_1, sE1_2, sE1_3, sE2_0, sE2_1, fE1, fE2, fA1, fA2, fA3, fA4, fP1, tThumb, tJoint, xPinch]);
