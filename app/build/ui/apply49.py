import os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply48.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v49.js').read().split('\n'))
bi={name(b):i for i,b in enumerate(B) if name(b)};ins=[];nrep=0
for p in Pb:
    k=name(p)
    if k and k in bi: B[bi[k]]=p;nrep+=1
    else: ins.append(p)
k=bi['kolam'];B=B[:k+1]+ins+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
print("replaced",nrep,"inserted",len(ins))
# printable worksheets on each chapter
rep('''let h=`<div class="sech" style="margin-top:6px"><h3 style="font-size:19px">Everything for this chapter</h3></div>`;''','''let h=`<div class="sech" style="margin-top:6px"><h3 style="font-size:19px">Everything for this chapter</h3></div>`+printSheets(u);''')
rep('folder:folderView,plus:plusView,qzs:qzsView,quizz:quizzView,rfset:rfsetView,wfguide:wfGuideView,','folder:folderView,plus:plusView,qzs:qzsView,quizz:quizzView,rfset:rfsetView,wfguide:wfGuideView,wsv:wsViewSheet,')
rep('''   case "tqt":{''','''   case "wsprint":{const u=unitByK(k),w=wsOf(u)[+b.dataset.i];if(w){sfx("ok");printDoc(wsPage(w,u))}break}
   case "wssave":{const u=unitByK(k),w=wsOf(u)[+b.dataset.i];if(w)saveDoc(wsPage(w,u),`${w.title.replace(/[^\\w ]+/g,"").trim()}.html`);break}
   case "wsview":{sfx("flip");openSheet({mode:"wsv",k,i:+b.dataset.i});break}
   case "tqt":{''')
CSS7='''.pws{display:flex;gap:10px;align-items:center;padding:10px 0;border-top:1px solid var(--line)}.pws b{font:600 15.5px var(--display)}.wsframe{width:100%;height:72vh;border:1px solid var(--line);border-radius:12px;background:#eee;margin-top:8px}
'''
head=head.replace('</style>',CSS7+'</style>',1)
rep('''if(t==="ws")return `<p class="sm muted">Three levels: core for everyone''','''if(t==="ws")return printSheets(u)+`<p class="sm muted">Three levels: core for everyone''')
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v49 built",len(out))
