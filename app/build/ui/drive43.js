// To finish: worksheets started/missed, projects underway, projects coming up.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T10:20:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
await p.evaluate(()=>{S.events=[{id:"x1",title:"Tabla",kind:"class",who:"kid",start:"10:00",end:"11:00",rep:"weekly",days:[6]}];commit()});
await p.click('#me');await p.waitForTimeout(300);await p.evaluate(()=>document.querySelector('details.sgrp:has([data-act="dexport"])').open=true);
const dl=p.waitForEvent('download',{timeout:8000});await p.click('[data-act="dexport"]');const D=await dl;await D.saveAs(SP+'/t_export.zip');console.log('export',D.suggestedFilename());
await p.evaluate(()=>{S.events=[];commit()});p.once('dialog',d=>d.accept());await p.setInputFiles('#importFile',SP+'/t_export.zip');await p.waitForTimeout(800);console.log('imported events:',await p.evaluate(()=>S.events.map(e=>e.title).join(',')));
console.log('errors:',errs);await b.close()})();
