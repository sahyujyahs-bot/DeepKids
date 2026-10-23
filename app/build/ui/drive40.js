// To finish: worksheets started/missed, projects underway, projects coming up.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T10:20:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
await p.evaluate(()=>{SAMPLE={json:async pr=>{window._pr=pr;const m=(pr.match(/"""([\s\S]*)"""/)||[])[1]||"";return {items:m.split("\n").filter(Boolean).map(l=>({type:"class",title:l.split(" ")[0],who:"kid",days:[2,4],start:"17:00",end:"18:00"})),questions:m.includes("Swim")?["Is swimming at the club or school?"]:[]}}}});
await p.click('#nav button:has-text("Plan")');await p.waitForTimeout(300);await p.screenshot({path:SP+'/d42a.png'});
await p.click('[data-act="dex"] >> nth=0');await p.waitForTimeout(100);console.log('1. prefilled:',await p.inputValue('#dumpText'));
await p.click('.composer .send');await p.waitForTimeout(400);console.log('2. found:',await p.$$eval('.parsed b',x=>x.map(e=>e.textContent)),'| box now:',JSON.stringify(await p.inputValue('#dumpText')));
await p.screenshot({path:SP+'/d42b.png'});
await p.fill('#dumpText','Tabla Saturday 10am');await p.click('.composer .send');await p.waitForTimeout(400);console.log('3. after more:',await p.$$eval('.parsed b',x=>x.map(e=>e.textContent)),'| sent:',JSON.stringify(await p.evaluate(()=>(window._pr.match(/"""([\s\S]*)"""/)||[])[1])));
await p.click('[data-act="dhand"]');await p.waitForTimeout(150);console.log('4. hand box:',!!await p.$('.handbox #qa-t'));
console.log('errors:',errs);await b.close()})();
