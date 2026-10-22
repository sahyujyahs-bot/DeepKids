import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply16.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v16.js').read().split('\n'))
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
# quick add had the same action name as "Add to the plan" and never ran
rep('<button class="btn sm" data-act="qadd" style="justify-self:start">Add</button>','<button class="btn sm" data-act="qaddq" style="justify-self:start">Add</button>')
rep('   case "qadd":{const root=b.closest("#sheetBody")','   case "qaddq":{const root=b.closest("#sheetBody")')
# Do this next: say exactly what changed, and show it
rep('sfx("ok");toast("Up next");commit();break}','sfx("ok");commit();toast(nextMsg(s,k),5000);if(sheet.open)renderSheet();break}')
rep('sfx("ok");toast("Added to Up next");commit();break}','sfx("ok");commit();toast(`Added. ${chT(unitBy(k))} is in the ${SUBJ[s]} queue (Planner → Up next).`,5000);if(sheet.open)renderSheet();break}')
rep('<button class="btn sm" data-act="qnext" data-s="${u.subj}" data-k="${u.k}">Do this next</button>','${isNextUp(u)?`<span class="pill completed" style="align-self:center">✓ Next up in ${SUBJ[u.subj]}</span><button class="btn line sm" data-act="plsheet" data-p="queue">See the queue</button>`:`<button class="btn sm" data-act="qnext" data-s="${u.subj}" data-k="${u.k}">Do this next</button>`}')
rep('<button class="link" data-act="hist">Full history</button>','<span class="row" style="gap:14px"><button class="link" data-act="plsheet" data-p="queue">Up next</button><button class="link" data-act="hist">Full history</button></span>')
# read aloud
rep('<div class="kind"><span class="k">${icon(x.kind==="step"?"spark":x.kind)}</span><span>${SECN[x.sec||"book"]} · step ${P.i+1} of ${st.length}</span></div>','<div class="kind"><span class="k">${icon(x.kind==="step"?"spark":x.kind)}</span><span>${SECN[x.sec||"book"]} · step ${P.i+1} of ${st.length}</span><button class="readbtn" data-act="readnow" aria-label="Read this step aloud">🔊 Read aloud</button></div>')
rep('const greetBar=sub=>`<section class="greetbar"><b>','const greetBar=sub=>`<section class="greetbar"><button class="readbtn" data-act="readnow" aria-label="Read the screen aloud" style="order:3;margin-left:auto">🔊</button><b>')
rep('   case "pdone":{','   case "readnow":{readNow();break}\n   case "autoread":{S.autoRead=!S.autoRead;save();toast(S.autoRead?"Each step will be read aloud as you go.":"Steps won\'t be read automatically.");renderSheet();break}\n   case "pdone":{')
for a in ['case "pstep":{','case "pjump":{']:
    i=s.index(a);j=s.index('break}',i);s=s[:j]+'autoRead();'+s[j:]
i=s.index('case "pdone":{');j=s.index('break}',i);s=s[:j]+'autoRead();'+s[j:]
rep('function playItem(it){openSheet(','function playItem(it){setTimeout(autoRead,100);openSheet(')
rep('<div class="spent"><span class="xs muted">Take your time. Time on this step</span>','<div class="spent"><span class="xs muted">Take your time. Time on this step<br><button class="link xs" data-act="autoread">${S.autoRead?"✓ Reading each step aloud":"Read each step aloud as we go"}</button></span>')
# the sheet header gets a read-aloud button for any page
rep('function renderSheet(top){if(!ui.sheet)return;','function renderSheet(top){if(!ui.sheet)return;{const ex=document.getElementById("sheetExtra");if(ex&&!ex.querySelector(".readbtn"))ex.innerHTML=`<button class="readbtn" data-act="readnow" aria-label="Read this page aloud">🔊</button>`}')
rep('sheet.addEventListener("close",()=>{ui.phelp=null;','sheet.addEventListener("close",()=>{if(sheet.open)return;ui.phelp=null;')
CSS='\n.readbtn{margin-left:auto;padding:6px 10px;border-radius:99px;background:var(--surface);box-shadow:inset 0 0 0 1.5px var(--line);font:600 13px var(--display);color:var(--ink)}.stage .kind{display:flex;align-items:center;gap:8px}\n#voxbar{position:fixed;left:50%;transform:translateX(-50%);bottom:96px;z-index:60;display:flex;align-items:center;gap:4px;padding:6px 8px;border-radius:99px;background:#2B2340;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.25);max-width:calc(100vw - 24px)}dialog #voxbar{bottom:20px}#voxbar .vt{font:600 12px var(--display);padding:0 6px;white-space:nowrap}#voxbar button{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;font-size:16px;display:grid;place-items:center;flex:none}\n'
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v17",n,len(ins),"built",len(out))
