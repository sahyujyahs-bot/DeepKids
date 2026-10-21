"""Writes app/resources/concepts.json: the science concepts resources are tagged with, and the chapters each one reaches.
Concepts and their board topics come from concept_map.py. Run from repo root: python3 app/build/resource_concepts.py"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import concept_map as cm

def app_key(b):  # N3-4 -> ncert|sci|3|4 ; C2-1.3 -> cam|sci|2|1 ; O3-5 -> nios|sci|3|5
    m = re.match(r'([NCO])(\d)-(\d+)', b); board = {'N': 'ncert', 'C': 'cam', 'O': 'nios'}[m[1]]
    return f'{board}|sci|{m[2]}|{m[3]}'

slug = lambda s: re.sub(r'[^a-z0-9]+', '-', s.lower().split(':')[0]).strip('-')
out = []
for concept, dk, bs, _ in cm.M:
    keys = sorted({app_key(b) for b in bs})
    out.append({"id": slug(concept), "concept": concept, "plus": dk, "levels": sorted({cm.BI[b][0] for b in bs}),
                "chapters": keys, "topics": [f'L{cm.BI[b][0]} {cm.BI[b][1]}' for b in bs]})
assert len({c["id"] for c in out}) == len(out)
json.dump(out, open(os.path.join(cm.APP, 'resources', 'concepts.json'), 'w'), ensure_ascii=False, indent=1)
print(len(out), "concepts")
