import re, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
def blocks(lines):
    out=[];cur=[]
    for l in lines:
        if l and not l[0].isspace() and cur: out.append(cur);cur=[]
        cur.append(l)
    if cur: out.append(cur)
    return out
name=lambda b:(re.match(r'(?:async function|function|const|let) (\w+)',b[0]) or [None,None])[1]
B=blocks(open('ui_v5_base.js').read().split('\n'));Pb=blocks(open('patch_v6.js').read().split('\n'))
bi={name(b):i for i,b in enumerate(B) if name(b)};ins=[];n=0
for p in Pb:
    k=name(p)
    if k and k in bi: B[bi[k]]=p;n+=1
    else: ins.append(p)
k=bi['kolam'];B=B[:k+1]+ins+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(s.count(a),a[:100]);s=s.replace(a,b)
# itemDetail: refreshers and the weekly planning reminder
rep('function itemDetail(it,date){const isT=date===today;','''function itemDetail(it,date){const isT=date===today;
  if(it.kind==="refresh")return `<p class="sm" style="font-weight:700">${esc(it.rf.body)}</p><p class="xs muted">A quick return to ${esc(it.rf.u.title)}, so it stays fresh.</p><div class="row"><button class="btn soft sm" data-act="chapter" data-k="${it.rf.u.k}">Open the topic</button></div>`;
  if(it.kind==="plan")return `<p class="sm" style="font-weight:700">${esc(it.sub)}</p><div class="row"><button class="btn sm" data-act="quickplan">Open the Planner</button></div>`;''')
rep('const KICO={lesson:"read",prep:"prep",warm:"warm",exps:"exps",event:"event",todo:"prep"};','const KICO={lesson:"read",prep:"prep",warm:"warm",exps:"exps",event:"event",todo:"prep",refresh:"game",plan:"week"};')
# Today: day type and "For you", kept small
rep('<div class="sech"><h3>Today</h3><button class="link" data-act="quick">+ Add to today</button></div>${timeline(today)}',
    '<div class="sech"><h3>Today</h3><button class="link" data-act="quick">+ Add to today</button></div><div class="row" style="justify-content:space-between"><div class="whos"><button aria-pressed="${dayTypeOf(today)==="full"}" data-act="daytype" data-t="full">Full day</button><button aria-pressed="${dayTypeOf(today)==="busy"}" data-act="daytype" data-t="busy">Busy day</button></div>${learnItems().length?`<button class="link" data-act="learn">For you · ${learnItems().length} to read</button>`:""}</div>${timeline(today)}')
# Planner: calendar import and the topic queue
rep('${dumpCard()}</section>`;','${dumpCard()}${calendarCard()}</section>`;\n  h+=queueCard();')
# Library: topics first
rep('function viewLibrary(){const t=ui.lt||"have",','function viewLibrary(){const t=ui.lt||"topics",')
rep('[["have","What we have"],["suggest","Our picks"],["read","Read"],["watch","Watch"]]','[["topics","Topics"],["have","What we have"],["suggest","Our picks"],["read","Read"],["watch","Watch"]]')
rep('  if(t==="have"){const seen=','  if(t==="topics")h+=topicsTab();\n  if(t==="have"){const seen=')
rep('const V={player:playerView,','const V={learn:learnView,player:playerView,')
# settings: how you learn and exam track
rep('   <section class="card"><span class="eyebrow">Syllabus</span>','''   <section class="card"><span class="eyebrow">How you learn</span><select class="inp" id="sMode">${Object.entries(MODES).map(([k,[n]])=>`<option value="${k}" ${modeOf()===k?"selected":""}>${n}</option>`).join("")}</select><p class="xs muted">${esc(MODES[modeOf()][1])}</p><label class="toggle" style="box-shadow:none;padding:0"><input type="checkbox" id="sExam" ${S.exam?"checked":""}><span><b style="font:600 16px var(--display)">Exam track</b><br><span class="xs muted">Every syllabus chapter comes first, in a sensible order, so nothing is missed before exams.</span></span></label></section>
   <section class="card"><span class="eyebrow">Syllabus</span>''')
# onboarding: choose how you learn
s,nsub=re.subn(r'\$\{d\.board!=="none"\?`<label class="toggle"><input type="checkbox" id="obPlus".*?</label>`:""\}',
  lambda m:'${d.board!=="none"?`<h2 style="font-size:24px;margin-top:8px">How do you want to learn?</h2><div class="choices">${Object.entries(MODES).map(([k,[n,desc,c]],i)=>`<button type="button" class="choice" aria-pressed="${(d.mode||"booksplus")===k}" data-mode="${k}">${blob(c,40+i,(d.mode||"booksplus")===k?"happy":"calm")}<span><b>${n}</b><span>${desc}</span></span></button>`).join("")}</div><label class="toggle"><input type="checkbox" id="obExam" ${d.exam?"checked":""}><span><b style="font:600 17px var(--display)">Exam track</b><br><span class="sm muted">Planning for board or NIOS exams? Every syllabus chapter stays first.</span></span></label>`:`<p class="note">DeepKids Plus only: our own topics and lesson plans, drawing on every syllabus.</p>`}',s,flags=re.S)
