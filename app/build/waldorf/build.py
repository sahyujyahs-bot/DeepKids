"""Waldorf (Steiner) curriculum for India, Classes 1-5, written as DeepKids lesson packs.

Each block is authored as a list of days (title, what the parent tells or shows, Main Lesson Book work).
build() wraps every day in the Waldorf main-lesson rhythm (morning circle, recall, new content,
Main Lesson Book, practice, closing) and writes the blocks into app/build/data.json as board "waldorf".
Run:  python3 app/build/waldorf/build.py
"""
import json, os, importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(os.path.dirname(HERE), 'data.json')
CLASS_FILES = ['class1', 'class2', 'class3', 'class4', 'class5', 'hindi', 'arts']

VERSES = {
    1: "The sun with loving light makes bright for me each day; the soul with spirit power gives strength unto my limbs. (Steiner's morning verse for the lower classes)",
    2: "The sun with loving light makes bright for me each day; the soul with spirit power gives strength unto my limbs.",
    3: "Asato ma sadgamaya, tamaso ma jyotirgamaya. Lead me from the untrue to the true, from darkness to light.",
    4: "I look into the world, where the sun is shining, where the stars are sparkling, where the stones lie still. (Steiner's verse for the upper classes)",
    5: "I look into the world, where the sun is shining, where the stars are sparkling, where the stones lie still.",
}
CLOSING = "Close the Main Lesson Book together. Blow out the diya or candle. Say: “For all we learned today, thank you.” A quiet moment, then a stretch."
CIRCLE = {
    1: "Stand in a circle. Say the verse with gestures, sing one action song (e.g. ‘Chanda mama door ke’), then clap and stamp counting 1–12 forwards and back.",
    2: "Say the verse. Sing a round. Clap the 2s, 3s and 5s while walking in a circle, then bean-bag toss counting in 10s.",
    3: "Say the verse. Recite a poem you are learning this month. Skip-count 2s to 12s with clapping patterns; one riddle.",
    4: "Say the verse. Recite the month's poem, then times-table rhythms with a ball against the wall (6s to 12s). One tongue-twister.",
    5: "Say the verse. Recite the month's poem. Mental maths warm-up (5 quick sums), then a balance game (stand on one leg, eyes closed, count to 20).",
}

def day_steps(cls, b, i, d):
    if b['subj'] == 'hin':
        return [{"kind": "warmup", "title": "\u0917\u0940\u0924 \u0914\u0930 \u0916\u0947\u0932 (song and movement)", "mins": 5, "do": b['song']},
                {"kind": "talk", "title": d[0], "mins": 15, "do": d[1]},
                {"kind": "do", "title": "Hindi notebook" if cls > 1 else "Draw and say", "mins": 10, "do": d[2]},
                {"kind": "review", "title": "\u0927\u0928\u094d\u092f\u0935\u093e\u0926 (closing)", "mins": 2, "do": "Say together: \u201c\u0906\u091c \u0915\u093e \u0926\u093f\u0928 \u0905\u091a\u094d\u091b\u093e \u0925\u093e\u0964 \u0927\u0928\u094d\u092f\u0935\u093e\u0926!\u201d (Today was a good day. Thank you!)"}]
    if b['subj'] == 'wart':
        return [{"kind": "do", "title": d[0], "mins": 40, "do": d[1] + (" " + d[2] if d[2] else "")},
                {"kind": "review", "title": "Tidy and look", "mins": 5, "do": "Tidy the materials together. Look at the work quietly for a moment and say one thing you like about it. No judging; every painting is a beginning."}]
    title, tell, mlb = d[0], d[1], d[2]
    practice = d[3] if len(d) > 3 and d[3] else b['practice'][i % len(b['practice'])]
    steps = [{"kind": "warmup", "title": "Morning circle", "mins": 15, "do": f"Light a diya or candle. {CIRCLE[cls]} Verse: “{VERSES[cls]}”"}]
    if i > 0:
        steps.append({"kind": "review", "title": "Remember yesterday", "mins": 10, "do": "Ask your child to tell back yesterday's story or lesson in their own words. Don't correct; ask “And then what happened?” and “What did you picture?” Sleep has done its work; listen for what has deepened."})
    steps.append({"kind": "talk", "title": title, "mins": 20 if cls < 3 else 25, "do": tell})
    for a in b.get('acts', []) + b.get('exps', []):
        if a['day'] == i + 1:
            steps.append({"kind": "exp" if a in b.get('exps', []) else "act", "title": a['title'], "mins": a.get('mins', 20), "do": a.get('lead', "Do it together; the steps are below."), "ref": a['id']})
    steps.append({"kind": "do", "title": "Main Lesson Book", "mins": 25, "do": mlb})
    steps.append({"kind": "game", "title": practice[0], "mins": 15, "do": practice[1]})
    steps.append({"kind": "review", "title": "Closing", "mins": 5, "do": CLOSING})
    return steps

