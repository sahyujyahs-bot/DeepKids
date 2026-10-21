import os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply13.py'],check=True,capture_output=True)
T='/home/user/DeepKids/app/build/template.html';t=open(T).read()
head=t[:t.index('<script>')];logic=t[t.index('<script>')+8:t.index('/* ================= UI')];s=t[t.index('/* ================= UI'):t.rindex('</script>')]
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:90]);s=s.replace(a,b)
# show the real time something was done, and which day of the chapter a lesson was
rep('[hh,ap]=it.anytime?["Any","time"]:clock(it.at).split(" ");','[hh,ap]=it.anytime?["Any","time"]:it.done&&it.doneNoTime?["Done",""]:clock(it.at).split(" ");')
rep('<span>${tag}${it.kind==="lesson"?SUBJ[it.s]+" · ":""}${ROLE[it.who]} · ${mins(it.dur/60)}</span>','<span>${tag}${it.kind==="lesson"?SUBJ[it.s]+" · "+(it.n?`day ${it.n}${it.tot?" of "+it.tot:""} · `:""):""}${it.done&&it.doneAt!=null?"done at "+clock(it.doneAt):it.done&&it.doneNoTime?"done, time not recorded":ROLE[it.who]+" · "+mins(it.dur/60)}</span>')
rep('else{const key=date+"|"+it.id;if(S.tl[key])delete S.tl[key];else{S.tl[key]=1;sfx("ok")}}','else{const key=date+"|"+it.id;if(S.tl[key])delete S.tl[key];else{S.tl[key]=Date.now();sfx("ok")}}')
a=s.index('<span>Lessons done</span><b>');b=s.index('</b>',a)+4
s=s[:a]+'<span>Lessons done</span><b>${(d.v.log||[]).length}</b></div>${(d.v.log||[]).length?`<span class="eyebrow" style="margin-top:8px">Last things saved</span><ol class="sm">${d.v.log.slice(0,6).map(l=>`<li>${esc(fmt(l.date))}${l.at!=null?", "+clock(l.at):""}: ${esc(l.title)}${l.n?" (day "+l.n+")":""}</li>`).join("")}</ol>`:""}<div class="kv">'+s[b:]
open(T,'w').write(head+'<script>'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v14 built",len(out))
