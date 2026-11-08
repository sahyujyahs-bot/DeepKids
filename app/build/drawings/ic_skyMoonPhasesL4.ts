import type { Ctx } from "./core";
import { D, INK, BG, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, plate, bowl, person, write, cards } from "./flatKit";

// sci.sky.moon-phases.L4 · READING THE MOON. Set-up cards for the dough Moon, the moonrise table and the bindi Moon,
// then the flow cards, one explanation and two terms. Moon lit on the right when growing (seen from India). Light in a
// dark room comes from the torch: shadows fall away from it, and the inner wall of a crater nearest the torch is dark.
const PI = Math.PI;
const NIGHT = "#2b3470", ROOM = "#2a2742", FLOOR = "#36324f", MLIT = "#fff3c4", MDARK = "#4a4f80", MDARK_N = "#161b3d";
const DOUGH = "#dcbf8e", DOUGHDK = "#b8966a", DOUGHIN = "#a8865c", DARK = "#241d2e";

// ---------------------------------------------------------------- sky things
const stars = (c: Ctx, x0: number, y0: number, x1: number, y1: number, n: number, sd = 5) => {
  const r = rnd(sd);
  for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), s = 2.5 + r() * 3.5; c.beginPath(); ell(c, x, y, s, s); c.fillStyle = "#fff6c8"; c.fill(); }
};
const ring = (c: Ctx, x: number, y: number, r: number, col: string, w = 6) => { c.beginPath(); c.arc(x, y, r, 0, PI * 2); c.strokeStyle = col; c.lineWidth = w; c.stroke(); };
// the Moon seen from Earth: f = lit fraction (0 new .. 1 full); wax = lit on the right, else on the left
const moon = (c: Ctx, x: number, y: number, r: number, f: number, wax = true, dark = MDARK, lit = MLIT, maria = true) => {
  c.beginPath(); ell(c, x, y, r, r); c.fillStyle = dark; c.fill();
  c.save(); c.translate(x, y); if (!wax) c.scale(-1, 1); c.translate(-x, -y);
  if (f >= 0.999) { c.beginPath(); ell(c, x, y, r, r); c.fillStyle = lit; c.fill(); }
  else if (f > 0.001) {
    c.beginPath(); c.moveTo(x, y - r); c.arc(x, y, r, -PI / 2, PI / 2, false);
    const rx = r * Math.abs(1 - 2 * f);
    if (f < 0.5) c.ellipse(x, y, rx, r, 0, PI / 2, -PI / 2, true); else c.ellipse(x, y, rx, r, 0, PI / 2, PI * 1.5, false);
    c.closePath(); c.fillStyle = lit; c.fill();
  }
  c.restore();
  if (maria) {
    c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip();
    for (const [dx, dy, k] of [[-0.35, -0.3, 0.2], [0.3, 0.1, 0.26], [-0.1, 0.5, 0.15], [0.45, -0.45, 0.12]]) { c.beginPath(); ell(c, x + dx * r, y + dy * r, k * r, k * r); c.fillStyle = "rgba(90,85,120,0.16)"; c.fill(); }
    c.restore();
  }
  ring(c, x, y, r, INK, Math.max(3, r * 0.05));
};
// red dots along the terminator of a growing Moon (f <= 0.5): the ellipse arc that bounds the lit crescent
const terminator = (c: Ctx, x: number, y: number, r: number, f: number) => {
  const rx = r * (1 - 2 * f);
  for (let k = 0; k < 13; k++) { const t = -PI / 2 + ((k + 0.5) / 13) * PI; shape(c, () => ell(c, x + rx * Math.cos(t), y + r * Math.sin(t), 5, 5), RED, 0); }
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 12; k++) { const a = (k * PI) / 6, p = (m: number, d: number) => [x + Math.cos(a + d) * r * m, y + Math.sin(a + d) * r * m]; shape(c, () => polyP(c, [p(1.05, -0.13), p(1.6, 0), p(1.05, 0.13)]), COL.orange, 4); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
// flat-roofed houses with water tanks along the bottom of a panel, between x0 and x1, roofline about y
const rooftops = (c: Ctx, x0: number, x1: number, y: number, col = "#1b1f3f") => {
  const w = (x1 - x0) / 3;
  for (let i = 0; i < 3; i++) { const hx = x0 + i * w, hh = 80 + (i % 2) * 50; shape(c, () => rrect(c, hx, y - hh + 80, w + 2, hh + 300, 0), col, 0); }
  shape(c, () => rrect(c, x0 + w * 1.25, y - 60, w * 0.4, 70, 6), col, 0);
  shape(c, () => ell(c, x0 + w * 1.45, y - 60, w * 0.24, 12), col, 0);
};
const nightSky = (c: Ctx, x0: number, y0: number, x1: number, y1: number, sd: number) => { c.fillStyle = NIGHT; c.fillRect(x0, y0, x1 - x0, y1 - y0); stars(c, x0 + 20, y0 + 20, x1 - 20, y1 - 20, 22, sd); };

// ---------------------------------------------------------------- torch and light
// a torch whose hand grip (or resting point) is at (hx, hy), pointing along an; the hand holds the body a third of the
// way from the back. Returns the middle of the lens.
const torch = (c: Ctx, hx: number, hy: number, an: number, L = 180): [number, number] => {
  c.save(); c.translate(hx, hy); c.rotate(an);
  shape(c, () => rrect(c, -L * 0.35, -24, L * 0.78, 48, 14), COL.teal); shade(c, () => rrect(c, -L * 0.35, -24, L * 0.78, 48, 14), COL.tealDk, 0, 14, 0.5);
  shape(c, () => polyP(c, [[L * 0.4, -26], [L * 0.65, -42], [L * 0.65, 42], [L * 0.4, 26]]), COL.steel);
  shape(c, () => ell(c, L * 0.65, 0, 9, 42), COL.yellow, 4);
  c.restore();
  return [hx + Math.cos(an) * L * 0.65, hy + Math.sin(an) * L * 0.65];
};
// a soft cone of light from the lens (x0, y0), half-width w0, to (x1, y1), half-width w1
const beam = (c: Ctx, x0: number, y0: number, x1: number, y1: number, w0: number, w1: number) => {
  const an = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(an), ny = Math.cos(an);
  c.beginPath(); c.moveTo(x0 + nx * w0, y0 + ny * w0); c.lineTo(x1 + nx * w1, y1 + ny * w1); c.lineTo(x1 - nx * w1, y1 - ny * w1); c.lineTo(x0 - nx * w0, y0 - ny * w0); c.closePath();
  c.fillStyle = "rgba(255,228,130,0.3)"; c.fill();
};
// fingers wrapped over a held handle at the hand point
const grip = (c: Ctx, x: number, y: number, an: number, skin: string = SKIN.child) => { shape(c, () => ell(c, x, y, 22, 32, an), skin, 5); line(c, [[x - Math.sin(an) * 14, y + Math.cos(an) * 14], [x - Math.sin(an) * 14 + Math.cos(an) * 12, y + Math.cos(an) * 14 + Math.sin(an) * 12]], 3, SKIN.childDk); };
// a stack of n books, bottom centre (x, y), width w; returns the top
const books = (c: Ctx, x: number, y: number, w: number, n: number): number => {
  const cols = [COL.red, COL.blue, COL.green];
  shadow(c, x + 14, y + 4, w * 0.6, 12);
  for (let i = 0; i < n; i++) { const by = y - (i + 1) * 34, ox = (i % 2) * 10; shape(c, () => rrect(c, x - w / 2 + ox, by, w, 34, 6), cols[i % 3]); line(c, [[x - w / 2 + ox + 12, by + 10], [x + w / 2 + ox - 12, by + 10]], 3, "rgba(255,255,255,0.5)"); }
  return y - n * 34;
};

// ---------------------------------------------------------------- the dough Moon
// a dough Moon pressed on to a plate, seen a little from above: base centre (x, y), half-width rx, height hgt.
// light "none" = an ordinary room; "top" = a torch straight above (short shadows); "left" = a torch low on the left
// (long shadows to the right, the left inner wall of each crater dark)
type Light = "none" | "top" | "left";
const CRATERS: [number, number, number][] = [[-0.55, -0.12, 0.2], [0.28, -0.62, 0.19], [0.55, 0, 0.17], [-0.18, -0.38, 0.1], [0.08, 0.12, 0.09], [-0.42, -0.7, 0.08]];
const LUMPS: [number, number, number][] = [[-0.3, -0.78, 0.13], [0.1, -1.0, 0.15], [0.42, -0.45, 0.12]];
const doughMoon = (c: Ctx, x: number, y: number, rx: number, hgt: number, light: Light) => {
  plate(c, x, y + 8, rx * 1.5, rx * 0.5);
  const dome = () => { c.moveTo(x - rx, y); c.bezierCurveTo(x - rx, y - hgt * 1.35, x + rx, y - hgt * 1.35, x + rx, y); c.quadraticCurveTo(x, y + rx * 0.28, x - rx, y); c.closePath(); };
  shape(c, dome, DOUGH);
  if (light === "left") shade(c, dome, DOUGHDK, rx * 0.3, hgt * 0.1, 0.5); else if (light === "none") shade(c, dome, DOUGHDK, rx * 0.2, hgt * 0.15, 0.35);
  for (const [lx, ly, ls] of LUMPS) {
    const bx = x + lx * rx, by = y + ly * hgt, s = ls * rx;
    // the lump's shadow lies on the dough, so it is clipped to the dome
    c.save(); c.beginPath(); dome(); c.clip();
    if (light === "left") shape(c, () => ell(c, bx + s * 2.4, by + s * 0.1, s * 2.4, s * 0.42), DARK, 0);
    if (light === "top") shape(c, () => ell(c, bx, by + s * 0.1, s * 1.1, s * 0.3), "rgba(36,29,46,0.35)", 0);
    c.restore();
    const lump = () => { c.moveTo(bx - s, by); c.quadraticCurveTo(bx - s * 0.6, by - s * 1.6, bx, by - s * 1.8); c.quadraticCurveTo(bx + s * 0.6, by - s * 1.6, bx + s, by); c.quadraticCurveTo(bx, by + s * 0.35, bx - s, by); c.closePath(); };
    shape(c, lump, DOUGH, 5);
    if (light !== "top") shade(c, lump, DOUGHDK, s * 0.45, 0, 0.5);
  }
  for (const [cx, cy, k] of CRATERS) {
    const px = x + cx * rx, py = y + cy * hgt, r = k * rx, ry = r * 0.62;
    shape(c, () => ell(c, px, py, r, ry), light === "top" ? DOUGHDK : DOUGHIN, light === "top" ? 3 : 5);
    if (light === "left") { c.save(); c.beginPath(); ell(c, px, py, r, ry); c.clip(); c.beginPath(); ell(c, px + r * 0.55, py + ry * 0.12, r, ry); c.rect(-5000, -5000, 10000, 10000); c.fillStyle = DARK; c.fill("evenodd"); c.restore(); }
    if (light === "none") { c.save(); c.beginPath(); ell(c, px, py, r, ry); c.clip(); c.beginPath(); ell(c, px + r * 0.2, py + ry * 0.3, r, ry); c.rect(-5000, -5000, 10000, 10000); c.fillStyle = "rgba(36,29,46,0.35)"; c.fill("evenodd"); c.restore(); }
  }
};
// a glass marble and a bottle cap lying on the table
const marble = (c: Ctx, x: number, y: number, r: number) => { shadow(c, x + r * 0.2, y + r * 0.9, r, r * 0.3); shape(c, () => ell(c, x, y, r, r), COL.blue, 0); shade(c, () => ell(c, x, y, r, r), COL.blueDk, r * 0.3, r * 0.25, 0.6); shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", 5); shape(c, () => ell(c, x - r * 0.35, y - r * 0.35, r * 0.22, r * 0.15, -0.6), WHITE, 0); };
const bottleCap = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.2, y + r * 0.55, r, r * 0.3);
  shape(c, () => { c.moveTo(x - r, y); c.lineTo(x - r, y + r * 0.35); c.bezierCurveTo(x - r, y + r * 0.9, x + r, y + r * 0.9, x + r, y + r * 0.35); c.lineTo(x + r, y); c.closePath(); }, "#a8281f", 5);
  shape(c, () => ell(c, x, y, r, r * 0.4), COL.red, 5);
  shape(c, () => ell(c, x, y, r * 0.6, r * 0.22), "#a8281f", 3);
};