assert nsub==1,nsub
rep('hpd:S.hpd||DEF_HPD}))};render()}','hpd:S.hpd||DEF_HPD,mode:S.mode||(S.plus?"booksplus":"books"),exam:!!S.exam}))};render()}')
rep('if(ob.step===4){Object.assign(S,d,{setup:true});','if(ob.step===4){if(d.board==="none")d.mode="plus";d.mode=d.mode||"booksplus";d.plus=d.mode!=="books";Object.assign(S,d,{setup:true});')
rep('t=e.target.closest("[data-ob],button[data-age],button[data-b],button.choice[data-s]")','t=e.target.closest("[data-ob],button[data-age],button[data-b],button.choice[data-s],button[data-mode]")')
rep('if(t.dataset.b){d.board=t.dataset.b;if(d.board==="none")d.plus=true}','if(t.dataset.b){d.board=t.dataset.b;if(d.board==="none")d.plus=true}\n    if(t.dataset.mode)d.mode=t.dataset.mode;')
# new actions
rep('   case "pin":{S.pin={...(S.pin||{}),[b.dataset.s]:k};sfx("ok");toast("That\'s up next");sheet.close();commit();break}',
'''   case "pin":{const s=b.dataset.s;S.next={...(S.next||{}),[s]:[k,...((S.next||{})[s]||[]).filter(x=>x!==k)]};sfx("ok");toast("That's up next");sheet.close();commit();break}
   case "daytype":{S.dayType={...(S.dayType||{}),[today]:b.dataset.t};sfx("tick");toast(b.dataset.t==="busy"?"Busy day: shorter lessons":"Full day");commit();break}
   case "learn":{sfx("flip");openSheet({mode:"learn"});break}
   case "ptype":{ui.ptype=b.dataset.t;sfx("tap");renderSheet();break}
   case "ppick":{S.planPick={...(S.planPick||{}),[k]:{...((S.planPick||{})[k]||{}),[b.dataset.t]:b.dataset.o}};sfx("ok");toast("Plan chosen");commit();break}
   case "tfind":{ui.tq=document.getElementById("tq")?.value||"";ui.terr="";sfx("tap");render();break}
   case "tsearch":{ui.tq=b.dataset.q;ui.lt="topics";tab="library";if(sheet.open)sheet.close();render();scrollTo(0,0);break}
   case "tgen":{sfx("tap");genTopic();break}
   case "qsub":{ui.qs=b.dataset.s;sfx("tap");render();break}
   case "shuffle":{const s=b.dataset.s;S.shuffle={...(S.shuffle||{}),[s]:!(S.shuffle||{})[s]};S.seed={...(S.seed||{}),[s]:Math.floor(Math.random()*9999)};sfx("flip");commit();break}
   case "reshuffle":{const s=b.dataset.s;S.seed={...(S.seed||{}),[s]:Math.floor(Math.random()*9999)};sfx("flip");commit();break}
   case "exam":{S.exam=!S.exam;sfx("tick");toast(S.exam?"Exam track on: syllabus first":"Exam track off");commit();break}
   case "qnext":{const s=b.dataset.s;S.next={...(S.next||{}),[s]:[k,...((S.next||{})[s]||[]).filter(x=>x!==k)]};S.later={...(S.later||{}),[s]:((S.later||{})[s]||[]).filter(x=>x!==k)};sfx("ok");toast("Up next");commit();break}
   case "qlater":{const s=b.dataset.s;S.later={...(S.later||{}),[s]:[...((S.later||{})[s]||[]).filter(x=>x!==k),k]};S.next={...(S.next||{}),[s]:((S.next||{})[s]||[]).filter(x=>x!==k)};sfx("flip");toast("Moved to later");commit();break}
   case "qrem":{const s=b.dataset.s;S.extra={...(S.extra||{}),[s]:((S.extra||{})[s]||[]).filter(x=>x!==k)};S.next={...(S.next||{}),[s]:((S.next||{})[s]||[]).filter(x=>x!==k)};sfx("flip");commit();break}
   case "qadd":{const s=b.dataset.s;S.extra={...(S.extra||{}),[s]:[...new Set([...((S.extra||{})[s]||[]),k])]};sfx("ok");toast("Added to Up next");commit();break}
   case "lt2":{ui.lt="topics";tab="library";render();scrollTo(0,0);break}
   case "quickplan":{tab="week";render();scrollTo(0,0);break}''')
# change listener: exam, mode, calendar file
rep('  if(t.id==="dumpImg"){','''  if(t.id==="obExam"&&ob){ob.d.exam=t.checked;return}
  if(t.id==="sMode"){S.mode=t.value;S.plus=t.value!=="books";sfx("tick");commit();return}
  if(t.id==="sExam"){S.exam=t.checked;sfx("tick");commit();return}
  if(t.id==="icsFile"&&t.files?.[0]){let items=[];try{items=parseICS(await t.files[0].text())}catch(err){}ui.dump={items,questions:[],text:"",err:items.length?"":"No upcoming events found in that file."};sfx(items.length?"ok":"no");render();setTimeout(()=>document.querySelector(".dump")?.scrollIntoView({behavior:"smooth",block:"start"}),50);return}
  if(t.id==="dumpImg"){''')
