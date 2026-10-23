const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T21:00:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const live=JSON.parse(require('fs').readFileSync(SP+'/live/state.json','utf8'));await p.evaluate(L=>{S={...S,...L,acct:S.acct};commit()},live);await p.waitForTimeout(300);
const st=async()=>p.evaluate(()=>{const W=workItems();return `pending:${W.filter(x=>x.pend).length} (queued ${W.filter(x=>x.pend&&x.q).length}) | queued:${W.filter(x=>x.q).length} | ongoing:${W.filter(x=>x.st==='going').length} (queued ${W.filter(x=>x.st==='going'&&x.q).length})`});
console.log('start:',await st());
await p.click('#nav button:has-text("Plan")');await p.click('.segmain [data-v="pending"]');await p.waitForTimeout(200);
// queue the first pending worksheet
const r=await p.evaluate(()=>workItems().find(x=>x.pend&&x.ty==='ws').ref);await p.click(`.trow [data-act="qpick"][data-r="${r}"]`);await p.click('.qpick [data-w="first"]');await p.waitForTimeout(200);
console.log('1. pending+queued:',await st());console.log('   row:',await p.$eval(`.trow:has([data-r="${r}"])`,e=>e.innerText.replace(/\n+/g,' · ').slice(0,140)));
// it is in the queue tab too
await p.click('.segmain [data-v="queue"]');await p.click('[data-act="tqt"][data-t="ws"]');await p.waitForTimeout(200);console.log('   queue:',await p.$$eval('.qrow2',x=>x.map(e=>e.innerText.replace(/[▲▼]/g,'').replace(/\n+/g,' · ').slice(0,90))));
// start it (answer one question) -> ongoing + queued
await p.evaluate(r=>{const key=r.slice(3);const k=key.slice(0,key.lastIndexOf('|')),id=key.slice(key.lastIndexOf('|')+1);setA(k+'#'+id,'0-0','x');commit()},r);await p.waitForTimeout(200);
console.log('2. ongoing+queued:',await st());await p.click('.segmain [data-v="ongoing"]');await p.waitForTimeout(200);console.log('   ongoing row:',await p.$eval(`.trow:has([data-act="ws"])`,e=>e.innerText.replace(/\n+/g,' · ').slice(0,140)).catch(()=>'-'));
// not started (not reached) + queued, from a chapter not reached
await p.evaluate(()=>{ui.ctab['ncert|sci|3|4']='ws';openSheet({mode:'chapter',k:'ncert|sci|3|4'})});await p.waitForTimeout(300);await p.click('#sheetBody .wkctl [data-act="qpick"]');await p.click('#sheetBody .qpick [data-w="last"]');await p.waitForTimeout(200);
console.log('3. not started + queued:',await p.$eval('#sheetBody .wkctl',e=>e.innerText.replace(/\n+/g,' · ')),'|',await st());
await p.click('#sheetBody .wkctl [data-act="qx"]');await p.waitForTimeout(200);console.log('   taken out:',await p.$eval('#sheetBody .wkctl',e=>e.innerText.replace(/\n+/g,' · ')));
await p.evaluate(()=>document.querySelector('#sheet').close());
// activity: queue then mark started then clear -> still queued
await p.evaluate(()=>{ui.ctab['ncert|sci|3|5']='lab';openSheet({mode:'chapter',k:'ncert|sci|3|5'})});await p.waitForTimeout(300);
const c0=await p.$eval('#sheetBody .wkctl',e=>e.innerText.replace(/\n+/g,' · '));await p.click('#sheetBody .wkctl [data-act="qpick"]');await p.click('#sheetBody .qpick [data-w="first"]');await p.waitForTimeout(200);
await p.click('#sheetBody .wkctl [data-act="wkst"][data-to="started"]');await p.waitForTimeout(200);const c1=await p.$eval('#sheetBody .wkctl',e=>e.innerText.replace(/\n+/g,' · '));
await p.click('#sheetBody .wkctl [data-act="wkst"][data-to="none"]');await p.waitForTimeout(200);console.log('4. activity:',c0,'→',c1,'→ cleared:',await p.$eval('#sheetBody .wkctl',e=>e.innerText.replace(/\n+/g,' · ')));
console.log('errors:',errs);await b.close()})();
