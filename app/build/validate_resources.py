"""Checks resource files against app/resources/SPEC.md. Usage: python3 validate_resources.py FILE [FILE ...] (no args: all files)"""
import json, os, sys, glob
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'resources')
CON = {c["id"]: c for c in json.load(open(os.path.join(R, 'concepts.json')))}
TYPES = {"sim", "worksheet", "experiment", "activity", "video", "game", "reading", "lesson", "tool", "citizen-science"}
ACCESS = {"free", "free-account", "freemium", "paid"}
SUBJ = {"sci", "math", "eng", "hin", "think", "code", "all"}
STRANDS = {"math": {"number", "operations", "fractions", "measurement", "time-money", "shapes", "patterns", "data", "reasoning", "all-maths"},
           "eng": {"phonics", "reading", "stories", "vocabulary", "grammar", "writing", "speaking", "all-english"},
           "hin": {"varnamala", "reading", "stories", "poems", "writing", "all-hindi"},
           "think": {"thinking", "philosophy"}, "code": {"coding", "unplugged"},
           "sci": {"all-science"}, "all": {"textbooks", "all-subjects"}}

def check(path, seen=None):
    e = []
    try: L = json.load(open(path))
    except Exception as x: return [f"not valid JSON: {x}"]
    if not isinstance(L, list): return ["file must be a JSON list"]
    for i, r in enumerate(L):
        w = f"#{i} {r.get('title', '?')[:40]}"
        sj = r.get("subj", "sci"); sj = sj if isinstance(sj, list) else [sj]
        for x in sj:
            if x not in SUBJ: e.append(f"{w}: bad subj {x}")
        for k in ("title", "url", "source", "type", "ages", "access", "lang", "desc") + (("concepts",) if sj == ["sci"] and not r.get("strands") else ()):
            if k not in r: e.append(f"{w}: missing {k}")
        if not str(r.get("url", "")).startswith(("https://", "http://")): e.append(f"{w}: bad url")
        if r.get("type") not in TYPES: e.append(f"{w}: bad type {r.get('type')}")
        if r.get("access") not in ACCESS: e.append(f"{w}: bad access {r.get('access')}")
        a = r.get("ages", [])
        if not (isinstance(a, list) and len(a) == 2 and 6 <= a[0] <= a[1] <= 12): e.append(f"{w}: ages must be [min, max] within 6–12")
        c = r.get("concepts", [])
        st = r.get("strands", [])
        if "sci" in sj and not st and not 1 <= len(c) <= 3: e.append(f"{w}: needs 1–3 concepts")
        if len(c) > 3: e.append(f"{w}: at most 3 concepts")
        ok = set().union(*(STRANDS[x] for x in sj if x in STRANDS))
        for x in st:
            if x not in ok: e.append(f"{w}: strand {x} doesn't fit subjects {sj}")
        if sj != ["sci"] and not st: e.append(f"{w}: non-science resources need strands")
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
