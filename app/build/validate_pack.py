"""Checks DeepKids chapter packs against app/content/SPEC.md. Usage: python3 validate_pack.py FILE [FILE ...]"""
import json, sys

MINS = {1: 30, 2: 35, 3: 40, 4: 45, 5: 45}
KINDS = {"warmup", "read", "talk", "do", "exp", "act", "ws", "game", "think", "watch", "outdoor", "review", "check"}
ITEM = {"draw": ["p"], "write": ["p", "lines"], "fill": ["p", "a"], "mcq": ["p", "opts", "a"], "match": ["p", "pairs"],
        "sort": ["p", "items", "cats"], "table": ["p", "cols", "rows"]}
VAGUE = ("read the chapter", "continue the chapter", "do the activities", "carry on", "finish the chapter")
DAYS = {"ncert": (7, 12), "cambridge": (7, 16), "nios": (4, 10), "combined": (4, 10)}
BOOKFOR = {"read alone", "read together", "parent reads"}

def check(path):
    e = []
    try: p = json.load(open(path))
    except Exception as x: return [f"not valid JSON: {x}"]
    need = ["key", "board", "subj", "level", "n", "title", "source", "summary", "goals", "words", "day_mins", "days", "worksheets", "experiments", "activities", "voices", "check"]
    for k in need:
        if k not in p: e.append(f"missing {k}")
    if e: return e
    if p["key"] != f'{p["board"]}|{p["subj"]}|{p["level"]}|{p["n"]}': e.append("key does not match board|subj|level|n")
    if p["day_mins"] != MINS.get(p["level"]): e.append(f'day_mins should be {MINS.get(p["level"])}')
    lo, hi = DAYS.get(p["board"], (4, 16))
    if not lo <= len(p["days"]) <= hi: e.append(f'{len(p["days"])} days; expected {lo}–{hi}')
    ids = {x["id"] for g in ("worksheets", "experiments", "activities", "voices") for x in p[g] if "id" in x}
    if p["board"] == "combined":
        e += combined(p); ids.add(p.get("game", {}).get("id"))
    used = set()
    for i, d in enumerate(p["days"], 1):
        if d.get("n") != i: e.append(f"day {i}: n should be {i}")
        for k in ("title", "goal", "steps", "need"):
            if k not in d: e.append(f"day {i}: missing {k}")
        s = d.get("steps", [])
        tot = sum(x.get("mins", 0) for x in s)
        if abs(tot - p["day_mins"]) > 5: e.append(f"day {i}: steps add to {tot} min, day is {p['day_mins']}")
        for j, x in enumerate(s, 1):
            if x.get("kind") not in KINDS: e.append(f"day {i} step {j}: bad kind {x.get('kind')}")
            if not x.get("title") or not x.get("do"): e.append(f"day {i} step {j}: needs title and do")
            if len(x.get("do", "")) < 60: e.append(f"day {i} step {j}: 'do' is too short to be exact")
            if any(v in x.get("do", "").lower() for v in VAGUE) and len(x.get("do", "")) < 160: e.append(f"day {i} step {j}: vague step")
            if x.get("ref"):
                if x["ref"] not in ids: e.append(f"day {i} step {j}: ref {x['ref']} not found")
                used.add(x["ref"])
        for q in d.get("prep", []):
            if not q.get("task") or not q.get("when"): e.append(f"day {i}: prep needs task and when")
    tiers = [w.get("tier") for w in p["worksheets"]]
    for t in ("core", "stretch", "challenge"):
        if t not in tiers: e.append(f"no {t} worksheet")
    for w in p["worksheets"]:
        for si, sec in enumerate(w.get("sections", [])):
            if not (isinstance(sec, list) and len(sec) == 2 and isinstance(sec[1], list)): e.append(f'{w.get("id")}: section {si} must be [title, items]'); continue
            for it in sec[1]:
                t = it.get("t")
                if t not in ITEM: e.append(f'{w.get("id")}: bad item type {t}'); continue
                for f in ITEM[t]:
                    if f not in it: e.append(f'{w.get("id")}: {t} item missing {f}')
                if t == "mcq" and isinstance(it.get("a"), int) and not 0 <= it["a"] < len(it.get("opts", [])): e.append(f'{w.get("id")}: mcq answer index out of range')
    for v in p["voices"]:
        for f in ("id", "who", "idea", "then", "now", "status", "ask"):
            if f not in v: e.append(f'voice missing {f}')
        if v.get("status") not in ("accepted", "debated", "minority", "rejected"): e.append(f'voice {v.get("id")}: bad status')
    for g in ("experiments", "activities", "voices", "worksheets"):
        for x in p[g]:
            if x.get("id") and x["id"] not in used: e.append(f'{g[:-1]} {x["id"]} is never used in a day step (ref)')
    if p["subj"] == "sci" and not 2 <= len(p["voices"]) <= 4: e.append("science packs need 2–4 voices")
    if len(p["check"]) < 5: e.append("check needs at least 5 questions")
    return e

def combined(p):
    """Extra parts of a Combined topic rung (see SPEC.md, Combined topics)."""
    e = []
    for k in ("builds_on", "project", "game", "big", "challenge", "perspectives", "books"):
        if not p.get(k): e.append(f"combined: missing {k}")
    if e: return e
    if "textbook" not in p["source"].lower(): e.append("combined: source should say no textbook is needed")
    g = p["game"]
    for f in ("id", "title", "kind", "players", "rules"):
        if f not in g: e.append(f"game missing {f}")
    if g.get("kind") == "board" and not 12 <= len(g.get("squares", [])) <= 30: e.append("board game needs 12–30 squares")
    if g.get("kind") == "cards" and not 12 <= len(g.get("cards", [])) <= 48: e.append("card game needs 12–48 cards")
    if g.get("kind") not in ("board", "cards"): e.append("game kind must be board or cards")
    if not 3 <= len(p["big"]) <= 6: e.append("big: 3–6 questions")
    if not 2 <= len(p["challenge"]) <= 4: e.append("challenge: 2–4 items")
    for c in p["challenge"]:
        if not c.get("q") or not c.get("hint"): e.append("challenge items need q and hint")
    for x in p["perspectives"]:
        if not x.get("who") or not x.get("view"): e.append("perspectives need who and view")
    if not 2 <= len(p["books"]) <= 6: e.append("books: 2–6")
    for b in p["books"]:
        for f in ("title", "author", "for", "age", "why"):
            if not b.get(f): e.append(f'book {b.get("title")}: missing {f}')
        if b.get("for") not in BOOKFOR: e.append(f'book {b.get("title")}: for must be one of {sorted(BOOKFOR)}')
    pr = p["project"]
    for f in ("title", "steps", "outcome"):
        if not pr.get(f): e.append(f"project missing {f}")
    return e

if __name__ == "__main__":
    bad = 0
    for f in sys.argv[1:]:
        e = check(f)
        print(("OK   " if not e else "FAIL ") + f)
        for x in e: print("   - " + x)
        bad += bool(e)
    sys.exit(1 if bad else 0)
