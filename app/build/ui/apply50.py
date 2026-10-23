import os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply49.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v50.js').read().split('\n'))
bi={name(b):i for i,b in enumerate(B) if name(b)};ins=[];nrep=0
for p in Pb:
    k=name(p)
    if k and k in bi: B[bi[k]]=p;nrep+=1
    else: ins.append(p)
k=bi['kolam'];B=B[:k+1]+ins+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
print("replaced",nrep,"inserted",len(ins))
# learning profile in Plan > Tell DeepKids, and its buttons
rep('id="paceSec">${dayTimesCard()}${subjCard()}','id="paceSec">${dayTimesCard()}${subjCard()}${profCard()}')
rep('''   case "tqt":{''','''   case "plv":case "pdep":{const s=b.dataset.s,f=a==="plv"?"lvl":"depth";S.prof={...(S.prof||{}),[s]:{...((S.prof||{})[s]||{}),[f]:b.dataset.v,...(a==="plv"?{why:"set by you",at:today}:{})}};sfx("tick");save();render();break}
   case "tqt":{''')
rep('h=H("Draw it",b.inst||"")','h=H(b.title||"Draw it",b.inst||"")')
# topic sheets name the topic and level, not a book
rep('''<div class="wtag">${tag} · ${esc(chT(u))}</div>''','''<div class="wtag">${TWN()[(ws.id||"").split("|")[0]]?`DeepKids · ${esc(TWN()[ws.id.split("|")[0]].title)} · ${PLN[ws.lvl||"core"]}`:`${tag} · ${esc(chT(u))}`}</div>''')
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v50 built",len(out))
