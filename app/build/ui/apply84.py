import os, subprocess, re
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply60.py'],check=True,capture_output=True)
T='/home/user/DeepKids/app/build/template.html';t=open(T).read()
head=t[:t.index('<script>')];rest=t[t.index('<script>')+8:t.rindex('</script>')]
P=open('patch_v84.js').read()
assert 'function fxOpen' not in rest
for x,y in (("DeepKids Combined · Class","DeepKids track · Class"),('pill completed" style="font-size:11px">DeepKids depth','pill completed" style="font-size:11px">Written in full'),("written in full DeepKids depth","written in full on the DeepKids track"),('combined:"DeepKids Combined"','combined:"DeepKids track"'),('DeepKids Combined','DeepKids track')):
    rest=rest.replace(x,y)
rest=rest.replace('const sessionsFor=u=>u.board==="unit"?fxDayPlan(u).length:','const sessionsFor=u=>')   # an older build wrote this into the template
rest=rest.replace('for(const b of [...boardsOn(),"ncert","cambridge","nios"]){const u=c.board.filter(i=>i.board===b);if(u.length){base=u;break}}if(boardsOn()[0]==="combined")base=fxTrack(base,s,l);','for(const b of boardsOn()){const u=c.board.filter(i=>i.board===b);if(u.length){base=u;break}}').replace('for(const b of boardsOn()){const u=c.board.filter(i=>i.board===b);if(u.length){base=u;break}}if(boardsOn()[0]==="combined")base=fxTrack(base,s,l);','for(const b of boardsOn()){const u=c.board.filter(i=>i.board===b);if(u.length){base=u;break}}').replace('for(const b of [...boardsOn(),"ncert","cambridge","nios"]){const u=c.board.filter(i=>i.board===b);if(u.length){base=u;break}}','for(const b of boardsOn()){const u=c.board.filter(i=>i.board===b);if(u.length){base=u;break}}')
for x,y in (('const sessionsFor=u=>u.c?.p?','const sessionsFor=u=>u.board==="unit"?fxSpineDays(u).length:u.c?.p?'),('const estHours=u=>u.c?.p?','const estHours=u=>u.board==="unit"?fxParts(u).reduce((a,p)=>a+p[3],0)/60:u.c?.p?'),('const st=k=>S.progress[k]?.status||"none";const done=k=>S.progress[k]?.sessions||0;','const st=k=>k.startsWith("unit|")?fxUnitSt(k):S.progress[k]?.status||"none";const done=k=>k.startsWith("unit|")?fxSessionsDone(k):S.progress[k]?.sessions||0;'),('function logSession(u,kind){const p=','function logSession(u,kind){if(u.board==="unit"){const d=new Date();S.log.unshift({date:today,key:u.k,subj:u.subj,title:u.title,kind,n:done(u.k),at:d.getHours()*60+d.getMinutes(),t:d.getTime()});S.log=S.log.slice(0,3000);return}const p='),('for(const b of boardsOn()){const u=c.board.filter(i=>i.board===b);if(u.length){base=u;break}}','for(const b of [...boardsOn(),"ncert","cambridge","nios"]){const u=c.board.filter(i=>i.board===b);if(u.length){base=u;break}}if(boardsOn()[0]==="combined")base=fxTrack(base,s,l);'),
 ('out.push({date:s,subj,...queue.shift()})','out.push({date:s,subj,...fxTake(queue,s)})'),
 ('combinedNote()+queuesView()','combinedNote()+fxCoverageNote()+queuesView()'),
 ('mins:15,days:[0,1,2,3,4,5,6]','mins:45,days:[0,1,2,3,4,5,6]'),
 ('const open=S.exps.filter(e=>!e.closed&&e.start<=date);if(open.length)items.push({id:"exps",at:place(5),dur:5,','const open=[...S.exps.filter(e=>!e.closed&&e.start<=date),...fxOngoing(date)];if(open.length)items.push({id:"exps",at:place(fxOM(open)),dur:fxOM(open),'),
 ('eveAt:"20:30"}','eveAt:"20:30",endAt:"18:30"}'),
 ('const at=place(dur);if(i>0&&+d.brk&&at===lastEnd+ +d.brk)','const at=place(dur),late=at+dur>hm(d.endAt||"18:30");if(i>0&&+d.brk&&at===lastEnd+ +d.brk)'),
 ('items.push({id:"L-"+l.s+(l.bonus?"b":"")+i,at,dur,','items.push({id:"L-"+l.s+(l.bonus?"b":"")+i,at:late?24*60-1:at,anytime:late,dur,'),
 ('sub:l.done?"Done ✓":`Part ${l.n} of ${l.tot}`','sub:l.done?"Done ✓":(late?`Doesn\'t fit before your day ends at ${d.endAt||"18:30"} · do it any time, or move it · `:"")+`Part ${l.n} of ${l.tot}`'),
 ('value="${d.eveAt}"></div>','value="${d.eveAt}"></div><div class="field"><label for="dEnd">Learning ends by</label><input class="inp" id="dEnd" type="time" data-dayset="endAt" value="${d.endAt||"18:30"}"></div>'),
 ('base.push(u)}}));\n  return orderUnits(s,base,','base.push(u)}}));\n  return orderUnits(s,fxExpand(base),'),
 ('sci:[1,3,5],dks:','sci:[1,2,3,4,5],dks:'),
 ('function prepFor(u,n,tot){if(u.c?.p)return packPrep(u,n);','function prepFor(u,n,tot){if(u.board==="unit")return fxPrep(u,n);if(u.c?.p)return packPrep(u,n);'),
 ('combinedNote()+fxCoverageNote()+queuesView()','combinedNote()+fxCoverageNote()+fxWeekList()+queuesView()'),
 ('maxlength="11" placeholder="98765 43210"','maxlength="16" placeholder="98765 43210"'),
 ('if(ph.length!==10){ui.lgErr="Enter a 10-digit phone number.";','if(ph.length!==10||!/^[6-9]/.test(ph)||/^(\\d)\\1{9}$/.test(ph)||"01234567890".includes(ph)||"98765432109".includes(ph)){ui.lgErr="Enter a real 10-digit mobile number. Indian mobile numbers start with 6, 7, 8 or 9.";'),
 ('const dayTypeOf=d=>((S.dayType||{})[d])||"full";','const dayTypeOf=d=>((S.dayType||{})[d])||(fxWT(parse(d).getDay())==="half"?"busy":"full");'),
 ('if(days.includes(d.getDay())&&','if(days.includes(d.getDay())&&fxWT(d.getDay())!=="free"&&'),
 ('<div class="field"><label for="dEnd">','${fxWeekRow()}<div class="field"><label for="dEnd">'),
 ('function collateAt(subj,lvl){return {board:DATA.items.filter(i=>i.subj===subj&&i.level===lvl&&boardsOn().includes(i.board))','function collateAt(subj,lvl){const bo=[...boardsOn()];if(S.board!=="waldorf"&&S.board!=="none"&&!DATA.items.some(i=>i.subj===subj&&i.level===lvl&&bo.includes(i.board)))for(const f of ["ncert","cambridge","nios"])if(DATA.items.some(i=>i.subj===subj&&i.level===lvl&&i.board===f)){bo.push(f);break}return {board:DATA.items.filter(i=>i.subj===subj&&i.level===lvl&&bo.includes(i.board))'),
 ('const boardsOn=()=>S.board==="combined"?["combined","ncert","cambridge","nios"]:S.board==="none"?[]:[S.board];','const boardsOn=()=>S.board==="combined"?["combined","ncert","cambridge","nios"]:S.board==="none"?[]:(S.boards?.length?S.boards:[S.board]);'),
 ('function daySteps(u,n,tot){if(u.c?.p)return packDay(u,n);','function daySteps(u,n,tot){if(u.board==="unit")return fxDaySteps(u,n);if(u.c?.p)return packDay(u,n);')):
    assert x in rest or y in rest,x
    if y in rest: continue
    rest=rest.replace(x,y,1)
_L=rest.split('\n');_o=[];_seen=set()
for _l in _L:
    if len(_l)>60 and _l.lstrip().startswith('if(') and _l in _seen: continue   # never repeat a planner line (an old build step used to stack them)
    _seen.add(_l);_o.append(_l)
rest='\n'.join(_o)
head=head.replace('family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800','family=Rozha+One&family=Mukta:wght@400;500;600;700&family=Kalam:wght@400;700')
head=head.replace('</style>',open('fx84.css').read()+'\n</style>',1)
open(T,'w').write(head+'<script>'+rest+'\n'+P+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v84 built",len(out))
