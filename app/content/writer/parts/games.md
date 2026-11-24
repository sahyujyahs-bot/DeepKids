# Card: games

Read `app/content/WRITER_BRIEF.md` first. This card covers `games`. Full playtest rules: `app/content/units/PLAYTEST.md` (part A).

## What a game holds
`{id, title, mins, players, printables:[{kind, title, items}], rules[], flow:[step], setup}`.
- `printables.kind` is `cards`, `board`, `tokens` or `score sheet`.
- An item is text, or `{f, b}` (front and back: an answer, a size, a number), or `{f, img}` / `{f, b, img}` with a picture. `img` is `{src, credit}`, a file in `app/content/media/cards/`, public domain, CC0 or CC BY only, with credit.
- `flow` plays the printed game to the end, teaching and asking along the way, in parent mode (`say`, `do`) and child mode (`kid`).

## Rules
- **The printable is the real thing.** Every card, square and token is written out. "24 squares" means 24 listed squares. Never one line that only describes the printable.
- **The count in the title matches the items.**
- **What a card promises, it has.** If the rules say "the answer is on the back", every card is `{f, b}`. If they mention a picture, the cards have pictures.
- **Two players is enough** (a parent and a child). More players are an extra.
- **It has a clear end** and a winner, or a shared goal. Nobody gets stuck with no move. Every card and every rule does something. A pile that can run out says what happens then.
- **It teaches the idea, truthfully.** The game must follow the same science as the explanations. Never play a misconception as if it were right.
- **Cards carry the many views.** A good game has cards where two answers are both worth defending, or a round that asks "what would you test?".
- **No screen words on paper.** A printed game never says "tap".
- **Ordering and sorting sheets do not print the answer.** Do not print steps already in order.
- **A picture card needs a real picture**, free to use and credited. Otherwise do not mention a picture.
- **Steps speak to the family.** No made-up name in the rules or flow.
- **Do it in your head** with 2 players, then 4, before finishing.

## Common mistakes
- "48 cards" in the title with 12 listed.
- A card back promised and missing.
- A picture card with `img` but no credit, or a non-commercial or share-alike picture.
- A game with no ending.
- Rules that say "the app prints it" when no printable exists.
- A game that only quizzes: it should be a game first.

## What the validator checks
Games need `printables`; each printable item is text, `{f, img}` or `{f, b}` with both sides; the number in a printable's title matches its items; a mention of "picture" needs pictures; "tap" in a paper game; "the app prints it"; a flow with `kid` and `say`/`do` and `mins`; picture credits that are missing or non-commercial or share-alike; sentence length and plain punctuation; internal notes.
