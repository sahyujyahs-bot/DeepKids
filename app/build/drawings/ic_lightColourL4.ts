import type { Ctx } from "./core";
import { cards, INK, COL, shape, ell, rrect, shadow, shade, line, polyP, WHITE } from "./flatKit";

// LIGHT AND COLOUR (L4): set-up cards for the coloured-shadow and highlighter experiments, plus four card pictures.
// No people. Light comes from torches that are aimed exactly at their patch on the wall.

const WALL = "#f5f0e3", TABLE = "#e6c488", WT = 700;
const LIGHT = { red: "#f2877c", green: "#8fd48a", blue: "#8ea9f2", yellow: "#f7e56c", cyan: "#72dcd6", magenta: "#e68ad8", white: "#ffffff" };
const GEL = { red: "rgba(215,55,43,0.62)", green: "rgba(60,165,70,0.62)", blue: "rgba(60,100,220,0.62)" };
const BEAM = { red: "rgba(225,70,55,0.30)", green: "rgba(70,180,80,0.30)", blue: "rgba(70,100,230,0.30)", white: "rgba(255,240,170,0.6)" };
const SHADOWCOL = { red: "#8a2a2a", green: "#2d6a35" };
type P = [number, number];

const room = (c: Ctx, ty = WT) => {
  c.fillStyle = WALL; c.fillRect(0, 0, 1080, ty);
  c.fillStyle = TABLE; c.fillRect(0, ty, 1080, 1080 - ty);
  line(c, [[0, ty], [1080, ty]], 6);
};
const onWall = (c: Ctx, f: () => void) => { c.save(); c.beginPath(); c.rect(0, 0, 1080, WT); c.clip(); f(); c.restore(); line(c, [[0, WT], [1080, WT]], 6); };
const lit = (c: Ctx, e: number[], col: string) => { c.beginPath(); ell(c, e[0], e[1], e[2], e[3]); c.fillStyle = col; c.fill(); };
// the part of the wall where several lit ellipses overlap
const overlap = (c: Ctx, es: number[][], col: string) => {
  c.save();
  es.forEach((e) => { c.beginPath(); ell(c, e[0], e[1], e[2], e[3]); c.clip(); });
  c.fillStyle = col; c.fillRect(0, 0, 1080, 1080); c.restore();
};
const strip = (c: Ctx, x: number, w: number, col: string, y0 = 320) => shape(c, () => rrect(c, x - w / 2, y0, w, WT - y0, w / 2), col, 0);
const aim = (a: P, t: P) => Math.atan2(t[1] - a[1], t[0] - a[0]);
const beamTo = (c: Ctx, a: P, t: P, w0: number, w1: number, col: string, flatEnd = false) => {
  const d = aim(a, t), nx = -Math.sin(d), ny = Math.cos(d), ex = flatEnd ? nx : 0, ey = flatEnd ? ny : 1;
  c.beginPath(); c.moveTo(a[0] + nx * w0, a[1] + ny * w0); c.lineTo(t[0] + ex * w1, t[1] + ey * w1); c.lineTo(t[0] - ex * w1, t[1] - ey * w1); c.lineTo(a[0] - nx * w0, a[1] - ny * w0); c.closePath();
  c.fillStyle = col; c.fill();
};

// a torch: back-centre at (x, y), pointing at angle ang, scale s; gel = a coloured cellophane held on the front by a rubber band.
// returns the centre of its front
const torch = (c: Ctx, x: number, y: number, ang: number, s: number, gel?: string): P => {
  shadow(c, x + Math.cos(ang) * 130 * s + 8, y + 42 * s, 140 * s * Math.abs(Math.cos(ang)) + 30 * s, 10 * s);
  c.save(); c.translate(x, y); c.rotate(ang); if (Math.cos(ang) < 0) c.scale(1, -1); c.scale(s, s);
  const body = () => rrect(c, 0, -38, 200, 76, 16);
  shape(c, body, COL.teal); shade(c, body, COL.tealDk, -4, -14, 0.55);
  for (const gx of [28, 56, 84]) line(c, [[gx, -24], [gx, 24]], 5, COL.tealDk);
  shape(c, () => rrect(c, 120, -52, 46, 16, 6), COL.orange, 5);
  shape(c, () => polyP(c, [[200, -32], [258, -62], [258, 62], [200, 32]]), COL.steelDk);
  shape(c, () => ell(c, 258, 0, 10, 52), "#fff3b8", 4);
  if (gel) {
    shape(c, () => rrect(c, 262, -72, 18, 144, 6), gel, 5);
    shape(c, () => rrect(c, 230, -64, 16, 128, 5), "#6b3b2a", 4);
  }
  c.restore();
  return [x + Math.cos(ang) * (gel ? 280 : 262) * s, y + Math.sin(ang) * (gel ? 280 : 262) * s];
};
const prop = (c: Ctx, x: number, y: number) => { shadow(c, x + 10, y + 62, 70, 10); shape(c, () => rrect(c, x - 45, y, 90, 58, 8), COL.wood); };

