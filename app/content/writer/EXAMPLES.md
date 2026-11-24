# Models to learn the feel from

Open a model to see how a finished lesson sounds. Do not copy its words. Read only the parts you are writing (for example `explanations`, `challenging`, `open_questions`). All pass the validator's errors. Where a model still has a small gap, the note says so: copy its strengths, not its gap.

| Level | File | Why it is a good model |
|---|---|---|
| Science L1 | `app/content/units/sci/sci.food.healthy-food.L1.json` | Three real ways of thinking about why we like the foods we like (babies' studies, feeding research, families and cooks across India). Big ideas are told in a young child's words without being cut. |
| Science L2 | `app/content/units/sci/sci.body.growing.L2.json` | An open debate a child can test: do we grow a little every day, or in sudden jumps? Names the researchers on each side and sets a measuring activity beside it. Summary is 2 sentences: make yours 3 to 5. |
| Science L3 | `app/content/units/sci/sci.body.keeping-balance.L3.json` | A hard idea (how the body keeps its warmth and water steady) with no age-gating. Perspectives name real scientists, and open questions say exactly why they are still open. Summary is 2 sentences: make yours 3 to 5. |
| Science L3 (physics) | `app/content/units/sci/sci.forces.flight.L3.json` | Four named perspectives on why a wing lifts, including the popular "equal time" story and why scientists gave it up. Shows how to retire a wrong idea without mocking it. |
| Science L4 | `app/content/units/sci/sci.ecology.interdependence.L4.json` | Debated and minority views given fairly (is a forest one body or many? do forests pull rain in?), each with evidence for and against. Add a `context` line to every card, which this one lacks. |
| Science L5 | `app/content/units/sci/sci.animals.animal-minds.L5.json` | The hardest honest question (do other animals feel?) with 6 explanations that give 2 or more perspectives, a `minority` and a `debated` challenge, and no denial of a mind. Add a `context` line to every card, which this one lacks. |
| Maths L1 | `app/content/units/math/math.maths-and-world.maths-in-nature.L1.json` | The maths threads in a six-year-old's words: patterns on vegetables, leaves and flowers, and "do other beings do maths?" as a real debate. Follow `MATHS.md`. |
| Maths L1 (number) | `app/content/units/math/math.addition-subtraction.number-facts.L1.json` | A child discovers "making ten" with beans before any rule, then asks why we chose ten and whether sums are chosen by anyone. |

## How to use them
1. Read the model's `summary`, `intro`, one `explanations` entry with `perspectives`, one `challenging` entry, and its `open_questions`.
2. Compare with your own. Is each `who` a real person or group? Does each side get its strongest case? Does the child get a question to think about, not an answer to remember?
3. Run `python3 app/build/validate_unit.py <your file>`.
