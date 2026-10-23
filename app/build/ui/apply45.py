import os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply44.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v45.js').read().split('\n'))
bi={name(b):i for i,b in enumerate(B) if name(b)};ins=[];nrep=0
for p in Pb:
    k=name(p)
    if k and k in bi: B[bi[k]]=p;nrep+=1
    else: ins.append(p)
k=bi['kolam'];B=B[:k+1]+ins+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
print("replaced",nrep,"inserted",len(ins))
# item states: actions and wording
rep('''   case "tqt":{''','''   case "ist":{const key=k+"|"+b.dataset.id,W=WK(),w=W[key]||{},to=b.dataset.to;if(to==="none"){delete w.st;W[key]=w}else if(to==="skip")W[key]={...w,st:"skip"};else if(to==="undo"){if(S.tasks[k+"#"+b.dataset.id])delete S.tasks[k+"#"+b.dataset.id].ws;delete w.st;W[key]=w}
     WQ()[b.dataset.ty]=(WQ()[b.dataset.ty]||[]).filter(x=>x!==b.dataset.ty+":"+key);sfx("flip");commit();if(sheet.open)renderSheet();toast(to==="skip"?"Marked not doing":to==="undo"?"Back to not finished":"Done");break}
   case "tqt":{''')
rep('''case "qx":{const ty=b.dataset.ty,r=b.dataset.r,key=r.slice(r.indexOf(":")+1);if(ty==="les"){''','''case "qx":{const ty=b.dataset.ty,r=b.dataset.r,key=r.slice(r.indexOf(":")+1);if(ty!=="les"&&b.dataset.how!=="skip"){const W=WK(),w=W[key]||{};delete w.st;W[key]=w;WQ()[ty]=(WQ()[ty]||[]).filter(x=>x!==r);sfx("flip");commit();toast("Taken out of the queue");break}if(ty==="les"){''')
rep('''const line=st==="done"?`Finished ${fmt(w.done)}''','''const line=st==="done"?`Completed ${fmt(w.done)}''')
rep('''st==="started"?`Started ${fmt(w.started)} · finish it any time`''','''st==="started"?`Ongoing · started ${fmt(w.started)}`''')
rep('''st==="planned"?`In the ${WT[wType(u,id)][0].toLowerCase()} queue since ${fmt(w.planned)}`''','''st==="planned"?`Queued · no. ${wqList(wType(u,id)).findIndex(x=>x.ref===wType(u,id)+":"+u.k+"|"+id)+1} in the ${WT[wType(u,id)][0].toLowerCase()} queue`''')
rep(''':"Not started yet";''',''':"Not started";''')
rep('''No ${WT[t][0].toLowerCase()} waiting${qfOf()==="all"?"":" in "+SUBJ[qfOf()]}. They join this queue when you finish the lesson part they belong to, or when you tap “+ Queue” in a lesson.''','''No ${WT[t][0].toLowerCase()} queued${qfOf()==="all"?"":" in "+SUBJ[qfOf()]}. Tap “+ Queue” on one in Pending, in a lesson or in a chapter.''')
CSS4='''.pill.st-going{background:#FFE7C9;color:#8A4B00}.pill.st-queued{background:#E6E4FA;color:#3F3A8C}.pill.st-none,.pill.st-new{background:var(--sunk);color:var(--muted)}
'''
head=head.replace('</style>',CSS4+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v45 built",len(out))
