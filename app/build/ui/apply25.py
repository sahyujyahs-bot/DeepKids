import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply24.py'],check=True,capture_output=True)
T='/home/user/DeepKids/app/build/template.html';t=open(T).read()
head=t[:t.index('<script>')];logic=t[t.index('<script>')+8:t.index('/* ================= UI')];s=t[t.index('/* ================= UI'):t.rindex('</script>')]
i=s.index('async function runDump(){');j=s.index('\nfunction addParsed(',i);s=s[:i]+open('runDump_v21.js').read()+s[j:]
def blocks(lines):
    out=[];cur=[]
    for l in lines:
        if l and not l[0].isspace() and cur: out.append(cur);cur=[]
        cur.append(l)
    if cur: out.append(cur)
    return out
name=lambda b:(re.match(r'(?:async function|function|const|let) (\w+)',b[0]) or [None,None])[1]
B=blocks(s.split('\n'));Pb=blocks(open('patch_v21.js').read().split('\n'))
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
lrep('ev.forEach(e=>items.push({id:"e-"+e.id,at:hm(e.start),dur:Math.max(15,hm(e.end)-hm(e.start)),who:e.kind==="outing"?"out":e.who,kind:"event",ev:e,title:e.title,sub:({class:"Class",online:"Online class",outing:"Outing",other:""}[e.kind])+(e.note?" · "+e.note:"")+(e.who==="kid"?" · you\'re free":""),','ev.forEach(e=>items.push({id:"e-"+e.id,at:e.start?hm(e.start):24*60-1,anytime:!e.start,dur:e.start&&e.end?Math.max(15,hm(e.end)-hm(e.start)):15,who:e.kind==="outing"?"out":e.who,kind:"event",ev:e,title:e.title,sub:evSub(e)+(e.start?"":e.allDay?" · all day":" · time not set"),')
lrep('ev.filter(e=>e.who!=="you"||true).map(e=>({a:hm(e.start),b:hm(e.end)}))','ev.filter(e=>e.start).map(e=>({a:hm(e.start),b:e.end?hm(e.end):hm(e.start)+60}))')
rep('function render(){fixWork();','function render(){fixWork();fixRoutines();')
rep('folder:folderView,','folder:folderView,told:toldView,')
rep('   case "todo":{','''   case "told":{sfx("flip");ui.ted="";openSheet({mode:"told"});break}
   case "ted":{ui.ted=b.dataset.id;if(!b.dataset.id){sfx("ok");commit()}else render();break}
   case "evday":{const e=(S.events||[]).find(x=>x.id===b.dataset.id);if(e){const d=+b.dataset.d,set=new Set(e.rep==="weekly"?e.days:[]);set.has(d)?set.delete(d):set.add(d);if(set.size){e.days=[...set];e.rep="weekly";e.date=null}else{e.rep="once";e.days=[];e.date=e.date||today}sfx("tap");commit()}break}
   case "evwho":{const e=(S.events||[]).find(x=>x.id===b.dataset.id);if(e){e.who=b.dataset.w;sfx("tap");commit()}break}
   case "evdel":{S.events=(S.events||[]).filter(x=>x.id!==b.dataset.id);ui.ted="";sfx("flip");toast("Removed");commit();break}
   case "tddel":{S.todos=(S.todos||[]).filter(x=>x.id!==b.dataset.id);sfx("flip");commit();break}
   case "notedel":{S.notes=(S.notes||[]).filter(x=>x.id!==b.dataset.id);sfx("flip");commit();break}
   case "todo":{''')
rep('if(t.id==="upFiles"&&','if(t.dataset.evf){const e=(S.events||[]).find(x=>x.id===t.dataset.id);if(e){e[t.dataset.evf]=t.value||(t.dataset.evf==="title"?e.title:null);save()}return}if(t.id==="upFiles"&&')
rep('<details><summary class="link" style="cursor:pointer">Quick add by hand</summary>','<div class="row" style="gap:14px"><button class="link" data-act="told">What you\'ve told us · ${(S.events||[]).length+(S.todos||[]).filter(t=>!t.done).length+(S.notes||[]).length}</button></div><details><summary class="link" style="cursor:pointer">Quick add by hand</summary>')
a=s.index('<button class="menurow" data-act="track">')
s=s[:a]+'<button class="menurow" data-act="told">${blob("var(--sky)",4,"happy","",\'width="40" height="40"\')}<span><b>What you\'ve told us</b><br><span class="xs muted">Every routine, class, rest time, to-do and note you added</span></span>${icon("next")}</button>'+s[a:]
CSS='''.pk.warn{border-left-color:var(--bad)}.dpick button{min-width:40px}
'''
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v25",n,len(ins),"built",len(out))
