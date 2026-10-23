const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T15:40:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
await p.evaluate(()=>openSheet({mode:"iopts",date:today,id:"dkt"}));await p.waitForTimeout(300);
console.log('dkt options:',await p.$eval('#sheetBody',e=>e.innerText.replace(/\n+/g,' / ').slice(0,400)));console.log(await p.$$eval('#sheetBody [data-act]',x=>x.map(e=>e.dataset.act)));
for(const a of ['iodone','iosnz','ioskipday']){const f=await p.$('#sheetBody [data-act="'+a+'"]');if(f){await f.click();await p.waitForTimeout(300);console.log(a,'->',await p.evaluate(()=>JSON.stringify(dayPlan(today).find(i=>i.kind==="dkt"))?.slice(0,160)));await p.evaluate(()=>openSheet({mode:"iopts",date:today,id:"dkt"}));await p.waitForTimeout(200)}}
console.log('errors:',errs);await b.close()})();
