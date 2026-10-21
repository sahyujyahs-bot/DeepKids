import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply8.py'],check=True,capture_output=True)
s=open('new_ui8.js').read()
def blocks(lines):
    out=[];cur=[]
    for l in lines:
        if l and not l[0].isspace() and cur: out.append(cur);cur=[]
        cur.append(l)
    if cur: out.append(cur)
    return out
name=lambda b:(re.match(r'(?:async function|function|const|let) (\w+)',b[0]) or [None,None])[1]
B=blocks(s.split('\n'));Pb=blocks(open('patch_v9.js').read().split('\n'))
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
# chapter packs drive the lesson days in every mode
rep('const base=modeOf()==="books"&&u.board!=="gen"','const base=u.c?.p?daySteps(u,it.n,it.tot):modeOf()==="books"&&u.board!=="gen"')
rep('html:u.c?.x&&c.name&&!c.name.startsWith("opt:")?stepBody(u,c.name)','html:c.name?.startsWith("pk:")?packStepByName(u,c.name):u.c?.x&&c.name&&!c.name.startsWith("opt:")?stepBody(u,c.name)')
rep('const tabs=m==="books"?','const tabs=c?.p?{overview:"Overview",days:"Day plan",ws:"Worksheets",lab:"Experiments",voices:"Other voices",...(x?{questions:"Big questions",play:"Play"}:{}),...(c.read?{read:"Read more"}:{})}:m==="books"?')
rep('<p>${fh(hoursFor(u))} hours in all · ${sessionsFor(u)} lesson days at ${fh(hpdOf(u.subj))} h a day</p>','<p>${c?.p?`${c.p.days.length} days · ${c.p.day_mins} minutes a day`:`${fh(hoursFor(u))} hours in all · ${sessionsFor(u)} lesson days at ${fh(hpdOf(u.subj))} h a day`}</p>')
rep('if(t==="overview"){h+=topicOverview(u);','if(t==="overview"){if(c?.p)h+=packOverview(u);h+=topicOverview(u);')
rep('if(t==="plans")h+=plansTab(u);','if(t==="plans")h+=plansTab(u);if(c?.p)h+=packTab(u,t);')
rep('...(c.links||[]),...c.read]','...(c.links||[]),...(c.read||[])]')
rep('case "ws":{sfx("flip");openSheet({mode:"ws",k});break}','case "ws":{sfx("flip");openSheet({mode:"ws",k,w:b.dataset.w});break}')
rep('const u=x.u,g=u.c?.x?.guide||','const u=x.u,g=u.c?.p?.summary||u.c?.x?.guide||')
open('new_ui9.js','w').write(s);print("v9 ui",n,len(ins))
CSS='''
.pk{display:grid;gap:6px;margin:10px 0;padding:10px 12px;border-radius:14px;background:rgba(43,35,64,.04);border-left:4px solid var(--c,#B6D693)}
.pk ol,.pk ul,.pkday ol,.card ol.sm{margin:0;padding-left:20px;display:grid;gap:4px}
.pkday summary{cursor:pointer;list-style:none;display:flex;flex-wrap:wrap;gap:6px;align-items:baseline}
.pkday summary::-webkit-details-marker{display:none}
.pkstep{padding:10px 0;border-top:1px solid rgba(43,35,64,.08)}.pkstep p{margin-top:4px}
.vst{justify-self:start;font-size:12px;font-weight:600;padding:3px 10px;border-radius:99px;background:#EEE}
.vst.accepted{background:#DDF0E3;color:#2E6B45}.vst.debated{background:#FFF0C9;color:#7A5A00}.vst.minority{background:#E6E8F6;color:#46508A}.vst.rejected{background:#F1E6E6;color:#7A3B3B}
'''
T='/home/user/DeepKids/app/build/template.html';t=open(T).read()
logic=t[t.index('<script>')+8:t.index('/* ================= UI')]
head=t[:t.index('<script>')].replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>\n'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("built",len(out))
