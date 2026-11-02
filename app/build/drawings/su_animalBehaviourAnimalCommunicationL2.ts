import type { Ctx } from "./core";
import { INK, BG, COL, SKIN, CLOTH, WHITE, RED, ground, shape, shade, ell, rrect, polyP, shadow, line, arrow, bowl, hand, person, cards } from "./flatKit";

const PAPER = COL.paper, FACE = { angry: "#f2907a", happy: "#ffd34d", scared: "#c9b8ee" };
const CAT = "#9a9aa6", CATDK = "#74748a";

// a message face: angry, happy or scared
const face = (c: Ctx, x: number, y: number, r: number, kind: "angry" | "happy" | "scared") => {
  shape(c, () => ell(c, x, y, r, r), FACE[kind], 5);
  const e = r * 0.34, ey = y - r * 0.12;
  if (kind === "scared") {
    for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * e, ey, r * 0.2, r * 0.24), WHITE, 4); shape(c, () => ell(c, x + s * e, ey, r * 0.08, r * 0.1), INK, 0); }
    shape(c, () => ell(c, x, y + r * 0.45, r * 0.16, r * 0.22), INK, 0);
    line(c, [[x - e - r * 0.2, ey - r * 0.4], [x - e + r * 0.15, ey - r * 0.32]], 4); line(c, [[x + e + r * 0.2, ey - r * 0.4], [x + e - r * 0.15, ey - r * 0.32]], 4);
  } else {
    for (const s of [-1, 1]) shape(c, () => ell(c, x + s * e, ey, r * 0.09, r * 0.13), INK, 0);
    if (kind === "angry") {
      line(c, [[x - e - r * 0.25, ey - r * 0.42], [x - e + r * 0.2, ey - r * 0.2]], 6); line(c, [[x + e + r * 0.25, ey - r * 0.42], [x + e - r * 0.2, ey - r * 0.2]], 6);
      c.beginPath(); c.arc(x, y + r * 0.7, r * 0.32, Math.PI * 1.15, Math.PI * 1.85); c.strokeStyle = INK; c.lineWidth = 6; c.lineCap = "round"; c.stroke();
    } else { c.beginPath(); c.arc(x, y + r * 0.1, r * 0.5, 0.25, Math.PI - 0.25); c.strokeStyle = INK; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); }
  }
};
// a waving open hand
const wave = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const sk = SKIN.adult;
  [[-46, -20, -0.25, 70], [-16, -42, -0.08, 84], [16, -42, 0.08, 84], [46, -22, 0.28, 70]].forEach(([fx, fy, rot, len]) => {
    c.save(); c.translate(fx, fy); c.rotate(rot); shape(c, () => rrect(c, -13, -len, 26, len + 10, 13), sk, 5); c.restore();
  });
  shape(c, () => { c.moveTo(-50, -10); c.lineTo(-60, 20); c.quadraticCurveTo(-60, 62, 0, 66); c.quadraticCurveTo(54, 62, 54, 20); c.lineTo(52, -10); c.closePath(); }, sk, 5);
  c.save(); c.translate(-58, 14); c.rotate(-0.9); shape(c, () => rrect(c, -13, -62, 26, 70, 13), sk, 5); c.restore();
  c.restore();
};
const slip = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 8), PAPER, 5); c.restore();
};

// 0. twelve slips: four messages, three of each
const s1 = (c: Ctx) => {
  ground(c);
  const w = 200, h = 270, gx = 60, x0 = 60, y0 = 130, rot = [[-0.03, 0.02, -0.01], [0.02, -0.03, 0.03], [-0.02, 0.03, -0.03], [0.03, -0.01, 0.02]];
  for (let col = 0; col < 4; col++) for (let row = 0; row < 3; row++) {
    const x = x0 + w / 2 + col * (w + gx), y = y0 + h / 2 + row * (h - 8) - 0;
    c.save(); c.translate(x + 4, y + 8); c.rotate(rot[col][row]); c.fillStyle = "rgba(43,35,64,0.14)"; c.beginPath(); rrect(c, -w / 2, -h / 2, w, h, 8); c.fill(); c.restore();
  }
  for (let col = 0; col < 4; col++) for (let row = 0; row < 3; row++) {
    const x = x0 + w / 2 + col * (w + gx), y = y0 + h / 2 + row * (h - 8);
    slip(c, x, y, w, h * 0.9, rot[col][row]);
    c.save(); c.translate(x, y); c.rotate(rot[col][row]);
    if (col === 0) face(c, 0, 0, 72, "angry"); else if (col === 1) face(c, 0, 0, 72, "happy"); else if (col === 2) face(c, 0, 0, 72, "scared"); else wave(c, 0, 14, 0.95);
    c.restore();
  }
};

