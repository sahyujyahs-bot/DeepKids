import type { Ctx } from "./core";
import { INK, RED, COL, SKIN, CLOTH, rnd, ground, leaf, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, hand, write, cards } from "./flatKit";

// FORCES CHANGE SHAPE AND MOTION (level 3) · flat cards for terms and activities.
const DOUGH = "#f1deb4", DOUGHDK = "#d6bd8a", CLAY = "#d9774a", CLAYDK = "#b45a33", TABLE = "#e6d3ae", PAPER = "#fffaf0";
const WHITE = "#ffffff";
const scene = (c: Ctx, y: number) => { ground(c); c.fillStyle = TABLE; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 5); };
const smooth = (c: Ctx, pts: number[][]) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
const tube = (c: Ctx, pts: number[][], w: number, fill: string, edge = 6) => {
  c.lineCap = "round"; c.lineJoin = "round";
  smooth(c, pts); c.strokeStyle = INK; c.lineWidth = w + edge * 2; c.stroke();
  smooth(c, pts); c.strokeStyle = fill; c.lineWidth = w; c.stroke();
};
const dark = (c: Ctx, p: () => void, col: string, r: number) => shade(c, p, col, -r, -r);

// ---- things
const dough = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shadow(c, x + rx * 0.12, y + ry * 0.92, rx * 1.02, ry * 0.26);
  const p = () => ell(c, x, y, rx, ry);
  shape(c, p, DOUGH); dark(c, p, DOUGHDK, Math.min(rx, ry) * 0.22);
  shine(c, [[x - rx * 0.55, y - ry * 0.25], [x - rx * 0.25, y - ry * 0.6]], 8);
};
const ballKind = { cricket: ["#c2352b", "#8f231c"], tennis: ["#d8ea4a", "#a9bd2a"], marble: [COL.blue, COL.blueDk] } as const;
const ball = (c: Ctx, x: number, y: number, r: number, kind: keyof typeof ballKind = "tennis") => {
  const p = () => ell(c, x, y, r, r);
  shape(c, p, ballKind[kind][0], Math.max(4, r * 0.07)); dark(c, p, ballKind[kind][1], r * 0.22);
  c.save(); c.beginPath(); p(); c.clip();
  if (kind === "tennis") { line(c, [[x - r * 0.95, y - r * 0.45], [x - r * 0.3, y], [x - r * 0.2, y + r * 0.7], [x - r * 0.35, y + r * 1.1]], Math.max(3, r * 0.1), WHITE); line(c, [[x + r * 0.95, y + r * 0.45], [x + r * 0.35, y], [x + r * 0.2, y - r * 0.7], [x + r * 0.35, y - r * 1.1]], Math.max(3, r * 0.1), WHITE); }
  if (kind === "cricket") { line(c, [[x - r * 0.9, y - r * 0.2], [x, y + r * 0.15], [x + r * 0.9, y - r * 0.2]], Math.max(3, r * 0.1), WHITE); for (let i = -3; i <= 3; i++) line(c, [[x + i * r * 0.27, y + r * 0.05 + Math.abs(i) * 0.02 * r - r * 0.06], [x + i * r * 0.27, y + r * 0.3]], Math.max(2, r * 0.05), WHITE); }
  c.restore();
  if (kind === "marble") shine(c, [[x - r * 0.55, y - r * 0.2], [x - r * 0.25, y - r * 0.6]], Math.max(4, r * 0.15));
  else shine(c, [[x - r * 0.62, y - r * 0.3], [x - r * 0.35, y - r * 0.62]], Math.max(4, r * 0.1));
};
const rubberBand = (c: Ctx, x: number, y: number, rx: number, ry: number) => { c.beginPath(); ell(c, x, y, rx, ry); c.strokeStyle = INK; c.lineWidth = 26; c.stroke(); c.beginPath(); ell(c, x, y, rx, ry); c.strokeStyle = COL.blue; c.lineWidth = 14; c.stroke(); };
const sponge = (c: Ctx, x: number, y: number, w: number, h: number) => { // bottom-left (x, y)
  shadow(c, x + w * 0.52, y + 6, w * 0.55, 14);
  const body = () => rrect(c, x, y - h, w, h, 16), g = Math.min(h * 0.28, 42);
  shape(c, body, "#f2cf4a"); dark(c, body, "#d2a92c", 12);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.green; c.fillRect(x, y - g, w, g); line(c, [[x, y - g], [x + w, y - g]], 5); c.restore();
  const r = rnd(5); for (let i = 0; i < Math.round(w / 30); i++) shape(c, () => ell(c, x + 24 + r() * (w - 48), y - g - 10 - r() * Math.max(2, h - g - 28), 7 + r() * 4, 5 + r() * 3), "#d9b23a", 2.5);
  c.save(); c.beginPath(); body(); c.stroke(); c.restore(); shape(c, body, "rgba(0,0,0,0)", 6);
};
const coin = (c: Ctx, x: number, y: number, rx: number) => { shape(c, () => rrect(c, x - rx, y - 14, rx * 2, 28, 12), "#e8b83a"); shape(c, () => ell(c, x, y - 14, rx, rx * 0.3), "#f6d460", 5); };
const book = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => { shadow(c, x + w * 0.52, y + 6, w * 0.55, 12); shape(c, () => rrect(c, x, y - h, w, h, 8), col); shape(c, () => rrect(c, x + 14, y - h + 10, w - 28, h - 20, 4), PAPER, 4); };
const egg = (c: Ctx, x: number, y: number, s: number) => { const p = () => { c.moveTo(x, y - 70 * s); c.bezierCurveTo(x + 62 * s, y - 60 * s, x + 66 * s, y + 66 * s, x, y + 68 * s); c.bezierCurveTo(x - 66 * s, y + 66 * s, x - 62 * s, y - 60 * s, x, y - 70 * s); c.closePath(); }; shape(c, p, "#f7ecd6"); dark(c, p, "#dcc9a2", 14 * s); shine(c, [[x - 28 * s, y - 20 * s], [x - 22 * s, y - 46 * s]], 8); };
const bone = (c: Ctx, x: number, y: number, len: number, th: number) => {
  const k = th * 0.62, parts = () => { rrect(c, x - len / 2, y - th / 2, len, th, th * 0.3); for (const sx of [-1, 1]) for (const sy of [-1, 1]) { c.moveTo(x + sx * len / 2 + k, y + sy * k * 0.75); c.arc(x + sx * len / 2, y + sy * k * 0.75, k, 0, Math.PI * 2); } };
  c.beginPath(); parts(); c.strokeStyle = INK; c.lineWidth = 14; c.lineJoin = "round"; c.stroke(); c.beginPath(); parts(); c.fillStyle = "#f6efdc"; c.fill();
  c.save(); c.beginPath(); rrect(c, x - len / 2, y - th / 2, len, th, th * 0.3); c.clip(); c.fillStyle = "#e2d6b8"; c.fillRect(x - len / 2, y + th * 0.18, len, th); c.restore();
  line(c, [[x - len * 0.3, y - th * 0.22], [x + len * 0.3, y - th * 0.22]], 6, WHITE);
};
const spring = (c: Ctx, x1: number, x2: number, y: number, turns: number, amp: number) => {
  const pts: number[][] = [[x1, y]]; for (let i = 0; i < turns * 2; i++) pts.push([x1 + (x2 - x1) * ((i + 0.5) / (turns * 2)), y + (i % 2 ? amp : -amp)]); pts.push([x2, y]);
  line(c, pts, 16, INK); line(c, pts, 7, COL.steel);
};
const fingerPair = (c: Ctx, x: number, y: number) => { // a finger pointing up from below the card, tip at (x, y)
  shape(c, () => rrect(c, x - 34, y, 68, 700, 34), SKIN.child); shade(c, () => rrect(c, x - 34, y, 68, 700, 34), SKIN.childDk, -14, 0);
  shape(c, () => rrect(c, x - 18, y + 14, 36, 44, 16), "#d9a98a", 3);
};
const towelWring = (c: Ctx, cx: number, cy: number, s: number) => {
  c.save(); c.translate(cx, cy); c.scale(s, s);
  const tw = () => rrect(c, -230, -60, 460, 120, 55);
  shape(c, tw, COL.teal); dark(c, tw, COL.tealDk, 14);
  c.save(); c.beginPath(); tw(); c.clip(); for (let i = -9; i <= 9; i++) line(c, [[i * 38 - 30, -70], [i * 38 + 30, 70]], 7, COL.tealDk); c.restore(); shape(c, tw, "rgba(0,0,0,0)", 6);
  for (const sx of [-1, 1]) { const fx = sx * 270; shape(c, () => rrect(c, fx - 60, -64, 120, 128, 40), SKIN.child); for (let k = 0; k < 3; k++) line(c, [[fx - 40, -30 + k * 30], [fx + 40, -30 + k * 30]], 5, SKIN.childDk); shape(c, () => rrect(c, fx - 30 + sx * 90, -36, 90, 72, 14), CLOTH.child); }
  c.restore();
};
const tag = (c: Ctx, x: number, y: number, w: number, h: number, col = WHITE) => shape(c, () => rrect(c, x, y, w, h, 28), col, 6);

