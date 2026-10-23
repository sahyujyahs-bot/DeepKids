const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T16:00:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="'+(process.argv[3]||'6')+'"]');await p.click('[data-ob="next"]');await p.click('[data-b="combined"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const info=await p.evaluate(()=>({board:S.board,subjects:S.subjects,levels:S.levels,sci:plannedUnits("sci").slice(0,14).map(u=>u.board+' '+u.title),math:plannedUnits("math").slice(0,3).map(u=>u.board+' '+u.title)}));console.log(JSON.stringify(info,null,1));
const k=process.argv[4]||await p.evaluate(()=>plannedUnits("sci").find(u=>u.board==="combined")?.k);console.log('combined unit',k);
await p.evaluate(k=>openSheet({mode:"chapter",k}),k);await p.waitForTimeout(300);
console.log('tabs',await p.evaluate(()=>[...document.querySelectorAll('#sheet [data-act="ctab"]')].map(b=>b.textContent).join(' | ')));
console.log('overview has builds-on:',await p.locator('#sheet :text("Builds on")').count(),' ready:',await p.locator('#sheet :text("Ready for every board")').count());
for(const t of ['think','game','books','days','lab','voices']){await p.click(`#sheet [data-act="ctab"][data-t="${t}"]`);await p.waitForTimeout(150);console.log(t,'→',(await p.textContent('#sheetBody').catch(()=>p.textContent('#sheet'))).replace(/\s+/g,' ').slice(0,230))}
await p.click(`#sheet [data-act="ctab"][data-t="game"]`);await p.waitForTimeout(100);await p.click('#sheet [data-act="cgview"]');await p.waitForTimeout(400);console.log('preview title',await p.textContent('#sheetTitle'));
const html=await p.evaluate(k=>wsPage(gameSheet(unitByK(k)),unitByK(k)),k);const q=await ctx.newPage();await q.setContent(html);await q.waitForTimeout(150);const buf=await q.pdf({path:SP+'/game_'+(process.argv[3]||'6')+'.pdf',format:'A4',printBackground:true});console.log('game pdf pages',(buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g)||[]).length);
// today's plan uses it
console.log('today:',await p.evaluate(()=>{tab="today";render();return document.getElementById('main').innerText.replace(/\s+/g,' ').slice(0,300)}));
console.log('errors',errs);await b.close()})();
