import type { Ctx } from "./core";
import { COL, SKIN, CLOTH, INK, WHITE, RED, D, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, write, ground, cards, glass, bowl } from "./flatKit";

// FAMILY · picture cards for sci.family.family.L3: the same flat look as the set-up cards.
const WALL = "#f8e6bd", FLOOR = "#d9b98a", GRAN = "#d9d4cc", PINK = "#f6b8cc", BLUE = "#a9c8f0", PAPER = "#fffaf0";
const sat = (c: Ctx, f: () => void) => { c.save(); f(); c.restore(); };

// ---------------------------------------------------------------- faces and people
type Face = { skin?: string; hair?: string; bun?: boolean; mous?: boolean; glasses?: boolean; beard?: boolean; bald?: boolean; cap?: boolean; sad?: boolean; pony?: boolean };
const faceDot = (c: Ctx, x: number, y: number, r: number, o: Face = {}) => {
  const skin = o.skin ?? SKIN.adult, hair = o.hair ?? CLOTH.hair;
  if (o.bun) shape(c, () => ell(c, x, y - r * 1.05, r * 0.38, r * 0.38), hair, 4);
  if (o.pony) shape(c, () => ell(c, x + r * 0.95, y - r * 0.2, r * 0.32, r * 0.55), hair, 4);
  if (o.beard) shape(c, () => { c.moveTo(x - r * 0.95, y + r * 0.1); c.quadraticCurveTo(x, y + r * 1.7, x + r * 0.95, y + r * 0.1); c.closePath(); }, hair, 4);
  shape(c, () => ell(c, x, y, r, r * 1.04), skin, 5);
  if (!o.bald) shape(c, () => { c.moveTo(x - r * 1.02, y - r * 0.05); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y - r * 0.05); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.02, y - r * 0.05); c.closePath(); }, hair, 4);
  if (o.cap) shape(c, () => { c.moveTo(x - r * 1.05, y - r * 0.2); c.bezierCurveTo(x - r, y - r * 1.4, x + r, y - r * 1.4, x + r * 1.05, y - r * 0.2); c.closePath(); }, WHITE, 4);
  shape(c, () => ell(c, x - r * 0.35, y + r * 0.12, r * 0.09, r * 0.12), INK, 0); shape(c, () => ell(c, x + r * 0.35, y + r * 0.12, r * 0.09, r * 0.12), INK, 0);
  if (o.glasses) { for (const s of [-1, 1]) { c.beginPath(); c.arc(x + s * r * 0.35, y + r * 0.12, r * 0.24, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 3.5; c.stroke(); } line(c, [[x - r * 0.11, y + r * 0.12], [x + r * 0.11, y + r * 0.12]], 3.5); }
  if (o.mous) { c.beginPath(); c.moveTo(x - r * 0.4, y + r * 0.36); c.quadraticCurveTo(x, y + r * 0.2, x + r * 0.4, y + r * 0.36); c.strokeStyle = INK; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); }
  c.beginPath(); if (o.sad) c.arc(x, y + r * 0.68, r * 0.26, Math.PI + 0.3, -0.3); else c.arc(x, y + r * (o.mous ? 0.5 : 0.4), r * 0.28, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.lineCap = "round"; c.stroke();
};
const KINDS: Record<string, Face> = {
  child: { skin: SKIN.child, pony: true }, boy: { skin: SKIN.child }, woman: { bun: true }, man: { mous: true },
  gran: { bun: true, hair: GRAN }, grandpa: { mous: true, hair: GRAN, glasses: true }, baby: { skin: SKIN.child },
};
const CLO: Record<string, string> = { child: COL.orange, boy: COL.green, woman: COL.pink, man: COL.blue, gran: "#e9e3d6", grandpa: "#e9e3d6", baby: COL.yellow };
// head and shoulders of a family member
const bust = (c: Ctx, x: number, y: number, r: number, k: string) => {
  const w = r * 2.5;
  shape(c, () => rrect(c, x - w / 2, y + r * 0.85, w, r * 1.5, r * 0.5), CLO[k], 5);
  shade(c, () => rrect(c, x - w / 2, y + r * 0.85, w, r * 1.5, r * 0.5), "#00000033", r * 0.3, 0, 0.5);
  faceDot(c, x, y, r, KINDS[k]);
};
// a ring behind a face, in the colour of one side of the family
const ring = (c: Ctx, x: number, y: number, r: number, col: string) => shape(c, () => ell(c, x, y, r, r), col, 5);

