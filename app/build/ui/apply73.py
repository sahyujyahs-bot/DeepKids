import os, subprocess, re
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply60.py'],check=True,capture_output=True)
T='/home/user/DeepKids/app/build/template.html';t=open(T).read()
head=t[:t.index('<script>')];rest=t[t.index('<script>')+8:t.rindex('</script>')]
P=open('patch_v73.js').read()
assert 'function fxOpen' not in rest
for x,y in (("DeepKids Combined · Class","DeepKids track · Class"),('pill completed" style="font-size:11px">DeepKids depth','pill completed" style="font-size:11px">Written in full'),("written in full DeepKids depth","written in full on the DeepKids track"),('combined:"DeepKids Combined"','combined:"DeepKids track"'),('DeepKids Combined','DeepKids track')):
    rest=rest.replace(x,y)
for x,y in (('const sessionsFor=u=>u.c?.p?','const sessionsFor=u=>u.board==="unit"?fxDayPlan(u).length:u.c?.p?'),('const estHours=u=>u.c?.p?','const estHours=u=>u.board==="unit"?fxParts(u).reduce((a,p)=>a+p[3],0)/60:u.c?.p?'),('function daySteps(u,n,tot){if(u.c?.p)return packDay(u,n);','function daySteps(u,n,tot){if(u.board==="unit")return fxDaySteps(u,n);if(u.c?.p)return packDay(u,n);')):
    assert x in rest or y in rest,x
    if y in rest: continue
    rest=rest.replace(x,y,1)
head=head.replace('</style>',open('fx73.css').read()+'\n</style>',1)
open(T,'w').write(head+'<script>'+rest+'\n'+P+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v73 built",len(out))
