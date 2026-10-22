const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});const p=await (await b.newContext()).newPage();await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(400);
const r=await p.evaluate(()=>{S.events=[{id:"t1",title:"Science tuition",kind:"class",who:"kid",start:"11:00",end:"12:00",rep:"weekly",days:[1,2,3,4,5]}];return [
 {type:"note",title:"Liri's nap",note:"naps 4pm-5pm every day"},
 {type:"todo",title:"Rest for 1 hour after Science tuition",note:"every day"},
 {type:"note",title:"Sleeps one hour after coming from tuition"},
 {type:"todo",title:"Buy geometry box"},
 {type:"class",title:"Swimming",note:"Tue and Thu 5 to 6 pm",days:null,start:null},
 {type:"note",title:"Tabla",note:"every Saturday 10am for an hour"},{type:"todo",title:"Dentist",note:"next Friday at 4pm",date:"2026-10-30"}].map(x=>JSON.stringify(fixItem(x)))});
console.log(r.join('\n'));await b.close()})();
