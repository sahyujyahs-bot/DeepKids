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

## Visuals

Every card should have something to look at: an illustration, a chart, a table or a drawn instrument. Use a `chart` wherever numbers appear.

```jsonc
{"type": "bar",   "title": "How high the slope went before each shoe slid", "x": "Shoe", "y": "Height (cm)",
 "data": [{"label": "Rubber chappal", "value": 14, "emoji": "🩴"}, {"label": "Sock", "value": 4, "emoji": "🧦"}]}
{"type": "line",  "title": "...", "x": "Time (seconds)", "y": "Pull (newtons)", "data": [{"label": "0", "value": 0}, {"label": "1", "value": 5}]}
{"type": "pie",   "title": "...", "data": [{"label": "Lost to friction", "value": 23}, {"label": "Everything else", "value": 77}]}
{"type": "table", "title": "...", "cols": ["Shoe", "Try 1", "Try 2"], "rows": [["Chappal", "14", "13"]]}
{"type": "scale", "title": "A forcemeter", "min": 0, "max": 10, "step": 0.5, "value": 5, "unit": "N"}
```
Where a chart can go: `chart` (shown with the question or the explanation) and `answer_chart` (shown with the answer) on explanations, agreed items, maths problems, worksheet and quiz items, flow steps and experiments (`example_chart` for made-up sample results).