const curve = (c: Ctx, cx: number, cy: number, r: number, a0: number, a1: number, col = RED, w = 11) => { const pts: number[][] = []; for (let i = 0; i <= 14; i++) { const a = a0 + (a1 - a0) * i / 14; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } arrow(c, pts, col, w); };
const block = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => { shadow(c, x + w * 0.52, y + 6, w * 0.55, 12); shape(c, () => rrect(c, x, y - h, w, h, 10), col); line(c, [[x + 14, y - h * 0.5], [x + w - 14, y - h * 0.5]], 5, INK); };
const pullBand = (c: Ctx, y: number, x1: number, x2: number) => { rubberBand(c, (x1 + x2) / 2, y, (x2 - x1) / 2, 22); hand(c, x1, y + 90, -Math.PI / 2, 1.25, SKIN.child, CLOTH.child); hand(c, x2, y + 90, -Math.PI / 2, 1.25, SKIN.child, CLOTH.child); };

const cardList: Record<string, (c: Ctx) => void> = {};
const add = (key: string, f: (c: Ctx) => void) => { cardList[key] = f; };

// ================================================================ TERMS
add("term.0", (c) => { // force: a push and a pull
  ground(c); c.save(); c.translate(90, 0);
  shadow(c, 330, 460, 250, 22); dough(c, 330, 440, 230, 36);
  shape(c, () => rrect(c, 200, 290, 280, 100, 48), COL.wood); line(c, [[225, 335], [455, 335]], 5, COL.woodDk);
  shape(c, () => rrect(c, 120, 318, 100, 46, 20), COL.woodDk); shape(c, () => rrect(c, 460, 318, 100, 46, 20), COL.woodDk);
  hand(c, 10, 342, 0, 1.3, SKIN.child, CLOTH.child);
  arrow(c, [[130, 210], [470, 210]], RED, 13); c.restore();
  pullBand(c, 780, 270, 810);
  arrow(c, [[225, 690], [110, 690]], RED, 13); arrow(c, [[855, 690], [970, 690]], RED, 13);
});
add("term.1", (c) => { // shape: round dough and flat chapati
  scene(c, 800);
  dough(c, 280, 650, 150, 150);
  dough(c, 780, 745, 250, 38);
  arrow(c, [[460, 480], [600, 480], [660, 560]]);
});
add("term.2", (c) => { // squash
  scene(c, 860);
  dough(c, 260, 735, 125, 110);
  dough(c, 760, 790, 190, 60);
  hand(c, 760, 575, Math.PI / 2, 1.6, SKIN.child, CLOTH.child, true);
  arrow(c, [[1000, 450], [1000, 770]], RED, 13);
});
add("term.3", (c) => { // stretch: a short band, then the same band pulled long
  ground(c);
  rubberBand(c, 540, 220, 130, 56);
  arrow(c, [[540, 330], [540, 430]], RED, 12);
  pullBand(c, 650, 230, 850);
  arrow(c, [[195, 560], [90, 560]], RED, 13); arrow(c, [[885, 560], [990, 560]], RED, 13);
});
add("term.4", (c) => { // twist
  scene(c, 860);
  shape(c, () => rrect(c, 380, 720, 320, 180, 20), COL.steel); shape(c, () => ell(c, 540, 720, 160, 28), COL.steelIn, 5);
  towelWring(c, 540, 470, 1);
  arrow(c, [[200, 400], [200, 290]], RED, 13); arrow(c, [[880, 540], [880, 650]], RED, 13);
  for (const [x, y] of [[470, 590], [540, 610], [600, 580], [520, 650], [575, 670]]) shape(c, () => { c.moveTo(x, y - 24); c.quadraticCurveTo(x - 20, y + 6, x, y + 18); c.quadraticCurveTo(x + 20, y + 6, x, y - 24); c.closePath(); }, COL.water, 4);
});
add("term.5", (c) => { // bend: a bamboo bent over by wind
  scene(c, 840);
  shape(c, () => ell(c, 330, 842, 200, 30), COL.soil);
  tube(c, [[330, 840], [330, 640], [360, 420], [500, 270], [720, 220]], 44, COL.green);
  for (const [x, y] of [[330, 760], [338, 600]]) line(c, [[x - 30, y], [x + 30, y]], 10, COL.greenDk);
  line(c, [[362, 440], [392, 400]], 10, COL.greenDk); line(c, [[498, 300], [510, 250]], 10, COL.greenDk);
  leaf(c, 720, 220, 130, -0.15); leaf(c, 600, 242, 120, -0.9); leaf(c, 720, 220, 110, 0.5);
  arrow(c, [[960, 330], [840, 330]], RED, 12); arrow(c, [[960, 440], [840, 440]], RED, 12);
});
add("term.6", (c) => { // material: six materials
  ground(c);
  const T = (i: number) => { const x = 60 + (i % 3) * 330, y = 150 + Math.floor(i / 3) * 400; tag(c, x, y, 300, 340); return [x + 150, y + 170]; };
  let [x, y] = T(0); // wood
  shape(c, () => rrect(c, x - 110, y - 70, 220, 140, 14), COL.wood); for (const dy of [-35, 0, 38]) line(c, [[x - 95, y + dy], [x - 40, y + dy - 8], [x + 30, y + dy + 6], [x + 95, y + dy]], 5, COL.woodDk);
  [x, y] = T(1); // steel
  bowl(c, x, y - 30, 105);
  [x, y] = T(2); // rubber (an eraser)
  shape(c, () => rrect(c, x - 100, y - 55, 200, 110, 22), COL.pink); shade(c, () => rrect(c, x - 100, y - 55, 200, 110, 22), "#d9738f", -16, -16); shape(c, () => rrect(c, x - 100, y - 55, 200, 110, 22), "rgba(0,0,0,0)", 6); shine(c, [[x - 70, y - 25], [x - 30, y - 25]], 9);
  [x, y] = T(3); // clay
  const p = () => { c.moveTo(x - 100, y + 50); c.bezierCurveTo(x - 120, y - 20, x - 50, y - 80, x + 20, y - 70); c.bezierCurveTo(x + 100, y - 60, x + 120, y + 10, x + 100, y + 50); c.closePath(); };
  shape(c, p, CLAY); dark(c, p, CLAYDK, 16); shine(c, [[x - 70, y - 10], [x - 40, y - 45]], 8);
  [x, y] = T(4); // glass
  glass(c, x, y + 80, 150, 190, 0);
  [x, y] = T(5); // cotton
  for (const [dx, dy, r] of [[-50, 20, 52], [40, 20, 56], [-5, -30, 60], [-70, -20, 38], [70, -20, 38]]) shape(c, () => ell(c, x + dx, y + dy, r, r), "#fbf8f0", 5);
});
add("term.7", (c) => { // elastic: sponge squeezed, then it springs back
  scene(c, 800);
  sponge(c, 70, 780, 330, 90);
  hand(c, 235, 533, Math.PI / 2, 1.6, SKIN.child, CLOTH.child, true);
  arrow(c, [[80, 420], [80, 640]], RED, 12);
  curve(c, 520, 640, 120, Math.PI * 1.05, Math.PI * 1.95, RED, 12);
  sponge(c, 640, 780, 330, 230);
});
add("term.8", (c) => { // plastic change: a thumbprint stays in clay
  scene(c, 800);
  shadow(c, 560, 860, 360, 30);
  shape(c, () => rrect(c, 200, 600, 680, 200, 24), CLAY); shade(c, () => rrect(c, 200, 600, 680, 200, 24), CLAYDK, -22, -22);
  shape(c, () => ell(c, 540, 600, 340, 80), "#e48a5c", 6);
  shape(c, () => ell(c, 540, 604, 90, 32), CLAYDK, 5); shape(c, () => ell(c, 520, 600, 62, 20), "#8e4326", 0);
  shape(c, () => rrect(c, 490, 220, 110, 300, 55), SKIN.child); shade(c, () => rrect(c, 490, 220, 110, 300, 55), SKIN.childDk, -18, 0);
  shape(c, () => rrect(c, 515, 232, 60, 70, 26), "#d9a98a", 3);
  arrow(c, [[740, 520], [740, 300]], RED, 12);
});
add("term.9", (c) => { // brittle: a papad snaps
  scene(c, 840);
  const R = 235, cx = 540, cy = 560, jag = [[8, -R], [-30, -150], [18, -60], [-24, 40], [22, 140], [-6, R]];
  const arc = (a0: number, a1: number) => { const o: number[][] = []; for (let i = 0; i <= 14; i++) { const a = a0 + (a1 - a0) * i / 14; o.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R * 0.92]); } return o; };
  const jp = jag.map(([x, y]) => [cx + x, cy + y * 0.92]);
  const left = [...arc(-Math.PI / 2, -Math.PI * 1.5).slice(0), ...jp.slice().reverse().slice(0)].filter((_, i, a) => i < a.length);
  const right = [...arc(-Math.PI / 2, Math.PI / 2), ...jp.slice().reverse()];
  const piece = (pts: number[][], dx: number, dy: number, rot: number) => {
    c.save(); c.translate(cx + dx, cy + dy); c.rotate(rot); c.translate(-cx, -cy);
    shape(c, () => polyP(c, pts), "#efd9a6", 6);
    c.save(); c.beginPath(); polyP(c, pts); c.clip(); const r = rnd(4); for (let i = 0; i < 22; i++) { const a = r() * 6.28, d = r() * 200; shape(c, () => ell(c, cx + Math.cos(a) * d, cy + Math.sin(a) * d, 7, 5), "#c79b55", 2); } c.restore();
    c.restore();
  };
  shadow(c, 560, 800, 330, 30);
  piece(left, -45, 10, -0.08); piece(right, 45, -8, 0.08);
  for (const [x, y, s] of [[540, 760, 14], [470, 790, 10], [610, 780, 12], [575, 810, 8]]) shape(c, () => polyP(c, [[x - s, y], [x, y - s], [x + s, y + s * 0.5]]), "#efd9a6", 3);
  line(c, [[500, 270], [520, 320], [490, 360], [525, 400]], 7, RED);
});
add("term.11", (c) => { // fair test: same ball, two heights
  scene(c, 860);
  block(c, 140, 860, 280, 110, COL.teal); block(c, 140, 750, 280, 110, COL.purple); block(c, 140, 640, 280, 110, COL.orange);
  block(c, 640, 860, 280, 110, COL.teal);
  for (const [x, y] of [[280, 480], [780, 700]]) { const p = () => ell(c, x, y, 70, 52); shape(c, p, CLAY); dark(c, p, CLAYDK, 14); }
  arrow(c, [[455, 480], [455, 845]], RED, 10); arrow(c, [[955, 700], [955, 845]], RED, 10);
  line(c, [[440, 860], [470, 860]], 6, INK);
  line(c, [[480, 190], [545, 260], [680, 120]], 26, "#3a9a4a");
});
add("term.12", (c) => { // speed: a fast ball with long lines, a slow marble with short lines
  ground(c);
  ball(c, 820, 300, 105, "cricket");
  for (const [y, a, b] of [[230, 170, 640], [300, 120, 680], [370, 210, 650]]) line(c, [[a, y], [b, y]], 14, COL.greyDk);
  shadow(c, 820, 440, 110, 14);
  ball(c, 820, 760, 55, "marble");
  for (const [y, a, b] of [[735, 650, 730], [785, 670, 735]]) line(c, [[a, y], [b, y]], 12, COL.greyDk);
  shadow(c, 820, 820, 60, 9);
  arrow(c, [[140, 520], [330, 520]], RED, 14);
});
add("term.13", (c) => { // direction: a ball hits a bat and goes another way
  ground(c);
  shape(c, () => rrect(c, 620, 240, 130, 430, 40), COL.wood); shade(c, () => rrect(c, 620, 240, 130, 430, 40), COL.woodDk, -20, 0);
  shape(c, () => rrect(c, 665, 650, 40, 280, 14), COL.woodDk); shape(c, () => rrect(c, 659, 740, 52, 150, 12), COL.blue, 5);
  ball(c, 170, 220, 60, "cricket"); ball(c, 170, 880, 60, "cricket");
  arrow(c, [[250, 270], [590, 540]], RED, 13); arrow(c, [[590, 585], [262, 840]], RED, 13);
  ball(c, 575, 562, 40, "cricket");
});
add("term.14", (c) => { // mass: an empty bag and a full bag
  ground(c);
  shape(c, () => rrect(c, 60, 90, 960, 50, 18), COL.wood); line(c, [[80, 105], [1000, 105]], 5, COL.woodDk);
  const peg = (x: number) => shape(c, () => rrect(c, x - 14, 130, 28, 46, 12), COL.woodDk);
  peg(290); peg(770);
  line(c, [[245, 176], [220, 380]], 14, INK); line(c, [[335, 176], [360, 380]], 14, INK);
  const e = () => { c.moveTo(190, 380); c.lineTo(390, 380); c.quadraticCurveTo(405, 600, 380, 700); c.quadraticCurveTo(290, 730, 200, 700); c.quadraticCurveTo(175, 600, 190, 380); c.closePath(); };
  shape(c, e, COL.blue); dark(c, e, COL.blueDk, 14); shape(c, () => rrect(c, 235, 520, 110, 90, 12), COL.blueDk, 5); line(c, [[215, 430], [365, 440]], 5, COL.blueDk);
  line(c, [[740, 176], [700, 420]], 12, INK); line(c, [[800, 176], [840, 420]], 12, INK);
  const f = () => { c.moveTo(650, 410); c.lineTo(890, 410); c.bezierCurveTo(960, 560, 960, 800, 900, 940); c.quadraticCurveTo(770, 985, 640, 940); c.bezierCurveTo(580, 800, 580, 560, 650, 410); c.closePath(); };
  shape(c, f, COL.orange); dark(c, f, CLOTH.childDk, 20); shape(c, () => rrect(c, 700, 700, 140, 140, 18), CLOTH.childDk, 5);
  shape(c, () => rrect(c, 680, 392, 180, 30, 10), COL.blueDk, 5);
});
add("term.15", (c) => { // bounce: squashed on the floor
  scene(c, 800);
  const x = 540, y = 690; shadow(c, x + 20, 806, 230, 22);
  const p = () => ell(c, x, y, 190, 110);
  shape(c, p, ballKind.tennis[0], 7); dark(c, p, ballKind.tennis[1], 36);
  c.save(); c.beginPath(); p(); c.clip(); line(c, [[x - 190, y - 60], [x - 70, y], [x - 60, y + 80], [x - 90, y + 130]], 9, WHITE); line(c, [[x + 190, y + 60], [x + 70, y], [x + 60, y - 80], [x + 90, y - 130]], 9, WHITE); c.restore();
  shine(c, [[x - 110, y - 50], [x - 50, y - 82]], 10);
  arrow(c, [[250, 190], [250, 600]], RED, 13); arrow(c, [[830, 600], [830, 190]], RED, 13);
});
add("term.16", (c) => { // fold: a flat sheet, then a folded fan that holds a book
  scene(c, 850);
  shape(c, () => polyP(c, [[90, 835], [420, 835], [470, 910], [40, 910]]), PAPER, 6);
  arrow(c, [[260, 730], [470, 730]], RED, 13);
  shadow(c, 760, 862, 280, 22);
  const pts: number[][] = []; for (let i = 0; i <= 6; i++) pts.push([520 + i * 80, i % 2 ? 590 : 840]);
  line(c, pts, 34, INK); line(c, pts, 22, PAPER);
  block(c, 500, 590, 520, 120, COL.blue);
});
add("term.17", (c) => { // atom: from a spoon to a speck to atoms
  ground(c);
  line(c, [[215, 205], [350, 300]], 40, INK); line(c, [[215, 205], [350, 300]], 28, COL.steel);
  const sp = () => ell(c, 170, 170, 100, 68, 0.6); shape(c, sp, COL.steel); dark(c, sp, COL.steelDk, 16); shine(c, [[105, 150], [140, 120]], 9);
  arrow(c, [[300, 380], [350, 450]], RED, 12);
  shape(c, () => ell(c, 450, 600, 130, 130), WHITE, 7);
  c.save(); c.beginPath(); ell(c, 450, 600, 126, 126); c.clip(); const r = rnd(2); for (let i = 0; i < 170; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * 120; shape(c, () => ell(c, 450 + Math.cos(a) * d, 600 + Math.sin(a) * d, 5, 5), COL.blue, 2); } c.restore();
  arrow(c, [[590, 660], [650, 720]], RED, 12);
  shape(c, () => ell(c, 830, 780, 220, 220), WHITE, 7);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const x = 830 + (i - 1.5) * 90, y = 780 + (j - 1.5) * 90; if ((x - 830) ** 2 + (y - 780) ** 2 < 175 ** 2) { shape(c, () => ell(c, x, y, 33, 33), COL.blue, 5); shine(c, [[x - 14, y - 6], [x - 8, y - 16]], 6); } }
});
add("term.18", (c) => { // bond: balls joined by springs, pushed together and pulled apart
  ground(c);
  const atom = (x: number, y: number) => { shape(c, () => ell(c, x, y, 58, 58), COL.blue, 6); dark(c, () => ell(c, x, y, 58, 58), COL.blueDk, 14); shine(c, [[x - 24, y - 10], [x - 14, y - 28]], 8); };
  spring(c, 400, 600, 300, 8, 34); atom(350, 300); atom(650, 300);
  arrow(c, [[160, 300], [270, 300]], RED, 12); arrow(c, [[920, 300], [810, 300]], RED, 12);
  spring(c, 290, 790, 780, 6, 9); atom(235, 780); atom(845, 780);
  arrow(c, [[170, 780], [60, 780]], RED, 12); arrow(c, [[910, 780], [1020, 780]], RED, 12);
});
add("term.19", (c) => { // bone: two arm bones, the playing arm's a little thicker
  ground(c);
  bone(c, 540, 330, 640, 70);
  bone(c, 540, 700, 640, 105);
  shadow(c, 560, 780, 330, 14);
});

