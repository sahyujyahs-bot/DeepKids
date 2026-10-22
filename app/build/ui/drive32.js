// To finish: worksheets started/missed, projects underway, projects coming up.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T10:20:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
await p.evaluate(()=>{S.next={sci:['ncert|sci|3|4']};const u=unitBy('ncert|sci|3|4');for(let i=0;i<3;i++)logSession(u,"plan");setA('ncert|sci|3|4#ws1','0-0','roots');commit()});await p.waitForTimeout(300);
console.log('1. today link:',await p.$$eval('[data-act="todo"]',x=>x.map(e=>e.textContent)));
await p.click('[data-act="todo"]');await p.waitForTimeout(300);
console.log('2.',(await p.$$eval('#sheetBody .sech',x=>x.map(e=>e.textContent.trim()))).join(' | '));
console.log('3.',(await p.$$eval('#sheetBody .pk',x=>x.map(e=>e.querySelector('.eyebrow').textContent+' — '+e.querySelector('b').textContent+' — '+(e.querySelector('p')?.textContent||'')))).join('\n   '));
await p.screenshot({path:SP+'/s22_todo.png'});await p.locator('#sheetBody [data-act="ws"]').first().click();await p.waitForTimeout(200);console.log('4. continue opens:',await p.textContent('#sheetTitle'));
console.log('errors:',JSON.stringify(errs));await b.close()})();
