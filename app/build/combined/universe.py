"""Combined syllabus: the universe of topics taught by any board (NCERT, Cambridge, NIOS) in Classes 1-5.
Each topic gets a rung at every class where some board teaches it, so a child on Combined meets every topic
no later than any board does, and meets it again, deeper, each time another board returns to it.
Science comes from concept_map.py (every board subtopic placed exactly once).
Run: python3 app/build/combined/universe.py   ->  app/build/combined/sci_universe.json
"""
import json, os, re, openpyxl
HERE = os.path.dirname(os.path.abspath(__file__)); BUILD = os.path.dirname(HERE); APP = os.path.dirname(BUILD)
src = open(os.path.join(BUILD, 'concept_map.py')).read()
M = eval(src[src.index('M = [') + 4:src.index('\nused =')])
BI = {}
wb = openpyxl.load_workbook(os.path.join(APP, 'DeepKids_Science_Board_Topics_L1-5.xlsx'), read_only=True)
for r in list(wb['All topics'].iter_rows(values_only=True))[1:]:
    if r[8] != 'From the book' or r[4] == '(no level)': continue
    if r[3] == 'NCERT / CBSE': b, ref = 'ncert', f'Ch {r[5].split("Ch ")[-1]}'; k = f'N{r[0]}-{r[5].split("Ch ")[-1]}'
    elif r[3] == 'Cambridge Primary': t = r[5].split(' · ')[-1]; b, ref, k = 'cambridge', f'Unit {t}', f'C{r[0]}-{t}'
    else: n = r[5].replace('Lesson ', ''); b, ref, k = 'nios', f'Lesson {n}', f'O{r[0]}-{n}'
    BI[k] = {"b": b, "cls": r[0], "ref": ref, "title": r[6], "covers": r[7] or ""}
data = json.load(open(os.path.join(BUILD, 'data.json')))
rc = data['rconcepts']; assert len(rc) == len(M)
items = {i['k']: i for i in data['items']}
# topics no board teaches yet: DeepKids places them on the ladder itself
DK_ONLY = {"how-life-began": [3, 5], "the-world-of-birds": [1, 4], "where-humans-came-from": [4, 5], "our-closest-cousins": [2, 5], "thinking-and-memory": [3, 5]}
out = []
for c, (name, dk, bs, note) in zip(rc, M):
    rungs = {}
    for b in bs:
        x = BI[b]; rungs.setdefault(x['cls'], []).append(x)
    chap = {}
    for k in c['chapters']:
        if k in items: chap.setdefault(items[k]['level'], []).append(k)
    out.append({"id": c['id'], "title": name, "dk": dk, "note": note,
                "start": min(rungs) if rungs else None,
                "rungs": [{"cls": l, "covers": rungs[l], "chapters": chap.get(l, [])} for l in sorted(rungs)] or
                         [{"cls": l, "covers": [], "chapters": [], "deepkids": True} for l in DK_ONLY.get(c['id'], [])]})
json.dump(out, open(os.path.join(HERE, 'sci_universe.json'), 'w'), ensure_ascii=False, indent=1)
n = sum(len(t['rungs']) for t in out)
print(len(out), 'topics,', n, 'rungs,', sum(len(r['covers']) for t in out for r in t['rungs']), 'board subtopics;',
      sum(1 for t in out if not t['rungs']), 'DeepKids-only topics')
