const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(800);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
console.log(await p.evaluate(()=>{const d=document.createElement('div');d.innerHTML=scienceTab();return d.querySelector('.seg').innerText.replace(/\s+/g,' ')}));
await p.evaluate(()=>{ui.rsj="math";const d=document.createElement('div');d.innerHTML=scienceTab();window._m=d.querySelectorAll('.rescard').length});console.log('maths cards shown',await p.evaluate(()=>window._m));
const k=await p.evaluate(()=>DATA.items.find(i=>i.board==="ncert"&&i.subj==="math"&&i.level===3).k);
await p.evaluate(k=>openSheet({mode:"chapter",k}),k);await p.waitForTimeout(300);
console.log('maths chapter tabs',await p.evaluate(()=>[...document.querySelectorAll('#sheet [data-act="ctab"]')].map(b=>b.textContent).join(' | ')));
if(await p.locator('#sheet [data-act="ctab"][data-t="res"]').count()){await p.click('#sheet [data-act="ctab"][data-t="res"]');await p.waitForTimeout(200);console.log('maths resources',await p.locator('#sheet .rescard').count(),'first:',(await p.locator('#sheet .rescard b').first().textContent()))}
console.log('errors',errs);await b.close()})();