// ---------------------------------------------------------------- paper, phone, tools
const paper = (c: Ctx, x: number, y: number, w: number, h: number, col: string = COL.paper) => { shadow(c, x + w / 2 + 12, y + h + 8, w / 2, 16); shape(c, () => rrect(c, x, y, w, h, 14), col, 6); };
// a spiral notebook, open flat, with ruled lines
const notebook = (c: Ctx, x: number, y: number, w: number, h: number, rules = true) => {
  paper(c, x, y, w, h);
  for (let k = 0; k < Math.floor(w / 60); k++) shape(c, () => ell(c, x + 45 + k * 60, y, 10, 14), COL.steel, 4);
  if (rules) for (let yy = y + 70; yy < y + h - 30; yy += 46) line(c, [[x + 30, yy], [x + w - 30, yy]], 2, "rgba(91,143,214,0.45)");
};
const squared = (c: Ctx, x: number, y: number, w: number, h: number, step = 40) => {
  paper(c, x, y, w, h);
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 14); c.clip();
  c.strokeStyle = "rgba(91,143,214,0.35)"; c.lineWidth = 2;
  for (let gx = x + step; gx < x + w; gx += step) { c.beginPath(); c.moveTo(gx, y); c.lineTo(gx, y + h); c.stroke(); }
  for (let gy = y + step; gy < y + h; gy += step) { c.beginPath(); c.moveTo(x, gy); c.lineTo(x + w, gy); c.stroke(); }
  c.restore();
};
const phone = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 12, y + h + 8, w / 2, 16);
  shape(c, () => rrect(c, x, y, w, h, 44), COL.black);
  shape(c, () => rrect(c, x + 16, y + 56, w - 32, h - 112, 18), WHITE, 4);
  line(c, [[x + w / 2 - 40, y + 30], [x + w / 2 + 40, y + 30]], 6, COL.greyDk);
  shape(c, () => ell(c, x + w / 2, y + h - 28, 16, 16), COL.greyDk, 3);
};
// a time such as "14:35": digits with a colon drawn as two dots. Returns the width used.
const clockText = (c: Ctx, t: string, x: number, y: number, h: number, col: string = INK, w = 6): number => {
  const [hh, mm] = t.split(":");
  write(c, hh, x, y, h, col, w);
  const cx = x + hh.length * h * 0.8 + h * 0.12;
  shape(c, () => ell(c, cx, y + h * 0.3, w * 0.6, w * 0.6), col, 0); shape(c, () => ell(c, cx, y + h * 0.72, w * 0.6, w * 0.6), col, 0);
  write(c, mm, cx + h * 0.3, y, h, col, w);
  return hh.length * h * 0.8 + h * 0.42 + mm.length * h * 0.8;
};
const equals = (c: Ctx, x: number, y: number, h: number) => { line(c, [[x, y + h * 0.42], [x + h * 0.5, y + h * 0.42]], 6); line(c, [[x, y + h * 0.68], [x + h * 0.5, y + h * 0.68]], 6); };
// a wooden ruler, left end at (x, y) (its upper edge), length len, pointing along an
const ruler = (c: Ctx, x: number, y: number, len: number, an: number, hgt = 70) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shadow(c, len / 2 + 10, hgt + 6, len / 2, 12);
  shape(c, () => rrect(c, 0, 0, len, hgt, 6), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(3, hgt - 14, len - 6, 11);
  c.strokeStyle = INK; c.lineCap = "butt";
  const n = Math.floor((len - 40) / 12);
  for (let k = 0; k <= n; k++) { const tx = 20 + k * 12, th = k % 10 === 0 ? 30 : k % 5 === 0 ? 21 : 12; c.lineWidth = k % 10 === 0 ? 4 : 2.5; c.beginPath(); c.moveTo(tx, 0); c.lineTo(tx, th); c.stroke(); }
  for (let k = 0; k <= n / 10; k++) write(c, String(k), 20 + k * 120 - 8, 34, 22, INK, 4);
  c.restore();
};
const calculator = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 10, y + h + 6, w / 2, 14);
  shape(c, () => rrect(c, x, y, w, h, 18), COL.steel);
  shape(c, () => rrect(c, x + 18, y + 18, w - 36, h * 0.22, 8), "#c9f06b", 4);
  write(c, "50", x + w - 36 - 2 * 0.8 * 36, y + 26, 36, "#22303a", 6);
  const bw = (w - 36 - 3 * 12) / 4, bh = (h - h * 0.22 - 60) / 4 - 12;
  for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) shape(c, () => rrect(c, x + 18 + k * (bw + 12), y + 30 + h * 0.22 + r * (bh + 12), bw, bh, 8), k === 3 ? COL.orange : COL.steelIn, 3);
};
const pencil = (c: Ctx, x: number, y: number, len: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -13, len - 40, 26, 4), COL.yellow); shape(c, () => polyP(c, [[len - 40, -13], [len, 0], [len - 40, 13]]), COL.wood, 4); shape(c, () => polyP(c, [[len - 14, -4.5], [len, 0], [len - 14, 4.5]]), INK, 0);
  shape(c, () => rrect(c, -8, -13, 24, 26, 4), COL.pink, 4);
  c.restore();
};
// a round clock face, centre (x, y), showing hour h and minute m
const clock = (c: Ctx, x: number, y: number, r: number, hr: number, mn: number) => {
  shadow(c, x + r * 0.1, y + r * 1.05, r * 0.9, r * 0.14);
  shape(c, () => ell(c, x, y, r, r), COL.teal); shape(c, () => ell(c, x, y, r * 0.84, r * 0.84), WHITE, 4);
  for (let k = 0; k < 12; k++) { const a = (k * PI) / 6; line(c, [[x + Math.cos(a) * r * 0.74, y + Math.sin(a) * r * 0.74], [x + Math.cos(a) * r * 0.64, y + Math.sin(a) * r * 0.64]], k % 3 === 0 ? 6 : 3); }
  const ha = ((hr % 12) + mn / 60) / 12 * PI * 2 - PI / 2, ma = (mn / 60) * PI * 2 - PI / 2;
  line(c, [[x, y], [x + Math.cos(ha) * r * 0.42, y + Math.sin(ha) * r * 0.42]], 9); line(c, [[x, y], [x + Math.cos(ma) * r * 0.62, y + Math.sin(ma) * r * 0.62]], 6);
  shape(c, () => ell(c, x, y, r * 0.06, r * 0.06), RED, 0);
};
// a window in a wall: frame from (x, y), size w x h, two panes with the night sky behind. Returns nothing; draw the Moon after.
const windowFrame = (c: Ctx, x: number, y: number, w: number, h: number, sd = 7) => {
  shadow(c, x + w / 2 + 14, y + h + 10, w / 2, 14);
  shape(c, () => rrect(c, x, y, w, h, 10), COL.wood);
  c.fillStyle = NIGHT; c.fillRect(x + 22, y + 22, w - 44, h - 44);
  stars(c, x + 40, y + 40, x + w - 40, y + h - 40, 14, sd);
  line(c, [[x + w / 2, y + 22], [x + w / 2, y + h - 22]], 16, COL.wood); line(c, [[x + 22, y + h * 0.5], [x + w - 22, y + h * 0.5]], 16, COL.wood);
  shape(c, () => rrect(c, x, y, w, h, 10), "rgba(0,0,0,0)", 6);
  shape(c, () => rrect(c, x - 20, y + h - 4, w + 40, 26, 6), COL.woodDk, 5);
};
const bindi = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), RED, 4); shape(c, () => ell(c, x - r * 0.3, y - r * 0.3, r * 0.25, r * 0.18, -0.6), "rgba(255,255,255,0.7)", 0); };
// the eye points of the kit's child (standing or sitting) at feet (x, y), height h: [left eye, right eye] in viewer terms
const childEyes = (x: number, y: number, h: number, sit = false): [number, number][] => {
  const head = h * 0.15, hip = sit ? y - h * 0.07 : y - h * 0.4, sh = hip - h * 0.27, hy = sh - head * 1.12;
  return [[x - head * 0.38, hy + head * 0.16], [x + head * 0.38, hy + head * 0.16]];
};
// close one eye of a child drawn with person(): a lid line over it
const closeEye = (c: Ctx, ex: number, ey: number, head: number) => { shape(c, () => ell(c, ex, ey, head * 0.19, head * 0.24), SKIN.child, 0); c.beginPath(); c.arc(ex, ey - head * 0.06, head * 0.14, 0.3, PI - 0.3); c.strokeStyle = INK; c.lineWidth = 4; c.lineCap = "round"; c.stroke(); };
const binoculars = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + 10 * s, y + 60 * s, 90 * s, 14 * s);
  for (const side of [-1, 1]) { const bx = x + side * 48 * s; shape(c, () => rrect(c, bx - 30 * s, y - 70 * s, 60 * s, 110 * s, 14 * s), COL.black); shape(c, () => ell(c, bx, y + 40 * s, 34 * s, 16 * s), COL.black, 5); shape(c, () => ell(c, bx, y + 40 * s, 24 * s, 10 * s), COL.sky, 3); }
  shape(c, () => rrect(c, x - 22 * s, y - 40 * s, 44 * s, 50 * s, 8 * s), COL.greyDk, 5);
  shape(c, () => ell(c, x, y - 20 * s, 12 * s, 12 * s), COL.steel, 3);
};

