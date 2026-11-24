# Card: activities, projects and challenges

Read `app/content/WRITER_BRIEF.md` first. This card covers `activities`, `projects` and `challenges`. Experiments and safety are in `experiments-and-safety.md`.

## What they hold
- **Activity:** something to do or make in one sitting. Same shape as an experiment, without the fair test. Many per lesson.
- **Project:** the same, over several days (`days` above 1), with a `schedule` and a `record` (what the family keeps).
- **Challenge:** an engineering or design problem: `problem`, `constraints`, `materials`, `flow`, `general` (the usual solutions), `creative` (surprising ones), `your_turn` (the child's own).
All have `id`, `title`, `mins`, `materials` (`item`, `qty`, `buy`), `safety` if needed, `context`, `setup` and `flow`.

## Rules
- **Start from something the child can see or touch**, before any explanation.
- **One real thing to do, said exactly:** name the thing, the amount, the place and the time.
- **Say why each step matters.** "Wait one minute, because the colour needs time to spread."
- **Works in a city flat.** Garden and park activities are welcome, but only outside the spine, marked "if you have a garden or a park nearby".
- **A Level 1 child can do it too.** Younger children get the same big idea, with a simpler action: sorting, drawing, acting, comparing. Never hold an idea back for age.
- **Open ends.** Each ends with a question the child answers in their own way (`think`), not a worksheet. A challenge says there is more than one good answer.
- **Many ways of thinking.** In a challenge, `general` shows the usual solutions, `creative` the odd ones, and `your_turn` lets the child try a new one. Do not rank one as the true answer.
- **Not only measuring.** Activities also compare, sort, predict, draw, build, act, and ask "what would change if…".
- **Steps speak to the family**, never a made-up name. A name belongs in a story, or to a real scientist.
- **Every step:** `kid`, `do` or `say`, `mins`. Heat, blades, boiling water, sockets, climbing or chemicals: `"adult": true`.
- **No family is assumed.** Not every child has a grandmother or a sister at home. Say "an older relative, if you have one".
- **Minutes are real.** The step minutes add up to the part's minutes, and the day's total is doable.
- **Multi-day:** a `schedule` of 2 or more days, each with `day`, `mins`, `what`. "Stop watering for three days" means three days on the schedule.
- **Material buy list:** things from the `buy` list are named in `used_in` by element id.

## Common mistakes
- A project with `days` above 1 and no schedule.
- A challenge missing `general`, `creative` or `your_turn`.
- "Make a model of…" with no how, no amounts and no reason.
- An activity that is really a worksheet with a pencil.
- Needing a stone, a garden or a pet in the spine.
- The same activity repeated as a project and a game.

## What the validator checks
Every hands-on part needs a `setup` of 2 or more pictures with captions; a flow with `kid` and `say`/`do` and `mins`; multi-day parts need a schedule; challenges need `general`, `creative`, `your_turn`; `buy.used_in` must name real ids; duplicate ids; sentence length and plain punctuation; "the app prints it"; internal notes; steps with heat, blades or climbing and no `adult: true` (to do).
