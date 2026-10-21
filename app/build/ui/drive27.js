// Refresher opens as a playable activity with recall questions, and "We did it" marks it done.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-21T09:00:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
await p.evaluate(()=>{S.log.unshift({date:"2026-10-20",key:"ncert|sci|3|4",subj:"sci",title:"Getting to Know Plants",kind:"plan"});["prep","warm"].forEach(k=>S.tl[today+"|"+(k==="prep"?"am":k)]=1);dayPlan(today).filter(i=>i.kind==="prep").forEach(i=>i.prep.forEach(x=>S.prep[x.id]=today));commit()});await p.waitForTimeout(300);
console.log('1. refresher row:',await p.evaluate(()=>dayPlan(today).find(i=>i.id==="refresh")?.title));
const now=await p.$$eval('.now h2',x=>x.map(e=>e.textContent));console.log('   now card:',now);
const btn=p.locator('[data-act="refresh"]').first();if(!await btn.count()){await p.locator('.tr .m',{hasText:'Refresher'}).first().click();await p.waitForTimeout(200)}
await p.locator('[data-act="refresh"]').first().click();await p.waitForTimeout(300);
console.log('2. sheet:',await p.textContent('#sheetTitle'),'|',(await p.textContent('#sheetBody .stage')).replace(/\s+/g,' ').slice(0,260));
console.log('3. recall questions:',await p.$$eval('#sheetBody .card ol li b',x=>x.map(e=>e.textContent)));
await p.click('#sheetBody [data-act="tlcheck"]');await p.waitForTimeout(300);console.log('4. done:',await p.evaluate(()=>dayPlan(today).find(i=>i.id==="refresh").done),'| button now:',await p.textContent('#sheetBody [data-act="tlcheck"]').catch(()=>'(sheet closed)'));
await p.screenshot({path:SP+'/s13_refresh.png'});console.log('errors:',JSON.stringify(errs));await b.close()})();
