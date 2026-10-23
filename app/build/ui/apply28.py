import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply27.py'],check=True,capture_output=True)
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
B=blocks(s.split('\n'));Pb=blocks(open('patch_v24.js').read().split('\n'))
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
lrep('L.push({s,u,done:true,title:l.title,at:l.at,n:l.n,tot:sessionsFor(u)})','L.push({s,u,done:true,title:l.title,at:l.at,n:l.n,tot:sessionsFor(u),skipped:l.kind==="skipped"})')
lrep('title:SUBJ[l.s]+": "+l.u.title,sub:"Done ✓",done:true','title:SUBJ[l.s]+": "+l.u.title,sub:l.skipped?"Skipped":"Done ✓",skipped:l.skipped,done:true')
lrep('evoff:{...(b.evoff||{}),...(a.evoff||{})}','evoff:{...(b.evoff||{}),...(a.evoff||{})},snz:{...(b.snz||{}),...(a.snz||{})}')
rep('if(it.kind==="event"&&evGate(it,date))return;','if(it.kind==="event"&&evGate(it,date))return;if(["lesson","warm","refresh"].includes(it.kind)&&!it.done){openSheet({mode:"iopts",date,id:it.id});return}')
rep('  if(f)h+=nowCard(f);','  h+=pastEvCard(real);if(f)h+=nowCard(f);')
rep('<button class="link sm" data-act="nowmore" data-id="${it.id}" style="justify-self:start">${open?"Hide details":"Details"}</button>','<div class="row" style="gap:18px"><button class="link sm" data-act="nowmore" data-id="${it.id}">${open?"Hide details":"Details"}</button>${OURS(it)&&it.kind!=="exps"?`<button class="link sm" data-act="iopts" ${a}>Did it already, later or skip?</button>`:""}</div>')
rep(':missed?`<span class="tag miss">Still to do</span>`:""',':evPast(it,date)?`<span class="tag miss">Did it happen?</span>`:snzd(it,date)?`<span class="tag">Later today</span>`:missed?`<span class="tag miss">Still to do</span>`:""')
rep('${it.done&&it.doneAt!=null?"done at "+clock(it.doneAt):','${S.tl[date+"|"+it.id]==="skip"?"skipped today":S.tl[date+"|"+it.id]==="missed"?"didn\'t happen":it.skipped?"skipped":it.done&&it.doneAt!=null?"done at "+clock(it.doneAt):')
rep('x.did.push({t:"lesson",s:l.subj,u,n:l.n,title:l.title,at:l.at})','x.did.push({t:"lesson",s:l.subj,u,n:l.n,title:l.title,at:l.at,sk:l.kind==="skipped"})')
rep('if(!x.m[l.subj])add(','if(!x.m[l.subj]&&l.kind!=="skipped")add(')
rep('`<li><b>${ch}</b>${x.n?` · Part ${x.n}`:""}','`<li><b>${ch}</b>${x.n?` · Part ${x.n}`:""}${x.sk?" (skipped)":""}')
old_done=s[s.index('  if(doneL.length)h+=`<div class="row" style="justify-content:space-between;margin-top:8px"><button class="link" data-act="showdone">'):s.index('h+=`</section><button class="morebtn" data-act="moresheet">')]
s=s.replace(old_done,open('todaytiles_v28.js').read())
rep('folder:folderView,','folder:folderView,iopts:ioptsView,')
rep('   case "todo":{','''   case "iopts":{sfx("flip");openSheet({mode:"iopts",date:b.dataset.date,id:b.dataset.id});break}
   case "iofin":case "ioskip":case "iosnz":case "iodone":case "ioskipday":{const date=b.dataset.date,it=dayPlan(date).find(i=>i.id===b.dataset.id),act=b.dataset.act;if(!it)break;const key=date+"|"+it.id;
     if(act==="iofin"){logSession(it.u,"plan");sfx("win");toast(`Part ${it.n} marked done`)}
     else if(act==="ioskip"){logSession(it.u,"skipped");sfx("flip");toast(`Skipped Part ${it.n}`)}
     else if(act==="iosnz"){S.snz={...(S.snz||{}),[key]:nowMin()+60};sfx("flip");toast("Okay, later today")}
     else if(act==="iodone"){S.tl[key]=Date.now();sfx("ok")}
     else{S.tl[key]="skip";sfx("flip");toast("Skipped "+(date===today?"today":"that day"))}
     if(ui.sheet?.mode==="iopts")goBack();commit();break}
   case "evmiss":{const date=b.dataset.date,id=b.dataset.id;S.evlog={...(S.evlog||{}),[date+"|"+id]:{went:false,at:Date.now()}};S.tl[date+"|e-"+id]="missed";sfx("flip");toast("Noted: didn't happen");commit();break}
   case "todo":{''')
CSS='''.iopt{display:grid;gap:2px;text-align:left;padding:14px 16px;border-radius:16px;border:2px solid rgba(43,35,64,.12);background:var(--surface);cursor:pointer;font:inherit;color:inherit}.iopt b{font:600 17px var(--display)}.iopt span{font-size:13px;color:rgba(43,35,64,.65)}.iopt.green{background:var(--forest);border-color:var(--forest);color:#fff}.iopt.green span{color:rgba(255,255,255,.85)}.iopt.warn b{color:var(--bad)}
.donebar{display:flex;align-items:center;gap:10px;width:100%;margin-top:12px;padding:10px 14px;border-radius:16px;border:0;background:rgba(83,163,115,.12);font:inherit;color:inherit;cursor:pointer;text-align:left}.donebar b{flex:1;font:600 16px var(--display)}.donebar .ck{width:28px;height:28px;flex:none;pointer-events:none}.donebar .xs{color:var(--forest);font-weight:700}
.qtiles{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.qtile{display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:10px;align-items:center;text-align:left;padding:12px;border-radius:16px;border:2px solid rgba(43,35,64,.08);background:var(--surface);font:inherit;color:inherit;cursor:pointer;min-width:0}.qtile .qi{grid-row:1/3;display:grid;place-items:center;width:36px;height:36px;border-radius:12px;background:rgba(253,131,38,.14);color:var(--tang)}.qtile .qi svg{width:20px;height:20px}.qtile b{font:600 15px var(--display);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.qtile .xs{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pastev{display:grid;gap:10px;border:2px solid var(--tang)}
'''
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v28",n,len(ins),"built",len(out))
