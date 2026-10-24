const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2],W=+(process.argv[3]||360);const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:W,height:800}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(800);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="combined"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const wide=async(name)=>{const r=await p.evaluate(W=>{const over=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>W+1&&getComputedStyle(e).position!=='fixed'&&!e.closest('.seg,.hscroll,[style*="overflow-x"],.chips.scroll,.wsframe')});return {sw:document.documentElement.scrollWidth,over:over.length}},W);console.log(name.padEnd(28),r.sw>W?'PAGE TOO WIDE '+r.sw:'ok',r.over)};
const go=async(k,t)=>{await p.evaluate(([k,t])=>{openSheet({mode:"chapter",k});ui.ctab={...(ui.ctab||{}),[k]:t};renderSheet()},[k,t]);await p.waitForTimeout(250)};
// a Combined lesson
await go("combined|sci|3|plants","overview");console.log('tabs:',await p.evaluate(()=>[...document.querySelectorAll('#sheet [data-act="ctab"],#sheet .seg button,#sheet [data-t]')].map(b=>b.innerText).filter(Boolean).slice(0,20).join(' | ')));
await go("combined|sci|3|plants","nb");await wide('combined plants nb');console.log((await p.evaluate(()=>document.getElementById('sheetBody').innerText)).slice(0,700).replace(/\n+/g,' / '));
await go("combined|sci|4|the-universe-sun-moon-stars-and-planets","nb");await wide("universe C4 nb");
await p.click('[data-act="nbg"][data-g="5"]');await p.waitForTimeout(200);console.log('class5 pressed:',await p.evaluate(()=>document.querySelector('[data-act="nbg"][data-g="5"]')?.getAttribute('aria-pressed')));
// board chapters with a topic
const ks=await p.evaluate(()=>Object.keys(DATA.notebook.chap).slice(0,60));let n=0;for(const k of ks){const has=await p.evaluate(k=>{const u=unitByK(k);return !!(u&&nbOf(u))},k);if(has){n++;if(n<=3){await go(k,"nb");await wide('board '+k)}}}console.log('board chapters with notebook tab:',n,'of',ks.length);
// gravity topic (force cards) via any combined forces rung
await go("combined|sci|3|forces-and-movement","nb");await wide('forces C3 nb');console.log("force cards:",await p.evaluate(()=>[!!unitByK("combined|sci|3|forces-and-movement"),!!DATA.notebook.topics["forces-and-movement"].force_cards]),await p.evaluate(()=>document.body.innerText.includes('Escape Gravity force cards')));
// deck
await p.evaluate(()=>openSheet({mode:"scideck"}));await p.waitForTimeout(300);await wide('sci deck');const pk=await p.evaluate(()=>[...document.querySelectorAll('[data-act="scip"]')].map(b=>b.dataset.p));console.log('packs',pk.length,pk.join(', '));
await p.click(`[data-act="scip"][data-p="${pk[3]}"]`);await p.waitForTimeout(200);console.log('cards shown',await p.evaluate(()=>document.querySelectorAll('.scard').length));
const doc=await p.evaluate(()=>sciPrintDoc(Object.keys(DATA.notebook.sci).slice(0,9),"Test"));console.log('print doc length',doc.length,doc.includes('pc'));
// library button
await p.evaluate(()=>{ui.sheet=null;document.getElementById("sheet")?.close?.();tab="library";ui.lt="topics";ui.bb="combined";ui.bl=3;render()});await p.waitForTimeout(250);await wide('library combined');console.log('deck button in library',await p.evaluate(()=>!!document.querySelector('#app [data-act="scideck"], main [data-act="scideck"], [data-act="scideck"]')));
const pg=await ctx.newPage();await pg.setContent(doc);await pg.pdf({path:'/tmp/claude-0/-home-user/19592352-17e5-5d4c-8f59-ec21b7793c21/scratchpad/scicards.pdf',format:'A4'});
await go("combined|sci|3|plants","nb");await p.screenshot({path:'/tmp/claude-0/-home-user/19592352-17e5-5d4c-8f59-ec21b7793c21/scratchpad/nb_'+W+'.png',fullPage:false});
console.log('errors',errs);await b.close()})();
