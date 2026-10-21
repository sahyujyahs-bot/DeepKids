"""Checks resource files against app/resources/SPEC.md. Usage: python3 validate_resources.py FILE [FILE ...] (no args: all files)"""
import json, os, sys, glob
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'resources')
CON = {c["id"]: c for c in json.load(open(os.path.join(R, 'concepts.json')))}
TYPES = {"sim", "worksheet", "experiment", "activity", "video", "game", "reading", "lesson", "tool", "citizen-science"}
ACCESS = {"free", "free-account", "freemium", "paid"}

def check(path, seen=None):
    e = []
    try: L = json.load(open(path))
    except Exception as x: return [f"not valid JSON: {x}"]
    if not isinstance(L, list): return ["file must be a JSON list"]
    for i, r in enumerate(L):
        w = f"#{i} {r.get('title', '?')[:40]}"
        for k in ("title", "url", "source", "type", "ages", "access", "lang", "desc", "concepts"):
            if k not in r: e.append(f"{w}: missing {k}")
        if not str(r.get("url", "")).startswith(("https://", "http://")): e.append(f"{w}: bad url")
        if r.get("type") not in TYPES: e.append(f"{w}: bad type {r.get('type')}")
        if r.get("access") not in ACCESS: e.append(f"{w}: bad access {r.get('access')}")
        a = r.get("ages", [])
        if not (isinstance(a, list) and len(a) == 2 and 6 <= a[0] <= a[1] <= 12): e.append(f"{w}: ages must be [min, max] within 6–12")
        c = r.get("concepts", [])
        if not 1 <= len(c) <= 3: e.append(f"{w}: needs 1–3 concepts")
        for x in c:
            if x not in CON: e.append(f"{w}: unknown concept {x}")
        if len(r.get("desc", "")) < 30: e.append(f"{w}: desc too short")
        if seen is not None:
            u = r.get("url", "").rstrip("/").lower()
            if u in seen: e.append(f"{w}: duplicate url (also in {seen[u]})")
            seen[u] = os.path.basename(path)
    return e

if __name__ == "__main__":
    files = sys.argv[1:] or sorted(f for f in glob.glob(os.path.join(R, '*.json')) if not f.endswith('concepts.json'))
    seen, bad = {}, 0
    for f in files:
        e = check(f, seen); n = len(json.load(open(f))) if not e or not e[0].startswith("not valid") else 0
        print(("OK   " if not e else "FAIL ") + f"{f} ({n} resources)")
        for x in e[:40]: print("   - " + x)
        bad += bool(e)
    sys.exit(1 if bad else 0)
