"""List the lessons whose "How we found out" card has no context line yet, in a small form a writer can read cheaply.
Usage: python3 app/build/foundout_extract.py [first last]   (a slice of the list, 0-based)
Prints JSON: [{"id", "title", "who", "wrong_idea", "story_start"}]"""
import json, glob, os, sys
APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rows = []
for f in sorted(glob.glob(os.path.join(APP, "content", "units", "*", "*.json"))):
    if f.endswith(".art.json"): continue
    try: u = json.load(open(f))
    except Exception: continue
    h = u.get("how_we_found_out") if isinstance(u, dict) else None
    if not h or h.get("context"): continue
    rows.append({"id": u["id"], "title": u.get("title", ""), "who": (h.get("who") or "")[:160], "wrong_idea": (h.get("wrong_idea") or "")[:240], "story_start": (h.get("story") or "")[:260]})
a, b = (int(sys.argv[1]), int(sys.argv[2])) if len(sys.argv) >= 3 else (0, len(rows))
print(json.dumps(rows[a:b], ensure_ascii=False, indent=0))
