"""Checks the warm-up games a helper wrote (one JSON per unit, in the folder given) and adds each valid set to its unit as "warm".
   python3 app/build/merge_warm.py <folder>     -> prints, per unit, OK or what is wrong; only valid sets are merged."""
import json, glob, os, re, sys
W = lambda s: len(re.findall(r"\S+", str(s)))
def check(w, text):
    e = []
    if not (isinstance(w, dict) and set(w) == {"words", "quiz", "odd"}): return ["needs exactly words, quiz, odd"]
    ws = w["words"]
    if not (isinstance(ws, list) and len(ws) == 5 and len(set(ws)) == 5 and all(re.fullmatch(r"[A-Z]{5}", x or "") for x in ws)): e.append("words: 5 different 5-letter capitals")
    elif sum(x.lower() not in text for x in ws) >= 3: e.append("words: 3 or more are not in the unit's own words: " + ", ".join(ws))
    q = w["quiz"]
    if not (isinstance(q, list) and len(q) == 10 and all(isinstance(i, list) and len(i) == 3 and isinstance(i[0], str) and isinstance(i[1], bool) and isinstance(i[2], str) for i in q)): e.append("quiz: 10 items [statement, true/false, why]")
    else:
        t = sum(i[1] for i in q)
        if t < 4 or t > 6: e.append(f"quiz: {t} true of 10 (want 4 to 6)")
        for i in q:
            if W(i[0]) > 22 or W(i[2]) > 28: e.append("quiz: too long: " + i[0][:50]); break
        if len({i[0] for i in q}) < 10: e.append("quiz: repeated statement")
        if any(re.search(r"\b(in the story|in the experiment|worksheet|lesson|the unit|the app)\b", i[0] + " " + i[2], re.I) for i in q): e.append("quiz: refers to the lesson, story or app")
    o = w["odd"]
    if not (isinstance(o, list) and len(o) == 5 and all(isinstance(i, list) and len(i) == 3 and isinstance(i[0], list) and len(i[0]) == 4 and len(set(i[0])) == 4 and i[1] in i[0] and isinstance(i[2], str) for i in o)): e.append("odd: 5 items [[4 different things], the odd one (one of the 4), why]")
    else:
        if any(W(x) > 7 for i in o for x in i[0]) or any(W(i[2]) > 28 for i in o): e.append("odd: items or why too long")
    return e
def merge(uid, w):
    p = glob.glob(f"app/content/units/*/{uid}.json")[0]
    s = open(p).read().rstrip()
    if '\n "warm":' in s or '"warm":' in s: return "already has warm (left alone)"
    assert s.endswith("}")
    open(p, "w").write(s[:-1].rstrip() + ',\n "warm": ' + json.dumps(w, ensure_ascii=False) + "\n}\n")
    return "merged"
if __name__ == "__main__":
    ok = bad = 0
    sets = {}
    for f in sorted(glob.glob(sys.argv[1] + "/*.json")):
        try: d = json.load(open(f))
        except Exception: print("BAD", os.path.basename(f), "not JSON"); bad += 1; continue
        if set(d) == {"words", "quiz", "odd"}: sets[os.path.basename(f)[:-5]] = d
        else: sets.update(d)
    for uid, w in sorted(sets.items()):
        p = glob.glob(f"app/content/units/*/{uid}.json")
        if not p: print("BAD", uid, "no such unit"); bad += 1; continue
        e = check(w, open(p[0]).read().lower())
        if e: print("BAD", uid, "|", "; ".join(e)); bad += 1
        else: print("OK ", uid, merge(uid, w)); ok += 1
    print(ok, "merged,", bad, "to redo")
