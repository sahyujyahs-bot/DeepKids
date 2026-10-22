import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply15.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v15.js').read().split('\n'))
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
# chapter numbers with names everywhere
rep('it.kind==="lesson"?it.u.title:','it.kind==="lesson"?chT(it.u):',3)
rep('title=it.u.title;','title=chT(it.u);')
rep('<p class="muted">${esc(it.u.title)} · ${all?','<p class="muted">${esc(chT(it.u))} · ${all?')
rep('<b style="font:600 16px var(--display)">${esc(nx.u.title)}</b>','<b style="font:600 16px var(--display)">${esc(chT(nx.u))}</b>')
rep('document.getElementById("sheetTitle").textContent=`${SUBJ[P.s]} · day ${P.n} of ${P.tot}`;','document.getElementById("sheetTitle").textContent=`${chT(it.u)} · day ${P.n} of ${P.tot}`;')
rep("const u=unitByK(l.key);return `<button class=\"plain hrow\" ${u?`data-act=\"chapter\" data-k=\"${esc(l.key)}\"`:\"\"}><span class=\"t num\">${l.at!=null?clock(l.at):\"–\"}</span><span style=\"min-width:0\"><b>${esc(l.title)}</b>","const u=unitByK(l.key);return `<button class=\"plain hrow\" ${u?`data-act=\"chapter\" data-k=\"${esc(l.key)}\"`:\"\"}><span class=\"t num\">${l.at!=null?clock(l.at):\"–\"}</span><span style=\"min-width:0\"><b>${esc(u?chT(u):l.title)}</b>")
# no countdown: the app measures the family's own pace and keeps estimates for planning only
rep('<div class="timer"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="var(--surface)" stroke-width="6"/><circle id="tring" cx="22" cy="22" r="18" fill="none" stroke="var(--c)" stroke-width="6" stroke-linecap="round" stroke-dasharray="113 113" transform="rotate(-90 22 22)"/></svg><div><div class="tt2 num" id="tt">${mmss(timerLeft(x))}</div><button class="link" data-act="timer" id="tbtn">${ui.timer&&ui.timer.run?"Pause":"Start timer"}</button></div></div>','<div class="spent"><span class="xs muted">Take your time. Time on this step</span><b class="num" id="spent">${mmss(stepSecs())}</b></div>')
rep('case "pdone":{const P=ui.sheet,it={u:unitBy(P.k),n:P.n,tot:P.tot,bonus:P.bonus},x=stepState(it)[P.i],key=stepKey(it),set=new Set(S.steps[key]||[]);','case "pdone":{const P=ui.sheet,it={u:unitBy(P.k),n:P.n,tot:P.tot,bonus:P.bonus},x=stepState(it)[P.i],key=stepKey(it),set=new Set(S.steps[key]||[]);if(x){const sec=Math.round(stepSecs());if(sec>=3){S.pace=(S.pace||[]).concat([{k:P.k,sec:x.sec||"book",kind:x.kind,est:Math.round(x.mins*60),took:Math.round(sec/60*10)/10,date:today}]).slice(-500)}stepT=null}')
CSS='\n.src{display:grid;gap:2px;padding:10px 12px;border-radius:14px;margin-bottom:10px}.src b{font:600 15px var(--display)}.src span{font-size:13px;opacity:.8}.src.book{background:#FFF0C9;color:#5C4300}.src.dk{background:#E3F3EC;color:#24553A}\n.spent{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-radius:14px;background:var(--surface)}.spent b{font:600 22px var(--display)}\n'
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v16",n,len(ins),"built",len(out))
