"""Check a subtopic-level unit against app/content/units/SPEC_UNIT.md.
Usage: python3 app/build/validate_unit.py app/content/units/sci/sci.forces.friction.L3.json [more files]
Prints OK, or the problems. Also prints the unit's total minutes and the number of days at the class's daily minutes."""
import json, sys, re
DAY_MINS = {1: 30, 2: 35, 3: 40, 4: 45, 5: 45}
ITEM_T = {"mcq", "fill", "match", "sort", "truefalse", "order", "write", "draw", "label", "forces", "count", "odd"}
FLOW = ("games", "projects", "experiments", "activities", "challenges")

W = []
def check(path):
    e = []; P = lambda m: e.append(m)
    try: u = json.load(open(path))
    except Exception as x: return [f"not valid JSON: {x}"], 0, 0
    m = re.match(r'(sci|math|hist|phil)\.[\w-]+\.[\w-]+\.L([1-5])$', u.get("id", ""))
    if not m: P("id must look like sci.topic.subtopic.L3")
    level = int(m.group(2)) if m else 3
    need = ["summary", "intro", "outcomes", "terms", "explanations", "agreed", "challenging", "big_questions", "story", "games", "worksheets",
            "experiments", "activities", "videos", "quiz", "applications", "spotted", "open_questions", "ask_kids", "jokes", "maths", "song",
            "challenges", "links", "buy", "warmup", "plan"]
    for k in need:
        if k not in u: P(f"missing element: {k}")
    if e: return e, 0, 0
    for k in ("summary", "intro"):
        if not u[k].get("text") or not u[k].get("art"): P(f"{k} needs text and art")
    if not 4 <= len(u["outcomes"]) <= 8: P("outcomes: 4-8")
    for t in u["terms"]:
        if not all(t.get(x) for x in ("term", "meaning", "example", "art")): P(f"term needs term, meaning, example, art: {t.get('term')}")
    for x in u["explanations"]:
        if x.get("status") not in ("defined", "idea", "debated"): P(f"explanation status must be defined/idea/debated: {x.get('concept')}")
        if x.get("status") == "debated" and len(x.get("perspectives", [])) < 2: P(f"debated explanation needs 2+ perspectives: {x.get('concept')}")
        if x.get("status") == "defined" and not x.get("definition"): P(f"defined explanation needs a definition: {x.get('concept')}")
        if not x.get("examples"): P(f"explanation needs examples: {x.get('concept')}")
    for c in u["challenging"]:
        if c.get("status") not in ("accepted", "debated", "minority", "rejected"): P(f"challenging view status: {c.get('claim', '')[:40]}")
    if len(u["big_questions"]) < 4 or not all(q.get("kind") in ("deep", "big") for q in u["big_questions"]): P("big_questions: 4+, each kind deep or big")
    s = u["story"]
    w = len(" ".join(s.get("text", [])).split())
    if not 450 <= w <= 1400: P(f"story is {w} words (450-1400)")
    for k in ("title", "epiphany", "ask", "art"):
        if not s.get(k): P(f"story needs {k}")
    ids = set()
    def steps(owner, L):
        if not L: P(f"{owner}: needs a step-by-step flow")
        for st in L:
            if not st.get("kid") or not (st.get("say") or st.get("do")): P(f"{owner} step {st.get('id')}: needs both parent (say/do) and child (kid) text")
            if "mins" not in st: P(f"{owner} step {st.get('id')}: needs mins")
            if st.get("check"):
                c = st["check"]
                if c.get("t") == "mcq" and not (isinstance(c.get("a"), int) and 0 <= c["a"] < len(c.get("options", []))): P(f"{owner} step {st.get('id')}: check answer out of range")
                if not c.get("why"): P(f"{owner} step {st.get('id')}: check needs `why`, the explanation shown after any answer")
    for k in FLOW + ("worksheets",):
        for x in u.get(k, []):
            if x.get("id") in ids: P(f"duplicate id {x.get('id')}")
            ids.add(x.get("id"))
    for g in u["games"]:
        if not g.get("printables"): P(f"game {g.get('id')}: needs printables")
        steps(f"game {g.get('id')}", g.get("flow"))
    for k in ("projects", "experiments", "activities"):
        for x in u.get(k, []):
            steps(f"{k[:-1]} {x.get('id')}", x.get("flow"))
            if x.get("days", 1) > 1 and len(x.get("schedule", [])) < 2: P(f"{x.get('id')}: a multi-day {k[:-1]} needs a schedule")
            if k == "experiments":
                for f_ in ("question", "predict", "fair_test", "results_table"):
                    if not x.get(f_): P(f"experiment {x.get('id')}: needs {f_}")
    # visuals follow the reader's need (WRITING.md "Visuals"): every hands-on flow shows how it's done
    for k in FLOW:
        for x in u.get(k, []):
            if len(x.get("setup", [])) < 2: P(f"{x.get('id')}: needs a `setup` of 2+ step pictures showing how it's done")
            for st in x.get("setup", []):
                if not st.get("caption") or not (st.get("scene") in ("ramp", "pull") or st.get("art")): P(f"{x.get('id')}: each setup step needs a caption and a scene (ramp/pull) or an art brief")
    flow_ids = {x.get("id") for k in FLOW for x in u.get(k, [])}
    def visual_rules(owner, it):
        if it.get("how") and it["how"] not in flow_ids: P(f"{owner}: how points at unknown id {it['how']}")
        ch = it.get("chart") or it.get("answer_chart")
        if ch and ch.get("type") in ("bar", "line", "table") and not it.get("how") and not it.get("show"):
            P(f"{owner}: a results chart needs `how` (the experiment it comes from) or `show` (drawn scenes) so the reader sees how the numbers were made")
    for ws in u["worksheets"]:
        for i, it in enumerate(ws.get("items", [])): visual_rules(f"worksheet {ws.get('id')} item {i + 1}", it)
    for i, it in enumerate(u["quiz"]): visual_rules(f"quiz item {i + 1}", it)
    for i, m in enumerate(u["maths"]): visual_rules(f"maths {i + 1}", m)
    for c in u["challenges"]:
        steps(f"challenge {c.get('id')}", c.get("flow"))
        if not c.get("general") or not c.get("creative") or not c.get("your_turn"): P(f"challenge {c.get('id')}: needs general, creative and your_turn")
    def items(owner, L, n):
        if len(L) < n: P(f"{owner}: {len(L)} items (needs {n}+)")
        for i, it in enumerate(L):
            if it.get("t") not in ITEM_T: P(f"{owner} item {i + 1}: unknown type {it.get('t')}")
            if "a" not in it or not it.get("why"): P(f"{owner} item {i + 1}: needs a (answer) and why (explanation)")
            if it.get("t") == "mcq" and not (isinstance(it.get("a"), int) and 0 <= it["a"] < len(it.get("opts", it.get("options", [])))): P(f"{owner} item {i + 1}: mcq answer out of range")
    for ws in u["worksheets"]: items(f"worksheet {ws.get('id')}", ws.get("items", []), 15)
    items("quiz", u["quiz"], 10)
    for q in u["quiz"]:
        if q.get("outcome") is None: P("quiz items need an outcome index"); break
    if len(u["videos"]) != 3: P("videos: exactly 3")
    for v in u["videos"]:
        if v.get("status") == "find-id": W.append(f"video id still to find: {v.get('title')}")
        elif not re.match(r'^[\w-]{11}$', v.get("youtube", "")): P(f"video needs an 11-character YouTube id: {v.get('title')}")
    core = set(u["plan"].get("core", []))
    pick = lambda x: not core or x.get("id") in core
    mins = sum(x.get("mins", 0) for k in ("games", "worksheets", "projects", "experiments", "activities", "challenges") for x in u.get(k, []) if pick(x))
    mins += sum(v.get("mins", 0) for v in u["videos"]) + u["story"].get("mins", 10) + u.get("cards_mins", 15) + len(u["quiz"])
    days = max(1, round(mins / DAY_MINS[level]))
    if len(u["jokes"]) < 3 * days: P(f"jokes: {len(u['jokes'])} for {days} days (needs {3 * days})")
    for b in u["buy"]:
        if not b.get("used_in") or any(x not in ids for x in b["used_in"]): P(f"buy item {b.get('item')}: used_in must list element ids")
    for mth in u["maths"]:
        if not mth.get("math_unit", "").startswith("math."): P("maths problems need a math_unit id")
        if not mth.get("why_maths"): P("maths problems need `why_maths`: one plain sentence on why this maths helps with this science")
    if not u["plan"].get("start_options") or not u["plan"].get("default_order"): P("plan needs start_options and default_order")
    if len(u["warmup"]) < 5: P("warmup: 5+ quick questions")
    return e, mins, days

for f in sys.argv[1:]:
    e, mins, days = check(f)
    print(f"{f}: {'OK' if not e else ''} ({mins} min, about {days} days)")
    for x in e: print("  -", x)
    for x in W: print("  (to do)", x)
    W.clear()
