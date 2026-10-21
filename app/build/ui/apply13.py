import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply12.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v13.js').read().split('\n'))
bi={name(b):i for i,b in enumerate(B) if name(b)};ins=[];n=0
for p in Pb:
    k=name(p)
    if k and k in bi: B[bi[k]]=p;n+=1
    else: ins.append(p)
k=bi['kolam'];B=B[:k+1]+ins+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:90]);s=s.replace(a,b)
# the refresher opens and is played, not just ticked
rep('exps:[`data-act="tlcheck" ${a}`,"Checked them all"]}[it.kind]','exps:[`data-act="tlcheck" ${a}`,"Checked them all"],refresh:[`data-act="refresh" data-date="${today}"`,"Play it"]}[it.kind]')
a=s.index('  if(it.kind==="refresh")return `');b=s.index('\n',a)
s=s[:a]+'  if(it.kind==="refresh")return `<p class="sm" style="font-weight:700">${esc(it.rf.title)}</p><p class="xs muted">A 15-minute return to ${esc(it.rf.u.title)}, then 3 quick questions.</p><div class="row"><button class="btn sm" data-act="refresh" data-date="${date}">${icon("play")}Play it</button></div>`;'+s[b:]
rep('ws:wsView,','ws:wsView,refresh:refreshView,')
rep('   case "lt":{','   case "refresh":{sfx("flip");openSheet({mode:"refresh",date:b.dataset.date||today});break}\n   case "lt":{')
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v13",n,len(ins),"built",len(out))
