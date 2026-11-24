# Card: worksheets and quiz

Read `app/content/WRITER_BRIEF.md` first. This card covers `worksheets`, `quiz` and the questions inside steps (`check`). Full playtest rules: `app/content/units/PLAYTEST.md`.

## What they hold
- **Worksheet:** `{id, title, tier, mins, items}`. Tiers: `core`, `stretch`, `challenge`. 15 or more items each (10 for Levels 1 and 2).
- **Quiz:** 10 or more items, mostly `mcq`, each tagged with an `outcome` index. A wrong answer adds the lesson to the refresher list.
- **Item types:** `mcq`, `fill`, `match`, `sort`, `truefalse`, `order`, `write`, `draw`, `label`, `forces`, `count`, `odd`, `perspective`. Every item has `a` (answer) and `why` (explanation in the key).

## Rules
- **Questions test ideas, never the book.** A child who understood but never read the story must be able to answer. Never ask a character's name, what happened in the story, or which test was done in the lesson. A name may set up a new situation.
- **A question reads in one go.** One idea, 20 words or fewer. Say what to do: "Which one…?", "True or false:", "Put these in order:". Options are 8 words or fewer. No spot-the-mistake puzzle wrapped in a character: write the claim and ask "True or false?".
- **Wrong answers that teach.** Every wrong option comes from a real misconception. The `why` says what that wrong answer means and what to try next.
- **Answers show the working.** "3 times. The shoe stayed on until 12 cm and the sock slid at 4 cm. 12 ÷ 4 = 3."
- **Mix the forms.** At most 40% of a sheet is one kind. At least 3 thinking questions (`write`, `perspective`, `draw`, `label`) on every sheet.
- **At least one `perspective` item** (pick a side): 2 or 3 `views` and an `ask`. No view is marked the "right" one when scientists still disagree. The `why` explains each side.
- **Open questions are allowed.** A `write` item may have no single answer. Its `a` then lists what a good answer includes.
- **Ask every question once** in the whole lesson. No repeats between sheets and the quiz.
- **Truthful.** Never use "five senses" or "just a theory" in a question or an option, even to mark it wrong. A true/false about it says what is true.
- **Not only measuring.** At most half the maths problems read or add up measurements.
- **Sorting, matching, ordering:** list things one to a line. An answer gives one point to a line, then one plain sentence of why. Do not print the order already correct.
- **A chart needs its experiment.** A results chart sets `how` (the experiment id) or `show`, so the reader sees how the numbers were made.
- **Quiz covers every outcome.** At least one item per outcome.
- **A name in a question** is introduced at first mention ("Kavya, a girl in your class…") or replaced ("A friend says…"). Pronouns match the person. Mostly women and girls.

## Common mistakes
- "Who was in Bela's family?" (asks about the book).
- Options that are long sentences.
- 12 `mcq` out of 15 items.
- A `perspective` item with a marked right side on a live debate.
- An `mcq` whose answer number is outside the options.
- A quiz item with no `outcome`.

## What the validator checks
Item count; item types; `a` and `why`; mcq answer in range; mixed forms; 3 or more thinking questions per sheet; at least one `perspective` with 2 to 3 views and an `ask`; repeated questions; quiz `outcome` present, in range, and every outcome covered (to do); long questions or options (to do); `how` points at a real experiment; results chart needs `how` or `show`; "five senses"/"just a theory" (error).
