"""Render a unit JSON as readable Markdown for review: python3 app/build/unit_to_md.py <unit.json> <out.md>"""
import json, sys
u = json.load(open(sys.argv[1])); o = []; w = o.append
def flow(st):
    for s in st:
        w(f"- **{s['id']} ({s['mins']} min){' · grown-up needed' if s.get('adult') else ''}**  \n  *Parent does:* {s.get('do','')}  \n  *Parent says:* {s.get('say','')}  \n  *Child mode:* {s['kid']}")
        for a in s.get("ask", []): w(f"  - Ask: {a['q']} (good: {'; '.join(a['good'])})")
        if s.get("parent"): w(f"  - Note: {s['parent']}")
        if s.get("check"): c = s["check"]; w(f"  - Check: {c['q']} → **{c['options'][c['a']]}**")
        if s.get("think"): w(f"  - Think: {s['think']}")
        if s.get("wait"): w(f"  - Wait: {s['wait']}")
def item(i, it):
    opts = it.get("opts") or it.get("options")
    a = opts[it["a"]] if it["t"] == "mcq" else it["a"]
    if it["t"] == "sort": a = "; ".join(f"{x} → {c}" for x, c in it["items"])
    if it["t"] == "match": a = "; ".join(f"{x} → {y}" for x, y in it["pairs"])
    if it["t"] == "forces": a = ", ".join(f"{f['name']} {f['dir']}" for f in it["a"])
    w(f"{i}. ({it['t']}) {it['p']}" + (f"  \n   Options: {' / '.join(opts)}" if opts else "") + f"  \n   **Answer:** {a}. *Why:* {it['why']}")
w(f"# {u['title']}\n`{u['id']}`\n\n**Summary.** {u['summary']['text']}\n\n**Intro.** *{u['intro']['hook']}* {u['intro']['text']}\n")
w("## Learning outcomes"); [w(f"{i}. {x}") for i, x in enumerate(u["outcomes"])]
w("\n## Terms"); [w(f"- **{t['term']}**: {t['meaning']} *e.g.* {t['example']}") for t in u["terms"]]
w("\n## Explanations")
for x in u["explanations"]:
    w(f"### {x['concept']} · *{x['status']}*")
    if x.get("definition"): w(f"**Definition:** {x['definition']}\n")
    w(x.get("description", "")); [w(f"- e.g. {e}") for e in x["examples"]]
    [w(f"- **{p['who']}:** {p['explanation']}") for p in x.get("perspectives", [])]
w("\n## Mostly agreed"); [w(f"- {a['text']} *How we know:* {a['evidence']}") for a in u["agreed"]]
h = u.get("how_we_found_out")
if h: w(f"\n## How we found out\n**{h['who']}, {h['when']}.** {h['story']}  \n*What people believed before:* {h['wrong_idea']}")
w("\n## Challenging perspectives"); [w(f"- **{c['claim']}** ({c['who']}; *{c['status']}*)  \n  For: {c['for']}  \n  Against: {c['against']}") for c in u["challenging"]]
r = u.get("roots")
if r:
    d = r["deep_truth"]
    w(f"\n## Roots\n{r['context']}\n\n**Deep truth.** {d['truth']}  \n*Habit it breaks:* {d['habit']}  \n*Evidence:* {d['evidence']}\n")
    for k, v in r["three"].items(): w(f"- *{k.replace('_', ' ')}:* {v}")
    w(f"\n{r['thread']}\n"); [w(f"- **{t['source']}:** {t['teaching']} ({t['link']})") for t in r["teachings"]]
    [w(f"- Science ({x['status']}): {x['text']}") for x in r["science"]]
    w(f"- Other view, {r['other_view']['who']}: {r['other_view']['view']}")
    p_ = r["practice"]; w(f"- Practice, {p_['title']} ({p_['mins']} min): {p_['say']}")
    [w(f"- Ask: {q}") for q in r["ask"]]
