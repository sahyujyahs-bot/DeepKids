import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply25.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v22.js').read().split('\n'))
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
rep("Other subjects count each board's own chapters only.</p>`;","Other subjects count each board's own chapters only.</p>`;\n  h+=bundleSection();")
rep('<h2>How scores are worked out</h2>','${testTranscript()}<h2>How scores are worked out</h2>')
rep('function folderDoc(){const F=folderData(),','function folderDoc(F0){const F=F0||folderData(),')
rep('folder:folderView,','folder:folderView,exam:examView,')
rep('   case "todo":{','''   case "tsub":{const T=tSetup(),s=b.dataset.s,o=new Set(T.off||[]);o.has(s)?o.delete(s):o.add(s);T.off=[...o];sfx("tap");commit();break}
   case "tmake":{const t=curTest();if(t&&Object.keys(t.ans).length&&!tDone(t)&&!confirm("Start a new paper? The unfinished test will be kept but not continued."))break;ui.zs=null;makeTest();break}
   case "tstart":{ui.ex=null;sfx("flip");openSheet({mode:"exam"});break}
   case "tgo":{const t=curTest(),X=t.subjects[ui.ex.si];t.start=t.start||{};t.start[X.s]=t.start[X.s]||Date.now();ui.ex.qi=0;sfx("tap");commit();break}
   case "tans":{const t=curTest(),X=t.subjects[ui.ex.si];if(t.done?.[X.s])break;t.ans[X.s+"|"+ui.ex.qi]=+b.dataset.i;sfx("tap");commit();break}
   case "tmove":{const t=curTest(),n=t.subjects[ui.ex.si].qs.length;ui.ex.qi=Math.max(0,Math.min(n-1,ui.ex.qi+ +b.dataset.d));sfx("flip");render();document.getElementById("sheetBody")?.scrollTo?.(0,0);break}
   case "tjump":{ui.ex.qi=+b.dataset.i;sfx("tap");render();break}
   case "tfin":{const t=curTest(),X=t.subjects[ui.ex.si];t.done=t.done||{};t.done[X.s]=Date.now();ui.ex={si:t.subjects.findIndex(x=>!t.done[x.s]),qi:-1};ui.zs=null;sfx("win");if(ui.ex.si<0)confetti();commit();break}
   case "texit":{goBack();break}
   case "tdl":{tdlDoc(b.dataset.d);break}
   case "zall":{const Z=zipSel(),g=b.dataset.g;if(b.dataset.v==="1"){if(g==="ws")folderData().forEach(c=>c.ws.forEach(w=>Z.ws.add(w.k)));else (S.work||[]).forEach(w=>Z.up.add(w.id))}else Z[g].clear();ui.zip=null;render();break}
   case "zmake":{zipBuild();break}
   case "zsave":{zipSave();break}
   case "zshare":{zipShare();break}
   case "todo":{''')
rep('if(t.dataset.evf){','if(t.dataset.tsel){const T=tSetup();T[t.dataset.tsel]=t.value;sfx("tap");commit();return}if(t.dataset.zip){const Z=zipSel();t.checked?Z[t.dataset.zip].add(t.value):Z[t.dataset.zip].delete(t.value);ui.zip=null;render();return}if(t.dataset.evf){')
CSS='''.exsec{border:2px solid var(--sun)}.exdone{display:grid;justify-items:center;text-align:center;gap:10px;padding:20px 8px}.exdone h2{font-size:28px;margin:0}
.exq{display:grid;gap:12px}.exqt{font:600 21px/1.35 var(--display);margin:4px 0}.exopt{display:flex;gap:12px;align-items:center;text-align:left;padding:14px 16px;border-radius:18px;border:2px solid rgba(43,35,64,.12);background:var(--surface);font-size:17px;min-height:56px;cursor:pointer}.exopt b{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:rgba(43,35,64,.07);flex:none}.exopt[aria-pressed="true"]{border-color:var(--ink);background:#FFF0C9}.exopt[aria-pressed="true"] b{background:var(--ink);color:#fff}
.exdots{display:flex;flex-wrap:wrap;gap:5px}.exdots button{width:14px;height:14px;border-radius:50%;border:0;background:rgba(43,35,64,.12);padding:0;cursor:pointer}.exdots .ans{background:var(--forest)}.exdots .on{outline:2px solid var(--ink);outline-offset:1px}.ask.exp{font-size:16px;line-height:1.5}
.zrow{display:flex;gap:10px;align-items:flex-start;padding:6px 0;cursor:pointer}.zrow input{width:20px;height:20px;margin-top:2px;flex:none}.zrow.off{opacity:.5;cursor:default}
'''
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v26",n,len(ins),"built",len(out))
