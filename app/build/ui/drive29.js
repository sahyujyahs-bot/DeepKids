// Lesson flow in sections (book first, then ideas, try it, views, worksheet, quiz, finish) and full history.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-22T10:20:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
await p.evaluate(()=>{S.next={sci:['ncert|sci|3|4']};ui.more.sci=true;commit()});await p.waitForTimeout(200);console.log('lessons today:',await p.evaluate(()=>dayPlan(today).filter(i=>i.kind==='lesson').map(i=>i.s+' '+i.u.title+' done='+i.done)),await p.evaluate(()=>S.subjects));
for(const day of [1,2]){
 await p.evaluate(()=>playItem(dayPlan(today).find(i=>i.kind==="lesson"&&i.s==="sci"&&!i.done)));await p.waitForTimeout(250);
 console.log(`day ${day} sections:`,await p.$$eval('#sheetBody .secchip',x=>x.map(e=>e.querySelector('.l').textContent+' '+(e.querySelector('small')?.textContent||''))).then(a=>a.join(' | ')));
 const seq=[];for(let i=0;i<14;i++){const k=await p.textContent('#sheetBody .stage .kind').catch(()=>null);if(!k||!(await p.locator('#sheetBody [data-act="pdone"]').count()))break;seq.push(k.trim().split(' · ')[0]+': '+(await p.textContent('#sheetBody .stage h2'))+'  ['+(await p.textContent('#sheetBody .stage .src b').catch(()=>'-'))+']');if(seq.length===2)await p.screenshot({path:SP+'/s16_book.png'});if(seq.length===6)await p.screenshot({path:SP+'/s16_dk.png'});await p.click('#sheetBody [data-act="pdone"]');await p.waitForTimeout(80)}
 console.log(seq.join('\n   '));if(day===1){await p.screenshot({path:SP+'/s15_finish.png'})}
 await p.click('#sheetBody [data-act="finish"]');await p.waitForTimeout(250);await p.evaluate(()=>{ui.more.sci=true;render()})}
await p.evaluate(()=>playItem(dayPlan(today).find(i=>i.kind==="lesson"&&i.s==="sci"&&!i.done)));await p.waitForTimeout(200);await p.click('#sheetBody .secchip:nth-child(3)');await p.waitForTimeout(150);console.log('jump to 3rd section ->',await p.textContent('#sheetBody .stage .kind'));await p.screenshot({path:SP+'/s15_flow.png'});await p.evaluate(()=>sheet.close());
await p.evaluate(()=>{ui.showDone=true;render()});await p.click('[data-act="hist"]');await p.waitForTimeout(200);console.log('pace saved:',JSON.stringify(await p.evaluate(()=>(S.pace||[]).slice(0,3))));console.log('history:',(await p.textContent('#sheetBody')).replace(/\s+/g,' ').slice(0,300));
console.log('errors:',JSON.stringify(errs));await b.close()})();
