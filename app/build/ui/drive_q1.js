const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T16:00:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
await p.click('#nav button:has-text("Library")');await p.waitForTimeout(300);

const show=async l=>{console.log(l,'| title:',await p.$eval('#sheetTitle',e=>e.textContent).catch(()=>'-'),'| btns:',await p.$$eval('#sheetBody [data-act]',x=>x.map(e=>e.dataset.act+':'+e.textContent.trim().slice(0,32)).filter(t=>/plan|queue|next|add|pipe|start/i.test(t))))};
await p.click('[data-act="chapter"] >> nth=3');await p.waitForTimeout(400);await show('NCERT ch4');
await p.evaluate(()=>document.querySelector('#sheet').close());await p.waitForTimeout(200);
await p.click('[data-act="bb"]:has-text("DeepKids Plus")');await p.waitForTimeout(300);
console.log('dk list:',(await p.$eval('#main',e=>e.innerText)).slice(300,700));
await p.click('[data-act="chapter"] >> nth=0').catch(e=>console.log('no chapter btn'));await p.waitForTimeout(400);await show('DK topic');
const q=await p.$('#sheetBody [data-act="qadd"]');if(q){await q.click();await p.waitForTimeout(400);console.log('toast:',await p.$eval('.toast',e=>e.innerText).catch(()=>'-'));await show('after add');await p.click('#sheetBody [data-act="gotab"]');await p.waitForTimeout(400);console.log('now on:',await p.evaluate(()=>tab+'/'+seg('week')+'/'+ui.qs),'| queue:',await p.$$eval('.qrow',x=>x.map(e=>e.innerText.replace(/\n/g,' ').slice(0,60))));await p.screenshot({path:SP+'/q2.png'});console.log('extra:',await p.evaluate(()=>JSON.stringify(S.extra)))}
console.log('errors:',errs);await b.close()})();
