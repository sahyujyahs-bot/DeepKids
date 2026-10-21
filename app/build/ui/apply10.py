import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply9.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v10.js').read().split('\n'))
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
rep('const tabs=c?.p?{overview:"Overview",days:"Day plan",ws:"Worksheets",lab:"Experiments",voices:"Other voices",','const tabs=c?.p?{overview:"Overview",days:"Day plan",ws:"Worksheets",lab:"Experiments",voices:"Other voices",...(resourcesFor(u).length?{res:"Resources"}:{}),')
rep('if(c?.p)h+=packTab(u,t);','if(c?.p)h+=packTab(u,t);if(t==="res")h+=resTab(u);')
rep('[["topics","Topics"],["have","What we have"]','[["topics","Topics"],["science","Science resources"],["have","What we have"]')
rep('if(t==="topics")h+=topicsTab();','if(t==="topics")h+=topicsTab();if(t==="science")h+=scienceTab();')
rep('   case "lt":{','   case "rt":{ui.rt=b.dataset.t;ui.rmore=40;sfx("tap");render();break}\n   case "rfit":{ui.rfit=ui.rfit===false;sfx("tap");render();break}\n   case "rmore":{ui.rmore=(ui.rmore||40)+40;render();break}\n   case "rtc":{ui.rtc=b.dataset.t;sfx("tap");renderSheet();break}\n   case "lt":{')
# status is a label the app sets, not a control
rep('<div class="seg" role="group" aria-label="Status">${Object.entries(STATUS).map(([k,v])=>`<button aria-pressed="${cs===k}" data-act="status" data-k="${u.k}" data-s="${k}">${v}</button>`).join("")}</div>','')
rep('<h1>${esc(u.title)}</h1>','<h1>${esc(u.title)}</h1><span class="sticker ${cs}" style="justify-self:start">${STATUS[cs]}${cs==="learning"&&done(u.k)?` · day ${done(u.k)} of ${sessionsFor(u)}`:""}</span>')
rep('h+=`<button class="btn line sm" data-act="logk" data-k="${u.k}" style="justify-self:start">Log a session today</button>`','h+=`<button class="btn line sm" data-act="logk" data-k="${u.k}" style="justify-self:start">Log a session today</button>${rank[cs]<2?`<button class="link xs" data-act="status" data-k="${u.k}" data-s="completed" style="justify-self:start">Already knows this? Mark it done</button>`:""}`')
# back navigation retraces the way the parent came
rep('document.getElementById("sheetClose").innerHTML=ui.back?icon("back"):icon("close");document.getElementById("sheetClose").setAttribute("aria-label",ui.back?"Back to the lesson":"Close");','updBack();')
rep('document.getElementById("sheetClose").onclick=()=>{sfx("tap");if(ui.back){ui.sheet=ui.back;ui.back=null;renderSheet(true)}else sheet.close()};','document.getElementById("sheetClose").onclick=()=>{sfx("tap");goBack()};')
rep('sheet.addEventListener("close",()=>{ui.phelp=null;sheet.className="sheet";ui.sheet=null;ui.back=null;clearInterval(tick);render()});','sheet.addEventListener("close",()=>{ui.phelp=null;sheet.className="sheet";ui.sheet=null;clearInterval(tick);render();updBack()});')
rep('const b=e.target.closest("button[data-tab]");if(!b)return;tab=b.dataset.tab;','const b=e.target.closest("button[data-tab]");if(!b)return;if(tab!==b.dataset.tab)navPush();tab=b.dataset.tab;')
rep('   case "lt":{','   case "lt":{navPush();')
rep('   case "ctab":{','   case "ctab":{navPush();')
rep('   case "tday":{','   case "tday":{navPush();')
rep('   case "quickday":{','   case "quickday":{navPush();')
CSS='\n.sec.cal{background:var(--surface);border-radius:var(--r-xl);padding:14px 14px 16px;box-shadow:var(--lift);gap:10px}.sec.cal .donecard{box-shadow:none;background:var(--sunk);margin-top:2px;padding:16px}.sec.cal .tt{margin:0}\n#backTop{flex:none}\n.rescard{gap:6px}.rescard .pill{font-size:11px}\n.greetbar{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;padding:10px 2px 2px}.greetbar b{font:600 21px var(--display)}\n.calhead{display:flex;align-items:center;gap:8px;margin:6px 0 8px}.calt{display:grid;line-height:1.15;min-width:92px;text-align:center}.calt b{font:600 18px var(--display)}\n'
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v10",n,len(ins),"built",len(out))
