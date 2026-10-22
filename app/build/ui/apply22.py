import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply21.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v18.js').read().split('\n'))
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
rep('ws:wsView,','ws:wsView,todo:todoView,')
rep('   case "lt":{','   case "todo":{sfx("flip");openSheet({mode:"todo"});break}\n   case "lt":{')
# entry points: Today's calendar and Journey
rep('<span class="row" style="gap:14px"><button class="link" data-act="plsheet" data-p="queue">Up next</button>','<span class="row" style="gap:14px">${(n=>n?`<button class="link" data-act="todo">To finish · ${n}</button>`:"")(openCount())}<button class="link" data-act="plsheet" data-p="queue">Up next</button>')
rep('h+=`</section><button class="morebtn" data-act="moresheet">','{const oc=openCount();if(oc&&!doneL.length)h+=`<button class="link" data-act="todo" style="justify-self:start;margin-top:8px">To finish · ${oc}</button>`}h+=`</section><button class="morebtn" data-act="moresheet">')
rep('<span><b>Everything done, day by day</b>','<span><b>Everything done, day by day</b>')
a=s.index('<button class="menurow" data-act="hist">');s=s[:a]+'${(n=>`<button class="menurow" data-act="todo">${blob("var(--tang)",11,"wow","",\'width="40" height="40"\')}<span><b>To finish</b><br><span class="xs muted">${n?n+" open: worksheets and projects":"Nothing left open"}</span></span>${icon("next")}</button>`)(openCount())}'+s[a:]
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v22",n,len(ins),"built",len(out))
