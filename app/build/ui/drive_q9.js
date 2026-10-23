const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T21:00:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const live=JSON.parse(require('fs').readFileSync(SP+'/live/state.json','utf8'));
await p.evaluate(L=>{S={...S,...L,acct:S.acct};commit()},live);await p.waitForTimeout(300);
const cnt=async()=>p.evaluate(()=>{const W=workItems();return ['new','queued','going'].map(s=>s+':'+W.filter(x=>x.state===s).length).join(' ')});
console.log('start:',await cnt());
// a worksheet in a chapter not reached yet (EVS ch3) -> queue it from the chapter's worksheet list
await p.evaluate(()=>{ui.ctab['ncert|sci|3|3']='ws';openSheet({mode:'chapter',k:'ncert|sci|3|3'})});await p.waitForTimeout(300);
console.log('ch3 ws states:',await p.$$eval('#sheetBody .wkctl',x=>x.slice(0,3).map(e=>e.innerText.replace(/\n+/g,' · '))));
await p.click('#sheetBody .wkctl [data-act="qpick"]');await p.click('#sheetBody .qpick [data-w="first"]');await p.waitForTimeout(300);
console.log('after queue first:',await p.$eval('#sheetBody .wkctl',e=>e.innerText.replace(/\n+/g,' · ')),'|',await cnt());
await p.evaluate(()=>document.querySelector('#sheet').close());
// pending list: queue one, skip one
await p.click('#nav button:has-text("Plan")');await p.click('.segmain [data-v="pending"]');await p.waitForTimeout(200);
console.log('pending rows:',await p.$$eval('.trow',x=>x.slice(0,3).map(e=>e.innerText.replace(/\n+/g,' · ').slice(0,110))));
await p.click('.trow [data-act="qpick"]');await p.click('.qpick [data-w="last"]');await p.waitForTimeout(200);console.log('after +Queue last:',await cnt());
await p.click('.trow [data-act="qx"][data-how="skip"]');await p.waitForTimeout(200);console.log('after Not doing:',await cnt());
// queue tab shows only queued
await p.click('.segmain [data-v="queue"]');await p.click('[data-act="tqt"][data-t="ws"]');await p.waitForTimeout(200);console.log('ws queue:',await p.$$eval('.qrow2',x=>x.map(e=>e.innerText.split('\n')[2])));
await p.click('.qrow2 [data-act="qx"]');await p.waitForTimeout(200);console.log('after take out:',await cnt(),'| ws queue now:',await p.$$eval('.qrow2',x=>x.length));
// quiz state: answer one question -> ongoing
await p.evaluate(()=>openSheet({mode:'qzs',k:'ncert|sci|3|2',n:1}));await p.waitForTimeout(200);console.log('quiz state before:',await p.$eval('#sheetBody .wkctl',e=>e.innerText.replace(/\n+/g,' · ')));
await p.click('#sheetBody [data-act="qz"][data-r="1"]');await p.waitForTimeout(200);console.log('quiz state after 1 answer:',await p.$eval('#sheetBody .wkctl',e=>e.innerText.replace(/\n+/g,' · ')),'|',await cnt());
await p.evaluate(()=>document.querySelector('#sheet').close());
// finished worksheet: undo
await p.evaluate(()=>{ui.ctab['ncert|sci|3|2']='ws';openSheet({mode:'chapter',k:'ncert|sci|3|2'})});await p.waitForTimeout(300);
console.log('ch2 ws:',await p.$$eval('#sheetBody .wkctl',x=>x.slice(0,3).map(e=>e.innerText.replace(/\n+/g,' · '))));
const u=await p.$('#sheetBody [data-act="ist"][data-to="undo"]');if(u){await u.click();await p.waitForTimeout(200);console.log('after undo:',await p.$$eval('#sheetBody .wkctl',x=>x.slice(0,3).map(e=>e.innerText.replace(/\n+/g,' · '))))}
await p.evaluate(()=>document.querySelector('#sheet').close());await p.click('.segmain [data-v="pending"]');await p.waitForTimeout(200);await p.screenshot({path:SP+'/q11.png'});
console.log('errors:',errs);await b.close()})();
