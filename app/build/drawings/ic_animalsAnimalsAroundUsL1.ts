import type { Ctx } from "./core";
import { INK, WHITE, COL, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, cards } from "./flatKit";

// sci.animals.animals-around-us.L1 cards. Same child as the set-up cards. Every animal faces right,
// feet on y = 0 of its own little frame.

const bit = (c: Ctx, x: number, y: number, s: number, fn: (c: Ctx) => void) => { c.save(); c.translate(x, y); c.scale(s, s); fn(c); c.restore(); };
const panel = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => shape(c, () => rrect(c, x, y, w, h, 34), col, 6);
const leg = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 8, INK); line(c, pts, w, col); };

// ------------------------------------------------------------------ animals
const ant = (c: Ctx) => {
  const BR = "#7a3b24", BRD = "#55281a";
  [[-14, -38], [4, 0], [22, 38]].forEach(([dx, d]) => { void dx; void d; });
  for (const [x0, d] of [[-14, -46], [4, 4], [20, 50]]) leg(c, [[x0, -44], [x0 + d * 0.7, -62], [x0 + d, 0]], 5, BRD);
  for (const [x0, d] of [[-8, -34], [10, 14], [26, 58]]) leg(c, [[x0, -46], [x0 + d * 0.6, -26], [x0 + d, 0]], 5, BRD);
  const ab = () => ell(c, -76, -56, 58, 40, -0.1);
  shape(c, ab, BR); shade(c, ab, BRD, 14, 14, 0.7);
  shape(c, () => ell(c, -6, -58, 28, 22), BR);
  shape(c, () => ell(c, 52, -66, 28, 25), BR);
  leg(c, [[66, -86], [88, -126], [122, -128]], 4, BRD);
  leg(c, [[54, -88], [62, -132], [94, -148]], 4, BRD);
  shape(c, () => ell(c, 62, -70, 6, 7), WHITE, 3); shape(c, () => ell(c, 64, -70, 2.5, 3), INK, 0);
};
const crow = (c: Ctx) => {
  const BD = "#43405a", BDD = "#2b2340";
  for (const lx of [-8, 22]) { leg(c, [[lx, -62], [lx, -4]], 7, COL.greyDk); line(c, [[lx - 14, 0], [lx + 16, 0]], 12, INK); line(c, [[lx - 12, 0], [lx + 14, 0]], 5, COL.greyDk); }
  shape(c, () => polyP(c, [[-80, -135], [-190, -90], [-175, -62], [-70, -92]]), BDD, 5);
  const body = () => ell(c, 0, -125, 100, 62, -0.12);
  shape(c, body, BD); shade(c, body, BDD, 22, 20, 0.7);
  shape(c, () => ell(c, 62, -165, 44, 48, -0.3), BD, 5);
  shape(c, () => ell(c, -22, -122, 70, 34, 0.2), "#33304a", 4);
  shape(c, () => ell(c, 88, -196, 36, 33), BD);
  shape(c, () => polyP(c, [[112, -208], [180, -188], [112, -172]]), "#5a5560", 5);
  shape(c, () => ell(c, 98, -202, 8, 9), WHITE, 3); shape(c, () => ell(c, 100, -202, 3.5, 4), INK, 0);
};
const cow = (c: Ctx) => {
  const W = "#f7f3e8", WD = "#e0d6c0", PATCH = "#8a5a3c";
  for (const lx of [-120, 100]) { shape(c, () => rrect(c, lx, -110, 30, 108, 10), WD, 5); shape(c, () => rrect(c, lx - 2, -14, 34, 16, 6), "#3a3540", 4); }
  line(c, [[-168, -190], [-196, -150], [-190, -78]], 12, INK); line(c, [[-168, -190], [-196, -150], [-190, -78]], 6, WD);
  shape(c, () => ell(c, -190, -66, 12, 20), "#3a3540", 4);
  const body = () => rrect(c, -170, -230, 330, 140, 56);
  shape(c, body, W); shade(c, body, WD, 20, 22, 0.8);
  c.save(); c.beginPath(); body(); c.clip(); shape(c, () => ell(c, -60, -190, 56, 40, 0.3), PATCH, 0); shape(c, () => ell(c, 60, -112, 40, 28, -0.2), PATCH, 0); c.restore();
  shape(c, () => rrect(c, -170, -230, 330, 140, 56), "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, -30, -90, 32, 22), COL.pink, 5);
  for (const lx of [-90, 130]) { shape(c, () => rrect(c, lx, -110, 32, 108, 10), W, 5); shape(c, () => rrect(c, lx - 2, -14, 36, 16, 6), "#3a3540", 4); }
  shape(c, () => polyP(c, [[176, -262], [192, -300], [208, -262]]), COL.cloth, 4);
  shape(c, () => ell(c, 150, -240, 30, 15, -0.5), PATCH, 4);
  shape(c, () => ell(c, 196, -196, 58, 52, 0.25), W); 
  shape(c, () => ell(c, 238, -170, 34, 30, 0.25), COL.pink);
  shape(c, () => ell(c, 246, -176, 5, 7), INK, 0);
  shape(c, () => ell(c, 205, -216, 8, 9), INK, 0);
};
const cat = (c: Ctx) => {
  const F = "#e8964a", FD = "#c4742b";
  line(c, [[-100, -50], [-170, -60], [-200, -120]], 24, INK); line(c, [[-100, -50], [-170, -60], [-200, -120]], 14, F);
  const body = () => ell(c, -20, -70, 95, 62);
  shape(c, body, F); shade(c, body, FD, 20, 18, 0.7);
  shape(c, () => rrect(c, 20, -70, 30, 70, 12), F, 5); shape(c, () => rrect(c, -80, -34, 70, 34, 14), F, 5);
  shape(c, () => ell(c, 66, -150, 50, 44), F);
  shape(c, () => polyP(c, [[30, -180], [34, -228], [64, -190]]), F, 5); shape(c, () => polyP(c, [[70, -190], [100, -226], [104, -176]]), F, 5);
  shape(c, () => ell(c, 80, -148, 6, 8), INK, 0); shape(c, () => ell(c, 50, -150, 6, 8), INK, 0);
  shape(c, () => polyP(c, [[60, -134], [72, -134], [66, -126]]), COL.pink, 3);
};
const pigeon = (c: Ctx, walk = 0, sit = false) => {
  const G = "#9aa3b0", GD = "#6f7886";
  const lg = sit ? 0 : 1;
  if (lg) for (const [lx, d] of [[-6, -walk], [14, walk]]) { leg(c, [[lx, -56], [lx + d, 0]], 6, "#d9667a"); line(c, [[lx + d - 6, 0], [lx + d + 16, 0]], 10, INK); line(c, [[lx + d - 4, 0], [lx + d + 14, 0]], 4, "#d9667a"); }
  shape(c, () => polyP(c, [[-70, -96], [-150, -84], [-142, -62], [-62, -76]]), GD, 5);
  const body = () => ell(c, 0, -100, 84, 56, -0.12);
  shape(c, body, G); shade(c, body, GD, 20, 18, 0.7);
  shape(c, () => ell(c, 50, -108, 44, 46), G, 0);
  shape(c, () => ell(c, -16, -102, 56, 28, 0.2), GD, 4);
  line(c, [[-40, -112], [10, -102]], 4, INK);
  shape(c, () => ell(c, 66, -140, 26, 26), "#7fa89a", 5);
  shape(c, () => ell(c, 82, -166, 25, 23), G);
  shape(c, () => polyP(c, [[102, -170], [128, -164], [102, -156]]), "#e6c9a8", 4);
  shape(c, () => ell(c, 90, -172, 6, 6.5), "#f39a3c", 2.5); shape(c, () => ell(c, 91, -172, 2.5, 3), INK, 0);
};
const sparrow = (c: Ctx, legs = true) => {
  const B = "#a8723f", BD = "#7a4f2a";
  if (legs) for (const lx of [-4, 12]) { leg(c, [[lx, -34], [lx, -4]], 5, "#c98d6a"); line(c, [[lx - 8, 0], [lx + 10, 0]], 8, INK); line(c, [[lx - 6, 0], [lx + 8, 0]], 3, "#c98d6a"); }
  shape(c, () => polyP(c, [[-44, -60], [-110, -46], [-104, -28], [-36, -42]]), BD, 5);
  const body = () => ell(c, 0, -66, 56, 40, -0.1);
  shape(c, body, B); shade(c, body, BD, 14, 14, 0.7);
  shape(c, () => ell(c, 36, -76, 22, 24), "#e9dcc5", 0);
  shape(c, () => ell(c, -12, -68, 38, 22, 0.2), BD, 4);
  shape(c, () => ell(c, 50, -104, 26, 24), "#8a8a92");
  shape(c, () => ell(c, 66, -92, 12, 12), "#2f2c45", 0);
  shape(c, () => polyP(c, [[70, -108], [96, -100], [70, -94]]), "#c9b38a", 4);
  shape(c, () => ell(c, 56, -110, 5.5, 6), INK, 0);
};
// gecko seen from the side, head right, feet on y = 0
const gecko = (c: Ctx) => {
  const G = "#d9b98a", GD = "#a98458";
  for (const lx of [-70, 56]) { leg(c, [[lx + 8, -34], [lx + 24, -12], [lx + 36, 0]], 10, GD); shape(c, () => ell(c, lx + 38, -2, 13, 7), GD, 4); }
  shape(c, () => { c.moveTo(-84, -48); c.bezierCurveTo(-150, -40, -190, -10, -250, -34); c.bezierCurveTo(-190, -4, -140, -10, -84, -22); c.closePath(); }, G, 5);
  const body = () => ell(c, 0, -44, 100, 28);
  shape(c, body, G); shade(c, body, GD, 14, 12, 0.7);
  for (const [sx, sy] of [[-40, -56], [0, -60], [40, -56], [-20, -40]]) shape(c, () => ell(c, sx, sy, 8, 6), GD, 0);
  shape(c, () => ell(c, 112, -50, 44, 24, -0.12), G);
  for (const lx of [-90, 36]) { leg(c, [[lx + 8, -34], [lx + 24, -12], [lx + 36, 0]], 11, G); shape(c, () => ell(c, lx + 38, -2, 14, 8), G, 4); }
  shape(c, () => ell(c, 118, -64, 15, 15), "#f4e27a", 4); shape(c, () => ell(c, 120, -64, 3.5, 11), INK, 0);
};
const moth = (c: Ctx) => {
  const M = "#b79a73", MD = "#8a6f4a";
  shape(c, () => polyP(c, [[0, -30], [-70, -60], [-80, -10], [-20, 10]]), MD);
  shape(c, () => polyP(c, [[10, -30], [78, -60], [88, -10], [26, 10]]), M);
  shape(c, () => ell(c, 4, -10, 16, 44), "#d8c6a4", 5);
  shape(c, () => ell(c, 4, -62, 14, 14), "#d8c6a4", 5);
  line(c, [[0, -72], [-24, -108]], 4); line(c, [[8, -72], [34, -108]], 4);
};
const snake = (c: Ctx) => {
  const pts: number[][] = [];
  for (let i = 0; i <= 40; i++) { const t = i / 40; pts.push([-210 + t * 420, -26 + Math.sin(t * Math.PI * 3.2) * 30]); }
  line(c, pts, 44, INK); line(c, pts, 34, "#6aa53f");
  line(c, pts.map(([x, y]) => [x, y + 8]), 12, "#c9e08a");
  for (let i = 3; i < 40; i += 4) { const [x, y] = pts[i]; line(c, [[x - 4, y - 14], [x + 6, y - 2]], 5, COL.greenDk); }
  const [hx, hy] = pts[40];
  shape(c, () => ell(c, hx + 18, hy - 4, 34, 24, 0.1), "#6aa53f");
  line(c, [[hx + 50, hy - 2], [hx + 84, hy - 2], [hx + 98, hy - 12]], 4, RED); line(c, [[hx + 84, hy - 2], [hx + 98, hy + 8]], 4, RED);
  shape(c, () => ell(c, hx + 26, hy - 12, 7, 7), WHITE, 3); shape(c, () => ell(c, hx + 28, hy - 12, 3, 3.5), INK, 0);
};

// ------------------------------------------------------------------ food
const rice = (c: Ctx, x: number, y: number) => {
  shape(c, () => { c.moveTo(x - 120, y); c.quadraticCurveTo(x - 90, y - 100, x - 20, y - 70); c.quadraticCurveTo(x + 40, y - 120, x + 110, y - 10); c.closePath(); }, "#fffaf0", 5);
  const r = rnd(3); for (let i = 0; i < 22; i++) { const gx = x - 90 + r() * 180, gy = y - 70 + r() * 60; if (gy > y - 6) continue; line(c, [[gx, gy], [gx + 12, gy - 4]], 4, "#e8dcc4"); }
};
const dal = (c: Ctx, x: number, y: number) => {
  shape(c, () => ell(c, x, y, 62, 22), COL.steel, 5);
  shape(c, () => ell(c, x, y - 2, 50, 15), "#e8b53a", 3);
};
const grass = (c: Ctx, x: number, y: number) => {
  const blades: [number, number, number][] = [[-70, -150, -0.5], [-45, -190, -0.25], [-20, -210, -0.1], [10, -220, 0.05], [35, -200, 0.2], [60, -170, 0.4], [80, -130, 0.6]];
  blades.forEach(([dx, h, lean], i) => shape(c, () => { c.moveTo(x + dx - 12, y); c.quadraticCurveTo(x + dx + lean * 60, y + h * 0.5, x + dx + lean * 160, y + h); c.quadraticCurveTo(x + dx + 6, y + h * 0.4, x + dx + 12, y); c.closePath(); }, i % 2 ? COL.greenLt : COL.green, 5));
  line(c, [[x - 55, y - 20], [x + 60, y - 28]], 10, INK); line(c, [[x - 55, y - 20], [x + 60, y - 28]], 4, COL.wood);
};

// ------------------------------------------------------------------ mouth with teeth
const mouth = (c: Ctx) => {
  const cx = 540, cy = 540;
  shape(c, () => ell(c, cx, cy, 400, 290), "#8a2f3d", 0);
  c.save(); c.beginPath(); ell(c, cx, cy, 400, 290); c.clip();
  shape(c, () => ell(c, cx, cy + 190, 230, 100), "#e98a94", 5);
  const ws = [34, 34, 38, 46, 62, 76, 86];
  const row = (top: boolean) => {
    let x = cx;
    for (const s of [1, -1]) {
      x = cx;
      ws.forEach((w, i) => {
        const x0 = s > 0 ? x : x - w, edge = 285 - i * 8, yb = top ? cy - 290 + 14 : cy + 290 - 14;
        const len = (i < 2 ? 112 : i < 4 ? 98 : 80);
        const y0 = top ? yb : yb - len;
        void edge;
        const lift = i * i * 2.6;
        shape(c, () => rrect(c, x0, (top ? y0 + lift : y0 - lift) + 0, w, len, 12), i < 4 ? WHITE : "#f4efe6", 4);
        x += s * w;
      });
    }
  };
  row(true); row(false);
  c.restore();
  c.beginPath(); ell(c, cx, cy, 400, 290); c.strokeStyle = "#d9707a"; c.lineWidth = 34; c.stroke();
  c.beginPath(); ell(c, cx, cy, 417, 307); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  c.beginPath(); ell(c, cx, cy, 383, 273); c.stroke();
};

// ------------------------------------------------------------------ cards
// e1: the chewing test: a mouth, five foods on a plate
const e1 = (c: Ctx) => {
  ground(c);
  bit(c, 540 * 0.5 + 0, 0, 1, () => {});
  c.save(); c.translate(540, 80); c.scale(0.5, 0.5); c.translate(-540, -250); mouth(c); c.restore();
  const px = 540, py = 800;
  shadow(c, px + 20, py + 40, 440, 150);
  shape(c, () => ell(c, px, py, 440, 160), COL.steel);
  shape(c, () => ell(c, px, py - 6, 372, 128), COL.steelIn, 4);
  // banana slices
  for (const [bx, by] of [[250, 770], [330, 810]]) { shape(c, () => ell(c, bx, by, 44, 34), "#f6e7a8"); shape(c, () => ell(c, bx, by, 16, 12), "#d9c37a", 3); }
  // carrot stick
  c.save(); c.translate(430, 735); c.rotate(-0.25); shape(c, () => rrect(c, -22, -16, 150, 32, 12), COL.orange); shade(c, () => rrect(c, -22, -16, 150, 32, 12), "#d27c25", 6, 8, 0.6); c.restore();
  // chapati
  shape(c, () => ell(c, 560, 830, 66, 48, 0.2), "#e8c488"); for (const [dx, dy] of [[-20, -10], [18, 8], [-4, 16], [30, -16]]) shape(c, () => ell(c, 560 + dx, 830 + dy, 7, 5), "#a8723f", 0);
  // curd in a katori
  shape(c, () => { c.moveTo(640, 760); c.bezierCurveTo(650, 820, 760, 820, 770, 760); c.closePath(); }, COL.steel, 5);
  shape(c, () => ell(c, 705, 760, 65, 18), WHITE, 5);
  // puffed rice
  const r = rnd(5); for (let i = 0; i < 9; i++) shape(c, () => ell(c, 770 + r() * 80, 830 + r() * 40 - 20, 14, 11, r() * 3), "#fff3d6", 3.5);
  arrow(c, [[540, 640], [540, 480]]);
};

// p1: puppets on sticks behind a table
const p1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#f0d9b0"; c.fillRect(0, 0, 1080, 680);
  for (const x of [215, 560, 880]) { line(c, [[x, 420], [x, 760]], 22, INK); line(c, [[x, 420], [x, 760]], 12, COL.wood); }
  bit(c, 215, 600, 1.0, crow); bit(c, 560, 600, 1.35, ant); bit(c, 880, 600, 0.78, gecko);
  shape(c, () => rrect(c, -20, 690, 1120, 420, 20), "#c9985a");
  shade(c, () => rrect(c, -20, 690, 1120, 420, 20), "#a8723f", 0, 28, 0.55);
  line(c, [[-20, 690], [1100, 690]], 6);
};

