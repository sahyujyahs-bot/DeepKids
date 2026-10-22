import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply17.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v17.js').read().split('\n'))
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
# points, not paragraphs
rep('d.n===1?`<p>${esc(P.summary)}</p>','d.n===1?`${fmtPts(P.summary,1)}')
rep('<details><summary class="sm">Why it happens</summary><p class="sm">${esc(e.why)}</p></details>','<details><summary class="sm">Why it happens</summary>${fmtPts(e.why)}</details>')
rep('<div class="body"><p>${esc(r.body||"")}</p>','<div class="body">${fmtPts(r.body||"")}')
# finish the lesson sits below "Want more?"
a=s.index('${photoBtn(P.k,"Add a photo of today\'s work")}<div class="row" style="justify-content:center"><button class="btn green" data-act="finish">');b=s.index('</div></section>`;return h+`<details class="card hub">',a)
row=s[a+len('${photoBtn(P.k,"Add a photo of today\'s work")}'):b+len('</div>')]
s=s[:a]+'${photoBtn(P.k,"Add a photo of today\'s work")}</section>`;return h+`<details class="card hub">'+s[b+len('</div></section>`;return h+`<details class="card hub">'):]
rep('<div class="hubb">${chapterHub(it.u)}</div></details>`}','<div class="hubb">${chapterHub(it.u)}</div></details><p class="sm muted" style="text-align:center">Looked through everything? Then finish today\\\'s lesson.</p>'+row.replace('`','\\`')+'`}')
CSS='\n.pts{list-style:none;margin:6px 0;padding:0;display:grid;gap:10px}.pts li{position:relative;padding-left:30px;line-height:1.45;display:grid;gap:4px}.pts li::before{position:absolute;left:0;top:0;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:12px;content:"•";background:var(--sunk);font-weight:700}.pts li.p-ask::before{content:"?";background:#E6E8F6;color:#46508A}.pts li.p-say::before{content:"💬";background:#FFF0C9}.pts li.p-read::before{content:"📖";background:#FFF0C9}.pts li.p-note::before{content:"!";background:#F1E6E6;color:#7A3B3B}.pts li.p-pl::before{content:"";width:8px;height:8px;top:8px;left:8px;background:var(--muted)}.pts li.p-do::before{content:"→";background:#E3F3EC;color:#24553A}.pts .ans{font-size:14px;padding:6px 10px;border-radius:10px;background:#E3F3EC;color:#24553A}\n'
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v18",n,len(ins),"built",len(out))
