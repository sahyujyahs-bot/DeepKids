const { chromium } = require('/opt/node-tools/node_modules/playwright');const fs=require('fs');
(async()=>{const SP=process.argv[2],id=process.argv[3]||'plants|w1';const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(800);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const html=await p.evaluate(id=>{const t=id.split('|')[0],w=DATA.tws[t].find(x=>x.id===id),c=DATA.rconcepts.find(x=>x.id===t),u=unitByK(c.chapters.find(k=>unitByK(k)));return wsPage(w,u)},id);
const q=await ctx.newPage();await q.setContent(html);await q.waitForTimeout(300);const f=SP+'/book_'+id.replace(/\|/g,'_')+'.pdf';await q.pdf({path:f,format:'A4',printBackground:true});
const n=(fs.readFileSync(f).toString('latin1').match(/\/Type\s*\/Page[^s]/g)||[]).length;const exp=await p.evaluate(id=>{const t=id.split('|')[0];return DATA.tws[t].find(x=>x.id===id).pages.length+2},id);
console.log('pdf pages',n,'expected',exp);console.log('errors',errs);await b.close()})();
