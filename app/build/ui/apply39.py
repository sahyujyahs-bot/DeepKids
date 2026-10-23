import os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply38.py'],check=True,capture_output=True)
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
# Any chapter of any board or class, added from the Library, joins the child's queue at their own class
lrep('function collateAt(subj,lvl){return {board:DATA.items.filter(i=>i.subj===subj&&i.level===lvl&&boardsOn().includes(i.board)),dk:dkUnits(subj,lvl),gen:genUnits(subj,lvl)}}',
'''function collateAt(subj,lvl){return {board:DATA.items.filter(i=>i.subj===subj&&i.level===lvl&&boardsOn().includes(i.board)),dk:dkUnits(subj,lvl),gen:genUnits(subj,lvl),ex:addedUnits(subj,lvl)}}
function addedUnits(subj,lvl){if(lvl!==S.levels[subj])return [];const ex=(S.extra||{})[subj]||[];return DATA.items.filter(i=>i.subj===subj&&ex.includes(i.k)&&!(boardsOn().includes(i.board)&&i.level>=lvl))}''')
lrep('return orderUnits(s,base,m==="books"?c.gen:[...c.dk,...c.gen],m==="plus"?1:2)}','return orderUnits(s,base,m==="books"?[...c.ex,...c.gen]:[...c.ex,...c.dk,...c.gen],m==="plus"?1:2)}')
lrep('const everyUnit=()=>S.subjects.flatMap(s=>[1,2,3,4,5].flatMap(l=>{const c=collateAt(s,l);return [...c.dk,...c.board,...c.gen]}));','const everyUnit=()=>S.subjects.flatMap(s=>[1,2,3,4,5].flatMap(l=>{const c=collateAt(s,l);return [...c.dk,...c.board,...c.gen,...c.ex]}));')
# every chapter in the Library can be added (DeepKids Plus topics still need Plus)
rep(':S.subjects.includes(u.subj)&&(u.board==="gen"||(u.board==="dk"&&plusOn()))?`<button class="btn sm" data-act="qadd"',':S.subjects.includes(u.subj)&&(u.board!=="dk"||plusOn())?`<button class="btn sm" data-act="qadd"')
# Setup asks the child's class (suggested from age); the class picks the syllabus books
rep('''<div class="field"><span>Age</span><div class="ages">${[6,7,8,9,10].map(a=>`<button type="button" aria-pressed="${d.age===a}" data-age="${a}">${a}</button>`).join("")}</div></div>`;''',
'''<div class="field"><span>Age</span><div class="ages">${[6,7,8,9,10].map(a=>`<button type="button" aria-pressed="${d.age===a}" data-age="${a}">${a}</button>`).join("")}</div></div><div class="field"><span>Class this year</span><div class="ages">${[1,2,3,4,5].map(c=>`<button type="button" aria-pressed="${obCls(d)===c}" data-cls="${c}">${c}</button>`).join("")}</div><span class="xs muted">We use the class to pick the right syllabus books. You can still add any chapter from the Library.</span></div>`;''')
rep('''function obNext(){const d=ob.d;if(ob.step===0){d.child=document.getElementById("obName").value.trim();SUBJ_KEYS.forEach(s=>d.levels[s]=Math.min(5,Math.max(1,d.age-5)))}''',
'''const obCls=d=>d.cls||Math.min(5,Math.max(1,d.age-5));
function obNext(){const d=ob.d;if(ob.step===0){d.child=document.getElementById("obName").value.trim();const c=obCls(d);SUBJ_KEYS.forEach(s=>d.levels[s]=c)}''')
rep('''t=e.target.closest("[data-ob],button[data-age],''','''t=e.target.closest("[data-ob],button[data-age],button[data-cls],''')
rep('''    if(t.dataset.age){d.child=document.getElementById("obName").value;d.age=+t.dataset.age}''','''    if(t.dataset.age){d.child=document.getElementById("obName").value;d.age=+t.dataset.age}
    if(t.dataset.cls){d.child=document.getElementById("obName").value;d.cls=+t.dataset.cls}''')
rep('min-width:64px;text-align:center">Level ${l}</span>','min-width:64px;text-align:center">Class ${l}</span>',2)
rep('aria-label="Level down">','aria-label="Class down">',2)
rep('aria-label="Level up">','aria-label="Class up">',2)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v39 built",len(out))