const clay = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 14, y + 28, 84, 14);
  shape(c, () => { c.moveTo(x - 72, y + 16); c.bezierCurveTo(x - 70, y - 34, x + 70, y - 34, x + 72, y + 16); c.bezierCurveTo(x + 50, y + 34, x - 50, y + 34, x - 72, y + 16); c.closePath(); }, "#c98a64", 6);
};
// a pencil standing point-up in a lump of clay: its foot is at (x, base), its point at (x, top)
const pencil = (c: Ctx, x: number, top: number, base: number) => {
  const bt = top + 70, body = () => rrect(c, x - 15, bt, 30, base - bt, 3);
  shape(c, body, "#ffc93c", 5); shade(c, body, "#e5a21e", -10, 0, 0.8);
  shape(c, () => polyP(c, [[x - 15, bt], [x + 15, bt], [x, top]]), "#f1d3a0", 5);
  shape(c, () => polyP(c, [[x - 4.5, top + 19], [x + 4.5, top + 19], [x, top]]), COL.black, 2);
  clay(c, x, base);
};

// ---------------------------------------------------------------- coloured shadows
const E1_BACK_L: P = [50, 745], E1_BACK_R: P = [1030, 745];

// one torch alone, pencil in front of the wall; the shadow is the dark colour of that light
const oneTorch = (c: Ctx, col: "red" | "green") => {
  room(c);
  const T: P = [700, 440];
  const ang = aim(E1_BACK_L, T);
  const front: P = [E1_BACK_L[0] + Math.cos(ang) * 280 * 0.9, E1_BACK_L[1] + Math.sin(ang) * 280 * 0.9];
  beamTo(c, front, T, 50, 150, BEAM[col]);
  onWall(c, () => { lit(c, [T[0], T[1], 240, 250], LIGHT[col]); strip(c, T[0], 40, SHADOWCOL[col]); });
  prop(c, 175, 726);
  torch(c, E1_BACK_L[0], E1_BACK_L[1], ang, 0.9, GEL[col]);
  pencil(c, 470, 340, 750);
};

// red torch on the left, green torch on the right: a yellow overlap, a green shadow and a red shadow.
// The pencil blocks the red light on its right (that spot only gets green) and the green light on its left (only red).
const bothTorches = (c: Ctx, withTorches: boolean) => {
  room(c);
  const Tr: P = [640, 440], Tg: P = [440, 440], R = [Tr[0], Tr[1], 300, 250], G = [Tg[0], Tg[1], 300, 250];
  const aR = aim(E1_BACK_L, Tr), aG = aim(E1_BACK_R, Tg);
  if (withTorches) {
    beamTo(c, [E1_BACK_L[0] + Math.cos(aR) * 252, E1_BACK_L[1] + Math.sin(aR) * 252], Tr, 50, 150, BEAM.red);
    beamTo(c, [E1_BACK_R[0] + Math.cos(aG) * 252, E1_BACK_R[1] + Math.sin(aG) * 252], Tg, 50, 150, BEAM.green);
  }
  onWall(c, () => { lit(c, R, LIGHT.red); lit(c, G, LIGHT.green); overlap(c, [R, G], LIGHT.yellow); strip(c, Tr[0], 44, LIGHT.green); strip(c, Tg[0], 44, LIGHT.red); });
  if (withTorches) {
    prop(c, 175, 726); prop(c, 905, 726);
    torch(c, E1_BACK_L[0], E1_BACK_L[1], aR, 0.9, GEL.red);
    torch(c, E1_BACK_R[0], E1_BACK_R[1], aG, 0.9, GEL.green);
  }
  pencil(c, 540, 340, 750);
};

