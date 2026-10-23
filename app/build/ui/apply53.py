import os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply52.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v53.js').read().split('\n'))
bi={name(b):i for i,b in enumerate(B) if name(b)};ins=[];nrep=0
for p in Pb:
    k=name(p)
    if k and k in bi: B[bi[k]]=p;nrep+=1
    else: ins.append(p)
k=bi['kolam'];B=B[:k+1]+ins+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
print("replaced",nrep,"inserted",len(ins))
# Story tab first for Combined chapters; story styles in the book and the app
rep('''...(c.p.big?{think:"Think deeper",game:"Game & project",books:"Books"}:{})''','''...(c.p.big?{...(c.p.story?{story:"Story"}:{}),think:"Think deeper",game:"Game & project",books:"Books"}:{})''')
rep('''.wcert{border:6px double #2B2340;''','''.wstory{font-family:Georgia,"Times New Roman",serif;font-size:15.5px;line-height:1.65;column-count:2;column-gap:22px}.wstory h2{column-span:all;font-size:28px;margin:2px 0 10px;font-family:inherit}.wstoryhd{column-span:all;font:700 12px/1 "Trebuchet MS",sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6b6380}.wstory p{margin:0 0 9px;text-indent:1.2em}.wstory p.first{text-indent:0}.wstory p.first::first-letter{float:left;font-size:52px;line-height:.9;padding:4px 6px 0 0;font-weight:700}.wstoryask{column-span:all;break-inside:avoid;border-top:2px solid #2B2340;margin-top:8px;padding-top:6px;font:14px/1.5 "Trebuchet MS",sans-serif}.wcert{border:6px double #2B2340;''')
CSS8='''.story h2{font:600 24px/1.2 var(--display);margin:0 0 10px}.story p{font:16.5px/1.7 Georgia,"Times New Roman",serif;margin:0 0 12px}.story p.first::first-letter{float:left;font-size:46px;line-height:.9;padding:4px 6px 0 0;font-weight:700}.storyask{border-top:1px solid var(--line);padding-top:8px;font-size:14px}
'''
head=head.replace('</style>',CSS8+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v53 built",len(out))