// term.1 Food: three eaters, three foods
const food = (c: Ctx) => {
  ground(c);
  const cols = [190, 540, 890];
  for (const x of cols) shadow(c, x + 12, 505, 150, 20);
  person(c, 190, 500, 400, {});
  bit(c, 500, 500, 0.66, cow);
  bit(c, 940, 500, 0.62, gecko);
  // food: rice and dal, grass, a moth
  for (const x of cols) { shadow(c, x + 10, 830, 160, 52); shape(c, () => ell(c, x, 820, 160, 56), COL.steel); shape(c, () => ell(c, x, 814, 134, 44), COL.steelIn, 4); }
  rice(c, 150, 815); dal(c, 245, 835);
  grass(c, 540, 810);
  bit(c, 890, 830, 0.85, moth);
  for (const x of cols) arrow(c, [[x, 700], [x, 570]]);
};

// term.2 Home: ants going into a crack, a pigeon on the ledge
const home = (c: Ctx) => {
  ground(c, "#f1d9b5");
  c.strokeStyle = "rgba(43,35,64,0.12)"; c.lineWidth = 3;
  for (let y = 520; y < 1080; y += 70) { c.beginPath(); c.moveTo(0, y); c.lineTo(1080, y); c.stroke(); }
  shadow(c, 540, 470, 460, 26);
  shape(c, () => rrect(c, 60, 380, 960, 70, 14), COL.steel);
  shade(c, () => rrect(c, 60, 380, 960, 70, 14), COL.steelDk, 0, 18, 0.6);
  bit(c, 340, 385, 1.45, (cc) => pigeon(cc, 0, true));
  // the crack
  const crack = [[800, 560], [770, 640], [812, 720], [780, 800], [815, 880], [790, 960]];
  line(c, crack, 34, INK); line(c, crack, 18, "#3a3540");
  shape(c, () => ell(c, 808, 800, 26, 40), "#3a3540", 4);
  for (const [x, y] of [[130, 845], [290, 845], [450, 845], [610, 845]]) bit(c, x, y, 0.8, ant);
  arrow(c, [[360, 940], [640, 940]]);
};

