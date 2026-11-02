/* The website's sign-in screen and the app show the same five welcome slides: same pictures, headings, lines and points. */
const fs = require("fs");
const app = fs.readFileSync(__dirname + "/../../app/src/js/16-onboarding.js", "utf8"),
  web = fs.readFileSync(__dirname + "/../src/platform.js", "utf8");
const grab = (src, start, end) => {
  const a = src.slice(src.indexOf(start), src.indexOf(end, src.indexOf(start)));
  return [...a.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]).filter((x) => !/^intro-/.test(x) || true);
};
const A = grab(app, "const FXINTRO = [", "\n];").map((x) => x.replace(/^intro-/, "")),
  W = grab(web, "const FEATS=[", "\n  ];");
const ok = A.length > 20 && JSON.stringify(A) === JSON.stringify(W);
console.log(ok ? "welcome: the app and the website show the same five slides" : "welcome: FAIL, the two sets differ");
if (!ok) {
  const k = A.findIndex((x, i) => x !== W[i]);
  console.log("first difference:", JSON.stringify(A[k]), "vs", JSON.stringify(W[k]));
}
process.exit(ok ? 0 : 1);