// ---------------------------------------------------------------- set-up cards: e1 the dough Moon
// 1. the dough Moon on its plate, with the katori, marble and bottle cap that pressed the craters
const e1s0 = (c: Ctx) => {
  ground(c);
  doughMoon(c, 540, 640, 240, 180, "none");
  bowl(c, 180, 860, 80);
  marble(c, 560, 880, 26);
  bottleCap(c, 860, 860, 44);
};
// 2. light 1, full Moon: the child sits 50 cm away in a dark room, the torch beside her head, shining at the dough
const e1s1 = (c: Ctx) => {
  ground(c, ROOM); c.fillStyle = FLOOR; c.fillRect(0, 800, D, D - 800); line(c, [[0, 800], [D, 800]], 4, INK);
  const x = 290, y = 800, h = 520, head = h * 0.15, hip = y - h * 0.07, sh = hip - h * 0.27, hy = sh - head * 1.12;
  const dough: [number, number] = [790, 700];
  const target: [number, number] = [x + head * 1.45, hy];
  const an = Math.atan2(dough[1] - target[1], dough[0] - target[0]);
  const hands = person(c, x, y, h, { sit: true, dir: 1, reachR: target, reachL: [x - h * 0.2, y - h * 0.1] });
  const lens = torch(c, hands.handR[0], hands.handR[1], an, 170);
  grip(c, hands.handR[0], hands.handR[1], an);
  beam(c, lens[0], lens[1], 790, 720, 40, 190);
  doughMoon(c, 790, 790, 180, 130, "top");
  // the 50 cm string from the torch to the dough
  line(c, [[lens[0], lens[1] + 50], [690, 700]], 3, WHITE); for (const [px, py] of [[lens[0], lens[1] + 50], [690, 700]]) shape(c, () => ell(c, px, py, 6, 6), WHITE, 0);
  write(c, "50 cm", 520, 440, 44, WHITE, 6);
};
// 3. light 2, half Moon: the torch rests low on books at the side, its light skims across the dough, long shadows
const e1s2 = (c: Ctx) => {
  ground(c, ROOM); c.fillStyle = FLOOR; c.fillRect(0, 800, D, D - 800); line(c, [[0, 800], [D, 800]], 4, INK);
  const top = books(c, 170, 800, 210, 3);
  const lens = torch(c, 170, top - 26, 0, 200);
  beam(c, lens[0], lens[1], 900, top - 26, 40, 150);
  doughMoon(c, 660, 790, 240, 180, "left");
};

