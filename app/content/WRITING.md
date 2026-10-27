# How DeepKids writes

Two readers matter, and both are tired.

- **The parent** has worked all day, is reading on a phone, and has never studied this topic. They will read each line once, quickly, often while a child is pulling at their arm.
- **The child** is 6 to 10 and their attention is already drifting. The app reads to them, so every line must sound right spoken aloud.

If either of them has to stop and work out what we meant, we have failed. Depth stays; confusion goes.

## The rules

1. **Lead with the point.** The first sentence says what this is, or what to do. Background comes after, if at all.
2. **One idea per sentence.** Child text: 12 words or fewer per sentence. Parent text: 20 words or fewer. Split anything longer.
3. **Full sentences, never shorthand.** Not "Predict, test, record." Write "First, guess what will happen. Then try it. Then write down what happened."
4. **No reader is assumed to know anything.** Explain every science word the first time it appears, in plain words, with an everyday example: "Friction is the grip between two things that touch. It is why your chappal doesn't slip on the road."
5. **Never point at something the reader hasn't seen.** Don't write "like Hapu" or "Mery's first try" unless the story has just been read; if in doubt, say who Hapu is in a few words.
6. **Say exactly what to do.** Name the thing, the amount, the place and the time: "Put one shoe at the top of a tray. Lift that end slowly, about one finger-width each second."
7. **Say why each step matters.** "We try each shoe three times, because one try can be a fluke."
8. **Answers are full and show the working.** Not "3 times." Write "3 times. The shoe stayed on until 12 cm and the sock slid at 4 cm. 12 ÷ 4 = 3."
9. **Questions stand alone.** A question must make sense to someone who opens the app on that exact card.
10. **Plain punctuation.** No semicolons. No chains of colons. Few brackets. No slashes, "e.g.", "etc." or abbreviations (write "for example", "newtons" before "N").
11. **Concrete and Indian.** Chappals, steel tumblers, carrom boards, ghats, autos, the kitchen floor, before abstractions.
12. **Honest about doubt, in plain words.** "Scientists still argue about this. Here are the main ideas."
13. **Warm, not cute.** No baby talk, no forced jokes inside instructions. Talk to the child the way a kind, clear teacher would.
14. **Every card carries its own context.** People scroll, skip and come back days later. Each card opens with one plain line saying what this is and why it is here: "Remember the slope test, where you lifted a board until the shoe slid? Here are some made-up results." Never rely on the card before it.
15. **Show it, don't describe it.** If an answer is a chart, a table or a picture, the app shows the chart, the table or the picture.
16. **No poetry where understanding is needed.** Titles, summaries and explanations say literally what happens. Not "leaning on the air" but "wings push air down, and the air pushes them up". A picture-phrase is allowed only in the story, and only after the plain idea is clear.
17. **The child thinks first.** Before any explanation, the parent asks for a guess and a reason ("What do you think will happen? Why do you think so?"), waits for both, and lets the test answer it. The parent's `say` never gives the explanation before the child has said what they think and what they saw.
18. **No stock lines.** A summary never opens "This unit is about…": lead with the puzzle or the surprise. Don't reuse ready-made lines such as "Let's finish like real scientists". Say what actually happens next.
19. **Meaning comes from the science, not from morals.** A question about life grows out of what the child found ("If every creature senses a different world, which one is the real one?"), never a moral lesson stuck on ("Are you more like glass or rubber when life is hard?").
20. **Not only measuring.** Science is the philosophy of nature, not a science of measurements. Measuring is a tool for answering a question. At most half of a unit's maths problems are reading or adding up measurements; the rest reason with the numbers: compare, predict, spot a pattern, explain an odd result.
21. **It works in a city flat.** Everything in a unit's core path (`plan.spine`) must work for a family in an apartment, with things most Indian homes have: no garden, no park, no stones to lift, no creatures that may not turn up. If a living thing is needed, use one that is nearly always there: ants, a crow at the window, a potted plant, curd, a sprouting seed. Garden and park activities are welcome outside the spine, marked "if you have a garden or a park nearby".
22. **Say it the way you'd explain it to a friend.** Plain, direct sentences that a parent understands on first reading. No riddles, no dramatic half-sentences ("Something about you does not."), no clever images ("one thing wearing two faces"), no lists squeezed into one picture. Don't paste the same formula into every unit ("the One showing up as many"): say the actual connection for this topic. If a parent would ask "what does that mean?", rewrite it.
  - Not: "DeepKids believes stuff and energy are one thing wearing two faces, and both come from the One. Your weight changes from Earth to Moon. Something about you does not."
  - But: "On the Moon you would weigh less, because the Moon pulls you less. But you would still be made of exactly the same amount of stuff. DeepKids believes that stuff, and the energy inside it, both come from the same one source."

