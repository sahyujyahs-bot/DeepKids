const cp = require("child_process"), fs = require("fs"); const C = require("./clauses.js");
const out = [];
C.forEach((sl, i) => { const row = []; sl.forEach((t, j) => { const f = `wav/${i + 1}_${j}.wav`;
  if (!fs.existsSync(f)) cp.execSync(`piper -m /tmp/sh/tts/alba-medium.onnx -f ${f}`, { input: t, stdio: ["pipe", "ignore", "ignore"] });
  row.push(parseFloat(cp.execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 ${f}`).toString())); }); out.push(row); });
fs.writeFileSync("timing.json", JSON.stringify(out)); console.log(JSON.stringify(out));
