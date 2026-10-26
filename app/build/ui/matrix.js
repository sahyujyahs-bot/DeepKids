const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});const out=[];
 // phone check
 {const ctx=await b.newContext({viewport:{width:400,height:860}}),p=await ctx.newPage();await p.goto('http://127.0.0.1:8765/app_prev.html');await p.waitForTimeout(500);
  for(const n of ['0000000000','1234567890','98765 4321','+91 81234 56789']){await p.fill('#lgPhone',n);await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(400);const ok=await p.evaluate(()=>!document.getElementById('lgPhone'));out.push(`phone "${n}": ${ok?'accepted':'rejected'}`);if(ok)break}
  await ctx.close()}
 for(const board of ['combined','ncert','cambridge','nios','waldorf'])for(const age of [6,8,10]){const ctx=await b.newContext({viewport:{width:400,height:860}}),p=await ctx.newPage(),errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,120)));
  try{await p.goto('http://127.0.0.1:8765/app_prev.html');await p.waitForTimeout(400);await p.fill('#lgPhone','81234 5678'+age%10);await p.fill('#lgName','P');await p.click('[data-act="login"]');await p.waitForTimeout(500);
   await p.fill('#obName','Kid');await p.click(`[data-age="${age}"]`);await p.click('[data-ob="next"]');await p.waitForTimeout(200);if(['ncert','cambridge','nios'].includes(board)){await p.click('[data-obtrack="board"]');await p.waitForTimeout(150);if(board!=='ncert'){await p.click('[data-obb="'+board+'"]');await p.waitForTimeout(100);await p.click('[data-obb="ncert"]');await p.waitForTimeout(100)}}else await p.click(`[data-b="${board}"]`).catch(()=>errs.push('no board chip '+board));
   for(let i=0;i<8;i++){const n=await p.$('[data-ob="next"],[data-ob="done"],[data-ob="finish"]');if(!n)break;await n.click();await p.waitForTimeout(250)}
   const r=await p.evaluate(()=>{const o={};o.setup=!!S.setup;o.board=S.board;o.levels=JSON.stringify(S.levels);o.subj=S.subjects.join('');
     let n=0,late=0;for(let i=0;i<7;i++){const d=addDays(today,i),P=dayPlan(d);n+=P.filter(x=>x.kind==='lesson').length;late+=P.filter(x=>x.anytime&&x.kind==='lesson').length}o.lessons7=n;o.late=late;
     o.sched=S.subjects.map(s=>s+':'+schedule(s,30).length).join(' ');try{gamesView();o.games='ok'}catch(e){o.games='ERR '+e.message.slice(0,60)}
     try{ui.sheet={mode:'refresh',date:today};refreshView();o.rf='ok'}catch(e){o.rf='ERR '+e.message.slice(0,60)}
     try{fxWeekList();fxCoverageNote();o.lists='ok'}catch(e){o.lists='ERR '+e.message.slice(0,60)}return o});
   for(const t of ['Today','Plan','Progress','Library']){await p.click(`#nav button:has-text("${t}")`).catch(()=>errs.push('no tab '+t));await p.waitForTimeout(300)}
   const segs=await p.evaluate(()=>[...document.querySelectorAll('[data-act="seg"]')].map(x=>x.dataset.v));await p.click('#nav button:has-text("Plan")');await p.waitForTimeout(200);
   for(const v of await p.evaluate(()=>[...document.querySelectorAll('[data-act="seg"]')].map(x=>x.dataset.v))){await p.click(`[data-act="seg"][data-v="${v}"]`).catch(()=>{});await p.waitForTimeout(150)}
   out.push(`${board} age ${age}: ${JSON.stringify(r)} errors=${errs.length?errs.slice(0,3).join(' | '):'none'}`)}catch(e){out.push(`${board} age ${age}: TEST FAILED ${e.message.slice(0,100)} errs=${errs.slice(0,2)}`)}
  await ctx.close()}
 console.log(out.join('\n'));await b.close()})();
