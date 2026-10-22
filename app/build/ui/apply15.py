import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply14.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v14.js').read().split('\n'))
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
# one straight lesson path in sections: book first, then the rest, then finish
rep('\n  if(P.i>=st.length){','\n  h+=secBar(st,P.i);\n  if(P.i>=st.length){')
rep('<span>Step ${P.i+1} of ${st.length} · ${esc(x.label)}</span>','<span>${SECN[x.sec||"book"]} · step ${P.i+1} of ${st.length}</span>')
rep('  return h+chapterHub(it.u)}','  return h}')
rep('return h+chapterHub(it.u)}','return h+`<details class="card hub"><summary><b>Want more? Everything for this chapter</b></summary><div class="hubb">${chapterHub(it.u)}</div></details>`}')
rep('   case "lt":{','   case "pjump":{ui.sheet.i=Math.max(0,+b.dataset.i);sfx("tap");renderSheet(true);break}\n   case "hist":{sfx("flip");openSheet({mode:"hist"});break}\n   case "lt":{')
rep('ws:wsView,','ws:wsView,hist:historyView,')
# full history: from Today's calendar and from Journey
rep('<button class="link" data-act="showdone" style="justify-self:start;margin-top:8px">${ui.showDone?"Hide":"Show"} ${doneL.length} done</button>','<div class="row" style="justify-content:space-between;margin-top:8px"><button class="link" data-act="showdone">${ui.showDone?"Hide":"Show"} ${doneL.length} done today</button><button class="link" data-act="hist">Full history</button></div>')
rep('<div class="sech"><h3>Chapters</h3><span class="xs muted">tap to open again</span></div>','<div class="sech"><h3>Chapters</h3><span class="xs muted">tap to open again</span></div><button class="menurow" data-act="hist">${blob("var(--sky)",13,"calm","",\'width="40" height="40"\')}<span><b>Everything done, day by day</b><br><span class="xs muted">${S.log.length} lessons with times</span></span>${icon("next")}</button>')
CSS='\n.secbar{display:flex;flex-wrap:wrap;gap:6px;padding:2px 0 8px}.secbar::-webkit-scrollbar{display:none}.secchip{flex:none;display:flex;align-items:center;gap:6px;padding:6px 10px;border-radius:99px;background:var(--surface);box-shadow:inset 0 0 0 1.5px var(--line);font:600 13px var(--display);color:var(--ink)}.secchip .n{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:var(--sunk);font-size:11px}.secchip small{font:500 11px var(--body,inherit);color:var(--muted)}.secchip.on{background:var(--ink);color:#fff;box-shadow:none}.secchip.on small{color:#fff;opacity:.75}.secchip.on .n{background:rgba(255,255,255,.2)}.secchip.ok .n{background:var(--forest,#53A373);color:#fff}\n.hrow{display:flex;gap:10px;align-items:center;width:100%;text-align:left;padding:10px 0;border-top:1px solid var(--line)}.hrow .t{min-width:64px;font:600 14px var(--display);color:var(--muted)}.hrow b{font:600 15.5px var(--display)}\n'
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v15",n,len(ins),"built",len(out))
