import os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply39.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v40.js').read().split('\n'))
bi={name(b):i for i,b in enumerate(B) if name(b)};ins=[];nrep=0
for p in Pb:
    k=name(p)
    if k and k in bi: B[bi[k]]=p;nrep+=1
    else: ins.append(p)
k=bi['kolam'];B=B[:k+1]+ins+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
print("replaced",nrep,"inserted",len(ins))
# --- DeepKids topics: tagged for Classes 1-5 in EVS, queued at the child's class
lrep('return [...added,...(plusOn()&&lvl===1?DATA.topics:[])]','return [...added,...(plusOn()&&lvl===S.levels[subj]?DATA.topics.filter(t=>(t.cls||[1,2,3,4,5]).includes(lvl)):[])]')
# --- a daily DeepKids topic, picked to fit the day's lessons
lrep('''\n  if(lessons.length)items.push({id:"lunch"''','''\n  if(lessons.some(l=>!l.bonus)&&plusOn()&&S.subjects.includes("sci")&&dkMinsOf()>0){const pk=dkPick(date,lessons);if(pk){const dur=dkMinsOf();cur+=+d.brk;items.push({id:"dkt",at:place(dur),dur,who:"both",kind:"dkt",u:pk.u,title:"DeepKids topic: "+pk.u.title,sub:pk.why,done:!!S.tl[date+"|dkt"]})}}
  if(lessons.length)items.push({id:"lunch"''')
lrep('title:"Check ongoing experiments",','title:"Daily check-ins",')
rep('''refresh:[`data-act="refresh" data-date="${today}"`,"Play it"]}''','''refresh:[`data-act="refresh" data-date="${today}"`,"Play it"],dkt:[`data-act="chapter" data-k="${it.u?.k}"`,"Open the topic"]}''')
# --- Today card: tap the line under the title for what's in it; one quiet link for the rest
rep('''<h2>${esc(title)}</h2><p class="sub">${esc(sub)}</p>''','''<h2>${esc(title)}</h2><button class="sub subtap" data-act="nowmore" data-id="${it.id}" aria-expanded="${!!open}">${esc(sub)} <span class="chev">${open?"▲ Hide":"▼ What's in it"}</span></button>''')
rep('''<div class="row" style="gap:18px"><button class="link sm" data-act="nowmore" data-id="${it.id}">${open?"Hide details":"Details"}</button>${OURS(it)&&it.kind!=="exps"?`<button class="link sm" data-act="iopts" ${a}>Did it already, later or skip?</button>`:""}</div>''','''${OURS(it)&&it.kind!=="exps"?`<button class="nowalt" data-act="iopts" ${a}>Already did it, later, or skip ›</button>`:""}''')
# --- the To do section
rep('const NAV=[["today","Today"],["week","Plan"],["journey","Progress"],["library","Library"]];','const NAV=[["today","Today"],["week","Plan"],["tasks","To do"],["journey","Progress"],["library","Library"]];')
rep('''  journey:[["overview"''','''  tasks:[["going","Started","Started and not finished yet: lessons, worksheets, quizzes, projects and more"],["new","Not started","From lessons you've done: things that weren't started yet"],["queue","Queues","What comes next for each kind. Drag or use the arrows to change the order"]],
  journey:[["overview"''')
rep(''' journey:'<path d="M3 20l6.5-11''',''' tasks:'<path d="M10 6.5h10M10 12h10M10 17.5h10"/><path d="M3.5 6.5l1.6 1.6 2.7-2.9M3.5 12l1.6 1.6 2.7-2.9M3.5 17.5l1.6 1.6 2.7-2.9"/>',
 journey:'<path d="M3 20l6.5-11''')
