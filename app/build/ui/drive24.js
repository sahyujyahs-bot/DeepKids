// Back navigation retraces: tab -> library science -> chapter sheet -> tab in chapter -> worksheet, then back step by step.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});await ctx.clock.install({time:new Date('2026-10-21T10:20:00')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(500);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const where=async()=>p.evaluate(()=>`${tab}${tab==="library"?"/"+(ui.lt||"topics"):""}${ui.tday?"/day "+ui.tday:""}${sheet.open?" + sheet "+ui.sheet.mode+(ui.sheet.mode==="chapter"?"("+(ui.ctab[ui.sheet.k]||"overview")+")":""):""}`);
console.log('back hidden at start:',await p.evaluate(()=>document.getElementById('backTop').hidden));
await p.click('[data-act="tday"][data-d="1"]');console.log('a',await where());
await p.click('#nav [data-tab="library"]');console.log('b',await where());
await p.click('[data-act="lt"][data-t="science"]');console.log('c',await where());
await p.evaluate(()=>openSheet({mode:'chapter',k:'ncert|sci|3|4'}));console.log('d',await where());
await p.click('[data-act="ctab"][data-t="ws"]');console.log('e',await where());
await p.locator('#sheetBody [data-act="ws"]').first().click();await p.waitForTimeout(200);console.log('f',await where(),'| sheet button:',await p.getAttribute('#sheetClose','aria-label'));
for(let i=0;i<6;i++){await p.click(await p.evaluate(()=>sheet.open)?'#sheetClose':'#backTop');await p.waitForTimeout(250);console.log('back',i+1,await where())}
console.log('back hidden at end:',await p.evaluate(()=>document.getElementById('backTop').hidden));

console.log('errors:',JSON.stringify(errs));await b.close()})();
