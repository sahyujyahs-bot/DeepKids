// To finish: worksheets started/missed, projects underway, projects coming up.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860},timezoneId:'Asia/Kolkata'});await ctx.clock.install({time:new Date('2026-10-23T10:20:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
// seed history
await p.evaluate(()=>{const u=unitBy('ncert|sci|3|4');for(let i=0;i<3;i++)logSession(u,"plan");S.log.forEach((l,i)=>{l.date=addDays(today,-i)});S.mins={[today+"|sci"]:42,[addDays(today,-1)+"|sci"]:35};S.pace=[{k:u.k,sec:"book",kind:"read",est:600,took:12,date:addDays(today,-2)}];
 setA(u.k+'#ws1','1-0',0);S.quiz={[u.k+"|3"]:{0:{q:"Q1",a:"A1",r:1,d:today},1:{q:"Q2",a:"A2",r:0,d:today}}};S.tasks[u.k+'#ws1']={ws:today};S.work=[{id:"old1",k:u.k,date:today,title:"old photo"}];commit()});
// migration of a v39-damaged S.work
await p.evaluate(()=>{S.work={0:{id:"p0",k:"",date:today,title:"photo"},"ncert|sci|3|4|e1":{st:"started",started:today,title:"Seeds"}};S.wk={};render()});
console.log('0. migrated:',await p.evaluate(()=>JSON.stringify({w:S.work.map(x=>x.id),wk:Object.keys(S.wk)})));
// tracking
await p.evaluate(()=>openSheet({mode:"track"}));await p.waitForTimeout(300);
console.log('1. tiles:',await p.$$eval('#sheetBody .tile',x=>x.map(e=>e.innerText.replace(/\n/g,' '))));
console.log('   bars:',await p.$$eval('#sheetBody .tcol',x=>x.filter(e=>e.querySelector('.tstack i')).map(e=>e.dataset.tip.replace(/\n/g,' | '))));
console.log('   day1:',(await p.$eval('#sheetBody .tday',e=>e.innerText)).replace(/\n+/g,' / ').slice(0,300));
await p.hover('#sheetBody .tcol:last-child');await p.waitForTimeout(100);console.log('   tip:',await p.$eval('#tip',e=>e.style.display+' '+e.textContent.replace(/\n/g,' | ')));
await p.screenshot({path:SP+'/d34a.png'});
// school
await p.evaluate(()=>openSheet({mode:"school"}));await p.waitForTimeout(300);
console.log('2. school:',(await p.$eval('#sheetBody',e=>e.innerText)).replace(/\n+/g,' / ').slice(0,700));
await p.screenshot({path:SP+'/d34b.png'});
const dl=p.waitForEvent('download',{timeout:3000}).catch(()=>null);await p.click('[data-act="tsave"]');const D=await dl;if(D){await D.saveAs(SP+'/transcript_test.html');console.log('   transcript',require('fs').statSync(SP+'/transcript_test.html').size)}else console.log('   no download');
// uploads with mocked assets + sample
await p.evaluate(()=>{let n=0;ASSETS={upload:async f=>({id:"a"+(++n),url:"/_blob/a"+n})};IMGOK=true;SAMPLE={json:async(pr,o)=>{window._pr=pr;window._imgs=(o.images||[]).length;return {items:[{i:1,k:"ncert|sci|3|4",kind:"drawing",title:"Leaf drawing with labels",tags:["leaves","plants"]},{i:2,k:"bogus|key",kind:"other",title:"Notes"}]}}}});
await p.evaluate(()=>openSheet({mode:"uploads"}));await p.waitForTimeout(200);
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==','base64');
await p.setInputFiles('#upFiles',[{name:'IMG_1.png',mimeType:'image/png',buffer:png},{name:'notes.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4')}]);await p.waitForTimeout(1500);
console.log('3. uploads:',await p.evaluate(()=>JSON.stringify(S.work.slice(-2).map(w=>({k:w.k,kind:w.kind,title:w.title,date:w.date})))),'imgs sent',await p.evaluate(()=>window._imgs));
console.log('   prompt has candidates:',await p.evaluate(()=>/Candidate chapters:\n  - ncert\|sci\|3\|4/.test(window._pr)));
console.log('   view:',(await p.$eval('#sheetBody',e=>e.innerText)).replace(/\n+/g,' / ').slice(0,300));
// assign chapter to the unmatched pdf
await p.selectOption('select[data-upk="a2"]','ncert|sci|3|4');await p.waitForTimeout(200);console.log('   a2 k:',await p.evaluate(()=>S.work.find(w=>w.id==="a2").k));
// calendar with mocked mcp
await p.evaluate(()=>{MCPT=true;MCP={describeTool:async()=>({inputSchema:{properties:{calendarId:{type:"string"},timeMin:{},timeMax:{},maxResults:{},singleEvents:{type:"boolean"},orderBy:{}}}}),callTool:async(s,t,inp)=>{window._calls=(window._calls||[]).concat([[t,inp]]);if(t==="list_calendars")return {payload:{calendars:[{id:"primary",summary:"Me",primary:true},{id:"kids",summary:"Kids"}]}};return {payload:JSON.stringify({events:[{id:"ev1",summary:"Swimming class",start:{dateTime:"2026-10-24T11:00:00+05:30"},end:{dateTime:"2026-10-24T12:00:00+05:30"}},{id:"ev2",summary:"Diwali",start:{date:"2026-11-08"},end:{date:"2026-11-09"}}]})}}}});
await p.evaluate(()=>openSheet({mode:"pl",p:"calendar"}));await p.waitForTimeout(200);await p.click('[data-act="gcsync"]');await p.waitForTimeout(600);
console.log('4. cal:',(await p.$eval('#sheetBody',e=>e.innerText)).replace(/\n+/g,' / ').slice(0,260));
console.log('   calls:',JSON.stringify(await p.evaluate(()=>window._calls)).slice(0,300));
console.log('   eventsOn sat:',await p.evaluate(()=>JSON.stringify(eventsOn("2026-10-24").map(e=>[e.title,e.start,e.end]))));
await p.click('[data-act="gccal"][data-id="kids"]');await p.waitForTimeout(500);console.log('   cals now',await p.evaluate(()=>JSON.stringify(S.cal.cals)),'calls',await p.evaluate(()=>window._calls.filter(c=>c[0]==="list_events").map(c=>c[1].calendarId).join(',')));
// errors path
await p.evaluate(()=>{MCP={describeTool:async()=>{throw {code:"not_in_manifest"}},callTool:async()=>{throw {code:"server_not_connected"}}};S.cal={on:false}});await p.evaluate(()=>openSheet({mode:"pl",p:"calendar"}));await p.click('[data-act="gcsync"]');await p.waitForTimeout(400);
console.log('5. err:',await p.$eval('#sheetBody .card p[style]',e=>e.textContent).catch(()=>'none'));
// dump chat
await p.evaluate(()=>{ui.dump={text:"Swimming",items:[{title:"Swimming",type:"class",keep:true}],questions:["Which days?","What time?"]};SAMPLE={json:async pr=>{window._dp=pr;return {items:[{title:"Swimming",type:"class",days:[2,4],start:"17:00"}],questions:[]}}};});
await p.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close())});await p.waitForTimeout(300);await p.click('#nav button:has-text("Planner")');await p.waitForTimeout(300);
const qa=await p.$$('.chat input[data-qa]');console.log('6. chat inputs:',qa.length);if(qa.length){await qa[0].fill('Tue and Thu');await qa[0].press('Enter');await p.waitForTimeout(500);console.log('   chat:',(await p.$eval('.chat',e=>e.innerText).catch(()=>'gone')).replace(/\n+/g,' / '),'| sent text has answer:',await p.evaluate(()=>/Which days\? Tue and Thu/.test(window._dp||"")))}
await p.screenshot({path:SP+'/d34c.png'});
console.log('errors:',errs);await b.close()})();
