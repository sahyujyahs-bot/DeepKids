import os, subprocess, re
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply60.py'],check=True,capture_output=True)
T='/home/user/DeepKids/app/build/template.html';t=open(T).read()
head=t[:t.index('<script>')];rest=t[t.index('<script>')+8:t.rindex('</script>')]
P=open('patch_v72.js').read()
assert 'function fxOpen' not in rest
for x,y in (("DeepKids Combined · Class","DeepKids track · Class"),('pill completed" style="font-size:11px">DeepKids depth','pill completed" style="font-size:11px">Written in full'),("written in full DeepKids depth","written in full on the DeepKids track"),('combined:"DeepKids Combined"','combined:"DeepKids track"')):
    rest=rest.replace(x,y)
head=head.replace('</style>',open('fx72.css').read()+'\n</style>',1)
open(T,'w').write(head+'<script>'+rest+'\n'+P+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v72 built",len(out))