// a whole person: feet at (x, y), height h; arms can reach for a point (toL / toR) or use joint angles
type Opt = { adult?: boolean; elder?: boolean; man?: boolean; boy?: boolean; sad?: boolean; sit?: boolean; cloth?: [string, string]; pack?: boolean | "R"; armL?: [number, number]; armR?: [number, number]; toL?: number[]; toR?: number[]; sari?: boolean };
const reach = (sx: number, sy: number, tx: number, ty: number, l1: number, l2: number): [number, number] => {
  const d = Math.min(Math.hypot(tx - sx, ty - sy), l1 + l2 - 1), th = Math.atan2(ty - sy, tx - sx), off = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const a1 = th + (tx >= sx ? 1 : -1) * off, ex = sx + Math.cos(a1) * l1, ey = sy + Math.sin(a1) * l1;
  return [a1, Math.atan2(ty - ey, tx - ex)];
};
const fig = (c: Ctx, x: number, y: number, h: number, o: Opt = {}) => {
  const ad = !!(o.adult || o.elder || o.man), skin = ad ? SKIN.adult : SKIN.child;
  const [cloth, clothDk] = o.cloth ?? (ad ? [CLOTH.adult, CLOTH.adultDk] : [CLOTH.child, CLOTH.childDk]);
  const head = h * 0.13, hip = o.sit ? y - h * 0.06 : y - h * 0.42, sh = o.sit ? hip - h * 0.32 : y - h * 0.74, uw = h * 0.06;
  if (!o.sit) shadow(c, x + h * 0.08, y + 8, h * 0.22, h * 0.035);
  if (o.pack) shape(c, () => rrect(c, o.pack === "R" ? x + h * 0.09 : x - h * 0.21, sh + h * 0.01, h * 0.12, h * 0.27, 9), COL.teal, 5);
  if (o.sit) for (const s of [-1, 1]) { const k: number[][] = [[x + s * h * 0.05, hip], [x + h * 0.2 + s * h * 0.03, hip - h * 0.08], [x + h * 0.3 + s * h * 0.03, y]]; line(c, k, h * 0.07, INK); line(c, k, h * 0.07 - 10, "#6b5a8c"); }
  else for (const s of [-1, 1]) { line(c, [[x + s * h * 0.05, hip], [x + s * h * 0.06, y]], h * 0.075, INK); line(c, [[x + s * h * 0.05, hip], [x + s * h * 0.06, y]], h * 0.075 - 10, o.sari ? cloth : "#6b5a8c"); }
  const body = () => rrect(c, x - h * 0.13, sh - h * 0.02, h * 0.26, hip - sh + h * 0.06, h * 0.06);
  shape(c, body, cloth); shade(c, body, clothDk, h * 0.07, 0);
  if (o.sari) { shape(c, () => polyP(c, [[x + h * 0.1, sh - h * 0.02], [x + h * 0.13, sh + h * 0.04], [x - h * 0.1, hip + h * 0.04], [x - h * 0.13, hip - h * 0.04]]), COL.yellow, 5); }
  const wr: number[][] = [];
  const arm = (sx: number, to: number[] | undefined, ang: [number, number] | undefined, dflt: [number, number]) => {
    const l1 = h * 0.17, l2 = h * 0.16, sy = sh + h * 0.03, [a1, a2] = to ? reach(sx, sy, to[0], to[1], l1, l2) : ang ?? dflt;
    const ex = sx + Math.cos(a1) * l1, ey = sy + Math.sin(a1) * l1, wx = ex + Math.cos(a2) * l2, wy = ey + Math.sin(a2) * l2;
    line(c, [[sx, sy], [ex, ey], [wx, wy]], uw + 10, INK); line(c, [[sx, sy], [ex, ey], [wx, wy]], uw, cloth);
    shape(c, () => ell(c, wx, wy, uw * 0.62, uw * 0.62), skin, 5); wr.push([wx, wy]);
  };
  arm(x - h * 0.11, o.toL, o.armL, [Math.PI * 0.55, Math.PI * 0.5]); arm(x + h * 0.11, o.toR, o.armR, [Math.PI * 0.45, Math.PI * 0.5]);
  const hy = sh - head * 1.05;
  faceDot(c, x, hy, head, { skin, hair: o.elder ? GRAN : CLOTH.hair, bun: ad && !o.man, pony: !ad && !o.boy, mous: o.man, sad: o.sad });
  return wr;
};

// ---------------------------------------------------------------- things
const room = (c: Ctx, fl = 800) => { ground(c); c.fillStyle = WALL; c.fillRect(0, 0, D, fl); c.fillStyle = FLOOR; c.fillRect(0, fl, D, D - fl); line(c, [[0, fl], [D, fl]], 6); };
const clk = (c: Ctx, x: number, y: number, r: number, sweep: number) => {
  shadow(c, x + r * 0.12, y + r * 0.95, r * 0.9, r * 0.14);
  shape(c, () => ell(c, x, y, r, r), WHITE, 6);
  if (sweep > 0) { c.beginPath(); c.moveTo(x, y); c.arc(x, y, r * 0.86, -Math.PI / 2, -Math.PI / 2 + sweep); c.closePath(); c.fillStyle = COL.yellow; c.fill(); }
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.sin(a) * r * 0.8, y - Math.cos(a) * r * 0.8], [x + Math.sin(a) * r * 0.92, y - Math.cos(a) * r * 0.92]], Math.max(3, r * 0.045)); }
  line(c, [[x, y], [x, y - r * 0.74]], Math.max(4, r * 0.055)); line(c, [[x, y], [x + Math.sin(sweep) * r * 0.74, y - Math.cos(sweep) * r * 0.74]], Math.max(4, r * 0.055), RED);
  shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), INK, 0);
};
const pot = (c: Ctx, x: number, y: number, w: number) => {
  for (const s of [-1, 1]) shape(c, () => rrect(c, x + s * w * 0.5 - (s > 0 ? 0 : w * 0.14), y - w * 0.4, w * 0.14, w * 0.08, 4), COL.steelDk, 4);
  const b = () => rrect(c, x - w / 2, y - w * 0.58, w, w * 0.58, w * 0.1);
  shape(c, b, COL.steel); shade(c, b, COL.steelDk, w * 0.12, 0);
  shape(c, () => rrect(c, x - w * 0.55, y - w * 0.7, w * 1.1, w * 0.14, w * 0.06), COL.steelIn, 5);
  shape(c, () => ell(c, x, y - w * 0.76, w * 0.07, w * 0.07), COL.steelDk, 4);
};
const broom = (c: Ctx, x: number, y: number, len: number, ang: number) => sat(c, () => {
  c.translate(x, y); c.rotate(ang);
  line(c, [[0, -len * 0.15], [0, -len]], 14, INK); line(c, [[0, -len * 0.15], [0, -len]], 7, COL.wood);
  shape(c, () => polyP(c, [[-len * 0.05, -len * 0.25], [len * 0.05, -len * 0.25], [len * 0.2, 0], [-len * 0.2, 0]]), COL.yellow, 5);
  for (const u of [-0.1, 0, 0.1]) line(c, [[len * u * 0.5, -len * 0.2], [len * u * 1.4, -len * 0.02]], 3, COL.woodDk);
});
const shirt = (c: Ctx, x: number, y: number, w: number, col: string, dk: string) => sat(c, () => {
  c.translate(x, y); const u = w / 100;
  const P = [[-22, -45], [-9, -40], [9, -40], [22, -45], [50, -22], [38, -2], [24, -12], [24, 45], [-24, 45], [-24, -12], [-38, -2], [-50, -22]].map(([a, b]) => [a * u, b * u]);
  shape(c, () => polyP(c, P), col, 6); shade(c, () => polyP(c, P), dk, 14 * u, 6 * u);
});
const heart = (c: Ctx, x: number, y: number, s: number, col = RED) => shape(c, () => { c.moveTo(x, y + s * 0.9); c.bezierCurveTo(x - s * 1.4, y - s * 0.1, x - s * 0.7, y - s * 1.0, x, y - s * 0.3); c.bezierCurveTo(x + s * 0.7, y - s * 1.0, x + s * 1.4, y - s * 0.1, x, y + s * 0.9); c.closePath(); }, col, 5);
const coin = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.8), COL.yellow, 5); shape(c, () => ell(c, x, y, r * 0.6, r * 0.45), "#f2b92f", 3); };
const house = (c: Ctx, x: number, yb: number, w: number, h: number, wall: string, roof: string) => {
  shadow(c, x + w * 0.08, yb + 8, w * 0.58, 16);
  shape(c, () => rrect(c, x - w / 2, yb - h, w, h, 8), wall, 6); shade(c, () => rrect(c, x - w / 2, yb - h, w, h, 8), "#00000022", w * 0.05, 0, 0.5);
  shape(c, () => polyP(c, [[x - w / 2 - 22, yb - h + 4], [x, yb - h - w * 0.26], [x + w / 2 + 22, yb - h + 4]]), roof, 6);
};
const win = (c: Ctx, x: number, y: number, w: number, h: number) => shape(c, () => rrect(c, x, y, w, h, 10), COL.sky, 5);
const tray = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => shape(c, () => rrect(c, x, y, w, h, 18), col, 6);

