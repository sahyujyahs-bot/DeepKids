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
_wl = os.path.join(APP, 'content', 'curriculum', 'waldorf_links.json')
WLINKS = json.load(open(_wl)) if os.path.exists(_wl) else {}
_tg = os.path.join(APP, 'content', 'curriculum', 'unit_chapter_tags.json')   # extra unit tags per board chapter, by topic, at any class
TAGS = json.load(open(_tg)) if os.path.exists(_tg) else {}
# free worksheets on other sites, found per board chapter (content/curriculum/free_worksheets.json): shown as links
_fw = os.path.join(APP, 'content', 'curriculum', 'free_worksheets.json')
for it in data['items']:
    (it.get('c') or {}).pop('more', None)
    for w in (json.load(open(_fw)) if os.path.exists(_fw) else {}).get(it.get('k'), []):
        it.setdefault('c', {}).setdefault('more', []).append({k: w.get(k, '') for k in ('title', 'url', 'publisher', 'age', 'what')})
SUB = {x['id']: x for x in CUR['subtopic_levels']}
SUBI = {x['id']: i for i, x in enumerate(CUR['subtopic_levels'])}   # curriculum order
data['units'] = {}
import re, importlib.util as _iu
_sp = _iu.spec_from_file_location('c3d', os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'c3_daily.py')); _m = _iu.module_from_spec(_sp); _sp.loader.exec_module(_m); C3D = _m.X   # NCERT Class 3 chapter extras (jokes and more)
FLOWK = ("games", "experiments", "activities", "projects", "challenges")
PLAB = {"intro": "Before we begin", "story": "The story", "terms": "Flashcards", "explanations": "How it really works", "agreed": "What we know for sure", "how_we_found_out": "How we found out",
        "challenging": "Is this true?", "big_questions": "Big questions", "roots": "Roots", "videos": "Watch", "quiz": "Quiz", "open_questions": "Nobody knows yet",
        "jokes": "Jokes", "maths": "Maths", "applications": "Where people use it", "photos": "Real pictures", "spotted": "Spot it around you",
        "ask_kids": "Ask during the day", "song": "Song", "links": "Try these and go see", "buy": "Things that help"}


CHECK_T = ("mcq", "truefalse", "fill")   # the item types the app checks and records


def unit_parts(u):
    """The unit's parts in the order the app's feed shows them (mirrors fxCards/fxSecMeta in the app), each as
    [id, title, kind, minutes, questions the app checks, days it runs, key prefix of those questions]."""
    order = list(u['plan']['default_order'])
    if u.get('roots') and 'roots' not in order:
        order.insert(order.index('big_questions') + 1 if 'big_questions' in order else len(order), 'roots')
    if u.get('how_we_found_out') and 'how_we_found_out' not in order:
        j = next((i + 1 for i, k in enumerate(order) if k in ('agreed', 'explanations')), len(order))
        order.insert(j, 'how_we_found_out')
    for k in ("videos", "jokes", "maths", "applications", "photos", "spotted", "ask_kids", "song", "links", "buy"):
        if k not in order: order.append(k)
    ents = {x['id']: (k, x) for k in FLOWK for x in u.get(k, [])}
    ents.update({w['id']: ('worksheets', w) for w in u.get('worksheets', [])})
    out = []
    for o in order:
        if o in ents:
            k, x = ents[o]
            if k == 'worksheets': req, pre = sum(1 for i in x['items'] if i.get('t') in CHECK_T), f"ws.{o}."
            else: req, pre = sum(1 for st in x.get('flow', []) if st.get('check')), f"chk.{o}."
            links = list(x.get('units', [])) + ([x['math_unit']] if x.get('math_unit') else [])
            sched = [[d.get('day'), d.get('mins', 5), d.get('what', '')] for d in x.get('schedule', [])]
            bl = {b.get('id'): b.get('url', '') for b in u.get('buy', []) if b.get('id')}
            mats = [[m, '', ''] if isinstance(m, str) else [m.get('item', ''), str(m.get('qty', '')), bl.get(m.get('buy'), '')] for m in x.get('materials', [])]
            out.append([o, x['title'], k, x.get('mins') or 10, req, x.get('days') or 1, pre, links, sched, mats]); continue
        if o not in PLAB or not u.get(o): continue
        m = {"story": u['story'].get('mins', 10), "terms": round(u.get('cards_mins', 20) / 2), "explanations": 12, "quiz": len(u['quiz']), "big_questions": 10,
             "challenging": 8, "videos": sum(v.get('mins', 0) for v in u['videos']), "roots": (u['roots'].get('practice', {}).get('mins') or 3) + 8}.get(o, 5)
        req, pre = (sum(1 for i in u['quiz'] if i.get('t') in CHECK_T), "quiz.") if o == 'quiz' else (0, "")
        links = [mm['math_unit'] for mm in u.get('maths', []) if mm.get('math_unit')] if o == 'maths' else []
        out.append([o, PLAB[o], o, m, req, 1, pre, links, [], []])
    return out
