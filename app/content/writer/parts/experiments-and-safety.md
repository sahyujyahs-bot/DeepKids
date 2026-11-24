# Card: experiments and safety

Read `app/content/WRITER_BRIEF.md` first. This card covers `experiments` (and the safety rules every hands-on part shares).

## What it holds
An experiment is a real investigation, written twice (parent mode and child mode). Fields: `id`, `title`, `mins`, `days`, `question`, `predict`, `fair_test`, `results_table`, `materials`, `safety`, `schedule`, `record`, `context`, `setup` (step pictures), `flow` (steps).
Every unit needs one **spine experiment**: 20 minutes or more, and the child does not know the result beforehand. A demonstration or an act-out does not count. Put its id in `plan.spine`.

## Rules
- **The child thinks first.** `predict` asks for a guess and the reason: "Guess which will land first. Say why you think so." The `say` never gives the explanation before the child has said what they think and what they saw.
- **After the test: claim, evidence, reasoning.** Class 1 and 2 say it out loud. Class 3 to 5 write it: what I think, what I saw, why.
- **A fair test is fair.** Say what changes, what stays the same, and how many tries ("three times, because one try can be a fluke").
- **Works in a city flat**, with things most homes have: steel tumblers, a torch, curd, a plastic bottle, newspaper, a potted plant. If something must be bought, give a home alternative. No garden, no stones, no creatures that may not turn up.
- **It really works.** Do it in your head with the amounts, sizes and times. If the result is too small to see, redesign it.
- **Every step has `kid` and `do` or `say`, and `mins`.** `kid` is at most 4 sentences of 12 words or fewer. `do` and `say` are 20 words or fewer per sentence.
- **`setup`:** 2 or more step pictures, each with a `caption` and a `scene` (`ramp` or `pull`) or an `art` brief.
- **A multi-day experiment** (`days` above 1) needs a `schedule` of 2 or more entries, and step minutes that add up.
- **Each check has `why`**, the explanation shown after any answer. A wrong option comes from a real misconception.
- **Truthful and open.** After the result, say what the test cannot tell us. If scientists disagree about what it means, say so and ask the child what else they would test.

## Safety
- Real hazards only: flame, heat, boiling water, sharp edges, glass, chemicals, mains electricity, sun in the eyes, small parts near under-5s, climbing. Put the safe way in `safety`.
- No hazard: leave `safety` out. Never write "Safety: none" or a warning for something harmless.
- Any step with heat, blades, scissors, boiling water, sockets, climbing or chemicals gets `"adult": true`, so the app asks the child to fetch a grown-up.
- Use plastic, never glass. Say what to do with food and water afterwards.
- A side warning sits in its own field, not inside the main step.

## Common mistakes
- A demonstration called an experiment (the child already knows what happens).
- `predict` asks only "what will happen?" with no reason.
- A step says "boil" or "cut" and has no `adult: true`.
- Steps that name a made-up child ("Kavya pours…"). Steps speak to the family: "Pour…".
- Step minutes that do not add up to the experiment's minutes.
- A results chart with no step pictures before it.
- Explaining the answer in the step before the child has tried.

## What the validator checks
Missing `question`, `predict`, `fair_test` or `results_table`; `predict` with no "why/because/reason"; fewer than 2 `setup` pictures; a multi-day experiment with no schedule; steps without `kid` or `say`/`do`, or without `mins`; a check without `why`; sentences too long; semicolons, "e.g.", "etc."; `safety` that says "none"; spine with no 20-minute experiment; steps with heat, blades or climbing and no `adult: true` (to do); sentences that deny a mind to a plant or animal (to do).
