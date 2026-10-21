# Reliable saving: immediate saves with confirmation, live sync between open copies, flush on hide.
p='/home/user/DeepKids/app/build/template.html';t=open(p).read()
old_boot=t[t.index('async function boot(){'):t.index('const commit=()=>{S.updatedAt=Date.now();save();render()};')]
new_boot='''async function boot(){
  try{const ls=localStorage.getItem("dk-state-v2");if(ls)S={...fresh(),...JSON.parse(ls)}}catch(e){}
  render();
  try{const [db,user]=await Promise.all([window.claude?.use?.("db"),window.claude?.use?.("user")]);const id=db&&user?await user.id():null;
    if(db&&id){store=db.doc("data/users/"+id+"/planner");const snap=await store.get();const remote=snap.exists?snap.data():null;
      if(remote&&remote.setup!==undefined&&(remote.updatedAt||0)>(S.updatedAt||0)){S={...fresh(),...remote};try{localStorage.setItem("dk-state-v2",JSON.stringify(S))}catch(e){}}else if(S.setup){await store.set(JSON.parse(JSON.stringify(S)))}
      syncMode="account";lastSaved=Date.now();render();
      // keep every open copy (phone, laptop, an older tab) on the newest data
      store.onSnapshot(s=>{const r=s.exists?s.data():null;if(r&&r.setup!==undefined&&(r.updatedAt||0)>(S.updatedAt||0)){S={...fresh(),...r};try{localStorage.setItem("dk-state-v2",JSON.stringify(S))}catch(e){}render()}},()=>{})}}catch(e){store=null}
}
let lastSaved=0;
function writeNow(){const body=JSON.parse(JSON.stringify(S));const p=saving.then(()=>store.set(body)).then(()=>{syncMode="account";lastSaved=Date.now();return true},()=>{syncMode="device";return false});saving=p.then(()=>{});return p}
function save(){try{localStorage.setItem("dk-state-v2",JSON.stringify(S))}catch(e){}
  if(!store)return;clearTimeout(saveTimer);saveTimer=setTimeout(writeNow,600)}
async function saveNow(){try{localStorage.setItem("dk-state-v2",JSON.stringify(S))}catch(e){}if(!store)return false;clearTimeout(saveTimer);return writeNow()}
addEventListener("pagehide",()=>{if(store&&saveTimer){clearTimeout(saveTimer);writeNow()}});
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"&&store){clearTimeout(saveTimer);writeNow()}});
'''
t=t.replace(old_boot,new_boot)
open(p,'w').write(t);print("ok")
