// To finish: worksheets started/missed, projects underway, projects coming up.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T10:20:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const cal=async()=>p.$eval('.calt b, .cal h3, .cal b',e=>e.textContent).catch(()=>'?');
await p.click('#nav button:has-text("Today")');await p.waitForTimeout(200);await p.click('[data-act="tday"][data-d="1"]');await p.waitForTimeout(200);console.log('1. browsed:',await p.evaluate(()=>ui.tday));
await p.click('#nav button:has-text("Plan")');await p.waitForTimeout(200);await p.click('#nav button:has-text("Today")');await p.waitForTimeout(200);console.log('2. after tab away:',await p.evaluate(()=>ui.tday));
await p.click('[data-act="tday"][data-d="1"]');await p.waitForTimeout(150);await p.click('#nav button:has-text("Library")',{force:true});await p.waitForTimeout(150);await p.click('#backTop');await p.waitForTimeout(200);console.log('3. after back:',await p.evaluate(()=>tab+' '+ui.tday));
await p.click('[data-act="tday"][data-d="1"]');await p.waitForTimeout(150);
await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))});await p.clock.fastForward(30000);
await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'))});await p.waitForTimeout(200);console.log('4. after leaving app:',await p.evaluate(()=>ui.tday));
console.log('errors:',errs);await b.close()})();
