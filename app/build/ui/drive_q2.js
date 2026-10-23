const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T16:00:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');console.log('class suggested for 8:',await p.$eval('[data-cls][aria-pressed="true"]',e=>e.textContent));
await p.click('[data-cls="2"]');console.log('picked:',await p.$eval('[data-cls][aria-pressed="true"]',e=>e.textContent),'| name kept:',await p.inputValue('#obName'));await p.screenshot({path:SP+'/q3.png'});
await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
console.log('levels:',await p.evaluate(()=>JSON.stringify(S.levels)),'| first maths in queue:',await p.evaluate(()=>plannedUnits('math').slice(0,2).map(u=>u.book+' '+u.title).join(' / ')));
const add=async k=>{await p.evaluate(k=>{document.querySelector('#sheet').open&&document.querySelector('#sheet').close();openSheet({mode:'chapter',k})},k);await p.waitForTimeout(300);
  const bt=await p.$$eval('#sheetBody [data-act]',x=>x.map(e=>e.dataset.act+':'+e.textContent.trim().slice(0,28)).filter(t=>/qadd|qnext|gotab|Next up|plan/i.test(t)));
  const q=await p.$('#sheetBody [data-act="qadd"]');if(q){await q.click();await p.waitForTimeout(300)}
  console.log(k,'| before:',bt,'| toast:',await p.$eval('.toast',e=>e.innerText).catch(()=>'-'),'| after:',await p.$eval('#sheetBody .pill.completed',e=>e.innerText).catch(()=>'-'))};
const ks=await p.evaluate(()=>[DATA.items.find(i=>i.board==='cambridge'&&i.subj==='sci'&&i.level===4).k,DATA.items.find(i=>i.board==='ncert'&&i.subj==='math'&&i.level===1).k,DATA.items.find(i=>i.board==='ncert'&&i.subj==='math'&&i.level===4).k]);
for(const k of ks)await add(k);
console.log('maths queue:',await p.evaluate(()=>plannedUnits('math').slice(0,6).map((u,i)=>(i+1)+' '+u.board+' c'+u.level+' '+u.title).join(' | ')));
console.log('sci queue:',await p.evaluate(()=>plannedUnits('sci').slice(0,4).map((u,i)=>(i+1)+' '+u.board+' c'+u.level+' '+u.title).join(' | ')));
console.log('dupes:',await p.evaluate(()=>['math','sci'].map(s=>{const k=plannedUnits(s).map(u=>u.k);return k.length-new Set(k).size})));
await p.evaluate(()=>{tab='today';render()});await p.waitForTimeout(300);console.log('today ok:',(await p.$eval('#main',e=>e.innerText)).slice(0,80).replace(/\n/g,' '));
console.log('errors:',errs);await b.close()})();
