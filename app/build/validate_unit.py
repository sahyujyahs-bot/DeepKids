"""Check a subtopic-level unit against app/content/units/SPEC_UNIT.md.
Usage: python3 app/build/validate_unit.py app/content/units/sci/sci.forces.friction.L3.json [more files]
Prints OK, or the problems. Also prints the unit's total minutes and the number of days at the class's daily minutes."""
import json, sys, re, os, glob
DAY_MINS = {1: 30, 2: 35, 3: 40, 4: 45, 5: 45}
ITEM_T = {"mcq", "fill", "match", "sort", "truefalse", "order", "write", "draw", "label", "forces", "count", "odd", "perspective"}
FLOW = ("games", "projects", "experiments", "activities", "challenges")

W = []
# lines that read as filler: say what actually happens instead (WRITING.md rule 18)
STOCK = ("let's finish like real scientists", "let’s finish like real scientists")
# slogans that fit any unit, so they say nothing about this one (PHILOSOPHY.md)
# PHILOSOPHY.md "Everything is conscious": never deny a mind to anything
DENY = re.compile(r"\b(can'?t|cannot|can not|does ?n[o’']t|do ?n[o’']t|never|is not able to) (really )?(think|feel|remember|decide|choose)\b|\bno (feelings|mind|thoughts)\b|\bnot really alive\b|\bjust a machine\b|\bnothing is (wanted|remembered)\b", re.I)
GENERIC = ("no line between", "everything is connected", "we are all one", "all is one", "you are the world", "doorway, not a wall")
SMALL = set("a an the and or but of to in on at is are was be it its this that these those as with for from by not no we you your they their our one".split())
words = lambda t: {w for w in re.findall(r"[a-z]+", t.lower()) if w not in SMALL and len(w) > 2}
def truths(path):
    """the deep truths of the other units in the same folder"""
    out = []
    for f in glob.glob(os.path.join(os.path.dirname(path) or ".", "*.json")):
        if os.path.abspath(f) == os.path.abspath(path): continue
        try: out.append((os.path.basename(f), json.load(open(f))["roots"]["deep_truth"]["truth"]))
        except Exception: pass
    return out
# WRITING.md rules 2 and 10: short sentences (child 12 words, parent 20), plain punctuation
def plain(u, P):
    long_ = []
    def walk(x, key=""):
        if isinstance(x, dict):
            for k, v in x.items(): walk(v, k)
        elif isinstance(x, list):
            for v in x: walk(v, key)
        elif isinstance(x, str) and key in ("kid", "say", "do"):
            lim = 12 if key == "kid" else 20
            for sen in re.split(r"(?<=[.!?])\s+", x):
                n = len(re.findall(r"[\w'’-]+", re.sub(r"\([^)]*\)", "", sen)))
                if n > lim + 2: long_.append(f"{key}: {n} words: {sen[:60]}…")
            if ";" in x: P(f"no semicolons (WRITING.md rule 10): {x[:60]}…")
            if re.search(r"\be\.g\.|\betc\.|\bi\.e\.", x): P(f"write 'for example', not e.g./etc./i.e. (rule 10): {x[:60]}…")
    for k in ("games", "experiments", "activities", "projects", "challenges"):
        walk(u.get(k, []))
    walk(u.get("roots", {}).get("practice", {}))
    if long_: P(f"{len(long_)} sentences too long for who reads them (child 12 words, parent 20; WRITING.md rule 2), for example " + " | ".join(long_[:3]))