// ---------------------------------------------------------------- the flow cards
// intro: a girl at a table looks at the wall clock; behind her a grown-up cooks and another sweeps
const intro = (c: Ctx) => {
  room(c, 800);
  clk(c, 560, 150, 105, Math.PI * 0.5);
  fig(c, 205, 800, 540, { adult: true, toR: [262, 540], cloth: [COL.pink, "#d17a97"] });
  shape(c, () => rrect(c, 30, 610, 390, 190, 14), COL.teal, 6); shape(c, () => rrect(c, 18, 585, 414, 40, 10), COL.tealDk, 6);
  pot(c, 270, 585, 150);
  fig(c, 560, 805, 520, { man: true, toL: [524, 540], toR: [532, 600] });
  line(c, [[505, 440], [575, 800]], 14, INK); line(c, [[505, 440], [575, 800]], 7, COL.wood);
  shape(c, () => polyP(c, [[552, 760], [598, 750], [640, 800], [545, 812]]), COL.yellow, 5);
  fig(c, 865, 815, 500, { sit: true, toL: [790, 668], toR: [870, 668] });
  shape(c, () => rrect(c, 640, 690, 400, 40, 10), COL.wood, 6); shape(c, () => rrect(c, 665, 730, 350, 34, 6), COL.woodDk, 6);
  line(c, [[690, 764], [690, 880]], 18, INK); line(c, [[690, 764], [690, 880]], 8, COL.woodDk); line(c, [[990, 764], [990, 880]], 18, INK); line(c, [[990, 764], [990, 880]], 8, COL.woodDk);
  shape(c, () => polyP(c, [[700, 688], [860, 688], [880, 650], [720, 650]]), WHITE, 5);
  line(c, [[728, 666], [848, 666]], 3, COL.glassEdge);
};

// e1: the notebook with three jobs: who did it, and the minutes
const e1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 1040, 470, 24);
  shape(c, () => rrect(c, 60, 50, 960, 960, 30), WHITE, 7);
  shape(c, () => rrect(c, 60, 50, 80, 960, 22), COL.teal, 7);
  const rows: [number, string, string, number, number][] = [[240, "pot", "gran", 1.0, 70], [520, "broom", "woman", 0.75, 60], [800, "shirt", "child", 0.5, 20]];
  for (const [y, ic, who, sweep, mins] of rows) {
    if (ic === "pot") pot(c, 270, y + 70, 170); else if (ic === "broom") broom(c, 280, y + 90, 200, 0.5); else shirt(c, 270, y, 170, COL.orange, "#d27c25");
    bust(c, 520, y - 25, 62, who);
    clk(c, 740, y, 70, sweep * Math.PI * 2 * 0.25 + 0.3);
    write(c, String(mins), 850, y - 40, 80, INK, 9);
    if (y < 800) line(c, [[180, y + 140], [980, y + 140]], 4, COL.glassEdge);
  }
};

// e2: one person folds a tall pile slowly; two people fold the same pile fast
const stack = (c: Ctx, x: number, y: number, n: number, w = 190) => { for (let i = 0; i < n; i++) { const [a, b] = [[COL.orange, "#d27c25"], [COL.blue, COL.blueDk], [COL.yellow, "#d9ae2e"], [COL.pink, "#d17a97"], [COL.purple, "#6a4fa8"]][i % 5]; shape(c, () => rrect(c, x - w / 2, y - 34 - i * 34, w, 34, 10), a, 5); } };
const e2 = (c: Ctx) => {
  ground(c);
  for (const [px, many] of [[40, false], [550, true]] as [number, boolean][]) {
    shape(c, () => rrect(c, px, 40, 490, 1000, 30), PAPER, 7);
    clk(c, px + 245, 230, 150, many ? Math.PI * 0.55 : Math.PI * 1.55);
    stack(c, px + 245, 800, 7);
    if (many) { bust(c, px + 110, 900, 60, "woman"); bust(c, px + 380, 900, 60, "child"); } else bust(c, px + 245, 900, 60, "woman");
  }
  write(c, "1", 195, 440, 70, INK, 9); write(c, "2", 720, 440, 70, INK, 9);
};

// a1: one child, four uncles, four different relations (two on each side of the family)
const a1 = (c: Ctx) => {
  ground(c);
  const U: [number, number, Face, string][] = [[210, 210, { mous: true }, PINK], [870, 210, { glasses: true, mous: true }, PINK], [210, 870, { beard: true }, BLUE], [870, 870, { bald: true, mous: true }, BLUE]];
  for (const [x, y] of U) line(c, [[540, 540], [x, y]], 9, COL.steelDk);
  for (const [x, y, f, col] of U) { ring(c, x, y, 150, col); shape(c, () => rrect(c, x - 100, y + 82, 200, 90, 40), COL.blue, 5); faceDot(c, x, y - 10, 90, f); }
  ring(c, 540, 540, 135, COL.sky);
  shape(c, () => rrect(c, 440, 600, 200, 90, 40), COL.orange, 5); faceDot(c, 540, 530, 88, KINDS.child);
};

