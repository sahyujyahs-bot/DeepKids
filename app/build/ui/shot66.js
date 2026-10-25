const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
console.log('search card:',await p.evaluate(()=>{ui.tq="friction";return topicsTab().includes('data-act="fxopen"')}));
console.log('chapter banner:',await p.evaluate(()=>{const u=allUnits().find(x=>/friction/i.test(x.title)&&true);if(!u)return "no cam chapter";ui.sheet={mode:"chapter",k:u.k};return u.title+" -> "+chapterView().includes('data-act="fxopen"')}));
console.log('errors:',errs);await b.close()})();
