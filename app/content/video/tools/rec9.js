const { chromium } = require("playwright"); const fs = require("fs"), cp = require("child_process");
const { S } = require("./make9.js"); const B = "http://127.0.0.1:8796/";
const ONLY = process.env.ONLY ? process.env.ONLY.split(",").map(Number) : null;
(async () => {
  const b = await chromium.launch(); fs.mkdirSync("/tmp/sh/dna/sb/anim9", { recursive: true });
  for (let i = 0; i < S.length; i++) {
    if (ONLY && !ONLY.includes(i + 1)) continue;
    const [dur, html] = S[i]; const n = String(i + 1).padStart(2, "0");
    fs.writeFileSync(`/tmp/sh/dna/sb/a9_${n}.html`, html);
    const ctx = await b.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 }); const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
    const dir = `/tmp/sh/dna/sb/anim9/f${n}`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    const frames = []; let on = false;
    cdp.on("Page.screencastFrame", (f) => { cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {}); if (on) { const file = `${dir}/${String(frames.length).padStart(5, "0")}.jpg`; fs.writeFileSync(file, Buffer.from(f.data, "base64")); frames.push([file, f.metadata.timestamp]); } });
    await p.goto(B + `a9_${n}.html`, { waitUntil: "load" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await cdp.send("Page.startScreencast", { format: "jpeg", quality: 80, maxWidth: 1080, maxHeight: 1920, everyNthFrame: 1 }); on = true;
    await p.waitForTimeout((dur + 0.6) * 1000); await cdp.send("Page.stopScreencast"); await ctx.close();
    const end = Math.max(frames[frames.length - 1][1] + 0.1, frames[0][1] + dur + 0.6);
    const list = frames.map((x, k) => `file '${x[0]}'\nduration ${Math.max(0.016, (k + 1 < frames.length ? frames[k + 1][1] : end) - x[1]).toFixed(4)}`).join("\n") + `\nfile '${frames[frames.length - 1][0]}'\n`;
    fs.writeFileSync(`${dir}/list.txt`, list);
    cp.execSync(`ffmpeg -y -v error -f concat -safe 0 -i ${dir}/list.txt -vf "scale=1080:1920,fps=30,format=yuv420p" -c:v libx264 -crf 20 -preset fast -an /tmp/sh/dna/sb/anim9/a${n}.mp4`);
    cp.execSync(`find ${dir} -name '*.jpg' -delete`);
    console.log("rec", n, frames.length);
  }
  await b.close();
})();
