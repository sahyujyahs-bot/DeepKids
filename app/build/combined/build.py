"""Adds the Combined syllabus to data.json.
- items: one 'combined' chapter per topic rung that has a written lesson (app/content/combined/*.json)
- data['combined'][subj][class]: the plan order. Each entry is a topic rung, with either its Combined lesson
  ('k') or, until that is written, the board chapters at that class that teach the topic ('use').
Run after make_data.py: python3 app/build/combined/build.py
"""
import json, os, glob, sys
HERE = os.path.dirname(os.path.abspath(__file__)); BUILD = os.path.dirname(HERE); APP = os.path.dirname(BUILD)
sys.path.insert(0, BUILD)
from validate_pack import check
DATA = os.path.join(BUILD, 'data.json'); data = json.load(open(DATA))
data['items'] = [i for i in data['items'] if i['board'] != 'combined']
have = {i['k'] for i in data['items']}
PACKS = {}
for f in sorted(glob.glob(os.path.join(APP, 'content', 'combined', '*.json'))):
    e = check(f)
    DEPTH = ("subconcepts", "combined worksheets need", "written-reasoning")
    hard = [x for x in e if not any(d in x for d in DEPTH)]
    if hard: print('skipping', os.path.basename(f), hard[:3]); continue
    if e: print('below the new depth bar (kept for now):', os.path.basename(f))
    p = json.load(open(f)); PACKS[p['key']] = p
BN = {'ncert': 'NCERT', 'cambridge': 'Cambridge', 'nios': 'NIOS'}
# alternate strands through the year instead of doing all of biology, then all of physics
U = json.load(open(os.path.join(HERE, 'sci_universe.json')))
plan, written = {}, 0
for subj, uni in (('sci', U),):
    plan[subj] = {}
    for t in uni:
        for r in t['rungs']:
            cls = r['cls']; key = f"combined|{subj}|{cls}|{t['id']}"; p = PACKS.get(key)
            boards = [{"b": x['b'], "ref": x['ref'], "title": x['title']} for x in r['covers']]
            use = [k for k in r['chapters'] if k in have]
            if p:
                written += 1
                data['items'].append({"k": key, "board": "combined", "subj": subj, "level": cls, "book": f"DeepKids Combined · Class {cls}",
                    "n": t['id'], "title": p['title'], "dk": t['dk'],
                    "c": {"covers": "; ".join(f"{BN[x['b']]} {x['ref']} {x['title']}" for x in boards), "boards": boards, "topic": t['title'],
                          "p": {k: v for k, v in p.items() if k not in ('key', 'board', 'subj', 'level', 'n')}}})
            plan[subj].setdefault(str(cls), []).append({"topic": t['id'], "title": t['title'], "dk": t['dk'], "boards": boards,
                                                        **({"k": key} if p else {"use": use})})
# spread topics: take one rung from each part of the topic list in turn (life, matter, earth and space, forces, body...)
for subj in plan:
    for cls, L in plan[subj].items():
        n = 4; parts = [L[i * len(L) // n:(i + 1) * len(L) // n] for i in range(n)]; out = []
        while any(parts):
            for q in parts:
                if q: out.append(q.pop(0))
        plan[subj][cls] = out
data['combined'] = plan
data.pop('notebook', None)
json.dump(data, open(DATA, 'w'), ensure_ascii=False, separators=(",", ":"))
tot = sum(len(L) for s in plan.values() for L in s.values())
print(f"combined: {tot} topic rungs, {written} with Combined lessons, the rest use board chapters for now")
for s in plan:
    for c in sorted(plan[s], key=int): print(f"  {s} class {c}: {len(plan[s][c])} topics, {sum('k' in x for x in plan[s][c])} written")
