const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://127.0.0.1:8765/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const ids=await p.evaluate(()=>Object.keys(DATA.units));
for(const id of ids){const r=await p.evaluate(async id=>{await fxOpen(id);const n=FXALL.sections.length;let cards=0;for(let i=0;i<n;i++){fxGo(i,0);cards+=document.querySelectorAll('#fxDlg .fxc').length}fxClose();return n+" parts, "+cards+" cards"},id);console.log(id,r)}
console.log('search simple machines:',await p.evaluate(()=>topicHits("lever").slice(0,3).map(u=>u.k).join(", ")));
console.log('errors:',errs.slice(0,5));await b.close()})();
