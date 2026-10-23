const { chromium } = require('/opt/node-tools/node_modules/playwright');const fs=require('fs');
(async()=>{const SP=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:400,height:860}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/app_prev.html');await p.waitForTimeout(800);await p.fill('#lgPhone','98765 43210');await p.fill('#lgName','S');await p.click('[data-act="login"]');await p.waitForTimeout(500);
await p.fill('#obName','Liri');await p.click('[data-age="8"]');await p.click('[data-ob="next"]');await p.click('[data-b="ncert"]');for(let i=0;i<4;i++)await p.click('[data-ob="next"]');await p.waitForTimeout(400);
const all=await p.evaluate(()=>{const out=[];Object.entries(DATA.tws).forEach(([t,L])=>{const c=(DATA.rconcepts||[]).find(x=>x.id===t),k=(c?c.chapters:DATA.wtopics[t].chapters).find(k=>unitByK(k)),u=unitByK(k);
  L.forEach(w=>{let note=[];try{const html=wsPage(w,u),d=new DOMParser().parseFromString(html,"text/html"),B=d.querySelectorAll('.wb');
   w.blocks.forEach((bk,i)=>{if(bk.type==="wordsearch"){const n=B[i].querySelectorAll('.wbank span').length;if(n<bk.words.length)note.push(`ws ${n}/${bk.words.length}`)}if(bk.type==="crossword"){const n=B[i].querySelectorAll('.wclues li').length;if(n<bk.clues.length)note.push(`cw ${n}/${bk.clues.length}`)}});
   out.push([w.id,html,note.join(',')])}catch(e){out.push([w.id,'','ERROR '+e.message])}})});return out});
const q=await ctx.newPage();const over=[],bad=[];
for(const [id,html,note] of all){if(note)bad.push(id+' '+note);if(!html)continue;await q.setContent(html);const buf=await q.pdf({format:'A4',printBackground:true});const n=(buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g)||[]).length;const exp=html.includes('wkey')?2:1;if(n>exp)over.push(id+':'+n)}
console.log('problems:',bad.join(' | ')||'none');console.log('over one page + key:',over.join(' ')||'none','of',all.length);
for(const id of (process.argv[3]||'').split(',').filter(Boolean)){const html=all.find(x=>x[0]===id)[1];await q.setContent(html);await q.waitForTimeout(150);await q.pdf({path:SP+'/tws_'+id.replace(/\|/g,'_')+'.pdf',format:'A4',printBackground:true})}
console.log('errors',errs);await b.close()})();
