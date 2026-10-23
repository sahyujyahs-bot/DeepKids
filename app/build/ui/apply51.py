import os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply50.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v51.js').read().split('\n'))
bi={name(b):i for i,b in enumerate(B) if name(b)};ins=[];nrep=0
for p in Pb:
    k=name(p)
    if k and k in bi: B[bi[k]]=p;nrep+=1
    else: ins.append(p)
k=bi['kolam'];B=B[:k+1]+ins+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
print("replaced",nrep,"inserted",len(ins))
# Combined board names and description
rep('["combined","Combined","All three boards, mapped together","var(--peri)"]','["combined","Combined","Every topic from NCERT, Cambridge and NIOS, at the earliest class, deeper each year","var(--peri)"]')
rep('const BOARDN={ncert:"NCERT / CBSE",','const BOARDN={combined:"DeepKids Combined",ncert:"NCERT / CBSE",')
rep('const BNAME={ncert:"NCERT",','const BNAME={combined:"Combined",ncert:"NCERT",')
# Combined chapter tabs: think deeper, game and project, books
rep('''voices:"Other voices",...(resourcesFor(u).length?{res:"Resources"}:{}),''','''voices:"Other voices",...(c.p.big?{think:"Think deeper",game:"Game & project",books:"Books"}:{}),...(resourcesFor(u).length?{res:"Resources"}:{}),''')
rep('''if(c?.p)h+=packTab(u,t);''','''if(c?.p)h+=packTab(u,t)+combTab(u,t);''')
rep('''   case "tqt":{''','''   case "cgprint":{const u=unitByK(k);if(u?.c?.p?.game){sfx("ok");printDoc(wsPage(gameSheet(u),u))}break}
   case "cgview":{sfx("flip");openSheet({mode:"wsv",k,game:1});break}
   case "tqt":{''')
rep('''function wsViewSheet(){const P=ui.sheet,u=unitByK(P.k),w=wsOf(u)[P.i];''','''function wsViewSheet(){const P=ui.sheet,u=unitByK(P.k),w=P.game?gameSheet(u):wsOf(u)[P.i];''')
rep('''.wboard{width:100%;border-collapse:collapse;table-layout:fixed}''','''.wboard{width:100%;border-collapse:collapse;table-layout:fixed}.wrules{margin:4px 0 0 18px;font-size:13px;line-height:1.5}.wcards{display:grid;grid-template-columns:repeat(4,1fr);gap:0}.wcard{border:1.5px dashed #2B2340;height:92px;padding:8px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;font:600 13px/1.25 inherit;break-inside:avoid}.wcard small{font-weight:400;font-size:10px;color:#666;margin-top:6px;transform:rotate(180deg)}.wcard.job{background:var(--sun);font-size:15px}''')
rep('''<button class="btn accent sm" data-act="wsprint" data-k="${u.k}" data-i="${P.i}">🖨️ Print</button><button class="btn soft sm" data-act="wssave" data-k="${u.k}" data-i="${P.i}">Save as a file</button>''','''${P.game?`<button class="btn accent sm" data-act="cgprint" data-k="${u.k}">🖨️ Print</button>`:`<button class="btn accent sm" data-act="wsprint" data-k="${u.k}" data-i="${P.i}">🖨️ Print</button><button class="btn soft sm" data-act="wssave" data-k="${u.k}" data-i="${P.i}">Save as a file</button>`}''')
# Combined chapters count as part of the syllabus; the chapter hero shows no number for them
lrep('''const boardsOn=()=>S.board==="combined"?["ncert","cambridge","nios"]''','''const boardsOn=()=>S.board==="combined"?["combined","ncert","cambridge","nios"]''')
rep(r'''<span class="n">${/^\d+$/.test(u.n)?u.n:esc(u.n)}</span>''',r'''<span class="n">${u.board==="combined"?"":/^\d+$/.test(u.n)?u.n:esc(u.n)}</span>''')
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v51 built",len(out))
