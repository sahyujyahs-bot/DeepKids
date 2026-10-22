import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply23.py'],check=True,capture_output=True)
T='/home/user/DeepKids/app/build/template.html';t=open(T).read()
head=t[:t.index('<script>')];logic=t[t.index('<script>')+8:t.index('/* ================= UI')];s=t[t.index('/* ================= UI'):t.rindex('</script>')]
def blocks(lines):
    out=[];cur=[]
    for l in lines:
        if l and not l[0].isspace() and cur: out.append(cur);cur=[]
        cur.append(l)
    if cur: out.append(cur)
    return out
name=lambda b:(re.match(r'(?:async function|function|const|let) (\w+)',b[0]) or [None,None])[1]
B=blocks(s.split('\n'));Pb=blocks(open('patch_v20.js').read().split('\n'))
bi={name(b):i for i,b in enumerate(B) if name(b)};ins=[];n=0
for p in Pb:
    k=name(p)
    if k and k in bi: B[bi[k]]=p;n+=1
    else: ins.append(p)
k=bi['kolam'];B=B[:k+1]+ins+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
def rep(a,b,c=1):
    global s
    assert s.count(a)==c,(s.count(a),a[:90]);s=s.replace(a,b)
def lrep(a,b):
    global logic
    if b in logic: return
    assert logic.count(a)==1,(logic.count(a),a[:90]);logic=logic.replace(a,b)
lrep('const eventsOn=date=>(S.events||[]).filter(','const eventsOn=date=>[...(S.events||[]),...(S.cal?.on?S.cal.ev||[]:[])].filter(')
lrep('S.log=S.log.slice(0,400)','S.log=S.log.slice(0,3000)')
lrep('const log=[...(a.log||[]),...(b.log||[]).filter(l=>!seen.has(key(l)))].sort((x,y)=>x.date<y.date?1:x.date>y.date?-1:0).slice(0,400);','const log=[...(a.log||[]),...(b.log||[]).filter(l=>!seen.has(key(l)))].sort((x,y)=>x.date<y.date?1:x.date>y.date?-1:0).slice(0,3000);')
lrep('quiz:{...(b.quiz||{}),...(a.quiz||{})}','quiz:{...(b.quiz||{}),...(a.quiz||{})},work:Array.isArray(a.work)||Array.isArray(b.work)?(()=>{const m=new Map();[...(Array.isArray(b.work)?b.work:[]),...(Array.isArray(a.work)?a.work:[])].forEach(w=>w&&w.id&&m.set(w.id,{...(m.get(w.id)||{}),...w}));return [...m.values()]})():a.work,mins:(()=>{const m={...(b.mins||{})};Object.entries(a.mins||{}).forEach(([k,v])=>{m[k]=Math.max(v,m[k]||0)});return m})(),cal:(a.cal?.at||0)>=(b.cal?.at||0)?a.cal:b.cal,school:{...(b.school||{}),...(a.school||{})}')
rep('.slice(-500)}stepT=null}','.slice(-3000);addMins(P.k,sec)}stepT=null}')
rep('${D_.questions?.length?`<div class="ask"><span class="eyebrow">A few questions</span>${D_.questions.map(q=>`<div>${esc(q)}</div>`).join("")}<span class="xs muted">Answer in the box above and sort again.</span></div>`:""}','${dumpChat(D_)}')
rep('folder:folderView,','folder:folderView,uploads:uploadsView,track:trackView,school:schoolView,')
rep('   case "todo":{','''   case "qsend":{qSend();break}
   case "gcsync":{gcSync(true);break}
   case "gcoff":{S.cal={on:false};sfx("flip");toast("Calendar unlinked");commit();break}
   case "gccal":{const c=S.cal||{},id=b.dataset.id,set=new Set(c.cals||[]);set.has(id)?set.delete(id):set.add(id);S.cal={...c,cals:[...set]};gcSync(true);break}
   case "uploads":{sfx("flip");openSheet({mode:"uploads"});break}
   case "track":{sfx("flip");openSheet({mode:"track"});break}
   case "school":{sfx("flip");openSheet({mode:"school"});break}
   case "tmore":{ui.tlim=(ui.tlim||21)+30;render();break}
   case "tsave":{saveDoc(transcriptDoc(),`${(S.child||"Student").replace(/[^\\w ]/g,"")} transcript ${today}.html`);break}
   case "tprint":{printDoc(transcriptDoc());break}
   case "todo":{''')
