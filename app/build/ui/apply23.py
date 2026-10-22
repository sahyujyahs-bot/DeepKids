import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply22.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v19.js').read().split('\n'))
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
logic=logic.replace('games:{...(b.games||{}),...(a.games||{})}','games:{...(b.games||{}),...(a.games||{})},work:{...(b.work||{}),...(a.work||{})},quiz:{...(b.quiz||{}),...(a.quiz||{})}',1)
assert 'work:{...(b.work' in logic
rep('html:srcLine(s)+packStep(u,s),name:`pk:${d.n}:${i}`','html:srcLine(s)+packStep(u,s)+(s.kind==="check"&&P.check?.length?quizList(u.k,d.n,P.check):"")+(stepSec(u,s)==="lab"&&!s.ref?workCtl(u,"st"+d.n+"_"+i,s.title):""),name:`pk:${d.n}:${i}`')
rep('<ol class="sm">${Q.map(q=>`<li><b>${esc(q.q)}</b><details><summary class="xs muted">Answer</summary><p class="sm">${esc(q.a)}</p></details></li>`).join("")}</ol>','${quizList(u.k,d.n,Q)}')
rep('todo:todoView,','todo:todoView,folder:folderView,')
rep('   case "todo":{','''   case "wkst":{const id=b.dataset.id,to=b.dataset.to,key=k+"|"+id,W=WK(),w=W[key]||{};w.title=b.dataset.t||w.title;const untask=()=>{if(S.tasks[k])delete S.tasks[k][id]};
     if(to==="none"||(to==="undo"&&!w.started)){delete W[key];untask();sfx("flip")}
     else if(to==="undo"){w.st="started";delete w.done;delete w.doneAt;untask();W[key]=w;sfx("flip")}
     else{w.st=to;w[to]=w[to]||today;w[to+"At"]=w[to+"At"]||Date.now();if(to==="done"){w.started=w.started||today;S.tasks[k]=S.tasks[k]||{};S.tasks[k][id]=w.done;sfx("win");toast("Finished · saved to your Work folder")}else{untask();sfx("ok");toast(to==="planned"?"Added to your pipeline · see To finish":"Marked started · finish it any time")}W[key]=w}
     commit();break}
   case "qz":{S.quiz=S.quiz||{};const q=S.quiz[k+"|"+b.dataset.n]=S.quiz[k+"|"+b.dataset.n]||{};q[b.dataset.i]={q:b.dataset.q,a:b.dataset.a,r:+b.dataset.r,d:today};sfx(+b.dataset.r?"ok":"tap");commit();break}
   case "folder":{sfx("flip");openSheet({mode:"folder"});break}
   case "fsave":{folderSave();break}
   case "fprint":{folderPrint();break}
   case "todo":{''')
a=s.index('<button class="menurow" data-act="todo">');s=s[:a]+'<button class="menurow" data-act="folder">${blob("var(--leaf)",14,"wow","",\'width="40" height="40"\')}<span><b>Work folder</b><br><span class="xs muted">Finished worksheets with answers, quizzes and projects. Save or print.</span></span>${icon("next")}</button>'+s[a:]
# a day with no lessons says why
rep('`<p class="note">${past?"Nothing was recorded that day.":"Nothing planned yet."}</p>`','(past?`<p class="note">Nothing was recorded that day.</p>`:noLessonNote(d))')
s=s.replace('function otherDay(d){','''function noLessonNote(d){const wd=parse(d).getDay(),DN=["Sundays","Mondays","Tuesdays","Wednesdays","Thursdays","Fridays","Saturdays"],SD=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],on=S.subjects.filter(s=>daysOf(s).includes(wd));
  if(on.length)return `<p class="note">Nothing planned yet.</p>`;const nx=upcoming().find(x=>x.date>d),rng=a=>{const o=[1,2,3,4,5,6,0].filter(x=>a.includes(x));return o.join()==="1,2,3,4,5"?"Mon–Fri":o.map(x=>SD[x]).join(", ")};
  return `<div class="note"><p><b>No lessons on ${DN[wd]}.</b> It's a free day in your plan.</p><ul class="sm" style="margin:6px 0;padding-left:18px">${S.subjects.map(s=>`<li>${esc(SUBJ[s])}: ${rng(daysOf(s))}</li>`).join("")}</ul>${nx?`<p class="sm">Next lessons: ${esc(fmt(nx.date))}.</p>`:""}<button class="link sm" data-act="plsheet" data-p="pace">Change lesson days</button></div>`}
function otherDay(d){''',1)
CSS='''.wkctl{display:grid;gap:6px;margin-top:8px;padding:8px 10px;border-radius:12px;background:rgba(43,35,64,.05)}.wkctl.started{background:#FFF0C9}.wkctl.planned{background:#E6E8F6}.wkctl.done{background:#DDF0E3}
.fch summary{cursor:pointer;list-style:none}.fch summary::-webkit-details-marker{display:none}.fws{margin-top:12px;padding-top:10px;border-top:1px solid rgba(43,35,64,.1)}.fws h4{margin:0;font-size:16px}
ol.fq{margin:4px 0;padding-left:20px;display:grid;gap:8px}.fok{color:#2E6B45;font-weight:700}.fno{color:#A0522D;font-weight:700}.fimg{max-width:100%;width:280px;border-radius:10px;border:1px solid rgba(43,35,64,.15);background:#fff}.fans{background:rgba(43,35,64,.05);padding:6px 10px;border-radius:10px}
table.ftab{border-collapse:collapse;font-size:13px}table.ftab td,table.ftab th{border:1px solid rgba(43,35,64,.2);padding:4px 8px;text-align:left}
'''
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v23",n,len(ins),"built",len(out))
