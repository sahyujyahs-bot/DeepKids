import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply36.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v33.js').read().split('\n'))
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
rep('${IMGOK?`<label class="btn soft sm" style="cursor:pointer">${icon("plus")}Photos<input type="file" id="invImg" accept="image/*" multiple hidden></label>`:""}','${IMGOK?`<label class="btn soft sm" style="cursor:pointer">${icon("plus")}Photos<input type="file" id="invImg" accept="image/*" multiple hidden></label>`:lockBtn("shelf","btn soft sm","📷 Photos")}')
rep('folder:folderView,','folder:folderView,plus:plusView,')
rep('   case "todo":{','''   case "plus":{sfx("flip");openSheet({mode:"plus",r:b.dataset.r||""});break}
   case "plusgo":{plusGo();break}
   case "todo":{''')
CSS='''.locked{position:relative}.locked .lk{position:absolute;right:-4px;top:-6px;font-size:12px;background:#fff;border-radius:50%;width:18px;height:18px;display:grid;place-items:center;box-shadow:0 1px 3px rgba(0,0,0,.2)}.btn.locked .lk{position:static;width:auto;height:auto;background:none;box-shadow:none;margin-left:4px}
.needai{display:flex;gap:10px;align-items:center;padding:12px;border-radius:16px;background:#FFF0C9;border:2px dashed rgba(43,35,64,.15)}.needai>.lk{font-size:20px}.needai>div{flex:1;min-width:0}
.pluslist{display:grid;gap:8px;padding-left:0;list-style:none;font-size:15px}.pluslist li{padding:10px 12px;border-radius:14px;background:var(--surface)}
'''
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v37",n,len(ins),"built",len(out))
