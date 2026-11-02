import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, leaf, hand, person, write, cards } from "./flatKit";

// CELLS (L3) · fill-in cards: cover, main idea, onion skin, cheek cells, curd bowls, the cell atlas.
// Cells are always shown inside a round "zoom bubble": pale paper, a thick ink ring.

const ONION = "#b07cc2", ONION_DK = "#8a5aa0", ONION_IN = "#f3e6f7", PAPERY = "#d9a86a";
const CELL = "#f6e7b3", CELL_DK = "#e3c97c", NUC = "#c98a3c", CHEEK = "#e9cbe3", CHEEK_NUC = "#8b4f9e", CURD = "#fbf6ea", MILK = "#fdfcf5";

const circ = (c: Ctx, x: number, y: number, r: number) => ell(c, x, y, r, r);
// rows of brick-shaped cells (onion, or green leaf cells) covering a clipped area; call inside a clip
const brickCells = (c: Ctx, x0: number, y0: number, x1: number, y1: number, w: number, h: number, fill = CELL, dk = CELL_DK, nuc = NUC, seedN = 3) => {
  const r = rnd(seedN);
  for (let row = 0, y = y0 - h; y < y1 + h; row++, y += h) {
    const off = row % 2 ? w * 0.5 : 0;
    for (let x = x0 - w * 1.5 + off; x < x1 + w; x += w) {
      shape(c, () => rrect(c, x + 3, y + 3, w - 6, h - 6, Math.min(w, h) * 0.2), fill, 4);
      shade(c, () => rrect(c, x + 3, y + 3, w - 6, h - 6, Math.min(w, h) * 0.2), dk, -w * 0.12, -h * 0.14, 0.5);
      shape(c, () => ell(c, x + w * 0.35 + r() * w * 0.3, y + h * 0.35 + r() * h * 0.3, w * 0.11, h * 0.15), nuc, 2.5);
    }
  }
};
// loose roundish cheek cells, each a soft blob with a purple nucleus; call inside a clip
const cheekCells = (c: Ctx, x: number, y: number, R: number, seedN = 5) => {
  const r = rnd(seedN);
  const spots: number[][] = [[0, 0], [-0.55, -0.4], [0.5, -0.5], [-0.5, 0.5], [0.55, 0.45], [0, -0.85], [0, 0.85], [-0.9, 0.05], [0.9, 0]];
  spots.forEach(([u, v]) => {
    const cx = x + u * R * 0.95, cy = y + v * R * 0.95, rr = R * 0.26;
    const blob = () => { c.moveTo(cx + rr, cy); for (let k = 1; k <= 8; k++) { const a = (k / 8) * Math.PI * 2, q = rr * (0.85 + r() * 0.3); c.quadraticCurveTo(cx + Math.cos(a - 0.39) * q * 1.08, cy + Math.sin(a - 0.39) * q * 1.08, cx + Math.cos(a) * q, cy + Math.sin(a) * q); } c.closePath(); };
    shape(c, blob, CHEEK, 4);
    shape(c, () => ell(c, cx + rr * 0.1, cy, rr * 0.3, rr * 0.3), CHEEK_NUC, 2.5);
  });
};
// a round zoom bubble: shadow, pale disc, the cells inside, a thick ring
const bubble = (c: Ctx, x: number, y: number, r: number, inside: () => void) => {
  shadow(c, x + r * 0.08, y + r * 0.1, r, r);
  shape(c, () => circ(c, x, y, r), COL.paper, 0);
  c.save(); c.beginPath(); circ(c, x, y, r); c.clip(); inside(); c.restore();
  shape(c, () => circ(c, x, y, r), "rgba(0,0,0,0)", 10);
  shine(c, [[x - r * 0.62, y - r * 0.55], [x - r * 0.3, y - r * 0.82]], 10);
};
// a whole onion, bottom centre at (x, y)
const onion = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 0.05, r * 0.9, r * 0.18);
  const body = () => { c.moveTo(x, y - r * 2.05); c.bezierCurveTo(x + r * 1.3, y - r * 1.9, x + r * 1.1, y + r * 0.1, x, y); c.bezierCurveTo(x - r * 1.1, y + r * 0.1, x - r * 1.3, y - r * 1.9, x, y - r * 2.05); c.closePath(); };
  shape(c, body, ONION);
  shade(c, body, ONION_DK, -r * 0.35, -r * 0.1, 0.45);
  line(c, [[x - r * 0.25, y - r * 1.9], [x - r * 0.45, y - r * 0.6]], 4, ONION_DK); line(c, [[x + r * 0.25, y - r * 1.9], [x + r * 0.45, y - r * 0.6]], 4, ONION_DK);
  shape(c, () => { c.moveTo(x - r * 0.12, y - r * 2); c.lineTo(x - r * 0.1, y - r * 2.45); c.lineTo(x + r * 0.15, y - r * 2.1); c.lineTo(x + r * 0.2, y - r * 2.5); c.lineTo(x + r * 0.28, y - r * 1.95); c.closePath(); }, PAPERY, 5);
};
// a thin see-through piece of onion skin: a soft strip with faint cell lines, from (x0, y0) to (x1, y1), width w
const skinStrip = (c: Ctx, x0: number, y0: number, x1: number, y1: number, w: number) => {
  const an = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(an) * w / 2, ny = Math.cos(an) * w / 2;
  const p = () => polyP(c, [[x0 + nx, y0 + ny], [x1 + nx * 0.8, y1 + ny * 0.8], [x1 - nx * 1.1, y1 - ny * 1.1], [x0 - nx, y0 - ny]]);
  shape(c, p, "rgba(255,246,225,0.85)", 4);
  c.save(); c.beginPath(); p(); c.clip(); c.globalAlpha = 0.35;
  for (let t = 0.08; t < 1; t += 0.11) { const px = x0 + (x1 - x0) * t, py = y0 + (y1 - y0) * t; line(c, [[px + nx, py + ny], [px - nx, py - ny]], 2.5, NUC); }
  c.restore(); c.globalAlpha = 1;
};
// a steel spoon, bowl of the spoon at (x, y), handle pointing at angle an
const spoon = (c: Ctx, x: number, y: number, an: number, len: number) => {
  const hx = x + Math.cos(an) * len, hy = y + Math.sin(an) * len;
  line(c, [[x, y], [hx, hy]], 22, INK); line(c, [[x, y], [hx, hy]], 12, COL.steel);
  shape(c, () => ell(c, x, y, 34, 24, an), COL.steel, 5);
  shape(c, () => ell(c, x, y, 20, 12, an), COL.steelDk, 0);
};

