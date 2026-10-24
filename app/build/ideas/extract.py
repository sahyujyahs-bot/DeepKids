"""Turn the founder's notes (the xlsx and pdf files uploaded to the main branch)
into a clean ideas bank: app/content/ideas/*.json.

Usage: python3 app/build/ideas/extract.py <folder with the uploaded files>

The bank is raw material for writers and for the app's "From the DeepKids
notebook" tab. Nothing here is shown to children without the topic mapping in
build.py, and claims listed in app/content/ideas/ACCURACY.md are flagged.
"""
import json, os, re, subprocess, sys
import openpyxl

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), "..", "..", "content", "ideas")
os.makedirs(OUT, exist_ok=True)


def sheet(book, name):
    wb = openpyxl.load_workbook(os.path.join(SRC, book + ".xlsx"), read_only=True, data_only=True)
    rows = []
    for row in wb[name].iter_rows(values_only=True):
        r = [("" if c is None else str(c).strip()) for c in row]
        while r and not r[-1]:
            r.pop()
        rows.append(r)
    return rows


def pdf(name):
    return subprocess.run(["pdftotext", "-layout", os.path.join(SRC, name + ".pdf"), "-"],
                          capture_output=True, text=True).stdout


def clean(s):
    s = s.replace("​", "").replace("\r", "")
    s = re.sub(r"(en\.wikipedia\.org|britannica\.com|ncbi\.nlm\.nih\.gov|pmc\.ncbi\.nlm\.nih\.gov|mathscholar\.org|asm\.org)", "", s)
    s = re.sub(r"[ \t]+", " ", s)
    return re.sub(r"\n{3,}", "\n\n", s).strip()


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60]


