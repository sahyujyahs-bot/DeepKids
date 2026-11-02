# apply the rewritten questions, keeping each file's own layout
import json,re,collections,sys
R='/home/user/DeepKids/app/content/'
r=json.load(open(sys.argv[1]))
def ref(j,path):
    p=path.split('.')
    if p[0]=='check': return j['check'],int(p[1])
    if p[0]=='quiz': return j['quiz'],int(p[1])
    if p[0]=='ws' and len(p)==4: return j['worksheets'][int(p[1])]['sections'][int(p[2])][1],int(p[3])
    return j['worksheets'][int(p[1])]['items'],int(p[2])
def valid(old,new):
    if not isinstance(new,dict) or old.get('t')!=new.get('t'): return False
    if not set(old)-{'context'}<=set(new): return False
    if new.get('t')=='mcq' and not (isinstance(new.get('a'),int) and 0<=new['a']<len(new.get('opts',[])) and len(new['opts'])==len(old.get('opts',[]))): return False
    return True
byf=collections.defaultdict(list)
for c in r['changes']: byf[c['f']].append(c)
stat=collections.Counter(); fails=[]
for f,cs in byf.items():
    raw=open(R+f).read(); j=json.loads(raw)
    plain = json.dumps(j,indent=len(raw.split('\n')[1])-len(raw.split('\n')[1].lstrip(' ')),ensure_ascii=False)+('\n' if raw.endswith('\n') else '')==raw
    for c in cs:
        L,i=ref(j,c['path']); old=L[i]; new=c['item']
        if not valid(old,new): stat['invalid']+=1; fails.append((f,c['path'],'invalid')); continue
        if plain: L[i]=new; stat['plain']+=1; continue
        # text edits inside this file's own layout: anchor on the item's question text
        anchor=json.dumps(old.get('p') or old.get('q') or '',ensure_ascii=False)
        pos=raw.find(anchor)
        if pos<0 or raw.count(anchor)!=1: stat['noanchor']+=1; fails.append((f,c['path'],'anchor')); continue
        nxt=raw.find('}',pos)  # end of this item (items hold no nested objects except rare cases)
        seg=raw[pos-200 if pos>200 else 0:]; start=raw.rfind('{',0,pos); seg=raw[start:nxt+1]
        try: chk=json.loads(seg)
        except Exception: stat['nested']+=1; fails.append((f,c['path'],'nested')); continue
        if chk!=old: stat['mismatch']+=1; fails.append((f,c['path'],'mismatch')); continue
        # rebuild the item on one line per key in the same indentation as its first key
        line_start=raw.rfind('\n',0,start)+1; base=raw[line_start:start]
        m=re.search(r'\{\s*\n(\s*)"',seg); inner=m.group(1) if m else None
        if inner is None: newseg=json.dumps(new,ensure_ascii=False)
        else: newseg='{\n'+',\n'.join(inner+json.dumps(k,ensure_ascii=False)+': '+json.dumps(v,ensure_ascii=False) for k,v in new.items())+'\n'+inner[:-len(inner)+len(base)] if False else '{\n'+',\n'.join(inner+json.dumps(k,ensure_ascii=False)+': '+json.dumps(v,ensure_ascii=False) for k,v in new.items())+'\n'+seg[seg.rfind('\n')+1:-1]+'}'
        raw=raw[:start]+newseg+raw[nxt+1:]; L[i]=new; stat['text']+=1
    if plain: raw=json.dumps(j,indent=len(raw.split('\n')[1])-len(raw.split('\n')[1].lstrip(' ')),ensure_ascii=False)+('\n' if raw.endswith('\n') else '')
    assert json.loads(raw)==j, f
    open(R+f,'w').write(raw)
print(dict(stat)); [print(x) for x in fails[:20]]