// 0 · cover: a child holds a thin onion skin up to the phone's camera (a water drop on its lens); the zoom bubble shows rows of brick cells
const cover = (c: Ctx) => {
  ground(c);
  onion(c, 880, 980, 110);
  // lines from the lens out to the bubble
  line(c, [[345, 350], [640, 150]], 5, COL.greyDk); line(c, [[345, 420], [620, 450]], 5, COL.greyDk);
  bubble(c, 790, 290, 200, () => brickCells(c, 590, 90, 990, 490, 120, 70));
  // the phone, seen from the back, held from below
  shadow(c, 420, 880, 180, 30);
  shape(c, () => rrect(c, 250, 290, 300, 580, 40), COL.teal);
  shade(c, () => rrect(c, 250, 290, 300, 580, 40), COL.tealDk, -40, -30, 0.5);
  shape(c, () => rrect(c, 275, 315, 110, 110, 24), COL.black, 5);
  shape(c, () => circ(c, 330, 370, 32), "#4b5a66", 4);
  shape(c, () => ell(c, 330, 372, 40, 34), "rgba(143,195,234,0.8)", 4);
  shine(c, [[312, 356], [322, 350]], 7);
  hand(c, 400, 905, -Math.PI / 2, 1.25, SKIN.child, CLOTH.child);
  // the onion skin, held in front of the lens by the other hand
  skinStrip(c, 290, 345, 600, 455, 70);
  hand(c, 690, 445, Math.PI, 1.05, SKIN.child, CLOTH.child);
};

