import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply10.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v11.js').read().split('\n'))
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
# What we have: sorter on top, items with their chapter tags
a=s.index('h+=`<section class="sec">${Object.keys(CATS).map(c=>{const L=inv.filter(i=>i.cat===c);');b=s.index('</p>`}',a)+len('</p>`}')
s=s[:a]+'h+=`<section class="sec">${invCard()}${Object.keys(CATS).map(c=>{const L=inv.filter(i=>i.cat===c);return L.length?`<div class="card" style="gap:0"><div class="sech"><h3 style="font-size:18px">${CATS[c]}</h3><span class="pill">${L.length}</span></div>${L.map(invItem).join("")}</div>`:""}).join("")}'+s[b:]
rep('<div class="card"><div class="row" style="flex-wrap:nowrap"><input class="inp" id="invName"','<details class="card"><summary class="link" style="cursor:pointer">Add one thing by hand</summary><div class="row" style="flex-wrap:nowrap;margin-top:10px"><input class="inp" id="invName"')
rep('<button class="btn sm" data-act="invnew" style="justify-self:start">Add</button></div></section>`}','<button class="btn sm" data-act="invnew" style="justify-self:start;margin-top:8px">Add</button></details></section>`}')
rep('[["topics","Topics"],["science","Science resources"]','[["topics","Syllabus"],["science","Science resources"]')
# right time: extras on a lesson, shelf on the chapter page
rep('Not today</button>`):""}</div>`}','Not today</button>`):""}</div>${lessonExtras(it.u)}`}')
rep('if(t==="overview"){if(c?.p)h+=packOverview(u);','if(t==="overview"){if(c?.p)h+=packOverview(u);{const sh=shelfFor(u);if(sh.length)h+=`<section class="card"><span class="eyebrow">From your shelf</span>${sh.map(i=>`<div class="sm"><b>${esc(i.name)}</b>${i.note?` · <span class="muted">${esc(i.note)}</span>`:""}</div>`).join("")}</section>`}')
rep('   case "lt":{','''   case "bb":{navPush();ui.bb=b.dataset.b;ui.bs=null;ui.bl=null;sfx("tap");render();break}
   case "bs":{ui.bs=b.dataset.s;ui.bl=null;sfx("tap");render();break}
   case "bl":{ui.bl=+b.dataset.l;sfx("tap");render();break}
   case "isort":{sfx("tap");runInvSort();break}
   case "ikeep":{const it=ui.idump.items[+b.dataset.i];it.keep=!it.keep;sfx("tap");render();break}
   case "iclear":{ui.idump={};clearIn("invText");render();break}
   case "iadd":{const L=(ui.idump?.items||[]).filter(x=>x.keep);S.inv=[...(S.inv||[]),...L.map(({keep,...x})=>({id:Math.random().toString(36).slice(2,9),...x,from:"sorted"}))];ui.idump={};clearIn("invText");sfx("win");toast(`Added ${L.length} to what you have`);commit();break}
   case "lt":{''')
CSS='\n.grid2:has(.rescard){grid-template-columns:minmax(0,1fr)}.rescard{min-width:0;overflow-wrap:anywhere}#rcSel{max-width:100%}\n.row.chips{gap:6px;flex-wrap:wrap;min-width:0}.chip.xs{white-space:normal;max-width:100%;font-size:12px;padding:5px 10px;min-height:0;height:auto;text-align:left;line-height:1.25}\n.invi{display:flex;gap:8px;justify-content:space-between;align-items:flex-start;padding:10px 0;border-top:1px solid var(--line)}.invi b{font:600 15.5px var(--display)}\n.extras{display:grid;gap:6px;margin-top:10px;padding-top:10px;border-top:1px solid var(--line)}.rescard a{text-decoration:none}\n'
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v11",n,len(ins),"built",len(out))
