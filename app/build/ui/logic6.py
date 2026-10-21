# Logic changes for v6: learning modes, topic queue with smart shuffle, shared topics,
# plan options and day type, refreshers, parent learning kept out of the prep lists.
p='/home/user/DeepKids/app/build/template.html';t=open(p).read()
def rep(a,b):
    global t
    assert t.count(a)==1,(t.count(a),a[:90]);t=t.replace(a,b)
rep('function dkUnits(subj,lvl){if(!S.plus||',
    'const modeOf=()=>S.mode||(S.board==="none"?"plus":S.plus?"booksplus":"books");const plusOn=()=>modeOf()!=="books";\nlet SHARED={topics:[]};\nconst genUnit=g=>({k:"gen|"+g.id,board:"gen",subj:g.subj,level:g.level||1,book:"DeepKids topic",n:"★",title:g.name,dk:[],gen:g});\nfunction genUnits(subj,lvl){const ex=(S.extra||{})[subj]||[];return SHARED.topics.filter(g=>g.subj===subj&&(g.level||1)===lvl&&ex.includes("gen|"+g.id)).map(genUnit)}\nfunction dkUnits(subj,lvl){if(!plusOn()||')
rep('function collateAt(subj,lvl){return {board:DATA.items.filter(i=>i.subj===subj&&i.level===lvl&&boardsOn().includes(i.board)),dk:dkUnits(subj,lvl)}}',
    'function collateAt(subj,lvl){return {board:DATA.items.filter(i=>i.subj===subj&&i.level===lvl&&boardsOn().includes(i.board)),dk:dkUnits(subj,lvl),gen:genUnits(subj,lvl)}}')
rep('function plannedAt(s,l){const c=collateAt(s,l);if(c.dk.length)return c.dk;for(const b of boardsOn()){const u=c.board.filter(i=>i.board===b);if(u.length)return u}return []}',
    '''function plannedAt(s,l){const c=collateAt(s,l),m=modeOf();let base=[];for(const b of boardsOn()){const u=c.board.filter(i=>i.board===b);if(u.length){base=u;break}}
  return orderUnits(s,base,m==="books"?c.gen:[...c.dk,...c.gen],m==="plus"?1:2)}
function orderUnits(s,base,extra,every){const later=(S.later||{})[s]||[],nx=(S.next||{})[s]||[];
  let b=(S.shuffle||{})[s]?smartShuffle(base,s):base;const out=[];
  if(S.exam||!b.length||!extra.length)out.push(...b,...extra);else{let j=0;b.forEach((u,i)=>{out.push(u);if((i+1)%every===0&&j<extra.length)out.push(extra[j++])});out.push(...extra.slice(j))}
  const front=nx.map(k=>out.find(u=>u.k===k)).filter(Boolean),back=out.filter(u=>later.includes(u.k)&&!nx.includes(u.k));
  return [...front,...out.filter(u=>!nx.includes(u.k)&&!later.includes(u.k)),...back]}
function smartShuffle(list,s){const R=rng(((S.seed||{})[s]||7)+list.length),left=[...list],out=[],placed=new Set(),inList=new Set(list.map(u=>u.k));
  while(left.length){const ok=left.filter(u=>prereqOf(u).every(k=>placed.has(k)||!inList.has(k)||rank[st(k)]>=2));const pool=ok.length?ok:[left[0]],pick=pool[Math.floor(R()*pool.length)];out.push(pick);placed.add(pick.k);left.splice(left.indexOf(pick),1)}return out}''')
rep('const everyUnit=()=>S.subjects.flatMap(s=>[1,2,3,4,5].flatMap(l=>{const c=collateAt(s,l);return [...c.dk,...c.board]}));',
    'const everyUnit=()=>S.subjects.flatMap(s=>[1,2,3,4,5].flatMap(l=>{const c=collateAt(s,l);return [...c.dk,...c.board,...c.gen]}));')
rep('const unitBy=k=>everyUnit().find(u=>u.k===k);','const unitBy=k=>everyUnit().find(u=>u.k===k)||allUnits().find(u=>u.k===k);')
rep('const estHours=u=>u.c?.x?.hours?','const estHours=u=>u.board==="gen"?(+u.gen.hours||3):u.c?.x?.hours?')
rep('    if(ok)items.push({...p,x,early:p.lead>=2&&x.date!==date})})});',
    '    if(ok&&!LEARNK.has(p.kind))items.push({...p,x,early:p.lead>=2&&x.date!==date})})});')
rep('function prepBlock(date,when){const items=[];','const LEARNK=new Set(["guide","read","learn"]);\nfunction prepBlock(date,when){const items=[];')
rep('''title:"Warm-up: jokes and Word of the Day",sub:"Start the day laughing",done:!!S.tl[date+"|warm"]||(isT&&(G().g.length>0))});''',
    '''title:"Warm-up: jokes and Word of the Day",sub:"Start the day laughing",done:!!S.tl[date+"|warm"]||(isT&&(G().g.length>0))});
    const rf=refresherFor(date);if(rf)items.push({id:"refresh",at:place(15),dur:15,who:"both",kind:"refresh",title:"Refresher: "+rf.title,sub:"From "+rf.u.title,rf,done:!!S.tl[date+"|refresh"]});''')
rep('lessons.forEach((l,i)=>{const dur=hpdOf(l.s)*60,','lessons.forEach((l,i)=>{const dur=lessonMins(l.s,date),')
rep('''  if(pm.length)items.push({id:"pm",''','''  if(parse(date).getDay()===0)items.push({id:"weekplan",at:hm(d.eveAt)-20,dur:15,who:"you",kind:"plan",title:"Plan next week",sub:"Add classes, outings and family plans for the coming week",done:!!S.tl[date+"|weekplan"]});
  if(pm.length)items.push({id:"pm",''')
open(p,'w').write(t);print("logic ok")
