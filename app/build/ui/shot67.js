const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
console.log('search hits:',await p.evaluate(()=>topicHits("friction").map(u=>u.k).join(", ")));
console.log('related via unitByK:',await p.evaluate(()=>!!unitByK("unit|sci.forces.friction.L3")));
await p.click('#nav button:has-text("Library")');await p.waitForTimeout(300);
await p.evaluate(()=>{ui.tq="friction";render()});await p.waitForTimeout(300);
const row=await p.$('[data-act="chapter"][data-k="unit|sci.forces.friction.L3"]');console.log('row in Library search:',!!row);
if(row){await row.scrollIntoViewIfNeeded();await p.screenshot({path:SP+'/f67_search.png'});await row.click();await p.waitForTimeout(400);console.log('feed opened:',await p.evaluate(()=>document.getElementById('fxDlg')?.open||false))}
await p.keyboard.press('Escape');await p.waitForTimeout(200);
console.log('cam chapter banner:',await p.evaluate(()=>{ui.sheet={mode:"chapter",k:"cam|sci|3|6"};return chapterView().includes('data-u="sci.forces.friction.L3"')}));
console.log('board browse leaks unit board:',await p.evaluate(()=>allUnits().filter(u=>u.board==="unit").length+" unit items; boardsOn="+boardsOn().join(",")));
console.log('errors:',errs);await b.close()})();
