const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(800);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="combined"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
await p.evaluate(()=>{tab="library";ui.lt="topics";ui.bb="combined";ui.bl=3;render()});await p.waitForTimeout(300);
console.log('page wider than screen:',await p.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),'widest topic',await p.evaluate(()=>Math.max(...[...document.querySelectorAll('.topic')].map(t=>t.getBoundingClientRect().right))));
const el=await p.locator('.topic').first();await el.scrollIntoViewIfNeeded();await p.screenshot({path:SP+'/combined_list.png'});console.log('errors',errs);await b.close()})();
