/* I am, the DeepKids teacher: the founder's drawing brought to life. His mane sways, his face breathes, his eyes blink
   and his mouth moves while he answers, in front of his world, a slowly turning dodecahedron. Tap him to talk (fxChat).
   States are classes on any parent: .iamthink (waiting for an answer: the world spins faster), .iamtalk (answering). */
function iamFace(cls = "") {
  return `<span class="iam ${cls}" aria-hidden="true"><canvas class="iamdod" width="${cls === "hero" ? 300 : 160}" height="${cls === "hero" ? 300 : 160}"></canvas><span class="iammane"></span><span class="iamface"><i class="iamlid l"></i><i class="iamlid r"></i><i class="iammouth"></i></span></span>`;
}
// the 20 corners of a dodecahedron, and its 30 edges (corners exactly one edge length apart)
const IAM_DOD = (() => {
  const f = (1 + Math.sqrt(5)) / 2,
    g = 1 / f,
    V = [];
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) V.push([x, y, z]);
  for (const a of [-1, 1])
    for (const b of [-1, 1]) {
      V.push([0, a * g, b * f]);
      V.push([a * g, b * f, 0]);
      V.push([a * f, 0, b * g]);
    }
  const E = [];
  V.forEach((p, i) =>
    V.forEach((q, j) => {
      if (j > i && Math.abs(Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) - 2 * g) < 1e-6) E.push([i, j]);
    }),
  );
  return { V, E };
})();
let iamAngle = 0,
  iamRunning = false;
function iamDraw(c, t) {
  const x = c.getContext("2d"),
    s = c.width / 2,
    tilt = 0.45,
    P = IAM_DOD.V.map(([a, b, z]) => {
      const X = a * Math.cos(t) + z * Math.sin(t),
        Z = -a * Math.sin(t) + z * Math.cos(t),
        Y = b * Math.cos(tilt) - Z * Math.sin(tilt),
        D = b * Math.sin(tilt) + Z * Math.cos(tilt);
      return [s + X * s * 0.47, s + Y * s * 0.47, D];
    });
  x.clearRect(0, 0, c.width, c.height);
  x.lineCap = "round";
  for (const [i, j] of IAM_DOD.E) {
    const d = (P[i][2] + P[j][2]) / 2;
    x.strokeStyle = `rgba(244, 227, 181, ${0.25 + 0.22 * (d + 1.7)})`;
    x.lineWidth = c.width / 80;
    x.beginPath();
    x.moveTo(P[i][0], P[i][1]);
    x.lineTo(P[j][0], P[j][1]);
    x.stroke();
  }
}
// one loop turns every dodecahedron on screen, and stops when none is left
function iamSpin() {
  const C = [...document.querySelectorAll("canvas.iamdod")];
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return C.forEach((c) => iamDraw(c, 0.6));
  if (iamRunning) return;
  iamRunning = true;
  const step = () => {
    const L = [...document.querySelectorAll("canvas.iamdod")];
    if (!L.length) return (iamRunning = false);
    iamAngle += L.some((c) => c.closest(".iamthink")) ? 0.05 : 0.006;
    L.forEach((c) => iamDraw(c, iamAngle));
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
// after an answer arrives, his mouth moves for about as long as it would take to say it
function iamSay(el, text) {
  el.classList.remove("iamthink");
  el.classList.add("iamtalk");
  clearTimeout(el._iamT);
  el._iamT = setTimeout(() => el.classList.remove("iamtalk"), Math.min(7000, 1200 + text.length * 25));
}
