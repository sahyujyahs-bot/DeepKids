import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply30.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v27.js').read().split('\n'))
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
rep('   case "todo":{','''   case "dex":{const t=document.getElementById("dumpText");if(t){t.value=b.dataset.t;t.dispatchEvent(new Event("input",{bubbles:true}));t.focus();t.select()}sfx("tap");break}
   case "dhand":{ui.dhand=!ui.dhand;sfx("tap");render();break}
   case "dnofiles":{if(ui.dump)ui.dump.files=[];sfx("flip");render();break}
   case "todo":{''')
CSS='''.dump{display:grid;gap:12px}.composer{display:flex;align-items:flex-end;gap:8px;padding:6px;border-radius:26px;background:var(--surface);border:2px solid rgba(43,35,64,.12);transition:border-color .15s}.composer:focus-within{border-color:var(--aqua)}.composer .inp{flex:1;min-width:0;border:0;background:transparent;resize:none;min-height:40px;max-height:160px;padding:9px 6px;font-size:16px;box-shadow:none;outline:none}
.composer .cbtn,.composer .send{flex:none;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;border:0;cursor:pointer}.composer .cbtn{background:rgba(43,35,64,.07)}.composer .send{background:var(--tang);color:#fff;box-shadow:0 3px 0 var(--tangD)}.composer .send:active{transform:translateY(2px);box-shadow:0 1px 0 var(--tangD)}.composer .send svg,.composer .cbtn svg{width:20px;height:20px}
.composer.busy{opacity:.85}.dots{display:flex;gap:3px}.dots i{width:5px;height:5px;border-radius:50%;background:#fff;animation:dkdot 1s infinite}.dots i:nth-child(2){animation-delay:.15s}.dots i:nth-child(3){animation-delay:.3s}@keyframes dkdot{50%{transform:translateY(-4px);opacity:.5}}
.dex{display:flex;flex-wrap:wrap;gap:6px}.dex .chip{font-size:13px}.dfoot{justify-content:space-between;gap:14px}.handbox{padding:12px;border-radius:16px;background:rgba(43,35,64,.04)}
'''
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v31",n,len(ins),"built",len(out))
