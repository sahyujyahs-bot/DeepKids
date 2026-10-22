import os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply19.py'],check=True,capture_output=True)
T='/home/user/DeepKids/app/build/template.html';t=open(T).read()
head=t[:t.index('<script>')];js=t[t.index('<script>')+8:t.rindex('</script>')]
def rep(a,b,c=1):
    global js
    assert js.count(a)==c,(js.count(a),a[:90]);js=js.replace(a,b)
# Planner day view uses the same compact rows as Today; rows open only when tapped
rep('function timeline(date){const items=dayPlan(date),f=focusOf(items,date);return items.length?`<div class="tt">','function timeline(date){const items=dayPlan(date),f=focusOf(items,date);return items.length?`<div class="tt compact">')
rep('const open=ui.open[it.id]??(it===focus),','const open=!!ui.open[it.id],')
CSS='\n.tt.compact .tr.focus .tcard{box-shadow:inset 0 0 0 2.5px var(--tang,#FD8326)}.tt.compact .tag{display:inline-block;font-size:11px;padding:1px 8px;border-radius:99px;margin-right:6px;line-height:1.6;min-height:0;height:auto}.tt.compact .tag.now{background:var(--tang,#FD8326);color:#fff}\n'
head=head.replace('</style>',CSS+'</style>',1)
open(T,'w').write(head+'<script>'+js+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v20 built",len(out))
