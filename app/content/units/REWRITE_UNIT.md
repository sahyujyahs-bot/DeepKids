# Rewriting a unit: the brief for writers and checkers

The founder read the units and found the writing "random", "not like a human writing at all", with wrong words, sentences that mean nothing, wrong facts, experiments that can't work at home, and deep truths that are "wild, wrong, meaningless". This brief is how we fix every unit. Read it fully, then `app/content/WRITING.md` (all rules), `app/content/PHILOSOPHY.md` and `app/content/units/SPEC_UNIT.md`.

The bar is the way a clear teacher talks to a parent: direct statements of what is true, in natural English. The founder's own model sentence: "However strong the material might be, a small crack will grow and break the object. An object is only as strong as the crack it has." A fact, then what follows from it.

## The five checks, on every sentence and every activity

### 1. Does the sentence say something clear?
Ask: what fact or instruction is this? If you can't say it in a few words, rewrite it.

| Bad (real examples the founder rejected) | Why | Good |
|---|---|---|
| "In iron, millions of these tiny magnets point the same way in teams. That is where the pull comes from." | "teams" and "pull" hide the fact | "In a magnet, these tiny magnets all point the same way, so their forces add up." |
| "So what reached across that gap?" | a riddle; never answered | "The magnet never touched the pin. So how did it move it?" (and the unit answers it) |
| "Magnets: why they pull iron, from tiny electrons to the whole Earth" | a list squeezed into a title | "Magnets: how they attract iron without touching it" |
| "Materials aren't as strong as stuff" | meaningless | "However strong a material is, one small crack can grow and break it." |
| "This unit is about magnets." | stock line | start with the fact or the puzzle |

No riddles, no dramatic half-sentences, no clever images, no poetry where understanding is needed, no filler ("Let's explore", "Isn't that amazing?"), no formula pasted into every unit ("the One becoming the many").

### 2. Is it the right word?
Use the real term and explain it once, the first time: attract, repel, magnetic field, friction, force, evaporate, condense, photosynthesis, germinate, habitat, predator, organ, vibrate. Never swap it for a vague word ("pull" for attract, "stuff", "thing", "bits", "teams", "choosy", "wants"). Simple means clear, not vague.

### 3. Is the grammar right, and does it read like a person wrote it?
Correct grammar, natural word order, one idea per sentence, sentences that follow from each other. Read each paragraph aloud in your head as a parent reading to a child of 8. If it sounds strange, rewrite it. Don't repeat the same point in the next sentence.

### 4. Is it true?
Check every claim: what things are made of (most nails are steel, not iron; a fridge magnet is a ceramic made with iron oxide), dates, names, numbers, who discovered what, how a living thing behaves. If you are not sure and cannot check, leave it out or say plainly that it is uncertain. List anything unchecked in your report.

### 5. Will it work in a real Indian home, especially a city flat?
For every experiment, activity, game, project and challenge:
- **Materials:** most homes have them (steel bowls, curd, atta, salt, a torch, a plastic bottle, newspaper, a potted plant). If an item must be bought, it must be easy to buy in India, and the step gives a home alternative. Never depend on a specific product or brand (iron-fortified cereal), or on things only a garden has.
- **It really works:** with those materials the result really happens and is big enough for a child to see. Think it through physically: amounts, sizes, times, what you see. If the result depends on luck (finding woodlice under a stone, seeds sprouting in a cold room), redesign it, or say what to do if it fails.
- **Living things:** use ones that are nearly always there: ants, a crow at the window, a potted plant, curd, a sprouting seed, the child's own body. Never "find 8 woodlice".
- **Age and safety:** a 6–10-year-old can do it with the help the step says; `"adult": true` where needed.
- **Timings** match what the steps take.
- **Buy items:** every `buy` entry must be something a parent really needs and can get; otherwise remove it and use a home item.

## The deep truth and roots: think hard
The founder found these "wild, completely wrong, meaningless, senseless". A deep truth must be:
1. **True.** Every sentence would be accepted by a scientist as a correct statement of fact, or is our stance from PHILOSOPHY.md (everything is conscious; never deny a mind to anything), stated as plain fact like any science, never as "DeepKids believes".
2. **Drawn from this unit's science,** step by step, with no leap. A reader can see why the last sentence follows from the ones before.
3. **Something a child can check** with what they did in the unit.
4. **Plain.** At most 4 sentences, each under 20 words. No mysticism dressed as science, no slogans, no forced link to oneness.
5. **No word-play.** Never the shapes "So X is not Y, but Z", "not only… but", "feels like… but is really…", or a definition game ("'hard' only means…"). The founder rejected "Looking feels like reaching out… seeing is receiving" as meaningless. Start from what the child saw in their own test, then say plainly what follows.
6. **New.** Run `python3 app/build/deep_truths.py` and make sure it says something no other unit says.

Good example (magnets): "A steel needle can be a magnet one minute and not the next. Stroke it with a magnet, and its tiny magnets line up. Heat it red-hot, and they fall out of line. Nothing is added or taken away, so being a magnet is about arrangement, not material."

The rest of `roots` follows the same rules: the `thread` must say a real connection in plain words; each teaching's `link` must be honest, not forced (if a quote doesn't really fit, choose another or drop it); `other_view` is stated fairly; the `ask` questions grow out of the science, not morals.

## How to work
- Dump every text field of the unit with its JSON path (a small script), and read them all. Rewrite what fails. Keep correct content and structure; fix, don't pad.
- Also: the summary starts with the fact or puzzle (no "This unit is about"); the title says plainly what the unit is about; `how_we_found_out` exists (80–220 words, true story with a wrong idea and how it was shown wrong); `plan.spine` works in a city flat (WRITING.md rule 21) and has one real investigation.
- Keep the file's JSON style: `json.dumps(u, ensure_ascii=False, indent=1)`, no trailing newline. Then `python3 app/build/unit_to_md.py <json> <md>`. `python3 app/build/validate_unit.py <json>` must print OK.
- Put your scripts in your own folder under the scratchpad (the path you're given), never in a shared one. Touch only your unit's .json and .md. Don't run git.

## Report (short)
Title, new deep truth, the 5 most important fixes, any experiment or material you changed and why, and facts you could not check.
