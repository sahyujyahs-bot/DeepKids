"""Put a writer's context lines into the lessons.
Usage: python3 app/build/foundout_apply.py decisions.json    ({"<lesson id>": "the context line", ...})
A line must be 10 to 60 words and must not say "unit" or "topic". Only how_we_found_out.context is set."""
import json, glob, os, sys, re
APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(sys.argv[1]))
paths = {os.path.basename(f)[:-5]: f for f in glob.glob(os.path.join(APP, "content", "units", "*", "*.json")) if not f.endswith(".art.json")}
ok = bad = 0
for uid, line in D.items():
    line = str(line).strip(); n = len(line.split())
    if uid not in paths or not (10 <= n <= 60) or re.search(r"\b(unit|topic)\b", line, re.I):
        print("skipped:", uid, f"({n} words)"); bad += 1; continue
    u = json.load(open(paths[uid]))
    if not u.get("how_we_found_out"): print("no card:", uid); bad += 1; continue
    u["how_we_found_out"]["context"] = line
    json.dump(u, open(paths[uid], "w"), ensure_ascii=False, indent=1); ok += 1
print(f"lines added {ok}, skipped {bad}")