def check(path):
    e = []; P = lambda m: e.append(m)
    try: u = json.load(open(path))
    except Exception as x: return [f"not valid JSON: {x}"], 0, 0
    m = re.match(r'(sci|math|hist|phil)\.[\w-]+\.[\w-]+\.L([1-5])$', u.get("id", ""))
    if not m: P("id must look like sci.topic.subtopic.L3")
    level = int(m.group(2)) if m else 3
    need = ["summary", "intro", "outcomes", "terms", "explanations", "agreed", "challenging", "big_questions", "story", "games", "worksheets",
            "experiments", "activities", "videos", "quiz", "applications", "spotted", "open_questions", "ask_kids", "jokes", "maths", "song",
            "challenges", "links", "buy", "warmup", "plan", "roots", "how_we_found_out"]
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
    sp = u["plan"].get("spine") or []
    if not sp: P("plan.spine: list the core-path part ids (about 2 sessions; SPEC_UNIT.md 'The spine')")
    else:
        fl = {x["id"]: x for k in FLOW + ("worksheets",) for x in u.get(k, [])}
        need_sp = {"explanations", "roots", "quiz"}
        if not need_sp <= set(sp): P("plan.spine must include explanations, roots and quiz")
        if not any(i in fl and fl[i] in u.get("experiments", []) and fl[i].get("mins", 0) >= 20 for i in sp): P("plan.spine needs one real investigation: an experiment of 20+ minutes (a demonstration or act-out does not count)")
        bad = [i for i in sp if i not in fl and i not in u]
        if bad: P(f"plan.spine has unknown ids: {bad}")
    h = u["how_we_found_out"]
    if not all(h.get(k) for k in ("story", "who", "when", "wrong_idea")): P("how_we_found_out needs story, who, when, wrong_idea")
    elif not 80 <= len(h["story"].split()) <= 220: P(f"how_we_found_out story is {len(h['story'].split())} words (80-200)")
    # WRITING.md rules 17-18: no stock openers or lines
    if re.match(r"\s*this unit is about", u["summary"].get("text", ""), re.I): P("summary must not open 'This unit is about': lead with the puzzle (WRITING.md rule 18)")
    for line in STOCK:
        if line in json.dumps(u, ensure_ascii=False).lower(): P(f"stock line '{line}': say what actually happens (WRITING.md rule 18)")
    # WRITING.md rule 25: our stance is said like science, never as a belief
    for m in re.findall(r"[^.\"]*\b(?:DeepKids (?:believes|thinks|holds|sees|view)|we believe|in our view|our stance)\b[^.\"]*", json.dumps(u, ensure_ascii=False), re.I)[:5]:
        P(f"say our stance as plain fact, not as a belief (WRITING.md rule 25): '{m.strip()[:90]}'")
    r = u["roots"]   # app/content/PHILOSOPHY.md
    for k in ("context", "deep_truth", "three", "thread", "teachings", "science", "other_view", "practice", "ask", "art"):
        if not r.get(k): P(f"roots needs {k} (see PHILOSOPHY.md)")
    if r.get("deep_truth") and not all(r["deep_truth"].get(k) for k in ("truth", "habit", "evidence")): P("roots.deep_truth needs truth, habit, evidence")
    elif r.get("deep_truth"):  # PHILOSOPHY.md "A deep truth is an interpretation, not a slogan"
        t = r["deep_truth"]["truth"]
        for g in GENERIC:
            if g in t.lower(): P(f"roots.deep_truth is generic ('{g}'): say what this unit's science shows (PHILOSOPHY.md)")
        mine = words(t)
        for other, ot in truths(path):
            if len(mine & words(ot)) >= max(4, 0.5 * min(len(mine), len(words(ot)))):
                P(f"roots.deep_truth repeats {other}: '{ot[:70]}'")
    if r.get("three") and not all(r["three"].get(k) for k in ("who_am_i", "what_is_life", "what_is_this_world")): P("roots.three needs who_am_i, what_is_life, what_is_this_world")
    if not 2 <= len(r.get("teachings", [])) <= 3 or not all(t.get("source") and t.get("teaching") and t.get("link") for t in r.get("teachings", [])): P("roots.teachings: 2-3, each with source, teaching, link")
    if not all(x.get("status") in ("settled", "idea", "debated", "open") for x in r.get("science", [])): P("roots.science status must be settled/idea/debated/open")
    if r.get("practice") and not all(r["practice"].get(k) for k in ("title", "mins", "say", "kid")): P("roots.practice needs title, mins, say, kid")
    if not 2 <= len(r.get("ask", [])) <= 4: P("roots.ask: 2-4 open questions")
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
        for pr in g.get("printables") or []:
            if any(not isinstance(x, str) and not (isinstance(x, dict) and x.get("f") and x.get("b")) for x in pr.get("items", [])):
                P(f"game {g.get('id')}: a printable item is text, or a two-sided card {{f, b}} with both sides")
        steps(f"game {g.get('id')}", g.get("flow"))
    for k in ("projects", "experiments", "activities"):
        for x in u.get(k, []):
            steps(f"{k[:-1]} {x.get('id')}", x.get("flow"))
            if x.get("days", 1) > 1 and len(x.get("schedule", [])) < 2: P(f"{x.get('id')}: a multi-day {k[:-1]} needs a schedule")
            if k == "experiments":
                for f_ in ("question", "predict", "fair_test", "results_table"):
                    if not x.get(f_): P(f"experiment {x.get('id')}: needs {f_}")
                if x.get("predict") and not re.search(r"\bwhy\b|because|reason", json.dumps(x["predict"]), re.I):
                    P(f"experiment {x.get('id')}: predict must ask for the reason too ('…and why do you think so?')")
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
    # REWRITE_UNIT.md "Worksheets that make children think": every question asked once, a mix of forms on each sheet,
    # thinking questions on every sheet, and at least one pick-a-side question
    norm = lambda t: re.sub(r"[^a-z0-9 ]", "", (t or "").lower()).strip()
    seen = {}
    for src, L in [(f"worksheet {ws.get('id')}", ws.get("items", [])) for ws in u["worksheets"]] + [("quiz", u["quiz"])]:
        for it in L:
            k = norm(it.get("p"))
            if k and k in seen and seen[k] != src: P(f"{src}: repeats a question from {seen[k]}: '{it.get('p', '')[:70]}'")
            seen.setdefault(k, src)
    THINK = {"write", "perspective", "draw", "label"}
    for ws in u["worksheets"]:
        L = ws.get("items", [])
        if not L: continue
        top, cnt = max(((t, sum(i.get("t") == t for i in L)) for t in {i.get("t") for i in L}), key=lambda x: x[1])
        if cnt > 0.4 * len(L): P(f"worksheet {ws.get('id')}: {cnt} of {len(L)} questions are '{top}'; mix the forms (at most 40% of one kind)")
        if sum(i.get("t") in THINK for i in L) < 3: P(f"worksheet {ws.get('id')}: needs 3+ thinking questions (write, perspective, draw or label)")
    if not any(i.get("t") == "perspective" for ws in u["worksheets"] for i in ws.get("items", [])): P("worksheets: need at least one 'perspective' (pick a side) question")
    for ws in u["worksheets"]:
        for i, it in enumerate(ws.get("items", [])):
            if it.get("t") == "perspective" and not (2 <= len(it.get("views", [])) <= 3 and it.get("ask")): P(f"worksheet {ws.get('id')} item {i + 1}: perspective needs 2-3 views and an ask")
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
    plain(u, P)
    deny = sorted({m.group(0).lower() for m in DENY.finditer(json.dumps(u, ensure_ascii=False))})
    # a person must read these: "scales can't feel tiny forces" is fine, "a plant can't think" is not
    if deny: W.append(f"check these don't deny a mind to anything ({', '.join(deny)}): PHILOSOPHY.md 'Everything is conscious'")
    # WRITING.md rule 26: a living being is she, he or they, never "it"
    LIVE = r"(?:plant|seed|seedling|tree|bean|sprout|animal|bird|crow|sparrow|pigeon|parrot|hen|chick|insect|ant|bee|butterfly|caterpillar|spider|worm|earthworm|snail|frog|tadpole|fish|cow|dog|cat|goat|elephant|lion|tiger|monkey|bat|lizard|gecko|snake|turtle|whale|dolphin|bacteri(?:um|a)|germ|microbe|virus|fungus|mushroom|mould|yeast|baby|kitten|puppy|calf)"
    its = sorted({m.group(0)[:70] for m in re.finditer(r"\b" + LIVE + r"\b[^.!?\"]{0,40}?\b(?:it|its|itself)\b", json.dumps(u, ensure_ascii=False), re.I)})
    if its: W.append(f"a living being may be called 'it' in {len(its)} places; use she, he or they (WRITING.md rule 26): " + " | ".join(its[:4]))
    dt = (u.get("roots") or {}).get("deep_truth", {}).get("truth", "")
    sens = [x for x in re.split(r"(?<=[.!?])\s+", dt) if x]
    if len(sens) > 4 or any(len(x.split()) > 20 for x in sens): P("roots.deep_truth: 3-4 short sentences, each under 20 words (PHILOSOPHY.md, 'Simple and direct')")
    if len(u["warmup"]) < 5: P("warmup: 5+ quick questions")
    return e, mins, days

for f in sys.argv[1:]:
    e, mins, days = check(f)
    print(f"{f}: {'OK' if not e else ''} ({mins} min, about {days} days)")
    for x in e: print("  -", x)
    for x in W: print("  (to do)", x)
    W.clear()
