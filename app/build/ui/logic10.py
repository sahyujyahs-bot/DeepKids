# Account storage paths must be documents directly under data/users/<uid> (the old nested paths were rejected,
# so accounts silently stayed on the device). On opening, merge history from the device copy, the account doc
# and the pre-login planner doc, so no day's lessons are lost.
p='/home/user/DeepKids/app/build/template.html';t=open(p).read()
if 'function mergeIn(' in t: print("already applied"); raise SystemExit
def rep(a,b,n=1):
    global t
    assert t.count(a)==n,(t.count(a),a[:80]);t=t.replace(a,b)
rep('DBR.doc("data/users/"+UIDR+"/session/current")','DBR.doc("data/users/"+UIDR+"/session")',4)
rep('''store=DBR.doc("data/users/"+UIDR+"/accounts/"+acct);const snap=await store.get();let remote=snap.exists?snap.data():null;
      if(!remote){const known=(await DBR.doc("data/users/"+UIDR+"/session").get().catch(()=>null))?.data?.()||{};
        if(!known.migrated){const old=await DBR.doc("data/users/"+UIDR+"/planner").get().catch(()=>null);if(old&&old.exists){remote={...old.data(),updatedAt:Date.now()}}}}
      if(remote&&remote.setup!==undefined&&(remote.updatedAt||0)>(S.updatedAt||0)){S={...fresh(),...remote};ob=null}''','''store=DBR.doc("data/users/"+UIDR+"/acct_"+acct);const snap=await store.get();const remote=snap.exists?snap.data():null;
      const known=(await DBR.doc("data/users/"+UIDR+"/session").get().catch(()=>null))?.data?.()||{};let legacy=null;
      if(!known.migrated){const old=await DBR.doc("data/users/"+UIDR+"/planner").get().catch(()=>null);if(old&&old.exists)legacy=old.data()}
      const cands=[local,remote,legacy].filter(x=>x&&x.setup!==undefined).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));
      if(cands.length){let m=cands[0];cands.slice(1).forEach(c=>m=mergeIn(m,c));S={...fresh(),...m};ob=null}''')
rep('async function logout(){','''function mergeIn(a,b){const key=l=>l.date+"|"+l.key+"|"+l.kind,seen=new Set((a.log||[]).map(key));
  const log=[...(a.log||[]),...(b.log||[]).filter(l=>!seen.has(key(l)))].sort((x,y)=>x.date<y.date?1:x.date>y.date?-1:0).slice(0,400);
  const progress={...(b.progress||{}),...(a.progress||{})};Object.entries(b.progress||{}).forEach(([k,q])=>{const p=(a.progress||{})[k];if(p&&(q.sessions||0)>(p.sessions||0))progress[k]={...p,sessions:q.sessions,status:rank[q.status]>rank[p.status]?q.status:p.status}});
  const keep=o=>Object.fromEntries(Object.entries(o||{}).filter(([,v])=>v!==""&&v!=null));
  return {...a,log,progress,steps:{...(b.steps||{}),...(a.steps||{})},prep:{...(b.prep||{}),...(a.prep||{})},tasks:{...(b.tasks||{}),...(a.tasks||{})},ans:{...(b.ans||{}),...(a.ans||{})},games:{...(b.games||{}),...(a.games||{})},parent:{...keep(b.parent),...keep(a.parent)}}}
async function logout(){''')
open(p,'w').write(t);print("ok")
