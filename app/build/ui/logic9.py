# Chapter packs (app/content): exact day plans drive the lesson days, prep and session counts. Notes can be per level.
p='/home/user/DeepKids/app/build/template.html';t=open(p).read()
if 'packDay(u,n)' in t: print("already applied"); raise SystemExit
def rep(a,b):
    global t
    assert t.count(a)==1,(t.count(a),a[:80]);t=t.replace(a,b)
rep('const sessionsFor=u=>Math.max(1,','const sessionsFor=u=>u.c?.p?u.c.p.days.length:Math.max(1,')
rep('const estHours=u=>u.board==="gen"?','const estHours=u=>u.c?.p?u.c.p.days.length*u.c.p.day_mins/60:u.board==="gen"?')
rep('function daySteps(u,n,tot){const cap=hpdOf(u.subj);','function daySteps(u,n,tot){if(u.c?.p)return packDay(u,n);const cap=hpdOf(u.subj);')
rep('function prepFor(u,n,tot){','function prepFor(u,n,tot){if(u.c?.p)return packPrep(u,n);')
rep('DATA.notes[b]?.[subj];','(DATA.notes[b]?.[subj+"|"+lvl]??DATA.notes[b]?.[subj]);')
open(p,'w').write(t);print("ok")
