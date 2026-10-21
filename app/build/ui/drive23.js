// Mock artifact DB: valid doc paths have an even number of segments. Legacy planner holds yesterday's lessons.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-21T19:05:00')});
const legacy=require(SP+'/dbread4/data/users/me/planner.json');
await ctx.addInitScript(leg=>{const store=JSON.parse(localStorage.getItem('mockdb')||'null')||{"data/users/u1/planner":leg};const save=()=>localStorage.setItem('mockdb',JSON.stringify(store));
  const ok=p=>{if(p.split('/').length%2)throw new Error('invalid document path '+p)};
  const doc=p=>({get:async()=>{ok(p);return {exists:p in store,data:()=>p in store?JSON.parse(JSON.stringify(store[p])):undefined}},set:async v=>{ok(p);store[p]=JSON.parse(JSON.stringify(v));save()},onSnapshot:()=>()=>{}});
  window.claude={use:async n=>n==='db'?{doc}:n==='user'?{id:async()=>'u1'}:null};window.__db=store},legacy);
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='warning')errs.push(m.text())});
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(600);
await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','Sahyujyah');await p.click('[data-act="login"]');await p.waitForTimeout(800);
console.log('1. after login:',await p.textContent('.greetbar b').catch(()=>'(no greeting)'),'| log:',await p.evaluate(()=>S.log.map(l=>l.date+' '+l.title)),'| sync:',await p.evaluate(()=>syncMode));
console.log('   errs so far:',JSON.stringify(errs));await p.click('[data-act="tday"][data-d="-1"]');await p.waitForTimeout(300);
console.log('2. yesterday:',await p.textContent('.cal .xs.muted'),await p.$$eval('.cal .tr .m b',x=>x.map(e=>e.textContent)));
console.log('3. db docs:',await p.evaluate(()=>Object.keys(window.__db)));
await p.reload();await p.waitForTimeout(800);console.log('4. after reload log:',await p.evaluate(()=>S.log.length),'sync:',await p.evaluate(()=>syncMode));
console.log('errors:',JSON.stringify(errs));await b.close()})();
