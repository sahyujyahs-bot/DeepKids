// To finish: worksheets started/missed, projects underway, projects coming up.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T16:30:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const live=JSON.parse(require('fs').readFileSync(SP+'/live/state.json','utf8'));
await p.evaluate(L=>{S={...S,...L,acct:S.acct};setA('ncert|sci|3|2#ws1','0-0','x');commit()},live);await p.waitForTimeout(300);
await p.click('#nav button:has-text("Today")');await p.waitForTimeout(100);console.log('0. enter anim:',await p.evaluate(()=>document.getElementById('main').classList.contains('enter')));await p.waitForTimeout(800);
console.log('1. greet:',(await p.$eval('.greetbar',e=>e.innerText)).replace(/\n+/g,' / '),'| ring offset:',await p.$eval('.dring .rfg',e=>getComputedStyle(e).strokeDashoffset));
console.log('2. nudge:',(await p.$eval('.nudge-card',e=>e.innerText).catch(()=>'none')).replace(/\n+/g,' / '));
await p.evaluate(()=>document.querySelector('.nudge-card')?.scrollIntoView({block:"center"}));await p.waitForTimeout(200);await p.screenshot({path:SP+'/d41.png'});
await p.click('.nudge-card [data-act="rem"]');await p.waitForTimeout(300);
console.log('3. rem:',(await p.$eval('#sheetBody',e=>e.innerText)).replace(/\n+/g,' / ').slice(0,400));
console.log('   google:',decodeURIComponent(await p.$eval('a[href*="calendar.google.com"]',e=>e.href)).slice(0,330));
await p.click('[data-act="remday"][data-d="6"]');await p.fill('[data-remf="time"]','17:15');await p.dispatchEvent('[data-remf="time"]','change');await p.waitForTimeout(200);
console.log('   after edit:',decodeURIComponent(await p.$eval('a[href*="calendar.google.com"]',e=>e.href)).match(/dates=[^&]+|RRULE[^&]+/g).join(' '));
const dl=p.waitForEvent('download',{timeout:3000}).catch(()=>null);await p.click('[data-act="remics"]');const D=await dl;if(D){await D.saveAs(SP+'/t_rem.ics');console.log('   ics:\n'+require('fs').readFileSync(SP+'/t_rem.ics','utf8'))}else console.log('   no ics download');
await p.screenshot({path:SP+'/d41b.png'});
await p.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close())});await p.click('[data-act="nudgeoff"]');await p.waitForTimeout(200);console.log('4. after not now:',await p.$('.nudge-card')?'still':'hidden');
// monday 14:00, lesson in progress -> no nudge
await p.clock.setSystemTime(new Date('2026-10-26T14:00:00'));await p.evaluate(()=>{today=iso(new Date());render()});await p.waitForTimeout(200);console.log('5. mon 2pm nudge:',await p.$('.nudge-card')?'shown':'none','| free:',await p.evaluate(()=>freeNow()));
console.log('   slots:',await p.evaluate(()=>JSON.stringify(freeSlots(7).map(x=>x.d.slice(5)+' '+clock(x.at)))),'suggest',await p.evaluate(()=>suggestRemTime()));
// burst on finishing a worksheet-like action
await p.evaluate(()=>{const u=unitBy('ncert|sci|3|4');ui.ctab[u.k]="lab";openSheet({mode:"chapter",k:u.k})});await p.waitForTimeout(250);await p.click('#sheetBody .wkctl >> nth=0 >> [data-to="done"]');await p.waitForTimeout(150);console.log('6. burst:',await p.$eval('.burst',e=>e.textContent).catch(()=>'none'));
console.log('errors:',errs);await b.close()})();
