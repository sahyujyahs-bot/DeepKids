// Done times are the real times things were done; extra lessons show their day number and real time; saved in the account doc.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-21T09:00:00')});
await ctx.addInitScript(()=>{const store=JSON.parse(localStorage.getItem('mockdb')||'{}');const save=()=>localStorage.setItem('mockdb',JSON.stringify(store));const ok=p=>{if(p.split('/').length%2)throw new Error('bad path '+p)};
  const doc=p=>({get:async()=>{ok(p);return {exists:p in store,data:()=>p in store?JSON.parse(JSON.stringify(store[p])):undefined}},set:async v=>{ok(p);store[p]=JSON.parse(JSON.stringify(v));save()},onSnapshot:()=>()=>{}});
  window.claude={use:async n=>n==='db'?{doc}:n==='user'?{id:async()=>'u1'}:null};window.__db=store});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const finishLesson=async()=>{await p.evaluate(()=>playItem(dayPlan(today).find(i=>i.kind==="lesson"&&!i.done)));await p.waitForTimeout(200);for(let i=0;i<10;i++){const d=p.locator('#sheetBody [data-act="pdone"]');if(!await d.count())break;await d.click()}await p.click('#sheetBody [data-act="finish"]');await p.waitForTimeout(300)};
await ctx.clock.runFor(0);await ctx.clock.setFixedTime(new Date('2026-10-21T10:12:00'));await p.click('[data-act="tlcheck"][data-id="warm"]').catch(()=>{});
await ctx.clock.setFixedTime(new Date('2026-10-21T11:05:00'));await finishLesson();
await ctx.clock.setFixedTime(new Date('2026-10-21T18:40:00'));await p.evaluate(()=>{const s=S.subjects[0];ui.more[s]=true;render()});await p.waitForTimeout(200);await finishLesson();
await p.evaluate(()=>{ui.showDone=true;render()});await p.waitForTimeout(200);
console.log('done rows:',JSON.stringify(await p.$$eval('.tr.done',x=>x.map(r=>r.querySelector('.t').textContent.trim()+' | '+r.querySelector('.m b').textContent+' | '+r.querySelector('.m span').textContent))));
await p.evaluate(()=>saveNow());await p.waitForTimeout(200);console.log('log saved in account doc:',JSON.stringify(await p.evaluate(()=>{const d=window.__db['data/users/u1/acct_919876543210'];return d&&d.log.map(l=>[l.title,'day '+l.n,Math.floor(l.at/60)+':'+String(l.at%60).padStart(2,'0')])})));
await p.click('#me');await p.waitForTimeout(200);await p.click('[data-act="checksaved"]');await p.waitForTimeout(300);console.log('check saved:',(await p.textContent('#sheetBody section.card')).replace(/\s+/g,' ').slice(0,420));await p.screenshot({path:SP+'/s14_saved.png'});console.log('errors:',JSON.stringify(errs));await b.close()})();