// ================================================================ ACTIVITIES
add("flow.g2", (c) => { // six things a force can do, on a dice chart
  ground(c);
  const T = (i: number) => { const x = 50 + (i % 3) * 340, y = 220 + Math.floor(i / 3) * 340; tag(c, x, y, 300, 300); return [x + 150, y + 150]; };
  const b = (x: number, y: number, r = 34) => ball(c, x, y, r, "tennis");
  let [x, y] = T(0); // start
  b(x + 50, y + 40); hand(c, x - 130, y + 40, 0, 0.7, SKIN.child, CLOTH.child, true); arrow(c, [[x - 70, y - 60], [x + 90, y - 60]], RED, 9);
  [x, y] = T(1); // stop
  for (const yy of [y - 10, y + 40, y + 90]) line(c, [[x - 130, yy], [x - 70, yy]], 8, COL.greyDk);
  b(x - 30, y + 40); hand(c, x + 112, y + 40, Math.PI, 0.7, SKIN.child, CLOTH.child, true);
  [x, y] = T(2); // speed up
  b(x - 100, y + 40, 28); b(x - 30, y + 40, 28); b(x + 80, y + 40, 28); arrow(c, [[x - 110, y - 50], [x + 110, y - 50]], RED, 9);
  [x, y] = T(3); // slow down
  b(x - 100, y + 40, 28); b(x + 10, y + 40, 28); b(x + 80, y + 40, 28); arrow(c, [[x - 110, y - 50], [x + 110, y - 50]], COL.greyDk, 5);
  [x, y] = T(4); // turn
  b(x - 80, y + 70); arrow(c, [[x - 80, y + 20], [x - 80, y - 30], [x + 10, y - 60], [x + 90, y - 100]], RED, 9);
  [x, y] = T(5); // change shape
  b(x - 80, y + 20, 38); shape(c, () => ell(c, x + 80, y + 50, 56, 26), ballKind.tennis[0], 5);
  arrow(c, [[x - 20, y - 40], [x + 40, y - 40]], RED, 9);
  shape(c, () => rrect(c, 470, 50, 140, 130, 24), WHITE);
  for (const [dx, dy] of [[-35, -30], [35, -30], [-35, 0], [35, 0], [-35, 30], [35, 30]]) shape(c, () => ell(c, 540 + dx, 115 + dy, 9, 9), INK, 0);
});
add("flow.e2", (c) => { // drop the same ball on six things
  ground(c);
  shape(c, () => ell(c, 540, 300, 80, 24), "#e9dcc0", 6); shape(c, () => rrect(c, 460, 20, 160, 280, 0), "#e9dcc0", 0);
  line(c, [[460, 20], [460, 300]], 6); line(c, [[620, 20], [620, 300]], 6); shape(c, () => ell(c, 540, 20, 80, 24), "#bfae88", 6);
  ball(c, 540, 380, 48, "cricket"); arrow(c, [[720, 300], [720, 450]], RED, 10);
  const slot = (x: number, y: number, f: (x: number, y: number) => void) => { plate(c, x, y, 130, 46); f(x, y - 18); };
  const row1 = 620, row2 = 880;
  slot(200, row1, (x, y) => { shape(c, () => ell(c, x, y, 78, 32), "#d9a45c"); for (const [dx, dy] of [[-30, -8], [10, -12], [40, 6], [-8, 10], [-45, 8]]) shape(c, () => ell(c, x + dx, y + dy, 4, 3), "#a9742f", 0); }); // biscuit
  slot(540, row1, (x, y) => dough(c, x, y - 10, 80, 38));
  slot(880, row1, (x, y) => { shape(c, () => ell(c, x, y, 82, 34), "#9c6c3d"); shape(c, () => ell(c, x, y - 4, 70, 27), "#efe3b6", 3); });
  slot(200, row2, (x, y) => { shape(c, () => ell(c, x, y, 82, 34), "#c79a4f"); shape(c, () => ell(c, x, y - 4, 70, 27), "#f6dd7b", 3); line(c, [[x - 20, y - 60], [x - 8, y - 85], [x - 22, y - 105]], 6, COL.grey); line(c, [[x + 24, y - 60], [x + 36, y - 85], [x + 22, y - 105]], 6, COL.grey); });
  slot(540, row2, (x, y) => { const p = () => rrect(c, x - 70, y - 48, 140, 70, 12); shape(c, p, "#f2cf4a"); shape(c, () => rrect(c, x - 70, y - 4, 140, 26, 8), COL.green); });
  slot(880, row2, (x, y) => { const p = () => { c.moveTo(x - 60, y + 14); c.bezierCurveTo(x - 80, y - 40, x - 10, y - 60, x + 40, y - 40); c.bezierCurveTo(x + 90, y - 20, x + 80, y + 14, x + 40, y + 16); c.closePath(); }; shape(c, p, COL.grey); dark(c, p, COL.greyDk, 12); });
});
add("flow.e3", (c) => { // wet ball prints
  ground(c);
  shape(c, () => polyP(c, [[110, 640], [970, 640], [1050, 1000], [30, 1000]]), WHITE, 6);
  for (const [x, y, rx, ry] of [[360, 830, 70, 30], [700, 800, 135, 52]] as const) { shape(c, () => ell(c, x, y, rx, ry), COL.water, 5); shape(c, () => ell(c, x - rx * 0.3, y - ry * 0.25, rx * 0.4, ry * 0.2), COL.drop, 0); }
  ball(c, 360, 640, 52, "tennis"); arrow(c, [[480, 600], [480, 700]], RED, 10);
  ball(c, 700, 320, 52, "tennis"); arrow(c, [[860, 260], [860, 700]], RED, 10);
});
add("flow.a1", (c) => { // shape the dough four ways
  ground(c);
  shape(c, () => rrect(c, 50, 50, 980, 980, 40), "#f6dfaa", 7);
  dough(c, 290, 290, 230, 85); // squashed
  tube(c, [[610, 340], [690, 200], [780, 380], [870, 200], [960, 340]], 70, DOUGH); // stretched snake
  tube(c, [[150, 800], [470, 800]], 120, DOUGH); for (let i = 0; i < 7; i++) line(c, [[185 + i * 44, 750], [225 + i * 44, 850]], 9, DOUGHDK); // twisted rope
  tube(c, [[690, 920], [640, 790], [720, 690], [850, 690], [930, 790], [880, 920]], 90, DOUGH); // horseshoe
});
add("flow.a2", (c) => { // bend a lined sponge: lines crowd inside, spread outside
  ground(c);
  const cx = 540, cy = 740, R1 = 200, R2 = 330, a0 = Math.PI + 0.45, a1 = 2 * Math.PI - 0.45;
  const ring = () => { c.arc(cx, cy, R2, a0, a1); c.arc(cx, cy, R1, a1, a0, true); c.closePath(); };
  shape(c, ring, "#f2cf4a", 7); dark(c, ring, "#d2a92c", 14);
  c.save(); c.beginPath(); ring(); c.clip(); c.beginPath(); c.arc(cx, cy, R1 + 22, a0, a1); c.arc(cx, cy, R1, a1, a0, true); c.fillStyle = COL.green; c.fill(); c.restore();
  for (let i = 0; i <= 5; i++) { const a = a0 + (a1 - a0) * (0.07 + i * 0.172); line(c, [[cx + Math.cos(a) * R1, cy + Math.sin(a) * R1], [cx + Math.cos(a) * R2, cy + Math.sin(a) * R2]], 7, INK); }
  hand(c, 200, 640, 0.25, 1.1, SKIN.child, CLOTH.child); hand(c, 880, 640, Math.PI - 0.25, 1.1, SKIN.child, CLOTH.child);
  arrow(c, [[70, 800], [160, 800]], RED, 12); arrow(c, [[1010, 800], [920, 800]], RED, 12);
});
add("flow.a3", (c) => { // wring a towel, twist cotton into a strong wick
  scene(c, 860);
  towelWring(c, 300, 560, 0.62);
  arrow(c, [[190, 460], [190, 380]], RED, 11); arrow(c, [[410, 650], [410, 730]], RED, 11);
  for (const [x, y] of [[250, 720], [300, 740], [350, 720]]) shape(c, () => { c.moveTo(x, y - 20); c.quadraticCurveTo(x - 16, y + 4, x, y + 14); c.quadraticCurveTo(x + 16, y + 4, x, y - 20); c.closePath(); }, COL.water, 4);
  shape(c, () => rrect(c, 640, 90, 380, 44, 16), COL.wood); shape(c, () => rrect(c, 820, 130, 24, 40, 8), COL.woodDk);
  tube(c, [[832, 160], [832, 520]], 26, PAPER); for (let i = 0; i < 9; i++) line(c, [[812, 190 + i * 38], [852, 168 + i * 38 + 22]], 5, COL.grey);
  const bag = () => { c.moveTo(740, 640); c.quadraticCurveTo(832, 600, 924, 640); c.bezierCurveTo(1000, 700, 990, 830, 832, 840); c.bezierCurveTo(674, 830, 664, 700, 740, 640); c.closePath(); };
  shape(c, bag, COL.pink); dark(c, bag, "#d9738f", 14); line(c, [[760, 640], [904, 640]], 8, INK);
  line(c, [[832, 520], [832, 620]], 12, INK); line(c, [[832, 520], [832, 620]], 5, PAPER);
  for (const [dx, dy] of [[-30, 20], [30, 30], [0, 10]]) coin(c, 832 + dx, 700 + dy + 40, 34);
});
add("flow.a4", (c) => { // the spaghetti puzzle: a bent stick snaps into three
  ground(c);
  const P0 = [200, 640], C0 = [540, 40], P2 = [880, 640], B = (t: number) => [(1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * C0[0] + t * t * P2[0], (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * C0[1] + t * t * P2[1]];
  const SP = (pts: number[][]) => { line(c, pts, 30, INK); line(c, pts, 18, "#f2c75a"); };
  const seg = (t0: number, t1: number, dy = 0) => { const pts: number[][] = []; for (let i = 0; i <= 12; i++) { const [x, y] = B(t0 + (t1 - t0) * i / 12); pts.push([x, y + dy]); } SP(pts); };
  seg(0, 0.3); seg(0.37, 0.63, -50); seg(0.7, 1);
  for (const [x, y, a] of [[400, 330, 0.7], [680, 330, -0.6], [470, 200, 1.5], [620, 150, 0.2]] as const) SP([[x - Math.cos(a) * 24, y - Math.sin(a) * 24], [x + Math.cos(a) * 24, y + Math.sin(a) * 24]]);
  hand(c, 200, 730, -Math.PI / 2, 1.2, SKIN.child, CLOTH.child); hand(c, 880, 730, -Math.PI / 2, 1.2, SKIN.child, CLOTH.child);
  arrow(c, [[320, 880], [400, 880]], RED, 11); arrow(c, [[760, 880], [680, 880]], RED, 11);
});
add("flow.a5", (c) => { // is the table bending? laser, mirror, wall dot
  ground(c);
  shape(c, () => rrect(c, 930, 0, 150, 1080, 0), "#cfe3f2", 6);
  shape(c, () => rrect(c, 40, 700, 880, 60, 12), COL.wood); shape(c, () => rrect(c, 90, 760, 50, 240, 8), COL.woodDk); shape(c, () => rrect(c, 820, 760, 50, 240, 8), COL.woodDk);
  block(c, 60, 700, 180, 60, COL.teal); block(c, 60, 640, 180, 60, COL.purple);
  shape(c, () => rrect(c, 90, 520, 170, 54, 14), "#3a3540");
  line(c, [[250, 560], [480, 690]], 9, RED); line(c, [[480, 690], [930, 425]], 9, RED);
  shape(c, () => rrect(c, 390, 674, 180, 20, 8), COL.steelIn, 6); shine(c, [[410, 682], [480, 682]], 6);
  shape(c, () => ell(c, 930, 425, 22, 22), RED, 5);
  shape(c, () => ell(c, 930, 330, 22, 22), "rgba(215,55,43,0.3)", 4); arrow(c, [[1000, 410], [1000, 350]], RED, 9);
  hand(c, 700, 440, Math.PI / 2, 1.1, SKIN.adult, CLOTH.adult, true); arrow(c, [[860, 530], [860, 660]], RED, 11);
});
add("flow.a6", (c) => { // push a towel into mountains, squash a planet
  scene(c, 850);
  shape(c, () => rrect(c, 960, 80, 120, 770, 0), "#cfe3f2", 6);
  const pts = [[110, 820], [330, 820], [440, 620], [540, 820], [620, 700], [700, 820], [770, 540], [860, 820], [940, 690]];
  line(c, pts, 52, INK); line(c, pts, 38, COL.teal);
  hand(c, 70, 770, 0, 1.3, SKIN.child, CLOTH.child); arrow(c, [[190, 650], [350, 650]], RED, 12);
  const pl = () => ell(c, 400, 250, 190, 140);
  shape(c, pl, COL.blue); c.save(); c.beginPath(); pl(); c.clip(); shape(c, () => polyP(c, [[270, 190], [370, 140], [450, 190], [400, 250], [330, 270]]), COL.green, 5); shape(c, () => polyP(c, [[430, 290], [520, 250], [540, 320], [460, 360]]), COL.green, 5); c.restore(); shape(c, pl, "rgba(0,0,0,0)", 7);
  curve(c, 400, 250, 235, Math.PI * 1.15, Math.PI * 1.55, RED, 11);
});
add("flow.c1", (c) => { // paper bridge: a folded fan holds coins across a gap
  scene(c, 850);
  block(c, 30, 850, 350, 190, COL.teal); block(c, 700, 850, 350, 190, COL.orange);
  const pts: number[][] = []; for (let i = 0; i <= 8; i++) pts.push([380 + i * 40, i % 2 ? 750 : 660]);
  line(c, pts, 20, INK); line(c, pts, 10, PAPER);
  shape(c, () => rrect(c, 380, 640, 320, 18, 6), PAPER, 4);
  for (let i = 0; i < 6; i++) coin(c, 540, 624 - i * 26, 62);
  arrow(c, [[540, 330], [540, 400]], RED, 10);
});
add("flow.c2", (c) => { // save the egg: a cup of crumpled paper around an egg
  scene(c, 860);
  shadow(c, 560, 868, 220, 20);
  const cup = () => { c.moveTo(380, 560); c.lineTo(700, 560); c.lineTo(640, 860); c.lineTo(440, 860); c.closePath(); };
  shape(c, cup, COL.teal); dark(c, cup, COL.tealDk, 14);
  const bagp = () => { c.moveTo(450, 560); c.quadraticCurveTo(450, 400, 540, 395); c.quadraticCurveTo(640, 400, 635, 560); c.closePath(); };
  shape(c, bagp, "rgba(214,236,250,0.55)", 5); egg(c, 543, 470, 0.9);
  for (let i = 0; i < 8; i++) shape(c, () => ell(c, 410 + i * 38, 552 + (i % 2 ? -6 : 8), 46, 34), i % 2 ? "#f1eadb" : "#e0d8c5", 5);
  arrow(c, [[540, 130], [540, 330]], RED, 13);
  shape(c, () => rrect(c, 150, 200, 60, 660, 8), COL.yellow, 5);
  for (let i = 0; i <= 10; i++) line(c, [[210, 200 + i * 66], [210 - (i % 5 === 0 ? 40 : 22), 200 + i * 66]], 4, INK);
  write(c, "1 m", 90, 120, 56, INK, 8);
});
const ORDER = Object.keys(cardList);
export const KEYS = ORDER;
export const ic_forcesChangingMotionL3 = cards("sci.forces.changing-motion.L3 cards", ORDER.map((k) => cardList[k]));
