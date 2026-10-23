import os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply45.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v46.js').read().split('\n'))
bi={name(b):i for i,b in enumerate(B) if name(b)};ins=[];nrep=0
for p in Pb:
    k=name(p)
    if k and k in bi: B[bi[k]]=p;nrep+=1
    else: ins.append(p)
k=bi['kolam'];B=B[:k+1]+ins+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
print("replaced",nrep,"inserted",len(ins))
# queued is a flag: taking out, clearing and skipping keep it straight
rep('''case "qx":{const ty=b.dataset.ty,r=b.dataset.r,key=r.slice(r.indexOf(":")+1);if(ty!=="les"&&b.dataset.how!=="skip"){const W=WK(),w=W[key]||{};delete w.st;W[key]=w;WQ()[ty]=(WQ()[ty]||[]).filter(x=>x!==r);sfx("flip");commit();toast("Taken out of the queue");break}''','''case "qx":{const ty=b.dataset.ty,r=b.dataset.r,key=r.slice(r.indexOf(":")+1);if(ty!=="les"&&b.dataset.how!=="skip"){unQueue(ty,key);sfx("flip");commit();if(sheet.open)renderSheet();toast("Taken out of the queue");break}''')
rep('''     if(to==="none"||(to==="undo"&&!w.started)){delete W[key];untask();sfx("flip")}''','''     if(to==="none"||(to==="undo"&&!w.started)){const q=w.q;delete W[key];if(q)W[key]={q:true,planned:w.planned,title:w.title};untask();sfx("flip")}''')
rep('''case "ist":{const key=k+"|"+b.dataset.id,W=WK(),w=W[key]||{},to=b.dataset.to;if(to==="none"){delete w.st;W[key]=w}''','''case "ist":{const key=k+"|"+b.dataset.id,W=WK(),w=W[key]||{},to=b.dataset.to;if(to==="none"){if(w.st!=="planned")delete w.st;W[key]=w}''')
rep('''     WQ()[b.dataset.ty]=(WQ()[b.dataset.ty]||[]).filter(x=>x!==b.dataset.ty+":"+key);sfx("flip");commit();if(sheet.open)renderSheet();toast(to==="skip"?"Marked not doing":to==="undo"?"Back to not finished":"Done");break}''','''     sfx("flip");commit();if(sheet.open)renderSheet();toast(to==="skip"?"Marked not doing":to==="undo"?"Back to not finished":"Done");break}''')
rep('''<b>${esc(x.title)}</b><br><span class="xs muted">${esc(x.sub)}</span></button>''','''<b>${esc(x.title)}</b>${x.ty&&x.ty!=="les"?" "+stPills(x).replace(/ <span class="pill st-queued"[^]*$/,""):""}<br><span class="xs muted">${esc(x.sub)}</span></button>''')
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v46 built",len(out))