// term.3 Teeth
const teeth = (c: Ctx) => { ground(c); mouth(c); };

// expl.0 Humans are animals too: an ant, a crow, a cow, a child
const humans = (c: Ctx) => {
  ground(c);
  const P = [[40, 40, "#cfe8f6"], [550, 40, "#e0efc4"], [40, 550, "#f6e1b8"], [550, 550, "#f6d4d0"]] as const;
  P.forEach(([x, y, col]) => panel(c, x, y, 490, 490, col));
  bit(c, 285 - 20, 360, 1.5, ant);
  bit(c, 790, 400, 1.3, crow);
  bit(c, 255, 940, 0.98, cow);
  shadow(c, 800, 960, 120, 18);
  person(c, 795, 950, 380, {});
};

// expl.3 Animals move in many ways
const moves = (c: Ctx) => {
  ground(c);
  panel(c, 40, 40, 490, 490, "#cfe8f6"); panel(c, 550, 40, 490, 490, "#e0efc4");
  panel(c, 40, 550, 490, 490, "#f6e1b8"); panel(c, 550, 550, 490, 490, "#d8efe0");
  // pigeon walking
  line(c, [[70, 470], [500, 470]], 5);
  bit(c, 255, 470, 1.35, (cc) => pigeon(cc, 28));
  arrow(c, [[130, 130], [400, 130]]);
  // sparrow hopping: in the air above its shadow
  line(c, [[580, 470], [1010, 470]], 5);
  shadow(c, 700, 470, 60, 8);
  bit(c, 700, 395, 1.3, (cc) => sparrow(cc, true));
  arrow(c, [[800, 430], [840, 320], [900, 270], [960, 320], [995, 430]]);
  // gecko climbing a wall
  c.fillStyle = "#e9d2a4"; c.fillRect(300, 570, 200, 450); line(c, [[300, 570], [300, 1020]], 6);
  c.save(); c.translate(305, 815); c.rotate(-Math.PI / 2); c.scale(0.85, 0.85); gecko(c); c.restore();
  arrow(c, [[420, 960], [420, 700]]);
  // snake sliding
  bit(c, 755, 830, 0.88, snake);
  arrow(c, [[640, 960], [940, 960]]);
};

export const ic_animalsAnimalsAroundUsL1 = cards("sci.animals.animals-around-us.L1 cards", [e1, p1, food, home, teeth, humans, moves]);
void cat; void shine; void COL;
