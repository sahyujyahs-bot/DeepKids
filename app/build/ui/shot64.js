const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
await p.evaluate(()=>fxOpenSong('gravity'));await p.waitForTimeout(300);await p.screenshot({path:SP+'/f64_gravity.png'});
console.log('audio ok:',await p.evaluate(()=>new Promise(r=>{const a=document.querySelector('.fxaudio');a.addEventListener('loadedmetadata',()=>r(a.duration));a.addEventListener('error',()=>r('err'));a.load()})));
await p.evaluate(()=>fxOpen('sci.forces.friction.L3'));await p.waitForTimeout(200);const i=await p.evaluate(()=>FXALL.sections.findIndex(s=>s.id==='song'));await p.evaluate(i=>fxGo(i,1),i);await p.waitForTimeout(400);await p.screenshot({path:SP+'/f64_song.png'});
console.log('errors:',errs);await b.close()})();
