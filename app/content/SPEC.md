# DeepKids chapter pack format

One JSON file per chapter or unit:
`app/content/<board>/<subj>-L<level>-<nn>.json`, for example `ncert/sci-L3-04.json`.
Check every file with `python3 app/build/validate_pack.py <file>`.

The app reads each pack. It shows the day plan on the Today screen, one day per learning session. The chapter page shows everything else.

## Who reads it

A parent homeschooling one child in India, aged 6–10. The parent may not be a science or maths person. Write to the parent ("Ask your child…", "Show them…"), in plain, warm English. Use Indian names, places, food, money (₹) and household things. English only. Hindi, Tamil or Sanskrit words are fine as names or terms, with their meaning.

Never dumb the substance down. Keep the real idea, the real word and the real mechanism, and explain it simply.

## Fields

```jsonc
{
  "key": "ncert|sci|3|4",          // board|subj|level|n — given to you, copy exactly
  "board": "ncert", "subj": "sci", "level": 3, "n": 4,
  "title": "Getting to Know Plants",
  "source": "NCERT Our Wondrous World, Class 3, Chapter 4 (pages 47–61)",
  "summary": "2–3 sentences: what this chapter teaches.",
  "goals": ["By the end your child can …", "…"],          // 3–6
  "words": [["root", "the part under the ground that holds the plant and drinks water"]], // 5–12 key words
  "day_mins": 40,                   // planned minutes per day (see Day length)
  "days": [                         // the heart of the pack: what to do each day, exactly
    {
      "n": 1,
      "title": "Plants all around us",
      "goal": "One sentence: what today is for.",
      "steps": [
        {
          "kind": "warmup|read|talk|do|exp|act|ws|game|think|watch|outdoor|review|check",
          "title": "Short title",
          "mins": 10,
          "do": "Exact instructions for the parent. Name the pages ('Read pages 48–50 aloud, the story of Neha's garden'). Give the questions to ask AND good answers to listen for. Say what to point at, what to draw and what to say if the child is stuck.",
          "ref": "e1"               // optional: id of a worksheet, experiment, activity or voice used in this step
        }
      ],
      "need": ["10 moong seeds", "4 small cups"],   // things needed today (empty list if none)
      "prep": [{"task": "Soak 10 moong seeds in water", "when": "night before"}]  // optional; when = "night before" | "2 days before" | "morning" | "1 week before"
    }
  ],
  "worksheets": [                   // 3 tiers: core (everyone), stretch, challenge
    {"id": "ws1", "tier": "core|stretch|challenge", "title": "…", "day": 3,
     "sections": [["A. Parts and jobs", [ /* items, see below */ ]]]}
  ],
  "experiments": [
    {"id": "e1", "title": "…", "day": 2, "question": "What are we finding out?",
     "need": ["…"], "steps": ["…"], "predict": "Ask your child to guess first: …",
     "observe": "What to look for and record", "why": "The science behind the result, explained properly",
     "safety": "… or empty string", "time": "20 min + check after 2 days"}
  ],
  "activities": [
    {"id": "a1", "title": "…", "day": 4, "mins": 30, "need": ["…"], "steps": ["…"], "outcome": "What you end up with"}
  ],
  "voices": [                       // other scientists and challenging perspectives, see below
    {"id": "v1", "who": "Jagadish Chandra Bose (1858–1937), India",
     "idea": "What they said or found, accurately.",
     "then": "How other scientists reacted at the time.",
     "now": "Where the evidence stands today, honestly.",
     "status": "accepted|debated|minority|rejected",
     "ask": "A question to discuss with your child.",
     "day": 5}
  ],
  "check": [                        // 5–8 end-of-chapter questions, said aloud or written; for the last day
    {"q": "…", "a": "…"}
  ]
}
```

### Worksheet items

These match the app's worksheet player:

| t | fields | notes |
|---|---|---|
| `draw` | `p` | a drawing or labelling task |
| `write` | `p`, `lines` | open answer; lines 1–6 |
| `fill` | `p` (use `____`), `a` (list of accepted answers) | |
| `mcq` | `p`, `opts` (list), `a` (index of correct option) | |
| `match` | `p`, `pairs` (list of [left, right]) | |
| `sort` | `p`, `items` (list), `cats` (list) | |
| `table` | `p`, `cols` (list), `rows` (int), optional `prefill` (list, first column) | |
| `forces` | `p`, `obj` (what the diagram is of), `options` (force names to choose from), `a` (list of {"name", "dir": up/down/left/right, "size": "big"/"small"/"equal", optional}) | the child builds the force diagram in the app (choose each force and its direction); the app checks it, no AI |