rep('week:viewPlanner,library:viewLibrary,journey:viewJourneyTabs}','week:viewPlanner,tasks:viewTasks,library:viewLibrary,journey:viewJourneyTabs}')
rep('folder:folderView,plus:plusView,','folder:folderView,plus:plusView,qzs:qzsView,')
rep('''   case "todo":{sfx("flip");openSheet({mode:"todo"});break}''','''   case "todo":{navPush();const dl=document.getElementById("sheet");if(dl?.open){ui.sheet=null;dl.close()}tab="tasks";ui.seg={...(ui.seg||{}),tasks:"going"};sfx("flip");render();scrollTo(0,0);break}
   case "qpick":{ui.qpick=b.dataset.r||null;sfx("tap");render();if(sheet.open)renderSheet();break}
   case "qput":{const ty=b.dataset.ty,r=b.dataset.r,n=qPut(ty,b.dataset.s,r,b.dataset.w);ui.qpick=null;ui.flash=r;setTimeout(()=>{ui.flash=null},2500);sfx("ok");toast(`${b.dataset.w==="first"?"Put first":"Added at the end"}: no. ${n} in the ${ty==="les"?SUBJ[b.dataset.s]:WT[ty][0].toLowerCase()} queue. See To do → Queues.`,4500);render();if(sheet.open)renderSheet();break}
   case "qmv":{const ty=b.dataset.ty,s=b.dataset.s,L=qItems(ty,s).map(x=>x.ref),i=L.indexOf(b.dataset.r),j=i+ +b.dataset.d;if(i<0||j<0||j>=L.length)break;[L[i],L[j]]=[L[j],L[i]];ui.flash=b.dataset.r;setTimeout(()=>{ui.flash=null},1500);sfx("tap");setOrder(ty,s,L);break}
   case "qshuf":{const ty=b.dataset.ty,s=b.dataset.s;if(ty==="les"){S.next={...(S.next||{}),[s]:[]};S.shuffle={...(S.shuffle||{}),[s]:true};S.seed={...(S.seed||{}),[s]:Math.floor(Math.random()*9999)};sfx("flip");commit();toast("Shuffled. Each topic still comes after what it needs first.")}else{const L=qItems(ty,s).map(x=>x.ref);for(let i=L.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[L[i],L[j]]=[L[j],L[i]]}sfx("flip");setOrder(ty,s,L);toast("Shuffled")}break}
   case "qx":{const ty=b.dataset.ty,r=b.dataset.r,key=r.slice(r.indexOf(":")+1);if(ty==="les"){const s=b.dataset.s;S.extra={...(S.extra||{}),[s]:((S.extra||{})[s]||[]).filter(x=>x!==key)};S.next={...(S.next||{}),[s]:((S.next||{})[s]||[]).filter(x=>x!==key)}}else{const W=WK();W[key]={...(W[key]||{}),st:"skip"};WQ()[ty]=(WQ()[ty]||[]).filter(x=>x!==r)}sfx("flip");commit();toast("Taken out. You can bring it back from its chapter.");break}
   case "tqt":{ui.tq=b.dataset.t;ui.qpick=null;sfx("tap");render();break}
   case "qzs":{sfx("flip");openSheet({mode:"qzs",k,n:+b.dataset.n});break}
   case "dkmin":{const i=Math.max(0,DKSTEPS.indexOf(dkMinsOf()));S.dkMins=DKSTEPS[Math.min(DKSTEPS.length-1,Math.max(0,i+ +b.dataset.d))];sfx("tap");commit();break}''')
