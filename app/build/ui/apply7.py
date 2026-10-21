import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply6.py'],check=True,capture_output=True)   # rebuilds new_ui.js (v6) from its sources
base=open('new_ui.js').read()
def grab(fn):
    i=base.index('function '+fn+'(');j=base.index('\n  return h}',i)+len('\n  return h}');return base[i:j].split('\n')
vp=grab('viewPlanner');vj=grab('viewJourney')
assert vp[3].lstrip().startswith('const Q=askList()') and vp[5].lstrip().startswith('const evs=') and vp[7].lstrip().startswith('const d=D();') and vp[12].lstrip().startswith('h+=`<section class="sec"><div class="sech"><h3>Pace'),vp[:13]
assert vj[2].lstrip().startswith('const tasks=') and vj[4].lstrip().startswith('const Qs=') and vj[6].lstrip().startswith('const bs=') and vj[7].lstrip().startswith('const beyond=') and vj[9].lstrip().startswith('h+=`<section class="sec"><div class="sech"><h3>Learning diary')
J=lambda a,b:'\n'.join(vp[a:b])
plpart='function plPart(p){let h="";\n  if(p==="asks"){'+J(3,4)+'}\n  if(p==="events"){'+J(5,7)+'}\n  if(p==="day"){'+J(7,12)+'}\n  if(p==="pace"){'+J(12,15)+'}\n  return h}'
K=lambda a,b:'\n'.join(vj[a:b])
jpart='function jPart(p){const kid=esc(S.child||"Your child");let h="";\n  if(p==="numbers"){'+K(2,4)+'}\n  if(p==="high"){'+K(4,6)+'}\n  if(p==="board"){'+K(6,7)+'}\n  if(p==="beyond"){'+K(7,9)+'}\n  if(p==="diary"){'+K(9,10)+'}\n  return h}'
patch=open('patch_v7.js').read()+'\n'+plpart+'\n'+jpart+'\n'
def blocks(lines):
    out=[];cur=[]
    for l in lines:
        if l and not l[0].isspace() and cur: out.append(cur);cur=[]
        cur.append(l)
    if cur: out.append(cur)
    return out
name=lambda b:(re.match(r'(?:async function|function|const|let) (\w+)',b[0]) or [None,None])[1]
B=blocks(base.split('\n'));Pb=blocks(patch.split('\n'))
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
rep('const V={learn:learnView,','const V={more:moreView,pl:plView,jr:jrView,learn:learnView,')
rep('   case "daytype":','''   case "nowmore":{const k2="now|"+b.dataset.id;ui.open[k2]=!ui.open[k2];sfx("tap");render();break}
   case "showdone":{ui.showDone=!ui.showDone;sfx("tap");render();break}
   case "moresheet":{sfx("flip");openSheet({mode:"more"});break}
   case "plsheet":{sfx("flip");openSheet({mode:"pl",p:b.dataset.p});break}
   case "jrsheet":{sfx("flip");openSheet({mode:"jr",p:b.dataset.p});break}
   case "daytype":''')
rep('case "askq":{const v=b.dataset.a;if(v==="parent")return openSheet({mode:"parent"});','case "askq":{const v=b.dataset.a;if(v==="parent")return openSheet({mode:"parent"});if(sheet.open)sheet.close();')
rep('document.getElementById("main").addEventListener("change",e=>{const t=e.target;','document.addEventListener("change",e=>{const t=e.target;')
rep("<p class=\"xs muted\">Classes, tuitions, outings, chores, exams, what you own. Type it, speak it with your keyboard's mic, or add a photo or screenshot. We sort it into the plan.</p>","<p class=\"xs muted\">Type it, say it with your keyboard's mic, or add a photo. We sort it into your plan.</p>")
rep('ACCT=String(me?.name||"").trim().split(/\\s+/)[0]||"";','ACCT=String(me?.name||"").trim().split(/\\s+/)[0]||"";ACCT=ACCT?ACCT[0].toUpperCase()+ACCT.slice(1):"";')
rep('<span>Tell us your name and wake-up time</span>','<span>${pname()?"Set your wake-up and prep times":"Tell us your name and wake-up time"}</span>')
open('new_ui7.js','w').write(s);print("v7 ui",n,len(ins))
T='/home/user/DeepKids/app/build/template.html';t=open(T).read()
logic=t[t.index('<script>')+8:t.index('/* ================= UI')]
head=open('new_head.html').read().replace('</style>',open('v5.css').read()+'\n'+open('v6.css').read()+'\n'+open('v7.css').read()+'\n</style>',1)
open(T,'w').write(head+'\n<script>\n'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write(out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("built",len(out))