def save(name, data):
    with open(os.path.join(OUT, name + ".json"), "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print(f"{name}.json: {len(data)} records")


# 1. Grade-wise concepts grid (Grade 1-5, seven facets per cell)
LABELS = {"Concept": "concept", "Philosophical truth": "truth", "Salient points": "salient",
          "Debated aspects": "debated", "Exceptions": "exceptions", "In art/life": "art_life",
          "In nature": "nature"}


def facets(cell):
    out, key = {}, "concept"
    for line in re.split(r"\n", cell):
        m = re.match(r"\s*(Concept|Philosophical truth|Salient points|Debated aspects|Exceptions|In art/life|In nature)\s*:\s*(.*)", line)
        if m:
            key = LABELS[m.group(1)]
            out[key] = m.group(2).strip()
        elif line.strip():
            out[key] = (out.get(key, "") + " " + line.strip()).strip()
    return {k: clean(v) for k, v in out.items() if v}


grid, section, seen = [], "", {}
for r in sheet("DeepKids - Science - Grade Concepts", "Grade Wise Concepts - Physics")[1:]:
    if not r or not r[0]:
        continue
    cells = (r[1:6] + [""] * 5)[:5]
    if not any(cells):
        section = r[0].strip()
        continue
    title = clean(r[0]).replace("Theroies", "Theories")
    rec = {"id": slug(title), "title": title, "section": section,
           "grades": {str(i + 1): facets(c) for i, c in enumerate(cells) if c}}
    key = rec["id"]
    if key in seen:   # the sheet repeats its first six rows; keep the richer copy
        old = grid[seen[key]]
        if sum(len(json.dumps(v)) for v in rec["grades"].values()) > sum(len(json.dumps(v)) for v in old["grades"].values()):
            grid[seen[key]] = rec
        continue
    seen[key] = len(grid)
    grid.append(rec)
save("grade_concepts", grid)

# 2. Concept activity bank (one concept, every art form, parent scripts)
COLS = {"About the Concept": "about", "Principles within the Concept": "principles",
        "Philosophy underlying the Concepts": "philosophy", "Experiments": "experiments",
        "Activities around the House": "home", "Activities outside the House & in Nature": "outdoors",
        "Dance": "dance", "Drama": "drama", "Painting / Drawing": "art", "Music": "music",
        "Yoga / Breathing": "yoga", "Physical Games": "physical_games", "Games – any kind": "games",
        "Reading": "reading", "Writing – observations / stories / poems / answers": "writing",
        "More Activities": "more", "Other Activities": "other", "Craft Activities": "craft",
        "Co-creation output generating Activities": "cocreate", "Parent: Topic explainer": "parent_explainer",
        "Parent: Everyday prompts": "parent_prompts", "Parent: Roles & setup": "parent_setup",
        "Parent: Scripts": "parent_scripts", "Parent: Reflection prompts": "parent_reflection",
        "Notes on Safety & Inclusion": "safety"}


def activity_rows(book, name):
    recs, head = [], None
    for r in sheet(book, name):
        if r and r[0].strip("* ").startswith("Concept"):
            head = [COLS.get(h.strip("* "), slug(h)) for h in r]
            continue
        if not head or not r or not r[0] or sum(1 for c in r[1:] if c) < 3:
            continue
        rec = {"id": slug(r[0]), "title": clean(r[0].strip("* ")), "src": f"{book} / {name}"}
        for h, c in zip(head[1:], r[1:]):
            if c and h:
                rec[h] = clean(c)
        recs.append(rec)
    return recs


acts = activity_rows("DeepKids - Science - Grade Concepts", "P =G1-Contents")
acts += activity_rows("DeepKids HomeSchooling Track", "Biology")
ids = {}
for a in acts:  # make ids unique
    n = ids.get(a["id"], 0)
    ids[a["id"]] = n + 1
    if n:
        a["id"] += f"-{n + 1}"
save("concept_activities", acts)

# 3. Scientist cards (SCI Cards master list, plus the gravity research dump)
head, cards = None, []
for r in sheet("SCI Cards", "Master"):
    if r and r[0] == "Card ID":
        head = [slug(h).replace("-", "_") for h in r]
        continue
    if head and r and r[0].startswith("DK-"):
        c = {h: clean(v) for h, v in zip(head, r) if v and h}
        for k in ("field_impact_1_10", "global_impact_1_10", "odds_defied_1_10", "counterintuitive_factor_1_10"):
            if k in c:
                try:
                    c[k.replace("_1_10", "")] = int(float(c.pop(k)))
                except ValueError:
                    c.pop(k)
        for k in ("born", "died"):
            if k in c:
                c[k] = c[k].replace(" 00:00:00", "")
        cards.append(c)
save("scientists", cards)

dump = []
for r in sheet("SCI Cards", "Dump2")[1:]:
    if r and r[0]:
        keys = ["name", "gender", "country", "era", "field", "contribution", "truth", "story"]
        dump.append({k: clean(v) for k, v in zip(keys, r) if v})
save("gravity_voices", dump)

# 4. Gravity: the founder's long-form concepts, the points sheet, force cards
grav = []
topic = ""
for r in sheet("DeepKids - Science - Grade Concepts", "Gravity all points")[1:]:
    if not r or not any(r):
        continue
    if r[0]:
        topic = clean(r[0])
    cells = (r + ["", "", "", ""])[:4]
    if cells[1] or cells[2]:
        grav.append({"topic": topic, "concept": clean(cells[1]), "activity": clean(cells[2]), "packaging": clean(cells[3])})
save("gravity_points", grav)

fc = []
for r in sheet("DeepKids - Science - Grade Concepts", "Force & Activity cards")[1:]:
    if r and r[0] and len(r) > 1 and r[1]:
        fc.append({"force": clean(r[0]), "activities": clean(r[1]), "cards": clean(r[2]) if len(r) > 2 else ""})
save("force_cards", fc)

notes = {"gravity_concepts": clean(pdf("Science Concepts")),
         "deepest_discoveries_in_physics": clean(pdf("Physics")),
         "stories_of_science_and_true_false": clean(pdf("Assets - DK - Physics")),
         "lever_balancing_act": clean(pdf("Simple Machines - Lever - Phet - Balancing Act_Game")),
         "genetics_and_gender": clean(pdf("Genetics & Gender"))}
save("notes", notes)

# 5. Evolution picture book: species ladder and body systems
species = []
for r in sheet("Evolution Picture Book", "Species full list with year and")[1:]:
    if r and r[0]:
        keys = ["name", "year", "parent", "features", "drivers", "lost", "innovations", "capabilities", "subspecies"]
        species.append({k: clean(v) for k, v in zip(keys, r) if v})
systems = {}
for nm in ("Sheet12", "Sheet13", "Sheet14"):
    rows = sheet("Evolution Picture Book", nm)
    head = [clean(h) for h in rows[0]]
    for r in rows[1:]:
        if r and r[0]:
            name = re.sub(r"^\d+\.\s*", "", clean(r[0]))
            systems.setdefault(name, {}).update({h: clean(c) for h, c in zip(head[1:], r[1:]) if c and h})
detail = {}
for r in sheet("Evolution Picture Book", "Detailed features, innvotaions ")[1:]:
    if r and r[0]:
        keys = ["when", "innovations", "features", "pressures", "lost"]
        detail[re.sub(r"^\d+\.\s*", "", clean(r[0]))] = {k: clean(v) for k, v in zip(keys, r[1:]) if v}
pages = []
for r in sheet("Evolution Picture Book", "Flowchart & Timeline - 1"):
    if r and r[0] and len(r) > 1 and r[1]:
        keys = ["when", "page", "art", "caption", "more"]
        pages.append({k: clean(v) for k, v in zip(keys, r) if v})
intro = clean(sheet("Evolution Picture Book", "Introduction")[4][1])
save("evolution", {"intro": intro, "pages": pages, "species": species, "systems": systems, "detail": detail})

# RNA's story of life (picture book text, narrated by RNA)
rna = clean(pdf("RNA"))
book, cur = [], None
for line in rna.split("\n"):
    m = re.match(r"\s*Page\s+(.*)", line)
    if m:
        cur = {"page": m.group(1).strip(" -"), "text": ""}
        book.append(cur)
    elif cur is not None:
        cur["text"] += line + "\n"
for p in book:
    p["text"] = clean(p["text"])
save("rna_story", book)

# 6. Journal, games, world, curriculum lists
jp = []
for r in sheet("Guided Journals For Kids", "Science Journal 6-9 Ages")[1:]:
    if r and r[0] and len(r) > 1 and r[1]:
        jp.append({"page": r[0].replace(".0", ""), "content": r[1], "todo": r[2] if len(r) > 2 else "",
                   "concept": r[3] if len(r) > 3 else "", "also": r[5] if len(r) > 5 else ""})
save("journal_pages", jp)


def text_of(book, name):
    return "\n".join(" | ".join(c for c in r if c) for r in sheet(book, name) if any(r))


games = {"storyboarding_game": clean(pdf("Storyboarding Game")),
         "directors_dilemma": clean("\n\n".join(text_of("Director's Dilemma", s) for s in ("Sheet1", "Sheet2", "Sheet3"))),
         "history_board_game": clean("\n\n".join(text_of("History Board Game", s) for s in ("Game Play Mechanics", "Mhajanapadas empires & capitals"))),
         "game_types_universe": clean(text_of("DeepKids HomeSchooling Track", "Game Types Universe")),
         "game_play_components": clean(text_of("DeepKids HomeSchooling Track", "Game Play Components")),
         "gameplay_archetypes": clean(text_of("DeepKids HomeSchooling Track", "GamePlay Archetypes")),
         "learning_modes": clean(text_of("DeepKids HomeSchooling Track", "Learning Modes")),
         "gravity_board": clean(text_of("DeepKids - Science - Grade Concepts", "Gravity Board")),
         "escape_gravity_social_and_browser_games": clean(text_of("Content Calendar", "Campaigns"))}
save("games", games)

weeks = []
for r in sheet("DeepKids V0.1", "Activities Final")[1:]:
    if r and r[0] and len(r) > 1:
        keys = ["week", "title", "activities", "execution", "kit", "kit_material", "story", "links"]
        weeks.append({k: clean(v) for k, v in zip(keys, r) if v})
save("activity_weeks", weeks)

world = {"deep_kids_pitch_and_weeks": clean(pdf("Deep Kids")),
         "i_am_world": clean(pdf("I Am World Building")),
         "curriculum_english_and_more": clean(pdf("DK HST Curriculum")),
         "deepkids_universe": clean(text_of("DeepKids HomeSchooling Track", "DeepKids Universe")),
         "principles": clean(text_of("DeepKids V0.1", "Principles,Models")),
         "art_curriculum_ideas": clean(text_of("DeepKids V0.1", "Art Curriculum Ideas")),
         "art_philosophy": clean(text_of("DeepKids V0.1", "Art Philosophy")),
         "realisations": clean(text_of("DeepKids V0.1", "Realisations to pass on")),
         "content_ideas": clean(text_of("Content Calendar", "Campaigns")),
         "thoughts_dont_need_neurons": clean(text_of("Content Calendar", "Sheet3")),
         "maths_universe": clean(text_of("DeepKids HomeSchooling Track", "Maths")),
         "chemistry_universe": clean(text_of("DeepKids HomeSchooling Track", "Chemistry")),
         "philosophy_universe": clean(text_of("DeepKids HomeSchooling Track", "Philosophy")),
         "history_ideas": clean(text_of("DeepKids HomeSchooling Track", "History")),
         "physics_delivery_ideas": clean(text_of("DeepKids HomeSchooling Track", "Physics")),
         "physics_topic_notes": clean(text_of("DeepKids HomeSchooling Track", "Physics Dump")),
         "subcontinent_history": clean(text_of("DeepKids HomeSchooling Track", "History of Our Sub Continent & ")),
         "stem_websites": clean(text_of("DeepKids HomeSchooling Track", "STEM Activities websites")),
         "activity_curation": clean(text_of("DeepKids HomeSchooling Track", "Activity Curation"))}
save("world", world)
