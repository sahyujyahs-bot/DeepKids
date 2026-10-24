"""Map the founder's ideas bank (app/content/ideas/*.json, made by extract.py) onto Combined science topics.

Writes:
  app/content/ideas/by_topic/<topic>.md  full digest per topic, read by lesson writers
  app/build/ideas/notebook.json          compact data for the app's "From the DeepKids notebook" tab
Run: python3 app/build/ideas/build.py
"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__)); BUILD = os.path.dirname(HERE); APP = os.path.dirname(BUILD)
IDEAS = os.path.join(APP, "content", "ideas")
L = lambda n: json.load(open(os.path.join(IDEAS, n + ".json")))
U = json.load(open(os.path.join(BUILD, "combined", "sci_universe.json")))

# topic -> words that pull an idea into it (matched against titles, concepts and fields)
KEYS = {
    "living-and-non-living-signs-of-life": r"\bwhat is life|characteristics of life|living|alive|life\b",
    "growing-up-and-having-young": r"reproduc|life cycle|growth|development|baby|egg",
    "how-life-began": r"\brna\b|origin of life|first cell|prokaryot|prebiotic|hydrothermal|abiogenesis",
    "matter-and-particles": r"\bmatter\b|particle|atom|molecule|states of matter|brownian|density",
    "changing-materials": r"melting|boiling|freez|phase|thermal expansion|heat flow|materials under heat|fire",
    "materials-and-their-properties": r"material|viscosity|elastic|surface tension|transparent|opaque|solid",
    "making-things": r"craft|tool|simple machine|lever|pulley|wheel|engineer|invent",
    "rocks-and-soil": r"rock|soil|mineral|crystal|geolog|seismolog|earthquake",
    "gases-evaporation-condensation-solutions": r"\bgas|evaporat|condens|humidity|pressure|cloud|dissolv|solution",
    "plants": r"plant|photosynth|leaf|algae|tree|bose",
    "seeds-plant-growth-and-plant-life-cycles": r"seed|germinat|sprout|pollinat|flower",
    "kinds-of-living-things-and-sorting-them": r"classif|kingdom|species|fungi|animal|sponge|insect|tree of life",
    "habitats-and-adaptation": r"habitat|adapt|ecosystem|ocean|desert|forest|camouflage",
    "living-in-harmony": r"symbio|alliance|cooperat|mycorrh|ecosystem|balance",
    "the-universe-sun-moon-stars-and-planets": r"planet|stars?\b|stellar|\bsun\b|moon|solar system|galax|cosmos|astronom|telescope|comet|asteroid",
    "gravity": r"gravit|orbit|weight|mass\b|falling|black hole|tide|escape velocity|spacetime|space-time|lagrange|kepler",
    "planet-earth": r"\bearth\b|atmosphere|climate|ocean|tilt|plate|volcan",
    "day-night-seasons-and-rhythms-of-nature": r"day night|rotation|season|moon phase|tilt|calendar|time tracker",
    "water": r"water|rain|river|ocean|precipitation|buoyan|float|sink",
    "nature-s-events": r"storm|cyclone|monsoon|tornado|flood|earthquake|lightning|el ni",
    "society-community-culture-and-festivals": r"societ|culture|history|civiliz|communit|family tree",
    "transport-and-communication": r"communicat|transport|language|signal|telecom|vehicle",
    "microorganisms": r"microb|bacteri|virus|prokaryot|fungi|microbiolog|archaea|yellow fever|vaccin",
    "the-world-of-birds": r"\bbird|dinos|feather|flight",
    "forces-and-movement": r"force|push|pull|friction|motion|newton|normal force|buoyan|drag|lift|tension|momentum|velocity|inertia",
    "magnets": r"magnet|lodestone|compass|electromagnet",
    "sound": r"sound|music|vibrat|pitch|echo|\bom\b|wave|doppler|beats",
    "light-seeing-and-shadows": r"light|shadow|colour|color|reflect|refract|rainbow|prism|optic|lens|bioluminesc|photon",
    "caring-for-the-environment": r"environment|climate|pollut|sustainab|global warming|greenhouse|human impact",
    "waste": r"waste|recycl|compost|reduce",
    "genes-and-inheriting-features": r"gene|dna|heredit|inherit|chromosom|trait|fingerprint|family tree",
    "where-humans-came-from": r"human evolution|hominin|homo\b|ancestor|early humans|bonobo|primate",
    "me-and-others": r"empathy|self|identity|emotion|others|become the other",
    "our-closest-cousins": r"apes?\b|chimp|bonobo|primate|gorilla|orangutan",
    "family": r"family|parents|grand",
    "body-parts-and-skeleton": r"skelet|bone|muscle|body|anatom|homeostasis",
    "senses": r"senses?\b|sensory|perception|optical illusion|eyes?\b|ears?\b|touch|smell|taste",
    "thinking-and-memory": r"thought|thinking|memory|brain|neuron|consciousness|dmn|default mode|dopamine|mind",
    "health-hygiene-exercise-and-illness": r"health|disease|immune|hygiene|yoga|breath|medicine|exercise",
    "electricity-and-staying-safe-with-it": r"electric|current|circuit|charge|battery|tesla|conductiv",
    "food-and-a-balanced-diet": r"food|nutrition|diet|cooking|metabolism|recipe",
    "digestion": r"digest|gut|stomach|metabolism",
    "basic-needs": r"basic needs|shelter|food|water|clothing",
    "energy": r"energy|heat|thermodynamic|work, energy|conservation|e\s*=\s*mc|fusion|fission|power",
    "how-we-know": r"what is science|story of science|scientific method|fringe|discover|heretic|evidence",
    "patterns-and-symmetry": r"symmetr|pattern|fractal|mandala|golden ratio|spiral|crystal",
    "order-chaos-and-chance": r"chaos|order|probab|random|uncertain|entropy|causal|karma|zero sum|coin toss|dice",
    "what-is-real": r"reality|real\b|consciousness|awareness|subjective|perception|illusion|dream",
    "space-time-and-dimensions": r"\bspace\b|\btime\b|dimension|time travel|worm ?hole|twin paradox|relativity|time dilation|2d to 3d|circle into sphere",
    "nothing-and-forever": r"zero|infinit|singularit|nothing",
    "the-very-small": r"particle|quantum|antimatter|anti matter|atom|electron|quark|string theory|entangle|higgs",
    "story-of-the-universe": r"big bang|galax|universe|expansion|hubble|cosmic|dark matter|dark energy|multiverse|nucleosynth",
    "evolution-the-tree-of-life": r"evolution|species|tree of life|rna|ancestor|fossil|innovation",
}
# grid rows (grade_concepts) that feed board topics too
GRID_EXTRA = {"gravity": ["gravity-theories"], "energy": ["energy", "entropy"], "matter-and-particles": ["matter", "particles"],
              "the-universe-sun-moon-stars-and-planets": ["types-of-galaxies-spiral-elliptical-irregular", "expansion-of-the-universe-hubble-s-law"],
              "thinking-and-memory": ["consciousness-awareness-subjective-experience"], "senses": ["reality"],
              "light-seeing-and-shadows": ["gravitational-lensing"]}
PRIORITY_TAGS = ("Underdog", "Invisible Giant", "IP Theft Victim", "Heretic", "Self-Taught", "Late Bloomer")

topics = {t["id"]: t for t in U}
rx = {k: re.compile(r"\b(?:" + v + ")", re.I) for k, v in KEYS.items()}  # words must start at a word edge ("ear" is not in "nuclear")
grid = {g["id"]: g for g in L("grade_concepts")}
acts, sci, gp, fc, jp = L("concept_activities"), L("scientists"), L("gravity_points"), L("force_cards"), L("journal_pages")
evo, rna, voices, weeks, notes = L("evolution"), L("rna_story"), L("gravity_voices"), L("activity_weeks"), L("notes")


def hits(text, tid):
    return bool(rx[tid].search(text or ""))


def title_hits(a, tid):  # activities: match on the concept title, fall back to its "about" line
    return hits(a["title"], tid) or (tid in KEYS and hits(a.get("about", "")[:160], tid) and not any(
        hits(a["title"], o) for o in KEYS if o != tid))


def sci_score(c):
    tags = c.get("special_tags", "")
    return (sum(t in tags for t in PRIORITY_TAGS) * 3 + (c.get("gender") == "F") * 2 + c.get("odds_defied", 0) / 3)


nb, os_by = {}, os.path.join(IDEAS, "by_topic")
os.makedirs(os_by, exist_ok=True)
for tid, t in topics.items():
    g_ids = list(t.get("grid", [])) + GRID_EXTRA.get(tid, [])
    g = [grid[i] for i in g_ids if i in grid]
    a = [x for x in acts if title_hits(x, tid)]
    s = [c for c in sci if hits(c.get("fields", "") + " " + c.get("key_contribution", "")[:160], tid)]
    s.sort(key=sci_score, reverse=True)
    j = [p for p in jp if hits(p["content"] + " " + p["concept"], tid)]
    rec = {"grid": [{"id": x["id"], "title": x["title"], "grades": x["grades"]} for x in g],
           "acts": [x["id"] for x in a][:12], "sci": [c["card_id"] for c in s][:12], "journal": [p["page"] for p in j][:10]}
    if tid in ("gravity", "forces-and-movement"):
        rec["force_cards"] = [x["force"] for x in fc]
    nb[tid] = rec

    # writer digest: everything, in full
    md = [f"# From the DeepKids notebook: {t['title']}",
          "The founder's own notes for this topic. Use them as the core of the lesson: their ideas, activities, games, stories and philosophy. "
          "Check every fact (see ../ACCURACY.md); keep what is true, mark what is debated, drop what is wrong. Never copy a claim the evidence contradicts.\n"]
    for x in g:
        md.append(f"## Grade concept grid: {x['title']}")
        for gr, f in x["grades"].items():
            md.append(f"**Grade {gr}.** " + " ".join(f"*{k}:* {v}" for k, v in f.items()))
        md.append("")
    for x in a:
        md.append(f"## Concept activities: {x['title']}")
        md += [f"- **{k}:** {v}" for k, v in x.items() if k not in ("id", "title", "src")]
        md.append("")
    if tid in ("gravity", "forces-and-movement", "space-time-and-dimensions"):
        md.append("## The founder's gravity concepts (long form)\n" + notes["gravity_concepts"][:24000] + "\n")
        md.append("## Gravity points: concept, activity, game packaging")
        md += [f"- **{p['topic']}** — {p['concept']} | Activity: {p['activity']} | Game: {p['packaging']}" for p in gp if p["concept"] or p["activity"]]
        md.append("\n## Force cards (Escape Gravity board game) and the physical challenge each unlocks")
        md += [f"- **{x['force']}**: {x['activities']}" for x in fc]
        md.append("\n## Gravity voices across history (check each; mark modern readings of old texts as debated)")
        md += [f"- **{v.get('name')}** ({v.get('country', '')}, {v.get('era', '')}): {v.get('contribution', '')} — {v.get('truth', '')}" for v in voices]
        md.append("")
    if tid in ("how-we-know", "energy", "the-very-small", "story-of-the-universe", "space-time-and-dimensions", "gravity"):
        md.append("## The deepest discoveries in physics (founder's list)\n" + notes["deepest_discoveries_in_physics"] + "\n")
    if tid in ("how-we-know",):
        md.append("## Stories of science and the True/False card game\n" + notes["stories_of_science_and_true_false"] + "\n")
    if tid in ("how-life-began", "evolution-the-tree-of-life", "microorganisms", "genes-and-inheriting-features", "kinds-of-living-things-and-sorting-them", "thinking-and-memory", "plants"):
        md.append("## RNA's story of life (founder's picture book, narrated by RNA)")
        for p in rna:
            if tid in ("how-life-began", "evolution-the-tree-of-life") or hits(p["page"] + " " + p["text"][:400], tid):
                md.append(f"### {p['page']}\n{p['text']}\n")
    if tid in ("how-life-began", "evolution-the-tree-of-life", "kinds-of-living-things-and-sorting-them", "where-humans-came-from", "body-parts-and-skeleton", "the-world-of-birds", "microorganisms", "plants"):
        md.append("## Evolution picture book: introduction\n" + evo["intro"] + "\n")
        md.append("## Evolution picture book: pages")
        md += [f"- **{p.get('when', '')}** {p.get('page', '')} — {p.get('caption', '')} {p.get('more', '')[:600]}" for p in evo["pages"]]
        md.append("\n## Species ladder (name, when, from, innovations, drivers, lost)")
        for sp in evo["species"]:
            if tid in ("how-life-began", "evolution-the-tree-of-life") or hits(sp["name"] + " " + sp.get("features", "")[:300], tid):
                md.append(f"- **{sp['name']}** ({sp.get('year', '')}, from {sp.get('parent', '-')}): innovations {sp.get('innovations', '')[:500]} | drivers {sp.get('drivers', '')[:400]} | lost {sp.get('lost', '')[:300]}")
        md.append("")
    if s:
        md.append("## SCI Cards: scientists for this topic (founder's card game; strongest underdog stories first)")
        for c in s[:20]:
            md.append(f"- **{c['scientist_name']}** ({c.get('born', '')}–{c.get('died', '')}, {c.get('nationality', '')}; {c.get('special_tags', '')}): "
                      f"{c.get('key_contribution', '')} *Whisper:* {c.get('fundamental_truth_what_it_whispers', '')} *Story:* {c.get('story', '')[:700]}")
        md.append("")
    if j:
        md.append("## Science journal pages that fit")
        md += [f"- p{p['page']}: {p['content']} ({p['todo']}) — {p['concept']} {p['also']}" for p in j]
        md.append("")
    w = [x for x in weeks if hits(x.get("title", "") + " " + x.get("activities", ""), tid)]
    if w:
        md.append("## DeepKids weekly activity journeys that fit")
        for x in w:
            md.append(f"### Week {x.get('week', '')}: {x.get('title', '')}\n{x.get('activities', '')}\n\n{x.get('execution', '')[:1500]}\n\nStory seed: {x.get('story', '')[:1200]}\n")
    open(os.path.join(os_by, tid + ".md"), "w").write("\n".join(md))

used_acts = {i for r in nb.values() for i in r["acts"]}
used_sci = {i for r in nb.values() for i in r["sci"]}
out = {"topics": nb,
       "acts": {x["id"]: {k: v for k, v in x.items() if k not in ("src",)} for x in acts if x["id"] in used_acts},
       "sci": {c["card_id"]: {k: c.get(k) for k in ("scientist_name", "pack", "rarity", "born", "died", "gender", "nationality", "fields",
                                                   "key_contribution", "fundamental_truth_what_it_whispers", "special_tags", "story",
                                                   "spotted_in_everyday_life", "field_impact", "global_impact", "odds_defied", "counterintuitive_factor")
                               if c.get(k) not in (None, "")} for c in sci},
       "journal": {p["page"]: {"content": p["content"], "todo": p["todo"], "concept": p["concept"]} for p in jp}}
json.dump(out, open(os.path.join(HERE, "notebook.json"), "w"), ensure_ascii=False, separators=(",", ":"))
print(f"{len(nb)} topics; {len(used_acts)}/{len(acts)} activity concepts and {len(used_sci)}/{len(sci)} scientists placed; "
      f"notebook.json {os.path.getsize(os.path.join(HERE, 'notebook.json')) // 1024} KB")
for tid, r in nb.items():
    print(f"  {tid}: grid {len(r['grid'])}, acts {len(r['acts'])}, sci {len(r['sci'])}, journal {len(r['journal'])}")
