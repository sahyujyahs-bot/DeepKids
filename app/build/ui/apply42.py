import os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply41.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v42.js').read().split('\n'))
bi={name(b):i for i,b in enumerate(B) if name(b)};ins=[];nrep=0
for p in Pb:
    k=name(p)
    if k and k in bi: B[bi[k]]=p;nrep+=1
    else: ins.append(p)
k=bi['kolam'];B=B[:k+1]+ins+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
print("replaced",nrep,"inserted",len(ins))
rep('''["cal","Calendar","See the plan by day, week, month or year"],["queue"''','''["cal","Calendar","See the plan by day, week, month or year"],["todo","To do","Your own to-dos, and prep and things to gather for coming lessons"],["queue"''')
rep('''   case "tqt":{''','''   case "tdtick":{const x=(S.todos||[]).find(z=>z.id===b.dataset.t);if(x){x.done=!x.done;x.doneOn=x.done?today:null;sfx(x.done?"tick":"flip");commit()}break}
   case "tdadd":{ui.tdAdd=!ui.tdAdd;break}
   case "tqt":{''')
# timeline: Now only while it's on; Pending once its time has passed and it isn't done
rep('''const tag=it===focus?`<span class="tag now">${date===today&&it.at<=nowMin()&&!it.anytime?"Now":"Up next"}</span>`''','''const late=isMissed(it,date),tag=it===focus?(late?`<span class="tag now">Pending</span>`:`<span class="tag now">${date===today&&!it.anytime&&it.at<=nowMin()&&nowMin()<it.at+it.dur?"Now":"Up next"}</span>`)''')
rep('''missed?`<span class="tag miss">Still to do</span>`:"";''','''missed?`<span class="tag miss">Pending</span>`:"";''')
rep('''const label=missed?"Still to do":''','''const label=missed?"Pending":''')
CSS2='''.tr.focus{margin:0;padding:0;background:none;box-shadow:none;border-radius:0;display:grid;gap:10px}
'''
head=head.replace('</style>',CSS2+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v42 built",len(out))
