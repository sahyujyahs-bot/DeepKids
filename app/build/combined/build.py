"""Adds the Combined syllabus to data.json.
- items: one 'combined' chapter per topic rung that has a written lesson (app/content/combined/*.json)
- data['combined'][subj][class]: the plan order. Each entry is a topic rung, with either its Combined lesson
  ('k') or, until that is written, the board chapters at that class that teach the topic ('use').
Run after make_data.py: python3 app/build/combined/build.py
"""
import json, os, glob, sys, hashlib
HERE = os.path.dirname(os.path.abspath(__file__)); BUILD = os.path.dirname(HERE); APP = os.path.dirname(BUILD)
sys.path.insert(0, BUILD)
from validate_pack import check
DATA = os.path.join(BUILD, 'data.json'); data = json.load(open(DATA))
data['items'] = [i for i in data['items'] if i['board'] not in ('combined', 'unit')]
for i in data['items']: (i.get('c') or {}).pop('units', None)   # rebuilt below, so reruns never stack
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
                data['items'].append({"k": key, "board": "combined", "subj": subj, "level": cls, "book": f"DeepKids track · Class {cls}",
                    "n": t['id'], "title": p['title'], "dk": t['dk'] if isinstance(t['dk'], list) else [t['dk']] if t['dk'] else [],
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
# subtopic-level units (app/content/units/<subj>/*.json): attach each to its topic rung by the curriculum's topic-level name
import re
slug = lambda x: re.sub(r'[^a-z0-9]+', '-', x.lower()).strip('-')
CUR = json.load(open(os.path.join(APP, 'content', 'curriculum', 'sci.json')))
TL = {s: t for t in CUR['topic_levels'] for s in t['subtopic_levels']}
SUB = {x['id']: x for x in CUR['subtopic_levels']}
data['units'] = {}
import shutil; shutil.rmtree(os.path.join(APP, 'units'), ignore_errors=True)
for f in sorted(glob.glob(os.path.join(APP, 'content', 'units', '*', '*.json'))):
    if f.endswith(('.art.json', '.photos.json')): continue
    u = json.load(open(f)); t = TL.get(u['id'])
    if not t: print('unit not in the curriculum:', u['id']); continue
    art = f[:-5] + '.art.json'
    if os.path.exists(art): u['img'] = json.load(open(art))
    ph = f[:-5] + '.photos.json'   # real, credited pictures from free-licence books (app/build/book_images.py)
    if os.path.exists(ph): u['photos'] = json.load(open(ph))
    # the full unit is its own file (app/units/<id>.json, loaded when opened); data.json keeps a small index entry
    os.makedirs(os.path.join(APP, 'units'), exist_ok=True)
    json.dump(u, open(os.path.join(APP, 'units', u['id'] + '.json'), 'w'), ensure_ascii=False, separators=(",", ":"))
    data['units'][u['id']] = {"id": u['id'], "title": u['title'], "summary": {"text": u['summary']['text']}, "song": u.get('song', {}),
                              "img": {"summary": (u.get('img') or {}).get('summary', '')}, "v": hashlib.md5(json.dumps(u, sort_keys=True).encode()).hexdigest()[:10]}
    ref = {"id": u['id'], "title": u['title']}
    # 1. the unit is a lesson like any other: search, browse and related links find it through data['items']
    sub = SUB.get(u['id'], {})
    data['items'].append({"k": "unit|" + u['id'], "board": "unit", "subj": t['subject'], "level": t['level'],
        "book": f"DeepKids track · subtopic unit · Class {t['level']}", "n": sub.get('subtopic', u['id'].split('.')[2]), "title": u['title'], "dk": [],
        "c": {"covers": " · ".join([t['name'], sub.get('name', ''), sub.get('covers', ''), u['summary']['text'], ", ".join(x['term'] for x in u['terms'])]), "unit": u['id']}})
    # 2. every board chapter that teaches this subtopic (or its topic, at this class) links to it
    chap = CUR.get('chapters', {})
    for ck in set(sub.get('chapters', []) + t.get('chapters', [])):
        ik = chap.get(ck, {}).get('item')
        for it in data['items']:
            if it.get('k') == ik:
                it.setdefault('c', {}).setdefault('units', [])
                if ref not in it['c']['units']: it['c']['units'].append(ref)
    for e in plan.get(t['subject'], {}).get(str(t['level']), []):
        if e['topic'] == slug(t['name']) or slug(e['title']) == slug(t['name']):
            e.setdefault('units', []).append({"id": u['id'], "title": u['title']})
            for it in data['items']:
                if it.get('k') == e.get('k') and ref not in it['c'].setdefault('units', []): it['c']['units'].append(ref)
            break
    else: print('no rung for unit', u['id'])
print('units:', len(data['units']))
# songs: lyrics, chords, sheet music (ABC) and the backing track, embedded so the artifact can play them too
import base64
data['songs'] = {}
for f in sorted(glob.glob(os.path.join(APP, 'content', 'songs', '*.json'))):
    sg = json.load(open(f)); mp3 = f[:-5] + '.mp3'; abcf = f[:-5] + '.abc'
    if os.path.exists(mp3): sg['audio'] = 'data:audio/mpeg;base64,' + base64.b64encode(open(mp3, 'rb').read()).decode()
    if os.path.exists(abcf): sg['abc'] = open(abcf).read()
    data['songs'][sg['id']] = sg
print('songs:', len(data['songs']))
data['combined'] = plan
data.pop('notebook', None)
json.dump(data, open(DATA, 'w'), ensure_ascii=False, separators=(",", ":"))
tot = sum(len(L) for s in plan.values() for L in s.values())
print(f"combined: {tot} topic rungs, {written} with Combined lessons, the rest use board chapters for now")
for s in plan:
    for c in sorted(plan[s], key=int): print(f"  {s} class {c}: {len(plan[s][c])} topics, {sum('k' in x for x in plan[s][c])} written")