// ---------------------------------------------------------------- set-up cards: e2 moonrise detective
const TIMES = ["8:20", "9:10", "9:58", "10:50", "11:43", "12:30", "13:22", "14:10", "15:03", "15:50"];
// 1. a phone with ten days of moonrise times, and a notebook with a table ruled in it
const e2s0 = (c: Ctx) => {
  ground(c);
  phone(c, 110, 130, 360, 820);
  // the table on the screen: day, moonrise
  moon(c, 180, 240, 22, 0.75, true, MDARK, MLIT, false); clock(c, 330, 240, 24, 8, 20);
  line(c, [[140, 282], [440, 282]], 3, COL.greyDk);
  TIMES.forEach((t, i) => { const yy = 300 + i * 56; write(c, String(i + 1), 165 - (i >= 9 ? 12 : 0), yy, 34, INK, 5); clockText(c, t, 248 + (t.length === 4 ? 27 : 0), yy, 34, COL.blueDk, 5); });
  notebook(c, 540, 220, 440, 700, false);
  for (let r = 0; r <= 11; r++) line(c, [[580, 300 + r * 52], [940, 300 + r * 52]], 3, INK);
  line(c, [[580, 300], [580, 300 + 11 * 52]], 3, INK); line(c, [[680, 300], [680, 300 + 11 * 52]], 3, INK); line(c, [[940, 300], [940, 300 + 11 * 52]], 3, INK);
  write(c, "1", 618, 362, 32, INK, 5); clockText(c, "8:20", 720, 362, 32, INK, 5);
  write(c, "2", 618, 414, 32, INK, 5); clockText(c, "9:10", 720, 414, 32, INK, 5);
  pencil(c, 700, 990, 300, -0.25);
};
// 2. the notebook with a subtraction beside each row, and a calculator
const e2s1 = (c: Ctx) => {
  ground(c);
  notebook(c, 60, 110, 740, 860, false);
  const gaps = ["50", "48", "52", "53", "47", "52", "48", "53", "47"];
  for (let i = 0; i < 9; i++) {
    const yy = 190 + i * 82, h = 30;
    const w1 = clockText(c, TIMES[i + 1], 110, yy, h, INK, 5);
    write(c, "-", 110 + w1 + 8, yy, h, INK, 5);
    const w2 = clockText(c, TIMES[i], 110 + w1 + 40, yy, h, INK, 5);
    equals(c, 110 + w1 + 40 + w2 + 14, yy, h);
    write(c, gaps[i], 110 + w1 + 40 + w2 + 44, yy, h, RED, 6);
    line(c, [[100, yy + 56], [760, yy + 56]], 2, "rgba(91,143,214,0.45)");
  }
  calculator(c, 760, 600, 270, 400);
};
// 3. a graph of the ten moonrise times, dots rising gently, a ruler laid along them
const e2s2 = (c: Ctx) => {
  ground(c);
  squared(c, 90, 90, 900, 900, 45);
  const ox = 220, oy = 880;
  line(c, [[ox, oy], [ox, 150]], 5); line(c, [[ox, oy], [940, oy]], 5);
  const pts: [number, number][] = TIMES.map((t, i) => { const [hh, mm] = t.split(":").map(Number); return [ox + 70 + i * 72, oy - 60 - ((hh + mm / 60 - 8) / 8) * 600]; });
  const an = Math.atan2(pts[9][1] - pts[0][1], pts[9][0] - pts[0][0]);
  // the ruler's top edge runs just below the dots, parallel to them
  ruler(c, pts[0][0] - 40 * Math.cos(an) - Math.sin(an) * 24, pts[0][1] - 40 * Math.sin(an) + Math.cos(an) * 24, 800, an, 64);
  pts.forEach(([x, y], i) => { shape(c, () => ell(c, x, y, 11, 11), COL.blueDk, 4); write(c, String(i + 1), x - (i >= 9 ? 20 : 10), oy + 18, 28, INK, 4); });
  ["8", "12", "16"].forEach((t, k) => { const yy = oy - 60 - ((Number(t) - 8) / 8) * 600; line(c, [[ox - 12, yy], [ox, yy]], 4); clockText(c, t + ":00", ox - 150 + (t.length === 1 ? 24 : 0), yy - 14, 28, INK, 4); });
};

