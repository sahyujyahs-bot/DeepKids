const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T09:00:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const t=async s=>(await p.$eval('#main',e=>e.innerText)).replace(/\n+/g,' | ').slice(0,s||400);
console.log('1. nav:',await p.$$eval('#nav button',x=>x.map(e=>e.innerText.trim())));
console.log('2. sci queue:',await p.evaluate(()=>plannedUnits('sci').slice(0,6).map(u=>u.board+':'+u.title.slice(0,24)).join(' / ')));
console.log('3. today plan:',await p.evaluate(()=>dayPlan(today).map(i=>i.kind+':'+(i.title||'').slice(0,40)+(i.kind==='dkt'?' ['+i.sub+']':'')).join(' || ')));
console.log('   focus card:',(await p.$eval('.now',e=>e.innerText)).replace(/\n+/g,' | '));
await p.click('.now .subtap');await p.waitForTimeout(200);console.log('   after tapping subtitle: details open',!!await p.$('.now .tdet'),'|',await p.$eval('.now .subtap .chev',e=>e.textContent));
await p.screenshot({path:SP+'/q4.png'});
// pace
await p.click('#nav button:has-text("Plan")');await p.click('[data-act="seg"][data-v="lessons"]');await p.waitForTimeout(200);
console.log('4. pace dk card:',await p.$eval('[data-act="dkmin"]',e=>e.closest('.card').innerText.replace(/\n+/g,' | ')));await p.click('[data-act="dkmin"][data-d="1"]');console.log('   after +:',await p.evaluate(()=>S.dkMins));
// lesson head
await p.evaluate(()=>{const u=unitBy('ncert|sci|3|1');openSheet({mode:'chapter',k:u.k})});await p.waitForTimeout(300);
const pd=await p.evaluate(()=>{const u=unitBy('ncert|sci|3|1');const st=packDay(u,1);return st[0].html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,700)});console.log('5. lesson part 1 head:',pd);
await p.evaluate(()=>document.querySelector('#sheet').close());
// pretend 3 parts of EVS ch1 done, one worksheet half-done, one activity started
await p.evaluate(()=>{const k='ncert|sci|3|1';S.progress[k]={...(S.progress[k]||{}),sessions:4,status:'learning'};S.log.push({key:k,date:'2026-10-20',n:1});const u=unitBy(k);const w=u.c.p.worksheets[0];S.ans=S.ans||{};WK()[k+'|'+u.c.p.activities[0].id]={st:'started',started:'2026-10-21',title:u.c.p.activities[0].title};commit()});
await p.click('#nav button:has-text("To do")');await p.waitForTimeout(300);console.log('6. Started:',await t(700));
await p.click('[data-act="seg"][data-v="new"]');await p.waitForTimeout(200);console.log('7. Not started:',await t(900));
const r0=await p.$eval('.trow [data-act="qpick"]',e=>e.dataset.r);await p.click('.trow [data-act="qpick"]');await p.waitForTimeout(150);
console.log('   chooser:',await p.$$eval('.qpick button',x=>x.map(e=>e.textContent)));
await p.click('[data-act="seg"][data-v="queue"]');await p.waitForTimeout(200);
for(const ty of ['les','exp','act','proj','ws','qz']){await p.click(`[data-act="tqt"][data-t="${ty}"]`);await p.waitForTimeout(150);console.log('8. queue',ty,':',await p.$$eval('.qrow2',x=>x.map(e=>e.innerText.replace(/\n+/g,' ').replace(/[▲▼]/g,'').slice(0,50))))}
await p.click('[data-act="tqt"][data-t="qz"]');await p.waitForTimeout(150);
const before=await p.$$eval('.qrow2',x=>x.map(e=>e.dataset.r));if(before.length>1){await p.click(`.qrow2 [data-act="qmv"][data-d="1"]`);await p.waitForTimeout(200);console.log('9. after ▼ on first:',(await p.$$eval('.qrow2',x=>x.map(e=>e.dataset.r))).slice(0,3).map(r=>r.split('|').pop()));
 // drag third to top
 const hs=await p.$$('.qrow2 .dh');const a=await hs[2].boundingBox(),z=await hs[0].boundingBox();await p.mouse.move(a.x+5,a.y+5);await p.mouse.down();await p.mouse.move(z.x+5,z.y+2,{steps:8});await p.mouse.up();await p.waitForTimeout(300);
 console.log('   after dragging 3rd to top:',(await p.$$eval('.qrow2',x=>x.map(e=>e.dataset.r))).slice(0,3).map(r=>r.split('|').pop()),'| saved:',await p.evaluate(()=>(S.wq.qz||[]).slice(0,3).map(r=>r.split('|').pop())))}
await p.screenshot({path:SP+'/q5.png'});
await p.click('[data-act="qshuf"]');console.log('   shuffle ok');
// open a quiz
await p.click('.qrow2 button.plain');await p.waitForTimeout(300);console.log('10. quiz sheet:',await p.$eval('#sheetTitle',e=>e.textContent),'| qs:',await p.$$eval('#sheetBody .qzl li',x=>x.length));
await p.evaluate(()=>document.querySelector('#sheet').close());
// lesson + Queue from inside the chapter lab
await p.evaluate(()=>{ui.ctab['ncert|sci|3|1']='lab';openSheet({mode:'chapter',k:'ncert|sci|3|1'})});await p.waitForTimeout(300);
const qb=await p.$('#sheetBody [data-act="qpick"]');console.log('11. lesson has + Queue:',!!qb);if(qb){await qb.click();await p.waitForTimeout(150);await p.click('#sheetBody .qpick [data-w="first"]');await p.waitForTimeout(200);console.log('   toast:',await p.$eval('.toast',e=>e.innerText).catch(()=>'-'))}
await p.evaluate(()=>document.querySelector('#sheet').close());
// library chooser
await p.evaluate(()=>openSheet({mode:'chapter',k:'cam|sci|4|1'}));await p.waitForTimeout(300);await p.click('#sheetBody [data-act="qpick"]');await p.click('#sheetBody .qpick [data-w="first"]');await p.waitForTimeout(200);console.log('12. library add first:',await p.$eval('.toast',e=>e.innerText).catch(()=>'-'),'|',await p.evaluate(()=>plannedUnits('sci')[0].k));
await p.evaluate(()=>document.querySelector('#sheet').close());
// more: daily check-ins
await p.click('#nav button:has-text("Today")');await p.waitForTimeout(200);await p.evaluate(()=>openSheet({mode:'more'}));await p.waitForTimeout(300);
console.log('13. daily check-ins:',await p.$eval('#newExp',e=>e.closest('.card').innerText.replace(/\n+/g,' | ').slice(0,500)));
const sb=await p.$('#sheetBody [data-act="startexp"]');if(sb){await sb.click();await p.waitForTimeout(200);console.log('   started:',await p.evaluate(()=>S.exps.map(e=>e.title)))}
console.log('errors:',errs);await b.close()})();
