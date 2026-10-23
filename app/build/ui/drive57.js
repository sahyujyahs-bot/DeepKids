const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(800);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="waldorf"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
console.log('subjects',await p.evaluate(()=>S.subjects.join(',')));
await p.evaluate(()=>{tab="library";ui.lt="topics";ui.bb="combined";render()});await p.waitForTimeout(200);
console.log('combined browse:',await p.evaluate(()=>document.getElementById('main').innerText.match(/The Combined science ladder[^\n]*/)?.[0]));
console.log('rows',await p.locator('#main .topic').count(),'depth pills',await p.locator('#main :text("DeepKids depth")').count());
// add an NCERT science chapter from a Waldorf plan
await p.evaluate(()=>openSheet({mode:"chapter",k:"ncert|sci|3|4"}));await p.waitForTimeout(300);
const add=p.locator('#sheet [data-act="qpick"], #sheet [data-act="qput"]').first();console.log('add control present',await add.count());
if(await add.count()){await add.click();await p.waitForTimeout(200);const put=p.locator('#sheet [data-act="qput"]').last();if(await put.count()){await put.click();await p.waitForTimeout(300)}}
console.log('subjects now',await p.evaluate(()=>S.subjects.join(',')),'in sci queue',await p.evaluate(()=>plannedUnits("sci").some(u=>u.k==="ncert|sci|3|4")));
await p.evaluate(()=>{S.board="combined";tab="week";ui.seg={...(ui.seg||{}),week:"queue"};render()});await p.waitForTimeout(200);
console.log('queue note:',await p.evaluate(()=>(document.getElementById('main').innerText.match(/Science this year covers[^.]*\./)||[''])[0]));
console.log('errors',errs);await b.close()})();
