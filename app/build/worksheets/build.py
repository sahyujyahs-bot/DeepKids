"""Collect printable worksheets (DeepKids originals) and curated open-source links into data.json.
Originals are about a topic, not a book: modules in this folder export TOPICS = {topic_id: title},
TWS = {topic_id: [spec, ...]} and, for topics not in data['rconcepts'], CHAPTERS = {topic_id: [chapter keys]}.
Every chapter in every board that maps to a topic gets its sheets.
Curated:   curated.py exporting CUR = {chapter_key: [{title, src, url, lic, why}]} (only links that passed review).
Run: python3 app/build/worksheets/build.py
"""
import json, os, glob, importlib.util
HERE = os.path.dirname(os.path.abspath(__file__)); DATA = os.path.join(os.path.dirname(HERE), 'data.json')
TYPES = {"match", "circle", "fill", "sort", "label", "maze", "wordsearch", "crossword", "decode", "dots", "sequence", "draw", "table", "board", "numberline", "clocks", "talk"}
def load(p):
    s = importlib.util.spec_from_file_location(os.path.basename(p)[:-3], p); m = importlib.util.module_from_spec(s); s.loader.exec_module(m); return m
data = json.load(open(DATA)); keys = {i['k'] for i in data['items']} | {"dk|" + t['id'] for t in data['topics']}
rc = {c['id']: c for c in data.get('rconcepts', [])}
LVL, KIND = {"gentle", "core", "stretch"}, {"play", "make", "game", "think"}
tws, wtopics, cws, bad = {}, {}, {}, []
for p in sorted(glob.glob(os.path.join(HERE, '*.py'))):
    if os.path.basename(p) in ('build.py',): continue
    m = load(p)
    for t, title in getattr(m, 'TOPICS', {}).items():
        ch = getattr(m, 'CHAPTERS', {}).get(t, [])
        if t not in rc and not ch: bad.append(('topic has no chapters', t))
        bad += [('unknown chapter', t, k) for k in ch if k not in keys]
        wtopics[t] = {"title": title, "chapters": [k for k in ch if k in keys]}
    for t, L in getattr(m, 'TWS', {}).items():
        if t not in wtopics: bad.append(('topic not declared', t)); continue
        for n, w in enumerate(L):
            w['id'] = f"{t}|w{n+1}"
            if w.get('lvl') not in LVL: bad.append(('bad level', w['id']))
            if w.get('kind') not in KIND: bad.append(('bad kind', w['id']))
            for b in w['blocks']:
                if b['type'] not in TYPES: bad.append(('bad type', w['id'], b['type']))
        tws[t] = L
    for k, L in getattr(m, 'CUR', {}).items():
        if k in keys: cws[k] = L
data.pop('pws', None)
data['tws'], data['wtopics'], data['cws'] = tws, wtopics, cws
json.dump(data, open(DATA, 'w'), ensure_ascii=False, separators=(",", ":"))
reach = {k for t in tws for k in (rc[t]['chapters'] if t in rc else []) + wtopics[t]['chapters']}
print(len(tws), "topics,", sum(len(v) for v in tws.values()), "worksheets, reaching", len(reach), "chapters;", sum(len(v) for v in cws.values()), "curated links", bad or "")
