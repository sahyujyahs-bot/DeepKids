# "Do this next" must win over chapters already in progress; toasts must show above an open sheet.
p='/home/user/DeepKids/app/build/template.html';t=open(p).read()
if 'const NX=(S.next' in t: print("already applied"); raise SystemExit
def rep(a,b):
    global t
    assert t.count(a)==1,(t.count(a),a[:80]);t=t.replace(a,b)
rep('function pinOrder(s,q){const pin=S.pin&&S.pin[s],P=q.filter(x=>x.u.k===pin),R=q.filter(x=>x.u.k!==pin);return [...P,...R.filter(x=>coverage(x.u)==="learning"),...R.filter(x=>coverage(x.u)!=="learning")]}',
    'function pinOrder(s,q){const pin=S.pin&&S.pin[s],NX=(S.next||{})[s]||[],P=q.filter(x=>x.u.k===pin),N=NX.flatMap(k=>q.filter(x=>x.u.k===k&&x.u.k!==pin)),R=q.filter(x=>x.u.k!==pin&&!NX.includes(x.u.k));return [...P,...N,...R.filter(x=>coverage(x.u)==="learning"),...R.filter(x=>coverage(x.u)!=="learning")]}')
rep('function toast(m){document.querySelectorAll(".toast").forEach(t=>t.remove());const t=document.createElement("div");t.className="toast";t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}',
    'function toast(m,ms){document.querySelectorAll(".toast").forEach(t=>t.remove());const t=document.createElement("div");t.className="toast";t.textContent=m;const sh=document.getElementById("sheet");(sh&&sh.open?sh:document.body).appendChild(t);setTimeout(()=>t.remove(),ms||Math.max(2200,m.length*60))}')
open(p,'w').write(t);print("ok")
