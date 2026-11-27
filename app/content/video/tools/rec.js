const { chromium } = require("playwright"); const cp = require("child_process"), fs = require("fs");
const { DUR } = require("./make.js");
const ONLY = process.env.ONLY ? process.env.ONLY.split(",").map(Number) : null, FPS = 30;
(async () => {
  const b = await chromium.launch(); fs.mkdirSync("clips", { recursive: true });
  for (let i = 0; i < DUR.length; i++) {
    if (ONLY && !ONLY.includes(i + 1)) continue;
    const p = await (await b.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
    await p.goto(`file:///tmp/sh/persp/anim/s${i + 1}.html`); await p.waitForTimeout(300);
    const n = Math.round(DUR[i] * FPS);
    const ff = cp.spawn("ffmpeg", ["-y", "-v", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-", "-vf", "format=yuv420p", "-c:v", "libx264", "-crf", "18", "-preset", "fast", `clips/c${i + 1}.mp4`], { stdio: ["pipe", "inherit", "inherit"] });
    const done = new Promise((r) => ff.on("close", r));
    for (let f = 0; f < n; f++) {
      await p.evaluate((t) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t; }), (f / FPS) * 1000);
      const buf = await p.screenshot({ type: "jpeg", quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
      if (process.env.STILLS && [0.25, 0.5, 0.75, 0.97].some((q) => f === Math.floor(n * q))) fs.writeFileSync(`clips/st${i + 1}_${f}.jpg`, buf);
    }
    ff.stdin.end(); await done; console.log("slide", i + 1, n);
  }
  await b.close();
})();
