/* I am, the DeepKids teacher. Until his new portrait is ready he appears as his world, a slowly turning dodecahedron,
   with his name in it. Tap him to talk (fxChat). States are classes on any parent: .iamthink (waiting for an answer:
   the world spins faster), .iamtalk (answering: it glows). */
function iamFace(cls = "") {
  const n = cls === "hero" ? 300 : 160;
  return `<span class="iam ${cls}" aria-hidden="true"><canvas class="iamdod" width="${n}" height="${n}"></canvas><b class="iamname">I am</b></span>`;
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
// after an answer arrives, he glows for about as long as it would take to say it
function iamSay(el, text) {
  el.classList.remove("iamthink");
  el.classList.add("iamtalk");
  clearTimeout(el._iamT);
  el._iamT = setTimeout(() => el.classList.remove("iamtalk"), Math.min(7000, 1200 + text.length * 25));
}
// where the family is when they tap I am: the screen or open panel, the words in the middle of the screen,
// and a few questions that suit that place
const IAM_ASKS = {
  unit: ["Explain this simply", "Give me a real-life example", "Ask me a question about it"],
  sheet: ["Explain this simply", "Give me an idea to try"],
  today: ["What should we start with today?", "Make today's lesson more fun"],
  week: ["Help me plan this week", "We have a trip coming. What changes?"],
  journey: ["How is my child doing?", "What should we go over again?"],
  library: ["What should we learn next?", "Find something about space"],
};
function iamWhere() {
  const top = [...document.querySelectorAll("dialog[open]")].filter((d) => d.id !== "fxChat").pop(),
    mid = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
  let el = mid;
  while (el && el !== top && el !== document.body && (el.innerText || "").trim().length < 80) el = el.parentElement;
  const about = (el && el !== document.body ? el.innerText : "").trim().slice(0, 1500);
  if (top?.id === "fxDlg" && FXU) return { kind: "unit", where: `the unit “${FXU.title}”`, about };
  if (top) {
    const h = top.querySelector("h1,h2,h3,b")?.innerText?.trim();
    return { kind: "sheet", where: h ? `“${h.slice(0, 60)}”` : "this page", about };
  }
  const name = NAV.find(([k]) => k === tab)?.[1] || "the app";
  return { kind: IAM_ASKS[tab] ? tab : "today", where: `the ${name} screen`, about };
}
// one I am on screen: he moves into whichever panel is open on top, so he is always there to tap
function iamFollow() {
  const b = document.getElementById("fxFab");
  if (!b) return;
  const top = [...document.querySelectorAll("dialog[open]")].filter((d) => d.id !== "fxChat").pop() || document.body;
  if (b.parentElement !== top) top.appendChild(b);
  iamSpin();
}
