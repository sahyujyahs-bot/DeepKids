import os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply37.py'],check=True,capture_output=True)
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
# DeepKids Plus topics a parent adds join the plan at the child's own class (before, they only ever appeared for Class 1)
lrep('''function dkUnits(subj,lvl){if(!plusOn()||subj!=="sci"||lvl!==1)return [];return DATA.topics.map(t=>({k:"dk|"+t.id,board:"dk",subj:"sci",level:1,book:"DeepKids Plus · Science Level 1",n:t.id,title:t.name,dk:[],topic:t}))}''',
'''function dkUnits(subj,lvl){if(subj!=="sci")return [];const ex=(S.extra||{})[subj]||[],added=lvl===S.levels[subj]?DATA.topics.filter(t=>ex.includes("dk|"+t.id)):[],seen=new Set();
  return [...added,...(plusOn()&&lvl===1?DATA.topics:[])].filter(t=>!seen.has(t.id)&&seen.add(t.id)).map(t=>({k:"dk|"+t.id,board:"dk",subj:"sci",level:1,book:"DeepKids Plus · Science Level 1",n:t.id,title:t.name,dk:[],topic:t}))}''')
# after adding: say where it is, and offer a way there
rep('''${inPlan?`${isNextUp(u)?`<span class="pill completed" style="align-self:center">✓ Next up in ${SUBJ[u.subj]}</span><button class="btn line sm" data-act="plsheet" data-p="queue">See the queue</button>`:`<button class="btn sm" data-act="qnext" data-s="${u.subj}" data-k="${u.k}">Do this next</button>`}`''',
'''${inPlan?`<span class="pill completed" style="align-self:center">✓ ${isNextUp(u)?"Next up":"In the plan · no. "+qPos(u)} in ${SUBJ[u.subj]}</span>${isNextUp(u)?"":`<button class="btn sm" data-act="qnext" data-s="${u.subj}" data-k="${u.k}">Do this next</button>`}<button class="btn line sm" data-act="gotab" data-tab="week" data-seg="lessons" data-qs="${u.subj}">See the queue</button>`''')
rep('''toast(`Added. ${chT(unitBy(k))} is in the ${SUBJ[s]} queue (Planner → Up next).`,5000)''','''toast(`Added to the ${SUBJ[s]} queue as no. ${qPos(unitBy(k))||"–"}. Find it in Plan → Lesson plan.`,5000)''')
rep('''case "gotab":{navPush();''','''case "gotab":{navPush();if(b.dataset.qs)ui.qs=b.dataset.qs;''')
rep('''function queueCard(){''','''const qPos=u=>plannedUnits(u.subj).filter(z=>rank[coverage(z)]<2||z.k===u.k).findIndex(z=>z.k===u.k)+1;
function queueCard(){''')
# the queue shows at least the topics the parent added, even past the first eight
rep('''const L=plannedUnits(s).filter(u=>rank[coverage(u)]<2).slice(0,8),sh=!!(S.shuffle||{})[s],extra=(S.extra||{})[s]||[];''','''const extra=(S.extra||{})[s]||[],L0=plannedUnits(s).filter(u=>rank[coverage(u)]<2),L=L0.filter((u,i)=>i<8||extra.includes(u.k)),sh=!!(S.shuffle||{})[s];''')
rep('<span class="qn">${i+1}</span>','<span class="qn">${L0.indexOf(u)+1}</span>')
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v38 built",len(out))