// a2: a family tree being drawn on paper: grandparents, parents, then the child still to draw
const a2 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 1040, 470, 24);
  shape(c, () => rrect(c, 60, 50, 960, 960, 24), WHITE, 7);
  for (const [x, y, k] of [[210, 230, "gran"], [450, 230, "grandpa"]] as [number, number, string][]) { ring(c, x, y, 105, PINK); bust(c, x, y - 15, 62, k); }
  line(c, [[315, 222], [345, 222]], 8); line(c, [[315, 240], [345, 240]], 8);
  line(c, [[330, 245], [330, 455]], 8);
  ring(c, 330, 560, 105, PINK); bust(c, 330, 545, 62, "woman");
  ring(c, 720, 560, 105, BLUE); bust(c, 720, 545, 62, "man");
  line(c, [[435, 552], [615, 552]], 8); line(c, [[435, 570], [615, 570]], 8);
  line(c, [[525, 575], [525, 705]], 8);
  c.setLineDash([16, 16]); shape(c, () => ell(c, 525, 810, 105, 105), "#f4f4f8", 6); c.setLineDash([]);
  shape(c, () => polyP(c, [[690, 880], [900, 690], [940, 730], [730, 920]]), COL.yellow, 6);
  shape(c, () => polyP(c, [[690, 880], [730, 920], [660, 960]]), COL.wood, 5); shape(c, () => ell(c, 660, 960, 7, 7), INK, 0);
  shape(c, () => polyP(c, [[900, 690], [940, 730], [962, 706], [922, 668]]), COL.pink, 5);
};

// a3: a sheet with four handprints, each with a job drawn in the palm
const handPrint = (c: Ctx, x: number, y: number, s: number, col: string, rot: number, icon: (c: Ctx) => void) => sat(c, () => {
  c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const F: [number, number, number, number][] = [[-86, -150, -0.28, 70], [-30, -190, -0.08, 84], [34, -190, 0.08, 84], [90, -148, 0.3, 70]];
  for (const [fx, fy, a, l] of F) shape(c, () => { c.save(); c.translate(fx, fy + l / 2); c.rotate(a); rrect(c, -22, -l, 44, l + 40, 22); c.restore(); }, col, 6);
  shape(c, () => { c.moveTo(-110, -90); c.lineTo(110, -90); c.quadraticCurveTo(130, 60, 70, 140); c.lineTo(-40, 140); c.quadraticCurveTo(-120, 70, -110, -90); c.closePath(); }, col, 6);
  shape(c, () => { c.save(); c.translate(-96, 50); c.rotate(-0.95); rrect(c, -22, -120, 44, 150, 22); c.restore(); }, col, 6);
  shape(c, () => { c.moveTo(-100, -90); c.lineTo(100, -90); c.lineTo(70, 135); c.lineTo(-40, 135); c.closePath(); }, col, 0);
  icon(c);
});
const a3 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 1040, 470, 24);
  shape(c, () => rrect(c, 40, 40, 1000, 1000, 24), WHITE, 7);
  handPrint(c, 290, 330, 1.0, COL.teal, 0.1, (k) => pot(k, 0, 110, 110));
  handPrint(c, 780, 330, 0.9, COL.orange, -0.12, (k) => broom(k, 0, 110, 150, 0.2));
  handPrint(c, 300, 770, 0.78, COL.pink, -0.08, (k) => shirt(k, 0, 40, 110, COL.blue, COL.blueDk));
  handPrint(c, 760, 790, 0.6, COL.purple, 0.12, (k) => heart(k, 0, 30, 48));
};

// a4: marbles drawn in a circle on the ground; an elder's hand and a child's hand
const a4 = (c: Ctx) => {
  ground(c, "#e3c9a0");
  const r = ((s) => () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296))(11);
  for (let i = 0; i < 40; i++) shape(c, () => ell(c, r() * D, r() * D, 8 + r() * 10, 5 + r() * 5, r() * 3), "#d9b98a", 0);
  c.beginPath(); ell(c, 540, 540, 290, 290); c.strokeStyle = WHITE; c.lineWidth = 12; c.stroke();
  const M: [number, number, string][] = [[470, 480, COL.red], [590, 450, COL.blue], [620, 570, COL.green], [490, 610, COL.yellow], [550, 540, COL.purple], [400, 560, COL.orange]];
  for (const [x, y, col] of M) { shadow(c, x + 8, y + 12, 36, 12); shape(c, () => ell(c, x, y, 34, 34), col, 5); shine(c, [[x - 16, y - 12], [x - 6, y - 22]]); }
  hand(c, 40, 540, 0, 1.45, SKIN.adult, "#e9e3d6", true);
  hand(c, 1050, 700, Math.PI + 0.25, 1.3, SKIN.child, COL.orange);
  shape(c, () => ell(c, 880, 650, 34, 34), COL.teal, 5); shadow(c, 888, 664, 34, 10);
  arrow(c, [[860, 560], [750, 520], [660, 530]], RED, 11);
};
const shine = (c: Ctx, pts: number[][]) => { c.globalAlpha = 0.75; line(c, pts, 7, WHITE); c.globalAlpha = 1; };

// a5: an open thank-you card: Ajji's face and a heart, and her job with the minutes
const a5 = (c: Ctx) => {
  room(c, 300); c.fillStyle = "#b9e0dc"; c.fillRect(0, 0, D, D);
  shadow(c, 540, 960, 470, 30);
  shape(c, () => rrect(c, 40, 120, 500, 820, 20), PAPER, 7); shape(c, () => rrect(c, 540, 120, 500, 820, 20), WHITE, 7);
  heart(c, 290, 260, 70);
  ring(c, 290, 560, 190, PINK); bust(c, 290, 540, 110, "gran");
  pot(c, 750, 560, 250);
  clk(c, 700, 790, 80, Math.PI * 0.8); write(c, "70", 800, 750, 80, INK, 9);
  heart(c, 900, 220, 36, COL.pink);
  for (const [x, y, col] of [[120, 870, COL.red], [200, 880, COL.blue], [280, 870, COL.green]] as [number, number, string][]) { shape(c, () => rrect(c, x - 18, y - 70, 36, 110, 8), col, 5); }
};