rep('if(t.id==="icsFile"&&','if(t.id==="upFiles"&&t.files?.length){const F=[...t.files];t.value="";upFiles(F);return}if(t.dataset.upk!==undefined){const w=(S.work||[]).find(x=>x.id===t.dataset.upk);if(w){w.k=t.value;sfx("tap");commit()}return}if(t.dataset.sch){S.school={...(S.school||{}),[t.dataset.sch]:t.value};save();return}if(t.id==="icsFile"&&')
a=s.index('<button class="menurow" data-act="folder">')
row=lambda act,col,seed,t,sub:'<button class="menurow" data-act="%s">${blob("%s",%d,"happy","",\'width="40" height="40"\')}<span><b>%s</b><br><span class="xs muted">%s</span></span>${icon("next")}</button>'%(act,col,seed,t,sub)
s=s[:a]+row("track","var(--aqua)",6,"Tracking","Time each day and subject, and what was covered")+row("uploads","var(--gum)",9,"Uploads","Add photos and files; DeepKids files them by chapter")+row("school","var(--sun)",12,"Moving to a school","Full report by board and level, scores, transcript")+s[a:]
rep('<span class="row" style="gap:14px">${(n=>n?`<button class="link" data-act="todo">','<span class="row" style="gap:14px"><button class="link" data-act="uploads">Add photos</button>${(n=>n?`<button class="link" data-act="todo">')
CSS='''.chat{display:grid;gap:8px;margin:6px 0}.bub{max-width:88%;padding:10px 14px;border-radius:18px;font-size:15px;line-height:1.4}.bub.cl{background:#E6E8F6;border-bottom-left-radius:6px;justify-self:start}.bub.me{background:#DDF0E3;border-bottom-right-radius:6px;justify-self:end}
.qa{display:flex;gap:8px;align-items:center;margin:-2px 0 6px 0}.qa .inp{flex:1;min-width:0;height:44px}
.drop{display:grid;justify-items:center;text-align:center;gap:6px;padding:22px 16px;border:2px dashed rgba(43,35,64,.25);border-radius:20px;background:var(--surface);cursor:pointer}.drop.busy{opacity:.7;cursor:progress}
.upc{display:grid;grid-template-columns:84px 1fr;gap:12px;align-items:start;padding:10px;border-radius:16px;background:var(--surface);box-shadow:0 1px 0 rgba(43,35,64,.08)}.upc img,.upc .ph{width:84px;height:84px;object-fit:cover;border-radius:12px;display:grid;place-items:center;background:rgba(43,35,64,.06);font-weight:700;font-size:13px;color:inherit;text-decoration:none}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:8px 0}.tile{background:var(--surface);border-radius:16px;padding:12px 14px;display:grid;gap:2px}.tile b{font:700 22px var(--display)}.tile span{font-size:12.5px;color:rgba(43,35,64,.65)}
.tlegend{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:13px;margin-bottom:8px}.tlegend span{display:inline-flex;align-items:center;gap:6px}.tlegend i{width:12px;height:12px;border-radius:3px;display:inline-block}.tlegend i.est{background:rgba(43,35,64,.3)}
.tchart{position:relative;height:170px;margin:0 0 6px 44px}.tgrid span{position:absolute;left:-44px;right:0;border-top:1px solid rgba(43,35,64,.1);font-size:11px;color:rgba(43,35,64,.55);transform:translateY(-1px);line-height:0;padding-top:0}.tgrid span::before{content:"";}
.tbars{position:absolute;inset:0;display:flex;gap:4px;align-items:flex-end}.tcol{flex:1;height:100%;display:flex;flex-direction:column;justify-content:flex-end;position:relative;outline:none;cursor:default}.tcol:focus-visible .tstack{outline:2px solid var(--ink)}
.tstack{display:flex;flex-direction:column-reverse;gap:2px;min-height:0}.tstack i{display:block;min-height:2px}.tstack i:last-child{border-radius:4px 4px 0 0}.tx{position:absolute;bottom:-20px;left:0;right:0;text-align:center;font-size:11px;color:rgba(43,35,64,.6)}.tx.on{font-weight:800;color:var(--ink)}
.tchart+*{margin-top:26px}#tip{position:fixed;z-index:9999;display:none;pointer-events:none;background:#2B2340;color:#fff;font-size:12.5px;line-height:1.45;padding:8px 10px;border-radius:10px;white-space:pre;max-width:260px}
.hbar{display:grid;gap:4px}.hb{height:12px;border-radius:6px;background:rgba(43,35,64,.07);overflow:hidden}.hb i{display:block;height:100%;border-radius:0 4px 4px 0}
.tday summary{cursor:pointer;list-style:none}.tday summary::-webkit-details-marker{display:none}
table.rtab{border-collapse:collapse;width:100%;font-size:13px}table.rtab th,table.rtab td{border-bottom:1px solid rgba(43,35,64,.1);padding:6px 6px;text-align:left;vertical-align:top}table.rtab th{font-size:12px;color:rgba(43,35,64,.65)}
.grade{font:700 15px var(--display);padding:4px 12px;border-radius:99px;background:#FFF0C9}
'''
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v24",n,len(ins),"built",len(out))
