"""Write the owner's in-app text edits into the source files, so they survive any rebuild.
Usage: python3 app/build/apply_edits.py deepkids-text-edits.json
The file is the one downloaded from the app's edit dialog: [{"k": original text, "t": new text}, ...].
Every string in app/content/**/*.json whose text (spaces ignored) equals an original is replaced,
and literal occurrences in the app's source (app/src/js/*.js and app/src/index.html) are replaced too. Prints what it changed."""
import json, os, re, sys, glob
HERE = os.path.dirname(os.path.abspath(__file__)); APP = os.path.dirname(HERE)
key = lambda s: re.sub(r"\s+", " ", s).strip()
E = {key(r["k"]): r["t"] for r in json.load(open(sys.argv[1])) if r.get("t") is not None}
hits = {k: 0 for k in E}
def walk(x):
    if isinstance(x, str):
        k = key(x)
        if k in E: hits[k] += 1; return E[k]
        return x
    if isinstance(x, list): return [walk(v) for v in x]
    if isinstance(x, dict): return {a: walk(v) for a, v in x.items()}
    return x
for f in glob.glob(os.path.join(APP, "content", "**", "*.json"), recursive=True):
    d = json.load(open(f)); n = json.dumps(d, ensure_ascii=False); d2 = walk(d)
    if json.dumps(d2, ensure_ascii=False) != n:
        json.dump(d2, open(f, "w"), ensure_ascii=False, indent=1); print("updated", os.path.relpath(f, APP))
for f in sorted(glob.glob(os.path.join(APP, "src", "js", "*.js"))) + [os.path.join(APP, "src", "index.html")]:
    t = open(f).read(); t0 = t
    for k, v in E.items():
        if k in t: hits[k] += t.count(k); t = t.replace(k, v)
    if t != t0: open(f, "w").write(t); print("updated", os.path.relpath(f, APP))
for k, n in hits.items(): print(f"{n:>3}  {k[:70]}" + ("   <- not found in sources (data-made text: keep it as a live edit)" if not n else ""))
print("Now rebuild: make_data.py, waldorf, worksheets, combined, then build_app.py and web/build_web.py.")
