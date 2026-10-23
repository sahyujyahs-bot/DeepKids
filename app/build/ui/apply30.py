import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply29.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v26.js').read().split('\n'))
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
lrep('snz:{...(b.snz||{}),...(a.snz||{})}','snz:{...(b.snz||{}),...(a.snz||{})},rem:{...(b.rem||{}),...(a.rem||{})}')
rep('h+=pastEvCard(real);if(f)h+=nowCard(f);','h+=pastEvCard(real);if(f)h+=nowCard(f);h+=nudgeCard();')
rep('folder:folderView,','folder:folderView,rem:remView,')
rep('   case "todo":{','''   case "rem":{sfx("flip");openSheet({mode:"rem"});break}
   case "remday":{const R=REM(),d=+b.dataset.d,set=new Set(R.days||[1,2,3,4,5]);set.has(d)?set.delete(d):set.add(d);if(set.size){R.days=[...set];sfx("tap");commit()}break}
   case "remics":{saveIcs();break}
   case "nudgeoff":{S.nudgeOff={...(S.nudgeOff||{}),[today]:Date.now()+2*36e5};sfx("flip");toast("Okay. We'll check again later.");commit();break}
   case "todo":{''')
rep('if(t.dataset.tsel){','if(t.dataset.remf){REM()[t.dataset.remf]=t.value;commit();return}if(t.dataset.remck){const R=REM(),k=t.dataset.remck;if(k==="notif"&&t.checked&&typeof Notification!=="undefined"){Notification.requestPermission().then(p=>{R.notif=p==="granted";if(!R.notif)toast("Pop-ups were not allowed on this phone");commit()}).catch(()=>{R.notif=false;toast("Pop-ups aren\'t available here");commit()});return}R[k]=t.checked;commit();return}if(t.dataset.tsel){')
a=s.index('<button class="menurow" data-act="told">')
s=s[:a]+'<button class="menurow" data-act="rem">${blob("var(--sun)",8,"happy","",\'width="40" height="40"\')}<span><b>Reminders</b><br><span class="xs muted">A nudge when there\'s free time and something is waiting</span></span>${icon("next")}</button>'+s[a:]
CSS='''.greetbar{display:flex;align-items:center;gap:12px}.dring{position:relative;flex:none;width:40px;height:40px;display:grid;place-items:center}.dring svg{position:absolute;inset:0;transform:rotate(-90deg)}.dring .rbg{fill:none;stroke:rgba(43,35,64,.1);stroke-width:4}.dring .rfg{fill:none;stroke:var(--forest);stroke-width:4;stroke-linecap:round;transition:stroke-dashoffset .9s cubic-bezier(.3,1.4,.5,1)}.dring b{font:700 11px var(--display);position:relative}
.streak{color:var(--tang);font-weight:700}a.btn{text-decoration:none;display:inline-flex;align-items:center;justify-content:center}
.burst{position:fixed;z-index:9999;pointer-events:none;transform:translate(-50%,-50%);font:700 15px var(--display);color:var(--forest);background:#fff;padding:6px 12px;border-radius:99px;box-shadow:0 6px 18px rgba(43,35,64,.18);animation:dkburst .9s ease-out forwards;white-space:nowrap}
@keyframes dkburst{0%{opacity:0;transform:translate(-50%,-30%) scale(.6)}20%{opacity:1;transform:translate(-50%,-90%) scale(1.08)}70%{opacity:1;transform:translate(-50%,-140%) scale(1)}100%{opacity:0;transform:translate(-50%,-190%) scale(.95)}}
.nudge-card{display:grid;gap:10px;border:2px solid var(--sun);animation:dkglow 2.6s ease-in-out 2}.nudge-card .nrow{flex-wrap:nowrap;gap:10px;align-items:center;padding:8px 0;border-top:1px solid rgba(43,35,64,.08)}.nudge-card .nb{animation:bob 2.4s ease-in-out infinite}
@keyframes dkglow{50%{box-shadow:0 0 0 6px rgba(255,214,90,.35)}}
#main.enter>*{animation:dkin .45s cubic-bezier(.2,.8,.3,1) both}#main.enter>*:nth-child(2){animation-delay:.05s}#main.enter>*:nth-child(3){animation-delay:.1s}#main.enter>*:nth-child(4){animation-delay:.15s}#main.enter>*:nth-child(n+5){animation-delay:.2s}
@keyframes dkin{from{opacity:0;transform:translateY(12px)}}
.qtile,.iopt,.exopt,.offer,.donebar,.menurow,.chip{transition:transform .12s ease}.qtile:active,.iopt:active,.exopt:active,.donebar:active,.menurow:active,.chip:active{transform:scale(.97)}
.tr.done .ck{animation:pop .35s ease}
@media (prefers-reduced-motion: reduce){#main.enter>*,.nudge-card,.nudge-card .nb,.tr.done .ck{animation:none!important}.dring .rfg{transition:none}}
'''
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v30",n,len(ins),"built",len(out))