// a6: stacks of books grow from grandmother to mother to girl
const books = (c: Ctx, x: number, y: number, n: number) => { const C2 = [COL.red, COL.blue, COL.yellow, COL.green, COL.purple, COL.orange]; for (let i = 0; i < n; i++) shape(c, () => rrect(c, x - 95 + (i % 2) * 8, y - 40 - i * 42, 190, 42, 8), C2[i % 6], 5); };
const a6 = (c: Ctx) => {
  ground(c);
  line(c, [[40, 900], [1040, 900]], 8);
  const S: [number, number, string][] = [[210, 2, "gran"], [540, 5, "woman"], [870, 8, "child"]];
  for (const [x, n, k] of S) { books(c, x, 900, n); const top = 900 - n * 42 - 40; bust(c, x, top - 100, 62, k); }
  arrow(c, [[150, 100], [540, 70], [920, 90]], RED, 11);
};

// p1: the job wheel: five jobs on a wheel that turns, one family member for each
const p1 = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 470, R = 340, cols = [COL.teal, COL.orange, COL.pink, COL.yellow, COL.purple];
  shadow(c, cx + 20, cy + R + 20, R * 0.95, 40);
  for (let i = 0; i < 5; i++) { const a0 = -Math.PI / 2 + (i * Math.PI * 2) / 5 - Math.PI / 5, a1 = a0 + (Math.PI * 2) / 5; shape(c, () => { c.moveTo(cx, cy); c.arc(cx, cy, R, a0, a1); c.closePath(); }, cols[i], 7); }
  const ic = [(x: number, y: number) => pot(c, x, y + 50, 110), (x: number, y: number) => broom(c, x - 10, y + 70, 150, 0.4), (x: number, y: number) => shirt(c, x, y, 120, COL.blue, COL.blueDk), (x: number, y: number) => { shape(c, () => ell(c, x, y, 70, 38), COL.steel); shape(c, () => ell(c, x, y - 3, 54, 28), COL.steelIn, 4); }, (x: number, y: number) => glass(c, x, y + 50, 80, 110, 0.6)];
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i * Math.PI * 2) / 5; ic[i](cx + Math.cos(a) * R * 0.62, cy + Math.sin(a) * R * 0.62); }
  shape(c, () => ell(c, cx, cy, 44, 44), WHITE, 7);
  shape(c, () => polyP(c, [[cx - 36, cy - R - 54], [cx + 36, cy - R - 54], [cx, cy - R + 14]]), RED, 7);
  c.beginPath(); c.arc(cx, cy, R + 40, -0.1, 0.9); c.strokeStyle = RED; c.lineWidth = 11; c.lineCap = "round"; c.stroke();
  arrow(c, [[cx + Math.cos(0.7) * (R + 40), cy + Math.sin(0.7) * (R + 40)], [cx + Math.cos(0.92) * (R + 40), cy + Math.sin(0.92) * (R + 40)]], RED, 11);
  const K = ["gran", "man", "woman", "child", "boy"];
  for (let i = 0; i < 5; i++) { const x = 130 + i * 205; ring(c, x, 955, 66, cols[i]); faceDot(c, x, 950, 46, KINDS[K[i]]); }
};

// c1: everyone helps make the dinner: four hands round one pot
const c1 = (c: Ctx) => {
  ground(c, "#d9b98a");
  shape(c, () => ell(c, 540, 540, 480, 480), "#f1e0b8", 6);
  shadow(c, 560, 650, 200, 40);
  shape(c, () => ell(c, 540, 540, 190, 190), COL.steel); shape(c, () => ell(c, 540, 540, 150, 150), "#e9a63a", 6);
  shape(c, () => ell(c, 540, 540, 120, 120), "#f4c35b", 0);
  shape(c, () => rrect(c, 330, 520, 50, 40, 10), COL.steelDk, 5); shape(c, () => rrect(c, 700, 520, 50, 40, 10), COL.steelDk, 5);
  // ladle (left hand), carrot (top hand), plates (right hand), bowl of rice (bottom hand)
  line(c, [[140, 540], [480, 540]], 18, INK); line(c, [[140, 540], [480, 540]], 9, COL.steelDk);
  shape(c, () => ell(c, 490, 540, 38, 38), COL.steel, 6);
  hand(c, 20, 540, 0, 1.25, SKIN.adult, COL.pink);
  shape(c, () => polyP(c, [[510, 100], [570, 100], [545, 330]]), COL.orange, 6); line(c, [[520, 80], [510, 40]], 8, COL.green); line(c, [[550, 80], [570, 36]], 8, COL.green);
  hand(c, 540, 40, Math.PI / 2, 1.2, SKIN.child, COL.green);
  for (let i = 0; i < 3; i++) shape(c, () => ell(c, 880, 520 - i * 14, 85, 38), i % 2 ? COL.steelIn : COL.steel, 5);
  hand(c, 1060, 540, Math.PI, 1.25, SKIN.adult, COL.blue);
  bowl(c, 540, 860, 85, "#fff7dc");
  hand(c, 540, 1070, -Math.PI / 2, 1.2, SKIN.child, COL.orange);
};

// c2: a tray with a ring that holds the glass, a grip mat, and two handles for shaky hands
const c2 = (c: Ctx) => {
  room(c, 820);
  shape(c, () => polyP(c, [[300, 560], [790, 560], [880, 700], [210, 700]]), COL.wood, 6);
  shape(c, () => polyP(c, [[210, 700], [880, 700], [880, 760], [210, 760]]), COL.woodDk, 6);
  shape(c, () => rrect(c, 120, 700, 100, 54, 24), COL.woodDk, 6); shape(c, () => rrect(c, 870, 700, 100, 54, 24), COL.woodDk, 6);
  shape(c, () => ell(c, 545, 640, 120, 36), COL.teal, 5);
  glass(c, 545, 650, 120, 200, 0.75);
  shape(c, () => ell(c, 545, 650, 94, 22), "rgba(0,0,0,0)", 0);
  c.beginPath(); c.ellipse(545, 650, 92, 24, 0, 0, Math.PI); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  line(c, [[455, 650], [455, 618]], 12, INK); line(c, [[635, 650], [635, 618]], 12, INK);
  hand(c, 50, 735, 0, 1.5, SKIN.adult, "#e9e3d6");
  hand(c, 1030, 735, Math.PI, 1.5, SKIN.adult, "#e9e3d6");
  for (const s of [-1, 1]) { const bx = s < 0 ? 150 : 930; line(c, [[bx - 40 * s, 640], [bx + 10 * s, 610], [bx - 40 * s, 580], [bx + 10 * s, 550]], 9, RED); }
};

