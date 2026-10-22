import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply18.py'],check=True,capture_output=True)
T='/home/user/DeepKids/app/build/template.html';t=open(T).read()
head=t[:t.index('<script>')];js=t[t.index('<script>')+8:t.rindex('</script>')]
# a chapter's lesson days are its parts: "Part 8 of 9", never "day 8 of 9"
js,n1=re.subn(r'\b[dD]ay (\$\{[^}]*\}) of \$\{',r'Part \1 of ${',js)
def rep(a,b,c=1):
    global js
    assert js.count(a)==c,(js.count(a),a[:90]);js=js.replace(a,b)
rep('`day ${it.n}${it.tot?" of "','`Part ${it.n}${it.tot?" of "')
rep('" · day "+l.n','" · Part "+l.n')
rep('`Day ${d.n} of the plan`','`Part ${d.n} of the chapter`')
rep('${c.p.days.length} days · ${c.p.day_mins} minutes a day','${c.p.days.length} parts · about ${c.p.day_mins} minutes each')
rep("${P.days.length} days, ${P.day_mins} minutes each. Today's lesson follows this plan","This chapter has ${P.days.length} parts of about ${P.day_mins} minutes. Each lesson is one part")
rep('<summary><b>Day ${d.n}</b>','<summary><b>Part ${d.n}</b>')
rep('"The whole day plan",P.days.length+" days"','"All parts of this chapter",P.days.length+" parts"')
rep('days:"Day plan"','days:"Parts"')
rep('${u.c.p.days.length}-day plan','${u.c.p.days.length} parts')
rep('${l.n?" (day "+l.n+")":""}','${l.n?" (part "+l.n+")":""}')
# chapter text says "Day 5" for its own parts
rep('function fmtPts(text,plain){if(!text)return "";let t=String(text)','function fmtPts(text,plain){if(!text)return "";let t=String(text).replace(/\\bDays (\\d+)\\s*(–|-|to|and)\\s*(\\d+)/g,"Parts $1$2$3").replace(/\\bDay (\\d+)\\b/g,"Part $1")')
open(T,'w').write(head+'<script>'+js+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write('<meta charset="utf-8">'+out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("v19: regex",n1,"built",len(out))
