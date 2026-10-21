// Science resources: Library tab with filters, chapter Resources tab.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2],K=process.argv[3]||'ncert|sci|3|4';const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-21T10:20:00')});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));const shot=n=>p.screenshot({path:SP+'/s10_'+n+'.png'});
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);
await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','Test');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
console.log('1. resources in data:',await p.evaluate(()=>DATA.resources.length),'for chapter:',await p.evaluate(k=>resourcesFor(unitBy(k)).length,K));
await p.evaluate(()=>{tab="library";ui.lt="science";render()});await p.waitForTimeout(300);await shot('lib');
console.log('2. library shown:',await p.$$eval('.rescard',x=>x.length));
const opt=await p.$$eval('#rcSel option',o=>o.map(x=>x.value).filter(Boolean));if(opt.length){await p.selectOption('#rcSel',opt[Math.min(9,opt.length-1)]);await p.waitForTimeout(300);console.log('3. filtered by',opt[Math.min(9,opt.length-1)],':',await p.$$eval('.rescard',x=>x.length))}
const tb=p.locator('[data-act="rt"]').nth(1);if(await tb.count()){await tb.click();await p.waitForTimeout(200);console.log('4. by type:',await p.$$eval('.rescard',x=>x.length))}
await p.evaluate(k=>openSheet({mode:'chapter',k}),K);await p.waitForTimeout(300);const rt=p.locator('[data-act="ctab"][data-t="res"]');
if(await rt.count()){await rt.click();await p.waitForTimeout(200);console.log('5. chapter tab cards:',await p.$$eval('#sheetBody .rescard',x=>x.length));await shot('chap')}else console.log('5. no Resources tab');
console.log('errors:',JSON.stringify(errs));await b.close()})();
