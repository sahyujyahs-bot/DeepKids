# Test login (phone number, no OTP yet): one saved family per number, stays logged in until logout.
# Past days show what was done.
p='/home/user/DeepKids/app/build/template.html';t=open(p).read()
a=t.index('async function boot(){');b=t.index('const commit=()=>{S.updatedAt=Date.now();save();render()};')
t=t[:a]+r'''let ACC=null,DBR=null,UIDR=null,unsub=null;
const LSK=()=>"dk-state-"+(ACC||"guest");
const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}},lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}},lsDel=k=>{try{localStorage.removeItem(k)}catch(e){}};
async function boot(){
  ACC=lsGet("dk-acct");render();
  try{const [db,user]=await Promise.all([window.claude?.use?.("db"),window.claude?.use?.("user")]);UIDR=db&&user?await user.id():null;DBR=UIDR?db:null}catch(e){DBR=null}
  if(DBR&&!ACC){try{const s=await DBR.doc("data/users/"+UIDR+"/session/current").get();if(s.exists&&s.data().acct){ACC=String(s.data().acct);lsSet("dk-acct",ACC)}}catch(e){}}
  if(ACC)await openAccount(ACC);else render()}
async function openAccount(acct,name){ACC=acct;lsSet("dk-acct",acct);if(unsub){try{unsub()}catch(e){}unsub=null}store=null;
  let local=null;try{const ls=lsGet(LSK());if(ls)local=JSON.parse(ls)}catch(e){}
  S={...fresh(),...(local||{})};render();
  if(DBR){try{store=DBR.doc("data/users/"+UIDR+"/accounts/"+acct);const snap=await store.get();let remote=snap.exists?snap.data():null;
      if(!remote){const known=(await DBR.doc("data/users/"+UIDR+"/session/current").get().catch(()=>null))?.data?.()||{};
        if(!known.migrated){const old=await DBR.doc("data/users/"+UIDR+"/planner").get().catch(()=>null);if(old&&old.exists){remote={...old.data(),updatedAt:Date.now()}}}}
      if(remote&&remote.setup!==undefined&&(remote.updatedAt||0)>(S.updatedAt||0))S={...fresh(),...remote};
      if(name&&!S.parent?.name)S.parent={...(S.parent||{}),name};
      S.acct=acct;S.updatedAt=Math.max(S.updatedAt||0,1);await store.set(JSON.parse(JSON.stringify(S)));
      await DBR.doc("data/users/"+UIDR+"/session/current").set({acct,at:Date.now(),migrated:true});
      lsSet(LSK(),JSON.stringify(S));syncMode="account";lastSaved=Date.now();
      unsub=store.onSnapshot(s=>{const r=s.exists?s.data():null;if(r&&r.setup!==undefined&&(r.updatedAt||0)>(S.updatedAt||0)){S={...fresh(),...r};lsSet(LSK(),JSON.stringify(S));render()}},()=>{})}
    catch(e){store=null;syncMode="device"}}
  else{if(name&&!S.parent?.name)S.parent={...(S.parent||{}),name};S.acct=acct;lsSet(LSK(),JSON.stringify(S))}
  const k=JSON.parse(lsGet("dk-known")||"[]").filter(x=>x.acct!==acct);k.unshift({acct,name:S.parent?.name||name||"",child:S.child||""});lsSet("dk-known",JSON.stringify(k.slice(0,5)));
  render()}
async function logout(){if(store){clearTimeout(saveTimer);await writeNow().catch(()=>{})}if(unsub){try{unsub()}catch(e){}unsub=null}
  if(DBR){try{await DBR.doc("data/users/"+UIDR+"/session/current").set({acct:null,at:Date.now(),migrated:true})}catch(e){}}
  lsDel("dk-acct");ACC=null;store=null;S=fresh();ob=null;render()}
let lastSaved=0;
function writeNow(){const body=JSON.parse(JSON.stringify(S));const p=saving.then(()=>store.set(body)).then(()=>{syncMode="account";lastSaved=Date.now();return true},()=>{syncMode="device";return false});saving=p.then(()=>{});return p}
function save(){if(!ACC)return;lsSet(LSK(),JSON.stringify(S));
  if(!store)return;clearTimeout(saveTimer);saveTimer=setTimeout(writeNow,600)}
async function saveNow(){if(!ACC)return false;lsSet(LSK(),JSON.stringify(S));if(!store)return false;clearTimeout(saveTimer);return writeNow()}
addEventListener("pagehide",()=>{if(store&&saveTimer){clearTimeout(saveTimer);writeNow()}});
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"&&store){clearTimeout(saveTimer);writeNow()}});
'''+t[b:]
old='''    if(date===today){S.log.filter(l=>l.date===today&&l.subj===s&&l.kind!=="free")'''
assert old in t
t=t.replace(old,'''    if(date<=today){S.log.filter(l=>l.date===date&&l.subj===s&&l.kind!=="free")''')
open(p,'w').write(t);print("ok")
