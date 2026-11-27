# Review brief: the one thorough check of a unit

A unit is written once, carefully, then reviewed once, thoroughly, then it is done. There is no chain of checkers and rewriters. So this review is not a skim. The reviewer reads the whole unit and fixes what is wrong in the same pass.

Two things check a unit, and nothing else:
1. **The script** (`python3 app/build/validate_unit.py <file>`): counts, required parts, banned phrases, reading grade, long sentences, repeats, years with no era, view names that name nobody. It cannot judge meaning.
2. **This review**: one reviewer, who is also the editor, using the packet from `python3 app/build/review_packet.py <unit id>`. It judges everything a script cannot.

The writer uses the same tests below before handing the unit over, so the review finds little.

## Who you are

You are a tired parent. It is 7 in the evening, you worked all day, you have no science background, and little patience. You are reading this aloud to your 8-year-old, who is already half distracted. Every time you must stop and re-read a sentence, or you don't understand a heading, or the child asks "what does that mean?" and you can't answer, the unit has failed.

You are also the child's curious older friend: you notice when something is boring, when a question has an obvious answer, when a joke isn't funny, when an experiment would not work.

## How to work

1. Read the packet's section 1 (the script's findings), 2 (what the unit must cover) and 3 (the writer's notes).
2. Read the whole unit, section 4, in order, as the parent. Do not skim. Mark every place you stumble.
3. Apply the tests A to H below to every part.
4. **Fix what you can directly in the unit file**: wording, headings, order, missing context lines, repeated points, unclear questions, weak jokes, vague perspective names, years without an era, long sentences. Keep every id, keep the meaning, keep the JSON valid, use the same JSON style (`json.dumps(u, ensure_ascii=False, indent=1)`), and write plainly. Never fix by deleting depth.
5. Run `python3 app/build/validate_unit.py <file>` and fix every finding unless you can say why it is wrong. Then `python3 app/build/unit_to_md.py <json> <md>`.
6. Do not ask for another review. Decide. Report what you fixed and only what you could not fix.

What you may not do alone: change a science claim you are unsure of, invent a source, a date, a quote or a number, or add a part that needs new research. List those under "Needs the writer or the founder".

## Mistakes already found by real readers: look for these first (WRITER_BRIEF.md section E2)

Each one was found by the founder reading a finished unit, after the writer and a checker had passed it. They are listed in full, with examples, in `WRITER_BRIEF.md` section E2:
1. a heading, title or view name that names nothing
2. an idea stated in the abstract, with no scene or numbers beside it
3. assumed knowledge: a fact or word used as a reason that the reader was never told
4. a true detail with no purpose: ask "so what?" after every sentence
5. a big word instead of a fact ("more energy than there is")
6. a date with no era
7. three ideas in one sentence
8. ideas heaped into one card: one point per card, in the order a learner needs them
9. a tag (agreed, only ideas so far, scientists disagree) that does not match the card
10. a heading that gestures at something without saying it

## The tests

### A. Meaning on one reading (every sentence, heading, title, caption, option)
- Could a parent read this aloud once, and the child say "oh, I see"? If you re-read it, fix it.
- **Headings and names must carry meaning.** A card title, explanation concept, activity title, perspective name or question must tell the reader what is inside. Not "Everyday speech". A view's name names a person, a book, a school of thought, a place or a clear group.
- **No abstract sentence without a picture.** If a sentence states an idea in the abstract ("the number that the average gets closer to as the piece of time shrinks"), add a concrete example with real numbers or a real scene the child knows.
- Every science word is explained in plain words the first time, with an everyday example, then used the same way after.
- Plain punctuation, full sentences, no shorthand, no riddles, no clever images. Years before about 1500 carry CE or BCE. Units are written out.
- Reading load: paragraphs short, one idea each. If the script says a passage reads above grade 8, rewrite it.

### B. It makes the child think, and it challenges what they assumed
- Name the thing a child (or parent) probably believes before this unit. Does the unit meet that belief with evidence and let the child test it? If the unit only tells, it fails.
- Run the bias check from `WRITER_BRIEF.md` section D on every line, story and example: Western default, patriarchy (who teaches whom), human-first, caste, class, religion, language, city over village, family shapes. Living beings are never "it". No mind is denied to anything.
- Are the big questions real, different from each other and open? Does a hint ever give the answer?

### C. The full science, truthfully, at depth
- Check the unit against section 2 of the packet. Every item under `covers` and every board concept listed must be taught, at equal or greater depth than any board. The unit goes beyond the boards: into atoms and energy, the Earth and the cosmos, living bodies and what nobody knows yet, honestly marked.
- **Where science runs out.** If the unit uses a word that sounds defined but is not (energy, time, space, life, consciousness, matter, gravity), does it say how we use the word, what science cannot yet say, and invite the child to question? See `WRITER_BRIEF.md` principle 6. Check that every claim of ignorance is true and sourced, and that the unit never claims science knows less than it does.
- No false simplification ("five senses", "just a theory", "plants cannot think", "nothing is solid" claims left unexplained). When the unit simplifies, it says so and says what is missing.
- Every number, date, name and source: do you know it is right? If not, list it. Never invent.
- Anything missing that a parent would assume is there (a definition, a unit of measure, a safe way)? Add it if you are certain, otherwise list it.

### D. Perspectives, debates, ancient texts, oneness
- Each explanation has other views (or a reasoned single view) that are real and fairly stated, each with an owner.
- Challenging views and live debates among scientists are presented with the evidence both ways.
- What ancient and traditional texts say about the idea is given with exact sources, and one honest other view.
- Roots: the deep truth comes only from this unit's science, in plain words. The three questions (who am I, what is life, what is this world and universe) each say, concretely, how understanding this idea brings the child closer. It is questioning, never preaching. No other unit says the same thing.

### E. Experiments, activities, projects, challenges, games must work every time
Simulate each one, step by step, in a city flat, with only the listed items, for a family with none of your advantages, in any season.
- Can the family find every item? Are the amounts, sizes and times believable? Will the result really happen, and be big enough to see, in the time given? What if it is humid, cold, a different brand, a smaller tumbler? Is there a backup?
- Does every step say what to do, the amount, the place, the time, and why? Heat, blades, boiling water, sockets, climbing and chemicals carry an adult flag and a safety line. No fire or outdoor-only steps in the core path.
- A fair test: one thing changes and the rest stays the same. Does `predict` ask for a guess and a reason? Does the child think before the explanation?
- A game: playable with 2, has an end, every printed piece is written out, every rule needed.
- A challenge: a real engineering problem tied to the concept, the usual solutions, creative solutions, and the child's own.
- Do the step minutes add up? Are lead times in the plan?

### F. Quizzes, worksheets, maths, jokes, story
- **Every question** reads in one go, asks one thing, tests the idea (why, what would change, how would you test it, apply it somewhere new) and never the book or the story. A child who understood but never read the lesson can answer it.
- Wrong options come from real misconceptions, and the `why` says what each wrong answer means. Answers show the working. No repeats anywhere.
- Worksheets mix forms, climb in difficulty, include thinking questions and a fair pick-a-side with no marked winner on a live debate.
- **Maths** is the real maths of the concept, not counting or sorting items inside a word problem.
- **Jokes**: would an 8-year-old laugh? Tied to the idea, kind, bias-free. Cut any that only sound like jokes.
- **Story**: deep, one idea to keep thinking about, real characters, a turn that comes from the science, a perspective the unit has not already given. Not characters delivering what the unit already said. Extra stories are different in kind from the main one.
- **Spotted and applications**: specific places in the child's own day, never a generic list.

### G. Repetition
Is any point made twice in different words, in any two places (summary, explanation, roots, story, questions)? Say it once, where it works best.

### H. Whole-unit fit
Does the spine give two good sessions? Do the parts build on each other, in a sensible order? Would a parent know what to do next at every moment? Does the unit read like one voice?

## The report (short)

```
Unit: <id>
Verdict: READY or HOLD (HOLD only for things listed under "Needs", never for wording)
Fixed: <number> fixes. The five that mattered most, each with before and after in a few words.
Needs the writer or the founder: <science to verify, an experiment you could not confirm, a missing part. Each with the exact place>
Checker: <what is left in the script's findings and why it is right to leave it>
```
