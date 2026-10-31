# The subtopic-level unit (the DeepKids track)

The two tracks, and how units fit into them, are in `app/content/TRACKS.md`.

One file per subtopic-level: `app/content/units/<subject>/<id>.json`, e.g. `sci/sci.forces.friction.L3.json`.
The unit's **mapping** (topic-level, class, board chapters, prerequisites, go deep, go wide, maths links,
the founder's notebook items, open-textbook sections) comes from `app/content/curriculum/<subject>.json` and
`knowledge/by_subtopic.json`. It is merged in by the build and is never typed by hand.
Check a unit with `python3 app/build/validate_unit.py <file>`.

Everything follows `app/content/SPEC.md` ("The DeepKids way": big ideas, honest unknowns, debates, oneness,
the quiet social lens, credit to women and underdogs, accuracy).

## Depth: follow the idea all the way out
Like the founder's Gravity chapter (which runs from jumping and Jenga to spacetime, lensing, time dilation and gravitons), every unit
follows its idea from the child's hands out to the frontier: atoms and electrons, energy and heat, quantum physics, the Earth and the
cosmos, living bodies, and what nobody knows yet. Children find these ideas intuitive; we do not avoid them for age, we tell them simply
and honestly (marking `idea` and `debated` where science is unsure). Each unit also links to life and philosophy (`big_questions`), and is rooted in oneness and consciousness (`roots`, see `app/content/PHILOSOPHY.md`): every pursuit asks who am I, what is this life, what is this world.

**Founder sources, read for every unit:** `app/content/ideas/by_topic/<topic>.md`, and the founder's sheets on the main branch:
DeepKids HomeSchooling Track (Physics activities dump, Physics, Physics Dump, Biology, Chemistry, History, Philosophy, STEM Activities
websites, useful links, Activity Curation, Game Types Universe) and DeepKids V0.1 (Activities Final, Activities, Curriculum Content,
Activity Box, Other kids ideas, reading material). Use their activities, links and ideas first, then add many more. List what was used in
`sources.founder`, and the papers behind surprising claims in `sources.science`.

## How a unit teaches (method)
Adapted from Anthropic's open K-12 teacher skills (github.com/anthropics/k12-teacher-skills, Apache 2.0) and common learning-science practice.
- **Something to notice first.** Open with a real thing to see or do (the phenomenon), not an explanation: "What do you notice? What do you wonder?"
- **Try it before we explain it.** Hands-on investigation comes before the explanation cards, so the explanation answers a question the child already has.
- **Claim, evidence, reasoning.** After each experiment the child says (Class 1–2) or writes (Class 3–5): what I think (claim), what I saw (evidence), why (reasoning).
- **Models are drawings that explain.** Children draw what they think is happening, including the parts they can't see.
- **Wrong answers that teach.** Quiz and check options come from real misconceptions children have. The answer explanation says what that wrong answer means and what to try next.
- **Small checks, often.** Each flow has one or two quick checks; the end-of-unit quiz is not the only check.
- **Asset-based words.** Never "weak", "behind", "can't". Say exactly what the child does: "counts the marks but not their size".
- **Realistic time.** Each part's minutes must be doable by a real family; don't overload a day.
- **Every card has a visual and its own context** (see `app/content/WRITING.md`).

## Shared building blocks

