// To finish: worksheets started/missed, projects underway, projects coming up.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-23T16:00:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
await p.evaluate(()=>{SAMPLE=null;S.events=[{id:"t1",title:"Science tuition",kind:"class",who:"kid",start:"11:00",end:"12:00",rep:"weekly",days:[1,2,3,4,5]}];commit()});
const cases=["Swimming at 7","Swimming every Tue and Thu 5 to 6 pm","Tabla Saturday 10am","Dentist next Friday 4pm","Liri naps 4 to 5 every day","Rest for 1 hour after tuition every day","Buy a geometry box","We have a microscope, Ludo and a globe","Grandma visiting on 5 Nov","Karate Mon Wed 6pm. Piano on Sundays at 11","Lunch at 1 every day","Football practice","Zoo trip tomorrow morning at 9","Chess class weekdays 4-5"];
for(const c of cases){const r=await p.evaluate(c=>{const R=localParse(c);return R.items.map(x=>`${x.type}|${x.title}|${x.who}|${x.days?dayList(x.days):x.date||"-"}|${x.start||"?"}-${x.end||"?"}`).join("  ;;  ")+(R.asks.length?"   ASK: "+R.asks.map(a=>a.q).join(" / "):"")},c);console.log(c.padEnd(46),"=>",r)}
// chat flow end to end
await p.click('#nav button:has-text("Plan")');await p.waitForTimeout(300);
await p.fill('#dumpText','Swimming at 7, football practice');await p.click('.composer .send');await p.waitForTimeout(300);
console.log('Q:',await p.$$eval('.chat .bub.cl',x=>x.map(e=>e.textContent)));
const qs=await p.$$('.chat input[data-qa]');const vals={0:'evening',1:'Tue and Thu',2:'Sat 8 to 9 am',3:'every saturday'};
for(let i=0;i<qs.length;i++){const q=await p.$eval(`#qa-${i}`,e=>e.closest('.chat').querySelectorAll('.bub.cl')[[...e.closest('.chat').querySelectorAll('input[data-qa]')].indexOf(e)]?.textContent||'');}
const Q=await p.$$eval('.chat .bub.cl',x=>x.map(e=>e.textContent));for(let i=0;i<Q.length;i++){const v=/morning or the evening/.test(Q[i])?'evening':/Which days is Swimming/.test(Q[i])?'Tue and Thu':/Which days is Football/.test(Q[i])?'every saturday':/What time is Football/.test(Q[i])?'8 to 9 am':'';if(v)await p.fill('#qa-'+i,v)}
await p.click('[data-act="qsend"] >> nth=0');await p.waitForTimeout(300);
console.log('after answers:',await p.$$eval('.parsed',x=>x.map(e=>e.innerText.replace(/\n/g,' '))),'| left Q:',await p.$$eval('.chat input[data-qa]',x=>x.length));
await p.click('[data-act="dadd"]');await p.waitForTimeout(300);console.log('events:',await p.evaluate(()=>S.events.map(e=>e.title+' '+dayList(e.days)+' '+e.start+'-'+e.end).join(' | ')));
await p.screenshot({path:SP+'/d44.png'});console.log('errors:',errs);await b.close()})();
