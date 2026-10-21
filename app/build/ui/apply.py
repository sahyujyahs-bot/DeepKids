import re
base=open('ui_v3_base.js').read().split('\n');patch=open('patch_ui.js').read().split('\n')
def blocks(lines):
    out=[];cur=[]
    for l in lines:
        if l and not l[0].isspace() and cur: out.append(cur);cur=[]
        cur.append(l)
    if cur: out.append(cur)
    return out
B=blocks(base);Pb=blocks(patch)
name=lambda b:(re.match(r'(?:function|const|let) (\w+)',b[0]) or [None,None])[1]
bi={name(b):i for i,b in enumerate(B)}
inserts=[]
for p in Pb:
    n=name(p)
    if n in bi: B[bi[n]]=p
    else: inserts.append(p)
k=bi['kolam'];B=B[:k+1]+inserts+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]);s=s.replace(a,b)
exec(open('reps.py').read())
open('new_ui.js','w').write(s)
