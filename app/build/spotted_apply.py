"""Put a writer's rewritten "Spot it around you" lines into the lessons.
Usage: python3 app/build/spotted_apply.py decisions.json   ({"<lesson id>": {"<line number>": "new text", ...}, ...})
A line must be 3 to 45 words and must not name a place (the same list the extract script uses)."""
import json, glob, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "spotted_extract.py")).read()
PL = eval(re.search(r"^PL = (re\.compile\(.*\))$", src, re.M).group(1), {"re": re})
D = json.load(open(sys.argv[1]))
paths = {os.path.basename(f)[:-5]: f for f in glob.glob(os.path.join(APP, "content", "units", "*", "*.json")) if not f.endswith(".art.json")}
ok = bad = 0
for uid, lines in D.items():
    if uid not in paths: print("no such lesson:", uid); continue
    u = json.load(open(paths[uid])); n = 0
    for i, t in lines.items():
        t = str(t).strip(); i = int(i)
        if i >= len(u.get("spotted", [])) or not (3 <= len(t.split()) <= 45) or PL.search(t) or re.search(r"\b(unit|topic)\b", t, re.I): print("skipped:", uid, i); bad += 1; continue
        u["spotted"][i]["text"] = t; n += 1; ok += 1
    if n: json.dump(u, open(paths[uid], "w"), ensure_ascii=False, indent=1)
print(f"lines changed {ok}, skipped {bad}")