// ---------------------------------------------------------------- set-up cards: e3 the bindi Moon
// 1. a bindi on the window glass with the Moon beyond it, the child standing back with one eye closed
const e3s0 = (c: Ctx) => {
  ground(c); c.fillStyle = "#e4d6bd"; c.fillRect(0, 900, D, D - 900); line(c, [[0, 900], [D, 900]], 4, INK);
  const x = 250, y = 900, h = 620, head = h * 0.15, eyes = childEyes(x, y, h);
  windowFrame(c, 600, 120, 420, 600);
  moon(c, 835, eyes[1][1] - 20, 78, 0.9, true, MDARK_N);
  bindi(c, 800, eyes[1][1], 20);
  person(c, x, y, h, { dir: 1, armR: [PI * 0.45, PI * 0.5] });
  closeEye(c, eyes[0][0], eyes[0][1], head);
};
// 2. the helper holds a string from the bindi to the child's open eye; a ruler lies along the string
const e3s1 = (c: Ctx) => {
  ground(c); c.fillStyle = "#e4d6bd"; c.fillRect(0, 900, D, D - 900); line(c, [[0, 900], [D, 900]], 4, INK);
  const x = 200, y = 900, h = 600, head = h * 0.15, eyes = childEyes(x, y, h), eye = eyes[1];
  windowFrame(c, 700, 120, 340, 600);
  const bx = 870, by = eye[1];
  moon(c, bx, by, 24, 0.9, true, MDARK_N); bindi(c, bx, by, 22);
  // the helper stands by the window: one hand holds the string at the bindi, the other holds the ruler up against it
  const ax = 650, hands = person(c, ax, y, 760, { adult: true, dir: -1, reachR: [bx - 60, by], reachL: [ax - 70, by + 80] });
  person(c, x, y, h, { dir: 1 });
  closeEye(c, eyes[0][0], eyes[0][1], head);
  line(c, [[eye[0], eye[1]], [bx, by]], 4, WHITE); line(c, [[eye[0], eye[1]], [bx, by]], 2, INK);
  ruler(c, eye[0] + 20, by + 26, bx - eye[0] - 40, 0, 54);
  grip(c, hands.handR[0], hands.handR[1], 0, SKIN.adult); grip(c, hands.handL[0], hands.handL[1], -0.3, SKIN.adult);
  write(c, "77 cm", 330, by + 100, 44, RED, 6);
};

