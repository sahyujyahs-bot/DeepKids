import os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply43.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v44.js').read().split('\n'))
bi={name(b):i for i,b in enumerate(B) if name(b)};ins=[];nrep=0
for p in Pb:
    k=name(p)
    if k and k in bi: B[bi[k]]=p;nrep+=1
    else: ins.append(p)
k=bi['kolam'];B=B[:k+1]+ins+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
print("replaced",nrep,"inserted",len(ins))
# Progress → Work: finished work only; what's unfinished lives in Plan
rep('''k==="work")h+=`<section class="sec">${todoView()}</section><section class="sec"><div class="sech"><h3>Finished work</h3>''','''k==="work")h+=`<section class="sec"><button class="menurow" data-act="todo">${blob("var(--tang)",11,"calm","",'width="40" height="40"')}<span><b>Unfinished work</b><br><span class="xs muted">Started, pending and queued things are in Plan → Ongoing, Pending and Queue</span></span>${icon("next")}</button></section><section class="sec"><div class="sech"><h3>Finished work</h3>''')
rep('''["work","Work","Things to finish, finished work with answers, and photos"]''','''["work","Work","Finished work with answers, and photos"]''')
rep('''   case "tqt":{''','''   case "subtog":{const s=b.dataset.s,on=S.subjects.includes(s);if(on&&S.subjects.length<2){sfx("no");toast("Keep at least one subject");break}S.subjects=on?S.subjects.filter(x=>x!==s):SUBJ_KEYS.filter(x=>x===s||S.subjects.includes(x));if(!on){S.levels={...S.levels,[s]:S.levels?.[s]||S.levels?.sci||1}}sfx(on?"flip":"ok");commit();toast(on?`${SUBJ[s]} left out. Its progress is kept.`:`${SUBJ[s]} added. It's in Today and the Queue now.`);break}
   case "pacego":{navPush();ui.seg={...(ui.seg||{}),week:"tell"};sfx("flip");render();setTimeout(()=>document.getElementById("paceSec")?.scrollIntoView({behavior:"smooth",block:"start"}),60);break}
   case "tqt":{''')
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v44 built",len(out))
