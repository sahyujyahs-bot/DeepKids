// To finish: worksheets started/missed, projects underway, projects coming up.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T16:30:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const live=JSON.parse(require('fs').readFileSync(SP+'/live/state.json','utf8'));
await p.evaluate(L=>{S={...S,...L,acct:S.acct};commit()},live);
const dump=async(sel)=>p.$$eval(sel+' :is(h1,h2,h3,.menurow b,.qtile b,.sgrp summary b)',x=>x.map(e=>e.tagName[0]+':'+e.textContent.trim().replace(/\s+/g,' ').slice(0,40)).filter((v,i,a)=>a.indexOf(v)===i).join(' | '));
console.log('nav:',await p.$$eval('#nav button',x=>x.map(e=>e.textContent.trim()).join(' | ')));
for(const t of ["Today","Plan","Progress","Library"]){await p.click(`#nav button:has-text("${t}")`);await p.waitForTimeout(250);
 const segs=await p.$$eval('#main .segmain button',x=>x.map(e=>e.dataset.v));console.log('\n## '+t+(segs.length?' segs: '+segs.join(','):''));
 if(!segs.length){console.log(await dump('#main'));if(t==="Library")console.log(await p.$$eval('#main .seg button',x=>x.map(e=>e.textContent).join(' | ')),'|',await p.$eval('.segdesc',e=>e.textContent));continue}
 for(const sg of segs){await p.click(`#main .segmain [data-v="${sg}"]`);await p.waitForTimeout(250);console.log(' - '+sg+': '+(await dump('#main')).slice(0,420));await p.screenshot({path:SP+`/ia_${t}_${sg}.png`})}}
await p.click('#me');await p.waitForTimeout(300);console.log('\n## Settings: '+await dump('#sheetBody'),'| title:',await p.$eval('#sheetTitle',e=>e.textContent));await p.screenshot({path:SP+'/ia_settings.png'});
await p.evaluate(()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close()));await p.click('#nav button:has-text("Today")');await p.waitForTimeout(200);await p.click('.qtile[data-seg="time"]');await p.waitForTimeout(250);console.log('\ntile History ->',await p.evaluate(()=>tab+'/'+ui.seg.journey));
await p.click('#backTop');await p.waitForTimeout(250);console.log('back ->',await p.evaluate(()=>tab));
console.log('errors:',errs);await b.close()})();
