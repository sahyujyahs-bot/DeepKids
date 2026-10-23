const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T21:31:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
await p.click('#nav button:has-text("Plan")');await p.click('.segmain [data-v="cal"]');await p.click('[data-act="pv"][data-v="day"]');await p.waitForTimeout(300);
console.log('tags:',await p.$$eval('.tt .tr',x=>x.map(e=>(e.querySelector('.t')?.innerText||'').replace(/\n/g,'')+' '+(e.querySelector('.tag')?.innerText||'-')+(e.classList.contains('focus')?' [focus]':''))));
const xs=await p.$$eval('.tt .tr .tcard',x=>x.map(e=>Math.round(e.getBoundingClientRect().left)+'/'+Math.round(e.getBoundingClientRect().width)));console.log('card left/width:',xs);
await p.evaluate(()=>document.querySelector('.tt .tr.focus')?.scrollIntoView({block:'center'}));await p.screenshot({path:SP+'/q8.png'});
// jokes keep their scroll
await p.click('#nav button:has-text("Today")');await p.evaluate(()=>openSheet({mode:'more'}));await p.waitForTimeout(300);
const hs=await p.$('#sheetBody .hs');await hs.evaluate(e=>e.scrollLeft=e.scrollWidth);await p.waitForTimeout(100);const x0=await hs.evaluate(e=>e.scrollLeft);
const jk=await p.$$('#sheetBody .hs .joke');await jk[jk.length-1].click();await p.waitForTimeout(300);const x1=await p.$eval('#sheetBody .hs',e=>e.scrollLeft);console.log('joke row scroll before/after tap:',x0,x1,'| answer shown:',await p.$eval('#sheetBody .hs .joke:last-child',e=>!!e.querySelector('.a')));
await p.evaluate(()=>document.querySelector('#sheet').close());
// To do tab
await p.click('#nav button:has-text("Plan")');await p.click('.segmain [data-v="todo"]');await p.waitForTimeout(300);
console.log('plan tabs:',await p.$$eval('.segmain button',x=>x.map(e=>e.textContent).join(',')));
console.log('todo tab:',(await p.$eval('#main',e=>e.innerText)).replace(/\n+/g,' | ').slice(0,900));
await p.click('[data-act="tdadd"]');await p.waitForTimeout(100);await p.fill('#qa-t','Buy chart paper');await p.click('[data-act="qaddq"]');await p.waitForTimeout(300);
console.log('after add:',await p.$$eval('[data-act="tdtick"]',x=>x.length));await p.click('[data-act="tdtick"]');await p.waitForTimeout(200);console.log('ticked:',await p.evaluate(()=>S.todos.map(t=>t.title+':'+t.done)));
const pr=await p.$('[data-act="prep"]');if(pr){await pr.click();await p.waitForTimeout(200);console.log('prep ticked:',await p.evaluate(()=>Object.keys(S.prep).length))}
await p.screenshot({path:SP+'/q9.png'});
console.log('errors:',errs);await b.close()})();