// ---------------------------------------------------------------- the term cards
// term 1 Relative: a relative lives in a far house but is still family
const t1 = (c: Ctx) => {
  ground(c, "#d9b98a");
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 520); c.fillStyle = "#cfe9bd"; c.fillRect(0, 520, D, 260); line(c, [[0, 520], [D, 520]], 6); line(c, [[0, 780], [D, 780]], 6);
  shape(c, () => { c.moveTo(480, 520); c.quadraticCurveTo(740, 280, 1040, 520); c.closePath(); }, "#9ccf62", 6);
  house(c, 800, 500, 240, 190, COL.cloth, COL.purple);
  shape(c, () => rrect(c, 780, 430, 50, 70, 8), COL.woodDk, 5);
  win(c, 700, 410, 54, 54); faceDot(c, 727, 440, 20, KINDS.woman); win(c, 860, 410, 54, 54); faceDot(c, 887, 440, 20, KINDS.man);
  house(c, 230, 800, 320, 250, COL.cloth, COL.red);
  shape(c, () => rrect(c, 200, 670, 66, 130, 8), COL.woodDk, 5); win(c, 100, 640, 60, 60);
  fig(c, 430, 960, 400, { cloth: [COL.orange, "#d27c25"] });
  c.setLineDash([24, 20]); line(c, [[560, 930], [640, 800], [520, 640], [770, 520]], 9, COL.greyDk); c.setLineDash([]);
  heart(c, 600, 330, 80);
};

// term 2 Generation: three steps down, grandmother, father, girl
const t2 = (c: Ctx) => {
  ground(c);
  const S: [number, number, number, string][] = [[40, 420, 380, COL.teal], [420, 620, 330, COL.blue], [750, 820, 290, COL.purple]];
  for (const [x, y, w, col] of S) { shape(c, () => rrect(c, x, y, w, 1040 - y, 12), col, 7); shape(c, () => rrect(c, x, y, w, 26, 8), "#ffffff55", 0); }
  fig(c, 230, 420, 340, { elder: true, cloth: ["#e9e3d6", "#c9c2b2"] });
  fig(c, 590, 620, 340, { man: true });
  fig(c, 900, 820, 250, {});
  arrow(c, [[300, 120], [620, 200], [900, 420]], RED, 11);
};

// term 3 Mother's side and father's side: a tree, two branches, a child at the root
const t3 = (c: Ctx) => {
  ground(c);
  const br = (pts: number[][]) => { line(c, pts, 62, INK); line(c, pts, 48, COL.brown); };
  br([[540, 1000], [540, 640], [330, 470]]); br([[540, 640], [750, 470]]);
  ring(c, 300, 300, 230, PINK); ring(c, 780, 300, 230, BLUE);
  bust(c, 210, 260, 62, "gran"); bust(c, 400, 300, 62, "grandpa");
  bust(c, 680, 300, 62, "man"); bust(c, 880, 260, 62, "woman");
  ring(c, 540, 870, 120, COL.sky); shape(c, () => rrect(c, 460, 940, 160, 100, 40), COL.orange, 5); faceDot(c, 540, 870, 88, KINDS.child);
};

// term 4 Joint and nuclear: a big house with many people, a small flat with three
const t4 = (c: Ctx) => {
  ground(c); line(c, [[0, 940], [D, 940]], 6);
  house(c, 340, 940, 580, 520, COL.cloth, COL.red);
  const F = ["gran", "grandpa", "woman", "man", "child", "boy"];
  for (let i = 0; i < 6; i++) { const x = 90 + (i % 3) * 180, y = 470 + Math.floor(i / 3) * 230; win(c, x, y, 150, 190); faceDot(c, x + 75, y + 110, 42, KINDS[F[i]]); }
  shape(c, () => rrect(c, 720, 640, 300, 300, 8), COL.sky, 6); shape(c, () => rrect(c, 720, 600, 300, 50, 8), COL.purple, 6);
  win(c, 745, 700, 250, 150);
  for (const [x, k] of [[800, "woman"], [870, "man"], [940, "child"]] as [number, string][]) faceDot(c, x, 800, 32, KINDS[k]);
};

// term 5 Guardian: a grandmother holds her granddaughter's hand on the way to school
const t5 = (c: Ctx) => {
  room(c, 880);
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 560); line(c, [[0, 560], [D, 560]], 0);
  house(c, 870, 880, 330, 300, "#f7c9a0", COL.red); shape(c, () => rrect(c, 820, 740, 90, 140, 10), COL.woodDk, 5);
  line(c, [[870, 580], [870, 430]], 8); shape(c, () => polyP(c, [[870, 430], [960, 460], [870, 490]]), COL.orange, 5);
  fig(c, 400, 930, 620, { elder: true, cloth: ["#e9e3d6", "#c9c2b2"], toR: [535, 670] });
  fig(c, 600, 930, 440, { pack: true, toL: [535, 670] });
};

// term 6 Unpaid work: the same washing; one pays coins, one does not
const t6 = (c: Ctx) => {
  ground(c);
  for (const [px, paid] of [[30, false], [550, true]] as [number, boolean][]) {
    shape(c, () => rrect(c, px, 40, 500, 1000, 28), WHITE, 7);
    shape(c, () => ell(c, px + 250, 700, 200, 70), COL.steelDk, 6);
    shape(c, () => ell(c, px + 250, 690, 180, 55), COL.water, 5);
    shape(c, () => ell(c, px + 90, 690, 56, 22), COL.steel); shape(c, () => ell(c, px + 90, 687, 42, 15), COL.steelIn, 4);
    shape(c, () => ell(c, px + 415, 700, 34, 20), COL.steel, 5);
    for (const [bx, by, br] of [[px + 110, 620, 20], [px + 420, 620, 16], [px + 250, 590, 14]]) shape(c, () => ell(c, bx, by, br, br), COL.drop, 4);
    hand(c, px + 190, 500, Math.PI / 2, 1.5, SKIN.adult, "#e9e3d6", true);
    hand(c, px + 310, 500, Math.PI / 2, 1.5, SKIN.adult, "#e9e3d6", true);
    if (paid) { for (let i = 0; i < 4; i++) coin(c, px + 250, 960 - i * 28, 70); coin(c, px + 360, 960, 60); }
  }
  line(c, [[540, 40], [540, 1040]], 8);
};

