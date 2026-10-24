import os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply59.py'],check=True,capture_output=True)
T='/home/user/DeepKids/app/build/template.html';t=open(T).read()
head=t[:t.index('<script>')];logic=t[t.index('<script>')+8:t.index('/* ================= UI')];s=t[t.index('/* ================= UI'):t.rindex('</script>')]
def rep(a,b,c=1):
    global s
    assert s.count(a)==c,(s.count(a),a[:90]);s=s.replace(a,b)
def lrep(a,b):
    global logic
    if b in logic: return
    if logic.count(a)==0: print('superseded:',a[:50]); return
    assert logic.count(a)==1,(logic.count(a),a[:90]);logic=logic.replace(a,b)
import re
def blocks(lines):
    out=[];cur=[]
    for l in lines:
        if l and not l[0].isspace() and cur: out.append(cur);cur=[]
        cur.append(l)
    if cur: out.append(cur)
    return out
name=lambda b:(re.match(r'(?:async function|function|const|let) (\w+)',b[0]) or [None,None])[1]
B=blocks(s.split('\n'));Pb=blocks(open('patch_v60.js').read().split('\n'))
bi={name(b):i for i,b in enumerate(B) if name(b)};ins=[];nrep=0
for p in Pb:
    k=name(p)
    if k and k in bi: B[bi[k]]=p;nrep+=1
    else: ins.append(p)
k=bi['kolam'];B=B[:k+1]+ins+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
print("replaced",nrep,"inserted",len(ins))
rep('''case "drew":{''','''case "nbg":{ui.nbg={...(ui.nbg||{}),[k]:b.dataset.g};sfx("tap");render();break}
   case "scideck":{sfx("flip");openSheet({mode:"scideck"});break}
   case "scip":{ui.scip=b.dataset.p;sfx("tap");render();break}
   case "sciprint":{sfx("ok");printDoc(sciPrintDoc(b.dataset.ids.split(","),b.dataset.t||"Scientists"));break}
   case "drew":{''')
rep('''wsv:wsViewSheet,''','''wsv:wsViewSheet,scideck:sciDeckView,''')
rep('''...(resourcesFor(u).length?{res:"Free resources"}:{})};\n''','''...(resourcesFor(u).length?{res:"Free resources"}:{})};if(nbOf(u))tabs.nb="✦ Notebook";\n''')
rep('''if(t==="res")h+=resTab(u);''','''if(t==="res")h+=resTab(u);if(t==="nb")h+=nbTab(u);''')
head=head.replace('</style>','.nbg{border-left:4px solid var(--peri);padding:4px 10px;margin:8px 0}.nbgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px;margin:6px 0}.nbgrid>div{background:var(--surface);border-radius:12px;padding:6px 10px;min-width:0}.nba{border-bottom:1px solid var(--line);padding:6px 0}.nba summary{cursor:pointer}.scard{border:2px solid var(--line);border-radius:16px;padding:10px 12px;display:grid;gap:4px;min-width:0}.sbar{display:grid;grid-template-columns:110px 1fr;align-items:center;gap:6px}.sbar i{display:block;height:6px;border-radius:3px;background:var(--peri)}\n</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v60 built",len(out))
