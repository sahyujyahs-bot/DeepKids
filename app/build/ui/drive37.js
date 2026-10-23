// To finish: worksheets started/missed, projects underway, projects coming up.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T04:21:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.evaluate(()=>{S.dkMins=0;commit()});await p.waitForTimeout(400);
const live=JSON.parse(require('fs').readFileSync(SP+'/live/state.json','utf8'));
await p.evaluate(L=>{delete L.tl['2026-10-23|e-6sl2xuk'];S={...S,...L,acct:S.acct};commit()},live);await p.waitForTimeout(300);
console.log('1. events:',await p.evaluate(()=>S.events.map(e=>e.title+' '+e.start).join(' | ')));
await p.click('#nav button:has-text("Today")');await p.waitForTimeout(300);
console.log('2. now:',(await p.$eval('section.now',e=>e.innerText)).replace(/\n+/g,' / '));
// tap the check on the tuition row in the timeline before 11
const id=await p.evaluate(()=>"e-"+S.events.find(e=>e.title==="Science tuition").id);
const ck=await p.$(`.tr .ck[data-id="${id}"]`);if(ck){await ck.click();await p.waitForTimeout(300);console.log('3. pre sheet:',(await p.$eval('#sheetBody',e=>e.innerText)).replace(/\n+/g,' / '))}else console.log('3. no row check visible');
await p.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close())});await p.waitForTimeout(200);
await p.click('section.now [data-act="evcancel"]');await p.waitForTimeout(300);
console.log('4. after cancel now:',(await p.$eval('section.now',e=>e.innerText).catch(()=>'none')).replace(/\n+/g,' / ').slice(0,120),'| note:',await p.$eval('.cal',e=>(e.innerText.match(/Cancelled[^\n]*/)||[''])[0]));
console.log('   fri plan:',await p.evaluate(()=>dayPlan(today).filter(i=>i.kind==="event").map(i=>i.title).join(',')),'| mon plan:',await p.evaluate(()=>dayPlan('2026-10-26').filter(i=>i.kind==="event").map(i=>i.title).join(',')));
await p.click('[data-act="evundo"]');await p.waitForTimeout(200);
// now it's 11:30
await p.clock.setSystemTime(new Date('2026-10-23T11:30:00'));await p.evaluate(()=>render());await p.waitForTimeout(200);
console.log('5. now 11:30:',(await p.$eval('section.now',e=>e.innerText)).replace(/\n+/g,' / ').slice(0,140));
await p.click('section.now [data-act="tlcheck"]');await p.waitForTimeout(300);
console.log('6. check-in:',(await p.$eval('#sheetBody',e=>e.innerText)).replace(/\n+/g,' / ').slice(0,400));
await p.click('[data-act="evf"][data-k="mood"][data-v="great"]');await p.fill('#evf-covered','Parts of a flower, pollination');await p.fill('#evf-hw','Draw a hibiscus and label it');await p.screenshot({path:SP+'/d37.png'});await p.click('[data-act="evsave"]:not([data-quick])');await p.waitForTimeout(300);
console.log('7. saved:',await p.evaluate(()=>JSON.stringify({log:S.evlog,todo:S.todos.slice(-1)[0],tl:Object.keys(S.tl).filter(k=>k.includes('e-'))})));
await p.evaluate(()=>openSheet({mode:"track"}));await p.waitForTimeout(200);console.log('8. track:',(await p.$eval('#sheetBody .tday',e=>e.innerText)).match(/Science tuition:[^\n]*/)?.[0]);
await p.evaluate(()=>openSheet({mode:"told"}));await p.waitForTimeout(200);await p.click('[data-act="toplan"]');await p.waitForTimeout(400);console.log('9. toplan focus:',await p.evaluate(()=>document.activeElement?.id+' sheet:'+!!document.querySelector('dialog[open]')));
console.log('errors:',errs);await b.close()})();