- Each worksheet has 2–4 sections and 6–14 items. Combined worksheets have at least 8 items, and at least 2 of them ask the child to reason in writing ("why", "what if", "how could you test"). Prefer items the app can check (mcq, fill, match, sort, forces); keep drawing for things only a drawing can show.
- **core:** checks the chapter's main ideas.
- **stretch:** applies them to new cases.
- **challenge:** harder thinking, puzzles, "what if", and comparing views.

## Day length and number of days

| Level | Minutes per day (`day_mins`) |
|---|---|
| 1 | 30 |
| 2 | 35 |
| 3 | 40 |
| 4 | 45 |
| 5 | 45 |

- A day's step minutes must add up to within 5 of `day_mins`.
- **Number of days:** NCERT chapter 7–12, Cambridge unit 7–16 (about 2–3 days per topic), NIOS lesson 4–10.
- **Shape of a chapter:**
  - Day 1 opens with a hook from the child's own life.
  - Middle days cover the content in book order, each with something hands-on.
  - Experiments, activities, worksheets and voices are spread across the days, never all on one day.
  - The last day is review and `check`, ending with "teach it back".
  - Experiments that need waiting (seeds growing, things rotting) start early and get short "check on it" steps on later days.
- **Never write a vague step** like "read the chapter", "continue the chapter" or "do the activities". Every step says exactly which pages, which questions and which thing to do.

## Voices (other scientists and challenging perspectives)

- **How many:** 2–4 per chapter for science and environment. Mix three kinds:
  - **Underdogs who were right:** dismissed at first, later accepted. For example: Ignaz Semmelweis on handwashing, Alfred Wegener on moving continents, Barbara McClintock, Lynn Margulis, J.C. Bose on plant responses, Janaki Ammal, Anna Mani, Rachel Carson, Barry Marshall and Robin Warren.
  - **Live debates today:** for example, plant "intelligence" (Monica Gagliano and her critics), the "wood-wide web" (Suzanne Simard, and the 2023 critique by Justine Karst and colleagues).
  - **Indian scientists and knowledge traditions:** for example, Sushruta, Charaka, Aryabhata, Salim Ali, C.V. Raman, Kamala Sohonie, Birbal Sahni. Use them where they genuinely fit.
- **Be accurate.** Use real people, real dates and what they actually claimed. If you are not sure of a fact, leave it out.
- **Label it honestly.** `status` says where the evidence stands. Never present a rejected or fringe claim as true. "minority" means some qualified scientists hold it but most don't. "rejected" means the evidence went against it. Include rejected ideas only when they teach something, such as how science corrects itself.
- **Make the child think.** The `ask` question should help the child weigh evidence ("What would you need to see to believe…?"), not just repeat facts.
- **Use it.** At least one day step must use each voice (`ref`).

## Using the book

- Follow the chapter's own order, stories, characters and activities, and cite page numbers wherever you can see them.
- Keep the book's own activities (tell the parent which page) and add our own beside them.
- If you can't see the book's text for part of a unit (scanned pages), build that part from the unit and topic titles. Mark the source "Learner's Book pages X–Y" using the contents page numbers.

## The DeepKids way (applies to every pack, book, story and subject)

The DeepKids track (see `TRACKS.md`) aims to be the deepest thing a child aged 6–10 can meet. Nothing is too big. Only the delivery is tuned for children: concrete before abstract, story and hands before words, the child's own life before the far away. Never water an idea down; find the way in.

