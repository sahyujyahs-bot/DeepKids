const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T09:00:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const t=async n=>(await p.$eval('#main',e=>e.innerText)).replace(/\n+/g,' | ').slice(0,n||300);
console.log('nav:',await p.$$eval('#nav button',x=>x.map(e=>e.innerText.trim()).join(',')));
// work state: EVS ch1 4 parts done, an activity started, a quiz fully answered, an experiment done
await p.evaluate(()=>{const k='ncert|sci|3|1',u=unitBy(k);S.progress[k]={...(S.progress[k]||{}),sessions:4,status:'learning'};S.log.push({key:k,date:'2026-10-20',n:1});WK()[k+'|'+u.c.p.activities[0].id]={st:'started',started:'2026-10-21'};
  const Q=quizQ(u,1);S.quiz=S.quiz||{};S.quiz[k+'|1']=Object.fromEntries(Q.map((q,i)=>[i,{q:q.q,a:q.a,r:1,d:'2026-10-21'}]));S.tasks[k]={[u.c.p.experiments[1].id]:'2026-10-22'};
  const m='ncert|math|3|1';S.progress[m]={sessions:8,status:'completed'};S.log.push({key:m,date:'2026-10-19',n:8});commit()});
await p.click('#nav button:has-text("Plan")');await p.waitForTimeout(200);console.log('plan tabs:',await p.$$eval('.segmain button',x=>x.map(e=>e.textContent).join(',')));
console.log('tell:',await t(260));
for(const v of ['cal','queue','pending','ongoing']){await p.click(`.segmain [data-v="${v}"]`);await p.waitForTimeout(200);console.log(v+':',(await t(420)).split('| Tell DeepKids | Calendar | Queue | Pending | Ongoing |')[1]?.slice(0,420))}
await p.click('.segmain [data-v="queue"]');await p.click('[data-act="tqt"][data-t="qz"]');await p.waitForTimeout(150);console.log('quiz queue all:',await p.$$eval('.qrow2',x=>x.length));
await p.click('[data-act="qf"][data-s="math"]');await p.waitForTimeout(150);console.log('quiz queue maths only:',await p.$$eval('.qrow2',x=>x.map(e=>e.innerText.split('\n')[2]).join(' / ')));
await p.click('[data-act="qf"][data-s="all"]');await p.waitForTimeout(150);
await p.click('[data-act="tqt"][data-t="les"]');await p.waitForTimeout(150);console.log('lessons queue has pace:',!!await p.$('[data-act="dkmin"]'),'| rows',await p.$$eval('.qrow2',x=>x.length));
// progress history
await p.click('#nav button:has-text("Progress")');await p.waitForTimeout(200);console.log('history:',await p.$eval('[data-act="hty"]',e=>e.closest('section').innerText.replace(/\n+/g,' | ').slice(0,600)));
await p.click('[data-act="hty"][data-t="qz"]');await p.waitForTimeout(100);console.log('  quizzes only:',await p.$eval('[data-act="hty"]',e=>e.closest('section').innerText.replace(/\n+/g,' | ').slice(-160)));
// today inline add
await p.click('#nav button:has-text("Today")');await p.waitForTimeout(200);await p.click('[data-act="quick"]');await p.waitForTimeout(200);console.log('today add inline:',!!await p.$('.qa-in #qa-t'),'| tab still',await p.evaluate(()=>tab));
await p.fill('#qa-t','Grocery run');await p.click('.qa-in [data-act="qaddq"]');await p.waitForTimeout(300);console.log('  added:',await p.evaluate(()=>JSON.stringify((S.todos||[]).concat(S.events||[]).map(x=>x.title))));
await p.screenshot({path:SP+'/q6.png'});
// more: jokes and games
await p.evaluate(()=>openSheet({mode:'more'}));await p.waitForTimeout(300);console.log('more has add form:',!!await p.$('#sheetBody #qa-t'));
await p.click('#sheetBody [data-act="morejg"]');await p.waitForTimeout(200);console.log('more jokes:',await p.$eval('#sheetBody [data-act="morejg"]',e=>e.closest('section').innerText.replace(/\n+/g,' | ').slice(0,500)));
await p.click('#sheetBody [data-act="morejg"]');await p.waitForTimeout(200);console.log('again:',await p.$eval('#sheetBody [data-act="morejg"]',e=>e.closest('section').innerText.replace(/\n+/g,' | ').slice(0,160)));
await p.screenshot({path:SP+'/q7.png'});
console.log('errors:',errs);await b.close()})();
