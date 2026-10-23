// To finish: worksheets started/missed, projects underway, projects coming up.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T16:30:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const live=JSON.parse(require('fs').readFileSync(SP+'/live/state.json','utf8'));
await p.evaluate(L=>{S={...S,...L,acct:S.acct};commit()},live);await p.click('#nav button:has-text("Today")');await p.waitForTimeout(400);
console.log('1. est:',await p.$$eval('.est',x=>x.map(e=>e.textContent)));
console.log('mascots:',await p.$$eval('.mascot',x=>x.map(e=>e.tagName+' '+e.closest('section')?.className)));await p.click('.donecard .mascot',{force:true});await p.waitForTimeout(150);console.log('2. mascot tip:',await p.$eval('.burst',e=>e.textContent).catch(()=>'none'),await p.$eval('.donecard .mascot',e=>e.classList.contains('wig')));
// undo one item so ring is not full, then re-do it -> celebration once
await p.evaluate(()=>{delete S.tl[today+"|warm"];ui.ringP=undefined;render()});await p.waitForTimeout(100);const r1=await p.$eval('.dring b',e=>e.textContent);
await p.evaluate(()=>{S.tl[today+"|warm"]=Date.now();commit()});await p.waitForTimeout(900);console.log('3. ring',r1,'->',await p.$eval('.dring b',e=>e.textContent),'| confetti:',!!await p.$('canvas.confetti'),'| cel:',await p.evaluate(()=>JSON.stringify(S.cel)));
await p.evaluate(()=>{delete S.tl[today+"|warm"];render();S.tl[today+"|warm"]=Date.now();commit()});await p.waitForTimeout(700);console.log('   second time celebrates again?',await p.$$eval('canvas.confetti',x=>x.length));
console.log('errors:',errs);await b.close()})();
