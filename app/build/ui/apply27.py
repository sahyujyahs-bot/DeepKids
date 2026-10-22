import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply26.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v23.js').read().split('\n'))
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
def lrep(a,b):
    global logic
    if b in logic: return
    assert logic.count(a)==1,(logic.count(a),a[:90]);logic=logic.replace(a,b)
lrep('const eventsOn=date=>(S.events||[]).filter(','const eventsOn=date=>[...(S.events||[]),...(S.cal?.on?S.cal.ev||[]:[])].filter(')
rep('  h+=`<div class="tiles"><div class="tile"><b>${D.ds.length}</b>','  h+=testSection();\n  h+=`<div class="tiles"><div class="tile"><b>${D.ds.length}</b>')
lrep('const eventsOn=date=>[...(S.events||[]),...(S.cal?.on?S.cal.ev||[]:[])].filter(','const eventsOn=date=>[...(S.events||[]),...(S.cal?.on?S.cal.ev||[]:[])].filter(e=>!S.evoff?.[date+"|"+e.id]).filter(')
lrep('school:{...(b.school||{}),...(a.school||{})}','school:{...(b.school||{}),...(a.school||{})},evlog:{...(b.evlog||{}),...(a.evlog||{})},evoff:{...(b.evoff||{}),...(a.evoff||{})}')
rep('function render(){fixWork();fixRoutines();','function render(){fixWork();fixRoutines();dedupeEv();')
rep('case "tlcheck":{const date=b.dataset.date,it=dayPlan(date).find(i=>i.id===b.dataset.id);if(!it)return;','case "tlcheck":{const date=b.dataset.date,it=dayPlan(date).find(i=>i.id===b.dataset.id);if(!it)return;if(it.kind==="event"&&evGate(it,date))return;')
rep('  const mascot=it.kind==="lesson"?sblob(it.s,"happy","mascot bob"):','  if(it.kind==="event"&&!it.done&&!it.anytime&&it.at>nowMin())P.splice(0,2,`data-act="evcancel" data-id="${esc(it.ev.id)}" data-date="${today}"`,"Cancel for today");\n  const mascot=it.kind==="lesson"?sblob(it.s,"happy","mascot bob"):')
rep('${P[0].includes("tlcheck")?"":`<button class="ck" data-act="tlcheck"','${P[0].includes("tlcheck")||P[0].includes("evcancel")?"":`<button class="ck" data-act="tlcheck"')
rep('ROLE[it.who]+" · "+mins(it.dur/60)}</span></button>','(it.kind==="event"&&it.ev?evShort(it.ev):ROLE[it.who])+" · "+mins(it.dur/60)}</span></button>')
rep('function calHead(d){','function calHead(d){return calHead0(d)+cancelNote(d)}\nfunction calHead0(d){')
rep('folder:folderView,','folder:folderView,evpre:evpreView,evdone:evdoneView,')
rep('  (S.exps||[]).forEach(e=>(e.checks||[]).forEach(d=>day(d).did.push({t:"check",title:e.title})));','  Object.entries(S.evlog||{}).forEach(([k,r])=>{const j=k.indexOf("|"),e=evFind(k.slice(j+1));day(k.slice(0,j)).did.push({t:"ev",title:e?.title||"Class",r})});\n  (S.exps||[]).forEach(e=>(e.checks||[]).forEach(d=>day(d).did.push({t:"check",title:e.title})));')
rep('x.t==="check"?`<li>Checked on:','x.t==="ev"?evLogLine(x):x.t==="check"?`<li>Checked on:')
rep('   case "todo":{','''   case "evcancel":{const k=b.dataset.date+"|"+b.dataset.id;S.evoff={...(S.evoff||{}),[k]:Date.now()};sfx("flip");toast("Cancelled · undo it under the day's date");if(ui.sheet?.mode==="evpre")goBack();commit();break}
   case "evundo":{const o={...(S.evoff||{})};delete o[b.dataset.date+"|"+b.dataset.id];S.evoff=o;sfx("tap");commit();break}
   case "evf":{const F=ui.evf=ui.evf||{};["covered","hw","note"].forEach(k=>{const el=document.getElementById("evf-"+k);if(el)F[k]=el.value});F[b.dataset.k]=b.dataset.k==="went"?b.dataset.v==="1":b.dataset.v;sfx("tap");render();break}
   case "evsave":{evSave(!!b.dataset.quick);break}
   case "toplan":{const dl=document.getElementById("sheet");ui.sheet=null;if(dl?.open)dl.close();tab="week";render();scrollTo(0,0);setTimeout(()=>{const t=document.getElementById("dumpText");if(t){t.scrollIntoView({block:"center"});t.focus()}},200);break}
   case "todo":{''')
rep('<section class="sec"><div class="sech"><h3>Classes, outings and to-dos</h3></div>','<section class="sec"><div class="sech"><h3>Classes, outings and to-dos</h3><button class="link" data-act="toplan">+ Add</button></div>')
CSS='''.chat .row .chip{pointer-events:auto}
'''
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v27",n,len(ins),"built",len(out))
