import re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3','apply7.py'],check=True,capture_output=True)
s=open('new_ui7.js').read()
def blocks(lines):
    out=[];cur=[]
    for l in lines:
        if l and not l[0].isspace() and cur: out.append(cur);cur=[]
        cur.append(l)
    if cur: out.append(cur)
    return out
name=lambda b:(re.match(r'(?:async function|function|const|let) (\w+)',b[0]) or [None,None])[1]
B=blocks(s.split('\n'));Pb=blocks(open('patch_v8.js').read().split('\n'))
bi={name(b):i for i,b in enumerate(B) if name(b)};ins=[];n=0
for p in Pb:
    k=name(p)
    if k and k in bi: B[bi[k]]=p;n+=1
    else: ins.append(p)
k=bi['kolam'];B=B[:k+1]+ins+B[k+1:]
s='\n'.join('\n'.join(b) for b in B)
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:90]);s=s.replace(a,b)
# logged out: the login screen comes first
rep('if(!S.setup&&!ob)return startOnboarding(0);','''if(!ACC){nav.hidden=true;document.getElementById("me").hidden=true;document.getElementById("snd").hidden=true;document.getElementById("hello").innerHTML=`${youBlob("bl bob")}<div><b>Welcome</b><span>DeepKids home planner</span></div>`;m.replaceChildren(el(`<div class="wrap">${loginView()}</div>`));if(sheet.open)sheet.close();return}
  document.getElementById("snd").hidden=false;
  if(!S.setup&&!ob)return startOnboarding(0);''')
rep('function settingsView(){document.getElementById("sheetTitle").textContent="Settings";\n  return `','function settingsView(){document.getElementById("sheetTitle").textContent="Settings";\n  return `${accountCard()}')
rep('document.getElementById("hello").onclick=()=>{if(!ob&&S.setup){','document.getElementById("hello").onclick=()=>{if(ACC&&!ob&&S.setup){')
# Today: arrows to other days
rep('function viewToday(){const items=dayPlan(today),','function viewToday(){if(ui.tday&&ui.tday!==today)return otherDay(ui.tday);const items=dayPlan(today),')
rep('<section class="greet small"><div><span class="eyebrow">${longDate()}</span><h1>${greetWord()}','<section class="greet small"><div>${dayNavBtns(longDate())}<h1>${greetWord()}')
rep('   case "nowmore":','''   case "tday":{const d=b.dataset.d;ui.tday=d==="0"?null:addDays(ui.tday||today,+d);if(ui.tday===today)ui.tday=null;sfx("tap");render();scrollTo(0,0);break}
   case "quickday":{ui.pday=b.dataset.d;ui.pv="day";tab="week";render();scrollTo(0,0);break}
   case "login":{const ph=(document.getElementById("lgPhone").value||"").replace(/\\D/g,"").replace(/^(91|0)(?=\\d{10}$)/,""),nm=(document.getElementById("lgName").value||"").trim();if(ph.length!==10){ui.lgErr="Enter a 10-digit phone number.";sfx("no");render();return}ui.lgErr="";ui.lgBusy=true;render();openAccount("91"+ph,nm).then(()=>{ui.lgBusy=false;tab="today";ui.tday=null;sfx("win");toast(S.setup?"Welcome back"+(pname()?", "+pname():"")+"!":"Logged in. Let's set up your year.");render()});break}
   case "loginas":{ui.lgBusy=true;openAccount(b.dataset.a).then(()=>{ui.lgBusy=false;tab="today";ui.tday=null;sfx("win");toast("Welcome back"+(pname()?", "+pname():"")+"!");render()});break}
   case "logout":{sheet.close();logout().then(()=>{ui.saved=null;toast("Logged out")});break}
   case "checksaved":{if(!store){ui.saved={err:"This view isn't connected to your account, so data is only on this device."};renderSheet();break}ui.savedBusy=true;renderSheet();store.get().then(sn=>{ui.saved=sn.exists?{v:sn.data(),at:Date.now()}:{err:"Nothing saved yet for this number."}}).catch(()=>{ui.saved={err:"Couldn't read the database just now. Try again."}}).finally(()=>{ui.savedBusy=false;renderSheet()});break}
   case "nowmore":''')
# only the parent's own account keeps their state; the logged-out screen never saves
open('new_ui8.js','w').write(s);print("v8 ui",n,len(ins))
T='/home/user/DeepKids/app/build/template.html';t=open(T).read()
logic=t[t.index('<script>')+8:t.index('/* ================= UI')]
head=open('new_head.html').read().replace('</style>',open('v5.css').read()+'\n'+open('v6.css').read()+'\n'+open('v7.css').read()+'\n.daynav{display:flex;align-items:center;gap:8px}.iconbtn.sm{width:34px;height:34px;border-radius:12px}.iconbtn.sm .ico{width:18px;height:18px}\n</style>',1)
open(T,'w').write(head+'\n<script>\n'+logic+s+'</script>\n')
d=open('/home/user/DeepKids/app/build/data.json').read();out=open(T).read().replace('/*DATA*/',d)
open('/home/user/DeepKids/app/index.html','w').write(out);open('app_prev.html','w').write(out)
open('app.js','w').write(out[out.index('<script>')+8:out.rindex('</script>')])
print("built",len(out))