// ---------------------------------------------------------------- flow cards
// e1: the torch straight above gives short shadows (lunar noon, a full Moon); the torch low at the side gives long ones
const fe1 = (c: Ctx) => {
  ground(c, ROOM); c.fillStyle = FLOOR; c.fillRect(0, 820, D, D - 820); line(c, [[0, 820], [D, 820]], 4, INK);
  line(c, [[540, 60], [540, 1020]], 5, "rgba(255,255,255,0.35)");
  // left: torch above
  const lens1 = torch(c, 270, 230, PI / 2, 170);
  beam(c, lens1[0], lens1[1] + 4, 270, 700, 42, 230);
  doughMoon(c, 275, 790, 170, 125, "top");
  // right: torch low on books at the side
  const top = books(c, 625, 820, 140, 3);
  const lens2 = torch(c, 625, top - 26, 0, 150);
  beam(c, lens2[0], lens2[1], 1070, top - 26, 40, 110);
  doughMoon(c, 880, 800, 160, 120, "left");
};
// e2: three evenings, the Moon just up over the rooftops, the clock about 50 minutes later each time
const fe2 = (c: Ctx) => {
  ground(c);
  const times: [number, number][] = [[19, 0], [19, 50], [20, 40]];
  for (let i = 0; i < 3; i++) {
    const x0 = 40 + i * 340, x1 = x0 + 320;
    nightSky(c, x0, 300, x1, 1040, 11 + i);
    rooftops(c, x0, x1, 900);
    moon(c, x0 + 230, 790, 56, 0.62 + i * 0.07, true, MDARK_N);
    shape(c, () => rrect(c, x0, 300, 320, 740, 0), "rgba(0,0,0,0)", 5);
    clock(c, x0 + 160, 170, 95, times[i][0], times[i][1]);
    if (i < 2) arrow(c, [[x1 - 60, 560], [x1 + 40, 560]]);
  }
};
// e3: the bindi just covers the Moon: the eye, the bindi on the glass and the Moon in one line, 77 cm to the bindi
const fe3 = (c: Ctx) => {
  ground(c, NIGHT); stars(c, 560, 40, 1050, 1040, 40, 21);
  c.fillStyle = "#3a3360"; c.fillRect(0, 0, 540, D); line(c, [[540, 0], [540, D]], 5, INK);
  // the open eye at the left
  const ex = 110, ey = 520;
  shape(c, () => { c.moveTo(ex - 80, ey); c.quadraticCurveTo(ex, ey - 70, ex + 80, ey); c.quadraticCurveTo(ex, ey + 70, ex - 80, ey); c.closePath(); }, WHITE, 6);
  shape(c, () => ell(c, ex + 12, ey, 30, 30), "#6b4a2e", 4); shape(c, () => ell(c, ex + 12, ey, 13, 13), INK, 0);
  // the glass pane with the bindi, half way
  shape(c, () => rrect(c, 505, 160, 70, 720, 8), COL.glass, 5);
  const bx = 540, by = ey, br = 40;
  // the Moon beyond, exactly as wide as the bindi looks: its edge just shows round the bindi's lines of sight
  const mx = 900, mr = 110;
  line(c, [[ex + 80, ey - 8], [bx, by - br], [mx, by - mr]], 4, COL.yellow); line(c, [[ex + 80, ey + 8], [bx, by + br], [mx, by + mr]], 4, COL.yellow);
  moon(c, mx, by, mr, 1, true, MDARK_N);
  bindi(c, bx, by, br);
  arrow(c, [[ex + 20, ey + 240], [bx - 10, ey + 240]]); arrow(c, [[bx - 10, ey + 240], [ex + 20, ey + 240]]);
  write(c, "77 cm", 230, ey + 262, 44, WHITE, 6);
  arrow(c, [[bx + 70, by - br], [bx + 70, by + br]], COL.yellow, 6); arrow(c, [[bx + 70, by + br], [bx + 70, by - br]], COL.yellow, 6);
  write(c, "7 mm", bx + 40, by - 140, 36, COL.yellow, 5);
};
// a1: a stack of coins on white paper, lit from straight above (a tiny shadow) and from low at the side (a long one)
const coinStack = (c: Ctx, x: number, y: number, n = 5) => {
  for (let i = 0; i < n; i++) { const cy = y - i * 15; shape(c, () => { c.moveTo(x - 62, cy - 15); c.lineTo(x - 62, cy); c.bezierCurveTo(x - 62, cy + 28, x + 62, cy + 28, x + 62, cy); c.lineTo(x + 62, cy - 15); c.closePath(); }, COL.woodDk, 4); }
  const ty = y - (n - 1) * 15 - 15;
  shape(c, () => ell(c, x, ty, 62, 21), COL.yellow, 4); shape(c, () => ell(c, x, ty, 40, 13), COL.woodDk, 3);
};
const fa1 = (c: Ctx) => {
  ground(c, ROOM); c.fillStyle = FLOOR; c.fillRect(0, 820, D, D - 820); line(c, [[0, 820], [D, 820]], 4, INK);
  line(c, [[540, 60], [540, 1020]], 5, "rgba(255,255,255,0.35)");
  paper(c, 70, 640, 400, 240, WHITE); paper(c, 610, 640, 400, 240, WHITE);
  // left: from above
  const lens1 = torch(c, 270, 240, PI / 2, 170);
  beam(c, lens1[0], lens1[1] + 4, 270, 720, 42, 140);
  shape(c, () => ell(c, 282, 760, 72, 28), "rgba(36,29,46,0.6)", 0);
  coinStack(c, 270, 745);
  // right: low from the left; the long shadow goes to the right, the ruler lies along it
  const top = books(c, 640, 820, 130, 1);
  const lens2 = torch(c, 640, top - 26, 0, 140);
  beam(c, lens2[0], lens2[1], 1060, top - 40, 40, 90);
  shape(c, () => { c.moveTo(830, 745); c.lineTo(830, 770); c.lineTo(1000, 790); c.bezierCurveTo(1040, 775, 1040, 745, 1000, 735); c.closePath(); }, DARK, 0);
  coinStack(c, 830, 745);
  ruler(c, 840, 800, 190, 0, 40);
};
// a2: the table seen from above: the lamp is the Sun, the orange the Earth on its paper circle, the lime the Moon
const fa2 = (c: Ctx) => {
  ground(c, "#d9c6a4");
  // lamp from above: its round shade and the glow across the table
  c.beginPath(); c.moveTo(150, 540); c.lineTo(1080, 120); c.lineTo(1080, 960); c.closePath(); c.fillStyle = "rgba(255,228,130,0.22)"; c.fill();
  paper(c, 330, 110, 690, 860, COL.paper);
  const cx = 675, cy = 540, R = 310;
  c.beginPath(); c.arc(cx, cy, R, 0, PI * 2); c.strokeStyle = INK; c.lineWidth = 5; c.setLineDash([18, 14]); c.stroke(); c.setLineDash([]);
  shape(c, () => ell(c, 130, 540, 95, 95), COL.red); shape(c, () => ell(c, 130, 540, 50, 50), COL.yellow, 5);
  // pencil A pointing from the orange across the lime towards the lamp
  pencil(c, 372, 612, 220, PI - 0.12);
  // the orange (Earth) on the circle nearest the lamp, the lime (Moon) between it and the lamp: a new Moon
  const ox = cx - R, oy = cy;
  shape(c, () => ell(c, ox, oy, 52, 52), COL.orange, 0); shade(c, () => ell(c, ox, oy, 52, 52), "#d27c25", 18, 12, 0.5); shape(c, () => ell(c, ox, oy, 52, 52), "rgba(0,0,0,0)", 6); shape(c, () => ell(c, ox - 4, oy - 48, 7, 7), COL.greenDk, 3);
  shape(c, () => ell(c, 268, oy, 26, 26), COL.greenLt, 0); shade(c, () => ell(c, 268, oy, 26, 26), COL.green, 10, 6, 0.5); shape(c, () => ell(c, 268, oy, 26, 26), "rgba(0,0,0,0)", 5);
  // the Earth moves a little along its circle
  arrow(c, [[ox + 40, oy - 110], [ox + 62, oy - 170], [ox + 100, oy - 225]]);
};
// a3: fifteen days of high tides as bars, tall at new Moon and full Moon, short at the half Moon
const fa3 = (c: Ctx) => {
  ground(c);
  squared(c, 60, 80, 960, 920, 40);
  const ox = 120, oy = 820;
  line(c, [[ox, oy], [ox, 150]], 5); line(c, [[ox, oy], [980, oy]], 5);
  for (let d = 0; d < 15; d++) {
    const k = Math.abs(Math.cos((PI * d) / 14.5)), hgt = 140 + 460 * k * k, x = ox + 30 + d * 56;
    shape(c, () => rrect(c, x, oy - hgt, 40, hgt, 6), k > 0.6 ? COL.teal : COL.blue, 4);
  }
  for (const [d, f] of [[0, 0], [3, 0.2], [7, 0.5], [11, 0.8], [14, 1]]) moon(c, ox + 50 + d * 56, oy + 70, 26, f, true, MDARK_N, MLIT, false);
};
// p1: the notebook with five evenings of the growing Moon, the terminator marked on each, binoculars at hand
const fp1 = (c: Ctx) => {
  ground(c);
  notebook(c, 50, 250, 980, 560, false);
  for (let i = 0; i < 5; i++) {
    const x = 160 + i * 190, f = 0.1 + i * 0.1;
    moon(c, x, 470, 76, f, true, MDARK, MLIT, false);
    terminator(c, x, 470, 76, f);
    write(c, String(3 + i), x - 12, 600, 40, INK, 5);
  }
  line(c, [[110, 690], [970, 690]], 2, "rgba(91,143,214,0.45)"); line(c, [[110, 740], [970, 740]], 2, "rgba(91,143,214,0.45)");
  binoculars(c, 820, 900, 1);
};

