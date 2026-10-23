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

- Each worksheet has 2–4 sections and 6–14 items.
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

## Combined topics (`app/content/combined/`)

The Combined syllabus teaches every topic from NCERT, Cambridge and NIOS once, at the earliest class any board teaches it, and comes back to it, deeper, at every later class where another board teaches it. Each of these is a **rung**: one topic at one class. The list of rungs and the board subtopics each one must cover is in `app/build/combined/sci_universe.json` (built by `universe.py` from the concept map).

One file per rung: `combined/<subj>-C<class>-<topic id>.json`, key `combined|<subj>|<class>|<topic id>`, `board` "combined", `n` the topic id.

- **No textbook needed.** Never cite book pages. The `source` names the board subtopics covered and says "No textbook needed".
- **Cover every board subtopic** listed for the rung in `sci_universe.json`, so the child is ready for any board in that class.
- **Days:** 4–10. Same day lengths as above.
- **Climb the ladder:** each rung starts by recalling the rung below in one short warm-up, then goes further. Don't repeat the earlier rung's activities.

Extra fields, all required:

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
