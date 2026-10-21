# what you type survives any refresh; saves confirm; inputs that were used get cleared
rep('b.replaceChildren(el(h));sheet.scrollTop=top?0:y;','const kept=top?null:keepInputs(b);b.replaceChildren(el(h));if(kept)restoreInputs(b,kept);sheet.scrollTop=top?0:y;')
rep('m.replaceChildren(el(`<div class="wrap">${banner}','const vk=ob?"ob"+ob.step:tab,kept=ui.lastView===vk?keepInputs(m):null;ui.lastView=vk;m.replaceChildren(el(`<div class="wrap">${banner}')
rep('  m.querySelectorAll(".hs").forEach((x,i)=>{if(sx[i])x.scrollLeft=sx[i]});\n  if(ui.sheet&&sheet.open)renderSheet()}','  if(kept)restoreInputs(m,kept);m.querySelectorAll(".hs").forEach((x,i)=>{if(sx[i])x.scrollLeft=sx[i]});\n  if(ui.sheet&&sheet.open)renderSheet()}')
rep('sfx("win");toast(S.parent.name?"Thanks, "+S.parent.name+"!":"Saved");sheet.close();commit();break}',
    'sfx("win");S.updatedAt=Date.now();sheet.close();render();saveNow().then(ok=>toast(ok?(S.parent.name?"Saved. Hi, "+S.parent.name+"!":"Saved to your account"):store?"Couldn\'t reach your account. Saved on this phone; it will retry.":"Saved"));break}')
rep('if(v)S.start=v;sfx("ok");toast("Saved");commit();break}','if(v)S.start=v;sfx("ok");S.updatedAt=Date.now();render();saveNow().then(ok=>toast(ok||!store?"Saved":"Couldn\'t reach your account. Saved on this phone; it will retry."));break}')
rep('if(v){addExp(v,"Our own experiment");sfx("ok");commit()}break}','if(v){addExp(v,"Our own experiment");sfx("ok");commit();clearIn("newExp")}break}')
rep('cat:document.getElementById("invCat").value}];sfx("ok");commit();break}','cat:document.getElementById("invCat").value}];sfx("ok");commit();clearIn("invName");break}')
rep('function addParsed(){','function addParsed(){clearIn("dumpText");')
s=s.replace('sfx("ok");toast("Added for "+fmt(d));commit();break}','sfx("ok");toast("Added for "+fmt(d));commit();clearIn("qa-t");break}',1)
s=s.replace('let DBH=null,UID=null,_all=null,ACCT="";','''let DBH=null,UID=null,_all=null,ACCT="";
function keepInputs(root){const o={};root.querySelectorAll("input[id],textarea[id],select[id]").forEach(e=>{if(e.dataset.dirty&&e.type!=="file")o[e.id]=e.type==="checkbox"?e.checked:e.value});const a=document.activeElement;return {o,focus:a&&root.contains(a)&&a.id?a.id:null,sel:a&&typeof a.selectionStart==="number"?a.selectionStart:null}}
function restoreInputs(root,k){Object.entries(k.o).forEach(([id,v])=>{const e=root.querySelector("#"+CSS.escape(id));if(!e)return;if(e.type==="checkbox")e.checked=v;else e.value=v;e.dataset.dirty="1"});if(k.focus){const e=root.querySelector("#"+CSS.escape(k.focus));if(e&&document.activeElement!==e){e.focus({preventScroll:true});try{if(k.sel!=null)e.setSelectionRange(k.sel,k.sel)}catch(x){}}}}
function clearIn(id){document.querySelectorAll("#"+CSS.escape(id)).forEach(e=>{e.value="";delete e.dataset.dirty})}
document.addEventListener("input",e=>{if(e.target.id)e.target.dataset.dirty="1"},true);
document.addEventListener("change",e=>{if(e.target.id)e.target.dataset.dirty="1"},true);''',1)
rep('<p class="xs muted">${syncMode==="account"?"Progress is saved privately to your claude.ai account.":"Progress is saved in this browser only."}</p>`}',
    '<p class="xs muted">${syncMode==="account"?`Everything is saved privately to your claude.ai account${lastSaved?" · last saved "+new Date(lastSaved).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):""}. It follows you to any device where you\'re signed in.`:store?"Couldn\'t reach your account just now. Saved on this device; it will retry.":"Saved in this browser only."}</p>`}')
# chip choices are part of the draft, so a refresh never loses them
rep('case "phelp":{b.setAttribute("aria-pressed",b.getAttribute("aria-pressed")!=="true");sfx("tap");break}',
    'case "phelp":{ui.phelp=ui.phelp||new Set((S.parent||{}).help||[]);ui.phelp.has(b.dataset.s)?ui.phelp.delete(b.dataset.s):ui.phelp.add(b.dataset.s);b.setAttribute("aria-pressed",ui.phelp.has(b.dataset.s));sfx("tap");break}')
rep('help:[...document.querySelectorAll(\'#sheetBody [data-act="phelp"][aria-pressed="true"]\')].map(x=>x.dataset.s),saved:Date.now()};',
    'help:[...(ui.phelp||new Set((S.parent||{}).help||[]))],saved:Date.now()};ui.phelp=null;')
rep('aria-pressed="${(p.help||[]).includes(s)}" data-act="phelp"','aria-pressed="${ui.phelp?ui.phelp.has(s):(p.help||[]).includes(s)}" data-act="phelp"')
rep('sheet.addEventListener("close",()=>{','sheet.addEventListener("close",()=>{ui.phelp=null;')
