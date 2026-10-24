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
# extra DeepKids rungs on board topics (the founder's gravity track starts earlier than any board)
DK_EXTRA = {"gravity": [3]}
for t in out:
    have = {r['cls'] for r in t['rungs']}
    for l in DK_EXTRA.get(t['id'], []):
        if l not in have: t['rungs'].append({"cls": l, "covers": [], "chapters": [], "deepkids": True})
    t['rungs'].sort(key=lambda r: r['cls'])
    if t['rungs']: t['start'] = t['rungs'][0]['cls']
# The Deep End: big ideas no board teaches at primary level, from the founder's Grade 1-5 concept grid
# (app/content/ideas/grade_concepts.json). Each lists the grid rows it draws on.
DEEP_END = [
    ("how-we-know", "How we know: science, stories of discovery and questioning the evidence", [1, 3, 5], ["fringe-science"]),
    ("patterns-and-symmetry", "Patterns and symmetry", [1, 3], ["symmetry"]),
    ("order-chaos-and-chance", "Order, chaos and chance", [2, 4], ["chaos-order-unpredictability-probability", "entropy", "causality-karma", "zero-sum"]),
    ("what-is-real", "What is real? Awareness, experience and reality", [2, 4], ["reality", "consciousness-awareness-subjective-experience"]),
    ("space-time-and-dimensions", "Space, time and dimensions", [2, 4], ["space", "time", "dimensions", "twin-paradox", "time-travel", "worm-hole"]),
    ("nothing-and-forever", "Nothing and forever: zero, infinity and singularities", [3, 5], ["zero-infinity", "singularity"]),
    ("the-very-small", "The very small: particles, antimatter and the quantum world", [3, 5], ["particles", "matter", "anti-matter", "quantum-physics", "quantum-entanglement", "string-theory"]),
    ("story-of-the-universe", "The story of the universe: galaxies, the Big Bang and the expanding cosmos", [3, 5],
     ["large-scale-structure-of-the-universe-filaments-voids", "expansion-of-the-universe-hubble-s-law", "cosmic-microwave-background", "gravitational-lensing", "types-of-galaxies-spiral-elliptical-irregular"]),
    ("evolution-the-tree-of-life", "Evolution: the tree of life, from RNA to us", [2, 4], []),
]
for tid, name, ls, grid in DEEP_END:
    out.append({"id": tid, "title": name, "dk": "The Deep End", "note": "From the DeepKids notebook", "deep": True, "grid": grid,
                "start": ls[0], "rungs": [{"cls": l, "covers": [], "chapters": [], "deepkids": True} for l in ls]})
json.dump(out, open(os.path.join(HERE, 'sci_universe.json'), 'w'), ensure_ascii=False, indent=1)
n = sum(len(t['rungs']) for t in out)
print(len(out), 'topics,', n, 'rungs,', sum(len(r['covers']) for t in out for r in t['rungs']), 'board subtopics;',
      sum(1 for t in out if not t['rungs']), 'DeepKids-only topics')
