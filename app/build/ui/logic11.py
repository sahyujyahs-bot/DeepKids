# Record when things are actually done, and show that time on the day instead of the planned slot.
p='/home/user/DeepKids/app/build/template.html';t=open(p).read()
if 'doneNoTime' in t: print("already applied"); raise SystemExit
def rep(a,b):
    global t
    assert t.count(a)==1,(t.count(a),a[:80]);t=t.replace(a,b)
rep('S.log.unshift({date:today,key:u.k,subj:u.subj,title:u.title,kind});','{const d=new Date();S.log.unshift({date:today,key:u.k,subj:u.subj,title:u.title,kind,n:p.sessions,at:d.getHours()*60+d.getMinutes(),t:d.getTime()})}')
rep('L.push({s,u,done:true,title:l.title})','L.push({s,u,done:true,title:l.title,at:l.at,n:l.n,tot:sessionsFor(u)})')
rep('  lessons.forEach((l,i)=>{const dur=lessonMins(l.s,date),lastEnd=cur;','  lessons.forEach((l,i)=>{if(l.done&&l.at!=null){items.push({id:"L-"+l.s+"d"+i,at:l.at,doneAt:l.at,dur:lessonMins(l.s,date),who:"both",kind:"lesson",s:l.s,u:l.u,n:l.n,tot:l.tot,title:SUBJ[l.s]+": "+l.u.title,sub:"Done ✓",done:true});return}const dur=lessonMins(l.s,date),lastEnd=cur;')
rep('title:(l.bonus?"Bonus · ":"")+SUBJ[l.s]+": "+l.u.title,sub:l.done?"Done ✓"','doneNoTime:!!l.done,title:(l.bonus?"Bonus · ":"")+SUBJ[l.s]+": "+l.u.title,sub:l.done?"Done ✓"')
rep('  return items.sort((a,b)=>a.at-b.at||(a.kind==="prep"?-1:1))}','  items.forEach(it=>{if(!it.done||it.kind==="event"||it.kind==="lesson")return;const v=S.tl[date+"|"+it.id];if(typeof v==="number"&&v>1e12){const x=new Date(v);it.at=it.doneAt=x.getHours()*60+x.getMinutes()}});\n  return items.sort((a,b)=>a.at-b.at||(a.kind==="prep"?-1:1))}')
open(p,'w').write(t);print("ok")