1. **Big ideas, not just parts.** Labelling a flower is a tool, never the goal. Every rung must reach at least one idea that changes how the child sees the world (a tree is built mostly from air; you can't push anything without being pushed back; there is no "away" to throw things to).
2. **What we don't know.** Every rung names real open questions: things scientists or mathematicians are still unsure of or arguing about, said honestly ("Nobody knows yet"). Children should leave knowing science is unfinished and that they could finish it.
3. **Debates and other views.** Real disagreements between real people, with the evidence on each side, and a verdict left to the child when the evidence is not settled.
4. **Oneness.** Show how things are connected: matter cycling through stars, rocks, plants and us; every living thing related; the breath we share with trees. Use evidence, not slogans.
5. **Question human-centredness.** Look from other beings' points of view. Humans are one species among millions and recent arrivals. Ask what a river, an ant or a fungus would say. Notice words like "weed", "pest" and "useful" that judge everything by what it does for us.
6. **The quiet social lens.** Never preach, and never name an "-ism". Let it come out of the science and maths itself, as questions:
   - **Who did it, and who got the credit?** Women, workers, farmers, healers and people from colonised countries who made knowledge but were left out of the story (Janaki Ammal, Anna Mani, Rosalind Franklin, Emmy Noether, the farmers who bred our crops, the women who carry loads).
   - **Cooperation as well as competition.** Nature runs on both (symbiosis, mycorrhiza, lichens, matriarch-led elephant herds), so "survival of the strongest" is not the whole story.
   - **Shared or owned?** Commons, seeds saved and swapped, sacred groves, water, air. What has a price, and what is precious but has none? Who decides, and who benefits?
   - **Is more, faster or bigger always better?** Limits, enough, balance, cycles.
   Always present the honest evidence and more than one view. The child reasons; we never hand them a conclusion.
7. **Question the evidence too.** Evidence is made by people. Ask who collected it, who paid for it, what was measured and what was left out, whose knowledge was never written down, and who was not allowed in the room. A finding can be accurate and still tell only part of the story. Children should learn to ask "Says who? How do they know? Who's missing?" of every claim, including ours.
8. **Credit: we take the side of the women and the underdogs.** When it is disputed who deserves credit for a discovery or an invention, we lead with the woman's or the underdog's case, give her or them the benefit of the doubt, and say plainly that the record was often kept by the powerful (who owned the notebooks, who was published, who was allowed to join). Name the people the usual story leaves out: the assistant, the wife, the technician, the farmer, the colonised scholar, the community whose knowledge was taken. We never state as fact something the evidence clearly contradicts; the true stories are strong enough, and a child who finds one bent story will stop trusting the rest.
9. **Accuracy.** Real people, dates and findings only. Mark what is settled, debated and unknown. No fringe claims presented as true.
10. **Kids are without bias and deep (the founder's premise).** Children intuitively grasp the deepest ideas. School and society train everyone to think in categories, which makes the brain efficient but closes the window on the infinite. DeepKids keeps the child from losing the child, and gives them space to think beyond categories (draw ten houses, each unique; something good that is bad; something right that is wrong). Learning is exploration and seeking, not accumulating and being validated. Questions to keep alive in every subject: Who am I? What is life? What is this world? What is real?
11. **Beyond adjectives and identities.** We are never only "kind" or "clever" or "naughty". We are all of these in different moments, and free to choose again each moment. Avoid praise and labels that freeze a child into an identity. Ask what they noticed and what they would choose. This applies to how we describe scientists too: real people, contradictory and changing (Newton was brilliant and also hoarded credit; Tesla was visionary and also left unpaid bills).
12. **The founder's lens on science** (from the DeepKids notebook, `app/content/ideas/`). Use it as a source of deep questions. It is one way of seeing, offered next to others, never presented as settled science.
    - **Order and chaos.** Stars, cells, beings, languages and maths are "pockets of order" in a sea of chaos. Every order made somewhere makes more disorder around it (entropy), and the whole balances out.
    - **Function comes before form.** Single cells sense, decide and remember without a brain. Neurons are hardware that evolved later to do it faster, so "Does thinking need a brain?" is a real question.
    - **A sense of self runs through all life.** It starts with the first RNA and cell membranes (keeping the self in, the other out: the root of immunity). It continues in a bacterium's map of its own body, and in every creature's sense of safe and unsafe.
    - **Humans are not special in kind.** Humans share almost everything with other beings. What may be unique is mistaking the lens of identity (ego) for the whole truth. This is a question, not a verdict, and there are counterpoints: cyanobacteria changed the whole atmosphere long before us.
    - **Inside equals outside.** We are made by the world and we change it by perceiving and acting.
    - **Old Indian thought as one voice among many.** Gurutva, the tattva behind the stories, Shiva-Shakti as one-in-two. Credit it honestly and do not inflate it (see ACCURACY.md).
13. **Rooted in oneness and consciousness.** Every pack, chapter and unit connects its science or maths to specific philosophy and spirituality, tied to the three questions: who am I, what is this life, what is this world. Zero, which is also infinity, then One, then the many. See `PHILOSOPHY.md` for the view, the honesty rules and the library of teachings. New packs add a `roots` block.
14. **Every art form is a way in.** For each concept, offer experiments, home and outdoor activities, dance, drama, painting, music, yoga or breath, games, reading, writing, craft and something made together (the notebook's concept activity bank has all of these). A child who dances a spiral of rising heat, or acts out air arguing with water about who controls the weather, understands it differently from one who only reads about it.

## Stories

Every chapter, rung and Mission book has a story (`story`), read aloud by the parent in 6–12 minutes.

- **Literary and moving, not a lesson in costume.** Real characters with feelings, a setting the child can see and smell (Indian when it fits, but anywhere in the world or time), something at stake, and a turn.
- **A hidden epiphany.** The concept is the key to the story's turn, so that when the child gets the story they get the idea. Never explain the moral at the end; let the parent's questions draw it out.
- **Depth.** Stories may hold loss, unfairness, wonder, patience, being small in a big universe, kindness across species. Handle them gently, never scarily, for ages 6–10.

```jsonc
"story": {"title": "…", "text": ["paragraph", "…"],      // 500–1200 words
          "epiphany": "For the parent: the idea hidden in the story and where it turns.",
          "ask": ["3–5 questions to talk about after reading"]},
"ideas": [{"idea": "A big idea, said simply", "more": "How to show or explain it"}],   // 2–4
"unknowns": ["An open question nobody has answered yet, honestly put"]                 // 2–4
```

## Combined topics (`app/content/combined/`)

The Combined syllabus teaches every topic from NCERT, Cambridge and NIOS once, at the earliest class any board teaches it, and comes back to it, deeper, at every later class where another board teaches it. Each of these is a **rung**: one topic at one class. The list of rungs and the board subtopics each one must cover is in `app/build/combined/sci_universe.json` (built by `universe.py` from the concept map).

One file per rung: `combined/<subj>-C<class>-<topic id>.json`, key `combined|<subj>|<class>|<topic id>`, `board` "combined", `n` the topic id.

- **No textbook needed.** Never cite book pages. The `source` names the board subtopics covered and says "No textbook needed".
- **Cover every board subtopic** listed for the rung in `sci_universe.json`, so the child is ready for any board in that class.
- **Days:** 4–10. Same day lengths as above.
- **Climb the ladder:** each rung starts by recalling the rung below in one short warm-up, then goes further. Don't repeat the earlier rung's activities.

Extra fields, all required (plus `story`, `ideas` and `unknowns` above):

- `subconcepts`: 6–15 short phrases naming every concept the rung actually teaches (e.g. "balanced and unbalanced forces", "friction makes heat", "the newton"). Go wide: include the board subtopics and the ideas around them that a curious child should meet. Every subconcept must be taught in a day step.

```jsonc
"builds_on": "What earlier classes did, and what later classes will do.",
"project": {"title": "…", "days": [5, 6], "steps": ["…"], "outcome": "…"},
"game": {"id": "g1", "title": "…", "kind": "board|cards", "players": "2–4", "need": ["a die"], "rules": ["…"],
         "squares": ["START", "…", "HOME"],              // board: 12–30 squares
         "cards": [{"front": "…", "back": "answer"}, {"job": true, "front": "CATEGORY"}]},  // cards: 12–48
"big": ["3–6 big questions with no single right answer"],
"challenge": [{"q": "A famous story or common belief, questioned", "hint": "What the evidence actually says, and a question to think about"}],  // 2–4
"perspectives": [{"who": "a person, job or tradition", "view": "how they see or use this, and a question"}],
"books": [{"title": "…", "author": "…", "for": "read alone|read together|parent reads", "age": "5–8", "why": "…"}]  // 2–6
```

- **Games are printed** on one A4 page and played at home. The game must be used in a day step (`ref`).
- **Challenges** question popular stories and beliefs with evidence (Newton's apple, Archimedes' bath), never with fringe claims. The hint says honestly what is known and what isn't.
- **Books:** only real books you are sure exist, with the right author. Adult books are fine if a parent can read parts aloud; say so in `age`. The app links each to an amazon.in search, so no shop link is needed.
