import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply11.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v12.js').read().split('\n'))
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
# the lesson flow leads into everything for the chapter
rep('  if(it.u.c?.x)h+=`<button class="btn soft sm" data-act="chapter" data-k="${it.u.k}" style="justify-self:start">Whole chapter</button>`;\n  if(it.u.c?.x?.guide)h+=`<details class="card"><summary style="cursor:pointer;font:600 16px var(--display)">Parent guide for this chapter</summary><p class="sm">${esc(it.u.c.x.guide)}</p></details>`;\n  return h}','  return h+chapterHub(it.u)}')
rep('<button class="btn soft" data-act="pstep" data-d="-1">Back</button></div></section>`;return h}','<button class="btn soft" data-act="pstep" data-d="-1">Back</button></div></section>`;return h+chapterHub(it.u)}')
# on Today, a lesson opens the flow; the chapter page is for days that aren't today
rep('<button class="btn soft sm" data-act="chapter" data-k="${it.u.k}">Chapter</button>','${!isT||it.done?`<button class="btn soft sm" data-act="chapter" data-k="${it.u.k}">Everything for this chapter</button>`:""}')
# Journey lists every chapter started or done
a=s.index('function viewJourney(){');b=s.index('\n  return h}',a)
s=s[:a]+s[a:b]+'\n  h+=journeyChapters();'+s[b:]
rep('   case "lt":{','   case "hubres":{ui.hubres=true;renderSheet();break}\n   case "jall":{ui.jall=true;render();break}\n   case "lt":{')
CSS='\n.card.hub{gap:0;padding-top:16px;padding-bottom:16px}.hub summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:8px}.hub summary::-webkit-details-marker{display:none}.hub summary b{font:600 16.5px var(--display)}.hub summary::after{content:"›";font-size:22px;color:var(--muted);transition:transform .2s}.hub[open] summary::after{transform:rotate(90deg)}.hubb{display:grid;gap:8px;margin-top:10px}\n'
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v12",n,len(ins),"built",len(out))
