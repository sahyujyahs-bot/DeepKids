// To finish: worksheets started/missed, projects underway, projects coming up.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T16:00:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
await p.evaluate(()=>{SAMPLE=null;IMGOK=false;render()});
await p.click('#nav button:has-text("Plan")');await p.waitForTimeout(300);
console.log('1. photo button:',await p.$eval('.composer .locked',e=>e.getAttribute('aria-label')).catch(()=>'none'));
await p.click('.composer .locked');await p.waitForTimeout(300);console.log('   opens:',await p.$eval('#sheetTitle',e=>e.textContent),'|',(await p.$eval('#sheetBody',e=>e.innerText)).split('\n').slice(0,3).join(' / '));
await p.click('[data-act="texit"]');await p.waitForTimeout(200);
const long="So basically Liri has this thing with her cousins most weekends, sometimes at nani's place, and the music teacher said she might shift the class to the evening slot after Diwali, also swimming Tue and Thu 5 to 6 pm and we need to figure out the dentist thing soon because her tooth has been bothering her for a week now";
await p.fill('#dumpText',long);await p.click('.composer .send');await p.waitForTimeout(300);
console.log('2. found:',await p.$$eval('.parsed b',x=>x.map(e=>e.textContent)),'| needAI card:',await p.$eval('.needai',e=>e.innerText.replace(/\n/g,' ')).catch(()=>'none'));
console.log('   kept:',await p.evaluate(()=>!!S.pendAI&&S.pendAI.text.length));
await p.click('.needai [data-act="plus"]');await p.waitForTimeout(300);console.log('3. plus sheet shows kept msg:',await p.$eval('#sheetBody .ask',e=>e.innerText.slice(0,60)).catch(()=>'none'));
await p.click('[data-act="plusgo"]');await p.waitForTimeout(300);console.log('   waitlist:',await p.evaluate(()=>!!S.plusWait),await p.$eval('[data-act="plusgo"]',e=>e.textContent));
// simulate an upgrade succeeding: platform upgrade + Claude available afterwards
await p.evaluate(()=>{window.DK_PLATFORM={upgrade:async()=>true};const fake={json:async pr=>{window._aiPr=pr;return {items:[{type:"class",title:"Swimming",who:"kid",days:[2,4],start:"17:00",end:"18:00"},{type:"todo",title:"Dentist visit for Liri",who:"you",date:null}],questions:["When is the music class now?"]}},limits:async()=>({images:true})};window.claude={use:async n=>n==="sample"?fake:null};render()});
await p.evaluate(()=>openSheet({mode:"plus",r:"chat"}));await p.waitForTimeout(200);await p.click('[data-act="plusgo"]');await p.waitForTimeout(900);
console.log('4. after upgrade: tab',await p.evaluate(()=>tab),'| AI read the kept message:',await p.evaluate(()=>/cousins most weekends/.test(window._aiPr||'')),'| items:',await p.$$eval('.parsed b',x=>x.map(e=>e.textContent)),'| pending cleared:',await p.evaluate(()=>!S.pendAI),'| photo btn unlocked:',!!await p.$('.composer label.cbtn'));
await p.screenshot({path:SP+'/d45.png'});console.log('errors:',errs);await b.close()})();
