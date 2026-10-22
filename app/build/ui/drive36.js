// To finish: worksheets started/missed, projects underway, projects coming up.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T10:20:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
await p.evaluate(()=>{const u=unitBy('ncert|sci|3|4');for(let i=0;i<3;i++)logSession(u,"plan");setA(u.k+'#ws1','1-0',0);S.tasks[u.k+'#ws1']={ws:today};S.work=[{id:"img1",k:u.k,date:today,title:"Leaf drawing",name:"leaf.png",type:"image/png"},{id:"bad1",k:"",date:today,title:"Lost",name:"x.jpg"}];S.school={to:"Kendriya Vidyalaya",dob:"2018-05-02"};commit();
 const png=Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='),c=>c.charCodeAt(0)),of=window.fetch;window.fetch=async u=>String(u).includes("/_blob/img1")?new Response(new Blob([png],{type:"image/png"})):String(u).includes("/_blob/")?new Response("",{status:404}):of(u);
 SAMPLE={json:async(pr,o)=>{window._tp=(window._tp||[]).concat([pr]);window._tier=o.modelTier;const ks=[...pr.matchAll(/- (ncert\|\w+\|\d\|\d+) =/g)].map(m=>m[1]);return {questions:Array.from({length:12},(_,i)=>({q:"Question "+(i+1)+" in "+(pr.match(/syllabus for ([^,]+),/)||[])[1],opts:["w","x","y","z"],a:i%4,ch:ks[i%ks.length],skill:"recall",passage:i<2?"A short passage":""})).concat([{q:"bad",opts:["a","a","b","c"],a:0}])}}}});
await p.evaluate(()=>openSheet({mode:"school"}));await p.waitForTimeout(300);
await p.selectOption('#tsc','4');await p.waitForTimeout(200);
console.log('1. subjects:',await p.$$eval('[data-act="tsub"]',x=>x.map(e=>e.textContent)));
await p.click('[data-act="tsub"][data-s="hin"]');await p.selectOption('#tsn','10');await p.waitForTimeout(150);
await p.click('[data-act="tmake"]');await p.waitForTimeout(1200);
console.log('2. test:',await p.evaluate(()=>{const t=curTest();return JSON.stringify({b:t.board,c:t.cls,L:t.level,subs:t.subjects.map(x=>[x.s,x.qs.length,x.qs[0].opts.length]),tier:window._tier,ok:t.subjects.every(x=>x.qs.every(q=>q.opts[q.a]===["w","x","y","z"][[0,1,2,3][0]]||true))})}));
console.log('   prompt mentions class 3 syllabus:',await p.evaluate(()=>/Class 4/.test(window._tp[0])&&/Class 3 syllabus/.test(window._tp[0])));
// answer key integrity after shuffling: right option text preserved
console.log('   shuffle keeps answers:',await p.evaluate(()=>curTest().subjects.every(x=>x.qs.every((q,i)=>q.opts[q.a]===["w","x","y","z"][i%4]))));
await p.click('[data-act="tstart"]');await p.waitForTimeout(300);
console.log('3. intro:',(await p.$eval('#sheetBody',e=>e.innerText)).replace(/\n+/g,' / ').slice(0,160));
// take every subject: answer correct for even qs, wrong for odd, skip last
for(let si=0;si<3;si++){if(!await p.$('[data-act="tgo"]'))break;await p.click('[data-act="tgo"]');await p.waitForTimeout(150);
 const n=await p.evaluate(()=>curTest().subjects[ui.ex.si].qs.length);
 for(let i=0;i<n;i++){if(i<n-1){const a=await p.evaluate(i=>{const t=curTest(),q=t.subjects[ui.ex.si].qs[i];return i%2?(q.a+1)%4:q.a},i);await p.click(`[data-act="tans"][data-i="${a}"]`)}
  if(i===2&&si===0)await p.screenshot({path:SP+'/d36q.png'});
  if(i<n-1)await p.click('[data-act="tmove"][data-d="1"]');else{console.log('   fin label:',await p.$eval('[data-act="tfin"]',e=>e.textContent));await p.click('[data-act="tfin"]')}await p.waitForTimeout(40)}}
console.log('4. end:',(await p.$eval('#sheetBody',e=>e.innerText)).replace(/\n+/g,' / ').slice(0,120));
await p.click('[data-act="texit"]');await p.waitForTimeout(300);
console.log('5. result:',(await p.$eval('.exsec',e=>e.innerText)).replace(/\n+/g,' / ').slice(0,500));
for(const d of ['paper','cert','key','sheet']){const dl=p.waitForEvent('download',{timeout:3000}).catch(()=>null);await p.click(`[data-act="tdl"][data-d="${d}"]`);const D=await dl;if(D){await D.saveAs(SP+'/t_'+d+'.html');console.log('   '+d,require('fs').statSync(SP+'/t_'+d+'.html').size)}await p.waitForTimeout(200)}
console.log('6. bundle:',(await p.$$eval('.zrow',x=>x.map(e=>(e.querySelector('input').checked?'☑':'☐')+e.innerText.split('\n')[0]))).join(' | '));
await p.click('[data-act="zmake"]');await p.waitForTimeout(1500);
console.log('   made:',(await p.$eval('#sheetBody .pk:last-of-type',e=>e.innerText).catch(()=>'?')).replace(/\n+/g,' / ').slice(0,300));
const dl=p.waitForEvent('download',{timeout:3000}).catch(()=>null);await p.click('[data-act="zsave"]');const Z=await dl;if(Z){await Z.saveAs(SP+'/t_bundle.zip');console.log('   zip saved')}
console.log('   wa link:',await p.$eval('a[href^="https://wa.me"]',e=>decodeURIComponent(e.href).slice(0,160)));
await p.screenshot({path:SP+'/d36.png',fullPage:false});
console.log('errors:',errs);await b.close()})();
