import os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply56.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v57.js').read().split('\n'))
bi={name(b):i for i,b in enumerate(B) if name(b)};ins=[];nrep=0
for p in Pb:
    k=name(p)
    if k and k in bi: B[bi[k]]=p;nrep+=1
    else: ins.append(p)
k=bi['kolam'];B=B[:k+1]+ins+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
print("replaced",nrep,"inserted",len(ins))
# Library: a Combined button that shows the whole ladder; Add to the plan on every chapter
rep('''<div class="row chips">${["ncert","cambridge","nios","waldorf","dk"].map(b=>`<button class="chip" aria-pressed="${B===b}" data-act="bb" data-b="${b}">${BNAME[b]}</button>`).join("")}</div>''','''<div class="row chips">${["combined","ncert","cambridge","nios","waldorf","dk"].map(b=>`<button class="chip" aria-pressed="${B===b}" data-act="bb" data-b="${b}">${b==="combined"?"DeepKids Combined":BNAME[b]}</button>`).join("")}</div>${B==="combined"?combinedBrowse():`''')
rep('''units.map(u=>topicRow(u).replace("</b><br>",`</b>${u.c?.p?` <span class="pill completed" style="font-size:11px">${u.c.p.days.length} parts</span>`:""}<br>`)).join("")||`<p class="note">${(DATA.notes[B]||{})[sj+"|"+lv]||(B==="ncert"?DATA.notes.ncert[sj+"|"+lv]:"")||"Nothing here yet."}</p>`}`;''','''units.map(u=>topicRow(u).replace("</b><br>",`</b>${u.c?.p?` <span class="pill completed" style="font-size:11px">${u.c.p.days.length} parts</span>`:""}<br>`)).join("")||`<p class="note">${(DATA.notes[B]||{})[sj+"|"+lv]||(B==="ncert"?DATA.notes.ncert[sj+"|"+lv]:"")||"Nothing here yet."}</p>`}`}`;''')
rep('''S.subjects.includes(u.subj)&&(u.board!=="dk"||plusOn())?qPick''','''(u.board!=="dk"||plusOn())?qPick''')
rep('''else if(k==="queue")h+=queuesView()+''','''else if(k==="queue")h+=combinedNote()+queuesView()+''')
rep('''case "rt":{ui.rt=b.dataset.t;''','''case "libcombined":{tab="library";ui.lt="topics";ui.bb="combined";ui.bl=S.levels?.sci;sfx("flip");render();window.scrollTo(0,0);break}
case "rt":{ui.rt=b.dataset.t;''')
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v57 built",len(out))