// red, green and blue torches: white middle, and three shadows: cyan (no red), magenta (no green), yellow (no blue)
const threeTorches = (c: Ctx) => {
  room(c);
  const Tr: P = [640, 440], Tb: P = [440, 440], Tg: P = [540, 440];
  const R = [Tr[0], Tr[1], 300, 250], B = [Tb[0], Tb[1], 300, 250], G = [Tg[0], Tg[1], 300, 250];
  const aR = aim(E1_BACK_L, Tr), aB = aim(E1_BACK_R, Tb);
  beamTo(c, [E1_BACK_L[0] + Math.cos(aR) * 252, E1_BACK_L[1] + Math.sin(aR) * 252], Tr, 50, 150, BEAM.red);
  beamTo(c, [E1_BACK_R[0] + Math.cos(aB) * 252, E1_BACK_R[1] + Math.sin(aB) * 252], Tb, 50, 150, BEAM.blue);
  beamTo(c, [540, 872], Tg, 38, 150, BEAM.green, true);
  onWall(c, () => {
    lit(c, R, LIGHT.red); lit(c, B, LIGHT.blue); lit(c, G, LIGHT.green);
    overlap(c, [R, G], LIGHT.yellow); overlap(c, [G, B], LIGHT.cyan); overlap(c, [R, B], LIGHT.magenta); overlap(c, [R, G, B], LIGHT.white);
    strip(c, Tr[0], 44, LIGHT.cyan); strip(c, Tb[0], 44, LIGHT.yellow); strip(c, Tg[0], 72, LIGHT.magenta);
  });
  prop(c, 175, 726); prop(c, 905, 726);
  torch(c, E1_BACK_L[0], E1_BACK_L[1], aR, 0.9, GEL.red);
  torch(c, E1_BACK_R[0], E1_BACK_R[1], aB, 0.9, GEL.blue);
  torch(c, 540, 1065, -Math.PI / 2, 0.7, GEL.green);
  pencil(c, 540, 340, 750);
};

// two torches lying side by side on a table, seen from above, a coloured cellophane held on each by a rubber band
const torchPair = (c: Ctx) => {
  c.fillStyle = TABLE; c.fillRect(0, 0, 1080, 1080);
  torch(c, 270, 330, 0, 1.7, GEL.red);
  torch(c, 270, 740, 0, 1.7, GEL.green);
};

// ---------------------------------------------------------------- highlighter stripes
const HL = { y: "#ffe34d", p: "#ff8fc0", b: "#6fc4ee" };
const MIX: Record<string, string> = { yb: "#69c468", by: "#69c468", yp: "#ff8a55", py: "#ff8a55", pb: "#9a7fd0", bp: "#9a7fd0", yy: "#f2c400", pp: "#f0609e", bb: "#3a9fd8" };
const ROWS = ["y", "p", "b"], COLS = ["b", "y", "p"];
const page = (c: Ctx, x: number, y: number, w: number, h: number) => {
  c.fillStyle = TABLE; c.fillRect(0, 0, 1080, 1080);
  shadow(c, x + w / 2 + 14, y + h + 6, w / 2 + 6, 22);
  shape(c, () => rrect(c, x, y, w, h, 6), COL.paper, 6);
};
const bar = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => shape(c, () => rrect(c, x, y, w, h, 12), col, 0);
// three wide stripes across (yellow, pink, blue) and three down (blue, yellow, pink); every crossing in the colour the two inks leave
const grid = (c: Ctx, left: number, top: number, sw: number, sh: number, gx: number, gy: number, ext: number, across: boolean, down: boolean, box: boolean) => {
  const W = 3 * sw + 2 * gx, H = 3 * sh + 2 * gy;
  if (across) ROWS.forEach((k, i) => bar(c, left - ext, top + i * (sh + gy), W + 2 * ext, sh, HL[k as "y"]));
  if (down) COLS.forEach((k, j) => bar(c, left + j * (sw + gx), top - ext, sw, H + 2 * ext, HL[k as "y"]));
  if (across && down) ROWS.forEach((r, i) => COLS.forEach((k, j) => {
    const x = left + j * (sw + gx), y = top + i * (sh + gy);
    shape(c, () => rect(c, x, y, sw, sh), MIX[r + k], box ? 4 : 0);
  }));
};
const rect = (c: Ctx, x: number, y: number, w: number, h: number) => { c.rect(x, y, w, h); };

