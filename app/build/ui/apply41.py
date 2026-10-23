import os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply40.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v41.js').read().split('\n'))
bi={name(b):i for i,b in enumerate(B) if name(b)};ins=[];nrep=0
for p in Pb:
    k=name(p)
    if k and k in bi: B[bi[k]]=p;nrep+=1
    else: ins.append(p)
k=bi['kolam'];B=B[:k+1]+ins+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
print("replaced",nrep,"inserted",len(ins))
# Plan: Tell DeepKids · Calendar · Queue · Pending · Ongoing (the To do tab folds into Plan)
rep('''  week:[["cal","Calendar","Tell DeepKids anything, and see the day, week, month or year"],["routines","Routines","Classes, tuitions, rest, outings, to-dos and notes you've added"],["lessons","Lesson plan","What comes next in each subject, and each subject's pace"]],''','''  week:[["tell","Tell DeepKids","Chat, type or add by hand. What DeepKids asked, routines, classes and rest"],["cal","Calendar","See the plan by day, week, month or year"],["queue","Queue","What comes next, by kind and subject. Drag or use the arrows to change the order"],["pending","Pending","From lessons you've done: not started yet"],["ongoing","Ongoing","Started and not finished yet"]],''')
rep('const NAV=[["today","Today"],["week","Plan"],["tasks","To do"],["journey","Progress"],["library","Library"]];','const NAV=[["today","Today"],["week","Plan"],["journey","Progress"],["library","Library"]];')
rep('''tab="tasks";ui.seg={...(ui.seg||{}),tasks:"going"};''','''tab="week";ui.seg={...(ui.seg||{}),week:"ongoing"};''')
rep('''See To do → Queues.''','''See Plan → Queue.''')
rep('''data-tab="week" data-seg="lessons" data-qs="${u.subj}"''','''data-tab="week" data-seg="queue" data-qs="${u.subj}"''')
rep(''''data-tab="week" data-seg="lessons"\'''',''''data-tab="week" data-seg="queue"\'''')
rep('''case "gotab":{navPush();if(b.dataset.qs)ui.qs=b.dataset.qs;''','''case "gotab":{navPush();if(b.dataset.qs){ui.qs=b.dataset.qs;ui.tq="les"}''')
rep('''tab="week";ui.seg={...(ui.seg||{}),week:"cal"};render();scrollTo(0,0);setTimeout(()=>{const t=document.getElementById("dumpText")''','''tab="week";ui.seg={...(ui.seg||{}),week:"tell"};render();scrollTo(0,0);setTimeout(()=>{const t=document.getElementById("dumpText")''')
rep('''const t=S.pendAI.text;tab="week";ui.seg={...(ui.seg||{}),week:"cal"};''','''const t=S.pendAI.text;tab="week";ui.seg={...(ui.seg||{}),week:"tell"};''')
rep('''   case "tqt":{''','''   case "qf":{ui.qf=b.dataset.s;sfx("tap");render();break}
   case "hty":{ui.hty=b.dataset.t;ui.hn=25;sfx("tap");render();break}
   case "hs":{ui.hs=b.dataset.s;ui.hn=25;sfx("tap");render();break}
   case "hmore":{ui.hn=(ui.hn||25)+25;render();break}
   case "morejg":{ui.jg=(ui.jg||0)+1;sfx("flip");renderSheet();break}
   case "tqt":{''')
# Progress: History instead of "chapters in progress"
rep('''  h+=journeyChapters();''','''  h+=doneHistory();''')
# Today: + Add opens the add-to-today form right there
rep('''case "quick":{sfx("flip");ui.pday=today;tab="week";ui.pv="day";render();setTimeout(()=>document.getElementById("dumpText")?.focus(),100);break}''','''case "quick":{sfx("flip");ui.qaOpen=!ui.qaOpen;render();if(ui.qaOpen)setTimeout(()=>document.getElementById("qa-t")?.focus(),80);break}''')
rep('''data-act="quick" style="margin-left:auto">+ Add</button>`}</div>`}''','''data-act="quick" style="margin-left:auto">${ui.qaOpen?"Close":"+ Add"}</button>`}</div>${ui.qaOpen&&d===today?`<section class="qa-in"><b style="font:600 17px var(--display)">Add to today</b>${quickAdd(today)}</section>`:""}`}''')
# More for today: no add form; more jokes and games
rep('''  h+=`<section class="card"><b style="font:600 17px var(--display)">Add to today</b>${quickAdd(today)}</section><button class="btn soft sm" data-act="free"''','''  h+=`<button class="btn soft sm" data-act="free"''')
rep('''<span class="tap">Tap for the answer</span>`}</button>`}).join("")}</div>`;
  h+=`<section class="card"><b style="font:600 17px var(--display)">🌱 Daily check-ins</b>''','''<span class="tap">Tap for the answer</span>`}</button>`}).join("")}</div>`;
  h+=moreJG();
  h+=`<section class="card"><b style="font:600 17px var(--display)">🌱 Daily check-ins</b>''')
CSS='''.qa-in{display:grid;gap:10px;margin:4px 0 14px;padding:14px;border-radius:18px;background:var(--surface);border:2px solid rgba(43,35,64,.08)}
'''
head=head.replace('</style>',CSS+'</style>',1)
# on the Tell DeepKids tab the list is already on the page: go to it instead of opening a second copy
rep('''case "told":{sfx("flip");ui.ted="";openSheet({mode:"told"});break}''','''case "told":{sfx("flip");ui.ted="";if(tab==="week"&&seg("week")==="tell"&&!sheet.open){render();document.querySelector('#main [data-act="ted"]')?.closest("section")?.scrollIntoView({behavior:"smooth",block:"start"});break}openSheet({mode:"told"});render();break}''')
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v41 built",len(out))
