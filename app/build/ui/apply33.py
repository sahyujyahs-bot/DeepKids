import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply32.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v29.js').read().split('\n'))
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
rep('function viewJourney(){','function viewJourney0(){')
rep('journey:viewJourney}','journey:viewJourneyTabs}')
rep('${[["topics","Syllabus"],["science","Science resources"],["have","What we have"],["suggest","Our picks"],["read","Read"],["watch","Watch"]].map(([k,n])=>`<button aria-pressed="${t===k}" data-act="lt" data-t="${k}">${n}</button>`).join("")}</div></section>`','${LIBT.map(([k,n])=>`<button aria-pressed="${t===k}" data-act="lt" data-t="${k}">${n}</button>`).join("")}</div><p class="xs muted segdesc">${esc((LIBT.find(x=>x[0]===t)||LIBT[0])[2])}</p></section>`')
rep('placeholder="Add something we have"','placeholder="Add something you have"')
rep('Add them to what you have?','Add them to your home shelf?')
rep('case "toplan":{const dl=document.getElementById("sheet");ui.sheet=null;if(dl?.open)dl.close();tab="week";','case "toplan":{const dl=document.getElementById("sheet");ui.sheet=null;if(dl?.open)dl.close();tab="week";ui.seg={...(ui.seg||{}),week:"cal"};')
rep('   case "todo":{','''   case "seg":{navPush();ui.seg={...(ui.seg||{}),[b.dataset.k]:b.dataset.v};sfx("tap");render();scrollTo(0,0);break}
   case "gotab":{navPush();const dl=document.getElementById("sheet");if(dl?.open){ui.sheet=null;dl.close()}tab=b.dataset.tab;if(b.dataset.seg)ui.seg={...(ui.seg||{}),[tab]:b.dataset.seg};sfx("flip");render();scrollTo(0,0);break}
   case "sndtoggle":{document.getElementById("snd")?.click();setTimeout(()=>{if(ui.sheet)renderSheet()},50);break}
   case "todo":{''')
CSS='''.sgbody>.sec>.sech:first-child{display:none}.segmain{margin-top:6px}.segdesc{margin:6px 2px 0}.sgrp summary{cursor:pointer;list-style:none;display:grid;gap:2px}.sgrp summary::-webkit-details-marker{display:none}.sgrp summary b{font:600 17px var(--display)}.sgrp summary::after{content:"›";position:absolute;right:18px;top:16px;font-size:22px;transition:transform .2s;color:rgba(43,35,64,.4)}.sgrp{position:relative}.sgrp[open] summary::after{transform:rotate(90deg)}.sgbody{display:grid;gap:10px;margin-top:12px}.sgbody>.sec,.sgbody>.card{margin:0}
'''
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v33",n,len(ins),"built",len(out))
