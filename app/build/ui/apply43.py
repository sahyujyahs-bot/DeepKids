import os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply42.py'],check=True,capture_output=True)
T='/home/user/DeepKids/app/build/template.html';t=open(T).read()
head=t[:t.index('<script>')];logic=t[t.index('<script>')+8:t.index('/* ================= UI')];s=t[t.index('/* ================= UI'):t.rindex('</script>')]
def rep(a,b,c=1):
    global s
    assert s.count(a)==c,(s.count(a),a[:90]);s=s.replace(a,b)
def lrep(a,b):
    global logic
    if b in logic: return
    if logic.count(a)==0: print('superseded:',a[:50]); return
    assert logic.count(a)==1,(logic.count(a),a[:90]);logic=logic.replace(a,b)
import re
def blocks(lines):
    out=[];cur=[]
    for l in lines:
        if l and not l[0].isspace() and cur: out.append(cur);cur=[]
        cur.append(l)
    if cur: out.append(cur)
    return out
name=lambda b:(re.match(r'(?:async function|function|const|let) (\w+)',b[0]) or [None,None])[1]
B=blocks(s.split('\n'));Pb=blocks(open('patch_v43.js').read().split('\n'))
bi={name(b):i for i,b in enumerate(B) if name(b)};ins=[];nrep=0
for p in Pb:
    k=name(p)
    if k and k in bi: B[bi[k]]=p;nrep+=1
    else: ins.append(p)
k=bi['kolam'];B=B[:k+1]+ins+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
print("replaced",nrep,"inserted",len(ins))
# DeepKids Science: a subject of its own
lrep('const SUBJ = DATA.subjects, SUBJ_KEYS = Object.keys(SUBJ);','const SUBJ = {...DATA.subjects,dks:"DeepKids Science"}, SUBJ_KEYS = Object.keys(SUBJ);')
lrep('const DEF_DAYS={math:[1,2,3,4,5],eng:[1,2,4,5],hin:[2,4],sci:[1,3,5]};','const DEF_DAYS={math:[1,2,3,4,5],eng:[1,2,4,5],hin:[2,4],sci:[1,3,5],dks:[1,2,3,4,5]};')
lrep('const DEF_HPD={math:1,eng:0.75,hin:0.5,sci:0.75};','const DEF_HPD={math:1,eng:0.75,hin:0.5,sci:0.75,dks:0.5};')
lrep('const SCOL={math:"var(--teal)",eng:"var(--grape)",hin:"var(--tomato)",sci:"var(--leaf)"};','const SCOL={math:"var(--teal)",eng:"var(--grape)",hin:"var(--tomato)",sci:"var(--leaf)",dks:"var(--peri)"};')
lrep('subjects:["math","eng","hin","sci"],levels:{math:1,eng:1,hin:1,sci:1}','subjects:["math","eng","hin","sci","dks"],levels:{math:1,eng:1,hin:1,sci:1,dks:1}')
# which DeepKids subject draws on which topics (more DeepKids subjects go here later)
lrep('function dkUnits(subj,lvl){if(subj!=="sci")return [];','const DKSUB={dks:"sci"};\nfunction dkUnits(subj,lvl){if(!DKSUB[subj])return [];')
lrep('return [...added,...(plusOn()&&lvl===S.levels[subj]?DATA.topics.filter(t=>(t.cls||[1,2,3,4,5]).includes(lvl)):[])]','return [...added,...(lvl===S.levels[subj]?DATA.topics.filter(t=>(t.subj||"sci")===DKSUB[subj]&&(t.cls||[1,2,3,4,5]).includes(lvl)):[])]')
rep('board:"dk",subj:"sci",level:1,book:"DeepKids Plus · Science Level 1"','board:"dk",subj:"dks",level:1,book:"DeepKids Science"',1)
lrep('board:"dk",subj:"sci",level:1,book:"DeepKids Plus · Science Level 1"','board:"dk",subj:"dks",level:1,book:"DeepKids Science"')
rep('''SUBJ_BLOB={math:["var(--aqua)",3],eng:["var(--gum)",7],hin:["var(--tang)",11],sci:["var(--forest)",5]};''','''SUBJ_BLOB={math:["var(--aqua)",3],eng:["var(--gum)",7],hin:["var(--tang)",11],sci:["var(--forest)",5],dks:["var(--peri)",9]};''')
rep('''<span>${k==="hin"?"Not part of Cambridge":"Tap to include or leave out"}</span>''','''<span>${k==="hin"?"Not part of Cambridge":k==="dks"?"Big questions about life, the earth and the universe. Every day, alongside the syllabus":"Tap to include or leave out"}</span>''')
# the separate daily DeepKids slot is replaced by the subject
rep('const DKSTEPS=[0,10,15,20,30,45,60],dkMinsOf=()=>S.dkMins??20;','const DKSTEPS=[0,10,15,20,30,45,60],dkMinsOf=()=>0;')
rep('${dkPaceCard()}</section>','</section>')
rep('''render=function(...a){const m=''','''render=function(...a){dksMigrate();const m=''')
rep('''function dkPick(date,lessons){const L=lessons.map(l=>l.u).filter(Boolean),live=DATA.topics.filter(t=>(t.cls||[1,2,3,4,5]).includes(S.levels.sci||1)''','''function dkPick(date,lessons){const L=lessons.map(l=>l.u).filter(Boolean),live=DATA.topics.filter(t=>(t.cls||[1,2,3,4,5]).includes(S.levels.dks||S.levels.sci||1)''')
CSS3='''.s-dks{--c:var(--peri)}
'''
head=head.replace('</style>',CSS3+'</style>',1)
lrep('const HINT={','const HINT={dks:"Start from your child\'s own questions. There are no wrong answers here: ask “how do we know?” and try it out at home.",')
lrep('const SUBJ = {...DATA.subjects,dks:"DeepKids Science"}, SUBJ_KEYS = Object.keys(SUBJ);','const SUBJ = {...DATA.subjects,dks:"DeepKids Science"}, SUBJ_KEYS = Object.keys(SUBJ);\nDATA.prepgen.guide.dks=DATA.prepgen.guide.dks||"DeepKids Science starts from a big question. Read the topic story yourself first, then let your child wonder out loud before you explain anything. Their questions matter more than the answers.";\nDATA.prepgen.prep.dks=DATA.prepgen.prep.dks||[["read",1,"Read the topic story and its big question yourself (5 min)","The topic page in DeepKids"],["act",0,"Keep a wonder notebook handy for your child\'s questions","At home"]];')
rep('CHC={math:"#2A8FB0",eng:"#C24F8A",hin:"#D98A2B",sci:"#3F8A4F"};','CHC={math:"#2A8FB0",eng:"#C24F8A",hin:"#D98A2B",sci:"#3F8A4F",dks:"#6E6CC9"};')
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v43 built",len(out))