// 1 · main idea: one cell, big, in the middle; around it a child, a mango tree, an ant and a mushroom, each made of cells
const mainIdea = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 500;
  [[190, 300], [890, 240], [190, 860], [890, 880]].forEach(([x, y]) => line(c, [[x, y], [cx, cy]], 5, COL.greyDk));
  bubble(c, cx, cy, 235, () => {
    const mem = () => { c.moveTo(cx - 190, cy - 20); c.bezierCurveTo(cx - 200, cy - 180, cx + 40, cy - 210, cx + 150, cy - 140); c.bezierCurveTo(cx + 240, cy - 60, cx + 200, cy + 150, cx + 40, cy + 185); c.bezierCurveTo(cx - 120, cy + 210, cx - 180, cy + 120, cx - 190, cy - 20); c.closePath(); };
    shape(c, mem, CELL, 9);
    shade(c, mem, CELL_DK, -30, -30, 0.45);
    shape(c, () => ell(c, cx + 20, cy - 10, 70, 62), "#b48be0", 6);
    shape(c, () => circ(c, cx + 30, cy - 18, 20), CHEEK_NUC, 0);
    [[cx - 110, cy + 60], [cx + 120, cy + 90], [cx - 60, cy - 110], [cx + 140, cy - 90]].forEach(([x, y], i) => shape(c, () => ell(c, x, y, 14 + i * 2, 10 + i), COL.greenLt, 3));
  });
  // mango tree
  shape(c, () => polyP(c, [[165, 420], [215, 420], [205, 300], [175, 300]]), COL.brown);
  shape(c, () => circ(c, 190, 250), COL.leaf, 0); shape(c, () => circ(c, 190, 250, 115), COL.leaf);
  shape(c, () => circ(c, 120, 290, 60), COL.leafDk, 5); shape(c, () => circ(c, 250, 220, 70), COL.leafDk, 5);
  [[150, 240], [220, 300], [240, 190]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 16, 22), COL.orange, 4));
  // ant
  const ant = (x: number, y: number) => {
    for (const s of [-1, 1]) [[-40, 0], [0, 0], [40, 0]].forEach(([dx]) => line(c, [[x + dx, y], [x + dx + s * 10, y + 40], [x + dx + s * 25, y + 75]], 6, INK));
    shape(c, () => ell(c, x - 70, y - 10, 40, 30), "#7a3b2e"); shape(c, () => ell(c, x, y, 28, 22), "#7a3b2e"); shape(c, () => ell(c, x + 60, y - 20, 48, 38), "#7a3b2e");
    line(c, [[x + 90, y - 45], [x + 130, y - 90]], 5, INK); line(c, [[x + 70, y - 55], [x + 80, y - 110]], 5, INK);
    shape(c, () => circ(c, x + 85, y - 30, 7), INK, 0);
  };
  ant(880, 240);
  // child
  person(c, 190, 1010, 320, { armL: [Math.PI * 0.6, Math.PI * 0.45], armR: [-Math.PI * 0.25, -Math.PI * 0.2] });
  // mushroom
  shadow(c, 905, 1000, 90, 18);
  shape(c, () => polyP(c, [[850, 990], [930, 990], [920, 860], [860, 860]]), COL.paper);
  shape(c, () => { c.moveTo(760, 880); c.quadraticCurveTo(890, 690, 1020, 880); c.closePath(); }, COL.red);
  shade(c, () => { c.moveTo(760, 880); c.quadraticCurveTo(890, 690, 1020, 880); c.closePath(); }, "#b63b2a", -40, -20, 0.45);
  [[820, 830], [890, 780], [960, 840]].forEach(([x, y]) => shape(c, () => circ(c, x, y, 16), WHITE, 3));
};

// 2 · onion skin: a cut onion, the peeled skin laid on a slide, and a big hand lens showing the rooms
const onionSkin = (c: Ctx) => {
  ground(c);
  // the cut onion half, rings showing
  shadow(c, 220, 960, 170, 30);
  shape(c, () => circ(c, 200, 790, 165), ONION);
  for (let r = 130; r > 0; r -= 40) shape(c, () => circ(c, 200, 790, r), r % 80 ? ONION_IN : "#e6cfeb", 4);
  // the skin on a slide, with an arrow from the onion to the slide
  arrow(c, [[320, 650], [420, 580], [480, 620]]);
  shadow(c, 560, 1010, 300, 22);
  shape(c, () => polyP(c, [[300, 880], [820, 880], [860, 1000], [260, 1000]]), "rgba(214,236,250,0.75)", 5);
  skinStrip(c, 420, 945, 720, 935, 60);
  // the hand lens over the slide
  bubble(c, 540, 440, 215, () => brickCells(c, 325, 225, 755, 655, 125, 72, CELL, CELL_DK, NUC, 9));
  shape(c, () => circ(c, 540, 440, 240), "rgba(0,0,0,0)", 0);
  c.beginPath(); circ(c, 540, 440, 232); c.strokeStyle = COL.woodDk; c.lineWidth = 26; c.stroke();
  c.beginPath(); circ(c, 540, 440, 246); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  line(c, [[705, 605], [905, 805]], 56, INK); line(c, [[705, 605], [905, 805]], 42, COL.wood);
  hand(c, 975, 875, -Math.PI * 0.75, 1.1, SKIN.child, CLOTH.child);
};