import shutil; shutil.rmtree(os.path.join(APP, 'units'), ignore_errors=True)
for f in sorted(glob.glob(os.path.join(APP, 'content', 'units', '*', '*.json'))):
    if f.endswith(('.art.json', '.photos.json', '.models.json')): continue
    u = json.load(open(f)); t = TL.get(u['id'])
    if not t: print('unit not in the curriculum:', u['id']); continue
    art = f[:-5] + '.art.json'
    if os.path.exists(art): u['img'] = json.load(open(art))
    ph = f[:-5] + '.photos.json'   # real, credited pictures from free-licence books (app/build/book_images.py)
    if os.path.exists(ph): u['photos'] = json.load(open(ph))
    md = f[:-5] + '.models.json'   # free 3D models to turn around (app/build/free_models.py)
    if os.path.exists(md): u['models'] = json.load(open(md))
    # jokes in one place: the unit's own, plus those written for the board chapters it covers, each tagged with its source
    for j in u.get('jokes', []): j.setdefault('src', 'unit')
    sub_ = SUB.get(u['id'], {}); chap_ = CUR.get('chapters', {})
    for ck in (sub_.get('chapters') or t.get('chapters') or []):
        ik = chap_.get(ck, {}).get('item') or ''
        m = re.match(r'ncert\|sci\|3\|(\d+)$', ik)
        for jk in (C3D.get(int(m.group(1)), {}).get('jokes', []) if m else []):
            q, _, ans = jk.partition('? ')
            if not any(x['j'].startswith(q[:30]) for x in u['jokes']):
                u['jokes'].append({"j": q + ('?' if ans else ''), "a": ans, "src": ik})
    # the full unit is its own file (app/units/<id>.json, loaded when opened); data.json keeps a small index entry
    os.makedirs(os.path.join(APP, 'units'), exist_ok=True)
    json.dump(u, open(os.path.join(APP, 'units', u['id'] + '.json'), 'w'), ensure_ascii=False, separators=(",", ":"))
    sub0 = SUB.get(u['id'], {})
    data['units'][u['id']] = {"id": u['id'], "title": u['title'], "topic": t['name'], "subtopic": sub0.get('name', ''), "parts": unit_parts(u), "spine": u["plan"].get("spine", []), "req": bool(sub0.get("chapters")), "jokes": [[j.get("j", ""), j.get("a", ""), j.get("src", "unit")] for j in u.get("jokes", [])], "buy": [{"item": b.get("item", ""), "kind": b.get("kind", ""), "url": b.get("url", ""), "used_in": b.get("used_in", []), "plan": b.get("plan", "")} for b in u.get("buy", [])], "order": SUBI.get(u["id"], 9999), "summary": {"text": u['summary']['text']}, "song": u.get('song', {}),
                              "img": {"summary": (u.get('img') or {}).get('summary', '')}, "v": hashlib.md5(json.dumps(u, sort_keys=True).encode()).hexdigest()[:10]}
    ref = {"id": u['id'], "title": u['title']}
    # 1. the unit is a lesson like any other: search, browse and related links find it through data['items']
    sub = SUB.get(u['id'], {})
    data['items'].append({"k": "unit|" + u['id'], "board": "unit", "subj": t['subject'], "level": t['level'],
        "book": f"DeepKids track · subtopic unit · Class {t['level']}", "n": sub.get('subtopic', u['id'].split('.')[2]), "title": u['title'], "dk": [],
        "c": {"covers": " · ".join([t['name'], sub.get('name', ''), sub.get('covers', ''), u['summary']['text'], ", ".join(x['term'] for x in u['terms'])]), "unit": u['id']}})
    # 2. every board chapter that teaches this subtopic (or its topic, at this class) links to it
    chap = CUR.get('chapters', {})
    # a unit is written at one level (L3) but belongs with every board chapter that teaches its subtopic, at any class
    base = u['id'].rsplit('.', 1)[0] + '.'
    same = [ck for ck, cv in CUR.get('chapters', {}).items() if any(x.startswith(base) for x in cv.get('subtopic_levels', []))]
    for ck in set(sub.get('chapters', []) + t.get('chapters', []) + same):
        ik = chap.get(ck, {}).get('item')
        for it in data['items']:
            if it.get('k') == ik:
                it.setdefault('c', {}).setdefault('units', [])
                if ref not in it['c']['units']: it['c']['units'].append(ref)
    for ik, ids in TAGS.items():
        if u['id'] in ids:
            for it in data['items']:
                if it.get('k') == ik and ref not in it.setdefault('c', {}).setdefault('units', []): it['c']['units'].append(ref)
    # 3. every Waldorf block that teaches it links to it (content/curriculum/waldorf_links.json)
    for wk, ids in WLINKS.items():
        if u['id'] in ids:
            for it in data['items']:
                if it.get('k') == wk and ref not in it.setdefault('c', {}).setdefault('units', []): it['c']['units'].append(ref)
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
# research retold for kids (app/content/research/SPEC.md): each paper checked, then all of them go in data.json
RKINDS = ["q", "who", "how", "found", "sure", "why", "try", "think", "words"]
def research_errors(r):
    e = [k for k in ("id", "title", "blurb", "topics", "tags", "cover", "source", "cards") if not r.get(k)]
    if [c.get("k") for c in r.get("cards", [])] != RKINDS: e.append("cards must be " + ",".join(RKINDS))
    imgs = [r.get("cover")] + [c["img"] for c in r.get("cards", []) if c.get("img")]
    for i in imgs:
        if not i or not i.get("credit") or not os.path.exists(os.path.join(APP, "content", i.get("src", "-"))): e.append("image missing or uncredited: " + str((i or {}).get("src")))
    if not (r.get("source") or {}).get("url"): e.append("source url")
    return e
data['research'] = []
for f in sorted(glob.glob(os.path.join(APP, 'content', 'research', '*.json'))):
    r = json.load(open(f)); e = research_errors(r)
    if e: print('research skipped', os.path.basename(f), e[:3]); continue
    data['research'].append(r)
print('research:', len(data['research']))
data['combined'] = plan
data.pop('notebook', None)
json.dump(data, open(DATA, 'w'), ensure_ascii=False, separators=(",", ":"))
tot = sum(len(L) for s in plan.values() for L in s.values())
print(f"combined: {tot} topic rungs, {written} with Combined lessons, the rest use board chapters for now")
for s in plan:
    for c in sorted(plan[s], key=int): print(f"  {s} class {c}: {len(plan[s][c])} topics, {sum('k' in x for x in plan[s][c])} written")
