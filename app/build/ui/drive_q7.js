const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T08:00:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');await p.click('[data-ob="next"]');
console.log('subject step:',await p.$$eval('.choice',x=>x.map(e=>e.innerText.replace(/\n+/g,' · ')+(e.getAttribute('aria-pressed')==='true'?' [on]':''))));
for(let i=0;i<3;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
console.log('subjects:',await p.evaluate(()=>S.subjects.join(',')),'| levels',await p.evaluate(()=>JSON.stringify(S.levels)));
console.log('sci queue (no DK):',await p.evaluate(()=>plannedUnits('sci').slice(0,5).map(u=>u.board+':'+u.title.slice(0,20)).join(' / ')));
console.log('dks queue:',await p.evaluate(()=>plannedUnits('dks').slice(0,4).map(u=>u.title.slice(0,30)).join(' / ')));
for(const d of ['2026-10-23','2026-10-26','2026-10-27'])console.log(' plan',d,await p.evaluate(d=>dayPlan(d).filter(i=>i.kind==='lesson'||i.kind==='dkt').map(i=>clock(i.at)+' '+i.title.slice(0,46)).join(' | '),d));
await p.click('#nav button:has-text("Plan")');await p.click('.segmain [data-v="queue"]');await p.waitForTimeout(200);console.log('queue subject chips:',await p.$$eval('[data-act="qsub"]',x=>x.map(e=>e.textContent).join(',')));
await p.click('[data-act="qsub"][data-s="dks"]');await p.waitForTimeout(200);console.log('dks rows:',await p.$$eval('.qrow2',x=>x.length),'| pace card:',(await p.$eval('#hpd-dks',e=>e.closest('.card').innerText.replace(/\n+/g,' | ')).catch(()=>'none')).slice(0,200));
await p.screenshot({path:SP+'/q10.png'});
// Today focus / lesson card for dks
console.log('lesson dks:',await p.evaluate(()=>{const it=dayPlan(today).find(i=>i.s==='dks');if(!it)return 'none';const st=stepState(it);return st.length+' steps: '+st.map(x=>x.title).slice(0,4).join(' / ')}));
// library DK board
await p.click('#nav button:has-text("Library")');await p.click('[data-act="bb"][data-b="dk"]');await p.waitForTimeout(200);console.log('library dk:',(await p.$eval('#main',e=>e.innerText)).replace(/\n+/g,' | ').match(/Browse the syllabus.{0,260}/)?.[0]);
// migration of an existing family
await p.evaluate(()=>{S.subjects=["math","eng","hin","sci"];S.extra={sci:["dk|A3"]};S.next={sci:["dk|A3"]};delete S.dksMig;delete S.levels.dks;render()});await p.waitForTimeout(200);
console.log('migrated:',await p.evaluate(()=>JSON.stringify({subj:S.subjects,extra:S.extra,next:S.next,lv:S.levels.dks})),'| dks first:',await p.evaluate(()=>plannedUnits('dks')[0].title));
console.log('errors:',errs);await b.close()})();