// 3 · cheek cells: a cotton bud gently rubbed inside the child's cheek; the bubble shows round loose cells
const cheek = (c: Ctx) => {
  ground(c);
  // shoulders and head
  shape(c, () => rrect(c, 150, 820, 480, 400, 80), CLOTH.child);
  shade(c, () => rrect(c, 150, 820, 480, 400, 80), CLOTH.childDk, -60, 0, 0.5);
  line(c, [[390, 760], [390, 850]], 90, INK); line(c, [[390, 760], [390, 850]], 70, SKIN.child);
  shape(c, () => ell(c, 390, 560, 200, 215), SKIN.child);
  shade(c, () => ell(c, 390, 560, 200, 215), SKIN.childDk, -40, -30, 0.4);
  shape(c, () => { c.moveTo(186, 560); c.bezierCurveTo(190, 280, 590, 280, 594, 560); c.quadraticCurveTo(390, 440, 186, 560); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, 196, 580, 30, 46), SKIN.child, 5);
  shape(c, () => ell(c, 330, 560, 16, 22), INK, 0); shape(c, () => ell(c, 450, 560, 16, 22), INK, 0);
  // open mouth with the cheek inside
  shape(c, () => ell(c, 420, 680, 85, 60), "#8b3a4a", 6);
  shape(c, () => ell(c, 420, 652, 70, 14), WHITE, 3);
  // the cotton bud: stick from the hand into the mouth, white tip on the inside of the cheek
  line(c, [[470, 690], [760, 600]], 14, INK); line(c, [[470, 690], [760, 600]], 7, COL.paper);
  shape(c, () => ell(c, 462, 692, 22, 16, -0.3), WHITE, 4);
  arrow(c, [[500, 760], [470, 730], [480, 700]], RED, 8);
  hand(c, 850, 575, Math.PI * 0.9, 1.1, SKIN.child, CLOTH.child);
  // the bubble: what the microscope shows
  line(c, [[500, 640], [640, 440]], 5, COL.greyDk); line(c, [[520, 700], [700, 540]], 5, COL.greyDk);
  bubble(c, 820, 280, 200, () => cheekCells(c, 820, 280, 200));
};

// 4 · curd bowls: 1 living curd (thick next morning), 2 nothing, 3 boiled curd (both still runny)
const curdBowls = (c: Ctx) => {
  ground(c);
  const xs = [200, 540, 880];
  xs.forEach((x, i) => {
    const set = i === 0;
    bowl(c, x, 620, 140, set ? CURD : MILK);
    if (set) {
      // thick curd: a standing spoon, a lump of curd on it, cracks in the surface
      line(c, [[x - 30, 600], [x - 20, 560], [x, 580]], 4, COL.grey); line(c, [[x + 60, 615], [x + 90, 605]], 4, COL.grey);
      spoon(c, x + 20, 622, -Math.PI * 0.42, 230);
      shape(c, () => ell(c, x + 20, 618, 48, 26), CURD, 4);
    } else {
      // runny milk: the spoon lifted, milk running off in drops
      shape(c, () => ell(c, x, 620, 100, 12), "rgba(143,195,234,0.35)", 0);
      spoon(c, x + 10, 440, -Math.PI * 0.35, 220);
      [[x - 8, 500], [x + 14, 540], [x, 580]].forEach(([dx, dy], k) => shape(c, () => ell(c, dx, dy, 9 - k, 14 - k), MILK, 3));
    }
    // the tag under each bowl: what went in
    shape(c, () => rrect(c, x - 120, 790, 240, 200, 20), WHITE, 5);
    write(c, String(i + 1), x - 105, 805, 60, INK, 7);
    if (i === 1) line(c, [[x - 30, 905], [x + 50, 905]], 9, COL.greyDk);
    else {
      spoon(c, x + 10, 900, -Math.PI * 0.2, 90);
      shape(c, () => ell(c, x + 10, 896, 40, 26), CURD, 4);
      if (i === 2) {
        shape(c, () => { c.moveTo(x - 60, 980); c.quadraticCurveTo(x - 90, 920, x - 50, 880); c.quadraticCurveTo(x - 40, 920, x - 25, 900); c.quadraticCurveTo(x - 10, 930, x - 20, 980); c.closePath(); }, COL.orange, 4);
        shape(c, () => { c.moveTo(x - 52, 978); c.quadraticCurveTo(x - 62, 940, x - 42, 920); c.quadraticCurveTo(x - 30, 950, x - 32, 978); c.closePath(); }, COL.yellow, 0);
      }
    }
  });
};

