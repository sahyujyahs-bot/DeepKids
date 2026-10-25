"""Number every topic and subtopic in the founder's 'DeepKids HomeSchooling Track' sheet tabs
(Maths, Biology, Physics, Chemistry, History, Philosophy, History of Our Sub Continent), so the curriculum
maps can point at them by id (e.g. "bio:45") and build.py can prove every one is taught somewhere.
Run: python3 app/build/curriculum/notebook_items.py <folder with 'DeepKids HomeSchooling Track.xlsx'>
Writes app/content/curriculum/notebook_items.json
"""
import json, os, sys, openpyxl
HERE = os.path.dirname(os.path.abspath(__file__)); APP = os.path.dirname(os.path.dirname(HERE))
wb = openpyxl.load_workbook(os.path.join(sys.argv[1], 'DeepKids HomeSchooling Track.xlsx'), read_only=True, data_only=True)
rows = lambda name: [[("" if c is None else str(c).strip()) for c in r] for r in wb[name].iter_rows(values_only=True)]
TABS = {"math": "Maths", "bio": "Biology", "phy": "Physics", "chem": "Chemistry", "hist": "History", "phil": "Philosophy", "sub": "History of Our Sub Continent & "}
SKIP = {"Concept(s)", "Topics", "Master Categories", "ages 6 - 12", "all ages", "Concept Unit", "Notes on Safety & Inclusion"}
out = {}
for code, tab in TABS.items():
    items, n = [], 0
    R = rows(tab)
    if code == "sub":   # the timeline table: one item per civilisation/empire (rows after it are the board-game design)
        for r in R[2:]:
            name = r[2] if len(r) > 2 else ""
            if r[0] and name and not name.startswith("Not Marketed") and len(name) < 90:
                n += 1; items.append(dict(id=f"sub:{n}", text=f"{name} ({r[0]} – {r[1]})", detail=" | ".join(x for x in r[3:8] if x)[:600]))
            elif r[0] and name.startswith("Not Marketed"):
                n += 1; items.append(dict(id=f"sub:{n}", text=f"Regional cultures of {r[3]} ({r[0]} – {r[1]})", detail=" | ".join(x for x in r[4:8] if x)[:600]))
            elif r[0] and len(r) > 1 and r[1] and not r[1][0].isdigit():
                n += 1; items.append(dict(id=f"sub:{n}", text=f"{r[1]} ({r[0]})", detail=" | ".join(x for x in r[2:6] if x)[:600]))
            if r[0] == "1858 CE": break
    else:
        for r in R:
            t = (r[0] if r else "") or (next((x for x in r if x), "") if code == "phil" else "")
            if not t or t in SKIP: continue
            n += 1; items.append(dict(id=f"{code}:{n}", text=t.split("\n")[0][:200], detail=(r[1] if code == "math" and len(r) > 1 else "")[:300]))
    out[code] = items
os.makedirs(os.path.join(APP, 'content', 'curriculum'), exist_ok=True)
json.dump(out, open(os.path.join(APP, 'content', 'curriculum', 'notebook_items.json'), 'w'), ensure_ascii=False, indent=1)
print({k: len(v) for k, v in out.items()})
