import json,glob,re,collections,os,sys
rows=[];T=collections.Counter()
for f in sorted(glob.glob('app/content/units/sci/*.L[123].json')):
    u=json.load(open(f)); a=f[:-5]+'.art.json'; art=json.load(open(a)) if os.path.exists(a) else {}
    ok=lambda k: k in art and os.path.exists('app/content/'+(art[k]['src'] if isinstance(art[k],dict) else art[k]))
    L=f[-7:-5]
    vid=sum(1 for v in u['videos'] if re.match(r'^[\w-]{11}$',v.get('youtube','')))
    slots=['intro','summary']+[f'term.{i}' for i in range(len(u['terms']))]+[f'expl.{i}' for i in range(len(u['explanations']))]
    flows=[x['id'] for k in ['experiments','activities','projects','challenges'] for x in u.get(k,[])]
    slots+= [f'flow.{x}' for x in flows]
    sl=sum(ok(k) for k in slots)
    st=[(x['id'],j,s) for x in u.get('experiments',[]) for j,s in enumerate(x.get('setup',[]))]
    sd=sum(1 for i,j,s in st if s.get('scene') or ok(f'setup.{i}.{j}'))
    items=[it for g in u.get('games',[]) for p in g.get('printables',[]) for it in p.get('items',[]) if isinstance(it,(dict,str))]
    ii=sum(1 for it in items if isinstance(it,dict) and it.get('img'))
    ws=len(u.get('worksheets',[]))
    R=dict(u=u['id'],L=L,vid=vid,slots=f"{sl}/{len(slots)}",setup=f"{sd}/{len(st)}",cards=f"{ii}/{len(items)}",ws=ws,pt=bool(u.get('playtest')) or L=='L3')
    rows.append(R)
    for k,(h,n) in [('slots',(sl,len(slots))),('setup',(sd,len(st))),('cards',(ii,len(items))),('vid',(vid,3))]:
        T[(L,k,'have')]+=h; T[(L,k,'all')]+=n
    T[(L,'units','all')]+=1; T[(L,'ws0','all')]+= ws==0
for L in ['L1','L2','L3']:
    print(L, T[(L,'units','all')],'units |', ' | '.join(f"{k} {T[(L,k,'have')]}/{T[(L,k,'all')]}" for k in ['vid','slots','setup','cards']), '| no worksheet', T[(L,'ws0','all')])
if '-v' in sys.argv:
    for r in rows: print(r)