const stripesAcross = (c: Ctx) => {
  page(c, 90, 110, 680, 860);
  ROWS.forEach((k, i) => bar(c, 140, 250 + i * 230, 580, 130, HL[k as "y"]));
  // the three highlighter pens lying beside the page, tips down
  ([["y", 845], ["p", 915], ["b", 985]] as const).forEach(([k, px]) => {
    shadow(c, px + 8, 740, 28, 12);
    shape(c, () => rrect(c, px - 27, 230, 54, 500, 14), WHITE, 5);
    shape(c, () => rrect(c, px - 27, 230, 54, 110, 14), HL[k], 5);
    shape(c, () => polyP(c, [[px - 27, 700], [px + 27, 700], [px + 20, 760], [px - 20, 760]]), HL[k], 5);
    shape(c, () => polyP(c, [[px - 14, 760], [px + 14, 760], [px + 10, 790], [px - 10, 790]]), INK, 3);
  });
};
const stripesGrid = (c: Ctx) => {
  page(c, 90, 110, 680, 860);
  grid(c, 190, 250, 110, 120, 70, 110, 70, true, true, false);
  // the pens
  ([["p", 915]] as const).forEach(([k, px]) => {
    shadow(c, px + 8, 740, 28, 12);
    shape(c, () => rrect(c, px - 27, 230, 54, 500, 14), WHITE, 5);
    shape(c, () => rrect(c, px - 27, 230, 54, 110, 14), HL[k], 5);
    shape(c, () => polyP(c, [[px - 27, 700], [px + 27, 700], [px + 20, 760], [px - 20, 760]]), HL[k], 5);
    shape(c, () => polyP(c, [[px - 14, 760], [px + 14, 760], [px + 10, 790], [px - 10, 790]]), INK, 3);
  });
};
const gridCloseUp = (c: Ctx) => {
  c.fillStyle = COL.paper; c.fillRect(0, 0, 1080, 1080);
  grid(c, 110, 110, 260, 260, 50, 50, 70, true, true, true);
};

// a diagonal stripe in the third colour across a crossing, and the opposite order on the right
const stripeLayers = (c: Ctx) => {
  page(c, 50, 120, 980, 840);
  const cx = 330, cy = 540;
  const horiz = () => rect(c, 120, cy - 70, 420, 140), vert = () => rect(c, cx - 70, 220, 140, 640);
  const diag = () => { c.save(); c.translate(cx, cy); c.rotate(-0.62); rect(c, -280, -48, 560, 96); c.restore(); };
  const inside = (paths: (() => void)[], col: string) => { c.save(); paths.forEach((p) => { c.beginPath(); p(); c.clip(); }); c.fillStyle = col; c.fillRect(0, 0, 1080, 1080); c.restore(); };
  c.beginPath(); horiz(); c.fillStyle = HL.y; c.fill();
  c.beginPath(); vert(); c.fillStyle = HL.p; c.fill();
  inside([horiz, vert], MIX.yp);
  c.beginPath(); diag(); c.fillStyle = HL.b; c.fill();
  inside([diag, horiz], MIX.by); inside([diag, vert], MIX.pb); inside([diag, horiz, vert], "#5b4a60");
  // opposite order: pink across, yellow down
  c.beginPath(); rect(c, 700, 500, 250, 90); c.fillStyle = HL.p; c.fill();
  c.beginPath(); rect(c, 770, 380, 90, 330); c.fillStyle = HL.y; c.fill();
  inside([() => rect(c, 700, 500, 250, 90), () => rect(c, 770, 380, 90, 330)], MIX.py);
};

// ---------------------------------------------------------------- card pictures
const flowYellowBlue = (c: Ctx) => {
  page(c, 70, 110, 940, 860);
  bar(c, 120, 400, 840, 250, HL.y);
  bar(c, 400, 160, 290, 760, HL.b);
  shape(c, () => rect(c, 400, 400, 290, 250), MIX.yb, 0);
};
const flowShadowsCloseUp = (c: Ctx) => {
  c.save(); c.translate(540, 560); c.scale(1.35, 1.35); c.translate(-540, -560);
  bothTorches(c, false);
  c.restore();
};

