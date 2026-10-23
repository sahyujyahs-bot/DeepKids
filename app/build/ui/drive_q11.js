const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860},acceptDownloads:true});await ctx.clock.install({time:new Date('2026-10-24T10:00:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const live=JSON.parse(require('fs').readFileSync(SP+'/live/state.json','utf8'));await p.evaluate(L=>{S={...S,...L,acct:S.acct,dksMig:0};commit()},live);await p.waitForTimeout(300);
console.log('lists:',await p.evaluate(()=>{const L=masteryLists();return Object.entries(L).map(([g,v])=>g+':'+v.map(u=>u.title.slice(0,18)).join(',')).join(' | ')}));
console.log('bank sizes:',await p.evaluate(()=>learnedUnits().map(u=>u.title.slice(0,14)+'='+qBank(u).length).join(', ')));
for(const d of ['2026-10-24','2026-10-25','2026-10-26'])console.log(' refresher',d,':',await p.evaluate(d=>{const r=rfPlan(d);return r?r.title+' | '+r.slots.map(s=>s.ty+(s.q?':'+s.q.kind:'')).join(',')+' | '+r.topics.map(t=>t.g).join(','):'none'},d));
console.log(' sat plan:',await p.evaluate(()=>dayPlan(today).map(i=>i.kind+':'+i.title.slice(0,40)).join(' || ')));
// today tile -> quick quiz
console.log('tiles:',await p.$$eval('#main .tile',x=>x.map(e=>e.innerText.replace(/\n+/g,' ')).join(' / ')).catch(()=>'-'));
await p.evaluate(()=>{ui.qrun=null;openSheet({mode:'quizz'})});await p.waitForTimeout(300);console.log('quiz setup:',(await p.$eval('#sheetBody',e=>e.innerText)).replace(/\n+/g,' | ').slice(0,700));
await p.click('[data-act="qzset"][data-key="n"][data-v="5"]');await p.click('[data-act="qzstart"]');await p.waitForTimeout(200);
for(let i=0;i<5;i++){const has=await p.$('#sheetBody .qcard [data-act="qans"][data-c]');if(has){await p.click(`#sheetBody .qcard [data-act="qans"][data-c="${i%2}"]`)}else{await p.click(`#sheetBody .qcard [data-act="qans"][data-r="${i%2}"]`)}await p.waitForTimeout(100);console.log('  q'+(i+1)+':',(await p.$eval('#sheetBody .qcard',e=>e.innerText.replace(/\n+/g,' · '))).slice(0,140));await p.click('[data-act="qznext"]');await p.waitForTimeout(100)}
console.log('result:',(await p.$eval('#sheetBody',e=>e.innerText)).replace(/\n+/g,' | ').slice(0,400));
console.log('saved runs:',await p.evaluate(()=>S.qzr.length+' / answers '+Object.keys(S.qa).length),'| lists now:',await p.evaluate(()=>{const L=masteryLists();return Object.entries(L).map(([g,v])=>g+':'+v.length).join(' ')}));
// timed quiz
await p.click('[data-act="qzagain"]');await p.click('[data-act="qzset"][data-key="by"][data-v="m"]');await p.click('[data-act="qzset"][data-key="m"][data-v="5"]');await p.click('[data-act="qzstart"]');await p.waitForTimeout(200);console.log('timed:',await p.$eval('#qzleft',e=>e.textContent));
await ctx.clock.fastForward(301000);await p.waitForTimeout(1500);console.log('after 5 min:',(await p.$eval('#sheetBody',e=>e.innerText)).replace(/\n+/g,' | ').slice(0,120));
await p.evaluate(()=>{ui.qrun=null;document.querySelector('#sheet').close()});
// refresher view
await p.evaluate(()=>openSheet({mode:'refresh',date:today}));await p.waitForTimeout(300);console.log('refresher view:',(await p.$eval('#sheetBody',e=>e.innerText)).replace(/\n+/g,' | ').slice(0,700));
const rq=await p.$('#sheetBody .qcard [data-act="qans"]');if(rq){await rq.click();await p.waitForTimeout(200);console.log('  answered in refresher:',await p.evaluate(()=>JSON.stringify(S.rfa)))}
// settings
await p.evaluate(()=>openSheet({mode:'rfset'}));await p.waitForTimeout(300);console.log('rfset:',(await p.$eval('#sheetBody',e=>e.innerText)).replace(/\n+/g,' | ').slice(0,600));
await p.click('[data-act="rfmix"][data-g="not"][data-t="think"][data-d="10"]');await p.selectOption('[data-rfe="grasped"]','2');await p.waitForTimeout(200);console.log('  rfs:',await p.evaluate(()=>JSON.stringify(S.rfs)));
await p.evaluate(()=>document.querySelector('#sheet').close());
// day times
await p.click('#nav button:has-text("Plan")');await p.click('.segmain [data-v="tell"]');await p.waitForTimeout(200);
await p.click('[data-act="dts"][data-s="w6"]');await p.waitForTimeout(150);await p.fill('[data-dt="start"]','11:00');await p.dispatchEvent('[data-dt="start"]','change');await p.waitForTimeout(150);
console.log('sat start:',await p.evaluate(()=>Dd('2026-10-31').start+' | fri '+Dd('2026-10-30').start),'| card:',(await p.$eval('[data-act="dtreset"]',e=>e.textContent).catch(()=>'-')));
await p.evaluate(()=>{ui.dts='d:2026-10-30';render()});await p.waitForTimeout(100);await p.fill('[data-dt="lunch"]','14:00');await p.dispatchEvent('[data-dt="lunch"]','change');await p.waitForTimeout(150);
console.log('date override lunch:',await p.evaluate(()=>Dd('2026-10-30').lunch+' other fri '+Dd('2026-11-06').lunch));
await p.screenshot({path:SP+'/q12.png'});
// transcript
console.log('transcript has quizzes:',await p.evaluate(()=>/Quizzes and refreshers/.test(transcriptDoc())&&/Questions and answers/.test(transcriptDoc())));
console.log('errors:',errs);await b.close()})();
