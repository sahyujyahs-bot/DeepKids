const cp = require("child_process"), fs = require("fs");
const { DUR, OFF } = require("./make.js"), TM = require("./timing.json");
const sh = (c) => cp.execSync(c, { stdio: ["ignore", "inherit", "inherit"] });
let list = "", alist = "";
DUR.forEach((d, i) => {
  const n = i + 1, ins = TM[i].map((_, j) => `-i wav/${n}_${j}.wav`).join(" ");
  const fl = TM[i].map((_, j) => `[${j}:a]aresample=44100,adelay=${Math.round(OFF[i][j] * 1000)}|${Math.round(OFF[i][j] * 1000)}[a${j}]`).join(";") + ";" + TM[i].map((_, j) => `[a${j}]`).join("") + `amix=inputs=${TM[i].length}:normalize=0:duration=longest,apad=whole_dur=${d.toFixed(3)}[o]`;
  sh(`ffmpeg -y -v error ${ins} -filter_complex "${fl}" -map "[o]" -t ${d.toFixed(3)} -ac 1 -ar 44100 seg${n}.wav`);
  sh(`ffmpeg -y -v error -i clips/c${n}.mp4 -t ${d.toFixed(3)} -vf "fps=30,fade=t=in:d=0.25,fade=t=out:st=${(d - 0.25).toFixed(3)}:d=0.25" -c:v libx264 -crf 18 -pix_fmt yuv420p -an p${n}.mp4`);
  list += `file p${n}.mp4\n`; alist += `file seg${n}.wav\n`;
});
fs.writeFileSync("pl.txt", list); fs.writeFileSync("al.txt", alist);
sh(`ffmpeg -y -v error -f concat -i pl.txt -c copy whole.mp4`);
sh(`ffmpeg -y -v error -f concat -i al.txt -c copy voice.wav`);
const total = DUR.reduce((a, b) => a + b, 0);
sh(`ffmpeg -y -v error -i whole.mp4 -i voice.wav -i /tmp/sh/reel/v4/music2.wav -filter_complex "[1:a]loudnorm=I=-15:TP=-1.5,aresample=44100[v];[2:a]aresample=44100,volume=0.07,afade=t=in:d=1.5,afade=t=out:st=${(total - 2.5).toFixed(2)}:d=2.5[m];[v][m]amix=inputs=2:duration=first:normalize=0[a]" -map 0:v -map "[a]" -t ${total.toFixed(3)} -c:v copy -c:a aac -b:a 160k -movflags +faststart /tmp/sh/persp/video-two-v1.mp4`);