// 1. folded slips in a steel dabba, a child's hand picking one out
const s2 = (c: Ctx) => {
  ground(c);
  const bx = 470, by = 690, r = 340;
  bowl(c, bx, by, r);
  const rr = [[-220, -20, 0.5], [-110, -50, -0.3], [0, -30, 0.2], [110, -55, -0.6], [215, -15, -0.2], [-160, 18, -0.9], [60, 20, 0.9], [-30, 12, -0.4]];
  rr.forEach(([dx, dy, rot], i) => {
    c.save(); c.translate(bx + dx, by + dy - 30); c.rotate(rot);
    shape(c, () => rrect(c, -50, -34, 100, 68, 8), i % 2 ? PAPER : "#f6ecd2", 5); line(c, [[0, -34], [0, 34]], 3, COL.grey); c.restore();
  });
  c.beginPath(); c.ellipse(bx, by, r, r * 0.2, 0, 0.12, Math.PI - 0.12); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  // the hand lifts one slip up
  const an = 1.75, wx = 640, wy = 150, s = 2;
  const tx = wx + Math.cos(an) * 92 * s, ty = wy + Math.sin(an) * 92 * s;
  c.save(); c.translate(tx, ty + 10); c.rotate(0.3); shape(c, () => rrect(c, -62, -42, 124, 84, 8), PAPER, 5); line(c, [[0, -42], [0, 42]], 3, COL.grey); c.restore();
  hand(c, wx, wy, an, s);
  arrow(c, [[900, 560], [900, 250]]);
};

// 2. hidden girl behind a half-open door, mother with her back turned
const backHead = (c: Ctx, x: number, y: number, h: number) => {
  const head = h * 0.13, hy = y - head * 1.05;
  shape(c, () => ell(c, x, hy, head * 1.05, head * 1.08), CLOTH.hair, 5);
  shape(c, () => ell(c, x, hy - head * 1.1, head * 0.42, head * 0.38), CLOTH.hair, 5);
};
const s3 = (c: Ctx) => {
  ground(c, "#e8d9bf"); c.fillStyle = "#d6c3a2"; c.fillRect(0, 880, 1080, 200);
  // doorway
  shape(c, () => rrect(c, 70, 90, 470, 800, 6), "#cdb994", 7);
  shape(c, () => rrect(c, 110, 130, 390, 760, 4), "#f2e6ca", 5);
  // girl in the doorway, slip held in front of her
  const gx = 270, gh = 640, gy = 880;
  person(c, gx, gy, gh, { armL: [2.0, -0.6], armR: [1.14, 3.74] });
  const sh = gy - gh * 0.74;
  c.save(); c.translate(gx, sh + gh * 0.09); c.rotate(0.05); shape(c, () => rrect(c, -50, -45, 100, 90, 6), PAPER, 5); line(c, [[0, -45], [0, 45]], 3, COL.grey); c.restore();
  for (const sx of [-1, 1]) shape(c, () => ell(c, gx + sx * gh * 0.065, sh + gh * 0.075, 17, 17), SKIN.child, 5);
  // sound leaving her mouth
  const mx = gx + 80, my = sh - gh * 0.13 * 1.05 + gh * 0.13 * 0.38;
  for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(mx - 20, my, 38 + i * 26, -0.7, 0.7); c.strokeStyle = COL.blueDk; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); }
  // the door leaf, half open towards us: hinge on the right
  shape(c, () => polyP(c, [[500, 130], [350, 190], [350, 830], [500, 890]]), COL.wood, 6);
  shade(c, () => polyP(c, [[500, 130], [350, 190], [350, 830], [500, 890]]), COL.woodDk, 30, 0, 0.5);
  shape(c, () => polyP(c, [[375, 260], [470, 224], [470, 480], [375, 500]]), COL.woodDk, 4);
  shape(c, () => ell(c, 375, 560, 14, 14), COL.yellow, 4);
  // mother on a stool, back to the door
  const mxp = 840, myp = 760, mh = 600;
  shadow(c, mxp + 20, 892, 150, 22);
  line(c, [[mxp - 90, myp + 4], [mxp - 100, 884]], 14); line(c, [[mxp + 90, myp + 4], [mxp + 100, 884]], 14);
  shape(c, () => rrect(c, mxp - 120, myp - 6, 240, 34, 12), COL.brown, 5);
  person(c, mxp, myp - 20, mh, { sit: true, adult: true });
  backHead(c, mxp, myp - 20 - mh * 0.38, mh);
  for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(520, 400, 40 + i * 28, -0.8, 0.8); c.strokeStyle = COL.blueDk; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); }
  arrow(c, [[650, 400], [740, 400]]);
};