## Parent words and child words

- `say` is what the parent says out loud, word for word, as natural speech.
- `do` is what the parent does, as numbered, concrete actions.
- `parent` notes are for the parent only: what to expect, what good answers sound like, what to do if it doesn't work.
- `kid` speaks straight to the child: "you", present tense, at most four short sentences.

## Before and after

| Before | After |
|---|---|
| Predict, test, record, make a bar chart | First, guess which shoe will grip best. Then test each shoe on the slope. Write down how high the slope was when it slid. Last, draw a bar for each shoe. |
| Static (starting) friction is usually bigger than sliding friction. | It is harder to start pushing something than to keep it moving. Scientists call the grip that stops things starting "static friction". Once a thing is sliding, the grip is a little weaker. |
| 12 ÷ 4 = 3: the shoe stayed on a slope 3 times as high. | The shoe stayed put until the slope was 12 cm high. The sock slid at just 4 cm. 12 divided by 4 is 3. So the shoe stayed on a slope 3 times as steep. |

## Maths inside a science unit
Every maths problem must grow out of something the child did or saw in this unit, and say why the maths helps, in `why_maths`: "After a test you have a list of numbers. A bar chart shows the best at a glance." Never add maths just because the topic has numbers.

## Visuals

Every card should have something to look at. **Choose the visual by asking: what does the reader need to see to understand this card?** Never because numbers appear.

| The card is about… | Show |
|---|---|
| Doing something (an experiment, an activity, a step) | A **step picture**: the setup, drawn, in order. "Put the shoe on the board. Lift one end. Measure the height." |
| A question about an experiment or activity | That experiment's step pictures **first** (set `how` to its id), then the question |
| Reading an instrument | A drawing of the instrument (a `scale`) |
| Comparing results the reader already understands | A chart, after the step pictures |
| An idea you can't see (atoms, tides) | A zoom-in illustration or the explainer video |

**Never put a chart where the reader needs to know what was done.** A bar chart of slope heights means nothing to someone who has not seen a shoe on a lifted board.

```jsonc
// step pictures for an experiment (drawn by the app); scene: "ramp" (board lifted on books, ruler) or "pull" (object pulled with a forcemeter)
"setup": [{"scene": "ramp", "object": "shoe", "height": 0, "caption": "1. Put a shoe on a flat board."},
          {"scene": "ramp", "object": "shoe", "height": 6, "lift": true, "caption": "2. Lift one end slowly."},
          {"scene": "ramp", "object": "shoe", "height": 12, "ruler": true, "slide": true, "caption": "3. When the shoe slides, measure the height."}]
// any other step: {"art": "one-sentence picture description", "caption": "..."} (an illustration is made from the art brief)
// on a question about that experiment:  "how": "e1"
// charts (only to compare results, or for a graph question):
{"type": "bar",   "title": "...", "x": "Shoe", "y": "Height (cm)", "data": [{"label": "Rubber chappal", "value": 14, "emoji": "🩴"}]}
{"type": "line" | "pie" | "table" | "scale", ...}
```
Where visuals go: `setup` on every experiment, activity, project and challenge; `how` on any question, maths problem or step that refers to one; `chart` / `answer_chart` / `example_chart` only as the table above allows.
