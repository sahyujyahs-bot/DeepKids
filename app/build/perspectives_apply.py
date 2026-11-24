"""Put a writer's decisions into the lessons.
Usage: python3 app/build/perspectives_apply.py decisions.json
decisions.json: {"<lesson id>": {"<concept>": {"perspectives": [{"who": "...", "explanation": "..."}, ...]} or {"one_view": "one sentence why"}}}
Every decision is checked: a perspective needs a real `who` and an explanation of 6+ words (a view with only one entry
is allowed but a second is expected); a `one_view` note needs 6+ words. Prints what changed. Nothing else in a lesson is touched."""
import json, glob, os, sys
APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(sys.argv[1]))
paths = {os.path.basename(f)[:-5]: f for f in glob.glob(os.path.join(APP, "content", "units", "*", "*.json")) if not f.endswith(".art.json")}
changed = pv = ov = 0
for uid, per in D.items():
    if uid not in paths: print("no such lesson:", uid); continue
    u = json.load(open(paths[uid])); n = 0
    for x in u.get("explanations", []):
        d = per.get(x.get("concept"))
        if not d: continue
        if d.get("perspectives"):
            ps = [p for p in d["perspectives"] if str(p.get("who", "")).strip() and len(str(p.get("explanation", "")).split()) >= 6]
            if len(ps) != len(d["perspectives"]): print("skipped a thin perspective in", uid, "/", x.get("concept"))
            if len(ps) >= 2: x["perspectives"] = ps; x.pop("one_view", None); n += 1; pv += 1
            else: print("fewer than 2 good perspectives, left alone:", uid, "/", x.get("concept"))
        elif len(str(d.get("one_view", "")).split()) >= 6: x["one_view"] = d["one_view"].strip(); n += 1; ov += 1
        else: print("thin one_view, left alone:", uid, "/", x.get("concept"))
    if n: json.dump(u, open(paths[uid], "w"), ensure_ascii=False, indent=1); changed += 1
print(f"lessons changed {changed}, with perspectives {pv}, with one_view {ov}")
