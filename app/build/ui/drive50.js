const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T16:00:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
// profile card in Plan > Tell DeepKids
await p.evaluate(()=>{tab="week";ui.seg={...(ui.seg||{}),week:"tell"};render()});await p.waitForTimeout(200);
console.log('profile card:',await p.evaluate(()=>document.querySelectorAll('[data-act="plv"]').length),'level buttons');
const sci=await p.evaluate(()=>S.subjects.find(s=>/sci|evs/.test(s)));console.log('science subject',sci,await p.evaluate(s=>JSON.stringify(profOf(s)),sci));
await p.click(`[data-act="plv"][data-s="${sci}"][data-v="stretch"]`);await p.click(`[data-act="pdep"][data-s="${sci}"][data-v="challenge"]`);await p.waitForTimeout(150);
console.log('after taps',await p.evaluate(s=>JSON.stringify(profOf(s)),sci));
await p.locator(`[data-pauto="${sci}"]`).uncheck();console.log('auto off',await p.evaluate(s=>profOf(s).auto,sci));
// worksheets on a chapter: ranked by profile
const k=await p.evaluate(()=>DATA.rconcepts.find(c=>c.id==="plants").chapters.find(k=>k.startsWith("ncert|")));
const show=async()=>p.evaluate(k=>{const d=document.createElement('div');d.innerHTML=printSheets(unitByK(k));return [d.querySelector('.eyebrow')?.textContent,[...d.querySelectorAll('.pws b')].slice(0,3).map(x=>x.textContent).join(' / '),d.querySelectorAll('.pws').length,d.querySelector('p.xs')?.textContent]},k);
console.log(k,await show());
await p.evaluate(s=>{S.prof[s]={lvl:"gentle",depth:"explore",auto:true};save()},sci);console.log('gentle/explore',await show());
// another board's chapter on the same topic shares the sheets
console.log('other boards with plants sheets:',await p.evaluate(()=>DATA.rconcepts.find(c=>c.id==="plants").chapters.filter(k=>unitByK(k)&&wsOf(unitByK(k)).length).map(k=>k.split('|')[0]+' '+k.split('|')[2]+' '+k.split('|')[3]).join(', ')));
// print and preview via the chapter
await p.evaluate(k=>{openSheet({mode:"chapter",k})},k);await p.waitForTimeout(250);console.log('tabs',await p.evaluate(()=>[...document.querySelectorAll('#sheet [data-act="ctab"]')].map(b=>b.dataset.t).join(',')),'hub sheets',await p.locator('#sheet .pws').count());if(await p.locator('#sheet [data-act="ctab"][data-t="ws"]').count()){await p.click('#sheet [data-act="ctab"][data-t="ws"]');await p.waitForTimeout(200)}
const n=await p.locator('#sheet [data-act="wsview"]').count();console.log('preview buttons in chapter',n);
if(n){await p.locator('#sheet [data-act="wsview"]').first().click();await p.waitForTimeout(400);console.log('preview title',await p.textContent('#sheetTitle'))}
// auto-adjust: 12 recent answers, 11 right
await p.evaluate(([s,k])=>{S.prof[s]={lvl:"core",depth:"deep",auto:true};const real=lastAnswers;window.lastAnswers=()=>{const o={};for(let j=0;j<12;j++)o['q'+j]={k,d:'2026-10-2'+(j%3),r:j>0};return o};profAuto();window.lastAnswers=real},[sci,k]);
console.log('auto after 11/12 right:',await p.evaluate(s=>JSON.stringify(S.prof[s]),sci));
console.log('errors',errs);await b.close()})();