// term 7 Care work: a girl steadies her grandfather as he walks down the corridor
const t7 = (c: Ctx) => {
  room(c, 860);
  shape(c, () => rrect(c, 760, 220, 240, 640, 8), COL.woodDk, 6); shape(c, () => ell(c, 960, 560, 14, 14), COL.yellow, 4);
  win(c, 80, 200, 220, 260);
  fig(c, 560, 940, 600, { elder: true, man: true, cloth: ["#e9e3d6", "#c9c2b2"], toL: [470, 690], toR: [640, 800] });
  line(c, [[640, 800], [650, 940]], 14, INK); line(c, [[640, 800], [650, 940]], 7, COL.wood);
  fig(c, 340, 940, 430, { toR: [470, 690] });
};

// term 8 Discrimination: the brother walks to school; the sister stays at home with a broom
const t8 = (c: Ctx) => {
  room(c, 880);
  house(c, 200, 880, 360, 480, COL.cloth, COL.red);
  shape(c, () => rrect(c, 100, 540, 200, 340, 10), "#6b4a3a", 6);
  fig(c, 200, 900, 480, { sad: true, toR: [270, 700] });
  line(c, [[275, 440], [275, 900]], 14, INK); line(c, [[275, 440], [275, 900]], 7, COL.wood);
  shape(c, () => polyP(c, [[250, 800], [300, 800], [330, 900], [225, 900]]), COL.yellow, 5);
  fig(c, 560, 900, 460, { boy: true, pack: true, cloth: [COL.green, COL.greenDk] });
  arrow(c, [[640, 760], [720, 760]], RED, 11);
  house(c, 900, 880, 300, 380, "#f7c9a0", COL.purple); shape(c, () => rrect(c, 850, 700, 90, 180, 10), COL.woodDk, 5);
  line(c, [[900, 480], [900, 340]], 8); shape(c, () => polyP(c, [[900, 340], [980, 366], [900, 392]]), COL.orange, 5);
};

// term 9 Equal rights: a girl and a boy walk to school side by side
const t9 = (c: Ctx) => {
  room(c, 880);
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 560);
  shape(c, () => ell(c, 880, 160, 70, 70), COL.yellow, 6);
  house(c, 840, 780, 330, 300, "#f7c9a0", COL.red); shape(c, () => rrect(c, 790, 640, 90, 140, 10), COL.woodDk, 5);
  fig(c, 360, 920, 560, { boy: true, pack: true, cloth: [COL.green, COL.greenDk], toR: [440, 770] });
  fig(c, 560, 920, 540, { pack: "R", toL: [440, 770] });
};

// ---------------------------------------------------------------- the explanation cards
// explanation 0: four kinds of family
const x0 = (c: Ctx) => {
  ground(c);
  const P: [number, number, string][] = [[40, 40, "#fbe0b8"], [560, 40, "#cfeee9"], [40, 560, "#e6dcf6"], [560, 560, "#fbd6df"]];
  for (const [x, y, col] of P) shape(c, () => rrect(c, x, y, 480, 480, 30), col, 7);
  const rowOf = (ks: string[], x0_: number, y: number, r: number, dx: number) => ks.forEach((k, i) => bust(c, x0_ + i * dx, y, r, k));
  rowOf(["gran", "grandpa", "woman"], 125, 160, 44, 135); rowOf(["man", "child", "boy"], 125, 330, 44, 135);

  bust(c, 710, 220, 78, "woman"); bust(c, 880, 330, 62, "child");
  rowOf(["grandpa", "gran"], 140, 740, 62, 165); bust(c, 222, 880, 52, "boy");
  bust(c, 690, 760, 72, "woman"); bust(c, 860, 760, 72, "man");
  shape(c, () => ell(c, 775, 930, 72, 44), "#fffaf0", 5); faceDot(c, 775, 920, 40, KINDS.baby);
};

// explanation 1: a family tree with Amma's side and Appa's side
const x1 = (c: Ctx) => {
  ground(c); shape(c, () => rrect(c, 30, 30, 1020, 1020, 30), WHITE, 7);
  const node = (x: number, y: number, k: string, col: string) => { ring(c, x, y, 92, col); bust(c, x, y - 12, 54, k); };
  line(c, [[275, 190], [275, 330]], 8); line(c, [[150, 330], [400, 330]], 8); line(c, [[150, 330], [150, 460]], 8); line(c, [[400, 330], [400, 460]], 8);
  line(c, [[650, 330], [900, 330]], 8); line(c, [[650, 330], [650, 460]], 8); line(c, [[900, 330], [900, 460]], 8); c.setLineDash([14, 14]); line(c, [[775, 330], [775, 250]], 8); c.setLineDash([]);
  line(c, [[492, 560], [558, 560]], 8); line(c, [[492, 574], [558, 574]], 8); line(c, [[525, 590], [525, 700]], 8);
  node(180, 180, "grandpa", PINK); node(370, 180, "gran", PINK);
  node(150, 560, "man", PINK); node(400, 560, "woman", PINK); node(650, 560, "man", BLUE); node(900, 560, "woman", BLUE);
  ring(c, 525, 800, 100, COL.sky); bust(c, 525, 790, 62, "child");
};

// explanation 2: the bar chart, 299 minutes and 97 minutes
const x2 = (c: Ctx) => {
  room(c, 1000);
  shape(c, () => rrect(c, 60, 50, 960, 960, 24), WHITE, 7);
  line(c, [[150, 760], [960, 760]], 8);
  const hW = 540, hM = Math.round(540 * 97 / 299);
  shape(c, () => rrect(c, 250, 760 - hW, 200, hW, 14), COL.red, 6); shade(c, () => rrect(c, 250, 760 - hW, 200, hW, 14), "#00000033", 26, 0, 0.4);
  shape(c, () => rrect(c, 620, 760 - hM, 200, hM, 14), COL.blue, 6); shade(c, () => rrect(c, 620, 760 - hM, 200, hM, 14), "#00000033", 26, 0, 0.4);
  write(c, "299", 262, 760 - hW - 100, 70, INK, 9); write(c, "97", 658, 760 - hM - 100, 70, INK, 9);
  pot(c, 350, 360, 110); pot(c, 720, 720, 70);
  bust(c, 350, 840, 52, "woman"); bust(c, 720, 840, 52, "man");
};