# --- queue from inside a lesson: front or end
rep('''(st==="planned"?a("none","Take out of pipeline","link"):a("planned","+ Pipeline","soft"))''','''(st==="planned"?a("none","Take out of the queue","link"):qPick(wType(u,id),u.subj,wType(u,id)+":"+u.k+"|"+id,"+ Queue","btn xs soft"))''')
rep('''st==="planned"?`In your pipeline since ${fmt(w.planned)}`''','''st==="planned"?`In the ${WT[wType(u,id)][0].toLowerCase()} queue since ${fmt(w.planned)}`''')
# --- Library: add to the front or the end
rep('''`<button class="btn sm" data-act="qadd" data-s="${u.subj}" data-k="${u.k}">${icon("plus")}Add to the plan</button>`''','''qPick("les",u.subj,"les:"+u.k,icon("plus")+"Add to the plan")''')
# --- tapping a suggested topic: it lights up in the list
rep('''case "qadd":{''','''case "qadd":{ui.flash=k;setTimeout(()=>{ui.flash=null},2500);setTimeout(()=>document.querySelector(".flash")?.scrollIntoView({block:"center",behavior:"smooth"}),120);''')
rep('''<div class="qrow ${SC(u.subj)}">''','''<div class="qrow ${SC(u.subj)}${u.k===ui.flash?" flash":""}">''')
# --- Daily check-ins (was "Growing and ongoing")
rep('''<b style="font:600 17px var(--display)">Growing and ongoing</b>''','''<b style="font:600 17px var(--display)">🌱 Daily check-ins</b><p class="xs muted">For experiments that take days, like seeds sprouting or crystals growing. Tick once a day and DeepKids counts the days.</p>''')
rep('''||`<p class="xs muted">Seeds, crystals and projects appear here with a daily check.</p>`}''','''||`<p class="sm"><b>Nothing running yet. Try one of these:</b></p>${ideasHtml()}`}''')
rep('''toast("Added to Growing and ongoing")''','''toast("Started. Tick it once a day under Daily check-ins.")''')
# --- Pace: DeepKids topics time
rep('''finishing around ${fmt(cur[cur.length-1].date)}`:""}</p></div>`}).join("")}</section>`;}''','''finishing around ${fmt(cur[cur.length-1].date)}`:""}</p></div>`}).join("")}${dkPaceCard()}</section>`;}''')
# --- lesson head: today's steps, book or DeepKids
rep('''bk:srcOf(s),html:srcLine(s)''','''bk:srcOf(s),html:srcLine(s)''',0)
rep('''html:srcLine(s)+packStep(u,s)''','''bk:srcOf(s),html:srcLine(s)+packStep(u,s)''')
rep('''const ord=SECS.map(s=>s[0]);return out.map((x,i)=>({x,i})).sort((a,b)=>ord.indexOf(a.x.sec)-ord.indexOf(b.x.sec)||a.i-b.i).map((o,j)=>({...o.x,html:(j===0?pkHead(d):"")+o.x.html}))}''','''const ord=SECS.map(s=>s[0]),srt=out.map((x,i)=>({x,i})).sort((a,b)=>ord.indexOf(a.x.sec)-ord.indexOf(b.x.sec)||a.i-b.i).map(o=>o.x),F=srt.map(x=>({title:x.title,bk:!!x.bk?.book,pages:x.bk?.pages||[]}));return srt.map((x,j)=>({...x,html:(j===0?pkHead(d,F):"")+x.html}))}''')
CSS='''.trow{display:flex;gap:10px;align-items:center;padding:12px;border-radius:16px;background:var(--surface)}.trow b{font:600 15.5px var(--display)}.tic{font-size:22px;flex:none}
.qlist{display:grid;gap:8px}.qrow2{display:flex;gap:8px;align-items:center;padding:10px 10px 10px 4px;border-radius:16px;background:var(--surface);transition:box-shadow .15s}.qrow2 b{font:600 15px var(--display)}.qrow2.drag{box-shadow:0 8px 22px rgba(43,35,64,.22);position:relative;z-index:2;opacity:.95}
.dh{touch-action:none;cursor:grab;font-size:22px;padding:8px 6px;color:var(--muted);user-select:none;-webkit-user-select:none}.iconbtn.qb{width:34px;height:34px;font-size:12px}
.qpick{display:inline-flex;gap:6px;align-items:center;flex-wrap:wrap}.qtypes{overflow-x:auto;flex-wrap:nowrap}.qtypes small{opacity:.7}
@keyframes dkflash{0%,60%{box-shadow:0 0 0 3px var(--sun,#FFD54F)}100%{box-shadow:0 0 0 0 transparent}}.flash{animation:dkflash 2.2s ease-out}
.subtap{display:block;background:none;border:0;padding:0;margin:0;text-align:left;font:inherit;font-weight:700;color:var(--muted);cursor:pointer}.subtap .chev{font-size:13px;font-weight:600;white-space:nowrap;opacity:.85}
.nowalt{background:none;border:0;padding:6px 0 0;font:600 14px var(--body,system-ui);color:var(--ink,#2B2340);opacity:.7;cursor:pointer;text-align:left}
.phead{display:grid;gap:6px;margin-bottom:10px}.flow{display:flex;flex-wrap:wrap;gap:6px}.fl{display:inline-flex;gap:5px;align-items:center;font-size:12.5px;padding:4px 10px;border-radius:999px}.fl i{font-style:normal;font-weight:700}.fl.bk{background:#FFF0C9;color:#5C4300}.fl.dk{background:#E3F3EC;color:#24553A}
'''
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v40 built",len(out))