// 5 · the cell atlas: an open notebook with two days' drawings, the things looked at above, a hand still drawing
const atlas = (c: Ctx) => {
  ground(c);
  // the things looked at, in a row
  onion(c, 130, 230, 55);
  leaf(c, 300, 240, 170, -Math.PI * 0.42, "#6f4f8f"); leaf(c, 300, 240, 150, -Math.PI * 0.58);
  bowl(c, 540, 170, 90, CURD);
  shape(c, () => ell(c, 760, 190, 85, 60, 0.2), PAPERY); shade(c, () => ell(c, 760, 190, 85, 60, 0.2), COL.brown, -25, -15, 0.4);
  [[730, 175], [780, 205], [790, 165]].forEach(([x, y]) => shape(c, () => circ(c, x, y, 5), COL.soilDk, 0));
  shape(c, () => rrect(c, 900, 90, 120, 160, 16), "rgba(214,236,250,0.75)", 5);
  shape(c, () => polyP(c, [[905, 140], [1015, 140], [1015, 245], [905, 245]]), "rgba(143,195,234,0.6)", 0);
  leaf(c, 930, 230, 60, -Math.PI * 0.3); leaf(c, 990, 225, 55, -Math.PI * 0.8);
  shape(c, () => rrect(c, 892, 76, 136, 30, 10), COL.steel, 5);
  // the notebook
  shadow(c, 560, 940, 440, 40);
  const pageL = () => polyP(c, [[110, 420], [530, 440], [530, 920], [90, 900]]), pageR = () => polyP(c, [[550, 440], [970, 420], [990, 900], [550, 920]]);
  shape(c, pageL, COL.paper); shape(c, pageR, COL.paper);
  line(c, [[530, 440], [550, 440], [550, 920], [530, 920]], 6, INK);
  for (let y = 500; y < 900; y += 50) { c.globalAlpha = 0.25; line(c, [[130, y], [500, y]], 2, COL.blue); line(c, [[580, y], [950, y]], 2, COL.blue); c.globalAlpha = 1; }
  // day 1: the onion, its cells; day 2: the leaf, its cells (hand-drawn in pencil, so thinner rings)
  write(c, "1", 140, 450, 50, INK, 6); write(c, "2", 590, 450, 50, INK, 6);
  onion(c, 400, 560, 36);
  c.save(); c.beginPath(); circ(c, 300, 720, 130); c.clip(); c.fillStyle = WHITE; c.fillRect(170, 590, 260, 260); brickCells(c, 170, 590, 430, 850, 80, 48, CELL, CELL_DK, NUC, 21); c.restore();
  c.beginPath(); circ(c, 300, 720, 130); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  leaf(c, 860, 540, 110, -Math.PI * 0.75);
  c.save(); c.beginPath(); circ(c, 760, 720, 130); c.clip(); c.fillStyle = WHITE; c.fillRect(630, 590, 260, 260); brickCells(c, 630, 590, 890, 850, 70, 70, COL.greenLt, COL.green, COL.leafDk, 33); c.restore();
  c.beginPath(); circ(c, 760, 720, 130); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  // the pencil, still drawing the leaf cells
  line(c, [[800, 790], [910, 940]], 20, INK); line(c, [[800, 790], [910, 940]], 12, COL.yellow);
  shape(c, () => polyP(c, [[800, 790], [792, 768], [818, 776]]), PAPERY, 3);
  hand(c, 955, 1000, -Math.PI * 0.69, 1.0, SKIN.child, CLOTH.child);
};

export const ic_whatIsLifeCellsL3Fill = cards("sci.what-is-life.cells.L3 fill", [cover, mainIdea, onionSkin, cheek, curdBowls, atlas]);
