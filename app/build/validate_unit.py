"""Check a subtopic-level unit against app/content/units/SPEC_UNIT.md.
Usage: python3 app/build/validate_unit.py app/content/units/sci/sci.forces.friction.L3.json [more files]
(maths units work the same: app/content/units/math/math.number-sense.counting.L1.json)
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
_TRUTHS = {}
def truths(path):
    """the deep truths of the other units in the same folder (read once per folder)"""
    folder = os.path.abspath(os.path.dirname(path) or ".")
    if folder not in _TRUTHS:
        _TRUTHS[folder] = []
        for f in glob.glob(os.path.join(folder, "*.json")):
            try: _TRUTHS[folder].append((f, os.path.basename(f), json.load(open(f))["roots"]["deep_truth"]["truth"]))
            except Exception: pass
    return [(name, t) for f, name, t in _TRUTHS[folder] if f != os.path.abspath(path)]
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
            for sen in re.split(r"(?<=[.!?:])\s+", x):
                n = len(re.findall(r"[\w'’-]+", re.sub(r"\([^)]*\)", "", sen)))
                if n > lim + 2: long_.append(f"{key}: {n} words: {sen[:60]}…")
            if ";" in x: P(f"no semicolons (WRITING.md rule 10): {x[:60]}…")
            if re.search(r"\be\.g\.|\betc\.|\bi\.e\.", x): P(f"write 'for example', not e.g./etc./i.e. (rule 10): {x[:60]}…")
    for k in ("games", "experiments", "activities", "projects", "challenges"):
        walk(u.get(k, []))
    walk(u.get("roots", {}).get("practice", {}))
    if long_: P(f"{len(long_)} sentences too long for who reads them (child 12 words, parent 20; WRITING.md rule 2), for example " + " | ".join(long_[:3]))
NUMW = {"two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "eight": 8, "ten": 10, "twelve": 12}
LEAK = re.compile(r"title checked automatically|video id|recalled, not opened|still being written|used in [gaepc]\d|can replace the first|deepkids list|the founder|founder's|app/content|\.json\b", re.I)
STOCKL = re.compile(r"the story also quietly asks|one source,? showing up in many forms", re.I)
def playtest(u):
    """The rules in PLAYTEST.md that a script can see. Each is a to-do for the checker, not a hard stop."""
    out = []
    for g in u.get("games", []):
        for pr in g.get("printables", []):
            m = re.match(r"\s*(\d+|" + "|".join(NUMW) + r")\b", pr.get("title", ""), re.I)
            n = m and (int(m.group(1)) if m.group(1).isdigit() else NUMW[m.group(1).lower()])
            items = pr.get("items", [])
            if n and pr.get("kind") in ("cards", "tokens", "board") and len(items) < n:
                out.append(f"game {g['id']}: '{pr['title'][:50]}' promises {n} but has {len(items)} items: write every one out (PLAYTEST 1-2)")
            if "picture" in (pr.get("title", "") + " ".join(g.get("rules", []))).lower() and not any(isinstance(x, dict) and x.get("img") for x in items):
                out.append(f"game {g['id']}: mentions a picture but the cards have none (PLAYTEST 3)")
        if re.search(r"\btap\b", " ".join(g.get("rules", [])), re.I): out.append(f"game {g['id']}: rules say 'tap' in a paper game (PLAYTEST 29)")
    text = json.dumps(u, ensure_ascii=False)
    if re.search(r"the app prints", text, re.I): out.append("says 'the app prints it': make it a printable or say how to draw it (PLAYTEST 4)")
    for k in ("experiments", "activities", "projects", "challenges"):
        for x in u.get(k, []):
            if re.match(r"\s*(none|no special|not needed|nothing)\b", x.get("safety") or "", re.I): out.append(f"{x.get('id')}: safety says '{x['safety'][:30]}': leave the field out (PLAYTEST 23)")
    # what families see: everything but the sources list and the video notes (the app doesn't show those)
    shown = json.dumps({**{k: v for k, v in u.items() if k != "sources"}, "videos": [{k: v for k, v in x.items() if k != "check"} for x in u.get("videos", [])]}, ensure_ascii=False)
    leaks = sorted({m.group(0) for m in LEAK.finditer(shown)})
    if leaks: out.append("internal notes a family would see: " + ", ".join(leaks) + " (PLAYTEST 21)")
    if STOCKL.search(text): out.append("stock line: " + STOCKL.search(text).group(0) + " (PLAYTEST 26)")
    empty = [l.get("title", "")[:30] for l in u.get("links", []) if not l.get("url") and l.get("kind") != "place"]
    if empty: out.append(f"links with no address: {', '.join(empty)} (PLAYTEST 22)")
    return out

# ---- Writer's kit checks (app/content/WRITER_BRIEF.md): the principles a script can see ----
# Each rule is (id, kind, message). `ERR` rules stop a unit; the rest are to-dos until the existing units are fixed.
FALSE_SIMPLE = re.compile(r"(?<!and )(?<!or )\b(?:five|5|six|6) (?:main |basic |only )?senses\b|\b(?:only|just|merely) a theory\b|\bjust a theory\b", re.I)
HEDGE = re.compile(r"\b(?:not|never|myth|really|thousands|hundreds|dozens|more than|often called|we say|people say|called|wrong|simplif\w+|so far)\b", re.I)
AGE_GATE = re.compile(r"too (?:advanced|hard|difficult|complicated) for (?:you|children|kids|your age|now|young|a child|this class)|when you(?:'re| are) (?:older|bigger|grown)|when you grow up|(?:you|we)(?:'ll| will) learn (?:this|that|more|about (?:it|this|that)) (?:later|in (?:a few|higher|bigger|class|school|college|secondary|senior)|when)|(?:in|at) (?:higher|senior|secondary) (?:classes|school)|too much for (?:now|you)|beyond (?:this class|your class|your level)|(?:leave|save) (?:this|that|it) for (?:later|when)", re.I)
FAMILY_WORD = re.compile(r"\b(?:this|next|each|every|another) (?:unit|topic)\b|\bin the unit\b|\bthe topic\b", re.I)
HUMAN_ANIMAL = re.compile(r"\b(?:humans|people|children|kids|man) and animals\b|\banimals and (?:humans|people|us)\b|\bunlike (?:other )?animals\b|\b(?:lower|simple|primitive) animals?\b|\bhigher and lower\b|\bprimitive\b", re.I)
DANGER = re.compile(r"\b(?:boil\w*|flame|candle|matches|knife|blade|scissors|hot water|kettle|stove|gas|bleach|acid|electric(?:ity)? socket|mains|plug point|climb\w*|sharp)\b", re.I)
BAD_LICENCE = re.compile(r"\b(?:NC|ND|SA|non-?commercial|share-?alike|all rights reserved)\b", re.I)

def shown_text(u):
    """the sentences a family reads: every string except the sources list, the video notes and internal fields"""
    out = []
    def walk(x, key=""):
        if isinstance(x, dict):
            for k, v in x.items():
                if k not in ("sources", "playtest", "warm", "check") or (k == "check" and not isinstance(v, str)): walk(v, k)
        elif isinstance(x, list):
            for v in x: walk(v, key)
        elif isinstance(x, str) and key not in ("id", "art", "src", "youtube", "scene", "object", "t", "kind", "status", "tier", "math_unit"): out.append(x)
    walk(u)
    return out

def sentences_with(pattern, strings, skip=None):
    """sentences in the strings that match `pattern` (and, with `skip`, do not match `skip`)"""
    out = []
    for text in strings:
        for s in re.split(r"(?<=[.!?])\s+", text):
            if pattern.search(s) and not (skip and skip.search(s)): out.append(s.strip()[:90])
    return out

def writers_kit(u, path):
    """Returns (errors, to_dos) for the rules in app/content/WRITER_BRIEF.md that a script can check."""
    E, T = [], []
    text = shown_text(u)
    # 1. truthful: no half-truths used to simplify
    bad = sentences_with(FALSE_SIMPLE, text, HEDGE)
    if bad: E.append(f"half-truth used to simplify ({len(bad)}): say what we know and that it is simplified, e.g. the body has thousands of kinds of sensors, and a scientific theory is our best tested explanation. See: '{bad[0]}' (WRITER_BRIEF.md 'Truthful')")
    # 2. no gatekeeping by age
    gate = sentences_with(AGE_GATE, text)
    if gate: E.append(f"age-gating ({len(gate)}): do not hold an idea back for being hard; tell it truthfully for this age instead. See: '{gate[0]}' (WRITER_BRIEF.md 'No gatekeeping')")
    # 3. families never read "unit" or "topic" (our filing words)
    fw = sentences_with(FAMILY_WORD, text)
    if fw: T.append(f"'unit' or 'topic' in text families read ({len(fw)}): name the thing itself (this lesson, this idea). See: '{fw[0]}' (TRACKS.md)")
    # 4. humans are animals; no lesser beings
    ha = sentences_with(HUMAN_ANIMAL, text)
    if ha: T.append(f"humans set apart from animals, or a being called lesser ({len(ha)}): write 'humans and other animals' (WRITING.md rule 29). See: '{ha[0]}'")
    # 5. many perspectives, open debates, open questions
    ex = u.get("explanations", [])
    with_p = [x for x in ex if len(x.get("perspectives", [])) >= 2]
    if len(with_p) < 2: T.append(f"only {len(with_p)} explanations give 2+ perspectives ({{who, explanation}}); give the different ways of thinking for at least 2 big ideas (WRITER_BRIEF.md 'Perspectives')")
    for x in ex:
        for p in x.get("perspectives", []):
            if not (p.get("who") and p.get("explanation")): T.append(f"perspective in '{x.get('concept', '')[:40]}' needs who and explanation")
    ch = u.get("challenging", [])
    if len(ch) < 2: T.append(f"challenging: {len(ch)}; give at least 2 views that challenge the usual story, each with evidence for and against")
    for c in ch:
        if not (c.get("who") and c.get("for") and c.get("against")): T.append(f"challenging view needs who, for and against: '{c.get('claim', '')[:40]}'")
    if ch and not any(c.get("status") in ("debated", "minority") for c in ch): T.append("challenging: no live debate (status debated or minority); include at least one view scientists still argue about")
    oq = u.get("open_questions", [])
    if len(oq) < 3: T.append(f"open_questions: {len(oq)}; give at least 3 things nobody knows yet, each with why_open")
    if any(not q.get("why_open") for q in oq): T.append("every open question needs why_open")
    bq = u.get("big_questions", [])
    if bq and not ({"deep", "big"} <= {q.get("kind") for q in bq}): T.append("big_questions: include both kinds, deep (into the idea) and big (out to life and the universe)")
    if any(not q.get("hint") for q in bq): T.append("every big question needs a hint that helps a child start thinking, not an answer")
    if any(not str(q.get("q", "")).strip().endswith("?") for q in bq): T.append("a big question must be a question (end it with '?')")
    # 6. sizes and counts from SPEC_UNIT.md
    sents = [x for x in re.split(r"(?<=[.!?])\s+", (u.get("summary") or {}).get("text", "").strip()) if x]
    if not 3 <= len(sents) <= 5: T.append(f"summary is {len(sents)} sentences (3-5)")
    if not 5 <= len(u.get("warmup", [])) <= 10: T.append(f"warmup: {len(u.get('warmup', []))} questions (5-10)")
    spine = u.get("plan", {}).get("spine", [])
    exp = {x.get("id"): x for x in u.get("experiments", [])}
    if spine:
        for need in ("roots", "quiz", "explanations"):
            if need not in spine: T.append(f"plan.spine must hold '{need}' (SPEC_UNIT.md 'The spine')")
        if not any(i in exp and exp[i].get("mins", 0) >= 20 for i in spine): T.append("plan.spine must hold one real experiment of 20+ minutes whose result the child does not know beforehand")
    else: T.append("plan.spine is empty (SPEC_UNIT.md 'The spine')")
    for x in u.get("experiments", []): 
        if x.get("mins", 20) < 5: T.append(f"experiment {x.get('id')}: {x.get('mins')} minutes is too short to be a real investigation")
    q = u.get("quiz", [])
    n_out = len(u.get("outcomes", []))
    if any(isinstance(i.get("outcome"), int) and not 0 <= i["outcome"] < n_out for i in q): T.append("quiz item points at an outcome that does not exist")
    if n_out and q and len({i.get("outcome") for i in q}) < n_out: T.append(f"quiz covers {len({i.get('outcome') for i in q})} of {n_out} outcomes: every outcome needs a quiz item")
    for k in ("explanations", "challenging", "agreed", "terms"):
        miss = sum(1 for x in u.get(k, []) if not x.get("context") and k in ("explanations", "challenging"))
        if miss: T.append(f"{k}: {miss} cards have no `context` line saying what the card is and why it is here (WRITING.md rule 14)")
    # 7. safety: a step with heat, blades or climbing must say a grown-up is needed
    risky = []
    for k in ("experiments", "activities", "projects", "challenges", "games"):
        for x in u.get(k, []):
            for st in x.get("flow", []):
                if DANGER.search(f"{st.get('do', '')} {st.get('kid', '')}") and not st.get("adult"): risky.append(f"{x.get('id')}/{st.get('id')}")
    if risky: T.append(f"{len(risky)} steps mention heat, blades or climbing without `adult: true` (EXPERIMENTS card): {', '.join(risky[:4])}")
    # 8. images: public domain, CC0 or CC BY, with credit
    art = path.replace(".json", ".art.json")
    if os.path.exists(art):
        try:
            for key, v in json.load(open(art)).items():
                if not isinstance(v, dict) or v.get("drawn"): continue
                if not v.get("credit"): E.append(f"picture '{key}' in {os.path.basename(art)} has no credit")
                elif BAD_LICENCE.search(v["credit"]): E.append(f"picture '{key}' credit '{v['credit'][:50]}' looks non-commercial or share-alike: only public domain, CC0 or CC BY")
        except Exception: pass
    for g in u.get("games", []):
        for pr in g.get("printables", []):
            for it in pr.get("items", []):
                if isinstance(it, dict) and isinstance(it.get("img"), dict):
                    if not it["img"].get("credit"): E.append(f"game {g.get('id')}: a card picture has no credit")
                    elif BAD_LICENCE.search(it["img"]["credit"]): E.append(f"game {g.get('id')}: picture credit '{it['img']['credit'][:50]}' is not public domain, CC0 or CC BY")
    return E, T


def check(path):
    e = []; P = lambda m: e.append(m)
    try: u = json.load(open(path))
    except Exception as x: return [f"not valid JSON: {x}"], 0, 0
    m = re.match(r'(sci|math|hist|phil)\.[\w-]+\.[\w-]+\.L([1-5])$', u.get("id", ""))
    if not m: P("id must look like sci.topic.subtopic.L3 or math.topic.subtopic.L1")
    level = int(m.group(2)) if m else 3
    cur = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "content", "curriculum", (m.group(1) if m else "") + ".json")   # the subject's curriculum map
    if m and os.path.exists(cur) and u["id"] not in {s["id"] for s in json.load(open(cur))["subtopic_levels"]}:
        W.append(f"{u['id']} is not in curriculum/{m.group(1)}.json: the build skips it until it is added there")
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
        if not isinstance(x.get("perspectives"), list): P(f"explanation needs a perspectives list (empty is fine): {x.get('concept')}")
        if x.get("status") == "debated" and len(x.get("perspectives", [])) < 2: P(f"debated explanation needs 2+ perspectives: {x.get('concept')}")
        if x.get("status") == "defined" and not x.get("definition"): P(f"defined explanation needs a definition: {x.get('concept')}")
        if not x.get("examples"): P(f"explanation needs examples: {x.get('concept')}")
    for c in u["challenging"]:
        if c.get("status") not in ("accepted", "debated", "minority", "rejected"): P(f"challenging view status: {c.get('claim', '')[:40]}")
    if len(u["big_questions"]) < 4 or not all(q.get("kind") in ("deep", "big") for q in u["big_questions"]): P("big_questions: 4+, each kind deep or big")
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
            if g in t.lower(): P(f"roots.deep_truth is generic ('{g}'): say what this unit shows (PHILOSOPHY.md)")
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
            if any(not isinstance(x, str) and not (isinstance(x, dict) and x.get("f") and (x.get("b") or x.get("img"))) for x in pr.get("items", [])):
                P(f"game {g.get('id')}: a printable item is text, or a card with a picture {{f, img}}, or a two-sided card {{f, b}} with both sides")
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
    young = int(u.get("level") or 3) <= 2  # Classes 1 and 2 read little: shorter worksheets
    for ws in u["worksheets"]: items(f"worksheet {ws.get('id')}", ws.get("items", []), 10 if young else 15)
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
    nw = lambda x: len(re.findall(r"\S+", str(x)))
    qs = [i for ws in u["worksheets"] for i in ws.get("items", []) if isinstance(i.get("p"), str)] + [q for q in u["quiz"] if isinstance(q.get("q"), str)]
    longq = [x for x in qs if nw(x.get("p") or x.get("q")) > 22]
    longo = [x for x in qs if any(nw(o) > 12 for o in (x.get("opts") or x.get("options") or []))]
    if longq or longo: W.append(f"questions that are not plain (WRITING.md rule 30): {len(longq)} over 22 words, {len(longo)} with an answer option over 12 words. E.g. {str((longq or longo)[0].get('p') or (longq or longo)[0].get('q'))[:70]}")
    if len(u["videos"]) != 3: P("videos: exactly 3")
    for v in u["videos"]:
        if v.get("status") == "find-id": W.append(f"video id still to find: {v.get('title')}")
        elif not re.match(r'^[\w-]{11}$', v.get("youtube", "")): P(f"video needs an 11-character YouTube id: {v.get('title')}")
    core = set(u["plan"].get("core", []))
    pick = lambda x: not core or x.get("id") in core
    mins = sum(x.get("mins", 0) for k in ("games", "worksheets", "projects", "experiments", "activities", "challenges") for x in u.get(k, []) if pick(x))
    mins += sum(v.get("mins", 0) for v in u["videos"]) + u["story"].get("mins", 10) + u.get("cards_mins", 15) + len(u["quiz"])
    days = max(1, round(mins / DAY_MINS[level]))
    if len(u["jokes"]) < 8: P(f"jokes: {len(u['jokes'])}; 8 to 10 good ones (PLAYTEST.md 27)")
    if len(u["jokes"]) > 12: W.append(f"jokes: {len(u['jokes'])}; keep the 8 to 10 best (PLAYTEST.md 27)")
    for b in u["buy"]:
        if not b.get("used_in") or any(x not in ids for x in b["used_in"]): P(f"buy item {b.get('item')}: used_in must list element ids")
    for mth in u["maths"]:
        if not mth.get("math_unit", "").startswith("math."): P("maths problems need a math_unit id")
        if not mth.get("why_maths"): P("maths problems need `why_maths`: one plain sentence on why this maths helps with this unit")
    if not u["plan"].get("start_options") or not u["plan"].get("default_order"): P("plan needs start_options and default_order")
    plain(u, P)
    deny = sorted({m.group(0).lower() for m in DENY.finditer(json.dumps(u, ensure_ascii=False))})
    # a person must read these: "scales can't feel tiny forces" is fine, "a plant can't think" is not
    if deny: W.append(f"check these don't deny a mind to anything ({', '.join(deny)}): PHILOSOPHY.md 'Everything is conscious'")
    # WRITING.md rule 28: "no brain" must not mark a being as lacking thought. Brains and neurons are one kind of hardware for
    # thinking; bacteria, plants and fungi sense, decide and remember with ion flow, signals and genetic switches
    nb = sorted({m.group(0)[:80] for m in re.finditer(r"(?:bacteri|plant|seed|fung|mould|mold|yeast|cell|microb)[^.!?\"]{0,60}?\b(?:no|without|lack\w*)\s+(?:a\s+)?(?:brain|neuron|nerve|nervous)", json.dumps(u, ensure_ascii=False), re.I)})
    if nb: W.append(f"'no brain' next to a bacterium, plant or cell reads as 'cannot think' ({len(nb)}); say how the being senses and decides (WRITING.md rule 28): " + " | ".join(nb[:3]))
    # WRITING.md rule 26: a living being is she, he or they, never "it"
    LIVE = r"(?:plant|seed|seedling|tree|bean|sprout|animal|bird|crow|sparrow|pigeon|parrot|hen|chick|insect|ant|bee|butterfly|caterpillar|spider|worm|earthworm|snail|frog|tadpole|fish|cow|dog|cat|goat|elephant|lion|tiger|monkey|bat|lizard|gecko|snake|turtle|whale|dolphin|bacteri(?:um|a)|germ|microbe|virus|fungus|mushroom|mould|yeast|baby|kitten|puppy|calf)"
    its = sorted({m.group(0)[:70] for m in re.finditer(r"\b" + LIVE + r"\b[^.!?\"]{0,40}?\b(?:it|its|itself)\b", json.dumps(u, ensure_ascii=False), re.I)})
    if its: W.append(f"a living being may be called 'it' in {len(its)} places; use she, he or they (WRITING.md rule 26): " + " | ".join(its[:4]))
    # PLAYTEST.md: what a family prints, plays and reads
    W.extend(playtest(u))
    dt = (u.get("roots") or {}).get("deep_truth", {}).get("truth", "")
    sens = [x for x in re.split(r"(?<=[.!?])\s+", dt) if x]
    if len(sens) > 5 or any(len(x.split()) > 24 for x in sens): P("roots.deep_truth: up to 5 short sentences, each under 25 words, naming the experiment it comes from (PHILOSOPHY.md, 'Simple and direct')")
    if len(u["warmup"]) < 5: P("warmup: 5+ quick questions")
    ke, kt = writers_kit(u, path)
    for x in ke: P(x)
    W.extend(kt)
    return e, mins, days

for f in (sys.argv[1:] if __name__ == "__main__" else []):
    e, mins, days = check(f)
    print(f"{f}: {'OK' if not e else ''} ({mins} min, about {days} days)")
    for x in e: print("  -", x)
    for x in W: print("  (to do)", x)
    W.clear()
