"""Collect printable worksheets (DeepKids originals) and curated open-source links into data.json.
Originals: modules in this folder exporting WS = {chapter_key: [spec, ...]}.
Curated:   curated.py exporting CUR = {chapter_key: [{title, src, url, lic, why}]} (only links that passed review).
Run: python3 app/build/worksheets/build.py
"""
import json, os, glob, importlib.util
HERE = os.path.dirname(os.path.abspath(__file__)); DATA = os.path.join(os.path.dirname(HERE), 'data.json')
TYPES = {"match", "circle", "fill", "sort", "label", "maze", "wordsearch", "crossword", "decode", "dots", "sequence", "draw", "table", "board", "numberline", "clocks", "talk"}
def load(p):
    s = importlib.util.spec_from_file_location(os.path.basename(p)[:-3], p); m = importlib.util.module_from_spec(s); s.loader.exec_module(m); return m
data = json.load(open(DATA)); keys = {i['k'] for i in data['items']} | {"dk|" + t['id'] for t in data['topics']}
pws, cws, bad = {}, {}, []
for p in sorted(glob.glob(os.path.join(HERE, '*.py'))):
    if os.path.basename(p) in ('build.py',): continue
    m = load(p)
    for k, L in getattr(m, 'WS', {}).items():
        if k not in keys: bad.append(('unknown chapter', k)); continue
        for n, w in enumerate(L):
            w['id'] = f"{k}|w{n+1}"
            for b in w['blocks']:
                if b['type'] not in TYPES: bad.append(('bad type', k, b['type']))
        pws[k] = L
    for k, L in getattr(m, 'CUR', {}).items():
        if k in keys: cws[k] = L
data['pws'], data['cws'] = pws, cws
json.dump(data, open(DATA, 'w'), ensure_ascii=False, separators=(",", ":"))
print(len(pws), "chapters,", sum(len(v) for v in pws.values()), "worksheets;", sum(len(v) for v in cws.values()), "curated links", bad or "")