// ---------------------------------------------------------------- explanation and terms
// expl 1: the full Moon looks flat and bright; the half Moon shows craters with black shadows along the terminator
const craterLit = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), "#e6d49a", 4);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); c.beginPath(); ell(c, x - r * 0.45, y, r, r); c.rect(-5000, -5000, 10000, 10000); c.fillStyle = DARK; c.fill("evenodd"); c.restore();
};
const ex1 = (c: Ctx) => {
  ground(c, NIGHT); stars(c, 30, 30, 1050, 1050, 40, 9);
  moon(c, 290, 540, 205, 1, true, MDARK_N);
  moon(c, 790, 540, 205, 0.5, true, MDARK_N, MLIT, false);
  for (const [dx, dy, k] of [[0.18, -0.55, 0.11], [0.12, -0.2, 0.08], [0.22, 0.12, 0.13], [0.1, 0.5, 0.09], [0.4, -0.35, 0.06], [0.45, 0.35, 0.07]]) craterLit(c, 790 + dx * 205, 540 + dy * 205, k * 205);
  for (const [dx, dy] of [[-0.08, -0.4], [-0.1, 0.05], [-0.07, 0.38]]) shape(c, () => ell(c, 790 + dx * 205, 540 + dy * 205, 5, 5), MLIT, 0);
};
// term 17: a four-legged lander standing on grey Moon ground
const t17 = (c: Ctx) => {
  ground(c, "#0e1025"); stars(c, 30, 30, 1050, 560, 36, 13);
  shape(c, () => { c.moveTo(0, 700); c.quadraticCurveTo(540, 640, 1080, 700); c.lineTo(1080, 1080); c.lineTo(0, 1080); c.closePath(); }, COL.grey, 0);
  line(c, [[0, 700], [540, 670], [1080, 700]], 5, INK);
  for (const [x, y, rx] of [[150, 860, 70], [900, 960, 90], [560, 1010, 60]]) { shape(c, () => ell(c, x, y, rx, rx * 0.35), COL.greyDk, 4); shape(c, () => ell(c, x - rx * 0.1, y - rx * 0.06, rx * 0.7, rx * 0.2), COL.grey, 0); }
  const x = 540, y = 800;
  shadow(c, x + 120, y + 10, 220, 36);
  // the two back legs, then the two front legs, each with a round foot pad on the ground
  for (const side of [-1, 1]) { line(c, [[x + side * 90, y - 190], [x + side * 150, y - 40]], 16, INK); line(c, [[x + side * 90, y - 190], [x + side * 150, y - 40]], 8, COL.steelDk); shape(c, () => ell(c, x + side * 150, y - 40, 34, 11), COL.steelDk, 4); }
  for (const side of [-1, 1]) { line(c, [[x + side * 110, y - 200], [x + side * 215, y - 4]], 20, INK); line(c, [[x + side * 110, y - 200], [x + side * 215, y - 4]], 10, COL.steel); line(c, [[x + side * 130, y - 120], [x + side * 170, y - 170]], 12, INK); line(c, [[x + side * 130, y - 120], [x + side * 170, y - 170]], 5, COL.steel); shape(c, () => ell(c, x + side * 215, y - 4, 44, 14), COL.steel, 5); }
  const body = () => rrect(c, x - 130, y - 350, 260, 170, 14);
  shape(c, body, COL.yellow); shade(c, body, COL.woodDk, 30, 20, 0.45);
  shape(c, () => rrect(c, x - 100, y - 320, 90, 110, 8), COL.black, 4); shape(c, () => rrect(c, x + 20, y - 320, 80, 50, 8), COL.steel, 4);
  shape(c, () => rrect(c, x - 230, y - 330, 100, 130, 8), COL.blueDk, 5); for (let k = 1; k < 4; k++) line(c, [[x - 230, y - 330 + k * 32], [x - 130, y - 330 + k * 32]], 2, COL.sky);
  line(c, [[x + 60, y - 350], [x + 60, y - 430]], 8, INK); shape(c, () => ell(c, x + 60, y - 440, 44, 16), COL.steel, 5);
  line(c, [[x - 40, y - 350], [x - 40, y - 400]], 6, INK); shape(c, () => ell(c, x - 40, y - 404, 8, 8), RED, 0);
};
// term 5: slanting light: a tall tree and its very long evening shadow, the Sun low at the left
const t5 = (c: Ctx) => {
  c.fillStyle = "#f7b267"; c.fillRect(0, 0, D, 380); c.fillStyle = "#fbd38d"; c.fillRect(0, 380, D, 240); c.fillStyle = "#ffe8b0"; c.fillRect(0, 560, D, 90);
  shape(c, () => { c.moveTo(0, 650); c.lineTo(1080, 650); c.lineTo(1080, 1080); c.lineTo(0, 1080); c.closePath(); }, COL.green, 0);
  line(c, [[0, 650], [1080, 650]], 5, INK);
  sun(c, 110, 585, 60);
  // the shadow: from the foot of the trunk, long and low, away from the Sun
  const tx = 330, ty = 760;
  shape(c, () => { c.moveTo(tx - 28, ty); c.lineTo(tx + 32, ty); c.lineTo(tx + 560, ty + 22); c.lineTo(tx + 560, ty - 8); c.closePath(); }, COL.greenDk, 0);
  shape(c, () => ell(c, tx + 600, ty + 8, 130, 52), COL.greenDk, 0);
  shape(c, () => rrect(c, tx - 26, ty - 420, 52, 420, 10), COL.brown, 5);
  shape(c, () => ell(c, tx, ty - 500, 150, 130), COL.leaf, 5); shape(c, () => ell(c, tx + 90, ty - 420, 90, 80), COL.leafDk, 5); shape(c, () => ell(c, tx - 95, ty - 430, 85, 75), COL.leafDk, 5);
  shade(c, () => ell(c, tx, ty - 500, 150, 130), COL.leafDk, 40, 10, 0.4);
};

export const ic_skyMoonPhasesL4 = cards("sci.sky.moon-phases.L4", [e1s0, e1s1, e1s2, e2s0, e2s1, e2s2, e3s0, e3s1, fe1, fe2, fe3, fa1, fa2, fa3, fp1, ex1, t17, t5]);
