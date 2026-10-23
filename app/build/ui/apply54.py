import os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply53.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v54.js').read().split('\n'))
bi={name(b):i for i,b in enumerate(B) if name(b)};ins=[];nrep=0
for p in Pb:
    k=name(p)
    if k and k in bi: B[bi[k]]=p;nrep+=1
    else: ins.append(p)
k=bi['kolam'];B=B[:k+1]+ins+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
print("replaced",nrep,"inserted",len(ins))
# book styles for make-cards, sudoku and odd-one-out
rep('''.wcert{border:6px double #2B2340;''','''.wmakes{display:grid;grid-template-columns:1fr 1fr;gap:8px}.wmake{border:2px solid #e6dfd2;border-radius:12px;padding:6px 10px;font-size:13px;break-inside:avoid}.wmakeh{display:flex;justify-content:space-between;gap:6px}.wmakeh b{font-size:14.5px}.wmakeh span{font-size:11.5px;color:#6b6380;white-space:nowrap}.wmake ol{margin:4px 0;padding-left:16px}.wmakeq{font-size:12.5px}
   .wsudo{display:flex;gap:16px;align-items:center}.wsudo table{border-collapse:collapse;border:3px solid #2B2340}.wsudo td{width:54px;height:54px;border:1px solid #999;text-align:center;font-size:30px}.wsudo td.bb{border-bottom:3px solid #2B2340}.wsudo td.br{border-right:3px solid #2B2340}
   .wodd li{margin:6px 0}.woddrow{display:flex;gap:10px;flex-wrap:wrap}.woddrow span{border:1.5px dashed #999;border-radius:10px;padding:3px 10px;font-size:14px}.wcert{border:6px double #2B2340;''')
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v54 built",len(out))