# boot: the shared topic library
rep('(async()=>{try{SAMPLE=','(async()=>{try{DBH=await window.claude?.use?.("db")||null;const us=await window.claude?.use?.("user");UID=us?await us.id().catch(()=>null):null;if(DBH){const sn=await DBH.collection("topics").limit(500).get().catch(()=>null);if(sn)SHARED.topics=sn.docs.map(d=>{const g=d.data()||{};return {...g,id:d.id,level:Math.min(5,Math.max(1,+g.level||1)),hours:+g.hours||3}}).filter(g=>g.name&&SUBJ[g.subj]);_all=null}}catch(e){}try{SAMPLE=')

# profile: chip taps no longer redraw the form (which wiped typed text); profile reachable from the header
rep('case "phelp":{S.parent=S.parent||{};const h=new Set(S.parent.help||[]);h.has(b.dataset.s)?h.delete(b.dataset.s):h.add(b.dataset.s);S.parent.help=[...h];sfx("tap");renderSheet();break}',
    'case "phelp":{b.setAttribute("aria-pressed",b.getAttribute("aria-pressed")!=="true");sfx("tap");break}')
rep('S.parent={...(S.parent||{}),name:g("pName").trim(),langs:g("pLang").trim()};',
    'S.parent={...(S.parent||{}),name:g("pName").trim(),langs:g("pLang").trim(),help:[...document.querySelectorAll(\'#sheetBody [data-act="phelp"][aria-pressed="true"]\')].map(x=>x.dataset.s),saved:Date.now()};')
rep('case "qwho":{ui.qwho=b.dataset.w;sfx("tap");const sc=b.closest("#sheetBody")?renderSheet():render();break}',
    'case "qwho":{ui.qwho=b.dataset.w;b.parentElement.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));sfx("tap");break}')
rep('if(S.setup&&!S.parent?.name)','if(S.setup&&!S.parent?.saved&&!S.parent?.name)')
rep('<p class="xs muted">Wake-up, prep times and where you\'d like help</p>',
    '<p class="xs muted">${S.parent?.saved||S.parent?.name?`Wakes ${clock(hm((S.alarm||{}).time||"06:30"))} · prep ${clock(hm(D().prepAt))} and ${clock(hm(D().eveAt))}${(S.parent.help||[]).length?" · help with "+S.parent.help.map(x=>SUBJ[x]).join(", "):""}${S.parent.langs?" · "+esc(S.parent.langs):""}`:"Not set up yet"}</p>')
s=s.replace("(async()=>{try{DBH=",'document.getElementById("hello").onclick=()=>{if(!ob&&S.setup){sfx("flip");openSheet({mode:"parent"})}};(async()=>{try{DBH=',1)

# the parent's name: what they saved, else their claude.ai account's first name
rep('S.parent?.name?", "+S.parent.name:"")+"! Time to get up")','pname()?", "+pname():"")+"! Time to get up")')
rep('S.parent?.name?", "+esc(S.parent.name):""}!</h1>','pname()?", "+esc(pname()):""}!</h1>')
rep('S.parent?.name?"Hi, "+esc(S.parent.name):"Hi there!"}','pname()?"Hi, "+esc(pname()):"Hi there!"}')
rep('S.parent?.name?esc(S.parent.name):"Your profile"}','pname()?esc(pname()):"Your profile"}')
rep('value="${esc(p.name||"")}" placeholder="Priya"','value="${esc(p.name||pname())}" placeholder="Your name"')
s=s.replace('let DBH=null,UID=null,_all=null;','let DBH=null,UID=null,_all=null,ACCT="";\nconst pname=()=>(S.parent&&S.parent.name)||ACCT;',1)
s=s.replace('UID=us?await us.id().catch(()=>null):null;','UID=us?await us.id().catch(()=>null):null;if(us){const me=await us.me().catch(()=>null);ACCT=String(me?.name||"").trim().split(/\\s+/)[0]||"";render()}',1)

exec(open('reps7.py').read())
open('new_ui.js','w').write(s);print("ui ok",n,len(ins))
# logic tweak: added topics below the child's level still count at the current level
T='/home/user/DeepKids/app/build/template.html';t=open(T).read()
a='SHARED.topics.filter(g=>g.subj===subj&&(g.level||1)===lvl&&ex.includes("gen|"+g.id))'
if a in t: t=t.replace(a,'SHARED.topics.filter(g=>g.subj===subj&&((g.level||1)===lvl||(lvl===S.levels[subj]&&(g.level||1)<lvl))&&ex.includes("gen|"+g.id))')
logic=t[t.index('<script>')+8:t.index('/* ================= UI')]
head=open('new_head.html').read().replace('</style>',open('v5.css').read()+'\n'+open('v6.css').read()+'\n</style>',1)
open(T,'w').write(head+'\n<script>\n'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write(out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("built",len(out))
