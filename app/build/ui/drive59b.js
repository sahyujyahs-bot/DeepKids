const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2],W=+(process.argv[3]||360);const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:W,height:800}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(800);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="combined"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const check=async(name,fn)=>{await p.evaluate(fn);await p.waitForTimeout(250);const r=await p.evaluate(W=>{const over=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>W+1&&getComputedStyle(e).position!=='fixed'&&!e.closest('.seg,.hscroll,[style*="overflow-x"],.chips.scroll,.wsframe')});const top=over.filter(e=>![...e.children].some(c=>over.includes(c))).slice(0,5).map(e=>e.tagName+'.'+(e.className||'').toString().slice(0,30)+' "'+(e.innerText||'').slice(0,40).replace(/\s+/g,' ')+'" '+Math.round(e.getBoundingClientRect().right));return {sw:document.documentElement.scrollWidth,over:over.length,top}},W);console.log(name.padEnd(22),r.sw>W?'PAGE TOO WIDE '+r.sw:'ok',r.over,r.top.join(' | '))};
for(const l of [1,2,3,4,5])await check('library combined C'+l,`tab="library";ui.lt="topics";ui.bb="combined";ui.bl=${l};render()`);
for(const bd of ['ncert','cambridge','nios','waldorf','dk'])await check('library '+bd,`tab="library";ui.lt="topics";ui.bb="${bd}";render()`);
await check('library resources',`tab="library";ui.lt="science";render()`);
await check('today',`tab="today";render()`);
for(const s of ['tell','cal','todo','queue','pending','ongoing'])await check('plan '+s,`tab="week";ui.seg={...(ui.seg||{}),week:"${s}"};render()`);
await check('progress',`tab="journey";render()`);
for(const t of ['overview','days','ws','lab','voices','story','think','game','books']){await check('chapter '+t,`openSheet({mode:"chapter",k:"combined|sci|3|plants"});ui.ctab={...(ui.ctab||{}),["combined|sci|3|plants"]:"${t}"};renderSheet()`)}
console.log('errors',errs);await b.close()})();
