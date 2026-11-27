const { chromium } = require("playwright");
const fs = require("fs");
const css = `*{box-sizing:border-box;margin:0}body{width:1280px;height:720px;background:#efe3cf;font-family:Georgia,'Times New Roman',serif;color:#23233a;position:relative;overflow:hidden}
.t{position:absolute;left:80px;top:70px;width:1120px}h1{font-size:62px;line-height:1.1;font-weight:700}h2{font-size:44px;line-height:1.15}p{font-size:30px;line-height:1.35;font-family:Arial,sans-serif}
.small{font-size:22px;color:#6b6b80;font-family:Arial,sans-serif}.chip{display:inline-block;background:#fff;border:3px solid #23233a;border-radius:40px;padding:14px 26px;font:26px Arial,sans-serif;margin:8px 10px 8px 0}
.card{background:#fff;border-radius:26px;padding:28px 34px;box-shadow:0 8px 0 rgba(0,0,0,.12)}.red{color:#d63a2a}.sun{background:#ffd166}.bar{position:absolute;left:0;bottom:0;width:100%;padding:18px 80px;background:#23233a;color:#fff;font:24px Arial,sans-serif}
.phone{position:absolute;border-radius:34px;border:8px solid #23233a;overflow:hidden;background:#fff;box-shadow:0 14px 0 rgba(0,0,0,.15)}.phone img{width:100%;display:block}
.col{position:absolute;top:250px;width:520px;min-height:300px}.for{background:#e6f4ea}.against{background:#fdeaea}.tag{font:bold 22px Arial,sans-serif;letter-spacing:2px;margin-bottom:10px}`;
const S = [
`<div class=t style="top:150px"><h1>Who decides<br>what is true?</h1><p style="margin-top:30px">Most things children learn come with one answer.</p></div><div class="bar">1 · Hook</div>`,
`<div class=t><h2>Every big idea at DeepKids comes with the people who think about it.</h2><div style="margin-top:50px"><span class=chip>a scientist in 1944</span><span class=chip>a grandmother's saying</span><span class=chip>a farmer in Tamil Nadu</span><span class=chip>an Upanishad</span><span class=chip>a girl who asked why</span></div><p style="margin-top:30px">Each one is named. Each one is heard.</p></div><div class="bar">2 · Many voices, named</div>`,
`<div class=t style="width:560px;top:130px"><h2>"Is this true?"</h2><p style="margin-top:24px">An idea families really hear. Who said it. And then, the child decides.</p><p class=small style="margin-top:20px">Real screen from the app</p></div><div class=phone style="left:760px;top:-60px;width:360px"><img src="app-true-1.png"></div><div class="bar">3 · The real card</div>`,
`<div class=t style="top:50px"><h2>"Your DNA decides everything about you."</h2></div><div class="col for card" style="left:80px"><div class=tag style="color:#2e7d32">THE CASE FOR</div><p>DNA holds the instructions for every protein in your body.</p></div><div class="col against card" style="left:680px"><div class=tag class=red style="color:#c62828">THE CASE AGAINST</div><p>Identical twins grow different. Food, stories and place change which genes are used.</p></div><div style="position:absolute;left:470px;top:590px"><span class="chip sun">Still argued by scientists</span></div><div class="bar">4 · Both sides, with evidence</div>`,
`<div class=t><h2>Ideas that were rejected</h2><div class=card style="margin-top:36px"><p><b>Before the 1940s</b> most scientists thought proteins carried the instructions, not DNA.</p></div><div class=card style="margin-top:22px"><p><b>1944 and 1952</b> experiments with bacteria and viruses showed DNA does.</p></div><p style="margin-top:26px">Science changes its mind. That is how it works.</p></div><div class="bar">5 · Wrong ideas, and how we found out</div>`,
`<div class=t style="width:560px;top:120px"><h2>"Big think"</h2><p style="margin-top:24px">Questions with no single answer. The child forms their own view, and thinks it through, one small step at a time.</p><p class=small style="margin-top:20px">Real screen from the app</p></div><div class=phone style="left:760px;top:-50px;width:360px"><img src="app-bigq-0.png"></div><div class="bar">6 · Questions, not answers</div>`,
`<div class=t style="top:170px;text-align:center"><h1>We don't hand you the answer.</h1><h1 class=red style="margin-top:16px">We hand you the question.</h1><p style="margin-top:50px">DeepKids Gurukul · app.deepkids.in</p></div><div class="bar">7 · Close</div>`,
];
(async () => {
  const b = await chromium.launch(), p = await (await b.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
  for (let i = 0; i < S.length; i++) {
    fs.writeFileSync(`/tmp/sh/persp/s${i + 1}.html`, `<meta charset=utf-8><style>${css}</style>${S[i]}`);
    await p.goto(`file:///tmp/sh/persp/s${i + 1}.html`); await p.waitForTimeout(300);
    await p.screenshot({ path: `/tmp/sh/persp/s${i + 1}.png` });
  }
  await b.close();
})();
