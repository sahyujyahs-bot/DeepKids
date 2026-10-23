"""Collect printable worksheets (DeepKids originals) and curated open-source links into data.json.
Originals are about a topic, not a book: modules in this folder export TOPICS = {topic_id: title},
TWS = {topic_id: [spec, ...]} and, for topics not in data['rconcepts'], CHAPTERS = {topic_id: [chapter keys]}.
Every chapter in every board that maps to a topic gets its sheets.
Curated:   curated.py exporting CUR = {chapter_key: [{title, src, url, lic, why}]} (only links that passed review).
Run: python3 app/build/worksheets/build.py
"""
import json, os, glob, importlib.util
HERE = os.path.dirname(os.path.abspath(__file__)); DATA = os.path.join(os.path.dirname(HERE), 'data.json')
BOOK_TYPES = {"makes", "sudoku", "oddone", "riddles", "decode", "story", "read", "case", "clue", "label2", "art", "investigate", "graph", "tally", "logic", "spot", "cutout", "pics", "debate", "caseboard", "quiz", "cert"}
TYPES = {"match", "circle", "fill", "sort", "label", "maze", "wordsearch", "crossword", "decode", "dots", "sequence", "draw", "table", "board", "numberline", "clocks", "talk"}
def load(p):
    s = importlib.util.spec_from_file_location(os.path.basename(p)[:-3], p); m = importlib.util.module_from_spec(s); s.loader.exec_module(m); return m
data = json.load(open(DATA)); keys = {i['k'] for i in data['items']} | {"dk|" + t['id'] for t in data['topics']}
rc = {c['id']: c for c in data.get('rconcepts', [])}
LVL, KIND = {"gentle", "core", "stretch"}, {"play", "make", "game", "think", "book"}
tws, books, wtopics, cws, bad = {}, {}, {}, {}, []
for p in sorted(glob.glob(os.path.join(HERE, '*.py'))):
    if os.path.basename(p) in ('build.py',): continue
    m = load(p)
    for t, title in getattr(m, 'TOPICS', {}).items():
        ch = getattr(m, 'CHAPTERS', {}).get(t, [])
        if t not in rc and not ch: bad.append(('topic has no chapters', t))
        bad += [('unknown chapter', t, k) for k in ch if k not in keys]
        wtopics[t] = {"title": title, "chapters": [k for k in ch if k in keys]}
    for t, L in getattr(m, 'TWS', {}).items(): tws[t] = tws.get(t, []) + L
    for t, L in getattr(m, 'BOOKS', {}).items(): books[t] = books.get(t, []) + L
    for k, L in getattr(m, 'CUR', {}).items():
        if k in keys: cws[k] = L
# mission books come first in each topic, then the single sheets
for t in set(tws) | set(books):
    if t not in wtopics: bad.append(('topic not declared', t)); continue
    L = books.get(t, []) + tws.get(t, [])
    for n, w in enumerate(L):
        w['id'] = f"{t}|w{n+1}"; w['topicTitle'] = wtopics[t]['title']
        if w.get('lvl') not in LVL: bad.append(('bad level', w['id']))
        if w.get('kind') not in KIND: bad.append(('bad kind', w['id']))
        for b in (blk for pg in w['pages'] for blk in pg['blocks']) if 'pages' in w else w['blocks']:
            if b['type'] not in TYPES | (BOOK_TYPES if 'pages' in w else set()): bad.append(('bad type', w['id'], b['type']))
    tws[t] = L
data.pop('pws', None)
data['tws'], data['wtopics'], data['cws'] = tws, wtopics, cws
json.dump(data, open(DATA, 'w'), ensure_ascii=False, separators=(",", ":"))
reach = {k for t in tws for k in (rc[t]['chapters'] if t in rc else []) + wtopics[t]['chapters']}
print(sum(len(v) for v in books.values()), "mission books;", len(tws), "topics,", sum(len(v) for v in tws.values()), "worksheets, reaching", len(reach), "chapters;", sum(len(v) for v in cws.values()), "curated links", bad or "")