**Two ways to follow every flow.** A unit is taught either by a **parent following the app step by step**, or by the **child following the app alone**. The family picks the mode when starting, and can switch at any step. So every step is written twice:
- **Parent mode** shows `do`, `say` (the parent's words), `ask` (with good answers) and `parent` (set-up and what to look for).
- **Child mode** shows `kid`: the same step spoken to the child, in short sentences a 6–10 year old can read (and the app reads aloud). Questions come as taps (`check`) or "say it out loud / draw it" prompts. Anything unsafe for a child alone (heat, sharp tools, chemicals, going outside) is marked `"adult": true`; the app then asks the child to fetch a grown-up first.

**Step** is one click in an app flow. Every hand-held flow (game, project, experiment, activity, challenge) is a list of steps:
```jsonc
{"id": "s1", "mins": 3,
 "do": "What to do, exactly",
 "say": "Parent mode: what the parent says, word for word",
 "kid": "Child mode: the same step spoken to the child, simple words",
 "adult": false,                                                     // true = a grown-up must be there for this step
 "ask": [{"q": "Question to ask", "good": ["answers that show understanding"]}],
 "parent": "Note for the parent only (set-up, safety, what to look for)",
 "think": "A question to leave the child with (optional)",
 "check": {"t": "mcq", "q": "...", "options": ["..."], "a": 1},   // optional; a wrong answer goes to the refresher list
 "wait": "Leave it for 2 days" }                                     // optional; makes the step a later day's task
```
**Card** is a flashcard (elements 1–8 and terms). The app shows cards as a flow, and they print 8 to an A4 page:
`{"front": "...", "back": "...", "art": "what the illustration shows"}`.
`art` is an illustration brief: an illustrator or an image model draws from it, and the app shows it once drawn.

**Item** is a worksheet or quiz question, with the item types of SPEC.md "Worksheet items" (mcq, fill, match, sort,
truefalse, order, write, draw, label, forces, ...). Every item has `a` (answer) and `why` (the explanation in the key),
and may have `art`.

**Duration** is `mins` on every element and step. The planner uses these to cut the unit into days.

## The elements

| # | Key | What it holds | Notes |
|---|---|---|---|
| 1 | `summary` | `{text, art}`: the whole unit in 3–5 sentences | card |
| 2 | `intro` | `{hook, text, art}`: a 2-minute way in (a puzzle, an object, a surprise) | card |
| 3 | `outcomes` | `["By the end I can ..."]`, 4–8 | the quiz and worksheets tag their items to these |
| 4 | `terms` | `[{term, meaning, example, art}]` | flashcards, also printable |
| 5 | `explanations` | `[{concept, status, definition, description, examples[], perspectives:[{who, explanation}], art}]` | `status`: `defined` (an agreed definition exists), `idea` (we only have ideas, say so), `debated` (give every explanation in `perspectives`) |
| 6 | `agreed` | `[{text, evidence}]`: what most scientists agree on, and how we know | card |
| 7 | `challenging` | `[{claim, who, for, against, status}]`: views that challenge the usual story | `status`: accepted / debated / minority / rejected |
| 8 | `big_questions` | `[{q, kind, hint}]`: `kind` is `deep` (goes down into the idea) or `big` (goes out to life and the universe); open-ended | card |
| 0 | `story` | `{title, text[], epiphany, ask[], art[], read_aloud: true}` | as in SPEC.md "Stories"; the app reads it aloud |
| 9 | `games` | `[{id, title, mins, players, printables:[{kind, title, items}], rules[], flow:[step]}]` | `printables.kind`: cards, board, tokens, score sheet. An item is text, or `{f, b}` for a card with something on the back (an answer, a size, a number): it prints as a page of fronts and a mirrored page of backs. A card may carry a picture for its front: `{f, img}`, or `{f, b, img}` when two-sided; `img: {src, credit}`, the file in `app/content/media/cards/`, public domain, CC0 or CC BY only, credited. Pictures for the player's cards (terms, explanations, set-up steps, experiments) go in `<unit id>.art.json` as `{key: {src, credit}}`. `app/build/free_images.py` finds free pictures on Wikimedia Commons and adds both kinds. The flow plays the printed game to the end, teaching and asking along the way |
| 10 | `worksheets` | `[{id, title, tier, mins, items:[item ≥15]}]` | tiers: core, stretch, challenge. Full answer key from `a`+`why`; the app marks app-done sheets and uploaded photos |
| 11 | `projects` | `[{id, title, days, mins, materials:[{item, qty, buy}], safety, schedule:[{day, mins, what}], flow:[step], record}]` | `days` > 1 makes the planner bring it back each day until done |
| 12 | `experiments` | same as projects, plus `{question, predict, fair_test, results_table}` | |
| 13 | `activities` | same as projects | many per unit, each with its own flow |
| 14 | `videos` | `[{title, channel, youtube, mins, why, check}]` | top 3, not necessarily made for children, accurate to the unit; `youtube` is the video id (embedded); `check` says what was verified and what to verify |
| 15 | `quiz` | `[item ≥10]`, mostly mcq, each tagged with an `outcome` | a wrong answer adds the unit to the refresher list and lowers topic-level mastery |
| 16 | `applications` | `["Where this idea is used"]` | |
| 17 | `spotted` | `[{text, art}]`: where to spot it around us, in India | |
| 18 | `open_questions` | `[{q, why_open}]`: what nobody knows yet | |
| 19 | `ask_kids` | `["Questions to ask during the day, at meals, on walks"]` | |
| 20 | `jokes` | `[{j, a}]`: 3 per day of the unit | the day's warm-up uses them |
| 21 | `maths` | `[{problem, answer, explain, math_unit}]` | `math_unit` is a maths subtopic-level id; doing the problem queues that unit next |
| 22 | `song` | `{topic_level, title}`: points to the topic-level song in `app/content/songs/` | one song per topic-level: lyrics, chords, melody (ABC notation) and an audio file |
| 23 | `challenges` | `[{id, title, problem, constraints, materials, flow:[step], general[], creative[], your_turn}]` | engineering and design problems: usual solutions, creative solutions, then the child's own |
| 24 | `links` | `[{title, url, kind, where, why}]` | `kind`: simulation, interactive, place (a museum, planetarium, park or science centre in India; `where` is the city) |
| 25 | `buy` | `[{item, kind, why, url, used_in[], plan}]` | `kind`: tool, material, book, game. `used_in` lists the element ids that use it; `plan` says how a bought book or game joins the lesson plan |
| 26 | `roots` | the philosophical and spiritual context: the three questions, the One becoming the many, 2–3 exact teachings, where science meets them, an honest other view, a short practice, open questions | format and rules in `app/content/PHILOSOPHY.md` |
| – | `how_we_found_out` | `{story, who, when, wrong_idea}`: how people really found this out, 80–200 words, including an idea people once held that turned out wrong and how it was shown wrong | card; real people and dates only |
| – | `warmup` | `[{q, a}]`: 5–10 quick questions for the cross-unit daily game series | the day starts with jokes, the song and this game |
| – | `plan` | `{start_options[], default_order[], core[], spine[]}` | see below |

## The spine (core path) and going deeper
A Class 3 year has about 135 hours of science and about 146 units, so the planner teaches each unit's **spine** by default and offers the rest as **Go deeper**.
- `plan.spine` lists the part ids taught by default, in order. It fits **2 sessions** of the class's daily minutes (Class 3: about 80–90 minutes in total).
- The spine is chosen by the DeepKids method, never by the textbook. It always holds: something to notice or do first (`intro` or a short activity), **one real investigation** (an experiment of at least 20 minutes whose result the child does not know beforehand; a demonstration or act-out does not count), the key explanation (`explanations`), `roots` (with its deep truth), and a short check (`quiz`). Add the story only if it fits.
- Every experiment's `predict` asks for a guess and the reason for it ("…and why do you think so?"). The explanation comes after the child's claim and evidence (WRITING.md rule 17).
- Board coverage is handled by which units are in the year, not by the spine. Everything not in the spine is still fully written and offered when the child is curious, when there is time, or as weekend projects.

## How the app runs a unit
- **Landing page:** everything in the unit, grouped, with a **Start** button.
- **Start:** the child or parent picks where to begin (`plan.start_options`, e.g. story, experiment, big questions, flashcards, game, project). The app then builds the flow from `plan.default_order`, starting there.
- **Days:** the planner fills each day with flow elements by their `mins`, up to the class's daily minutes. Multi-day projects and experiments put their `schedule` tasks on the right days (e.g. "Day 3: check the seeds, 5 min") until they end.
- **Coming back:** reopening the unit shows the flow list with done, current and next, and continues where the child stopped.
- **Each day starts with a warm-up:** 3 jokes and the song from the units planned that day, then the daily game series (questions drawn from every unit done so far).
- **Wrong answers** anywhere (quiz, worksheet, flow checks) add the unit to the refresher list straight away. The progress page shows topic-levels: questions wrong, which subtopics, and % mastered.
