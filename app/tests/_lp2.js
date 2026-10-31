const { chromium } = require("playwright");
(async()=>{const b=await chromium.launch(),p=await b.newPage();
await p.goto("http://127.0.0.1:8808/app.html");await p.waitForTimeout(300);
await p.fill("#lgPhone","81234 56789");await p.fill("#lgName","S");await p.click('[data-act="login"]');await p.waitForTimeout(300);
await p.fill("#obName","Liri");await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="combined"]');
for(let i=0;i<8;i++){const n=await p.$('[data-ob="next"]');if(!n)break;await n.click();await p.waitForTimeout(150);}
const T=process.argv.slice(2);
for(const t of T){const r=await p.evaluate(t=>{const R=readOnPhone(t);return {left:R.left,items:R.items.map(x=>[x.type,x.title,x.days,x.start,x.end,x.date].filter(v=>v!=null&&v!=="").join(" | ")),asks:R.asks.map(a=>a.q)}},t);console.log(t,"\n   ",JSON.stringify(r));}
await b.close();})();
