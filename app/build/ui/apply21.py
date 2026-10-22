import os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply20.py'],check=True,capture_output=True)
T='/home/user/DeepKids/app/build/template.html';t=open(T).read()
head=t[:t.index('<script>')];js=t[t.index('<script>')+8:t.rindex('</script>')]
def rep(a,b,c=1):
    global js
    assert js.count(a)==c,(js.count(a),a[:90]);js=js.replace(a,b)
# after finishing a worksheet, celebrate, then go back to where the parent came from
rep('sfx("win");confetti();toast("Worksheet finished");commit();break}','sfx("win");confetti();toast("Worksheet finished! Taking you back…",1400);commit();setTimeout(()=>{if(ui.sheet?.mode==="ws")goBack()},1400);break}')
CSS='\n.chip[aria-pressed="true"]{background:var(--ink);color:#fff;box-shadow:none}\n'
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+js+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v21 built",len(out))
