// To finish: worksheets started/missed, projects underway, projects coming up.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T16:02:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const live=JSON.parse(require('fs').readFileSync(SP+'/live/state.json','utf8'));
await p.evaluate(L=>{delete L.tl['2026-10-23|e-6sl2xuk'];S={...S,...L,acct:S.acct};commit()},live);await p.waitForTimeout(300);
await p.click('#nav button:has-text("Today")');await p.waitForTimeout(300);
console.log('1. fri 4pm past card:',(await p.$eval('.pastev',e=>e.innerText).catch(()=>'none')).replace(/\n+/g,' / '));
console.log('   now card:',(await p.$eval('section.now',e=>e.innerText).catch(()=>'none')).replace(/\n+/g,' / ').slice(0,150));
await p.click('.pastev [data-act="evmiss"] >> nth=1');await p.waitForTimeout(200);
console.log('   after didnt-happen:',(await p.$eval('.pastev',e=>e.innerText).catch(()=>'none')).replace(/\n+/g,' / '));
// Monday, nothing done
const mon=async(t)=>{await p.clock.setSystemTime(new Date('2026-10-26T'+t+':00'));await p.evaluate(()=>{today=iso(new Date());_sess=null;render()});await p.waitForTimeout(150);return [(await p.$eval('section.now',e=>e.innerText.split('\n').slice(0,2).join(' · ')).catch(()=>'none')),(await p.$eval('.pastev',e=>e.innerText.replace(/\n+/g,' / ')).catch(()=>'-'))]};
for(const t of ['09:40','11:20','12:30','14:00','16:30','18:30'])console.log('2. mon',t,JSON.stringify(await mon(t)));
// options sheet on a lesson
await p.click('section.now [data-act="iopts"]');await p.waitForTimeout(250);
console.log('3. options:',(await p.$eval('#sheetBody',e=>e.innerText)).replace(/\n+/g,' / '));
await p.screenshot({path:SP+'/d38.png'});
await p.click('[data-act="iosnz"]');await p.waitForTimeout(200);console.log('   after later:',JSON.stringify(await mon('18:31')));
await p.click('section.now [data-act="tlcheck"]').catch(()=>{});await p.waitForTimeout(200);const sh=await p.$eval('#sheetTitle',e=>e.textContent).catch(()=>'');console.log('   tick opens:',sh);
await p.click('[data-act="ioskip"]').catch(()=>{});await p.waitForTimeout(200);
console.log('   after skip:',await p.evaluate(()=>JSON.stringify(S.log.slice(0,1).map(l=>[l.kind,l.title,l.n]))),await p.evaluate(()=>dayPlan(today).filter(i=>i.kind==="lesson").map(i=>i.title+':'+i.sub).join(' | ')));
const lid=await p.evaluate(()=>dayPlan(today).find(i=>i.kind==="lesson"&&i.s==="math").id);await p.evaluate(([d,id])=>openSheet({mode:'iopts',date:d,id}),['2026-10-26',lid]);await p.waitForTimeout(200);console.log('5. lesson opts:',(await p.$eval('#sheetBody',e=>e.innerText)).replace(/\n+/g,' / '));await p.click('[data-act="ioskip"]');await p.waitForTimeout(200);console.log('   skipped:',await p.evaluate(()=>dayPlan(today).filter(i=>i.kind==="lesson").map(i=>i.title+':'+i.sub).join(' | ')),await p.evaluate(()=>S.progress['ncert|math|3|2']?.sessions));const eid=await p.evaluate(()=>dayPlan(today).find(i=>i.kind==="lesson"&&i.s==="eng"&&!i.done).id);await p.evaluate(([d,id])=>openSheet({mode:'iopts',date:d,id}),['2026-10-26',eid]);await p.waitForTimeout(150);await p.click('[data-act="iofin"]');await p.waitForTimeout(200);console.log('   eng done:',await p.evaluate(()=>dayPlan(today).filter(i=>i.kind==="lesson").map(i=>i.title+':'+i.sub).join(' | ')));
// activity: not doing
await p.evaluate(()=>{const u=unitBy('ncert|sci|3|4');ui.ctab[u.k]="lab";openSheet({mode:"chapter",k:u.k})});await p.waitForTimeout(250);await p.click('#sheetBody .wkctl >> nth=0 >> [data-to="skip"]');await p.waitForTimeout(200);console.log('4. activity:',await p.$eval('#sheetBody .wkctl',e=>e.innerText.replace(/\n/g,' ')));
console.log('errors:',errs);await b.close()})();
