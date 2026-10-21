import re, shutil, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
if not os.path.exists('ui_v4_base.js'): shutil.copy('new_ui.js','ui_v4_base.js')
extra='const KICO={lesson:"read",prep:"prep",warm:"warm",exps:"exps",event:"event",todo:"prep"};\n'
patch=(open('patch_v5.js').read()+'\n'+open('patch_v5b.js').read()+'\n'+extra).split('\n')
base=open('ui_v4_base.js').read().split('\n')
def blocks(lines):
    out=[];cur=[]
    for l in lines:
        if l and not l[0].isspace() and cur: out.append(cur);cur=[]
        cur.append(l)
    if cur: out.append(cur)
    return out
B=blocks(base);Pb=blocks(patch)
name=lambda b:(re.match(r'(?:async function|function|const|let) (\w+)',b[0]) or [None,None])[1]
bi={name(b):i for i,b in enumerate(B) if name(b)}
inserts=[];rep=0
for p in Pb:
    n=name(p)
    if n and n in bi: B[bi[n]]=p;rep+=1
    else: inserts.append(p)
k=bi['kolam'];B=B[:k+1]+inserts+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
open('new_ui.js','w').write(s);print("replaced",rep,"inserted",len(inserts))
# assemble template
head=open('new_head.html').read()
css=open('v5.css').read()
head=head.replace('</style>',css+'\n</style>',1)
T='/home/user/DeepKids/app/build/template.html'
t=open(T).read();logic=t[t.index('<script>')+8:t.index('/* ================= UI')]
open(T,'w').write(head+'\n<script>\n'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read()
out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write(out)
js=out[out.index('<script>')+8:out.rindex('</script>')]
open('app.js','w').write(js)
print("built",len(out))