// 3. notebook with four columns of ticks and crosses, a hand writing
const tick = (c: Ctx, x: number, y: number) => line(c, [[x - 28, y], [x - 8, y + 24], [x + 32, y - 28]], 12, COL.greenDk);
const cross = (c: Ctx, x: number, y: number) => { line(c, [[x - 24, y - 24], [x + 24, y + 24]], 12, RED); line(c, [[x + 24, y - 24], [x - 24, y + 24]], 12, RED); };
const s4 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 70, 130, 900, 700, 22), PAPER, 7);
  const cw = 200, x0 = 130, y0 = 170, hh = 170, rh = 150;
  for (let i = 1; i < 4; i++) line(c, [[x0 + i * cw, y0], [x0 + i * cw, y0 + hh + rh * 3]], 4, COL.greyDk);
  for (let j = 0; j <= 3; j++) line(c, [[x0, y0 + hh + (j - 1) * rh + (j === 0 ? rh - hh : 0)], [x0 + 4 * cw, y0 + hh + (j - 1) * rh + (j === 0 ? rh - hh : 0)]], 4, COL.greyDk);
  line(c, [[x0, y0], [x0 + 4 * cw, y0]], 4, COL.greyDk);
  const kinds: ("angry" | "happy" | "scared" | "wave")[] = ["angry", "happy", "scared", "wave"];
  kinds.forEach((k, i) => { const cx = x0 + cw / 2 + i * cw, cy = y0 + hh / 2; if (k === "wave") wave(c, cx, cy + 14, 0.5); else face(c, cx, cy, 52, k); });
  const marks = [[1, 1, 0, 1], [0, 1, 1, 1], [1, 0, 1, 0]];
  marks.forEach((row, j) => row.forEach((m, i) => { const cx = x0 + cw / 2 + i * cw, cy = y0 + hh + rh / 2 + j * rh; if (m) tick(c, cx, cy); else cross(c, cx, cy); }));
  // pencil and the writing hand come in from the lower right, writing in the last cell
  const tipX = x0 + cw / 2 + 3 * cw - 40, tipY = y0 + hh + rh * 2.5 + 30, an = -2.0, s = 1.2;
  const dx = Math.cos(an), dy = Math.sin(an), L = 220 * s;
  const wx = tipX - dx * L, wy = tipY - dy * L;
  line(c, [[wx + dx * 60 * s, wy + dy * 60 * s], [tipX - dx * 30, tipY - dy * 30]], 28, INK); line(c, [[wx + dx * 60 * s, wy + dy * 60 * s], [tipX - dx * 30, tipY - dy * 30]], 17, COL.yellow);
  shape(c, () => polyP(c, [[tipX - dx * 30 - dy * 11, tipY - dy * 30 + dx * 11], [tipX, tipY], [tipX - dx * 30 + dy * 11, tipY - dy * 30 - dx * 11]]), "#f3d9b0", 4);
  hand(c, wx, wy, an, s, SKIN.adult, CLOTH.adult);
};

