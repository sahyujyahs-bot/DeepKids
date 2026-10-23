const { chromium } = require('/opt/node-tools/node_modules/playwright');const fs=require('fs');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});const p=await ctx.newPage();
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(800);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const all=await p.evaluate(()=>Object.entries(DATA.pws).flatMap(([k,L])=>L.map(w=>[w.id,wsPage(w,unitByK(k))])));const q=await ctx.newPage();const over=[];
for(const [id,html] of all){await q.setContent(html);const buf=await q.pdf({format:'A4',printBackground:true});const n=(buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g)||[]).length;const exp=html.includes('wkey')?2:1;if(n>exp)over.push(id+':'+n)}
console.log('over one page + key:',over.join(' ')||'none','of',all.length);await b.close()})();