// a coloured filter: white light from a torch goes in, only red comes out
const filterCard = (c: Ctx) => {
  const ty = 640;
  c.fillStyle = WALL; c.fillRect(0, 0, 1080, ty); c.fillStyle = TABLE; c.fillRect(0, ty, 1080, 1080 - ty); line(c, [[0, ty], [1080, ty]], 6);
  const front = torch(c, 40, 700, 0, 0.9);
  const fx = 480, sx = 900, cy = 700;
  beamTo(c, front, [fx, cy], 50, 90, BEAM.white);
  beamTo(c, [fx + 30, cy], [sx, cy], 90, 90, BEAM.red);
  // the screen: a white card standing on its foot, red light lands on the side that faces the filter
  shadow(c, sx + 20, cy + 100, 60, 12);
  shape(c, () => rrect(c, sx, cy - 90, 34, 180, 6), WHITE, 5);
  shape(c, () => rect(c, sx - 8, cy - 90, 8, 180), "#e4574a", 0);
  // the filter: a thin red sheet in a cardboard stand
  shadow(c, fx + 20, cy + 112, 70, 12);
  shape(c, () => rrect(c, fx - 35, cy + 90, 100, 30, 8), COL.wood);
  shape(c, () => rrect(c, fx, cy - 90, 30, 180, 5), "rgba(215,55,43,0.7)", 5);
};

// a pixel: a phone picture, and a magnifier showing the tiny red, green and blue dots behind one yellow and blue edge
const pixelCard = (c: Ctx) => {
  c.fillStyle = BG2; c.fillRect(0, 0, 1080, 1080);
  shadow(c, 300, 925, 200, 24);
  shape(c, () => rrect(c, 120, 180, 340, 720, 40), COL.black, 7);
  shape(c, () => rrect(c, 140, 215, 300, 650, 22), "#8fcdf2", 4);
  c.save(); c.beginPath(); rrect(c, 140, 215, 300, 650, 22); c.clip();
  c.fillStyle = COL.greenLt; c.beginPath(); c.moveTo(140, 760); c.quadraticCurveTo(290, 670, 440, 760); c.lineTo(440, 865); c.lineTo(140, 865); c.closePath(); c.fill();
  c.restore();
  shape(c, () => ell(c, 290, 400, 78, 78), COL.yellow, 5);
  // the ring on the phone, joined to the magnifier
  const ring: P = [346, 456];
  line(c, [ring, [530, 520]], 5);
  shape(c, () => ell(c, ring[0], ring[1], 26, 26), "rgba(255,255,255,0.25)", 5);
  // magnifier
  const mx = 750, my = 520, mr = 225;
  line(c, [[mx + mr * 0.72, my + mr * 0.72], [mx + mr * 1.15, my + mr * 1.15]], 46, INK);
  line(c, [[mx + mr * 0.72, my + mr * 0.72], [mx + mr * 1.15, my + mr * 1.15]], 32, COL.brown);
  shape(c, () => ell(c, mx, my, mr, mr), "#1c1b24", 12);
  c.save(); c.beginPath(); ell(c, mx, my, mr - 6, mr - 6); c.clip();
  const on = { r: "#ff3b30", g: "#34c759", b: "#2f6bff" }, off = { r: "#4a1c22", g: "#17361f", b: "#14214a" };
  for (let row = 0; row < 3; row++) for (let col = 0; col < 4; col++) {
    const gx = mx - 224 + col * 112 + 6, gy = my - 210 + row * 150 + 6, yel = row < 2;
    (["r", "g", "b"] as const).forEach((k, i) => {
      const lit_ = k === "b" ? !yel : yel;
      shape(c, () => rrect(c, gx + i * 34, gy, 28, 130, 6), lit_ ? on[k] : off[k], 0);
    });
  }
  c.restore();
  c.beginPath(); ell(c, mx, my, mr, mr); c.strokeStyle = INK; c.lineWidth = 12; c.stroke();
  shine(c, mx, my, mr);
};
const BG2 = "#efe4cf";
const shine = (c: Ctx, mx: number, my: number, mr: number) => { c.globalAlpha = 0.5; c.beginPath(); c.arc(mx, my, mr - 24, Math.PI * 1.1, Math.PI * 1.4); c.strokeStyle = WHITE; c.lineWidth = 12; c.lineCap = "round"; c.stroke(); c.globalAlpha = 1; };

export const ic_lightColourL4 = cards("sci.light.colour.L4", [
  // 0-8: set-up cards
  torchPair,
  (c) => oneTorch(c, "red"),
  (c) => oneTorch(c, "green"),
  (c) => bothTorches(c, true),
  threeTorches,
  stripesAcross,
  stripesGrid,
  gridCloseUp,
  stripeLayers,
  // 9-12: card pictures
  (c) => flowShadowsCloseUp(c),
  flowYellowBlue,
  filterCard,
  pixelCard,
]);
