// Chapter packs: day plan drives Today, chapter tabs, pack worksheets, prep.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2],K=process.argv[3]||'ncert|sci|3|4';const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-21T10:20:00')});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
const shot=n=>p.screenshot({path:SP+'/s9_'+n+'.png'});
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);
await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','Test');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const info=await p.evaluate(k=>{const u=unitBy(k);if(!u)return 'no unit';const d=daySteps(u,1,1);return {title:u.title,days:sessionsFor(u),step1:d.map(s=>s.label+': '+s.title+' ('+Math.round(s.mins*60)+'m)'),prep:prepFor(u,1).map(x=>x.lead+'d '+x.task)}},K);
console.log('1. unit:',JSON.stringify(info,null,1));
await p.evaluate(k=>{S.next={sci:[k]};commit()},K);await p.waitForTimeout(300);
console.log('2. today rows:',await p.$$eval('.compact .tr.s-sci .m b',x=>x.map(e=>e.textContent).slice(0,6)));await shot('today');
await p.evaluate(k=>openSheet({mode:'chapter',k}),K);await p.waitForTimeout(300);await shot('chapter');
for(const t of ['days','ws','lab','voices']){await p.click(`[data-act="ctab"][data-t="${t}"]`);await p.waitForTimeout(200);console.log('3. tab',t,(await p.textContent('#sheetBody')).replace(/\s+/g,' ').slice(0,160));await shot('tab_'+t)}
await p.click('[data-act="ctab"][data-t="ws"]');await p.locator('#sheetBody [data-act="ws"]').first().click();await p.waitForTimeout(300);console.log('4. worksheet:',await p.textContent('#sheetTitle'));await shot('ws');
await p.evaluate(()=>sheet.close());
await p.locator('.compact .tr.s-sci .m').first().click();await p.waitForTimeout(200);await shot('detail');
const play=p.locator('[data-act="play"]');if(await play.count()){await play.last().click();await p.waitForTimeout(300);console.log('5. player:',(await p.textContent('#sheetBody')).replace(/\s+/g,' ').slice(0,300));await shot('player')}
console.log('errors:',JSON.stringify(errs));await b.close()})();