// the cat
const cat = (c: Ctx, x: number, y: number, look: "away" | "toward") => {
  shadow(c, x + 40, y + 6, 230, 30);
  c.save(); c.translate(x, y);
  line(c, [[110, -30], [215, -40], [235, -120], [200, -180]], 44, INK); line(c, [[110, -30], [215, -40], [235, -120], [200, -180]], 32, CAT);
  shape(c, () => ell(c, 30, -125, 135, 125, 0.1), CAT, 6);
  shade(c, () => ell(c, 30, -125, 135, 125, 0.1), CATDK, 30, 14);
  shape(c, () => ell(c, 40, -45, 120, 50), CAT, 6);
  shape(c, () => rrect(c, -95, -120, 50, 120, 22), CAT, 6);
  shape(c, () => ell(c, -70, 0, 50, 18), "#c8c8d2", 5);
  if (look === "away") {
    shape(c, () => polyP(c, [[-140, -335], [-130, -405], [-90, -345]]), CAT, 6); shape(c, () => polyP(c, [[-50, -345], [-10, -405], [10, -330]]), CAT, 6);
    shape(c, () => ell(c, -80, -275, 88, 76), CAT, 6);
    shape(c, () => ell(c, -118, -285, 11, 15), INK, 0); shape(c, () => ell(c, -50, -285, 11, 15), INK, 0);
    shape(c, () => ell(c, -150, -262, 12, 9), COL.pink, 3); line(c, [[-158, -245], [-170, -230]], 4);
  } else {
    const t = 0.45;
    shape(c, () => polyP(c, [[-110, -330], [-80, -415], [-40, -345]]), CAT, 6); shape(c, () => polyP(c, [[-10, -345], [40, -425], [70, -330]]), CAT, 6);
    shape(c, () => polyP(c, [[-84, -352], [-76, -392], [-58, -355]]), COL.pink, 0); shape(c, () => polyP(c, [[14, -358], [38, -396], [48, -350]]), COL.pink, 0);
    void t;
    shape(c, () => ell(c, -20, -270, 92, 78), CAT, 6);
    for (const ex of [-45, 40]) { shape(c, () => ell(c, ex, -280, 22, 26), WHITE, 4); shape(c, () => ell(c, ex + 9, -278, 11, 16), INK, 0); }
    shape(c, () => ell(c, 28, -245, 12, 9), COL.pink, 3);
    c.beginPath(); c.arc(28, -232, 14, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  }
  c.restore();
};
const sofa = (c: Ctx) => {
  // call after the girl: the back of the sofa hides her body
  shape(c, () => rrect(c, 40, 430, 1000, 330, 70), COL.teal, 7);
  shade(c, () => rrect(c, 40, 430, 1000, 330, 70), COL.tealDk, 14, 14, 0.45);
};
const sofaSeat = (c: Ctx) => {
  shape(c, () => rrect(c, 30, 700, 1020, 200, 40), COL.teal, 7);
  shape(c, () => rrect(c, 90, 690, 900, 90, 40), "#58c4bb", 6);
  shape(c, () => rrect(c, 20, 600, 120, 300, 50), COL.tealDk, 7); shape(c, () => rrect(c, 940, 600, 120, 300, 50), COL.tealDk, 7);
};
const girlBehind = (c: Ctx, x: number, notebook: boolean) => {
  person(c, x, 859, 620, { armL: [2.0, -0.6], armR: [1.14, 3.74] });
  sofa(c);
  if (notebook) {
    c.save(); c.translate(x, 540); c.rotate(-0.05);
    shape(c, () => rrect(c, -90, -80, 180, 160, 10), COL.yellow, 5);
    for (let i = 0; i < 3; i++) line(c, [[-60, -35 + i * 34], [60, -35 + i * 34]], 4, COL.orangeDk ?? COL.orange);
    c.restore();
    for (const sx of [-1, 1]) shape(c, () => ell(c, x + sx * 92, 560, 20, 20), SKIN.child, 5);
  }
};
// 4. cat resting on the sofa looking away, girl behind the sofa
const s5 = (c: Ctx) => {
  ground(c, "#f2e6ca");
  girlBehind(c, 800, true);
  sofaSeat(c);
  cat(c, 340, 740, "away");
};
// 5. cat turns ears and head to the girl, who has said something
const s6 = (c: Ctx) => {
  ground(c, "#f2e6ca");
  girlBehind(c, 800, false);
  // sound from the girl
  const bx = 600, by = 170;
  shape(c, () => { ell(c, bx, by, 150, 80); }, WHITE, 6);
  shape(c, () => polyP(c, [[700, 235], [770, 300], [740, 215]]), WHITE, 6);
  shape(c, () => ell(c, bx, by, 144, 74), WHITE, 0);
  for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(bx - 70, by - 22 + i * 22); c.bezierCurveTo(bx - 40, by - 44 + i * 22, bx - 10, by + i * 22, bx + 20, by - 22 + i * 22); c.bezierCurveTo(bx + 40, by - 40 + i * 22, bx + 50, by - 10 + i * 22, bx + 70, by - 22 + i * 22); c.strokeStyle = COL.blueDk; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); }
  sofaSeat(c);
  cat(c, 340, 740, "toward");
  arrow(c, [[470, 400], [590, 400]]);
};

export const su_animalBehaviourAnimalCommunicationL2 = cards("sci.animal-behaviour.animal-communication.L2 set-up", [s1, s2, s3, s4, s5, s6]);
void BG; void CLOTH;