def build_block(cls, b, n):
    days = []
    for i, d in enumerate(b['days']):
        need = (list(b['need']) if i == 0 else []) + (d[4] if len(d) > 4 else []) + (d[3] if b['subj'] == 'wart' and len(d) > 3 and isinstance(d[3], list) else [])
        prep = [{"when": "night before", "task": "Prepare to tell, not read: " + (d[1][:140].rsplit(' ', 1)[0] + "…" if len(d[1]) > 140 else d[1])}]
        if i == 0:
            prep.insert(0, {"when": "2 days before", "task": "Get ready for the block: " + ", ".join(b['need'][:6])})
        days.append({"n": i + 1, "title": d[0], "goal": d[0] + ". " + b['goal_line'], "steps": day_steps(cls, b, i, d), "need": need, "prep": prep})
    acts = [{"id": a['id'], "title": a['title'], "day": a['day'], "mins": a.get('mins', 20), "need": a.get('need', []), "steps": a['steps'], "outcome": a.get('outcome', '')} for a in b.get('acts', [])]
    exps = [{"id": a['id'], "title": a['title'], "day": a['day'], "question": a.get('question', ''), "need": a.get('need', []), "steps": a['steps'], "predict": a.get('predict', ''), "why": a.get('why', '')} for a in b.get('exps', [])]
    subj = b['subj']
    book = {"wml": f"Waldorf Main Lesson · Class {cls}", "hin": f"Waldorf Hindi · Class {cls}", "wart": f"Waldorf Arts & Handwork · Class {cls}"}[subj]
    pack = {"title": b['title'], "source": f"DeepKids Waldorf curriculum for India · Class {cls} · {b['weeks']}-week block", "summary": b['summary'],
            "goals": ["By the end your child can " + g for g in b['goals']], "words": [list(w) for w in b.get('words', [])], "day_mins": 90 if subj == "wml" else 45 if subj == "wart" else 32,
            "days": days, "worksheets": [], "experiments": exps, "activities": acts, "voices": [], "check": [{"q": q, "a": a} for q, a in b.get('check', [])]}
    return {"k": f"waldorf|{subj}|{cls}|{n}", "board": "waldorf", "subj": subj, "level": cls, "book": book, "n": str(n), "title": b['title'], "dk": [],
            "c": {"covers": b['summary'], "p": pack, "wf": {"books": b.get('books', []), "theme": b.get('theme', '')}}}

def load(name):
    spec = importlib.util.spec_from_file_location(name, os.path.join(HERE, name + '.py'))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m

def build():
    data = json.load(open(DATA))
    data['items'] = [i for i in data['items'] if i.get('board') != 'waldorf']
    items, guide = [], None
    for f in CLASS_FILES:
        if not os.path.exists(os.path.join(HERE, f + '.py')):
            continue
        m = load(f)
        for cls, blocks in m.BLOCKS.items():
            counters = {}
            for b in blocks:
                counters[b['subj']] = counters.get(b['subj'], 0) + 1
                items.append(build_block(cls, b, counters[b['subj']]))
    data['items'] += items
    g = load('guide')
    data['waldorf'] = g.GUIDE
    json.dump(data, open(DATA, 'w'), ensure_ascii=False, separators=(",", ":"))
    by = {}
    for i in items:
        by[(i['level'], i['subj'])] = by.get((i['level'], i['subj']), 0) + 1
    print(len(items), "Waldorf blocks", sorted(by.items()), sum(len(i['c']['p']['days']) for i in items), "days")

if __name__ == '__main__':
    build()
