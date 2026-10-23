// To finish: worksheets started/missed, projects underway, projects coming up.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T04:00:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const live=JSON.parse(require('fs').readFileSync(SP+'/live/data/users/me/acct_919739815506.json','utf8'));
await p.evaluate(L=>{delete L.fixR1;S={...S,...L,acct:S.acct};commit()},live);await p.waitForTimeout(300);
console.log('1. events:',await p.evaluate(()=>JSON.stringify(S.events.map(e=>[e.title,e.kind,e.who,e.start,e.end,e.days]))));
console.log('   todos left:',await p.evaluate(()=>JSON.stringify(S.todos.map(t=>t.title))));
for(const d of ['2026-10-23','2026-10-26','2026-10-24']){console.log(' plan',d,await p.evaluate(d=>dayPlan(d).filter(i=>i.kind!=="brk").map(i=>clock(i.at)+' '+i.title+(i.sub?' ['+i.sub+']':'')).join(' | '),d))}
// a chat message about the nap, mocked Claude reply in the shape the new prompt asks for
await p.evaluate(()=>{SAMPLE={json:async pr=>{window._pr=pr;return {items:[{type:"rest",title:"Afternoon nap",who:"kid",days:[0,1,2,3,4,5,6],start:"16:00",end:"17:00"}],questions:[]}}};ui.dump={text:""}});
await p.click('#nav button:has-text("Plan")');await p.waitForTimeout(300);await p.fill('#dumpText','Liri naps 4pm to 5pm every day');await p.click('[data-act="dump"]');await p.waitForTimeout(400);
console.log('2. prompt lists routines:',await p.evaluate(()=>/id \w+: "Rest/.test(window._pr)&&/Science tuition/.test(window._pr)));
console.log('   parsed:',await p.$$eval('.parsed',x=>x.map(e=>e.innerText.replace(/\n/g,' '))));
await p.click('[data-act="dadd"]');await p.waitForTimeout(300);
console.log('   mon plan:',await p.evaluate(()=>dayPlan('2026-10-26').filter(i=>i.kind!=="brk").map(i=>clock(i.at)+' '+i.title).join(' | ')));
await p.click('[data-act="told"]');await p.waitForTimeout(300);
console.log('3. told:',(await p.$eval('#sheetBody',e=>e.innerText)).replace(/\n+/g,' / ').slice(0,900));
await p.click('[data-act="ted"][data-id]');await p.waitForTimeout(200);await p.fill('[data-evf="start"]','11:30');await p.dispatchEvent('[data-evf="start"]','change');await p.click('[data-act="evday"][data-d="6"]');await p.waitForTimeout(150);await p.click('[data-act="ted"][data-id=""]');await p.waitForTimeout(200);
console.log('   edited first:',await p.evaluate(()=>JSON.stringify(S.events.map(e=>[e.title,e.start,e.days]))));
await p.screenshot({path:SP+'/d35.png'});
// the now card at 4am
await p.click('#sheetClose').catch(()=>{});await p.click('#nav button:has-text("Today")');await p.waitForTimeout(300);
console.log('4. now card:',(await p.$eval('.now, .nowcard, [class*="now"]',e=>e.innerText).catch(()=>'?')).replace(/\n+/g,' / ').slice(0,200));
console.log('errors:',errs);await b.close()})();
