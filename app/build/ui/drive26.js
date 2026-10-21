// Lesson flow leads into everything for the chapter; Journey lists chapters in progress and done.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-21T10:20:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));const shot=n=>p.screenshot({path:SP+'/s12_'+n+'.png'});
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
await p.locator('.tr.s-sci .m').first().click();await p.waitForTimeout(200);
console.log('1. lesson detail buttons:',await p.$$eval('#main .tr.open .row button, #sheetBody .row button',x=>x.map(e=>e.textContent.trim())).catch(()=>[]));
await p.locator('[data-act="play"]').last().click();await p.waitForTimeout(300);
console.log('2. hub sections in lesson:',await p.$$eval('#sheetBody .hub summary b',x=>x.map(e=>e.textContent)));
await p.locator('#sheetBody .hub summary').nth(2).click();await p.waitForTimeout(150);await shot('hub');
console.log('3. voices open:',await p.$$eval('#sheetBody .hub[open] .voicecard b',x=>x.map(e=>e.textContent).slice(0,2)));
await p.locator('#sheetBody .hub summary',{hasText:'Worksheets'}).click();await p.locator('#sheetBody .hub[open] [data-act="ws"]').first().click();await p.waitForTimeout(200);console.log('4. worksheet from lesson:',await p.textContent('#sheetTitle'),'| back:',await p.getAttribute('#sheetClose','aria-label'));
await p.click('#sheetClose');await p.waitForTimeout(200);console.log('5. back to lesson:',await p.textContent('#sheetTitle'));
for(let i=0;i<8;i++){const d=p.locator('#sheetBody [data-act="pdone"]');if(!await d.count())break;await d.click()}console.log('6. finish screen hub:',await p.$$eval('#sheetBody .hub',x=>x.length));
await p.click('#sheetBody [data-act="finish"]');await p.waitForTimeout(300);
await p.click('#nav [data-tab="journey"]');await p.waitForTimeout(200);console.log('7. journey chapters:',await p.$$eval('#main .topic b',x=>x.map(e=>e.textContent)));
await p.locator('#main .topic button').first().click();await p.waitForTimeout(200);console.log('8. opened:',await p.textContent('#sheetTitle'));await shot('journey');
console.log('errors:',JSON.stringify(errs));await b.close()})();
