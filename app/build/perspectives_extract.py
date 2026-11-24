"""List the lessons whose explanations still need a second look, in a small form a writer can read cheaply.
Usage: python3 app/build/perspectives_extract.py [--all] [first last]
Without --all: only lessons where no explanation has 2+ perspectives. first/last pick a slice of that list (0-based).
Prints JSON: [{"id", "title", "explanations": [{"concept", "status", "definition"}]}], only explanations that carry neither
2+ perspectives nor a one_view note."""
import json, glob, os, sys
APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = [a for a in sys.argv[1:] if a not in ("--all", "--redo")]
STOCK = "is a plain meaning, a rule people agreed on"
rows = []
for f in sorted(glob.glob(os.path.join(APP, "content", "units", "*", "*.json"))):
    if f.endswith(".art.json"): continue
    try: u = json.load(open(f))
    except Exception: continue
    if not isinstance(u, dict) or not u.get("id"): continue
    ex = u.get("explanations") or []
    if "--all" not in sys.argv and "--redo" not in sys.argv and any(len(x.get("perspectives", [])) >= 2 for x in ex): continue
    if "--redo" in sys.argv:   # the stock "one view" note from the first pass is not a decision: look again
        todo = [x for x in ex if len(x.get("perspectives", [])) < 2 and STOCK in str(x.get("one_view", ""))]
    else: todo = [x for x in ex if len(x.get("perspectives", [])) < 2 and len(str(x.get("one_view", "")).split()) < 6]
    if todo: rows.append({"id": u["id"], "title": u.get("title", ""), "explanations": [
        {"concept": x.get("concept", ""), "status": x.get("status", ""), "definition": (x.get("definition") or "")[:260], "description": (x.get("description") or "")[:200]} for x in todo]})
a, b = (int(args[0]), int(args[1])) if len(args) >= 2 else (0, len(rows))
print(json.dumps(rows[a:b], ensure_ascii=False, indent=0))
