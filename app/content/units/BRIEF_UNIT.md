# Brief for writing one subtopic-level unit

You are writing one DeepKids unit for Indian homeschooling families with children aged 6–10. It is shown in the app as a map of parts and a scrollable feed of cards. A tired parent follows it step by step, or the child follows it alone.

## Read first, fully, in this order
1. `app/content/WRITING.md`: the writing rules. They are not optional. Every card must make sense on its own, with a `context` line. Choose each visual by what the reader needs to see (see "Visuals": step pictures for doing, charts only to compare results).
2. `app/content/PHILOSOPHY.md`: DeepKids is rooted in oneness and consciousness. Write the `roots` element exactly as it says, and let its questioning run through the big questions, challenging views and story too.
3. `app/content/units/SPEC_UNIT.md`: the format, the two modes (parent `say`/`do`, child `kid`), the teaching method (notice first, try before we explain, claim-evidence-reasoning after every experiment, misconception-based wrong options), and "Depth: follow the idea all the way out".
4. The finished examples, which are your bar: `app/content/units/sci/sci.forces.friction.L3.json` (Friction, Class 3). Read it once fully; match its depth, breadth and structure. Do not copy its content. Six sibling Forces units in the same folder follow the same pattern.
5. Your subtopic's entry in `app/content/curriculum/sci.json` (`subtopic_levels`, find your id): `covers`, board chapters, prerequisites, go-deep and go-wide links. Cover everything in `covers`.
6. The founder's notes: `app/content/ideas/by_topic/<topic>.md` for your topic, and the founder's sheets (including the column "Philosophy underlying the concepts", which feeds `roots`) dumped at `/tmp/claude-0/-home-user/19592352-17e5-5d4c-8f59-ec21b7793c21/scratchpad/sheets_dump.txt` (search it for your subtopic's words). Use the founder's activities and ideas first, then add many more. List what you used in `sources.founder`.
7. `knowledge/by_subtopic.json` for open-textbook sections on your subtopic, for accuracy. Licence rule: books marked `reference` or `share-alike` are for facts only; never copy their text.
8. Board packs for your chapters (keys in the curriculum) in `app/content/ncert/`, `app/content/cambridge/`, `app/content/nios/`, for coverage only.

9. **Existing DeepKids lessons to reuse:** the Combined lesson(s) for your topic in `app/content/combined/` (e.g. `sci-C3-<topic>.json`, and the C1–C5 rungs of the same topic) already have subconcepts, day plans, experiments, voices, stories and worksheets. Take what fits your subtopic and improve it rather than starting from zero. Credit them in `sources.founder`. Don't reuse their story.

## Rules the validator enforces (from WRITING.md and SPEC_UNIT.md)
- `setup` (2+ step pictures, scene "ramp"/"pull" or `{art, caption}`) on every game, experiment, activity, project and challenge.
- `how: "<flow id>"` on every question, maths problem or step that refers to one; results charts need `how` or `show`.
- `why` on every step `check` (what the right answer means and what a wrong pick usually means); games' checks are game moments, not tests.
- `why_maths` on every maths problem; maths must grow out of something the child did in this unit.
- `context` on every card that could be read cold.
- `roots` with all its parts (PHILOSOPHY.md), led by a `deep_truth` that grows out of this unit's science and names the habit of thinking it breaks (see the founder's SCI Cards, `ideas/scientists.json`, field `fundamental_truth_what_it_whispers`): exact sources, one honest other view, a practice, open questions never answered for the child.
- `plan.spine`: the default core path, about 2 sessions (Class 3: 80–90 minutes), chosen by our method, not the textbook: intro or a short notice activity, one hands-on flow, explanations, roots, quiz (SPEC_UNIT.md, "The spine").
- Song `topic_level` is the curriculum's topic-level id (e.g. `sci.gravity.L3`).

## The bar
- All elements in SPEC_UNIT.md, validated by `python3 app/build/validate_unit.py <your file>` (must print OK).
- **Deep:** follow the idea out to atoms and energy, the Earth and the cosmos, living bodies, and what nobody knows yet, honestly marked `idea` or `debated`. The founder's Gravity chapter goes all the way to spacetime and gravitons; children find these ideas intuitive, so do not avoid them.
- **Life and philosophy:** big questions that connect the science to life, fairness and how we know things. Credit to women and underdogs where the evidence supports it.
- **Original story:** 600–1300 words, literary, the concept hidden as the key to the turn. Real history is welcome; mark what is imagined in `note`. Do not reuse the water-pourer story or themes listed in `app/content/combined/BRIEF.md`.
- **Accuracy:** real people, dates, books and findings only. If unsure, leave it out. Put the papers behind surprising claims in `sources.science`.
- **Videos:** exactly 3. Only use a YouTube id you are sure of; otherwise `"youtube": ""` with `"status": "find-id"` and an honest `check` note.
- **Links and buy:** real sites only (homepages or amazon.in search URLs like the example). Places in India with the city.
- **Song:** `{"topic_level": "<your topic-level id>", "title": "<a title for the topic's song>", "note": "Topic-level song"}`. No lyrics needed; units of the same topic share one song title.
- **Art briefs:** every `art` field is a one-sentence picture description (pictures are made later). Charts are data, as in WRITING.md.
- **Safety:** home-safe with a grown-up; mark `"adult": true` on steps that need one.

## Files
- Write only `app/content/units/sci/<your id>.json`. Then run `python3 app/build/unit_to_md.py app/content/units/sci/<your id>.json app/content/units/sci/<your id>.md`.
- Do not run git, do not touch the app build or anyone else's files.
- Reply with: file written, title, number of parts, story title, charts added, and anything you were unsure of.

## Play-test before you finish (the founder's rule: everything must really work)
Go through every experiment, activity, game, challenge and project as if you were doing it at home today, and fix anything that fails:
- **Experiments work.** With the materials listed, at home, the result really happens and is big enough for a child to see. Name amounts, sizes, times and what to look for. If the real result is often messy (seeds that don't sprout, ice that melts too fast), say what to do then.
- **Games are playable.** Clear rules a child can follow; how to win or finish; what you need; and who can play: `players` set to one or more of `"alone"`, `"with a parent"`, `"with friends"`. A game for one child must still be fun alone.
- **Activities fit the age.** A 6–10-year-old can do each step with the help the step says (mark `"adult": true` where needed). No step assumes things most Indian homes don't have, or gives a cheap alternative.
- **Timings are honest.** Minutes match what the steps take.
Add a short `playtest` note at the top level of the unit: what you checked and anything a parent should know.
