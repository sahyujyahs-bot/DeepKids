# Brief for writing one subtopic-level unit

You are writing one DeepKids unit for Indian homeschooling families with children aged 6–10. It is shown in the app as a map of parts and a scrollable feed of cards. A tired parent follows it step by step, or the child follows it alone.

## Read first, fully, in this order
1. `app/content/WRITING.md`: the writing rules. They are not optional. Every card must make sense on its own, with a `context` line, and every number gets a `chart`.
2. `app/content/units/SPEC_UNIT.md`: the format, the two modes (parent `say`/`do`, child `kid`), the teaching method (notice first, try before we explain, claim-evidence-reasoning after every experiment, misconception-based wrong options), and "Depth: follow the idea all the way out".
3. The finished example, which is your bar: `app/content/units/sci/sci.forces.friction.L3.json` (Friction, Class 3). Match its depth, breadth and structure. Do not copy its content.
4. Your subtopic's entry in `app/content/curriculum/sci.json` (`subtopic_levels`, find your id): `covers`, board chapters, prerequisites, go-deep and go-wide links. Cover everything in `covers`.
5. The founder's notes: `app/content/ideas/by_topic/<topic>.md` for your topic, and the founder's sheets dumped at `/tmp/claude-0/-home-user/19592352-17e5-5d4c-8f59-ec21b7793c21/scratchpad/sheets_dump.txt` (search it for your subtopic's words). Use the founder's activities and ideas first, then add many more. List what you used in `sources.founder`.
6. `knowledge/by_subtopic.json` for open-textbook sections on your subtopic, for accuracy. Licence rule: books marked `reference` or `share-alike` are for facts only; never copy their text.
7. Board packs for your chapters (keys in the curriculum) in `app/content/ncert/`, `app/content/cambridge/`, `app/content/nios/`, for coverage only.

## The bar
- All elements in SPEC_UNIT.md, validated by `python3 app/build/validate_unit.py <your file>` (must print OK).
- **Deep:** follow the idea out to atoms and energy, the Earth and the cosmos, living bodies, and what nobody knows yet, honestly marked `idea` or `debated`. The founder's Gravity chapter goes all the way to spacetime and gravitons; children find these ideas intuitive, so do not avoid them.
- **Life and philosophy:** big questions that connect the science to life, fairness and how we know things. Credit to women and underdogs where the evidence supports it.
- **Original story:** 600–1300 words, literary, the concept hidden as the key to the turn. Real history is welcome; mark what is imagined in `note`. Do not reuse the water-pourer story or themes listed in `app/content/combined/BRIEF.md`.
- **Accuracy:** real people, dates, books and findings only. If unsure, leave it out. Put the papers behind surprising claims in `sources.science`.
- **Videos:** exactly 3. Only use a YouTube id you are sure of; otherwise `"youtube": ""` with `"status": "find-id"` and an honest `check` note.
- **Links and buy:** real sites only (homepages or amazon.in search URLs like the example). Places in India with the city.
- **Song:** `{"topic_level": "<your topic-level id>", "title": "Push, Pull, Hold On", "note": "Topic-level song for Forces L3"}`. No lyrics needed.
- **Art briefs:** every `art` field is a one-sentence picture description (pictures are made later). Charts are data, as in WRITING.md.
- **Safety:** home-safe with a grown-up; mark `"adult": true` on steps that need one.

## Files
- Write only `app/content/units/sci/<your id>.json`. Then run `python3 app/build/unit_to_md.py app/content/units/sci/<your id>.json app/content/units/sci/<your id>.md`.
- Do not run git, do not touch the app build or anyone else's files.
- Reply with: file written, title, number of parts, story title, charts added, and anything you were unsure of.