w("\n## Deep and big questions"); [w(f"- *{q['kind']}:* {q['q']} (hint: {q['hint']})") for q in u["big_questions"]]
s = u["story"]; w(f"\n## Story: {s['title']}\n*{s.get('note','')}*\n"); [w(p + "\n") for p in s["text"]]
w(f"**For the parent:** {s['epiphany']}\n"); [w(f"- Ask: {q}") for q in s["ask"]]
for k, name in (("games", "Games"), ("experiments", "Experiments"), ("activities", "Activities"), ("projects", "Projects"), ("challenges", "Challenges")):
    w(f"\n## {name}")
    for g in u[k]:
        w(f"### {g['id']} · {g['title']} ({g['mins']} min{', ' + str(g['days']) + ' days' if g.get('days', 1) > 1 else ''})")
        for f in ("problem", "question", "predict", "fair_test", "safety", "record", "your_turn"):
            if g.get(f): w(f"- **{f.replace('_', ' ')}:** {g[f]}")
        if g.get("results_table"): w(f"- **results table:** {' | '.join(g['results_table'])}")
        for f in ("constraints", "general", "creative", "rules"):
            if g.get(f): w(f"- **{f}:** " + "; ".join(g[f]))
        for pr in g.get("printables", []): w(f"- **Printable {pr['kind']}: {pr['title']}:** " + "; ".join(x if isinstance(x, str) else f"{x['f']} (back: {x['b']})" for x in pr["items"]))
        if g.get("schedule") and g.get("days", 1) > 1: w("- **schedule:** " + "; ".join(f"day {d['day']}: {d['what']} ({d['mins']} min)" for d in g["schedule"]))
        flow(g["flow"])
w("\n## Worksheets")
for ws in u["worksheets"]:
    w(f"### {ws['title']} ({ws['tier']}, {len(ws['items'])} questions)"); [item(i + 1, it) for i, it in enumerate(ws["items"])]
w("\n## Videos"); [w(f"- **{v['title']}** ({v['channel']}, {v['mins']} min) id `{v.get('youtube') or 'to find'}`: {v['why']} *Check:* {v['check']}") for v in u["videos"]]
w("\n## Quiz"); [item(i + 1, it) for i, it in enumerate(u["quiz"])]
w("\n## Applications"); [w(f"- {a}") for a in u["applications"]]
w("\n## Spotted around us"); [w(f"- {a['text']}") for a in u["spotted"]]
w("\n## Open questions"); [w(f"- **{a['q']}** {a['why_open']}") for a in u["open_questions"]]
w("\n## Questions to ask kids"); [w(f"- {a}") for a in u["ask_kids"]]
w("\n## Jokes"); [w(f"- {j['j']} *{j['a']}*") for j in u["jokes"]]
w("\n## Connected maths"); [w(f"- {m['problem']} **{m['answer']}**. {m['explain']} (queues `{m['math_unit']}`)") for m in u["maths"]]
w(f"\n## Song\n{u['song']['title']} ({u['song']['topic_level']}): {u['song'].get('note','')}")
w("\n## Links"); [w(f"- [{l['title']}]({l['url']}) · {l['kind']}{' · ' + l['where'] if l.get('where') else ''}: {l['why']}") for l in u["links"]]
w("\n## Things to buy"); [w(f"- [{b['item']}]({b['url']}) ({b['kind']}): {b['why']} Used in {', '.join(b['used_in'])}. {b.get('plan','')}") for b in u["buy"]]
w("\n## Warm-up"); [w(f"- {q['q']} → {q['a']}") for q in u["warmup"]]
p = u["plan"]; w(f"\n## Plan\n- Start options: {', '.join(p['start_options'])}\n- Default order: {' → '.join(p['default_order'])}\n- Core: {', '.join(p['core'])}")
if u.get("sources"): w("\n## Sources"); [w(f"- {x}") for v in u["sources"].values() for x in v]
open(sys.argv[2], "w").write("\n".join(o) + "\n")
