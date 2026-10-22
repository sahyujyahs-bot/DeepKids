// Worksheet finished returns to where the parent came from; selected syllabus chips are highlighted.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const finishWs=async()=>{for(let i=0;i<6;i++){const n=p.locator('#sheetBody [data-act="wsec"][data-d="1"]');if(!await n.count())break;await n.click();await p.waitForTimeout(80)}await p.click('#sheetBody [data-act="wsdone"]');await p.waitForTimeout(1900)};
await p.evaluate(()=>{S.next={sci:['ncert|sci|3|4']};ui.more.sci=true;commit()});await p.evaluate(()=>playItem(dayPlan(today).find(i=>i.kind==="lesson"&&i.s==="sci")));await p.waitForTimeout(300);await p.click('#sheetBody [data-act="pdone"]');await p.waitForTimeout(150);
await p.evaluate(()=>openSheet({mode:'ws',k:'ncert|sci|3|4',w:'ws1'}));await p.waitForTimeout(200);console.log('1. in worksheet:',await p.textContent('#sheetTitle'));
await finishWs();console.log('   after finishing ->',await p.evaluate(()=>ui.sheet&&ui.sheet.mode),'|',await p.textContent('#sheetTitle'),'| step:',await p.textContent('#sheetBody .stage h2').catch(()=>''));
await p.evaluate(()=>sheet.close());await p.waitForTimeout(150);
await p.evaluate(()=>openSheet({mode:'chapter',k:'ncert|sci|3|4'}));await p.click('[data-act="ctab"][data-t="ws"]');await p.locator('#sheetBody [data-act="ws"]').nth(1).click();await p.waitForTimeout(200);
await finishWs();console.log('2. from chapter page ->',await p.evaluate(()=>ui.sheet&&ui.sheet.mode+"/"+(ui.ctab[ui.sheet.k]||"")));await p.evaluate(()=>sheet.close());await p.waitForTimeout(150);
await p.click('#nav [data-tab="library"]');await p.click('[data-act="bb"][data-b="cambridge"]');await p.waitForTimeout(200);
console.log('3. chip colours:',JSON.stringify(await p.$$eval('[data-act="bb"]',x=>x.map(e=>e.textContent+':'+getComputedStyle(e).backgroundColor))));
console.log('errors:',JSON.stringify(errs));await b.close()})();