// explanation 3: a mother takes her daughter for a vaccination
const x3 = (c: Ctx) => {
  room(c, 900);
  shape(c, () => ell(c, 860, 190, 100, 100), WHITE, 6); shape(c, () => rrect(c, 840, 130, 40, 120, 6), RED, 0); shape(c, () => rrect(c, 800, 170, 120, 40, 6), RED, 0);
  faceDot(c, 840, 520, 62, { cap: true, hair: CLOTH.hair, bun: false });
  shape(c, () => rrect(c, 775, 585, 130, 240, 40), WHITE, 5);
  shape(c, () => rrect(c, 640, 680, 400, 220, 14), COL.teal, 6); shape(c, () => rrect(c, 625, 655, 430, 40, 10), COL.tealDk, 6);
  shape(c, () => rrect(c, 930, 610, 90, 36, 8), COL.steelIn, 5); line(c, [[930, 628], [900, 628]], 6);
  fig(c, 270, 920, 600, { adult: true, cloth: [COL.pink, "#d17a97"], toR: [440, 700] });
  fig(c, 500, 920, 440, { pack: true, toL: [440, 700] });
};

// explanation 4: a teacher walks to the girls' school with a cloth bag
const x4 = (c: Ctx) => {
  room(c, 900);
  house(c, 840, 900, 340, 480, "#f7c9a0", COL.purple);
  shape(c, () => rrect(c, 770, 640, 140, 260, 60), "#6b4a3a", 6);
  faceDot(c, 800, 740, 36, KINDS.child); faceDot(c, 870, 760, 34, KINDS.child);
  fig(c, 420, 920, 620, { adult: true, sari: true, cloth: ["#3f9d6a", "#2d7a50"], toR: [560, 690] });
  shape(c, () => polyP(c, [[520, 690], [610, 690], [630, 800], [500, 800]]), COL.cloth, 6); line(c, [[535, 690], [550, 640], [595, 640], [605, 690]], 6);
};

// explanation 5: animal families: a crow's nest, a penguin with an egg
const crow = (c: Ctx, x: number, y: number, s: number, flip: number) => sat(c, () => {
  c.translate(x, y); c.scale(s * flip, s);
  shape(c, () => polyP(c, [[-70, 10], [-150, 50], [-130, 70], [-60, 40]]), COL.black, 5);
  shape(c, () => ell(c, 0, 0, 90, 55, -0.15), COL.black, 6);
  shape(c, () => ell(c, 40, -20, 50, 32, -0.3), "#8d8a99", 0);
  shape(c, () => ell(c, 80, -50, 38, 36), COL.black, 6);
  shape(c, () => polyP(c, [[110, -58], [160, -44], [110, -34]]), "#4a4452", 5);
  shape(c, () => ell(c, 92, -58, 6, 6), WHITE, 3);
  line(c, [[-10, 54], [-14, 90]], 6); line(c, [[24, 54], [28, 90]], 6);
});
const x5 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 30, 30, 520, 1020, 30), "#cfe6f5", 7); shape(c, () => rrect(c, 530, 30, 520, 1020, 30), "#eaf4fb", 7);
  shape(c, () => rrect(c, 250, 780, 80, 250, 10), COL.brown, 6);
  shape(c, () => ell(c, 290, 560, 250, 250), COL.leaf, 6); shape(c, () => ell(c, 330, 620, 190, 170), COL.leafDk, 0);
  shape(c, () => ell(c, 290, 760, 190, 70), COL.brown, 6);
  for (let i = 0; i < 12; i++) line(c, [[110 + i * 30, 740], [140 + i * 28, 790]], 5, COL.soilDk);
  for (const x of [215, 290, 365]) { shape(c, () => ell(c, x, 710, 38, 32), COL.pink, 5); shape(c, () => polyP(c, [[x - 28, 700], [x + 28, 700], [x, 656]]), COL.yellow, 5); }
  crow(c, 190, 450, 1, 1); crow(c, 420, 300, 0.9, -1);
  shape(c, () => ell(c, 345, 425, 12, 12), COL.red, 4);
  arrow(c, [[310, 400], [290, 560], [290, 640]], RED, 8);
  // penguin
  shape(c, () => ell(c, 800, 945, 190, 28), "#ffffff", 0);
  shape(c, () => ell(c, 800, 600, 150, 270), COL.black, 6);
  shape(c, () => ell(c, 800, 650, 105, 200), WHITE, 5);
  shape(c, () => ell(c, 800, 380, 82, 92), COL.black, 6);
  shape(c, () => ell(c, 810, 440, 38, 40), COL.yellow, 0);
  shape(c, () => polyP(c, [[795, 390], [875, 410], [795, 436]]), COL.orange, 5);
  shape(c, () => ell(c, 780, 365, 9, 9), WHITE, 3);
  shape(c, () => ell(c, 800, 868, 120, 60), "#d8dce6", 5);
  shape(c, () => ell(c, 800, 850, 46, 62), WHITE, 6);
  for (const s of [-1, 1]) shape(c, () => ell(c, 800 + s * 52, 930, 50, 20), COL.orange, 5);
  shape(c, () => ell(c, 668, 600, 38, 130, 0.15), COL.black, 6); shape(c, () => ell(c, 932, 600, 38, 130, -0.15), COL.black, 6);
};

// explanation 6: the baby passes from mother to grandmother while big sister holds a toy
const x6 = (c: Ctx) => {
  room(c, 900);
  fig(c, 230, 960, 600, { adult: true, cloth: [COL.pink, "#d17a97"], toR: [470, 640], toL: [260, 760] });
  fig(c, 850, 960, 570, { elder: true, cloth: ["#7aa6d8", COL.blueDk], toL: [610, 640], toR: [880, 780] });
  fig(c, 560, 1010, 360, { toR: [650, 720] });
  shape(c, () => ell(c, 540, 650, 100, 52, -0.2), "#fffaf0", 6); faceDot(c, 570, 610, 42, KINDS.baby);
  shape(c, () => ell(c, 650, 714, 28, 28), COL.red, 5); shape(c, () => ell(c, 650, 714, 11, 11), COL.yellow, 3);
  arrow(c, [[300, 470], [540, 400], [780, 470]], RED, 11);
};

export const ic_familyFamilyL3 = cards("sci.family.family.L3 cards", [intro, e1, e2, a1, a2, a3, a4, a5, a6, p1, c1, c2, t1, t2, t3, t4, t5, t6, t7, t8, t9, x0, x1, x2, x3, x4, x5, x6]);
